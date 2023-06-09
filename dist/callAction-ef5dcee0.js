import { u as o, j as e, B as s } from "./index-7c50cb13.js";
import c from "react";
const m = c.memo(function(n) {
  let { name: l, SVs: t, actions: i, callAction: a } = o(n);
  return t.hidden ? null : /* @__PURE__ */ e.jsxs("div", { style: { margin: "12px 0", display: "inline-block" }, children: [
    /* @__PURE__ */ e.jsx("a", { name: l }),
    /* @__PURE__ */ e.jsx(s, { id: l + "_button", onClick: () => a({ action: i.callAction }), disabled: t.disabled, value: t.label })
  ] });
});
export {
  m as default
};
