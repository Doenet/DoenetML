import { u as oe, d as ce, e as ie, C as V, g as $, j as S, t as le } from "./index-dce15b2c.js";
import se, { useRef as c, useContext as ue, useEffect as H } from "react";
import { BoardContext as ae, TEXT_LAYER_OFFSET as I } from "./graph-b13204d4.js";
const ge = se.memo(function W(q) {
  let { name: _, id: D, SVs: t, actions: a, sourceOfUpdate: de, callAction: d } = oe(q);
  W.ignoreActionsWithoutCore = () => !0;
  let e = c(null), A = c(null), P = c(null);
  const o = ue(ae);
  let y = c(null), F = c(null), X = c(!1), O = c(!1), u = c(!1), f = c(null), h = c(null), B = c(null), T = c(null), v = c(!1), C = c(!1);
  v.current = t.fixed, C.current = !t.draggable || t.fixLocation || t.fixed;
  const b = ce(ie);
  H(() => () => {
    e.current !== null && Q(), o && o.off("move", N);
  }, []), H(() => {
    o && o.on("move", N);
  }, [o]);
  function K() {
    let l = b === "dark" ? t.selectedStyle.textColorDarkMode : t.selectedStyle.textColor, s = b === "dark" ? t.selectedStyle.backgroundColorDarkMode : t.selectedStyle.backgroundColor, m = "";
    s && (m += `background-color: ${s}`);
    let x = {
      visible: !t.hidden,
      fixed: v.current,
      layer: 10 * t.layer + I,
      cssStyle: m,
      highlightCssStyle: m,
      strokeColor: l,
      strokeOpacity: 1,
      highlightStrokeColor: l,
      highlightStrokeOpacity: 0.5,
      highlight: !C.current,
      parse: !1
    }, i;
    try {
      let r = V.fromAst(t.anchor), p = [
        r.get_component(0).evaluate_to_constant(),
        r.get_component(1).evaluate_to_constant()
      ];
      Number.isFinite(p[0]) || (p[0] = 0, x.visible = !1), Number.isFinite(p[1]) || (p[1] = 0, x.visible = !1), i = o.create("point", p, {
        visible: !1
      });
    } catch {
      x.visible = !1, i = o.create("point", [0, 0], { visible: !1 });
    }
    x.anchor = i;
    let { anchorx: k, anchory: g } = $(
      t.positionFromAnchor
    );
    x.anchorx = k, x.anchory = g, P.current = [k, g];
    let n = o.create("text", [0, 0, t.text], x);
    n.isDraggable = !C.current, n.on("down", function(r) {
      y.current = [r.x, r.y], F.current = [...i.coords.scrCoords], u.current = !1, X.current = !0, O.current = !1, v.current || d({
        action: a.textFocused,
        args: { name: _ }
        // send name so get original name if adapted
      });
    }), n.on("hit", function(r) {
      F.current = [...i.coords.scrCoords], u.current = !1, d({
        action: a.textFocused,
        args: { name: _ }
        // send name so get original name if adapted
      });
    }), n.on("up", function(r) {
      u.current ? (d({
        action: a.moveText,
        args: {
          x: f.current,
          y: h.current
        }
      }), u.current = !1) : !O.current && !v.current && d({
        action: a.textClicked,
        args: { name: _ }
        // send name so get original name if adapted
      }), X.current = !1;
    }), n.on("keyfocusout", function(r) {
      u.current && (d({
        action: a.moveText,
        args: {
          x: f.current,
          y: h.current
        }
      }), u.current = !1);
    }), n.on("drag", function(r) {
      let p = r.type === "pointermove";
      (!p || Math.abs(r.x - y.current[0]) > 0.1 || Math.abs(r.y - y.current[1]) > 0.1) && (u.current = !0);
      let [j, w, E, G] = o.getBoundingBox(), J = n.size[0] / o.unitX, Y = n.size[1] / o.unitY, U = P.current[0], L = P.current[1], R = 0;
      U === "middle" ? R = -J / 2 : U === "right" && (R = -J);
      let M = 0;
      L === "middle" ? M = -Y / 2 : L === "top" && (M = -Y);
      let ee = j + 0.04 * (E - j) - R - J, te = E - 0.04 * (E - j) - R, re = G + 0.04 * (w - G) - M - Y, ne = w - 0.04 * (w - G) - M;
      if (p) {
        var z = o.origin.scrCoords;
        f.current = (F.current[1] + r.x - y.current[0] - z[1]) / o.unitX, h.current = (z[2] - (F.current[2] + r.y - y.current[1])) / o.unitY;
      } else
        f.current = i.X() + n.relativeCoords.usrCoords[1], h.current = i.Y() + n.relativeCoords.usrCoords[2];
      f.current = Math.min(
        te,
        Math.max(ee, f.current)
      ), h.current = Math.min(
        ne,
        Math.max(re, h.current)
      ), d({
        action: a.moveText,
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
    }), n.on("keydown", function(r) {
      r.key === "Enter" && (u.current && (d({
        action: a.moveText,
        args: {
          x: f.current,
          y: h.current
        }
      }), u.current = !1), d({
        action: a.textClicked,
        args: { name: _ }
        // send name so get original name if adapted
      }));
    }), e.current = n, A.current = i, T.current = t.positionFromAnchor;
  }
  function N(l) {
    X.current && (Math.abs(l.x - y.current[0]) > 0.1 || Math.abs(l.y - y.current[1]) > 0.1) && (O.current = !0);
  }
  function Q() {
    e.current.off("drag"), e.current.off("down"), e.current.off("hit"), e.current.off("up"), e.current.off("keyfocusout"), e.current.off("keydown"), o.removeObject(e.current), e.current = null;
  }
  if (o) {
    let l;
    try {
      let s = V.fromAst(t.anchor);
      l = [
        s.get_component(0).evaluate_to_constant(),
        s.get_component(1).evaluate_to_constant()
      ];
    } catch {
      l = [NaN, NaN];
    }
    if (B.current = l, e.current === null)
      K();
    else {
      e.current.relativeCoords.setCoordinates(JXG.COORDS_BY_USER, [0, 0]), A.current.coords.setCoordinates(
        JXG.COORDS_BY_USER,
        l
      ), e.current.setText(t.text);
      let s = !t.hidden;
      if (Number.isFinite(l[0]) && Number.isFinite(l[1])) {
        let n = e.current.visProp.visible !== s;
        e.current.visProp.visible = s, e.current.visPropCalc.visible = s, n && e.current.setAttribute({ visible: s });
      } else
        e.current.visProp.visible = !1, e.current.visPropCalc.visible = !1;
      let m = 10 * t.layer + I;
      e.current.visProp.layer !== m && e.current.setAttribute({ layer: m });
      let i = b === "dark" ? t.selectedStyle.textColorDarkMode : t.selectedStyle.textColor, k = b === "dark" ? t.selectedStyle.backgroundColorDarkMode : t.selectedStyle.backgroundColor, g = "";
      if (k ? g += `background-color: ${k}` : g += "background-color: transparent", e.current.visProp.strokecolor !== i && (e.current.visProp.strokecolor = i, e.current.visProp.highlightstrokecolor = i), e.current.visProp.cssstyle !== g && (e.current.visProp.cssstyle = g, e.current.visProp.highlightcssstyle = g), e.current.visProp.highlight = !C.current, e.current.visProp.fixed = v.current, e.current.isDraggable = !C.current, e.current.needsUpdate = !0, t.positionFromAnchor !== T.current) {
        let { anchorx: n, anchory: r } = $(
          t.positionFromAnchor
        );
        e.current.visProp.anchorx = n, e.current.visProp.anchory = r, P.current = [n, r], T.current = t.positionFromAnchor, e.current.fullUpdate();
      } else
        e.current.update();
      A.current.needsUpdate = !0, A.current.update(), o.updateRenderer();
    }
    return /* @__PURE__ */ S.jsx("a", { name: D });
  }
  if (t.hidden)
    return null;
  let Z = le(b, t.selectedStyle);
  return /* @__PURE__ */ S.jsxs(S.Fragment, { children: [
    /* @__PURE__ */ S.jsx("a", { name: D }),
    /* @__PURE__ */ S.jsx("span", { id: D, style: Z, children: t.text })
  ] });
});
export {
  ge as default
};
