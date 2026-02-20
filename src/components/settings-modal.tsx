"use client";

import { useState } from "react";
import { X, Settings, User, Check, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUsername: string;
  onUpdate: (newUsername: string) => Promise<void>;
  email?: string;
}

export function SettingsModal({ isOpen, onClose, currentUsername, onUpdate, email }: SettingsModalProps) {
  const { t } = useTranslation();
  const [username, setUsername] = useState(currentUsername);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || username === currentUsername) return;

    setLoading(true);
    try {
      await onUpdate(username);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1500);
    } catch (error) {
      console.error("Update failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-zinc-950/60 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-zinc-900 border border-white/10 rounded-[32px] shadow-2xl overflow-hidden p-8"
          >
            <button
              onClick={onClose}
              className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>

            <div className="mb-8 flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center text-primary">
                <Settings size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white italic uppercase tracking-tight">{t.settings.title}</h2>
                <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">{email}</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">
                  {t.settings.bgg_label}
                </label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-primary transition-colors" size={18} />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="BGG Username"
                    disabled={loading || success}
                    className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all font-medium disabled:opacity-50"
                  />
                </div>
                <p className="text-[10px] text-zinc-500 font-medium ml-1">
                  {t.settings.bgg_desc}
                </p>
              </div>

              <button
                type="submit"
                disabled={loading || success || !username || username === currentUsername}
                className={cn(
                  "w-full py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] transition-all flex items-center justify-center gap-2 shadow-xl shadow-primary/20",
                  success 
                    ? "bg-green-500 text-white shadow-green-500/20" 
                    : "bg-primary text-white hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 disabled:shadow-none"
                )}
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : success ? (
                  <>
                    <Check size={18} />
                      {t.settings.updated}
                  </>
                ) : (
                      t.settings.update_button
                )}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
