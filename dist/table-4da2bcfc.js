import { u as p, j as t, V as b } from "./index-7c50cb13.js";
import g, { useEffect as x } from "react";
const N = g.memo(function(f) {
  var m;
  let { name: V, id: n, SVs: l, children: s, actions: a, callAction: o } = p(f), h = (e) => {
    o({
      action: a.recordVisibilityChange,
      args: { isVisible: e }
    });
  };
  if (x(() => () => {
    o({
      action: a.recordVisibilityChange,
      args: { isVisible: !1 }
    });
  }, []), l.hidden)
    return null;
  let d = null, c = [...s], i;
  if (l.titleChildName) {
    let e;
    for (let [u, r] of s.entries())
      if (((m = r == null ? void 0 : r.props) == null ? void 0 : m.componentInstructions.componentName) === l.titleChildName) {
        e = u;
        break;
      }
    i = s[e], c.splice(e, 1);
  } else
    i = l.title;
  if (!l.suppressTableNameInTitle) {
    let e = /* @__PURE__ */ t.jsx("strong", { children: l.tableName });
    i ? i = /* @__PURE__ */ t.jsxs(t.Fragment, { children: [
      e,
      ": ",
      i
    ] }) : i = e;
  }
  return d = /* @__PURE__ */ t.jsx("div", { id: n + "_title", children: i }), /* @__PURE__ */ t.jsx(b, { partialVisibility: !0, onChange: h, children: /* @__PURE__ */ t.jsxs("div", { id: n, style: { margin: "12px 0" }, children: [
    /* @__PURE__ */ t.jsx("a", { name: n }),
    d,
    c
  ] }) });
});
export {
  N as default
};
