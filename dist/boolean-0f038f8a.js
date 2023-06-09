import { u as a, j as e } from "./index-dce15b2c.js";
import o from "react";
const u = o.memo(function(r) {
  let { name: l, id: n, SVs: t } = a(r, !1);
  return t.hidden ? null : /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
    /* @__PURE__ */ e.jsx("a", { name: n }),
    /* @__PURE__ */ e.jsx("span", { id: n, children: t.text })
  ] });
});
export {
  u as default
};
