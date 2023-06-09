import { u as ne, R as re, r as se, j as l, E, M as H, C as ie } from "./index-8862516e.js";
import ue, { useRef as K, useState as B, useEffect as J } from "react";
import D from "styled-components";
import { A as q } from "./ActionButtonGroup-8ec65ba6.js";
import "react-dom";
let I = (a, u) => ie.round_numbers_to_decimals(a, u).tree;
const Q = D.div`
  width: fit-content;
  height: ${(a) => a.labeled && a.noTicked ? "60px" : a.labeled ? "80px" : a.noTicked ? "40px" : "60px"};
  margin-bottom: 12px;
  &:focus {
    outline: 0;
  }
`, Y = D.div`
  padding-top: 10px;
  height: 50px;
`, Z = D.div`
  position: relative;
  border-radius: 3px;
  background-color: var(--canvastext);
  height: 2px;
  width: ${(a) => a.width};
  user-select: none;
`, L = D.p`
  display: inline;
  user-select: none;
`, _ = D.div`
  width: 10px;
  height: 10px;
  border-radius: 5px;
  position: relative;
  top: -4px;
  opacity: 1;
  background: ${(a) => a.disabled ? "var(--mainGray)" : "var(--mainBlue)"}; // var(--mainBlue)?
  cursor: pointer;
`, T = D.div`
  position: absolute;
  border-left: 2px solid var(--mainGray);
  height: 10px;
  top: 1px;
  z-index: -2;
  left: ${(a) => a.x};
  user-select: none;
`, k = D.p`
  position: absolute;
  left: ${(a) => a.x};
  color: var(--canvastext);
  font-size: 12px;
  top: 1px;
  user-select: none;
`;
function S(a, u, b, t) {
  let e, s = Math.max(Math.abs(t.firstItem), Math.abs(t.lastItem)), h = Math.round(Math.log(s) / Math.log(10));
  s === 0 && (h = 1);
  let O = 5 - h;
  if (a.length === 0) {
    let r = [
      I(t.firstItem, O),
      I(t.lastItem, O)
    ], n = Math.min(t.numItems, 100), c = Math.floor(t.numItems / n);
    for (let m = 1; m < n; m++)
      r.push(
        I(t.from + t.step * m * c, O)
      );
    e = F(r);
  } else {
    let r = a.map((n) => I(n, O));
    e = F(r);
  }
  const M = t.numItems;
  if (t.width.size > e * M)
    if (a.length === 0) {
      let r = [], n = [], c = Math.max(Math.abs(t.firstItem), Math.abs(t.lastItem)), m = Math.round(Math.log(c) / Math.log(10));
      c === 0 && (m = 1);
      let v = 5 - m;
      for (let p = 0; p < t.numItems; p++) {
        let w = I(
          t.from + t.step * p,
          v
        );
        r.push(/* @__PURE__ */ l.jsx(T, { x: `${p * u}px` }, w)), n.push(
          /* @__PURE__ */ l.jsx(k, { x: `${p * u - 3}px`, children: w }, w)
        );
      }
      return [r, n];
    } else
      return [
        a.map((r, n) => /* @__PURE__ */ l.jsx(T, { x: `${n * u}px` }, r)),
        a.map((r, n) => /* @__PURE__ */ l.jsx(k, { x: `${n * u - 3}px`, children: r }, r))
      ];
  else if (t.width.size < e) {
    let r = [...a];
    if (a.length === 0)
      for (let n = 0; n < Math.min(3, t.numItems); n++)
        r.push(t.from + t.step * n);
    return [
      r.map((n, c) => c == 0 ? /* @__PURE__ */ l.jsx(T, { x: `${c * u}px` }, n) : ""),
      r.map((n, c) => {
        if (c == 0)
          return /* @__PURE__ */ l.jsx(k, { x: `${c * u - 3}px`, children: n }, n);
        if (c == 2)
          return /* @__PURE__ */ l.jsx(k, { x: `${c * u - 3}px`, children: "..." }, n);
      })
    ];
  } else if (t.width.size < e * M) {
    let r, n;
    if (a.length === 0) {
      let c = Math.floor(t.width.size / e), m = t.lastItem - t.firstItem, v = m / (c + 1), p = Math.max(Math.abs(t.firstItem), Math.abs(t.lastItem)), w = Math.round(Math.log(p) / Math.log(10)), $ = 1 - w, f = Math.max(
        I(v, $),
        10 ** -$
      ), j = Math.floor(m / f) + 1, y = 5 - w;
      n = [...Array(j).keys()].map(
        (A) => t.from + f * A
      ), r = n.map(
        (A) => Math.round((A - t.from) / t.step)
      ), n = n.map((A) => I(A, y));
    } else {
      let c = Math.max(
        2,
        Math.floor(t.width.size / e)
      ), m = Math.ceil(
        (t.numItems - 1) / (c - 1) - 1e-10
      ), v = Math.floor((t.numItems - 1) / m + 1e-10) + 1;
      r = [...Array(v).keys()].map(
        (f) => Math.round(m * f)
      );
      let p = Math.max(Math.abs(t.firstItem), Math.abs(t.lastItem)), $ = 2 - Math.round(Math.log(p) / Math.log(10));
      n = r.map(
        (f) => I(a[f], $)
      );
    }
    return [
      r.map((c, m) => /* @__PURE__ */ l.jsx(T, { x: `${c * u}px` }, n[m])),
      r.map((c, m) => /* @__PURE__ */ l.jsx(k, { x: `${c * u}px`, children: n[m] }, n[m]))
    ];
  } else
    return [
      a.map((r) => /* @__PURE__ */ l.jsx(T, { x: `${(r - b) * u}px` }, r)),
      a.map((r) => /* @__PURE__ */ l.jsx(k, { x: `${(r - b) * u - 3}px`, children: r }, r))
    ];
}
function F(a) {
  return a.reduce(function(b, t) {
    return b > t.toString().length ? b : t.toString().length;
  }) * 12;
}
function ee(a, u, b) {
  let t = F(a);
  const e = Object.keys(a).length;
  if (b.width.size > t * e)
    return [
      a.map((s, h) => /* @__PURE__ */ l.jsx(T, { x: `${h * u}px` }, s)),
      a.map((s, h) => /* @__PURE__ */ l.jsx(k, { x: `${h * u - 3}px`, children: s }, s))
    ];
  if (b.width.size < t)
    return [
      a.map((s, h) => h == 0 ? /* @__PURE__ */ l.jsx(T, { x: `${h * u}px` }, s) : ""),
      a.map((s, h) => {
        if (h == 0)
          return /* @__PURE__ */ l.jsx(k, { x: `${h * u - 3}px`, children: s }, s);
        if (h == 2)
          return /* @__PURE__ */ l.jsx(k, { x: `${h * u - 3}px`, children: "..." }, s);
      })
    ];
  if (b.width.size < t * e)
    return [
      a.map((s, h) => /* @__PURE__ */ l.jsx(T, { x: `${h * u}px` }, s)),
      a.map((s, h) => h == 0 || e === h + 1 ? /* @__PURE__ */ l.jsx(k, { x: `${h * u - 3}px`, children: s }, s) : /* @__PURE__ */ l.jsx(k, { x: `${h * u - 3}px`, children: s.length < 3 ? s : s.substr(0, 3) + "..." }, s))
    ];
}
function te(a, u, b) {
  return b + a / u;
}
function N(a, u, b) {
  let t = Math.max(
    0,
    Math.min(b.numItems - 1, Math.round(a - b.firstItem))
  ), e;
  return u.length === 0 ? e = b.from + b.step * t : e = u[t], [e, t];
}
const de = ue.memo(function a(u) {
  let { name: b, id: t, SVs: e, actions: s, ignoreUpdate: h, rendererName: O, callAction: M } = ne(u);
  a.baseStateVariable = "index";
  const r = K(null), n = re(se(O)), [c, m] = B(0), v = K(!1), [p, w] = B(0), $ = e.type === "text" ? 0 : e.firstItem;
  let f = e.width.size / (e.numItems - 1);
  const [j, y] = B(0);
  if (J(() => {
    if (r.current) {
      const x = r.current.getBoundingClientRect();
      w(x.left);
    }
  }, []), J(() => {
    !v.current && !h && (y(e.index), e.type !== "text" ? m(e.index / (e.numItems - 1) * e.width.size) : m(e.index * f));
  }, [e.index]), e.hidden)
    return null;
  if (e.disabled) {
    let x = "";
    e.showControls ? x = /* @__PURE__ */ l.jsxs(q, { style: { marginBottom: "12px" }, children: [
      /* @__PURE__ */ l.jsx(
        E,
        {
          value: "Prev",
          onClick: (g) => R(),
          disabled: !0
        }
      ),
      /* @__PURE__ */ l.jsx(E, { value: "Next", onClick: (g) => U(), disabled: !0 })
    ] }) : x = null;
    let i = "";
    e.type === "text" ? i = ee(e.items, f, e) : i = S(e.items, f, $, e);
    let d = "";
    e.showTicks === !1 ? d = null : d = i;
    let o = null;
    if (e.label) {
      let g = e.label;
      e.labelHasLatex && (g = /* @__PURE__ */ l.jsx(H, { hideUntilTypeset: "first", inline: !0, dynamic: !0, children: g })), e.showValue ? o = /* @__PURE__ */ l.jsxs(L, { children: [
        g,
        " = " + e.valueForDisplay
      ] }) : o = /* @__PURE__ */ l.jsx(L, { children: g });
    } else
      !e.label && e.showValue ? o = /* @__PURE__ */ l.jsx(L, { children: e.valueForDisplay }) : o = null;
    return /* @__PURE__ */ l.jsxs(
      Q,
      {
        labeled: e.showControls || e.label,
        noTicked: e.showTicks === !1,
        ref: r,
        children: [
          /* @__PURE__ */ l.jsx(
            "div",
            {
              id: `${t}-label`,
              style: { height: e.label || e.showValue ? "20px" : "0px" },
              children: o
            }
          ),
          /* @__PURE__ */ l.jsx(Y, { children: /* @__PURE__ */ l.jsxs(Z, { width: `${e.width.size}px`, id: t, children: [
            /* @__PURE__ */ l.jsx(
              _,
              {
                disabled: !0,
                style: { left: `${c - 4}px` },
                id: `${t}-handle`
              }
            ),
            d
          ] }) }),
          /* @__PURE__ */ l.jsx("div", { style: { height: e.showControls ? "20px" : "0px" }, children: x })
        ]
      }
    );
  }
  function A(x) {
    if (v.current = !0, document.addEventListener("mousemove", W), document.addEventListener("mouseup", V), m(x.nativeEvent.clientX - p), e.type !== "text") {
      let i = te(
        x.nativeEvent.clientX - p,
        f,
        $
      ), d = N(i, e.items, e);
      y(d[1]), n((o) => {
        let g = { ...o };
        return g.ignoreUpdate = !0, g;
      }), M({
        action: s.changeValue,
        args: { value: d[0], transient: !0 },
        baseVariableValue: d[1]
      });
    } else {
      let i = Math.round((x.nativeEvent.clientX - p) / f);
      y(i), n((d) => {
        let o = { ...d };
        return o.ignoreUpdate = !0, o;
      }), M({
        action: s.changeValue,
        args: { value: e.items[i], transient: !0 },
        baseVariableValue: i
      });
    }
  }
  function V(x) {
    if (document.removeEventListener("mousemove", W), document.removeEventListener("mouseup", V), !!v.current)
      if (v.current = !1, e.type !== "text") {
        let d = function(g, z, ae) {
          return ae + g / z;
        }(
          x.clientX - p,
          f,
          $
        ), o = N(d, e.items, e);
        y(o[1]), m(o[1] * f), n((g) => {
          let z = { ...g };
          return z.ignoreUpdate = !0, z;
        }), M({
          action: s.changeValue,
          args: { value: o[0] },
          baseVariableValue: o[1]
        });
      } else {
        let i = Math.round((x.clientX - p) / f);
        i = Math.max(0, Math.min(e.numItems - 1, i)), y(i), m(i * f), n((d) => {
          let o = { ...d };
          return o.ignoreUpdate = !0, o;
        }), M({
          action: s.changeValue,
          args: { value: e.items[i] },
          baseVariableValue: i
        });
      }
  }
  function W(x) {
    if (v.current)
      if (m(
        Math.max(0, Math.min(e.width.size, x.clientX - p))
      ), e.type !== "text") {
        let i = te(
          x.clientX - p,
          f,
          $
        ), d = N(i, e.items, e);
        y(d[1]), n((o) => {
          let g = { ...o };
          return g.ignoreUpdate = !0, g;
        }), M({
          action: s.changeValue,
          args: { value: d[0], transient: !0, skippable: !0 },
          baseVariableValue: d[1]
        });
      } else {
        let i = Math.round((x.clientX - p) / f);
        y(i), n((d) => {
          let o = { ...d };
          return o.ignoreUpdate = !0, o;
        }), M({
          action: s.changeValue,
          args: { value: e.items[i], transient: !0, skippable: !0 },
          baseVariableValue: i
        });
      }
  }
  function U(x) {
    if (j === e.numItems - 1)
      return;
    let i;
    e.items.length === 0 ? i = e.from + e.step * (j + 1) : i = e.items[j + 1], n((d) => {
      let o = { ...d };
      return o.ignoreUpdate = !0, o;
    }), M({
      action: s.changeValue,
      args: { value: i },
      baseVariableValue: j + 1
    }), y(j + 1);
  }
  function R(x) {
    if (j === 0)
      return;
    let i;
    e.items.length === 0 ? i = e.from + e.step * (j - 1) : i = e.items[j - 1], n((d) => {
      let o = { ...d };
      return o.ignoreUpdate = !0, o;
    }), M({
      action: s.changeValue,
      args: { value: i },
      baseVariableValue: j - 1
    }), y(j - 1);
  }
  function le(x) {
    if (x.key === "ArrowLeft")
      return R();
    if (x.key === "ArrowRight")
      return U();
  }
  let X = "";
  e.type === "text" ? X = ee(e.items, f, e) : X = S(e.items, f, $, e);
  let P = "";
  e.showTicks === !1 ? P = null : P = X;
  let G = "";
  e.showControls && (G = /* @__PURE__ */ l.jsxs(q, { style: { marginBottom: "12px" }, children: [
    /* @__PURE__ */ l.jsx(
      E,
      {
        value: "Prev",
        onClick: (x) => R(),
        id: `${t}-prevbutton`
      }
    ),
    /* @__PURE__ */ l.jsx(
      E,
      {
        value: "Next",
        onClick: (x) => U(),
        id: `${t}-nextbutton`
      }
    )
  ] })), e.showValue && (c - 4, e.valueForDisplay);
  let C = null;
  if (e.label) {
    let x = e.label;
    e.labelHasLatex && (x = /* @__PURE__ */ l.jsx(H, { hideUntilTypeset: "first", inline: !0, dynamic: !0, children: x })), e.showValue ? C = /* @__PURE__ */ l.jsxs(L, { children: [
      x,
      " = " + e.valueForDisplay
    ] }) : C = /* @__PURE__ */ l.jsx(L, { children: x });
  } else
    !e.label && e.showValue ? C = /* @__PURE__ */ l.jsx(L, { children: e.valueForDisplay }) : C = null;
  return /* @__PURE__ */ l.jsxs(
    Q,
    {
      ref: r,
      labeled: e.showControls || e.label,
      noTicked: e.showTicks === !1,
      onKeyDown: le,
      tabIndex: "0",
      children: [
        /* @__PURE__ */ l.jsx(
          "div",
          {
            id: `${t}-label`,
            style: { height: e.label || e.showValue ? "20px" : "0px" },
            children: C
          }
        ),
        /* @__PURE__ */ l.jsx(Y, { onMouseDown: A, children: /* @__PURE__ */ l.jsxs(Z, { width: `${e.width.size}px`, id: t, children: [
          /* @__PURE__ */ l.jsx(
            _,
            {
              style: { left: `${c - 4}px` },
              id: `${t}-handle`
            }
          ),
          P
        ] }) }),
        /* @__PURE__ */ l.jsx("div", { style: { height: e.showControls ? "20px" : "0px" }, children: G })
      ]
    }
  );
});
export {
  de as default
};
