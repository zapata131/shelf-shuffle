"use client";

import { motion, AnimatePresence } from "framer-motion";
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
 * Standard 2.5" x 3.5" TCG-style card component with a poster-style layout.
 * Design concentrates all information in a bottom stack to maximize art visibility
 * and prevent overlapping with box art logos.
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
  return (
    <div 
      className="relative bg-zinc-900 text-white overflow-hidden border-[0.25pt] border-white/20 group/card shadow-2xl"
      style={{
        width: "2.5in",
        height: "3.5in",
        padding: "3mm", // Safety bleed area
      }}
    >
      {/* Safety bleed background */}
      <div className="absolute inset-0 bg-white" />

      {/* Primary card layout inside the safety margin */}
      <div className="relative h-full w-full overflow-hidden bg-zinc-800 rounded-sm">

        {/* Full-bleed hero artwork */}
        <div className="absolute inset-0 z-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={image} 
            alt={title} 
            className="w-full h-full object-cover object-top transition-transform duration-1000 group-hover/card:scale-110"
          />
          {/* Gradient gradient ensures legibility of the bottom information stack */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/80" />
        </div>

        {/* Unified information stack at the bottom to keep the top area clear */}
        <div className="relative z-10 h-full flex flex-col p-2.5 justify-end">

          <div className="flex flex-col gap-2">

            {/* Poster-style title integrated into the bottom stack */}
            <AnimatePresence>
              {showTitle && (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 20, opacity: 0 }}
                  className="backdrop-blur-md bg-black/40 rounded-lg p-3 border border-white/10 shadow-lg"
                >
                  <h2 className="font-black text-[13px] leading-tight uppercase tracking-tighter line-clamp-2 drop-shadow-md text-center">
                    {title}
                  </h2>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Core game statistics */}
            <div className="backdrop-blur-md bg-white/10 rounded-lg overflow-hidden border border-white/10 shadow-lg">
              <VibeBar
                players={players}
                time={time} 
                weight={weight}
                showWeight={showWeight}
              />
            </div>

            {/* Explanatory summary/description overlay */}
            <AnimatePresence mode="popLayout">
              {showDescription && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                  className="overflow-hidden backdrop-blur-md bg-black/50 rounded-lg border border-white/5 shadow-inner"
                >
                  <div className="p-3 pb-4 text-[8px] leading-[1.4] text-white font-medium italic pr-3 line-clamp-3 drop-shadow-sm text-center">
                    {description}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Vertically stacked footer for contributor credits */}
            {(showDesigner || showArtist) && (
              <div className="bg-black/40 backdrop-blur-md rounded-md px-2 py-2 text-[7.5px] text-white font-bold uppercase tracking-widest flex flex-col gap-1.5 border border-white/10">
                {showDesigner && (
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="opacity-50 lowercase font-normal italic shrink-0">by</span>
                    <span className="truncate flex-1 tracking-tight">{designer}</span>
                  </div>
                )}
                {showArtist && (
                  <div className="flex items-center gap-1.5 min-w-0 border-t border-white/10 pt-1.5">
                    <span className="opacity-50 lowercase font-normal italic shrink-0">art</span>
                    <span className="truncate flex-1 tracking-tight">{artist}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Marginalia and branding */}
        <div className="absolute top-1/2 -rotate-90 -right-4 text-[4.5px] font-black text-white/5 uppercase tracking-[0.4em] pointer-events-none select-none">
          Shelf Shuffler CATALOG DECK © 2026
        </div>

        {/* Physical linen canvas texture overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.04] z-50 mix-blend-overlay"
          style={{
            backgroundImage: `url("https://www.transparenttextures.com/patterns/linen-canvas.png")`,
          }}
        />
      </div>

      {/* Micro-border cut guides */}
      <div className="absolute inset-0 border-[0.2pt] border-zinc-200 pointer-events-none z-[60]" />
    </div>
  );
}
