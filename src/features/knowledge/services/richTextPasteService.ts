import TurndownService from 'turndown';

// Configure Turndown for high-fidelity markdown extraction from rich clipboard HTML
const turndownService = new TurndownService({
  headingStyle: 'atx',
  hr: '---',
  bulletListMarker: '-',
  codeBlockStyle: 'fenced',
  emDelimiter: '*',
  strongDelimiter: '**',
});

// Rule: Preserve paragraphs with natural double newlines
turndownService.addRule('paragraph', {
  filter: 'p',
  replacement: function (content) {
    const trimmed = content.trim();
    return trimmed ? '\n\n' + trimmed + '\n\n' : '\n';
  }
});

// Rule: Handle line breaks
turndownService.addRule('lineBreak', {
  filter: 'br',
  replacement: function () {
    return '\n';
  }
});

// Rule: Handle div lines (common in Google Docs and contenteditable)
turndownService.addRule('divLine', {
  filter: function (node) {
    return node.nodeName === 'DIV' && !node.querySelector('p, div, ul, ol, h1, h2, h3, h4, h5, h6');
  },
  replacement: function (content) {
    const trimmed = content.trim();
    return trimmed ? '\n' + trimmed + '\n' : '\n';
  }
});

/**
 * Checks if HTML string has meaningful rich markup (headings, lists, bold, etc.)
 */
function hasRichHtmlMarkup(html: string): boolean {
  if (!html) return false;
  // Look for semantic tags
  const richTags = /<(h[1-6]|ul|ol|li|strong|b|em|i|blockquote|pre|code|p|br|table)[\s>]/i;
  return richTags.test(html);
}

/**
 * Converts rich clipboard data (HTML or plain text) into structured markdown,
 * preserving paragraphs, headings, bullet/numbered lists, bold, italics,
 * Vietnamese diacritics, and symbols.
 */
export function convertClipboardToStructuredMarkdown(
  htmlData: string,
  plainTextData: string
): string {
  // If rich HTML is present with actual tags, use Turndown
  if (htmlData && hasRichHtmlMarkup(htmlData)) {
    try {
      // Clean up common quirks like zero-width spaces or non-breaking spaces
      const sanitizedHtml = htmlData
        .replace(/&nbsp;/g, ' ')
        .replace(/\u00A0/g, ' ')
        .replace(/<!--[\s\S]*?-->/g, ''); // Remove comments (like Word/Office comments)

      const markdown = turndownService.turndown(sanitizedHtml);
      // Clean up excessive blank lines (more than 2 consecutive newlines)
      const normalized = markdown
        .replace(/\r\n/g, '\n')
        .replace(/\n{3,}/g, '\n\n')
        .trim();

      if (normalized.length > 0) {
        return normalized;
      }
    } catch (err) {
      console.warn('Failed to parse rich HTML clipboard data with Turndown, falling back to plaintext', err);
    }
  }

  // Fallback to structured plain text
  if (plainTextData) {
    // Normalize newlines, keep indentation for nested bullets
    return plainTextData
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n');
  }

  return '';
}
