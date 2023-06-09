import { u as y, j as t, V as x } from "./index-7c50cb13.js";
import V, { useEffect as b } from "react";
const w = V.memo(function(g) {
  let { name: C, id: n, SVs: i, children: s, actions: r, callAction: a } = y(g), c = (e) => {
    a({
      action: r.recordVisibilityChange,
      args: { isVisible: e }
    });
  };
  if (b(() => () => {
    a({
      action: r.recordVisibilityChange,
      args: { isVisible: !1 }
    });
  }, []), i.hidden)
    return null;
  let l = [];
  const m = i.margins[0], f = i.margins[1], u = s.length;
  for (let [e, d] of s.entries()) {
    let p = i.widths[e], o = m, h = f;
    e > 0 && (o += i.gapWidth / 2), e < u - 1 && (h += i.gapWidth / 2), l.push(
      /* @__PURE__ */ t.jsx(
        "span",
        {
          style: {
            marginLeft: `${o}%`,
            marginRight: `${h}%`,
            width: `${p}%`
          },
          children: d
        },
        d.key
      )
    );
  }
  return /* @__PURE__ */ t.jsx(x, { partialVisibility: !0, onChange: c, children: /* @__PURE__ */ t.jsxs(
    "div",
    {
      id: n,
      style: { display: "flex", maxWidth: "850px", margin: "12px 0" },
      children: [
        /* @__PURE__ */ t.jsx("a", { name: n }),
        l
      ]
    }
  ) });
});
export {
  w as default
};
