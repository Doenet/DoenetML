import { u as d, j as l } from "./index-7c50cb13.js";
import s from "react";
const a = s.memo(function(r) {
  let { name: m, id: o, SVs: t, children: n } = d(r);
  if (t.hidden)
    return null;
  let e = { style: { padding: "3px 10px" } };
  t.colSpan !== 1 && (e.colSpan = t.colSpan), t.halign !== null && (e.style.textAlign = t.halign), t.bottom !== "none" && (e.style.borderBottomStyle = "solid", t.bottom === "minor" ? e.style.borderBottomWidth = "thin" : t.bottom === "medium" ? e.style.borderBottomWidth = "medium" : e.style.borderBottomWidth = "thick"), t.right !== "none" && (e.style.borderRightStyle = "solid", t.right === "minor" ? e.style.borderRightWidth = "thin" : t.right === "medium" ? e.style.borderRightWidth = "medium" : e.style.borderRightWidth = "thick");
  let i = n;
  return i.length === 0 && (i = t.text), t.inHeader ? /* @__PURE__ */ l.jsx("th", { id: o, ...e, children: i }) : /* @__PURE__ */ l.jsx("td", { id: o, ...e, children: i });
});
export {
  a as default
};
