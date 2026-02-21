"use client";

import { motion } from "framer-motion";
import { LogIn, LayoutGrid, Zap, Printer } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

interface LandingViewProps {
  onStart: () => void;
}

export function LandingView({ onStart }: LandingViewProps) {
  const { t } = useTranslation();

  return (
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
            onClick={onStart}
            className="px-12 py-5 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-primary/30 hover:bg-primary/90 hover:scale-105 transition-all flex items-center gap-3"
          >
            <LogIn size={20} />
            {t.landing.get_started}
          </button>
          <a
            href="https://boardgamegeek.com"
            target="_blank"
            rel="noopener noreferrer"
            className="opacity-30 grayscale hover:opacity-100 transition-all duration-500 hover:scale-105"
          >
            <img src="/bgg-powered.png" alt="Powered by BGG" className="h-10 object-contain" />
          </a>
        </div>
      </motion.div>
    </div>
  );
}
