import { u as x, j as i, V as h } from "./index-7c50cb13.js";
import y, { useEffect as c, createContext as b } from "react";
const V = b(), F = y.memo(function(r) {
  let { name: l, id: t, SVs: e, actions: s, callAction: m } = x(r), f = (n) => {
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
      e.colInd !== null ? n = [e.colInd] : n = e.dataFrame.columnTypes.map((a, p) => a === "number" ? p : null).filter((a) => a !== null);
      let u = [];
      for (let a of n)
        e.type === "box" ? u.push({
          y: d(e.dataFrame.data, a),
          type: "box",
          name: e.dataFrame.columnNames[a]
        }) : u.push({
          x: d(e.dataFrame.data, a),
          type: "histogram",
          name: e.dataFrame.columnNames[a]
        });
    }
  }, []), /* @__PURE__ */ i.jsxs(i.Fragment, { children: [
    /* @__PURE__ */ i.jsx("a", { name: t }),
    /* @__PURE__ */ i.jsx(h, { partialVisibility: !0, onChange: f, children: /* @__PURE__ */ i.jsx("div", { id: t }) })
  ] });
});
function d(o, r) {
  let l = [];
  for (let t of o)
    t[r] !== null && l.push(t[r]);
  return l;
}
export {
  V as BoardContext,
  F as default
};
