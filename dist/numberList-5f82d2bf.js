import { u, j as t } from "./index-dce15b2c.js";
import r from "react";
const h = r.memo(function(a) {
  let { name: x, id: e, SVs: s, children: n } = u(a);
  if (s.hidden)
    return null;
  if (n.length === 0 && s.text)
    return /* @__PURE__ */ t.jsxs(r.Fragment, { children: [
      /* @__PURE__ */ t.jsx("a", { name: e }),
      /* @__PURE__ */ t.jsx("span", { id: e, children: s.text })
    ] }, e);
  if (n.length === 0)
    return /* @__PURE__ */ t.jsx(r.Fragment, {}, e);
  let i = n.slice(1).reduce((m, l) => [...m, ", ", l], [n[0]]);
  return /* @__PURE__ */ t.jsxs(r.Fragment, { children: [
    /* @__PURE__ */ t.jsx("a", { name: e }),
    /* @__PURE__ */ t.jsx("span", { id: e, children: i })
  ] }, e);
});
export {
  h as default
};
