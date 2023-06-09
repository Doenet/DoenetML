import { u as s, j as i, B as a } from "./index-8862516e.js";
import l from "react";
import "react-dom";
import "styled-components";
const f = l.memo(function(n) {
  let { name: e, SVs: t, actions: r, callAction: o } = s(n, !1);
  return t.hidden ? null : /* @__PURE__ */ i.jsxs("div", { id: e, style: { margin: "12px 0", display: "inline-block" }, children: [
    /* @__PURE__ */ i.jsx("a", { name: e }),
    /* @__PURE__ */ i.jsx(
      a,
      {
        id: e + "_button",
        onClick: () => o({ action: r.triggerActions }),
        disabled: t.disabled,
        value: t.label
      }
    )
  ] });
});
export {
  f as default
};
