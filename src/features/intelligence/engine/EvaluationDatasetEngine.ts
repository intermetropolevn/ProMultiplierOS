// =========================================================================
// CAREER INTELLIGENCE ENGINE - EVALUATION DATASET ENGINE (SECTION 8)
// =========================================================================

import { 
  AgentTrajectoryRecord, 
  DatasetPartition, 
  EvaluationDatasetExample,
  CareerFailureType
} from './types';

export class EvaluationDatasetEngine {
  private static dataset: EvaluationDatasetExample[] = [
    {
      id: 'eval_ex_001',
      task: 'Tính toán unit economics và LTV:CAC cho case SaaS B2B tại Việt Nam',
      input: 'Doanh nghiệp SaaS B2B có chi phí marketing $12,000, thu hút 50 khách hàng mới. ARPU là $80/tháng, biên lợi nhuận gộp 80%, churn 5%/tháng. Tính CAC, LTV và đánh giá tính khả thi.',
      context: 'Retrieved SaaS Benchmark 2026, CAC/LTV formulas, and Vietnamese market discount rate.',
      expectedProperties: ['CAC = $240', 'LTV = $1,280', 'LTV:CAC = 5.33x', 'Payback Period = 3.75 tháng', 'Khả thi cao (>3x)'],
      trajectoryId: 'run_sample_01',
      trajectorySummary: 'Routed to L3 Case Analysis → Code Sandbox calculation → Verifier passed with 98% math accuracy.',
      finalOutput: 'CAC = $240 USD, LTV = $1,280 USD, Tỷ lệ LTV:CAC = 5.33x. Mô hình unit economics rất lành mạnh và vượt chuẩn 3.0x của ngành.',
      verifierScore: 0.98,
      humanFeedback: 'Chính xác và giải thích rõ ràng từng bước.',
      outcome: 'success',
      partition: 'regression',
      tags: ['case_analysis', 'quantitative', 'saas'],
      createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    },
    {
      id: 'eval_ex_002',
      task: 'Tối ưu CV ứng tuyển vị trí Senior Frontend Engineer tại Shopee',
      input: 'Hồ sơ có 4 năm kinh nghiệm React, TypeScript, Next.js, Redux. Mục tiêu thể hiện leadership và tối ưu performance.',
      context: 'Shopee Senior Frontend JD, React/TypeScript skills from Canonical Skill Registry.',
      expectedProperties: ['Quantified business impact', 'Lighthouse 95+', 'Bundle size reduction', 'STAR framework bullet points'],
      trajectoryId: 'run_sample_02',
      trajectorySummary: 'Routed to L1 Contextual Match → Extracted key skills → Injected metrics into experience bullets.',
      finalOutput: 'Tái cấu trúc 4 bullet points chuẩn STAR: Tối ưu P99 latency từ 420ms xuống 110ms, giảm bundle size 34%, dẫn dắt squad 5 kỹ sư.',
      verifierScore: 0.94,
      humanFeedback: 'Cực kỳ ưng ý cách lượng hóa kết quả.',
      outcome: 'success',
      partition: 'validation',
      tags: ['cv_tailoring', 'frontend', 'shopee'],
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
    {
      id: 'eval_ex_003',
      task: 'Mô phỏng phỏng vấn STAR cho câu hỏi xung đột quan điểm kỹ thuật',
      input: 'Hãy trả lời câu hỏi: "Kể về một lần bạn và Tech Lead bất đồng ý kiến về kiến trúc microservices và bạn đã xử lý thế nào?"',
      context: 'STAR Interview Rubric, Behavioral competency: Conflict Resolution, Architectural trade-offs.',
      expectedProperties: ['Situation', 'Task', 'Action', 'Result', 'Focus on data-driven consensus and mutual respect'],
      trajectoryId: 'run_sample_03',
      trajectorySummary: 'Initial draft lacked Result metric → RubricVerifier flagged failure → Revision remedy injected quantitative result.',
      finalOutput: 'Phân tích theo STAR: Bối cảnh chọn GraphQL vs gRPC, hành động tạo POC benchmark đo latency, kết quả thống nhất dùng gRPC giảm 40% network overhead.',
      verifierScore: 0.92,
      humanFeedback: 'Chuẩn format STAR, phản ánh đúng thực tế kỹ thuật.',
      outcome: 'success',
      partition: 'hard_cases',
      tags: ['interview_simulation', 'behavioral', 'star_framework'],
      createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    },
    {
      id: 'eval_ex_004',
      task: 'Phân tích khoảng cách kỹ năng (Skill-gap) cho chuyển ngành Data Scientist',
      input: 'Ứng viên là Backend Java 3 năm kinh nghiệm, muốn chuyển sang Machine Learning / Data Scientist tại VNG.',
      context: 'VNG Data Scientist JD, Java developer profile, Data/ML canonical taxonomy.',
      expectedProperties: ['Identify transferable skills (SQL, OOP)', 'Highlight missing gaps (Math/Stats, PyTorch, MLOps)', 'Step-by-step roadmap'],
      trajectoryId: 'run_sample_04',
      trajectorySummary: 'L2 Skill-Gap Matrix → Mapped Java skills against PyTorch/Statistics gaps.',
      finalOutput: 'Khoảng cách cốt lõi: Thiếu thực chiến mô hình Deep Learning và xác suất thống kê. Lộ trình 6 tháng: Python/Pandas → Scikit-Learn → Deep Learning Specialization.',
      verifierScore: 0.89,
      outcome: 'success',
      partition: 'test',
      tags: ['skill_gap_analysis', 'data_science', 'career_transition'],
      createdAt: new Date().toISOString(),
    },
    {
      id: 'eval_ex_005',
      task: 'Nghiên cứu văn hóa doanh nghiệp và mô hình kinh doanh của VinAI',
      input: 'Tổng hợp văn hóa làm việc, đội ngũ lãnh đạo, các sản phẩm AI trọng điểm và tiêu chí phỏng vấn tại VinAI.',
      context: 'Research Papers Data, VinAI Smart Mobility papers, and verified sources ledger.',
      expectedProperties: ['Smart Mobility AI', 'Top-tier conference publications (CVPR, NeurIPS)', 'High research rigor'],
      trajectoryId: 'run_sample_05',
      trajectorySummary: 'Triggered L4 Deep Research Engine → Synthesized conflicting viewpoints and verified citations.',
      finalOutput: 'VinAI định hướng nghiên cứu ứng dụng hàng đầu khu vực: Sản phẩm nòng cốt là Smart Mobility (Driver Monitoring System), ưu tiên ứng viên có ấn phẩm tại NeurIPS/CVPR.',
      verifierScore: 0.96,
      outcome: 'success',
      partition: 'train',
      tags: ['company_research', 'vinai', 'deep_research'],
      createdAt: new Date().toISOString(),
    }
  ];

  /**
   * Automatically extracts and ingests an evaluation example from a completed trajectory.
   */
  public static ingestTrajectoryAsExample(
    trajectory: AgentTrajectoryRecord,
    options?: {
      partition?: DatasetPartition;
      humanFeedback?: string;
    }
  ): EvaluationDatasetExample {
    const runId = trajectory.runId;
    const prompt = trajectory.task.rawPrompt;
    const isSuccess = trajectory.verificationResult.passed;
    const score = trajectory.verificationResult.score;
    const revisionsCount = trajectory.revisions.length;
    const failureType = trajectory.diagnosticAnswers?.failureReason.primaryTaxonomy;

    // Automatic partition assignment:
    // If revisions were needed or score was borderline -> hard_cases
    // Otherwise split deterministically
    let assignedPartition: DatasetPartition = options?.partition || 'validation';
    if (!options?.partition) {
      if (revisionsCount > 0 || score < 0.80 || !isSuccess) {
        assignedPartition = 'hard_cases';
      } else if (trajectory.routerDecision.complexity === 'high' || trajectory.routerDecision.complexity === 'very_high' || trajectory.routerDecision.suggestedLevel === 'L4') {
        assignedPartition = 'regression';
      } else {
        const hash = prompt.length % 3;
        assignedPartition = hash === 0 ? 'train' : (hash === 1 ? 'test' : 'validation');
      }
    }

    const example: EvaluationDatasetExample = {
      id: `eval_ex_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      task: prompt.slice(0, 80),
      input: prompt,
      context: `Snapshot: ${trajectory.contextSnapshot.retrievedItemsCount} items, entities: [${trajectory.contextSnapshot.entitiesDetected.join(', ')}]`,
      expectedProperties: trajectory.routerDecision.requiresTools ? ['tool_execution_required', 'accurate_information'] : ['accurate_information', 'career_context'],
      trajectoryId: runId,
      trajectorySummary: `${trajectory.routerDecision.suggestedLevel} Tier • ${trajectory.executionSteps.length} step(s) • Status: ${trajectory.runtimeStats.finalStatus}`,
      finalOutput: trajectory.finalOutput.text.slice(0, 300),
      verifierScore: score,
      humanFeedback: options?.humanFeedback,
      outcome: isSuccess ? (revisionsCount > 0 ? 'partial' : 'success') : 'failure',
      failureType: failureType !== 'none' ? failureType : undefined,
      partition: assignedPartition,
      tags: [trajectory.routerDecision.taskType, trajectory.routerDecision.complexity],
      createdAt: new Date().toISOString(),
    };

    this.dataset.unshift(example);
    if (this.dataset.length > 150) this.dataset.pop();

    return example;
  }

  public static getAllExamples(): EvaluationDatasetExample[] {
    return [...this.dataset];
  }

  public static getExamplesByPartition(partition: DatasetPartition): EvaluationDatasetExample[] {
    return this.dataset.filter(ex => ex.partition === partition);
  }

  /**
   * Safety Leakage Check (Section 8):
   * Ensures that no test, regression, or hard-cases examples are leaked into optimization training.
   */
  public static isEvaluationLeakageFree(trainingSampleIds: string[]): {
    isClean: boolean;
    leakedIds: string[];
  } {
    const protectedIds = new Set(
      this.dataset
        .filter(ex => ex.partition === 'test' || ex.partition === 'regression' || ex.partition === 'hard_cases')
        .map(ex => ex.id)
    );

    const leakedIds = trainingSampleIds.filter(id => protectedIds.has(id));
    return {
      isClean: leakedIds.length === 0,
      leakedIds,
    };
  }

  public static getDatasetStats(): Record<DatasetPartition, number> {
    const stats: Record<DatasetPartition, number> = {
      train: 0,
      validation: 0,
      test: 0,
      regression: 0,
      hard_cases: 0,
    };

    this.dataset.forEach(ex => {
      if (stats[ex.partition] !== undefined) {
        stats[ex.partition]++;
      }
    });

    return stats;
  }
}
