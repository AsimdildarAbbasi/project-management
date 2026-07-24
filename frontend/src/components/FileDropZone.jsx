import React, { useState, useRef } from 'react';
import { UploadCloud, AlertCircle, Loader2, FileText } from 'lucide-react';

const ALLOWED_EXTENSIONS = ['pdf', 'png', 'jpg', 'jpeg', 'docx', 'xlsx', 'zip'];
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

export function FileDropZone({ onUpload, isUploading = false, uploadProgress = 0 }) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [clientError, setClientError] = useState(null);
  const fileInputRef = useRef(null);

  const validateFile = (file) => {
    if (!file) return false;

    // Check size
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setClientError(`File "${file.name}" exceeds the 10MB maximum limit (${(file.size / (1024 * 1024)).toFixed(1)}MB).`);
      return false;
    }

    // Check extension
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!ext || !ALLOWED_EXTENSIONS.includes(ext)) {
      setClientError(`File type ".${ext}" is not permitted. Allowed: PDF, PNG, JPG, JPEG, DOCX, XLSX, ZIP.`);
      return false;
    }

    setClientError(null);
    return true;
  };

  const handleFiles = (files) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    if (validateFile(file)) {
      onUpload(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (isUploading) return;
    handleFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    if (!isDragOver) setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  return (
    <div className="space-y-2 font-body">
      {/* Drop Zone Box with Ticket Perforation Aesthetic */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !isUploading && fileInputRef.current?.click()}
        className={`
          relative p-6 rounded-xs border-2 border-dashed text-center cursor-pointer select-none transition-all duration-150
          ${
            isDragOver
              ? 'bg-brass/10 border-brass text-ink shadow-xs'
              : 'bg-paper-2/60 border-slate/30 text-slate hover:border-slate/50 hover:bg-paper-2'
          }
          ${isUploading ? 'opacity-60 pointer-events-none' : ''}
        `}
      >
        {/* Ticket Corner Cutouts (Visual Decor) */}
        <span className="w-2.5 h-2.5 rounded-full bg-paper border border-slate/30 absolute -top-1.5 -left-1.5" />
        <span className="w-2.5 h-2.5 rounded-full bg-paper border border-slate/30 absolute -top-1.5 -right-1.5" />
        <span className="w-2.5 h-2.5 rounded-full bg-paper border border-slate/30 absolute -bottom-1.5 -left-1.5" />
        <span className="w-2.5 h-2.5 rounded-full bg-paper border border-slate/30 absolute -bottom-1.5 -right-1.5" />

        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
          disabled={isUploading}
        />

        <div className="space-y-2">
          {isUploading ? (
            <div className="space-y-2 py-2">
              <Loader2 className="w-6 h-6 animate-spin text-brass mx-auto" />
              <p className="font-mono text-xs font-semibold text-ink">
                UPLOADING ATTACHMENT... ({uploadProgress}%)
              </p>
              <div className="w-full bg-slate/20 h-1.5 rounded-full overflow-hidden max-w-xs mx-auto">
                <div
                  className="bg-brass h-full transition-all duration-150"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          ) : (
            <>
              <UploadCloud className="w-7 h-7 text-slate mx-auto" />
              <div>
                <p className="font-body text-xs font-semibold text-ink">
                  Click to attach file or drag & drop here
                </p>
                <p className="font-mono text-[11px] text-slate/70 mt-0.5 uppercase">
                  PDF, PNG, JPG, DOCX, XLSX, ZIP (MAX 10MB)
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Inline Client Validation Error */}
      {clientError && (
        <div className="bg-rust/10 border border-rust text-rust p-2.5 rounded-xs text-xs flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <p className="font-body font-medium">{clientError}</p>
        </div>
      )}
    </div>
  );
}
