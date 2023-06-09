import { u as $, R as w, r as q, s as z, v as H, d as E, w as J, x as X, j as a, F as g, f as Q, a as Y, b as Z, c as ee, M as te } from "./index-8862516e.js";
import ae, { useState as A, useRef as b } from "react";
import re from "styled-components";
import { r as W } from "./index-41dc7953.js";
import "./mathInput-4ed993c7.js";
import "react-dom";
W.addStyles();
const x = re.button`
  position: relative;
  width: 24px;
  height: 24px;
  color: #ffffff;
  background-color: var(--mainBlue);
  display: inline-block;
  text-align: center;
  padding: 2px;
  z-index: 0;
  /* border: var(--mainBorder); */
  border: none;
  border-radius: var(--mainBorderRadius);
  margin: 0px 4px 4px 0px;

  &:hover {
    background-color: var(--lightBlue);
    color: black;
  }
`;
function ne(P) {
  let {
    name: se,
    id: i,
    SVs: e,
    actions: m,
    sourceOfUpdate: le,
    ignoreUpdate: _,
    rendererName: B,
    callAction: p
  } = $(P);
  ne.baseStateVariable = "rawRendererValue";
  const [c, M] = A(null), [T, j] = A(null), d = b(null), L = w(q(B));
  let h = b(e.rawRendererValue), v = b(e.includeCheckWork && !e.suppressCheckwork);
  v.current = e.includeCheckWork && !e.suppressCheckwork, _ || (h.current = e.rawRendererValue);
  let o = b(null);
  const V = w(z), F = w(H), y = E(J), k = E(X), D = () => {
    o.current = "unvalidated", e.valueHasBeenValidated && (e.creditAchieved === 1 ? o.current = "correct" : e.creditAchieved === 0 ? o.current = "incorrect" : o.current = "partialcorrect");
  }, I = (t) => {
    if (c.focus(), !t) {
      console.log("Empty value");
      return;
    }
    const n = t.split(" ")[0], u = t.substring(n.length + 1);
    n == "cmd" ? c.cmd(u) : n == "write" ? c.write(u) : n == "keystroke" ? c.keystroke(u) : n == "type" && c.typedText(u);
  }, O = (t) => {
    console.log("no mathinput field focused");
  }, N = (t) => {
    console.log("no mathinput field focused");
  }, R = (t) => {
    p({
      action: m.updateValue,
      baseVariableValue: h.current
    }), v.current && o.current === "unvalidated" && p({
      action: m.submitAnswer
    });
  }, G = (t) => {
    V(() => I), F(() => R), j(!0);
  }, K = (t) => {
    var l, n;
    (l = y == null ? void 0 : y.current) != null && l.contains(t.relatedTarget) ? setTimeout(() => {
      c.focus();
    }, 100) : (n = k == null ? void 0 : k.current) != null && n.contains(t.relatedTarget) ? setTimeout(() => {
      c.focus();
    }, 100) : (p({
      action: m.updateValue,
      baseVariableValue: h.current
    }), V(() => O), F(() => N)), j(!1);
  }, U = (t) => {
    var l;
    t.replace(/\s/g, "").replace(/\^{(\w)}/g, "^$1") !== ((l = h.current) == null ? void 0 : l.replace(/\s/g, "").replace(/\^{(\w)}/g, "^$1")) && (h.current = t, L((n) => {
      let u = { ...n };
      return u.ignoreUpdate = !0, u;
    }), p({
      action: m.updateRawValue,
      args: {
        rawRendererValue: t
      },
      baseVariableValue: t
    }));
  };
  if (e.hidden)
    return null;
  D();
  let r = {
    cursor: "pointer",
    padding: "1px 6px 1px 6px"
  }, f = {
    /* Set each border attribute separately since the borderColor is updated during rerender (checking mathInput's disabled state)
    Currently does not work with border: "var(--mainBorder)" */
    borderColor: "var(--canvastext)",
    borderStyle: "solid",
    borderWidth: "2px",
    margin: "0px",
    boxShadow: "none",
    outlineOffset: "2px",
    outlineColor: "var(--canvastext)",
    outlineWidth: "2px",
    minWidth: `${e.minWidth > 0 ? e.minWidth : 0}px`
  };
  T && (f.outlineStyle = "solid");
  let S = "allowed";
  e.disabled && (r.backgroundColor = getComputedStyle(
    document.documentElement
  ).getPropertyValue("--mainGray"), r.color = "black", r.cursor = "not-allowed", f.borderColor = getComputedStyle(
    document.documentElement
  ).getPropertyValue("--mainGray"), f.backgroundColor = "rgba(239, 239, 239, 0.3)", f.pointerEvents = "none", S = "not-allowed"), d.current && d.current.disabled !== e.disabled && (d.current.disabled = e.disabled);
  let s = null;
  if (e.includeCheckWork && !e.suppressCheckwork) {
    if (o.current === "unvalidated")
      s = /* @__PURE__ */ a.jsx(
        x,
        {
          id: i + "_submit",
          tabIndex: "0",
          disabled: e.disabled,
          style: r,
          onClick: () => p({
            action: m.submitAnswer
          }),
          onKeyPress: (t) => {
            t.key === "Enter" && p({
              action: m.submitAnswer
            });
          },
          children: /* @__PURE__ */ a.jsx(g, { icon: Q, transform: { rotate: 90 } })
        }
      );
    else if (e.showCorrectness)
      if (o.current === "correct")
        r.backgroundColor = getComputedStyle(
          document.documentElement
        ).getPropertyValue("--mainGreen"), s = /* @__PURE__ */ a.jsx(x, { id: i + "_correct", style: r, children: /* @__PURE__ */ a.jsx(g, { icon: Y }) });
      else if (o.current === "partialcorrect") {
        let l = `${Math.round(e.creditAchieved * 100)} %`;
        r.width = "44px", r.backgroundColor = "#efab34", s = /* @__PURE__ */ a.jsx(x, { id: i + "_partial", style: r, children: l });
      } else
        r.backgroundColor = getComputedStyle(
          document.documentElement
        ).getPropertyValue("--mainRed"), s = /* @__PURE__ */ a.jsx(x, { id: i + "_incorrect", style: r, children: /* @__PURE__ */ a.jsx(g, { icon: Z }) });
    else
      r.backgroundColor = "rgb(74, 3, 217)", r.padding = "1px 8px 1px 4px", s = /* @__PURE__ */ a.jsx(x, { id: i + "_saved", style: r, children: /* @__PURE__ */ a.jsx(g, { icon: ee }) });
    e.numAttemptsLeft < 0 ? s = /* @__PURE__ */ a.jsxs(a.Fragment, { children: [
      s,
      /* @__PURE__ */ a.jsx("span", { children: "(no attempts remaining)" })
    ] }) : e.numAttemptsLeft == 1 ? s = /* @__PURE__ */ a.jsxs(a.Fragment, { children: [
      s,
      /* @__PURE__ */ a.jsx("span", { children: "(1 attempt remaining)" })
    ] }) : Number.isFinite(e.numAttemptsLeft) && (s = /* @__PURE__ */ a.jsxs(a.Fragment, { children: [
      s,
      /* @__PURE__ */ a.jsxs("span", { children: [
        "(",
        e.numAttemptsLeft,
        " attempts remaining)"
      ] })
    ] }));
  }
  let C = e.label;
  return e.labelHasLatex && (C = /* @__PURE__ */ a.jsx(te, { hideUntilTypeset: "first", inline: !0, dynamic: !0, children: C })), /* @__PURE__ */ a.jsxs(ae.Fragment, { children: [
    /* @__PURE__ */ a.jsx("a", { name: i }),
    /* @__PURE__ */ a.jsxs("span", { id: i, children: [
      /* @__PURE__ */ a.jsxs("label", { style: { display: "inline-flex", maxWidth: "100%" }, children: [
        C,
        /* @__PURE__ */ a.jsx(
          "div",
          {
            className: "mathInputWrapper",
            style: { cursor: S },
            children: /* @__PURE__ */ a.jsx(
              W.EditableMathField,
              {
                style: f,
                latex: h.current,
                config: {
                  autoCommands: "alpha beta gamma delta epsilon zeta eta mu nu xi omega rho sigma tau phi chi psi omega iota kappa lambda Gamma Delta Xi Omega Sigma Phi Psi Omega Lambda sqrt pi Pi theta Theta integral infinity forall exists",
                  autoOperatorNames: "arg deg det dim exp gcd hom ker lg lim ln log max min Pr cos cosh acos acosh arccos arccosh cot coth acot acoth arccot arccoth csc csch acsc acsch arccsc arccsch sec sech asec asech arcsec arcsech sin sinh asin asinh arcsin arcsinh tan tanh atan atanh arctan arctanh nPr nCr",
                  handlers: {
                    enter: R
                  },
                  substituteTextarea: function() {
                    return d.current = document.createElement("textarea"), d.current.disabled = e.disabled, d.current.addEventListener(
                      "focusout",
                      (t) => {
                        Array.from(
                          document.getElementsByClassName("keyboard")
                        ).forEach((n) => {
                          n != null && n.contains(t.relatedTarget) && t.target.focus();
                        });
                      },
                      !1
                    ), d.current;
                  }
                },
                onChange: (t) => {
                  U(t.latex());
                },
                onBlur: K,
                onFocus: G,
                mathquillDidMount: (t) => {
                  M(t);
                }
              }
            )
          }
        )
      ] }),
      s
    ] })
  ] });
}
export {
  ne as default
};
