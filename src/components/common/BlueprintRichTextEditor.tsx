import React, { useState, useRef } from 'react';
import { 
  Bold, 
  Italic, 
  Heading2, 
  Heading3, 
  List, 
  ListOrdered, 
  Quote, 
  Eye, 
  PenLine,
  HelpCircle,
  FileCheck
} from 'lucide-react';
import { BlueprintRichTextRenderer } from './BlueprintRichTextRenderer';
import { convertClipboardToStructuredMarkdown } from '../../features/knowledge/services/richTextPasteService';

interface BlueprintRichTextEditorProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  minRows?: number;
  label?: string;
  required?: boolean;
  helperText?: string;
}

export const BlueprintRichTextEditor: React.FC<BlueprintRichTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'Describe your solution, actions, trade-offs, and quantifiable impact...',
  minRows = 6,
  label = 'Solution & Impact *',
  required = false,
  helperText = 'Markdown and rich formatting supported. Pasting from Google Docs, Word, or web pages preserves headings, bullets, and bold/italic structure.'
}) => {
  const [activeMode, setActiveMode] = useState<'write' | 'preview'>('write');
  const [showCheatsheet, setShowCheatsheet] = useState(false);
  const [pasteNotice, setPasteNotice] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const applyFormatting = (prefix: string, suffix: string = '', defaultPlaceholder: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentVal = value || '';

    let selectedText = currentVal.substring(start, end);
    if (!selectedText && defaultPlaceholder) {
      selectedText = defaultPlaceholder;
    }

    const replacement = `${prefix}${selectedText}${suffix}`;
    const nextVal = currentVal.substring(0, start) + replacement + currentVal.substring(end);
    onChange(nextVal);

    // Restore focus and selection
    setTimeout(() => {
      textarea.focus();
      const cursorStart = start + prefix.length;
      const cursorEnd = cursorStart + selectedText.length;
      textarea.setSelectionRange(cursorStart, cursorEnd);
    }, 10);
  };

  const applyLinePrefix = (linePrefix: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const currentVal = value || '';

    // Find the beginning of the current line
    const lineStart = currentVal.lastIndexOf('\n', start - 1) + 1;
    const nextVal = currentVal.substring(0, lineStart) + linePrefix + currentVal.substring(lineStart);
    onChange(nextVal);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + linePrefix.length, start + linePrefix.length);
    }, 10);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
      e.preventDefault();
      applyFormatting('**', '**', 'bold text');
    } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'i') {
      e.preventDefault();
      applyFormatting('*', '*', 'italic text');
    }
  };

  // Robust rich-text paste handling preserving lists, headings, bold/italic, and Vietnamese unicode
  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const htmlData = e.clipboardData.getData('text/html');
    const plainTextData = e.clipboardData.getData('text/plain');

    if (htmlData || plainTextData) {
      const convertedMarkdown = convertClipboardToStructuredMarkdown(htmlData, plainTextData);
      if (convertedMarkdown) {
        e.preventDefault();
        const textarea = textareaRef.current;
        const currentVal = value || '';

        if (!textarea) {
          onChange(currentVal + convertedMarkdown);
          return;
        }

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const nextVal = currentVal.substring(0, start) + convertedMarkdown + currentVal.substring(end);
        onChange(nextVal);

        setPasteNotice('Pasted with preserved rich formatting & structure');
        setTimeout(() => setPasteNotice(null), 3500);

        setTimeout(() => {
          textarea.focus();
          const nextPos = start + convertedMarkdown.length;
          textarea.setSelectionRange(nextPos, nextPos);
        }, 15);
      }
    }
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-slate-800">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        
        <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-2xs">
          <button
            type="button"
            onClick={() => setActiveMode('write')}
            className={`px-2 py-0.5 rounded-md font-semibold flex items-center gap-1 transition-all cursor-pointer ${
              activeMode === 'write'
                ? 'bg-white text-purple-700 shadow-2xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <PenLine className="w-3 h-3" /> Write
          </button>
          <button
            type="button"
            onClick={() => setActiveMode('preview')}
            className={`px-2 py-0.5 rounded-md font-semibold flex items-center gap-1 transition-all cursor-pointer ${
              activeMode === 'preview'
                ? 'bg-white text-purple-700 shadow-2xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Eye className="w-3 h-3" /> Preview
          </button>
        </div>
      </div>

      <div className="border border-slate-300 rounded-xl overflow-hidden bg-white focus-within:ring-2 focus-within:ring-purple-500 focus-within:border-purple-500 transition-all">
        {/* Formatting Toolbar */}
        <div className="px-2.5 py-1.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-1 text-slate-600">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => applyFormatting('**', '**', 'bold text')}
              title="Bold (Ctrl+B)"
              className="p-1 rounded hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
            >
              <Bold className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => applyFormatting('*', '*', 'italic text')}
              title="Italic (Ctrl+I)"
              className="p-1 rounded hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
            >
              <Italic className="w-3.5 h-3.5" />
            </button>

            <span className="w-px h-3.5 bg-slate-300 mx-0.5" />

            <button
              type="button"
              onClick={() => applyLinePrefix('## ')}
              title="Heading (## )"
              className="p-1 rounded hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
            >
              <Heading2 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => applyLinePrefix('### ')}
              title="Subheading (### )"
              className="p-1 rounded hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
            >
              <Heading3 className="w-3.5 h-3.5" />
            </button>

            <span className="w-px h-3.5 bg-slate-300 mx-0.5" />

            <button
              type="button"
              onClick={() => applyLinePrefix('- ')}
              title="Bulleted List (- )"
              className="p-1 rounded hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
            >
              <List className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => applyLinePrefix('1. ')}
              title="Numbered List (1. )"
              className="p-1 rounded hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
            >
              <ListOrdered className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => applyLinePrefix('> ')}
              title="Quote (> )"
              className="p-1 rounded hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
            >
              <Quote className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => setShowCheatsheet(!showCheatsheet)}
            className="text-2xs text-slate-500 hover:text-purple-700 flex items-center gap-1 cursor-pointer font-medium"
          >
            <HelpCircle className="w-3 h-3" />
            Format Guide
          </button>
        </div>

        {/* Cheatsheet drop down */}
        {showCheatsheet && (
          <div className="p-2.5 bg-purple-50/80 border-b border-purple-100 text-2xs text-purple-900 grid grid-cols-2 sm:grid-cols-4 gap-2 animate-in fade-in">
            <div><code className="font-mono bg-white px-1 py-0.5 rounded border">**bold**</code> &rarr; <strong>bold</strong></div>
            <div><code className="font-mono bg-white px-1 py-0.5 rounded border">*italic*</code> &rarr; <em>italic</em></div>
            <div><code className="font-mono bg-white px-1 py-0.5 rounded border">## Heading</code> &rarr; Heading</div>
            <div><code className="font-mono bg-white px-1 py-0.5 rounded border">- List item</code> &rarr; &bull; List item</div>
          </div>
        )}

        {/* Paste notice feedback */}
        {pasteNotice && (
          <div className="px-3 py-1.5 bg-emerald-50 border-b border-emerald-100 text-emerald-800 text-2xs font-semibold flex items-center gap-1.5 animate-in fade-in">
            <FileCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>{pasteNotice}</span>
          </div>
        )}

        {/* Input Area */}
        {activeMode === 'write' ? (
          <textarea
            ref={textareaRef}
            rows={minRows}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            placeholder={placeholder}
            className="w-full p-3 text-xs text-slate-900 leading-relaxed focus:outline-none resize-y min-h-[140px] font-vietnamese"
          />
        ) : (
          <div className="p-3 bg-slate-50/40 min-h-[140px] max-h-[350px] overflow-y-auto">
            <BlueprintRichTextRenderer content={value} />
          </div>
        )}
      </div>

      {helperText && (
        <p className="text-[11px] text-slate-400">
          {helperText}
        </p>
      )}
    </div>
  );
};
