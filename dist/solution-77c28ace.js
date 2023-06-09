import { u as g, j as e, V as y, F as c, L as u } from "./index-8862516e.js";
import h, { useEffect as k } from "react";
import R from "styled-components";
import "react-dom";
const S = R.span`
  // display: block;
  // margin: SVs.open ? 12px 4px 0px 4px : 12px 4px 12px 4px;
  // padding: 6px;
  // border: 2px solid black;
  // border-top-left-radius: 5px;
  // border-top-right-radius: 5px;
  // border-bottom-left-radius: SVs.open ? 0px : 5px;
  // border-bottom-right-radius: SVs.open ? 0px : 5px;
  // background-color: var(--mainGray);
  // cursor: pointer;
  &: focus {
    outline: 2px solid var(--canvastext);
    outline-offset: 2px;
  }
`, E = h.memo(function(b) {
  let { name: V, id: a, SVs: o, children: m, actions: i, callAction: t } = g(b), f = (n) => {
    t({
      action: i.recordVisibilityChange,
      args: { isVisible: n }
    });
  };
  k(() => () => {
    t({
      action: i.recordVisibilityChange,
      args: { isVisible: !1 }
    });
  }, []);
  let l = "open";
  if (o.hidden)
    return null;
  let s, d = null, x = { display: "none" }, r, p;
  return o.open ? (s = /* @__PURE__ */ e.jsx(c, { icon: u }), l = "close", d = m, x = {
    display: "block",
    margin: "0px 4px 12px 4px",
    padding: "6px",
    border: "2px solid var(--canvastext)",
    borderTop: "0px",
    borderBottomLeftRadius: "5px",
    borderBottomRightRadius: "5px",
    backgroundColor: "var(--canvas)"
  }, p = (n) => {
    n.key === "Enter" && t({
      action: i.closeSolution
    });
  }, o.canBeClosed ? r = () => {
    t({
      action: i.closeSolution
    });
  } : r = () => {
  }) : (s = /* @__PURE__ */ e.jsx(c, { icon: u, rotation: 90 }), r = () => {
    t({
      action: i.revealSolution
    });
  }, p = (n) => {
    n.key === "Enter" && t({
      action: i.revealSolution
    });
  }), /* @__PURE__ */ e.jsx(y, { partialVisibility: !0, onChange: f, children: /* @__PURE__ */ e.jsxs("aside", { id: a, style: { margin: "12px 0" }, children: [
    /* @__PURE__ */ e.jsx("a", { name: a }),
    /* @__PURE__ */ e.jsxs(
      S,
      {
        style: {
          display: "block",
          margin: o.open ? "12px 4px 0px 4px" : "12px 4px 12px 4px",
          padding: "6px",
          border: "2px solid var(--canvastext)",
          borderTopLeftRadius: "5px",
          borderTopRightRadius: "5px",
          borderBottomLeftRadius: o.open ? "0px" : "5px",
          borderBottomRightRadius: o.open ? "0px" : "5px",
          backgroundColor: "var(--mainGray)",
          cursor: "pointer"
        },
        tabIndex: "0",
        id: a + "_button",
        onClick: r,
        onKeyDown: p,
        children: [
          s,
          " ",
          o.sectionName,
          " ",
          o.message,
          " (click to ",
          l,
          ")"
        ]
      }
    ),
    /* @__PURE__ */ e.jsx("span", { style: x, children: d })
  ] }) });
});
export {
  E as default
};
