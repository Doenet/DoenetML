import { u as o, j as n } from "./index-dce15b2c.js";
import a from "react";
const l = a.memo(function(r) {
  let { name: m, id: e, SVs: t, children: s } = o(r);
  return t.hidden ? null : /* @__PURE__ */ n.jsxs("code", { id: e, style: { margin: "12px 0" }, children: [
    /* @__PURE__ */ n.jsx("a", { name: e }),
    s
  ] });
});
export {
  l as default
};
