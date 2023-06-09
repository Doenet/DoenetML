import { u as N, h as V, j as F } from "./index-7c50cb13.js";
import L, { useContext as U, useRef as m, useEffect as Y } from "react";
import { BoardContext as W, LINE_LAYER_OFFSET as _, VERTEX_LAYER_OFFSET as B } from "./graph-5fa84fc4.js";
const q = L.memo(function b(D) {
  let { name: $, id: G, SVs: e, actions: k, sourceOfUpdate: S, callAction: x } = N(D);
  b.ignoreActionsWithoutCore = () => !0;
  const u = U(W);
  let g = m(null), w = m(null), i = m(null), t = m(null), v = m(null), a = m(null), y = m(null), f = m(null), O = m(null);
  O.current = e.numericalVertices, Y(() => () => {
    i.current && J();
  }, []);
  function I() {
    let n = {
      visible: !e.hidden,
      withLabel: !1,
      fixed: !0,
      layer: 10 * e.layer + _,
      strokeColor: "green",
      highlightStrokeColor: "green",
      strokeWidth: 3,
      dash: E("solid")
    }, d = V(e.fDefinition);
    g.current = u.create("functiongraph", [d], n);
    let h = {
      visible: !e.hidden,
      withLabel: !1,
      fixed: !0,
      layer: 10 * e.layer + _,
      strokeColor: "gray",
      highlightStrokeColor: "gray",
      strokeWidth: 2,
      dash: E("solid")
    };
    w.current = u.create(
      "line",
      [
        [0, 0],
        [1, 1]
      ],
      h
    );
    let P = !0;
    for (let o of e.numericalVertices)
      Number.isFinite(o[0]) || (P = !1), Number.isFinite(o[1]) || (P = !1);
    let C = {
      name: e.labelForGraph,
      visible: !e.hidden && P,
      withLabel: e.labelForGraph !== "",
      fixed: !0,
      layer: 10 * e.layer + _,
      strokeColor: e.selectedStyle.lineColor,
      highlightStrokeColor: e.selectedStyle.lineColor,
      strokeWidth: e.selectedStyle.lineWidth,
      highlightStrokeWidth: e.selectedStyle.lineWidth,
      dash: E(e.selectedStyle.lineStyle)
    };
    C.label = {
      highlight: !1
    }, e.labelHasLatex && (C.label.useMathJax = !0), f.current = {
      fixed: !e.draggable || e.fixed,
      visible: !e.hidden && P && e.draggable,
      withLabel: !0,
      name: "A",
      layer: 10 * e.layer + B,
      fillColor: e.selectedStyle.markerColor,
      strokeColor: e.selectedStyle.markerColor,
      size: e.selectedStyle.markerSize,
      face: H(e.selectedStyle.markerStyle)
    }, e.draggable ? (f.current.highlightFillColor = "#EEEEEE", f.current.highlightStrokeColor = "#C3D9FF", f.current.showInfoBox = !0) : (f.current.highlightFillColor = e.selectedStyle.markerColor, f.current.highlightStrokeColor = e.selectedStyle.markerColor, f.current.showInfoBox = !1), t.current = [];
    let c = e.variable.toString();
    for (let o = 0; o < e.numPoints; o++) {
      let s = Object.assign({}, f.current);
      o === 0 ? s.name = `(${c}_0,0)` : o % 2 === 1 ? s.name = `(${c}_${(o - 1) / 2}, ${c}_${(o + 1) / 2})` : s.name = `(${c}_${o / 2}, ${c}_${o / 2})`, o !== e.numPoints - 1 && (s.visible = !1), t.current.push(
        u.create("point", [...e.numericalVertices[o]], s)
      );
    }
    let r = [], l = [];
    e.numericalVertices.forEach((o) => {
      r.push(o[0]), l.push(o[1]);
    });
    let p = u.create("curve", [r, l], C);
    for (let o = 0; o < e.numPoints; o++)
      t.current[o].on("drag", (s) => X(o, s)), t.current[o].on("up", (s) => j(o)), t.current[o].on("keyfocusout", () => A(o)), t.current[o].on("keydown", (s) => R(o, s)), t.current[o].on("down", (s) => a.current = null);
    return y.current = e.numPoints, p;
  }
  function J() {
    u.removeObject(i.current), i.current = null, u.removeObject(g.current), g.current = null, u.removeObject(w.current), w.current = null;
    for (let n = 0; n < e.numPoints; n++)
      t.current[n] && (t.current[n].off("drag"), t.current[n].off("up"), t.current[n].off("keyfocusout"), t.current[n].off("keydown"), t.current[n].off("down"), u.removeObject(t.current[n]), delete t.current[n]);
  }
  function X(n, d) {
    d.type, a.current = n, v.current = {}, v.current[n] = [
      t.current[n].X(),
      t.current[n].Y()
    ], x({
      action: k.movePolyline,
      args: {
        pointCoords: v.current,
        transient: !0,
        skippable: !0,
        sourceDetails: { vertex: n }
      }
    }), t.current[n].coords.setCoordinates(JXG.COORDS_BY_USER, [
      ...O.current[n]
    ]), u.updateInfobox(t.current[n]);
  }
  function j(n) {
    a.current === n && x({
      action: k.movePolyline,
      args: {
        pointCoords: v.current,
        sourceDetails: { vertex: n }
      }
    });
  }
  function A(n) {
    if (a.current !== n) {
      a.current = null;
      return;
    }
    a.current = null, x({
      action: k.movePolyline,
      args: {
        pointCoords: v.current,
        sourceInformation: { vertex: n }
      }
    });
  }
  function R(n, d) {
    d.key === "Enter" && (a.current === n && x({
      action: k.movePolyline,
      args: {
        pointCoords: v.current,
        sourceInformation: { vertex: n }
      }
    }), a.current = null);
  }
  if (u)
    if (!i.current)
      i.current = I();
    else {
      let n = V(e.fDefinition);
      g.current.Y = n, g.current.needsUpdate = !0, g.current.updateCurve();
      let d = !0;
      for (let r of e.numericalVertices)
        Number.isFinite(r[0]) || (d = !1), Number.isFinite(r[1]) || (d = !1);
      let h = e.variable.toString();
      if (e.numPoints > y.current)
        for (let r = y.current; r < e.numPoints; r++) {
          let l = Object.assign({}, f.current);
          r === 0 ? l.name = `(${h}_0,0)` : r % 2 === 1 ? l.name = `(${h}_${(r - 1) / 2}, ${h}_${(r + 1) / 2})` : l.name = `(${h}_${r / 2}, ${h}_${r / 2})`, r !== e.numPoints - 1 && (l.visible = !1), t.current.push(
            u.create(
              "point",
              [...e.numericalVertices[r]],
              l
            )
          ), t.current[r].on("drag", (p) => X(r, p)), t.current[r].on("up", (p) => j(r)), t.current[r].on("keyfocusout", () => A(r)), t.current[r].on("keydown", (p) => R(r, p)), t.current[r].on("down", (p) => a.current = null);
        }
      else if (e.numPoints < y.current) {
        for (let r = e.numPoints; r < y.current; r++) {
          let l = t.current.pop();
          l.off("drag"), l.off("up"), l.off("keyfocusout"), l.off("keydown"), l.off("down"), console.log("about to remove", l), u.removeObject(l), u.update();
        }
        i.current.dataX.length = e.numPoints;
      }
      y.current = e.numPoints;
      let P = i.current.transformMat[1][0], C = i.current.transformMat[2][0];
      for (let r = 0; r < e.numPoints; r++)
        t.current[r].coords.setCoordinates(JXG.COORDS_BY_USER, [
          ...e.numericalVertices[r]
        ]), i.current.dataX[r] = e.numericalVertices[r][0] - P, i.current.dataY[r] = e.numericalVertices[r][1] - C;
      let c = !e.hidden;
      if (d) {
        i.current.visProp.visible = c, i.current.visPropCalc.visible = c;
        for (let r = 0; r < e.numPoints - 1; r++)
          t.current[r].visProp.visible = !1, t.current[r].visPropCalc.visible = !1;
        e.numPoints > 0 && e.draggable && (t.current[e.numPoints - 1].visProp.visible = c, t.current[e.numPoints - 1].visPropCalc.visible = c);
      } else {
        i.current.visProp.visible = !1, i.current.visPropCalc.visible = !1;
        for (let r = 0; r < e.numPoints; r++)
          t.current[r].visProp.visible = !1, t.current[r].visPropCalc.visible = !1;
      }
      if (S.sourceInformation && $ in S.sourceInformation) {
        let r = S.sourceInformation[$].vertex;
        Number.isFinite(r) && u.updateInfobox(t.current[r]);
      }
      i.current.needsUpdate = !0, i.current.update().updateVisibility();
      for (let r = 0; r < e.numPoints; r++)
        t.current[r].needsUpdate = !0, t.current[r].update();
      e.numPoints > 0 && (t.current[e.numPoints - 1].setAttribute({ withlabel: !0 }), t.current[e.numPoints - 1].label.needsUpdate = !0, t.current[e.numPoints - 1].label.update()), u.updateRenderer();
    }
  return e.hidden ? null : /* @__PURE__ */ F.jsx(F.Fragment, { children: /* @__PURE__ */ F.jsx("a", { name: G }) });
});
function E(b) {
  return b === "solid" ? 0 : b === "dashed" ? 2 : b === "dotted" ? 1 : 0;
}
function H(b) {
  return b === "triangle" ? "triangleup" : b;
}
export {
  q as default
};
