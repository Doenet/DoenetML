import { u as N, d as I, e as V, j as g, t as q, M as z } from "./index-8862516e.js";
import K, { useContext as Q, useRef as l, useEffect as A } from "react";
import { BoardContext as Z, LINE_LAYER_OFFSET as E } from "./graph-de465854.js";
import "react-dom";
import "styled-components";
import "./css-ab4d83ca.js";
const oe = K.memo(function m(S) {
  var J;
  let { name: v, id: L, SVs: e, actions: s, callAction: c } = N(S);
  m.ignoreActionsWithoutCore = () => !0;
  const a = Q(Z);
  let t = l({}), y = l(null), k = l(null), w = l(!1), O = l(!1), h = l(!1), R = l(null), _ = l(null), u = l(null), D = l(null), P = l(!1), x = l(!1), F = l(!1);
  D.current = e.numericalPoints, P.current = e.fixed, x.current = !e.draggable || e.fixLocation || e.fixed, F.current = e.switchable && !e.fixed;
  const M = I(V);
  A(() => () => {
    Object.keys(t.current).length !== 0 && j(), a && a.off("move", G);
  }, []), A(() => {
    a && a.on("move", G);
  }, [a]);
  function Y() {
    var C;
    if (((C = e.numericalPoints) == null ? void 0 : C.length) !== 2 || e.numericalPoints.some((r) => r.length !== 2)) {
      t.current = {};
      return;
    }
    let d = e.labelForGraph !== "", b = M === "dark" ? e.selectedStyle.lineColorDarkMode : e.selectedStyle.lineColor;
    var f = {
      name: e.labelForGraph,
      visible: !e.hidden,
      withlabel: d,
      fixed: P.current,
      layer: 10 * e.layer + E,
      strokeColor: b,
      strokeOpacity: e.selectedStyle.lineOpacity,
      highlightStrokeColor: b,
      highlightStrokeOpacity: e.selectedStyle.lineOpacity * 0.5,
      strokeWidth: e.selectedStyle.lineWidth,
      highlightStrokeWidth: e.selectedStyle.lineWidth,
      dash: W(e.selectedStyle.lineStyle, e.dashed),
      highlight: !x.current
    };
    if (d) {
      let r, n, o;
      e.labelPosition === "upperright" ? (o = [5, 5], r = "left", n = "bottom") : e.labelPosition === "upperleft" ? (o = [-5, 5], r = "right", n = "bottom") : e.labelPosition === "lowerright" ? (o = [5, -5], r = "left", n = "top") : (o = [-5, -5], r = "right", n = "top"), f.label = {
        offset: o,
        anchorx: r,
        anchory: n,
        position: "top",
        highlight: !1
      }, e.labelHasLatex && (f.label.useMathJax = !0), e.applyStyleToLabel ? f.label.strokeColor = b : f.label.strokeColor = "var(--canvastext)";
    } else
      f.label = {
        highlight: !1
      }, e.labelHasLatex && (f.label.useMathJax = !0);
    let X = [[...e.numericalPoints[0]], [...e.numericalPoints[1]]], i = a.create("line", X, f);
    i.isDraggable = !x.current, i.on("drag", function(r) {
      let n = r.type === "pointermove";
      if ((!n || Math.abs(r.x - y.current[0]) > 0.1 || Math.abs(r.y - y.current[1]) > 0.1) && (h.current = !0), u.current = [], n) {
        var o = a.origin.scrCoords;
        for (let p = 0; p < 2; p++) {
          let T = (k.current[p][1] + r.x - y.current[0] - o[1]) / a.unitX, H = (o[2] - (k.current[p][2] + r.y - y.current[1])) / a.unitY;
          u.current.push([T, H]);
        }
      } else
        u.current.push([
          i.point1.X(),
          i.point1.Y()
        ]), u.current.push([
          i.point2.X(),
          i.point2.Y()
        ]);
      c({
        action: s.moveLine,
        args: {
          point1coords: u.current[0],
          point2coords: u.current[1],
          transient: !0,
          skippable: !0
        }
      }), i.point1.coords.setCoordinates(
        JXG.COORDS_BY_USER,
        D.current[0]
      ), i.point2.coords.setCoordinates(
        JXG.COORDS_BY_USER,
        D.current[1]
      );
    }), i.on("up", function(r) {
      h.current ? c({
        action: s.moveLine,
        args: {
          point1coords: u.current[0],
          point2coords: u.current[1]
        }
      }) : !O.current && !P.current && (F.current ? (c({
        action: s.switchLine
      }), c({
        action: s.lineClicked,
        args: { name: v }
        // send name so get original name if adapted
      })) : c({
        action: s.lineClicked,
        args: { name: v }
        // send name so get original name if adapted
      })), w.current = !1;
    }), i.on("keyfocusout", function(r) {
      h.current && (c({
        action: s.moveLine,
        args: {
          point1coords: u.current[0],
          point2coords: u.current[1]
        }
      }), h.current = !1);
    }), i.on("down", function(r) {
      h.current = !1, y.current = [r.x, r.y], k.current = [
        [...i.point1.coords.scrCoords],
        [...i.point2.coords.scrCoords]
      ], w.current = !0, O.current = !1, P.current || c({
        action: s.lineFocused,
        args: { name: v }
        // send name so get original name if adapted
      });
    }), i.on("hit", function(r) {
      h.current = !1, k.current = [
        [...i.point1.coords.scrCoords],
        [...i.point2.coords.scrCoords]
      ], c({
        action: s.lineFocused,
        args: { name: v }
        // send name so get original name if adapted
      });
    }), i.on("keydown", function(r) {
      r.key === "Enter" && (h.current && (c({
        action: s.moveLine,
        args: {
          point1coords: u.current[0],
          point2coords: u.current[1]
        }
      }), h.current = !1), F.current ? (c({
        action: s.switchLine
      }), c({
        action: s.lineClicked,
        args: { name: v }
        // send name so get original name if adapted
      })) : c({
        action: s.lineClicked,
        args: { name: v }
        // send name so get original name if adapted
      }));
    }), R.current = e.labelForGraph !== "", t.current = i;
  }
  function G(d) {
    w.current && (Math.abs(d.x - y.current[0]) > 0.1 || Math.abs(d.y - y.current[1]) > 0.1) && (O.current = !0);
  }
  function j() {
    t.current.off("drag"), t.current.off("down"), t.current.off("hit"), t.current.off("up"), t.current.off("keyfocusout"), t.current.off("keydown"), a.removeObject(t.current), t.current = {};
  }
  if (a) {
    if (Object.keys(t.current).length === 0)
      Y();
    else if (((J = e.numericalPoints) == null ? void 0 : J.length) !== 2 || e.numericalPoints.some((d) => d.length !== 2))
      j();
    else {
      let d = !0;
      for (let n of [e.numericalPoints[0], e.numericalPoints[1]])
        Number.isFinite(n[0]) || (d = !1), Number.isFinite(n[1]) || (d = !1);
      t.current.point1.coords.setCoordinates(
        JXG.COORDS_BY_USER,
        e.numericalPoints[0]
      ), t.current.point2.coords.setCoordinates(
        JXG.COORDS_BY_USER,
        e.numericalPoints[1]
      );
      let b = !e.hidden;
      if (d) {
        let n = t.current.visProp.visible !== b;
        t.current.visProp.visible = b, t.current.visPropCalc.visible = b, n && t.current.setAttribute({ visible: b });
      } else
        t.current.visProp.visible = !1, t.current.visPropCalc.visible = !1;
      t.current.visProp.fixed = P.current, t.current.visProp.highlight = !x.current, t.current.isDraggable = !x.current;
      let f = 10 * e.layer + E;
      t.current.visProp.layer !== f && t.current.setAttribute({ layer: f });
      let i = M === "dark" ? e.selectedStyle.lineColorDarkMode : e.selectedStyle.lineColor;
      t.current.visProp.strokecolor !== i && (t.current.visProp.strokecolor = i, t.current.visProp.highlightstrokecolor = i), t.current.visProp.strokewidth !== e.selectedStyle.lineWidth && (t.current.visProp.strokewidth = e.selectedStyle.lineWidth, t.current.visProp.highlightstrokewidth = e.selectedStyle.lineWidth), t.current.visProp.strokeopacity !== e.selectedStyle.lineOpacity && (t.current.visProp.strokeopacity = e.selectedStyle.lineOpacity, t.current.visProp.highlightstrokeopacity = e.selectedStyle.lineOpacity * 0.5);
      let C = W(e.selectedStyle.lineStyle, e.dashed);
      t.current.visProp.dash !== C && (t.current.visProp.dash = C), t.current.name = e.labelForGraph;
      let r = e.labelForGraph !== "";
      if (r != R.current && (t.current.setAttribute({ withlabel: r }), R.current = r), t.current.needsUpdate = !0, t.current.update(), t.current.hasLabel)
        if (t.current.label.needsUpdate = !0, e.applyStyleToLabel ? t.current.label.visProp.strokecolor = i : t.current.label.visProp.strokecolor = "var(--canvastext)", e.labelPosition !== _.current) {
          let n, o, p;
          e.labelPosition === "upperright" ? (p = [5, 5], n = "left", o = "bottom") : e.labelPosition === "upperleft" ? (p = [-5, 5], n = "right", o = "bottom") : e.labelPosition === "lowerright" ? (p = [5, -5], n = "left", o = "top") : (p = [-5, -5], n = "right", o = "top"), t.current.label.visProp.anchorx = n, t.current.label.visProp.anchory = o, t.current.label.visProp.offset = p, _.current = e.labelPosition, t.current.label.fullUpdate();
        } else
          t.current.label.update();
      a.updateRenderer();
    }
    return /* @__PURE__ */ g.jsx(g.Fragment, { children: /* @__PURE__ */ g.jsx("a", { name: L }) });
  }
  if (e.hidden)
    return null;
  let U = "\\(" + e.latex + "\\)", B = q(M, e.selectedStyle);
  return /* @__PURE__ */ g.jsxs(g.Fragment, { children: [
    /* @__PURE__ */ g.jsx("a", { name: L }),
    /* @__PURE__ */ g.jsx("span", { id: L, style: B, children: /* @__PURE__ */ g.jsx(z, { hideUntilTypeset: "first", inline: !0, dynamic: !0, children: U }) })
  ] });
});
function W(m, S) {
  return m === "dashed" || S ? 2 : m === "solid" ? 0 : m === "dotted" ? 1 : 0;
}
export {
  oe as default
};
