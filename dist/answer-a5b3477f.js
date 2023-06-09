import { u as g, j as e, F as a, f as C, a as j, b as k, c as y } from "./index-8862516e.js";
import A from "react";
import v from "styled-components";
import "react-dom";
const s = v.button`
  position: relative;
  height: 24px;
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
`, F = A.memo(function(x) {
  let { name: L, id: o, SVs: t, actions: d, children: h, callAction: m } = g(x);
  if (t.hidden)
    return null;
  let p = t.disabled, l = () => m({
    action: d.submitAnswer
  });
  t.submitAllAnswersAtAncestor && (l = () => m({
    action: d.submitAllAnswers
  }));
  let c = null;
  if (t.inputChildren.length > 0) {
    let i = t.inputChildren.map((r) => r.componentName);
    c = h.filter(
      //child might be null or a string
      (r) => r && typeof r != "string" && i.includes(
        r.props.componentInstructions.componentName
      )
    );
  }
  if (!t.delegateCheckWork && !t.suppressCheckwork) {
    let i = "unvalidated";
    (t.justSubmitted || t.numAttemptsLeft < 1) && (t.creditAchieved === 1 ? i = "correct" : t.creditAchieved === 0 ? i = "incorrect" : i = "partialcorrect");
    let r = {
      cursor: "pointer",
      padding: "1px 6px 1px 6px"
    };
    p && (r.backgroundColor = getComputedStyle(
      document.documentElement
    ).getPropertyValue("--mainGray"));
    let u = t.submitLabel;
    t.showCorrectness || (u = t.submitLabelNoCorrectness);
    let n = /* @__PURE__ */ e.jsxs(
      s,
      {
        id: o + "_submit",
        tabIndex: "0",
        disabled: p,
        style: r,
        onClick: l,
        onKeyPress: (f) => {
          f.key === "Enter" && l();
        },
        children: [
          /* @__PURE__ */ e.jsx(
            a,
            {
              style: {
                /*marginRight: "4px", paddingLeft: "2px"*/
              },
              icon: C,
              transform: { rotate: 90 }
            }
          ),
          " ",
          u
        ]
      }
    );
    if (t.showCorrectness) {
      if (i === "correct")
        r.backgroundColor = getComputedStyle(
          document.documentElement
        ).getPropertyValue("--mainGreen"), n = /* @__PURE__ */ e.jsxs(s, { id: o + "_correct", style: r, children: [
          /* @__PURE__ */ e.jsx(a, { icon: j }),
          "  Correct"
        ] });
      else if (i === "incorrect")
        r.backgroundColor = getComputedStyle(
          document.documentElement
        ).getPropertyValue("--mainRed"), n = /* @__PURE__ */ e.jsxs(s, { id: o + "_incorrect", style: r, children: [
          /* @__PURE__ */ e.jsx(a, { icon: k }),
          "  Incorrect"
        ] });
      else if (i === "partialcorrect") {
        r.backgroundColor = "#efab34";
        let b = `${Math.round(t.creditAchieved * 100)}% Correct`;
        n = /* @__PURE__ */ e.jsx(s, { id: o + "_partial", style: r, children: b });
      }
    } else
      i !== "unvalidated" && (r.backgroundColor = "rgb(74, 3, 217)", n = /* @__PURE__ */ e.jsxs(s, { id: o + "_saved", style: r, children: [
        /* @__PURE__ */ e.jsx(a, { icon: y }),
        "  Response Saved"
      ] }));
    return t.numAttemptsLeft < 0 ? n = /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
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
    ] })), /* @__PURE__ */ e.jsxs("span", { id: o, style: { marginBottom: "4px" }, children: [
      /* @__PURE__ */ e.jsx("a", { name: o }),
      c,
      n
    ] });
  } else
    return /* @__PURE__ */ e.jsxs("span", { id: o, style: { marginBottom: "4px" }, children: [
      /* @__PURE__ */ e.jsx("a", { name: o }),
      c
    ] });
});
export {
  F as default
};
