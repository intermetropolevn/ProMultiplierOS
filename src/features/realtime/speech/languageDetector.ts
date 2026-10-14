import { DetectedLanguage, SpeechLanguageDetails, LanguageProportions } from './types';

const VIETNAMESE_ACCENT_REGEX = /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ]/i;

const VIETNAMESE_COMMON_WORDS = new Set([
  'em', 'anh', 'chị', 'mình', 'tôi', 'bạn', 'chúng', 'ta', 'này', 'đó', 
  'thì', 'là', 'mà', 'với', 'trong', 'về', 'khi', 'nếu', 'nhưng', 'bởi', 
  'vì', 'tuy', 'nhiên', 'cũng', 'đã', 'sẽ', 'đang', 'được', 'cho', 'làm', 
  'xử', 'lý', 'dự', 'án', 'đội', 'ngũ', 'kiến', 'trúc', 'hệ', 'thống', 
  'dữ', 'liệu', 'quy', 'trình', 'khách', 'hàng', 'bài', 'toán', 'công', 'nghệ',
  'sau', 'rồi', 'trước', 'tiên', 'như', 'thế', 'nào', 'các', 'phải', 'hay',
  'của', 'ở', 'tại', 'vào', 'ra', 'có', 'không', 'gì', 'sao', 'nhiều', 'ít'
]);

const ENGLISH_COMMON_WORDS = new Set([
  'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i', 
  'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at', 
  'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 
  'she', 'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 
  'their', 'what', 'so', 'up', 'out', 'if', 'about', 'who', 'get', 
  'which', 'go', 'me', 'when', 'make', 'can', 'like', 'time', 'no', 
  'just', 'him', 'know', 'take', 'people', 'into', 'year', 'your', 
  'good', 'some', 'could', 'them', 'see', 'other', 'than', 'then', 
  'now', 'look', 'only', 'come', 'its', 'over', 'think', 'also',
  'first', 'activation', 'funnel', 'compare', 'retention', 'cohort',
  'metrics', 'user', 'users', 'product', 'design', 'engineering', 'sales',
  'leadership', 'team', 'feature', 'backlog', 'prioritize', 'stakeholders'
]);

/**
 * Calculates language detection with bilingual / code-switching detection
 * and percentage breakdown (e.g. EN 64% • VI 36%)
 */
export function detectSpokenLanguageDetails(text: string): SpeechLanguageDetails {
  const normalized = text.toLowerCase().trim();
  if (!normalized) {
    return {
      primary: 'English',
      code: 'en',
      isCodeSwitching: false,
      displayBadge: 'English',
    };
  }

  const hasToneMarks = VIETNAMESE_ACCENT_REGEX.test(normalized);
  const words = normalized
    .replace(/[^a-zA-Zà-ỹÀ-Ỹ\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length >= 1);

  let vietnameseMatches = 0;
  let englishMatches = 0;

  for (const word of words) {
    const isVietnamese = VIETNAMESE_COMMON_WORDS.has(word) || VIETNAMESE_ACCENT_REGEX.test(word);
    if (isVietnamese) {
      vietnameseMatches++;
    } else if (ENGLISH_COMMON_WORDS.has(word) || /^[a-z]{3,}$/.test(word)) {
      englishMatches++;
    }
  }

  const totalLanguageWords = vietnameseMatches + englishMatches;

  // Code-switching detection (Bilingual)
  // e.g.: "Em would first look at the activation funnel, sau đó compare retention by cohort."
  const isBilingual = 
    (vietnameseMatches >= 1 && englishMatches >= 2) || 
    (hasToneMarks && englishMatches >= 2) ||
    (vietnameseMatches >= 1 && englishMatches >= 1 && totalLanguageWords >= 2);

  if (isBilingual && totalLanguageWords > 0) {
    const rawEnPct = Math.round((englishMatches / totalLanguageWords) * 100);
    const enPct = Math.min(85, Math.max(15, rawEnPct));
    const viPct = 100 - enPct;

    const breakdown: LanguageProportions = {
      englishPct: enPct,
      vietnamesePct: viPct,
    };

    return {
      primary: 'Bilingual',
      code: 'bilingual',
      breakdown,
      isCodeSwitching: true,
      displayBadge: `EN ${enPct}% • VI ${viPct}%`,
    };
  }

  // Pure Vietnamese
  if (vietnameseMatches >= 2 || (hasToneMarks && englishMatches <= 1)) {
    return {
      primary: 'Vietnamese',
      code: 'vi',
      breakdown: { englishPct: 0, vietnamesePct: 100 },
      isCodeSwitching: false,
      displayBadge: 'Vietnamese',
    };
  }

  // Default English
  return {
    primary: 'English',
    code: 'en',
    breakdown: { englishPct: 100, vietnamesePct: 0 },
    isCodeSwitching: false,
    displayBadge: 'English',
  };
}

/**
 * Backward compatibility with legacy callers
 */
export function detectSpokenLanguage(text: string): DetectedLanguage {
  const details = detectSpokenLanguageDetails(text);
  return details.code;
}
