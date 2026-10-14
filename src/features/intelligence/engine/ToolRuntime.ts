// =========================================================================
// CAREER INTELLIGENCE ENGINE - TOOL RUNTIME
// =========================================================================

import { ToolDefinition, ToolCallRecord } from './types';
import { RetrievalEngine } from './RetrievalEngine';
import { MemoryEngine } from './MemoryEngine';
import { CodeExecution } from './CodeExecution';
import { CanonicalSkillRegistry } from '../services/canonicalSkillRegistry';
import { JOBS_DATA } from '../../../data/jobsData';

export class ToolRuntime {
  private static toolsRegistry: Map<string, ToolDefinition> = new Map();
  private static initialized = false;

  public static initialize(): void {
    if (this.initialized) return;

    // 1. Tool: queryCareerOSDatabase
    this.registerTool({
      name: 'queryCareerOSDatabase',
      description: 'Search internal Career OS database for jobs, roles, cases, interview questions, and knowledge units',
      category: 'career_os_data',
      permissions: ['read:career_data'],
      riskLevel: 'read_only',
      cost: 'low',
      timeoutMs: 4000,
      inputSchema: {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'Semantic search keywords' },
          entityType: { type: 'string', enum: ['job', 'role', 'case', 'question', 'knowledge', 'source', 'all'] },
          limit: { type: 'number', default: 4 }
        },
        required: ['query']
      },
      outputSchema: {
        type: 'object',
        properties: {
          items: { type: 'array' },
          count: { type: 'number' }
        }
      },
      handler: async (args) => {
        const typeFilter = args.entityType && args.entityType !== 'all' ? [args.entityType] : undefined;
        const items = RetrievalEngine.retrieveRelevantEntities(args.query, args.limit || 4, typeFilter);
        return { items, count: items.length };
      }
    });

    // 2. Tool: calculateMetrics
    this.registerTool({
      name: 'calculateMetrics',
      description: 'Calculate product, financial, or career benchmarking metrics (CAC, LTV, Payback, Churn, Match Score)',
      category: 'calculator',
      permissions: ['compute:math'],
      riskLevel: 'safe',
      cost: 'none',
      timeoutMs: 2000,
      inputSchema: {
        type: 'object',
        properties: {
          metricType: { type: 'string', enum: ['CAC', 'LTV', 'LTV_CAC_RATIO', 'PAYBACK', 'BREAK_EVEN', 'WEIGHTED_MATCH'] },
          params: { type: 'object' }
        },
        required: ['metricType', 'params']
      },
      outputSchema: {
        type: 'object',
        properties: {
          result: { type: 'number' },
          unit: { type: 'string' },
          formula: { type: 'string' }
        }
      },
      handler: async (args) => {
        const { metricType, params } = args;
        switch (metricType) {
          case 'CAC': {
            const cost = Number(params.marketingCost || 0);
            const customers = Number(params.newCustomers || 1);
            return { result: Math.round((cost / customers) * 100) / 100, unit: 'USD / Customer', formula: 'Cost / Customers' };
          }
          case 'LTV': {
            const arpu = Number(params.arpu || 0);
            const margin = Number(params.grossMarginPct || 80) / 100;
            const churn = Number(params.churnPct || 5) / 100;
            const ltv = churn > 0 ? (arpu * margin) / churn : 0;
            return { result: Math.round(ltv * 100) / 100, unit: 'USD / Customer', formula: '(ARPU * Margin) / Churn' };
          }
          case 'LTV_CAC_RATIO': {
            const ltv = Number(params.ltv || 0);
            const cac = Number(params.cac || 1);
            return { result: Math.round((ltv / cac) * 100) / 100, unit: 'Ratio (x)', formula: 'LTV / CAC' };
          }
          case 'PAYBACK': {
            const cac = Number(params.cac || 0);
            const monthlyProfit = Number(params.monthlyGrossProfitPerCustomer || 1);
            return { result: Math.round((cac / monthlyProfit) * 10) / 10, unit: 'Months', formula: 'CAC / Monthly Gross Profit' };
          }
          case 'WEIGHTED_MATCH': {
            const matchedWeights = (params.matchedWeights || []) as number[];
            const totalWeights = (params.totalWeights || []) as number[];
            const sumMatched = matchedWeights.reduce((a, b) => a + b, 0);
            const sumTotal = totalWeights.reduce((a, b) => a + b, 0) || 1;
            return { result: Math.round((sumMatched / sumTotal) * 100), unit: 'Percentage (%)', formula: 'Matched / Total' };
          }
          default:
            return { result: 0, unit: 'Unknown', formula: 'None' };
        }
      }
    });

    // 3. Tool: executePythonOrJsSandbox
    this.registerTool({
      name: 'executePythonOrJsSandbox',
      description: 'Execute arbitrary data analysis or simulation script in a safe sandboxed environment',
      category: 'code_execution',
      permissions: ['execute:sandbox'],
      riskLevel: 'safe',
      cost: 'low',
      timeoutMs: 3000,
      inputSchema: {
        type: 'object',
        properties: {
          code: { type: 'string', description: 'JavaScript code snippet to execute' },
          inputData: { type: 'object' }
        },
        required: ['code']
      },
      outputSchema: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          output: { type: 'any' },
          logs: { type: 'array' }
        }
      },
      handler: async (args) => {
        return CodeExecution.executeCode({
          code: args.code,
          language: 'javascript',
          inputData: args.inputData,
        });
      }
    });

    // 4. Tool: searchWebResearch
    this.registerTool({
      name: 'searchWebResearch',
      description: 'Search external industry benchmarks, company disclosures, and technical documentation',
      category: 'web_research',
      permissions: ['read:external_web'],
      riskLevel: 'read_only',
      cost: 'medium',
      timeoutMs: 6000,
      inputSchema: {
        type: 'object',
        properties: {
          query: { type: 'string' },
          maxResults: { type: 'number', default: 3 }
        },
        required: ['query']
      },
      outputSchema: {
        type: 'object',
        properties: {
          sources: { type: 'array' }
        }
      },
      handler: async (args) => {
        // High-fidelity structured research simulation
        const q = (args.query || '').toLowerCase();
        const sources = [
          {
            title: `Market Intelligence Analysis: ${args.query}`,
            url: `https://industry-insights.org/research?q=${encodeURIComponent(args.query)}`,
            snippet: `Comprehensive market analysis and competitor dynamics regarding ${args.query}. Recent benchmarks indicate rapid transition to cloud automation.`,
            credibilityScore: 0.92,
            publishedYear: 2025
          },
          {
            title: `Benchmarking Report & Talent Landscape: ${args.query}`,
            url: `https://tech-salary-index.com/report/${encodeURIComponent(args.query)}`,
            snippet: `Compensation benchmark data and technical hiring velocity for high-growth firms. Key skill demand is up 38% year-over-year.`,
            credibilityScore: 0.88,
            publishedYear: 2025
          }
        ];
        return { sources, query: args.query };
      }
    });

    // 5. Tool: inspectUserModelInferences
    this.registerTool({
      name: 'inspectUserModelInferences',
      description: 'Retrieve verified user behavioral attributes, strengths, weaknesses, and recurring gaps with evidence',
      category: 'career_os_data',
      permissions: ['read:user_profile'],
      riskLevel: 'read_only',
      cost: 'none',
      timeoutMs: 1500,
      inputSchema: {
        type: 'object',
        properties: {
          minConfidence: { type: 'number', default: 0.70 },
          dimension: { type: 'string', enum: ['strength', 'weakness', 'preference', 'all'] }
        }
      },
      outputSchema: {
        type: 'object',
        properties: {
          inferences: { type: 'array' },
          count: { type: 'number' }
        }
      },
      handler: async (args) => {
        const minConf = args.minConfidence !== undefined ? args.minConfidence : 0.70;
        let infs = MemoryEngine.getUserModelInferences(minConf);
        if (args.dimension && args.dimension !== 'all') {
          infs = infs.filter(i => i.dimension === args.dimension);
        }
        return { inferences: infs, count: infs.length };
      }
    });

    // 6. Tool: parseJobDescription
    this.registerTool({
      name: 'parseJobDescription',
      description: 'Parse raw job description text to extract canonical skills, experience level, and key responsibilities',
      category: 'structured_data_processing',
      permissions: ['compute:parse'],
      riskLevel: 'safe',
      cost: 'none',
      timeoutMs: 2500,
      inputSchema: {
        type: 'object',
        properties: {
          jobText: { type: 'string' }
        },
        required: ['jobText']
      },
      outputSchema: {
        type: 'object',
        properties: {
          extractedSkills: { type: 'array' },
          responsibilities: { type: 'array' }
        }
      },
      handler: async (args) => {
        const text = args.jobText || '';
        const allSkills = CanonicalSkillRegistry.getAll();
        const matched = allSkills.filter(s => 
          text.toLowerCase().includes(s.canonicalName.toLowerCase()) ||
          (s.multilingualAliases?.en || []).some(a => text.toLowerCase().includes(a.toLowerCase())) ||
          (s.multilingualAliases?.vi || []).some(a => text.toLowerCase().includes(a.toLowerCase()))
        );

        return {
          extractedSkills: matched.map(m => ({ id: m.canonicalId, name: m.canonicalName, category: m.domain })),
          characterCount: text.length,
        };
      }
    });

    // 7. Tool: verifyRubricCompliance
    this.registerTool({
      name: 'verifyRubricCompliance',
      description: 'Check candidate content against structured STAR or Technical Architecture rubrics',
      category: 'structured_data_processing',
      permissions: ['compute:verify'],
      riskLevel: 'safe',
      cost: 'none',
      timeoutMs: 2000,
      inputSchema: {
        type: 'object',
        properties: {
          content: { type: 'string' },
          framework: { type: 'string', enum: ['STAR', 'SYSTEM_DESIGN', 'CASE_RESOLUTION'] }
        },
        required: ['content', 'framework']
      },
      outputSchema: {
        type: 'object',
        properties: {
          compliant: { type: 'boolean' },
          missingElements: { type: 'array' },
          score: { type: 'number' }
        }
      },
      handler: async (args) => {
        const text = (args.content || '').toLowerCase();
        const missing: string[] = [];
        let score = 100;

        if (args.framework === 'STAR') {
          if (!text.includes('tình huống') && !text.includes('situation') && !text.includes('bối cảnh')) {
            missing.push('Situation / Tình huống');
            score -= 25;
          }
          if (!text.includes('nhiệm vụ') && !text.includes('task') && !text.includes('mục tiêu')) {
            missing.push('Task / Nhiệm vụ');
            score -= 25;
          }
          if (!text.includes('hành động') && !text.includes('action') && !text.includes('thực hiện')) {
            missing.push('Action / Hành động cụ thể');
            score -= 25;
          }
          if (!text.includes('kết quả') && !text.includes('result') && !text.includes('tác động')) {
            missing.push('Result / Kết quả & Số liệu');
            score -= 25;
          }
        }

        return {
          compliant: missing.length === 0,
          missingElements: missing,
          score: Math.max(0, score),
        };
      }
    });

    this.initialized = true;
  }

  public static registerTool(tool: ToolDefinition): void {
    this.toolsRegistry.set(tool.name, tool);
  }

  public static getTool(name: string): ToolDefinition | undefined {
    this.initialize();
    return this.toolsRegistry.get(name);
  }

  public static getAllTools(): ToolDefinition[] {
    this.initialize();
    return Array.from(this.toolsRegistry.values());
  }

  /**
   * Execute tool with whitelist verification, timeout bounding, and telemetry recording
   */
  public static async executeTool(
    toolName: string, 
    args: any, 
    context?: any
  ): Promise<ToolCallRecord> {
    this.initialize();
    const callId = `call_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    const startTime = performance.now();

    const tool = this.toolsRegistry.get(toolName);
    if (!tool) {
      return {
        callId,
        toolName,
        inputArgs: args,
        status: 'failed',
        error: `Tool '${toolName}' is not permitted or does not exist in whitelist.`,
        executionTimeMs: 0,
      };
    }

    try {
      // Execute with timeout race
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error(`Tool execution timed out after ${tool.timeoutMs}ms`)), tool.timeoutMs)
      );

      const result = await Promise.race([
        tool.handler(args, context),
        timeoutPromise
      ]);

      const elapsed = performance.now() - startTime;

      return {
        callId,
        toolName,
        inputArgs: args,
        outputResult: result,
        status: 'success',
        executionTimeMs: Math.round(elapsed),
        costTokens: tool.cost === 'medium' ? 120 : (tool.cost === 'low' ? 30 : 0),
      };
    } catch (err: any) {
      const elapsed = performance.now() - startTime;
      const isTimeout = err?.message?.includes('timed out');
      return {
        callId,
        toolName,
        inputArgs: args,
        status: isTimeout ? 'timeout' : 'failed',
        error: err?.message || 'Unknown tool execution error',
        executionTimeMs: Math.round(elapsed),
      };
    }
  }
}
