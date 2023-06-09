import { u as c, j as e, V as u } from "./index-7c50cb13.js";
import d, { useEffect as m } from "react";
const g = d.memo(function(n) {
  let { name: h, id: i, SVs: s, children: a, actions: r, callAction: t } = c(n), l = (o) => {
    t({
      action: r.recordVisibilityChange,
      args: { isVisible: o }
    });
  };
  return m(() => () => {
    t({
      action: r.recordVisibilityChange,
      args: { isVisible: !1 }
    });
  }, []), s.hidden ? null : /* @__PURE__ */ e.jsx(u, { partialVisibility: !0, onChange: l, children: /* @__PURE__ */ e.jsxs("pre", { id: i, style: { margin: "12px 0" }, children: [
    /* @__PURE__ */ e.jsx("a", { name: i }),
    a
  ] }) });
});
export {
  g as default
};
