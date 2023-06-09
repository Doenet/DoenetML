import { u as c, j as e, V as u } from "./index-8862516e.js";
import d, { useEffect as f } from "react";
import "react-dom";
import "styled-components";
const y = d.memo(function(n) {
  let { name: b, id: t, SVs: o, children: s, actions: i, callAction: r } = c(n), a = (l) => {
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
  }, []), o.hidden ? null : /* @__PURE__ */ e.jsx(u, { partialVisibility: !0, onChange: a, children: /* @__PURE__ */ e.jsxs("blockquote", { id: t, children: [
    /* @__PURE__ */ e.jsx("a", { name: t }),
    s
  ] }) });
});
export {
  y as default
};
