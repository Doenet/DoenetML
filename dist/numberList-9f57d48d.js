import { u as o, j as t } from "./index-64c78e6b.js";
import r from "react";
import "react-dom";
import "styled-components";
const f = r.memo(function(i) {
  let { name: d, id: e, SVs: s, children: n } = o(i);
  if (s.hidden)
    return null;
  if (n.length === 0 && s.text)
    return /* @__PURE__ */ t.jsxs(r.Fragment, { children: [
      /* @__PURE__ */ t.jsx("a", { name: e }),
      /* @__PURE__ */ t.jsx("span", { id: e, children: s.text })
    ] }, e);
  if (n.length === 0)
    return /* @__PURE__ */ t.jsx(r.Fragment, {}, e);
  let a = n.slice(1).reduce((m, l) => [...m, ", ", l], [n[0]]);
  return /* @__PURE__ */ t.jsxs(r.Fragment, { children: [
    /* @__PURE__ */ t.jsx("a", { name: e }),
    /* @__PURE__ */ t.jsx("span", { id: e, children: a })
  ] }, e);
});
export {
  f as default
};
