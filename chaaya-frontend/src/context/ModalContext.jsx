import React, { createContext, useContext, useState, useCallback } from 'react';

const ModalContext = createContext(null);

export const ModalProvider = ({ children }) => {
  const [modal, setModal] = useState(null);

  const openModal = useCallback((component, props = {}) => {
    setModal({ component, props });
  }, []);

  const closeModal = useCallback(() => setModal(null), []);

  const value = { modal, openModal, closeModal };

  return (
    <ModalContext.Provider value={value}>
      {children}
      {modal?.component ? (
        <modal.component {...modal.props} onClose={closeModal} />
      ) : null}
    </ModalContext.Provider>
  );
};

export const useModalContext = () => useContext(ModalContext);
