import { u as W, j as g, V as L } from "./index-8862516e.js";
import M, { useRef as o, useEffect as v } from "react";
import { s as _ } from "./css-ab4d83ca.js";
import z from "styled-components";
import "react-dom";
const F = z.div`
  &: focus {
    outline: 2px solid var(--canvastext);
    outline-offset: 2px;
  }
`, Q = M.memo(function(I) {
  var x;
  let { name: $, id: T, SVs: n, actions: a, callAction: l } = W(I), r = o(null), p = o(null), c = o(null), i = o([]), s = o(null), C = o(null), P = o(0), d = o(null), w = o(null), y = o(null), A = (e) => {
    l({
      action: a.recordVisibilityChange,
      args: { isVisible: e }
    });
  };
  v(() => () => {
    l({
      action: a.recordVisibilityChange,
      args: { isVisible: !1 }
    });
  }, []), v(() => {
    if (n.youtube) {
      let e = T;
      window.YT && (r.current = new window.YT.Player(e, {
        playerVars: {
          autoplay: 0,
          controls: 1,
          modestbranding: 1,
          rel: 0
        },
        events: {
          onReady: j,
          onStateChange: U,
          onPlaybackRateChange: G
        }
      }));
    }
  }, [window.YT]);
  function N() {
    let e = r.current.getCurrentTime(), t;
    p.current ? t = e - p.current : t = e - c.current, !(c.current >= 0) || t > 0 && t < 1 ? (c.current = e, p.current = null) : t !== 0 && (p.current = e);
    let m = Math.floor(e);
    m !== y.current && (y.current = m, l({
      action: a.setTime,
      args: {
        time: m
      }
    }));
  }
  function j(e) {
    l({
      action: a.recordVideoReady,
      args: {
        duration: r.current.getDuration()
      }
    });
  }
  function U(e) {
    let t = r.current.getDuration();
    switch (e.data) {
      case window.YT.PlayerState.PLAYING:
        if (s.current !== e.data) {
          let u = r.current.getCurrentTime();
          if (clearInterval(w.current), w.current = window.setInterval(N, 200), s.current === window.YT.PlayerState.PAUSED) {
            let R = u - P.current;
            (R < 0 || R > 0.5) && l({
              action: a.recordVideoSkipped,
              args: {
                beginTime: P.current,
                endTime: u,
                duration: t
              }
            });
          }
          let E = r.current.getPlaybackRate();
          i.current = [
            {
              startingPoint: u,
              rate: E
            }
          ], d.current = u, c.current = u, p.current = null, l({
            action: a.recordVideoStarted,
            args: {
              beginTime: r.current.getCurrentTime(),
              duration: t,
              rate: E
            }
          }), s.current = e.data;
        }
        break;
      case window.YT.PlayerState.PAUSED:
        let m = s.current, D = d.current, f = r.current.getCurrentTime();
        C.current = setTimeout(function() {
          clearInterval(w.current), m === window.YT.PlayerState.PLAYING && f > D && (i.current[i.current.length - 1].endingPoint = f, l({
            action: a.recordVideoWatched,
            args: {
              beginTime: D,
              endTime: f,
              duration: t,
              rates: i.current
            }
          }), d.current = null), l({
            action: a.recordVideoPaused,
            args: {
              endTime: f,
              duration: t
            }
          }), P.current = f, s.current = e.data;
        }, 250);
        break;
      case window.YT.PlayerState.BUFFERING:
        clearTimeout(C.current);
        let k = r.current.getCurrentTime();
        if (d.current !== null) {
          let u = d.current;
          c.current > u && (i.current[i.current.length - 1].endingPoint = c.current, l({
            action: a.recordVideoWatched,
            args: {
              beginTime: u,
              endTime: c.current,
              duration: t,
              rates: i.current
            }
          }), u = c.current), l({
            action: a.recordVideoSkipped,
            args: {
              beginTime: u,
              endTime: k,
              duration: t
            }
          }), s.current = e.data, d.current = null, c.current = k, p.current = null;
        }
        break;
      case window.YT.PlayerState.ENDED:
        clearInterval(w.current);
        let h = d.current, V = r.current.getCurrentTime();
        i.current.length > 0 && h !== null && V > h && (i.current[i.current.length - 1].endingPoint = V, l({
          action: a.recordVideoWatched,
          args: {
            beginTime: h,
            endTime: V,
            duration: t,
            rates: i.current
          }
        }), d.current = null), l({
          action: a.recordVideoCompleted,
          args: {
            duration: t
          }
        }), s.current = e.data;
        break;
      case window.YT.PlayerState.UNSTARTED:
        s.current = e.data;
        break;
    }
  }
  function G(e) {
    let t = r.current.getCurrentTime();
    i.current[i.current.length - 1].endingPoint = t, i.current.push({
      startingPoint: t,
      rate: e.data
    });
  }
  if ((x = r.current) != null && x.getPlayerState) {
    let e = r.current.getPlayerState();
    if (n.state === "playing" ? (e === window.YT.PlayerState.UNSTARTED || e === window.YT.PlayerState.PAUSED || e === window.YT.PlayerState.CUED || e === window.YT.PlayerState.ENDED) && r.current.playVideo() : n.state === "stopped" && e === window.YT.PlayerState.PLAYING && r.current.pauseVideo(), n.time !== Number(y.current)) {
      let t = n.time, m = r.current.getDuration();
      t > m && (t = Math.floor(m), l({
        action: a.setTime,
        args: {
          time: t
        }
      })), t !== Number(y.current) && (r.current.getPlayerState() === window.YT.PlayerState.CUED ? (r.current.pauseVideo(), r.current.seekTo(t, !0), setTimeout(() => r.current.pauseVideo(), 200)) : r.current.seekTo(t, !0), y.current = t);
    }
  }
  if (n.hidden)
    return null;
  let b = {};
  n.displayMode === "inline" ? b = {
    display: "inline-block",
    verticalAlign: "middle",
    margin: "12px 0"
  } : b = {
    display: "flex",
    justifyContent: n.horizontalAlign,
    margin: "12px 0"
  };
  let Y = {
    maxWidth: "100%",
    width: _(n.width),
    aspectRatio: String(n.aspectRatio)
  }, S;
  return n.youtube ? S = /* @__PURE__ */ g.jsx(
    "iframe",
    {
      id: T,
      style: Y,
      src: "https://www.youtube.com/embed/" + n.youtube + "?enablejsapi=1&rel=0&modestbranding=1",
      allow: "autoplay; fullscreen"
    }
  ) : n.source ? S = /* @__PURE__ */ g.jsxs("video", { className: "video", id: T, controls: !0, style: Y, children: [
    /* @__PURE__ */ g.jsx(
      "source",
      {
        src: n.source,
        type: `video/${n.source.split("/").pop().split(".").pop()}`
      }
    ),
    "Your browser does not support the <video> tag."
  ] }) : S = /* @__PURE__ */ g.jsx("span", { id: T }), /* @__PURE__ */ g.jsx(L, { partialVisibility: !0, onChange: A, children: /* @__PURE__ */ g.jsxs(F, { tabIndex: "0", style: b, id: T + "_outer", children: [
    /* @__PURE__ */ g.jsx("a", { name: T }),
    S
  ] }) });
});
export {
  Q as default
};
