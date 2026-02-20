"use client";

import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n";
import { Languages } from "lucide-react";

export function LanguageSwitcher() {
  const { lang, setLang } = useTranslation();

  return (
    <div className="fixed top-6 right-6 z-[100] flex items-center gap-2 p-1.5 bg-zinc-900/80 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl transition-all hover:bg-zinc-900">
      <div className="flex items-center gap-2 px-2 text-zinc-400">
        <Languages size={14} />
      </div>
      <div className="flex gap-1">
        <button
          onClick={() => setLang("es")}
          className={cn(
            "px-3 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all",
            lang === "es" 
              ? "bg-primary text-white shadow-lg shadow-primary/20" 
              : "text-zinc-500 hover:text-white"
          )}
        >
          ES
        </button>
        <button
          onClick={() => setLang("en")}
          className={cn(
            "px-3 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all",
            lang === "en" 
              ? "bg-primary text-white shadow-lg shadow-primary/20" 
              : "text-zinc-500 hover:text-white"
          )}
        >
          EN
        </button>
      </div>
    </div>
  );
}
