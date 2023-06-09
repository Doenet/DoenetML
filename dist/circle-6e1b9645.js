import { u as se, d as de, e as fe, j as he } from "./index-64c78e6b.js";
import pe, { useContext as ye, useRef as a, useEffect as V } from "react";
import { BoardContext as ge, LINE_LAYER_OFFSET as K, POINT_LAYER_OFFSET as Z } from "./graph-0deb1c0a.js";
import { c as x, g as $, a as Y, b as z, n as ee, d as re, e as te, f as ne } from "./offGraphIndicators-6eabeb84.js";
import "react-dom";
import "styled-components";
import "./css-ab4d83ca.js";
const Re = pe.memo(function M(ie) {
  let { name: A, id: j, SVs: e, actions: d, callAction: f } = se(ie);
  M.ignoreActionsWithoutCore = () => !0;
  const l = ye(ge);
  let r = a(null), n = a(null), h = a(!1), k = a(null), F = a(!1), _ = a(!1), D = a(null), p = a(null), m = a(null), T = a(null), W = a(null), v = a(null), b = a(null), E = a(null), P = a(!1), R = a(!1), y = a(!1), u = a([0, 0]), g = a([0, 0]), X = a([0, 0]);
  b.current = e.numericalCenter, E.current = e.throughAngles, P.current = e.fixed, R.current = !e.draggable || e.fixLocation || e.fixed;
  const G = de(fe);
  V(() => () => {
    r.current && H(), l && l.off("move", N);
  }, []), V(() => {
    l && l.on("move", N);
  }, [l]);
  function ce() {
    if (!(Number.isFinite(e.numericalCenter[0]) && Number.isFinite(e.numericalCenter[1]) && e.numericalRadius > 0))
      return null;
    let S = G === "dark" ? e.selectedStyle.lineColorDarkMode : e.selectedStyle.lineColor, C = G === "dark" ? e.selectedStyle.fillColorDarkMode : e.selectedStyle.fillColor;
    C = e.filled ? C : "none";
    let L = G === "dark" ? e.selectedStyle.markerColorDarkMode : e.selectedStyle.markerColor, I = e.labelForGraph !== "";
    var o = {
      name: e.labelForGraph,
      visible: !e.hidden,
      withlabel: I,
      fixed: P.current,
      layer: 10 * e.layer + K,
      strokeColor: S,
      strokeOpacity: e.selectedStyle.lineOpacity,
      highlightStrokeColor: S,
      strokeWidth: e.selectedStyle.lineWidth,
      highlightStrokeWidth: e.selectedStyle.lineWidth,
      highlightStrokeOpacity: e.selectedStyle.lineOpacity * 0.5,
      dash: le(e.selectedStyle.lineStyle),
      fillColor: C,
      fillOpacity: e.selectedStyle.fillOpacity,
      highlightFillColor: C,
      highlightFillOpacity: e.selectedStyle.fillOpacity * 0.5,
      highlight: !R.current
    };
    e.filled && (o.hasInnerPoints = !0), o.label = {
      highlight: !1
    }, e.labelHasLatex && (o.label.useMathJax = !0), e.labelForGraph !== "" && (e.applyStyleToLabel ? o.label.strokeColor = S : o.label.strokeColor = "var(--canvastext)"), r.current = l.create(
      "circle",
      [[...e.numericalCenter], e.numericalRadius],
      o
    ), r.current.isDraggable = !R.current;
    let s = {
      name: e.labelForGraph,
      visible: !e.hidden && y.current,
      withlabel: I,
      fixed: P.current,
      layer: 10 * e.layer + Z,
      fillColor: L,
      strokeColor: "none",
      strokeOpacity: e.selectedStyle.markerOpacity,
      fillOpacity: e.selectedStyle.markerOpacity,
      highlightFillColor: "var(--mainGray)",
      highlightStrokeColor: "var(--lightBlue)",
      size: re(
        e.selectedStyle.markerSize,
        e.selectedStyle.markerStyle
      ),
      face: ee(
        e.selectedStyle.markerStyle,
        u.current
      ),
      highlight: !R.current,
      showinfobox: !1
    };
    if (I) {
      let t = te(
        "upperright",
        u.current
      );
      W.current = t;
      let { offset: i, anchorx: c, anchory: w } = ne(t);
      s.label = {
        offset: i,
        anchorx: c,
        anchory: w,
        highlight: !1
      }, e.labelHasLatex && (s.label.useMathJax = !0), e.applyStyleToLabel ? s.label.strokeColor = L : s.label.strokeColor = "var(--canvastext)";
    } else
      s.label = {
        highlight: !1
      }, e.labelHasLatex && (s.label.useMathJax = !0);
    return n.current = l.create(
      "point",
      [...g.current],
      s
    ), n.isDraggable = !R.current, r.current.on("drag", function(t) {
      let i = t.type === "pointermove";
      if ((!i || Math.abs(t.x - k.current[0]) > 0.1 || Math.abs(t.y - k.current[1]) > 0.1) && (h.current = !0), i) {
        var c = l.origin.scrCoords;
        let w = (D.current[1] + t.x - k.current[0] - c[1]) / l.unitX, O = (c[2] - (D.current[2] + t.y - k.current[1])) / l.unitY;
        v.current = [w, O];
      } else
        v.current = [
          r.current.center.X(),
          r.current.center.Y()
        ];
      f({
        action: d.moveCircle,
        args: {
          center: v.current,
          radius: p.current,
          throughAngles: m.current,
          transient: !0,
          skippable: !0
        }
      }), r.current.center.coords.setCoordinates(JXG.COORDS_BY_USER, [
        ...b.current
      ]);
    }), r.current.on("up", function(t) {
      h.current ? f({
        action: d.moveCircle,
        args: {
          center: v.current,
          radius: p.current,
          throughAngles: m.current
        }
      }) : !_.current && !P.current && f({
        action: d.circleClicked,
        args: { name: A }
        // send name so get original name if adapted
      }), F.current = !1;
    }), r.current.on("keyfocusout", function(t) {
      h.current && (f({
        action: d.moveCircle,
        args: {
          center: v.current,
          radius: p.current,
          throughAngles: m.current
        }
      }), h.current = !1), F.current = !1;
    }), r.current.on("down", function(t) {
      h.current = !1, k.current = [t.x, t.y], D.current = [...r.current.center.coords.scrCoords], p.current = r.current.radius, m.current = [...E.current], F.current = !0, _.current = !1, P.current || f({
        action: d.circleFocused,
        args: { name: A }
        // send name so get original name if adapted
      });
    }), r.current.on("hit", function(t) {
      h.current = !1, D.current = [...r.current.center.coords.scrCoords], p.current = r.current.radius, m.current = [...E.current], f({
        action: d.circleFocused,
        args: { name: A }
        // send name so get original name if adapted
      });
    }), r.current.on("keydown", function(t) {
      t.key === "Enter" && (h.current && (f({
        action: d.moveCircle,
        args: {
          center: v.current,
          radius: p.current,
          throughAngles: m.current
        }
      }), h.current = !1), f({
        action: d.circleClicked,
        args: { name: A }
        // send name so get original name if adapted
      }));
    }), n.current.on("drag", function(t) {
      (!(t.type === "pointermove") || Math.abs(t.x - k.current[0]) > 0.1 || Math.abs(t.y - k.current[1]) > 0.1) && (h.current = !0), v.current = [
        n.current.X() + X.current[0],
        n.current.Y() + X.current[1]
      ], f({
        action: d.moveCircle,
        args: {
          center: v.current,
          radius: p.current,
          throughAngles: m.current,
          transient: !0,
          skippable: !0
        }
      });
    }), n.current.on("up", function(t) {
      h.current ? f({
        action: d.moveCircle,
        args: {
          center: v.current,
          radius: p.current,
          throughAngles: m.current
        }
      }) : !_.current && !P.current && f({
        action: d.circleClicked,
        args: { name: A }
        // send name so get original name if adapted
      }), F.current = !1;
    }), n.current.on("keyfocusout", function(t) {
      h.current && (f({
        action: d.moveCircle,
        args: {
          center: v.current,
          radius: p.current,
          throughAngles: m.current
        }
      }), h.current = !1), F.current = !1;
    }), n.current.on("down", function(t) {
      h.current = !1, k.current = [t.x, t.y], D.current = [...r.current.center.coords.scrCoords], p.current = r.current.radius, m.current = [...E.current];
      let { flippedX: i, flippedY: c } = $(l), w = i ? -1 : 1, O = c ? -1 : 1;
      if (u.current[0] === 0 || u.current[1] === 0)
        X.current = [
          w * u.current[0] * p.current,
          O * u.current[1] * p.current
        ];
      else {
        let J = Math.sqrt(2);
        X.current = [
          w / J * u.current[0] * p.current,
          O / J * u.current[1] * p.current
        ];
      }
      F.current = !0, _.current = !1, P.current || f({
        action: d.circleFocused,
        args: { name: A }
        // send name so get original name if adapted
      });
    }), n.current.on("hit", function(t) {
      h.current = !1, D.current = [...r.current.center.coords.scrCoords], p.current = r.current.radius, m.current = [...E.current], f({
        action: d.circleFocused,
        args: { name: A }
        // send name so get original name if adapted
      });
    }), n.current.on("keydown", function(t) {
      t.key === "Enter" && (h.current && (f({
        action: d.moveCircle,
        args: {
          center: v.current,
          radius: p.current,
          throughAngles: m.current
        }
      }), h.current = !1), f({
        action: d.circleClicked,
        args: { name: A }
        // send name so get original name if adapted
      }));
    }), T.current = e.labelForGraph !== "", r.current;
  }
  function N(S) {
    F.current && (Math.abs(S.x - k.current[0]) > 0.1 || Math.abs(S.y - k.current[1]) > 0.1) && (_.current = !0);
  }
  function H() {
    n.current.off("drag"), n.current.off("down"), n.current.off("up"), n.current.off("hit"), n.current.off("keyfocusout"), n.current.off("keydown"), l.removeObject(n.current), n.current = null, r.current.off("drag"), r.current.off("down"), r.current.off("up"), r.current.off("hit"), r.current.off("keyfocusout"), r.current.off("keydown"), l.removeObject(r.current), r.current = null;
  }
  if (l) {
    if (b.current = [...e.numericalCenter], y.current = !1, u.current = [0, 0], g.current = [0, 0], !e.hideOffGraphIndicator) {
      let S = x(
        b.current,
        l
      );
      if (S.needIndicator) {
        let C = S.indicatorSides, { flippedX: L, flippedY: I } = $(l), o = L ? -1 : 1, s = I ? -1 : 1;
        if (C[0] === 1)
          if (C[1] === 1) {
            let t = [...b.current];
            if (t[0] -= e.numericalRadius * o, t[1] -= e.numericalRadius * s, x(
              t,
              l
            ).needIndicator)
              y.current = !0, u.current = [1, 1], g.current = Y(
                l,
                [1, 1]
              );
            else {
              let c = z({
                center: e.numericalCenter,
                radius: e.numericalRadius,
                directionToCheck: [1, 1],
                board: l
              });
              c.needIndicator && (y.current = !0, u.current = c.indicatorSides, g.current = c.indicatorCoords);
            }
          } else if (C[1] === -1) {
            let t = [...b.current];
            if (t[0] -= e.numericalRadius * o, t[1] += e.numericalRadius * s, x(
              t,
              l
            ).needIndicator)
              y.current = !0, u.current = [1, -1], g.current = Y(
                l,
                [1, -1]
              );
            else {
              let c = z({
                center: e.numericalCenter,
                radius: e.numericalRadius,
                directionToCheck: [1, -1],
                board: l
              });
              c.needIndicator && (y.current = !0, u.current = c.indicatorSides, g.current = c.indicatorCoords);
            }
          } else {
            let t = [...b.current];
            t[0] -= e.numericalRadius * o;
            let i = x(t, l);
            i.needIndicator && (y.current = !0, u.current = i.indicatorSides, g.current = i.indicatorCoords);
          }
        else if (C[0] === -1)
          if (C[1] === 1) {
            let t = [...b.current];
            if (t[0] += e.numericalRadius * o, t[1] -= e.numericalRadius * s, x(
              t,
              l
            ).needIndicator)
              y.current = !0, u.current = [-1, 1], g.current = Y(
                l,
                [-1, 1]
              );
            else {
              let c = z({
                center: e.numericalCenter,
                radius: e.numericalRadius,
                directionToCheck: [-1, 1],
                board: l
              });
              c.needIndicator && (y.current = !0, u.current = c.indicatorSides, g.current = c.indicatorCoords);
            }
          } else if (C[1] === -1) {
            let t = [...b.current];
            if (t[0] += e.numericalRadius * o, t[1] += e.numericalRadius * s, x(
              t,
              l
            ).needIndicator)
              y.current = !0, u.current = [-1, -1], g.current = Y(
                l,
                [-1, -1]
              );
            else {
              let c = z({
                center: e.numericalCenter,
                radius: e.numericalRadius,
                directionToCheck: [-1, -1],
                board: l
              });
              c.needIndicator && (y.current = !0, u.current = c.indicatorSides, g.current = c.indicatorCoords);
            }
          } else {
            let t = [...b.current];
            t[0] += e.numericalRadius * o;
            let i = x(t, l);
            i.needIndicator && (y.current = !0, u.current = i.indicatorSides, g.current = i.indicatorCoords);
          }
        else if (C[1] === 1) {
          let t = [...b.current];
          t[1] -= e.numericalRadius * o;
          let i = x(t, l);
          i.needIndicator && (y.current = !0, u.current = i.indicatorSides, g.current = i.indicatorCoords);
        } else {
          let t = [...b.current];
          t[1] += e.numericalRadius * o;
          let i = x(t, l);
          i.needIndicator && (y.current = !0, u.current = i.indicatorSides, g.current = i.indicatorCoords);
        }
      }
    }
    if (!r.current)
      ce();
    else if (!(Number.isFinite(e.numericalCenter[0]) && Number.isFinite(e.numericalCenter[1]) && e.numericalRadius > 0))
      H();
    else {
      l.updateQuality === l.BOARD_QUALITY_LOW && (l.itemsRenderedLowQuality[j] = r.current);
      let S = e.numericalCenter.every((O) => Number.isFinite(O));
      r.current.center.coords.setCoordinates(JXG.COORDS_BY_USER, [
        ...e.numericalCenter
      ]), r.current.setRadius(e.numericalRadius);
      let C = !e.hidden;
      S ? (r.current.visProp.visible = C, r.current.visPropCalc.visible = C) : (r.current.visProp.visible = !1, r.current.visPropCalc.visible = !1), r.current.visProp.fixed = P.current, r.current.visProp.highlight = !R.current, r.current.isDraggable = !R.current;
      let L = 10 * e.layer + K;
      r.current.visProp.layer !== L && r.current.setAttribute({ layer: L });
      let o = G === "dark" ? e.selectedStyle.lineColorDarkMode : e.selectedStyle.lineColor, s = G === "dark" ? e.selectedStyle.fillColorDarkMode : e.selectedStyle.fillColor;
      s = e.filled ? s : "none", r.current.visProp.strokecolor !== o && (r.current.visProp.strokecolor = o, r.current.visProp.highlightstrokecolor = o), r.current.visProp.strokeopacity !== e.selectedStyle.lineOpacity && (r.current.visProp.strokeopacity = e.selectedStyle.lineOpacity, r.current.visProp.highlightstrokeopacity = e.selectedStyle.lineOpacity * 0.5);
      let t = le(e.selectedStyle.lineStyle);
      r.current.visProp.dash !== t && (r.current.visProp.dash = t), r.current.visProp.strokewidth !== e.selectedStyle.lineWidth && (r.current.visProp.strokewidth = e.selectedStyle.lineWidth, r.current.visProp.highlightstrokewidth = e.selectedStyle.lineWidth), r.current.visProp.fillcolor !== s && (r.current.visProp.fillcolor = s, r.current.visProp.highlightfillcolor = s, r.current.visProp.hasinnerpoints = e.filled), r.current.visProp.fillopacity !== e.selectedStyle.fillOpacity && (r.current.visProp.fillopacity = e.selectedStyle.fillOpacity, r.current.visProp.highlightfillopacity = e.selectedStyle.fillOpacity * 0.5), r.current.name = e.labelForGraph;
      let i = e.labelForGraph !== "";
      i != T.current && (r.current.setAttribute({ withlabel: i }), T.current = i), r.current.needsUpdate = !0, r.current.update(), r.current.hasLabel && (e.applyStyleToLabel ? r.current.label.visProp.strokecolor = o : r.current.label.visProp.strokecolor = "var(--canvastext)", r.current.label.needsUpdate = !0, r.current.label.update());
      let c = y.current && !e.hidden, w = n.current.visProp.visible !== c;
      if (n.current.visProp.visible = c, n.current.visPropCalc.visible = c, c) {
        n.current.coords.setCoordinates(
          JXG.COORDS_BY_USER,
          g.current
        );
        let O = 10 * e.layer + Z;
        n.current.visProp.layer !== O && n.current.setAttribute({ layer: O }), n.current.visProp.highlight = !R.current, n.current.visProp.fixed = P.current, n.current.isDraggable = !R.current;
        let B = G === "dark" ? e.selectedStyle.markerColorDarkMode : e.selectedStyle.markerColor;
        n.current.visProp.fillcolor !== B && (n.current.visProp.fillcolor = B), n.current.visProp.strokeopacity !== e.selectedStyle.markerOpacity && (n.current.visProp.strokeopacity = e.selectedStyle.markerOpacity, n.current.visProp.fillopacity = e.selectedStyle.markerOpacity);
        let Q = ee(
          e.selectedStyle.markerStyle,
          u.current
        );
        n.current.visProp.face !== Q && n.current.setAttribute({ face: Q });
        let q = re(
          e.selectedStyle.markerSize,
          e.selectedStyle.markerStyle
        );
        if (n.current.visProp.size !== q && n.current.setAttribute({ size: q }), n.current.name = e.labelForGraph, i != T.current && n.current.setAttribute({ withlabel: i }), n.current.hasLabel) {
          n.current.label.needsUpdate = !0, e.applyStyleToLabel ? n.current.label.visProp.strokecolor = B : n.current.label.visProp.strokecolor = "var(--canvastext)";
          let U = te(
            "upperright",
            u.current
          );
          if (U !== W.current) {
            let { offset: ue, anchorx: oe, anchory: ae } = ne(U);
            n.current.label.visProp.anchorx = oe, n.current.label.visProp.anchory = ae, n.current.label.visProp.offset = ue, W.current = U, n.current.label.fullUpdate();
          } else
            n.current.label.update();
        }
      }
      c || w ? n.current.fullUpdate() : n.current.update(), l.updateRenderer();
    }
  }
  return e.hidden ? null : /* @__PURE__ */ he.jsx("a", { name: j });
});
function le(M) {
  return M === "solid" ? 0 : M === "dashed" ? 2 : M === "dotted" ? 1 : 0;
}
export {
  Re as default
};
