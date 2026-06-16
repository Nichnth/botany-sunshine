import React from "react";
import { useParams, Navigate } from "react-router-dom";
import { Download, GitBranch, ZoomIn, ZoomOut } from "lucide-react";
import { getFSMById, FSM_LIST } from "../data/fsmData";
import FSMDiagram from "../components/FSMDiagram";
import { StateTable, EventTable, TransitionTable } from "../components/FSMTables";
import { downloadDrawio } from "../utils/drawioGenerator";

const FSMPage = () => {
  const { id } = useParams();
  const fsm = getFSMById(id);

  if (!fsm) return <Navigate to="/" replace />;

  const fsmIndex = FSM_LIST.findIndex((f) => f.id === id);

  return (
    <div className="p-6 md:p-8 lg:p-12 animate-fade-up max-w-[1400px]">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[10px] tracking-[0.2em] uppercase text-[#0284C7] font-semibold bg-[#E0F2FE] px-3 py-1 rounded-full">
            FSM #{String(fsmIndex + 1).padStart(2, "0")} / 13
          </span>
          <span className="text-[10px] tracking-[0.2em] uppercase text-[#4B5563]">
            {fsm.category}
          </span>
        </div>
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
          <div>
            <h1 className="text-4xl sm:text-5xl tracking-tight font-bold text-[#064E3B] mb-3 font-[Outfit]">
              {fsm.title}
            </h1>
            <p className="text-base text-[#4B5563] leading-relaxed max-w-2xl">
              {fsm.description}
            </p>
          </div>
          <button
            onClick={() => downloadDrawio(fsm)}
            data-testid="btn-download-drawio"
            className="bg-[#10B981] hover:bg-[#059669] text-white px-6 py-3 rounded-xl transition-all shadow-sm active:translate-y-[1px] font-semibold inline-flex items-center gap-2 self-start"
          >
            <Download size={18} />
            Unduh .drawio
          </button>
        </div>
      </div>

      {/* Statistic Pills */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatPill label="Status" value={fsm.states.length} accent="#10B981" />
        <StatPill label="Aksi" value={fsm.events.length} accent="#0EA5E9" />
        <StatPill label="Transisi" value={fsm.transitions.length} accent="#0284C7" />
      </div>

      {/* Diagram Viewer */}
      <div
        className="bg-white border border-[#D1FAE5] rounded-2xl shadow-sm relative overflow-hidden flex flex-col h-[640px] mb-6"
        data-testid="fsm-viewer"
      >
        <div className="flex items-center justify-between p-4 border-b border-[#D1FAE5] bg-[#F4F9F4]">
          <div className="flex items-center gap-2">
            <GitBranch size={16} className="text-[#10B981]" />
            <span className="font-semibold text-sm text-[#064E3B]">Diagram FSM</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#4B5563]">
            <LegendDot color="#10B981" label="Initial" />
            <LegendDot color="#FFFFFF" border="#10B981" label="State" />
            <LegendDot color="#0EA5E9" label="Final" />
            <LegendDot color="#FEE2E2" border="#EF4444" label="Error" />
          </div>
        </div>
        <div className="flex-1 fsm-grid-bg overflow-auto p-4">
          <FSMDiagram fsm={fsm} />
        </div>
      </div>

      {/* Tables */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
        <StateTable states={fsm.states} />
        <EventTable events={fsm.events} />
        <TransitionTable transitions={fsm.transitions} states={fsm.states} />
      </div>

      {/* Navigation between FSMs */}
      <FSMNavigation currentIdx={fsmIndex} />
    </div>
  );
};

const StatPill = ({ label, value, accent }) => (
  <div className="bg-white border border-[#D1FAE5] rounded-2xl p-4 flex items-center gap-3">
    <div
      className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold"
      style={{ background: accent }}
    >
      {value}
    </div>
    <div>
      <p className="text-[10px] tracking-[0.2em] uppercase text-[#4B5563]">{label}</p>
      <p className="text-sm font-semibold text-[#064E3B]">Total</p>
    </div>
  </div>
);

const LegendDot = ({ color, border, label }) => (
  <div className="flex items-center gap-1.5">
    <span
      className="w-3 h-3 rounded-full inline-block"
      style={{ background: color, border: border ? `2px solid ${border}` : "none" }}
    />
    <span className="font-mono text-[10px]">{label}</span>
  </div>
);

const FSMNavigation = ({ currentIdx }) => {
  const prev = currentIdx > 0 ? FSM_LIST[currentIdx - 1] : null;
  const next = currentIdx < FSM_LIST.length - 1 ? FSM_LIST[currentIdx + 1] : null;

  return (
    <div className="grid grid-cols-2 gap-4">
      {prev ? (
        <a
          href={`/fsm/${prev.id}`}
          className="bg-white border border-[#D1FAE5] rounded-2xl p-5 hover:border-[#10B981] transition-all group"
          data-testid="btn-prev-fsm"
        >
          <p className="text-[10px] tracking-[0.2em] uppercase text-[#4B5563] mb-1">← Sebelumnya</p>
          <p className="font-bold text-[#064E3B] group-hover:text-[#10B981]">{prev.title}</p>
        </a>
      ) : (
        <div />
      )}
      {next && (
        <a
          href={`/fsm/${next.id}`}
          className="bg-white border border-[#D1FAE5] rounded-2xl p-5 hover:border-[#10B981] transition-all text-right group"
          data-testid="btn-next-fsm"
        >
          <p className="text-[10px] tracking-[0.2em] uppercase text-[#4B5563] mb-1">Berikutnya →</p>
          <p className="font-bold text-[#064E3B] group-hover:text-[#10B981]">{next.title}</p>
        </a>
      )}
    </div>
  );
};

export default FSMPage;
