import { u as R, R as C, r as v, j as n, V as _ } from "./index-8862516e.js";
import k, { useState as B, useRef as N, useEffect as T } from "react";
import "react-dom";
import "styled-components";
const U = k.memo(function f(b) {
  let {
    name: w,
    id: c,
    SVs: e,
    children: m,
    actions: a,
    ignoreUpdate: g,
    rendererName: I,
    callAction: d
  } = R(b);
  f.baseStateVariable = "selectedIndices";
  const [o, p] = B(
    e.selectedIndices
  ), x = C(v(I));
  let r = N(null);
  !g && r.current !== e.selectedIndices ? (p(e.selectedIndices), r.current = e.selectedIndices) : r.current = null;
  let j = (t) => {
    d({
      action: a.recordVisibilityChange,
      args: { isVisible: t }
    });
  };
  T(() => () => {
    d({
      action: a.recordVisibilityChange,
      args: { isVisible: !1 }
    });
  }, []);
  function S(t) {
    let i = [];
    t.target.value && (i = Array.from(
      t.target.selectedOptions,
      (s) => Number(s.value)
    )), (o.length !== i.length || o.some((s, l) => s != i[l])) && (p(i), r.current = e.selectedIndices, x((s) => {
      let l = { ...s };
      return l.ignoreUpdate = !0, l;
    }), d({
      action: a.updateSelectedIndices,
      args: {
        selectedIndices: i
      },
      baseVariableValue: i
    }));
  }
  if (e.hidden)
    return null;
  let u = [];
  if (e.separateByTopic)
    for (let t in e.childrenByTopic) {
      let s = e.childrenByTopic[t].map(function(l) {
        return /* @__PURE__ */ n.jsx("option", { value: l + 1, children: e.childInfo[l].title }, l + 1);
      });
      u.push(
        /* @__PURE__ */ n.jsx("optgroup", { label: t, children: s }, t)
      );
    }
  else
    u = e.childInfo.map(function(t, i) {
      return /* @__PURE__ */ n.jsx("option", { value: i + 1, children: t.title }, i + 1);
    });
  let V = o[0], h = null;
  e.label && (h = e.label + ": ");
  let y = /* @__PURE__ */ n.jsx("p", { children: /* @__PURE__ */ n.jsxs("label", { children: [
    h,
    /* @__PURE__ */ n.jsx(
      "select",
      {
        className: "custom-select",
        id: c + "-select",
        onChange: (t) => S(t),
        value: V,
        disabled: e.disabled,
        children: u
      }
    )
  ] }) });
  return /* @__PURE__ */ n.jsx(_, { partialVisibility: !0, onChange: j, children: /* @__PURE__ */ n.jsxs("section", { id: c, children: [
    /* @__PURE__ */ n.jsx("a", { name: c }),
    y,
    m
  ] }) });
});
export {
  U as default
};
