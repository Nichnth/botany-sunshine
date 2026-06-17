import React from "react";
import { NavLink } from "react-router-dom";
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
  Home,
  GitBranch,
  Gamepad2,
} from "lucide-react";
import { FSM_LIST } from "../data/fsmData";

const iconMap = {
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
};

const Sidebar = () => {
  const grouped = FSM_LIST.reduce((acc, fsm) => {
    if (!acc[fsm.category]) acc[fsm.category] = [];
    acc[fsm.category].push(fsm);
    return acc;
  }, {});

  return (
    <aside
      className="fixed left-0 top-0 h-full w-72 bg-white border-r border-[#D1FAE5] p-6 overflow-y-auto z-40 hidden lg:block"
      data-testid="sidebar"
    >
      <NavLink to="/" className="flex items-center gap-3 mb-8" data-testid="sidebar-home-link">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#10B981] to-[#0EA5E9] flex items-center justify-center text-white">
          <Leaf size={22} />
        </div>
        <div>
          <h1 className="text-base font-bold tracking-tight text-[#064E3B] font-[Outfit]">
            HidroFarm FSM
          </h1>
          <p className="text-[10px] tracking-[0.2em] uppercase text-[#4B5563]">
            Dokumentasi Diagram
          </p>
        </div>
      </NavLink>

      <NavLink
        to="/"
        end
        className={({ isActive }) =>
          isActive
            ? "nav-link-active rounded-xl px-4 py-3 flex items-center gap-3 mb-4"
            : "text-[#4B5563] hover:bg-[#F4F9F4] hover:text-[#064E3B] font-medium rounded-xl px-4 py-3 flex items-center gap-3 mb-4 transition-colors"
        }
        data-testid="nav-home"
      >
        <Home size={18} />
        Beranda
      </NavLink>

      <NavLink
        to="/game"
        className={({ isActive }) =>
          isActive
            ? "rounded-xl px-4 py-3 flex items-center gap-3 mb-4 bg-gradient-to-r from-[#10B981] to-[#0EA5E9] text-white font-semibold shadow-sm"
            : "rounded-xl px-4 py-3 flex items-center gap-3 mb-4 bg-gradient-to-r from-[#10B981]/90 to-[#0EA5E9]/90 hover:from-[#10B981] hover:to-[#0EA5E9] text-white font-semibold shadow-sm transition-all"
        }
        data-testid="nav-game"
      >
        <Gamepad2 size={18} />
        Main Game
      </NavLink>

      {Object.entries(grouped).map(([category, items]) => (
        <div key={category} className="mb-6">
          <p className="text-[10px] tracking-[0.2em] uppercase text-[#4B5563] font-semibold mb-2 px-4">
            {category}
          </p>
          <nav className="flex flex-col gap-1">
            {items.map((fsm) => {
              const Icon = iconMap[fsm.icon] || GitBranch;
              return (
                <NavLink
                  key={fsm.id}
                  to={`/fsm/${fsm.id}`}
                  className={({ isActive }) =>
                    isActive
                      ? "nav-link-active rounded-xl px-4 py-2.5 flex items-center gap-3 text-sm"
                      : "text-[#4B5563] hover:bg-[#F4F9F4] hover:text-[#064E3B] font-medium rounded-xl px-4 py-2.5 flex items-center gap-3 text-sm transition-colors"
                  }
                  data-testid={`nav-${fsm.id}`}
                >
                  <Icon size={16} />
                  {fsm.title}
                </NavLink>
              );
            })}
          </nav>
        </div>
      ))}

    </aside>
  );
};

export default Sidebar;
