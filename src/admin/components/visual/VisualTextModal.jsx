import React, { useState, useEffect } from 'react';
import { Edit3, X, Check } from 'lucide-react';

export default function VisualTextModal({
  isOpen,
  onClose,
  title = 'Edit Content',
  fields = [],
  onSave
}) {
  const [formState, setFormState] = useState({});

  useEffect(() => {
    if (fields && fields.length > 0) {
      const initial = {};
      fields.forEach((f) => {
        initial[f.name] = f.value !== undefined && f.value !== null ? f.value : '';
      });
      setFormState(initial);
    }
  }, [isOpen, fields]);

  if (!isOpen) return null;

  const handleChange = (name, val) => {
    setFormState((prev) => ({ ...prev, [name]: val }));
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    onSave(formState);
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.72)',
      backdropFilter: 'blur(3px)',
      zIndex: 99999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div
        className="visual-edit-popover-content"
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '14px',
          width: '100%',
          maxWidth: '540px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: '1px solid #cbd5e1',
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '14px 20px',
          backgroundColor: '#0f172a',
          color: '#ffffff'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Edit3 size={15} color="#38bdf8" />
            <strong style={{ fontSize: '14px' }}>{title}</strong>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex' }}
          >
            <X size={18} color="#ffffff" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', margin: 0 }}>
          {fields.map((f, idx) => (
            <div key={f.name}>
              <label className="admin-label">{f.label}</label>
              {f.type === 'textarea' ? (
                <textarea
                  rows={f.rows || 4}
                  className="admin-textarea-control"
                  value={formState[f.name] !== undefined ? formState[f.name] : ''}
                  onChange={(e) => handleChange(f.name, e.target.value)}
                  placeholder={f.placeholder}
                  autoFocus={idx === 0}
                />
              ) : (
                <input
                  type={f.type || 'text'}
                  className="admin-input-control"
                  value={formState[f.name] !== undefined ? formState[f.name] : ''}
                  onChange={(e) => handleChange(f.name, e.target.value)}
                  placeholder={f.placeholder}
                  autoFocus={idx === 0}
                />
              )}
              {f.helpText && (
                <div style={{ fontSize: '11.5px', color: '#64748b', marginTop: '4px' }}>
                  {f.helpText}
                </div>
              )}
            </div>
          ))}

          {/* Footer buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
            <button
              type="button"
              className="admin-btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="admin-btn-primary"
              style={{ backgroundColor: '#0284c7', borderColor: '#0284c7', padding: '8px 20px' }}
            >
              <Check size={14} /> Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
