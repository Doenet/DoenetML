import { u as R, j as i, M as x } from "./index-8862516e.js";
import y, { useContext as C, useRef as o, useEffect as j } from "react";
import { BoardContext as v, LINE_LAYER_OFFSET as f } from "./graph-de465854.js";
import "react-dom";
import "styled-components";
import "./css-ab4d83ca.js";
const X = y.memo(function(b) {
  let { name: O, id: m, SVs: e } = R(b);
  const l = C(v);
  let u = o(null), s = o(null), c = o(null), r = o(null), h = o(null);
  j(() => () => {
    p();
  }, []);
  function p() {
    u.current !== null && (l.removeObject(r.current), r.current = null, l.removeObject(u.current), u.current = null, l.removeObject(s.current), s.current = null, l.removeObject(c.current), c.current = null);
  }
  function P() {
    if (e.numericalPoints.length !== 3 || e.numericalPoints.some((a) => a.length !== 2) || !(Number.isFinite(e.numericalRadius) && e.numericalRadius > 0))
      return null;
    var t = {
      name: e.labelForGraph,
      visible: !e.hidden,
      withLabel: e.labelForGraph !== "",
      fixed: !0,
      //SVs.draggable !== true,
      layer: 10 * e.layer + f,
      radius: e.numericalRadius,
      fillColor: e.selectedStyle.fillColor,
      strokeColor: e.selectedStyle.lineColor,
      highlight: !1,
      orthoType: e.emphasizeRightAngle ? "square" : "sector"
    };
    t.label = {
      highlight: !1
    }, e.labelHasLatex && (t.label.useMathJax = !0), h.current = e.labelForGraph !== "";
    let n;
    e.swapPointOrder ? n = [
      [...e.numericalPoints[2]],
      [...e.numericalPoints[1]],
      [...e.numericalPoints[0]]
    ] : n = [
      [...e.numericalPoints[0]],
      [...e.numericalPoints[1]],
      [...e.numericalPoints[2]]
    ];
    let d = {
      visible: !1
    };
    return u.current = l.create("point", n[0], d), s.current = l.create("point", n[1], d), c.current = l.create("point", n[2], d), l.create(
      "angle",
      [u.current, s.current, c.current],
      t
    );
  }
  if (e.hidden)
    return null;
  if (l) {
    if (r.current === null)
      r.current = P();
    else if (e.numericalPoints.length !== 3 || e.numericalPoints.some((t) => t.length !== 2) || !(Number.isFinite(e.numericalRadius) && e.numericalRadius > 0))
      p();
    else {
      let t;
      e.swapPointOrder ? t = [
        [...e.numericalPoints[2]],
        [...e.numericalPoints[1]],
        [...e.numericalPoints[0]]
      ] : t = [
        [...e.numericalPoints[0]],
        [...e.numericalPoints[1]],
        [...e.numericalPoints[2]]
      ], r.current.point2.coords.setCoordinates(
        JXG.COORDS_BY_USER,
        t[0]
      ), r.current.point1.coords.setCoordinates(
        JXG.COORDS_BY_USER,
        t[1]
      ), r.current.point3.coords.setCoordinates(
        JXG.COORDS_BY_USER,
        t[2]
      ), r.current.setAttribute({
        radius: e.numericalRadius,
        visible: !e.hidden
      });
      let n = 10 * e.layer + f;
      r.current.visProp.layer !== n && r.current.setAttribute({ layer: n }), r.current.visProp.fillcolor !== e.selectedStyle.fillColor && (r.current.visProp.fillcolor = e.selectedStyle.fillColor), r.current.visProp.strokecolor !== e.selectedStyle.lineColor && (r.current.visProp.strokecolor = e.selectedStyle.lineColor), r.current.name = e.labelForGraph;
      let a = e.labelForGraph !== "";
      a != h.current && (r.current.setAttribute({ withlabel: a }), h.current = a), r.current.visProp.orthotype = e.emphasizeRightAngle ? "square" : "sector", r.current.needsUpdate = !0, r.current.update(), r.current.hasLabel && (r.current.label.needsUpdate = !0, r.current.label.update()), l.updateRenderer();
    }
    return /* @__PURE__ */ i.jsx(i.Fragment, { children: /* @__PURE__ */ i.jsx("a", { name: m }) });
  }
  let g = "\\(" + e.latexForRenderer + "\\)";
  return /* @__PURE__ */ i.jsxs(i.Fragment, { children: [
    /* @__PURE__ */ i.jsx("a", { name: m }),
    /* @__PURE__ */ i.jsx("span", { id: m, children: /* @__PURE__ */ i.jsx(x, { hideUntilTypeset: "first", inline: !0, dynamic: !0, children: g }) })
  ] });
});
export {
  X as default
};
