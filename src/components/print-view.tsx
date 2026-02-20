"use client";

import React from "react";
import { GameCard } from "./game-card";
import { NormalizedGame } from "@/lib/normalizer";

interface PrintViewProps {
  queue: NormalizedGame[];
  settings: {
    showDesigner: boolean;
    showArtist: boolean;
    showWeight: boolean;
    showDescription: boolean;
  };
}

export const PrintView = React.forwardRef<HTMLDivElement, PrintViewProps>(
  ({ queue, settings }, ref) => {
    // Chunk queue into groups of 9 for 3x3 grids per page
    const pages = [];
    for (let i = 0; i < queue.length; i += 9) {
      pages.push(queue.slice(i, i + 9));
    }

    return (
      <div ref={ref} className="print-container bg-white">
        {pages.map((page, pageIdx) => (
          <div 
            key={pageIdx} 
            className="print-page relative w-[210mm] h-[297mm] mx-auto p-[10mm] bg-white overflow-hidden"
            style={{ pageBreakAfter: "always" }}
          >
            {/* 3x3 Grid */}
            <div className="grid grid-cols-3 grid-rows-3 gap-0 border-collapse">
              {page.map((game, gameIdx) => (
                <div key={gameIdx} className="relative outline-[0.25pt] outline-zinc-200 outline-offset-[-0.125pt]">
                  <GameCard {...game} {...settings} />
                </div>
              ))}
            </div>

            {/* Crop Markers (Conceptual - usually handled by CSS or border logic in this case) */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
              {/* Vertical Lines */}
              <div className="absolute left-[70mm] top-0 bottom-0 border-l-[0.1pt] border-zinc-400 border-dashed" />
              <div className="absolute left-[140mm] top-0 bottom-0 border-l-[0.1pt] border-zinc-400 border-dashed" />
              {/* Horizontal Lines */}
              <div className="absolute top-[88.9mm] left-0 right-0 border-t-[0.1pt] border-zinc-400 border-dashed" />
              <div className="absolute top-[177.8mm] left-0 right-0 border-t-[0.1pt] border-zinc-400 border-dashed" />
            </div>
          </div>
        ))}

        <style jsx global>{`
          @media print {
            body { 
              background: white !important;
              margin: 0 !important;
              padding: 0 !important;
            }
            .print-container {
              width: 100%;
            }
            .print-page {
              box-shadow: none !important;
              margin: 0 !important;
              padding: 0 !important;
              width: 210mm;
              height: 297mm;
            }
            @page {
              size: A4;
              margin: 0;
            }
          }
        `}</style>
      </div>
    );
  }
);

PrintView.displayName = "PrintView";
