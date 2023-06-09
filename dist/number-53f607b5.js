import { u as ce, d as ie, e as le, C as $, g as H, j as b, t as ue, M as se } from "./index-64c78e6b.js";
import ae, { useRef as c, useContext as de, useEffect as I } from "react";
import { BoardContext as fe, TEXT_LAYER_OFFSET as W } from "./graph-0deb1c0a.js";
import "react-dom";
import "styled-components";
import "./css-ab4d83ca.js";
const ve = ae.memo(function q(K) {
  let { name: _, id: R, SVs: r, actions: a, sourceOfUpdate: he, callAction: d } = ce(K);
  q.ignoreActionsWithoutCore = () => !0;
  let e = c(null), A = c(null), P = c(null);
  const o = de(fe);
  let g = c(!1), M = c(!1), D = c(!1), X = c(!1), s = c(!1), f = c(null), h = c(null), B = c(null), j = c(null), v = c(!1), C = c(!1);
  v.current = r.fixed, C.current = !r.draggable || r.fixLocation || r.fixed;
  const k = ie(le);
  I(() => () => {
    e.current !== null && Z(), o && o.off("move", T);
  }, []), I(() => {
    o && o.on("move", T);
  }, [o]);
  function Q() {
    let l = k === "dark" ? r.selectedStyle.textColorDarkMode : r.selectedStyle.textColor, u = k === "dark" ? r.selectedStyle.backgroundColorDarkMode : r.selectedStyle.backgroundColor, y = "";
    u && (y += `background-color: ${u}`);
    let m = {
      visible: !r.hidden,
      fixed: v.current,
      layer: 10 * r.layer + W,
      cssStyle: y,
      highlightCssStyle: y,
      strokeColor: l,
      strokeOpacity: 1,
      highlightStrokeColor: l,
      highlightStrokeOpacity: 0.5,
      highlight: !C.current,
      parse: !1
    }, i;
    try {
      let t = $.fromAst(r.anchor), x = [
        t.get_component(0).evaluate_to_constant(),
        t.get_component(1).evaluate_to_constant()
      ];
      Number.isFinite(x[0]) || (x[0] = 0, m.visible = !1), Number.isFinite(x[1]) || (x[1] = 0, m.visible = !1), i = o.create("point", x, {
        visible: !1
      });
    } catch {
      m.visible = !1, i = o.create("point", [0, 0], { visible: !1 });
    }
    m.anchor = i;
    let { anchorx: S, anchory: p } = H(
      r.positionFromAnchor
    );
    m.anchorx = S, m.anchory = p, P.current = [S, p];
    let n = o.create(
      "text",
      [0, 0, r.text],
      m
    );
    n.isDraggable = !C.current, n.on("down", function(t) {
      g.current = [t.x, t.y], M.current = [...i.coords.scrCoords], s.current = !1, D.current = !0, X.current = !1, v.current || d({
        action: a.numberFocused,
        args: { name: _ }
        // send name so get original name if adapted
      });
    }), n.on("hit", function(t) {
      M.current = [...i.coords.scrCoords], s.current = !1, d({
        action: a.numberFocused,
        args: { name: _ }
        // send name so get original name if adapted
      });
    }), n.on("up", function(t) {
      s.current ? (d({
        action: a.moveNumber,
        args: {
          x: f.current,
          y: h.current
        }
      }), s.current = !1) : !X.current && !v.current && d({
        action: a.numberClicked,
        args: { name: _ }
        // send name so get original name if adapted
      }), D.current = !1;
    }), n.on("keyfocusout", function(t) {
      s.current && (d({
        action: a.moveNumber,
        args: {
          x: f.current,
          y: h.current
        }
      }), s.current = !1);
    }), n.on("drag", function(t) {
      let x = t.type === "pointermove";
      (!x || Math.abs(t.x - g.current[0]) > 0.1 || Math.abs(t.y - g.current[1]) > 0.1) && (s.current = !0);
      let [w, J, E, G] = o.getBoundingBox(), U = n.size[0] / o.unitX, Y = n.size[1] / o.unitY, L = P.current[0], z = P.current[1], F = 0;
      L === "middle" ? F = -U / 2 : L === "right" && (F = -U);
      let N = 0;
      z === "middle" ? N = -Y / 2 : z === "top" && (N = -Y);
      let re = w + 0.04 * (E - w) - F - U, te = E - 0.04 * (E - w) - F, ne = G + 0.04 * (J - G) - N - Y, oe = J - 0.04 * (J - G) - N;
      if (x) {
        var V = o.origin.scrCoords;
        f.current = (M.current[1] + t.x - g.current[0] - V[1]) / o.unitX, h.current = (V[2] - (M.current[2] + t.y - g.current[1])) / o.unitY;
      } else
        f.current = i.X() + n.relativeCoords.usrCoords[1], h.current = i.Y() + n.relativeCoords.usrCoords[2];
      f.current = Math.min(
        te,
        Math.max(re, f.current)
      ), h.current = Math.min(
        oe,
        Math.max(ne, h.current)
      ), d({
        action: a.moveNumber,
        args: {
          x: f.current,
          y: h.current,
          transient: !0,
          skippable: !0
        }
      }), n.relativeCoords.setCoordinates(JXG.COORDS_BY_USER, [0, 0]), i.coords.setCoordinates(
        JXG.COORDS_BY_USER,
        B.current
      );
    }), n.on("keydown", function(t) {
      t.key === "Enter" && (s.current && (d({
        action: a.moveNumber,
        args: {
          x: f.current,
          y: h.current
        }
      }), s.current = !1), d({
        action: a.numberClicked,
        args: { name: _ }
        // send name so get original name if adapted
      }));
    }), e.current = n, A.current = i, j.current = r.positionFromAnchor;
  }
  function T(l) {
    D.current && (Math.abs(l.x - g.current[0]) > 0.1 || Math.abs(l.y - g.current[1]) > 0.1) && (X.current = !0);
  }
  function Z() {
    e.current.off("drag"), e.current.off("down"), e.current.off("hit"), e.current.off("up"), e.current.off("keyfocusout"), e.current.off("keydown"), o.removeObject(e.current), e.current = null;
  }
  if (o) {
    let l;
    try {
      let u = $.fromAst(r.anchor);
      l = [
        u.get_component(0).evaluate_to_constant(),
        u.get_component(1).evaluate_to_constant()
      ];
    } catch {
      l = [NaN, NaN];
    }
    if (B.current = l, e.current === null)
      Q();
    else {
      e.current.relativeCoords.setCoordinates(
        JXG.COORDS_BY_USER,
        [0, 0]
      ), A.current.coords.setCoordinates(
        JXG.COORDS_BY_USER,
        l
      ), e.current.setText(r.text);
      let u = !r.hidden;
      if (Number.isFinite(l[0]) && Number.isFinite(l[1])) {
        let n = e.current.visProp.visible !== u;
        e.current.visProp.visible = u, e.current.visPropCalc.visible = u, n && e.current.setAttribute({ visible: u });
      } else
        e.current.visProp.visible = !1, e.current.visPropCalc.visible = !1;
      let y = 10 * r.layer + W;
      e.current.visProp.layer !== y && e.current.setAttribute({ layer: y });
      let i = k === "dark" ? r.selectedStyle.textColorDarkMode : r.selectedStyle.textColor, S = k === "dark" ? r.selectedStyle.backgroundColorDarkMode : r.selectedStyle.backgroundColor, p = "";
      if (S ? p += `background-color: ${S}` : p += "background-color: transparent", e.current.visProp.strokecolor !== i && (e.current.visProp.strokecolor = i, e.current.visProp.highlightstrokecolor = i), e.current.visProp.cssstyle !== p && (e.current.visProp.cssstyle = p, e.current.visProp.highlightcssstyle = p), e.current.visProp.highlight = !C.current, e.current.visProp.fixed = v.current, e.current.isDraggable = !C.current, e.current.needsUpdate = !0, r.positionFromAnchor !== j.current) {
        let { anchorx: n, anchory: t } = H(
          r.positionFromAnchor
        );
        e.current.visProp.anchorx = n, e.current.visProp.anchory = t, P.current = [n, t], j.current = r.positionFromAnchor, e.current.fullUpdate();
      } else
        e.current.update();
      A.current.needsUpdate = !0, A.current.update(), o.updateRenderer();
    }
    return /* @__PURE__ */ b.jsx("a", { name: R });
  }
  if (r.hidden)
    return null;
  let O = r.text;
  r.renderAsMath && (O = "\\(" + O + "\\)");
  let ee = ue(k, r.selectedStyle);
  return /* @__PURE__ */ b.jsxs(b.Fragment, { children: [
    /* @__PURE__ */ b.jsx("a", { name: R }),
    /* @__PURE__ */ b.jsx("span", { id: R, style: ee, children: /* @__PURE__ */ b.jsx(se, { hideUntilTypeset: "first", inline: !0, dynamic: !0, children: O }) })
  ] });
});
export {
  ve as default
};
