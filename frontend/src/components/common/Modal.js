import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

const Modal = ({ open, title, onClose, children }) => {
  const overlayRef = useRef();
  const firstRef = useRef();

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    // focus first element in modal
    setTimeout(() => { if (firstRef.current) firstRef.current.focus(); }, 0);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  const onOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose();
  };

  return (
    <div ref={overlayRef} onMouseDown={onOverlayClick} className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50" role="dialog" aria-modal="true" aria-label={title}>
      <div className="bg-white rounded shadow-lg w-3/4 max-w-xl" onMouseDown={(e) => e.stopPropagation()}>
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="text-lg font-bold">{title}</h3>
          <button onClick={onClose} className="text-gray-600">Close</button>
        </div>
        <div className="p-4">{React.cloneElement(children, { autoFocusRef: firstRef })}</div>
      </div>
    </div>
  );
};

Modal.propTypes = {
  open: PropTypes.bool,
  title: PropTypes.string,
  onClose: PropTypes.func,
  children: PropTypes.node,
};

export default Modal;
