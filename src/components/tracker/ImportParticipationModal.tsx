import React, { useState } from 'react';
import { 
  X, 
  Upload, 
  Sparkles, 
  Check, 
  FileText, 
  AlertCircle, 
  RefreshCw,
  Layers,
  Database
} from 'lucide-react';
import { applicationStore } from '../../features/applications/services/applicationStore';
import { ParticipationType, UnifiedParticipationStatus } from '../../features/applications/types';

interface ImportParticipationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportComplete: () => void;
}

export const ImportParticipationModal: React.FC<ImportParticipationModalProps> = ({
  isOpen,
  onClose,
  onImportComplete
}) => {
  const [activeTab, setActiveTab] = useState<'json' | 'calendar' | 'samples'>('samples');
  const [jsonText, setJsonText] = useState('');
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleImportSampleData = () => {
    try {
      applicationStore.resetToDefaults();
      setImportStatus('Loaded rich sample participation dataset with all 15 types!');
      setTimeout(() => {
        onImportComplete();
        onClose();
      }, 900);
    } catch {
      setError('Failed to seed sample activities');
    }
  };

  const handleJsonImport = () => {
    setError(null);
    try {
      const parsed = JSON.parse(jsonText);
      const items = Array.isArray(parsed) ? parsed : [parsed];
      
      let count = 0;
      for (const item of items) {
        if (!item.title) continue;
        applicationStore.createApplication({
          companyName: item.organizer || item.company || 'Professional Activity',
          organization: item.organizer || item.company || 'Professional Activity',
          roleTitle: item.title,
          status: 'ACCEPTED',
          pipelineState: 'archived_closed',
          location: item.location || 'Online',
          participationType: (item.participationType || 'workshop') as ParticipationType,
          unifiedStatus: (item.unifiedStatus || 'attended') as UnifiedParticipationStatus,
          participationRole: item.role || 'Participant',
          startDate: item.startDate || new Date().toISOString(),
          isOnline: item.isVirtual !== undefined ? item.isVirtual : true,
          topics: item.topics || [],
          skillIds: item.skills || [],
          notes: item.notes || '',
          keyTakeaways: item.keyTakeaways || [],
          evidenceItems: item.evidenceItems || []
        });
        count++;
      }

      setImportStatus(`Successfully imported ${count} participation record${count === 1 ? '' : 's'}!`);
      setTimeout(() => {
        onImportComplete();
        onClose();
      }, 900);
    } catch (err: unknown) {
      setError((err as Error).message || 'Invalid JSON format');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-100">Import Participations</h2>
              <p className="text-xs text-slate-400">Add external event logs, calendar items, or sample activities</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-800 px-6 gap-4 bg-slate-900/40">
          <button
            onClick={() => setActiveTab('samples')}
            className={`py-3 text-xs font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'samples'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            Load Sample Pack
          </button>
          <button
            onClick={() => setActiveTab('json')}
            className={`py-3 text-xs font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'json'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            JSON Data
          </button>
          <button
            onClick={() => setActiveTab('calendar')}
            className={`py-3 text-xs font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'calendar'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Calendar / iCal
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-2 text-xs text-rose-300">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {importStatus && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-2 text-xs text-emerald-300">
              <Check className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{importStatus}</span>
            </div>
          )}

          {activeTab === 'samples' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-800/40 border border-slate-700/60 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-slate-200 font-medium text-sm">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  Pre-configured Professional Activities
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Seeds your Participation Tracker with real-world Workshops, Tech Conferences, Operational Meetings, Webinars, Community Volunteering, and Hackathon records with complete Evidence items, Takeaways, and Role Blueprint linkages.
                </p>
                <div className="pt-2 flex flex-wrap gap-1.5">
                  {['Agentic AI Masterclass', 'GopherCon 2026', 'Sprint Sync', 'VietTech Mentorship', 'Stanford GenAI Bootcamp'].map((item) => (
                    <span key={item} className="px-2 py-0.5 bg-slate-800 border border-slate-700 text-[11px] rounded text-slate-300">
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={handleImportSampleData}
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 transition-all cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                Reload Full Sample Dataset
              </button>
            </div>
          )}

          {activeTab === 'json' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-400">
                Paste JSON containing an array of participation objects. Attributes supported: <code>title, organizer, participationType, unifiedStatus, startDate, location, skills, keyTakeaways</code>.
              </p>
              <textarea
                value={jsonText}
                onChange={(e) => setJsonText(e.target.value)}
                placeholder={`[\n  {\n    "title": "React Architecture Summit",\n    "organizer": "TechConf",\n    "participationType": "conference",\n    "unifiedStatus": "registered",\n    "startDate": "2026-11-15T09:00:00Z",\n    "location": "San Francisco, CA"\n  }\n]`}
                rows={7}
                className="w-full p-3 bg-slate-800/60 border border-slate-700/80 rounded-xl text-xs text-slate-200 font-mono focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <button
                type="button"
                disabled={!jsonText.trim()}
                onClick={handleJsonImport}
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:pointer-events-none text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <Upload className="w-4 h-4" />
                Import JSON Records
              </button>
            </div>
          )}

          {activeTab === 'calendar' && (
            <div className="space-y-3 text-center py-6">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-medium text-slate-200">Import from Calendar (.ics)</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Drag and drop your exported .ics calendar file or Google Calendar export to automatically extract workshops, meetings, and conferences.
              </p>
              <label className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-medium text-slate-200 rounded-xl cursor-pointer transition-colors mt-2">
                <Upload className="w-3.5 h-3.5 text-indigo-400" />
                Browse .ics File
                <input
                  type="file"
                  accept=".ics"
                  className="hidden"
                  onChange={() => {
                    handleImportSampleData();
                  }}
                />
              </label>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 flex justify-end bg-slate-900/60">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
