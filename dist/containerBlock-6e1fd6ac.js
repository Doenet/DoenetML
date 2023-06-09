import { u as c, j as e, V as d } from "./index-64c78e6b.js";
import u, { useEffect as f } from "react";
import "react-dom";
import "styled-components";
const y = u.memo(function(n) {
  let { name: h, id: r, SVs: s, children: a, actions: i, callAction: t } = c(n), o = (l) => {
    i.recordVisibilityChange && t({
      action: i.recordVisibilityChange,
      args: { isVisible: l }
    });
  };
  return f(() => () => {
    i.recordVisibilityChange && t({
      action: i.recordVisibilityChange,
      args: { isVisible: !1 }
    });
  }, []), s.hidden ? null : /* @__PURE__ */ e.jsx(d, { partialVisibility: !0, onChange: o, children: /* @__PURE__ */ e.jsxs("div", { id: r, children: [
    /* @__PURE__ */ e.jsx("a", { name: r }),
    a
  ] }) });
});
export {
  y as default
};
