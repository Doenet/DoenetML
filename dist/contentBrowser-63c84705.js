import { u as B, j as t, k as m, V as F } from "./index-7c50cb13.js";
import R, { useEffect as f } from "react";
import { L as p } from "./index-bdc9901b.js";
const O = R.memo(function(b) {
  let { name: E, id: s, SVs: i, children: u, actions: n, callAction: o, location: c } = B(b), g = c.search || "", d = c.hash || "", y = (e) => {
    n.recordVisibilityChange && o({
      action: n.recordVisibilityChange,
      args: { isVisible: e }
    });
  }, j = (e) => {
    o({
      action: n.setSelectedItemInd,
      args: { ind: e }
    });
  };
  if (f(() => () => {
    n.recordVisibilityChange && o({
      action: n.recordVisibilityChange,
      args: { isVisible: !1 }
    });
  }, []), f(() => {
    let e = d.indexOf("\\/");
    if (e !== -1) {
      let a = d.substring(e), l = i.indByEscapedComponentName[a];
      l !== void 0 && l !== i.selectedItemInd && j(l);
    }
  }, [d]), i.hidden)
    return null;
  let I = s.indexOf("\\/"), v = s.substring(0, I), h = g + "#" + v, w = i.allInitials.map((e) => /* @__PURE__ */ t.jsx(
    p,
    {
      style: {
        padding: "0 5px",
        width: "10px",
        cursor: "pointer",
        color: "var(--mainBlue)",
        textDecoration: e === i.initial ? "underline" : "none"
      },
      to: h + m(i.firstComponentNameByInitial[e]),
      children: e
    },
    e
  )), x = [], C = i.itemInfoForInitial.length, V = Math.ceil(C / 3);
  for (let e = 0; e < V; e++) {
    let a = [];
    for (let l = e * 3; l < (e + 1) * 3; l++) {
      let r = i.itemInfoForInitial[l];
      if (!r)
        break;
      a.push(
        /* @__PURE__ */ t.jsx("td", { width: "33%", children: /* @__PURE__ */ t.jsx(
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
            to: h + m(r.componentName),
            children: r.label
          },
          r.ind
        ) })
      );
    }
    x.push(/* @__PURE__ */ t.jsx("tr", { children: a }, e));
  }
  let S = /* @__PURE__ */ t.jsx("table", { children: x }), k = /* @__PURE__ */ t.jsxs("div", { style: { width: "100%" }, "data-test": "labelPicker", children: [
    /* @__PURE__ */ t.jsx(
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
    /* @__PURE__ */ t.jsx(
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
        children: S
      }
    )
  ] });
  return /* @__PURE__ */ t.jsx(F, { partialVisibility: !0, onChange: y, children: /* @__PURE__ */ t.jsxs("div", { id: s, children: [
    /* @__PURE__ */ t.jsx("a", { name: s }),
    /* @__PURE__ */ t.jsxs("div", { style: { display: "flex" }, "data-test": "initials", children: [
      "Filter by: ",
      w
    ] }),
    k,
    u
  ] }) });
});
export {
  O as default
};
