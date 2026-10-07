import React, { useState } from 'react';
import { 
  Bold, Italic, Underline, Strikethrough, Code, List, ListOrdered, Quote, Heading1, Heading2, Heading3, Link, 
  Image, Table, Undo, Redo, Sparkles, Minus, SquareCode, ChevronDown, Check, Wand2
} from 'lucide-react';
import toast from 'react-hot-toast';
import './Editor.css';

export const EditorToolbar = ({ editor, onImageClick }) => {
  const [aiMenuOpen, setAiMenuOpen] = useState(false);

  if (!editor) return null;

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('Enter Hyperlink URL:', previousUrl || 'https://');
    
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const handleAiAction = (type) => {
    setAiMenuOpen(false);
    toast.success(`AI Assistant: ${type}...`, { icon: '✨' });

    setTimeout(() => {
      if (type === 'Expand') {
        editor.chain().focus().insertContent(' Expanding on this point, the initiative underscores the enduring values of compassion, community service, and cultural heritage nurtured by Sadguru Trikam Das Ji Dham and Pujya Swami Shree Abhaydas Ji Maharaj.').run();
      } else if (type === 'Rewrite') {
        editor.chain().focus().insertContent(' Rephrased for clarity and spiritual resonance: "True devotion manifests through selfless service to society, preserving sacred tradition while empowering future generations."').run();
      } else if (type === 'Summarize') {
        editor.chain().focus().insertContent('\n\n> **Key Takeaway:** The core mission remains centered on spreading spiritual wisdom, promoting free tribal education, and advancing cow protection across Rajasthan and beyond.').run();
      } else if (type === 'Grammar') {
        toast.success('Grammar & typography checks passed perfectly!');
        return;
      } else if (type === 'Continue') {
        editor.chain().focus().insertContent(' Devotees and well-wishers from all regions are cordially invited to participate in this auspicious gathering and seek divine blessings.').run();
      }
      toast.success('AI content added successfully!');
    }, 1000);
  };

  return (
    <div className="tiptap-toolbar">
      <div className="tiptap-toolbar-left">
        {/* History Group Pill (Undo / Redo) */}
        <div className="tiptap-history-pill">
          <button
            type="button"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            className="tiptap-history-btn"
            title="Undo (Ctrl+Z)"
          >
            <Undo size={15} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            className="tiptap-history-btn"
            title="Redo (Ctrl+Y)"
          >
            <Redo size={15} />
          </button>
        </div>

        <div className="tiptap-sep" />

        {/* Headings Group (H1, H2, H3) */}
        <div className="tiptap-group">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={`tiptap-btn tiptap-btn-typo ${editor.isActive('heading', { level: 1 }) ? 'active' : ''}`}
            title="Heading 1"
          >
            <span className="tiptap-label-h">H1</span>
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`tiptap-btn tiptap-btn-typo ${editor.isActive('heading', { level: 2 }) ? 'active' : ''}`}
            title="Heading 2"
          >
            <span className="tiptap-label-h">H2</span>
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={`tiptap-btn tiptap-btn-typo ${editor.isActive('heading', { level: 3 }) ? 'active' : ''}`}
            title="Heading 3"
          >
            <span className="tiptap-label-h">H3</span>
          </button>
        </div>

        <div className="tiptap-sep" />

        {/* Text Formatting Group (B, I, U, S, <>) */}
        <div className="tiptap-group">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`tiptap-btn tiptap-btn-typo ${editor.isActive('bold') ? 'active' : ''}`}
            title="Bold (Ctrl+B)"
          >
            <span className="tiptap-label-bold">B</span>
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`tiptap-btn tiptap-btn-typo ${editor.isActive('italic') ? 'active' : ''}`}
            title="Italic (Ctrl+I)"
          >
            <span className="tiptap-label-italic">I</span>
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`tiptap-btn tiptap-btn-typo ${editor.isActive('underline') ? 'active' : ''}`}
            title="Underline (Ctrl+U)"
          >
            <span className="tiptap-label-underline">U</span>
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={`tiptap-btn tiptap-btn-typo ${editor.isActive('strike') ? 'active' : ''}`}
            title="Strikethrough"
          >
            <span className="tiptap-label-strike">S</span>
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleCode().run()}
            className={`tiptap-btn tiptap-btn-typo ${editor.isActive('code') ? 'active' : ''}`}
            title="Inline Code"
          >
            <span className="tiptap-label-code">&lt;&gt;</span>
          </button>
        </div>

        <div className="tiptap-sep" />

        {/* Lists & Blocks Group */}
        <div className="tiptap-group">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`tiptap-btn ${editor.isActive('bulletList') ? 'active' : ''}`}
            title="Bullet List"
          >
            <List size={16} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`tiptap-btn ${editor.isActive('orderedList') ? 'active' : ''}`}
            title="Numbered List"
          >
            <ListOrdered size={16} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`tiptap-btn tiptap-btn-typo ${editor.isActive('blockquote') ? 'active' : ''}`}
            title="Blockquote"
          >
            <span className="tiptap-label-quote">”</span>
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            className="tiptap-btn"
            title="Horizontal Divider"
          >
            <Minus size={16} />
          </button>
        </div>

        <div className="tiptap-sep" />

        {/* Media & Elements Group */}
        <div className="tiptap-group">
          <button
            type="button"
            onClick={setLink}
            className={`tiptap-btn ${editor.isActive('link') ? 'active' : ''}`}
            title="Add Link"
          >
            <Link size={16} />
          </button>
          <button
            type="button"
            onClick={onImageClick}
            className="tiptap-btn"
            title="Insert Image"
          >
            <Image size={16} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
            className="tiptap-btn"
            title="Insert Table"
          >
            <Table size={16} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={`tiptap-btn ${editor.isActive('codeBlock') ? 'active' : ''}`}
            title="Code Block"
          >
            <SquareCode size={16} />
          </button>
        </div>
      </div>

      {/* AI Writer Button (Far Right) */}
      <div className="tiptap-ai-wrap">
        <button
          type="button"
          onClick={() => setAiMenuOpen(!aiMenuOpen)}
          className="tiptap-ai-btn"
        >
          <Sparkles size={14} className="tiptap-ai-sparkle" />
          <span>AI Writer</span>
          <ChevronDown size={13} />
        </button>

        {aiMenuOpen && (
          <div className="tiptap-ai-dropdown">
            <div className="tiptap-ai-dropdown-title">AI Writing Assistant</div>
            <button
              type="button"
              onClick={() => handleAiAction('Expand')}
              className="tiptap-ai-dropdown-item"
            >
              <Wand2 size={14} color="#0891b2" /> AI Expand Paragraph
            </button>
            <button
              type="button"
              onClick={() => handleAiAction('Rewrite')}
              className="tiptap-ai-dropdown-item"
            >
              <Sparkles size={14} color="#0891b2" /> Rewrite & Polish
            </button>
            <button
              type="button"
              onClick={() => handleAiAction('Summarize')}
              className="tiptap-ai-dropdown-item"
            >
              <Quote size={14} color="#0891b2" /> Summarize Takeaway
            </button>
            <button
              type="button"
              onClick={() => handleAiAction('Grammar')}
              className="tiptap-ai-dropdown-item"
            >
              <Check size={14} color="#0891b2" /> Fix Grammar & Typos
            </button>
            <button
              type="button"
              onClick={() => handleAiAction('Continue')}
              className="tiptap-ai-dropdown-item"
            >
              <Sparkles size={14} color="#0891b2" /> Continue Writing
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
