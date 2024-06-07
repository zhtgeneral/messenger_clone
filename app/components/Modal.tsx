'use client'

import React, { ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
}

const Modal: React.FC<ModalProps> = ({ isOpen }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
      </div>
    </div>
  );
};

export default Modal;
