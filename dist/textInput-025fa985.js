import { u as ye, R as Ce, r as ke, C as oe, g as le, j as a, F as O, f as we, a as Ve, b as Ae, c as je, M as Ie } from "./index-64c78e6b.js";
import _e, { useState as Ne, useRef as l, useContext as Se, useEffect as Be } from "react";
import { s as ue } from "./css-ab4d83ca.js";
import ee from "styled-components";
import { BoardContext as Pe } from "./graph-0deb1c0a.js";
import "react-dom";
const I = ee.button`
  position: relative;
  height: 24px;
  width: 24px;
  display: inline-block;
  color: white;
  background-color: var(--mainBlue);
  padding: 2px;
  /* border: var(--mainBorder); */
  border: none;
  border-radius: var(--mainBorderRadius);
  margin: 0px 4px 4px 0px;

  &:hover {
    background-color: var(--lightBlue);
    color: black;
  }
`, Re = ee.textarea`
  width: ${(u) => u.width};
  height: ${(u) => u.height}; // Same height as the checkWorkButton, accounting for the borders
  font-size: 14px;
  border: ${(u) => u.disabled ? "2px solid var(--mainGray)" : "var(--mainBorder)"};
  cursor: ${(u) => u.disabled ? "not-allowed" : "auto"};

  &:focus {
    outline: var(--mainBorder);
    outline-offset: 2px;
  }
`, Ee = ee.input`
  width: ${(u) => u.width};
  height: 20px; // Same height as the checkWorkButton, accounting for the borders
  font-size: 14px;
  border: ${(u) => u.disabled ? "2px solid var(--mainGray)" : "var(--mainBorder)"};
  cursor: ${(u) => u.disabled ? "not-allowed" : "auto"};

  &:focus {
    outline: var(--mainBorder);
    outline-offset: 2px;
  }
`;
function se(u) {
  let {
    name: Fe,
    id: f,
    SVs: e,
    actions: p,
    sourceOfUpdate: Le,
    ignoreUpdate: ce,
    rendererName: de,
    callAction: m
  } = ye(u), _ = ue(e.width), pe = ue(e.height);
  se.baseStateVariable = "immediateValue", se.ignoreActionsWithoutCore = (n) => n === "moveInput";
  const [w, W] = Ne(e.immediateValue);
  let C = l(null);
  C.current = w;
  const me = Ce(ke(de));
  let N = l(e.immediateValue), te = l(null), V = l(null), t = l(null), S = l(null), B = l(null);
  const s = Se(Pe);
  let A = l(!1), M = l(!1), h = l(!1), v = l(null), b = l(null), re = l(null), T = l(null), K = l(!1), j = l(!1);
  K.current = e.fixed, j.current = !e.draggable || e.fixLocation || e.fixed, Be(() => () => {
    t.current !== null && he();
  }, []), !ce && V.current !== e.immediateValue ? (W(e.immediateValue), V.current = e.immediateValue, N.current = e.immediateValue) : V.current = null;
  let k = "unvalidated";
  e.valueHasBeenValidated && (e.creditAchieved === 1 ? k = "correct" : e.creditAchieved === 0 ? k = "incorrect" : k = "partialcorrect");
  function P(n) {
    n.key === "Enter" && (N.current = C.current, m({
      action: p.updateValue,
      baseVariableValue: C.current
    }), e.includeCheckWork && !e.suppressCheckwork && !e.expanded && k === "unvalidated" && m({
      action: p.submitAnswer
    }));
  }
  function R(n) {
    if (n.key === "Escape") {
      let r = N.current;
      r !== C.current && (W(r), V.current = e.immediateValue, m({
        action: p.updateImmediateValue,
        args: {
          text: r
        },
        baseVariableValue: r
      }));
    }
  }
  function E(n) {
    te.current = !0;
  }
  function F(n) {
    te.current = !1, N.current = C.current, m({
      action: p.updateValue,
      baseVariableValue: C.current
    });
  }
  function L(n) {
    let r = n.target.value;
    r !== C.current && (W(r), me((x) => {
      let g = { ...x };
      return g.ignoreUpdate = !0, g;
    }), V.current = e.immediateValue, m({
      action: p.updateImmediateValue,
      args: {
        text: r
      },
      baseVariableValue: r
    }));
  }
  function fe() {
    let n = {
      visible: !e.hidden,
      fixed: K.current,
      disabled: e.disabled,
      useMathJax: e.labelHasLatex,
      strokeColor: "var(--canvastext)",
      highlightStrokeColor: "var(--canvastext)",
      highlight: !j.current,
      parse: !1
    }, r;
    try {
      let o = oe.fromAst(e.anchor), y = [
        o.get_component(0).evaluate_to_constant(),
        o.get_component(1).evaluate_to_constant()
      ];
      Number.isFinite(y[0]) || (y[0] = 0, n.visible = !1), Number.isFinite(y[1]) || (y[1] = 0, n.visible = !1), r = s.create("point", y, {
        visible: !1
      });
    } catch {
      n.visible = !1, r = s.create("point", [0, 0], { visible: !1 });
      return;
    }
    n.anchor = r;
    let { anchorx: x, anchory: g } = le(
      e.positionFromAnchor
    );
    n.anchorx = x, n.anchory = g, B.current = [x, g];
    let i = s.create(
      "input",
      [0, 0, w, e.label],
      n
    );
    i.isDraggable = !j.current, i.rendNodeInput.addEventListener("input", L), i.rendNodeInput.addEventListener("keypress", P), i.rendNodeInput.addEventListener("keydown", R), i.rendNodeInput.addEventListener("blur", F), i.rendNodeInput.addEventListener("focus", E), i.rendNodeInput.style.width = _, i.rendNodeInput.style.color = "var(--canvastext)", i.rendNodeInput.style.background = "var(--canvas)", i.rendNodeInput.style.borderColor = "var(--canvastext)", i.rendNodeLabel.style.marginRight = "2px", i.on("down", function(o) {
      A.current = [o.x, o.y], M.current = [...r.coords.scrCoords], h.current = !1;
    }), i.on("hit", function(o) {
      h.current = !1;
    }), i.on("up", function(o) {
      h.current && (m({
        action: p.moveInput,
        args: {
          x: v.current,
          y: b.current
        }
      }), h.current = !1);
    }), i.on("keyfocusout", function(o) {
      h.current && (m({
        action: p.moveInput,
        args: {
          x: v.current,
          y: b.current
        }
      }), h.current = !1);
    }), i.on("drag", function(o) {
      let y = o.type === "pointermove";
      (!y || Math.abs(o.x - A.current[0]) > 0.1 || Math.abs(o.y - A.current[1]) > 0.1) && (h.current = !0);
      let [$, z, H, q] = s.getBoundingBox(), Q = i.size[0] / s.unitX, Z = i.size[1] / s.unitY, ne = B.current[0], ae = B.current[1], J = 0;
      ne === "middle" ? J = -Q / 2 : ne === "right" && (J = -Q);
      let U = 0;
      ae === "middle" ? U = -Z / 2 : ae === "top" && (U = -Z);
      let xe = $ + 0.04 * (H - $) - J - Q, ve = H - 0.04 * (H - $) - J, be = q + 0.04 * (z - q) - U - Z, ge = z - 0.04 * (z - q) - U;
      if (y) {
        var ie = s.origin.scrCoords;
        v.current = (M.current[1] + o.x - A.current[0] - ie[1]) / s.unitX, b.current = (ie[2] - (M.current[2] + o.y - A.current[1])) / s.unitY;
      } else
        v.current = r.X() + i.relativeCoords.usrCoords[1], b.current = r.Y() + i.relativeCoords.usrCoords[2];
      v.current = Math.min(
        ve,
        Math.max(xe, v.current)
      ), b.current = Math.min(
        ge,
        Math.max(be, b.current)
      ), m({
        action: p.moveInput,
        args: {
          x: v.current,
          y: b.current,
          transient: !0,
          skippable: !0
        }
      }), i.relativeCoords.setCoordinates(JXG.COORDS_BY_USER, [0, 0]), r.coords.setCoordinates(
        JXG.COORDS_BY_USER,
        re.current
      );
    }), i.on("keydown", function(o) {
      o.key === "Enter" && h.current && (m({
        action: p.moveInput,
        args: {
          x: v.current,
          y: b.current
        }
      }), h.current = !1);
    }), t.current = i, S.current = r, T.current = e.positionFromAnchor, e.labelHasLatex && setTimeout(() => {
      t.current && (t.current.needsUpdate = !0, t.current.setText(e.label), t.current.update(), s == null || s.updateRenderer());
    }, 1e3);
  }
  function he() {
    t.current.rendNodeInput.removeEventListener(
      "input",
      L
    ), t.current.rendNodeInput.removeEventListener(
      "keypress",
      P
    ), t.current.rendNodeInput.removeEventListener(
      "keydown",
      R
    ), t.current.rendNodeInput.removeEventListener("blur", F), t.current.rendNodeInput.removeEventListener("focus", E), t.current.off("drag"), t.current.off("down"), t.current.off("hit"), t.current.off("up"), t.current.off("keyfocusout"), t.current.off("keydown"), s.removeObject(t.current), t.current = null;
  }
  if (s) {
    let n;
    try {
      let r = oe.fromAst(e.anchor);
      n = [
        r.get_component(0).evaluate_to_constant(),
        r.get_component(1).evaluate_to_constant()
      ];
    } catch {
      n = [NaN, NaN];
    }
    if (re.current = n, t.current === null)
      fe();
    else {
      t.current.Value() !== w && t.current.set(w), t.current.relativeCoords.setCoordinates(
        JXG.COORDS_BY_USER,
        [0, 0]
      ), S.current.coords.setCoordinates(
        JXG.COORDS_BY_USER,
        n
      ), t.current.setText(e.label), t.current.rendNodeInput.style.width = _;
      let r = !e.hidden;
      if (Number.isFinite(n[0]) && Number.isFinite(n[1])) {
        let x = t.current.visProp.visible !== r;
        t.current.visProp.visible = r, t.current.visPropCalc.visible = r, x && t.current.setAttribute({ visible: r });
      } else
        t.current.visProp.visible = !1, t.current.visPropCalc.visible = !1;
      if (t.current.visProp.disabled !== e.disabled && (t.current.visProp.disabled = e.disabled, t.current.setAttribute({ disabled: e.disabled })), t.current.visProp.highlight = !j.current, t.current.visProp.fixed = K.current, t.current.isDraggable = !j.current, t.current.needsUpdate = !0, e.positionFromAnchor !== T.current) {
        let { anchorx: x, anchory: g } = le(
          e.positionFromAnchor
        );
        t.current.visProp.anchorx = x, t.current.visProp.anchory = g, B.current = [x, g], T.current = e.positionFromAnchor, t.current.fullUpdate();
      } else
        t.current.update();
      S.current.needsUpdate = !0, S.current.update(), s.updateRenderer();
    }
    return /* @__PURE__ */ a.jsx("a", { name: f });
  }
  if (e.hidden)
    return null;
  let G = e.disabled;
  const X = f + "_input";
  let c = {
    cursor: "pointer",
    padding: "1px 6px 1px 6px"
  };
  G && (c.backgroundColor = getComputedStyle(
    document.documentElement
  ).getPropertyValue("--mainGray"), c.cursor = "not-allowed", c.color = "black");
  let d = null;
  if (e.includeCheckWork && !e.suppressCheckwork) {
    if (k === "unvalidated")
      d = /* @__PURE__ */ a.jsx(
        I,
        {
          id: f + "_submit",
          tabIndex: "0",
          disabled: G,
          style: c,
          onClick: () => m({
            action: p.submitAnswer
          }),
          onKeyPress: (n) => {
            n.key === "Enter" && m({
              action: p.submitAnswer
            });
          },
          children: /* @__PURE__ */ a.jsx(
            O,
            {
              style: {
                /*marginRight: "4px", paddingLeft: "2px"*/
              },
              icon: we,
              transform: { rotate: 90 }
            }
          )
        }
      );
    else if (e.showCorrectness)
      if (k === "correct")
        c.backgroundColor = getComputedStyle(
          document.documentElement
        ).getPropertyValue("--mainGreen"), d = /* @__PURE__ */ a.jsx(I, { id: f + "_correct", style: c, children: /* @__PURE__ */ a.jsx(O, { icon: Ve }) });
      else if (k === "partialcorrect") {
        let r = `${Math.round(e.creditAchieved * 100)} %`;
        c.width = "44px", c.backgroundColor = "#efab34", d = /* @__PURE__ */ a.jsx(I, { id: f + "_partial", style: c, children: r });
      } else
        c.backgroundColor = getComputedStyle(
          document.documentElement
        ).getPropertyValue("--mainRed"), d = /* @__PURE__ */ a.jsx(I, { id: f + "_incorrect", style: c, children: /* @__PURE__ */ a.jsx(O, { icon: Ae }) });
    else
      c.backgroundColor = "rgb(74, 3, 217)", c.padding = "1px 8px 1px 4px", d = /* @__PURE__ */ a.jsx(I, { id: f + "_saved", style: c, children: /* @__PURE__ */ a.jsx(O, { icon: je }) });
    e.numAttemptsLeft < 0 ? d = /* @__PURE__ */ a.jsxs(a.Fragment, { children: [
      d,
      /* @__PURE__ */ a.jsx("span", { children: "(no attempts remaining)" })
    ] }) : e.numAttemptsLeft == 1 ? d = /* @__PURE__ */ a.jsxs(a.Fragment, { children: [
      d,
      /* @__PURE__ */ a.jsx("span", { children: "(1 attempt remaining)" })
    ] }) : Number.isFinite(e.numAttemptsLeft) && (d = /* @__PURE__ */ a.jsxs(a.Fragment, { children: [
      d,
      /* @__PURE__ */ a.jsxs("span", { children: [
        "(attempts remaining: ",
        e.numAttemptsLeft,
        ")"
      ] })
    ] }));
  }
  let Y, D = e.label;
  return e.labelHasLatex && (D = /* @__PURE__ */ a.jsx(Ie, { hideUntilTypeset: "first", inline: !0, dynamic: !0, children: D })), e.expanded ? Y = /* @__PURE__ */ a.jsxs("label", { style: { display: "inline-flex", maxWidth: "100%" }, children: [
    D,
    /* @__PURE__ */ a.jsx(
      Re,
      {
        id: X,
        value: w,
        disabled: G,
        onChange: L,
        onKeyPress: P,
        onKeyDown: R,
        onBlur: F,
        onFocus: E,
        width: _,
        height: pe,
        style: {
          margin: "0px 4px 4px 4px",
          color: "var(--canvastext)",
          background: "var(--canvas)"
        }
      },
      X
    )
  ] }) : Y = /* @__PURE__ */ a.jsxs("label", { style: { display: "inline-flex", maxWidth: "100%" }, children: [
    D,
    /* @__PURE__ */ a.jsx(
      Ee,
      {
        id: X,
        value: w,
        disabled: G,
        onChange: L,
        onKeyPress: P,
        onKeyDown: R,
        onBlur: F,
        onFocus: E,
        width: _,
        style: {
          margin: "0px 4px 4px 4px",
          color: "var(--canvastext)",
          background: "var(--canvas)"
        }
      },
      X
    )
  ] }), /* @__PURE__ */ a.jsxs(_e.Fragment, { children: [
    /* @__PURE__ */ a.jsx("a", { name: f }),
    /* @__PURE__ */ a.jsxs(
      "span",
      {
        className: "textInputSurroundingBox",
        id: f,
        style: { display: "inline-flex", maxWidth: "100%" },
        children: [
          Y,
          d
        ]
      }
    )
  ] });
}
export {
  se as default
};
