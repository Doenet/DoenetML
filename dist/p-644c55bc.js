import { u as c, j as i, V as u } from "./index-dce15b2c.js";
import d, { useEffect as f } from "react";
const b = d.memo(function(r) {
  let { name: h, id: e, SVs: s, children: a, actions: t, callAction: n } = c(r), l = (o) => {
    n({
      action: t.recordVisibilityChange,
      args: { isVisible: o }
    });
  };
  return f(() => () => {
    n({
      action: t.recordVisibilityChange,
      args: { isVisible: !1 }
    });
  }, []), s.hidden ? null : /* @__PURE__ */ i.jsx(u, { partialVisibility: !0, onChange: l, children: /* @__PURE__ */ i.jsxs("p", { id: e, children: [
    /* @__PURE__ */ i.jsx("a", { name: e }),
    a
  ] }) });
});
export {
  b as default
};
