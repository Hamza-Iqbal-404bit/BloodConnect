import { createContext, useContext, useState, type ReactNode } from "react";

interface UiDialogContextValue {
  showDonorModal: boolean;
  showRequestModal: boolean;
  openDonorModal: () => void;
  openRequestModal: () => void;
  closeDonorModal: () => void;
  closeRequestModal: () => void;
}

const UiDialogContext = createContext<UiDialogContextValue | undefined>(undefined);

export function UiDialogProvider({ children }: { children: ReactNode }) {
  const [showDonorModal, setShowDonorModal] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);

  const openDonorModal = () => {
    setShowDonorModal(true);
    setShowRequestModal(false);
  };

  const openRequestModal = () => {
    setShowRequestModal(true);
    setShowDonorModal(false);
  };

  const closeDonorModal = () => setShowDonorModal(false);
  const closeRequestModal = () => setShowRequestModal(false);

  const value: UiDialogContextValue = {
    showDonorModal,
    showRequestModal,
    openDonorModal,
    openRequestModal,
    closeDonorModal,
    closeRequestModal,
  };

  return <UiDialogContext.Provider value={value}>{children}</UiDialogContext.Provider>;
}

export function useUiDialogs() {
  const ctx = useContext(UiDialogContext);
  if (!ctx) {
    throw new Error("useUiDialogs must be used within a UiDialogProvider");
  }
  return ctx;
}
