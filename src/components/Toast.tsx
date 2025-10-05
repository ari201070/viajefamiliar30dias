import React, { useEffect, useState } from 'react';

interface ToastProps {
  message?: string;
  type?: 'success' | 'warning';
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [message]);

  if (!message || !type) {
    return null;
  }

  const baseClasses = "fixed top-5 left-1/2 -translate-x-1/2 z-[100] flex items-center p-4 mb-4 w-full max-w-md rounded-lg shadow-lg text-white";
  
  const typeClasses = {
    success: "bg-green-500 dark:bg-green-600",
    warning: "bg-yellow-500 dark:bg-yellow-600",
  };
  
  const iconClasses = {
    success: "fas fa-check-circle",
    warning: "fas fa-exclamation-triangle",
  };

  return (
    <div
      className={`${baseClasses} ${typeClasses[type]} ${isVisible ? 'toast-enter' : 'toast-exit'}`}
      role="alert"
    >
      <i className={`${iconClasses[type]} text-xl mr-3`}></i>
      <div className="flex-grow text-sm font-medium">{message}</div>
      <button
        type="button"
        className="ml-auto -mx-1.5 -my-1.5 bg-white/20 text-white rounded-lg focus:ring-2 focus:ring-white/50 p-1.5 hover:bg-white/30 inline-flex items-center justify-center h-8 w-8"
        onClick={onClose}
        aria-label="Close"
      >
        <span className="sr-only">Close</span>
        <i className="fas fa-times"></i>
      </button>
    </div>
  );
};

export default Toast;