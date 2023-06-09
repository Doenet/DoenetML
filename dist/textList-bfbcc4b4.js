import { u as x, j as t } from "./index-7c50cb13.js";
import s from "react";
const f = s.memo(function(i) {
  let { name: o, id: e, SVs: n, children: r } = x(i);
  if (n.hidden)
    return null;
  if (r.length === 0 && n.text)
    return /* @__PURE__ */ t.jsxs(s.Fragment, { children: [
      /* @__PURE__ */ t.jsx("a", { name: e }),
      /* @__PURE__ */ t.jsx("span", { id: e, children: n.text })
    ] }, e);
  let a = r.slice(1).reduce((m, l) => [...m, ", ", l], [r[0]]);
  return /* @__PURE__ */ t.jsxs(s.Fragment, { children: [
    /* @__PURE__ */ t.jsx("a", { name: e }),
    a
  ] }, e);
});
export {
  f as default
};
