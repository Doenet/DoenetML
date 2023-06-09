import { u as m, j as o, V as A } from "./index-dce15b2c.js";
import j, { createRef as U, useEffect as S } from "react";
import V from "styled-components";
const W = V.svg`
  border: "2px solid red";
  margin: 2px;
  outline: none;
`, F = j.memo(function k(e) {
  let { name: u, id: i, SVs: d, actions: r, callAction: l } = m(e), p = d.selectedRowIndex - 1, g = d.selectedBoxIndex - 1;
  k.ignoreActionsWithoutCore = () => !0;
  let c = U(d.fixed);
  c.current = d.fixed;
  let f = (t) => {
    l({
      action: r.recordVisibilityChange,
      args: { isVisible: t }
    });
  };
  if (S(() => () => {
    l({
      action: r.recordVisibilityChange,
      args: { isVisible: !1 }
    });
  }, []), d.hidden)
    return null;
  function h(t) {
    c.current || l({
      action: r.selectRow,
      args: { index: Number(t) + 1 }
    });
  }
  function w(t, a) {
    c.current || (a !== void 0 && l({
      action: r.selectRow,
      args: { index: Number(a) + 1 }
    }), l({
      action: r.selectBox,
      args: { index: Number(t) + 1 }
    }));
  }
  function n(t) {
    c.current || l({
      action: r.updateRowText,
      args: { newValue: t }
    });
  }
  function s(t) {
    var a, b, y, R, B, T, v, C, D, O;
    ((a = t.relatedTarget) == null ? void 0 : a.id) !== `orbitaladdrow${i}` && ((b = t.relatedTarget) == null ? void 0 : b.id) !== `orbitalremoverow${i}` && ((y = t.relatedTarget) == null ? void 0 : y.id) !== `orbitaladdbox${i}` && ((R = t.relatedTarget) == null ? void 0 : R.id) !== `orbitaladduparrow${i}` && ((B = t.relatedTarget) == null ? void 0 : B.id) !== `orbitaladddownarrow${i}` && ((T = t.relatedTarget) == null ? void 0 : T.id) !== `orbitalremovearrow${i}` && ((v = t.relatedTarget) == null ? void 0 : v.id) !== `orbitalremovebox${i}` && (((C = t.relatedTarget) == null ? void 0 : C.id) !== `OrbitalText${p}${i}` && ((D = t.relatedTarget) == null ? void 0 : D.id) !== `OrbitalRow${p}${i}` && ((O = t.relatedTarget) == null ? void 0 : O.id.substring(0, 10 + i.length)) !== `orbitalbox${i}` && h(-1), w(-1));
  }
  let x = [];
  for (let [t, a] of Object.entries(d.rows)) {
    let b = d.rows.length - t - 1;
    x.push(
      /* @__PURE__ */ o.jsx(
        I,
        {
          updateRowText: n,
          rowNumber: b,
          selectedRow: p,
          setSelectedRow: h,
          orbitalText: a.orbitalText,
          boxes: a.boxes,
          selectedBox: g,
          setSelectedBox: w,
          deselect: s,
          name: i
        },
        `OrbitalRow${b}`
      )
    );
  }
  let $ = null;
  return d.fixed || ($ = /* @__PURE__ */ o.jsxs("div", { children: [
    /* @__PURE__ */ o.jsx(
      "button",
      {
        id: `orbitaladdrow${i}`,
        onBlur: (t) => {
          s(t);
        },
        onClick: () => {
          l({
            action: r.addRow
          });
        },
        children: "Add Row"
      }
    ),
    /* @__PURE__ */ o.jsx(
      "button",
      {
        id: `orbitalremoverow${i}`,
        onClick: () => {
          l({
            action: r.removeRow
          });
        },
        children: "Remove Row"
      }
    ),
    /* @__PURE__ */ o.jsx(
      "button",
      {
        id: `orbitaladdbox${i}`,
        onBlur: (t) => {
          s(t);
        },
        onClick: () => {
          l({
            action: r.addBox
          });
        },
        children: "Add Box"
      }
    ),
    /* @__PURE__ */ o.jsx(
      "button",
      {
        id: `orbitalremovebox${i}`,
        onBlur: (t) => {
          s(t);
        },
        onClick: () => {
          l({
            action: r.removeBox
          });
        },
        children: "Remove Box"
      }
    ),
    /* @__PURE__ */ o.jsx(
      "button",
      {
        id: `orbitaladduparrow${i}`,
        onBlur: (t) => {
          s(t);
        },
        onClick: () => {
          l({
            action: r.addUpArrow
          });
        },
        children: "Add Up Arrow"
      }
    ),
    /* @__PURE__ */ o.jsx(
      "button",
      {
        id: `orbitaladddownarrow${i}`,
        onBlur: (t) => {
          s(t);
        },
        onClick: () => {
          l({
            action: r.addDownArrow
          });
        },
        children: "Add Down Arrow"
      }
    ),
    /* @__PURE__ */ o.jsx(
      "button",
      {
        id: `orbitalremovearrow${i}`,
        onBlur: (t) => {
          s(t);
        },
        onClick: () => {
          l({
            action: r.removeArrow
          });
        },
        children: "Remove Arrow"
      }
    )
  ] })), /* @__PURE__ */ o.jsx(A, { partialVisibility: !0, onChange: f, children: /* @__PURE__ */ o.jsxs(o.Fragment, { children: [
    $,
    x
  ] }) });
}), I = j.memo(function({
  rowNumber: e,
  updateRowText: u,
  selectedRow: i,
  setSelectedRow: d,
  orbitalText: r,
  boxes: l,
  selectedBox: p,
  setSelectedBox: g,
  deselect: c,
  name: f
}) {
  let h = {
    width: "800px",
    height: "44px",
    display: "flex",
    backgroundColor: "#E2E2E2",
    marginTop: "2px",
    marginBottom: "2px",
    padding: "2px",
    border: "white solid 2px"
  };
  i === e && (h.border = "#1A5A99 solid 2px");
  let w = [];
  for (let [n, s] of Object.entries(l)) {
    let x = !1;
    i == e && p == n && (x = !0), w.push(
      /* @__PURE__ */ o.jsx(
        J,
        {
          boxNum: n,
          rowNumber: e,
          arrows: s,
          isSelected: x,
          setSelectedBox: g,
          name: f
        },
        `OrbitalBox${e}-${n}`
      )
    );
  }
  return /* @__PURE__ */ o.jsxs(
    "div",
    {
      id: `OrbitalRow${e}${f}`,
      tabIndex: "-1",
      onClick: () => {
        i !== e && d(e);
      },
      onBlur: (n) => {
        c(n);
      },
      style: h,
      children: [
        /* @__PURE__ */ o.jsx(
          E,
          {
            orbitalText: r,
            rowNumber: e,
            updateRowText: u,
            name: f
          }
        ),
        w
      ]
    },
    `OrbitalRow${e}`
  );
}), E = j.memo(function({
  rowNumber: e,
  updateRowText: u,
  orbitalText: i,
  name: d
}) {
  return /* @__PURE__ */ o.jsx(
    "input",
    {
      id: `OrbitalText${e}${d}`,
      style: { marginRight: "4px", height: "14px" },
      type: "text",
      size: "4",
      value: i,
      onChange: (r) => {
        let l = r.target.value;
        u(l);
      }
    }
  );
}), J = j.memo(function({
  boxNum: e,
  arrows: u = "",
  setSelectedBox: i,
  isSelected: d,
  rowNumber: r,
  name: l
}) {
  const p = /* @__PURE__ */ o.jsx(
    "polyline",
    {
      id: `firstUp${e}`,
      points: "6,14 12,6 18,14 12,6 12,35",
      style: { fill: "none", stroke: "black", strokeWidth: "2" }
    },
    `orbitalboxfirstUp${e}`
  ), g = /* @__PURE__ */ o.jsx(
    "polyline",
    {
      id: `firstDown${e}`,
      points: "6,26 12,34 18,26 12,34 12,5",
      style: { fill: "none", stroke: "black", strokeWidth: "2" }
    },
    `orbitalboxfirstDown${e}`
  ), c = /* @__PURE__ */ o.jsx(
    "polyline",
    {
      id: `secondUp${e}`,
      points: "22,14 28,6 34,14 28,6 28,35",
      style: { fill: "none", stroke: "black", strokeWidth: "2" }
    },
    `orbitalboxsecondUp${e}`
  ), f = /* @__PURE__ */ o.jsx(
    "polyline",
    {
      id: `secondDown${e}`,
      points: "22,26 28,34 34,26 28,34 28,5",
      style: { fill: "none", stroke: "black", strokeWidth: "2" }
    },
    `orbitalboxsecondDown${e}`
  ), h = /* @__PURE__ */ o.jsx(
    "polyline",
    {
      id: `thirdUp${e}`,
      points: "38,14 44,6 50,14 44,6 44,35",
      style: { fill: "none", stroke: "black", strokeWidth: "2" }
    },
    `orbitalboxthirdUp${e}`
  ), w = /* @__PURE__ */ o.jsx(
    "polyline",
    {
      id: `thirdDown${e}`,
      points: "38,26 44,34 50,26 44,34 44,5",
      style: { fill: "none", stroke: "black", strokeWidth: "2" }
    },
    `orbitalboxthirdDown${e}`
  );
  let n = [], [s, x, $] = u.split("");
  s == "U" && n.push(p), s == "D" && n.push(g), x == "U" && n.push(c), x == "D" && n.push(f), $ == "U" && n.push(h), $ == "D" && n.push(w);
  let t = 40;
  $ && (t = 56);
  let a = "black", b = "2px";
  return d && (a = "#1A5A99", b = "6px"), /* @__PURE__ */ o.jsxs(
    W,
    {
      id: `orbitalbox${l}${r}-${e}`,
      tabIndex: "-1",
      onClick: (y) => {
        i(e, r), y.stopPropagation();
      },
      width: t,
      height: "40",
      children: [
        /* @__PURE__ */ o.jsx(
          "rect",
          {
            x: "0",
            y: "0",
            rx: "4",
            ry: "4",
            width: t,
            height: "40",
            style: {
              fill: "white",
              stroke: a,
              strokeWidth: b,
              fillOpacity: "1",
              strokeOpacity: "1"
            }
          }
        ),
        n
      ]
    },
    `orbitalbox${e}`
  );
});
export {
  F as default
};
