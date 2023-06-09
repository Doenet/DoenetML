import { u as n, j as o } from "./index-7c50cb13.js";
import d from "react";
const a = d.memo(function(i) {
  let { name: m, id: r, SVs: e, children: l } = n(i);
  if (e.hidden)
    return null;
  let t = {};
  return e.valign !== null && (t.verticalAlign = e.valign), e.left !== "none" && (t.borderLeftStyle = "solid", e.left === "minor" ? t.borderLeftWidth = "thin" : e.left === "medium" ? t.borderLeftWidth = "medium" : t.borderLeftWidth = "thick"), /* @__PURE__ */ o.jsx("tr", { id: r, style: t, children: l });
});
export {
  a as default
};
