function a(e) {
  let t = !1, r = !1, [f, g, d, u] = e.getBoundingBox();
  return d < f && (t = !0, [d, f] = [f, d]), g < u && (r = !0, [g, u] = [u, g]), { flippedX: t, flippedY: r, xmin: f, xmax: d, ymin: u, ymax: g };
}
function X(e, t, r = 0.01) {
  let { flippedX: f, flippedY: g, xmin: d, xmax: u, ymin: x, ymax: i } = a(e), h = f ? -1 : 1, y = g ? -1 : 1, l = u - d, s = i - x, c = d + l * r, n = u - l * r, m = x + s * r, p = i - s * r, j = t[0] * h === 1 ? n : c, A = t[1] * y === 1 ? p : m;
  return [j, A];
}
function Y(e, t) {
  return t[0] === -1 ? e.substring(
    e.length - 4,
    e.length
  ) === "left" ? e = e.substring(0, e.length - 4) + "right" : e === "top" ? e = "upperright" : e === "bottom" && (e = "lowerright") : t[0] === 1 && (e.substring(
    e.length - 5,
    e.length
  ) === "right" ? e = e.substring(0, e.length - 5) + "left" : e === "top" ? e = "upperleft" : e === "bottom" && (e = "lowerleft")), t[1] === -1 ? e.substring(0, 5, e.length) === "lower" ? e = "upper" + e.substring(5, e.length) : e === "left" ? e = "upperleft" : e === "right" && (e = "upperright") : t[1] === 1 && (e.substring(0, 5, e.length) === "upper" ? e = "lower" + e.substring(5, e.length) : e === "left" ? e = "lowerleft" : e === "right" && (e = "lowerright")), e;
}
function q(e) {
  let t, r, f;
  return e === "upperright" ? (f = [5, 5], t = "left", r = "bottom") : e === "upperleft" ? (f = [-5, 5], t = "right", r = "bottom") : e === "lowerright" ? (f = [5, -5], t = "left", r = "top") : e === "lowerleft" ? (f = [-5, -5], t = "right", r = "top") : e === "top" ? (f = [0, 10], t = "middle", r = "bottom") : e === "bottom" ? (f = [0, -10], t = "middle", r = "top") : e === "left" ? (f = [-10, 0], t = "right", r = "middle") : (f = [10, 0], t = "left", r = "middle"), { offset: f, anchorx: t, anchory: r };
}
function C(e, t) {
  return t === "diamond" ? e * 1.4 : t === "plus" ? e * 1.2 : t === "square" ? e * 1.1 : t.substring(0, 8) === "triangle" ? e * 1.5 : e;
}
function L(e, t) {
  return t[1] === -1 ? "triangledown" : t[1] === 1 ? "triangleup" : t[0] === -1 ? "triangleleft" : t[0] === 1 ? "triangleright" : e === "triangle" ? "triangleup" : e;
}
function v(e, t) {
  let { flippedX: r, flippedY: f, xmin: g, xmax: d, ymin: u, ymax: x } = a(t), i = d - g, h = x - u, y = g + i * 0.01, l = d - i * 0.01, s = u + h * 0.01, c = x - h * 0.01, n = [...e], m = [0, 0], p = !1;
  return n[0] < y ? (p = !0, m[0] = r ? 1 : -1, n[0] = y) : n[0] > l && (p = !0, m[0] = r ? -1 : 1, n[0] = l), n[1] < s ? (p = !0, m[1] = f ? 1 : -1, n[1] = s) : n[1] > c && (p = !0, m[1] = f ? -1 : 1, n[1] = c), {
    needIndicator: p,
    indicatorCoords: n,
    indicatorSides: m
  };
}
function z({
  center: e,
  radius: t,
  directionToCheck: r,
  board: f
}) {
  let { flippedX: g, flippedY: d, xmin: u, xmax: x, ymin: i, ymax: h } = a(f), y = g ? -1 : 1, l = d ? -1 : 1, s = x - u, c = h - i, n = u + s * 0.01, m = x - s * 0.01, p = i + c * 0.01, j = h - c * 0.01, A = r[0] * y === 1 ? m : n, w = r[1] * l === 1 ? j : p, B = e[1] - l * r[1] * Math.sqrt(t ** 2 - (A - e[0]) ** 2), S = r[1] * l;
  return B * S > w * S ? {
    needIndicator: !0,
    indicatorSides: r,
    indicatorCoords: [A, w]
  } : { needIndicator: !1 };
}
export {
  X as a,
  z as b,
  v as c,
  C as d,
  Y as e,
  q as f,
  a as g,
  L as n
};
