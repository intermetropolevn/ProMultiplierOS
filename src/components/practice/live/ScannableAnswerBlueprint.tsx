import React from 'react';
import { 
  Target, 
  Layers, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  HelpCircle,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { ConfiguredBlueprint } from './liveInterviewData';

interface ScannableAnswerBlueprintProps {
  blueprint: ConfiguredBlueprint;
  isCompact?: boolean;
}

/**
 * Strips raw markdown noise while converting bullet/numbered lines into clean strings
 */
function cleanText(raw?: string): string {
  if (!raw) return '';
  return raw
    .replace(/^#{1,6}\s+/gm, '') // Remove heading hashes
    .replace(/\*\*(.*?)\*\*/g, '$1') // Extract bold content
    .replace(/\*(.*?)\*/g, '$1') // Extract italic content
    .replace(/^>\s+/gm, '') // Remove blockquotes
    .replace(/^-{3,}\s*$/gm, '') // Remove horizontal rules
    .trim();
}

/**
 * Renders an essential, cheat-sheet style Answer Blueprint with scannable sections,
 * zero raw markdown tokens, and clear visual hierarchy.
 */
export const ScannableAnswerBlueprint: React.FC<ScannableAnswerBlueprintProps> = ({
  blueprint,
  isCompact = false
}) => {
  const bp = blueprint.blueprint;
  const canonical = blueprint.canonicalBlueprint;

  // Extract key sections cleanly
  const openingHook = cleanText(bp.opening || canonical?.components?.openingHook);
  const contextSituation = cleanText(bp.situation || canonical?.components?.situation || canonical?.components?.context);
  const actionsList = (bp.action && bp.action.length > 0 ? bp.action : canonical?.components?.action || [])
    .map(cleanText)
    .filter(Boolean);
  const resultsList = (bp.result && bp.result.length > 0 ? bp.result : canonical?.components?.result || [])
    .map(cleanText)
    .filter(Boolean);
  const metricsList = (bp.metrics && bp.metrics.length > 0 ? bp.metrics : canonical?.metrics || [])
    .map(cleanText)
    .filter(Boolean);
  const tradeoffsList = (bp.tradeoffs && bp.tradeoffs.length > 0 ? bp.tradeoffs : [])
    .map(cleanText)
    .filter(Boolean);

  return (
    <div className="space-y-3.5 text-xs">
      
      {/* 1. TARGET & WHAT TO ADDRESS (Live Interview Cheat Sheet Header) */}
      <div className="p-3 rounded-xl bg-slate-900 text-white space-y-1.5 shadow-2xs">
        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-purple-300">
          <span className="flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5 text-purple-400" />
            Core Delivery Target
          </span>
          <span className="text-slate-400 font-medium">
            {bp.framework} · {bp.targetDuration || '90-120s'}
          </span>
        </div>
        <p className="text-xs font-semibold text-slate-100 leading-snug">
          {openingHook || `Directly address the question with structured reasoning and clear production evidence.`}
        </p>
      </div>

      {/* 2. SUGGESTED STRUCTURE & CONTEXT */}
      {contextSituation && (
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/90 space-y-1">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1">
            <Layers className="w-3 h-3 text-slate-400" />
            1. Problem Context &amp; Scope
          </span>
          <p className="text-slate-700 font-medium leading-relaxed">
            {contextSituation}
          </p>
        </div>
      )}

      {/* 3. KEY THINKING POINTS & ACTIONS (The Core Cheat Sheet) */}
      {actionsList.length > 0 && (
        <div className="p-3 rounded-xl bg-purple-50/60 border border-purple-200/80 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-900 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-purple-600" />
              2. Key Approach &amp; Architecture Points
            </span>
            <span className="text-[10px] font-bold text-purple-700 bg-purple-100 px-1.5 py-0.2 rounded">
              {actionsList.length} steps
            </span>
          </div>

          <div className="space-y-1.5 pt-0.5">
            {actionsList.map((action, i) => (
              <div key={i} className="flex items-start gap-2 bg-white/80 p-2 rounded-lg border border-purple-100 shadow-3xs">
                <span className="w-4 h-4 rounded-full bg-purple-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span className="text-slate-800 font-medium leading-relaxed">
                  {action}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. IMPORTANT TRADE-OFFS & CONSTRAINTS */}
      {tradeoffsList.length > 0 && (
        <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/80 space-y-1.5">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-900 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-amber-600" />
            3. Explicit Trade-offs &amp; Constraints Evaluated
          </span>
          <ul className="space-y-1 pt-0.5">
            {tradeoffsList.map((tradeoff, i) => (
              <li key={i} className="text-amber-950 font-medium flex items-start gap-2 leading-relaxed">
                <span className="text-amber-500 font-bold">•</span>
                <span>{tradeoff}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 5. MEASURABLE RESULTS & AUDITABLE PROOF METRICS */}
      {(resultsList.length > 0 || metricsList.length > 0) && (
        <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200/80 space-y-2">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-900 flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-emerald-600" />
            4. Measurable Outcomes &amp; Evidence
          </span>

          {resultsList.length > 0 && (
            <p className="text-emerald-950 font-semibold leading-relaxed">
              {resultsList.join(' ')}
            </p>
          )}

          {metricsList.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {metricsList.map((metric, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white text-emerald-900 border border-emerald-200 text-[10px] font-bold shadow-3xs"
                >
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>{metric}</span>
                </span>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
};
