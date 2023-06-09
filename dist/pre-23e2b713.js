import { u as c, j as i, V as m } from "./index-64c78e6b.js";
import u, { useEffect as d } from "react";
import "react-dom";
import "styled-components";
const b = u.memo(function(n) {
  let { name: f, id: e, SVs: s, children: a, actions: r, callAction: t } = c(n), o = (l) => {
    t({
      action: r.recordVisibilityChange,
      args: { isVisible: l }
    });
  };
  return d(() => () => {
    t({
      action: r.recordVisibilityChange,
      args: { isVisible: !1 }
    });
  }, []), s.hidden ? null : /* @__PURE__ */ i.jsx(m, { partialVisibility: !0, onChange: o, children: /* @__PURE__ */ i.jsxs("pre", { id: e, style: { margin: "12px 0" }, children: [
    /* @__PURE__ */ i.jsx("a", { name: e }),
    a
  ] }) });
});
export {
  b as default
};
