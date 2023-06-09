import { u as L, R as _, r as E, j as i, i as F, V as I } from "./index-64c78e6b.js";
import D, { useRef as c, useEffect as H } from "react";
import { s as o } from "./css-ab4d83ca.js";
import "react-dom";
import "styled-components";
const X = D.memo(function y(j) {
  let {
    name: O,
    id: m,
    SVs: e,
    children: x,
    actions: l,
    ignoreUpdate: R,
    rendererName: w,
    callAction: n
  } = L(j);
  y.baseStateVariable = "immediateValue";
  const v = _(E(w));
  let r = c(e.immediateValue), a = c(null), S = c(null), b = c(e.immediateValue), W = { ...e.height }, h = { ...e.height };
  e.showResults && e.resultsLocation === "bottom" && (h.size *= 1 - e.viewerRatio);
  let C = (d) => {
    n({
      action: l.recordVisibilityChange,
      args: { isVisible: d }
    });
  };
  if (H(() => () => {
    n({
      action: l.recordVisibilityChange,
      args: { isVisible: !1 }
    }), a.current !== null && (clearTimeout(a.current), n({
      action: l.updateValue,
      baseVariableValue: r.current
    }));
  }, []), e.hidden)
    return null;
  const g = m + "_editor";
  !R && e.immediateValue !== r.current && (r.current = e.immediateValue, b.current = e.immediateValue);
  let s = null, T = e.width, p = e.width, z = {
    width: o(T),
    height: o(h),
    maxWidth: "100%",
    padding: "0px",
    // padding: "2px",
    // border: "1px solid black",
    overflowX: "hidden",
    overflowY: "scroll"
  };
  e.showResults && (e.resultsLocation === "bottom" ? s = /* @__PURE__ */ i.jsxs(i.Fragment, { children: [
    /* @__PURE__ */ i.jsx("hr", { style: { width: o(p), maxWidth: "100%" } }),
    /* @__PURE__ */ i.jsx("div", { children: x })
  ] }) : s = /* @__PURE__ */ i.jsx("div", { children: x }));
  let u = { ...h };
  u.size /= 2, u = o(u);
  let V = /* @__PURE__ */ i.jsx("div", { id: g, style: z, children: /* @__PURE__ */ i.jsx(
    F,
    {
      editorRef: S,
      setInternalValueTo: b.current,
      readOnly: e.disabled,
      onBlur: () => {
        clearTimeout(a.current), n({
          action: l.updateValue,
          baseVariableValue: r.current
        }), a.current = null;
      },
      onFocus: () => {
      },
      onBeforeChange: (d) => {
        r.current !== d && (r.current = d, v((B) => {
          let f = { ...B };
          return f.ignoreUpdate = !0, f;
        }), n({
          action: l.updateImmediateValue,
          args: { text: d },
          baseVariableValue: d
        }), clearTimeout(a.current), a.current = setTimeout(function() {
          n({
            action: l.updateValue,
            baseVariableValue: r.current
          }), a.current = null;
        }, 3e3));
      },
      paddingBottom: u
    }
  ) }, g), t = V;
  return e.showResults && e.resultsLocation === "bottom" && (t = /* @__PURE__ */ i.jsxs(i.Fragment, { children: [
    V,
    s
  ] })), t = /* @__PURE__ */ i.jsxs("div", { style: { margin: "12px 0" }, children: [
    /* @__PURE__ */ i.jsx("a", { name: m }),
    /* @__PURE__ */ i.jsx(
      "div",
      {
        style: {
          padding: "0",
          border: "var(--mainBorder)",
          borderRadius: "var(--mainBorderRadius)",
          height: o(W),
          width: o(p),
          maxWidth: "100%",
          display: "flex",
          flexDirection: "column"
        },
        id: m,
        children: t
      }
    )
  ] }), e.showResults && (e.resultsLocation === "left" ? t = /* @__PURE__ */ i.jsxs("div", { style: { display: "flex", maxWidth: "100%", margin: "12px 0" }, children: [
    /* @__PURE__ */ i.jsx(
      "div",
      {
        style: {
          maxWidth: "50%",
          paddingRight: "15px",
          boxSizing: "border-box"
        },
        children: s
      }
    ),
    /* @__PURE__ */ i.jsx(
      "div",
      {
        style: {
          maxWidth: "50%",
          boxSizing: "border-box"
        },
        children: t
      }
    )
  ] }) : e.resultsLocation === "right" && (t = /* @__PURE__ */ i.jsxs("div", { style: { display: "flex", maxWidth: "100%", margin: "12px 0" }, children: [
    /* @__PURE__ */ i.jsx(
      "div",
      {
        style: {
          maxWidth: "50%",
          paddingRight: "15px",
          boxSizing: "border-box"
        },
        children: t
      }
    ),
    /* @__PURE__ */ i.jsx(
      "div",
      {
        style: {
          maxWidth: "50%",
          boxSizing: "border-box"
        },
        children: s
      }
    )
  ] }))), /* @__PURE__ */ i.jsx(I, { partialVisibility: !0, onChange: C, children: t });
});
export {
  X as default
};
