import { u as d, j as e, M as h } from "./index-8862516e.js";
import r from "react";
import "react-dom";
import "styled-components";
const p = r.memo(function(s) {
  let { name: x, id: t, SVs: i, children: n } = d(s);
  if (i.hidden)
    return null;
  if (n.length === 0 && i.latex)
    return /* @__PURE__ */ e.jsxs(r.Fragment, { children: [
      /* @__PURE__ */ e.jsx("a", { name: t }),
      /* @__PURE__ */ e.jsx("span", { id: t, children: /* @__PURE__ */ e.jsx(h, { hideUntilTypeset: "first", inline: !0, dynamic: !0, children: "\\(" + i.latex + "\\)" }) })
    ] }, t);
  if (n.length === 0)
    return /* @__PURE__ */ e.jsx(r.Fragment, {}, t);
  let a = n.slice(1).reduce((l, m) => [...l, ", ", m], [n[0]]);
  return /* @__PURE__ */ e.jsxs(r.Fragment, { children: [
    /* @__PURE__ */ e.jsx("a", { name: t }),
    /* @__PURE__ */ e.jsx("span", { id: t, children: a })
  ] }, t);
});
export {
  p as default
};
