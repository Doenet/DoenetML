import { u as a, j as i, B as l } from "./index-7c50cb13.js";
import o from "react";
const m = o.memo(function(n) {
  let { name: e, SVs: t, actions: r, callAction: s } = a(n, !1);
  return t.hidden ? null : /* @__PURE__ */ i.jsxs("div", { id: e, style: { margin: "12px 0", display: "inline-block" }, children: [
    /* @__PURE__ */ i.jsx("a", { name: e }),
    /* @__PURE__ */ i.jsx(
      l,
      {
        id: e + "_button",
        onClick: () => s({ action: r.triggerActions }),
        disabled: t.disabled,
        value: t.label
      }
    )
  ] });
});
export {
  m as default
};
