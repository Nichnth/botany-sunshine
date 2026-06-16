import React from "react";

const Badge = ({ children, color }) => {
  const palette = {
    initial: "bg-[#D1FAE5] text-[#059669]",
    final: "bg-[#E0F2FE] text-[#0284C7]",
    error: "bg-[#FEE2E2] text-[#B91C1C]",
    normal: "bg-[#F4F9F4] text-[#064E3B]",
  };
  return (
    <span
      className={`inline-block text-[10px] font-mono px-2 py-0.5 rounded-full font-semibold ${palette[color] || palette.normal}`}
    >
      {children}
    </span>
  );
};

export const StateTable = ({ states }) => (
  <div
    className="bg-white border border-[#D1FAE5] rounded-2xl overflow-hidden shadow-sm"
    data-testid="state-table"
  >
    <div className="bg-[#F4F9F4] p-4 border-b border-[#D1FAE5] flex items-center justify-between">
      <h3 className="font-semibold text-[#064E3B] text-base">Tabel Status (States)</h3>
      <span className="text-xs text-[#4B5563]">{states.length} status</span>
    </div>
    <div className="divide-y divide-[#E5F0E5] max-h-[400px] overflow-y-auto">
      {states.map((s) => (
        <div key={s.id} className="p-4 hover:bg-[#F9FCF9] transition-colors">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs text-[#0284C7] font-semibold">{s.id}</span>
            <span className="font-bold text-sm text-[#064E3B]">{s.name}</span>
            <Badge color={s.type}>{s.type}</Badge>
          </div>
          <p className="text-xs text-[#4B5563] leading-relaxed">{s.description}</p>
        </div>
      ))}
    </div>
  </div>
);

export const EventTable = ({ events }) => (
  <div
    className="bg-white border border-[#D1FAE5] rounded-2xl overflow-hidden shadow-sm"
    data-testid="event-table"
  >
    <div className="bg-[#F4F9F4] p-4 border-b border-[#D1FAE5] flex items-center justify-between">
      <h3 className="font-semibold text-[#064E3B] text-base">Tabel Aksi (Events)</h3>
      <span className="text-xs text-[#4B5563]">{events.length} aksi</span>
    </div>
    <div className="divide-y divide-[#E5F0E5] max-h-[400px] overflow-y-auto">
      {events.map((e) => (
        <div key={e.id} className="p-4 hover:bg-[#F9FCF9] transition-colors">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs text-[#0284C7] font-semibold">{e.id}</span>
            <span className="font-mono text-sm text-[#064E3B] font-bold">{e.name}</span>
          </div>
          <p className="text-xs text-[#4B5563] leading-relaxed">{e.description}</p>
        </div>
      ))}
    </div>
  </div>
);

export const TransitionTable = ({ transitions, states }) => {
  const getName = (id) => states.find((s) => s.id === id)?.name || id;
  return (
    <div
      className="bg-white border border-[#D1FAE5] rounded-2xl overflow-hidden shadow-sm"
      data-testid="transition-table"
    >
      <div className="bg-[#F4F9F4] p-4 border-b border-[#D1FAE5] flex items-center justify-between">
        <h3 className="font-semibold text-[#064E3B] text-base">Tabel Transisi</h3>
        <span className="text-xs text-[#4B5563]">{transitions.length} transisi</span>
      </div>
      <div className="divide-y divide-[#E5F0E5] max-h-[400px] overflow-y-auto">
        {transitions.map((t, idx) => (
          <div key={idx} className="p-4 hover:bg-[#F9FCF9] transition-colors">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-xs text-[#064E3B] font-semibold">{getName(t.from)}</span>
              <span className="font-mono text-[10px] bg-[#E0F2FE] text-[#0284C7] px-2 py-0.5 rounded">
                {t.event}
              </span>
              <span className="text-[#0EA5E9] text-xs">→</span>
              <span className="text-xs text-[#064E3B] font-semibold">{getName(t.to)}</span>
            </div>
            <p className="text-xs text-[#4B5563] leading-relaxed font-mono">action: {t.action}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
