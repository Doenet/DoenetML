import { u as c, j as e, V as d } from "./index-dce15b2c.js";
import u, { useEffect as f } from "react";
const g = u.memo(function(t) {
  let { name: V, id: n, SVs: s, children: a, actions: i, callAction: r } = c(t), o = (l) => {
    i.recordVisibilityChange && r({
      action: i.recordVisibilityChange,
      args: { isVisible: l }
    });
  };
  return f(() => () => {
    i.recordVisibilityChange && r({
      action: i.recordVisibilityChange,
      args: { isVisible: !1 }
    });
  }, []), s.hidden ? null : /* @__PURE__ */ e.jsx(d, { partialVisibility: !0, onChange: o, children: /* @__PURE__ */ e.jsxs("div", { id: n, children: [
    /* @__PURE__ */ e.jsx("a", { name: n }),
    a
  ] }) });
});
export {
  g as default
};
