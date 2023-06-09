import { u as d, j as e, M as h } from "./index-7c50cb13.js";
import r from "react";
const j = r.memo(function(a) {
  let { name: x, id: t, SVs: s, children: n } = d(a);
  if (s.hidden)
    return null;
  if (n.length === 0 && s.latex)
    return /* @__PURE__ */ e.jsxs(r.Fragment, { children: [
      /* @__PURE__ */ e.jsx("a", { name: t }),
      /* @__PURE__ */ e.jsx("span", { id: t, children: /* @__PURE__ */ e.jsx(h, { hideUntilTypeset: "first", inline: !0, dynamic: !0, children: "\\(" + s.latex + "\\)" }) })
    ] }, t);
  if (n.length === 0)
    return /* @__PURE__ */ e.jsx(r.Fragment, {}, t);
  let i = n.slice(1).reduce((l, m) => [...l, ", ", m], [n[0]]);
  return /* @__PURE__ */ e.jsxs(r.Fragment, { children: [
    /* @__PURE__ */ e.jsx("a", { name: t }),
    /* @__PURE__ */ e.jsx("span", { id: t, children: i })
  ] }, t);
});
export {
  j as default
};
