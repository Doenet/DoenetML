import { j as t, u as S, V as F, E as X } from "./index-64c78e6b.js";
import C, { useState as $, useRef as L, useEffect as H } from "react";
import B, { ThemeProvider as K } from "styled-components";
import { A as O } from "./ActionButtonGroup-587ef840.js";
import { T as w } from "./ToggleButton-9d940edb.js";
import "react-dom";
const D = B.div`
  display: ${(s) => s.vertical ? "static" : "flex"};
  width: ${(s) => s.width == "menu" ? "var(--menuWidth)" : ""};
  // height: 'fit-content';
  // margin: 2px 0px 2px 0px ;
  /* flex-wrap: wrap; */
  overflow: clip;
`, z = {
  margin: "0px -2px 0px -2px",
  borderRadius: "0",
  padding: "0px 12px 0px 10px"
}, N = {
  margin: "-2px 4px -2px 4px",
  borderRadius: "0",
  padding: "0px 10px 0px 10px"
}, U = (s) => {
  const [y, I] = $(0), k = (p) => {
    I(p), s.onClick && s.onClick(p);
  };
  let d = s.vertical ? "first_vert" : "first", r = s.vertical ? "last_vert" : "last", o = C.Children.toArray(s.children), h = o.map((p, g) => {
    let l = {
      index: g,
      isSelected: g === y,
      onClick: k
    };
    return g === 0 ? l.num = d : g === o.length - 1 && (l.num = r), C.cloneElement(p, l);
  });
  return /* @__PURE__ */ t.jsx(
    D,
    {
      style: { height: "fit-content" },
      vertical: s.vertical,
      width: s.width,
      role: "group",
      children: /* @__PURE__ */ t.jsx(K, { theme: s.vertical ? N : z, children: h })
    }
  );
}, q = B.text`
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  -webkit-tap-highlight-color: rgba(255, 255, 255, 0);
`, le = C.memo(function(y) {
  let { name: I, id: k, SVs: d, actions: r, callAction: o } = S(y, !1), [h, p] = $("add remove points"), g = L(null), l = L(null), _ = (e) => {
    o({
      action: r.recordVisibilityChange,
      args: { isVisible: e }
    });
  };
  if (H(() => () => {
    o({
      action: r.recordVisibilityChange,
      args: { isVisible: !1 }
    });
  }, []), d.hidden)
    return null;
  function E(e) {
    e === 0 ? (console.log(e), p("add remove points")) : e === 1 ? (console.log(e), p("toggle")) : e === 2 && (console.log(e), p("move points"));
  }
  let V = null;
  d.fixed || (V = /* @__PURE__ */ t.jsxs(t.Fragment, { children: [
    /* @__PURE__ */ t.jsxs(U, { onClick: E, children: [
      /* @__PURE__ */ t.jsx(w, { value: "Add/Remove points" }),
      /* @__PURE__ */ t.jsx(w, { value: "Toggle points and intervals" }),
      /* @__PURE__ */ t.jsx(w, { value: "Move Points" })
    ] }),
    /* @__PURE__ */ t.jsxs(O, { children: [
      /* @__PURE__ */ t.jsx(
        X,
        {
          onClick: () => o({
            action: r.clear
          }),
          value: "Clear"
        }
      ),
      /* @__PURE__ */ t.jsx(
        X,
        {
          onClick: () => o({
            action: r.setToR
          }),
          value: "R"
        }
      )
    ] })
  ] }));
  let b = 40, j = 36, R = [], T = [];
  for (let e = -10; e <= 10; e++)
    T.push(e);
  let W = [];
  for (let e = b; e < 780; e = e + j) {
    R.push(
      /* @__PURE__ */ t.jsx(
        "line",
        {
          x1: e,
          y1: "35",
          x2: e,
          y2: "45",
          style: { stroke: "black", strokeWidth: "1" },
          shapeRendering: "geometricPrecision"
        },
        "hash" + e
      )
    );
    let i = T.shift();
    W.push(
      /* @__PURE__ */ t.jsx(q, { x: e, y: "66", textAnchor: "middle", children: i }, "label" + e)
    );
  }
  let x = [];
  for (let e of d.points) {
    let i = e.inSubset, a = P(e.value), n = "var(--mainPurple)";
    i || (n = "white");
    let u = `point-${a}`;
    x.push(
      /* @__PURE__ */ t.jsx(
        "circle",
        {
          cx: a,
          cy: "40",
          r: "6",
          stroke: "black",
          strokeWidth: "1",
          fill: n
        },
        u
      )
    );
  }
  let A = [];
  for (let e of d.intervals) {
    if (e.right < e.left || !e.inSubset)
      continue;
    let i = P(e.left), a = P(e.right);
    const n = `lowerIntervalPoint${i}`, u = `higherIntervalPoint${a}`, c = `line${i}-${a}`;
    let f = "var(--mainPurple)", v = i, M = a;
    i < 38 && (v = 20, x.push(
      /* @__PURE__ */ t.jsx(
        "polygon",
        {
          points: "5,40 20,46 20,34",
          style: {
            fill: f,
            stroke: f,
            strokeWidth: "1"
          }
        },
        n
      )
    )), a > 778 && (M = 782, x.push(
      /* @__PURE__ */ t.jsx(
        "polygon",
        {
          points: "795,40 780,46 780,34",
          style: {
            fill: f,
            stroke: f,
            strokeWidth: "1"
          }
        },
        u
      )
    )), A.push(
      /* @__PURE__ */ t.jsx(
        "line",
        {
          x1: v,
          y1: "40",
          x2: M,
          y2: "40",
          style: { stroke: f, strokeWidth: "8" }
        },
        c
      )
    );
  }
  function P(e) {
    let i = 10, a = 1, n = e + i;
    return b + n / a * j;
  }
  function G(e) {
    let i = e - b, a = 10, n = 1, u = i / j * n;
    return u = u - a, u;
  }
  async function m(e, i) {
    let a = e.clientX - g.current.offsetLeft, n = G(a), u = 0.2;
    if (i === "up") {
      if (h === "move points" && l.current !== null && (o({
        action: r.movePoint,
        args: {
          pointInd: l.current,
          value: n,
          transient: !1
        }
      }), l.current = null), h === "add remove points")
        l.current !== null ? o({
          action: r.deletePoint,
          args: { pointInd: l.current }
        }) : d.points.map((c) => c.value).includes(n) || o({
          action: r.addPoint,
          args: { value: n }
        });
      else if (h === "toggle")
        if (l.current !== null)
          o({
            action: r.togglePoint,
            args: { pointInd: l.current }
          });
        else {
          let c = 0;
          for (let f of d.points)
            f.value < n && c++;
          o({
            action: r.toggleInterval,
            args: { intervalInd: c }
          });
        }
    } else if (i === "down") {
      let c = null;
      for (let [f, v] of d.points.entries())
        if (Math.abs(v.value - n) < u) {
          c = f;
          break;
        }
      c !== null ? l.current = c : l.current = null;
    } else
      i === "move" ? h === "move points" && l.current !== null && o({
        action: r.movePoint,
        args: {
          pointInd: l.current,
          value: n,
          transient: !0
        }
      }) : i == "leave" && h === "move points" && l.current !== null && (o({
        action: r.movePoint,
        args: {
          pointInd: l.current,
          value: n,
          transient: !1
        }
      }), l.current = null);
  }
  return /* @__PURE__ */ t.jsx(F, { partialVisibility: !0, onChange: _, children: /* @__PURE__ */ t.jsxs(t.Fragment, { children: [
    /* @__PURE__ */ t.jsx("a", { name: k }),
    /* @__PURE__ */ t.jsx("div", { ref: g, style: { display: "flex", gap: "12px" }, children: V }),
    /* @__PURE__ */ t.jsxs(
      "svg",
      {
        width: "808",
        height: "80",
        style: { backgroundColor: "white" },
        onMouseDown: (e) => {
          m(e, "down");
        },
        onMouseUp: (e) => {
          m(e, "up");
        },
        onMouseMove: (e) => {
          m(e, "move");
        },
        onMouseLeave: (e) => {
          m(e, "leave");
        },
        children: [
          /* @__PURE__ */ t.jsx(
            "polygon",
            {
              points: "5,40 20,50 20,30",
              style: { fill: "black", stroke: "black", strokeWidth: "1" }
            }
          ),
          /* @__PURE__ */ t.jsx(
            "polygon",
            {
              points: "795,40 780,50 780,30",
              style: { fill: "black", stroke: "black", strokeWidth: "1" }
            }
          ),
          A,
          R,
          /* @__PURE__ */ t.jsx(
            "line",
            {
              x1: "20",
              y1: "40",
              x2: "780",
              y2: "40",
              style: { stroke: "black", strokeWidth: "2" }
            }
          ),
          x,
          W
        ]
      }
    )
  ] }) });
});
export {
  le as default
};
