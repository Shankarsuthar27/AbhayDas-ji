import React, { useState, useRef } from 'react';
import { 
  X, 
  Upload, 
  Globe, 
  Sparkles, 
  Loader2, 
  Check, 
  Image as ImageIcon 
} from 'lucide-react';
import { compressImage } from '../utils/helpers';
import { NEWS_MEDIA_PRESETS } from '../utils/mediaPresets';
import toast from 'react-hot-toast';

export const StoryImageModal = ({ isOpen, onClose, onInsert }) => {
  const [activeTab, setActiveTab] = useState('upload'); // 'upload' | 'url' | 'presets'
  const [urlInput, setUrlInput] = useState('');
  const [captionInput, setCaptionInput] = useState('');
  const [selectedPreset, setSelectedPreset] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleFileChange = async (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file (PNG, JPG, WebP).');
      return;
    }

    setProcessing(true);
    try {
      const compressed = await compressImage(file, { maxWidth: 1200, maxHeight: 800, quality: 0.82 });
      onInsert(compressed.dataUrl, captionInput || file.name);
      toast.success('Image inserted into story canvas!');
      onClose();
    } catch (err) {
      console.error('Error processing story image:', err);
      toast.error('Failed to process image: ' + err.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleApplyUrl = () => {
    const trimmed = urlInput.trim();
    if (!trimmed) {
      toast.error('Please enter a valid image URL');
      return;
    }
    onInsert(trimmed, captionInput);
    toast.success('Image inserted from URL!');
    onClose();
  };

  const handleApplyPreset = () => {
    if (!selectedPreset) {
      toast.error('Please select an image first');
      return;
    }
    onInsert(selectedPreset.url, captionInput || selectedPreset.title);
    toast.success('Library photo inserted into story!');
    onClose();
  };

  return (
    <div className="story-img-modal-backdrop" onClick={onClose}>
      <div 
        className="story-img-modal-dialog" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="story-img-modal-header">
          <div className="story-img-modal-title">
            <ImageIcon size={18} className="text-[#0891B2]" />
            <span>Insert Image into Story Body</span>
          </div>
          <button 
            type="button" 
            onClick={onClose}
            className="story-img-modal-close"
          >
            <X size={16} />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="story-img-modal-tabs">
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`story-tab-btn ${activeTab === 'upload' ? 'active' : ''}`}
          >
            <Upload size={13} /> Upload File
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('url')}
            className={`story-tab-btn ${activeTab === 'url' ? 'active' : ''}`}
          >
            <Globe size={13} /> Image Link
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('presets')}
            className={`story-tab-btn ${activeTab === 'presets' ? 'active' : ''}`}
          >
            <Sparkles size={13} /> Ashram Library
          </button>
        </div>

        {/* Tab Content */}
        <div className="story-img-modal-body">
          {activeTab === 'upload' && (
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleFileChange(f);
                }}
              />
              <div
                className={`story-dropzone ${isDragging ? 'dragging' : ''} ${processing ? 'processing' : ''}`}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  const f = e.dataTransfer?.files?.[0];
                  if (f) handleFileChange(f);
                }}
                onClick={() => !processing && fileInputRef.current?.click()}
              >
                {processing ? (
                  <div className="text-center py-6">
                    <Loader2 size={28} className="animate-spin text-[#0891B2] mx-auto mb-2" />
                    <span className="text-xs font-semibold text-slate-700">Compressing & optimizing image...</span>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <div className="story-dropzone-icon">
                      <Upload size={20} className="text-[#0891B2]" />
                    </div>
                    <div className="text-xs font-bold text-slate-800 mt-2">Click to Browse or Drag Image Here</div>
                    <div className="text-[11px] text-slate-400 mt-1">PNG, JPG, WebP supported</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'url' && (
            <div className="space-y-3">
              <div>
                <label className="story-input-label">Image Web URL</label>
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://example.com/photo.jpg"
                  className="story-modal-input"
                />
              </div>
              <button
                type="button"
                onClick={handleApplyUrl}
                className="story-modal-btn-primary"
              >
                Insert Image URL
              </button>
            </div>
          )}

          {activeTab === 'presets' && (
            <div>
              <div className="story-presets-grid">
                {NEWS_MEDIA_PRESETS.map((preset) => {
                  const isSel = selectedPreset?.id === preset.id;
                  return (
                    <div
                      key={preset.id}
                      onClick={() => setSelectedPreset(preset)}
                      className={`story-preset-item ${isSel ? 'selected' : ''}`}
                    >
                      <img src={preset.url} alt={preset.title} />
                      {isSel && (
                        <div className="story-preset-check">
                          <Check size={12} strokeWidth={3} />
                        </div>
                      )}
                      <span className="story-preset-title">{preset.title}</span>
                    </div>
                  );
                })}
              </div>
              <button
                type="button"
                onClick={handleApplyPreset}
                disabled={!selectedPreset}
                className="story-modal-btn-primary mt-3"
              >
                Insert Selected Library Image
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
