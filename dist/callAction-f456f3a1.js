import { u as a, j as e, B as s } from "./index-64c78e6b.js";
import r from "react";
import "react-dom";
import "styled-components";
const x = r.memo(function(l) {
  let { name: i, SVs: t, actions: n, callAction: o } = a(l);
  return t.hidden ? null : /* @__PURE__ */ e.jsxs("div", { style: { margin: "12px 0", display: "inline-block" }, children: [
    /* @__PURE__ */ e.jsx("a", { name: i }),
    /* @__PURE__ */ e.jsx(s, { id: i + "_button", onClick: () => o({ action: n.callAction }), disabled: t.disabled, value: t.label })
  ] });
});
export {
  x as default
};
