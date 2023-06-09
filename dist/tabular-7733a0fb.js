import { u as m, j as t, V as b } from "./index-8862516e.js";
import c, { useEffect as u } from "react";
import { s } from "./css-ab4d83ca.js";
import "react-dom";
import "styled-components";
const C = c.memo(function(l) {
  let { name: f, id: r, SVs: e, children: n, actions: o, callAction: a } = m(l), d = (h) => {
    a({
      action: o.recordVisibilityChange,
      args: { isVisible: h }
    });
  };
  if (u(() => () => {
    a({
      action: o.recordVisibilityChange,
      args: { isVisible: !1 }
    });
  }, []), e.hidden)
    return null;
  const i = {
    width: s(e.width),
    height: s(e.height),
    borderCollapse: "collapse",
    borderColor: "var(--canvastext)",
    borderRadius: "var(--mainBorderRadius)",
    tableLayout: "fixed"
  };
  return e.top !== "none" && (i.borderTopStyle = "solid", e.top === "minor" ? i.borderTopWidth = "thin" : e.top === "medium" ? i.borderTopWidth = "medium" : i.borderTopWidth = "thick"), /* @__PURE__ */ t.jsx(b, { partialVisibility: !0, onChange: d, children: /* @__PURE__ */ t.jsxs("div", { style: { margin: "12px 0" }, children: [
    /* @__PURE__ */ t.jsx("a", { name: r }),
    /* @__PURE__ */ t.jsx("table", { id: r, style: i, children: /* @__PURE__ */ t.jsx("tbody", { children: n }) })
  ] }) });
});
export {
  C as default
};
