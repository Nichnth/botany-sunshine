import React from "react";
import { Link } from "react-router-dom";
import {
  ShoppingBag,
  Sprout,
  Droplet,
  FlaskConical,
  Wrench,
  TrendingUp,
  Leaf,
  User,
  Settings,
  DollarSign,
  Cloud,
  TestTube,
  Sun,
  Download,
  ArrowRight,
  GitBranch,
  Gamepad2,
} from "lucide-react";
import { FSM_LIST } from "../data/fsmData";
import { downloadAllDrawio } from "../utils/drawioGenerator";

const iconMap = {
  ShoppingBag, Sprout, Droplet, FlaskConical, Wrench, TrendingUp,
  Leaf, User, Settings, DollarSign, Cloud, TestTube, Sun,
};

const HomePage = () => {
  return (
    <div className="p-6 md:p-8 lg:p-12 animate-fade-up max-w-[1400px]">
      {/* Hero */}
      <div className="relative bg-white border border-[#D1FAE5] rounded-2xl overflow-hidden mb-10">
        <div
          className="absolute inset-0 opacity-20 fsm-grid-bg"
          aria-hidden="true"
        />
        <div className="relative p-8 md:p-12 grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
          <div className="lg:col-span-3">
            <div className="inline-flex items-center gap-2 bg-[#E0F2FE] text-[#0284C7] px-3 py-1.5 rounded-full mb-4 text-xs font-semibold tracking-wider uppercase">
              <GitBranch size={14} />
              Fase 1 — Dokumentasi FSM
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl tracking-tight font-bold text-[#064E3B] mb-4 font-[Outfit] leading-[1.05]">
              Belajar Hidroponik <br />
              <span className="text-[#10B981]">Selangkah Demi Selangkah</span>
            </h1>
            <p className="text-base text-[#4B5563] leading-relaxed max-w-xl mb-6">
              Dokumentasi lengkap 13 Diagram Finite State Machine (FSM) untuk Game Simulasi
              Petani Hidroponik. Setiap proses—dari membeli bibit, menyemai, menyiram, hingga
              menjual panen—dijelaskan dengan visualisasi state, event, dan transisi.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to={`/fsm/${FSM_LIST[0].id}`}
                data-testid="cta-start-explore"
                className="bg-[#10B981] hover:bg-[#059669] text-white px-6 py-3 rounded-xl transition-all shadow-sm active:translate-y-[1px] font-semibold inline-flex items-center gap-2"
              >
                Mulai Eksplorasi <ArrowRight size={18} />
              </Link>
              <button
                onClick={() => downloadAllDrawio(FSM_LIST)}
                data-testid="btn-download-all"
                className="border-2 border-[#10B981] text-[#10B981] hover:bg-[#F4F9F4] px-6 py-3 rounded-xl transition-all font-semibold inline-flex items-center gap-2"
              >
                <Download size={18} /> Unduh Semua .drawio
              </button>
            </div>
          </div>
          <div className="lg:col-span-2">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1682629088818-1ec55d0cf45b?crop=entropy&cs=srgb&fm=jpg&q=85&w=600"
                alt="Hydroponic Farm"
                className="rounded-2xl shadow-md w-full h-72 object-cover animate-float"
              />
              <div className="absolute -bottom-4 -left-4 bg-white border border-[#D1FAE5] rounded-2xl p-4 shadow-md">
                <p className="text-[10px] tracking-[0.2em] uppercase text-[#4B5563]">Total FSM</p>
                <p className="text-3xl font-bold text-[#10B981]">{FSM_LIST.length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FSM Categories Grid */}
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl tracking-tight font-semibold text-[#064E3B] mb-2 font-[Outfit]">
          Jelajahi 13 FSM Diagram
        </h2>
        <p className="text-base text-[#4B5563] mb-6">
          Klik setiap kartu untuk melihat diagram, tabel status, dan unduh format .drawio.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {FSM_LIST.map((fsm, idx) => {
            const Icon = iconMap[fsm.icon] || Leaf;
            const isMain = fsm.category === "Proses Utama";
            return (
              <Link
                key={fsm.id}
                to={`/fsm/${fsm.id}`}
                data-testid={`card-${fsm.id}`}
                className="group bg-white border border-[#D1FAE5] rounded-2xl p-5 hover:border-[#10B981] hover:shadow-md transition-all relative overflow-hidden"
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center text-white ${
                      isMain ? "bg-[#10B981]" : "bg-[#0EA5E9]"
                    }`}
                  >
                    <Icon size={22} />
                  </div>
                  <span className="font-mono text-xs text-[#4B5563]">
                    #{String(idx + 1).padStart(2, "0")}
                  </span>
                </div>
                <p className="text-[10px] tracking-[0.2em] uppercase text-[#4B5563] mb-1">
                  {fsm.category}
                </p>
                <h3 className="font-bold text-lg text-[#064E3B] mb-2 group-hover:text-[#10B981] transition-colors">
                  {fsm.title}
                </h3>
                <p className="text-xs text-[#4B5563] leading-relaxed line-clamp-2 mb-3">
                  {fsm.description}
                </p>
                <div className="flex items-center gap-3 text-[10px] font-mono text-[#0284C7]">
                  <span>{fsm.states.length} states</span>
                  <span>·</span>
                  <span>{fsm.events.length} events</span>
                  <span>·</span>
                  <span>{fsm.transitions.length} trans.</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Phase 2 Teaser */}
      <div className="mt-12 bg-gradient-to-br from-[#064E3B] to-[#0284C7] rounded-2xl p-8 text-white relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10 fsm-grid-bg"
          style={{ backgroundSize: "32px 32px" }}
        />
        <div className="relative grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          <div className="lg:col-span-2">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full mb-3 text-xs font-semibold tracking-wider uppercase">
              <Gamepad2 size={14} />
              Fase 2 — Game Simulasi Siap Dimainkan!
            </div>
            <h2 className="text-2xl sm:text-3xl tracking-tight font-bold mb-3 font-[Outfit]">
              Praktikkan Sebagai Petani Hidroponik Sungguhan
            </h2>
            <p className="text-sm text-white/80 leading-relaxed max-w-xl mb-4">
              Game 2D top-down dengan farm interaktif 4×3 slot. Beli bibit, semai, siram,
              beri nutrisi, dan jual hasil panen. Progress disimpan otomatis di browser.
            </p>
            <Link
              to="/game"
              data-testid="cta-play-game"
              className="inline-flex items-center gap-2 bg-white text-[#064E3B] hover:bg-white/90 px-6 py-3 rounded-xl font-bold transition-all shadow-md active:translate-y-[1px]"
            >
              <Gamepad2 size={18} /> Mulai Bermain
            </Link>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20">
            <p className="text-xs uppercase tracking-[0.2em] text-white/60 mb-2">
              Fitur Game
            </p>
            <ul className="text-sm space-y-1.5">
              <li>• Grid farming visual</li>
              <li>• Day/night cycle</li>
              <li>• Inventaris & ekonomi</li>
              <li>• Animasi pertumbuhan</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
