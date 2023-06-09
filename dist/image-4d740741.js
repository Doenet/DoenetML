import { n as se, o as Z, u as le, C as K, j as R, V as ue } from "./index-7c50cb13.js";
import fe, { useState as de, useRef as l, useContext as me, useEffect as X } from "react";
import { BoardContext as pe, IMAGE_LAYER_OFFSET as Q } from "./graph-5fa84fc4.js";
import { s as he } from "./css-ab4d83ca.js";
async function ge(o, g) {
  try {
    return await ve(o);
  } catch {
  }
  if (!g) {
    let { data: p } = await se.get("/api/getMimeType.php", {
      params: { cid: o }
    });
    g = p["mime-type"];
  }
  return be(o, g);
}
async function ve(o) {
  let g = new AbortController(), p = g.signal, b = setTimeout(() => {
    g.abort();
  }, 1e3);
  try {
    let e = await fetch(`https://${o}.ipfs.dweb.link/`, { signal: p });
    if (clearTimeout(b), e.ok) {
      let u = await e.blob();
      if (await Z(
        await u.arrayBuffer()
      ) === o) {
        let S = URL.createObjectURL(u);
        return { mediaBlob: u, mediaURL: S };
      } else
        return Promise.reject(new Error("cid mismatch"));
    } else
      return Promise.reject(new Error(`cid not found: ${o}`));
  } catch {
    return Promise.reject(new Error(`cid not found: ${o}`));
  }
}
async function be(o, g) {
  try {
    let p = ye(g), b = await fetch(`/media/${o}.${p}`);
    if (b.ok) {
      let e = await b.blob();
      if (await Z(
        await e.arrayBuffer()
      ) === o) {
        let m = URL.createObjectURL(e);
        return { mediaBlob: e, mediaURL: m };
      } else
        return Promise.reject(new Error("cid mismatch"));
    } else
      return Promise.reject(new Error(`cid not found: ${o}`));
  } catch {
    return Promise.reject(new Error(`cid not found: ${o}`));
  }
}
function ye(o) {
  return o === "image/png" ? "png" : o === "image/jpeg" ? "jpg" : o === "text/csv" ? "csv" : "txt";
}
const we = fe.memo(function o(g) {
  var $;
  let { name: p, id: b, SVs: e, actions: u, callAction: m } = le(g, !1), [S, ee] = de(null);
  o.ignoreActionsWithoutCore = () => !0;
  let t = l(null), P = l(null);
  const a = me(pe);
  let A = l(null), M = l(null), B = l(!1), G = l(!1), y = l(!1), x = l(null), C = l(null), V = l(null), I = l(null), w = l(null), v = l(null), z = l(null), k = l(e.rotate), _ = l(!1), j = l(!1);
  _.current = e.fixed, j.current = !e.draggable || e.fixLocation || e.fixed;
  const O = (e.cid ? S : e.source) || "";
  let re = (i) => {
    m({
      action: u.recordVisibilityChange,
      args: { isVisible: i }
    });
  };
  X(() => () => {
    m({
      action: u.recordVisibilityChange,
      args: { isVisible: !1 }
    });
  }, []), X(() => {
    e.cid && ge(e.cid, e.mimeType).then((i) => {
      ee(i.mediaURL);
    }).catch((i) => {
    });
  }, []), X(() => () => {
    t.current !== null && ne(), a && a.off("move", T);
  }, []), X(() => {
    a && a.on("move", T);
  }, [a]);
  function te() {
    var H;
    let i = {
      visible: !e.hidden,
      fixed: _.current,
      layer: 10 * e.layer + Q,
      highlight: !j.current
    }, c;
    try {
      let s = K.fromAst(e.anchor), F = [
        s.get_component(0).evaluate_to_constant(),
        s.get_component(1).evaluate_to_constant()
      ];
      Number.isFinite(F[0]) || (F[0] = 0, i.visible = !1), Number.isFinite(F[1]) || (F[1] = 0, i.visible = !1), c = a.create("point", F, {
        visible: !1
      });
    } catch {
      i.visible = !1, c = a.create("point", [0, 0], { visible: !1 });
    }
    i.anchor = c;
    let d = ((H = e.widthForGraph) == null ? void 0 : H.size) || 1, h = d / (e.aspectRatio || 1);
    Number.isFinite(d) && Number.isFinite(h) || (d = 0, h = 0);
    let n;
    e.positionFromAnchor === "center" ? n = [-d / 2, -h / 2] : e.positionFromAnchor === "lowerleft" ? n = [-d, -h] : e.positionFromAnchor === "lowerright" ? n = [0, -h] : e.positionFromAnchor === "upperleft" ? n = [-d, 0] : e.positionFromAnchor === "upperright" ? n = [0, 0] : e.positionFromAnchor === "bottom" ? n = [-d / 2, -h] : e.positionFromAnchor === "top" ? n = [-d / 2, 0] : e.positionFromAnchor === "right" ? n = [0, -h / 2] : n = [-d, -h / 2], v.current = n;
    let r = a.create(
      "image",
      [O, n, [d, h]],
      i
    );
    r.isDraggable = !j.current;
    var U = a.create(
      "transform",
      [
        function() {
          return -r.X() - r.W() * 0.5;
        },
        function() {
          return -r.Y() - r.H() * 0.5;
        }
      ],
      { type: "translate" }
    ), f = a.create(
      "transform",
      [
        function() {
          return r.X() + r.W() * 0.5;
        },
        function() {
          return r.Y() + r.H() * 0.5;
        }
      ],
      { type: "translate" }
    ), W = a.create("transform", [e.rotate], { type: "rotate" });
    U.bindTo(r), W.bindTo(r), f.bindTo(r), z.current = W, k.current = e.rotate, r.on("down", function(s) {
      A.current = [s.x, s.y], M.current = [...c.coords.scrCoords], y.current = !1, B.current = !0, G.current = !1, _.current || m({
        action: u.imageFocused,
        args: { name: p }
        // send name so get original name if adapted
      });
    }), r.on("hit", function(s) {
      M.current = [...c.coords.scrCoords], y.current = !1, m({
        action: u.imageFocused,
        args: { name: p }
        // send name so get original name if adapted
      });
    }), r.on("up", function(s) {
      y.current ? (m({
        action: u.moveImage,
        args: {
          x: x.current,
          y: C.current
        }
      }), y.current = !1) : !G.current && !_.current && m({
        action: u.imageClicked,
        args: { name: p }
        // send name so get original name if adapted
      }), B.current = !1;
    }), r.on("keyfocusout", function(s) {
      y.current && (m({
        action: u.moveImage,
        args: {
          x: x.current,
          y: C.current
        }
      }), y.current = !1);
    }), r.on("drag", function(s) {
      let F = s.type === "pointermove";
      (!F || Math.abs(s.x - A.current[0]) > 0.1 || Math.abs(s.y - A.current[1]) > 0.1) && (y.current = !0);
      let [N, J, Y, L] = a.getBoundingBox(), ie = N + 0.01 * (Y - N) - v.current[0] - w.current[0], oe = Y - 0.01 * (Y - N) - v.current[0], ae = L + 0.01 * (J - L) - v.current[1] - w.current[1], ce = J - 0.01 * (J - L) - v.current[1];
      if (F) {
        var q = a.origin.scrCoords;
        x.current = (M.current[1] + s.x - A.current[0] - q[1]) / a.unitX, C.current = (q[2] - (M.current[2] + s.y - A.current[1])) / a.unitY;
      } else
        x.current = c.X() + r.relativeCoords.usrCoords[1] - v.current[0], C.current = c.Y() + r.relativeCoords.usrCoords[2] - v.current[1];
      x.current = Math.min(
        oe,
        Math.max(ie, x.current)
      ), C.current = Math.min(
        ce,
        Math.max(ae, C.current)
      ), m({
        action: u.moveImage,
        args: {
          x: x.current,
          y: C.current,
          transient: !0,
          skippable: !0
        }
      }), r.relativeCoords.setCoordinates(
        JXG.COORDS_BY_USER,
        v.current
      ), c.coords.setCoordinates(
        JXG.COORDS_BY_USER,
        V.current
      );
    }), r.on("keydown", function(s) {
      s.key === "Enter" && (y.current && (m({
        action: u.moveImage,
        args: {
          x: x.current,
          y: C.current
        }
      }), y.current = !1), m({
        action: u.imageClicked,
        args: { name: p }
        // send name so get original name if adapted
      }));
    }), t.current = r, P.current = c, I.current = e.positionFromAnchor, w.current = [d, h], t.current.fullUpdate();
  }
  function T(i) {
    B.current && (Math.abs(i.x - A.current[0]) > 0.1 || Math.abs(i.y - A.current[1]) > 0.1) && (G.current = !0);
  }
  function ne() {
    t.current.off("drag"), t.current.off("down"), t.current.off("hit"), t.current.off("up"), t.current.off("keyfocusout"), t.current.off("keydown"), a.removeObject(t.current), t.current = null;
  }
  if (a) {
    let i;
    try {
      let c = K.fromAst(e.anchor);
      i = [
        c.get_component(0).evaluate_to_constant(),
        c.get_component(1).evaluate_to_constant()
      ];
    } catch {
      i = [NaN, NaN];
    }
    if (V.current = i, t.current === null) {
      if (e.cid && !S)
        return null;
      te();
    } else {
      P.current.coords.setCoordinates(
        JXG.COORDS_BY_USER,
        i
      );
      let c = !e.hidden;
      if (Number.isFinite(i[0]) && Number.isFinite(i[1])) {
        let f = t.current.visProp.visible !== c;
        t.current.visProp.visible = c, t.current.visPropCalc.visible = c, f && t.current.setAttribute({ visible: c });
      } else
        t.current.visProp.visible = !1, t.current.visPropCalc.visible = !1;
      let d = 10 * e.layer + Q;
      t.current.visProp.layer !== d && t.current.setAttribute({ layer: d }), t.current.visProp.highlight = !j.current, t.current.visProp.fixed = _.current, t.current.isDraggable = !j.current, t.current.needsUpdate = !0;
      let n = (($ = e.widthForGraph) == null ? void 0 : $.size) || 1, r = n / (e.aspectRatio || 1);
      Number.isFinite(n) && Number.isFinite(r) || (n = 0, r = 0);
      let U = n !== w.current[0] || r !== w.current[1];
      if (U && (t.current.setSize(n, r), w.current = [n, r]), e.rotate != k.current && (z.current.setMatrix(a, "rotate", [e.rotate]), k.current = e.rotate), e.positionFromAnchor !== I.current || U) {
        let f;
        e.positionFromAnchor === "center" ? f = [-n / 2, -r / 2] : e.positionFromAnchor === "lowerleft" ? f = [-n, -r] : e.positionFromAnchor === "lowerright" ? f = [0, -r] : e.positionFromAnchor === "upperleft" ? f = [-n, 0] : e.positionFromAnchor === "upperright" ? f = [0, 0] : e.positionFromAnchor === "bottom" ? f = [-n / 2, -r] : e.positionFromAnchor === "top" ? f = [-n / 2, 0] : e.positionFromAnchor === "right" ? f = [0, -r / 2] : f = [-n, -r / 2], t.current.relativeCoords.setCoordinates(
          JXG.COORDS_BY_USER,
          f
        ), I.current = e.positionFromAnchor, v.current = f, t.current.fullUpdate();
      } else
        t.current.relativeCoords.setCoordinates(
          JXG.COORDS_BY_USER,
          v.current
        ), t.current.update();
      P.current.needsUpdate = !0, P.current.update(), a.updateRenderer();
    }
    return /* @__PURE__ */ R.jsx("a", { name: b });
  }
  if (e.hidden)
    return null;
  let D = {};
  e.displayMode === "inline" ? D = {
    display: "inline-block",
    verticalAlign: "middle",
    margin: "12px 0"
  } : D = {
    display: "flex",
    justifyContent: e.horizontalAlign,
    margin: "12px 0"
  };
  let E = {
    maxWidth: "100%",
    width: he(e.width)
  };
  return e.aspectRatio > 0 && (E.aspectRatio = String(e.aspectRatio)), O || (E.border = "var(--mainBorder)"), /* @__PURE__ */ R.jsx(ue, { partialVisibility: !0, onChange: re, children: /* @__PURE__ */ R.jsxs("div", { style: D, children: [
    /* @__PURE__ */ R.jsx("a", { name: b }),
    O ? /* @__PURE__ */ R.jsx(
      "img",
      {
        id: b,
        src: O,
        style: E,
        alt: e.description
      }
    ) : /* @__PURE__ */ R.jsx("div", { id: b, style: E, children: e.description })
  ] }) });
});
export {
  we as default
};
