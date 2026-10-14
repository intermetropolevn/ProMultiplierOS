import React from 'react';
import { 
  ProvenanceMetadata, 
  PROVENANCE_SOURCE_CONFIG, 
  PROVENANCE_VERIFICATION_CONFIG 
} from '../../features/knowledge/types/provenance';
import { ShieldCheck, Sparkles, Globe, User, Database, Info, ExternalLink } from 'lucide-react';

interface ProvenanceBadgeProps {
  provenance?: Partial<ProvenanceMetadata>;
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
}

export const ProvenanceBadge: React.FC<ProvenanceBadgeProps> = ({
  provenance,
  size = 'md',
  showDetails = false
}) => {
  const source = provenance?.source || 'Curated';
  const verification = provenance?.verification || 'Partially Verified';

  const sourceConfig = PROVENANCE_SOURCE_CONFIG[source] || PROVENANCE_SOURCE_CONFIG['Curated'];
  const verificationConfig = PROVENANCE_VERIFICATION_CONFIG[verification] || PROVENANCE_VERIFICATION_CONFIG['Partially Verified'];

  const getSourceIcon = () => {
    switch (source) {
      case 'Official':
        return <Globe className="w-3 h-3 text-emerald-600" />;
      case 'AI Suggested':
        return <Sparkles className="w-3 h-3 text-purple-600" />;
      case 'User Added':
        return <User className="w-3 h-3 text-slate-600" />;
      case 'Imported':
        return <Database className="w-3 h-3 text-indigo-600" />;
      case 'Curated':
        return <ShieldCheck className="w-3 h-3 text-blue-600" />;
      default:
        return <Info className="w-3 h-3 text-amber-600" />;
    }
  };

  const isCompact = size === 'sm';

  return (
    <div className="inline-flex items-center gap-1.5 flex-wrap">
      {/* Source Origin Pill */}
      <span 
        className={`inline-flex items-center gap-1 font-bold rounded-md border tracking-wide uppercase ${sourceConfig.badgeColor} ${
          isCompact ? 'text-[9px] px-1.5 py-0.5' : 'text-[10px] px-2 py-0.5'
        }`}
        title={`Source Origin: ${sourceConfig.description}`}
      >
        {getSourceIcon()}
        <span>{sourceConfig.label}</span>
      </span>

      {/* Verification Level Pill */}
      <span 
        className={`inline-flex items-center gap-1 font-bold rounded-md border tracking-wide uppercase ${verificationConfig.badgeColor} ${
          isCompact ? 'text-[9px] px-1.5 py-0.5' : 'text-[10px] px-2 py-0.5'
        }`}
        title={`Verification Level: ${verificationConfig.description}`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${verificationConfig.dotColor}`} />
        <span>{verificationConfig.label}</span>
      </span>

      {showDetails && provenance?.verifiedAt && (
        <span className="text-[10px] text-slate-500 font-medium">
          (Audit: {provenance.verifiedAt})
        </span>
      )}
    </div>
  );
};

export const ProvenanceAuditSection: React.FC<{ provenance: ProvenanceMetadata }> = ({ provenance }) => {
  const sourceConfig = PROVENANCE_SOURCE_CONFIG[provenance.source] || PROVENANCE_SOURCE_CONFIG['Curated'];
  const verificationConfig = PROVENANCE_VERIFICATION_CONFIG[provenance.verification] || PROVENANCE_VERIFICATION_CONFIG['Partially Verified'];

  return (
    <div className="p-4 rounded-2xl border border-slate-200 bg-linear-to-br from-slate-50 to-blue-50/30 space-y-3">
      <div className="flex items-center justify-between gap-2 border-b border-slate-200/80 pb-2.5">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-blue-600" />
          <h4 className="text-xs font-black uppercase text-slate-900 tracking-wider">
            Data Quality & Provenance Ledger
          </h4>
        </div>
        <ProvenanceBadge provenance={provenance} size="md" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        <div className="space-y-1">
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Source Classification</span>
          <p className="font-semibold text-slate-800 flex items-center gap-1.5">
            <span>{sourceConfig.label}</span>
            <span className="text-slate-400 font-normal">— {sourceConfig.description}</span>
          </p>
        </div>

        <div className="space-y-1">
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Verification Audit</span>
          <p className="font-semibold text-slate-800 flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${verificationConfig.dotColor} shrink-0`} />
            <span>{verificationConfig.label}</span>
            <span className="text-slate-400 font-normal">— {verificationConfig.description}</span>
          </p>
        </div>

        {provenance.sourceUrl && (
          <div className="space-y-1 md:col-span-2">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Source Origin URL</span>
            <div>
              <a 
                href={provenance.sourceUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline inline-flex items-center gap-1 text-xs break-all font-mono"
              >
                <span>{provenance.sourceUrl}</span>
                <ExternalLink className="w-3 h-3 shrink-0" />
              </a>
            </div>
          </div>
        )}

        {provenance.verifiedAt && (
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Verification Timestamp</span>
            <p className="font-semibold text-slate-700 font-mono text-[11px]">{provenance.verifiedAt}</p>
          </div>
        )}

        {provenance.verifiedBy && (
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Verified By</span>
            <p className="font-semibold text-slate-700">{provenance.verifiedBy}</p>
          </div>
        )}

        {provenance.verificationNotes && (
          <div className="space-y-1 md:col-span-2 bg-white/70 p-2.5 rounded-xl border border-slate-200/60">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Provenance Auditor Notes</span>
            <p className="text-slate-600 text-xs italic">{provenance.verificationNotes}</p>
          </div>
        )}
      </div>
    </div>
  );
};
