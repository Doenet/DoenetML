import { u as a, j as n } from "./index-dce15b2c.js";
import o from "react";
const d = o.memo(function(r) {
  let { name: l, id: e, SVs: t, children: i } = a(r);
  return t.hidden ? null : /* @__PURE__ */ n.jsxs("span", { id: e, children: [
    /* @__PURE__ */ n.jsx("a", { name: e }),
    i
  ] });
});
export {
  d as default
};
