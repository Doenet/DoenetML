import { u as c, j as r, V as a } from "./index-7c50cb13.js";
import f, { useEffect as h } from "react";
const j = f.memo(function(d) {
  let { name: y, id: l, SVs: i, children: s, actions: m, callAction: u } = c(d), t = (e) => {
    u({
      action: m.recordVisibilityChange,
      args: { isVisible: e }
    });
  };
  if (h(() => () => {
    u({
      action: m.recordVisibilityChange,
      args: { isVisible: !1 }
    });
  }, []), i.hidden)
    return null;
  if (i.item)
    return /* @__PURE__ */ r.jsx(
      a,
      {
        partialVisibility: !0,
        onChange: t,
        requireContentsSize: !1,
        children: /* @__PURE__ */ r.jsxs(r.Fragment, { children: [
          /* @__PURE__ */ r.jsx("a", { name: l }),
          /* @__PURE__ */ r.jsx("li", { id: l, children: s })
        ] })
      }
    );
  if (i.numbered) {
    let e;
    return i.marker && (i.marker[0] === "1" ? e = "decimal" : i.marker[0] === "a" ? e = "lower-alpha" : i.marker[0] === "i" ? e = "lower-roman" : i.marker[0] === "A" ? e = "upper-alpha" : i.marker[0] === "I" && (e = "upper-roman")), e || (e = n.numbered[(i.level - 1) % n.numbered.length]), /* @__PURE__ */ r.jsx(a, { partialVisibility: !0, onChange: t, children: /* @__PURE__ */ r.jsx(r.Fragment, { children: /* @__PURE__ */ r.jsxs("ol", { id: l, style: { listStyleType: e }, children: [
      /* @__PURE__ */ r.jsx("a", { name: l }),
      s
    ] }) }) });
  } else {
    let e;
    return i.marker && (e = i.marker.toLowerCase(), o.includes(e) || (e = null)), e || (e = n.unnumbered[(i.level - 1) % n.unnumbered.length]), /* @__PURE__ */ r.jsx(a, { partialVisibility: !0, onChange: t, children: /* @__PURE__ */ r.jsx(r.Fragment, { children: /* @__PURE__ */ r.jsxs("ul", { id: l, style: { listStyleType: e }, children: [
      /* @__PURE__ */ r.jsx("a", { name: l }),
      s
    ] }) }) });
  }
}), o = ["disc", "circle", "square"], n = {
  numbered: [
    "decimal",
    "lower-alpha",
    "lower-roman",
    "upper-alpha",
    "upper-roman"
  ],
  unnumbered: o
};
export {
  j as default
};
