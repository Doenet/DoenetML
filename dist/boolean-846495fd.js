import { u as o, j as e } from "./index-8862516e.js";
import a from "react";
import "react-dom";
import "styled-components";
const f = a.memo(function(r) {
  let { name: m, id: t, SVs: n } = o(r, !1);
  return n.hidden ? null : /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
    /* @__PURE__ */ e.jsx("a", { name: t }),
    /* @__PURE__ */ e.jsx("span", { id: t, children: n.text })
  ] });
});
export {
  f as default
};
