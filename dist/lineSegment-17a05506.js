import { u as N, d as q, e as z, j as L } from "./index-64c78e6b.js";
import K, { useContext as Q, useRef as p, useEffect as W } from "react";
import { BoardContext as Z, LINE_LAYER_OFFSET as B, VERTEX_LAYER_OFFSET as I } from "./graph-0deb1c0a.js";
import "react-dom";
import "styled-components";
import "./css-ab4d83ca.js";
const ie = K.memo(function w(V) {
  let { name: h, id: M, SVs: r, actions: i, sourceOfUpdate: R, callAction: l } = N(V);
  w.ignoreActionsWithoutCore = () => !0;
  const c = Q(Z);
  let e = p(null), n = p(null), o = p(null), m = p(null), X = p(null), S = p(!1), k = p(!1), u = p(null), _ = p(null), A = p(null), s = p(null), P = p(null), G = p(null), C = p(!1), E = p(!1), O = p(!1);
  G.current = r.numericalEndpoints, C.current = r.fixed, E.current = !r.draggable || r.fixLocation || r.fixed, O.current = !r.endpointsDraggable || r.fixed || r.fixLocation;
  const Y = q(z);
  W(() => () => {
    e.current && U(), c && c.off("move", J);
  }, []), W(() => {
    c && c.on("move", J);
  }, [c]);
  function H() {
    if (r.numericalEndpoints.length !== 2 || r.numericalEndpoints.some((t) => t.length !== 2)) {
      e.current = null, n.current = null, o.current = null;
      return;
    }
    let a = r.labelForGraph !== "", g = Y === "dark" ? r.selectedStyle.lineColorDarkMode : r.selectedStyle.lineColor;
    var f = {
      name: r.labelForGraph,
      visible: !r.hidden,
      withlabel: a,
      fixed: C.current,
      layer: 10 * r.layer + B,
      strokeColor: g,
      strokeOpacity: r.selectedStyle.lineOpacity,
      highlightStrokeColor: g,
      highlightStrokeOpacity: r.selectedStyle.lineOpacity * 0.5,
      strokeWidth: r.selectedStyle.lineWidth,
      highlightStrokeWidth: r.selectedStyle.lineWidth,
      dash: T(r.selectedStyle.lineStyle),
      highlight: !E.current
    };
    if (a) {
      let t, v, d;
      r.labelPosition === "upperright" ? (d = [5, 5], t = "left", v = "bottom") : r.labelPosition === "upperleft" ? (d = [-5, 5], t = "right", v = "bottom") : r.labelPosition === "lowerright" ? (d = [5, -5], t = "left", v = "top") : (d = [-5, -5], t = "right", v = "top"), f.label = {
        offset: d,
        anchorx: t,
        anchory: v,
        highlight: !1
      }, r.labelHasLatex && (f.label.useMathJax = !0), r.applyStyleToLabel ? f.label.strokeColor = g : f.label.strokeColor = "var(--canvastext)";
    } else
      f.label = {
        highlight: !1
      }, r.labelHasLatex && (f.label.useMathJax = !0);
    let x = !O.current && !r.hidden, b = Object.assign({}, f);
    Object.assign(b, {
      withLabel: !1,
      fixed: !1,
      highlight: !0,
      fillColor: "none",
      strokeColor: "none",
      highlightStrokeColor: "none",
      highlightFillColor: getComputedStyle(
        document.documentElement
      ).getPropertyValue("--mainGray"),
      layer: 10 * r.layer + I,
      showInfoBox: r.showCoordsWhenDragging,
      visible: x
    });
    let y = [
      [...r.numericalEndpoints[0]],
      [...r.numericalEndpoints[1]]
    ];
    return n.current = c.create("point", y[0], b), o.current = c.create("point", y[1], b), e.current = c.create(
      "segment",
      [n.current, o.current],
      f
    ), e.isDraggable = !E.current, n.current.on("drag", (t) => j(1, t)), o.current.on("drag", (t) => j(2, t)), e.current.on("drag", (t) => j(0, t)), n.current.on("up", () => {
      u.current === 1 ? l({
        action: i.moveLineSegment,
        args: {
          point1coords: s.current
        }
      }) : !k.current && !C.current && l({
        action: i.lineSegmentClicked,
        args: { name: h }
        // send name so get original name if adapted
      }), P.current = null, S.current = !1;
    }), o.current.on("up", () => {
      u.current === 2 ? l({
        action: i.moveLineSegment,
        args: {
          point2coords: s.current
        }
      }) : !k.current && !C.current && l({
        action: i.lineSegmentClicked,
        args: { name: h }
        // send name so get original name if adapted
      }), P.current = null, S.current = !1;
    }), e.current.on("up", function(t) {
      u.current === 0 ? l({
        action: i.moveLineSegment,
        args: {
          point1coords: s.current[0],
          point2coords: s.current[1]
        }
      }) : !k.current && P.current === null && !C.current && l({
        action: i.lineSegmentClicked,
        args: { name: h }
        // send name so get original name if adapted
      }), S.current = !1;
    }), n.current.on("keyfocusout", () => {
      u.current === 1 && l({
        action: i.moveLineSegment,
        args: {
          point1coords: s.current
        }
      }), u.current = null;
    }), o.current.on("keyfocusout", () => {
      u.current === 2 && l({
        action: i.moveLineSegment,
        args: {
          point2coords: s.current
        }
      }), u.current = null;
    }), e.current.on("keyfocusout", function(t) {
      u.current === 0 && l({
        action: i.moveLineSegment,
        args: {
          point1coords: s.current[0],
          point2coords: s.current[1]
        }
      }), u.current = null;
    }), n.current.on("down", (t) => {
      u.current = null, m.current = [t.x, t.y], P.current = 1, S.current = !0, k.current = !1, O.current || l({
        action: i.lineSegmentFocused,
        args: { name: h }
        // send name so get original name if adapted
      });
    }), n.current.on("hit", (t) => {
      u.current = null, l({
        action: i.lineSegmentFocused,
        args: { name: h }
        // send name so get original name if adapted
      });
    }), o.current.on("down", (t) => {
      u.current = null, m.current = [t.x, t.y], P.current = 2, S.current = !0, k.current = !1, O.current || l({
        action: i.lineSegmentFocused,
        args: { name: h }
        // send name so get original name if adapted
      });
    }), o.current.on("hit", (t) => {
      u.current = null, l({
        action: i.lineSegmentFocused,
        args: { name: h }
        // send name so get original name if adapted
      });
    }), e.current.on("down", function(t) {
      u.current = null, m.current = [t.x, t.y], X.current = [
        [...n.current.coords.scrCoords],
        [...o.current.coords.scrCoords]
      ], S.current = !0, k.current = !1, P.current === null && !C.current && l({
        action: i.lineSegmentFocused,
        args: { name: h }
        // send name so get original name if adapted
      });
    }), e.current.on("hit", (t) => {
      u.current = null, l({
        action: i.lineSegmentFocused,
        args: { name: h }
        // send name so get original name if adapted
      });
    }), n.current.on("keydown", function(t) {
      t.key === "Enter" && (u.current === 1 && l({
        action: i.moveLineSegment,
        args: {
          point1coords: s.current
        }
      }), u.current = null, l({
        action: i.lineSegmentClicked,
        args: { name: h }
        // send name so get original name if adapted
      }));
    }), o.current.on("keydown", function(t) {
      t.key === "Enter" && (u.current === 2 && l({
        action: i.moveLineSegment,
        args: {
          point2coords: s.current
        }
      }), u.current = null, l({
        action: i.lineSegmentClicked,
        args: { name: h }
        // send name so get original name if adapted
      }));
    }), e.current.on("keydown", function(t) {
      t.key === "Enter" && (u.current === 0 && l({
        action: i.moveLineSegment,
        args: {
          point1coords: s.current[0],
          point2coords: s.current[1]
        }
      }), u.current = null, l({
        action: i.lineSegmentClicked,
        args: { name: h }
        // send name so get original name if adapted
      }));
    }), A.current = r.labelPosition, _.current = a, e.current;
  }
  function J(a) {
    S.current && (Math.abs(a.x - m.current[0]) > 0.1 || Math.abs(a.y - m.current[1]) > 0.1) && (k.current = !0);
  }
  function j(a, g) {
    let f = g.type === "pointermove";
    if (!f || Math.abs(g.x - m.current[0]) > 0.1 || Math.abs(g.y - m.current[1]) > 0.1)
      if (u.current = a, a == 1)
        s.current = [
          e.current.point1.X(),
          e.current.point1.Y()
        ], l({
          action: i.moveLineSegment,
          args: {
            point1coords: s.current,
            transient: !0,
            skippable: !0,
            sourceDetails: { endpoint: a }
          }
        });
      else if (a == 2)
        s.current = [
          e.current.point2.X(),
          e.current.point2.Y()
        ], l({
          action: i.moveLineSegment,
          args: {
            point2coords: s.current,
            transient: !0,
            skippable: !0,
            sourceDetails: { endpoint: a }
          }
        });
      else {
        if (s.current = [], f) {
          var x = c.origin.scrCoords;
          for (let b = 0; b < 2; b++) {
            let y = (X.current[b][1] + g.x - m.current[0] - x[1]) / c.unitX, t = (x[2] - (X.current[b][2] + g.y - m.current[1])) / c.unitY;
            s.current.push([y, t]);
          }
        } else
          s.current.push([
            e.current.point1.X(),
            e.current.point1.Y()
          ]), s.current.push([
            e.current.point2.X(),
            e.current.point2.Y()
          ]);
        l({
          action: i.moveLineSegment,
          args: {
            point1coords: s.current[0],
            point2coords: s.current[1],
            transient: !0,
            skippable: !0
          }
        });
      }
    e.current.point1.coords.setCoordinates(
      JXG.COORDS_BY_USER,
      G.current[0]
    ), e.current.point2.coords.setCoordinates(
      JXG.COORDS_BY_USER,
      G.current[1]
    ), a == 1 ? c.updateInfobox(e.current.point1) : a == 2 && c.updateInfobox(e.current.point2);
  }
  function U() {
    e.current.off("drag"), e.current.off("down"), e.current.off("hit"), e.current.off("up"), e.current.off("keydown"), e.current.off("keyfocusout"), c.removeObject(e.current), e.current = null, n.current.off("drag"), n.current.off("down"), n.current.off("hit"), n.current.off("up"), n.current.off("keydown"), n.current.off("keyfocusout"), c.removeObject(n.current), n.current = null, o.current.off("drag"), o.current.off("down"), o.current.off("hit"), o.current.off("up"), o.current.off("keydown"), o.current.off("keyfocusout"), c.removeObject(o.current), o.current = null;
  }
  if (c) {
    if (e.current === null)
      H();
    else if (r.numericalEndpoints.length !== 2 || r.numericalEndpoints.some((a) => a.length !== 2))
      U();
    else {
      let a = !0;
      for (let d of [
        r.numericalEndpoints[0],
        r.numericalEndpoints[1]
      ])
        Number.isFinite(d[0]) || (a = !1), Number.isFinite(d[1]) || (a = !1);
      if (e.current.point1.coords.setCoordinates(
        JXG.COORDS_BY_USER,
        r.numericalEndpoints[0]
      ), e.current.point2.coords.setCoordinates(
        JXG.COORDS_BY_USER,
        r.numericalEndpoints[1]
      ), R.sourceInformation && h in R.sourceInformation) {
        let d = R.sourceInformation[h].endpoint;
        d === 1 ? c.updateInfobox(e.current.point1) : d === 2 && c.updateInfobox(e.current.point2);
      }
      let g = !r.hidden && a;
      if (a) {
        let d = e.current.visProp.visible !== g;
        e.current.visProp.visible = g, e.current.visPropCalc.visible = g, d && e.current.setAttribute({ visible: g });
      } else
        e.current.visProp.visible = !1, e.current.visPropCalc.visible = !1;
      let f = !O.current && g;
      n.current.visProp.visible = f, n.current.visPropCalc.visible = f, o.current.visProp.visible = f, o.current.visPropCalc.visible = f, e.current.visProp.fixed = C.current, e.current.visProp.highlight = !E.current, e.current.isDraggable = !E.current;
      let x = 10 * r.layer + B;
      e.current.visProp.layer !== x && (e.current.setAttribute({ layer: x }), n.current.setAttribute({
        layer: 10 * r.layer + I
      }), o.current.setAttribute({
        layer: 10 * r.layer + I
      }));
      let y = Y === "dark" ? r.selectedStyle.lineColorDarkMode : r.selectedStyle.lineColor;
      e.current.visProp.strokecolor !== y && (e.current.visProp.strokecolor = y, e.current.visProp.highlightstrokecolor = y), e.current.visProp.strokewidth !== r.selectedStyle.lineWidth && (e.current.visProp.strokewidth = r.selectedStyle.lineWidth, e.current.visProp.highlightstrokewidth = r.selectedStyle.lineWidth), e.current.visProp.strokeopacity !== r.selectedStyle.lineOpacity && (e.current.visProp.strokeopacity = r.selectedStyle.lineOpacity, e.current.visProp.highlightstrokeopacity = r.selectedStyle.lineOpacity * 0.5);
      let t = T(r.selectedStyle.lineStyle);
      e.current.visProp.dash !== t && (e.current.visProp.dash = t), e.current.name = r.labelForGraph;
      let v = r.labelForGraph !== "";
      if (v != _.current && (e.current.setAttribute({ withlabel: v }), _.current = v), n.current.highlighted ? c.updateInfobox(n.current) : o.current.highlighted && c.updateInfobox(o.current), e.current.needsUpdate = !0, e.current.update(), e.current.hasLabel)
        if (e.current.label.needsUpdate = !0, r.applyStyleToLabel ? e.current.label.visProp.strokecolor = y : e.current.label.visProp.strokecolor = "var(--canvastext)", r.labelPosition !== A.current) {
          let d, F, D;
          r.labelPosition === "upperright" ? (D = [5, 5], d = "left", F = "bottom") : r.labelPosition === "upperleft" ? (D = [-5, 5], d = "right", F = "bottom") : r.labelPosition === "lowerright" ? (D = [5, -5], d = "left", F = "top") : (D = [-5, -5], d = "right", F = "top"), e.current.label.visProp.anchorx = d, e.current.label.visProp.anchory = F, e.current.label.visProp.offset = D, A.current = r.labelPosition, e.current.label.fullUpdate();
        } else
          e.current.label.update();
      n.current.needsUpdate = !0, n.current.update(), o.current.needsUpdate = !0, o.current.update(), c.updateRenderer();
    }
    return /* @__PURE__ */ L.jsx(L.Fragment, { children: /* @__PURE__ */ L.jsx("a", { name: M }) });
  }
  return r.hidden ? null : /* @__PURE__ */ L.jsx(L.Fragment, { children: /* @__PURE__ */ L.jsx("a", { name: M }) });
});
function T(w) {
  return w === "solid" ? 0 : w === "dashed" ? 2 : w === "dotted" ? 1 : 0;
}
export {
  ie as default
};
