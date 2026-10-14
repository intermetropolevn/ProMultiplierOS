// =========================================================================
// CAREER OS - CROSS-LANGUAGE SEMANTIC RETRIEVER & RANKER
// =========================================================================

import { 
  MultilingualRetrievalResult, 
  ParsedCareerIntent, 
  SupportedLanguage 
} from '../types';
import { CareerSemanticParser } from './careerSemanticParser';
import { VietnameseNormalizer } from './vietnameseNormalizer';
import { knowledgeStore } from '../../knowledge/services/knowledgeStore';
import { industryStore } from '../../industry/services/industryStore';
import { CASES_DATA } from '../../../data/casesData';

export class CrossLanguageRetriever {
  /**
   * Retrieves cross-language relevant resources based on a query or parsed intent
   */
  static retrieve(
    queryOrIntent: string | ParsedCareerIntent,
    limit: number = 10
  ): MultilingualRetrievalResult[] {
    const intent: ParsedCareerIntent = typeof queryOrIntent === 'string'
      ? CareerSemanticParser.parse(queryOrIntent)
      : queryOrIntent;

    const results: MultilingualRetrievalResult[] = [];
    const canonicalIds = new Set([
      ...(intent.role ? [intent.role.canonicalId] : []),
      ...(intent.caseType ? [intent.caseType.canonicalId] : []),
      ...intent.skills.map(s => s.canonicalId),
      ...intent.knowledge.map(k => k.canonicalId),
      ...intent.industries.map(i => i.canonicalId),
      ...intent.metrics.map(m => m.canonicalId)
    ]);

    const queryTerms = VietnameseNormalizer.toSearchKey(intent.originalQuery).split(/\s+/).filter(w => w.length > 2);

    // 1. Search Knowledge Units
    const knowledgeUnits = knowledgeStore.getKnowledgeUnits();
    knowledgeUnits.forEach(unit => {
      let score = 0;
      const reasons: string[] = [];

      // Check skill overlap
      const matchedSkills = unit.skills.filter(s => 
        intent.skills.some(is => is.canonicalName.toLowerCase() === s.toLowerCase() || s.toLowerCase().includes(is.canonicalName.toLowerCase()))
      );
      if (matchedSkills.length > 0) {
        score += 35 * matchedSkills.length;
        reasons.push(`Directly targets skill: ${matchedSkills.join(', ')}`);
      }

      // Check title / summary matching
      const unitKey = VietnameseNormalizer.toSearchKey(`${unit.title} ${unit.summary}`);
      const termHits = queryTerms.filter(term => unitKey.includes(term));
      if (termHits.length > 0) {
        score += Math.min(30, termHits.length * 10);
        reasons.push(`Matches search terms (${termHits.slice(0, 3).join(', ')})`);
      }

      // Check canonical knowledge alignment
      if (
        (canonicalIds.has('knowledge_tam_sam_som') && unit.id.includes('tam')) ||
        (canonicalIds.has('knowledge_unit_economics') && (unit.id.includes('economics') || unit.title.toLowerCase().includes('economics'))) ||
        (canonicalIds.has('knowledge_market_entry') && (unit.id.includes('entry') || unit.title.toLowerCase().includes('entry'))) ||
        (canonicalIds.has('skill_market_sizing') && unit.skills.some(s => s.toLowerCase().includes('market')))
      ) {
        score += 30;
        reasons.push('Direct canonical ontology alignment');
      }

      if (score >= 25) {
        results.push({
          id: `ret-ku-${unit.id}`,
          sourceEntityId: unit.id,
          sourceEntityType: 'KnowledgeUnit',
          title: unit.title,
          localizedTitle: {
            en: unit.title,
            vi: this.localizeConceptTitle(unit.title)
          },
          subtitle: `${unit.domain} • ${unit.type}`,
          relevanceScore: Math.min(99, score),
          relevanceReason: reasons.join(' • '),
          localizedReason: {
            en: reasons.join(' • '),
            vi: this.localizeReason(reasons.join(' • '))
          },
          intelligenceType: 'Knowledge',
          categoryTag: unit.domain,
          canonicalEntities: Array.from(canonicalIds),
          inputLanguage: intent.dominantLanguage,
          sourceLanguage: 'en',
          factType: 'CAREER_OS_KNOWLEDGE',
          confidence: 0.95
        });
      }
    });

    // 2. Search Books and Guides
    const books = knowledgeStore.getBooks();
    books.forEach(book => {
      let score = 0;
      const reasons: string[] = [];

      const bookKey = VietnameseNormalizer.toSearchKey(`${book.title} ${book.subtitle || ''} ${book.summary || ''}`);
      const termHits = queryTerms.filter(term => bookKey.includes(term));
      if (termHits.length > 0) {
        score += Math.min(35, termHits.length * 10);
        reasons.push(`Core literature on: ${termHits.slice(0, 3).join(', ')}`);
      }

      // Check domain / topic
      if (
        (canonicalIds.has('skill_market_sizing') || canonicalIds.has('case_market_entry')) &&
        (book.title.toLowerCase().includes('chasm') || book.title.toLowerCase().includes('strategy') || book.title.toLowerCase().includes('growth'))
      ) {
        score += 30;
        reasons.push('Strategic market entry handbook');
      }

      if (score >= 25) {
        results.push({
          id: `ret-book-${book.id}`,
          sourceEntityId: book.id,
          sourceEntityType: 'Book',
          title: book.title,
          localizedTitle: {
            en: book.title,
            vi: `Sách chuyên khảo: ${book.title}`
          },
          subtitle: `${(book.authors || []).join(', ')} (${book.publicationYear || ''})`,
          relevanceScore: Math.min(96, score),
          relevanceReason: reasons.join(' • '),
          localizedReason: {
            en: reasons.join(' • '),
            vi: this.localizeReason(reasons.join(' • '))
          },
          intelligenceType: 'Resources',
          categoryTag: 'Authoritative Guide',
          canonicalEntities: Array.from(canonicalIds),
          inputLanguage: intent.dominantLanguage,
          sourceLanguage: 'en',
          factType: 'SOURCE_FACT',
          confidence: 0.92
        });
      }
    });

    // 3. Search Industry Data Points
    const dataPoints = industryStore.getDataPoints();
    dataPoints.forEach(dp => {
      let score = 0;
      const reasons: string[] = [];

      // Check geography match
      if (dp.geography && intent.geographies.some(g => dp.geography?.toLowerCase().includes(g.toLowerCase()) || g.toLowerCase().includes(dp.geography?.toLowerCase() || ''))) {
        score += 30;
        reasons.push(`Aligned with target geography (${dp.geography})`);
      }

      // Check metrics / keywords
      const dpKey = VietnameseNormalizer.toSearchKey(`${dp.metric} ${dp.definition || ''} ${dp.industryId}`);
      const termHits = queryTerms.filter(term => dpKey.includes(term));
      if (termHits.length > 0) {
        score += Math.min(35, termHits.length * 10);
        reasons.push(`Empirical data for: ${dp.metric}`);
      }

      // Check industry
      if (
        (canonicalIds.has('industry_fintech') && dp.industryId.toLowerCase().includes('fintech')) ||
        (canonicalIds.has('industry_saas') && dp.industryId.toLowerCase().includes('saas'))
      ) {
        score += 25;
        reasons.push('Industry benchmark verified');
      }

      const displayVal = dp.rawValue || `${dp.value} ${dp.unit}`;

      if (score >= 25) {
        results.push({
          id: `ret-dp-${dp.id}`,
          sourceEntityId: dp.id,
          sourceEntityType: 'IndustryDataPoint',
          title: `${dp.metric}: ${displayVal}`,
          localizedTitle: {
            en: `${dp.metric}: ${displayVal}`,
            vi: `Số liệu ngành: ${dp.metric} (${displayVal})`
          },
          subtitle: `${dp.geography || 'Global'} • ${dp.publisher || 'Verified Benchmark'}`,
          relevanceScore: Math.min(98, score),
          relevanceReason: reasons.join(' • '),
          localizedReason: {
            en: reasons.join(' • '),
            vi: this.localizeReason(reasons.join(' • '))
          },
          intelligenceType: 'Industry Data',
          categoryTag: 'Empirical Benchmark',
          canonicalEntities: Array.from(canonicalIds),
          inputLanguage: intent.dominantLanguage,
          sourceLanguage: 'en',
          factType: 'SOURCE_FACT',
          confidence: dp.confidenceScore || 0.92
        });
      }
    });

    // 4. Search Similar Cases
    const cases = CASES_DATA;
    cases.forEach(c => {
      let score = 0;
      const reasons: string[] = [];

      const caseCombinedText = `${c.title} ${c.sector} ${c.roleCategory} ${c.backgroundScenario} ${c.theCoreConflict}`.toLowerCase();

      // Check case type overlap
      if (
        (canonicalIds.has('case_market_entry') && (caseCombinedText.includes('expand') || caseCombinedText.includes('market entry') || caseCombinedText.includes('market'))) ||
        (canonicalIds.has('case_profitability') && (caseCombinedText.includes('profit') || caseCombinedText.includes('margin') || caseCombinedText.includes('cost'))) ||
        (canonicalIds.has('case_growth') && (caseCombinedText.includes('growth') || caseCombinedText.includes('scale')))
      ) {
        score += 40;
        reasons.push(`Matching case archetype & domain: ${c.sector}`);
      }

      // Check keyword overlap
      const termHits = queryTerms.filter(term => caseCombinedText.includes(term));
      if (termHits.length > 0) {
        score += Math.min(30, termHits.length * 10);
        reasons.push(`Drills relevant problem patterns: ${termHits.slice(0, 2).join(', ')}`);
      }

      if (score >= 30) {
        results.push({
          id: `ret-case-${c.id}`,
          sourceEntityId: c.id,
          sourceEntityType: 'CaseStudy',
          title: c.title,
          localizedTitle: {
            en: c.title,
            vi: `Tình huống mẫu: ${c.title}`
          },
          subtitle: `${c.companyType} • ${c.difficulty}`,
          relevanceScore: Math.min(97, score),
          relevanceReason: reasons.join(' • '),
          localizedReason: {
            en: reasons.join(' • '),
            vi: this.localizeReason(reasons.join(' • '))
          },
          intelligenceType: 'Similar Cases',
          categoryTag: c.sector,
          canonicalEntities: Array.from(canonicalIds),
          inputLanguage: intent.dominantLanguage,
          sourceLanguage: 'en',
          factType: 'CAREER_OS_KNOWLEDGE',
          confidence: 0.94
        });
      }
    });

    // Sort by relevance score descending
    results.sort((a, b) => b.relevanceScore - a.relevanceScore);

    return results.slice(0, limit);
  }

  private static localizeConceptTitle(title: string): string {
    const map: Record<string, string> = {
      'TAM / SAM / SOM': 'Khung ước lượng quy mô thị trường (TAM/SAM/SOM)',
      'Scrum Empirical Process Control': 'Quy trình thực nghiệm Scrum (Empiricism)',
      'Product Goal & Commitment': 'Mục tiêu sản phẩm & Cam kết trong Scrum',
      'Definition of Done': 'Định nghĩa hoàn thành (Definition of Done)',
      'Cross-Functional Teams': 'Đội ngũ đa chức năng',
      'Sprint Review & Feedback Loop': 'Đánh giá Sprint & Vòng lặp phản hồi'
    };
    return map[title] || `Khái niệm: ${title}`;
  }

  private static localizeReason(reason: string): string {
    let result = reason;
    result = result.replace(/Directly targets skill:/g, 'Trực tiếp rèn luyện kỹ năng:');
    result = result.replace(/Direct canonical ontology alignment/g, 'Khớp hoàn toàn với bản đồ tri thức chuẩn');
    result = result.replace(/Aligned with target geography/g, 'Phù hợp với thị trường địa lý mục tiêu');
    result = result.replace(/Matching case archetype:/g, 'Dạng bài tập tình huống tương đồng:');
    result = result.replace(/Drills target skills:/g, 'Luyện tập các kỹ năng mục tiêu:');
    result = result.replace(/Empirical data for:/g, 'Số liệu thực chứng cho:');
    result = result.replace(/Matches search terms/g, 'Khớp với từ khóa tìm kiếm');
    return result;
  }
}
