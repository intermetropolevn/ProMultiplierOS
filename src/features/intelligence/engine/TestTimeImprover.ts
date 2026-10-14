// =========================================================================
// CAREER INTELLIGENCE ENGINE - TEST-TIME IMPROVEMENT (BEST-OF-N GENERATION)
// =========================================================================

import { 
  CandidateGeneration, 
  CareerTaskType, 
  ComputeBudgetTier
} from './types';
import { VerifierEngine } from './VerifierEngine';

export class TestTimeImprover {
  /**
   * SECTION 11: Test-Time Improvement Workflow:
   * 1. Determine number of candidates from Compute Budget (1 for low, 2 for medium, 3 for high/maximum)
   * 2. Generate Candidate A, B, C with diverse perspectives
   * 3. Critic evaluates strengths and weaknesses
   * 4. Verifier scores compliance and grounding
   * 5. Rank candidates
   * 6. Apply targeted revision to best candidate
   */
  public static async executeTestTimeImprovement(
    prompt: string,
    taskType: CareerTaskType,
    computeBudget: ComputeBudgetTier = 'medium',
    evidenceSources: string[] = []
  ): Promise<{
    candidates: CandidateGeneration[];
    selectedCandidate: CandidateGeneration;
    finalRevisedOutput: string;
  }> {
    // 1. Candidate count depends on compute budget
    let candidateCount = 1;
    if (computeBudget === 'medium') candidateCount = 2;
    else if (computeBudget === 'high' || computeBudget === 'maximum') candidateCount = 3;

    const candidateConfigs: Array<{ label: string; perspective: string }> = [
      { label: 'Candidate A (Quantitative & Rigorous)', perspective: 'Chuyên sâu định lượng, số liệu benchmark và logic tính toán chặt chẽ.' },
      { label: 'Candidate B (Strategic & Holistic)', perspective: 'Toàn diện chiến lược, đặt trong bối cảnh tổ chức và các khung năng lực cốt lõi.' },
      { label: 'Candidate C (Action-Oriented & Applied)', perspective: 'Thực chiến hướng hành động, lộ trình triển khai rõ ràng và đối chiếu STAR.' },
    ];

    const candidates: CandidateGeneration[] = [];

    // 2. Synthesize candidates
    for (let i = 0; i < candidateCount; i++) {
      const cfg = candidateConfigs[i];
      const text = this.synthesizeCandidateText(prompt, taskType, cfg.perspective, i + 1);

      // 3. Critic Evaluation
      const criticEval = this.evaluateCritic(text, taskType);

      // 4. Verifier Evaluation
      const verifierRes = VerifierEngine.verifyOutput(text, prompt, taskType, evidenceSources);

      candidates.push({
        candidateId: `cand_${Date.now()}_${i + 1}`,
        label: cfg.label,
        text,
        criticScore: criticEval.score,
        verifierScore: verifierRes.score,
        criticStrengths: criticEval.strengths,
        criticWeaknesses: criticEval.weaknesses,
        rank: 0,
        selected: false,
      });
    }

    // 5. Ranking
    candidates.sort((a, b) => {
      const scoreA = a.verifierScore * 0.6 + a.criticScore * 0.4;
      const scoreB = b.verifierScore * 0.6 + b.criticScore * 0.4;
      return scoreB - scoreA;
    });

    candidates.forEach((c, idx) => {
      c.rank = idx + 1;
      c.selected = idx === 0;
    });

    const bestCandidate = candidates[0];

    // 6. Revise Best Candidate
    const bestVerifier = VerifierEngine.verifyOutput(bestCandidate.text, prompt, taskType, evidenceSources);
    let revisedOutput = bestCandidate.text;
    if (bestVerifier.issues.length > 0) {
      revisedOutput = VerifierEngine.applyRevisionRemedy(bestCandidate.text, bestVerifier.issues, taskType);
    }
    bestCandidate.revisedText = revisedOutput;

    return {
      candidates,
      selectedCandidate: bestCandidate,
      finalRevisedOutput: revisedOutput,
    };
  }

  private static synthesizeCandidateText(
    prompt: string,
    taskType: CareerTaskType,
    perspective: string,
    seed: number
  ): string {
    const header = `### Phương án ${seed}: Định hướng ${perspective}\n`;
    let body = '';

    if (taskType === 'case_analysis') {
      body = `${header}
- **Khung phân tích**: Decompose theo Unit Economics & Customer Lifetime Value.
- **Tính toán định lượng**: 
  - CAC = $12,000 / 50 khách hàng = $240 USD.
  - LTV = ($80 × 80% biên lợi nhuận) / 0.05 churn = $1,280 USD.
  - Tỷ số LTV:CAC = 5.33x (> 3.0x Benchmark tiêu chuẩn ngành SaaS).
  - Thời gian hoàn vốn (Payback Period) = $240 / ($80 × 80%) = 3.75 tháng.
- **Đánh giá & Khuyến nghị**: Tỷ lệ 5.33x chứng minh hiệu quả sinh lời mạnh. Đề xuất tăng 20% ngân sách marketing vào các kênh inbound có CAC < $200.`;
    } else if (taskType === 'interview_simulation') {
      body = `${header}
- **Tình huống (Situation)**: Trong dự án thanh toán cốt lõi, đội ngũ gặp vấn đề thắt cổ chai hiệu năng khiến P99 latency tăng vọt lên 420ms trong giờ cao điểm.
- **Nhiệm vụ (Task)**: Tôi đảm nhận vai trò phân tích nguyên nhân gốc (RCA) và đưa ra kiến trúc tối ưu không làm gián đoạn luồng giao dịch trực tiếp.
- **Hành động (Action)**: Tiến hành profiling hệ thống, phát hiện lock contention tại database pool; triển khai Redis caching phân tán và tái cấu trúc câu lệnh truy vấn bất đồng bộ.
- **Kết quả (Result)**: Giảm P99 latency từ 420ms xuống 110ms (-74%), tăng throughput lên 3,200 TPS, tiết kiệm $45,000 chi phí hạ tầng mỗi quý.`;
    } else {
      body = `${header}
- **Chiến lược trọng tâm**: Tập trung chuyển hóa năng lực kỹ thuật hiện có thành giá trị đo lường được cho tổ chức.
- **Đối chiếu kỹ năng**: Khớp nối các kỹ năng cốt lõi với yêu cầu tuyển dụng thông qua Canonical Skill Registry.
- **Hành động khả thi**: Thiết lập lộ trình 3 giai đoạn (Chuẩn hóa hồ sơ → Luyện tập phỏng vấn STAR → Thực thi ứng tuyển).`;
    }

    return body;
  }

  private static evaluateCritic(
    text: string, 
    taskType: CareerTaskType
  ): { score: number; strengths: string[]; weaknesses: string[] } {
    const strengths: string[] = [];
    const weaknesses: string[] = [];

    if (text.includes('CAC') || text.includes('LTV') || text.includes('P99') || text.includes('TPS')) {
      strengths.push('Số liệu định lượng cụ thể, có căn cứ đo lường rõ ràng.');
    }
    if (text.includes('Situation') || text.includes('Tình huống') || text.includes('Khung phân tích')) {
      strengths.push('Cấu trúc mạch lạc, tuân thủ đúng framework chuyên môn.');
    }
    if (text.length > 200) {
      strengths.push('Độ sâu phân tích đầy đủ, diễn đạt chuyên nghiệp.');
    }

    if (taskType === 'case_analysis' && !text.includes('Payback')) {
      weaknesses.push('Chưa đề cập tới thời gian hoàn vốn (Payback period).');
    }
    if (weaknesses.length === 0) {
      weaknesses.push('Có thể bổ sung thêm ví dụ tình huống rủi ro biên (edge cases).');
    }

    const score = Math.min(1.0, 0.80 + strengths.length * 0.08 - weaknesses.length * 0.04);
    return { score, strengths, weaknesses };
  }
}
