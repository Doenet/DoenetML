import { u as de, d as fe, e as he, C as Z, g as ee, j as l, k as ge, t as me, M as W } from "./index-dce15b2c.js";
import pe, { useRef as s, useContext as xe, useEffect as re } from "react";
import { BoardContext as ye, TEXT_LAYER_OFFSET as te } from "./graph-b13204d4.js";
const ke = pe.memo(function ne(oe) {
  let { name: F, id: b, SVs: e, actions: m, sourceOfUpdate: Ce, callAction: p } = de(oe);
  ne.ignoreActionsWithoutCore = () => !0;
  let r = s(null), R = s(null), X = s(null);
  const n = xe(ye);
  let v = s(null), w = s(null), U = s(!1), E = s(!1), g = s(!1), x = s(null), y = s(null), z = s(null), G = s(null), A = s(!1), j = s(!1);
  A.current = e.fixed, j.current = !e.draggable || e.fixLocation || e.fixed;
  const P = fe(he);
  re(() => () => {
    r.current !== null && le(), n && n.off("move", V);
  }, []), re(() => {
    n && n.on("move", V);
  }, [n]);
  function ie() {
    let o = P === "dark" ? e.selectedStyle.textColorDarkMode : e.selectedStyle.textColor, a = P === "dark" ? e.selectedStyle.backgroundColorDarkMode : e.selectedStyle.backgroundColor, f = "";
    a && (f += `background-color: ${a}`);
    let u = {
      visible: !e.hidden,
      fixed: A.current,
      layer: 10 * e.layer + te,
      cssStyle: f,
      highlightCssStyle: f,
      strokeColor: o,
      strokeOpacity: 1,
      highlightStrokeColor: o,
      highlightStrokeOpacity: 0.5,
      highlight: !j.current,
      useMathJax: !0,
      parse: !1
    }, d;
    try {
      let t = Z.fromAst(e.anchor), C = [
        t.get_component(0).evaluate_to_constant(),
        t.get_component(1).evaluate_to_constant()
      ];
      Number.isFinite(C[0]) || (C[0] = 0, u.visible = !1), Number.isFinite(C[1]) || (C[1] = 0, u.visible = !1), d = n.create("point", C, {
        visible: !1
      });
    } catch {
      u.visible = !1, d = n.create("point", [0, 0], { visible: !1 });
    }
    u.anchor = d;
    let { anchorx: N, anchory: _ } = ee(
      e.positionFromAnchor
    );
    u.anchorx = N, u.anchory = _, X.current = [N, _];
    let h, c;
    e.renderMode === "inline" ? (h = "\\(", c = "\\)") : e.renderMode === "display" ? (h = "\\[", c = "\\]") : e.renderMode === "numbered" ? (h = `\\begin{gather}\\tag{${e.equationTag}}`, c = "\\end{gather}") : e.renderMode === "align" ? (h = "\\begin{align}", c = "\\end{align}") : (h = "\\(", c = "\\)");
    let i = n.create(
      "text",
      [0, 0, h + e.latex + c],
      u
    );
    i.isDraggable = !j.current, i.on("down", function(t) {
      v.current = [t.x, t.y], w.current = [...d.coords.scrCoords], g.current = !1, U.current = !0, E.current = !1, A.current || p({
        action: m.mathFocused,
        args: { name: F }
        // send name so get original name if adapted
      });
    }), i.on("hit", function(t) {
      w.current = [...d.coords.scrCoords], g.current = !1, p({
        action: m.mathFocused,
        args: { name: F }
        // send name so get original name if adapted
      });
    }), i.on("up", function(t) {
      g.current ? (p({
        action: m.moveMath,
        args: {
          x: x.current,
          y: y.current
        }
      }), g.current = !1) : !E.current && !A.current && p({
        action: m.mathClicked,
        args: { name: F }
        // send name so get original name if adapted
      }), U.current = !1;
    }), i.on("keyfocusout", function(t) {
      g.current && (p({
        action: m.moveMath,
        args: {
          x: x.current,
          y: y.current
        }
      }), g.current = !1);
    }), i.on("drag", function(t) {
      let C = t.type === "pointermove";
      (!C || Math.abs(t.x - v.current[0]) > 0.1 || Math.abs(t.y - v.current[1]) > 0.1) && (g.current = !0);
      let [Y, B, I, $] = n.getBoundingBox(), q = i.size[0] / n.unitX, L = i.size[1] / n.unitY, H = X.current[0], K = X.current[1], J = 0;
      H === "middle" ? J = -q / 2 : H === "right" && (J = -q);
      let T = 0;
      K === "middle" ? T = -L / 2 : K === "top" && (T = -L);
      let ae = Y + 0.04 * (I - Y) - J - q, se = I - 0.04 * (I - Y) - J, ce = $ + 0.04 * (B - $) - T - L, ue = B - 0.04 * (B - $) - T;
      if (C) {
        var Q = n.origin.scrCoords;
        x.current = (w.current[1] + t.x - v.current[0] - Q[1]) / n.unitX, y.current = (Q[2] - (w.current[2] + t.y - v.current[1])) / n.unitY;
      } else
        x.current = d.X() + i.relativeCoords.usrCoords[1], y.current = d.Y() + i.relativeCoords.usrCoords[2];
      x.current = Math.min(
        se,
        Math.max(ae, x.current)
      ), y.current = Math.min(
        ue,
        Math.max(ce, y.current)
      ), p({
        action: m.moveMath,
        args: {
          x: x.current,
          y: y.current,
          transient: !0,
          skippable: !0
        }
      }), i.relativeCoords.setCoordinates(JXG.COORDS_BY_USER, [0, 0]), d.coords.setCoordinates(
        JXG.COORDS_BY_USER,
        z.current
      );
    }), i.on("keydown", function(t) {
      t.key === "Enter" && (g.current && (p({
        action: m.moveMath,
        args: {
          x: x.current,
          y: y.current
        }
      }), g.current = !1), p({
        action: m.mathClicked,
        args: { name: F }
        // send name so get original name if adapted
      }));
    }), r.current = i, R.current = d, G.current = e.positionFromAnchor, setTimeout(() => {
      r.current && (r.current.needsUpdate = !0, r.current.setText(h + e.latex + c), r.current.update(), n.updateRenderer());
    }, 1e3);
  }
  function V(o) {
    U.current && (Math.abs(o.x - v.current[0]) > 0.1 || Math.abs(o.y - v.current[1]) > 0.1) && (E.current = !0);
  }
  function le() {
    r.current.off("drag"), r.current.off("down"), r.current.off("hit"), r.current.off("up"), r.current.off("keyfocusout"), r.current.off("keydown"), n.removeObject(r.current), r.current = null;
  }
  if (n) {
    let o;
    try {
      let a = Z.fromAst(e.anchor);
      o = [
        a.get_component(0).evaluate_to_constant(),
        a.get_component(1).evaluate_to_constant()
      ];
    } catch {
      o = [NaN, NaN];
    }
    if (z.current = o, r.current === null)
      ie();
    else {
      r.current.relativeCoords.setCoordinates(JXG.COORDS_BY_USER, [0, 0]), R.current.coords.setCoordinates(
        JXG.COORDS_BY_USER,
        o
      );
      let a, f;
      e.renderMode === "inline" ? (a = "\\(", f = "\\)") : e.renderMode === "display" ? (a = "\\[", f = "\\]") : e.renderMode === "numbered" ? (a = `\\begin{gather}\\tag{${e.equationTag}}`, f = "\\end{gather}") : e.renderMode === "align" ? (a = "\\begin{align}", f = "\\end{align}") : (a = "\\(", f = "\\)"), r.current.setText(a + e.latex + f);
      let u = !e.hidden;
      if (Number.isFinite(o[0]) && Number.isFinite(o[1])) {
        let i = r.current.visProp.visible !== u;
        r.current.visProp.visible = u, r.current.visPropCalc.visible = u, i && r.current.setAttribute({ visible: u });
      } else
        r.current.visProp.visible = !1, r.current.visPropCalc.visible = !1;
      let d = 10 * e.layer + te;
      r.current.visProp.layer !== d && r.current.setAttribute({ layer: d });
      let _ = P === "dark" ? e.selectedStyle.textColorDarkMode : e.selectedStyle.textColor, h = P === "dark" ? e.selectedStyle.backgroundColorDarkMode : e.selectedStyle.backgroundColor, c = "";
      if (h ? c += `background-color: ${h}` : c += "background-color: transparent", r.current.visProp.strokecolor !== _ && (r.current.visProp.strokecolor = _, r.current.visProp.highlightstrokecolor = _), r.current.visProp.cssstyle !== c && (r.current.visProp.cssstyle = c, r.current.visProp.highlightcssstyle = c), r.current.visProp.highlight = !j.current, r.current.visProp.fixed = A.current, r.current.isDraggable = !j.current, r.current.needsUpdate = !0, e.positionFromAnchor !== G.current) {
        let { anchorx: i, anchory: t } = ee(
          e.positionFromAnchor
        );
        r.current.visProp.anchorx = i, r.current.visProp.anchory = t, X.current = [i, t], G.current = e.positionFromAnchor, r.current.fullUpdate();
      } else
        r.current.update();
      R.current.needsUpdate = !0, R.current.update(), n.updateRenderer();
    }
    return /* @__PURE__ */ l.jsx("a", { name: b });
  }
  if (e.hidden)
    return null;
  let k, S;
  if (e.renderMode === "inline" ? (k = "\\(", S = "\\)") : e.renderMode === "display" ? (k = "\\[", S = "\\]") : e.renderMode === "numbered" ? (k = `\\begin{gather}\\tag{${e.equationTag}}`, S = "\\end{gather}") : e.renderMode === "align" ? (k = "\\begin{align}", S = "\\end{align}") : (k = "\\(", S = "\\)"), !e.latexWithInputChildren)
    return null;
  let M = e.latexWithInputChildren.map(
    (o) => typeof o == "number" ? this.children[o] : k + o + S
  ), D = [/* @__PURE__ */ l.jsx("a", { name: b }, b)];
  e.mrowChildNames && D.push(
    ...e.mrowChildNames.map((o) => {
      let a = ge(o);
      return /* @__PURE__ */ l.jsx("a", { name: a, id: a }, a);
    })
  );
  let O = me(P, e.selectedStyle);
  return M.length === 0 ? /* @__PURE__ */ l.jsxs(l.Fragment, { children: [
    D,
    /* @__PURE__ */ l.jsx("span", { id: b, style: O })
  ] }) : M.length === 1 ? /* @__PURE__ */ l.jsxs(l.Fragment, { children: [
    D,
    /* @__PURE__ */ l.jsx("span", { id: b, style: O, children: /* @__PURE__ */ l.jsx(W, { hideUntilTypeset: "first", inline: !0, dynamic: !0, children: M[0] }) })
  ] }) : M.length === 2 ? /* @__PURE__ */ l.jsxs(l.Fragment, { children: [
    D,
    /* @__PURE__ */ l.jsx("span", { id: b, style: O, children: /* @__PURE__ */ l.jsxs(W, { hideUntilTypeset: "first", inline: !0, dynamic: !0, children: [
      M[0],
      M[1]
    ] }) })
  ] }) : /* @__PURE__ */ l.jsxs(l.Fragment, { children: [
    D,
    /* @__PURE__ */ l.jsx("span", { id: b, style: O, children: /* @__PURE__ */ l.jsx(W, { hideUntilTypeset: "first", inline: !0, dynamic: !0, children: M[0] }) })
  ] });
});
export {
  ke as default
};
