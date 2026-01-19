import React, { useEffect } from 'react';

const Toast = ({ message, isVisible, duration = 3000, onClose }) => {
  useEffect(() => {
    if (isVisible && onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 80,
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        color: '#fff',
        padding: '12px 24px',
        borderRadius: 8,
        fontSize: 14,
        fontWeight: 500,
        zIndex: 10000,
        whiteSpace: 'nowrap',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        animation: 'fadeIn 0.3s ease-in-out',
      }}
    >
      {message}
    </div>
  );
};

export default Toast;
