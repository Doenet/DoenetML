import { createContext, useContext, useRef } from "react";
import { useCell, useStore } from "../hooks";
import { Children } from "./index";

export interface GraphFrame {
  xmin: number; xmax: number; ymin: number; ymax: number;
  width: number; height: number;
  svg: React.RefObject<SVGSVGElement | null>;
}
export const GraphContext = createContext<GraphFrame | null>(null);
export const useGraph = () => useContext(GraphContext)!;

export function toPixel(f: GraphFrame, x: number, y: number): [number, number] {
  return [((x - f.xmin) / (f.xmax - f.xmin)) * f.width, f.height - ((y - f.ymin) / (f.ymax - f.ymin)) * f.height];
}
export function toGraph(f: GraphFrame, px: number, py: number): [number, number] {
  return [f.xmin + (px / f.width) * (f.xmax - f.xmin), f.ymin + ((f.height - py) / f.height) * (f.ymax - f.ymin)];
}

export function Graph({ idx }: { idx: number }) {
  const store = useStore();
  const xmin = useCell(store.comps.cell(idx, "xmin")), xmax = useCell(store.comps.cell(idx, "xmax"));
  const ymin = useCell(store.comps.cell(idx, "ymin")), ymax = useCell(store.comps.cell(idx, "ymax"));
  const svg = useRef<SVGSVGElement>(null);
  const frame: GraphFrame = { xmin, xmax, ymin, ymax, width: 400, height: 400, svg };
  const [ox, oy] = toPixel(frame, 0, 0);
  return (
    <GraphContext.Provider value={frame}>
      <svg ref={svg} className="graph" width={frame.width} height={frame.height} data-comp={idx} data-name={store.comps.name(idx) ?? undefined}>
        <line x1={0} x2={frame.width} y1={oy} y2={oy} stroke="#ccc" />
        <line x1={ox} x2={ox} y1={0} y2={frame.height} stroke="#ccc" />
        <Children idx={idx} inGraph={true} />
      </svg>
    </GraphContext.Provider>
  );
}
