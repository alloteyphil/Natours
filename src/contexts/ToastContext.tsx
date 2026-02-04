import { createContext } from "react";

type ToastType = "success" | "error" | "info";

export type ToastContextType = {
  showToast: (message: string, type?: ToastType) => void;
};

export const ToastContext = createContext<ToastContextType | undefined>(undefined);
