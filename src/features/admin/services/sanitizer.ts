/**
 * Security & Sanitization Utilities
 * Protects against SSRF, arbitrary external crawling, malicious HTML payloads, and script injections.
 */

export interface SSRFValidationResult {
  allowed: boolean;
  reason?: string;
  normalizedUrl?: string;
}

// Check IPv4 private and link-local ranges
function isPrivateIPv4(ip: string): boolean {
  const parts = ip.split('.').map(p => parseInt(p, 10));
  if (parts.length !== 4 || parts.some(isNaN)) return false;

  // 10.0.0.0/8
  if (parts[0] === 10) return true;

  // 172.16.0.0/12
  if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true;

  // 192.168.0.0/16
  if (parts[0] === 192 && parts[1] === 168) return true;

  // 127.0.0.0/8 (loopback)
  if (parts[0] === 127) return true;

  // 0.0.0.0/8
  if (parts[0] === 0) return true;

  // 169.254.0.0/16 (link-local, cloud metadata 169.254.169.254)
  if (parts[0] === 169 && parts[1] === 254) return true;

  // 100.64.0.0/10 (CGNAT)
  if (parts[0] === 100 && parts[1] >= 64 && parts[1] <= 127) return true;

  return false;
}

/**
 * Validates whether a target URL is safe from SSRF attacks and matches allowed protocols
 */
export function validateUrlForSSRF(rawUrl: string, allowedHostnames?: string[]): SSRFValidationResult {
  if (!rawUrl || typeof rawUrl !== 'string') {
    return { allowed: false, reason: 'Empty or invalid URL input' };
  }

  try {
    const parsed = new URL(rawUrl.trim());

    // Protocol check - only HTTP and HTTPS
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return { 
        allowed: false, 
        reason: `Forbidden protocol: ${parsed.protocol}. Only http: and https: are allowed.` 
      };
    }

    const hostname = parsed.hostname.toLowerCase();

    // Block common loopback names
    if (
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname === '0.0.0.0' ||
      hostname === '::1' ||
      hostname === '[::1]' ||
      hostname.endsWith('.localhost') ||
      hostname.endsWith('.internal') ||
      hostname.endsWith('.local')
    ) {
      return { allowed: false, reason: `Disallowed loopback or local hostname: ${hostname}` };
    }

    // Check direct IPv4
    if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(hostname)) {
      if (isPrivateIPv4(hostname)) {
        return { allowed: false, reason: `Disallowed private or link-local IP address: ${hostname}` };
      }
    }

    // Check Cloud Metadata hostname aliases
    if (
      hostname.includes('169.254.169.254') ||
      hostname.includes('metadata.google.internal') ||
      hostname.includes('instance-data')
    ) {
      return { allowed: false, reason: 'Cloud metadata service access prohibited' };
    }

    // If source has allowed hostnames, ensure it matches
    if (allowedHostnames && allowedHostnames.length > 0) {
      const isAllowedHost = allowedHostnames.some(allowed => 
        hostname === allowed.toLowerCase() || hostname.endsWith(`.${allowed.toLowerCase()}`)
      );
      if (!isAllowedHost) {
        return { 
          allowed: false, 
          reason: `Target host "${hostname}" is outside registered source host allowlist.` 
        };
      }
    }

    return { 
      allowed: true, 
      normalizedUrl: parsed.toString() 
    };
  } catch (err: any) {
    return { allowed: false, reason: `Malformed URL: ${err.message}` };
  }
}

/**
 * Sanitizes external untrusted HTML text.
 * Strips script tags, unsafe iframes, event handlers, and dangerous protocols.
 */
export function sanitizeHtmlContent(inputHtml: string): string {
  if (!inputHtml || typeof inputHtml !== 'string') return '';

  return inputHtml
    // Remove script tags and contents
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // Remove style tags
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    // Remove iframes, objects, embeds
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    .replace(/<embed\b[^>]*>/gi, '')
    // Remove inline on* event handlers (onclick, onload, onerror, etc.)
    .replace(/\s+on[a-z]+=["'][^"']*["']/gi, '')
    .replace(/\s+on[a-z]+=[^ >]+/gi, '')
    // Remove javascript: and data: in href or src
    .replace(/href=["']\s*javascript:[^"']*["']/gi, 'href="#"')
    .replace(/src=["']\s*javascript:[^"']*["']/gi, 'src=""')
    .replace(/href=["']\s*data:[^"']*["']/gi, 'href="#"');
}

/**
 * Generates a standard content hash for deduplication
 */
export function generateContentHash(content: string): string {
  let hash = 0;
  if (!content || content.length === 0) return '0';
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(16);
}
