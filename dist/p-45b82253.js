import { u as c, j as i, V as u } from "./index-8862516e.js";
import d, { useEffect as m } from "react";
import "react-dom";
import "styled-components";
const x = d.memo(function(n) {
  let { name: p, id: e, SVs: s, children: a, actions: t, callAction: r } = c(n), o = (l) => {
    r({
      action: t.recordVisibilityChange,
      args: { isVisible: l }
    });
  };
  return m(() => () => {
    r({
      action: t.recordVisibilityChange,
      args: { isVisible: !1 }
    });
  }, []), s.hidden ? null : /* @__PURE__ */ i.jsx(u, { partialVisibility: !0, onChange: o, children: /* @__PURE__ */ i.jsxs("p", { id: e, children: [
    /* @__PURE__ */ i.jsx("a", { name: e }),
    a
  ] }) });
});
export {
  x as default
};
