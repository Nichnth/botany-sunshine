/**
 * Mengonversi definisi FSM menjadi XML format .drawio (mxGraph)
 * File yang dihasilkan bisa dibuka di https://app.diagrams.net
 */

const escapeXml = (str) =>
  String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const colorByType = {
  initial: { fill: "#10B981", stroke: "#059669", font: "#FFFFFF" },
  final: { fill: "#0EA5E9", stroke: "#0284C7", font: "#FFFFFF" },
  error: { fill: "#FEE2E2", stroke: "#EF4444", font: "#B91C1C" },
  normal: { fill: "#FFFFFF", stroke: "#10B981", font: "#064E3B" },
};

export const generateDrawioXML = (fsm) => {
  const cells = [];
  let id = 2;

  // State nodes
  fsm.states.forEach((s) => {
    const c = colorByType[s.type] || colorByType.normal;
    const style = `rounded=1;whiteSpace=wrap;html=1;fillColor=${c.fill};strokeColor=${c.stroke};fontColor=${c.font};fontSize=13;fontStyle=1;arcSize=40;`;
    cells.push(
      `<mxCell id="${s.id}" value="${escapeXml(s.name)}" style="${style}" vertex="1" parent="1">
        <mxGeometry x="${s.x}" y="${s.y}" width="140" height="60" as="geometry"/>
      </mxCell>`
    );
    id++;
  });

  // Transition edges
  fsm.transitions.forEach((t, idx) => {
    const edgeId = `E${idx}`;
    const style =
      "edgeStyle=orthogonalEdgeStyle;rounded=1;orthogonalLoop=1;jettySize=auto;html=1;exitX=1;exitY=0.5;exitDx=0;exitDy=0;entryX=0;entryY=0.5;entryDx=0;entryDy=0;strokeColor=#0EA5E9;fontColor=#0284C7;fontSize=11;labelBackgroundColor=#F4F9F4;";
    cells.push(
      `<mxCell id="${edgeId}" value="${escapeXml(t.event)}" style="${style}" edge="1" parent="1" source="${t.from}" target="${t.to}">
        <mxGeometry relative="1" as="geometry"/>
      </mxCell>`
    );
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<mxfile host="app.diagrams.net" modified="2026-02-01T00:00:00.000Z" agent="Hydroponic-FSM-Doc" version="22.0.0">
  <diagram name="${escapeXml(fsm.title)}" id="${fsm.id}">
    <mxGraphModel dx="1422" dy="757" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="1600" pageHeight="900" math="0" shadow="0">
      <root>
        <mxCell id="0"/>
        <mxCell id="1" parent="0"/>
        ${cells.join("\n        ")}
      </root>
    </mxGraphModel>
  </diagram>
</mxfile>`;

  return xml;
};

export const downloadDrawio = (fsm) => {
  const xml = generateDrawioXML(fsm);
  const blob = new Blob([xml], { type: "application/xml" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `FSM-${fsm.id}.drawio`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const downloadAllDrawio = async (fsmList) => {
  // Generate single combined drawio file with multiple pages
  const pages = fsmList
    .map((fsm) => {
      const cells = [];
      fsm.states.forEach((s) => {
        const c = colorByType[s.type] || colorByType.normal;
        const style = `rounded=1;whiteSpace=wrap;html=1;fillColor=${c.fill};strokeColor=${c.stroke};fontColor=${c.font};fontSize=13;fontStyle=1;arcSize=40;`;
        cells.push(
          `<mxCell id="${fsm.id}-${s.id}" value="${escapeXml(s.name)}" style="${style}" vertex="1" parent="1">
            <mxGeometry x="${s.x}" y="${s.y}" width="140" height="60" as="geometry"/>
          </mxCell>`
        );
      });
      fsm.transitions.forEach((t, idx) => {
        const edgeId = `${fsm.id}-edge-${idx}`;
        const style =
          "edgeStyle=orthogonalEdgeStyle;rounded=1;html=1;exitX=1;exitY=0.5;entryX=0;entryY=0.5;strokeColor=#0EA5E9;fontColor=#0284C7;fontSize=11;labelBackgroundColor=#F4F9F4;";
        cells.push(
          `<mxCell id="${edgeId}" value="${escapeXml(t.event)}" style="${style}" edge="1" parent="1" source="${fsm.id}-${t.from}" target="${fsm.id}-${t.to}">
            <mxGeometry relative="1" as="geometry"/>
          </mxCell>`
        );
      });
      return `<diagram name="${escapeXml(fsm.title)}" id="${fsm.id}">
    <mxGraphModel dx="1422" dy="757" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="1600" pageHeight="900" math="0" shadow="0">
      <root>
        <mxCell id="0"/>
        <mxCell id="1" parent="0"/>
        ${cells.join("\n        ")}
      </root>
    </mxGraphModel>
  </diagram>`;
    })
    .join("\n  ");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<mxfile host="app.diagrams.net" modified="2026-02-01T00:00:00.000Z" agent="Hydroponic-FSM-Doc" version="22.0.0">
  ${pages}
</mxfile>`;

  const blob = new Blob([xml], { type: "application/xml" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Hydroponic-FSM-Complete.drawio`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
