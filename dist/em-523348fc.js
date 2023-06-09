import { u as s, j as n } from "./index-dce15b2c.js";
import o from "react";
const l = o.memo(function(r) {
  let { name: i, id: e, SVs: t, children: m } = s(r);
  return t.hidden ? null : /* @__PURE__ */ n.jsxs("em", { id: e, children: [
    /* @__PURE__ */ n.jsx("a", { name: e }),
    m
  ] });
});
export {
  l as default
};
