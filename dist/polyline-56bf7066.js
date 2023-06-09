import { u as Z, d as $, e as z, j as I } from "./index-8862516e.js";
import ee, { useContext as re, useRef as s, useEffect as U } from "react";
import { BoardContext as te, LINE_LAYER_OFFSET as W, VERTEX_LAYER_OFFSET as N } from "./graph-de465854.js";
import "react-dom";
import "styled-components";
import "./css-ab4d83ca.js";
const se = ee.memo(function x(q) {
  let { name: v, id: K, SVs: e, actions: f, sourceOfUpdate: D, callAction: d } = Z(q);
  x.ignoreActionsWithoutCore = () => !0;
  const c = re(te);
  let r = s(null), i = s(null), p = s(null), m = s(null), O = s(null), b = s(null), M = s(null), E = s(!1), R = s(!1), C = s(null), P = s(null), V = s(null), S = s(!1), w = s(!1), F = s(!1);
  V.current = e.numericalVertices, S.current = e.fixed, w.current = !e.draggable || e.fixLocation || e.fixed, F.current = !e.verticesDraggable || e.fixed || e.fixLocation;
  const J = $(z);
  U(() => () => {
    r.current && T(), c && c.off("move", H);
  }, []), U(() => {
    c && c.on("move", H);
  }, [c]);
  function Q() {
    if (e.numericalVertices.length !== e.numVertices || e.numericalVertices.some((t) => t.length !== 2))
      return null;
    let n = !0;
    for (let t of e.numericalVertices)
      Number.isFinite(t[0]) || (n = !1), Number.isFinite(t[1]) || (n = !1);
    let u = J === "dark" ? e.selectedStyle.lineColorDarkMode : e.selectedStyle.lineColor, a = {
      name: e.labelForGraph,
      visible: !e.hidden && n,
      withLabel: e.labelForGraph !== "",
      layer: 10 * e.layer + W,
      fixed: S.current,
      strokeColor: u,
      strokeOpacity: e.selectedStyle.lineOpacity,
      highlightStrokeColor: u,
      highlightStrokeOpacity: e.selectedStyle.lineOpacity * 0.5,
      strokeWidth: e.selectedStyle.lineWidth,
      highlightStrokeWidth: e.selectedStyle.lineWidth,
      dash: B(e.selectedStyle.lineStyle),
      highlight: !w.current,
      lineCap: "butt"
    };
    P.current = Object.assign({}, a), Object.assign(P.current, {
      fixed: !1,
      highlight: !0,
      withLabel: !1,
      fillColor: "none",
      strokeColor: "none",
      highlightStrokeColor: "none",
      highlightFillColor: getComputedStyle(
        document.documentElement
      ).getPropertyValue("--mainGray"),
      layer: 10 * e.layer + N
    }), (F.current || e.hidden || !n) && (P.current.visible = !1), a.label = {
      highlight: !1
    }, e.labelHasLatex && (a.label.useMathJax = !0), e.applyStyleToLabel ? a.label.strokeColor = u : a.label.strokeColor = "var(--canvastext)", i.current = [];
    for (let t = 0; t < e.numVertices; t++)
      i.current.push(
        c.create(
          "point",
          [...e.numericalVertices[t]],
          P.current
        )
      );
    let g = [], k = [];
    e.numericalVertices.forEach((t) => {
      g.push(t[0]), k.push(t[1]);
    });
    let h = c.create("curve", [g, k], a);
    h.isDraggable = !w.current;
    for (let t = 0; t < e.numVertices; t++)
      i.current[t].on("drag", (y) => L(t, y)), i.current[t].on("up", () => j(t)), i.current[t].on("keyfocusout", () => G(t)), i.current[t].on("keydown", (y) => A(t, y)), i.current[t].on("down", (y) => _(t, y)), i.current[t].on("hit", (y) => Y());
    return h.on("drag", (t) => L(-1, t)), h.on("up", () => j(-1)), h.on("keyfocusout", () => G(-1)), h.on("keydown", (t) => A(-1, t)), h.on("down", (t) => _(-1, t)), h.on("hit", (t) => Y()), C.current = e.numVertices, h;
  }
  function H(n) {
    E.current && (Math.abs(n.x - b.current[0]) > 0.1 || Math.abs(n.y - b.current[1]) > 0.1) && (R.current = !0);
  }
  function T() {
    r.current.off("drag"), r.current.off("down"), r.current.off("hit"), r.current.off("up"), r.current.off("keyfocusout"), r.current.off("keydown"), c.removeObject(r.current), r.current = null;
    for (let n = 0; n < e.numVertices; n++)
      i.current[n].off("drag"), i.current[n].off("down"), i.current[n].off("hit"), i.current[n].off("up"), i.current[n].off("keyfocusout"), i.current[n].off("keydown"), c.removeObject(i.current[n]), delete i.current[n];
  }
  function L(n, u) {
    let a = u.type === "pointermove";
    if (!a || Math.abs(u.x - b.current[0]) > 0.1 || Math.abs(u.y - b.current[1]) > 0.1)
      if (m.current = n, n === -1) {
        r.current.updateTransformMatrix();
        let k = r.current.transformMat[1][0], h = r.current.transformMat[2][0];
        var g = c.origin.scrCoords;
        p.current = [];
        for (let t = 0; t < r.current.points.length; t++)
          if (a) {
            let y = (M.current[t][1] + u.x - b.current[0] - g[1]) / c.unitX, X = (g[2] - (M.current[t][2] + u.y - b.current[1])) / c.unitY;
            p.current.push([y, X]);
          } else
            p.current.push([
              r.current.dataX[t] + k,
              r.current.dataY[t] + h
            ]);
        d({
          action: f.movePolyline,
          args: {
            pointCoords: p.current,
            transient: !0,
            skippable: !0
          }
        });
        for (let t = 0; t < e.numVertices; t++)
          i.current[t].coords.setCoordinates(JXG.COORDS_BY_USER, [
            ...V.current[t]
          ]), r.current.dataX[t] = V.current[t][0] - k, r.current.dataY[t] = V.current[t][1] - h;
      } else
        p.current = {}, p.current[n] = [
          i.current[n].X(),
          i.current[n].Y()
        ], d({
          action: f.movePolyline,
          args: {
            pointCoords: p.current,
            transient: !0,
            skippable: !0,
            sourceDetails: { vertex: n }
          }
        }), i.current[n].coords.setCoordinates(JXG.COORDS_BY_USER, [
          ...V.current[n]
        ]), c.updateInfobox(i.current[n]);
  }
  function _(n, u) {
    m.current = null, b.current = [u.x, u.y], n === -1 ? (O.current === null && !S.current && d({
      action: f.polylineFocused,
      args: { name: v }
      // send name so get original name if adapted
    }), M.current = r.current.points.map((a) => [
      ...a.scrCoords
    ])) : (F.current || d({
      action: f.polylineFocused,
      args: { name: v }
      // send name so get original name if adapted
    }), O.current = n), E.current = !0, R.current = !1;
  }
  function Y() {
    m.current = null, d({
      action: f.polylineFocused,
      args: { name: v }
      // send name so get original name if adapted
    });
  }
  function j(n) {
    m.current === n ? d(n === -1 ? {
      action: f.movePolyline,
      args: {
        pointCoords: p.current
      }
    } : {
      action: f.movePolyline,
      args: {
        pointCoords: p.current,
        sourceDetails: { vertex: n }
      }
    }) : !R.current && (O.current === null || n !== -1) && !S.current && d({
      action: f.polylineClicked,
      args: { name: v }
      // send name so get original name if adapted
    }), n !== -1 && (O.current = null), E.current = !1;
  }
  function G(n) {
    m.current === n && d(n === -1 ? {
      action: f.movePolyline,
      args: {
        pointCoords: p.current
      }
    } : {
      action: f.movePolyline,
      args: {
        pointCoords: p.current,
        sourceInformation: { vertex: n }
      }
    }), m.current = null;
  }
  function A(n, u) {
    u.key === "Enter" && (m.current === n && d(n === -1 ? {
      action: f.movePolyline,
      args: {
        pointCoords: p.current
      }
    } : {
      action: f.movePolyline,
      args: {
        pointCoords: p.current,
        sourceInformation: { vertex: n }
      }
    }), m.current = null, d({
      action: f.polylineClicked,
      args: { name: v }
      // send name so get original name if adapted
    }));
  }
  if (c)
    if (!r.current)
      r.current = Q();
    else if (e.numericalVertices.length !== e.numVertices || e.numericalVertices.some((n) => n.length !== 2))
      T();
    else {
      let n = !0;
      for (let o of e.numericalVertices)
        Number.isFinite(o[0]) || (n = !1), Number.isFinite(o[1]) || (n = !1);
      r.current.visProp.fixed = S.current, r.current.visProp.highlight = !w.current, r.current.isDraggable = !w.current;
      let u = 10 * e.layer + W, a = r.current.visProp.layer !== u, g = 10 * e.layer + N;
      if (a && (r.current.setAttribute({ layer: u }), P.current.layer = g), e.numVertices > C.current)
        for (let o = C.current; o < e.numVertices; o++)
          i.current.push(
            c.create(
              "point",
              [...e.numericalVertices[o]],
              P.current
            )
          ), r.current.dataX.length = e.numVertices, i.current[o].on("drag", (l) => L(o, l)), i.current[o].on("up", (l) => j(o)), i.current[o].on("down", (l) => _(o, l)), i.current[o].on("hit", (l) => Y()), i.current[o].on("keyfocusout", (l) => G(o)), i.current[o].on("keydown", (l) => A(o, l));
      else if (e.numVertices < C.current) {
        for (let o = e.numVertices; o < C.current; o++) {
          let l = i.current.pop();
          l.off("drag"), l.off("down"), l.off("hit"), l.off("up"), l.off("keyfocusout"), l.off("keydown"), c.removeObject(l);
        }
        r.current.dataX.length = e.numVertices;
      }
      C.current = e.numVertices, r.current.updateTransformMatrix();
      let k = r.current.transformMat[1][0], h = r.current.transformMat[2][0];
      for (let o = 0; o < e.numVertices; o++)
        i.current[o].coords.setCoordinates(JXG.COORDS_BY_USER, [
          ...e.numericalVertices[o]
        ]), r.current.dataX[o] = e.numericalVertices[o][0] - k, r.current.dataY[o] = e.numericalVertices[o][1] - h;
      let t = !e.hidden;
      if (n) {
        r.current.visProp.visible = t, r.current.visPropCalc.visible = t;
        let o = t && !F.current;
        for (let l = 0; l < e.numVertices; l++)
          i.current[l].visProp.visible = o, i.current[l].visPropCalc.visible = o;
      } else {
        r.current.visProp.visible = !1, r.current.visPropCalc.visible = !1;
        for (let o = 0; o < e.numVertices; o++)
          i.current[o].visProp.visible = !1, i.current[o].visPropCalc.visible = !1;
      }
      let y = J === "dark" ? e.selectedStyle.lineColorDarkMode : e.selectedStyle.lineColor;
      r.current.visProp.strokecolor !== y && (r.current.visProp.strokecolor = y, r.current.visProp.highlightstrokecolor = y), r.current.visProp.strokewidth !== e.selectedStyle.lineWidth && (r.current.visProp.strokewidth = e.selectedStyle.lineWidth, r.current.visProp.highlightstrokewidth = e.selectedStyle.lineWidth), r.current.visProp.strokeopacity !== e.selectedStyle.lineOpacity && (r.current.visProp.strokeopacity = e.selectedStyle.lineOpacity, r.current.visProp.highlightstrokeopacity = e.selectedStyle.lineOpacity * 0.5);
      let X = B(e.selectedStyle.lineStyle);
      if (r.current.visProp.dash !== X && (r.current.visProp.dash = X), r.current.name = e.labelForGraph, r.current.hasLabel && (e.applyStyleToLabel ? r.current.label.visProp.strokecolor = y : r.current.label.visProp.strokecolor = "var(--canvastext)", r.current.label.needsUpdate = !0, r.current.label.update()), D.sourceInformation && v in D.sourceInformation) {
        let o = D.sourceInformation[v].vertex;
        Number.isFinite(o) && c.updateInfobox(i.current[o]);
      }
      r.current.needsUpdate = !0, r.current.update().updateVisibility();
      for (let o = 0; o < e.numVertices; o++)
        a && i.current[o].setAttribute({ layer: g }), i.current[o].needsUpdate = !0, i.current[o].update();
      c.updateRenderer();
    }
  return e.hidden ? null : /* @__PURE__ */ I.jsx(I.Fragment, { children: /* @__PURE__ */ I.jsx("a", { name: K }) });
});
function B(x) {
  return x === "solid" ? 0 : x === "dashed" ? 2 : x === "dotted" ? 1 : 0;
}
export {
  se as default
};
