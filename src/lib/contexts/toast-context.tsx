"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, AlertCircle, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastType = "success" | "error" | "loading";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  toast: {
    success: (message: string) => void;
    error: (message: string) => void;
    loading: (message: string) => string;
    dismiss: (id: string) => void;
    promise: <T>(
      promise: Promise<T>,
      { loading, success, error }: { loading: string; success: (data: T) => string; error: string }
    ) => Promise<T>;
  };
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((message: string, type: ToastType) => {
    const id = Math.random().toString(36).slice(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    if (type !== "loading") {
      setTimeout(() => dismiss(id), 4000);
    }
    return id;
  }, [dismiss]);

  const toast = {
    success: (msg: string) => addToast(msg, "success"),
    error: (msg: string) => addToast(msg, "error"),
    loading: (msg: string) => addToast(msg, "loading"),
    dismiss,
    promise: async <T,>(
      promise: Promise<T>,
      { loading, success, error }: { loading: string; success: (data: T) => string; error: string }
    ) => {
      const id = addToast(loading, "loading");
      try {
        const result = await promise;
        dismiss(id);
        addToast(success(result), "success");
        return result;
      } catch (err) {
        dismiss(id);
        addToast(error, "error");
        throw err;
      }
    },
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed top-4 right-4 z-[200] flex flex-col gap-3 pointer-events-none">
        <AnimatePresence mode="popLayout">
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 20, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.9 }}
              layout
              className={cn(
                "pointer-events-auto min-w-[300px] flex items-center justify-between gap-3 p-4 rounded-2xl shadow-2xl border backdrop-blur-md",
                t.type === "success" && "bg-white/90 border-green-100 text-green-900",
                t.type === "error" && "bg-white/90 border-red-100 text-red-900",
                t.type === "loading" && "bg-white/90 border-zinc-100 text-zinc-900"
              )}
            >
              <div className="flex items-center gap-3">
                {t.type === "success" && <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center text-green-600"><Check size={18} /></div>}
                {t.type === "error" && <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-red-600"><AlertCircle size={18} /></div>}
                {t.type === "loading" && <Loader2 className="animate-spin text-primary" size={18} />}
                <p className="text-sm font-bold tracking-tight">{t.message}</p>
              </div>
              <button 
                onClick={() => dismiss(t.id)}
                className="p-1 hover:bg-zinc-100 rounded-lg transition-colors text-zinc-400 hover:text-zinc-600"
              >
                <X size={14} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context.toast;
}
