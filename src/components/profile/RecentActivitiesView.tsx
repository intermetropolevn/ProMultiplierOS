import React, { useState, useMemo } from 'react';
import { 
  Activity, 
  Briefcase, 
  BookOpen, 
  Mic2, 
  FileText, 
  Send, 
  CheckCircle2, 
  Clock, 
  Filter, 
  Sparkles,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Layers
} from 'lucide-react';
import { ActivityService, ActivityEvent, ActivityCategory } from '../../services/activityService';

interface RecentActivitiesViewProps {
  onNavigateToTab?: (tab: string, subTab?: string) => void;
}

export const RecentActivitiesView: React.FC<RecentActivitiesViewProps> = ({
  onNavigateToTab,
}) => {
  const [activities, setActivities] = useState<ActivityEvent[]>(() => ActivityService.getActivities());
  const [activeCategory, setActiveCategory] = useState<ActivityCategory | 'all'>('all');

  const categories: { id: ActivityCategory | 'all'; label: string; count: number }[] = useMemo(() => {
    return [
      { id: 'all', label: 'All Activities', count: activities.length },
      { id: 'work', label: 'Work Experiences', count: activities.filter(a => a.category === 'work').length },
      { id: 'blueprint', label: 'Q&A Blueprints', count: activities.filter(a => a.category === 'blueprint').length },
      { id: 'practice', label: 'Practice Sessions', count: activities.filter(a => a.category === 'practice').length },
      { id: 'resume', label: 'Resume & Parsing', count: activities.filter(a => a.category === 'resume').length },
      { id: 'other', label: 'Milestones & Other', count: activities.filter(a => a.category === 'other').length },
    ];
  }, [activities]);

  const filteredActivities = useMemo(() => {
    if (activeCategory === 'all') return activities;
    return activities.filter(a => a.category === activeCategory);
  }, [activities, activeCategory]);

  const getCategoryIcon = (category: ActivityCategory) => {
    switch (category) {
      case 'work':
        return <Briefcase className="w-4 h-4 text-amber-600" />;
      case 'blueprint':
        return <BookOpen className="w-4 h-4 text-purple-600" />;
      case 'practice':
        return <Mic2 className="w-4 h-4 text-blue-600" />;
      case 'resume':
        return <FileText className="w-4 h-4 text-emerald-600" />;
      case 'other':
      default:
        return <Activity className="w-4 h-4 text-slate-600" />;
    }
  };

  const formatRelativeTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / (60 * 1000));
      const diffHours = Math.floor(diffMs / (3600 * 1000));
      const diffDays = Math.floor(diffMs / (24 * 3600 * 1000));

      if (diffMins < 5) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays === 1) return 'Yesterday';
      if (diffDays < 7) return `${diffDays}d ago`;
      return date.toLocaleDateString();
    } catch {
      return 'Recently';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-2xs font-bold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200">
              Audit & History
            </span>
            <h3 className="text-base font-bold text-slate-900">Recent Career OS Activities</h3>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-xl">
            Live chronological timeline of your career operations, interview practice simulations, blueprint creations, and resume updates.
          </p>
        </div>

        <div className="flex items-center gap-2 text-2xs text-slate-500 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200/80">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>Auto-synced across system modules</span>
        </div>
      </div>

      {/* Lightweight Category Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              id={`activity-filter-${cat.id}`}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                isActive
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <span>{cat.label}</span>
              <span className={`text-2xs px-1.5 py-0.2 rounded-full font-mono font-bold ${
                isActive ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-500'
              }`}>
                {cat.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Chronological Timeline List */}
      <div className="space-y-3">
        {filteredActivities.map((evt, idx) => (
          <div
            key={evt.id}
            className="bg-white p-4 rounded-xl border border-slate-200 hover:border-slate-300 shadow-2xs transition-all flex items-start justify-between gap-4"
          >
            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0 mt-0.5">
                {getCategoryIcon(evt.category)}
              </div>

              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="text-xs font-bold text-slate-900">{evt.title}</h4>
                  
                  {evt.badgeText && (
                    <span className={`px-2 py-0.5 rounded text-2xs font-semibold ${
                      evt.badgeVariant === 'emerald'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : evt.badgeVariant === 'purple'
                          ? 'bg-purple-50 text-purple-700 border border-purple-200'
                          : evt.badgeVariant === 'amber'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-blue-50 text-blue-700 border border-blue-200'
                    }`}>
                      {evt.badgeText}
                    </span>
                  )}

                  <span className="text-2xs font-mono text-slate-400">
                    • {formatRelativeTime(evt.timestamp)}
                  </span>
                </div>

                <p className="text-2xs text-slate-600 leading-relaxed max-w-2xl">
                  {evt.description}
                </p>

                <div className="flex items-center gap-3 pt-1 text-2xs text-slate-400">
                  <span>Source: <strong className="text-slate-600">{evt.source}</strong></span>
                  <span>Timestamp: {new Date(evt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            </div>

            {evt.linkTo && (
              <button
                onClick={() => onNavigateToTab?.(evt.linkTo!.tab, evt.linkTo!.subTab)}
                className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors shrink-0 flex items-center gap-1 text-2xs font-semibold"
                title="Navigate to item"
              >
                View <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        ))}

        {filteredActivities.length === 0 && (
          <div className="py-12 text-center bg-white rounded-2xl border border-dashed border-slate-300">
            <Activity className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-xs font-semibold text-slate-700">No activities found in this category.</p>
            <p className="text-2xs text-slate-400 mt-0.5">Activities will appear automatically as you work in Career OS.</p>
          </div>
        )}
      </div>

    </div>
  );
};
