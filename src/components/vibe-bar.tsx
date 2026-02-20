import { Users, Clock, Scale } from "lucide-react";

interface VibeBarProps {
  players: string;
  time: string;
  weight: number;
  showWeight: boolean;
}

export function VibeBar({ players, time, weight, showWeight }: VibeBarProps) {
  return (
    <div className="flex justify-around items-center py-1 px-2 text-[9px] text-white font-bold uppercase tracking-widest relative">
      <div className="flex items-center gap-1.5 relative z-10 min-w-0 drop-shadow-md">
        <Users size={11} className="text-white/90 shrink-0" />
        <span className="truncate">{players}</span>
      </div>

      <div className="w-px h-2.5 bg-white/20 shrink-0" />

      <div className="flex items-center gap-1.5 relative z-10 min-w-0 drop-shadow-md">
        <Clock size={11} className="text-white/90 shrink-0" />
        <span className="truncate">{time}</span>
      </div>

      {showWeight && (
        <>
          <div className="w-px h-2.5 bg-white/20 shrink-0" />
          <div className="flex items-center gap-1.5 relative z-10 min-w-0 drop-shadow-md">
            <Scale size={11} className="text-white/90 shrink-0" />
            <span className="truncate">{weight}</span>
          </div>
        </>
      )}

      {/* Subtle branding accent */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-20 pr-1">
        <div className="w-3 h-3 rounded-full border border-white" />
      </div>
    </div>
  );
}
