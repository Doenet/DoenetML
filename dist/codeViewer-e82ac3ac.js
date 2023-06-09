import { u as g, j as e, B as p, V as b } from "./index-8862516e.js";
import f, { useEffect as y } from "react";
import { s as t } from "./css-ab4d83ca.js";
import "react-dom";
import "styled-components";
const B = f.memo(function(h) {
  let { name: v, id: r, SVs: i, children: c, actions: o, callAction: n } = g(
    h,
    !1
  ), m = (u) => {
    n({
      action: o.recordVisibilityChange,
      args: { isVisible: u }
    });
  };
  if (y(() => () => {
    n({
      action: o.recordVisibilityChange,
      args: { isVisible: !1 }
    });
  }, []), i.hidden)
    return null;
  let s = { ...i.height };
  s.size = s.size - 40;
  let a = { ...i.width };
  a.size = a.size - 4;
  let d = {
    width: t(i.width),
    maxWidth: "100%"
  };
  i.locationFromParent !== "bottom" && (d.border = "var(--mainBorder)", d.borderRadius = "var(--mainBorderRadius)");
  let x = /* @__PURE__ */ e.jsxs(
    "div",
    {
      style: {
        width: t(i.width),
        height: t(i.height),
        maxWidth: "100%",
        // padding: "12px",
        // border: "1px solid black",
        // overflowY: "scroll"
        boxSizing: "border-box",
        paddingLeft: "10px"
      },
      children: [
        /* @__PURE__ */ e.jsx("div", { style: { height: "28px" }, children: /* @__PURE__ */ e.jsx(
          p,
          {
            onClick: () => n({ action: o.updateComponents }),
            value: "update",
            id: r + "_updateButton",
            style: { marginTop: "10px" }
          }
        ) }),
        /* @__PURE__ */ e.jsx(
          "div",
          {
            style: {
              overflowY: "scroll",
              width: t(a),
              maxWidth: "100%",
              height: t(s),
              paddingRight: "10px",
              marginTop: "10px",
              boxSizing: "border-box"
            },
            id: r + "_content",
            children: c
          }
        )
      ]
    }
  ), l = {};
  return i.locationFromParent !== "bottom" && (l = { margin: "12px 0" }), /* @__PURE__ */ e.jsx(b, { partialVisibility: !0, onChange: m, children: /* @__PURE__ */ e.jsxs("div", { style: l, children: [
    /* @__PURE__ */ e.jsx("a", { name: r }),
    /* @__PURE__ */ e.jsx(
      "div",
      {
        style: d,
        className: "codeViewerSurroundingBox",
        id: r,
        children: x
      }
    )
  ] }) });
});
export {
  B as default
};
