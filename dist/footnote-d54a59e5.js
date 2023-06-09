import { u, j as e } from "./index-dce15b2c.js";
import f, { useState as x } from "react";
const b = f.memo(function(n) {
  let { name: p, id: o, SVs: t } = u(n, !1), [r, l] = x(!1);
  if (t.hidden)
    return null;
  const i = {
    padding: "10px",
    borderRadius: "5px",
    backgroundColor: "#e2e2e2",
    display: "static"
  };
  let s = "";
  r && (s = /* @__PURE__ */ e.jsx("div", { style: i, children: t.text }));
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
          onClick: () => l((c) => !c),
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
  b as default
};
