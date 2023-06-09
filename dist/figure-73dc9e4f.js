import { l as O, P as m, _ as V, u as N, j as v, V as B } from "./index-8862516e.js";
import G, { createElement as q, Component as k, useEffect as $, useState as K } from "react";
import "react-dom";
import "styled-components";
function U(e, t) {
  if (e == null)
    return {};
  var n = {}, r = Object.keys(e), i, s;
  for (s = 0; s < r.length; s++)
    i = r[s], !(t.indexOf(i) >= 0) && (n[i] = e[i]);
  return n;
}
function R(e, t) {
  return R = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(r, i) {
    return r.__proto__ = i, r;
  }, R(e, t);
}
function Y(e, t) {
  e.prototype = Object.create(t.prototype), e.prototype.constructor = e, R(e, t);
}
var j = function() {
  if (typeof Map < "u")
    return Map;
  function e(t, n) {
    var r = -1;
    return t.some(function(i, s) {
      return i[0] === n ? (r = s, !0) : !1;
    }), r;
  }
  return (
    /** @class */
    function() {
      function t() {
        this.__entries__ = [];
      }
      return Object.defineProperty(t.prototype, "size", {
        /**
         * @returns {boolean}
         */
        get: function() {
          return this.__entries__.length;
        },
        enumerable: !0,
        configurable: !0
      }), t.prototype.get = function(n) {
        var r = e(this.__entries__, n), i = this.__entries__[r];
        return i && i[1];
      }, t.prototype.set = function(n, r) {
        var i = e(this.__entries__, n);
        ~i ? this.__entries__[i][1] = r : this.__entries__.push([n, r]);
      }, t.prototype.delete = function(n) {
        var r = this.__entries__, i = e(r, n);
        ~i && r.splice(i, 1);
      }, t.prototype.has = function(n) {
        return !!~e(this.__entries__, n);
      }, t.prototype.clear = function() {
        this.__entries__.splice(0);
      }, t.prototype.forEach = function(n, r) {
        r === void 0 && (r = null);
        for (var i = 0, s = this.__entries__; i < s.length; i++) {
          var a = s[i];
          n.call(r, a[1], a[0]);
        }
      }, t;
    }()
  );
}(), E = typeof window < "u" && typeof document < "u" && window.document === document, g = function() {
  return typeof O < "u" && O.Math === Math ? O : typeof self < "u" && self.Math === Math ? self : typeof window < "u" && window.Math === Math ? window : Function("return this")();
}(), J = function() {
  return typeof requestAnimationFrame == "function" ? requestAnimationFrame.bind(g) : function(e) {
    return setTimeout(function() {
      return e(Date.now());
    }, 1e3 / 60);
  };
}(), Q = 2;
function X(e, t) {
  var n = !1, r = !1, i = 0;
  function s() {
    n && (n = !1, e()), r && o();
  }
  function a() {
    J(s);
  }
  function o() {
    var c = Date.now();
    if (n) {
      if (c - i < Q)
        return;
      r = !0;
    } else
      n = !0, r = !1, setTimeout(a, t);
    i = c;
  }
  return o;
}
var Z = 20, ee = ["top", "right", "bottom", "left", "width", "height", "size", "weight"], te = typeof MutationObserver < "u", ne = (
  /** @class */
  function() {
    function e() {
      this.connected_ = !1, this.mutationEventsAdded_ = !1, this.mutationsObserver_ = null, this.observers_ = [], this.onTransitionEnd_ = this.onTransitionEnd_.bind(this), this.refresh = X(this.refresh.bind(this), Z);
    }
    return e.prototype.addObserver = function(t) {
      ~this.observers_.indexOf(t) || this.observers_.push(t), this.connected_ || this.connect_();
    }, e.prototype.removeObserver = function(t) {
      var n = this.observers_, r = n.indexOf(t);
      ~r && n.splice(r, 1), !n.length && this.connected_ && this.disconnect_();
    }, e.prototype.refresh = function() {
      var t = this.updateObservers_();
      t && this.refresh();
    }, e.prototype.updateObservers_ = function() {
      var t = this.observers_.filter(function(n) {
        return n.gatherActive(), n.hasActive();
      });
      return t.forEach(function(n) {
        return n.broadcastActive();
      }), t.length > 0;
    }, e.prototype.connect_ = function() {
      !E || this.connected_ || (document.addEventListener("transitionend", this.onTransitionEnd_), window.addEventListener("resize", this.refresh), te ? (this.mutationsObserver_ = new MutationObserver(this.refresh), this.mutationsObserver_.observe(document, {
        attributes: !0,
        childList: !0,
        characterData: !0,
        subtree: !0
      })) : (document.addEventListener("DOMSubtreeModified", this.refresh), this.mutationEventsAdded_ = !0), this.connected_ = !0);
    }, e.prototype.disconnect_ = function() {
      !E || !this.connected_ || (document.removeEventListener("transitionend", this.onTransitionEnd_), window.removeEventListener("resize", this.refresh), this.mutationsObserver_ && this.mutationsObserver_.disconnect(), this.mutationEventsAdded_ && document.removeEventListener("DOMSubtreeModified", this.refresh), this.mutationsObserver_ = null, this.mutationEventsAdded_ = !1, this.connected_ = !1);
    }, e.prototype.onTransitionEnd_ = function(t) {
      var n = t.propertyName, r = n === void 0 ? "" : n, i = ee.some(function(s) {
        return !!~r.indexOf(s);
      });
      i && this.refresh();
    }, e.getInstance = function() {
      return this.instance_ || (this.instance_ = new e()), this.instance_;
    }, e.instance_ = null, e;
  }()
), D = function(e, t) {
  for (var n = 0, r = Object.keys(t); n < r.length; n++) {
    var i = r[n];
    Object.defineProperty(e, i, {
      value: t[i],
      enumerable: !1,
      writable: !1,
      configurable: !0
    });
  }
  return e;
}, _ = function(e) {
  var t = e && e.ownerDocument && e.ownerDocument.defaultView;
  return t || g;
}, S = w(0, 0, 0, 0);
function y(e) {
  return parseFloat(e) || 0;
}
function T(e) {
  for (var t = [], n = 1; n < arguments.length; n++)
    t[n - 1] = arguments[n];
  return t.reduce(function(r, i) {
    var s = e["border-" + i + "-width"];
    return r + y(s);
  }, 0);
}
function re(e) {
  for (var t = ["top", "right", "bottom", "left"], n = {}, r = 0, i = t; r < i.length; r++) {
    var s = i[r], a = e["padding-" + s];
    n[s] = y(a);
  }
  return n;
}
function ie(e) {
  var t = e.getBBox();
  return w(0, 0, t.width, t.height);
}
function oe(e) {
  var t = e.clientWidth, n = e.clientHeight;
  if (!t && !n)
    return S;
  var r = _(e).getComputedStyle(e), i = re(r), s = i.left + i.right, a = i.top + i.bottom, o = y(r.width), c = y(r.height);
  if (r.boxSizing === "border-box" && (Math.round(o + s) !== t && (o -= T(r, "left", "right") + s), Math.round(c + a) !== n && (c -= T(r, "top", "bottom") + a)), !ae(e)) {
    var h = Math.round(o + s) - t, f = Math.round(c + a) - n;
    Math.abs(h) !== 1 && (o -= h), Math.abs(f) !== 1 && (c -= f);
  }
  return w(i.left, i.top, o, c);
}
var se = function() {
  return typeof SVGGraphicsElement < "u" ? function(e) {
    return e instanceof _(e).SVGGraphicsElement;
  } : function(e) {
    return e instanceof _(e).SVGElement && typeof e.getBBox == "function";
  };
}();
function ae(e) {
  return e === _(e).document.documentElement;
}
function ce(e) {
  return E ? se(e) ? ie(e) : oe(e) : S;
}
function ue(e) {
  var t = e.x, n = e.y, r = e.width, i = e.height, s = typeof DOMRectReadOnly < "u" ? DOMRectReadOnly : Object, a = Object.create(s.prototype);
  return D(a, {
    x: t,
    y: n,
    width: r,
    height: i,
    top: n,
    right: t + r,
    bottom: i + n,
    left: t
  }), a;
}
function w(e, t, n, r) {
  return { x: e, y: t, width: n, height: r };
}
var fe = (
  /** @class */
  function() {
    function e(t) {
      this.broadcastWidth = 0, this.broadcastHeight = 0, this.contentRect_ = w(0, 0, 0, 0), this.target = t;
    }
    return e.prototype.isActive = function() {
      var t = ce(this.target);
      return this.contentRect_ = t, t.width !== this.broadcastWidth || t.height !== this.broadcastHeight;
    }, e.prototype.broadcastRect = function() {
      var t = this.contentRect_;
      return this.broadcastWidth = t.width, this.broadcastHeight = t.height, t;
    }, e;
  }()
), he = (
  /** @class */
  function() {
    function e(t, n) {
      var r = ue(n);
      D(this, { target: t, contentRect: r });
    }
    return e;
  }()
), le = (
  /** @class */
  function() {
    function e(t, n, r) {
      if (this.activeObservations_ = [], this.observations_ = new j(), typeof t != "function")
        throw new TypeError("The callback provided as parameter 1 is not a function.");
      this.callback_ = t, this.controller_ = n, this.callbackCtx_ = r;
    }
    return e.prototype.observe = function(t) {
      if (!arguments.length)
        throw new TypeError("1 argument required, but only 0 present.");
      if (!(typeof Element > "u" || !(Element instanceof Object))) {
        if (!(t instanceof _(t).Element))
          throw new TypeError('parameter 1 is not of type "Element".');
        var n = this.observations_;
        n.has(t) || (n.set(t, new fe(t)), this.controller_.addObserver(this), this.controller_.refresh());
      }
    }, e.prototype.unobserve = function(t) {
      if (!arguments.length)
        throw new TypeError("1 argument required, but only 0 present.");
      if (!(typeof Element > "u" || !(Element instanceof Object))) {
        if (!(t instanceof _(t).Element))
          throw new TypeError('parameter 1 is not of type "Element".');
        var n = this.observations_;
        n.has(t) && (n.delete(t), n.size || this.controller_.removeObserver(this));
      }
    }, e.prototype.disconnect = function() {
      this.clearActive(), this.observations_.clear(), this.controller_.removeObserver(this);
    }, e.prototype.gatherActive = function() {
      var t = this;
      this.clearActive(), this.observations_.forEach(function(n) {
        n.isActive() && t.activeObservations_.push(n);
      });
    }, e.prototype.broadcastActive = function() {
      if (this.hasActive()) {
        var t = this.callbackCtx_, n = this.activeObservations_.map(function(r) {
          return new he(r.target, r.broadcastRect());
        });
        this.callback_.call(t, n, t), this.clearActive();
      }
    }, e.prototype.clearActive = function() {
      this.activeObservations_.splice(0);
    }, e.prototype.hasActive = function() {
      return this.activeObservations_.length > 0;
    }, e;
  }()
), I = typeof WeakMap < "u" ? /* @__PURE__ */ new WeakMap() : new j(), L = (
  /** @class */
  function() {
    function e(t) {
      if (!(this instanceof e))
        throw new TypeError("Cannot call a class as a function.");
      if (!arguments.length)
        throw new TypeError("1 argument required, but only 0 present.");
      var n = ne.getInstance(), r = new le(t, n, this);
      I.set(this, r);
    }
    return e;
  }()
);
[
  "observe",
  "unobserve",
  "disconnect"
].forEach(function(e) {
  L.prototype[e] = function() {
    var t;
    return (t = I.get(this))[e].apply(t, arguments);
  };
});
var de = function() {
  return typeof g.ResizeObserver < "u" ? g.ResizeObserver : L;
}(), pe = ["client", "offset", "scroll", "bounds", "margin"];
function A(e) {
  var t = [];
  return pe.forEach(function(n) {
    e[n] && t.push(n);
  }), t;
}
function C(e, t) {
  var n = {};
  if (t.indexOf("client") > -1 && (n.client = {
    top: e.clientTop,
    left: e.clientLeft,
    width: e.clientWidth,
    height: e.clientHeight
  }), t.indexOf("offset") > -1 && (n.offset = {
    top: e.offsetTop,
    left: e.offsetLeft,
    width: e.offsetWidth,
    height: e.offsetHeight
  }), t.indexOf("scroll") > -1 && (n.scroll = {
    top: e.scrollTop,
    left: e.scrollLeft,
    width: e.scrollWidth,
    height: e.scrollHeight
  }), t.indexOf("bounds") > -1) {
    var r = e.getBoundingClientRect();
    n.bounds = {
      top: r.top,
      right: r.right,
      bottom: r.bottom,
      left: r.left,
      width: r.width,
      height: r.height
    };
  }
  if (t.indexOf("margin") > -1) {
    var i = getComputedStyle(e);
    n.margin = {
      top: i ? parseInt(i.marginTop) : 0,
      right: i ? parseInt(i.marginRight) : 0,
      bottom: i ? parseInt(i.marginBottom) : 0,
      left: i ? parseInt(i.marginLeft) : 0
    };
  }
  return n;
}
function ve(e) {
  var t = e && e.ownerDocument && e.ownerDocument.defaultView;
  return t || window;
}
function me(e) {
  return function(t) {
    var n, r;
    return r = n = /* @__PURE__ */ function(i) {
      Y(s, i);
      function s() {
        for (var o, c = arguments.length, h = new Array(c), f = 0; f < c; f++)
          h[f] = arguments[f];
        return o = i.call.apply(i, [this].concat(h)) || this, o.state = {
          contentRect: {
            entry: {},
            client: {},
            offset: {},
            scroll: {},
            bounds: {},
            margin: {}
          }
        }, o._animationFrameID = null, o._resizeObserver = null, o._node = null, o._window = null, o.measure = function(l) {
          var d = C(o._node, e || A(o.props));
          l && (d.entry = l[0].contentRect), o._animationFrameID = o._window.requestAnimationFrame(function() {
            o._resizeObserver !== null && (o.setState({
              contentRect: d
            }), typeof o.props.onResize == "function" && o.props.onResize(d));
          });
        }, o._handleRef = function(l) {
          o._resizeObserver !== null && o._node !== null && o._resizeObserver.unobserve(o._node), o._node = l, o._window = ve(o._node);
          var d = o.props.innerRef;
          d && (typeof d == "function" ? d(o._node) : d.current = o._node), o._resizeObserver !== null && o._node !== null && o._resizeObserver.observe(o._node);
        }, o;
      }
      var a = s.prototype;
      return a.componentDidMount = function() {
        this._resizeObserver = this._window !== null && this._window.ResizeObserver ? new this._window.ResizeObserver(this.measure) : new de(this.measure), this._node !== null && (this._resizeObserver.observe(this._node), typeof this.props.onResize == "function" && this.props.onResize(C(this._node, e || A(this.props))));
      }, a.componentWillUnmount = function() {
        this._window !== null && this._window.cancelAnimationFrame(this._animationFrameID), this._resizeObserver !== null && (this._resizeObserver.disconnect(), this._resizeObserver = null);
      }, a.render = function() {
        var c = this.props;
        c.innerRef, c.onResize;
        var h = U(c, ["innerRef", "onResize"]);
        return q(t, V({}, h, {
          measureRef: this._handleRef,
          measure: this.measure,
          contentRect: this.state.contentRect
        }));
      }, s;
    }(k), n.propTypes = {
      client: m.bool,
      offset: m.bool,
      scroll: m.bool,
      bounds: m.bool,
      margin: m.bool,
      innerRef: m.oneOfType([m.object, m.func]),
      onResize: m.func
    }, r;
  };
}
var x = me()(function(e) {
  var t = e.measure, n = e.measureRef, r = e.contentRect, i = e.children;
  return i({
    measure: t,
    measureRef: n,
    contentRect: r
  });
});
x.displayName = "Measure";
x.propTypes.children = m.func;
const be = x, Oe = G.memo(function(t) {
  var M;
  let { name: n, id: r, SVs: i, children: s, actions: a, callAction: o } = N(t), c = (u) => {
    o({
      action: a.recordVisibilityChange,
      args: { isVisible: u }
    });
  };
  if ($(() => () => {
    o({
      action: a.recordVisibilityChange,
      args: { isVisible: !1 }
    });
  }, []), i.hidden || !s)
    return null;
  let h = s, f = null, l = null;
  if (i.captionChildName) {
    let u;
    for (let [p, b] of s.entries())
      if (((M = b == null ? void 0 : b.props) == null ? void 0 : M.componentInstructions.componentName) === i.captionChildName) {
        u = p;
        break;
      }
    l = s[u], h.splice(u, 1);
  }
  if (i.suppressFigureNameInCaption)
    l && (f = /* @__PURE__ */ v.jsx("div", { children: l }));
  else {
    let u = /* @__PURE__ */ v.jsx("strong", { children: i.figureName });
    l ? f = /* @__PURE__ */ v.jsxs("div", { children: [
      u,
      ": ",
      l
    ] }) : f = /* @__PURE__ */ v.jsx("div", { children: u });
  }
  const [d, z] = K("center");
  function H(u) {
    var p = document.createElement(u.nodeName), b;
    return p.setAttribute(
      "style",
      "margin:0; padding:0; font-family:" + (u.style.fontFamily || "inherit") + "; font-size:" + (u.style.fontSize || "inherit")
    ), p.innerHTML = "A", u.parentNode.appendChild(p), b = p.clientHeight, p.parentNode.removeChild(p), b;
  }
  function P() {
    var u = document.getElementById(r + "_caption"), p = u.offsetHeight, b = H(document.getElementById(r + "_caption")), F = Math.round(p / b);
    return F;
  }
  function W() {
    P() >= 2 ? z("left") : z("center");
  }
  return /* @__PURE__ */ v.jsx(B, { partialVisibility: !0, onChange: c, children: /* @__PURE__ */ v.jsxs("figure", { id: r, style: { margin: "12px 0" }, children: [
    /* @__PURE__ */ v.jsx("a", { name: r }),
    h,
    /* @__PURE__ */ v.jsx("figcaption", { id: r + "_caption", children: /* @__PURE__ */ v.jsx(be, { onResize: W, children: ({ measureRef: u }) => /* @__PURE__ */ v.jsx("div", { ref: u, style: { textAlign: d }, children: f }) }) })
  ] }) });
});
export {
  Oe as default
};
