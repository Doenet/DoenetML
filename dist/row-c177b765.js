import { u as o, j as n } from "./index-64c78e6b.js";
import d from "react";
import "react-dom";
import "styled-components";
const c = d.memo(function(i) {
  let { name: m, id: r, SVs: e, children: l } = o(i);
  if (e.hidden)
    return null;
  let t = {};
  return e.valign !== null && (t.verticalAlign = e.valign), e.left !== "none" && (t.borderLeftStyle = "solid", e.left === "minor" ? t.borderLeftWidth = "thin" : e.left === "medium" ? t.borderLeftWidth = "medium" : t.borderLeftWidth = "thick"), /* @__PURE__ */ n.jsx("tr", { id: r, style: t, children: l });
});
export {
  c as default
};
