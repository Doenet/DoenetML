import { u as b, j as t, V as c } from "./index-7c50cb13.js";
import u, { useEffect as m } from "react";
import { s } from "./css-ab4d83ca.js";
const V = u.memo(function(l) {
  let { name: f, id: r, SVs: e, children: n, actions: o, callAction: a } = b(l), d = (h) => {
    a({
      action: o.recordVisibilityChange,
      args: { isVisible: h }
    });
  };
  if (m(() => () => {
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
  return e.top !== "none" && (i.borderTopStyle = "solid", e.top === "minor" ? i.borderTopWidth = "thin" : e.top === "medium" ? i.borderTopWidth = "medium" : i.borderTopWidth = "thick"), /* @__PURE__ */ t.jsx(c, { partialVisibility: !0, onChange: d, children: /* @__PURE__ */ t.jsxs("div", { style: { margin: "12px 0" }, children: [
    /* @__PURE__ */ t.jsx("a", { name: r }),
    /* @__PURE__ */ t.jsx("table", { id: r, style: i, children: /* @__PURE__ */ t.jsx("tbody", { children: n }) })
  ] }) });
});
export {
  V as default
};
