// =========================================================================
// CAREER OS - CANONICAL MULTILINGUAL ONTOLOGY REGISTRY
// =========================================================================

import { CanonicalEntity, AbbreviationDefinition } from '../types';
import { VietnameseNormalizer } from './vietnameseNormalizer';

export const CANONICAL_ONTOLOGY_ENTITIES: CanonicalEntity[] = [
  // =======================================================================
  // 1. SKILLS
  // =======================================================================
  {
    entityId: 'skill_market_sizing',
    entityType: 'SKILL',
    canonicalName: 'Market Sizing',
    labels: {
      en: ['Market Sizing', 'Market Size Estimation', 'TAM Sizing'],
      vi: ['Ước lượng quy mô thị trường', 'Ước tính quy mô thị trường', 'Định lượng thị trường']
    },
    aliases: [
      'market sizing',
      'sizing the market',
      'market size estimation',
      'estimate market size',
      'tam sizing',
      'market size'
    ],
    vietnameseAliases: [
      'ước lượng quy mô thị trường',
      'ước tính quy mô thị trường',
      'tính market size',
      'ước lượng market',
      'ước tính thị trường',
      'ước tính market size',
      'định lượng quy mô thị trường',
      'ước lượng thị trường'
    ],
    vietnameseNoDiacriticsAliases: [
      'uoc luong quy mo thi truong',
      'uoc tinh quy mo thi truong',
      'tinh market size',
      'uoc luong market',
      'uoc tinh thi truong',
      'uoc tinh market size',
      'dinh luong quy mo thi truong',
      'uoc luong thi truong'
    ],
    descriptionEn: 'The quantitative methodology for estimating total addressable market (TAM), serviceable addressable market (SAM), and serviceable obtainable market (SOM).',
    descriptionVi: 'Phương pháp định lượng ước tính quy mô thị trường mục tiêu (TAM, SAM, SOM) phục vụ ra quyết định chiến lược.',
    categoryTag: 'Quantitative Drill'
  },
  {
    entityId: 'skill_strategic_thinking',
    entityType: 'SKILL',
    canonicalName: 'Strategic Thinking',
    labels: {
      en: ['Strategic Thinking', 'Business Strategy', 'Competitive Strategy'],
      vi: ['Tư duy chiến lược', 'Hoạch định chiến lược']
    },
    aliases: [
      'strategic thinking',
      'strategy',
      'business strategy',
      'strategic prioritization',
      'competitive strategy'
    ],
    vietnameseAliases: [
      'tư duy chiến lược',
      'chiến lược',
      'hoạch định chiến lược',
      'định hướng chiến lược',
      'thiên về strategy'
    ],
    vietnameseNoDiacriticsAliases: [
      'tu duy chien luoc',
      'chien luoc',
      'hoach dinh chien luoc',
      'dinh huong chien luoc',
      'thien ve strategy'
    ],
    descriptionEn: 'Ability to define defensible competitive moats, prioritize strategic trade-offs, and align initiatives with long-term commercial goals.',
    descriptionVi: 'Khả năng định hình hào lũy cạnh tranh, đánh giá các điểm đánh đổi chiến lược và xây dựng lợi thế bền vững.',
    categoryTag: 'Structuring Exercise'
  },
  {
    entityId: 'skill_competitive_analysis',
    entityType: 'SKILL',
    canonicalName: 'Competitive Analysis',
    labels: {
      en: ['Competitive Analysis', 'Competitor Landscape Analysis', 'Market Defensibility'],
      vi: ['Phân tích đối thủ cạnh tranh', 'Đánh giá bối cảnh cạnh tranh']
    },
    aliases: [
      'competitive analysis',
      'competitor analysis',
      'competitor landscape',
      'competitive landscape',
      'competitor benchmarking',
      'competitive intensity'
    ],
    vietnameseAliases: [
      'phân tích đối thủ',
      'đối thủ cạnh tranh',
      'mức độ cạnh tranh',
      'bối cảnh cạnh tranh',
      'nghiên cứu đối thủ',
      'đánh giá đối thủ'
    ],
    vietnameseNoDiacriticsAliases: [
      'phan tich doi thu',
      'doi thu canh tranh',
      'muc do canh tranh',
      'boi canh canh tranh',
      'nghien cuu doi thu',
      'danh gia doi thu'
    ],
    descriptionEn: 'Evaluation of incumbent power, barrier-to-entry, differentiation vectors, and competitor counter-reactions.',
    descriptionVi: 'Đánh giá sức mạnh của các đối thủ hiện hữu, rào cản gia nhập thị trường và các yếu tố tạo sự khác biệt.',
    categoryTag: 'Analysis Case'
  },
  {
    entityId: 'skill_unit_economics',
    entityType: 'SKILL',
    canonicalName: 'Unit Economics',
    labels: {
      en: ['Unit Economics', 'Financial Modeling', 'Payback Analysis'],
      vi: ['Kinh tế đơn vị', 'Mô hình kinh tế vi mô', 'Tài chính đơn vị']
    },
    aliases: [
      'unit economics',
      'unit-level economics',
      'economics',
      'cac payback',
      'ltv/cac',
      'payback period',
      'gross margin'
    ],
    vietnameseAliases: [
      'kinh tế đơn vị',
      'kinh tế vi mô',
      'tài chính đơn vị',
      'hiệu quả đơn vị',
      'chỉ số ltv cac'
    ],
    vietnameseNoDiacriticsAliases: [
      'kinh te don vi',
      'kinh te vi mo',
      'tai chinh don vi',
      'hieu qua don vi',
      'chi so ltv cac'
    ],
    descriptionEn: 'Modeling per-unit revenue, variable costs, customer acquisition cost (CAC), customer lifetime value (LTV), and cash payback velocity.',
    descriptionVi: 'Phân tích doanh thu và chi phí trên mỗi đơn vị người dùng/giao dịch, thời gian hoàn vốn CAC và tỷ số LTV/CAC.',
    categoryTag: 'Financial Drill'
  },
  {
    entityId: 'skill_quantitative_reasoning',
    entityType: 'SKILL',
    canonicalName: 'Quantitative Reasoning',
    labels: {
      en: ['Quantitative Reasoning', 'Financial Modeling', 'Data Modeling'],
      vi: ['Tư duy định lượng', 'Mô hình hóa tài chính', 'Phân tích số liệu']
    },
    aliases: [
      'quantitative reasoning',
      'quantitative modeling',
      'financial modeling',
      'quantitative analysis',
      'numerical reasoning',
      'dcf modeling'
    ],
    vietnameseAliases: [
      'tư duy định lượng',
      'mô hình tài chính',
      'phân tích định lượng',
      'tính toán số liệu',
      'mô hình hóa số liệu'
    ],
    vietnameseNoDiacriticsAliases: [
      'tu duy dinh luong',
      'mo hinh tai chinh',
      'phan tich dinh luong',
      'tinh toan so lieu',
      'mo hinh hoa so lieu'
    ],
    descriptionEn: 'Rigorously testing hypotheses using numerical models, sensitivity analyses, and cohort forecasts.',
    descriptionVi: 'Kiểm chứng giả thuyết bằng các mô hình số học, phân tích độ nhạy và dự phóng doanh thu.',
    categoryTag: 'Quantitative Drill'
  },
  {
    entityId: 'skill_product_discovery',
    entityType: 'SKILL',
    canonicalName: 'Product Discovery',
    labels: {
      en: ['Product Discovery', 'Customer Problem Validation', 'Opportunity Solution Tree'],
      vi: ['Khám phá sản phẩm', 'Nghiên cứu nhu cầu khách hàng']
    },
    aliases: [
      'product discovery',
      'discovery',
      'customer discovery',
      'problem validation',
      'opportunity solution tree'
    ],
    vietnameseAliases: [
      'khám phá sản phẩm',
      'tìm hiểu nhu cầu khách hàng',
      'xác thực vấn đề',
      'nghiên cứu người dùng'
    ],
    vietnameseNoDiacriticsAliases: [
      'kham pha san pham',
      'tim hieu nhu cau khach hang',
      'xac thuc van de',
      'nghien cuu nguoi dung'
    ],
    descriptionEn: 'Techniques for uncovering real customer pain points and validating user willingness-to-pay before engineering investment.',
    descriptionVi: 'Quy trình khám phá nhu cầu thực tế và mức độ sẵn sàng chi trả của người dùng trước khi triển khai phát triển.',
    categoryTag: 'Product Drill'
  },
  {
    entityId: 'skill_roadmapping',
    entityType: 'SKILL',
    canonicalName: 'Roadmapping',
    labels: {
      en: ['Roadmapping', 'Product Roadmapping', 'Release Planning'],
      vi: ['Xây dựng lộ trình sản phẩm', 'Lập kế hoạch phát hành']
    },
    aliases: [
      'roadmapping',
      'roadmap',
      'product roadmap',
      'release planning',
      'milestone planning'
    ],
    vietnameseAliases: [
      'lộ trình sản phẩm',
      'xây dựng roadmap',
      'kế hoạch phát hành',
      'lập lộ trình'
    ],
    vietnameseNoDiacriticsAliases: [
      'lo trinh san pham',
      'xay dung roadmap',
      'ke hoach phat hanh',
      'lap lo trinh'
    ],
    descriptionEn: 'Structuring strategic timelines, release milestones, and capability dependencies across quarters.',
    descriptionVi: 'Hoạch định các mốc phát hành, tính năng cốt lõi và các mối liên kết phụ thuộc theo từng giai đoạn.',
    categoryTag: 'Planning Exercise'
  },
  {
    entityId: 'skill_stakeholder_management',
    entityType: 'SKILL',
    canonicalName: 'Stakeholder Management',
    labels: {
      en: ['Stakeholder Management', 'Cross-Functional Alignment', 'Executive Communication'],
      vi: ['Quản trị các bên liên quan', 'Giao tiếp liên chức năng', 'Đồng thuận chiến lược']
    },
    aliases: [
      'stakeholder management',
      'stakeholder',
      'stakeholders',
      'cross-functional alignment',
      'executive communication'
    ],
    vietnameseAliases: [
      'quản trị các bên liên quan',
      'quản lý stakeholder',
      'giao tiếp liên chức năng',
      'đồng thuận các bên',
      'làm việc với stakeholder'
    ],
    vietnameseNoDiacriticsAliases: [
      'quan tri cac ben lien quan',
      'quan ly stakeholder',
      'giao tiep lien chuc nang',
      'dong thuan cac ben',
      'lam viec voi stakeholder'
    ],
    descriptionEn: 'Aligning engineering, commercial, legal, and executive stakeholders around unified product objectives.',
    descriptionVi: 'Điều phối và tạo sự thống nhất giữa đội ngũ kỹ thuật, kinh doanh, pháp lý và ban điều hành.',
    categoryTag: 'Leadership Exercise'
  },
  {
    entityId: 'skill_data_driven_decision_making',
    entityType: 'SKILL',
    canonicalName: 'Data-driven Decision Making',
    labels: {
      en: ['Data-driven Decision Making', 'Experimentation & Analytics', 'Metrics Architecture'],
      vi: ['Ra quyết định dựa trên dữ liệu', 'Phân tích số liệu thực tế']
    },
    aliases: [
      'data-driven decision making',
      'data-driven',
      'data driven',
      'metric-driven',
      'experimentation'
    ],
    vietnameseAliases: [
      'ra quyết định dựa trên dữ liệu',
      'ra quyết định theo data',
      'phân tích dữ liệu',
      'đo lường số liệu'
    ],
    vietnameseNoDiacriticsAliases: [
      'ra quyet dinh dua tren du lieu',
      'ra quyet dinh theo data',
      'phan tich du lieu',
      'do luong so lieu'
    ],
    descriptionEn: 'Synthesizing quantitative indicators and AB tests to guide investment decisions rather than gut feelings.',
    descriptionVi: 'Sử dụng dữ liệu định lượng và thử nghiệm thực tế để định hướng phát triển thay vì cảm tính.',
    categoryTag: 'Analytics Exercise'
  },
  {
    entityId: 'skill_structuring',
    entityType: 'SKILL',
    canonicalName: 'Structuring & Frameworks',
    labels: {
      en: ['Structuring', 'Problem Structuring', 'MECE Decomposition'],
      vi: ['Cấu trúc hóa vấn đề', 'Phân rã vấn đề MECE']
    },
    aliases: [
      'structuring',
      'structure',
      'problem structuring',
      'mece',
      'framework structuring',
      'frameworks'
    ],
    vietnameseAliases: [
      'cấu trúc vấn đề',
      'cấu trúc hóa',
      'phân rã vấn đề',
      'xây dựng cấu trúc',
      'phương pháp mece',
      'build framework'
    ],
    vietnameseNoDiacriticsAliases: [
      'cau truc van de',
      'cau truc hoa',
      'phan ra van de',
      'xay dung cau truc',
      'phuong phap mece',
      'build framework'
    ],
    descriptionEn: 'Breaking down ambiguous, complex business challenges into mutually exclusive, collectively exhaustive (MECE) branches.',
    descriptionVi: 'Chia nhỏ bài toán kinh doanh phức tạp thành các nhánh giải pháp độc lập và toàn diện (nguyên tắc MECE).',
    categoryTag: 'Structuring Exercise'
  },
  {
    entityId: 'skill_executive_synthesis',
    entityType: 'SKILL',
    canonicalName: 'Executive Synthesis',
    labels: {
      en: ['Executive Synthesis', 'Minto Pyramid Principle', 'Recommendation Structuring'],
      vi: ['Tổng hợp điều hành', 'Trình bày khuyến nghị cho lãnh đạo']
    },
    aliases: [
      'executive synthesis',
      'synthesis',
      'minto pyramid',
      'recommendation',
      'executive summary'
    ],
    vietnameseAliases: [
      'tổng hợp điều hành',
      'tổng hợp khuyến nghị',
      'trình bày lãnh đạo',
      'nguyên lý minto',
      'kết luận điều hành'
    ],
    vietnameseNoDiacriticsAliases: [
      'tong hop dieu hanh',
      'tong hop khuyen nghi',
      'trinh bay lanh dao',
      'nguyen ly minto',
      'ket luan dieu hanh'
    ],
    descriptionEn: 'Communicating the core recommendation upfront backed by structured supporting arguments and risk mitigations.',
    descriptionVi: 'Trình bày thông điệp cốt lõi ngay từ đầu dựa trên nguyên lý Kim Tự Tháp Minto và kế hoạch hành động cụ thể.',
    categoryTag: 'Synthesis Drill'
  },
  {
    entityId: 'skill_business_acumen',
    entityType: 'SKILL',
    canonicalName: 'Business Acumen',
    labels: {
      en: ['Business Acumen', 'Commercial Intuition', 'Market Understanding'],
      vi: ['Nhạy bén kinh doanh', 'Hiểu biết thị trường thương mại']
    },
    aliases: [
      'business acumen',
      'commercial acumen',
      'business model understanding'
    ],
    vietnameseAliases: [
      'nhạy bén kinh doanh',
      'khả năng kinh doanh',
      'hiểu biết thương mại'
    ],
    vietnameseNoDiacriticsAliases: [
      'nhay ben kinh doanh',
      'kha nang kinh doanh',
      'hieu biet thuong mai'
    ],
    descriptionEn: 'Understanding how local commerce, regulation, and customer purchasing dynamics translate into enterprise viability.',
    descriptionVi: 'Khả năng thấu hiểu cách thức vận hành của thị trường, quy định pháp lý và hành vi mua sắm của doanh nghiệp.',
    categoryTag: 'Analysis Case'
  },

  // =======================================================================
  // 2. CASE TYPES
  // =======================================================================
  {
    entityId: 'case_market_entry',
    entityType: 'CASE_TYPE',
    canonicalName: 'Market Entry',
    labels: {
      en: ['Market Entry', 'Market Expansion', 'Geographic Expansion'],
      vi: ['Thâm nhập thị trường', 'Mở rộng thị trường', 'Gia nhập thị trường']
    },
    aliases: [
      'market entry',
      'enter market',
      'expand into market',
      'market expansion',
      'international expansion',
      'geographic entry',
      'expand market'
    ],
    vietnameseAliases: [
      'thâm nhập thị trường',
      'mở rộng sang thị trường',
      'gia nhập thị trường',
      'expand vào',
      'mở rộng thị trường',
      'tiếp cận thị trường mới',
      'có nên expand vào',
      'có nên thâm nhập thị trường'
    ],
    vietnameseNoDiacriticsAliases: [
      'tham nhap thi truong',
      'mo rong sang thi truong',
      'gia nhap thi truong',
      'expand vao',
      'mo rong thi truong',
      'tiep can thi truong moi',
      'co nen expand vao',
      'co nen tham nhap thi truong'
    ],
    descriptionEn: 'Evaluates whether and how a company should enter a new geography, demographic segment, or product category.',
    descriptionVi: 'Đánh giá tính khả thi và phương án thâm nhập vào một khu vực địa lý, nhóm khách hàng hoặc danh mục mới.',
    categoryTag: 'Strategy'
  },
  {
    entityId: 'case_profitability',
    entityType: 'CASE_TYPE',
    canonicalName: 'Profitability',
    labels: {
      en: ['Profitability', 'Profit Decline Diagnosis', 'Margin Optimization'],
      vi: ['Tối ưu lợi nhuận', 'Chẩn đoán sụt giảm lợi nhuận', 'Khả năng sinh lời']
    },
    aliases: [
      'profitability',
      'profit decline',
      'diagnose profit',
      'declining profits',
      'margin optimization',
      'p&l diagnostic'
    ],
    vietnameseAliases: [
      'khả năng sinh lời',
      'lợi nhuận',
      'lợi nhuận giảm',
      'chẩn đoán lợi nhuận',
      'tối ưu hóa lợi nhuận',
      'hỏi profitability',
      'bài toán lợi nhuận'
    ],
    vietnameseNoDiacriticsAliases: [
      'kha nang sinh loi',
      'loi nhuan',
      'loi nhuan giam',
      'chan doan loi nhuan',
      'toi uu hoa loi nhuan',
      'hoi profitability',
      'bai toan loi nhuan'
    ],
    descriptionEn: 'Diagnoses causes of shrinking margins and isolates revenue vs cost drivers to restore healthy profitability.',
    descriptionVi: 'Phân tích nguyên nhân sụt giảm lợi nhuận, tách bạch các yếu tố thúc đẩy doanh thu và cấu trúc chi phí.',
    categoryTag: 'Financial Analysis'
  },
  {
    entityId: 'case_growth',
    entityType: 'CASE_TYPE',
    canonicalName: 'Growth Strategy',
    labels: {
      en: ['Growth Strategy', 'Scale-up Strategy', 'Organic vs Inorganic Growth'],
      vi: ['Chiến lược tăng trưởng', 'Mở rộng quy mô']
    },
    aliases: [
      'growth',
      'growth strategy',
      'scaling strategy',
      'user growth',
      'revenue growth'
    ],
    vietnameseAliases: [
      'chiến lược tăng trưởng',
      'tăng trưởng',
      'tăng trưởng người dùng',
      'mở rộng quy mô doanh thu'
    ],
    vietnameseNoDiacriticsAliases: [
      'chien luoc tang truong',
      'tang truong',
      'tang truong nguoi dung',
      'mo rong quy mo doanh thu'
    ],
    descriptionEn: 'Formulates levers for accelerating customer acquisition, retention, and market share.',
    descriptionVi: 'Xác định các đòn bẩy thúc đẩy mở rộng tập khách hàng, cải thiện tỷ lệ giữ chân và mở rộng thị phần.',
    categoryTag: 'Growth'
  },
  {
    entityId: 'case_pricing',
    entityType: 'CASE_TYPE',
    canonicalName: 'Pricing Strategy',
    labels: {
      en: ['Pricing Strategy', 'Monetization', 'Value-Based Pricing'],
      vi: ['Chiến lược định giá', 'Mô hình giá']
    },
    aliases: [
      'pricing',
      'pricing strategy',
      'monetization',
      'price optimization',
      'value based pricing'
    ],
    vietnameseAliases: [
      'định giá',
      'chiến lược định giá',
      'mô hình tính giá',
      'tối ưu giá bán'
    ],
    vietnameseNoDiacriticsAliases: [
      'dinh gia',
      'chien luoc dinh gia',
      'mo hinh tinh gia',
      'toi uu gia ban'
    ],
    descriptionEn: 'Structures tiers, price elasticities, and willingness-to-pay to optimize revenue and market capture.',
    descriptionVi: 'Hoạch định các gói giá, độ co giãn của cầu và mức độ sẵn sàng chi trả của khách hàng.',
    categoryTag: 'Monetization'
  },

  // =======================================================================
  // 3. KNOWLEDGE UNITS & FRAMEWORKS
  // =======================================================================
  {
    entityId: 'knowledge_unit_economics',
    entityType: 'KNOWLEDGE',
    canonicalName: 'Unit Economics Framework',
    labels: {
      en: ['Unit Economics Framework', 'LTV/CAC Rule', 'Payback Period Benchmark'],
      vi: ['Khung phân tích kinh tế đơn vị', 'Nguyên tắc LTV/CAC', 'Thời gian hoàn vốn']
    },
    aliases: [
      'unit economics framework',
      'ltv/cac rule',
      'cac payback',
      'contribution margin model'
    ],
    vietnameseAliases: [
      'khung kinh tế đơn vị',
      'phân tích ltv cac',
      'mô hình hoàn vốn cac',
      'tỷ suất lợi nhuận đóng góp'
    ],
    vietnameseNoDiacriticsAliases: [
      'khung kinh te don vi',
      'phan tich ltv cac',
      'mo hinh hoan von cac',
      'ty suat loi nhuan dong gop'
    ],
    descriptionEn: 'The mathematical discipline that requires customer lifetime value to exceed 3x CAC with payback under 12-14 months.',
    descriptionVi: 'Khung định lượng đòi hỏi giá trị trọn đời khách hàng phải gấp 3 lần chi phí thu hút và thời gian hoàn vốn dưới 14 tháng.',
    categoryTag: 'Framework'
  },
  {
    entityId: 'knowledge_market_entry',
    entityType: 'KNOWLEDGE',
    canonicalName: 'Market Entry Framework',
    labels: {
      en: ['Market Entry Framework', 'Market Attractiveness & Feasibility Matrix'],
      vi: ['Khung thâm nhập thị trường', 'Ma trận hấp dẫn thị trường']
    },
    aliases: [
      'market entry framework',
      'market attractiveness',
      'market feasibility',
      'go-to-market framework'
    ],
    vietnameseAliases: [
      'khung thâm nhập thị trường',
      'ma trận hấp dẫn thị trường',
      'đánh giá tính khả thi thị trường'
    ],
    vietnameseNoDiacriticsAliases: [
      'khung tham nhap thi truong',
      'ma tran hap dan thi truong',
      'danh gia tinh kha thi thi truong'
    ],
    descriptionEn: 'Evaluates market attractiveness (TAM, CAGR), competitive barriers, company capabilities, and financial ROI.',
    descriptionVi: 'Đánh giá mức độ hấp dẫn của thị trường (TAM, tốc độ tăng trưởng), rào cản cạnh tranh và năng lực nội tại.',
    categoryTag: 'Framework'
  },
  {
    entityId: 'knowledge_tam_sam_som',
    entityType: 'KNOWLEDGE',
    canonicalName: 'TAM / SAM / SOM Sizing Framework',
    labels: {
      en: ['TAM / SAM / SOM Framework', 'Addressable Market Decomposition'],
      vi: ['Mô hình TAM / SAM / SOM', 'Phân rã quy mô thị trường mục tiêu']
    },
    aliases: [
      'tam sam som',
      'tam / sam / som',
      'tam sam som framework',
      'top-down market sizing',
      'bottom-up market sizing'
    ],
    vietnameseAliases: [
      'mô hình tam sam som',
      'phân rã thị trường tam sam som',
      'ước lượng tam',
      'tính tam sam som'
    ],
    vietnameseNoDiacriticsAliases: [
      'mo hinh tam sam som',
      'phan ra thi truong tam sam som',
      'uoc luong tam',
      'tinh tam sam som'
    ],
    descriptionEn: 'Rigorous top-down and bottom-up methodology to calculate Total Addressable Market, Serviceable Market, and Obtainable Market.',
    descriptionVi: 'Phương pháp từ trên xuống (top-down) và từ dưới lên (bottom-up) để xác định dung lượng thị trường thực tế.',
    categoryTag: 'Framework'
  },
  {
    entityId: 'knowledge_profitability_tree',
    entityType: 'KNOWLEDGE',
    canonicalName: 'Profitability Tree (Revenue / Cost Drivers)',
    labels: {
      en: ['Profitability Tree', 'Revenue & Cost Decomposition', 'P&L Driver Tree'],
      vi: ['Cây phân tích lợi nhuận', 'Phân rã Doanh thu & Chi phí']
    },
    aliases: [
      'profitability tree',
      'revenue drivers',
      'cost drivers',
      'revenue cost structure',
      'profit tree'
    ],
    vietnameseAliases: [
      'cây lợi nhuận',
      'phân tích doanh thu chi phí',
      'structure theo revenue/cost',
      'cấu trúc doanh thu và chi phí'
    ],
    vietnameseNoDiacriticsAliases: [
      'cay loi nhuan',
      'phan tich doanh thu chi phi',
      'structure theo revenue/cost',
      'cau truc doanh thu va chi phi'
    ],
    descriptionEn: 'Deconstructs profit into Price × Volume for revenue, and Fixed vs Variable expenses for cost structure.',
    descriptionVi: 'Chia nhỏ lợi nhuận thành Doanh thu (Giá bán × Sản lượng) và Chi phí (Định phí và Biến phí).',
    categoryTag: 'Framework'
  },
  {
    entityId: 'knowledge_competitive_analysis',
    entityType: 'KNOWLEDGE',
    canonicalName: "Porter's Five Forces",
    labels: {
      en: ["Porter's Five Forces", 'Industry Structure Framework'],
      vi: ['Mô hình 5 áp lực cạnh tranh của Porter', 'Khung phân tích cấu trúc ngành']
    },
    aliases: [
      "porter's five forces",
      'porter five forces',
      'five forces',
      'competitive forces'
    ],
    vietnameseAliases: [
      'mô hình 5 áp lực cạnh tranh',
      '5 áp lực của porter',
      'khung porter 5 forces'
    ],
    vietnameseNoDiacriticsAliases: [
      'mo hinh 5 ap luc canh tranh',
      '5 ap luc cua porter',
      'khung porter 5 forces'
    ],
    descriptionEn: 'Analyzes buyer power, supplier power, threat of new entrants, threat of substitutes, and existing rivalry.',
    descriptionVi: 'Đánh giá sức mạnh của người mua, nhà cung cấp, nguy cơ từ đối thủ mới, sản phẩm thay thế và mức độ cạnh tranh hiện tại.',
    categoryTag: 'Framework'
  },
  {
    entityId: 'knowledge_customer_segmentation',
    entityType: 'KNOWLEDGE',
    canonicalName: 'Customer Segmentation & Beachhead Strategy',
    labels: {
      en: ['Customer Segmentation', 'Beachhead Strategy', 'ICP Definition'],
      vi: ['Phân khúc khách hàng', 'Chiến lược thị trường bàn đạp']
    },
    aliases: [
      'customer segmentation',
      'segmentation',
      'customer segment',
      'beachhead strategy',
      'ideal customer profile'
    ],
    vietnameseAliases: [
      'phân khúc khách hàng',
      'thị trường bàn đạp',
      'khách hàng mục tiêu',
      'structure theo customer segment'
    ],
    vietnameseNoDiacriticsAliases: [
      'phan khuc khach hang',
      'thi truong ban dap',
      'khach hang muc tieu',
      'structure theo customer segment'
    ],
    descriptionEn: 'Identifies high-propensity target personas to achieve initial density before broadening out.',
    descriptionVi: 'Phân nhóm khách hàng mục tiêu có mức độ cấp thiết cao nhất để làm bàn đạp mở rộng thị trường.',
    categoryTag: 'Framework'
  },

  // =======================================================================
  // 4. INDUSTRIES
  // =======================================================================
  {
    entityId: 'industry_fintech',
    entityType: 'INDUSTRY',
    canonicalName: 'Fintech & Financial Technology',
    labels: {
      en: ['Fintech', 'Financial Technology', 'Digital Payments & Neobanking'],
      vi: ['Công nghệ tài chính (Fintech)', 'Thanh toán điện tử & Ngân hàng số']
    },
    aliases: [
      'fintech',
      'financial technology',
      'digital banking',
      'payments infrastructure',
      'neobanking'
    ],
    vietnameseAliases: [
      'công nghệ tài chính',
      'thanh toán số',
      'ngân hàng số',
      'ví điện tử'
    ],
    vietnameseNoDiacriticsAliases: [
      'cong nghe tai chinh',
      'thanh toan so',
      'ngan hang so',
      'vi dien tu'
    ],
    descriptionEn: 'Software services transforming financial operations, transactions, credit scoring, and treasury management.',
    descriptionVi: 'Ngành ứng dụng công nghệ trong thanh toán, ngân hàng số, chấm điểm tín dụng và quản lý tài chính.',
    categoryTag: 'Industry'
  },
  {
    entityId: 'industry_saas',
    entityType: 'INDUSTRY',
    canonicalName: 'B2B Enterprise SaaS & Cloud Software',
    labels: {
      en: ['Enterprise SaaS', 'B2B Software', 'Cloud Solutions'],
      vi: ['Phần mềm dịch vụ doanh nghiệp (B2B SaaS)', 'Phần mềm đám mây']
    },
    aliases: [
      'saas',
      'b2b saas',
      'enterprise saas',
      'software as a service',
      'cloud software'
    ],
    vietnameseAliases: [
      'phần mềm doanh nghiệp',
      'phần mềm dạng dịch vụ',
      'phần mềm đám mây'
    ],
    vietnameseNoDiacriticsAliases: [
      'phan mem doanh nghiep',
      'phan mem dang dich vu',
      'phan mem dam may'
    ],
    descriptionEn: 'Recurring revenue subscription software hosted in the cloud for business workflow and collaboration.',
    descriptionVi: 'Mô hình phần mềm đăng ký thuê bao lưu trữ trên đám mây phục vụ quy trình làm việc của doanh nghiệp.',
    categoryTag: 'Industry'
  },
  {
    entityId: 'industry_ecommerce',
    entityType: 'INDUSTRY',
    canonicalName: 'E-commerce & Digital Marketplaces',
    labels: {
      en: ['E-commerce', 'Digital Marketplaces', 'Retail Tech'],
      vi: ['Thương mại điện tử', 'Sàn giao dịch trực tuyến']
    },
    aliases: [
      'ecommerce',
      'e-commerce',
      'online marketplace',
      'digital retail'
    ],
    vietnameseAliases: [
      'thương mại điện tử',
      'sàn thương mại điện tử',
      'bán lẻ trực tuyến'
    ],
    vietnameseNoDiacriticsAliases: [
      'thuong mai dien tu',
      'san thuong mai dien tu',
      'ban le truc tuyen'
    ],
    descriptionEn: 'Platforms connecting multi-sided buyers and sellers with localized fulfillment and payments.',
    descriptionVi: 'Các nền tảng kết nối người mua và người bán trực tuyến đi kèm dịch vụ logistics và thanh toán tích hợp.',
    categoryTag: 'Industry'
  },

  // =======================================================================
  // 5. METRICS
  // =======================================================================
  {
    entityId: 'metric_market_size',
    entityType: 'METRIC',
    canonicalName: 'Market Size & Revenue TAM',
    labels: {
      en: ['Market Size', 'Total Addressable Market', 'Market Value'],
      vi: ['Quy mô thị trường', 'Giá trị thị trường']
    },
    aliases: [
      'market size',
      'tam value',
      'market valuation'
    ],
    vietnameseAliases: [
      'quy mô thị trường',
      'giá trị thị trường',
      'dung lượng thị trường'
    ],
    vietnameseNoDiacriticsAliases: [
      'quy mo thi truong',
      'gia tri thi truong',
      'dung luong thi truong'
    ],
    descriptionEn: 'Total monetary transaction volume or addressable revenue capacity of a sector.',
    descriptionVi: 'Tổng giá trị giao dịch hoặc dung lượng doanh thu tiềm năng của một lĩnh vực.',
    categoryTag: 'Metric'
  },
  {
    entityId: 'metric_churn',
    entityType: 'METRIC',
    canonicalName: 'Customer Churn Rate',
    labels: {
      en: ['Churn Rate', 'Attrition Rate', 'Customer Drop-off'],
      vi: ['Tỷ lệ rời bỏ khách hàng', 'Tỷ lệ churn']
    },
    aliases: [
      'churn',
      'churn rate',
      'customer attrition',
      'logo churn'
    ],
    vietnameseAliases: [
      'khách hàng churn',
      'tỷ lệ rời bỏ',
      'tỷ lệ mất khách',
      'churn rất cao'
    ],
    vietnameseNoDiacriticsAliases: [
      'khach hang churn',
      'ty le roi bo',
      'ty le mat khach',
      'churn rat cao'
    ],
    descriptionEn: 'The percentage of customers or contract revenue lost over a defined period.',
    descriptionVi: 'Tỷ lệ khách hàng hoặc doanh thu hợp đồng bị mất trong một khoảng thời gian nhất định.',
    categoryTag: 'Metric'
  },
  {
    entityId: 'metric_cac',
    entityType: 'METRIC',
    canonicalName: 'Customer Acquisition Cost (CAC)',
    labels: {
      en: ['Customer Acquisition Cost', 'CAC', 'Cost per Acquisition'],
      vi: ['Chi phí thu hút khách hàng', 'Chi phí có được khách hàng']
    },
    aliases: [
      'cac',
      'customer acquisition cost',
      'cost per customer'
    ],
    vietnameseAliases: [
      'chi phí thu hút khách hàng',
      'chi phí mua khách hàng'
    ],
    vietnameseNoDiacriticsAliases: [
      'chi phi thu hut khach hang',
      'chi phi mua khach hang'
    ],
    descriptionEn: 'Total sales and marketing expenditure divided by the number of new customers acquired.',
    descriptionVi: 'Tổng chi phí bán hàng và tiếp thị chia cho số lượng khách hàng mới thu hút được.',
    categoryTag: 'Metric'
  },
  {
    entityId: 'metric_ltv',
    entityType: 'METRIC',
    canonicalName: 'Customer Lifetime Value (LTV)',
    labels: {
      en: ['Customer Lifetime Value', 'LTV', 'Customer Value'],
      vi: ['Giá trị trọn đời khách hàng', 'Giá trị vòng đời khách hàng']
    },
    aliases: [
      'ltv',
      'lifetime value',
      'customer lifetime value'
    ],
    vietnameseAliases: [
      'giá trị trọn đời khách hàng',
      'giá trị vòng đời'
    ],
    vietnameseNoDiacriticsAliases: [
      'gia tri tron doi khach hang',
      'gia tri vong doi'
    ],
    descriptionEn: 'The net gross profit a customer contributes across their entire relationship with the company.',
    descriptionVi: 'Tổng lợi nhuận gộp mà một khách hàng đóng góp trong toàn bộ thời gian sử dụng sản phẩm.',
    categoryTag: 'Metric'
  },

  // =======================================================================
  // 6. ROLES
  // =======================================================================
  {
    entityId: 'role_product_strategy_manager',
    entityType: 'ROLE',
    canonicalName: 'Product Strategy Manager',
    labels: {
      en: ['Product Strategy Manager', 'Lead Product Strategist'],
      vi: ['Quản lý chiến lược sản phẩm', 'Trưởng nhóm chiến lược sản phẩm']
    },
    aliases: [
      'product strategy manager',
      'lead product strategist',
      'director of product strategy'
    ],
    vietnameseAliases: [
      'quản lý chiến lược sản phẩm',
      'chuyên viên chiến lược sản phẩm'
    ],
    vietnameseNoDiacriticsAliases: [
      'quan ly chien luoc san pham',
      'chuyen vien chien luoc san pham'
    ],
    descriptionEn: 'Orchestrates product portfolio expansion, addressable sizing, and go-to-market monetization.',
    descriptionVi: 'Chịu trách nhiệm mở rộng danh mục sản phẩm, định cỡ thị trường và mô hình thương mại hóa.',
    categoryTag: 'Role'
  },
  {
    entityId: 'role_product_manager',
    entityType: 'ROLE',
    canonicalName: 'Product Manager',
    labels: {
      en: ['Product Manager', 'Senior Product Manager', 'PM'],
      vi: ['Quản lý sản phẩm', 'Chuyên viên sản phẩm (PM)']
    },
    aliases: [
      'product manager',
      'senior product manager',
      'group product manager'
    ],
    vietnameseAliases: [
      'quản lý sản phẩm',
      'chuyên viên sản phẩm',
      'job pm',
      'apply pm'
    ],
    vietnameseNoDiacriticsAliases: [
      'quan ly san pham',
      'chuyen vien san pham',
      'job pm',
      'apply pm'
    ],
    descriptionEn: 'Drives the product vision, roadmap, customer discovery, and cross-functional feature delivery.',
    descriptionVi: 'Định hình tầm nhìn sản phẩm, lộ trình tính năng và phối hợp cùng các bộ phận kỹ thuật để hiện thực hóa.',
    categoryTag: 'Role'
  },
  {
    entityId: 'role_project_manager',
    entityType: 'ROLE',
    canonicalName: 'Project Manager',
    labels: {
      en: ['Project Manager', 'Technical Project Manager', 'Delivery Manager'],
      vi: ['Quản lý dự án', 'Điều phối dự án']
    },
    aliases: [
      'project manager',
      'delivery manager',
      'pmo manager'
    ],
    vietnameseAliases: [
      'quản lý dự án',
      'điều phối dự án'
    ],
    vietnameseNoDiacriticsAliases: [
      'quan ly du an',
      'dieu phoi du an'
    ],
    descriptionEn: 'Focuses on execution timelines, resource scheduling, critical paths, and deliverable commitments.',
    descriptionVi: 'Tập trung vào tiến độ thực hiện, phân bổ nguồn lực, quản lý rủi ro và các cam kết bàn giao.',
    categoryTag: 'Role'
  }
];

// =========================================================================
// CAREER ABBREVIATION DICTIONARY WITH CONTEXT DISAMBIGUATION
// =========================================================================
export const CAREER_ABBREVIATIONS: Record<string, AbbreviationDefinition> = {
  'PM': {
    abbreviation: 'PM',
    canonicalId: 'role_product_manager',
    fullTitle: 'Product Manager',
    contextSignals: ['product', 'discovery', 'roadmap', 'feature', 'user', 'customer', 'strategy', 'backlog', 'stakeholder'],
    conflictingOptions: [
      {
        canonicalId: 'role_project_manager',
        fullTitle: 'Project Manager',
        contextSignals: ['timeline', 'schedule', 'delivery', 'gantt', 'deadline', 'resource', 'pmo', 'budget', 'milestone']
      }
    ]
  },
  'PO': {
    abbreviation: 'PO',
    canonicalId: 'role_product_owner',
    fullTitle: 'Product Owner',
    contextSignals: ['scrum', 'agile', 'sprint', 'backlog', 'user story', 'acceptance criteria']
  },
  'BA': {
    abbreviation: 'BA',
    canonicalId: 'role_business_analyst',
    fullTitle: 'Business Analyst',
    contextSignals: ['requirements', 'brd', 'user flow', 'process mapping', 'sql', 'system']
  },
  'DA': {
    abbreviation: 'DA',
    canonicalId: 'role_data_analyst',
    fullTitle: 'Data Analyst',
    contextSignals: ['sql', 'bi', 'tableau', 'dashboard', 'query', 'reporting', 'analytics']
  },
  'DS': {
    abbreviation: 'DS',
    canonicalId: 'role_data_scientist',
    fullTitle: 'Data Scientist',
    contextSignals: ['machine learning', 'python', 'predictive', 'algorithms', 'ai', 'modeling']
  },
  'EM': {
    abbreviation: 'EM',
    canonicalId: 'role_engineering_manager',
    fullTitle: 'Engineering Manager',
    contextSignals: ['team', 'engineering', '1on1', 'hiring', 'architecture', 'tech lead']
  },
  'TPM': {
    abbreviation: 'TPM',
    canonicalId: 'role_technical_program_manager',
    fullTitle: 'Technical Program Manager',
    contextSignals: ['cross-org', 'technical dependencies', 'infrastructure', 'architecture']
  },
  'SWE': {
    abbreviation: 'SWE',
    canonicalId: 'role_software_engineer',
    fullTitle: 'Software Engineer',
    contextSignals: ['code', 'backend', 'frontend', 'system design', 'algorithms', 'database']
  },
  'UX': {
    abbreviation: 'UX',
    canonicalId: 'skill_user_experience',
    fullTitle: 'User Experience',
    contextSignals: ['wireframe', 'usability', 'figma', 'design', 'user interview', 'prototype']
  },
  'UI': {
    abbreviation: 'UI',
    canonicalId: 'skill_user_interface',
    fullTitle: 'User Interface',
    contextSignals: ['visual', 'design tokens', 'component library', 'typography', 'color']
  },
  'GTM': {
    abbreviation: 'GTM',
    canonicalId: 'skill_go_to_market',
    fullTitle: 'Go-to-Market',
    contextSignals: ['launch', 'commercialization', 'distribution', 'sales channel', 'marketing']
  },
  'TAM': {
    abbreviation: 'TAM',
    canonicalId: 'knowledge_tam_sam_som',
    fullTitle: 'Total Addressable Market',
    contextSignals: ['market sizing', 'som', 'sam', 'market size', 'addressable', 'revenue']
  },
  'CAC': {
    abbreviation: 'CAC',
    canonicalId: 'metric_cac',
    fullTitle: 'Customer Acquisition Cost',
    contextSignals: ['ltv', 'payback', 'marketing spend', 'acquisition', 'unit economics']
  },
  'LTV': {
    abbreviation: 'LTV',
    canonicalId: 'metric_ltv',
    fullTitle: 'Customer Lifetime Value',
    contextSignals: ['cac', 'payback', 'retention', 'margin', 'unit economics', 'churn']
  },
  'NRR': {
    abbreviation: 'NRR',
    canonicalId: 'metric_nrr',
    fullTitle: 'Net Revenue Retention',
    contextSignals: ['saas', 'expansion', 'churn', 'contract', 'arr']
  },
  'ARR': {
    abbreviation: 'ARR',
    canonicalId: 'metric_arr',
    fullTitle: 'Annual Recurring Revenue',
    contextSignals: ['saas', 'subscription', 'mrr', 'recurring', 'revenue']
  },
  'MRR': {
    abbreviation: 'MRR',
    canonicalId: 'metric_mrr',
    fullTitle: 'Monthly Recurring Revenue',
    contextSignals: ['saas', 'subscription', 'arr', 'monthly']
  }
};

export class CanonicalOntology {
  static getEntities(): CanonicalEntity[] {
    return CANONICAL_ONTOLOGY_ENTITIES;
  }

  static findEntity(idOrName: string): CanonicalEntity | undefined {
    const q = idOrName.toLowerCase();
    return CANONICAL_ONTOLOGY_ENTITIES.find(e => 
      e.entityId.toLowerCase() === q || 
      e.canonicalName.toLowerCase() === q ||
      e.aliases.some(a => a.toLowerCase() === q)
    );
  }

  static resolveEntity(termOrId: string): CanonicalEntity | undefined {
    return this.findEntity(termOrId);
  }

  static findMatchingEntities(text: string): CanonicalEntity[] {
    const q = (text || '').toLowerCase();
    if (!q) return [];
    return CANONICAL_ONTOLOGY_ENTITIES.filter(e => 
      q.includes(e.canonicalName.toLowerCase()) ||
      e.aliases.some(a => q.includes(a.toLowerCase())) ||
      e.vietnameseAliases.some(va => q.includes(va.toLowerCase()))
    );
  }
}
