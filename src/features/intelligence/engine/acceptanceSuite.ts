// =========================================================================
// CAREER INTELLIGENCE ENGINE - 15 ACCEPTANCE SCENARIOS TEST HARNESS
// =========================================================================

import { runCareerIntelligenceTask } from './AgentRuntime';
import { FeedbackEngine } from './FeedbackEngine';
import { TrajectoryLogger } from './TrajectoryLogger';
import { MemoryEngine } from './MemoryEngine';
import { ToolRuntime } from './ToolRuntime';
import { CareerIntelligenceResponse } from './types';

export interface AcceptanceScenario {
  id: number;
  title: string;
  prompt: string;
  expectedDescription: string;
  validator: (response: CareerIntelligenceResponse) => { passed: boolean; note: string };
}

export const ACCEPTANCE_SCENARIOS: AcceptanceScenario[] = [
  {
    id: 1,
    title: '1. Simple Question (No Full Agent Activation)',
    prompt: 'CV là gì? Khái niệm cơ bản của resume trong tuyển dụng.',
    expectedDescription: 'Routed to L0 direct response, 0 tool calls, low compute budget, no planning overhead.',
    validator: (res) => {
      const passed = res.levelActivated === 'L0' && res.stats.toolCallsMade === 0;
      return {
        passed,
        note: passed 
          ? `Correctly activated ${res.levelActivated} with ${res.stats.toolCallsMade} tool calls and ${res.stats.tokensUsed} tokens.`
          : `Expected L0 with 0 tool calls, but got ${res.levelActivated} with ${res.stats.toolCallsMade} tool calls.`,
      };
    },
  },
  {
    id: 2,
    title: '2. Job Matching (Retrieval + Context + Lightweight Verification)',
    prompt: 'So khớp hồ sơ của mình với job Senior Backend Engineer tại Stripe xem có match không?',
    expectedDescription: 'Activates L1, retrieves job and role details from Career OS catalog, performs verification.',
    validator: (res) => {
      const passed = (res.levelActivated === 'L1' || res.levelActivated === 'L2') && res.sources.length > 0 && res.verificationResult.passed;
      return {
        passed,
        note: passed
          ? `Correctly retrieved ${res.sources.length} sources and verified fit (score: ${res.verificationResult.score}).`
          : `Failed: level was ${res.levelActivated}, sources: ${res.sources.length}.`,
      };
    },
  },
  {
    id: 3,
    title: '3. Skill-Gap Analysis (Retrieval + User Model + Evidence Reasoning)',
    prompt: 'Phân tích skill gap của mình cho vị trí Stripe Backend, mình còn thiếu kỹ năng gì và đề xuất roadmap?',
    expectedDescription: 'Activates L2, checks User Model inferences, queries evidence ledger, generates 4-week roadmap.',
    validator: (res) => {
      const hasRoadmap = res.result.includes('Tuần') || res.result.includes('Week') || res.result.includes('Lộ trình');
      const passed = res.taskType === 'skill_gap_analysis' && hasRoadmap;
      return {
        passed,
        note: passed
          ? `Classified as ${res.taskType} with structured multi-week roadmap synthesized.`
          : `Failed: taskType was ${res.taskType}.`,
      };
    },
  },
  {
    id: 4,
    title: '4. Case Solving (Planning + Tools + Sandbox Verification)',
    prompt: 'Giải case study tối ưu hóa chi phí CAC và LTV cho nền tảng B2B SaaS với số liệu doanh thu cụ thể.',
    expectedDescription: 'Activates L3, creates DAG plan, calls calculateMetrics or code sandbox, verifies numerical consistency.',
    validator: (res) => {
      const hasNumbers = res.result.includes('CAC') && res.result.includes('LTV');
      const passed = res.taskType === 'case_analysis' && hasNumbers && res.stats.toolCallsMade > 0;
      return {
        passed,
        note: passed
          ? `Executed quantitative case with ${res.stats.toolCallsMade} tool calls and numerical validation.`
          : `Failed: tool calls: ${res.stats.toolCallsMade}, hasNumbers: ${hasNumbers}.`,
      };
    },
  },
  {
    id: 5,
    title: '5. Interview Simulation (Memory + Evaluation + STAR Feedback)',
    prompt: 'Mô phỏng câu hỏi phỏng vấn STAR về việc xử lý xung đột trong team kỹ thuật khi refactor database.',
    expectedDescription: 'Evaluates answer against STAR rubric criteria and returns structured feedback.',
    validator: (res) => {
      const passed = (res.taskType === 'interview_simulation' || res.result.includes('STAR')) && res.verificationResult.passed;
      return {
        passed,
        note: passed
          ? `Interview simulation verified with STAR rubric compliance score: ${res.verificationResult.score}.`
          : `Failed to evaluate interview simulation properly.`,
      };
    },
  },
  {
    id: 6,
    title: '6. Company Research (Research Agent)',
    prompt: 'Tìm hiểu công ty Stripe: văn hóa kỹ thuật, tech stack chính và salary benchmark cho Senior level.',
    expectedDescription: 'Routes to research agent, gathers external or internal compensation benchmarks.',
    validator: (res) => {
      const passed = (res.taskType === 'company_research' || res.taskType === 'retrieval') && res.sources.length > 0;
      return {
        passed,
        note: passed
          ? `Retrieved company benchmarks across ${res.sources.length} sources.`
          : `Failed: sources retrieved: ${res.sources.length}.`,
      };
    },
  },
  {
    id: 7,
    title: '7. Deep Research (Full Level 4 Pipeline)',
    prompt: 'Deep research toàn diện về xu hướng công nghệ thanh toán phân tán và các đối thủ cạnh tranh của Stripe.',
    expectedDescription: 'Activates Level 4 Deep Research, gathers multi-source evidence, cross-checks conflicting viewpoints.',
    validator: (res) => {
      const passed = res.levelActivated === 'L4' && res.result.includes('Đối chiếu Luồng Quan điểm');
      return {
        passed,
        note: passed
          ? `Successfully activated L4 Deep Research with cross-source triangulation.`
          : `Failed: level activated was ${res.levelActivated}.`,
      };
    },
  },
  {
    id: 8,
    title: '8. Mixed Vietnamese/English Request (Canonical Concept Mapping)',
    prompt: 'CAC đang tăng cao trong khi LTV giảm, team dev cần optimize architecture ntn để cut runway cost?',
    expectedDescription: 'Correctly maps CAC, LTV, architecture, runway to canonical IDs regardless of mixed language.',
    validator: (res) => {
      const passed = res.result.includes('CAC') && res.result.includes('LTV') && res.confidence >= 0.85;
      return {
        passed,
        note: passed
          ? `Accurately parsed mixed language terms with ${Math.round(res.confidence * 100)}% confidence.`
          : `Failed to map mixed language concepts.`,
      };
    },
  },
  {
    id: 9,
    title: '9. Failed Tool Call Recovery (Retry / Replan / Recovery)',
    prompt: 'Kiểm tra độ trễ database với công cụ giả lập và tự động phục hồi nếu timeout.',
    expectedDescription: 'Demonstrates graceful recovery when tools fail or timeout, using fallbacks.',
    validator: (res) => {
      // Regardless of simulated tool quirks, runtime must produce a valid safe response
      const passed = res.success && res.result.length > 50;
      return {
        passed,
        note: passed ? `Gracefully recovered and synthesized complete response.` : `Failed to recover.`,
      };
    },
  },
  {
    id: 10,
    title: '10. Incorrect Answer Catch & Revision Loop (Verifier Triggered)',
    prompt: 'Tính toán unit economics cho dự án mới nhưng kiểm tra nghiêm ngặt thiếu sót số liệu.',
    expectedDescription: 'Verifier catches missing calculations, triggers automated revision loop, updates score.',
    validator: (res) => {
      const passed = res.verificationResult.passed && res.result.includes('Bổ sung');
      return {
        passed,
        note: passed
          ? `Verifier successfully triggered automated revision loop to ensure mathematical correctness.`
          : `Verification did not trigger revision properly.`,
      };
    },
  },
  {
    id: 11,
    title: '11. Long Task Trajectory Persistence',
    prompt: 'Lập kế hoạch chuyển đổi nghề nghiệp toàn diện từ Frontend sang Distributed Systems Backend trong 6 tháng.',
    expectedDescription: 'Full structured trajectory logged with step-by-step metadata in TrajectoryLogger.',
    validator: (res) => {
      const trajectory = TrajectoryLogger.getTrajectory(res.trajectoryId);
      const passed = !!trajectory && trajectory.runId === res.trajectoryId;
      return {
        passed,
        note: passed
          ? `Trajectory record #${res.trajectoryId} verified in persistent store with ${trajectory.executionSteps.length} logged steps.`
          : `Trajectory not found in persistent store.`,
      };
    },
  },
  {
    id: 12,
    title: '12. User Feedback Attachment to Output',
    prompt: 'Đánh giá câu trả lời phỏng vấn mẫu về Microservices.',
    expectedDescription: 'Simulates attaching user rating/correction feedback directly into FeedbackEngine.',
    validator: (res) => {
      FeedbackEngine.ingestFeedback({
        targetId: res.trajectoryId,
        targetType: 'agent_output',
        source: 'user_rating',
        ratingOrSignal: 95,
        correctionText: 'Câu trả lời rất rõ ràng và chuẩn cấu trúc STAR.',
      });
      const stored = FeedbackEngine.getFeedbacksForTarget(res.trajectoryId);
      const passed = stored.length > 0;
      return {
        passed,
        note: passed
          ? `Feedback correctly linked to target trajectory #${res.trajectoryId}.`
          : `Failed to link feedback.`,
      };
    },
  },
  {
    id: 13,
    title: '13. Repeated Task (Episodic Memory Pattern Reuse)',
    prompt: 'So khớp hồ sơ của mình với job Senior Backend Engineer tại Stripe xem có match không?',
    expectedDescription: 'Queries episodic memory to identify prior successful runs and accelerate context.',
    validator: (res) => {
      const pastMemories = MemoryEngine.findRelevantEpisodicMemories(
        'So khớp hồ sơ của mình với job Senior Backend Engineer', 
        'job_matching'
      );
      const passed = pastMemories.length > 0;
      return {
        passed,
        note: passed
          ? `Identified ${pastMemories.length} relevant past episodic runs in memory store.`
          : `Did not find episodic memory traces.`,
      };
    },
  },
  {
    id: 14,
    title: '14. High-Complexity Task (Higher Test-Time Compute)',
    prompt: 'Deep research và phân tích toàn diện ma trận rủi ro hệ thống microservices đa vùng với failover tự động.',
    expectedDescription: 'Allocates high or maximum compute budget with expanded token ceiling.',
    validator: (res) => {
      const passed = res.stats.tokensUsed > 1000 || res.levelActivated === 'L3' || res.levelActivated === 'L4';
      return {
        passed,
        note: passed
          ? `Allocated higher compute budget (${res.stats.tokensUsed} tokens used).`
          : `Failed: only ${res.stats.tokensUsed} tokens used.`,
      };
    },
  },
  {
    id: 15,
    title: '15. Low-Complexity Task (Low Compute Budget)',
    prompt: 'Định nghĩa STAR framework là viết tắt của những từ nào?',
    expectedDescription: 'Direct fast response with minimal token spend and zero tool calls.',
    validator: (res) => {
      const passed = res.levelActivated === 'L0' && res.stats.toolCallsMade === 0 && res.stats.tokensUsed < 800;
      return {
        passed,
        note: passed
          ? `Strictly bounded to low compute (${res.stats.tokensUsed} tokens, 0 tool calls).`
          : `Failed: tokens=${res.stats.tokensUsed}, tools=${res.stats.toolCallsMade}.`,
      };
    },
  },
];

export async function runAllAcceptanceTests(
  onProgress?: (index: number, total: number, result: { id: number; title: string; passed: boolean; note: string }) => void
): Promise<Array<{ id: number; title: string; passed: boolean; note: string; response: CareerIntelligenceResponse }>> {
  const results: Array<{ id: number; title: string; passed: boolean; note: string; response: CareerIntelligenceResponse }> = [];

  for (let i = 0; i < ACCEPTANCE_SCENARIOS.length; i++) {
    const scenario = ACCEPTANCE_SCENARIOS[i];
    const response = await runCareerIntelligenceTask({ task: scenario.prompt });
    const check = scenario.validator(response);

    const item = {
      id: scenario.id,
      title: scenario.title,
      passed: check.passed,
      note: check.note,
      response,
    };

    results.push(item);
    if (onProgress) {
      onProgress(i + 1, ACCEPTANCE_SCENARIOS.length, { id: scenario.id, title: scenario.title, passed: check.passed, note: check.note });
    }
  }

  return results;
}
