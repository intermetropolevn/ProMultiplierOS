import { 
  JobApplication, 
  ApplicationAssessment, 
  ApplicationCase, 
  ApplicationIntelligenceItem, 
  ContextualIntelligenceSummary,
  ApplicationSkillGap,
  PreparationTask
} from '../types';
import { knowledgeStore } from '../../knowledge/services/knowledgeStore';
import { industryStore } from '../../industry/services/industryStore';
import { CASES_DATA } from '../../../data/casesData';
import { KnowledgeStorageService } from '../../knowledge/services/knowledgeStorageService';
import { CareerSemanticParser } from '../../intelligence/services/careerSemanticParser';
import { VietnameseNormalizer } from '../../intelligence/services/vietnameseNormalizer';

export interface ContextualNudge {
  triggerPhrase: string;
  topic: string;
  nudge: string;
  localizedNudge?: { en: string; vi: string };
  relevantConcepts: string[];
}

export class ContextualIntelligenceEngine {
  /**
   * Main orchestrator: generates the full contextual intelligence bundle for an application and case
   */
  static generateIntelligence(
    application: JobApplication,
    assessment?: ApplicationAssessment,
    appCase?: ApplicationCase
  ): ContextualIntelligenceSummary {
    const items: ApplicationIntelligenceItem[] = [];

    // Parse application and case context using multilingual semantic parser
    const combinedContextText = `${application.roleTitle} ${application.companyName} ${application.jobSnapshot?.description || ''} ${appCase?.prompt || ''} ${appCase?.context || ''} ${application.notes || ''}`;
    const parsedIntent = CareerSemanticParser.parse(combinedContextText);

    const industryKeyword = appCase?.industryId || application.jobSnapshot?.description?.toLowerCase() || '';
    const geography = appCase?.geography || (parsedIntent.geographies.length > 0 ? parsedIntent.geographies[0] : 'Southeast Asia');
    const caseTypes = appCase?.caseTypeIds || ['Market Entry', 'Growth', 'Strategy'];

    const canonicalIds = [
      ...(parsedIntent.role ? [parsedIntent.role.canonicalId] : []),
      ...(parsedIntent.caseType ? [parsedIntent.caseType.canonicalId] : []),
      ...parsedIntent.skills.map(s => s.canonicalId),
      ...parsedIntent.knowledge.map(k => k.canonicalId)
    ];

    // 1. SKILLS EXTRACTION & MAPPING
    const skillPool = [
      {
        name: 'Market Sizing',
        canonicalId: 'skill_market_sizing',
        titleVi: 'Ước lượng quy mô thị trường (TAM/SAM/SOM)',
        relevance: 95,
        category: 'Critical',
        reason: 'The case requires estimating the total addressable market (TAM/SAM/SOM) for strategic prioritization.',
        reasonVi: 'Bài toán đòi hỏi định cỡ quy mô thị trường mục tiêu (TAM/SAM/SOM) để ra quyết định ưu tiên.'
      },
      {
        name: 'Strategic Thinking',
        canonicalId: 'skill_strategic_thinking',
        titleVi: 'Tư duy chiến lược & Hào lũy cạnh tranh',
        relevance: 93,
        category: 'Critical',
        reason: 'Essential for defining competitive moats, market timing, and long-term defensibility.',
        reasonVi: 'Cốt lõi để xác định hào lũy cạnh tranh, thời điểm gia nhập và tính bền vững lâu dài.'
      },
      {
        name: 'Competitive Analysis',
        canonicalId: 'skill_competitive_analysis',
        titleVi: 'Phân tích đối thủ cạnh tranh',
        relevance: 88,
        category: 'Critical',
        reason: 'Must evaluate incumbent market power, differentiation vectors, and competitor response risk.',
        reasonVi: 'Cần đánh giá sức mạnh của đối thủ hiện hữu, yếu tố khác biệt hóa và rủi ro phản ứng cạnh tranh.'
      },
      {
        name: 'Unit Economics',
        canonicalId: 'skill_unit_economics',
        titleVi: 'Kinh tế đơn vị (LTV / CAC)',
        relevance: 85,
        category: 'Important',
        reason: 'Evaluating customer acquisition cost (CAC), LTV, payback period, and sustainable margins.',
        reasonVi: 'Đánh giá chi phí thu hút khách hàng (CAC), giá trị trọn đời (LTV), chu kỳ hoàn vốn và biên lợi nhuận.'
      },
      {
        name: 'Quantitative Reasoning',
        canonicalId: 'skill_quantitative_reasoning',
        titleVi: 'Tư duy định lượng & Mô hình tài chính',
        relevance: 84,
        category: 'Important',
        reason: 'Validating growth scenarios, pricing sensitivity, and capital expenditure payback.',
        reasonVi: 'Kiểm chứng kịch bản tăng trưởng, độ nhạy giá bán và thời gian hoàn vốn đầu tư.'
      },
      {
        name: 'Business Acumen',
        canonicalId: 'skill_business_acumen',
        titleVi: 'Nhạy bén kinh doanh thực tế',
        relevance: 80,
        category: 'Important',
        reason: 'Synthesizing local regulatory conditions, partnership dynamics, and commercial realities.',
        reasonVi: 'Tổng hợp các quy định pháp lý địa phương, quan hệ đối tác và thực tiễn thương mại.'
      },
      {
        name: 'Executive Synthesis',
        canonicalId: 'skill_executive_synthesis',
        titleVi: 'Tổng hợp điều hành (Minto Pyramid)',
        relevance: 78,
        category: 'Secondary',
        reason: 'Structuring recommendations clearly for executive stakeholders with structured next steps.',
        reasonVi: 'Trình bày thông điệp súc tích cho ban lãnh đạo theo nguyên lý kim tự tháp Minto.'
      }
    ];

    skillPool.forEach((sk, idx) => {
      items.push({
        id: `intel-skill-${idx}`,
        applicationId: application.id,
        sourceEntityId: `skill-${sk.name.toLowerCase().replace(/\s+/g, '-')}`,
        sourceEntityType: 'SKILL',
        title: sk.name,
        localizedTitle: {
          en: sk.name,
          vi: sk.titleVi
        },
        subtitle: `${sk.category} Focus • Tested in Case & Role`,
        relevanceScore: sk.relevance,
        relevanceReason: sk.reason,
        localizedReason: {
          en: sk.reason,
          vi: sk.reasonVi
        },
        intelligenceType: 'Skills',
        categoryTag: sk.category,
        canonicalEntities: [sk.canonicalId, ...canonicalIds],
        inputLanguage: parsedIntent.dominantLanguage,
        sourceLanguage: 'en',
        factType: 'CAREER_OS_KNOWLEDGE',
        confidence: 0.96
      });
    });

    // 2. KNOWLEDGE UNITS & FRAMEWORKS
    const allUnits = knowledgeStore.getKnowledgeUnits();
    const relevantUnitKeywords = ['market', 'entry', 'economics', 'strategy', 'growth', 'saas', 'tam', 'porter', 'network'];

    const matchedUnits = allUnits.filter(u => {
      const text = `${u.title} ${u.summary} ${u.type} ${u.domain} ${(u.skills || []).join(' ')}`.toLowerCase();
      return relevantUnitKeywords.some(kw => text.includes(kw));
    }).slice(0, 5);

    matchedUnits.forEach((unit, idx) => {
      const score = 94 - idx * 4;
      items.push({
        id: `intel-ku-${unit.id}`,
        applicationId: application.id,
        sourceEntityId: unit.id,
        sourceEntityType: 'KNOWLEDGE',
        title: unit.title,
        subtitle: `${unit.type} • ${unit.domain}`,
        relevanceScore: score,
        relevanceReason: `Directly aligns with ${caseTypes.join(', ')} problem structure and provides established mental models for this scenario.`,
        intelligenceType: 'Knowledge',
        categoryTag: idx < 2 ? 'Review Now' : 'Useful'
      });
    });

    // Fallback standard frameworks if knowledge units are sparse
    if (matchedUnits.length < 3) {
      const standardFrameworks = [
        { name: "Porter's Five Forces", domain: 'Competitive Strategy', reason: 'Assesses competitive intensity, threat of substitutes, and supplier power in the target market.' },
        { name: 'TAM / SAM / SOM Sizing Framework', domain: 'Market Sizing', reason: 'Provides a structured top-down and bottom-up methodology to forecast addressable revenue.' },
        { name: 'Unit Economics & LTV/CAC Rule', domain: 'Financial Analysis', reason: 'Ensures customer payback is under 12 months and lifetime value exceeds 3x acquisition cost.' }
      ];

      standardFrameworks.forEach((sf, idx) => {
        items.push({
          id: `intel-fw-${idx}`,
          applicationId: application.id,
          sourceEntityId: `fw-${idx}`,
          sourceEntityType: 'FRAMEWORK',
          title: sf.name,
          subtitle: `Framework • ${sf.domain}`,
          relevanceScore: 90 - idx * 3,
          relevanceReason: sf.reason,
          intelligenceType: 'Knowledge',
          categoryTag: 'Review Now'
        });
      });
    }

    // 3. INDUSTRY INTELLIGENCE
    const allIntel = industryStore.getIntelligence();
    const relevantIntel = allIntel.filter(item => {
      return item.industryId === appCase?.industryId || 
             item.title.toLowerCase().includes('saas') || 
             item.title.toLowerCase().includes('vietnam') ||
             item.summary.toLowerCase().includes('market');
    }).slice(0, 4);

    relevantIntel.forEach((intel, idx) => {
      items.push({
        id: `intel-ii-${intel.id}`,
        applicationId: application.id,
        sourceEntityId: intel.id,
        sourceEntityType: 'INDUSTRY_INTELLIGENCE',
        title: intel.title,
        subtitle: `${intel.type.replace(/_/g, ' ')} • Origin: ${intel.origin}`,
        relevanceScore: 92 - idx * 4,
        relevanceReason: `Synthesizes verified market dynamics in ${geography} with specific strategic implications for this case.`,
        intelligenceType: 'Industry Intelligence',
        categoryTag: intel.type
      });
    });

    // 4. INDUSTRY DATA POINTS
    const allDataPoints = industryStore.getDataPoints();
    const relevantPoints = allDataPoints.slice(0, 5);

    relevantPoints.forEach((dp, idx) => {
      items.push({
        id: `intel-dp-${dp.id}`,
        applicationId: application.id,
        sourceEntityId: dp.id,
        sourceEntityType: 'INDUSTRY_DATA',
        title: `${dp.metric}: ${String(dp.value)} ${dp.unit}`,
        subtitle: `${dp.geography || 'Global'} • Period: ${dp.periodLabel || '2026'} (Source: ${dp.publisher || 'Verified'})`,
        relevanceScore: 89 - idx * 3,
        relevanceReason: `Verified benchmark with Quality Score ${dp.dataQualityScore ?? 95}/100 to ground your numerical assumptions.`,
        intelligenceType: 'Industry Data',
        categoryTag: 'Benchmark'
      });
    });

    // 5. SIMILAR CASES
    const industryCases = industryStore.getCaseStudies();
    const practicalCases = CASES_DATA;

    const similarCases = [
      ...industryCases.map(c => ({
        id: c.id,
        title: c.title,
        type: c.caseTypeIds?.[0] || 'Market Entry',
        difficulty: c.difficulty || 'ADVANCED',
        reason: `Shares ${c.caseTypeIds?.join(' & ') || 'strategic'} archetype in ${c.geography || 'Regional'}, testing quantitative sizing and unit economics.`
      })),
      ...practicalCases.slice(0, 2).map(c => ({
        id: c.id,
        title: c.title,
        type: c.sector || c.roleCategory || 'Strategy',
        difficulty: 'Senior',
        reason: `Trains strategic reasoning and candidate structuring for similar organizational challenges.`
      }))
    ].slice(0, 4);

    similarCases.forEach((sc, idx) => {
      items.push({
        id: `intel-sc-${sc.id}`,
        applicationId: application.id,
        sourceEntityId: sc.id,
        sourceEntityType: 'CASE',
        title: sc.title,
        subtitle: `${sc.type} • ${sc.difficulty}`,
        relevanceScore: 93 - idx * 5,
        relevanceReason: sc.reason,
        intelligenceType: 'Similar Cases',
        categoryTag: sc.type
      });
    });

    // 6. RECOMMENDED RESOURCES (BOOKS / PAPERS)
    const books = knowledgeStore.getBooks();
    const relevantBooks = books.slice(0, 3);

    relevantBooks.forEach((b, idx) => {
      items.push({
        id: `intel-res-${b.id}`,
        applicationId: application.id,
        sourceEntityId: b.id,
        sourceEntityType: 'RESOURCE',
        title: b.title,
        subtitle: `By ${b.authors?.join(', ') || 'Industry Experts'} • ${b.domain || 'Strategy'}`,
        relevanceScore: 86 - idx * 4,
        relevanceReason: `Authoritative literature covering core methodology and execution playbook for this role level.`,
        intelligenceType: 'Resources',
        categoryTag: b.domain || 'Strategy'
      });
    });

    return {
      applicationId: application.id,
      skillsCount: items.filter(i => i.intelligenceType === 'Skills').length,
      knowledgeCount: items.filter(i => i.intelligenceType === 'Knowledge').length,
      industryDataCount: items.filter(i => i.intelligenceType === 'Industry Data').length,
      similarCasesCount: items.filter(i => i.intelligenceType === 'Similar Cases').length,
      resourcesCount: items.filter(i => i.intelligenceType === 'Resources').length,
      items
    };
  }

  /**
   * Computes Skill Gaps by cross-referencing required skills with candidate's persistent profile evidence
   */
  static computeSkillGaps(
    application: JobApplication,
    appCase?: ApplicationCase
  ): ApplicationSkillGap[] {
    const candidateEvidence = KnowledgeStorageService.getEvidence();

    const requiredSkills = [
      { name: 'Market Sizing', importance: 'CRITICAL' as const, req: 'High' as const, practiceTitle: 'B2B SaaS Addressable Market Sizing', practiceType: 'Quantitative Drill' },
      { name: 'Strategic Thinking', importance: 'CRITICAL' as const, req: 'High' as const, practiceTitle: 'Market Entry Defensibility & Moat Analysis', practiceType: 'Structuring Exercise' },
      { name: 'Competitive Analysis', importance: 'HIGH' as const, req: 'High' as const, practiceTitle: 'Incumbent Counter-Strategy Assessment', practiceType: 'Analysis Case' },
      { name: 'Unit Economics', importance: 'HIGH' as const, req: 'Medium' as const, practiceTitle: 'SaaS Payback & LTV/CAC Modeling', practiceType: 'Financial Drill' },
      { name: 'Executive Synthesis', importance: 'MEDIUM' as const, req: 'High' as const, practiceTitle: 'Minto Pyramid Executive Summary Drafting', practiceType: 'Synthesis Drill' }
    ];

    return requiredSkills.map(sk => {
      // Find candidate evidence matching this skill
      const matchingEvidence = candidateEvidence.filter(ev => 
        ev.skills?.some(s => s.toLowerCase().includes(sk.name.toLowerCase())) ||
        ev.title.toLowerCase().includes(sk.name.toLowerCase()) ||
        ev.actions.toLowerCase().includes(sk.name.toLowerCase())
      );

      const count = matchingEvidence.length;
      let level: 'None' | 'Low' | 'Medium' | 'Strong' = 'None';
      let gapScore = 80;

      if (count >= 3) {
        level = 'Strong';
        gapScore = 15;
      } else if (count === 2) {
        level = 'Medium';
        gapScore = 40;
      } else if (count === 1) {
        level = 'Low';
        gapScore = 65;
      } else {
        level = 'None';
        gapScore = 90;
      }

      return {
        applicationId: application.id,
        skillId: `gap-${sk.name.toLowerCase().replace(/\s+/g, '-')}`,
        skillName: sk.name,
        importance: sk.importance,
        currentEvidenceCount: count,
        currentEvidenceLevel: level,
        requiredLevel: sk.req,
        gapScore,
        recommendedPracticeTitle: sk.practiceTitle,
        recommendedPracticeType: sk.practiceType
      };
    });
  }

  /**
   * Generates prioritized preparation tasks with deadline intelligence
   */
  static generatePreparationPlan(
    application: JobApplication,
    appCase?: ApplicationCase,
    skillGaps?: ApplicationSkillGap[]
  ): PreparationTask[] {
    const gaps = skillGaps || this.computeSkillGaps(application, appCase);
    const criticalGap = gaps.find(g => g.importance === 'CRITICAL' && g.gapScore > 50);

    const tasks: PreparationTask[] = [
      {
        id: 'task-1',
        applicationId: application.id,
        title: 'Deconstruct Problem Statement & Identify Core Decision',
        type: 'UNDERSTAND_CASE',
        priority: 'CRITICAL',
        estimatedMinutes: 20,
        status: 'DONE',
        completedAt: new Date().toISOString(),
        whyRecommended: 'Prevents solving the wrong question by strictly delineating constraints and deliverables.'
      },
      {
        id: 'task-2',
        applicationId: application.id,
        title: 'Review Market Entry & Unit Economics Frameworks',
        type: 'REVIEW_FRAMEWORK',
        relatedKnowledgeTitle: "Porter's Five Forces & Unit Economics",
        priority: 'CRITICAL',
        estimatedMinutes: 25,
        status: 'TODO',
        whyRecommended: 'Provides structural scaffolding to prevent ad-hoc or ungrounded recommendations.'
      },
      {
        id: 'task-3',
        applicationId: application.id,
        title: 'Inspect Southeast Asia SaaS Benchmark Data & Growth Metrics',
        type: 'EXPLORE_DATA',
        priority: 'HIGH',
        estimatedMinutes: 20,
        status: 'TODO',
        whyRecommended: 'Grounds assumptions in verified sector benchmarks with publisher credibility scores.'
      },
      {
        id: 'task-4',
        applicationId: application.id,
        title: criticalGap ? `Practice Drill: ${criticalGap.recommendedPracticeTitle}` : 'Practice Drill: Market Sizing & Pricing Model',
        type: 'PRACTICE_CASE',
        relatedSkillName: criticalGap ? criticalGap.skillName : 'Market Sizing',
        priority: 'HIGH',
        estimatedMinutes: 30,
        status: 'TODO',
        whyRecommended: `Directly bridges your highest detected skill gap (${criticalGap ? criticalGap.skillName : 'Market Sizing'}).`
      },
      {
        id: 'task-5',
        applicationId: application.id,
        title: 'Draft Synthesis & Executive Recommendation (Minto Pyramid)',
        type: 'DRAFT_SOLUTION',
        priority: 'MEDIUM',
        estimatedMinutes: 35,
        status: 'TODO',
        whyRecommended: 'Transforms analysis into an actionable, decision-ready presentation for hiring committee.'
      },
      {
        id: 'task-6',
        applicationId: application.id,
        title: 'Run Final Quality Review & Assumption Stress-Test',
        type: 'FINAL_REVIEW',
        priority: 'MEDIUM',
        estimatedMinutes: 15,
        status: 'TODO',
        whyRecommended: 'Audits assumptions against rubric checklist before final submission.'
      }
    ];

    return tasks;
  }

  /**
   * Stimulate Mode questions: Socratic prompts that stimulate reasoning without revealing answers
   */
  static getStimulateQuestions(appCase?: ApplicationCase, language: 'en' | 'vi' = 'en'): string[] {
    if (language === 'vi') {
      return [
        'Ai là người ra quyết định mua hàng thực tế (economic buyer) so với người dùng cuối, và mức độ sẵn sàng chi trả của họ là bao nhiêu?',
        'Hào lũy cấu trúc cụ thể nào ngăn cản đối thủ địa phương hiện hữu sao chép sản phẩm này ngay lập tức?',
        'Các biến phí chính là gì, và ở quy mô nào thì biên lợi nhuận đóng góp (contribution margin) chuyển sang dương?',
        'Những giả định cốt lõi nào về giấy phép pháp lý, bản địa hóa sản phẩm hoặc kênh phân phối bắt buộc phải đúng?',
        'Nếu công ty chỉ có thể triển khai một kênh thâm nhập thị trường duy nhất trong Năm 1, kênh nào có thời gian hoàn vốn ngắn nhất?',
        'Kịch bản rủi ro xấu nhất là gì, và giải pháp của bạn đề xuất phương án phòng ngừa như thế nào?'
      ];
    }

    return [
      'Who is the actual economic buyer vs. end user, and what is their willingness-to-pay threshold?',
      'What specific structural barrier prevents an existing local competitor from copying this product immediately?',
      'What are the key variable cost drivers, and at what scale does contribution margin become positive?',
      'What critical assumptions about regulatory approval, localization, or partner channels must hold true?',
      'If the company can only execute one go-to-market channel in Year 1, which has the shortest payback period?',
      'What is the downside scenario or failure mode, and how does your recommendation mitigate it?'
    ];
  }

  /**
   * Contextual nudges based on candidate analysis text (supporting EN, VI, and code-switching)
   */
  static evaluateNudge(textSoFar: string): ContextualNudge | null {
    const text = textSoFar.toLowerCase();
    const cleanNoDia = VietnameseNormalizer.toSearchKey(textSoFar);

    // 1. Growth without Unit Economics
    const mentionsGrowth = text.includes('grow') || text.includes('quick') || text.includes('scale') ||
                          cleanNoDia.includes('tang truong') || cleanNoDia.includes('mo rong nhanh');
    const mentionsEconomics = text.includes('unit economic') || text.includes('ltv') || text.includes('cac') ||
                             cleanNoDia.includes('kinh te don vi') || cleanNoDia.includes('bien loi nhuan');

    if (mentionsGrowth && !mentionsEconomics) {
      return {
        triggerPhrase: 'growth rate / tăng trưởng',
        topic: 'Unit Economics & Margin Sustainability',
        nudge: 'Growth alone does not establish market attractiveness. Have you evaluated unit economics, CAC payback duration, and gross margins in this geography?',
        localizedNudge: {
          en: 'Growth alone does not establish market attractiveness. Have you evaluated unit economics, CAC payback duration, and gross margins in this geography?',
          vi: 'Tăng trưởng đơn thuần chưa chứng minh được sự bền vững. Bạn đã tính toán kinh tế đơn vị, thời gian hoàn vốn CAC và biên lợi nhuận tại thị trường này chưa?'
        },
        relevantConcepts: ['Unit Economics', 'LTV/CAC Rule', 'Payback Period']
      };
    }

    // 2. Price Undercutting / Discounting without Moat
    const mentionsDiscount = text.includes('cheap') || text.includes('low price') || text.includes('undercut') ||
                            text.includes('discount') || cleanNoDia.includes('gia re') || cleanNoDia.includes('ha gia') ||
                            cleanNoDia.includes('giam gia') || cleanNoDia.includes('canh tranh ve gia');

    if (mentionsDiscount) {
      return {
        triggerPhrase: 'pricing strategy / giá rẻ',
        topic: 'Competitive Moats vs Price Wars',
        nudge: 'Price discounting as a primary entry strategy is easily matched by well-capitalized incumbents. What structural differentiation or cost advantage protects your margin?',
        localizedNudge: {
          en: 'Price discounting as a primary entry strategy is easily matched by well-capitalized incumbents. What structural differentiation or cost advantage protects your margin?',
          vi: 'Giảm giá làm chiến lược gia nhập rất dễ bị các đối thủ lớn triệt tiêu bằng chiến tranh giá. Hào lũy khác biệt hóa hay lợi thế chi phí nào bảo vệ biên lợi nhuận của bạn?'
        },
        relevantConcepts: ["Porter's Five Forces", 'Competitive Advantage', 'Value-Based Pricing']
      };
    }

    // 3. Overly broad market without beachhead segmentation
    const mentionsBroad = text.includes('everyone') || text.includes('all companies') || text.includes('huge market') ||
                         cleanNoDia.includes('tat ca cac cong ty') || cleanNoDia.includes('ai cung can') ||
                         cleanNoDia.includes('thi truong khong lo');

    if (mentionsBroad) {
      return {
        triggerPhrase: 'market definition / thị trường chung chung',
        topic: 'Beachhead Customer Segmentation',
        nudge: 'A broad market definition risks unfocused GTM execution. Can you identify a narrow, underserved beachhead segment to win first?',
        localizedNudge: {
          en: 'A broad market definition risks unfocused GTM execution. Can you identify a narrow, underserved beachhead segment to win first?',
          vi: 'Định nghĩa thị trường quá rộng dễ dẫn đến phân tán nguồn lực GTM. Bạn có thể khoanh vùng một phân khúc bàn đạp (beachhead) cụ thể để chiếm lĩnh trước không?'
        },
        relevantConcepts: ['TAM / SAM / SOM', 'Beachhead Strategy', 'Ideal Customer Profile (ICP)']
      };
    }

    // 4. Profitability without structural revenue/cost split
    const mentionsProfit = text.includes('profit') || text.includes('margin decline') ||
                          cleanNoDia.includes('loi nhuan giam') || cleanNoDia.includes('sut giam loi nhuan');
    const mentionsStructure = text.includes('revenue') || text.includes('cost') || cleanNoDia.includes('doanh thu') ||
                             cleanNoDia.includes('chi phi') || text.includes('structure');

    if (mentionsProfit && !mentionsStructure) {
      return {
        triggerPhrase: 'profitability diagnostic / chẩn đoán lợi nhuận',
        topic: 'Profitability Tree Decomposition',
        nudge: 'Profit issues should be structurally decomposed into Revenue drivers (Price × Volume) and Cost drivers (Fixed vs Variable) before formulating solutions.',
        localizedNudge: {
          en: 'Profit issues should be structurally decomposed into Revenue drivers (Price × Volume) and Cost drivers (Fixed vs Variable) before formulating solutions.',
          vi: 'Sụt giảm lợi nhuận cần được bóc tách rõ theo nhánh Doanh thu (Giá × Sản lượng) và Chi phí (Định phí vs Biến phí) trước khi đưa ra đề xuất.'
        },
        relevantConcepts: ['Profitability Tree', 'Revenue Drivers', 'Cost Breakdown']
      };
    }

    return null;
  }
}
