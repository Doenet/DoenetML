import { u as Z, d as $, e as ee, j as X } from "./index-dce15b2c.js";
import re, { useContext as te, useRef as f, useEffect as B } from "react";
import { BoardContext as oe, LINE_LAYER_OFFSET as F, VERTEX_LAYER_OFFSET as N } from "./graph-b13204d4.js";
const ce = re.memo(function P(q) {
  let { name: g, id: K, SVs: e, actions: p, sourceOfUpdate: L, callAction: y } = Z(q);
  P.ignoreActionsWithoutCore = () => !0;
  const c = te(oe);
  let r = f(null), h = f(null), v = f(null), w = f(null), m = f(null), R = f(null), E = f(!1), _ = f(!1), b = f(null), C = f(null), A = f(null), k = f(!1), S = f(!1), O = f(!1);
  A.current = e.numericalVertices, k.current = e.fixed, S.current = !e.draggable || e.fixLocation || e.fixed, O.current = !e.verticesDraggable || e.fixed || e.fixLocation;
  const V = $(ee);
  B(() => () => {
    r.current && U(), c && c.off("move", G);
  }, []), B(() => {
    c && c.on("move", G);
  }, [c]);
  function Q() {
    if (!(e.numVertices >= 2))
      return null;
    let t = V === "dark" ? e.selectedStyle.lineColorDarkMode : e.selectedStyle.lineColor, l = V === "dark" ? e.selectedStyle.fillColorDarkMode : e.selectedStyle.fillColor;
    l = e.filled ? l : "none", C.current = {
      fillColor: "none",
      strokeColor: "none",
      highlightStrokeColor: "none",
      highlightFillColor: getComputedStyle(
        document.documentElement
      ).getPropertyValue("--mainGray"),
      visible: !O.current && !e.hidden,
      withLabel: !1,
      layer: 10 * e.layer + N,
      highlight: !0
    };
    let n = {
      highlight: !1,
      visible: !e.hidden,
      layer: 10 * e.layer + F,
      fixed: !0,
      strokeColor: t,
      strokeOpacity: e.selectedStyle.lineOpacity,
      highlightStrokeColor: t,
      highlightStrokeOpacity: e.selectedStyle.lineOpacity * 0.5,
      strokeWidth: e.selectedStyle.lineWidth,
      highlightStrokeWidth: e.selectedStyle.lineWidth,
      dash: z(e.selectedStyle.lineStyle)
    }, i = {
      name: e.labelForGraph,
      visible: !e.hidden,
      withLabel: e.labelForGraph !== "",
      fixed: k.current,
      layer: 10 * e.layer + F,
      //specific to polygon
      fillColor: l,
      fillOpacity: e.selectedStyle.fillOpacity,
      highlightFillColor: l,
      highlightFillOpacity: e.selectedStyle.fillOpacity * 0.5,
      highlight: !S.current,
      vertices: C.current,
      borders: n
    };
    i.label = {
      highlight: !1
    }, e.labelHasLatex && (i.label.useMathJax = !0), e.applyStyleToLabel ? i.label.strokeColor = t : i.label.strokeColor = "var(--canvastext)", e.filled && (i.hasInnerPoints = !0), c.suspendUpdate();
    let u = [];
    for (let d of e.numericalVertices)
      u.push(c.create("point", [...d], C.current));
    let a = c.create("polygon", u, i);
    return a.isDraggable = !S.current, M(a), a.on("drag", (d) => I(-1, d)), a.on("up", (d) => H(-1)), a.on("keyfocusout", (d) => J(-1)), a.on("keydown", (d) => W(-1, d)), a.on("down", (d) => j(-1, d)), a.on("hit", (d) => Y()), c.unsuspendUpdate(), b.current = e.numVertices, a;
  }
  function G(t) {
    E.current && (Math.abs(t.x - m.current[0]) > 0.1 || Math.abs(t.y - m.current[1]) > 0.1) && (_.current = !0);
  }
  function M(t) {
    for (let l = 0; l < e.numVertices; l++) {
      let n = t.vertices[l];
      n.off("drag"), n.on("drag", (i) => I(l, i)), n.off("up"), n.on("up", () => H(l)), n.off("keyfocusout"), n.on("keyfocusout", () => J(l)), n.off("keydown"), n.on("keydown", (i) => W(l, i)), n.off("down"), n.on("down", (i) => j(l, i)), n.off("hit"), n.on("hit", (i) => Y());
    }
  }
  function U() {
    for (let t = 0; t < e.numVertices; t++) {
      let l = r.current.vertices[t];
      l && (l.off("drag"), l.off("up"), l.off("down"), l.off("hit"));
    }
    r.current.off("drag"), r.current.off("up"), r.current.off("down"), r.current.off("hit"), c.removeObject(r.current), r.current = null;
  }
  function I(t, l) {
    let n = l.type === "pointermove";
    if (!n || Math.abs(l.x - m.current[0]) > 0.1 || Math.abs(l.y - m.current[1]) > 0.1)
      if (v.current = t, t === -1) {
        h.current = [];
        var i = c.origin.scrCoords;
        for (let u = 0; u < r.current.vertices.length - 1; u++)
          if (n) {
            let a = (R.current[u][1] + l.x - m.current[0] - i[1]) / c.unitX, d = (i[2] - (R.current[u][2] + l.y - m.current[1])) / c.unitY;
            h.current.push([a, d]);
          } else {
            let a = r.current.vertices[u];
            h.current.push([a.X(), a.Y()]);
          }
        y({
          action: p.movePolygon,
          args: {
            pointCoords: h.current,
            transient: n,
            skippable: n
          }
        });
        for (let u = 0; u < e.numVertices; u++)
          r.current.vertices[u].coords.setCoordinates(
            JXG.COORDS_BY_USER,
            [...A.current[u]]
          );
      } else
        h.current = {}, h.current[t] = [
          r.current.vertices[t].X(),
          r.current.vertices[t].Y()
        ], y({
          action: p.movePolygon,
          args: {
            pointCoords: h.current,
            transient: n,
            skippable: n,
            sourceDetails: { vertex: t }
          }
        }), r.current.vertices[t].coords.setCoordinates(
          JXG.COORDS_BY_USER,
          [...A.current[t]]
        ), c.updateInfobox(r.current.vertices[t]);
  }
  function j(t, l) {
    v.current = null, m.current = [l.x, l.y], t === -1 ? (w.current === null && !k.current && y({
      action: p.polygonFocused,
      args: { name: g }
      // send name so get original name if adapted
    }), R.current = r.current.vertices.map((n) => [
      ...n.coords.scrCoords
    ])) : (O.current || y({
      action: p.polygonFocused,
      args: { name: g }
      // send name so get original name if adapted
    }), w.current = t), E.current = !0, _.current = !1;
  }
  function Y() {
    v.current = null, y({
      action: p.polygonFocused,
      args: { name: g }
      // send name so get original name if adapted
    });
  }
  function H(t) {
    v.current === t ? y(t === -1 ? {
      action: p.movePolygon,
      args: {
        pointCoords: h.current
      }
    } : {
      action: p.movePolygon,
      args: {
        pointCoords: h.current,
        sourceDetails: { vertex: t }
      }
    }) : !_.current && (w.current === null || t !== -1) && !k.current && y({
      action: p.polygonClicked,
      args: { name: g }
      // send name so get original name if adapted
    }), t !== -1 && (w.current = null), E.current = !1;
  }
  function J(t) {
    v.current === t && y(t === -1 ? {
      action: p.movePolygon,
      args: {
        pointCoords: h.current
      }
    } : {
      action: p.movePolygon,
      args: {
        pointCoords: h.current,
        sourceInformation: { vertex: t }
      }
    }), v.current = null;
  }
  function W(t, l) {
    l.key === "Enter" && (v.current === t && y(t === -1 ? {
      action: p.movePolygon,
      args: {
        pointCoords: h.current
      }
    } : {
      action: p.movePolygon,
      args: {
        pointCoords: h.current,
        sourceInformation: { vertex: t }
      }
    }), v.current = null, y({
      action: p.polygonClicked,
      args: { name: g }
      // send name so get original name if adapted
    }));
  }
  if (c)
    if (!r.current)
      r.current = Q();
    else if (!(e.numVertices >= 2))
      U();
    else {
      let t = !0;
      for (let o of e.numericalVertices)
        Number.isFinite(o[0]) || (t = !1), Number.isFinite(o[1]) || (t = !1);
      if (e.numVertices > b.current) {
        for (let o = b.current; o < e.numVertices; o++) {
          let s = c.create(
            "point",
            [...e.numericalVertices[o]],
            C.current
          );
          r.current.addPoints(s);
        }
        M(r.current);
      } else if (e.numVertices < b.current) {
        for (let o = b.current - 1; o >= e.numVertices; o--)
          r.current.vertices[o].off("drag"), r.current.vertices[o].off("down"), r.current.vertices[o].off("hit"), r.current.vertices[o].off("up"), r.current.vertices[o].off("keyfocusout"), r.current.vertices[o].off("keydown"), r.current.removePoints(r.current.vertices[o]);
        M(r.current);
      }
      let l = !O.current && !e.hidden;
      for (let o = 0; o < e.numVertices; o++)
        r.current.vertices[o].coords.setCoordinates(
          JXG.COORDS_BY_USER,
          [...e.numericalVertices[o]]
        ), r.current.vertices[o].needsUpdate = !0, r.current.vertices[o].update(), r.current.vertices[o].visProp.visible = l, r.current.vertices[o].visPropCalc.visible = l;
      if (L.sourceInformation && g in L.sourceInformation) {
        let o = L.sourceInformation[g].vertex;
        o !== void 0 && c.updateInfobox(r.current.vertices[o]);
      }
      let n = !e.hidden;
      t || (n = !1), r.current.visProp.fixed = k.current, r.current.visProp.highlight = !S.current, r.current.isDraggable = !S.current, r.current.visProp.visible = n, r.current.visPropCalc.visible = n;
      let i = 10 * e.layer + F, u = r.current.visProp.layer !== i, a, d;
      u && (a = 10 * e.layer + F, d = 10 * e.layer + N, r.current.setAttribute({ layer: i }));
      let D = V === "dark" ? e.selectedStyle.lineColorDarkMode : e.selectedStyle.lineColor, x = V === "dark" ? e.selectedStyle.fillColorDarkMode : e.selectedStyle.fillColor;
      x = e.filled ? x : "none", r.current.name = e.labelForGraph, r.current.hasLabel && (e.applyStyleToLabel ? r.current.label.visProp.strokecolor = D : r.current.label.visProp.strokecolor = "var(--canvastext)", r.current.label.needsUpdate = !0, r.current.label.update()), r.current.visProp.fillcolor !== x && (r.current.visProp.fillcolor = x, r.current.visProp.highlightfillcolor = x, r.current.visProp.hasinnerpoints = e.filled), r.current.visProp.fillopacity !== e.selectedStyle.fillOpacity && (r.current.visProp.fillopacity = e.selectedStyle.fillOpacity, r.current.visProp.highlightfillopacity = e.selectedStyle.fillOpacity * 0.5), r.current.needsUpdate = !0, r.current.update().updateVisibility();
      for (let o = 0; o < r.current.borders.length; o++) {
        let s = r.current.borders[o];
        s.visProp.visible = n, s.visPropCalc.visible = n, u && s.setAttribute({ layer: a }), s.visProp.strokecolor !== D && (s.visProp.strokecolor = D, s.visProp.highlightstrokecolor = D), s.visProp.strokeopacity !== e.selectedStyle.lineOpacity && (s.visProp.strokeopacity = e.selectedStyle.lineOpacity, s.visProp.highlightstrokeopacity = e.selectedStyle.lineOpacity * 0.5);
        let T = z(e.selectedStyle.lineStyle);
        s.visProp.dash !== T && (s.visProp.dash = T), s.visProp.strokewidth !== e.selectedStyle.lineWidth && (s.visProp.strokewidth = e.selectedStyle.lineWidth, s.visProp.highlightstrokewidth = e.selectedStyle.lineWidth), s.needsUpdate = !0, s.update();
      }
      if (u) {
        C.current.layer = d;
        for (let o of r.current.vertices)
          o.setAttribute({ layer: d }), o.needsUpdate = !0, o.update();
      }
      b.current = e.numVertices, c.updateRenderer();
    }
  return e.hidden ? null : /* @__PURE__ */ X.jsx(X.Fragment, { children: /* @__PURE__ */ X.jsx("a", { name: K }) });
});
function z(P) {
  return P === "solid" ? 0 : P === "dashed" ? 2 : P === "dotted" ? 1 : 0;
}
export {
  ce as default
};
