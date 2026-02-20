# Shelf Shuffler 🃏

[![Next.js 15](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-11-ff0055?style=for-the-badge&logo=framer)](https://www.framer.com/motion/)
[![BGG Powered](https://img.shields.io/badge/Powered_By-BoardGameGeek-2e3d8c?style=for-the-badge)](https://boardgamegeek.com)

**Shelf Shuffler** is a premium board game catalog generator. It transforms your BoardGameGeek collection into a tactile, high-art "Catalog Deck"—perfect for shelf organization, game selection, or creating a physical record of your hobby.

---

## 💎 The "Catalog Deck" Aesthetic
Shelf Shuffler utilizes a specialized **Full-Art TCG design** optimized for both digital viewing and physical printing:
- **Sectioned Title Header**: Dedicated title bars prevent obstruction of game logos on box art.
- **Glassmorphism Overlays**: Vibe stats (players, time, weight) and summaries float on blurred, high-contrast panels.
- **Micro-Information Footer**: Compact, icon-driven credits for designers (`User`) and artists (`SwatchBook`).
- **Tactile Print Finish**: Subtle physical linen canvas overlays added to every card for a premium "poker card" feel.
- **Print-Ready Perfection**: Automated 3x3 grids for A4/Letter with safety borders and cut guides.

## 🚀 Features
- **Instant BGG Sync**: Connect your collection simply by entering your BGG username.
- **Performant Caching**: Intelligent client-side caching ensures near-instant repeat lookups and reduced API load.
- **Dynamic Customization**: Live-toggle card components (Title, Designer, Artist, Weight, Description).
- **Batch Processing**: Rapidly build print queues with optimized, batched API requests.
- **Global Character Support**: Robust HTML entity decoding for flawless international titles and accents.

## 🛠️ Prerequisites
- [Node.js](https://nodejs.org/) (v18.0 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- An active internet connection (to fetch BGG data)

## 🏁 Getting Started

### 1. Installation
Clone the repository and install dependencies:
```bash
git clone https://github.com/zapata131/shelf-shuffle.git
cd shelf-shuffle
npm install
```

### 2. Environment Setup
Create a `.env.local` file in the root directory and add your credentials:
```env
# BGG API (Optional)
BGG_API_KEY=your_key_here

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### 3. Database Migration
To enable user profiles and BGG mapping:
1. Go to your **Supabase Dashboard** > **SQL Editor**.
2. Copy the contents of [`supabase_migration.sql`](file:///Users/joseluiszapata/Documents/GitHub/shelf-shuffle/supabase_migration.sql).
3. Paste and **Run** the script.

### 3. Running Locally
Launch the development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to start shuffling!

## 📜 Attribution
This project is **Powered by [BoardGameGeek](https://boardgamegeek.com)**.
Data is fetched via the BGG XML API2. All board game imagery and metadata are properties of their respective creators and BoardGameGeek.

---
*Crafted with 💜 for the Board Game Community by [zapata131](https://github.com/zapata131)*
