import { u as d, j as r } from "./index-64c78e6b.js";
import s from "react";
import "react-dom";
import "styled-components";
const c = s.memo(function(l) {
  let { name: h, id: o, SVs: t, children: n } = d(l);
  if (t.hidden)
    return null;
  let e = { style: { padding: "3px 10px" } };
  t.colSpan !== 1 && (e.colSpan = t.colSpan), t.halign !== null && (e.style.textAlign = t.halign), t.bottom !== "none" && (e.style.borderBottomStyle = "solid", t.bottom === "minor" ? e.style.borderBottomWidth = "thin" : t.bottom === "medium" ? e.style.borderBottomWidth = "medium" : e.style.borderBottomWidth = "thick"), t.right !== "none" && (e.style.borderRightStyle = "solid", t.right === "minor" ? e.style.borderRightWidth = "thin" : t.right === "medium" ? e.style.borderRightWidth = "medium" : e.style.borderRightWidth = "thick");
  let i = n;
  return i.length === 0 && (i = t.text), t.inHeader ? /* @__PURE__ */ r.jsx("th", { id: o, ...e, children: i }) : /* @__PURE__ */ r.jsx("td", { id: o, ...e, children: i });
});
export {
  c as default
};
