import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  Clock, 
  FileText, 
  RotateCcw, 
  CheckCircle2, 
  HelpCircle,
  Eye,
  X
} from 'lucide-react';
import { InterviewQuestion } from '../../../types';

interface ChatMessage {
  id: string;
  sender: 'ai' | 'candidate';
  text: string;
  timestamp: string;
  isEvaluation?: boolean;
}

interface MockChatViewProps {
  question: InterviewQuestion;
  questionNumber: number;
  totalQuestions: number;
  initialAnswer?: string;
  onSubmitAnswer: (answer: string) => void;
  isSubmitting?: boolean;
  hasSubmittedAnswer?: boolean;
  exampleAnswer?: string;
}

export const MockChatView: React.FC<MockChatViewProps> = ({
  question,
  questionNumber,
  totalQuestions,
  initialAnswer = '',
  onSubmitAnswer,
  isSubmitting = false,
  hasSubmittedAnswer = false,
  exampleAnswer,
}) => {
  const [inputText, setInputText] = useState(initialAnswer);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isExampleModalOpen, setIsExampleModalOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sync initial question as initial AI message
  useEffect(() => {
    const aiMessage: ChatMessage = {
      id: `ai-q-${question.id}`,
      sender: 'ai',
      text: question.question,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    if (initialAnswer && hasSubmittedAnswer) {
      const candMessage: ChatMessage = {
        id: `cand-${question.id}`,
        sender: 'candidate',
        text: initialAnswer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([aiMessage, candMessage]);
    } else {
      setMessages([aiMessage]);
      setInputText(initialAnswer || '');
    }
  }, [question.id, initialAnswer, hasSubmittedAnswer]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSubmitting]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isSubmitting) return;

    const candMsg: ChatMessage = {
      id: `cand-${Date.now()}`,
      sender: 'candidate',
      text: inputText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, candMsg]);
    onSubmitAnswer(inputText.trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  const wordCount = inputText.trim() ? inputText.trim().split(/\s+/).length : 0;
  const estimatedSpeakingTime = (wordCount / 130).toFixed(1);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col h-[650px] overflow-hidden">
      
      {/* Top Bar of Chat Window */}
      <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-2xs">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-slate-900">
                AI Interviewer
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                Question {questionNumber} of {totalQuestions}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              {question.type} • {question.level} Level
            </p>
          </div>
        </div>

        {exampleAnswer && (
          <button
            type="button"
            onClick={() => setIsExampleModalOpen(true)}
            className="text-[11px] font-bold text-blue-700 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg border border-blue-200 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Calibrated Example</span>
          </button>
        )}
      </div>

      {/* Message Stream */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {messages.map((msg) => {
          const isAi = msg.sender === 'ai';

          return (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-[85%] ${isAi ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}
            >
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 mt-1 shadow-2xs ${
                isAi ? 'bg-blue-600 text-white' : 'bg-slate-900 text-white'
              }`}>
                {isAi ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>

              {/* Bubble */}
              <div className={`rounded-2xl p-4 space-y-1.5 text-xs sm:text-sm leading-relaxed ${
                isAi 
                  ? 'bg-slate-100/90 text-slate-900 rounded-tl-xs border border-slate-200/80' 
                  : 'bg-blue-600 text-white rounded-tr-xs shadow-xs'
              }`}>
                <div className="flex items-center justify-between gap-4 text-[10px] font-bold opacity-75 pb-1 border-b border-white/15">
                  <span>{isAi ? 'AI Interviewer' : 'Candidate (You)'}</span>
                  <span>{msg.timestamp}</span>
                </div>
                <p className="whitespace-pre-wrap font-normal">
                  {msg.text}
                </p>
              </div>
            </div>
          );
        })}

        {isSubmitting && (
          <div className="flex gap-3 max-w-[85%] mr-auto animate-pulse">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-slate-100 rounded-2xl rounded-tl-xs p-3.5 border border-slate-200 text-xs text-slate-600 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600 animate-spin" />
              <span>Analyzing answer structure and STAR rubric metrics...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Candidate Response Input Area */}
      <div className="p-4 border-t border-slate-200/90 bg-slate-50/40 space-y-2 shrink-0">
        <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
          <span>Type your response below (Cmd+Enter to submit)</span>
          <div className="flex items-center gap-3">
            <span>{wordCount} words</span>
            <span>~{estimatedSpeakingTime} min speaking duration</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-2">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your response to the interviewer... (State your situation, task, actions, trade-offs, and measurable impact)"
            rows={4}
            disabled={isSubmitting}
            className="w-full p-3.5 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 resize-none shadow-2xs font-normal leading-relaxed text-slate-800 disabled:bg-slate-100"
          />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <FileText className="w-3.5 h-3.5" />
              <span>Structured practice mode • Text-first response</span>
            </div>

            <button
              type="submit"
              disabled={!inputText.trim() || isSubmitting}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
            >
              <span>{hasSubmittedAnswer ? 'Re-evaluate Answer' : 'Submit Response'}</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>

      {/* Calibrated Example Answer Modal */}
      {isExampleModalOpen && exampleAnswer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-2xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">
                  Calibrated Benchmark Answer
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setIsExampleModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 leading-relaxed max-h-[300px] overflow-y-auto">
              {exampleAnswer}
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setIsExampleModalOpen(false)}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
