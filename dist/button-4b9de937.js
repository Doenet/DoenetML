import { u as q, C as U, g as Y, j as _, B as I } from "./index-dce15b2c.js";
import K, { useRef as c, useContext as Q, useEffect as Z } from "react";
import { BoardContext as $ } from "./graph-b13204d4.js";
const oe = K.memo(function E(M) {
  let { name: ee, id: b, SVs: t, actions: m, callAction: x } = q(M, !1);
  E.ignoreActionsWithoutCore = (o) => o === "moveButton";
  let e = c(null), v = c(null), y = c(null);
  const i = Q($);
  let p = c(!1), B = c(!1), a = c(!1), s = c(null), l = c(null), D = c(null), P = c(null), R = c(!1), X = c(!1);
  R.current = t.fixed, X.current = !t.draggable || t.fixLocation || t.fixed;
  let C = t.label ? t.label : "Button";
  Z(() => () => {
    e.current !== null && H();
  }, []);
  function L() {
    let o = {
      visible: !t.hidden,
      fixed: R.current,
      disabled: t.disabled,
      useMathJax: t.labelHasLatex,
      parse: !1
    }, r;
    try {
      let n = U.fromAst(t.anchor), d = [
        n.get_component(0).evaluate_to_constant(),
        n.get_component(1).evaluate_to_constant()
      ];
      Number.isFinite(d[0]) || (d[0] = 0, o.visible = !1), Number.isFinite(d[1]) || (d[1] = 0, o.visible = !1), r = i.create("point", d, {
        visible: !1
      });
    } catch {
      o.visible = !1, r = i.create("point", [0, 0], { visible: !1 });
      return;
    }
    o.anchor = r;
    let { anchorx: f, anchory: h } = Y(
      t.positionFromAnchor
    );
    o.anchorx = f, o.anchory = h, y.current = [f, h];
    let u = i.create(
      "button",
      [0, 0, C, () => x({ action: m[t.clickAction] })],
      o
    );
    u.isDraggable = !X.current, u.on("down", function(n) {
      p.current = [n.x, n.y], B.current = [...r.coords.scrCoords], a.current = !1;
    }), u.on("hit", function(n) {
      a.current = !1;
    }), u.on("up", function(n) {
      a.current && (x({
        action: m.moveButton,
        args: {
          x: s.current,
          y: l.current
        }
      }), a.current = !1);
    }), u.on("keyfocusout", function(n) {
      a.current && (x({
        action: m.moveButton,
        args: {
          x: s.current,
          y: l.current
        }
      }), a.current = !1);
    }), u.on("drag", function(n) {
      let d = n.type === "pointermove";
      (!d || Math.abs(n.x - p.current[0]) > 0.1 || Math.abs(n.y - p.current[1]) > 0.1) && (a.current = !0);
      let [j, F, J, k] = i.getBoundingBox(), G = u.size[0] / i.unitX, w = u.size[1] / i.unitY, O = y.current[0], S = y.current[1], g = 0;
      O === "middle" ? g = -G / 2 : O === "right" && (g = -G);
      let A = 0;
      S === "middle" ? A = -w / 2 : S === "top" && (A = -w);
      let T = j + 0.04 * (J - j) - g - G, z = J - 0.04 * (J - j) - g, V = k + 0.04 * (F - k) - A - w, W = F - 0.04 * (F - k) - A;
      if (d) {
        var N = i.origin.scrCoords;
        s.current = (B.current[1] + n.x - p.current[0] - N[1]) / i.unitX, l.current = (N[2] - (B.current[2] + n.y - p.current[1])) / i.unitY;
      } else
        s.current = r.X() + u.relativeCoords.usrCoords[1], l.current = r.Y() + u.relativeCoords.usrCoords[2];
      s.current = Math.min(
        z,
        Math.max(T, s.current)
      ), l.current = Math.min(
        W,
        Math.max(V, l.current)
      ), x({
        action: m.moveButton,
        args: {
          x: s.current,
          y: l.current,
          transient: !0,
          skippable: !0
        }
      }), u.relativeCoords.setCoordinates(JXG.COORDS_BY_USER, [0, 0]), r.coords.setCoordinates(
        JXG.COORDS_BY_USER,
        D.current
      );
    }), u.on("keydown", function(n) {
      n.key === "Enter" && a.current && (x({
        action: m.moveButton,
        args: {
          x: s.current,
          y: l.current
        }
      }), a.current = !1);
    }), e.current = u, v.current = r, P.current = t.positionFromAnchor, t.labelHasLatex && setTimeout(() => {
      e.current && (e.current.needsUpdate = !0, e.current.setText(C), e.current.update(), i == null || i.updateRenderer());
    }, 1e3);
  }
  function H() {
    e.current.off("drag"), e.current.off("down"), e.current.off("hit"), e.current.off("up"), e.current.off("keyfocusout"), e.current.off("keydown"), i.removeObject(e.current), e.current = null;
  }
  if (i) {
    let o;
    try {
      let r = U.fromAst(t.anchor);
      o = [
        r.get_component(0).evaluate_to_constant(),
        r.get_component(1).evaluate_to_constant()
      ];
    } catch {
      o = [NaN, NaN];
    }
    if (D.current = o, e.current === null)
      L();
    else {
      e.current.relativeCoords.setCoordinates(
        JXG.COORDS_BY_USER,
        [0, 0]
      ), v.current.coords.setCoordinates(
        JXG.COORDS_BY_USER,
        o
      ), e.current.setText(C);
      let r = !t.hidden;
      if (Number.isFinite(o[0]) && Number.isFinite(o[1])) {
        let f = e.current.visProp.visible !== r;
        e.current.visProp.visible = r, e.current.visPropCalc.visible = r, f && e.current.setAttribute({ visible: r });
      } else
        e.current.visProp.visible = !1, e.current.visPropCalc.visible = !1;
      if (e.current.visProp.disabled !== t.disabled && (e.current.visProp.disabled = t.disabled, e.current.setAttribute({ disabled: t.disabled })), e.current.visProp.fixed = R.current, e.current.isDraggable = !X.current, e.current.needsUpdate = !0, t.positionFromAnchor !== P.current) {
        let { anchorx: f, anchory: h } = Y(
          t.positionFromAnchor
        );
        e.current.visProp.anchorx = f, e.current.visProp.anchory = h, y.current = [f, h], P.current = t.positionFromAnchor, e.current.fullUpdate();
      } else
        e.current.update();
      v.current.needsUpdate = !0, v.current.update(), i.updateRenderer();
    }
    return /* @__PURE__ */ _.jsx("a", { name: b });
  }
  return t.hidden ? null : /* @__PURE__ */ _.jsxs("div", { id: b, margin: "12px 0", style: { display: "inline-block" }, children: [
    /* @__PURE__ */ _.jsx("a", { name: b }),
    /* @__PURE__ */ _.jsx(
      I,
      {
        id: b + "_button",
        onClick: () => x({ action: m[t.clickAction] }),
        disabled: t.disabled,
        value: C,
        valueHasLatex: t.labelHasLatex
      }
    )
  ] });
});
export {
  oe as default
};
