"use client";

import { useState, useEffect, useRef } from "react";
import { Sidebar } from "@/components/sidebar";
import Image from "next/image";
import { GameCard } from "@/components/game-card";
import { PrintView } from "@/components/print-view";
import { SettingsModal } from "@/components/settings-modal";
import { Search, Loader2, Plus, Minus, Check, RefreshCw, LogIn, LayoutGrid, Zap, Printer } from "lucide-react";
import { useReactToPrint } from "react-to-print";
import { BGGCollectionItem } from "@/lib/bgg";
import { NormalizedGame } from "@/lib/normalizer";
import { cn } from "@/lib/utils";
import { loadGameCache, saveToGameCache } from "@/lib/cache";
import { supabase } from "@/lib/supabase";
import { AuthModal } from "@/components/auth-modal";
import { useLibrary } from "@/lib/contexts/library-context";
import { usePrint } from "@/lib/contexts/print-context";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "@/lib/i18n";
import { LanguageSwitcher } from "@/components/language-switcher";
import { LandingView } from "@/components/landing-view";

export default function Home() {
  const { t } = useTranslation();
  const [session, setSession] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [bggInput, setBggInput] = useState("");
  const [search, setSearch] = useState("");
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const {
    collection,
    loading,
    selectedGame,
    loadingDetails,
    fetchCollection,
    loadGameDetails,
    filteredCollection
  } = useLibrary();

  const {
    printQueue,
    bulkLoading,
    toggleQueueItem,
    addToQueue,
    removeFromQueue,
    addAllToQueue,
    clearQueue
  } = usePrint();

  const contentRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    contentRef: contentRef,
    documentTitle: `${t.app.title}_${profile?.bgg_username || 'Collection'}`,
  });

  const [settings, setSettings] = useState({
    showTitle: true,
    showDesigner: true,
    showArtist: true,
    showWeight: true,
    showDescription: true,
  });

  // Auth & Profile Listener
  useEffect(() => {
    if (!supabase) return;

    supabase.auth.getSession().then(({ data: { session } }: { data: { session: any } }) => {
      setSession(session);
      if (session) fetchProfile(session.user.id);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
      setSession(session);
      if (session) fetchProfile(session.user.id);
      else {
        setProfile(null);
        setCollection([]);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (data) {
      setProfile(data);
      if (data.bgg_username) {
        fetchCollection(data.bgg_username);
      }
    }
  };

  const updateBGGUsername = async (newUsername?: string) => {
    const targetUsername = newUsername || bggInput;
    if (!session || !targetUsername) return;

    setLoading(true);
    const { error } = await supabase
      .from("profiles")
      .update({ bgg_username: targetUsername })
      .eq("id", session.user.id);

    if (!error) {
      setProfile({ ...profile, bgg_username: targetUsername });
      fetchCollection(targetUsername);
    }
    setLoading(false);
  };

  const handleToggle = (key: string) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key as keyof typeof settings],
    }));
  };

  const results = filteredCollection(search);

  return (
    <main className="flex min-h-screen bg-background text-foreground overflow-hidden">
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
      <LanguageSwitcher />

      {!session ? (
        <LandingView onStart={() => setIsAuthModalOpen(true)} />
      ) : (
        /* AUTHENTICATED DASHBOARD */
        <>
            <Sidebar
              settings={settings}
              onToggle={handleToggle}
              queueCount={printQueue.length}
              onPrint={handlePrint}
              session={session}
              profile={profile}
              onUpdateBGG={updateBGGUsername}
              onOpenSettings={() => setIsSettingsOpen(true)}
            />

            <SettingsModal
              isOpen={isSettingsOpen}
              onClose={() => setIsSettingsOpen(false)}
              currentUsername={profile?.bgg_username || ""}
              email={session?.user?.email}
              onUpdate={updateBGGUsername}
            />

            <div className="w-80 bg-white border-r border-zinc-200 flex flex-col h-screen shadow-inner">
              <div className="p-6 border-b border-zinc-100">

                {!profile?.bgg_username ? (
                  /* SETUP: Ask for BGG Username */
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">{t.dashboard.connect}</h3>
                    <div className="space-y-3">
                      <input
                        type="text"
                        placeholder={t.dashboard.username_placeholder}
                        value={bggInput}
                        onChange={(e) => setBggInput(e.target.value)}
                        className="w-full px-4 py-2 bg-zinc-50 border border-zinc-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 font-medium"
                      />
                      <button
                        onClick={() => updateBGGUsername()}
                        disabled={loading || !bggInput}
                        className="w-full bg-zinc-900 text-white py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-zinc-800 transition-all disabled:opacity-50"
                      >
                        {loading ? "..." : t.dashboard.sync_button}
                      </button>
                    </div>
                  </div>
                ) : (
                  /* DASHBOARD CONTROLS */
                  <>
                      <div className="flex items-center justify-between mb-2">
                      <div>
                          <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] mb-1">{t.dashboard.library_label}</h3>
                        <p className="text-sm font-black text-zinc-900 italic uppercase truncate max-w-[120px]">{profile.bgg_username}</p>
                      </div>
                      <button
                        onClick={() => fetchCollection()}
                        disabled={loading}
                          title={t.dashboard.refresh_collection}
                        className="p-2 hover:bg-primary/5 rounded-lg text-zinc-400 hover:text-primary transition-all disabled:opacity-50"
                      >
                        <RefreshCw className={cn("transition-all", loading && "animate-spin text-primary")} size={18} />
                      </button>
                    </div>

                      <p className="text-[9px] text-zinc-400 font-bold mb-4 bg-zinc-50 border border-zinc-100 rounded-lg p-2 leading-tight">
                        {t.dashboard.sync_reminder}
                      </p>

                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                        <input
                          type="text"
                          placeholder={t.dashboard.search_placeholder}
                          className="w-full pl-10 pr-4 py-2 bg-zinc-50 border border-zinc-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                        />
                      </div>

                      <div className="mt-4 flex gap-2">
                        <button
                          onClick={() => addAllToQueue(results)}
                          disabled={loading || bulkLoading || results.length === 0}
                          className="flex-1 flex items-center justify-center gap-1.5 text-[9px] font-bold uppercase tracking-wider py-1.5 px-2 bg-zinc-50 border border-zinc-100 rounded-md hover:bg-primary/5 hover:border-primary/20 hover:text-primary transition-all disabled:opacity-50"
                        >
                          {bulkLoading ? "..." : t.dashboard.add_all}
                        </button>
                        <button
                          onClick={clearQueue}
                          disabled={printQueue.length === 0}
                          className="flex-1 flex items-center justify-center gap-1.5 text-[9px] font-bold uppercase tracking-wider py-1.5 px-2 bg-zinc-50 border border-zinc-100 rounded-md hover:bg-red-50 hover:border-red-100 hover:text-red-500 transition-all disabled:opacity-50"
                        >
                          {t.dashboard.clear_queue}
                        </button>
                      </div>
                  </>
                )}
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {results.map((item) => {
                  const inQueue = printQueue.some(g => g.id === item.id);
                  const isSelected = selectedGame?.id === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => loadGameDetails(item.id)}
                      className={cn(
                        "w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group text-left relative overflow-hidden",
                      isSelected ? "bg-primary/5 border border-primary/20 shadow-sm" : "hover:bg-zinc-50 border border-transparent"
                    )}
                  >
                    {inQueue && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary shadow-[2px_0_10px_rgba(131,103,199,0.5)] z-10" />}
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-zinc-100 flex-shrink-0 border border-zinc-100 shadow-sm transition-transform group-hover:scale-105 relative">
                        <Image
                          src={item.thumbnail}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      {inQueue && (
                        <div className="absolute inset-0 bg-primary/20 backdrop-blur-[1px] flex items-center justify-center">
                          <Check className="text-white drop-shadow-md" size={16} />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0 pr-8">
                      <p className={cn("text-sm font-bold truncate transition-colors", isSelected ? "text-primary" : "text-zinc-900")}>{item.name}</p>
                      <p className="text-[10px] text-zinc-400 font-medium">{item.yearpublished || "N/A"}</p>
                    </div>
                      <div className="flex items-center gap-2">
                        <span
                          onClick={(e) => toggleQueueItem(e, item)}
                          className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center transition-all border shadow-sm",
                          inQueue
                            ? "bg-primary text-white border-primary"
                            : "bg-white text-zinc-400 border-zinc-100 hover:border-primary/30 hover:text-primary"
                        )}
                      >
                        {inQueue ? <Check size={14} /> : <Plus size={14} />}
                      </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Preview Workspace */}
            <div className="flex-1 flex flex-col items-center justify-center p-12 bg-white relative overflow-hidden">
              {/* Decorative Background for Workspace */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(131,103,199,0.03)_0%,transparent_50%)]" />

              <div className="mb-12 text-center relative z-10">
                <h2 className="text-3xl font-black text-zinc-900 tracking-tighter mb-2 italic uppercase">
                  {loadingDetails ? t.dashboard.fetching_details : t.dashboard.live_preview}
                </h2>
                <p className="text-sm text-zinc-500 font-medium">
                  {loadingDetails ? t.dashboard.analyzing_data : t.dashboard.live_preview_desc}
                </p>
              </div>

              <div className="relative group z-10">
                <div className="absolute -inset-8 bg-primary/10 blur-3xl opacity-50 group-hover:opacity-100 transition-opacity duration-500 rounded-full" />
                <div className={`relative shadow-2xl transition-all duration-500 ${loadingDetails ? 'opacity-50 scale-95' : 'shadow-zinc-900/5 hover:shadow-primary/20 hover:-translate-y-2'}`}>
                  {selectedGame ? (
                    <GameCard {...selectedGame} {...settings} />
                  ) : (
                    <div className="w-[2.5in] h-[3.5in] bg-zinc-50 rounded-lg flex items-center justify-center border-2 border-dashed border-zinc-200 text-zinc-300 font-bold uppercase text-[10px] tracking-widest text-center px-12">
                        {t.dashboard.select_game}
                    </div>
                  )}
                  {loadingDetails && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/20 backdrop-blur-[1px] rounded-lg">
                      <Loader2 className="animate-spin text-primary" size={32} />
                    </div>
                  )}
                </div>

                {selectedGame && !loadingDetails && (
                  <div className="absolute top-0 -right-20 flex flex-col gap-4">
                    <button 
                      onClick={printQueue.some(g => g.id === selectedGame.id) ? () => removeFromQueue(selectedGame) : () => addToQueue(selectedGame)}
                      className={cn(
                        "w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-lg group/btn",
                        printQueue.some(g => g.id === selectedGame.id)
                          ? "bg-white border border-zinc-100 text-zinc-400 hover:text-red-500 hover:bg-red-50"
                          : "bg-primary text-white hover:scale-110"
                      )}
                    >
                      {printQueue.some(g => g.id === selectedGame.id) ? <Minus size={20} /> : <Plus size={20} />}
                      <span className="absolute left-14 whitespace-nowrap bg-zinc-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover/btn:opacity-100 transition-opacity font-bold uppercase tracking-wider">
                        {printQueue.some(g => g.id === selectedGame.id) ? t.dashboard.remove_from_queue : t.dashboard.add_to_queue}
                      </span>
                    </button>
                  </div>
                )}
              </div>
            </div>
        </>
      )}

      <div className="hidden">
        <PrintView ref={contentRef} queue={printQueue} settings={settings} />
      </div>
    </main>
  );
}
