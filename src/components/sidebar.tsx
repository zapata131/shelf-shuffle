"use client";

import { useState } from "react";
import { SwatchBook, User, Info, Scale, Type, LogOut, LogIn, Settings as SettingsIcon, Languages } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { AuthModal } from "./auth-modal";
import { SettingsModal } from "./settings-modal";
import { useTranslation } from "@/lib/i18n";

interface SidebarProps {
  settings: {
    showTitle: boolean;
    showDesigner: boolean;
    showArtist: boolean;
    showWeight: boolean;
    showDescription: boolean;
  };
  onToggle: (key: string) => void;
  queueCount: number;
  onPrint: () => void;
  session?: any;
  profile?: any;
  onUpdateBGG?: (newUsername: string) => Promise<void>;
}

export function Sidebar({
  settings,
  onToggle,
  queueCount, 
  onPrint,
  session,
  profile,
  onUpdateBGG
}: SidebarProps) {
  const { t, lang, setLang } = useTranslation();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleLogout = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
  };

  const controls = [
    { id: "showTitle", label: t.sidebar.controls.title, icon: Type },
    { id: "showDesigner", label: t.sidebar.controls.designer, icon: User },
    { id: "showArtist", label: t.sidebar.controls.artist, icon: SwatchBook },
    { id: "showWeight", label: t.sidebar.controls.weight, icon: Scale },
    { id: "showDescription", label: t.sidebar.controls.description, icon: Info },
  ];

  return (
    <div className="w-64 bg-white/50 backdrop-blur-xl border-r border-zinc-200 h-screen p-6 flex flex-col gap-8 shadow-sm">
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        currentUsername={profile?.bgg_username || ""}
        email={session?.user?.email}
        onUpdate={onUpdateBGG || (async () => { })}
      />

      <div>
        <h1 className="text-xl font-bold text-primary tracking-tight mb-1">{t.app.title}</h1>
        <p className="text-xs text-zinc-500 font-medium uppercase tracking-[0.1em]">{t.sidebar.engine}</p>
      </div>

      {/* Language Switcher */}
      <div className="flex items-center gap-2 p-1 bg-zinc-100 rounded-xl w-fit">
        <button
          onClick={() => setLang("es")}
          className={cn(
            "px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all",
            lang === "es" ? "bg-white text-primary shadow-sm" : "text-zinc-400 hover:text-zinc-600"
          )}
        >
          ES
        </button>
        <button
          onClick={() => setLang("en")}
          className={cn(
            "px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all",
            lang === "en" ? "bg-white text-primary shadow-sm" : "text-zinc-400 hover:text-zinc-600"
          )}
        >
          EN
        </button>
      </div>

      <div className="space-y-6">
        <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">{t.sidebar.anatomy}</h2>

        <div className="space-y-3">
          {controls.map((control) => (
            <button
              key={control.id}
              onClick={() => onToggle(control.id)}
              className={cn(
                "w-full flex items-center justify-between p-3 rounded-xl border transition-all duration-200 group text-xs font-black uppercase tracking-wider",
                settings[control.id as keyof typeof settings]
                  ? "bg-primary/5 border-primary/20 text-primary shadow-sm"
                  : "bg-white border-zinc-100 text-zinc-400 hover:border-zinc-200"
              )}
            >
              <div className="flex items-center gap-3">
                <control.icon size={16} className={cn("transition-colors", settings[control.id as keyof typeof settings] ? "text-primary" : "text-zinc-300")} />
                <span>{control.label}</span>
              </div>
              <div className={cn(
                "w-7 h-3.5 rounded-full relative transition-colors duration-200",
                settings[control.id as keyof typeof settings] ? "bg-primary" : "bg-zinc-200"
              )}>
                <div className={cn(
                  "absolute top-0.5 w-2.5 h-2.5 bg-white rounded-full transition-all duration-200",
                  settings[control.id as keyof typeof settings] ? "left-4" : "left-0.5"
                )} />
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-auto space-y-4">
        {/* User Profile Section */}
        <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100 shadow-inner">
          {session ? (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs uppercase border border-primary/10">
                  {session.user.email?.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-black text-zinc-900 truncate">{profile?.bgg_username || "..."}</p>
                  <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider truncate">{t.sidebar.member}</p>
                </div>
              </div>

              <div className="h-px bg-zinc-200 w-full" />

              <div className="flex flex-col gap-1">
                <button
                  onClick={() => setIsSettingsOpen(true)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-primary hover:bg-primary/5 rounded-xl transition-all group"
                >
                  <SettingsIcon size={14} className="group-hover:rotate-45 transition-transform" />
                  {t.sidebar.account_settings}
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all group"
                >
                  <LogOut size={14} className="group-hover:-translate-x-1 transition-transform" />
                  {t.sidebar.sign_out}
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setIsAuthModalOpen(true)}
                className="w-full flex items-center justify-center gap-2 py-3 text-[10px] font-bold uppercase tracking-widest text-primary hover:bg-primary/5 rounded-xl border border-primary/10 transition-colors"
            >
              <LogIn size={14} />
                {t.sidebar.sign_in}
            </button>
          )}
        </div>

        <button
          onClick={onPrint}
          disabled={queueCount === 0}
          className="w-full bg-primary text-white py-4 px-4 rounded-xl font-black uppercase tracking-widest text-[9px] shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:translate-y-0 disabled:shadow-none"
        >
          {t.sidebar.prepare_queue} ({queueCount})
        </button>

        <a
          href="https://boardgamegeek.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center pt-2 opacity-20 grayscale hover:opacity-100 transition-all duration-300 hover:scale-110"
        >
          <img src="/bgg-powered.png" alt="Powered by BGG" className="h-6 object-contain" />
        </a>
      </div>
    </div>
  );
}
