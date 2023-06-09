import { u as o, j as a, B as s } from "./index-8862516e.js";
import d from "react";
import "react-dom";
import "styled-components";
const f = d.memo(function(i) {
  let { name: e, SVs: t, actions: l, callAction: n } = o(i, !1);
  return t.hidden ? null : /* @__PURE__ */ a.jsxs("div", { id: e, margin: "12px 0", style: { display: "inline-block" }, children: [
    /* @__PURE__ */ a.jsx("a", { name: e }),
    /* @__PURE__ */ a.jsx(
      s,
      {
        id: e + "_button",
        onClick: () => n({ action: l.updateValue }),
        disabled: t.disabled,
        value: t.label
      }
    )
  ] });
});
export {
  f as default
};
