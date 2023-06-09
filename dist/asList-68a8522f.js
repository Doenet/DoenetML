import { u, j as r } from "./index-64c78e6b.js";
import n from "react";
import "react-dom";
import "styled-components";
const h = n.memo(function(s) {
  let { name: d, id: e, SVs: i, children: t } = u(s);
  if (i.hidden)
    return null;
  if (t.length === 0)
    return /* @__PURE__ */ r.jsx(n.Fragment, {}, e);
  let m = t.slice(1).reduce((a, o) => [...a, ", ", o], [t[0]]);
  return /* @__PURE__ */ r.jsxs(n.Fragment, { children: [
    /* @__PURE__ */ r.jsx("a", { name: e }),
    m
  ] }, e);
});
export {
  h as default
};
