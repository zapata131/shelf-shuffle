"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Sidebar } from "@/components/sidebar";
import { GameCard } from "@/components/game-card";
import { PrintView } from "@/components/print-view";
import { Search, Loader2, Plus, Minus } from "lucide-react";
import { useReactToPrint } from "react-to-print";
import { BGGCollectionItem } from "@/lib/bgg";
import { NormalizedGame } from "@/lib/normalizer";

export default function Home() {
  const [username, setUsername] = useState("zapata131");
  const [collection, setCollection] = useState<BGGCollectionItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedGame, setSelectedGame] = useState<NormalizedGame | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [printQueue, setPrintQueue] = useState<NormalizedGame[]>([]);

  const contentRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    contentRef: contentRef,
    documentTitle: `ShelfShuffler_${username}`,
  });

  const [settings, setSettings] = useState({
    showDesigner: true,
    showArtist: true,
    showWeight: true,
    showDescription: true,
  });

  useEffect(() => {
    fetchCollection();
  }, []);

  const fetchCollection = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/bgg/collection/${username}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setCollection(data);
        if (data.length > 0) {
          loadGameDetails(data[0].id);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const loadGameDetails = async (id: string) => {
    setLoadingDetails(true);
    try {
      const res = await fetch(`/api/bgg/game/${id}`);
      const data = await res.json();
      setSelectedGame(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingDetails(false);
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

  const isInQueue = selectedGame ? printQueue.some(g => g.id === selectedGame.id) : false;

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
      <Sidebar
        settings={settings}
        onToggle={handleToggle}
        queueCount={printQueue.length}
        onPrint={handlePrint}
      />

      {/* Search and Collection List */}
      <div className="w-80 bg-white border-r border-zinc-200 flex flex-col h-screen shadow-inner">
        <div className="p-6 border-b border-zinc-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
            <input
              type="text"
              placeholder="Search collection..."
              className="w-full pl-10 pr-4 py-2 bg-zinc-50 border border-zinc-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="mt-4 flex items-center justify-between">
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
              {filteredCollection.length} Games Found
            </p>
            {loading && <Loader2 className="animate-spin text-primary" size={14} />}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {filteredCollection.map((item) => {
            const inQueue = printQueue.some(g => g.id === item.id);
            return (
              <button
                key={item.id}
                onClick={() => loadGameDetails(item.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group text-left relative ${selectedGame?.id === item.id
                    ? "bg-primary/5 border border-primary/20 shadow-sm"
                    : "hover:bg-zinc-50 border border-transparent"
                  }`}
              >
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-zinc-100 flex-shrink-0 border border-zinc-100 shadow-sm transition-transform group-hover:scale-105">
                  <img src={item.thumbnail} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-bold truncate ${selectedGame?.id === item.id ? "text-primary" : "text-carbon-suave"}`}>
                    {item.name}
                  </p>
                  <p className="text-[10px] text-zinc-400 font-medium">
                    {item.yearpublished || "N/A"}
                  </p>
                </div>
                {inQueue && (
                  <div className="w-2 h-2 rounded-full bg-primary absolute top-3 right-3 shadow-sm shadow-primary/40" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Preview Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-12 bg-[radial-gradient(circle_at_50%_50%,rgba(131,103,199,0.05)_0%,transparent_50%)]">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-black text-carbon-suave tracking-tighter mb-2 italic uppercase">
            {loadingDetails ? "Fetching Details..." : "Live Preview"}
          </h2>
          <p className="text-sm text-zinc-500 font-medium">
            {loadingDetails ? "Analyzing board game data structure..." : "Fine-tune your catalog deck appearance in real-time."}
          </p>
        </div>

        <div className="relative group">
          <div className="absolute -inset-8 bg-primary/10 blur-3xl opacity-50 group-hover:opacity-100 transition-opacity duration-500 rounded-full" />

          <div className={`relative shadow-2xl transition-all duration-500 ${loadingDetails ? 'opacity-50 scale-95' : 'shadow-carbon-suave/20 hover:shadow-primary/20 hover:-translate-y-2'}`}>
            {selectedGame ? (
              <GameCard
                {...selectedGame}
                {...settings}
              />
            ) : (
              <div className="w-[2.5in] h-[3.5in] bg-white rounded-lg flex items-center justify-center border-2 border-dashed border-zinc-200 text-zinc-300 font-bold uppercase text-xs tracking-widest text-center px-8">
                Select a game from your collection
              </div>
            )}

            {loadingDetails && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/20 backdrop-blur-[1px] rounded-lg">
                <Loader2 className="animate-spin text-primary" size={32} />
              </div>
            )}
          </div>

          {/* Selection Indicator & Actions */}
          {selectedGame && !loadingDetails && (
            <div className="absolute top-0 -right-20 flex flex-col gap-4">
              {isInQueue ? (
                <button
                  onClick={removeFromQueue}
                  className="w-12 h-12 bg-white border border-zinc-100 rounded-full flex items-center justify-center text-zinc-400 hover:text-red-500 hover:border-red-100 hover:bg-red-50 transition-all shadow-sm group/btn"
                >
                  <Minus size={20} />
                  <span className="absolute left-14 whitespace-nowrap bg-zinc-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover/btn:opacity-100 transition-opacity font-bold uppercase tracking-wider">Remove from Queue</span>
                </button>
              ) : (
                <button
                  onClick={addToQueue}
                  className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center shadow-lg shadow-primary/20 hover:bg-primary/90 hover:scale-110 transition-all group/btn"
                >
                  <Plus size={20} />
                  <span className="absolute left-14 whitespace-nowrap bg-zinc-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover/btn:opacity-100 transition-opacity font-bold uppercase tracking-wider">Add to Queue</span>
                </button>
              )}
            </div>
          )}

          {/* Scale Ref */}
          <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
            <div className="h-px w-8 bg-zinc-200" />
            <span>2.5" x 3.5" (Standard Poker)</span>
            <div className="h-px w-8 bg-zinc-200" />
          </div>
        </div>
      </div>

      {/* Hidden Print Wrapper */}
      <div className="hidden">
        <PrintView ref={contentRef} queue={printQueue} settings={settings} />
      </div>
    </main>
  );
}
