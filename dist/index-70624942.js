import { p as f } from "./index-64c78e6b.js";
import * as l from "react";
/**
 * @remix-run/router v1.6.2
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */
function F() {
  return F = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var n = arguments[t];
      for (var a in n)
        Object.prototype.hasOwnProperty.call(n, a) && (e[a] = n[a]);
    }
    return e;
  }, F.apply(this, arguments);
}
var q;
(function(e) {
  e.Pop = "POP", e.Push = "PUSH", e.Replace = "REPLACE";
})(q || (q = {}));
function d(e, t) {
  if (e === !1 || e === null || typeof e > "u")
    throw new Error(t);
}
function B(e, t) {
  if (!e) {
    typeof console < "u" && console.warn(t);
    try {
      throw new Error(t);
    } catch {
    }
  }
}
function k(e) {
  let {
    pathname: t = "/",
    search: n = "",
    hash: a = ""
  } = e;
  return n && n !== "?" && (t += n.charAt(0) === "?" ? n : "?" + n), a && a !== "#" && (t += a.charAt(0) === "#" ? a : "#" + a), t;
}
function Q(e) {
  let t = {};
  if (e) {
    let n = e.indexOf("#");
    n >= 0 && (t.hash = e.substr(n), e = e.substr(0, n));
    let a = e.indexOf("?");
    a >= 0 && (t.search = e.substr(a), e = e.substr(0, a)), e && (t.pathname = e);
  }
  return t;
}
var Y;
(function(e) {
  e.data = "data", e.deferred = "deferred", e.redirect = "redirect", e.error = "error";
})(Y || (Y = {}));
function W(e, t) {
  if (t === "/")
    return e;
  if (!e.toLowerCase().startsWith(t.toLowerCase()))
    return null;
  let n = t.endsWith("/") ? t.length - 1 : t.length, a = e.charAt(n);
  return a && a !== "/" ? null : e.slice(n) || "/";
}
function ue(e, t) {
  t === void 0 && (t = "/");
  let {
    pathname: n,
    search: a = "",
    hash: r = ""
  } = typeof e == "string" ? Q(e) : e;
  return {
    pathname: n ? n.startsWith("/") ? n : ce(n, t) : t,
    search: fe(a),
    hash: de(r)
  };
}
function ce(e, t) {
  let n = t.replace(/\/+$/, "").split("/");
  return e.split("/").forEach((r) => {
    r === ".." ? n.length > 1 && n.pop() : r !== "." && n.push(r);
  }), n.length > 1 ? n.join("/") : "/";
}
function I(e, t, n, a) {
  return "Cannot include a '" + e + "' character in a manually specified " + ("`to." + t + "` field [" + JSON.stringify(a) + "].  Please separate it out to the ") + ("`to." + n + "` field. Alternatively you may provide the full path as ") + 'a string in <Link to="..."> and the router will parse it for you.';
}
function Z(e) {
  return e.filter((t, n) => n === 0 || t.route.path && t.route.path.length > 0);
}
function H(e, t, n, a) {
  a === void 0 && (a = !1);
  let r;
  typeof e == "string" ? r = Q(e) : (r = F({}, e), d(!r.pathname || !r.pathname.includes("?"), I("?", "pathname", "search", r)), d(!r.pathname || !r.pathname.includes("#"), I("#", "pathname", "hash", r)), d(!r.search || !r.search.includes("#"), I("#", "search", "hash", r)));
  let i = e === "" || r.pathname === "", o = i ? "/" : r.pathname, s;
  if (a || o == null)
    s = n;
  else {
    let m = t.length - 1;
    if (o.startsWith("..")) {
      let E = o.split("/");
      for (; E[0] === ".."; )
        E.shift(), m -= 1;
      r.pathname = E.join("/");
    }
    s = m >= 0 ? t[m] : "/";
  }
  let u = ue(r, s), c = o && o !== "/" && o.endsWith("/"), h = (i || o === ".") && n.endsWith("/");
  return !u.pathname.endsWith("/") && (c || h) && (u.pathname += "/"), u;
}
const $ = (e) => e.join("/").replace(/\/\/+/g, "/"), fe = (e) => !e || e === "?" ? "" : e.startsWith("?") ? e : "?" + e, de = (e) => !e || e === "#" ? "" : e.startsWith("#") ? e : "#" + e, ee = ["post", "put", "patch", "delete"];
new Set(ee);
const he = ["get", ...ee];
new Set(he);
function j() {
  return j = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var n = arguments[t];
      for (var a in n)
        Object.prototype.hasOwnProperty.call(n, a) && (e[a] = n[a]);
    }
    return e;
  }, j.apply(this, arguments);
}
const P = /* @__PURE__ */ l.createContext(null);
f.env.NODE_ENV !== "production" && (P.displayName = "DataRouter");
const te = /* @__PURE__ */ l.createContext(null);
f.env.NODE_ENV !== "production" && (te.displayName = "DataRouterState");
const me = /* @__PURE__ */ l.createContext(null);
f.env.NODE_ENV !== "production" && (me.displayName = "Await");
const x = /* @__PURE__ */ l.createContext(null);
f.env.NODE_ENV !== "production" && (x.displayName = "Navigation");
const J = /* @__PURE__ */ l.createContext(null);
f.env.NODE_ENV !== "production" && (J.displayName = "Location");
const R = /* @__PURE__ */ l.createContext({
  outlet: null,
  matches: [],
  isDataRoute: !1
});
f.env.NODE_ENV !== "production" && (R.displayName = "Route");
const pe = /* @__PURE__ */ l.createContext(null);
f.env.NODE_ENV !== "production" && (pe.displayName = "RouteError");
function ve(e, t) {
  let {
    relative: n
  } = t === void 0 ? {} : t;
  K() || (f.env.NODE_ENV !== "production" ? d(
    !1,
    // TODO: This error is probably because they somehow have 2 versions of the
    // router loaded. We can help them understand how to avoid that.
    "useHref() may be used only in the context of a <Router> component."
  ) : d(!1));
  let {
    basename: a,
    navigator: r
  } = l.useContext(x), {
    hash: i,
    pathname: o,
    search: s
  } = U(e, {
    relative: n
  }), u = o;
  return a !== "/" && (u = o === "/" ? a : $([a, o])), r.createHref({
    pathname: u,
    search: s,
    hash: i
  });
}
function K() {
  return l.useContext(J) != null;
}
function O() {
  return K() || (f.env.NODE_ENV !== "production" ? d(
    !1,
    // TODO: This error is probably because they somehow have 2 versions of the
    // router loaded. We can help them understand how to avoid that.
    "useLocation() may be used only in the context of a <Router> component."
  ) : d(!1)), l.useContext(J).location;
}
const ne = "You should call navigate() in a React.useEffect(), not when your component is first rendered.";
function ae(e) {
  l.useContext(x).static || l.useLayoutEffect(e);
}
function ge() {
  let {
    isDataRoute: e
  } = l.useContext(R);
  return e ? Ce() : Ne();
}
function Ne() {
  K() || (f.env.NODE_ENV !== "production" ? d(
    !1,
    // TODO: This error is probably because they somehow have 2 versions of the
    // router loaded. We can help them understand how to avoid that.
    "useNavigate() may be used only in the context of a <Router> component."
  ) : d(!1));
  let e = l.useContext(P), {
    basename: t,
    navigator: n
  } = l.useContext(x), {
    matches: a
  } = l.useContext(R), {
    pathname: r
  } = O(), i = JSON.stringify(Z(a).map((u) => u.pathnameBase)), o = l.useRef(!1);
  return ae(() => {
    o.current = !0;
  }), l.useCallback(function(u, c) {
    if (c === void 0 && (c = {}), f.env.NODE_ENV !== "production" && B(o.current, ne), !o.current)
      return;
    if (typeof u == "number") {
      n.go(u);
      return;
    }
    let h = H(u, JSON.parse(i), r, c.relative === "path");
    e == null && t !== "/" && (h.pathname = h.pathname === "/" ? t : $([t, h.pathname])), (c.replace ? n.replace : n.push)(h, c.state, c);
  }, [t, n, i, r, e]);
}
function U(e, t) {
  let {
    relative: n
  } = t === void 0 ? {} : t, {
    matches: a
  } = l.useContext(R), {
    pathname: r
  } = O(), i = JSON.stringify(Z(a).map((o) => o.pathnameBase));
  return l.useMemo(() => H(e, JSON.parse(i), r, n === "path"), [e, i, r, n]);
}
var T;
(function(e) {
  e.UseBlocker = "useBlocker", e.UseRevalidator = "useRevalidator", e.UseNavigateStable = "useNavigate";
})(T || (T = {}));
var S;
(function(e) {
  e.UseBlocker = "useBlocker", e.UseLoaderData = "useLoaderData", e.UseActionData = "useActionData", e.UseRouteError = "useRouteError", e.UseNavigation = "useNavigation", e.UseRouteLoaderData = "useRouteLoaderData", e.UseMatches = "useMatches", e.UseRevalidator = "useRevalidator", e.UseNavigateStable = "useNavigate", e.UseRouteId = "useRouteId";
})(S || (S = {}));
function re(e) {
  return e + " must be used within a data router.  See https://reactrouter.com/routers/picking-a-router.";
}
function Ee(e) {
  let t = l.useContext(P);
  return t || (f.env.NODE_ENV !== "production" ? d(!1, re(e)) : d(!1)), t;
}
function be(e) {
  let t = l.useContext(R);
  return t || (f.env.NODE_ENV !== "production" ? d(!1, re(e)) : d(!1)), t;
}
function oe(e) {
  let t = be(e), n = t.matches[t.matches.length - 1];
  return n.route.id || (f.env.NODE_ENV !== "production" ? d(!1, e + ' can only be used on routes that contain a unique "id"') : d(!1)), n.route.id;
}
function ye() {
  return oe(S.UseRouteId);
}
function Ce() {
  let {
    router: e
  } = Ee(T.UseNavigateStable), t = oe(S.UseNavigateStable), n = l.useRef(!1);
  return ae(() => {
    n.current = !0;
  }), l.useCallback(function(r, i) {
    i === void 0 && (i = {}), f.env.NODE_ENV !== "production" && B(n.current, ne), n.current && (typeof r == "number" ? e.navigate(r) : e.navigate(r, j({
      fromRouteId: t
    }, i)));
  }, [e, t]);
}
var G;
(function(e) {
  e[e.pending = 0] = "pending", e[e.success = 1] = "success", e[e.error = 2] = "error";
})(G || (G = {}));
new Promise(() => {
});
function C() {
  return C = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var n = arguments[t];
      for (var a in n)
        Object.prototype.hasOwnProperty.call(n, a) && (e[a] = n[a]);
    }
    return e;
  }, C.apply(this, arguments);
}
function z(e, t) {
  if (e == null)
    return {};
  var n = {}, a = Object.keys(e), r, i;
  for (i = 0; i < a.length; i++)
    r = a[i], !(t.indexOf(r) >= 0) && (n[r] = e[r]);
  return n;
}
const D = "get", A = "application/x-www-form-urlencoded";
function _(e) {
  return e != null && typeof e.tagName == "string";
}
function xe(e) {
  return _(e) && e.tagName.toLowerCase() === "button";
}
function we(e) {
  return _(e) && e.tagName.toLowerCase() === "form";
}
function Re(e) {
  return _(e) && e.tagName.toLowerCase() === "input";
}
function Oe(e) {
  return !!(e.metaKey || e.altKey || e.ctrlKey || e.shiftKey);
}
function Le(e, t) {
  return e.button === 0 && // Ignore everything but left clicks
  (!t || t === "_self") && // Let browser handle "target=_blank" etc.
  !Oe(e);
}
function De(e, t, n) {
  let a, r = null, i, o;
  if (we(e)) {
    let s = t.submissionTrigger;
    if (t.action)
      r = t.action;
    else {
      let u = e.getAttribute("action");
      r = u ? W(u, n) : null;
    }
    a = t.method || e.getAttribute("method") || D, i = t.encType || e.getAttribute("enctype") || A, o = new FormData(e), s && s.name && o.append(s.name, s.value);
  } else if (xe(e) || Re(e) && (e.type === "submit" || e.type === "image")) {
    let s = e.form;
    if (s == null)
      throw new Error('Cannot submit a <button> or <input type="submit"> without a <form>');
    if (t.action)
      r = t.action;
    else {
      let u = e.getAttribute("formaction") || s.getAttribute("action");
      r = u ? W(u, n) : null;
    }
    a = t.method || e.getAttribute("formmethod") || s.getAttribute("method") || D, i = t.encType || e.getAttribute("formenctype") || s.getAttribute("enctype") || A, o = new FormData(s), e.name && o.append(e.name, e.value);
  } else {
    if (_(e))
      throw new Error('Cannot submit element that is not <form>, <button>, or <input type="submit|image">');
    if (a = t.method || D, r = t.action || null, i = t.encType || A, e instanceof FormData)
      o = e;
    else if (o = new FormData(), e instanceof URLSearchParams)
      for (let [s, u] of e)
        o.append(s, u);
    else if (e != null)
      for (let s of Object.keys(e))
        o.append(s, e[s]);
  }
  return {
    action: r,
    method: a.toLowerCase(),
    encType: i,
    formData: o
  };
}
const Se = ["onClick", "relative", "reloadDocument", "replace", "state", "target", "to", "preventScrollReset"], Pe = ["aria-current", "caseSensitive", "className", "end", "style", "to", "children"], Ue = ["reloadDocument", "replace", "method", "action", "onSubmit", "fetcherKey", "routeId", "relative", "preventScrollReset"];
f.env.NODE_ENV;
const _e = typeof window < "u" && typeof window.document < "u" && typeof window.document.createElement < "u", Ve = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i, ie = /* @__PURE__ */ l.forwardRef(function(t, n) {
  let {
    onClick: a,
    relative: r,
    reloadDocument: i,
    replace: o,
    state: s,
    target: u,
    to: c,
    preventScrollReset: h
  } = t, m = z(t, Se), {
    basename: E
  } = l.useContext(x), b, w = !1;
  if (typeof c == "string" && Ve.test(c) && (b = c, _e))
    try {
      let p = new URL(window.location.href), y = c.startsWith("//") ? new URL(p.protocol + c) : new URL(c), L = W(y.pathname, E);
      y.origin === p.origin && L != null ? c = L + y.search + y.hash : w = !0;
    } catch {
      f.env.NODE_ENV !== "production" && B(!1, '<Link to="' + c + '"> contains an invalid URL which will probably break when clicked - please update to a valid URL path.');
    }
  let N = ve(c, {
    relative: r
  }), v = We(c, {
    replace: o,
    state: s,
    target: u,
    preventScrollReset: h,
    relative: r
  });
  function g(p) {
    a && a(p), p.defaultPrevented || v(p);
  }
  return (
    // eslint-disable-next-line jsx-a11y/anchor-has-content
    /* @__PURE__ */ l.createElement("a", C({}, m, {
      href: b || N,
      onClick: w || i ? a : g,
      ref: n,
      target: u
    }))
  );
});
f.env.NODE_ENV !== "production" && (ie.displayName = "Link");
const Ie = /* @__PURE__ */ l.forwardRef(function(t, n) {
  let {
    "aria-current": a = "page",
    caseSensitive: r = !1,
    className: i = "",
    end: o = !1,
    style: s,
    to: u,
    children: c
  } = t, h = z(t, Pe), m = U(u, {
    relative: h.relative
  }), E = O(), b = l.useContext(te), {
    navigator: w
  } = l.useContext(x), N = w.encodeLocation ? w.encodeLocation(m).pathname : m.pathname, v = E.pathname, g = b && b.navigation && b.navigation.location ? b.navigation.location.pathname : null;
  r || (v = v.toLowerCase(), g = g ? g.toLowerCase() : null, N = N.toLowerCase());
  let p = v === N || !o && v.startsWith(N) && v.charAt(N.length) === "/", y = g != null && (g === N || !o && g.startsWith(N) && g.charAt(N.length) === "/"), L = p ? a : void 0, V;
  typeof i == "function" ? V = i({
    isActive: p,
    isPending: y
  }) : V = [i, p ? "active" : null, y ? "pending" : null].filter(Boolean).join(" ");
  let se = typeof s == "function" ? s({
    isActive: p,
    isPending: y
  }) : s;
  return /* @__PURE__ */ l.createElement(ie, C({}, h, {
    "aria-current": L,
    className: V,
    ref: n,
    style: se,
    to: u
  }), typeof c == "function" ? c({
    isActive: p,
    isPending: y
  }) : c);
});
f.env.NODE_ENV !== "production" && (Ie.displayName = "NavLink");
const Ae = /* @__PURE__ */ l.forwardRef((e, t) => /* @__PURE__ */ l.createElement(le, C({}, e, {
  ref: t
})));
f.env.NODE_ENV !== "production" && (Ae.displayName = "Form");
const le = /* @__PURE__ */ l.forwardRef((e, t) => {
  let {
    reloadDocument: n,
    replace: a,
    method: r = D,
    action: i,
    onSubmit: o,
    fetcherKey: s,
    routeId: u,
    relative: c,
    preventScrollReset: h
  } = e, m = z(e, Ue), E = je(s, u), b = r.toLowerCase() === "get" ? "get" : "post", w = Te(i, {
    relative: c
  }), N = (v) => {
    if (o && o(v), v.defaultPrevented)
      return;
    v.preventDefault();
    let g = v.nativeEvent.submitter, p = (g == null ? void 0 : g.getAttribute("formmethod")) || r;
    E(g || v.currentTarget, {
      method: p,
      replace: a,
      relative: c,
      preventScrollReset: h
    });
  };
  return /* @__PURE__ */ l.createElement("form", C({
    ref: t,
    method: b,
    action: w,
    onSubmit: n ? o : N
  }, m));
});
f.env.NODE_ENV !== "production" && (le.displayName = "FormImpl");
f.env.NODE_ENV;
var M;
(function(e) {
  e.UseScrollRestoration = "useScrollRestoration", e.UseSubmitImpl = "useSubmitImpl", e.UseFetcher = "useFetcher";
})(M || (M = {}));
var X;
(function(e) {
  e.UseFetchers = "useFetchers", e.UseScrollRestoration = "useScrollRestoration";
})(X || (X = {}));
function Fe(e) {
  return e + " must be used within a data router.  See https://reactrouter.com/routers/picking-a-router.";
}
function ke(e) {
  let t = l.useContext(P);
  return t || (f.env.NODE_ENV !== "production" ? d(!1, Fe(e)) : d(!1)), t;
}
function We(e, t) {
  let {
    target: n,
    replace: a,
    state: r,
    preventScrollReset: i,
    relative: o
  } = t === void 0 ? {} : t, s = ge(), u = O(), c = U(e, {
    relative: o
  });
  return l.useCallback((h) => {
    if (Le(h, n)) {
      h.preventDefault();
      let m = a !== void 0 ? a : k(u) === k(c);
      s(e, {
        replace: m,
        state: r,
        preventScrollReset: i,
        relative: o
      });
    }
  }, [u, s, c, a, r, n, e, i, o]);
}
function je(e, t) {
  let {
    router: n
  } = ke(M.UseSubmitImpl), {
    basename: a
  } = l.useContext(x), r = ye();
  return l.useCallback(function(i, o) {
    if (o === void 0 && (o = {}), typeof document > "u")
      throw new Error("You are calling submit during the server render. Try calling submit within a `useEffect` or callback instead.");
    let {
      action: s,
      method: u,
      encType: c,
      formData: h
    } = De(i, o, a), m = {
      preventScrollReset: o.preventScrollReset,
      formData: h,
      formMethod: u,
      formEncType: c
    };
    e ? (t == null && (f.env.NODE_ENV !== "production" ? d(!1, "No routeId available for useFetcher()") : d(!1)), n.fetch(e, t, s, m)) : n.navigate(s, C({}, m, {
      replace: o.replace,
      fromRouteId: r
    }));
  }, [n, a, e, t, r]);
}
function Te(e, t) {
  let {
    relative: n
  } = t === void 0 ? {} : t, {
    basename: a
  } = l.useContext(x), r = l.useContext(R);
  r || (f.env.NODE_ENV !== "production" ? d(!1, "useFormAction must be used inside a RouteContext") : d(!1));
  let [i] = r.matches.slice(-1), o = C({}, U(e || ".", {
    relative: n
  })), s = O();
  if (e == null && (o.search = s.search, o.hash = s.hash, i.route.index)) {
    let u = new URLSearchParams(o.search);
    u.delete("index"), o.search = u.toString() ? "?" + u.toString() : "";
  }
  return (!e || e === ".") && i.route.index && (o.search = o.search ? o.search.replace(/^\?/, "?index&") : "?index"), a !== "/" && (o.pathname = o.pathname === "/" ? a : $([a, o.pathname])), k(o);
}
export {
  ie as L
};
