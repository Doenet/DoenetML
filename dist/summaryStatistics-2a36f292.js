import { u as p, j as i, V as x } from "./index-8862516e.js";
import b, { useEffect as y } from "react";
import { s as o } from "./css-ab4d83ca.js";
import "react-dom";
import "styled-components";
const w = b.memo(function(m) {
  let { name: j, id: r, SVs: t, children: g, actions: a, callAction: n } = p(m), d = (e) => {
    n({
      action: a.recordVisibilityChange,
      args: { isVisible: e }
    });
  };
  if (y(() => () => {
    n({
      action: a.recordVisibilityChange,
      args: { isVisible: !1 }
    });
  }, []), t.hidden)
    return null;
  const c = {
    width: o(t.width),
    height: o(t.height),
    borderCollapse: "collapse",
    borderColor: "black",
    borderRadius: "var(--mainBorderRadius)"
  };
  let l = [
    "mean",
    "stdev",
    "variance",
    "stderr",
    "count",
    "minimum",
    "quartile1",
    "median",
    "quartile3",
    "maximum",
    "range",
    "sum"
  ].filter((e) => e in t.summaryStatistics), u = /* @__PURE__ */ i.jsx("tr", { children: l.map((e, s) => /* @__PURE__ */ i.jsx("th", { children: e }, s)) }), h = /* @__PURE__ */ i.jsx("tr", { children: l.map((e, s) => /* @__PURE__ */ i.jsx("td", { children: t.summaryStatistics[e] }, s)) });
  return /* @__PURE__ */ i.jsx(x, { partialVisibility: !0, onChange: d, children: /* @__PURE__ */ i.jsxs("div", { style: { margin: "12px 0" }, children: [
    /* @__PURE__ */ i.jsx("a", { name: r }),
    /* @__PURE__ */ i.jsxs("p", { children: [
      "Summary statistics of ",
      t.columnName
    ] }),
    /* @__PURE__ */ i.jsx("table", { id: r, style: c, children: /* @__PURE__ */ i.jsxs("tbody", { children: [
      u,
      h
    ] }) })
  ] }) });
});
export {
  w as default
};
