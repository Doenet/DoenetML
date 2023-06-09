import { u as s, j as t, B as d } from "./index-7c50cb13.js";
import o from "react";
const m = o.memo(function(l) {
  let { name: e, SVs: a, actions: n, callAction: i } = s(l, !1);
  return a.hidden ? null : /* @__PURE__ */ t.jsxs("div", { id: e, margin: "12px 0", style: { display: "inline-block" }, children: [
    /* @__PURE__ */ t.jsx("a", { name: e }),
    /* @__PURE__ */ t.jsx(
      d,
      {
        id: e + "_button",
        onClick: () => i({ action: n.updateValue }),
        disabled: a.disabled,
        value: a.label
      }
    )
  ] });
});
export {
  m as default
};
