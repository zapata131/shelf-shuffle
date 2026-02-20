import { Users, Clock, Scale } from "lucide-react";

interface VibeBarProps {
  players: string;
  time: string;
  weight: number;
}

export function VibeBar({ players, time, weight }: VibeBarProps) {
  return (
    <div className="flex justify-between items-center py-1 px-2 bg-secondary/10 border-y border-secondary/20 text-[10px] text-foreground font-medium uppercase tracking-wider">
      <div className="flex items-center gap-1">
        <Users size={12} className="text-primary" />
        <span>{players}</span>
      </div>
      <div className="flex items-center gap-1">
        <Clock size={12} className="text-primary" />
        <span>{time}</span>
      </div>
      <div className="flex items-center gap-1">
        <Scale size={12} className="text-primary" />
        <span>{weight === 0 ? "N/A" : weight}</span>
      </div>
    </div>
  );
}
