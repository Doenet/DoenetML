import { u as R, d as x, e as S, h as p, j as l } from "./index-8862516e.js";
import F, { useContext as O, useRef as v, useEffect as L } from "react";
import { BoardContext as _, LINE_LAYER_OFFSET as y } from "./graph-de465854.js";
import "react-dom";
import "styled-components";
import "./css-ab4d83ca.js";
const G = F.memo(function h(m) {
  let { name: j, id: o, SVs: e } = R(m);
  h.ignoreActionsWithoutCore = () => !0;
  const t = O(_);
  let n = v(null), r = v(null);
  const c = x(S);
  L(() => () => {
    r.current !== null && s();
  }, []);
  function b() {
    if (!e.haveFunction || e.boundaryValues.length !== 2 || !e.boundaryValues.every(Number.isFinite))
      return null;
    let i = c === "dark" ? e.selectedStyle.fillColorDarkMode : e.selectedStyle.fillColor, u = {
      name: e.labelForGraph,
      visible: !e.hidden,
      withLabel: e.labelForGraph !== "",
      fixed: !0,
      layer: 10 * e.layer + y,
      fillColor: i,
      fillOpacity: e.selectedStyle.fillOpacity,
      highlight: !1,
      // don't display points at left and right endpoints along function
      curveLeft: { visible: !1 },
      curveRight: { visible: !1 }
    };
    u.label = {
      highlight: !1
    };
    let a = p(e.fDefinition);
    return n.current = t.create("functiongraph", a, { visible: !1 }), t.create(
      "integral",
      [e.boundaryValues, n.current],
      u
    );
  }
  function s() {
    r.current && (t.removeObject(r.current), r.current = null, t.removeObject(n.current), n.current = null);
  }
  if (t) {
    if (r.current === null)
      r.current = b();
    else if (!e.haveFunction || e.boundaryValues.length !== 2 || !e.boundaryValues.every(Number.isFinite))
      s();
    else {
      let i = p(e.fDefinition);
      n.current.Y = i, r.current.visProp.visible = !e.hidden, r.current.visPropCalc.visible = !e.hidden;
      let [u, a] = e.boundaryValues, [g, C] = e.boundaryValues.map(i);
      r.current.curveLeft.coords.setCoordinates(JXG.COORDS_BY_USER, [
        u,
        g
      ]), r.current.curveRight.coords.setCoordinates(JXG.COORDS_BY_USER, [
        a,
        C
      ]);
      let d = 10 * e.layer + y;
      r.current.visProp.layer !== d && r.current.setAttribute({ layer: d });
      let f = c === "dark" ? e.selectedStyle.fillColorDarkMode : e.selectedStyle.fillColor;
      r.current.visProp.fillcolor !== f && (r.current.visProp.fillcolor = f), r.current.visProp.fillopacity !== e.selectedStyle.fillOpacity && (r.current.visProp.fillopacity = e.selectedStyle.fillOpacity), r.current.curveLeft.needsUpdate = !0, r.current.curveLeft.update(), r.current.curveLeft.fullUpdate(), r.current.curveRight.needsUpdate = !0, r.current.curveLeft.update(), r.current.curveRight.fullUpdate(), r.current.needsUpdate = !0, r.current.curveLeft.update(), r.current.fullUpdate(), t.update(), t.fullUpdate(), t.updateRenderer();
    }
    return /* @__PURE__ */ l.jsx(l.Fragment, { children: /* @__PURE__ */ l.jsx("a", { name: o }) });
  }
  return e.hidden ? null : /* @__PURE__ */ l.jsx(l.Fragment, { children: /* @__PURE__ */ l.jsx("a", { name: o }) });
});
export {
  G as default
};
