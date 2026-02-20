"use client";

import { useState, useEffect } from "react";
import { SwatchBook, User, Info, Scale, Type, LogOut, LogIn } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { AuthModal } from "./auth-modal";

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
}

export function Sidebar({ settings, onToggle, queueCount, onPrint }: SidebarProps) {
  const [session, setSession] = useState<any>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    if (!supabase) return;

    supabase.auth.getSession().then(({ data: { session } }: { data: { session: any } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const controls = [
    { id: "showTitle", label: "Game Title", icon: Type },
    { id: "showDesigner", label: "Designer", icon: User },
    { id: "showArtist", label: "Artist", icon: SwatchBook },
    { id: "showWeight", label: "Complexity Weight", icon: Scale },
    { id: "showDescription", label: "Description", icon: Info },
  ];

  return (
    <div className="w-64 bg-white/50 backdrop-blur-xl border-r border-zinc-200 h-screen p-6 flex flex-col gap-8 shadow-sm">
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      <div>
        <h1 className="text-xl font-bold text-primary tracking-tight mb-1">Shelf Shuffler</h1>
        <p className="text-xs text-zinc-500 font-medium uppercase tracking-[0.1em]">Customization Engine</p>
      </div>

      <div className="space-y-6">
        <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Card Anatomy</h2>

        <div className="space-y-3">
          {controls.map((control) => (
            <button
              key={control.id}
              onClick={() => onToggle(control.id)}
              className={cn(
                "w-full flex items-center justify-between p-3 rounded-xl border transition-all duration-200 group text-sm font-medium",
                settings[control.id as keyof typeof settings]
                  ? "bg-primary/5 border-primary/20 text-primary shadow-sm"
                  : "bg-white border-zinc-100 text-zinc-400 hover:border-zinc-200"
              )}
            >
              <div className="flex items-center gap-3">
                <control.icon size={18} className={cn("transition-colors", settings[control.id as keyof typeof settings] ? "text-primary" : "text-zinc-300")} />
                <span>{control.label}</span>
              </div>
              <div className={cn(
                "w-8 h-4 rounded-full relative transition-colors duration-200",
                settings[control.id as keyof typeof settings] ? "bg-primary" : "bg-zinc-200"
              )}>
                <div className={cn(
                  "absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all duration-200",
                  settings[control.id as keyof typeof settings] ? "left-4.5" : "left-0.5"
                )} />
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-auto space-y-4">
        {/* User Profile Section */}
        <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
          {session ? (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs uppercase">
                  {session.user.email?.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-zinc-900 truncate">{session.user.email}</p>
                  <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider">Member</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-red-500 transition-colors"
              >
                <LogOut size={14} />
                Sign Out
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="w-full flex items-center justify-center gap-2 py-2 text-[10px] font-bold uppercase tracking-widest text-primary hover:bg-primary/5 rounded-lg transition-colors"
            >
              <LogIn size={14} />
              Sign In to Save
            </button>
          )}
        </div>

        <button
          onClick={onPrint}
          disabled={queueCount === 0}
          className="w-full bg-primary text-white py-3 px-4 rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:translate-y-0 disabled:shadow-none"
        >
          Prepare Print Queue ({queueCount})
        </button>
      </div>
    </div>
  );
}
