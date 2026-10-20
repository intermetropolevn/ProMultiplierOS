import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Eye, 
  Trash2, 
  RotateCw, 
  CheckCircle2, 
  AlertCircle, 
  Sliders, 
  ExternalLink,
  Ban
} from 'lucide-react';
import { EvidenceSourceConnector } from '../../features/evidenceIntelligence/types';
import { evidenceIntelligenceStore } from '../../features/evidenceIntelligence/services/evidenceIntelligenceStore';

export const EvidenceSettingsView: React.FC = () => {
  const [connectors, setConnectors] = useState<EvidenceSourceConnector[]>(
    evidenceIntelligenceStore.getConnectors()
  );
  const [editingScopeId, setEditingScopeId] = useState<string | null>(null);
  const [newScopeText, setNewScopeText] = useState('');

  const handleToggle = (id: string) => {
    evidenceIntelligenceStore.toggleConnector(id);
    setConnectors([...evidenceIntelligenceStore.getConnectors()]);
  };

  const handleExclude = (id: string) => {
    evidenceIntelligenceStore.toggleSourceExclusion(id);
    setConnectors([...evidenceIntelligenceStore.getConnectors()]);
  };

  const handleSaveScope = (id: string) => {
    if (newScopeText.trim()) {
      evidenceIntelligenceStore.updatePrivacyScope(id, newScopeText.trim());
      setConnectors([...evidenceIntelligenceStore.getConnectors()]);
    }
    setEditingScopeId(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      
      {/* 1. Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 sm:p-6 space-y-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
              Evidence Settings &amp; Sources
            </span>
            <span className="text-slate-300">·</span>
            <span className="text-xs text-slate-500 font-medium">Privacy Architecture &amp; User Sovereign Control</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Connected Sources &amp; Privacy Governance
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
            CareerOS is an individual practitioner career vault, NOT employee surveillance software. You maintain complete sovereign control over every ingested signal and inferred capability.
          </p>
        </div>

        {/* Privacy Guarantees Strip (Section 18) */}
        <div className="pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/70 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-slate-900">
              <Lock className="w-3.5 h-3.5 text-blue-600" />
              <span>Zero Surveillance Guarantee</span>
            </div>
            <p className="text-slate-600 leading-snug">
              Employers cannot access your CareerOS evidence vault or observe inferred capability metrics.
            </p>
          </div>

          <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/70 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-slate-900">
              <Eye className="w-3.5 h-3.5 text-purple-600" />
              <span>Explicit User Confirmation</span>
            </div>
            <p className="text-slate-600 leading-snug">
              Every automatically detected career signal requires your explicit confirmation before becoming permanent.
            </p>
          </div>

          <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/70 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-slate-900">
              <Trash2 className="w-3.5 h-3.5 text-rose-600" />
              <span>Right of Expungement</span>
            </div>
            <p className="text-slate-600 leading-snug">
              You can exclude entire sources, redact specific tickets, or delete inferred evidence records at any time.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Connected Sources Management (Section 17) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Configured Activity Sources ({connectors.length})
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Manage sync status, inspect evidence types captured, and tailor privacy filters per source connector.
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-400">All local to user session</span>
        </div>

        <div className="space-y-3">
          {connectors.map((conn) => {
            const isEditingThis = editingScopeId === conn.id;
            return (
              <div 
                key={conn.id}
                className={`p-4 rounded-xl border transition-all ${
                  conn.isExcluded
                    ? 'bg-slate-50/50 border-slate-200 opacity-60'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{conn.source}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 border border-slate-200">
                        {conn.category}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.2 rounded ${
                        conn.status === 'Connected' 
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                          : conn.status === 'Paused' 
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}>
                        {conn.status}
                      </span>
                      {conn.isExcluded && (
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-rose-100 text-rose-800">
                          Excluded
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-slate-500 flex items-center gap-2 flex-wrap">
                      <span>Captured signals: <strong>{conn.evidenceTypesCaptured.join(', ')}</strong></span>
                      <span>·</span>
                      <span>Last sync: <strong>{conn.lastSync}</strong></span>
                      <span>·</span>
                      <span>Records: <strong>{conn.recordsIngested}</strong></span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-start sm:self-auto shrink-0 text-xs">
                    <button
                      type="button"
                      onClick={() => handleToggle(conn.id)}
                      className="px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-100 font-semibold text-slate-700 cursor-pointer"
                    >
                      {conn.status === 'Connected' ? 'Pause Sync' : 'Resume'}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleExclude(conn.id)}
                      className={`px-2.5 py-1 rounded-lg border font-semibold cursor-pointer ${
                        conn.isExcluded 
                          ? 'border-blue-200 bg-blue-50 text-blue-700' 
                          : 'border-slate-200 hover:bg-rose-50 text-slate-700 hover:text-rose-700'
                      }`}
                    >
                      {conn.isExcluded ? 'Include Source' : 'Exclude Source'}
                    </button>
                  </div>
                </div>

                {/* Privacy Scope Rule */}
                <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Privacy Scope:</span>
                    {isEditingThis ? (
                      <input
                        type="text"
                        value={newScopeText}
                        onChange={(e) => setNewScopeText(e.target.value)}
                        className="p-1 text-xs bg-white border border-slate-300 rounded font-normal w-64"
                      />
                    ) : (
                      <span className="font-medium text-slate-800">{conn.privacyScope}</span>
                    )}
                  </div>

                  {isEditingThis ? (
                    <button
                      type="button"
                      onClick={() => handleSaveScope(conn.id)}
                      className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
                    >
                      Save Scope
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingScopeId(conn.id);
                        setNewScopeText(conn.privacyScope);
                      }}
                      className="text-[11px] text-slate-400 hover:text-slate-700 hover:underline cursor-pointer"
                    >
                      Edit Scope Rule
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
