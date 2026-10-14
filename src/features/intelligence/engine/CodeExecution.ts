// =========================================================================
// CAREER INTELLIGENCE ENGINE - CODE EXECUTION SANDBOX
// =========================================================================

import { CodeExecutionRequest, CodeExecutionResult } from './types';

export class CodeExecution {
  /**
   * Safely executes mathematical modeling, financial calculations, and data analysis
   * in a controlled JavaScript sandbox.
   */
  public static executeCode(request: CodeExecutionRequest): CodeExecutionResult {
    const startTime = performance.now();
    const logs: string[] = [];

    // Custom logger injected into execution scope
    const sandboxConsole = {
      log: (...args: any[]) => logs.push(args.map(a => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' ')),
      warn: (...args: any[]) => logs.push(`[WARN] ${args.join(' ')}`),
      error: (...args: any[]) => logs.push(`[ERROR] ${args.join(' ')}`),
    };

    try {
      // Whitelist safe built-in math & utilities
      const safeScope = {
        Math,
        Number,
        String,
        Array,
        Object,
        parseInt,
        parseFloat,
        isNaN,
        isFinite,
        console: sandboxConsole,
        input: request.inputData || {},
        // Pre-packaged financial & career metric helper formulas
        metrics: {
          calculateCAC: (marketingCost: number, newCustomers: number) => 
            newCustomers > 0 ? marketingCost / newCustomers : 0,
          calculateLTV: (arpu: number, grossMarginPct: number, churnPct: number) => 
            churnPct > 0 ? (arpu * (grossMarginPct / 100)) / (churnPct / 100) : 0,
          calculateLtvCacRatio: (ltv: number, cac: number) => 
            cac > 0 ? ltv / cac : 0,
          calculatePaybackMonths: (cac: number, arpu: number, grossMarginPct: number) => 
            (arpu * (grossMarginPct / 100)) > 0 ? cac / (arpu * (grossMarginPct / 100)) : 0,
          calculateBreakEvenUnits: (fixedCosts: number, unitPrice: number, variableCost: number) => 
            (unitPrice - variableCost) > 0 ? fixedCosts / (unitPrice - variableCost) : 0,
        }
      };

      // Wrap code in an isolated IIFE
      const wrappedCode = `
        "use strict";
        return (function(scope) {
          const { Math, Number, String, Array, Object, parseInt, parseFloat, console, input, metrics } = scope;
          ${request.code.includes('return') ? request.code : `return (${request.code});`}
        })(safeScope);
      `;

      // Function constructor with isolated scope parameter
      const runner = new Function('safeScope', wrappedCode);
      const output = runner(safeScope);

      const elapsed = performance.now() - startTime;

      return {
        success: true,
        output,
        logs,
        executionTimeMs: Math.round(elapsed * 10) / 10,
      };
    } catch (err: any) {
      const elapsed = performance.now() - startTime;
      return {
        success: false,
        output: null,
        logs,
        executionTimeMs: Math.round(elapsed * 10) / 10,
        error: err?.message || 'Sandbox execution runtime error',
      };
    }
  }
}
