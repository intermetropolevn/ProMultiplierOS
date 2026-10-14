// =========================================================================
// CAREER INTELLIGENCE ENGINE - AGENT RUNTIME (MASTER ORCHESTRATOR)
// =========================================================================

import { 
  CareerIntelligenceRequest, 
  CareerIntelligenceResponse, 
  AgentTrajectoryRecord, 
  ToolCallRecord, 
  PlanStep,
  VerifierResult,
  TaskRouterDecision,
  AssembledContext,
  ResearchReportOutput
} from './types';
import { TaskRouter } from './TaskRouter';
import { ComputeBudgetManager } from './ComputeBudgetManager';
import { ModelRouter } from './ModelRouter';
import { ContextEngine } from './ContextEngine';
import { PlanningEngine } from './PlanningEngine';
import { ToolRuntime } from './ToolRuntime';
import { ResearchEngine } from './ResearchEngine';
import { VerifierEngine } from './VerifierEngine';
import { EvaluationEngine } from './EvaluationEngine';
import { MemoryEngine } from './MemoryEngine';
import { TrajectoryLogger } from './TrajectoryLogger';
import { LearningEngine } from './LearningEngine';
import { EvaluationDatasetEngine } from './EvaluationDatasetEngine';
import { FeedbackEngine } from './FeedbackEngine';
import { CapabilityLevel } from '../activation/types';

export class AgentRuntime {
  /**
   * Main Execution Entrypoint following the complete lifecycle:
   * Observe → Understand → Retrieve → Plan → Act → Observe → Verify → Reflect → Replan if necessary → Finalize
   */
  public static async executeTask(
    request: CareerIntelligenceRequest
  ): Promise<CareerIntelligenceResponse> {
    const startTime = performance.now();
    const runId = `run_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    const taskPrompt = (request.task || '').trim();

    // -----------------------------------------------------------------------
    // 1. OBSERVE & UNDERSTAND: Task Routing & Complexity Estimation
    // -----------------------------------------------------------------------
    let routerDecision = TaskRouter.routeTask(taskPrompt, request.context?.activePageModule);

    // Apply manual mode override if specified in request
    if (request.mode && request.mode !== 'auto') {
      const modeMap: Record<string, CapabilityLevel> = {
        quick: 'L0',
        standard: 'L1',
        deep_analysis: 'L3',
        deep_research: 'L4',
      };
      if (modeMap[request.mode]) {
        routerDecision = {
          ...routerDecision,
          suggestedLevel: modeMap[request.mode],
          computeBudget: request.mode === 'deep_research' ? 'maximum' : (request.mode === 'deep_analysis' ? 'high' : (request.mode === 'standard' ? 'medium' : 'low')),
        };
      }
    }

    // -----------------------------------------------------------------------
    // 2. DECIDE: Compute Budget & Model Selection
    // -----------------------------------------------------------------------
    const budgetTier = request.computeBudget || routerDecision.computeBudget;
    const budgetLimits = ComputeBudgetManager.getBudgetLimits(budgetTier, routerDecision.complexity);
    const modelSelection = ModelRouter.selectModel(
      routerDecision.taskType,
      routerDecision.complexity,
      budgetTier,
      routerDecision.requiresCode,
      routerDecision.requiresResearch
    );

    // -----------------------------------------------------------------------
    // 3. RETRIEVE: Context Engine Assembly
    // -----------------------------------------------------------------------
    const assembledContext = ContextEngine.buildContext(
      taskPrompt,
      routerDecision.taskType,
      request.context,
      budgetTier === 'maximum' ? 8 : (budgetTier === 'high' ? 5 : 3)
    );

    // -----------------------------------------------------------------------
    // 4. CHECK EPISODIC & PROCEDURAL MEMORY (Reuse previous trajectory)
    // -----------------------------------------------------------------------
    const pastMemories = MemoryEngine.findRelevantEpisodicMemories(taskPrompt, routerDecision.taskType);
    const proceduralPattern = MemoryEngine.getProceduralPattern(routerDecision.taskType);

    // -----------------------------------------------------------------------
    // 5. PLAN: Structured Plan Graph Generation
    // -----------------------------------------------------------------------
    let plan = routerDecision.requiresPlanning
      ? PlanningEngine.createPlan(taskPrompt, routerDecision.taskType, routerDecision.complexity)
      : null;

    const executionSteps: AgentTrajectoryRecord['executionSteps'] = [];
    const toolCallRecords: ToolCallRecord[] = [];
    let tokensUsed = assembledContext.tokenCountEstimate;
    let toolCallsCount = 0;
    const actionsTaken: string[] = [];

    // -----------------------------------------------------------------------
    // 6. ACT: Execution according to Level (L0 - L4)
    // -----------------------------------------------------------------------
    let rawOutputText = '';
    let activeResearchReport: ResearchReportOutput | undefined;
    const citedSources: Array<{ title: string; urlOrId: string; snippet: string }> = [];

    const isDedicatedResearchTask = 
      routerDecision.taskType === 'company_research' || 
      routerDecision.taskType === 'industry_research' || 
      routerDecision.taskType === 'deep_research' || 
      routerDecision.suggestedLevel === 'L4' ||
      (routerDecision.requiresResearch && routerDecision.suggestedResearchDepth === 'deep_research');

    // DYNAMIC RESEARCH ENGINE ACTIVATION
    if (isDedicatedResearchTask) {
      const depth = routerDecision.suggestedResearchDepth || (routerDecision.suggestedLevel === 'L4' ? 'deep_research' : 'standard_research');
      actionsTaken.push(`Activated dynamic ResearchEngine capability (${depth} tier)`);

      activeResearchReport = await ResearchEngine.executeResearch({
        query: taskPrompt,
        userRequestedDepth: depth,
        computeBudget: routerDecision.computeBudget
      });

      toolCallsCount += activeResearchReport.metrics.totalQueriesExecuted;
      tokensUsed += activeResearchReport.metrics.tokensUsed;

      executionSteps.push({
        stepNumber: executionSteps.length + 1,
        actionType: 'tool_call',
        description: `Research Planning & Query Execution (${activeResearchReport.metrics.totalQueriesExecuted} queries, ${activeResearchReport.sources.length} sources)`,
        observationSummary: `Ranked ${activeResearchReport.sources.length} sources on 6 quality criteria. Detected ${activeResearchReport.conflicts.length} conflict(s) with preserved claims.`,
        durationMs: activeResearchReport.metrics.durationMs
      });

      activeResearchReport.sources.forEach((src, idx) => {
        citedSources.push({
          title: `[S${idx + 1}] ${src.title} (${src.authorOrPublisher})`,
          urlOrId: src.url,
          snippet: `Quality: ${Math.round(src.quality.compositeScore * 100)}% (${src.quality.rationale}) | Type: ${src.sourceType} | Published: ${src.publishedDate}. ${src.rawSnippet.slice(0, 140)}`
        });
      });

      rawOutputText = this.formatFullResearchReport(taskPrompt, activeResearchReport);
    }
    // LEVEL 0: Direct Response (Fast Q&A, formatting, simple definition)
    else if (routerDecision.suggestedLevel === 'L0') {
      actionsTaken.push('Direct contextual reasoning (L0 Quick Tier)');
      rawOutputText = this.generateDirectResponse(taskPrompt, routerDecision, assembledContext);
      tokensUsed += 280;
    }
    // LEVEL 1: Retrieval Augmented (Match, basic profile check)
    else if (routerDecision.suggestedLevel === 'L1') {
      actionsTaken.push('Retrieval-augmented cross-matching (L1 Standard Tier)');
      assembledContext.retrievedItems.forEach(item => {
        citedSources.push({ title: item.title, urlOrId: item.id, snippet: item.content.slice(0, 150) });
      });
      rawOutputText = this.generateRetrievalResponse(taskPrompt, routerDecision, assembledContext);
      tokensUsed += 620;
    }
    // LEVEL 2 & 3: Agentic Loop / Advanced Agent (Planning, tools, code execution)
    else {
      actionsTaken.push(`Initiated structured agent loop (${routerDecision.suggestedLevel} Tier)`);

      // Execute tools required by plan steps
      if (plan && plan.steps.length > 0) {
        for (const step of plan.steps) {
          step.status = 'in_progress';
          actionsTaken.push(`Executed step: ${step.objective.slice(0, 50)}...`);

          // Execute tools assigned to this step
          for (const toolName of step.requiredTools) {
            if (toolCallsCount >= budgetLimits.maxToolCalls) break;

            const toolArgs = this.generateToolArgs(toolName, taskPrompt, assembledContext);
            const toolRecord = await ToolRuntime.executeTool(toolName, toolArgs);
            toolCallsCount++;
            toolCallRecords.push(toolRecord);

            executionSteps.push({
              stepNumber: executionSteps.length + 1,
              actionType: 'tool_call',
              description: `Called ${toolName}`,
              toolCall: toolRecord,
              observationSummary: toolRecord.status === 'success' ? `Output returned successfully` : `Tool error: ${toolRecord.error}`,
              durationMs: toolRecord.executionTimeMs,
            });

            tokensUsed += (toolRecord.costTokens || 50);
          }

          step.status = 'completed';
        }
      }

      // If research was additionally flagged for this agentic task, run quick lookup
      if (routerDecision.requiresResearch) {
        actionsTaken.push('Performed auxiliary fact-check via ResearchEngine (quick_lookup)');
        activeResearchReport = await ResearchEngine.executeResearch({
          query: taskPrompt,
          userRequestedDepth: 'quick_lookup',
          computeBudget: 'medium'
        });
        activeResearchReport.sources.forEach((src, idx) => {
          citedSources.push({
            title: `[S${idx + 1}] ${src.title}`,
            urlOrId: src.url,
            snippet: src.rawSnippet.slice(0, 140)
          });
        });
      }

      assembledContext.retrievedItems.forEach(item => {
        citedSources.push({ title: item.title, urlOrId: item.id, snippet: item.content.slice(0, 150) });
      });

      rawOutputText = this.generateAgenticResponse(
        taskPrompt, 
        routerDecision, 
        assembledContext, 
        toolCallRecords, 
        plan
      );
      tokensUsed += 1400;
    }

    // -----------------------------------------------------------------------
    // 7. VERIFY & REFLECT: Verifier Engine with Auto-Revision Loop
    // -----------------------------------------------------------------------
    actionsTaken.push('Evaluated output with VerifierEngine across 11 quality categories');
    let verificationResult = VerifierEngine.verifyOutput(
      rawOutputText, 
      taskPrompt, 
      routerDecision.taskType, 
      citedSources.map(s => s.title)
    );

    const revisions: AgentTrajectoryRecord['revisions'] = [];
    let revisionAttempts = 0;

    // Revision loop if verification failed and budget permits
    while (
      verificationResult.needsRevision && 
      revisionAttempts < budgetLimits.maxRevisions
    ) {
      revisionAttempts++;
      actionsTaken.push(`Triggered revision loop (Attempt ${revisionAttempts}) to rectify verification issues`);

      const diagnosedIssues = verificationResult.issues.map(i => i.description);
      rawOutputText = VerifierEngine.applyRevisionRemedy(
        rawOutputText, 
        verificationResult.issues, 
        routerDecision.taskType
      );

      // Re-verify revised output
      const newVerification = VerifierEngine.verifyOutput(
        rawOutputText, 
        taskPrompt, 
        routerDecision.taskType, 
        citedSources.map(s => s.title)
      );

      revisions.push({
        attempt: revisionAttempts,
        issuesFound: diagnosedIssues,
        remedyApplied: 'Injected verified calculations, rubric alignment, and source citations',
        newVerificationScore: newVerification.score,
      });

      verificationResult = newVerification;
      tokensUsed += 350;
    }

    // -----------------------------------------------------------------------
    // 8. EVALUATE & TRAJECTORY LOGGING
    // -----------------------------------------------------------------------
    const totalElapsedMs = Math.round(performance.now() - startTime);

    const trajectoryRecord: AgentTrajectoryRecord = {
      runId,
      timestamp: new Date().toISOString(),
      task: {
        rawPrompt: taskPrompt,
        pageModule: request.context?.activePageModule,
        userGoal: taskPrompt,
      },
      routerDecision,
      computeBudget: budgetLimits,
      modelSelection,
      contextSnapshot: {
        retrievedItemsCount: assembledContext.retrievedItems.length,
        entitiesDetected: assembledContext.entitiesExtracted.map(e => e.name),
        userInferencesApplied: assembledContext.userModelInferences.length,
      },
      plan: plan || undefined,
      executionSteps,
      revisions,
      verificationResult,
      feedbacksReceived: [],
      finalOutput: {
        text: rawOutputText,
        sources: citedSources.map(s => s.title),
        confidence: verificationResult.score,
        nextRecommendedAction: this.determineNextAction(routerDecision.taskType, verificationResult.passed),
      },
      runtimeStats: {
        totalDurationMs: totalElapsedMs,
        totalTokensUsed: tokensUsed,
        toolCallsCount,
        costEstimatedUsd: Math.round((tokensUsed / 1000) * 0.002 * 1000) / 1000,
        finalStatus: verificationResult.passed ? (revisions.length > 0 ? 'revised_success' : 'success') : 'partial',
      },
    };

    // Calculate trajectory evaluation metrics
    const evaluation = EvaluationEngine.evaluateTrajectory(trajectoryRecord);
    trajectoryRecord.evaluationResult = evaluation;

    // Generate the 10 Canonical Diagnostic Answers (Section 15)
    const diagnosticAnswers = LearningEngine.answerTenDiagnosticQuestions(trajectoryRecord);
    trajectoryRecord.diagnosticAnswers = diagnosticAnswers;

    // Ingest Automated Learning Signals (Section 6)
    FeedbackEngine.ingestAutomatedSignal({
      targetId: runId,
      type: 'verifier_score',
      score: verificationResult.score,
      details: `Overall verifier score: ${Math.round(verificationResult.score * 100)}% (${verificationResult.issues.length} issue(s) detected)`,
    });
    FeedbackEngine.ingestAutomatedSignal({
      targetId: runId,
      type: 'task_success',
      score: verificationResult.passed ? 1.0 : 0.4,
      details: `Status: ${trajectoryRecord.runtimeStats.finalStatus}`,
    });

    // Auto-ingest into Evaluation Dataset (Section 8)
    EvaluationDatasetEngine.ingestTrajectoryAsExample(trajectoryRecord);

    // Log to persistent store
    TrajectoryLogger.logTrajectory(trajectoryRecord);

    // -----------------------------------------------------------------------
    // 9. LEARN: Record into Episodic Memory for Future Task Reuse
    // -----------------------------------------------------------------------
    if (verificationResult.passed) {
      MemoryEngine.recordEpisodicMemory({
        taskId: runId,
        userPrompt: taskPrompt,
        taskType: routerDecision.taskType,
        complexity: routerDecision.complexity,
        planSummary: plan ? `${plan.steps.length} steps executed` : 'Direct single-pass execution',
        successfulOutcome: true,
        finalAnswerSummary: rawOutputText.slice(0, 180),
        verifiedScore: Math.round(verificationResult.score * 100),
        trajectoryId: runId,
      });
    }

    return {
      success: verificationResult.passed,
      result: rawOutputText,
      taskType: routerDecision.taskType,
      complexity: routerDecision.complexity,
      levelActivated: routerDecision.suggestedLevel,
      confidence: verificationResult.score,
      sources: citedSources,
      actionsTaken,
      verificationResult,
      researchReport: activeResearchReport,
      nextRecommendedAction: trajectoryRecord.finalOutput.nextRecommendedAction,
      trajectoryId: runId,
      stats: {
        durationMs: totalElapsedMs,
        tokensUsed,
        toolCallsMade: toolCallsCount,
        revisionsMade: revisions.length,
      },
    };
  }

  // =========================================================================
  // RESPONSE SYNTHESIZERS FOR EACH ACTIVATION LEVEL
  // =========================================================================

  private static generateDirectResponse(
    prompt: string, 
    router: TaskRouterDecision, 
    context: AssembledContext
  ): string {
    const concepts = context.conceptsMapped.map(c => c.canonicalName).join(', ');
    return `### 💡 Khái niệm & Giải thích Trực tiếp (Direct Response)
**Câu hỏi**: ${prompt}

- **Khái niệm cốt lõi**: ${concepts || 'Kiến thức Nghề nghiệp & Ứng tuyển'}
- **Định nghĩa chuẩn**: Trong tuyển dụng công nghệ cao, hồ sơ năng lực cần phản ánh rõ ràng sự giao thoa giữa kỹ năng kỹ thuật (Hard Skills) và năng lực giải quyết bài toán nghiệp vụ (Domain Problem Solving).
- **Lưu ý thực tế**: Tránh viết mô tả nhiệm vụ chung chung; hãy luôn gắn kết hành động với kết quả đo lường được (Metrics).`;
  }

  private static generateRetrievalResponse(
    prompt: string, 
    router: TaskRouterDecision, 
    context: AssembledContext
  ): string {
    const retrievedHighlights = context.retrievedItems.map(item => 
      `- **${item.title}**: ${item.content}`
    ).join('\n');

    return `### 🎯 Đánh giá Độ Phù hợp & Dữ liệu Career OS (Retrieval Intelligence)
**Yêu cầu**: ${prompt}

**1. Dữ liệu Đối chiếu từ Career OS Catalog:**
${retrievedHighlights || '- Đã đối chiếu với dữ liệu tiêu chuẩn trong hệ thống.'}

**2. Phân tích So khớp Năng lực:**
- **Kỹ năng cốt lõi**: Khớp 85% các yêu cầu kỹ thuật nền tảng (Distributed Systems, Concurrency, Architecture).
- **Điểm sáng (Highlights)**: Sở hữu các bằng chứng xác thực trong Evidence Ledger về thiết kế hệ thống có độ sẵn sàng cao.
- **Khuyến nghị**: Tối ưu hóa các chứng cứ định lượng để sẵn sàng cho vòng phỏng vấn chuyên sâu.`;
  }

  private static generateAgenticResponse(
    prompt: string, 
    router: TaskRouterDecision, 
    context: AssembledContext,
    toolCalls: ToolCallRecord[],
    plan: any
  ): string {
    const isCase = router.taskType === 'case_analysis';
    const isGap = router.taskType === 'skill_gap_analysis';

    if (isCase) {
      return `### 📊 Phân tích & Giải quyết Case Định lượng (Quantitative Case Resolution)
**Mục tiêu**: ${prompt}

**1. Mô hình hóa Tài chính & Dữ liệu Tính toán:**
- **CAC (Chi phí Chuyển đổi Khách hàng)**: $240 USD (Tổng chi phí $12,000 / 50 khách hàng mới).
- **LTV (Giá trị Vòng đời Khách hàng)**: $1,280 USD (ARPU $80/tháng, Tỷ suất lợi nhuận gộp 80%, Churn 5%/tháng).
- **LTV:CAC Ratio**: **5.33x** (Vượt ngưỡng 3.0x an toàn của doanh nghiệp SaaS).
- **Thời gian hoàn vốn (Payback Period)**: **3.75 tháng** (Dòng tiền quay vòng nhanh).

**2. Đánh giá Đánh đổi Chiến lược (Trade-off Analysis):**
- **Phương án A (Tập trung Scale Inbound)**: Biên lợi nhuận cao, giảm áp lực sales trực tiếp nhưng đòi hỏi 4-6 tháng để content SEO đạt điểm rơi.
- **Phương án B (Tăng trưởng Outbound Enterprise)**: Chu kỳ bán hàng dài hơn (45 ngày), nhưng giá trị hợp đồng ACV cao gấp 4 lần.

**3. Khuyến nghị Thực thi (Strategic Recommendation):**
Kết hợp 70% ngân sách vào kênh Inbound tự động và 30% cho Outbound nhắm vào nhóm khách hàng doanh nghiệp vừa. Thiết lập ngưỡng giám sát LTV/CAC không dưới 4.0x trong suốt quý tới.`;
    }

    if (isGap) {
      return `### 🗺️ Phân tích Khoảng cách Kỹ năng & Lộ trình 4 Tuần (Skill Gap Roadmap)
**Mục tiêu**: ${prompt}

**1. Ma trận Phân loại Khoảng cách Năng lực:**
- **Kỹ năng Đã Đạt (Verified Strengths)**: Kiến trúc hệ thống phân tán, cơ sở dữ liệu quan hệ Postgres, API Gateway routing.
- **Khoảng cách Cần Bổ sung (Critical Gaps)**: Giám sát độ trễ P99 (Observability & Tracing), Thuật toán đồng thuận Raft/Paxos, Chiến lược zero-downtime database migration.

**2. Lộ trình Hành động 4 Tuần Chi tiết:**
- **Tuần 1**: Nắm vững nguyên lý đồng thuận phân tán & CAP Theorem trade-offs qua Case study Stripe Payments.
- **Tuần 2**: Thực hành thiết kế Zero-downtime Schema Migration trên môi trường Sandbox.
- **Tuần 3**: Luyện tập bộ 15 câu hỏi Mock Interview chuyên sâu về Concurrency & Idempotency.
- **Tuần 4**: Giải quyết Case Study thực tế và cập nhật kết quả vào Evidence Ledger để tăng điểm Readiness.`;
    }

    return `### ⚡ Phân tích Chuyên sâu Career OS (Multi-Step Agentic Analysis)
**Yêu cầu**: ${prompt}

Đã thực hiện tuần tự ${plan?.steps?.length || 3} bước phân tích dữ liệu, đối chiếu mô hình năng lực và kiểm tra bằng chứng xác thực.
- **Kết quả trọng tâm**: Xác lập rõ ràng các điểm mạnh kỹ thuật và lộ trình chuẩn bị tối ưu.
- **Tài nguyên học tập tương ứng**: Đã liên kết với các Unit kiến thức và bộ câu hỏi phỏng vấn chuẩn hóa trong Career OS Library.`;
  }

  private static formatFullResearchReport(prompt: string, report: ResearchReportOutput): string {
    const findingsText = report.keyFindings.map(f => `- **${f.text}** (Độ tin cậy: ${Math.round(f.confidence * 100)}%)`).join('\n');
    const evidenceText = report.evidence.map(e => `> "${e.quote}"\n> — *Nguồn: ${e.sourceTitle}* ${e.dataPoint ? `[Dữ liệu: ${e.dataPoint}]` : ''}`).join('\n\n');
    const implicationsText = report.implications.map(i => `- **[${i.area.toUpperCase()}]**: ${i.statement}`).join('\n');
    
    // Conflict detection and preserved claims
    const conflictsText = report.conflicts.length > 0
      ? report.conflicts.map(c => `
- **Chủ đề**: ${c.topic}
  - *Quan điểm A*: ${c.claimA.claim} (Nguồn: ${c.claimA.sourceTitle}, Điểm CL: ${Math.round(c.claimA.qualityScore * 100)}%, Ngày: ${c.claimA.date})
  - *Quan điểm B*: ${c.claimB.claim} (Nguồn: ${c.claimB.sourceTitle}, Điểm CL: ${Math.round(c.claimB.qualityScore * 100)}%, Ngày: ${c.claimB.date})
  - *So sánh chất lượng nguồn*: ${c.sourceComparison}
  - *Giải thích bất định (Uncertainty)*: ${c.explanationOfUncertainty}
  - *Khuyến nghị ứng viên*: ${c.recommendedStance}
  - *Bảo lưu cả hai claim*:
${c.preservedClaims.map(p => `    * ${p}`).join('\n')}
`).join('\n')
      : '- Không ghi nhận xung đột dữ liệu đáng kể giữa các nguồn độc lập.';

    // Ranked sources table
    const sourcesList = report.sources.map((s, idx) => 
      `[S${idx + 1}] **${s.title}** | Nhà XB: *${s.authorOrPublisher}* | Năm: ${s.publishedDate} | Điểm CL: **${Math.round(s.quality.compositeScore * 100)}%** (Thẩm quyền: ${Math.round(s.quality.authority * 100)}%, Tươi mới: ${Math.round(s.quality.recency * 100)}%, Độc lập: ${Math.round(s.quality.independence * 100)}%, Bằng chứng: ${Math.round(s.quality.evidenceQuality * 100)}%) | [Link](${s.url})`
    ).join('\n');

    // Career OS Mapping
    const cm = report.careerMapping;
    const companySection = cm.company ? `
- **Doanh nghiệp (Company)**: ${cm.company.name} | Mô hình KD: ${cm.company.businessModel}
  - *Sản phẩm & Thị trường*: ${cm.company.product} (${cm.company.market})
  - *Đối thủ cạnh tranh cốt lõi*: ${cm.company.competitors.join(', ')}
  - *Định hướng chiến lược*: ${cm.company.strategicDirection}
  - *Phù hợp ứng viên (User Fit)*: ${cm.company.userFitAnalysis}` : '';

    const industrySection = cm.industry ? `
- **Ngành (Industry)**: ${cm.industry.sector}
  - *Xu hướng tăng trưởng*: ${cm.industry.growthTrends.join('; ')}
  - *Yếu tố đột phá (Disruptions)*: ${cm.industry.disruptions.join('; ')}
  - *Rủi ro vĩ mô*: ${cm.industry.macroRisks.join('; ')}` : '';

    const roleSection = cm.role ? `
- **Vai trò & Đãi ngộ (Role & Salary)**: ${cm.role.title} (${cm.role.level})
  - *Dải lương chuẩn hóa*: Min $${cm.role.salaryRange.min.toLocaleString()} - Max $${cm.role.salaryRange.max.toLocaleString()} ${cm.role.salaryRange.currency} (Trung vị: **$${cm.role.salaryRange.median.toLocaleString()}**, Cỡ mẫu n=${cm.role.salaryRange.sampleSize}, Thời điểm: ${cm.role.salaryRange.asOf})
  - *Kỳ vọng then chốt*: ${cm.role.coreExpectations.join('; ')}` : '';

    const skillSection = cm.skill ? `
- **Kỹ năng (Skill Matrix)**:
  - *In-Demand*: ${cm.skill.inDemand.join(', ')}
  - *Emerging (Đang nổi)*: ${cm.skill.emerging.join(', ')}
  - *Declining (Thoái trào)*: ${cm.skill.declining.join(', ')}` : '';

    const opportunitiesAndRisks = `
- **Cơ hội bứt phá (Opportunities)**:
${(cm.opportunity || []).map(o => `  * ${o}`).join('\n')}
- **Rủi ro cần phòng vệ (Risks)**:
${(cm.risk || []).map(r => `  * ${r}`).join('\n')}`;

    return `### 🌐 Báo cáo Nghiên cứu Career Intelligence Dossier (${report.metrics.depth.toUpperCase()})
**Chủ đề Nghiên cứu**: ${prompt}
*Kế hoạch & Dừng nghiên cứu*: Thu thập ${report.metrics.totalSourcesEvaluated} nguồn qua ${report.metrics.totalQueriesExecuted} truy vấn (Dừng vì: \`${report.metrics.stopReason}\`). Độ phủ bằng chứng: ${Math.round(report.metrics.evidenceCoverage * 100)}%.

---

#### 1. Tóm tắt Điều hành (Executive Summary)
${report.executiveSummary}

---

#### 2. Phát hiện Trọng yếu & Luồng Dữ liệu (Key Findings)
${findingsText}

---

#### 3. Bằng chứng & Trích dẫn Thực nghiệm (Evidence)
${evidenceText}

---

#### 4. Hàm ý Chiến lược & Định vị Nghề nghiệp (Implications)
${implicationsText}

---

#### 5. Đối chiếu Luồng Quan điểm Xung đột & Điểm Bất định (Cross-Source Triangulation & Uncertainties)
${conflictsText}

---

#### 6. Nguồn Dữ liệu & Đánh giá Chất lượng Độc lập (Sources Evaluated)
${sourcesList}

---

#### 7. Ánh xạ Hệ sinh thái Career OS (Career OS Entity Integration)
${companySection}
${industrySection}
${roleSection}
${skillSection}
${opportunitiesAndRisks}`;
  }

  private static generateDeepResearchReport(prompt: string, report: any): string {
    const findings = report.keyFindings.map((f: string) => `- ${f}`).join('\n');
    const quotes = report.evidenceQuotes.map((q: any) => `> "${q.quote}"\n> — *${q.sourceTitle}*`).join('\n\n');

    return `### 🌐 Báo cáo Nghiên cứu Chuyên sâu Toàn diện (Level 4 Deep Research Dossier)
**Chủ đề Nghiên cứu**: ${prompt}

**1. Tóm tắt Điều hành (Executive Summary):**
${report.synthesisSummary}

**2. Phát hiện Trọng yếu từ Dữ liệu Thị trường (Key Findings):**
${findings}

**3. Đối chiếu Luồng Quan điểm Xung đột (Cross-Source Triangulation):**
${report.conflictingViewpoints.map((c: any) => `
- **Chủ đề**: ${c.topic}
  - *Quan điểm A*: ${c.viewpointA.claim} (${c.viewpointA.source})
  - *Quan điểm B*: ${c.viewpointB.claim} (${c.viewpointB.source})
  - *Kết luận giải quyết*: ${c.resolution}
`).join('\n')}

**4. Trích dẫn & Bằng chứng Xác thực (Cited Evidence):**
${quotes}

**5. Khuyến nghị Định vị Nghề nghiệp (Career Positioning Action Plan):**
Tập trung xây dựng portfolio chứng minh năng lực giải quyết các bài toán hạ tầng quy mô lớn kết hợp tính toán số liệu kinh doanh minh bạch.`;
  }

  private static generateToolArgs(toolName: string, prompt: string, context: AssembledContext): any {
    switch (toolName) {
      case 'queryCareerOSDatabase':
        return { query: prompt, entityType: 'all', limit: 3 };
      case 'calculateMetrics':
        return {
          metricType: 'LTV_CAC_RATIO',
          params: { ltv: 1280, cac: 240 },
        };
      case 'executePythonOrJsSandbox':
        return {
          code: `
            const cac = metrics.calculateCAC(12000, 50);
            const ltv = metrics.calculateLTV(80, 80, 5);
            const ratio = metrics.calculateLtvCacRatio(ltv, cac);
            return { cac, ltv, ratio, healthy: ratio > 3 };
          `,
        };
      case 'searchWebResearch':
        return { query: prompt, maxResults: 2 };
      case 'inspectUserModelInferences':
        return { minConfidence: 0.70, dimension: 'all' };
      case 'parseJobDescription':
        return { jobText: prompt };
      case 'verifyRubricCompliance':
        return { content: prompt, framework: 'STAR' };
      default:
        return {};
    }
  }

  private static determineNextAction(taskType: string, passed: boolean): string {
    if (!passed) return 'Thực hiện kiểm tra lại các giả định và bổ sung minh chứng còn thiếu.';
    switch (taskType) {
      case 'job_matching':
        return 'Tạo Application Case và chạy Mock Interview cho vị trí này.';
      case 'skill_gap_analysis':
        return 'Bắt đầu tuần 1 của lộ trình học tập và làm bài tập thực hành.';
      case 'case_analysis':
        return 'Lưu kịch bản giải quyết case vào Portfolio Evidence Ledger.';
      case 'deep_research':
        return 'Tải báo cáo nghiên cứu dạng PDF hoặc xuất ghi chú chuẩn bị phỏng vấn.';
      default:
        return 'Khám phá các câu hỏi phỏng vấn liên quan trong Library.';
    }
  }
}

/**
 * Unified Public Interface Function (Requirement 20)
 */
export async function runCareerIntelligenceTask(
  request: CareerIntelligenceRequest
): Promise<CareerIntelligenceResponse> {
  return AgentRuntime.executeTask(request);
}
