import React from 'react';
import { Layers, Sparkles, BookOpen, Briefcase, CheckCircle2, Shield } from 'lucide-react';
import { ActiveTab } from './Header';
import { openProtectedPreviewNotice } from '../access/ProtectedPreviewOverlay';

interface FooterProps {
  onNavigate: (tab: ActiveTab) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          
          {/* Brand Col */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                <Layers className="w-4 h-4" />
              </div>
              <span className="text-base font-bold text-white tracking-tight">
                CAREER INTERVIEW <span className="text-blue-400">OS</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Find the role. Learn what matters. Practice the interview.
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Zero generic filler • Real engineering & product blueprints</span>
            </div>
          </div>

          {/* Pillar 1: Discover */}
          <div>
            <h4 className="text-xs uppercase font-bold tracking-wider text-slate-400 mb-3 flex items-center gap-2">
              <Briefcase className="w-3.5 h-3.5 text-blue-400" />
              Pillar 1: Discover
            </h4>
            <ul className="space-y-2 text-sm text-slate-300">
              <li>
                <button 
                  onClick={() => onNavigate('discover')} 
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Jobs & Opportunities Explorer
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('discover')} 
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Role Blueprints & Salary Bands
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('tracker')} 
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Wishlist & Pipeline Tracker
                </button>
              </li>
            </ul>
          </div>

          {/* Pillar 2: Prepare */}
          <div>
            <h4 className="text-xs uppercase font-bold tracking-wider text-slate-400 mb-3 flex items-center gap-2">
              <BookOpen className="w-3.5 h-3.5 text-teal-400" />
              Pillar 2: Prepare
            </h4>
            <ul className="space-y-2 text-sm text-slate-300">
              <li>
                <button 
                  onClick={() => onNavigate('prepare')} 
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Roles Encyclopedia & Day-in-the-Life
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('prepare')} 
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Industry Domains & Jargon Glossaries
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('prepare')} 
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Engineering & Product Workflows
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('prepare')} 
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Practical Case Studies & Trade-offs
                </button>
              </li>
            </ul>
          </div>

          {/* Pillar 3: Practice */}
          <div>
            <h4 className="text-xs uppercase font-bold tracking-wider text-slate-400 mb-3 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Pillar 3: Practice
            </h4>
            <ul className="space-y-2 text-sm text-slate-300">
              <li>
                <button 
                  onClick={() => onNavigate('practice')} 
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Live Mock Interview Simulator
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('practice')} 
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Voice Dictation & Audio Question Reader
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('practice')} 
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Instant STAR Rubric & Exemplary Answers
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('tracker')} 
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Readiness Score & Session History
                </button>
              </li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span>© 2026 Dynaisys. All rights reserved.</span>
            <span>·</span>
            <span>Developer / Product: <strong className="text-slate-300 font-semibold">Dynaisys</strong> (<a href="mailto:cpo@dynaisys.com" className="text-blue-400 hover:underline">cpo@dynaisys.com</a>)</span>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={() => openProtectedPreviewNotice('CareerOS Public Beta Environment')}
              className="inline-flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors cursor-pointer font-medium"
            >
              <Shield className="w-3.5 h-3.5 text-blue-400" />
              <span>CareerOS Protected Preview Notice</span>
            </button>
            <span>•</span>
            <span>Press <kbd className="px-1.5 py-0.5 font-mono bg-slate-800 text-slate-300 rounded border border-slate-700">⌘K</kbd> anywhere to search</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
