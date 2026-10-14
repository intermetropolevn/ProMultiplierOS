import { GoogleGenAI } from '@google/genai';
import { PDFParse } from 'pdf-parse';
import mammoth from 'mammoth';

// Lazy initialization of Gemini client
let aiClient: GoogleGenAI | null = null;
function getAI(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is not configured');
    }
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

export interface ExtractedExperience {
  company: string;
  role: string;
  dates: string;
  location?: string;
  summary: string;
  responsibilities: string[];
  achievements: string[];
  technologies: string[];
  sourceText?: string;
  extractionConfidence: number;
}

export interface ExtractedResumeResult {
  fullName: string;
  headline: string;
  contactEmail: string;
  location: string;
  summary: string;
  workExperiences: ExtractedExperience[];
  coreCompetences: string[];
  toolsAndStacks: string[];
  certifications?: string[];
  education?: Array<{
    institution: string;
    degree: string;
    dates: string;
  }>;
  validation: {
    isGrounded: boolean;
    overallConfidence: number;
    warnings: string[];
    needsReview: boolean;
    extractedFieldCount: number;
  };
  rawText: string;
}

/**
 * Extract raw text from uploaded document buffer based on file format.
 * Employs real text parser first, and multimodal OCR if document is image-based.
 */
export async function extractRawTextFromBuffer(
  buffer: Buffer,
  mimeType: string,
  fileName: string
): Promise<{ text: string; method: 'native_text' | 'ocr' | 'docx' | 'plain' }> {
  const lowerName = fileName.toLowerCase();

  // 1. Plain text / Markdown
  if (mimeType.includes('text') || lowerName.endsWith('.txt') || lowerName.endsWith('.md')) {
    const text = buffer.toString('utf-8').trim();
    return { text, method: 'plain' };
  }

  // 2. DOCX Word Document
  if (
    mimeType.includes('wordprocessingml') || 
    mimeType.includes('msword') || 
    lowerName.endsWith('.docx')
  ) {
    const result = await mammoth.extractRawText({ buffer });
    const text = (result.value || '').trim();
    if (text.length > 20) {
      return { text, method: 'docx' };
    }
  }

  // 3. PDF Document
  if (mimeType.includes('pdf') || lowerName.endsWith('.pdf')) {
    try {
      const parser = new PDFParse({ data: buffer });
      const textResult = await parser.getText();
      const parsedText = (textResult?.text || '').trim();
      await parser.destroy().catch(() => {});
      
      // If PDF has meaningful extracted text (> 60 characters), preserve it directly!
      if (parsedText.length > 60) {
        return { text: parsedText, method: 'native_text' };
      }
    } catch (err) {
      console.warn('pdf-parse could not read embedded text, falling back to Multimodal OCR', err);
    }

    // Scanned / Image-based PDF: Use Gemini 3.8 Flash multimodal OCR
    try {
      const ai = getAI();
      const base64 = buffer.toString('base64');
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: [
          {
            inlineData: {
              mimeType: 'application/pdf',
              data: base64
            }
          },
          'You are a high-accuracy Document OCR engine. Transcribe every line of text from this PDF resume document verbatim. Do not summarize, alter, omit, or invent any words. Return only the transcribed plain text.'
        ]
      });

      const ocrText = (response.text || '').trim();
      return { text: ocrText, method: 'ocr' };
    } catch (aiErr) {
      console.error('Gemini PDF OCR error:', aiErr);
      throw new Error('Failed to extract text from PDF document.');
    }
  }

  // 4. Image Formats (PNG, JPG, WEBP)
  if (
    mimeType.startsWith('image/') || 
    lowerName.endsWith('.png') || 
    lowerName.endsWith('.jpg') || 
    lowerName.endsWith('.jpeg') || 
    lowerName.endsWith('.webp')
  ) {
    try {
      const ai = getAI();
      const base64 = buffer.toString('base64');
      const imageMime = mimeType.startsWith('image/') ? mimeType : 'image/png';
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: [
          {
            inlineData: {
              mimeType: imageMime,
              data: base64
            }
          },
          'You are a high-accuracy Document OCR engine. Transcribe every line of text visible in this resume image verbatim. Do not summarize, rephrase, or invent anything. Return only the transcribed plain text.'
        ]
      });

      const ocrText = (response.text || '').trim();
      return { text: ocrText, method: 'ocr' };
    } catch (aiErr) {
      console.error('Gemini Image OCR error:', aiErr);
      throw new Error('Failed to perform OCR on resume image.');
    }
  }

  throw new Error(`Unsupported file type: ${mimeType || fileName}. Please upload a PDF, DOCX, TXT, or Image.`);
}

/**
 * Validates extracted structured data against raw source text.
 */
function validateExtractionAgainstSource(
  rawText: string,
  structured: any
): {
  isGrounded: boolean;
  overallConfidence: number;
  warnings: string[];
  needsReview: boolean;
  extractedFieldCount: number;
} {
  const warnings: string[] = [];
  const normalizedRaw = rawText.toLowerCase();

  let matchedChecks = 0;
  let totalChecks = 0;

  // 1. Check Full Name
  if (structured.fullName) {
    totalChecks++;
    const nameParts = structured.fullName.toLowerCase().split(/\s+/);
    const foundPart = nameParts.some((part: string) => part.length > 2 && normalizedRaw.includes(part));
    if (foundPart) {
      matchedChecks++;
    } else {
      warnings.push(`Candidate name "${structured.fullName}" could not be confirmed in the source document.`);
    }
  }

  // 2. Check Work Experiences
  const experiences = structured.workExperiences || [];
  experiences.forEach((exp: any, index: number) => {
    // Check company
    if (exp.company) {
      totalChecks++;
      const compClean = exp.company.toLowerCase().replace(/[^a-z0-9]/g, '');
      const rawClean = normalizedRaw.replace(/[^a-z0-9]/g, '');
      if (rawClean.includes(compClean) || normalizedRaw.includes(exp.company.toLowerCase())) {
        matchedChecks++;
      } else {
        warnings.push(`Company "${exp.company}" for role "${exp.role || index + 1}" was not found verbatim in source.`);
      }
    }

    // Check role
    if (exp.role) {
      totalChecks++;
      const roleParts = exp.role.toLowerCase().split(/\s+/).filter((w: string) => w.length > 3);
      const foundRoleWord = roleParts.some((w: string) => normalizedRaw.includes(w));
      if (foundRoleWord) {
        matchedChecks++;
      } else {
        warnings.push(`Job title "${exp.role}" was not matched in source document.`);
      }
    }
  });

  // Calculate overall confidence
  const groundingRatio = totalChecks > 0 ? (matchedChecks / totalChecks) : 0.8;
  const overallConfidence = Math.round(Math.max(40, Math.min(99, groundingRatio * 100)));
  const needsReview = warnings.length > 0 || overallConfidence < 85;

  return {
    isGrounded: warnings.length === 0,
    overallConfidence,
    warnings,
    needsReview,
    extractedFieldCount: totalChecks
  };
}

/**
 * Extracts structured schema from raw text using Gemini 3.8 Flash with strict anti-hallucination instructions.
 */
export async function extractStructuredResume(rawText: string): Promise<ExtractedResumeResult> {
  if (!rawText || rawText.trim().length < 20) {
    throw new Error('Extracted resume text is too short or empty. Please ensure the document is legible.');
  }

  const ai = getAI();

  const prompt = `You are a strict Resume Extraction Engine.
Analyze the following RAW RESUME TEXT and extract structured fields in JSON format.

CRITICAL DIRECTIVES:
1. Extract ONLY information that is explicitly stated in the source text.
2. DO NOT invent, hallucinate, extrapolate, or embellish ANY metric, company name, job title, date, location, or achievement.
3. If a number, percentage, or dollar amount is NOT written in the source text, DO NOT invent one.
4. If a field cannot be found or is ambiguous, leave it as null or an empty array.
5. Every responsibility and achievement must be grounded directly in the provided text.
6. Return ONLY a valid JSON object matching this exact structure:

{
  "fullName": "Full name or empty string",
  "headline": "Professional title/headline or empty string",
  "contactEmail": "Email address or empty string",
  "location": "Location or empty string",
  "summary": "Executive summary from resume or empty string",
  "workExperiences": [
    {
      "company": "Exact company name from resume",
      "role": "Exact job title from resume",
      "dates": "Exact employment period (e.g. 2022 — Present or Jan 2021 - Mar 2023)",
      "location": "Location if specified",
      "summary": "Brief 1-sentence summary of the role based purely on the text",
      "responsibilities": ["Verbatim responsibility 1", "Verbatim responsibility 2"],
      "achievements": ["Verbatim achievement with any real metrics mentioned in source"],
      "technologies": ["Tools and technologies explicitly mentioned in this role"],
      "sourceText": "A 1-3 line exact excerpt from the resume describing this position",
      "extractionConfidence": 95
    }
  ],
  "coreCompetences": ["Explicitly mentioned conceptual skills like Distributed Systems, Architecture, Project Leadership"],
  "toolsAndStacks": ["Explicitly mentioned technologies and tools like PostgreSQL, Kafka, Python, AWS"],
  "certifications": ["Certifications mentioned in source"],
  "education": [
    {
      "institution": "University/School",
      "degree": "Degree",
      "dates": "Dates"
    }
  ]
}

RAW RESUME TEXT:
"""
${rawText}
"""`;

  const response = await ai.models.generateContent({
    model: 'gemini-3.8-flash',
    contents: prompt,
    config: {
      responseMimeType: 'application/json'
    }
  });

  const responseText = response.text || '{}';
  let structured: any;
  try {
    structured = JSON.parse(responseText);
  } catch (parseErr) {
    console.error('Failed to parse Gemini JSON output', parseErr, responseText);
    throw new Error('Extraction engine did not return valid structured data. Please try again.');
  }

  // Run grounding and source validation
  const validation = validateExtractionAgainstSource(rawText, structured);

  return {
    fullName: structured.fullName || '',
    headline: structured.headline || '',
    contactEmail: structured.contactEmail || '',
    location: structured.location || '',
    summary: structured.summary || '',
    workExperiences: (structured.workExperiences || []).map((exp: any, index: number) => ({
      company: exp.company || 'Unknown Organization',
      role: exp.role || 'Professional Role',
      dates: exp.dates || 'Dates not specified',
      location: exp.location || '',
      summary: exp.summary || '',
      responsibilities: Array.isArray(exp.responsibilities) ? exp.responsibilities : [],
      achievements: Array.isArray(exp.achievements) ? exp.achievements : [],
      technologies: Array.isArray(exp.technologies) ? exp.technologies : [],
      sourceText: exp.sourceText || '',
      extractionConfidence: typeof exp.extractionConfidence === 'number' ? exp.extractionConfidence : 90
    })),
    coreCompetences: Array.isArray(structured.coreCompetences) ? structured.coreCompetences : [],
    toolsAndStacks: Array.isArray(structured.toolsAndStacks) ? structured.toolsAndStacks : [],
    certifications: Array.isArray(structured.certifications) ? structured.certifications : [],
    education: Array.isArray(structured.education) ? structured.education : [],
    validation,
    rawText
  };
}
