import React, { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Underline } from '@tiptap/extension-underline';
import { Link } from '@tiptap/extension-link';
import { Image } from '@tiptap/extension-image';
import { Table, TableRow, TableHeader, TableCell } from '@tiptap/extension-table';
import { CharacterCount } from '@tiptap/extension-character-count';
import { EditorToolbar } from './EditorToolbar';
import { StoryImageModal } from './StoryImageModal';
import { Clock, FileText, CheckCircle2 } from 'lucide-react';
import './Editor.css';

export const TipTapEditor = ({ value, onChange, onWordCountChange, status = 'draft' }) => {
  const [imageModalOpen, setImageModalOpen] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4],
        },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-[#0891B2] underline cursor-pointer font-medium hover:text-[#0EA5E9]',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-2xl max-w-full my-6 shadow-sm border border-[#E2E8F0]',
        },
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      CharacterCount,
    ],
    content: value || '<p></p>',
    editorProps: {
      attributes: {
        class: 'tiptap-prose prose max-w-none focus:outline-none min-h-[500px] px-8 md:px-10 py-8 text-[17px] leading-[1.85] text-[#0F172A] break-words font-sans selection:bg-[#ECFEFF] selection:text-[#0891B2]',
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
      
      if (onWordCountChange) {
        const words = editor.storage.characterCount.words();
        onWordCountChange(words);
      }
    },
  });

  // Sync external content changes (e.g. when fetching existing article data)
  useEffect(() => {
    if (editor && value && editor.getHTML() !== value) {
      editor.commands.setContent(value);
      if (onWordCountChange) {
        const words = editor.storage.characterCount.words();
        onWordCountChange(words);
      }
    }
  }, [value, editor, onWordCountChange]);

  const handleInsertImage = (src, alt = '') => {
    if (editor && src) {
      editor.chain().focus().setImage({ src, alt }).run();
    }
  };

  const wordCount = editor ? editor.storage.characterCount.words() : 0;
  const charCount = editor ? editor.storage.characterCount.characters() : 0;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <div className="tiptap-editor-card">
      {/* Grouped Notion/Ghost-style Toolbar (Sticky at top-0 of editor container) */}
      <EditorToolbar 
        editor={editor} 
        onImageClick={() => setImageModalOpen(true)} 
      />

      {/* Writing Canvas Container */}
      <div className="tiptap-canvas-wrap">
        <EditorContent editor={editor} className="tiptap-editor-content" />
      </div>

      {/* Story Image Insertion Modal */}
      <StoryImageModal
        isOpen={imageModalOpen}
        onClose={() => setImageModalOpen(false)}
        onInsert={handleInsertImage}
      />

      {/* Pure White Writing Workspace Status Bar */}
      <div className="tiptap-status-bar">
        <div className="tiptap-status-left">
          <span className="tiptap-status-item">
            <FileText size={14} color="#0891B2" />
            <strong className="tiptap-status-number">{wordCount}</strong> Words
          </span>
          <span className="tiptap-status-sep">|</span>
          <span className="tiptap-status-item">
            <strong className="tiptap-status-number">{charCount}</strong> Characters
          </span>
          <span className="tiptap-status-sep">|</span>
          <span className="tiptap-status-item">
            <Clock size={14} color="#0891B2" />
            <span>{readingTime} min read</span>
          </span>
        </div>

        <div className="tiptap-status-right">
          <span className="tiptap-status-saved">
            <CheckCircle2 size={13} />
            <span>Autosaved</span>
          </span>
          <span className="tiptap-status-badge">
            {status}
          </span>
        </div>
      </div>
    </div>
  );
};
export default TipTapEditor;
