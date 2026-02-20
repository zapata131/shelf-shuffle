# Shelf Shuffler 🃏

[![Next.js 15](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-11-ff0055?style=for-the-badge&logo=framer)](https://www.framer.com/motion/)
[![BGG Powered](https://img.shields.io/badge/Powered_By-BoardGameGeek-2e3d8c?style=for-the-badge)](https://boardgamegeek.com)

**Shelf Shuffler** is a professional-grade board game catalog generator. It syncs your BoardGameGeek collection and transforms it into a premium "Catalog Deck"—high-art reference cards designed for shelf organization, tracking your gameplay, and creating a sleek physical record of your hobby.

---

## 💎 The "Catalog Deck" Experience
Every card follows a specialized **Full-Art TCG layout** optimized for both digital browsing and physical 3x3 grid printing:

- **Sectioned Header**: Title bars are separated from the artwork to prevent cropping high-detail box art.
- **Glassmorphism UI**: Dynamic overlays for players, time, and "Peso" (complexity) using blurred, high-contrast panels.
- **Micro-Stats Footer**: Clean, icon-driven attribution for designers and artists.
- **Linen Finish**: An optional physical texture overlay that gives every card a premium "poker card" feeling.
- **Print-Ready Engine**: Generates 3x3 A4/Letter grids with 3mm safety margins and cut markers for perfect results every time.

## 🚀 Key Features
- **Instant BGG Sync**: Connect your library just by entering your username—no CSV exports needed.
- **LatAm Spanish & English**: Built-in multi-language support (ES default) with a global toggle and regional nuances like "Deck" and "Configuración".
- **Intelligent Caching**: Uses local storage to cache game details after the first lookup, making library browsing near-instant.
- **Batch Processing**: "Add All" feature with batch-optimized API fetching to populate your print queue in seconds.
- **Supabase Integration**: Securely save your BGG mapping and account settings across devices.

## 🛠️ Prerequisites
- [Node.js](https://nodejs.org/) (v18.0+)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- Internet connection (for BGG XML API2 interaction)

## 🏁 Getting Started

### 1. Installation
```bash
git clone https://github.com/zapata131/shelf-shuffle.git
cd shelf-shuffle
npm install
```

### 2. Configuration
Create a `.env.local` file in the root with your credentials:
```env
# Supabase (Required for Member Dashboard)
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# BGG API Key (Optional, BGG rate limits apply)
BGG_API_KEY=your_key_here
```

### 3. Database Sync
To use the dashboard, manual refresh, and settings features:
1. Open your **Supabase Dashboard** > **SQL Editor**.
2. Run the script found in [supabase_migration.sql](./supabase_migration.sql) to set up the `profiles` table.

### 4. Direct Launch
```bash
npm run dev
```
Navigate to [http://localhost:3000](http://localhost:3000) and start shuffling!

## 📜 Attribution & Data
This project is **Powered by [BoardGameGeek](https://boardgamegeek.com)**.
All metadata and imagery are provided via the BGG XML API2 and remain the properties of their respective creators and BoardGameGeek.

---
*Built for the community by [zapata131](https://github.com/zapata131)*
