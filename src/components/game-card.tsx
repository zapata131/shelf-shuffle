"use client";

import { motion, AnimatePresence } from "framer-motion";
import { User, SwatchBook } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { VibeBar } from "./vibe-bar";

interface GameCardProps {
  title: string;
  designer: string;
  artist: string;
  image: string;
  description: string;
  players: string;
  time: string;
  weight: number;
  showTitle?: boolean;
  showDesigner?: boolean;
  showArtist?: boolean;
  showWeight?: boolean;
  showDescription?: boolean;
}

/**
 * Standard 2.5" x 3.5" TCG-style card component.
 * Features a dedicated title section above the art and a compact, icon-based footer.
 * Includes print-specific logic to ensure overlays are visible and static.
 */
export function GameCard({
  title,
  designer,
  artist,
  image,
  description,
  players,
  time,
  weight,
  showTitle = true,
  showDesigner = true,
  showArtist = true,
  showWeight = true,
  showDescription = true,
}: GameCardProps) {
  // Use a simple check for print context if possible, but mainly rely on CSS
  // Motion components will be kept but simplified for print via CSS or variants if needed.

  return (
    <div 
      className="relative bg-zinc-900 text-white overflow-hidden border-[0.25pt] border-white/20 group/card shadow-2xl print:shadow-none print:border-zinc-300"
      style={{
        width: "2.5in",
        height: "3.5in",
        padding: "3mm",
        WebkitPrintColorAdjust: "exact",
      }}
    >
      <div className="absolute inset-0 bg-white" />

      <div className="relative h-full w-full overflow-hidden bg-zinc-800 rounded-sm flex flex-col print:bg-zinc-900">

        {/* Title Section */}
        <AnimatePresence>
          {showTitle && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0 }} // Effectively disable animation for quick capture
              className="bg-zinc-900 border-b border-white/10 p-2 shrink-0 z-20 print:!opacity-100 print:!h-auto"
            >
              <h2 className="font-black text-[11px] leading-tight uppercase tracking-tighter line-clamp-2 text-center text-white/95">
                {title}
              </h2>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Artwork Area */}
        <div className="relative flex-1 min-h-0 overflow-hidden z-0 bg-zinc-800">
          <Image
            src={image}
            alt={title}
            fill
            sizes="2.5in"
            priority
            className="object-cover object-top transition-transform duration-1000 group-hover/card:scale-110 print:transform-none"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/70 print:bg-black/40" />

          {/* Floating UI Overlays */}
          <div className="absolute inset-0 flex flex-col p-2.5 justify-end z-10 print:opacity-100">
            <div className="flex flex-col gap-2 max-h-full overflow-hidden">

              {/* Stat indicators */}
              <div className="backdrop-blur-md bg-white/10 rounded-lg overflow-hidden border border-white/10 shadow-lg print:bg-black/40 print:backdrop-blur-none">
                <VibeBar
                  players={players}
                  time={time}
                  weight={weight}
                  showWeight={showWeight}
                />
              </div>

              {/* Game summary */}
              <AnimatePresence mode="popLayout">
                {showDescription && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0 }}
                    className="overflow-hidden backdrop-blur-md bg-black/50 rounded-lg border border-white/5 shadow-inner print:bg-black/60 print:backdrop-blur-none print:!opacity-100 print:!h-auto"
                  >
                    <div className="p-2.5 pt-3 pb-3 text-[8px] leading-[1.3] text-white/95 font-medium italic line-clamp-3 text-center">
                      {description}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Compact Footer */}
        {(showDesigner || showArtist) && (
          <div className="bg-zinc-900 border-t border-white/10 px-2 py-1.5 text-[7px] text-white/90 font-bold uppercase tracking-widest flex items-center justify-between gap-2 shrink-0 z-20 overflow-hidden print:opacity-100">
            {showDesigner && (
              <div className="flex items-center gap-1 min-w-0 flex-1">
                <User size={8} className="opacity-50 shrink-0" />
                <span className="truncate tracking-tight">{designer}</span>
              </div>
            )}
            {showArtist && (
              <div className="flex items-center gap-1 min-w-0 flex-1 justify-end">
                <SwatchBook size={8} className="opacity-50 shrink-0" />
                <span className="truncate tracking-tight">{artist}</span>
              </div>
            )}
          </div>
        )}

        {/* Watermark and Texture */}
        <div className="absolute top-1/2 -rotate-90 -right-4 text-[4.5px] font-black text-white/10 uppercase tracking-[0.4em] pointer-events-none select-none z-30 print:hidden">
          Shelf Shuffler CATALOG DECK © 2026
        </div>

        <div 
          className="absolute inset-0 pointer-events-none opacity-[0.04] z-50 mix-blend-overlay print:hidden"
          style={{
            backgroundImage: `url("https://www.transparenttextures.com/patterns/linen-canvas.png")`,
          }}
        />
      </div>

      <div className="absolute inset-0 border-[0.2pt] border-zinc-200 pointer-events-none z-[60] print:border-zinc-300" />
    </div>
  );
}
