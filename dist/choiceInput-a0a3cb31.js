import "./choiceInput.css";
import { u as P, R as W, r as T, j as e, F as x, f as _, a as I, b as w, c as L, M as H } from "./index-7c50cb13.js";
import N, { useState as O, useRef as G } from "react";
import U from "styled-components";
const u = U.button`
  position: relative;
  /* width: 24px; */
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
`, X = N.memo(function F(R) {
  let {
    name: K,
    id: s,
    SVs: t,
    actions: b,
    children: D,
    sourceOfUpdate: $,
    ignoreUpdate: V,
    rendererName: E,
    callAction: g
  } = P(R);
  F.baseStateVariable = "selectedIndices";
  const [f, A] = O(
    t.selectedIndices
  ), B = W(T(E));
  let y = G(null);
  !V && y.current !== t.selectedIndices ? (A(t.selectedIndices), y.current = t.selectedIndices) : y.current = null;
  let d = "unvalidated";
  (t.valueHasBeenValidated || t.numAttemptsLeft < 1) && (t.creditAchieved === 1 ? d = "correct" : t.creditAchieved === 0 ? d = "incorrect" : d = "partialcorrect");
  function S(i) {
    let n = [];
    if (t.inline)
      i.target.value && (n = Array.from(
        i.target.selectedOptions,
        (r) => Number(r.value)
      ));
    else if (t.selectMultiple) {
      n = [...f];
      let r = Number(i.target.value);
      if (i.target.checked)
        n.includes(r) || (n.push(r), n.sort((a, c) => a - c));
      else {
        let a = n.indexOf(r);
        a !== -1 && n.splice(a, 1);
      }
    } else
      n = [Number(i.target.value)];
    (f.length !== n.length || f.some((r, a) => r != n[a])) && (A(n), y.current = t.selectedIndices, B((r) => {
      let a = { ...r };
      return a.ignoreUpdate = !0, a;
    }), g({
      action: b.updateSelectedIndices,
      args: {
        selectedIndices: n
      },
      baseVariableValue: n
    }));
  }
  if (t.hidden)
    return null;
  let m = t.disabled, C = t.label;
  if (t.labelHasLatex && (C = /* @__PURE__ */ e.jsx(H, { hideUntilTypeset: "first", inline: !0, dynamic: !0, children: C })), t.inline) {
    let i = {
      cursor: "pointer",
      padding: "1px 6px 1px 6px",
      width: "24px"
    }, n = null;
    if (t.includeCheckWork && !t.suppressCheckwork) {
      if (d === "unvalidated")
        m && (i.backgroundColor = getComputedStyle(
          document.documentElement
        ).getPropertyValue("--mainGray")), n = /* @__PURE__ */ e.jsx(
          u,
          {
            id: s + "_submit",
            disabled: m,
            tabIndex: "0",
            style: i,
            onClick: () => g({
              action: b.submitAnswer
            }),
            onKeyPress: (p) => {
              p.key === "Enter" && g({
                action: b.submitAnswer
              });
            },
            children: /* @__PURE__ */ e.jsx(
              x,
              {
                style: {
                  /*marginRight: "4px", paddingLeft: "2px"*/
                },
                icon: _,
                transform: { rotate: 90 }
              }
            )
          }
        );
      else if (t.showCorrectness)
        if (d === "correct")
          i.backgroundColor = getComputedStyle(
            document.documentElement
          ).getPropertyValue("--mainGreen"), n = /* @__PURE__ */ e.jsx(u, { id: s + "_correct", style: i, children: /* @__PURE__ */ e.jsx(x, { icon: I }) });
        else if (d === "partialcorrect") {
          let o = `${Math.round(t.creditAchieved * 100)} %`;
          i.width = "44px", i.backgroundColor = "#efab34", n = /* @__PURE__ */ e.jsx(u, { id: s + "_partial", style: i, children: o });
        } else
          i.backgroundColor = getComputedStyle(
            document.documentElement
          ).getPropertyValue("--mainRed"), n = /* @__PURE__ */ e.jsx(u, { id: s + "_incorrect", style: i, children: /* @__PURE__ */ e.jsx(x, { icon: w }) });
      else
        i.backgroundColor = "rgb(74, 3, 217)", i.padding = "1px 8px 1px 4px", n = /* @__PURE__ */ e.jsx(u, { id: s + "_saved", style: i, children: /* @__PURE__ */ e.jsx(x, { icon: L }) });
      t.numAttemptsLeft < 0 ? n = /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
        n,
        /* @__PURE__ */ e.jsx("span", { children: "(no attempts remaining)" })
      ] }) : t.numAttemptsLeft == 1 ? n = /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
        n,
        /* @__PURE__ */ e.jsx("span", { children: "(1 attempt remaining)" })
      ] }) : Number.isFinite(t.numAttemptsLeft) && (n = /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
        n,
        /* @__PURE__ */ e.jsxs("span", { children: [
          "(",
          t.numAttemptsLeft,
          " attempts remaining)"
        ] })
      ] }));
    }
    let r = t, a = t.choiceTexts.map(function(p, o) {
      return r.choicesHidden[o] ? null : /* @__PURE__ */ e.jsx("option", { value: o + 1, disabled: r.choicesDisabled[o], children: p }, o + 1);
    }), c = f;
    return c === void 0 ? c = "" : t.selectMultiple || (c = c[0], c === void 0 && (c = "")), /* @__PURE__ */ e.jsxs(N.Fragment, { children: [
      /* @__PURE__ */ e.jsx("a", { name: s }),
      /* @__PURE__ */ e.jsxs(
        "label",
        {
          style: { display: "inline-flex", maxWidth: "100%" },
          id: s + "-label",
          children: [
            C,
            /* @__PURE__ */ e.jsxs(
              "select",
              {
                className: "custom-select",
                id: s,
                onChange: S,
                value: c,
                disabled: m,
                multiple: t.selectMultiple,
                children: [
                  /* @__PURE__ */ e.jsx("option", { hidden: !0, value: "", children: t.placeHolder }),
                  a
                ]
              }
            )
          ]
        }
      ),
      n
    ] });
  } else {
    let i = {
      height: "24px",
      display: "inline-block",
      padding: "1px 6px 1px 6px",
      cursor: "pointer"
      // fontWeight: "bold",
    }, n = null;
    if (t.includeCheckWork && !t.suppressCheckwork)
      if (d === "unvalidated") {
        let h = t.submitLabel;
        t.showCorrectness || (h = t.submitLabelNoCorrectness), m && (i.backgroundColor = getComputedStyle(
          document.documentElement
        ).getPropertyValue("--mainGray")), n = /* @__PURE__ */ e.jsxs(
          u,
          {
            id: s + "_submit",
            tabIndex: "0",
            disabled: m,
            style: i,
            onClick: () => g({
              action: b.submitAnswer
            }),
            onKeyPress: (l) => {
              l.key === "Enter" && g({
                action: b.submitAnswer
              });
            },
            children: [
              /* @__PURE__ */ e.jsx(
                x,
                {
                  style: {
                    /*marginRight: "4px", paddingLeft: "2px"*/
                  },
                  icon: _,
                  transform: { rotate: 90 }
                }
              ),
              " ",
              h
            ]
          }
        );
      } else if (t.showCorrectness) {
        if (d === "correct")
          i.backgroundColor = getComputedStyle(
            document.documentElement
          ).getPropertyValue("--mainGreen"), n = /* @__PURE__ */ e.jsxs(u, { id: s + "_correct", style: i, children: [
            /* @__PURE__ */ e.jsx(x, { icon: I }),
            "  Correct"
          ] });
        else if (d === "incorrect")
          i.backgroundColor = getComputedStyle(
            document.documentElement
          ).getPropertyValue("--mainRed"), n = /* @__PURE__ */ e.jsxs(u, { id: s + "_incorrect", style: i, children: [
            /* @__PURE__ */ e.jsx(x, { icon: w }),
            "  Incorrect"
          ] });
        else if (d === "partialcorrect") {
          i.backgroundColor = "#efab34";
          let l = `${Math.round(t.creditAchieved * 100)}% Correct`;
          n = /* @__PURE__ */ e.jsx(u, { id: s + "_partial", style: i, children: l });
        }
      } else
        i.backgroundColor = "rgb(74, 3, 217)", n = /* @__PURE__ */ e.jsxs(u, { id: s + "_saved", style: i, children: [
          /* @__PURE__ */ e.jsx(x, { icon: L }),
          "  Response Saved"
        ] });
    t.numAttemptsLeft < 0 ? n = /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
      n,
      /* @__PURE__ */ e.jsx("span", { children: "(no attempts remaining)" })
    ] }) : t.numAttemptsLeft == 1 ? n = /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
      n,
      /* @__PURE__ */ e.jsx("span", { children: "(1 attempt remaining)" })
    ] }) : Number.isFinite(t.numAttemptsLeft) && (n = /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
      n,
      /* @__PURE__ */ e.jsxs("span", { children: [
        "(",
        t.numAttemptsLeft,
        " attempts remaining)"
      ] })
    ] }));
    let r = s, a = {
      listStyleType: "none"
    }, c = r + "_choice", p = "radio";
    t.selectMultiple && (p = "checkbox");
    let o = t, M = t.choiceOrder.map((h) => D[h - 1]).map(function(h, l) {
      if (o.choicesHidden[l])
        return null;
      if (p == "radio") {
        let v = m || o.choicesDisabled[l], k = "radio-container", j = "radio-checkmark";
        return v && (k += " radio-container-disabled", j += " radio-checkmark-disabled"), /* @__PURE__ */ e.jsxs(
          "label",
          {
            className: k,
            children: [
              /* @__PURE__ */ e.jsx(
                "input",
                {
                  type: "radio",
                  id: c + (l + 1) + "_input",
                  name: r,
                  value: l + 1,
                  checked: f.includes(l + 1),
                  onChange: S,
                  disabled: v
                }
              ),
              /* @__PURE__ */ e.jsx("span", { className: j }),
              /* @__PURE__ */ e.jsx(
                "label",
                {
                  htmlFor: c + (l + 1) + "_input",
                  style: { marginLeft: "2px" },
                  children: h
                }
              )
            ]
          },
          r + "_choice" + (l + 1)
        );
      } else if (p == "checkbox") {
        let v = m || o.choicesDisabled[l], k = "checkbox-container", j = "checkbox-checkmark";
        return v && (k += " checkbox-container-disabled", j += " checkbox-checkmark-disabled"), /* @__PURE__ */ e.jsxs(
          "label",
          {
            className: k,
            children: [
              /* @__PURE__ */ e.jsx(
                "input",
                {
                  type: "checkbox",
                  id: c + (l + 1) + "_input",
                  name: r,
                  value: l + 1,
                  checked: f.includes(l + 1),
                  onChange: S,
                  disabled: m || o.choicesDisabled[l]
                }
              ),
              /* @__PURE__ */ e.jsx("span", { className: j }),
              /* @__PURE__ */ e.jsx(
                "label",
                {
                  htmlFor: c + (l + 1) + "_input",
                  style: { marginLeft: "2px" },
                  children: h
                }
              )
            ]
          },
          r + "_choice" + (l + 1)
        );
      }
    });
    return /* @__PURE__ */ e.jsxs("div", { id: r + "-label", children: [
      C,
      /* @__PURE__ */ e.jsxs("ol", { id: r, style: a, children: [
        /* @__PURE__ */ e.jsx("a", { name: s }),
        M
      ] }),
      n
    ] });
  }
});
export {
  X as default
};
