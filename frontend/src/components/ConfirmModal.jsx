import React, { useEffect } from 'react';

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmText = 'Delete',
  cancelText = 'Cancel',
  danger = true,
  loading = false,
  icon = 'trash'
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      if (e.key === 'Escape' && !loading) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, loading, onClose]);

  if (!isOpen) return null;

  return (
    <div className="confirm-modal-overlay" onClick={() => !loading && onClose()}>
      <div
        className="confirm-modal-box"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <button
          className="confirm-modal-close"
          onClick={onClose}
          disabled={loading}
          aria-label="Close dialog"
        >
          <i className="fa-solid fa-xmark"></i>
        </button>

        {/* Wanderlust Management Header */}
        <div className="confirm-modal-brand">
          <i className="fa-solid fa-compass" style={{ color: '#ff385c', marginRight: '5px' }}></i>
          <span>WANDERLUST HOST SUITE</span>
        </div>

        <div className={`confirm-modal-icon-badge ${danger ? 'danger' : 'warning'}`}>
          {icon === 'trash' ? (
            <i className="fa-solid fa-house-crack"></i>
          ) : (
            <i className="fa-solid fa-triangle-exclamation"></i>
          )}
        </div>

        <h3 className="confirm-modal-title">{title}</h3>
        <p className="confirm-modal-message">{message}</p>

        <div className="confirm-modal-actions">
          <button
            type="button"
            className="confirm-modal-btn cancel"
            onClick={onClose}
            disabled={loading}
          >
            {cancelText}
          </button>
          <button
            type="button"
            className={`confirm-modal-btn ${danger ? 'confirm-danger' : 'confirm-primary'}`}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? (
              <>
                <i className="fa-solid fa-spinner fa-spin" style={{ marginRight: '6px' }}></i>
                Processing...
              </>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
