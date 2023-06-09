import { u, j as e } from "./index-64c78e6b.js";
import f, { useState as x } from "react";
import "react-dom";
import "styled-components";
const y = f.memo(function(n) {
  let { name: p, id: o, SVs: t } = u(n, !1), [r, i] = x(!1);
  if (t.hidden)
    return null;
  const l = {
    padding: "10px",
    borderRadius: "5px",
    backgroundColor: "#e2e2e2",
    display: "static"
  };
  let s = "";
  r && (s = /* @__PURE__ */ e.jsx("div", { style: l, children: t.text }));
  const a = {
    backgroundColor: "white",
    border: "none"
  }, d = {
    textDecoration: "none",
    color: "#1A5A99"
  };
  return /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
    /* @__PURE__ */ e.jsxs("span", { id: o, children: [
      /* @__PURE__ */ e.jsx("a", { name: o }),
      /* @__PURE__ */ e.jsx("sup", { children: /* @__PURE__ */ e.jsx(
        "button",
        {
          style: a,
          onClick: () => i((c) => !c),
          children: /* @__PURE__ */ e.jsxs("a", { href: "#", title: t.text, style: d, children: [
            "[",
            t.footnoteTag,
            "]"
          ] })
        }
      ) })
    ] }),
    s
  ] });
});
export {
  y as default
};
