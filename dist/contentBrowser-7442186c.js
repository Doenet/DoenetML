import { u as k, j as i, k as m, V as B } from "./index-8862516e.js";
import F, { useEffect as x } from "react";
import { u as R, L as p } from "./index-f787cc75.js";
import "react-dom";
import "styled-components";
const W = F.memo(function(f) {
  let { name: L, id: s, SVs: t, children: b, actions: n, callAction: o } = k(f), { hash: d, search: u } = R(), g = (e) => {
    n.recordVisibilityChange && o({
      action: n.recordVisibilityChange,
      args: { isVisible: e }
    });
  }, y = (e) => {
    o({
      action: n.setSelectedItemInd,
      args: { ind: e }
    });
  };
  if (x(() => () => {
    n.recordVisibilityChange && o({
      action: n.recordVisibilityChange,
      args: { isVisible: !1 }
    });
  }, []), x(() => {
    let e = d.indexOf("\\/");
    if (e !== -1) {
      let a = d.substring(e), l = t.indByEscapedComponentName[a];
      l !== void 0 && l !== t.selectedItemInd && y(l);
    }
  }, [d]), t.hidden)
    return null;
  let j = s.indexOf("\\/"), I = s.substring(0, j), c = u + "#" + I, v = t.allInitials.map((e) => /* @__PURE__ */ i.jsx(
    p,
    {
      style: {
        padding: "0 5px",
        width: "10px",
        cursor: "pointer",
        color: "var(--mainBlue)",
        textDecoration: e === t.initial ? "underline" : "none"
      },
      to: c + m(t.firstComponentNameByInitial[e]),
      children: e
    },
    e
  )), h = [], w = t.itemInfoForInitial.length, C = Math.ceil(w / 3);
  for (let e = 0; e < C; e++) {
    let a = [];
    for (let l = e * 3; l < (e + 1) * 3; l++) {
      let r = t.itemInfoForInitial[l];
      if (!r)
        break;
      a.push(
        /* @__PURE__ */ i.jsx("td", { width: "33%", children: /* @__PURE__ */ i.jsx(
          p,
          {
            style: {
              display: "block",
              // padding: "4px",
              // width: "100%",
              cursor: "pointer",
              color: "var(--canvasText)",
              textDecoration: "none",
              backgroundColor: r.selected ? "var(--mainGray)" : "var(--canvas)"
            },
            to: c + m(r.componentName),
            children: r.label
          },
          r.ind
        ) })
      );
    }
    h.push(/* @__PURE__ */ i.jsx("tr", { children: a }, e));
  }
  let V = /* @__PURE__ */ i.jsx("table", { children: h }), S = /* @__PURE__ */ i.jsxs("div", { style: { width: "100%" }, "data-test": "labelPicker", children: [
    /* @__PURE__ */ i.jsx(
      "div",
      {
        style: {
          marginTop: "12px",
          height: "25px",
          maxWidth: "220px"
        },
        children: "Select component"
      }
    ),
    /* @__PURE__ */ i.jsx(
      "div",
      {
        style: {
          display: "flex",
          flexDirection: "column",
          border: "solid",
          maxWidth: "100%",
          height: "100px",
          overflowX: "hidden",
          marginBottom: "12px",
          boxSizing: "border-box"
        },
        children: V
      }
    )
  ] });
  return /* @__PURE__ */ i.jsx(B, { partialVisibility: !0, onChange: g, children: /* @__PURE__ */ i.jsxs("div", { id: s, children: [
    /* @__PURE__ */ i.jsx("a", { name: s }),
    /* @__PURE__ */ i.jsxs("div", { style: { display: "flex" }, "data-test": "initials", children: [
      "Filter by: ",
      v
    ] }),
    S,
    b
  ] }) });
});
export {
  W as default
};
