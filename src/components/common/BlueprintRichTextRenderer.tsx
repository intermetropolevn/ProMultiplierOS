import React from 'react';
import Markdown from 'react-markdown';

interface BlueprintRichTextRendererProps {
  content?: string;
  className?: string;
}

export const BlueprintRichTextRenderer: React.FC<BlueprintRichTextRendererProps> = ({
  content,
  className = ''
}) => {
  if (!content || !content.trim()) {
    return <span className="text-slate-400 italic text-2xs">No content provided</span>;
  }

  return (
    <div className={`font-vietnamese text-xs text-slate-800 leading-relaxed space-y-2.5 ${className}`}>
      <Markdown
        components={{
          h1: ({ children }) => (
            <h3 className="text-sm font-bold text-slate-950 mt-3 mb-1.5 tracking-tight border-b border-slate-100 pb-1">
              {children}
            </h3>
          ),
          h2: ({ children }) => (
            <h4 className="text-xs font-bold text-purple-950 mt-2.5 mb-1 tracking-tight">
              {children}
            </h4>
          ),
          h3: ({ children }) => (
            <h5 className="text-xs font-semibold text-slate-900 mt-2 mb-0.5">
              {children}
            </h5>
          ),
          p: ({ children }) => (
            <p className="text-xs text-slate-800 leading-relaxed mb-2.5 last:mb-0">
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul className="list-disc list-outside pl-4 space-y-1 text-xs text-slate-800 my-2">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-outside pl-4 space-y-1 text-xs text-slate-800 my-2">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="leading-relaxed pl-0.5 text-slate-800">
              {children}
            </li>
          ),
          strong: ({ children }) => (
            <strong className="font-bold text-slate-950">
              {children}
            </strong>
          ),
          em: ({ children }) => (
            <em className="italic text-slate-800">
              {children}
            </em>
          ),
          blockquote: ({ children }) => (
            <blockquote className="pl-3 py-1 my-2 border-l-3 border-purple-400 bg-purple-50/60 rounded-r text-slate-800 italic">
              {children}
            </blockquote>
          ),
          code: ({ children }) => (
            <code className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-purple-700 font-mono text-[11px]">
              {children}
            </code>
          ),
          hr: () => <hr className="my-3 border-slate-200" />
        }}
      >
        {content}
      </Markdown>
    </div>
  );
};
