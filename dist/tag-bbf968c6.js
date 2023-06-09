import { u as a, j as r } from "./index-dce15b2c.js";
import i from "react";
const f = i.memo(function(o) {
  let { name: m, id: e, SVs: t, children: s } = a(o);
  if (t.hidden)
    return null;
  let l = "<", n = ">";
  return t.selfClosed && (n = "/>"), /* @__PURE__ */ r.jsxs("code", { id: e, style: { color: "var(--mainGreen)" }, children: [
    /* @__PURE__ */ r.jsx("a", { name: e }),
    l,
    s,
    n
  ] });
});
export {
  f as default
};
