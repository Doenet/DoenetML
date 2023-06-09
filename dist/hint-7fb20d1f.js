import { u as y, j as t, V as R, F as b, m as k } from "./index-64c78e6b.js";
import v, { useEffect as C } from "react";
import { a as j } from "./index.es-7d451cd6.js";
import V from "styled-components";
import "react-dom";
const H = V.span`
  &: focus {
    outline: 2px solid var(--canvastext);
    outline-offset: 2px;
  }
`, I = v.memo(function(g) {
  var m;
  let { name: L, id: s, SVs: e, children: a, actions: o, callAction: n } = y(g), h = (i) => {
    n({
      action: o.recordVisibilityChange,
      args: { isVisible: i }
    });
  };
  if (C(() => () => {
    n({
      action: o.recordVisibilityChange,
      args: { isVisible: !1 }
    });
  }, []), !e.showHints)
    return null;
  let r;
  if (e.titleChildName) {
    for (let [i, l] of a.entries())
      if (((m = l == null ? void 0 : l.props) == null ? void 0 : m.componentInstructions.componentName) === e.titleChildName) {
        r = a[i], a.splice(i, 1);
        break;
      }
  }
  r || (r = e.title);
  let p = /* @__PURE__ */ t.jsx(b, { icon: k }), c = null, d = { display: "none" }, x = () => {
    n({
      action: o.revealHint
    });
  }, u = (i) => {
    i.key === "Enter" && n({
      action: o.revealHint
    });
  }, f = "open";
  return e.open && (f = "close", p = /* @__PURE__ */ t.jsx(b, { icon: j }), c = a, d = {
    display: "block",
    margin: "0px 4px 12px 4px",
    padding: "6px",
    border: "2px solid var(--canvastext)",
    borderTop: "0px",
    borderBottomLeftRadius: "5px",
    borderBottomRightRadius: "5px",
    backgroundColor: "var(--canvas)"
  }, u = (i) => {
    i.key === "Enter" && n({
      action: o.closeHint
    });
  }, x = () => {
    n({
      action: o.closeHint
    });
  }), /* @__PURE__ */ t.jsx(R, { partialVisibility: !0, onChange: h, children: /* @__PURE__ */ t.jsxs("aside", { id: s, children: [
    /* @__PURE__ */ t.jsx("a", { name: s }),
    /* @__PURE__ */ t.jsxs(
      H,
      {
        style: {
          display: "block",
          margin: e.open ? "12px 4px 0px 4px" : "12px 4px 12px 4px",
          padding: "6px",
          border: "2px solid var(--canvastext)",
          borderTopLeftRadius: "5px",
          borderTopRightRadius: "5px",
          borderBottomLeftRadius: e.open ? "0px" : "5px",
          borderBottomRightRadius: e.open ? "0px" : "5px",
          backgroundColor: "var(--mainGray)",
          cursor: "pointer"
        },
        tabIndex: "0",
        "data-test": "hint-heading",
        onClick: x,
        onKeyDown: u,
        children: [
          " ",
          p,
          " ",
          r,
          " (click to ",
          f,
          ")"
        ]
      }
    ),
    /* @__PURE__ */ t.jsx("span", { style: d, children: c })
  ] }, s) });
});
export {
  I as default
};
