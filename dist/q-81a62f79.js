import { u as a, j as e } from "./index-dce15b2c.js";
import m from "react";
const l = m.memo(function(n) {
  let { name: i, id: r, SVs: t, children: s } = a(n);
  return t.hidden ? null : /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
    /* @__PURE__ */ e.jsx("a", { name: r }),
    "“",
    s,
    "”"
  ] });
});
export {
  l as default
};
