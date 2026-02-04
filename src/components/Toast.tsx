import { useEffect } from "react";

type ToastProps = {
  message: string;
  type: "success" | "error" | "info";
  onClose: () => void;
  duration?: number;
};

const Toast = ({ message, type, onClose, duration = 3000 }: ToastProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const bgColor =
    type === "success"
      ? "bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-500/20 dark:border-emerald-500/30 dark:text-emerald-200"
      : type === "error"
        ? "bg-red-50 border-red-200 text-red-800 dark:bg-red-500/20 dark:border-red-500/30 dark:text-red-200"
        : "bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-500/20 dark:border-blue-500/30 dark:text-blue-200";

  const iconColor =
    type === "success"
      ? "text-emerald-600 dark:text-emerald-400"
      : type === "error"
        ? "text-red-600 dark:text-red-400"
        : "text-blue-600 dark:text-blue-400";

  return (
    <div
      className={`pointer-events-auto flex items-center gap-3 rounded-lg border px-4 py-3 shadow-lg ${bgColor} animate-in slide-in-from-top-5 fade-in`}
      role="alert"
    >
      {type === "success" && (
        <svg
          className={`h-5 w-5 shrink-0 ${iconColor}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      )}
      {type === "error" && (
        <svg
          className={`h-5 w-5 shrink-0 ${iconColor}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      )}
      {type === "info" && (
        <svg
          className={`h-5 w-5 shrink-0 ${iconColor}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      )}
      <p className="flex-1 text-sm font-medium">{message}</p>
      <button
        onClick={onClose}
        className={`shrink-0 rounded p-1 transition hover:bg-black/10 ${iconColor}`}
        aria-label="Close"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
};

export default Toast;
