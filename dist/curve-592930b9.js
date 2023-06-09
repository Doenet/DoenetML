import { u as Oe, d as Me, e as Se, h as k, j as y } from "./index-64c78e6b.js";
import De, { useContext as Re, useRef as f, useEffect as ye } from "react";
import { BoardContext as Xe, LINE_LAYER_OFFSET as Ce, VERTEX_LAYER_OFFSET as Z, CONTROL_POINT_LAYER_OFFSET as xe } from "./graph-0deb1c0a.js";
import "react-dom";
import "styled-components";
import "./css-ab4d83ca.js";
const Ee = De.memo(function G($) {
  let { name: F, id: O, SVs: e, actions: m, sourceOfUpdate: Y, callAction: b } = Oe($);
  G.ignoreActionsWithoutCore = () => !0;
  const o = Re(Xe);
  let i = f(null), p = f(null), l = f(null), ee = f(null), _ = f(null), U = f(null), I = f(null), J = f(!1), W = f(!1), se = f(null), M = f(null), z = f(null), j = f(null), re = f(null), S = f(null), T = f(null), a = f([]), D = f(null), B = f(null), te = f(null), N = f(null), R = f(!1), X = f(!1), ne = f(!1), oe = f([]), E = f([]);
  R.current = e.fixed, X.current = !e.draggable || e.fixLocation || e.fixed, ne.current = e.switchable && !e.fixed, te.current = e.vectorControlDirections;
  let fe = f(null);
  fe.current = e.numericalThroughPoints;
  let de = f(null);
  de.current = e.numericalControlPoints;
  const he = Me(Se);
  ye(() => () => {
    i.current && ie(), o && o.off("move", ge);
  }, []), ye(() => {
    o && o.on("move", ge);
  }, [o]);
  function pe() {
    if (e.curveType === "bezier" && e.numericalThroughPoints.length < 2)
      return null;
    let r = he === "dark" ? e.selectedStyle.lineColorDarkMode : e.selectedStyle.lineColor;
    var t = {
      name: e.labelForGraph,
      visible: !e.hidden,
      withLabel: e.labelForGraph !== "",
      fixed: R.current,
      layer: 10 * e.layer + Ce,
      strokeColor: r,
      strokeOpacity: e.selectedStyle.lineOpacity,
      strokeWidth: e.selectedStyle.lineWidth,
      dash: we(e.selectedStyle.lineStyle, e.dashed),
      highlight: !1,
      lineCap: "butt"
    };
    if (e.labelForGraph !== "") {
      let u, s, h;
      e.labelPosition === "upperright" ? (h = "urt", s = [-5, -10], u = "right") : e.labelPosition === "upperleft" ? (h = "ulft", s = [5, -10], u = "left") : e.labelPosition === "lowerright" ? (h = "lrt", s = [-5, 10], u = "right") : e.labelPosition === "lowerleft" ? (h = "llft", s = [5, 10], u = "left") : e.labelPosition === "top" ? (h = "top", s = [0, -10], u = "left") : e.labelPosition === "bottom" ? (h = "bot", s = [0, 10], u = "left") : e.labelPosition === "left" ? (h = "lft", s = [10, 0], u = "left") : (h = "rt", s = [-10, 0], u = "right"), t.label = {
        offset: s,
        position: h,
        anchorx: u,
        highlight: !1
      }, e.labelHasLatex && (t.label.useMathJax = !0), e.applyStyleToLabel ? t.label.strokeColor = r : t.label.strokeColor = "var(canvastext)";
    } else
      t.label = {
        highlight: !1
      }, e.labelHasLatex && (t.label.useMathJax = !0);
    let g;
    if (e.curveType === "parameterization") {
      let u = k(e.fDefinitions[0]), s = k(e.fDefinitions[1]);
      g = o.create(
        "curve",
        [u, s, e.parMin, e.parMax],
        t
      );
    } else if (e.curveType === "bezier") {
      let u = k(e.fDefinitions[0]), s = k(e.fDefinitions[1]);
      g = o.create(
        "curve",
        [u, s, e.parMin, e.parMax],
        t
      );
    } else {
      let u = k(e.fDefinitions[0]);
      if (e.flipFunction) {
        let s = e.graphYmin, h = e.graphYmax, v = Math.max(s - (h - s) * 0.1, e.parMin), L = Math.min(h + (h - s) * 0.1, e.parMax);
        g = o.create(
          "curve",
          [u, (ue) => ue, v, L],
          t
        );
      } else {
        let s = e.graphXmin, h = e.graphXmax, v = Math.max(s - (h - s) * 0.1, e.parMin), L = Math.min(h + (h - s) * 0.1, e.parMax);
        g = o.create(
          "functiongraph",
          [u, v, L],
          t
        );
      }
      se.current = e.flipFunction;
    }
    return ee.current = e.curveType, _.current = null, U.current = null, g.isDraggable = !1, g.on("up", function(u) {
      !W.current && !R.current && (ne.current && b({
        action: m.switchCurve
      }), b({
        action: m.curveClicked,
        args: { name: F }
        // send name so get original name if adapted
      })), J.current = !1;
    }), g.on("keydown", function(u) {
      u.key === "Enter" && (ne.current && b({
        action: m.switchCurve
      }), b({
        action: m.curveClicked,
        args: { name: F }
        // send name so get original name if adapted
      }));
    }), e.curveType === "bezier" ? (o.on("up", Pe), g.on("down", (u) => {
      I.current = [u.x, u.y], J.current = !0, W.current = !1, C(), R.current || b({
        action: m.curveFocused,
        args: { name: F }
        // send name so get original name if adapted
      });
    }), g.on("hit", function(u) {
      C(), b({
        action: m.curveFocused,
        args: { name: F }
        // send name so get original name if adapted
      });
    }), M.current = {
      visible: !1,
      withLabel: !1,
      fixed: !0,
      strokeColor: "var(--mainGray)",
      highlightStrokeColor: "var(--mainGray)",
      layer: 10 * e.layer + Z,
      strokeWidth: 1,
      highlightStrokeWidth: 1
    }, z.current = {
      visible: !e.hidden,
      withLabel: !1,
      fixed: !1,
      fillColor: "none",
      strokeColor: "none",
      highlightFillColor: "var(--mainGray)",
      highlightStrokeColor: "var(--mainGray)",
      strokeWidth: 1,
      highlightStrokeWidth: 1,
      layer: 10 * e.layer + Z,
      size: 3
    }, j.current = {
      fillcolor: "var(--mainGray)",
      strokecolor: "var(--mainGray)"
    }, re.current = {
      fillcolor: "none",
      strokecolor: "none"
    }, S.current = {
      visible: !1,
      withLabel: !1,
      fixed: !1,
      fillColor: "var(--mainGray)",
      strokeColor: "var(--mainGray)",
      highlightFillColor: "var(--mainGray)",
      highlightStrokeColor: "var(--mainGray)",
      strokeWidth: 1,
      highlightStrokeWidth: 1,
      layer: 10 * e.layer + xe,
      size: 2
    }, X.current || (ve(), e.bezierControlsAlwaysVisible && (le(), Te()), o.updateRenderer(), T.current = e.numericalThroughPoints.length, N.current = [
      ...e.vectorControlDirections
    ])) : (g.on("down", function(u) {
      I.current = [u.x, u.y], J.current = !0, W.current = !1, R.current || b({
        action: m.curveFocused,
        args: { name: F }
        // send name so get original name if adapted
      });
    }), g.on("hit", function(u) {
      b({
        action: m.curveFocused,
        args: { name: F }
        // send name so get original name if adapted
      });
    })), g;
  }
  function ge(r) {
    J.current && (Math.abs(r.x - I.current[0]) > 0.1 || Math.abs(r.y - I.current[1]) > 0.1) && (W.current = !0);
  }
  function ie() {
    o.off("up", Pe), i.current.off("down"), i.current.off("up"), i.current.off("keydown"), o.removeObject(i.current), i.current = null, me();
  }
  function ve() {
    p.current = [], l.current = [], a.current = [];
    for (let r = 0; r < e.numericalThroughPoints.length; r++) {
      let t = o.create(
        "point",
        [...e.numericalThroughPoints[r]],
        z.current
      );
      p.current.push(t);
      let g = o.create(
        "point",
        [...e.numericalControlPoints[r][0]],
        S.current
      ), u = o.create(
        "point",
        [...e.numericalControlPoints[r][1]],
        S.current
      );
      l.current.push([g, u]);
      let s = o.create("segment", [t, g], M.current), h = o.create("segment", [t, u], M.current);
      a.current.push([s, h]), t.on("drag", (v) => be(r)), t.on("down", (v) => Q(r, v)), t.on("hit", (v) => Q(r, v)), t.on("up", (v) => H(r)), t.on("keyfocusout", (v) => H(r)), g.on("drag", (v) => q(r, 0)), u.on("drag", (v) => q(r, 1)), g.on("down", C), u.on("down", C), s.on("down", C), h.on("down", C), g.on("up", (v) => K(r, 0)), u.on("up", (v) => K(r, 1));
    }
    D.current = [];
  }
  function me() {
    a.current.length > 0 && (a.current.forEach(
      (r) => r.forEach((t) => {
        t && (t.off("down"), o.removeObject(t));
      })
    ), a.current = [], l.current.forEach(
      (r) => r.forEach((t) => {
        t && (t.off("drag"), t.off("down"), t.off("up"), o.removeObject(t));
      })
    ), l.current = [], p.current.forEach((r) => {
      r.off("drag"), r.off("down"), r.off("hit"), r.off("up"), r.off("keyfocusout"), o.removeObject(r);
    }), p.current = []);
  }
  function Q(r, t) {
    if (X.current)
      return;
    U.current = null, _.current = null;
    let g = t.type === "pointerdown";
    B.current = g, le(), V(r), o.updateRenderer();
  }
  function be(r) {
    U.current = r, oe.current[r] = [
      p.current[r].X(),
      p.current[r].Y()
    ], b({
      action: m.moveThroughPoint,
      args: {
        throughPoint: oe.current[r],
        throughPointInd: r,
        transient: !0,
        skippable: !0
      }
    }), p.current[r].coords.setCoordinates(
      JXG.COORDS_BY_USER,
      fe.current[r]
    ), o.updateInfobox(p.current[r]);
  }
  function H(r) {
    U.current === r && b({
      action: m.moveThroughPoint,
      args: {
        throughPoint: oe.current[r],
        throughPointInd: r
      }
    });
  }
  function q(r, t) {
    _.current = r + "_" + t, E.current[r] || (E.current[r] = {}), E.current[r][t] = [
      l.current[r][t].X() - p.current[r].X(),
      l.current[r][t].Y() - p.current[r].Y()
    ], b({
      action: m.moveControlVector,
      args: {
        controlVector: E.current[r][t],
        controlVectorInds: [r, t],
        transient: !0,
        skippable: !0
      }
    }), l.current[r][t].coords.setCoordinates(
      JXG.COORDS_BY_USER,
      [...de.current[r][t]]
    ), o.updateInfobox(l.current[r][t]);
  }
  function K(r, t) {
    _.current === r + "_" + t && b({
      action: m.moveControlVector,
      args: {
        controlVector: E.current[r][t],
        controlVectorInds: [r, t]
      }
    });
  }
  function le() {
    for (let r of p.current) {
      for (let t in j.current)
        r.visProp[t] = j.current[t];
      r.needsUpdate = !0, r.update();
    }
  }
  function ke() {
    for (let r of p.current) {
      for (let t in re.current)
        r.visProp[t] = re.current[t];
      r.needsUpdate = !0, r.update();
    }
  }
  function Fe() {
    for (let r of l.current)
      for (let t of r)
        t && (t.visProp.visible = !1, t.needsUpdate = !0, t.update());
    for (let r of a.current)
      for (let t of r)
        t && (t.visProp.visible = !1, t.needsUpdate = !0, t.update());
    D.current = [];
  }
  function Te() {
    for (let r in l.current)
      V(r);
  }
  function Pe() {
    X.current || (B.current !== !0 && !e.bezierControlsAlwaysVisible && (ke(), Fe(), o.updateRenderer()), B.current = !1);
  }
  function V(r) {
    if (!e.hiddenControls[r]) {
      if (l.current[r][0]) {
        let t = (r > 0 || e.extrapolateBackward) && ["symmetric", "both", "previous"].includes(
          te.current[r]
        );
        l.current[r][0].visProp.visible = t, l.current[r][0].visPropCalc.visible = t, l.current[r][0].needsUpdate = !0, l.current[r][0].update(), a.current[r][0].visProp.visible = t, a.current[r][0].visPropCalc.visible = t, a.current[r][0].needsUpdate = !0, a.current[r][0].update();
      }
      if (l.current[r][1]) {
        let t = (r < p.current.length - 1 || e.extrapolateForward) && ["symmetric", "both", "next"].includes(
          te.current[r]
        );
        l.current[r][1].visProp.visible = t, l.current[r][1].visPropCalc.visible = t, l.current[r][1].needsUpdate = !0, l.current[r][1].update(), a.current[r][1].visProp.visible = t, a.current[r][1].visPropCalc.visible = t, a.current[r][1].needsUpdate = !0, a.current[r][1].update();
      }
      D.current[r] = !0;
    }
  }
  function C() {
    X.current || (U.current = null, _.current = null, B.current = !0, le(), o.updateRenderer());
  }
  if (o)
    if (!i.current)
      i.current = pe();
    else if (e.curveType === "bezier" && e.numericalThroughPoints.length < 2)
      ie();
    else if (ee.current !== e.curveType || ee.current === "function" && se.current !== e.flipFunction)
      ie(), i.current = pe(), o.updateQuality === o.BOARD_QUALITY_LOW && (o.itemsRenderedLowQuality[O] = i.current);
    else {
      o.updateQuality === o.BOARD_QUALITY_LOW && (o.itemsRenderedLowQuality[O] = i.current);
      let r = !e.hidden;
      i.current.name = e.labelForGraph, i.current.visProp.visible = r, i.current.visPropCalc.visible = r;
      let t = 10 * e.layer + Ce, g = i.current.visProp.layer !== t, u, s, h;
      g && (u = 10 * e.layer + Z, s = 10 * e.layer + Z, h = 10 * e.layer + xe, i.current.setAttribute({ layer: t }), M.current.layer = u, z.current.layer = s, S.current.layer = h);
      let v = he === "dark" ? e.selectedStyle.lineColorDarkMode : e.selectedStyle.lineColor;
      i.current.visProp.strokecolor !== v && (i.current.visProp.strokecolor = v, i.current.visProp.highlightstrokecolor = v), i.current.visProp.strokeopacity !== e.selectedStyle.lineOpacity && (i.current.visProp.strokeopacity = e.selectedStyle.lineOpacity);
      let L = we(e.selectedStyle.lineStyle, e.dashed);
      if (i.current.visProp.dash !== L && (i.current.visProp.dash = L), i.current.visProp.strokewidth !== e.selectedStyle.lineWidth && (i.current.visProp.strokewidth = e.selectedStyle.lineWidth), e.curveType === "parameterization") {
        let n = k(e.fDefinitions[0]), d = k(e.fDefinitions[1]);
        i.current.X = n, i.current.Y = d, i.current.minX = () => e.parMin, i.current.maxX = () => e.parMax;
      } else if (e.curveType === "bezier")
        i.current.X = k(e.fDefinitions[0]), i.current.Y = k(e.fDefinitions[1]), i.current.minX = () => e.parMin, i.current.maxX = () => e.parMax;
      else {
        let n = k(e.fDefinitions[0]);
        if (e.flipFunction) {
          i.current.X = n;
          let d = e.graphYmin, c = e.graphYmax, P = Math.max(d - (c - d) * 0.1, e.parMin), x = Math.min(c + (c - d) * 0.1, e.parMax);
          i.current.minX = () => P, i.current.maxX = () => x;
        } else {
          i.current.Y = n;
          let d = e.graphXmin, c = e.graphXmax, P = Math.max(d - (c - d) * 0.1, e.parMin), x = Math.min(c + (c - d) * 0.1, e.parMax);
          i.current.minX = () => P, i.current.maxX = () => x;
        }
      }
      if (i.current.visProp.fixed = R.current, i.current.needsUpdate = !0, i.current.updateCurve(), i.current.hasLabel && (i.current.label.needsUpdate = !0, i.current.label.visPropCalc.visible = e.labelForGraph !== "", e.applyStyleToLabel ? i.current.label.visProp.strokecolor = v : i.current.label.visProp.strokecolor = "var(canvastext)", i.current.label.update()), e.curveType !== "bezier")
        return o.updateRenderer(), /* @__PURE__ */ y.jsx(y.Fragment, { children: /* @__PURE__ */ y.jsx("a", { name: O }) });
      if (X.current)
        return a.current.length > 0 && me(), o.updateRenderer(), /* @__PURE__ */ y.jsx(y.Fragment, { children: /* @__PURE__ */ y.jsx("a", { name: O }) });
      if (a.current.length === 0)
        return ve(), T.current = e.numericalThroughPoints.length, N.current = [
          ...e.vectorControlDirections
        ], o.updateRenderer(), /* @__PURE__ */ y.jsx(y.Fragment, { children: /* @__PURE__ */ y.jsx("a", { name: O }) });
      if (e.numericalThroughPoints.length > T.current) {
        let n = T.current - 1, d = Object.assign(
          {},
          z.current
        );
        p.current[n].visProp.fillcolor === j.current.fillcolor && Object.assign(
          d,
          j.current
        );
        for (let c = T.current; c < e.numericalThroughPoints.length; c++) {
          let P = o.create(
            "point",
            [...e.numericalThroughPoints[c]],
            d
          );
          p.current.push(P);
          let x = o.create(
            "point",
            [...e.numericalControlPoints[c][0]],
            S.current
          ), A = o.create(
            "point",
            [...e.numericalControlPoints[c][1]],
            S.current
          );
          l.current.push([x, A]);
          let ce = o.create(
            "segment",
            [P, x],
            M.current
          ), ae = o.create(
            "segment",
            [P, A],
            M.current
          );
          a.current.push([ce, ae]), x.visProp.visible = !1, ce.visProp.visible = !1, A.visProp.visible = !1, ae.visProp.visible = !1, P.on("drag", (w) => be(c)), P.on("down", (w) => Q(c, w)), P.on("hit", (w) => Q(c, w)), P.on("up", (w) => H(c)), P.on("keyfocusout", (w) => H(c)), x.on("drag", (w) => q(c, 0)), x.on("down", C), x.on("up", (w) => K(c, 0)), A.on("drag", (w) => q(c, 1)), A.on("down", C), A.on("up", (w) => K(c, 1)), ce.on("down", C), ae.on("down", C);
        }
        D.current[n] && V(n);
      } else if (e.numericalThroughPoints.length < T.current) {
        for (let d = T.current - 1; d >= e.numericalThroughPoints.length; d--) {
          a.current[d][0].off("down"), a.current[d][1].off("down"), o.removeObject(a.current[d][0]), o.removeObject(a.current[d][1]), a.current.pop(), l.current[d][0].off("drag"), l.current[d][0].off("down"), l.current[d][0].off("up"), l.current[d][1].off("drag"), l.current[d][1].off("down"), l.current[d][1].off("up"), o.removeObject(l.current[d][0]), o.removeObject(l.current[d][1]), l.current.pop();
          let c = p.current.pop();
          c.off("drag"), c.off("down"), c.off("up"), c.off("hit"), c.off("keyfocusout"), o.removeObject(c);
        }
        let n = e.numericalThroughPoints.length - 1;
        D.current[n] && V(n);
      }
      let ue = Math.min(
        e.numericalThroughPoints.length,
        T.current
      );
      for (let n = 0; n < ue; n++)
        N.current[n] !== e.vectorControlDirections[n] && D.current[n] && V(n), g && (p.current[n].setAttribute({
          layer: s
        }), a.current[n][0].setAttribute({ layer: u }), l.current[n][0].setAttribute({
          layer: h
        }), a.current[n][1].setAttribute({ layer: u }), l.current[n][1].setAttribute({
          layer: h
        })), p.current[n].coords.setCoordinates(JXG.COORDS_BY_USER, [
          ...e.numericalThroughPoints[n]
        ]), p.current[n].needsUpdate = !0, p.current[n].update(), l.current[n][0].coords.setCoordinates(
          JXG.COORDS_BY_USER,
          [...e.numericalControlPoints[n][0]]
        ), l.current[n][0].needsUpdate = !0, l.current[n][0].update(), a.current[n][0].needsUpdate = !0, a.current[n][0].update(), l.current[n][1].coords.setCoordinates(
          JXG.COORDS_BY_USER,
          [...e.numericalControlPoints[n][1]]
        ), l.current[n][1].needsUpdate = !0, l.current[n][1].update(), a.current[n][1].needsUpdate = !0, a.current[n][1].update();
      for (let n = 0; n < e.numericalThroughPoints.length; n++)
        p.current[n].visProp.visible = !e.hidden, p.current[n].visPropCalc.visible = !e.hidden;
      if (Y.sourceInformation && F in Y.sourceInformation) {
        let n = Y.sourceInformation[F].throughPointMoved;
        n !== void 0 ? o.updateInfobox(p.current[n]) : (n = Y.sourceInformation[F].controlVectorMoved, n !== void 0 && o.updateInfobox(l.current[n[0]][n[1]]));
      }
      T.current = e.numericalThroughPoints.length, N.current = [
        ...e.vectorControlDirections
      ], o.updateRenderer();
    }
  return e.hidden ? null : /* @__PURE__ */ y.jsx(y.Fragment, { children: /* @__PURE__ */ y.jsx("a", { name: O }) });
});
function we(G, $) {
  return G === "dashed" || $ ? 2 : G === "solid" ? 0 : G === "dotted" ? 1 : 0;
}
export {
  Ee as default
};
