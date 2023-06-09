import W, { useContext as q, useRef as F, useEffect as H } from "react";
import { u as I, C as m } from "./index-dce15b2c.js";
import { BoardContext as K, BASE_LAYER_OFFSET as R } from "./graph-b13204d4.js";
const le = W.memo(function U(D) {
  var A;
  let { name: Q, id: Z, SVs: u, actions: $, sourceOfUpdate: ee, callAction: te } = I(D);
  U.ignoreActionsWithoutCore = () => !0;
  const l = q(K);
  let d = F(null), j = F(null), x = F(null), p = F(null), h = F(null), y = F(null);
  x.current = u.dx, p.current = u.dy, h.current = u.xoffset, y.current = u.yoffset;
  let N = F({
    visible: !u.hidden,
    fixed: !0,
    withlabel: !1,
    layer: 10 * u.layer + R,
    fillColor: "darkgray",
    strokeColor: "darkgray",
    size: 0.1,
    face: "circle",
    highlight: !1,
    showinfobox: !1
  });
  N.current.visible = !u.hidden, N.current.layer = 10 * u.layer + R, H(() => () => {
    P();
  }, []);
  function O() {
    let [o, b, g, v] = l.getBoundingBox(), M = (o - h.current) / x.current, C = (g - h.current) / x.current, w = (v - y.current) / p.current, B = (b - y.current) / p.current, f = m.math.round(Math.min(M, C) + 1), s = m.math.round(Math.max(M, C) - 1), i = m.math.round(Math.min(w, B) + 1), a = m.math.round(Math.max(w, B) - 1);
    if (j.current = [f, s, i, a], Number.isFinite(f) && Number.isFinite(s) && Number.isFinite(i) && Number.isFinite(a)) {
      let t = [];
      for (let r = i; r <= a; r++) {
        let c = r * u.dy + u.yoffset, e = [];
        for (let n = f; n <= s; n++)
          e.push(
            l.create(
              "point",
              [n * u.dx + u.xoffset, c],
              N.current
            )
          );
        t.push(e);
      }
      d.current = t;
    }
    l.on("boundingbox", () => {
      let [t, r, c, e] = l.getBoundingBox(), n = (t - h.current) / x.current, Y = (c - h.current) / x.current, _ = (e - y.current) / p.current, E = (r - y.current) / p.current, S = m.math.round(Math.min(n, Y) + 1), G = m.math.round(Math.max(n, Y) - 1), J = m.math.round(Math.min(_, E) + 1), k = m.math.round(Math.max(_, E) - 1), [z, L, T, V] = j.current;
      (S !== z || G !== L || J !== T || k !== V) && X(S, G, J, k);
    });
  }
  function P() {
    if (d.current !== null)
      for (let o of d.current)
        for (let b of o)
          l.removeObject(b);
    d.current = null;
  }
  function X(o, b, g, v) {
    if (d.current === null)
      return O();
    if (!Number.isFinite(o) || !Number.isFinite(b) || !Number.isFinite(g) || !Number.isFinite(v))
      return P();
    let [M, C, w, B] = j.current, f = v - g + 1, s = B - w + 1, i = b - o + 1, a = C - M + 1;
    for (let t = 0; t < Math.min(f, s); t++) {
      let r = d.current[t], c = (t + g) * p.current + y.current;
      for (let e = 0; e < Math.min(i, a); e++) {
        let n = (e + o) * x.current + h.current;
        r[e].coords.setCoordinates(JXG.COORDS_BY_USER, [n, c]), r[e].needsUpdate = !0, r[e].update();
      }
      if (a > i)
        for (let e = i; e < a; e++) {
          let n = r.pop();
          l.removeObject(n);
        }
      else if (a < i)
        for (let e = a; e < i; e++) {
          let n = (e + o) * x.current + h.current;
          r.push(l.create("point", [n, c], N.current));
        }
    }
    if (s > f)
      for (let t = f; t < s; t++) {
        let r = d.current.pop();
        for (let c = 0; c < a; c++) {
          let e = r.pop();
          l.removeObject(e);
        }
      }
    else if (s < f)
      for (let t = s; t < f; t++) {
        let r = [], c = (t + g) * p.current + y.current;
        for (let e = 0; e < i; e++) {
          let n = (e + o) * x.current + h.current;
          r.push(l.create("point", [n, c], N.current));
        }
        d.current.push(r);
      }
    j.current = [o, b, g, v], l.updateRenderer();
  }
  if (l)
    if (d.current === null)
      O();
    else {
      let [o, b, g, v] = l.getBoundingBox(), M = (o - h.current) / x.current, C = (g - h.current) / x.current, w = (v - y.current) / p.current, B = (b - y.current) / p.current, f = m.math.round(Math.min(M, C) + 1), s = m.math.round(Math.max(M, C) - 1), i = m.math.round(Math.min(w, B) + 1), a = m.math.round(Math.max(w, B) - 1);
      X(f, s, i, a);
      let t = (A = d.current[0]) == null ? void 0 : A[0];
      if (t) {
        let r = 10 * u.layer + R;
        if (t.visProp.layer !== r)
          for (let e of d.current)
            for (let n of e)
              n.setAttribute({ layer: r });
      }
    }
  return null;
});
export {
  le as default
};
