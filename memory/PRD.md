# HidroFarm — Hydroponic Farming Simulation Game

## Original Problem Statement
> "I want to make a simulation game where player can learn how to be a hydroponic farmer. The game consist every process in the job including buying the seedlings, seeding process, watering, providing nutrients, fixing the tools and system such as repairing the farming slot, to final process which is selling the harvest. Before implementation, I want to make the multi FSM diagram to every detail process."

## User Choices
- Phase 1 first: FSM documentation in .drawio format → then game
- All 13 FSMs (Main processes + supporting like growth, weather, market, pH, day/night)
- Style: 2D top-down grid + visual interactive farm with animation
- Web (React + FastAPI + MongoDB, local storage for game state)
- UI Language: Bahasa Indonesia

## Personas
- Pelajar/calon petani hidroponik yang ingin memahami alur lengkap budidaya
- Mahasiswa Software Engineering / Game Design yang mempelajari FSM

## Tech
- Frontend: React 19, react-router 7, lucide-react, tailwind, shadcn
- Backend: FastAPI + MongoDB (template only, game uses localStorage)

## Implemented (2026-02-15)
### Phase 1 — FSM Documentation
- 13 FSM diagrams: Pembelian Bibit, Penyemaian, Penyiraman, Pemberian Nutrisi, Perbaikan Alat, Panen & Jual, Siklus Hidup Tanaman, Status Pemain, Status Peralatan, Ekonomi & Pasar, Sistem Cuaca, Keseimbangan pH & Air, Siklus Siang/Malam
- Custom SVG diagram renderer with curved arrows + labels
- .drawio XML generator: download per-FSM or combined file
- Tabel Status, Aksi, Transisi untuk setiap FSM
- Sidebar navigation (Beranda, Main Game, 13 FSM)

### Phase 2 — Game 2D
- 4x3 farm grid (12 slot)
- Status bar: Saldo, Hari, Jam+fase, Cuaca, Stamina
- Auto game-tick (1 jam = 2.5 detik real time)
- Plant lifecycle: empty → seeded → growing → mature / wilted / broken
- Aksi per-slot: tanam, siram, beri nutrisi, pH up/down, perbaiki, panen
- Toko (6 bibit, 4 suku cadang/nutrisi)
- Pasar (harga ±20% fluktuasi)
- Inventaris (bibit, perlengkapan, hasil panen)
- Tidur (skip waktu + pulihkan stamina)
- Pause/Play, Reset
- Log aktivitas in-game
- Persistence di localStorage

## Backlog (P1/P2)
- Tutorial step-by-step in-game (P1)
- Achievements/quest system (P2)
- Animasi tanaman tumbuh real-time (P2)
- Multi-farm expansion (P2)
- Leaderboard cloud-synced (P2)

## Known limitations
- Game progress di localStorage only (per-browser)
- Tidak ada multiplayer / cloud save
