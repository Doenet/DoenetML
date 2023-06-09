import { u as o, j as r } from "./index-dce15b2c.js";
import a from "react";
const d = a.memo(function(t) {
  let { name: l, id: e, SVs: n, children: s } = o(t);
  return n.hidden ? null : /* @__PURE__ */ r.jsxs("strong", { id: e, children: [
    /* @__PURE__ */ r.jsx("a", { name: e }),
    s
  ] });
});
export {
  d as default
};
