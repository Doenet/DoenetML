import { y as commonjsGlobal, p as browser$1, z as getDefaultExportFromCjs } from "./index-dce15b2c.js";
import React__default from "react";
var reactMathquill$1 = { exports: {} }, reactMathquill_min = { exports: {} };
/*! For license information please see react-mathquill.min.js.LICENSE.txt */
var hasRequiredReactMathquill_min;
function requireReactMathquill_min() {
  return hasRequiredReactMathquill_min || (hasRequiredReactMathquill_min = 1, function(Ot, ae) {
    (function(se, Un) {
      Ot.exports = Un(React__default);
    })(commonjsGlobal, function(se) {
      return (() => {
        var Un = { 991: (ot, yt, K) => {
          K.d(yt, { Z: () => Jt });
          var I = K(156), at = K.n(I), st = K(697), dt = K.n(st), ht = K(700), te = ["latex", "onChange", "config", "mathquillDidMount"];
          function Ht() {
            return Ht = Object.assign || function(g) {
              for (var F = 1; F < arguments.length; F++) {
                var L = arguments[F];
                for (var f in L)
                  Object.prototype.hasOwnProperty.call(L, f) && (g[f] = L[f]);
              }
              return g;
            }, Ht.apply(this, arguments);
          }
          function vt(g, F) {
            var L = Object.keys(g);
            if (Object.getOwnPropertySymbols) {
              var f = Object.getOwnPropertySymbols(g);
              F && (f = f.filter(function(U) {
                return Object.getOwnPropertyDescriptor(g, U).enumerable;
              })), L.push.apply(L, f);
            }
            return L;
          }
          function Xt(g) {
            for (var F = 1; F < arguments.length; F++) {
              var L = arguments[F] != null ? arguments[F] : {};
              F % 2 ? vt(Object(L), !0).forEach(function(f) {
                ct(g, f, L[f]);
              }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(g, Object.getOwnPropertyDescriptors(L)) : vt(Object(L)).forEach(function(f) {
                Object.defineProperty(g, f, Object.getOwnPropertyDescriptor(L, f));
              });
            }
            return g;
          }
          function ct(g, F, L) {
            return F in g ? Object.defineProperty(g, F, { value: L, enumerable: !0, configurable: !0, writable: !0 }) : g[F] = L, g;
          }
          var Gt = function(g) {
            var F = g.latex, L = g.onChange, f = g.config, U = g.mathquillDidMount, lt = function(s, xt) {
              if (s == null)
                return {};
              var Pt, he, It = function(ee, Ce) {
                if (ee == null)
                  return {};
                var Ae, Re, Ue = {}, ne = Object.keys(ee);
                for (Re = 0; Re < ne.length; Re++)
                  Ae = ne[Re], Ce.indexOf(Ae) >= 0 || (Ue[Ae] = ee[Ae]);
                return Ue;
              }(s, xt);
              if (Object.getOwnPropertySymbols) {
                var Dt = Object.getOwnPropertySymbols(s);
                for (he = 0; he < Dt.length; he++)
                  Pt = Dt[he], xt.indexOf(Pt) >= 0 || Object.prototype.propertyIsEnumerable.call(s, Pt) && (It[Pt] = s[Pt]);
              }
              return It;
            }(g, te), At = (0, I.useRef)(2), gt = (0, I.useRef)(null), le = (0, I.useRef)(null), a = (0, I.useRef)(L);
            return (0, I.useEffect)(function() {
              a.current = L;
            }, [L]), (0, I.useEffect)(function() {
              if (le.current) {
                var s = { restrictMismatchedBrackets: !0, handlers: {} };
                f && (s = Xt(Xt({}, s), f));
                var xt = s.handlers.edit;
                s.handlers.edit = function(Pt) {
                  xt && xt(), At.current > 0 ? At.current -= 1 : a.current && a.current(Pt);
                }, gt.current = ht.Z.MathField(le.current, s), gt.current.latex(F || ""), U && U(gt.current);
              }
            }, [le]), (0, I.useEffect)(function() {
              gt.current && gt.current.latex() !== F && gt.current.latex(F);
            }, [F]), at().createElement("span", Ht({}, lt, { ref: le }));
          };
          Gt.propTypes = { latex: dt().string, onChange: dt().func, config: dt().object, mathquillDidMount: dt().func };
          const Jt = Gt;
        }, 717: (ot, yt, K) => {
          K.d(yt, { Z: () => Xt });
          var I = K(156), at = K.n(I), st = K(697), dt = K.n(st), ht = K(700), te = ["mathquillDidMount", "children"];
          function Ht() {
            return Ht = Object.assign || function(ct) {
              for (var Gt = 1; Gt < arguments.length; Gt++) {
                var Jt = arguments[Gt];
                for (var g in Jt)
                  Object.prototype.hasOwnProperty.call(Jt, g) && (ct[g] = Jt[g]);
              }
              return ct;
            }, Ht.apply(this, arguments);
          }
          var vt = function(ct) {
            var Gt = ct.mathquillDidMount, Jt = ct.children, g = function(f, U) {
              if (f == null)
                return {};
              var lt, At, gt = function(a, s) {
                if (a == null)
                  return {};
                var xt, Pt, he = {}, It = Object.keys(a);
                for (Pt = 0; Pt < It.length; Pt++)
                  xt = It[Pt], s.indexOf(xt) >= 0 || (he[xt] = a[xt]);
                return he;
              }(f, U);
              if (Object.getOwnPropertySymbols) {
                var le = Object.getOwnPropertySymbols(f);
                for (At = 0; At < le.length; At++)
                  lt = le[At], U.indexOf(lt) >= 0 || Object.prototype.propertyIsEnumerable.call(f, lt) && (gt[lt] = f[lt]);
              }
              return gt;
            }(ct, te), F = (0, I.useRef)(null), L = (0, I.useRef)(null);
            return (0, I.useLayoutEffect)(function() {
              F && (L.current = ht.Z.StaticMath(F.current), Gt && Gt(L.current));
            }, [F, Jt]), at().createElement("span", Ht({}, g, { ref: F }), Jt);
          };
          vt.propTypes = { children: dt().string, mathquillDidMount: dt().func };
          const Xt = vt;
        }, 700: (ot, yt, K) => {
          K.d(yt, { Z: () => I });
          const I = K(338).getInterface(2);
        }, 527: (ot, yt, K) => {
          K.d(yt, { Z: () => ht });
          var I = K(81), at = K.n(I), st = K(645), dt = K.n(st)()(at());
          dt.push([ot.id, `/*
 * MathQuill v0.11.0, by Han, Jeanine, and Mary
 * http://mathquill.com | maintainers@mathquill.com
 *
 * This Source Code Form is subject to the terms of the
 * Mozilla Public License, v. 2.0. If a copy of the MPL
 * was not distributed with this file, You can obtain
 * one at http://mozilla.org/MPL/2.0/.
 */
@font-face {
  /* Heavy fonts have been removed */
  font-family: Symbola;
}
.mq-editable-field {
  display: -moz-inline-box;
  display: inline-block;
}
.mq-editable-field .mq-cursor {
  border-left: 1px solid black;
  margin-left: -1px;
  position: relative;
  z-index: 1;
  padding: 0;
  display: -moz-inline-box;
  display: inline-block;
}
.mq-editable-field .mq-cursor.mq-blink {
  visibility: hidden;
}
.mq-editable-field,
.mq-math-mode .mq-editable-field {
  border: 1px solid gray;
}
.mq-editable-field.mq-focused,
.mq-math-mode .mq-editable-field.mq-focused {
  -webkit-box-shadow: #8bd 0 0 1px 2px, inset #6ae 0 0 2px 0;
  -moz-box-shadow: #8bd 0 0 1px 2px, inset #6ae 0 0 2px 0;
  box-shadow: #8bd 0 0 1px 2px, inset #6ae 0 0 2px 0;
  border-color: #709AC0;
  border-radius: 1px;
}
.mq-math-mode .mq-editable-field {
  margin: 1px;
}
.mq-editable-field .mq-latex-command-input {
  color: inherit;
  font-family: "Courier New", monospace;
  border: 1px solid gray;
  padding-right: 1px;
  margin-right: 1px;
  margin-left: 2px;
}
.mq-editable-field .mq-latex-command-input.mq-empty {
  background: transparent;
}
.mq-editable-field .mq-latex-command-input.mq-hasCursor {
  border-color: ActiveBorder;
}
.mq-editable-field.mq-empty:after,
.mq-editable-field.mq-text-mode:after,
.mq-math-mode .mq-empty:after {
  visibility: hidden;
  content: 'c';
}
.mq-editable-field .mq-cursor:only-child:after,
.mq-editable-field .mq-textarea + .mq-cursor:last-child:after {
  visibility: hidden;
  content: 'c';
}
.mq-editable-field .mq-text-mode .mq-cursor:only-child:after {
  content: '';
}
.mq-editable-field.mq-text-mode {
  overflow-x: auto;
  overflow-y: hidden;
}
.mq-root-block,
.mq-math-mode .mq-root-block {
  display: -moz-inline-box;
  display: inline-block;
  width: 100%;
  padding: 2px;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  white-space: nowrap;
  overflow: hidden;
  vertical-align: middle;
}
.mq-math-mode {
  font-variant: normal;
  font-weight: normal;
  font-style: normal;
  font-size: 115%;
  line-height: 1;
  display: -moz-inline-box;
  display: inline-block;
}
.mq-math-mode .mq-non-leaf,
.mq-math-mode .mq-scaled {
  display: -moz-inline-box;
  display: inline-block;
}
.mq-math-mode var,
.mq-math-mode .mq-text-mode,
.mq-math-mode .mq-nonSymbola {
  font-family: "Times New Roman", Symbola, serif;
  line-height: 0.9;
}
.mq-math-mode * {
  font-size: inherit;
  line-height: inherit;
  margin: 0;
  padding: 0;
  border-color: black;
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;
  box-sizing: border-box;
}
.mq-math-mode .mq-empty {
  background: #ccc;
}
.mq-math-mode .mq-empty.mq-root-block {
  background: transparent;
}
.mq-math-mode.mq-empty {
  background: transparent;
}
.mq-math-mode .mq-text-mode {
  display: inline-block;
  white-space: pre;
}
.mq-math-mode .mq-text-mode.mq-hasCursor {
  box-shadow: inset darkgray 0 0.1em 0.2em;
  padding: 0 0.1em;
  margin: 0 -0.1em;
  min-width: 1ex;
}
.mq-math-mode .mq-font {
  font: 1em "Times New Roman", Symbola, serif;
}
.mq-math-mode .mq-font * {
  font-family: inherit;
  font-style: inherit;
}
.mq-math-mode b,
.mq-math-mode b.mq-font {
  font-weight: bolder;
}
.mq-math-mode var,
.mq-math-mode i,
.mq-math-mode i.mq-font {
  font-style: italic;
}
.mq-math-mode var.mq-f {
  margin-right: 0.2em;
  margin-left: 0.1em;
}
.mq-math-mode .mq-roman var.mq-f {
  margin: 0;
}
.mq-math-mode big {
  font-size: 200%;
}
.mq-math-mode .mq-int > big {
  display: inline-block;
  -webkit-transform: scaleX(0.7);
  -moz-transform: scaleX(0.7);
  -ms-transform: scaleX(0.7);
  -o-transform: scaleX(0.7);
  transform: scaleX(0.7);
  vertical-align: -0.16em;
}
.mq-math-mode .mq-int > .mq-supsub {
  font-size: 80%;
  vertical-align: -1.1em;
  padding-right: 0.2em;
}
.mq-math-mode .mq-int > .mq-supsub > .mq-sup > .mq-sup-inner {
  vertical-align: 1.3em;
}
.mq-math-mode .mq-int > .mq-supsub > .mq-sub {
  margin-left: -0.35em;
}
.mq-math-mode .mq-roman {
  font-style: normal;
}
.mq-math-mode .mq-sans-serif {
  font-family: sans-serif, Symbola, serif;
}
.mq-math-mode .mq-monospace {
  font-family: monospace, Symbola, serif;
}
.mq-math-mode .mq-overline {
  border-top: 1px solid black;
  margin-top: 1px;
}
.mq-math-mode .mq-underline {
  border-bottom: 1px solid black;
  margin-bottom: 1px;
}
.mq-math-mode .mq-binary-operator {
  padding: 0 0.2em;
  display: -moz-inline-box;
  display: inline-block;
}
.mq-math-mode .mq-supsub {
  text-align: left;
  font-size: 90%;
  vertical-align: -0.5em;
}
.mq-math-mode .mq-supsub.mq-sup-only {
  vertical-align: 0.5em;
}
.mq-math-mode .mq-supsub.mq-sup-only .mq-sup {
  display: inline-block;
  vertical-align: text-bottom;
}
.mq-math-mode .mq-supsub .mq-sup {
  display: block;
}
.mq-math-mode .mq-supsub .mq-sub {
  display: block;
  float: left;
}
.mq-math-mode .mq-supsub .mq-binary-operator {
  padding: 0 0.1em;
}
.mq-math-mode .mq-supsub .mq-fraction {
  font-size: 70%;
}
.mq-math-mode sup.mq-nthroot {
  font-size: 80%;
  vertical-align: 0.8em;
  margin-right: -0.6em;
  margin-left: 0.2em;
  min-width: 0.5em;
}
.mq-math-mode .mq-paren {
  padding: 0 0.1em;
  vertical-align: top;
  -webkit-transform-origin: center 0.06em;
  -moz-transform-origin: center 0.06em;
  -ms-transform-origin: center 0.06em;
  -o-transform-origin: center 0.06em;
  transform-origin: center 0.06em;
}
.mq-math-mode .mq-paren.mq-ghost {
  color: silver;
}
.mq-math-mode .mq-paren + span {
  margin-top: 0.1em;
  margin-bottom: 0.1em;
}
.mq-math-mode .mq-array {
  vertical-align: middle;
  text-align: center;
}
.mq-math-mode .mq-array > span {
  display: block;
}
.mq-math-mode .mq-operator-name {
  font-family: Symbola, "Times New Roman", serif;
  line-height: 0.9;
  font-style: normal;
}
.mq-math-mode var.mq-operator-name.mq-first {
  padding-left: 0.2em;
}
.mq-math-mode var.mq-operator-name.mq-last,
.mq-math-mode .mq-supsub.mq-after-operator-name {
  padding-right: 0.2em;
}
.mq-math-mode .mq-fraction {
  font-size: 90%;
  text-align: center;
  vertical-align: -0.4em;
  padding: 0 0.2em;
}
.mq-math-mode .mq-fraction,
.mq-math-mode .mq-large-operator,
.mq-math-mode x:-moz-any-link {
  display: -moz-groupbox;
}
.mq-math-mode .mq-fraction,
.mq-math-mode .mq-large-operator,
.mq-math-mode x:-moz-any-link,
.mq-math-mode x:default {
  display: inline-block;
}
.mq-math-mode .mq-numerator,
.mq-math-mode .mq-denominator,
.mq-math-mode .mq-dot-recurring {
  display: block;
}
.mq-math-mode .mq-numerator {
  padding: 0 0.1em;
}
.mq-math-mode .mq-denominator {
  border-top: 1px solid;
  float: right;
  width: 100%;
  padding: 0.1em;
}
.mq-math-mode .mq-dot-recurring {
  text-align: center;
  height: 0.3em;
}
.mq-math-mode .mq-sqrt-prefix {
  padding-top: 0;
  position: relative;
  top: 0.1em;
  vertical-align: top;
  -webkit-transform-origin: top;
  -moz-transform-origin: top;
  -ms-transform-origin: top;
  -o-transform-origin: top;
  transform-origin: top;
}
.mq-math-mode .mq-sqrt-stem {
  border-top: 1px solid;
  margin-top: 1px;
  padding-left: 0.15em;
  padding-right: 0.2em;
  margin-right: 0.1em;
  padding-top: 1px;
}
.mq-math-mode .mq-diacritic-above {
  display: block;
  text-align: center;
  line-height: 0.4em;
}
.mq-math-mode .mq-diacritic-stem {
  display: block;
  text-align: center;
}
.mq-math-mode .mq-hat-prefix {
  display: block;
  text-align: center;
  line-height: 0.95em;
  margin-bottom: -0.7em;
  transform: scaleX(1.5);
  -moz-transform: scaleX(1.5);
  -o-transform: scaleX(1.5);
  -webkit-transform: scaleX(1.5);
}
.mq-math-mode .mq-hat-stem {
  display: block;
}
.mq-math-mode .mq-large-operator {
  vertical-align: -0.2em;
  padding: 0.2em;
  text-align: center;
}
.mq-math-mode .mq-large-operator .mq-from,
.mq-math-mode .mq-large-operator big,
.mq-math-mode .mq-large-operator .mq-to {
  display: block;
}
.mq-math-mode .mq-large-operator .mq-from,
.mq-math-mode .mq-large-operator .mq-to {
  font-size: 80%;
}
.mq-math-mode .mq-large-operator .mq-from {
  float: right;
  /* take out of normal flow to manipulate baseline */
  width: 100%;
}
.mq-math-mode,
.mq-math-mode .mq-editable-field {
  cursor: text;
  font-family: Symbola, "Times New Roman", serif;
}
.mq-math-mode .mq-overarc {
  border-top: 1px solid black;
  -webkit-border-top-right-radius: 50% 0.3em;
  -moz-border-radius-topright: 50% 0.3em;
  border-top-right-radius: 50% 0.3em;
  -webkit-border-top-left-radius: 50% 0.3em;
  -moz-border-radius-topleft: 50% 0.3em;
  border-top-left-radius: 50% 0.3em;
  margin-top: 1px;
  padding-top: 0.15em;
}
.mq-math-mode .mq-overarrow {
  min-width: 0.5em;
  border-top: 1px solid black;
  margin-top: 1px;
  padding-top: 0.2em;
  text-align: center;
}
.mq-math-mode .mq-overarrow:before {
  display: block;
  position: relative;
  top: -0.34em;
  font-size: 0.5em;
  line-height: 0em;
  content: '\\27A4';
  text-align: right;
}
.mq-math-mode .mq-overarrow.mq-arrow-left:before {
  -moz-transform: scaleX(-1);
  -o-transform: scaleX(-1);
  -webkit-transform: scaleX(-1);
  transform: scaleX(-1);
  filter: FlipH;
  -ms-filter: "FlipH";
}
.mq-math-mode .mq-overarrow.mq-arrow-both {
  vertical-align: text-bottom;
}
.mq-math-mode .mq-overarrow.mq-arrow-both.mq-empty {
  min-height: 1.23em;
}
.mq-math-mode .mq-overarrow.mq-arrow-both.mq-empty:after {
  top: -0.34em;
}
.mq-math-mode .mq-overarrow.mq-arrow-both:before {
  -moz-transform: scaleX(-1);
  -o-transform: scaleX(-1);
  -webkit-transform: scaleX(-1);
  transform: scaleX(-1);
  filter: FlipH;
  -ms-filter: "FlipH";
}
.mq-math-mode .mq-overarrow.mq-arrow-both:after {
  display: block;
  position: relative;
  top: -2.3em;
  font-size: 0.5em;
  line-height: 0em;
  content: '\\27A4';
  visibility: visible;
  text-align: right;
}
.mq-math-mode .mq-selection,
.mq-editable-field .mq-selection,
.mq-math-mode .mq-selection .mq-non-leaf,
.mq-editable-field .mq-selection .mq-non-leaf,
.mq-math-mode .mq-selection .mq-scaled,
.mq-editable-field .mq-selection .mq-scaled {
  background: #B4D5FE !important;
  background: Highlight !important;
  color: HighlightText;
  border-color: HighlightText;
}
.mq-math-mode .mq-selection .mq-matrixed,
.mq-editable-field .mq-selection .mq-matrixed {
  background: #39F !important;
}
.mq-math-mode .mq-selection .mq-matrixed-container,
.mq-editable-field .mq-selection .mq-matrixed-container {
  filter: progid:DXImageTransform.Microsoft.Chroma(color='#3399FF') !important;
}
.mq-math-mode .mq-selection.mq-blur,
.mq-editable-field .mq-selection.mq-blur,
.mq-math-mode .mq-selection.mq-blur .mq-non-leaf,
.mq-editable-field .mq-selection.mq-blur .mq-non-leaf,
.mq-math-mode .mq-selection.mq-blur .mq-scaled,
.mq-editable-field .mq-selection.mq-blur .mq-scaled,
.mq-math-mode .mq-selection.mq-blur .mq-matrixed,
.mq-editable-field .mq-selection.mq-blur .mq-matrixed {
  background: #D4D4D4 !important;
  color: black;
  border-color: black;
}
.mq-math-mode .mq-selection.mq-blur .mq-matrixed-container,
.mq-editable-field .mq-selection.mq-blur .mq-matrixed-container {
  filter: progid:DXImageTransform.Microsoft.Chroma(color='#D4D4D4') !important;
}
.mq-editable-field .mq-textarea,
.mq-math-mode .mq-textarea {
  position: relative;
  -webkit-user-select: text;
  -moz-user-select: text;
  user-select: text;
}
.mq-editable-field .mq-textarea *,
.mq-math-mode .mq-textarea *,
.mq-editable-field .mq-selectable,
.mq-math-mode .mq-selectable {
  -webkit-user-select: text;
  -moz-user-select: text;
  user-select: text;
  position: absolute;
  clip: rect(1em 1em 1em 1em);
  -webkit-transform: scale(0);
  -moz-transform: scale(0);
  -ms-transform: scale(0);
  -o-transform: scale(0);
  transform: scale(0);
  resize: none;
  width: 1px;
  height: 1px;
  box-sizing: content-box;
}
.mq-math-mode .mq-matrixed {
  background: white;
  display: -moz-inline-box;
  display: inline-block;
}
.mq-math-mode .mq-matrixed-container {
  filter: progid:DXImageTransform.Microsoft.Chroma(color='white');
  margin-top: -0.1em;
}
`, ""]);
          const ht = dt;
        }, 645: (ot) => {
          ot.exports = function(yt) {
            var K = [];
            return K.toString = function() {
              return this.map(function(I) {
                var at = "", st = I[5] !== void 0;
                return I[4] && (at += "@supports (".concat(I[4], ") {")), I[2] && (at += "@media ".concat(I[2], " {")), st && (at += "@layer".concat(I[5].length > 0 ? " ".concat(I[5]) : "", " {")), at += yt(I), st && (at += "}"), I[2] && (at += "}"), I[4] && (at += "}"), at;
              }).join("");
            }, K.i = function(I, at, st, dt, ht) {
              typeof I == "string" && (I = [[null, I, void 0]]);
              var te = {};
              if (st)
                for (var Ht = 0; Ht < this.length; Ht++) {
                  var vt = this[Ht][0];
                  vt != null && (te[vt] = !0);
                }
              for (var Xt = 0; Xt < I.length; Xt++) {
                var ct = [].concat(I[Xt]);
                st && te[ct[0]] || (ht !== void 0 && (ct[5] === void 0 || (ct[1] = "@layer".concat(ct[5].length > 0 ? " ".concat(ct[5]) : "", " {").concat(ct[1], "}")), ct[5] = ht), at && (ct[2] && (ct[1] = "@media ".concat(ct[2], " {").concat(ct[1], "}")), ct[2] = at), dt && (ct[4] ? (ct[1] = "@supports (".concat(ct[4], ") {").concat(ct[1], "}"), ct[4] = dt) : ct[4] = "".concat(dt)), K.push(ct));
              }
            }, K;
          };
        }, 81: (ot) => {
          ot.exports = function(yt) {
            return yt[1];
          };
        }, 338: (ot, yt, K) => {
          var I = K(755);
          window.jQuery = I, function() {
            var at, st = window.jQuery, dt = "mathquill-command-id", ht = "mathquill-block-id", te = Math.min, Ht = Math.max;
            if (!st)
              throw "MathQuill requires jQuery 1.5.2+ to be loaded first";
            function vt() {
            }
            var Xt = [].slice;
            function ct(c) {
              var d = c.length - 1;
              return function() {
                var n = Xt.call(arguments, 0, d), r = Xt.call(arguments, d);
                return c.apply(this, n.concat([r]));
              };
            }
            var Gt = ct(function(c, d) {
              return ct(function(n, r) {
                if (c in n)
                  return n[c].apply(n, d.concat(r));
              });
            });
            function Jt(c) {
              return ct(function(d, n) {
                return typeof d != "function" && (d = Gt(d)), c.call(this, function(r) {
                  return d.apply(r, [r].concat(n));
                });
              });
            }
            function g(c) {
              var d = Xt.call(arguments, 1);
              return function() {
                return c.apply(this, d);
              };
            }
            function F(c, d) {
              if (!d)
                throw new Error("prayer failed: " + c);
            }
            var L = function(c, d, n) {
              function r(v) {
                return typeof v == "object";
              }
              function l(v) {
                return typeof v == "function";
              }
              function y() {
              }
              return function v(k, w) {
                function O() {
                  var z = new M();
                  return l(z.init) && z.init.apply(z, arguments), z;
                }
                function M() {
                }
                w === void 0 && (w = k, k = Object), O.Bare = M;
                var V, X = y.prototype = k.prototype, ut = M.prototype = O.prototype = O.p = new y();
                return ut.constructor = O, O.extend = function(z) {
                  return v(O, z);
                }, (O.open = function(z) {
                  if (V = {}, l(z) ? V = z.call(O, ut, X, O, k) : r(z) && (V = z), r(V))
                    for (var mt in V)
                      d.call(V, mt) && (ut[mt] = V[mt]);
                  return l(ut.init) || (ut.init = k), O;
                })(w);
              };
            }(0, {}.hasOwnProperty), f = -1;
            function U(c) {
              F("a direction was passed", c === f || c === 1);
            }
            var lt = L(st, function(c) {
              c.insDirOf = function(d, n) {
                return d === f ? this.insertBefore(n.first()) : this.insertAfter(n.last());
              }, c.insAtDirEnd = function(d, n) {
                return d === f ? this.prependTo(n) : this.appendTo(n);
              };
            }), At = L(function(c) {
              c.parent = 0, c[f] = 0, c[1] = 0, c.init = function(d, n, r) {
                this.parent = d, this[f] = n, this[1] = r;
              }, this.copy = function(d) {
                return At(d.parent, d[f], d[1]);
              };
            }), gt = L(function(c) {
              c[f] = 0, c[1] = 0, c.parent = 0;
              var d = 0;
              this.byId = {}, c.init = function() {
                this.id = d += 1, gt.byId[this.id] = this, this.ends = {}, this.ends[f] = 0, this.ends[1] = 0;
              }, c.dispose = function() {
                delete gt.byId[this.id];
              }, c.toString = function() {
                return "{{ MathQuill Node #" + this.id + " }}";
              }, c.jQ = lt(), c.jQadd = function(n) {
                return this.jQ = this.jQ.add(n);
              }, c.jQize = function(n) {
                function r(y) {
                  if (y.getAttribute) {
                    var v = y.getAttribute("mathquill-command-id"), k = y.getAttribute("mathquill-block-id");
                    v && gt.byId[v].jQadd(y), k && gt.byId[k].jQadd(y);
                  }
                  for (y = y.firstChild; y; y = y.nextSibling)
                    r(y);
                }
                n = lt(n || this.html());
                for (var l = 0; l < n.length; l += 1)
                  r(n[l]);
                return n;
              }, c.createDir = function(n, r) {
                U(n);
                var l = this;
                return l.jQize(), l.jQ.insDirOf(n, r.jQ), r[n] = l.adopt(r.parent, r[f], r[1]), l;
              }, c.createLeftOf = function(n) {
                return this.createDir(f, n);
              }, c.selectChildren = function(n, r) {
                return he(n, r);
              }, c.bubble = Jt(function(n) {
                for (var r = this; r && n(r) !== !1; r = r.parent)
                  ;
                return this;
              }), c.postOrder = Jt(function(n) {
                return function r(l) {
                  l.eachChild(r), n(l);
                }(this), this;
              }), c.isEmpty = function() {
                return this.ends[f] === 0 && this.ends[1] === 0;
              }, c.isStyleBlock = function() {
                return !1;
              }, c.children = function() {
                return a(this.ends[f], this.ends[1]);
              }, c.eachChild = function() {
                var n = this.children();
                return n.each.apply(n, arguments), this;
              }, c.foldChildren = function(n, r) {
                return this.children().fold(n, r);
              }, c.withDirAdopt = function(n, r, l, y) {
                return a(this, this).withDirAdopt(n, r, l, y), this;
              }, c.adopt = function(n, r, l) {
                return a(this, this).adopt(n, r, l), this;
              }, c.disown = function() {
                return a(this, this).disown(), this;
              }, c.remove = function() {
                return this.jQ.remove(), this.postOrder("dispose"), this.disown();
              };
            });
            function le(c, d, n) {
              F("a parent is always present", c), F("leftward is properly set up", d ? d[1] === n && d.parent === c : c.ends[f] === n), F("rightward is properly set up", n ? n[f] === d && n.parent === c : c.ends[1] === d);
            }
            var a = L(function(c) {
              c.init = function(d, n, r) {
                if (r === at && (r = f), U(r), F("no half-empty fragments", !d == !n), this.ends = {}, d) {
                  F("withDir is passed to Fragment", d instanceof gt), F("oppDir is passed to Fragment", n instanceof gt), F("withDir and oppDir have the same parent", d.parent === n.parent), this.ends[r] = d, this.ends[-r] = n;
                  var l = this.fold([], function(y, v) {
                    return y.push.apply(y, v.jQ.get()), y;
                  });
                  this.jQ = this.jQ.add(l);
                }
              }, c.jQ = lt(), c.withDirAdopt = function(d, n, r, l) {
                return d === f ? this.adopt(n, r, l) : this.adopt(n, l, r);
              }, c.adopt = function(d, n, r) {
                le(d, n, r);
                var l = this;
                l.disowned = !1;
                var y = l.ends[f];
                if (!y)
                  return this;
                var v = l.ends[1];
                return n || (d.ends[f] = y), r ? r[f] = v : d.ends[1] = v, l.ends[1][1] = r, l.each(function(k) {
                  k[f] = n, k.parent = d, n && (n[1] = k), n = k;
                }), l;
              }, c.disown = function() {
                var d = this, n = d.ends[f];
                if (!n || d.disowned)
                  return d;
                d.disowned = !0;
                var r = d.ends[1], l = n.parent;
                return le(l, n[f], n), le(l, r, r[1]), n[f] ? n[f][1] = r[1] : l.ends[f] = r[1], r[1] ? r[1][f] = n[f] : l.ends[1] = n[f], d;
              }, c.remove = function() {
                return this.jQ.remove(), this.each("postOrder", "dispose"), this.disown();
              }, c.each = Jt(function(d) {
                var n = this, r = n.ends[f];
                if (!r)
                  return n;
                for (; r !== n.ends[1][1] && d(r) !== !1; r = r[1])
                  ;
                return n;
              }), c.fold = function(d, n) {
                return this.each(function(r) {
                  d = n.call(this, d, r);
                }), d;
              };
            }), s = {}, xt = {}, Pt = L(At, function(c) {
              c.init = function(d, n) {
                this.parent = d, this.options = n;
                var r = this.jQ = this._jQ = lt('<span class="mq-cursor">&#8203;</span>');
                this.blink = function() {
                  r.toggleClass("mq-blink");
                }, this.upDownCache = {};
              }, c.show = function() {
                return this.jQ = this._jQ.removeClass("mq-blink"), "intervalId" in this ? clearInterval(this.intervalId) : (this[1] ? this.selection && this.selection.ends[f][f] === this[f] ? this.jQ.insertBefore(this.selection.jQ) : this.jQ.insertBefore(this[1].jQ.first()) : this.jQ.appendTo(this.parent.jQ), this.parent.focus()), this.intervalId = setInterval(this.blink, 500), this;
              }, c.hide = function() {
                return "intervalId" in this && clearInterval(this.intervalId), delete this.intervalId, this.jQ.detach(), this.jQ = lt(), this;
              }, c.withDirInsertAt = function(d, n, r, l) {
                var y = this.parent;
                this.parent = n, this[d] = r, this[-d] = l, y !== n && y.blur && y.blur(this);
              }, c.insDirOf = function(d, n) {
                return U(d), this.jQ.insDirOf(d, n.jQ), this.withDirInsertAt(d, n.parent, n[d], n), this.parent.jQ.addClass("mq-hasCursor"), this;
              }, c.insLeftOf = function(d) {
                return this.insDirOf(f, d);
              }, c.insRightOf = function(d) {
                return this.insDirOf(1, d);
              }, c.insAtDirEnd = function(d, n) {
                return U(d), this.jQ.insAtDirEnd(d, n.jQ), this.withDirInsertAt(d, n, 0, n.ends[d]), n.focus(), this;
              }, c.insAtLeftEnd = function(d) {
                return this.insAtDirEnd(f, d);
              }, c.insAtRightEnd = function(d) {
                return this.insAtDirEnd(1, d);
              }, c.jumpUpDown = function(d, n) {
                var r = this;
                r.upDownCache[d.id] = At.copy(r);
                var l = r.upDownCache[n.id];
                if (l)
                  l[1] ? r.insLeftOf(l[1]) : r.insAtRightEnd(l.parent);
                else {
                  var y = r.offset().left;
                  n.seek(y, r);
                }
              }, c.offset = function() {
                var d = this.jQ.removeClass("mq-cursor").offset();
                return this.jQ.addClass("mq-cursor"), d;
              }, c.unwrapGramp = function() {
                var d = this.parent.parent, n = d.parent, r = d[1], l = d[f];
                if (d.disown().eachChild(function(y) {
                  y.isEmpty() || (y.children().adopt(n, l, r).each(function(v) {
                    v.jQ.insertBefore(d.jQ.first());
                  }), l = y.ends[1]);
                }), !this[1])
                  if (this[f])
                    this[1] = this[f][1];
                  else
                    for (; !this[1]; ) {
                      if (this.parent = this.parent[1], !this.parent) {
                        this[1] = d[1], this.parent = n;
                        break;
                      }
                      this[1] = this.parent.ends[f];
                    }
                this[1] ? this.insLeftOf(this[1]) : this.insAtRightEnd(n), d.jQ.remove(), d[f].siblingDeleted && d[f].siblingDeleted(this.options, 1), d[1].siblingDeleted && d[1].siblingDeleted(this.options, f);
              }, c.startSelection = function() {
                for (var d = this.anticursor = At.copy(this), n = d.ancestors = {}, r = d; r.parent; r = r.parent)
                  n[r.parent.id] = r;
              }, c.endSelection = function() {
                delete this.anticursor;
              }, c.select = function() {
                var d = this.anticursor;
                if (this[f] === d[f] && this.parent === d.parent)
                  return !1;
                for (var n = this; n.parent; n = n.parent)
                  if (n.parent.id in d.ancestors) {
                    var r = n.parent;
                    break;
                  }
                F("cursor and anticursor in the same tree", r);
                var l, y, v = d.ancestors[r.id], k = 1;
                if (n[f] !== v) {
                  for (var w = n; w; w = w[1])
                    if (w[1] === v[1]) {
                      k = f, l = n, y = v;
                      break;
                    }
                }
                return k === 1 && (l = v, y = n), l instanceof At && (l = l[1]), y instanceof At && (y = y[f]), this.hide().selection = r.selectChildren(l, y), this.insDirOf(k, this.selection.ends[k]), this.selectionChanged(), !0;
              }, c.clearSelection = function() {
                return this.selection && (this.selection.clear(), delete this.selection, this.selectionChanged()), this;
              }, c.deleteSelection = function() {
                this.selection && (this[f] = this.selection.ends[f][f], this[1] = this.selection.ends[1][1], this.selection.remove(), this.selectionChanged(), delete this.selection);
              }, c.replaceSelection = function() {
                var d = this.selection;
                return d && (this[f] = d.ends[f][f], this[1] = d.ends[1][1], delete this.selection), d;
              }, c.depth = function() {
                for (var d = this, n = 0; d = d.parent; )
                  n += d instanceof Rt ? 1 : 0;
                return n;
              }, c.isTooDeep = function(d) {
                if (this.options.maxDepth !== at)
                  return this.depth() + (d || 0) > this.options.maxDepth;
              };
            }), he = L(a, function(c, d) {
              c.init = function() {
                d.init.apply(this, arguments), this.jQ = this.jQ.wrapAll('<span class="mq-selection"></span>').parent();
              }, c.adopt = function() {
                return this.jQ.replaceWith(this.jQ = this.jQ.children()), d.adopt.apply(this, arguments);
              }, c.clear = function() {
                return this.jQ.replaceWith(this.jQ[0].childNodes), this;
              }, c.join = function(n) {
                return this.fold("", function(r, l) {
                  return r + l[n]();
                });
              };
            }), It = L(function(c) {
              c.init = function(n, r, l) {
                this.id = n.id, this.data = {}, this.root = n, this.container = r, this.options = l, n.controller = this, this.cursor = n.cursor = Pt(n, l);
              }, c.handle = function(n, r) {
                var l = this.options.handlers;
                if (l && l.fns[n]) {
                  var y = l.APIClasses[this.KIND_OF_MQ](this);
                  r === f || r === 1 ? l.fns[n](r, y) : l.fns[n](y);
                }
              };
              var d = [];
              this.onNotify = function(n) {
                d.push(n);
              }, c.notify = function() {
                for (var n = 0; n < d.length; n += 1)
                  d[n].apply(this.cursor, arguments);
                return this;
              };
            }), Dt = {}, ee = L(), Ce = {}, Ae = L(), Re = {};
            function Ue() {
              window.console && console.warn(`You are using the MathQuill API without specifying an interface version, which will fail in v1.0.0. Easiest fix is to do the following before doing anything else:

    MathQuill = MathQuill.getInterface(1);
    // now MathQuill.MathField() works like it used to

See also the "\`dev\` branch (2014–2015) → v0.10.0 Migration Guide" at
  https://github.com/mathquill/mathquill/wiki/%60dev%60-branch-(2014%E2%80%932015)-%E2%86%92-v0.10.0-Migration-Guide`);
            }
            function ne(c) {
              return Ue(), un(c);
            }
            ne.prototype = Ae.p, ne.VERSION = "v0.11.0", ne.interfaceVersion = function(c) {
              if (c !== 1)
                throw "Only interface version 1 supported. You specified: " + c;
              return (Ue = function() {
                window.console && console.warn(`You called MathQuill.interfaceVersion(1); to specify the interface version, which will fail in v1.0.0. You can fix this easily by doing this before doing anything else:

    MathQuill = MathQuill.getInterface(1);
    // now MathQuill.MathField() works like it used to

See also the "\`dev\` branch (2014–2015) → v0.10.0 Migration Guide" at
  https://github.com/mathquill/mathquill/wiki/%60dev%60-branch-(2014%E2%80%932015)-%E2%86%92-v0.10.0-Migration-Guide`);
              })(), ne;
            }, ne.getInterface = je;
            var yn = je.MIN = 1, me = je.MAX = 2;
            function je(c) {
              if (!(yn <= c && c <= me))
                throw "Only interface versions between " + yn + " and " + me + " supported. You specified: " + c;
              function d(v) {
                if (!v || !v.nodeType)
                  return null;
                var k = lt(v).children(".mq-root-block").attr(ht), w = k && gt.byId[k].controller;
                return w ? n[w.KIND_OF_MQ](w) : null;
              }
              var n = {};
              function r(v, k) {
                for (var w in k && k.handlers && (k.handlers = { fns: k.handlers, APIClasses: n }), k)
                  if (k.hasOwnProperty(w)) {
                    var O = k[w], M = Ce[w];
                    v[w] = M ? M(O) : O;
                  }
              }
              d.L = f, d.R = 1, d.saneKeyboardEvents = on, d.config = function(v) {
                return r(ee.p, v), this;
              }, d.registerEmbed = function(v, k) {
                if (!/^[a-z][a-z0-9]*$/i.test(v))
                  throw "Embed name must start with letter and be only letters and digits";
                Re[v] = k;
              };
              var l = n.AbstractMathQuill = L(Ae, function(v) {
                v.init = function(k) {
                  this.__controller = k, this.__options = k.options, this.id = k.id, this.data = k.data;
                }, v.__mathquillify = function(k) {
                  var w = this.__controller, O = w.root, M = w.container;
                  w.createTextarea();
                  var V = M.addClass(k).contents().detach();
                  O.jQ = lt('<span class="mq-root-block"/>').attr(ht, O.id).appendTo(M), this.latex(V.text()), this.revert = function() {
                    return M.empty().unbind(".mathquill").removeClass("mq-editable-field mq-math-mode mq-text-mode").append(V);
                  };
                }, v.config = function(k) {
                  return r(this.__options, k), this;
                }, v.el = function() {
                  return this.__controller.container[0];
                }, v.text = function() {
                  return this.__controller.exportText();
                }, v.latex = function(k) {
                  return arguments.length > 0 ? (this.__controller.renderLatexMath(k), this.__controller.blurred && this.__controller.cursor.hide().parent.blur(), this) : this.__controller.exportLatex();
                }, v.html = function() {
                  return this.__controller.root.jQ.html().replace(/ mathquill-(?:command|block)-id="?\d+"?/g, "").replace(/<span class="?mq-cursor( mq-blink)?"?>.?<\/span>/i, "").replace(/ mq-hasCursor|mq-hasCursor ?/, "").replace(/ class=(""|(?= |>))/g, "");
                }, v.reflow = function() {
                  return this.__controller.root.postOrder("reflow"), this;
                };
              });
              for (var y in d.prototype = l.prototype, n.EditableField = L(l, function(v, k) {
                v.__mathquillify = function() {
                  return k.__mathquillify.apply(this, arguments), this.__controller.editable = !0, this.__controller.delegateMouseEvents(), this.__controller.editablesTextareaEvents(), this;
                }, v.focus = function() {
                  return this.__controller.textarea.focus(), this;
                }, v.blur = function() {
                  return this.__controller.textarea.blur(), this;
                }, v.write = function(w) {
                  return this.__controller.writeLatex(w), this.__controller.scrollHoriz(), this.__controller.blurred && this.__controller.cursor.hide().parent.blur(), this;
                }, v.empty = function() {
                  var w = this.__controller.root, O = this.__controller.cursor;
                  return w.eachChild("postOrder", "dispose"), w.ends[f] = w.ends[1] = 0, w.jQ.empty(), delete O.selection, O.insAtRightEnd(w), this;
                }, v.cmd = function(w) {
                  var O = this.__controller.notify(), M = O.cursor;
                  if (/^\\[a-z]+$/i.test(w) && !M.isTooDeep()) {
                    w = w.slice(1);
                    var V = s[w];
                    V && (w = V(w), M.selection && w.replaces(M.replaceSelection()), w.createLeftOf(M.show()), this.__controller.scrollHoriz());
                  } else
                    M.parent.write(M, w);
                  return O.blurred && M.hide().parent.blur(), this;
                }, v.select = function() {
                  var w = this.__controller;
                  for (w.notify("move").cursor.insAtRightEnd(w.root); w.cursor[f]; )
                    w.selectLeft();
                  return this;
                }, v.clearSelection = function() {
                  return this.__controller.cursor.clearSelection(), this;
                }, v.moveToDirEnd = function(w) {
                  return this.__controller.notify("move").cursor.insAtDirEnd(w, this.__controller.root), this;
                }, v.moveToLeftEnd = function() {
                  return this.moveToDirEnd(f);
                }, v.moveToRightEnd = function() {
                  return this.moveToDirEnd(1);
                }, v.keystroke = function(w) {
                  w = w.replace(/^\s+|\s+$/g, "").split(/\s+/);
                  for (var O = 0; O < w.length; O += 1)
                    this.__controller.keystroke(w[O], { preventDefault: vt });
                  return this;
                }, v.typedText = function(w) {
                  for (var O = 0; O < w.length; O += 1)
                    this.__controller.typedText(w.charAt(O));
                  return this;
                }, v.dropEmbedded = function(w, O, M) {
                  var V = w - lt(window).scrollLeft(), X = O - lt(window).scrollTop(), ut = document.elementFromPoint(V, X);
                  this.__controller.seek(lt(ut), w, O), An().setOptions(M).createLeftOf(this.__controller.cursor);
                }, v.clickAt = function(w, O, M) {
                  M = M || document.elementFromPoint(w, O);
                  var V = this.__controller, X = V.root;
                  return st.contains(X.jQ[0], M) || (M = X.jQ[0]), V.seek(lt(M), w + pageXOffset, O + pageYOffset), V.blurred && this.focus(), this;
                }, v.ignoreNextMousedown = function(w) {
                  return this.__controller.cursor.options.ignoreNextMousedown = w, this;
                };
              }), d.EditableField = function() {
                throw "wtf don't call me, I'm 'abstract'";
              }, d.EditableField.prototype = n.EditableField.prototype, Dt)
                (function(v, k) {
                  var w = n[v] = k(n);
                  d[v] = function(O, M) {
                    var V = d(O);
                    if (V instanceof w || !O || !O.nodeType)
                      return V;
                    var X = It(w.RootBlock(), lt(O), ee());
                    return X.KIND_OF_MQ = v, w(X).__mathquillify(M, c);
                  }, d[v].prototype = w.prototype;
                })(y, Dt[y]);
              return d;
            }
            ne.noConflict = function() {
              return window.MathQuill = rn, ne;
            };
            var rn = window.MathQuill;
            function gn(c) {
              for (var d = "moveOutOf deleteOutOf selectOutOf upOutOf downOutOf".split(" "), n = 0; n < d.length; n += 1)
                (function(r) {
                  c[r] = function(l) {
                    this.controller.handle(r, l);
                  };
                })(d[n]);
              c.reflow = function() {
                this.controller.handle("reflow"), this.controller.handle("edited"), this.controller.handle("edit");
              };
            }
            window.MathQuill = ne;
            var Sn, on = (Sn = { 8: "Backspace", 9: "Tab", 10: "Enter", 13: "Enter", 16: "Shift", 17: "Control", 18: "Alt", 20: "CapsLock", 27: "Esc", 32: "Spacebar", 33: "PageUp", 34: "PageDown", 35: "End", 36: "Home", 37: "Left", 38: "Up", 39: "Right", 40: "Down", 45: "Insert", 46: "Del", 144: "NumLock" }, function(c, d) {
              var n, r = null, l = null, y = st(c), v = st(d.container || y), k = vt;
              function w(z) {
                k = z, clearTimeout(n), n = setTimeout(z);
              }
              function O(z) {
                w(function(mt) {
                  k = vt, clearTimeout(n), z(mt);
                });
              }
              v.bind("keydown keypress input keyup focusout paste", function(z) {
                k(z);
              });
              var M = !1;
              function V() {
                d.keystroke(function(z) {
                  var mt, rt = z.which || z.keyCode, Ct = Sn[rt], Kt = [];
                  return z.ctrlKey && Kt.push("Ctrl"), z.originalEvent && z.originalEvent.metaKey && Kt.push("Meta"), z.altKey && Kt.push("Alt"), z.shiftKey && Kt.push("Shift"), mt = Ct || String.fromCharCode(rt), Kt.length || Ct ? (Kt.push(mt), Kt.join("-")) : mt;
                }(r), r);
              }
              function X() {
                if (!("selectionStart" in (z = y[0])) || z.selectionStart === z.selectionEnd) {
                  var z, mt = y.val();
                  mt.length === 1 ? (y.val(""), d.typedText(mt)) : mt && y[0].select && y[0].select();
                }
              }
              function ut() {
                var z = y.val();
                y.val(""), z && d.paste(z);
              }
              return v.bind({ keydown: function(z) {
                r = z, l = null, M && O(function(mt) {
                  mt && mt.type === "focusout" || !y[0].select || y[0].select();
                }), V();
              }, keypress: function(z) {
                r && l && V(), l = z, w(X);
              }, keyup: function(z) {
                r && !l && w(X);
              }, focusout: function() {
                r = l = null;
              }, cut: function() {
                O(function() {
                  d.cut();
                });
              }, copy: function() {
                O(function() {
                  d.copy();
                });
              }, paste: function(z) {
                y.focus(), w(ut);
              } }), { select: function(z) {
                k(), k = vt, clearTimeout(n), y.val(z), z && y[0].select && y[0].select(), M = !!z;
              } };
            }), J = L(function(c, d, n) {
              function r(k, w) {
                throw "Parse Error: " + w + " at " + (k ? "'" + k + "'" : "EOF");
              }
              c.init = function(k) {
                this._ = k;
              }, c.parse = function(k) {
                return this.skip(v)._("" + k, function(w, O) {
                  return O;
                }, r);
              }, c.or = function(k) {
                F("or is passed a parser", k instanceof n);
                var w = this;
                return n(function(O, M, V) {
                  return w._(O, M, function(X) {
                    return k._(O, M, V);
                  });
                });
              }, c.then = function(k) {
                var w = this;
                return n(function(O, M, V) {
                  return w._(O, function(X, ut) {
                    var z = k instanceof n ? k : k(ut);
                    return F("a parser is returned", z instanceof n), z._(X, M, V);
                  }, V);
                });
              }, c.many = function() {
                var k = this;
                return n(function(w, O, M) {
                  for (var V = []; k._(w, X, ut); )
                    ;
                  return O(w, V);
                  function X(z, mt) {
                    return w = z, V.push(mt), !0;
                  }
                  function ut() {
                    return !1;
                  }
                });
              }, c.times = function(k, w) {
                arguments.length < 2 && (w = k);
                var O = this;
                return n(function(M, V, X) {
                  for (var ut, z = [], mt = !0, rt = 0; rt < k; rt += 1)
                    if (!(mt = O._(M, Ct, Kt)))
                      return X(M, ut);
                  for (; rt < w && mt; rt += 1)
                    mt = O._(M, Ct, Kn);
                  return V(M, z);
                  function Ct(pn, Xe) {
                    return z.push(Xe), M = pn, !0;
                  }
                  function Kt(pn, Xe) {
                    return ut = Xe, M = pn, !1;
                  }
                  function Kn(pn, Xe) {
                    return !1;
                  }
                });
              }, c.result = function(k) {
                return this.then(y(k));
              }, c.atMost = function(k) {
                return this.times(0, k);
              }, c.atLeast = function(k) {
                var w = this;
                return w.times(k).then(function(O) {
                  return w.many().map(function(M) {
                    return O.concat(M);
                  });
                });
              }, c.map = function(k) {
                return this.then(function(w) {
                  return y(k(w));
                });
              }, c.skip = function(k) {
                return this.then(function(w) {
                  return k.result(w);
                });
              }, this.string = function(k) {
                var w = k.length, O = "expected '" + k + "'";
                return n(function(M, V, X) {
                  var ut = M.slice(0, w);
                  return ut === k ? V(M.slice(w), ut) : X(M, O);
                });
              };
              var l = this.regex = function(k) {
                F("regexp parser is anchored", k.toString().charAt(1) === "^");
                var w = "expected " + k;
                return n(function(O, M, V) {
                  var X = k.exec(O);
                  if (X) {
                    var ut = X[0];
                    return M(O.slice(ut.length), ut);
                  }
                  return V(O, w);
                });
              }, y = n.succeed = function(k) {
                return n(function(w, O) {
                  return O(w, k);
                });
              }, v = (n.fail = function(k) {
                return n(function(w, O, M) {
                  return M(w, k);
                });
              }, n.letter = l(/^[a-z]/i), n.letters = l(/^[a-z]*/i), n.digit = l(/^[0-9]/), n.digits = l(/^[0-9]*/), n.whitespace = l(/^\s+/), n.optWhitespace = l(/^\s*/), n.any = n(function(k, w, O) {
                return k ? w(k.slice(1), k.charAt(0)) : O(k, "expected any character");
              }), n.all = n(function(k, w, O) {
                return w("", k);
              }), n.eof = n(function(k, w, O) {
                return k ? O(k, "expected EOF") : w(k, k);
              }));
            });
            It.open(function(c) {
              c.focusBlurEvents = function() {
                var d, n = this, r = n.root, l = n.cursor;
                function y() {
                  clearTimeout(d), l.selection && l.selection.jQ.addClass("mq-blur"), v();
                }
                function v() {
                  l.hide().parent.blur(), n.container.removeClass("mq-focused"), lt(window).unbind("blur", y);
                }
                n.textarea.focus(function() {
                  n.blurred = !1, clearTimeout(d), n.container.addClass("mq-focused"), l.parent || l.insAtRightEnd(r), l.selection ? (l.selection.jQ.removeClass("mq-blur"), n.selectionChanged()) : l.show();
                }).blur(function() {
                  n.blurred = !0, d = setTimeout(function() {
                    r.postOrder("intentionalBlur"), l.clearSelection().endSelection(), v();
                  }), lt(window).bind("blur", y);
                }), n.blurred = !0, l.hide().parent.blur();
              };
            }), It.open(function(c, d) {
              c.exportText = function() {
                return this.root.foldChildren("", function(n, r) {
                  return n + r.text();
                });
              };
            }), It.open(function(c) {
              ee.p.ignoreNextMousedown = vt, c.delegateMouseEvents = function() {
                var d = this.root.jQ;
                this.container.bind("mousedown.mathquill", function(n) {
                  var r, l = lt(n.target).closest(".mq-root-block"), y = gt.byId[l.attr(ht) || d.attr(ht)].controller, v = y.cursor, k = v.blink, w = y.textareaSpan, O = y.textarea;
                  function M(X) {
                    r = lt(X.target);
                  }
                  function V(X) {
                    v.anticursor || v.startSelection(), y.seek(r, X.pageX, X.pageY).cursor.select(), r = at;
                  }
                  n.preventDefault(), n.target.unselectable = !0, v.options.ignoreNextMousedown(n) || (v.options.ignoreNextMousedown = vt, y.blurred && (y.editable || l.prepend(w), O.focus()), v.blink = vt, y.seek(lt(n.target), n.pageX, n.pageY).cursor.startSelection(), l.mousemove(M), lt(n.target.ownerDocument).mousemove(V).mouseup(function X(ut) {
                    v.blink = k, v.selection || (y.editable ? v.show() : w.detach()), l.unbind("mousemove", M), lt(ut.target.ownerDocument).unbind("mousemove", V).unbind("mouseup", X);
                  }));
                });
              };
            }), It.open(function(c) {
              c.seek = function(d, n, r) {
                var l = this.notify("select").cursor;
                if (d) {
                  var y = d.attr(ht) || d.attr(dt);
                  if (!y) {
                    var v = d.parent();
                    y = v.attr(ht) || v.attr(dt);
                  }
                }
                var k = y ? gt.byId[y] : this.root;
                return F("nodeId is the id of some Node that exists", k), l.clearSelection().show(), k.seek(n, l), this.scrollHoriz(), this;
              };
            }), It.open(function(c) {
              c.keystroke = function(d, n) {
                this.cursor.parent.keystroke(d, n, this);
              };
            }), gt.open(function(c) {
              c.keystroke = function(d, n, r) {
                var l = r.cursor;
                switch (d) {
                  case "Ctrl-Shift-Backspace":
                  case "Ctrl-Backspace":
                    r.ctrlDeleteDir(f);
                    break;
                  case "Shift-Backspace":
                  case "Backspace":
                    r.backspace();
                    break;
                  case "Esc":
                  case "Tab":
                    return void r.escapeDir(1, d, n);
                  case "Shift-Tab":
                  case "Shift-Esc":
                    return void r.escapeDir(f, d, n);
                  case "End":
                    r.notify("move").cursor.insAtRightEnd(l.parent);
                    break;
                  case "Ctrl-End":
                    r.notify("move").cursor.insAtRightEnd(r.root);
                    break;
                  case "Shift-End":
                    for (; l[1]; )
                      r.selectRight();
                    break;
                  case "Ctrl-Shift-End":
                    for (; l[1] || l.parent !== r.root; )
                      r.selectRight();
                    break;
                  case "Home":
                    r.notify("move").cursor.insAtLeftEnd(l.parent);
                    break;
                  case "Ctrl-Home":
                    r.notify("move").cursor.insAtLeftEnd(r.root);
                    break;
                  case "Shift-Home":
                    for (; l[f]; )
                      r.selectLeft();
                    break;
                  case "Ctrl-Shift-Home":
                    for (; l[f] || l.parent !== r.root; )
                      r.selectLeft();
                    break;
                  case "Left":
                    r.moveLeft();
                    break;
                  case "Shift-Left":
                    r.selectLeft();
                    break;
                  case "Ctrl-Left":
                    break;
                  case "Right":
                    r.moveRight();
                    break;
                  case "Shift-Right":
                    r.selectRight();
                    break;
                  case "Ctrl-Right":
                    break;
                  case "Up":
                    r.moveUp();
                    break;
                  case "Down":
                    r.moveDown();
                    break;
                  case "Shift-Up":
                    if (l[f])
                      for (; l[f]; )
                        r.selectLeft();
                    else
                      r.selectLeft();
                  case "Shift-Down":
                    if (l[1])
                      for (; l[1]; )
                        r.selectRight();
                    else
                      r.selectRight();
                  case "Ctrl-Up":
                  case "Ctrl-Down":
                    break;
                  case "Ctrl-Shift-Del":
                  case "Ctrl-Del":
                    r.ctrlDeleteDir(1);
                    break;
                  case "Shift-Del":
                  case "Del":
                    r.deleteForward();
                    break;
                  case "Meta-A":
                  case "Ctrl-A":
                    for (r.notify("move").cursor.insAtRightEnd(r.root); l[f]; )
                      r.selectLeft();
                    break;
                  default:
                    return;
                }
                n.preventDefault(), r.scrollHoriz();
              }, c.moveOutOf = c.moveTowards = c.deleteOutOf = c.deleteTowards = c.unselectInto = c.selectOutOf = c.selectTowards = function() {
                F("overridden or never called on this node");
              };
            }), It.open(function(c) {
              function d(n, r) {
                var l = n.notify("upDown").cursor, y = r + "Into", v = r + "OutOf";
                return l[1][y] ? l.insAtLeftEnd(l[1][y]) : l[f][y] ? l.insAtRightEnd(l[f][y]) : l.parent.bubble(function(k) {
                  var w = k[v];
                  if (w && (typeof w == "function" && (w = k[v](l)), w instanceof gt && l.jumpUpDown(k, w), w !== !0))
                    return !1;
                }), n;
              }
              this.onNotify(function(n) {
                n !== "move" && n !== "upDown" || this.show().clearSelection();
              }), c.escapeDir = function(n, r, l) {
                U(n);
                var y = this.cursor;
                if (y.parent !== this.root && l.preventDefault(), y.parent !== this.root)
                  return y.parent.moveOutOf(n, y), this.notify("move");
              }, Ce.leftRightIntoCmdGoes = function(n) {
                if (n && n !== "up" && n !== "down")
                  throw '"up" or "down" required for leftRightIntoCmdGoes option, got "' + n + '"';
                return n;
              }, c.moveDir = function(n) {
                U(n);
                var r = this.cursor, l = r.options.leftRightIntoCmdGoes;
                return r.selection ? r.insDirOf(n, r.selection.ends[n]) : r[n] ? r[n].moveTowards(n, r, l) : r.parent.moveOutOf(n, r, l), this.notify("move");
              }, c.moveLeft = function() {
                return this.moveDir(f);
              }, c.moveRight = function() {
                return this.moveDir(1);
              }, c.moveUp = function() {
                return d(this, "up");
              }, c.moveDown = function() {
                return d(this, "down");
              }, this.onNotify(function(n) {
                n !== "upDown" && (this.upDownCache = {});
              }), this.onNotify(function(n) {
                n === "edit" && this.show().deleteSelection();
              }), c.deleteDir = function(n) {
                U(n);
                var r = this.cursor, l = r.selection;
                return this.notify("edit"), l || (r[n] ? r[n].deleteTowards(n, r) : r.parent.deleteOutOf(n, r)), r[f].siblingDeleted && r[f].siblingDeleted(r.options, 1), r[1].siblingDeleted && r[1].siblingDeleted(r.options, f), r.parent.bubble("reflow"), this;
              }, c.ctrlDeleteDir = function(n) {
                U(n);
                var r = this.cursor;
                return !r[n] || r.selection ? this.deleteDir(n) : (this.notify("edit"), n === f ? a(r.parent.ends[f], r[f]).remove() : a(r[1], r.parent.ends[1]).remove(), r.insAtDirEnd(n, r.parent), r[f].siblingDeleted && r[f].siblingDeleted(r.options, 1), r[1].siblingDeleted && r[1].siblingDeleted(r.options, f), r.parent.bubble("reflow"), this);
              }, c.backspace = function() {
                return this.deleteDir(f);
              }, c.deleteForward = function() {
                return this.deleteDir(1);
              }, this.onNotify(function(n) {
                n !== "select" && this.endSelection();
              }), c.selectDir = function(n) {
                var r = this.notify("select").cursor, l = r.selection;
                U(n), r.anticursor || r.startSelection();
                var y = r[n];
                y ? l && l.ends[n] === y && r.anticursor[-n] !== y ? y.unselectInto(n, r) : y.selectTowards(n, r) : r.parent.selectOutOf(n, r), r.clearSelection(), r.select() || r.show();
              }, c.selectLeft = function() {
                return this.selectDir(f);
              }, c.selectRight = function() {
                return this.selectDir(1);
              };
            }), It.open(function(c) {
              ee.p.substituteTextarea = function() {
                return lt("<textarea autocapitalize=off autocomplete=off autocorrect=off spellcheck=false x-palm-disable-ste-all=true />")[0];
              }, c.createTextarea = function() {
                var d = this.textareaSpan = lt('<span class="mq-textarea"></span>'), n = this.options.substituteTextarea();
                if (!n.nodeType)
                  throw "substituteTextarea() must return a DOM element, got " + n;
                n = this.textarea = lt(n).appendTo(d);
                var r = this;
                r.cursor.selectionChanged = function() {
                  r.selectionChanged();
                };
              }, c.selectionChanged = function() {
                var d = this;
                Pe(d.container[0]), d.textareaSelectionTimeout === at && (d.textareaSelectionTimeout = setTimeout(function() {
                  d.setTextareaSelection();
                }));
              }, c.setTextareaSelection = function() {
                this.textareaSelectionTimeout = at;
                var d = "";
                this.cursor.selection && (d = this.cursor.selection.join("latex"), this.options.statelessClipboard && (d = "$" + d + "$")), this.selectFn(d);
              }, c.staticMathTextareaEvents = function() {
                var d = this, n = (d.root, d.cursor), r = d.textarea, l = d.textareaSpan;
                function y() {
                  l.detach(), d.blurred = !0;
                }
                this.container.prepend(st('<span class="mq-selectable">').text("$" + d.exportLatex() + "$")), d.blurred = !0, r.bind("cut paste", !1).bind("copy", function() {
                  d.setTextareaSelection();
                }).focus(function() {
                  d.blurred = !1;
                }).blur(function() {
                  n.selection && n.selection.clear(), setTimeout(y);
                }), d.selectFn = function(v) {
                  r.val(v), v && r.select();
                };
              }, ee.p.substituteKeyboardEvents = on, c.editablesTextareaEvents = function() {
                var d = this.textarea, n = this.textareaSpan, r = this.options.substituteKeyboardEvents(d, this);
                this.selectFn = function(l) {
                  r.select(l);
                }, this.container.prepend(n), this.focusBlurEvents();
              }, c.typedText = function(d) {
                if (d === `
`)
                  return this.handle("enter");
                var n = this.notify().cursor;
                n.parent.write(n, d), this.scrollHoriz();
              }, c.cut = function() {
                var d = this, n = d.cursor;
                n.selection && setTimeout(function() {
                  d.notify("edit"), n.parent.bubble("reflow");
                });
              }, c.copy = function() {
                this.setTextareaSelection();
              }, c.paste = function(d) {
                this.options.statelessClipboard && (d = d.slice(0, 1) === "$" && d.slice(-1) === "$" ? d.slice(1, -1) : "\\text{" + d + "}"), this.writeLatex(d).cursor.show();
              };
            });
            var Qt = function() {
              function c(rt) {
                for (var Ct = rt[0] || Rt(), Kt = 1; Kt < rt.length; Kt += 1)
                  rt[Kt].children().adopt(Ct, Ct.ends[1], 0);
                return Ct;
              }
              var d = J.string, n = J.regex, r = J.letter, l = J.any, y = J.optWhitespace, v = J.succeed, k = J.fail, w = r.map(function(rt) {
                return Zt(rt);
              }), O = n(/^[^${}\\_^]/).map(function(rt) {
                return q(rt);
              }), M = n(/^[^\\a-eg-zA-Z]/).or(d("\\").then(n(/^[a-z]+/i).or(n(/^\s+/).result(" ")).or(l))).then(function(rt) {
                var Ct = s[rt];
                return Ct ? Ct(rt).parser() : k("unknown command: \\" + rt);
              }).or(w).or(O), V = d("{").then(function() {
                return ut;
              }).skip(d("}")), X = y.then(V.or(M.map(function(rt) {
                var Ct = Rt();
                return rt.adopt(Ct, 0, 0), Ct;
              }))), ut = X.many().map(c).skip(y), z = d("[").then(X.then(function(rt) {
                return rt.join("latex") !== "]" ? v(rt) : k();
              }).many().map(c).skip(y)).skip(d("]")), mt = ut;
              return mt.block = X, mt.optBlock = z, mt;
            }();
            It.open(function(c, d) {
              c.exportLatex = function() {
                return this.root.latex().replace(/(\\[a-z]+) (?![a-z])/gi, "$1");
              }, Ce.maxDepth = function(n) {
                return typeof n == "number" ? n : at;
              }, c.writeLatex = function(n) {
                var r = this.notify("edit").cursor, l = J.all, y = J.eof, v = Qt.skip(y).or(l.result(!1)).parse(n);
                return v && !v.isEmpty() && v.prepareInsertionAt(r) && (v.children().adopt(r.parent, r[f], r[1]), v.jQize().insertBefore(r.jQ), r[f] = v.ends[1], v.finalizeInsert(r.options, r), v.ends[1][1].siblingCreated && v.ends[1][1].siblingCreated(r.options, f), v.ends[f][f].siblingCreated && v.ends[f][f].siblingCreated(r.options, 1), r.parent.bubble("reflow")), this;
              }, c.renderLatexMath = function(n) {
                var r = this.root, l = this.cursor, y = (l.options, r.jQ), v = J.all, k = J.eof, w = Qt.skip(k).or(v.result(!1)).parse(n);
                if (r.eachChild("postOrder", "dispose"), r.ends[f] = r.ends[1] = 0, w && w.prepareInsertionAt(l)) {
                  w.children().adopt(r, 0, 0);
                  var O = w.join("html");
                  y.html(O), r.jQize(y.children()), r.finalizeInsert(l.options);
                } else
                  y.empty();
                delete l.selection, l.insAtRightEnd(r);
              }, c.renderLatexText = function(n) {
                var r = this.root, l = this.cursor;
                r.jQ.children().slice(1).remove(), r.eachChild("postOrder", "dispose"), r.ends[f] = r.ends[1] = 0, delete l.selection, l.show().insAtRightEnd(r);
                var y = J.regex, v = J.string, k = J.eof, w = J.all, O = v("$").then(Qt).skip(v("$").or(k)).map(function(ut) {
                  var z = bn(l);
                  z.createBlocks();
                  var mt = z.ends[f];
                  return ut.children().adopt(mt, 0, 0), z;
                }), M = v("\\$").result("$").or(y(/^[^$]/)).map(q), V = O.or(M).many().skip(k).or(w.result(!1)).parse(n);
                if (V) {
                  for (var X = 0; X < V.length; X += 1)
                    V[X].adopt(r, r.ends[1], 0);
                  r.jQize().appendTo(r.jQ), r.finalizeInsert(l.options);
                }
              };
            }), It.open(function(c) {
              c.scrollHoriz = function() {
                var d = this.cursor, n = d.selection, r = this.root.jQ[0].getBoundingClientRect();
                if (n) {
                  var l = n.jQ[0].getBoundingClientRect(), y = l.left - (r.left + 20), v = l.right - (r.right - 20);
                  if (n.ends[f] === d[1])
                    if (y < 0)
                      w = y;
                    else {
                      if (!(v > 0))
                        return;
                      w = l.left - v < r.left + 20 ? y : v;
                    }
                  else if (v > 0)
                    w = v;
                  else {
                    if (!(y < 0))
                      return;
                    w = l.right - y > r.right - 20 ? v : y;
                  }
                } else {
                  var k = d.jQ[0].getBoundingClientRect().left;
                  if (k > r.right - 20)
                    var w = k - (r.right - 20);
                  else {
                    if (!(k < r.left + 20))
                      return;
                    w = k - (r.left + 20);
                  }
                }
                this.root.jQ.stop().animate({ scrollLeft: "+=" + w }, 100);
              };
            });
            var En = L(gt, function(c, d) {
              c.finalizeInsert = function(n, r) {
                var l = this;
                l.postOrder("finalizeTree", n), l.postOrder("contactWeld", r), l.postOrder("blur"), l.postOrder("reflow"), l[1].siblingCreated && l[1].siblingCreated(n, f), l[f].siblingCreated && l[f].siblingCreated(n, 1), l.bubble("reflow");
              }, c.prepareInsertionAt = function(n) {
                var r = n.options.maxDepth;
                if (r !== at) {
                  var l = n.depth();
                  if (l > r)
                    return !1;
                  this.removeNodesDeeperThan(r - l);
                }
                return !0;
              }, c.removeNodesDeeperThan = function(n) {
                for (var r, l = 0, y = [[this, l]]; y.length; )
                  (r = y.shift())[0].children().each(function(v) {
                    var k = v instanceof Rt ? 1 : 0;
                    (l = r[1] + k) <= n ? y.push([v, l]) : (k ? v.children() : v).remove();
                  });
              };
            }), jt = L(En, function(c, d) {
              c.init = function(n, r, l) {
                var y = this;
                d.init.call(y), y.ctrlSeq || (y.ctrlSeq = n), r && (y.htmlTemplate = r), l && (y.textTemplate = l);
              }, c.replaces = function(n) {
                n.disown(), this.replacedFragment = n;
              }, c.isEmpty = function() {
                return this.foldChildren(!0, function(n, r) {
                  return n && r.isEmpty();
                });
              }, c.parser = function() {
                var n = Qt.block, r = this;
                return n.times(r.numBlocks()).map(function(l) {
                  r.blocks = l;
                  for (var y = 0; y < l.length; y += 1)
                    l[y].adopt(r, r.ends[1], 0);
                  return r;
                });
              }, c.createLeftOf = function(n) {
                var r = this, l = r.replacedFragment;
                r.createBlocks(), d.createLeftOf.call(r, n), l && (l.adopt(r.ends[f], 0, 0), l.jQ.appendTo(r.ends[f].jQ), r.placeCursor(n), r.prepareInsertionAt(n)), r.finalizeInsert(n.options), r.placeCursor(n);
              }, c.createBlocks = function() {
                for (var n = this, r = n.numBlocks(), l = n.blocks = Array(r), y = 0; y < r; y += 1)
                  (l[y] = Rt()).adopt(n, n.ends[1], 0);
              }, c.placeCursor = function(n) {
                n.insAtRightEnd(this.foldChildren(this.ends[f], function(r, l) {
                  return r.isEmpty() ? r : l;
                }));
              }, c.moveTowards = function(n, r, l) {
                var y = l && this[l + "Into"];
                r.insAtDirEnd(-n, y || this.ends[-n]);
              }, c.deleteTowards = function(n, r) {
                this.isEmpty() ? r[n] = this.remove()[n] : this.moveTowards(n, r, null);
              }, c.selectTowards = function(n, r) {
                r[-n] = this, r[n] = this[n];
              }, c.selectChildren = function() {
                return he(this, this);
              }, c.unselectInto = function(n, r) {
                r.insAtDirEnd(-n, r.anticursor.ancestors[this.id]);
              }, c.seek = function(n, r) {
                function l(w) {
                  var O = {};
                  return O[f] = w.jQ.offset().left, O[1] = O[f] + w.jQ.outerWidth(), O;
                }
                var y = this, v = l(y);
                if (n < v[f])
                  return r.insLeftOf(y);
                if (n > v[1])
                  return r.insRightOf(y);
                var k = v[f];
                y.eachChild(function(w) {
                  var O = l(w);
                  return n < O[f] ? (n - k < O[f] - n ? w[f] ? r.insAtRightEnd(w[f]) : r.insLeftOf(y) : r.insAtLeftEnd(w), !1) : n > O[1] ? void (w[1] ? k = O[1] : v[1] - n < n - O[1] ? r.insRightOf(y) : r.insAtRightEnd(w)) : (w.seek(n, r), !1);
                });
              }, c.numBlocks = function() {
                var n = this.htmlTemplate.match(/&\d+/g);
                return n ? n.length : 0;
              }, c.html = function() {
                var n = this, r = n.blocks, l = " mathquill-command-id=" + n.id, y = n.htmlTemplate.match(/<[^<>]+>|[^<>]+/g);
                F("no unmatched angle brackets", y.join("") === this.htmlTemplate);
                for (var v = 0, k = y[0]; k; k = y[v += 1])
                  if (k.slice(-2) === "/>")
                    y[v] = k.slice(0, -2) + l + "/>";
                  else if (k.charAt(0) === "<") {
                    F("not an unmatched top-level close tag", k.charAt(1) !== "/"), y[v] = k.slice(0, -1) + l + ">";
                    var w = 1;
                    do
                      F("no missing close tags", k = y[v += 1]), k.slice(0, 2) === "</" ? w -= 1 : k.charAt(0) === "<" && k.slice(-2) !== "/>" && (w += 1);
                    while (w > 0);
                  }
                return y.join("").replace(/>&(\d+)/g, function(O, M) {
                  return " mathquill-block-id=" + r[M].id + ">" + r[M].join("html");
                });
              }, c.latex = function() {
                return this.foldChildren(this.ctrlSeq, function(n, r) {
                  return n + "{" + (r.latex() || " ") + "}";
                });
              }, c.textTemplate = [""], c.text = function() {
                var n = this, r = 0;
                return n.foldChildren(n.textTemplate[r], function(l, y) {
                  r += 1;
                  var v = y.text();
                  return l && n.textTemplate[r] === "(" && v[0] === "(" && v.slice(-1) === ")" ? l + v.slice(1, -1) + n.textTemplate[r] : l + v + (n.textTemplate[r] || "");
                });
              };
            }), ce = L(jt, function(c, d) {
              c.init = function(n, r, l) {
                l || (l = n && n.length > 1 ? n.slice(1) : n), d.init.call(this, n, r, [l]);
              }, c.parser = function() {
                return J.succeed(this);
              }, c.numBlocks = function() {
                return 0;
              }, c.replaces = function(n) {
                n.remove();
              }, c.createBlocks = vt, c.moveTowards = function(n, r) {
                r.jQ.insDirOf(n, this.jQ), r[-n] = this, r[n] = this[n];
              }, c.deleteTowards = function(n, r) {
                r[n] = this.remove()[n];
              }, c.seek = function(n, r) {
                n - this.jQ.offset().left < this.jQ.outerWidth() / 2 ? r.insLeftOf(this) : r.insRightOf(this);
              }, c.latex = function() {
                return this.ctrlSeq;
              }, c.text = function() {
                return this.textTemplate;
              }, c.placeCursor = vt, c.isEmpty = function() {
                return !0;
              };
            }), q = L(ce, function(c, d) {
              c.init = function(n, r) {
                d.init.call(this, n, "<span>" + (r || n) + "</span>");
              };
            }), Z = L(ce, function(c, d) {
              c.init = function(n, r, l) {
                d.init.call(this, n, '<span class="mq-binary-operator">' + r + "</span>", l);
              };
            }), Rt = L(En, function(c, d) {
              c.join = function(n) {
                return this.foldChildren("", function(r, l) {
                  return r + l[n]();
                });
              }, c.html = function() {
                return this.join("html");
              }, c.latex = function() {
                return this.join("latex");
              }, c.text = function() {
                return this.ends[f] === this.ends[1] && this.ends[f] !== 0 ? this.ends[f].text() : this.join("text");
              }, c.keystroke = function(n, r, l) {
                return !l.options.spaceBehavesLikeTab || n !== "Spacebar" && n !== "Shift-Spacebar" ? d.keystroke.apply(this, arguments) : (r.preventDefault(), void l.escapeDir(n === "Shift-Spacebar" ? f : 1, n, r));
              }, c.moveOutOf = function(n, r, l) {
                l && this.parent[l + "Into"] || !this[n] ? r.insDirOf(n, this.parent) : r.insAtDirEnd(-n, this[n]);
              }, c.selectOutOf = function(n, r) {
                r.insDirOf(n, this.parent);
              }, c.deleteOutOf = function(n, r) {
                r.unwrapGramp();
              }, c.seek = function(n, r) {
                var l = this.ends[1];
                if (!l || l.jQ.offset().left + l.jQ.outerWidth() < n)
                  return r.insAtRightEnd(this);
                if (n < this.ends[f].jQ.offset().left)
                  return r.insAtLeftEnd(this);
                for (; n < l.jQ.offset().left; )
                  l = l[f];
                return l.seek(n, r);
              }, c.chToCmd = function(n, r) {
                var l;
                return n.match(/^[a-eg-zA-Z]$/) ? Zt(n) : /^\d$/.test(n) ? Pn(n) : r && r.typingSlashWritesDivisionSymbol && n === "/" ? s["÷"](n) : r && r.typingAsteriskWritesTimesSymbol && n === "*" ? s["×"](n) : (l = xt[n] || s[n]) ? l(n) : q(n);
              }, c.write = function(n, r) {
                var l = this.chToCmd(r, n.options);
                n.selection && l.replaces(n.replaceSelection()), n.isTooDeep() || l.createLeftOf(n.show());
              }, c.focus = function() {
                return this.jQ.addClass("mq-hasCursor"), this.jQ.removeClass("mq-empty"), this;
              }, c.blur = function() {
                return this.jQ.removeClass("mq-hasCursor"), this.isEmpty() && this.jQ.addClass("mq-empty"), this;
              };
            });
            ee.p.mouseEvents = !0, Dt.StaticMath = function(c) {
              return L(c.AbstractMathQuill, function(d, n) {
                this.RootBlock = Rt, d.__mathquillify = function(r, l) {
                  return this.config(r), n.__mathquillify.call(this, "mq-math-mode"), this.__options.mouseEvents && (this.__controller.delegateMouseEvents(), this.__controller.staticMathTextareaEvents()), this;
                }, d.init = function() {
                  n.init.apply(this, arguments), this.__controller.root.postOrder("registerInnerField", this.innerFields = [], c.MathField);
                }, d.latex = function() {
                  var r = n.latex.apply(this, arguments);
                  return arguments.length > 0 && this.__controller.root.postOrder("registerInnerField", this.innerFields = [], c.MathField), r;
                };
              });
            };
            var $ = L(Rt, gn);
            Dt.MathField = function(c) {
              return L(c.EditableField, function(d, n) {
                this.RootBlock = $, d.__mathquillify = function(r, l) {
                  return this.config(r), l > 1 && (this.__controller.root.reflow = vt), n.__mathquillify.call(this, "mq-editable-field mq-math-mode"), delete this.__controller.root.reflow, this;
                };
              });
            };
            var Wt = L(gt, function(c, d) {
              function n(r) {
                r.jQ[0].normalize();
                var l = r.jQ[0].firstChild;
                if (l) {
                  F("only node in TextBlock span is Text node", l.nodeType === 3);
                  var y = Me(l.data);
                  return y.jQadd(l), r.children().disown(), y.adopt(r, 0, 0);
                }
              }
              c.ctrlSeq = "\\text", c.replaces = function(r) {
                r instanceof a ? this.replacedText = r.remove().jQ.text() : typeof r == "string" && (this.replacedText = r);
              }, c.jQadd = function(r) {
                d.jQadd.call(this, r), this.ends[f] && this.ends[f].jQadd(this.jQ[0].firstChild);
              }, c.createLeftOf = function(r) {
                var l = this;
                if (d.createLeftOf.call(this, r), l[1].siblingCreated && l[1].siblingCreated(r.options, f), l[f].siblingCreated && l[f].siblingCreated(r.options, 1), l.bubble("reflow"), r.insAtRightEnd(l), l.replacedText)
                  for (var y = 0; y < l.replacedText.length; y += 1)
                    l.write(r, l.replacedText.charAt(y));
              }, c.parser = function() {
                var r = this, l = J.string, y = J.regex;
                return J.optWhitespace.then(l("{")).then(y(/^[^}]*/)).skip(l("}")).map(function(v) {
                  return v.length === 0 ? a() : (Me(v).adopt(r, 0, 0), r);
                });
              }, c.textContents = function() {
                return this.foldChildren("", function(r, l) {
                  return r + l.text;
                });
              }, c.text = function() {
                return '"' + this.textContents() + '"';
              }, c.latex = function() {
                var r = this.textContents();
                return r.length === 0 ? "" : "\\text{" + r.replace(/\\/g, "\\backslash ").replace(/[{}]/g, "\\$&") + "}";
              }, c.html = function() {
                return '<span class="mq-text-mode" mathquill-command-id=' + this.id + ">" + this.textContents() + "</span>";
              }, c.moveTowards = function(r, l) {
                l.insAtDirEnd(-r, this);
              }, c.moveOutOf = function(r, l) {
                l.insDirOf(r, this);
              }, c.unselectInto = c.moveTowards, c.selectTowards = jt.prototype.selectTowards, c.deleteTowards = jt.prototype.deleteTowards, c.selectOutOf = function(r, l) {
                l.insDirOf(r, this);
              }, c.deleteOutOf = function(r, l) {
                this.isEmpty() && l.insRightOf(this);
              }, c.write = function(r, l) {
                if (r.show().deleteSelection(), l !== "$")
                  r[f] ? r[f].appendText(l) : Me(l).createLeftOf(r);
                else if (this.isEmpty())
                  r.insRightOf(this), q("\\$", "$").createLeftOf(r);
                else if (r[1])
                  if (r[f]) {
                    var y = Wt(), v = this.ends[f];
                    v.disown().jQ.detach(), v.adopt(y, 0, 0), r.insLeftOf(this), d.createLeftOf.call(y, r);
                  } else
                    r.insLeftOf(this);
                else
                  r.insRightOf(this);
              }, c.seek = function(r, l) {
                l.hide();
                var y = n(this), v = this.jQ.width() / this.text.length, k = Math.round((r - this.jQ.offset().left) / v);
                k <= 0 ? l.insAtLeftEnd(this) : k >= y.text.length ? l.insAtRightEnd(this) : l.insLeftOf(y.splitRight(k));
                for (var w = r - l.show().offset().left, O = w && w < 0 ? f : 1, M = O; l[O] && w * M > 0; )
                  l[O].moveTowards(O, l), M = w, w = r - l.offset().left;
                if (O * w < -O * M && l[-O].moveTowards(-O, l), l.anticursor) {
                  if (l.anticursor.parent === this) {
                    var V = l[f] && l[f].text.length;
                    if (this.anticursorPosition === V)
                      l.anticursor = At.copy(l);
                    else {
                      if (this.anticursorPosition < V) {
                        var X = l[f].splitRight(this.anticursorPosition);
                        l[f] = X;
                      } else
                        X = l[1].splitRight(this.anticursorPosition - V);
                      l.anticursor = At(this, X[f], X);
                    }
                  }
                } else
                  this.anticursorPosition = l[f] && l[f].text.length;
              }, c.blur = function(r) {
                Rt.prototype.blur.call(this), r && (this.textContents() === "" ? (this.remove(), r[f] === this ? r[f] = this[f] : r[1] === this && (r[1] = this[1])) : n(this));
              }, c.focus = Rt.prototype.focus;
            }), Me = L(gt, function(c, d) {
              function n(r, l) {
                return l.charAt(r === f ? 0 : -1 + l.length);
              }
              c.init = function(r) {
                d.init.call(this), this.text = r;
              }, c.jQadd = function(r) {
                this.dom = r, this.jQ = lt(r);
              }, c.jQize = function() {
                return this.jQadd(document.createTextNode(this.text));
              }, c.appendText = function(r) {
                this.text += r, this.dom.appendData(r);
              }, c.prependText = function(r) {
                this.text = r + this.text, this.dom.insertData(0, r);
              }, c.insTextAtDirEnd = function(r, l) {
                U(l), l === 1 ? this.appendText(r) : this.prependText(r);
              }, c.splitRight = function(r) {
                var l = Me(this.text.slice(r)).adopt(this.parent, this, this[1]);
                return l.jQadd(this.dom.splitText(r)), this.text = this.text.slice(0, r), l;
              }, c.moveTowards = function(r, l) {
                U(r);
                var y = n(-r, this.text), v = this[-r];
                return v ? v.insTextAtDirEnd(y, r) : Me(y).createDir(-r, l), this.deleteTowards(r, l);
              }, c.latex = function() {
                return this.text;
              }, c.deleteTowards = function(r, l) {
                this.text.length > 1 ? r === 1 ? (this.dom.deleteData(0, 1), this.text = this.text.slice(1)) : (this.dom.deleteData(-1 + this.text.length, 1), this.text = this.text.slice(0, -1)) : (this.remove(), this.jQ.remove(), l[r] = this[r]);
              }, c.selectTowards = function(r, l) {
                U(r);
                var y = l.anticursor, v = n(-r, this.text);
                if (y[r] === this) {
                  var k = Me(v).createDir(r, l);
                  y[r] = k, l.insDirOf(r, k);
                } else {
                  var w = this[-r];
                  w ? w.insTextAtDirEnd(v, r) : (k = Me(v).createDir(-r, l)).jQ.insDirOf(-r, l.selection.jQ), this.text.length === 1 && y[-r] === this && (y[-r] = this[-r]);
                }
                return this.deleteTowards(r, l);
              };
            });
            function Ie(c, d, n) {
              return L(Wt, { ctrlSeq: c, htmlTemplate: "<" + d + " " + n + ">&0</" + d + ">" });
            }
            s.text = s.textnormal = s.textrm = s.textup = s.textmd = Wt, s.em = s.italic = s.italics = s.emph = s.textit = s.textsl = Ie("\\textit", "i", 'class="mq-text-mode"'), s.strong = s.bold = s.textbf = Ie("\\textbf", "b", 'class="mq-text-mode"'), s.sf = s.textsf = Ie("\\textsf", "span", 'class="mq-sans-serif mq-text-mode"'), s.tt = s.texttt = Ie("\\texttt", "span", 'class="mq-monospace mq-text-mode"'), s.textsc = Ie("\\textsc", "span", 'style="font-variant:small-caps" class="mq-text-mode"'), s.uppercase = Ie("\\uppercase", "span", 'style="text-transform:uppercase" class="mq-text-mode"'), s.lowercase = Ie("\\lowercase", "span", 'style="text-transform:lowercase" class="mq-text-mode"');
            var bn = L(jt, function(c, d) {
              c.init = function(n) {
                d.init.call(this, "$"), this.cursor = n;
              }, c.htmlTemplate = '<span class="mq-math-mode">&0</span>', c.createBlocks = function() {
                d.createBlocks.call(this), this.ends[f].cursor = this.cursor, this.ends[f].write = function(n, r) {
                  r !== "$" ? Rt.prototype.write.call(this, n, r) : this.isEmpty() ? (n.insRightOf(this.parent), this.parent.deleteTowards(dir, n), q("\\$", "$").createLeftOf(n.show())) : n[1] ? n[f] ? Rt.prototype.write.call(this, n, r) : n.insLeftOf(this.parent) : n.insRightOf(this.parent);
                };
              }, c.latex = function() {
                return "$" + this.ends[f].latex() + "$";
              };
            }), Ln = L($, function(c, d) {
              c.keystroke = function(n) {
                if (n !== "Spacebar" && n !== "Shift-Spacebar")
                  return d.keystroke.apply(this, arguments);
              }, c.write = function(n, r) {
                var l;
                n.show().deleteSelection(), r === "$" ? bn(n).createLeftOf(n) : (r === "<" ? l = "&lt;" : r === ">" && (l = "&gt;"), q(r, l).createLeftOf(n));
              };
            });
            Dt.TextField = function(c) {
              return L(c.EditableField, function(d, n) {
                this.RootBlock = Ln, d.__mathquillify = function() {
                  return n.__mathquillify.call(this, "mq-editable-field mq-text-mode");
                }, d.latex = function(r) {
                  return arguments.length > 0 ? (this.__controller.renderLatexText(r), this.__controller.blurred && this.__controller.cursor.hide().parent.blur(), this) : this.__controller.exportLatex();
                };
              });
            }, xt["\\"] = L(jt, function(c, d) {
              c.ctrlSeq = "\\", c.replaces = function(n) {
                this._replacedFragment = n.disown(), this.isEmpty = function() {
                  return !1;
                };
              }, c.htmlTemplate = '<span class="mq-latex-command-input mq-non-leaf">\\<span>&0</span></span>', c.textTemplate = ["\\"], c.createBlocks = function() {
                d.createBlocks.call(this), this.ends[f].focus = function() {
                  return this.parent.jQ.addClass("mq-hasCursor"), this.isEmpty() && this.parent.jQ.removeClass("mq-empty"), this;
                }, this.ends[f].blur = function() {
                  return this.parent.jQ.removeClass("mq-hasCursor"), this.isEmpty() && this.parent.jQ.addClass("mq-empty"), this;
                }, this.ends[f].write = function(n, r) {
                  n.show().deleteSelection(), r.match(/[a-z]/i) ? q(r).createLeftOf(n) : (this.parent.renderCommand(n), r === "\\" && this.isEmpty() || n.parent.write(n, r));
                }, this.ends[f].keystroke = function(n, r, l) {
                  return n === "Tab" || n === "Enter" || n === "Spacebar" ? (this.parent.renderCommand(l.cursor), void r.preventDefault()) : d.keystroke.apply(this, arguments);
                };
              }, c.createLeftOf = function(n) {
                if (d.createLeftOf.call(this, n), this._replacedFragment) {
                  var r = this.jQ[0];
                  this.jQ = this._replacedFragment.jQ.addClass("mq-blur").bind("mousedown mousemove", function(l) {
                    return lt(l.target = r).trigger(l), !1;
                  }).insertBefore(this.jQ).add(this.jQ);
                }
              }, c.latex = function() {
                return "\\" + this.ends[f].latex() + " ";
              }, c.renderCommand = function(n) {
                this.jQ = this.jQ.last(), this.remove(), this[1] ? n.insLeftOf(this[1]) : n.insAtRightEnd(this.parent);
                var r = this.ends[f].latex();
                r || (r = " ");
                var l = s[r];
                l ? (l = l(r), this._replacedFragment && l.replaces(this._replacedFragment), l.createLeftOf(n)) : ((l = Wt()).replaces(r), l.createLeftOf(n), n.insRightOf(l), this._replacedFragment && this._replacedFragment.remove());
              };
            });
            var Te, fe, Pe = vt, Ne = document.createElement("div").style;
            for (var On in { transform: 1, WebkitTransform: 1, MozTransform: 1, OTransform: 1, msTransform: 1 })
              if (On in Ne) {
                fe = On;
                break;
              }
            fe ? Te = function(c, d, n) {
              c.css(fe, "scale(" + d + "," + n + ")");
            } : "filter" in Ne ? (Pe = function(c) {
              c.className = c.className;
            }, Te = function(c, d, n) {
              d /= 1 + (n - 1) / 2, c.css("fontSize", n + "em"), c.hasClass("mq-matrixed-container") || c.addClass("mq-matrixed-container").wrapInner('<span class="mq-matrixed"></span>');
              var r = c.children().css("filter", "progid:DXImageTransform.Microsoft.Matrix(M11=" + d + ",SizingMethod='auto expand')");
              function l() {
                c.css("marginRight", (r.width() - 1) * (d - 1) / d + "px");
              }
              l();
              var y = setInterval(l);
              lt(window).load(function() {
                clearTimeout(y), l();
              });
            }) : Te = function(c, d, n) {
              c.css("fontSize", n + "em");
            };
            var re = L(jt, function(c, d) {
              c.init = function(n, r, l) {
                d.init.call(this, n, "<" + r + " " + l + ">&0</" + r + ">");
              };
            });
            s.mathrm = g(re, "\\mathrm", "span", 'class="mq-roman mq-font"'), s.mathit = g(re, "\\mathit", "i", 'class="mq-font"'), s.mathbf = g(re, "\\mathbf", "b", 'class="mq-font"'), s.mathsf = g(re, "\\mathsf", "span", 'class="mq-sans-serif mq-font"'), s.mathtt = g(re, "\\mathtt", "span", 'class="mq-monospace mq-font"'), s.underline = g(re, "\\underline", "span", 'class="mq-non-leaf mq-underline"'), s.overline = s.bar = g(re, "\\overline", "span", 'class="mq-non-leaf mq-overline"'), s.overrightarrow = g(re, "\\overrightarrow", "span", 'class="mq-non-leaf mq-overarrow mq-arrow-right"'), s.overleftarrow = g(re, "\\overleftarrow", "span", 'class="mq-non-leaf mq-overarrow mq-arrow-left"'), s.overleftrightarrow = g(re, "\\overleftrightarrow", "span", 'class="mq-non-leaf mq-overarrow mq-arrow-both"'), s.overarc = g(re, "\\overarc", "span", 'class="mq-non-leaf mq-overarc"'), s.dot = L(jt, function(c, d) {
              c.init = function() {
                d.init.call(this, "\\dot", '<span class="mq-non-leaf"><span class="mq-dot-recurring-inner"><span class="mq-dot-recurring">&#x2d9;</span><span class="mq-empty-box">&0</span></span></span>');
              };
            }), s.textcolor = L(jt, function(c, d) {
              c.setColor = function(n) {
                this.color = n, this.htmlTemplate = '<span class="mq-textcolor" style="color:' + n + '">&0</span>';
              }, c.latex = function() {
                return "\\textcolor{" + this.color + "}{" + this.blocks[0].latex() + "}";
              }, c.parser = function() {
                var n = this, r = J.optWhitespace, l = J.string, y = J.regex;
                return r.then(l("{")).then(y(/^[#\w\s.,()%-]*/)).skip(l("}")).then(function(v) {
                  return n.setColor(v), d.parser.call(n);
                });
              }, c.isStyleBlock = function() {
                return !0;
              };
            }), s.class = L(jt, function(c, d) {
              c.parser = function() {
                var n = this, r = J.string, l = J.regex;
                return J.optWhitespace.then(r("{")).then(l(/^[-\w\s\\\xA0-\xFF]*/)).skip(r("}")).then(function(y) {
                  return n.cls = y || "", n.htmlTemplate = '<span class="mq-class ' + y + '">&0</span>', d.parser.call(n);
                });
              }, c.latex = function() {
                return "\\class{" + this.cls + "}{" + this.blocks[0].latex() + "}";
              }, c.isStyleBlock = function() {
                return !0;
              };
            });
            var qe = L(jt, function(c, d) {
              c.ctrlSeq = "_{...}^{...}", c.createLeftOf = function(n) {
                if (this.replacedFragment || n[f] || !n.options.supSubsRequireOperand)
                  return d.createLeftOf.apply(this, arguments);
              }, c.contactWeld = function(n) {
                for (var r = f; r; r = r === f && 1)
                  if (this[r] instanceof qe) {
                    for (var l = "sub"; l; l = l === "sub" && "sup") {
                      var y = this[l], v = this[r][l];
                      if (y) {
                        if (v)
                          if (y.isEmpty())
                            w = At(v, 0, v.ends[f]);
                          else {
                            y.jQ.children().insAtDirEnd(-r, v.jQ);
                            var k = y.children().disown(), w = At(v, k.ends[1], v.ends[f]);
                            r === f ? k.adopt(v, v.ends[1], 0) : k.adopt(v, 0, v.ends[f]);
                          }
                        else
                          this[r].addBlock(y.disown());
                        this.placeCursor = function(O, M) {
                          return function(V) {
                            V.insAtDirEnd(-r, O || M);
                          };
                        }(v, y);
                      }
                    }
                    this.remove(), n && n[f] === this && (r === 1 && w ? w[f] ? n.insRightOf(w[f]) : n.insAtLeftEnd(w.parent) : n.insRightOf(this[r]));
                    break;
                  }
              }, ee.p.charsThatBreakOutOfSupSub = "", c.finalizeTree = function() {
                this.ends[f].write = function(n, r) {
                  if (n.options.autoSubscriptNumerals && this === this.parent.sub) {
                    if (r === "_")
                      return;
                    var l = this.chToCmd(r, n.options);
                    return l instanceof ce ? n.deleteSelection() : n.clearSelection().insRightOf(this.parent), l.createLeftOf(n.show());
                  }
                  n[f] && !n[1] && !n.selection && n.options.charsThatBreakOutOfSupSub.indexOf(r) > -1 && n.insRightOf(this.parent), Rt.p.write.apply(this, arguments);
                };
              }, c.moveTowards = function(n, r, l) {
                r.options.autoSubscriptNumerals && !this.sup ? r.insDirOf(n, this) : d.moveTowards.apply(this, arguments);
              }, c.deleteTowards = function(n, r) {
                if (r.options.autoSubscriptNumerals && this.sub) {
                  var l = this.sub.ends[-n];
                  l instanceof ce ? l.remove() : l && l.deleteTowards(n, r.insAtDirEnd(-n, this.sub)), this.sub.isEmpty() && (this.sub.deleteOutOf(f, r.insAtLeftEnd(this.sub)), this.sup && r.insDirOf(-n, this));
                } else
                  d.deleteTowards.apply(this, arguments);
              }, c.latex = function() {
                function n(r, l) {
                  var y = l && l.latex();
                  return l ? r + (y.length === 1 ? y : "{" + (y || " ") + "}") : "";
                }
                return n("_", this.sub) + n("^", this.sup);
              }, c.addBlock = function(n) {
                this.supsub === "sub" ? (this.sup = this.upInto = this.sub.upOutOf = n, n.adopt(this, this.sub, 0).downOutOf = this.sub, n.jQ = lt('<span class="mq-sup"/>').append(n.jQ.children()).attr(ht, n.id).prependTo(this.jQ)) : (this.sub = this.downInto = this.sup.downOutOf = n, n.adopt(this, 0, this.sup).upOutOf = this.sup, n.jQ = lt('<span class="mq-sub"></span>').append(n.jQ.children()).attr(ht, n.id).appendTo(this.jQ.removeClass("mq-sup-only")), this.jQ.append('<span style="display:inline-block;width:0">&#8203;</span>'));
                for (var r = 0; r < 2; r += 1)
                  (function(l, y, v, k) {
                    l[y].deleteOutOf = function(w, O) {
                      if (O.insDirOf(this[w] ? -w : w, this.parent), !this.isEmpty()) {
                        var M = this.ends[w];
                        this.children().disown().withDirAdopt(w, O.parent, O[w], O[-w]).jQ.insDirOf(-w, O.jQ), O[-w] = M;
                      }
                      l.supsub = v, delete l[y], delete l[k + "Into"], l[v][k + "OutOf"] = an, delete l[v].deleteOutOf, y === "sub" && lt(l.jQ.addClass("mq-sup-only")[0].lastChild).remove(), this.remove();
                    };
                  })(this, "sub sup".split(" ")[r], "sup sub".split(" ")[r], "down up".split(" ")[r]);
              }, c.reflow = function() {
                var n = this.jQ, r = n.prev();
                if (r.length) {
                  var l = n.children(".mq-sup");
                  if (l.length) {
                    var y = parseInt(l.css("font-size")), v = l.offset().top + l.height() - r.offset().top - 0.7 * y, k = parseInt(l.css("margin-bottom"));
                    l.css("margin-bottom", k + v);
                  }
                }
              };
            });
            function an(c) {
              var d = this.parent, n = c;
              do {
                if (n[1])
                  return c.insLeftOf(d);
                n = n.parent.parent;
              } while (n !== d);
              c.insRightOf(d);
            }
            s.subscript = s._ = L(qe, function(c, d) {
              c.supsub = "sub", c.htmlTemplate = '<span class="mq-supsub mq-non-leaf"><span class="mq-sub">&0</span><span style="display:inline-block;width:0">&#8203;</span></span>', c.textTemplate = ["_"], c.finalizeTree = function() {
                this.downInto = this.sub = this.ends[f], this.sub.upOutOf = an, d.finalizeTree.call(this);
              };
            }), s.superscript = s.supscript = s["^"] = L(qe, function(c, d) {
              c.supsub = "sup", c.htmlTemplate = '<span class="mq-supsub mq-non-leaf mq-sup-only"><span class="mq-sup">&0</span></span>', c.textTemplate = ["^"], c.finalizeTree = function() {
                this.upInto = this.sup = this.ends[1], this.sup.downOutOf = an, d.finalizeTree.call(this);
              };
            });
            var Fe = L(jt, function(c, d) {
              c.init = function(n, r) {
                var l = '<span class="mq-large-operator mq-non-leaf"><span class="mq-to"><span>&1</span></span><big>' + r + '</big><span class="mq-from"><span>&0</span></span></span>';
                ce.prototype.init.call(this, n, l);
              }, c.createLeftOf = function(n) {
                d.createLeftOf.apply(this, arguments), n.options.sumStartsWithNEquals && (Zt("n").createLeftOf(n), He().createLeftOf(n));
              }, c.latex = function() {
                function n(r) {
                  return r.length === 1 ? r : "{" + (r || " ") + "}";
                }
                return this.ctrlSeq + "_" + n(this.ends[f].latex()) + "^" + n(this.ends[1].latex());
              }, c.parser = function() {
                for (var n = J.string, r = J.optWhitespace, l = J.succeed, y = Qt.block, v = this, k = v.blocks = [Rt(), Rt()], w = 0; w < k.length; w += 1)
                  k[w].adopt(v, v.ends[1], 0);
                return r.then(n("_").or(n("^"))).then(function(O) {
                  var M = k[O === "_" ? 0 : 1];
                  return y.then(function(V) {
                    return V.children().adopt(M, M.ends[1], 0), l(v);
                  });
                }).many().result(v);
              }, c.finalizeTree = function() {
                this.downInto = this.ends[f], this.upInto = this.ends[1], this.ends[f].upOutOf = this.ends[1], this.ends[1].downOutOf = this.ends[f];
              };
            });
            s["∑"] = s.sum = s.summation = g(Fe, "\\sum ", "&sum;"), s["∏"] = s.prod = s.product = g(Fe, "\\prod ", "&prod;"), s.coprod = s.coproduct = g(Fe, "\\coprod ", "&#8720;"), s["∫"] = s.int = s.integral = L(Fe, function(c, d) {
              c.init = function() {
                ce.prototype.init.call(this, "\\int ", '<span class="mq-int mq-non-leaf"><big>&int;</big><span class="mq-supsub mq-non-leaf"><span class="mq-sup"><span class="mq-sup-inner">&1</span></span><span class="mq-sub">&0</span><span style="display:inline-block;width:0">&#8203</span></span></span>');
              }, c.createLeftOf = jt.p.createLeftOf;
            });
            var $e = s.frac = s.dfrac = s.cfrac = s.fraction = L(jt, function(c, d) {
              c.ctrlSeq = "\\frac", c.htmlTemplate = '<span class="mq-fraction mq-non-leaf"><span class="mq-numerator">&0</span><span class="mq-denominator">&1</span><span style="display:inline-block;width:0">&#8203;</span></span>', c.textTemplate = ["(", ")/(", ")"], c.finalizeTree = function() {
                this.upInto = this.ends[1].upOutOf = this.ends[f], this.downInto = this.ends[f].downOutOf = this.ends[1];
              };
            }), Be = s.over = xt["/"] = L($e, function(c, d) {
              c.createLeftOf = function(n) {
                if (!this.replacedFragment) {
                  for (var r = n[f]; r && !(r instanceof Z || r instanceof (s.text || vt) || r instanceof Fe || r.ctrlSeq === "\\ " || /^[,;:]$/.test(r.ctrlSeq)); )
                    r = r[f];
                  r instanceof Fe && r[1] instanceof qe && (r = r[1])[1] instanceof qe && r[1].ctrlSeq != r.ctrlSeq && (r = r[1]), r === n[f] || n.isTooDeep(1) || (this.replaces(a(r[1] || n.parent.ends[f], n[f])), n[f] = r);
                }
                d.createLeftOf.call(this, n);
              };
            }), sn = s.sqrt = s["√"] = L(jt, function(c, d) {
              c.ctrlSeq = "\\sqrt", c.htmlTemplate = '<span class="mq-non-leaf"><span class="mq-scaled mq-sqrt-prefix">&radic;</span><span class="mq-non-leaf mq-sqrt-stem">&0</span></span>', c.textTemplate = ["sqrt(", ")"], c.parser = function() {
                return Qt.optBlock.then(function(n) {
                  return Qt.block.map(function(r) {
                    var l = Ke();
                    return l.blocks = [n, r], n.adopt(l, 0, 0), r.adopt(l, n, 0), l;
                  });
                }).or(d.parser.call(this));
              }, c.reflow = function() {
                var n = this.ends[1].jQ;
                Te(n.prev(), 1, n.innerHeight() / +n.css("fontSize").slice(0, -2) - 0.1);
              };
            }), Ke = (s.hat = L(jt, function(c, d) {
              c.ctrlSeq = "\\hat", c.htmlTemplate = '<span class="mq-non-leaf"><span class="mq-hat-prefix">^</span><span class="mq-hat-stem">&0</span></span>', c.textTemplate = ["hat(", ")"];
            }), s.nthroot = L(sn, function(c, d) {
              c.htmlTemplate = '<sup class="mq-nthroot mq-non-leaf">&0</sup><span class="mq-scaled"><span class="mq-sqrt-prefix mq-scaled">&radic;</span><span class="mq-sqrt-stem mq-non-leaf">&1</span></span>', c.textTemplate = ["sqrt[", "](", ")"], c.latex = function() {
                return "\\sqrt[" + this.ends[f].latex() + "]{" + this.ends[1].latex() + "}";
              };
            })), vn = L(jt, function(c, d) {
              c.init = function(n, r, l) {
                var y = '<span class="mq-non-leaf"><span class="mq-diacritic-above">' + r + '</span><span class="mq-diacritic-stem">&0</span></span>';
                d.init.call(this, n, y, l);
              };
            });
            function xn(c, d) {
              c.jQadd = function() {
                d.jQadd.apply(this, arguments), this.delimjQs = this.jQ.children(":first").add(this.jQ.children(":last")), this.contentjQ = this.jQ.children(":eq(1)");
              }, c.reflow = function() {
                var n = this.contentjQ.outerHeight() / parseFloat(this.contentjQ.css("fontSize"));
                Te(this.delimjQs, te(1 + 0.2 * (n - 1), 1.2), 1.2 * n);
              };
            }
            s.vec = g(vn, "\\vec", "&rarr;", ["vec(", ")"]), s.tilde = g(vn, "\\tilde", "~", ["tilde(", ")"]);
            var Tt = L(L(jt, xn), function(c, d) {
              c.init = function(n, r, l, y, v) {
                d.init.call(this, "\\left" + y, at, [r, l]), this.side = n, this.sides = {}, this.sides[f] = { ch: r, ctrlSeq: y }, this.sides[1] = { ch: l, ctrlSeq: v };
              }, c.numBlocks = function() {
                return 1;
              }, c.html = function() {
                return this.htmlTemplate = '<span class="mq-non-leaf"><span class="mq-scaled mq-paren' + (this.side === 1 ? " mq-ghost" : "") + '">' + this.sides[f].ch + '</span><span class="mq-non-leaf">&0</span><span class="mq-scaled mq-paren' + (this.side === f ? " mq-ghost" : "") + '">' + this.sides[1].ch + "</span></span>", d.html.call(this);
              }, c.latex = function() {
                return "\\left" + this.sides[f].ctrlSeq + this.ends[f].latex() + "\\right" + this.sides[1].ctrlSeq;
              }, c.matchBrack = function(n, r, l) {
                return l instanceof Tt && l.side && l.side !== -r && (!n.restrictMismatchedBrackets || Nt[this.sides[this.side].ch] === l.sides[l.side].ch || { "(": "]", "[": ")" }[this.sides[f].ch] === l.sides[1].ch) && l;
              }, c.closeOpposing = function(n) {
                n.side = 0, n.sides[this.side] = this.sides[this.side], n.delimjQs.eq(this.side === f ? 0 : 1).removeClass("mq-ghost").html(this.sides[this.side].ch);
              }, c.createLeftOf = function(n) {
                if (!this.replacedFragment) {
                  var r = n.options;
                  if (this.sides[f].ch === "|")
                    var l = this.matchBrack(r, 1, n[1]) || this.matchBrack(r, f, n[f]) || this.matchBrack(r, 0, n.parent.parent);
                  else
                    l = this.matchBrack(r, -this.side, n[-this.side]) || this.matchBrack(r, -this.side, n.parent.parent);
                }
                if (l) {
                  var y = this.side = -l.side;
                  this.closeOpposing(l), l === n.parent.parent && n[y] && a(n[y], n.parent.ends[y], -y).disown().withDirAdopt(-y, l.parent, l, l[y]).jQ.insDirOf(y, l.jQ), l.bubble("reflow");
                } else
                  y = (l = this).side, l.replacedFragment ? l.side = 0 : n[-y] && (l.replaces(a(n[-y], n.parent.ends[-y], y)), n[-y] = 0), d.createLeftOf.call(l, n);
                y === f ? n.insAtLeftEnd(l.ends[f]) : n.insRightOf(l);
              }, c.placeCursor = vt, c.unwrap = function() {
                this.ends[f].children().disown().adopt(this.parent, this, this[1]).jQ.insertAfter(this.jQ), this.remove();
              }, c.deleteSide = function(n, r, l) {
                var y = this.parent, v = this[n], k = y.ends[n];
                if (n === this.side)
                  return this.unwrap(), void (v ? l.insDirOf(-n, v) : l.insAtDirEnd(n, y));
                var w = l.options, O = !this.side;
                if (this.side = -n, this.matchBrack(w, n, this.ends[f].ends[this.side])) {
                  this.closeOpposing(this.ends[f].ends[this.side]);
                  var M = this.ends[f].ends[n];
                  this.unwrap(), M.siblingCreated && M.siblingCreated(l.options, n), v ? l.insDirOf(-n, v) : l.insAtDirEnd(n, y);
                } else {
                  if (this.matchBrack(w, n, this.parent.parent))
                    this.parent.parent.closeOpposing(this), this.parent.parent.unwrap();
                  else {
                    if (r && O)
                      return this.unwrap(), void (v ? l.insDirOf(-n, v) : l.insAtDirEnd(n, y));
                    this.sides[n] = { ch: Nt[this.sides[this.side].ch], ctrlSeq: Nt[this.sides[this.side].ctrlSeq] }, this.delimjQs.removeClass("mq-ghost").eq(n === f ? 0 : 1).addClass("mq-ghost").html(this.sides[n].ch);
                  }
                  v ? (M = this.ends[f].ends[n], a(v, k, -n).disown().withDirAdopt(-n, this.ends[f], M, 0).jQ.insAtDirEnd(n, this.ends[f].jQ.removeClass("mq-empty")), M.siblingCreated && M.siblingCreated(l.options, n), l.insDirOf(-n, v)) : r ? l.insDirOf(n, this) : l.insAtDirEnd(n, this.ends[f]);
                }
              }, c.deleteTowards = function(n, r) {
                this.deleteSide(-n, !1, r);
              }, c.finalizeTree = function() {
                this.ends[f].deleteOutOf = function(n, r) {
                  this.parent.deleteSide(n, !0, r);
                }, this.finalizeTree = this.intentionalBlur = function() {
                  this.delimjQs.eq(this.side === f ? 1 : 0).removeClass("mq-ghost"), this.side = 0;
                };
              }, c.siblingCreated = function(n, r) {
                r === -this.side && this.finalizeTree();
              };
            }), Nt = { "(": ")", ")": "(", "[": "]", "]": "[", "{": "}", "}": "{", "\\{": "\\}", "\\}": "\\{", "&lang;": "&rang;", "&rang;": "&lang;", "\\langle ": "\\rangle ", "\\rangle ": "\\langle ", "|": "|", "\\lVert ": "\\rVert ", "\\rVert ": "\\lVert " };
            function Ye(c, d) {
              d = d || c;
              var n = Nt[c], r = Nt[d];
              xt[c] = g(Tt, f, c, n, d, r), xt[n] = g(Tt, 1, c, n, d, r);
            }
            Ye("("), Ye("["), Ye("{", "\\{"), s.langle = g(Tt, f, "&lang;", "&rang;", "\\langle ", "\\rangle "), s.rangle = g(Tt, 1, "&lang;", "&rang;", "\\langle ", "\\rangle "), xt["|"] = g(Tt, f, "|", "|", "|", "|"), s.lVert = g(Tt, f, "&#8741;", "&#8741;", "\\lVert ", "\\rVert "), s.rVert = g(Tt, 1, "&#8741;", "&#8741;", "\\lVert ", "\\rVert "), s.left = L(jt, function(c) {
              c.parser = function() {
                var d = J.regex, n = J.string, r = (J.succeed, J.optWhitespace);
                return r.then(d(/^(?:[([|]|\\\{|\\langle(?![a-zA-Z])|\\lVert(?![a-zA-Z]))/)).then(function(l) {
                  var y = l.charAt(0) === "\\" ? l.slice(1) : l;
                  return l == "\\langle" && (y = "&lang;", l += " "), l == "\\lVert" && (y = "&#8741;", l += " "), Qt.then(function(v) {
                    return n("\\right").skip(r).then(d(/^(?:[\])|]|\\\}|\\rangle(?![a-zA-Z])|\\rVert(?![a-zA-Z]))/)).map(function(k) {
                      var w = k.charAt(0) === "\\" ? k.slice(1) : k;
                      k == "\\rangle" && (w = "&rang;", k += " "), k == "\\rVert" && (w = "&#8741;", k += " ");
                      var O = Tt(0, y, w, l, k);
                      return O.blocks = [v], v.adopt(O, 0, 0), O;
                    });
                  });
                });
              };
            }), s.right = L(jt, function(c) {
              c.parser = function() {
                return J.fail("unmatched \\right");
              };
            });
            var Xn = s.binom = s.binomial = L(L(jt, xn), function(c, d) {
              c.ctrlSeq = "\\binom", c.htmlTemplate = '<span class="mq-non-leaf"><span class="mq-paren mq-scaled">(</span><span class="mq-non-leaf"><span class="mq-array mq-non-leaf"><span>&0</span><span>&1</span></span></span><span class="mq-paren mq-scaled">)</span></span>', c.textTemplate = ["choose(", ",", ")"];
            });
            s.choose = L(Xn, function(c) {
              c.createLeftOf = Be.prototype.createLeftOf;
            }), s.editable = s.MathQuillMathField = L(jt, function(c, d) {
              c.ctrlSeq = "\\MathQuillMathField", c.htmlTemplate = '<span class="mq-editable-field"><span class="mq-root-block">&0</span></span>', c.parser = function() {
                var n = this, r = J.string, l = J.regex, y = J.succeed;
                return r("[").then(l(/^[a-z][a-z0-9]*/i)).skip(r("]")).map(function(v) {
                  n.name = v;
                }).or(y()).then(d.parser.call(n));
              }, c.finalizeTree = function(n) {
                var r = It(this.ends[f], this.jQ, n);
                r.KIND_OF_MQ = "MathField", r.editable = !0, r.createTextarea(), r.editablesTextareaEvents(), r.cursor.insAtRightEnd(r.root), gn(r.root);
              }, c.registerInnerField = function(n, r) {
                n.push(n[this.name] = r(this.ends[f].controller));
              }, c.latex = function() {
                return this.ends[f].latex();
              }, c.text = function() {
                return this.ends[f].text();
              };
            });
            var An = s.embed = L(ce, function(c, d) {
              c.setOptions = function(n) {
                function r() {
                  return "";
                }
                return this.text = n.text || r, this.htmlTemplate = n.htmlString || "", this.latex = n.latex || r, this;
              }, c.parser = function() {
                var n = this, r = J.string, l = J.regex, y = J.succeed;
                return r("{").then(l(/^[a-z][a-z0-9]*/i)).skip(r("}")).then(function(v) {
                  return r("[").then(l(/^[-\w\s]*/)).skip(r("]")).or(y()).map(function(k) {
                    return n.setOptions(Re[v](k));
                  });
                });
              };
            });
            s.notin = s.cong = s.equiv = s.oplus = s.otimes = L(Z, function(c, d) {
              c.init = function(n) {
                d.init.call(this, "\\" + n + " ", "&" + n + ";");
              };
            }), s["≠"] = s.ne = s.neq = g(Z, "\\ne ", "&ne;"), s["∗"] = s.ast = s.star = s.loast = s.lowast = g(Z, "\\ast ", "&lowast;"), s.therefor = s.therefore = g(Z, "\\therefore ", "&there4;"), s.cuz = s.because = g(Z, "\\because ", "&#8757;"), s.prop = s.propto = g(Z, "\\propto ", "&prop;"), s["≈"] = s.asymp = s.approx = g(Z, "\\approx ", "&asymp;"), s.isin = s.in = g(Z, "\\in ", "&isin;"), s.ni = s.contains = g(Z, "\\ni ", "&ni;"), s.notni = s.niton = s.notcontains = s.doesnotcontain = g(Z, "\\not\\ni ", "&#8716;"), s.sub = s.subset = g(Z, "\\subset ", "&sub;"), s.sup = s.supset = s.superset = g(Z, "\\supset ", "&sup;"), s.nsub = s.notsub = s.nsubset = s.notsubset = g(Z, "\\not\\subset ", "&#8836;"), s.nsup = s.notsup = s.nsupset = s.notsupset = s.nsuperset = s.notsuperset = g(Z, "\\not\\supset ", "&#8837;"), s.sube = s.subeq = s.subsete = s.subseteq = g(Z, "\\subseteq ", "&sube;"), s.supe = s.supeq = s.supsete = s.supseteq = s.supersete = s.superseteq = g(Z, "\\supseteq ", "&supe;"), s.nsube = s.nsubeq = s.notsube = s.notsubeq = s.nsubsete = s.nsubseteq = s.notsubsete = s.notsubseteq = g(Z, "\\not\\subseteq ", "&#8840;"), s.nsupe = s.nsupeq = s.notsupe = s.notsupeq = s.nsupsete = s.nsupseteq = s.notsupsete = s.notsupseteq = s.nsupersete = s.nsuperseteq = s.notsupersete = s.notsuperseteq = g(Z, "\\not\\supseteq ", "&#8841;"), s.N = s.naturals = s.Naturals = g(q, "\\mathbb{N}", "&#8469;"), s.P = s.primes = s.Primes = s.projective = s.Projective = s.probability = s.Probability = g(q, "\\mathbb{P}", "&#8473;"), s.Z = s.integers = s.Integers = g(q, "\\mathbb{Z}", "&#8484;"), s.Q = s.rationals = s.Rationals = g(q, "\\mathbb{Q}", "&#8474;"), s.R = s.reals = s.Reals = g(q, "\\mathbb{R}", "&#8477;"), s.C = s.complex = s.Complex = s.complexes = s.Complexes = s.complexplane = s.Complexplane = s.ComplexPlane = g(q, "\\mathbb{C}", "&#8450;"), s.H = s.Hamiltonian = s.quaternions = s.Quaternions = g(q, "\\mathbb{H}", "&#8461;"), s.quad = s.emsp = g(q, "\\quad ", "    "), s.qquad = g(q, "\\qquad ", "        "), s.diamond = g(q, "\\diamond ", "&#9671;"), s.bigtriangleup = g(q, "\\bigtriangleup ", "&#9651;"), s.ominus = g(q, "\\ominus ", "&#8854;"), s.uplus = g(q, "\\uplus ", "&#8846;"), s.bigtriangledown = g(q, "\\bigtriangledown ", "&#9661;"), s.sqcap = g(q, "\\sqcap ", "&#8851;"), s.triangleleft = g(q, "\\triangleleft ", "&#8882;"), s.sqcup = g(q, "\\sqcup ", "&#8852;"), s.triangleright = g(q, "\\triangleright ", "&#8883;"), s.odot = s.circledot = g(q, "\\odot ", "&#8857;"), s.bigcirc = g(q, "\\bigcirc ", "&#9711;"), s.dagger = g(q, "\\dagger ", "&#0134;"), s.ddagger = g(q, "\\ddagger ", "&#135;"), s.wr = g(q, "\\wr ", "&#8768;"), s.amalg = g(q, "\\amalg ", "&#8720;"), s.models = g(q, "\\models ", "&#8872;"), s.prec = g(q, "\\prec ", "&#8826;"), s.succ = g(q, "\\succ ", "&#8827;"), s.preceq = g(q, "\\preceq ", "&#8828;"), s.succeq = g(q, "\\succeq ", "&#8829;"), s.simeq = g(q, "\\simeq ", "&#8771;"), s.mid = g(q, "\\mid ", "&#8739;"), s.ll = g(q, "\\ll ", "&#8810;"), s.gg = g(q, "\\gg ", "&#8811;"), s.parallel = g(q, "\\parallel ", "&#8741;"), s.nparallel = g(q, "\\nparallel ", "&#8742;"), s.bowtie = g(q, "\\bowtie ", "&#8904;"), s.sqsubset = g(q, "\\sqsubset ", "&#8847;"), s.sqsupset = g(q, "\\sqsupset ", "&#8848;"), s.smile = g(q, "\\smile ", "&#8995;"), s.sqsubseteq = g(q, "\\sqsubseteq ", "&#8849;"), s.sqsupseteq = g(q, "\\sqsupseteq ", "&#8850;"), s.doteq = g(q, "\\doteq ", "&#8784;"), s.frown = g(q, "\\frown ", "&#8994;"), s.vdash = g(q, "\\vdash ", "&#8870;"), s.dashv = g(q, "\\dashv ", "&#8867;"), s.nless = g(q, "\\nless ", "&#8814;"), s.ngtr = g(q, "\\ngtr ", "&#8815;"), s.longleftarrow = g(q, "\\longleftarrow ", "&#8592;"), s.longrightarrow = g(q, "\\longrightarrow ", "&#8594;"), s.Longleftarrow = g(q, "\\Longleftarrow ", "&#8656;"), s.Longrightarrow = g(q, "\\Longrightarrow ", "&#8658;"), s.longleftrightarrow = g(q, "\\longleftrightarrow ", "&#8596;"), s.updownarrow = g(q, "\\updownarrow ", "&#8597;"), s.Longleftrightarrow = g(q, "\\Longleftrightarrow ", "&#8660;"), s.Updownarrow = g(q, "\\Updownarrow ", "&#8661;"), s.mapsto = g(q, "\\mapsto ", "&#8614;"), s.nearrow = g(q, "\\nearrow ", "&#8599;"), s.hookleftarrow = g(q, "\\hookleftarrow ", "&#8617;"), s.hookrightarrow = g(q, "\\hookrightarrow ", "&#8618;"), s.searrow = g(q, "\\searrow ", "&#8600;"), s.leftharpoonup = g(q, "\\leftharpoonup ", "&#8636;"), s.rightharpoonup = g(q, "\\rightharpoonup ", "&#8640;"), s.swarrow = g(q, "\\swarrow ", "&#8601;"), s.leftharpoondown = g(q, "\\leftharpoondown ", "&#8637;"), s.rightharpoondown = g(q, "\\rightharpoondown ", "&#8641;"), s.nwarrow = g(q, "\\nwarrow ", "&#8598;"), s.ldots = g(q, "\\ldots ", "&#8230;"), s.cdots = g(q, "\\cdots ", "&#8943;"), s.vdots = g(q, "\\vdots ", "&#8942;"), s.ddots = g(q, "\\ddots ", "&#8945;"), s.surd = g(q, "\\surd ", "&#8730;"), s.triangle = g(q, "\\triangle ", "&#9651;"), s.ell = g(q, "\\ell ", "&#8467;"), s.top = g(q, "\\top ", "&#8868;"), s.flat = g(q, "\\flat ", "&#9837;"), s.natural = g(q, "\\natural ", "&#9838;"), s.sharp = g(q, "\\sharp ", "&#9839;"), s.wp = g(q, "\\wp ", "&#8472;"), s.bot = g(q, "\\bot ", "&#8869;"), s.clubsuit = g(q, "\\clubsuit ", "&#9827;"), s.diamondsuit = g(q, "\\diamondsuit ", "&#9826;"), s.heartsuit = g(q, "\\heartsuit ", "&#9825;"), s.spadesuit = g(q, "\\spadesuit ", "&#9824;"), s.parallelogram = g(q, "\\parallelogram ", "&#9649;"), s.square = g(q, "\\square ", "&#11036;"), s.oint = g(q, "\\oint ", "&#8750;"), s.bigcap = g(q, "\\bigcap ", "&#8745;"), s.bigcup = g(q, "\\bigcup ", "&#8746;"), s.bigsqcup = g(q, "\\bigsqcup ", "&#8852;"), s.bigvee = g(q, "\\bigvee ", "&#8744;"), s.bigwedge = g(q, "\\bigwedge ", "&#8743;"), s.bigodot = g(q, "\\bigodot ", "&#8857;"), s.bigotimes = g(q, "\\bigotimes ", "&#8855;"), s.bigoplus = g(q, "\\bigoplus ", "&#8853;"), s.biguplus = g(q, "\\biguplus ", "&#8846;"), s.lfloor = g(q, "\\lfloor ", "&#8970;"), s.rfloor = g(q, "\\rfloor ", "&#8971;"), s.lceil = g(q, "\\lceil ", "&#8968;"), s.rceil = g(q, "\\rceil ", "&#8969;"), s.opencurlybrace = s.lbrace = g(q, "\\lbrace ", "{"), s.closecurlybrace = s.rbrace = g(q, "\\rbrace ", "}"), s.lbrack = g(q, "["), s.rbrack = g(q, "]"), s.slash = g(q, "/"), s.vert = g(q, "|"), s.perp = s.perpendicular = g(q, "\\perp ", "&perp;"), s.nabla = s.del = g(q, "\\nabla ", "&nabla;"), s.hbar = g(q, "\\hbar ", "&#8463;"), s.AA = s.Angstrom = s.angstrom = g(q, "\\text\\AA ", "&#8491;"), s.ring = s.circ = s.circle = g(q, "\\circ ", "&#8728;"), s.bull = s.bullet = g(q, "\\bullet ", "&bull;"), s.setminus = s.smallsetminus = g(q, "\\setminus ", "&#8726;"), s.not = s["¬"] = s.neg = g(q, "\\neg ", "&not;"), s["…"] = s.dots = s.ellip = s.hellip = s.ellipsis = s.hellipsis = g(q, "\\dots ", "&hellip;"), s.converges = s.darr = s.dnarr = s.dnarrow = s.downarrow = g(q, "\\downarrow ", "&darr;"), s.dArr = s.dnArr = s.dnArrow = s.Downarrow = g(q, "\\Downarrow ", "&dArr;"), s.diverges = s.uarr = s.uparrow = g(q, "\\uparrow ", "&uarr;"), s.uArr = s.Uparrow = g(q, "\\Uparrow ", "&uArr;"), s.to = g(Z, "\\to ", "&rarr;"), s.rarr = s.rightarrow = g(q, "\\rightarrow ", "&rarr;"), s.implies = g(Z, "\\Rightarrow ", "&rArr;"), s.rArr = s.Rightarrow = g(q, "\\Rightarrow ", "&rArr;"), s.gets = g(Z, "\\gets ", "&larr;"), s.larr = s.leftarrow = g(q, "\\leftarrow ", "&larr;"), s.impliedby = g(Z, "\\Leftarrow ", "&lArr;"), s.lArr = s.Leftarrow = g(q, "\\Leftarrow ", "&lArr;"), s.harr = s.lrarr = s.leftrightarrow = g(q, "\\leftrightarrow ", "&harr;"), s.iff = g(Z, "\\Leftrightarrow ", "&hArr;"), s.hArr = s.lrArr = s.Leftrightarrow = g(q, "\\Leftrightarrow ", "&hArr;"), s.Re = s.Real = s.real = g(q, "\\Re ", "&real;"), s.Im = s.imag = s.image = s.imagin = s.imaginary = s.Imaginary = g(q, "\\Im ", "&image;"), s.part = s.partial = g(q, "\\partial ", "&part;"), s.infty = s.infin = s.infinity = g(q, "\\infty ", "&infin;"), s.pounds = g(q, "\\pounds ", "&pound;"), s.alef = s.alefsym = s.aleph = s.alephsym = g(q, "\\aleph ", "&alefsym;"), s.xist = s.xists = s.exist = s.exists = g(q, "\\exists ", "&exist;"), s.nexists = s.nexist = g(q, "\\nexists ", "&#8708;"), s.and = s.land = s.wedge = g(Z, "\\wedge ", "&and;"), s.or = s.lor = s.vee = g(Z, "\\vee ", "&or;"), s.o = s.O = s.empty = s.emptyset = s.oslash = s.Oslash = s.nothing = s.varnothing = g(Z, "\\varnothing ", "&empty;"), s.cup = s.union = g(Z, "\\cup ", "&cup;"), s.cap = s.intersect = s.intersection = g(Z, "\\cap ", "&cap;"), s.deg = s.degree = g(q, "\\degree ", "&deg;"), s.ang = s.angle = g(q, "\\angle ", "&ang;"), s.measuredangle = g(q, "\\measuredangle ", "&#8737;");
            var Pn = L(q, function(c, d) {
              c.createLeftOf = function(n) {
                n.options.autoSubscriptNumerals && n.parent !== n.parent.parent.sub && (n[f] instanceof qt && n[f].isItalic !== !1 || n[f] instanceof qe && n[f][f] instanceof qt && n[f][f].isItalic !== !1) ? (s._().createLeftOf(n), d.createLeftOf.call(this, n), n.insRightOf(n.parent.parent)) : d.createLeftOf.call(this, n);
              };
            }), qt = L(ce, function(c, d) {
              c.init = function(n, r) {
                d.init.call(this, n, "<var>" + (r || n) + "</var>");
              }, c.text = function() {
                var n = this.ctrlSeq;
                return this.isPartOfOperator ? n[0] == "\\" ? n = n.slice(1, n.length) : n[n.length - 1] == " " && (n = n.slice(0, -1)) : (!this[f] || this[f] instanceof qt || this[f] instanceof Z || this[f].ctrlSeq === "\\ " || (n = "*" + n), !this[1] || this[1] instanceof Z || this[1] instanceof qe || (n += "*")), n;
              };
            });
            ee.p.autoCommands = { _maxLength: 0 }, Ce.autoCommands = function(c) {
              if (!/^[a-z]+(?: [a-z]+)*$/i.test(c))
                throw '"' + c + '" not a space-delimited list of only letters';
              for (var d = c.split(" "), n = {}, r = 0, l = 0; l < d.length; l += 1) {
                var y = d[l];
                if (y.length < 2)
                  throw 'autocommand "' + y + '" not minimum length of 2';
                if (s[y] === Dn)
                  throw '"' + y + '" is a built-in operator name';
                n[y] = 1, r = Ht(r, y.length);
              }
              return n._maxLength = r, n;
            };
            var Zt = L(qt, function(c, d) {
              function n(r) {
                return !r || r instanceof Z || r instanceof Fe;
              }
              c.init = function(r) {
                return d.init.call(this, this.letter = r);
              }, c.createLeftOf = function(r) {
                d.createLeftOf.apply(this, arguments);
                var l = r.options.autoCommands, y = l._maxLength;
                if (y > 0) {
                  for (var v = "", k = this, w = 0; k instanceof Zt && k.ctrlSeq === k.letter && w < y; )
                    v = k.letter + v, k = k[f], w += 1;
                  for (; v.length; ) {
                    if (l.hasOwnProperty(v)) {
                      for (w = 1, k = this; w < v.length; w += 1, k = k[f])
                        ;
                      return a(k, this).remove(), r[f] = k[f], s[v](v).createLeftOf(r);
                    }
                    v = v.slice(1);
                  }
                }
              }, c.italicize = function(r) {
                return this.isItalic = r, this.isPartOfOperator = !r, this.jQ.toggleClass("mq-operator-name", !r), this;
              }, c.finalizeTree = c.siblingDeleted = c.siblingCreated = function(r, l) {
                l !== f && this[1] instanceof Zt || this.autoUnItalicize(r);
              }, c.autoUnItalicize = function(r) {
                var l = r.autoOperatorNames;
                if (l._maxLength !== 0) {
                  for (var y = this.letter, v = this[f]; v instanceof Zt; v = v[f])
                    y = v.letter + y;
                  for (var k = this[1]; k instanceof Zt; k = k[1])
                    y += k.letter;
                  a(v[1] || this.parent.ends[f], k[f] || this.parent.ends[1]).each(function(Ct) {
                    Ct.italicize(!0).jQ.removeClass("mq-first mq-last mq-followed-by-supsub"), Ct.ctrlSeq = Ct.letter;
                  });
                  t:
                    for (var w = 0, O = v[1] || this.parent.ends[f]; w < y.length; w += 1, O = O[1])
                      for (var M = te(l._maxLength, y.length - w); M > 0; M -= 1) {
                        var V = y.slice(w, w + M);
                        if (l.hasOwnProperty(V)) {
                          for (var X = 0, ut = O; X < M; X += 1, ut = ut[1]) {
                            ut.italicize(!1);
                            var z = ut;
                          }
                          var mt = wn.hasOwnProperty(V);
                          if (O.ctrlSeq = (mt ? "\\" : "\\operatorname{") + O.ctrlSeq, z.ctrlSeq += mt ? " " : "}", ln.hasOwnProperty(V) && z[f][f][f].jQ.addClass("mq-last"), n(O[f]) || O.jQ.addClass("mq-first"), !n(z[1]))
                            if (z[1] instanceof qe) {
                              var rt = z[1];
                              (rt.siblingCreated = rt.siblingDeleted = function() {
                                rt.jQ.toggleClass("mq-after-operator-name", !(rt[1] instanceof Tt));
                              })();
                            } else
                              z.jQ.toggleClass("mq-last", !(z[1] instanceof Tt));
                          w += M - 1, O = z;
                          continue t;
                        }
                      }
                }
              };
            }), wn = {}, ye = ee.p.autoOperatorNames = { _maxLength: 9 }, ln = { limsup: 1, liminf: 1, projlim: 1, injlim: 1 };
            (function() {
              for (var c = "arg deg det dim exp gcd hom inf ker lg lim ln log max min sup limsup liminf injlim projlim Pr".split(" "), d = 0; d < c.length; d += 1)
                wn[c[d]] = ye[c[d]] = 1;
              var n = "sin cos tan arcsin arccos arctan sinh cosh tanh sec csc cot coth".split(" ");
              for (d = 0; d < n.length; d += 1)
                wn[n[d]] = 1;
              var r = "sin cos tan sec cosec csc cotan cot ctg".split(" ");
              for (d = 0; d < r.length; d += 1)
                ye[r[d]] = ye["arc" + r[d]] = ye[r[d] + "h"] = ye["ar" + r[d] + "h"] = ye["arc" + r[d] + "h"] = 1;
              var l = "gcf hcf lcm proj span".split(" ");
              for (d = 0; d < l.length; d += 1)
                ye[l[d]] = 1;
            })(), Ce.autoOperatorNames = function(c) {
              if (!/^[a-z]+(?: [a-z]+)*$/i.test(c))
                throw '"' + c + '" not a space-delimited list of only letters';
              for (var d = c.split(" "), n = {}, r = 0, l = 0; l < d.length; l += 1) {
                var y = d[l];
                if (y.length < 2)
                  throw '"' + y + '" not minimum length of 2';
                n[y] = 1, r = Ht(r, y.length);
              }
              return n._maxLength = r, n;
            };
            var Dn = L(ce, function(c, d) {
              c.init = function(n) {
                this.ctrlSeq = n;
              }, c.createLeftOf = function(n) {
                for (var r = this.ctrlSeq, l = 0; l < r.length; l += 1)
                  Zt(r.charAt(l)).createLeftOf(n);
              }, c.parser = function() {
                for (var n = this.ctrlSeq, r = Rt(), l = 0; l < n.length; l += 1)
                  Zt(n.charAt(l)).adopt(r, r.ends[1], 0);
                return J.succeed(r.children());
              };
            });
            for (var Qn in ye)
              ye.hasOwnProperty(Qn) && (s[Qn] = Dn);
            s.operatorname = L(jt, function(c) {
              c.createLeftOf = vt, c.numBlocks = function() {
                return 1;
              }, c.parser = function() {
                return Qt.block.map(function(d) {
                  return d.children();
                });
              };
            }), s.f = L(Zt, function(c, d) {
              c.init = function() {
                ce.p.init.call(this, this.letter = "f", '<var class="mq-f">f</var>');
              }, c.italicize = function(n) {
                return this.jQ.html("f").toggleClass("mq-f", n), d.italicize.apply(this, arguments);
              };
            }), s[" "] = s.space = g(q, "\\ ", "&nbsp;"), s["'"] = s.prime = g(q, "'", "&prime;"), s["″"] = s.dprime = g(q, "″", "&Prime;"), s.backslash = g(q, "\\backslash ", "\\"), xt["\\"] || (xt["\\"] = s.backslash), s.$ = g(q, "\\$", "$");
            var Ge = L(ce, function(c, d) {
              c.init = function(n, r) {
                d.init.call(this, n, '<span class="mq-nonSymbola">' + (r || n) + "</span>");
              };
            });
            s["@"] = Ge, s["&"] = g(Ge, "\\&", "&amp;"), s["%"] = g(Ge, "\\%", "%"), s.alpha = s.beta = s.gamma = s.delta = s.zeta = s.eta = s.theta = s.iota = s.kappa = s.mu = s.nu = s.xi = s.rho = s.sigma = s.tau = s.chi = s.psi = s.omega = L(qt, function(c, d) {
              c.init = function(n) {
                d.init.call(this, "\\" + n + " ", "&" + n + ";");
              };
            }), s.phi = g(qt, "\\phi ", "&#981;"), s.phiv = s.varphi = g(qt, "\\varphi ", "&phi;"), s.epsilon = g(qt, "\\epsilon ", "&#1013;"), s.epsiv = s.varepsilon = g(qt, "\\varepsilon ", "&epsilon;"), s.piv = s.varpi = g(qt, "\\varpi ", "&piv;"), s.sigmaf = s.sigmav = s.varsigma = g(qt, "\\varsigma ", "&sigmaf;"), s.thetav = s.vartheta = s.thetasym = g(qt, "\\vartheta ", "&thetasym;"), s.upsilon = s.upsi = g(qt, "\\upsilon ", "&upsilon;"), s.gammad = s.Gammad = s.digamma = g(qt, "\\digamma ", "&#989;"), s.kappav = s.varkappa = g(qt, "\\varkappa ", "&#1008;"), s.rhov = s.varrho = g(qt, "\\varrho ", "&#1009;"), s.pi = s.π = g(Ge, "\\pi ", "&pi;"), s.lambda = g(Ge, "\\lambda ", "&lambda;"), s.Upsilon = s.Upsi = s.upsih = s.Upsih = g(ce, "\\Upsilon ", '<var style="font-family: serif">&upsih;</var>'), s.Gamma = s.Delta = s.Theta = s.Lambda = s.Xi = s.Pi = s.Sigma = s.Phi = s.Psi = s.Omega = s.forall = L(q, function(c, d) {
              c.init = function(n) {
                d.init.call(this, "\\" + n + " ", "&" + n + ";");
              };
            });
            var ze = L(jt, function(c) {
              c.init = function(d) {
                this.latex = d;
              }, c.createLeftOf = function(d) {
                var n = Qt.parse(this.latex);
                n.children().adopt(d.parent, d[f], d[1]), d[f] = n.ends[1], n.jQize().insertBefore(d.jQ), n.finalizeInsert(d.options, d), n.ends[1][1].siblingCreated && n.ends[1][1].siblingCreated(d.options, f), n.ends[f][f].siblingCreated && n.ends[f][f].siblingCreated(d.options, 1), d.parent.bubble("reflow");
              }, c.parser = function() {
                var d = Qt.parse(this.latex).children();
                return J.succeed(d);
              };
            });
            s["¹"] = g(ze, "^1"), s["²"] = g(ze, "^2"), s["³"] = g(ze, "^3"), s["¼"] = g(ze, "\\frac14"), s["½"] = g(ze, "\\frac12"), s["¾"] = g(ze, "\\frac34");
            var cn = L(Z, function(c) {
              c.init = q.prototype.init, c.contactWeld = c.siblingCreated = c.siblingDeleted = function(d, n) {
                if (n !== 1)
                  return this.jQ[0].className = function r(l) {
                    return l[f] ? l[f] instanceof Z || /^[,;:\(\[]$/.test(l[f].ctrlSeq) ? "" : "mq-binary-operator" : l.parent && l.parent.parent && l.parent.parent.isStyleBlock() ? r(l.parent.parent) : "";
                  }(this), this;
              };
            });
            s["+"] = g(cn, "+", "+"), s["–"] = s["-"] = g(cn, "-", "&minus;"), s["±"] = s.pm = s.plusmn = s.plusminus = g(cn, "\\pm ", "&plusmn;"), s.mp = s.mnplus = s.minusplus = g(cn, "\\mp ", "&#8723;"), xt["*"] = s.sdot = s.cdot = g(Z, "\\cdot ", "&middot;", "*");
            var Je = L(Z, function(c, d) {
              c.init = function(n, r) {
                this.data = n, this.strict = r;
                var l = r ? "Strict" : "";
                d.init.call(this, n["ctrlSeq" + l], n["html" + l], n["text" + l]);
              }, c.swap = function(n) {
                this.strict = n;
                var r = n ? "Strict" : "";
                this.ctrlSeq = this.data["ctrlSeq" + r], this.jQ.html(this.data["html" + r]), this.textTemplate = [this.data["text" + r]];
              }, c.deleteTowards = function(n, r) {
                if (n === f && !this.strict)
                  return this.swap(!0), void this.bubble("reflow");
                d.deleteTowards.apply(this, arguments);
              };
            }), kn = { ctrlSeq: "\\le ", html: "&le;", text: "≤", ctrlSeqStrict: "<", htmlStrict: "&lt;", textStrict: "<" }, Rn = { ctrlSeq: "\\ge ", html: "&ge;", text: "≥", ctrlSeqStrict: ">", htmlStrict: "&gt;", textStrict: ">" };
            s["<"] = s.lt = g(Je, kn, !0), s[">"] = s.gt = g(Je, Rn, !0), s["≤"] = s.le = s.leq = g(Je, kn, !1), s["≥"] = s.ge = s.geq = g(Je, Rn, !1);
            var He = L(Z, function(c, d) {
              c.init = function() {
                d.init.call(this, "=", "=");
              }, c.createLeftOf = function(n) {
                if (n[f] instanceof Je && n[f].strict)
                  return n[f].swap(!1), void n[f].bubble("reflow");
                d.createLeftOf.apply(this, arguments);
              };
            });
            s["="] = He, s["×"] = s.times = g(Z, "\\times ", "&times;", "[x]"), s["÷"] = s.div = s.divide = s.divides = g(Z, "\\div ", "&divide;", "[/]"), xt["~"] = s.sim = g(Z, "\\sim ", "~", "~");
            var un = je(1);
            for (var dn in un)
              (function(c, d) {
                typeof d == "function" ? (ne[c] = function() {
                  return Ue(), d.apply(this, arguments);
                }, ne[c].prototype = d.prototype) : ne[c] = d;
              })(dn, un[dn]);
          }(), ot.exports = window.MathQuill;
        }, 755: function(ot, yt) {
          var K;
          (function(I, at) {
            typeof ot.exports == "object" ? ot.exports = I.document ? at(I, !0) : function(st) {
              if (!st.document)
                throw new Error("jQuery requires a window with a document");
              return at(st);
            } : at(I);
          })(typeof window < "u" ? window : this, function(I, at) {
            var st = [], dt = Object.getPrototypeOf, ht = st.slice, te = st.flat ? function(t) {
              return st.flat.call(t);
            } : function(t) {
              return st.concat.apply([], t);
            }, Ht = st.push, vt = st.indexOf, Xt = {}, ct = Xt.toString, Gt = Xt.hasOwnProperty, Jt = Gt.toString, g = Jt.call(Object), F = {}, L = function(t) {
              return typeof t == "function" && typeof t.nodeType != "number" && typeof t.item != "function";
            }, f = function(t) {
              return t != null && t === t.window;
            }, U = I.document, lt = { type: !0, src: !0, nonce: !0, noModule: !0 };
            function At(t, e, i) {
              var o, u, p = (i = i || U).createElement("script");
              if (p.text = t, e)
                for (o in lt)
                  (u = e[o] || e.getAttribute && e.getAttribute(o)) && p.setAttribute(o, u);
              i.head.appendChild(p).parentNode.removeChild(p);
            }
            function gt(t) {
              return t == null ? t + "" : typeof t == "object" || typeof t == "function" ? Xt[ct.call(t)] || "object" : typeof t;
            }
            var le = "3.6.0", a = function(t, e) {
              return new a.fn.init(t, e);
            };
            function s(t) {
              var e = !!t && "length" in t && t.length, i = gt(t);
              return !L(t) && !f(t) && (i === "array" || e === 0 || typeof e == "number" && e > 0 && e - 1 in t);
            }
            a.fn = a.prototype = { jquery: le, constructor: a, length: 0, toArray: function() {
              return ht.call(this);
            }, get: function(t) {
              return t == null ? ht.call(this) : t < 0 ? this[t + this.length] : this[t];
            }, pushStack: function(t) {
              var e = a.merge(this.constructor(), t);
              return e.prevObject = this, e;
            }, each: function(t) {
              return a.each(this, t);
            }, map: function(t) {
              return this.pushStack(a.map(this, function(e, i) {
                return t.call(e, i, e);
              }));
            }, slice: function() {
              return this.pushStack(ht.apply(this, arguments));
            }, first: function() {
              return this.eq(0);
            }, last: function() {
              return this.eq(-1);
            }, even: function() {
              return this.pushStack(a.grep(this, function(t, e) {
                return (e + 1) % 2;
              }));
            }, odd: function() {
              return this.pushStack(a.grep(this, function(t, e) {
                return e % 2;
              }));
            }, eq: function(t) {
              var e = this.length, i = +t + (t < 0 ? e : 0);
              return this.pushStack(i >= 0 && i < e ? [this[i]] : []);
            }, end: function() {
              return this.prevObject || this.constructor();
            }, push: Ht, sort: st.sort, splice: st.splice }, a.extend = a.fn.extend = function() {
              var t, e, i, o, u, p, h = arguments[0] || {}, x = 1, _ = arguments.length, T = !1;
              for (typeof h == "boolean" && (T = h, h = arguments[x] || {}, x++), typeof h == "object" || L(h) || (h = {}), x === _ && (h = this, x--); x < _; x++)
                if ((t = arguments[x]) != null)
                  for (e in t)
                    o = t[e], e !== "__proto__" && h !== o && (T && o && (a.isPlainObject(o) || (u = Array.isArray(o))) ? (i = h[e], p = u && !Array.isArray(i) ? [] : u || a.isPlainObject(i) ? i : {}, u = !1, h[e] = a.extend(T, p, o)) : o !== void 0 && (h[e] = o));
              return h;
            }, a.extend({ expando: "jQuery" + (le + Math.random()).replace(/\D/g, ""), isReady: !0, error: function(t) {
              throw new Error(t);
            }, noop: function() {
            }, isPlainObject: function(t) {
              var e, i;
              return !(!t || ct.call(t) !== "[object Object]" || (e = dt(t)) && (typeof (i = Gt.call(e, "constructor") && e.constructor) != "function" || Jt.call(i) !== g));
            }, isEmptyObject: function(t) {
              var e;
              for (e in t)
                return !1;
              return !0;
            }, globalEval: function(t, e, i) {
              At(t, { nonce: e && e.nonce }, i);
            }, each: function(t, e) {
              var i, o = 0;
              if (s(t))
                for (i = t.length; o < i && e.call(t[o], o, t[o]) !== !1; o++)
                  ;
              else
                for (o in t)
                  if (e.call(t[o], o, t[o]) === !1)
                    break;
              return t;
            }, makeArray: function(t, e) {
              var i = e || [];
              return t != null && (s(Object(t)) ? a.merge(i, typeof t == "string" ? [t] : t) : Ht.call(i, t)), i;
            }, inArray: function(t, e, i) {
              return e == null ? -1 : vt.call(e, t, i);
            }, merge: function(t, e) {
              for (var i = +e.length, o = 0, u = t.length; o < i; o++)
                t[u++] = e[o];
              return t.length = u, t;
            }, grep: function(t, e, i) {
              for (var o = [], u = 0, p = t.length, h = !i; u < p; u++)
                !e(t[u], u) !== h && o.push(t[u]);
              return o;
            }, map: function(t, e, i) {
              var o, u, p = 0, h = [];
              if (s(t))
                for (o = t.length; p < o; p++)
                  (u = e(t[p], p, i)) != null && h.push(u);
              else
                for (p in t)
                  (u = e(t[p], p, i)) != null && h.push(u);
              return te(h);
            }, guid: 1, support: F }), typeof Symbol == "function" && (a.fn[Symbol.iterator] = st[Symbol.iterator]), a.each("Boolean Number String Function Array Date RegExp Object Error Symbol".split(" "), function(t, e) {
              Xt["[object " + e + "]"] = e.toLowerCase();
            });
            var xt = function(t) {
              var e, i, o, u, p, h, x, _, T, A, D, S, E, H, Y, W, St, Vt, ge, wt = "sizzle" + 1 * /* @__PURE__ */ new Date(), nt = t.document, ue = 0, ft = 0, Et = Bn(), Tn = Bn(), In = Bn(), be = Bn(), en = function(m, b) {
                return m === b && (D = !0), 0;
              }, hn = {}.hasOwnProperty, de = [], mn = de.pop, _e = de.push, Lt = de.push, ve = de.slice, xe = function(m, b) {
                for (var C = 0, P = m.length; C < P; C++)
                  if (m[C] === b)
                    return C;
                return -1;
              }, De = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped", Ft = "[\\x20\\t\\r\\n\\f]", bt = "(?:\\\\[\\da-fA-F]{1,6}[\\x20\\t\\r\\n\\f]?|\\\\[^\\r\\n\\f]|[\\w-]|[^\0-\\x7f])+", Ut = "\\[[\\x20\\t\\r\\n\\f]*(" + bt + ")(?:" + Ft + "*([*^$|!~]?=)" + Ft + `*(?:'((?:\\\\.|[^\\\\'])*)'|"((?:\\\\.|[^\\\\"])*)"|(` + bt + "))|)" + Ft + "*\\]", we = ":(" + bt + `)(?:\\((('((?:\\\\.|[^\\\\'])*)'|"((?:\\\\.|[^\\\\"])*)")|((?:\\\\.|[^\\\\()[\\]]|` + Ut + ")*)|.*)\\)|)", Bt = new RegExp(Ft + "+", "g"), ke = new RegExp("^[\\x20\\t\\r\\n\\f]+|((?:^|[^\\\\])(?:\\\\.)*)[\\x20\\t\\r\\n\\f]+$", "g"), fn = new RegExp("^[\\x20\\t\\r\\n\\f]*,[\\x20\\t\\r\\n\\f]*"), Nn = new RegExp("^[\\x20\\t\\r\\n\\f]*([>+~]|[\\x20\\t\\r\\n\\f])[\\x20\\t\\r\\n\\f]*"), $r = new RegExp(Ft + "|>"), Xr = new RegExp(we), Kr = new RegExp("^" + bt + "$"), Fn = { ID: new RegExp("^#(" + bt + ")"), CLASS: new RegExp("^\\.(" + bt + ")"), TAG: new RegExp("^(" + bt + "|[*])"), ATTR: new RegExp("^" + Ut), PSEUDO: new RegExp("^" + we), CHILD: new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\([\\x20\\t\\r\\n\\f]*(even|odd|(([+-]|)(\\d*)n|)[\\x20\\t\\r\\n\\f]*(?:([+-]|)[\\x20\\t\\r\\n\\f]*(\\d+)|))[\\x20\\t\\r\\n\\f]*\\)|)", "i"), bool: new RegExp("^(?:" + De + ")$", "i"), needsContext: new RegExp("^[\\x20\\t\\r\\n\\f]*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\([\\x20\\t\\r\\n\\f]*((?:-\\d)?\\d*)[\\x20\\t\\r\\n\\f]*\\)|)(?=[^-]|$)", "i") }, Yr = /HTML$/i, Gr = /^(?:input|select|textarea|button)$/i, Jr = /^h\d$/i, qn = /^[^{]+\{\s*\[native \w/, Zr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/, rr = /[+~]/, We = new RegExp("\\\\[\\da-fA-F]{1,6}[\\x20\\t\\r\\n\\f]?|\\\\([^\\r\\n\\f])", "g"), Ve = function(m, b) {
                var C = "0x" + m.slice(1) - 65536;
                return b || (C < 0 ? String.fromCharCode(C + 65536) : String.fromCharCode(C >> 10 | 55296, 1023 & C | 56320));
              }, _r = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g, Cr = function(m, b) {
                return b ? m === "\0" ? "�" : m.slice(0, -1) + "\\" + m.charCodeAt(m.length - 1).toString(16) + " " : "\\" + m;
              }, jr = function() {
                S();
              }, ti = Hn(function(m) {
                return m.disabled === !0 && m.nodeName.toLowerCase() === "fieldset";
              }, { dir: "parentNode", next: "legend" });
              try {
                Lt.apply(de = ve.call(nt.childNodes), nt.childNodes), de[nt.childNodes.length].nodeType;
              } catch {
                Lt = { apply: de.length ? function(b, C) {
                  _e.apply(b, ve.call(C));
                } : function(b, C) {
                  for (var P = b.length, j = 0; b[P++] = C[j++]; )
                    ;
                  b.length = P - 1;
                } };
              }
              function kt(m, b, C, P) {
                var j, Q, R, N, B, tt, et, G = b && b.ownerDocument, pt = b ? b.nodeType : 9;
                if (C = C || [], typeof m != "string" || !m || pt !== 1 && pt !== 9 && pt !== 11)
                  return C;
                if (!P && (S(b), b = b || E, Y)) {
                  if (pt !== 11 && (B = Zr.exec(m)))
                    if (j = B[1]) {
                      if (pt === 9) {
                        if (!(R = b.getElementById(j)))
                          return C;
                        if (R.id === j)
                          return C.push(R), C;
                      } else if (G && (R = G.getElementById(j)) && ge(b, R) && R.id === j)
                        return C.push(R), C;
                    } else {
                      if (B[2])
                        return Lt.apply(C, b.getElementsByTagName(m)), C;
                      if ((j = B[3]) && i.getElementsByClassName && b.getElementsByClassName)
                        return Lt.apply(C, b.getElementsByClassName(j)), C;
                    }
                  if (i.qsa && !be[m + " "] && (!W || !W.test(m)) && (pt !== 1 || b.nodeName.toLowerCase() !== "object")) {
                    if (et = m, G = b, pt === 1 && ($r.test(m) || Nn.test(m))) {
                      for ((G = rr.test(m) && or(b.parentNode) || b) === b && i.scope || ((N = b.getAttribute("id")) ? N = N.replace(_r, Cr) : b.setAttribute("id", N = wt)), Q = (tt = h(m)).length; Q--; )
                        tt[Q] = (N ? "#" + N : ":scope") + " " + zn(tt[Q]);
                      et = tt.join(",");
                    }
                    try {
                      return Lt.apply(C, G.querySelectorAll(et)), C;
                    } catch {
                      be(m, !0);
                    } finally {
                      N === wt && b.removeAttribute("id");
                    }
                  }
                }
                return _(m.replace(ke, "$1"), b, C, P);
              }
              function Bn() {
                var m = [];
                return function b(C, P) {
                  return m.push(C + " ") > o.cacheLength && delete b[m.shift()], b[C + " "] = P;
                };
              }
              function Ee(m) {
                return m[wt] = !0, m;
              }
              function Le(m) {
                var b = E.createElement("fieldset");
                try {
                  return !!m(b);
                } catch {
                  return !1;
                } finally {
                  b.parentNode && b.parentNode.removeChild(b), b = null;
                }
              }
              function ir(m, b) {
                for (var C = m.split("|"), P = C.length; P--; )
                  o.attrHandle[C[P]] = b;
              }
              function Tr(m, b) {
                var C = b && m, P = C && m.nodeType === 1 && b.nodeType === 1 && m.sourceIndex - b.sourceIndex;
                if (P)
                  return P;
                if (C) {
                  for (; C = C.nextSibling; )
                    if (C === b)
                      return -1;
                }
                return m ? 1 : -1;
              }
              function ei(m) {
                return function(b) {
                  return b.nodeName.toLowerCase() === "input" && b.type === m;
                };
              }
              function ni(m) {
                return function(b) {
                  var C = b.nodeName.toLowerCase();
                  return (C === "input" || C === "button") && b.type === m;
                };
              }
              function qr(m) {
                return function(b) {
                  return "form" in b ? b.parentNode && b.disabled === !1 ? "label" in b ? "label" in b.parentNode ? b.parentNode.disabled === m : b.disabled === m : b.isDisabled === m || b.isDisabled !== !m && ti(b) === m : b.disabled === m : "label" in b && b.disabled === m;
                };
              }
              function nn(m) {
                return Ee(function(b) {
                  return b = +b, Ee(function(C, P) {
                    for (var j, Q = m([], C.length, b), R = Q.length; R--; )
                      C[j = Q[R]] && (C[j] = !(P[j] = C[j]));
                  });
                });
              }
              function or(m) {
                return m && m.getElementsByTagName !== void 0 && m;
              }
              for (e in i = kt.support = {}, p = kt.isXML = function(m) {
                var b = m && m.namespaceURI, C = m && (m.ownerDocument || m).documentElement;
                return !Yr.test(b || C && C.nodeName || "HTML");
              }, S = kt.setDocument = function(m) {
                var b, C, P = m ? m.ownerDocument || m : nt;
                return P != E && P.nodeType === 9 && P.documentElement && (H = (E = P).documentElement, Y = !p(E), nt != E && (C = E.defaultView) && C.top !== C && (C.addEventListener ? C.addEventListener("unload", jr, !1) : C.attachEvent && C.attachEvent("onunload", jr)), i.scope = Le(function(j) {
                  return H.appendChild(j).appendChild(E.createElement("div")), j.querySelectorAll !== void 0 && !j.querySelectorAll(":scope fieldset div").length;
                }), i.attributes = Le(function(j) {
                  return j.className = "i", !j.getAttribute("className");
                }), i.getElementsByTagName = Le(function(j) {
                  return j.appendChild(E.createComment("")), !j.getElementsByTagName("*").length;
                }), i.getElementsByClassName = qn.test(E.getElementsByClassName), i.getById = Le(function(j) {
                  return H.appendChild(j).id = wt, !E.getElementsByName || !E.getElementsByName(wt).length;
                }), i.getById ? (o.filter.ID = function(j) {
                  var Q = j.replace(We, Ve);
                  return function(R) {
                    return R.getAttribute("id") === Q;
                  };
                }, o.find.ID = function(j, Q) {
                  if (Q.getElementById !== void 0 && Y) {
                    var R = Q.getElementById(j);
                    return R ? [R] : [];
                  }
                }) : (o.filter.ID = function(j) {
                  var Q = j.replace(We, Ve);
                  return function(R) {
                    var N = R.getAttributeNode !== void 0 && R.getAttributeNode("id");
                    return N && N.value === Q;
                  };
                }, o.find.ID = function(j, Q) {
                  if (Q.getElementById !== void 0 && Y) {
                    var R, N, B, tt = Q.getElementById(j);
                    if (tt) {
                      if ((R = tt.getAttributeNode("id")) && R.value === j)
                        return [tt];
                      for (B = Q.getElementsByName(j), N = 0; tt = B[N++]; )
                        if ((R = tt.getAttributeNode("id")) && R.value === j)
                          return [tt];
                    }
                    return [];
                  }
                }), o.find.TAG = i.getElementsByTagName ? function(j, Q) {
                  return Q.getElementsByTagName !== void 0 ? Q.getElementsByTagName(j) : i.qsa ? Q.querySelectorAll(j) : void 0;
                } : function(j, Q) {
                  var R, N = [], B = 0, tt = Q.getElementsByTagName(j);
                  if (j === "*") {
                    for (; R = tt[B++]; )
                      R.nodeType === 1 && N.push(R);
                    return N;
                  }
                  return tt;
                }, o.find.CLASS = i.getElementsByClassName && function(j, Q) {
                  if (Q.getElementsByClassName !== void 0 && Y)
                    return Q.getElementsByClassName(j);
                }, St = [], W = [], (i.qsa = qn.test(E.querySelectorAll)) && (Le(function(j) {
                  var Q;
                  H.appendChild(j).innerHTML = "<a id='" + wt + "'></a><select id='" + wt + "-\r\\' msallowcapture=''><option selected=''></option></select>", j.querySelectorAll("[msallowcapture^='']").length && W.push(`[*^$]=[\\x20\\t\\r\\n\\f]*(?:''|"")`), j.querySelectorAll("[selected]").length || W.push("\\[[\\x20\\t\\r\\n\\f]*(?:value|" + De + ")"), j.querySelectorAll("[id~=" + wt + "-]").length || W.push("~="), (Q = E.createElement("input")).setAttribute("name", ""), j.appendChild(Q), j.querySelectorAll("[name='']").length || W.push(`\\[[\\x20\\t\\r\\n\\f]*name[\\x20\\t\\r\\n\\f]*=[\\x20\\t\\r\\n\\f]*(?:''|"")`), j.querySelectorAll(":checked").length || W.push(":checked"), j.querySelectorAll("a#" + wt + "+*").length || W.push(".#.+[+~]"), j.querySelectorAll("\\\f"), W.push("[\\r\\n\\f]");
                }), Le(function(j) {
                  j.innerHTML = "<a href='' disabled='disabled'></a><select disabled='disabled'><option/></select>";
                  var Q = E.createElement("input");
                  Q.setAttribute("type", "hidden"), j.appendChild(Q).setAttribute("name", "D"), j.querySelectorAll("[name=d]").length && W.push("name[\\x20\\t\\r\\n\\f]*[*^$|!~]?="), j.querySelectorAll(":enabled").length !== 2 && W.push(":enabled", ":disabled"), H.appendChild(j).disabled = !0, j.querySelectorAll(":disabled").length !== 2 && W.push(":enabled", ":disabled"), j.querySelectorAll("*,:x"), W.push(",.*:");
                })), (i.matchesSelector = qn.test(Vt = H.matches || H.webkitMatchesSelector || H.mozMatchesSelector || H.oMatchesSelector || H.msMatchesSelector)) && Le(function(j) {
                  i.disconnectedMatch = Vt.call(j, "*"), Vt.call(j, "[s!='']:x"), St.push("!=", we);
                }), W = W.length && new RegExp(W.join("|")), St = St.length && new RegExp(St.join("|")), b = qn.test(H.compareDocumentPosition), ge = b || qn.test(H.contains) ? function(j, Q) {
                  var R = j.nodeType === 9 ? j.documentElement : j, N = Q && Q.parentNode;
                  return j === N || !(!N || N.nodeType !== 1 || !(R.contains ? R.contains(N) : j.compareDocumentPosition && 16 & j.compareDocumentPosition(N)));
                } : function(j, Q) {
                  if (Q) {
                    for (; Q = Q.parentNode; )
                      if (Q === j)
                        return !0;
                  }
                  return !1;
                }, en = b ? function(j, Q) {
                  if (j === Q)
                    return D = !0, 0;
                  var R = !j.compareDocumentPosition - !Q.compareDocumentPosition;
                  return R || (1 & (R = (j.ownerDocument || j) == (Q.ownerDocument || Q) ? j.compareDocumentPosition(Q) : 1) || !i.sortDetached && Q.compareDocumentPosition(j) === R ? j == E || j.ownerDocument == nt && ge(nt, j) ? -1 : Q == E || Q.ownerDocument == nt && ge(nt, Q) ? 1 : A ? xe(A, j) - xe(A, Q) : 0 : 4 & R ? -1 : 1);
                } : function(j, Q) {
                  if (j === Q)
                    return D = !0, 0;
                  var R, N = 0, B = j.parentNode, tt = Q.parentNode, et = [j], G = [Q];
                  if (!B || !tt)
                    return j == E ? -1 : Q == E ? 1 : B ? -1 : tt ? 1 : A ? xe(A, j) - xe(A, Q) : 0;
                  if (B === tt)
                    return Tr(j, Q);
                  for (R = j; R = R.parentNode; )
                    et.unshift(R);
                  for (R = Q; R = R.parentNode; )
                    G.unshift(R);
                  for (; et[N] === G[N]; )
                    N++;
                  return N ? Tr(et[N], G[N]) : et[N] == nt ? -1 : G[N] == nt ? 1 : 0;
                }), E;
              }, kt.matches = function(m, b) {
                return kt(m, null, null, b);
              }, kt.matchesSelector = function(m, b) {
                if (S(m), i.matchesSelector && Y && !be[b + " "] && (!St || !St.test(b)) && (!W || !W.test(b)))
                  try {
                    var C = Vt.call(m, b);
                    if (C || i.disconnectedMatch || m.document && m.document.nodeType !== 11)
                      return C;
                  } catch {
                    be(b, !0);
                  }
                return kt(b, E, null, [m]).length > 0;
              }, kt.contains = function(m, b) {
                return (m.ownerDocument || m) != E && S(m), ge(m, b);
              }, kt.attr = function(m, b) {
                (m.ownerDocument || m) != E && S(m);
                var C = o.attrHandle[b.toLowerCase()], P = C && hn.call(o.attrHandle, b.toLowerCase()) ? C(m, b, !Y) : void 0;
                return P !== void 0 ? P : i.attributes || !Y ? m.getAttribute(b) : (P = m.getAttributeNode(b)) && P.specified ? P.value : null;
              }, kt.escape = function(m) {
                return (m + "").replace(_r, Cr);
              }, kt.error = function(m) {
                throw new Error("Syntax error, unrecognized expression: " + m);
              }, kt.uniqueSort = function(m) {
                var b, C = [], P = 0, j = 0;
                if (D = !i.detectDuplicates, A = !i.sortStable && m.slice(0), m.sort(en), D) {
                  for (; b = m[j++]; )
                    b === m[j] && (P = C.push(j));
                  for (; P--; )
                    m.splice(C[P], 1);
                }
                return A = null, m;
              }, u = kt.getText = function(m) {
                var b, C = "", P = 0, j = m.nodeType;
                if (j) {
                  if (j === 1 || j === 9 || j === 11) {
                    if (typeof m.textContent == "string")
                      return m.textContent;
                    for (m = m.firstChild; m; m = m.nextSibling)
                      C += u(m);
                  } else if (j === 3 || j === 4)
                    return m.nodeValue;
                } else
                  for (; b = m[P++]; )
                    C += u(b);
                return C;
              }, o = kt.selectors = { cacheLength: 50, createPseudo: Ee, match: Fn, attrHandle: {}, find: {}, relative: { ">": { dir: "parentNode", first: !0 }, " ": { dir: "parentNode" }, "+": { dir: "previousSibling", first: !0 }, "~": { dir: "previousSibling" } }, preFilter: { ATTR: function(m) {
                return m[1] = m[1].replace(We, Ve), m[3] = (m[3] || m[4] || m[5] || "").replace(We, Ve), m[2] === "~=" && (m[3] = " " + m[3] + " "), m.slice(0, 4);
              }, CHILD: function(m) {
                return m[1] = m[1].toLowerCase(), m[1].slice(0, 3) === "nth" ? (m[3] || kt.error(m[0]), m[4] = +(m[4] ? m[5] + (m[6] || 1) : 2 * (m[3] === "even" || m[3] === "odd")), m[5] = +(m[7] + m[8] || m[3] === "odd")) : m[3] && kt.error(m[0]), m;
              }, PSEUDO: function(m) {
                var b, C = !m[6] && m[2];
                return Fn.CHILD.test(m[0]) ? null : (m[3] ? m[2] = m[4] || m[5] || "" : C && Xr.test(C) && (b = h(C, !0)) && (b = C.indexOf(")", C.length - b) - C.length) && (m[0] = m[0].slice(0, b), m[2] = C.slice(0, b)), m.slice(0, 3));
              } }, filter: { TAG: function(m) {
                var b = m.replace(We, Ve).toLowerCase();
                return m === "*" ? function() {
                  return !0;
                } : function(C) {
                  return C.nodeName && C.nodeName.toLowerCase() === b;
                };
              }, CLASS: function(m) {
                var b = Et[m + " "];
                return b || (b = new RegExp("(^|[\\x20\\t\\r\\n\\f])" + m + "(" + Ft + "|$)")) && Et(m, function(C) {
                  return b.test(typeof C.className == "string" && C.className || C.getAttribute !== void 0 && C.getAttribute("class") || "");
                });
              }, ATTR: function(m, b, C) {
                return function(P) {
                  var j = kt.attr(P, m);
                  return j == null ? b === "!=" : !b || (j += "", b === "=" ? j === C : b === "!=" ? j !== C : b === "^=" ? C && j.indexOf(C) === 0 : b === "*=" ? C && j.indexOf(C) > -1 : b === "$=" ? C && j.slice(-C.length) === C : b === "~=" ? (" " + j.replace(Bt, " ") + " ").indexOf(C) > -1 : b === "|=" && (j === C || j.slice(0, C.length + 1) === C + "-"));
                };
              }, CHILD: function(m, b, C, P, j) {
                var Q = m.slice(0, 3) !== "nth", R = m.slice(-4) !== "last", N = b === "of-type";
                return P === 1 && j === 0 ? function(B) {
                  return !!B.parentNode;
                } : function(B, tt, et) {
                  var G, pt, Mt, it, $t, Yt, oe = Q !== R ? "nextSibling" : "previousSibling", _t = B.parentNode, Qe = N && B.nodeName.toLowerCase(), ie = !et && !N, zt = !1;
                  if (_t) {
                    if (Q) {
                      for (; oe; ) {
                        for (it = B; it = it[oe]; )
                          if (N ? it.nodeName.toLowerCase() === Qe : it.nodeType === 1)
                            return !1;
                        Yt = oe = m === "only" && !Yt && "nextSibling";
                      }
                      return !0;
                    }
                    if (Yt = [R ? _t.firstChild : _t.lastChild], R && ie) {
                      for (zt = ($t = (G = (pt = (Mt = (it = _t)[wt] || (it[wt] = {}))[it.uniqueID] || (Mt[it.uniqueID] = {}))[m] || [])[0] === ue && G[1]) && G[2], it = $t && _t.childNodes[$t]; it = ++$t && it && it[oe] || (zt = $t = 0) || Yt.pop(); )
                        if (it.nodeType === 1 && ++zt && it === B) {
                          pt[m] = [ue, $t, zt];
                          break;
                        }
                    } else if (ie && (zt = $t = (G = (pt = (Mt = (it = B)[wt] || (it[wt] = {}))[it.uniqueID] || (Mt[it.uniqueID] = {}))[m] || [])[0] === ue && G[1]), zt === !1)
                      for (; (it = ++$t && it && it[oe] || (zt = $t = 0) || Yt.pop()) && ((N ? it.nodeName.toLowerCase() !== Qe : it.nodeType !== 1) || !++zt || (ie && ((pt = (Mt = it[wt] || (it[wt] = {}))[it.uniqueID] || (Mt[it.uniqueID] = {}))[m] = [ue, zt]), it !== B)); )
                        ;
                    return (zt -= j) === P || zt % P == 0 && zt / P >= 0;
                  }
                };
              }, PSEUDO: function(m, b) {
                var C, P = o.pseudos[m] || o.setFilters[m.toLowerCase()] || kt.error("unsupported pseudo: " + m);
                return P[wt] ? P(b) : P.length > 1 ? (C = [m, m, "", b], o.setFilters.hasOwnProperty(m.toLowerCase()) ? Ee(function(j, Q) {
                  for (var R, N = P(j, b), B = N.length; B--; )
                    j[R = xe(j, N[B])] = !(Q[R] = N[B]);
                }) : function(j) {
                  return P(j, 0, C);
                }) : P;
              } }, pseudos: { not: Ee(function(m) {
                var b = [], C = [], P = x(m.replace(ke, "$1"));
                return P[wt] ? Ee(function(j, Q, R, N) {
                  for (var B, tt = P(j, null, N, []), et = j.length; et--; )
                    (B = tt[et]) && (j[et] = !(Q[et] = B));
                }) : function(j, Q, R) {
                  return b[0] = j, P(b, null, R, C), b[0] = null, !C.pop();
                };
              }), has: Ee(function(m) {
                return function(b) {
                  return kt(m, b).length > 0;
                };
              }), contains: Ee(function(m) {
                return m = m.replace(We, Ve), function(b) {
                  return (b.textContent || u(b)).indexOf(m) > -1;
                };
              }), lang: Ee(function(m) {
                return Kr.test(m || "") || kt.error("unsupported lang: " + m), m = m.replace(We, Ve).toLowerCase(), function(b) {
                  var C;
                  do
                    if (C = Y ? b.lang : b.getAttribute("xml:lang") || b.getAttribute("lang"))
                      return (C = C.toLowerCase()) === m || C.indexOf(m + "-") === 0;
                  while ((b = b.parentNode) && b.nodeType === 1);
                  return !1;
                };
              }), target: function(m) {
                var b = t.location && t.location.hash;
                return b && b.slice(1) === m.id;
              }, root: function(m) {
                return m === H;
              }, focus: function(m) {
                return m === E.activeElement && (!E.hasFocus || E.hasFocus()) && !!(m.type || m.href || ~m.tabIndex);
              }, enabled: qr(!1), disabled: qr(!0), checked: function(m) {
                var b = m.nodeName.toLowerCase();
                return b === "input" && !!m.checked || b === "option" && !!m.selected;
              }, selected: function(m) {
                return m.parentNode && m.parentNode.selectedIndex, m.selected === !0;
              }, empty: function(m) {
                for (m = m.firstChild; m; m = m.nextSibling)
                  if (m.nodeType < 6)
                    return !1;
                return !0;
              }, parent: function(m) {
                return !o.pseudos.empty(m);
              }, header: function(m) {
                return Jr.test(m.nodeName);
              }, input: function(m) {
                return Gr.test(m.nodeName);
              }, button: function(m) {
                var b = m.nodeName.toLowerCase();
                return b === "input" && m.type === "button" || b === "button";
              }, text: function(m) {
                var b;
                return m.nodeName.toLowerCase() === "input" && m.type === "text" && ((b = m.getAttribute("type")) == null || b.toLowerCase() === "text");
              }, first: nn(function() {
                return [0];
              }), last: nn(function(m, b) {
                return [b - 1];
              }), eq: nn(function(m, b, C) {
                return [C < 0 ? C + b : C];
              }), even: nn(function(m, b) {
                for (var C = 0; C < b; C += 2)
                  m.push(C);
                return m;
              }), odd: nn(function(m, b) {
                for (var C = 1; C < b; C += 2)
                  m.push(C);
                return m;
              }), lt: nn(function(m, b, C) {
                for (var P = C < 0 ? C + b : C > b ? b : C; --P >= 0; )
                  m.push(P);
                return m;
              }), gt: nn(function(m, b, C) {
                for (var P = C < 0 ? C + b : C; ++P < b; )
                  m.push(P);
                return m;
              }) } }, o.pseudos.nth = o.pseudos.eq, { radio: !0, checkbox: !0, file: !0, password: !0, image: !0 })
                o.pseudos[e] = ei(e);
              for (e in { submit: !0, reset: !0 })
                o.pseudos[e] = ni(e);
              function Sr() {
              }
              function zn(m) {
                for (var b = 0, C = m.length, P = ""; b < C; b++)
                  P += m[b].value;
                return P;
              }
              function Hn(m, b, C) {
                var P = b.dir, j = b.next, Q = j || P, R = C && Q === "parentNode", N = ft++;
                return b.first ? function(B, tt, et) {
                  for (; B = B[P]; )
                    if (B.nodeType === 1 || R)
                      return m(B, tt, et);
                  return !1;
                } : function(B, tt, et) {
                  var G, pt, Mt, it = [ue, N];
                  if (et) {
                    for (; B = B[P]; )
                      if ((B.nodeType === 1 || R) && m(B, tt, et))
                        return !0;
                  } else
                    for (; B = B[P]; )
                      if (B.nodeType === 1 || R)
                        if (pt = (Mt = B[wt] || (B[wt] = {}))[B.uniqueID] || (Mt[B.uniqueID] = {}), j && j === B.nodeName.toLowerCase())
                          B = B[P] || B;
                        else {
                          if ((G = pt[Q]) && G[0] === ue && G[1] === N)
                            return it[2] = G[2];
                          if (pt[Q] = it, it[2] = m(B, tt, et))
                            return !0;
                        }
                  return !1;
                };
              }
              function ar(m) {
                return m.length > 1 ? function(b, C, P) {
                  for (var j = m.length; j--; )
                    if (!m[j](b, C, P))
                      return !1;
                  return !0;
                } : m[0];
              }
              function Wn(m, b, C, P, j) {
                for (var Q, R = [], N = 0, B = m.length, tt = b != null; N < B; N++)
                  (Q = m[N]) && (C && !C(Q, P, j) || (R.push(Q), tt && b.push(N)));
                return R;
              }
              function sr(m, b, C, P, j, Q) {
                return P && !P[wt] && (P = sr(P)), j && !j[wt] && (j = sr(j, Q)), Ee(function(R, N, B, tt) {
                  var et, G, pt, Mt = [], it = [], $t = N.length, Yt = R || function(Qe, ie, zt) {
                    for (var Oe = 0, Vn = ie.length; Oe < Vn; Oe++)
                      kt(Qe, ie[Oe], zt);
                    return zt;
                  }(b || "*", B.nodeType ? [B] : B, []), oe = !m || !R && b ? Yt : Wn(Yt, Mt, m, B, tt), _t = C ? j || (R ? m : $t || P) ? [] : N : oe;
                  if (C && C(oe, _t, B, tt), P)
                    for (et = Wn(_t, it), P(et, [], B, tt), G = et.length; G--; )
                      (pt = et[G]) && (_t[it[G]] = !(oe[it[G]] = pt));
                  if (R) {
                    if (j || m) {
                      if (j) {
                        for (et = [], G = _t.length; G--; )
                          (pt = _t[G]) && et.push(oe[G] = pt);
                        j(null, _t = [], et, tt);
                      }
                      for (G = _t.length; G--; )
                        (pt = _t[G]) && (et = j ? xe(R, pt) : Mt[G]) > -1 && (R[et] = !(N[et] = pt));
                    }
                  } else
                    _t = Wn(_t === N ? _t.splice($t, _t.length) : _t), j ? j(null, N, _t, tt) : Lt.apply(N, _t);
                });
              }
              function lr(m) {
                for (var b, C, P, j = m.length, Q = o.relative[m[0].type], R = Q || o.relative[" "], N = Q ? 1 : 0, B = Hn(function(G) {
                  return G === b;
                }, R, !0), tt = Hn(function(G) {
                  return xe(b, G) > -1;
                }, R, !0), et = [function(G, pt, Mt) {
                  var it = !Q && (Mt || pt !== T) || ((b = pt).nodeType ? B(G, pt, Mt) : tt(G, pt, Mt));
                  return b = null, it;
                }]; N < j; N++)
                  if (C = o.relative[m[N].type])
                    et = [Hn(ar(et), C)];
                  else {
                    if ((C = o.filter[m[N].type].apply(null, m[N].matches))[wt]) {
                      for (P = ++N; P < j && !o.relative[m[P].type]; P++)
                        ;
                      return sr(N > 1 && ar(et), N > 1 && zn(m.slice(0, N - 1).concat({ value: m[N - 2].type === " " ? "*" : "" })).replace(ke, "$1"), C, N < P && lr(m.slice(N, P)), P < j && lr(m = m.slice(P)), P < j && zn(m));
                    }
                    et.push(C);
                  }
                return ar(et);
              }
              return Sr.prototype = o.filters = o.pseudos, o.setFilters = new Sr(), h = kt.tokenize = function(m, b) {
                var C, P, j, Q, R, N, B, tt = Tn[m + " "];
                if (tt)
                  return b ? 0 : tt.slice(0);
                for (R = m, N = [], B = o.preFilter; R; ) {
                  for (Q in C && !(P = fn.exec(R)) || (P && (R = R.slice(P[0].length) || R), N.push(j = [])), C = !1, (P = Nn.exec(R)) && (C = P.shift(), j.push({ value: C, type: P[0].replace(ke, " ") }), R = R.slice(C.length)), o.filter)
                    !(P = Fn[Q].exec(R)) || B[Q] && !(P = B[Q](P)) || (C = P.shift(), j.push({ value: C, type: Q, matches: P }), R = R.slice(C.length));
                  if (!C)
                    break;
                }
                return b ? R.length : R ? kt.error(m) : Tn(m, N).slice(0);
              }, x = kt.compile = function(m, b) {
                var C, P = [], j = [], Q = In[m + " "];
                if (!Q) {
                  for (b || (b = h(m)), C = b.length; C--; )
                    (Q = lr(b[C]))[wt] ? P.push(Q) : j.push(Q);
                  Q = In(m, function(R, N) {
                    var B = N.length > 0, tt = R.length > 0, et = function(G, pt, Mt, it, $t) {
                      var Yt, oe, _t, Qe = 0, ie = "0", zt = G && [], Oe = [], Vn = T, Er = G || tt && o.find.TAG("*", $t), Lr = ue += Vn == null ? 1 : Math.random() || 0.1, ri = Er.length;
                      for ($t && (T = pt == E || pt || $t); ie !== ri && (Yt = Er[ie]) != null; ie++) {
                        if (tt && Yt) {
                          for (oe = 0, pt || Yt.ownerDocument == E || (S(Yt), Mt = !Y); _t = R[oe++]; )
                            if (_t(Yt, pt || E, Mt)) {
                              it.push(Yt);
                              break;
                            }
                          $t && (ue = Lr);
                        }
                        B && ((Yt = !_t && Yt) && Qe--, G && zt.push(Yt));
                      }
                      if (Qe += ie, B && ie !== Qe) {
                        for (oe = 0; _t = N[oe++]; )
                          _t(zt, Oe, pt, Mt);
                        if (G) {
                          if (Qe > 0)
                            for (; ie--; )
                              zt[ie] || Oe[ie] || (Oe[ie] = mn.call(it));
                          Oe = Wn(Oe);
                        }
                        Lt.apply(it, Oe), $t && !G && Oe.length > 0 && Qe + N.length > 1 && kt.uniqueSort(it);
                      }
                      return $t && (ue = Lr, T = Vn), zt;
                    };
                    return B ? Ee(et) : et;
                  }(j, P)), Q.selector = m;
                }
                return Q;
              }, _ = kt.select = function(m, b, C, P) {
                var j, Q, R, N, B, tt = typeof m == "function" && m, et = !P && h(m = tt.selector || m);
                if (C = C || [], et.length === 1) {
                  if ((Q = et[0] = et[0].slice(0)).length > 2 && (R = Q[0]).type === "ID" && b.nodeType === 9 && Y && o.relative[Q[1].type]) {
                    if (!(b = (o.find.ID(R.matches[0].replace(We, Ve), b) || [])[0]))
                      return C;
                    tt && (b = b.parentNode), m = m.slice(Q.shift().value.length);
                  }
                  for (j = Fn.needsContext.test(m) ? 0 : Q.length; j-- && (R = Q[j], !o.relative[N = R.type]); )
                    if ((B = o.find[N]) && (P = B(R.matches[0].replace(We, Ve), rr.test(Q[0].type) && or(b.parentNode) || b))) {
                      if (Q.splice(j, 1), !(m = P.length && zn(Q)))
                        return Lt.apply(C, P), C;
                      break;
                    }
                }
                return (tt || x(m, et))(P, b, !Y, C, !b || rr.test(m) && or(b.parentNode) || b), C;
              }, i.sortStable = wt.split("").sort(en).join("") === wt, i.detectDuplicates = !!D, S(), i.sortDetached = Le(function(m) {
                return 1 & m.compareDocumentPosition(E.createElement("fieldset"));
              }), Le(function(m) {
                return m.innerHTML = "<a href='#'></a>", m.firstChild.getAttribute("href") === "#";
              }) || ir("type|href|height|width", function(m, b, C) {
                if (!C)
                  return m.getAttribute(b, b.toLowerCase() === "type" ? 1 : 2);
              }), i.attributes && Le(function(m) {
                return m.innerHTML = "<input/>", m.firstChild.setAttribute("value", ""), m.firstChild.getAttribute("value") === "";
              }) || ir("value", function(m, b, C) {
                if (!C && m.nodeName.toLowerCase() === "input")
                  return m.defaultValue;
              }), Le(function(m) {
                return m.getAttribute("disabled") == null;
              }) || ir(De, function(m, b, C) {
                var P;
                if (!C)
                  return m[b] === !0 ? b.toLowerCase() : (P = m.getAttributeNode(b)) && P.specified ? P.value : null;
              }), kt;
            }(I);
            a.find = xt, a.expr = xt.selectors, a.expr[":"] = a.expr.pseudos, a.uniqueSort = a.unique = xt.uniqueSort, a.text = xt.getText, a.isXMLDoc = xt.isXML, a.contains = xt.contains, a.escapeSelector = xt.escape;
            var Pt = function(t, e, i) {
              for (var o = [], u = i !== void 0; (t = t[e]) && t.nodeType !== 9; )
                if (t.nodeType === 1) {
                  if (u && a(t).is(i))
                    break;
                  o.push(t);
                }
              return o;
            }, he = function(t, e) {
              for (var i = []; t; t = t.nextSibling)
                t.nodeType === 1 && t !== e && i.push(t);
              return i;
            }, It = a.expr.match.needsContext;
            function Dt(t, e) {
              return t.nodeName && t.nodeName.toLowerCase() === e.toLowerCase();
            }
            var ee = /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i;
            function Ce(t, e, i) {
              return L(e) ? a.grep(t, function(o, u) {
                return !!e.call(o, u, o) !== i;
              }) : e.nodeType ? a.grep(t, function(o) {
                return o === e !== i;
              }) : typeof e != "string" ? a.grep(t, function(o) {
                return vt.call(e, o) > -1 !== i;
              }) : a.filter(e, t, i);
            }
            a.filter = function(t, e, i) {
              var o = e[0];
              return i && (t = ":not(" + t + ")"), e.length === 1 && o.nodeType === 1 ? a.find.matchesSelector(o, t) ? [o] : [] : a.find.matches(t, a.grep(e, function(u) {
                return u.nodeType === 1;
              }));
            }, a.fn.extend({ find: function(t) {
              var e, i, o = this.length, u = this;
              if (typeof t != "string")
                return this.pushStack(a(t).filter(function() {
                  for (e = 0; e < o; e++)
                    if (a.contains(u[e], this))
                      return !0;
                }));
              for (i = this.pushStack([]), e = 0; e < o; e++)
                a.find(t, u[e], i);
              return o > 1 ? a.uniqueSort(i) : i;
            }, filter: function(t) {
              return this.pushStack(Ce(this, t || [], !1));
            }, not: function(t) {
              return this.pushStack(Ce(this, t || [], !0));
            }, is: function(t) {
              return !!Ce(this, typeof t == "string" && It.test(t) ? a(t) : t || [], !1).length;
            } });
            var Ae, Re = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/;
            (a.fn.init = function(t, e, i) {
              var o, u;
              if (!t)
                return this;
              if (i = i || Ae, typeof t == "string") {
                if (!(o = t[0] === "<" && t[t.length - 1] === ">" && t.length >= 3 ? [null, t, null] : Re.exec(t)) || !o[1] && e)
                  return !e || e.jquery ? (e || i).find(t) : this.constructor(e).find(t);
                if (o[1]) {
                  if (e = e instanceof a ? e[0] : e, a.merge(this, a.parseHTML(o[1], e && e.nodeType ? e.ownerDocument || e : U, !0)), ee.test(o[1]) && a.isPlainObject(e))
                    for (o in e)
                      L(this[o]) ? this[o](e[o]) : this.attr(o, e[o]);
                  return this;
                }
                return (u = U.getElementById(o[2])) && (this[0] = u, this.length = 1), this;
              }
              return t.nodeType ? (this[0] = t, this.length = 1, this) : L(t) ? i.ready !== void 0 ? i.ready(t) : t(a) : a.makeArray(t, this);
            }).prototype = a.fn, Ae = a(U);
            var Ue = /^(?:parents|prev(?:Until|All))/, ne = { children: !0, contents: !0, next: !0, prev: !0 };
            function yn(t, e) {
              for (; (t = t[e]) && t.nodeType !== 1; )
                ;
              return t;
            }
            a.fn.extend({ has: function(t) {
              var e = a(t, this), i = e.length;
              return this.filter(function() {
                for (var o = 0; o < i; o++)
                  if (a.contains(this, e[o]))
                    return !0;
              });
            }, closest: function(t, e) {
              var i, o = 0, u = this.length, p = [], h = typeof t != "string" && a(t);
              if (!It.test(t)) {
                for (; o < u; o++)
                  for (i = this[o]; i && i !== e; i = i.parentNode)
                    if (i.nodeType < 11 && (h ? h.index(i) > -1 : i.nodeType === 1 && a.find.matchesSelector(i, t))) {
                      p.push(i);
                      break;
                    }
              }
              return this.pushStack(p.length > 1 ? a.uniqueSort(p) : p);
            }, index: function(t) {
              return t ? typeof t == "string" ? vt.call(a(t), this[0]) : vt.call(this, t.jquery ? t[0] : t) : this[0] && this[0].parentNode ? this.first().prevAll().length : -1;
            }, add: function(t, e) {
              return this.pushStack(a.uniqueSort(a.merge(this.get(), a(t, e))));
            }, addBack: function(t) {
              return this.add(t == null ? this.prevObject : this.prevObject.filter(t));
            } }), a.each({ parent: function(t) {
              var e = t.parentNode;
              return e && e.nodeType !== 11 ? e : null;
            }, parents: function(t) {
              return Pt(t, "parentNode");
            }, parentsUntil: function(t, e, i) {
              return Pt(t, "parentNode", i);
            }, next: function(t) {
              return yn(t, "nextSibling");
            }, prev: function(t) {
              return yn(t, "previousSibling");
            }, nextAll: function(t) {
              return Pt(t, "nextSibling");
            }, prevAll: function(t) {
              return Pt(t, "previousSibling");
            }, nextUntil: function(t, e, i) {
              return Pt(t, "nextSibling", i);
            }, prevUntil: function(t, e, i) {
              return Pt(t, "previousSibling", i);
            }, siblings: function(t) {
              return he((t.parentNode || {}).firstChild, t);
            }, children: function(t) {
              return he(t.firstChild);
            }, contents: function(t) {
              return t.contentDocument != null && dt(t.contentDocument) ? t.contentDocument : (Dt(t, "template") && (t = t.content || t), a.merge([], t.childNodes));
            } }, function(t, e) {
              a.fn[t] = function(i, o) {
                var u = a.map(this, e, i);
                return t.slice(-5) !== "Until" && (o = i), o && typeof o == "string" && (u = a.filter(o, u)), this.length > 1 && (ne[t] || a.uniqueSort(u), Ue.test(t) && u.reverse()), this.pushStack(u);
              };
            });
            var me = /[^\x20\t\r\n\f]+/g;
            function je(t) {
              return t;
            }
            function rn(t) {
              throw t;
            }
            function gn(t, e, i, o) {
              var u;
              try {
                t && L(u = t.promise) ? u.call(t).done(e).fail(i) : t && L(u = t.then) ? u.call(t, e, i) : e.apply(void 0, [t].slice(o));
              } catch (p) {
                i.apply(void 0, [p]);
              }
            }
            a.Callbacks = function(t) {
              t = typeof t == "string" ? function(A) {
                var D = {};
                return a.each(A.match(me) || [], function(S, E) {
                  D[E] = !0;
                }), D;
              }(t) : a.extend({}, t);
              var e, i, o, u, p = [], h = [], x = -1, _ = function() {
                for (u = u || t.once, o = e = !0; h.length; x = -1)
                  for (i = h.shift(); ++x < p.length; )
                    p[x].apply(i[0], i[1]) === !1 && t.stopOnFalse && (x = p.length, i = !1);
                t.memory || (i = !1), e = !1, u && (p = i ? [] : "");
              }, T = { add: function() {
                return p && (i && !e && (x = p.length - 1, h.push(i)), function A(D) {
                  a.each(D, function(S, E) {
                    L(E) ? t.unique && T.has(E) || p.push(E) : E && E.length && gt(E) !== "string" && A(E);
                  });
                }(arguments), i && !e && _()), this;
              }, remove: function() {
                return a.each(arguments, function(A, D) {
                  for (var S; (S = a.inArray(D, p, S)) > -1; )
                    p.splice(S, 1), S <= x && x--;
                }), this;
              }, has: function(A) {
                return A ? a.inArray(A, p) > -1 : p.length > 0;
              }, empty: function() {
                return p && (p = []), this;
              }, disable: function() {
                return u = h = [], p = i = "", this;
              }, disabled: function() {
                return !p;
              }, lock: function() {
                return u = h = [], i || e || (p = i = ""), this;
              }, locked: function() {
                return !!u;
              }, fireWith: function(A, D) {
                return u || (D = [A, (D = D || []).slice ? D.slice() : D], h.push(D), e || _()), this;
              }, fire: function() {
                return T.fireWith(this, arguments), this;
              }, fired: function() {
                return !!o;
              } };
              return T;
            }, a.extend({ Deferred: function(t) {
              var e = [["notify", "progress", a.Callbacks("memory"), a.Callbacks("memory"), 2], ["resolve", "done", a.Callbacks("once memory"), a.Callbacks("once memory"), 0, "resolved"], ["reject", "fail", a.Callbacks("once memory"), a.Callbacks("once memory"), 1, "rejected"]], i = "pending", o = { state: function() {
                return i;
              }, always: function() {
                return u.done(arguments).fail(arguments), this;
              }, catch: function(p) {
                return o.then(null, p);
              }, pipe: function() {
                var p = arguments;
                return a.Deferred(function(h) {
                  a.each(e, function(x, _) {
                    var T = L(p[_[4]]) && p[_[4]];
                    u[_[1]](function() {
                      var A = T && T.apply(this, arguments);
                      A && L(A.promise) ? A.promise().progress(h.notify).done(h.resolve).fail(h.reject) : h[_[0] + "With"](this, T ? [A] : arguments);
                    });
                  }), p = null;
                }).promise();
              }, then: function(p, h, x) {
                var _ = 0;
                function T(A, D, S, E) {
                  return function() {
                    var H = this, Y = arguments, W = function() {
                      var Vt, ge;
                      if (!(A < _)) {
                        if ((Vt = S.apply(H, Y)) === D.promise())
                          throw new TypeError("Thenable self-resolution");
                        ge = Vt && (typeof Vt == "object" || typeof Vt == "function") && Vt.then, L(ge) ? E ? ge.call(Vt, T(_, D, je, E), T(_, D, rn, E)) : (_++, ge.call(Vt, T(_, D, je, E), T(_, D, rn, E), T(_, D, je, D.notifyWith))) : (S !== je && (H = void 0, Y = [Vt]), (E || D.resolveWith)(H, Y));
                      }
                    }, St = E ? W : function() {
                      try {
                        W();
                      } catch (Vt) {
                        a.Deferred.exceptionHook && a.Deferred.exceptionHook(Vt, St.stackTrace), A + 1 >= _ && (S !== rn && (H = void 0, Y = [Vt]), D.rejectWith(H, Y));
                      }
                    };
                    A ? St() : (a.Deferred.getStackHook && (St.stackTrace = a.Deferred.getStackHook()), I.setTimeout(St));
                  };
                }
                return a.Deferred(function(A) {
                  e[0][3].add(T(0, A, L(x) ? x : je, A.notifyWith)), e[1][3].add(T(0, A, L(p) ? p : je)), e[2][3].add(T(0, A, L(h) ? h : rn));
                }).promise();
              }, promise: function(p) {
                return p != null ? a.extend(p, o) : o;
              } }, u = {};
              return a.each(e, function(p, h) {
                var x = h[2], _ = h[5];
                o[h[1]] = x.add, _ && x.add(function() {
                  i = _;
                }, e[3 - p][2].disable, e[3 - p][3].disable, e[0][2].lock, e[0][3].lock), x.add(h[3].fire), u[h[0]] = function() {
                  return u[h[0] + "With"](this === u ? void 0 : this, arguments), this;
                }, u[h[0] + "With"] = x.fireWith;
              }), o.promise(u), t && t.call(u, u), u;
            }, when: function(t) {
              var e = arguments.length, i = e, o = Array(i), u = ht.call(arguments), p = a.Deferred(), h = function(x) {
                return function(_) {
                  o[x] = this, u[x] = arguments.length > 1 ? ht.call(arguments) : _, --e || p.resolveWith(o, u);
                };
              };
              if (e <= 1 && (gn(t, p.done(h(i)).resolve, p.reject, !e), p.state() === "pending" || L(u[i] && u[i].then)))
                return p.then();
              for (; i--; )
                gn(u[i], h(i), p.reject);
              return p.promise();
            } });
            var Sn = /^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;
            a.Deferred.exceptionHook = function(t, e) {
              I.console && I.console.warn && t && Sn.test(t.name) && I.console.warn("jQuery.Deferred exception: " + t.message, t.stack, e);
            }, a.readyException = function(t) {
              I.setTimeout(function() {
                throw t;
              });
            };
            var on = a.Deferred();
            function J() {
              U.removeEventListener("DOMContentLoaded", J), I.removeEventListener("load", J), a.ready();
            }
            a.fn.ready = function(t) {
              return on.then(t).catch(function(e) {
                a.readyException(e);
              }), this;
            }, a.extend({ isReady: !1, readyWait: 1, ready: function(t) {
              (t === !0 ? --a.readyWait : a.isReady) || (a.isReady = !0, t !== !0 && --a.readyWait > 0 || on.resolveWith(U, [a]));
            } }), a.ready.then = on.then, U.readyState === "complete" || U.readyState !== "loading" && !U.documentElement.doScroll ? I.setTimeout(a.ready) : (U.addEventListener("DOMContentLoaded", J), I.addEventListener("load", J));
            var Qt = function(t, e, i, o, u, p, h) {
              var x = 0, _ = t.length, T = i == null;
              if (gt(i) === "object")
                for (x in u = !0, i)
                  Qt(t, e, x, i[x], !0, p, h);
              else if (o !== void 0 && (u = !0, L(o) || (h = !0), T && (h ? (e.call(t, o), e = null) : (T = e, e = function(A, D, S) {
                return T.call(a(A), S);
              })), e))
                for (; x < _; x++)
                  e(t[x], i, h ? o : o.call(t[x], x, e(t[x], i)));
              return u ? t : T ? e.call(t) : _ ? e(t[0], i) : p;
            }, En = /^-ms-/, jt = /-([a-z])/g;
            function ce(t, e) {
              return e.toUpperCase();
            }
            function q(t) {
              return t.replace(En, "ms-").replace(jt, ce);
            }
            var Z = function(t) {
              return t.nodeType === 1 || t.nodeType === 9 || !+t.nodeType;
            };
            function Rt() {
              this.expando = a.expando + Rt.uid++;
            }
            Rt.uid = 1, Rt.prototype = { cache: function(t) {
              var e = t[this.expando];
              return e || (e = {}, Z(t) && (t.nodeType ? t[this.expando] = e : Object.defineProperty(t, this.expando, { value: e, configurable: !0 }))), e;
            }, set: function(t, e, i) {
              var o, u = this.cache(t);
              if (typeof e == "string")
                u[q(e)] = i;
              else
                for (o in e)
                  u[q(o)] = e[o];
              return u;
            }, get: function(t, e) {
              return e === void 0 ? this.cache(t) : t[this.expando] && t[this.expando][q(e)];
            }, access: function(t, e, i) {
              return e === void 0 || e && typeof e == "string" && i === void 0 ? this.get(t, e) : (this.set(t, e, i), i !== void 0 ? i : e);
            }, remove: function(t, e) {
              var i, o = t[this.expando];
              if (o !== void 0) {
                if (e !== void 0)
                  for (i = (e = Array.isArray(e) ? e.map(q) : (e = q(e)) in o ? [e] : e.match(me) || []).length; i--; )
                    delete o[e[i]];
                (e === void 0 || a.isEmptyObject(o)) && (t.nodeType ? t[this.expando] = void 0 : delete t[this.expando]);
              }
            }, hasData: function(t) {
              var e = t[this.expando];
              return e !== void 0 && !a.isEmptyObject(e);
            } };
            var $ = new Rt(), Wt = new Rt(), Me = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/, Ie = /[A-Z]/g;
            function bn(t, e, i) {
              var o;
              if (i === void 0 && t.nodeType === 1)
                if (o = "data-" + e.replace(Ie, "-$&").toLowerCase(), typeof (i = t.getAttribute(o)) == "string") {
                  try {
                    i = function(u) {
                      return u === "true" || u !== "false" && (u === "null" ? null : u === +u + "" ? +u : Me.test(u) ? JSON.parse(u) : u);
                    }(i);
                  } catch {
                  }
                  Wt.set(t, e, i);
                } else
                  i = void 0;
              return i;
            }
            a.extend({ hasData: function(t) {
              return Wt.hasData(t) || $.hasData(t);
            }, data: function(t, e, i) {
              return Wt.access(t, e, i);
            }, removeData: function(t, e) {
              Wt.remove(t, e);
            }, _data: function(t, e, i) {
              return $.access(t, e, i);
            }, _removeData: function(t, e) {
              $.remove(t, e);
            } }), a.fn.extend({ data: function(t, e) {
              var i, o, u, p = this[0], h = p && p.attributes;
              if (t === void 0) {
                if (this.length && (u = Wt.get(p), p.nodeType === 1 && !$.get(p, "hasDataAttrs"))) {
                  for (i = h.length; i--; )
                    h[i] && (o = h[i].name).indexOf("data-") === 0 && (o = q(o.slice(5)), bn(p, o, u[o]));
                  $.set(p, "hasDataAttrs", !0);
                }
                return u;
              }
              return typeof t == "object" ? this.each(function() {
                Wt.set(this, t);
              }) : Qt(this, function(x) {
                var _;
                if (p && x === void 0)
                  return (_ = Wt.get(p, t)) !== void 0 || (_ = bn(p, t)) !== void 0 ? _ : void 0;
                this.each(function() {
                  Wt.set(this, t, x);
                });
              }, null, e, arguments.length > 1, null, !0);
            }, removeData: function(t) {
              return this.each(function() {
                Wt.remove(this, t);
              });
            } }), a.extend({ queue: function(t, e, i) {
              var o;
              if (t)
                return e = (e || "fx") + "queue", o = $.get(t, e), i && (!o || Array.isArray(i) ? o = $.access(t, e, a.makeArray(i)) : o.push(i)), o || [];
            }, dequeue: function(t, e) {
              e = e || "fx";
              var i = a.queue(t, e), o = i.length, u = i.shift(), p = a._queueHooks(t, e);
              u === "inprogress" && (u = i.shift(), o--), u && (e === "fx" && i.unshift("inprogress"), delete p.stop, u.call(t, function() {
                a.dequeue(t, e);
              }, p)), !o && p && p.empty.fire();
            }, _queueHooks: function(t, e) {
              var i = e + "queueHooks";
              return $.get(t, i) || $.access(t, i, { empty: a.Callbacks("once memory").add(function() {
                $.remove(t, [e + "queue", i]);
              }) });
            } }), a.fn.extend({ queue: function(t, e) {
              var i = 2;
              return typeof t != "string" && (e = t, t = "fx", i--), arguments.length < i ? a.queue(this[0], t) : e === void 0 ? this : this.each(function() {
                var o = a.queue(this, t, e);
                a._queueHooks(this, t), t === "fx" && o[0] !== "inprogress" && a.dequeue(this, t);
              });
            }, dequeue: function(t) {
              return this.each(function() {
                a.dequeue(this, t);
              });
            }, clearQueue: function(t) {
              return this.queue(t || "fx", []);
            }, promise: function(t, e) {
              var i, o = 1, u = a.Deferred(), p = this, h = this.length, x = function() {
                --o || u.resolveWith(p, [p]);
              };
              for (typeof t != "string" && (e = t, t = void 0), t = t || "fx"; h--; )
                (i = $.get(p[h], t + "queueHooks")) && i.empty && (o++, i.empty.add(x));
              return x(), u.promise(e);
            } });
            var Ln = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source, Te = new RegExp("^(?:([+-])=|)(" + Ln + ")([a-z%]*)$", "i"), fe = ["Top", "Right", "Bottom", "Left"], Pe = U.documentElement, Ne = function(t) {
              return a.contains(t.ownerDocument, t);
            }, On = { composed: !0 };
            Pe.getRootNode && (Ne = function(t) {
              return a.contains(t.ownerDocument, t) || t.getRootNode(On) === t.ownerDocument;
            });
            var re = function(t, e) {
              return (t = e || t).style.display === "none" || t.style.display === "" && Ne(t) && a.css(t, "display") === "none";
            };
            function qe(t, e, i, o) {
              var u, p, h = 20, x = o ? function() {
                return o.cur();
              } : function() {
                return a.css(t, e, "");
              }, _ = x(), T = i && i[3] || (a.cssNumber[e] ? "" : "px"), A = t.nodeType && (a.cssNumber[e] || T !== "px" && +_) && Te.exec(a.css(t, e));
              if (A && A[3] !== T) {
                for (_ /= 2, T = T || A[3], A = +_ || 1; h--; )
                  a.style(t, e, A + T), (1 - p) * (1 - (p = x() / _ || 0.5)) <= 0 && (h = 0), A /= p;
                A *= 2, a.style(t, e, A + T), i = i || [];
              }
              return i && (A = +A || +_ || 0, u = i[1] ? A + (i[1] + 1) * i[2] : +i[2], o && (o.unit = T, o.start = A, o.end = u)), u;
            }
            var an = {};
            function Fe(t) {
              var e, i = t.ownerDocument, o = t.nodeName, u = an[o];
              return u || (e = i.body.appendChild(i.createElement(o)), u = a.css(e, "display"), e.parentNode.removeChild(e), u === "none" && (u = "block"), an[o] = u, u);
            }
            function $e(t, e) {
              for (var i, o, u = [], p = 0, h = t.length; p < h; p++)
                (o = t[p]).style && (i = o.style.display, e ? (i === "none" && (u[p] = $.get(o, "display") || null, u[p] || (o.style.display = "")), o.style.display === "" && re(o) && (u[p] = Fe(o))) : i !== "none" && (u[p] = "none", $.set(o, "display", i)));
              for (p = 0; p < h; p++)
                u[p] != null && (t[p].style.display = u[p]);
              return t;
            }
            a.fn.extend({ show: function() {
              return $e(this, !0);
            }, hide: function() {
              return $e(this);
            }, toggle: function(t) {
              return typeof t == "boolean" ? t ? this.show() : this.hide() : this.each(function() {
                re(this) ? a(this).show() : a(this).hide();
              });
            } });
            var Be, sn, Ke = /^(?:checkbox|radio)$/i, vn = /<([a-z][^\/\0>\x20\t\r\n\f]*)/i, xn = /^$|^module$|\/(?:java|ecma)script/i;
            Be = U.createDocumentFragment().appendChild(U.createElement("div")), (sn = U.createElement("input")).setAttribute("type", "radio"), sn.setAttribute("checked", "checked"), sn.setAttribute("name", "t"), Be.appendChild(sn), F.checkClone = Be.cloneNode(!0).cloneNode(!0).lastChild.checked, Be.innerHTML = "<textarea>x</textarea>", F.noCloneChecked = !!Be.cloneNode(!0).lastChild.defaultValue, Be.innerHTML = "<option></option>", F.option = !!Be.lastChild;
            var Tt = { thead: [1, "<table>", "</table>"], col: [2, "<table><colgroup>", "</colgroup></table>"], tr: [2, "<table><tbody>", "</tbody></table>"], td: [3, "<table><tbody><tr>", "</tr></tbody></table>"], _default: [0, "", ""] };
            function Nt(t, e) {
              var i;
              return i = t.getElementsByTagName !== void 0 ? t.getElementsByTagName(e || "*") : t.querySelectorAll !== void 0 ? t.querySelectorAll(e || "*") : [], e === void 0 || e && Dt(t, e) ? a.merge([t], i) : i;
            }
            function Ye(t, e) {
              for (var i = 0, o = t.length; i < o; i++)
                $.set(t[i], "globalEval", !e || $.get(e[i], "globalEval"));
            }
            Tt.tbody = Tt.tfoot = Tt.colgroup = Tt.caption = Tt.thead, Tt.th = Tt.td, F.option || (Tt.optgroup = Tt.option = [1, "<select multiple='multiple'>", "</select>"]);
            var Xn = /<|&#?\w+;/;
            function An(t, e, i, o, u) {
              for (var p, h, x, _, T, A, D = e.createDocumentFragment(), S = [], E = 0, H = t.length; E < H; E++)
                if ((p = t[E]) || p === 0)
                  if (gt(p) === "object")
                    a.merge(S, p.nodeType ? [p] : p);
                  else if (Xn.test(p)) {
                    for (h = h || D.appendChild(e.createElement("div")), x = (vn.exec(p) || ["", ""])[1].toLowerCase(), _ = Tt[x] || Tt._default, h.innerHTML = _[1] + a.htmlPrefilter(p) + _[2], A = _[0]; A--; )
                      h = h.lastChild;
                    a.merge(S, h.childNodes), (h = D.firstChild).textContent = "";
                  } else
                    S.push(e.createTextNode(p));
              for (D.textContent = "", E = 0; p = S[E++]; )
                if (o && a.inArray(p, o) > -1)
                  u && u.push(p);
                else if (T = Ne(p), h = Nt(D.appendChild(p), "script"), T && Ye(h), i)
                  for (A = 0; p = h[A++]; )
                    xn.test(p.type || "") && i.push(p);
              return D;
            }
            var Pn = /^([^.]*)(?:\.(.+)|)/;
            function qt() {
              return !0;
            }
            function Zt() {
              return !1;
            }
            function wn(t, e) {
              return t === function() {
                try {
                  return U.activeElement;
                } catch {
                }
              }() == (e === "focus");
            }
            function ye(t, e, i, o, u, p) {
              var h, x;
              if (typeof e == "object") {
                for (x in typeof i != "string" && (o = o || i, i = void 0), e)
                  ye(t, x, i, o, e[x], p);
                return t;
              }
              if (o == null && u == null ? (u = i, o = i = void 0) : u == null && (typeof i == "string" ? (u = o, o = void 0) : (u = o, o = i, i = void 0)), u === !1)
                u = Zt;
              else if (!u)
                return t;
              return p === 1 && (h = u, u = function(_) {
                return a().off(_), h.apply(this, arguments);
              }, u.guid = h.guid || (h.guid = a.guid++)), t.each(function() {
                a.event.add(this, e, u, o, i);
              });
            }
            function ln(t, e, i) {
              i ? ($.set(t, e, !1), a.event.add(t, e, { namespace: !1, handler: function(o) {
                var u, p, h = $.get(this, e);
                if (1 & o.isTrigger && this[e]) {
                  if (h.length)
                    (a.event.special[e] || {}).delegateType && o.stopPropagation();
                  else if (h = ht.call(arguments), $.set(this, e, h), u = i(this, e), this[e](), h !== (p = $.get(this, e)) || u ? $.set(this, e, !1) : p = {}, h !== p)
                    return o.stopImmediatePropagation(), o.preventDefault(), p && p.value;
                } else
                  h.length && ($.set(this, e, { value: a.event.trigger(a.extend(h[0], a.Event.prototype), h.slice(1), this) }), o.stopImmediatePropagation());
              } })) : $.get(t, e) === void 0 && a.event.add(t, e, qt);
            }
            a.event = { global: {}, add: function(t, e, i, o, u) {
              var p, h, x, _, T, A, D, S, E, H, Y, W = $.get(t);
              if (Z(t))
                for (i.handler && (i = (p = i).handler, u = p.selector), u && a.find.matchesSelector(Pe, u), i.guid || (i.guid = a.guid++), (_ = W.events) || (_ = W.events = /* @__PURE__ */ Object.create(null)), (h = W.handle) || (h = W.handle = function(St) {
                  return a !== void 0 && a.event.triggered !== St.type ? a.event.dispatch.apply(t, arguments) : void 0;
                }), T = (e = (e || "").match(me) || [""]).length; T--; )
                  E = Y = (x = Pn.exec(e[T]) || [])[1], H = (x[2] || "").split(".").sort(), E && (D = a.event.special[E] || {}, E = (u ? D.delegateType : D.bindType) || E, D = a.event.special[E] || {}, A = a.extend({ type: E, origType: Y, data: o, handler: i, guid: i.guid, selector: u, needsContext: u && a.expr.match.needsContext.test(u), namespace: H.join(".") }, p), (S = _[E]) || ((S = _[E] = []).delegateCount = 0, D.setup && D.setup.call(t, o, H, h) !== !1 || t.addEventListener && t.addEventListener(E, h)), D.add && (D.add.call(t, A), A.handler.guid || (A.handler.guid = i.guid)), u ? S.splice(S.delegateCount++, 0, A) : S.push(A), a.event.global[E] = !0);
            }, remove: function(t, e, i, o, u) {
              var p, h, x, _, T, A, D, S, E, H, Y, W = $.hasData(t) && $.get(t);
              if (W && (_ = W.events)) {
                for (T = (e = (e || "").match(me) || [""]).length; T--; )
                  if (E = Y = (x = Pn.exec(e[T]) || [])[1], H = (x[2] || "").split(".").sort(), E) {
                    for (D = a.event.special[E] || {}, S = _[E = (o ? D.delegateType : D.bindType) || E] || [], x = x[2] && new RegExp("(^|\\.)" + H.join("\\.(?:.*\\.|)") + "(\\.|$)"), h = p = S.length; p--; )
                      A = S[p], !u && Y !== A.origType || i && i.guid !== A.guid || x && !x.test(A.namespace) || o && o !== A.selector && (o !== "**" || !A.selector) || (S.splice(p, 1), A.selector && S.delegateCount--, D.remove && D.remove.call(t, A));
                    h && !S.length && (D.teardown && D.teardown.call(t, H, W.handle) !== !1 || a.removeEvent(t, E, W.handle), delete _[E]);
                  } else
                    for (E in _)
                      a.event.remove(t, E + e[T], i, o, !0);
                a.isEmptyObject(_) && $.remove(t, "handle events");
              }
            }, dispatch: function(t) {
              var e, i, o, u, p, h, x = new Array(arguments.length), _ = a.event.fix(t), T = ($.get(this, "events") || /* @__PURE__ */ Object.create(null))[_.type] || [], A = a.event.special[_.type] || {};
              for (x[0] = _, e = 1; e < arguments.length; e++)
                x[e] = arguments[e];
              if (_.delegateTarget = this, !A.preDispatch || A.preDispatch.call(this, _) !== !1) {
                for (h = a.event.handlers.call(this, _, T), e = 0; (u = h[e++]) && !_.isPropagationStopped(); )
                  for (_.currentTarget = u.elem, i = 0; (p = u.handlers[i++]) && !_.isImmediatePropagationStopped(); )
                    _.rnamespace && p.namespace !== !1 && !_.rnamespace.test(p.namespace) || (_.handleObj = p, _.data = p.data, (o = ((a.event.special[p.origType] || {}).handle || p.handler).apply(u.elem, x)) !== void 0 && (_.result = o) === !1 && (_.preventDefault(), _.stopPropagation()));
                return A.postDispatch && A.postDispatch.call(this, _), _.result;
              }
            }, handlers: function(t, e) {
              var i, o, u, p, h, x = [], _ = e.delegateCount, T = t.target;
              if (_ && T.nodeType && !(t.type === "click" && t.button >= 1)) {
                for (; T !== this; T = T.parentNode || this)
                  if (T.nodeType === 1 && (t.type !== "click" || T.disabled !== !0)) {
                    for (p = [], h = {}, i = 0; i < _; i++)
                      h[u = (o = e[i]).selector + " "] === void 0 && (h[u] = o.needsContext ? a(u, this).index(T) > -1 : a.find(u, this, null, [T]).length), h[u] && p.push(o);
                    p.length && x.push({ elem: T, handlers: p });
                  }
              }
              return T = this, _ < e.length && x.push({ elem: T, handlers: e.slice(_) }), x;
            }, addProp: function(t, e) {
              Object.defineProperty(a.Event.prototype, t, { enumerable: !0, configurable: !0, get: L(e) ? function() {
                if (this.originalEvent)
                  return e(this.originalEvent);
              } : function() {
                if (this.originalEvent)
                  return this.originalEvent[t];
              }, set: function(i) {
                Object.defineProperty(this, t, { enumerable: !0, configurable: !0, writable: !0, value: i });
              } });
            }, fix: function(t) {
              return t[a.expando] ? t : new a.Event(t);
            }, special: { load: { noBubble: !0 }, click: { setup: function(t) {
              var e = this || t;
              return Ke.test(e.type) && e.click && Dt(e, "input") && ln(e, "click", qt), !1;
            }, trigger: function(t) {
              var e = this || t;
              return Ke.test(e.type) && e.click && Dt(e, "input") && ln(e, "click"), !0;
            }, _default: function(t) {
              var e = t.target;
              return Ke.test(e.type) && e.click && Dt(e, "input") && $.get(e, "click") || Dt(e, "a");
            } }, beforeunload: { postDispatch: function(t) {
              t.result !== void 0 && t.originalEvent && (t.originalEvent.returnValue = t.result);
            } } } }, a.removeEvent = function(t, e, i) {
              t.removeEventListener && t.removeEventListener(e, i);
            }, a.Event = function(t, e) {
              if (!(this instanceof a.Event))
                return new a.Event(t, e);
              t && t.type ? (this.originalEvent = t, this.type = t.type, this.isDefaultPrevented = t.defaultPrevented || t.defaultPrevented === void 0 && t.returnValue === !1 ? qt : Zt, this.target = t.target && t.target.nodeType === 3 ? t.target.parentNode : t.target, this.currentTarget = t.currentTarget, this.relatedTarget = t.relatedTarget) : this.type = t, e && a.extend(this, e), this.timeStamp = t && t.timeStamp || Date.now(), this[a.expando] = !0;
            }, a.Event.prototype = { constructor: a.Event, isDefaultPrevented: Zt, isPropagationStopped: Zt, isImmediatePropagationStopped: Zt, isSimulated: !1, preventDefault: function() {
              var t = this.originalEvent;
              this.isDefaultPrevented = qt, t && !this.isSimulated && t.preventDefault();
            }, stopPropagation: function() {
              var t = this.originalEvent;
              this.isPropagationStopped = qt, t && !this.isSimulated && t.stopPropagation();
            }, stopImmediatePropagation: function() {
              var t = this.originalEvent;
              this.isImmediatePropagationStopped = qt, t && !this.isSimulated && t.stopImmediatePropagation(), this.stopPropagation();
            } }, a.each({ altKey: !0, bubbles: !0, cancelable: !0, changedTouches: !0, ctrlKey: !0, detail: !0, eventPhase: !0, metaKey: !0, pageX: !0, pageY: !0, shiftKey: !0, view: !0, char: !0, code: !0, charCode: !0, key: !0, keyCode: !0, button: !0, buttons: !0, clientX: !0, clientY: !0, offsetX: !0, offsetY: !0, pointerId: !0, pointerType: !0, screenX: !0, screenY: !0, targetTouches: !0, toElement: !0, touches: !0, which: !0 }, a.event.addProp), a.each({ focus: "focusin", blur: "focusout" }, function(t, e) {
              a.event.special[t] = { setup: function() {
                return ln(this, t, wn), !1;
              }, trigger: function() {
                return ln(this, t), !0;
              }, _default: function() {
                return !0;
              }, delegateType: e };
            }), a.each({ mouseenter: "mouseover", mouseleave: "mouseout", pointerenter: "pointerover", pointerleave: "pointerout" }, function(t, e) {
              a.event.special[t] = { delegateType: e, bindType: e, handle: function(i) {
                var o, u = this, p = i.relatedTarget, h = i.handleObj;
                return p && (p === u || a.contains(u, p)) || (i.type = h.origType, o = h.handler.apply(this, arguments), i.type = e), o;
              } };
            }), a.fn.extend({ on: function(t, e, i, o) {
              return ye(this, t, e, i, o);
            }, one: function(t, e, i, o) {
              return ye(this, t, e, i, o, 1);
            }, off: function(t, e, i) {
              var o, u;
              if (t && t.preventDefault && t.handleObj)
                return o = t.handleObj, a(t.delegateTarget).off(o.namespace ? o.origType + "." + o.namespace : o.origType, o.selector, o.handler), this;
              if (typeof t == "object") {
                for (u in t)
                  this.off(u, e, t[u]);
                return this;
              }
              return e !== !1 && typeof e != "function" || (i = e, e = void 0), i === !1 && (i = Zt), this.each(function() {
                a.event.remove(this, t, i, e);
              });
            } });
            var Dn = /<script|<style|<link/i, Qn = /checked\s*(?:[^=]|=\s*.checked.)/i, Ge = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;
            function ze(t, e) {
              return Dt(t, "table") && Dt(e.nodeType !== 11 ? e : e.firstChild, "tr") && a(t).children("tbody")[0] || t;
            }
            function cn(t) {
              return t.type = (t.getAttribute("type") !== null) + "/" + t.type, t;
            }
            function Je(t) {
              return (t.type || "").slice(0, 5) === "true/" ? t.type = t.type.slice(5) : t.removeAttribute("type"), t;
            }
            function kn(t, e) {
              var i, o, u, p, h, x;
              if (e.nodeType === 1) {
                if ($.hasData(t) && (x = $.get(t).events))
                  for (u in $.remove(e, "handle events"), x)
                    for (i = 0, o = x[u].length; i < o; i++)
                      a.event.add(e, u, x[u][i]);
                Wt.hasData(t) && (p = Wt.access(t), h = a.extend({}, p), Wt.set(e, h));
              }
            }
            function Rn(t, e) {
              var i = e.nodeName.toLowerCase();
              i === "input" && Ke.test(t.type) ? e.checked = t.checked : i !== "input" && i !== "textarea" || (e.defaultValue = t.defaultValue);
            }
            function He(t, e, i, o) {
              e = te(e);
              var u, p, h, x, _, T, A = 0, D = t.length, S = D - 1, E = e[0], H = L(E);
              if (H || D > 1 && typeof E == "string" && !F.checkClone && Qn.test(E))
                return t.each(function(Y) {
                  var W = t.eq(Y);
                  H && (e[0] = E.call(this, Y, W.html())), He(W, e, i, o);
                });
              if (D && (p = (u = An(e, t[0].ownerDocument, !1, t, o)).firstChild, u.childNodes.length === 1 && (u = p), p || o)) {
                for (x = (h = a.map(Nt(u, "script"), cn)).length; A < D; A++)
                  _ = u, A !== S && (_ = a.clone(_, !0, !0), x && a.merge(h, Nt(_, "script"))), i.call(t[A], _, A);
                if (x)
                  for (T = h[h.length - 1].ownerDocument, a.map(h, Je), A = 0; A < x; A++)
                    _ = h[A], xn.test(_.type || "") && !$.access(_, "globalEval") && a.contains(T, _) && (_.src && (_.type || "").toLowerCase() !== "module" ? a._evalUrl && !_.noModule && a._evalUrl(_.src, { nonce: _.nonce || _.getAttribute("nonce") }, T) : At(_.textContent.replace(Ge, ""), _, T));
              }
              return t;
            }
            function un(t, e, i) {
              for (var o, u = e ? a.filter(e, t) : t, p = 0; (o = u[p]) != null; p++)
                i || o.nodeType !== 1 || a.cleanData(Nt(o)), o.parentNode && (i && Ne(o) && Ye(Nt(o, "script")), o.parentNode.removeChild(o));
              return t;
            }
            a.extend({ htmlPrefilter: function(t) {
              return t;
            }, clone: function(t, e, i) {
              var o, u, p, h, x = t.cloneNode(!0), _ = Ne(t);
              if (!(F.noCloneChecked || t.nodeType !== 1 && t.nodeType !== 11 || a.isXMLDoc(t)))
                for (h = Nt(x), o = 0, u = (p = Nt(t)).length; o < u; o++)
                  Rn(p[o], h[o]);
              if (e)
                if (i)
                  for (p = p || Nt(t), h = h || Nt(x), o = 0, u = p.length; o < u; o++)
                    kn(p[o], h[o]);
                else
                  kn(t, x);
              return (h = Nt(x, "script")).length > 0 && Ye(h, !_ && Nt(t, "script")), x;
            }, cleanData: function(t) {
              for (var e, i, o, u = a.event.special, p = 0; (i = t[p]) !== void 0; p++)
                if (Z(i)) {
                  if (e = i[$.expando]) {
                    if (e.events)
                      for (o in e.events)
                        u[o] ? a.event.remove(i, o) : a.removeEvent(i, o, e.handle);
                    i[$.expando] = void 0;
                  }
                  i[Wt.expando] && (i[Wt.expando] = void 0);
                }
            } }), a.fn.extend({ detach: function(t) {
              return un(this, t, !0);
            }, remove: function(t) {
              return un(this, t);
            }, text: function(t) {
              return Qt(this, function(e) {
                return e === void 0 ? a.text(this) : this.empty().each(function() {
                  this.nodeType !== 1 && this.nodeType !== 11 && this.nodeType !== 9 || (this.textContent = e);
                });
              }, null, t, arguments.length);
            }, append: function() {
              return He(this, arguments, function(t) {
                this.nodeType !== 1 && this.nodeType !== 11 && this.nodeType !== 9 || ze(this, t).appendChild(t);
              });
            }, prepend: function() {
              return He(this, arguments, function(t) {
                if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
                  var e = ze(this, t);
                  e.insertBefore(t, e.firstChild);
                }
              });
            }, before: function() {
              return He(this, arguments, function(t) {
                this.parentNode && this.parentNode.insertBefore(t, this);
              });
            }, after: function() {
              return He(this, arguments, function(t) {
                this.parentNode && this.parentNode.insertBefore(t, this.nextSibling);
              });
            }, empty: function() {
              for (var t, e = 0; (t = this[e]) != null; e++)
                t.nodeType === 1 && (a.cleanData(Nt(t, !1)), t.textContent = "");
              return this;
            }, clone: function(t, e) {
              return t = t != null && t, e = e ?? t, this.map(function() {
                return a.clone(this, t, e);
              });
            }, html: function(t) {
              return Qt(this, function(e) {
                var i = this[0] || {}, o = 0, u = this.length;
                if (e === void 0 && i.nodeType === 1)
                  return i.innerHTML;
                if (typeof e == "string" && !Dn.test(e) && !Tt[(vn.exec(e) || ["", ""])[1].toLowerCase()]) {
                  e = a.htmlPrefilter(e);
                  try {
                    for (; o < u; o++)
                      (i = this[o] || {}).nodeType === 1 && (a.cleanData(Nt(i, !1)), i.innerHTML = e);
                    i = 0;
                  } catch {
                  }
                }
                i && this.empty().append(e);
              }, null, t, arguments.length);
            }, replaceWith: function() {
              var t = [];
              return He(this, arguments, function(e) {
                var i = this.parentNode;
                a.inArray(this, t) < 0 && (a.cleanData(Nt(this)), i && i.replaceChild(e, this));
              }, t);
            } }), a.each({ appendTo: "append", prependTo: "prepend", insertBefore: "before", insertAfter: "after", replaceAll: "replaceWith" }, function(t, e) {
              a.fn[t] = function(i) {
                for (var o, u = [], p = a(i), h = p.length - 1, x = 0; x <= h; x++)
                  o = x === h ? this : this.clone(!0), a(p[x])[e](o), Ht.apply(u, o.get());
                return this.pushStack(u);
              };
            });
            var dn = new RegExp("^(" + Ln + ")(?!px)[a-z%]+$", "i"), c = function(t) {
              var e = t.ownerDocument.defaultView;
              return e && e.opener || (e = I), e.getComputedStyle(t);
            }, d = function(t, e, i) {
              var o, u, p = {};
              for (u in e)
                p[u] = t.style[u], t.style[u] = e[u];
              for (u in o = i.call(t), e)
                t.style[u] = p[u];
              return o;
            }, n = new RegExp(fe.join("|"), "i");
            function r(t, e, i) {
              var o, u, p, h, x = t.style;
              return (i = i || c(t)) && ((h = i.getPropertyValue(e) || i[e]) !== "" || Ne(t) || (h = a.style(t, e)), !F.pixelBoxStyles() && dn.test(h) && n.test(e) && (o = x.width, u = x.minWidth, p = x.maxWidth, x.minWidth = x.maxWidth = x.width = h, h = i.width, x.width = o, x.minWidth = u, x.maxWidth = p)), h !== void 0 ? h + "" : h;
            }
            function l(t, e) {
              return { get: function() {
                if (!t())
                  return (this.get = e).apply(this, arguments);
                delete this.get;
              } };
            }
            (function() {
              function t() {
                if (T) {
                  _.style.cssText = "position:absolute;left:-11111px;width:60px;margin-top:1px;padding:0;border:0", T.style.cssText = "position:relative;display:block;box-sizing:border-box;overflow:scroll;margin:auto;border:1px;padding:1px;width:60%;top:1%", Pe.appendChild(_).appendChild(T);
                  var A = I.getComputedStyle(T);
                  i = A.top !== "1%", x = e(A.marginLeft) === 12, T.style.right = "60%", p = e(A.right) === 36, o = e(A.width) === 36, T.style.position = "absolute", u = e(T.offsetWidth / 3) === 12, Pe.removeChild(_), T = null;
                }
              }
              function e(A) {
                return Math.round(parseFloat(A));
              }
              var i, o, u, p, h, x, _ = U.createElement("div"), T = U.createElement("div");
              T.style && (T.style.backgroundClip = "content-box", T.cloneNode(!0).style.backgroundClip = "", F.clearCloneStyle = T.style.backgroundClip === "content-box", a.extend(F, { boxSizingReliable: function() {
                return t(), o;
              }, pixelBoxStyles: function() {
                return t(), p;
              }, pixelPosition: function() {
                return t(), i;
              }, reliableMarginLeft: function() {
                return t(), x;
              }, scrollboxSize: function() {
                return t(), u;
              }, reliableTrDimensions: function() {
                var A, D, S, E;
                return h == null && (A = U.createElement("table"), D = U.createElement("tr"), S = U.createElement("div"), A.style.cssText = "position:absolute;left:-11111px;border-collapse:separate", D.style.cssText = "border:1px solid", D.style.height = "1px", S.style.height = "9px", S.style.display = "block", Pe.appendChild(A).appendChild(D).appendChild(S), E = I.getComputedStyle(D), h = parseInt(E.height, 10) + parseInt(E.borderTopWidth, 10) + parseInt(E.borderBottomWidth, 10) === D.offsetHeight, Pe.removeChild(A)), h;
              } }));
            })();
            var y = ["Webkit", "Moz", "ms"], v = U.createElement("div").style, k = {};
            function w(t) {
              return a.cssProps[t] || k[t] || (t in v ? t : k[t] = function(e) {
                for (var i = e[0].toUpperCase() + e.slice(1), o = y.length; o--; )
                  if ((e = y[o] + i) in v)
                    return e;
              }(t) || t);
            }
            var O = /^(none|table(?!-c[ea]).+)/, M = /^--/, V = { position: "absolute", visibility: "hidden", display: "block" }, X = { letterSpacing: "0", fontWeight: "400" };
            function ut(t, e, i) {
              var o = Te.exec(e);
              return o ? Math.max(0, o[2] - (i || 0)) + (o[3] || "px") : e;
            }
            function z(t, e, i, o, u, p) {
              var h = e === "width" ? 1 : 0, x = 0, _ = 0;
              if (i === (o ? "border" : "content"))
                return 0;
              for (; h < 4; h += 2)
                i === "margin" && (_ += a.css(t, i + fe[h], !0, u)), o ? (i === "content" && (_ -= a.css(t, "padding" + fe[h], !0, u)), i !== "margin" && (_ -= a.css(t, "border" + fe[h] + "Width", !0, u))) : (_ += a.css(t, "padding" + fe[h], !0, u), i !== "padding" ? _ += a.css(t, "border" + fe[h] + "Width", !0, u) : x += a.css(t, "border" + fe[h] + "Width", !0, u));
              return !o && p >= 0 && (_ += Math.max(0, Math.ceil(t["offset" + e[0].toUpperCase() + e.slice(1)] - p - _ - x - 0.5)) || 0), _;
            }
            function mt(t, e, i) {
              var o = c(t), u = (!F.boxSizingReliable() || i) && a.css(t, "boxSizing", !1, o) === "border-box", p = u, h = r(t, e, o), x = "offset" + e[0].toUpperCase() + e.slice(1);
              if (dn.test(h)) {
                if (!i)
                  return h;
                h = "auto";
              }
              return (!F.boxSizingReliable() && u || !F.reliableTrDimensions() && Dt(t, "tr") || h === "auto" || !parseFloat(h) && a.css(t, "display", !1, o) === "inline") && t.getClientRects().length && (u = a.css(t, "boxSizing", !1, o) === "border-box", (p = x in t) && (h = t[x])), (h = parseFloat(h) || 0) + z(t, e, i || (u ? "border" : "content"), p, o, h) + "px";
            }
            function rt(t, e, i, o, u) {
              return new rt.prototype.init(t, e, i, o, u);
            }
            a.extend({ cssHooks: { opacity: { get: function(t, e) {
              if (e) {
                var i = r(t, "opacity");
                return i === "" ? "1" : i;
              }
            } } }, cssNumber: { animationIterationCount: !0, columnCount: !0, fillOpacity: !0, flexGrow: !0, flexShrink: !0, fontWeight: !0, gridArea: !0, gridColumn: !0, gridColumnEnd: !0, gridColumnStart: !0, gridRow: !0, gridRowEnd: !0, gridRowStart: !0, lineHeight: !0, opacity: !0, order: !0, orphans: !0, widows: !0, zIndex: !0, zoom: !0 }, cssProps: {}, style: function(t, e, i, o) {
              if (t && t.nodeType !== 3 && t.nodeType !== 8 && t.style) {
                var u, p, h, x = q(e), _ = M.test(e), T = t.style;
                if (_ || (e = w(x)), h = a.cssHooks[e] || a.cssHooks[x], i === void 0)
                  return h && "get" in h && (u = h.get(t, !1, o)) !== void 0 ? u : T[e];
                (p = typeof i) == "string" && (u = Te.exec(i)) && u[1] && (i = qe(t, e, u), p = "number"), i != null && i == i && (p !== "number" || _ || (i += u && u[3] || (a.cssNumber[x] ? "" : "px")), F.clearCloneStyle || i !== "" || e.indexOf("background") !== 0 || (T[e] = "inherit"), h && "set" in h && (i = h.set(t, i, o)) === void 0 || (_ ? T.setProperty(e, i) : T[e] = i));
              }
            }, css: function(t, e, i, o) {
              var u, p, h, x = q(e);
              return M.test(e) || (e = w(x)), (h = a.cssHooks[e] || a.cssHooks[x]) && "get" in h && (u = h.get(t, !0, i)), u === void 0 && (u = r(t, e, o)), u === "normal" && e in X && (u = X[e]), i === "" || i ? (p = parseFloat(u), i === !0 || isFinite(p) ? p || 0 : u) : u;
            } }), a.each(["height", "width"], function(t, e) {
              a.cssHooks[e] = { get: function(i, o, u) {
                if (o)
                  return !O.test(a.css(i, "display")) || i.getClientRects().length && i.getBoundingClientRect().width ? mt(i, e, u) : d(i, V, function() {
                    return mt(i, e, u);
                  });
              }, set: function(i, o, u) {
                var p, h = c(i), x = !F.scrollboxSize() && h.position === "absolute", _ = (x || u) && a.css(i, "boxSizing", !1, h) === "border-box", T = u ? z(i, e, u, _, h) : 0;
                return _ && x && (T -= Math.ceil(i["offset" + e[0].toUpperCase() + e.slice(1)] - parseFloat(h[e]) - z(i, e, "border", !1, h) - 0.5)), T && (p = Te.exec(o)) && (p[3] || "px") !== "px" && (i.style[e] = o, o = a.css(i, e)), ut(0, o, T);
              } };
            }), a.cssHooks.marginLeft = l(F.reliableMarginLeft, function(t, e) {
              if (e)
                return (parseFloat(r(t, "marginLeft")) || t.getBoundingClientRect().left - d(t, { marginLeft: 0 }, function() {
                  return t.getBoundingClientRect().left;
                })) + "px";
            }), a.each({ margin: "", padding: "", border: "Width" }, function(t, e) {
              a.cssHooks[t + e] = { expand: function(i) {
                for (var o = 0, u = {}, p = typeof i == "string" ? i.split(" ") : [i]; o < 4; o++)
                  u[t + fe[o] + e] = p[o] || p[o - 2] || p[0];
                return u;
              } }, t !== "margin" && (a.cssHooks[t + e].set = ut);
            }), a.fn.extend({ css: function(t, e) {
              return Qt(this, function(i, o, u) {
                var p, h, x = {}, _ = 0;
                if (Array.isArray(o)) {
                  for (p = c(i), h = o.length; _ < h; _++)
                    x[o[_]] = a.css(i, o[_], !1, p);
                  return x;
                }
                return u !== void 0 ? a.style(i, o, u) : a.css(i, o);
              }, t, e, arguments.length > 1);
            } }), a.Tween = rt, rt.prototype = { constructor: rt, init: function(t, e, i, o, u, p) {
              this.elem = t, this.prop = i, this.easing = u || a.easing._default, this.options = e, this.start = this.now = this.cur(), this.end = o, this.unit = p || (a.cssNumber[i] ? "" : "px");
            }, cur: function() {
              var t = rt.propHooks[this.prop];
              return t && t.get ? t.get(this) : rt.propHooks._default.get(this);
            }, run: function(t) {
              var e, i = rt.propHooks[this.prop];
              return this.options.duration ? this.pos = e = a.easing[this.easing](t, this.options.duration * t, 0, 1, this.options.duration) : this.pos = e = t, this.now = (this.end - this.start) * e + this.start, this.options.step && this.options.step.call(this.elem, this.now, this), i && i.set ? i.set(this) : rt.propHooks._default.set(this), this;
            } }, rt.prototype.init.prototype = rt.prototype, rt.propHooks = { _default: { get: function(t) {
              var e;
              return t.elem.nodeType !== 1 || t.elem[t.prop] != null && t.elem.style[t.prop] == null ? t.elem[t.prop] : (e = a.css(t.elem, t.prop, "")) && e !== "auto" ? e : 0;
            }, set: function(t) {
              a.fx.step[t.prop] ? a.fx.step[t.prop](t) : t.elem.nodeType !== 1 || !a.cssHooks[t.prop] && t.elem.style[w(t.prop)] == null ? t.elem[t.prop] = t.now : a.style(t.elem, t.prop, t.now + t.unit);
            } } }, rt.propHooks.scrollTop = rt.propHooks.scrollLeft = { set: function(t) {
              t.elem.nodeType && t.elem.parentNode && (t.elem[t.prop] = t.now);
            } }, a.easing = { linear: function(t) {
              return t;
            }, swing: function(t) {
              return 0.5 - Math.cos(t * Math.PI) / 2;
            }, _default: "swing" }, a.fx = rt.prototype.init, a.fx.step = {};
            var Ct, Kt, Kn = /^(?:toggle|show|hide)$/, pn = /queueHooks$/;
            function Xe() {
              Kt && (U.hidden === !1 && I.requestAnimationFrame ? I.requestAnimationFrame(Xe) : I.setTimeout(Xe, a.fx.interval), a.fx.tick());
            }
            function ur() {
              return I.setTimeout(function() {
                Ct = void 0;
              }), Ct = Date.now();
            }
            function Mn(t, e) {
              var i, o = 0, u = { height: t };
              for (e = e ? 1 : 0; o < 4; o += 2 - e)
                u["margin" + (i = fe[o])] = u["padding" + i] = t;
              return e && (u.opacity = u.width = t), u;
            }
            function dr(t, e, i) {
              for (var o, u = (Se.tweeners[e] || []).concat(Se.tweeners["*"]), p = 0, h = u.length; p < h; p++)
                if (o = u[p].call(i, e, t))
                  return o;
            }
            function Se(t, e, i) {
              var o, u, p = 0, h = Se.prefilters.length, x = a.Deferred().always(function() {
                delete _.elem;
              }), _ = function() {
                if (u)
                  return !1;
                for (var D = Ct || ur(), S = Math.max(0, T.startTime + T.duration - D), E = 1 - (S / T.duration || 0), H = 0, Y = T.tweens.length; H < Y; H++)
                  T.tweens[H].run(E);
                return x.notifyWith(t, [T, E, S]), E < 1 && Y ? S : (Y || x.notifyWith(t, [T, 1, 0]), x.resolveWith(t, [T]), !1);
              }, T = x.promise({ elem: t, props: a.extend({}, e), opts: a.extend(!0, { specialEasing: {}, easing: a.easing._default }, i), originalProperties: e, originalOptions: i, startTime: Ct || ur(), duration: i.duration, tweens: [], createTween: function(D, S) {
                var E = a.Tween(t, T.opts, D, S, T.opts.specialEasing[D] || T.opts.easing);
                return T.tweens.push(E), E;
              }, stop: function(D) {
                var S = 0, E = D ? T.tweens.length : 0;
                if (u)
                  return this;
                for (u = !0; S < E; S++)
                  T.tweens[S].run(1);
                return D ? (x.notifyWith(t, [T, 1, 0]), x.resolveWith(t, [T, D])) : x.rejectWith(t, [T, D]), this;
              } }), A = T.props;
              for (function(D, S) {
                var E, H, Y, W, St;
                for (E in D)
                  if (Y = S[H = q(E)], W = D[E], Array.isArray(W) && (Y = W[1], W = D[E] = W[0]), E !== H && (D[H] = W, delete D[E]), (St = a.cssHooks[H]) && "expand" in St)
                    for (E in W = St.expand(W), delete D[H], W)
                      E in D || (D[E] = W[E], S[E] = Y);
                  else
                    S[H] = Y;
              }(A, T.opts.specialEasing); p < h; p++)
                if (o = Se.prefilters[p].call(T, t, A, T.opts))
                  return L(o.stop) && (a._queueHooks(T.elem, T.opts.queue).stop = o.stop.bind(o)), o;
              return a.map(A, dr, T), L(T.opts.start) && T.opts.start.call(t, T), T.progress(T.opts.progress).done(T.opts.done, T.opts.complete).fail(T.opts.fail).always(T.opts.always), a.fx.timer(a.extend(_, { elem: t, anim: T, queue: T.opts.queue })), T;
            }
            a.Animation = a.extend(Se, { tweeners: { "*": [function(t, e) {
              var i = this.createTween(t, e);
              return qe(i.elem, t, Te.exec(e), i), i;
            }] }, tweener: function(t, e) {
              L(t) ? (e = t, t = ["*"]) : t = t.match(me);
              for (var i, o = 0, u = t.length; o < u; o++)
                i = t[o], Se.tweeners[i] = Se.tweeners[i] || [], Se.tweeners[i].unshift(e);
            }, prefilters: [function(t, e, i) {
              var o, u, p, h, x, _, T, A, D = "width" in e || "height" in e, S = this, E = {}, H = t.style, Y = t.nodeType && re(t), W = $.get(t, "fxshow");
              for (o in i.queue || ((h = a._queueHooks(t, "fx")).unqueued == null && (h.unqueued = 0, x = h.empty.fire, h.empty.fire = function() {
                h.unqueued || x();
              }), h.unqueued++, S.always(function() {
                S.always(function() {
                  h.unqueued--, a.queue(t, "fx").length || h.empty.fire();
                });
              })), e)
                if (u = e[o], Kn.test(u)) {
                  if (delete e[o], p = p || u === "toggle", u === (Y ? "hide" : "show")) {
                    if (u !== "show" || !W || W[o] === void 0)
                      continue;
                    Y = !0;
                  }
                  E[o] = W && W[o] || a.style(t, o);
                }
              if ((_ = !a.isEmptyObject(e)) || !a.isEmptyObject(E))
                for (o in D && t.nodeType === 1 && (i.overflow = [H.overflow, H.overflowX, H.overflowY], (T = W && W.display) == null && (T = $.get(t, "display")), (A = a.css(t, "display")) === "none" && (T ? A = T : ($e([t], !0), T = t.style.display || T, A = a.css(t, "display"), $e([t]))), (A === "inline" || A === "inline-block" && T != null) && a.css(t, "float") === "none" && (_ || (S.done(function() {
                  H.display = T;
                }), T == null && (A = H.display, T = A === "none" ? "" : A)), H.display = "inline-block")), i.overflow && (H.overflow = "hidden", S.always(function() {
                  H.overflow = i.overflow[0], H.overflowX = i.overflow[1], H.overflowY = i.overflow[2];
                })), _ = !1, E)
                  _ || (W ? "hidden" in W && (Y = W.hidden) : W = $.access(t, "fxshow", { display: T }), p && (W.hidden = !Y), Y && $e([t], !0), S.done(function() {
                    for (o in Y || $e([t]), $.remove(t, "fxshow"), E)
                      a.style(t, o, E[o]);
                  })), _ = dr(Y ? W[o] : 0, o, S), o in W || (W[o] = _.start, Y && (_.end = _.start, _.start = 0));
            }], prefilter: function(t, e) {
              e ? Se.prefilters.unshift(t) : Se.prefilters.push(t);
            } }), a.speed = function(t, e, i) {
              var o = t && typeof t == "object" ? a.extend({}, t) : { complete: i || !i && e || L(t) && t, duration: t, easing: i && e || e && !L(e) && e };
              return a.fx.off ? o.duration = 0 : typeof o.duration != "number" && (o.duration in a.fx.speeds ? o.duration = a.fx.speeds[o.duration] : o.duration = a.fx.speeds._default), o.queue != null && o.queue !== !0 || (o.queue = "fx"), o.old = o.complete, o.complete = function() {
                L(o.old) && o.old.call(this), o.queue && a.dequeue(this, o.queue);
              }, o;
            }, a.fn.extend({ fadeTo: function(t, e, i, o) {
              return this.filter(re).css("opacity", 0).show().end().animate({ opacity: e }, t, i, o);
            }, animate: function(t, e, i, o) {
              var u = a.isEmptyObject(t), p = a.speed(e, i, o), h = function() {
                var x = Se(this, a.extend({}, t), p);
                (u || $.get(this, "finish")) && x.stop(!0);
              };
              return h.finish = h, u || p.queue === !1 ? this.each(h) : this.queue(p.queue, h);
            }, stop: function(t, e, i) {
              var o = function(u) {
                var p = u.stop;
                delete u.stop, p(i);
              };
              return typeof t != "string" && (i = e, e = t, t = void 0), e && this.queue(t || "fx", []), this.each(function() {
                var u = !0, p = t != null && t + "queueHooks", h = a.timers, x = $.get(this);
                if (p)
                  x[p] && x[p].stop && o(x[p]);
                else
                  for (p in x)
                    x[p] && x[p].stop && pn.test(p) && o(x[p]);
                for (p = h.length; p--; )
                  h[p].elem !== this || t != null && h[p].queue !== t || (h[p].anim.stop(i), u = !1, h.splice(p, 1));
                !u && i || a.dequeue(this, t);
              });
            }, finish: function(t) {
              return t !== !1 && (t = t || "fx"), this.each(function() {
                var e, i = $.get(this), o = i[t + "queue"], u = i[t + "queueHooks"], p = a.timers, h = o ? o.length : 0;
                for (i.finish = !0, a.queue(this, t, []), u && u.stop && u.stop.call(this, !0), e = p.length; e--; )
                  p[e].elem === this && p[e].queue === t && (p[e].anim.stop(!0), p.splice(e, 1));
                for (e = 0; e < h; e++)
                  o[e] && o[e].finish && o[e].finish.call(this);
                delete i.finish;
              });
            } }), a.each(["toggle", "show", "hide"], function(t, e) {
              var i = a.fn[e];
              a.fn[e] = function(o, u, p) {
                return o == null || typeof o == "boolean" ? i.apply(this, arguments) : this.animate(Mn(e, !0), o, u, p);
              };
            }), a.each({ slideDown: Mn("show"), slideUp: Mn("hide"), slideToggle: Mn("toggle"), fadeIn: { opacity: "show" }, fadeOut: { opacity: "hide" }, fadeToggle: { opacity: "toggle" } }, function(t, e) {
              a.fn[t] = function(i, o, u) {
                return this.animate(e, i, o, u);
              };
            }), a.timers = [], a.fx.tick = function() {
              var t, e = 0, i = a.timers;
              for (Ct = Date.now(); e < i.length; e++)
                (t = i[e])() || i[e] !== t || i.splice(e--, 1);
              i.length || a.fx.stop(), Ct = void 0;
            }, a.fx.timer = function(t) {
              a.timers.push(t), a.fx.start();
            }, a.fx.interval = 13, a.fx.start = function() {
              Kt || (Kt = !0, Xe());
            }, a.fx.stop = function() {
              Kt = null;
            }, a.fx.speeds = { slow: 600, fast: 200, _default: 400 }, a.fn.delay = function(t, e) {
              return t = a.fx && a.fx.speeds[t] || t, e = e || "fx", this.queue(e, function(i, o) {
                var u = I.setTimeout(i, t);
                o.stop = function() {
                  I.clearTimeout(u);
                };
              });
            }, function() {
              var t = U.createElement("input"), e = U.createElement("select").appendChild(U.createElement("option"));
              t.type = "checkbox", F.checkOn = t.value !== "", F.optSelected = e.selected, (t = U.createElement("input")).value = "t", t.type = "radio", F.radioValue = t.value === "t";
            }();
            var pr, _n = a.expr.attrHandle;
            a.fn.extend({ attr: function(t, e) {
              return Qt(this, a.attr, t, e, arguments.length > 1);
            }, removeAttr: function(t) {
              return this.each(function() {
                a.removeAttr(this, t);
              });
            } }), a.extend({ attr: function(t, e, i) {
              var o, u, p = t.nodeType;
              if (p !== 3 && p !== 8 && p !== 2)
                return t.getAttribute === void 0 ? a.prop(t, e, i) : (p === 1 && a.isXMLDoc(t) || (u = a.attrHooks[e.toLowerCase()] || (a.expr.match.bool.test(e) ? pr : void 0)), i !== void 0 ? i === null ? void a.removeAttr(t, e) : u && "set" in u && (o = u.set(t, i, e)) !== void 0 ? o : (t.setAttribute(e, i + ""), i) : u && "get" in u && (o = u.get(t, e)) !== null ? o : (o = a.find.attr(t, e)) == null ? void 0 : o);
            }, attrHooks: { type: { set: function(t, e) {
              if (!F.radioValue && e === "radio" && Dt(t, "input")) {
                var i = t.value;
                return t.setAttribute("type", e), i && (t.value = i), e;
              }
            } } }, removeAttr: function(t, e) {
              var i, o = 0, u = e && e.match(me);
              if (u && t.nodeType === 1)
                for (; i = u[o++]; )
                  t.removeAttribute(i);
            } }), pr = { set: function(t, e, i) {
              return e === !1 ? a.removeAttr(t, i) : t.setAttribute(i, i), i;
            } }, a.each(a.expr.match.bool.source.match(/\w+/g), function(t, e) {
              var i = _n[e] || a.find.attr;
              _n[e] = function(o, u, p) {
                var h, x, _ = u.toLowerCase();
                return p || (x = _n[_], _n[_] = h, h = i(o, u, p) != null ? _ : null, _n[_] = x), h;
              };
            });
            var Or = /^(?:input|select|textarea|button)$/i, Ar = /^(?:a|area)$/i;
            function Ze(t) {
              return (t.match(me) || []).join(" ");
            }
            function tn(t) {
              return t.getAttribute && t.getAttribute("class") || "";
            }
            function Yn(t) {
              return Array.isArray(t) ? t : typeof t == "string" && t.match(me) || [];
            }
            a.fn.extend({ prop: function(t, e) {
              return Qt(this, a.prop, t, e, arguments.length > 1);
            }, removeProp: function(t) {
              return this.each(function() {
                delete this[a.propFix[t] || t];
              });
            } }), a.extend({ prop: function(t, e, i) {
              var o, u, p = t.nodeType;
              if (p !== 3 && p !== 8 && p !== 2)
                return p === 1 && a.isXMLDoc(t) || (e = a.propFix[e] || e, u = a.propHooks[e]), i !== void 0 ? u && "set" in u && (o = u.set(t, i, e)) !== void 0 ? o : t[e] = i : u && "get" in u && (o = u.get(t, e)) !== null ? o : t[e];
            }, propHooks: { tabIndex: { get: function(t) {
              var e = a.find.attr(t, "tabindex");
              return e ? parseInt(e, 10) : Or.test(t.nodeName) || Ar.test(t.nodeName) && t.href ? 0 : -1;
            } } }, propFix: { for: "htmlFor", class: "className" } }), F.optSelected || (a.propHooks.selected = { get: function(t) {
              var e = t.parentNode;
              return e && e.parentNode && e.parentNode.selectedIndex, null;
            }, set: function(t) {
              var e = t.parentNode;
              e && (e.selectedIndex, e.parentNode && e.parentNode.selectedIndex);
            } }), a.each(["tabIndex", "readOnly", "maxLength", "cellSpacing", "cellPadding", "rowSpan", "colSpan", "useMap", "frameBorder", "contentEditable"], function() {
              a.propFix[this.toLowerCase()] = this;
            }), a.fn.extend({ addClass: function(t) {
              var e, i, o, u, p, h, x, _ = 0;
              if (L(t))
                return this.each(function(T) {
                  a(this).addClass(t.call(this, T, tn(this)));
                });
              if ((e = Yn(t)).length) {
                for (; i = this[_++]; )
                  if (u = tn(i), o = i.nodeType === 1 && " " + Ze(u) + " ") {
                    for (h = 0; p = e[h++]; )
                      o.indexOf(" " + p + " ") < 0 && (o += p + " ");
                    u !== (x = Ze(o)) && i.setAttribute("class", x);
                  }
              }
              return this;
            }, removeClass: function(t) {
              var e, i, o, u, p, h, x, _ = 0;
              if (L(t))
                return this.each(function(T) {
                  a(this).removeClass(t.call(this, T, tn(this)));
                });
              if (!arguments.length)
                return this.attr("class", "");
              if ((e = Yn(t)).length) {
                for (; i = this[_++]; )
                  if (u = tn(i), o = i.nodeType === 1 && " " + Ze(u) + " ") {
                    for (h = 0; p = e[h++]; )
                      for (; o.indexOf(" " + p + " ") > -1; )
                        o = o.replace(" " + p + " ", " ");
                    u !== (x = Ze(o)) && i.setAttribute("class", x);
                  }
              }
              return this;
            }, toggleClass: function(t, e) {
              var i = typeof t, o = i === "string" || Array.isArray(t);
              return typeof e == "boolean" && o ? e ? this.addClass(t) : this.removeClass(t) : L(t) ? this.each(function(u) {
                a(this).toggleClass(t.call(this, u, tn(this), e), e);
              }) : this.each(function() {
                var u, p, h, x;
                if (o)
                  for (p = 0, h = a(this), x = Yn(t); u = x[p++]; )
                    h.hasClass(u) ? h.removeClass(u) : h.addClass(u);
                else
                  t !== void 0 && i !== "boolean" || ((u = tn(this)) && $.set(this, "__className__", u), this.setAttribute && this.setAttribute("class", u || t === !1 ? "" : $.get(this, "__className__") || ""));
              });
            }, hasClass: function(t) {
              var e, i, o = 0;
              for (e = " " + t + " "; i = this[o++]; )
                if (i.nodeType === 1 && (" " + Ze(tn(i)) + " ").indexOf(e) > -1)
                  return !0;
              return !1;
            } });
            var Pr = /\r/g;
            a.fn.extend({ val: function(t) {
              var e, i, o, u = this[0];
              return arguments.length ? (o = L(t), this.each(function(p) {
                var h;
                this.nodeType === 1 && ((h = o ? t.call(this, p, a(this).val()) : t) == null ? h = "" : typeof h == "number" ? h += "" : Array.isArray(h) && (h = a.map(h, function(x) {
                  return x == null ? "" : x + "";
                })), (e = a.valHooks[this.type] || a.valHooks[this.nodeName.toLowerCase()]) && "set" in e && e.set(this, h, "value") !== void 0 || (this.value = h));
              })) : u ? (e = a.valHooks[u.type] || a.valHooks[u.nodeName.toLowerCase()]) && "get" in e && (i = e.get(u, "value")) !== void 0 ? i : typeof (i = u.value) == "string" ? i.replace(Pr, "") : i ?? "" : void 0;
            } }), a.extend({ valHooks: { option: { get: function(t) {
              var e = a.find.attr(t, "value");
              return e ?? Ze(a.text(t));
            } }, select: { get: function(t) {
              var e, i, o, u = t.options, p = t.selectedIndex, h = t.type === "select-one", x = h ? null : [], _ = h ? p + 1 : u.length;
              for (o = p < 0 ? _ : h ? p : 0; o < _; o++)
                if (((i = u[o]).selected || o === p) && !i.disabled && (!i.parentNode.disabled || !Dt(i.parentNode, "optgroup"))) {
                  if (e = a(i).val(), h)
                    return e;
                  x.push(e);
                }
              return x;
            }, set: function(t, e) {
              for (var i, o, u = t.options, p = a.makeArray(e), h = u.length; h--; )
                ((o = u[h]).selected = a.inArray(a.valHooks.option.get(o), p) > -1) && (i = !0);
              return i || (t.selectedIndex = -1), p;
            } } } }), a.each(["radio", "checkbox"], function() {
              a.valHooks[this] = { set: function(t, e) {
                if (Array.isArray(e))
                  return t.checked = a.inArray(a(t).val(), e) > -1;
              } }, F.checkOn || (a.valHooks[this].get = function(t) {
                return t.getAttribute("value") === null ? "on" : t.value;
              });
            }), F.focusin = "onfocusin" in I;
            var hr = /^(?:focusinfocus|focusoutblur)$/, mr = function(t) {
              t.stopPropagation();
            };
            a.extend(a.event, { trigger: function(t, e, i, o) {
              var u, p, h, x, _, T, A, D, S = [i || U], E = Gt.call(t, "type") ? t.type : t, H = Gt.call(t, "namespace") ? t.namespace.split(".") : [];
              if (p = D = h = i = i || U, i.nodeType !== 3 && i.nodeType !== 8 && !hr.test(E + a.event.triggered) && (E.indexOf(".") > -1 && (H = E.split("."), E = H.shift(), H.sort()), _ = E.indexOf(":") < 0 && "on" + E, (t = t[a.expando] ? t : new a.Event(E, typeof t == "object" && t)).isTrigger = o ? 2 : 3, t.namespace = H.join("."), t.rnamespace = t.namespace ? new RegExp("(^|\\.)" + H.join("\\.(?:.*\\.|)") + "(\\.|$)") : null, t.result = void 0, t.target || (t.target = i), e = e == null ? [t] : a.makeArray(e, [t]), A = a.event.special[E] || {}, o || !A.trigger || A.trigger.apply(i, e) !== !1)) {
                if (!o && !A.noBubble && !f(i)) {
                  for (x = A.delegateType || E, hr.test(x + E) || (p = p.parentNode); p; p = p.parentNode)
                    S.push(p), h = p;
                  h === (i.ownerDocument || U) && S.push(h.defaultView || h.parentWindow || I);
                }
                for (u = 0; (p = S[u++]) && !t.isPropagationStopped(); )
                  D = p, t.type = u > 1 ? x : A.bindType || E, (T = ($.get(p, "events") || /* @__PURE__ */ Object.create(null))[t.type] && $.get(p, "handle")) && T.apply(p, e), (T = _ && p[_]) && T.apply && Z(p) && (t.result = T.apply(p, e), t.result === !1 && t.preventDefault());
                return t.type = E, o || t.isDefaultPrevented() || A._default && A._default.apply(S.pop(), e) !== !1 || !Z(i) || _ && L(i[E]) && !f(i) && ((h = i[_]) && (i[_] = null), a.event.triggered = E, t.isPropagationStopped() && D.addEventListener(E, mr), i[E](), t.isPropagationStopped() && D.removeEventListener(E, mr), a.event.triggered = void 0, h && (i[_] = h)), t.result;
              }
            }, simulate: function(t, e, i) {
              var o = a.extend(new a.Event(), i, { type: t, isSimulated: !0 });
              a.event.trigger(o, null, e);
            } }), a.fn.extend({ trigger: function(t, e) {
              return this.each(function() {
                a.event.trigger(t, e, this);
              });
            }, triggerHandler: function(t, e) {
              var i = this[0];
              if (i)
                return a.event.trigger(t, e, i, !0);
            } }), F.focusin || a.each({ focus: "focusin", blur: "focusout" }, function(t, e) {
              var i = function(o) {
                a.event.simulate(e, o.target, a.event.fix(o));
              };
              a.event.special[e] = { setup: function() {
                var o = this.ownerDocument || this.document || this, u = $.access(o, e);
                u || o.addEventListener(t, i, !0), $.access(o, e, (u || 0) + 1);
              }, teardown: function() {
                var o = this.ownerDocument || this.document || this, u = $.access(o, e) - 1;
                u ? $.access(o, e, u) : (o.removeEventListener(t, i, !0), $.remove(o, e));
              } };
            });
            var Cn = I.location, fr = { guid: Date.now() }, Gn = /\?/;
            a.parseXML = function(t) {
              var e, i;
              if (!t || typeof t != "string")
                return null;
              try {
                e = new I.DOMParser().parseFromString(t, "text/xml");
              } catch {
              }
              return i = e && e.getElementsByTagName("parsererror")[0], e && !i || a.error("Invalid XML: " + (i ? a.map(i.childNodes, function(o) {
                return o.textContent;
              }).join(`
`) : t)), e;
            };
            var Dr = /\[\]$/, yr = /\r?\n/g, Qr = /^(?:submit|button|image|reset|file)$/i, Rr = /^(?:input|select|textarea|keygen)/i;
            function Jn(t, e, i, o) {
              var u;
              if (Array.isArray(e))
                a.each(e, function(p, h) {
                  i || Dr.test(t) ? o(t, h) : Jn(t + "[" + (typeof h == "object" && h != null ? p : "") + "]", h, i, o);
                });
              else if (i || gt(e) !== "object")
                o(t, e);
              else
                for (u in e)
                  Jn(t + "[" + u + "]", e[u], i, o);
            }
            a.param = function(t, e) {
              var i, o = [], u = function(p, h) {
                var x = L(h) ? h() : h;
                o[o.length] = encodeURIComponent(p) + "=" + encodeURIComponent(x ?? "");
              };
              if (t == null)
                return "";
              if (Array.isArray(t) || t.jquery && !a.isPlainObject(t))
                a.each(t, function() {
                  u(this.name, this.value);
                });
              else
                for (i in t)
                  Jn(i, t[i], e, u);
              return o.join("&");
            }, a.fn.extend({ serialize: function() {
              return a.param(this.serializeArray());
            }, serializeArray: function() {
              return this.map(function() {
                var t = a.prop(this, "elements");
                return t ? a.makeArray(t) : this;
              }).filter(function() {
                var t = this.type;
                return this.name && !a(this).is(":disabled") && Rr.test(this.nodeName) && !Qr.test(t) && (this.checked || !Ke.test(t));
              }).map(function(t, e) {
                var i = a(this).val();
                return i == null ? null : Array.isArray(i) ? a.map(i, function(o) {
                  return { name: e.name, value: o.replace(yr, `\r
`) };
                }) : { name: e.name, value: i.replace(yr, `\r
`) };
              }).get();
            } });
            var Mr = /%20/g, Ir = /#.*$/, Nr = /([?&])_=[^&]*/, Fr = /^(.*?):[ \t]*([^\r\n]*)$/gm, Br = /^(?:GET|HEAD)$/, zr = /^\/\//, gr = {}, Zn = {}, br = "*/".concat("*"), tr = U.createElement("a");
            function vr(t) {
              return function(e, i) {
                typeof e != "string" && (i = e, e = "*");
                var o, u = 0, p = e.toLowerCase().match(me) || [];
                if (L(i))
                  for (; o = p[u++]; )
                    o[0] === "+" ? (o = o.slice(1) || "*", (t[o] = t[o] || []).unshift(i)) : (t[o] = t[o] || []).push(i);
              };
            }
            function xr(t, e, i, o) {
              var u = {}, p = t === Zn;
              function h(x) {
                var _;
                return u[x] = !0, a.each(t[x] || [], function(T, A) {
                  var D = A(e, i, o);
                  return typeof D != "string" || p || u[D] ? p ? !(_ = D) : void 0 : (e.dataTypes.unshift(D), h(D), !1);
                }), _;
              }
              return h(e.dataTypes[0]) || !u["*"] && h("*");
            }
            function er(t, e) {
              var i, o, u = a.ajaxSettings.flatOptions || {};
              for (i in e)
                e[i] !== void 0 && ((u[i] ? t : o || (o = {}))[i] = e[i]);
              return o && a.extend(!0, t, o), t;
            }
            tr.href = Cn.href, a.extend({ active: 0, lastModified: {}, etag: {}, ajaxSettings: { url: Cn.href, type: "GET", isLocal: /^(?:about|app|app-storage|.+-extension|file|res|widget):$/.test(Cn.protocol), global: !0, processData: !0, async: !0, contentType: "application/x-www-form-urlencoded; charset=UTF-8", accepts: { "*": br, text: "text/plain", html: "text/html", xml: "application/xml, text/xml", json: "application/json, text/javascript" }, contents: { xml: /\bxml\b/, html: /\bhtml/, json: /\bjson\b/ }, responseFields: { xml: "responseXML", text: "responseText", json: "responseJSON" }, converters: { "* text": String, "text html": !0, "text json": JSON.parse, "text xml": a.parseXML }, flatOptions: { url: !0, context: !0 } }, ajaxSetup: function(t, e) {
              return e ? er(er(t, a.ajaxSettings), e) : er(a.ajaxSettings, t);
            }, ajaxPrefilter: vr(gr), ajaxTransport: vr(Zn), ajax: function(t, e) {
              typeof t == "object" && (e = t, t = void 0), e = e || {};
              var i, o, u, p, h, x, _, T, A, D, S = a.ajaxSetup({}, e), E = S.context || S, H = S.context && (E.nodeType || E.jquery) ? a(E) : a.event, Y = a.Deferred(), W = a.Callbacks("once memory"), St = S.statusCode || {}, Vt = {}, ge = {}, wt = "canceled", nt = { readyState: 0, getResponseHeader: function(ft) {
                var Et;
                if (_) {
                  if (!p)
                    for (p = {}; Et = Fr.exec(u); )
                      p[Et[1].toLowerCase() + " "] = (p[Et[1].toLowerCase() + " "] || []).concat(Et[2]);
                  Et = p[ft.toLowerCase() + " "];
                }
                return Et == null ? null : Et.join(", ");
              }, getAllResponseHeaders: function() {
                return _ ? u : null;
              }, setRequestHeader: function(ft, Et) {
                return _ == null && (ft = ge[ft.toLowerCase()] = ge[ft.toLowerCase()] || ft, Vt[ft] = Et), this;
              }, overrideMimeType: function(ft) {
                return _ == null && (S.mimeType = ft), this;
              }, statusCode: function(ft) {
                var Et;
                if (ft)
                  if (_)
                    nt.always(ft[nt.status]);
                  else
                    for (Et in ft)
                      St[Et] = [St[Et], ft[Et]];
                return this;
              }, abort: function(ft) {
                var Et = ft || wt;
                return i && i.abort(Et), ue(0, Et), this;
              } };
              if (Y.promise(nt), S.url = ((t || S.url || Cn.href) + "").replace(zr, Cn.protocol + "//"), S.type = e.method || e.type || S.method || S.type, S.dataTypes = (S.dataType || "*").toLowerCase().match(me) || [""], S.crossDomain == null) {
                x = U.createElement("a");
                try {
                  x.href = S.url, x.href = x.href, S.crossDomain = tr.protocol + "//" + tr.host != x.protocol + "//" + x.host;
                } catch {
                  S.crossDomain = !0;
                }
              }
              if (S.data && S.processData && typeof S.data != "string" && (S.data = a.param(S.data, S.traditional)), xr(gr, S, e, nt), _)
                return nt;
              for (A in (T = a.event && S.global) && a.active++ == 0 && a.event.trigger("ajaxStart"), S.type = S.type.toUpperCase(), S.hasContent = !Br.test(S.type), o = S.url.replace(Ir, ""), S.hasContent ? S.data && S.processData && (S.contentType || "").indexOf("application/x-www-form-urlencoded") === 0 && (S.data = S.data.replace(Mr, "+")) : (D = S.url.slice(o.length), S.data && (S.processData || typeof S.data == "string") && (o += (Gn.test(o) ? "&" : "?") + S.data, delete S.data), S.cache === !1 && (o = o.replace(Nr, "$1"), D = (Gn.test(o) ? "&" : "?") + "_=" + fr.guid++ + D), S.url = o + D), S.ifModified && (a.lastModified[o] && nt.setRequestHeader("If-Modified-Since", a.lastModified[o]), a.etag[o] && nt.setRequestHeader("If-None-Match", a.etag[o])), (S.data && S.hasContent && S.contentType !== !1 || e.contentType) && nt.setRequestHeader("Content-Type", S.contentType), nt.setRequestHeader("Accept", S.dataTypes[0] && S.accepts[S.dataTypes[0]] ? S.accepts[S.dataTypes[0]] + (S.dataTypes[0] !== "*" ? ", " + br + "; q=0.01" : "") : S.accepts["*"]), S.headers)
                nt.setRequestHeader(A, S.headers[A]);
              if (S.beforeSend && (S.beforeSend.call(E, nt, S) === !1 || _))
                return nt.abort();
              if (wt = "abort", W.add(S.complete), nt.done(S.success), nt.fail(S.error), i = xr(Zn, S, e, nt)) {
                if (nt.readyState = 1, T && H.trigger("ajaxSend", [nt, S]), _)
                  return nt;
                S.async && S.timeout > 0 && (h = I.setTimeout(function() {
                  nt.abort("timeout");
                }, S.timeout));
                try {
                  _ = !1, i.send(Vt, ue);
                } catch (ft) {
                  if (_)
                    throw ft;
                  ue(-1, ft);
                }
              } else
                ue(-1, "No Transport");
              function ue(ft, Et, Tn, In) {
                var be, en, hn, de, mn, _e = Et;
                _ || (_ = !0, h && I.clearTimeout(h), i = void 0, u = In || "", nt.readyState = ft > 0 ? 4 : 0, be = ft >= 200 && ft < 300 || ft === 304, Tn && (de = function(Lt, ve, xe) {
                  for (var De, Ft, bt, Ut, we = Lt.contents, Bt = Lt.dataTypes; Bt[0] === "*"; )
                    Bt.shift(), De === void 0 && (De = Lt.mimeType || ve.getResponseHeader("Content-Type"));
                  if (De) {
                    for (Ft in we)
                      if (we[Ft] && we[Ft].test(De)) {
                        Bt.unshift(Ft);
                        break;
                      }
                  }
                  if (Bt[0] in xe)
                    bt = Bt[0];
                  else {
                    for (Ft in xe) {
                      if (!Bt[0] || Lt.converters[Ft + " " + Bt[0]]) {
                        bt = Ft;
                        break;
                      }
                      Ut || (Ut = Ft);
                    }
                    bt = bt || Ut;
                  }
                  if (bt)
                    return bt !== Bt[0] && Bt.unshift(bt), xe[bt];
                }(S, nt, Tn)), !be && a.inArray("script", S.dataTypes) > -1 && a.inArray("json", S.dataTypes) < 0 && (S.converters["text script"] = function() {
                }), de = function(Lt, ve, xe, De) {
                  var Ft, bt, Ut, we, Bt, ke = {}, fn = Lt.dataTypes.slice();
                  if (fn[1])
                    for (Ut in Lt.converters)
                      ke[Ut.toLowerCase()] = Lt.converters[Ut];
                  for (bt = fn.shift(); bt; )
                    if (Lt.responseFields[bt] && (xe[Lt.responseFields[bt]] = ve), !Bt && De && Lt.dataFilter && (ve = Lt.dataFilter(ve, Lt.dataType)), Bt = bt, bt = fn.shift()) {
                      if (bt === "*")
                        bt = Bt;
                      else if (Bt !== "*" && Bt !== bt) {
                        if (!(Ut = ke[Bt + " " + bt] || ke["* " + bt])) {
                          for (Ft in ke)
                            if ((we = Ft.split(" "))[1] === bt && (Ut = ke[Bt + " " + we[0]] || ke["* " + we[0]])) {
                              Ut === !0 ? Ut = ke[Ft] : ke[Ft] !== !0 && (bt = we[0], fn.unshift(we[1]));
                              break;
                            }
                        }
                        if (Ut !== !0)
                          if (Ut && Lt.throws)
                            ve = Ut(ve);
                          else
                            try {
                              ve = Ut(ve);
                            } catch (Nn) {
                              return { state: "parsererror", error: Ut ? Nn : "No conversion from " + Bt + " to " + bt };
                            }
                      }
                    }
                  return { state: "success", data: ve };
                }(S, de, nt, be), be ? (S.ifModified && ((mn = nt.getResponseHeader("Last-Modified")) && (a.lastModified[o] = mn), (mn = nt.getResponseHeader("etag")) && (a.etag[o] = mn)), ft === 204 || S.type === "HEAD" ? _e = "nocontent" : ft === 304 ? _e = "notmodified" : (_e = de.state, en = de.data, be = !(hn = de.error))) : (hn = _e, !ft && _e || (_e = "error", ft < 0 && (ft = 0))), nt.status = ft, nt.statusText = (Et || _e) + "", be ? Y.resolveWith(E, [en, _e, nt]) : Y.rejectWith(E, [nt, _e, hn]), nt.statusCode(St), St = void 0, T && H.trigger(be ? "ajaxSuccess" : "ajaxError", [nt, S, be ? en : hn]), W.fireWith(E, [nt, _e]), T && (H.trigger("ajaxComplete", [nt, S]), --a.active || a.event.trigger("ajaxStop")));
              }
              return nt;
            }, getJSON: function(t, e, i) {
              return a.get(t, e, i, "json");
            }, getScript: function(t, e) {
              return a.get(t, void 0, e, "script");
            } }), a.each(["get", "post"], function(t, e) {
              a[e] = function(i, o, u, p) {
                return L(o) && (p = p || u, u = o, o = void 0), a.ajax(a.extend({ url: i, type: e, dataType: p, data: o, success: u }, a.isPlainObject(i) && i));
              };
            }), a.ajaxPrefilter(function(t) {
              var e;
              for (e in t.headers)
                e.toLowerCase() === "content-type" && (t.contentType = t.headers[e] || "");
            }), a._evalUrl = function(t, e, i) {
              return a.ajax({ url: t, type: "GET", dataType: "script", cache: !0, async: !1, global: !1, converters: { "text script": function() {
              } }, dataFilter: function(o) {
                a.globalEval(o, e, i);
              } });
            }, a.fn.extend({ wrapAll: function(t) {
              var e;
              return this[0] && (L(t) && (t = t.call(this[0])), e = a(t, this[0].ownerDocument).eq(0).clone(!0), this[0].parentNode && e.insertBefore(this[0]), e.map(function() {
                for (var i = this; i.firstElementChild; )
                  i = i.firstElementChild;
                return i;
              }).append(this)), this;
            }, wrapInner: function(t) {
              return L(t) ? this.each(function(e) {
                a(this).wrapInner(t.call(this, e));
              }) : this.each(function() {
                var e = a(this), i = e.contents();
                i.length ? i.wrapAll(t) : e.append(t);
              });
            }, wrap: function(t) {
              var e = L(t);
              return this.each(function(i) {
                a(this).wrapAll(e ? t.call(this, i) : t);
              });
            }, unwrap: function(t) {
              return this.parent(t).not("body").each(function() {
                a(this).replaceWith(this.childNodes);
              }), this;
            } }), a.expr.pseudos.hidden = function(t) {
              return !a.expr.pseudos.visible(t);
            }, a.expr.pseudos.visible = function(t) {
              return !!(t.offsetWidth || t.offsetHeight || t.getClientRects().length);
            }, a.ajaxSettings.xhr = function() {
              try {
                return new I.XMLHttpRequest();
              } catch {
              }
            };
            var Hr = { 0: 200, 1223: 204 }, jn = a.ajaxSettings.xhr();
            F.cors = !!jn && "withCredentials" in jn, F.ajax = jn = !!jn, a.ajaxTransport(function(t) {
              var e, i;
              if (F.cors || jn && !t.crossDomain)
                return { send: function(o, u) {
                  var p, h = t.xhr();
                  if (h.open(t.type, t.url, t.async, t.username, t.password), t.xhrFields)
                    for (p in t.xhrFields)
                      h[p] = t.xhrFields[p];
                  for (p in t.mimeType && h.overrideMimeType && h.overrideMimeType(t.mimeType), t.crossDomain || o["X-Requested-With"] || (o["X-Requested-With"] = "XMLHttpRequest"), o)
                    h.setRequestHeader(p, o[p]);
                  e = function(x) {
                    return function() {
                      e && (e = i = h.onload = h.onerror = h.onabort = h.ontimeout = h.onreadystatechange = null, x === "abort" ? h.abort() : x === "error" ? typeof h.status != "number" ? u(0, "error") : u(h.status, h.statusText) : u(Hr[h.status] || h.status, h.statusText, (h.responseType || "text") !== "text" || typeof h.responseText != "string" ? { binary: h.response } : { text: h.responseText }, h.getAllResponseHeaders()));
                    };
                  }, h.onload = e(), i = h.onerror = h.ontimeout = e("error"), h.onabort !== void 0 ? h.onabort = i : h.onreadystatechange = function() {
                    h.readyState === 4 && I.setTimeout(function() {
                      e && i();
                    });
                  }, e = e("abort");
                  try {
                    h.send(t.hasContent && t.data || null);
                  } catch (x) {
                    if (e)
                      throw x;
                  }
                }, abort: function() {
                  e && e();
                } };
            }), a.ajaxPrefilter(function(t) {
              t.crossDomain && (t.contents.script = !1);
            }), a.ajaxSetup({ accepts: { script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript" }, contents: { script: /\b(?:java|ecma)script\b/ }, converters: { "text script": function(t) {
              return a.globalEval(t), t;
            } } }), a.ajaxPrefilter("script", function(t) {
              t.cache === void 0 && (t.cache = !1), t.crossDomain && (t.type = "GET");
            }), a.ajaxTransport("script", function(t) {
              var e, i;
              if (t.crossDomain || t.scriptAttrs)
                return { send: function(o, u) {
                  e = a("<script>").attr(t.scriptAttrs || {}).prop({ charset: t.scriptCharset, src: t.url }).on("load error", i = function(p) {
                    e.remove(), i = null, p && u(p.type === "error" ? 404 : 200, p.type);
                  }), U.head.appendChild(e[0]);
                }, abort: function() {
                  i && i();
                } };
            });
            var wr, kr = [], nr = /(=)\?(?=&|$)|\?\?/;
            a.ajaxSetup({ jsonp: "callback", jsonpCallback: function() {
              var t = kr.pop() || a.expando + "_" + fr.guid++;
              return this[t] = !0, t;
            } }), a.ajaxPrefilter("json jsonp", function(t, e, i) {
              var o, u, p, h = t.jsonp !== !1 && (nr.test(t.url) ? "url" : typeof t.data == "string" && (t.contentType || "").indexOf("application/x-www-form-urlencoded") === 0 && nr.test(t.data) && "data");
              if (h || t.dataTypes[0] === "jsonp")
                return o = t.jsonpCallback = L(t.jsonpCallback) ? t.jsonpCallback() : t.jsonpCallback, h ? t[h] = t[h].replace(nr, "$1" + o) : t.jsonp !== !1 && (t.url += (Gn.test(t.url) ? "&" : "?") + t.jsonp + "=" + o), t.converters["script json"] = function() {
                  return p || a.error(o + " was not called"), p[0];
                }, t.dataTypes[0] = "json", u = I[o], I[o] = function() {
                  p = arguments;
                }, i.always(function() {
                  u === void 0 ? a(I).removeProp(o) : I[o] = u, t[o] && (t.jsonpCallback = e.jsonpCallback, kr.push(o)), p && L(u) && u(p[0]), p = u = void 0;
                }), "script";
            }), F.createHTMLDocument = ((wr = U.implementation.createHTMLDocument("").body).innerHTML = "<form></form><form></form>", wr.childNodes.length === 2), a.parseHTML = function(t, e, i) {
              return typeof t != "string" ? [] : (typeof e == "boolean" && (i = e, e = !1), e || (F.createHTMLDocument ? ((o = (e = U.implementation.createHTMLDocument("")).createElement("base")).href = U.location.href, e.head.appendChild(o)) : e = U), p = !i && [], (u = ee.exec(t)) ? [e.createElement(u[1])] : (u = An([t], e, p), p && p.length && a(p).remove(), a.merge([], u.childNodes)));
              var o, u, p;
            }, a.fn.load = function(t, e, i) {
              var o, u, p, h = this, x = t.indexOf(" ");
              return x > -1 && (o = Ze(t.slice(x)), t = t.slice(0, x)), L(e) ? (i = e, e = void 0) : e && typeof e == "object" && (u = "POST"), h.length > 0 && a.ajax({ url: t, type: u || "GET", dataType: "html", data: e }).done(function(_) {
                p = arguments, h.html(o ? a("<div>").append(a.parseHTML(_)).find(o) : _);
              }).always(i && function(_, T) {
                h.each(function() {
                  i.apply(this, p || [_.responseText, T, _]);
                });
              }), this;
            }, a.expr.pseudos.animated = function(t) {
              return a.grep(a.timers, function(e) {
                return t === e.elem;
              }).length;
            }, a.offset = { setOffset: function(t, e, i) {
              var o, u, p, h, x, _, T = a.css(t, "position"), A = a(t), D = {};
              T === "static" && (t.style.position = "relative"), x = A.offset(), p = a.css(t, "top"), _ = a.css(t, "left"), (T === "absolute" || T === "fixed") && (p + _).indexOf("auto") > -1 ? (h = (o = A.position()).top, u = o.left) : (h = parseFloat(p) || 0, u = parseFloat(_) || 0), L(e) && (e = e.call(t, i, a.extend({}, x))), e.top != null && (D.top = e.top - x.top + h), e.left != null && (D.left = e.left - x.left + u), "using" in e ? e.using.call(t, D) : A.css(D);
            } }, a.fn.extend({ offset: function(t) {
              if (arguments.length)
                return t === void 0 ? this : this.each(function(u) {
                  a.offset.setOffset(this, t, u);
                });
              var e, i, o = this[0];
              return o ? o.getClientRects().length ? (e = o.getBoundingClientRect(), i = o.ownerDocument.defaultView, { top: e.top + i.pageYOffset, left: e.left + i.pageXOffset }) : { top: 0, left: 0 } : void 0;
            }, position: function() {
              if (this[0]) {
                var t, e, i, o = this[0], u = { top: 0, left: 0 };
                if (a.css(o, "position") === "fixed")
                  e = o.getBoundingClientRect();
                else {
                  for (e = this.offset(), i = o.ownerDocument, t = o.offsetParent || i.documentElement; t && (t === i.body || t === i.documentElement) && a.css(t, "position") === "static"; )
                    t = t.parentNode;
                  t && t !== o && t.nodeType === 1 && ((u = a(t).offset()).top += a.css(t, "borderTopWidth", !0), u.left += a.css(t, "borderLeftWidth", !0));
                }
                return { top: e.top - u.top - a.css(o, "marginTop", !0), left: e.left - u.left - a.css(o, "marginLeft", !0) };
              }
            }, offsetParent: function() {
              return this.map(function() {
                for (var t = this.offsetParent; t && a.css(t, "position") === "static"; )
                  t = t.offsetParent;
                return t || Pe;
              });
            } }), a.each({ scrollLeft: "pageXOffset", scrollTop: "pageYOffset" }, function(t, e) {
              var i = e === "pageYOffset";
              a.fn[t] = function(o) {
                return Qt(this, function(u, p, h) {
                  var x;
                  if (f(u) ? x = u : u.nodeType === 9 && (x = u.defaultView), h === void 0)
                    return x ? x[e] : u[p];
                  x ? x.scrollTo(i ? x.pageXOffset : h, i ? h : x.pageYOffset) : u[p] = h;
                }, t, o, arguments.length);
              };
            }), a.each(["top", "left"], function(t, e) {
              a.cssHooks[e] = l(F.pixelPosition, function(i, o) {
                if (o)
                  return o = r(i, e), dn.test(o) ? a(i).position()[e] + "px" : o;
              });
            }), a.each({ Height: "height", Width: "width" }, function(t, e) {
              a.each({ padding: "inner" + t, content: e, "": "outer" + t }, function(i, o) {
                a.fn[o] = function(u, p) {
                  var h = arguments.length && (i || typeof u != "boolean"), x = i || (u === !0 || p === !0 ? "margin" : "border");
                  return Qt(this, function(_, T, A) {
                    var D;
                    return f(_) ? o.indexOf("outer") === 0 ? _["inner" + t] : _.document.documentElement["client" + t] : _.nodeType === 9 ? (D = _.documentElement, Math.max(_.body["scroll" + t], D["scroll" + t], _.body["offset" + t], D["offset" + t], D["client" + t])) : A === void 0 ? a.css(_, T, x) : a.style(_, T, A, x);
                  }, e, h ? u : void 0, h);
                };
              });
            }), a.each(["ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend"], function(t, e) {
              a.fn[e] = function(i) {
                return this.on(e, i);
              };
            }), a.fn.extend({ bind: function(t, e, i) {
              return this.on(t, null, e, i);
            }, unbind: function(t, e) {
              return this.off(t, null, e);
            }, delegate: function(t, e, i, o) {
              return this.on(e, t, i, o);
            }, undelegate: function(t, e, i) {
              return arguments.length === 1 ? this.off(t, "**") : this.off(e, t || "**", i);
            }, hover: function(t, e) {
              return this.mouseenter(t).mouseleave(e || t);
            } }), a.each("blur focus focusin focusout resize scroll click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup contextmenu".split(" "), function(t, e) {
              a.fn[e] = function(i, o) {
                return arguments.length > 0 ? this.on(e, null, i, o) : this.trigger(e);
              };
            });
            var Wr = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
            a.proxy = function(t, e) {
              var i, o, u;
              if (typeof e == "string" && (i = t[e], e = t, t = i), L(t))
                return o = ht.call(arguments, 2), u = function() {
                  return t.apply(e || this, o.concat(ht.call(arguments)));
                }, u.guid = t.guid = t.guid || a.guid++, u;
            }, a.holdReady = function(t) {
              t ? a.readyWait++ : a.ready(!0);
            }, a.isArray = Array.isArray, a.parseJSON = JSON.parse, a.nodeName = Dt, a.isFunction = L, a.isWindow = f, a.camelCase = q, a.type = gt, a.now = Date.now, a.isNumeric = function(t) {
              var e = a.type(t);
              return (e === "number" || e === "string") && !isNaN(t - parseFloat(t));
            }, a.trim = function(t) {
              return t == null ? "" : (t + "").replace(Wr, "");
            }, (K = function() {
              return a;
            }.apply(yt, [])) === void 0 || (ot.exports = K);
            var Vr = I.jQuery, Ur = I.$;
            return a.noConflict = function(t) {
              return I.$ === a && (I.$ = Ur), t && I.jQuery === a && (I.jQuery = Vr), a;
            }, at === void 0 && (I.jQuery = I.$ = a), a;
          });
        }, 703: (ot, yt, K) => {
          var I = K(414);
          function at() {
          }
          function st() {
          }
          st.resetWarningCache = at, ot.exports = function() {
            function dt(Ht, vt, Xt, ct, Gt, Jt) {
              if (Jt !== I) {
                var g = new Error("Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types");
                throw g.name = "Invariant Violation", g;
              }
            }
            function ht() {
              return dt;
            }
            dt.isRequired = dt;
            var te = { array: dt, bool: dt, func: dt, number: dt, object: dt, string: dt, symbol: dt, any: dt, arrayOf: ht, element: dt, elementType: dt, instanceOf: ht, node: dt, objectOf: ht, oneOf: ht, oneOfType: ht, shape: ht, exact: ht, checkPropTypes: st, resetWarningCache: at };
            return te.PropTypes = te, te;
          };
        }, 697: (ot, yt, K) => {
          ot.exports = K(703)();
        }, 414: (ot) => {
          ot.exports = "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED";
        }, 156: (ot) => {
          ot.exports = se;
        } }, cr = {};
        function pe(ot) {
          var yt = cr[ot];
          if (yt !== void 0)
            return yt.exports;
          var K = cr[ot] = { id: ot, exports: {} };
          return Un[ot].call(K.exports, K, K.exports, pe), K.exports;
        }
        pe.n = (ot) => {
          var yt = ot && ot.__esModule ? () => ot.default : () => ot;
          return pe.d(yt, { a: yt }), yt;
        }, pe.d = (ot, yt) => {
          for (var K in yt)
            pe.o(yt, K) && !pe.o(ot, K) && Object.defineProperty(ot, K, { enumerable: !0, get: yt[K] });
        }, pe.o = (ot, yt) => Object.prototype.hasOwnProperty.call(ot, yt), pe.r = (ot) => {
          typeof Symbol < "u" && Symbol.toStringTag && Object.defineProperty(ot, Symbol.toStringTag, { value: "Module" }), Object.defineProperty(ot, "__esModule", { value: !0 });
        };
        var $n = {};
        return (() => {
          pe.r($n), pe.d($n, { addStyles: () => yt, EditableMathField: () => K, StaticMathField: () => I, default: () => at });
          var ot = pe(527);
          function yt() {
            if (document.getElementById("react-mathquill-styles") == null) {
              var st = document.createElement("style");
              st.setAttribute("id", "react-mathquill-styles"), st.innerHTML = ot.Z[0][1], document.getElementsByTagName("head")[0].appendChild(st);
            }
          }
          var K = pe(991).Z, I = pe(717).Z;
          const at = K;
        })(), $n;
      })();
    });
  }(reactMathquill_min)), reactMathquill_min.exports;
}
var reactMathquill = { exports: {} }, hasRequiredReactMathquill;
function requireReactMathquill() {
  return hasRequiredReactMathquill || (hasRequiredReactMathquill = 1, function(module, exports) {
    (function(ae, se) {
      module.exports = se(React__default);
    })(commonjsGlobal, function(__WEBPACK_EXTERNAL_MODULE_react__) {
      return (
        /******/
        (() => {
          var __webpack_modules__ = {
            /***/
            "./src/EditableMathField.js": (
              /*!**********************************!*\
                !*** ./src/EditableMathField.js ***!
                \**********************************/
              /***/
              (__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
                eval(`__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js");
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _mathquill_loader__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./mathquill-loader */ "./src/mathquill-loader.js");
var _excluded = ["latex", "onChange", "config", "mathquillDidMount"];

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }





var EditableMathField = function EditableMathField(_ref) {
  var latex = _ref.latex,
      onChange = _ref.onChange,
      config = _ref.config,
      mathquillDidMount = _ref.mathquillDidMount,
      otherProps = _objectWithoutProperties(_ref, _excluded);

  // MathQuill fire 2 edit events on startup.
  var ignoreEditEvents = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(2);
  var mathField = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  var wrapperElement = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null); // This is required to prevent state closure over the onChange function

  var onChangeRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(onChange);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    onChangeRef.current = onChange;
  }, [onChange]); // Setup MathQuill on the wrapperElement

  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    if (!wrapperElement.current) return;
    var combinedConfig = {
      restrictMismatchedBrackets: true,
      handlers: {}
    };

    if (config) {
      combinedConfig = _objectSpread(_objectSpread({}, combinedConfig), config);
    }

    var configEditHandler = combinedConfig.handlers.edit;

    combinedConfig.handlers.edit = function (mathField) {
      if (configEditHandler) configEditHandler();

      if (ignoreEditEvents.current > 0) {
        ignoreEditEvents.current -= 1;
      } else {
        if (onChangeRef.current) onChangeRef.current(mathField);
      }
    };

    mathField.current = _mathquill_loader__WEBPACK_IMPORTED_MODULE_2__["default"].MathField(wrapperElement.current, combinedConfig);
    mathField.current.latex(latex || '');
    if (mathquillDidMount) mathquillDidMount(mathField.current);
  }, [wrapperElement]);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    if (mathField.current && mathField.current.latex() !== latex) {
      mathField.current.latex(latex);
    }
  }, [latex]);
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", _extends({}, otherProps, {
    ref: wrapperElement
  }));
};

EditableMathField.propTypes = {
  latex: (prop_types__WEBPACK_IMPORTED_MODULE_1___default().string),
  onChange: (prop_types__WEBPACK_IMPORTED_MODULE_1___default().func),
  config: (prop_types__WEBPACK_IMPORTED_MODULE_1___default().object),
  mathquillDidMount: (prop_types__WEBPACK_IMPORTED_MODULE_1___default().func)
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (EditableMathField);

//# sourceURL=webpack://MathquillComponent/./src/EditableMathField.js?`);
              }
            ),
            /***/
            "./src/StaticMathField.js": (
              /*!********************************!*\
                !*** ./src/StaticMathField.js ***!
                \********************************/
              /***/
              (__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
                eval(`__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js");
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _mathquill_loader__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./mathquill-loader */ "./src/mathquill-loader.js");
var _excluded = ["mathquillDidMount", "children"];

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }





var StaticMathField = function StaticMathField(_ref) {
  var mathquillDidMount = _ref.mathquillDidMount,
      children = _ref.children,
      otherProps = _objectWithoutProperties(_ref, _excluded);

  var wrapperElement = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  var mathField = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useLayoutEffect)(function () {
    if (!wrapperElement) return;
    mathField.current = _mathquill_loader__WEBPACK_IMPORTED_MODULE_2__["default"].StaticMath(wrapperElement.current);
    if (mathquillDidMount) mathquillDidMount(mathField.current);
  }, [wrapperElement, children]);
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", _extends({}, otherProps, {
    ref: wrapperElement
  }), children);
};

StaticMathField.propTypes = {
  children: (prop_types__WEBPACK_IMPORTED_MODULE_1___default().string),
  mathquillDidMount: (prop_types__WEBPACK_IMPORTED_MODULE_1___default().func)
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (StaticMathField);

//# sourceURL=webpack://MathquillComponent/./src/StaticMathField.js?`);
              }
            ),
            /***/
            "./src/index.js": (
              /*!**********************!*\
                !*** ./src/index.js ***!
                \**********************/
              /***/
              (__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
                eval(`__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "addStyles": () => (/* binding */ addStyles),
/* harmony export */   "EditableMathField": () => (/* binding */ EditableMathField),
/* harmony export */   "StaticMathField": () => (/* binding */ StaticMathField),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _edtr_io_mathquill_build_mathquill_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @edtr-io/mathquill/build/mathquill.css */ "./node_modules/@edtr-io/mathquill/build/mathquill.css");

function addStyles() {
  if (document.getElementById('react-mathquill-styles') == null) {
    var styleTag = document.createElement('style');
    styleTag.setAttribute('id', 'react-mathquill-styles');
    styleTag.innerHTML = _edtr_io_mathquill_build_mathquill_css__WEBPACK_IMPORTED_MODULE_0__["default"][0][1];
    var head = document.getElementsByTagName('head')[0];
    head.appendChild(styleTag);
  }
}
var EditableMathField = __webpack_require__(/*! ./EditableMathField */ "./src/EditableMathField.js")["default"];
var StaticMathField = __webpack_require__(/*! ./StaticMathField */ "./src/StaticMathField.js")["default"];
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (EditableMathField);

//# sourceURL=webpack://MathquillComponent/./src/index.js?`);
              }
            ),
            /***/
            "./src/mathquill-loader.js": (
              /*!*********************************!*\
                !*** ./src/mathquill-loader.js ***!
                \*********************************/
              /***/
              (__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
                eval(`__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// webpack loaders are used to configure mathquill as a commonjs module, see webpack.config.js
var MathQuill = __webpack_require__(/*! @edtr-io/mathquill/build/mathquill.js */ "./node_modules/@edtr-io/mathquill/build/mathquill.js");

var MQ = MathQuill.getInterface(2);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (MQ);

//# sourceURL=webpack://MathquillComponent/./src/mathquill-loader.js?`);
              }
            ),
            /***/
            "./node_modules/@edtr-io/mathquill/build/mathquill.css": (
              /*!*************************************************************!*\
                !*** ./node_modules/@edtr-io/mathquill/build/mathquill.css ***!
                \*************************************************************/
              /***/
              (module, __webpack_exports__, __webpack_require__) => {
                eval(`__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../css-loader/dist/runtime/noSourceMaps.js */ "./node_modules/css-loader/dist/runtime/noSourceMaps.js");
/* harmony import */ var _css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, "/*\\n * MathQuill v0.11.0, by Han, Jeanine, and Mary\\n * http://mathquill.com | maintainers@mathquill.com\\n *\\n * This Source Code Form is subject to the terms of the\\n * Mozilla Public License, v. 2.0. If a copy of the MPL\\n * was not distributed with this file, You can obtain\\n * one at http://mozilla.org/MPL/2.0/.\\n */\\n@font-face {\\n  /* Heavy fonts have been removed */\\n  font-family: Symbola;\\n}\\n.mq-editable-field {\\n  display: -moz-inline-box;\\n  display: inline-block;\\n}\\n.mq-editable-field .mq-cursor {\\n  border-left: 1px solid black;\\n  margin-left: -1px;\\n  position: relative;\\n  z-index: 1;\\n  padding: 0;\\n  display: -moz-inline-box;\\n  display: inline-block;\\n}\\n.mq-editable-field .mq-cursor.mq-blink {\\n  visibility: hidden;\\n}\\n.mq-editable-field,\\n.mq-math-mode .mq-editable-field {\\n  border: 1px solid gray;\\n}\\n.mq-editable-field.mq-focused,\\n.mq-math-mode .mq-editable-field.mq-focused {\\n  -webkit-box-shadow: #8bd 0 0 1px 2px, inset #6ae 0 0 2px 0;\\n  -moz-box-shadow: #8bd 0 0 1px 2px, inset #6ae 0 0 2px 0;\\n  box-shadow: #8bd 0 0 1px 2px, inset #6ae 0 0 2px 0;\\n  border-color: #709AC0;\\n  border-radius: 1px;\\n}\\n.mq-math-mode .mq-editable-field {\\n  margin: 1px;\\n}\\n.mq-editable-field .mq-latex-command-input {\\n  color: inherit;\\n  font-family: \\"Courier New\\", monospace;\\n  border: 1px solid gray;\\n  padding-right: 1px;\\n  margin-right: 1px;\\n  margin-left: 2px;\\n}\\n.mq-editable-field .mq-latex-command-input.mq-empty {\\n  background: transparent;\\n}\\n.mq-editable-field .mq-latex-command-input.mq-hasCursor {\\n  border-color: ActiveBorder;\\n}\\n.mq-editable-field.mq-empty:after,\\n.mq-editable-field.mq-text-mode:after,\\n.mq-math-mode .mq-empty:after {\\n  visibility: hidden;\\n  content: 'c';\\n}\\n.mq-editable-field .mq-cursor:only-child:after,\\n.mq-editable-field .mq-textarea + .mq-cursor:last-child:after {\\n  visibility: hidden;\\n  content: 'c';\\n}\\n.mq-editable-field .mq-text-mode .mq-cursor:only-child:after {\\n  content: '';\\n}\\n.mq-editable-field.mq-text-mode {\\n  overflow-x: auto;\\n  overflow-y: hidden;\\n}\\n.mq-root-block,\\n.mq-math-mode .mq-root-block {\\n  display: -moz-inline-box;\\n  display: inline-block;\\n  width: 100%;\\n  padding: 2px;\\n  -webkit-box-sizing: border-box;\\n  -moz-box-sizing: border-box;\\n  box-sizing: border-box;\\n  white-space: nowrap;\\n  overflow: hidden;\\n  vertical-align: middle;\\n}\\n.mq-math-mode {\\n  font-variant: normal;\\n  font-weight: normal;\\n  font-style: normal;\\n  font-size: 115%;\\n  line-height: 1;\\n  display: -moz-inline-box;\\n  display: inline-block;\\n}\\n.mq-math-mode .mq-non-leaf,\\n.mq-math-mode .mq-scaled {\\n  display: -moz-inline-box;\\n  display: inline-block;\\n}\\n.mq-math-mode var,\\n.mq-math-mode .mq-text-mode,\\n.mq-math-mode .mq-nonSymbola {\\n  font-family: \\"Times New Roman\\", Symbola, serif;\\n  line-height: 0.9;\\n}\\n.mq-math-mode * {\\n  font-size: inherit;\\n  line-height: inherit;\\n  margin: 0;\\n  padding: 0;\\n  border-color: black;\\n  -webkit-user-select: none;\\n  -moz-user-select: none;\\n  user-select: none;\\n  box-sizing: border-box;\\n}\\n.mq-math-mode .mq-empty {\\n  background: #ccc;\\n}\\n.mq-math-mode .mq-empty.mq-root-block {\\n  background: transparent;\\n}\\n.mq-math-mode.mq-empty {\\n  background: transparent;\\n}\\n.mq-math-mode .mq-text-mode {\\n  display: inline-block;\\n  white-space: pre;\\n}\\n.mq-math-mode .mq-text-mode.mq-hasCursor {\\n  box-shadow: inset darkgray 0 0.1em 0.2em;\\n  padding: 0 0.1em;\\n  margin: 0 -0.1em;\\n  min-width: 1ex;\\n}\\n.mq-math-mode .mq-font {\\n  font: 1em \\"Times New Roman\\", Symbola, serif;\\n}\\n.mq-math-mode .mq-font * {\\n  font-family: inherit;\\n  font-style: inherit;\\n}\\n.mq-math-mode b,\\n.mq-math-mode b.mq-font {\\n  font-weight: bolder;\\n}\\n.mq-math-mode var,\\n.mq-math-mode i,\\n.mq-math-mode i.mq-font {\\n  font-style: italic;\\n}\\n.mq-math-mode var.mq-f {\\n  margin-right: 0.2em;\\n  margin-left: 0.1em;\\n}\\n.mq-math-mode .mq-roman var.mq-f {\\n  margin: 0;\\n}\\n.mq-math-mode big {\\n  font-size: 200%;\\n}\\n.mq-math-mode .mq-int > big {\\n  display: inline-block;\\n  -webkit-transform: scaleX(0.7);\\n  -moz-transform: scaleX(0.7);\\n  -ms-transform: scaleX(0.7);\\n  -o-transform: scaleX(0.7);\\n  transform: scaleX(0.7);\\n  vertical-align: -0.16em;\\n}\\n.mq-math-mode .mq-int > .mq-supsub {\\n  font-size: 80%;\\n  vertical-align: -1.1em;\\n  padding-right: 0.2em;\\n}\\n.mq-math-mode .mq-int > .mq-supsub > .mq-sup > .mq-sup-inner {\\n  vertical-align: 1.3em;\\n}\\n.mq-math-mode .mq-int > .mq-supsub > .mq-sub {\\n  margin-left: -0.35em;\\n}\\n.mq-math-mode .mq-roman {\\n  font-style: normal;\\n}\\n.mq-math-mode .mq-sans-serif {\\n  font-family: sans-serif, Symbola, serif;\\n}\\n.mq-math-mode .mq-monospace {\\n  font-family: monospace, Symbola, serif;\\n}\\n.mq-math-mode .mq-overline {\\n  border-top: 1px solid black;\\n  margin-top: 1px;\\n}\\n.mq-math-mode .mq-underline {\\n  border-bottom: 1px solid black;\\n  margin-bottom: 1px;\\n}\\n.mq-math-mode .mq-binary-operator {\\n  padding: 0 0.2em;\\n  display: -moz-inline-box;\\n  display: inline-block;\\n}\\n.mq-math-mode .mq-supsub {\\n  text-align: left;\\n  font-size: 90%;\\n  vertical-align: -0.5em;\\n}\\n.mq-math-mode .mq-supsub.mq-sup-only {\\n  vertical-align: 0.5em;\\n}\\n.mq-math-mode .mq-supsub.mq-sup-only .mq-sup {\\n  display: inline-block;\\n  vertical-align: text-bottom;\\n}\\n.mq-math-mode .mq-supsub .mq-sup {\\n  display: block;\\n}\\n.mq-math-mode .mq-supsub .mq-sub {\\n  display: block;\\n  float: left;\\n}\\n.mq-math-mode .mq-supsub .mq-binary-operator {\\n  padding: 0 0.1em;\\n}\\n.mq-math-mode .mq-supsub .mq-fraction {\\n  font-size: 70%;\\n}\\n.mq-math-mode sup.mq-nthroot {\\n  font-size: 80%;\\n  vertical-align: 0.8em;\\n  margin-right: -0.6em;\\n  margin-left: 0.2em;\\n  min-width: 0.5em;\\n}\\n.mq-math-mode .mq-paren {\\n  padding: 0 0.1em;\\n  vertical-align: top;\\n  -webkit-transform-origin: center 0.06em;\\n  -moz-transform-origin: center 0.06em;\\n  -ms-transform-origin: center 0.06em;\\n  -o-transform-origin: center 0.06em;\\n  transform-origin: center 0.06em;\\n}\\n.mq-math-mode .mq-paren.mq-ghost {\\n  color: silver;\\n}\\n.mq-math-mode .mq-paren + span {\\n  margin-top: 0.1em;\\n  margin-bottom: 0.1em;\\n}\\n.mq-math-mode .mq-array {\\n  vertical-align: middle;\\n  text-align: center;\\n}\\n.mq-math-mode .mq-array > span {\\n  display: block;\\n}\\n.mq-math-mode .mq-operator-name {\\n  font-family: Symbola, \\"Times New Roman\\", serif;\\n  line-height: 0.9;\\n  font-style: normal;\\n}\\n.mq-math-mode var.mq-operator-name.mq-first {\\n  padding-left: 0.2em;\\n}\\n.mq-math-mode var.mq-operator-name.mq-last,\\n.mq-math-mode .mq-supsub.mq-after-operator-name {\\n  padding-right: 0.2em;\\n}\\n.mq-math-mode .mq-fraction {\\n  font-size: 90%;\\n  text-align: center;\\n  vertical-align: -0.4em;\\n  padding: 0 0.2em;\\n}\\n.mq-math-mode .mq-fraction,\\n.mq-math-mode .mq-large-operator,\\n.mq-math-mode x:-moz-any-link {\\n  display: -moz-groupbox;\\n}\\n.mq-math-mode .mq-fraction,\\n.mq-math-mode .mq-large-operator,\\n.mq-math-mode x:-moz-any-link,\\n.mq-math-mode x:default {\\n  display: inline-block;\\n}\\n.mq-math-mode .mq-numerator,\\n.mq-math-mode .mq-denominator,\\n.mq-math-mode .mq-dot-recurring {\\n  display: block;\\n}\\n.mq-math-mode .mq-numerator {\\n  padding: 0 0.1em;\\n}\\n.mq-math-mode .mq-denominator {\\n  border-top: 1px solid;\\n  float: right;\\n  width: 100%;\\n  padding: 0.1em;\\n}\\n.mq-math-mode .mq-dot-recurring {\\n  text-align: center;\\n  height: 0.3em;\\n}\\n.mq-math-mode .mq-sqrt-prefix {\\n  padding-top: 0;\\n  position: relative;\\n  top: 0.1em;\\n  vertical-align: top;\\n  -webkit-transform-origin: top;\\n  -moz-transform-origin: top;\\n  -ms-transform-origin: top;\\n  -o-transform-origin: top;\\n  transform-origin: top;\\n}\\n.mq-math-mode .mq-sqrt-stem {\\n  border-top: 1px solid;\\n  margin-top: 1px;\\n  padding-left: 0.15em;\\n  padding-right: 0.2em;\\n  margin-right: 0.1em;\\n  padding-top: 1px;\\n}\\n.mq-math-mode .mq-diacritic-above {\\n  display: block;\\n  text-align: center;\\n  line-height: 0.4em;\\n}\\n.mq-math-mode .mq-diacritic-stem {\\n  display: block;\\n  text-align: center;\\n}\\n.mq-math-mode .mq-hat-prefix {\\n  display: block;\\n  text-align: center;\\n  line-height: 0.95em;\\n  margin-bottom: -0.7em;\\n  transform: scaleX(1.5);\\n  -moz-transform: scaleX(1.5);\\n  -o-transform: scaleX(1.5);\\n  -webkit-transform: scaleX(1.5);\\n}\\n.mq-math-mode .mq-hat-stem {\\n  display: block;\\n}\\n.mq-math-mode .mq-large-operator {\\n  vertical-align: -0.2em;\\n  padding: 0.2em;\\n  text-align: center;\\n}\\n.mq-math-mode .mq-large-operator .mq-from,\\n.mq-math-mode .mq-large-operator big,\\n.mq-math-mode .mq-large-operator .mq-to {\\n  display: block;\\n}\\n.mq-math-mode .mq-large-operator .mq-from,\\n.mq-math-mode .mq-large-operator .mq-to {\\n  font-size: 80%;\\n}\\n.mq-math-mode .mq-large-operator .mq-from {\\n  float: right;\\n  /* take out of normal flow to manipulate baseline */\\n  width: 100%;\\n}\\n.mq-math-mode,\\n.mq-math-mode .mq-editable-field {\\n  cursor: text;\\n  font-family: Symbola, \\"Times New Roman\\", serif;\\n}\\n.mq-math-mode .mq-overarc {\\n  border-top: 1px solid black;\\n  -webkit-border-top-right-radius: 50% 0.3em;\\n  -moz-border-radius-topright: 50% 0.3em;\\n  border-top-right-radius: 50% 0.3em;\\n  -webkit-border-top-left-radius: 50% 0.3em;\\n  -moz-border-radius-topleft: 50% 0.3em;\\n  border-top-left-radius: 50% 0.3em;\\n  margin-top: 1px;\\n  padding-top: 0.15em;\\n}\\n.mq-math-mode .mq-overarrow {\\n  min-width: 0.5em;\\n  border-top: 1px solid black;\\n  margin-top: 1px;\\n  padding-top: 0.2em;\\n  text-align: center;\\n}\\n.mq-math-mode .mq-overarrow:before {\\n  display: block;\\n  position: relative;\\n  top: -0.34em;\\n  font-size: 0.5em;\\n  line-height: 0em;\\n  content: '\\\\27A4';\\n  text-align: right;\\n}\\n.mq-math-mode .mq-overarrow.mq-arrow-left:before {\\n  -moz-transform: scaleX(-1);\\n  -o-transform: scaleX(-1);\\n  -webkit-transform: scaleX(-1);\\n  transform: scaleX(-1);\\n  filter: FlipH;\\n  -ms-filter: \\"FlipH\\";\\n}\\n.mq-math-mode .mq-overarrow.mq-arrow-both {\\n  vertical-align: text-bottom;\\n}\\n.mq-math-mode .mq-overarrow.mq-arrow-both.mq-empty {\\n  min-height: 1.23em;\\n}\\n.mq-math-mode .mq-overarrow.mq-arrow-both.mq-empty:after {\\n  top: -0.34em;\\n}\\n.mq-math-mode .mq-overarrow.mq-arrow-both:before {\\n  -moz-transform: scaleX(-1);\\n  -o-transform: scaleX(-1);\\n  -webkit-transform: scaleX(-1);\\n  transform: scaleX(-1);\\n  filter: FlipH;\\n  -ms-filter: \\"FlipH\\";\\n}\\n.mq-math-mode .mq-overarrow.mq-arrow-both:after {\\n  display: block;\\n  position: relative;\\n  top: -2.3em;\\n  font-size: 0.5em;\\n  line-height: 0em;\\n  content: '\\\\27A4';\\n  visibility: visible;\\n  text-align: right;\\n}\\n.mq-math-mode .mq-selection,\\n.mq-editable-field .mq-selection,\\n.mq-math-mode .mq-selection .mq-non-leaf,\\n.mq-editable-field .mq-selection .mq-non-leaf,\\n.mq-math-mode .mq-selection .mq-scaled,\\n.mq-editable-field .mq-selection .mq-scaled {\\n  background: #B4D5FE !important;\\n  background: Highlight !important;\\n  color: HighlightText;\\n  border-color: HighlightText;\\n}\\n.mq-math-mode .mq-selection .mq-matrixed,\\n.mq-editable-field .mq-selection .mq-matrixed {\\n  background: #39F !important;\\n}\\n.mq-math-mode .mq-selection .mq-matrixed-container,\\n.mq-editable-field .mq-selection .mq-matrixed-container {\\n  filter: progid:DXImageTransform.Microsoft.Chroma(color='#3399FF') !important;\\n}\\n.mq-math-mode .mq-selection.mq-blur,\\n.mq-editable-field .mq-selection.mq-blur,\\n.mq-math-mode .mq-selection.mq-blur .mq-non-leaf,\\n.mq-editable-field .mq-selection.mq-blur .mq-non-leaf,\\n.mq-math-mode .mq-selection.mq-blur .mq-scaled,\\n.mq-editable-field .mq-selection.mq-blur .mq-scaled,\\n.mq-math-mode .mq-selection.mq-blur .mq-matrixed,\\n.mq-editable-field .mq-selection.mq-blur .mq-matrixed {\\n  background: #D4D4D4 !important;\\n  color: black;\\n  border-color: black;\\n}\\n.mq-math-mode .mq-selection.mq-blur .mq-matrixed-container,\\n.mq-editable-field .mq-selection.mq-blur .mq-matrixed-container {\\n  filter: progid:DXImageTransform.Microsoft.Chroma(color='#D4D4D4') !important;\\n}\\n.mq-editable-field .mq-textarea,\\n.mq-math-mode .mq-textarea {\\n  position: relative;\\n  -webkit-user-select: text;\\n  -moz-user-select: text;\\n  user-select: text;\\n}\\n.mq-editable-field .mq-textarea *,\\n.mq-math-mode .mq-textarea *,\\n.mq-editable-field .mq-selectable,\\n.mq-math-mode .mq-selectable {\\n  -webkit-user-select: text;\\n  -moz-user-select: text;\\n  user-select: text;\\n  position: absolute;\\n  clip: rect(1em 1em 1em 1em);\\n  -webkit-transform: scale(0);\\n  -moz-transform: scale(0);\\n  -ms-transform: scale(0);\\n  -o-transform: scale(0);\\n  transform: scale(0);\\n  resize: none;\\n  width: 1px;\\n  height: 1px;\\n  box-sizing: content-box;\\n}\\n.mq-math-mode .mq-matrixed {\\n  background: white;\\n  display: -moz-inline-box;\\n  display: inline-block;\\n}\\n.mq-math-mode .mq-matrixed-container {\\n  filter: progid:DXImageTransform.Microsoft.Chroma(color='white');\\n  margin-top: -0.1em;\\n}\\n", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


//# sourceURL=webpack://MathquillComponent/./node_modules/@edtr-io/mathquill/build/mathquill.css?`);
              }
            ),
            /***/
            "./node_modules/css-loader/dist/runtime/api.js": (
              /*!*****************************************************!*\
                !*** ./node_modules/css-loader/dist/runtime/api.js ***!
                \*****************************************************/
              /***/
              (module) => {
                eval(`

/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
module.exports = function (cssWithMappingToString) {
  var list = []; // return the list of modules as css string

  list.toString = function toString() {
    return this.map(function (item) {
      var content = "";
      var needLayer = typeof item[5] !== "undefined";

      if (item[4]) {
        content += "@supports (".concat(item[4], ") {");
      }

      if (item[2]) {
        content += "@media ".concat(item[2], " {");
      }

      if (needLayer) {
        content += "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {");
      }

      content += cssWithMappingToString(item);

      if (needLayer) {
        content += "}";
      }

      if (item[2]) {
        content += "}";
      }

      if (item[4]) {
        content += "}";
      }

      return content;
    }).join("");
  }; // import a list of modules into the list


  list.i = function i(modules, media, dedupe, supports, layer) {
    if (typeof modules === "string") {
      modules = [[null, modules, undefined]];
    }

    var alreadyImportedModules = {};

    if (dedupe) {
      for (var _i = 0; _i < this.length; _i++) {
        var id = this[_i][0];

        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }

    for (var _i2 = 0; _i2 < modules.length; _i2++) {
      var item = [].concat(modules[_i2]);

      if (dedupe && alreadyImportedModules[item[0]]) {
        continue;
      }

      if (typeof layer !== "undefined") {
        if (typeof item[5] === "undefined") {
          item[5] = layer;
        } else {
          item[1] = "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {").concat(item[1], "}");
          item[5] = layer;
        }
      }

      if (media) {
        if (!item[2]) {
          item[2] = media;
        } else {
          item[1] = "@media ".concat(item[2], " {").concat(item[1], "}");
          item[2] = media;
        }
      }

      if (supports) {
        if (!item[4]) {
          item[4] = "".concat(supports);
        } else {
          item[1] = "@supports (".concat(item[4], ") {").concat(item[1], "}");
          item[4] = supports;
        }
      }

      list.push(item);
    }
  };

  return list;
};

//# sourceURL=webpack://MathquillComponent/./node_modules/css-loader/dist/runtime/api.js?`);
              }
            ),
            /***/
            "./node_modules/css-loader/dist/runtime/noSourceMaps.js": (
              /*!**************************************************************!*\
                !*** ./node_modules/css-loader/dist/runtime/noSourceMaps.js ***!
                \**************************************************************/
              /***/
              (module) => {
                eval(`

module.exports = function (i) {
  return i[1];
};

//# sourceURL=webpack://MathquillComponent/./node_modules/css-loader/dist/runtime/noSourceMaps.js?`);
              }
            ),
            /***/
            "./node_modules/@edtr-io/mathquill/build/mathquill.js": (
              /*!************************************************************!*\
                !*** ./node_modules/@edtr-io/mathquill/build/mathquill.js ***!
                \************************************************************/
              /***/
              (module, __unused_webpack_exports, __webpack_require__) => {
                eval(`/*** IMPORTS FROM imports-loader ***/
var __webpack_jquery = __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js");

window.jQuery=__webpack_jquery;

/**
 * MathQuill v0.11.0, by Han, Jeanine, and Mary
 * http://mathquill.com | maintainers@mathquill.com
 *
 * This Source Code Form is subject to the terms of the
 * Mozilla Public License, v. 2.0. If a copy of the MPL
 * was not distributed with this file, You can obtain
 * one at http://mozilla.org/MPL/2.0/.
 */

(function() {

var jQuery = window.jQuery,
  undefined,
  mqCmdId = 'mathquill-command-id',
  mqBlockId = 'mathquill-block-id',
  min = Math.min,
  max = Math.max;

if (!jQuery) throw 'MathQuill requires jQuery 1.5.2+ to be loaded first';

function noop() {}

/**
 * A utility higher-order function that makes defining variadic
 * functions more convenient by letting you essentially define functions
 * with the last argument as a splat, i.e. the last argument "gathers up"
 * remaining arguments to the function:
 *   var doStuff = variadic(function(first, rest) { return rest; });
 *   doStuff(1, 2, 3); // => [2, 3]
 */
var __slice = [].slice;
function variadic(fn) {
  var numFixedArgs = fn.length - 1;
  return function() {
    var args = __slice.call(arguments, 0, numFixedArgs);
    var varArg = __slice.call(arguments, numFixedArgs);
    return fn.apply(this, args.concat([ varArg ]));
  };
}

/**
 * A utility higher-order function that makes combining object-oriented
 * programming and functional programming techniques more convenient:
 * given a method name and any number of arguments to be bound, returns
 * a function that calls it's first argument's method of that name (if
 * it exists) with the bound arguments and any additional arguments that
 * are passed:
 *   var sendMethod = send('method', 1, 2);
 *   var obj = { method: function() { return Array.apply(this, arguments); } };
 *   sendMethod(obj, 3, 4); // => [1, 2, 3, 4]
 *   // or more specifically,
 *   var obj2 = { method: function(one, two, three) { return one*two + three; } };
 *   sendMethod(obj2, 3); // => 5
 *   sendMethod(obj2, 4); // => 6
 */
var send = variadic(function(method, args) {
  return variadic(function(obj, moreArgs) {
    if (method in obj) return obj[method].apply(obj, args.concat(moreArgs));
  });
});

/**
 * A utility higher-order function that creates "implicit iterators"
 * from "generators": given a function that takes in a sole argument,
 * a "yield_" function, that calls "yield_" repeatedly with an object as
 * a sole argument (presumably objects being iterated over), returns
 * a function that calls it's first argument on each of those objects
 * (if the first argument is a function, it is called repeatedly with
 * each object as the first argument, otherwise it is stringified and
 * the method of that name is called on each object (if such a method
 * exists)), passing along all additional arguments:
 *   var a = [
 *     { method: function(list) { list.push(1); } },
 *     { method: function(list) { list.push(2); } },
 *     { method: function(list) { list.push(3); } }
 *   ];
 *   a.each = iterator(function(yield_) {
 *     for (var i in this) yield_(this[i]);
 *   });
 *   var list = [];
 *   a.each('method', list);
 *   list; // => [1, 2, 3]
 *   // Note that the for-in loop will yield 'each', but 'each' maps to
 *   // the function object created by iterator() which does not have a
 *   // .method() method, so that just fails silently.
 */
function iterator(generator) {
  return variadic(function(fn, args) {
    if (typeof fn !== 'function') fn = send(fn);
    var yield_ = function(obj) { return fn.apply(obj, [ obj ].concat(args)); };
    return generator.call(this, yield_);
  });
}

/**
 * sugar to make defining lots of commands easier.
 * TODO: rethink this.
 */
function bind(cons /*, args... */) {
  var args = __slice.call(arguments, 1);
  return function() {
    return cons.apply(this, args);
  };
}

/**
 * a development-only debug method.  This definition and all
 * calls to \`pray\` will be stripped from the minified
 * build of mathquill.
 *
 * This function must be called by name to be removed
 * at compile time.  Do not define another function
 * with the same name, and only call this function by
 * name.
 */
function pray(message, cond) {
  if (!cond) throw new Error('prayer failed: '+message);
}
var P = (function(prototype, ownProperty, undefined) {
  // helper functions that also help minification
  function isObject(o) { return typeof o === 'object'; }
  function isFunction(f) { return typeof f === 'function'; }

  // used to extend the prototypes of superclasses (which might not
  // have \`.Bare\`s)
  function SuperclassBare() {}

  return function P(_superclass /* = Object */, definition) {
    // handle the case where no superclass is given
    if (definition === undefined) {
      definition = _superclass;
      _superclass = Object;
    }

    // C is the class to be returned.
    //
    // It delegates to instantiating an instance of \`Bare\`, so that it
    // will always return a new instance regardless of the calling
    // context.
    //
    //  TODO: the Chrome inspector shows all created objects as \`C\`
    //        rather than \`Object\`.  Setting the .name property seems to
    //        have no effect.  Is there a way to override this behavior?
    function C() {
      var self = new Bare;
      if (isFunction(self.init)) self.init.apply(self, arguments);
      return self;
    }

    // C.Bare is a class with a noop constructor.  Its prototype is the
    // same as C, so that instances of C.Bare are also instances of C.
    // New objects can be allocated without initialization by calling
    // \`new MyClass.Bare\`.
    function Bare() {}
    C.Bare = Bare;

    // Set up the prototype of the new class.
    var _super = SuperclassBare[prototype] = _superclass[prototype];
    var proto = Bare[prototype] = C[prototype] = C.p = new SuperclassBare;

    // other variables, as a minifier optimization
    var extensions;


    // set the constructor property on the prototype, for convenience
    proto.constructor = C;

    C.extend = function(def) { return P(C, def); }

    return (C.open = function(def) {
      extensions = {};

      if (isFunction(def)) {
        // call the defining function with all the arguments you need
        // extensions captures the return value.
        extensions = def.call(C, proto, _super, C, _superclass);
      }
      else if (isObject(def)) {
        // if you passed an object instead, we'll take it
        extensions = def;
      }

      // ...and extend it
      if (isObject(extensions)) {
        for (var ext in extensions) {
          if (ownProperty.call(extensions, ext)) {
            proto[ext] = extensions[ext];
          }
        }
      }

      // if there's no init, we assume we're inheriting a non-pjs class, so
      // we default to applying the superclass's constructor.
      if (!isFunction(proto.init)) {
        proto.init = _superclass;
      }

      return C;
    })(definition);
  }

  // as a minifier optimization, we've closured in a few helper functions
  // and the string 'prototype' (C[p] is much shorter than C.prototype)
})('prototype', ({}).hasOwnProperty);
/*************************************************
 * Base classes of edit tree-related objects
 *
 * Only doing tree node manipulation via these
 * adopt/ disown methods guarantees well-formedness
 * of the tree.
 ************************************************/

// L = 'left'
// R = 'right'
//
// the contract is that they can be used as object properties
// and (-L) === R, and (-R) === L.
var L = -1;
var R = 1;

function prayDirection(dir) {
  pray('a direction was passed', dir === L || dir === R);
}

/**
 * Tiny extension of jQuery adding directionalized DOM manipulation methods.
 *
 * Funny how Pjs v3 almost just works with \`jQuery.fn.init\`.
 *
 * jQuery features that don't work on $:
 *   - jQuery.*, like jQuery.ajax, obviously (Pjs doesn't and shouldn't
 *                                            copy constructor properties)
 *
 *   - jQuery(function), the shortcut for \`jQuery(document).ready(function)\`,
 *     because \`jQuery.fn.init\` is idiosyncratic and Pjs doing, essentially,
 *     \`jQuery.fn.init.apply(this, arguments)\` isn't quite right, you need:
 *
 *       _.init = function(s, c) { jQuery.fn.init.call(this, s, c, $(document)); };
 *
 *     if you actually give a shit (really, don't bother),
 *     see https://github.com/jquery/jquery/blob/1.7.2/src/core.js#L889
 *
 *   - jQuery(selector), because jQuery translates that to
 *     \`jQuery(document).find(selector)\`, but Pjs doesn't (should it?) let
 *     you override the result of a constructor call
 *       + note that because of the jQuery(document) shortcut-ness, there's also
 *         the 3rd-argument-needs-to-be-\`$(document)\` thing above, but the fix
 *         for that (as can be seen above) is really easy. This problem requires
 *         a way more intrusive fix
 *
 * And that's it! Everything else just magically works because jQuery internally
 * uses \`this.constructor()\` everywhere (hence calling \`$\`), but never ever does
 * \`this.constructor.find\` or anything like that, always doing \`jQuery.find\`.
 */
var $ = P(jQuery, function(_) {
  _.insDirOf = function(dir, el) {
    return dir === L ?
      this.insertBefore(el.first()) : this.insertAfter(el.last());
  };
  _.insAtDirEnd = function(dir, el) {
    return dir === L ? this.prependTo(el) : this.appendTo(el);
  };
});

var Point = P(function(_) {
  _.parent = 0;
  _[L] = 0;
  _[R] = 0;

  _.init = function(parent, leftward, rightward) {
    this.parent = parent;
    this[L] = leftward;
    this[R] = rightward;
  };

  this.copy = function(pt) {
    return Point(pt.parent, pt[L], pt[R]);
  };
});

/**
 * MathQuill virtual-DOM tree-node abstract base class
 */
var Node = P(function(_) {
  _[L] = 0;
  _[R] = 0
  _.parent = 0;

  var id = 0;
  function uniqueNodeId() { return id += 1; }
  this.byId = {};

  _.init = function() {
    this.id = uniqueNodeId();
    Node.byId[this.id] = this;

    this.ends = {};
    this.ends[L] = 0;
    this.ends[R] = 0;
  };

  _.dispose = function() { delete Node.byId[this.id]; };

  _.toString = function() { return '{{ MathQuill Node #'+this.id+' }}'; };

  _.jQ = $();
  _.jQadd = function(jQ) { return this.jQ = this.jQ.add(jQ); };
  _.jQize = function(jQ) {
    // jQuery-ifies this.html() and links up the .jQ of all corresponding Nodes
    var jQ = $(jQ || this.html());

    function jQadd(el) {
      if (el.getAttribute) {
        var cmdId = el.getAttribute('mathquill-command-id');
        var blockId = el.getAttribute('mathquill-block-id');
        if (cmdId) Node.byId[cmdId].jQadd(el);
        if (blockId) Node.byId[blockId].jQadd(el);
      }
      for (el = el.firstChild; el; el = el.nextSibling) {
        jQadd(el);
      }
    }

    for (var i = 0; i < jQ.length; i += 1) jQadd(jQ[i]);
    return jQ;
  };

  _.createDir = function(dir, cursor) {
    prayDirection(dir);
    var node = this;
    node.jQize();
    node.jQ.insDirOf(dir, cursor.jQ);
    cursor[dir] = node.adopt(cursor.parent, cursor[L], cursor[R]);
    return node;
  };
  _.createLeftOf = function(el) { return this.createDir(L, el); };

  _.selectChildren = function(leftEnd, rightEnd) {
    return Selection(leftEnd, rightEnd);
  };

  _.bubble = iterator(function(yield_) {
    for (var ancestor = this; ancestor; ancestor = ancestor.parent) {
      var result = yield_(ancestor);
      if (result === false) break;
    }

    return this;
  });

  _.postOrder = iterator(function(yield_) {
    (function recurse(descendant) {
      descendant.eachChild(recurse);
      yield_(descendant);
    })(this);

    return this;
  });

  _.isEmpty = function() {
    return this.ends[L] === 0 && this.ends[R] === 0;
  };
  
  _.isStyleBlock = function() {
    return false;
  };

  _.children = function() {
    return Fragment(this.ends[L], this.ends[R]);
  };

  _.eachChild = function() {
    var children = this.children();
    children.each.apply(children, arguments);
    return this;
  };

  _.foldChildren = function(fold, fn) {
    return this.children().fold(fold, fn);
  };

  _.withDirAdopt = function(dir, parent, withDir, oppDir) {
    Fragment(this, this).withDirAdopt(dir, parent, withDir, oppDir);
    return this;
  };

  _.adopt = function(parent, leftward, rightward) {
    Fragment(this, this).adopt(parent, leftward, rightward);
    return this;
  };

  _.disown = function() {
    Fragment(this, this).disown();
    return this;
  };

  _.remove = function() {
    this.jQ.remove();
    this.postOrder('dispose');
    return this.disown();
  };
});

function prayWellFormed(parent, leftward, rightward) {
  pray('a parent is always present', parent);
  pray('leftward is properly set up', (function() {
    // either it's empty and \`rightward\` is the left end child (possibly empty)
    if (!leftward) return parent.ends[L] === rightward;

    // or it's there and its [R] and .parent are properly set up
    return leftward[R] === rightward && leftward.parent === parent;
  })());

  pray('rightward is properly set up', (function() {
    // either it's empty and \`leftward\` is the right end child (possibly empty)
    if (!rightward) return parent.ends[R] === leftward;

    // or it's there and its [L] and .parent are properly set up
    return rightward[L] === leftward && rightward.parent === parent;
  })());
}


/**
 * An entity outside the virtual tree with one-way pointers (so it's only a
 * "view" of part of the tree, not an actual node/entity in the tree) that
 * delimits a doubly-linked list of sibling nodes.
 * It's like a fanfic love-child between HTML DOM DocumentFragment and the Range
 * classes: like DocumentFragment, its contents must be sibling nodes
 * (unlike Range, whose contents are arbitrary contiguous pieces of subtrees),
 * but like Range, it has only one-way pointers to its contents, its contents
 * have no reference to it and in fact may still be in the visible tree (unlike
 * DocumentFragment, whose contents must be detached from the visible tree
 * and have their 'parent' pointers set to the DocumentFragment).
 */
var Fragment = P(function(_) {
  _.init = function(withDir, oppDir, dir) {
    if (dir === undefined) dir = L;
    prayDirection(dir);

    pray('no half-empty fragments', !withDir === !oppDir);

    this.ends = {};

    if (!withDir) return;

    pray('withDir is passed to Fragment', withDir instanceof Node);
    pray('oppDir is passed to Fragment', oppDir instanceof Node);
    pray('withDir and oppDir have the same parent',
         withDir.parent === oppDir.parent);

    this.ends[dir] = withDir;
    this.ends[-dir] = oppDir;

    // To build the jquery collection for a fragment, accumulate elements
    // into an array and then call jQ.add once on the result. jQ.add sorts the
    // collection according to document order each time it is called, so
    // building a collection by folding jQ.add directly takes more than
    // quadratic time in the number of elements.
    //
    // https://github.com/jquery/jquery/blob/2.1.4/src/traversing.js#L112
    var accum = this.fold([], function (accum, el) {
      accum.push.apply(accum, el.jQ.get());
      return accum;
    });

    this.jQ = this.jQ.add(accum);
  };
  _.jQ = $();

  // like Cursor::withDirInsertAt(dir, parent, withDir, oppDir)
  _.withDirAdopt = function(dir, parent, withDir, oppDir) {
    return (dir === L ? this.adopt(parent, withDir, oppDir)
                      : this.adopt(parent, oppDir, withDir));
  };
  _.adopt = function(parent, leftward, rightward) {
    prayWellFormed(parent, leftward, rightward);

    var self = this;
    self.disowned = false;

    var leftEnd = self.ends[L];
    if (!leftEnd) return this;

    var rightEnd = self.ends[R];

    if (leftward) {
      // NB: this is handled in the ::each() block
      // leftward[R] = leftEnd
    } else {
      parent.ends[L] = leftEnd;
    }

    if (rightward) {
      rightward[L] = rightEnd;
    } else {
      parent.ends[R] = rightEnd;
    }

    self.ends[R][R] = rightward;

    self.each(function(el) {
      el[L] = leftward;
      el.parent = parent;
      if (leftward) leftward[R] = el;

      leftward = el;
    });

    return self;
  };

  _.disown = function() {
    var self = this;
    var leftEnd = self.ends[L];

    // guard for empty and already-disowned fragments
    if (!leftEnd || self.disowned) return self;

    self.disowned = true;

    var rightEnd = self.ends[R]
    var parent = leftEnd.parent;

    prayWellFormed(parent, leftEnd[L], leftEnd);
    prayWellFormed(parent, rightEnd, rightEnd[R]);

    if (leftEnd[L]) {
      leftEnd[L][R] = rightEnd[R];
    } else {
      parent.ends[L] = rightEnd[R];
    }

    if (rightEnd[R]) {
      rightEnd[R][L] = leftEnd[L];
    } else {
      parent.ends[R] = leftEnd[L];
    }

    return self;
  };

  _.remove = function() {
    this.jQ.remove();
    this.each('postOrder', 'dispose');
    return this.disown();
  };

  _.each = iterator(function(yield_) {
    var self = this;
    var el = self.ends[L];
    if (!el) return self;

    for (; el !== self.ends[R][R]; el = el[R]) {
      var result = yield_(el);
      if (result === false) break;
    }

    return self;
  });

  _.fold = function(fold, fn) {
    this.each(function(el) {
      fold = fn.call(this, fold, el);
    });

    return fold;
  };
});


/**
 * Registry of LaTeX commands and commands created when typing
 * a single character.
 *
 * (Commands are all subclasses of Node.)
 */
var LatexCmds = {}, CharCmds = {};
/********************************************
 * Cursor and Selection "singleton" classes
 *******************************************/

/* The main thing that manipulates the Math DOM. Makes sure to manipulate the
HTML DOM to match. */

/* Sort of singletons, since there should only be one per editable math
textbox, but any one HTML document can contain many such textboxes, so any one
JS environment could actually contain many instances. */

//A fake cursor in the fake textbox that the math is rendered in.
var Cursor = P(Point, function(_) {
  _.init = function(initParent, options) {
    this.parent = initParent;
    this.options = options;

    var jQ = this.jQ = this._jQ = $('<span class="mq-cursor">&#8203;</span>');
    //closured for setInterval
    this.blink = function(){ jQ.toggleClass('mq-blink'); };

    this.upDownCache = {};
  };

  _.show = function() {
    this.jQ = this._jQ.removeClass('mq-blink');
    if ('intervalId' in this) //already was shown, just restart interval
      clearInterval(this.intervalId);
    else { //was hidden and detached, insert this.jQ back into HTML DOM
      if (this[R]) {
        if (this.selection && this.selection.ends[L][L] === this[L])
          this.jQ.insertBefore(this.selection.jQ);
        else
          this.jQ.insertBefore(this[R].jQ.first());
      }
      else
        this.jQ.appendTo(this.parent.jQ);
      this.parent.focus();
    }
    this.intervalId = setInterval(this.blink, 500);
    return this;
  };
  _.hide = function() {
    if ('intervalId' in this)
      clearInterval(this.intervalId);
    delete this.intervalId;
    this.jQ.detach();
    this.jQ = $();
    return this;
  };

  _.withDirInsertAt = function(dir, parent, withDir, oppDir) {
    var oldParent = this.parent;
    this.parent = parent;
    this[dir] = withDir;
    this[-dir] = oppDir;
    // by contract, .blur() is called after all has been said and done
    // and the cursor has actually been moved
    // FIXME pass cursor to .blur() so text can fix cursor pointers when removing itself
    if (oldParent !== parent && oldParent.blur) oldParent.blur(this);
  };
  _.insDirOf = function(dir, el) {
    prayDirection(dir);
    this.jQ.insDirOf(dir, el.jQ);
    this.withDirInsertAt(dir, el.parent, el[dir], el);
    this.parent.jQ.addClass('mq-hasCursor');
    return this;
  };
  _.insLeftOf = function(el) { return this.insDirOf(L, el); };
  _.insRightOf = function(el) { return this.insDirOf(R, el); };

  _.insAtDirEnd = function(dir, el) {
    prayDirection(dir);
    this.jQ.insAtDirEnd(dir, el.jQ);
    this.withDirInsertAt(dir, el, 0, el.ends[dir]);
    el.focus();
    return this;
  };
  _.insAtLeftEnd = function(el) { return this.insAtDirEnd(L, el); };
  _.insAtRightEnd = function(el) { return this.insAtDirEnd(R, el); };

  /**
   * jump up or down from one block Node to another:
   * - cache the current Point in the node we're jumping from
   * - check if there's a Point in it cached for the node we're jumping to
   *   + if so put the cursor there,
   *   + if not seek a position in the node that is horizontally closest to
   *     the cursor's current position
   */
  _.jumpUpDown = function(from, to) {
    var self = this;
    self.upDownCache[from.id] = Point.copy(self);
    var cached = self.upDownCache[to.id];
    if (cached) {
      cached[R] ? self.insLeftOf(cached[R]) : self.insAtRightEnd(cached.parent);
    }
    else {
      var pageX = self.offset().left;
      to.seek(pageX, self);
    }
  };
  _.offset = function() {
    //in Opera 11.62, .getBoundingClientRect() and hence jQuery::offset()
    //returns all 0's on inline elements with negative margin-right (like
    //the cursor) at the end of their parent, so temporarily remove the
    //negative margin-right when calling jQuery::offset()
    //Opera bug DSK-360043
    //http://bugs.jquery.com/ticket/11523
    //https://github.com/jquery/jquery/pull/717
    var self = this, offset = self.jQ.removeClass('mq-cursor').offset();
    self.jQ.addClass('mq-cursor');
    return offset;
  }
  _.unwrapGramp = function() {
    var gramp = this.parent.parent;
    var greatgramp = gramp.parent;
    var rightward = gramp[R];
    var cursor = this;

    var leftward = gramp[L];
    gramp.disown().eachChild(function(uncle) {
      if (uncle.isEmpty()) return;

      uncle.children()
        .adopt(greatgramp, leftward, rightward)
        .each(function(cousin) {
          cousin.jQ.insertBefore(gramp.jQ.first());
        })
      ;

      leftward = uncle.ends[R];
    });

    if (!this[R]) { //then find something to be rightward to insLeftOf
      if (this[L])
        this[R] = this[L][R];
      else {
        while (!this[R]) {
          this.parent = this.parent[R];
          if (this.parent)
            this[R] = this.parent.ends[L];
          else {
            this[R] = gramp[R];
            this.parent = greatgramp;
            break;
          }
        }
      }
    }
    if (this[R])
      this.insLeftOf(this[R]);
    else
      this.insAtRightEnd(greatgramp);

    gramp.jQ.remove();

    if (gramp[L].siblingDeleted) gramp[L].siblingDeleted(cursor.options, R);
    if (gramp[R].siblingDeleted) gramp[R].siblingDeleted(cursor.options, L);
  };
  _.startSelection = function() {
    var anticursor = this.anticursor = Point.copy(this);
    var ancestors = anticursor.ancestors = {}; // a map from each ancestor of
      // the anticursor, to its child that is also an ancestor; in other words,
      // the anticursor's ancestor chain in reverse order
    for (var ancestor = anticursor; ancestor.parent; ancestor = ancestor.parent) {
      ancestors[ancestor.parent.id] = ancestor;
    }
  };
  _.endSelection = function() {
    delete this.anticursor;
  };
  _.select = function() {
    var anticursor = this.anticursor;
    if (this[L] === anticursor[L] && this.parent === anticursor.parent) return false;

    // Find the lowest common ancestor (\`lca\`), and the ancestor of the cursor
    // whose parent is the LCA (which'll be an end of the selection fragment).
    for (var ancestor = this; ancestor.parent; ancestor = ancestor.parent) {
      if (ancestor.parent.id in anticursor.ancestors) {
        var lca = ancestor.parent;
        break;
      }
    }
    pray('cursor and anticursor in the same tree', lca);
    // The cursor and the anticursor should be in the same tree, because the
    // mousemove handler attached to the document, unlike the one attached to
    // the root HTML DOM element, doesn't try to get the math tree node of the
    // mousemove target, and Cursor::seek() based solely on coordinates stays
    // within the tree of \`this\` cursor's root.

    // The other end of the selection fragment, the ancestor of the anticursor
    // whose parent is the LCA.
    var antiAncestor = anticursor.ancestors[lca.id];

    // Now we have two either Nodes or Points, guaranteed to have a common
    // parent and guaranteed that if both are Points, they are not the same,
    // and we have to figure out which is the left end and which the right end
    // of the selection.
    var leftEnd, rightEnd, dir = R;

    // This is an extremely subtle algorithm.
    // As a special case, \`ancestor\` could be a Point and \`antiAncestor\` a Node
    // immediately to \`ancestor\`'s left.
    // In all other cases,
    // - both Nodes
    // - \`ancestor\` a Point and \`antiAncestor\` a Node
    // - \`ancestor\` a Node and \`antiAncestor\` a Point
    // \`antiAncestor[R] === rightward[R]\` for some \`rightward\` that is
    // \`ancestor\` or to its right, if and only if \`antiAncestor\` is to
    // the right of \`ancestor\`.
    if (ancestor[L] !== antiAncestor) {
      for (var rightward = ancestor; rightward; rightward = rightward[R]) {
        if (rightward[R] === antiAncestor[R]) {
          dir = L;
          leftEnd = ancestor;
          rightEnd = antiAncestor;
          break;
        }
      }
    }
    if (dir === R) {
      leftEnd = antiAncestor;
      rightEnd = ancestor;
    }

    // only want to select Nodes up to Points, can't select Points themselves
    if (leftEnd instanceof Point) leftEnd = leftEnd[R];
    if (rightEnd instanceof Point) rightEnd = rightEnd[L];

    this.hide().selection = lca.selectChildren(leftEnd, rightEnd);
    this.insDirOf(dir, this.selection.ends[dir]);
    this.selectionChanged();
    return true;
  };

  _.clearSelection = function() {
    if (this.selection) {
      this.selection.clear();
      delete this.selection;
      this.selectionChanged();
    }
    return this;
  };
  _.deleteSelection = function() {
    if (!this.selection) return;

    this[L] = this.selection.ends[L][L];
    this[R] = this.selection.ends[R][R];
    this.selection.remove();
    this.selectionChanged();
    delete this.selection;
  };
  _.replaceSelection = function() {
    var seln = this.selection;
    if (seln) {
      this[L] = seln.ends[L][L];
      this[R] = seln.ends[R][R];
      delete this.selection;
    }
    return seln;
  };
  _.depth = function() {
    var node = this;
    var depth = 0;
    while (node = node.parent) {
      depth += (node instanceof MathBlock) ? 1 : 0;
    }
    return depth;
  };
  _.isTooDeep = function(offset) {
    if (this.options.maxDepth !== undefined) {
      return this.depth() + (offset || 0) > this.options.maxDepth;
    }
  };
});

var Selection = P(Fragment, function(_, super_) {
  _.init = function() {
    super_.init.apply(this, arguments);
    this.jQ = this.jQ.wrapAll('<span class="mq-selection"></span>').parent();
      //can't do wrapAll(this.jQ = $(...)) because wrapAll will clone it
  };
  _.adopt = function() {
    this.jQ.replaceWith(this.jQ = this.jQ.children());
    return super_.adopt.apply(this, arguments);
  };
  _.clear = function() {
    // using the browser's native .childNodes property so that we
    // don't discard text nodes.
    this.jQ.replaceWith(this.jQ[0].childNodes);
    return this;
  };
  _.join = function(methodName) {
    return this.fold('', function(fold, child) {
      return fold + child[methodName]();
    });
  };
});
/*********************************************
 * Controller for a MathQuill instance,
 * on which services are registered with
 *
 *   Controller.open(function(_) { ... });
 *
 ********************************************/

var Controller = P(function(_) {
  _.init = function(root, container, options) {
    this.id = root.id;
    this.data = {};

    this.root = root;
    this.container = container;
    this.options = options;

    root.controller = this;

    this.cursor = root.cursor = Cursor(root, options);
    // TODO: stop depending on root.cursor, and rm it
  };

  _.handle = function(name, dir) {
    var handlers = this.options.handlers;
    if (handlers && handlers.fns[name]) {
      var mq = handlers.APIClasses[this.KIND_OF_MQ](this);
      if (dir === L || dir === R) handlers.fns[name](dir, mq);
      else handlers.fns[name](mq);
    }
  };

  var notifyees = [];
  this.onNotify = function(f) { notifyees.push(f); };
  _.notify = function() {
    for (var i = 0; i < notifyees.length; i += 1) {
      notifyees[i].apply(this.cursor, arguments);
    }
    return this;
  };
});
/*********************************************************
 * The publicly exposed MathQuill API.
 ********************************************************/

var API = {}, Options = P(), optionProcessors = {}, Progenote = P(), EMBEDS = {};

/**
 * Interface Versioning (#459, #495) to allow us to virtually guarantee
 * backcompat. v0.10.x introduces it, so for now, don't completely break the
 * API for people who don't know about it, just complain with console.warn().
 *
 * The methods are shimmed in outro.js so that MQ.MathField.prototype etc can
 * be accessed.
 */
function insistOnInterVer() {
  if (window.console) console.warn(
    'You are using the MathQuill API without specifying an interface version, ' +
    'which will fail in v1.0.0. Easiest fix is to do the following before ' +
    'doing anything else:\\n' +
    '\\n' +
    '    MathQuill = MathQuill.getInterface(1);\\n' +
    '    // now MathQuill.MathField() works like it used to\\n' +
    '\\n' +
    'See also the "\`dev\` branch (2014\\u20132015) \\u2192 v0.10.0 Migration Guide" at\\n' +
    '  https://github.com/mathquill/mathquill/wiki/%60dev%60-branch-(2014%E2%80%932015)-%E2%86%92-v0.10.0-Migration-Guide'
  );
}
// globally exported API object
function MathQuill(el) {
  insistOnInterVer();
  return MQ1(el);
};
MathQuill.prototype = Progenote.p;
MathQuill.VERSION = "v0.11.0";
MathQuill.interfaceVersion = function(v) {
  // shim for #459-era interface versioning (ended with #495)
  if (v !== 1) throw 'Only interface version 1 supported. You specified: ' + v;
  insistOnInterVer = function() {
    if (window.console) console.warn(
      'You called MathQuill.interfaceVersion(1); to specify the interface ' +
      'version, which will fail in v1.0.0. You can fix this easily by doing ' +
      'this before doing anything else:\\n' +
      '\\n' +
      '    MathQuill = MathQuill.getInterface(1);\\n' +
      '    // now MathQuill.MathField() works like it used to\\n' +
      '\\n' +
      'See also the "\`dev\` branch (2014\\u20132015) \\u2192 v0.10.0 Migration Guide" at\\n' +
      '  https://github.com/mathquill/mathquill/wiki/%60dev%60-branch-(2014%E2%80%932015)-%E2%86%92-v0.10.0-Migration-Guide'
    );
  };
  insistOnInterVer();
  return MathQuill;
};
MathQuill.getInterface = getInterface;

var MIN = getInterface.MIN = 1, MAX = getInterface.MAX = 2;
function getInterface(v) {
  if (!(MIN <= v && v <= MAX)) throw 'Only interface versions between ' +
    MIN + ' and ' + MAX + ' supported. You specified: ' + v;

  /**
   * Function that takes an HTML element and, if it's the root HTML element of a
   * static math or math or text field, returns an API object for it (else, null).
   *
   *   var mathfield = MQ.MathField(mathFieldSpan);
   *   assert(MQ(mathFieldSpan).id === mathfield.id);
   *   assert(MQ(mathFieldSpan).id === MQ(mathFieldSpan).id);
   *
   */
  function MQ(el) {
    if (!el || !el.nodeType) return null; // check that \`el\` is a HTML element, using the
      // same technique as jQuery: https://github.com/jquery/jquery/blob/679536ee4b7a92ae64a5f58d90e9cc38c001e807/src/core/init.js#L92
    var blockId = $(el).children('.mq-root-block').attr(mqBlockId);
    var ctrlr = blockId && Node.byId[blockId].controller;
    return ctrlr ? APIClasses[ctrlr.KIND_OF_MQ](ctrlr) : null;
  };
  var APIClasses = {};

  MQ.L = L;
  MQ.R = R;
  MQ.saneKeyboardEvents = saneKeyboardEvents;

  function config(currentOptions, newOptions) {
    if (newOptions && newOptions.handlers) {
      newOptions.handlers = { fns: newOptions.handlers, APIClasses: APIClasses };
    }
    for (var name in newOptions) if (newOptions.hasOwnProperty(name)) {
      var value = newOptions[name], processor = optionProcessors[name];
      currentOptions[name] = (processor ? processor(value) : value);
    }
  }
  MQ.config = function(opts) { config(Options.p, opts); return this; };
  MQ.registerEmbed = function(name, options) {
    if (!/^[a-z][a-z0-9]*$/i.test(name)) {
      throw 'Embed name must start with letter and be only letters and digits';
    }
    EMBEDS[name] = options;
  };

  var AbstractMathQuill = APIClasses.AbstractMathQuill = P(Progenote, function(_) {
    _.init = function(ctrlr) {
      this.__controller = ctrlr;
      this.__options = ctrlr.options;
      this.id = ctrlr.id;
      this.data = ctrlr.data;
    };
    _.__mathquillify = function(classNames) {
      var ctrlr = this.__controller, root = ctrlr.root, el = ctrlr.container;
      ctrlr.createTextarea();

      var contents = el.addClass(classNames).contents().detach();
      root.jQ =
        $('<span class="mq-root-block"/>').attr(mqBlockId, root.id).appendTo(el);
      this.latex(contents.text());

      this.revert = function() {
        return el.empty().unbind('.mathquill')
        .removeClass('mq-editable-field mq-math-mode mq-text-mode')
        .append(contents);
      };
    };
    _.config = function(opts) { config(this.__options, opts); return this; };
    _.el = function() { return this.__controller.container[0]; };
    _.text = function() { return this.__controller.exportText(); };
    _.latex = function(latex) {
      if (arguments.length > 0) {
        this.__controller.renderLatexMath(latex);
        if (this.__controller.blurred) this.__controller.cursor.hide().parent.blur();
        return this;
      }
      return this.__controller.exportLatex();
    };
    _.html = function() {
      return this.__controller.root.jQ.html()
        .replace(/ mathquill-(?:command|block)-id="?\\d+"?/g, '')
        .replace(/<span class="?mq-cursor( mq-blink)?"?>.?<\\/span>/i, '')
        .replace(/ mq-hasCursor|mq-hasCursor ?/, '')
        .replace(/ class=(""|(?= |>))/g, '');
    };
    _.reflow = function() {
      this.__controller.root.postOrder('reflow');
      return this;
    };
  });
  MQ.prototype = AbstractMathQuill.prototype;

  APIClasses.EditableField = P(AbstractMathQuill, function(_, super_) {
    _.__mathquillify = function() {
      super_.__mathquillify.apply(this, arguments);
      this.__controller.editable = true;
      this.__controller.delegateMouseEvents();
      this.__controller.editablesTextareaEvents();
      return this;
    };
    _.focus = function() { this.__controller.textarea.focus(); return this; };
    _.blur = function() { this.__controller.textarea.blur(); return this; };
    _.write = function(latex) {
      this.__controller.writeLatex(latex);
      this.__controller.scrollHoriz();
      if (this.__controller.blurred) this.__controller.cursor.hide().parent.blur();
      return this;
    };
    _.empty = function() {
      var root = this.__controller.root, cursor = this.__controller.cursor;
      root.eachChild('postOrder', 'dispose');
      root.ends[L] = root.ends[R] = 0;
      root.jQ.empty();
      delete cursor.selection;
      cursor.insAtRightEnd(root);
      return this;
    };
    _.cmd = function(cmd) {
      var ctrlr = this.__controller.notify(), cursor = ctrlr.cursor;
      if (/^\\\\[a-z]+$/i.test(cmd) && !cursor.isTooDeep()) {
        cmd = cmd.slice(1);
        var klass = LatexCmds[cmd];
        if (klass) {
          cmd = klass(cmd);
          if (cursor.selection) cmd.replaces(cursor.replaceSelection());
          cmd.createLeftOf(cursor.show());
          this.__controller.scrollHoriz();
        }
        else /* TODO: API needs better error reporting */;
      }
      else cursor.parent.write(cursor, cmd);
      if (ctrlr.blurred) cursor.hide().parent.blur();
      return this;
    };
    _.select = function() {
      var ctrlr = this.__controller;
      ctrlr.notify('move').cursor.insAtRightEnd(ctrlr.root);
      while (ctrlr.cursor[L]) ctrlr.selectLeft();
      return this;
    };
    _.clearSelection = function() {
      this.__controller.cursor.clearSelection();
      return this;
    };

    _.moveToDirEnd = function(dir) {
      this.__controller.notify('move').cursor.insAtDirEnd(dir, this.__controller.root);
      return this;
    };
    _.moveToLeftEnd = function() { return this.moveToDirEnd(L); };
    _.moveToRightEnd = function() { return this.moveToDirEnd(R); };

    _.keystroke = function(keys) {
      var keys = keys.replace(/^\\s+|\\s+$/g, '').split(/\\s+/);
      for (var i = 0; i < keys.length; i += 1) {
        this.__controller.keystroke(keys[i], { preventDefault: noop });
      }
      return this;
    };
    _.typedText = function(text) {
      for (var i = 0; i < text.length; i += 1) this.__controller.typedText(text.charAt(i));
      return this;
    };
    _.dropEmbedded = function(pageX, pageY, options) {
      var clientX = pageX - $(window).scrollLeft();
      var clientY = pageY - $(window).scrollTop();

      var el = document.elementFromPoint(clientX, clientY);
      this.__controller.seek($(el), pageX, pageY);
      var cmd = Embed().setOptions(options);
      cmd.createLeftOf(this.__controller.cursor);
    };
    _.clickAt = function(clientX, clientY, target) {
      target = target || document.elementFromPoint(clientX, clientY);

      var ctrlr = this.__controller, root = ctrlr.root;
      if (!jQuery.contains(root.jQ[0], target)) target = root.jQ[0];
      ctrlr.seek($(target), clientX + pageXOffset, clientY + pageYOffset);
      if (ctrlr.blurred) this.focus();
      return this;
    };
    _.ignoreNextMousedown = function(fn) {
      this.__controller.cursor.options.ignoreNextMousedown = fn;
      return this;
    };
  });
  MQ.EditableField = function() { throw "wtf don't call me, I'm 'abstract'"; };
  MQ.EditableField.prototype = APIClasses.EditableField.prototype;

  /**
   * Export the API functions that MathQuill-ify an HTML element into API objects
   * of each class. If the element had already been MathQuill-ified but into a
   * different kind (or it's not an HTML element), return null.
   */
  for (var kind in API) (function(kind, defAPIClass) {
    var APIClass = APIClasses[kind] = defAPIClass(APIClasses);
    MQ[kind] = function(el, opts) {
      var mq = MQ(el);
      if (mq instanceof APIClass || !el || !el.nodeType) return mq;
      var ctrlr = Controller(APIClass.RootBlock(), $(el), Options());
      ctrlr.KIND_OF_MQ = kind;
      return APIClass(ctrlr).__mathquillify(opts, v);
    };
    MQ[kind].prototype = APIClass.prototype;
  }(kind, API[kind]));

  return MQ;
}

MathQuill.noConflict = function() {
  window.MathQuill = origMathQuill;
  return MathQuill;
};
var origMathQuill = window.MathQuill;
window.MathQuill = MathQuill;

function RootBlockMixin(_) {
  var names = 'moveOutOf deleteOutOf selectOutOf upOutOf downOutOf'.split(' ');
  for (var i = 0; i < names.length; i += 1) (function(name) {
    _[name] = function(dir) { this.controller.handle(name, dir); };
  }(names[i]));
  _.reflow = function() {
    this.controller.handle('reflow');
    this.controller.handle('edited');
    this.controller.handle('edit');
  };
}
/*************************************************
 * Sane Keyboard Events Shim
 *
 * An abstraction layer wrapping the textarea in
 * an object with methods to manipulate and listen
 * to events on, that hides all the nasty cross-
 * browser incompatibilities behind a uniform API.
 *
 * Design goal: This is a *HARD* internal
 * abstraction barrier. Cross-browser
 * inconsistencies are not allowed to leak through
 * and be dealt with by event handlers. All future
 * cross-browser issues that arise must be dealt
 * with here, and if necessary, the API updated.
 *
 * Organization:
 * - key values map and stringify()
 * - saneKeyboardEvents()
 *    + defer() and flush()
 *    + event handler logic
 *    + attach event handlers and export methods
 ************************************************/

var saneKeyboardEvents = (function() {
  // The following [key values][1] map was compiled from the
  // [DOM3 Events appendix section on key codes][2] and
  // [a widely cited report on cross-browser tests of key codes][3],
  // except for 10: 'Enter', which I've empirically observed in Safari on iOS
  // and doesn't appear to conflict with any other known key codes.
  //
  // [1]: http://www.w3.org/TR/2012/WD-DOM-Level-3-Events-20120614/#keys-keyvalues
  // [2]: http://www.w3.org/TR/2012/WD-DOM-Level-3-Events-20120614/#fixed-virtual-key-codes
  // [3]: http://unixpapa.com/js/key.html
  var KEY_VALUES = {
    8: 'Backspace',
    9: 'Tab',

    10: 'Enter', // for Safari on iOS

    13: 'Enter',

    16: 'Shift',
    17: 'Control',
    18: 'Alt',
    20: 'CapsLock',

    27: 'Esc',

    32: 'Spacebar',

    33: 'PageUp',
    34: 'PageDown',
    35: 'End',
    36: 'Home',

    37: 'Left',
    38: 'Up',
    39: 'Right',
    40: 'Down',

    45: 'Insert',

    46: 'Del',

    144: 'NumLock'
  };

  // To the extent possible, create a normalized string representation
  // of the key combo (i.e., key code and modifier keys).
  function stringify(evt) {
    var which = evt.which || evt.keyCode;
    var keyVal = KEY_VALUES[which];
    var key;
    var modifiers = [];

    if (evt.ctrlKey) modifiers.push('Ctrl');
    if (evt.originalEvent && evt.originalEvent.metaKey) modifiers.push('Meta');
    if (evt.altKey) modifiers.push('Alt');
    if (evt.shiftKey) modifiers.push('Shift');

    key = keyVal || String.fromCharCode(which);

    if (!modifiers.length && !keyVal) return key;

    modifiers.push(key);
    return modifiers.join('-');
  }

  // create a keyboard events shim that calls callbacks at useful times
  // and exports useful public methods
  return function saneKeyboardEvents(el, handlers) {
    var keydown = null;
    var keypress = null;

    var textarea = jQuery(el);
    var target = jQuery(handlers.container || textarea);

    // checkTextareaFor() is called after key or clipboard events to
    // say "Hey, I think something was just typed" or "pasted" etc,
    // so that at all subsequent opportune times (next event or timeout),
    // will check for expected typed or pasted text.
    // Need to check repeatedly because #135: in Safari 5.1 (at least),
    // after selecting something and then typing, the textarea is
    // incorrectly reported as selected during the input event (but not
    // subsequently).
    var checkTextarea = noop, timeoutId;
    function checkTextareaFor(checker) {
      checkTextarea = checker;
      clearTimeout(timeoutId);
      timeoutId = setTimeout(checker);
    }
    function checkTextareaOnce(checker) {
      checkTextareaFor(function(e) {
        checkTextarea = noop;
        clearTimeout(timeoutId);
        checker(e);
      });
    }
    target.bind('keydown keypress input keyup focusout paste', function(e) { checkTextarea(e); });


    // -*- public methods -*- //
    function select(text) {
      // check textarea at least once/one last time before munging (so
      // no race condition if selection happens after keypress/paste but
      // before checkTextarea), then never again ('cos it's been munged)
      checkTextarea();
      checkTextarea = noop;
      clearTimeout(timeoutId);

      textarea.val(text);
      if (text && textarea[0].select) textarea[0].select();
      shouldBeSelected = !!text;
    }
    var shouldBeSelected = false;

    // -*- helper subroutines -*- //

    // Determine whether there's a selection in the textarea.
    // This will always return false in IE < 9, which don't support
    // HTMLTextareaElement::selection{Start,End}.
    function hasSelection() {
      var dom = textarea[0];

      if (!('selectionStart' in dom)) return false;
      return dom.selectionStart !== dom.selectionEnd;
    }

    function handleKey() {
      handlers.keystroke(stringify(keydown), keydown);
    }

    // -*- event handlers -*- //
    function onKeydown(e) {
      keydown = e;
      keypress = null;

      if (shouldBeSelected) checkTextareaOnce(function(e) {
        if (!(e && e.type === 'focusout') && textarea[0].select) {
          // re-select textarea in case it's an unrecognized key that clears
          // the selection, then never again, 'cos next thing might be blur
          textarea[0].select();
        }
      });

      handleKey();
    }

    function onKeypress(e) {
      // call the key handler for repeated keypresses.
      // This excludes keypresses that happen directly
      // after keydown.  In that case, there will be
      // no previous keypress, so we skip it here
      if (keydown && keypress) handleKey();

      keypress = e;

      checkTextareaFor(typedText);
    }
    function onKeyup(e) {
      // Handle case of no keypress event being sent
      if (!!keydown && !keypress) checkTextareaFor(typedText);
    }
    function typedText() {
      // If there is a selection, the contents of the textarea couldn't
      // possibly have just been typed in.
      // This happens in browsers like Firefox and Opera that fire
      // keypress for keystrokes that are not text entry and leave the
      // selection in the textarea alone, such as Ctrl-C.
      // Note: we assume that browsers that don't support hasSelection()
      // also never fire keypress on keystrokes that are not text entry.
      // This seems reasonably safe because:
      // - all modern browsers including IE 9+ support hasSelection(),
      //   making it extremely unlikely any browser besides IE < 9 won't
      // - as far as we know IE < 9 never fires keypress on keystrokes
      //   that aren't text entry, which is only as reliable as our
      //   tests are comprehensive, but the IE < 9 way to do
      //   hasSelection() is poorly documented and is also only as
      //   reliable as our tests are comprehensive
      // If anything like #40 or #71 is reported in IE < 9, see
      // b1318e5349160b665003e36d4eedd64101ceacd8
      if (hasSelection()) return;

      var text = textarea.val();
      if (text.length === 1) {
        textarea.val('');
        handlers.typedText(text);
      } // in Firefox, keys that don't type text, just clear seln, fire keypress
      // https://github.com/mathquill/mathquill/issues/293#issuecomment-40997668
      else if (text && textarea[0].select) textarea[0].select(); // re-select if that's why we're here
    }

    function onBlur() { keydown = keypress = null; }

    function onPaste(e) {
      // browsers are dumb.
      //
      // In Linux, middle-click pasting causes onPaste to be called,
      // when the textarea is not necessarily focused.  We focus it
      // here to ensure that the pasted text actually ends up in the
      // textarea.
      //
      // It's pretty nifty that by changing focus in this handler,
      // we can change the target of the default action.  (This works
      // on keydown too, FWIW).
      //
      // And by nifty, we mean dumb (but useful sometimes).
      textarea.focus();

      checkTextareaFor(pastedText);
    }
    function pastedText() {
      var text = textarea.val();
      textarea.val('');
      if (text) handlers.paste(text);
    }

    // -*- attach event handlers -*- //
    target.bind({
      keydown: onKeydown,
      keypress: onKeypress,
      keyup: onKeyup,
      focusout: onBlur,
      cut: function() { checkTextareaOnce(function() { handlers.cut(); }); },
      copy: function() { checkTextareaOnce(function() { handlers.copy(); }); },
      paste: onPaste
    });

    // -*- export public methods -*- //
    return {
      select: select
    };
  };
}());
var Parser = P(function(_, super_, Parser) {
  // The Parser object is a wrapper for a parser function.
  // Externally, you use one to parse a string by calling
  //   var result = SomeParser.parse('Me Me Me! Parse Me!');
  // You should never call the constructor, rather you should
  // construct your Parser from the base parsers and the
  // parser combinator methods.

  function parseError(stream, message) {
    if (stream) {
      stream = "'"+stream+"'";
    }
    else {
      stream = 'EOF';
    }

    throw 'Parse Error: '+message+' at '+stream;
  }

  _.init = function(body) { this._ = body; };

  _.parse = function(stream) {
    return this.skip(eof)._(''+stream, success, parseError);

    function success(stream, result) { return result; }
  };

  // -*- primitive combinators -*- //
  _.or = function(alternative) {
    pray('or is passed a parser', alternative instanceof Parser);

    var self = this;

    return Parser(function(stream, onSuccess, onFailure) {
      return self._(stream, onSuccess, failure);

      function failure(newStream) {
        return alternative._(stream, onSuccess, onFailure);
      }
    });
  };

  _.then = function(next) {
    var self = this;

    return Parser(function(stream, onSuccess, onFailure) {
      return self._(stream, success, onFailure);

      function success(newStream, result) {
        var nextParser = (next instanceof Parser ? next : next(result));
        pray('a parser is returned', nextParser instanceof Parser);
        return nextParser._(newStream, onSuccess, onFailure);
      }
    });
  };

  // -*- optimized iterative combinators -*- //
  _.many = function() {
    var self = this;

    return Parser(function(stream, onSuccess, onFailure) {
      var xs = [];
      while (self._(stream, success, failure));
      return onSuccess(stream, xs);

      function success(newStream, x) {
        stream = newStream;
        xs.push(x);
        return true;
      }

      function failure() {
        return false;
      }
    });
  };

  _.times = function(min, max) {
    if (arguments.length < 2) max = min;
    var self = this;

    return Parser(function(stream, onSuccess, onFailure) {
      var xs = [];
      var result = true;
      var failure;

      for (var i = 0; i < min; i += 1) {
        result = self._(stream, success, firstFailure);
        if (!result) return onFailure(stream, failure);
      }

      for (; i < max && result; i += 1) {
        result = self._(stream, success, secondFailure);
      }

      return onSuccess(stream, xs);

      function success(newStream, x) {
        xs.push(x);
        stream = newStream;
        return true;
      }

      function firstFailure(newStream, msg) {
        failure = msg;
        stream = newStream;
        return false;
      }

      function secondFailure(newStream, msg) {
        return false;
      }
    });
  };

  // -*- higher-level combinators -*- //
  _.result = function(res) { return this.then(succeed(res)); };
  _.atMost = function(n) { return this.times(0, n); };
  _.atLeast = function(n) {
    var self = this;
    return self.times(n).then(function(start) {
      return self.many().map(function(end) {
        return start.concat(end);
      });
    });
  };

  _.map = function(fn) {
    return this.then(function(result) { return succeed(fn(result)); });
  };

  _.skip = function(two) {
    return this.then(function(result) { return two.result(result); });
  };

  // -*- primitive parsers -*- //
  var string = this.string = function(str) {
    var len = str.length;
    var expected = "expected '"+str+"'";

    return Parser(function(stream, onSuccess, onFailure) {
      var head = stream.slice(0, len);

      if (head === str) {
        return onSuccess(stream.slice(len), head);
      }
      else {
        return onFailure(stream, expected);
      }
    });
  };

  var regex = this.regex = function(re) {
    pray('regexp parser is anchored', re.toString().charAt(1) === '^');

    var expected = 'expected '+re;

    return Parser(function(stream, onSuccess, onFailure) {
      var match = re.exec(stream);

      if (match) {
        var result = match[0];
        return onSuccess(stream.slice(result.length), result);
      }
      else {
        return onFailure(stream, expected);
      }
    });
  };

  var succeed = Parser.succeed = function(result) {
    return Parser(function(stream, onSuccess) {
      return onSuccess(stream, result);
    });
  };

  var fail = Parser.fail = function(msg) {
    return Parser(function(stream, _, onFailure) {
      return onFailure(stream, msg);
    });
  };

  var letter = Parser.letter = regex(/^[a-z]/i);
  var letters = Parser.letters = regex(/^[a-z]*/i);
  var digit = Parser.digit = regex(/^[0-9]/);
  var digits = Parser.digits = regex(/^[0-9]*/);
  var whitespace = Parser.whitespace = regex(/^\\s+/);
  var optWhitespace = Parser.optWhitespace = regex(/^\\s*/);

  var any = Parser.any = Parser(function(stream, onSuccess, onFailure) {
    if (!stream) return onFailure(stream, 'expected any character');

    return onSuccess(stream.slice(1), stream.charAt(0));
  });

  var all = Parser.all = Parser(function(stream, onSuccess, onFailure) {
    return onSuccess('', stream);
  });

  var eof = Parser.eof = Parser(function(stream, onSuccess, onFailure) {
    if (stream) return onFailure(stream, 'expected EOF');

    return onSuccess(stream, stream);
  });
});
Controller.open(function(_) {
  _.focusBlurEvents = function() {
    var ctrlr = this, root = ctrlr.root, cursor = ctrlr.cursor;
    var blurTimeout;
    ctrlr.textarea.focus(function() {
      ctrlr.blurred = false;
      clearTimeout(blurTimeout);
      ctrlr.container.addClass('mq-focused');
      if (!cursor.parent)
        cursor.insAtRightEnd(root);
      if (cursor.selection) {
        cursor.selection.jQ.removeClass('mq-blur');
        ctrlr.selectionChanged(); //re-select textarea contents after tabbing away and back
      }
      else
        cursor.show();
    }).blur(function() {
      ctrlr.blurred = true;
      blurTimeout = setTimeout(function() { // wait for blur on window; if
        root.postOrder('intentionalBlur'); // none, intentional blur: #264
        cursor.clearSelection().endSelection();
        blur();
      });
      $(window).bind('blur', windowBlur);
    });
    function windowBlur() { // blur event also fired on window, just switching
      clearTimeout(blurTimeout); // tabs/windows, not intentional blur
      if (cursor.selection) cursor.selection.jQ.addClass('mq-blur');
      blur();
    }
    function blur() { // not directly in the textarea blur handler so as to be
      cursor.hide().parent.blur(); // synchronous with/in the same frame as
      ctrlr.container.removeClass('mq-focused'); // clearing/blurring selection
      $(window).unbind('blur', windowBlur);
    }
    ctrlr.blurred = true;
    cursor.hide().parent.blur();
  };
});

/**
 * TODO: I wanted to move MathBlock::focus and blur here, it would clean
 * up lots of stuff like, TextBlock::focus is set to MathBlock::focus
 * and TextBlock::blur calls MathBlock::blur, when instead they could
 * use inheritance and super_.
 *
 * Problem is, there's lots of calls to .focus()/.blur() on nodes
 * outside Controller::focusBlurEvents(), such as .postOrder('blur') on
 * insertion, which if MathBlock::blur becomes Node::blur, would add the
 * 'blur' CSS class to all Symbol's (because .isEmpty() is true for all
 * of them).
 *
 * I'm not even sure there aren't other troublesome calls to .focus() or
 * .blur(), so this is TODO for now.
 */
/***********************************************
 * Export math in a human-readable text format
 * As you can see, only half-baked so far.
 **********************************************/

Controller.open(function(_, super_) {
  _.exportText = function() {
    return this.root.foldChildren('', function(text, child) {
      return text + child.text();
    });
  };
});
/********************************************************
 * Deals with mouse events for clicking, drag-to-select
 *******************************************************/

Controller.open(function(_) {
  Options.p.ignoreNextMousedown = noop;
  _.delegateMouseEvents = function() {
    var ultimateRootjQ = this.root.jQ;
    //drag-to-select event handling
    this.container.bind('mousedown.mathquill', function(e) {
      var rootjQ = $(e.target).closest('.mq-root-block');
      var root = Node.byId[rootjQ.attr(mqBlockId) || ultimateRootjQ.attr(mqBlockId)];
      var ctrlr = root.controller, cursor = ctrlr.cursor, blink = cursor.blink;
      var textareaSpan = ctrlr.textareaSpan, textarea = ctrlr.textarea;

      e.preventDefault(); // doesn't work in IE\\u22648, but it's a one-line fix:
      e.target.unselectable = true; // http://jsbin.com/yagekiji/1

      if (cursor.options.ignoreNextMousedown(e)) return;
      else cursor.options.ignoreNextMousedown = noop;

      var target;
      function mousemove(e) { target = $(e.target); }
      function docmousemove(e) {
        if (!cursor.anticursor) cursor.startSelection();
        ctrlr.seek(target, e.pageX, e.pageY).cursor.select();
        target = undefined;
      }
      // outside rootjQ, the MathQuill node corresponding to the target (if any)
      // won't be inside this root, so don't mislead Controller::seek with it

      function mouseup(e) {
        cursor.blink = blink;
        if (!cursor.selection) {
          if (ctrlr.editable) {
            cursor.show();
          }
          else {
            textareaSpan.detach();
          }
        }

        // delete the mouse handlers now that we're not dragging anymore
        rootjQ.unbind('mousemove', mousemove);
        $(e.target.ownerDocument).unbind('mousemove', docmousemove).unbind('mouseup', mouseup);
      }

      if (ctrlr.blurred) {
        if (!ctrlr.editable) rootjQ.prepend(textareaSpan);
        textarea.focus();
      }

      cursor.blink = noop;
      ctrlr.seek($(e.target), e.pageX, e.pageY).cursor.startSelection();

      rootjQ.mousemove(mousemove);
      $(e.target.ownerDocument).mousemove(docmousemove).mouseup(mouseup);
      // listen on document not just body to not only hear about mousemove and
      // mouseup on page outside field, but even outside page, except iframes: https://github.com/mathquill/mathquill/commit/8c50028afcffcace655d8ae2049f6e02482346c5#commitcomment-6175800
    });
  }
});

Controller.open(function(_) {
  _.seek = function(target, pageX, pageY) {
    var cursor = this.notify('select').cursor;

    if (target) {
      var nodeId = target.attr(mqBlockId) || target.attr(mqCmdId);
      if (!nodeId) {
        var targetParent = target.parent();
        nodeId = targetParent.attr(mqBlockId) || targetParent.attr(mqCmdId);
      }
    }
    var node = nodeId ? Node.byId[nodeId] : this.root;
    pray('nodeId is the id of some Node that exists', node);

    // don't clear selection until after getting node from target, in case
    // target was selection span, otherwise target will have no parent and will
    // seek from root, which is less accurate (e.g. fraction)
    cursor.clearSelection().show();

    node.seek(pageX, cursor);
    this.scrollHoriz(); // before .selectFrom when mouse-selecting, so
                        // always hits no-selection case in scrollHoriz and scrolls slower
    return this;
  };
});
/*****************************************
 * Deals with the browser DOM events from
 * interaction with the typist.
 ****************************************/

Controller.open(function(_) {
  _.keystroke = function(key, evt) {
    this.cursor.parent.keystroke(key, evt, this);
  };
});

Node.open(function(_) {
  _.keystroke = function(key, e, ctrlr) {
    var cursor = ctrlr.cursor;

    switch (key) {
    case 'Ctrl-Shift-Backspace':
    case 'Ctrl-Backspace':
      ctrlr.ctrlDeleteDir(L);
      break;

    case 'Shift-Backspace':
    case 'Backspace':
      ctrlr.backspace();
      break;

    // Tab or Esc -> go one block right if it exists, else escape right.
    case 'Esc':
    case 'Tab':
      ctrlr.escapeDir(R, key, e);
      return;

    // Shift-Tab -> go one block left if it exists, else escape left.
    case 'Shift-Tab':
    case 'Shift-Esc':
      ctrlr.escapeDir(L, key, e);
      return;

    // End -> move to the end of the current block.
    case 'End':
      ctrlr.notify('move').cursor.insAtRightEnd(cursor.parent);
      break;

    // Ctrl-End -> move all the way to the end of the root block.
    case 'Ctrl-End':
      ctrlr.notify('move').cursor.insAtRightEnd(ctrlr.root);
      break;

    // Shift-End -> select to the end of the current block.
    case 'Shift-End':
      while (cursor[R]) {
        ctrlr.selectRight();
      }
      break;

    // Ctrl-Shift-End -> select to the end of the root block.
    case 'Ctrl-Shift-End':
      while (cursor[R] || cursor.parent !== ctrlr.root) {
        ctrlr.selectRight();
      }
      break;

    // Home -> move to the start of the root block or the current block.
    case 'Home':
      ctrlr.notify('move').cursor.insAtLeftEnd(cursor.parent);
      break;

    // Ctrl-Home -> move to the start of the current block.
    case 'Ctrl-Home':
      ctrlr.notify('move').cursor.insAtLeftEnd(ctrlr.root);
      break;

    // Shift-Home -> select to the start of the current block.
    case 'Shift-Home':
      while (cursor[L]) {
        ctrlr.selectLeft();
      }
      break;

    // Ctrl-Shift-Home -> move to the start of the root block.
    case 'Ctrl-Shift-Home':
      while (cursor[L] || cursor.parent !== ctrlr.root) {
        ctrlr.selectLeft();
      }
      break;

    case 'Left': ctrlr.moveLeft(); break;
    case 'Shift-Left': ctrlr.selectLeft(); break;
    case 'Ctrl-Left': break;

    case 'Right': ctrlr.moveRight(); break;
    case 'Shift-Right': ctrlr.selectRight(); break;
    case 'Ctrl-Right': break;

    case 'Up': ctrlr.moveUp(); break;
    case 'Down': ctrlr.moveDown(); break;

    case 'Shift-Up':
      if (cursor[L]) {
        while (cursor[L]) ctrlr.selectLeft();
      } else {
        ctrlr.selectLeft();
      }

    case 'Shift-Down':
      if (cursor[R]) {
        while (cursor[R]) ctrlr.selectRight();
      }
      else {
        ctrlr.selectRight();
      }

    case 'Ctrl-Up': break;
    case 'Ctrl-Down': break;

    case 'Ctrl-Shift-Del':
    case 'Ctrl-Del':
      ctrlr.ctrlDeleteDir(R);
      break;

    case 'Shift-Del':
    case 'Del':
      ctrlr.deleteForward();
      break;

    case 'Meta-A':
    case 'Ctrl-A':
      ctrlr.notify('move').cursor.insAtRightEnd(ctrlr.root);
      while (cursor[L]) ctrlr.selectLeft();
      break;

    default:
      return;
    }
    e.preventDefault();
    ctrlr.scrollHoriz();
  };

  _.moveOutOf = // called by Controller::escapeDir, moveDir
  _.moveTowards = // called by Controller::moveDir
  _.deleteOutOf = // called by Controller::deleteDir
  _.deleteTowards = // called by Controller::deleteDir
  _.unselectInto = // called by Controller::selectDir
  _.selectOutOf = // called by Controller::selectDir
  _.selectTowards = // called by Controller::selectDir
    function() { pray('overridden or never called on this node'); };
});

Controller.open(function(_) {
  this.onNotify(function(e) {
    if (e === 'move' || e === 'upDown') this.show().clearSelection();
  });
  _.escapeDir = function(dir, key, e) {
    prayDirection(dir);
    var cursor = this.cursor;

    // only prevent default of Tab if not in the root editable
    if (cursor.parent !== this.root) e.preventDefault();

    // want to be a noop if in the root editable (in fact, Tab has an unrelated
    // default browser action if so)
    if (cursor.parent === this.root) return;

    cursor.parent.moveOutOf(dir, cursor);
    return this.notify('move');
  };

  optionProcessors.leftRightIntoCmdGoes = function(updown) {
    if (updown && updown !== 'up' && updown !== 'down') {
      throw '"up" or "down" required for leftRightIntoCmdGoes option, '
            + 'got "'+updown+'"';
    }
    return updown;
  };
  _.moveDir = function(dir) {
    prayDirection(dir);
    var cursor = this.cursor, updown = cursor.options.leftRightIntoCmdGoes;

    if (cursor.selection) {
      cursor.insDirOf(dir, cursor.selection.ends[dir]);
    }
    else if (cursor[dir]) cursor[dir].moveTowards(dir, cursor, updown);
    else cursor.parent.moveOutOf(dir, cursor, updown);

    return this.notify('move');
  };
  _.moveLeft = function() { return this.moveDir(L); };
  _.moveRight = function() { return this.moveDir(R); };

  /**
   * moveUp and moveDown have almost identical algorithms:
   * - first check left and right, if so insAtLeft/RightEnd of them
   * - else check the parent's 'upOutOf'/'downOutOf' property:
   *   + if it's a function, call it with the cursor as the sole argument and
   *     use the return value as if it were the value of the property
   *   + if it's a Node, jump up or down into it:
   *     - if there is a cached Point in the block, insert there
   *     - else, seekHoriz within the block to the current x-coordinate (to be
   *       as close to directly above/below the current position as possible)
   *   + unless it's exactly \`true\`, stop bubbling
   */
  _.moveUp = function() { return moveUpDown(this, 'up'); };
  _.moveDown = function() { return moveUpDown(this, 'down'); };
  function moveUpDown(self, dir) {
    var cursor = self.notify('upDown').cursor;
    var dirInto = dir+'Into', dirOutOf = dir+'OutOf';
    if (cursor[R][dirInto]) cursor.insAtLeftEnd(cursor[R][dirInto]);
    else if (cursor[L][dirInto]) cursor.insAtRightEnd(cursor[L][dirInto]);
    else {
      cursor.parent.bubble(function(ancestor) {
        var prop = ancestor[dirOutOf];
        if (prop) {
          if (typeof prop === 'function') prop = ancestor[dirOutOf](cursor);
          if (prop instanceof Node) cursor.jumpUpDown(ancestor, prop);
          if (prop !== true) return false;
        }
      });
    }
    return self;
  }
  this.onNotify(function(e) { if (e !== 'upDown') this.upDownCache = {}; });

  this.onNotify(function(e) { if (e === 'edit') this.show().deleteSelection(); });
  _.deleteDir = function(dir) {
    prayDirection(dir);
    var cursor = this.cursor;

    var hadSelection = cursor.selection;
    this.notify('edit'); // deletes selection if present
    if (!hadSelection) {
      if (cursor[dir]) cursor[dir].deleteTowards(dir, cursor);
      else cursor.parent.deleteOutOf(dir, cursor);
    }

    if (cursor[L].siblingDeleted) cursor[L].siblingDeleted(cursor.options, R);
    if (cursor[R].siblingDeleted) cursor[R].siblingDeleted(cursor.options, L);
    cursor.parent.bubble('reflow');

    return this;
  };
  _.ctrlDeleteDir = function(dir) {
    prayDirection(dir);
    var cursor = this.cursor;
    if (!cursor[dir] || cursor.selection) return this.deleteDir(dir);

    this.notify('edit');
    if (dir === L) {
      Fragment(cursor.parent.ends[L], cursor[L]).remove();
    } else {
      Fragment(cursor[R], cursor.parent.ends[R]).remove();
    };
    cursor.insAtDirEnd(dir, cursor.parent);

    if (cursor[L].siblingDeleted) cursor[L].siblingDeleted(cursor.options, R);
    if (cursor[R].siblingDeleted) cursor[R].siblingDeleted(cursor.options, L);
    cursor.parent.bubble('reflow');

    return this;
  };
  _.backspace = function() { return this.deleteDir(L); };
  _.deleteForward = function() { return this.deleteDir(R); };

  this.onNotify(function(e) { if (e !== 'select') this.endSelection(); });
  _.selectDir = function(dir) {
    var cursor = this.notify('select').cursor, seln = cursor.selection;
    prayDirection(dir);

    if (!cursor.anticursor) cursor.startSelection();

    var node = cursor[dir];
    if (node) {
      // "if node we're selecting towards is inside selection (hence retracting)
      // and is on the *far side* of the selection (hence is only node selected)
      // and the anticursor is *inside* that node, not just on the other side"
      if (seln && seln.ends[dir] === node && cursor.anticursor[-dir] !== node) {
        node.unselectInto(dir, cursor);
      }
      else node.selectTowards(dir, cursor);
    }
    else cursor.parent.selectOutOf(dir, cursor);

    cursor.clearSelection();
    cursor.select() || cursor.show();
  };
  _.selectLeft = function() { return this.selectDir(L); };
  _.selectRight = function() { return this.selectDir(R); };
});
/*********************************************
 * Manage the MathQuill instance's textarea
 * (as owned by the Controller)
 ********************************************/

Controller.open(function(_) {
  Options.p.substituteTextarea = function() {
    return $('<textarea autocapitalize=off autocomplete=off autocorrect=off ' +
               'spellcheck=false x-palm-disable-ste-all=true />')[0];
  };
  _.createTextarea = function() {
    var textareaSpan = this.textareaSpan = $('<span class="mq-textarea"></span>'),
      textarea = this.options.substituteTextarea();
    if (!textarea.nodeType) {
      throw 'substituteTextarea() must return a DOM element, got ' + textarea;
    }
    textarea = this.textarea = $(textarea).appendTo(textareaSpan);

    var ctrlr = this;
    ctrlr.cursor.selectionChanged = function() { ctrlr.selectionChanged(); };
  };
  _.selectionChanged = function() {
    var ctrlr = this;
    forceIERedraw(ctrlr.container[0]);

    // throttle calls to setTextareaSelection(), because setting textarea.value
    // and/or calling textarea.select() can have anomalously bad performance:
    // https://github.com/mathquill/mathquill/issues/43#issuecomment-1399080
    if (ctrlr.textareaSelectionTimeout === undefined) {
      ctrlr.textareaSelectionTimeout = setTimeout(function() {
        ctrlr.setTextareaSelection();
      });
    }
  };
  _.setTextareaSelection = function() {
    this.textareaSelectionTimeout = undefined;
    var latex = '';
    if (this.cursor.selection) {
      latex = this.cursor.selection.join('latex');
      if (this.options.statelessClipboard) {
        // FIXME: like paste, only this works for math fields; should ask parent
        latex = '$' + latex + '$';
      }
    }
    this.selectFn(latex);
  };
  _.staticMathTextareaEvents = function() {
    var ctrlr = this, root = ctrlr.root, cursor = ctrlr.cursor,
      textarea = ctrlr.textarea, textareaSpan = ctrlr.textareaSpan;

    this.container.prepend(jQuery('<span class="mq-selectable">')
      .text('$'+ctrlr.exportLatex()+'$'));
    ctrlr.blurred = true;
    textarea.bind('cut paste', false)
    .bind('copy', function() { ctrlr.setTextareaSelection(); })
    .focus(function() { ctrlr.blurred = false; }).blur(function() {
      if (cursor.selection) cursor.selection.clear();
      setTimeout(detach); //detaching during blur explodes in WebKit
    });
    function detach() {
      textareaSpan.detach();
      ctrlr.blurred = true;
    }

    ctrlr.selectFn = function(text) {
      textarea.val(text);
      if (text) textarea.select();
    };
  };
  Options.p.substituteKeyboardEvents = saneKeyboardEvents;
  _.editablesTextareaEvents = function() {
    var ctrlr = this, textarea = ctrlr.textarea, textareaSpan = ctrlr.textareaSpan;

    var keyboardEventsShim = this.options.substituteKeyboardEvents(textarea, this);
    this.selectFn = function(text) { keyboardEventsShim.select(text); };
    this.container.prepend(textareaSpan);
    this.focusBlurEvents();
  };
  _.typedText = function(ch) {
    if (ch === '\\n') return this.handle('enter');
    var cursor = this.notify().cursor;
    cursor.parent.write(cursor, ch);
    this.scrollHoriz();
  };
  _.cut = function() {
    var ctrlr = this, cursor = ctrlr.cursor;
    if (cursor.selection) {
      setTimeout(function() {
        ctrlr.notify('edit'); // deletes selection if present
        cursor.parent.bubble('reflow');
      });
    }
  };
  _.copy = function() {
    this.setTextareaSelection();
  };
  _.paste = function(text) {
    // TODO: document \`statelessClipboard\` config option in README, after
    // making it work like it should, that is, in both text and math mode
    // (currently only works in math fields, so worse than pointless, it
    //  only gets in the way by \\text{}-ifying pasted stuff and $-ifying
    //  cut/copied LaTeX)
    if (this.options.statelessClipboard) {
      if (text.slice(0,1) === '$' && text.slice(-1) === '$') {
        text = text.slice(1, -1);
      }
      else {
        text = '\\\\text{'+text+'}';
      }
    }
    // FIXME: this always inserts math or a TextBlock, even in a RootTextBlock
    this.writeLatex(text).cursor.show();
  };
});
// Parser MathBlock
var latexMathParser = (function() {
  function commandToBlock(cmd) { // can also take in a Fragment
    var block = MathBlock();
    cmd.adopt(block, 0, 0);
    return block;
  }
  function joinBlocks(blocks) {
    var firstBlock = blocks[0] || MathBlock();

    for (var i = 1; i < blocks.length; i += 1) {
      blocks[i].children().adopt(firstBlock, firstBlock.ends[R], 0);
    }

    return firstBlock;
  }

  var string = Parser.string;
  var regex = Parser.regex;
  var letter = Parser.letter;
  var any = Parser.any;
  var optWhitespace = Parser.optWhitespace;
  var succeed = Parser.succeed;
  var fail = Parser.fail;

  // Parsers yielding either MathCommands, or Fragments of MathCommands
  //   (either way, something that can be adopted by a MathBlock)
  var variable = letter.map(function(c) { return Letter(c); });
  var symbol = regex(/^[^\${}\\\\_^]/).map(function(c) { return VanillaSymbol(c); });

  var controlSequence =
    regex(/^[^\\\\a-eg-zA-Z]/) // hotfix #164; match MathBlock::write
    .or(string('\\\\').then(
      regex(/^[a-z]+/i)
      .or(regex(/^\\s+/).result(' '))
      .or(any)
    )).then(function(ctrlSeq) {
      var cmdKlass = LatexCmds[ctrlSeq];

      if (cmdKlass) {
        return cmdKlass(ctrlSeq).parser();
      }
      else {
        return fail('unknown command: \\\\'+ctrlSeq);
      }
    })
  ;

  var command =
    controlSequence
    .or(variable)
    .or(symbol)
  ;

  // Parsers yielding MathBlocks
  var mathGroup = string('{').then(function() { return mathSequence; }).skip(string('}'));
  var mathBlock = optWhitespace.then(mathGroup.or(command.map(commandToBlock)));
  var mathSequence = mathBlock.many().map(joinBlocks).skip(optWhitespace);

  var optMathBlock =
    string('[').then(
      mathBlock.then(function(block) {
        return block.join('latex') !== ']' ? succeed(block) : fail();
      })
      .many().map(joinBlocks).skip(optWhitespace)
    ).skip(string(']'))
  ;

  var latexMath = mathSequence;

  latexMath.block = mathBlock;
  latexMath.optBlock = optMathBlock;
  return latexMath;
})();

Controller.open(function(_, super_) {
  _.exportLatex = function() {
    return this.root.latex().replace(/(\\\\[a-z]+) (?![a-z])/ig,'$1');
  };

  optionProcessors.maxDepth = function(depth) {
    return (typeof depth === 'number') ? depth : undefined;
  };
  _.writeLatex = function(latex) {
    var cursor = this.notify('edit').cursor;

    var all = Parser.all;
    var eof = Parser.eof;

    var block = latexMathParser.skip(eof).or(all.result(false)).parse(latex);

    if (block && !block.isEmpty() && block.prepareInsertionAt(cursor)) {
      block.children().adopt(cursor.parent, cursor[L], cursor[R]);
      var jQ = block.jQize();
      jQ.insertBefore(cursor.jQ);
      cursor[L] = block.ends[R];
      block.finalizeInsert(cursor.options, cursor);
      if (block.ends[R][R].siblingCreated) block.ends[R][R].siblingCreated(cursor.options, L);
      if (block.ends[L][L].siblingCreated) block.ends[L][L].siblingCreated(cursor.options, R);
      cursor.parent.bubble('reflow');
    }

    return this;
  };
  _.renderLatexMath = function(latex) {
    var root = this.root;
    var cursor = this.cursor;
    var options = cursor.options;
    var jQ = root.jQ;

    var all = Parser.all;
    var eof = Parser.eof;

    var block = latexMathParser.skip(eof).or(all.result(false)).parse(latex);

    root.eachChild('postOrder', 'dispose');
    root.ends[L] = root.ends[R] = 0;

    if (block && block.prepareInsertionAt(cursor)) {
      block.children().adopt(root, 0, 0);
      var html = block.join('html');
      jQ.html(html);
      root.jQize(jQ.children());
      root.finalizeInsert(cursor.options);
    }
    else {
      jQ.empty();
    }

    delete cursor.selection;
    cursor.insAtRightEnd(root);
  };
  _.renderLatexText = function(latex) {
    var root = this.root, cursor = this.cursor;

    root.jQ.children().slice(1).remove();
    root.eachChild('postOrder', 'dispose');
    root.ends[L] = root.ends[R] = 0;
    delete cursor.selection;
    cursor.show().insAtRightEnd(root);

    var regex = Parser.regex;
    var string = Parser.string;
    var eof = Parser.eof;
    var all = Parser.all;

    // Parser RootMathCommand
    var mathMode = string('$').then(latexMathParser)
      // because TeX is insane, math mode doesn't necessarily
      // have to end.  So we allow for the case that math mode
      // continues to the end of the stream.
      .skip(string('$').or(eof))
      .map(function(block) {
        // HACK FIXME: this shouldn't have to have access to cursor
        var rootMathCommand = RootMathCommand(cursor);

        rootMathCommand.createBlocks();
        var rootMathBlock = rootMathCommand.ends[L];
        block.children().adopt(rootMathBlock, 0, 0);

        return rootMathCommand;
      })
    ;

    var escapedDollar = string('\\\\$').result('$');
    var textChar = escapedDollar.or(regex(/^[^$]/)).map(VanillaSymbol);
    var latexText = mathMode.or(textChar).many();
    var commands = latexText.skip(eof).or(all.result(false)).parse(latex);

    if (commands) {
      for (var i = 0; i < commands.length; i += 1) {
        commands[i].adopt(root, root.ends[R], 0);
      }

      root.jQize().appendTo(root.jQ);

      root.finalizeInsert(cursor.options);
    }
  };
});
/***********************************************
 * Horizontal panning for editable fields that
 * overflow their width
 **********************************************/

Controller.open(function(_) {
  _.scrollHoriz = function() {
    var cursor = this.cursor, seln = cursor.selection;
    var rootRect = this.root.jQ[0].getBoundingClientRect();
    if (!seln) {
      var x = cursor.jQ[0].getBoundingClientRect().left;
      if (x > rootRect.right - 20) var scrollBy = x - (rootRect.right - 20);
      else if (x < rootRect.left + 20) var scrollBy = x - (rootRect.left + 20);
      else return;
    }
    else {
      var rect = seln.jQ[0].getBoundingClientRect();
      var overLeft = rect.left - (rootRect.left + 20);
      var overRight = rect.right - (rootRect.right - 20);
      if (seln.ends[L] === cursor[R]) {
        if (overLeft < 0) var scrollBy = overLeft;
        else if (overRight > 0) {
          if (rect.left - overRight < rootRect.left + 20) var scrollBy = overLeft;
          else var scrollBy = overRight;
        }
        else return;
      }
      else {
        if (overRight > 0) var scrollBy = overRight;
        else if (overLeft < 0) {
          if (rect.right - overLeft > rootRect.right - 20) var scrollBy = overRight;
          else var scrollBy = overLeft;
        }
        else return;
      }
    }
    this.root.jQ.stop().animate({ scrollLeft: '+=' + scrollBy}, 100);
  };
});
/*************************************************
 * Abstract classes of math blocks and commands.
 ************************************************/

/**
 * Math tree node base class.
 * Some math-tree-specific extensions to Node.
 * Both MathBlock's and MathCommand's descend from it.
 */
var MathElement = P(Node, function(_, super_) {
  _.finalizeInsert = function(options, cursor) { // \`cursor\` param is only for
      // SupSub::contactWeld, and is deliberately only passed in by writeLatex,
      // see ea7307eb4fac77c149a11ffdf9a831df85247693
    var self = this;
    self.postOrder('finalizeTree', options);
    self.postOrder('contactWeld', cursor);

    // note: this order is important.
    // empty elements need the empty box provided by blur to
    // be present in order for their dimensions to be measured
    // correctly by 'reflow' handlers.
    self.postOrder('blur');

    self.postOrder('reflow');
    if (self[R].siblingCreated) self[R].siblingCreated(options, L);
    if (self[L].siblingCreated) self[L].siblingCreated(options, R);
    self.bubble('reflow');
  };
  // If the maxDepth option is set, make sure
  // deeply nested content is truncated. Just return
  // false if the cursor is already too deep.
  _.prepareInsertionAt = function(cursor) {
    var maxDepth = cursor.options.maxDepth;
    if (maxDepth !== undefined) {
      var cursorDepth = cursor.depth();
      if (cursorDepth > maxDepth) {
        return false;
      }
      this.removeNodesDeeperThan(maxDepth-cursorDepth);
    }
    return true;
  };
  // Remove nodes that are more than \`cutoff\`
  // blocks deep from this node.
  _.removeNodesDeeperThan = function (cutoff) {
    var depth = 0;
    var queue = [[this, depth]];
    var current;

    // Do a breadth-first search of this node's descendants
    // down to cutoff, removing anything deeper.
    while (queue.length) {
      current = queue.shift();
      current[0].children().each(function (child) {
        var i = (child instanceof MathBlock) ? 1 : 0;
        depth = current[1]+i;

        if (depth <= cutoff) {
          queue.push([child, depth]);
        } else {
          (i ? child.children() : child).remove();
        }
      });
    }
  };
});

/**
 * Commands and operators, like subscripts, exponents, or fractions.
 * Descendant commands are organized into blocks.
 */
var MathCommand = P(MathElement, function(_, super_) {
  _.init = function(ctrlSeq, htmlTemplate, textTemplate) {
    var cmd = this;
    super_.init.call(cmd);

    if (!cmd.ctrlSeq) cmd.ctrlSeq = ctrlSeq;
    if (htmlTemplate) cmd.htmlTemplate = htmlTemplate;
    if (textTemplate) cmd.textTemplate = textTemplate;
  };

  // obvious methods
  _.replaces = function(replacedFragment) {
    replacedFragment.disown();
    this.replacedFragment = replacedFragment;
  };
  _.isEmpty = function() {
    return this.foldChildren(true, function(isEmpty, child) {
      return isEmpty && child.isEmpty();
    });
  };

  _.parser = function() {
    var block = latexMathParser.block;
    var self = this;

    return block.times(self.numBlocks()).map(function(blocks) {
      self.blocks = blocks;

      for (var i = 0; i < blocks.length; i += 1) {
        blocks[i].adopt(self, self.ends[R], 0);
      }

      return self;
    });
  };

  // createLeftOf(cursor) and the methods it calls
  _.createLeftOf = function(cursor) {
    var cmd = this;
    var replacedFragment = cmd.replacedFragment;

    cmd.createBlocks();
    super_.createLeftOf.call(cmd, cursor);
    if (replacedFragment) {
      replacedFragment.adopt(cmd.ends[L], 0, 0);
      replacedFragment.jQ.appendTo(cmd.ends[L].jQ);
      cmd.placeCursor(cursor);
      cmd.prepareInsertionAt(cursor);
    }
    cmd.finalizeInsert(cursor.options);
    cmd.placeCursor(cursor);
  };
  _.createBlocks = function() {
    var cmd = this,
      numBlocks = cmd.numBlocks(),
      blocks = cmd.blocks = Array(numBlocks);

    for (var i = 0; i < numBlocks; i += 1) {
      var newBlock = blocks[i] = MathBlock();
      newBlock.adopt(cmd, cmd.ends[R], 0);
    }
  };
  _.placeCursor = function(cursor) {
    //insert the cursor at the right end of the first empty child, searching
    //left-to-right, or if none empty, the right end child
    cursor.insAtRightEnd(this.foldChildren(this.ends[L], function(leftward, child) {
      return leftward.isEmpty() ? leftward : child;
    }));
  };

  // editability methods: called by the cursor for editing, cursor movements,
  // and selection of the MathQuill tree, these all take in a direction and
  // the cursor
  _.moveTowards = function(dir, cursor, updown) {
    var updownInto = updown && this[updown+'Into'];
    cursor.insAtDirEnd(-dir, updownInto || this.ends[-dir]);
  };
  _.deleteTowards = function(dir, cursor) {
    if (this.isEmpty()) cursor[dir] = this.remove()[dir];
    else this.moveTowards(dir, cursor, null);
  };
  _.selectTowards = function(dir, cursor) {
    cursor[-dir] = this;
    cursor[dir] = this[dir];
  };
  _.selectChildren = function() {
    return Selection(this, this);
  };
  _.unselectInto = function(dir, cursor) {
    cursor.insAtDirEnd(-dir, cursor.anticursor.ancestors[this.id]);
  };
  _.seek = function(pageX, cursor) {
    function getBounds(node) {
      var bounds = {}
      bounds[L] = node.jQ.offset().left;
      bounds[R] = bounds[L] + node.jQ.outerWidth();
      return bounds;
    }

    var cmd = this;
    var cmdBounds = getBounds(cmd);

    if (pageX < cmdBounds[L]) return cursor.insLeftOf(cmd);
    if (pageX > cmdBounds[R]) return cursor.insRightOf(cmd);

    var leftLeftBound = cmdBounds[L];
    cmd.eachChild(function(block) {
      var blockBounds = getBounds(block);
      if (pageX < blockBounds[L]) {
        // closer to this block's left bound, or the bound left of that?
        if (pageX - leftLeftBound < blockBounds[L] - pageX) {
          if (block[L]) cursor.insAtRightEnd(block[L]);
          else cursor.insLeftOf(cmd);
        }
        else cursor.insAtLeftEnd(block);
        return false;
      }
      else if (pageX > blockBounds[R]) {
        if (block[R]) leftLeftBound = blockBounds[R]; // continue to next block
        else { // last (rightmost) block
          // closer to this block's right bound, or the cmd's right bound?
          if (cmdBounds[R] - pageX < pageX - blockBounds[R]) {
            cursor.insRightOf(cmd);
          }
          else cursor.insAtRightEnd(block);
        }
      }
      else {
        block.seek(pageX, cursor);
        return false;
      }
    });
  }

  // methods involved in creating and cross-linking with HTML DOM nodes
  /*
    They all expect an .htmlTemplate like
      '<span>&0</span>'
    or
      '<span><span>&0</span><span>&1</span></span>'

    See html.test.js for more examples.

    Requirements:
    - For each block of the command, there must be exactly one "block content
      marker" of the form '&<number>' where <number> is the 0-based index of the
      block. (Like the LaTeX \\newcommand syntax, but with a 0-based rather than
      1-based index, because JavaScript because C because Dijkstra.)
    - The block content marker must be the sole contents of the containing
      element, there can't even be surrounding whitespace, or else we can't
      guarantee sticking to within the bounds of the block content marker when
      mucking with the HTML DOM.
    - The HTML not only must be well-formed HTML (of course), but also must
      conform to the XHTML requirements on tags, specifically all tags must
      either be self-closing (like '<br/>') or come in matching pairs.
      Close tags are never optional.

    Note that &<number> isn't well-formed HTML; if you wanted a literal '&123',
    your HTML template would have to have '&amp;123'.
  */
  _.numBlocks = function() {
    var matches = this.htmlTemplate.match(/&\\d+/g);
    return matches ? matches.length : 0;
  };
  _.html = function() {
    // Render the entire math subtree rooted at this command, as HTML.
    // Expects .createBlocks() to have been called already, since it uses the
    // .blocks array of child blocks.
    //
    // See html.test.js for example templates and intended outputs.
    //
    // Given an .htmlTemplate as described above,
    // - insert the mathquill-command-id attribute into all top-level tags,
    //   which will be used to set this.jQ in .jQize().
    //   This is straightforward:
    //     * tokenize into tags and non-tags
    //     * loop through top-level tokens:
    //         * add #cmdId attribute macro to top-level self-closing tags
    //         * else add #cmdId attribute macro to top-level open tags
    //             * skip the matching top-level close tag and all tag pairs
    //               in between
    // - for each block content marker,
    //     + replace it with the contents of the corresponding block,
    //       rendered as HTML
    //     + insert the mathquill-block-id attribute into the containing tag
    //   This is even easier, a quick regex replace, since block tags cannot
    //   contain anything besides the block content marker.
    //
    // Two notes:
    // - The outermost loop through top-level tokens should never encounter any
    //   top-level close tags, because we should have first encountered a
    //   matching top-level open tag, all inner tags should have appeared in
    //   matching pairs and been skipped, and then we should have skipped the
    //   close tag in question.
    // - All open tags should have matching close tags, which means our inner
    //   loop should always encounter a close tag and drop nesting to 0. If
    //   a close tag is missing, the loop will continue until i >= tokens.length
    //   and token becomes undefined. This will not infinite loop, even in
    //   production without pray(), because it will then TypeError on .slice().

    var cmd = this;
    var blocks = cmd.blocks;
    var cmdId = ' mathquill-command-id=' + cmd.id;
    var tokens = cmd.htmlTemplate.match(/<[^<>]+>|[^<>]+/g);

    pray('no unmatched angle brackets', tokens.join('') === this.htmlTemplate);

    // add cmdId to all top-level tags
    for (var i = 0, token = tokens[0]; token; i += 1, token = tokens[i]) {
      // top-level self-closing tags
      if (token.slice(-2) === '/>') {
        tokens[i] = token.slice(0,-2) + cmdId + '/>';
      }
      // top-level open tags
      else if (token.charAt(0) === '<') {
        pray('not an unmatched top-level close tag', token.charAt(1) !== '/');

        tokens[i] = token.slice(0,-1) + cmdId + '>';

        // skip matching top-level close tag and all tag pairs in between
        var nesting = 1;
        do {
          i += 1, token = tokens[i];
          pray('no missing close tags', token);
          // close tags
          if (token.slice(0,2) === '</') {
            nesting -= 1;
          }
          // non-self-closing open tags
          else if (token.charAt(0) === '<' && token.slice(-2) !== '/>') {
            nesting += 1;
          }
        } while (nesting > 0);
      }
    }
    return tokens.join('').replace(/>&(\\d+)/g, function($0, $1) {
      return ' mathquill-block-id=' + blocks[$1].id + '>' + blocks[$1].join('html');
    });
  };

  // methods to export a string representation of the math tree
  _.latex = function() {
    return this.foldChildren(this.ctrlSeq, function(latex, child) {
      return latex + '{' + (child.latex() || ' ') + '}';
    });
  };
  _.textTemplate = [''];
  _.text = function() {
    var cmd = this, i = 0;
    return cmd.foldChildren(cmd.textTemplate[i], function(text, child) {
      i += 1;
      var child_text = child.text();
      if (text && cmd.textTemplate[i] === '('
          && child_text[0] === '(' && child_text.slice(-1) === ')')
        return text + child_text.slice(1, -1) + cmd.textTemplate[i];
      return text + child_text + (cmd.textTemplate[i] || '');
    });
  };
});

/**
 * Lightweight command without blocks or children.
 */
var Symbol = P(MathCommand, function(_, super_) {
  _.init = function(ctrlSeq, html, text) {
    if (!text) text = ctrlSeq && ctrlSeq.length > 1 ? ctrlSeq.slice(1) : ctrlSeq;

    super_.init.call(this, ctrlSeq, html, [ text ]);
  };

  _.parser = function() { return Parser.succeed(this); };
  _.numBlocks = function() { return 0; };

  _.replaces = function(replacedFragment) {
    replacedFragment.remove();
  };
  _.createBlocks = noop;

  _.moveTowards = function(dir, cursor) {
    cursor.jQ.insDirOf(dir, this.jQ);
    cursor[-dir] = this;
    cursor[dir] = this[dir];
  };
  _.deleteTowards = function(dir, cursor) {
    cursor[dir] = this.remove()[dir];
  };
  _.seek = function(pageX, cursor) {
    // insert at whichever side the click was closer to
    if (pageX - this.jQ.offset().left < this.jQ.outerWidth()/2)
      cursor.insLeftOf(this);
    else
      cursor.insRightOf(this);
  };

  _.latex = function(){ return this.ctrlSeq; };
  _.text = function(){ return this.textTemplate; };
  _.placeCursor = noop;
  _.isEmpty = function(){ return true; };
});
var VanillaSymbol = P(Symbol, function(_, super_) {
  _.init = function(ch, html) {
    super_.init.call(this, ch, '<span>'+(html || ch)+'</span>');
  };
});
var BinaryOperator = P(Symbol, function(_, super_) {
  _.init = function(ctrlSeq, html, text) {
    super_.init.call(this,
      ctrlSeq, '<span class="mq-binary-operator">'+html+'</span>', text
    );
  };
});

/**
 * Children and parent of MathCommand's. Basically partitions all the
 * symbols and operators that descend (in the Math DOM tree) from
 * ancestor operators.
 */
var MathBlock = P(MathElement, function(_, super_) {
  _.join = function(methodName) {
    return this.foldChildren('', function(fold, child) {
      return fold + child[methodName]();
    });
  };
  _.html = function() { return this.join('html'); };
  _.latex = function() { return this.join('latex'); };
  _.text = function() {
    return (this.ends[L] === this.ends[R] && this.ends[L] !== 0) ?
      this.ends[L].text() :
      this.join('text')
    ;
  };

  _.keystroke = function(key, e, ctrlr) {
    if (ctrlr.options.spaceBehavesLikeTab
        && (key === 'Spacebar' || key === 'Shift-Spacebar')) {
      e.preventDefault();
      ctrlr.escapeDir(key === 'Shift-Spacebar' ? L : R, key, e);
      return;
    }
    return super_.keystroke.apply(this, arguments);
  };

  // editability methods: called by the cursor for editing, cursor movements,
  // and selection of the MathQuill tree, these all take in a direction and
  // the cursor
  _.moveOutOf = function(dir, cursor, updown) {
    var updownInto = updown && this.parent[updown+'Into'];
    if (!updownInto && this[dir]) cursor.insAtDirEnd(-dir, this[dir]);
    else cursor.insDirOf(dir, this.parent);
  };
  _.selectOutOf = function(dir, cursor) {
    cursor.insDirOf(dir, this.parent);
  };
  _.deleteOutOf = function(dir, cursor) {
    cursor.unwrapGramp();
  };
  _.seek = function(pageX, cursor) {
    var node = this.ends[R];
    if (!node || node.jQ.offset().left + node.jQ.outerWidth() < pageX) {
      return cursor.insAtRightEnd(this);
    }
    if (pageX < this.ends[L].jQ.offset().left) return cursor.insAtLeftEnd(this);
    while (pageX < node.jQ.offset().left) node = node[L];
    return node.seek(pageX, cursor);
  };
  _.chToCmd = function(ch, options) {
    var cons;
    // exclude f because it gets a dedicated command with more spacing
    if (ch.match(/^[a-eg-zA-Z]$/))
      return Letter(ch);
    else if (/^\\d$/.test(ch))
      return Digit(ch);
    else if (options && options.typingSlashWritesDivisionSymbol && ch === '/')
      return LatexCmds['\\u00f7'](ch);
    else if (options && options.typingAsteriskWritesTimesSymbol && ch === '*')
      return LatexCmds['\\u00d7'](ch);
    else if (cons = CharCmds[ch] || LatexCmds[ch])
      return cons(ch);
    else
      return VanillaSymbol(ch);
  };
  _.write = function(cursor, ch) {
    var cmd = this.chToCmd(ch, cursor.options);
    if (cursor.selection) cmd.replaces(cursor.replaceSelection());
    if (!cursor.isTooDeep()) {
      cmd.createLeftOf(cursor.show());
    }
  };

  _.focus = function() {
    this.jQ.addClass('mq-hasCursor');
    this.jQ.removeClass('mq-empty');

    return this;
  };
  _.blur = function() {
    this.jQ.removeClass('mq-hasCursor');
    if (this.isEmpty())
      this.jQ.addClass('mq-empty');

    return this;
  };
});

Options.p.mouseEvents = true;
API.StaticMath = function(APIClasses) {
  return P(APIClasses.AbstractMathQuill, function(_, super_) {
    this.RootBlock = MathBlock;
    _.__mathquillify = function(opts, interfaceVersion) {
      this.config(opts);
      super_.__mathquillify.call(this, 'mq-math-mode');
      if (this.__options.mouseEvents) {
        this.__controller.delegateMouseEvents();
        this.__controller.staticMathTextareaEvents();
      }
      return this;
    };
    _.init = function() {
      super_.init.apply(this, arguments);
      this.__controller.root.postOrder(
        'registerInnerField', this.innerFields = [], APIClasses.MathField);
    };
    _.latex = function() {
      var returned = super_.latex.apply(this, arguments);
      if (arguments.length > 0) {
        this.__controller.root.postOrder(
          'registerInnerField', this.innerFields = [], APIClasses.MathField);
      }
      return returned;
    };
  });
};

var RootMathBlock = P(MathBlock, RootBlockMixin);
API.MathField = function(APIClasses) {
  return P(APIClasses.EditableField, function(_, super_) {
    this.RootBlock = RootMathBlock;
    _.__mathquillify = function(opts, interfaceVersion) {
      this.config(opts);
      if (interfaceVersion > 1) this.__controller.root.reflow = noop;
      super_.__mathquillify.call(this, 'mq-editable-field mq-math-mode');
      delete this.__controller.root.reflow;
      return this;
    };
  });
};
/*************************************************
 * Abstract classes of text blocks
 ************************************************/

/**
 * Blocks of plain text, with one or two TextPiece's as children.
 * Represents flat strings of typically serif-font Roman characters, as
 * opposed to hierchical, nested, tree-structured math.
 * Wraps a single HTMLSpanElement.
 */
var TextBlock = P(Node, function(_, super_) {
  _.ctrlSeq = '\\\\text';

  _.replaces = function(replacedText) {
    if (replacedText instanceof Fragment)
      this.replacedText = replacedText.remove().jQ.text();
    else if (typeof replacedText === 'string')
      this.replacedText = replacedText;
  };

  _.jQadd = function(jQ) {
    super_.jQadd.call(this, jQ);
    if (this.ends[L]) this.ends[L].jQadd(this.jQ[0].firstChild);
  };

  _.createLeftOf = function(cursor) {
    var textBlock = this;
    super_.createLeftOf.call(this, cursor);

    if (textBlock[R].siblingCreated) textBlock[R].siblingCreated(cursor.options, L);
    if (textBlock[L].siblingCreated) textBlock[L].siblingCreated(cursor.options, R);
    textBlock.bubble('reflow');

    cursor.insAtRightEnd(textBlock);

    if (textBlock.replacedText)
      for (var i = 0; i < textBlock.replacedText.length; i += 1)
        textBlock.write(cursor, textBlock.replacedText.charAt(i));
  };

  _.parser = function() {
    var textBlock = this;

    // TODO: correctly parse text mode
    var string = Parser.string;
    var regex = Parser.regex;
    var optWhitespace = Parser.optWhitespace;
    return optWhitespace
      .then(string('{')).then(regex(/^[^}]*/)).skip(string('}'))
      .map(function(text) {
        if (text.length === 0) return Fragment();

        TextPiece(text).adopt(textBlock, 0, 0);
        return textBlock;
      })
    ;
  };

  _.textContents = function() {
    return this.foldChildren('', function(text, child) {
      return text + child.text;
    });
  };
  _.text = function() { return '"' + this.textContents() + '"'; };
  _.latex = function() {
    var contents = this.textContents();
    if (contents.length === 0) return '';
    return '\\\\text{' + contents.replace(/\\\\/g, '\\\\backslash ').replace(/[{}]/g, '\\\\$&') + '}';
  };
  _.html = function() {
    return (
        '<span class="mq-text-mode" mathquill-command-id='+this.id+'>'
      +   this.textContents()
      + '</span>'
    );
  };

  // editability methods: called by the cursor for editing, cursor movements,
  // and selection of the MathQuill tree, these all take in a direction and
  // the cursor
  _.moveTowards = function(dir, cursor) { cursor.insAtDirEnd(-dir, this); };
  _.moveOutOf = function(dir, cursor) { cursor.insDirOf(dir, this); };
  _.unselectInto = _.moveTowards;

  // TODO: make these methods part of a shared mixin or something.
  _.selectTowards = MathCommand.prototype.selectTowards;
  _.deleteTowards = MathCommand.prototype.deleteTowards;

  _.selectOutOf = function(dir, cursor) {
    cursor.insDirOf(dir, this);
  };
  _.deleteOutOf = function(dir, cursor) {
    // backspace and delete at ends of block don't unwrap
    if (this.isEmpty()) cursor.insRightOf(this);
  };
  _.write = function(cursor, ch) {
    cursor.show().deleteSelection();

    if (ch !== '$') {
      if (!cursor[L]) TextPiece(ch).createLeftOf(cursor);
      else cursor[L].appendText(ch);
    }
    else if (this.isEmpty()) {
      cursor.insRightOf(this);
      VanillaSymbol('\\\\$','$').createLeftOf(cursor);
    }
    else if (!cursor[R]) cursor.insRightOf(this);
    else if (!cursor[L]) cursor.insLeftOf(this);
    else { // split apart
      var leftBlock = TextBlock();
      var leftPc = this.ends[L];
      leftPc.disown().jQ.detach();
      leftPc.adopt(leftBlock, 0, 0);

      cursor.insLeftOf(this);
      super_.createLeftOf.call(leftBlock, cursor);
    }
  };

  _.seek = function(pageX, cursor) {
    cursor.hide();
    var textPc = fuseChildren(this);

    // insert cursor at approx position in DOMTextNode
    var avgChWidth = this.jQ.width()/this.text.length;
    var approxPosition = Math.round((pageX - this.jQ.offset().left)/avgChWidth);
    if (approxPosition <= 0) cursor.insAtLeftEnd(this);
    else if (approxPosition >= textPc.text.length) cursor.insAtRightEnd(this);
    else cursor.insLeftOf(textPc.splitRight(approxPosition));

    // move towards mousedown (pageX)
    var displ = pageX - cursor.show().offset().left; // displacement
    var dir = displ && displ < 0 ? L : R;
    var prevDispl = dir;
    // displ * prevDispl > 0 iff displacement direction === previous direction
    while (cursor[dir] && displ * prevDispl > 0) {
      cursor[dir].moveTowards(dir, cursor);
      prevDispl = displ;
      displ = pageX - cursor.offset().left;
    }
    if (dir*displ < -dir*prevDispl) cursor[-dir].moveTowards(-dir, cursor);

    if (!cursor.anticursor) {
      // about to start mouse-selecting, the anticursor is gonna get put here
      this.anticursorPosition = cursor[L] && cursor[L].text.length;
      // ^ get it? 'cos if there's no cursor[L], it's 0... I'm a terrible person.
    }
    else if (cursor.anticursor.parent === this) {
      // mouse-selecting within this TextBlock, re-insert the anticursor
      var cursorPosition = cursor[L] && cursor[L].text.length;;
      if (this.anticursorPosition === cursorPosition) {
        cursor.anticursor = Point.copy(cursor);
      }
      else {
        if (this.anticursorPosition < cursorPosition) {
          var newTextPc = cursor[L].splitRight(this.anticursorPosition);
          cursor[L] = newTextPc;
        }
        else {
          var newTextPc = cursor[R].splitRight(this.anticursorPosition - cursorPosition);
        }
        cursor.anticursor = Point(this, newTextPc[L], newTextPc);
      }
    }
  };

  _.blur = function(cursor) {
    MathBlock.prototype.blur.call(this);
    if (!cursor) return;
    if (this.textContents() === '') {
      this.remove();
      if (cursor[L] === this) cursor[L] = this[L];
      else if (cursor[R] === this) cursor[R] = this[R];
    }
    else fuseChildren(this);
  };

  function fuseChildren(self) {
    self.jQ[0].normalize();

    var textPcDom = self.jQ[0].firstChild;
    if (!textPcDom) return;
    pray('only node in TextBlock span is Text node', textPcDom.nodeType === 3);
    // nodeType === 3 has meant a Text node since ancient times:
    //   http://reference.sitepoint.com/javascript/Node/nodeType

    var textPc = TextPiece(textPcDom.data);
    textPc.jQadd(textPcDom);

    self.children().disown();
    return textPc.adopt(self, 0, 0);
  }

  _.focus = MathBlock.prototype.focus;
});

/**
 * Piece of plain text, with a TextBlock as a parent and no children.
 * Wraps a single DOMTextNode.
 * For convenience, has a .text property that's just a JavaScript string
 * mirroring the text contents of the DOMTextNode.
 * Text contents must always be nonempty.
 */
var TextPiece = P(Node, function(_, super_) {
  _.init = function(text) {
    super_.init.call(this);
    this.text = text;
  };
  _.jQadd = function(dom) { this.dom = dom; this.jQ = $(dom); };
  _.jQize = function() {
    return this.jQadd(document.createTextNode(this.text));
  };
  _.appendText = function(text) {
    this.text += text;
    this.dom.appendData(text);
  };
  _.prependText = function(text) {
    this.text = text + this.text;
    this.dom.insertData(0, text);
  };
  _.insTextAtDirEnd = function(text, dir) {
    prayDirection(dir);
    if (dir === R) this.appendText(text);
    else this.prependText(text);
  };
  _.splitRight = function(i) {
    var newPc = TextPiece(this.text.slice(i)).adopt(this.parent, this, this[R]);
    newPc.jQadd(this.dom.splitText(i));
    this.text = this.text.slice(0, i);
    return newPc;
  };

  function endChar(dir, text) {
    return text.charAt(dir === L ? 0 : -1 + text.length);
  }

  _.moveTowards = function(dir, cursor) {
    prayDirection(dir);

    var ch = endChar(-dir, this.text)

    var from = this[-dir];
    if (from) from.insTextAtDirEnd(ch, dir);
    else TextPiece(ch).createDir(-dir, cursor);

    return this.deleteTowards(dir, cursor);
  };

  _.latex = function() { return this.text; };

  _.deleteTowards = function(dir, cursor) {
    if (this.text.length > 1) {
      if (dir === R) {
        this.dom.deleteData(0, 1);
        this.text = this.text.slice(1);
      }
      else {
        // note that the order of these 2 lines is annoyingly important
        // (the second line mutates this.text.length)
        this.dom.deleteData(-1 + this.text.length, 1);
        this.text = this.text.slice(0, -1);
      }
    }
    else {
      this.remove();
      this.jQ.remove();
      cursor[dir] = this[dir];
    }
  };

  _.selectTowards = function(dir, cursor) {
    prayDirection(dir);
    var anticursor = cursor.anticursor;

    var ch = endChar(-dir, this.text)

    if (anticursor[dir] === this) {
      var newPc = TextPiece(ch).createDir(dir, cursor);
      anticursor[dir] = newPc;
      cursor.insDirOf(dir, newPc);
    }
    else {
      var from = this[-dir];
      if (from) from.insTextAtDirEnd(ch, dir);
      else {
        var newPc = TextPiece(ch).createDir(-dir, cursor);
        newPc.jQ.insDirOf(-dir, cursor.selection.jQ);
      }

      if (this.text.length === 1 && anticursor[-dir] === this) {
        anticursor[-dir] = this[-dir]; // \`this\` will be removed in deleteTowards
      }
    }

    return this.deleteTowards(dir, cursor);
  };
});

LatexCmds.text =
LatexCmds.textnormal =
LatexCmds.textrm =
LatexCmds.textup =
LatexCmds.textmd = TextBlock;

function makeTextBlock(latex, tagName, attrs) {
  return P(TextBlock, {
    ctrlSeq: latex,
    htmlTemplate: '<'+tagName+' '+attrs+'>&0</'+tagName+'>'
  });
}

LatexCmds.em = LatexCmds.italic = LatexCmds.italics =
LatexCmds.emph = LatexCmds.textit = LatexCmds.textsl =
  makeTextBlock('\\\\textit', 'i', 'class="mq-text-mode"');
LatexCmds.strong = LatexCmds.bold = LatexCmds.textbf =
  makeTextBlock('\\\\textbf', 'b', 'class="mq-text-mode"');
LatexCmds.sf = LatexCmds.textsf =
  makeTextBlock('\\\\textsf', 'span', 'class="mq-sans-serif mq-text-mode"');
LatexCmds.tt = LatexCmds.texttt =
  makeTextBlock('\\\\texttt', 'span', 'class="mq-monospace mq-text-mode"');
LatexCmds.textsc =
  makeTextBlock('\\\\textsc', 'span', 'style="font-variant:small-caps" class="mq-text-mode"');
LatexCmds.uppercase =
  makeTextBlock('\\\\uppercase', 'span', 'style="text-transform:uppercase" class="mq-text-mode"');
LatexCmds.lowercase =
  makeTextBlock('\\\\lowercase', 'span', 'style="text-transform:lowercase" class="mq-text-mode"');


var RootMathCommand = P(MathCommand, function(_, super_) {
  _.init = function(cursor) {
    super_.init.call(this, '$');
    this.cursor = cursor;
  };
  _.htmlTemplate = '<span class="mq-math-mode">&0</span>';
  _.createBlocks = function() {
    super_.createBlocks.call(this);

    this.ends[L].cursor = this.cursor;
    this.ends[L].write = function(cursor, ch) {
      if (ch !== '$')
        MathBlock.prototype.write.call(this, cursor, ch);
      else if (this.isEmpty()) {
        cursor.insRightOf(this.parent);
        this.parent.deleteTowards(dir, cursor);
        VanillaSymbol('\\\\$','$').createLeftOf(cursor.show());
      }
      else if (!cursor[R])
        cursor.insRightOf(this.parent);
      else if (!cursor[L])
        cursor.insLeftOf(this.parent);
      else
        MathBlock.prototype.write.call(this, cursor, ch);
    };
  };
  _.latex = function() {
    return '$' + this.ends[L].latex() + '$';
  };
});

var RootTextBlock = P(RootMathBlock, function(_, super_) {
  _.keystroke = function(key) {
    if (key === 'Spacebar' || key === 'Shift-Spacebar') return;
    return super_.keystroke.apply(this, arguments);
  };
  _.write = function(cursor, ch) {
    cursor.show().deleteSelection();
    if (ch === '$')
      RootMathCommand(cursor).createLeftOf(cursor);
    else {
      var html;
      if (ch === '<') html = '&lt;';
      else if (ch === '>') html = '&gt;';
      VanillaSymbol(ch, html).createLeftOf(cursor);
    }
  };
});
API.TextField = function(APIClasses) {
  return P(APIClasses.EditableField, function(_, super_) {
    this.RootBlock = RootTextBlock;
    _.__mathquillify = function() {
      return super_.__mathquillify.call(this, 'mq-editable-field mq-text-mode');
    };
    _.latex = function(latex) {
      if (arguments.length > 0) {
        this.__controller.renderLatexText(latex);
        if (this.__controller.blurred) this.__controller.cursor.hide().parent.blur();
        return this;
      }
      return this.__controller.exportLatex();
    };
  });
};
/****************************************
 * Input box to type backslash commands
 ***************************************/

var LatexCommandInput =
CharCmds['\\\\'] = P(MathCommand, function(_, super_) {
  _.ctrlSeq = '\\\\';
  _.replaces = function(replacedFragment) {
    this._replacedFragment = replacedFragment.disown();
    this.isEmpty = function() { return false; };
  };
  _.htmlTemplate = '<span class="mq-latex-command-input mq-non-leaf">\\\\<span>&0</span></span>';
  _.textTemplate = ['\\\\'];
  _.createBlocks = function() {
    super_.createBlocks.call(this);
    this.ends[L].focus = function() {
      this.parent.jQ.addClass('mq-hasCursor');
      if (this.isEmpty())
        this.parent.jQ.removeClass('mq-empty');

      return this;
    };
    this.ends[L].blur = function() {
      this.parent.jQ.removeClass('mq-hasCursor');
      if (this.isEmpty())
        this.parent.jQ.addClass('mq-empty');

      return this;
    };
    this.ends[L].write = function(cursor, ch) {
      cursor.show().deleteSelection();

      if (ch.match(/[a-z]/i)) VanillaSymbol(ch).createLeftOf(cursor);
      else {
        this.parent.renderCommand(cursor);
        if (ch !== '\\\\' || !this.isEmpty()) cursor.parent.write(cursor, ch);
      }
    };
    this.ends[L].keystroke = function(key, e, ctrlr) {
      if (key === 'Tab' || key === 'Enter' || key === 'Spacebar') {
        this.parent.renderCommand(ctrlr.cursor);
        e.preventDefault();
        return;
      }
      return super_.keystroke.apply(this, arguments);
    };
  };
  _.createLeftOf = function(cursor) {
    super_.createLeftOf.call(this, cursor);

    if (this._replacedFragment) {
      var el = this.jQ[0];
      this.jQ =
        this._replacedFragment.jQ.addClass('mq-blur').bind(
          'mousedown mousemove', //FIXME: is monkey-patching the mousedown and mousemove handlers the right way to do this?
          function(e) {
            $(e.target = el).trigger(e);
            return false;
          }
        ).insertBefore(this.jQ).add(this.jQ);
    }
  };
  _.latex = function() {
    return '\\\\' + this.ends[L].latex() + ' ';
  };
  _.renderCommand = function(cursor) {
    this.jQ = this.jQ.last();
    this.remove();
    if (this[R]) {
      cursor.insLeftOf(this[R]);
    } else {
      cursor.insAtRightEnd(this.parent);
    }

    var latex = this.ends[L].latex();
    if (!latex) latex = ' ';
    var cmd = LatexCmds[latex];
    if (cmd) {
      cmd = cmd(latex);
      if (this._replacedFragment) cmd.replaces(this._replacedFragment);
      cmd.createLeftOf(cursor);
    }
    else {
      cmd = TextBlock();
      cmd.replaces(latex);
      cmd.createLeftOf(cursor);
      cursor.insRightOf(cmd);
      if (this._replacedFragment)
        this._replacedFragment.remove();
    }
  };
});

/***************************
 * Commands and Operators.
 **************************/

var scale, // = function(jQ, x, y) { ... }
//will use a CSS 2D transform to scale the jQuery-wrapped HTML elements,
//or the filter matrix transform fallback for IE 5.5-8, or gracefully degrade to
//increasing the fontSize to match the vertical Y scaling factor.

//ideas from http://github.com/louisremi/jquery.transform.js
//see also http://msdn.microsoft.com/en-us/library/ms533014(v=vs.85).aspx

  forceIERedraw = noop,
  div = document.createElement('div'),
  div_style = div.style,
  transformPropNames = {
    transform:1,
    WebkitTransform:1,
    MozTransform:1,
    OTransform:1,
    msTransform:1
  },
  transformPropName;

for (var prop in transformPropNames) {
  if (prop in div_style) {
    transformPropName = prop;
    break;
  }
}

if (transformPropName) {
  scale = function(jQ, x, y) {
    jQ.css(transformPropName, 'scale('+x+','+y+')');
  };
}
else if ('filter' in div_style) { //IE 6, 7, & 8 fallback, see https://github.com/laughinghan/mathquill/wiki/Transforms
  forceIERedraw = function(el){ el.className = el.className; };
  scale = function(jQ, x, y) { //NOTE: assumes y > x
    x /= (1+(y-1)/2);
    jQ.css('fontSize', y + 'em');
    if (!jQ.hasClass('mq-matrixed-container')) {
      jQ.addClass('mq-matrixed-container')
      .wrapInner('<span class="mq-matrixed"></span>');
    }
    var innerjQ = jQ.children()
    .css('filter', 'progid:DXImageTransform.Microsoft'
        + '.Matrix(M11=' + x + ",SizingMethod='auto expand')"
    );
    function calculateMarginRight() {
      jQ.css('marginRight', (innerjQ.width()-1)*(x-1)/x + 'px');
    }
    calculateMarginRight();
    var intervalId = setInterval(calculateMarginRight);
    $(window).load(function() {
      clearTimeout(intervalId);
      calculateMarginRight();
    });
  };
}
else {
  scale = function(jQ, x, y) {
    jQ.css('fontSize', y + 'em');
  };
}

var Style = P(MathCommand, function(_, super_) {
  _.init = function(ctrlSeq, tagName, attrs) {
    super_.init.call(this, ctrlSeq, '<'+tagName+' '+attrs+'>&0</'+tagName+'>');
  };
});

//fonts
LatexCmds.mathrm = bind(Style, '\\\\mathrm', 'span', 'class="mq-roman mq-font"');
LatexCmds.mathit = bind(Style, '\\\\mathit', 'i', 'class="mq-font"');
LatexCmds.mathbf = bind(Style, '\\\\mathbf', 'b', 'class="mq-font"');
LatexCmds.mathsf = bind(Style, '\\\\mathsf', 'span', 'class="mq-sans-serif mq-font"');
LatexCmds.mathtt = bind(Style, '\\\\mathtt', 'span', 'class="mq-monospace mq-font"');
//text-decoration
LatexCmds.underline = bind(Style, '\\\\underline', 'span', 'class="mq-non-leaf mq-underline"');
LatexCmds.overline = LatexCmds.bar = bind(Style, '\\\\overline', 'span', 'class="mq-non-leaf mq-overline"');
LatexCmds.overrightarrow = bind(Style, '\\\\overrightarrow', 'span', 'class="mq-non-leaf mq-overarrow mq-arrow-right"');
LatexCmds.overleftarrow = bind(Style, '\\\\overleftarrow', 'span', 'class="mq-non-leaf mq-overarrow mq-arrow-left"');
LatexCmds.overleftrightarrow = bind(Style, '\\\\overleftrightarrow', 'span', 'class="mq-non-leaf mq-overarrow mq-arrow-both"');
LatexCmds.overarc = bind(Style, '\\\\overarc', 'span', 'class="mq-non-leaf mq-overarc"');
LatexCmds.dot = P(MathCommand, function(_, super_) {
    _.init = function() {
        super_.init.call(this, '\\\\dot', '<span class="mq-non-leaf"><span class="mq-dot-recurring-inner">'
            + '<span class="mq-dot-recurring">&#x2d9;</span>'
            + '<span class="mq-empty-box">&0</span>'
            + '</span></span>'
        );
    };
});

// \`\\textcolor{color}{math}\` will apply a color to the given math content, where
// \`color\` is any valid CSS Color Value (see [SitePoint docs][] (recommended),
// [Mozilla docs][], or [W3C spec][]).
//
// [SitePoint docs]: http://reference.sitepoint.com/css/colorvalues
// [Mozilla docs]: https://developer.mozilla.org/en-US/docs/CSS/color_value#Values
// [W3C spec]: http://dev.w3.org/csswg/css3-color/#colorunits
var TextColor = LatexCmds.textcolor = P(MathCommand, function(_, super_) {
  _.setColor = function(color) {
    this.color = color;
    this.htmlTemplate =
      '<span class="mq-textcolor" style="color:' + color + '">&0</span>';
  };
  _.latex = function() {
    return '\\\\textcolor{' + this.color + '}{' + this.blocks[0].latex() + '}';
  };
  _.parser = function() {
    var self = this;
    var optWhitespace = Parser.optWhitespace;
    var string = Parser.string;
    var regex = Parser.regex;

    return optWhitespace
      .then(string('{'))
      .then(regex(/^[#\\w\\s.,()%-]*/))
      .skip(string('}'))
      .then(function(color) {
        self.setColor(color);
        return super_.parser.call(self);
      })
    ;
  };
  _.isStyleBlock = function() {
    return true;
  };
});

// Very similar to the \\textcolor command, but will add the given CSS class.
// Usage: \\class{classname}{math}
// Note regex that whitelists valid CSS classname characters:
// https://github.com/mathquill/mathquill/pull/191#discussion_r4327442
var Class = LatexCmds['class'] = P(MathCommand, function(_, super_) {
  _.parser = function() {
    var self = this, string = Parser.string, regex = Parser.regex;
    return Parser.optWhitespace
      .then(string('{'))
      .then(regex(/^[-\\w\\s\\\\\\xA0-\\xFF]*/))
      .skip(string('}'))
      .then(function(cls) {
        self.cls = cls || '';
        self.htmlTemplate = '<span class="mq-class '+cls+'">&0</span>';
        return super_.parser.call(self);
      })
    ;
  };
  _.latex = function() {
    return '\\\\class{' + this.cls + '}{' + this.blocks[0].latex() + '}';
  };
  _.isStyleBlock = function() {
    return true;
  };
});

var SupSub = P(MathCommand, function(_, super_) {
  _.ctrlSeq = '_{...}^{...}';
  _.createLeftOf = function(cursor) {
    if (!this.replacedFragment && !cursor[L] && cursor.options.supSubsRequireOperand) return;
    return super_.createLeftOf.apply(this, arguments);
  };
  _.contactWeld = function(cursor) {
    // Look on either side for a SupSub, if one is found compare my
    // .sub, .sup with its .sub, .sup. If I have one that it doesn't,
    // then call .addBlock() on it with my block; if I have one that
    // it also has, then insert my block's children into its block,
    // unless my block has none, in which case insert the cursor into
    // its block (and not mine, I'm about to remove myself) in the case
    // I was just typed.
    // TODO: simplify

    // equiv. to [L, R].forEach(function(dir) { ... });
    for (var dir = L; dir; dir = (dir === L ? R : false)) {
      if (this[dir] instanceof SupSub) {
        // equiv. to 'sub sup'.split(' ').forEach(function(supsub) { ... });
        for (var supsub = 'sub'; supsub; supsub = (supsub === 'sub' ? 'sup' : false)) {
          var src = this[supsub], dest = this[dir][supsub];
          if (!src) continue;
          if (!dest) this[dir].addBlock(src.disown());
          else if (!src.isEmpty()) { // ins src children at -dir end of dest
            src.jQ.children().insAtDirEnd(-dir, dest.jQ);
            var children = src.children().disown();
            var pt = Point(dest, children.ends[R], dest.ends[L]);
            if (dir === L) children.adopt(dest, dest.ends[R], 0);
            else children.adopt(dest, 0, dest.ends[L]);
          }
          else var pt = Point(dest, 0, dest.ends[L]);
          this.placeCursor = (function(dest, src) { // TODO: don't monkey-patch
            return function(cursor) { cursor.insAtDirEnd(-dir, dest || src); };
          }(dest, src));
        }
        this.remove();
        if (cursor && cursor[L] === this) {
          if (dir === R && pt) {
            pt[L] ? cursor.insRightOf(pt[L]) : cursor.insAtLeftEnd(pt.parent);
          }
          else cursor.insRightOf(this[dir]);
        }
        break;
      }
    }
  };
  Options.p.charsThatBreakOutOfSupSub = '';
  _.finalizeTree = function() {
    this.ends[L].write = function(cursor, ch) {
      if (cursor.options.autoSubscriptNumerals && this === this.parent.sub) {
        if (ch === '_') return;
        var cmd = this.chToCmd(ch, cursor.options);
        if (cmd instanceof Symbol) cursor.deleteSelection();
        else cursor.clearSelection().insRightOf(this.parent);
        return cmd.createLeftOf(cursor.show());
      }
      if (cursor[L] && !cursor[R] && !cursor.selection
          && cursor.options.charsThatBreakOutOfSupSub.indexOf(ch) > -1) {
        cursor.insRightOf(this.parent);
      }
      MathBlock.p.write.apply(this, arguments);
    };
  };
  _.moveTowards = function(dir, cursor, updown) {
    if (cursor.options.autoSubscriptNumerals && !this.sup) {
      cursor.insDirOf(dir, this);
    }
    else super_.moveTowards.apply(this, arguments);
  };
  _.deleteTowards = function(dir, cursor) {
    if (cursor.options.autoSubscriptNumerals && this.sub) {
      var cmd = this.sub.ends[-dir];
      if (cmd instanceof Symbol) cmd.remove();
      else if (cmd) cmd.deleteTowards(dir, cursor.insAtDirEnd(-dir, this.sub));

      // TODO: factor out a .removeBlock() or something
      if (this.sub.isEmpty()) {
        this.sub.deleteOutOf(L, cursor.insAtLeftEnd(this.sub));
        if (this.sup) cursor.insDirOf(-dir, this);
        // Note \`-dir\` because in e.g. x_1^2| want backspacing (leftward)
        // to delete the 1 but to end up rightward of x^2; with non-negated
        // \`dir\` (try it), the cursor appears to have gone "through" the ^2.
      }
    }
    else super_.deleteTowards.apply(this, arguments);
  };
  _.latex = function() {
    function latex(prefix, block) {
      var l = block && block.latex();
      return block ? prefix + (l.length === 1 ? l : '{' + (l || ' ') + '}') : '';
    }
    return latex('_', this.sub) + latex('^', this.sup);
  };
  _.addBlock = function(block) {
    if (this.supsub === 'sub') {
      this.sup = this.upInto = this.sub.upOutOf = block;
      block.adopt(this, this.sub, 0).downOutOf = this.sub;
      block.jQ = $('<span class="mq-sup"/>').append(block.jQ.children())
        .attr(mqBlockId, block.id).prependTo(this.jQ);
    }
    else {
      this.sub = this.downInto = this.sup.downOutOf = block;
      block.adopt(this, 0, this.sup).upOutOf = this.sup;
      block.jQ = $('<span class="mq-sub"></span>').append(block.jQ.children())
        .attr(mqBlockId, block.id).appendTo(this.jQ.removeClass('mq-sup-only'));
      this.jQ.append('<span style="display:inline-block;width:0">&#8203;</span>');
    }
    // like 'sub sup'.split(' ').forEach(function(supsub) { ... });
    for (var i = 0; i < 2; i += 1) (function(cmd, supsub, oppositeSupsub, updown) {
      cmd[supsub].deleteOutOf = function(dir, cursor) {
        cursor.insDirOf((this[dir] ? -dir : dir), this.parent);
        if (!this.isEmpty()) {
          var end = this.ends[dir];
          this.children().disown()
            .withDirAdopt(dir, cursor.parent, cursor[dir], cursor[-dir])
            .jQ.insDirOf(-dir, cursor.jQ);
          cursor[-dir] = end;
        }
        cmd.supsub = oppositeSupsub;
        delete cmd[supsub];
        delete cmd[updown+'Into'];
        cmd[oppositeSupsub][updown+'OutOf'] = insLeftOfMeUnlessAtEnd;
        delete cmd[oppositeSupsub].deleteOutOf;
        if (supsub === 'sub') $(cmd.jQ.addClass('mq-sup-only')[0].lastChild).remove();
        this.remove();
      };
    }(this, 'sub sup'.split(' ')[i], 'sup sub'.split(' ')[i], 'down up'.split(' ')[i]));
  };
  _.reflow = function() {
    var $block = this.jQ ;//mq-supsub
    var $prev = $block.prev() ;

    if ( !$prev.length ) {
        //we cant normalize it without having prev. element (which is base)
        return ;
    }

    var $sup = $block.children( '.mq-sup' );//mq-supsub -> mq-sup
    if ( $sup.length ) {
        var sup_fontsize = parseInt( $sup.css('font-size') ) ;
        var sup_bottom = $sup.offset().top + $sup.height() ;
        //we want that superscript overlaps top of base on 0.7 of its font-size
        //this way small superscripts like x^2 look ok, but big ones like x^(1/2/3) too
        var needed = sup_bottom - $prev.offset().top  - 0.7*sup_fontsize ;
        var cur_margin = parseInt( $sup.css('margin-bottom' ) ) ;
        //we lift it up with margin-bottom
        $sup.css( 'margin-bottom', cur_margin + needed ) ;
    }
  } ;

});

function insLeftOfMeUnlessAtEnd(cursor) {
  // cursor.insLeftOf(cmd), unless cursor at the end of block, and every
  // ancestor cmd is at the end of every ancestor block
  var cmd = this.parent, ancestorCmd = cursor;
  do {
    if (ancestorCmd[R]) return cursor.insLeftOf(cmd);
    ancestorCmd = ancestorCmd.parent.parent;
  } while (ancestorCmd !== cmd);
  cursor.insRightOf(cmd);
}

LatexCmds.subscript =
LatexCmds._ = P(SupSub, function(_, super_) {
  _.supsub = 'sub';
  _.htmlTemplate =
      '<span class="mq-supsub mq-non-leaf">'
    +   '<span class="mq-sub">&0</span>'
    +   '<span style="display:inline-block;width:0">&#8203;</span>'
    + '</span>'
  ;
  _.textTemplate = [ '_' ];
  _.finalizeTree = function() {
    this.downInto = this.sub = this.ends[L];
    this.sub.upOutOf = insLeftOfMeUnlessAtEnd;
    super_.finalizeTree.call(this);
  };
});

LatexCmds.superscript =
LatexCmds.supscript =
LatexCmds['^'] = P(SupSub, function(_, super_) {
  _.supsub = 'sup';
  _.htmlTemplate =
      '<span class="mq-supsub mq-non-leaf mq-sup-only">'
    +   '<span class="mq-sup">&0</span>'
    + '</span>'
  ;
  _.textTemplate = [ '^' ];
  _.finalizeTree = function() {
    this.upInto = this.sup = this.ends[R];
    this.sup.downOutOf = insLeftOfMeUnlessAtEnd;
    super_.finalizeTree.call(this);
  };
});

var SummationNotation = P(MathCommand, function(_, super_) {
  _.init = function(ch, html) {
    var htmlTemplate =
      '<span class="mq-large-operator mq-non-leaf">'
    +   '<span class="mq-to"><span>&1</span></span>'
    +   '<big>'+html+'</big>'
    +   '<span class="mq-from"><span>&0</span></span>'
    + '</span>'
    ;
    Symbol.prototype.init.call(this, ch, htmlTemplate);
  };
  _.createLeftOf = function(cursor) {
    super_.createLeftOf.apply(this, arguments);
    if (cursor.options.sumStartsWithNEquals) {
      Letter('n').createLeftOf(cursor);
      Equality().createLeftOf(cursor);
    }
  };
  _.latex = function() {
    function simplify(latex) {
      return latex.length === 1 ? latex : '{' + (latex || ' ') + '}';
    }
    return this.ctrlSeq + '_' + simplify(this.ends[L].latex()) +
      '^' + simplify(this.ends[R].latex());
  };
  _.parser = function() {
    var string = Parser.string;
    var optWhitespace = Parser.optWhitespace;
    var succeed = Parser.succeed;
    var block = latexMathParser.block;

    var self = this;
    var blocks = self.blocks = [ MathBlock(), MathBlock() ];
    for (var i = 0; i < blocks.length; i += 1) {
      blocks[i].adopt(self, self.ends[R], 0);
    }

    return optWhitespace.then(string('_').or(string('^'))).then(function(supOrSub) {
      var child = blocks[supOrSub === '_' ? 0 : 1];
      return block.then(function(block) {
        block.children().adopt(child, child.ends[R], 0);
        return succeed(self);
      });
    }).many().result(self);
  };
  _.finalizeTree = function() {
    this.downInto = this.ends[L];
    this.upInto = this.ends[R];
    this.ends[L].upOutOf = this.ends[R];
    this.ends[R].downOutOf = this.ends[L];
  };
});

LatexCmds['\\u2211'] =
LatexCmds.sum =
LatexCmds.summation = bind(SummationNotation,'\\\\sum ','&sum;');

LatexCmds['\\u220f'] =
LatexCmds.prod =
LatexCmds.product = bind(SummationNotation,'\\\\prod ','&prod;');

LatexCmds.coprod =
LatexCmds.coproduct = bind(SummationNotation,'\\\\coprod ','&#8720;');

LatexCmds['\\u222b'] =
LatexCmds['int'] =
LatexCmds.integral = P(SummationNotation, function(_, super_) {
  _.init = function() {
    var htmlTemplate =
      '<span class="mq-int mq-non-leaf">'
    +   '<big>&int;</big>'
    +   '<span class="mq-supsub mq-non-leaf">'
    +     '<span class="mq-sup"><span class="mq-sup-inner">&1</span></span>'
    +     '<span class="mq-sub">&0</span>'
    +     '<span style="display:inline-block;width:0">&#8203</span>'
    +   '</span>'
    + '</span>'
    ;
    Symbol.prototype.init.call(this, '\\\\int ', htmlTemplate);
  };
  // FIXME: refactor rather than overriding
  _.createLeftOf = MathCommand.p.createLeftOf;
});

var Fraction =
LatexCmds.frac =
LatexCmds.dfrac =
LatexCmds.cfrac =
LatexCmds.fraction = P(MathCommand, function(_, super_) {
  _.ctrlSeq = '\\\\frac';
  _.htmlTemplate =
      '<span class="mq-fraction mq-non-leaf">'
    +   '<span class="mq-numerator">&0</span>'
    +   '<span class="mq-denominator">&1</span>'
    +   '<span style="display:inline-block;width:0">&#8203;</span>'
    + '</span>'
  ;
  _.textTemplate = ['(', ')/(', ')'];
  _.finalizeTree = function() {
    this.upInto = this.ends[R].upOutOf = this.ends[L];
    this.downInto = this.ends[L].downOutOf = this.ends[R];
  };
});

var LiveFraction =
LatexCmds.over =
CharCmds['/'] = P(Fraction, function(_, super_) {
  _.createLeftOf = function(cursor) {
    if (!this.replacedFragment) {
      var leftward = cursor[L];
      while (leftward &&
        !(
          leftward instanceof BinaryOperator ||
          leftward instanceof (LatexCmds.text || noop) ||
          leftward instanceof SummationNotation ||
          leftward.ctrlSeq === '\\\\ ' ||
          /^[,;:]$/.test(leftward.ctrlSeq)
        ) //lookbehind for operator
      ) leftward = leftward[L];

      if (leftward instanceof SummationNotation && leftward[R] instanceof SupSub) {
        leftward = leftward[R];
        if (leftward[R] instanceof SupSub && leftward[R].ctrlSeq != leftward.ctrlSeq)
          leftward = leftward[R];
      }

      if (leftward !== cursor[L] && !cursor.isTooDeep(1)) {
        this.replaces(Fragment(leftward[R] || cursor.parent.ends[L], cursor[L]));
        cursor[L] = leftward;
      }
    }
    super_.createLeftOf.call(this, cursor);
  };
});

var SquareRoot =
LatexCmds.sqrt =
LatexCmds['\\u221a'] = P(MathCommand, function(_, super_) {
  _.ctrlSeq = '\\\\sqrt';
  _.htmlTemplate =
      '<span class="mq-non-leaf">'
    +   '<span class="mq-scaled mq-sqrt-prefix">&radic;</span>'
    +   '<span class="mq-non-leaf mq-sqrt-stem">&0</span>'
    + '</span>'
  ;
  _.textTemplate = ['sqrt(', ')'];
  _.parser = function() {
    return latexMathParser.optBlock.then(function(optBlock) {
      return latexMathParser.block.map(function(block) {
        var nthroot = NthRoot();
        nthroot.blocks = [ optBlock, block ];
        optBlock.adopt(nthroot, 0, 0);
        block.adopt(nthroot, optBlock, 0);
        return nthroot;
      });
    }).or(super_.parser.call(this));
  };
  _.reflow = function() {
    var block = this.ends[R].jQ;
    scale(block.prev(), 1, block.innerHeight()/+block.css('fontSize').slice(0,-2) - .1);
  };
});

var Hat = LatexCmds.hat = P(MathCommand, function(_, super_) {
  _.ctrlSeq = '\\\\hat';
  _.htmlTemplate =
      '<span class="mq-non-leaf">'
    +   '<span class="mq-hat-prefix">^</span>'
    +   '<span class="mq-hat-stem">&0</span>'
    + '</span>'
  ;
  _.textTemplate = ['hat(', ')'];
});

var NthRoot =
LatexCmds.nthroot = P(SquareRoot, function(_, super_) {
  _.htmlTemplate =
      '<sup class="mq-nthroot mq-non-leaf">&0</sup>'
    + '<span class="mq-scaled">'
    +   '<span class="mq-sqrt-prefix mq-scaled">&radic;</span>'
    +   '<span class="mq-sqrt-stem mq-non-leaf">&1</span>'
    + '</span>'
  ;
  _.textTemplate = ['sqrt[', '](', ')'];
  _.latex = function() {
    return '\\\\sqrt['+this.ends[L].latex()+']{'+this.ends[R].latex()+'}';
  };
});

var DiacriticAbove = P(MathCommand, function(_, super_) {
  _.init = function(ctrlSeq, symbol, textTemplate) {
    var htmlTemplate =
      '<span class="mq-non-leaf">'
      +   '<span class="mq-diacritic-above">'+symbol+'</span>'
      +   '<span class="mq-diacritic-stem">&0</span>'
      + '</span>'
    ;

    super_.init.call(this, ctrlSeq, htmlTemplate, textTemplate);
  };
});
LatexCmds.vec = bind(DiacriticAbove, '\\\\vec', '&rarr;', ['vec(', ')']);
LatexCmds.tilde = bind(DiacriticAbove, '\\\\tilde', '~', ['tilde(', ')']);

function DelimsMixin(_, super_) {
  _.jQadd = function() {
    super_.jQadd.apply(this, arguments);
    this.delimjQs = this.jQ.children(':first').add(this.jQ.children(':last'));
    this.contentjQ = this.jQ.children(':eq(1)');
  };
  _.reflow = function() {
    var height = this.contentjQ.outerHeight()
                 / parseFloat(this.contentjQ.css('fontSize'));
    scale(this.delimjQs, min(1 + .2*(height - 1), 1.2), 1.2*height);
  };
}

// Round/Square/Curly/Angle Brackets (aka Parens/Brackets/Braces)
//   first typed as one-sided bracket with matching "ghost" bracket at
//   far end of current block, until you type an opposing one
var Bracket = P(P(MathCommand, DelimsMixin), function(_, super_) {
  _.init = function(side, open, close, ctrlSeq, end) {
    super_.init.call(this, '\\\\left'+ctrlSeq, undefined, [open, close]);
    this.side = side;
    this.sides = {};
    this.sides[L] = { ch: open, ctrlSeq: ctrlSeq };
    this.sides[R] = { ch: close, ctrlSeq: end };
  };
  _.numBlocks = function() { return 1; };
  _.html = function() { // wait until now so that .side may
    this.htmlTemplate = // be set by createLeftOf or parser
        '<span class="mq-non-leaf">'
      +   '<span class="mq-scaled mq-paren'+(this.side === R ? ' mq-ghost' : '')+'">'
      +     this.sides[L].ch
      +   '</span>'
      +   '<span class="mq-non-leaf">&0</span>'
      +   '<span class="mq-scaled mq-paren'+(this.side === L ? ' mq-ghost' : '')+'">'
      +     this.sides[R].ch
      +   '</span>'
      + '</span>'
    ;
    return super_.html.call(this);
  };
  _.latex = function() {
    return '\\\\left'+this.sides[L].ctrlSeq+this.ends[L].latex()+'\\\\right'+this.sides[R].ctrlSeq;
  };
  _.matchBrack = function(opts, expectedSide, node) {
    // return node iff it's a matching 1-sided bracket of expected side (if any)
    return node instanceof Bracket && node.side && node.side !== -expectedSide
      && (!opts.restrictMismatchedBrackets
        || OPP_BRACKS[this.sides[this.side].ch] === node.sides[node.side].ch
        || { '(': ']', '[': ')' }[this.sides[L].ch] === node.sides[R].ch) && node;
  };
  _.closeOpposing = function(brack) {
    brack.side = 0;
    brack.sides[this.side] = this.sides[this.side]; // copy over my info (may be
    brack.delimjQs.eq(this.side === L ? 0 : 1) // mismatched, like [a, b))
      .removeClass('mq-ghost').html(this.sides[this.side].ch);
  };
  _.createLeftOf = function(cursor) {
    if (!this.replacedFragment) { // unless wrapping seln in brackets,
        // check if next to or inside an opposing one-sided bracket
      var opts = cursor.options;
      if (this.sides[L].ch === '|') { // check both sides if I'm a pipe
        var brack = this.matchBrack(opts, R, cursor[R])
                 || this.matchBrack(opts, L, cursor[L])
                 || this.matchBrack(opts, 0, cursor.parent.parent);
      }
      else {
        var brack = this.matchBrack(opts, -this.side, cursor[-this.side])
                 || this.matchBrack(opts, -this.side, cursor.parent.parent);
      }
    }
    if (brack) {
      var side = this.side = -brack.side; // may be pipe with .side not yet set
      this.closeOpposing(brack);
      if (brack === cursor.parent.parent && cursor[side]) { // move the stuff between
        Fragment(cursor[side], cursor.parent.ends[side], -side) // me and ghost outside
          .disown().withDirAdopt(-side, brack.parent, brack, brack[side])
          .jQ.insDirOf(side, brack.jQ);
      }
      brack.bubble('reflow');
    }
    else {
      brack = this, side = brack.side;
      if (brack.replacedFragment) brack.side = 0; // wrapping seln, don't be one-sided
      else if (cursor[-side]) { // elsewise, auto-expand so ghost is at far end
        brack.replaces(Fragment(cursor[-side], cursor.parent.ends[-side], side));
        cursor[-side] = 0;
      }
      super_.createLeftOf.call(brack, cursor);
    }
    if (side === L) cursor.insAtLeftEnd(brack.ends[L]);
    else cursor.insRightOf(brack);
  };
  _.placeCursor = noop;
  _.unwrap = function() {
    this.ends[L].children().disown().adopt(this.parent, this, this[R])
      .jQ.insertAfter(this.jQ);
    this.remove();
  };
  _.deleteSide = function(side, outward, cursor) {
    var parent = this.parent, sib = this[side], farEnd = parent.ends[side];

    if (side === this.side) { // deleting non-ghost of one-sided bracket, unwrap
      this.unwrap();
      sib ? cursor.insDirOf(-side, sib) : cursor.insAtDirEnd(side, parent);
      return;
    }

    var opts = cursor.options, wasSolid = !this.side;
    this.side = -side;
    // if deleting like, outer close-brace of [(1+2)+3} where inner open-paren
    if (this.matchBrack(opts, side, this.ends[L].ends[this.side])) { // is ghost,
      this.closeOpposing(this.ends[L].ends[this.side]); // then become [1+2)+3
      var origEnd = this.ends[L].ends[side];
      this.unwrap();
      if (origEnd.siblingCreated) origEnd.siblingCreated(cursor.options, side);
      sib ? cursor.insDirOf(-side, sib) : cursor.insAtDirEnd(side, parent);
    }
    else { // if deleting like, inner close-brace of ([1+2}+3) where outer
      if (this.matchBrack(opts, side, this.parent.parent)) { // open-paren is
        this.parent.parent.closeOpposing(this); // ghost, then become [1+2+3)
        this.parent.parent.unwrap();
      } // else if deleting outward from a solid pair, unwrap
      else if (outward && wasSolid) {
        this.unwrap();
        sib ? cursor.insDirOf(-side, sib) : cursor.insAtDirEnd(side, parent);
        return;
      }
      else { // else deleting just one of a pair of brackets, become one-sided
        this.sides[side] = { ch: OPP_BRACKS[this.sides[this.side].ch],
                             ctrlSeq: OPP_BRACKS[this.sides[this.side].ctrlSeq] };
        this.delimjQs.removeClass('mq-ghost')
          .eq(side === L ? 0 : 1).addClass('mq-ghost').html(this.sides[side].ch);
      }
      if (sib) { // auto-expand so ghost is at far end
        var origEnd = this.ends[L].ends[side];
        Fragment(sib, farEnd, -side).disown()
          .withDirAdopt(-side, this.ends[L], origEnd, 0)
          .jQ.insAtDirEnd(side, this.ends[L].jQ.removeClass('mq-empty'));
        if (origEnd.siblingCreated) origEnd.siblingCreated(cursor.options, side);
        cursor.insDirOf(-side, sib);
      } // didn't auto-expand, cursor goes just outside or just inside parens
      else (outward ? cursor.insDirOf(side, this)
                    : cursor.insAtDirEnd(side, this.ends[L]));
    }
  };
  _.deleteTowards = function(dir, cursor) {
    this.deleteSide(-dir, false, cursor);
  };
  _.finalizeTree = function() {
    this.ends[L].deleteOutOf = function(dir, cursor) {
      this.parent.deleteSide(dir, true, cursor);
    };
    // FIXME HACK: after initial creation/insertion, finalizeTree would only be
    // called if the paren is selected and replaced, e.g. by LiveFraction
    this.finalizeTree = this.intentionalBlur = function() {
      this.delimjQs.eq(this.side === L ? 1 : 0).removeClass('mq-ghost');
      this.side = 0;
    };
  };
  _.siblingCreated = function(opts, dir) { // if something typed between ghost and far
    if (dir === -this.side) this.finalizeTree(); // end of its block, solidify
  };
});

var OPP_BRACKS = {
  '(': ')',
  ')': '(',
  '[': ']',
  ']': '[',
  '{': '}',
  '}': '{',
  '\\\\{': '\\\\}',
  '\\\\}': '\\\\{',
  '&lang;': '&rang;',
  '&rang;': '&lang;',
  '\\\\langle ': '\\\\rangle ',
  '\\\\rangle ': '\\\\langle ',
  '|': '|',
  '\\\\lVert ' : '\\\\rVert ',
  '\\\\rVert ' : '\\\\lVert ',
};

function bindCharBracketPair(open, ctrlSeq) {
  var ctrlSeq = ctrlSeq || open, close = OPP_BRACKS[open], end = OPP_BRACKS[ctrlSeq];
  CharCmds[open] = bind(Bracket, L, open, close, ctrlSeq, end);
  CharCmds[close] = bind(Bracket, R, open, close, ctrlSeq, end);
}
bindCharBracketPair('(');
bindCharBracketPair('[');
bindCharBracketPair('{', '\\\\{');
LatexCmds.langle = bind(Bracket, L, '&lang;', '&rang;', '\\\\langle ', '\\\\rangle ');
LatexCmds.rangle = bind(Bracket, R, '&lang;', '&rang;', '\\\\langle ', '\\\\rangle ');
CharCmds['|'] = bind(Bracket, L, '|', '|', '|', '|');
LatexCmds.lVert = bind(Bracket, L, '&#8741;', '&#8741;', '\\\\lVert ', '\\\\rVert ');
LatexCmds.rVert = bind(Bracket, R, '&#8741;', '&#8741;', '\\\\lVert ', '\\\\rVert ');

LatexCmds.left = P(MathCommand, function(_) {
  _.parser = function() {
    var regex = Parser.regex;
    var string = Parser.string;
    var succeed = Parser.succeed;
    var optWhitespace = Parser.optWhitespace;

    return optWhitespace.then(regex(/^(?:[([|]|\\\\\\{|\\\\langle(?![a-zA-Z])|\\\\lVert(?![a-zA-Z]))/))
      .then(function(ctrlSeq) {
        var open = (ctrlSeq.charAt(0) === '\\\\' ? ctrlSeq.slice(1) : ctrlSeq);
	if (ctrlSeq=="\\\\langle") { open = '&lang;'; ctrlSeq = ctrlSeq + ' '; }
	if (ctrlSeq=="\\\\lVert") { open = '&#8741;'; ctrlSeq = ctrlSeq + ' '; }
        return latexMathParser.then(function (block) {
          return string('\\\\right').skip(optWhitespace)
            .then(regex(/^(?:[\\])|]|\\\\\\}|\\\\rangle(?![a-zA-Z])|\\\\rVert(?![a-zA-Z]))/)).map(function(end) {
              var close = (end.charAt(0) === '\\\\' ? end.slice(1) : end);
	      if (end=="\\\\rangle") { close = '&rang;'; end = end + ' '; }
	      if (end=="\\\\rVert") { close = '&#8741;'; end = end + ' '; }
              var cmd = Bracket(0, open, close, ctrlSeq, end);
              cmd.blocks = [ block ];
              block.adopt(cmd, 0, 0);
              return cmd;
            })
          ;
        });
      })
    ;
  };
});

LatexCmds.right = P(MathCommand, function(_) {
  _.parser = function() {
    return Parser.fail('unmatched \\\\right');
  };
});

var Binomial =
LatexCmds.binom =
LatexCmds.binomial = P(P(MathCommand, DelimsMixin), function(_, super_) {
  _.ctrlSeq = '\\\\binom';
  _.htmlTemplate =
      '<span class="mq-non-leaf">'
    +   '<span class="mq-paren mq-scaled">(</span>'
    +   '<span class="mq-non-leaf">'
    +     '<span class="mq-array mq-non-leaf">'
    +       '<span>&0</span>'
    +       '<span>&1</span>'
    +     '</span>'
    +   '</span>'
    +   '<span class="mq-paren mq-scaled">)</span>'
    + '</span>'
  ;
  _.textTemplate = ['choose(',',',')'];
});

var Choose =
LatexCmds.choose = P(Binomial, function(_) {
  _.createLeftOf = LiveFraction.prototype.createLeftOf;
});

LatexCmds.editable = // backcompat with before cfd3620 on #233
LatexCmds.MathQuillMathField = P(MathCommand, function(_, super_) {
  _.ctrlSeq = '\\\\MathQuillMathField';
  _.htmlTemplate =
      '<span class="mq-editable-field">'
    +   '<span class="mq-root-block">&0</span>'
    + '</span>'
  ;
  _.parser = function() {
    var self = this,
      string = Parser.string, regex = Parser.regex, succeed = Parser.succeed;
    return string('[').then(regex(/^[a-z][a-z0-9]*/i)).skip(string(']'))
      .map(function(name) { self.name = name; }).or(succeed())
      .then(super_.parser.call(self));
  };
  _.finalizeTree = function(options) {
    var ctrlr = Controller(this.ends[L], this.jQ, options);
    ctrlr.KIND_OF_MQ = 'MathField';
    ctrlr.editable = true;
    ctrlr.createTextarea();
    ctrlr.editablesTextareaEvents();
    ctrlr.cursor.insAtRightEnd(ctrlr.root);
    RootBlockMixin(ctrlr.root);
  };
  _.registerInnerField = function(innerFields, MathField) {
    innerFields.push(innerFields[this.name] = MathField(this.ends[L].controller));
  };
  _.latex = function(){ return this.ends[L].latex(); };
  _.text = function(){ return this.ends[L].text(); };
});

// Embed arbitrary things
// Probably the closest DOM analogue would be an iframe?
// From MathQuill's perspective, it's a Symbol, it can be
// anywhere and the cursor can go around it but never in it.
// Create by calling public API method .dropEmbedded(),
// or by calling the global public API method .registerEmbed()
// and rendering LaTeX like \\embed{registeredName} (see test).
var Embed = LatexCmds.embed = P(Symbol, function(_, super_) {
  _.setOptions = function(options) {
    function noop () { return ""; }
    this.text = options.text || noop;
    this.htmlTemplate = options.htmlString || "";
    this.latex = options.latex || noop;
    return this;
  };
  _.parser = function() {
    var self = this,
      string = Parser.string, regex = Parser.regex, succeed = Parser.succeed;
    return string('{').then(regex(/^[a-z][a-z0-9]*/i)).skip(string('}'))
      .then(function(name) {
        // the chars allowed in the optional data block are arbitrary other than
        // excluding curly braces and square brackets (which'd be too confusing)
        return string('[').then(regex(/^[-\\w\\s]*/)).skip(string(']'))
          .or(succeed()).map(function(data) {
            return self.setOptions(EMBEDS[name](data));
          })
        ;
      })
    ;
  };
});
/************************************
 * Symbols for Advanced Mathematics
 ***********************************/

LatexCmds.notin =
LatexCmds.cong =
LatexCmds.equiv =
LatexCmds.oplus =
LatexCmds.otimes = P(BinaryOperator, function(_, super_) {
  _.init = function(latex) {
    super_.init.call(this, '\\\\'+latex+' ', '&'+latex+';');
  };
});

LatexCmds['\\u2260'] = LatexCmds.ne = LatexCmds.neq = bind(BinaryOperator,'\\\\ne ','&ne;');

LatexCmds['\\u2217'] = LatexCmds.ast = LatexCmds.star = LatexCmds.loast = LatexCmds.lowast =
  bind(BinaryOperator,'\\\\ast ','&lowast;');

LatexCmds.therefor = LatexCmds.therefore =
  bind(BinaryOperator,'\\\\therefore ','&there4;');

LatexCmds.cuz = // l33t
LatexCmds.because = bind(BinaryOperator,'\\\\because ','&#8757;');

LatexCmds.prop = LatexCmds.propto = bind(BinaryOperator,'\\\\propto ','&prop;');

LatexCmds['\\u2248'] = LatexCmds.asymp = LatexCmds.approx = bind(BinaryOperator,'\\\\approx ','&asymp;');

LatexCmds.isin = LatexCmds['in'] = bind(BinaryOperator,'\\\\in ','&isin;');

LatexCmds.ni = LatexCmds.contains = bind(BinaryOperator,'\\\\ni ','&ni;');

LatexCmds.notni = LatexCmds.niton = LatexCmds.notcontains = LatexCmds.doesnotcontain =
  bind(BinaryOperator,'\\\\not\\\\ni ','&#8716;');

LatexCmds.sub = LatexCmds.subset = bind(BinaryOperator,'\\\\subset ','&sub;');

LatexCmds.sup = LatexCmds.supset = LatexCmds.superset =
  bind(BinaryOperator,'\\\\supset ','&sup;');

LatexCmds.nsub = LatexCmds.notsub =
LatexCmds.nsubset = LatexCmds.notsubset =
  bind(BinaryOperator,'\\\\not\\\\subset ','&#8836;');

LatexCmds.nsup = LatexCmds.notsup =
LatexCmds.nsupset = LatexCmds.notsupset =
LatexCmds.nsuperset = LatexCmds.notsuperset =
  bind(BinaryOperator,'\\\\not\\\\supset ','&#8837;');

LatexCmds.sube = LatexCmds.subeq = LatexCmds.subsete = LatexCmds.subseteq =
  bind(BinaryOperator,'\\\\subseteq ','&sube;');

LatexCmds.supe = LatexCmds.supeq =
LatexCmds.supsete = LatexCmds.supseteq =
LatexCmds.supersete = LatexCmds.superseteq =
  bind(BinaryOperator,'\\\\supseteq ','&supe;');

LatexCmds.nsube = LatexCmds.nsubeq =
LatexCmds.notsube = LatexCmds.notsubeq =
LatexCmds.nsubsete = LatexCmds.nsubseteq =
LatexCmds.notsubsete = LatexCmds.notsubseteq =
  bind(BinaryOperator,'\\\\not\\\\subseteq ','&#8840;');

LatexCmds.nsupe = LatexCmds.nsupeq =
LatexCmds.notsupe = LatexCmds.notsupeq =
LatexCmds.nsupsete = LatexCmds.nsupseteq =
LatexCmds.notsupsete = LatexCmds.notsupseteq =
LatexCmds.nsupersete = LatexCmds.nsuperseteq =
LatexCmds.notsupersete = LatexCmds.notsuperseteq =
  bind(BinaryOperator,'\\\\not\\\\supseteq ','&#8841;');


//the canonical sets of numbers
LatexCmds.N = LatexCmds.naturals = LatexCmds.Naturals =
  bind(VanillaSymbol,'\\\\mathbb{N}','&#8469;');

LatexCmds.P =
LatexCmds.primes = LatexCmds.Primes =
LatexCmds.projective = LatexCmds.Projective =
LatexCmds.probability = LatexCmds.Probability =
  bind(VanillaSymbol,'\\\\mathbb{P}','&#8473;');

LatexCmds.Z = LatexCmds.integers = LatexCmds.Integers =
  bind(VanillaSymbol,'\\\\mathbb{Z}','&#8484;');

LatexCmds.Q = LatexCmds.rationals = LatexCmds.Rationals =
  bind(VanillaSymbol,'\\\\mathbb{Q}','&#8474;');

LatexCmds.R = LatexCmds.reals = LatexCmds.Reals =
  bind(VanillaSymbol,'\\\\mathbb{R}','&#8477;');

LatexCmds.C =
LatexCmds.complex = LatexCmds.Complex =
LatexCmds.complexes = LatexCmds.Complexes =
LatexCmds.complexplane = LatexCmds.Complexplane = LatexCmds.ComplexPlane =
  bind(VanillaSymbol,'\\\\mathbb{C}','&#8450;');

LatexCmds.H = LatexCmds.Hamiltonian = LatexCmds.quaternions = LatexCmds.Quaternions =
  bind(VanillaSymbol,'\\\\mathbb{H}','&#8461;');

//spacing
LatexCmds.quad = LatexCmds.emsp = bind(VanillaSymbol,'\\\\quad ','    ');
LatexCmds.qquad = bind(VanillaSymbol,'\\\\qquad ','        ');
/* spacing special characters, gonna have to implement this in LatexCommandInput::onText somehow
case ',':
  return VanillaSymbol('\\\\, ',' ');
case ':':
  return VanillaSymbol('\\\\: ','  ');
case ';':
  return VanillaSymbol('\\\\; ','   ');
case '!':
  return Symbol('\\\\! ','<span style="margin-right:-.2em"></span>');
*/

//binary operators
LatexCmds.diamond = bind(VanillaSymbol, '\\\\diamond ', '&#9671;');
LatexCmds.bigtriangleup = bind(VanillaSymbol, '\\\\bigtriangleup ', '&#9651;');
LatexCmds.ominus = bind(VanillaSymbol, '\\\\ominus ', '&#8854;');
LatexCmds.uplus = bind(VanillaSymbol, '\\\\uplus ', '&#8846;');
LatexCmds.bigtriangledown = bind(VanillaSymbol, '\\\\bigtriangledown ', '&#9661;');
LatexCmds.sqcap = bind(VanillaSymbol, '\\\\sqcap ', '&#8851;');
LatexCmds.triangleleft = bind(VanillaSymbol, '\\\\triangleleft ', '&#8882;');
LatexCmds.sqcup = bind(VanillaSymbol, '\\\\sqcup ', '&#8852;');
LatexCmds.triangleright = bind(VanillaSymbol, '\\\\triangleright ', '&#8883;');
//circledot is not a not real LaTex command see https://github.com/mathquill/mathquill/pull/552 for more details
LatexCmds.odot = LatexCmds.circledot = bind(VanillaSymbol, '\\\\odot ', '&#8857;');
LatexCmds.bigcirc = bind(VanillaSymbol, '\\\\bigcirc ', '&#9711;');
LatexCmds.dagger = bind(VanillaSymbol, '\\\\dagger ', '&#0134;');
LatexCmds.ddagger = bind(VanillaSymbol, '\\\\ddagger ', '&#135;');
LatexCmds.wr = bind(VanillaSymbol, '\\\\wr ', '&#8768;');
LatexCmds.amalg = bind(VanillaSymbol, '\\\\amalg ', '&#8720;');

//relationship symbols
LatexCmds.models = bind(VanillaSymbol, '\\\\models ', '&#8872;');
LatexCmds.prec = bind(VanillaSymbol, '\\\\prec ', '&#8826;');
LatexCmds.succ = bind(VanillaSymbol, '\\\\succ ', '&#8827;');
LatexCmds.preceq = bind(VanillaSymbol, '\\\\preceq ', '&#8828;');
LatexCmds.succeq = bind(VanillaSymbol, '\\\\succeq ', '&#8829;');
LatexCmds.simeq = bind(VanillaSymbol, '\\\\simeq ', '&#8771;');
LatexCmds.mid = bind(VanillaSymbol, '\\\\mid ', '&#8739;');
LatexCmds.ll = bind(VanillaSymbol, '\\\\ll ', '&#8810;');
LatexCmds.gg = bind(VanillaSymbol, '\\\\gg ', '&#8811;');
LatexCmds.parallel = bind(VanillaSymbol, '\\\\parallel ', '&#8741;');
LatexCmds.nparallel = bind(VanillaSymbol, '\\\\nparallel ', '&#8742;');
LatexCmds.bowtie = bind(VanillaSymbol, '\\\\bowtie ', '&#8904;');
LatexCmds.sqsubset = bind(VanillaSymbol, '\\\\sqsubset ', '&#8847;');
LatexCmds.sqsupset = bind(VanillaSymbol, '\\\\sqsupset ', '&#8848;');
LatexCmds.smile = bind(VanillaSymbol, '\\\\smile ', '&#8995;');
LatexCmds.sqsubseteq = bind(VanillaSymbol, '\\\\sqsubseteq ', '&#8849;');
LatexCmds.sqsupseteq = bind(VanillaSymbol, '\\\\sqsupseteq ', '&#8850;');
LatexCmds.doteq = bind(VanillaSymbol, '\\\\doteq ', '&#8784;');
LatexCmds.frown = bind(VanillaSymbol, '\\\\frown ', '&#8994;');
LatexCmds.vdash = bind(VanillaSymbol, '\\\\vdash ', '&#8870;');
LatexCmds.dashv = bind(VanillaSymbol, '\\\\dashv ', '&#8867;');
LatexCmds.nless = bind(VanillaSymbol, '\\\\nless ', '&#8814;');
LatexCmds.ngtr = bind(VanillaSymbol, '\\\\ngtr ', '&#8815;');

//arrows
LatexCmds.longleftarrow = bind(VanillaSymbol, '\\\\longleftarrow ', '&#8592;');
LatexCmds.longrightarrow = bind(VanillaSymbol, '\\\\longrightarrow ', '&#8594;');
LatexCmds.Longleftarrow = bind(VanillaSymbol, '\\\\Longleftarrow ', '&#8656;');
LatexCmds.Longrightarrow = bind(VanillaSymbol, '\\\\Longrightarrow ', '&#8658;');
LatexCmds.longleftrightarrow = bind(VanillaSymbol, '\\\\longleftrightarrow ', '&#8596;');
LatexCmds.updownarrow = bind(VanillaSymbol, '\\\\updownarrow ', '&#8597;');
LatexCmds.Longleftrightarrow = bind(VanillaSymbol, '\\\\Longleftrightarrow ', '&#8660;');
LatexCmds.Updownarrow = bind(VanillaSymbol, '\\\\Updownarrow ', '&#8661;');
LatexCmds.mapsto = bind(VanillaSymbol, '\\\\mapsto ', '&#8614;');
LatexCmds.nearrow = bind(VanillaSymbol, '\\\\nearrow ', '&#8599;');
LatexCmds.hookleftarrow = bind(VanillaSymbol, '\\\\hookleftarrow ', '&#8617;');
LatexCmds.hookrightarrow = bind(VanillaSymbol, '\\\\hookrightarrow ', '&#8618;');
LatexCmds.searrow = bind(VanillaSymbol, '\\\\searrow ', '&#8600;');
LatexCmds.leftharpoonup = bind(VanillaSymbol, '\\\\leftharpoonup ', '&#8636;');
LatexCmds.rightharpoonup = bind(VanillaSymbol, '\\\\rightharpoonup ', '&#8640;');
LatexCmds.swarrow = bind(VanillaSymbol, '\\\\swarrow ', '&#8601;');
LatexCmds.leftharpoondown = bind(VanillaSymbol, '\\\\leftharpoondown ', '&#8637;');
LatexCmds.rightharpoondown = bind(VanillaSymbol, '\\\\rightharpoondown ', '&#8641;');
LatexCmds.nwarrow = bind(VanillaSymbol, '\\\\nwarrow ', '&#8598;');

//Misc
LatexCmds.ldots = bind(VanillaSymbol, '\\\\ldots ', '&#8230;');
LatexCmds.cdots = bind(VanillaSymbol, '\\\\cdots ', '&#8943;');
LatexCmds.vdots = bind(VanillaSymbol, '\\\\vdots ', '&#8942;');
LatexCmds.ddots = bind(VanillaSymbol, '\\\\ddots ', '&#8945;');
LatexCmds.surd = bind(VanillaSymbol, '\\\\surd ', '&#8730;');
LatexCmds.triangle = bind(VanillaSymbol, '\\\\triangle ', '&#9651;');
LatexCmds.ell = bind(VanillaSymbol, '\\\\ell ', '&#8467;');
LatexCmds.top = bind(VanillaSymbol, '\\\\top ', '&#8868;');
LatexCmds.flat = bind(VanillaSymbol, '\\\\flat ', '&#9837;');
LatexCmds.natural = bind(VanillaSymbol, '\\\\natural ', '&#9838;');
LatexCmds.sharp = bind(VanillaSymbol, '\\\\sharp ', '&#9839;');
LatexCmds.wp = bind(VanillaSymbol, '\\\\wp ', '&#8472;');
LatexCmds.bot = bind(VanillaSymbol, '\\\\bot ', '&#8869;');
LatexCmds.clubsuit = bind(VanillaSymbol, '\\\\clubsuit ', '&#9827;');
LatexCmds.diamondsuit = bind(VanillaSymbol, '\\\\diamondsuit ', '&#9826;');
LatexCmds.heartsuit = bind(VanillaSymbol, '\\\\heartsuit ', '&#9825;');
LatexCmds.spadesuit = bind(VanillaSymbol, '\\\\spadesuit ', '&#9824;');
//not real LaTex command see https://github.com/mathquill/mathquill/pull/552 for more details
LatexCmds.parallelogram = bind(VanillaSymbol, '\\\\parallelogram ', '&#9649;');
LatexCmds.square = bind(VanillaSymbol, '\\\\square ', '&#11036;');

//variable-sized
LatexCmds.oint = bind(VanillaSymbol, '\\\\oint ', '&#8750;');
LatexCmds.bigcap = bind(VanillaSymbol, '\\\\bigcap ', '&#8745;');
LatexCmds.bigcup = bind(VanillaSymbol, '\\\\bigcup ', '&#8746;');
LatexCmds.bigsqcup = bind(VanillaSymbol, '\\\\bigsqcup ', '&#8852;');
LatexCmds.bigvee = bind(VanillaSymbol, '\\\\bigvee ', '&#8744;');
LatexCmds.bigwedge = bind(VanillaSymbol, '\\\\bigwedge ', '&#8743;');
LatexCmds.bigodot = bind(VanillaSymbol, '\\\\bigodot ', '&#8857;');
LatexCmds.bigotimes = bind(VanillaSymbol, '\\\\bigotimes ', '&#8855;');
LatexCmds.bigoplus = bind(VanillaSymbol, '\\\\bigoplus ', '&#8853;');
LatexCmds.biguplus = bind(VanillaSymbol, '\\\\biguplus ', '&#8846;');

//delimiters
LatexCmds.lfloor = bind(VanillaSymbol, '\\\\lfloor ', '&#8970;');
LatexCmds.rfloor = bind(VanillaSymbol, '\\\\rfloor ', '&#8971;');
LatexCmds.lceil = bind(VanillaSymbol, '\\\\lceil ', '&#8968;');
LatexCmds.rceil = bind(VanillaSymbol, '\\\\rceil ', '&#8969;');
LatexCmds.opencurlybrace = LatexCmds.lbrace = bind(VanillaSymbol, '\\\\lbrace ', '{');
LatexCmds.closecurlybrace = LatexCmds.rbrace = bind(VanillaSymbol, '\\\\rbrace ', '}');
LatexCmds.lbrack = bind(VanillaSymbol, '[');
LatexCmds.rbrack = bind(VanillaSymbol, ']');

//various symbols
LatexCmds.slash = bind(VanillaSymbol, '/');
LatexCmds.vert = bind(VanillaSymbol,'|');
LatexCmds.perp = LatexCmds.perpendicular = bind(VanillaSymbol,'\\\\perp ','&perp;');
LatexCmds.nabla = LatexCmds.del = bind(VanillaSymbol,'\\\\nabla ','&nabla;');
LatexCmds.hbar = bind(VanillaSymbol,'\\\\hbar ','&#8463;');

LatexCmds.AA = LatexCmds.Angstrom = LatexCmds.angstrom =
  bind(VanillaSymbol,'\\\\text\\\\AA ','&#8491;');

LatexCmds.ring = LatexCmds.circ = LatexCmds.circle =
  bind(VanillaSymbol,'\\\\circ ','&#8728;');

LatexCmds.bull = LatexCmds.bullet = bind(VanillaSymbol,'\\\\bullet ','&bull;');

LatexCmds.setminus = LatexCmds.smallsetminus =
  bind(VanillaSymbol,'\\\\setminus ','&#8726;');

LatexCmds.not = //bind(Symbol,'\\\\not ','<span class="not">/</span>');
LatexCmds['\\u00ac'] = LatexCmds.neg = bind(VanillaSymbol,'\\\\neg ','&not;');

LatexCmds['\\u2026'] = LatexCmds.dots = LatexCmds.ellip = LatexCmds.hellip =
LatexCmds.ellipsis = LatexCmds.hellipsis =
  bind(VanillaSymbol,'\\\\dots ','&hellip;');

LatexCmds.converges =
LatexCmds.darr = LatexCmds.dnarr = LatexCmds.dnarrow = LatexCmds.downarrow =
  bind(VanillaSymbol,'\\\\downarrow ','&darr;');

LatexCmds.dArr = LatexCmds.dnArr = LatexCmds.dnArrow = LatexCmds.Downarrow =
  bind(VanillaSymbol,'\\\\Downarrow ','&dArr;');

LatexCmds.diverges = LatexCmds.uarr = LatexCmds.uparrow =
  bind(VanillaSymbol,'\\\\uparrow ','&uarr;');

LatexCmds.uArr = LatexCmds.Uparrow = bind(VanillaSymbol,'\\\\Uparrow ','&uArr;');

LatexCmds.to = bind(BinaryOperator,'\\\\to ','&rarr;');

LatexCmds.rarr = LatexCmds.rightarrow = bind(VanillaSymbol,'\\\\rightarrow ','&rarr;');

LatexCmds.implies = bind(BinaryOperator,'\\\\Rightarrow ','&rArr;');

LatexCmds.rArr = LatexCmds.Rightarrow = bind(VanillaSymbol,'\\\\Rightarrow ','&rArr;');

LatexCmds.gets = bind(BinaryOperator,'\\\\gets ','&larr;');

LatexCmds.larr = LatexCmds.leftarrow = bind(VanillaSymbol,'\\\\leftarrow ','&larr;');

LatexCmds.impliedby = bind(BinaryOperator,'\\\\Leftarrow ','&lArr;');

LatexCmds.lArr = LatexCmds.Leftarrow = bind(VanillaSymbol,'\\\\Leftarrow ','&lArr;');

LatexCmds.harr = LatexCmds.lrarr = LatexCmds.leftrightarrow =
  bind(VanillaSymbol,'\\\\leftrightarrow ','&harr;');

LatexCmds.iff = bind(BinaryOperator,'\\\\Leftrightarrow ','&hArr;');

LatexCmds.hArr = LatexCmds.lrArr = LatexCmds.Leftrightarrow =
  bind(VanillaSymbol,'\\\\Leftrightarrow ','&hArr;');

LatexCmds.Re = LatexCmds.Real = LatexCmds.real = bind(VanillaSymbol,'\\\\Re ','&real;');

LatexCmds.Im = LatexCmds.imag =
LatexCmds.image = LatexCmds.imagin = LatexCmds.imaginary = LatexCmds.Imaginary =
  bind(VanillaSymbol,'\\\\Im ','&image;');

LatexCmds.part = LatexCmds.partial = bind(VanillaSymbol,'\\\\partial ','&part;');

LatexCmds.infty = LatexCmds.infin = LatexCmds.infinity =
  bind(VanillaSymbol,'\\\\infty ','&infin;');

LatexCmds.pounds = bind(VanillaSymbol,'\\\\pounds ','&pound;');

LatexCmds.alef = LatexCmds.alefsym = LatexCmds.aleph = LatexCmds.alephsym =
  bind(VanillaSymbol,'\\\\aleph ','&alefsym;');

LatexCmds.xist = //LOL
LatexCmds.xists = LatexCmds.exist = LatexCmds.exists =
  bind(VanillaSymbol,'\\\\exists ','&exist;');

LatexCmds.nexists = LatexCmds.nexist =
      bind(VanillaSymbol, '\\\\nexists ', '&#8708;');

LatexCmds.and = LatexCmds.land = LatexCmds.wedge =
  bind(BinaryOperator,'\\\\wedge ','&and;');

LatexCmds.or = LatexCmds.lor = LatexCmds.vee = bind(BinaryOperator,'\\\\vee ','&or;');

LatexCmds.o = LatexCmds.O =
LatexCmds.empty = LatexCmds.emptyset =
LatexCmds.oslash = LatexCmds.Oslash =
LatexCmds.nothing = LatexCmds.varnothing =
  bind(BinaryOperator,'\\\\varnothing ','&empty;');

LatexCmds.cup = LatexCmds.union = bind(BinaryOperator,'\\\\cup ','&cup;');

LatexCmds.cap = LatexCmds.intersect = LatexCmds.intersection =
  bind(BinaryOperator,'\\\\cap ','&cap;');

// FIXME: the correct LaTeX would be ^\\circ but we can't parse that
LatexCmds.deg = LatexCmds.degree = bind(VanillaSymbol,'\\\\degree ','&deg;');

LatexCmds.ang = LatexCmds.angle = bind(VanillaSymbol,'\\\\angle ','&ang;');
LatexCmds.measuredangle = bind(VanillaSymbol,'\\\\measuredangle ','&#8737;');
/*********************************
 * Symbols for Basic Mathematics
 ********************************/

var Digit = P(VanillaSymbol, function(_, super_) {
  _.createLeftOf = function(cursor) {
    if (cursor.options.autoSubscriptNumerals
        && cursor.parent !== cursor.parent.parent.sub
        && ((cursor[L] instanceof Variable && cursor[L].isItalic !== false)
            || (cursor[L] instanceof SupSub
                && cursor[L][L] instanceof Variable
                && cursor[L][L].isItalic !== false))) {
      LatexCmds._().createLeftOf(cursor);
      super_.createLeftOf.call(this, cursor);
      cursor.insRightOf(cursor.parent.parent);
    }
    else super_.createLeftOf.call(this, cursor);
  };
});

var Variable = P(Symbol, function(_, super_) {
  _.init = function(ch, html) {
    super_.init.call(this, ch, '<var>'+(html || ch)+'</var>');
  };
  _.text = function() {
    var text = this.ctrlSeq;
    if (this.isPartOfOperator) {
      if (text[0] == '\\\\') {
        text = text.slice(1, text.length);
      }
      else if (text[text.length-1] == ' ') {
        text = text.slice (0, -1);
      }
    } else {
      if (this[L] && !(this[L] instanceof Variable)
          && !(this[L] instanceof BinaryOperator)
          && this[L].ctrlSeq !== '\\\\ ')
        text = '*' + text;
      if (this[R] && !(this[R] instanceof BinaryOperator)
          && !(this[R] instanceof SupSub))
        text += '*';
    }
    return text;
  };
});

Options.p.autoCommands = { _maxLength: 0 };
optionProcessors.autoCommands = function(cmds) {
  if (!/^[a-z]+(?: [a-z]+)*$/i.test(cmds)) {
    throw '"'+cmds+'" not a space-delimited list of only letters';
  }
  var list = cmds.split(' '), dict = {}, maxLength = 0;
  for (var i = 0; i < list.length; i += 1) {
    var cmd = list[i];
    if (cmd.length < 2) {
      throw 'autocommand "'+cmd+'" not minimum length of 2';
    }
    if (LatexCmds[cmd] === OperatorName) {
      throw '"' + cmd + '" is a built-in operator name';
    }
    dict[cmd] = 1;
    maxLength = max(maxLength, cmd.length);
  }
  dict._maxLength = maxLength;
  return dict;
};

var Letter = P(Variable, function(_, super_) {
  _.init = function(ch) { return super_.init.call(this, this.letter = ch); };
  _.createLeftOf = function(cursor) {
    super_.createLeftOf.apply(this, arguments);
    var autoCmds = cursor.options.autoCommands, maxLength = autoCmds._maxLength;
    if (maxLength > 0) {
      // want longest possible autocommand, so join together longest
      // sequence of letters
      var str = '', l = this, i = 0;
      // FIXME: l.ctrlSeq === l.letter checks if first or last in an operator name
      while (l instanceof Letter && l.ctrlSeq === l.letter && i < maxLength) {
        str = l.letter + str, l = l[L], i += 1;
      }
      // check for an autocommand, going thru substrings longest to shortest
      while (str.length) {
        if (autoCmds.hasOwnProperty(str)) {
          for (var i = 1, l = this; i < str.length; i += 1, l = l[L]);
          Fragment(l, this).remove();
          cursor[L] = l[L];
          return LatexCmds[str](str).createLeftOf(cursor);
        }
        str = str.slice(1);
      }
    }
  };
  _.italicize = function(bool) {
    this.isItalic = bool;
    this.isPartOfOperator = !bool;
    this.jQ.toggleClass('mq-operator-name', !bool);
    return this;
  };
  _.finalizeTree = _.siblingDeleted = _.siblingCreated = function(opts, dir) {
    // don't auto-un-italicize if the sibling to my right changed (dir === R or
    // undefined) and it's now a Letter, it will un-italicize everyone
    if (dir !== L && this[R] instanceof Letter) return;
    this.autoUnItalicize(opts);
  };
  _.autoUnItalicize = function(opts) {
    var autoOps = opts.autoOperatorNames;
    if (autoOps._maxLength === 0) return;
    // want longest possible operator names, so join together entire contiguous
    // sequence of letters
    var str = this.letter;
    for (var l = this[L]; l instanceof Letter; l = l[L]) str = l.letter + str;
    for (var r = this[R]; r instanceof Letter; r = r[R]) str += r.letter;

    // removeClass and delete flags from all letters before figuring out
    // which, if any, are part of an operator name
    Fragment(l[R] || this.parent.ends[L], r[L] || this.parent.ends[R]).each(function(el) {
      el.italicize(true).jQ.removeClass('mq-first mq-last mq-followed-by-supsub');
      el.ctrlSeq = el.letter;
    });

    // check for operator names: at each position from left to right, check
    // substrings from longest to shortest
    outer: for (var i = 0, first = l[R] || this.parent.ends[L]; i < str.length; i += 1, first = first[R]) {
      for (var len = min(autoOps._maxLength, str.length - i); len > 0; len -= 1) {
        var word = str.slice(i, i + len);
        if (autoOps.hasOwnProperty(word)) {
          for (var j = 0, letter = first; j < len; j += 1, letter = letter[R]) {
            letter.italicize(false);
            var last = letter;
          }

          var isBuiltIn = BuiltInOpNames.hasOwnProperty(word);
          first.ctrlSeq = (isBuiltIn ? '\\\\' : '\\\\operatorname{') + first.ctrlSeq;
          last.ctrlSeq += (isBuiltIn ? ' ' : '}');
          if (TwoWordOpNames.hasOwnProperty(word)) last[L][L][L].jQ.addClass('mq-last');
          if (!shouldOmitPadding(first[L])) first.jQ.addClass('mq-first');
          if (!shouldOmitPadding(last[R])) {
            if (last[R] instanceof SupSub) {
              var supsub = last[R]; // XXX monkey-patching, but what's the right thing here?
              // Have operatorname-specific code in SupSub? A CSS-like language to style the
              // math tree, but which ignores cursor and selection (which CSS can't)?
              var respace = supsub.siblingCreated = supsub.siblingDeleted = function() {
                supsub.jQ.toggleClass('mq-after-operator-name', !(supsub[R] instanceof Bracket));
              };
              respace();
            }
            else {
              last.jQ.toggleClass('mq-last', !(last[R] instanceof Bracket));
            }
          }

          i += len - 1;
          first = last;
          continue outer;
        }
      }
    }
  };
  function shouldOmitPadding(node) {
    // omit padding if no node, or if node already has padding (to avoid double-padding)
    return !node || (node instanceof BinaryOperator) || (node instanceof SummationNotation);
  }
});
var BuiltInOpNames = {}; // the set of operator names like \\sin, \\cos, etc that
  // are built-into LaTeX, see Section 3.17 of the Short Math Guide: http://tinyurl.com/jm9okjc
  // MathQuill auto-unitalicizes some operator names not in that set, like 'hcf'
  // and 'arsinh', which must be exported as \\operatorname{hcf} and
  // \\operatorname{arsinh}. Note: over/under line/arrow \\lim variants like
  // \\varlimsup are not supported
var AutoOpNames = Options.p.autoOperatorNames = { _maxLength: 9 }; // the set
  // of operator names that MathQuill auto-unitalicizes by default; overridable
var TwoWordOpNames = { limsup: 1, liminf: 1, projlim: 1, injlim: 1 };
(function() {
  var mostOps = ('arg deg det dim exp gcd hom inf ker lg lim ln log max min sup'
                 + ' limsup liminf injlim projlim Pr').split(' ');
  for (var i = 0; i < mostOps.length; i += 1) {
    BuiltInOpNames[mostOps[i]] = AutoOpNames[mostOps[i]] = 1;
  }

  var builtInTrigs = // why coth but not sech and csch, LaTeX?
    'sin cos tan arcsin arccos arctan sinh cosh tanh sec csc cot coth'.split(' ');
  for (var i = 0; i < builtInTrigs.length; i += 1) {
    BuiltInOpNames[builtInTrigs[i]] = 1;
  }

  var autoTrigs = 'sin cos tan sec cosec csc cotan cot ctg'.split(' ');
  for (var i = 0; i < autoTrigs.length; i += 1) {
    AutoOpNames[autoTrigs[i]] =
    AutoOpNames['arc'+autoTrigs[i]] =
    AutoOpNames[autoTrigs[i]+'h'] =
    AutoOpNames['ar'+autoTrigs[i]+'h'] =
    AutoOpNames['arc'+autoTrigs[i]+'h'] = 1;
  }

  // compat with some of the nonstandard LaTeX exported by MathQuill
  // before #247. None of these are real LaTeX commands so, seems safe
  var moreNonstandardOps = 'gcf hcf lcm proj span'.split(' ');
  for (var i = 0; i < moreNonstandardOps.length; i += 1) {
    AutoOpNames[moreNonstandardOps[i]] = 1;
  }
}());
optionProcessors.autoOperatorNames = function(cmds) {
  if (!/^[a-z]+(?: [a-z]+)*$/i.test(cmds)) {
    throw '"'+cmds+'" not a space-delimited list of only letters';
  }
  var list = cmds.split(' '), dict = {}, maxLength = 0;
  for (var i = 0; i < list.length; i += 1) {
    var cmd = list[i];
    if (cmd.length < 2) {
      throw '"'+cmd+'" not minimum length of 2';
    }
    dict[cmd] = 1;
    maxLength = max(maxLength, cmd.length);
  }
  dict._maxLength = maxLength;
  return dict;
};
var OperatorName = P(Symbol, function(_, super_) {
  _.init = function(fn) { this.ctrlSeq = fn; };
  _.createLeftOf = function(cursor) {
    var fn = this.ctrlSeq;
    for (var i = 0; i < fn.length; i += 1) {
      Letter(fn.charAt(i)).createLeftOf(cursor);
    }
  };
  _.parser = function() {
    var fn = this.ctrlSeq;
    var block = MathBlock();
    for (var i = 0; i < fn.length; i += 1) {
      Letter(fn.charAt(i)).adopt(block, block.ends[R], 0);
    }
    return Parser.succeed(block.children());
  };
});
for (var fn in AutoOpNames) if (AutoOpNames.hasOwnProperty(fn)) {
  LatexCmds[fn] = OperatorName;
}
LatexCmds.operatorname = P(MathCommand, function(_) {
  _.createLeftOf = noop;
  _.numBlocks = function() { return 1; };
  _.parser = function() {
    return latexMathParser.block.map(function(b) { return b.children(); });
  };
});

LatexCmds.f = P(Letter, function(_, super_) {
  _.init = function() {
    Symbol.p.init.call(this, this.letter = 'f', '<var class="mq-f">f</var>');
  };
  _.italicize = function(bool) {
    this.jQ.html('f').toggleClass('mq-f', bool);
    return super_.italicize.apply(this, arguments);
  };
});

// VanillaSymbol's
LatexCmds[' '] = LatexCmds.space = bind(VanillaSymbol, '\\\\ ', '&nbsp;');

LatexCmds["'"] = LatexCmds.prime = bind(VanillaSymbol, "'", '&prime;');
LatexCmds['\\u2033'] = LatexCmds.dprime = bind(VanillaSymbol, '\\u2033', '&Prime;');

LatexCmds.backslash = bind(VanillaSymbol,'\\\\backslash ','\\\\');
if (!CharCmds['\\\\']) CharCmds['\\\\'] = LatexCmds.backslash;

LatexCmds.$ = bind(VanillaSymbol, '\\\\$', '$');

// does not use Symbola font
var NonSymbolaSymbol = P(Symbol, function(_, super_) {
  _.init = function(ch, html) {
    super_.init.call(this, ch, '<span class="mq-nonSymbola">'+(html || ch)+'</span>');
  };
});

LatexCmds['@'] = NonSymbolaSymbol;
LatexCmds['&'] = bind(NonSymbolaSymbol, '\\\\&', '&amp;');
LatexCmds['%'] = bind(NonSymbolaSymbol, '\\\\%', '%');

//the following are all Greek to me, but this helped a lot: http://www.ams.org/STIX/ion/stixsig03.html

//lowercase Greek letter variables
LatexCmds.alpha =
LatexCmds.beta =
LatexCmds.gamma =
LatexCmds.delta =
LatexCmds.zeta =
LatexCmds.eta =
LatexCmds.theta =
LatexCmds.iota =
LatexCmds.kappa =
LatexCmds.mu =
LatexCmds.nu =
LatexCmds.xi =
LatexCmds.rho =
LatexCmds.sigma =
LatexCmds.tau =
LatexCmds.chi =
LatexCmds.psi =
LatexCmds.omega = P(Variable, function(_, super_) {
  _.init = function(latex) {
    super_.init.call(this,'\\\\'+latex+' ','&'+latex+';');
  };
});

//why can't anybody FUCKING agree on these
LatexCmds.phi = //W3C or Unicode?
  bind(Variable,'\\\\phi ','&#981;');

LatexCmds.phiv = //Elsevier and 9573-13
LatexCmds.varphi = //AMS and LaTeX
  bind(Variable,'\\\\varphi ','&phi;');

LatexCmds.epsilon = //W3C or Unicode?
  bind(Variable,'\\\\epsilon ','&#1013;');

LatexCmds.epsiv = //Elsevier and 9573-13
LatexCmds.varepsilon = //AMS and LaTeX
  bind(Variable,'\\\\varepsilon ','&epsilon;');

LatexCmds.piv = //W3C/Unicode and Elsevier and 9573-13
LatexCmds.varpi = //AMS and LaTeX
  bind(Variable,'\\\\varpi ','&piv;');

LatexCmds.sigmaf = //W3C/Unicode
LatexCmds.sigmav = //Elsevier
LatexCmds.varsigma = //LaTeX
  bind(Variable,'\\\\varsigma ','&sigmaf;');

LatexCmds.thetav = //Elsevier and 9573-13
LatexCmds.vartheta = //AMS and LaTeX
LatexCmds.thetasym = //W3C/Unicode
  bind(Variable,'\\\\vartheta ','&thetasym;');

LatexCmds.upsilon = //AMS and LaTeX and W3C/Unicode
LatexCmds.upsi = //Elsevier and 9573-13
  bind(Variable,'\\\\upsilon ','&upsilon;');

//these aren't even mentioned in the HTML character entity references
LatexCmds.gammad = //Elsevier
LatexCmds.Gammad = //9573-13 -- WTF, right? I dunno if this was a typo in the reference (see above)
LatexCmds.digamma = //LaTeX
  bind(Variable,'\\\\digamma ','&#989;');

LatexCmds.kappav = //Elsevier
LatexCmds.varkappa = //AMS and LaTeX
  bind(Variable,'\\\\varkappa ','&#1008;');

LatexCmds.rhov = //Elsevier and 9573-13
LatexCmds.varrho = //AMS and LaTeX
  bind(Variable,'\\\\varrho ','&#1009;');

//Greek constants, look best in non-italicized Times New Roman
LatexCmds.pi = LatexCmds['\\u03c0'] = bind(NonSymbolaSymbol,'\\\\pi ','&pi;');
LatexCmds.lambda = bind(NonSymbolaSymbol,'\\\\lambda ','&lambda;');

//uppercase greek letters

LatexCmds.Upsilon = //LaTeX
LatexCmds.Upsi = //Elsevier and 9573-13
LatexCmds.upsih = //W3C/Unicode "upsilon with hook"
LatexCmds.Upsih = //'cos it makes sense to me
  bind(Symbol,'\\\\Upsilon ','<var style="font-family: serif">&upsih;</var>'); //Symbola's 'upsilon with a hook' is a capital Y without hooks :(

//other symbols with the same LaTeX command and HTML character entity reference
LatexCmds.Gamma =
LatexCmds.Delta =
LatexCmds.Theta =
LatexCmds.Lambda =
LatexCmds.Xi =
LatexCmds.Pi =
LatexCmds.Sigma =
LatexCmds.Phi =
LatexCmds.Psi =
LatexCmds.Omega =
LatexCmds.forall = P(VanillaSymbol, function(_, super_) {
  _.init = function(latex) {
    super_.init.call(this,'\\\\'+latex+' ','&'+latex+';');
  };
});

// symbols that aren't a single MathCommand, but are instead a whole
// Fragment. Creates the Fragment from a LaTeX string
var LatexFragment = P(MathCommand, function(_) {
  _.init = function(latex) { this.latex = latex; };
  _.createLeftOf = function(cursor) {
    var block = latexMathParser.parse(this.latex);
    block.children().adopt(cursor.parent, cursor[L], cursor[R]);
    cursor[L] = block.ends[R];
    block.jQize().insertBefore(cursor.jQ);
    block.finalizeInsert(cursor.options, cursor);
    if (block.ends[R][R].siblingCreated) block.ends[R][R].siblingCreated(cursor.options, L);
    if (block.ends[L][L].siblingCreated) block.ends[L][L].siblingCreated(cursor.options, R);
    cursor.parent.bubble('reflow');
  };
  _.parser = function() {
    var frag = latexMathParser.parse(this.latex).children();
    return Parser.succeed(frag);
  };
});

// for what seems to me like [stupid reasons][1], Unicode provides
// subscripted and superscripted versions of all ten Arabic numerals,
// as well as [so-called "vulgar fractions"][2].
// Nobody really cares about most of them, but some of them actually
// predate Unicode, dating back to [ISO-8859-1][3], apparently also
// known as "Latin-1", which among other things [Windows-1252][4]
// largely coincides with, so Microsoft Word sometimes inserts them
// and they get copy-pasted into MathQuill.
//
// (Irrelevant but funny story: though not a superset of Latin-1 aka
// ISO-8859-1, Windows-1252 **is** a strict superset of the "closely
// related but distinct"[3] "ISO 8859-1" -- see the lack of a dash
// after "ISO"? Completely different character set, like elephants vs
// elephant seals, or "Zombies" vs "Zombie Redneck Torture Family".
// What kind of idiot would get them confused.
// People in fact got them confused so much, it was so common to
// mislabel Windows-1252 text as ISO-8859-1, that most modern web
// browsers and email clients treat the MIME charset of ISO-8859-1
// as actually Windows-1252, behavior now standard in the HTML5 spec.)
//
// [1]: http://en.wikipedia.org/wiki/Unicode_subscripts_andsuper_scripts
// [2]: http://en.wikipedia.org/wiki/Number_Forms
// [3]: http://en.wikipedia.org/wiki/ISO/IEC_8859-1
// [4]: http://en.wikipedia.org/wiki/Windows-1252
LatexCmds['\\u00b9'] = bind(LatexFragment, '^1');
LatexCmds['\\u00b2'] = bind(LatexFragment, '^2');
LatexCmds['\\u00b3'] = bind(LatexFragment, '^3');
LatexCmds['\\u00bc'] = bind(LatexFragment, '\\\\frac14');
LatexCmds['\\u00bd'] = bind(LatexFragment, '\\\\frac12');
LatexCmds['\\u00be'] = bind(LatexFragment, '\\\\frac34');

var PlusMinus = P(BinaryOperator, function(_) {
  _.init = VanillaSymbol.prototype.init;

  _.contactWeld = _.siblingCreated = _.siblingDeleted = function(opts, dir) {
    function determineOpClassType(node) {
      if (node[L]) {
        // If the left sibling is a binary operator or a separator (comma, semicolon, colon)
        // or an open bracket (open parenthesis, open square bracket)
        // consider the operator to be unary
        if (node[L] instanceof BinaryOperator || /^[,;:\\(\\[]$/.test(node[L].ctrlSeq)) {
          return '';
        }
      } else if (node.parent && node.parent.parent && node.parent.parent.isStyleBlock()) {
        //if we are in a style block at the leftmost edge, determine unary/binary based on
        //the style block
        //this allows style blocks to be transparent for unary/binary purposes
        return determineOpClassType(node.parent.parent);
      } else {
        return '';
      }

      return 'mq-binary-operator';
    };
    
    if (dir === R) return; // ignore if sibling only changed on the right
    this.jQ[0].className = determineOpClassType(this);
    return this;
  };
});

LatexCmds['+'] = bind(PlusMinus, '+', '+');
//yes, these are different dashes, I think one is an en dash and the other is a hyphen
LatexCmds['\\u2013'] = LatexCmds['-'] = bind(PlusMinus, '-', '&minus;');
LatexCmds['\\u00b1'] = LatexCmds.pm = LatexCmds.plusmn = LatexCmds.plusminus =
  bind(PlusMinus,'\\\\pm ','&plusmn;');
LatexCmds.mp = LatexCmds.mnplus = LatexCmds.minusplus =
  bind(PlusMinus,'\\\\mp ','&#8723;');

CharCmds['*'] = LatexCmds.sdot = LatexCmds.cdot =
  bind(BinaryOperator, '\\\\cdot ', '&middot;', '*');
//semantically should be &sdot;, but &middot; looks better

var Inequality = P(BinaryOperator, function(_, super_) {
  _.init = function(data, strict) {
    this.data = data;
    this.strict = strict;
    var strictness = (strict ? 'Strict' : '');
    super_.init.call(this, data['ctrlSeq'+strictness], data['html'+strictness],
                     data['text'+strictness]);
  };
  _.swap = function(strict) {
    this.strict = strict;
    var strictness = (strict ? 'Strict' : '');
    this.ctrlSeq = this.data['ctrlSeq'+strictness];
    this.jQ.html(this.data['html'+strictness]);
    this.textTemplate = [ this.data['text'+strictness] ];
  };
  _.deleteTowards = function(dir, cursor) {
    if (dir === L && !this.strict) {
      this.swap(true);
      this.bubble('reflow');
      return;
    }
    super_.deleteTowards.apply(this, arguments);
  };
});

var less = { ctrlSeq: '\\\\le ', html: '&le;', text: '\\u2264',
             ctrlSeqStrict: '<', htmlStrict: '&lt;', textStrict: '<' };
var greater = { ctrlSeq: '\\\\ge ', html: '&ge;', text: '\\u2265',
                ctrlSeqStrict: '>', htmlStrict: '&gt;', textStrict: '>' };

LatexCmds['<'] = LatexCmds.lt = bind(Inequality, less, true);
LatexCmds['>'] = LatexCmds.gt = bind(Inequality, greater, true);
LatexCmds['\\u2264'] = LatexCmds.le = LatexCmds.leq = bind(Inequality, less, false);
LatexCmds['\\u2265'] = LatexCmds.ge = LatexCmds.geq = bind(Inequality, greater, false);

var Equality = P(BinaryOperator, function(_, super_) {
  _.init = function() {
    super_.init.call(this, '=', '=');
  };
  _.createLeftOf = function(cursor) {
    if (cursor[L] instanceof Inequality && cursor[L].strict) {
      cursor[L].swap(false);
      cursor[L].bubble('reflow');
      return;
    }
    super_.createLeftOf.apply(this, arguments);
  };
});
LatexCmds['='] = Equality;

LatexCmds['\\u00d7'] = LatexCmds.times = bind(BinaryOperator, '\\\\times ', '&times;', '[x]');

LatexCmds['\\u00f7'] = LatexCmds.div = LatexCmds.divide = LatexCmds.divides =
  bind(BinaryOperator,'\\\\div ','&divide;', '[/]');

CharCmds['~'] = LatexCmds.sim = bind(BinaryOperator, '\\\\sim ', '~', '~');
var MQ1 = getInterface(1);
for (var key in MQ1) (function(key, val) {
  if (typeof val === 'function') {
    MathQuill[key] = function() {
      insistOnInterVer();
      return val.apply(this, arguments);
    };
    MathQuill[key].prototype = val.prototype;
  }
  else MathQuill[key] = val;
}(key, MQ1[key]));

}());

/*** EXPORTS FROM exports-loader ***/
module.exports = window.MathQuill;


//# sourceURL=webpack://MathquillComponent/./node_modules/@edtr-io/mathquill/build/mathquill.js?`);
              }
            ),
            /***/
            "./node_modules/jquery/dist/jquery.js": (
              /*!********************************************!*\
                !*** ./node_modules/jquery/dist/jquery.js ***!
                \********************************************/
              /***/
              function(module, exports) {
                eval(`var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
 * jQuery JavaScript Library v3.6.0
 * https://jquery.com/
 *
 * Includes Sizzle.js
 * https://sizzlejs.com/
 *
 * Copyright OpenJS Foundation and other contributors
 * Released under the MIT license
 * https://jquery.org/license
 *
 * Date: 2021-03-02T17:08Z
 */
( function( global, factory ) {

	"use strict";

	if (  true && typeof module.exports === "object" ) {

		// For CommonJS and CommonJS-like environments where a proper \`window\`
		// is present, execute the factory and get jQuery.
		// For environments that do not have a \`window\` with a \`document\`
		// (such as Node.js), expose a factory as module.exports.
		// This accentuates the need for the creation of a real \`window\`.
		// e.g. var jQuery = require("jquery")(window);
		// See ticket #14549 for more info.
		module.exports = global.document ?
			factory( global, true ) :
			function( w ) {
				if ( !w.document ) {
					throw new Error( "jQuery requires a window with a document" );
				}
				return factory( w );
			};
	} else {
		factory( global );
	}

// Pass this if window is not defined yet
} )( typeof window !== "undefined" ? window : this, function( window, noGlobal ) {

// Edge <= 12 - 13+, Firefox <=18 - 45+, IE 10 - 11, Safari 5.1 - 9+, iOS 6 - 9.1
// throw exceptions when non-strict code (e.g., ASP.NET 4.5) accesses strict mode
// arguments.callee.caller (trac-13335). But as of jQuery 3.0 (2016), strict mode should be common
// enough that all such attempts are guarded in a try block.
"use strict";

var arr = [];

var getProto = Object.getPrototypeOf;

var slice = arr.slice;

var flat = arr.flat ? function( array ) {
	return arr.flat.call( array );
} : function( array ) {
	return arr.concat.apply( [], array );
};


var push = arr.push;

var indexOf = arr.indexOf;

var class2type = {};

var toString = class2type.toString;

var hasOwn = class2type.hasOwnProperty;

var fnToString = hasOwn.toString;

var ObjectFunctionString = fnToString.call( Object );

var support = {};

var isFunction = function isFunction( obj ) {

		// Support: Chrome <=57, Firefox <=52
		// In some browsers, typeof returns "function" for HTML <object> elements
		// (i.e., \`typeof document.createElement( "object" ) === "function"\`).
		// We don't want to classify *any* DOM node as a function.
		// Support: QtWeb <=3.8.5, WebKit <=534.34, wkhtmltopdf tool <=0.12.5
		// Plus for old WebKit, typeof returns "function" for HTML collections
		// (e.g., \`typeof document.getElementsByTagName("div") === "function"\`). (gh-4756)
		return typeof obj === "function" && typeof obj.nodeType !== "number" &&
			typeof obj.item !== "function";
	};


var isWindow = function isWindow( obj ) {
		return obj != null && obj === obj.window;
	};


var document = window.document;



	var preservedScriptAttributes = {
		type: true,
		src: true,
		nonce: true,
		noModule: true
	};

	function DOMEval( code, node, doc ) {
		doc = doc || document;

		var i, val,
			script = doc.createElement( "script" );

		script.text = code;
		if ( node ) {
			for ( i in preservedScriptAttributes ) {

				// Support: Firefox 64+, Edge 18+
				// Some browsers don't support the "nonce" property on scripts.
				// On the other hand, just using \`getAttribute\` is not enough as
				// the \`nonce\` attribute is reset to an empty string whenever it
				// becomes browsing-context connected.
				// See https://github.com/whatwg/html/issues/2369
				// See https://html.spec.whatwg.org/#nonce-attributes
				// The \`node.getAttribute\` check was added for the sake of
				// \`jQuery.globalEval\` so that it can fake a nonce-containing node
				// via an object.
				val = node[ i ] || node.getAttribute && node.getAttribute( i );
				if ( val ) {
					script.setAttribute( i, val );
				}
			}
		}
		doc.head.appendChild( script ).parentNode.removeChild( script );
	}


function toType( obj ) {
	if ( obj == null ) {
		return obj + "";
	}

	// Support: Android <=2.3 only (functionish RegExp)
	return typeof obj === "object" || typeof obj === "function" ?
		class2type[ toString.call( obj ) ] || "object" :
		typeof obj;
}
/* global Symbol */
// Defining this global in .eslintrc.json would create a danger of using the global
// unguarded in another place, it seems safer to define global only for this module



var
	version = "3.6.0",

	// Define a local copy of jQuery
	jQuery = function( selector, context ) {

		// The jQuery object is actually just the init constructor 'enhanced'
		// Need init if jQuery is called (just allow error to be thrown if not included)
		return new jQuery.fn.init( selector, context );
	};

jQuery.fn = jQuery.prototype = {

	// The current version of jQuery being used
	jquery: version,

	constructor: jQuery,

	// The default length of a jQuery object is 0
	length: 0,

	toArray: function() {
		return slice.call( this );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {

		// Return all the elements in a clean array
		if ( num == null ) {
			return slice.call( this );
		}

		// Return just the one element from the set
		return num < 0 ? this[ num + this.length ] : this[ num ];
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems ) {

		// Build a new jQuery matched element set
		var ret = jQuery.merge( this.constructor(), elems );

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	each: function( callback ) {
		return jQuery.each( this, callback );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map( this, function( elem, i ) {
			return callback.call( elem, i, elem );
		} ) );
	},

	slice: function() {
		return this.pushStack( slice.apply( this, arguments ) );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	even: function() {
		return this.pushStack( jQuery.grep( this, function( _elem, i ) {
			return ( i + 1 ) % 2;
		} ) );
	},

	odd: function() {
		return this.pushStack( jQuery.grep( this, function( _elem, i ) {
			return i % 2;
		} ) );
	},

	eq: function( i ) {
		var len = this.length,
			j = +i + ( i < 0 ? len : 0 );
		return this.pushStack( j >= 0 && j < len ? [ this[ j ] ] : [] );
	},

	end: function() {
		return this.prevObject || this.constructor();
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: push,
	sort: arr.sort,
	splice: arr.splice
};

jQuery.extend = jQuery.fn.extend = function() {
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[ 0 ] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;

		// Skip the boolean and the target
		target = arguments[ i ] || {};
		i++;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !isFunction( target ) ) {
		target = {};
	}

	// Extend jQuery itself if only one argument is passed
	if ( i === length ) {
		target = this;
		i--;
	}

	for ( ; i < length; i++ ) {

		// Only deal with non-null/undefined values
		if ( ( options = arguments[ i ] ) != null ) {

			// Extend the base object
			for ( name in options ) {
				copy = options[ name ];

				// Prevent Object.prototype pollution
				// Prevent never-ending loop
				if ( name === "__proto__" || target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject( copy ) ||
					( copyIsArray = Array.isArray( copy ) ) ) ) {
					src = target[ name ];

					// Ensure proper type for the source value
					if ( copyIsArray && !Array.isArray( src ) ) {
						clone = [];
					} else if ( !copyIsArray && !jQuery.isPlainObject( src ) ) {
						clone = {};
					} else {
						clone = src;
					}
					copyIsArray = false;

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend( {

	// Unique for each copy of jQuery on the page
	expando: "jQuery" + ( version + Math.random() ).replace( /\\D/g, "" ),

	// Assume jQuery is ready without the ready module
	isReady: true,

	error: function( msg ) {
		throw new Error( msg );
	},

	noop: function() {},

	isPlainObject: function( obj ) {
		var proto, Ctor;

		// Detect obvious negatives
		// Use toString instead of jQuery.type to catch host objects
		if ( !obj || toString.call( obj ) !== "[object Object]" ) {
			return false;
		}

		proto = getProto( obj );

		// Objects with no prototype (e.g., \`Object.create( null )\`) are plain
		if ( !proto ) {
			return true;
		}

		// Objects with prototype are plain iff they were constructed by a global Object function
		Ctor = hasOwn.call( proto, "constructor" ) && proto.constructor;
		return typeof Ctor === "function" && fnToString.call( Ctor ) === ObjectFunctionString;
	},

	isEmptyObject: function( obj ) {
		var name;

		for ( name in obj ) {
			return false;
		}
		return true;
	},

	// Evaluates a script in a provided context; falls back to the global one
	// if not specified.
	globalEval: function( code, options, doc ) {
		DOMEval( code, { nonce: options && options.nonce }, doc );
	},

	each: function( obj, callback ) {
		var length, i = 0;

		if ( isArrayLike( obj ) ) {
			length = obj.length;
			for ( ; i < length; i++ ) {
				if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
					break;
				}
			}
		} else {
			for ( i in obj ) {
				if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
					break;
				}
			}
		}

		return obj;
	},

	// results is for internal usage only
	makeArray: function( arr, results ) {
		var ret = results || [];

		if ( arr != null ) {
			if ( isArrayLike( Object( arr ) ) ) {
				jQuery.merge( ret,
					typeof arr === "string" ?
						[ arr ] : arr
				);
			} else {
				push.call( ret, arr );
			}
		}

		return ret;
	},

	inArray: function( elem, arr, i ) {
		return arr == null ? -1 : indexOf.call( arr, elem, i );
	},

	// Support: Android <=4.0 only, PhantomJS 1 only
	// push.apply(_, arraylike) throws on ancient WebKit
	merge: function( first, second ) {
		var len = +second.length,
			j = 0,
			i = first.length;

		for ( ; j < len; j++ ) {
			first[ i++ ] = second[ j ];
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, invert ) {
		var callbackInverse,
			matches = [],
			i = 0,
			length = elems.length,
			callbackExpect = !invert;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( ; i < length; i++ ) {
			callbackInverse = !callback( elems[ i ], i );
			if ( callbackInverse !== callbackExpect ) {
				matches.push( elems[ i ] );
			}
		}

		return matches;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var length, value,
			i = 0,
			ret = [];

		// Go through the array, translating each of the items to their new values
		if ( isArrayLike( elems ) ) {
			length = elems.length;
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}

		// Go through every key on the object,
		} else {
			for ( i in elems ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}
		}

		// Flatten any nested arrays
		return flat( ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// jQuery.support is not used in Core but other projects attach their
	// properties to it so it needs to exist.
	support: support
} );

if ( typeof Symbol === "function" ) {
	jQuery.fn[ Symbol.iterator ] = arr[ Symbol.iterator ];
}

// Populate the class2type map
jQuery.each( "Boolean Number String Function Array Date RegExp Object Error Symbol".split( " " ),
	function( _i, name ) {
		class2type[ "[object " + name + "]" ] = name.toLowerCase();
	} );

function isArrayLike( obj ) {

	// Support: real iOS 8.2 only (not reproducible in simulator)
	// \`in\` check used to prevent JIT error (gh-2145)
	// hasOwn isn't used here due to false negatives
	// regarding Nodelist length in IE
	var length = !!obj && "length" in obj && obj.length,
		type = toType( obj );

	if ( isFunction( obj ) || isWindow( obj ) ) {
		return false;
	}

	return type === "array" || length === 0 ||
		typeof length === "number" && length > 0 && ( length - 1 ) in obj;
}
var Sizzle =
/*!
 * Sizzle CSS Selector Engine v2.3.6
 * https://sizzlejs.com/
 *
 * Copyright JS Foundation and other contributors
 * Released under the MIT license
 * https://js.foundation/
 *
 * Date: 2021-02-16
 */
( function( window ) {
var i,
	support,
	Expr,
	getText,
	isXML,
	tokenize,
	compile,
	select,
	outermostContext,
	sortInput,
	hasDuplicate,

	// Local document vars
	setDocument,
	document,
	docElem,
	documentIsHTML,
	rbuggyQSA,
	rbuggyMatches,
	matches,
	contains,

	// Instance-specific data
	expando = "sizzle" + 1 * new Date(),
	preferredDoc = window.document,
	dirruns = 0,
	done = 0,
	classCache = createCache(),
	tokenCache = createCache(),
	compilerCache = createCache(),
	nonnativeSelectorCache = createCache(),
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
		}
		return 0;
	},

	// Instance methods
	hasOwn = ( {} ).hasOwnProperty,
	arr = [],
	pop = arr.pop,
	pushNative = arr.push,
	push = arr.push,
	slice = arr.slice,

	// Use a stripped-down indexOf as it's faster than native
	// https://jsperf.com/thor-indexof-vs-for/5
	indexOf = function( list, elem ) {
		var i = 0,
			len = list.length;
		for ( ; i < len; i++ ) {
			if ( list[ i ] === elem ) {
				return i;
			}
		}
		return -1;
	},

	booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|" +
		"ismap|loop|multiple|open|readonly|required|scoped",

	// Regular expressions

	// http://www.w3.org/TR/css3-selectors/#whitespace
	whitespace = "[\\\\x20\\\\t\\\\r\\\\n\\\\f]",

	// https://www.w3.org/TR/css-syntax-3/#ident-token-diagram
	identifier = "(?:\\\\\\\\[\\\\da-fA-F]{1,6}" + whitespace +
		"?|\\\\\\\\[^\\\\r\\\\n\\\\f]|[\\\\w-]|[^\\0-\\\\x7f])+",

	// Attribute selectors: http://www.w3.org/TR/selectors/#attribute-selectors
	attributes = "\\\\[" + whitespace + "*(" + identifier + ")(?:" + whitespace +

		// Operator (capture 2)
		"*([*^$|!~]?=)" + whitespace +

		// "Attribute values must be CSS identifiers [capture 5]
		// or strings [capture 3 or capture 4]"
		"*(?:'((?:\\\\\\\\.|[^\\\\\\\\'])*)'|\\"((?:\\\\\\\\.|[^\\\\\\\\\\"])*)\\"|(" + identifier + "))|)" +
		whitespace + "*\\\\]",

	pseudos = ":(" + identifier + ")(?:\\\\((" +

		// To reduce the number of selectors needing tokenize in the preFilter, prefer arguments:
		// 1. quoted (capture 3; capture 4 or capture 5)
		"('((?:\\\\\\\\.|[^\\\\\\\\'])*)'|\\"((?:\\\\\\\\.|[^\\\\\\\\\\"])*)\\")|" +

		// 2. simple (capture 6)
		"((?:\\\\\\\\.|[^\\\\\\\\()[\\\\]]|" + attributes + ")*)|" +

		// 3. anything else (capture 2)
		".*" +
		")\\\\)|)",

	// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
	rwhitespace = new RegExp( whitespace + "+", "g" ),
	rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\\\\\])(?:\\\\\\\\.)*)" +
		whitespace + "+$", "g" ),

	rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
	rcombinators = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace +
		"*" ),
	rdescend = new RegExp( whitespace + "|>" ),

	rpseudo = new RegExp( pseudos ),
	ridentifier = new RegExp( "^" + identifier + "$" ),

	matchExpr = {
		"ID": new RegExp( "^#(" + identifier + ")" ),
		"CLASS": new RegExp( "^\\\\.(" + identifier + ")" ),
		"TAG": new RegExp( "^(" + identifier + "|[*])" ),
		"ATTR": new RegExp( "^" + attributes ),
		"PSEUDO": new RegExp( "^" + pseudos ),
		"CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\\\(" +
			whitespace + "*(even|odd|(([+-]|)(\\\\d*)n|)" + whitespace + "*(?:([+-]|)" +
			whitespace + "*(\\\\d+)|))" + whitespace + "*\\\\)|)", "i" ),
		"bool": new RegExp( "^(?:" + booleans + ")$", "i" ),

		// For use in libraries implementing .is()
		// We use this for POS matching in \`select\`
		"needsContext": new RegExp( "^" + whitespace +
			"*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\\\(" + whitespace +
			"*((?:-\\\\d)?\\\\d*)" + whitespace + "*\\\\)|)(?=[^-]|$)", "i" )
	},

	rhtml = /HTML$/i,
	rinputs = /^(?:input|select|textarea|button)$/i,
	rheader = /^h\\d$/i,

	rnative = /^[^{]+\\{\\s*\\[native \\w/,

	// Easily-parseable/retrievable ID or TAG or CLASS selectors
	rquickExpr = /^(?:#([\\w-]+)|(\\w+)|\\.([\\w-]+))$/,

	rsibling = /[+~]/,

	// CSS escapes
	// http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
	runescape = new RegExp( "\\\\\\\\[\\\\da-fA-F]{1,6}" + whitespace + "?|\\\\\\\\([^\\\\r\\\\n\\\\f])", "g" ),
	funescape = function( escape, nonHex ) {
		var high = "0x" + escape.slice( 1 ) - 0x10000;

		return nonHex ?

			// Strip the backslash prefix from a non-hex escape sequence
			nonHex :

			// Replace a hexadecimal escape sequence with the encoded Unicode code point
			// Support: IE <=11+
			// For values outside the Basic Multilingual Plane (BMP), manually construct a
			// surrogate pair
			high < 0 ?
				String.fromCharCode( high + 0x10000 ) :
				String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
	},

	// CSS string/identifier serialization
	// https://drafts.csswg.org/cssom/#common-serializing-idioms
	rcssescape = /([\\0-\\x1f\\x7f]|^-?\\d)|^-$|[^\\0-\\x1f\\x7f-\\uFFFF\\w-]/g,
	fcssescape = function( ch, asCodePoint ) {
		if ( asCodePoint ) {

			// U+0000 NULL becomes U+FFFD REPLACEMENT CHARACTER
			if ( ch === "\\0" ) {
				return "\\uFFFD";
			}

			// Control characters and (dependent upon position) numbers get escaped as code points
			return ch.slice( 0, -1 ) + "\\\\" +
				ch.charCodeAt( ch.length - 1 ).toString( 16 ) + " ";
		}

		// Other potentially-special ASCII characters get backslash-escaped
		return "\\\\" + ch;
	},

	// Used for iframes
	// See setDocument()
	// Removing the function wrapper causes a "Permission Denied"
	// error in IE
	unloadHandler = function() {
		setDocument();
	},

	inDisabledFieldset = addCombinator(
		function( elem ) {
			return elem.disabled === true && elem.nodeName.toLowerCase() === "fieldset";
		},
		{ dir: "parentNode", next: "legend" }
	);

// Optimize for push.apply( _, NodeList )
try {
	push.apply(
		( arr = slice.call( preferredDoc.childNodes ) ),
		preferredDoc.childNodes
	);

	// Support: Android<4.0
	// Detect silently failing push.apply
	// eslint-disable-next-line no-unused-expressions
	arr[ preferredDoc.childNodes.length ].nodeType;
} catch ( e ) {
	push = { apply: arr.length ?

		// Leverage slice if possible
		function( target, els ) {
			pushNative.apply( target, slice.call( els ) );
		} :

		// Support: IE<9
		// Otherwise append directly
		function( target, els ) {
			var j = target.length,
				i = 0;

			// Can't trust NodeList.length
			while ( ( target[ j++ ] = els[ i++ ] ) ) {}
			target.length = j - 1;
		}
	};
}

function Sizzle( selector, context, results, seed ) {
	var m, i, elem, nid, match, groups, newSelector,
		newContext = context && context.ownerDocument,

		// nodeType defaults to 9, since context defaults to document
		nodeType = context ? context.nodeType : 9;

	results = results || [];

	// Return early from calls with invalid selector or context
	if ( typeof selector !== "string" || !selector ||
		nodeType !== 1 && nodeType !== 9 && nodeType !== 11 ) {

		return results;
	}

	// Try to shortcut find operations (as opposed to filters) in HTML documents
	if ( !seed ) {
		setDocument( context );
		context = context || document;

		if ( documentIsHTML ) {

			// If the selector is sufficiently simple, try using a "get*By*" DOM method
			// (excepting DocumentFragment context, where the methods don't exist)
			if ( nodeType !== 11 && ( match = rquickExpr.exec( selector ) ) ) {

				// ID selector
				if ( ( m = match[ 1 ] ) ) {

					// Document context
					if ( nodeType === 9 ) {
						if ( ( elem = context.getElementById( m ) ) ) {

							// Support: IE, Opera, Webkit
							// TODO: identify versions
							// getElementById can match elements by name instead of ID
							if ( elem.id === m ) {
								results.push( elem );
								return results;
							}
						} else {
							return results;
						}

					// Element context
					} else {

						// Support: IE, Opera, Webkit
						// TODO: identify versions
						// getElementById can match elements by name instead of ID
						if ( newContext && ( elem = newContext.getElementById( m ) ) &&
							contains( context, elem ) &&
							elem.id === m ) {

							results.push( elem );
							return results;
						}
					}

				// Type selector
				} else if ( match[ 2 ] ) {
					push.apply( results, context.getElementsByTagName( selector ) );
					return results;

				// Class selector
				} else if ( ( m = match[ 3 ] ) && support.getElementsByClassName &&
					context.getElementsByClassName ) {

					push.apply( results, context.getElementsByClassName( m ) );
					return results;
				}
			}

			// Take advantage of querySelectorAll
			if ( support.qsa &&
				!nonnativeSelectorCache[ selector + " " ] &&
				( !rbuggyQSA || !rbuggyQSA.test( selector ) ) &&

				// Support: IE 8 only
				// Exclude object elements
				( nodeType !== 1 || context.nodeName.toLowerCase() !== "object" ) ) {

				newSelector = selector;
				newContext = context;

				// qSA considers elements outside a scoping root when evaluating child or
				// descendant combinators, which is not what we want.
				// In such cases, we work around the behavior by prefixing every selector in the
				// list with an ID selector referencing the scope context.
				// The technique has to be used as well when a leading combinator is used
				// as such selectors are not recognized by querySelectorAll.
				// Thanks to Andrew Dupont for this technique.
				if ( nodeType === 1 &&
					( rdescend.test( selector ) || rcombinators.test( selector ) ) ) {

					// Expand context for sibling selectors
					newContext = rsibling.test( selector ) && testContext( context.parentNode ) ||
						context;

					// We can use :scope instead of the ID hack if the browser
					// supports it & if we're not changing the context.
					if ( newContext !== context || !support.scope ) {

						// Capture the context ID, setting it first if necessary
						if ( ( nid = context.getAttribute( "id" ) ) ) {
							nid = nid.replace( rcssescape, fcssescape );
						} else {
							context.setAttribute( "id", ( nid = expando ) );
						}
					}

					// Prefix every selector in the list
					groups = tokenize( selector );
					i = groups.length;
					while ( i-- ) {
						groups[ i ] = ( nid ? "#" + nid : ":scope" ) + " " +
							toSelector( groups[ i ] );
					}
					newSelector = groups.join( "," );
				}

				try {
					push.apply( results,
						newContext.querySelectorAll( newSelector )
					);
					return results;
				} catch ( qsaError ) {
					nonnativeSelectorCache( selector, true );
				} finally {
					if ( nid === expando ) {
						context.removeAttribute( "id" );
					}
				}
			}
		}
	}

	// All others
	return select( selector.replace( rtrim, "$1" ), context, results, seed );
}

/**
 * Create key-value caches of limited size
 * @returns {function(string, object)} Returns the Object data after storing it on itself with
 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
 *	deleting the oldest entry
 */
function createCache() {
	var keys = [];

	function cache( key, value ) {

		// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
		if ( keys.push( key + " " ) > Expr.cacheLength ) {

			// Only keep the most recent entries
			delete cache[ keys.shift() ];
		}
		return ( cache[ key + " " ] = value );
	}
	return cache;
}

/**
 * Mark a function for special use by Sizzle
 * @param {Function} fn The function to mark
 */
function markFunction( fn ) {
	fn[ expando ] = true;
	return fn;
}

/**
 * Support testing using an element
 * @param {Function} fn Passed the created element and returns a boolean result
 */
function assert( fn ) {
	var el = document.createElement( "fieldset" );

	try {
		return !!fn( el );
	} catch ( e ) {
		return false;
	} finally {

		// Remove from its parent by default
		if ( el.parentNode ) {
			el.parentNode.removeChild( el );
		}

		// release memory in IE
		el = null;
	}
}

/**
 * Adds the same handler for all of the specified attrs
 * @param {String} attrs Pipe-separated list of attributes
 * @param {Function} handler The method that will be applied
 */
function addHandle( attrs, handler ) {
	var arr = attrs.split( "|" ),
		i = arr.length;

	while ( i-- ) {
		Expr.attrHandle[ arr[ i ] ] = handler;
	}
}

/**
 * Checks document order of two siblings
 * @param {Element} a
 * @param {Element} b
 * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
 */
function siblingCheck( a, b ) {
	var cur = b && a,
		diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
			a.sourceIndex - b.sourceIndex;

	// Use IE sourceIndex if available on both nodes
	if ( diff ) {
		return diff;
	}

	// Check if b follows a
	if ( cur ) {
		while ( ( cur = cur.nextSibling ) ) {
			if ( cur === b ) {
				return -1;
			}
		}
	}

	return a ? 1 : -1;
}

/**
 * Returns a function to use in pseudos for input types
 * @param {String} type
 */
function createInputPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return name === "input" && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for buttons
 * @param {String} type
 */
function createButtonPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return ( name === "input" || name === "button" ) && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for :enabled/:disabled
 * @param {Boolean} disabled true for :disabled; false for :enabled
 */
function createDisabledPseudo( disabled ) {

	// Known :disabled false positives: fieldset[disabled] > legend:nth-of-type(n+2) :can-disable
	return function( elem ) {

		// Only certain elements can match :enabled or :disabled
		// https://html.spec.whatwg.org/multipage/scripting.html#selector-enabled
		// https://html.spec.whatwg.org/multipage/scripting.html#selector-disabled
		if ( "form" in elem ) {

			// Check for inherited disabledness on relevant non-disabled elements:
			// * listed form-associated elements in a disabled fieldset
			//   https://html.spec.whatwg.org/multipage/forms.html#category-listed
			//   https://html.spec.whatwg.org/multipage/forms.html#concept-fe-disabled
			// * option elements in a disabled optgroup
			//   https://html.spec.whatwg.org/multipage/forms.html#concept-option-disabled
			// All such elements have a "form" property.
			if ( elem.parentNode && elem.disabled === false ) {

				// Option elements defer to a parent optgroup if present
				if ( "label" in elem ) {
					if ( "label" in elem.parentNode ) {
						return elem.parentNode.disabled === disabled;
					} else {
						return elem.disabled === disabled;
					}
				}

				// Support: IE 6 - 11
				// Use the isDisabled shortcut property to check for disabled fieldset ancestors
				return elem.isDisabled === disabled ||

					// Where there is no isDisabled, check manually
					/* jshint -W018 */
					elem.isDisabled !== !disabled &&
					inDisabledFieldset( elem ) === disabled;
			}

			return elem.disabled === disabled;

		// Try to winnow out elements that can't be disabled before trusting the disabled property.
		// Some victims get caught in our net (label, legend, menu, track), but it shouldn't
		// even exist on them, let alone have a boolean value.
		} else if ( "label" in elem ) {
			return elem.disabled === disabled;
		}

		// Remaining elements are neither :enabled nor :disabled
		return false;
	};
}

/**
 * Returns a function to use in pseudos for positionals
 * @param {Function} fn
 */
function createPositionalPseudo( fn ) {
	return markFunction( function( argument ) {
		argument = +argument;
		return markFunction( function( seed, matches ) {
			var j,
				matchIndexes = fn( [], seed.length, argument ),
				i = matchIndexes.length;

			// Match elements found at the specified indexes
			while ( i-- ) {
				if ( seed[ ( j = matchIndexes[ i ] ) ] ) {
					seed[ j ] = !( matches[ j ] = seed[ j ] );
				}
			}
		} );
	} );
}

/**
 * Checks a node for validity as a Sizzle context
 * @param {Element|Object=} context
 * @returns {Element|Object|Boolean} The input node if acceptable, otherwise a falsy value
 */
function testContext( context ) {
	return context && typeof context.getElementsByTagName !== "undefined" && context;
}

// Expose support vars for convenience
support = Sizzle.support = {};

/**
 * Detects XML nodes
 * @param {Element|Object} elem An element or a document
 * @returns {Boolean} True iff elem is a non-HTML XML node
 */
isXML = Sizzle.isXML = function( elem ) {
	var namespace = elem && elem.namespaceURI,
		docElem = elem && ( elem.ownerDocument || elem ).documentElement;

	// Support: IE <=8
	// Assume HTML when documentElement doesn't yet exist, such as inside loading iframes
	// https://bugs.jquery.com/ticket/4833
	return !rhtml.test( namespace || docElem && docElem.nodeName || "HTML" );
};

/**
 * Sets document-related variables once based on the current document
 * @param {Element|Object} [doc] An element or document object to use to set the document
 * @returns {Object} Returns the current document
 */
setDocument = Sizzle.setDocument = function( node ) {
	var hasCompare, subWindow,
		doc = node ? node.ownerDocument || node : preferredDoc;

	// Return early if doc is invalid or already selected
	// Support: IE 11+, Edge 17 - 18+
	// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
	// two documents; shallow comparisons work.
	// eslint-disable-next-line eqeqeq
	if ( doc == document || doc.nodeType !== 9 || !doc.documentElement ) {
		return document;
	}

	// Update global variables
	document = doc;
	docElem = document.documentElement;
	documentIsHTML = !isXML( document );

	// Support: IE 9 - 11+, Edge 12 - 18+
	// Accessing iframe documents after unload throws "permission denied" errors (jQuery #13936)
	// Support: IE 11+, Edge 17 - 18+
	// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
	// two documents; shallow comparisons work.
	// eslint-disable-next-line eqeqeq
	if ( preferredDoc != document &&
		( subWindow = document.defaultView ) && subWindow.top !== subWindow ) {

		// Support: IE 11, Edge
		if ( subWindow.addEventListener ) {
			subWindow.addEventListener( "unload", unloadHandler, false );

		// Support: IE 9 - 10 only
		} else if ( subWindow.attachEvent ) {
			subWindow.attachEvent( "onunload", unloadHandler );
		}
	}

	// Support: IE 8 - 11+, Edge 12 - 18+, Chrome <=16 - 25 only, Firefox <=3.6 - 31 only,
	// Safari 4 - 5 only, Opera <=11.6 - 12.x only
	// IE/Edge & older browsers don't support the :scope pseudo-class.
	// Support: Safari 6.0 only
	// Safari 6.0 supports :scope but it's an alias of :root there.
	support.scope = assert( function( el ) {
		docElem.appendChild( el ).appendChild( document.createElement( "div" ) );
		return typeof el.querySelectorAll !== "undefined" &&
			!el.querySelectorAll( ":scope fieldset div" ).length;
	} );

	/* Attributes
	---------------------------------------------------------------------- */

	// Support: IE<8
	// Verify that getAttribute really returns attributes and not properties
	// (excepting IE8 booleans)
	support.attributes = assert( function( el ) {
		el.className = "i";
		return !el.getAttribute( "className" );
	} );

	/* getElement(s)By*
	---------------------------------------------------------------------- */

	// Check if getElementsByTagName("*") returns only elements
	support.getElementsByTagName = assert( function( el ) {
		el.appendChild( document.createComment( "" ) );
		return !el.getElementsByTagName( "*" ).length;
	} );

	// Support: IE<9
	support.getElementsByClassName = rnative.test( document.getElementsByClassName );

	// Support: IE<10
	// Check if getElementById returns elements by name
	// The broken getElementById methods don't pick up programmatically-set names,
	// so use a roundabout getElementsByName test
	support.getById = assert( function( el ) {
		docElem.appendChild( el ).id = expando;
		return !document.getElementsByName || !document.getElementsByName( expando ).length;
	} );

	// ID filter and find
	if ( support.getById ) {
		Expr.filter[ "ID" ] = function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				return elem.getAttribute( "id" ) === attrId;
			};
		};
		Expr.find[ "ID" ] = function( id, context ) {
			if ( typeof context.getElementById !== "undefined" && documentIsHTML ) {
				var elem = context.getElementById( id );
				return elem ? [ elem ] : [];
			}
		};
	} else {
		Expr.filter[ "ID" ] =  function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				var node = typeof elem.getAttributeNode !== "undefined" &&
					elem.getAttributeNode( "id" );
				return node && node.value === attrId;
			};
		};

		// Support: IE 6 - 7 only
		// getElementById is not reliable as a find shortcut
		Expr.find[ "ID" ] = function( id, context ) {
			if ( typeof context.getElementById !== "undefined" && documentIsHTML ) {
				var node, i, elems,
					elem = context.getElementById( id );

				if ( elem ) {

					// Verify the id attribute
					node = elem.getAttributeNode( "id" );
					if ( node && node.value === id ) {
						return [ elem ];
					}

					// Fall back on getElementsByName
					elems = context.getElementsByName( id );
					i = 0;
					while ( ( elem = elems[ i++ ] ) ) {
						node = elem.getAttributeNode( "id" );
						if ( node && node.value === id ) {
							return [ elem ];
						}
					}
				}

				return [];
			}
		};
	}

	// Tag
	Expr.find[ "TAG" ] = support.getElementsByTagName ?
		function( tag, context ) {
			if ( typeof context.getElementsByTagName !== "undefined" ) {
				return context.getElementsByTagName( tag );

			// DocumentFragment nodes don't have gEBTN
			} else if ( support.qsa ) {
				return context.querySelectorAll( tag );
			}
		} :

		function( tag, context ) {
			var elem,
				tmp = [],
				i = 0,

				// By happy coincidence, a (broken) gEBTN appears on DocumentFragment nodes too
				results = context.getElementsByTagName( tag );

			// Filter out possible comments
			if ( tag === "*" ) {
				while ( ( elem = results[ i++ ] ) ) {
					if ( elem.nodeType === 1 ) {
						tmp.push( elem );
					}
				}

				return tmp;
			}
			return results;
		};

	// Class
	Expr.find[ "CLASS" ] = support.getElementsByClassName && function( className, context ) {
		if ( typeof context.getElementsByClassName !== "undefined" && documentIsHTML ) {
			return context.getElementsByClassName( className );
		}
	};

	/* QSA/matchesSelector
	---------------------------------------------------------------------- */

	// QSA and matchesSelector support

	// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
	rbuggyMatches = [];

	// qSa(:focus) reports false when true (Chrome 21)
	// We allow this because of a bug in IE8/9 that throws an error
	// whenever \`document.activeElement\` is accessed on an iframe
	// So, we allow :focus to pass through QSA all the time to avoid the IE error
	// See https://bugs.jquery.com/ticket/13378
	rbuggyQSA = [];

	if ( ( support.qsa = rnative.test( document.querySelectorAll ) ) ) {

		// Build QSA regex
		// Regex strategy adopted from Diego Perini
		assert( function( el ) {

			var input;

			// Select is set to empty string on purpose
			// This is to test IE's treatment of not explicitly
			// setting a boolean content attribute,
			// since its presence should be enough
			// https://bugs.jquery.com/ticket/12359
			docElem.appendChild( el ).innerHTML = "<a id='" + expando + "'></a>" +
				"<select id='" + expando + "-\\r\\\\' msallowcapture=''>" +
				"<option selected=''></option></select>";

			// Support: IE8, Opera 11-12.16
			// Nothing should be selected when empty strings follow ^= or $= or *=
			// The test attribute must be unknown in Opera but "safe" for WinRT
			// https://msdn.microsoft.com/en-us/library/ie/hh465388.aspx#attribute_section
			if ( el.querySelectorAll( "[msallowcapture^='']" ).length ) {
				rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:''|\\"\\")" );
			}

			// Support: IE8
			// Boolean attributes and "value" are not treated correctly
			if ( !el.querySelectorAll( "[selected]" ).length ) {
				rbuggyQSA.push( "\\\\[" + whitespace + "*(?:value|" + booleans + ")" );
			}

			// Support: Chrome<29, Android<4.4, Safari<7.0+, iOS<7.0+, PhantomJS<1.9.8+
			if ( !el.querySelectorAll( "[id~=" + expando + "-]" ).length ) {
				rbuggyQSA.push( "~=" );
			}

			// Support: IE 11+, Edge 15 - 18+
			// IE 11/Edge don't find elements on a \`[name='']\` query in some cases.
			// Adding a temporary attribute to the document before the selection works
			// around the issue.
			// Interestingly, IE 10 & older don't seem to have the issue.
			input = document.createElement( "input" );
			input.setAttribute( "name", "" );
			el.appendChild( input );
			if ( !el.querySelectorAll( "[name='']" ).length ) {
				rbuggyQSA.push( "\\\\[" + whitespace + "*name" + whitespace + "*=" +
					whitespace + "*(?:''|\\"\\")" );
			}

			// Webkit/Opera - :checked should return selected option elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			// IE8 throws error here and will not see later tests
			if ( !el.querySelectorAll( ":checked" ).length ) {
				rbuggyQSA.push( ":checked" );
			}

			// Support: Safari 8+, iOS 8+
			// https://bugs.webkit.org/show_bug.cgi?id=136851
			// In-page \`selector#id sibling-combinator selector\` fails
			if ( !el.querySelectorAll( "a#" + expando + "+*" ).length ) {
				rbuggyQSA.push( ".#.+[+~]" );
			}

			// Support: Firefox <=3.6 - 5 only
			// Old Firefox doesn't throw on a badly-escaped identifier.
			el.querySelectorAll( "\\\\\\f" );
			rbuggyQSA.push( "[\\\\r\\\\n\\\\f]" );
		} );

		assert( function( el ) {
			el.innerHTML = "<a href='' disabled='disabled'></a>" +
				"<select disabled='disabled'><option/></select>";

			// Support: Windows 8 Native Apps
			// The type and name attributes are restricted during .innerHTML assignment
			var input = document.createElement( "input" );
			input.setAttribute( "type", "hidden" );
			el.appendChild( input ).setAttribute( "name", "D" );

			// Support: IE8
			// Enforce case-sensitivity of name attribute
			if ( el.querySelectorAll( "[name=d]" ).length ) {
				rbuggyQSA.push( "name" + whitespace + "*[*^$|!~]?=" );
			}

			// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
			// IE8 throws error here and will not see later tests
			if ( el.querySelectorAll( ":enabled" ).length !== 2 ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Support: IE9-11+
			// IE's :disabled selector does not pick up the children of disabled fieldsets
			docElem.appendChild( el ).disabled = true;
			if ( el.querySelectorAll( ":disabled" ).length !== 2 ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Support: Opera 10 - 11 only
			// Opera 10-11 does not throw on post-comma invalid pseudos
			el.querySelectorAll( "*,:x" );
			rbuggyQSA.push( ",.*:" );
		} );
	}

	if ( ( support.matchesSelector = rnative.test( ( matches = docElem.matches ||
		docElem.webkitMatchesSelector ||
		docElem.mozMatchesSelector ||
		docElem.oMatchesSelector ||
		docElem.msMatchesSelector ) ) ) ) {

		assert( function( el ) {

			// Check to see if it's possible to do matchesSelector
			// on a disconnected node (IE 9)
			support.disconnectedMatch = matches.call( el, "*" );

			// This should fail with an exception
			// Gecko does not error, returns false instead
			matches.call( el, "[s!='']:x" );
			rbuggyMatches.push( "!=", pseudos );
		} );
	}

	rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join( "|" ) );
	rbuggyMatches = rbuggyMatches.length && new RegExp( rbuggyMatches.join( "|" ) );

	/* Contains
	---------------------------------------------------------------------- */
	hasCompare = rnative.test( docElem.compareDocumentPosition );

	// Element contains another
	// Purposefully self-exclusive
	// As in, an element does not contain itself
	contains = hasCompare || rnative.test( docElem.contains ) ?
		function( a, b ) {
			var adown = a.nodeType === 9 ? a.documentElement : a,
				bup = b && b.parentNode;
			return a === bup || !!( bup && bup.nodeType === 1 && (
				adown.contains ?
					adown.contains( bup ) :
					a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
			) );
		} :
		function( a, b ) {
			if ( b ) {
				while ( ( b = b.parentNode ) ) {
					if ( b === a ) {
						return true;
					}
				}
			}
			return false;
		};

	/* Sorting
	---------------------------------------------------------------------- */

	// Document order sorting
	sortOrder = hasCompare ?
	function( a, b ) {

		// Flag for duplicate removal
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		// Sort on method existence if only one input has compareDocumentPosition
		var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
		if ( compare ) {
			return compare;
		}

		// Calculate position if both inputs belong to the same document
		// Support: IE 11+, Edge 17 - 18+
		// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
		// two documents; shallow comparisons work.
		// eslint-disable-next-line eqeqeq
		compare = ( a.ownerDocument || a ) == ( b.ownerDocument || b ) ?
			a.compareDocumentPosition( b ) :

			// Otherwise we know they are disconnected
			1;

		// Disconnected nodes
		if ( compare & 1 ||
			( !support.sortDetached && b.compareDocumentPosition( a ) === compare ) ) {

			// Choose the first element that is related to our preferred document
			// Support: IE 11+, Edge 17 - 18+
			// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
			// two documents; shallow comparisons work.
			// eslint-disable-next-line eqeqeq
			if ( a == document || a.ownerDocument == preferredDoc &&
				contains( preferredDoc, a ) ) {
				return -1;
			}

			// Support: IE 11+, Edge 17 - 18+
			// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
			// two documents; shallow comparisons work.
			// eslint-disable-next-line eqeqeq
			if ( b == document || b.ownerDocument == preferredDoc &&
				contains( preferredDoc, b ) ) {
				return 1;
			}

			// Maintain original order
			return sortInput ?
				( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
				0;
		}

		return compare & 4 ? -1 : 1;
	} :
	function( a, b ) {

		// Exit early if the nodes are identical
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		var cur,
			i = 0,
			aup = a.parentNode,
			bup = b.parentNode,
			ap = [ a ],
			bp = [ b ];

		// Parentless nodes are either documents or disconnected
		if ( !aup || !bup ) {

			// Support: IE 11+, Edge 17 - 18+
			// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
			// two documents; shallow comparisons work.
			/* eslint-disable eqeqeq */
			return a == document ? -1 :
				b == document ? 1 :
				/* eslint-enable eqeqeq */
				aup ? -1 :
				bup ? 1 :
				sortInput ?
				( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
				0;

		// If the nodes are siblings, we can do a quick check
		} else if ( aup === bup ) {
			return siblingCheck( a, b );
		}

		// Otherwise we need full lists of their ancestors for comparison
		cur = a;
		while ( ( cur = cur.parentNode ) ) {
			ap.unshift( cur );
		}
		cur = b;
		while ( ( cur = cur.parentNode ) ) {
			bp.unshift( cur );
		}

		// Walk down the tree looking for a discrepancy
		while ( ap[ i ] === bp[ i ] ) {
			i++;
		}

		return i ?

			// Do a sibling check if the nodes have a common ancestor
			siblingCheck( ap[ i ], bp[ i ] ) :

			// Otherwise nodes in our document sort first
			// Support: IE 11+, Edge 17 - 18+
			// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
			// two documents; shallow comparisons work.
			/* eslint-disable eqeqeq */
			ap[ i ] == preferredDoc ? -1 :
			bp[ i ] == preferredDoc ? 1 :
			/* eslint-enable eqeqeq */
			0;
	};

	return document;
};

Sizzle.matches = function( expr, elements ) {
	return Sizzle( expr, null, null, elements );
};

Sizzle.matchesSelector = function( elem, expr ) {
	setDocument( elem );

	if ( support.matchesSelector && documentIsHTML &&
		!nonnativeSelectorCache[ expr + " " ] &&
		( !rbuggyMatches || !rbuggyMatches.test( expr ) ) &&
		( !rbuggyQSA     || !rbuggyQSA.test( expr ) ) ) {

		try {
			var ret = matches.call( elem, expr );

			// IE 9's matchesSelector returns false on disconnected nodes
			if ( ret || support.disconnectedMatch ||

				// As well, disconnected nodes are said to be in a document
				// fragment in IE 9
				elem.document && elem.document.nodeType !== 11 ) {
				return ret;
			}
		} catch ( e ) {
			nonnativeSelectorCache( expr, true );
		}
	}

	return Sizzle( expr, document, null, [ elem ] ).length > 0;
};

Sizzle.contains = function( context, elem ) {

	// Set document vars if needed
	// Support: IE 11+, Edge 17 - 18+
	// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
	// two documents; shallow comparisons work.
	// eslint-disable-next-line eqeqeq
	if ( ( context.ownerDocument || context ) != document ) {
		setDocument( context );
	}
	return contains( context, elem );
};

Sizzle.attr = function( elem, name ) {

	// Set document vars if needed
	// Support: IE 11+, Edge 17 - 18+
	// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
	// two documents; shallow comparisons work.
	// eslint-disable-next-line eqeqeq
	if ( ( elem.ownerDocument || elem ) != document ) {
		setDocument( elem );
	}

	var fn = Expr.attrHandle[ name.toLowerCase() ],

		// Don't get fooled by Object.prototype properties (jQuery #13807)
		val = fn && hasOwn.call( Expr.attrHandle, name.toLowerCase() ) ?
			fn( elem, name, !documentIsHTML ) :
			undefined;

	return val !== undefined ?
		val :
		support.attributes || !documentIsHTML ?
			elem.getAttribute( name ) :
			( val = elem.getAttributeNode( name ) ) && val.specified ?
				val.value :
				null;
};

Sizzle.escape = function( sel ) {
	return ( sel + "" ).replace( rcssescape, fcssescape );
};

Sizzle.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

/**
 * Document sorting and removing duplicates
 * @param {ArrayLike} results
 */
Sizzle.uniqueSort = function( results ) {
	var elem,
		duplicates = [],
		j = 0,
		i = 0;

	// Unless we *know* we can detect duplicates, assume their presence
	hasDuplicate = !support.detectDuplicates;
	sortInput = !support.sortStable && results.slice( 0 );
	results.sort( sortOrder );

	if ( hasDuplicate ) {
		while ( ( elem = results[ i++ ] ) ) {
			if ( elem === results[ i ] ) {
				j = duplicates.push( i );
			}
		}
		while ( j-- ) {
			results.splice( duplicates[ j ], 1 );
		}
	}

	// Clear input after sorting to release objects
	// See https://github.com/jquery/sizzle/pull/225
	sortInput = null;

	return results;
};

/**
 * Utility function for retrieving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
getText = Sizzle.getText = function( elem ) {
	var node,
		ret = "",
		i = 0,
		nodeType = elem.nodeType;

	if ( !nodeType ) {

		// If no nodeType, this is expected to be an array
		while ( ( node = elem[ i++ ] ) ) {

			// Do not traverse comment nodes
			ret += getText( node );
		}
	} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {

		// Use textContent for elements
		// innerText usage removed for consistency of new lines (jQuery #11153)
		if ( typeof elem.textContent === "string" ) {
			return elem.textContent;
		} else {

			// Traverse its children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				ret += getText( elem );
			}
		}
	} else if ( nodeType === 3 || nodeType === 4 ) {
		return elem.nodeValue;
	}

	// Do not include comment or processing instruction nodes

	return ret;
};

Expr = Sizzle.selectors = {

	// Can be adjusted by the user
	cacheLength: 50,

	createPseudo: markFunction,

	match: matchExpr,

	attrHandle: {},

	find: {},

	relative: {
		">": { dir: "parentNode", first: true },
		" ": { dir: "parentNode" },
		"+": { dir: "previousSibling", first: true },
		"~": { dir: "previousSibling" }
	},

	preFilter: {
		"ATTR": function( match ) {
			match[ 1 ] = match[ 1 ].replace( runescape, funescape );

			// Move the given value to match[3] whether quoted or unquoted
			match[ 3 ] = ( match[ 3 ] || match[ 4 ] ||
				match[ 5 ] || "" ).replace( runescape, funescape );

			if ( match[ 2 ] === "~=" ) {
				match[ 3 ] = " " + match[ 3 ] + " ";
			}

			return match.slice( 0, 4 );
		},

		"CHILD": function( match ) {

			/* matches from matchExpr["CHILD"]
				1 type (only|nth|...)
				2 what (child|of-type)
				3 argument (even|odd|\\d*|\\d*n([+-]\\d+)?|...)
				4 xn-component of xn+y argument ([+-]?\\d*n|)
				5 sign of xn-component
				6 x of xn-component
				7 sign of y-component
				8 y of y-component
			*/
			match[ 1 ] = match[ 1 ].toLowerCase();

			if ( match[ 1 ].slice( 0, 3 ) === "nth" ) {

				// nth-* requires argument
				if ( !match[ 3 ] ) {
					Sizzle.error( match[ 0 ] );
				}

				// numeric x and y parameters for Expr.filter.CHILD
				// remember that false/true cast respectively to 0/1
				match[ 4 ] = +( match[ 4 ] ?
					match[ 5 ] + ( match[ 6 ] || 1 ) :
					2 * ( match[ 3 ] === "even" || match[ 3 ] === "odd" ) );
				match[ 5 ] = +( ( match[ 7 ] + match[ 8 ] ) || match[ 3 ] === "odd" );

				// other types prohibit arguments
			} else if ( match[ 3 ] ) {
				Sizzle.error( match[ 0 ] );
			}

			return match;
		},

		"PSEUDO": function( match ) {
			var excess,
				unquoted = !match[ 6 ] && match[ 2 ];

			if ( matchExpr[ "CHILD" ].test( match[ 0 ] ) ) {
				return null;
			}

			// Accept quoted arguments as-is
			if ( match[ 3 ] ) {
				match[ 2 ] = match[ 4 ] || match[ 5 ] || "";

			// Strip excess characters from unquoted arguments
			} else if ( unquoted && rpseudo.test( unquoted ) &&

				// Get excess from tokenize (recursively)
				( excess = tokenize( unquoted, true ) ) &&

				// advance to the next closing parenthesis
				( excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length ) ) {

				// excess is a negative index
				match[ 0 ] = match[ 0 ].slice( 0, excess );
				match[ 2 ] = unquoted.slice( 0, excess );
			}

			// Return only captures needed by the pseudo filter method (type and argument)
			return match.slice( 0, 3 );
		}
	},

	filter: {

		"TAG": function( nodeNameSelector ) {
			var nodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
			return nodeNameSelector === "*" ?
				function() {
					return true;
				} :
				function( elem ) {
					return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
				};
		},

		"CLASS": function( className ) {
			var pattern = classCache[ className + " " ];

			return pattern ||
				( pattern = new RegExp( "(^|" + whitespace +
					")" + className + "(" + whitespace + "|$)" ) ) && classCache(
						className, function( elem ) {
							return pattern.test(
								typeof elem.className === "string" && elem.className ||
								typeof elem.getAttribute !== "undefined" &&
									elem.getAttribute( "class" ) ||
								""
							);
				} );
		},

		"ATTR": function( name, operator, check ) {
			return function( elem ) {
				var result = Sizzle.attr( elem, name );

				if ( result == null ) {
					return operator === "!=";
				}
				if ( !operator ) {
					return true;
				}

				result += "";

				/* eslint-disable max-len */

				return operator === "=" ? result === check :
					operator === "!=" ? result !== check :
					operator === "^=" ? check && result.indexOf( check ) === 0 :
					operator === "*=" ? check && result.indexOf( check ) > -1 :
					operator === "$=" ? check && result.slice( -check.length ) === check :
					operator === "~=" ? ( " " + result.replace( rwhitespace, " " ) + " " ).indexOf( check ) > -1 :
					operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
					false;
				/* eslint-enable max-len */

			};
		},

		"CHILD": function( type, what, _argument, first, last ) {
			var simple = type.slice( 0, 3 ) !== "nth",
				forward = type.slice( -4 ) !== "last",
				ofType = what === "of-type";

			return first === 1 && last === 0 ?

				// Shortcut for :nth-*(n)
				function( elem ) {
					return !!elem.parentNode;
				} :

				function( elem, _context, xml ) {
					var cache, uniqueCache, outerCache, node, nodeIndex, start,
						dir = simple !== forward ? "nextSibling" : "previousSibling",
						parent = elem.parentNode,
						name = ofType && elem.nodeName.toLowerCase(),
						useCache = !xml && !ofType,
						diff = false;

					if ( parent ) {

						// :(first|last|only)-(child|of-type)
						if ( simple ) {
							while ( dir ) {
								node = elem;
								while ( ( node = node[ dir ] ) ) {
									if ( ofType ?
										node.nodeName.toLowerCase() === name :
										node.nodeType === 1 ) {

										return false;
									}
								}

								// Reverse direction for :only-* (if we haven't yet done so)
								start = dir = type === "only" && !start && "nextSibling";
							}
							return true;
						}

						start = [ forward ? parent.firstChild : parent.lastChild ];

						// non-xml :nth-child(...) stores cache data on \`parent\`
						if ( forward && useCache ) {

							// Seek \`elem\` from a previously-cached index

							// ...in a gzip-friendly way
							node = parent;
							outerCache = node[ expando ] || ( node[ expando ] = {} );

							// Support: IE <9 only
							// Defend against cloned attroperties (jQuery gh-1709)
							uniqueCache = outerCache[ node.uniqueID ] ||
								( outerCache[ node.uniqueID ] = {} );

							cache = uniqueCache[ type ] || [];
							nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
							diff = nodeIndex && cache[ 2 ];
							node = nodeIndex && parent.childNodes[ nodeIndex ];

							while ( ( node = ++nodeIndex && node && node[ dir ] ||

								// Fallback to seeking \`elem\` from the start
								( diff = nodeIndex = 0 ) || start.pop() ) ) {

								// When found, cache indexes on \`parent\` and break
								if ( node.nodeType === 1 && ++diff && node === elem ) {
									uniqueCache[ type ] = [ dirruns, nodeIndex, diff ];
									break;
								}
							}

						} else {

							// Use previously-cached element index if available
							if ( useCache ) {

								// ...in a gzip-friendly way
								node = elem;
								outerCache = node[ expando ] || ( node[ expando ] = {} );

								// Support: IE <9 only
								// Defend against cloned attroperties (jQuery gh-1709)
								uniqueCache = outerCache[ node.uniqueID ] ||
									( outerCache[ node.uniqueID ] = {} );

								cache = uniqueCache[ type ] || [];
								nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
								diff = nodeIndex;
							}

							// xml :nth-child(...)
							// or :nth-last-child(...) or :nth(-last)?-of-type(...)
							if ( diff === false ) {

								// Use the same loop as above to seek \`elem\` from the start
								while ( ( node = ++nodeIndex && node && node[ dir ] ||
									( diff = nodeIndex = 0 ) || start.pop() ) ) {

									if ( ( ofType ?
										node.nodeName.toLowerCase() === name :
										node.nodeType === 1 ) &&
										++diff ) {

										// Cache the index of each encountered element
										if ( useCache ) {
											outerCache = node[ expando ] ||
												( node[ expando ] = {} );

											// Support: IE <9 only
											// Defend against cloned attroperties (jQuery gh-1709)
											uniqueCache = outerCache[ node.uniqueID ] ||
												( outerCache[ node.uniqueID ] = {} );

											uniqueCache[ type ] = [ dirruns, diff ];
										}

										if ( node === elem ) {
											break;
										}
									}
								}
							}
						}

						// Incorporate the offset, then check against cycle size
						diff -= last;
						return diff === first || ( diff % first === 0 && diff / first >= 0 );
					}
				};
		},

		"PSEUDO": function( pseudo, argument ) {

			// pseudo-class names are case-insensitive
			// http://www.w3.org/TR/selectors/#pseudo-classes
			// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
			// Remember that setFilters inherits from pseudos
			var args,
				fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
					Sizzle.error( "unsupported pseudo: " + pseudo );

			// The user may use createPseudo to indicate that
			// arguments are needed to create the filter function
			// just as Sizzle does
			if ( fn[ expando ] ) {
				return fn( argument );
			}

			// But maintain support for old signatures
			if ( fn.length > 1 ) {
				args = [ pseudo, pseudo, "", argument ];
				return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
					markFunction( function( seed, matches ) {
						var idx,
							matched = fn( seed, argument ),
							i = matched.length;
						while ( i-- ) {
							idx = indexOf( seed, matched[ i ] );
							seed[ idx ] = !( matches[ idx ] = matched[ i ] );
						}
					} ) :
					function( elem ) {
						return fn( elem, 0, args );
					};
			}

			return fn;
		}
	},

	pseudos: {

		// Potentially complex pseudos
		"not": markFunction( function( selector ) {

			// Trim the selector passed to compile
			// to avoid treating leading and trailing
			// spaces as combinators
			var input = [],
				results = [],
				matcher = compile( selector.replace( rtrim, "$1" ) );

			return matcher[ expando ] ?
				markFunction( function( seed, matches, _context, xml ) {
					var elem,
						unmatched = matcher( seed, null, xml, [] ),
						i = seed.length;

					// Match elements unmatched by \`matcher\`
					while ( i-- ) {
						if ( ( elem = unmatched[ i ] ) ) {
							seed[ i ] = !( matches[ i ] = elem );
						}
					}
				} ) :
				function( elem, _context, xml ) {
					input[ 0 ] = elem;
					matcher( input, null, xml, results );

					// Don't keep the element (issue #299)
					input[ 0 ] = null;
					return !results.pop();
				};
		} ),

		"has": markFunction( function( selector ) {
			return function( elem ) {
				return Sizzle( selector, elem ).length > 0;
			};
		} ),

		"contains": markFunction( function( text ) {
			text = text.replace( runescape, funescape );
			return function( elem ) {
				return ( elem.textContent || getText( elem ) ).indexOf( text ) > -1;
			};
		} ),

		// "Whether an element is represented by a :lang() selector
		// is based solely on the element's language value
		// being equal to the identifier C,
		// or beginning with the identifier C immediately followed by "-".
		// The matching of C against the element's language value is performed case-insensitively.
		// The identifier C does not have to be a valid language name."
		// http://www.w3.org/TR/selectors/#lang-pseudo
		"lang": markFunction( function( lang ) {

			// lang value must be a valid identifier
			if ( !ridentifier.test( lang || "" ) ) {
				Sizzle.error( "unsupported lang: " + lang );
			}
			lang = lang.replace( runescape, funescape ).toLowerCase();
			return function( elem ) {
				var elemLang;
				do {
					if ( ( elemLang = documentIsHTML ?
						elem.lang :
						elem.getAttribute( "xml:lang" ) || elem.getAttribute( "lang" ) ) ) {

						elemLang = elemLang.toLowerCase();
						return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
					}
				} while ( ( elem = elem.parentNode ) && elem.nodeType === 1 );
				return false;
			};
		} ),

		// Miscellaneous
		"target": function( elem ) {
			var hash = window.location && window.location.hash;
			return hash && hash.slice( 1 ) === elem.id;
		},

		"root": function( elem ) {
			return elem === docElem;
		},

		"focus": function( elem ) {
			return elem === document.activeElement &&
				( !document.hasFocus || document.hasFocus() ) &&
				!!( elem.type || elem.href || ~elem.tabIndex );
		},

		// Boolean properties
		"enabled": createDisabledPseudo( false ),
		"disabled": createDisabledPseudo( true ),

		"checked": function( elem ) {

			// In CSS3, :checked should return both checked and selected elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			var nodeName = elem.nodeName.toLowerCase();
			return ( nodeName === "input" && !!elem.checked ) ||
				( nodeName === "option" && !!elem.selected );
		},

		"selected": function( elem ) {

			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				// eslint-disable-next-line no-unused-expressions
				elem.parentNode.selectedIndex;
			}

			return elem.selected === true;
		},

		// Contents
		"empty": function( elem ) {

			// http://www.w3.org/TR/selectors/#empty-pseudo
			// :empty is negated by element (1) or content nodes (text: 3; cdata: 4; entity ref: 5),
			//   but not by others (comment: 8; processing instruction: 7; etc.)
			// nodeType < 6 works because attributes (2) do not appear as children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				if ( elem.nodeType < 6 ) {
					return false;
				}
			}
			return true;
		},

		"parent": function( elem ) {
			return !Expr.pseudos[ "empty" ]( elem );
		},

		// Element/input types
		"header": function( elem ) {
			return rheader.test( elem.nodeName );
		},

		"input": function( elem ) {
			return rinputs.test( elem.nodeName );
		},

		"button": function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && elem.type === "button" || name === "button";
		},

		"text": function( elem ) {
			var attr;
			return elem.nodeName.toLowerCase() === "input" &&
				elem.type === "text" &&

				// Support: IE<8
				// New HTML5 attribute values (e.g., "search") appear with elem.type === "text"
				( ( attr = elem.getAttribute( "type" ) ) == null ||
					attr.toLowerCase() === "text" );
		},

		// Position-in-collection
		"first": createPositionalPseudo( function() {
			return [ 0 ];
		} ),

		"last": createPositionalPseudo( function( _matchIndexes, length ) {
			return [ length - 1 ];
		} ),

		"eq": createPositionalPseudo( function( _matchIndexes, length, argument ) {
			return [ argument < 0 ? argument + length : argument ];
		} ),

		"even": createPositionalPseudo( function( matchIndexes, length ) {
			var i = 0;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		} ),

		"odd": createPositionalPseudo( function( matchIndexes, length ) {
			var i = 1;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		} ),

		"lt": createPositionalPseudo( function( matchIndexes, length, argument ) {
			var i = argument < 0 ?
				argument + length :
				argument > length ?
					length :
					argument;
			for ( ; --i >= 0; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		} ),

		"gt": createPositionalPseudo( function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; ++i < length; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		} )
	}
};

Expr.pseudos[ "nth" ] = Expr.pseudos[ "eq" ];

// Add button/input type pseudos
for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
	Expr.pseudos[ i ] = createInputPseudo( i );
}
for ( i in { submit: true, reset: true } ) {
	Expr.pseudos[ i ] = createButtonPseudo( i );
}

// Easy API for creating new setFilters
function setFilters() {}
setFilters.prototype = Expr.filters = Expr.pseudos;
Expr.setFilters = new setFilters();

tokenize = Sizzle.tokenize = function( selector, parseOnly ) {
	var matched, match, tokens, type,
		soFar, groups, preFilters,
		cached = tokenCache[ selector + " " ];

	if ( cached ) {
		return parseOnly ? 0 : cached.slice( 0 );
	}

	soFar = selector;
	groups = [];
	preFilters = Expr.preFilter;

	while ( soFar ) {

		// Comma and first run
		if ( !matched || ( match = rcomma.exec( soFar ) ) ) {
			if ( match ) {

				// Don't consume trailing commas as valid
				soFar = soFar.slice( match[ 0 ].length ) || soFar;
			}
			groups.push( ( tokens = [] ) );
		}

		matched = false;

		// Combinators
		if ( ( match = rcombinators.exec( soFar ) ) ) {
			matched = match.shift();
			tokens.push( {
				value: matched,

				// Cast descendant combinators to space
				type: match[ 0 ].replace( rtrim, " " )
			} );
			soFar = soFar.slice( matched.length );
		}

		// Filters
		for ( type in Expr.filter ) {
			if ( ( match = matchExpr[ type ].exec( soFar ) ) && ( !preFilters[ type ] ||
				( match = preFilters[ type ]( match ) ) ) ) {
				matched = match.shift();
				tokens.push( {
					value: matched,
					type: type,
					matches: match
				} );
				soFar = soFar.slice( matched.length );
			}
		}

		if ( !matched ) {
			break;
		}
	}

	// Return the length of the invalid excess
	// if we're just parsing
	// Otherwise, throw an error or return tokens
	return parseOnly ?
		soFar.length :
		soFar ?
			Sizzle.error( selector ) :

			// Cache the tokens
			tokenCache( selector, groups ).slice( 0 );
};

function toSelector( tokens ) {
	var i = 0,
		len = tokens.length,
		selector = "";
	for ( ; i < len; i++ ) {
		selector += tokens[ i ].value;
	}
	return selector;
}

function addCombinator( matcher, combinator, base ) {
	var dir = combinator.dir,
		skip = combinator.next,
		key = skip || dir,
		checkNonElements = base && key === "parentNode",
		doneName = done++;

	return combinator.first ?

		// Check against closest ancestor/preceding element
		function( elem, context, xml ) {
			while ( ( elem = elem[ dir ] ) ) {
				if ( elem.nodeType === 1 || checkNonElements ) {
					return matcher( elem, context, xml );
				}
			}
			return false;
		} :

		// Check against all ancestor/preceding elements
		function( elem, context, xml ) {
			var oldCache, uniqueCache, outerCache,
				newCache = [ dirruns, doneName ];

			// We can't set arbitrary data on XML nodes, so they don't benefit from combinator caching
			if ( xml ) {
				while ( ( elem = elem[ dir ] ) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						if ( matcher( elem, context, xml ) ) {
							return true;
						}
					}
				}
			} else {
				while ( ( elem = elem[ dir ] ) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						outerCache = elem[ expando ] || ( elem[ expando ] = {} );

						// Support: IE <9 only
						// Defend against cloned attroperties (jQuery gh-1709)
						uniqueCache = outerCache[ elem.uniqueID ] ||
							( outerCache[ elem.uniqueID ] = {} );

						if ( skip && skip === elem.nodeName.toLowerCase() ) {
							elem = elem[ dir ] || elem;
						} else if ( ( oldCache = uniqueCache[ key ] ) &&
							oldCache[ 0 ] === dirruns && oldCache[ 1 ] === doneName ) {

							// Assign to newCache so results back-propagate to previous elements
							return ( newCache[ 2 ] = oldCache[ 2 ] );
						} else {

							// Reuse newcache so results back-propagate to previous elements
							uniqueCache[ key ] = newCache;

							// A match means we're done; a fail means we have to keep checking
							if ( ( newCache[ 2 ] = matcher( elem, context, xml ) ) ) {
								return true;
							}
						}
					}
				}
			}
			return false;
		};
}

function elementMatcher( matchers ) {
	return matchers.length > 1 ?
		function( elem, context, xml ) {
			var i = matchers.length;
			while ( i-- ) {
				if ( !matchers[ i ]( elem, context, xml ) ) {
					return false;
				}
			}
			return true;
		} :
		matchers[ 0 ];
}

function multipleContexts( selector, contexts, results ) {
	var i = 0,
		len = contexts.length;
	for ( ; i < len; i++ ) {
		Sizzle( selector, contexts[ i ], results );
	}
	return results;
}

function condense( unmatched, map, filter, context, xml ) {
	var elem,
		newUnmatched = [],
		i = 0,
		len = unmatched.length,
		mapped = map != null;

	for ( ; i < len; i++ ) {
		if ( ( elem = unmatched[ i ] ) ) {
			if ( !filter || filter( elem, context, xml ) ) {
				newUnmatched.push( elem );
				if ( mapped ) {
					map.push( i );
				}
			}
		}
	}

	return newUnmatched;
}

function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
	if ( postFilter && !postFilter[ expando ] ) {
		postFilter = setMatcher( postFilter );
	}
	if ( postFinder && !postFinder[ expando ] ) {
		postFinder = setMatcher( postFinder, postSelector );
	}
	return markFunction( function( seed, results, context, xml ) {
		var temp, i, elem,
			preMap = [],
			postMap = [],
			preexisting = results.length,

			// Get initial elements from seed or context
			elems = seed || multipleContexts(
				selector || "*",
				context.nodeType ? [ context ] : context,
				[]
			),

			// Prefilter to get matcher input, preserving a map for seed-results synchronization
			matcherIn = preFilter && ( seed || !selector ) ?
				condense( elems, preMap, preFilter, context, xml ) :
				elems,

			matcherOut = matcher ?

				// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
				postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

					// ...intermediate processing is necessary
					[] :

					// ...otherwise use results directly
					results :
				matcherIn;

		// Find primary matches
		if ( matcher ) {
			matcher( matcherIn, matcherOut, context, xml );
		}

		// Apply postFilter
		if ( postFilter ) {
			temp = condense( matcherOut, postMap );
			postFilter( temp, [], context, xml );

			// Un-match failing elements by moving them back to matcherIn
			i = temp.length;
			while ( i-- ) {
				if ( ( elem = temp[ i ] ) ) {
					matcherOut[ postMap[ i ] ] = !( matcherIn[ postMap[ i ] ] = elem );
				}
			}
		}

		if ( seed ) {
			if ( postFinder || preFilter ) {
				if ( postFinder ) {

					// Get the final matcherOut by condensing this intermediate into postFinder contexts
					temp = [];
					i = matcherOut.length;
					while ( i-- ) {
						if ( ( elem = matcherOut[ i ] ) ) {

							// Restore matcherIn since elem is not yet a final match
							temp.push( ( matcherIn[ i ] = elem ) );
						}
					}
					postFinder( null, ( matcherOut = [] ), temp, xml );
				}

				// Move matched elements from seed to results to keep them synchronized
				i = matcherOut.length;
				while ( i-- ) {
					if ( ( elem = matcherOut[ i ] ) &&
						( temp = postFinder ? indexOf( seed, elem ) : preMap[ i ] ) > -1 ) {

						seed[ temp ] = !( results[ temp ] = elem );
					}
				}
			}

		// Add elements to results, through postFinder if defined
		} else {
			matcherOut = condense(
				matcherOut === results ?
					matcherOut.splice( preexisting, matcherOut.length ) :
					matcherOut
			);
			if ( postFinder ) {
				postFinder( null, results, matcherOut, xml );
			} else {
				push.apply( results, matcherOut );
			}
		}
	} );
}

function matcherFromTokens( tokens ) {
	var checkContext, matcher, j,
		len = tokens.length,
		leadingRelative = Expr.relative[ tokens[ 0 ].type ],
		implicitRelative = leadingRelative || Expr.relative[ " " ],
		i = leadingRelative ? 1 : 0,

		// The foundational matcher ensures that elements are reachable from top-level context(s)
		matchContext = addCombinator( function( elem ) {
			return elem === checkContext;
		}, implicitRelative, true ),
		matchAnyContext = addCombinator( function( elem ) {
			return indexOf( checkContext, elem ) > -1;
		}, implicitRelative, true ),
		matchers = [ function( elem, context, xml ) {
			var ret = ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
				( checkContext = context ).nodeType ?
					matchContext( elem, context, xml ) :
					matchAnyContext( elem, context, xml ) );

			// Avoid hanging onto element (issue #299)
			checkContext = null;
			return ret;
		} ];

	for ( ; i < len; i++ ) {
		if ( ( matcher = Expr.relative[ tokens[ i ].type ] ) ) {
			matchers = [ addCombinator( elementMatcher( matchers ), matcher ) ];
		} else {
			matcher = Expr.filter[ tokens[ i ].type ].apply( null, tokens[ i ].matches );

			// Return special upon seeing a positional matcher
			if ( matcher[ expando ] ) {

				// Find the next relative operator (if any) for proper handling
				j = ++i;
				for ( ; j < len; j++ ) {
					if ( Expr.relative[ tokens[ j ].type ] ) {
						break;
					}
				}
				return setMatcher(
					i > 1 && elementMatcher( matchers ),
					i > 1 && toSelector(

					// If the preceding token was a descendant combinator, insert an implicit any-element \`*\`
					tokens
						.slice( 0, i - 1 )
						.concat( { value: tokens[ i - 2 ].type === " " ? "*" : "" } )
					).replace( rtrim, "$1" ),
					matcher,
					i < j && matcherFromTokens( tokens.slice( i, j ) ),
					j < len && matcherFromTokens( ( tokens = tokens.slice( j ) ) ),
					j < len && toSelector( tokens )
				);
			}
			matchers.push( matcher );
		}
	}

	return elementMatcher( matchers );
}

function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
	var bySet = setMatchers.length > 0,
		byElement = elementMatchers.length > 0,
		superMatcher = function( seed, context, xml, results, outermost ) {
			var elem, j, matcher,
				matchedCount = 0,
				i = "0",
				unmatched = seed && [],
				setMatched = [],
				contextBackup = outermostContext,

				// We must always have either seed elements or outermost context
				elems = seed || byElement && Expr.find[ "TAG" ]( "*", outermost ),

				// Use integer dirruns iff this is the outermost matcher
				dirrunsUnique = ( dirruns += contextBackup == null ? 1 : Math.random() || 0.1 ),
				len = elems.length;

			if ( outermost ) {

				// Support: IE 11+, Edge 17 - 18+
				// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
				// two documents; shallow comparisons work.
				// eslint-disable-next-line eqeqeq
				outermostContext = context == document || context || outermost;
			}

			// Add elements passing elementMatchers directly to results
			// Support: IE<9, Safari
			// Tolerate NodeList properties (IE: "length"; Safari: <number>) matching elements by id
			for ( ; i !== len && ( elem = elems[ i ] ) != null; i++ ) {
				if ( byElement && elem ) {
					j = 0;

					// Support: IE 11+, Edge 17 - 18+
					// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
					// two documents; shallow comparisons work.
					// eslint-disable-next-line eqeqeq
					if ( !context && elem.ownerDocument != document ) {
						setDocument( elem );
						xml = !documentIsHTML;
					}
					while ( ( matcher = elementMatchers[ j++ ] ) ) {
						if ( matcher( elem, context || document, xml ) ) {
							results.push( elem );
							break;
						}
					}
					if ( outermost ) {
						dirruns = dirrunsUnique;
					}
				}

				// Track unmatched elements for set filters
				if ( bySet ) {

					// They will have gone through all possible matchers
					if ( ( elem = !matcher && elem ) ) {
						matchedCount--;
					}

					// Lengthen the array for every element, matched or not
					if ( seed ) {
						unmatched.push( elem );
					}
				}
			}

			// \`i\` is now the count of elements visited above, and adding it to \`matchedCount\`
			// makes the latter nonnegative.
			matchedCount += i;

			// Apply set filters to unmatched elements
			// NOTE: This can be skipped if there are no unmatched elements (i.e., \`matchedCount\`
			// equals \`i\`), unless we didn't visit _any_ elements in the above loop because we have
			// no element matchers and no seed.
			// Incrementing an initially-string "0" \`i\` allows \`i\` to remain a string only in that
			// case, which will result in a "00" \`matchedCount\` that differs from \`i\` but is also
			// numerically zero.
			if ( bySet && i !== matchedCount ) {
				j = 0;
				while ( ( matcher = setMatchers[ j++ ] ) ) {
					matcher( unmatched, setMatched, context, xml );
				}

				if ( seed ) {

					// Reintegrate element matches to eliminate the need for sorting
					if ( matchedCount > 0 ) {
						while ( i-- ) {
							if ( !( unmatched[ i ] || setMatched[ i ] ) ) {
								setMatched[ i ] = pop.call( results );
							}
						}
					}

					// Discard index placeholder values to get only actual matches
					setMatched = condense( setMatched );
				}

				// Add matches to results
				push.apply( results, setMatched );

				// Seedless set matches succeeding multiple successful matchers stipulate sorting
				if ( outermost && !seed && setMatched.length > 0 &&
					( matchedCount + setMatchers.length ) > 1 ) {

					Sizzle.uniqueSort( results );
				}
			}

			// Override manipulation of globals by nested matchers
			if ( outermost ) {
				dirruns = dirrunsUnique;
				outermostContext = contextBackup;
			}

			return unmatched;
		};

	return bySet ?
		markFunction( superMatcher ) :
		superMatcher;
}

compile = Sizzle.compile = function( selector, match /* Internal Use Only */ ) {
	var i,
		setMatchers = [],
		elementMatchers = [],
		cached = compilerCache[ selector + " " ];

	if ( !cached ) {

		// Generate a function of recursive functions that can be used to check each element
		if ( !match ) {
			match = tokenize( selector );
		}
		i = match.length;
		while ( i-- ) {
			cached = matcherFromTokens( match[ i ] );
			if ( cached[ expando ] ) {
				setMatchers.push( cached );
			} else {
				elementMatchers.push( cached );
			}
		}

		// Cache the compiled function
		cached = compilerCache(
			selector,
			matcherFromGroupMatchers( elementMatchers, setMatchers )
		);

		// Save selector and tokenization
		cached.selector = selector;
	}
	return cached;
};

/**
 * A low-level selection function that works with Sizzle's compiled
 *  selector functions
 * @param {String|Function} selector A selector or a pre-compiled
 *  selector function built with Sizzle.compile
 * @param {Element} context
 * @param {Array} [results]
 * @param {Array} [seed] A set of elements to match against
 */
select = Sizzle.select = function( selector, context, results, seed ) {
	var i, tokens, token, type, find,
		compiled = typeof selector === "function" && selector,
		match = !seed && tokenize( ( selector = compiled.selector || selector ) );

	results = results || [];

	// Try to minimize operations if there is only one selector in the list and no seed
	// (the latter of which guarantees us context)
	if ( match.length === 1 ) {

		// Reduce context if the leading compound selector is an ID
		tokens = match[ 0 ] = match[ 0 ].slice( 0 );
		if ( tokens.length > 2 && ( token = tokens[ 0 ] ).type === "ID" &&
			context.nodeType === 9 && documentIsHTML && Expr.relative[ tokens[ 1 ].type ] ) {

			context = ( Expr.find[ "ID" ]( token.matches[ 0 ]
				.replace( runescape, funescape ), context ) || [] )[ 0 ];
			if ( !context ) {
				return results;

			// Precompiled matchers will still verify ancestry, so step up a level
			} else if ( compiled ) {
				context = context.parentNode;
			}

			selector = selector.slice( tokens.shift().value.length );
		}

		// Fetch a seed set for right-to-left matching
		i = matchExpr[ "needsContext" ].test( selector ) ? 0 : tokens.length;
		while ( i-- ) {
			token = tokens[ i ];

			// Abort if we hit a combinator
			if ( Expr.relative[ ( type = token.type ) ] ) {
				break;
			}
			if ( ( find = Expr.find[ type ] ) ) {

				// Search, expanding context for leading sibling combinators
				if ( ( seed = find(
					token.matches[ 0 ].replace( runescape, funescape ),
					rsibling.test( tokens[ 0 ].type ) && testContext( context.parentNode ) ||
						context
				) ) ) {

					// If seed is empty or no tokens remain, we can return early
					tokens.splice( i, 1 );
					selector = seed.length && toSelector( tokens );
					if ( !selector ) {
						push.apply( results, seed );
						return results;
					}

					break;
				}
			}
		}
	}

	// Compile and execute a filtering function if one is not provided
	// Provide \`match\` to avoid retokenization if we modified the selector above
	( compiled || compile( selector, match ) )(
		seed,
		context,
		!documentIsHTML,
		results,
		!context || rsibling.test( selector ) && testContext( context.parentNode ) || context
	);
	return results;
};

// One-time assignments

// Sort stability
support.sortStable = expando.split( "" ).sort( sortOrder ).join( "" ) === expando;

// Support: Chrome 14-35+
// Always assume duplicates if they aren't passed to the comparison function
support.detectDuplicates = !!hasDuplicate;

// Initialize against the default document
setDocument();

// Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
// Detached nodes confoundingly follow *each other*
support.sortDetached = assert( function( el ) {

	// Should return 1, but returns 4 (following)
	return el.compareDocumentPosition( document.createElement( "fieldset" ) ) & 1;
} );

// Support: IE<8
// Prevent attribute/property "interpolation"
// https://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !assert( function( el ) {
	el.innerHTML = "<a href='#'></a>";
	return el.firstChild.getAttribute( "href" ) === "#";
} ) ) {
	addHandle( "type|href|height|width", function( elem, name, isXML ) {
		if ( !isXML ) {
			return elem.getAttribute( name, name.toLowerCase() === "type" ? 1 : 2 );
		}
	} );
}

// Support: IE<9
// Use defaultValue in place of getAttribute("value")
if ( !support.attributes || !assert( function( el ) {
	el.innerHTML = "<input/>";
	el.firstChild.setAttribute( "value", "" );
	return el.firstChild.getAttribute( "value" ) === "";
} ) ) {
	addHandle( "value", function( elem, _name, isXML ) {
		if ( !isXML && elem.nodeName.toLowerCase() === "input" ) {
			return elem.defaultValue;
		}
	} );
}

// Support: IE<9
// Use getAttributeNode to fetch booleans when getAttribute lies
if ( !assert( function( el ) {
	return el.getAttribute( "disabled" ) == null;
} ) ) {
	addHandle( booleans, function( elem, name, isXML ) {
		var val;
		if ( !isXML ) {
			return elem[ name ] === true ? name.toLowerCase() :
				( val = elem.getAttributeNode( name ) ) && val.specified ?
					val.value :
					null;
		}
	} );
}

return Sizzle;

} )( window );



jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;

// Deprecated
jQuery.expr[ ":" ] = jQuery.expr.pseudos;
jQuery.uniqueSort = jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;
jQuery.escapeSelector = Sizzle.escape;




var dir = function( elem, dir, until ) {
	var matched = [],
		truncate = until !== undefined;

	while ( ( elem = elem[ dir ] ) && elem.nodeType !== 9 ) {
		if ( elem.nodeType === 1 ) {
			if ( truncate && jQuery( elem ).is( until ) ) {
				break;
			}
			matched.push( elem );
		}
	}
	return matched;
};


var siblings = function( n, elem ) {
	var matched = [];

	for ( ; n; n = n.nextSibling ) {
		if ( n.nodeType === 1 && n !== elem ) {
			matched.push( n );
		}
	}

	return matched;
};


var rneedsContext = jQuery.expr.match.needsContext;



function nodeName( elem, name ) {

	return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();

}
var rsingleTag = ( /^<([a-z][^\\/\\0>:\\x20\\t\\r\\n\\f]*)[\\x20\\t\\r\\n\\f]*\\/?>(?:<\\/\\1>|)$/i );



// Implement the identical functionality for filter and not
function winnow( elements, qualifier, not ) {
	if ( isFunction( qualifier ) ) {
		return jQuery.grep( elements, function( elem, i ) {
			return !!qualifier.call( elem, i, elem ) !== not;
		} );
	}

	// Single element
	if ( qualifier.nodeType ) {
		return jQuery.grep( elements, function( elem ) {
			return ( elem === qualifier ) !== not;
		} );
	}

	// Arraylike of elements (jQuery, arguments, Array)
	if ( typeof qualifier !== "string" ) {
		return jQuery.grep( elements, function( elem ) {
			return ( indexOf.call( qualifier, elem ) > -1 ) !== not;
		} );
	}

	// Filtered directly for both simple and complex selectors
	return jQuery.filter( qualifier, elements, not );
}

jQuery.filter = function( expr, elems, not ) {
	var elem = elems[ 0 ];

	if ( not ) {
		expr = ":not(" + expr + ")";
	}

	if ( elems.length === 1 && elem.nodeType === 1 ) {
		return jQuery.find.matchesSelector( elem, expr ) ? [ elem ] : [];
	}

	return jQuery.find.matches( expr, jQuery.grep( elems, function( elem ) {
		return elem.nodeType === 1;
	} ) );
};

jQuery.fn.extend( {
	find: function( selector ) {
		var i, ret,
			len = this.length,
			self = this;

		if ( typeof selector !== "string" ) {
			return this.pushStack( jQuery( selector ).filter( function() {
				for ( i = 0; i < len; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			} ) );
		}

		ret = this.pushStack( [] );

		for ( i = 0; i < len; i++ ) {
			jQuery.find( selector, self[ i ], ret );
		}

		return len > 1 ? jQuery.uniqueSort( ret ) : ret;
	},
	filter: function( selector ) {
		return this.pushStack( winnow( this, selector || [], false ) );
	},
	not: function( selector ) {
		return this.pushStack( winnow( this, selector || [], true ) );
	},
	is: function( selector ) {
		return !!winnow(
			this,

			// If this is a positional/relative selector, check membership in the returned set
			// so $("p:first").is("p:last") won't return true for a doc with two "p".
			typeof selector === "string" && rneedsContext.test( selector ) ?
				jQuery( selector ) :
				selector || [],
			false
		).length;
	}
} );


// Initialize a jQuery object


// A central reference to the root jQuery(document)
var rootjQuery,

	// A simple way to check for HTML strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	// Strict HTML recognition (#11290: must start with <)
	// Shortcut simple #id case for speed
	rquickExpr = /^(?:\\s*(<[\\w\\W]+>)[^>]*|#([\\w-]+))$/,

	init = jQuery.fn.init = function( selector, context, root ) {
		var match, elem;

		// HANDLE: $(""), $(null), $(undefined), $(false)
		if ( !selector ) {
			return this;
		}

		// Method init() accepts an alternate rootjQuery
		// so migrate can support jQuery.sub (gh-2101)
		root = root || rootjQuery;

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			if ( selector[ 0 ] === "<" &&
				selector[ selector.length - 1 ] === ">" &&
				selector.length >= 3 ) {

				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = rquickExpr.exec( selector );
			}

			// Match html or make sure no context is specified for #id
			if ( match && ( match[ 1 ] || !context ) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[ 1 ] ) {
					context = context instanceof jQuery ? context[ 0 ] : context;

					// Option to run scripts is true for back-compat
					// Intentionally let the error be thrown if parseHTML is not present
					jQuery.merge( this, jQuery.parseHTML(
						match[ 1 ],
						context && context.nodeType ? context.ownerDocument || context : document,
						true
					) );

					// HANDLE: $(html, props)
					if ( rsingleTag.test( match[ 1 ] ) && jQuery.isPlainObject( context ) ) {
						for ( match in context ) {

							// Properties of context are called as methods if possible
							if ( isFunction( this[ match ] ) ) {
								this[ match ]( context[ match ] );

							// ...and otherwise set as attributes
							} else {
								this.attr( match, context[ match ] );
							}
						}
					}

					return this;

				// HANDLE: $(#id)
				} else {
					elem = document.getElementById( match[ 2 ] );

					if ( elem ) {

						// Inject the element directly into the jQuery object
						this[ 0 ] = elem;
						this.length = 1;
					}
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return ( context || root ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(DOMElement)
		} else if ( selector.nodeType ) {
			this[ 0 ] = selector;
			this.length = 1;
			return this;

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( isFunction( selector ) ) {
			return root.ready !== undefined ?
				root.ready( selector ) :

				// Execute immediately if ready is not present
				selector( jQuery );
		}

		return jQuery.makeArray( selector, this );
	};

// Give the init function the jQuery prototype for later instantiation
init.prototype = jQuery.fn;

// Initialize central reference
rootjQuery = jQuery( document );


var rparentsprev = /^(?:parents|prev(?:Until|All))/,

	// Methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.fn.extend( {
	has: function( target ) {
		var targets = jQuery( target, this ),
			l = targets.length;

		return this.filter( function() {
			var i = 0;
			for ( ; i < l; i++ ) {
				if ( jQuery.contains( this, targets[ i ] ) ) {
					return true;
				}
			}
		} );
	},

	closest: function( selectors, context ) {
		var cur,
			i = 0,
			l = this.length,
			matched = [],
			targets = typeof selectors !== "string" && jQuery( selectors );

		// Positional selectors never match, since there's no _selection_ context
		if ( !rneedsContext.test( selectors ) ) {
			for ( ; i < l; i++ ) {
				for ( cur = this[ i ]; cur && cur !== context; cur = cur.parentNode ) {

					// Always skip document fragments
					if ( cur.nodeType < 11 && ( targets ?
						targets.index( cur ) > -1 :

						// Don't pass non-elements to Sizzle
						cur.nodeType === 1 &&
							jQuery.find.matchesSelector( cur, selectors ) ) ) {

						matched.push( cur );
						break;
					}
				}
			}
		}

		return this.pushStack( matched.length > 1 ? jQuery.uniqueSort( matched ) : matched );
	},

	// Determine the position of an element within the set
	index: function( elem ) {

		// No argument, return index in parent
		if ( !elem ) {
			return ( this[ 0 ] && this[ 0 ].parentNode ) ? this.first().prevAll().length : -1;
		}

		// Index in selector
		if ( typeof elem === "string" ) {
			return indexOf.call( jQuery( elem ), this[ 0 ] );
		}

		// Locate the position of the desired element
		return indexOf.call( this,

			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[ 0 ] : elem
		);
	},

	add: function( selector, context ) {
		return this.pushStack(
			jQuery.uniqueSort(
				jQuery.merge( this.get(), jQuery( selector, context ) )
			)
		);
	},

	addBack: function( selector ) {
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter( selector )
		);
	}
} );

function sibling( cur, dir ) {
	while ( ( cur = cur[ dir ] ) && cur.nodeType !== 1 ) {}
	return cur;
}

jQuery.each( {
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, _i, until ) {
		return dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return sibling( elem, "nextSibling" );
	},
	prev: function( elem ) {
		return sibling( elem, "previousSibling" );
	},
	nextAll: function( elem ) {
		return dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, _i, until ) {
		return dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, _i, until ) {
		return dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return siblings( ( elem.parentNode || {} ).firstChild, elem );
	},
	children: function( elem ) {
		return siblings( elem.firstChild );
	},
	contents: function( elem ) {
		if ( elem.contentDocument != null &&

			// Support: IE 11+
			// <object> elements with no \`data\` attribute has an object
			// \`contentDocument\` with a \`null\` prototype.
			getProto( elem.contentDocument ) ) {

			return elem.contentDocument;
		}

		// Support: IE 9 - 11 only, iOS 7 only, Android Browser <=4.3 only
		// Treat the template element as a regular one in browsers that
		// don't support it.
		if ( nodeName( elem, "template" ) ) {
			elem = elem.content || elem;
		}

		return jQuery.merge( [], elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var matched = jQuery.map( this, fn, until );

		if ( name.slice( -5 ) !== "Until" ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			matched = jQuery.filter( selector, matched );
		}

		if ( this.length > 1 ) {

			// Remove duplicates
			if ( !guaranteedUnique[ name ] ) {
				jQuery.uniqueSort( matched );
			}

			// Reverse order for parents* and prev-derivatives
			if ( rparentsprev.test( name ) ) {
				matched.reverse();
			}
		}

		return this.pushStack( matched );
	};
} );
var rnothtmlwhite = ( /[^\\x20\\t\\r\\n\\f]+/g );



// Convert String-formatted options into Object-formatted ones
function createOptions( options ) {
	var object = {};
	jQuery.each( options.match( rnothtmlwhite ) || [], function( _, flag ) {
		object[ flag ] = true;
	} );
	return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	options: an optional list of space-separated options that will change how
 *			the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( options ) {

	// Convert options from String-formatted to Object-formatted if needed
	// (we check in cache first)
	options = typeof options === "string" ?
		createOptions( options ) :
		jQuery.extend( {}, options );

	var // Flag to know if list is currently firing
		firing,

		// Last fire value for non-forgettable lists
		memory,

		// Flag to know if list was already fired
		fired,

		// Flag to prevent firing
		locked,

		// Actual callback list
		list = [],

		// Queue of execution data for repeatable lists
		queue = [],

		// Index of currently firing callback (modified by add/remove as needed)
		firingIndex = -1,

		// Fire callbacks
		fire = function() {

			// Enforce single-firing
			locked = locked || options.once;

			// Execute callbacks for all pending executions,
			// respecting firingIndex overrides and runtime changes
			fired = firing = true;
			for ( ; queue.length; firingIndex = -1 ) {
				memory = queue.shift();
				while ( ++firingIndex < list.length ) {

					// Run callback and check for early termination
					if ( list[ firingIndex ].apply( memory[ 0 ], memory[ 1 ] ) === false &&
						options.stopOnFalse ) {

						// Jump to end and forget the data so .add doesn't re-fire
						firingIndex = list.length;
						memory = false;
					}
				}
			}

			// Forget the data if we're done with it
			if ( !options.memory ) {
				memory = false;
			}

			firing = false;

			// Clean up if we're done firing for good
			if ( locked ) {

				// Keep an empty list if we have data for future add calls
				if ( memory ) {
					list = [];

				// Otherwise, this object is spent
				} else {
					list = "";
				}
			}
		},

		// Actual Callbacks object
		self = {

			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {

					// If we have memory from a past run, we should fire after adding
					if ( memory && !firing ) {
						firingIndex = list.length - 1;
						queue.push( memory );
					}

					( function add( args ) {
						jQuery.each( args, function( _, arg ) {
							if ( isFunction( arg ) ) {
								if ( !options.unique || !self.has( arg ) ) {
									list.push( arg );
								}
							} else if ( arg && arg.length && toType( arg ) !== "string" ) {

								// Inspect recursively
								add( arg );
							}
						} );
					} )( arguments );

					if ( memory && !firing ) {
						fire();
					}
				}
				return this;
			},

			// Remove a callback from the list
			remove: function() {
				jQuery.each( arguments, function( _, arg ) {
					var index;
					while ( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
						list.splice( index, 1 );

						// Handle firing indexes
						if ( index <= firingIndex ) {
							firingIndex--;
						}
					}
				} );
				return this;
			},

			// Check if a given callback is in the list.
			// If no argument is given, return whether or not list has callbacks attached.
			has: function( fn ) {
				return fn ?
					jQuery.inArray( fn, list ) > -1 :
					list.length > 0;
			},

			// Remove all callbacks from the list
			empty: function() {
				if ( list ) {
					list = [];
				}
				return this;
			},

			// Disable .fire and .add
			// Abort any current/pending executions
			// Clear all callbacks and values
			disable: function() {
				locked = queue = [];
				list = memory = "";
				return this;
			},
			disabled: function() {
				return !list;
			},

			// Disable .fire
			// Also disable .add unless we have memory (since it would have no effect)
			// Abort any pending executions
			lock: function() {
				locked = queue = [];
				if ( !memory && !firing ) {
					list = memory = "";
				}
				return this;
			},
			locked: function() {
				return !!locked;
			},

			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				if ( !locked ) {
					args = args || [];
					args = [ context, args.slice ? args.slice() : args ];
					queue.push( args );
					if ( !firing ) {
						fire();
					}
				}
				return this;
			},

			// Call all the callbacks with the given arguments
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},

			// To know if the callbacks have already been called at least once
			fired: function() {
				return !!fired;
			}
		};

	return self;
};


function Identity( v ) {
	return v;
}
function Thrower( ex ) {
	throw ex;
}

function adoptValue( value, resolve, reject, noValue ) {
	var method;

	try {

		// Check for promise aspect first to privilege synchronous behavior
		if ( value && isFunction( ( method = value.promise ) ) ) {
			method.call( value ).done( resolve ).fail( reject );

		// Other thenables
		} else if ( value && isFunction( ( method = value.then ) ) ) {
			method.call( value, resolve, reject );

		// Other non-thenables
		} else {

			// Control \`resolve\` arguments by letting Array#slice cast boolean \`noValue\` to integer:
			// * false: [ value ].slice( 0 ) => resolve( value )
			// * true: [ value ].slice( 1 ) => resolve()
			resolve.apply( undefined, [ value ].slice( noValue ) );
		}

	// For Promises/A+, convert exceptions into rejections
	// Since jQuery.when doesn't unwrap thenables, we can skip the extra checks appearing in
	// Deferred#then to conditionally suppress rejection.
	} catch ( value ) {

		// Support: Android 4.0 only
		// Strict mode functions invoked without .call/.apply get global-object context
		reject.apply( undefined, [ value ] );
	}
}

jQuery.extend( {

	Deferred: function( func ) {
		var tuples = [

				// action, add listener, callbacks,
				// ... .then handlers, argument index, [final state]
				[ "notify", "progress", jQuery.Callbacks( "memory" ),
					jQuery.Callbacks( "memory" ), 2 ],
				[ "resolve", "done", jQuery.Callbacks( "once memory" ),
					jQuery.Callbacks( "once memory" ), 0, "resolved" ],
				[ "reject", "fail", jQuery.Callbacks( "once memory" ),
					jQuery.Callbacks( "once memory" ), 1, "rejected" ]
			],
			state = "pending",
			promise = {
				state: function() {
					return state;
				},
				always: function() {
					deferred.done( arguments ).fail( arguments );
					return this;
				},
				"catch": function( fn ) {
					return promise.then( null, fn );
				},

				// Keep pipe for back-compat
				pipe: function( /* fnDone, fnFail, fnProgress */ ) {
					var fns = arguments;

					return jQuery.Deferred( function( newDefer ) {
						jQuery.each( tuples, function( _i, tuple ) {

							// Map tuples (progress, done, fail) to arguments (done, fail, progress)
							var fn = isFunction( fns[ tuple[ 4 ] ] ) && fns[ tuple[ 4 ] ];

							// deferred.progress(function() { bind to newDefer or newDefer.notify })
							// deferred.done(function() { bind to newDefer or newDefer.resolve })
							// deferred.fail(function() { bind to newDefer or newDefer.reject })
							deferred[ tuple[ 1 ] ]( function() {
								var returned = fn && fn.apply( this, arguments );
								if ( returned && isFunction( returned.promise ) ) {
									returned.promise()
										.progress( newDefer.notify )
										.done( newDefer.resolve )
										.fail( newDefer.reject );
								} else {
									newDefer[ tuple[ 0 ] + "With" ](
										this,
										fn ? [ returned ] : arguments
									);
								}
							} );
						} );
						fns = null;
					} ).promise();
				},
				then: function( onFulfilled, onRejected, onProgress ) {
					var maxDepth = 0;
					function resolve( depth, deferred, handler, special ) {
						return function() {
							var that = this,
								args = arguments,
								mightThrow = function() {
									var returned, then;

									// Support: Promises/A+ section 2.3.3.3.3
									// https://promisesaplus.com/#point-59
									// Ignore double-resolution attempts
									if ( depth < maxDepth ) {
										return;
									}

									returned = handler.apply( that, args );

									// Support: Promises/A+ section 2.3.1
									// https://promisesaplus.com/#point-48
									if ( returned === deferred.promise() ) {
										throw new TypeError( "Thenable self-resolution" );
									}

									// Support: Promises/A+ sections 2.3.3.1, 3.5
									// https://promisesaplus.com/#point-54
									// https://promisesaplus.com/#point-75
									// Retrieve \`then\` only once
									then = returned &&

										// Support: Promises/A+ section 2.3.4
										// https://promisesaplus.com/#point-64
										// Only check objects and functions for thenability
										( typeof returned === "object" ||
											typeof returned === "function" ) &&
										returned.then;

									// Handle a returned thenable
									if ( isFunction( then ) ) {

										// Special processors (notify) just wait for resolution
										if ( special ) {
											then.call(
												returned,
												resolve( maxDepth, deferred, Identity, special ),
												resolve( maxDepth, deferred, Thrower, special )
											);

										// Normal processors (resolve) also hook into progress
										} else {

											// ...and disregard older resolution values
											maxDepth++;

											then.call(
												returned,
												resolve( maxDepth, deferred, Identity, special ),
												resolve( maxDepth, deferred, Thrower, special ),
												resolve( maxDepth, deferred, Identity,
													deferred.notifyWith )
											);
										}

									// Handle all other returned values
									} else {

										// Only substitute handlers pass on context
										// and multiple values (non-spec behavior)
										if ( handler !== Identity ) {
											that = undefined;
											args = [ returned ];
										}

										// Process the value(s)
										// Default process is resolve
										( special || deferred.resolveWith )( that, args );
									}
								},

								// Only normal processors (resolve) catch and reject exceptions
								process = special ?
									mightThrow :
									function() {
										try {
											mightThrow();
										} catch ( e ) {

											if ( jQuery.Deferred.exceptionHook ) {
												jQuery.Deferred.exceptionHook( e,
													process.stackTrace );
											}

											// Support: Promises/A+ section 2.3.3.3.4.1
											// https://promisesaplus.com/#point-61
											// Ignore post-resolution exceptions
											if ( depth + 1 >= maxDepth ) {

												// Only substitute handlers pass on context
												// and multiple values (non-spec behavior)
												if ( handler !== Thrower ) {
													that = undefined;
													args = [ e ];
												}

												deferred.rejectWith( that, args );
											}
										}
									};

							// Support: Promises/A+ section 2.3.3.3.1
							// https://promisesaplus.com/#point-57
							// Re-resolve promises immediately to dodge false rejection from
							// subsequent errors
							if ( depth ) {
								process();
							} else {

								// Call an optional hook to record the stack, in case of exception
								// since it's otherwise lost when execution goes async
								if ( jQuery.Deferred.getStackHook ) {
									process.stackTrace = jQuery.Deferred.getStackHook();
								}
								window.setTimeout( process );
							}
						};
					}

					return jQuery.Deferred( function( newDefer ) {

						// progress_handlers.add( ... )
						tuples[ 0 ][ 3 ].add(
							resolve(
								0,
								newDefer,
								isFunction( onProgress ) ?
									onProgress :
									Identity,
								newDefer.notifyWith
							)
						);

						// fulfilled_handlers.add( ... )
						tuples[ 1 ][ 3 ].add(
							resolve(
								0,
								newDefer,
								isFunction( onFulfilled ) ?
									onFulfilled :
									Identity
							)
						);

						// rejected_handlers.add( ... )
						tuples[ 2 ][ 3 ].add(
							resolve(
								0,
								newDefer,
								isFunction( onRejected ) ?
									onRejected :
									Thrower
							)
						);
					} ).promise();
				},

				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					return obj != null ? jQuery.extend( obj, promise ) : promise;
				}
			},
			deferred = {};

		// Add list-specific methods
		jQuery.each( tuples, function( i, tuple ) {
			var list = tuple[ 2 ],
				stateString = tuple[ 5 ];

			// promise.progress = list.add
			// promise.done = list.add
			// promise.fail = list.add
			promise[ tuple[ 1 ] ] = list.add;

			// Handle state
			if ( stateString ) {
				list.add(
					function() {

						// state = "resolved" (i.e., fulfilled)
						// state = "rejected"
						state = stateString;
					},

					// rejected_callbacks.disable
					// fulfilled_callbacks.disable
					tuples[ 3 - i ][ 2 ].disable,

					// rejected_handlers.disable
					// fulfilled_handlers.disable
					tuples[ 3 - i ][ 3 ].disable,

					// progress_callbacks.lock
					tuples[ 0 ][ 2 ].lock,

					// progress_handlers.lock
					tuples[ 0 ][ 3 ].lock
				);
			}

			// progress_handlers.fire
			// fulfilled_handlers.fire
			// rejected_handlers.fire
			list.add( tuple[ 3 ].fire );

			// deferred.notify = function() { deferred.notifyWith(...) }
			// deferred.resolve = function() { deferred.resolveWith(...) }
			// deferred.reject = function() { deferred.rejectWith(...) }
			deferred[ tuple[ 0 ] ] = function() {
				deferred[ tuple[ 0 ] + "With" ]( this === deferred ? undefined : this, arguments );
				return this;
			};

			// deferred.notifyWith = list.fireWith
			// deferred.resolveWith = list.fireWith
			// deferred.rejectWith = list.fireWith
			deferred[ tuple[ 0 ] + "With" ] = list.fireWith;
		} );

		// Make the deferred a promise
		promise.promise( deferred );

		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

	// Deferred helper
	when: function( singleValue ) {
		var

			// count of uncompleted subordinates
			remaining = arguments.length,

			// count of unprocessed arguments
			i = remaining,

			// subordinate fulfillment data
			resolveContexts = Array( i ),
			resolveValues = slice.call( arguments ),

			// the primary Deferred
			primary = jQuery.Deferred(),

			// subordinate callback factory
			updateFunc = function( i ) {
				return function( value ) {
					resolveContexts[ i ] = this;
					resolveValues[ i ] = arguments.length > 1 ? slice.call( arguments ) : value;
					if ( !( --remaining ) ) {
						primary.resolveWith( resolveContexts, resolveValues );
					}
				};
			};

		// Single- and empty arguments are adopted like Promise.resolve
		if ( remaining <= 1 ) {
			adoptValue( singleValue, primary.done( updateFunc( i ) ).resolve, primary.reject,
				!remaining );

			// Use .then() to unwrap secondary thenables (cf. gh-3000)
			if ( primary.state() === "pending" ||
				isFunction( resolveValues[ i ] && resolveValues[ i ].then ) ) {

				return primary.then();
			}
		}

		// Multiple arguments are aggregated like Promise.all array elements
		while ( i-- ) {
			adoptValue( resolveValues[ i ], updateFunc( i ), primary.reject );
		}

		return primary.promise();
	}
} );


// These usually indicate a programmer mistake during development,
// warn about them ASAP rather than swallowing them by default.
var rerrorNames = /^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;

jQuery.Deferred.exceptionHook = function( error, stack ) {

	// Support: IE 8 - 9 only
	// Console exists when dev tools are open, which can happen at any time
	if ( window.console && window.console.warn && error && rerrorNames.test( error.name ) ) {
		window.console.warn( "jQuery.Deferred exception: " + error.message, error.stack, stack );
	}
};




jQuery.readyException = function( error ) {
	window.setTimeout( function() {
		throw error;
	} );
};




// The deferred used on DOM ready
var readyList = jQuery.Deferred();

jQuery.fn.ready = function( fn ) {

	readyList
		.then( fn )

		// Wrap jQuery.readyException in a function so that the lookup
		// happens at the time of error handling instead of callback
		// registration.
		.catch( function( error ) {
			jQuery.readyException( error );
		} );

	return this;
};

jQuery.extend( {

	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,

	// Handle when the DOM is ready
	ready: function( wait ) {

		// Abort if there are pending holds or we're already ready
		if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
			return;
		}

		// Remember that the DOM is ready
		jQuery.isReady = true;

		// If a normal DOM Ready event fired, decrement, and wait if need be
		if ( wait !== true && --jQuery.readyWait > 0 ) {
			return;
		}

		// If there are functions bound, to execute
		readyList.resolveWith( document, [ jQuery ] );
	}
} );

jQuery.ready.then = readyList.then;

// The ready event handler and self cleanup method
function completed() {
	document.removeEventListener( "DOMContentLoaded", completed );
	window.removeEventListener( "load", completed );
	jQuery.ready();
}

// Catch cases where $(document).ready() is called
// after the browser event has already occurred.
// Support: IE <=9 - 10 only
// Older IE sometimes signals "interactive" too soon
if ( document.readyState === "complete" ||
	( document.readyState !== "loading" && !document.documentElement.doScroll ) ) {

	// Handle it asynchronously to allow scripts the opportunity to delay ready
	window.setTimeout( jQuery.ready );

} else {

	// Use the handy event callback
	document.addEventListener( "DOMContentLoaded", completed );

	// A fallback to window.onload, that will always work
	window.addEventListener( "load", completed );
}




// Multifunctional method to get and set values of a collection
// The value/s can optionally be executed if it's a function
var access = function( elems, fn, key, value, chainable, emptyGet, raw ) {
	var i = 0,
		len = elems.length,
		bulk = key == null;

	// Sets many values
	if ( toType( key ) === "object" ) {
		chainable = true;
		for ( i in key ) {
			access( elems, fn, i, key[ i ], true, emptyGet, raw );
		}

	// Sets one value
	} else if ( value !== undefined ) {
		chainable = true;

		if ( !isFunction( value ) ) {
			raw = true;
		}

		if ( bulk ) {

			// Bulk operations run against the entire set
			if ( raw ) {
				fn.call( elems, value );
				fn = null;

			// ...except when executing function values
			} else {
				bulk = fn;
				fn = function( elem, _key, value ) {
					return bulk.call( jQuery( elem ), value );
				};
			}
		}

		if ( fn ) {
			for ( ; i < len; i++ ) {
				fn(
					elems[ i ], key, raw ?
						value :
						value.call( elems[ i ], i, fn( elems[ i ], key ) )
				);
			}
		}
	}

	if ( chainable ) {
		return elems;
	}

	// Gets
	if ( bulk ) {
		return fn.call( elems );
	}

	return len ? fn( elems[ 0 ], key ) : emptyGet;
};


// Matches dashed string for camelizing
var rmsPrefix = /^-ms-/,
	rdashAlpha = /-([a-z])/g;

// Used by camelCase as callback to replace()
function fcamelCase( _all, letter ) {
	return letter.toUpperCase();
}

// Convert dashed to camelCase; used by the css and data modules
// Support: IE <=9 - 11, Edge 12 - 15
// Microsoft forgot to hump their vendor prefix (#9572)
function camelCase( string ) {
	return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
}
var acceptData = function( owner ) {

	// Accepts only:
	//  - Node
	//    - Node.ELEMENT_NODE
	//    - Node.DOCUMENT_NODE
	//  - Object
	//    - Any
	return owner.nodeType === 1 || owner.nodeType === 9 || !( +owner.nodeType );
};




function Data() {
	this.expando = jQuery.expando + Data.uid++;
}

Data.uid = 1;

Data.prototype = {

	cache: function( owner ) {

		// Check if the owner object already has a cache
		var value = owner[ this.expando ];

		// If not, create one
		if ( !value ) {
			value = {};

			// We can accept data for non-element nodes in modern browsers,
			// but we should not, see #8335.
			// Always return an empty object.
			if ( acceptData( owner ) ) {

				// If it is a node unlikely to be stringify-ed or looped over
				// use plain assignment
				if ( owner.nodeType ) {
					owner[ this.expando ] = value;

				// Otherwise secure it in a non-enumerable property
				// configurable must be true to allow the property to be
				// deleted when data is removed
				} else {
					Object.defineProperty( owner, this.expando, {
						value: value,
						configurable: true
					} );
				}
			}
		}

		return value;
	},
	set: function( owner, data, value ) {
		var prop,
			cache = this.cache( owner );

		// Handle: [ owner, key, value ] args
		// Always use camelCase key (gh-2257)
		if ( typeof data === "string" ) {
			cache[ camelCase( data ) ] = value;

		// Handle: [ owner, { properties } ] args
		} else {

			// Copy the properties one-by-one to the cache object
			for ( prop in data ) {
				cache[ camelCase( prop ) ] = data[ prop ];
			}
		}
		return cache;
	},
	get: function( owner, key ) {
		return key === undefined ?
			this.cache( owner ) :

			// Always use camelCase key (gh-2257)
			owner[ this.expando ] && owner[ this.expando ][ camelCase( key ) ];
	},
	access: function( owner, key, value ) {

		// In cases where either:
		//
		//   1. No key was specified
		//   2. A string key was specified, but no value provided
		//
		// Take the "read" path and allow the get method to determine
		// which value to return, respectively either:
		//
		//   1. The entire cache object
		//   2. The data stored at the key
		//
		if ( key === undefined ||
				( ( key && typeof key === "string" ) && value === undefined ) ) {

			return this.get( owner, key );
		}

		// When the key is not a string, or both a key and value
		// are specified, set or extend (existing objects) with either:
		//
		//   1. An object of properties
		//   2. A key and value
		//
		this.set( owner, key, value );

		// Since the "set" path can have two possible entry points
		// return the expected data based on which path was taken[*]
		return value !== undefined ? value : key;
	},
	remove: function( owner, key ) {
		var i,
			cache = owner[ this.expando ];

		if ( cache === undefined ) {
			return;
		}

		if ( key !== undefined ) {

			// Support array or space separated string of keys
			if ( Array.isArray( key ) ) {

				// If key is an array of keys...
				// We always set camelCase keys, so remove that.
				key = key.map( camelCase );
			} else {
				key = camelCase( key );

				// If a key with the spaces exists, use it.
				// Otherwise, create an array by matching non-whitespace
				key = key in cache ?
					[ key ] :
					( key.match( rnothtmlwhite ) || [] );
			}

			i = key.length;

			while ( i-- ) {
				delete cache[ key[ i ] ];
			}
		}

		// Remove the expando if there's no more data
		if ( key === undefined || jQuery.isEmptyObject( cache ) ) {

			// Support: Chrome <=35 - 45
			// Webkit & Blink performance suffers when deleting properties
			// from DOM nodes, so set to undefined instead
			// https://bugs.chromium.org/p/chromium/issues/detail?id=378607 (bug restricted)
			if ( owner.nodeType ) {
				owner[ this.expando ] = undefined;
			} else {
				delete owner[ this.expando ];
			}
		}
	},
	hasData: function( owner ) {
		var cache = owner[ this.expando ];
		return cache !== undefined && !jQuery.isEmptyObject( cache );
	}
};
var dataPriv = new Data();

var dataUser = new Data();



//	Implementation Summary
//
//	1. Enforce API surface and semantic compatibility with 1.9.x branch
//	2. Improve the module's maintainability by reducing the storage
//		paths to a single mechanism.
//	3. Use the same single mechanism to support "private" and "user" data.
//	4. _Never_ expose "private" data to user code (TODO: Drop _data, _removeData)
//	5. Avoid exposing implementation details on user objects (eg. expando properties)
//	6. Provide a clear path for implementation upgrade to WeakMap in 2014

var rbrace = /^(?:\\{[\\w\\W]*\\}|\\[[\\w\\W]*\\])$/,
	rmultiDash = /[A-Z]/g;

function getData( data ) {
	if ( data === "true" ) {
		return true;
	}

	if ( data === "false" ) {
		return false;
	}

	if ( data === "null" ) {
		return null;
	}

	// Only convert to a number if it doesn't change the string
	if ( data === +data + "" ) {
		return +data;
	}

	if ( rbrace.test( data ) ) {
		return JSON.parse( data );
	}

	return data;
}

function dataAttr( elem, key, data ) {
	var name;

	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {
		name = "data-" + key.replace( rmultiDash, "-$&" ).toLowerCase();
		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = getData( data );
			} catch ( e ) {}

			// Make sure we set the data so it isn't changed later
			dataUser.set( elem, key, data );
		} else {
			data = undefined;
		}
	}
	return data;
}

jQuery.extend( {
	hasData: function( elem ) {
		return dataUser.hasData( elem ) || dataPriv.hasData( elem );
	},

	data: function( elem, name, data ) {
		return dataUser.access( elem, name, data );
	},

	removeData: function( elem, name ) {
		dataUser.remove( elem, name );
	},

	// TODO: Now that all calls to _data and _removeData have been replaced
	// with direct calls to dataPriv methods, these can be deprecated.
	_data: function( elem, name, data ) {
		return dataPriv.access( elem, name, data );
	},

	_removeData: function( elem, name ) {
		dataPriv.remove( elem, name );
	}
} );

jQuery.fn.extend( {
	data: function( key, value ) {
		var i, name, data,
			elem = this[ 0 ],
			attrs = elem && elem.attributes;

		// Gets all values
		if ( key === undefined ) {
			if ( this.length ) {
				data = dataUser.get( elem );

				if ( elem.nodeType === 1 && !dataPriv.get( elem, "hasDataAttrs" ) ) {
					i = attrs.length;
					while ( i-- ) {

						// Support: IE 11 only
						// The attrs elements can be null (#14894)
						if ( attrs[ i ] ) {
							name = attrs[ i ].name;
							if ( name.indexOf( "data-" ) === 0 ) {
								name = camelCase( name.slice( 5 ) );
								dataAttr( elem, name, data[ name ] );
							}
						}
					}
					dataPriv.set( elem, "hasDataAttrs", true );
				}
			}

			return data;
		}

		// Sets multiple values
		if ( typeof key === "object" ) {
			return this.each( function() {
				dataUser.set( this, key );
			} );
		}

		return access( this, function( value ) {
			var data;

			// The calling jQuery object (element matches) is not empty
			// (and therefore has an element appears at this[ 0 ]) and the
			// \`value\` parameter was not undefined. An empty jQuery object
			// will result in \`undefined\` for elem = this[ 0 ] which will
			// throw an exception if an attempt to read a data cache is made.
			if ( elem && value === undefined ) {

				// Attempt to get data from the cache
				// The key will always be camelCased in Data
				data = dataUser.get( elem, key );
				if ( data !== undefined ) {
					return data;
				}

				// Attempt to "discover" the data in
				// HTML5 custom data-* attrs
				data = dataAttr( elem, key );
				if ( data !== undefined ) {
					return data;
				}

				// We tried really hard, but the data doesn't exist.
				return;
			}

			// Set the data...
			this.each( function() {

				// We always store the camelCased key
				dataUser.set( this, key, value );
			} );
		}, null, value, arguments.length > 1, null, true );
	},

	removeData: function( key ) {
		return this.each( function() {
			dataUser.remove( this, key );
		} );
	}
} );


jQuery.extend( {
	queue: function( elem, type, data ) {
		var queue;

		if ( elem ) {
			type = ( type || "fx" ) + "queue";
			queue = dataPriv.get( elem, type );

			// Speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
				if ( !queue || Array.isArray( data ) ) {
					queue = dataPriv.access( elem, type, jQuery.makeArray( data ) );
				} else {
					queue.push( data );
				}
			}
			return queue || [];
		}
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			startLength = queue.length,
			fn = queue.shift(),
			hooks = jQuery._queueHooks( elem, type ),
			next = function() {
				jQuery.dequeue( elem, type );
			};

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
			startLength--;
		}

		if ( fn ) {

			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift( "inprogress" );
			}

			// Clear up the last queue stop function
			delete hooks.stop;
			fn.call( elem, next, hooks );
		}

		if ( !startLength && hooks ) {
			hooks.empty.fire();
		}
	},

	// Not public - generate a queueHooks object, or return the current one
	_queueHooks: function( elem, type ) {
		var key = type + "queueHooks";
		return dataPriv.get( elem, key ) || dataPriv.access( elem, key, {
			empty: jQuery.Callbacks( "once memory" ).add( function() {
				dataPriv.remove( elem, [ type + "queue", key ] );
			} )
		} );
	}
} );

jQuery.fn.extend( {
	queue: function( type, data ) {
		var setter = 2;

		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
			setter--;
		}

		if ( arguments.length < setter ) {
			return jQuery.queue( this[ 0 ], type );
		}

		return data === undefined ?
			this :
			this.each( function() {
				var queue = jQuery.queue( this, type, data );

				// Ensure a hooks for this queue
				jQuery._queueHooks( this, type );

				if ( type === "fx" && queue[ 0 ] !== "inprogress" ) {
					jQuery.dequeue( this, type );
				}
			} );
	},
	dequeue: function( type ) {
		return this.each( function() {
			jQuery.dequeue( this, type );
		} );
	},
	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	},

	// Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
	promise: function( type, obj ) {
		var tmp,
			count = 1,
			defer = jQuery.Deferred(),
			elements = this,
			i = this.length,
			resolve = function() {
				if ( !( --count ) ) {
					defer.resolveWith( elements, [ elements ] );
				}
			};

		if ( typeof type !== "string" ) {
			obj = type;
			type = undefined;
		}
		type = type || "fx";

		while ( i-- ) {
			tmp = dataPriv.get( elements[ i ], type + "queueHooks" );
			if ( tmp && tmp.empty ) {
				count++;
				tmp.empty.add( resolve );
			}
		}
		resolve();
		return defer.promise( obj );
	}
} );
var pnum = ( /[+-]?(?:\\d*\\.|)\\d+(?:[eE][+-]?\\d+|)/ ).source;

var rcssNum = new RegExp( "^(?:([+-])=|)(" + pnum + ")([a-z%]*)$", "i" );


var cssExpand = [ "Top", "Right", "Bottom", "Left" ];

var documentElement = document.documentElement;



	var isAttached = function( elem ) {
			return jQuery.contains( elem.ownerDocument, elem );
		},
		composed = { composed: true };

	// Support: IE 9 - 11+, Edge 12 - 18+, iOS 10.0 - 10.2 only
	// Check attachment across shadow DOM boundaries when possible (gh-3504)
	// Support: iOS 10.0-10.2 only
	// Early iOS 10 versions support \`attachShadow\` but not \`getRootNode\`,
	// leading to errors. We need to check for \`getRootNode\`.
	if ( documentElement.getRootNode ) {
		isAttached = function( elem ) {
			return jQuery.contains( elem.ownerDocument, elem ) ||
				elem.getRootNode( composed ) === elem.ownerDocument;
		};
	}
var isHiddenWithinTree = function( elem, el ) {

		// isHiddenWithinTree might be called from jQuery#filter function;
		// in that case, element will be second argument
		elem = el || elem;

		// Inline style trumps all
		return elem.style.display === "none" ||
			elem.style.display === "" &&

			// Otherwise, check computed style
			// Support: Firefox <=43 - 45
			// Disconnected elements can have computed display: none, so first confirm that elem is
			// in the document.
			isAttached( elem ) &&

			jQuery.css( elem, "display" ) === "none";
	};



function adjustCSS( elem, prop, valueParts, tween ) {
	var adjusted, scale,
		maxIterations = 20,
		currentValue = tween ?
			function() {
				return tween.cur();
			} :
			function() {
				return jQuery.css( elem, prop, "" );
			},
		initial = currentValue(),
		unit = valueParts && valueParts[ 3 ] || ( jQuery.cssNumber[ prop ] ? "" : "px" ),

		// Starting value computation is required for potential unit mismatches
		initialInUnit = elem.nodeType &&
			( jQuery.cssNumber[ prop ] || unit !== "px" && +initial ) &&
			rcssNum.exec( jQuery.css( elem, prop ) );

	if ( initialInUnit && initialInUnit[ 3 ] !== unit ) {

		// Support: Firefox <=54
		// Halve the iteration target value to prevent interference from CSS upper bounds (gh-2144)
		initial = initial / 2;

		// Trust units reported by jQuery.css
		unit = unit || initialInUnit[ 3 ];

		// Iteratively approximate from a nonzero starting point
		initialInUnit = +initial || 1;

		while ( maxIterations-- ) {

			// Evaluate and update our best guess (doubling guesses that zero out).
			// Finish if the scale equals or crosses 1 (making the old*new product non-positive).
			jQuery.style( elem, prop, initialInUnit + unit );
			if ( ( 1 - scale ) * ( 1 - ( scale = currentValue() / initial || 0.5 ) ) <= 0 ) {
				maxIterations = 0;
			}
			initialInUnit = initialInUnit / scale;

		}

		initialInUnit = initialInUnit * 2;
		jQuery.style( elem, prop, initialInUnit + unit );

		// Make sure we update the tween properties later on
		valueParts = valueParts || [];
	}

	if ( valueParts ) {
		initialInUnit = +initialInUnit || +initial || 0;

		// Apply relative offset (+=/-=) if specified
		adjusted = valueParts[ 1 ] ?
			initialInUnit + ( valueParts[ 1 ] + 1 ) * valueParts[ 2 ] :
			+valueParts[ 2 ];
		if ( tween ) {
			tween.unit = unit;
			tween.start = initialInUnit;
			tween.end = adjusted;
		}
	}
	return adjusted;
}


var defaultDisplayMap = {};

function getDefaultDisplay( elem ) {
	var temp,
		doc = elem.ownerDocument,
		nodeName = elem.nodeName,
		display = defaultDisplayMap[ nodeName ];

	if ( display ) {
		return display;
	}

	temp = doc.body.appendChild( doc.createElement( nodeName ) );
	display = jQuery.css( temp, "display" );

	temp.parentNode.removeChild( temp );

	if ( display === "none" ) {
		display = "block";
	}
	defaultDisplayMap[ nodeName ] = display;

	return display;
}

function showHide( elements, show ) {
	var display, elem,
		values = [],
		index = 0,
		length = elements.length;

	// Determine new display value for elements that need to change
	for ( ; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}

		display = elem.style.display;
		if ( show ) {

			// Since we force visibility upon cascade-hidden elements, an immediate (and slow)
			// check is required in this first loop unless we have a nonempty display value (either
			// inline or about-to-be-restored)
			if ( display === "none" ) {
				values[ index ] = dataPriv.get( elem, "display" ) || null;
				if ( !values[ index ] ) {
					elem.style.display = "";
				}
			}
			if ( elem.style.display === "" && isHiddenWithinTree( elem ) ) {
				values[ index ] = getDefaultDisplay( elem );
			}
		} else {
			if ( display !== "none" ) {
				values[ index ] = "none";

				// Remember what we're overwriting
				dataPriv.set( elem, "display", display );
			}
		}
	}

	// Set the display of the elements in a second loop to avoid constant reflow
	for ( index = 0; index < length; index++ ) {
		if ( values[ index ] != null ) {
			elements[ index ].style.display = values[ index ];
		}
	}

	return elements;
}

jQuery.fn.extend( {
	show: function() {
		return showHide( this, true );
	},
	hide: function() {
		return showHide( this );
	},
	toggle: function( state ) {
		if ( typeof state === "boolean" ) {
			return state ? this.show() : this.hide();
		}

		return this.each( function() {
			if ( isHiddenWithinTree( this ) ) {
				jQuery( this ).show();
			} else {
				jQuery( this ).hide();
			}
		} );
	}
} );
var rcheckableType = ( /^(?:checkbox|radio)$/i );

var rtagName = ( /<([a-z][^\\/\\0>\\x20\\t\\r\\n\\f]*)/i );

var rscriptType = ( /^$|^module$|\\/(?:java|ecma)script/i );



( function() {
	var fragment = document.createDocumentFragment(),
		div = fragment.appendChild( document.createElement( "div" ) ),
		input = document.createElement( "input" );

	// Support: Android 4.0 - 4.3 only
	// Check state lost if the name is set (#11217)
	// Support: Windows Web Apps (WWA)
	// \`name\` and \`type\` must use .setAttribute for WWA (#14901)
	input.setAttribute( "type", "radio" );
	input.setAttribute( "checked", "checked" );
	input.setAttribute( "name", "t" );

	div.appendChild( input );

	// Support: Android <=4.1 only
	// Older WebKit doesn't clone checked state correctly in fragments
	support.checkClone = div.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Support: IE <=11 only
	// Make sure textarea (and checkbox) defaultValue is properly cloned
	div.innerHTML = "<textarea>x</textarea>";
	support.noCloneChecked = !!div.cloneNode( true ).lastChild.defaultValue;

	// Support: IE <=9 only
	// IE <=9 replaces <option> tags with their contents when inserted outside of
	// the select element.
	div.innerHTML = "<option></option>";
	support.option = !!div.lastChild;
} )();


// We have to close these tags to support XHTML (#13200)
var wrapMap = {

	// XHTML parsers do not magically insert elements in the
	// same way that tag soup parsers do. So we cannot shorten
	// this by omitting <tbody> or other required elements.
	thead: [ 1, "<table>", "</table>" ],
	col: [ 2, "<table><colgroup>", "</colgroup></table>" ],
	tr: [ 2, "<table><tbody>", "</tbody></table>" ],
	td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],

	_default: [ 0, "", "" ]
};

wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;

// Support: IE <=9 only
if ( !support.option ) {
	wrapMap.optgroup = wrapMap.option = [ 1, "<select multiple='multiple'>", "</select>" ];
}


function getAll( context, tag ) {

	// Support: IE <=9 - 11 only
	// Use typeof to avoid zero-argument method invocation on host objects (#15151)
	var ret;

	if ( typeof context.getElementsByTagName !== "undefined" ) {
		ret = context.getElementsByTagName( tag || "*" );

	} else if ( typeof context.querySelectorAll !== "undefined" ) {
		ret = context.querySelectorAll( tag || "*" );

	} else {
		ret = [];
	}

	if ( tag === undefined || tag && nodeName( context, tag ) ) {
		return jQuery.merge( [ context ], ret );
	}

	return ret;
}


// Mark scripts as having already been evaluated
function setGlobalEval( elems, refElements ) {
	var i = 0,
		l = elems.length;

	for ( ; i < l; i++ ) {
		dataPriv.set(
			elems[ i ],
			"globalEval",
			!refElements || dataPriv.get( refElements[ i ], "globalEval" )
		);
	}
}


var rhtml = /<|&#?\\w+;/;

function buildFragment( elems, context, scripts, selection, ignored ) {
	var elem, tmp, tag, wrap, attached, j,
		fragment = context.createDocumentFragment(),
		nodes = [],
		i = 0,
		l = elems.length;

	for ( ; i < l; i++ ) {
		elem = elems[ i ];

		if ( elem || elem === 0 ) {

			// Add nodes directly
			if ( toType( elem ) === "object" ) {

				// Support: Android <=4.0 only, PhantomJS 1 only
				// push.apply(_, arraylike) throws on ancient WebKit
				jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );

			// Convert non-html into a text node
			} else if ( !rhtml.test( elem ) ) {
				nodes.push( context.createTextNode( elem ) );

			// Convert html into DOM nodes
			} else {
				tmp = tmp || fragment.appendChild( context.createElement( "div" ) );

				// Deserialize a standard representation
				tag = ( rtagName.exec( elem ) || [ "", "" ] )[ 1 ].toLowerCase();
				wrap = wrapMap[ tag ] || wrapMap._default;
				tmp.innerHTML = wrap[ 1 ] + jQuery.htmlPrefilter( elem ) + wrap[ 2 ];

				// Descend through wrappers to the right content
				j = wrap[ 0 ];
				while ( j-- ) {
					tmp = tmp.lastChild;
				}

				// Support: Android <=4.0 only, PhantomJS 1 only
				// push.apply(_, arraylike) throws on ancient WebKit
				jQuery.merge( nodes, tmp.childNodes );

				// Remember the top-level container
				tmp = fragment.firstChild;

				// Ensure the created nodes are orphaned (#12392)
				tmp.textContent = "";
			}
		}
	}

	// Remove wrapper from fragment
	fragment.textContent = "";

	i = 0;
	while ( ( elem = nodes[ i++ ] ) ) {

		// Skip elements already in the context collection (trac-4087)
		if ( selection && jQuery.inArray( elem, selection ) > -1 ) {
			if ( ignored ) {
				ignored.push( elem );
			}
			continue;
		}

		attached = isAttached( elem );

		// Append to fragment
		tmp = getAll( fragment.appendChild( elem ), "script" );

		// Preserve script evaluation history
		if ( attached ) {
			setGlobalEval( tmp );
		}

		// Capture executables
		if ( scripts ) {
			j = 0;
			while ( ( elem = tmp[ j++ ] ) ) {
				if ( rscriptType.test( elem.type || "" ) ) {
					scripts.push( elem );
				}
			}
		}
	}

	return fragment;
}


var rtypenamespace = /^([^.]*)(?:\\.(.+)|)/;

function returnTrue() {
	return true;
}

function returnFalse() {
	return false;
}

// Support: IE <=9 - 11+
// focus() and blur() are asynchronous, except when they are no-op.
// So expect focus to be synchronous when the element is already active,
// and blur to be synchronous when the element is not already active.
// (focus and blur are always synchronous in other supported browsers,
// this just defines when we can count on it).
function expectSync( elem, type ) {
	return ( elem === safeActiveElement() ) === ( type === "focus" );
}

// Support: IE <=9 only
// Accessing document.activeElement can throw unexpectedly
// https://bugs.jquery.com/ticket/13393
function safeActiveElement() {
	try {
		return document.activeElement;
	} catch ( err ) { }
}

function on( elem, types, selector, data, fn, one ) {
	var origFn, type;

	// Types can be a map of types/handlers
	if ( typeof types === "object" ) {

		// ( types-Object, selector, data )
		if ( typeof selector !== "string" ) {

			// ( types-Object, data )
			data = data || selector;
			selector = undefined;
		}
		for ( type in types ) {
			on( elem, type, selector, data, types[ type ], one );
		}
		return elem;
	}

	if ( data == null && fn == null ) {

		// ( types, fn )
		fn = selector;
		data = selector = undefined;
	} else if ( fn == null ) {
		if ( typeof selector === "string" ) {

			// ( types, selector, fn )
			fn = data;
			data = undefined;
		} else {

			// ( types, data, fn )
			fn = data;
			data = selector;
			selector = undefined;
		}
	}
	if ( fn === false ) {
		fn = returnFalse;
	} else if ( !fn ) {
		return elem;
	}

	if ( one === 1 ) {
		origFn = fn;
		fn = function( event ) {

			// Can use an empty set, since event contains the info
			jQuery().off( event );
			return origFn.apply( this, arguments );
		};

		// Use same guid so caller can remove using origFn
		fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
	}
	return elem.each( function() {
		jQuery.event.add( this, types, fn, data, selector );
	} );
}

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

	global: {},

	add: function( elem, types, handler, data, selector ) {

		var handleObjIn, eventHandle, tmp,
			events, t, handleObj,
			special, handlers, type, namespaces, origType,
			elemData = dataPriv.get( elem );

		// Only attach events to objects that accept data
		if ( !acceptData( elem ) ) {
			return;
		}

		// Caller can pass in an object of custom data in lieu of the handler
		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
			selector = handleObjIn.selector;
		}

		// Ensure that invalid selectors throw exceptions at attach time
		// Evaluate against documentElement in case elem is a non-element node (e.g., document)
		if ( selector ) {
			jQuery.find.matchesSelector( documentElement, selector );
		}

		// Make sure that the handler has a unique ID, used to find/remove it later
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure and main handler, if this is the first
		if ( !( events = elemData.events ) ) {
			events = elemData.events = Object.create( null );
		}
		if ( !( eventHandle = elemData.handle ) ) {
			eventHandle = elemData.handle = function( e ) {

				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jQuery !== "undefined" && jQuery.event.triggered !== e.type ?
					jQuery.event.dispatch.apply( elem, arguments ) : undefined;
			};
		}

		// Handle multiple events separated by a space
		types = ( types || "" ).match( rnothtmlwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[ t ] ) || [];
			type = origType = tmp[ 1 ];
			namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();

			// There *must* be a type, no attaching namespace-only handlers
			if ( !type ) {
				continue;
			}

			// If event changes its type, use the special event handlers for the changed type
			special = jQuery.event.special[ type ] || {};

			// If selector defined, determine special event api type, otherwise given type
			type = ( selector ? special.delegateType : special.bindType ) || type;

			// Update special based on newly reset type
			special = jQuery.event.special[ type ] || {};

			// handleObj is passed to all event handlers
			handleObj = jQuery.extend( {
				type: type,
				origType: origType,
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
				namespace: namespaces.join( "." )
			}, handleObjIn );

			// Init the event handler queue if we're the first
			if ( !( handlers = events[ type ] ) ) {
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;

				// Only use addEventListener if the special events handler returns false
				if ( !special.setup ||
					special.setup.call( elem, data, namespaces, eventHandle ) === false ) {

					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add to the element's handler list, delegates in front
			if ( selector ) {
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {
				handlers.push( handleObj );
			}

			// Keep track of which events have ever been used, for event optimization
			jQuery.event.global[ type ] = true;
		}

	},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, selector, mappedTypes ) {

		var j, origCount, tmp,
			events, t, handleObj,
			special, handlers, type, namespaces, origType,
			elemData = dataPriv.hasData( elem ) && dataPriv.get( elem );

		if ( !elemData || !( events = elemData.events ) ) {
			return;
		}

		// Once for each type.namespace in types; type may be omitted
		types = ( types || "" ).match( rnothtmlwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[ t ] ) || [];
			type = origType = tmp[ 1 ];
			namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();

			// Unbind all events (on this namespace, if provided) for the element
			if ( !type ) {
				for ( type in events ) {
					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
				}
				continue;
			}

			special = jQuery.event.special[ type ] || {};
			type = ( selector ? special.delegateType : special.bindType ) || type;
			handlers = events[ type ] || [];
			tmp = tmp[ 2 ] &&
				new RegExp( "(^|\\\\.)" + namespaces.join( "\\\\.(?:.*\\\\.|)" ) + "(\\\\.|$)" );

			// Remove matching events
			origCount = j = handlers.length;
			while ( j-- ) {
				handleObj = handlers[ j ];

				if ( ( mappedTypes || origType === handleObj.origType ) &&
					( !handler || handler.guid === handleObj.guid ) &&
					( !tmp || tmp.test( handleObj.namespace ) ) &&
					( !selector || selector === handleObj.selector ||
						selector === "**" && handleObj.selector ) ) {
					handlers.splice( j, 1 );

					if ( handleObj.selector ) {
						handlers.delegateCount--;
					}
					if ( special.remove ) {
						special.remove.call( elem, handleObj );
					}
				}
			}

			// Remove generic event handler if we removed something and no more handlers exist
			// (avoids potential for endless recursion during removal of special event handlers)
			if ( origCount && !handlers.length ) {
				if ( !special.teardown ||
					special.teardown.call( elem, namespaces, elemData.handle ) === false ) {

					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}

		// Remove data and the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			dataPriv.remove( elem, "handle events" );
		}
	},

	dispatch: function( nativeEvent ) {

		var i, j, ret, matched, handleObj, handlerQueue,
			args = new Array( arguments.length ),

			// Make a writable jQuery.Event from the native event object
			event = jQuery.event.fix( nativeEvent ),

			handlers = (
				dataPriv.get( this, "events" ) || Object.create( null )
			)[ event.type ] || [],
			special = jQuery.event.special[ event.type ] || {};

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		args[ 0 ] = event;

		for ( i = 1; i < arguments.length; i++ ) {
			args[ i ] = arguments[ i ];
		}

		event.delegateTarget = this;

		// Call the preDispatch hook for the mapped type, and let it bail if desired
		if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
			return;
		}

		// Determine handlers
		handlerQueue = jQuery.event.handlers.call( this, event, handlers );

		// Run delegates first; they may want to stop propagation beneath us
		i = 0;
		while ( ( matched = handlerQueue[ i++ ] ) && !event.isPropagationStopped() ) {
			event.currentTarget = matched.elem;

			j = 0;
			while ( ( handleObj = matched.handlers[ j++ ] ) &&
				!event.isImmediatePropagationStopped() ) {

				// If the event is namespaced, then each handler is only invoked if it is
				// specially universal or its namespaces are a superset of the event's.
				if ( !event.rnamespace || handleObj.namespace === false ||
					event.rnamespace.test( handleObj.namespace ) ) {

					event.handleObj = handleObj;
					event.data = handleObj.data;

					ret = ( ( jQuery.event.special[ handleObj.origType ] || {} ).handle ||
						handleObj.handler ).apply( matched.elem, args );

					if ( ret !== undefined ) {
						if ( ( event.result = ret ) === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

		// Call the postDispatch hook for the mapped type
		if ( special.postDispatch ) {
			special.postDispatch.call( this, event );
		}

		return event.result;
	},

	handlers: function( event, handlers ) {
		var i, handleObj, sel, matchedHandlers, matchedSelectors,
			handlerQueue = [],
			delegateCount = handlers.delegateCount,
			cur = event.target;

		// Find delegate handlers
		if ( delegateCount &&

			// Support: IE <=9
			// Black-hole SVG <use> instance trees (trac-13180)
			cur.nodeType &&

			// Support: Firefox <=42
			// Suppress spec-violating clicks indicating a non-primary pointer button (trac-3861)
			// https://www.w3.org/TR/DOM-Level-3-Events/#event-type-click
			// Support: IE 11 only
			// ...but not arrow key "clicks" of radio inputs, which can have \`button\` -1 (gh-2343)
			!( event.type === "click" && event.button >= 1 ) ) {

			for ( ; cur !== this; cur = cur.parentNode || this ) {

				// Don't check non-elements (#13208)
				// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
				if ( cur.nodeType === 1 && !( event.type === "click" && cur.disabled === true ) ) {
					matchedHandlers = [];
					matchedSelectors = {};
					for ( i = 0; i < delegateCount; i++ ) {
						handleObj = handlers[ i ];

						// Don't conflict with Object.prototype properties (#13203)
						sel = handleObj.selector + " ";

						if ( matchedSelectors[ sel ] === undefined ) {
							matchedSelectors[ sel ] = handleObj.needsContext ?
								jQuery( sel, this ).index( cur ) > -1 :
								jQuery.find( sel, this, null, [ cur ] ).length;
						}
						if ( matchedSelectors[ sel ] ) {
							matchedHandlers.push( handleObj );
						}
					}
					if ( matchedHandlers.length ) {
						handlerQueue.push( { elem: cur, handlers: matchedHandlers } );
					}
				}
			}
		}

		// Add the remaining (directly-bound) handlers
		cur = this;
		if ( delegateCount < handlers.length ) {
			handlerQueue.push( { elem: cur, handlers: handlers.slice( delegateCount ) } );
		}

		return handlerQueue;
	},

	addProp: function( name, hook ) {
		Object.defineProperty( jQuery.Event.prototype, name, {
			enumerable: true,
			configurable: true,

			get: isFunction( hook ) ?
				function() {
					if ( this.originalEvent ) {
						return hook( this.originalEvent );
					}
				} :
				function() {
					if ( this.originalEvent ) {
						return this.originalEvent[ name ];
					}
				},

			set: function( value ) {
				Object.defineProperty( this, name, {
					enumerable: true,
					configurable: true,
					writable: true,
					value: value
				} );
			}
		} );
	},

	fix: function( originalEvent ) {
		return originalEvent[ jQuery.expando ] ?
			originalEvent :
			new jQuery.Event( originalEvent );
	},

	special: {
		load: {

			// Prevent triggered image.load events from bubbling to window.load
			noBubble: true
		},
		click: {

			// Utilize native event to ensure correct state for checkable inputs
			setup: function( data ) {

				// For mutual compressibility with _default, replace \`this\` access with a local var.
				// \`|| data\` is dead code meant only to preserve the variable through minification.
				var el = this || data;

				// Claim the first handler
				if ( rcheckableType.test( el.type ) &&
					el.click && nodeName( el, "input" ) ) {

					// dataPriv.set( el, "click", ... )
					leverageNative( el, "click", returnTrue );
				}

				// Return false to allow normal processing in the caller
				return false;
			},
			trigger: function( data ) {

				// For mutual compressibility with _default, replace \`this\` access with a local var.
				// \`|| data\` is dead code meant only to preserve the variable through minification.
				var el = this || data;

				// Force setup before triggering a click
				if ( rcheckableType.test( el.type ) &&
					el.click && nodeName( el, "input" ) ) {

					leverageNative( el, "click" );
				}

				// Return non-false to allow normal event-path propagation
				return true;
			},

			// For cross-browser consistency, suppress native .click() on links
			// Also prevent it if we're currently inside a leveraged native-event stack
			_default: function( event ) {
				var target = event.target;
				return rcheckableType.test( target.type ) &&
					target.click && nodeName( target, "input" ) &&
					dataPriv.get( target, "click" ) ||
					nodeName( target, "a" );
			}
		},

		beforeunload: {
			postDispatch: function( event ) {

				// Support: Firefox 20+
				// Firefox doesn't alert if the returnValue field is not set.
				if ( event.result !== undefined && event.originalEvent ) {
					event.originalEvent.returnValue = event.result;
				}
			}
		}
	}
};

// Ensure the presence of an event listener that handles manually-triggered
// synthetic events by interrupting progress until reinvoked in response to
// *native* events that it fires directly, ensuring that state changes have
// already occurred before other listeners are invoked.
function leverageNative( el, type, expectSync ) {

	// Missing expectSync indicates a trigger call, which must force setup through jQuery.event.add
	if ( !expectSync ) {
		if ( dataPriv.get( el, type ) === undefined ) {
			jQuery.event.add( el, type, returnTrue );
		}
		return;
	}

	// Register the controller as a special universal handler for all event namespaces
	dataPriv.set( el, type, false );
	jQuery.event.add( el, type, {
		namespace: false,
		handler: function( event ) {
			var notAsync, result,
				saved = dataPriv.get( this, type );

			if ( ( event.isTrigger & 1 ) && this[ type ] ) {

				// Interrupt processing of the outer synthetic .trigger()ed event
				// Saved data should be false in such cases, but might be a leftover capture object
				// from an async native handler (gh-4350)
				if ( !saved.length ) {

					// Store arguments for use when handling the inner native event
					// There will always be at least one argument (an event object), so this array
					// will not be confused with a leftover capture object.
					saved = slice.call( arguments );
					dataPriv.set( this, type, saved );

					// Trigger the native event and capture its result
					// Support: IE <=9 - 11+
					// focus() and blur() are asynchronous
					notAsync = expectSync( this, type );
					this[ type ]();
					result = dataPriv.get( this, type );
					if ( saved !== result || notAsync ) {
						dataPriv.set( this, type, false );
					} else {
						result = {};
					}
					if ( saved !== result ) {

						// Cancel the outer synthetic event
						event.stopImmediatePropagation();
						event.preventDefault();

						// Support: Chrome 86+
						// In Chrome, if an element having a focusout handler is blurred by
						// clicking outside of it, it invokes the handler synchronously. If
						// that handler calls \`.remove()\` on the element, the data is cleared,
						// leaving \`result\` undefined. We need to guard against this.
						return result && result.value;
					}

				// If this is an inner synthetic event for an event with a bubbling surrogate
				// (focus or blur), assume that the surrogate already propagated from triggering the
				// native event and prevent that from happening again here.
				// This technically gets the ordering wrong w.r.t. to \`.trigger()\` (in which the
				// bubbling surrogate propagates *after* the non-bubbling base), but that seems
				// less bad than duplication.
				} else if ( ( jQuery.event.special[ type ] || {} ).delegateType ) {
					event.stopPropagation();
				}

			// If this is a native event triggered above, everything is now in order
			// Fire an inner synthetic event with the original arguments
			} else if ( saved.length ) {

				// ...and capture the result
				dataPriv.set( this, type, {
					value: jQuery.event.trigger(

						// Support: IE <=9 - 11+
						// Extend with the prototype to reset the above stopImmediatePropagation()
						jQuery.extend( saved[ 0 ], jQuery.Event.prototype ),
						saved.slice( 1 ),
						this
					)
				} );

				// Abort handling of the native event
				event.stopImmediatePropagation();
			}
		}
	} );
}

jQuery.removeEvent = function( elem, type, handle ) {

	// This "if" is needed for plain objects
	if ( elem.removeEventListener ) {
		elem.removeEventListener( type, handle );
	}
};

jQuery.Event = function( src, props ) {

	// Allow instantiation without the 'new' keyword
	if ( !( this instanceof jQuery.Event ) ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = src.defaultPrevented ||
				src.defaultPrevented === undefined &&

				// Support: Android <=2.3 only
				src.returnValue === false ?
			returnTrue :
			returnFalse;

		// Create target properties
		// Support: Safari <=6 - 7 only
		// Target should not be a text node (#504, #13143)
		this.target = ( src.target && src.target.nodeType === 3 ) ?
			src.target.parentNode :
			src.target;

		this.currentTarget = src.currentTarget;
		this.relatedTarget = src.relatedTarget;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	if ( props ) {
		jQuery.extend( this, props );
	}

	// Create a timestamp if incoming event doesn't have one
	this.timeStamp = src && src.timeStamp || Date.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// https://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	constructor: jQuery.Event,
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse,
	isSimulated: false,

	preventDefault: function() {
		var e = this.originalEvent;

		this.isDefaultPrevented = returnTrue;

		if ( e && !this.isSimulated ) {
			e.preventDefault();
		}
	},
	stopPropagation: function() {
		var e = this.originalEvent;

		this.isPropagationStopped = returnTrue;

		if ( e && !this.isSimulated ) {
			e.stopPropagation();
		}
	},
	stopImmediatePropagation: function() {
		var e = this.originalEvent;

		this.isImmediatePropagationStopped = returnTrue;

		if ( e && !this.isSimulated ) {
			e.stopImmediatePropagation();
		}

		this.stopPropagation();
	}
};

// Includes all common event props including KeyEvent and MouseEvent specific props
jQuery.each( {
	altKey: true,
	bubbles: true,
	cancelable: true,
	changedTouches: true,
	ctrlKey: true,
	detail: true,
	eventPhase: true,
	metaKey: true,
	pageX: true,
	pageY: true,
	shiftKey: true,
	view: true,
	"char": true,
	code: true,
	charCode: true,
	key: true,
	keyCode: true,
	button: true,
	buttons: true,
	clientX: true,
	clientY: true,
	offsetX: true,
	offsetY: true,
	pointerId: true,
	pointerType: true,
	screenX: true,
	screenY: true,
	targetTouches: true,
	toElement: true,
	touches: true,
	which: true
}, jQuery.event.addProp );

jQuery.each( { focus: "focusin", blur: "focusout" }, function( type, delegateType ) {
	jQuery.event.special[ type ] = {

		// Utilize native event if possible so blur/focus sequence is correct
		setup: function() {

			// Claim the first handler
			// dataPriv.set( this, "focus", ... )
			// dataPriv.set( this, "blur", ... )
			leverageNative( this, type, expectSync );

			// Return false to allow normal processing in the caller
			return false;
		},
		trigger: function() {

			// Force setup before trigger
			leverageNative( this, type );

			// Return non-false to allow normal event-path propagation
			return true;
		},

		// Suppress native focus or blur as it's already being fired
		// in leverageNative.
		_default: function() {
			return true;
		},

		delegateType: delegateType
	};
} );

// Create mouseenter/leave events using mouseover/out and event-time checks
// so that event delegation works in jQuery.
// Do the same for pointerenter/pointerleave and pointerover/pointerout
//
// Support: Safari 7 only
// Safari sends mouseenter too often; see:
// https://bugs.chromium.org/p/chromium/issues/detail?id=470258
// for the description of the bug (it existed in older Chrome versions as well).
jQuery.each( {
	mouseenter: "mouseover",
	mouseleave: "mouseout",
	pointerenter: "pointerover",
	pointerleave: "pointerout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		delegateType: fix,
		bindType: fix,

		handle: function( event ) {
			var ret,
				target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj;

			// For mouseenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			if ( !related || ( related !== target && !jQuery.contains( target, related ) ) ) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
} );

jQuery.fn.extend( {

	on: function( types, selector, data, fn ) {
		return on( this, types, selector, data, fn );
	},
	one: function( types, selector, data, fn ) {
		return on( this, types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		var handleObj, type;
		if ( types && types.preventDefault && types.handleObj ) {

			// ( event )  dispatched jQuery.Event
			handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace ?
					handleObj.origType + "." + handleObj.namespace :
					handleObj.origType,
				handleObj.selector,
				handleObj.handler
			);
			return this;
		}
		if ( typeof types === "object" ) {

			// ( types-object [, selector] )
			for ( type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
		if ( selector === false || typeof selector === "function" ) {

			// ( types [, fn] )
			fn = selector;
			selector = undefined;
		}
		if ( fn === false ) {
			fn = returnFalse;
		}
		return this.each( function() {
			jQuery.event.remove( this, types, fn, selector );
		} );
	}
} );


var

	// Support: IE <=10 - 11, Edge 12 - 13 only
	// In IE/Edge using regex groups here causes severe slowdowns.
	// See https://connect.microsoft.com/IE/feedback/details/1736512/
	rnoInnerhtml = /<script|<style|<link/i,

	// checked="checked" or checked
	rchecked = /checked\\s*(?:[^=]|=\\s*.checked.)/i,
	rcleanScript = /^\\s*<!(?:\\[CDATA\\[|--)|(?:\\]\\]|--)>\\s*$/g;

// Prefer a tbody over its parent table for containing new rows
function manipulationTarget( elem, content ) {
	if ( nodeName( elem, "table" ) &&
		nodeName( content.nodeType !== 11 ? content : content.firstChild, "tr" ) ) {

		return jQuery( elem ).children( "tbody" )[ 0 ] || elem;
	}

	return elem;
}

// Replace/restore the type attribute of script elements for safe DOM manipulation
function disableScript( elem ) {
	elem.type = ( elem.getAttribute( "type" ) !== null ) + "/" + elem.type;
	return elem;
}
function restoreScript( elem ) {
	if ( ( elem.type || "" ).slice( 0, 5 ) === "true/" ) {
		elem.type = elem.type.slice( 5 );
	} else {
		elem.removeAttribute( "type" );
	}

	return elem;
}

function cloneCopyEvent( src, dest ) {
	var i, l, type, pdataOld, udataOld, udataCur, events;

	if ( dest.nodeType !== 1 ) {
		return;
	}

	// 1. Copy private data: events, handlers, etc.
	if ( dataPriv.hasData( src ) ) {
		pdataOld = dataPriv.get( src );
		events = pdataOld.events;

		if ( events ) {
			dataPriv.remove( dest, "handle events" );

			for ( type in events ) {
				for ( i = 0, l = events[ type ].length; i < l; i++ ) {
					jQuery.event.add( dest, type, events[ type ][ i ] );
				}
			}
		}
	}

	// 2. Copy user data
	if ( dataUser.hasData( src ) ) {
		udataOld = dataUser.access( src );
		udataCur = jQuery.extend( {}, udataOld );

		dataUser.set( dest, udataCur );
	}
}

// Fix IE bugs, see support tests
function fixInput( src, dest ) {
	var nodeName = dest.nodeName.toLowerCase();

	// Fails to persist the checked state of a cloned checkbox or radio button.
	if ( nodeName === "input" && rcheckableType.test( src.type ) ) {
		dest.checked = src.checked;

	// Fails to return the selected option to the default selected state when cloning options
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;
	}
}

function domManip( collection, args, callback, ignored ) {

	// Flatten any nested arrays
	args = flat( args );

	var fragment, first, scripts, hasScripts, node, doc,
		i = 0,
		l = collection.length,
		iNoClone = l - 1,
		value = args[ 0 ],
		valueIsFunction = isFunction( value );

	// We can't cloneNode fragments that contain checked, in WebKit
	if ( valueIsFunction ||
			( l > 1 && typeof value === "string" &&
				!support.checkClone && rchecked.test( value ) ) ) {
		return collection.each( function( index ) {
			var self = collection.eq( index );
			if ( valueIsFunction ) {
				args[ 0 ] = value.call( this, index, self.html() );
			}
			domManip( self, args, callback, ignored );
		} );
	}

	if ( l ) {
		fragment = buildFragment( args, collection[ 0 ].ownerDocument, false, collection, ignored );
		first = fragment.firstChild;

		if ( fragment.childNodes.length === 1 ) {
			fragment = first;
		}

		// Require either new content or an interest in ignored elements to invoke the callback
		if ( first || ignored ) {
			scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
			hasScripts = scripts.length;

			// Use the original fragment for the last item
			// instead of the first because it can end up
			// being emptied incorrectly in certain situations (#8070).
			for ( ; i < l; i++ ) {
				node = fragment;

				if ( i !== iNoClone ) {
					node = jQuery.clone( node, true, true );

					// Keep references to cloned scripts for later restoration
					if ( hasScripts ) {

						// Support: Android <=4.0 only, PhantomJS 1 only
						// push.apply(_, arraylike) throws on ancient WebKit
						jQuery.merge( scripts, getAll( node, "script" ) );
					}
				}

				callback.call( collection[ i ], node, i );
			}

			if ( hasScripts ) {
				doc = scripts[ scripts.length - 1 ].ownerDocument;

				// Reenable scripts
				jQuery.map( scripts, restoreScript );

				// Evaluate executable scripts on first document insertion
				for ( i = 0; i < hasScripts; i++ ) {
					node = scripts[ i ];
					if ( rscriptType.test( node.type || "" ) &&
						!dataPriv.access( node, "globalEval" ) &&
						jQuery.contains( doc, node ) ) {

						if ( node.src && ( node.type || "" ).toLowerCase()  !== "module" ) {

							// Optional AJAX dependency, but won't run scripts if not present
							if ( jQuery._evalUrl && !node.noModule ) {
								jQuery._evalUrl( node.src, {
									nonce: node.nonce || node.getAttribute( "nonce" )
								}, doc );
							}
						} else {
							DOMEval( node.textContent.replace( rcleanScript, "" ), node, doc );
						}
					}
				}
			}
		}
	}

	return collection;
}

function remove( elem, selector, keepData ) {
	var node,
		nodes = selector ? jQuery.filter( selector, elem ) : elem,
		i = 0;

	for ( ; ( node = nodes[ i ] ) != null; i++ ) {
		if ( !keepData && node.nodeType === 1 ) {
			jQuery.cleanData( getAll( node ) );
		}

		if ( node.parentNode ) {
			if ( keepData && isAttached( node ) ) {
				setGlobalEval( getAll( node, "script" ) );
			}
			node.parentNode.removeChild( node );
		}
	}

	return elem;
}

jQuery.extend( {
	htmlPrefilter: function( html ) {
		return html;
	},

	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var i, l, srcElements, destElements,
			clone = elem.cloneNode( true ),
			inPage = isAttached( elem );

		// Fix IE cloning issues
		if ( !support.noCloneChecked && ( elem.nodeType === 1 || elem.nodeType === 11 ) &&
				!jQuery.isXMLDoc( elem ) ) {

			// We eschew Sizzle here for performance reasons: https://jsperf.com/getall-vs-sizzle/2
			destElements = getAll( clone );
			srcElements = getAll( elem );

			for ( i = 0, l = srcElements.length; i < l; i++ ) {
				fixInput( srcElements[ i ], destElements[ i ] );
			}
		}

		// Copy the events from the original to the clone
		if ( dataAndEvents ) {
			if ( deepDataAndEvents ) {
				srcElements = srcElements || getAll( elem );
				destElements = destElements || getAll( clone );

				for ( i = 0, l = srcElements.length; i < l; i++ ) {
					cloneCopyEvent( srcElements[ i ], destElements[ i ] );
				}
			} else {
				cloneCopyEvent( elem, clone );
			}
		}

		// Preserve script evaluation history
		destElements = getAll( clone, "script" );
		if ( destElements.length > 0 ) {
			setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
		}

		// Return the cloned set
		return clone;
	},

	cleanData: function( elems ) {
		var data, elem, type,
			special = jQuery.event.special,
			i = 0;

		for ( ; ( elem = elems[ i ] ) !== undefined; i++ ) {
			if ( acceptData( elem ) ) {
				if ( ( data = elem[ dataPriv.expando ] ) ) {
					if ( data.events ) {
						for ( type in data.events ) {
							if ( special[ type ] ) {
								jQuery.event.remove( elem, type );

							// This is a shortcut to avoid jQuery.event.remove's overhead
							} else {
								jQuery.removeEvent( elem, type, data.handle );
							}
						}
					}

					// Support: Chrome <=35 - 45+
					// Assign undefined instead of using delete, see Data#remove
					elem[ dataPriv.expando ] = undefined;
				}
				if ( elem[ dataUser.expando ] ) {

					// Support: Chrome <=35 - 45+
					// Assign undefined instead of using delete, see Data#remove
					elem[ dataUser.expando ] = undefined;
				}
			}
		}
	}
} );

jQuery.fn.extend( {
	detach: function( selector ) {
		return remove( this, selector, true );
	},

	remove: function( selector ) {
		return remove( this, selector );
	},

	text: function( value ) {
		return access( this, function( value ) {
			return value === undefined ?
				jQuery.text( this ) :
				this.empty().each( function() {
					if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
						this.textContent = value;
					}
				} );
		}, null, value, arguments.length );
	},

	append: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.appendChild( elem );
			}
		} );
	},

	prepend: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.insertBefore( elem, target.firstChild );
			}
		} );
	},

	before: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this );
			}
		} );
	},

	after: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			}
		} );
	},

	empty: function() {
		var elem,
			i = 0;

		for ( ; ( elem = this[ i ] ) != null; i++ ) {
			if ( elem.nodeType === 1 ) {

				// Prevent memory leaks
				jQuery.cleanData( getAll( elem, false ) );

				// Remove any remaining nodes
				elem.textContent = "";
			}
		}

		return this;
	},

	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map( function() {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		} );
	},

	html: function( value ) {
		return access( this, function( value ) {
			var elem = this[ 0 ] || {},
				i = 0,
				l = this.length;

			if ( value === undefined && elem.nodeType === 1 ) {
				return elem.innerHTML;
			}

			// See if we can take a shortcut and just use innerHTML
			if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
				!wrapMap[ ( rtagName.exec( value ) || [ "", "" ] )[ 1 ].toLowerCase() ] ) {

				value = jQuery.htmlPrefilter( value );

				try {
					for ( ; i < l; i++ ) {
						elem = this[ i ] || {};

						// Remove element nodes and prevent memory leaks
						if ( elem.nodeType === 1 ) {
							jQuery.cleanData( getAll( elem, false ) );
							elem.innerHTML = value;
						}
					}

					elem = 0;

				// If using innerHTML throws an exception, use the fallback method
				} catch ( e ) {}
			}

			if ( elem ) {
				this.empty().append( value );
			}
		}, null, value, arguments.length );
	},

	replaceWith: function() {
		var ignored = [];

		// Make the changes, replacing each non-ignored context element with the new content
		return domManip( this, arguments, function( elem ) {
			var parent = this.parentNode;

			if ( jQuery.inArray( this, ignored ) < 0 ) {
				jQuery.cleanData( getAll( this ) );
				if ( parent ) {
					parent.replaceChild( elem, this );
				}
			}

		// Force callback invocation
		}, ignored );
	}
} );

jQuery.each( {
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var elems,
			ret = [],
			insert = jQuery( selector ),
			last = insert.length - 1,
			i = 0;

		for ( ; i <= last; i++ ) {
			elems = i === last ? this : this.clone( true );
			jQuery( insert[ i ] )[ original ]( elems );

			// Support: Android <=4.0 only, PhantomJS 1 only
			// .get() because push.apply(_, arraylike) throws on ancient WebKit
			push.apply( ret, elems.get() );
		}

		return this.pushStack( ret );
	};
} );
var rnumnonpx = new RegExp( "^(" + pnum + ")(?!px)[a-z%]+$", "i" );

var getStyles = function( elem ) {

		// Support: IE <=11 only, Firefox <=30 (#15098, #14150)
		// IE throws on elements created in popups
		// FF meanwhile throws on frame elements through "defaultView.getComputedStyle"
		var view = elem.ownerDocument.defaultView;

		if ( !view || !view.opener ) {
			view = window;
		}

		return view.getComputedStyle( elem );
	};

var swap = function( elem, options, callback ) {
	var ret, name,
		old = {};

	// Remember the old values, and insert the new ones
	for ( name in options ) {
		old[ name ] = elem.style[ name ];
		elem.style[ name ] = options[ name ];
	}

	ret = callback.call( elem );

	// Revert the old values
	for ( name in options ) {
		elem.style[ name ] = old[ name ];
	}

	return ret;
};


var rboxStyle = new RegExp( cssExpand.join( "|" ), "i" );



( function() {

	// Executing both pixelPosition & boxSizingReliable tests require only one layout
	// so they're executed at the same time to save the second computation.
	function computeStyleTests() {

		// This is a singleton, we need to execute it only once
		if ( !div ) {
			return;
		}

		container.style.cssText = "position:absolute;left:-11111px;width:60px;" +
			"margin-top:1px;padding:0;border:0";
		div.style.cssText =
			"position:relative;display:block;box-sizing:border-box;overflow:scroll;" +
			"margin:auto;border:1px;padding:1px;" +
			"width:60%;top:1%";
		documentElement.appendChild( container ).appendChild( div );

		var divStyle = window.getComputedStyle( div );
		pixelPositionVal = divStyle.top !== "1%";

		// Support: Android 4.0 - 4.3 only, Firefox <=3 - 44
		reliableMarginLeftVal = roundPixelMeasures( divStyle.marginLeft ) === 12;

		// Support: Android 4.0 - 4.3 only, Safari <=9.1 - 10.1, iOS <=7.0 - 9.3
		// Some styles come back with percentage values, even though they shouldn't
		div.style.right = "60%";
		pixelBoxStylesVal = roundPixelMeasures( divStyle.right ) === 36;

		// Support: IE 9 - 11 only
		// Detect misreporting of content dimensions for box-sizing:border-box elements
		boxSizingReliableVal = roundPixelMeasures( divStyle.width ) === 36;

		// Support: IE 9 only
		// Detect overflow:scroll screwiness (gh-3699)
		// Support: Chrome <=64
		// Don't get tricked when zoom affects offsetWidth (gh-4029)
		div.style.position = "absolute";
		scrollboxSizeVal = roundPixelMeasures( div.offsetWidth / 3 ) === 12;

		documentElement.removeChild( container );

		// Nullify the div so it wouldn't be stored in the memory and
		// it will also be a sign that checks already performed
		div = null;
	}

	function roundPixelMeasures( measure ) {
		return Math.round( parseFloat( measure ) );
	}

	var pixelPositionVal, boxSizingReliableVal, scrollboxSizeVal, pixelBoxStylesVal,
		reliableTrDimensionsVal, reliableMarginLeftVal,
		container = document.createElement( "div" ),
		div = document.createElement( "div" );

	// Finish early in limited (non-browser) environments
	if ( !div.style ) {
		return;
	}

	// Support: IE <=9 - 11 only
	// Style of cloned element affects source element cloned (#8908)
	div.style.backgroundClip = "content-box";
	div.cloneNode( true ).style.backgroundClip = "";
	support.clearCloneStyle = div.style.backgroundClip === "content-box";

	jQuery.extend( support, {
		boxSizingReliable: function() {
			computeStyleTests();
			return boxSizingReliableVal;
		},
		pixelBoxStyles: function() {
			computeStyleTests();
			return pixelBoxStylesVal;
		},
		pixelPosition: function() {
			computeStyleTests();
			return pixelPositionVal;
		},
		reliableMarginLeft: function() {
			computeStyleTests();
			return reliableMarginLeftVal;
		},
		scrollboxSize: function() {
			computeStyleTests();
			return scrollboxSizeVal;
		},

		// Support: IE 9 - 11+, Edge 15 - 18+
		// IE/Edge misreport \`getComputedStyle\` of table rows with width/height
		// set in CSS while \`offset*\` properties report correct values.
		// Behavior in IE 9 is more subtle than in newer versions & it passes
		// some versions of this test; make sure not to make it pass there!
		//
		// Support: Firefox 70+
		// Only Firefox includes border widths
		// in computed dimensions. (gh-4529)
		reliableTrDimensions: function() {
			var table, tr, trChild, trStyle;
			if ( reliableTrDimensionsVal == null ) {
				table = document.createElement( "table" );
				tr = document.createElement( "tr" );
				trChild = document.createElement( "div" );

				table.style.cssText = "position:absolute;left:-11111px;border-collapse:separate";
				tr.style.cssText = "border:1px solid";

				// Support: Chrome 86+
				// Height set through cssText does not get applied.
				// Computed height then comes back as 0.
				tr.style.height = "1px";
				trChild.style.height = "9px";

				// Support: Android 8 Chrome 86+
				// In our bodyBackground.html iframe,
				// display for all div elements is set to "inline",
				// which causes a problem only in Android 8 Chrome 86.
				// Ensuring the div is display: block
				// gets around this issue.
				trChild.style.display = "block";

				documentElement
					.appendChild( table )
					.appendChild( tr )
					.appendChild( trChild );

				trStyle = window.getComputedStyle( tr );
				reliableTrDimensionsVal = ( parseInt( trStyle.height, 10 ) +
					parseInt( trStyle.borderTopWidth, 10 ) +
					parseInt( trStyle.borderBottomWidth, 10 ) ) === tr.offsetHeight;

				documentElement.removeChild( table );
			}
			return reliableTrDimensionsVal;
		}
	} );
} )();


function curCSS( elem, name, computed ) {
	var width, minWidth, maxWidth, ret,

		// Support: Firefox 51+
		// Retrieving style before computed somehow
		// fixes an issue with getting wrong values
		// on detached elements
		style = elem.style;

	computed = computed || getStyles( elem );

	// getPropertyValue is needed for:
	//   .css('filter') (IE 9 only, #12537)
	//   .css('--customProperty) (#3144)
	if ( computed ) {
		ret = computed.getPropertyValue( name ) || computed[ name ];

		if ( ret === "" && !isAttached( elem ) ) {
			ret = jQuery.style( elem, name );
		}

		// A tribute to the "awesome hack by Dean Edwards"
		// Android Browser returns percentage for some values,
		// but width seems to be reliably pixels.
		// This is against the CSSOM draft spec:
		// https://drafts.csswg.org/cssom/#resolved-values
		if ( !support.pixelBoxStyles() && rnumnonpx.test( ret ) && rboxStyle.test( name ) ) {

			// Remember the original values
			width = style.width;
			minWidth = style.minWidth;
			maxWidth = style.maxWidth;

			// Put in the new values to get a computed value out
			style.minWidth = style.maxWidth = style.width = ret;
			ret = computed.width;

			// Revert the changed values
			style.width = width;
			style.minWidth = minWidth;
			style.maxWidth = maxWidth;
		}
	}

	return ret !== undefined ?

		// Support: IE <=9 - 11 only
		// IE returns zIndex value as an integer.
		ret + "" :
		ret;
}


function addGetHookIf( conditionFn, hookFn ) {

	// Define the hook, we'll check on the first run if it's really needed.
	return {
		get: function() {
			if ( conditionFn() ) {

				// Hook not needed (or it's not possible to use it due
				// to missing dependency), remove it.
				delete this.get;
				return;
			}

			// Hook needed; redefine it so that the support test is not executed again.
			return ( this.get = hookFn ).apply( this, arguments );
		}
	};
}


var cssPrefixes = [ "Webkit", "Moz", "ms" ],
	emptyStyle = document.createElement( "div" ).style,
	vendorProps = {};

// Return a vendor-prefixed property or undefined
function vendorPropName( name ) {

	// Check for vendor prefixed names
	var capName = name[ 0 ].toUpperCase() + name.slice( 1 ),
		i = cssPrefixes.length;

	while ( i-- ) {
		name = cssPrefixes[ i ] + capName;
		if ( name in emptyStyle ) {
			return name;
		}
	}
}

// Return a potentially-mapped jQuery.cssProps or vendor prefixed property
function finalPropName( name ) {
	var final = jQuery.cssProps[ name ] || vendorProps[ name ];

	if ( final ) {
		return final;
	}
	if ( name in emptyStyle ) {
		return name;
	}
	return vendorProps[ name ] = vendorPropName( name ) || name;
}


var

	// Swappable if display is none or starts with table
	// except "table", "table-cell", or "table-caption"
	// See here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
	rdisplayswap = /^(none|table(?!-c[ea]).+)/,
	rcustomProp = /^--/,
	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssNormalTransform = {
		letterSpacing: "0",
		fontWeight: "400"
	};

function setPositiveNumber( _elem, value, subtract ) {

	// Any relative (+/-) values have already been
	// normalized at this point
	var matches = rcssNum.exec( value );
	return matches ?

		// Guard against undefined "subtract", e.g., when used as in cssHooks
		Math.max( 0, matches[ 2 ] - ( subtract || 0 ) ) + ( matches[ 3 ] || "px" ) :
		value;
}

function boxModelAdjustment( elem, dimension, box, isBorderBox, styles, computedVal ) {
	var i = dimension === "width" ? 1 : 0,
		extra = 0,
		delta = 0;

	// Adjustment may not be necessary
	if ( box === ( isBorderBox ? "border" : "content" ) ) {
		return 0;
	}

	for ( ; i < 4; i += 2 ) {

		// Both box models exclude margin
		if ( box === "margin" ) {
			delta += jQuery.css( elem, box + cssExpand[ i ], true, styles );
		}

		// If we get here with a content-box, we're seeking "padding" or "border" or "margin"
		if ( !isBorderBox ) {

			// Add padding
			delta += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );

			// For "border" or "margin", add border
			if ( box !== "padding" ) {
				delta += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );

			// But still keep track of it otherwise
			} else {
				extra += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}

		// If we get here with a border-box (content + padding + border), we're seeking "content" or
		// "padding" or "margin"
		} else {

			// For "content", subtract padding
			if ( box === "content" ) {
				delta -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
			}

			// For "content" or "padding", subtract border
			if ( box !== "margin" ) {
				delta -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		}
	}

	// Account for positive content-box scroll gutter when requested by providing computedVal
	if ( !isBorderBox && computedVal >= 0 ) {

		// offsetWidth/offsetHeight is a rounded sum of content, padding, scroll gutter, and border
		// Assuming integer scroll gutter, subtract the rest and round down
		delta += Math.max( 0, Math.ceil(
			elem[ "offset" + dimension[ 0 ].toUpperCase() + dimension.slice( 1 ) ] -
			computedVal -
			delta -
			extra -
			0.5

		// If offsetWidth/offsetHeight is unknown, then we can't determine content-box scroll gutter
		// Use an explicit zero to avoid NaN (gh-3964)
		) ) || 0;
	}

	return delta;
}

function getWidthOrHeight( elem, dimension, extra ) {

	// Start with computed style
	var styles = getStyles( elem ),

		// To avoid forcing a reflow, only fetch boxSizing if we need it (gh-4322).
		// Fake content-box until we know it's needed to know the true value.
		boxSizingNeeded = !support.boxSizingReliable() || extra,
		isBorderBox = boxSizingNeeded &&
			jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
		valueIsBorderBox = isBorderBox,

		val = curCSS( elem, dimension, styles ),
		offsetProp = "offset" + dimension[ 0 ].toUpperCase() + dimension.slice( 1 );

	// Support: Firefox <=54
	// Return a confounding non-pixel value or feign ignorance, as appropriate.
	if ( rnumnonpx.test( val ) ) {
		if ( !extra ) {
			return val;
		}
		val = "auto";
	}


	// Support: IE 9 - 11 only
	// Use offsetWidth/offsetHeight for when box sizing is unreliable.
	// In those cases, the computed value can be trusted to be border-box.
	if ( ( !support.boxSizingReliable() && isBorderBox ||

		// Support: IE 10 - 11+, Edge 15 - 18+
		// IE/Edge misreport \`getComputedStyle\` of table rows with width/height
		// set in CSS while \`offset*\` properties report correct values.
		// Interestingly, in some cases IE 9 doesn't suffer from this issue.
		!support.reliableTrDimensions() && nodeName( elem, "tr" ) ||

		// Fall back to offsetWidth/offsetHeight when value is "auto"
		// This happens for inline elements with no explicit setting (gh-3571)
		val === "auto" ||

		// Support: Android <=4.1 - 4.3 only
		// Also use offsetWidth/offsetHeight for misreported inline dimensions (gh-3602)
		!parseFloat( val ) && jQuery.css( elem, "display", false, styles ) === "inline" ) &&

		// Make sure the element is visible & connected
		elem.getClientRects().length ) {

		isBorderBox = jQuery.css( elem, "boxSizing", false, styles ) === "border-box";

		// Where available, offsetWidth/offsetHeight approximate border box dimensions.
		// Where not available (e.g., SVG), assume unreliable box-sizing and interpret the
		// retrieved value as a content box dimension.
		valueIsBorderBox = offsetProp in elem;
		if ( valueIsBorderBox ) {
			val = elem[ offsetProp ];
		}
	}

	// Normalize "" and auto
	val = parseFloat( val ) || 0;

	// Adjust for the element's box model
	return ( val +
		boxModelAdjustment(
			elem,
			dimension,
			extra || ( isBorderBox ? "border" : "content" ),
			valueIsBorderBox,
			styles,

			// Provide the current computed size to request scroll gutter calculation (gh-3589)
			val
		)
	) + "px";
}

jQuery.extend( {

	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {

					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity" );
					return ret === "" ? "1" : ret;
				}
			}
		}
	},

	// Don't automatically add "px" to these possibly-unitless properties
	cssNumber: {
		"animationIterationCount": true,
		"columnCount": true,
		"fillOpacity": true,
		"flexGrow": true,
		"flexShrink": true,
		"fontWeight": true,
		"gridArea": true,
		"gridColumn": true,
		"gridColumnEnd": true,
		"gridColumnStart": true,
		"gridRow": true,
		"gridRowEnd": true,
		"gridRowStart": true,
		"lineHeight": true,
		"opacity": true,
		"order": true,
		"orphans": true,
		"widows": true,
		"zIndex": true,
		"zoom": true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {},

	// Get and set the style property on a DOM Node
	style: function( elem, name, value, extra ) {

		// Don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, type, hooks,
			origName = camelCase( name ),
			isCustomProp = rcustomProp.test( name ),
			style = elem.style;

		// Make sure that we're working with the right name. We don't
		// want to query the value if it is a CSS custom property
		// since they are user-defined.
		if ( !isCustomProp ) {
			name = finalPropName( origName );
		}

		// Gets hook for the prefixed version, then unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// Check if we're setting a value
		if ( value !== undefined ) {
			type = typeof value;

			// Convert "+=" or "-=" to relative numbers (#7345)
			if ( type === "string" && ( ret = rcssNum.exec( value ) ) && ret[ 1 ] ) {
				value = adjustCSS( elem, name, ret );

				// Fixes bug #9237
				type = "number";
			}

			// Make sure that null and NaN values aren't set (#7116)
			if ( value == null || value !== value ) {
				return;
			}

			// If a number was passed in, add the unit (except for certain CSS properties)
			// The isCustomProp check can be removed in jQuery 4.0 when we only auto-append
			// "px" to a few hardcoded values.
			if ( type === "number" && !isCustomProp ) {
				value += ret && ret[ 3 ] || ( jQuery.cssNumber[ origName ] ? "" : "px" );
			}

			// background-* props affect original clone's values
			if ( !support.clearCloneStyle && value === "" && name.indexOf( "background" ) === 0 ) {
				style[ name ] = "inherit";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !( "set" in hooks ) ||
				( value = hooks.set( elem, value, extra ) ) !== undefined ) {

				if ( isCustomProp ) {
					style.setProperty( name, value );
				} else {
					style[ name ] = value;
				}
			}

		} else {

			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks &&
				( ret = hooks.get( elem, false, extra ) ) !== undefined ) {

				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, extra, styles ) {
		var val, num, hooks,
			origName = camelCase( name ),
			isCustomProp = rcustomProp.test( name );

		// Make sure that we're working with the right name. We don't
		// want to modify the value if it is a CSS custom property
		// since they are user-defined.
		if ( !isCustomProp ) {
			name = finalPropName( origName );
		}

		// Try prefixed name followed by the unprefixed name
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks ) {
			val = hooks.get( elem, true, extra );
		}

		// Otherwise, if a way to get the computed value exists, use that
		if ( val === undefined ) {
			val = curCSS( elem, name, styles );
		}

		// Convert "normal" to computed value
		if ( val === "normal" && name in cssNormalTransform ) {
			val = cssNormalTransform[ name ];
		}

		// Make numeric if forced or a qualifier was provided and val looks numeric
		if ( extra === "" || extra ) {
			num = parseFloat( val );
			return extra === true || isFinite( num ) ? num || 0 : val;
		}

		return val;
	}
} );

jQuery.each( [ "height", "width" ], function( _i, dimension ) {
	jQuery.cssHooks[ dimension ] = {
		get: function( elem, computed, extra ) {
			if ( computed ) {

				// Certain elements can have dimension info if we invisibly show them
				// but it must have a current display style that would benefit
				return rdisplayswap.test( jQuery.css( elem, "display" ) ) &&

					// Support: Safari 8+
					// Table columns in Safari have non-zero offsetWidth & zero
					// getBoundingClientRect().width unless display is changed.
					// Support: IE <=11 only
					// Running getBoundingClientRect on a disconnected node
					// in IE throws an error.
					( !elem.getClientRects().length || !elem.getBoundingClientRect().width ) ?
					swap( elem, cssShow, function() {
						return getWidthOrHeight( elem, dimension, extra );
					} ) :
					getWidthOrHeight( elem, dimension, extra );
			}
		},

		set: function( elem, value, extra ) {
			var matches,
				styles = getStyles( elem ),

				// Only read styles.position if the test has a chance to fail
				// to avoid forcing a reflow.
				scrollboxSizeBuggy = !support.scrollboxSize() &&
					styles.position === "absolute",

				// To avoid forcing a reflow, only fetch boxSizing if we need it (gh-3991)
				boxSizingNeeded = scrollboxSizeBuggy || extra,
				isBorderBox = boxSizingNeeded &&
					jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
				subtract = extra ?
					boxModelAdjustment(
						elem,
						dimension,
						extra,
						isBorderBox,
						styles
					) :
					0;

			// Account for unreliable border-box dimensions by comparing offset* to computed and
			// faking a content-box to get border and padding (gh-3699)
			if ( isBorderBox && scrollboxSizeBuggy ) {
				subtract -= Math.ceil(
					elem[ "offset" + dimension[ 0 ].toUpperCase() + dimension.slice( 1 ) ] -
					parseFloat( styles[ dimension ] ) -
					boxModelAdjustment( elem, dimension, "border", false, styles ) -
					0.5
				);
			}

			// Convert to pixels if value adjustment is needed
			if ( subtract && ( matches = rcssNum.exec( value ) ) &&
				( matches[ 3 ] || "px" ) !== "px" ) {

				elem.style[ dimension ] = value;
				value = jQuery.css( elem, dimension );
			}

			return setPositiveNumber( elem, value, subtract );
		}
	};
} );

jQuery.cssHooks.marginLeft = addGetHookIf( support.reliableMarginLeft,
	function( elem, computed ) {
		if ( computed ) {
			return ( parseFloat( curCSS( elem, "marginLeft" ) ) ||
				elem.getBoundingClientRect().left -
					swap( elem, { marginLeft: 0 }, function() {
						return elem.getBoundingClientRect().left;
					} )
			) + "px";
		}
	}
);

// These hooks are used by animate to expand properties
jQuery.each( {
	margin: "",
	padding: "",
	border: "Width"
}, function( prefix, suffix ) {
	jQuery.cssHooks[ prefix + suffix ] = {
		expand: function( value ) {
			var i = 0,
				expanded = {},

				// Assumes a single number if not a string
				parts = typeof value === "string" ? value.split( " " ) : [ value ];

			for ( ; i < 4; i++ ) {
				expanded[ prefix + cssExpand[ i ] + suffix ] =
					parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
			}

			return expanded;
		}
	};

	if ( prefix !== "margin" ) {
		jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
	}
} );

jQuery.fn.extend( {
	css: function( name, value ) {
		return access( this, function( elem, name, value ) {
			var styles, len,
				map = {},
				i = 0;

			if ( Array.isArray( name ) ) {
				styles = getStyles( elem );
				len = name.length;

				for ( ; i < len; i++ ) {
					map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
				}

				return map;
			}

			return value !== undefined ?
				jQuery.style( elem, name, value ) :
				jQuery.css( elem, name );
		}, name, value, arguments.length > 1 );
	}
} );


function Tween( elem, options, prop, end, easing ) {
	return new Tween.prototype.init( elem, options, prop, end, easing );
}
jQuery.Tween = Tween;

Tween.prototype = {
	constructor: Tween,
	init: function( elem, options, prop, end, easing, unit ) {
		this.elem = elem;
		this.prop = prop;
		this.easing = easing || jQuery.easing._default;
		this.options = options;
		this.start = this.now = this.cur();
		this.end = end;
		this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
	},
	cur: function() {
		var hooks = Tween.propHooks[ this.prop ];

		return hooks && hooks.get ?
			hooks.get( this ) :
			Tween.propHooks._default.get( this );
	},
	run: function( percent ) {
		var eased,
			hooks = Tween.propHooks[ this.prop ];

		if ( this.options.duration ) {
			this.pos = eased = jQuery.easing[ this.easing ](
				percent, this.options.duration * percent, 0, 1, this.options.duration
			);
		} else {
			this.pos = eased = percent;
		}
		this.now = ( this.end - this.start ) * eased + this.start;

		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		if ( hooks && hooks.set ) {
			hooks.set( this );
		} else {
			Tween.propHooks._default.set( this );
		}
		return this;
	}
};

Tween.prototype.init.prototype = Tween.prototype;

Tween.propHooks = {
	_default: {
		get: function( tween ) {
			var result;

			// Use a property on the element directly when it is not a DOM element,
			// or when there is no matching style property that exists.
			if ( tween.elem.nodeType !== 1 ||
				tween.elem[ tween.prop ] != null && tween.elem.style[ tween.prop ] == null ) {
				return tween.elem[ tween.prop ];
			}

			// Passing an empty string as a 3rd parameter to .css will automatically
			// attempt a parseFloat and fallback to a string if the parse fails.
			// Simple values such as "10px" are parsed to Float;
			// complex values such as "rotate(1rad)" are returned as-is.
			result = jQuery.css( tween.elem, tween.prop, "" );

			// Empty strings, null, undefined and "auto" are converted to 0.
			return !result || result === "auto" ? 0 : result;
		},
		set: function( tween ) {

			// Use step hook for back compat.
			// Use cssHook if its there.
			// Use .style if available and use plain properties where available.
			if ( jQuery.fx.step[ tween.prop ] ) {
				jQuery.fx.step[ tween.prop ]( tween );
			} else if ( tween.elem.nodeType === 1 && (
				jQuery.cssHooks[ tween.prop ] ||
					tween.elem.style[ finalPropName( tween.prop ) ] != null ) ) {
				jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
			} else {
				tween.elem[ tween.prop ] = tween.now;
			}
		}
	}
};

// Support: IE <=9 only
// Panic based approach to setting things on disconnected nodes
Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
	set: function( tween ) {
		if ( tween.elem.nodeType && tween.elem.parentNode ) {
			tween.elem[ tween.prop ] = tween.now;
		}
	}
};

jQuery.easing = {
	linear: function( p ) {
		return p;
	},
	swing: function( p ) {
		return 0.5 - Math.cos( p * Math.PI ) / 2;
	},
	_default: "swing"
};

jQuery.fx = Tween.prototype.init;

// Back compat <1.8 extension point
jQuery.fx.step = {};




var
	fxNow, inProgress,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rrun = /queueHooks$/;

function schedule() {
	if ( inProgress ) {
		if ( document.hidden === false && window.requestAnimationFrame ) {
			window.requestAnimationFrame( schedule );
		} else {
			window.setTimeout( schedule, jQuery.fx.interval );
		}

		jQuery.fx.tick();
	}
}

// Animations created synchronously will run synchronously
function createFxNow() {
	window.setTimeout( function() {
		fxNow = undefined;
	} );
	return ( fxNow = Date.now() );
}

// Generate parameters to create a standard animation
function genFx( type, includeWidth ) {
	var which,
		i = 0,
		attrs = { height: type };

	// If we include width, step value is 1 to do all cssExpand values,
	// otherwise step value is 2 to skip over Left and Right
	includeWidth = includeWidth ? 1 : 0;
	for ( ; i < 4; i += 2 - includeWidth ) {
		which = cssExpand[ i ];
		attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
	}

	if ( includeWidth ) {
		attrs.opacity = attrs.width = type;
	}

	return attrs;
}

function createTween( value, prop, animation ) {
	var tween,
		collection = ( Animation.tweeners[ prop ] || [] ).concat( Animation.tweeners[ "*" ] ),
		index = 0,
		length = collection.length;
	for ( ; index < length; index++ ) {
		if ( ( tween = collection[ index ].call( animation, prop, value ) ) ) {

			// We're done with this property
			return tween;
		}
	}
}

function defaultPrefilter( elem, props, opts ) {
	var prop, value, toggle, hooks, oldfire, propTween, restoreDisplay, display,
		isBox = "width" in props || "height" in props,
		anim = this,
		orig = {},
		style = elem.style,
		hidden = elem.nodeType && isHiddenWithinTree( elem ),
		dataShow = dataPriv.get( elem, "fxshow" );

	// Queue-skipping animations hijack the fx hooks
	if ( !opts.queue ) {
		hooks = jQuery._queueHooks( elem, "fx" );
		if ( hooks.unqueued == null ) {
			hooks.unqueued = 0;
			oldfire = hooks.empty.fire;
			hooks.empty.fire = function() {
				if ( !hooks.unqueued ) {
					oldfire();
				}
			};
		}
		hooks.unqueued++;

		anim.always( function() {

			// Ensure the complete handler is called before this completes
			anim.always( function() {
				hooks.unqueued--;
				if ( !jQuery.queue( elem, "fx" ).length ) {
					hooks.empty.fire();
				}
			} );
		} );
	}

	// Detect show/hide animations
	for ( prop in props ) {
		value = props[ prop ];
		if ( rfxtypes.test( value ) ) {
			delete props[ prop ];
			toggle = toggle || value === "toggle";
			if ( value === ( hidden ? "hide" : "show" ) ) {

				// Pretend to be hidden if this is a "show" and
				// there is still data from a stopped show/hide
				if ( value === "show" && dataShow && dataShow[ prop ] !== undefined ) {
					hidden = true;

				// Ignore all other no-op show/hide data
				} else {
					continue;
				}
			}
			orig[ prop ] = dataShow && dataShow[ prop ] || jQuery.style( elem, prop );
		}
	}

	// Bail out if this is a no-op like .hide().hide()
	propTween = !jQuery.isEmptyObject( props );
	if ( !propTween && jQuery.isEmptyObject( orig ) ) {
		return;
	}

	// Restrict "overflow" and "display" styles during box animations
	if ( isBox && elem.nodeType === 1 ) {

		// Support: IE <=9 - 11, Edge 12 - 15
		// Record all 3 overflow attributes because IE does not infer the shorthand
		// from identically-valued overflowX and overflowY and Edge just mirrors
		// the overflowX value there.
		opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

		// Identify a display type, preferring old show/hide data over the CSS cascade
		restoreDisplay = dataShow && dataShow.display;
		if ( restoreDisplay == null ) {
			restoreDisplay = dataPriv.get( elem, "display" );
		}
		display = jQuery.css( elem, "display" );
		if ( display === "none" ) {
			if ( restoreDisplay ) {
				display = restoreDisplay;
			} else {

				// Get nonempty value(s) by temporarily forcing visibility
				showHide( [ elem ], true );
				restoreDisplay = elem.style.display || restoreDisplay;
				display = jQuery.css( elem, "display" );
				showHide( [ elem ] );
			}
		}

		// Animate inline elements as inline-block
		if ( display === "inline" || display === "inline-block" && restoreDisplay != null ) {
			if ( jQuery.css( elem, "float" ) === "none" ) {

				// Restore the original display value at the end of pure show/hide animations
				if ( !propTween ) {
					anim.done( function() {
						style.display = restoreDisplay;
					} );
					if ( restoreDisplay == null ) {
						display = style.display;
						restoreDisplay = display === "none" ? "" : display;
					}
				}
				style.display = "inline-block";
			}
		}
	}

	if ( opts.overflow ) {
		style.overflow = "hidden";
		anim.always( function() {
			style.overflow = opts.overflow[ 0 ];
			style.overflowX = opts.overflow[ 1 ];
			style.overflowY = opts.overflow[ 2 ];
		} );
	}

	// Implement show/hide animations
	propTween = false;
	for ( prop in orig ) {

		// General show/hide setup for this element animation
		if ( !propTween ) {
			if ( dataShow ) {
				if ( "hidden" in dataShow ) {
					hidden = dataShow.hidden;
				}
			} else {
				dataShow = dataPriv.access( elem, "fxshow", { display: restoreDisplay } );
			}

			// Store hidden/visible for toggle so \`.stop().toggle()\` "reverses"
			if ( toggle ) {
				dataShow.hidden = !hidden;
			}

			// Show elements before animating them
			if ( hidden ) {
				showHide( [ elem ], true );
			}

			/* eslint-disable no-loop-func */

			anim.done( function() {

				/* eslint-enable no-loop-func */

				// The final step of a "hide" animation is actually hiding the element
				if ( !hidden ) {
					showHide( [ elem ] );
				}
				dataPriv.remove( elem, "fxshow" );
				for ( prop in orig ) {
					jQuery.style( elem, prop, orig[ prop ] );
				}
			} );
		}

		// Per-property setup
		propTween = createTween( hidden ? dataShow[ prop ] : 0, prop, anim );
		if ( !( prop in dataShow ) ) {
			dataShow[ prop ] = propTween.start;
			if ( hidden ) {
				propTween.end = propTween.start;
				propTween.start = 0;
			}
		}
	}
}

function propFilter( props, specialEasing ) {
	var index, name, easing, value, hooks;

	// camelCase, specialEasing and expand cssHook pass
	for ( index in props ) {
		name = camelCase( index );
		easing = specialEasing[ name ];
		value = props[ index ];
		if ( Array.isArray( value ) ) {
			easing = value[ 1 ];
			value = props[ index ] = value[ 0 ];
		}

		if ( index !== name ) {
			props[ name ] = value;
			delete props[ index ];
		}

		hooks = jQuery.cssHooks[ name ];
		if ( hooks && "expand" in hooks ) {
			value = hooks.expand( value );
			delete props[ name ];

			// Not quite $.extend, this won't overwrite existing keys.
			// Reusing 'index' because we have the correct "name"
			for ( index in value ) {
				if ( !( index in props ) ) {
					props[ index ] = value[ index ];
					specialEasing[ index ] = easing;
				}
			}
		} else {
			specialEasing[ name ] = easing;
		}
	}
}

function Animation( elem, properties, options ) {
	var result,
		stopped,
		index = 0,
		length = Animation.prefilters.length,
		deferred = jQuery.Deferred().always( function() {

			// Don't match elem in the :animated selector
			delete tick.elem;
		} ),
		tick = function() {
			if ( stopped ) {
				return false;
			}
			var currentTime = fxNow || createFxNow(),
				remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),

				// Support: Android 2.3 only
				// Archaic crash bug won't allow us to use \`1 - ( 0.5 || 0 )\` (#12497)
				temp = remaining / animation.duration || 0,
				percent = 1 - temp,
				index = 0,
				length = animation.tweens.length;

			for ( ; index < length; index++ ) {
				animation.tweens[ index ].run( percent );
			}

			deferred.notifyWith( elem, [ animation, percent, remaining ] );

			// If there's more to do, yield
			if ( percent < 1 && length ) {
				return remaining;
			}

			// If this was an empty animation, synthesize a final progress notification
			if ( !length ) {
				deferred.notifyWith( elem, [ animation, 1, 0 ] );
			}

			// Resolve the animation and report its conclusion
			deferred.resolveWith( elem, [ animation ] );
			return false;
		},
		animation = deferred.promise( {
			elem: elem,
			props: jQuery.extend( {}, properties ),
			opts: jQuery.extend( true, {
				specialEasing: {},
				easing: jQuery.easing._default
			}, options ),
			originalProperties: properties,
			originalOptions: options,
			startTime: fxNow || createFxNow(),
			duration: options.duration,
			tweens: [],
			createTween: function( prop, end ) {
				var tween = jQuery.Tween( elem, animation.opts, prop, end,
					animation.opts.specialEasing[ prop ] || animation.opts.easing );
				animation.tweens.push( tween );
				return tween;
			},
			stop: function( gotoEnd ) {
				var index = 0,

					// If we are going to the end, we want to run all the tweens
					// otherwise we skip this part
					length = gotoEnd ? animation.tweens.length : 0;
				if ( stopped ) {
					return this;
				}
				stopped = true;
				for ( ; index < length; index++ ) {
					animation.tweens[ index ].run( 1 );
				}

				// Resolve when we played the last frame; otherwise, reject
				if ( gotoEnd ) {
					deferred.notifyWith( elem, [ animation, 1, 0 ] );
					deferred.resolveWith( elem, [ animation, gotoEnd ] );
				} else {
					deferred.rejectWith( elem, [ animation, gotoEnd ] );
				}
				return this;
			}
		} ),
		props = animation.props;

	propFilter( props, animation.opts.specialEasing );

	for ( ; index < length; index++ ) {
		result = Animation.prefilters[ index ].call( animation, elem, props, animation.opts );
		if ( result ) {
			if ( isFunction( result.stop ) ) {
				jQuery._queueHooks( animation.elem, animation.opts.queue ).stop =
					result.stop.bind( result );
			}
			return result;
		}
	}

	jQuery.map( props, createTween, animation );

	if ( isFunction( animation.opts.start ) ) {
		animation.opts.start.call( elem, animation );
	}

	// Attach callbacks from options
	animation
		.progress( animation.opts.progress )
		.done( animation.opts.done, animation.opts.complete )
		.fail( animation.opts.fail )
		.always( animation.opts.always );

	jQuery.fx.timer(
		jQuery.extend( tick, {
			elem: elem,
			anim: animation,
			queue: animation.opts.queue
		} )
	);

	return animation;
}

jQuery.Animation = jQuery.extend( Animation, {

	tweeners: {
		"*": [ function( prop, value ) {
			var tween = this.createTween( prop, value );
			adjustCSS( tween.elem, prop, rcssNum.exec( value ), tween );
			return tween;
		} ]
	},

	tweener: function( props, callback ) {
		if ( isFunction( props ) ) {
			callback = props;
			props = [ "*" ];
		} else {
			props = props.match( rnothtmlwhite );
		}

		var prop,
			index = 0,
			length = props.length;

		for ( ; index < length; index++ ) {
			prop = props[ index ];
			Animation.tweeners[ prop ] = Animation.tweeners[ prop ] || [];
			Animation.tweeners[ prop ].unshift( callback );
		}
	},

	prefilters: [ defaultPrefilter ],

	prefilter: function( callback, prepend ) {
		if ( prepend ) {
			Animation.prefilters.unshift( callback );
		} else {
			Animation.prefilters.push( callback );
		}
	}
} );

jQuery.speed = function( speed, easing, fn ) {
	var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
		complete: fn || !fn && easing ||
			isFunction( speed ) && speed,
		duration: speed,
		easing: fn && easing || easing && !isFunction( easing ) && easing
	};

	// Go to the end state if fx are off
	if ( jQuery.fx.off ) {
		opt.duration = 0;

	} else {
		if ( typeof opt.duration !== "number" ) {
			if ( opt.duration in jQuery.fx.speeds ) {
				opt.duration = jQuery.fx.speeds[ opt.duration ];

			} else {
				opt.duration = jQuery.fx.speeds._default;
			}
		}
	}

	// Normalize opt.queue - true/undefined/null -> "fx"
	if ( opt.queue == null || opt.queue === true ) {
		opt.queue = "fx";
	}

	// Queueing
	opt.old = opt.complete;

	opt.complete = function() {
		if ( isFunction( opt.old ) ) {
			opt.old.call( this );
		}

		if ( opt.queue ) {
			jQuery.dequeue( this, opt.queue );
		}
	};

	return opt;
};

jQuery.fn.extend( {
	fadeTo: function( speed, to, easing, callback ) {

		// Show any hidden elements after setting opacity to 0
		return this.filter( isHiddenWithinTree ).css( "opacity", 0 ).show()

			// Animate to the value specified
			.end().animate( { opacity: to }, speed, easing, callback );
	},
	animate: function( prop, speed, easing, callback ) {
		var empty = jQuery.isEmptyObject( prop ),
			optall = jQuery.speed( speed, easing, callback ),
			doAnimation = function() {

				// Operate on a copy of prop so per-property easing won't be lost
				var anim = Animation( this, jQuery.extend( {}, prop ), optall );

				// Empty animations, or finishing resolves immediately
				if ( empty || dataPriv.get( this, "finish" ) ) {
					anim.stop( true );
				}
			};

		doAnimation.finish = doAnimation;

		return empty || optall.queue === false ?
			this.each( doAnimation ) :
			this.queue( optall.queue, doAnimation );
	},
	stop: function( type, clearQueue, gotoEnd ) {
		var stopQueue = function( hooks ) {
			var stop = hooks.stop;
			delete hooks.stop;
			stop( gotoEnd );
		};

		if ( typeof type !== "string" ) {
			gotoEnd = clearQueue;
			clearQueue = type;
			type = undefined;
		}
		if ( clearQueue ) {
			this.queue( type || "fx", [] );
		}

		return this.each( function() {
			var dequeue = true,
				index = type != null && type + "queueHooks",
				timers = jQuery.timers,
				data = dataPriv.get( this );

			if ( index ) {
				if ( data[ index ] && data[ index ].stop ) {
					stopQueue( data[ index ] );
				}
			} else {
				for ( index in data ) {
					if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
						stopQueue( data[ index ] );
					}
				}
			}

			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this &&
					( type == null || timers[ index ].queue === type ) ) {

					timers[ index ].anim.stop( gotoEnd );
					dequeue = false;
					timers.splice( index, 1 );
				}
			}

			// Start the next in the queue if the last step wasn't forced.
			// Timers currently will call their complete callbacks, which
			// will dequeue but only if they were gotoEnd.
			if ( dequeue || !gotoEnd ) {
				jQuery.dequeue( this, type );
			}
		} );
	},
	finish: function( type ) {
		if ( type !== false ) {
			type = type || "fx";
		}
		return this.each( function() {
			var index,
				data = dataPriv.get( this ),
				queue = data[ type + "queue" ],
				hooks = data[ type + "queueHooks" ],
				timers = jQuery.timers,
				length = queue ? queue.length : 0;

			// Enable finishing flag on private data
			data.finish = true;

			// Empty the queue first
			jQuery.queue( this, type, [] );

			if ( hooks && hooks.stop ) {
				hooks.stop.call( this, true );
			}

			// Look for any active animations, and finish them
			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
					timers[ index ].anim.stop( true );
					timers.splice( index, 1 );
				}
			}

			// Look for any animations in the old queue and finish them
			for ( index = 0; index < length; index++ ) {
				if ( queue[ index ] && queue[ index ].finish ) {
					queue[ index ].finish.call( this );
				}
			}

			// Turn off finishing flag
			delete data.finish;
		} );
	}
} );

jQuery.each( [ "toggle", "show", "hide" ], function( _i, name ) {
	var cssFn = jQuery.fn[ name ];
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return speed == null || typeof speed === "boolean" ?
			cssFn.apply( this, arguments ) :
			this.animate( genFx( name, true ), speed, easing, callback );
	};
} );

// Generate shortcuts for custom animations
jQuery.each( {
	slideDown: genFx( "show" ),
	slideUp: genFx( "hide" ),
	slideToggle: genFx( "toggle" ),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
} );

jQuery.timers = [];
jQuery.fx.tick = function() {
	var timer,
		i = 0,
		timers = jQuery.timers;

	fxNow = Date.now();

	for ( ; i < timers.length; i++ ) {
		timer = timers[ i ];

		// Run the timer and safely remove it when done (allowing for external removal)
		if ( !timer() && timers[ i ] === timer ) {
			timers.splice( i--, 1 );
		}
	}

	if ( !timers.length ) {
		jQuery.fx.stop();
	}
	fxNow = undefined;
};

jQuery.fx.timer = function( timer ) {
	jQuery.timers.push( timer );
	jQuery.fx.start();
};

jQuery.fx.interval = 13;
jQuery.fx.start = function() {
	if ( inProgress ) {
		return;
	}

	inProgress = true;
	schedule();
};

jQuery.fx.stop = function() {
	inProgress = null;
};

jQuery.fx.speeds = {
	slow: 600,
	fast: 200,

	// Default speed
	_default: 400
};


// Based off of the plugin by Clint Helfers, with permission.
// https://web.archive.org/web/20100324014747/http://blindsignals.com/index.php/2009/07/jquery-delay/
jQuery.fn.delay = function( time, type ) {
	time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
	type = type || "fx";

	return this.queue( type, function( next, hooks ) {
		var timeout = window.setTimeout( next, time );
		hooks.stop = function() {
			window.clearTimeout( timeout );
		};
	} );
};


( function() {
	var input = document.createElement( "input" ),
		select = document.createElement( "select" ),
		opt = select.appendChild( document.createElement( "option" ) );

	input.type = "checkbox";

	// Support: Android <=4.3 only
	// Default value for a checkbox should be "on"
	support.checkOn = input.value !== "";

	// Support: IE <=11 only
	// Must access selectedIndex to make default options select
	support.optSelected = opt.selected;

	// Support: IE <=11 only
	// An input loses its value after becoming a radio
	input = document.createElement( "input" );
	input.value = "t";
	input.type = "radio";
	support.radioValue = input.value === "t";
} )();


var boolHook,
	attrHandle = jQuery.expr.attrHandle;

jQuery.fn.extend( {
	attr: function( name, value ) {
		return access( this, jQuery.attr, name, value, arguments.length > 1 );
	},

	removeAttr: function( name ) {
		return this.each( function() {
			jQuery.removeAttr( this, name );
		} );
	}
} );

jQuery.extend( {
	attr: function( elem, name, value ) {
		var ret, hooks,
			nType = elem.nodeType;

		// Don't get/set attributes on text, comment and attribute nodes
		if ( nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		// Fallback to prop when attributes are not supported
		if ( typeof elem.getAttribute === "undefined" ) {
			return jQuery.prop( elem, name, value );
		}

		// Attribute hooks are determined by the lowercase version
		// Grab necessary hook if one is defined
		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {
			hooks = jQuery.attrHooks[ name.toLowerCase() ] ||
				( jQuery.expr.match.bool.test( name ) ? boolHook : undefined );
		}

		if ( value !== undefined ) {
			if ( value === null ) {
				jQuery.removeAttr( elem, name );
				return;
			}

			if ( hooks && "set" in hooks &&
				( ret = hooks.set( elem, value, name ) ) !== undefined ) {
				return ret;
			}

			elem.setAttribute( name, value + "" );
			return value;
		}

		if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
			return ret;
		}

		ret = jQuery.find.attr( elem, name );

		// Non-existent attributes return null, we normalize to undefined
		return ret == null ? undefined : ret;
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				if ( !support.radioValue && value === "radio" &&
					nodeName( elem, "input" ) ) {
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		}
	},

	removeAttr: function( elem, value ) {
		var name,
			i = 0,

			// Attribute names can contain non-HTML whitespace characters
			// https://html.spec.whatwg.org/multipage/syntax.html#attributes-2
			attrNames = value && value.match( rnothtmlwhite );

		if ( attrNames && elem.nodeType === 1 ) {
			while ( ( name = attrNames[ i++ ] ) ) {
				elem.removeAttribute( name );
			}
		}
	}
} );

// Hooks for boolean attributes
boolHook = {
	set: function( elem, value, name ) {
		if ( value === false ) {

			// Remove boolean attributes when set to false
			jQuery.removeAttr( elem, name );
		} else {
			elem.setAttribute( name, name );
		}
		return name;
	}
};

jQuery.each( jQuery.expr.match.bool.source.match( /\\w+/g ), function( _i, name ) {
	var getter = attrHandle[ name ] || jQuery.find.attr;

	attrHandle[ name ] = function( elem, name, isXML ) {
		var ret, handle,
			lowercaseName = name.toLowerCase();

		if ( !isXML ) {

			// Avoid an infinite loop by temporarily removing this function from the getter
			handle = attrHandle[ lowercaseName ];
			attrHandle[ lowercaseName ] = ret;
			ret = getter( elem, name, isXML ) != null ?
				lowercaseName :
				null;
			attrHandle[ lowercaseName ] = handle;
		}
		return ret;
	};
} );




var rfocusable = /^(?:input|select|textarea|button)$/i,
	rclickable = /^(?:a|area)$/i;

jQuery.fn.extend( {
	prop: function( name, value ) {
		return access( this, jQuery.prop, name, value, arguments.length > 1 );
	},

	removeProp: function( name ) {
		return this.each( function() {
			delete this[ jQuery.propFix[ name ] || name ];
		} );
	}
} );

jQuery.extend( {
	prop: function( elem, name, value ) {
		var ret, hooks,
			nType = elem.nodeType;

		// Don't get/set properties on text, comment and attribute nodes
		if ( nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {

			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if ( value !== undefined ) {
			if ( hooks && "set" in hooks &&
				( ret = hooks.set( elem, value, name ) ) !== undefined ) {
				return ret;
			}

			return ( elem[ name ] = value );
		}

		if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
			return ret;
		}

		return elem[ name ];
	},

	propHooks: {
		tabIndex: {
			get: function( elem ) {

				// Support: IE <=9 - 11 only
				// elem.tabIndex doesn't always return the
				// correct value when it hasn't been explicitly set
				// https://web.archive.org/web/20141116233347/http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
				// Use proper attribute retrieval(#12072)
				var tabindex = jQuery.find.attr( elem, "tabindex" );

				if ( tabindex ) {
					return parseInt( tabindex, 10 );
				}

				if (
					rfocusable.test( elem.nodeName ) ||
					rclickable.test( elem.nodeName ) &&
					elem.href
				) {
					return 0;
				}

				return -1;
			}
		}
	},

	propFix: {
		"for": "htmlFor",
		"class": "className"
	}
} );

// Support: IE <=11 only
// Accessing the selectedIndex property
// forces the browser to respect setting selected
// on the option
// The getter ensures a default option is selected
// when in an optgroup
// eslint rule "no-unused-expressions" is disabled for this code
// since it considers such accessions noop
if ( !support.optSelected ) {
	jQuery.propHooks.selected = {
		get: function( elem ) {

			/* eslint no-unused-expressions: "off" */

			var parent = elem.parentNode;
			if ( parent && parent.parentNode ) {
				parent.parentNode.selectedIndex;
			}
			return null;
		},
		set: function( elem ) {

			/* eslint no-unused-expressions: "off" */

			var parent = elem.parentNode;
			if ( parent ) {
				parent.selectedIndex;

				if ( parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
			}
		}
	};
}

jQuery.each( [
	"tabIndex",
	"readOnly",
	"maxLength",
	"cellSpacing",
	"cellPadding",
	"rowSpan",
	"colSpan",
	"useMap",
	"frameBorder",
	"contentEditable"
], function() {
	jQuery.propFix[ this.toLowerCase() ] = this;
} );




	// Strip and collapse whitespace according to HTML spec
	// https://infra.spec.whatwg.org/#strip-and-collapse-ascii-whitespace
	function stripAndCollapse( value ) {
		var tokens = value.match( rnothtmlwhite ) || [];
		return tokens.join( " " );
	}


function getClass( elem ) {
	return elem.getAttribute && elem.getAttribute( "class" ) || "";
}

function classesToArray( value ) {
	if ( Array.isArray( value ) ) {
		return value;
	}
	if ( typeof value === "string" ) {
		return value.match( rnothtmlwhite ) || [];
	}
	return [];
}

jQuery.fn.extend( {
	addClass: function( value ) {
		var classes, elem, cur, curValue, clazz, j, finalValue,
			i = 0;

		if ( isFunction( value ) ) {
			return this.each( function( j ) {
				jQuery( this ).addClass( value.call( this, j, getClass( this ) ) );
			} );
		}

		classes = classesToArray( value );

		if ( classes.length ) {
			while ( ( elem = this[ i++ ] ) ) {
				curValue = getClass( elem );
				cur = elem.nodeType === 1 && ( " " + stripAndCollapse( curValue ) + " " );

				if ( cur ) {
					j = 0;
					while ( ( clazz = classes[ j++ ] ) ) {
						if ( cur.indexOf( " " + clazz + " " ) < 0 ) {
							cur += clazz + " ";
						}
					}

					// Only assign if different to avoid unneeded rendering.
					finalValue = stripAndCollapse( cur );
					if ( curValue !== finalValue ) {
						elem.setAttribute( "class", finalValue );
					}
				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		var classes, elem, cur, curValue, clazz, j, finalValue,
			i = 0;

		if ( isFunction( value ) ) {
			return this.each( function( j ) {
				jQuery( this ).removeClass( value.call( this, j, getClass( this ) ) );
			} );
		}

		if ( !arguments.length ) {
			return this.attr( "class", "" );
		}

		classes = classesToArray( value );

		if ( classes.length ) {
			while ( ( elem = this[ i++ ] ) ) {
				curValue = getClass( elem );

				// This expression is here for better compressibility (see addClass)
				cur = elem.nodeType === 1 && ( " " + stripAndCollapse( curValue ) + " " );

				if ( cur ) {
					j = 0;
					while ( ( clazz = classes[ j++ ] ) ) {

						// Remove *all* instances
						while ( cur.indexOf( " " + clazz + " " ) > -1 ) {
							cur = cur.replace( " " + clazz + " ", " " );
						}
					}

					// Only assign if different to avoid unneeded rendering.
					finalValue = stripAndCollapse( cur );
					if ( curValue !== finalValue ) {
						elem.setAttribute( "class", finalValue );
					}
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value,
			isValidValue = type === "string" || Array.isArray( value );

		if ( typeof stateVal === "boolean" && isValidValue ) {
			return stateVal ? this.addClass( value ) : this.removeClass( value );
		}

		if ( isFunction( value ) ) {
			return this.each( function( i ) {
				jQuery( this ).toggleClass(
					value.call( this, i, getClass( this ), stateVal ),
					stateVal
				);
			} );
		}

		return this.each( function() {
			var className, i, self, classNames;

			if ( isValidValue ) {

				// Toggle individual class names
				i = 0;
				self = jQuery( this );
				classNames = classesToArray( value );

				while ( ( className = classNames[ i++ ] ) ) {

					// Check each className given, space separated list
					if ( self.hasClass( className ) ) {
						self.removeClass( className );
					} else {
						self.addClass( className );
					}
				}

			// Toggle whole class name
			} else if ( value === undefined || type === "boolean" ) {
				className = getClass( this );
				if ( className ) {

					// Store className if set
					dataPriv.set( this, "__className__", className );
				}

				// If the element has a class name or if we're passed \`false\`,
				// then remove the whole classname (if there was one, the above saved it).
				// Otherwise bring back whatever was previously saved (if anything),
				// falling back to the empty string if nothing was stored.
				if ( this.setAttribute ) {
					this.setAttribute( "class",
						className || value === false ?
							"" :
							dataPriv.get( this, "__className__" ) || ""
					);
				}
			}
		} );
	},

	hasClass: function( selector ) {
		var className, elem,
			i = 0;

		className = " " + selector + " ";
		while ( ( elem = this[ i++ ] ) ) {
			if ( elem.nodeType === 1 &&
				( " " + stripAndCollapse( getClass( elem ) ) + " " ).indexOf( className ) > -1 ) {
				return true;
			}
		}

		return false;
	}
} );




var rreturn = /\\r/g;

jQuery.fn.extend( {
	val: function( value ) {
		var hooks, ret, valueIsFunction,
			elem = this[ 0 ];

		if ( !arguments.length ) {
			if ( elem ) {
				hooks = jQuery.valHooks[ elem.type ] ||
					jQuery.valHooks[ elem.nodeName.toLowerCase() ];

				if ( hooks &&
					"get" in hooks &&
					( ret = hooks.get( elem, "value" ) ) !== undefined
				) {
					return ret;
				}

				ret = elem.value;

				// Handle most common string cases
				if ( typeof ret === "string" ) {
					return ret.replace( rreturn, "" );
				}

				// Handle cases where value is null/undef or number
				return ret == null ? "" : ret;
			}

			return;
		}

		valueIsFunction = isFunction( value );

		return this.each( function( i ) {
			var val;

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( valueIsFunction ) {
				val = value.call( this, i, jQuery( this ).val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";

			} else if ( typeof val === "number" ) {
				val += "";

			} else if ( Array.isArray( val ) ) {
				val = jQuery.map( val, function( value ) {
					return value == null ? "" : value + "";
				} );
			}

			hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !( "set" in hooks ) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		} );
	}
} );

jQuery.extend( {
	valHooks: {
		option: {
			get: function( elem ) {

				var val = jQuery.find.attr( elem, "value" );
				return val != null ?
					val :

					// Support: IE <=10 - 11 only
					// option.text throws exceptions (#14686, #14858)
					// Strip and collapse whitespace
					// https://html.spec.whatwg.org/#strip-and-collapse-whitespace
					stripAndCollapse( jQuery.text( elem ) );
			}
		},
		select: {
			get: function( elem ) {
				var value, option, i,
					options = elem.options,
					index = elem.selectedIndex,
					one = elem.type === "select-one",
					values = one ? null : [],
					max = one ? index + 1 : options.length;

				if ( index < 0 ) {
					i = max;

				} else {
					i = one ? index : 0;
				}

				// Loop through all the selected options
				for ( ; i < max; i++ ) {
					option = options[ i ];

					// Support: IE <=9 only
					// IE8-9 doesn't update selected after form reset (#2551)
					if ( ( option.selected || i === index ) &&

							// Don't return options that are disabled or in a disabled optgroup
							!option.disabled &&
							( !option.parentNode.disabled ||
								!nodeName( option.parentNode, "optgroup" ) ) ) {

						// Get the specific value for the option
						value = jQuery( option ).val();

						// We don't need an array for one selects
						if ( one ) {
							return value;
						}

						// Multi-Selects return an array
						values.push( value );
					}
				}

				return values;
			},

			set: function( elem, value ) {
				var optionSet, option,
					options = elem.options,
					values = jQuery.makeArray( value ),
					i = options.length;

				while ( i-- ) {
					option = options[ i ];

					/* eslint-disable no-cond-assign */

					if ( option.selected =
						jQuery.inArray( jQuery.valHooks.option.get( option ), values ) > -1
					) {
						optionSet = true;
					}

					/* eslint-enable no-cond-assign */
				}

				// Force browsers to behave consistently when non-matching value is set
				if ( !optionSet ) {
					elem.selectedIndex = -1;
				}
				return values;
			}
		}
	}
} );

// Radios and checkboxes getter/setter
jQuery.each( [ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = {
		set: function( elem, value ) {
			if ( Array.isArray( value ) ) {
				return ( elem.checked = jQuery.inArray( jQuery( elem ).val(), value ) > -1 );
			}
		}
	};
	if ( !support.checkOn ) {
		jQuery.valHooks[ this ].get = function( elem ) {
			return elem.getAttribute( "value" ) === null ? "on" : elem.value;
		};
	}
} );




// Return jQuery for attributes-only inclusion


support.focusin = "onfocusin" in window;


var rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
	stopPropagationCallback = function( e ) {
		e.stopPropagation();
	};

jQuery.extend( jQuery.event, {

	trigger: function( event, data, elem, onlyHandlers ) {

		var i, cur, tmp, bubbleType, ontype, handle, special, lastElement,
			eventPath = [ elem || document ],
			type = hasOwn.call( event, "type" ) ? event.type : event,
			namespaces = hasOwn.call( event, "namespace" ) ? event.namespace.split( "." ) : [];

		cur = lastElement = tmp = elem = elem || document;

		// Don't do events on text and comment nodes
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		// focus/blur morphs to focusin/out; ensure we're not firing them right now
		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
			return;
		}

		if ( type.indexOf( "." ) > -1 ) {

			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split( "." );
			type = namespaces.shift();
			namespaces.sort();
		}
		ontype = type.indexOf( ":" ) < 0 && "on" + type;

		// Caller can pass in a jQuery.Event object, Object, or just an event type string
		event = event[ jQuery.expando ] ?
			event :
			new jQuery.Event( type, typeof event === "object" && event );

		// Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
		event.isTrigger = onlyHandlers ? 2 : 3;
		event.namespace = namespaces.join( "." );
		event.rnamespace = event.namespace ?
			new RegExp( "(^|\\\\.)" + namespaces.join( "\\\\.(?:.*\\\\.|)" ) + "(\\\\.|$)" ) :
			null;

		// Clean up the event in case it is being reused
		event.result = undefined;
		if ( !event.target ) {
			event.target = elem;
		}

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data == null ?
			[ event ] :
			jQuery.makeArray( data, [ event ] );

		// Allow special events to draw outside the lines
		special = jQuery.event.special[ type ] || {};
		if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}

		// Determine event propagation path in advance, per W3C events spec (#9951)
		// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
		if ( !onlyHandlers && !special.noBubble && !isWindow( elem ) ) {

			bubbleType = special.delegateType || type;
			if ( !rfocusMorph.test( bubbleType + type ) ) {
				cur = cur.parentNode;
			}
			for ( ; cur; cur = cur.parentNode ) {
				eventPath.push( cur );
				tmp = cur;
			}

			// Only add window if we got to document (e.g., not plain obj or detached DOM)
			if ( tmp === ( elem.ownerDocument || document ) ) {
				eventPath.push( tmp.defaultView || tmp.parentWindow || window );
			}
		}

		// Fire handlers on the event path
		i = 0;
		while ( ( cur = eventPath[ i++ ] ) && !event.isPropagationStopped() ) {
			lastElement = cur;
			event.type = i > 1 ?
				bubbleType :
				special.bindType || type;

			// jQuery handler
			handle = ( dataPriv.get( cur, "events" ) || Object.create( null ) )[ event.type ] &&
				dataPriv.get( cur, "handle" );
			if ( handle ) {
				handle.apply( cur, data );
			}

			// Native handler
			handle = ontype && cur[ ontype ];
			if ( handle && handle.apply && acceptData( cur ) ) {
				event.result = handle.apply( cur, data );
				if ( event.result === false ) {
					event.preventDefault();
				}
			}
		}
		event.type = type;

		// If nobody prevented the default action, do it now
		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

			if ( ( !special._default ||
				special._default.apply( eventPath.pop(), data ) === false ) &&
				acceptData( elem ) ) {

				// Call a native DOM method on the target with the same name as the event.
				// Don't do default actions on window, that's where global variables be (#6170)
				if ( ontype && isFunction( elem[ type ] ) && !isWindow( elem ) ) {

					// Don't re-trigger an onFOO event when we call its FOO() method
					tmp = elem[ ontype ];

					if ( tmp ) {
						elem[ ontype ] = null;
					}

					// Prevent re-triggering of the same event, since we already bubbled it above
					jQuery.event.triggered = type;

					if ( event.isPropagationStopped() ) {
						lastElement.addEventListener( type, stopPropagationCallback );
					}

					elem[ type ]();

					if ( event.isPropagationStopped() ) {
						lastElement.removeEventListener( type, stopPropagationCallback );
					}

					jQuery.event.triggered = undefined;

					if ( tmp ) {
						elem[ ontype ] = tmp;
					}
				}
			}
		}

		return event.result;
	},

	// Piggyback on a donor event to simulate a different one
	// Used only for \`focus(in | out)\` events
	simulate: function( type, elem, event ) {
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{
				type: type,
				isSimulated: true
			}
		);

		jQuery.event.trigger( e, null, elem );
	}

} );

jQuery.fn.extend( {

	trigger: function( type, data ) {
		return this.each( function() {
			jQuery.event.trigger( type, data, this );
		} );
	},
	triggerHandler: function( type, data ) {
		var elem = this[ 0 ];
		if ( elem ) {
			return jQuery.event.trigger( type, data, elem, true );
		}
	}
} );


// Support: Firefox <=44
// Firefox doesn't have focus(in | out) events
// Related ticket - https://bugzilla.mozilla.org/show_bug.cgi?id=687787
//
// Support: Chrome <=48 - 49, Safari <=9.0 - 9.1
// focus(in | out) events fire after focus & blur events,
// which is spec violation - http://www.w3.org/TR/DOM-Level-3-Events/#events-focusevent-event-order
// Related ticket - https://bugs.chromium.org/p/chromium/issues/detail?id=449857
if ( !support.focusin ) {
	jQuery.each( { focus: "focusin", blur: "focusout" }, function( orig, fix ) {

		// Attach a single capturing handler on the document while someone wants focusin/focusout
		var handler = function( event ) {
			jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ) );
		};

		jQuery.event.special[ fix ] = {
			setup: function() {

				// Handle: regular nodes (via \`this.ownerDocument\`), window
				// (via \`this.document\`) & document (via \`this\`).
				var doc = this.ownerDocument || this.document || this,
					attaches = dataPriv.access( doc, fix );

				if ( !attaches ) {
					doc.addEventListener( orig, handler, true );
				}
				dataPriv.access( doc, fix, ( attaches || 0 ) + 1 );
			},
			teardown: function() {
				var doc = this.ownerDocument || this.document || this,
					attaches = dataPriv.access( doc, fix ) - 1;

				if ( !attaches ) {
					doc.removeEventListener( orig, handler, true );
					dataPriv.remove( doc, fix );

				} else {
					dataPriv.access( doc, fix, attaches );
				}
			}
		};
	} );
}
var location = window.location;

var nonce = { guid: Date.now() };

var rquery = ( /\\?/ );



// Cross-browser xml parsing
jQuery.parseXML = function( data ) {
	var xml, parserErrorElem;
	if ( !data || typeof data !== "string" ) {
		return null;
	}

	// Support: IE 9 - 11 only
	// IE throws on parseFromString with invalid input.
	try {
		xml = ( new window.DOMParser() ).parseFromString( data, "text/xml" );
	} catch ( e ) {}

	parserErrorElem = xml && xml.getElementsByTagName( "parsererror" )[ 0 ];
	if ( !xml || parserErrorElem ) {
		jQuery.error( "Invalid XML: " + (
			parserErrorElem ?
				jQuery.map( parserErrorElem.childNodes, function( el ) {
					return el.textContent;
				} ).join( "\\n" ) :
				data
		) );
	}
	return xml;
};


var
	rbracket = /\\[\\]$/,
	rCRLF = /\\r?\\n/g,
	rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
	rsubmittable = /^(?:input|select|textarea|keygen)/i;

function buildParams( prefix, obj, traditional, add ) {
	var name;

	if ( Array.isArray( obj ) ) {

		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {

				// Treat each array item as a scalar.
				add( prefix, v );

			} else {

				// Item is non-scalar (array or object), encode its numeric index.
				buildParams(
					prefix + "[" + ( typeof v === "object" && v != null ? i : "" ) + "]",
					v,
					traditional,
					add
				);
			}
		} );

	} else if ( !traditional && toType( obj ) === "object" ) {

		// Serialize object item.
		for ( name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {

		// Serialize scalar item.
		add( prefix, obj );
	}
}

// Serialize an array of form elements or a set of
// key/values into a query string
jQuery.param = function( a, traditional ) {
	var prefix,
		s = [],
		add = function( key, valueOrFunction ) {

			// If value is a function, invoke it and use its return value
			var value = isFunction( valueOrFunction ) ?
				valueOrFunction() :
				valueOrFunction;

			s[ s.length ] = encodeURIComponent( key ) + "=" +
				encodeURIComponent( value == null ? "" : value );
		};

	if ( a == null ) {
		return "";
	}

	// If an array was passed in, assume that it is an array of form elements.
	if ( Array.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {

		// Serialize the form elements
		jQuery.each( a, function() {
			add( this.name, this.value );
		} );

	} else {

		// If traditional, encode the "old" way (the way 1.3.2 or older
		// did it), otherwise encode params recursively.
		for ( prefix in a ) {
			buildParams( prefix, a[ prefix ], traditional, add );
		}
	}

	// Return the resulting serialization
	return s.join( "&" );
};

jQuery.fn.extend( {
	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},
	serializeArray: function() {
		return this.map( function() {

			// Can add propHook for "elements" to filter or add form elements
			var elements = jQuery.prop( this, "elements" );
			return elements ? jQuery.makeArray( elements ) : this;
		} ).filter( function() {
			var type = this.type;

			// Use .is( ":disabled" ) so that fieldset[disabled] works
			return this.name && !jQuery( this ).is( ":disabled" ) &&
				rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
				( this.checked || !rcheckableType.test( type ) );
		} ).map( function( _i, elem ) {
			var val = jQuery( this ).val();

			if ( val == null ) {
				return null;
			}

			if ( Array.isArray( val ) ) {
				return jQuery.map( val, function( val ) {
					return { name: elem.name, value: val.replace( rCRLF, "\\r\\n" ) };
				} );
			}

			return { name: elem.name, value: val.replace( rCRLF, "\\r\\n" ) };
		} ).get();
	}
} );


var
	r20 = /%20/g,
	rhash = /#.*$/,
	rantiCache = /([?&])_=[^&]*/,
	rheaders = /^(.*?):[ \\t]*([^\\r\\n]*)$/mg,

	// #7653, #8125, #8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\\/\\//,

	/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
	prefilters = {},

	/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
	transports = {},

	// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
	allTypes = "*/".concat( "*" ),

	// Anchor tag for parsing the document origin
	originAnchor = document.createElement( "a" );

originAnchor.href = location.href;

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

	// dataTypeExpression is optional and defaults to "*"
	return function( dataTypeExpression, func ) {

		if ( typeof dataTypeExpression !== "string" ) {
			func = dataTypeExpression;
			dataTypeExpression = "*";
		}

		var dataType,
			i = 0,
			dataTypes = dataTypeExpression.toLowerCase().match( rnothtmlwhite ) || [];

		if ( isFunction( func ) ) {

			// For each dataType in the dataTypeExpression
			while ( ( dataType = dataTypes[ i++ ] ) ) {

				// Prepend if requested
				if ( dataType[ 0 ] === "+" ) {
					dataType = dataType.slice( 1 ) || "*";
					( structure[ dataType ] = structure[ dataType ] || [] ).unshift( func );

				// Otherwise append
				} else {
					( structure[ dataType ] = structure[ dataType ] || [] ).push( func );
				}
			}
		}
	};
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {

	var inspected = {},
		seekingTransport = ( structure === transports );

	function inspect( dataType ) {
		var selected;
		inspected[ dataType ] = true;
		jQuery.each( structure[ dataType ] || [], function( _, prefilterOrFactory ) {
			var dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );
			if ( typeof dataTypeOrTransport === "string" &&
				!seekingTransport && !inspected[ dataTypeOrTransport ] ) {

				options.dataTypes.unshift( dataTypeOrTransport );
				inspect( dataTypeOrTransport );
				return false;
			} else if ( seekingTransport ) {
				return !( selected = dataTypeOrTransport );
			}
		} );
		return selected;
	}

	return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
}

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
function ajaxExtend( target, src ) {
	var key, deep,
		flatOptions = jQuery.ajaxSettings.flatOptions || {};

	for ( key in src ) {
		if ( src[ key ] !== undefined ) {
			( flatOptions[ key ] ? target : ( deep || ( deep = {} ) ) )[ key ] = src[ key ];
		}
	}
	if ( deep ) {
		jQuery.extend( true, target, deep );
	}

	return target;
}

/* Handles responses to an ajax request:
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {

	var ct, type, finalDataType, firstDataType,
		contents = s.contents,
		dataTypes = s.dataTypes;

	// Remove auto dataType and get content-type in the process
	while ( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			ct = s.mimeType || jqXHR.getResponseHeader( "Content-Type" );
		}
	}

	// Check if we're dealing with a known content-type
	if ( ct ) {
		for ( type in contents ) {
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				dataTypes.unshift( type );
				break;
			}
		}
	}

	// Check to see if we have a response for the expected dataType
	if ( dataTypes[ 0 ] in responses ) {
		finalDataType = dataTypes[ 0 ];
	} else {

		// Try convertible dataTypes
		for ( type in responses ) {
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[ 0 ] ] ) {
				finalDataType = type;
				break;
			}
			if ( !firstDataType ) {
				firstDataType = type;
			}
		}

		// Or just use first one
		finalDataType = finalDataType || firstDataType;
	}

	// If we found a dataType
	// We add the dataType to the list if needed
	// and return the corresponding response
	if ( finalDataType ) {
		if ( finalDataType !== dataTypes[ 0 ] ) {
			dataTypes.unshift( finalDataType );
		}
		return responses[ finalDataType ];
	}
}

/* Chain conversions given the request and the original response
 * Also sets the responseXXX fields on the jqXHR instance
 */
function ajaxConvert( s, response, jqXHR, isSuccess ) {
	var conv2, current, conv, tmp, prev,
		converters = {},

		// Work with a copy of dataTypes in case we need to modify it for conversion
		dataTypes = s.dataTypes.slice();

	// Create converters map with lowercased keys
	if ( dataTypes[ 1 ] ) {
		for ( conv in s.converters ) {
			converters[ conv.toLowerCase() ] = s.converters[ conv ];
		}
	}

	current = dataTypes.shift();

	// Convert to each sequential dataType
	while ( current ) {

		if ( s.responseFields[ current ] ) {
			jqXHR[ s.responseFields[ current ] ] = response;
		}

		// Apply the dataFilter if provided
		if ( !prev && isSuccess && s.dataFilter ) {
			response = s.dataFilter( response, s.dataType );
		}

		prev = current;
		current = dataTypes.shift();

		if ( current ) {

			// There's only work to do if current dataType is non-auto
			if ( current === "*" ) {

				current = prev;

			// Convert response if prev dataType is non-auto and differs from current
			} else if ( prev !== "*" && prev !== current ) {

				// Seek a direct converter
				conv = converters[ prev + " " + current ] || converters[ "* " + current ];

				// If none found, seek a pair
				if ( !conv ) {
					for ( conv2 in converters ) {

						// If conv2 outputs current
						tmp = conv2.split( " " );
						if ( tmp[ 1 ] === current ) {

							// If prev can be converted to accepted input
							conv = converters[ prev + " " + tmp[ 0 ] ] ||
								converters[ "* " + tmp[ 0 ] ];
							if ( conv ) {

								// Condense equivalence converters
								if ( conv === true ) {
									conv = converters[ conv2 ];

								// Otherwise, insert the intermediate dataType
								} else if ( converters[ conv2 ] !== true ) {
									current = tmp[ 0 ];
									dataTypes.unshift( tmp[ 1 ] );
								}
								break;
							}
						}
					}
				}

				// Apply converter (if not an equivalence)
				if ( conv !== true ) {

					// Unless errors are allowed to bubble, catch and return them
					if ( conv && s.throws ) {
						response = conv( response );
					} else {
						try {
							response = conv( response );
						} catch ( e ) {
							return {
								state: "parsererror",
								error: conv ? e : "No conversion from " + prev + " to " + current
							};
						}
					}
				}
			}
		}
	}

	return { state: "success", data: response };
}

jQuery.extend( {

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {},

	ajaxSettings: {
		url: location.href,
		type: "GET",
		isLocal: rlocalProtocol.test( location.protocol ),
		global: true,
		processData: true,
		async: true,
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",

		/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		throws: false,
		traditional: false,
		headers: {},
		*/

		accepts: {
			"*": allTypes,
			text: "text/plain",
			html: "text/html",
			xml: "application/xml, text/xml",
			json: "application/json, text/javascript"
		},

		contents: {
			xml: /\\bxml\\b/,
			html: /\\bhtml/,
			json: /\\bjson\\b/
		},

		responseFields: {
			xml: "responseXML",
			text: "responseText",
			json: "responseJSON"
		},

		// Data converters
		// Keys separate source (or catchall "*") and destination types with a single space
		converters: {

			// Convert anything to text
			"* text": String,

			// Text to html (true = no transformation)
			"text html": true,

			// Evaluate text as a json expression
			"text json": JSON.parse,

			// Parse text as xml
			"text xml": jQuery.parseXML
		},

		// For options that shouldn't be deep extended:
		// you can add your own custom options here if
		// and when you create one that shouldn't be
		// deep extended (see ajaxExtend)
		flatOptions: {
			url: true,
			context: true
		}
	},

	// Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// If target is omitted, writes into ajaxSettings.
	ajaxSetup: function( target, settings ) {
		return settings ?

			// Building a settings object
			ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :

			// Extending ajaxSettings
			ajaxExtend( jQuery.ajaxSettings, target );
	},

	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	ajaxTransport: addToPrefiltersOrTransports( transports ),

	// Main method
	ajax: function( url, options ) {

		// If url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}

		// Force options to be an object
		options = options || {};

		var transport,

			// URL without anti-cache param
			cacheURL,

			// Response headers
			responseHeadersString,
			responseHeaders,

			// timeout handle
			timeoutTimer,

			// Url cleanup var
			urlAnchor,

			// Request state (becomes false upon send and true upon completion)
			completed,

			// To know if global events are to be dispatched
			fireGlobals,

			// Loop variable
			i,

			// uncached part of the url
			uncached,

			// Create the final options object
			s = jQuery.ajaxSetup( {}, options ),

			// Callbacks context
			callbackContext = s.context || s,

			// Context for global events is callbackContext if it is a DOM node or jQuery collection
			globalEventContext = s.context &&
				( callbackContext.nodeType || callbackContext.jquery ) ?
				jQuery( callbackContext ) :
				jQuery.event,

			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery.Callbacks( "once memory" ),

			// Status-dependent callbacks
			statusCode = s.statusCode || {},

			// Headers (they are sent all at once)
			requestHeaders = {},
			requestHeadersNames = {},

			// Default abort message
			strAbort = "canceled",

			// Fake xhr
			jqXHR = {
				readyState: 0,

				// Builds headers hashtable if needed
				getResponseHeader: function( key ) {
					var match;
					if ( completed ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while ( ( match = rheaders.exec( responseHeadersString ) ) ) {
								responseHeaders[ match[ 1 ].toLowerCase() + " " ] =
									( responseHeaders[ match[ 1 ].toLowerCase() + " " ] || [] )
										.concat( match[ 2 ] );
							}
						}
						match = responseHeaders[ key.toLowerCase() + " " ];
					}
					return match == null ? null : match.join( ", " );
				},

				// Raw string
				getAllResponseHeaders: function() {
					return completed ? responseHeadersString : null;
				},

				// Caches the header
				setRequestHeader: function( name, value ) {
					if ( completed == null ) {
						name = requestHeadersNames[ name.toLowerCase() ] =
							requestHeadersNames[ name.toLowerCase() ] || name;
						requestHeaders[ name ] = value;
					}
					return this;
				},

				// Overrides response content-type header
				overrideMimeType: function( type ) {
					if ( completed == null ) {
						s.mimeType = type;
					}
					return this;
				},

				// Status-dependent callbacks
				statusCode: function( map ) {
					var code;
					if ( map ) {
						if ( completed ) {

							// Execute the appropriate callbacks
							jqXHR.always( map[ jqXHR.status ] );
						} else {

							// Lazy-add the new callbacks in a way that preserves old ones
							for ( code in map ) {
								statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
							}
						}
					}
					return this;
				},

				// Cancel the request
				abort: function( statusText ) {
					var finalText = statusText || strAbort;
					if ( transport ) {
						transport.abort( finalText );
					}
					done( 0, finalText );
					return this;
				}
			};

		// Attach deferreds
		deferred.promise( jqXHR );

		// Add protocol if not provided (prefilters might expect it)
		// Handle falsy url in the settings object (#10093: consistency with old signature)
		// We also use the url parameter if available
		s.url = ( ( url || s.url || location.href ) + "" )
			.replace( rprotocol, location.protocol + "//" );

		// Alias method option to type as per ticket #12004
		s.type = options.method || options.type || s.method || s.type;

		// Extract dataTypes list
		s.dataTypes = ( s.dataType || "*" ).toLowerCase().match( rnothtmlwhite ) || [ "" ];

		// A cross-domain request is in order when the origin doesn't match the current origin.
		if ( s.crossDomain == null ) {
			urlAnchor = document.createElement( "a" );

			// Support: IE <=8 - 11, Edge 12 - 15
			// IE throws exception on accessing the href property if url is malformed,
			// e.g. http://example.com:80x/
			try {
				urlAnchor.href = s.url;

				// Support: IE <=8 - 11 only
				// Anchor's host property isn't correctly set when s.url is relative
				urlAnchor.href = urlAnchor.href;
				s.crossDomain = originAnchor.protocol + "//" + originAnchor.host !==
					urlAnchor.protocol + "//" + urlAnchor.host;
			} catch ( e ) {

				// If there is an error parsing the URL, assume it is crossDomain,
				// it can be rejected by the transport if it is invalid
				s.crossDomain = true;
			}
		}

		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Apply prefilters
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// If request was aborted inside a prefilter, stop there
		if ( completed ) {
			return jqXHR;
		}

		// We can fire global events as of now if asked to
		// Don't fire events if jQuery.event is undefined in an AMD-usage scenario (#15118)
		fireGlobals = jQuery.event && s.global;

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger( "ajaxStart" );
		}

		// Uppercase the type
		s.type = s.type.toUpperCase();

		// Determine if request has content
		s.hasContent = !rnoContent.test( s.type );

		// Save the URL in case we're toying with the If-Modified-Since
		// and/or If-None-Match header later on
		// Remove hash to simplify url manipulation
		cacheURL = s.url.replace( rhash, "" );

		// More options handling for requests with no content
		if ( !s.hasContent ) {

			// Remember the hash so we can put it back
			uncached = s.url.slice( cacheURL.length );

			// If data is available and should be processed, append data to url
			if ( s.data && ( s.processData || typeof s.data === "string" ) ) {
				cacheURL += ( rquery.test( cacheURL ) ? "&" : "?" ) + s.data;

				// #9682: remove data so that it's not used in an eventual retry
				delete s.data;
			}

			// Add or update anti-cache param if needed
			if ( s.cache === false ) {
				cacheURL = cacheURL.replace( rantiCache, "$1" );
				uncached = ( rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + ( nonce.guid++ ) +
					uncached;
			}

			// Put hash and anti-cache on the URL that will be requested (gh-1732)
			s.url = cacheURL + uncached;

		// Change '%20' to '+' if this is encoded form body content (gh-2658)
		} else if ( s.data && s.processData &&
			( s.contentType || "" ).indexOf( "application/x-www-form-urlencoded" ) === 0 ) {
			s.data = s.data.replace( r20, "+" );
		}

		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			if ( jQuery.lastModified[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] );
			}
			if ( jQuery.etag[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] );
			}
		}

		// Set the correct header, if data is being sent
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			jqXHR.setRequestHeader( "Content-Type", s.contentType );
		}

		// Set the Accepts header for the server, depending on the dataType
		jqXHR.setRequestHeader(
			"Accept",
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[ 0 ] ] ?
				s.accepts[ s.dataTypes[ 0 ] ] +
					( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// Check for headers option
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend &&
			( s.beforeSend.call( callbackContext, jqXHR, s ) === false || completed ) ) {

			// Abort if not done already and return
			return jqXHR.abort();
		}

		// Aborting is no longer a cancellation
		strAbort = "abort";

		// Install callbacks on deferreds
		completeDeferred.add( s.complete );
		jqXHR.done( s.success );
		jqXHR.fail( s.error );

		// Get transport
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// If no transport, we auto-abort
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			jqXHR.readyState = 1;

			// Send global event
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}

			// If request was aborted inside ajaxSend, stop there
			if ( completed ) {
				return jqXHR;
			}

			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = window.setTimeout( function() {
					jqXHR.abort( "timeout" );
				}, s.timeout );
			}

			try {
				completed = false;
				transport.send( requestHeaders, done );
			} catch ( e ) {

				// Rethrow post-completion exceptions
				if ( completed ) {
					throw e;
				}

				// Propagate others as results
				done( -1, e );
			}
		}

		// Callback for when everything is done
		function done( status, nativeStatusText, responses, headers ) {
			var isSuccess, success, error, response, modified,
				statusText = nativeStatusText;

			// Ignore repeat invocations
			if ( completed ) {
				return;
			}

			completed = true;

			// Clear timeout if it exists
			if ( timeoutTimer ) {
				window.clearTimeout( timeoutTimer );
			}

			// Dereference transport for early garbage collection
			// (no matter how long the jqXHR object will be used)
			transport = undefined;

			// Cache response headers
			responseHeadersString = headers || "";

			// Set readyState
			jqXHR.readyState = status > 0 ? 4 : 0;

			// Determine if successful
			isSuccess = status >= 200 && status < 300 || status === 304;

			// Get response data
			if ( responses ) {
				response = ajaxHandleResponses( s, jqXHR, responses );
			}

			// Use a noop converter for missing script but not if jsonp
			if ( !isSuccess &&
				jQuery.inArray( "script", s.dataTypes ) > -1 &&
				jQuery.inArray( "json", s.dataTypes ) < 0 ) {
				s.converters[ "text script" ] = function() {};
			}

			// Convert no matter what (that way responseXXX fields are always set)
			response = ajaxConvert( s, response, jqXHR, isSuccess );

			// If successful, handle type chaining
			if ( isSuccess ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {
					modified = jqXHR.getResponseHeader( "Last-Modified" );
					if ( modified ) {
						jQuery.lastModified[ cacheURL ] = modified;
					}
					modified = jqXHR.getResponseHeader( "etag" );
					if ( modified ) {
						jQuery.etag[ cacheURL ] = modified;
					}
				}

				// if no content
				if ( status === 204 || s.type === "HEAD" ) {
					statusText = "nocontent";

				// if not modified
				} else if ( status === 304 ) {
					statusText = "notmodified";

				// If we have data, let's convert it
				} else {
					statusText = response.state;
					success = response.data;
					error = response.error;
					isSuccess = !error;
				}
			} else {

				// Extract error from statusText and normalize for non-aborts
				error = statusText;
				if ( status || !statusText ) {
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			// Set data for the fake xhr object
			jqXHR.status = status;
			jqXHR.statusText = ( nativeStatusText || statusText ) + "";

			// Success/Error
			if ( isSuccess ) {
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// Status-dependent callbacks
			jqXHR.statusCode( statusCode );
			statusCode = undefined;

			if ( fireGlobals ) {
				globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
					[ jqXHR, s, isSuccess ? success : error ] );
			}

			// Complete
			completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );

				// Handle the global AJAX counter
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger( "ajaxStop" );
				}
			}
		}

		return jqXHR;
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, "json" );
	},

	getScript: function( url, callback ) {
		return jQuery.get( url, undefined, callback, "script" );
	}
} );

jQuery.each( [ "get", "post" ], function( _i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {

		// Shift arguments if data argument was omitted
		if ( isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		// The url can be an options object (which then must have .url)
		return jQuery.ajax( jQuery.extend( {
			url: url,
			type: method,
			dataType: type,
			data: data,
			success: callback
		}, jQuery.isPlainObject( url ) && url ) );
	};
} );

jQuery.ajaxPrefilter( function( s ) {
	var i;
	for ( i in s.headers ) {
		if ( i.toLowerCase() === "content-type" ) {
			s.contentType = s.headers[ i ] || "";
		}
	}
} );


jQuery._evalUrl = function( url, options, doc ) {
	return jQuery.ajax( {
		url: url,

		// Make this explicit, since user can override this through ajaxSetup (#11264)
		type: "GET",
		dataType: "script",
		cache: true,
		async: false,
		global: false,

		// Only evaluate the response if it is successful (gh-4126)
		// dataFilter is not invoked for failure responses, so using it instead
		// of the default converter is kludgy but it works.
		converters: {
			"text script": function() {}
		},
		dataFilter: function( response ) {
			jQuery.globalEval( response, options, doc );
		}
	} );
};


jQuery.fn.extend( {
	wrapAll: function( html ) {
		var wrap;

		if ( this[ 0 ] ) {
			if ( isFunction( html ) ) {
				html = html.call( this[ 0 ] );
			}

			// The elements to wrap the target around
			wrap = jQuery( html, this[ 0 ].ownerDocument ).eq( 0 ).clone( true );

			if ( this[ 0 ].parentNode ) {
				wrap.insertBefore( this[ 0 ] );
			}

			wrap.map( function() {
				var elem = this;

				while ( elem.firstElementChild ) {
					elem = elem.firstElementChild;
				}

				return elem;
			} ).append( this );
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( isFunction( html ) ) {
			return this.each( function( i ) {
				jQuery( this ).wrapInner( html.call( this, i ) );
			} );
		}

		return this.each( function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		} );
	},

	wrap: function( html ) {
		var htmlIsFunction = isFunction( html );

		return this.each( function( i ) {
			jQuery( this ).wrapAll( htmlIsFunction ? html.call( this, i ) : html );
		} );
	},

	unwrap: function( selector ) {
		this.parent( selector ).not( "body" ).each( function() {
			jQuery( this ).replaceWith( this.childNodes );
		} );
		return this;
	}
} );


jQuery.expr.pseudos.hidden = function( elem ) {
	return !jQuery.expr.pseudos.visible( elem );
};
jQuery.expr.pseudos.visible = function( elem ) {
	return !!( elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length );
};




jQuery.ajaxSettings.xhr = function() {
	try {
		return new window.XMLHttpRequest();
	} catch ( e ) {}
};

var xhrSuccessStatus = {

		// File protocol always yields status code 0, assume 200
		0: 200,

		// Support: IE <=9 only
		// #1450: sometimes IE returns 1223 when it should be 204
		1223: 204
	},
	xhrSupported = jQuery.ajaxSettings.xhr();

support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
support.ajax = xhrSupported = !!xhrSupported;

jQuery.ajaxTransport( function( options ) {
	var callback, errorCallback;

	// Cross domain only allowed if supported through XMLHttpRequest
	if ( support.cors || xhrSupported && !options.crossDomain ) {
		return {
			send: function( headers, complete ) {
				var i,
					xhr = options.xhr();

				xhr.open(
					options.type,
					options.url,
					options.async,
					options.username,
					options.password
				);

				// Apply custom fields if provided
				if ( options.xhrFields ) {
					for ( i in options.xhrFields ) {
						xhr[ i ] = options.xhrFields[ i ];
					}
				}

				// Override mime type if needed
				if ( options.mimeType && xhr.overrideMimeType ) {
					xhr.overrideMimeType( options.mimeType );
				}

				// X-Requested-With header
				// For cross-domain requests, seeing as conditions for a preflight are
				// akin to a jigsaw puzzle, we simply never set it to be sure.
				// (it can always be set on a per-request basis or even using ajaxSetup)
				// For same-domain requests, won't change header if already provided.
				if ( !options.crossDomain && !headers[ "X-Requested-With" ] ) {
					headers[ "X-Requested-With" ] = "XMLHttpRequest";
				}

				// Set headers
				for ( i in headers ) {
					xhr.setRequestHeader( i, headers[ i ] );
				}

				// Callback
				callback = function( type ) {
					return function() {
						if ( callback ) {
							callback = errorCallback = xhr.onload =
								xhr.onerror = xhr.onabort = xhr.ontimeout =
									xhr.onreadystatechange = null;

							if ( type === "abort" ) {
								xhr.abort();
							} else if ( type === "error" ) {

								// Support: IE <=9 only
								// On a manual native abort, IE9 throws
								// errors on any property access that is not readyState
								if ( typeof xhr.status !== "number" ) {
									complete( 0, "error" );
								} else {
									complete(

										// File: protocol always yields status 0; see #8605, #14207
										xhr.status,
										xhr.statusText
									);
								}
							} else {
								complete(
									xhrSuccessStatus[ xhr.status ] || xhr.status,
									xhr.statusText,

									// Support: IE <=9 only
									// IE9 has no XHR2 but throws on binary (trac-11426)
									// For XHR2 non-text, let the caller handle it (gh-2498)
									( xhr.responseType || "text" ) !== "text"  ||
									typeof xhr.responseText !== "string" ?
										{ binary: xhr.response } :
										{ text: xhr.responseText },
									xhr.getAllResponseHeaders()
								);
							}
						}
					};
				};

				// Listen to events
				xhr.onload = callback();
				errorCallback = xhr.onerror = xhr.ontimeout = callback( "error" );

				// Support: IE 9 only
				// Use onreadystatechange to replace onabort
				// to handle uncaught aborts
				if ( xhr.onabort !== undefined ) {
					xhr.onabort = errorCallback;
				} else {
					xhr.onreadystatechange = function() {

						// Check readyState before timeout as it changes
						if ( xhr.readyState === 4 ) {

							// Allow onerror to be called first,
							// but that will not handle a native abort
							// Also, save errorCallback to a variable
							// as xhr.onerror cannot be accessed
							window.setTimeout( function() {
								if ( callback ) {
									errorCallback();
								}
							} );
						}
					};
				}

				// Create the abort callback
				callback = callback( "abort" );

				try {

					// Do send the request (this may raise an exception)
					xhr.send( options.hasContent && options.data || null );
				} catch ( e ) {

					// #14683: Only rethrow if this hasn't been notified as an error yet
					if ( callback ) {
						throw e;
					}
				}
			},

			abort: function() {
				if ( callback ) {
					callback();
				}
			}
		};
	}
} );




// Prevent auto-execution of scripts when no explicit dataType was provided (See gh-2432)
jQuery.ajaxPrefilter( function( s ) {
	if ( s.crossDomain ) {
		s.contents.script = false;
	}
} );

// Install script dataType
jQuery.ajaxSetup( {
	accepts: {
		script: "text/javascript, application/javascript, " +
			"application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /\\b(?:java|ecma)script\\b/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
} );

// Handle cache's special case and crossDomain
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
	}
} );

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function( s ) {

	// This transport only deals with cross domain or forced-by-attrs requests
	if ( s.crossDomain || s.scriptAttrs ) {
		var script, callback;
		return {
			send: function( _, complete ) {
				script = jQuery( "<script>" )
					.attr( s.scriptAttrs || {} )
					.prop( { charset: s.scriptCharset, src: s.url } )
					.on( "load error", callback = function( evt ) {
						script.remove();
						callback = null;
						if ( evt ) {
							complete( evt.type === "error" ? 404 : 200, evt.type );
						}
					} );

				// Use native DOM manipulation to avoid our domManip AJAX trickery
				document.head.appendChild( script[ 0 ] );
			},
			abort: function() {
				if ( callback ) {
					callback();
				}
			}
		};
	}
} );




var oldCallbacks = [],
	rjsonp = /(=)\\?(?=&|$)|\\?\\?/;

// Default jsonp settings
jQuery.ajaxSetup( {
	jsonp: "callback",
	jsonpCallback: function() {
		var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( nonce.guid++ ) );
		this[ callback ] = true;
		return callback;
	}
} );

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var callbackName, overwritten, responseContainer,
		jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
			"url" :
			typeof s.data === "string" &&
				( s.contentType || "" )
					.indexOf( "application/x-www-form-urlencoded" ) === 0 &&
				rjsonp.test( s.data ) && "data"
		);

	// Handle iff the expected data type is "jsonp" or we have a parameter to set
	if ( jsonProp || s.dataTypes[ 0 ] === "jsonp" ) {

		// Get callback name, remembering preexisting value associated with it
		callbackName = s.jsonpCallback = isFunction( s.jsonpCallback ) ?
			s.jsonpCallback() :
			s.jsonpCallback;

		// Insert callback into url or form data
		if ( jsonProp ) {
			s[ jsonProp ] = s[ jsonProp ].replace( rjsonp, "$1" + callbackName );
		} else if ( s.jsonp !== false ) {
			s.url += ( rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
		}

		// Use data converter to retrieve json after script execution
		s.converters[ "script json" ] = function() {
			if ( !responseContainer ) {
				jQuery.error( callbackName + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// Force json dataType
		s.dataTypes[ 0 ] = "json";

		// Install callback
		overwritten = window[ callbackName ];
		window[ callbackName ] = function() {
			responseContainer = arguments;
		};

		// Clean-up function (fires after converters)
		jqXHR.always( function() {

			// If previous value didn't exist - remove it
			if ( overwritten === undefined ) {
				jQuery( window ).removeProp( callbackName );

			// Otherwise restore preexisting value
			} else {
				window[ callbackName ] = overwritten;
			}

			// Save back as free
			if ( s[ callbackName ] ) {

				// Make sure that re-using the options doesn't screw things around
				s.jsonpCallback = originalSettings.jsonpCallback;

				// Save the callback name for future use
				oldCallbacks.push( callbackName );
			}

			// Call if it was a function and we have a response
			if ( responseContainer && isFunction( overwritten ) ) {
				overwritten( responseContainer[ 0 ] );
			}

			responseContainer = overwritten = undefined;
		} );

		// Delegate to script
		return "script";
	}
} );




// Support: Safari 8 only
// In Safari 8 documents created via document.implementation.createHTMLDocument
// collapse sibling forms: the second one becomes a child of the first one.
// Because of that, this security measure has to be disabled in Safari 8.
// https://bugs.webkit.org/show_bug.cgi?id=137337
support.createHTMLDocument = ( function() {
	var body = document.implementation.createHTMLDocument( "" ).body;
	body.innerHTML = "<form></form><form></form>";
	return body.childNodes.length === 2;
} )();


// Argument "data" should be string of html
// context (optional): If specified, the fragment will be created in this context,
// defaults to document
// keepScripts (optional): If true, will include scripts passed in the html string
jQuery.parseHTML = function( data, context, keepScripts ) {
	if ( typeof data !== "string" ) {
		return [];
	}
	if ( typeof context === "boolean" ) {
		keepScripts = context;
		context = false;
	}

	var base, parsed, scripts;

	if ( !context ) {

		// Stop scripts or inline event handlers from being executed immediately
		// by using document.implementation
		if ( support.createHTMLDocument ) {
			context = document.implementation.createHTMLDocument( "" );

			// Set the base href for the created document
			// so any parsed elements with URLs
			// are based on the document's URL (gh-2965)
			base = context.createElement( "base" );
			base.href = document.location.href;
			context.head.appendChild( base );
		} else {
			context = document;
		}
	}

	parsed = rsingleTag.exec( data );
	scripts = !keepScripts && [];

	// Single tag
	if ( parsed ) {
		return [ context.createElement( parsed[ 1 ] ) ];
	}

	parsed = buildFragment( [ data ], context, scripts );

	if ( scripts && scripts.length ) {
		jQuery( scripts ).remove();
	}

	return jQuery.merge( [], parsed.childNodes );
};


/**
 * Load a url into a page
 */
jQuery.fn.load = function( url, params, callback ) {
	var selector, type, response,
		self = this,
		off = url.indexOf( " " );

	if ( off > -1 ) {
		selector = stripAndCollapse( url.slice( off ) );
		url = url.slice( 0, off );
	}

	// If it's a function
	if ( isFunction( params ) ) {

		// We assume that it's the callback
		callback = params;
		params = undefined;

	// Otherwise, build a param string
	} else if ( params && typeof params === "object" ) {
		type = "POST";
	}

	// If we have elements to modify, make the request
	if ( self.length > 0 ) {
		jQuery.ajax( {
			url: url,

			// If "type" variable is undefined, then "GET" method will be used.
			// Make value of this field explicit since
			// user can override it through ajaxSetup method
			type: type || "GET",
			dataType: "html",
			data: params
		} ).done( function( responseText ) {

			// Save response for use in complete callback
			response = arguments;

			self.html( selector ?

				// If a selector was specified, locate the right elements in a dummy div
				// Exclude scripts to avoid IE 'Permission Denied' errors
				jQuery( "<div>" ).append( jQuery.parseHTML( responseText ) ).find( selector ) :

				// Otherwise use the full result
				responseText );

		// If the request succeeds, this function gets "data", "status", "jqXHR"
		// but they are ignored because response was set above.
		// If it fails, this function gets "jqXHR", "status", "error"
		} ).always( callback && function( jqXHR, status ) {
			self.each( function() {
				callback.apply( this, response || [ jqXHR.responseText, status, jqXHR ] );
			} );
		} );
	}

	return this;
};




jQuery.expr.pseudos.animated = function( elem ) {
	return jQuery.grep( jQuery.timers, function( fn ) {
		return elem === fn.elem;
	} ).length;
};




jQuery.offset = {
	setOffset: function( elem, options, i ) {
		var curPosition, curLeft, curCSSTop, curTop, curOffset, curCSSLeft, calculatePosition,
			position = jQuery.css( elem, "position" ),
			curElem = jQuery( elem ),
			props = {};

		// Set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		curOffset = curElem.offset();
		curCSSTop = jQuery.css( elem, "top" );
		curCSSLeft = jQuery.css( elem, "left" );
		calculatePosition = ( position === "absolute" || position === "fixed" ) &&
			( curCSSTop + curCSSLeft ).indexOf( "auto" ) > -1;

		// Need to be able to calculate position if either
		// top or left is auto and position is either absolute or fixed
		if ( calculatePosition ) {
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;

		} else {
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}

		if ( isFunction( options ) ) {

			// Use jQuery.extend here to allow modification of coordinates argument (gh-1848)
			options = options.call( elem, i, jQuery.extend( {}, curOffset ) );
		}

		if ( options.top != null ) {
			props.top = ( options.top - curOffset.top ) + curTop;
		}
		if ( options.left != null ) {
			props.left = ( options.left - curOffset.left ) + curLeft;
		}

		if ( "using" in options ) {
			options.using.call( elem, props );

		} else {
			curElem.css( props );
		}
	}
};

jQuery.fn.extend( {

	// offset() relates an element's border box to the document origin
	offset: function( options ) {

		// Preserve chaining for setter
		if ( arguments.length ) {
			return options === undefined ?
				this :
				this.each( function( i ) {
					jQuery.offset.setOffset( this, options, i );
				} );
		}

		var rect, win,
			elem = this[ 0 ];

		if ( !elem ) {
			return;
		}

		// Return zeros for disconnected and hidden (display: none) elements (gh-2310)
		// Support: IE <=11 only
		// Running getBoundingClientRect on a
		// disconnected node in IE throws an error
		if ( !elem.getClientRects().length ) {
			return { top: 0, left: 0 };
		}

		// Get document-relative position by adding viewport scroll to viewport-relative gBCR
		rect = elem.getBoundingClientRect();
		win = elem.ownerDocument.defaultView;
		return {
			top: rect.top + win.pageYOffset,
			left: rect.left + win.pageXOffset
		};
	},

	// position() relates an element's margin box to its offset parent's padding box
	// This corresponds to the behavior of CSS absolute positioning
	position: function() {
		if ( !this[ 0 ] ) {
			return;
		}

		var offsetParent, offset, doc,
			elem = this[ 0 ],
			parentOffset = { top: 0, left: 0 };

		// position:fixed elements are offset from the viewport, which itself always has zero offset
		if ( jQuery.css( elem, "position" ) === "fixed" ) {

			// Assume position:fixed implies availability of getBoundingClientRect
			offset = elem.getBoundingClientRect();

		} else {
			offset = this.offset();

			// Account for the *real* offset parent, which can be the document or its root element
			// when a statically positioned element is identified
			doc = elem.ownerDocument;
			offsetParent = elem.offsetParent || doc.documentElement;
			while ( offsetParent &&
				( offsetParent === doc.body || offsetParent === doc.documentElement ) &&
				jQuery.css( offsetParent, "position" ) === "static" ) {

				offsetParent = offsetParent.parentNode;
			}
			if ( offsetParent && offsetParent !== elem && offsetParent.nodeType === 1 ) {

				// Incorporate borders into its offset, since they are outside its content origin
				parentOffset = jQuery( offsetParent ).offset();
				parentOffset.top += jQuery.css( offsetParent, "borderTopWidth", true );
				parentOffset.left += jQuery.css( offsetParent, "borderLeftWidth", true );
			}
		}

		// Subtract parent offsets and element margins
		return {
			top: offset.top - parentOffset.top - jQuery.css( elem, "marginTop", true ),
			left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true )
		};
	},

	// This method will return documentElement in the following cases:
	// 1) For the element inside the iframe without offsetParent, this method will return
	//    documentElement of the parent window
	// 2) For the hidden or detached element
	// 3) For body or html element, i.e. in case of the html node - it will return itself
	//
	// but those exceptions were never presented as a real life use-cases
	// and might be considered as more preferable results.
	//
	// This logic, however, is not guaranteed and can change at any point in the future
	offsetParent: function() {
		return this.map( function() {
			var offsetParent = this.offsetParent;

			while ( offsetParent && jQuery.css( offsetParent, "position" ) === "static" ) {
				offsetParent = offsetParent.offsetParent;
			}

			return offsetParent || documentElement;
		} );
	}
} );

// Create scrollLeft and scrollTop methods
jQuery.each( { scrollLeft: "pageXOffset", scrollTop: "pageYOffset" }, function( method, prop ) {
	var top = "pageYOffset" === prop;

	jQuery.fn[ method ] = function( val ) {
		return access( this, function( elem, method, val ) {

			// Coalesce documents and windows
			var win;
			if ( isWindow( elem ) ) {
				win = elem;
			} else if ( elem.nodeType === 9 ) {
				win = elem.defaultView;
			}

			if ( val === undefined ) {
				return win ? win[ prop ] : elem[ method ];
			}

			if ( win ) {
				win.scrollTo(
					!top ? val : win.pageXOffset,
					top ? val : win.pageYOffset
				);

			} else {
				elem[ method ] = val;
			}
		}, method, val, arguments.length );
	};
} );

// Support: Safari <=7 - 9.1, Chrome <=37 - 49
// Add the top/left cssHooks using jQuery.fn.position
// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
// Blink bug: https://bugs.chromium.org/p/chromium/issues/detail?id=589347
// getComputedStyle returns percent when specified for top/left/bottom/right;
// rather than make the css module depend on the offset module, just check for it here
jQuery.each( [ "top", "left" ], function( _i, prop ) {
	jQuery.cssHooks[ prop ] = addGetHookIf( support.pixelPosition,
		function( elem, computed ) {
			if ( computed ) {
				computed = curCSS( elem, prop );

				// If curCSS returns percentage, fallback to offset
				return rnumnonpx.test( computed ) ?
					jQuery( elem ).position()[ prop ] + "px" :
					computed;
			}
		}
	);
} );


// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
	jQuery.each( {
		padding: "inner" + name,
		content: type,
		"": "outer" + name
	}, function( defaultExtra, funcName ) {

		// Margin is only for outerHeight, outerWidth
		jQuery.fn[ funcName ] = function( margin, value ) {
			var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
				extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

			return access( this, function( elem, type, value ) {
				var doc;

				if ( isWindow( elem ) ) {

					// $( window ).outerWidth/Height return w/h including scrollbars (gh-1729)
					return funcName.indexOf( "outer" ) === 0 ?
						elem[ "inner" + name ] :
						elem.document.documentElement[ "client" + name ];
				}

				// Get document width or height
				if ( elem.nodeType === 9 ) {
					doc = elem.documentElement;

					// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height],
					// whichever is greatest
					return Math.max(
						elem.body[ "scroll" + name ], doc[ "scroll" + name ],
						elem.body[ "offset" + name ], doc[ "offset" + name ],
						doc[ "client" + name ]
					);
				}

				return value === undefined ?

					// Get width or height on the element, requesting but not forcing parseFloat
					jQuery.css( elem, type, extra ) :

					// Set width or height on the element
					jQuery.style( elem, type, value, extra );
			}, type, chainable ? margin : undefined, chainable );
		};
	} );
} );


jQuery.each( [
	"ajaxStart",
	"ajaxStop",
	"ajaxComplete",
	"ajaxError",
	"ajaxSuccess",
	"ajaxSend"
], function( _i, type ) {
	jQuery.fn[ type ] = function( fn ) {
		return this.on( type, fn );
	};
} );




jQuery.fn.extend( {

	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
	undelegate: function( selector, types, fn ) {

		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length === 1 ?
			this.off( selector, "**" ) :
			this.off( types, selector || "**", fn );
	},

	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	}
} );

jQuery.each(
	( "blur focus focusin focusout resize scroll click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup contextmenu" ).split( " " ),
	function( _i, name ) {

		// Handle event binding
		jQuery.fn[ name ] = function( data, fn ) {
			return arguments.length > 0 ?
				this.on( name, null, data, fn ) :
				this.trigger( name );
		};
	}
);




// Support: Android <=4.0 only
// Make sure we trim BOM and NBSP
var rtrim = /^[\\s\\uFEFF\\xA0]+|[\\s\\uFEFF\\xA0]+$/g;

// Bind a function to a context, optionally partially applying any
// arguments.
// jQuery.proxy is deprecated to promote standards (specifically Function#bind)
// However, it is not slated for removal any time soon
jQuery.proxy = function( fn, context ) {
	var tmp, args, proxy;

	if ( typeof context === "string" ) {
		tmp = fn[ context ];
		context = fn;
		fn = tmp;
	}

	// Quick check to determine if target is callable, in the spec
	// this throws a TypeError, but we will just return undefined.
	if ( !isFunction( fn ) ) {
		return undefined;
	}

	// Simulated bind
	args = slice.call( arguments, 2 );
	proxy = function() {
		return fn.apply( context || this, args.concat( slice.call( arguments ) ) );
	};

	// Set the guid of unique handler to the same of original handler, so it can be removed
	proxy.guid = fn.guid = fn.guid || jQuery.guid++;

	return proxy;
};

jQuery.holdReady = function( hold ) {
	if ( hold ) {
		jQuery.readyWait++;
	} else {
		jQuery.ready( true );
	}
};
jQuery.isArray = Array.isArray;
jQuery.parseJSON = JSON.parse;
jQuery.nodeName = nodeName;
jQuery.isFunction = isFunction;
jQuery.isWindow = isWindow;
jQuery.camelCase = camelCase;
jQuery.type = toType;

jQuery.now = Date.now;

jQuery.isNumeric = function( obj ) {

	// As of jQuery 3.0, isNumeric is limited to
	// strings and numbers (primitives or objects)
	// that can be coerced to finite numbers (gh-2662)
	var type = jQuery.type( obj );
	return ( type === "number" || type === "string" ) &&

		// parseFloat NaNs numeric-cast false positives ("")
		// ...but misinterprets leading-number strings, particularly hex literals ("0x...")
		// subtraction forces infinities to NaN
		!isNaN( obj - parseFloat( obj ) );
};

jQuery.trim = function( text ) {
	return text == null ?
		"" :
		( text + "" ).replace( rtrim, "" );
};



// Register as a named AMD module, since jQuery can be concatenated with other
// files that may use define, but not via a proper concatenation script that
// understands anonymous AMD modules. A named AMD is safest and most robust
// way to register. Lowercase jquery is used because AMD module names are
// derived from file names, and jQuery is normally delivered in a lowercase
// file name. Do this after creating the global so that if an AMD module wants
// to call noConflict to hide this version of jQuery, it will work.

// Note that for maximum portability, libraries that are not jQuery should
// declare themselves as anonymous modules, and avoid setting a global if an
// AMD loader is present. jQuery is a special case. For more information, see
// https://github.com/jrburke/requirejs/wiki/Updating-existing-libraries#wiki-anon

if ( true ) {
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = (function() {
		return jQuery;
	}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
}




var

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$;

jQuery.noConflict = function( deep ) {
	if ( window.$ === jQuery ) {
		window.$ = _$;
	}

	if ( deep && window.jQuery === jQuery ) {
		window.jQuery = _jQuery;
	}

	return jQuery;
};

// Expose jQuery and $ identifiers, even in AMD
// (#7102#comment:10, https://github.com/jquery/jquery/pull/557)
// and CommonJS for browser emulators (#13566)
if ( typeof noGlobal === "undefined" ) {
	window.jQuery = window.$ = jQuery;
}




return jQuery;
} );


//# sourceURL=webpack://MathquillComponent/./node_modules/jquery/dist/jquery.js?`);
              }
            ),
            /***/
            "./node_modules/object-assign/index.js": (
              /*!*********************************************!*\
                !*** ./node_modules/object-assign/index.js ***!
                \*********************************************/
              /***/
              (module) => {
                eval(`/*
object-assign
(c) Sindre Sorhus
@license MIT
*/


/* eslint-disable no-unused-vars */
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function shouldUseNative() {
	try {
		if (!Object.assign) {
			return false;
		}

		// Detect buggy property enumeration order in older V8 versions.

		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
		var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
		test1[5] = 'de';
		if (Object.getOwnPropertyNames(test1)[0] === '5') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test2 = {};
		for (var i = 0; i < 10; i++) {
			test2['_' + String.fromCharCode(i)] = i;
		}
		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
			return test2[n];
		});
		if (order2.join('') !== '0123456789') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test3 = {};
		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
			test3[letter] = letter;
		});
		if (Object.keys(Object.assign({}, test3)).join('') !==
				'abcdefghijklmnopqrst') {
			return false;
		}

		return true;
	} catch (err) {
		// We don't expect any of the above to throw, but better to be safe.
		return false;
	}
}

module.exports = shouldUseNative() ? Object.assign : function (target, source) {
	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments[s]);

		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (getOwnPropertySymbols) {
			symbols = getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};


//# sourceURL=webpack://MathquillComponent/./node_modules/object-assign/index.js?`);
              }
            ),
            /***/
            "./node_modules/prop-types/checkPropTypes.js": (
              /*!***************************************************!*\
                !*** ./node_modules/prop-types/checkPropTypes.js ***!
                \***************************************************/
              /***/
              (module, __unused_webpack_exports, __webpack_require__) => {
                eval(`/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



var printWarning = function() {};

if (true) {
  var ReactPropTypesSecret = __webpack_require__(/*! ./lib/ReactPropTypesSecret */ "./node_modules/prop-types/lib/ReactPropTypesSecret.js");
  var loggedTypeFailures = {};
  var has = Function.call.bind(Object.prototype.hasOwnProperty);

  printWarning = function(text) {
    var message = 'Warning: ' + text;
    if (typeof console !== 'undefined') {
      console.error(message);
    }
    try {
      // --- Welcome to debugging React ---
      // This error was thrown as a convenience so that you can use this stack
      // to find the callsite that caused this warning to fire.
      throw new Error(message);
    } catch (x) {}
  };
}

/**
 * Assert that the values match with the type specs.
 * Error messages are memorized and will only be shown once.
 *
 * @param {object} typeSpecs Map of name to a ReactPropType
 * @param {object} values Runtime values that need to be type-checked
 * @param {string} location e.g. "prop", "context", "child context"
 * @param {string} componentName Name of the component for error messages.
 * @param {?Function} getStack Returns the component stack.
 * @private
 */
function checkPropTypes(typeSpecs, values, location, componentName, getStack) {
  if (true) {
    for (var typeSpecName in typeSpecs) {
      if (has(typeSpecs, typeSpecName)) {
        var error;
        // Prop type validation may throw. In case they do, we don't want to
        // fail the render phase where it didn't fail before. So we log it.
        // After these have been cleaned up, we'll let them throw.
        try {
          // This is intentionally an invariant that gets caught. It's the same
          // behavior as without this statement except with a better message.
          if (typeof typeSpecs[typeSpecName] !== 'function') {
            var err = Error(
              (componentName || 'React class') + ': ' + location + ' type \`' + typeSpecName + '\` is invalid; ' +
              'it must be a function, usually from the \`prop-types\` package, but received \`' + typeof typeSpecs[typeSpecName] + '\`.'
            );
            err.name = 'Invariant Violation';
            throw err;
          }
          error = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, ReactPropTypesSecret);
        } catch (ex) {
          error = ex;
        }
        if (error && !(error instanceof Error)) {
          printWarning(
            (componentName || 'React class') + ': type specification of ' +
            location + ' \`' + typeSpecName + '\` is invalid; the type checker ' +
            'function must return \`null\` or an \`Error\` but returned a ' + typeof error + '. ' +
            'You may have forgotten to pass an argument to the type checker ' +
            'creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and ' +
            'shape all require an argument).'
          );
        }
        if (error instanceof Error && !(error.message in loggedTypeFailures)) {
          // Only monitor this failure once because there tends to be a lot of the
          // same error.
          loggedTypeFailures[error.message] = true;

          var stack = getStack ? getStack() : '';

          printWarning(
            'Failed ' + location + ' type: ' + error.message + (stack != null ? stack : '')
          );
        }
      }
    }
  }
}

/**
 * Resets warning cache when testing.
 *
 * @private
 */
checkPropTypes.resetWarningCache = function() {
  if (true) {
    loggedTypeFailures = {};
  }
}

module.exports = checkPropTypes;


//# sourceURL=webpack://MathquillComponent/./node_modules/prop-types/checkPropTypes.js?`);
              }
            ),
            /***/
            "./node_modules/prop-types/factoryWithTypeCheckers.js": (
              /*!************************************************************!*\
                !*** ./node_modules/prop-types/factoryWithTypeCheckers.js ***!
                \************************************************************/
              /***/
              (module, __unused_webpack_exports, __webpack_require__) => {
                eval(`/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



var ReactIs = __webpack_require__(/*! react-is */ "./node_modules/react-is/index.js");
var assign = __webpack_require__(/*! object-assign */ "./node_modules/object-assign/index.js");

var ReactPropTypesSecret = __webpack_require__(/*! ./lib/ReactPropTypesSecret */ "./node_modules/prop-types/lib/ReactPropTypesSecret.js");
var checkPropTypes = __webpack_require__(/*! ./checkPropTypes */ "./node_modules/prop-types/checkPropTypes.js");

var has = Function.call.bind(Object.prototype.hasOwnProperty);
var printWarning = function() {};

if (true) {
  printWarning = function(text) {
    var message = 'Warning: ' + text;
    if (typeof console !== 'undefined') {
      console.error(message);
    }
    try {
      // --- Welcome to debugging React ---
      // This error was thrown as a convenience so that you can use this stack
      // to find the callsite that caused this warning to fire.
      throw new Error(message);
    } catch (x) {}
  };
}

function emptyFunctionThatReturnsNull() {
  return null;
}

module.exports = function(isValidElement, throwOnDirectAccess) {
  /* global Symbol */
  var ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;
  var FAUX_ITERATOR_SYMBOL = '@@iterator'; // Before Symbol spec.

  /**
   * Returns the iterator method function contained on the iterable object.
   *
   * Be sure to invoke the function with the iterable as context:
   *
   *     var iteratorFn = getIteratorFn(myIterable);
   *     if (iteratorFn) {
   *       var iterator = iteratorFn.call(myIterable);
   *       ...
   *     }
   *
   * @param {?object} maybeIterable
   * @return {?function}
   */
  function getIteratorFn(maybeIterable) {
    var iteratorFn = maybeIterable && (ITERATOR_SYMBOL && maybeIterable[ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL]);
    if (typeof iteratorFn === 'function') {
      return iteratorFn;
    }
  }

  /**
   * Collection of methods that allow declaration and validation of props that are
   * supplied to React components. Example usage:
   *
   *   var Props = require('ReactPropTypes');
   *   var MyArticle = React.createClass({
   *     propTypes: {
   *       // An optional string prop named "description".
   *       description: Props.string,
   *
   *       // A required enum prop named "category".
   *       category: Props.oneOf(['News','Photos']).isRequired,
   *
   *       // A prop named "dialog" that requires an instance of Dialog.
   *       dialog: Props.instanceOf(Dialog).isRequired
   *     },
   *     render: function() { ... }
   *   });
   *
   * A more formal specification of how these methods are used:
   *
   *   type := array|bool|func|object|number|string|oneOf([...])|instanceOf(...)
   *   decl := ReactPropTypes.{type}(.isRequired)?
   *
   * Each and every declaration produces a function with the same signature. This
   * allows the creation of custom validation functions. For example:
   *
   *  var MyLink = React.createClass({
   *    propTypes: {
   *      // An optional string or URI prop named "href".
   *      href: function(props, propName, componentName) {
   *        var propValue = props[propName];
   *        if (propValue != null && typeof propValue !== 'string' &&
   *            !(propValue instanceof URI)) {
   *          return new Error(
   *            'Expected a string or an URI for ' + propName + ' in ' +
   *            componentName
   *          );
   *        }
   *      }
   *    },
   *    render: function() {...}
   *  });
   *
   * @internal
   */

  var ANONYMOUS = '<<anonymous>>';

  // Important!
  // Keep this list in sync with production version in \`./factoryWithThrowingShims.js\`.
  var ReactPropTypes = {
    array: createPrimitiveTypeChecker('array'),
    bool: createPrimitiveTypeChecker('boolean'),
    func: createPrimitiveTypeChecker('function'),
    number: createPrimitiveTypeChecker('number'),
    object: createPrimitiveTypeChecker('object'),
    string: createPrimitiveTypeChecker('string'),
    symbol: createPrimitiveTypeChecker('symbol'),

    any: createAnyTypeChecker(),
    arrayOf: createArrayOfTypeChecker,
    element: createElementTypeChecker(),
    elementType: createElementTypeTypeChecker(),
    instanceOf: createInstanceTypeChecker,
    node: createNodeChecker(),
    objectOf: createObjectOfTypeChecker,
    oneOf: createEnumTypeChecker,
    oneOfType: createUnionTypeChecker,
    shape: createShapeTypeChecker,
    exact: createStrictShapeTypeChecker,
  };

  /**
   * inlined Object.is polyfill to avoid requiring consumers ship their own
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
   */
  /*eslint-disable no-self-compare*/
  function is(x, y) {
    // SameValue algorithm
    if (x === y) {
      // Steps 1-5, 7-10
      // Steps 6.b-6.e: +0 != -0
      return x !== 0 || 1 / x === 1 / y;
    } else {
      // Step 6.a: NaN == NaN
      return x !== x && y !== y;
    }
  }
  /*eslint-enable no-self-compare*/

  /**
   * We use an Error-like object for backward compatibility as people may call
   * PropTypes directly and inspect their output. However, we don't use real
   * Errors anymore. We don't inspect their stack anyway, and creating them
   * is prohibitively expensive if they are created too often, such as what
   * happens in oneOfType() for any type before the one that matched.
   */
  function PropTypeError(message) {
    this.message = message;
    this.stack = '';
  }
  // Make \`instanceof Error\` still work for returned errors.
  PropTypeError.prototype = Error.prototype;

  function createChainableTypeChecker(validate) {
    if (true) {
      var manualPropTypeCallCache = {};
      var manualPropTypeWarningCount = 0;
    }
    function checkType(isRequired, props, propName, componentName, location, propFullName, secret) {
      componentName = componentName || ANONYMOUS;
      propFullName = propFullName || propName;

      if (secret !== ReactPropTypesSecret) {
        if (throwOnDirectAccess) {
          // New behavior only for users of \`prop-types\` package
          var err = new Error(
            'Calling PropTypes validators directly is not supported by the \`prop-types\` package. ' +
            'Use \`PropTypes.checkPropTypes()\` to call them. ' +
            'Read more at http://fb.me/use-check-prop-types'
          );
          err.name = 'Invariant Violation';
          throw err;
        } else if ( true && typeof console !== 'undefined') {
          // Old behavior for people using React.PropTypes
          var cacheKey = componentName + ':' + propName;
          if (
            !manualPropTypeCallCache[cacheKey] &&
            // Avoid spamming the console because they are often not actionable except for lib authors
            manualPropTypeWarningCount < 3
          ) {
            printWarning(
              'You are manually calling a React.PropTypes validation ' +
              'function for the \`' + propFullName + '\` prop on \`' + componentName  + '\`. This is deprecated ' +
              'and will throw in the standalone \`prop-types\` package. ' +
              'You may be seeing this warning due to a third-party PropTypes ' +
              'library. See https://fb.me/react-warning-dont-call-proptypes ' + 'for details.'
            );
            manualPropTypeCallCache[cacheKey] = true;
            manualPropTypeWarningCount++;
          }
        }
      }
      if (props[propName] == null) {
        if (isRequired) {
          if (props[propName] === null) {
            return new PropTypeError('The ' + location + ' \`' + propFullName + '\` is marked as required ' + ('in \`' + componentName + '\`, but its value is \`null\`.'));
          }
          return new PropTypeError('The ' + location + ' \`' + propFullName + '\` is marked as required in ' + ('\`' + componentName + '\`, but its value is \`undefined\`.'));
        }
        return null;
      } else {
        return validate(props, propName, componentName, location, propFullName);
      }
    }

    var chainedCheckType = checkType.bind(null, false);
    chainedCheckType.isRequired = checkType.bind(null, true);

    return chainedCheckType;
  }

  function createPrimitiveTypeChecker(expectedType) {
    function validate(props, propName, componentName, location, propFullName, secret) {
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== expectedType) {
        // \`propValue\` being instance of, say, date/regexp, pass the 'object'
        // check, but we can offer a more precise error message here rather than
        // 'of type \`object\`'.
        var preciseType = getPreciseType(propValue);

        return new PropTypeError('Invalid ' + location + ' \`' + propFullName + '\` of type ' + ('\`' + preciseType + '\` supplied to \`' + componentName + '\`, expected ') + ('\`' + expectedType + '\`.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createAnyTypeChecker() {
    return createChainableTypeChecker(emptyFunctionThatReturnsNull);
  }

  function createArrayOfTypeChecker(typeChecker) {
    function validate(props, propName, componentName, location, propFullName) {
      if (typeof typeChecker !== 'function') {
        return new PropTypeError('Property \`' + propFullName + '\` of component \`' + componentName + '\` has invalid PropType notation inside arrayOf.');
      }
      var propValue = props[propName];
      if (!Array.isArray(propValue)) {
        var propType = getPropType(propValue);
        return new PropTypeError('Invalid ' + location + ' \`' + propFullName + '\` of type ' + ('\`' + propType + '\` supplied to \`' + componentName + '\`, expected an array.'));
      }
      for (var i = 0; i < propValue.length; i++) {
        var error = typeChecker(propValue, i, componentName, location, propFullName + '[' + i + ']', ReactPropTypesSecret);
        if (error instanceof Error) {
          return error;
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createElementTypeChecker() {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      if (!isValidElement(propValue)) {
        var propType = getPropType(propValue);
        return new PropTypeError('Invalid ' + location + ' \`' + propFullName + '\` of type ' + ('\`' + propType + '\` supplied to \`' + componentName + '\`, expected a single ReactElement.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createElementTypeTypeChecker() {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      if (!ReactIs.isValidElementType(propValue)) {
        var propType = getPropType(propValue);
        return new PropTypeError('Invalid ' + location + ' \`' + propFullName + '\` of type ' + ('\`' + propType + '\` supplied to \`' + componentName + '\`, expected a single ReactElement type.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createInstanceTypeChecker(expectedClass) {
    function validate(props, propName, componentName, location, propFullName) {
      if (!(props[propName] instanceof expectedClass)) {
        var expectedClassName = expectedClass.name || ANONYMOUS;
        var actualClassName = getClassName(props[propName]);
        return new PropTypeError('Invalid ' + location + ' \`' + propFullName + '\` of type ' + ('\`' + actualClassName + '\` supplied to \`' + componentName + '\`, expected ') + ('instance of \`' + expectedClassName + '\`.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createEnumTypeChecker(expectedValues) {
    if (!Array.isArray(expectedValues)) {
      if (true) {
        if (arguments.length > 1) {
          printWarning(
            'Invalid arguments supplied to oneOf, expected an array, got ' + arguments.length + ' arguments. ' +
            'A common mistake is to write oneOf(x, y, z) instead of oneOf([x, y, z]).'
          );
        } else {
          printWarning('Invalid argument supplied to oneOf, expected an array.');
        }
      }
      return emptyFunctionThatReturnsNull;
    }

    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      for (var i = 0; i < expectedValues.length; i++) {
        if (is(propValue, expectedValues[i])) {
          return null;
        }
      }

      var valuesString = JSON.stringify(expectedValues, function replacer(key, value) {
        var type = getPreciseType(value);
        if (type === 'symbol') {
          return String(value);
        }
        return value;
      });
      return new PropTypeError('Invalid ' + location + ' \`' + propFullName + '\` of value \`' + String(propValue) + '\` ' + ('supplied to \`' + componentName + '\`, expected one of ' + valuesString + '.'));
    }
    return createChainableTypeChecker(validate);
  }

  function createObjectOfTypeChecker(typeChecker) {
    function validate(props, propName, componentName, location, propFullName) {
      if (typeof typeChecker !== 'function') {
        return new PropTypeError('Property \`' + propFullName + '\` of component \`' + componentName + '\` has invalid PropType notation inside objectOf.');
      }
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' \`' + propFullName + '\` of type ' + ('\`' + propType + '\` supplied to \`' + componentName + '\`, expected an object.'));
      }
      for (var key in propValue) {
        if (has(propValue, key)) {
          var error = typeChecker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
          if (error instanceof Error) {
            return error;
          }
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createUnionTypeChecker(arrayOfTypeCheckers) {
    if (!Array.isArray(arrayOfTypeCheckers)) {
       true ? printWarning('Invalid argument supplied to oneOfType, expected an instance of array.') : 0;
      return emptyFunctionThatReturnsNull;
    }

    for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
      var checker = arrayOfTypeCheckers[i];
      if (typeof checker !== 'function') {
        printWarning(
          'Invalid argument supplied to oneOfType. Expected an array of check functions, but ' +
          'received ' + getPostfixForTypeWarning(checker) + ' at index ' + i + '.'
        );
        return emptyFunctionThatReturnsNull;
      }
    }

    function validate(props, propName, componentName, location, propFullName) {
      for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
        var checker = arrayOfTypeCheckers[i];
        if (checker(props, propName, componentName, location, propFullName, ReactPropTypesSecret) == null) {
          return null;
        }
      }

      return new PropTypeError('Invalid ' + location + ' \`' + propFullName + '\` supplied to ' + ('\`' + componentName + '\`.'));
    }
    return createChainableTypeChecker(validate);
  }

  function createNodeChecker() {
    function validate(props, propName, componentName, location, propFullName) {
      if (!isNode(props[propName])) {
        return new PropTypeError('Invalid ' + location + ' \`' + propFullName + '\` supplied to ' + ('\`' + componentName + '\`, expected a ReactNode.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createShapeTypeChecker(shapeTypes) {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' \`' + propFullName + '\` of type \`' + propType + '\` ' + ('supplied to \`' + componentName + '\`, expected \`object\`.'));
      }
      for (var key in shapeTypes) {
        var checker = shapeTypes[key];
        if (!checker) {
          continue;
        }
        var error = checker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
        if (error) {
          return error;
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createStrictShapeTypeChecker(shapeTypes) {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' \`' + propFullName + '\` of type \`' + propType + '\` ' + ('supplied to \`' + componentName + '\`, expected \`object\`.'));
      }
      // We need to check all keys in case some are required but missing from
      // props.
      var allKeys = assign({}, props[propName], shapeTypes);
      for (var key in allKeys) {
        var checker = shapeTypes[key];
        if (!checker) {
          return new PropTypeError(
            'Invalid ' + location + ' \`' + propFullName + '\` key \`' + key + '\` supplied to \`' + componentName + '\`.' +
            '\\nBad object: ' + JSON.stringify(props[propName], null, '  ') +
            '\\nValid keys: ' +  JSON.stringify(Object.keys(shapeTypes), null, '  ')
          );
        }
        var error = checker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
        if (error) {
          return error;
        }
      }
      return null;
    }

    return createChainableTypeChecker(validate);
  }

  function isNode(propValue) {
    switch (typeof propValue) {
      case 'number':
      case 'string':
      case 'undefined':
        return true;
      case 'boolean':
        return !propValue;
      case 'object':
        if (Array.isArray(propValue)) {
          return propValue.every(isNode);
        }
        if (propValue === null || isValidElement(propValue)) {
          return true;
        }

        var iteratorFn = getIteratorFn(propValue);
        if (iteratorFn) {
          var iterator = iteratorFn.call(propValue);
          var step;
          if (iteratorFn !== propValue.entries) {
            while (!(step = iterator.next()).done) {
              if (!isNode(step.value)) {
                return false;
              }
            }
          } else {
            // Iterator will provide entry [k,v] tuples rather than values.
            while (!(step = iterator.next()).done) {
              var entry = step.value;
              if (entry) {
                if (!isNode(entry[1])) {
                  return false;
                }
              }
            }
          }
        } else {
          return false;
        }

        return true;
      default:
        return false;
    }
  }

  function isSymbol(propType, propValue) {
    // Native Symbol.
    if (propType === 'symbol') {
      return true;
    }

    // falsy value can't be a Symbol
    if (!propValue) {
      return false;
    }

    // 19.4.3.5 Symbol.prototype[@@toStringTag] === 'Symbol'
    if (propValue['@@toStringTag'] === 'Symbol') {
      return true;
    }

    // Fallback for non-spec compliant Symbols which are polyfilled.
    if (typeof Symbol === 'function' && propValue instanceof Symbol) {
      return true;
    }

    return false;
  }

  // Equivalent of \`typeof\` but with special handling for array and regexp.
  function getPropType(propValue) {
    var propType = typeof propValue;
    if (Array.isArray(propValue)) {
      return 'array';
    }
    if (propValue instanceof RegExp) {
      // Old webkits (at least until Android 4.0) return 'function' rather than
      // 'object' for typeof a RegExp. We'll normalize this here so that /bla/
      // passes PropTypes.object.
      return 'object';
    }
    if (isSymbol(propType, propValue)) {
      return 'symbol';
    }
    return propType;
  }

  // This handles more types than \`getPropType\`. Only used for error messages.
  // See \`createPrimitiveTypeChecker\`.
  function getPreciseType(propValue) {
    if (typeof propValue === 'undefined' || propValue === null) {
      return '' + propValue;
    }
    var propType = getPropType(propValue);
    if (propType === 'object') {
      if (propValue instanceof Date) {
        return 'date';
      } else if (propValue instanceof RegExp) {
        return 'regexp';
      }
    }
    return propType;
  }

  // Returns a string that is postfixed to a warning about an invalid type.
  // For example, "undefined" or "of type array"
  function getPostfixForTypeWarning(value) {
    var type = getPreciseType(value);
    switch (type) {
      case 'array':
      case 'object':
        return 'an ' + type;
      case 'boolean':
      case 'date':
      case 'regexp':
        return 'a ' + type;
      default:
        return type;
    }
  }

  // Returns class name of the object, if any.
  function getClassName(propValue) {
    if (!propValue.constructor || !propValue.constructor.name) {
      return ANONYMOUS;
    }
    return propValue.constructor.name;
  }

  ReactPropTypes.checkPropTypes = checkPropTypes;
  ReactPropTypes.resetWarningCache = checkPropTypes.resetWarningCache;
  ReactPropTypes.PropTypes = ReactPropTypes;

  return ReactPropTypes;
};


//# sourceURL=webpack://MathquillComponent/./node_modules/prop-types/factoryWithTypeCheckers.js?`);
              }
            ),
            /***/
            "./node_modules/prop-types/index.js": (
              /*!******************************************!*\
                !*** ./node_modules/prop-types/index.js ***!
                \******************************************/
              /***/
              (module, __unused_webpack_exports, __webpack_require__) => {
                eval(`/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

if (true) {
  var ReactIs = __webpack_require__(/*! react-is */ "./node_modules/react-is/index.js");

  // By explicitly using \`prop-types\` you are opting into new development behavior.
  // http://fb.me/prop-types-in-prod
  var throwOnDirectAccess = true;
  module.exports = __webpack_require__(/*! ./factoryWithTypeCheckers */ "./node_modules/prop-types/factoryWithTypeCheckers.js")(ReactIs.isElement, throwOnDirectAccess);
} else {}


//# sourceURL=webpack://MathquillComponent/./node_modules/prop-types/index.js?`);
              }
            ),
            /***/
            "./node_modules/prop-types/lib/ReactPropTypesSecret.js": (
              /*!*************************************************************!*\
                !*** ./node_modules/prop-types/lib/ReactPropTypesSecret.js ***!
                \*************************************************************/
              /***/
              (module) => {
                eval(`/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



var ReactPropTypesSecret = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';

module.exports = ReactPropTypesSecret;


//# sourceURL=webpack://MathquillComponent/./node_modules/prop-types/lib/ReactPropTypesSecret.js?`);
              }
            ),
            /***/
            "./node_modules/react-is/cjs/react-is.development.js": (
              /*!***********************************************************!*\
                !*** ./node_modules/react-is/cjs/react-is.development.js ***!
                \***********************************************************/
              /***/
              (__unused_webpack_module, exports) => {
                eval(`/** @license React v16.13.1
 * react-is.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */





if (true) {
  (function() {
'use strict';

// The Symbol used to tag the ReactElement-like types. If there is no native Symbol
// nor polyfill, then a plain number is used for performance.
var hasSymbol = typeof Symbol === 'function' && Symbol.for;
var REACT_ELEMENT_TYPE = hasSymbol ? Symbol.for('react.element') : 0xeac7;
var REACT_PORTAL_TYPE = hasSymbol ? Symbol.for('react.portal') : 0xeaca;
var REACT_FRAGMENT_TYPE = hasSymbol ? Symbol.for('react.fragment') : 0xeacb;
var REACT_STRICT_MODE_TYPE = hasSymbol ? Symbol.for('react.strict_mode') : 0xeacc;
var REACT_PROFILER_TYPE = hasSymbol ? Symbol.for('react.profiler') : 0xead2;
var REACT_PROVIDER_TYPE = hasSymbol ? Symbol.for('react.provider') : 0xeacd;
var REACT_CONTEXT_TYPE = hasSymbol ? Symbol.for('react.context') : 0xeace; // TODO: We don't use AsyncMode or ConcurrentMode anymore. They were temporary
// (unstable) APIs that have been removed. Can we remove the symbols?

var REACT_ASYNC_MODE_TYPE = hasSymbol ? Symbol.for('react.async_mode') : 0xeacf;
var REACT_CONCURRENT_MODE_TYPE = hasSymbol ? Symbol.for('react.concurrent_mode') : 0xeacf;
var REACT_FORWARD_REF_TYPE = hasSymbol ? Symbol.for('react.forward_ref') : 0xead0;
var REACT_SUSPENSE_TYPE = hasSymbol ? Symbol.for('react.suspense') : 0xead1;
var REACT_SUSPENSE_LIST_TYPE = hasSymbol ? Symbol.for('react.suspense_list') : 0xead8;
var REACT_MEMO_TYPE = hasSymbol ? Symbol.for('react.memo') : 0xead3;
var REACT_LAZY_TYPE = hasSymbol ? Symbol.for('react.lazy') : 0xead4;
var REACT_BLOCK_TYPE = hasSymbol ? Symbol.for('react.block') : 0xead9;
var REACT_FUNDAMENTAL_TYPE = hasSymbol ? Symbol.for('react.fundamental') : 0xead5;
var REACT_RESPONDER_TYPE = hasSymbol ? Symbol.for('react.responder') : 0xead6;
var REACT_SCOPE_TYPE = hasSymbol ? Symbol.for('react.scope') : 0xead7;

function isValidElementType(type) {
  return typeof type === 'string' || typeof type === 'function' || // Note: its typeof might be other than 'symbol' or 'number' if it's a polyfill.
  type === REACT_FRAGMENT_TYPE || type === REACT_CONCURRENT_MODE_TYPE || type === REACT_PROFILER_TYPE || type === REACT_STRICT_MODE_TYPE || type === REACT_SUSPENSE_TYPE || type === REACT_SUSPENSE_LIST_TYPE || typeof type === 'object' && type !== null && (type.$$typeof === REACT_LAZY_TYPE || type.$$typeof === REACT_MEMO_TYPE || type.$$typeof === REACT_PROVIDER_TYPE || type.$$typeof === REACT_CONTEXT_TYPE || type.$$typeof === REACT_FORWARD_REF_TYPE || type.$$typeof === REACT_FUNDAMENTAL_TYPE || type.$$typeof === REACT_RESPONDER_TYPE || type.$$typeof === REACT_SCOPE_TYPE || type.$$typeof === REACT_BLOCK_TYPE);
}

function typeOf(object) {
  if (typeof object === 'object' && object !== null) {
    var $$typeof = object.$$typeof;

    switch ($$typeof) {
      case REACT_ELEMENT_TYPE:
        var type = object.type;

        switch (type) {
          case REACT_ASYNC_MODE_TYPE:
          case REACT_CONCURRENT_MODE_TYPE:
          case REACT_FRAGMENT_TYPE:
          case REACT_PROFILER_TYPE:
          case REACT_STRICT_MODE_TYPE:
          case REACT_SUSPENSE_TYPE:
            return type;

          default:
            var $$typeofType = type && type.$$typeof;

            switch ($$typeofType) {
              case REACT_CONTEXT_TYPE:
              case REACT_FORWARD_REF_TYPE:
              case REACT_LAZY_TYPE:
              case REACT_MEMO_TYPE:
              case REACT_PROVIDER_TYPE:
                return $$typeofType;

              default:
                return $$typeof;
            }

        }

      case REACT_PORTAL_TYPE:
        return $$typeof;
    }
  }

  return undefined;
} // AsyncMode is deprecated along with isAsyncMode

var AsyncMode = REACT_ASYNC_MODE_TYPE;
var ConcurrentMode = REACT_CONCURRENT_MODE_TYPE;
var ContextConsumer = REACT_CONTEXT_TYPE;
var ContextProvider = REACT_PROVIDER_TYPE;
var Element = REACT_ELEMENT_TYPE;
var ForwardRef = REACT_FORWARD_REF_TYPE;
var Fragment = REACT_FRAGMENT_TYPE;
var Lazy = REACT_LAZY_TYPE;
var Memo = REACT_MEMO_TYPE;
var Portal = REACT_PORTAL_TYPE;
var Profiler = REACT_PROFILER_TYPE;
var StrictMode = REACT_STRICT_MODE_TYPE;
var Suspense = REACT_SUSPENSE_TYPE;
var hasWarnedAboutDeprecatedIsAsyncMode = false; // AsyncMode should be deprecated

function isAsyncMode(object) {
  {
    if (!hasWarnedAboutDeprecatedIsAsyncMode) {
      hasWarnedAboutDeprecatedIsAsyncMode = true; // Using console['warn'] to evade Babel and ESLint

      console['warn']('The ReactIs.isAsyncMode() alias has been deprecated, ' + 'and will be removed in React 17+. Update your code to use ' + 'ReactIs.isConcurrentMode() instead. It has the exact same API.');
    }
  }

  return isConcurrentMode(object) || typeOf(object) === REACT_ASYNC_MODE_TYPE;
}
function isConcurrentMode(object) {
  return typeOf(object) === REACT_CONCURRENT_MODE_TYPE;
}
function isContextConsumer(object) {
  return typeOf(object) === REACT_CONTEXT_TYPE;
}
function isContextProvider(object) {
  return typeOf(object) === REACT_PROVIDER_TYPE;
}
function isElement(object) {
  return typeof object === 'object' && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
}
function isForwardRef(object) {
  return typeOf(object) === REACT_FORWARD_REF_TYPE;
}
function isFragment(object) {
  return typeOf(object) === REACT_FRAGMENT_TYPE;
}
function isLazy(object) {
  return typeOf(object) === REACT_LAZY_TYPE;
}
function isMemo(object) {
  return typeOf(object) === REACT_MEMO_TYPE;
}
function isPortal(object) {
  return typeOf(object) === REACT_PORTAL_TYPE;
}
function isProfiler(object) {
  return typeOf(object) === REACT_PROFILER_TYPE;
}
function isStrictMode(object) {
  return typeOf(object) === REACT_STRICT_MODE_TYPE;
}
function isSuspense(object) {
  return typeOf(object) === REACT_SUSPENSE_TYPE;
}

exports.AsyncMode = AsyncMode;
exports.ConcurrentMode = ConcurrentMode;
exports.ContextConsumer = ContextConsumer;
exports.ContextProvider = ContextProvider;
exports.Element = Element;
exports.ForwardRef = ForwardRef;
exports.Fragment = Fragment;
exports.Lazy = Lazy;
exports.Memo = Memo;
exports.Portal = Portal;
exports.Profiler = Profiler;
exports.StrictMode = StrictMode;
exports.Suspense = Suspense;
exports.isAsyncMode = isAsyncMode;
exports.isConcurrentMode = isConcurrentMode;
exports.isContextConsumer = isContextConsumer;
exports.isContextProvider = isContextProvider;
exports.isElement = isElement;
exports.isForwardRef = isForwardRef;
exports.isFragment = isFragment;
exports.isLazy = isLazy;
exports.isMemo = isMemo;
exports.isPortal = isPortal;
exports.isProfiler = isProfiler;
exports.isStrictMode = isStrictMode;
exports.isSuspense = isSuspense;
exports.isValidElementType = isValidElementType;
exports.typeOf = typeOf;
  })();
}


//# sourceURL=webpack://MathquillComponent/./node_modules/react-is/cjs/react-is.development.js?`);
              }
            ),
            /***/
            "./node_modules/react-is/index.js": (
              /*!****************************************!*\
                !*** ./node_modules/react-is/index.js ***!
                \****************************************/
              /***/
              (module, __unused_webpack_exports, __webpack_require__) => {
                eval(`

if (false) {} else {
  module.exports = __webpack_require__(/*! ./cjs/react-is.development.js */ "./node_modules/react-is/cjs/react-is.development.js");
}


//# sourceURL=webpack://MathquillComponent/./node_modules/react-is/index.js?`);
              }
            ),
            /***/
            react: (
              /*!************************!*\
                !*** external "react" ***!
                \************************/
              /***/
              (Ot) => {
                Ot.exports = __WEBPACK_EXTERNAL_MODULE_react__;
              }
            )
            /******/
          }, __webpack_module_cache__ = {};
          function __webpack_require__(Ot) {
            var ae = __webpack_module_cache__[Ot];
            if (ae !== void 0)
              return ae.exports;
            var se = __webpack_module_cache__[Ot] = {
              /******/
              id: Ot,
              /******/
              // no module.loaded needed
              /******/
              exports: {}
              /******/
            };
            return __webpack_modules__[Ot].call(se.exports, se, se.exports, __webpack_require__), se.exports;
          }
          __webpack_require__.n = (Ot) => {
            var ae = Ot && Ot.__esModule ? (
              /******/
              () => Ot.default
            ) : (
              /******/
              () => Ot
            );
            return __webpack_require__.d(ae, { a: ae }), ae;
          }, __webpack_require__.d = (Ot, ae) => {
            for (var se in ae)
              __webpack_require__.o(ae, se) && !__webpack_require__.o(Ot, se) && Object.defineProperty(Ot, se, { enumerable: !0, get: ae[se] });
          }, __webpack_require__.o = (Ot, ae) => Object.prototype.hasOwnProperty.call(Ot, ae), __webpack_require__.r = (Ot) => {
            typeof Symbol < "u" && Symbol.toStringTag && Object.defineProperty(Ot, Symbol.toStringTag, { value: "Module" }), Object.defineProperty(Ot, "__esModule", { value: !0 });
          };
          var __webpack_exports__ = __webpack_require__("./src/index.js");
          return __webpack_exports__;
        })()
      );
    });
  }(reactMathquill)), reactMathquill.exports;
}
browser$1.env.NODE_ENV === "production" ? reactMathquill$1.exports = requireReactMathquill_min() : reactMathquill$1.exports = requireReactMathquill();
var reactMathquillExports = reactMathquill$1.exports;
const mathquill = /* @__PURE__ */ getDefaultExportFromCjs(reactMathquillExports);
export {
  mathquill as m,
  reactMathquillExports as r
};
