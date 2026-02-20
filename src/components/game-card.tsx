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
  showDesigner?: boolean;
  showArtist?: boolean;
  showWeight?: boolean;
  showDescription?: boolean;
}

export function GameCard({
  title,
  designer,
  artist,
  image,
  description,
  players,
  time,
  weight,
  showDesigner = true,
  showArtist = true,
  showWeight = true,
  showDescription = true,
}: GameCardProps) {
  return (
    <div 
      className="relative bg-white text-carbon-suave overflow-hidden border-[0.25pt] border-zinc-200"
      style={{
        width: "2.5in",
        height: "3.5in",
        padding: "3mm", // The 3mm white border
      }}
    >
      {/* Cut Guide Line (Very edge) */}
      <div className="absolute inset-0 border-[0.25pt] border-zinc-200 pointer-events-none" />

      <div className="flex flex-col h-full bg-white relative">
        {/* Header */}
        <div className="mb-2">
          <h2 className="font-bold text-sm leading-tight uppercase tracking-tight line-clamp-2">
            {title}
          </h2>
          <div className="mt-0.5 space-y-0 text-[9px] text-zinc-500 font-medium">
            {showDesigner && (
              <p className="leading-none">Designed by <span className="text-carbon-suave uppercase">{designer}</span></p>
            )}
            {showArtist && (
              <p className="leading-none mt-0.5">Illustrated by <span className="text-carbon-suave uppercase">{artist}</span></p>
            )}
          </div>
        </div>

        {/* Hero Art */}
        <motion.div 
          layout
          className="relative flex-1 bg-zinc-100 rounded-sm overflow-hidden mb-2"
          transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={image} 
            alt={title} 
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* Vibe Bar */}
        {(showWeight || players || time) && (
          <div className="mb-2">
            <VibeBar 
              players={players} 
              time={time} 
              weight={showWeight ? weight : 0} 
            />
          </div>
        )}

        {/* Description Box */}
        <AnimatePresence mode="popLayout">
          {showDescription && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
              className="overflow-hidden"
            >
              <div className="text-[9px] leading-relaxed text-zinc-600 font-normal italic pr-2 border-l-2 border-primary/20 pl-2">
                {description}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Branding Watermark */}
        <div className="absolute bottom-0 right-0 text-[6px] font-bold text-zinc-300 uppercase tracking-[0.2em] pointer-events-none">
          Shelf Shuffler
        </div>
      </div>
    </div>
  );
}
