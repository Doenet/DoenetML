import "./booleanInput.css";
import { u as ue, R as de, r as fe, C as Q, g as Z, j as r, F as N, f as pe, a as me, b as he, c as xe, M as be } from "./index-7c50cb13.js";
import ee, { useState as ge, useRef as l, useContext as ve, useEffect as Ce } from "react";
import { T as ye } from "./ToggleButton-b92e0d01.js";
import ke from "styled-components";
import { BoardContext as je } from "./graph-5fa84fc4.js";
const _ = ke.button`
  position: relative;
  width: 24px;
  height: 24px;
  color: #ffffff;
  background-color: var(--mainBlue);
  display: inline-block;
  /* text-align: center; */
  padding: 2px;
  /* z-index: 0; */
  /* border: var(--mainBorder); */
  border: none;
  border-radius: var(--mainBorderRadius);
  margin: 0px 4px 4px 0px;

  &:hover {
    background-color: var(--lightBlue);
    color: black;
  }
`, Fe = ee.memo(function T(Y) {
  let { name: Ae, id: f, SVs: e, actions: g, ignoreUpdate: te, rendererName: re, callAction: v } = ue(Y);
  T.baseStateVariable = "value", T.ignoreActionsWithoutCore = (n) => n === "moveInput";
  const [C, H] = ge(e.value);
  let W = l(null);
  W.current = C;
  const ne = de(fe(re));
  let R = l(null), t = l(null), S = l(null), P = l(null);
  const a = ve(je);
  let k = l(!1), V = l(!1), p = l(!1), m = l(null), h = l(null), z = l(null), X = l(null), E = l(!1), j = l(!1);
  E.current = e.fixed, j.current = !e.draggable || e.fixLocation || e.fixed, Ce(() => () => {
    t.current !== null && ie();
  }, []), !te && R.current !== e.value ? (H(e.value), R.current = e.value) : R.current = null;
  function w(n) {
    let o = !W.current;
    H(o), R.current = e.value, ne((d) => {
      let x = { ...d };
      return x.ignoreUpdate = !0, x;
    }), v({
      action: g.updateBoolean,
      args: {
        boolean: o
      },
      baseVariableValue: o
    });
  }
  function oe() {
    let n = {
      visible: !e.hidden,
      fixed: E.current,
      disabled: e.disabled,
      checked: C,
      useMathJax: e.labelHasLatex,
      strokeColor: "var(--canvastext)",
      highlightStrokeColor: "var(--canvastext)",
      highlight: !j.current,
      parse: !1
    }, o;
    try {
      let i = Q.fromAst(e.anchor), b = [
        i.get_component(0).evaluate_to_constant(),
        i.get_component(1).evaluate_to_constant()
      ];
      Number.isFinite(b[0]) || (b[0] = 0, n.visible = !1), Number.isFinite(b[1]) || (b[1] = 0, n.visible = !1), o = a.create("point", b, {
        visible: !1
      });
    } catch {
      n.visible = !1, o = a.create("point", [0, 0], { visible: !1 });
      return;
    }
    n.anchor = o;
    let { anchorx: d, anchory: x } = Z(
      e.positionFromAnchor
    );
    n.anchorx = d, n.anchory = x, P.current = [d, x];
    let c = a.create(
      "checkbox",
      [0, 0, e.label],
      n
    );
    c.rendNodeCheckbox.addEventListener("change", w), c.isDraggable = !j.current, c.on("down", function(i) {
      k.current = [i.x, i.y], V.current = [...o.coords.scrCoords], p.current = !1;
    }), c.on("hit", function(i) {
      p.current = !1;
    }), c.on("up", function(i) {
      p.current && (v({
        action: g.moveInput,
        args: {
          x: m.current,
          y: h.current
        }
      }), p.current = !1);
    }), c.on("keyfocusout", function(i) {
      p.current && (v({
        action: g.moveInput,
        args: {
          x: m.current,
          y: h.current
        }
      }), p.current = !1);
    }), c.on("drag", function(i) {
      let b = i.type === "pointermove";
      (!b || Math.abs(i.x - k.current[0]) > 0.1 || Math.abs(i.y - k.current[1]) > 0.1) && (p.current = !0);
      let [G, J, U, D] = a.getBoundingBox(), M = c.size[0] / a.unitX, O = c.size[1] / a.unitY, K = P.current[0], $ = P.current[1], F = 0;
      K === "middle" ? F = -M / 2 : K === "right" && (F = -M);
      let I = 0;
      $ === "middle" ? I = -O / 2 : $ === "top" && (I = -O);
      let ae = G + 0.04 * (U - G) - F - M, ce = U - 0.04 * (U - G) - F, le = D + 0.04 * (J - D) - I - O, se = J - 0.04 * (J - D) - I;
      if (b) {
        var q = a.origin.scrCoords;
        m.current = (V.current[1] + i.x - k.current[0] - q[1]) / a.unitX, h.current = (q[2] - (V.current[2] + i.y - k.current[1])) / a.unitY;
      } else
        m.current = o.X() + c.relativeCoords.usrCoords[1], h.current = o.Y() + c.relativeCoords.usrCoords[2];
      m.current = Math.min(
        ce,
        Math.max(ae, m.current)
      ), h.current = Math.min(
        se,
        Math.max(le, h.current)
      ), v({
        action: g.moveInput,
        args: {
          x: m.current,
          y: h.current,
          transient: !0,
          skippable: !0
        }
      }), c.relativeCoords.setCoordinates(JXG.COORDS_BY_USER, [0, 0]), o.coords.setCoordinates(
        JXG.COORDS_BY_USER,
        z.current
      );
    }), c.on("keydown", function(i) {
      i.key === "Enter" && p.current && (v({
        action: g.moveInput,
        args: {
          x: m.current,
          y: h.current
        }
      }), p.current = !1);
    }), t.current = c, S.current = o, X.current = e.positionFromAnchor, e.labelHasLatex && setTimeout(() => {
      t.current && (t.current.needsUpdate = !0, t.current.setText(e.label), t.current.update(), a == null || a.updateRenderer());
    }, 1e3);
  }
  function ie() {
    t.current.rendNodeCheckbox.removeEventListener(
      "change",
      w
    ), t.current.off("drag"), t.current.off("down"), t.current.off("hit"), t.current.off("up"), t.current.off("keyfocusout"), t.current.off("keydown"), a.removeObject(t.current), t.current = null;
  }
  if (a) {
    let n;
    try {
      let o = Q.fromAst(e.anchor);
      n = [
        o.get_component(0).evaluate_to_constant(),
        o.get_component(1).evaluate_to_constant()
      ];
    } catch {
      n = [NaN, NaN];
    }
    if (z.current = n, t.current === null)
      oe();
    else {
      t.current.Value() !== C && t.current.setAttribute({ checked: C }), t.current.relativeCoords.setCoordinates(
        JXG.COORDS_BY_USER,
        [0, 0]
      ), S.current.coords.setCoordinates(
        JXG.COORDS_BY_USER,
        n
      ), t.current.setText(e.label);
      let o = !e.hidden;
      if (Number.isFinite(n[0]) && Number.isFinite(n[1])) {
        let d = t.current.visProp.visible !== o;
        t.current.visProp.visible = o, t.current.visPropCalc.visible = o, d && t.current.setAttribute({ visible: o });
      } else
        t.current.visProp.visible = !1, t.current.visPropCalc.visible = !1;
      if (t.current.visProp.disabled !== e.disabled && (t.current.visProp.disabled = e.disabled, t.current.setAttribute({ disabled: e.disabled })), t.current.visProp.highlight = !j.current, t.current.visProp.fixed = E.current, t.current.isDraggable = !j.current, t.current.needsUpdate = !0, e.positionFromAnchor !== X.current) {
        let { anchorx: d, anchory: x } = Z(
          e.positionFromAnchor
        );
        t.current.visProp.anchorx = d, t.current.visProp.anchory = x, P.current = [d, x], X.current = e.positionFromAnchor, t.current.fullUpdate();
      } else
        t.current.update();
      S.current.needsUpdate = !0, S.current.update(), a.updateRenderer();
    }
    return /* @__PURE__ */ r.jsx("a", { name: f });
  }
  if (e.hidden)
    return null;
  let A = e.disabled;
  const B = f + "_input";
  let s = {
    cursor: "pointer",
    padding: "1px 6px 1px 6px"
  }, u = null;
  if (Y.icon, e.includeCheckWork && !e.suppressCheckwork) {
    let n = "unvalidated";
    if (e.valueHasBeenValidated && (e.creditAchieved === 1 ? n = "correct" : e.creditAchieved === 0 ? n = "incorrect" : n = "partialcorrect"), n === "unvalidated")
      A && (s.backgroundColor = getComputedStyle(
        document.documentElement
      ).getPropertyValue("--mainGray"), s.cursor = "not-allowed"), u = /* @__PURE__ */ r.jsx(
        _,
        {
          id: f + "_submit",
          tabIndex: "0",
          disabled: A,
          style: s,
          onClick: () => v({
            action: g.submitAnswer
          }),
          onKeyPress: (o) => {
            o.key === "Enter" && v({
              action: g.submitAnswer
            });
          },
          children: /* @__PURE__ */ r.jsx(
            N,
            {
              style: {
                /*marginRight: "4px", paddingLeft: "2px"*/
              },
              icon: pe,
              transform: { rotate: 90 }
            }
          )
        }
      );
    else if (e.showCorrectness)
      if (n === "correct")
        s.backgroundColor = getComputedStyle(
          document.documentElement
        ).getPropertyValue("--mainGreen"), u = /* @__PURE__ */ r.jsx(_, { id: f + "_correct", style: s, children: /* @__PURE__ */ r.jsx(N, { icon: me }) });
      else if (n === "partialcorrect") {
        let d = `${Math.round(e.creditAchieved * 100)} %`;
        s.width = "44px", s.backgroundColor = "#efab34", u = /* @__PURE__ */ r.jsx(_, { id: f + "_partial", style: s, children: d });
      } else
        s.backgroundColor = getComputedStyle(
          document.documentElement
        ).getPropertyValue("--mainRed"), u = /* @__PURE__ */ r.jsx(_, { id: f + "_incorrect", style: s, children: /* @__PURE__ */ r.jsx(N, { icon: he }) });
    else
      s.backgroundColor = "rgb(74, 3, 217)", s.padding = "1px 8px 1px 4px", u = /* @__PURE__ */ r.jsx(_, { id: f + "_saved", style: s, children: /* @__PURE__ */ r.jsx(N, { icon: xe }) });
    e.numAttemptsLeft < 0 ? u = /* @__PURE__ */ r.jsxs(r.Fragment, { children: [
      u,
      /* @__PURE__ */ r.jsx("span", { children: "(no attempts remaining)" })
    ] }) : e.numAttemptsLeft == 1 ? u = /* @__PURE__ */ r.jsxs(r.Fragment, { children: [
      u,
      /* @__PURE__ */ r.jsx("span", { children: "(1 attempt remaining)" })
    ] }) : Number.isFinite(e.numAttemptsLeft) && (u = /* @__PURE__ */ r.jsxs(r.Fragment, { children: [
      u,
      /* @__PURE__ */ r.jsxs("span", { children: [
        "(",
        e.numAttemptsLeft,
        " attempts remaining)"
      ] })
    ] }));
  }
  let L, y = e.label;
  if (e.labelHasLatex && (y = /* @__PURE__ */ r.jsx(be, { hideUntilTypeset: "first", inline: !0, dynamic: !0, children: y })), e.asToggleButton)
    L = /* @__PURE__ */ r.jsx(
      ye,
      {
        id: B,
        isSelected: C,
        onClick: w,
        value: y,
        disabled: A
      },
      B
    );
  else {
    let n = "container", o = "checkmark";
    A && (n += " container-disabled", o += " checkmark-disabled"), L = /* @__PURE__ */ r.jsxs("label", { className: n, children: [
      /* @__PURE__ */ r.jsx(
        "input",
        {
          type: "checkbox",
          id: B,
          checked: C,
          onChange: w,
          disabled: A
        },
        B
      ),
      /* @__PURE__ */ r.jsx("span", { className: o }),
      y != "" ? /* @__PURE__ */ r.jsx("span", { style: { marginLeft: "2px" }, children: y }) : /* @__PURE__ */ r.jsx("span", { children: y })
    ] });
  }
  return /* @__PURE__ */ r.jsxs(ee.Fragment, { children: [
    /* @__PURE__ */ r.jsxs("span", { id: f, children: [
      /* @__PURE__ */ r.jsx("a", { name: f }),
      L
    ] }),
    u
  ] });
});
export {
  Fe as default
};
