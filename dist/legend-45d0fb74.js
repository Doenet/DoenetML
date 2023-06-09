import { u as L, q as J, j as g } from "./index-7c50cb13.js";
import Y, { useContext as j, useRef as S, useEffect as G } from "react";
import { BoardContext as w } from "./graph-5fa84fc4.js";
const N = Y.memo(function(k) {
  let { name: W, id: _, SVs: n } = L(k);
  const a = j(w);
  let c = S([]), d = S([]), E = S(null), b = S(null), U = S(null);
  G(() => () => {
    v();
  }, []);
  function B() {
    let { xmin: f, xmax: m, ymin: x, ymax: y } = n.graphLimits, o = (y - x) * 0.06, i = (m - f) * 0.05, C = (m - f) * 0.02, t = f + (m - f) * 0.05, O;
    n.position.slice(0, 5) === "upper" ? O = x + (y - x) * 0.95 : O = x + (y - x) * 0.05 + o * n.legendElements.length;
    let R = n.position.slice(n.position.length - 5, n.position.length) === "right";
    c.current = [], d.current = [];
    let u = 0, D = !1;
    for (let [s, e] of n.legendElements.entries())
      if (e.label) {
        let r = O - s * o, l = {
          fixed: !0,
          highlight: !1
        };
        e.label.hasLatex && (l.useMathJax = !0, l.parse = !1, D = !0);
        let p = a.create(
          "text",
          [t + i + C, r, e.label.value],
          l
        );
        d.current.push(p), u = Math.max(u, p.rendNode.offsetWidth);
      }
    u /= a.unitX, R && (t = Math.max(
      t,
      m - i - 3 * C - u
    ));
    for (let [s, e] of n.legendElements.entries()) {
      let r = O - s * o;
      if (e.swatchType === "marker") {
        let l = {
          fillColor: e.markerColor,
          fillOpacity: e.lineOpacity,
          strokeColor: "none",
          size: e.markerSize,
          face: M(e.markerStyle),
          fixed: !0,
          highlight: !1,
          withLabel: !1,
          showInfoBox: !1
        }, p = a.create(
          "point",
          [t + i / 2, r],
          l
        );
        c.current.push(p);
      } else if (e.swatchType === "rectangle") {
        let l = {
          fillColor: e.filled ? e.fillColor : "none",
          fillOpacity: e.fillOpacity,
          fixed: !0,
          highlight: !1,
          vertices: { visible: !1 },
          borders: {
            strokeColor: e.lineColor,
            strokeWidth: e.lineWidth,
            strokeOpacity: e.lineOpacity,
            dash: X(e.lineStyle),
            fixed: !0,
            highlight: !1
          }
        }, p = a.create(
          "polygon",
          [
            [t, r + o / 4],
            [t + i, r + o / 4],
            [t + i, r - o / 4],
            [t, r - o / 4]
          ],
          l
        );
        c.current.push(p);
      } else {
        let l = {
          strokeColor: e.lineColor,
          strokeWidth: e.lineWidth,
          strokeOpacity: e.lineOpacity,
          dash: X(e.lineStyle),
          fixed: !0,
          highlight: !1
        }, p = a.create(
          "segment",
          [
            [t, r],
            [t + i, r]
          ],
          l
        );
        c.current.push(p);
      }
      R && e.label && d.current[s].coords.setCoordinates(JXG.COORDS_BY_USER, [
        t + i + C,
        r
      ]);
    }
    R && D && MathJax.Hub.Queue(() => {
      u = 0;
      for (let s of d.current)
        u = Math.max(u, s.rendNode.offsetWidth);
      u /= a.unitX, t = Math.max(
        t,
        m - i - 3 * C - u
      );
      for (let [s, e] of c.current.entries()) {
        let r = O - s * o;
        if (e.elType === "point")
          e.coords.setCoordinates(JXG.COORDS_BY_USER, [
            t + i / 2,
            r
          ]), e.needsUpdate = !0, e.update();
        else if (e.elType === "polygon") {
          e.vertices[0].coords.setCoordinates(JXG.COORDS_BY_USER, [
            t,
            r + o / 4
          ]), e.vertices[1].coords.setCoordinates(JXG.COORDS_BY_USER, [
            t + i,
            r + o / 4
          ]), e.vertices[2].coords.setCoordinates(JXG.COORDS_BY_USER, [
            t + i,
            r - o / 4
          ]), e.vertices[3].coords.setCoordinates(JXG.COORDS_BY_USER, [
            t,
            r - o / 4
          ]);
          for (let l = 0; l < 4; l++)
            e.vertices[l].needsUpdate = !0, e.vertices[l].update(), e.borders[l].needsUpdate = !0, e.borders[l].update();
          e.needsUpdate = !0, e.update();
        } else
          e.point1.coords.setCoordinates(JXG.COORDS_BY_USER, [
            t,
            r
          ]), e.point2.coords.setCoordinates(JXG.COORDS_BY_USER, [
            t + i,
            r
          ]), e.needsUpdate = !0, e.update();
        d.current[s] && (d.current[s].coords.setCoordinates(JXG.COORDS_BY_USER, [
          t + i + C,
          r
        ]), d.current[s].needsUpdate = !0, d.current[s].update());
      }
      a.updateRenderer();
    });
  }
  function v() {
    for (let f of c.current)
      a.removeObject(f);
    for (let f of d.current)
      a.removeObject(f);
    c.current = [], d.current = [];
  }
  return a ? ((!J(E.current, n.legendElements) || !J(U.current, n.graphLimits) || b.current !== n.position) && (c.current.length > 0 && v(), B()), E.current = [...n.legendElements], U.current = Object.assign({}, n.graphLimits), b.current = n.position, /* @__PURE__ */ g.jsx(g.Fragment, { children: /* @__PURE__ */ g.jsx("a", { name: _ }) })) : n.hidden ? null : /* @__PURE__ */ g.jsx(g.Fragment, { children: /* @__PURE__ */ g.jsx("a", { name: _ }) });
});
function X(h) {
  return h === "dashed" ? 2 : h === "solid" ? 0 : h === "dotted" ? 1 : 0;
}
function M(h) {
  return h === "triangle" ? "triangleup" : h;
}
export {
  N as default
};
