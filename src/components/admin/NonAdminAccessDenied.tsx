import React from 'react';
import { ShieldAlert, Lock, ArrowRight, UserCheck } from 'lucide-react';

interface NonAdminAccessDeniedProps {
  onSwitchToAdmin: () => void;
  onGoHome: () => void;
}

export const NonAdminAccessDenied: React.FC<NonAdminAccessDeniedProps> = ({
  onSwitchToAdmin,
  onGoHome
}) => {
  return (
    <div className="max-w-2xl mx-auto my-12 bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden text-center p-8 sm:p-12 space-y-6">
      
      <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-600 border border-red-200 flex items-center justify-center mx-auto shadow-inner">
        <ShieldAlert className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full font-bold text-xs uppercase tracking-wider">
          403 Forbidden • Access Restricted
        </span>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
          Administrator Privilege Required
        </h2>
        <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
          The Career OS Data Crawler, Source Registry, and Ingestion Engine are strictly restricted to authenticated administrators.
          Crawler credentials, tokens, and job runners are disabled for candidate sessions.
        </p>
      </div>

      <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-left text-xs space-y-2 max-w-md mx-auto">
        <div className="font-bold text-slate-800 flex items-center gap-1.5">
          <Lock className="w-3.5 h-3.5 text-slate-500" />
          Enforced Server-Side RBAC Rules:
        </div>
        <ul className="space-y-1 text-slate-600">
          <li>• <code className="font-mono text-slate-800">crawler.view</code>: Denied</li>
          <li>• <code className="font-mono text-slate-800">crawler.run</code>: Denied</li>
          <li>• <code className="font-mono text-slate-800">crawler.manage_sources</code>: Denied</li>
          <li>• <code className="font-mono text-slate-800">crawler.publish</code>: Denied</li>
        </ul>
      </div>

      <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          onClick={onGoHome}
          className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-all cursor-pointer"
        >
          Return to Career OS
        </button>

        <button
          onClick={onSwitchToAdmin}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-bold rounded-xl text-xs shadow-md transition-all cursor-pointer"
        >
          <UserCheck className="w-4 h-4" />
          <span>Switch to Lead Admin Session</span>
        </button>
      </div>

    </div>
  );
};
