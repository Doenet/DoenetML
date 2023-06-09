import { u as re, d as te, e as ne, j as P, t as oe, M as ce } from "./index-dce15b2c.js";
import ie, { useContext as le, useRef as s, useEffect as H } from "react";
import { BoardContext as ue, LINE_LAYER_OFFSET as N, VERTEX_LAYER_OFFSET as z } from "./graph-b13204d4.js";
const fe = ie.memo(function F(K) {
  let { name: h, id: L, SVs: e, actions: c, sourceOfUpdate: _, callAction: i } = re(K);
  F.ignoreActionsWithoutCore = () => !0;
  const l = le(ue);
  let r = s({}), d = s({}), f = s({}), b = s(null), J = s(null), w = s(!1), E = s(!1), n = s(!1), o = s(!1), j = s(null), m = s(null), k = s(null), U = s(null), M = s(null), O = s(!1), X = s(!1), R = s(!0), G = s(!0);
  M.current = e.numericalEndpoints, O.current = e.fixed, X.current = !e.draggable || e.fixLocation || e.fixed, G.current = e.tailDraggable && !e.fixed && !e.fixLocation, R.current = e.headDraggable && !e.fixed && !e.fixLocation;
  const Y = te(ne);
  H(() => () => {
    Object.keys(r.current).length !== 0 && B(), l && l.off("move", W);
  }, []), H(() => {
    l && l.on("move", W);
  }, [l]);
  function Q() {
    if (e.numericalEndpoints.length !== 2 || e.numericalEndpoints.some((t) => t.length !== 2)) {
      r.current = {}, d.current = {}, f.current = {};
      return;
    }
    let u = 10 * e.layer + N, a = 10 * e.layer + z, x = Y === "dark" ? e.selectedStyle.lineColorDarkMode : e.selectedStyle.lineColor;
    var p = {
      name: e.labelForGraph,
      visible: !e.hidden,
      withLabel: e.labelForGraph !== "",
      fixed: O.current,
      layer: u,
      strokeColor: x,
      strokeOpacity: e.selectedStyle.lineOpacity,
      highlightStrokeColor: x,
      highlightStrokeOpacity: e.selectedStyle.lineOpacity * 0.5,
      strokeWidth: e.selectedStyle.lineWidth,
      highlightStrokeWidth: e.selectedStyle.lineWidth,
      dash: q(e.selectedStyle.lineStyle),
      highlight: !X.current,
      lastArrow: { type: 1, size: 3, highlightSize: 3 }
    };
    let D = [
      [...e.numericalEndpoints[0]],
      [...e.numericalEndpoints[1]]
    ], V = Object.assign({}, p);
    Object.assign(V, {
      withLabel: !1,
      fixed: !1,
      highlight: !0,
      fillColor: "none",
      strokeColor: "none",
      highlightStrokeColor: "none",
      highlightFillColor: getComputedStyle(
        document.documentElement
      ).getPropertyValue("--mainGray"),
      layer: a
    });
    let C = Object.assign({}, V), A = G.current && !e.hidden;
    C.visible = A;
    let g = l.create("point", D[0], C), v = Object.assign({}, V), ee = R.current && !e.hidden;
    v.visible = ee;
    let S = l.create("point", D[1], v);
    p.label = {
      highlight: !1
    }, e.labelHasLatex && (p.label.useMathJax = !0), e.applyStyleToLabel ? p.label.strokeColor = x : p.label.strokeColor = "var(--canvastext)";
    let y = l.create(
      "arrow",
      [g, S],
      p
    );
    y.isDraggable = !X.current, g.on("drag", (t) => I(t, 0)), S.on("drag", (t) => I(t, 1)), y.on("drag", (t) => I(t, -1)), g.on("up", (t) => {
      !n.current && o.current ? i({
        action: c.moveVector,
        args: { tailcoords: k.current }
      }) : !E.current && !O.current && i({
        action: c.vectorClicked,
        args: { name: h }
        // send name so get original name if adapted
      }), j.current = null, w.current = !1;
    }), S.on("up", (t) => {
      n.current && !o.current ? i({
        action: c.moveVector,
        args: { headcoords: m.current }
      }) : !E.current && !O.current && i({
        action: c.vectorClicked,
        args: { name: h }
        // send name so get original name if adapted
      }), j.current = null, w.current = !1;
    }), y.on("up", (t) => {
      n.current && o.current ? i({
        action: c.moveVector,
        args: {
          headcoords: m.current,
          tailcoords: k.current
        }
      }) : !E.current && j.current === null && !O.current && i({
        action: c.vectorClicked,
        args: { name: h }
        // send name so get original name if adapted
      }), w.current = !1;
    }), g.on("keyfocusout", (t) => {
      !n.current && o.current && i({
        action: c.moveVector,
        args: { tailcoords: k.current }
      }), n.current = !1, o.current = !1;
    }), S.on("keyfocusout", (t) => {
      n.current && !o.current && i({
        action: c.moveVector,
        args: { headcoords: m.current }
      }), n.current = !1, o.current = !1;
    }), y.on("keyfocusout", (t) => {
      n.current && o.current && i({
        action: c.moveVector,
        args: {
          headcoords: m.current,
          tailcoords: k.current
        }
      }), n.current = !1, o.current = !1;
    }), g.on("down", function(t) {
      n.current = !1, o.current = !1, b.current = [t.x, t.y], j.current = 1, w.current = !0, E.current = !1, G.current && i({
        action: c.vectorFocused,
        args: { name: h }
        // send name so get original name if adapted
      });
    }), g.on("hit", function(t) {
      n.current = !1, o.current = !1, i({
        action: c.vectorFocused,
        args: { name: h }
        // send name so get original name if adapted
      });
    }), S.on("down", function(t) {
      n.current = !1, o.current = !1, b.current = [t.x, t.y], j.current = 2, w.current = !0, E.current = !1, R.current && i({
        action: c.vectorFocused,
        args: { name: h }
        // send name so get original name if adapted
      });
    }), S.on("hit", function(t) {
      n.current = !1, o.current = !1, i({
        action: c.vectorFocused,
        args: { name: h }
        // send name so get original name if adapted
      });
    }), y.on("down", function(t) {
      n.current = !1, o.current = !1, b.current = [t.x, t.y], J.current = [
        [...y.point1.coords.scrCoords],
        [...y.point2.coords.scrCoords]
      ], w.current = !0, E.current = !1, O.current || i({
        action: c.vectorFocused,
        args: { name: h }
        // send name so get original name if adapted
      });
    }), y.on("hit", function(t) {
      n.current = !1, o.current = !1, i({
        action: c.vectorFocused,
        args: { name: h }
        // send name so get original name if adapted
      });
    }), g.on("keydown", (t) => {
      t.key === "Enter" && (!n.current && o.current && i({
        action: c.moveVector,
        args: { tailcoords: k.current }
      }), n.current = !1, o.current = !1, i({
        action: c.vectorClicked,
        args: { name: h }
        // send name so get original name if adapted
      }));
    }), S.on("keydown", (t) => {
      t.key === "Enter" && (n.current && !o.current && i({
        action: c.moveVector,
        args: { headcoords: m.current }
      }), n.current = !1, o.current = !1, i({
        action: c.vectorClicked,
        args: { name: h }
        // send name so get original name if adapted
      }));
    }), y.on("keydown", (t) => {
      t.key === "Enter" && (n.current && o.current && i({
        action: c.moveVector,
        args: {
          headcoords: m.current,
          tailcoords: k.current
        }
      }), n.current = !1, o.current = !1, i({
        action: c.vectorClicked,
        args: { name: h }
        // send name so get original name if adapted
      }));
    }), r.current = y, d.current = g, f.current = S;
  }
  function W(u) {
    w.current && (Math.abs(u.x - b.current[0]) > 0.1 || Math.abs(u.y - b.current[1]) > 0.1) && (E.current = !0);
  }
  function I(u, a) {
    if (!(u.type === "pointermove") || Math.abs(u.x - b.current[0]) > 0.1 || Math.abs(u.y - b.current[1]) > 0.1) {
      a === 0 ? o.current = !0 : a === 1 ? n.current = !0 : (n.current = !0, o.current = !0);
      let p = { transient: !0, skippable: !0 };
      n.current && (a === -1 ? m.current = T(u, 1) : m.current = [
        r.current.point2.X(),
        r.current.point2.Y()
      ], p.headcoords = m.current), o.current && (a === -1 ? k.current = T(u, 0) : k.current = [
        r.current.point1.X(),
        r.current.point1.Y()
      ], p.tailcoords = k.current), (a === 0 || a === 1) && (p.sourceDetails = { vertex: a }), i({
        action: c.moveVector,
        args: p
      }), r.current.point1.coords.setCoordinates(
        JXG.COORDS_BY_USER,
        M.current[0]
      ), r.current.point2.coords.setCoordinates(
        JXG.COORDS_BY_USER,
        M.current[1]
      ), a === 0 ? l.updateInfobox(d.current) : a === 1 && l.updateInfobox(f.current);
    }
  }
  function B() {
    r.current.off("drag"), r.current.off("down"), r.current.off("hit"), r.current.off("up"), r.current.off("keyfocusout"), r.current.off("keydown"), l.removeObject(r.current), r.current = {}, d.current.off("drag"), d.current.off("down"), d.current.off("hit"), d.current.off("up"), d.current.off("keyfocusout"), d.current.off("keydown"), l.removeObject(d.current), d.current = {}, f.current.off("drag"), f.current.off("down"), f.current.off("hit"), f.current.off("up"), f.current.off("keyfocusout"), f.current.off("keydown"), l.removeObject(f.current), f.current = {};
  }
  function T(u, a) {
    if (u.type === "pointermove") {
      var p = l.origin.scrCoords;
      let D = (J.current[a][1] + u.x - b.current[0] - p[1]) / l.unitX, V = (p[2] - (J.current[a][2] + u.y - b.current[1])) / l.unitY;
      return [D, V];
    } else
      return a == 0 ? [r.current.point1.X(), r.current.point1.Y()] : [r.current.point2.X(), r.current.point2.Y()];
  }
  if (l) {
    if (Object.keys(r.current).length === 0)
      Q();
    else if (e.numericalEndpoints.length !== 2 || e.numericalEndpoints.some((u) => u.length !== 2))
      B();
    else {
      let u = !0;
      for (let v of [
        e.numericalEndpoints[0],
        e.numericalEndpoints[1]
      ])
        Number.isFinite(v[0]) || (u = !1), Number.isFinite(v[1]) || (u = !1);
      r.current.point1.coords.setCoordinates(
        JXG.COORDS_BY_USER,
        e.numericalEndpoints[0]
      ), r.current.point2.coords.setCoordinates(
        JXG.COORDS_BY_USER,
        e.numericalEndpoints[1]
      );
      let a = !e.hidden && u, x = G.current && a, p = R.current && a;
      if (r.current.visProp.fixed = O.current, r.current.visProp.highlight = !X.current, r.current.isDraggable = !X.current, r.current.visProp.visible = a, r.current.visPropCalc.visible = a, d.current.visProp.visible = x, d.current.visPropCalc.visible = x, f.current.visProp.visible = p, f.current.visPropCalc.visible = p, _.sourceInformation && h in _.sourceInformation) {
        let v = _.sourceInformation[h];
        v.vertex === 0 ? l.updateInfobox(d.current) : v.vertex === 1 && l.updateInfobox(f.current);
      }
      let D = 10 * e.layer + N;
      if (r.current.visProp.layer !== D) {
        let v = 10 * e.layer + z;
        r.current.setAttribute({ layer: D }), d.current.setAttribute({ layer: v }), f.current.setAttribute({ layer: v });
      }
      let C = Y === "dark" ? e.selectedStyle.lineColorDarkMode : e.selectedStyle.lineColor;
      r.current.visProp.strokecolor !== C && (r.current.visProp.strokecolor = C, r.current.visProp.highlightstrokecolor = C), r.current.visProp.strokewidth !== e.selectedStyle.lineWidth && (r.current.visProp.strokewidth = e.selectedStyle.lineWidth, r.current.visProp.highlightstrokewidth = e.selectedStyle.lineWidth), r.current.visProp.strokeopacity !== e.selectedStyle.lineOpacity && (r.current.visProp.strokeopacity = e.selectedStyle.lineOpacity, r.current.visProp.highlightstrokeopacity = e.selectedStyle.lineOpacity * 0.5);
      let A = q(e.selectedStyle.lineStyle);
      r.current.visProp.dash !== A && (r.current.visProp.dash = A), r.current.name = e.labelForGraph;
      let g = e.labelForGraph !== "";
      g != U.current && (r.current.setAttribute({ withlabel: g }), U.current = g), r.current.needsUpdate = !0, r.current.update(), r.current.hasLabel && (e.applyStyleToLabel ? r.current.label.visProp.strokecolor = C : r.current.label.visProp.strokecolor = "var(--canvastext)", r.current.label.needsUpdate = !0, r.current.label.update()), d.current.needsUpdate = !0, d.current.update(), f.current.needsUpdate = !0, f.current.update(), l.updateRenderer();
    }
    return /* @__PURE__ */ P.jsx(P.Fragment, { children: /* @__PURE__ */ P.jsx("a", { name: L }) });
  }
  if (e.hidden)
    return null;
  let Z = "\\(" + e.latex + "\\)", $ = oe(Y, e.selectedStyle);
  return /* @__PURE__ */ P.jsxs(P.Fragment, { children: [
    /* @__PURE__ */ P.jsx("a", { name: L }),
    /* @__PURE__ */ P.jsx("span", { id: L, style: $, children: /* @__PURE__ */ P.jsx(ce, { hideUntilTypeset: "first", inline: !0, dynamic: !0, children: Z }) })
  ] });
});
function q(F) {
  return F === "solid" ? 0 : F === "dashed" ? 2 : F === "dotted" ? 1 : 0;
}
export {
  fe as default
};
