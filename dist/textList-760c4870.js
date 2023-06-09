import { u as l, j as t } from "./index-8862516e.js";
import s from "react";
import "react-dom";
import "styled-components";
const j = s.memo(function(i) {
  let { name: d, id: e, SVs: r, children: n } = l(i);
  if (r.hidden)
    return null;
  if (n.length === 0 && r.text)
    return /* @__PURE__ */ t.jsxs(s.Fragment, { children: [
      /* @__PURE__ */ t.jsx("a", { name: e }),
      /* @__PURE__ */ t.jsx("span", { id: e, children: r.text })
    ] }, e);
  let m = n.slice(1).reduce((a, o) => [...a, ", ", o], [n[0]]);
  return /* @__PURE__ */ t.jsxs(s.Fragment, { children: [
    /* @__PURE__ */ t.jsx("a", { name: e }),
    m
  ] }, e);
});
export {
  j as default
};
