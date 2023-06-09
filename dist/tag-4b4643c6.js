import { u as a, j as o } from "./index-8862516e.js";
import i from "react";
import "react-dom";
import "styled-components";
const x = i.memo(function(n) {
  let { name: d, id: e, SVs: t, children: s } = a(n);
  if (t.hidden)
    return null;
  let l = "<", r = ">";
  return t.selfClosed && (r = "/>"), /* @__PURE__ */ o.jsxs("code", { id: e, style: { color: "var(--mainGreen)" }, children: [
    /* @__PURE__ */ o.jsx("a", { name: e }),
    l,
    s,
    r
  ] });
});
export {
  x as default
};
