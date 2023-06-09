import { u as r, j as e } from "./index-dce15b2c.js";
import i from "react";
const u = i.memo(function(s) {
  let { name: l, id: t, SVs: n } = r(s);
  return n.hidden ? null : /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
    /* @__PURE__ */ e.jsx("a", { name: t }),
    "…"
  ] });
});
export {
  u as default
};
