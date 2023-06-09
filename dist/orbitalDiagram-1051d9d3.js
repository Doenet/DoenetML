import { u as g, j as i, V as j } from "./index-64c78e6b.js";
import f, { createRef as u, useEffect as D } from "react";
import O from "styled-components";
import "react-dom";
const U = O.svg`
  border: "2px solid red";
  margin: 2px;
  outline: none;
`, T = f.memo(function(t) {
  let { name: l, id: r, SVs: e, actions: n, callAction: s } = g(t), a = u(e.fixed);
  a.current = e.fixed;
  let d = (o) => {
    s({
      action: n.recordVisibilityChange,
      args: { isVisible: o }
    });
  };
  if (D(() => () => {
    s({
      action: n.recordVisibilityChange,
      args: { isVisible: !1 }
    });
  }, []), e.hidden || !e.value)
    return null;
  let x = [...e.value].reverse(), h = [];
  for (let [o, p] of Object.entries(x)) {
    let c = x.length - o - 1;
    h.push(
      /* @__PURE__ */ i.jsx(
        R,
        {
          rowNumber: c,
          orbitalText: p.orbitalText,
          boxes: p.boxes,
          name: r
        },
        `OrbitalRow${c}`
      )
    );
  }
  return /* @__PURE__ */ i.jsx(j, { partialVisibility: !0, onChange: d, children: /* @__PURE__ */ i.jsx(i.Fragment, { children: h }) });
}), R = f.memo(function({
  rowNumber: t,
  orbitalText: l,
  boxes: r,
  name: e
}) {
  let n = {
    width: "800px",
    height: "44px",
    display: "flex",
    backgroundColor: "#E2E2E2",
    marginTop: "2px",
    marginBottom: "2px",
    padding: "2px",
    border: "white solid 2px"
  }, s = [];
  for (let [a, d] of Object.entries(r))
    s.push(
      /* @__PURE__ */ i.jsx(
        V,
        {
          boxNum: a,
          rowNumber: t,
          arrows: d,
          name: e
        },
        `OrbitalBox${t}-${a}`
      )
    );
  return /* @__PURE__ */ i.jsxs(
    "div",
    {
      id: `OrbitalRow${t}${e}`,
      tabIndex: "-1",
      style: n,
      children: [
        /* @__PURE__ */ i.jsx(
          m,
          {
            orbitalText: l,
            rowNumber: t,
            name: e
          }
        ),
        s
      ]
    },
    `OrbitalRow${t}`
  );
}), m = f.memo(function({
  rowNumber: t,
  orbitalText: l,
  name: r
}) {
  return /* @__PURE__ */ i.jsx(
    "div",
    {
      id: `OrbitalText${t}${r}`,
      style: {
        marginRight: "4px",
        height: "14px",
        width: "40px",
        backgroundColor: "white"
      },
      type: "text",
      size: "4",
      children: l
    }
  );
}), V = f.memo(function({
  boxNum: t,
  arrows: l = "",
  rowNumber: r,
  name: e
}) {
  const n = /* @__PURE__ */ i.jsx(
    "polyline",
    {
      id: `firstUp${t}`,
      points: "6,14 12,6 18,14 12,6 12,35",
      style: { fill: "none", stroke: "black", strokeWidth: "2" }
    },
    `orbitalboxfirstUp${t}`
  ), s = /* @__PURE__ */ i.jsx(
    "polyline",
    {
      id: `firstDown${t}`,
      points: "6,26 12,34 18,26 12,34 12,5",
      style: { fill: "none", stroke: "black", strokeWidth: "2" }
    },
    `orbitalboxfirstDown${t}`
  ), a = /* @__PURE__ */ i.jsx(
    "polyline",
    {
      id: `secondUp${t}`,
      points: "22,14 28,6 34,14 28,6 28,35",
      style: { fill: "none", stroke: "black", strokeWidth: "2" }
    },
    `orbitalboxsecondUp${t}`
  ), d = /* @__PURE__ */ i.jsx(
    "polyline",
    {
      id: `secondDown${t}`,
      points: "22,26 28,34 34,26 28,34 28,5",
      style: { fill: "none", stroke: "black", strokeWidth: "2" }
    },
    `orbitalboxsecondDown${t}`
  ), x = /* @__PURE__ */ i.jsx(
    "polyline",
    {
      id: `thirdUp${t}`,
      points: "38,14 44,6 50,14 44,6 44,35",
      style: { fill: "none", stroke: "black", strokeWidth: "2" }
    },
    `orbitalboxthirdUp${t}`
  ), h = /* @__PURE__ */ i.jsx(
    "polyline",
    {
      id: `thirdDown${t}`,
      points: "38,26 44,34 50,26 44,34 44,5",
      style: { fill: "none", stroke: "black", strokeWidth: "2" }
    },
    `orbitalboxthirdDown${t}`
  );
  let o = [], [p, c, y] = l.split("");
  p == "U" && o.push(n), p == "D" && o.push(s), c == "U" && o.push(a), c == "D" && o.push(d), y == "U" && o.push(x), y == "D" && o.push(h);
  let k = 40;
  y && (k = 56);
  let w = "black", $ = "2px";
  return /* @__PURE__ */ i.jsxs(
    U,
    {
      id: `orbitalbox${e}${r}-${t}`,
      tabIndex: "-1",
      width: k,
      height: "40",
      children: [
        /* @__PURE__ */ i.jsx(
          "rect",
          {
            x: "0",
            y: "0",
            rx: "4",
            ry: "4",
            width: k,
            height: "40",
            style: {
              fill: "white",
              stroke: w,
              strokeWidth: $,
              fillOpacity: "1",
              strokeOpacity: "1"
            }
          }
        ),
        o
      ]
    },
    `orbitalbox${t}`
  );
});
export {
  T as default
};
