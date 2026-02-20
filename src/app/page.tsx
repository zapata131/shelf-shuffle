"use client";

import { useState, useEffect, useRef } from "react";
import { Sidebar } from "@/components/sidebar";
import { GameCard } from "@/components/game-card";
import { PrintView } from "@/components/print-view";
import { Search, Loader2, Plus, Minus, Check, RefreshCw, LogIn, LayoutGrid, Zap, Printer } from "lucide-react";
import { useReactToPrint } from "react-to-print";
import { BGGCollectionItem } from "@/lib/bgg";
import { NormalizedGame } from "@/lib/normalizer";
import { cn } from "@/lib/utils";
import { loadGameCache, saveToGameCache } from "@/lib/cache";
import { supabase } from "@/lib/supabase";
import { AuthModal } from "@/components/auth-modal";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "@/lib/i18n";
import { LanguageSwitcher } from "@/components/language-switcher";

export default function Home() {
  const { t } = useTranslation();
  const [session, setSession] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [bggInput, setBggInput] = useState("");
  const [collection, setCollection] = useState<BGGCollectionItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [bulkLoading, setBulkLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedGame, setSelectedGame] = useState<NormalizedGame | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [printQueue, setPrintQueue] = useState<NormalizedGame[]>([]);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

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

  const fetchCollection = async (targetUsername?: string) => {
    const userToFetch = targetUsername || profile?.bgg_username;
    if (!userToFetch) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/bgg/collection/${userToFetch}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setCollection(data);
        if (data.length > 0 && !selectedGame) {
          loadGameDetails(data[0].id);
        }
      }
    } catch (e) {
      console.error("Collection fetch error:", e);
    } finally {
      setLoading(false);
    }
  };

  const loadGameDetails = async (id: string): Promise<NormalizedGame | null> => {
    const cache = loadGameCache();
    if (cache[id]) {
      setSelectedGame(cache[id]);
      return cache[id];
    }

    setLoadingDetails(true);
    try {
      const res = await fetch(`/api/bgg/game/${id}`);
      const data = await res.json();
      setSelectedGame(data);
      saveToGameCache([data]);
      return data;
    } catch (e) {
      console.error("Game details fetch error:", e);
      return null;
    } finally {
      setLoadingDetails(false);
    }
  };

  const toggleQueueItem = async (e: React.MouseEvent | null, item: BGGCollectionItem) => {
    if (e) e.stopPropagation();
    const existing = printQueue.find(g => g.id === item.id);
    if (existing) {
      setPrintQueue(prev => prev.filter(g => g.id !== item.id));
    } else {
      const details = await loadGameDetails(item.id);
      if (details) {
        setPrintQueue(prev => [...prev, details]);
      }
    }
  };

  const addToQueue = () => {
    if (selectedGame && !printQueue.find(g => g.id === selectedGame.id)) {
      setPrintQueue(prev => [...prev, selectedGame]);
    }
  };

  const removeFromQueue = () => {
    if (selectedGame) {
      setPrintQueue(prev => prev.filter(g => g.id !== selectedGame.id));
    }
  };

  const addAllToQueue = async () => {
    if (collection.length === 0) return;
    setBulkLoading(true);
    try {
      const cache = loadGameCache();
      const allToFetchIds: string[] = [];
      const cachedItems: NormalizedGame[] = [];

      filteredCollection.forEach(item => {
        if (cache[item.id]) {
          cachedItems.push(cache[item.id]);
        } else {
          allToFetchIds.push(item.id);
        }
      });

      const fetchedItems: NormalizedGame[] = [];
      const batchSize = 20;

      for (let i = 0; i < allToFetchIds.length; i += batchSize) {
        const batch = allToFetchIds.slice(i, i + batchSize);
        const ids = batch.join(",");
        const res = await fetch(`/api/bgg/game/${ids}`);
        const data = await res.json();

        if (Array.isArray(data)) {
          fetchedItems.push(...data);
        } else {
          fetchedItems.push(data);
        }
      }

      if (fetchedItems.length > 0) {
        saveToGameCache(fetchedItems);
      }

      const allNormalized = [...cachedItems, ...fetchedItems];

      setPrintQueue(prev => {
        const existingIds = new Set(prev.map(g => g.id));
        const newItems = allNormalized.filter(g => !existingIds.has(g.id));
        return [...prev, ...newItems];
      });
    } catch (e) {
      console.error("Bulk add error:", e);
    } finally {
      setBulkLoading(false);
    }
  };

  const handleToggle = (key: string) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key as keyof typeof settings],
    }));
  };

  const filteredCollection = collection.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="flex min-h-screen bg-background text-foreground overflow-hidden">
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
      <LanguageSwitcher />

      {!session ? (
        /* GUEST LANDING PAGE */
        <div className="flex-1 flex flex-col items-center justify-center p-8 bg-[radial-gradient(circle_at_50%_50%,rgba(131,103,199,0.08)_0%,transparent_50%)]">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl w-full text-center space-y-12"
          >
            <div className="space-y-4">
              <h1 className="text-6xl font-black text-carbon-suave tracking-tight italic uppercase">
                Shelf <span className="text-primary not-italic">Shuffler</span>
              </h1>
              <p className="text-xl text-zinc-500 font-medium max-w-2xl mx-auto leading-relaxed">
                {t.app.slogan}
              </p>
            </div>

            {/* How it Works Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: LayoutGrid, title: t.landing.sync.title, desc: t.landing.sync.desc },
                { icon: Zap, title: t.landing.customize.title, desc: t.landing.customize.desc },
                { icon: Printer, title: t.landing.print.title, desc: t.landing.print.desc }
              ].map((step, i) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="p-8 bg-white border border-zinc-100 rounded-3xl shadow-sm hover:shadow-xl hover:border-primary/20 transition-all group"
                >
                  <div className="w-14 h-14 bg-primary/5 rounded-2xl flex items-center justify-center text-primary mb-6 mx-auto group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all">
                    <step.icon size={28} />
                  </div>
                  <h3 className="text-lg font-bold text-zinc-900 mb-2">{step.title}</h3>
                  <p className="text-sm text-zinc-500 font-medium">{step.desc}</p>
                </motion.div>
              ))}
            </div>

            <div className="pt-8 flex flex-col items-center gap-4">
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="px-12 py-5 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-primary/30 hover:bg-primary/90 hover:scale-105 transition-all flex items-center gap-3"
              >
                <LogIn size={20} />
                {t.landing.get_started}
              </button>
              <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-[0.2em]">{t.app.powered_by}</p>
            </div>
          </motion.div>
        </div>
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
                          onClick={addAllToQueue}
                          disabled={loading || bulkLoading || filteredCollection.length === 0}
                          className="flex-1 flex items-center justify-center gap-1.5 text-[9px] font-bold uppercase tracking-wider py-1.5 px-2 bg-zinc-50 border border-zinc-100 rounded-md hover:bg-primary/5 hover:border-primary/20 hover:text-primary transition-all disabled:opacity-50"
                        >
                          {bulkLoading ? "..." : t.dashboard.add_all}
                        </button>
                        <button
                          onClick={() => setPrintQueue([])}
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
                {filteredCollection.map((item) => {
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
                      <img src={item.thumbnail} alt={item.name} className="w-full h-full object-cover" />
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
                    <span
                      onClick={(e) => toggleQueueItem(e, item)}
                      className={cn(
                        "absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center transition-all border shadow-sm",
                        inQueue ? "bg-primary text-white border-primary" : "bg-white text-zinc-400 border-zinc-100 opacity-0 group-hover:opacity-100 hover:border-primary/30 hover:text-primary"
                      )}
                      >
                        {inQueue ? <Check size={14} /> : <Plus size={14} />}
                      </span>
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
                      onClick={printQueue.some(g => g.id === selectedGame.id) ? removeFromQueue : addToQueue}
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
