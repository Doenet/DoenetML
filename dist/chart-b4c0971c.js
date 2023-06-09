import { u as x, j as i, V as h } from "./index-8862516e.js";
import y, { useEffect as c, createContext as b } from "react";
import "react-dom";
import "styled-components";
const j = b(), I = y.memo(function(r) {
  let { name: l, id: a, SVs: e, actions: s, callAction: m } = x(r), f = (n) => {
    m({
      action: s.recordVisibilityChange,
      args: { isVisible: n }
    });
  };
  return c(() => () => {
    m({
      action: s.recordVisibilityChange,
      args: { isVisible: !1 }
    });
  }, []), c(() => {
    if (e.dataFrame !== null) {
      let n;
      e.colInd !== null ? n = [e.colInd] : n = e.dataFrame.columnTypes.map((t, p) => t === "number" ? p : null).filter((t) => t !== null);
      let u = [];
      for (let t of n)
        e.type === "box" ? u.push({
          y: d(e.dataFrame.data, t),
          type: "box",
          name: e.dataFrame.columnNames[t]
        }) : u.push({
          x: d(e.dataFrame.data, t),
          type: "histogram",
          name: e.dataFrame.columnNames[t]
        });
    }
  }, []), /* @__PURE__ */ i.jsxs(i.Fragment, { children: [
    /* @__PURE__ */ i.jsx("a", { name: a }),
    /* @__PURE__ */ i.jsx(h, { partialVisibility: !0, onChange: f, children: /* @__PURE__ */ i.jsx("div", { id: a }) })
  ] });
});
function d(o, r) {
  let l = [];
  for (let a of o)
    a[r] !== null && l.push(a[r]);
  return l;
}
export {
  j as BoardContext,
  I as default
};
