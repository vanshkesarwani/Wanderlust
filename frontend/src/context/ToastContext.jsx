import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((options) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    const newToast = {
      id,
      type: options.type || 'info', // 'success' | 'error' | 'info' | 'warning' | 'delete' | 'listed' | 'updated'
      title: options.title || '',
      message: options.message || '',
      duration: options.duration || 4200,
      icon: options.icon || null,
      action: options.action || null,
    };

    setToasts((prev) => [...prev.slice(-4), newToast]); // Keep up to 5 toasts

    if (newToast.duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, newToast.duration);
    }

    return id;
  }, [removeToast]);

  const toast = {
    show: addToast,
    success: (message, title = 'Success!') =>
      addToast({ type: 'success', title, message, icon: 'fa-solid fa-circle-check' }),
    error: (message, title = 'Something went wrong') =>
      addToast({ type: 'error', title, message, icon: 'fa-solid fa-circle-exclamation' }),
    info: (message, title = 'Notice') =>
      addToast({ type: 'info', title, message, icon: 'fa-solid fa-circle-info' }),
    warning: (message, title = 'Attention') =>
      addToast({ type: 'warning', title, message, icon: 'fa-solid fa-triangle-exclamation' }),
    login: (username) =>
      addToast({
        type: 'success',
        title: 'Logged in',
        message: username ? `Logged in as ${username}` : 'Logged in successfully',
        icon: 'fa-solid fa-circle-check',
        duration: 3200,
      }),
    logout: () =>
      addToast({
        type: 'info',
        title: 'Logged out',
        message: 'Logged out successfully',
        icon: 'fa-solid fa-arrow-right-from-bracket',
        duration: 3000,
      }),
    listed: (title = 'Property') =>
      addToast({
        type: 'listed',
        title: 'Retreat Published',
        message: `"${title}" is now live and discoverable.`,
        icon: 'fa-solid fa-compass',
        duration: 4500,
      }),
    updated: (title = 'Listing') =>
      addToast({
        type: 'updated',
        title: 'Retreat Updated',
        message: `Changes to "${title}" were saved.`,
        icon: 'fa-solid fa-pen-to-square',
        duration: 4000,
      }),
    deleted: (title = 'Item') =>
      addToast({
        type: 'delete',
        title: 'Stay Removed',
        message: `"${title}" was permanently removed.`,
        icon: 'fa-solid fa-trash-can',
        duration: 4000,
      }),
    wishlist: (title = 'Property', added = true) =>
      addToast({
        type: added ? 'wishlist' : 'info',
        title: added ? 'Saved to Wishlist' : 'Removed from Wishlist',
        message: title,
        icon: added ? 'fa-solid fa-heart' : 'fa-regular fa-heart',
        duration: 3200,
      }),
    dismiss: removeToast,
  };

  return (
    <ToastContext.Provider value={{ toast, addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context.toast;
}

function ToastContainer({ toasts, onDismiss }) {
  if (!toasts.length) return null;

  return (
    <div className="wanderlust-toast-container" aria-live="polite">
      {toasts.map((item) => (
        <div
          key={item.id}
          className={`wanderlust-toast wanderlust-toast-${item.type}`}
          role="status"
        >
          <div className="toast-icon-wrap">
            {item.type === 'success' && <i className="fa-solid fa-circle-check"></i>}
            {item.type === 'error' && <i className="fa-solid fa-circle-exclamation"></i>}
            {item.type === 'warning' && <i className="fa-solid fa-triangle-exclamation"></i>}
            {item.type === 'info' && <i className="fa-solid fa-circle-info"></i>}
            {item.type === 'listed' && <span className="toast-emoji-icon">🏖️</span>}
            {item.type === 'updated' && <span className="toast-emoji-icon">✨</span>}
            {item.type === 'delete' && <span className="toast-emoji-icon">🧭</span>}
            {item.type === 'wishlist' && <span className="toast-emoji-icon">❤️</span>}
          </div>

          <div className="toast-body">
            {item.title && <div className="toast-title">{item.title}</div>}
            <div className="toast-message">{item.message}</div>
          </div>

          <button
            className="toast-close-btn"
            onClick={() => onDismiss(item.id)}
            aria-label="Close notification"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>

          {item.duration > 0 && (
            <div
              className="toast-progress-bar"
              style={{ animationDuration: `${item.duration}ms` }}
            />
          )}
        </div>
      ))}
    </div>
  );
}
