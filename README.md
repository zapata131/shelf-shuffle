# 🎴 Shelf Shuffler
> "Your Collection, Dealt to You."

**Shelf Shuffler** is a web-based utility that transforms your digital [BoardGameGeek](https://boardgamegeek.com) library into a physical, tactile "Catalog Deck." It bridges the gap between digital data and physical organization, allowing you to browse your collection as if it were a high-end trading card game.

## ✨ Features

- **Collection Sync**: Pulls your board game library directly from BGG XML API 2.
- **Customizable Cards**: 2.5" x 3.5" (Standard Poker Size) card generation with togglable info (Designer, Artist, Weight, Description).
- **Premium Design**: Fluid, high-end gallery aesthetic with buttery-smooth micro-animations.
- **Smart Print Engine**: Generates 3x3 grids on A4/Letter pages with precise crop markers for easy cutting.
- **Persistence**: Save your favorite print queues and customization presets via Google Authentication.

## 🎨 Branding & Aesthetic

Shelf Shuffler uses a curated palette for a premium, gallery-style experience:

| Role | Color Name | Hex |
| :--- | :--- | :--- |
| **Primary** | Malva suave | `#8367C7` |
| **Secondary** | Turquesa pastel | `#73D8D4` |
| **Accent** | Coral deslavado | `#FF9E8A` |
| **Background** | Blanco roto | `#F5F0E9` |
| **Text** | Carbon suave | `#3A3A3A` |

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Database/Auth**: [Supabase](https://supabase.com/)
- **PDF Engine**: [react-to-print](https://github.com/gregnb/react-to-print)
- **Data Parser**: [fast-xml-parser](https://github.com/NaturalIntelligence/fast-xml-parser)

## 🗺️ Roadmap

### Phase 1: Foundation
- [x] Project Initialization
- [x] Tech Stack & Plan Definition
- [ ] Branding Integration (CSS Variables)
- [ ] BGG API Integration & Normalization

### Phase 2: The Designer
- [ ] TCG Card Component UI
- [ ] Customization Sidebar
- [ ] Fluid Animation System

### Phase 3: The Library
- [ ] Supabase Auth (Google)
- [ ] Database Schema & RLS
- [ ] User Settings Persistence

### Phase 4: The Press
- [ ] Print Layout & Grid Logic
- [ ] Crop Marker Implementation
- [ ] PDF Generation Workflow

---

*Shelf Shuffler is a community project and is not affiliated with BoardGameGeek.*
