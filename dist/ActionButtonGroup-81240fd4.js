import { j as i } from "./index-7c50cb13.js";
import l from "react";
import r, { ThemeProvider as f } from "styled-components";
const v = r.div`
  /* margin-left: 3px; */
  display: ${(e) => e.vertical ? "static" : "flex"};
  overflow: auto;
  min-width: 0;
  /* flex-wrap: wrap; */
`, p = r.div`
  display: ${(e) => e.align};
  width: ${(e) => e.width == "menu" ? "var(--menuWidth)" : ""};
  align-items: ${(e) => e.alignItems};
`, h = r.p`
  font-size: 14px;
  display: ${(e) => e.labelVisible};
  margin-right: 5px;
  margin-bottom: ${(e) => e.align == "flex" ? "none" : "2px"};
`, u = {
  // margin: '0px -2px 0px -2px',
  borderRadius: "0",
  padding: "0px 12px 0px 10px",
  border: "1px solid var(--mainGray)",
  // Adds a light border around each button in the group
  outlineOffset: "-6px"
}, b = {
  margin: "0px 4px 0px 4px",
  borderRadius: "0",
  padding: "0px 10px 0px 10px",
  border: "1px solid var(--mainGray)",
  outlineOffset: "-6px"
}, g = (e) => {
  let c = e.vertical ? "first_vert" : "first", d = e.vertical ? "last_vert" : "last", n = e.width ? "no_overflow" : "overflow", t = l.Children.toArray(e.children);
  t.length > 1 && (t = [
    l.cloneElement(t[0], { num: c, overflow: n })
  ].concat(
    t.slice(1, -1).map((m) => l.cloneElement(m, { overflow: n }))
  ).concat(
    l.cloneElement(t[t.length - 1], {
      num: d,
      overflow: n
    })
  ));
  const s = e.label ? "static" : "none";
  var o = "", a = "flex", x = "center";
  return e.label && (o = e.label, e.verticalLabel && (a = "static")), /* @__PURE__ */ i.jsx(i.Fragment, { children: /* @__PURE__ */ i.jsxs(p, { align: a, alignItems: x, width: e.width, children: [
    /* @__PURE__ */ i.jsx(h, { labelVisible: s, align: a, children: o }),
    /* @__PURE__ */ i.jsx(v, { vertical: e.vertical, children: /* @__PURE__ */ i.jsx(
      f,
      {
        theme: e.vertical ? b : u,
        children: t
      }
    ) })
  ] }) });
}, y = g;
export {
  y as A
};
