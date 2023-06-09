import { u as k, j as e, F as m, f as A, a as R, b as _, c as B, E as p } from "./index-dce15b2c.js";
import b, { useRef as I } from "react";
import { A as C } from "./ActionButtonGroup-fdd0712e.js";
import j from "styled-components";
/* empty css                    */const S = j.div`
  position: relative;
  margin: 6px;
  display: inline-block;
  vertical-align: middle;
  width: auto;

  :before {
    content: "";
    position: absolute;
    left: -6px;
    top: -6px;
    border: var(--mainBorder);
    border-right: 0px;
    width: 6px;
    height: 100%;
    padding-top: 6px;
    padding-bottom: 3px;
  }

  :after {
    content: "";
    position: absolute;
    right: -6px;
    top: -6px;
    border: var(--mainBorder);
    border-left: 0px;
    width: 6px;
    height: 100%;
    padding-top: 6px;
    padding-bottom: 3px;
  }
`, c = j.button`
  position: relative;
  width: 24px;
  height: 24px;
  display: inline-block;
  color: white;
  background-color: var(--mainBlue);
  /* border: var(--mainBorder); */
  padding: 2px;
  border: none;
  border-radius: var(--mainBorderRadius);
  margin: 0px 4px 4px 0px;

  &:hover {
    background-color: var(--lightBlue);
    color: black;
  }
`, G = b.memo(function(y) {
  let { name: E, id: n, SVs: t, actions: s, children: w, callAction: a } = k(y), l = I(null);
  function v() {
    l.current = "unvalidated", (t.valueHasBeenValidated || t.numAttemptsLeft < 1) && (t.creditAchieved === 1 ? l.current = "correct" : t.creditAchieved === 0 ? l.current = "incorrect" : l.current = "partialcorrect");
  }
  if (t.hidden)
    return null;
  v();
  let x = t.disabled;
  getComputedStyle(
    document.documentElement
  ).getPropertyValue("--mainGray");
  let r = {
    cursor: "pointer",
    padding: "1px 6px 1px 6px"
  }, i = null;
  if (t.includeCheckWork && !t.suppressCheckwork) {
    if (l.current === "unvalidated")
      x && (r.backgroundColor = getComputedStyle(
        document.documentElement
      ).getPropertyValue("--mainGray")), i = /* @__PURE__ */ e.jsx(
        c,
        {
          id: n + "_submit",
          tabIndex: "0",
          disabled: x,
          style: r,
          onClick: () => a({
            action: s.submitAnswer
          }),
          onKeyPress: (o) => {
            o.key === "Enter" && a({
              action: s.submitAnswer
            });
          },
          children: /* @__PURE__ */ e.jsx(m, { icon: A, transform: { rotate: 90 } })
        }
      );
    else if (t.showCorrectness)
      if (l.current === "correct")
        r.backgroundColor = getComputedStyle(
          document.documentElement
        ).getPropertyValue("--mainGreen"), i = /* @__PURE__ */ e.jsx(c, { id: n + "_correct", style: r, children: /* @__PURE__ */ e.jsx(m, { icon: R }) });
      else if (l.current === "partialcorrect") {
        let u = `${Math.round(t.creditAchieved * 100)} %`;
        r.width = "44px", r.backgroundColor = "#efab34", i = /* @__PURE__ */ e.jsx(c, { id: n + "_partial", style: r, children: u });
      } else
        r.backgroundColor = getComputedStyle(
          document.documentElement
        ).getPropertyValue("--mainRed"), i = /* @__PURE__ */ e.jsx(c, { id: n + "_incorrect", style: r, children: /* @__PURE__ */ e.jsx(m, { icon: _ }) });
    else
      r.backgroundColor = "rgb(74, 3, 217)", r.padding = "1px 8px 1px 4px", i = /* @__PURE__ */ e.jsx(c, { id: n + "_saved", style: r, children: /* @__PURE__ */ e.jsx(m, { icon: B }) });
    t.numAttemptsLeft < 0 ? i = /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
      i,
      /* @__PURE__ */ e.jsx("span", { children: "(no attempts remaining)" })
    ] }) : t.numAttemptsLeft == 1 ? i = /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
      i,
      /* @__PURE__ */ e.jsx("span", { children: "(1 attempt remaining)" })
    ] }) : t.numAttemptsLeft < 1 / 0 && (i = /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
      i,
      /* @__PURE__ */ e.jsxs("span", { children: [
        "(",
        t.numAttemptsLeft,
        " attempts remaining)"
      ] })
    ] }));
  }
  let h = [];
  for (let o = 0; o < t.numRows; o++) {
    let u = [];
    for (let d = 0; d < t.numColumns; d++)
      u.push(
        /* @__PURE__ */ e.jsx(
          "td",
          {
            className: "matrixCell",
            id: n + "_component_" + o + "_" + d,
            children: w[o * t.numColumns + d]
          },
          d
        )
      );
    h.push(/* @__PURE__ */ e.jsx("tr", { children: u }, o));
  }
  let g = null;
  t.showSizeControls && (g = /* @__PURE__ */ e.jsx("span", { style: { margin: "0px 4px 4px 0px" }, children: /* @__PURE__ */ e.jsxs(C, { children: [
    /* @__PURE__ */ e.jsx(
      p,
      {
        id: n + "_rowDecrement",
        value: "r-",
        onClick: () => a({
          action: s.updateNumRows,
          args: { numRows: t.numRows - 1 }
        }),
        disabled: t.numRows < 2,
        children: "r-"
      }
    ),
    /* @__PURE__ */ e.jsx(
      p,
      {
        id: n + "_rowIncrement",
        value: "r+",
        onClick: () => a({
          action: s.updateNumRows,
          args: { numRows: t.numRows + 1 }
        }),
        children: "r+"
      }
    )
  ] }) }));
  let f = null;
  return t.showSizeControls && (f = /* @__PURE__ */ e.jsx("span", { style: { margin: "0px 4px 4px 0px" }, children: /* @__PURE__ */ e.jsxs(C, { children: [
    /* @__PURE__ */ e.jsx(
      p,
      {
        id: n + "_columnDecrement",
        value: "c-",
        onClick: () => a({
          action: s.updateNumColumns,
          args: { numColumns: t.numColumns - 1 }
        }),
        disabled: t.numColumns < 2,
        children: "c-"
      }
    ),
    /* @__PURE__ */ e.jsx(
      p,
      {
        id: n + "_columnIncrement",
        value: "c+",
        onClick: () => a({
          action: s.updateNumColumns,
          args: { numColumns: t.numColumns + 1 }
        }),
        children: "c+"
      }
    )
  ] }) })), /* @__PURE__ */ e.jsxs(b.Fragment, { children: [
    /* @__PURE__ */ e.jsx("a", { name: n }),
    /* @__PURE__ */ e.jsxs("div", { style: { display: "inline-flex", margin: "0px 4px 4px 4px" }, children: [
      /* @__PURE__ */ e.jsx(S, { className: "matrixInputSurroundingBox", id: n, children: /* @__PURE__ */ e.jsx("table", { children: /* @__PURE__ */ e.jsx("tbody", { children: h }) }) }),
      /* @__PURE__ */ e.jsx("div", { style: { marginRight: "4px" } }),
      g,
      f,
      i
    ] })
  ] });
});
export {
  G as default
};
