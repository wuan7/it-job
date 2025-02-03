"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

interface DialogContextProps {
  dialogs: Record<string, boolean>; // Trạng thái của từng modal
  openDialog: (name: string) => void; // Mở modal với tên cụ thể
  closeDialog: (name: string) => void; // Đóng modal với tên cụ thể
}

const DialogContext = createContext<DialogContextProps | undefined>(undefined);

export const DialogProvider = ({ children }: { children: ReactNode }) => {
  const [dialogs, setDialogs] = useState<Record<string, boolean>>({});

  const openDialog = (name: string) => {
    setDialogs((prev) => ({ ...prev, [name]: true }));
  };

  const closeDialog = (name: string) => {
    setDialogs((prev) => ({ ...prev, [name]: false }));
  };

  return (
    <DialogContext.Provider value={{ dialogs, openDialog, closeDialog }}>
      {children}
    </DialogContext.Provider>
  );
};

export const useDialog = (name: string) => {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error("useDialog must be used within a DialogProvider");
  }

  const { dialogs, openDialog, closeDialog } = context;
  const isOpen = dialogs[name] || false;

  return { isOpen, openDialog: () => openDialog(name), closeDialog: () => closeDialog(name) };
};
