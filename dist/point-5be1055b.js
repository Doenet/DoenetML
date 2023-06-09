import { u as he, d as ye, e as be, j as B, t as me, M as ve } from "./index-8862516e.js";
import xe, { useContext as ge, useRef as a, useEffect as ee } from "react";
import { BoardContext as Pe, POINT_LAYER_OFFSET as re } from "./graph-de465854.js";
import { c as ke, n as te, d as ne, e as ie, f as le } from "./offGraphIndicators-6eabeb84.js";
import "react-dom";
import "styled-components";
import "./css-ab4d83ca.js";
const Fe = xe.memo(function oe(ae) {
  var Z, $;
  let { name: G, id: E, SVs: r, actions: s, sourceOfUpdate: Se, callAction: u } = he(ae);
  oe.ignoreActionsWithoutCore = () => !0;
  const n = ge(Pe);
  let e = a(null), t = a(null), O = a(null), U = a(null), N = a(!1), T = a(!1), h = a(!1), W = a(null), H = a(null), k = a(null), S = a(null), f = a(null), F = a([0, 0]), A = a([0, 0]), J = a(!1), C = a(!1), V = a(!1);
  J.current = r.fixed, C.current = !r.draggable || r.fixLocation || r.fixed, V.current = r.switchable && !r.fixed;
  const q = ye(be), Y = r.open || ["cross", "plus"].includes(r.selectedStyle.markerStyle);
  ee(() => () => {
    e.current !== null && (t.current.off("drag"), t.current.off("down"), t.current.off("hit"), t.current.off("up"), t.current.off("keyfocusout"), t.current.off("keydown"), n.removeObject(e.current), n.removeObject(t.current), e.current = null, t.current = null), n && n.off("move", Q);
  }, []), ee(() => {
    n && n.on("move", Q);
  }, [n]);
  function ce() {
    let y = q === "dark" ? r.selectedStyle.markerColorDarkMode : r.selectedStyle.markerColor, I = Y ? "var(--canvas)" : y, M = Y ? y : "none", g = r.labelForGraph !== "", l = {
      name: r.labelForGraph,
      visible: !r.hidden,
      withlabel: g,
      fixed: !0,
      layer: 10 * r.layer + re,
      fillColor: I,
      strokeColor: M,
      strokeOpacity: r.selectedStyle.markerOpacity,
      fillOpacity: r.selectedStyle.markerOpacity,
      highlightFillColor: "var(--mainGray)",
      highlightStrokeColor: "var(--lightBlue)",
      size: ne(
        r.selectedStyle.markerSize,
        r.selectedStyle.markerStyle
      ),
      face: te(
        r.selectedStyle.markerStyle,
        F.current
      ),
      highlight: !C.current
    };
    if (g) {
      let i = ie(
        r.labelPosition,
        A.current
      );
      H.current = i;
      let { offset: R, anchorx: X, anchory: b } = le(i);
      l.label = {
        offset: R,
        anchorx: X,
        anchory: b,
        highlight: !1
      }, r.labelHasLatex && (l.label.useMathJax = !0), r.applyStyleToLabel ? l.label.strokeColor = y : l.label.strokeColor = "var(--canvastext)";
    } else
      l.label = {
        highlight: !1
      }, r.labelHasLatex && (l.label.useMathJax = !0);
    C.current ? l.showInfoBox = !1 : l.showInfoBox = r.showCoordsWhenDragging;
    let d = [
      f.current[0],
      f.current[1]
    ];
    Number.isFinite(d[0]) || (d[0] = 0, l.visible = !1), Number.isFinite(d[1]) || (d[1] = 0, l.visible = !1);
    let p = { ...l };
    p.fixed = J.current, p.showInfoBox = !1, p.withlabel = !1, p.fillOpacity = 0, p.strokeOpacity = 0, p.highlightFillOpacity = 0, p.highlightStrokeOpacity = 0;
    let o = n.create(
      "point",
      d,
      p
    );
    o.isDraggable = !C.current;
    let L = n.create("point", d, l);
    o.on("down", function(i) {
      O.current = [i.x, i.y], U.current = [...o.coords.scrCoords], h.current = !1, t.current.visProp.highlightfillopacity = e.current.visProp.fillopacity, t.current.visProp.highlightstrokeopacity = e.current.visProp.strokeopacity, N.current = !0, T.current = !1, J.current || u({
        action: s.pointFocused,
        args: { name: G }
        // send name so get original name if adapted
      });
    }), o.on("hit", function(i) {
      h.current = !1, u({
        action: s.pointFocused,
        args: { name: G }
        // send name so get original name if adapted
      });
    }), o.on("up", function(i) {
      h.current ? (u({
        action: s.movePoint,
        args: {
          x: k.current,
          y: S.current
        }
      }), h.current = !1) : !T.current && !J.current && (V.current ? (u({
        action: s.switchPoint
      }), u({
        action: s.pointClicked,
        args: { name: G }
        // send name so get original name if adapted
      })) : u({
        action: s.pointClicked,
        args: { name: G }
        // send name so get original name if adapted
      })), N.current = !1, t.current.visProp.highlightfillopacity = 0, t.current.visProp.highlightstrokeopacity = 0;
    }), o.on("hit", function(i) {
      n.updateInfobox(e.current);
    }), o.on("keyfocusout", function(i) {
      h.current && (u({
        action: s.movePoint,
        args: {
          x: k.current,
          y: S.current
        }
      }), h.current = !1);
    }), o.on("drag", function(i) {
      let R = i.type === "pointermove";
      (!R || Math.abs(i.x - O.current[0]) > 0.1 || Math.abs(i.y - O.current[1]) > 0.1) && (h.current = !0);
      let [X, b, P, w] = n.getBoundingBox(), m = X, v = P, c = w, x = b;
      P < X && ([v, m] = [m, v]), b < w && ([x, c] = [c, x]);
      let K = v - m, D = x - c;
      if (v -= K * 0.01, m += K * 0.01, x -= D * 0.01, c += D * 0.01, R) {
        var _ = n.origin.scrCoords;
        k.current = (U.current[1] + i.x - O.current[0] - _[1]) / n.unitX, S.current = (_[2] - (U.current[2] + i.y - O.current[1])) / n.unitY;
      } else
        k.current = o.X(), S.current = o.Y();
      k.current = Math.min(
        v,
        Math.max(m, k.current)
      ), S.current = Math.min(
        x,
        Math.max(c, S.current)
      ), u({
        action: s.movePoint,
        args: {
          x: k.current,
          y: S.current,
          transient: !0,
          skippable: !0
        }
      });
      let z = Math.min(
        v,
        Math.max(m, o.X())
      ), j = Math.min(
        x,
        Math.max(c, o.Y())
      );
      o.coords.setCoordinates(JXG.COORDS_BY_USER, [
        z,
        j
      ]), L.coords.setCoordinates(
        JXG.COORDS_BY_USER,
        f.current
      ), n.updateInfobox(L);
    }), o.on("keydown", function(i) {
      i.key === "Enter" && (h.current && (u({
        action: s.movePoint,
        args: {
          x: k.current,
          y: S.current
        }
      }), h.current = !1), V.current ? (u({
        action: s.switchPoint
      }), u({
        action: s.pointClicked,
        args: { name: G }
        // send name so get original name if adapted
      })) : u({
        action: s.pointClicked,
        args: { name: G }
        // send name so get original name if adapted
      }));
    }), e.current = L, t.current = o, W.current = g;
  }
  function Q(y) {
    N.current && (Math.abs(y.x - O.current[0]) > 0.1 || Math.abs(y.y - O.current[1]) > 0.1) && (T.current = !0);
  }
  if (n) {
    if (f.current = [...r.numericalXs], F.current = [0, 0], !r.hideOffGraphIndicator) {
      let { needIndicator: b, indicatorCoords: P, indicatorSides: w } = ke(f.current, n);
      b && (f.current = P, F.current = w);
    }
    A.current = [0, 0];
    let y = !1, I = !1, [M, g, l, d] = n.getBoundingBox();
    l < M && (y = !0, [l, M] = [M, l]), g < d && (I = !0, [g, d] = [d, g]);
    let p = l - M, o = g - d, L = M + p * 0.05, i = l - p * 0.05, R = d + o * 0.05, X = g - o * 0.05;
    if (f.current[0] < L ? A.current[0] = y ? 1 : -1 : f.current[0] > i && (A.current[0] = y ? -1 : 1), f.current[1] < R ? A.current[1] = I ? 1 : -1 : f.current[1] > X && (A.current[1] = I ? -1 : 1), e.current === null)
      ce();
    else {
      let b = q === "dark" ? r.selectedStyle.markerColorDarkMode : r.selectedStyle.markerColor, P = Y ? "var(--canvas)" : b, w = Y ? b : "none";
      e.current.visProp.fillcolor !== P && (e.current.visProp.fillcolor = P);
      let m = (Z = f.current) == null ? void 0 : Z[0], v = ($ = f.current) == null ? void 0 : $[1];
      e.current.coords.setCoordinates(JXG.COORDS_BY_USER, [m, v]), h.current || t.current.coords.setCoordinates(JXG.COORDS_BY_USER, [
        m,
        v
      ]);
      let c = !r.hidden;
      if (Number.isFinite(m) && Number.isFinite(v)) {
        let j = e.current.visProp.visible !== c;
        e.current.visProp.visible = c, e.current.visPropCalc.visible = c, t.current.visProp.visible = c, t.current.visPropCalc.visible = c, j && (e.current.setAttribute({ visible: c }), t.current.setAttribute({ visible: c }));
      } else
        e.current.visProp.visible = !1, e.current.visPropCalc.visible = !1, t.current.visProp.visible = !1, t.current.visPropCalc.visible = !1;
      let x = 10 * r.layer + re;
      e.current.visProp.layer !== x && (e.current.setAttribute({ layer: x }), t.current.setAttribute({ layer: x })), e.current.visProp.highlight = !C.current, t.current.visProp.highlight = !C.current, t.current.visProp.fixed = J.current, t.current.isDraggable = !C.current, e.current.visProp.strokecolor !== w && (e.current.visProp.strokecolor = w, t.current.visProp.strokecolor = w, e.current.visProp.fillColor = P, t.current.visProp.fillColor = P), e.current.visProp.strokeopacity !== r.selectedStyle.markerOpacity && (e.current.visProp.strokeopacity = r.selectedStyle.markerOpacity, e.current.visProp.fillopacity = r.selectedStyle.markerOpacity);
      let D = te(
        r.selectedStyle.markerStyle,
        F.current
      );
      e.current.visProp.face !== D && (e.current.setAttribute({ face: D }), t.current.setAttribute({ face: D }));
      let _ = ne(
        r.selectedStyle.markerSize,
        r.selectedStyle.markerStyle
      );
      e.current.visProp.size !== _ && (e.current.setAttribute({ size: _ }), t.current.setAttribute({ size: _ })), C.current || F.current[0] || F.current[1] ? (e.current.visProp.showinfobox = !1, n.displayInfobox(!1)) : e.current.visProp.showinfobox = r.showCoordsWhenDragging, t.current.highlighted && n.updateInfobox(e.current), e.current.name = r.labelForGraph;
      let z = r.labelForGraph !== "";
      if (z != W.current && (e.current.setAttribute({ withlabel: z }), W.current = z), e.current.hasLabel) {
        e.current.label.needsUpdate = !0, r.applyStyleToLabel ? e.current.label.visProp.strokecolor = b : e.current.label.visProp.strokecolor = "var(--canvastext)";
        let j = ie(
          r.labelPosition,
          A.current
        );
        if (j !== H.current) {
          let { offset: fe, anchorx: de, anchory: pe } = le(j);
          e.current.label.visProp.anchorx = de, e.current.label.visProp.anchory = pe, e.current.label.visProp.offset = fe, H.current = j, e.current.label.fullUpdate();
        } else
          e.current.label.update();
      }
      e.current.needsUpdate = !0, e.current.update(), t.current.needsUpdate = !0, t.current.update(), n.updateRenderer();
    }
    return /* @__PURE__ */ B.jsx("a", { name: E });
  }
  if (r.hidden)
    return null;
  let se = "\\(" + r.latex + "\\)", ue = me(q, r.selectedStyle);
  return /* @__PURE__ */ B.jsxs(B.Fragment, { children: [
    /* @__PURE__ */ B.jsx("a", { name: E }),
    /* @__PURE__ */ B.jsx("span", { id: E, style: ue, children: /* @__PURE__ */ B.jsx(ve, { hideUntilTypeset: "first", inline: !0, dynamic: !0, children: se }) })
  ] });
});
export {
  Fe as default
};
