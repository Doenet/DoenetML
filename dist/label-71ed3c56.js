import { u as le, d as ce, e as ie, C as H, g as I, j as F, t as ae, M as se } from "./index-8862516e.js";
import ue, { useRef as l, useContext as de, useEffect as W } from "react";
import { BoardContext as fe, TEXT_LAYER_OFFSET as q } from "./graph-de465854.js";
import "react-dom";
import "styled-components";
import "./css-ab4d83ca.js";
const ve = ue.memo(function K(Q) {
  let { name: S, id: D, SVs: r, children: he, actions: u, callAction: d } = le(Q);
  K.ignoreActionsWithoutCore = () => !0;
  let e = l(null), _ = l(null), A = l(null);
  const t = de(fe);
  let g = l(null), P = l(null), L = l(!1), X = l(!1), s = l(!1), f = l(null), h = l(null), B = l(null), j = l(null), b = l(!1), v = l(!1);
  b.current = r.fixed, v.current = !r.draggable || r.fixLocation || r.fixed;
  const C = ce(ie);
  W(() => () => {
    e.current !== null && ee(), t && t.off("move", N);
  }, []), W(() => {
    t && t.on("move", N);
  }, [t]);
  function Z() {
    let i = C === "dark" ? r.selectedStyle.textColorDarkMode : r.selectedStyle.textColor, a = C === "dark" ? r.selectedStyle.backgroundColorDarkMode : r.selectedStyle.backgroundColor, y = "";
    a && (y += `background-color: ${a}`);
    let p = {
      visible: !r.hidden,
      fixed: b.current,
      layer: 10 * r.layer + q,
      cssStyle: y,
      highlightCssStyle: y,
      strokeColor: i,
      strokeOpacity: 1,
      highlightStrokeColor: i,
      highlightStrokeOpacity: 0.5,
      highlight: !v.current,
      useMathJax: r.hasLatex,
      parse: !1
    }, c;
    try {
      let n = H.fromAst(r.anchor), m = [
        n.get_component(0).evaluate_to_constant(),
        n.get_component(1).evaluate_to_constant()
      ];
      Number.isFinite(m[0]) || (m[0] = 0, p.visible = !1), Number.isFinite(m[1]) || (m[1] = 0, p.visible = !1), c = t.create("point", m, {
        visible: !1
      });
    } catch {
      p.visible = !1, c = t.create("point", [0, 0], { visible: !1 });
    }
    p.anchor = c;
    let { anchorx: k, anchory: x } = I(
      r.positionFromAnchor
    );
    p.anchorx = k, p.anchory = x, A.current = [k, x];
    let o = t.create(
      "text",
      [0, 0, r.value],
      p
    );
    o.isDraggable = !v.current, o.on("down", function(n) {
      g.current = [n.x, n.y], P.current = [...c.coords.scrCoords], s.current = !1, L.current = !0, X.current = !1, b.current || d({
        action: u.labelFocused,
        args: { name: S }
        // send name so get original name if adapted
      });
    }), o.on("hit", function(n) {
      P.current = [...c.coords.scrCoords], s.current = !1, d({
        action: u.labelFocused,
        args: { name: S }
        // send name so get original name if adapted
      });
    }), o.on("up", function(n) {
      s.current ? (d({
        action: u.moveLabel,
        args: {
          x: f.current,
          y: h.current
        }
      }), s.current = !1) : !X.current && !b.current && d({
        action: u.labelClicked,
        args: { name: S }
        // send name so get original name if adapted
      }), L.current = !1;
    }), o.on("keyfocusout", function(n) {
      s.current && (d({
        action: u.moveLabel,
        args: {
          x: f.current,
          y: h.current
        }
      }), s.current = !1);
    }), o.on("drag", function(n) {
      let m = n.type === "pointermove";
      (!m || Math.abs(n.x - g.current[0]) > 0.1 || Math.abs(n.y - g.current[1]) > 0.1) && (s.current = !0);
      let [O, w, E, G] = t.getBoundingBox(), U = o.size[0] / t.unitX, Y = o.size[1] / t.unitY, z = A.current[0], V = A.current[1], M = 0;
      z === "middle" ? M = -U / 2 : z === "right" && (M = -U);
      let R = 0;
      V === "middle" ? R = -Y / 2 : V === "top" && (R = -Y);
      let re = O + 0.04 * (E - O) - M - U, te = E - 0.04 * (E - O) - M, ne = G + 0.04 * (w - G) - R - Y, oe = w - 0.04 * (w - G) - R;
      if (m) {
        var $ = t.origin.scrCoords;
        f.current = (P.current[1] + n.x - g.current[0] - $[1]) / t.unitX, h.current = ($[2] - (P.current[2] + n.y - g.current[1])) / t.unitY;
      } else
        f.current = c.X() + o.relativeCoords.usrCoords[1], h.current = c.Y() + o.relativeCoords.usrCoords[2];
      f.current = Math.min(
        te,
        Math.max(re, f.current)
      ), h.current = Math.min(
        oe,
        Math.max(ne, h.current)
      ), d({
        action: u.moveLabel,
        args: {
          x: f.current,
          y: h.current,
          transient: !0,
          skippable: !0
        }
      }), o.relativeCoords.setCoordinates(JXG.COORDS_BY_USER, [0, 0]), c.coords.setCoordinates(
        JXG.COORDS_BY_USER,
        B.current
      );
    }), o.on("keydown", function(n) {
      n.key === "Enter" && (s.current && (d({
        action: u.moveLabel,
        args: {
          x: f.current,
          y: h.current
        }
      }), s.current = !1), d({
        action: u.labelClicked,
        args: { name: S }
        // send name so get original name if adapted
      }));
    }), e.current = o, _.current = c, j.current = r.positionFromAnchor, r.hasLatex && setTimeout(() => {
      e.current && (e.current.needsUpdate = !0, e.current.setText(r.value), e.current.update(), t == null || t.updateRenderer());
    }, 1e3);
  }
  function N(i) {
    L.current && (Math.abs(i.x - g.current[0]) > 0.1 || Math.abs(i.y - g.current[1]) > 0.1) && (X.current = !0);
  }
  function ee() {
    e.current.off("drag"), e.current.off("down"), e.current.off("hit"), e.current.off("up"), e.current.off("keyfocusout"), e.current.off("keydown"), t.removeObject(e.current), e.current = null;
  }
  if (t) {
    let i;
    try {
      let a = H.fromAst(r.anchor);
      i = [
        a.get_component(0).evaluate_to_constant(),
        a.get_component(1).evaluate_to_constant()
      ];
    } catch {
      i = [NaN, NaN];
    }
    if (B.current = i, e.current === null)
      Z();
    else {
      e.current.relativeCoords.setCoordinates(
        JXG.COORDS_BY_USER,
        [0, 0]
      ), _.current.coords.setCoordinates(
        JXG.COORDS_BY_USER,
        i
      ), e.current.setText(r.value);
      let a = !r.hidden;
      if (Number.isFinite(i[0]) && Number.isFinite(i[1])) {
        let o = e.current.visProp.visible !== a;
        e.current.visProp.visible = a, e.current.visPropCalc.visible = a, o && e.current.setAttribute({ visible: a });
      } else
        e.current.visProp.visible = !1, e.current.visPropCalc.visible = !1;
      let y = 10 * r.layer + q;
      e.current.visProp.layer !== y && e.current.setAttribute({ layer: y });
      let c = C === "dark" ? r.selectedStyle.textColorDarkMode : r.selectedStyle.textColor, k = C === "dark" ? r.selectedStyle.backgroundColorDarkMode : r.selectedStyle.backgroundColor, x = "";
      if (k ? x += `background-color: ${k}` : x += "background-color: transparent", e.current.visProp.strokecolor !== c && (e.current.visProp.strokecolor = c, e.current.visProp.highlightstrokecolor = c), e.current.visProp.cssstyle !== x && (e.current.visProp.cssstyle = x, e.current.visProp.highlightcssstyle = x), e.current.visProp.highlight = !v.current, e.current.visProp.fixed = b.current, e.current.isDraggable = !v.current, e.current.needsUpdate = !0, r.positionFromAnchor !== j.current) {
        let { anchorx: o, anchory: n } = I(
          r.positionFromAnchor
        );
        e.current.visProp.anchorx = o, e.current.visProp.anchory = n, A.current = [o, n], j.current = r.positionFromAnchor, e.current.fullUpdate();
      } else
        e.current.update();
      _.current.needsUpdate = !0, _.current.update(), t.updateRenderer();
    }
    return /* @__PURE__ */ F.jsx("a", { name: D });
  }
  if (r.hidden)
    return null;
  let T = ae(C, r.selectedStyle);
  T.marginRight = "12px";
  let J = r.value;
  return r.hasLatex && (J = /* @__PURE__ */ F.jsx(se, { hideUntilTypeset: "first", inline: !0, dynamic: !0, children: J })), /* @__PURE__ */ F.jsxs("span", { id: D, style: T, children: [
    /* @__PURE__ */ F.jsx("a", { name: D }),
    J
  ] });
});
export {
  ve as default
};
