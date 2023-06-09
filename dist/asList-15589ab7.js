import { u, j as r } from "./index-dce15b2c.js";
import n from "react";
const x = n.memo(function(s) {
  let { name: d, id: e, SVs: i, children: t } = u(s);
  if (i.hidden)
    return null;
  if (t.length === 0)
    return /* @__PURE__ */ r.jsx(n.Fragment, {}, e);
  let a = t.slice(1).reduce((m, o) => [...m, ", ", o], [t[0]]);
  return /* @__PURE__ */ r.jsxs(n.Fragment, { children: [
    /* @__PURE__ */ r.jsx("a", { name: e }),
    a
  ] }, e);
});
export {
  x as default
};
