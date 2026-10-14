// =========================================================================
// CAREER OS - MULTI-LEVEL LANGUAGE & CODE-SWITCHING DETECTOR
// =========================================================================

import { LanguageDetectionResult, SupportedLanguage } from '../types';
import { VietnameseNormalizer } from './vietnameseNormalizer';

export class LanguageDetector {
  // Vietnamese stop words and characteristic grammatical markers
  private static viGrammarMarkers = new Set([
    'minh', 'mình', 'dang', 'đang', 'can', 'cần', 'o', 'ở', 'mot', 'một',
    've', 'về', 'co', 'có', 'nen', 'nên', 'chu', 'chứ', 'khong', 'không',
    'phai', 'phải', 'cho', 'de', 'để', 'giup', 'giúp', 'bi', 'bị', 'duoc',
    'được', 'voi', 'với', 'cua', 'của', 'tai', 'tại', 'trong', 'nhu', 'như',
    'the', 'thế', 'nao', 'nào', 'sao', 'tai', 'tại', 'la', 'là', 'ma', 'mà',
    'neu', 'nếu', 'thi', 'thì', 'rat', 'rất', 'qua', 'quá', 'nhieu', 'nhiều',
    'it', 'ít', 'se', 'sẽ', 'da', 'đã', 'chua', 'chưa', 'boi', 'bởi', 'cung',
    'cũng', 'hay', 'hoac', 'hoặc', 'nhung', 'nhưng', 'yeu', 'yêu', 'cau', 'cầu',
    'phan', 'phân', 'tich', 'tích', 'doi', 'đối', 'thu', 'thủ', 'thi', 'thị',
    'truong', 'trường', 'loi', 'lợi', 'nhuan', 'nhuận', 'uoc', 'ước', 'luong',
    'lượng', 'tinh', 'tính', 'quy', 'mo', 'mô', 'hoi', 'hỏi', 'on', 'ôn',
    'luyen', 'luyện'
  ]);

  // English functional words
  private static enGrammarMarkers = new Set([
    'the', 'is', 'are', 'was', 'were', 'for', 'and', 'to', 'in', 'at', 'of',
    'with', 'should', 'how', 'what', 'why', 'can', 'could', 'would', 'will',
    'from', 'by', 'about', 'as', 'into', 'which', 'their', 'our', 'my', 'your',
    'not', 'but', 'or', 'if', 'then', 'because', 'such', 'this', 'that', 'these',
    'those', 'between', 'under', 'over', 'through', 'also', 'further', 'more'
  ]);

  // Common English domain terms frequently borrowed into Vietnamese speech (code-switching)
  private static borrowedDomainTerms = new Set([
    'market', 'sizing', 'strategy', 'strategic', 'competitor', 'landscape',
    'unit', 'economics', 'cac', 'ltv', 'payback', 'nrr', 'arr', 'mrr',
    'take', 'home', 'case', 'apply', 'job', 'prep', 'review', 'discovery',
    'roadmap', 'stakeholder', 'framework', 'mece', 'structure', 'growth',
    'pricing', 'fintech', 'saas', 'tam', 'sam', 'som', 'recommendation',
    'bottleneck', 'demand', 'supply', 'segment', 'beachhead', 'icp'
  ]);

  static detect(text: string): LanguageDetectionResult {
    if (!text || text.trim().length === 0) {
      return {
        dominantLanguage: 'en',
        confidence: 0.5,
        isMixedLanguage: false,
        codeSwitchingDetected: false,
        vietnameseRatio: 0,
        englishRatio: 0,
        hasDiacritics: false,
        segments: []
      };
    }

    const hasDiacritics = VietnameseNormalizer.hasVietnameseDiacritics(text);
    const cleanedText = VietnameseNormalizer.clean(text);
    const words = cleanedText.split(/\s+/).filter(Boolean);

    let viWordCount = 0;
    let enWordCount = 0;
    let borrowedTermCount = 0;

    const segments: {
      text: string;
      language: 'vi' | 'en';
      type: 'domain_term' | 'slang' | 'general';
    }[] = [];

    words.forEach(rawWord => {
      const word = rawWord.toLowerCase();
      const noDiacritics = VietnameseNormalizer.removeDiacritics(word);

      const isVi = this.viGrammarMarkers.has(word) || this.viGrammarMarkers.has(noDiacritics);
      const isEn = this.enGrammarMarkers.has(word);
      const isDomain = this.borrowedDomainTerms.has(word);

      if (isDomain) {
        borrowedTermCount++;
        segments.push({ text: rawWord, language: 'en', type: 'domain_term' });
      } else if (isVi) {
        viWordCount++;
        segments.push({ text: rawWord, language: 'vi', type: 'general' });
      } else if (isEn) {
        enWordCount++;
        segments.push({ text: rawWord, language: 'en', type: 'general' });
      } else {
        // Unknown word, evaluate diacritics
        if (VietnameseNormalizer.hasVietnameseDiacritics(rawWord)) {
          viWordCount++;
          segments.push({ text: rawWord, language: 'vi', type: 'general' });
        } else {
          segments.push({ text: rawWord, language: 'en', type: 'general' });
        }
      }
    });

    const totalTracked = viWordCount + enWordCount + borrowedTermCount || 1;
    const viRatio = viWordCount / totalTracked;
    const enRatio = (enWordCount + borrowedTermCount) / totalTracked;

    // Code-switching logic: Vietnamese syntax combined with borrowed English domain terms
    const codeSwitchingDetected = (viWordCount >= 2 && borrowedTermCount >= 1) ||
                                 (viWordCount >= 1 && enWordCount >= 2 && borrowedTermCount >= 1);

    let dominantLanguage: SupportedLanguage = 'en';
    let isMixedLanguage = false;

    if (codeSwitchingDetected || (viWordCount >= 2 && enWordCount >= 2)) {
      dominantLanguage = 'mixed';
      isMixedLanguage = true;
    } else if (viWordCount > enWordCount + borrowedTermCount || (hasDiacritics && viWordCount >= enWordCount)) {
      dominantLanguage = 'vi';
      if (borrowedTermCount > 0) {
        isMixedLanguage = true;
      }
    } else if (enWordCount >= viWordCount) {
      dominantLanguage = 'en';
      if (viWordCount > 0) {
        isMixedLanguage = true;
      }
    }

    // Special check for no-diacritic Vietnamese sentences (e.g. "Minh dang apply job PM...")
    if (dominantLanguage === 'en' && !hasDiacritics) {
      const sampleTokens = words.slice(0, 10).map(w => VietnameseNormalizer.removeDiacritics(w));
      const viMatches = sampleTokens.filter(t => this.viGrammarMarkers.has(t)).length;
      if (viMatches >= 2) {
        dominantLanguage = borrowedTermCount > 0 ? 'mixed' : 'vi';
        isMixedLanguage = borrowedTermCount > 0;
      }
    }

    const confidence = Math.min(
      0.99,
      Math.max(0.65, (Math.abs(viWordCount - enWordCount) + borrowedTermCount) / (totalTracked + 2) + 0.5)
    );

    return {
      dominantLanguage,
      confidence: Number(confidence.toFixed(2)),
      isMixedLanguage,
      codeSwitchingDetected,
      vietnameseRatio: Number(viRatio.toFixed(2)),
      englishRatio: Number(enRatio.toFixed(2)),
      hasDiacritics,
      segments
    };
  }
}
