import { u, j as t, V as b } from "./index-8862516e.js";
import g, { useEffect as x } from "react";
import "react-dom";
import "styled-components";
const T = g.memo(function(f) {
  var m;
  let { name: V, id: n, SVs: l, children: r, actions: a, callAction: o } = u(f), h = (e) => {
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
  let d = null, c = [...r], i;
  if (l.titleChildName) {
    let e;
    for (let [p, s] of r.entries())
      if (((m = s == null ? void 0 : s.props) == null ? void 0 : m.componentInstructions.componentName) === l.titleChildName) {
        e = p;
        break;
      }
    i = r[e], c.splice(e, 1);
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
  T as default
};
