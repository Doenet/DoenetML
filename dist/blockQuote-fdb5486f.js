import { u as c, j as e, V as u } from "./index-dce15b2c.js";
import d, { useEffect as f } from "react";
const g = d.memo(function(r) {
  let { name: h, id: t, SVs: s, children: a, actions: i, callAction: n } = c(r), o = (l) => {
    i.recordVisibilityChange && n({
      action: i.recordVisibilityChange,
      args: { isVisible: l }
    });
  };
  return f(() => () => {
    i.recordVisibilityChange && n({
      action: i.recordVisibilityChange,
      args: { isVisible: !1 }
    });
  }, []), s.hidden ? null : /* @__PURE__ */ e.jsx(u, { partialVisibility: !0, onChange: o, children: /* @__PURE__ */ e.jsxs("blockquote", { id: t, children: [
    /* @__PURE__ */ e.jsx("a", { name: t }),
    a
  ] }) });
});
export {
  g as default
};
