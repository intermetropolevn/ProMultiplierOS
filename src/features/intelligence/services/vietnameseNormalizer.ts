// =========================================================================
// CAREER OS - VIETNAMESE DIACRITIC & INFORMAL TEXT NORMALIZER
// =========================================================================

export class VietnameseNormalizer {
  private static diacriticsMap: Record<string, string> = {
    'à': 'a', 'á': 'a', 'ả': 'a', 'ã': 'a', 'ạ': 'a',
    'ă': 'a', 'ằ': 'a', 'ắ': 'a', 'ẳ': 'a', 'ẵ': 'a', 'ặ': 'a',
    'â': 'a', 'ầ': 'a', 'ấ': 'a', 'ẩ': 'a', 'ẫ': 'a', 'ậ': 'a',
    'è': 'e', 'é': 'e', 'ẻ': 'e', 'ẽ': 'e', 'ẹ': 'e',
    'ê': 'e', 'ề': 'e', 'ế': 'e', 'ể': 'e', 'ễ': 'e', 'ệ': 'e',
    'ì': 'i', 'í': 'i', 'ỉ': 'i', 'ĩ': 'i', 'ị': 'i',
    'ò': 'o', 'ó': 'o', 'ỏ': 'o', 'õ': 'o', 'ọ': 'o',
    'ô': 'o', 'ồ': 'o', 'ố': 'o', 'ổ': 'o', 'ỗ': 'o', 'ộ': 'o',
    'ơ': 'o', 'ờ': 'o', 'ớ': 'o', 'ở': 'o', 'ỡ': 'o', 'ợ': 'o',
    'ù': 'u', 'ú': 'u', 'ủ': 'u', 'ũ': 'u', 'ụ': 'u',
    'ư': 'u', 'ừ': 'u', 'ứ': 'u', 'ử': 'u', 'ữ': 'u', 'ự': 'u',
    'ỳ': 'y', 'ý': 'y', 'ỷ': 'y', 'ỹ': 'y', 'ỵ': 'y',
    'đ': 'd',
    'À': 'A', 'Á': 'A', 'Ả': 'A', 'Ã': 'A', 'Ạ': 'A',
    'Ă': 'A', 'Ằ': 'A', 'Ắ': 'A', 'Ẳ': 'A', 'Ẵ': 'A', 'Ặ': 'A',
    'Â': 'A', 'Ầ': 'A', 'Ấ': 'A', 'Ẩ': 'A', 'Ẫ': 'A', 'Ậ': 'A',
    'È': 'E', 'É': 'E', 'Ẻ': 'E', 'Ẽ': 'E', 'Ẹ': 'E',
    'Ê': 'E', 'Ề': 'E', 'Ế': 'E', 'Ể': 'E', 'Ễ': 'E', 'Ệ': 'E',
    'Ì': 'I', 'Í': 'I', 'Ỉ': 'I', 'Ĩ': 'I', 'Ị': 'I',
    'Ò': 'O', 'Ó': 'O', 'Ỏ': 'O', 'Õ': 'O', 'Ọ': 'O',
    'Ô': 'O', 'Ồ': 'O', 'Ố': 'O', 'Ổ': 'O', 'Ỗ': 'O', 'Ộ': 'O',
    'Ơ': 'O', 'Ờ': 'O', 'Ớ': 'O', 'Ở': 'O', 'Ỡ': 'O', 'Ợ': 'O',
    'Ù': 'U', 'Ú': 'U', 'Ủ': 'U', 'Ũ': 'U', 'Ụ': 'U',
    'Ư': 'U', 'Ừ': 'U', 'Ứ': 'U', 'Ử': 'U', 'Ữ': 'U', 'Ự': 'U',
    'Ỳ': 'Y', 'Ý': 'Y', 'Ỷ': 'Y', 'Ỹ': 'Y', 'Ỵ': 'Y',
    'Đ': 'D'
  };

  /**
   * Strips Vietnamese diacritics while keeping Latin casing and alphanumeric characters
   */
  static removeDiacritics(text: string): string {
    if (!text) return '';
    return text
      .split('')
      .map(char => this.diacriticsMap[char] || char)
      .join('')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  /**
   * Checks whether the text contains native Vietnamese diacritics
   */
  static hasVietnameseDiacritics(text: string): boolean {
    const regex = /[àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]/i;
    return regex.test(text);
  }

  /**
   * Standardizes text for canonical entity matching:
   * - Lowercases
   * - Strips redundant whitespace
   * - Normalizes common punctuation
   */
  static clean(text: string): string {
    if (!text) return '';
    return text
      .toLowerCase()
      .replace(/[\r\n\t]+/g, ' ')
      .replace(/[.,/#!$%^&*;:{}=\-_`~()?"'’]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Generates a normalized search key (lowercase, no diacritics, clean spaces)
   */
  static toSearchKey(text: string): string {
    return this.clean(this.removeDiacritics(text));
  }

  /**
   * Standard normalized alias for search and retrieval matching
   */
  static normalizeText(text: string): string {
    return this.toSearchKey(text);
  }

  /**
   * Maps informal Vietnamese career expressions into standardized semantic tokens
   */
  static normalizeCareerSlang(text: string): string {
    let result = text;

    const replacements: [RegExp, string][] = [
      [/\bapply\s+job\b/gi, 'job application'],
      [/\bapply\s+vào\b/gi, 'apply to'],
      [/\bđang\s+apply\b/gi, 'applying for'],
      [/\bminh\s+dang\s+apply\b/gi, 'applying for'],
      [/\bbắt\s+làm\s+take\s*home\b/gi, 'take home assessment'],
      [/\btake-home\s+case\b/gi, 'take home case'],
      [/\bhọ\s+gửi\s+take\s*home\b/gi, 'sent take home case'],
      [/\bon\s+lai\b/gi, 'review study'],
      [/\bôn\s+lại\b/gi, 'review study'],
      [/\bluyện\b/gi, 'practice'],
      [/\bluyen\b/gi, 'practice'],
      [/\bthien\s+ve\b/gi, 'focused on'],
      [/\bthiên\s+về\b/gi, 'focused on'],
      [/\bkha\s+heavy\s+ve\b/gi, 'heavily emphasizes'],
      [/\bkhá\s+heavy\s+về\b/gi, 'heavily emphasizes'],
      [/\bresearch\s+nganh\b/gi, 'industry research'],
      [/\bresearch\s+ngành\b/gi, 'industry research'],
      [/\bbuild\s+framework\b/gi, 'structure framework'],
      [/\bstructure\s+theo\b/gi, 'structuring by'],
      [/\bco\s+nen\s+expand\s+vao\b/gi, 'should enter expand market'],
      [/\bcó\s+nên\s+expand\s+vào\b/gi, 'should enter expand market'],
      [/\btham\s+nhap\s+thi\s+truong\b/gi, 'market entry'],
      [/\bthâm\s+nhập\s+thị\s+trường\b/gi, 'market entry'],
      [/\bmo\s+rong\s+sang\s+thi\s+truong\b/gi, 'market expansion entry'],
      [/\bmở\s+rộng\s+sang\s+thị\s+trường\b/gi, 'market expansion entry']
    ];

    replacements.forEach(([regex, replacement]) => {
      result = result.replace(regex, replacement);
    });

    return result;
  }
}
