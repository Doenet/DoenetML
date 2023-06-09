import { u as useDoenetRenderer, j as jsxRuntimeExports, V as VisibilitySensor, C as Context, k as cesc } from "./index-64c78e6b.js";
import React__default, { useState, useRef, useEffect, createContext } from "react";
import { s as sizeToCSS } from "./css-ab4d83ca.js";
import "react-dom";
import "styled-components";
var __webpack_modules__ = { 351: (d, M, x) => {
  x.d(M, { Z: () => N });
  var a, j = x(765), k = "1.5.1-dev";
  a = { version: k, licenseText: "JSXGraph v" + k + " Copyright (C) see https://jsxgraph.org", COORDS_BY_USER: 1, COORDS_BY_SCREEN: 2, OBJECT_TYPE_ARC: 1, OBJECT_TYPE_ARROW: 2, OBJECT_TYPE_AXIS: 3, OBJECT_TYPE_AXISPOINT: 4, OBJECT_TYPE_TICKS: 5, OBJECT_TYPE_CIRCLE: 6, OBJECT_TYPE_CONIC: 7, OBJECT_TYPE_CURVE: 8, OBJECT_TYPE_GLIDER: 9, OBJECT_TYPE_IMAGE: 10, OBJECT_TYPE_LINE: 11, OBJECT_TYPE_POINT: 12, OBJECT_TYPE_SLIDER: 13, OBJECT_TYPE_CAS: 14, OBJECT_TYPE_GXTCAS: 15, OBJECT_TYPE_POLYGON: 16, OBJECT_TYPE_SECTOR: 17, OBJECT_TYPE_TEXT: 18, OBJECT_TYPE_ANGLE: 19, OBJECT_TYPE_INTERSECTION: 20, OBJECT_TYPE_TURTLE: 21, OBJECT_TYPE_VECTOR: 22, OBJECT_TYPE_OPROJECT: 23, OBJECT_TYPE_GRID: 24, OBJECT_TYPE_TANGENT: 25, OBJECT_TYPE_HTMLSLIDER: 26, OBJECT_TYPE_CHECKBOX: 27, OBJECT_TYPE_INPUT: 28, OBJECT_TYPE_BUTTON: 29, OBJECT_TYPE_TRANSFORMATION: 30, OBJECT_TYPE_FOREIGNOBJECT: 31, OBJECT_TYPE_VIEW3D: 32, OBJECT_TYPE_POINT3D: 33, OBJECT_TYPE_LINE3D: 34, OBJECT_TYPE_PLANE3D: 35, OBJECT_TYPE_CURVE3D: 36, OBJECT_TYPE_SURFACE3D: 37, OBJECT_CLASS_POINT: 1, OBJECT_CLASS_LINE: 2, OBJECT_CLASS_CIRCLE: 3, OBJECT_CLASS_CURVE: 4, OBJECT_CLASS_AREA: 5, OBJECT_CLASS_OTHER: 6, OBJECT_CLASS_TEXT: 7, OBJECT_CLASS_3D: 8, GENTYPE_ABC: 1, GENTYPE_AXIS: 2, GENTYPE_MID: 3, GENTYPE_REFLECTION: 4, GENTYPE_MIRRORELEMENT: 5, GENTYPE_REFLECTION_ON_LINE: 4, GENTYPE_REFLECTION_ON_POINT: 5, GENTYPE_TANGENT: 6, GENTYPE_PARALLEL: 7, GENTYPE_BISECTORLINES: 8, GENTYPE_BOARDIMG: 9, GENTYPE_BISECTOR: 10, GENTYPE_NORMAL: 11, GENTYPE_POINT: 12, GENTYPE_GLIDER: 13, GENTYPE_INTERSECTION: 14, GENTYPE_CIRCLE: 15, GENTYPE_CIRCLE2POINTS: 16, GENTYPE_LINE: 17, GENTYPE_TRIANGLE: 18, GENTYPE_QUADRILATERAL: 19, GENTYPE_TEXT: 20, GENTYPE_POLYGON: 21, GENTYPE_REGULARPOLYGON: 22, GENTYPE_SECTOR: 23, GENTYPE_ANGLE: 24, GENTYPE_PLOT: 25, GENTYPE_SLIDER: 26, GENTYPE_TRUNCATE: 27, GENTYPE_JCODE: 28, GENTYPE_MOVEMENT: 29, GENTYPE_COMBINED: 30, GENTYPE_RULER: 31, GENTYPE_SLOPETRIANGLE: 32, GENTYPE_PERPSEGMENT: 33, GENTYPE_LABELMOVEMENT: 34, GENTYPE_VECTOR: 35, GENTYPE_NONREFLEXANGLE: 36, GENTYPE_REFLEXANGLE: 37, GENTYPE_PATH: 38, GENTYPE_DERIVATIVE: 39, GENTYPE_DELETE: 41, GENTYPE_COPY: 42, GENTYPE_MIRROR: 43, GENTYPE_ROTATE: 44, GENTYPE_ABLATION: 45, GENTYPE_MIGRATE: 46, GENTYPE_VECTORCOPY: 47, GENTYPE_POLYGONCOPY: 48, GENTYPE_CTX_TYPE_G: 51, GENTYPE_CTX_TYPE_P: 52, GENTYPE_CTX_TRACE: 53, GENTYPE_CTX_VISIBILITY: 54, GENTYPE_CTX_CCVISIBILITY: 55, GENTYPE_CTX_MPVISIBILITY: 56, GENTYPE_CTX_WITHLABEL: 57, GENTYPE_CTX_LABEL: 58, GENTYPE_CTX_FIXED: 59, GENTYPE_CTX_STROKEWIDTH: 60, GENTYPE_CTX_LABELSIZE: 61, GENTYPE_CTX_SIZE: 62, GENTYPE_CTX_FACE: 63, GENTYPE_CTX_STRAIGHT: 64, GENTYPE_CTX_ARROW: 65, GENTYPE_CTX_COLOR: 66, GENTYPE_CTX_RADIUS: 67, GENTYPE_CTX_COORDS: 68, GENTYPE_CTX_TEXT: 69, GENTYPE_CTX_ANGLERADIUS: 70, GENTYPE_CTX_DOTVISIBILITY: 71, GENTYPE_CTX_FILLOPACITY: 72, GENTYPE_CTX_PLOT: 73, GENTYPE_CTX_SCALE: 74, GENTYPE_CTX_INTVAL: 75, GENTYPE_CTX_POINT1: 76, GENTYPE_CTX_POINT2: 77, GENTYPE_CTX_LABELSTICKY: 78, GENTYPE_CTX_TYPE_I: 79, GENTYPE_CTX_HASINNERPOINTS: 80, GENTYPE_CTX_SNAPWIDTH: 81, GENTYPE_CTX_SNAPTOGRID: 82 }, j.Z.extendConstants(j.Z, a);
  const N = a;
}, 705: (d, M, x) => {
  x.d(M, { Z: () => E });
  var a = x(765), j = x(351), k = x(88), N = x(109), A = x(275);
  a.Z.Coords = function(c, b, m, _) {
    this.board = m, this.usrCoords = [], this.scrCoords = [], this.emitter = !N.Z.exists(_) || _, this.emitter && k.Z.eventify(this), this.setCoordinates(c, b, !1, !0);
  }, a.Z.extend(a.Z.Coords.prototype, { normalizeUsrCoords: function() {
    Math.abs(this.usrCoords[0]) > A.Z.eps && (this.usrCoords[1] /= this.usrCoords[0], this.usrCoords[2] /= this.usrCoords[0], this.usrCoords[0] = 1);
  }, usr2screen: function(c) {
    var b = Math.round, m = this.board, _ = this.usrCoords, f = m.origin.scrCoords;
    c === !0 ? (this.scrCoords[0] = b(_[0]), this.scrCoords[1] = b(_[0] * f[1] + _[1] * m.unitX), this.scrCoords[2] = b(_[0] * f[2] - _[2] * m.unitY)) : (this.scrCoords[0] = _[0], this.scrCoords[1] = _[0] * f[1] + _[1] * m.unitX, this.scrCoords[2] = _[0] * f[2] - _[2] * m.unitY);
  }, screen2usr: function() {
    var c = this.board.origin.scrCoords, b = this.scrCoords, m = this.board;
    this.usrCoords[0] = 1, this.usrCoords[1] = (b[1] - c[1]) / m.unitX, this.usrCoords[2] = (c[2] - b[2]) / m.unitY;
  }, distance: function(c, b) {
    var m, _, f = 0, g = this.usrCoords, C = this.scrCoords;
    if (c === j.Z.COORDS_BY_USER) {
      if (m = b.usrCoords, (f = (_ = g[0] - m[0]) * _) > A.Z.eps * A.Z.eps)
        return Number.POSITIVE_INFINITY;
      f += (_ = g[1] - m[1]) * _, f += (_ = g[2] - m[2]) * _;
    } else
      m = b.scrCoords, f += (_ = C[1] - m[1]) * _, f += (_ = C[2] - m[2]) * _;
    return Math.sqrt(f);
  }, setCoordinates: function(c, b, m, _) {
    var f = this.usrCoords, g = this.scrCoords, C = [f[0], f[1], f[2]], P = [g[0], g[1], g[2]];
    return c === j.Z.COORDS_BY_USER ? (b.length === 2 ? (f[0] = 1, f[1] = b[0], f[2] = b[1]) : (f[0] = b[0], f[1] = b[1], f[2] = b[2], this.normalizeUsrCoords()), this.usr2screen(m)) : (b.length === 2 ? (g[1] = b[0], g[2] = b[1]) : (g[1] = b[1], g[2] = b[2]), this.screen2usr()), !this.emitter || _ || P[1] === g[1] && P[2] === g[2] || this.triggerEventHandlers(["update"], [C, P]), this;
  }, copy: function(c, b) {
    return b === void 0 && (b = 0), this[c].slice(b);
  }, isReal: function() {
    return !isNaN(this.usrCoords[1] + this.usrCoords[2]) && Math.abs(this.usrCoords[0]) > A.Z.eps;
  }, __evt__update: function(c, b) {
  }, __evt: function() {
  } });
  const E = a.Z.Coords;
}, 218: (d, M, x) => {
  x.d(M, { Z: () => m });
  var a = x(765), j = x(275), k = x(922), N = x(336), A = x(309), E = x(705), c = x(351), b = x(109);
  a.Z.CoordsElement = function(_, f) {
    var g;
    for (b.Z.exists(_) || (_ = [1, 0, 0]), g = 0; g < _.length; ++g)
      _[g] = parseFloat(_[g]);
    this.coords = new E.Z(c.Z.COORDS_BY_USER, _, this.board), this.initialCoords = new E.Z(c.Z.COORDS_BY_USER, _, this.board), this.position = null, this.isConstrained = !1, this.onPolygon = !1, this.slideObject = null, this.slideObjects = [], this.needsUpdateFromParent = !0, this.groups = [], this.Xjc = null, this.Yjc = null, this.methodMap = b.Z.deepCopy(this.methodMap, { move: "moveTo", moveTo: "moveTo", moveAlong: "moveAlong", visit: "visit", glide: "makeGlider", makeGlider: "makeGlider", intersect: "makeIntersection", makeIntersection: "makeIntersection", X: "X", Y: "Y", free: "free", setPosition: "setGliderPosition", setGliderPosition: "setGliderPosition", addConstraint: "addConstraint", dist: "Dist", onPolygon: "onPolygon" }), b.Z.exists(this.element) && this.addAnchor(_, f), this.isDraggable = !0;
  }, a.Z.extend(a.Z.CoordsElement.prototype, { updateConstraint: function() {
    return this;
  }, updateCoords: function(_) {
    return this.needsUpdate ? (b.Z.exists(_) || (_ = !1), b.Z.evaluate(this.visProp.frozen) || this.updateConstraint(), this.type === c.Z.OBJECT_TYPE_GLIDER && (this.isConstrained && (_ = !1), _ ? this.updateGliderFromParent() : this.updateGlider()), this.updateTransform(_), this) : this;
  }, updateGlider: function() {
    var _, f, g, C, P, w, T, D, I, Y, U, J, z, V, $, ne, Q, K, te, se = 2 * Math.PI, de = !1, ae = this.slideObject, ce = [];
    if (this.needsUpdateFromParent = !1, ae.elementClass === c.Z.OBJECT_CLASS_CIRCLE)
      b.Z.evaluate(this.visProp.isgeonext) && (se = 1), V = k.Z.projectPointToCircle(this, ae, this.board), $ = k.Z.rad([ae.center.X() + 1, ae.center.Y()], ae.center, this) / se;
    else if (ae.elementClass === c.Z.OBJECT_CLASS_LINE) {
      if (this.onPolygon) {
        if (f = ae.point1.coords.usrCoords, C = (g = ae.point2.coords.usrCoords)[_ = 1] - f[_], Math.abs(C) < j.Z.eps && (C = g[_ = 2] - f[_]), T = (k.Z.projectPointToLine(this, ae, this.board).usrCoords[_] - f[_]) / C, w = ae.parentPolygon, T < 0) {
          for (_ = 0; _ < w.borders.length; _++)
            if (ae === w.borders[_]) {
              ae = w.borders[(_ - 1 + w.borders.length) % w.borders.length];
              break;
            }
        } else if (T > 1) {
          for (_ = 0; _ < w.borders.length; _++)
            if (ae === w.borders[_]) {
              ae = w.borders[(_ + 1 + w.borders.length) % w.borders.length];
              break;
            }
        }
        ae.id !== this.slideObject.id && (this.slideObject = ae);
      }
      f = ae.point1.coords, g = ae.point2.coords, (C = f.distance(c.Z.COORDS_BY_USER, g)) < j.Z.eps ? (V = f, de = !0, $ = 0) : (V = k.Z.projectPointToLine(this, ae, this.board), f = f.usrCoords.slice(0), g = g.usrCoords.slice(0), Math.abs(g[0]) < j.Z.eps ? (C = g[_ = 1], Math.abs(C) < j.Z.eps && (C = g[_ = 2]), $ = ((C = (V.usrCoords[_] - f[_]) / C) >= 0 ? 1 : -1) * (C = Math.abs(C)) / (C + 1)) : Math.abs(f[0]) < j.Z.eps ? (C = f[_ = 1], Math.abs(C) < j.Z.eps && (C = f[_ = 2]), $ = (C = (V.usrCoords[_] - g[_]) / C) < 0 ? (1 - 2 * C) / (1 - C) : 1 / (C + 1)) : (C = g[_ = 1] - f[_], Math.abs(C) < j.Z.eps && (C = g[_ = 2] - f[_]), $ = (V.usrCoords[_] - f[_]) / C)), ne = b.Z.evaluate(this.visProp.snapwidth), b.Z.evaluate(ne) > 0 && Math.abs(this._smax - this._smin) >= j.Z.eps && (P = ($ = Math.max(Math.min($, 1), 0)) * (this._smax - this._smin) + this._smin, $ = ((P = Math.round(P / ne) * ne) - this._smin) / (this._smax - this._smin), this.update(!0)), f = ae.point1.coords, !b.Z.evaluate(ae.visProp.straightfirst) && Math.abs(f.usrCoords[0]) > j.Z.eps && $ < 0 && (V = f, de = !0, $ = 0), g = ae.point2.coords, !b.Z.evaluate(ae.visProp.straightlast) && Math.abs(g.usrCoords[0]) > j.Z.eps && $ > 1 && (V = g, de = !0, $ = 1);
    } else if (ae.type === c.Z.OBJECT_TYPE_TURTLE)
      this.updateConstraint(), V = (Q = k.Z.projectPointToTurtle(this, ae, this.board))[0], $ = Q[1];
    else if (ae.elementClass === c.Z.OBJECT_CLASS_CURVE)
      if (ae.type === c.Z.OBJECT_TYPE_ARC || ae.type === c.Z.OBJECT_TYPE_SECTOR)
        V = k.Z.projectPointToCircle(this, ae, this.board), Y = k.Z.rad(ae.radiuspoint, ae.center, this), D = 0, I = k.Z.rad(ae.radiuspoint, ae.center, ae.anglepoint), $ = Y, ((ne = b.Z.evaluate(ae.visProp.selection)) === "minor" && I > Math.PI || ne === "major" && I < Math.PI) && (D = I, I = 2 * Math.PI), (Y < D || Y > I) && ($ = I, (Y < D && Y > 0.5 * D || Y > I && Y > 0.5 * I + Math.PI) && ($ = D), this.needsUpdateFromParent = !0, this.updateGliderFromParent()), se = I - D, this.visProp.isgeonext && (se = 1), Math.abs(se) > j.Z.eps && ($ /= se);
      else if (this.updateConstraint(), ae.transformations.length > 0) {
        for (te = !1, (Q = ae.getTransformationSource())[0] && (te = Q[0], ce.push(ae), ce.push(Q[1])); Q[0] && b.Z.exists(Q[1]._transformationSource); )
          Q = Q[1].getTransformationSource(), ce.push(Q[1]);
        if (K = this.coords.usrCoords, te) {
          for (_ = 0; _ < ce.length; _++)
            ce[_].updateTransformMatrix(), z = j.Z.inverse(ce[_].transformMat), K = j.Z.matVecMult(z, K);
          for (U = new E.Z(c.Z.COORDS_BY_USER, K, this.board).usrCoords, K = (J = k.Z.projectCoordsToCurve(U[1], U[2], this.position || 0, ce[ce.length - 1], this.board))[0].usrCoords, _ = ce.length - 2; _ >= 0; _--)
            K = j.Z.matVecMult(ce[_].transformMat, K);
          J[0] = new E.Z(c.Z.COORDS_BY_USER, K, this.board);
        } else
          ae.updateTransformMatrix(), z = j.Z.inverse(ae.transformMat), K = j.Z.matVecMult(z, K), U = new E.Z(c.Z.COORDS_BY_USER, K, this.board).usrCoords, J = k.Z.projectCoordsToCurve(U[1], U[2], this.position || 0, ae, this.board);
        V = J[0], $ = J[1];
      } else
        V = (Q = k.Z.projectPointToCurve(this, ae, this.board))[0], $ = Q[1];
    else
      b.Z.isPoint(ae) && (V = k.Z.projectPointToPoint(this, ae, this.board), $ = this.position);
    this.coords.setCoordinates(c.Z.COORDS_BY_USER, V.usrCoords, de), this.position = $;
  }, updateGliderFromParent: function() {
    var _, f, g, C, P, w, T, D, I, Y, U, J, z = this.slideObject, V = [], $ = 2 * Math.PI;
    if (this.needsUpdateFromParent) {
      if (z.elementClass === c.Z.OBJECT_CLASS_CIRCLE)
        g = z.Radius(), b.Z.evaluate(this.visProp.isgeonext) && ($ = 1), P = [z.center.X() + g * Math.cos(this.position * $), z.center.Y() + g * Math.sin(this.position * $)];
      else if (z.elementClass === c.Z.OBJECT_CLASS_LINE)
        _ = z.point1.coords.usrCoords, f = z.point2.coords.usrCoords, _[0] === 0 && _[1] === 0 && _[2] === 0 || f[0] === 0 && f[1] === 0 && f[2] === 0 ? P = [0, 0, 0] : Math.abs(f[0]) < j.Z.eps ? (C = Math.min(Math.abs(this.position), 1 - j.Z.eps), C /= 1 - C, this.position < 0 && (C = -C), P = [_[0] + C * f[0], _[1] + C * f[1], _[2] + C * f[2]]) : Math.abs(_[0]) < j.Z.eps ? (C = Math.max(this.position, j.Z.eps), C = (C = Math.min(C, 2 - j.Z.eps)) > 1 ? (C - 1) / (C - 2) : (1 - C) / C, P = [f[0] + C * _[0], f[1] + C * _[1], f[2] + C * _[2]]) : (C = this.position, P = [_[0] + C * (f[0] - _[0]), _[1] + C * (f[1] - _[1]), _[2] + C * (f[2] - _[2])]);
      else if (z.type === c.Z.OBJECT_TYPE_TURTLE)
        this.coords.setCoordinates(c.Z.COORDS_BY_USER, [z.Z(this.position), z.X(this.position), z.Y(this.position)]), this.updateConstraint(), P = k.Z.projectPointToTurtle(this, z, this.board)[0].usrCoords;
      else if (z.elementClass === c.Z.OBJECT_CLASS_CURVE) {
        for (D = !1, (w = z.getTransformationSource())[0] && (D = w[0], V.push(z), V.push(w[1])); w[0] && b.Z.exists(w[1]._transformationSource); )
          w = w[1].getTransformationSource(), V.push(w[1]);
        if (D ? this.coords.setCoordinates(c.Z.COORDS_BY_USER, [V[V.length - 1].Z(this.position), V[V.length - 1].X(this.position), V[V.length - 1].Y(this.position)]) : this.coords.setCoordinates(c.Z.COORDS_BY_USER, [z.Z(this.position), z.X(this.position), z.Y(this.position)]), z.type === c.Z.OBJECT_TYPE_ARC || z.type === c.Z.OBJECT_TYPE_SECTOR)
          I = k.Z.rad([z.center.X() + 1, z.center.Y()], z.center, z.radiuspoint), Y = 0, J = k.Z.rad(z.radiuspoint, z.center, z.anglepoint), (z.visProp.selection === "minor" && J > Math.PI || z.visProp.selection === "major" && J < Math.PI) && (Y = J, J = 2 * Math.PI), $ = J - Y, b.Z.evaluate(this.visProp.isgeonext) && ($ = 1), ((U = this.position * $) < Y || U > J) && (((U = J) < Y && U > 0.5 * Y || U > J && U > 0.5 * J + Math.PI) && (U = Y), this.position = U, Math.abs($) > j.Z.eps && (this.position /= $)), g = z.Radius(), P = [z.center.X() + g * Math.cos(this.position * $ + I), z.center.Y() + g * Math.sin(this.position * $ + I)];
        else if (this.updateConstraint(), D)
          for (P = k.Z.projectPointToCurve(this, V[V.length - 1], this.board)[0].usrCoords, T = V.length - 2; T >= 0; T--)
            P = new E.Z(c.Z.COORDS_BY_USER, j.Z.matVecMult(V[T].transformMat, P), this.board).usrCoords;
        else
          P = k.Z.projectPointToCurve(this, z, this.board)[0].usrCoords;
      } else
        b.Z.isPoint(z) && (P = k.Z.projectPointToPoint(this, z, this.board).usrCoords);
      this.coords.setCoordinates(c.Z.COORDS_BY_USER, P, !1);
    } else
      this.needsUpdateFromParent = !0;
  }, updateRendererGeneric: function(_) {
    return this.needsUpdate && this.board.renderer ? (this.visPropCalc.visible && (this.isReal = !isNaN(this.coords.usrCoords[1] + this.coords.usrCoords[2]), this.isReal = Math.abs(this.coords.usrCoords[0]) > j.Z.eps && this.isReal, this.isReal || this.updateVisibility(!1)), this.visPropCalc.visible && this.board.renderer[_](this), this.hasLabel && this.visPropCalc.visible && this.label && this.label.visPropCalc.visible && this.isReal && (this.label.update(), this.board.renderer.updateText(this.label)), this.setDisplayRendNode(), this.needsUpdate = !1, this) : this;
  }, X: function() {
    return this.coords.usrCoords[1];
  }, Y: function() {
    return this.coords.usrCoords[2];
  }, Z: function() {
    return this.coords.usrCoords[0];
  }, XEval: function() {
    return this.coords.usrCoords[1];
  }, YEval: function() {
    return this.coords.usrCoords[2];
  }, ZEval: function() {
    return this.coords.usrCoords[0];
  }, Dist: function(_) {
    return this.isReal && _.isReal ? this.coords.distance(c.Z.COORDS_BY_USER, _.coords) : NaN;
  }, snapToGrid: function(_) {
    return this.handleSnapToGrid(_);
  }, handleSnapToPoints: function(_) {
    var f, g, C, P, w, T, D, I, Y = 0, U = 1 / 0, J = null, z = b.Z.evaluate(this.visProp.ignoredsnaptopoints), V = !1;
    if (P = this.board.objectsList.length, z && (D = z.length), b.Z.evaluate(this.visProp.snaptopoints) || _) {
      for (w = b.Z.evaluate(this.visProp.attractorunit), T = b.Z.evaluate(this.visProp.attractordistance), f = 0; f < P; f++) {
        if (g = this.board.objectsList[f], z) {
          for (V = !1, I = 0; I < D; I++)
            if (g === this.board.select(z[I])) {
              V = !0;
              break;
            }
          if (V)
            continue;
        }
        b.Z.isPoint(g) && g !== this && g.visPropCalc.visible && (C = k.Z.projectPointToPoint(this, g, this.board), (Y = w === "screen" ? C.distance(c.Z.COORDS_BY_SCREEN, this.coords) : C.distance(c.Z.COORDS_BY_USER, this.coords)) < T && Y < U && (U = Y, J = C));
      }
      J !== null && this.coords.setCoordinates(c.Z.COORDS_BY_USER, J.usrCoords);
    }
    return this;
  }, snapToPoints: function(_) {
    return this.handleSnapToPoints(_);
  }, handleAttractors: function() {
    var _, f, g, C, P = 0, w = b.Z.evaluate(this.visProp.attractorunit), T = b.Z.evaluate(this.visProp.attractordistance), D = b.Z.evaluate(this.visProp.snatchdistance), I = b.Z.evaluate(this.visProp.attractors), Y = I.length;
    if (T !== 0) {
      for (_ = 0; _ < Y; _++)
        if (f = this.board.select(I[_]), b.Z.exists(f) && f !== this) {
          if (b.Z.isPoint(f) ? g = k.Z.projectPointToPoint(this, f, this.board) : f.elementClass === c.Z.OBJECT_CLASS_LINE ? (C = k.Z.projectCoordsToSegment(this.coords.usrCoords, f.point1.coords.usrCoords, f.point2.coords.usrCoords), g = !b.Z.evaluate(f.visProp.straightfirst) && C[1] < 0 ? f.point1.coords : !b.Z.evaluate(f.visProp.straightlast) && C[1] > 1 ? f.point2.coords : new E.Z(c.Z.COORDS_BY_USER, C[0], this.board)) : f.elementClass === c.Z.OBJECT_CLASS_CIRCLE ? g = k.Z.projectPointToCircle(this, f, this.board) : f.elementClass === c.Z.OBJECT_CLASS_CURVE ? g = k.Z.projectPointToCurve(this, f, this.board)[0] : f.type === c.Z.OBJECT_TYPE_TURTLE ? g = k.Z.projectPointToTurtle(this, f, this.board)[0] : f.type === c.Z.OBJECT_TYPE_POLYGON && (g = new E.Z(c.Z.COORDS_BY_USER, k.Z.projectCoordsToPolygon(this.coords.usrCoords, f), this.board)), (P = w === "screen" ? g.distance(c.Z.COORDS_BY_SCREEN, this.coords) : g.distance(c.Z.COORDS_BY_USER, this.coords)) < T) {
            this.type === c.Z.OBJECT_TYPE_GLIDER && (f === this.slideObject || this.slideObject && this.onPolygon && this.slideObject.parentPolygon === f) || this.makeGlider(f);
            break;
          }
          P >= D && (f === this.slideObject || this.slideObject && this.onPolygon && this.slideObject.parentPolygon === f) && this.popSlideObject();
        }
      return this;
    }
  }, setPositionDirectly: function(_, f) {
    var g, C, P, w, T = this.coords;
    if (this.relativeCoords)
      return C = new E.Z(_, f, this.board), b.Z.evaluate(this.visProp.islabel) ? (P = A.Z.subtract(C.scrCoords, T.scrCoords), this.relativeCoords.scrCoords[1] += P[1], this.relativeCoords.scrCoords[2] += P[2]) : (P = A.Z.subtract(C.usrCoords, T.usrCoords), this.relativeCoords.usrCoords[1] += P[1], this.relativeCoords.usrCoords[2] += P[2]), this;
    for (this.coords.setCoordinates(_, f), this.handleSnapToGrid(), this.handleSnapToPoints(), this.handleAttractors(), g = this.transformations.length - 1; g >= 0; g--)
      _ === c.Z.COORDS_BY_SCREEN ? w = new E.Z(_, f, this.board).usrCoords : (f.length === 2 && (f = [1].concat(f)), w = f), this.initialCoords.setCoordinates(c.Z.COORDS_BY_USER, j.Z.matVecMult(j.Z.inverse(this.transformations[g].matrix), w));
    return this.prepareUpdate().update(), this.board.isSuspendedUpdate && this.type === c.Z.OBJECT_TYPE_GLIDER && this.updateGlider(), this;
  }, setPositionByTransform: function(_, f) {
    var g;
    return f = new E.Z(_, f, this.board), g = this.board.create("transform", f.usrCoords.slice(1), { type: "translate" }), this.transformations.length > 0 && this.transformations[this.transformations.length - 1].isNumericMatrix ? this.transformations[this.transformations.length - 1].melt(g) : this.addTransform(this, g), this.prepareUpdate().update(), this;
  }, setPosition: function(_, f) {
    return this.setPositionDirectly(_, f);
  }, setGliderPosition: function(_) {
    return this.type === c.Z.OBJECT_TYPE_GLIDER && (this.position = _, this.board.update()), this;
  }, makeGlider: function(_) {
    var f, g, C, P = this.board.select(_), w = !1;
    if (P.type === c.Z.OBJECT_TYPE_POLYGON) {
      for (f = Number.MAX_VALUE, g = 0; g < P.borders.length; g++)
        (C = a.Z.Math.Geometry.distPointLine(this.coords.usrCoords, P.borders[g].stdform)) < f && (f = C, _ = P.borders[g]);
      P = this.board.select(_), w = !0;
    }
    if (!b.Z.exists(P))
      throw new Error("JSXGraph: slide object undefined.");
    if (P.type === c.Z.OBJECT_TYPE_TICKS)
      throw new Error("JSXGraph: gliders on ticks are not possible.");
    return this.slideObject = this.board.select(_), this.slideObjects.push(this.slideObject), this.addParents(_), this.type = c.Z.OBJECT_TYPE_GLIDER, this.elType = "glider", this.visProp.snapwidth = -1, this.slideObject.addChild(this), this.isDraggable = !0, this.onPolygon = w, this.generatePolynomial = function() {
      return this.slideObject.generatePolynomial(this);
    }, this.updateGlider(), this.needsUpdateFromParent = !0, this.updateGliderFromParent(), this;
  }, popSlideObject: function() {
    this.slideObjects.length > 0 && (this.slideObjects.pop(), this.slideObject.removeChild(this), this.slideObjects.length === 0 ? (this.type = this._org_type, this.type === c.Z.OBJECT_TYPE_POINT ? this.elType = "point" : this.elementClass === c.Z.OBJECT_CLASS_TEXT ? this.elType = "text" : this.type === c.Z.OBJECT_TYPE_IMAGE ? this.elType = "image" : this.type === c.Z.OBJECT_TYPE_FOREIGNOBJECT && (this.elType = "foreignobject"), this.slideObject = null) : this.slideObject = this.slideObjects[this.slideObjects.length - 1]);
  }, free: function() {
    var _, f;
    if (this.type !== c.Z.OBJECT_TYPE_GLIDER) {
      if (this.transformations.length = 0, delete this.updateConstraint, this.isConstrained = !1, this.isDraggable)
        return;
      this.isDraggable = !0, this.elementClass === c.Z.OBJECT_CLASS_POINT && (this.type = c.Z.OBJECT_TYPE_POINT, this.elType = "point"), this.XEval = function() {
        return this.coords.usrCoords[1];
      }, this.YEval = function() {
        return this.coords.usrCoords[2];
      }, this.ZEval = function() {
        return this.coords.usrCoords[0];
      }, this.Xjc = null, this.Yjc = null;
    }
    for (_ in this.board.objects)
      this.board.objects.hasOwnProperty(_) && (f = this.board.objects[_]).descendants && (delete f.descendants[this.id], delete f.childElements[this.id], this.hasLabel && (delete f.descendants[this.label.id], delete f.childElements[this.label.id]));
    this.ancestors = {}, this.slideObject = null, this.slideObjects = [], this.elementClass === c.Z.OBJECT_CLASS_POINT ? (this.type = c.Z.OBJECT_TYPE_POINT, this.elType = "point") : this.elementClass === c.Z.OBJECT_CLASS_TEXT ? (this.type = this._org_type, this.elType = "text") : this.elementClass === c.Z.OBJECT_CLASS_OTHER && (this.type = this._org_type, this.elType = "image");
  }, addConstraint: function(_) {
    var f, g, C = [], P = ["X", "Y"], w = function(D) {
      return function() {
        return D;
      };
    }, T = function(D) {
      return function() {
        return D.Value();
      };
    };
    for (this.elementClass === c.Z.OBJECT_CLASS_POINT && (this.type = c.Z.OBJECT_TYPE_CAS), this.isDraggable = !1, f = 0; f < _.length; f++)
      g = _[f], b.Z.isString(g) ? (C[f] = this.board.jc.snippet(g, !0, null, !0), this.addParentsFromJCFunctions([C[f]]), _.length === 2 && (this[P[f] + "jc"] = _[f])) : b.Z.isFunction(g) ? C[f] = g : b.Z.isNumber(g) ? C[f] = w(g) : b.Z.isObject(g) && b.Z.isFunction(g.Value) && (C[f] = T(g)), C[f].origin = g;
    return _.length === 1 ? this.updateConstraint = function() {
      var D = C[0]();
      return b.Z.isArray(D) ? this.coords.setCoordinates(c.Z.COORDS_BY_USER, D) : this.coords = D, this;
    } : _.length === 2 ? (this.XEval = C[0], this.YEval = C[1], this.addParents([C[0].origin, C[1].origin]), this.updateConstraint = function() {
      return this.coords.setCoordinates(c.Z.COORDS_BY_USER, [this.XEval(), this.YEval()]), this;
    }) : (this.ZEval = C[0], this.XEval = C[1], this.YEval = C[2], this.addParents([C[0].origin, C[1].origin, C[2].origin]), this.updateConstraint = function() {
      return this.coords.setCoordinates(c.Z.COORDS_BY_USER, [this.ZEval(), this.XEval(), this.YEval()]), this;
    }), this.isConstrained = !0, this.prepareUpdate().update(), this.board.isSuspendedUpdate || (this.updateVisibility().updateRenderer(), this.hasLabel && this.label.fullUpdate()), this;
  }, addAnchor: function(_, f) {
    this.relativeCoords = f ? new E.Z(c.Z.COORDS_BY_SCREEN, _.slice(0, 2), this.board) : new E.Z(c.Z.COORDS_BY_USER, _, this.board), this.element.addChild(this), f && this.addParents(this.element), this.XEval = function() {
      var g, C, P;
      return b.Z.evaluate(this.visProp.islabel) ? (P = b.Z.evaluate(this.visProp.offset), g = parseFloat(P[0]), C = this.element.getLabelAnchor(), new E.Z(c.Z.COORDS_BY_SCREEN, [g + this.relativeCoords.scrCoords[1] + C.scrCoords[1], 0], this.board).usrCoords[1]) : (C = this.element.getTextAnchor(), this.relativeCoords.usrCoords[1] + C.usrCoords[1]);
    }, this.YEval = function() {
      var g, C, P;
      return b.Z.evaluate(this.visProp.islabel) ? (P = b.Z.evaluate(this.visProp.offset), g = -parseFloat(P[1]), C = this.element.getLabelAnchor(), new E.Z(c.Z.COORDS_BY_SCREEN, [0, g + this.relativeCoords.scrCoords[2] + C.scrCoords[2]], this.board).usrCoords[2]) : (C = this.element.getTextAnchor(), this.relativeCoords.usrCoords[2] + C.usrCoords[2]);
    }, this.ZEval = b.Z.createFunction(1, this.board, ""), this.updateConstraint = function() {
      this.coords.setCoordinates(c.Z.COORDS_BY_USER, [this.ZEval(), this.XEval(), this.YEval()]);
    }, this.isConstrained = !0, this.updateConstraint();
  }, updateTransform: function(_) {
    var f;
    if (this.transformations.length === 0)
      return this;
    for (f = 0; f < this.transformations.length; f++)
      this.transformations[f].update();
    return this;
  }, addTransform: function(_, f) {
    var g, C = b.Z.isArray(f) ? f : [f], P = C.length;
    for (this.transformations.length === 0 && (this.baseElement = _), g = 0; g < P; g++)
      this.transformations.push(C[g]);
    return this;
  }, startAnimation: function(_, f, g) {
    var C = b.Z.evaluate(_), P = b.Z.evaluate(f), w = this;
    return g = b.Z.evaluate(g) || 250, this.type !== c.Z.OBJECT_TYPE_GLIDER || b.Z.exists(this.intervalCode) || (this.intervalCode = window.setInterval(function() {
      w._anim(C, P);
    }, g), b.Z.exists(this.intervalCount) || (this.intervalCount = 0)), this;
  }, stopAnimation: function() {
    return b.Z.exists(this.intervalCode) && (window.clearInterval(this.intervalCode), delete this.intervalCode), this;
  }, moveAlong: function(_, f, g) {
    g = g || {};
    var C, P, w, T, D, I = [], Y = [], U = f / this.board.attr.animationdelay, J = function(z, V) {
      return function() {
        return _[z][V];
      };
    };
    if (b.Z.isArray(_)) {
      for (w = _.length, C = 0; C < w; C++)
        b.Z.isPoint(_[C]) ? Y[C] = _[C] : Y[C] = { elementClass: c.Z.OBJECT_CLASS_POINT, X: J(C, 0), Y: J(C, 1) };
      if ((f = f || 0) === 0)
        return this.setPosition(c.Z.COORDS_BY_USER, [Y[Y.length - 1].X(), Y[Y.length - 1].Y()]), this.board.update(this);
      if (!b.Z.exists(g.interpolate) || g.interpolate)
        for (P = N.Z.Neville(Y), C = 0; C < U; C++)
          I[C] = [], I[C][0] = P[0]((U - C) / U * P[3]()), I[C][1] = P[1]((U - C) / U * P[3]());
      else {
        for (w = _.length - 1, C = 0; C < U; ++C)
          D = C / U * w - (T = Math.floor(C / U * w)), I[C] = [], I[C][0] = (1 - D) * Y[T].X() + D * Y[T + 1].X(), I[C][1] = (1 - D) * Y[T].Y() + D * Y[T + 1].Y();
        I.push([Y[w].X(), Y[w].Y()]), I.reverse();
      }
      this.animationPath = I;
    } else
      b.Z.isFunction(_) && (this.animationPath = _, this.animationStart = (/* @__PURE__ */ new Date()).getTime());
    return this.animationCallback = g.callback, this.board.addAnimation(this), this;
  }, moveTo: function(_, f, g) {
    g = g || {}, _ = new E.Z(c.Z.COORDS_BY_USER, _, this.board);
    var C, P = this.board.attr.animationdelay, w = Math.ceil(f / P), T = [], D = this.coords.usrCoords[1], I = this.coords.usrCoords[2], Y = _.usrCoords[1] - D, U = _.usrCoords[2] - I, J = function(z) {
      return g.effect && g.effect === "<>" ? Math.pow(Math.sin(z / w * Math.PI / 2), 2) : z / w;
    };
    if (!b.Z.exists(f) || f === 0 || Math.abs(_.usrCoords[0] - this.coords.usrCoords[0]) > j.Z.eps)
      return this.setPosition(c.Z.COORDS_BY_USER, _.usrCoords), this.board.update(this);
    if (!b.Z.exists(g.callback) && Math.abs(Y) < j.Z.eps && Math.abs(U) < j.Z.eps)
      return this;
    for (C = w; C >= 0; C--)
      T[w - C] = [_.usrCoords[0], D + Y * J(C), I + U * J(C)];
    return this.animationPath = T, this.animationCallback = g.callback, this.board.addAnimation(this), this;
  }, visit: function(_, f, g) {
    _ = new E.Z(c.Z.COORDS_BY_USER, _, this.board);
    var C, P, w, T = this.board.attr.animationdelay, D = [], I = this.coords.usrCoords[1], Y = this.coords.usrCoords[2], U = _.usrCoords[1] - I, J = _.usrCoords[2] - Y, z = function(V) {
      var $ = V < w / 2 ? 2 * V / w : 2 * (w - V) / w;
      return g.effect && g.effect === "<>" ? Math.pow(Math.sin($ * Math.PI / 2), 2) : $;
    };
    for (b.Z.isNumber(g) ? g = { repeat: g } : (g = g || {}, b.Z.exists(g.repeat) || (g.repeat = 1)), w = Math.ceil(f / (T * g.repeat)), P = 0; P < g.repeat; P++)
      for (C = w; C >= 0; C--)
        D[P * (w + 1) + w - C] = [_.usrCoords[0], I + U * z(C), Y + J * z(C)];
    return this.animationPath = D, this.animationCallback = g.callback, this.board.addAnimation(this), this;
  }, _anim: function(_, f) {
    var g, C, P, w, T, D, I, Y, U;
    return this.intervalCount += 1, this.intervalCount > f && (this.intervalCount = 0), this.slideObject.elementClass === c.Z.OBJECT_CLASS_LINE ? (I = this.slideObject.point1.coords.scrCoords, Y = this.slideObject.point2.coords.scrCoords, g = Math.round((Y[1] - I[1]) * this.intervalCount / f), C = Math.round((Y[2] - I[2]) * this.intervalCount / f), _ > 0 ? w = this.slideObject.point1 : (w = this.slideObject.point2, g *= -1, C *= -1), this.coords.setCoordinates(c.Z.COORDS_BY_SCREEN, [w.coords.scrCoords[1] + g, w.coords.scrCoords[2] + C])) : this.slideObject.elementClass === c.Z.OBJECT_CLASS_CURVE ? (T = _ > 0 ? Math.round(this.intervalCount / f * this.board.canvasWidth) : Math.round((f - this.intervalCount) / f * this.board.canvasWidth), this.coords.setCoordinates(c.Z.COORDS_BY_SCREEN, [T, 0]), U = k.Z.projectPointToCurve(this, this.slideObject, this.board), this.coords = U[0], this.position = U[1]) : this.slideObject.elementClass === c.Z.OBJECT_CLASS_CIRCLE && (P = 2 * Math.PI, P *= _ < 0 ? this.intervalCount / f : (f - this.intervalCount) / f, D = this.slideObject.Radius(), this.coords.setCoordinates(c.Z.COORDS_BY_USER, [this.slideObject.center.coords.usrCoords[1] + D * Math.cos(P), this.slideObject.center.coords.usrCoords[2] + D * Math.sin(P)])), this.board.update(this), this;
  }, getTextAnchor: function() {
    return this.coords;
  }, getLabelAnchor: function() {
    return this.coords;
  }, getParents: function() {
    var _ = [this.Z(), this.X(), this.Y()];
    return this.parents.length !== 0 && (_ = this.parents), this.type === c.Z.OBJECT_TYPE_GLIDER && (_ = [this.X(), this.Y(), this.slideObject.id]), _;
  } }), a.Z.CoordsElement.create = function(_, f, g, C, P, w) {
    var T, D, I = !1;
    for (D = 0; D < g.length; D++)
      (b.Z.isFunction(g[D]) || b.Z.isString(g[D])) && (I = !0);
    if (I)
      (T = new _(f, [0, 0], C, P, w)).addConstraint(g);
    else if (b.Z.isNumber(g[0]) && b.Z.isNumber(g[1]))
      T = new _(f, g, C, P, w), b.Z.exists(C.slideobject) ? T.makeGlider(C.slideobject) : T.baseElement = T, T.isDraggable = !0;
    else {
      if (!b.Z.isObject(g[0]) || !b.Z.isTransformationOrArray(g[1]))
        return !1;
      (T = new _(f, [0, 0], C, P, w)).addTransform(g[0], g[1]), T.isDraggable = !1;
    }
    return T.handleSnapToGrid(), T.handleSnapToPoints(), T.handleAttractors(), T.addParents(g), T;
  };
  const m = a.Z.CoordsElement;
}, 958: (d, M, x) => {
  x.d(M, { Z: () => _ });
  var a = x(765), j = x(351), k = x(705), N = x(275), A = x(309), E = x(766), c = x(88), b = x(327), m = x(109);
  a.Z.GeometryElement = function(f, g, C, P) {
    var w, T, D;
    if (this.needsUpdate = !0, this.isDraggable = !1, this.isReal = !0, this.childElements = {}, this.hasLabel = !1, this.highlighted = !1, this.notExistingParents = {}, this.traces = {}, this.numTraces = 0, this.transformations = [], this.baseElement = null, this.descendants = {}, this.ancestors = {}, this.parents = [], this.symbolic = {}, this.rendNode = null, this.elType = "", this.dump = !0, this.subs = {}, this.inherits = [], this._pos = -1, this.stdform = [1, 0, 0, 0, 1, 1, 0, 0], this.methodMap = { setLabel: "setLabel", label: "label", setName: "setName", getName: "getName", addTransform: "addTransform", setProperty: "setAttribute", setAttribute: "setAttribute", addChild: "addChild", animate: "animate", on: "on", off: "off", trigger: "trigger", addTicks: "addTicks", removeTicks: "removeTicks", removeAllTicks: "removeAllTicks" }, this.quadraticform = [[1, 0, 0], [0, 1, 0], [0, 0, 1]], this.visProp = {}, this.visPropCalc = { visible: !1 }, c.Z.eventify(this), this.mouseover = !1, this.lastDragTime = /* @__PURE__ */ new Date(), arguments.length > 0) {
      for (T in this.board = f, this.type = C, this._org_type = C, this.elementClass = P || j.Z.OBJECT_CLASS_OTHER, this.id = g.id, w = g.name, m.Z.exists(w) || (w = this.board.generateName(this)), w !== "" && (this.board.elementsByName[w] = this), this.name = w, this.needsRegularUpdate = g.needsregularupdate, m.Z.clearVisPropOld(this), D = this.resolveShortcuts(g))
        D.hasOwnProperty(T) && this._set(T, D[T]);
      this.visProp.draft = D.draft && D.draft.draft;
    }
  }, a.Z.extend(a.Z.GeometryElement.prototype, { addChild: function(f) {
    var g, C;
    for (g in this.childElements[f.id] = f, this.addDescendants(f), f.ancestors[this.id] = this, this.descendants)
      if (this.descendants.hasOwnProperty(g))
        for (C in this.descendants[g].ancestors[this.id] = this, this.ancestors)
          this.ancestors.hasOwnProperty(C) && (this.descendants[g].ancestors[this.ancestors[C].id] = this.ancestors[C]);
    for (g in this.ancestors)
      if (this.ancestors.hasOwnProperty(g))
        for (C in this.descendants)
          this.descendants.hasOwnProperty(C) && (this.ancestors[g].descendants[this.descendants[C].id] = this.descendants[C]);
    return this;
  }, addDescendants: function(f) {
    var g;
    for (g in this.descendants[f.id] = f, f.childElements)
      f.childElements.hasOwnProperty(g) && this.addDescendants(f.childElements[g]);
    return this;
  }, addParents: function(f) {
    var g, C, P;
    for (C = (P = m.Z.isArray(f) ? f : arguments).length, g = 0; g < C; ++g)
      m.Z.exists(P[g]) && (m.Z.isId(this.board, P[g]) ? this.parents.push(P[g]) : m.Z.exists(P[g].id) && this.parents.push(P[g].id));
    this.parents = m.Z.uniqueArray(this.parents);
  }, setParents: function(f) {
    this.parents = [], this.addParents(f);
  }, addParentsFromJCFunctions: function(f) {
    var g, C, P;
    for (g = 0; g < f.length; g++)
      for (C in f[g].deps)
        P = f[g].deps[C], this.addParents(P), P.addChild(this);
    return this;
  }, removeChild: function(f) {
    return delete this.childElements[f.id], this.removeDescendants(f), delete f.ancestors[this.id], this;
  }, removeDescendants: function(f) {
    var g;
    for (g in delete this.descendants[f.id], f.childElements)
      f.childElements.hasOwnProperty(g) && this.removeDescendants(f.childElements[g]);
    return this;
  }, countChildren: function() {
    var f, g, C = 0;
    for (f in g = this.childElements)
      g.hasOwnProperty(f) && f.indexOf("Label") < 0 && C++;
    return C;
  }, getName: function() {
    return this.name;
  }, addTransform: function(f) {
    return this;
  }, draggable: function() {
    return this.isDraggable && !m.Z.evaluate(this.visProp.fixed) && this.type !== j.Z.OBJECT_TYPE_GLIDER;
  }, setPosition: function(f, g) {
    var C, P, w, T, D = [];
    if (!m.Z.exists(this.parents))
      return this;
    for (w = this.parents.length, P = 0; P < w; ++P)
      if (C = this.board.select(this.parents[P]), m.Z.isPoint(C)) {
        if (!C.draggable())
          return this;
        D.push(C);
      }
    for (g.length === 3 && (g = g.slice(1)), T = this.board.create("transform", g, { type: "translate" }), (w = D.length) > 0 ? T.applyOnce(D) : this.transformations.length > 0 && this.transformations[this.transformations.length - 1].isNumericMatrix ? this.transformations[this.transformations.length - 1].melt(T) : this.addTransform(T), P = 0; P < w; ++P)
      D[P].type === j.Z.OBJECT_TYPE_GLIDER && D[P].updateGlider();
    return this;
  }, setPositionDirectly: function(f, g, C) {
    var P = new k.Z(f, g, this.board, !1), w = new k.Z(f, C, this.board, !1), T = A.Z.subtract(P.usrCoords, w.usrCoords);
    return this.setPosition(j.Z.COORDS_BY_USER, T), this;
  }, generatePolynomial: function() {
    return [];
  }, animate: function(f, g, C) {
    C = C || {};
    var P, w, T, D = this.board.attr.animationdelay, I = Math.ceil(g / D), Y = this, U = function(z, V, $) {
      var ne, Q, K, te, se;
      for (ne = b.Z.rgb2hsv(z), K = ((Q = b.Z.rgb2hsv(V))[0] - ne[0]) / I, te = (Q[1] - ne[1]) / I, se = (Q[2] - ne[2]) / I, Y.animationData[$] = [], T = 0; T < I; T++)
        Y.animationData[$][I - T - 1] = b.Z.hsv2rgb(ne[0] + (T + 1) * K, ne[1] + (T + 1) * te, ne[2] + (T + 1) * se);
    }, J = function(z, V, $, ne) {
      var Q, K;
      if (z = parseFloat(z), V = parseFloat(V), !isNaN(z) && !isNaN(V))
        for (K = (V - z) / I, Y.animationData[$] = [], T = 0; T < I; T++)
          Q = z + (T + 1) * K, Y.animationData[$][I - T - 1] = ne ? Math.floor(Q) : Q;
    };
    for (P in this.animationData = {}, f)
      if (f.hasOwnProperty(P))
        switch (w = P.toLowerCase()) {
          case "strokecolor":
          case "fillcolor":
            U(this.visProp[w], f[P], w);
            break;
          case "size":
            if (!m.Z.isPoint(this))
              break;
            J(this.visProp[w], f[P], w, !0);
            break;
          case "strokeopacity":
          case "strokewidth":
          case "fillopacity":
            J(this.visProp[w], f[P], w, !1);
        }
    return this.animationCallback = C.callback, this.board.addAnimation(this), this;
  }, update: function() {
    return m.Z.evaluate(this.visProp.trace) && this.cloneToBackground(), this;
  }, updateRenderer: function() {
    return this;
  }, fullUpdate: function(f) {
    return this.prepareUpdate().update().updateVisibility(f).updateRenderer();
  }, setDisplayRendNode: function(f) {
    var g, C, P, w, T;
    if (f === void 0 && (f = this.visPropCalc.visible), f === this.visPropOld.visible)
      return this;
    for (this.board.renderer.display(this, f), C = this.inherits.length, P = 0; P < C; P++)
      if (T = this.inherits[P], m.Z.isArray(T))
        for (w = T.length, g = 0; g < w; g++)
          m.Z.exists(T[g]) && m.Z.exists(T[g].rendNode) && m.Z.evaluate(T[g].visProp.visible) === "inherit" && T[g].setDisplayRendNode(f);
      else
        m.Z.exists(T) && m.Z.exists(T.rendNode) && m.Z.evaluate(T.visProp.visible) === "inherit" && T.setDisplayRendNode(f);
    return this.hasLabel && m.Z.exists(this.label) && m.Z.exists(this.label.rendNode) && m.Z.evaluate(this.label.visProp.visible) === "inherit" && this.label.setDisplayRendNode(f), this;
  }, hide: function() {
    return this.setAttribute({ visible: !1 }), this;
  }, hideElement: function() {
    return this.hide(), this;
  }, show: function() {
    return this.setAttribute({ visible: !0 }), this;
  }, showElement: function() {
    return this.show(), this;
  }, updateVisibility: function(f) {
    var g, C, P, w, T, D;
    if (this.needsUpdate) {
      for (f !== void 0 ? this.visPropCalc.visible = f : (D = m.Z.evaluate(this.visProp.visible), m.Z.exists(this.hiddenByParent) && this.hiddenByParent && (D = !1), D !== "inherit" && (this.visPropCalc.visible = D)), C = this.inherits.length, P = 0; P < C; P++)
        if (T = this.inherits[P], m.Z.isArray(T))
          for (w = T.length, g = 0; g < w; g++)
            m.Z.exists(T[g]) && m.Z.evaluate(T[g].visProp.visible) === "inherit" && T[g].prepareUpdate().updateVisibility(this.visPropCalc.visible);
        else
          m.Z.exists(T) && m.Z.evaluate(T.visProp.visible) === "inherit" && T.prepareUpdate().updateVisibility(this.visPropCalc.visible);
      m.Z.exists(this.label) && m.Z.exists(this.label.visProp) && m.Z.evaluate(this.label.visProp.visible) && this.label.prepareUpdate().updateVisibility(this.visPropCalc.visible);
    }
    return this;
  }, _set: function(f, g) {
    var C;
    if (f = f.toLocaleLowerCase(), this.visProp.hasOwnProperty(f) && f.indexOf("color") >= 0 && m.Z.isString(g) && g.length === 9 && g.charAt(0) === "#")
      g = b.Z.rgba2rgbo(g), this.visProp[f] = g[0], this.visProp[f.replace("color", "opacity")] = g[1];
    else if (g === null || !m.Z.isObject(g) || m.Z.exists(g.id) || m.Z.exists(g.name))
      this.visProp[f] = g;
    else
      for (C in this.visProp[f] = {}, g)
        g.hasOwnProperty(C) && (this.visProp[f][C.toLocaleLowerCase()] = g[C]);
  }, resolveShortcuts: function(f) {
    var g, C, P, w = ["traceattributes", "traceAttributes"];
    for (g in E.Z.shortcuts)
      if (E.Z.shortcuts.hasOwnProperty(g)) {
        if (m.Z.exists(f[g]))
          for (C = 0; C < E.Z.shortcuts[g].length; C++)
            m.Z.exists(f[E.Z.shortcuts[g][C]]) || (f[E.Z.shortcuts[g][C]] = f[g]);
        for (P = 0; P < w.length; P++)
          m.Z.isObject(f[w[P]]) && (f[w[P]] = this.resolveShortcuts(f[w[P]]));
      }
    return f;
  }, setLabel: function(f) {
    this.hasLabel || this.setAttribute({ withlabel: !0 }), this.setLabelText(f);
  }, setLabelText: function(f) {
    return m.Z.exists(this.label) && (f = f.replace(/</g, "&lt;").replace(/>/g, "&gt;"), this.label.setText(f)), this;
  }, setName: function(f) {
    f = f.replace(/</g, "&lt;").replace(/>/g, "&gt;"), this.elType !== "slider" && this.setLabelText(f), this.setAttribute({ name: f });
  }, setProperty: function() {
    a.Z.deprecated("setProperty()", "setAttribute()"), this.setAttribute.apply(this, arguments);
  }, setAttribute: function(f) {
    var g, C, P, w, T, D, I, Y, U, J = {};
    for (g = 0; g < arguments.length; g++)
      D = arguments[g], m.Z.isString(D) ? (Y = D.split(":"), J[m.Z.trim(Y[0])] = m.Z.trim(Y[1])) : m.Z.isArray(D) ? J[D[0]] = D[1] : a.Z.extend(J, D);
    for (g in J = this.resolveShortcuts(J))
      if (J.hasOwnProperty(g)) {
        if (w = g.replace(/\s+/g, "").toLowerCase(), T = J[g], m.Z.isObject(T) && m.Z.exists(this.visProp[w])) {
          if (this.visProp[w] = m.Z.merge(this.visProp[w], T), this.type === j.Z.OBJECT_TYPE_TICKS && m.Z.exists(this.labels))
            for (P = this.labels.length, C = 0; C < P; C++)
              this.labels[C].setAttribute(T);
          else if (m.Z.exists(this[w]))
            if (m.Z.isArray(this[w]))
              for (C = 0; C < this[w].length; C++)
                this[w][C].setAttribute(T);
            else
              this[w].setAttribute(T);
          continue;
        }
        switch (U = this.visProp[w], w) {
          case "name":
            U = this.name, delete this.board.elementsByName[this.name], this.name = T, this.board.elementsByName[this.name] = this;
            break;
          case "needsregularupdate":
            this.needsRegularUpdate = !(T === "false" || T === !1), this.board.renderer.setBuffering(this, this.needsRegularUpdate ? "auto" : "static");
            break;
          case "labelcolor":
            I = (T = b.Z.rgba2rgbo(T))[1], T = T[0], I === 0 && m.Z.exists(this.label) && this.hasLabel && this.label.hideElement(), m.Z.exists(this.label) && this.hasLabel && (this.label.visProp.strokecolor = T, this.board.renderer.setObjectStrokeColor(this.label, T, I)), this.elementClass === j.Z.OBJECT_CLASS_TEXT && (this.visProp.strokecolor = T, this.visProp.strokeopacity = I, this.board.renderer.setObjectStrokeColor(this, T, I));
            break;
          case "infoboxtext":
            m.Z.isString(T) ? this.infoboxText = T : this.infoboxText = !1;
            break;
          case "visible":
            this.visProp.visible = T !== "false" && (T === "true" || T), this.setDisplayRendNode(m.Z.evaluate(this.visProp.visible)), m.Z.evaluate(this.visProp.visible) && m.Z.exists(this.updateSize) && this.updateSize();
            break;
          case "face":
            m.Z.isPoint(this) && (this.visProp.face = T, this.board.renderer.changePointStyle(this));
            break;
          case "trace":
            T === "false" || T === !1 ? (this.clearTrace(), this.visProp.trace = !1) : this.visProp.trace = T !== "pause";
            break;
          case "gradient":
            this.visProp.gradient = T, this.board.renderer.setGradient(this);
            break;
          case "gradientsecondcolor":
            T = b.Z.rgba2rgbo(T), this.visProp.gradientsecondcolor = T[0], this.visProp.gradientsecondopacity = T[1], this.board.renderer.updateGradient(this);
            break;
          case "gradientsecondopacity":
            this.visProp.gradientsecondopacity = T, this.board.renderer.updateGradient(this);
            break;
          case "withlabel":
            this.visProp.withlabel = T, m.Z.evaluate(T) ? (this.label || this.createLabel(), this.label.setAttribute({ visible: "inherit" })) : this.label && this.hasLabel && this.label.setAttribute({ visible: !1 }), this.hasLabel = T;
            break;
          case "radius":
            this.type !== j.Z.OBJECT_TYPE_ANGLE && this.type !== j.Z.OBJECT_TYPE_SECTOR || this.setRadius(T);
            break;
          case "rotate":
            (this.elementClass === j.Z.OBJECT_CLASS_TEXT && m.Z.evaluate(this.visProp.display) === "internal" || this.type === j.Z.OBJECT_TYPE_IMAGE) && this.addRotation(T);
            break;
          case "ticksdistance":
            this.type === j.Z.OBJECT_TYPE_TICKS && m.Z.isNumber(T) && (this.ticksFunction = this.makeTicksFunction(T));
            break;
          case "generatelabelvalue":
            this.type === j.Z.OBJECT_TYPE_TICKS && m.Z.isFunction(T) && (this.generateLabelValue = T);
            break;
          case "onpolygon":
            this.type === j.Z.OBJECT_TYPE_GLIDER && (this.onPolygon = !!T);
            break;
          case "disabled":
            m.Z.exists(this.rendNodeTag) && (this.rendNodeTag.disabled = !!T);
            break;
          case "checked":
            m.Z.exists(this.rendNodeTag) && (this.rendNodeCheckbox.checked = !!T);
            break;
          case "maxlength":
            m.Z.exists(this.rendNodeTag) && (this.rendNodeTag.maxlength = !!T);
            break;
          case "layer":
            this.board.renderer.setLayer(this, m.Z.evaluate(T)), this._set(w, T);
            break;
          case "tabindex":
            m.Z.exists(this.rendNode) && (this.rendNode.setAttribute("tabindex", T), this._set(w, T));
            break;
          default:
            m.Z.exists(this.visProp[w]) && (!a.Z.Validator[w] || a.Z.Validator[w] && a.Z.Validator[w](T) || a.Z.Validator[w] && m.Z.isFunction(T) && a.Z.Validator[w](T())) && (T = (!T.toLowerCase || T.toLowerCase() !== "false") && T, this._set(w, T));
        }
        this.triggerEventHandlers(["attribute:" + w], [U, T, this]);
      }
    return this.triggerEventHandlers(["attribute"], [J, this]), m.Z.evaluate(this.visProp.needsregularupdate) ? this.board.update(this) : this.board.fullUpdate(), this;
  }, getProperty: function() {
    a.Z.deprecated("getProperty()", "getAttribute()"), this.getProperty.apply(this, arguments);
  }, getAttribute: function(f) {
    var g;
    switch (f = f.toLowerCase()) {
      case "needsregularupdate":
        g = this.needsRegularUpdate;
        break;
      case "labelcolor":
        g = this.label.visProp.strokecolor;
        break;
      case "infoboxtext":
        g = this.infoboxText;
        break;
      case "withlabel":
        g = this.hasLabel;
        break;
      default:
        g = this.visProp[f];
    }
    return g;
  }, setDash: function(f) {
    return this.setAttribute({ dash: f }), this;
  }, prepareUpdate: function() {
    return this.needsUpdate = !0, this;
  }, remove: function() {
    return this.board.renderer.remove(this.board.renderer.getElementById(this.id)), this.hasLabel && this.board.renderer.remove(this.board.renderer.getElementById(this.label.id)), this;
  }, getTextAnchor: function() {
    return new k.Z(j.Z.COORDS_BY_USER, [0, 0], this.board);
  }, getLabelAnchor: function() {
    return new k.Z(j.Z.COORDS_BY_USER, [0, 0], this.board);
  }, setArrow: function(f, g) {
    return this.visProp.firstarrow = f, this.visProp.lastarrow = g, g && (this.type = j.Z.OBJECT_TYPE_VECTOR, this.elType = "arrow"), this.prepareUpdate().update().updateVisibility().updateRenderer(), this;
  }, createGradient: function() {
    var f = m.Z.evaluate(this.visProp.gradient);
    f !== "linear" && f !== "radial" || this.board.renderer.setGradient(this);
  }, createLabel: function() {
    var f, g = this;
    return a.Z.elements.text ? ((f = m.Z.deepCopy(this.visProp.label, null)).id = this.id + "Label", f.isLabel = !0, f.anchor = this, f.priv = this.visProp.priv, this.visProp.withlabel && (this.label = a.Z.elements.text(this.board, [0, 0, function() {
      return m.Z.isFunction(g.name) ? g.name() : g.name;
    }], f), this.label.needsUpdate = !0, this.label.dump = !1, this.label.fullUpdate(), this.hasLabel = !0)) : a.Z.debug("JSXGraph: Can't create label: text element is not available. Make sure you include base/text"), this;
  }, highlight: function(f) {
    return f = m.Z.def(f, !1), !m.Z.evaluate(this.visProp.highlight) || this.highlighted && !f || (this.highlighted = !0, this.board.highlightedObjects[this.id] = this, this.board.renderer.highlight(this)), this;
  }, noHighlight: function() {
    return this.highlighted && (this.highlighted = !1, delete this.board.highlightedObjects[this.id], this.board.renderer.noHighlight(this)), this;
  }, clearTrace: function() {
    var f;
    for (f in this.traces)
      this.traces.hasOwnProperty(f) && this.board.renderer.remove(this.traces[f]);
    return this.numTraces = 0, this;
  }, cloneToBackground: function() {
    return this;
  }, bounds: function() {
    return [0, 0, 0, 0];
  }, normalize: function() {
    return this.stdform = N.Z.normalize(this.stdform), this;
  }, toJSON: function() {
    var f, g, C = ['{"name":', this.name];
    for (g in C.push(', "id":' + this.id), f = [], this.visProp)
      this.visProp.hasOwnProperty(g) && m.Z.exists(this.visProp[g]) && f.push('"' + g + '":' + this.visProp[g]);
    return C.push(', "visProp":{' + f.toString() + "}"), C.push("}"), C.join("");
  }, addRotation: function(f) {
    var g, C, P, w, T, D = this;
    return (this.elementClass === j.Z.OBJECT_CLASS_TEXT && m.Z.evaluate(this.visProp.display) === "internal" || this.type === j.Z.OBJECT_TYPE_IMAGE) && f !== 0 && (g = this.board.create("transform", [function() {
      return -D.X();
    }, function() {
      return -D.Y();
    }], { type: "translate" }), C = this.board.create("transform", [function() {
      return D.X();
    }, function() {
      return D.Y();
    }], { type: "translate" }), P = this.board.create("transform", [function() {
      return D.board.unitX / D.board.unitY;
    }, function() {
      return 1;
    }], { type: "scale" }), w = this.board.create("transform", [function() {
      return D.board.unitY / D.board.unitX;
    }, function() {
      return 1;
    }], { type: "scale" }), T = this.board.create("transform", [function() {
      return m.Z.evaluate(f) * Math.PI / 180;
    }], { type: "rotate" }), g.bindTo(this), P.bindTo(this), T.bindTo(this), w.bindTo(this), C.bindTo(this)), this;
  }, highlightStrokeColor: function(f) {
    return a.Z.deprecated("highlightStrokeColor()", "setAttribute()"), this.setAttribute({ highlightStrokeColor: f }), this;
  }, strokeColor: function(f) {
    return a.Z.deprecated("strokeColor()", "setAttribute()"), this.setAttribute({ strokeColor: f }), this;
  }, strokeWidth: function(f) {
    return a.Z.deprecated("strokeWidth()", "setAttribute()"), this.setAttribute({ strokeWidth: f }), this;
  }, fillColor: function(f) {
    return a.Z.deprecated("fillColor()", "setAttribute()"), this.setAttribute({ fillColor: f }), this;
  }, highlightFillColor: function(f) {
    return a.Z.deprecated("highlightFillColor()", "setAttribute()"), this.setAttribute({ highlightFillColor: f }), this;
  }, labelColor: function(f) {
    return a.Z.deprecated("labelColor()", "setAttribute()"), this.setAttribute({ labelColor: f }), this;
  }, dash: function(f) {
    return a.Z.deprecated("dash()", "setAttribute()"), this.setAttribute({ dash: f }), this;
  }, visible: function(f) {
    return a.Z.deprecated("visible()", "setAttribute()"), this.setAttribute({ visible: f }), this;
  }, shadow: function(f) {
    return a.Z.deprecated("shadow()", "setAttribute()"), this.setAttribute({ shadow: f }), this;
  }, getType: function() {
    return this.elType;
  }, getParents: function() {
    return m.Z.isArray(this.parents) ? this.parents : [];
  }, snapToGrid: function() {
    return this;
  }, snapToPoints: function() {
    return this;
  }, getAttributes: function() {
    var f, g = m.Z.deepCopy(this.visProp), C = [], P = C.length;
    for (g.id = this.id, g.name = this.name, f = 0; f < P; f++)
      delete g[C[f]];
    return g;
  }, hasPoint: function(f, g) {
    return !1;
  }, addTicks: function(f) {
    return f.id !== "" && m.Z.exists(f.id) || (f.id = this.id + "_ticks_" + (this.ticks.length + 1)), this.board.renderer.drawTicks(f), this.ticks.push(f), f.id;
  }, removeAllTicks: function() {
    var f;
    if (m.Z.exists(this.ticks)) {
      for (f = this.ticks.length - 1; f >= 0; f--)
        this.removeTicks(this.ticks[f]);
      this.ticks = [], this.board.update();
    }
  }, removeTicks: function(f) {
    var g, C;
    if (m.Z.exists(this.defaultTicks) && this.defaultTicks === f && (this.defaultTicks = null), m.Z.exists(this.ticks)) {
      for (g = this.ticks.length - 1; g >= 0; g--)
        if (this.ticks[g] === f) {
          if (this.board.removeObject(this.ticks[g]), this.ticks[g].ticks)
            for (C = 0; C < this.ticks[g].ticks.length; C++)
              m.Z.exists(this.ticks[g].labels[C]) && this.board.removeObject(this.ticks[g].labels[C]);
          delete this.ticks[g];
          break;
        }
    }
  }, getSnapSizes: function() {
    var f, g, C;
    return f = m.Z.evaluate(this.visProp.snapsizex), g = m.Z.evaluate(this.visProp.snapsizey), f <= 0 && this.board.defaultAxes && this.board.defaultAxes.x.defaultTicks && (f = (C = this.board.defaultAxes.x.defaultTicks).ticksDelta * (m.Z.evaluate(C.visProp.minorticks) + 1)), g <= 0 && this.board.defaultAxes && this.board.defaultAxes.y.defaultTicks && (g = (C = this.board.defaultAxes.y.defaultTicks).ticksDelta * (m.Z.evaluate(C.visProp.minorticks) + 1)), [f, g];
  }, handleSnapToGrid: function(f, g) {
    var C, P, w, T, D, I, Y, U, J, z, V, $ = m.Z.evaluate(this.visProp.attracttogrid), ne = m.Z.evaluate(this.visProp.attractorunit), Q = m.Z.evaluate(this.visProp.attractordistance);
    return !m.Z.exists(this.coords) || m.Z.evaluate(this.visProp.fixed) || (m.Z.evaluate(this.visProp.snaptogrid) || $ || f === !0) && (C = this.coords.usrCoords[1], P = this.coords.usrCoords[2], z = (J = this.getSnapSizes())[0], V = J[1], z > 0 && V > 0 && (U = this.board.getBoundingBox(), w = Math.round(C / z) * z, T = Math.round(P / V) * V, D = new a.Z.Coords(j.Z.COORDS_BY_USER, [w, T], this.board), (!$ || D.distance(ne === "screen" ? j.Z.COORDS_BY_SCREEN : j.Z.COORDS_BY_USER, this.coords) < Q) && (C = w, P = T, g || (I = Math.min(U[0], U[2]), Y = Math.max(U[0], U[2]), C < I ? C += z : C > Y && (C -= z), I = Math.min(U[1], U[3]), Y = Math.max(U[1], U[3]), P < I ? P += V : P > Y && (P -= V)), this.coords.setCoordinates(j.Z.COORDS_BY_USER, [C, P])))), this;
  }, getBoundingBox: function() {
    var f, g, C, P, w, T = [1 / 0, 1 / 0, -1 / 0, -1 / 0];
    if (this.type === j.Z.OBJECT_TYPE_POLYGON) {
      if ((g = this.vertices.length - 1) <= 0)
        return T;
      for (f = 0; f < g; f++)
        C = this.vertices[f].X(), T[0] = C < T[0] ? C : T[0], T[2] = C > T[2] ? C : T[2], C = this.vertices[f].Y(), T[1] = C < T[1] ? C : T[1], T[3] = C > T[3] ? C : T[3];
    } else if (this.elementClass === j.Z.OBJECT_CLASS_CIRCLE)
      P = this.center.X(), w = this.center.Y(), T = [P - this.radius, w + this.radius, P + this.radius, w - this.radius];
    else if (this.elementClass === j.Z.OBJECT_CLASS_CURVE) {
      if ((g = this.vertices.length) === 0)
        return T;
      for (f = 0; f < g; f++)
        C = this.points[f].coords.usrCoords[1], T[0] = C < T[0] ? C : T[0], T[2] = C > T[2] ? C : T[2], C = this.points[f].coords.usrCoords[1], T[1] = C < T[1] ? C : T[1], T[3] = C > T[3] ? C : T[3];
    }
    return T;
  }, addEvent: a.Z.shortcut(a.Z.GeometryElement.prototype, "on"), removeEvent: a.Z.shortcut(a.Z.GeometryElement.prototype, "off"), __evt__over: function(f) {
  }, __evt__mouseover: function(f) {
  }, __evt__out: function(f) {
  }, __evt__mouseout: function(f) {
  }, __evt__move: function(f) {
  }, __evt__mousemove: function(f) {
  }, __evt__drag: function(f) {
  }, __evt__mousedrag: function(f) {
  }, __evt__pendrag: function(f) {
  }, __evt__touchdrag: function(f) {
  }, __evt__keydrag: function(f) {
  }, __evt__down: function(f) {
  }, __evt__mousedown: function(f) {
  }, __evt__pendown: function(f) {
  }, __evt__touchdown: function(f) {
  }, __evt__up: function(f) {
  }, __evt__mouseup: function(f) {
  }, __evt__penup: function(f) {
  }, __evt__touchup: function(f) {
  }, __evt__attribute: function(f, g) {
  }, __evt__attribute_: function(f, g, C) {
  }, __evt: function() {
  } });
  const _ = a.Z.GeometryElement;
}, 573: (d, M, x) => {
  x.d(M, { Z: () => _ });
  var a = x(765), j = x(351), k = x(958), N = x(632), A = x(503), E = x(109), c = x(275), b = x(218), m = function() {
    this._val = parseFloat(this.rendNodeRange.value), this.rendNodeOut.value = this.rendNodeRange.value, this.board.update();
  };
  a.Z.Text = function(f, g, C, P) {
    var w;
    this.constructor(f, C, j.Z.OBJECT_TYPE_TEXT, j.Z.OBJECT_CLASS_TEXT), this.element = this.board.select(C.anchor), this.coordsConstructor(g, E.Z.evaluate(this.visProp.islabel)), this.content = "", this.plaintext = "", this.plaintextOld = null, this.orgText = "", this.needsSizeUpdate = !1, this.hiddenByParent = !1, this.size = [1, 1], this.id = this.board.setId(this, "T"), this.board.renderer.drawText(this), this.board.finalizeAdding(this), w = this.visProp.visible, this.visProp.visible = !0, this.setText(P), this.visProp.visible = w, E.Z.isString(this.content) && this.notifyParents(this.content), this.elType = "text", this.methodMap = E.Z.deepCopy(this.methodMap, { setText: "setTextJessieCode", move: "setCoords" });
  }, a.Z.Text.prototype = new k.Z(), E.Z.copyPrototypeMethods(a.Z.Text, b.Z, "coordsConstructor"), a.Z.extend(a.Z.Text.prototype, { hasPoint: function(f, g) {
    var C, P, w, T, D, I, Y, U;
    return E.Z.isObject(E.Z.evaluate(this.visProp.precision)) ? (Y = this.board._inputDevice, U = E.Z.evaluate(this.visProp.precision[Y])) : U = this.board.options.precision.hasPoint, this.transformations.length > 0 && (f = (C = c.Z.matVecMult(c.Z.inverse(this.board.renderer.joinTransforms(this, this.transformations)), [1, f, g]))[1], g = C[2]), P = (C = (D = this.getAnchorX()) === "right" ? this.coords.scrCoords[1] - this.size[0] : D === "middle" ? this.coords.scrCoords[1] - 0.5 * this.size[0] : this.coords.scrCoords[1]) + this.size[0], w = (T = (I = this.getAnchorY()) === "top" ? this.coords.scrCoords[2] + this.size[1] : I === "middle" ? this.coords.scrCoords[2] + 0.5 * this.size[1] : this.coords.scrCoords[2]) - this.size[1], E.Z.evaluate(this.visProp.dragarea) === "all" ? f >= C - U && f < P + U && g >= w - U && g <= T + U : g >= w - U && g <= T + U && (f >= C - U && f <= C + 2 * U || f >= P - 2 * U && f <= P + U);
  }, _createFctUpdateText: function(f) {
    var g, C, P, w = E.Z.evaluate(this.visProp.parse), T = E.Z.evaluate(this.visProp.usemathjax), D = E.Z.evaluate(this.visProp.usekatex), I = !1;
    if (this.orgText = f, E.Z.isFunction(f))
      this.updateText = function() {
        P = f().toString(), this.plaintext = !w || T || D ? P : this.replaceSub(this.replaceSup(this.convertGeonextAndSketchometry2CSS(P, !1)));
      };
    else if (E.Z.isNumber(f) ? this.content = E.Z.toFixed(f, E.Z.evaluate(this.visProp.digits)) : E.Z.isString(f) && w && (E.Z.evaluate(this.visProp.useasciimathml) ? this.content = "'`" + f + "`'" : T || D ? (this.content = this.valueTagToJessieCode(f), this.content = this.content.replace(/\\/g, "\\\\")) : this.content = this.poorMansTeX(this.valueTagToJessieCode(f)), I = !0), I) {
      for (C in (g = this.board.jc.snippet(this.content, !0, "", !1)).deps)
        this.addParents(g.deps[C]), g.deps[C].addChild(this);
      this.updateText = function() {
        this.plaintext = this.unescapeTicks(g());
      };
    } else
      this.updateText = function() {
        this.plaintext = f;
      };
  }, _setText: function(f) {
    return this._createFctUpdateText(f), this.updateText(), this.fullUpdate(), this.board.infobox && this.id === this.board.infobox.id || this.updateSize(), this;
  }, setTextJessieCode: function(f) {
    var g;
    return this.visProp.castext = f, g = E.Z.isFunction(f) ? function() {
      return E.Z.sanitizeHTML(f());
    } : E.Z.isNumber(f) ? f : E.Z.sanitizeHTML(f), this._setText(g);
  }, setText: function(f) {
    return this._setText(f);
  }, updateSize: function() {
    var f, g, C, P = E.Z.evaluate(this.visProp.display);
    return A.Z.isBrowser && this.board.renderer.type !== "no" ? (C = this.rendNode, P === "html" || this.board.renderer.type === "vml" ? E.Z.exists(C.offsetWidth) ? (g = this, window.setTimeout(function() {
      g.size = [C.offsetWidth, C.offsetHeight], g.needsUpdate = !0, g.updateRenderer();
    }, 0)) : this.size = this.crudeSizeEstimate() : P === "internal" && (this.board.renderer.type === "svg" ? (g = this, window.setTimeout(function() {
      try {
        f = C.getBBox(), g.size = [f.width, f.height], g.needsUpdate = !0, g.updateRenderer();
      } catch {
      }
    }, 0)) : this.board.renderer.type === "canvas" && (this.size = this.crudeSizeEstimate())), this) : this;
  }, crudeSizeEstimate: function() {
    var f = parseFloat(E.Z.evaluate(this.visProp.fontsize));
    return [f * this.plaintext.length * 0.45, 0.9 * f];
  }, utf8_decode: function(f) {
    return f.replace(/&#x(\w+);/g, function(g, C) {
      return String.fromCharCode(parseInt(C, 16));
    });
  }, replaceSub: function(f) {
    if (!f.indexOf)
      return f;
    for (var g, C = f.indexOf("_{"); C >= 0; )
      (g = (f = f.substr(0, C) + f.substr(C).replace(/_\{/, "<sub>")).substr(C).indexOf("}")) >= 0 && (f = f.substr(0, g) + f.substr(g).replace(/\}/, "</sub>")), C = f.indexOf("_{");
    for (C = f.indexOf("_"); C >= 0; )
      C = (f = f.substr(0, C) + f.substr(C).replace(/_(.?)/, "<sub>$1</sub>")).indexOf("_");
    return f;
  }, replaceSup: function(f) {
    if (!f.indexOf)
      return f;
    for (var g, C = f.indexOf("^{"); C >= 0; )
      (g = (f = f.substr(0, C) + f.substr(C).replace(/\^\{/, "<sup>")).substr(C).indexOf("}")) >= 0 && (f = f.substr(0, g) + f.substr(g).replace(/\}/, "</sup>")), C = f.indexOf("^{");
    for (C = f.indexOf("^"); C >= 0; )
      C = (f = f.substr(0, C) + f.substr(C).replace(/\^(.?)/, "<sup>$1</sup>")).indexOf("^");
    return f;
  }, getSize: function() {
    return this.size;
  }, setCoords: function(f, g) {
    var C, P, w;
    return E.Z.isArray(f) && f.length > 1 && (g = f[1], f = f[0]), E.Z.evaluate(this.visProp.islabel) && E.Z.exists(this.element) ? (P = (f - (C = this.element.getLabelAnchor()).usrCoords[1]) * this.board.unitX, w = -(g - C.usrCoords[2]) * this.board.unitY, this.relativeCoords.setCoordinates(j.Z.COORDS_BY_SCREEN, [P, w])) : this.coords.setCoordinates(j.Z.COORDS_BY_USER, [f, g]), this.fullUpdate(), this;
  }, update: function(f) {
    return this.needsUpdate ? (this.updateCoords(f), this.updateText(), E.Z.evaluate(this.visProp.display) === "internal" && E.Z.isString(this.plaintext) && (this.plaintext = this.utf8_decode(this.plaintext)), this.checkForSizeUpdate(), this.needsSizeUpdate && this.updateSize(), this) : this;
  }, checkForSizeUpdate: function() {
    this.board.infobox && this.id === this.board.infobox.id ? this.needsSizeUpdate = !1 : (this.needsSizeUpdate = this.plaintextOld !== this.plaintext, this.needsSizeUpdate && (this.plaintextOld = this.plaintext));
  }, updateRenderer: function() {
    return E.Z.evaluate(this.visProp.autoposition) && this.setAutoPosition().updateConstraint(), this.updateRendererGeneric("updateText");
  }, expandShortMath: function(f) {
    return f.replace(/([)0-9.])\s*([(a-zA-Z_])/g, "$1*$2");
  }, generateTerm: function(f, g, C) {
    var P, w, T, D, I = '""';
    if (T = (f = (f = (f = (f = (f = (f = (f = (f = (f = (f = (f = f || "").replace(/\r/g, "")).replace(/\n/g, "")).replace(/"/g, "'")).replace(/'/g, "\\'")).replace(/&amp;arc;/g, "&ang;")).replace(/<arc\s*\/>/g, "&ang;")).replace(/&lt;arc\s*\/&gt;/g, "&ang;")).replace(/&lt;sqrt\s*\/&gt;/g, "&radic;")).replace(/&lt;value&gt;/g, "<value>")).replace(/&lt;\/value&gt;/g, "</value>")).indexOf("<value>"), D = f.indexOf("</value>"), T >= 0)
      for (; T >= 0; )
        I += ' + "' + this.replaceSub(this.replaceSup(f.slice(0, T))) + '"', w = (w = f.slice(T + 7, D)).replace(/\s+/g, ""), g === !0 && (w = this.expandShortMath(w)), (P = (P = (P = C ? w : N.Z.geonext2JS(w, this.board)).replace(/\\"/g, "'")).replace(/\\'/g, "'")).indexOf("toFixed") < 0 && E.Z.isNumber(E.Z.bind(this.board.jc.snippet(P, !0, "", !1), this)()) ? I += "+(" + P + ").toFixed(" + E.Z.evaluate(this.visProp.digits) + ")" : I += "+(" + P + ")", T = (f = f.slice(D + 8)).indexOf("<value>"), D = f.indexOf("</value>");
    return I += ' + "' + this.replaceSub(this.replaceSup(f)) + '"', I = (I = (I = this.convertGeonextAndSketchometry2CSS(I)).replace(/&amp;/g, "&")).replace(/"/g, "'");
  }, valueTagToJessieCode: function(f) {
    var g, C, P, w, T = [], D = '"';
    if (P = (f = (f = (f = (f = (f = f || "").replace(/\r/g, "")).replace(/\n/g, "")).replace(/&lt;value&gt;/g, "<value>")).replace(/&lt;\/value&gt;/g, "</value>")).indexOf("<value>"), w = f.indexOf("</value>"), P >= 0)
      for (; P >= 0; )
        T.push(D + this.escapeTicks(f.slice(0, P)) + D), C = (C = f.slice(P + 7, w)).replace(/\s+/g, ""), (g = (g = C = this.expandShortMath(C)).replace(/\\"/g, "'").replace(/\\'/g, "'")).indexOf("toFixed") < 0 && E.Z.isNumber(E.Z.bind(this.board.jc.snippet(g, !0, "", !1), this)()) ? T.push("(" + g + ").toFixed(" + E.Z.evaluate(this.visProp.digits) + ")") : T.push("(" + g + ")"), P = (f = f.slice(w + 8)).indexOf("<value>"), w = f.indexOf("</value>");
    return T.push(D + this.escapeTicks(f) + D), T.join(" + ").replace(/&amp;/g, "&");
  }, poorMansTeX: function(f) {
    return f = f.replace(/<arc\s*\/*>/g, "&ang;").replace(/&lt;arc\s*\/*&gt;/g, "&ang;").replace(/<sqrt\s*\/*>/g, "&radic;").replace(/&lt;sqrt\s*\/*&gt;/g, "&radic;"), this.convertGeonextAndSketchometry2CSS(this.replaceSub(this.replaceSup(f)), !0);
  }, escapeTicks: function(f) {
    return f.replace(/"/g, "%22").replace(/'/g, "%27");
  }, unescapeTicks: function(f) {
    return f.replace(/%22/g, '"').replace(/%27/g, "'");
  }, convertGeonext2CSS: function(f) {
    return E.Z.isString(f) && (f = (f = (f = (f = f.replace(/(<|&lt;)overline(>|&gt;)/g, "<span style=text-decoration:overline;>")).replace(/(<|&lt;)\/overline(>|&gt;)/g, "</span>")).replace(/(<|&lt;)arrow(>|&gt;)/g, "<span style=text-decoration:overline;>")).replace(/(<|&lt;)\/arrow(>|&gt;)/g, "</span>")), f;
  }, convertSketchometry2CSS: function(f, g) {
    var C = '<span class="sketcho sketcho-inherit sketcho-', P = '"></span>';
    return E.Z.isString(f) && (g && (C = this.escapeTicks(C), P = this.escapeTicks(P)), f = (f = f.replace(/(<|&lt;)sketchofont(>|&gt;)/g, C)).replace(/(<|&lt;)\/sketchofont(>|&gt;)/g, P)), f;
  }, convertGeonextAndSketchometry2CSS: function(f, g) {
    return f = this.convertGeonext2CSS(f), f = this.convertSketchometry2CSS(f, g);
  }, notifyParents: function(f) {
    var g, C = null;
    f = (f = f.replace(/&lt;value&gt;/g, "<value>")).replace(/&lt;\/value&gt;/g, "</value>");
    do
      (C = (g = /<value>([\w\s*/^\-+()[\],<>=!]+)<\/value>/).exec(f)) !== null && (N.Z.findDependencies(this, C[1], this.board), f = (f = f.substr(C.index)).replace(g, ""));
    while (C !== null);
    return this;
  }, getParents: function() {
    var f;
    return f = this.relativeCoords !== void 0 ? [this.relativeCoords.usrCoords[1], this.relativeCoords.usrCoords[2], this.orgText] : [this.Z(), this.X(), this.Y(), this.orgText], this.parents.length !== 0 && (f = this.parents), f;
  }, bounds: function() {
    var f = this.coords.usrCoords;
    return E.Z.evaluate(this.visProp.islabel) || this.board.unitY === 0 || this.board.unitX === 0 ? [0, 0, 0, 0] : [f[1], f[2] + this.size[1] / this.board.unitY, f[1] + this.size[0] / this.board.unitX, f[2]];
  }, getAnchorX: function() {
    var f = E.Z.evaluate(this.visProp.anchorx);
    if (f === "auto")
      switch (this.visProp.position) {
        case "top":
        case "bot":
          return "middle";
        case "rt":
        case "lrt":
        case "urt":
          return "left";
        default:
          return "right";
      }
    return f;
  }, getAnchorY: function() {
    var f = E.Z.evaluate(this.visProp.anchory);
    if (f === "auto")
      switch (this.visProp.position) {
        case "top":
        case "ulft":
        case "urt":
          return "bottom";
        case "bot":
        case "lrt":
        case "llft":
          return "top";
        default:
          return "middle";
      }
    return f;
  }, getNumberofConflicts: function(f, g, C, P) {
    var w, T, D, I, Y = 0;
    for (I = this.board.options.precision.hasPoint, this.board.options.precision.hasPoint = 0.25 * (C + P), w = 0, D = this.board.objectsList.length; w < D; w++)
      (T = this.board.objectsList[w]).visPropCalc.visible && T.elType !== "axis" && T.elType !== "ticks" && T !== this.board.infobox && T !== this && T.hasPoint(f, g) && Y++;
    return this.board.options.precision.hasPoint = I, Y;
  }, setAutoPosition: function() {
    var f, g, C, P, w, T, D, I, Y, U, J, z, V, $, ne, Q, K = this.size[0], te = this.size[1], se = { conflicts: 1 / 0, angle: 0, r: 0 }, de = 2 * Math.PI / 12;
    if (this === this.board.infobox || !this.visPropCalc.visible || !E.Z.evaluate(this.visProp.islabel) || !this.element)
      return this;
    if (U = E.Z.evaluate(this.visProp.offset), C = (w = this.element.getLabelAnchor()).scrCoords[1], P = w.scrCoords[2], V = U[0], $ = U[1], (Y = this.getNumberofConflicts(C + V, P - $, K, te)) === 0)
      return this;
    for (I = 0.2 * (J = 12), T = Math.atan2($, V), se.conflicts = Y, se.angle = T, se.r = J; se.conflicts > 0 && J < 28; ) {
      for (z = 1, D = T + de; z < 12 && se.conflicts > 0 && (f = C + J * (ne = Math.cos(D)), g = P - J * (Q = Math.sin(D)), (Y = this.getNumberofConflicts(f, g, K, te)) < se.conflicts && (se.conflicts = Y, se.angle = D, se.r = J), se.conflicts !== 0); z++)
        D += de;
      J += I;
    }
    return J = se.r, ne = Math.cos(se.angle), Q = Math.sin(se.angle), this.visProp.offset = [J * ne, J * Q], this.visProp.anchorx = ne < -0.2 ? "right" : ne > 0.2 ? "left" : "middle", this;
  } }), a.Z.createText = function(f, g, C) {
    var P, w = E.Z.copyAttributes(C, f.options, "text"), T = g.slice(0, -1), D = g[g.length - 1];
    if (w.anchor = w.parent || w.anchor, !(P = b.Z.create(a.Z.Text, f, T, w, D)))
      throw new Error("JSXGraph: Can't create text with parent types '" + typeof g[0] + "' and '" + typeof g[1] + `'.
Possible parent types: [x,y], [z,x,y], [element,transformation]`);
    return w.rotate !== 0 && w.display === "internal" && P.addRotation(w.rotate), P;
  }, a.Z.registerElement("text", a.Z.createText), a.Z.createHTMLSlider = function(f, g, C) {
    var P, w, T = E.Z.copyAttributes(C, f.options, "htmlslider");
    if (g.length !== 2 || g[0].length !== 2 || g[1].length !== 3)
      throw new Error("JSXGraph: Can't create htmlslider with parent types '" + typeof g[0] + "' and '" + typeof g[1] + `'.
Possible parents are: [[x,y], [min, start, max]]`);
    T.anchor = T.parent || T.anchor, T.fixed = T.fixed || !0, w = [g[0][0], g[0][1], '<form style="display:inline"><input type="range" /><span></span><input type="text" /></form>'], (P = a.Z.createText(f, w, T)).type = E.Z.OBJECT_TYPE_HTMLSLIDER, P.rendNodeForm = P.rendNode.childNodes[0], P.rendNodeRange = P.rendNodeForm.childNodes[0], P.rendNodeRange.min = g[1][0], P.rendNodeRange.max = g[1][2], P.rendNodeRange.step = T.step, P.rendNodeRange.value = g[1][1], P.rendNodeLabel = P.rendNodeForm.childNodes[1], P.rendNodeLabel.id = P.rendNode.id + "_label", T.withlabel && (P.rendNodeLabel.innerHTML = P.name + "="), P.rendNodeOut = P.rendNodeForm.childNodes[2], P.rendNodeOut.value = g[1][1];
    try {
      P.rendNodeForm.id = P.rendNode.id + "_form", P.rendNodeRange.id = P.rendNode.id + "_range", P.rendNodeOut.id = P.rendNode.id + "_out";
    } catch (D) {
      a.Z.debug(D);
    }
    return P.rendNodeRange.style.width = T.widthrange + "px", P.rendNodeRange.style.verticalAlign = "middle", P.rendNodeOut.style.width = T.widthout + "px", P._val = g[1][1], a.Z.supportsVML() ? A.Z.addEvent(P.rendNodeForm, "change", m, P) : A.Z.addEvent(P.rendNodeForm, "input", m, P), P.Value = function() {
      return this._val;
    }, P;
  }, a.Z.registerElement("htmlslider", a.Z.createHTMLSlider);
  const _ = a.Z.Text;
}, 765: (d, M, x) => {
  x.d(M, { Z: () => j });
  var a = {};
  typeof JXG != "object" || JXG.extend || (a = JXG), a.extend = function(k, N, A, E) {
    var c;
    for (c in A = A || !1, E = E || !1, N)
      (!A || A && N.hasOwnProperty(c)) && (k[E ? c.toLowerCase() : c] = N[c]);
  }, a.defineConstant = function(k, N, A, E) {
    (E = E || !1) && a.exists(k[N]) || Object.defineProperty(k, N, { value: A, writable: !1, enumerable: !0, configurable: !1 });
  }, a.extendConstants = function(k, N, A, E) {
    var c, b;
    for (c in A = A || !1, E = E || !1, N)
      (!A || A && N.hasOwnProperty(c)) && (b = E ? c.toUpperCase() : c, this.defineConstant(k, b, N[c]));
  }, a.extend(a, { boards: {}, readers: {}, elements: {}, registerElement: function(k, N) {
    k = k.toLowerCase(), this.elements[k] = N;
  }, registerReader: function(k, N) {
    var A, E;
    for (A = 0; A < N.length; A++)
      E = N[A].toLowerCase(), typeof this.readers[E] != "function" && (this.readers[E] = k);
  }, shortcut: function(k, N) {
    return function() {
      return k[N].apply(this, arguments);
    };
  }, getRef: function(k, N) {
    return a.deprecated("JXG.getRef()", "Board.select()"), k.select(N);
  }, getReference: function(k, N) {
    return a.deprecated("JXG.getReference()", "Board.select()"), k.select(N);
  }, getBoardByContainerId: function(k) {
    var N;
    for (N in JXG.boards)
      if (JXG.boards.hasOwnProperty(N) && JXG.boards[N].container === k)
        return JXG.boards[N];
    return null;
  }, deprecated: function(k, N) {
    var A = k + " is deprecated.";
    N && (A += " Please use " + N + " instead."), a.warn(A);
  }, warn: function(k) {
    typeof window == "object" && window.console && console.warn ? console.warn("WARNING:", k) : typeof document == "object" && document.getElementById("warning") && (document.getElementById("debug").innerHTML += "WARNING: " + k + "<br />");
  }, debugInt: function(k) {
    var N, A;
    for (N = 0; N < arguments.length; N++)
      A = arguments[N], typeof window == "object" && window.console && console.log ? console.log(A) : typeof document == "object" && document.getElementById("debug") && (document.getElementById("debug").innerHTML += A + "<br/>");
  }, debugWST: function(k) {
    var N = new Error();
    a.debugInt.apply(this, arguments), N && N.stack && (a.debugInt("stacktrace"), a.debugInt(N.stack.split(`
`).slice(1).join(`
`)));
  }, debugLine: function(k) {
    var N = new Error();
    a.debugInt.apply(this, arguments), N && N.stack && a.debugInt("Called from", N.stack.split(`
`).slice(2, 3).join(`
`));
  }, debug: function(k) {
    a.debugInt.apply(this, arguments);
  } });
  const j = a;
}, 922: (d, M, x) => {
  x.d(M, { Z: () => b });
  var a = x(765), j = x(351), k = x(705), N = x(275), A = x(336), E = x(109), c = x(421);
  N.Z.Geometry = {}, a.Z.extend(N.Z.Geometry, { angle: function(m, _, f) {
    var g, C, P, w, T = [], D = [], I = [];
    return a.Z.deprecated("Geometry.angle()", "Geometry.rad()"), m.coords ? (T[0] = m.coords.usrCoords[1], T[1] = m.coords.usrCoords[2]) : (T[0] = m[0], T[1] = m[1]), _.coords ? (D[0] = _.coords.usrCoords[1], D[1] = _.coords.usrCoords[2]) : (D[0] = _[0], D[1] = _[1]), f.coords ? (I[0] = f.coords.usrCoords[1], I[1] = f.coords.usrCoords[2]) : (I[0] = f[0], I[1] = f[1]), g = T[0] - D[0], C = T[1] - D[1], P = I[0] - D[0], w = I[1] - D[1], Math.atan2(g * w - C * P, g * P + C * w);
  }, trueAngle: function(m, _, f) {
    return 57.29577951308232 * this.rad(m, _, f);
  }, rad: function(m, _, f) {
    var g, C, P, w, T, D, I;
    return m.coords ? (g = m.coords.usrCoords[1], C = m.coords.usrCoords[2]) : (g = m[0], C = m[1]), _.coords ? (P = _.coords.usrCoords[1], w = _.coords.usrCoords[2]) : (P = _[0], w = _[1]), f.coords ? (T = f.coords.usrCoords[1], D = f.coords.usrCoords[2]) : (T = f[0], D = f[1]), (I = Math.atan2(D - w, T - P) - Math.atan2(C - w, g - P)) < 0 && (I += 6.283185307179586), I;
  }, angleBisector: function(m, _, f, g) {
    var C, P, w, T, D, I = m.coords.usrCoords, Y = _.coords.usrCoords, U = f.coords.usrCoords;
    return E.Z.exists(g) || (g = m.board), Y[0] === 0 ? new k.Z(j.Z.COORDS_BY_USER, [1, 0.5 * (I[1] + U[1]), 0.5 * (I[2] + U[2])], g) : (T = I[1] - Y[1], D = I[2] - Y[2], C = Math.atan2(D, T), T = U[1] - Y[1], D = U[2] - Y[2], w = 0.5 * (C + (P = Math.atan2(D, T))), C > P && (w += Math.PI), T = Math.cos(w) + Y[1], D = Math.sin(w) + Y[2], new k.Z(j.Z.COORDS_BY_USER, [1, T, D], g));
  }, reflection: function(m, _, f) {
    var g, C, P, w, T, D, I = _.coords.usrCoords, Y = m.point1.coords.usrCoords, U = m.point2.coords.usrCoords;
    return E.Z.exists(f) || (f = _.board), w = U[1] - Y[1], T = U[2] - Y[2], g = I[1] - Y[1], D = (w * (I[2] - Y[2]) - T * g) / (w * w + T * T), C = I[1] + 2 * D * T, P = I[2] - 2 * D * w, new k.Z(j.Z.COORDS_BY_USER, [C, P], f);
  }, rotation: function(m, _, f, g) {
    var C, P, w, T, D, I, Y = _.coords.usrCoords, U = m.coords.usrCoords;
    return E.Z.exists(g) || (g = _.board), C = Y[1] - U[1], P = Y[2] - U[2], D = C * (w = Math.cos(f)) - P * (T = Math.sin(f)) + U[1], I = C * T + P * w + U[2], new k.Z(j.Z.COORDS_BY_USER, [D, I], g);
  }, perpendicular: function(m, _, f) {
    var g, C, P, w, T, D = m.point1.coords.usrCoords, I = m.point2.coords.usrCoords, Y = _.coords.usrCoords;
    return E.Z.exists(f) || (f = _.board), _ === m.point1 ? (g = D[1] + I[2] - D[2], C = D[2] - I[1] + D[1], T = D[0] * I[0], Math.abs(T) < N.Z.eps && (g = I[2], C = -I[1]), w = [T, g, C], P = !0) : _ === m.point2 ? (g = I[1] + D[2] - I[2], C = I[2] - D[1] + I[1], T = D[0] * I[0], Math.abs(T) < N.Z.eps && (g = D[2], C = -D[1]), w = [T, g, C], P = !1) : Math.abs(N.Z.innerProduct(Y, m.stdform, 3)) < N.Z.eps ? (g = Y[1] + I[2] - Y[2], C = Y[2] - I[1] + Y[1], T = I[0], Math.abs(T) < N.Z.eps && (g = I[2], C = -I[1]), P = !0, Math.abs(T) > N.Z.eps && Math.abs(g - Y[1]) < N.Z.eps && Math.abs(C - Y[2]) < N.Z.eps && (g = Y[1] + D[2] - Y[2], C = Y[2] - D[1] + Y[1], P = !1), w = [T, g, C]) : (w = [0, m.stdform[1], m.stdform[2]], w = N.Z.crossProduct(w, Y), w = N.Z.crossProduct(w, m.stdform), P = !0), [new k.Z(j.Z.COORDS_BY_USER, w, f), P];
  }, circumcenterMidpoint: function() {
    a.Z.deprecated("Geometry.circumcenterMidpoint()", "Geometry.circumcenter()"), this.circumcenter.apply(this, arguments);
  }, circumcenter: function(m, _, f, g) {
    var C, P, w, T, D = m.coords.usrCoords, I = _.coords.usrCoords, Y = f.coords.usrCoords;
    return E.Z.exists(g) || (g = m.board), C = [I[0] - D[0], -I[2] + D[2], I[1] - D[1]], P = [0.5 * (D[0] + I[0]), 0.5 * (D[1] + I[1]), 0.5 * (D[2] + I[2])], w = N.Z.crossProduct(C, P), C = [Y[0] - I[0], -Y[2] + I[2], Y[1] - I[1]], P = [0.5 * (I[0] + Y[0]), 0.5 * (I[1] + Y[1]), 0.5 * (I[2] + Y[2])], T = N.Z.crossProduct(C, P), new k.Z(j.Z.COORDS_BY_USER, N.Z.crossProduct(w, T), g);
  }, distance: function(m, _, f) {
    var g, C = 0;
    for (f || (f = Math.min(m.length, _.length)), g = 0; g < f; g++)
      C += (m[g] - _[g]) * (m[g] - _[g]);
    return Math.sqrt(C);
  }, affineDistance: function(m, _, f) {
    var g;
    return (g = this.distance(m, _, f)) > N.Z.eps && (Math.abs(m[0]) < N.Z.eps || Math.abs(_[0]) < N.Z.eps) ? 1 / 0 : g;
  }, affineRatio: function(m, _, f) {
    var g;
    return E.Z.exists(m.usrCoords) && (m = m.usrCoords), E.Z.exists(_.usrCoords) && (_ = _.usrCoords), E.Z.exists(f.usrCoords) && (f = f.usrCoords), g = _[1] - m[1], Math.abs(g) > N.Z.eps ? (f[1] - m[1]) / g : (f[2] - m[2]) / (_[2] - m[2]);
  }, sortVertices: function(m) {
    for (var _, f = c.Z.each(m, c.Z.coordsArray), g = f.length, C = null; f[0][0] === f[g - 1][0] && f[0][1] === f[g - 1][1] && f[0][2] === f[g - 1][2]; )
      C = f.pop(), g--;
    return _ = f[0], f.sort(function(P, w) {
      return (P[2] === _[2] && P[1] === _[1] ? -1 / 0 : Math.atan2(P[2] - _[2], P[1] - _[1])) - (w[2] === _[2] && w[1] === _[1] ? -1 / 0 : Math.atan2(w[2] - _[2], w[1] - _[1]));
    }), C !== null && f.push(C), f;
  }, signedTriangle: function(m, _, f) {
    var g = c.Z.coordsArray(m), C = c.Z.coordsArray(_), P = c.Z.coordsArray(f);
    return 0.5 * ((C[1] - g[1]) * (P[2] - g[2]) - (C[2] - g[2]) * (P[1] - g[1]));
  }, signedPolygon: function(m, _) {
    var f, g, C = 0, P = c.Z.each(m, c.Z.coordsArray);
    for (_ === void 0 && (_ = !0), _ ? P.unshift(P[P.length - 1]) : P = this.sortVertices(P), g = P.length, f = 1; f < g; f++)
      C += P[f - 1][1] * P[f][2] - P[f][1] * P[f - 1][2];
    return 0.5 * C;
  }, GrahamScan: function(m) {
    var _, f = 1, g = c.Z.each(m, c.Z.coordsArray), C = g.length;
    for (C = (g = this.sortVertices(g)).length, _ = 2; _ < C; _++) {
      for (; this.signedTriangle(g[f - 1], g[f], g[_]) <= 0; ) {
        if (f > 1)
          f -= 1;
        else if (_ === C - 1)
          break;
        _ += 1;
      }
      f += 1, g = E.Z.swap(g, f, _);
    }
    return g.slice(0, f);
  }, calcStraight: function(m, _, f, g) {
    var C, P, w, T, D, I, Y, U, J, z;
    if (E.Z.exists(g) || (g = 10), I = E.Z.evaluate(m.visProp.straightfirst), Y = E.Z.evaluate(m.visProp.straightlast), Math.abs(_.scrCoords[0]) < N.Z.eps && (I = !0), Math.abs(f.scrCoords[0]) < N.Z.eps && (Y = !0), (I || Y) && ((U = [])[0] = m.stdform[0] - m.stdform[1] * m.board.origin.scrCoords[1] / m.board.unitX + m.stdform[2] * m.board.origin.scrCoords[2] / m.board.unitY, U[1] = m.stdform[1] / m.board.unitX, U[2] = -m.stdform[2] / m.board.unitY, !isNaN(U[0] + U[1] + U[2]))) {
      if (C = !I && Math.abs(_.usrCoords[0]) >= N.Z.eps && _.scrCoords[1] >= 0 && _.scrCoords[1] <= m.board.canvasWidth && _.scrCoords[2] >= 0 && _.scrCoords[2] <= m.board.canvasHeight, P = !Y && Math.abs(f.usrCoords[0]) >= N.Z.eps && f.scrCoords[1] >= 0 && f.scrCoords[1] <= m.board.canvasWidth && f.scrCoords[2] >= 0 && f.scrCoords[2] <= m.board.canvasHeight, T = (w = this.meetLineBoard(U, m.board, g))[0], D = w[1], !C && !P && (!I && Y && !this.isSameDirection(_, f, T) && !this.isSameDirection(_, f, D) || I && !Y && !this.isSameDirection(f, _, T) && !this.isSameDirection(f, _, D)))
        return;
      C ? P || (z = this.isSameDir(_, f, T, D) ? D : T) : P ? J = this.isSameDir(_, f, T, D) ? T : D : this.isSameDir(_, f, T, D) ? (J = T, z = D) : (z = T, J = D), J && _.setCoordinates(j.Z.COORDS_BY_USER, J.usrCoords), z && f.setCoordinates(j.Z.COORDS_BY_USER, z.usrCoords);
    }
  }, calcLineDelimitingPoints: function(m, _, f) {
    var g, C, P, w, T, D, I, Y, U, J, z;
    if (T = E.Z.evaluate(m.visProp.straightfirst), D = E.Z.evaluate(m.visProp.straightlast), Math.abs(_.scrCoords[0]) < N.Z.eps && (T = !0), Math.abs(f.scrCoords[0]) < N.Z.eps && (D = !0), (I = [])[0] = m.stdform[0] - m.stdform[1] * m.board.origin.scrCoords[1] / m.board.unitX + m.stdform[2] * m.board.origin.scrCoords[2] / m.board.unitY, I[1] = m.stdform[1] / m.board.unitX, I[2] = -m.stdform[2] / m.board.unitY, !isNaN(I[0] + I[1] + I[2])) {
      if (J = !T, z = !D, C = m.board.getBoundingBox(), m.getSlope() >= 0 ? (P = this.projectPointToLine({ coords: { usrCoords: [1, C[2], C[1]] } }, m, m.board), w = this.projectPointToLine({ coords: { usrCoords: [1, C[0], C[3]] } }, m, m.board)) : (P = this.projectPointToLine({ coords: { usrCoords: [1, C[0], C[1]] } }, m, m.board), w = this.projectPointToLine({ coords: { usrCoords: [1, C[2], C[3]] } }, m, m.board)), !J && !z && (!T && !D && (g = _.distance(j.Z.COORDS_BY_USER, f), Math.abs(_.distance(j.Z.COORDS_BY_USER, P) + P.distance(j.Z.COORDS_BY_USER, f) - g) > N.Z.eps || Math.abs(_.distance(j.Z.COORDS_BY_USER, w) + w.distance(j.Z.COORDS_BY_USER, f) - g) > N.Z.eps) || !T && D && !this.isSameDirection(_, f, P) && !this.isSameDirection(_, f, w) || T && !D && !this.isSameDirection(f, _, P) && !this.isSameDirection(f, _, w)))
        return;
      J ? z || (U = this.isSameDir(_, f, P, w) ? w : P) : z ? Y = this.isSameDir(_, f, P, w) ? P : w : this.isSameDir(_, f, P, w) ? (Y = P, U = w) : (U = P, Y = w), Y && _.setCoordinates(j.Z.COORDS_BY_USER, Y.usrCoords), U && f.setCoordinates(j.Z.COORDS_BY_USER, U.usrCoords);
    }
  }, calcLabelQuadrant: function(m) {
    return m < 0 && (m += 2 * Math.PI), ["rt", "urt", "top", "ulft", "lft", "llft", "lrt"][Math.floor((m + Math.PI / 8) / (Math.PI / 4)) % 8];
  }, isSameDir: function(m, _, f, g) {
    var C = _.usrCoords[1] - m.usrCoords[1], P = _.usrCoords[2] - m.usrCoords[2], w = g.usrCoords[1] - f.usrCoords[1], T = g.usrCoords[2] - f.usrCoords[2];
    return Math.abs(_.usrCoords[0]) < N.Z.eps && (C = _.usrCoords[1], P = _.usrCoords[2]), Math.abs(m.usrCoords[0]) < N.Z.eps && (C = -m.usrCoords[1], P = -m.usrCoords[2]), C * w + P * T >= 0;
  }, isSameDirection: function(m, _, f) {
    var g, C, P, w, T = !1;
    return g = _.usrCoords[1] - m.usrCoords[1], C = _.usrCoords[2] - m.usrCoords[2], P = f.usrCoords[1] - m.usrCoords[1], w = f.usrCoords[2] - m.usrCoords[2], Math.abs(g) < N.Z.eps && (g = 0), Math.abs(C) < N.Z.eps && (C = 0), Math.abs(P) < N.Z.eps && (P = 0), Math.abs(w) < N.Z.eps && (w = 0), (g >= 0 && P >= 0 || g <= 0 && P <= 0) && (T = C >= 0 && w >= 0 || C <= 0 && w <= 0), T;
  }, det3p: function(m, _, f) {
    return (m[1] - f[1]) * (_[2] - f[2]) - (_[1] - f[1]) * (m[2] - f[2]);
  }, windingNumber: function(m, _, f) {
    var g, C, P, w, T, D, I = 0, Y = _.length, U = m[1], J = m[2], z = 0;
    if (Y === 0)
      return 0;
    if ((f = f || !1) && (z = 1), isNaN(U) || isNaN(J) || (E.Z.exists(_[0].coords) ? (g = _[0].coords, C = _[Y - 1].coords) : (g = _[0], C = _[Y - 1]), g.usrCoords[1] === U && g.usrCoords[2] === J))
      return 1;
    for (D = 0; D < Y - z; D++)
      if (E.Z.exists(_[D].coords) ? (C = _[D].coords.usrCoords, P = _[(D + 1) % Y].coords.usrCoords) : (C = _[D].usrCoords, P = _[(D + 1) % Y].usrCoords), !(C[0] === 0 || P[0] === 0 || isNaN(C[1]) || isNaN(P[1]) || isNaN(C[2]) || isNaN(P[2]))) {
        if (P[2] === J) {
          if (P[1] === U)
            return 1;
          if (C[2] === J && P[1] > U == C[1] < U)
            return 0;
        }
        if (C[2] < J != P[2] < J)
          if (T = 2 * (P[2] > C[2] ? 1 : 0) - 1, C[1] >= U)
            if (P[1] > U)
              I += T;
            else {
              if ((w = this.det3p(C, P, m)) === 0)
                return 0;
              w > 0 + N.Z.eps == P[2] > C[2] && (I += T);
            }
          else
            P[1] > U && (w = this.det3p(C, P, m)) > 0 + N.Z.eps == P[2] > C[2] && (I += T);
      }
    return I;
  }, pnpoly: function(m, _, f, g) {
    var C, P, w, T, D, I, Y, U, J = f, z = !1;
    for (g === j.Z.COORDS_BY_USER ? (T = (I = new k.Z(j.Z.COORDS_BY_USER, [m, _], this.board)).scrCoords[1], D = I.scrCoords[2]) : (T = m, D = _), C = 0, P = (w = f.length) - 2; C < w - 1; P = C++)
      Y = E.Z.exists(J[C].coords) ? J[C].coords : J[C], U = E.Z.exists(J[P].coords) ? J[P].coords : J[P], Y.scrCoords[2] > D != U.scrCoords[2] > D && T < (U.scrCoords[1] - Y.scrCoords[1]) * (D - Y.scrCoords[2]) / (U.scrCoords[2] - Y.scrCoords[2]) + Y.scrCoords[1] && (z = !z);
    return z;
  }, intersectionFunction: function(m, _, f, g, C, P) {
    var w, T, D = this;
    return w = _.elementClass === j.Z.OBJECT_CLASS_CURVE && (_.type === j.Z.OBJECT_TYPE_ARC || _.type === j.Z.OBJECT_TYPE_SECTOR), T = f.elementClass === j.Z.OBJECT_CLASS_CURVE && (f.type === j.Z.OBJECT_TYPE_ARC || f.type === j.Z.OBJECT_TYPE_SECTOR), _.elementClass !== j.Z.OBJECT_CLASS_CURVE && f.elementClass !== j.Z.OBJECT_CLASS_CURVE || _.elementClass !== j.Z.OBJECT_CLASS_CURVE && _.elementClass !== j.Z.OBJECT_CLASS_CIRCLE || f.elementClass !== j.Z.OBJECT_CLASS_CURVE && f.elementClass !== j.Z.OBJECT_CLASS_CIRCLE ? _.elementClass === j.Z.OBJECT_CLASS_CURVE && !w && f.elementClass === j.Z.OBJECT_CLASS_LINE || f.elementClass === j.Z.OBJECT_CLASS_CURVE && !T && _.elementClass === j.Z.OBJECT_CLASS_LINE ? function() {
      return D.meetCurveLine(_, f, g, _.board, E.Z.evaluate(P));
    } : _.type === j.Z.OBJECT_TYPE_POLYGON || f.type === j.Z.OBJECT_TYPE_POLYGON ? _.elementClass === j.Z.OBJECT_CLASS_LINE ? function() {
      var I, Y = E.Z.evaluate(_.visProp.straightfirst), U = E.Z.evaluate(_.visProp.straightlast), J = E.Z.evaluate(f.visProp.straightfirst), z = E.Z.evaluate(f.visProp.straightlast);
      return I = !(E.Z.evaluate(P) || Y && U && J && z), D.meetPolygonLine(f, _, g, _.board, I);
    } : f.elementClass === j.Z.OBJECT_CLASS_LINE ? function() {
      var I, Y = E.Z.evaluate(_.visProp.straightfirst), U = E.Z.evaluate(_.visProp.straightlast), J = E.Z.evaluate(f.visProp.straightfirst), z = E.Z.evaluate(f.visProp.straightlast);
      return I = !(E.Z.evaluate(P) || Y && U && J && z), D.meetPolygonLine(_, f, g, _.board, I);
    } : function() {
      return D.meetPathPath(_, f, g, _.board);
    } : _.elementClass === j.Z.OBJECT_CLASS_LINE && f.elementClass === j.Z.OBJECT_CLASS_LINE ? function() {
      var I, Y, U = E.Z.evaluate(_.visProp.straightfirst), J = E.Z.evaluate(_.visProp.straightlast), z = E.Z.evaluate(f.visProp.straightfirst), V = E.Z.evaluate(f.visProp.straightlast);
      return E.Z.evaluate(P) || U && J && z && V ? D.meet(_.stdform, f.stdform, g, _.board) : (I = D.meetSegmentSegment(_.point1.coords.usrCoords, _.point2.coords.usrCoords, f.point1.coords.usrCoords, f.point2.coords.usrCoords), Y = !U && I[1] < 0 || !J && I[1] > 1 || !z && I[2] < 0 || !V && I[2] > 1 ? [0, NaN, NaN] : I[0], new k.Z(j.Z.COORDS_BY_USER, Y, _.board));
    } : function() {
      var I, Y, U, J = D.meet(_.stdform, f.stdform, g, _.board), z = !0;
      return E.Z.evaluate(P) ? J : (_.elementClass !== j.Z.OBJECT_CLASS_LINE || (I = E.Z.evaluate(_.visProp.straightfirst), Y = E.Z.evaluate(_.visProp.straightlast), I && Y || (U = D.affineRatio(_.point1.coords, _.point2.coords, J), !(!Y && U > 1 + N.Z.eps || !I && U < 0 - N.Z.eps)))) && (f.elementClass !== j.Z.OBJECT_CLASS_LINE || (I = E.Z.evaluate(f.visProp.straightfirst), Y = E.Z.evaluate(f.visProp.straightlast), I && Y || (U = D.affineRatio(f.point1.coords, f.point2.coords, J), !(!Y && U > 1 + N.Z.eps || !I && U < 0 - N.Z.eps)))) ? w && ((z = D.coordsOnArc(_, J)) && T && (z = D.coordsOnArc(f, J)), !z) ? new k.Z(a.Z.COORDS_BY_USER, [0, NaN, NaN], _.board) : J : new k.Z(a.Z.COORDS_BY_USER, [0, NaN, NaN], _.board);
    } : function() {
      return D.meetCurveCurve(_, f, g, C, _.board);
    };
  }, coordsOnArc: function(m, _) {
    var f = this.rad(m.radiuspoint, m.center, _.usrCoords.slice(1)), g = 0, C = this.rad(m.radiuspoint, m.center, m.anglepoint), P = E.Z.evaluate(m.visProp.selection);
    return (P === "minor" && C > Math.PI || P === "major" && C < Math.PI) && (g = C, C = 2 * Math.PI), !(f < g || f > C);
  }, meet: function(m, _, f, g) {
    var C = N.Z.eps;
    return Math.abs(m[3]) < C && Math.abs(_[3]) < C ? this.meetLineLine(m, _, f, g) : Math.abs(m[3]) >= C && Math.abs(_[3]) < C ? this.meetLineCircle(_, m, f, g) : Math.abs(m[3]) < C && Math.abs(_[3]) >= C ? this.meetLineCircle(m, _, f, g) : this.meetCircleCircle(m, _, f, g);
  }, meetLineBoard: function(m, _, f) {
    var g, C, P, w, T = [];
    for (E.Z.exists(f) || (f = 0), T[0] = N.Z.crossProduct(m, [f, 0, 1]), T[1] = N.Z.crossProduct(m, [f, 1, 0]), T[2] = N.Z.crossProduct(m, [-f - _.canvasHeight, 0, 1]), T[3] = N.Z.crossProduct(m, [-f - _.canvasWidth, 1, 0]), P = 0; P < 4; P++)
      if (Math.abs(T[P][0]) > N.Z.eps) {
        for (w = 2; w > 0; w--)
          T[P][w] /= T[P][0];
        T[P][0] = 1;
      }
    return Math.abs(T[1][0]) < N.Z.eps ? (g = T[0], C = T[2]) : Math.abs(T[0][0]) < N.Z.eps ? (g = T[1], C = T[3]) : T[1][2] < 0 ? (g = T[0], C = T[3][2] > _.canvasHeight ? T[2] : T[3]) : T[1][2] > _.canvasHeight ? (g = T[2], C = T[3][2] < 0 ? T[0] : T[3]) : (g = T[1], C = T[3][2] < 0 ? T[0] : T[3][2] > _.canvasHeight ? T[2] : T[3]), [g = new k.Z(j.Z.COORDS_BY_SCREEN, g.slice(1), _), C = new k.Z(j.Z.COORDS_BY_SCREEN, C.slice(1), _)];
  }, meetLineLine: function(m, _, f, g) {
    var C = isNaN(m[5] + _[5]) ? [0, 0, 0] : N.Z.crossProduct(m, _);
    return new k.Z(j.Z.COORDS_BY_USER, C, g);
  }, meetLineCircle: function(m, _, f, g) {
    var C, P, w, T, D, I, Y, U, J;
    return _[4] < N.Z.eps ? Math.abs(N.Z.innerProduct([1, _[6], _[7]], m, 3)) < N.Z.eps ? new k.Z(j.Z.COORDS_BY_USER, _.slice(6, 8), g) : new k.Z(j.Z.COORDS_BY_USER, [NaN, NaN], g) : (w = _[0], P = _.slice(1, 3), C = _[3], T = m[0], D = m.slice(1, 3), I = C, (U = (Y = P[0] * D[1] - P[1] * D[0]) * Y - 4 * I * (C * T * T - (P[0] * D[0] + P[1] * D[1]) * T + w)) > -N.Z.eps * N.Z.eps ? (J = [(-Y + (U = Math.sqrt(Math.abs(U)))) / (2 * I), (-Y - U) / (2 * I)], E.Z.evaluate(f) === 0 ? new k.Z(j.Z.COORDS_BY_USER, [-J[0] * -D[1] - T * D[0], -J[0] * D[0] - T * D[1]], g) : new k.Z(j.Z.COORDS_BY_USER, [-J[1] * -D[1] - T * D[0], -J[1] * D[0] - T * D[1]], g)) : new k.Z(j.Z.COORDS_BY_USER, [0, 0, 0], g));
  }, meetCircleCircle: function(m, _, f, g) {
    var C;
    return m[4] < N.Z.eps ? Math.abs(this.distance(m.slice(6, 2), _.slice(6, 8)) - _[4]) < N.Z.eps ? new k.Z(j.Z.COORDS_BY_USER, m.slice(6, 8), g) : new k.Z(j.Z.COORDS_BY_USER, [0, 0, 0], g) : _[4] < N.Z.eps ? Math.abs(this.distance(_.slice(6, 2), m.slice(6, 8)) - m[4]) < N.Z.eps ? new k.Z(j.Z.COORDS_BY_USER, _.slice(6, 8), g) : new k.Z(j.Z.COORDS_BY_USER, [0, 0, 0], g) : (C = [_[3] * m[0] - m[3] * _[0], _[3] * m[1] - m[3] * _[1], _[3] * m[2] - m[3] * _[2], 0, 1, 1 / 0, 1 / 0, 1 / 0], C = N.Z.normalize(C), this.meetLineCircle(C, m, f, g));
  }, meetCurveCurve: function(m, _, f, g, C, P) {
    var w;
    return w = E.Z.exists(P) && P === "newton" ? A.Z.generalizedNewton(m, _, E.Z.evaluate(f), g) : m.bezierDegree === 3 || _.bezierDegree === 3 ? this.meetBezierCurveRedBlueSegments(m, _, f) : this.meetCurveRedBlueSegments(m, _, f), new k.Z(j.Z.COORDS_BY_USER, w, C);
  }, meetCurveLine: function(m, _, f, g, C) {
    var P, w;
    return E.Z.exists(g) || (g = m.board), m.elementClass === j.Z.OBJECT_CLASS_CURVE ? (P = m, w = _) : (P = _, w = m), this.meetCurveLineDiscrete(P, w, f, g, !C);
  }, meetCurveLineContinuous: function(m, _, f, g, C) {
    var P, w, T, D, I, Y, U, J, z, V, $, ne, Q, K = N.Z.eps, te = N.Z.eps;
    for (D = this.meetCurveLineDiscrete(m, _, f, g, C), I = D.usrCoords[1], Y = D.usrCoords[2], w = function(se) {
      var de, ae;
      return se > m.maxX() || se < m.minX() ? 1 / 0 : (de = I - m.X(se)) * de + (ae = Y - m.Y(se)) * ae;
    }, T = function(se) {
      var de = _.stdform[0] + _.stdform[1] * m.X(se) + _.stdform[2] * m.Y(se);
      return de * de;
    }, J = (m.maxX() - m.minX()) / 50, z = m.minX(), ne = 1e-4, $ = NaN, V = 0; V < 50 && (P = A.Z.root(w, [Math.max(z, m.minX()), Math.min(z + J, m.maxX())]), !((Q = Math.abs(w(P))) <= ne && ($ = P, (ne = Q) < K))); V++)
      z += J;
    return P = $, Q = T(P = A.Z.root(T, [Math.max(P - J, m.minX()), Math.min(P + J, m.maxX())])), U = isNaN(Q) || Math.abs(Q) > te ? 0 : 1, new k.Z(j.Z.COORDS_BY_USER, [U, m.X(P), m.Y(P)], g);
  }, meetCurveLineDiscrete: function(m, _, f, g, C) {
    var P, w, T, D, I, Y, U, J = E.Z.evaluate(f), z = _.point1.coords.usrCoords, V = _.point2.coords.usrCoords, $ = 0, ne = m.numberPoints, Q = E.Z.evaluate(_.visProp.straightfirst), K = E.Z.evaluate(_.visProp.straightlast);
    for (Y = new k.Z(j.Z.COORDS_BY_USER, [0, NaN, NaN], g), z[0] === 0 ? z = [1, V[1] + _.stdform[2], V[2] - _.stdform[1]] : V[0] === 0 && (V = [1, z[1] + _.stdform[2], z[2] - _.stdform[1]]), D = m.points[0].usrCoords, P = 1; P < ne; P += m.bezierDegree)
      if (T = D.slice(0), D = m.points[P].usrCoords, this.distance(T, D) > N.Z.eps) {
        for (U = m.bezierDegree === 3 ? this.meetBeziersegmentBeziersegment([m.points[P - 1].usrCoords.slice(1), m.points[P].usrCoords.slice(1), m.points[P + 1].usrCoords.slice(1), m.points[P + 2].usrCoords.slice(1)], [z.slice(1), V.slice(1)], C) : [this.meetSegmentSegment(T, D, z, V)], w = 0; w < U.length; w++)
          if (0 <= (I = U[w])[1] && I[1] <= 1) {
            if ($ === J)
              return C && (!Q && I[2] < 0 || !K && I[2] > 1) ? Y : Y = new k.Z(j.Z.COORDS_BY_USER, I[0], g);
            $ += 1;
          }
      }
    return Y;
  }, meetCurveRedBlueSegments: function(m, _, f) {
    var g, C, P, w, T, D, I, Y, U, J = E.Z.evaluate(f), z = 0, V = _.numberPoints, $ = m.numberPoints;
    if (V <= 1 || $ <= 1)
      return [0, NaN, NaN];
    for (g = 1; g < $; g++)
      for (P = m.points[g - 1].usrCoords, w = m.points[g].usrCoords, Y = Math.min(P[1], w[1]), U = Math.max(P[1], w[1]), D = _.points[0].usrCoords, C = 1; C < V; C++)
        if (T = D, D = _.points[C].usrCoords, Math.min(T[1], D[1]) < U && Math.max(T[1], D[1]) > Y && (I = this.meetSegmentSegment(P, w, T, D))[1] >= 0 && I[2] >= 0 && (I[1] < 1 && I[2] < 1 || g === $ - 1 && I[1] === 1 || C === V - 1 && I[2] === 1)) {
          if (z === J)
            return I[0];
          z++;
        }
    return [0, NaN, NaN];
  }, meetSegmentSegment: function(m, _, f, g) {
    var C, P, w, T = N.Z.crossProduct(m, _), D = N.Z.crossProduct(f, g), I = N.Z.crossProduct(T, D);
    return Math.abs(I[0]) < N.Z.eps ? [I, 1 / 0, 1 / 0] : (I[1] /= I[0], I[2] /= I[0], I[0] /= I[0], w = m[P = Math.abs(_[1] - _[0] * m[1]) < N.Z.eps ? 2 : 1] / m[0], C = (I[P] - w) / (_[0] !== 0 ? _[P] / _[0] - w : _[P]), w = f[P = Math.abs(g[1] - g[0] * f[1]) < N.Z.eps ? 2 : 1] / f[0], [I, C, (I[P] - w) / (g[0] !== 0 ? g[P] / g[0] - w : g[P])]);
  }, meetPathPath: function(m, _, f, g) {
    var C, P, w, T, D = E.Z.evaluate(f);
    return (w = (C = a.Z.Math.Clip._getPath(m, g)).length) > 0 && this.distance(C[0].coords.usrCoords, C[w - 1].coords.usrCoords, 3) < N.Z.eps && C.pop(), (w = (P = a.Z.Math.Clip._getPath(_, g)).length) > 0 && this.distance(P[0].coords.usrCoords, P[w - 1].coords.usrCoords, 3) < N.Z.eps * N.Z.eps && P.pop(), f < 0 || a.Z.Math.Clip.isEmptyCase(C, P, "intersection") ? new k.Z(j.Z.COORDS_BY_USER, [0, 0, 0], g) : (a.Z.Math.Clip.makeDoublyLinkedList(C), a.Z.Math.Clip.makeDoublyLinkedList(P), D < (T = a.Z.Math.Clip.findIntersections(C, P, g)[0]).length ? T[D].coords : new k.Z(j.Z.COORDS_BY_USER, [0, 0, 0], g));
  }, meetPolygonLine: function(m, _, f, g, C) {
    var P, w, T, D = E.Z.evaluate(f), I = [0, 0, 0], Y = m.borders.length, U = [];
    for (P = 0; P < Y; P++)
      T = m.borders[P], w = this.meetSegmentSegment(T.point1.coords.usrCoords, T.point2.coords.usrCoords, _.point1.coords.usrCoords, _.point2.coords.usrCoords), (!C || w[2] >= 0 && w[2] < 1) && w[1] >= 0 && w[1] < 1 && U.push(w[0]);
    return D >= 0 && D < U.length && (I = U[D]), new k.Z(j.Z.COORDS_BY_USER, I, g);
  }, _bezierSplit: function(m) {
    var _, f, g, C, P, w;
    return _ = [0.5 * (m[0][0] + m[1][0]), 0.5 * (m[0][1] + m[1][1])], f = [0.5 * (m[1][0] + m[2][0]), 0.5 * (m[1][1] + m[2][1])], g = [0.5 * (m[2][0] + m[3][0]), 0.5 * (m[2][1] + m[3][1])], w = [0.5 * ((C = [0.5 * (_[0] + f[0]), 0.5 * (_[1] + f[1])])[0] + (P = [0.5 * (f[0] + g[0]), 0.5 * (f[1] + g[1])])[0]), 0.5 * (C[1] + P[1])], [[m[0], _, C, w], [w, P, g, m[3]]];
  }, _bezierBbox: function(m) {
    var _ = [];
    return m.length === 4 ? (_[0] = Math.min(m[0][0], m[1][0], m[2][0], m[3][0]), _[1] = Math.max(m[0][1], m[1][1], m[2][1], m[3][1]), _[2] = Math.max(m[0][0], m[1][0], m[2][0], m[3][0]), _[3] = Math.min(m[0][1], m[1][1], m[2][1], m[3][1])) : (_[0] = Math.min(m[0][0], m[1][0]), _[1] = Math.max(m[0][1], m[1][1]), _[2] = Math.max(m[0][0], m[1][0]), _[3] = Math.min(m[0][1], m[1][1])), _;
  }, _bezierOverlap: function(m, _) {
    return m[2] >= _[0] && m[0] <= _[2] && m[1] >= _[3] && m[3] <= _[1];
  }, _bezierListConcat: function(m, _, f, g) {
    var C, P = E.Z.exists(g), w = 0, T = _.length, D = m.length;
    for (D > 0 && T > 0 && (m[D - 1][1] === 1 && _[0][1] === 0 || P && m[D - 1][2] === 1 && _[0][2] === 0) && (w = 1), C = w; C < T; C++)
      P && (_[C][2] *= 0.5, _[C][2] += g), _[C][1] *= 0.5, _[C][1] += f, m.push(_[C]);
  }, _bezierMeetSubdivision: function(m, _, f) {
    var g, C, P, w, T, D, I, Y, U, J, z, V, $ = [];
    return C = this._bezierBbox(_), g = this._bezierBbox(m), this._bezierOverlap(C, g) ? f < 5 ? (D = (P = this._bezierSplit(m))[0], I = P[1], w = (P = this._bezierSplit(_))[0], T = P[1], this._bezierListConcat($, this._bezierMeetSubdivision(D, w, f + 1), 0, 0), this._bezierListConcat($, this._bezierMeetSubdivision(D, T, f + 1), 0, 0.5), this._bezierListConcat($, this._bezierMeetSubdivision(I, w, f + 1), 0.5, 0), this._bezierListConcat($, this._bezierMeetSubdivision(I, T, f + 1), 0.5, 0.5), $) : (z = [1].concat(m[0]), V = [1].concat(m[3]), U = [1].concat(_[0]), J = [1].concat(_[3]), (Y = this.meetSegmentSegment(z, V, U, J))[1] >= 0 && Y[2] >= 0 && Y[1] <= 1 && Y[2] <= 1 ? [Y] : []) : [];
  }, _bezierLineMeetSubdivision: function(m, _, f, g) {
    var C, P, w, T, D, I, Y, U, J, z, V = [];
    return C = this._bezierBbox(_), P = this._bezierBbox(m), g && !this._bezierOverlap(P, C) ? [] : f < 5 ? (T = (w = this._bezierSplit(m))[0], D = w[1], this._bezierListConcat(V, this._bezierLineMeetSubdivision(T, _, f + 1), 0), this._bezierListConcat(V, this._bezierLineMeetSubdivision(D, _, f + 1), 0.5), V) : (J = [1].concat(m[0]), z = [1].concat(m[3]), Y = [1].concat(_[0]), U = [1].concat(_[1]), (I = this.meetSegmentSegment(J, z, Y, U))[1] >= 0 && I[1] <= 1 && (!g || I[2] >= 0 && I[2] <= 1) ? [I] : []);
  }, meetBeziersegmentBeziersegment: function(m, _, f) {
    var g, C, P;
    for ((g = m.length === 4 && _.length === 4 ? this._bezierMeetSubdivision(m, _, 0) : this._bezierLineMeetSubdivision(m, _, 0, f)).sort(function(w, T) {
      return 1e7 * (w[1] - T[1]) + (w[2] - T[2]);
    }), C = [], P = 0; P < g.length; P++)
      P !== 0 && g[P][1] === g[P - 1][1] && g[P][2] === g[P - 1][2] || C.push(g[P]);
    return C;
  }, meetBezierCurveRedBlueSegments: function(m, _, f) {
    var g, C, P, w, T, D, I, Y, U, J, z = E.Z.evaluate(f), V = 0, $ = 0, ne = _.numberPoints, Q = m.numberPoints, K = [];
    if (ne < _.bezierDegree + 1 || Q < m.bezierDegree + 1)
      return [0, NaN, NaN];
    for (ne -= _.bezierDegree, Q -= m.bezierDegree, m.type === j.Z.OBJECT_TYPE_SECTOR && (V = 3, Q -= 3), _.type === j.Z.OBJECT_TYPE_SECTOR && ($ = 3, ne -= 3), C = V; C < Q; C += m.bezierDegree)
      for (D = [(g = m.points)[C].usrCoords.slice(1), g[C + 1].usrCoords.slice(1)], m.bezierDegree === 3 && (D[2] = g[C + 2].usrCoords.slice(1), D[3] = g[C + 3].usrCoords.slice(1)), Y = this._bezierBbox(D), P = $; P < ne; P += _.bezierDegree)
        if (I = [(g = _.points)[P].usrCoords.slice(1), g[P + 1].usrCoords.slice(1)], _.bezierDegree === 3 && (I[2] = g[P + 2].usrCoords.slice(1), I[3] = g[P + 3].usrCoords.slice(1)), U = this._bezierBbox(I), this._bezierOverlap(Y, U)) {
          if ((J = this.meetBeziersegmentBeziersegment(D, I)).length === 0)
            continue;
          for (w = 0; w < J.length; w++)
            (T = J[w])[1] < -N.Z.eps || T[1] > 1 + N.Z.eps || T[2] < -N.Z.eps || T[2] > 1 + N.Z.eps || K.push(T);
          if (K.length > z)
            return K[z][0];
        }
    return K.length > z ? K[z][0] : [0, NaN, NaN];
  }, bezierSegmentEval: function(m, _) {
    var f, g, C, P = 1 - m;
    return g = 0, C = 0, g += (f = P * P * P) * _[0][0], C += f * _[0][1], g += (f = 3 * m * P * P) * _[1][0], C += f * _[1][1], g += (f = 3 * m * m * P) * _[2][0], C += f * _[2][1], [1, g += (f = m * m * m) * _[3][0], C += f * _[3][1]];
  }, bezierArc: function(m, _, f, g, C) {
    var P, w, T, D, I, Y, U, J, z, V, $, ne, Q, K, te, se, de, ae = 0.5 * Math.PI, ce = _[1], fe = _[2], Re = _[0], ke = [], je = [];
    for (I = this.distance(_, m), ce /= Re, fe /= Re, Y = this.rad(m.slice(1), _.slice(1), f.slice(1)), C === -1 && (Y = 2 * Math.PI - Y), (P = m)[1] /= P[0], P[2] /= P[0], P[0] /= P[0], D = P.slice(0), g ? (ke = [ce, ce + 0.333 * (P[1] - ce), ce + 0.666 * (P[1] - ce), P[1]], je = [fe, fe + 0.333 * (P[2] - fe), fe + 0.666 * (P[2] - fe), P[2]]) : (ke = [P[1]], je = [P[2]]); Y > N.Z.eps; )
      Y > ae ? (U = ae, Y -= ae) : (U = Y, Y = 0), de = [[1, 0, 0], [ce * (1 - (J = Math.cos(C * U))) + fe * (z = Math.sin(C * U)), J, -z], [fe * (1 - J) - ce * z, z, J]], D = [(te = N.Z.matVecMult(de, P))[0] / te[0], te[1] / te[0], te[2] / te[0]], V = P[1] - ce, $ = P[2] - fe, ne = D[1] - ce, Q = D[2] - fe, se = Math.sqrt((V + ne) * (V + ne) + ($ + Q) * ($ + Q)), K = Math.abs(Q - $) > N.Z.eps ? (V + ne) * (I / se - 0.5) / (Q - $) * 8 / 3 : ($ + Q) * (I / se - 0.5) / (V - ne) * 8 / 3, w = [1, P[1] - K * $, P[2] + K * V], T = [1, D[1] + K * Q, D[2] - K * ne], ke = ke.concat([w[1], T[1], D[1]]), je = je.concat([w[2], T[2], D[2]]), P = D.slice(0);
    return g && (ke = ke.concat([D[1] + 0.333 * (ce - D[1]), D[1] + 0.666 * (ce - D[1]), ce]), je = je.concat([D[2] + 0.333 * (fe - D[2]), D[2] + 0.666 * (fe - D[2]), fe])), [ke, je];
  }, projectPointToCircle: function(m, _, f) {
    var g, C, P, w, T, D = _.center.coords.usrCoords;
    return E.Z.exists(f) || (f = m.board), E.Z.isPoint(m) ? (g = m.coords.distance(j.Z.COORDS_BY_USER, _.center.coords), C = m.coords.usrCoords) : (g = m.distance(j.Z.COORDS_BY_USER, _.center.coords), C = m.usrCoords), Math.abs(g) < N.Z.eps && (g = N.Z.eps), T = _.Radius() / g, P = D[1] + T * (C[1] - D[1]), w = D[2] + T * (C[2] - D[2]), new k.Z(j.Z.COORDS_BY_USER, [P, w], f);
  }, projectPointToLine: function(m, _, f) {
    var g, C = [0, _.stdform[1], _.stdform[2]];
    return E.Z.exists(f) || (f = E.Z.exists(m.coords) ? m.board : _.board), g = E.Z.exists(m.coords) ? m.coords.usrCoords : m.usrCoords, C = N.Z.crossProduct(C, g), new k.Z(j.Z.COORDS_BY_USER, N.Z.crossProduct(C, _.stdform), f);
  }, projectCoordsToSegment: function(m, _, f) {
    var g, C = [f[1] - _[1], f[2] - _[2]], P = [m[1] - _[1], m[2] - _[2]];
    return Math.abs(C[0]) < N.Z.eps && Math.abs(C[1]) < N.Z.eps ? [_, 0] : (g = N.Z.innerProduct(P, C), [[1, (g /= N.Z.innerProduct(C, C)) * C[0] + _[1], g * C[1] + _[2]], g]);
  }, projectCoordsToBeziersegment: function(m, _, f) {
    var g;
    return g = a.Z.Math.Numerics.fminbr(function(C) {
      var P = [1, _.X(f + C), _.Y(f + C)];
      return P[1] -= m[1], P[2] -= m[2], P[1] * P[1] + P[2] * P[2];
    }, [0, 1]), [[1, _.X(g + f), _.Y(g + f)], g];
  }, projectPointToCurve: function(m, _, f) {
    E.Z.exists(f) || (f = m.board);
    var g = m.X(), C = m.Y(), P = m.position || 0;
    return this.projectCoordsToCurve(g, C, P, _, f);
  }, projectCoordsToCurve: function(m, _, f, g, C) {
    var P, w, T, D, I, Y, U, J, z, V, $, ne, Q, K, te, se, de, ae, ce, fe, Re = Number.POSITIVE_INFINITY;
    if (E.Z.exists(C) || (C = g.board), E.Z.evaluate(g.visProp.curvetype) === "plot") {
      if (f = 0, I = Re, P = g.numberPoints === 0 ? [0, 1, 1] : [g.Z(0), g.X(0), g.Y(0)], g.numberPoints > 1)
        for (J = [1, m, _], g.bezierDegree === 3 ? D = 0 : $ = [g.Z(0), g.X(0), g.Y(0)], T = 0; T < g.numberPoints - 1; T++)
          g.bezierDegree === 3 ? Q = this.projectCoordsToBeziersegment(J, g, D) : (ne = [g.Z(T + 1), g.X(T + 1), g.Y(T + 1)], Q = this.projectCoordsToSegment(J, $, ne)), U = Q[1], z = Q[0], 0 <= U && U <= 1 ? (Y = this.distance(z, J), V = T + U) : U < 0 ? (z = $, Y = this.distance($, J), V = T) : U > 1 && T === g.numberPoints - 2 && (z = ne, Y = this.distance(z, J), V = g.numberPoints - 1), Y < I && (I = Y, f = V, P = z), g.bezierDegree === 3 ? (D++, T += 2) : $ = ne;
      w = new k.Z(j.Z.COORDS_BY_USER, P, C);
    } else {
      for (K = function(ke) {
        var je, qe;
        return ke < g.minX() || ke > g.maxX() ? 1 / 0 : (je = m - g.X(ke)) * je + (qe = _ - g.Y(ke)) * qe;
      }, de = K(f), ce = g.minX(), ae = ((fe = g.maxX()) - ce) / 50, te = ce, T = 0; T < 50; T++)
        ((se = K(te)) < de || de === 1 / 0 || isNaN(de)) && (f = te, de = se), te += ae;
      f = (f = (f = A.Z.fminbr(K, [Math.max(f - ae, ce), Math.min(f + ae, fe)])) < ce ? ce : f) > fe ? fe : f, w = new k.Z(j.Z.COORDS_BY_USER, [g.X(f), g.Y(f)], C);
    }
    return [g.updateTransform(w), f];
  }, projectCoordsToPolygon: function(m, _) {
    var f, g, C, P, w, T = _.vertices.length, D = 1 / 0;
    for (f = 0; f < T - 1; f++)
      0 <= (C = a.Z.Math.Geometry.projectCoordsToSegment(m, _.vertices[f].coords.usrCoords, _.vertices[f + 1].coords.usrCoords))[1] && C[1] <= 1 ? (g = a.Z.Math.Geometry.distance(C[0], m, 3), P = C[0]) : C[1] < 0 ? (g = a.Z.Math.Geometry.distance(_.vertices[f].coords.usrCoords, m, 3), P = _.vertices[f].coords.usrCoords) : (g = a.Z.Math.Geometry.distance(_.vertices[f + 1].coords.usrCoords, m, 3), P = _.vertices[f + 1].coords.usrCoords), g < D && (w = P.slice(0), D = g);
    return w;
  }, projectPointToTurtle: function(m, _, f) {
    var g, C, P, w, T, D, I, Y, U, J, z = 0, V = 0, $ = Number.POSITIVE_INFINITY, ne = _.objects.length;
    for (E.Z.exists(f) || (f = m.board), T = 0; T < ne; T++)
      (I = _.objects[T]).elementClass === j.Z.OBJECT_CLASS_CURVE && (g = (U = this.projectPointToCurve(m, I))[0], J = U[1], (D = this.distance(g.usrCoords, m.coords.usrCoords)) < $ && (P = g.usrCoords[1], w = g.usrCoords[2], C = J, $ = D, Y = I, V = z), z += I.numberPoints);
    return g = new k.Z(j.Z.COORDS_BY_USER, [P, w], f), [Y.updateTransform(g), C + V];
  }, projectPointToPoint: function(m, _) {
    return _.coords;
  }, projectPointToBoard: function(m, _) {
    var f, g, C, P = _ || m.board, w = [[1, 1, 0, 0, 3, 0, 1], [-1, 2, 1, 0, 1, 2, 1], [-1, 1, 2, 2, 1, 2, 3], [1, 2, 3, 0, 3, 2, 3]], T = m.coords || m, D = P.getBoundingBox();
    for (f = 0; f < 4; f++)
      (C = w[f])[0] * T.usrCoords[C[1]] < C[0] * D[C[2]] && ((g = N.Z.crossProduct([1, D[C[3]], D[C[4]]], [1, D[C[5]], D[C[6]]]))[3] = 0, g = N.Z.normalize(g), T = this.projectPointToLine({ coords: T }, { stdform: g }, P));
    return T;
  }, distPointLine: function(m, _) {
    var f, g = _[1], C = _[2], P = _[0];
    return Math.abs(g) + Math.abs(C) < N.Z.eps ? Number.POSITIVE_INFINITY : (f = g * m[1] + C * m[2] + P, g *= g, C *= C, Math.abs(f) / Math.sqrt(g + C));
  }, reuleauxPolygon: function(m, _) {
    var f, g = 2 * Math.PI, C = g / _, P = (_ - 1) / 2, w = 0, T = function(D, I) {
      return function(Y, U) {
        var J = (Y % g + g) % g, z = Math.floor(J / C) % _;
        return U || (w = m[0].Dist(m[P]), f = N.Z.Geometry.rad([m[0].X() + 1, m[0].Y()], m[0], m[P % _])), isNaN(z) ? z : (J = 0.5 * J + z * C * 0.5 + f, m[z][D]() + w * Math[I](J));
      };
    };
    return [T("X", "cos"), T("Y", "sin"), 0, g];
  }, meet3Planes: function(m, _, f, g, C, P) {
    var w, T, D, I, Y, U = [0, 0, 0];
    for (w = N.Z.crossProduct(C, m), T = N.Z.crossProduct(m, f), D = N.Z.crossProduct(f, C), I = N.Z.innerProduct(m, D, 3), Y = 0; Y < 3; Y++)
      U[Y] = (_ * D[Y] + g * w[Y] + P * T[Y]) / I;
    return U;
  }, meetPlanePlane: function(m, _, f, g) {
    var C, P, w, T = [0, 0, 0], D = [0, 0, 0];
    for (C = 0; C < 3; C++)
      T[C] = E.Z.evaluate(m[C]), D[C] = E.Z.evaluate(_[C]);
    for (P = N.Z.crossProduct(T, D), C = 0; C < 3; C++)
      T[C] = E.Z.evaluate(f[C]), D[C] = E.Z.evaluate(g[C]);
    return w = N.Z.crossProduct(T, D), N.Z.crossProduct(P, w);
  }, project3DTo3DPlane: function(m, _, f) {
    var g, C;
    return f = f || [0, 0, 0], g = N.Z.norm(_), C = (N.Z.innerProduct(m, _, 3) - N.Z.innerProduct(f, _, 3)) / g, N.Z.axpy(-C, _, m);
  }, getPlaneBounds: function(m, _, f, g, C) {
    var P, w, T, D, I;
    return m[2] + _[0] !== 0 ? (T = [[m[0], _[0]], [m[1], _[1]]], D = [g - f[0], g - f[1]], P = (I = A.Z.Gauss(T, D))[0], w = I[1], D = [C - f[0], C - f[1]], [P, (I = A.Z.Gauss(T, D))[0], w, I[1]]) : null;
  } });
  const b = N.Z.Geometry;
}, 785: (d, M, x) => {
  x.d(M, { Z: () => E });
  var a = x(765), j = x(275), k = x(109);
  a.Z.Math.DoubleBits = function() {
    var c, b, m, _, f, g, C, P, w = new Float64Array(1), T = new Uint32Array(w.buffer);
    Float64Array !== void 0 && (w[0] = 1, T[1] === 1072693248 ? (c = function(D) {
      return w[0] = D, [T[0], T[1]];
    }, b = function(D, I) {
      return T[0] = D, T[1] = I, w[0];
    }, m = function(D) {
      return w[0] = D, T[0];
    }, _ = function(D) {
      return w[0] = D, T[1];
    }, this.doubleBits = c, this.pack = b, this.lo = m, this.hi = _) : T[0] === 1072693248 && (f = function(D) {
      return w[0] = D, [T[1], T[0]];
    }, g = function(D, I) {
      return T[1] = D, T[0] = I, w[0];
    }, C = function(D) {
      return w[0] = D, T[1];
    }, P = function(D) {
      return w[0] = D, T[0];
    }, this.doubleBits = f, this.pack = g, this.lo = C, this.hi = P));
  }, a.Z.extend(a.Z.Math.DoubleBits.prototype, { sign: function(c) {
    return this.hi(c) >>> 31;
  }, exponent: function(c) {
    return (this.hi(c) << 1 >>> 21) - 1023;
  }, fraction: function(c) {
    var b = this.lo(c), m = this.hi(c), _ = 1048575 & m;
    return 2146435072 & m && (_ += 1 << 20), [b, _];
  }, denormalized: function(c) {
    return !(2146435072 & this.hi(c));
  } });
  var N = new a.Z.Math.DoubleBits(), A = function(c, b) {
    if (c !== void 0 && b !== void 0) {
      if (j.Z.IntervalArithmetic.isInterval(c)) {
        if (!j.Z.IntervalArithmetic.isSingleton(c))
          throw new TypeError("JXG.Math.IntervalArithmetic: interval `lo` must be a singleton");
        this.lo = c.lo;
      } else
        this.lo = c;
      if (j.Z.IntervalArithmetic.isInterval(b)) {
        if (!j.Z.IntervalArithmetic.isSingleton(b))
          throw new TypeError("JXG.Math.IntervalArithmetic: interval `hi` must be a singleton");
        this.hi = b.hi;
      } else
        this.hi = b;
    } else {
      if (c !== void 0)
        return Array.isArray(c) ? new A(c[0], c[1]) : new A(c, c);
      this.lo = this.hi = 0;
    }
  };
  a.Z.extend(A.prototype, { print: function() {
    console.log("[", this.lo, this.hi, "]");
  }, set: function(c, b) {
    return this.lo = c, this.hi = b, this;
  }, bounded: function(c, b) {
    return this.set(j.Z.IntervalArithmetic.prev(c), j.Z.IntervalArithmetic.next(b));
  }, boundedSingleton: function(c) {
    return this.bounded(c, c);
  }, assign: function(c, b) {
    if (typeof c != "number" || typeof b != "number")
      throw new TypeError("JXG.Math.Interval#assign: arguments must be numbers");
    return isNaN(c) || isNaN(b) || c > b ? this.setEmpty() : this.set(c, b);
  }, setEmpty: function() {
    return this.set(Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY);
  }, setWhole: function() {
    return this.set(Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY);
  }, open: function(c, b) {
    return this.assign(j.Z.IntervalArithmetic.next(c), j.Z.IntervalArithmetic.prev(b));
  }, halfOpenLeft: function(c, b) {
    return this.assign(j.Z.IntervalArithmetic.next(c), b);
  }, halfOpenRight: function(c, b) {
    return this.assign(c, j.Z.IntervalArithmetic.prev(b));
  }, toArray: function() {
    return [this.lo, this.hi];
  }, clone: function() {
    return new A().set(this.lo, this.hi);
  } }), a.Z.Math.IntervalArithmetic = { Interval: function(c, b) {
    return new A(c, b);
  }, isInterval: function(c) {
    return c !== null && typeof c == "object" && typeof c.lo == "number" && typeof c.hi == "number";
  }, isSingleton: function(c) {
    return c.lo === c.hi;
  }, add: function(c, b) {
    return k.Z.isNumber(c) && (c = this.Interval(c)), k.Z.isNumber(b) && (b = this.Interval(b)), new A(this.addLo(c.lo, b.lo), this.addHi(c.hi, b.hi));
  }, sub: function(c, b) {
    return k.Z.isNumber(c) && (c = this.Interval(c)), k.Z.isNumber(b) && (b = this.Interval(b)), new A(this.subLo(c.lo, b.hi), this.subHi(c.hi, b.lo));
  }, mul: function(c, b) {
    var m, _, f, g, C;
    return k.Z.isNumber(c) && (c = this.Interval(c)), k.Z.isNumber(b) && (b = this.Interval(b)), this.isEmpty(c) || this.isEmpty(b) ? this.EMPTY.clone() : (m = c.lo, _ = c.hi, f = b.lo, g = b.hi, C = new A(), m < 0 ? _ > 0 ? f < 0 ? g > 0 ? (C.lo = Math.min(this.mulLo(m, g), this.mulLo(_, f)), C.hi = Math.max(this.mulHi(m, f), this.mulHi(_, g))) : (C.lo = this.mulLo(_, f), C.hi = this.mulHi(m, f)) : g > 0 ? (C.lo = this.mulLo(m, g), C.hi = this.mulHi(_, g)) : (C.lo = 0, C.hi = 0) : f < 0 ? g > 0 ? (C.lo = this.mulLo(m, g), C.hi = this.mulHi(m, f)) : (C.lo = this.mulLo(_, g), C.hi = this.mulHi(m, f)) : g > 0 ? (C.lo = this.mulLo(m, g), C.hi = this.mulHi(_, f)) : (C.lo = 0, C.hi = 0) : _ > 0 ? f < 0 ? g > 0 ? (C.lo = this.mulLo(_, f), C.hi = this.mulHi(_, g)) : (C.lo = this.mulLo(_, f), C.hi = this.mulHi(m, g)) : g > 0 ? (C.lo = this.mulLo(m, f), C.hi = this.mulHi(_, g)) : (C.lo = 0, C.hi = 0) : (C.lo = 0, C.hi = 0), C);
  }, div: function(c, b) {
    return k.Z.isNumber(c) && (c = this.Interval(c)), k.Z.isNumber(b) && (b = this.Interval(b)), this.isEmpty(c) || this.isEmpty(b) ? this.EMPTY.clone() : this.zeroIn(b) ? b.lo !== 0 ? b.hi !== 0 ? this.divZero(c) : this.divNegative(c, b.lo) : b.hi !== 0 ? this.divPositive(c, b.hi) : this.EMPTY.clone() : this.divNonZero(c, b);
  }, positive: function(c) {
    return new A(c.lo, c.hi);
  }, negative: function(c) {
    return k.Z.isNumber(c) ? new A(-c) : new A(-c.hi, -c.lo);
  }, isEmpty: function(c) {
    return c.lo > c.hi;
  }, isWhole: function(c) {
    return c.lo === -1 / 0 && c.hi === 1 / 0;
  }, zeroIn: function(c) {
    return this.hasValue(c, 0);
  }, hasValue: function(c, b) {
    return !this.isEmpty(c) && c.lo <= b && b <= c.hi;
  }, hasInterval: function(c, b) {
    return !!this.isEmpty(c) || !this.isEmpty(b) && b.lo <= c.lo && c.hi <= b.hi;
  }, intervalsOverlap: function(c, b) {
    return !this.isEmpty(c) && !this.isEmpty(b) && (c.lo <= b.lo && b.lo <= c.hi || b.lo <= c.lo && c.lo <= b.hi);
  }, divNonZero: function(c, b) {
    var m = c.lo, _ = c.hi, f = b.lo, g = b.hi, C = new A();
    return _ < 0 ? g < 0 ? (C.lo = this.divLo(_, f), C.hi = this.divHi(m, g)) : (C.lo = this.divLo(m, f), C.hi = this.divHi(_, g)) : m < 0 ? g < 0 ? (C.lo = this.divLo(_, g), C.hi = this.divHi(m, g)) : (C.lo = this.divLo(m, f), C.hi = this.divHi(_, f)) : g < 0 ? (C.lo = this.divLo(_, g), C.hi = this.divHi(m, f)) : (C.lo = this.divLo(m, g), C.hi = this.divHi(_, f)), C;
  }, divPositive: function(c, b) {
    return c.lo === 0 && c.hi === 0 ? c : this.zeroIn(c) ? this.WHOLE : c.hi < 0 ? new A(Number.NEGATIVE_INFINITY, this.divHi(c.hi, b)) : new A(this.divLo(c.lo, b), Number.POSITIVE_INFINITY);
  }, divNegative: function(c, b) {
    return c.lo === 0 && c.hi === 0 ? c : this.zeroIn(c) ? this.WHOLE : c.hi < 0 ? new A(this.divLo(c.hi, b), Number.POSITIVE_INFINITY) : new A(Number.NEGATIVE_INFINITY, this.divHi(c.lo, b));
  }, divZero: function(c) {
    return c.lo === 0 && c.hi === 0 ? c : this.WHOLE;
  }, fmod: function(c, b) {
    var m, _;
    return k.Z.isNumber(c) && (c = this.Interval(c)), k.Z.isNumber(b) && (b = this.Interval(b)), this.isEmpty(c) || this.isEmpty(b) ? this.EMPTY.clone() : (m = c.lo < 0 ? b.lo : b.hi, _ = (_ = c.lo / m) < 0 ? Math.ceil(_) : Math.floor(_), this.sub(c, this.mul(b, new A(_))));
  }, multiplicativeInverse: function(c) {
    return k.Z.isNumber(c) && (c = this.Interval(c)), this.isEmpty(c) ? this.EMPTY.clone() : this.zeroIn(c) ? c.lo !== 0 ? c.hi !== 0 ? this.WHOLE : new A(Number.NEGATIVE_INFINITY, this.divHi(1, c.lo)) : c.hi !== 0 ? new A(this.divLo(1, c.hi), Number.POSITIVE_INFINITY) : this.EMPTY.clone() : new A(this.divLo(1, c.hi), this.divHi(1, c.lo));
  }, pow: function(c, b) {
    var m, _;
    if (k.Z.isNumber(c) && (c = this.Interval(c)), this.isEmpty(c))
      return this.EMPTY.clone();
    if (this.isInterval(b)) {
      if (!this.isSingleton(b))
        return this.EMPTY.clone();
      b = b.lo;
    }
    return b === 0 ? c.lo === 0 && c.hi === 0 ? this.EMPTY.clone() : this.ONE.clone() : b < 0 ? this.pow(this.multiplicativeInverse(c), -b) : b % 1 == 0 ? c.hi < 0 ? (m = this.powLo(-c.hi, b), _ = this.powHi(-c.lo, b), (1 & b) == 1 ? new A(-_, -m) : new A(m, _)) : c.lo < 0 ? (1 & b) == 1 ? new A(-this.powLo(-c.lo, b), this.powHi(c.hi, b)) : new A(0, this.powHi(Math.max(-c.lo, c.hi), b)) : new A(this.powLo(c.lo, b), this.powHi(c.hi, b)) : (console.warn("power is not an integer, you should use nth-root instead, returning an empty interval"), this.EMPTY.clone());
  }, sqrt: function(c) {
    return k.Z.isNumber(c) && (c = this.Interval(c)), this.nthRoot(c, 2);
  }, nthRoot: function(c, b) {
    var m, _, f, g, C;
    if (k.Z.isNumber(c) && (c = this.Interval(c)), this.isEmpty(c) || b < 0)
      return this.EMPTY.clone();
    if (this.isInterval(b)) {
      if (!this.isSingleton(b))
        return this.EMPTY.clone();
      b = b.lo;
    }
    return m = 1 / b, c.hi < 0 ? b % 1 == 0 && (1 & b) == 1 ? (_ = this.powHi(-c.lo, m), f = this.powLo(-c.hi, m), new A(-_, -f)) : this.EMPTY.clone() : c.lo < 0 ? (g = this.powHi(c.hi, m), b % 1 == 0 && (1 & b) == 1 ? (C = -this.powHi(-c.lo, m), new A(C, g)) : new A(0, g)) : new A(this.powLo(c.lo, m), this.powHi(c.hi, m));
  }, exp: function(c) {
    return k.Z.isNumber(c) && (c = this.Interval(c)), this.isEmpty(c) ? this.EMPTY.clone() : new A(this.expLo(c.lo), this.expHi(c.hi));
  }, log: function(c) {
    var b;
    return k.Z.isNumber(c) && (c = this.Interval(c)), this.isEmpty(c) ? this.EMPTY.clone() : (b = c.lo <= 0 ? Number.NEGATIVE_INFINITY : this.logLo(c.lo), new A(b, this.logHi(c.hi)));
  }, ln: function(c) {
    return this.log(c);
  }, log10: function(c) {
    return this.isEmpty(c) ? this.EMPTY.clone() : this.div(this.log(c), this.log(new A(10, 10)));
  }, log2: function(c) {
    return this.isEmpty(c) ? this.EMPTY.clone() : this.div(this.log(c), this.log(new A(2, 2)));
  }, hull: function(c, b) {
    var m = this.isEmpty(c), _ = this.isEmpty(b);
    return m && _ ? this.EMPTY.clone() : m ? b.clone() : _ ? c.clone() : new A(Math.min(c.lo, b.lo), Math.max(c.hi, b.hi));
  }, intersection: function(c, b) {
    var m, _;
    return this.isEmpty(c) || this.isEmpty(b) ? this.EMPTY.clone() : (m = Math.max(c.lo, b.lo)) <= (_ = Math.min(c.hi, b.hi)) ? new A(m, _) : this.EMPTY.clone();
  }, union: function(c, b) {
    if (!this.intervalsOverlap(c, b))
      throw new Error("Interval#unions do not overlap");
    return new A(Math.min(c.lo, b.lo), Math.max(c.hi, b.hi));
  }, difference: function(c, b) {
    if (this.isEmpty(c) || this.isWhole(b))
      return this.EMPTY.clone();
    if (this.intervalsOverlap(c, b)) {
      if (c.lo < b.lo && b.hi < c.hi)
        throw new Error("Interval.difference: difference creates multiple intervals");
      return b.lo <= c.lo && b.hi === 1 / 0 || b.hi >= c.hi && b.lo === -1 / 0 ? this.EMPTY.clone() : b.lo <= c.lo ? new A().halfOpenLeft(b.hi, c.hi) : new A().halfOpenRight(c.lo, b.lo);
    }
    return c.clone();
  }, width: function(c) {
    return this.isEmpty(c) ? 0 : this.subHi(c.hi, c.lo);
  }, abs: function(c) {
    return k.Z.isNumber(c) && (c = this.Interval(c)), this.isEmpty(c) ? this.EMPTY.clone() : c.lo >= 0 ? c.clone() : c.hi <= 0 ? this.negative(c) : new A(0, Math.max(-c.lo, c.hi));
  }, max: function(c, b) {
    var m = this.isEmpty(c), _ = this.isEmpty(b);
    return m && _ ? this.EMPTY.clone() : m ? b.clone() : _ ? c.clone() : new A(Math.max(c.lo, b.lo), Math.max(c.hi, b.hi));
  }, min: function(c, b) {
    var m = this.isEmpty(c), _ = this.isEmpty(b);
    return m && _ ? this.EMPTY.clone() : m ? b.clone() : _ ? c.clone() : new A(Math.min(c.lo, b.lo), Math.min(c.hi, b.hi));
  }, onlyInfinity: function(c) {
    return !isFinite(c.lo) && c.lo === c.hi;
  }, _handleNegative: function(c) {
    var b;
    return c.lo < 0 && (c.lo === -1 / 0 ? (c.lo = 0, c.hi = 1 / 0) : (b = Math.ceil(-c.lo / this.piTwiceLow), c.lo += this.piTwiceLow * b, c.hi += this.piTwiceLow * b)), c;
  }, cos: function(c) {
    var b, m, _, f, g, C, P, w;
    return this.isEmpty(c) || this.onlyInfinity(c) ? this.EMPTY.clone() : (b = new A().set(c.lo, c.hi), this._handleNegative(b), m = this.PI_TWICE, _ = this.fmod(b, m), this.width(_) >= m.lo ? new A(-1, 1) : _.lo >= this.piHigh ? (f = this.cos(this.sub(_, this.PI)), this.negative(f)) : (g = _.lo, C = _.hi, P = this.cosLo(C), w = this.cosHi(g), C <= this.piLow ? new A(P, w) : C <= m.lo ? new A(-1, Math.max(P, w)) : new A(-1, 1)));
  }, sin: function(c) {
    return this.isEmpty(c) || this.onlyInfinity(c) ? this.EMPTY.clone() : this.cos(this.sub(c, this.PI_HALF));
  }, tan: function(c) {
    var b, m, _;
    return this.isEmpty(c) || this.onlyInfinity(c) ? this.EMPTY.clone() : (b = new A().set(c.lo, c.hi), this._handleNegative(b), _ = this.PI, (m = this.fmod(b, _)).lo >= this.piHalfLow && (m = this.sub(m, _)), m.lo <= -this.piHalfLow || m.hi >= this.piHalfLow ? this.WHOLE.clone() : new A(this.tanLo(m.lo), this.tanHi(m.hi)));
  }, asin: function(c) {
    var b, m;
    return this.isEmpty(c) || c.hi < -1 || c.lo > 1 ? this.EMPTY.clone() : (b = c.lo <= -1 ? -this.piHalfHigh : this.asinLo(c.lo), m = c.hi >= 1 ? this.piHalfHigh : this.asinHi(c.hi), new A(b, m));
  }, acos: function(c) {
    var b, m;
    return this.isEmpty(c) || c.hi < -1 || c.lo > 1 ? this.EMPTY.clone() : (b = c.hi >= 1 ? 0 : this.acosLo(c.hi), m = c.lo <= -1 ? this.piHigh : this.acosHi(c.lo), new A(b, m));
  }, atan: function(c) {
    return this.isEmpty(c) ? this.EMPTY.clone() : new A(this.atanLo(c.lo), this.atanHi(c.hi));
  }, sinh: function(c) {
    return this.isEmpty(c) ? this.EMPTY.clone() : new A(this.sinhLo(c.lo), this.sinhHi(c.hi));
  }, cosh: function(c) {
    return this.isEmpty(c) ? this.EMPTY.clone() : c.hi < 0 ? new A(this.coshLo(c.hi), this.coshHi(c.lo)) : c.lo >= 0 ? new A(this.coshLo(c.lo), this.coshHi(c.hi)) : new A(1, this.coshHi(-c.lo > c.hi ? c.lo : c.hi));
  }, tanh: function(c) {
    return this.isEmpty(c) ? this.EMPTY.clone() : new A(this.tanhLo(c.lo), this.tanhHi(c.hi));
  }, equal: function(c, b) {
    return this.isEmpty(c) ? this.isEmpty(b) : !this.isEmpty(b) && c.lo === b.lo && c.hi === b.hi;
  }, notEqual: function(c, b) {
    return this.isEmpty(c) ? !this.isEmpty(b) : this.isEmpty(b) || c.hi < b.lo || c.lo > b.hi;
  }, lt: function(c, b) {
    return k.Z.isNumber(c) && (c = this.Interval(c)), k.Z.isNumber(b) && (b = this.Interval(b)), !this.isEmpty(c) && !this.isEmpty(b) && c.hi < b.lo;
  }, gt: function(c, b) {
    return k.Z.isNumber(c) && (c = this.Interval(c)), k.Z.isNumber(b) && (b = this.Interval(b)), !this.isEmpty(c) && !this.isEmpty(b) && c.lo > b.hi;
  }, leq: function(c, b) {
    return k.Z.isNumber(c) && (c = this.Interval(c)), k.Z.isNumber(b) && (b = this.Interval(b)), !this.isEmpty(c) && !this.isEmpty(b) && c.hi <= b.lo;
  }, geq: function(c, b) {
    return k.Z.isNumber(c) && (c = this.Interval(c)), k.Z.isNumber(b) && (b = this.Interval(b)), !this.isEmpty(c) && !this.isEmpty(b) && c.lo >= b.hi;
  }, piLow: 3.141592653589793, piHigh: 3.1415926535897936, piHalfLow: 1.5707963267948966, piHalfHigh: 1.5707963267948968, piTwiceLow: 6.283185307179586, piTwiceHigh: 6.283185307179587, identity: function(c) {
    return c;
  }, _prev: function(c) {
    return c === 1 / 0 ? c : this.nextafter(c, -1 / 0);
  }, _next: function(c) {
    return c === -1 / 0 ? c : this.nextafter(c, 1 / 0);
  }, prev: function(c) {
    return this._prev(c);
  }, next: function(c) {
    return this._next(c);
  }, toInteger: function(c) {
    return c < 0 ? Math.ceil(c) : Math.floor(c);
  }, addLo: function(c, b) {
    return this.prev(c + b);
  }, addHi: function(c, b) {
    return this.next(c + b);
  }, subLo: function(c, b) {
    return this.prev(c - b);
  }, subHi: function(c, b) {
    return this.next(c - b);
  }, mulLo: function(c, b) {
    return this.prev(c * b);
  }, mulHi: function(c, b) {
    return this.next(c * b);
  }, divLo: function(c, b) {
    return this.prev(c / b);
  }, divHi: function(c, b) {
    return this.next(c / b);
  }, intLo: function(c) {
    return this.toInteger(this.prev(c));
  }, intHi: function(c) {
    return this.toInteger(this.next(c));
  }, logLo: function(c) {
    return this.prev(Math.log(c));
  }, logHi: function(c) {
    return this.next(Math.log(c));
  }, expLo: function(c) {
    return this.prev(Math.exp(c));
  }, expHi: function(c) {
    return this.next(Math.exp(c));
  }, sinLo: function(c) {
    return this.prev(Math.sin(c));
  }, sinHi: function(c) {
    return this.next(Math.sin(c));
  }, cosLo: function(c) {
    return this.prev(Math.cos(c));
  }, cosHi: function(c) {
    return this.next(Math.cos(c));
  }, tanLo: function(c) {
    return this.prev(Math.tan(c));
  }, tanHi: function(c) {
    return this.next(Math.tan(c));
  }, asinLo: function(c) {
    return this.prev(Math.asin(c));
  }, asinHi: function(c) {
    return this.next(Math.asin(c));
  }, acosLo: function(c) {
    return this.prev(Math.acos(c));
  }, acosHi: function(c) {
    return this.next(Math.acos(c));
  }, atanLo: function(c) {
    return this.prev(Math.atan(c));
  }, atanHi: function(c) {
    return this.next(Math.atan(c));
  }, sinhLo: function(c) {
    return this.prev(j.Z.sinh(c));
  }, sinhHi: function(c) {
    return this.next(j.Z.sinh(c));
  }, coshLo: function(c) {
    return this.prev(j.Z.cosh(c));
  }, coshHi: function(c) {
    return this.next(j.Z.cosh(c));
  }, tanhLo: function(c) {
    return this.prev(j.Z.tanh(c));
  }, tanhHi: function(c) {
    return this.next(j.Z.tanh(c));
  }, sqrtLo: function(c) {
    return this.prev(Math.sqrt(c));
  }, sqrtHi: function(c) {
    return this.next(Math.sqrt(c));
  }, powLo: function(c, b) {
    var m;
    if (b % 1 != 0)
      return this.prev(Math.pow(c, b));
    for (m = (1 & b) == 1 ? c : 1, b >>= 1; b > 0; )
      c = this.mulLo(c, c), (1 & b) == 1 && (m = this.mulLo(c, m)), b >>= 1;
    return m;
  }, powHi: function(c, b) {
    var m;
    if (b % 1 != 0)
      return this.next(Math.pow(c, b));
    for (m = (1 & b) == 1 ? c : 1, b >>= 1; b > 0; )
      c = this.mulHi(c, c), (1 & b) == 1 && (m = this.mulHi(c, m)), b >>= 1;
    return m;
  }, disable: function() {
    this.next = this.prev = this.identity;
  }, enable: function() {
    this.prev = function(c) {
      return this._prev(c);
    }, this.next = function(c) {
      return this._next(c);
    };
  }, SMALLEST_DENORM: Math.pow(2, -1074), UINT_MAX: -1 >>> 0, nextafter: function(c, b) {
    var m, _;
    return isNaN(c) || isNaN(b) ? NaN : c === b ? c : c === 0 ? b < 0 ? -this.SMALLEST_DENORM : this.SMALLEST_DENORM : (_ = N.hi(c), m = N.lo(c), b > c == c > 0 ? m === this.UINT_MAX ? (_ += 1, m = 0) : m += 1 : m === 0 ? (m = this.UINT_MAX, _ -= 1) : m -= 1, N.pack(m, _));
  } }, a.Z.Math.IntervalArithmetic.PI = new A(j.Z.IntervalArithmetic.piLow, j.Z.IntervalArithmetic.piHigh), a.Z.Math.IntervalArithmetic.PI_HALF = new A(j.Z.IntervalArithmetic.piHalfLow, j.Z.IntervalArithmetic.piHalfHigh), a.Z.Math.IntervalArithmetic.PI_TWICE = new A(j.Z.IntervalArithmetic.piTwiceLow, j.Z.IntervalArithmetic.piTwiceHigh), a.Z.Math.IntervalArithmetic.ZERO = new A(0), a.Z.Math.IntervalArithmetic.ONE = new A(1), a.Z.Math.IntervalArithmetic.WHOLE = new A().setWhole(), a.Z.Math.IntervalArithmetic.EMPTY = new A().setEmpty();
  const E = a.Z.Math.IntervalArithmetic;
}, 275: (d, M, x) => {
  x.d(M, { Z: () => A });
  var a, j = x(765), k = x(109), N = function(E) {
    var c, b;
    return E.memo || (c = {}, b = Array.prototype.join, E.memo = function() {
      var m = b.call(arguments);
      return c[m] !== a ? c[m] : c[m] = E.apply(this, arguments);
    }), E.memo;
  };
  j.Z.Math = { eps: 1e-6, relDif: function(E, c) {
    var b = Math.abs(E), m = Math.abs(c);
    return (m = Math.max(b, m)) === 0 ? 0 : Math.abs(E - c) / m;
  }, mod: function(E, c) {
    return E - Math.floor(E / c) * c;
  }, vector: function(E, c) {
    var b, m;
    for (c = c || 0, b = [], m = 0; m < E; m++)
      b[m] = c;
    return b;
  }, matrix: function(E, c, b) {
    var m, _, f;
    for (b = b || 0, c = c || E, m = [], _ = 0; _ < E; _++)
      for (m[_] = [], f = 0; f < c; f++)
        m[_][f] = b;
    return m;
  }, identity: function(E, c) {
    var b, m;
    for (c === a && typeof c != "number" && (c = E), b = this.matrix(E, c), m = 0; m < Math.min(E, c); m++)
      b[m][m] = 1;
    return b;
  }, frustum: function(E, c, b, m, _, f) {
    var g = this.matrix(4, 4);
    return g[0][0] = 2 * _ / (c - E), g[0][1] = 0, g[0][2] = (c + E) / (c - E), g[0][3] = 0, g[1][0] = 0, g[1][1] = 2 * _ / (m - b), g[1][2] = (m + b) / (m - b), g[1][3] = 0, g[2][0] = 0, g[2][1] = 0, g[2][2] = -(f + _) / (f - _), g[2][3] = -f * _ * 2 / (f - _), g[3][0] = 0, g[3][1] = 0, g[3][2] = -1, g[3][3] = 0, g;
  }, projection: function(E, c, b, m) {
    var _ = b * Math.tan(E / 2), f = _ * c;
    return this.frustum(-f, f, -_, _, b, m);
  }, matVecMult: function(E, c) {
    var b, m, _, f = E.length, g = c.length, C = [];
    if (g === 3)
      for (b = 0; b < f; b++)
        C[b] = E[b][0] * c[0] + E[b][1] * c[1] + E[b][2] * c[2];
    else
      for (b = 0; b < f; b++) {
        for (m = 0, _ = 0; _ < g; _++)
          m += E[b][_] * c[_];
        C[b] = m;
      }
    return C;
  }, matMatMult: function(E, c) {
    var b, m, _, f, g = E.length, C = g > 0 ? c[0].length : 0, P = c.length, w = this.matrix(g, C);
    for (b = 0; b < g; b++)
      for (m = 0; m < C; m++) {
        for (_ = 0, f = 0; f < P; f++)
          _ += E[b][f] * c[f][m];
        w[b][m] = _;
      }
    return w;
  }, transpose: function(E) {
    var c, b, m, _, f;
    for (_ = E.length, f = E.length > 0 ? E[0].length : 0, c = this.matrix(f, _), b = 0; b < f; b++)
      for (m = 0; m < _; m++)
        c[b][m] = E[m][b];
    return c;
  }, inverse: function(E) {
    var c, b, m, _, f, g, C, P = E.length, w = [], T = [], D = [];
    for (c = 0; c < P; c++) {
      for (w[c] = [], b = 0; b < P; b++)
        w[c][b] = E[c][b];
      T[c] = c;
    }
    for (b = 0; b < P; b++) {
      for (f = Math.abs(w[b][b]), g = b, c = b + 1; c < P; c++)
        Math.abs(w[c][b]) > f && (f = Math.abs(w[c][b]), g = c);
      if (f <= this.eps)
        return [];
      if (g > b) {
        for (m = 0; m < P; m++)
          C = w[b][m], w[b][m] = w[g][m], w[g][m] = C;
        C = T[b], T[b] = T[g], T[g] = C;
      }
      for (_ = 1 / w[b][b], c = 0; c < P; c++)
        w[c][b] *= _;
      for (w[b][b] = _, m = 0; m < P; m++)
        if (m !== b) {
          for (c = 0; c < P; c++)
            c !== b && (w[c][m] -= w[c][b] * w[b][m]);
          w[b][m] = -_ * w[b][m];
        }
    }
    for (c = 0; c < P; c++) {
      for (m = 0; m < P; m++)
        D[T[m]] = w[c][m];
      for (m = 0; m < P; m++)
        w[c][m] = D[m];
    }
    return w;
  }, innerProduct: function(E, c, b) {
    var m, _ = 0;
    for (b !== a && k.Z.isNumber(b) || (b = E.length), m = 0; m < b; m++)
      _ += E[m] * c[m];
    return _;
  }, crossProduct: function(E, c) {
    return [E[1] * c[2] - E[2] * c[1], E[2] * c[0] - E[0] * c[2], E[0] * c[1] - E[1] * c[0]];
  }, norm: function(E, c) {
    var b, m = 0;
    for (c !== a && k.Z.isNumber(c) || (c = E.length), b = 0; b < c; b++)
      m += E[b] * E[b];
    return Math.sqrt(m);
  }, axpy: function(E, c, b) {
    var m, _ = c.length, f = [];
    for (m = 0; m < _; m++)
      f[m] = E * c[m] + b[m];
    return f;
  }, factorial: N(function(E) {
    return E < 0 ? NaN : (E = Math.floor(E)) === 0 || E === 1 ? 1 : E * this.factorial(E - 1);
  }), binomial: N(function(E, c) {
    var b, m;
    if (c > E || c < 0)
      return NaN;
    if (c = Math.round(c), E = Math.round(E), c === 0 || c === E)
      return 1;
    for (b = 1, m = 0; m < c; m++)
      b *= E - m, b /= m + 1;
    return b;
  }), cosh: Math.cosh || function(E) {
    return 0.5 * (Math.exp(E) + Math.exp(-E));
  }, sinh: Math.sinh || function(E) {
    return 0.5 * (Math.exp(E) - Math.exp(-E));
  }, acosh: Math.acosh || function(E) {
    return Math.log(E + Math.sqrt(E * E - 1));
  }, asinh: Math.asinh || function(E) {
    return E === -1 / 0 ? E : Math.log(E + Math.sqrt(E * E + 1));
  }, cot: function(E) {
    return 1 / Math.tan(E);
  }, acot: function(E) {
    return (E >= 0 ? 0.5 : -0.5) * Math.PI - Math.atan(E);
  }, nthroot: function(E, c) {
    var b = 1 / c;
    return c <= 0 || Math.floor(c) !== c ? NaN : E === 0 ? 0 : E > 0 ? Math.exp(b * Math.log(E)) : c % 2 == 1 ? -Math.exp(b * Math.log(-E)) : NaN;
  }, cbrt: Math.cbrt || function(E) {
    return this.nthroot(E, 3);
  }, pow: function(E, c) {
    return E === 0 ? c === 0 ? 1 : 0 : Math.floor(c) === c ? Math.pow(E, c) : E > 0 ? Math.exp(c * Math.log(E)) : NaN;
  }, ratpow: function(E, c, b) {
    var m;
    return c === 0 ? 1 : b === 0 ? NaN : (m = this.gcd(c, b), this.nthroot(this.pow(E, c / m), b / m));
  }, log10: function(E) {
    return Math.log(E) / Math.log(10);
  }, log2: function(E) {
    return Math.log(E) / Math.log(2);
  }, log: function(E, c) {
    return c !== void 0 && k.Z.isNumber(c) ? Math.log(E) / Math.log(c) : Math.log(E);
  }, sign: Math.sign || function(E) {
    return (E = +E) == 0 || isNaN(E) ? E : E > 0 ? 1 : -1;
  }, squampow: function(E, c) {
    var b;
    if (Math.floor(c) === c) {
      for (b = 1, c < 0 && (E = 1 / E, c *= -1); c !== 0; )
        1 & c && (b *= E), c >>= 1, E *= E;
      return b;
    }
    return this.pow(E, c);
  }, gcd: function(E, c) {
    var b;
    if (E = Math.abs(E), c = Math.abs(c), !k.Z.isNumber(E) || !k.Z.isNumber(c))
      return NaN;
    for (c > E && (b = E, E = c, c = b); ; ) {
      if ((E %= c) === 0)
        return c;
      if ((c %= E) === 0)
        return E;
    }
  }, lcm: function(E, c) {
    var b;
    return k.Z.isNumber(E) && k.Z.isNumber(c) ? (b = E * c) !== 0 ? b / this.gcd(E, c) : 0 : NaN;
  }, erf: function(E) {
    return this.ProbFuncs.erf(E);
  }, erfc: function(E) {
    return this.ProbFuncs.erfc(E);
  }, erfi: function(E) {
    return this.ProbFuncs.erfi(E);
  }, ndtr: function(E) {
    return this.ProbFuncs.ndtr(E);
  }, ndtri: function(E) {
    return this.ProbFuncs.ndtri(E);
  }, lt: function(E, c) {
    return E < c;
  }, leq: function(E, c) {
    return E <= c;
  }, gt: function(E, c) {
    return E > c;
  }, geq: function(E, c) {
    return E >= c;
  }, eq: function(E, c) {
    return E === c;
  }, neq: function(E, c) {
    return E !== c;
  }, and: function(E, c) {
    return E && c;
  }, not: function(E) {
    return !E;
  }, or: function(E, c) {
    return E || c;
  }, xor: function(E, c) {
    return (E || c) && !(E && c);
  }, normalize: function(E) {
    var c, b, m = 2 * E[3], _ = E[4] / m;
    return E[5] = _, E[6] = -E[1] / m, E[7] = -E[2] / m, isFinite(_) ? Math.abs(_) >= 1 ? (E[0] = (E[6] * E[6] + E[7] * E[7] - _ * _) / (2 * _), E[1] = -E[6] / _, E[2] = -E[7] / _, E[3] = 1 / (2 * _), E[4] = 1) : (b = _ <= 0 ? -1 : 1, E[0] = b * (E[6] * E[6] + E[7] * E[7] - _ * _) * 0.5, E[1] = -b * E[6], E[2] = -b * E[7], E[3] = b / 2, E[4] = b * _) : (c = Math.sqrt(E[1] * E[1] + E[2] * E[2]), E[0] /= c, E[1] /= c, E[2] /= c, E[3] = 0, E[4] = 1), E;
  }, toGL: function(E) {
    var c, b, m;
    if (c = typeof Float32Array == "function" ? new Float32Array(16) : new Array(16), E.length !== 4 && E[0].length !== 4)
      return c;
    for (b = 0; b < 4; b++)
      for (m = 0; m < 4; m++)
        c[b + 4 * m] = E[b][m];
    return c;
  }, Vieta: function(E) {
    var c, b, m, _ = E.length, f = [];
    for (f = E.slice(), c = 1; c < _; ++c) {
      for (m = f[c], f[c] *= f[c - 1], b = c - 1; b >= 1; --b)
        f[b] += f[b - 1] * m;
      f[0] += m;
    }
    return f;
  } };
  const A = j.Z.Math;
}, 336: (d, M, x) => {
  x.d(M, { Z: () => E });
  var a = x(765), j = x(109), k = x(503), N = x(275), A = { rk4: { s: 4, A: [[0, 0, 0, 0], [0.5, 0, 0, 0], [0, 0.5, 0, 0], [0, 0, 1, 0]], b: [1 / 6, 1 / 3, 1 / 3, 1 / 6], c: [0, 0.5, 0.5, 1] }, heun: { s: 2, A: [[0, 0], [1, 0]], b: [0.5, 0.5], c: [0, 1] }, euler: { s: 1, A: [[0]], b: [1], c: [0] } };
  N.Z.Numerics = { Gauss: function(c, b) {
    var m, _, f, g, C, P = N.Z.eps, w = c.length > 0 ? c[0].length : 0;
    if (w !== b.length || w !== c.length)
      throw new Error("JXG.Math.Numerics.Gauss: Dimensions don't match. A must be a square matrix and b must be of the same length as A.");
    for (g = [], C = b.slice(0, w), m = 0; m < w; m++)
      g[m] = c[m].slice(0, w);
    for (_ = 0; _ < w; _++) {
      for (m = w - 1; m > _; m--)
        if (Math.abs(g[m][_]) > P)
          if (Math.abs(g[_][_]) < P)
            j.Z.swap(g, m, _), j.Z.swap(C, m, _);
          else
            for (g[m][_] /= g[_][_], C[m] -= g[m][_] * C[_], f = _ + 1; f < w; f++)
              g[m][f] -= g[m][_] * g[_][f];
      if (Math.abs(g[_][_]) < P)
        throw new Error("JXG.Math.Numerics.Gauss(): The given matrix seems to be singular.");
    }
    return this.backwardSolve(g, C, !0), C;
  }, backwardSolve: function(c, b, m) {
    var _, f, g, C, P;
    for (_ = m ? b : b.slice(0, b.length), f = c.length, g = c.length > 0 ? c[0].length : 0, C = f - 1; C >= 0; C--) {
      for (P = g - 1; P > C; P--)
        _[C] -= c[C][P] * _[P];
      _[C] /= c[C][C];
    }
    return _;
  }, gaussBareiss: function(c) {
    var b, m, _, f, g, C, P, w, T, D = N.Z.eps;
    if ((P = c.length) <= 0)
      return 0;
    for (c[0].length < P && (P = c[0].length), w = [], f = 0; f < P; f++)
      w[f] = c[f].slice(0, P);
    for (m = 1, _ = 1, b = 0; b < P - 1; b++) {
      if (C = w[b][b], Math.abs(C) < D) {
        for (f = b + 1; f < P && !(Math.abs(w[f][b]) >= D); f++)
          ;
        if (f === P)
          return 0;
        for (g = b; g < P; g++)
          T = w[f][g], w[f][g] = w[b][g], w[b][g] = T;
        _ = -_, C = w[b][b];
      }
      for (f = b + 1; f < P; f++)
        for (g = b + 1; g < P; g++)
          T = C * w[f][g] - w[f][b] * w[b][g], w[f][g] = T / m;
      m = C;
    }
    return _ * w[P - 1][P - 1];
  }, det: function(c) {
    return c.length === 2 && c[0].length === 2 ? c[0][0] * c[1][1] - c[1][0] * c[0][1] : this.gaussBareiss(c);
  }, Jacobi: function(c) {
    var b, m, _, f, g, C, P, w, T, D = N.Z.eps * N.Z.eps, I = 0, Y = c.length, U = [[0, 0, 0], [0, 0, 0], [0, 0, 0]], J = [[0, 0, 0], [0, 0, 0], [0, 0, 0]], z = 0;
    for (b = 0; b < Y; b++) {
      for (m = 0; m < Y; m++)
        U[b][m] = 0, J[b][m] = c[b][m], I += Math.abs(J[b][m]);
      U[b][b] = 1;
    }
    if (Y === 1)
      return [J, U];
    if (I <= 0)
      return [J, U];
    I /= Y * Y;
    do {
      for (w = 0, T = 0, m = 1; m < Y; m++)
        for (b = 0; b < m; b++)
          if ((f = Math.abs(J[b][m])) > T && (T = f), w += f, f >= D) {
            for (f = 0.5 * Math.atan2(2 * J[b][m], J[b][b] - J[m][m]), g = Math.sin(f), C = Math.cos(f), _ = 0; _ < Y; _++)
              P = J[_][b], J[_][b] = C * P + g * J[_][m], J[_][m] = -g * P + C * J[_][m], P = U[_][b], U[_][b] = C * P + g * U[_][m], U[_][m] = -g * P + C * U[_][m];
            for (J[b][b] = C * J[b][b] + g * J[m][b], J[m][m] = -g * J[b][m] + C * J[m][m], J[b][m] = 0, _ = 0; _ < Y; _++)
              J[b][_] = J[_][b], J[m][_] = J[_][m];
          }
      z += 1;
    } while (Math.abs(w) / I > D && z < 2e3);
    return [J, U];
  }, NewtonCotes: function(c, b, m) {
    var _, f, g, C = 0, P = m && j.Z.isNumber(m.number_of_nodes) ? m.number_of_nodes : 28, w = { trapez: !0, simpson: !0, milne: !0 }, T = m && m.integration_type && w.hasOwnProperty(m.integration_type) && w[m.integration_type] ? m.integration_type : "milne", D = (c[1] - c[0]) / P;
    switch (T) {
      case "trapez":
        for (C = 0.5 * (b(c[0]) + b(c[1])), _ = c[0], f = 0; f < P - 1; f++)
          C += b(_ += D);
        C *= D;
        break;
      case "simpson":
        if (P % 2 > 0)
          throw new Error("JSXGraph:  INT_SIMPSON requires config.number_of_nodes dividable by 2.");
        for (g = P / 2, C = b(c[0]) + b(c[1]), _ = c[0], f = 0; f < g - 1; f++)
          C += 2 * b(_ += 2 * D);
        for (_ = c[0] - D, f = 0; f < g; f++)
          C += 4 * b(_ += 2 * D);
        C *= D / 3;
        break;
      default:
        if (P % 4 > 0)
          throw new Error("JSXGraph: Error in INT_MILNE: config.number_of_nodes must be a multiple of 4");
        for (g = 0.25 * P, C = 7 * (b(c[0]) + b(c[1])), _ = c[0], f = 0; f < g - 1; f++)
          C += 14 * b(_ += 4 * D);
        for (_ = c[0] - 3 * D, f = 0; f < g; f++)
          C += 32 * (b(_ += 4 * D) + b(_ + 2 * D));
        for (_ = c[0] - 2 * D, f = 0; f < g; f++)
          C += 12 * b(_ += 4 * D);
        C *= 2 * D / 45;
    }
    return C;
  }, Romberg: function(c, b, m) {
    var _, f, g, C, P, w, T, D, I = [], Y = 0, U = 1 / 0, J = m && j.Z.isNumber(m.max_iterations) ? m.max_iterations : 20, z = m && j.Z.isNumber(m.eps) ? m.eps : m.eps || 1e-7;
    for (_ = c[0], g = (f = c[1]) - _, P = 1, I[0] = 0.5 * g * (b(_) + b(f)), w = 0; w < J; ++w) {
      for (C = 0, g *= 0.5, P *= 2, D = 1, T = 1; T < P; T += 2)
        C += b(_ + T * g);
      for (I[w + 1] = 0.5 * I[w] + C * g, Y = I[w + 1], T = w - 1; T >= 0; --T)
        D *= 4, I[T] = I[T + 1] + (I[T + 1] - I[T]) / (D - 1), Y = I[T];
      if (Math.abs(Y - U) < z * Math.abs(Y))
        break;
      U = Y;
    }
    return Y;
  }, GaussLegendre: function(c, b, m) {
    var _, f, g, C, P, w, T, D, I = 0, Y = [], U = [], J = m && j.Z.isNumber(m.n) ? m.n : 12;
    if (J > 18 && (J = 18), Y[2] = [0.5773502691896257], U[2] = [1], Y[4] = [0.33998104358485626, 0.8611363115940526], U[4] = [0.6521451548625461, 0.34785484513745385], Y[6] = [0.2386191860831969, 0.6612093864662645, 0.932469514203152], U[6] = [0.46791393457269104, 0.3607615730481386, 0.17132449237917036], Y[8] = [0.1834346424956498, 0.525532409916329, 0.7966664774136267, 0.9602898564975363], U[8] = [0.362683783378362, 0.31370664587788727, 0.22238103445337448, 0.10122853629037626], Y[10] = [0.14887433898163122, 0.4333953941292472, 0.6794095682990244, 0.8650633666889845, 0.9739065285171717], U[10] = [0.29552422471475287, 0.26926671930999635, 0.21908636251598204, 0.1494513491505806, 0.06667134430868814], Y[12] = [0.1252334085114689, 0.3678314989981802, 0.5873179542866175, 0.7699026741943047, 0.9041172563704749, 0.9815606342467192], U[12] = [0.24914704581340277, 0.2334925365383548, 0.20316742672306592, 0.16007832854334622, 0.10693932599531843, 0.04717533638651183], Y[14] = [0.10805494870734367, 0.31911236892788974, 0.5152486363581541, 0.6872929048116855, 0.827201315069765, 0.9284348836635735, 0.9862838086968123], U[14] = [0.2152638534631578, 0.2051984637212956, 0.18553839747793782, 0.15720316715819355, 0.12151857068790319, 0.08015808715976021, 0.03511946033175186], Y[16] = [0.09501250983763744, 0.2816035507792589, 0.45801677765722737, 0.6178762444026438, 0.755404408355003, 0.8656312023878318, 0.9445750230732326, 0.9894009349916499], U[16] = [0.1894506104550685, 0.18260341504492358, 0.16915651939500254, 0.14959598881657674, 0.12462897125553388, 0.09515851168249279, 0.062253523938647894, 0.027152459411754096], Y[18] = [0.0847750130417353, 0.2518862256915055, 0.41175116146284263, 0.5597708310739475, 0.6916870430603532, 0.8037049589725231, 0.8926024664975557, 0.9558239495713977, 0.9915651684209309], U[18] = [0.1691423829631436, 0.16427648374583273, 0.15468467512626524, 0.14064291467065065, 0.12255520671147846, 0.10094204410628717, 0.07642573025488905, 0.0497145488949698, 0.02161601352648331], Y[3] = [0, 0.7745966692414834], U[3] = [0.8888888888888888, 0.5555555555555556], Y[5] = [0, 0.5384693101056831, 0.906179845938664], U[5] = [0.5688888888888889, 0.47862867049936647, 0.23692688505618908], Y[7] = [0, 0.4058451513773972, 0.7415311855993945, 0.9491079123427585], U[7] = [0.4179591836734694, 0.3818300505051189, 0.27970539148927664, 0.1294849661688697], Y[9] = [0, 0.3242534234038089, 0.6133714327005904, 0.8360311073266358, 0.9681602395076261], U[9] = [0.3302393550012598, 0.31234707704000286, 0.26061069640293544, 0.1806481606948574, 0.08127438836157441], Y[11] = [0, 0.26954315595234496, 0.5190961292068118, 0.7301520055740494, 0.8870625997680953, 0.978228658146057], U[11] = [0.2729250867779006, 0.26280454451024665, 0.23319376459199048, 0.18629021092773426, 0.1255803694649046, 0.05566856711617366], Y[13] = [0, 0.2304583159551348, 0.44849275103644687, 0.6423493394403402, 0.8015780907333099, 0.9175983992229779, 0.9841830547185881], U[13] = [0.2325515532308739, 0.22628318026289723, 0.2078160475368885, 0.17814598076194574, 0.13887351021978725, 0.09212149983772845, 0.04048400476531588], Y[15] = [0, 0.20119409399743451, 0.3941513470775634, 0.5709721726085388, 0.7244177313601701, 0.8482065834104272, 0.937273392400706, 0.9879925180204854], U[15] = [0.2025782419255613, 0.19843148532711158, 0.1861610000155622, 0.16626920581699392, 0.13957067792615432, 0.10715922046717194, 0.07036604748810812, 0.03075324199611727], Y[17] = [0, 0.17848418149584785, 0.3512317634538763, 0.5126905370864769, 0.6576711592166907, 0.7815140038968014, 0.8802391537269859, 0.9506755217687678, 0.9905754753144174], U[17] = [0.17944647035620653, 0.17656270536699264, 0.16800410215645004, 0.15404576107681028, 0.13513636846852548, 0.11188384719340397, 0.08503614831717918, 0.0554595293739872, 0.02414830286854793], _ = c[0], f = c[1], C = J + 1 >> 1, T = Y[J], D = U[J], w = 0.5 * (f - _), P = 0.5 * (f + _), !0 & J)
      for (I = D[0] * b(P), g = 1; g < C; ++g)
        I += D[g] * (b(P + w * T[g]) + b(P - w * T[g]));
    else
      for (I = 0, g = 0; g < C; ++g)
        I += D[g] * (b(P + w * T[g]) + b(P - w * T[g]));
    return w * I;
  }, _rescale_error: function(c, b, m) {
    var _, f, g = 2220446049250313e-31;
    return c = Math.abs(c), m !== 0 && c !== 0 && (c = (_ = Math.pow(200 * c / m, 1.5)) < 1 ? m * _ : m), b > 20041683600089728e-310 && (f = 50 * g * b) > c && (c = f), c;
  }, _gaussKronrod: function(c, b, m, _, f, g, C) {
    var P, w, T, D, I, Y, U, J, z, V, $, ne = c[0], Q = c[1], K = 0.5 * (ne + Q), te = 0.5 * (Q - ne), se = Math.abs(te), de = b(K), ae = 0, ce = de * g[m - 1], fe = Math.abs(ce), Re = 0, ke = [], je = [];
    for (m % 2 == 0 && (ae = de * f[m / 2 - 1]), P = Math.floor((m - 1) / 2), I = 0; I < P; I++)
      V = (J = b(K - (U = te * _[Y = 2 * I + 1]))) + (z = b(K + U)), ke[Y] = J, je[Y] = z, ae += f[I] * V, ce += g[Y] * V, fe += g[Y] * (Math.abs(J) + Math.abs(z));
    for (P = Math.floor(m / 2), I = 0; I < P; I++)
      J = b(K - (U = te * _[$ = 2 * I])), z = b(K + U), ke[$] = J, je[$] = z, ce += g[$] * (J + z), fe += g[$] * (Math.abs(J) + Math.abs(z));
    for (T = 0.5 * ce, Re = g[m - 1] * Math.abs(de - T), I = 0; I < m - 1; I++)
      Re += g[I] * (Math.abs(ke[I] - T) + Math.abs(je[I] - T));
    return D = (ce - ae) * te, fe *= se, Re *= se, w = ce *= te, C.abserr = this._rescale_error(D, fe, Re), C.resabs = fe, C.resasc = Re, w;
  }, GaussKronrod15: function(c, b, m) {
    return this._gaussKronrod(c, b, 8, [0.9914553711208126, 0.9491079123427585, 0.8648644233597691, 0.7415311855993945, 0.5860872354676911, 0.4058451513773972, 0.20778495500789848, 0], [0.1294849661688697, 0.27970539148927664, 0.3818300505051189, 0.4179591836734694], [0.022935322010529224, 0.06309209262997856, 0.10479001032225019, 0.14065325971552592, 0.1690047266392679, 0.19035057806478542, 0.20443294007529889, 0.20948214108472782], m);
  }, GaussKronrod21: function(c, b, m) {
    return this._gaussKronrod(c, b, 11, [0.9956571630258081, 0.9739065285171717, 0.9301574913557082, 0.8650633666889845, 0.7808177265864169, 0.6794095682990244, 0.5627571346686047, 0.4333953941292472, 0.2943928627014602, 0.14887433898163122, 0], [0.06667134430868814, 0.1494513491505806, 0.21908636251598204, 0.26926671930999635, 0.29552422471475287], [0.011694638867371874, 0.032558162307964725, 0.054755896574351995, 0.07503967481091996, 0.0931254545836976, 0.10938715880229764, 0.12349197626206584, 0.13470921731147334, 0.14277593857706009, 0.14773910490133849, 0.1494455540029169], m);
  }, GaussKronrod31: function(c, b, m) {
    return this._gaussKronrod(c, b, 16, [0.9980022986933971, 0.9879925180204854, 0.9677390756791391, 0.937273392400706, 0.8972645323440819, 0.8482065834104272, 0.790418501442466, 0.7244177313601701, 0.650996741297417, 0.5709721726085388, 0.4850818636402397, 0.3941513470775634, 0.29918000715316884, 0.20119409399743451, 0.1011420669187175, 0], [0.03075324199611727, 0.07036604748810812, 0.10715922046717194, 0.13957067792615432, 0.16626920581699392, 0.1861610000155622, 0.19843148532711158, 0.2025782419255613], [0.005377479872923349, 0.015007947329316122, 0.02546084732671532, 0.03534636079137585, 0.04458975132476488, 0.05348152469092809, 0.06200956780067064, 0.06985412131872826, 0.07684968075772038, 0.08308050282313302, 0.08856444305621176, 0.09312659817082532, 0.09664272698362368, 0.09917359872179196, 0.10076984552387559, 0.10133000701479154], m);
  }, _workspace: function(c, b) {
    return { limit: b, size: 0, nrmax: 0, i: 0, alist: [c[0]], blist: [c[1]], rlist: [0], elist: [0], order: [0], level: [0], qpsrt: function() {
      var m, _, f, g, C, P = this.size - 1, w = this.limit, T = this.nrmax, D = this.order[T];
      if (P < 2)
        return this.order[0] = 0, this.order[1] = 1, void (this.i = D);
      for (m = this.elist[D]; T > 0 && m > this.elist[this.order[T - 1]]; )
        this.order[T] = this.order[T - 1], T--;
      for (C = P < w / 2 + 2 ? P : w - P + 1, f = T + 1; f < C && m < this.elist[this.order[f]]; )
        this.order[f - 1] = this.order[f], f++;
      for (this.order[f - 1] = D, _ = this.elist[P], g = C - 1; g > f - 2 && _ >= this.elist[this.order[g]]; )
        this.order[g + 1] = this.order[g], g--;
      this.order[g + 1] = P, D = this.order[T], this.i = D, this.nrmax = T;
    }, set_initial_result: function(m, _) {
      this.size = 1, this.rlist[0] = m, this.elist[0] = _;
    }, update: function(m, _, f, g, C, P, w, T) {
      var D = this.i, I = this.size, Y = this.level[this.i] + 1;
      T > g ? (this.alist[D] = C, this.rlist[D] = w, this.elist[D] = T, this.level[D] = Y, this.alist[I] = m, this.blist[I] = _, this.rlist[I] = f, this.elist[I] = g, this.level[I] = Y) : (this.blist[D] = _, this.rlist[D] = f, this.elist[D] = g, this.level[D] = Y, this.alist[I] = C, this.blist[I] = P, this.rlist[I] = w, this.elist[I] = T, this.level[I] = Y), this.size++, Y > this.maximum_level && (this.maximum_level = Y), this.qpsrt();
    }, retrieve: function() {
      var m = this.i;
      return { a: this.alist[m], b: this.blist[m], r: this.rlist[m], e: this.elist[m] };
    }, sum_results: function() {
      var m, _ = this.size, f = 0;
      for (m = 0; m < _; m++)
        f += this.rlist[m];
      return f;
    }, subinterval_too_small: function(m, _, f) {
      var g = 1.0000000000000222 * (Math.abs(_) + 22250738585072014e-321);
      return Math.abs(m) <= g && Math.abs(f) <= g;
    } };
  }, Qag: function(c, b, m) {
    var _, f, g, C, P, w, T, D, I, Y, U, J, z, V, $, ne, Q, K, te = this._workspace(c, 1e3), se = m && j.Z.isNumber(m.limit) ? m.limit : 15, de = m && j.Z.isNumber(m.epsrel) ? m.epsrel : 1e-7, ae = m && j.Z.isNumber(m.epsabs) ? m.epsabs : 1e-7, ce = m && j.Z.isFunction(m.q) ? m.q : this.GaussKronrod15, fe = {}, Re = 0, ke = 0, je = 0, qe = 0, it = 0, nt = 0, ht = 0, at = 0, Je = 0, rt = 0;
    if (se > te.limit && a.Z.warn("iteration limit exceeds available workspace"), ae <= 0 && (de < 50 * N.Z.eps || de < 5e-29) && a.Z.warn("tolerance cannot be acheived with given epsabs and epsrel"), g = ce.apply(this, [c, b, fe]), C = fe.abserr, P = fe.resabs, w = fe.resasc, te.set_initial_result(g, C), T = Math.max(ae, de * Math.abs(g)), C <= 11102230246251565e-30 * P && C > T)
      return a.Z.warn("cannot reach tolerance because of roundoff error on first attempt"), -1 / 0;
    if (C <= T && C !== w || C === 0)
      return g;
    if (se === 1)
      return a.Z.warn("a maximum of one iteration was insufficient"), -1 / 0;
    _ = g, f = C, Re = 1;
    do
      it = 0, nt = 0, ht = 0, at = 0, Je = 0, rt = 0, J = (Q = te.retrieve()).a, z = Q.b, V = Q.r, $ = Q.e, D = J, Y = I = 0.5 * (J + z), U = z, it = ce.apply(this, [[D, I], b, fe]), at = fe.abserr, ne = fe.resasc, nt = ce.apply(this, [[Y, U], b, fe]), f += (rt = at + (Je = fe.abserr)) - $, _ += (ht = it + nt) - V, ne !== at && fe.resasc !== Je && (K = V - ht, Math.abs(K) <= 1e-5 * Math.abs(ht) && rt >= 0.99 * $ && ke++, Re >= 10 && rt > $ && je++), f > (T = Math.max(ae, de * Math.abs(_))) && ((ke >= 6 || je >= 20) && (qe = 2), te.subinterval_too_small(D, Y, U) && (qe = 3)), te.update(D, I, it, at, Y, U, nt, Je), J = (Q = te.retrieve()).a_i, z = Q.b_i, V = Q.r_i, $ = Q.e_i, Re++;
    while (Re < se && !qe && f > T);
    return te.sum_results();
  }, I: function(c, b) {
    return this.Qag(c, b, { q: this.GaussKronrod15, limit: 15, epsrel: 1e-7, epsabs: 1e-7 });
  }, Newton: function(c, b, m) {
    var _, f = 0, g = N.Z.eps, C = c.apply(m, [b]);
    for (j.Z.isArray(b) && (b = b[0]); f < 50 && Math.abs(C) > g; )
      _ = this.D(c, m)(b), Math.abs(_) > g ? b -= C / _ : b += 0.2 * Math.random() - 1, C = c.apply(m, [b]), f += 1;
    return b;
  }, root: function(c, b, m) {
    return this.chandrupatla(c, b, m);
  }, generalizedNewton: function(c, b, m, _) {
    var f, g, C, P, w, T, D, I, Y, U, J, z, V, $, ne = 0;
    for (this.generalizedNewton.t1memo ? (f = this.generalizedNewton.t1memo, g = this.generalizedNewton.t2memo) : (f = m, g = _), U = (I = c.X(f) - b.X(g)) * I + (Y = c.Y(f) - b.Y(g)) * Y, J = this.D(c.X, c), z = this.D(b.X, b), V = this.D(c.Y, c), $ = this.D(b.Y, b); U > N.Z.eps && ne < 10; )
      C = J(f), P = -z(g), w = V(f), f -= ((T = -$(g)) * I - P * Y) / (D = C * T - P * w), g -= (C * Y - w * I) / D, U = (I = c.X(f) - b.X(g)) * I + (Y = c.Y(f) - b.Y(g)) * Y, ne += 1;
    return this.generalizedNewton.t1memo = f, this.generalizedNewton.t2memo = g, Math.abs(f) < Math.abs(g) ? [c.X(f), c.Y(f)] : [b.X(g), b.Y(g)];
  }, Neville: function(c) {
    var b = [], m = function(_) {
      return function(f, g) {
        var C, P, w, T = N.Z.binomial, D = c.length, I = D - 1, Y = 0, U = 0;
        if (!g)
          for (w = 1, C = 0; C < D; C++)
            b[C] = T(I, C) * w, w *= -1;
        for (P = f, C = 0; C < D; C++) {
          if (P === 0)
            return c[C][_]();
          w = b[C] / P, P -= 1, Y += c[C][_]() * w, U += w;
        }
        return Y / U;
      };
    };
    return [m("X"), m("Y"), 0, function() {
      return c.length - 1;
    }];
  }, splineDef: function(c, b) {
    var m, _, f, g = Math.min(c.length, b.length), C = [], P = [], w = [], T = [], D = [], I = [];
    if (g === 2)
      return [0, 0];
    for (_ = 0; _ < g; _++)
      m = { X: c[_], Y: b[_] }, w.push(m);
    for (w.sort(function(Y, U) {
      return Y.X - U.X;
    }), _ = 0; _ < g; _++)
      c[_] = w[_].X, b[_] = w[_].Y;
    for (_ = 0; _ < g - 1; _++)
      T.push(c[_ + 1] - c[_]);
    for (_ = 0; _ < g - 2; _++)
      D.push(6 * (b[_ + 2] - b[_ + 1]) / T[_ + 1] - 6 * (b[_ + 1] - b[_]) / T[_]);
    for (C.push(2 * (T[0] + T[1])), P.push(D[0]), _ = 0; _ < g - 3; _++)
      f = T[_ + 1] / C[_], C.push(2 * (T[_ + 1] + T[_ + 2]) - f * T[_ + 1]), P.push(D[_ + 1] - f * P[_]);
    for (I[g - 3] = P[g - 3] / C[g - 3], _ = g - 4; _ >= 0; _--)
      I[_] = (P[_] - T[_ + 1] * I[_ + 1]) / C[_];
    for (_ = g - 3; _ >= 0; _--)
      I[_ + 1] = I[_];
    return I[0] = 0, I[g - 1] = 0, I;
  }, splineEval: function(c, b, m, _) {
    var f, g, C, P, w, T, D, I = Math.min(b.length, m.length), Y = 1, U = !1, J = [];
    for (j.Z.isArray(c) ? (Y = c.length, U = !0) : c = [c], f = 0; f < Y; f++) {
      if (c[f] < b[0] || b[f] > b[I - 1])
        return NaN;
      for (g = 1; g < I && !(c[f] <= b[g]); g++)
        ;
      C = m[g -= 1], P = (m[g + 1] - m[g]) / (b[g + 1] - b[g]) - (b[g + 1] - b[g]) / 6 * (_[g + 1] + 2 * _[g]), w = _[g] / 2, T = (_[g + 1] - _[g]) / (6 * (b[g + 1] - b[g])), D = c[f] - b[g], J.push(C + (P + (w + T * D) * D) * D);
    }
    return U ? J : J[0];
  }, generatePolynomialTerm: function(c, b, m, _) {
    var f, g = [];
    for (f = b; f >= 0; f--)
      g = g.concat(["(", c[f].toPrecision(_), ")"]), f > 1 ? g = g.concat(["*", m, "<sup>", f, "<", "/sup> + "]) : f === 1 && (g = g.concat(["*", m, " + "]));
    return g.join("");
  }, lagrangePolynomial: function(c) {
    var b = [], m = this, _ = function(f, g) {
      var C, P, w, T, D = c.length, I = 0, Y = 0;
      if (!g)
        for (C = 0; C < D; C++) {
          for (b[C] = 1, w = c[C].X(), P = 0; P < D; P++)
            P !== C && (b[C] *= w - c[P].X());
          b[C] = 1 / b[C];
        }
      for (C = 0; C < D; C++) {
        if (f === (w = c[C].X()))
          return c[C].Y();
        Y += T = b[C] / (f - w), I += T * c[C].Y();
      }
      return I / Y;
    };
    return _.getTerm = function(f, g, C) {
      return m.lagrangePolynomialTerm(c, f, g, C)();
    }, _;
  }, lagrangePolynomialTerm: function(c, b, m, _) {
    return function() {
      var f, g, C, P, w, T, D = c.length, I = [], Y = [], U = [], J = !0;
      for (m = m || "x", _ === void 0 && (_ = " * "), f = D - 1, P = 0; P < D; P++)
        U[P] = 0;
      for (C = 0; C < D; C++) {
        for (w = c[C].Y(), T = c[C].X(), I = [], P = 0; P < D; P++)
          P !== C && (w /= T - c[P].X(), I.push(c[P].X()));
        for (Y = [1].concat(N.Z.Vieta(I)), P = 0; P < Y.length; P++)
          U[P] += (P % 2 == 1 ? -1 : 1) * Y[P] * w;
      }
      for (g = "", P = 0; P < U.length; P++)
        w = U[P], Math.abs(w) < N.Z.eps || (a.Z.exists(b) && (w = k.Z._round10(w, -b)), J ? (g += w > 0 ? w : "-" + -w, J = !1) : g += w > 0 ? " + " + w : " - " + -w, f - P > 1 ? g += _ + m + "^" + (f - P) : f - P == 1 && (g += _ + m));
      return g;
    };
  }, _initCubicPoly: function(c, b, m, _) {
    return [c, m, -3 * c + 3 * b - 2 * m - _, 2 * c - 2 * b + m + _];
  }, CardinalSpline: function(c, b, m) {
    var _, f, g, C, P = [], w = this;
    return C = j.Z.isFunction(b) ? b : function() {
      return b;
    }, m === void 0 && (m = "uniform"), f = function(T) {
      return function(D, I) {
        var Y, U, J, z, V, $, ne, Q, K, te;
        if (c.length < 2)
          return NaN;
        if (!I)
          for (g = C(), J = { X: function() {
            return 2 * c[0].X() - c[1].X();
          }, Y: function() {
            return 2 * c[0].Y() - c[1].Y();
          }, Dist: function(se) {
            var de = this.X() - se.X(), ae = this.Y() - se.Y();
            return Math.sqrt(de * de + ae * ae);
          } }, z = { X: function() {
            return 2 * c[c.length - 1].X() - c[c.length - 2].X();
          }, Y: function() {
            return 2 * c[c.length - 1].Y() - c[c.length - 2].Y();
          }, Dist: function(se) {
            var de = this.X() - se.X(), ae = this.Y() - se.Y();
            return Math.sqrt(de * de + ae * ae);
          } }, te = (_ = [J].concat(c, [z])).length, P[T] = [], Y = 0; Y < te - 3; Y++)
            m === "centripetal" ? (ne = _[Y].Dist(_[Y + 1]), Q = _[Y + 2].Dist(_[Y + 1]), K = _[Y + 3].Dist(_[Y + 2]), ne = Math.sqrt(ne), Q = Math.sqrt(Q), K = Math.sqrt(K), Q < N.Z.eps && (Q = 1), ne < N.Z.eps && (ne = Q), K < N.Z.eps && (K = Q), V = (_[Y + 1][T]() - _[Y][T]()) / ne - (_[Y + 2][T]() - _[Y][T]()) / (Q + ne) + (_[Y + 2][T]() - _[Y + 1][T]()) / Q, $ = (_[Y + 2][T]() - _[Y + 1][T]()) / Q - (_[Y + 3][T]() - _[Y + 1][T]()) / (K + Q) + (_[Y + 3][T]() - _[Y + 2][T]()) / K, V *= Q, $ *= Q, P[T][Y] = w._initCubicPoly(_[Y + 1][T](), _[Y + 2][T](), g * V, g * $)) : P[T][Y] = w._initCubicPoly(_[Y + 1][T](), _[Y + 2][T](), g * (_[Y + 2][T]() - _[Y][T]()), g * (_[Y + 3][T]() - _[Y + 1][T]()));
        return isNaN(D) ? NaN : (te = c.length, D <= 0 ? c[0][T]() : D >= te ? c[te - 1][T]() : (Y = Math.floor(D)) === D ? c[Y][T]() : (D -= Y, (U = P[T][Y]) === void 0 ? NaN : ((U[3] * D + U[2]) * D + U[1]) * D + U[0]));
      };
    }, [f("X"), f("Y"), 0, function() {
      return c.length - 1;
    }];
  }, CatmullRomSpline: function(c, b) {
    return this.CardinalSpline(c, 0.5, b);
  }, regressionPolynomial: function(c, b, m) {
    var _, f, g, C, P, w, T = "";
    if (j.Z.isPoint(c) && j.Z.isFunction(c.Value))
      f = function() {
        return c.Value();
      };
    else if (j.Z.isFunction(c))
      f = c;
    else {
      if (!j.Z.isNumber(c))
        throw new Error("JSXGraph: Can't create regressionPolynomial from degree of type'" + typeof c + "'.");
      f = function() {
        return c;
      };
    }
    if (arguments.length === 3 && j.Z.isArray(b) && j.Z.isArray(m))
      P = 0;
    else if (arguments.length === 2 && j.Z.isArray(b) && b.length > 0 && j.Z.isPoint(b[0]))
      P = 1;
    else {
      if (!(arguments.length === 2 && j.Z.isArray(b) && b.length > 0 && b[0].usrCoords && b[0].scrCoords))
        throw new Error("JSXGraph: Can't create regressionPolynomial. Wrong parameters.");
      P = 2;
    }
    return (w = function(D, I) {
      var Y, U, J, z, V, $, ne, Q, K, te = b.length;
      if (K = Math.floor(f()), !I) {
        if (P === 1)
          for (g = [], C = [], Y = 0; Y < te; Y++)
            g[Y] = b[Y].X(), C[Y] = b[Y].Y();
        if (P === 2)
          for (g = [], C = [], Y = 0; Y < te; Y++)
            g[Y] = b[Y].usrCoords[1], C[Y] = b[Y].usrCoords[2];
        if (P === 0)
          for (g = [], C = [], Y = 0; Y < te; Y++)
            j.Z.isFunction(b[Y]) ? g.push(b[Y]()) : g.push(b[Y]), j.Z.isFunction(m[Y]) ? C.push(m[Y]()) : C.push(m[Y]);
        for (J = [], U = 0; U < te; U++)
          J.push([1]);
        for (Y = 1; Y <= K; Y++)
          for (U = 0; U < te; U++)
            J[U][Y] = J[U][Y - 1] * g[U];
        V = C, z = N.Z.transpose(J), $ = N.Z.matMatMult(z, J), ne = N.Z.matVecMult(z, V), _ = N.Z.Numerics.Gauss($, ne), T = N.Z.Numerics.generatePolynomialTerm(_, K, "x", 3);
      }
      for (Q = _[K], Y = K - 1; Y >= 0; Y--)
        Q = Q * D + _[Y];
      return Q;
    }).getTerm = function() {
      return T;
    }, w;
  }, bezier: function(c) {
    var b, m, _ = function(f) {
      return function(g, C) {
        var P = 3 * Math.floor(g), w = g % 1, T = 1 - w;
        return C || (m = 3 * Math.floor((c.length - 1) / 3), b = Math.floor(m / 3)), g < 0 ? c[0][f]() : g >= b ? c[m][f]() : isNaN(g) ? NaN : T * T * (T * c[P][f]() + 3 * w * c[P + 1][f]()) + (3 * T * c[P + 2][f]() + w * c[P + 3][f]()) * w * w;
      };
    };
    return [_("X"), _("Y"), 0, function() {
      return Math.floor(c.length / 3);
    }];
  }, bspline: function(c, b) {
    var m, _ = function(f) {
      return function(g, C) {
        var P, w, T, D, I = c.length, Y = I - 1, U = b;
        if (Y <= 0)
          return NaN;
        if (Y + 2 <= U && (U = Y + 1), g <= 0)
          return c[0][f]();
        if (g >= Y - U + 2)
          return c[Y][f]();
        for (T = Math.floor(g) + U - 1, m = function(J, z) {
          var V, $ = [];
          for (V = 0; V < J + z + 1; V++)
            $[V] = V < z ? 0 : V <= J ? V - z + 1 : J - z + 2;
          return $;
        }(Y, U), D = function(J, z, V, $) {
          var ne, Q, K, te, se, de = [];
          for (z[$] <= J && J < z[$ + 1] ? de[$] = 1 : de[$] = 0, ne = 2; ne <= V; ne++)
            for (Q = $ - ne + 1; Q <= $; Q++)
              K = Q <= $ - ne + 1 || Q < 0 ? 0 : de[Q], te = Q >= $ ? 0 : de[Q + 1], se = z[Q + ne - 1] - z[Q], de[Q] = se === 0 ? 0 : (J - z[Q]) / se * K, (se = z[Q + ne] - z[Q + 1]) != 0 && (de[Q] += (z[Q + ne] - J) / se * te);
          return de;
        }(g, m, U, T), P = 0, w = T - U + 1; w <= T; w++)
          w < I && w >= 0 && (P += c[w][f]() * D[w]);
        return P;
      };
    };
    return [_("X"), _("Y"), 0, function() {
      return c.length - 1;
    }];
  }, D: function(c, b) {
    return j.Z.exists(b) ? function(m, _) {
      var f = 1e-5;
      return (c.apply(b, [m + f, _]) - c.apply(b, [m - f, _])) / 2e-5;
    } : function(m, _) {
      var f = 1e-5;
      return (c(m + f, _) - c(m - f, _)) / 2e-5;
    };
  }, _riemannValue: function(c, b, m, _) {
    var f, g, C, P;
    if (_ < 0 && (m !== "trapezoidal" && (c += _), _ *= -1, m === "lower" ? m = "upper" : m === "upper" && (m = "lower")), P = 0.01 * _, m === "right")
      f = b(c + _);
    else if (m === "middle")
      f = b(c + 0.5 * _);
    else if (m === "left" || m === "trapezoidal")
      f = b(c);
    else if (m === "lower") {
      for (f = b(c), C = c + P; C <= c + _; C += P)
        (g = b(C)) < f && (f = g);
      (g = b(c + _)) < f && (f = g);
    } else if (m === "upper") {
      for (f = b(c), C = c + P; C <= c + _; C += P)
        (g = b(C)) > f && (f = g);
      (g = b(c + _)) > f && (f = g);
    } else
      f = m === "random" ? b(c + _ * Math.random()) : m === "simpson" ? (b(c) + 4 * b(c + 0.5 * _) + b(c + _)) / 6 : b(c);
    return f;
  }, riemann: function(c, b, m, _, f) {
    var g, C, P, w, T, D, I, Y = [], U = [], J = 0, z = _, V = 0;
    if (j.Z.isArray(c) ? (T = c[0], w = c[1]) : w = c, (b = Math.floor(b)) <= 0)
      return [Y, U, V];
    for (C = (f - _) / b, g = 0; g < b; g++)
      P = this._riemannValue(z, w, m, C), Y[J] = z, U[J] = P, J += 1, z += C, m === "trapezoidal" && (P = w(z)), Y[J] = z, U[J] = P, J += 1;
    for (g = 0; g < b; g++)
      P = T ? this._riemannValue(z, T, m, -C) : 0, Y[J] = z, U[J] = P, J += 1, z -= C, m === "trapezoidal" && T && (P = T(z)), Y[J] = z, U[J] = P, m !== "trapezoidal" ? (D = P, I = U[2 * (b - 1) - 2 * g]) : (I = 0.5 * (w(z + C) + w(z)), D = T ? 0.5 * (T(z + C) + T(z)) : 0), V += (I - D) * C, Y[J += 1] = z, U[J] = U[2 * (b - 1) - 2 * g], J += 1;
    return [Y, U, V];
  }, riemannsum: function(c, b, m, _, f) {
    return a.Z.deprecated("Numerics.riemannsum()", "Numerics.riemann()"), this.riemann(c, b, m, _, f)[2];
  }, rungeKutta: function(c, b, m, _, f) {
    var g, C, P, w, T, D, I = [], Y = [], U = (m[1] - m[0]) / _, J = m[0], z = b.length, V = [], $ = 0;
    for (j.Z.isString(c) && (c = A[c] || A.euler), D = c.s, g = 0; g < z; g++)
      I[g] = b[g];
    for (C = 0; C < _; C++) {
      for (V[$] = [], g = 0; g < z; g++)
        V[$][g] = I[g];
      for ($ += 1, w = [], P = 0; P < D; P++) {
        for (g = 0; g < z; g++)
          Y[g] = 0;
        for (T = 0; T < P; T++)
          for (g = 0; g < z; g++)
            Y[g] += c.A[P][T] * U * w[T][g];
        for (g = 0; g < z; g++)
          Y[g] += I[g];
        w.push(f(J + c.c[P] * U, Y));
      }
      for (g = 0; g < z; g++)
        Y[g] = 0;
      for (T = 0; T < D; T++)
        for (g = 0; g < z; g++)
          Y[g] += c.b[T] * w[T][g];
      for (g = 0; g < z; g++)
        I[g] = I[g] + U * Y[g];
      J += U;
    }
    return V;
  }, maxIterationsRoot: 80, maxIterationsMinimize: 500, findBracket: function(c, b, m) {
    var _, f, g, C, P, w, T, D, I, Y;
    if (j.Z.isArray(b))
      return b;
    for (_ = b, g = c.call(m, _), Y = (C = [_ - 0.1 * (f = _ === 0 ? 1 : _), _ + 0.1 * f, _ - 1, _ + 1, _ - 0.5 * f, _ + 0.5 * f, _ - 0.6 * f, _ + 0.6 * f, _ - 1 * f, _ + 1 * f, _ - 2 * f, _ + 2 * f, _ - 5 * f, _ + 5 * f, _ - 10 * f, _ + 10 * f, _ - 50 * f, _ + 50 * f, _ - 100 * f, _ + 100 * f]).length, I = 0; I < Y && (P = C[I], !(g * (w = c.call(m, P)) <= 0)); I++)
      ;
    return P < _ && (T = _, _ = P, P = T, D = g, g = w, w = D), [_, g, P, w];
  }, fzero: function(c, b, m) {
    var _, f, g, C, P, w, T, D, I, Y, U, J, z, V, $, ne = N.Z.eps, Q = this.maxIterationsRoot, K = 0;
    if (j.Z.isArray(b)) {
      if (b.length < 2)
        throw new Error("JXG.Math.Numerics.fzero: length of array x0 has to be at least two.");
      _ = b[0], C = c.call(m, _), f = b[1], P = c.call(m, f);
    } else
      _ = (T = this.findBracket(c, b, m))[0], C = T[1], f = T[2], P = T[3];
    if (Math.abs(C) <= ne)
      return _;
    if (Math.abs(P) <= ne)
      return f;
    if (C * P > 0)
      return j.Z.isArray(b) ? this.fminbr(c, [_, f], m) : this.Newton(c, _, m);
    for (g = _, w = C; K < Q; ) {
      if (D = f - _, Math.abs(w) < Math.abs(P) && (_ = f, f = g, g = _, C = P, P = w, w = C), J = 2 * ne * Math.abs(f) + 0.5 * ne, $ = 0.5 * (g - f), Math.abs($) <= J || Math.abs(P) <= ne)
        return f;
      Math.abs(D) >= J && Math.abs(C) > Math.abs(P) && (Y = g - f, _ === g ? (z = Y * (I = P / C), V = 1 - I) : (z = (U = P / C) * (Y * (V = C / w) * (V - (I = P / w)) - (f - _) * (I - 1)), V = (V - 1) * (I - 1) * (U - 1)), z > 0 ? V = -V : z = -z, z < 0.75 * Y * V - 0.5 * Math.abs(J * V) && z < Math.abs(D * V * 0.5) && ($ = z / V)), Math.abs($) < J && ($ = $ > 0 ? J : -J), _ = f, C = P, f += $, ((P = c.call(m, f)) > 0 && w > 0 || P < 0 && w < 0) && (g = _, w = C), K++;
    }
    return f;
  }, chandrupatla: function(c, b, m) {
    var _, f, g, C, P, w, T, D, I, Y, U, J, z, V, $, ne, Q, K, te, se, de = 0, ae = this.maxIterationsRoot, ce = 1 + 1e-3 * Math.random(), fe = 0.5 * ce, Re = N.Z.eps;
    if (j.Z.isArray(b)) {
      if (b.length < 2)
        throw new Error("JXG.Math.Numerics.fzero: length of array x0 has to be at least two.");
      _ = b[0], f = c.call(m, _), g = b[1], C = c.call(m, g);
    } else
      _ = (P = this.findBracket(c, b, m))[0], f = P[1], g = P[2], C = P[3];
    if (f * C > 0)
      return j.Z.isArray(b) ? this.fminbr(c, [_, g], m) : this.Newton(c, _, m);
    w = _, T = g, Y = f, U = C;
    do {
      if (I = w + fe * (T - w), z = c.call(m, I), Math.sign(z) === Math.sign(Y) ? (D = w, w = I, J = Y, Y = z) : (D = T, T = w, J = U, U = Y), V = w = I, $ = Y = z, Math.abs(U) < Math.abs(Y) && (V = T, $ = U), (ne = (2 * Re * Math.abs(V) + 5e-6) / Math.abs(T - w)) > 0.5 || $ === 0)
        break;
      Q = (w - T) / (D - T), K = (Y - U) / (J - U), te = 1 - Math.sqrt(1 - Q), se = Math.sqrt(Q), (fe = te < K && K < se ? Y / (U - Y) * (J / (U - J)) + Y / (J - Y) * (U / (J - U)) * ((D - w) / (T - w)) : 0.5 * ce) < ne && (fe = ne), fe > 1 - ne && (fe = 1 - ne), de++;
    } while (de <= ae);
    return V;
  }, fminbr: function(c, b, m) {
    var _, f, g, C, P, w, T, D, I, Y, U, J, z, V, $, ne, Q = 0.5 * (3 - Math.sqrt(5)), K = N.Z.eps, te = N.Z.eps, se = this.maxIterationsMinimize, de = 0;
    if (!j.Z.isArray(b) || b.length < 2)
      throw new Error("JXG.Math.Numerics.fminbr: length of array x0 has to be at least two.");
    for (g = C = (_ = b[0]) + Q * ((f = b[1]) - _), P = C, w = T = c.call(m, C), D = T; de < se; ) {
      if (I = f - _, Y = 0.5 * (_ + f), U = te * Math.abs(g) + K / 3, Math.abs(g - Y) + 0.5 * I <= 2 * U)
        return g;
      J = Q * (g < Y ? f - g : _ - g), Math.abs(g - P) >= U && (z = (g - C) * (V = (g - C) * (w - D)) - (g - P) * ($ = (g - P) * (w - T)), (V = 2 * (V - $)) > 0 ? z = -z : V = -V, Math.abs(z) < Math.abs(J * V) && z > V * (_ - g + 2 * U) && z < V * (f - g - 2 * U) && (J = z / V)), Math.abs(J) < U && (J = J > 0 ? U : -U), $ = g + J, (ne = c.call(m, $)) <= w ? ($ < g ? f = g : _ = g, C = P, P = g, g = $, T = D, D = w, w = ne) : ($ < g ? _ = $ : f = $, ne <= D || P === g ? (C = P, P = $, T = D, D = ne) : (ne <= T || C === g || C === P) && (C = $, T = ne)), de += 1;
    }
    return g;
  }, RamerDouglasPeucker: function(c, b) {
    var m, _, f, g = [], C = [], P = function(w, T, D, I, Y) {
      var U = function(z, V, $) {
        var ne, Q, K, te, se, de, ae, ce, fe, Re, ke, je = 1e4, qe = 0, it = V;
        if ($ - V < 2)
          return [-1, 0];
        if (K = z[V].scrCoords, te = z[$].scrCoords, isNaN(K[1]) || isNaN(K[2]))
          return [NaN, V];
        if (isNaN(te[1]) || isNaN(te[2]))
          return [NaN, $];
        for (Q = V + 1; Q < $; Q++) {
          if (se = z[Q].scrCoords, isNaN(se[1]) || isNaN(se[2]))
            return [NaN, Q];
          de = (de = (de = se[1] - K[1]) == 1 / 0 ? je : de) === -1 / 0 ? -je : de, ae = (ae = (ae = se[2] - K[2]) == 1 / 0 ? je : ae) === -1 / 0 ? -je : ae, (Re = (ce = (ce = (ce = te[1] - K[1]) == 1 / 0 ? je : ce) === -1 / 0 ? -je : ce) * ce + (fe = (fe = (fe = te[2] - K[2]) == 1 / 0 ? je : fe) === -1 / 0 ? -je : fe) * fe) >= N.Z.eps ? ((ke = (de * ce + ae * fe) / Re) < 0 ? ke = 0 : ke > 1 && (ke = 1), ne = (de -= ke * ce) * de + (ae -= ke * fe) * ae) : (ke = 0, ne = de * de + ae * ae), ne > qe && (qe = ne, it = Q);
        }
        return [Math.sqrt(qe), it];
      }(w, T, D), J = U[1];
      if (isNaN(U[0])) {
        P(w, T, J - 1, I, Y), Y.push(w[J]);
        do
          ++J;
        while (J <= D && isNaN(w[J].scrCoords[1] + w[J].scrCoords[2]));
        J <= D && Y.push(w[J]), P(w, J + 1, D, I, Y);
      } else
        U[0] > I ? (P(w, T, J, I, Y), P(w, J, D, I, Y)) : Y.push(w[D]);
    };
    for (f = c.length, m = 0; ; ) {
      for (; m < f && isNaN(c[m].scrCoords[1] + c[m].scrCoords[2]); )
        m += 1;
      for (_ = m + 1; _ < f && !isNaN(c[_].scrCoords[1] + c[_].scrCoords[2]); )
        _ += 1;
      if (_--, m < f && _ > m && ((C = [])[0] = c[m], P(c, m, _, b, C), g = g.concat(C)), m >= f)
        break;
      _ < f - 1 && g.push(c[_ + 1]), m = _ + 1;
    }
    return g;
  }, RamerDouglasPeuker: function(c, b) {
    return a.Z.deprecated("Numerics.RamerDouglasPeuker()", "Numerics.RamerDouglasPeucker()"), this.RamerDouglasPeucker(c, b);
  }, Visvalingam: function(c, b) {
    var m, _, f, g, C, P, w, T, D, I = [], Y = [], U = [];
    if ((_ = c.length) <= 2)
      return c;
    for (I[0] = { used: !0, lft: null, node: null }, C = 0, m = 1; m < _ - 1; m++)
      f = Math.abs(a.Z.Math.Numerics.det([c[m - 1].usrCoords, c[m].usrCoords, c[m + 1].usrCoords])), isNaN(f) || (D = { v: f, idx: m }, Y.push(D), I[m] = { used: !0, lft: C, node: D }, I[C].rt = m, C = m);
    for (I[_ - 1] = { used: !0, rt: null, lft: C, node: null }, I[C].rt = _ - 1, g = -1 / 0; Y.length > b; )
      Y.sort(function(J, z) {
        return z.v - J.v;
      }), I[m = Y.pop().idx].used = !1, g = I[m].node.v, C = I[m].lft, P = I[m].rt, I[C].rt = P, I[P].lft = C, (w = I[C].lft) !== null && (f = Math.abs(a.Z.Math.Numerics.det([c[w].usrCoords, c[C].usrCoords, c[P].usrCoords])), I[C].node.v = f >= g ? f : g), (T = I[P].rt) !== null && (f = Math.abs(a.Z.Math.Numerics.det([c[C].usrCoords, c[P].usrCoords, c[T].usrCoords])), I[P].node.v = f >= g ? f : g);
    U = [c[m = 0]];
    do
      m = I[m].rt, U.push(c[m]);
    while (I[m].rt !== null);
    return U;
  } };
  const E = N.Z.Numerics;
}, 309: (d, M, x) => {
  x.d(M, { Z: () => N });
  var a = x(765), j = x(275), k = x(109);
  j.Z.Statistics = { sum: function(A) {
    var E, c = A.length, b = 0;
    for (E = 0; E < c; E++)
      b += A[E];
    return b;
  }, prod: function(A) {
    var E, c = A.length, b = 1;
    for (E = 0; E < c; E++)
      b *= A[E];
    return b;
  }, mean: function(A) {
    return A.length > 0 ? this.sum(A) / A.length : 0;
  }, median: function(A) {
    var E, c;
    return A.length > 0 ? (ArrayBuffer.isView(A) ? (E = new Float64Array(A)).sort() : (E = A.slice(0)).sort(function(b, m) {
      return b - m;
    }), 1 & (c = E.length) ? E[parseInt(0.5 * c, 10)] : 0.5 * (E[0.5 * c - 1] + E[0.5 * c])) : 0;
  }, percentile: function(A, E) {
    var c, b, m, _, f, g = [];
    if (A.length > 0) {
      for (ArrayBuffer.isView(A) ? (c = new Float64Array(A)).sort() : (c = A.slice(0)).sort(function(C, P) {
        return C - P;
      }), b = c.length, _ = k.Z.isArray(E) ? E : [E], m = 0; m < _.length; m++)
        f = b * _[m] * 0.01, parseInt(f, 10) === f ? g.push(0.5 * (c[f - 1] + c[f])) : g.push(c[parseInt(f, 10)]);
      return k.Z.isArray(E) ? g : g[0];
    }
    return 0;
  }, variance: function(A) {
    var E, c, b, m = A.length;
    if (m > 1) {
      for (E = this.mean(A), c = 0, b = 0; b < m; b++)
        c += (A[b] - E) * (A[b] - E);
      return c / (A.length - 1);
    }
    return 0;
  }, sd: function(A) {
    return Math.sqrt(this.variance(A));
  }, weightedMean: function(A, E) {
    if (A.length !== E.length)
      throw new Error("JSXGraph error (Math.Statistics.weightedMean): Array dimension mismatch.");
    return A.length > 0 ? this.mean(this.multiply(A, E)) : 0;
  }, max: function(A) {
    return Math.max.apply(this, A);
  }, min: function(A) {
    return Math.min.apply(this, A);
  }, range: function(A) {
    return [this.min(A), this.max(A)];
  }, abs: function(A) {
    var E, c, b;
    if (k.Z.isArray(A))
      if (A.map)
        b = A.map(Math.abs);
      else
        for (c = A.length, b = [], E = 0; E < c; E++)
          b[E] = Math.abs(A[E]);
    else
      b = ArrayBuffer.isView(A) ? A.map(Math.abs) : Math.abs(A);
    return b;
  }, add: function(A, E) {
    var c, b, m = [];
    if (A = k.Z.evalSlider(A), E = k.Z.evalSlider(E), k.Z.isArray(A) && k.Z.isNumber(E))
      for (b = A.length, c = 0; c < b; c++)
        m[c] = A[c] + E;
    else if (k.Z.isNumber(A) && k.Z.isArray(E))
      for (b = E.length, c = 0; c < b; c++)
        m[c] = A + E[c];
    else if (k.Z.isArray(A) && k.Z.isArray(E))
      for (b = Math.min(A.length, E.length), c = 0; c < b; c++)
        m[c] = A[c] + E[c];
    else
      m = A + E;
    return m;
  }, div: function(A, E) {
    var c, b, m = [];
    if (A = k.Z.evalSlider(A), E = k.Z.evalSlider(E), k.Z.isArray(A) && k.Z.isNumber(E))
      for (b = A.length, c = 0; c < b; c++)
        m[c] = A[c] / E;
    else if (k.Z.isNumber(A) && k.Z.isArray(E))
      for (b = E.length, c = 0; c < b; c++)
        m[c] = A / E[c];
    else if (k.Z.isArray(A) && k.Z.isArray(E))
      for (b = Math.min(A.length, E.length), c = 0; c < b; c++)
        m[c] = A[c] / E[c];
    else
      m = A / E;
    return m;
  }, divide: function() {
    a.Z.deprecated("Statistics.divide()", "Statistics.div()"), j.Z.Statistics.div.apply(j.Z.Statistics, arguments);
  }, mod: function(A, E, c) {
    var b, m, _ = [], f = function(g, C) {
      return g % C;
    };
    if ((c = k.Z.def(c, !1)) && (f = j.Z.mod), A = k.Z.evalSlider(A), E = k.Z.evalSlider(E), k.Z.isArray(A) && k.Z.isNumber(E))
      for (m = A.length, b = 0; b < m; b++)
        _[b] = f(A[b], E);
    else if (k.Z.isNumber(A) && k.Z.isArray(E))
      for (m = E.length, b = 0; b < m; b++)
        _[b] = f(A, E[b]);
    else if (k.Z.isArray(A) && k.Z.isArray(E))
      for (m = Math.min(A.length, E.length), b = 0; b < m; b++)
        _[b] = f(A[b], E[b]);
    else
      _ = f(A, E);
    return _;
  }, multiply: function(A, E) {
    var c, b, m = [];
    if (A = k.Z.evalSlider(A), E = k.Z.evalSlider(E), k.Z.isArray(A) && k.Z.isNumber(E))
      for (b = A.length, c = 0; c < b; c++)
        m[c] = A[c] * E;
    else if (k.Z.isNumber(A) && k.Z.isArray(E))
      for (b = E.length, c = 0; c < b; c++)
        m[c] = A * E[c];
    else if (k.Z.isArray(A) && k.Z.isArray(E))
      for (b = Math.min(A.length, E.length), c = 0; c < b; c++)
        m[c] = A[c] * E[c];
    else
      m = A * E;
    return m;
  }, subtract: function(A, E) {
    var c, b, m = [];
    if (A = k.Z.evalSlider(A), E = k.Z.evalSlider(E), k.Z.isArray(A) && k.Z.isNumber(E))
      for (b = A.length, c = 0; c < b; c++)
        m[c] = A[c] - E;
    else if (k.Z.isNumber(A) && k.Z.isArray(E))
      for (b = E.length, c = 0; c < b; c++)
        m[c] = A - E[c];
    else if (k.Z.isArray(A) && k.Z.isArray(E))
      for (b = Math.min(A.length, E.length), c = 0; c < b; c++)
        m[c] = A[c] - E[c];
    else
      m = A - E;
    return m;
  }, TheilSenRegression: function(A) {
    var E, c, b = [], m = [], _ = [];
    for (E = 0; E < A.length; E++) {
      for (m.length = 0, c = 0; c < A.length; c++)
        Math.abs(A[c].usrCoords[1] - A[E].usrCoords[1]) > j.Z.eps && (m[c] = (A[c].usrCoords[2] - A[E].usrCoords[2]) / (A[c].usrCoords[1] - A[E].usrCoords[1]));
      b[E] = this.median(m), _.push(A[E].usrCoords[2] - b[E] * A[E].usrCoords[1]);
    }
    return [this.median(_), this.median(b), -1];
  }, generateGaussian: function(A, E) {
    var c, b, m;
    if (this.hasSpare)
      return this.hasSpare = !1, this.spare * E + A;
    do
      m = (c = 2 * Math.random() - 1) * c + (b = 2 * Math.random() - 1) * b;
    while (m >= 1 || m === 0);
    return m = Math.sqrt(-2 * Math.log(m) / m), this.spare = b * m, this.hasSpare = !0, A + E * c * m;
  } };
  const N = j.Z.Statistics;
}, 766: (d, M, x) => {
  x.d(M, { Z: () => E });
  var a = x(765), j = x(351), k = x(275), N = x(327), A = x(109);
  a.Z.Options = { jc: { enabled: !0, compile: !0 }, board: { boundingBox: [-5, 5, 5, -5], maxBoundingBox: [-1 / 0, 1 / 0, 1 / 0, -1 / 0], zoomFactor: 1, zoomX: 1, zoomY: 1, title: "", description: "", showCopyright: !0, axis: !1, defaultAxes: { x: { name: "x", fixed: !0, ticks: { label: { visible: "inherit", anchorX: "middle", anchorY: "top", fontSize: 12, offset: [0, -3] }, tickEndings: [0, 1], majorTickEndings: [1, 1], drawZero: !1, needsRegularUpdate: !1, visible: "inherit" } }, y: { name: "y", fixed: !0, ticks: { label: { visible: "inherit", anchorX: "right", anchorY: "middle", fontSize: 12, offset: [-6, 0] }, tickEndings: [1, 0], majorTickEndings: [1, 1], drawZero: !1, needsRegularUpdate: !1, visible: "inherit" } } }, showNavigation: !0, showZoom: !0, showReload: !1, showScreenshot: !1, screenshot: { scale: 1, type: "png", symbol: "⌘", css: "background-color:#eeeeee; opacity:1.0; border:2px solid black; border-radius:10px; text-align:center", cssButton: "padding: 4px 10px; border: solid #356AA0 1px; border-radius: 5px; position: absolute; right: 2ex; top: 2ex; background-color: rgba(255, 255, 255, 0.3);" }, showFullscreen: !1, fullscreen: { symbol: '<svg height="1em" width="1em" version="1.1" viewBox="10 10 18 18"><path fill="#666" d="m 10,16 2,0 0,-4 4,0 0,-2 L 10,10 l 0,6 0,0 z"></path><path fill="#666" d="m 20,10 0,2 4,0 0,4 2,0 L 26,10 l -6,0 0,0 z"></path><path fill="#666" d="m 24,24 -4,0 0,2 L 26,26 l 0,-6 -2,0 0,4 0,0 z"></path><path fill="#666" d="M 12,20 10,20 10,26 l 6,0 0,-2 -4,0 0,-4 0,0 z"></path></svg>', scale: 0.85, id: null }, showClearTraces: !1, keepAspectRatio: !1, ignoreLabels: !0, maxNameLength: 1, document: !1, takeFirst: !1, takeSizeFromFile: !1, renderer: "auto", animationDelay: 35, maxFrameRate: 40, registerEvents: !0, registerResizeEvent: !0, registerFullscreenEvent: !0, minimizeReflow: "none", offsetX: 0, offsetY: 0, zoom: { enabled: !0, factorX: 1.25, factorY: 1.25, wheel: !0, needShift: !0, min: 1e-4, max: 1e4, pinchHorizontal: !0, pinchVertical: !0, pinchSensitivity: 7 }, pan: { enabled: !0, needShift: !0, needTwoFingers: !1 }, browserPan: !1, drag: { enabled: !0 }, keyboard: { enabled: !0, dx: 10, dy: 10, panShift: !0, panCtrl: !1 }, resize: { enabled: !0, throttle: 10 }, moveTarget: null, selection: { enabled: !1, name: "selectionPolygon", needShift: !1, needCtrl: !0, withLines: !1, vertices: { visible: !1 }, fillColor: "#ffff00", visible: !1 }, showInfobox: !0, logging: { enabled: !1 } }, navbar: { strokeColor: "#333333", fillColor: "transparent", highlightFillColor: "#aaaaaa", padding: "2px", position: "absolute", fontSize: "14px", cursor: "pointer", zIndex: "100", right: "5px", bottom: "5px" }, elements: { strokeColor: N.Z.palette.blue, highlightStrokeColor: "#c3d9ff", fillColor: N.Z.palette.red, highlightFillColor: "none", strokeOpacity: 1, highlightStrokeOpacity: 1, fillOpacity: 1, highlightFillOpacity: 1, gradient: null, gradientSecondColor: "#ffffff", gradientSecondOpacity: 1, gradientStartOffset: 0, gradientEndOffset: 1, gradientAngle: 0, gradientCX: 0.5, gradientCY: 0.5, gradientR: 0.5, gradientFX: 0.5, gradientFY: 0.5, gradientFR: 0, transitionDuration: 100, transitionProperties: ["fill", "fill-opacity", "stroke", "stroke-opacity", "stroke-width"], strokeWidth: 2, highlightStrokeWidth: 2, fixed: !1, frozen: !1, withLabel: !1, visible: !0, priv: !1, layer: 0, dash: 0, shadow: { enabled: !1, color: [0, 0, 0], opacity: 1, blur: 3, blend: 0.1, offset: [5, 5] }, trace: !1, traceAttributes: {}, highlight: !0, needsRegularUpdate: !0, snapToGrid: !1, scalable: !0, rotatable: !0, dragToTopOfLayer: !1, precision: "inherit", draft: { draft: !1, strokeColor: "#565656", fillColor: "#565656", strokeOpacity: 0.8, fillOpacity: 0.8, strokeWidth: 1 }, isLabel: !1, tabindex: 0 }, ticks: { generateLabelText: null, generateLabelValue: null, drawLabels: !1, label: {}, beautifulScientificTickLabels: !1, useUnicodeMinus: !0, anchor: "left", drawZero: !1, insertTicks: !1, minTicksDistance: 10, minorHeight: 4, majorHeight: 10, tickEndings: [1, 1], majorTickEndings: [1, 1], ignoreInfiniteTickEndings: !0, minorTicks: 4, ticksPerLabel: !1, scale: 1, scaleSymbol: "", labels: [], maxLabelLength: 5, precision: 3, digits: 3, ticksDistance: 1, face: "|", strokeOpacity: 1, strokeWidth: 1, strokeColor: "#000000", highlightStrokeColor: "#888888", fillColor: "none", highlightFillColor: "none", visible: "inherit", includeBoundaries: !1, type: "linear" }, hatch: { drawLabels: !1, drawZero: !0, majorHeight: 20, anchor: "middle", face: "|", strokeWidth: 2, strokeColor: N.Z.palette.blue, ticksDistance: 0.2 }, precision: { touch: 30, touchMax: 100, mouse: 4, pen: 4, epsilon: 1e-4, hasPoint: 4 }, layer: { numlayers: 20, unused9: 19, unused8: 18, unused7: 17, unused6: 16, unused5: 15, unused4: 14, unused3: 13, unused2: 12, unused1: 11, unused0: 10, text: 9, point: 9, glider: 9, arc: 8, line: 7, circle: 6, curve: 5, turtle: 5, polygon: 3, sector: 3, angle: 3, integral: 3, axis: 2, ticks: 2, grid: 1, image: 0, trace: 0 }, angle: { withLabel: !0, radius: "auto", type: "sector", orthoType: "square", orthoSensitivity: 1, fillColor: N.Z.palette.orange, highlightFillColor: N.Z.palette.orange, strokeColor: N.Z.palette.orange, fillOpacity: 0.3, highlightFillOpacity: 0.3, radiuspoint: { withLabel: !1, visible: !1, name: "" }, pointsquare: { withLabel: !1, visible: !1, name: "" }, dot: { visible: !1, strokeColor: "none", fillColor: "#000000", size: 2, face: "o", withLabel: !1, name: "" }, label: { position: "top", offset: [0, 0], strokeColor: N.Z.palette.blue }, arc: { visible: !1, fillColor: "none" } }, arc: { selection: "auto", hasInnerPoints: !1, label: { anchorX: "auto", anchorY: "auto" }, firstArrow: !1, lastArrow: !1, fillColor: "none", highlightFillColor: "none", strokeColor: N.Z.palette.blue, highlightStrokeColor: "#c3d9ff", useDirection: !1, center: {}, radiusPoint: {}, anglePoint: {} }, arrow: { firstArrow: !1, lastArrow: { type: 1, highlightSize: 6, size: 6 } }, axis: { name: "", needsRegularUpdate: !1, strokeWidth: 1, lastArrow: { type: 1, highlightSize: 8, size: 8 }, strokeColor: "#666666", highlightStrokeWidth: 1, highlightStrokeColor: "#888888", withTicks: !0, straightFirst: !0, straightLast: !0, margin: -4, withLabel: !1, scalable: !1, ticks: { label: { offset: [4, -9], parse: !1, needsRegularUpdate: !1, display: "internal", visible: "inherit", layer: 9 }, visible: "inherit", needsRegularUpdate: !1, strokeWidth: 1, strokeColor: "#666666", highlightStrokeColor: "#888888", drawLabels: !0, drawZero: !1, insertTicks: !0, minTicksDistance: 5, minorHeight: 10, majorHeight: -1, tickEndings: [0, 1], majorTickEndings: [1, 1], minorTicks: 4, ticksDistance: 1, strokeOpacity: 0.25 }, point1: { needsRegularUpdate: !1, visible: !1 }, point2: { needsRegularUpdate: !1, visible: !1 }, tabindex: -1, label: { position: "lft", offset: [10, 10] } }, bisector: { strokeColor: "#000000", point: { visible: !1, fixed: !1, withLabel: !1, name: "" } }, bisectorlines: { line1: { strokeColor: "#000000" }, line2: { strokeColor: "#000000" } }, boxplot: { dir: "vertical", smallWidth: 0.5, strokeWidth: 2, strokeColor: N.Z.palette.blue, fillColor: N.Z.palette.blue, fillOpacity: 0.2, highlightStrokeWidth: 2, highlightStrokeColor: N.Z.palette.blue, highlightFillColor: N.Z.palette.blue, highlightFillOpacity: 0.1 }, button: { disabled: !1, display: "html" }, cardinalspline: { createPoints: !0, isArrayOfCoordinates: !0, points: { strokeOpacity: 0.05, fillOpacity: 0.05, highlightStrokeOpacity: 1, highlightFillOpacity: 1, withLabel: !1, name: "", fixed: !1 } }, chart: { chartStyle: "line", colors: ["#B02B2C", "#3F4C6B", "#C79810", "#D15600", "#FFFF88", "#c3d9ff", "#4096EE", "#008C00"], highlightcolors: null, fillcolor: null, highlightonsector: !1, highlightbysize: !1, fillOpacity: 0.6, withLines: !1, label: {} }, checkbox: { disabled: !1, checked: !1, display: "html" }, circle: { hasInnerPoints: !1, fillColor: "none", highlightFillColor: "none", strokeColor: N.Z.palette.blue, highlightStrokeColor: "#c3d9ff", center: { visible: !1, withLabel: !1, fixed: !1, fillColor: N.Z.palette.red, strokeColor: N.Z.palette.red, highlightFillColor: "#c3d9ff", highlightStrokeColor: "#c3d9ff", name: "" }, point2: { visible: !1, withLabel: !1, fixed: !1, name: "" }, label: { position: "urt" } }, circumcircle: { fillColor: "none", highlightFillColor: "none", strokeColor: N.Z.palette.blue, highlightStrokeColor: "#c3d9ff", center: { visible: !1, fixed: !1, withLabel: !1, fillColor: N.Z.palette.red, strokeColor: N.Z.palette.red, highlightFillColor: "#c3d9ff", highlightStrokeColor: "#c3d9ff", name: "" } }, circumcirclearc: { fillColor: "none", highlightFillColor: "none", strokeColor: N.Z.palette.blue, highlightStrokeColor: "#c3d9ff", center: { visible: !1, withLabel: !1, fixed: !1, name: "" } }, circumcirclesector: { useDirection: !0, fillColor: N.Z.palette.yellow, highlightFillColor: N.Z.palette.yellow, fillOpacity: 0.3, highlightFillOpacity: 0.3, strokeColor: N.Z.palette.blue, highlightStrokeColor: "#c3d9ff", point: { visible: !1, fixed: !1, withLabel: !1, name: "" } }, conic: { fillColor: "none", highlightFillColor: "none", strokeColor: N.Z.palette.blue, highlightStrokeColor: "#c3d9ff", foci: { fixed: !1, visible: !1, withLabel: !1, name: "" }, center: { visible: !1, withLabel: !1, name: "" }, point: { withLabel: !1, name: "" }, line: { visible: !1 } }, curve: { strokeWidth: 1, strokeColor: N.Z.palette.blue, fillColor: "none", fixed: !0, useQDT: !1, handDrawing: !1, curveType: null, RDPsmoothing: !1, numberPointsHigh: 1600, numberPointsLow: 400, doAdvancedPlot: !0, recursionDepthHigh: 17, recursionDepthLow: 15, doAdvancedPlotOld: !1, plotVersion: 2, label: { position: "lft" }, firstArrow: !1, lastArrow: !1 }, foreignobject: { attractors: [], fixed: !0, visible: !0 }, glider: { label: {} }, grid: { needsRegularUpdate: !1, hasGrid: !1, gridX: 1, gridY: 1, strokeColor: "#c0c0c0", strokeOpacity: 0.5, strokeWidth: 1, dash: 0, snapToGrid: !1, snapSizeX: 10, snapSizeY: 10 }, group: { needsRegularUpdate: !0 }, htmlslider: { widthRange: 100, widthOut: 34, step: 0.01, frozen: !0, isLabel: !1, strokeColor: "#000000", display: "html", anchorX: "left", anchorY: "middle", withLabel: !1 }, image: { imageString: null, fillOpacity: 1, highlightFillOpacity: 0.6, cssClass: "JXGimage", highlightCssClass: "JXGimageHighlight", rotate: 0, snapSizeX: 1, snapSizeY: 1, attractors: [] }, incircle: { fillColor: "none", highlightFillColor: "none", strokeColor: N.Z.palette.blue, highlightStrokeColor: "#c3d9ff", center: { visible: !1, fixed: !1, withLabel: !1, fillColor: N.Z.palette.red, strokeColor: N.Z.palette.red, highlightFillColor: "#c3d9ff", highlightStrokeColor: "#c3d9ff", name: "" } }, inequality: { fillColor: N.Z.palette.red, fillOpacity: 0.2, strokeColor: "none", inverse: !1 }, infobox: { distanceX: -20, distanceY: 25, fontSize: 12, isLabel: !1, strokeColor: "#bbbbbb", display: "html", anchorX: "left", anchorY: "middle", cssClass: "JXGinfobox", rotate: 0, visible: !0, parse: !1, transitionDuration: 0, needsRegularUpdate: !1, tabindex: null }, integral: { axis: "x", withLabel: !0, fixed: !0, strokeWidth: 0, strokeOpacity: 0, fillColor: N.Z.palette.red, fillOpacity: 0.3, highlightFillColor: N.Z.palette.red, highlightFillOpacity: 0.2, curveLeft: { visible: !0, withLabel: !1, color: N.Z.palette.red, fillOpacity: 0.8, layer: 9 }, baseLeft: { visible: !1, fixed: !1, withLabel: !1, name: "" }, curveRight: { visible: !0, withLabel: !1, color: N.Z.palette.red, fillOpacity: 0.8, layer: 9 }, baseRight: { visible: !1, fixed: !1, withLabel: !1, name: "" }, label: { fontSize: 20 } }, input: { disabled: !1, maxlength: 524288, display: "html" }, intersection: { alwaysIntersect: !0 }, label: { visible: "inherit", strokeColor: "#000000", strokeOpacity: 1, highlightStrokeOpacity: 0.666666, highlightStrokeColor: "#000000", fixed: !0, position: "urt", offset: [10, 10], autoPosition: !1 }, legend: { style: "vertical", labels: ["1", "2", "3", "4", "5", "6", "7", "8"], colors: ["#B02B2C", "#3F4C6B", "#C79810", "#D15600", "#FFFF88", "#c3d9ff", "#4096EE", "#008C00"], rowHeight: 20, strokeWidth: 5 }, line: { firstArrow: !1, lastArrow: !1, margin: 0, straightFirst: !0, straightLast: !0, fillColor: "none", highlightFillColor: "none", strokeColor: N.Z.palette.blue, highlightStrokeColor: "#c3d9ff", withTicks: !1, point1: { visible: !1, withLabel: !1, fixed: !1, name: "" }, point2: { visible: !1, withLabel: !1, fixed: !1, name: "" }, ticks: { drawLabels: !0, label: { offset: [4, -9] }, drawZero: !1, insertTicks: !1, minTicksDistance: 50, minorHeight: 4, majorHeight: -1, minorTicks: 4, defaultDistance: 1, strokeOpacity: 0.3, visible: "inherit" }, label: { position: "llft" }, snapToGrid: !1, snapSizeX: 1, snapSizeY: 1, touchFirstPoint: !1, touchLastPoint: !1, lineCap: "butt" }, locus: { translateToOrigin: !1, translateTo10: !1, stretch: !1, toOrigin: null, to10: null }, metapostspline: { createPoints: !0, isArrayOfCoordinates: !0, points: { strokeOpacity: 0.5, fillOpacity: 0.5, highlightStrokeOpacity: 1, highlightFillOpacity: 1, withLabel: !1, name: "", fixed: !1 } }, mirrorelement: { fixed: !0, point: {}, center: {}, type: "Euclidean" }, normal: { strokeColor: "#000000", point: { visible: !1, fixed: !1, withLabel: !1, name: "" } }, orthogonalprojection: {}, parallel: { strokeColor: "#000000", point: { visible: !1, fixed: !1, withLabel: !1, name: "" }, label: { position: "llft" } }, perpendicular: { strokeColor: "#000000", straightFirst: !0, straightLast: !0 }, perpendicularsegment: { strokeColor: "#000000", straightFirst: !1, straightLast: !1, point: { visible: !1, fixed: !0, withLabel: !1, name: "" } }, point: { withLabel: !0, label: {}, style: 5, face: "o", size: 3, sizeUnit: "screen", strokeWidth: 2, transitionProperties: ["fill", "fill-opacity", "stroke", "stroke-opacity", "stroke-width", "width", "height", "rx", "ry"], fillColor: N.Z.palette.red, strokeColor: N.Z.palette.red, highlightFillColor: "#c3d9ff", highlightStrokeColor: "#c3d9ff", zoom: !1, showInfobox: "inherit", infoboxDigits: "auto", draft: !1, attractors: [], attractorUnit: "user", attractorDistance: 0, snatchDistance: 0, snapToGrid: !1, attractToGrid: !1, snapSizeX: 1, snapSizeY: 1, snapToPoints: !1, ignoredSnapToPoints: [] }, polygon: { hasInnerPoints: !1, fillColor: N.Z.palette.yellow, highlightFillColor: N.Z.palette.yellow, fillOpacity: 0.3, highlightFillOpacity: 0.2, withLines: !0, borders: { withLabel: !1, strokeWidth: 1, highlightStrokeWidth: 1, layer: 5, label: { position: "top" }, visible: "inherit" }, vertices: { layer: 9, withLabel: !1, name: "", strokeColor: N.Z.palette.red, fillColor: N.Z.palette.red, fixed: !1, visible: "inherit" }, label: { offset: [0, 0] } }, polygonalchain: { fillColor: "none", highlightFillColor: "none" }, prescribedangle: { anglePoint: { size: 2, visible: !1, withLabel: !1 } }, reflection: { fixed: !0, center: {}, type: "Euclidean" }, regularpolygon: { hasInnerPoints: !1, fillColor: N.Z.palette.yellow, highlightFillColor: N.Z.palette.yellow, fillOpacity: 0.3, highlightFillOpacity: 0.2, withLines: !0, borders: { withLabel: !1, strokeWidth: 1, highlightStrokeWidth: 1, layer: 5, label: { position: "top" } }, vertices: { layer: 9, withLabel: !0, strokeColor: N.Z.palette.red, fillColor: N.Z.palette.red, fixed: !1 }, label: { offset: [0, 0] } }, riemannsum: { withLabel: !1, fillOpacity: 0.3, fillColor: N.Z.palette.yellow }, sector: { fillColor: N.Z.palette.yellow, highlightFillColor: N.Z.palette.yellow, fillOpacity: 0.3, highlightFillOpacity: 0.3, highlightOnSector: !1, highlightStrokeWidth: 0, selection: "auto", arc: { visible: !1, fillColor: "none" }, radiusPoint: { visible: !1, withLabel: !1 }, center: { visible: !1, withLabel: !1 }, anglePoint: { visible: !1, withLabel: !1 }, label: { offset: [0, 0], anchorX: "auto", anchorY: "auto" } }, segment: { label: { position: "top" } }, semicircle: { center: { visible: !1, withLabel: !1, fixed: !1, fillColor: N.Z.palette.red, strokeColor: N.Z.palette.red, highlightFillColor: "#eeeeee", highlightStrokeColor: N.Z.palette.red, name: "" } }, slider: { snapWidth: -1, precision: 2, digits: 2, firstArrow: !1, lastArrow: !1, withTicks: !0, withLabel: !0, suffixLabel: null, unitLabel: null, postLabel: null, layer: 9, showInfobox: !1, name: "", visible: !0, strokeColor: "#000000", highlightStrokeColor: "#888888", fillColor: "#ffffff", highlightFillColor: "none", size: 6, point1: { needsRegularUpdate: !1, showInfobox: !1, withLabel: !1, visible: !1, fixed: !0, name: "" }, point2: { needsRegularUpdate: !1, showInfobox: !1, withLabel: !1, visible: !1, fixed: !0, name: "" }, baseline: { needsRegularUpdate: !1, visible: "inherit", fixed: !0, scalable: !1, tabindex: null, name: "", strokeWidth: 1, strokeColor: "#000000", highlightStrokeColor: "#888888" }, ticks: { needsRegularUpdate: !1, fixed: !0, drawLabels: !1, digits: 2, includeBoundaries: 1, drawZero: !0, label: { offset: [-4, -14], display: "internal" }, minTicksDistance: 30, insertTicks: !0, minorHeight: 4, majorHeight: 5, minorTicks: 0, defaultDistance: 1, strokeOpacity: 1, strokeWidth: 1, tickEndings: [0, 1], majortickEndings: [0, 1], strokeColor: "#000000", visible: "inherit" }, highline: { strokeWidth: 3, visible: "inherit", fixed: !0, tabindex: null, name: "", strokeColor: "#000000", highlightStrokeColor: "#888888" }, label: { visible: "inherit", strokeColor: "#000000" }, moveOnUp: !0 }, comb: { frequency: 0.2, width: 0.4, angle: Math.PI / 3, reverse: !1, point1: { visible: !1, withLabel: !1, fixed: !1, name: "" }, point2: { visible: !1, withLabel: !1, fixed: !1, name: "" }, curve: { strokeWidth: 1, strokeColor: "#000000", fillColor: "none" } }, slopetriangle: { fillColor: N.Z.palette.red, fillOpacity: 0.4, highlightFillColor: N.Z.palette.red, highlightFillOpacity: 0.3, borders: { lastArrow: { type: 1, size: 6 } }, glider: { fixed: !0, visible: !1, withLabel: !1 }, baseline: { visible: !1, withLabel: !1, name: "" }, basepoint: { visible: !1, withLabel: !1, name: "" }, tangent: { visible: !1, withLabel: !1, name: "" }, toppoint: { visible: !1, withLabel: !1, name: "" }, label: { visible: !0 } }, stepfunction: {}, tapemeasure: { strokeColor: "#000000", strokeWidth: 2, highlightStrokeColor: "#000000", withTicks: !0, withLabel: !0, precision: 2, digits: 2, point1: { visible: "inherit", strokeColor: "#000000", fillColor: "#ffffff", fillOpacity: 0, highlightFillOpacity: 0.1, size: 6, snapToPoints: !0, attractorUnit: "screen", attractorDistance: 20, showInfobox: !1, withLabel: !1, name: "" }, point2: { visible: "inherit", strokeColor: "#000000", fillColor: "#ffffff", fillOpacity: 0, highlightFillOpacity: 0.1, size: 6, snapToPoints: !0, attractorUnit: "screen", attractorDistance: 20, showInfobox: !1, withLabel: !1, name: "" }, ticks: { drawLabels: !1, drawZero: !0, insertTicks: !0, minorHeight: 8, majorHeight: 16, minorTicks: 4, tickEndings: [0, 1], majorTickEndings: [0, 1], defaultDistance: 0.1, strokeOpacity: 1, strokeWidth: 1, strokeColor: "#000000", visible: "inherit" }, label: { position: "top" } }, text: { fontSize: 12, fontUnit: "px", digits: 2, parse: !0, useCaja: !1, isLabel: !1, strokeColor: "#000000", highlightStrokeColor: "#000000", highlightStrokeOpacity: 0.666666, cssDefaultStyle: "font-family: Arial, Helvetica, Geneva, sans-serif;", highlightCssDefaultStyle: "font-family: Arial, Helvetica, Geneva, sans-serif;", cssStyle: "", highlightCssStyle: "", transitionProperties: ["color", "opacity"], useASCIIMathML: !1, useMathJax: !1, useKatex: !1, katexMacros: {}, display: "html", anchor: null, anchorX: "left", anchorY: "middle", cssClass: "JXGtext", highlightCssClass: "JXGtext", dragArea: "all", withLabel: !1, rotate: 0, visible: !0, snapSizeX: 1, snapSizeY: 1, attractors: [] }, tracecurve: { strokeColor: "#000000", fillColor: "none", numberPoints: 100 }, turtle: { strokeWidth: 1, fillColor: "none", strokeColor: "#000000", arrow: { strokeWidth: 2, withLabel: !1, strokeColor: N.Z.palette.red, lastArrow: !0 } }, shortcuts: { color: ["strokeColor", "fillColor"], opacity: ["strokeOpacity", "fillOpacity"], highlightColor: ["highlightStrokeColor", "highlightFillColor"], highlightOpacity: ["highlightStrokeOpacity", "highlightFillOpacity"], strokeWidth: ["strokeWidth", "highlightStrokeWidth"] } }, a.Z.Validator = function() {
    var c, b = function(w) {
      return A.Z.isString(w);
    }, m = function(w) {
      return Math.abs(w - Math.round(w)) < k.Z.eps;
    }, _ = function(w) {
      return m(w) && w > 0;
    }, f = function(w) {
      return w > 0;
    }, g = function(w) {
      return w >= 0;
    }, C = {}, P = { attractorDistance: g, color: b, defaultDistance: A.Z.isNumber, display: function(w) {
      return w === "html" || w === "internal";
    }, doAdvancedPlot: !1, draft: !1, drawLabels: !1, drawZero: !1, face: function(w) {
      return A.Z.exists(a.Z.normalizePointFace(w));
    }, factor: A.Z.isNumber, fillColor: b, fillOpacity: A.Z.isNumber, firstArrow: !1, fontSize: m, dash: m, gridX: A.Z.isNumber, gridY: A.Z.isNumber, hasGrid: !1, highlightFillColor: b, highlightFillOpacity: A.Z.isNumber, highlightStrokeColor: b, highlightStrokeOpacity: A.Z.isNumber, insertTicks: !1, lastArrow: !1, layer: function(w) {
      return m(w) && w >= 0;
    }, majorHeight: m, minorHeight: m, minorTicks: g, minTicksDistance: _, numberPointsHigh: _, numberPointsLow: _, opacity: A.Z.isNumber, radius: A.Z.isNumber, RDPsmoothing: !1, renderer: function(w) {
      return w === "vml" || w === "svg" || w === "canvas" || w === "no";
    }, right: function(w) {
      return /^[0-9]+px$/.test(w);
    }, showCopyright: !1, showInfobox: !1, showNavigation: !1, size: g, snapSizeX: f, snapSizeY: f, snapWidth: A.Z.isNumber, snapToGrid: !1, snatchDistance: g, straightFirst: !1, straightLast: !1, stretch: !1, strokeColor: b, strokeOpacity: A.Z.isNumber, strokeWidth: g, takeFirst: !1, takeSizeFromFile: !1, to10: !1, toOrigin: !1, translateTo10: !1, translateToOrigin: !1, useASCIIMathML: !1, useDirection: !1, useMathJax: !1, withLabel: !1, withTicks: !1, zoom: !1 };
    for (c in P)
      P.hasOwnProperty(c) && (C[c.toLowerCase()] = P[c]);
    return C;
  }(), a.Z.normalizePointFace = function(c) {
    return { cross: "x", x: "x", circle: "o", o: "o", square: "[]", "[]": "[]", plus: "+", "+": "+", divide: "|", "|": "|", minus: "-", "-": "-", diamond: "<>", "<>": "<>", triangleup: "^", a: "^", "^": "^", triangledown: "v", v: "v", triangleleft: "<", "<": "<", triangleright: ">", ">": ">" }[c];
  }, a.Z.useStandardOptions = function(c) {
    var b, m, _, f, g = a.Z.Options, C = c.hasGrid;
    for (b in c.options.grid.hasGrid = g.grid.hasGrid, c.options.grid.gridX = g.grid.gridX, c.options.grid.gridY = g.grid.gridY, c.options.grid.gridColor = g.grid.gridColor, c.options.grid.gridOpacity = g.grid.gridOpacity, c.options.grid.gridDash = g.grid.gridDash, c.options.grid.snapToGrid = g.grid.snapToGrid, c.options.grid.snapSizeX = g.grid.SnapSizeX, c.options.grid.snapSizeY = g.grid.SnapSizeY, c.takeSizeFromFile = g.takeSizeFromFile, f = function(P, w) {
      P.visProp.fillcolor = w.fillColor, P.visProp.highlightfillcolor = w.highlightFillColor, P.visProp.strokecolor = w.strokeColor, P.visProp.highlightstrokecolor = w.highlightStrokeColor;
    }, c.objects)
      if (c.objects.hasOwnProperty(b))
        if ((_ = c.objects[b]).elementClass === j.Z.OBJECT_CLASS_POINT)
          f(_, g.point);
        else if (_.elementClass === j.Z.OBJECT_CLASS_LINE)
          for (f(_, g.line), m = 0; m < _.ticks.length; m++)
            _.ticks[m].majorTicks = g.line.ticks.majorTicks, _.ticks[m].minTicksDistance = g.line.ticks.minTicksDistance, _.ticks[m].visProp.minorheight = g.line.ticks.minorHeight, _.ticks[m].visProp.majorheight = g.line.ticks.majorHeight;
        else
          _.elementClass === j.Z.OBJECT_CLASS_CIRCLE ? f(_, g.circle) : _.type === j.Z.OBJECT_TYPE_ANGLE ? f(_, g.angle) : _.type === j.Z.OBJECT_TYPE_ARC ? f(_, g.arc) : _.type === j.Z.OBJECT_TYPE_POLYGON ? f(_, g.polygon) : _.type === j.Z.OBJECT_TYPE_CONIC ? f(_, g.conic) : _.type === j.Z.OBJECT_TYPE_CURVE ? f(_, g.curve) : _.type === j.Z.OBJECT_TYPE_SECTOR && (_.arc.visProp.fillcolor = g.sector.fillColor, _.arc.visProp.highlightfillcolor = g.sector.highlightFillColor, _.arc.visProp.fillopacity = g.sector.fillOpacity, _.arc.visProp.highlightfillopacity = g.sector.highlightFillOpacity);
    c.fullUpdate(), C && !c.hasGrid ? c.removeGrids(c) : !C && c.hasGrid && c.create("grid", []);
  }, a.Z.useBlackWhiteOptions = function(c) {
    var b = a.Z.Options;
    b.point.fillColor = N.Z.rgb2bw(b.point.fillColor), b.point.highlightFillColor = N.Z.rgb2bw(b.point.highlightFillColor), b.point.strokeColor = N.Z.rgb2bw(b.point.strokeColor), b.point.highlightStrokeColor = N.Z.rgb2bw(b.point.highlightStrokeColor), b.line.fillColor = N.Z.rgb2bw(b.line.fillColor), b.line.highlightFillColor = N.Z.rgb2bw(b.line.highlightFillColor), b.line.strokeColor = N.Z.rgb2bw(b.line.strokeColor), b.line.highlightStrokeColor = N.Z.rgb2bw(b.line.highlightStrokeColor), b.circle.fillColor = N.Z.rgb2bw(b.circle.fillColor), b.circle.highlightFillColor = N.Z.rgb2bw(b.circle.highlightFillColor), b.circle.strokeColor = N.Z.rgb2bw(b.circle.strokeColor), b.circle.highlightStrokeColor = N.Z.rgb2bw(b.circle.highlightStrokeColor), b.arc.fillColor = N.Z.rgb2bw(b.arc.fillColor), b.arc.highlightFillColor = N.Z.rgb2bw(b.arc.highlightFillColor), b.arc.strokeColor = N.Z.rgb2bw(b.arc.strokeColor), b.arc.highlightStrokeColor = N.Z.rgb2bw(b.arc.highlightStrokeColor), b.polygon.fillColor = N.Z.rgb2bw(b.polygon.fillColor), b.polygon.highlightFillColor = N.Z.rgb2bw(b.polygon.highlightFillColor), b.sector.fillColor = N.Z.rgb2bw(b.sector.fillColor), b.sector.highlightFillColor = N.Z.rgb2bw(b.sector.highlightFillColor), b.curve.strokeColor = N.Z.rgb2bw(b.curve.strokeColor), b.grid.gridColor = N.Z.rgb2bw(b.grid.gridColor), a.Z.useStandardOptions(c);
  }, a.Z.Options.normalizePointFace = a.Z.normalizePointFace;
  const E = a.Z.Options;
}, 632: (d, M, x) => {
  x.d(M, { Z: () => N });
  var a = x(765), j = x(351), k = x(109);
  a.Z.GeonextParser = { replacePow: function(A) {
    var E, c, b, m, _, f, g, C, P, w, T, D;
    for (w = (A = A.replace(/(\s*)\^(\s*)/g, "^")).indexOf("^"), m = -1; w >= 0 && w < A.length - 1; ) {
      if (m === w)
        throw new Error("JSXGraph: Error while parsing expression '" + A + "'");
      if (m = w, P = A.slice(0, w), T = A.slice(w + 1), P.charAt(P.length - 1) === ")") {
        for (E = 1, c = P.length - 2; c >= 0 && E > 0; )
          (b = P.charAt(c)) === ")" ? E++ : b === "(" && (E -= 1), c -= 1;
        if (E !== 0)
          throw new Error("JSXGraph: Missing '(' in expression");
        for (_ = "", g = P.substring(0, c + 1), C = c; C >= 0 && g.substr(C, 1).match(/([\w.]+)/); )
          _ = RegExp.$1 + _, C -= 1;
        _ = (_ += P.substring(c + 1, P.length)).replace(/([()+*%^\-/\][])/g, "\\$1");
      } else
        _ = "[\\w\\.]+";
      if (T.match(/^([\w.]*\()/)) {
        for (E = 1, c = RegExp.$1.length; c < T.length && E > 0; )
          (b = T.charAt(c)) === ")" ? E -= 1 : b === "(" && (E += 1), c += 1;
        if (E !== 0)
          throw new Error("JSXGraph: Missing ')' in expression");
        f = (f = T.substring(0, c)).replace(/([()+*%^\-/[\]])/g, "\\$1");
      } else
        f = "[\\w\\.]+";
      D = new RegExp("(" + _ + ")\\^(" + f + ")"), w = (A = A.replace(D, "pow($1,$2)")).indexOf("^");
    }
    return A;
  }, replaceIf: function(A) {
    var E, c, b, m, _, f, g, C, P, w = "", T = null, D = null, I = null;
    if ((b = A.indexOf("If(")) < 0)
      return A;
    for (A = A.replace(/""/g, "0"); b >= 0; ) {
      for (E = A.slice(0, b), c = A.slice(b + 3), _ = 1, m = 0, f = -1, g = -1; m < c.length && _ > 0; )
        (C = c.charAt(m)) === ")" ? _ -= 1 : C === "(" ? _ += 1 : C === "," && _ === 1 && (f < 0 ? f = m : g = m), m += 1;
      if (P = c.slice(0, m - 1), c = c.slice(m), f < 0 || g < 0)
        return "";
      T = P.slice(0, f), D = P.slice(f + 1, g), I = P.slice(g + 1), w += E + "((" + (T = this.replaceIf(T)) + ")?(" + (D = this.replaceIf(D)) + "):(" + (I = this.replaceIf(I)) + "))", T = null, D = null, b = (A = c).indexOf("If(");
    }
    return w += c;
  }, replaceNameById: function(A, E, c) {
    var b, m, _, f, g = 0, C = ["X", "Y", "L", "V"], P = function(w) {
      return c ? "$('" + w + "')" : w;
    };
    for (f = 0; f < C.length; f++)
      for (g = A.indexOf(C[f] + "("); g >= 0; )
        g >= 0 && (b = A.indexOf(")", g + 2)) >= 0 && (m = (m = A.slice(g + 2, b)).replace(/\\(['"])?/g, "$1"), (_ = E.elementsByName[m]) && (A = A.slice(0, g + 2) + (c ? "$('" : "") + P(_.id) + A.slice(b))), b = A.indexOf(")", g + 2), g = A.indexOf(C[f] + "(", b);
    for (g = A.indexOf("Dist("); g >= 0; )
      g >= 0 && (b = A.indexOf(",", g + 5)) >= 0 && (m = (m = A.slice(g + 5, b)).replace(/\\(['"])?/g, "$1"), (_ = E.elementsByName[m]) && (A = A.slice(0, g + 5) + P(_.id) + A.slice(b))), b = A.indexOf(",", g + 5), g = A.indexOf(",", b), (b = A.indexOf(")", g + 1)) >= 0 && (m = (m = A.slice(g + 1, b)).replace(/\\(['"])?/g, "$1"), (_ = E.elementsByName[m]) && (A = A.slice(0, g + 1) + P(_.id) + A.slice(b))), b = A.indexOf(")", g + 1), g = A.indexOf("Dist(", b);
    for (C = ["Deg", "Rad"], f = 0; f < C.length; f++)
      for (g = A.indexOf(C[f] + "("); g >= 0; )
        g >= 0 && (b = A.indexOf(",", g + 4)) >= 0 && (m = (m = A.slice(g + 4, b)).replace(/\\(['"])?/g, "$1"), (_ = E.elementsByName[m]) && (A = A.slice(0, g + 4) + P(_.id) + A.slice(b))), b = A.indexOf(",", g + 4), g = A.indexOf(",", b), (b = A.indexOf(",", g + 1)) >= 0 && (m = (m = A.slice(g + 1, b)).replace(/\\(['"])?/g, "$1"), (_ = E.elementsByName[m]) && (A = A.slice(0, g + 1) + P(_.id) + A.slice(b))), b = A.indexOf(",", g + 1), g = A.indexOf(",", b), (b = A.indexOf(")", g + 1)) >= 0 && (m = (m = A.slice(g + 1, b)).replace(/\\(['"])?/g, "$1"), (_ = E.elementsByName[m]) && (A = A.slice(0, g + 1) + P(_.id) + A.slice(b))), b = A.indexOf(")", g + 1), g = A.indexOf(C[f] + "(", b);
    return A;
  }, replaceIdByObj: function(A) {
    var E = /(X|Y|L)\(([\w_]+)\)/g;
    return A = A.replace(E, "$('$2').$1()"), E = /(V)\(([\w_]+)\)/g, A = A.replace(E, "$('$2').Value()"), E = /(Dist)\(([\w_]+),([\w_]+)\)/g, A = A.replace(E, "dist($('$2'), $('$3'))"), E = /(Deg)\(([\w_]+),([ \w[\w_]+),([\w_]+)\)/g, A = A.replace(E, "deg($('$2'),$('$3'),$('$4'))"), E = /Rad\(([\w_]+),([\w_]+),([\w_]+)\)/g, A = A.replace(E, "rad($('$1'),$('$2'),$('$3'))"), E = /N\((.+)\)/g, A = A.replace(E, "($1)");
  }, geonext2JS: function(A, E) {
    var c, b, m, _ = ["Abs", "ACos", "ASin", "ATan", "Ceil", "Cos", "Exp", "Factorial", "Floor", "Log", "Max", "Min", "Random", "Round", "Sin", "Sqrt", "Tan", "Trunc"], f = ["abs", "acos", "asin", "atan", "ceil", "cos", "exp", "factorial", "floor", "log", "max", "min", "random", "round", "sin", "sqrt", "tan", "ceil"];
    for (b = A = (A = (A = A.replace(/&lt;/g, "<")).replace(/&gt;/g, ">")).replace(/&amp;/g, "&"), b = this.replaceNameById(b, E), b = this.replaceIf(b), b = this.replacePow(b), b = this.replaceIdByObj(b), m = 0; m < _.length; m++)
      c = new RegExp(["(\\W|^)(", _[m], ")"].join(""), "ig"), b = b.replace(c, ["$1", f[m]].join(""));
    return b = (b = (b = (b = (b = b.replace(/True/g, "true")).replace(/False/g, "false")).replace(/fasle/g, "false")).replace(/Pi/g, "PI")).replace(/"/g, "'");
  }, findDependencies: function(A, E, c) {
    var b, m, _, f;
    for (m in k.Z.exists(c) || (c = A.board), b = c.elementsByName)
      b.hasOwnProperty(m) && m !== A.name && (b[m].elementClass === j.Z.OBJECT_CLASS_TEXT && k.Z.evaluate(b[m].visProp.islabel) || (f = (f = m.replace(/\[/g, "\\[")).replace(/\]/g, "\\]"), _ = new RegExp("\\(([\\w\\[\\]'_ ]+,)*(" + f + ")(,[\\w\\[\\]'_ ]+)*\\)", "g"), E.search(_) >= 0 && b[m].addChild(A)));
  }, gxt2jc: function(A, E) {
    var c;
    return c = A = (A = (A = A.replace(/&lt;/g, "<")).replace(/&gt;/g, ">")).replace(/&amp;/g, "&"), c = (c = (c = (c = this.replaceNameById(c, E, !0)).replace(/True/g, "true")).replace(/False/g, "false")).replace(/fasle/g, "false");
  } };
  const N = a.Z.GeonextParser;
}, 254: (__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
  __webpack_require__.d(__webpack_exports__, { Z: () => __WEBPACK_DEFAULT_EXPORT__ });
  var _jxg__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(765), _base_constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(351), _base_text__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(573), _math_math__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(275), _math_ia__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(785), _math_geometry__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(922), _math_statistics__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(309), _utils_type__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(109), _utils_env__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(503);
  Object.create || (Object.create = function(d, M) {
    if (typeof d != "object" && typeof d != "function")
      throw new TypeError("Object prototype may only be an Object: " + d);
    if (d === null)
      throw new Error("This browser's implementation of Object.create is a shim and doesn't support 'null' as the first argument.");
    if (M !== void 0)
      throw new Error("This browser's implementation of Object.create is a shim and doesn't support a second argument.");
    function x() {
    }
    return x.prototype = d, new x();
  });
  var priv = { modules: { math: _math_math__WEBPACK_IMPORTED_MODULE_3__.Z, "math/geometry": _math_geometry__WEBPACK_IMPORTED_MODULE_5__.Z, "math/statistics": _math_statistics__WEBPACK_IMPORTED_MODULE_6__.Z, "math/numerics": _math_math__WEBPACK_IMPORTED_MODULE_3__.Z.Numerics } }, r, _ccache;
  _jxg__WEBPACK_IMPORTED_MODULE_0__.Z.JessieCode = function(d, M) {
    this.scope = { id: 0, hasChild: !0, args: [], locals: {}, context: null, previous: null }, this.scopes = [], this.scopes.push(this.scope), this.dpstack = [[]], this.pscope = 0, this.propstack = [{}], this.propscope = 0, this.lhs = [], this.isLHS = !1, this.warnLog = "jcwarn", this.$log = [], this.builtIn = this.defineBuiltIn(), this.operands = this.getPossibleOperands(), this.board = null, this.lineToElement = {}, this.parCurLine = 1, this.parCurColumn = 0, this.line = 1, this.col = 1, _jxg__WEBPACK_IMPORTED_MODULE_0__.Z.CA && (this.CA = new _jxg__WEBPACK_IMPORTED_MODULE_0__.Z.CA(this.node, this.createNode, this)), this.code = "", typeof d == "string" && this.parse(d, M);
  }, _jxg__WEBPACK_IMPORTED_MODULE_0__.Z.extend(_jxg__WEBPACK_IMPORTED_MODULE_0__.Z.JessieCode.prototype, { node: function(d, M, x) {
    return { type: d, value: M, children: x };
  }, createNode: function(d, M, x) {
    var a, j = this.node(d, M, []);
    for (a = 2; a < arguments.length; a++)
      j.children.push(arguments[a]);
    return j.type == "node_const" && _utils_type__WEBPACK_IMPORTED_MODULE_7__.Z.isNumber(j.value) && (j.isMath = !0), j.line = this.parCurLine, j.col = this.parCurColumn, j;
  }, pushScope: function(d) {
    var M = { args: d, locals: {}, context: null, previous: this.scope };
    return this.scope.hasChild = !0, this.scope = M, M.id = this.scopes.push(M) - 1, M;
  }, popScope: function() {
    var d = this.scope.previous;
    return this.scope = d !== null ? d : this.scope, this.scope;
  }, getElementById: function(d) {
    return this.board.objects[d];
  }, log: function() {
    this.$log.push(arguments), typeof console == "object" && console.log && console.log.apply(console, arguments);
  }, creator: (_ccache = {}, (r = function(d) {
    var M, x;
    return typeof _ccache[this.board.id + d] == "function" ? M = _ccache[this.board.id + d] : (x = this, (M = function(a, j) {
      var k;
      return (k = _utils_type__WEBPACK_IMPORTED_MODULE_7__.Z.exists(j) ? j : {}).name === void 0 && k.id === void 0 && (k.name = x.lhs[x.scope.id] !== 0 ? x.lhs[x.scope.id] : ""), x.board.create(d, a, k);
    }).creator = !0, _ccache[this.board.id + d] = M), M;
  }).clearCache = function() {
    _ccache = {};
  }, r), letvar: function(d, M) {
    this.builtIn[d] && this._warn('"' + d + '" is a predefined value.'), this.scope.locals[d] = M;
  }, isLocalVariable: function(d) {
    for (var M = this.scope; M !== null; ) {
      if (_utils_type__WEBPACK_IMPORTED_MODULE_7__.Z.exists(M.locals[d]))
        return M;
      M = M.previous;
    }
    return null;
  }, isParameter: function(d) {
    for (var M = this.scope; M !== null; ) {
      if (_utils_type__WEBPACK_IMPORTED_MODULE_7__.Z.indexOf(M.args, d) > -1)
        return M;
      M = M.previous;
    }
    return null;
  }, isCreator: function(d) {
    return !!_jxg__WEBPACK_IMPORTED_MODULE_0__.Z.elements[d];
  }, isMathMethod: function(d) {
    return d !== "E" && !!Math[d];
  }, isBuiltIn: function(d) {
    return !!this.builtIn[d];
  }, getvar: function(d, M, x) {
    var a;
    if (M = _utils_type__WEBPACK_IMPORTED_MODULE_7__.Z.def(M, !1), (a = this.isLocalVariable(d)) !== null)
      return a.locals[d];
    if (d === "$board" || d === "EULER" || d === "PI")
      return this.builtIn[d];
    if (x) {
      if (this.isBuiltIn(d))
        return this.builtIn[d];
      if (this.isMathMethod(d))
        return Math[d];
      if (this.isCreator(d))
        return this.creator(d);
    }
    return M || (a = this.board.select(d)) === d ? void 0 : a;
  }, resolve: function(d) {
    for (var M = this.scope; M !== null; ) {
      if (_utils_type__WEBPACK_IMPORTED_MODULE_7__.Z.exists(M.locals[d]))
        return M.locals[d];
      M = M.previous;
    }
  }, getvarJS: function(d, M, x) {
    var a, j = "";
    return M = _utils_type__WEBPACK_IMPORTED_MODULE_7__.Z.def(M, !1), x = _utils_type__WEBPACK_IMPORTED_MODULE_7__.Z.def(x, !1), this.isParameter(d) !== null ? d : this.isLocalVariable(d) === null || x ? this.isCreator(d) ? "(function () { var a = Array.prototype.slice.call(arguments, 0), props = " + (x ? "a.pop()" : "{}") + "; return $jc$.board.create.apply($jc$.board, ['" + d + "'].concat([a, props])); })" : (x && this._error("Syntax error (attribute values are allowed with element creators only)"), this.isBuiltIn(d) ? (j = this.builtIn[d].src || this.builtIn[d], _utils_type__WEBPACK_IMPORTED_MODULE_7__.Z.isNumber(j) || j.match(/board\.select/) ? j : (d = j.split(".").pop(), _utils_type__WEBPACK_IMPORTED_MODULE_7__.Z.exists(this.board.mathLib) && (a = new RegExp("^Math." + d)).exec(j) !== null ? j.replace(a, "$jc$.board.mathLib." + d) : _utils_type__WEBPACK_IMPORTED_MODULE_7__.Z.exists(this.board.mathLibJXG) && (a = new RegExp("^JXG.Math.")).exec(j) !== null ? j.replace(a, "$jc$.board.mathLibJXG.") : j)) : this.isMathMethod(d) ? "$jc$.board.mathLib." + d : M ? "" : (_utils_type__WEBPACK_IMPORTED_MODULE_7__.Z.isId(this.board, d) ? (j = "$jc$.board.objects['" + d + "']", this.board.objects[d].elType === "slider" && (j += ".Value()")) : _utils_type__WEBPACK_IMPORTED_MODULE_7__.Z.isName(this.board, d) ? (j = "$jc$.board.elementsByName['" + d + "']", this.board.elementsByName[d].elType === "slider" && (j += ".Value()")) : _utils_type__WEBPACK_IMPORTED_MODULE_7__.Z.isGroup(this.board, d) && (j = "$jc$.board.groups['" + d + "']"), j)) : "$jc$.resolve('" + d + "')";
  }, makeMap: function(d) {
    return d.isMap = !0, d;
  }, functionCodeJS: function(d) {
    var M = d.children[0].join(", "), x = "", a = "";
    return d.value === "op_map" && (x = "{ return  ", a = " }"), "function (" + M + `) {
var $oldscope$ = $jc$.scope;
$jc$.scope = $jc$.scopes[` + this.scope.id + `];
var r = (function () ` + x + this.compile(d.children[1], !0) + a + `)();
$jc$.scope = $oldscope$;
return r;
}`;
  }, defineFunction: function(node) {
    var fun, i, that = this, list = node.children[0], scope = this.pushScope(list), _that;
    if (this.board.options.jc.compile) {
      for (this.isLHS = !1, i = 0; i < list.length; i++)
        scope.locals[list[i]] = list[i];
      this.replaceNames(node.children[1]), fun = function(jc) {
        var fun, str = "var f = function($jc$) { return " + jc.functionCodeJS(node) + "}; f;";
        try {
          for (fun = eval(str)(jc), scope.argtypes = [], i = 0; i < list.length; i++)
            scope.argtypes.push(that.resolveType(list[i], node));
          return fun;
        } catch (d) {
          return jc._warn(`error compiling function

` + str + `

` + d.toString()), function() {
          };
        }
      }(this), this.popScope();
    } else
      fun = function(d, M, x) {
        return function() {
          var a, j;
          for (j = M.scope, M.scope = M.scopes[x], a = 0; a < d.length; a++)
            M.scope.locals[d[a]] = arguments[a];
          return a = M.execute(node.children[1]), M.scope = j, a;
        };
      }(list, this, scope.id);
    return fun.node = node, fun.scope = scope, fun.toJS = fun.toString, fun.toString = (_that = this, function() {
      return _that.compile(_that.replaceIDs(_utils_type__WEBPACK_IMPORTED_MODULE_7__.Z.deepCopy(node)));
    }), fun.deps = {}, this.collectDependencies(node.children[1], fun.deps), fun;
  }, mergeAttributes: function(d) {
    var M, x = {};
    for (M = 0; M < arguments.length; M++)
      x = _utils_type__WEBPACK_IMPORTED_MODULE_7__.Z.deepCopy(x, arguments[M], !0);
    return x;
  }, setProp: function(d, M, x) {
    var a, j, k = {};
    d.elementClass !== _base_constants__WEBPACK_IMPORTED_MODULE_1__.Z.OBJECT_CLASS_POINT || M !== "X" && M !== "Y" ? d.elementClass !== _base_constants__WEBPACK_IMPORTED_MODULE_1__.Z.OBJECT_CLASS_TEXT || M !== "X" && M !== "Y" ? d.type && d.elementClass && d.visProp ? _utils_type__WEBPACK_IMPORTED_MODULE_7__.Z.exists(d[d.methodMap[M]]) && typeof d[d.methodMap[M]] != "function" ? d[d.methodMap[M]] = x : (k[M] = x, d.setAttribute(k)) : d[M] = x : (typeof x == "number" ? d[M] = function() {
      return x;
    } : typeof x == "function" ? (d.isDraggable = !1, d[M] = x) : typeof x == "string" && (d.isDraggable = !1, d[M] = _utils_type__WEBPACK_IMPORTED_MODULE_7__.Z.createFunction(x, this.board, null, !0), d[M + "jc"] = x), d[M].origin = x, this.board.update()) : (M = M.toLowerCase(), d.isDraggable && typeof x == "number" ? (a = M === "x" ? x : d.X(), j = M === "y" ? x : d.Y(), d.setPosition(_base_constants__WEBPACK_IMPORTED_MODULE_1__.Z.COORDS_BY_USER, [a, j])) : !d.isDraggable || typeof x != "function" && typeof x != "string" ? d.isDraggable || (a = M === "x" ? x : d.XEval.origin, j = M === "y" ? x : d.YEval.origin, d.addConstraint([a, j])) : (a = M === "x" ? x : d.coords.usrCoords[1], j = M === "y" ? x : d.coords.usrCoords[2], d.addConstraint([a, j])), this.board.update());
  }, _genericParse: function(d, M, x, a) {
    var j, k, N, A, E = d.replace(/\r\n/g, `
`).split(`
`), c = [];
    a || (this.code += d + `
`), _base_text__WEBPACK_IMPORTED_MODULE_2__.Z && (k = _base_text__WEBPACK_IMPORTED_MODULE_2__.Z.prototype.setText, _base_text__WEBPACK_IMPORTED_MODULE_2__.Z.prototype.setText = _base_text__WEBPACK_IMPORTED_MODULE_2__.Z.prototype.setTextJessieCode);
    try {
      for (_utils_type__WEBPACK_IMPORTED_MODULE_7__.Z.exists(x) || (x = !1), j = 0; j < E.length; j++)
        x && (E[j] = _jxg__WEBPACK_IMPORTED_MODULE_0__.Z.GeonextParser.geonext2JS(E[j], this.board)), c.push(E[j]);
      switch (d = c.join(`
`), N = parser.parse(d), this.CA && (N = this.CA.expandDerivatives(N, null, N), N = this.CA.removeTrivialNodes(N)), M) {
        case "parse":
          A = this.execute(N);
          break;
        case "manipulate":
          A = this.compile(N);
          break;
        case "getAst":
          A = N;
          break;
        default:
          A = !1;
      }
    } catch (b) {
      throw b;
    } finally {
      _base_text__WEBPACK_IMPORTED_MODULE_2__.Z && (_base_text__WEBPACK_IMPORTED_MODULE_2__.Z.prototype.setText = k);
    }
    return A;
  }, parse: function(d, M, x) {
    return this._genericParse(d, "parse", M, x);
  }, manipulate: function(d, M, x) {
    return this._genericParse(d, "manipulate", M, x);
  }, getAST: function(d, M, x) {
    return this._genericParse(d, "getAst", M, x);
  }, snippet: function(d, M, x, a) {
    var j;
    return M = _utils_type__WEBPACK_IMPORTED_MODULE_7__.Z.def(M, !0), x = _utils_type__WEBPACK_IMPORTED_MODULE_7__.Z.def(x, ""), a = _utils_type__WEBPACK_IMPORTED_MODULE_7__.Z.def(a, !1), j = (M ? " function (" + x + ") { return " : "") + d + (M ? "; }" : "") + ";", this.parse(j, a, !0);
  }, replaceIDs: function(d) {
    var M, x;
    if (d.replaced && (x = this.board.objects[d.children[1][0].value], _utils_type__WEBPACK_IMPORTED_MODULE_7__.Z.exists(x) && x.name !== "" && (d.type = "node_var", d.value = x.name, d.children.length = 0, delete d.replaced)), _utils_type__WEBPACK_IMPORTED_MODULE_7__.Z.isArray(d))
      for (M = 0; M < d.length; M++)
        d[M] = this.replaceIDs(d[M]);
    if (d.children)
      for (M = d.children.length; M > 0; M--)
        _utils_type__WEBPACK_IMPORTED_MODULE_7__.Z.exists(d.children[M - 1]) && (d.children[M - 1] = this.replaceIDs(d.children[M - 1]));
    return d;
  }, replaceNames: function(d) {
    var M, x;
    if (x = d.value, d.type === "node_op" && x === "op_lhs" && d.children.length === 1 ? this.isLHS = !0 : d.type === "node_var" && (this.isLHS ? this.letvar(x, !0) : !_utils_type__WEBPACK_IMPORTED_MODULE_7__.Z.exists(this.getvar(x, !0)) && _utils_type__WEBPACK_IMPORTED_MODULE_7__.Z.exists(this.board.elementsByName[x]) && (d = this.createReplacementNode(d))), _utils_type__WEBPACK_IMPORTED_MODULE_7__.Z.isArray(d))
      for (M = 0; M < d.length; M++)
        d[M] = this.replaceNames(d[M]);
    if (d.children)
      for (M = d.children.length; M > 0; M--)
        _utils_type__WEBPACK_IMPORTED_MODULE_7__.Z.exists(d.children[M - 1]) && (d.children[M - 1] = this.replaceNames(d.children[M - 1]));
    return d.type === "node_op" && d.value === "op_lhs" && d.children.length === 1 && (this.isLHS = !1), d;
  }, createReplacementNode: function(d) {
    var M = d.value, x = this.board.elementsByName[M];
    return (d = this.createNode("node_op", "op_execfun", this.createNode("node_var", "$"), [this.createNode("node_str", x.id)])).replaced = !0, d;
  }, collectDependencies: function(d, M) {
    var x, a, j, k;
    if (_utils_type__WEBPACK_IMPORTED_MODULE_7__.Z.isArray(d))
      for (k = d.length, x = 0; x < k; x++)
        this.collectDependencies(d[x], M);
    else if (a = d.value, d.type === "node_var" && (j = this.getvar(a)) && j.visProp && j.type && j.elementClass && j.id && (M[j.id] = j), d.type === "node_op" && d.value === "op_execfun" && d.children.length > 1 && d.children[0].value === "$" && d.children[1].length > 0 && (M[j = d.children[1][0].value] = this.board.objects[j]), d.children)
      for (x = d.children.length; x > 0; x--)
        _utils_type__WEBPACK_IMPORTED_MODULE_7__.Z.exists(d.children[x - 1]) && this.collectDependencies(d.children[x - 1], M);
  }, resolveProperty: function(d, M, x) {
    return x = _utils_type__WEBPACK_IMPORTED_MODULE_7__.Z.def(x, !1), d && d.methodMap && (_utils_type__WEBPACK_IMPORTED_MODULE_7__.Z.exists(d.subs) && _utils_type__WEBPACK_IMPORTED_MODULE_7__.Z.exists(d.subs[M]) ? d = d.subs : _utils_type__WEBPACK_IMPORTED_MODULE_7__.Z.exists(d.methodMap[M]) ? M = d.methodMap[M] : (d = d.visProp, M = M.toLowerCase())), _utils_type__WEBPACK_IMPORTED_MODULE_7__.Z.isFunction(d) && this._error("Accessing function properties is not allowed."), _utils_type__WEBPACK_IMPORTED_MODULE_7__.Z.exists(d) || this._error(d + " is not an object"), _utils_type__WEBPACK_IMPORTED_MODULE_7__.Z.exists(d[M]) || this._error("unknown property " + M), x && typeof d[M] == "function" ? function() {
      return d[M].apply(d, arguments);
    } : d[M];
  }, resolveType: function(d, M) {
    var x, a;
    if (_utils_type__WEBPACK_IMPORTED_MODULE_7__.Z.isArray(M)) {
      for (x = 0; x < M.length; x++)
        if ((a = this.resolveType(d, M[x])) !== "any")
          return a;
    }
    if (M.type === "node_op" && M.value === "op_execfun" && M.children[0].type === "node_var" && M.children[0].value === d)
      return "function";
    if (M.type === "node_op") {
      for (x = 0; x < M.children.length; x++)
        if (M.children[0].type === "node_var" && M.children[0].value === d && (M.value === "op_add" || M.value === "op_sub" || M.value === "op_mul" || M.value === "op_div" || M.value === "op_mod" || M.value === "op_exp" || M.value === "op_neg"))
          return "any";
      for (x = 0; x < M.children.length; x++)
        if ((a = this.resolveType(d, M.children[x])) !== "any")
          return a;
    }
    return "any";
  }, getLHS: function(d) {
    var M;
    if (d.type === "node_var")
      M = { o: this.scope.locals, what: d.value };
    else if (d.type === "node_op" && d.value === "op_property")
      M = { o: this.execute(d.children[0]), what: d.children[1] };
    else {
      if (d.type !== "node_op" || d.value !== "op_extvalue")
        throw new Error("Syntax error: Invalid left-hand side of assignment.");
      M = { o: this.execute(d.children[0]), what: this.execute(d.children[1]) };
    }
    return M;
  }, getLHSCompiler: function(d, M) {
    var x;
    if (d.type === "node_var")
      x = d.value;
    else if (d.type === "node_op" && d.value === "op_property")
      x = [this.compile(d.children[0], M), "'" + d.children[1] + "'"];
    else {
      if (d.type !== "node_op" || d.value !== "op_extvalue")
        throw new Error("Syntax error: Invalid left-hand side of assignment.");
      x = [this.compile(d.children[0], M), d.children[1].type === "node_const" ? d.children[1].value : this.compile(d.children[1], M)];
    }
    return x;
  }, execute: function(d) {
    var M, x, a, j, k, N, A, E, c, b, m = [];
    if (M = 0, !d)
      return M;
    switch (this.line = d.line, this.col = d.col, d.type) {
      case "node_op":
        switch (d.value) {
          case "op_none":
            d.children[0] && this.execute(d.children[0]), d.children[1] && (M = this.execute(d.children[1]));
            break;
          case "op_assign":
            x = this.getLHS(d.children[0]), this.lhs[this.scope.id] = x.what, x.o.type && x.o.elementClass && x.o.methodMap && x.what === "label" && this._error("Left-hand side of assignment is read-only."), M = this.execute(d.children[1]), x.o !== this.scope.locals || _utils_type__WEBPACK_IMPORTED_MODULE_7__.Z.isArray(x.o) && typeof x.what == "number" ? this.setProp(x.o, x.what, M) : this.letvar(x.what, M), this.lhs[this.scope.id] = 0;
            break;
          case "op_if":
            this.execute(d.children[0]) && (M = this.execute(d.children[1]));
            break;
          case "op_conditional":
          case "op_if_else":
            M = this.execute(d.children[0]) ? this.execute(d.children[1]) : this.execute(d.children[2]);
            break;
          case "op_while":
            for (; this.execute(d.children[0]); )
              this.execute(d.children[1]);
            break;
          case "op_do":
            do
              this.execute(d.children[0]);
            while (this.execute(d.children[1]));
            break;
          case "op_for":
            for (this.execute(d.children[0]); this.execute(d.children[1]); this.execute(d.children[2]))
              this.execute(d.children[3]);
            break;
          case "op_proplst":
            d.children[0] && this.execute(d.children[0]), d.children[1] && this.execute(d.children[1]);
            break;
          case "op_emptyobject":
            M = {};
            break;
          case "op_proplst_val":
            this.propstack.push({}), this.propscope++, this.execute(d.children[0]), M = this.propstack[this.propscope], this.propstack.pop(), this.propscope--;
            break;
          case "op_prop":
            this.propstack[this.propscope][d.children[0]] = this.execute(d.children[1]);
            break;
          case "op_array":
            for (M = [], k = d.children[0].length, a = 0; a < k; a++)
              M.push(this.execute(d.children[0][a]));
            break;
          case "op_extvalue":
            M = this.execute(d.children[0]), M = typeof (a = this.execute(d.children[1])) == "number" && Math.abs(Math.round(a) - a) < _math_math__WEBPACK_IMPORTED_MODULE_3__.Z.eps ? M[a] : void 0;
            break;
          case "op_return":
            if (this.scope !== 0)
              return this.execute(d.children[0]);
            this._error("Unexpected return.");
            break;
          case "op_map":
            d.children[1].isMath || d.children[1].type === "node_var" || this._error("execute: In a map only function calls and mathematical expressions are allowed."), (E = this.defineFunction(d)).isMap = !0, M = E;
            break;
          case "op_function":
            (E = this.defineFunction(d)).isMap = !1, M = E;
            break;
          case "op_execfun":
            if (this.dpstack.push([]), this.pscope++, N = d.children[1], _utils_type__WEBPACK_IMPORTED_MODULE_7__.Z.exists(d.children[2]))
              if (d.children[3])
                for (A = d.children[2], c = {}, a = 0; a < A.length; a++)
                  c = _utils_type__WEBPACK_IMPORTED_MODULE_7__.Z.deepCopy(c, this.execute(A[a]), !0);
              else
                c = this.execute(d.children[2]);
            for (d.children[0]._isFunctionName = !0, E = this.execute(d.children[0]), delete d.children[0]._isFunctionName, b = E && E.sc ? E.sc : this, !E.creator && _utils_type__WEBPACK_IMPORTED_MODULE_7__.Z.exists(d.children[2]) && this._error("Unexpected value. Only element creators are allowed to have a value after the function call."), a = 0; a < N.length; a++)
              _utils_type__WEBPACK_IMPORTED_MODULE_7__.Z.exists(E.scope) && _utils_type__WEBPACK_IMPORTED_MODULE_7__.Z.exists(E.scope.argtypes) && E.scope.argtypes[a] === "function" ? (N[a]._isFunctionName = !0, m[a] = this.execute(N[a]), delete N[a]._isFunctionName) : m[a] = this.execute(N[a]), this.dpstack[this.pscope].push({ line: d.children[1][a].line, col: d.children[1][a].ecol });
            if (typeof E != "function" || E.creator)
              if (typeof E == "function" && E.creator) {
                j = this.line;
                try {
                  for ((M = E(m, c)).jcLineStart = j, M.jcLineEnd = d.eline, a = j; a <= d.line; a++)
                    this.lineToElement[a] = M;
                  M.debugParents = this.dpstack[this.pscope];
                } catch (_) {
                  this._error(_.toString());
                }
              } else
                this._error("Function '" + E + "' is undefined.");
            else
              M = E.apply(b, m);
            this.dpstack.pop(), this.pscope--;
            break;
          case "op_property":
            j = this.execute(d.children[0]), x = d.children[1], M = this.resolveProperty(j, x, !1), _utils_type__WEBPACK_IMPORTED_MODULE_7__.Z.exists(M) && (M.sc = j);
            break;
          case "op_use":
            this._warn("Use of the 'use' operator is deprecated."), this.use(d.children[0].toString());
            break;
          case "op_delete":
            this._warn("Use of the 'delete' operator is deprecated. Please use the remove() function."), x = this.getvar(d.children[0]), M = this.del(x);
            break;
          case "op_eq":
            M = this.execute(d.children[0]) == this.execute(d.children[1]);
            break;
          case "op_neq":
            M = this.execute(d.children[0]) != this.execute(d.children[1]);
            break;
          case "op_approx":
            M = Math.abs(this.execute(d.children[0]) - this.execute(d.children[1])) < _math_math__WEBPACK_IMPORTED_MODULE_3__.Z.eps;
            break;
          case "op_gt":
            M = this.execute(d.children[0]) > this.execute(d.children[1]);
            break;
          case "op_lt":
            M = this.execute(d.children[0]) < this.execute(d.children[1]);
            break;
          case "op_geq":
            M = this.execute(d.children[0]) >= this.execute(d.children[1]);
            break;
          case "op_leq":
            M = this.execute(d.children[0]) <= this.execute(d.children[1]);
            break;
          case "op_or":
            M = this.execute(d.children[0]) || this.execute(d.children[1]);
            break;
          case "op_and":
            M = this.execute(d.children[0]) && this.execute(d.children[1]);
            break;
          case "op_not":
            M = !this.execute(d.children[0]);
            break;
          case "op_add":
            M = this.add(this.execute(d.children[0]), this.execute(d.children[1]));
            break;
          case "op_sub":
            M = this.sub(this.execute(d.children[0]), this.execute(d.children[1]));
            break;
          case "op_div":
            M = this.div(this.execute(d.children[0]), this.execute(d.children[1]));
            break;
          case "op_mod":
            M = this.mod(this.execute(d.children[0]), this.execute(d.children[1]), !0);
            break;
          case "op_mul":
            M = this.mul(this.execute(d.children[0]), this.execute(d.children[1]));
            break;
          case "op_exp":
            M = this.pow(this.execute(d.children[0]), this.execute(d.children[1]));
            break;
          case "op_neg":
            M = this.neg(this.execute(d.children[0]));
        }
        break;
      case "node_var":
        M = this.getvar(d.value, !1, d._isFunctionName);
        break;
      case "node_const":
        M = d.value === null ? null : Number(d.value);
        break;
      case "node_const_bool":
        M = d.value;
        break;
      case "node_str":
        M = d.value.replace(/\\(.)/g, "$1");
    }
    return M;
  }, compile: function(d, M) {
    var x, a, j, k = "";
    if (_utils_type__WEBPACK_IMPORTED_MODULE_7__.Z.exists(M) || (M = !1), !d)
      return k;
    switch (d.type) {
      case "node_op":
        switch (d.value) {
          case "op_none":
            d.children[0] && (k = this.compile(d.children[0], M)), d.children[1] && (k += this.compile(d.children[1], M));
            break;
          case "op_assign":
            M ? (x = this.getLHSCompiler(d.children[0], M), _utils_type__WEBPACK_IMPORTED_MODULE_7__.Z.isArray(x) ? k = "$jc$.setProp(" + x[0] + ", " + x[1] + ", " + this.compile(d.children[1], M) + `);
` : (this.isLocalVariable(x) !== this.scope && (this.scope.locals[x] = !0), k = "$jc$.scopes[" + this.scope.id + "].locals['" + x + "'] = " + this.compile(d.children[1], M) + `;
`)) : k = (x = this.compile(d.children[0])) + " = " + this.compile(d.children[1], M) + `;
`;
            break;
          case "op_if":
            k = " if (" + this.compile(d.children[0], M) + ") " + this.compile(d.children[1], M);
            break;
          case "op_if_else":
            k = " if (" + this.compile(d.children[0], M) + ")" + this.compile(d.children[1], M), k += " else " + this.compile(d.children[2], M);
            break;
          case "op_conditional":
            k = "((" + this.compile(d.children[0], M) + ")?(" + this.compile(d.children[1], M), k += "):(" + this.compile(d.children[2], M) + "))";
            break;
          case "op_while":
            k = " while (" + this.compile(d.children[0], M) + `) {
` + this.compile(d.children[1], M) + `}
`;
            break;
          case "op_do":
            k = ` do {
` + this.compile(d.children[0], M) + "} while (" + this.compile(d.children[1], M) + `);
`;
            break;
          case "op_for":
            k = " for (" + this.compile(d.children[0], M) + this.compile(d.children[1], M) + "; " + this.compile(d.children[2], M).slice(0, -2) + `) {
` + this.compile(d.children[3], M) + `
}
`;
            break;
          case "op_proplst":
            d.children[0] && (k = this.compile(d.children[0], M) + ", "), k += this.compile(d.children[1], M);
            break;
          case "op_prop":
            k = d.children[0] + ": " + this.compile(d.children[1], M);
            break;
          case "op_emptyobject":
            k = M ? "{}" : "<< >>";
            break;
          case "op_proplst_val":
            k = this.compile(d.children[0], M);
            break;
          case "op_array":
            for (j = [], a = 0; a < d.children[0].length; a++)
              j.push(this.compile(d.children[0][a], M));
            k = "[" + j.join(", ") + "]";
            break;
          case "op_extvalue":
            k = this.compile(d.children[0], M) + "[" + this.compile(d.children[1], M) + "]";
            break;
          case "op_return":
            k = " return " + this.compile(d.children[0], M) + `;
`;
            break;
          case "op_map":
            d.children[1].isMath || d.children[1].type === "node_var" || this._error("compile: In a map only function calls and mathematical expressions are allowed."), j = d.children[0], k = M ? " $jc$.makeMap(function (" + j.join(", ") + ") { return " + this.compile(d.children[1], M) + "; })" : "map (" + j.join(", ") + ") -> " + this.compile(d.children[1], M);
            break;
          case "op_function":
            j = d.children[0], this.pushScope(j), k = M ? this.functionCodeJS(d) : " function (" + j.join(", ") + ") " + this.compile(d.children[1], M), this.popScope();
            break;
          case "op_execfunmath":
            console.log("op_execfunmath: TODO"), k = "-1";
            break;
          case "op_execfun":
            if (d.children[2]) {
              for (j = [], a = 0; a < d.children[2].length; a++)
                j.push(this.compile(d.children[2][a], M));
              x = M ? "$jc$.mergeAttributes(" + j.join(", ") + ")" : j.join(", ");
            }
            for (d.children[0].withProps = !!d.children[2], j = [], a = 0; a < d.children[1].length; a++)
              j.push(this.compile(d.children[1][a], M));
            k = this.compile(d.children[0], M) + "(" + j.join(", ") + (d.children[2] && M ? ", " + x : "") + ")" + (d.children[2] && !M ? " " + x : ""), M && (k += `
`), M && d.children[0].value === "$" && (k = "$jc$.board.objects[" + this.compile(d.children[1][0], M) + "]");
            break;
          case "op_property":
            k = M && d.children[1] !== "X" && d.children[1] !== "Y" ? "$jc$.resolveProperty(" + this.compile(d.children[0], M) + ", '" + d.children[1] + "', true)" : this.compile(d.children[0], M) + "." + d.children[1];
            break;
          case "op_use":
            this._warn("Use of the 'use' operator is deprecated."), k = M ? "$jc$.use('" : "use('", k += d.children[0].toString() + "');";
            break;
          case "op_delete":
            this._warn("Use of the 'delete' operator is deprecated. Please use the remove() function."), k = M ? "$jc$.del(" : "remove(", k += this.compile(d.children[0], M) + ")";
            break;
          case "op_eq":
            k = "(" + this.compile(d.children[0], M) + " === " + this.compile(d.children[1], M) + ")";
            break;
          case "op_neq":
            k = "(" + this.compile(d.children[0], M) + " !== " + this.compile(d.children[1], M) + ")";
            break;
          case "op_approx":
            k = "(" + this.compile(d.children[0], M) + " ~= " + this.compile(d.children[1], M) + ")";
            break;
          case "op_gt":
            k = M ? "$jc$.gt(" + this.compile(d.children[0], M) + ", " + this.compile(d.children[1], M) + ")" : "(" + this.compile(d.children[0], M) + " > " + this.compile(d.children[1], M) + ")";
            break;
          case "op_lt":
            k = M ? "$jc$.lt(" + this.compile(d.children[0], M) + ", " + this.compile(d.children[1], M) + ")" : "(" + this.compile(d.children[0], M) + " < " + this.compile(d.children[1], M) + ")";
            break;
          case "op_geq":
            k = M ? "$jc$.geq(" + this.compile(d.children[0], M) + ", " + this.compile(d.children[1], M) + ")" : "(" + this.compile(d.children[0], M) + " >= " + this.compile(d.children[1], M) + ")";
            break;
          case "op_leq":
            k = M ? "$jc$.leq(" + this.compile(d.children[0], M) + ", " + this.compile(d.children[1], M) + ")" : "(" + this.compile(d.children[0], M) + " <= " + this.compile(d.children[1], M) + ")";
            break;
          case "op_or":
            k = "(" + this.compile(d.children[0], M) + " || " + this.compile(d.children[1], M) + ")";
            break;
          case "op_and":
            k = "(" + this.compile(d.children[0], M) + " && " + this.compile(d.children[1], M) + ")";
            break;
          case "op_not":
            k = "!(" + this.compile(d.children[0], M) + ")";
            break;
          case "op_add":
            k = M ? "$jc$.add(" + this.compile(d.children[0], M) + ", " + this.compile(d.children[1], M) + ")" : "(" + this.compile(d.children[0], M) + " + " + this.compile(d.children[1], M) + ")";
            break;
          case "op_sub":
            k = M ? "$jc$.sub(" + this.compile(d.children[0], M) + ", " + this.compile(d.children[1], M) + ")" : "(" + this.compile(d.children[0], M) + " - " + this.compile(d.children[1], M) + ")";
            break;
          case "op_div":
            k = M ? "$jc$.div(" + this.compile(d.children[0], M) + ", " + this.compile(d.children[1], M) + ")" : "(" + this.compile(d.children[0], M) + " / " + this.compile(d.children[1], M) + ")";
            break;
          case "op_mod":
            k = M ? "$jc$.mod(" + this.compile(d.children[0], M) + ", " + this.compile(d.children[1], M) + ", true)" : "(" + this.compile(d.children[0], M) + " % " + this.compile(d.children[1], M) + ")";
            break;
          case "op_mul":
            k = M ? "$jc$.mul(" + this.compile(d.children[0], M) + ", " + this.compile(d.children[1], M) + ")" : "(" + this.compile(d.children[0], M) + " * " + this.compile(d.children[1], M) + ")";
            break;
          case "op_exp":
            k = M ? "$jc$.pow(" + this.compile(d.children[0], M) + ", " + this.compile(d.children[1], M) + ")" : "(" + this.compile(d.children[0], M) + "^" + this.compile(d.children[1], M) + ")";
            break;
          case "op_neg":
            k = M ? "$jc$.neg(" + this.compile(d.children[0], M) + ")" : "(-" + this.compile(d.children[0], M) + ")";
        }
        break;
      case "node_var":
        k = M ? this.getvarJS(d.value, !1, d.withProps) : d.value;
        break;
      case "node_const":
      case "node_const_bool":
        k = d.value;
        break;
      case "node_str":
        k = "'" + d.value + "'";
    }
    return d.needsBrackets && (k = M ? `{
` + k + `
}
` : "<< " + k + " >>"), k;
  }, getName: function(d, M) {
    var x = "";
    return _utils_type__WEBPACK_IMPORTED_MODULE_7__.Z.exists(d) && _utils_type__WEBPACK_IMPORTED_MODULE_7__.Z.exists(d.getName) ? (x = d.getName(), _utils_type__WEBPACK_IMPORTED_MODULE_7__.Z.exists(x) && x !== "" || !M || (x = d.id)) : M && (x = d.id), x;
  }, X: function(d) {
    return d.X();
  }, Y: function(d) {
    return d.Y();
  }, V: function(d) {
    return d.Value();
  }, L: function(d) {
    return d.L();
  }, area: function(d) {
    return _utils_type__WEBPACK_IMPORTED_MODULE_7__.Z.exists(d) && _utils_type__WEBPACK_IMPORTED_MODULE_7__.Z.exists(d.Area) || this._error("Error: Can't calculate area."), d.Area();
  }, dist: function(d, M) {
    return _utils_type__WEBPACK_IMPORTED_MODULE_7__.Z.exists(d) && _utils_type__WEBPACK_IMPORTED_MODULE_7__.Z.exists(d.Dist) || this._error("Error: Can't calculate distance."), d.Dist(M);
  }, radius: function(d) {
    return _utils_type__WEBPACK_IMPORTED_MODULE_7__.Z.exists(d) && _utils_type__WEBPACK_IMPORTED_MODULE_7__.Z.exists(d.Radius) || this._error("Error: Can't calculate radius."), d.Radius();
  }, add: function(d, M) {
    var x, a, j;
    if (d = _utils_type__WEBPACK_IMPORTED_MODULE_7__.Z.evalSlider(d), M = _utils_type__WEBPACK_IMPORTED_MODULE_7__.Z.evalSlider(M), _math_ia__WEBPACK_IMPORTED_MODULE_4__.Z.isInterval(d) || _math_ia__WEBPACK_IMPORTED_MODULE_4__.Z.isInterval(M))
      j = _math_ia__WEBPACK_IMPORTED_MODULE_4__.Z.add(d, M);
    else if (_utils_type__WEBPACK_IMPORTED_MODULE_7__.Z.isArray(d) && _utils_type__WEBPACK_IMPORTED_MODULE_7__.Z.isArray(M))
      for (a = Math.min(d.length, M.length), j = [], x = 0; x < a; x++)
        j[x] = d[x] + M[x];
    else
      _utils_type__WEBPACK_IMPORTED_MODULE_7__.Z.isNumber(d) && _utils_type__WEBPACK_IMPORTED_MODULE_7__.Z.isNumber(M) ? j = d + M : _utils_type__WEBPACK_IMPORTED_MODULE_7__.Z.isString(d) || _utils_type__WEBPACK_IMPORTED_MODULE_7__.Z.isString(M) ? j = d.toString() + M.toString() : this._error("Operation + not defined on operands " + typeof d + " and " + typeof M);
    return j;
  }, sub: function(d, M) {
    var x, a, j;
    if (d = _utils_type__WEBPACK_IMPORTED_MODULE_7__.Z.evalSlider(d), M = _utils_type__WEBPACK_IMPORTED_MODULE_7__.Z.evalSlider(M), _math_ia__WEBPACK_IMPORTED_MODULE_4__.Z.isInterval(d) || _math_ia__WEBPACK_IMPORTED_MODULE_4__.Z.isInterval(M))
      j = _math_ia__WEBPACK_IMPORTED_MODULE_4__.Z.sub(d, M);
    else if (_utils_type__WEBPACK_IMPORTED_MODULE_7__.Z.isArray(d) && _utils_type__WEBPACK_IMPORTED_MODULE_7__.Z.isArray(M))
      for (a = Math.min(d.length, M.length), j = [], x = 0; x < a; x++)
        j[x] = d[x] - M[x];
    else
      _utils_type__WEBPACK_IMPORTED_MODULE_7__.Z.isNumber(d) && _utils_type__WEBPACK_IMPORTED_MODULE_7__.Z.isNumber(M) ? j = d - M : this._error("Operation - not defined on operands " + typeof d + " and " + typeof M);
    return j;
  }, neg: function(d) {
    var M, x, a;
    if (d = _utils_type__WEBPACK_IMPORTED_MODULE_7__.Z.evalSlider(d), _math_ia__WEBPACK_IMPORTED_MODULE_4__.Z.isInterval(d))
      a = _math_ia__WEBPACK_IMPORTED_MODULE_4__.Z.negative(d);
    else if (_utils_type__WEBPACK_IMPORTED_MODULE_7__.Z.isArray(d))
      for (x = d.length, a = [], M = 0; M < x; M++)
        a[M] = -d[M];
    else
      _utils_type__WEBPACK_IMPORTED_MODULE_7__.Z.isNumber(d) ? a = -d : this._error("Unary operation - not defined on operand " + typeof d);
    return a;
  }, mul: function(d, M) {
    var x, a, j;
    if (d = _utils_type__WEBPACK_IMPORTED_MODULE_7__.Z.evalSlider(d), M = _utils_type__WEBPACK_IMPORTED_MODULE_7__.Z.evalSlider(M), _utils_type__WEBPACK_IMPORTED_MODULE_7__.Z.isArray(d) && _utils_type__WEBPACK_IMPORTED_MODULE_7__.Z.isNumber(M) && (x = d, M = d = M), _math_ia__WEBPACK_IMPORTED_MODULE_4__.Z.isInterval(d) || _math_ia__WEBPACK_IMPORTED_MODULE_4__.Z.isInterval(M))
      j = _math_ia__WEBPACK_IMPORTED_MODULE_4__.Z.mul(d, M);
    else if (_utils_type__WEBPACK_IMPORTED_MODULE_7__.Z.isArray(d) && _utils_type__WEBPACK_IMPORTED_MODULE_7__.Z.isArray(M))
      a = Math.min(d.length, M.length), j = _math_math__WEBPACK_IMPORTED_MODULE_3__.Z.innerProduct(d, M, a);
    else if (_utils_type__WEBPACK_IMPORTED_MODULE_7__.Z.isNumber(d) && _utils_type__WEBPACK_IMPORTED_MODULE_7__.Z.isArray(M))
      for (a = M.length, j = [], x = 0; x < a; x++)
        j[x] = d * M[x];
    else
      _utils_type__WEBPACK_IMPORTED_MODULE_7__.Z.isNumber(d) && _utils_type__WEBPACK_IMPORTED_MODULE_7__.Z.isNumber(M) ? j = d * M : this._error("Operation * not defined on operands " + typeof d + " and " + typeof M);
    return j;
  }, div: function(d, M) {
    var x, a, j;
    if (d = _utils_type__WEBPACK_IMPORTED_MODULE_7__.Z.evalSlider(d), M = _utils_type__WEBPACK_IMPORTED_MODULE_7__.Z.evalSlider(M), _math_ia__WEBPACK_IMPORTED_MODULE_4__.Z.isInterval(d) || _math_ia__WEBPACK_IMPORTED_MODULE_4__.Z.isInterval(M))
      j = _math_ia__WEBPACK_IMPORTED_MODULE_4__.Z.div(d, M);
    else if (_utils_type__WEBPACK_IMPORTED_MODULE_7__.Z.isArray(d) && _utils_type__WEBPACK_IMPORTED_MODULE_7__.Z.isNumber(M))
      for (a = d.length, j = [], x = 0; x < a; x++)
        j[x] = d[x] / M;
    else
      _utils_type__WEBPACK_IMPORTED_MODULE_7__.Z.isNumber(d) && _utils_type__WEBPACK_IMPORTED_MODULE_7__.Z.isNumber(M) ? j = d / M : this._error("Operation * not defined on operands " + typeof d + " and " + typeof M);
    return j;
  }, mod: function(d, M) {
    var x, a, j;
    if (d = _utils_type__WEBPACK_IMPORTED_MODULE_7__.Z.evalSlider(d), M = _utils_type__WEBPACK_IMPORTED_MODULE_7__.Z.evalSlider(M), _math_ia__WEBPACK_IMPORTED_MODULE_4__.Z.isInterval(d) || _math_ia__WEBPACK_IMPORTED_MODULE_4__.Z.isInterval(M))
      return _math_ia__WEBPACK_IMPORTED_MODULE_4__.Z.fmod(d, M);
    if (_utils_type__WEBPACK_IMPORTED_MODULE_7__.Z.isArray(d) && _utils_type__WEBPACK_IMPORTED_MODULE_7__.Z.isNumber(M))
      for (a = d.length, j = [], x = 0; x < a; x++)
        j[x] = _math_math__WEBPACK_IMPORTED_MODULE_3__.Z.mod(d[x], M, !0);
    else
      _utils_type__WEBPACK_IMPORTED_MODULE_7__.Z.isNumber(d) && _utils_type__WEBPACK_IMPORTED_MODULE_7__.Z.isNumber(M) ? j = _math_math__WEBPACK_IMPORTED_MODULE_3__.Z.mod(d, M, !0) : this._error("Operation * not defined on operands " + typeof d + " and " + typeof M);
    return j;
  }, pow: function(d, M) {
    return d = _utils_type__WEBPACK_IMPORTED_MODULE_7__.Z.evalSlider(d), M = _utils_type__WEBPACK_IMPORTED_MODULE_7__.Z.evalSlider(M), _math_ia__WEBPACK_IMPORTED_MODULE_4__.Z.isInterval(d) || _math_ia__WEBPACK_IMPORTED_MODULE_4__.Z.isInterval(M) ? _math_ia__WEBPACK_IMPORTED_MODULE_4__.Z.pow(d, M) : _math_math__WEBPACK_IMPORTED_MODULE_3__.Z.pow(d, M);
  }, lt: function(d, M) {
    return _math_ia__WEBPACK_IMPORTED_MODULE_4__.Z.isInterval(d) || _math_ia__WEBPACK_IMPORTED_MODULE_4__.Z.isInterval(M) ? _math_ia__WEBPACK_IMPORTED_MODULE_4__.Z.lt(d, M) : d < M;
  }, leq: function(d, M) {
    return _math_ia__WEBPACK_IMPORTED_MODULE_4__.Z.isInterval(d) || _math_ia__WEBPACK_IMPORTED_MODULE_4__.Z.isInterval(M) ? _math_ia__WEBPACK_IMPORTED_MODULE_4__.Z.leq(d, M) : d <= M;
  }, gt: function(d, M) {
    return _math_ia__WEBPACK_IMPORTED_MODULE_4__.Z.isInterval(d) || _math_ia__WEBPACK_IMPORTED_MODULE_4__.Z.isInterval(M) ? _math_ia__WEBPACK_IMPORTED_MODULE_4__.Z.gt(d, M) : d > M;
  }, geq: function(d, M) {
    return _math_ia__WEBPACK_IMPORTED_MODULE_4__.Z.isInterval(d) || _math_ia__WEBPACK_IMPORTED_MODULE_4__.Z.isInterval(M) ? Intervalt.geq(d, M) : d >= M;
  }, randint: function(d, M, x) {
    return _utils_type__WEBPACK_IMPORTED_MODULE_7__.Z.exists(x) || (x = 1), Math.round(Math.random() * (M - d) / x) * x + d;
  }, DDD: function(d) {
    console.log("Dummy derivative function. This should never appear!");
  }, ifthen: function(d, M, x) {
    return d ? M : x;
  }, del: function(d) {
    typeof d == "object" && _jxg__WEBPACK_IMPORTED_MODULE_0__.Z.exists(d.type) && _jxg__WEBPACK_IMPORTED_MODULE_0__.Z.exists(d.elementClass) && this.board.removeObject(d);
  }, use: function(d) {
    var M, x, a = !1;
    if (typeof d == "string") {
      for (M in _jxg__WEBPACK_IMPORTED_MODULE_0__.Z.boards)
        if (_jxg__WEBPACK_IMPORTED_MODULE_0__.Z.boards.hasOwnProperty(M) && _jxg__WEBPACK_IMPORTED_MODULE_0__.Z.boards[M].container === d) {
          x = _jxg__WEBPACK_IMPORTED_MODULE_0__.Z.boards[M], a = !0;
          break;
        }
    } else
      x = d, a = !0;
    a ? (this.board = x, this.builtIn.$board = x, this.builtIn.$board.src = "$jc$.board") : this._error("Board '" + d + "' not found!");
  }, findSymbol: function(d, M) {
    var x, a;
    for (a = (M = _utils_type__WEBPACK_IMPORTED_MODULE_7__.Z.def(M, -1)) === -1 ? this.scope : this.scopes[M]; a !== null; ) {
      for (x in a.locals)
        if (a.locals.hasOwnProperty(x) && a.locals[x] === d)
          return [x, a];
      a = a.previous;
    }
    return [];
  }, importModule: function(d) {
    return priv.modules[d.toLowerCase()];
  }, defineBuiltIn: function() {
    var d = this, M = { PI: Math.PI, EULER: Math.E, D: d.DDD, X: d.X, Y: d.Y, V: d.V, L: d.L, acosh: _math_math__WEBPACK_IMPORTED_MODULE_3__.Z.acosh, acot: _math_math__WEBPACK_IMPORTED_MODULE_3__.Z.acot, asinh: _math_math__WEBPACK_IMPORTED_MODULE_3__.Z.asinh, binomial: _math_math__WEBPACK_IMPORTED_MODULE_3__.Z.binomial, cbrt: _math_math__WEBPACK_IMPORTED_MODULE_3__.Z.cbrt, cosh: _math_math__WEBPACK_IMPORTED_MODULE_3__.Z.cosh, cot: _math_math__WEBPACK_IMPORTED_MODULE_3__.Z.cot, deg: _math_geometry__WEBPACK_IMPORTED_MODULE_5__.Z.trueAngle, A: d.area, area: d.area, dist: d.dist, R: d.radius, radius: d.radius, erf: _math_math__WEBPACK_IMPORTED_MODULE_3__.Z.erf, erfc: _math_math__WEBPACK_IMPORTED_MODULE_3__.Z.erfc, erfi: _math_math__WEBPACK_IMPORTED_MODULE_3__.Z.erfi, factorial: _math_math__WEBPACK_IMPORTED_MODULE_3__.Z.factorial, gcd: _math_math__WEBPACK_IMPORTED_MODULE_3__.Z.gcd, lb: _math_math__WEBPACK_IMPORTED_MODULE_3__.Z.log2, lcm: _math_math__WEBPACK_IMPORTED_MODULE_3__.Z.lcm, ld: _math_math__WEBPACK_IMPORTED_MODULE_3__.Z.log2, lg: _math_math__WEBPACK_IMPORTED_MODULE_3__.Z.log10, ln: Math.log, log: _math_math__WEBPACK_IMPORTED_MODULE_3__.Z.log, log10: _math_math__WEBPACK_IMPORTED_MODULE_3__.Z.log10, log2: _math_math__WEBPACK_IMPORTED_MODULE_3__.Z.log2, ndtr: _math_math__WEBPACK_IMPORTED_MODULE_3__.Z.ndtr, ndtri: _math_math__WEBPACK_IMPORTED_MODULE_3__.Z.ndtri, nthroot: _math_math__WEBPACK_IMPORTED_MODULE_3__.Z.nthroot, pow: _math_math__WEBPACK_IMPORTED_MODULE_3__.Z.pow, rad: _math_geometry__WEBPACK_IMPORTED_MODULE_5__.Z.rad, ratpow: _math_math__WEBPACK_IMPORTED_MODULE_3__.Z.ratpow, trunc: _utils_type__WEBPACK_IMPORTED_MODULE_7__.Z.trunc, sinh: _math_math__WEBPACK_IMPORTED_MODULE_3__.Z.sinh, randint: d.randint, IfThen: d.ifthen, import: d.importModule, use: d.use, remove: d.del, $: d.getElementById, getName: d.getName, name: d.getName, $board: d.board, $log: d.log };
    return M.rad.sc = _math_geometry__WEBPACK_IMPORTED_MODULE_5__.Z, M.deg.sc = _math_geometry__WEBPACK_IMPORTED_MODULE_5__.Z, M.factorial.sc = _math_math__WEBPACK_IMPORTED_MODULE_3__.Z, M.X.src = "$jc$.X", M.Y.src = "$jc$.Y", M.V.src = "$jc$.V", M.L.src = "$jc$.L", M.acosh.src = "JXG.Math.acosh", M.acot.src = "JXG.Math.acot", M.asinh.src = "JXG.Math.asinh", M.binomial.src = "JXG.Math.binomial", M.cbrt.src = "JXG.Math.cbrt", M.cot.src = "JXG.Math.cot", M.cosh.src = "JXG.Math.cosh", M.deg.src = "JXG.Math.Geometry.trueAngle", M.erf.src = "JXG.Math.erf", M.erfc.src = "JXG.Math.erfc", M.erfi.src = "JXG.Math.erfi", M.A.src = "$jc$.area", M.area.src = "$jc$.area", M.dist.src = "$jc$.dist", M.R.src = "$jc$.radius", M.radius.src = "$jc$.radius", M.factorial.src = "JXG.Math.factorial", M.gcd.src = "JXG.Math.gcd", M.lb.src = "JXG.Math.log2", M.lcm.src = "JXG.Math.lcm", M.ld.src = "JXG.Math.log2", M.lg.src = "JXG.Math.log10", M.ln.src = "Math.log", M.log.src = "JXG.Math.log", M.log10.src = "JXG.Math.log10", M.log2.src = "JXG.Math.log2", M.ndtr.src = "JXG.Math.ndtr", M.ndtri.src = "JXG.Math.ndtri", M.nthroot.src = "JXG.Math.nthroot", M.pow.src = "JXG.Math.pow", M.rad.src = "JXG.Math.Geometry.rad", M.ratpow.src = "JXG.Math.ratpow", M.trunc.src = "JXG.trunc", M.sinh.src = "JXG.Math.sinh", M.randint.src = "$jc$.randint", M.import.src = "$jc$.importModule", M.use.src = "$jc$.use", M.remove.src = "$jc$.del", M.IfThen.src = "$jc$.ifthen", M.$.src = "(function (n) { return $jc$.board.select(n); })", M.getName.src = "$jc$.getName", M.name.src = "$jc$.getName", M.$board && (M.$board.src = "$jc$.board"), M.$log.src = "$jc$.log", M;
  }, getPossibleOperands: function() {
    var d, M, x, a, j, k, N, A, E, c, b, m, _, f, g = ["E"], C = this.defineBuiltIn(), P = Math;
    for (_ = function(w, T) {
      return w.toLowerCase().localeCompare(T.toLowerCase());
    }, f = function(w, T) {
      var D = null;
      if (T === "jc")
        D = C[w];
      else {
        if (T !== "Math")
          return;
        D = P[w];
      }
      if (!(g.indexOf(w) >= 0))
        return _jxg__WEBPACK_IMPORTED_MODULE_0__.Z.isFunction(D) ? { name: w, type: "function", numParams: D.length, origin: T } : _jxg__WEBPACK_IMPORTED_MODULE_0__.Z.isNumber(D) ? { name: w, type: "constant", value: D, origin: T } : void (D !== void 0 && console.error("undefined type", D));
    }, d = Object.getOwnPropertyNames(C).sort(_), M = Object.getOwnPropertyNames(P).sort(_), x = [], a = 0, j = 0; a < d.length || j < M.length; )
      d[a] === M[j] ? (k = f(M[j], "Math"), _jxg__WEBPACK_IMPORTED_MODULE_0__.Z.exists(k) && x.push(k), a++, j++) : !_jxg__WEBPACK_IMPORTED_MODULE_0__.Z.exists(M[j]) || d[a].toLowerCase().localeCompare(M[j].toLowerCase()) < 0 ? (k = f(d[a], "jc"), _jxg__WEBPACK_IMPORTED_MODULE_0__.Z.exists(k) && x.push(k), a++) : (k = f(M[j], "Math"), _jxg__WEBPACK_IMPORTED_MODULE_0__.Z.exists(k) && x.push(k), j++);
    for (E = [], c = [], b = [], m = {}, N = x.length, a = 0; a < N; a++) {
      switch ((A = x[a]).type) {
        case "function":
          E.push(A.name), A.origin === "jc" && c.push(A.name);
          break;
        case "constant":
          b.push(A.name);
      }
      m[A.name] = A;
    }
    return { all: m, list: x, functions: E, functions_jessiecode: c, constants: b };
  }, _debug: function(d) {
    typeof console == "object" ? console.log(d) : _utils_env__WEBPACK_IMPORTED_MODULE_8__.Z.isBrowser && document && document.getElementById("debug") !== null && (document.getElementById("debug").innerHTML += d + "<br />");
  }, _error: function(d) {
    var M = new Error("Error(" + this.line + "): " + d);
    throw M.line = this.line, M;
  }, _warn: function(d) {
    typeof console == "object" ? console.log("Warning(" + this.line + "): " + d) : _utils_env__WEBPACK_IMPORTED_MODULE_8__.Z.isBrowser && document && document.getElementById(this.warnLog) !== null && (document.getElementById(this.warnLog).innerHTML += "Warning(" + this.line + "): " + d + "<br />");
  }, _log: function(d) {
    typeof window != "object" && typeof self == "object" && self.postMessage ? self.postMessage({ type: "log", msg: "Log: " + d.toString() }) : console.log("Log: ", arguments);
  } });
  var parser = function() {
    var d = function(ze, Ze, Te, Xe) {
      for (Te = Te || {}, Xe = ze.length; Xe--; Te[ze[Xe]] = Ze)
        ;
      return Te;
    }, M = [2, 14], x = [1, 13], a = [1, 37], j = [1, 14], k = [1, 15], N = [1, 21], A = [1, 16], E = [1, 17], c = [1, 33], b = [1, 18], m = [1, 19], _ = [1, 12], f = [1, 59], g = [1, 60], C = [1, 58], P = [1, 46], w = [1, 48], T = [1, 49], D = [1, 50], I = [1, 51], Y = [1, 52], U = [1, 53], J = [1, 54], z = [1, 45], V = [1, 38], $ = [1, 39], ne = [5, 7, 8, 14, 15, 16, 17, 19, 20, 21, 23, 26, 27, 50, 51, 58, 65, 74, 75, 76, 77, 78, 79, 80, 82, 91, 93], Q = [5, 7, 8, 12, 14, 15, 16, 17, 19, 20, 21, 23, 26, 27, 50, 51, 58, 65, 74, 75, 76, 77, 78, 79, 80, 82, 91, 93], K = [8, 10, 16, 32, 34, 35, 37, 39, 41, 42, 43, 45, 46, 47, 48, 50, 51, 53, 54, 55, 57, 64, 65, 66, 83, 86], te = [2, 48], se = [1, 72], de = [10, 16, 32, 34, 35, 37, 39, 41, 42, 43, 45, 46, 47, 48, 50, 51, 53, 54, 55, 57, 66, 83, 86], ae = [1, 78], ce = [8, 10, 16, 32, 34, 35, 37, 41, 42, 43, 45, 46, 47, 48, 50, 51, 53, 54, 55, 57, 64, 65, 66, 83, 86], fe = [1, 82], Re = [8, 10, 16, 32, 34, 35, 37, 39, 45, 46, 47, 48, 50, 51, 53, 54, 55, 57, 64, 65, 66, 83, 86], ke = [1, 83], je = [1, 84], qe = [1, 85], it = [8, 10, 16, 32, 34, 35, 37, 39, 41, 42, 43, 50, 51, 53, 54, 55, 57, 64, 65, 66, 83, 86], nt = [1, 89], ht = [1, 90], at = [1, 91], Je = [1, 92], rt = [1, 97], ft = [8, 10, 16, 32, 34, 35, 37, 39, 41, 42, 43, 45, 46, 47, 48, 53, 54, 55, 57, 64, 65, 66, 83, 86], ut = [1, 103], _t = [1, 104], Zt = [8, 10, 16, 32, 34, 35, 37, 39, 41, 42, 43, 45, 46, 47, 48, 50, 51, 57, 64, 65, 66, 83, 86], Ct = [1, 105], yt = [1, 106], Pt = [1, 107], Nt = [1, 126], At = [1, 139], Et = [83, 86], Rt = [1, 150], Dt = [10, 66, 86], Lt = [8, 10, 16, 20, 32, 34, 35, 37, 39, 41, 42, 43, 45, 46, 47, 48, 50, 51, 53, 54, 55, 57, 64, 65, 66, 82, 83, 86], kt = [1, 167], Bt = [10, 86], Ot = { trace: function() {
    }, yy: {}, symbols_: { error: 2, Program: 3, StatementList: 4, EOF: 5, IfStatement: 6, IF: 7, "(": 8, Expression: 9, ")": 10, Statement: 11, ELSE: 12, LoopStatement: 13, WHILE: 14, FOR: 15, ";": 16, DO: 17, UnaryStatement: 18, USE: 19, IDENTIFIER: 20, DELETE: 21, ReturnStatement: 22, RETURN: 23, EmptyStatement: 24, StatementBlock: 25, "{": 26, "}": 27, ExpressionStatement: 28, AssignmentExpression: 29, ConditionalExpression: 30, LeftHandSideExpression: 31, "=": 32, LogicalORExpression: 33, "?": 34, ":": 35, LogicalANDExpression: 36, "||": 37, EqualityExpression: 38, "&&": 39, RelationalExpression: 40, "==": 41, "!=": 42, "~=": 43, AdditiveExpression: 44, "<": 45, ">": 46, "<=": 47, ">=": 48, MultiplicativeExpression: 49, "+": 50, "-": 51, UnaryExpression: 52, "*": 53, "/": 54, "%": 55, ExponentExpression: 56, "^": 57, "!": 58, MemberExpression: 59, CallExpression: 60, PrimaryExpression: 61, FunctionExpression: 62, MapExpression: 63, ".": 64, "[": 65, "]": 66, BasicLiteral: 67, ObjectLiteral: 68, ArrayLiteral: 69, NullLiteral: 70, BooleanLiteral: 71, StringLiteral: 72, NumberLiteral: 73, NULL: 74, TRUE: 75, FALSE: 76, STRING: 77, NUMBER: 78, NAN: 79, INFINITY: 80, ElementList: 81, "<<": 82, ">>": 83, PropertyList: 84, Property: 85, ",": 86, PropertyName: 87, Arguments: 88, AttributeList: 89, Attribute: 90, FUNCTION: 91, ParameterDefinitionList: 92, MAP: 93, "->": 94, $accept: 0, $end: 1 }, terminals_: { 2: "error", 5: "EOF", 7: "IF", 8: "(", 10: ")", 12: "ELSE", 14: "WHILE", 15: "FOR", 16: ";", 17: "DO", 19: "USE", 20: "IDENTIFIER", 21: "DELETE", 23: "RETURN", 26: "{", 27: "}", 32: "=", 34: "?", 35: ":", 37: "||", 39: "&&", 41: "==", 42: "!=", 43: "~=", 45: "<", 46: ">", 47: "<=", 48: ">=", 50: "+", 51: "-", 53: "*", 54: "/", 55: "%", 57: "^", 58: "!", 64: ".", 65: "[", 66: "]", 74: "NULL", 75: "TRUE", 76: "FALSE", 77: "STRING", 78: "NUMBER", 79: "NAN", 80: "INFINITY", 82: "<<", 83: ">>", 86: ",", 91: "FUNCTION", 93: "MAP", 94: "->" }, productions_: [0, [3, 2], [6, 5], [6, 7], [13, 5], [13, 9], [13, 7], [18, 2], [18, 2], [22, 2], [22, 3], [24, 1], [25, 3], [4, 2], [4, 0], [11, 1], [11, 1], [11, 1], [11, 1], [11, 1], [11, 1], [11, 1], [28, 2], [9, 1], [29, 1], [29, 3], [30, 1], [30, 5], [33, 1], [33, 3], [36, 1], [36, 3], [38, 1], [38, 3], [38, 3], [38, 3], [40, 1], [40, 3], [40, 3], [40, 3], [40, 3], [44, 1], [44, 3], [44, 3], [49, 1], [49, 3], [49, 3], [49, 3], [56, 1], [56, 3], [52, 1], [52, 2], [52, 2], [52, 2], [31, 1], [31, 1], [59, 1], [59, 1], [59, 1], [59, 3], [59, 4], [61, 1], [61, 1], [61, 1], [61, 1], [61, 3], [67, 1], [67, 1], [67, 1], [67, 1], [70, 1], [71, 1], [71, 1], [72, 1], [73, 1], [73, 1], [73, 1], [69, 2], [69, 3], [68, 2], [68, 3], [84, 1], [84, 3], [85, 3], [87, 1], [87, 1], [87, 1], [60, 2], [60, 3], [60, 2], [60, 4], [60, 3], [88, 2], [88, 3], [89, 1], [89, 3], [90, 1], [90, 1], [81, 1], [81, 3], [62, 4], [62, 5], [63, 5], [63, 6], [92, 1], [92, 3]], performAction: function(ze, Ze, Te, Xe, Me, le, ve) {
      var ie = le.length - 1;
      switch (Me) {
        case 1:
          return le[ie - 1];
        case 2:
          this.$ = Oe.createNode(xe(ve[ie - 4]), "node_op", "op_if", le[ie - 2], le[ie]);
          break;
        case 3:
          this.$ = Oe.createNode(xe(ve[ie - 6]), "node_op", "op_if_else", le[ie - 4], le[ie - 2], le[ie]);
          break;
        case 4:
          this.$ = Oe.createNode(xe(ve[ie - 4]), "node_op", "op_while", le[ie - 2], le[ie]);
          break;
        case 5:
          this.$ = Oe.createNode(xe(ve[ie - 8]), "node_op", "op_for", le[ie - 6], le[ie - 4], le[ie - 2], le[ie]);
          break;
        case 6:
          this.$ = Oe.createNode(xe(ve[ie - 6]), "node_op", "op_do", le[ie - 5], le[ie - 2]);
          break;
        case 7:
          this.$ = Oe.createNode(xe(ve[ie - 1]), "node_op", "op_use", le[ie]);
          break;
        case 8:
          this.$ = Oe.createNode(xe(ve[ie - 1]), "node_op", "op_delete", le[ie]);
          break;
        case 9:
          this.$ = Oe.createNode(xe(ve[ie - 1]), "node_op", "op_return", void 0);
          break;
        case 10:
          this.$ = Oe.createNode(xe(ve[ie - 2]), "node_op", "op_return", le[ie - 1]);
          break;
        case 11:
        case 14:
          this.$ = Oe.createNode(xe(ve[ie]), "node_op", "op_none");
          break;
        case 12:
          this.$ = le[ie - 1], this.$.needsBrackets = !0;
          break;
        case 13:
          this.$ = Oe.createNode(xe(ve[ie - 1]), "node_op", "op_none", le[ie - 1], le[ie]);
          break;
        case 15:
        case 16:
        case 17:
        case 18:
        case 19:
        case 20:
        case 21:
        case 23:
        case 24:
        case 26:
        case 28:
        case 30:
        case 32:
        case 36:
        case 41:
        case 44:
        case 48:
        case 50:
        case 52:
        case 54:
        case 55:
        case 56:
        case 58:
        case 62:
        case 81:
        case 84:
        case 85:
        case 86:
          this.$ = le[ie];
          break;
        case 22:
        case 65:
        case 93:
          this.$ = le[ie - 1];
          break;
        case 25:
          this.$ = Oe.createNode(xe(ve[ie - 2]), "node_op", "op_assign", le[ie - 2], le[ie]), this.$.isMath = !1;
          break;
        case 27:
          this.$ = Oe.createNode(xe(ve[ie - 4]), "node_op", "op_conditional", le[ie - 4], le[ie - 2], le[ie]), this.$.isMath = !1;
          break;
        case 29:
          this.$ = Oe.createNode(xe(ve[ie - 2]), "node_op", "op_or", le[ie - 2], le[ie]), this.$.isMath = !1;
          break;
        case 31:
          this.$ = Oe.createNode(xe(ve[ie - 2]), "node_op", "op_and", le[ie - 2], le[ie]), this.$.isMath = !1;
          break;
        case 33:
          this.$ = Oe.createNode(xe(ve[ie - 2]), "node_op", "op_eq", le[ie - 2], le[ie]), this.$.isMath = !1;
          break;
        case 34:
          this.$ = Oe.createNode(xe(ve[ie - 2]), "node_op", "op_neq", le[ie - 2], le[ie]), this.$.isMath = !1;
          break;
        case 35:
          this.$ = Oe.createNode(xe(ve[ie - 2]), "node_op", "op_approx", le[ie - 2], le[ie]), this.$.isMath = !1;
          break;
        case 37:
          this.$ = Oe.createNode(xe(ve[ie - 2]), "node_op", "op_lt", le[ie - 2], le[ie]), this.$.isMath = !1;
          break;
        case 38:
          this.$ = Oe.createNode(xe(ve[ie - 2]), "node_op", "op_gt", le[ie - 2], le[ie]), this.$.isMath = !1;
          break;
        case 39:
          this.$ = Oe.createNode(xe(ve[ie - 2]), "node_op", "op_leq", le[ie - 2], le[ie]), this.$.isMath = !1;
          break;
        case 40:
          this.$ = Oe.createNode(xe(ve[ie - 2]), "node_op", "op_geq", le[ie - 2], le[ie]), this.$.isMath = !1;
          break;
        case 42:
          this.$ = Oe.createNode(xe(ve[ie - 2]), "node_op", "op_add", le[ie - 2], le[ie]), this.$.isMath = !0;
          break;
        case 43:
          this.$ = Oe.createNode(xe(ve[ie - 2]), "node_op", "op_sub", le[ie - 2], le[ie]), this.$.isMath = !0;
          break;
        case 45:
          this.$ = Oe.createNode(xe(ve[ie - 2]), "node_op", "op_mul", le[ie - 2], le[ie]), this.$.isMath = !0;
          break;
        case 46:
          this.$ = Oe.createNode(xe(ve[ie - 2]), "node_op", "op_div", le[ie - 2], le[ie]), this.$.isMath = !0;
          break;
        case 47:
          this.$ = Oe.createNode(xe(ve[ie - 2]), "node_op", "op_mod", le[ie - 2], le[ie]), this.$.isMath = !0;
          break;
        case 49:
          this.$ = Oe.createNode(xe(ve[ie - 2]), "node_op", "op_exp", le[ie - 2], le[ie]), this.$.isMath = !0;
          break;
        case 51:
          this.$ = Oe.createNode(xe(ve[ie - 1]), "node_op", "op_not", le[ie]), this.$.isMath = !1;
          break;
        case 53:
          this.$ = Oe.createNode(xe(ve[ie - 1]), "node_op", "op_neg", le[ie]), this.$.isMath = !0;
          break;
        case 57:
        case 63:
        case 64:
        case 66:
        case 67:
        case 68:
        case 97:
          this.$ = le[ie], this.$.isMath = !1;
          break;
        case 59:
        case 91:
          this.$ = Oe.createNode(xe(ve[ie - 2]), "node_op", "op_property", le[ie - 2], le[ie]), this.$.isMath = !0;
          break;
        case 60:
        case 90:
          this.$ = Oe.createNode(xe(ve[ie - 3]), "node_op", "op_extvalue", le[ie - 3], le[ie - 1]), this.$.isMath = !0;
          break;
        case 61:
          this.$ = Oe.createNode(xe(ve[ie]), "node_var", le[ie]);
          break;
        case 69:
          this.$ = le[ie], this.$.isMath = !0;
          break;
        case 70:
          this.$ = Oe.createNode(xe(ve[ie]), "node_const", null);
          break;
        case 71:
          this.$ = Oe.createNode(xe(ve[ie]), "node_const_bool", !0);
          break;
        case 72:
          this.$ = Oe.createNode(xe(ve[ie]), "node_const_bool", !1);
          break;
        case 73:
          this.$ = Oe.createNode(xe(ve[ie]), "node_str", le[ie].substring(1, le[ie].length - 1));
          break;
        case 74:
          this.$ = Oe.createNode(xe(ve[ie]), "node_const", parseFloat(le[ie]));
          break;
        case 75:
          this.$ = Oe.createNode(xe(ve[ie]), "node_const", NaN);
          break;
        case 76:
          this.$ = Oe.createNode(xe(ve[ie]), "node_const", 1 / 0);
          break;
        case 77:
          this.$ = Oe.createNode(xe(ve[ie - 1]), "node_op", "op_array", []);
          break;
        case 78:
          this.$ = Oe.createNode(xe(ve[ie - 2]), "node_op", "op_array", le[ie - 1]);
          break;
        case 79:
          this.$ = Oe.createNode(xe(ve[ie - 1]), "node_op", "op_emptyobject", {}), this.$.needsBrackets = !0;
          break;
        case 80:
          this.$ = Oe.createNode(xe(ve[ie - 2]), "node_op", "op_proplst_val", le[ie - 1]), this.$.needsBrackets = !0;
          break;
        case 82:
          this.$ = Oe.createNode(xe(ve[ie - 2]), "node_op", "op_proplst", le[ie - 2], le[ie]);
          break;
        case 83:
          this.$ = Oe.createNode(xe(ve[ie - 2]), "node_op", "op_prop", le[ie - 2], le[ie]);
          break;
        case 87:
        case 89:
          this.$ = Oe.createNode(xe(ve[ie - 1]), "node_op", "op_execfun", le[ie - 1], le[ie]), this.$.isMath = !0;
          break;
        case 88:
          this.$ = Oe.createNode(xe(ve[ie - 2]), "node_op", "op_execfun", le[ie - 2], le[ie - 1], le[ie], !0), this.$.isMath = !1;
          break;
        case 92:
          this.$ = [];
          break;
        case 94:
        case 98:
        case 104:
          this.$ = [le[ie]];
          break;
        case 95:
        case 99:
        case 105:
          this.$ = le[ie - 2].concat(le[ie]);
          break;
        case 96:
          this.$ = Oe.createNode(xe(ve[ie]), "node_var", le[ie]), this.$.isMath = !0;
          break;
        case 100:
          this.$ = Oe.createNode(xe(ve[ie - 3]), "node_op", "op_function", [], le[ie]), this.$.isMath = !1;
          break;
        case 101:
          this.$ = Oe.createNode(xe(ve[ie - 4]), "node_op", "op_function", le[ie - 2], le[ie]), this.$.isMath = !1;
          break;
        case 102:
          this.$ = Oe.createNode(xe(ve[ie - 4]), "node_op", "op_map", [], le[ie]);
          break;
        case 103:
          this.$ = Oe.createNode(xe(ve[ie - 5]), "node_op", "op_map", le[ie - 3], le[ie]);
      }
    }, table: [d([5, 7, 8, 14, 15, 16, 17, 19, 20, 21, 23, 26, 50, 51, 58, 65, 74, 75, 76, 77, 78, 79, 80, 82, 91, 93], M, { 3: 1, 4: 2 }), { 1: [3] }, { 5: [1, 3], 6: 6, 7: x, 8: a, 9: 20, 11: 4, 13: 7, 14: j, 15: k, 16: N, 17: A, 18: 8, 19: E, 20: c, 21: b, 22: 9, 23: m, 24: 11, 25: 5, 26: _, 28: 10, 29: 22, 30: 23, 31: 24, 33: 25, 36: 28, 38: 32, 40: 40, 44: 47, 49: 55, 50: f, 51: g, 52: 56, 56: 57, 58: C, 59: 26, 60: 27, 61: 29, 62: 30, 63: 31, 65: P, 67: 34, 68: 35, 69: 36, 70: 41, 71: 42, 72: 43, 73: 44, 74: w, 75: T, 76: D, 77: I, 78: Y, 79: U, 80: J, 82: z, 91: V, 93: $ }, { 1: [2, 1] }, d(ne, [2, 13]), d(Q, [2, 15]), d(Q, [2, 16]), d(Q, [2, 17]), d(Q, [2, 18]), d(Q, [2, 19]), d(Q, [2, 20]), d(Q, [2, 21]), d([7, 8, 14, 15, 16, 17, 19, 20, 21, 23, 26, 27, 50, 51, 58, 65, 74, 75, 76, 77, 78, 79, 80, 82, 91, 93], M, { 4: 61 }), { 8: [1, 62] }, { 8: [1, 63] }, { 8: [1, 64] }, { 6: 6, 7: x, 8: a, 9: 20, 11: 65, 13: 7, 14: j, 15: k, 16: N, 17: A, 18: 8, 19: E, 20: c, 21: b, 22: 9, 23: m, 24: 11, 25: 5, 26: _, 28: 10, 29: 22, 30: 23, 31: 24, 33: 25, 36: 28, 38: 32, 40: 40, 44: 47, 49: 55, 50: f, 51: g, 52: 56, 56: 57, 58: C, 59: 26, 60: 27, 61: 29, 62: 30, 63: 31, 65: P, 67: 34, 68: 35, 69: 36, 70: 41, 71: 42, 72: 43, 73: 44, 74: w, 75: T, 76: D, 77: I, 78: Y, 79: U, 80: J, 82: z, 91: V, 93: $ }, { 20: [1, 66] }, { 20: [1, 67] }, { 8: a, 9: 69, 16: [1, 68], 20: c, 29: 22, 30: 23, 31: 24, 33: 25, 36: 28, 38: 32, 40: 40, 44: 47, 49: 55, 50: f, 51: g, 52: 56, 56: 57, 58: C, 59: 26, 60: 27, 61: 29, 62: 30, 63: 31, 65: P, 67: 34, 68: 35, 69: 36, 70: 41, 71: 42, 72: 43, 73: 44, 74: w, 75: T, 76: D, 77: I, 78: Y, 79: U, 80: J, 82: z, 91: V, 93: $ }, { 16: [1, 70] }, d(Q, [2, 11]), d(K, [2, 23]), d(K, [2, 24]), d([8, 10, 16, 34, 35, 37, 39, 41, 42, 43, 45, 46, 47, 48, 50, 51, 53, 54, 55, 64, 65, 66, 83, 86], te, { 32: [1, 71], 57: se }), d([8, 10, 16, 32, 35, 39, 41, 42, 43, 45, 46, 47, 48, 50, 51, 53, 54, 55, 57, 64, 65, 66, 83, 86], [2, 26], { 34: [1, 73], 37: [1, 74] }), d(de, [2, 54], { 88: 77, 8: ae, 64: [1, 75], 65: [1, 76] }), d(de, [2, 55], { 88: 79, 8: ae, 64: [1, 81], 65: [1, 80] }), d(ce, [2, 28], { 39: fe }), d(K, [2, 56]), d(K, [2, 57]), d(K, [2, 58]), d(Re, [2, 30], { 41: ke, 42: je, 43: qe }), d(K, [2, 61]), d(K, [2, 62]), d(K, [2, 63]), d(K, [2, 64]), { 8: a, 9: 86, 20: c, 29: 22, 30: 23, 31: 24, 33: 25, 36: 28, 38: 32, 40: 40, 44: 47, 49: 55, 50: f, 51: g, 52: 56, 56: 57, 58: C, 59: 26, 60: 27, 61: 29, 62: 30, 63: 31, 65: P, 67: 34, 68: 35, 69: 36, 70: 41, 71: 42, 72: 43, 73: 44, 74: w, 75: T, 76: D, 77: I, 78: Y, 79: U, 80: J, 82: z, 91: V, 93: $ }, { 8: [1, 87] }, { 8: [1, 88] }, d(it, [2, 32], { 45: nt, 46: ht, 47: at, 48: Je }), d(K, [2, 66]), d(K, [2, 67]), d(K, [2, 68]), d(K, [2, 69]), { 20: rt, 72: 98, 73: 99, 77: I, 78: Y, 79: U, 80: J, 83: [1, 93], 84: 94, 85: 95, 87: 96 }, { 8: a, 20: c, 29: 102, 30: 23, 31: 24, 33: 25, 36: 28, 38: 32, 40: 40, 44: 47, 49: 55, 50: f, 51: g, 52: 56, 56: 57, 58: C, 59: 26, 60: 27, 61: 29, 62: 30, 63: 31, 65: P, 66: [1, 100], 67: 34, 68: 35, 69: 36, 70: 41, 71: 42, 72: 43, 73: 44, 74: w, 75: T, 76: D, 77: I, 78: Y, 79: U, 80: J, 81: 101, 82: z, 91: V, 93: $ }, d(ft, [2, 36], { 50: ut, 51: _t }), d(K, [2, 70]), d(K, [2, 71]), d(K, [2, 72]), d(K, [2, 73]), d(K, [2, 74]), d(K, [2, 75]), d(K, [2, 76]), d(Zt, [2, 41], { 53: Ct, 54: yt, 55: Pt }), d(K, [2, 44]), d(K, [2, 50]), { 8: a, 20: c, 31: 109, 50: f, 51: g, 52: 108, 56: 57, 58: C, 59: 26, 60: 27, 61: 29, 62: 30, 63: 31, 65: P, 67: 34, 68: 35, 69: 36, 70: 41, 71: 42, 72: 43, 73: 44, 74: w, 75: T, 76: D, 77: I, 78: Y, 79: U, 80: J, 82: z, 91: V, 93: $ }, { 8: a, 20: c, 31: 109, 50: f, 51: g, 52: 110, 56: 57, 58: C, 59: 26, 60: 27, 61: 29, 62: 30, 63: 31, 65: P, 67: 34, 68: 35, 69: 36, 70: 41, 71: 42, 72: 43, 73: 44, 74: w, 75: T, 76: D, 77: I, 78: Y, 79: U, 80: J, 82: z, 91: V, 93: $ }, { 8: a, 20: c, 31: 109, 50: f, 51: g, 52: 111, 56: 57, 58: C, 59: 26, 60: 27, 61: 29, 62: 30, 63: 31, 65: P, 67: 34, 68: 35, 69: 36, 70: 41, 71: 42, 72: 43, 73: 44, 74: w, 75: T, 76: D, 77: I, 78: Y, 79: U, 80: J, 82: z, 91: V, 93: $ }, { 6: 6, 7: x, 8: a, 9: 20, 11: 4, 13: 7, 14: j, 15: k, 16: N, 17: A, 18: 8, 19: E, 20: c, 21: b, 22: 9, 23: m, 24: 11, 25: 5, 26: _, 27: [1, 112], 28: 10, 29: 22, 30: 23, 31: 24, 33: 25, 36: 28, 38: 32, 40: 40, 44: 47, 49: 55, 50: f, 51: g, 52: 56, 56: 57, 58: C, 59: 26, 60: 27, 61: 29, 62: 30, 63: 31, 65: P, 67: 34, 68: 35, 69: 36, 70: 41, 71: 42, 72: 43, 73: 44, 74: w, 75: T, 76: D, 77: I, 78: Y, 79: U, 80: J, 82: z, 91: V, 93: $ }, { 8: a, 9: 113, 20: c, 29: 22, 30: 23, 31: 24, 33: 25, 36: 28, 38: 32, 40: 40, 44: 47, 49: 55, 50: f, 51: g, 52: 56, 56: 57, 58: C, 59: 26, 60: 27, 61: 29, 62: 30, 63: 31, 65: P, 67: 34, 68: 35, 69: 36, 70: 41, 71: 42, 72: 43, 73: 44, 74: w, 75: T, 76: D, 77: I, 78: Y, 79: U, 80: J, 82: z, 91: V, 93: $ }, { 8: a, 9: 114, 20: c, 29: 22, 30: 23, 31: 24, 33: 25, 36: 28, 38: 32, 40: 40, 44: 47, 49: 55, 50: f, 51: g, 52: 56, 56: 57, 58: C, 59: 26, 60: 27, 61: 29, 62: 30, 63: 31, 65: P, 67: 34, 68: 35, 69: 36, 70: 41, 71: 42, 72: 43, 73: 44, 74: w, 75: T, 76: D, 77: I, 78: Y, 79: U, 80: J, 82: z, 91: V, 93: $ }, { 8: a, 9: 115, 20: c, 29: 22, 30: 23, 31: 24, 33: 25, 36: 28, 38: 32, 40: 40, 44: 47, 49: 55, 50: f, 51: g, 52: 56, 56: 57, 58: C, 59: 26, 60: 27, 61: 29, 62: 30, 63: 31, 65: P, 67: 34, 68: 35, 69: 36, 70: 41, 71: 42, 72: 43, 73: 44, 74: w, 75: T, 76: D, 77: I, 78: Y, 79: U, 80: J, 82: z, 91: V, 93: $ }, { 14: [1, 116] }, d(Q, [2, 7]), d(Q, [2, 8]), d(Q, [2, 9]), { 16: [1, 117] }, d(Q, [2, 22]), { 8: a, 20: c, 29: 118, 30: 23, 31: 24, 33: 25, 36: 28, 38: 32, 40: 40, 44: 47, 49: 55, 50: f, 51: g, 52: 56, 56: 57, 58: C, 59: 26, 60: 27, 61: 29, 62: 30, 63: 31, 65: P, 67: 34, 68: 35, 69: 36, 70: 41, 71: 42, 72: 43, 73: 44, 74: w, 75: T, 76: D, 77: I, 78: Y, 79: U, 80: J, 82: z, 91: V, 93: $ }, { 8: a, 20: c, 31: 109, 50: f, 51: g, 52: 119, 56: 57, 58: C, 59: 26, 60: 27, 61: 29, 62: 30, 63: 31, 65: P, 67: 34, 68: 35, 69: 36, 70: 41, 71: 42, 72: 43, 73: 44, 74: w, 75: T, 76: D, 77: I, 78: Y, 79: U, 80: J, 82: z, 91: V, 93: $ }, { 8: a, 20: c, 29: 120, 30: 23, 31: 24, 33: 25, 36: 28, 38: 32, 40: 40, 44: 47, 49: 55, 50: f, 51: g, 52: 56, 56: 57, 58: C, 59: 26, 60: 27, 61: 29, 62: 30, 63: 31, 65: P, 67: 34, 68: 35, 69: 36, 70: 41, 71: 42, 72: 43, 73: 44, 74: w, 75: T, 76: D, 77: I, 78: Y, 79: U, 80: J, 82: z, 91: V, 93: $ }, { 8: a, 20: c, 31: 109, 36: 121, 38: 32, 40: 40, 44: 47, 49: 55, 50: f, 51: g, 52: 56, 56: 57, 58: C, 59: 26, 60: 27, 61: 29, 62: 30, 63: 31, 65: P, 67: 34, 68: 35, 69: 36, 70: 41, 71: 42, 72: 43, 73: 44, 74: w, 75: T, 76: D, 77: I, 78: Y, 79: U, 80: J, 82: z, 91: V, 93: $ }, { 20: [1, 122] }, { 8: a, 9: 123, 20: c, 29: 22, 30: 23, 31: 24, 33: 25, 36: 28, 38: 32, 40: 40, 44: 47, 49: 55, 50: f, 51: g, 52: 56, 56: 57, 58: C, 59: 26, 60: 27, 61: 29, 62: 30, 63: 31, 65: P, 67: 34, 68: 35, 69: 36, 70: 41, 71: 42, 72: 43, 73: 44, 74: w, 75: T, 76: D, 77: I, 78: Y, 79: U, 80: J, 82: z, 91: V, 93: $ }, d(K, [2, 87], { 89: 124, 90: 125, 68: 127, 20: Nt, 82: z }), { 8: a, 10: [1, 128], 20: c, 29: 102, 30: 23, 31: 24, 33: 25, 36: 28, 38: 32, 40: 40, 44: 47, 49: 55, 50: f, 51: g, 52: 56, 56: 57, 58: C, 59: 26, 60: 27, 61: 29, 62: 30, 63: 31, 65: P, 67: 34, 68: 35, 69: 36, 70: 41, 71: 42, 72: 43, 73: 44, 74: w, 75: T, 76: D, 77: I, 78: Y, 79: U, 80: J, 81: 129, 82: z, 91: V, 93: $ }, d(K, [2, 89]), { 8: a, 9: 130, 20: c, 29: 22, 30: 23, 31: 24, 33: 25, 36: 28, 38: 32, 40: 40, 44: 47, 49: 55, 50: f, 51: g, 52: 56, 56: 57, 58: C, 59: 26, 60: 27, 61: 29, 62: 30, 63: 31, 65: P, 67: 34, 68: 35, 69: 36, 70: 41, 71: 42, 72: 43, 73: 44, 74: w, 75: T, 76: D, 77: I, 78: Y, 79: U, 80: J, 82: z, 91: V, 93: $ }, { 20: [1, 131] }, { 8: a, 20: c, 31: 109, 38: 132, 40: 40, 44: 47, 49: 55, 50: f, 51: g, 52: 56, 56: 57, 58: C, 59: 26, 60: 27, 61: 29, 62: 30, 63: 31, 65: P, 67: 34, 68: 35, 69: 36, 70: 41, 71: 42, 72: 43, 73: 44, 74: w, 75: T, 76: D, 77: I, 78: Y, 79: U, 80: J, 82: z, 91: V, 93: $ }, { 8: a, 20: c, 31: 109, 40: 133, 44: 47, 49: 55, 50: f, 51: g, 52: 56, 56: 57, 58: C, 59: 26, 60: 27, 61: 29, 62: 30, 63: 31, 65: P, 67: 34, 68: 35, 69: 36, 70: 41, 71: 42, 72: 43, 73: 44, 74: w, 75: T, 76: D, 77: I, 78: Y, 79: U, 80: J, 82: z, 91: V, 93: $ }, { 8: a, 20: c, 31: 109, 40: 134, 44: 47, 49: 55, 50: f, 51: g, 52: 56, 56: 57, 58: C, 59: 26, 60: 27, 61: 29, 62: 30, 63: 31, 65: P, 67: 34, 68: 35, 69: 36, 70: 41, 71: 42, 72: 43, 73: 44, 74: w, 75: T, 76: D, 77: I, 78: Y, 79: U, 80: J, 82: z, 91: V, 93: $ }, { 8: a, 20: c, 31: 109, 40: 135, 44: 47, 49: 55, 50: f, 51: g, 52: 56, 56: 57, 58: C, 59: 26, 60: 27, 61: 29, 62: 30, 63: 31, 65: P, 67: 34, 68: 35, 69: 36, 70: 41, 71: 42, 72: 43, 73: 44, 74: w, 75: T, 76: D, 77: I, 78: Y, 79: U, 80: J, 82: z, 91: V, 93: $ }, { 10: [1, 136] }, { 10: [1, 137], 20: At, 92: 138 }, { 10: [1, 140], 20: At, 92: 141 }, { 8: a, 20: c, 31: 109, 44: 142, 49: 55, 50: f, 51: g, 52: 56, 56: 57, 58: C, 59: 26, 60: 27, 61: 29, 62: 30, 63: 31, 65: P, 67: 34, 68: 35, 69: 36, 70: 41, 71: 42, 72: 43, 73: 44, 74: w, 75: T, 76: D, 77: I, 78: Y, 79: U, 80: J, 82: z, 91: V, 93: $ }, { 8: a, 20: c, 31: 109, 44: 143, 49: 55, 50: f, 51: g, 52: 56, 56: 57, 58: C, 59: 26, 60: 27, 61: 29, 62: 30, 63: 31, 65: P, 67: 34, 68: 35, 69: 36, 70: 41, 71: 42, 72: 43, 73: 44, 74: w, 75: T, 76: D, 77: I, 78: Y, 79: U, 80: J, 82: z, 91: V, 93: $ }, { 8: a, 20: c, 31: 109, 44: 144, 49: 55, 50: f, 51: g, 52: 56, 56: 57, 58: C, 59: 26, 60: 27, 61: 29, 62: 30, 63: 31, 65: P, 67: 34, 68: 35, 69: 36, 70: 41, 71: 42, 72: 43, 73: 44, 74: w, 75: T, 76: D, 77: I, 78: Y, 79: U, 80: J, 82: z, 91: V, 93: $ }, { 8: a, 20: c, 31: 109, 44: 145, 49: 55, 50: f, 51: g, 52: 56, 56: 57, 58: C, 59: 26, 60: 27, 61: 29, 62: 30, 63: 31, 65: P, 67: 34, 68: 35, 69: 36, 70: 41, 71: 42, 72: 43, 73: 44, 74: w, 75: T, 76: D, 77: I, 78: Y, 79: U, 80: J, 82: z, 91: V, 93: $ }, d(K, [2, 79]), { 83: [1, 146], 86: [1, 147] }, d(Et, [2, 81]), { 35: [1, 148] }, { 35: [2, 84] }, { 35: [2, 85] }, { 35: [2, 86] }, d(K, [2, 77]), { 66: [1, 149], 86: Rt }, d(Dt, [2, 98]), { 8: a, 20: c, 31: 109, 49: 151, 50: f, 51: g, 52: 56, 56: 57, 58: C, 59: 26, 60: 27, 61: 29, 62: 30, 63: 31, 65: P, 67: 34, 68: 35, 69: 36, 70: 41, 71: 42, 72: 43, 73: 44, 74: w, 75: T, 76: D, 77: I, 78: Y, 79: U, 80: J, 82: z, 91: V, 93: $ }, { 8: a, 20: c, 31: 109, 49: 152, 50: f, 51: g, 52: 56, 56: 57, 58: C, 59: 26, 60: 27, 61: 29, 62: 30, 63: 31, 65: P, 67: 34, 68: 35, 69: 36, 70: 41, 71: 42, 72: 43, 73: 44, 74: w, 75: T, 76: D, 77: I, 78: Y, 79: U, 80: J, 82: z, 91: V, 93: $ }, { 8: a, 20: c, 31: 109, 50: f, 51: g, 52: 153, 56: 57, 58: C, 59: 26, 60: 27, 61: 29, 62: 30, 63: 31, 65: P, 67: 34, 68: 35, 69: 36, 70: 41, 71: 42, 72: 43, 73: 44, 74: w, 75: T, 76: D, 77: I, 78: Y, 79: U, 80: J, 82: z, 91: V, 93: $ }, { 8: a, 20: c, 31: 109, 50: f, 51: g, 52: 154, 56: 57, 58: C, 59: 26, 60: 27, 61: 29, 62: 30, 63: 31, 65: P, 67: 34, 68: 35, 69: 36, 70: 41, 71: 42, 72: 43, 73: 44, 74: w, 75: T, 76: D, 77: I, 78: Y, 79: U, 80: J, 82: z, 91: V, 93: $ }, { 8: a, 20: c, 31: 109, 50: f, 51: g, 52: 155, 56: 57, 58: C, 59: 26, 60: 27, 61: 29, 62: 30, 63: 31, 65: P, 67: 34, 68: 35, 69: 36, 70: 41, 71: 42, 72: 43, 73: 44, 74: w, 75: T, 76: D, 77: I, 78: Y, 79: U, 80: J, 82: z, 91: V, 93: $ }, d(K, [2, 51]), d([8, 10, 16, 32, 34, 35, 37, 39, 41, 42, 43, 45, 46, 47, 48, 50, 51, 53, 54, 55, 64, 65, 66, 83, 86], te, { 57: se }), d(K, [2, 52]), d(K, [2, 53]), d([5, 7, 8, 10, 12, 14, 15, 16, 17, 19, 20, 21, 23, 26, 27, 32, 34, 35, 37, 39, 41, 42, 43, 45, 46, 47, 48, 50, 51, 53, 54, 55, 57, 58, 64, 65, 66, 74, 75, 76, 77, 78, 79, 80, 82, 83, 86, 91, 93], [2, 12]), { 10: [1, 156] }, { 10: [1, 157] }, { 16: [1, 158] }, { 8: [1, 159] }, d(Q, [2, 10]), d(K, [2, 25]), d(K, [2, 49]), { 35: [1, 160] }, d(ce, [2, 29], { 39: fe }), d(K, [2, 59]), { 66: [1, 161] }, d([8, 10, 16, 32, 34, 35, 37, 39, 41, 42, 43, 45, 46, 47, 48, 50, 51, 53, 54, 55, 57, 64, 65, 66, 83], [2, 88], { 86: [1, 162] }), d(K, [2, 94]), d(K, [2, 96]), d(K, [2, 97]), d(Lt, [2, 92]), { 10: [1, 163], 86: Rt }, { 66: [1, 164] }, d(K, [2, 91]), d(Re, [2, 31], { 41: ke, 42: je, 43: qe }), d(it, [2, 33], { 45: nt, 46: ht, 47: at, 48: Je }), d(it, [2, 34], { 45: nt, 46: ht, 47: at, 48: Je }), d(it, [2, 35], { 45: nt, 46: ht, 47: at, 48: Je }), d(K, [2, 65]), { 25: 165, 26: _ }, { 10: [1, 166], 86: kt }, d(Bt, [2, 104]), { 94: [1, 168] }, { 10: [1, 169], 86: kt }, d(ft, [2, 37], { 50: ut, 51: _t }), d(ft, [2, 38], { 50: ut, 51: _t }), d(ft, [2, 39], { 50: ut, 51: _t }), d(ft, [2, 40], { 50: ut, 51: _t }), d(K, [2, 80]), { 20: rt, 72: 98, 73: 99, 77: I, 78: Y, 79: U, 80: J, 85: 170, 87: 96 }, { 8: a, 20: c, 29: 171, 30: 23, 31: 24, 33: 25, 36: 28, 38: 32, 40: 40, 44: 47, 49: 55, 50: f, 51: g, 52: 56, 56: 57, 58: C, 59: 26, 60: 27, 61: 29, 62: 30, 63: 31, 65: P, 67: 34, 68: 35, 69: 36, 70: 41, 71: 42, 72: 43, 73: 44, 74: w, 75: T, 76: D, 77: I, 78: Y, 79: U, 80: J, 82: z, 91: V, 93: $ }, d(K, [2, 78]), { 8: a, 20: c, 29: 172, 30: 23, 31: 24, 33: 25, 36: 28, 38: 32, 40: 40, 44: 47, 49: 55, 50: f, 51: g, 52: 56, 56: 57, 58: C, 59: 26, 60: 27, 61: 29, 62: 30, 63: 31, 65: P, 67: 34, 68: 35, 69: 36, 70: 41, 71: 42, 72: 43, 73: 44, 74: w, 75: T, 76: D, 77: I, 78: Y, 79: U, 80: J, 82: z, 91: V, 93: $ }, d(Zt, [2, 42], { 53: Ct, 54: yt, 55: Pt }), d(Zt, [2, 43], { 53: Ct, 54: yt, 55: Pt }), d(K, [2, 45]), d(K, [2, 46]), d(K, [2, 47]), { 6: 6, 7: x, 8: a, 9: 20, 11: 173, 13: 7, 14: j, 15: k, 16: N, 17: A, 18: 8, 19: E, 20: c, 21: b, 22: 9, 23: m, 24: 11, 25: 5, 26: _, 28: 10, 29: 22, 30: 23, 31: 24, 33: 25, 36: 28, 38: 32, 40: 40, 44: 47, 49: 55, 50: f, 51: g, 52: 56, 56: 57, 58: C, 59: 26, 60: 27, 61: 29, 62: 30, 63: 31, 65: P, 67: 34, 68: 35, 69: 36, 70: 41, 71: 42, 72: 43, 73: 44, 74: w, 75: T, 76: D, 77: I, 78: Y, 79: U, 80: J, 82: z, 91: V, 93: $ }, { 6: 6, 7: x, 8: a, 9: 20, 11: 174, 13: 7, 14: j, 15: k, 16: N, 17: A, 18: 8, 19: E, 20: c, 21: b, 22: 9, 23: m, 24: 11, 25: 5, 26: _, 28: 10, 29: 22, 30: 23, 31: 24, 33: 25, 36: 28, 38: 32, 40: 40, 44: 47, 49: 55, 50: f, 51: g, 52: 56, 56: 57, 58: C, 59: 26, 60: 27, 61: 29, 62: 30, 63: 31, 65: P, 67: 34, 68: 35, 69: 36, 70: 41, 71: 42, 72: 43, 73: 44, 74: w, 75: T, 76: D, 77: I, 78: Y, 79: U, 80: J, 82: z, 91: V, 93: $ }, { 8: a, 9: 175, 20: c, 29: 22, 30: 23, 31: 24, 33: 25, 36: 28, 38: 32, 40: 40, 44: 47, 49: 55, 50: f, 51: g, 52: 56, 56: 57, 58: C, 59: 26, 60: 27, 61: 29, 62: 30, 63: 31, 65: P, 67: 34, 68: 35, 69: 36, 70: 41, 71: 42, 72: 43, 73: 44, 74: w, 75: T, 76: D, 77: I, 78: Y, 79: U, 80: J, 82: z, 91: V, 93: $ }, { 8: a, 9: 176, 20: c, 29: 22, 30: 23, 31: 24, 33: 25, 36: 28, 38: 32, 40: 40, 44: 47, 49: 55, 50: f, 51: g, 52: 56, 56: 57, 58: C, 59: 26, 60: 27, 61: 29, 62: 30, 63: 31, 65: P, 67: 34, 68: 35, 69: 36, 70: 41, 71: 42, 72: 43, 73: 44, 74: w, 75: T, 76: D, 77: I, 78: Y, 79: U, 80: J, 82: z, 91: V, 93: $ }, { 8: a, 20: c, 29: 177, 30: 23, 31: 24, 33: 25, 36: 28, 38: 32, 40: 40, 44: 47, 49: 55, 50: f, 51: g, 52: 56, 56: 57, 58: C, 59: 26, 60: 27, 61: 29, 62: 30, 63: 31, 65: P, 67: 34, 68: 35, 69: 36, 70: 41, 71: 42, 72: 43, 73: 44, 74: w, 75: T, 76: D, 77: I, 78: Y, 79: U, 80: J, 82: z, 91: V, 93: $ }, d(K, [2, 60]), { 20: Nt, 68: 127, 82: z, 90: 178 }, d(Lt, [2, 93]), d(K, [2, 90]), d(K, [2, 100]), { 25: 179, 26: _ }, { 20: [1, 180] }, { 8: a, 9: 181, 20: c, 29: 22, 30: 23, 31: 24, 33: 25, 36: 28, 38: 32, 40: 40, 44: 47, 49: 55, 50: f, 51: g, 52: 56, 56: 57, 58: C, 59: 26, 60: 27, 61: 29, 62: 30, 63: 31, 65: P, 67: 34, 68: 35, 69: 36, 70: 41, 71: 42, 72: 43, 73: 44, 74: w, 75: T, 76: D, 77: I, 78: Y, 79: U, 80: J, 82: z, 91: V, 93: $ }, { 94: [1, 182] }, d(Et, [2, 82]), d(Et, [2, 83]), d(Dt, [2, 99]), d(ne, [2, 2], { 12: [1, 183] }), d(Q, [2, 4]), { 16: [1, 184] }, { 10: [1, 185] }, d(K, [2, 27]), d(K, [2, 95]), d(K, [2, 101]), d(Bt, [2, 105]), d(K, [2, 102]), { 8: a, 9: 186, 20: c, 29: 22, 30: 23, 31: 24, 33: 25, 36: 28, 38: 32, 40: 40, 44: 47, 49: 55, 50: f, 51: g, 52: 56, 56: 57, 58: C, 59: 26, 60: 27, 61: 29, 62: 30, 63: 31, 65: P, 67: 34, 68: 35, 69: 36, 70: 41, 71: 42, 72: 43, 73: 44, 74: w, 75: T, 76: D, 77: I, 78: Y, 79: U, 80: J, 82: z, 91: V, 93: $ }, { 6: 6, 7: x, 8: a, 9: 20, 11: 187, 13: 7, 14: j, 15: k, 16: N, 17: A, 18: 8, 19: E, 20: c, 21: b, 22: 9, 23: m, 24: 11, 25: 5, 26: _, 28: 10, 29: 22, 30: 23, 31: 24, 33: 25, 36: 28, 38: 32, 40: 40, 44: 47, 49: 55, 50: f, 51: g, 52: 56, 56: 57, 58: C, 59: 26, 60: 27, 61: 29, 62: 30, 63: 31, 65: P, 67: 34, 68: 35, 69: 36, 70: 41, 71: 42, 72: 43, 73: 44, 74: w, 75: T, 76: D, 77: I, 78: Y, 79: U, 80: J, 82: z, 91: V, 93: $ }, { 8: a, 9: 188, 20: c, 29: 22, 30: 23, 31: 24, 33: 25, 36: 28, 38: 32, 40: 40, 44: 47, 49: 55, 50: f, 51: g, 52: 56, 56: 57, 58: C, 59: 26, 60: 27, 61: 29, 62: 30, 63: 31, 65: P, 67: 34, 68: 35, 69: 36, 70: 41, 71: 42, 72: 43, 73: 44, 74: w, 75: T, 76: D, 77: I, 78: Y, 79: U, 80: J, 82: z, 91: V, 93: $ }, { 16: [1, 189] }, d(K, [2, 103]), d(Q, [2, 3]), { 10: [1, 190] }, d(Q, [2, 6]), { 6: 6, 7: x, 8: a, 9: 20, 11: 191, 13: 7, 14: j, 15: k, 16: N, 17: A, 18: 8, 19: E, 20: c, 21: b, 22: 9, 23: m, 24: 11, 25: 5, 26: _, 28: 10, 29: 22, 30: 23, 31: 24, 33: 25, 36: 28, 38: 32, 40: 40, 44: 47, 49: 55, 50: f, 51: g, 52: 56, 56: 57, 58: C, 59: 26, 60: 27, 61: 29, 62: 30, 63: 31, 65: P, 67: 34, 68: 35, 69: 36, 70: 41, 71: 42, 72: 43, 73: 44, 74: w, 75: T, 76: D, 77: I, 78: Y, 79: U, 80: J, 82: z, 91: V, 93: $ }, d(Q, [2, 5])], defaultActions: { 3: [2, 1], 97: [2, 84], 98: [2, 85], 99: [2, 86] }, parseError: function(ze, Ze) {
      if (!Ze.recoverable) {
        var Te = new Error(ze);
        throw Te.hash = Ze, Te;
      }
      this.trace(ze);
    }, parse: function(ze) {
      var Ze = this, Te = [0], Xe = [null], Me = [], le = this.table, ve = "", ie = 0, It = 0, Gt = 0, zt = 2, Yt = 1, Ht = Me.slice.call(arguments, 1), Ke = Object.create(this.lexer), ct = { yy: {} };
      for (var St in this.yy)
        Object.prototype.hasOwnProperty.call(this.yy, St) && (ct.yy[St] = this.yy[St]);
      Ke.setInput(ze, ct.yy), ct.yy.lexer = Ke, ct.yy.parser = this, Ke.yylloc === void 0 && (Ke.yylloc = {});
      var wt = Ke.yylloc;
      Me.push(wt);
      var Wt = Ke.options && Ke.options.ranges;
      typeof ct.yy.parseError == "function" ? this.parseError = ct.yy.parseError : this.parseError = Object.getPrototypeOf(this).parseError;
      for (var st, Tt, dt, ot, jt, bt, lt, Xt, vt, Vt = function() {
        var gt;
        return typeof (gt = Ke.lex() || Yt) != "number" && (gt = Ze.symbols_[gt] || gt), gt;
      }, pt = {}; ; ) {
        if (dt = Te[Te.length - 1], this.defaultActions[dt] ? ot = this.defaultActions[dt] : (st == null && (st = Vt()), ot = le[dt] && le[dt][st]), ot === void 0 || !ot.length || !ot[0]) {
          var Ut = "";
          for (bt in vt = [], le[dt])
            this.terminals_[bt] && bt > zt && vt.push("'" + this.terminals_[bt] + "'");
          Ut = Ke.showPosition ? "Parse error on line " + (ie + 1) + `:
` + Ke.showPosition() + `
Expecting ` + vt.join(", ") + ", got '" + (this.terminals_[st] || st) + "'" : "Parse error on line " + (ie + 1) + ": Unexpected " + (st == Yt ? "end of input" : "'" + (this.terminals_[st] || st) + "'"), this.parseError(Ut, { text: Ke.match, token: this.terminals_[st] || st, line: Ke.yylineno, loc: wt, expected: vt });
        }
        if (ot[0] instanceof Array && ot.length > 1)
          throw new Error("Parse Error: multiple actions possible at state: " + dt + ", token: " + st);
        switch (ot[0]) {
          case 1:
            Te.push(st), Xe.push(Ke.yytext), Me.push(Ke.yylloc), Te.push(ot[1]), st = null, Tt ? (st = Tt, Tt = null) : (It = Ke.yyleng, ve = Ke.yytext, ie = Ke.yylineno, wt = Ke.yylloc, Gt > 0);
            break;
          case 2:
            if (lt = this.productions_[ot[1]][1], pt.$ = Xe[Xe.length - lt], pt._$ = { first_line: Me[Me.length - (lt || 1)].first_line, last_line: Me[Me.length - 1].last_line, first_column: Me[Me.length - (lt || 1)].first_column, last_column: Me[Me.length - 1].last_column }, Wt && (pt._$.range = [Me[Me.length - (lt || 1)].range[0], Me[Me.length - 1].range[1]]), (jt = this.performAction.apply(pt, [ve, It, ie, ct.yy, ot[1], Xe, Me].concat(Ht))) !== void 0)
              return jt;
            lt && (Te = Te.slice(0, -1 * lt * 2), Xe = Xe.slice(0, -1 * lt), Me = Me.slice(0, -1 * lt)), Te.push(this.productions_[ot[1]][0]), Xe.push(pt.$), Me.push(pt._$), Xt = le[Te[Te.length - 2]][Te[Te.length - 1]], Te.push(Xt);
            break;
          case 3:
            return !0;
        }
      }
      return !0;
    } }, Oe = { node: function(ze, Ze, Te) {
      return { type: ze, value: Ze, children: Te };
    }, createNode: function(ze, Ze, Te, Xe) {
      var Me, le = this.node(Ze, Te, []);
      for (Me = 3; Me < arguments.length; Me++)
        le.children.push(arguments[Me]);
      return le.line = ze[0], le.col = ze[1], le.eline = ze[2], le.ecol = ze[3], le;
    } }, xe = function(ze) {
      return [ze.first_line, ze.first_column, ze.last_line, ze.last_column];
    }, Jt = function() {
      var ze = { EOF: 1, parseError: function(Ze, Te) {
        if (!this.yy.parser)
          throw new Error(Ze);
        this.yy.parser.parseError(Ze, Te);
      }, setInput: function(Ze, Te) {
        return this.yy = Te || this.yy || {}, this._input = Ze, this._more = this._backtrack = this.done = !1, this.yylineno = this.yyleng = 0, this.yytext = this.matched = this.match = "", this.conditionStack = ["INITIAL"], this.yylloc = { first_line: 1, first_column: 0, last_line: 1, last_column: 0 }, this.options.ranges && (this.yylloc.range = [0, 0]), this.offset = 0, this;
      }, input: function() {
        var Ze = this._input[0];
        return this.yytext += Ze, this.yyleng++, this.offset++, this.match += Ze, this.matched += Ze, Ze.match(/(?:\r\n?|\n).*/g) ? (this.yylineno++, this.yylloc.last_line++) : this.yylloc.last_column++, this.options.ranges && this.yylloc.range[1]++, this._input = this._input.slice(1), Ze;
      }, unput: function(Ze) {
        var Te = Ze.length, Xe = Ze.split(/(?:\r\n?|\n)/g);
        this._input = Ze + this._input, this.yytext = this.yytext.substr(0, this.yytext.length - Te), this.offset -= Te;
        var Me = this.match.split(/(?:\r\n?|\n)/g);
        this.match = this.match.substr(0, this.match.length - 1), this.matched = this.matched.substr(0, this.matched.length - 1), Xe.length - 1 && (this.yylineno -= Xe.length - 1);
        var le = this.yylloc.range;
        return this.yylloc = { first_line: this.yylloc.first_line, last_line: this.yylineno + 1, first_column: this.yylloc.first_column, last_column: Xe ? (Xe.length === Me.length ? this.yylloc.first_column : 0) + Me[Me.length - Xe.length].length - Xe[0].length : this.yylloc.first_column - Te }, this.options.ranges && (this.yylloc.range = [le[0], le[0] + this.yyleng - Te]), this.yyleng = this.yytext.length, this;
      }, more: function() {
        return this._more = !0, this;
      }, reject: function() {
        return this.options.backtrack_lexer ? (this._backtrack = !0, this) : this.parseError("Lexical error on line " + (this.yylineno + 1) + `. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).
` + this.showPosition(), { text: "", token: null, line: this.yylineno });
      }, less: function(Ze) {
        this.unput(this.match.slice(Ze));
      }, pastInput: function() {
        var Ze = this.matched.substr(0, this.matched.length - this.match.length);
        return (Ze.length > 20 ? "..." : "") + Ze.substr(-20).replace(/\n/g, "");
      }, upcomingInput: function() {
        var Ze = this.match;
        return Ze.length < 20 && (Ze += this._input.substr(0, 20 - Ze.length)), (Ze.substr(0, 20) + (Ze.length > 20 ? "..." : "")).replace(/\n/g, "");
      }, showPosition: function() {
        var Ze = this.pastInput(), Te = new Array(Ze.length + 1).join("-");
        return Ze + this.upcomingInput() + `
` + Te + "^";
      }, test_match: function(Ze, Te) {
        var Xe, Me, le;
        if (this.options.backtrack_lexer && (le = { yylineno: this.yylineno, yylloc: { first_line: this.yylloc.first_line, last_line: this.last_line, first_column: this.yylloc.first_column, last_column: this.yylloc.last_column }, yytext: this.yytext, match: this.match, matches: this.matches, matched: this.matched, yyleng: this.yyleng, offset: this.offset, _more: this._more, _input: this._input, yy: this.yy, conditionStack: this.conditionStack.slice(0), done: this.done }, this.options.ranges && (le.yylloc.range = this.yylloc.range.slice(0))), (Me = Ze[0].match(/(?:\r\n?|\n).*/g)) && (this.yylineno += Me.length), this.yylloc = { first_line: this.yylloc.last_line, last_line: this.yylineno + 1, first_column: this.yylloc.last_column, last_column: Me ? Me[Me.length - 1].length - Me[Me.length - 1].match(/\r?\n?/)[0].length : this.yylloc.last_column + Ze[0].length }, this.yytext += Ze[0], this.match += Ze[0], this.matches = Ze, this.yyleng = this.yytext.length, this.options.ranges && (this.yylloc.range = [this.offset, this.offset += this.yyleng]), this._more = !1, this._backtrack = !1, this._input = this._input.slice(Ze[0].length), this.matched += Ze[0], Xe = this.performAction.call(this, this.yy, this, Te, this.conditionStack[this.conditionStack.length - 1]), this.done && this._input && (this.done = !1), Xe)
          return Xe;
        if (this._backtrack) {
          for (var ve in le)
            this[ve] = le[ve];
          return !1;
        }
        return !1;
      }, next: function() {
        if (this.done)
          return this.EOF;
        var Ze, Te, Xe, Me;
        this._input || (this.done = !0), this._more || (this.yytext = "", this.match = "");
        for (var le = this._currentRules(), ve = 0; ve < le.length; ve++)
          if ((Xe = this._input.match(this.rules[le[ve]])) && (!Te || Xe[0].length > Te[0].length)) {
            if (Te = Xe, Me = ve, this.options.backtrack_lexer) {
              if ((Ze = this.test_match(Xe, le[ve])) !== !1)
                return Ze;
              if (this._backtrack) {
                Te = !1;
                continue;
              }
              return !1;
            }
            if (!this.options.flex)
              break;
          }
        return Te ? (Ze = this.test_match(Te, le[Me])) !== !1 && Ze : this._input === "" ? this.EOF : this.parseError("Lexical error on line " + (this.yylineno + 1) + `. Unrecognized text.
` + this.showPosition(), { text: "", token: null, line: this.yylineno });
      }, lex: function() {
        var Ze = this.next();
        return Ze || this.lex();
      }, begin: function(Ze) {
        this.conditionStack.push(Ze);
      }, popState: function() {
        return this.conditionStack.length - 1 > 0 ? this.conditionStack.pop() : this.conditionStack[0];
      }, _currentRules: function() {
        return this.conditionStack.length && this.conditionStack[this.conditionStack.length - 1] ? this.conditions[this.conditionStack[this.conditionStack.length - 1]].rules : this.conditions.INITIAL.rules;
      }, topState: function(Ze) {
        return (Ze = this.conditionStack.length - 1 - Math.abs(Ze || 0)) >= 0 ? this.conditionStack[Ze] : "INITIAL";
      }, pushState: function(Ze) {
        this.begin(Ze);
      }, stateStackSize: function() {
        return this.conditionStack.length;
      }, options: {}, performAction: function(Ze, Te, Xe, Me) {
        switch (Xe) {
          case 0:
          case 5:
          case 6:
            break;
          case 1:
          case 2:
            return 78;
          case 3:
          case 4:
            return 77;
          case 7:
            return 7;
          case 8:
            return 12;
          case 9:
            return 14;
          case 10:
            return 17;
          case 11:
            return 15;
          case 12:
            return 91;
          case 13:
            return 93;
          case 14:
            return 19;
          case 15:
            return 23;
          case 16:
            return 21;
          case 17:
            return 75;
          case 18:
            return 76;
          case 19:
            return 74;
          case 20:
            return 80;
          case 21:
          case 22:
            return 94;
          case 23:
            return 82;
          case 24:
            return 83;
          case 25:
            return 26;
          case 26:
            return 27;
          case 27:
            return 16;
          case 28:
            return "#";
          case 29:
            return 34;
          case 30:
            return 35;
          case 31:
            return 79;
          case 32:
            return 64;
          case 33:
            return 65;
          case 34:
            return 66;
          case 35:
            return 8;
          case 36:
            return 10;
          case 37:
            return 58;
          case 38:
            return 57;
          case 39:
            return 53;
          case 40:
            return 54;
          case 41:
            return 55;
          case 42:
            return 50;
          case 43:
            return 51;
          case 44:
            return 47;
          case 45:
            return 45;
          case 46:
            return 48;
          case 47:
            return 46;
          case 48:
            return 41;
          case 49:
            return 43;
          case 50:
            return 42;
          case 51:
            return 39;
          case 52:
            return 37;
          case 53:
            return 32;
          case 54:
            return 86;
          case 55:
            return 5;
          case 56:
            return 20;
          case 57:
            return "INVALID";
        }
      }, rules: [/^(?:\s+)/, /^(?:[0-9]+\.[0-9]*|[0-9]*\.[0-9]+\b)/, /^(?:[0-9]+)/, /^(?:"(\\["]|[^"])*")/, /^(?:'(\\[']|[^'])*')/, /^(?:\/\/.*)/, /^(?:\/\*(.|\n|\r)*?\*\/)/, /^(?:if\b)/, /^(?:else\b)/, /^(?:while\b)/, /^(?:do\b)/, /^(?:for\b)/, /^(?:function\b)/, /^(?:map\b)/, /^(?:use\b)/, /^(?:return\b)/, /^(?:delete\b)/, /^(?:true\b)/, /^(?:false\b)/, /^(?:null\b)/, /^(?:Infinity\b)/, /^(?:->)/, /^(?:=>)/, /^(?:<<)/, /^(?:>>)/, /^(?:\{)/, /^(?:\})/, /^(?:;)/, /^(?:#)/, /^(?:\?)/, /^(?::)/, /^(?:NaN\b)/, /^(?:\.)/, /^(?:\[)/, /^(?:\])/, /^(?:\()/, /^(?:\))/, /^(?:!)/, /^(?:\^)/, /^(?:\*)/, /^(?:\/)/, /^(?:%)/, /^(?:\+)/, /^(?:-)/, /^(?:<=)/, /^(?:<)/, /^(?:>=)/, /^(?:>)/, /^(?:==)/, /^(?:~=)/, /^(?:!=)/, /^(?:&&)/, /^(?:\|\|)/, /^(?:=)/, /^(?:,)/, /^(?:$)/, /^(?:[A-Za-z_\$][A-Za-z0-9_]*)/, /^(?:.)/], conditions: { INITIAL: { rules: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57], inclusive: !0 } } };
      return ze;
    }();
    function xt() {
      this.yy = {};
    }
    return Ot.lexer = Jt, xt.prototype = Ot, Ot.Parser = xt, new xt();
  }();
  parser.yy.parseError = parser.parseError;
  const __WEBPACK_DEFAULT_EXPORT__ = _jxg__WEBPACK_IMPORTED_MODULE_0__.Z.JessieCode;
}, 327: (d, M, x) => {
  x.d(M, { Z: () => E });
  var a = x(765), j = x(109), k = x(275), N = { aliceblue: "f0f8ff", antiquewhite: "faebd7", aqua: "00ffff", aquamarine: "7fffd4", azure: "f0ffff", beige: "f5f5dc", bisque: "ffe4c4", black: "000000", blanchedalmond: "ffebcd", blue: "0000ff", blueviolet: "8a2be2", brown: "a52a2a", burlywood: "deb887", cadetblue: "5f9ea0", chartreuse: "7fff00", chocolate: "d2691e", coral: "ff7f50", cornflowerblue: "6495ed", cornsilk: "fff8dc", crimson: "dc143c", cyan: "00ffff", darkblue: "00008b", darkcyan: "008b8b", darkgoldenrod: "b8860b", darkgray: "a9a9a9", darkgreen: "006400", darkkhaki: "bdb76b", darkmagenta: "8b008b", darkolivegreen: "556b2f", darkorange: "ff8c00", darkorchid: "9932cc", darkred: "8b0000", darksalmon: "e9967a", darkseagreen: "8fbc8f", darkslateblue: "483d8b", darkslategray: "2f4f4f", darkturquoise: "00ced1", darkviolet: "9400d3", deeppink: "ff1493", deepskyblue: "00bfff", dimgray: "696969", dodgerblue: "1e90ff", feldspar: "d19275", firebrick: "b22222", floralwhite: "fffaf0", forestgreen: "228b22", fuchsia: "ff00ff", gainsboro: "dcdcdc", ghostwhite: "f8f8ff", gold: "ffd700", goldenrod: "daa520", gray: "808080", green: "008000", greenyellow: "adff2f", honeydew: "f0fff0", hotpink: "ff69b4", indianred: "cd5c5c", indigo: "4b0082", ivory: "fffff0", khaki: "f0e68c", lavender: "e6e6fa", lavenderblush: "fff0f5", lawngreen: "7cfc00", lemonchiffon: "fffacd", lightblue: "add8e6", lightcoral: "f08080", lightcyan: "e0ffff", lightgoldenrodyellow: "fafad2", lightgrey: "d3d3d3", lightgreen: "90ee90", lightpink: "ffb6c1", lightsalmon: "ffa07a", lightseagreen: "20b2aa", lightskyblue: "87cefa", lightslateblue: "8470ff", lightslategray: "778899", lightsteelblue: "b0c4de", lightyellow: "ffffe0", lime: "00ff00", limegreen: "32cd32", linen: "faf0e6", magenta: "ff00ff", maroon: "800000", mediumaquamarine: "66cdaa", mediumblue: "0000cd", mediumorchid: "ba55d3", mediumpurple: "9370d8", mediumseagreen: "3cb371", mediumslateblue: "7b68ee", mediumspringgreen: "00fa9a", mediumturquoise: "48d1cc", mediumvioletred: "c71585", midnightblue: "191970", mintcream: "f5fffa", mistyrose: "ffe4e1", moccasin: "ffe4b5", navajowhite: "ffdead", navy: "000080", oldlace: "fdf5e6", olive: "808000", olivedrab: "6b8e23", orange: "ffa500", orangered: "ff4500", orchid: "da70d6", palegoldenrod: "eee8aa", palegreen: "98fb98", paleturquoise: "afeeee", palevioletred: "d87093", papayawhip: "ffefd5", peachpuff: "ffdab9", peru: "cd853f", pink: "ffc0cb", plum: "dda0dd", powderblue: "b0e0e6", purple: "800080", red: "ff0000", rosybrown: "bc8f8f", royalblue: "4169e1", saddlebrown: "8b4513", salmon: "fa8072", sandybrown: "f4a460", seagreen: "2e8b57", seashell: "fff5ee", sienna: "a0522d", silver: "c0c0c0", skyblue: "87ceeb", slateblue: "6a5acd", slategray: "708090", snow: "fffafa", springgreen: "00ff7f", steelblue: "4682b4", tan: "d2b48c", teal: "008080", thistle: "d8bfd8", tomato: "ff6347", turquoise: "40e0d0", violet: "ee82ee", violetred: "d02090", wheat: "f5deb3", white: "ffffff", whitesmoke: "f5f5f5", yellow: "ffff00", yellowgreen: "9acd32" }, A = [{ re: /^\s*rgba\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*([\d.]{1,3})\s*\)\s*$/, example: ["rgba(123, 234, 45, 0.5)", "rgba(255,234,245,1.0)"], process: function(c) {
    return [parseInt(c[1], 10), parseInt(c[2], 10), parseInt(c[3], 10)];
  } }, { re: /^\s*rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)\s*$/, example: ["rgb(123, 234, 45)", "rgb(255,234,245)"], process: function(c) {
    return [parseInt(c[1], 10), parseInt(c[2], 10), parseInt(c[3], 10)];
  } }, { re: /^(\w{2})(\w{2})(\w{2})$/, example: ["#00ff00", "336699"], process: function(c) {
    return [parseInt(c[1], 16), parseInt(c[2], 16), parseInt(c[3], 16)];
  } }, { re: /^(\w{1})(\w{1})(\w{1})$/, example: ["#fb0", "f0f"], process: function(c) {
    return [parseInt(c[1] + c[1], 16), parseInt(c[2] + c[2], 16), parseInt(c[3] + c[3], 16)];
  } }];
  a.Z.rgbParser = function(c, b, m) {
    var _, f, g, C, P, w, T, D, I, Y, U = c;
    if (!j.Z.exists(c))
      return [];
    if (j.Z.exists(b) && j.Z.exists(m) && (U = [c, b, m]), _ = U, Y = !1, j.Z.isArray(_)) {
      for (w = 0; w < 3; w++)
        Y = Y || /\./.test(U[w].toString());
      for (w = 0; w < 3; w++)
        Y = Y && U[w] >= 0 && U[w] <= 1;
      return Y ? [Math.ceil(255 * U[0]), Math.ceil(255 * U[1]), Math.ceil(255 * U[2])] : U;
    }
    for (typeof U == "string" && (_ = U), _.charAt(0) === "#" && (_ = _.substr(1, 6)), _ = _.replace(/ /g, "").toLowerCase(), _ = N[_] || _, w = 0; w < A.length; w++)
      g = A[w].re, C = A[w].process, (P = g.exec(_)) && (T = (f = C(P))[0], D = f[1], I = f[2]);
    return isNaN(T) || isNaN(D) || isNaN(I) ? [] : [T = T < 0 || isNaN(T) ? 0 : T > 255 ? 255 : T, D = D < 0 || isNaN(D) ? 0 : D > 255 ? 255 : D, I = I < 0 || isNaN(I) ? 0 : I > 255 ? 255 : I];
  }, a.Z.rgb2css = function(c, b, m) {
    var _;
    return "rgb(" + (_ = a.Z.rgbParser(c, b, m))[0] + ", " + _[1] + ", " + _[2] + ")";
  }, a.Z.rgb2hex = function(c, b, m) {
    var _, f, g;
    return f = (_ = a.Z.rgbParser(c, b, m))[1], g = _[2], _ = (_ = _[0]).toString(16), f = f.toString(16), g = g.toString(16), _.length === 1 && (_ = "0" + _), f.length === 1 && (f = "0" + f), g.length === 1 && (g = "0" + g), "#" + _ + f + g;
  }, a.Z.hex2rgb = function(c) {
    return a.Z.deprecated("JXG.hex2rgb()", "JXG.rgb2css()"), a.Z.rgb2css(c);
  }, a.Z.hsv2rgb = function(c, b, m) {
    var _, f, g, C, P, w, T, D, I;
    if (c = (c % 360 + 360) % 360, b === 0) {
      if (!(isNaN(c) || c < k.Z.eps))
        return "#ffffff";
      _ = m, f = m, g = m;
    } else
      switch (w = c >= 360 ? 0 : c, T = m * (1 - b), D = m * (1 - b * (C = (w /= 60) - (P = Math.floor(w)))), I = m * (1 - b * (1 - C)), P) {
        case 0:
          _ = m, f = I, g = T;
          break;
        case 1:
          _ = D, f = m, g = T;
          break;
        case 2:
          _ = T, f = m, g = I;
          break;
        case 3:
          _ = T, f = D, g = m;
          break;
        case 4:
          _ = I, f = T, g = m;
          break;
        case 5:
          _ = m, f = T, g = D;
      }
    return ["#", _ = (_ = Math.round(255 * _).toString(16)).length === 2 ? _ : _.length === 1 ? "0" + _ : "00", f = (f = Math.round(255 * f).toString(16)).length === 2 ? f : f.length === 1 ? "0" + f : "00", g = (g = Math.round(255 * g).toString(16)).length === 2 ? g : g.length === 1 ? "0" + g : "00"].join("");
  }, a.Z.rgb2hsv = function(c, b, m) {
    var _, f, g, C, P, w, T, D, I, Y, U, J, z;
    return f = (_ = a.Z.rgbParser(c, b, m))[1], g = _[2], C = (_ = _[0]) / 255, P = f / 255, w = g / 255, J = Math.max(_, f, g), D = (z = Math.min(_, f, g)) / 255, Y = 0, (U = T = J / 255) > 0 && (Y = (U - D) / U), I = 1 / (T - D), Y > 0 && (J === _ ? I *= P - w : I = J === f ? 2 + (w - C) * I : 4 + (C - P) * I), (I *= 60) < 0 && (I += 360), J === z && (I = 0), [I, Y, U];
  }, a.Z.rgb2LMS = function(c, b, m) {
    var _, f, g, C, P, w, T, D = [[0.05059983, 0.08585369, 95242e-7], [0.01893033, 0.08925308, 0.01370054], [292202e-8, 975732e-8, 0.07145979]];
    return f = (_ = a.Z.rgbParser(c, b, m))[1], g = _[2], _ = _[0], _ = Math.pow(_, 0.476190476), f = Math.pow(f, 0.476190476), g = Math.pow(g, 0.476190476), (T = [C = _ * D[0][0] + f * D[0][1] + g * D[0][2], P = _ * D[1][0] + f * D[1][1] + g * D[1][2], w = _ * D[2][0] + f * D[2][1] + g * D[2][2]]).l = C, T.m = P, T.s = w, T;
  }, a.Z.LMS2rgb = function(c, b, m) {
    var _, f, g, C, P = [[30.830854, -29.832659, 1.610474], [-6.481468, 17.715578, -2.532642], [-0.37569, -1.199062, 14.273846]], w = function(T) {
      for (var D = 127, I = 64; I > 0; ) {
        if (Math.pow(D, 0.476190476) > T)
          D -= I;
        else {
          if (Math.pow(D + 1, 0.476190476) > T)
            return D;
          D += I;
        }
        I /= 2;
      }
      return D === 254 && 13.994955247 < T ? 255 : D;
    };
    return _ = c * P[0][0] + b * P[0][1] + m * P[0][2], f = c * P[1][0] + b * P[1][1] + m * P[1][2], g = c * P[2][0] + b * P[2][1] + m * P[2][2], (C = [_ = w(_), f = w(f), g = w(g)]).r = _, C.g = f, C.b = g, C;
  }, a.Z.rgba2rgbo = function(c) {
    var b;
    return c.length === 9 && c.charAt(0) === "#" ? (b = parseInt(c.substr(7, 2).toUpperCase(), 16) / 255, c = c.substr(0, 7)) : b = 1, [c, b];
  }, a.Z.rgbo2rgba = function(c, b) {
    var m;
    return c === "none" ? c : ((m = Math.round(255 * b).toString(16)).length === 1 && (m = "0" + m), c + m);
  }, a.Z.rgb2bw = function(c) {
    var b, m, _, f = "0123456789ABCDEF";
    return c === "none" ? c : (_ = a.Z.rgbParser(c), b = Math.floor(0.3 * _[0] + 0.59 * _[1] + 0.11 * _[2]), c = "#" + (m = f.charAt(b >> 4 & 15) + f.charAt(15 & b)) + m + m);
  }, a.Z.rgb2cb = function(c, b) {
    var m, _, f, g, C, P, w, T, D, I, Y, U = "0123456789ABCDEF";
    if (c === "none")
      return c;
    switch (_ = (C = a.Z.rgb2LMS(c))[0], f = C[1], g = C[2], b = b.toLowerCase()) {
      case "protanopia":
        P = -0.06150039994295001, w = 0.08277001656812001, T = -0.013200141220000003, D = 0.05858939668799999, I = -0.07934519995360001, Y = 0.013289415272000003, _ = g / f < 0.6903216543277437 ? -(w * f + T * g) / P : -(I * f + Y * g) / D;
        break;
      case "tritanopia":
        P = -58973116217e-14, w = 0.007690316482, T = -0.01011703519052, D = 0.025495080838999994, I = -0.0422740347, Y = 0.017005316784, g = f / _ < 0.8349489908460004 ? -(P * _ + w * f) / T : -(D * _ + I * f) / Y;
        break;
      default:
        P = -0.06150039994295001, w = 0.08277001656812001, T = -0.013200141220000003, D = 0.05858939668799999, I = -0.07934519995360001, Y = 0.013289415272000003, f = g / _ < 0.5763833686400911 ? -(P * _ + T * g) / w : -(D * _ + Y * g) / I;
    }
    return m = a.Z.LMS2rgb(_, f, g), c = "#" + (U.charAt(m[0] >> 4 & 15) + U.charAt(15 & m[0])), c += U.charAt(m[1] >> 4 & 15) + U.charAt(15 & m[1]), c += U.charAt(m[2] >> 4 & 15) + U.charAt(15 & m[2]);
  }, a.Z.autoHighlight = function(c) {
    var b = a.Z.rgba2rgbo(c), m = b[0], _ = b[1];
    return c.charAt(0) === "#" ? (_ *= _ < 0.3 ? 1.8 : 0.4, a.Z.rgbo2rgba(m, _)) : c;
  }, a.Z.contrast = function(c, b, m, _) {
    var f, g, C, P, w;
    return b = b || "#000000", m = m || "#ffffff", _ = _ || 7, f = a.Z.rgbParser(c), g = a.Z.rgbParser("#000000"), w = (C = 0.2126 * Math.pow(f[0] / 255, 2.2) + 0.7152 * Math.pow(f[1] / 255, 2.2) + 0.0722 * Math.pow(f[2] / 255, 2.2)) > (P = 0.2126 * Math.pow(g[0] / 255, 2.2) + 0.7152 * Math.pow(g[1] / 255, 2.2) + 0.0722 * Math.pow(g[2] / 255, 2.2)) ? Math.floor((C + 0.05) / (P + 0.05)) : Math.floor((P + 0.05) / (C + 0.05)), (w -= 1) > _ ? b : m;
  }, a.Z.setClassicColors = function() {
    a.Z.Options.elements.strokeColor = "blue", a.Z.Options.elements.fillColor = "red", a.Z.Options.hatch.strokeColor = "blue", a.Z.Options.angle.fillColor = "#ff7f00", a.Z.Options.angle.highlightFillColor = "#ff7f00", a.Z.Options.angle.strokeColor = "#ff7f00", a.Z.Options.angle.label.strokeColor = "blue", a.Z.Options.arc.strokeColor = "blue", a.Z.Options.circle.center.fillColor = "red", a.Z.Options.circle.center.strokeColor = "blue", a.Z.Options.circumcircle.strokeColor = "blue", a.Z.Options.circumcircle.center.fillColor = "red", a.Z.Options.circumcircle.center.strokeColor = "blue", a.Z.Options.circumcirclearc.strokeColor = "blue", a.Z.Options.circumcirclesector.strokeColor = "blue", a.Z.Options.circumcirclesector.fillColor = "green", a.Z.Options.circumcirclesector.highlightFillColor = "green", a.Z.Options.conic.strokeColor = "blue", a.Z.Options.curve.strokeColor = "blue", a.Z.Options.incircle.strokeColor = "blue", a.Z.Options.incircle.center.fillColor = "red", a.Z.Options.incircle.center.strokeColor = "blue", a.Z.Options.inequality.fillColor = "red", a.Z.Options.integral.fillColor = "red", a.Z.Options.integral.curveLeft.color = "red", a.Z.Options.integral.curveRight.color = "red", a.Z.Options.line.strokeColor = "blue", a.Z.Options.point.fillColor = "red", a.Z.Options.point.strokeColor = "red", a.Z.Options.polygon.fillColor = "green", a.Z.Options.polygon.highlightFillColor = "green", a.Z.Options.polygon.vertices.strokeColor = "red", a.Z.Options.polygon.vertices.fillColor = "red", a.Z.Options.regularpolygon.fillColor = "green", a.Z.Options.regularpolygon.highlightFillColor = "green", a.Z.Options.regularpolygon.vertices.strokeColor = "red", a.Z.Options.regularpolygon.vertices.fillColor = "red", a.Z.Options.riemannsum.fillColor = "yellow", a.Z.Options.sector.fillColor = "green", a.Z.Options.sector.highlightFillColor = "green", a.Z.Options.semicircle.center.fillColor = "red", a.Z.Options.semicircle.center.strokeColor = "blue", a.Z.Options.slopetriangle.fillColor = "red", a.Z.Options.slopetriangle.highlightFillColor = "red", a.Z.Options.turtle.arrow.strokeColor = "blue";
  }, a.Z.extend(a.Z, { paletteWong: { black: "#000000", orange: "#E69F00", skyblue: "#56B4E9", bluishgreen: "#009E73", yellow: "#F0E442", darkblue: "#0072B2", vermillion: "#D55E00", reddishpurple: "#CC79A7", blue: "#0072B2", red: "#D55E00", green: "#009E73", purple: "#CC79A7", white: "#ffffff" } }), a.Z.palette = a.Z.paletteWong;
  const E = a.Z;
}, 503: (d, M, x) => {
  x.d(M, { Z: () => k });
  var a = x(765), j = x(109);
  a.Z.extendConstants(a.Z, { touchProperty: "touches" }), a.Z.extend(a.Z, { isTouchEvent: function(N) {
    return a.Z.exists(N[a.Z.touchProperty]);
  }, isPointerEvent: function(N) {
    return a.Z.exists(N.pointerId);
  }, isMouseEvent: function(N) {
    return !a.Z.isTouchEvent(N) && !a.Z.isPointerEvent(N);
  }, getNumberOfTouchPoints: function(N) {
    var A = -1;
    return a.Z.isTouchEvent(N) && (A = N[a.Z.touchProperty].length), A;
  }, isFirstTouch: function(N) {
    var A = a.Z.getNumberOfTouchPoints(N);
    return a.Z.isPointerEvent(N) ? N.isPrimary : A === 1;
  }, isBrowser: typeof window == "object" && typeof document == "object", supportsES6: function() {
    try {
      return new Function("(a = 0) => a"), !0;
    } catch {
      return !1;
    }
  }, supportsVML: function() {
    return this.isBrowser && !!document.namespaces;
  }, supportsSVG: function() {
    return !!this.isBrowser && !!document.createElementNS && !!document.createElementNS("http://www.w3.org/2000/svg", "svg").createSVGRect;
  }, supportsCanvas: function() {
    var N = !1;
    return this.isNode() && (N = !0), N || this.isBrowser && !!document.createElement("canvas").getContext;
  }, isNode: function() {
    return !this.isBrowser && typeof process < "u" && process.release.name.search(/node|io.js/) !== -1;
  }, isWebWorker: function() {
    return !this.isBrowser && typeof self == "object" && typeof self.postMessage == "function";
  }, supportsPointerEvents: function() {
    return !!(this.isBrowser && window.navigator && (window.PointerEvent || window.navigator.pointerEnabled || window.navigator.msPointerEnabled));
  }, isTouchDevice: function() {
    return this.isBrowser && window.ontouchstart !== void 0;
  }, isAndroid: function() {
    return j.Z.exists(navigator) && navigator.userAgent.toLowerCase().indexOf("android") > -1;
  }, isWebkitAndroid: function() {
    return this.isAndroid() && navigator.userAgent.indexOf(" AppleWebKit/") > -1;
  }, isApple: function() {
    return j.Z.exists(navigator) && (navigator.userAgent.indexOf("iPad") > -1 || navigator.userAgent.indexOf("iPhone") > -1);
  }, isWebkitApple: function() {
    return this.isApple() && navigator.userAgent.search(/Mobile\/[0-9A-Za-z.]*Safari/) > -1;
  }, isMetroApp: function() {
    return typeof window == "object" && window.clientInformation && window.clientInformation.appVersion && window.clientInformation.appVersion.indexOf("MSAppHost") > -1;
  }, isMozilla: function() {
    return j.Z.exists(navigator) && navigator.userAgent.toLowerCase().indexOf("mozilla") > -1 && navigator.userAgent.toLowerCase().indexOf("apple") === -1;
  }, isFirefoxOS: function() {
    return j.Z.exists(navigator) && navigator.userAgent.toLowerCase().indexOf("android") === -1 && navigator.userAgent.toLowerCase().indexOf("apple") === -1 && navigator.userAgent.toLowerCase().indexOf("mobile") > -1 && navigator.userAgent.toLowerCase().indexOf("mozilla") > -1;
  }, ieVersion: function() {
    var N, A, E = 3;
    if (typeof document != "object")
      return 0;
    A = (N = document.createElement("div")).getElementsByTagName("i");
    do
      N.innerHTML = "<!--[if gt IE " + ++E + "]><i></i><![endif]-->";
    while (A[0]);
    return E > 4 ? E : void 0;
  }(), getDimensions: function(N, A) {
    var E, c, b, m, _, f, g, C, P, w = /\d+(\.\d*)?px/;
    if (!this.isBrowser || N === null)
      return { width: 500, height: 500 };
    if (E = (A = A || document).getElementById(N), !j.Z.exists(E))
      throw new Error(`
JSXGraph: HTML container element '` + N + "' not found.");
    return (c = E.style.display) !== "none" && c !== null ? E.clientWidth > 0 && E.clientHeight > 0 ? { width: E.clientWidth, height: E.clientHeight } : (P = window.getComputedStyle ? window.getComputedStyle(E) : E.style, { width: w.test(P.width) ? parseFloat(P.width) : 0, height: w.test(P.height) ? parseFloat(P.height) : 0 }) : (m = (b = E.style).visibility, _ = b.position, f = b.display, b.visibility = "hidden", b.position = "absolute", b.display = "block", g = E.clientWidth, C = E.clientHeight, b.display = f, b.position = _, b.visibility = m, { width: g, height: C });
  }, addEvent: function(N, A, E, c, b) {
    var m = function() {
      return E.apply(c, arguments);
    };
    m.origin = E, typeof c == "object" && j.Z.exists(c.BOARD_MODE_NONE) && (c["x_internal" + A] = c["x_internal" + A] || [], c["x_internal" + A].push(m)), j.Z.exists(N) && j.Z.exists(N.addEventListener) && (b = b || !1, N.addEventListener(A, m, b)), j.Z.exists(N) && j.Z.exists(N.attachEvent) && N.attachEvent("on" + A, m);
  }, removeEvent: function(N, A, E, c) {
    var b;
    if (j.Z.exists(c))
      if (j.Z.exists(c["x_internal" + A]))
        if (j.Z.isArray(c["x_internal" + A]))
          if ((b = j.Z.indexOf(c["x_internal" + A], E, "origin")) !== -1) {
            try {
              j.Z.exists(N) && j.Z.exists(N.removeEventListener) && N.removeEventListener(A, c["x_internal" + A][b], !1), j.Z.exists(N) && j.Z.exists(N.detachEvent) && N.detachEvent("on" + A, c["x_internal" + A][b]);
            } catch {
              a.Z.debug("event not registered in browser: (" + A + " -- " + E + ")");
            }
            c["x_internal" + A].splice(b, 1);
          } else
            a.Z.debug("removeEvent: no such event function in internal list: " + E);
        else
          a.Z.debug("owner[x_internal + " + A + "] is not an array");
      else
        a.Z.debug("no such type: " + A);
    else
      a.Z.debug("no such owner");
  }, removeAllEvents: function(N, A, E) {
    var c;
    if (E["x_internal" + A]) {
      for (c = E["x_internal" + A].length - 1; c >= 0; c--)
        a.Z.removeEvent(N, A, E["x_internal" + A][c].origin, E);
      E["x_internal" + A].length > 0 && a.Z.debug("removeAllEvents: Not all events could be removed.");
    }
  }, getPosition: function(N, A, E) {
    var c, b, m, _ = 0, f = 0;
    if (N || (N = window.event), m = N[a.Z.touchProperty], j.Z.exists(m) && m.length === 0 && (m = N.changedTouches), j.Z.exists(A) && j.Z.exists(m))
      if (A === -1) {
        for (b = m.length, c = 0; c < b; c++)
          if (m[c]) {
            N = m[c];
            break;
          }
      } else
        N = m[A];
    return N.clientX && (_ = N.clientX, f = N.clientY), [_, f];
  }, getOffset: function(N) {
    var A, E = N, c = N, b = E.offsetLeft - E.scrollLeft, m = E.offsetTop - E.scrollTop;
    for (b = (A = this.getCSSTransform([b, m], E))[0], m = A[1], E = E.offsetParent; E; ) {
      for (b += E.offsetLeft, m += E.offsetTop, E.offsetParent && (b += E.clientLeft - E.scrollLeft, m += E.clientTop - E.scrollTop), b = (A = this.getCSSTransform([b, m], E))[0], m = A[1], c = c.parentNode; c !== E; )
        b += c.clientLeft - c.scrollLeft, m += c.clientTop - c.scrollTop, b = (A = this.getCSSTransform([b, m], c))[0], m = A[1], c = c.parentNode;
      E = E.offsetParent;
    }
    return [b, m];
  }, getStyle: function(N, A) {
    var E, c = N.ownerDocument;
    return c.defaultView && c.defaultView.getComputedStyle ? E = c.defaultView.getComputedStyle(N, null).getPropertyValue(A) : N.currentStyle && a.Z.ieVersion >= 9 ? E = N.currentStyle[A] : N.style && (A = A.replace(/-([a-z]|[0-9])/gi, function(b, m) {
      return m.toUpperCase();
    }), E = N.style[A]), E;
  }, getProp: function(N, A) {
    var E = parseInt(this.getStyle(N, A), 10);
    return isNaN(E) ? 0 : E;
  }, getCSSTransform: function(N, A) {
    var E, c, b, m, _, f, g, C = ["transform", "webkitTransform", "MozTransform", "msTransform", "oTransform"];
    for (_ = C.length, E = 0, b = ""; E < _; E++)
      if (j.Z.exists(A.style[C[E]])) {
        b = A.style[C[E]];
        break;
      }
    if (b !== "" && (m = b.indexOf("(")) > 0) {
      for (_ = b.length, c = 0, f = (g = b.substring(m + 1, _ - 1).split(",")).length; c < f; c++)
        g[c] = parseFloat(g[c]);
      b.indexOf("matrix") === 0 ? (N[0] += g[4], N[1] += g[5]) : b.indexOf("translateX") === 0 ? N[0] += g[0] : b.indexOf("translateY") === 0 ? N[1] += g[0] : b.indexOf("translate") === 0 && (N[0] += g[0], N[1] += g[1]);
    }
    return j.Z.exists(A.style.zoom) && (b = A.style.zoom) !== "" && (N[0] *= parseFloat(b), N[1] *= parseFloat(b)), N;
  }, getCSSTransformMatrix: function(N) {
    var A, E, c, b, m, _, f, g, C = N.ownerDocument, P = ["transform", "webkitTransform", "MozTransform", "msTransform", "oTransform"], w = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
    if (C.defaultView && C.defaultView.getComputedStyle)
      c = (g = C.defaultView.getComputedStyle(N, null)).getPropertyValue("-webkit-transform") || g.getPropertyValue("-moz-transform") || g.getPropertyValue("-ms-transform") || g.getPropertyValue("-o-transform") || g.getPropertyValue("transform");
    else
      for (m = P.length, A = 0, c = ""; A < m; A++)
        if (j.Z.exists(N.style[P[A]])) {
          c = N.style[P[A]];
          break;
        }
    if (c !== "" && (b = c.indexOf("(")) > 0) {
      for (m = c.length, E = 0, _ = (f = c.substring(b + 1, m - 1).split(",")).length; E < _; E++)
        f[E] = parseFloat(f[E]);
      c.indexOf("matrix") === 0 ? w = [[1, 0, 0], [0, f[0], f[1]], [0, f[2], f[3]]] : c.indexOf("scaleX") === 0 ? w[1][1] = f[0] : c.indexOf("scaleY") === 0 ? w[2][2] = f[0] : c.indexOf("scale") === 0 && (w[1][1] = f[0], w[2][2] = f[1]);
    }
    return j.Z.exists(N.style.zoom) && (c = N.style.zoom) !== "" && (w[1][1] *= parseFloat(c), w[2][2] *= parseFloat(c)), w;
  }, timedChunk: function(N, A, E, c) {
    var b = N.concat(), m = function() {
      var _ = +/* @__PURE__ */ new Date();
      do
        A.call(E, b.shift());
      while (b.length > 0 && +/* @__PURE__ */ new Date() - _ < 300);
      b.length > 0 ? window.setTimeout(m, 1) : c(N);
    };
    window.setTimeout(m, 1);
  }, scaleJSXGraphDiv: function(N, A, E, c) {
    var b, m, _, f, g, C, P, w, T, D, I, Y = E.styleSheets.length, U = c, J = [":fullscreen", ":-webkit-full-screen", ":-moz-full-screen", ":-ms-fullscreen"], z = J.length, V = new RegExp(".*#" + N + ":.*full.*screen.*#" + A + ".*auto;.*transform:.*matrix");
    for (f = (g = E.getElementById(N).getBoundingClientRect()).height, _ = g.width, P = (w = E.getElementById(A).getBoundingClientRect()).height, D = "{margin:0 auto;transform:matrix(" + (T = (C = w.width) / P >= _ / f ? U * _ / C : U * f / P) + ",0,0," + T + ",0," + 0.5 * (f - P) + ");}", Y === 0 && ((b = document.createElement("style")).appendChild(document.createTextNode("")), E.appendChild(b), Y = E.styleSheets.length), E.styleSheets[Y - 1].cssRules.length > 0 && V.test(E.styleSheets[Y - 1].cssRules[0].cssText) && E.styleSheets[Y - 1].deleteRule && E.styleSheets[Y - 1].deleteRule(0), I = 0; I < z; I++)
      try {
        m = "#" + N + J[I] + " #" + A + D, E.styleSheets[Y - 1].insertRule(m, 0);
        break;
      } catch {
      }
    I === z && (console.log("JXG.scaleJSXGraphDiv: Could not add any CSS rule."), console.log("One possible reason could be that the id of the JSXGraph container does not start with a letter."));
  } });
  const k = a.Z;
}, 88: (d, M, x) => {
  x.d(M, { Z: () => k });
  var a = x(765), j = x(109);
  a.Z.EventEmitter = { eventHandlers: {}, suspended: {}, trigger: function(N, A) {
    var E, c, b, m, _, f;
    for (_ = N.length, c = 0; c < _; c++)
      if (m = this.eventHandlers[N[c]], !this.suspended[N[c]]) {
        if (this.suspended[N[c]] = !0, m)
          for (f = m.length, E = 0; E < f; E++)
            (b = m[E]).handler.apply(b.context, A);
        this.suspended[N[c]] = !1;
      }
    return this;
  }, on: function(N, A, E) {
    return j.Z.isArray(this.eventHandlers[N]) || (this.eventHandlers[N] = []), E = j.Z.def(E, this), this.eventHandlers[N].push({ handler: A, context: E }), this;
  }, off: function(N, A) {
    var E;
    return N && j.Z.isArray(this.eventHandlers[N]) ? (A ? ((E = j.Z.indexOf(this.eventHandlers[N], A, "handler")) > -1 && this.eventHandlers[N].splice(E, 1), this.eventHandlers[N].length === 0 && delete this.eventHandlers[N]) : delete this.eventHandlers[N], this) : this;
  }, eventify: function(N) {
    N.eventHandlers = {}, N.on = this.on, N.off = this.off, N.triggerEventHandlers = this.trigger, N.trigger = this.trigger, N.suspended = {};
  } };
  const k = a.Z.EventEmitter;
}, 421: (d, M, x) => {
  x.d(M, { Z: () => E });
  var a = x(765), j = x(109), k = x(351), N = x(705), A = { each: function(c, b, m) {
    var _, f, g = [];
    if (j.Z.exists(c.length))
      for (f = c.length, _ = 0; _ < f; _++)
        g.push(b.call(this, c[_], m));
    return g;
  }, coords: function(c, b) {
    var m = c;
    return c && c.elementClass === k.Z.OBJECT_CLASS_POINT ? m = c.coords : c.usrCoords && c.scrCoords && c.usr2screen && (m = c), b && (m = new N.Z(k.Z.COORDS_BY_USER, m.usrCoords, m.board)), m;
  }, coordsArray: function(c, b) {
    var m;
    return (m = j.Z.isArray(c) ? c : this.coords(c).usrCoords).length < 3 && m.unshift(1), b && (m = [m[0], m[1], m[2]]), m;
  } };
  a.Z.Expect = A;
  const E = A;
}, 109: (d, M, x) => {
  x.d(M, { Z: () => k });
  var a = x(765), j = x(351);
  a.Z.extend(a.Z, { isId: function(N, A) {
    return typeof A == "string" && !!N.objects[A];
  }, isName: function(N, A) {
    return typeof A == "string" && !!N.elementsByName[A];
  }, isGroup: function(N, A) {
    return typeof A == "string" && !!N.groups[A];
  }, isString: function(N) {
    return typeof N == "string";
  }, isNumber: function(N) {
    return typeof N == "number" || Object.prototype.toString.call(N) === "[Object Number]";
  }, isFunction: function(N) {
    return typeof N == "function";
  }, isArray: function(N) {
    return Array.isArray ? Array.isArray(N) : N !== null && typeof N == "object" && typeof N.splice == "function" && typeof N.join == "function";
  }, isObject: function(N) {
    return typeof N == "object" && !this.isArray(N);
  }, isDocumentOrFragment: function(N) {
    return this.isObject(N) && (N.nodeType === 9 || N.nodeType === 11);
  }, isPoint: function(N) {
    return !(N === null || typeof N != "object" || !this.exists(N.elementClass)) && N.elementClass === j.Z.OBJECT_CLASS_POINT;
  }, isPoint3D: function(N) {
    return !(N === null || typeof N != "object" || !this.exists(N.elType)) && N.elType === "point3d";
  }, isPointType: function(N, A) {
    var E, c;
    return !!this.isArray(A) || !!(this.isFunction(A) && (E = A(), this.isArray(E) && E.length > 1)) || (c = N.select(A), this.isPoint(c));
  }, isTransformationOrArray: function(N) {
    if (N !== null) {
      if (this.isArray(N) && N.length > 0)
        return this.isTransformationOrArray(N[0]);
      if (typeof N == "object")
        return N.type === j.Z.OBJECT_TYPE_TRANSFORMATION;
    }
    return !1;
  }, isEmpty: function(N) {
    return Object.keys(N).length === 0;
  }, exists: function(N, A) {
    var E = !(N == null || N === null);
    return (A = A || !1) ? E && N !== "" : E;
  }, def: function(N, A) {
    return this.exists(N) ? N : A;
  }, str2Bool: function(N) {
    return !this.exists(N) || (typeof N == "boolean" ? N : !!this.isString(N) && N.toLowerCase() === "true");
  }, createEvalFunction: function(N, A, E) {
    var c, b, m, _ = [], f = {};
    for (b = 0; b < E; b++)
      for (m in _[b] = a.Z.createFunction(A[b], N, "", !0), _[b].deps)
        f[m] = _[b].deps;
    return (c = function(g) {
      return _[g]();
    }).deps = f, c;
  }, createFunction: function(N, A, E, c) {
    var b = null;
    return this.exists(c) && !c || !this.isString(N) ? this.isFunction(N) ? (b = N).deps = {} : (this.isNumber(N) || this.isString(N)) && ((b = function() {
      return N;
    }).deps = {}) : b = A.jc.snippet(N, !0, E, !0), b !== null && (b.origin = N), b;
  }, providePoints: function(N, A, E, c, b) {
    var m, _, f, g, C, P = 0, w = [];
    for (this.isArray(A) || (A = [A]), f = A.length, this.exists(b) && (P = b.length), P === 0 && (g = this.copyAttributes(E, N.options, c)), m = 0; m < f; ++m)
      if (P > 0 && (_ = Math.min(m, P - 1), g = this.copyAttributes(E, N.options, c, b[_])), this.isArray(A[m]) && A[m].length > 1 ? (w.push(N.create("point", A[m], g)), w[w.length - 1]._is_new = !0) : this.isFunction(A[m]) ? (C = A[m](), this.isArray(C) && C.length > 1 && (w.push(N.create("point", [A[m]], g)), w[w.length - 1]._is_new = !0)) : w.push(N.select(A[m])), !this.isPoint(w[m]))
        return !1;
    return w;
  }, providePoints3D: function(N, A, E, c, b) {
    var m, _, f, g, C, P = 0, w = [];
    for (this.isArray(A) || (A = [A]), f = A.length, this.exists(b) && (P = b.length), P === 0 && (g = this.copyAttributes(E, N.board.options, c)), m = 0; m < f; ++m)
      if (P > 0 && (_ = Math.min(m, P - 1), g = this.copyAttributes(E, N.board.options, c, b[_])), this.isArray(A[m]) && A[m].length > 1 ? (w.push(N.create("point3d", A[m], g)), w[w.length - 1]._is_new = !0) : this.isFunction(A[m]) ? (C = A[m](), this.isArray(C) && C.length > 1 && (w.push(N.create("point3d", [A[m]], g)), w[w.length - 1]._is_new = !0)) : w.push(N.select(A[m])), !this.isPoint3D(w[m]))
        return !1;
    return w;
  }, bind: function(N, A) {
    return function() {
      return N.apply(A, arguments);
    };
  }, evaluate: function(N) {
    return this.isFunction(N) ? N() : N;
  }, indexOf: function(N, A, E) {
    var c, b = this.exists(E);
    if (Array.indexOf && !b)
      return N.indexOf(A);
    for (c = 0; c < N.length; c++)
      if (b && N[c][E] === A || !b && N[c] === A)
        return c;
    return -1;
  }, eliminateDuplicates: function(N) {
    var A, E = N.length, c = [], b = {};
    for (A = 0; A < E; A++)
      b[N[A]] = 0;
    for (A in b)
      b.hasOwnProperty(A) && c.push(A);
    return c;
  }, swap: function(N, A, E) {
    var c;
    return c = N[A], N[A] = N[E], N[E] = c, N;
  }, uniqueArray: function(N) {
    var A, E, c, b = [];
    if (N.length === 0)
      return [];
    for (A = 0; A < N.length; A++)
      if (c = this.isArray(N[A]), this.exists(N[A]))
        for (E = A + 1; E < N.length; E++)
          c && a.Z.cmpArrays(N[A], N[E]) ? N[A] = [] : c || N[A] !== N[E] || (N[A] = "");
      else
        N[A] = "";
    for (E = 0, A = 0; A < N.length; A++)
      (c = this.isArray(N[A])) || N[A] === "" ? c && N[A].length !== 0 && (b[E] = N[A].slice(0), E++) : (b[E] = N[A], E++);
    return N = b, b;
  }, isInArray: function(N, A) {
    return a.Z.indexOf(N, A) > -1;
  }, coordsArrayToMatrix: function(N, A) {
    var E, c = [], b = [];
    for (E = 0; E < N.length; E++)
      A ? (c.push(N[E].usrCoords[1]), b.push(N[E].usrCoords[2])) : b.push([N[E].usrCoords[1], N[E].usrCoords[2]]);
    return A && (b = [c, b]), b;
  }, cmpArrays: function(N, A) {
    var E;
    if (N === A)
      return !0;
    if (N.length !== A.length)
      return !1;
    for (E = 0; E < N.length; E++)
      if (this.isArray(N[E]) && this.isArray(A[E])) {
        if (!this.cmpArrays(N[E], A[E]))
          return !1;
      } else if (N[E] !== A[E])
        return !1;
    return !0;
  }, removeElementFromArray: function(N, A) {
    var E;
    for (E = 0; E < N.length; E++)
      if (N[E] === A)
        return N.splice(E, 1), N;
    return N;
  }, trunc: function(N, A) {
    return A = a.Z.def(A, 0), this.toFixed(N, A);
  }, _decimalAdjust: function(N, A, E) {
    return E === void 0 || +E == 0 ? Math[N](A) : (A = +A, E = +E, isNaN(A) || typeof E != "number" || E % 1 != 0 ? NaN : (A = A.toString().split("e"), +((A = (A = Math[N](+(A[0] + "e" + (A[1] ? +A[1] - E : -E)))).toString().split("e"))[0] + "e" + (A[1] ? +A[1] + E : E))));
  }, _round10: function(N, A) {
    return this._decimalAdjust("round", N, A);
  }, _floor10: function(N, A) {
    return this._decimalAdjust("floor", N, A);
  }, _ceil10: function(N, A) {
    return this._decimalAdjust("ceil", N, A);
  }, toFixed: function(N, A) {
    return this._round10(N, -A).toFixed(A);
  }, autoDigits: function(N) {
    var A = Math.abs(N);
    return A >= 0.1 ? this.toFixed(N, 2) : A >= 0.01 ? this.toFixed(N, 4) : A >= 1e-4 ? this.toFixed(N, 6) : N;
  }, keys: function(N, A) {
    var E, c = [];
    for (E in N)
      A ? N.hasOwnProperty(E) && c.push(E) : c.push(E);
    return c;
  }, clone: function(N) {
    var A = {};
    return A.prototype = N, A;
  }, cloneAndCopy: function(N, A) {
    var E, c = function() {
    };
    for (E in c.prototype = N, A)
      c[E] = A[E];
    return c;
  }, merge: function(N, A) {
    var E, c, b, m;
    for (E in A)
      if (A.hasOwnProperty(E))
        if (b = A[E], this.isArray(b))
          for (N[E] || (N[E] = []), c = 0; c < b.length; c++)
            m = A[E][c], typeof A[E][c] == "object" ? N[E][c] = this.merge(N[E][c], m) : N[E][c] = A[E][c];
        else
          typeof b == "object" ? (N[E] || (N[E] = {}), N[E] = this.merge(N[E], b)) : N[E] = b;
    return N;
  }, deepCopy: function(N, A, E) {
    var c, b, m, _;
    if (E = E || !1, typeof N != "object" || N === null)
      return N;
    if (this.isArray(N))
      for (c = [], b = 0; b < N.length; b++)
        typeof (m = N[b]) == "object" ? this.exists(m.board) ? c[b] = m.id : c[b] = this.deepCopy(m) : c[b] = m;
    else {
      for (b in c = {}, N)
        N.hasOwnProperty(b) && (_ = E ? b.toLowerCase() : b, (m = N[b]) !== null && typeof m == "object" ? this.exists(m.board) ? c[_] = m.id : c[_] = this.deepCopy(m) : c[_] = m);
      for (b in A)
        A.hasOwnProperty(b) && (_ = E ? b.toLowerCase() : b, typeof (m = A[b]) == "object" ? this.isArray(m) || !this.exists(c[_]) ? c[_] = this.deepCopy(m) : c[_] = this.deepCopy(c[_], m, E) : c[_] = m);
    }
    return c;
  }, mergeAttr: function(N, A, E) {
    var c, b, m;
    for (c in E = E || !0, A)
      A.hasOwnProperty(c) && (b = E ? c.toLowerCase() : c, m = A[c], !this.isObject(m) || m === null || this.isDocumentOrFragment(m) || this.exists(m.board) || typeof m.valueOf() == "string" ? N[b] = m : (N[b] !== void 0 && N[b] !== null && this.isObject(N[b]) || (N[b] = {}), this.mergeAttr(N[b], m, E)));
  }, copyAttributes: function(N, A, E) {
    var c, b, m, _, f, g = { circle: 1, curve: 1, foreignobject: 1, image: 1, line: 1, point: 1, polygon: 1, text: 1, ticks: 1, integral: 1 };
    for (c = (m = arguments.length) < 3 || g[E] ? a.Z.deepCopy(A.elements, null, !0) : {}, m < 4 && this.exists(E) && this.exists(A.layer[E]) && (c.layer = A.layer[E]), _ = A, f = !0, b = 2; b < m; b++) {
      if (!this.exists(_[arguments[b]])) {
        f = !1;
        break;
      }
      _ = _[arguments[b]];
    }
    for (f && (c = a.Z.deepCopy(c, _, !0)), _ = typeof N == "object" ? N : {}, f = !0, b = 3; b < m; b++) {
      if (!this.exists(_[arguments[b]])) {
        f = !1;
        break;
      }
      _ = _[arguments[b]];
    }
    if (f && this.mergeAttr(c, _, !0), arguments[2] === "board")
      return c;
    for (_ = A, f = !0, b = 2; b < m; b++) {
      if (!this.exists(_[arguments[b]])) {
        f = !1;
        break;
      }
      _ = _[arguments[b]];
    }
    return f && this.exists(_.label) && (c.label = a.Z.deepCopy(_.label, c.label)), c.label = a.Z.deepCopy(A.label, c.label), c;
  }, copyPrototypeMethods: function(N, A, E) {
    var c;
    for (c in N.prototype[E] = A.prototype.constructor, A.prototype)
      A.prototype.hasOwnProperty(c) && (N.prototype[c] = A.prototype[c]);
  }, toJSON: function(N, A) {
    var E, c, b, m;
    if (A = a.Z.def(A, !1), JSON.stringify && !A)
      try {
        return JSON.stringify(N);
      } catch {
      }
    switch (typeof N) {
      case "object":
        if (N) {
          if (E = [], this.isArray(N)) {
            for (b = 0; b < N.length; b++)
              E.push(a.Z.toJSON(N[b], A));
            return "[" + E.join(",") + "]";
          }
          for (c in N)
            if (N.hasOwnProperty(c)) {
              try {
                m = a.Z.toJSON(N[c], A);
              } catch {
                m = "";
              }
              A ? E.push(c + ":" + m) : E.push('"' + c + '":' + m);
            }
          return "{" + E.join(",") + "} ";
        }
        return "null";
      case "string":
        return "'" + N.replace(/(["'])/g, "\\$1") + "'";
      case "number":
      case "boolean":
        return N.toString();
    }
    return "0";
  }, clearVisPropOld: function(N) {
    return N.visPropOld = { cssclass: "", cssdefaultstyle: "", cssstyle: "", fillcolor: "", fillopacity: "", firstarrow: !1, fontsize: -1, lastarrow: !1, left: -1e5, linecap: "", shadow: !1, strokecolor: "", strokeopacity: "", strokewidth: "", tabindex: -1e5, transitionduration: 0, top: -1e5, visible: null }, N;
  }, isInObject: function(N, A) {
    var E;
    for (E in N)
      if (N.hasOwnProperty(E) && N[E] === A)
        return !0;
    return !1;
  }, escapeHTML: function(N) {
    return N.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }, unescapeHTML: function(N) {
    return N.replace(/<\/?[^>]+>/gi, "").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
  }, capitalize: function(N) {
    return N.charAt(0).toUpperCase() + N.substring(1).toLowerCase();
  }, trimNumber: function(N) {
    return (N = (N = N.replace(/^0+/, "")).replace(/0+$/, ""))[N.length - 1] !== "." && N[N.length - 1] !== "," || (N = N.slice(0, -1)), N[0] !== "." && N[0] !== "," || (N = "0" + N), N;
  }, filterElements: function(N, A) {
    var E, c, b, m, _, f, g, C = N.length, P = [];
    if (typeof A != "function" && typeof A != "object")
      return P;
    for (E = 0; E < C; E++) {
      if (g = !0, b = N[E], typeof A == "object") {
        for (c in A)
          if (A.hasOwnProperty(c) && (m = c.toLowerCase(), _ = typeof b[c] == "function" ? b[c]() : b[c], f = b.visProp && typeof b.visProp[m] == "function" ? b.visProp[m]() : b.visProp && b.visProp[m], !(g = typeof A[c] == "function" ? A[c](_) || A[c](f) : _ === A[c] || f === A[c])))
            break;
      } else
        typeof A == "function" && (g = A(b));
      g && P.push(b);
    }
    return P;
  }, trim: function(N) {
    return N.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
  }, sanitizeHTML: function(N, A) {
    return typeof html_sanitize == "function" && A ? html_sanitize(N, function() {
    }, function(E) {
      return E;
    }) : (N && typeof N == "string" && (N = N.replace(/</g, "&lt;").replace(/>/g, "&gt;")), N);
  }, evalSlider: function(N) {
    return N && N.type === j.Z.OBJECT_TYPE_GLIDER && typeof N.Value == "function" ? N.Value() : N;
  } });
  const k = a.Z;
} }, __webpack_module_cache__ = {};
function __webpack_require__(d) {
  var M = __webpack_module_cache__[d];
  if (M !== void 0)
    return M.exports;
  var x = __webpack_module_cache__[d] = { exports: {} };
  return __webpack_modules__[d](x, x.exports, __webpack_require__), x.exports;
}
__webpack_require__.d = (d, M) => {
  for (var x in M)
    __webpack_require__.o(M, x) && !__webpack_require__.o(d, x) && Object.defineProperty(d, x, { enumerable: !0, get: M[x] });
}, __webpack_require__.o = (d, M) => Object.prototype.hasOwnProperty.call(d, M);
var __webpack_exports__ = {};
(() => {
  __webpack_require__.d(__webpack_exports__, { $l: () => xt, fy: () => Et, JU: () => Rt, kL: () => ze, Cd: () => Ze, Zz: () => Te, fS: () => Xe, mZ: () => Me, L6: () => le, Hy: () => ve, iG: () => Dt, QK: () => ie, ZA: () => It, Ee: () => Gt, Nn: () => Lt, n1: () => zt, IY: () => Tt, x1: () => Yt, ZX: () => kt, Ei: () => Bt, E9: () => Ht, mg: () => Ke, xv: () => ct, vb: () => St, zA: () => wt, l8: () => Wt, nY: () => st, vP: () => dt, lZ: () => ot, I0: () => jt, ak: () => bt, tj: () => Ot, kC: () => lt, HM: () => Xt, d9: () => vt, V$: () => Vt, DV: () => pt, fG: () => Ut, DM: () => gt, OD: () => Kt, o5: () => Qt, JI: () => ei, fF: () => ti, Ql: () => ii, yl: () => si, lU: () => ri, p$: () => oi, Nj: () => ni, ZP: () => Es, x9: () => ai, Rm: () => Oe, XH: () => hi, r: () => li, Lw: () => ci, ku: () => di, a2: () => ui, vn: () => pi, wx: () => _i, zL: () => fi, t_: () => gi, os: () => mi, bt: () => bi, WJ: () => vi, wK: () => Zi, XG: () => Ci, Dt: () => yi, mL: () => Pi, kJ: () => Ei, dB: () => Oi, oG: () => xi, EE: () => Si, oP: () => wi, K9: () => Ti, UG: () => Mi, hj: () => Ni, Kn: () => Ai, EJ: () => Ri, HD: () => Di, b1: () => Li, iI: () => ki, n2: () => Bi, E: () => Ii, Ju: () => Yi, XP: () => ji, TS: () => Xi, ZL: () => Ui, DG: () => xe, od: () => Jt, bU: () => Fi, ui: () => Ji, yt: () => Gi, aC: () => zi, sL: () => Hi, xC: () => Wi, OK: () => Vi, OW: () => $i, KJ: () => qi, dq: () => Ki, CO: () => Qi, tu: () => es, KW: () => ss, uh: () => is, cE: () => ts, jW: () => rs, Xl: () => os, uw: () => ns, Fm: () => as, kK: () => hs, n: () => ls, SJ: () => cs, LF: () => ds, J6: () => us, FH: () => ps, Ls: () => fs, au: () => _s, A8: () => gs, _V: () => ms, $G: () => bs, Uo: () => vs, Nb: () => Zs, zz: () => Cs, W6: () => ys, ZK: () => Ps });
  var d = __webpack_require__(765), M = __webpack_require__(503), x = __webpack_require__(351), a = __webpack_require__(109);
  d.Z.XML = { cleanWhitespace: function(e) {
    for (var t = e.firstChild; a.Z.exists(t); )
      t.nodeType !== 3 || /\S/.test(t.nodeValue) ? t.nodeType === 1 && this.cleanWhitespace(t) : e.removeChild(t), t = t.nextSibling;
  }, parse: function(e) {
    var t, o;
    return o = typeof DOMParser == "function" || typeof DOMParser == "object" ? DOMParser : function() {
      this.parseFromString = function(s) {
        var n;
        return typeof ActiveXObject == "function" && (n = new ActiveXObject("MSXML.DomDocument")).loadXML(s), n;
      };
    }, t = new o().parseFromString(e, "text/xml"), this.cleanWhitespace(t), t;
  } }, d.Z.XML;
  var j = __webpack_require__(88), k = (__webpack_require__(421), __webpack_require__(275));
  k.Z.ProbFuncs = { MAXNUM: 17014118346046923e22, SQRTH: 0.7071067811865476, SQRT2: 1.4142135623730951, MAXLOG: 708.3964185322641, P: [2461969814735305e-25, 0.5641895648310689, 7.463210564422699, 48.63719709856814, 196.5208329560771, 526.4451949954773, 934.5285271719576, 1027.5518868951572, 557.5353353693994], Q: [13.228195115474499, 86.70721408859897, 354.9377788878199, 975.7085017432055, 1823.9091668790973, 2246.3376081871097, 1656.6630919416134, 557.5353408177277], R: [0.5641895835477551, 1.275366707599781, 5.019050422511805, 6.160210979930536, 7.4097426995044895, 2.9788666537210022], S: [2.2605286322011726, 9.396035249380015, 12.048953980809666, 17.08144507475659, 9.608968090632859, 3.369076451000815], T: [9.604973739870516, 90.02601972038427, 2232.005345946843, 7003.325141128051, 55592.30130103949], U: [33.56171416475031, 521.3579497801527, 4594.323829709801, 22629.000061389095, 49267.39426086359], M: 128, MINV: 78125e-7, expx2: function(e, t) {
    var o, s, n, h;
    return e = Math.abs(e), t < 0 && (e = -e), o = (n = this.MINV * Math.floor(this.M * e + 0.5)) * n, s = 2 * n * (h = e - n) + h * h, t < 0 && (o = -o, s = -s), o + s > this.MAXLOG ? 1 / 0 : o = Math.exp(o) * Math.exp(s);
  }, polevl: function(e, t, o) {
    var s, n;
    if (a.Z.exists(t.reduce))
      return t.reduce(function(h, l) {
        return h * e + l;
      }, 0);
    for (n = 0, s = 0; n <= o; n++)
      s = s * e + t[n];
    return s;
  }, p1evl: function(e, t, o) {
    var s, n;
    if (a.Z.exists(t.reduce))
      return t.reduce(function(h, l) {
        return h * e + l;
      }, 1);
    for (n = 0, s = 1; n < o; n++)
      s = s * e + t[n];
    return s;
  }, ndtr: function(e) {
    var t, o, s;
    return t = e * this.SQRTH, (s = Math.abs(t)) < 1 ? o = 0.5 + 0.5 * this.erf(t) : (o = 0.5 * this.erfce(s), s = this.expx2(e, -1), o *= Math.sqrt(s), t > 0 && (o = 1 - o)), o;
  }, _underflow: function(e) {
    return console.log("erfc", "UNDERFLOW"), e < 0 ? 2 : 0;
  }, erfc: function(e) {
    var t, o, s, n, h;
    return (s = e < 0 ? -e : e) < 1 ? 1 - this.erf(e) : (h = -e * e) < -this.MAXLOG ? this._underflow(e) : (h = this.expx2(e, -1), s < 8 ? (t = this.polevl(s, this.P, 8), o = this.p1evl(s, this.Q, 8)) : (t = this.polevl(s, this.R, 5), o = this.p1evl(s, this.S, 6)), n = h * t / o, e < 0 && (n = 2 - n), n === 0 ? this._underflow(e) : n);
  }, erfce: function(e) {
    var t, o;
    return e < 8 ? (t = this.polevl(e, this.P, 8), o = this.p1evl(e, this.Q, 8)) : (t = this.polevl(e, this.R, 5), o = this.p1evl(e, this.S, 6)), t / o;
  }, erf: function(e) {
    var t;
    return Math.abs(e) > 1 ? 1 - this.erfc(e) : (t = e * e, e * this.polevl(t, this.T, 4) / this.p1evl(t, this.U, 5));
  }, s2pi: 2.5066282746310007, P0: [-59.96335010141079, 98.00107541859997, -56.67628574690703, 13.931260938727968, -1.2391658386738125], Q0: [1.9544885833814176, 4.676279128988815, 86.36024213908905, -225.46268785411937, 200.26021238006066, -82.03722561683334, 15.90562251262117, -1.1833162112133], P1: [4.0554489230596245, 31.525109459989388, 57.16281922464213, 44.08050738932008, 14.684956192885803, 2.1866330685079025, -0.1402560791713545, -0.03504246268278482, -8574567851546854e-19], Q1: [15.779988325646675, 45.39076351288792, 41.3172038254672, 15.04253856929075, 2.504649462083094, -0.14218292285478779, -0.03808064076915783, -9332594808954574e-19], P2: [3.2377489177694603, 6.915228890689842, 3.9388102529247444, 1.3330346081580755, 0.20148538954917908, 0.012371663481782003, 30158155350823543e-20, 26580697468673755e-22, 6239745391849833e-24], Q2: [6.02427039364742, 3.6798356385616087, 1.3770209948908132, 0.21623699359449663, 0.013420400608854318, 32801446468212774e-20, 28924786474538068e-22, 6790194080099813e-24], ndtri: function(e) {
    var t, o, s, n, h;
    return e <= 0 ? -1 / 0 : e >= 1 ? 1 / 0 : (h = 1, (o = e) > 0.8646647167633873 && (o = 1 - o, h = 0), o > 0.1353352832366127 ? (t = (o -= 0.5) + o * ((n = o * o) * this.polevl(n, this.P0, 4) / this.p1evl(n, this.Q0, 8)), t *= this.s2pi) : (s = 1 / (t = Math.sqrt(-2 * Math.log(o))), t = t - Math.log(t) / t - (t < 8 ? s * this.polevl(s, this.P1, 8) / this.p1evl(s, this.Q1, 8) : s * this.polevl(s, this.P2, 8) / this.p1evl(s, this.Q2, 8)), h !== 0 && (t = -t), t));
  }, erfi: function(e) {
    return this.ndtri(0.5 * (e + 1)) * this.SQRTH;
  } }, k.Z.ProbFuncs;
  var N = __webpack_require__(785);
  k.Z.Extrapolate = { upper: 15, infty: 1e4, wynnEps: function(e, t, o) {
    var s, n, h, l, p;
    if (o[t] = e, t === 0)
      p = e;
    else {
      for (h = 0, s = t; s > 0; s--)
        n = h, h = o[s - 1], l = o[s] - h, Math.abs(l) <= 1e-15 ? o[s - 1] = 1e20 : o[s - 1] = 1 * n + 1 / l;
      p = o[t % 2];
    }
    return p;
  }, aitken: function(e, t, o) {
    var s, n, h, l, p, u;
    if (o[t] = e, t < 2)
      s = e;
    else {
      for (l = t / 2, p = 1; p <= l; p++)
        n = o[(u = t - 2 * p) + 2] - 2 * o[u + 1] + o[u], Math.abs(n) < 1e-15 ? o[u] = 1e20 : (h = o[u] - o[u + 1], o[u] -= h * h / n);
      s = o[t % 2];
    }
    return s;
  }, brezinski: function(e, t, o) {
    var s, n, h, l, p, u, v, Z;
    if (o[t] = e, t < 3)
      s = e;
    else {
      for (u = t / 3, Z = t, v = 1; v <= u; v++)
        h = o[(Z -= 3) + 1] - o[Z], l = o[Z + 2] - o[Z + 1], n = (p = o[Z + 3] - o[Z + 2]) * (l - h) - h * (p - l), Math.abs(n) < 1e-15 ? o[Z] = 1e20 : o[Z] = o[Z + 1] - h * l * (p - l) / n;
      s = o[t % 3];
    }
    return s;
  }, iteration: function(e, t, o, s, n) {
    var h, l, p, u, v = NaN, Z = [], y = "finite", O = t;
    for (n = n || 0, h = 1; h <= this.upper; h++) {
      if (l = o(e + (O = n === 0 ? t / (h + 1) : 0.5 * O), !0), p = this[s](l, h - 1, Z), isNaN(p)) {
        y = "NaN";
        break;
      }
      if (l !== 0 && p / l > this.infty) {
        v = p, y = "infinite";
        break;
      }
      if (u = p - v, Math.abs(u) < 1e-7)
        break;
      v = p;
    }
    return [v, y, 1 - (h - 1) / this.upper];
  }, levin: function(e, t, o, s, n, h) {
    var l, p, u, v;
    if (v = 1 / (s + t), n[t] = e / o, h[t] = 1 / o, t > 0 && (n[t - 1] = n[t] - n[t - 1], h[t - 1] = h[t] - h[t - 1], t > 1))
      for (u = (s + t - 1) * v, l = 2; l <= t; l++)
        p = (s + t - l) * Math.pow(u, l - 2) * v, n[t - l] = n[t - l + 1] - p * n[t - l], h[t - l] = h[t - l + 1] - p * h[t - l], v *= u;
    return Math.abs(h[0]) < 1e-15 ? 1e20 : n[0] / h[0];
  }, iteration_levin: function(e, t, o, s) {
    var n, h, l, p, u, v, Z, y = NaN, O = [], S = [], R = "finite", L = t;
    for (s = s || 0, p = o(e + t, !0), n = 1; n <= this.upper; n++) {
      if (u = (h = o(e + (L = s === 0 ? t / (n + 1) : 0.5 * L), !0)) - p, Z = (Math.abs(u) < 1 ? "u" : "t") == "u" ? (1 + n) * u : u, p = h, v = (l = this.levin(h, n - 1, Z, 1, O, S)) - y, isNaN(l)) {
        R = "NaN";
        break;
      }
      if (h !== 0 && l / h > this.infty) {
        y = l, R = "infinite";
        break;
      }
      if (Math.abs(v) < 1e-7)
        break;
      y = l;
    }
    return [y, R, 1 - (n - 1) / this.upper];
  }, limit: function(e, t, o) {
    return this.iteration_levin(e, t, o, 0);
  } };
  const A = k.Z.Extrapolate;
  k.Z.Quadtree = function(e) {
    this.capacity = 10, this.points = [], this.xlb = e[0], this.xub = e[2], this.ylb = e[3], this.yub = e[1], this.northWest = null, this.northEast = null, this.southEast = null, this.southWest = null;
  }, a.Z.extend(k.Z.Quadtree.prototype, { contains: function(e, t) {
    return this.xlb < e && e <= this.xub && this.ylb < t && t <= this.yub;
  }, insert: function(e) {
    return !!this.contains(e.usrCoords[1], e.usrCoords[2]) && (this.points.length < this.capacity ? (this.points.push(e), !0) : (this.northWest === null && this.subdivide(), !!this.northWest.insert(e) || !!this.northEast.insert(e) || !!this.southEast.insert(e) || !!this.southWest.insert(e)));
  }, subdivide: function() {
    var e, t = this.points.length, o = this.xlb + (this.xub - this.xlb) / 2, s = this.ylb + (this.yub - this.ylb) / 2;
    for (this.northWest = new k.Z.Quadtree([this.xlb, this.yub, o, s]), this.northEast = new k.Z.Quadtree([o, this.yub, this.xub, s]), this.southEast = new k.Z.Quadtree([this.xlb, s, o, this.ylb]), this.southWest = new k.Z.Quadtree([o, s, this.xub, this.ylb]), e = 0; e < t; e += 1)
      this.northWest.insert(this.points[e]), this.northEast.insert(this.points[e]), this.southEast.insert(this.points[e]), this.southWest.insert(this.points[e]);
  }, _query: function(e, t) {
    var o;
    if (this.contains(e, t)) {
      if (this.northWest === null)
        return this;
      if ((o = this.northWest._query(e, t)) || (o = this.northEast._query(e, t)) || (o = this.southEast._query(e, t)) || (o = this.southWest._query(e, t)))
        return o;
    }
    return !1;
  }, query: function(e, t) {
    var o, s;
    return a.Z.exists(t) ? (o = e, s = t) : (o = e.usrCoords[1], s = e.usrCoords[2]), this._query(o, s);
  } });
  const E = k.Z.Quadtree;
  var c = __webpack_require__(336);
  d.Z.Math.Nlp = { arr: function(e) {
    return new Float64Array(e);
  }, arr2: function(e, t) {
    for (var o = 0, s = new Array(e); o < e; )
      s[o] = this.arr(t), o++;
    return s;
  }, arraycopy: function(e, t, o, s, n) {
    for (var h = 0; h < n; )
      o[h + s] = e[h + t], h++;
  }, lastNumberOfEvaluations: 0, GetLastNumberOfEvaluations: function() {
    return this.lastNumberOfEvaluations;
  }, Normal: 0, MaxIterationsReached: 1, DivergingRoundingErrors: 2, FindMinimum: function(e, t, o, s, n, h, l, p, u) {
    var v, Z, y = o + 2, O = this.arr(t + 1), S = this;
    return this.lastNumberOfEvaluations = 0, u && console.log("Experimental feature 'testForRoundingErrors' is activated."), O[0] = 0, this.arraycopy(s, 0, O, 1, t), Z = function(R, L, B, X) {
      var F, G, W = S.arr(R);
      return S.lastNumberOfEvaluations = S.lastNumberOfEvaluations + 1, S.arraycopy(B, 1, W, 0, R), F = S.arr(L), G = e(R, L, W, F), S.arraycopy(F, 0, X, 1, L), G;
    }, v = this.cobylb(Z, t, o, y, O, n, h, l, p, u), this.arraycopy(O, 1, s, 0, t), v;
  }, cobylb: function(e, t, o, s, n, h, l, p, u, v) {
    var Z, y, O, S, R, L, B, X, F, G, W, H, q, oe, ee, he, re, _e, ge, we, Ne, Le, Ue, Qe, Ve, ye, Ce, me, be, ue = -1, Ae = 0, Ge = 0, pe = t + 1, Se = o + 1, Ee = h, De = 0, He = !1, We = !1, Ye = 0, Be = 0, Pe = 0, et = this.arr(1 + s), Fe = this.arr2(1 + t, 1 + pe), $e = this.arr2(1 + t, 1 + t), Ie = this.arr2(1 + s, 1 + pe), Ft = this.arr2(1 + t, 1 + Se), mt = this.arr(1 + t), Mt = this.arr(1 + t), $t = this.arr(1 + t), tt = this.arr(1 + t), qt = this.arr(1 + t);
    for (p >= 2 && console.log("The initial value of RHO is " + Ee + " and PARMU is set to zero."), X = 0, L = 1 / Ee, y = 1; y <= t; ++y)
      Fe[y][pe] = n[y], Fe[y][y] = Ee, $e[y][y] = L;
    F = pe, G = !1;
    e:
      for (; ; ) {
        if (X >= u && X > 0) {
          ue = this.MaxIterationsReached;
          break e;
        }
        for (++X, Ae = e(t, o, n, et), Ge = 0, S = 1; S <= o; ++S)
          Ge = Math.max(Ge, -et[S]);
        if (X !== p - 1 && p !== 3 || this.PrintIterationResult(X, Ae, Ge, n, t, p), et[Se] = Ae, et[s] = Ge, W = !0, !G) {
          for (W = !1, y = 1; y <= s; ++y)
            Ie[y][F] = et[y];
          if (X <= pe) {
            if (F <= t)
              if (Ie[Se][pe] <= Ae)
                n[F] = Fe[F][pe];
              else {
                for (Fe[F][pe] = n[F], S = 1; S <= s; ++S)
                  Ie[S][F] = Ie[S][pe], Ie[S][pe] = et[S];
                for (S = 1; S <= F; ++S) {
                  for (Fe[F][S] = -Ee, L = 0, y = S; y <= F; ++y)
                    L -= $e[y][S];
                  $e[F][S] = L;
                }
              }
            if (X <= t) {
              n[F = X] += Ee;
              continue e;
            }
          }
          G = !0;
        }
        t:
          for (; ; ) {
            i:
              do {
                if (!W) {
                  for (H = Ie[Se][pe] + De * Ie[s][pe], q = pe, O = 1; O <= t; ++O)
                    (L = Ie[Se][O] + De * Ie[s][O]) < H ? (q = O, H = L) : L === H && De === 0 && Ie[s][O] < Ie[s][q] && (q = O);
                  if (q <= t) {
                    for (y = 1; y <= s; ++y)
                      L = Ie[y][pe], Ie[y][pe] = Ie[y][q], Ie[y][q] = L;
                    for (y = 1; y <= t; ++y) {
                      for (L = Fe[y][q], Fe[y][q] = 0, Fe[y][pe] += L, B = 0, S = 1; S <= t; ++S)
                        Fe[y][S] -= L, B -= $e[S][y];
                      $e[q][y] = B;
                    }
                  }
                  if (oe = 0, v)
                    for (y = 1; y <= t; ++y)
                      for (O = 1; O <= t; ++O)
                        L = this.DOT_PRODUCT_ROW_COL($e, y, Fe, O, 1, t) - (y === O ? 1 : 0), oe = Math.max(oe, Math.abs(L));
                  if (oe > 0.1) {
                    ue = this.DivergingRoundingErrors;
                    break e;
                  }
                  for (S = 1; S <= Se; ++S) {
                    for (et[S] = -Ie[S][pe], O = 1; O <= t; ++O)
                      qt[O] = Ie[S][O] + et[S];
                    for (y = 1; y <= t; ++y)
                      Ft[y][S] = (S === Se ? -1 : 1) * this.DOT_PRODUCT_ROW_COL(qt, -1, $e, y, 1, t);
                  }
                  for (He = !0, Ye = 0.25 * Ee, ee = 2.1 * Ee, O = 1; O <= t; ++O) {
                    for (he = 0, re = 0, S = 1; S <= t; ++S)
                      he += $e[O][S] * $e[O][S], re += Fe[S][O] * Fe[S][O];
                    mt[O] = 1 / Math.sqrt(he), Mt[O] = Math.sqrt(re), (mt[O] < Ye || Mt[O] > ee) && (He = !1);
                  }
                  if (!G && !He) {
                    for (F = 0, L = ee, O = 1; O <= t; ++O)
                      Mt[O] > L && (F = O, L = Mt[O]);
                    if (F === 0)
                      for (O = 1; O <= t; ++O)
                        mt[O] < L && (F = O, L = mt[O]);
                    for (L = 0.5 * Ee * mt[F], S = 1; S <= t; ++S)
                      tt[S] = L * $e[F][S];
                    for (_e = 0, ge = 0, Z = 0, S = 1; S <= Se; ++S)
                      Z = this.DOT_PRODUCT_ROW_COL(tt, -1, Ft, S, 1, t), S < Se && (L = Ie[S][pe], _e = Math.max(_e, -Z - L), ge = Math.max(ge, Z - L));
                    for (we = De * (_e - ge) > 2 * Z ? -1 : 1, L = 0, y = 1; y <= t; ++y)
                      tt[y] = we * tt[y], Fe[y][F] = tt[y], L += $e[F][y] * tt[y];
                    for (S = 1; S <= t; ++S)
                      $e[F][S] /= L;
                    for (O = 1; O <= t; ++O) {
                      if (O !== F)
                        for (L = this.DOT_PRODUCT_ROW_COL($e, O, tt, -1, 1, t), S = 1; S <= t; ++S)
                          $e[O][S] -= L * $e[F][S];
                      n[O] = Fe[O][pe] + tt[O];
                    }
                    continue e;
                  }
                  if (!(We = this.trstlp(t, o, Ft, et, Ee, tt))) {
                    for (L = 0, S = 1; S <= t; ++S)
                      L += tt[S] * tt[S];
                    if (L < 0.25 * Ee * Ee) {
                      G = !0;
                      break i;
                    }
                  }
                  for (Z = 0, Ne = 0, et[Se] = 0, S = 1; S <= Se; ++S)
                    Z = et[S] - this.DOT_PRODUCT_ROW_COL(tt, -1, Ft, S, 1, t), S < Se && (Ne = Math.max(Ne, Z));
                  if (De < 1.5 * (Le = (Be = Ie[s][pe] - Ne) > 0 ? Z / Be : 0)) {
                    for (De = 2 * Le, p >= 2 && console.log("Increase in PARMU to " + De), Ue = Ie[Se][pe] + De * Ie[s][pe], O = 1; O <= t; ++O)
                      if ((L = Ie[Se][O] + De * Ie[s][O]) < Ue || L === Ue && De === 0 && Ie[s][O] < Ie[s][pe])
                        continue t;
                  }
                  for (Pe = De * Be - Z, S = 1; S <= t; ++S)
                    n[S] = Fe[S][pe] + tt[S];
                  G = !0;
                  continue e;
                }
                for (W = !1, Qe = Ie[Se][pe] + De * Ie[s][pe] - (Ae + De * Ge), De === 0 && Ae === Ie[Se][pe] && (Pe = Be, Qe = Ie[s][pe] - Ge), Ve = Qe <= 0 ? 1 : 0, F = 0, O = 1; O <= t; ++O)
                  (L = Math.abs(this.DOT_PRODUCT_ROW_COL($e, O, tt, -1, 1, t))) > Ve && (F = O, Ve = L), $t[O] = L * mt[O];
                for (ye = 1.1 * Ee, R = 0, O = 1; O <= t; ++O)
                  if ($t[O] >= Ye || $t[O] >= mt[O]) {
                    if (L = Mt[O], Qe > 0) {
                      for (L = 0, S = 1; S <= t; ++S)
                        L += Math.pow(tt[S] - Fe[S][O], 2);
                      L = Math.sqrt(L);
                    }
                    L > ye && (R = O, ye = L);
                  }
                if (R > 0 && (F = R), F !== 0) {
                  for (L = 0, y = 1; y <= t; ++y)
                    Fe[y][F] = tt[y], L += $e[F][y] * tt[y];
                  for (S = 1; S <= t; ++S)
                    $e[F][S] /= L;
                  for (O = 1; O <= t; ++O)
                    if (O !== F)
                      for (L = this.DOT_PRODUCT_ROW_COL($e, O, tt, -1, 1, t), S = 1; S <= t; ++S)
                        $e[O][S] -= L * $e[F][S];
                  for (S = 1; S <= s; ++S)
                    Ie[S][F] = et[S];
                  if (Qe > 0 && Qe >= 0.1 * Pe)
                    continue t;
                }
              } while (0);
            if (He) {
              if (Ee <= l) {
                ue = this.Normal;
                break e;
              }
              if (Ce = 0, me = 0, (Ee *= 0.5) <= 1.5 * l && (Ee = l), De > 0) {
                for (be = 0, S = 1; S <= Se; ++S) {
                  for (me = Ce = Ie[S][pe], y = 1; y <= t; ++y)
                    Ce = Math.min(Ce, Ie[S][y]), me = Math.max(me, Ie[S][y]);
                  S <= o && Ce < 0.5 * me && (L = Math.max(me, 0) - Ce, be = be <= 0 ? L : Math.min(be, L));
                }
                be === 0 ? De = 0 : me - Ce < De * be && (De = (me - Ce) / be);
              }
              p >= 2 && console.log("Reduction in RHO to " + Ee + "  and PARMU = " + De), p === 2 && this.PrintIterationResult(X, Ie[Se][pe], Ie[s][pe], this.COL(Fe, pe), t, p);
            } else
              G = !1;
          }
      }
    switch (ue) {
      case this.Normal:
        if (p >= 1 && console.log("%nNormal return from subroutine COBYLA%n"), We)
          return p >= 1 && this.PrintIterationResult(X, Ae, Ge, n, t, p), ue;
        break;
      case this.MaxIterationsReached:
        p >= 1 && console.log("%nReturn from subroutine COBYLA because the MAXFUN limit has been reached.%n");
        break;
      case this.DivergingRoundingErrors:
        p >= 1 && console.log("%nReturn from subroutine COBYLA because rounding errors are becoming damaging.%n");
    }
    for (S = 1; S <= t; ++S)
      n[S] = Fe[S][pe];
    return Ae = Ie[Se][pe], Ge = Ie[s][pe], p >= 1 && this.PrintIterationResult(X, Ae, Ge, n, t, p), ue;
  }, trstlp: function(e, t, o, s, n, h) {
    var l, p, u, v, Z, y, O, S, R, L, B, X, F, G, W, H, q, oe, ee, he, re, _e, ge, we, Ne, Le, Ue, Qe, Ve, ye, Ce, me, be, ue = 0, Ae = 0, Ge = 0, pe = this.arr2(1 + e, 1 + e), Se = this.arr(2 + t), Ee = this.arr(2 + t), De = this.arr(1 + e), He = this.arr(1 + e), We = this.arr(2 + t), Ye = this.arr(2 + t), Be = t, Pe = 0;
    for (u = 1; u <= e; ++u)
      pe[u][u] = 1, h[u] = 0;
    if (l = 0, p = 0, t >= 1) {
      for (v = 1; v <= t; ++v)
        s[v] > p && (p = s[v], l = v);
      for (v = 1; v <= t; ++v)
        Ye[v] = v, Ee[v] = p - s[v];
    }
    Z = !0;
    do
      e:
        for (; ; ) {
          (!Z || Z && p === 0) && (l = Be = t + 1, Ye[Be] = Be, Ee[Be] = 0), Z = !1, y = 0, O = 0, S = 0, R = 0;
          t:
            do {
              if (L = Be === t ? p : -this.DOT_PRODUCT_ROW_COL(h, -1, o, Be, 1, e), O === 0 || L < y ? (y = L, Ae = Pe, O = 3) : Pe > Ae ? (Ae = Pe, O = 3) : --O, O === 0)
                break e;
              if (B = 0, l <= Pe) {
                if (l < Pe) {
                  X = Ye[l], F = Ee[l], v = l;
                  do {
                    for (H = Ye[W = v + 1], q = this.DOT_PRODUCT(this.PART(this.COL(pe, v), 1, e), this.PART(this.COL(o, H), 1, e)), ue = Math.sqrt(q * q + Se[W] * Se[W]), oe = Se[W] / ue, ee = q / ue, Se[W] = oe * Se[v], Se[v] = ue, u = 1; u <= e; ++u)
                      ue = oe * pe[u][W] + ee * pe[u][v], pe[u][W] = oe * pe[u][v] - ee * pe[u][W], pe[u][v] = ue;
                    Ye[v] = H, Ee[v] = Ee[W], v = W;
                  } while (v < Pe);
                  Ye[v] = X, Ee[v] = F;
                }
                if (--Pe, Be > t)
                  for (ue = 1 / Se[Pe], v = 1; v <= e; ++v)
                    De[v] = ue * pe[v][Pe];
                else
                  for (ue = this.DOT_PRODUCT_ROW_COL(De, -1, pe, Pe + 1, 1, e), v = 1; v <= e; ++v)
                    De[v] -= ue * pe[v][Pe + 1];
              } else {
                for (H = Ye[l], v = 1; v <= e; ++v)
                  He[v] = o[v][H];
                for (he = 0, v = e; v > Pe; ) {
                  for (q = 0, re = 0, u = 1; u <= e; ++u)
                    q += ue = pe[u][v] * He[u], re += Math.abs(ue);
                  if (_e = re + 0.1 * Math.abs(q), ge = re + 0.2 * Math.abs(q), (re >= _e || _e >= ge) && (q = 0), he === 0)
                    he = q;
                  else
                    for (W = v + 1, oe = q / (ue = Math.sqrt(q * q + he * he)), ee = he / ue, he = ue, u = 1; u <= e; ++u)
                      ue = oe * pe[u][v] + ee * pe[u][W], pe[u][W] = oe * pe[u][W] - ee * pe[u][v], pe[u][v] = ue;
                  --v;
                }
                if (he === 0) {
                  B = -1, v = Pe;
                  do {
                    for (we = 0, Ne = 0, u = 1; u <= e; ++u)
                      we += ue = pe[u][v] * He[u], Ne += Math.abs(ue);
                    if (_e = Ne + 0.1 * Math.abs(we), ge = Ne + 0.2 * Math.abs(we), Ne < _e && _e < ge) {
                      if ((ue = we / Se[v]) > 0 && Ye[v] <= t && (be = Ee[v] / ue, (B < 0 || be < B) && (B = be)), v >= 2)
                        for (Le = Ye[v], u = 1; u <= e; ++u)
                          He[u] -= ue * o[u][Le];
                      We[v] = ue;
                    } else
                      We[v] = 0;
                  } while (--v > 0);
                  if (B < 0)
                    break e;
                  for (v = 1; v <= Pe; ++v)
                    Ee[v] = Math.max(0, Ee[v] - B * We[v]);
                  if (l < Pe) {
                    X = Ye[l], F = Ee[l], v = l;
                    do {
                      for (Le = Ye[W = v + 1], q = this.DOT_PRODUCT(this.PART(this.COL(pe, v), 1, e), this.PART(this.COL(o, Le), 1, e)), ue = Math.sqrt(q * q + Se[W] * Se[W]), oe = Se[W] / ue, ee = q / ue, Se[W] = oe * Se[v], Se[v] = ue, u = 1; u <= e; ++u)
                        ue = oe * pe[u][W] + ee * pe[u][v], pe[u][W] = oe * pe[u][v] - ee * pe[u][W], pe[u][v] = ue;
                      Ye[v] = Le, Ee[v] = Ee[W], v = W;
                    } while (v < Pe);
                    Ye[v] = X, Ee[v] = F;
                  }
                  if ((ue = this.DOT_PRODUCT(this.PART(this.COL(pe, Pe), 1, e), this.PART(this.COL(o, H), 1, e))) === 0)
                    break e;
                  Se[Pe] = ue, Ee[l] = 0, Ee[Pe] = B;
                } else
                  Se[++Pe] = he, Ee[l] = Ee[Pe], Ee[Pe] = 0;
                if (Ye[l] = Ye[Pe], Ye[Pe] = H, Be > t && H !== Be) {
                  for (v = Pe - 1, q = this.DOT_PRODUCT(this.PART(this.COL(pe, v), 1, e), this.PART(this.COL(o, H), 1, e)), ue = Math.sqrt(q * q + Se[Pe] * Se[Pe]), oe = Se[Pe] / ue, ee = q / ue, Se[Pe] = oe * Se[v], Se[v] = ue, u = 1; u <= e; ++u)
                    ue = oe * pe[u][Pe] + ee * pe[u][v], pe[u][Pe] = oe * pe[u][v] - ee * pe[u][Pe], pe[u][v] = ue;
                  Ye[Pe] = Ye[v], Ye[v] = H, ue = Ee[v], Ee[v] = Ee[Pe], Ee[Pe] = ue;
                }
                if (Be > t)
                  for (ue = 1 / Se[Pe], v = 1; v <= e; ++v)
                    De[v] = ue * pe[v][Pe];
                else
                  for (H = Ye[Pe], ue = (this.DOT_PRODUCT_ROW_COL(De, -1, o, H, 1, e) - 1) / Se[Pe], v = 1; v <= e; ++v)
                    De[v] -= ue * pe[v][Pe];
              }
              for (Ue = n * n, Ve = 0, Qe = 0, u = 1; u <= e; ++u)
                Math.abs(h[u]) >= 1e-6 * n && (Ue -= h[u] * h[u]), Ve += h[u] * De[u], Qe += De[u] * De[u];
              if (Ue <= 0)
                break e;
              if (ue = Math.sqrt(Qe * Ue), Math.abs(Ve) >= 1e-6 * ue && (ue = Math.sqrt(Qe * Ue + Ve * Ve)), S = R = Ue / (ue + Ve), Be === t) {
                if (ge = S + 0.2 * p, S >= (_e = S + 0.1 * p) || _e >= ge)
                  break t;
                S = Math.min(S, p);
              }
              for (v = 1; v <= e; ++v)
                He[v] = h[v] + S * De[v];
              if (Be === t)
                for (Ge = p, p = 0, v = 1; v <= Pe; ++v)
                  ue = s[H = Ye[v]] - this.DOT_PRODUCT_ROW_COL(He, -1, o, H, 1, e), p = Math.max(p, ue);
              v = Pe;
              do {
                for (ye = 0, Ce = 0, u = 1; u <= e; ++u)
                  ye += ue = pe[u][v] * He[u], Ce += Math.abs(ue);
                if (_e = Ce + 0.1 * Math.abs(ye), ge = Ce + 0.2 * Math.abs(ye), (Ce >= _e || _e >= ge) && (ye = 0), We[v] = ye / Se[v], v >= 2)
                  for (H = Ye[v], u = 1; u <= e; ++u)
                    He[u] -= We[v] * o[u][H];
              } while (v-- >= 2);
              for (Be > t && (We[Pe] = Math.max(0, We[Pe])), v = 1; v <= e; ++v)
                He[v] = h[v] + S * De[v];
              if (Be > Pe)
                for (v = Pe + 1; v <= Be; ++v) {
                  for (G = p - s[H = Ye[v]], me = p + Math.abs(s[H]), u = 1; u <= e; ++u)
                    G += ue = o[u][H] * He[u], me += Math.abs(ue);
                  _e = me + 0.1 * Math.abs(G), ge = me + 0.2 * Math.abs(G), (me >= _e || _e >= ge) && (G = 0), We[v] = G;
                }
              for (B = 1, l = 0, v = 1; v <= Be; ++v)
                We[v] < 0 && (ue = Ee[v] / (Ee[v] - We[v])) < B && (B = ue, l = v);
              for (ue = 1 - B, v = 1; v <= e; ++v)
                h[v] = ue * h[v] + B * He[v];
              for (v = 1; v <= Be; ++v)
                Ee[v] = Math.max(0, ue * Ee[v] + B * We[v]);
              Be === t && (p = Ge + B * (p - Ge));
            } while (l > 0);
          if (S === R)
            return !0;
        }
    while (Be === t);
    return !1;
  }, PrintIterationResult: function(e, t, o, s, n, h) {
    h > 1 && console.log("NFVALS = " + e + "  F = " + t + "  MAXCV = " + o), h > 1 && console.log("X = " + this.PART(s, 1, n));
  }, ROW: function(e, t) {
    return e[t].slice();
  }, COL: function(e, t) {
    var o, s = e.length, n = [];
    for (o = 0; o < s; ++o)
      n[o] = e[o][t];
    return n;
  }, PART: function(e, t, o) {
    return e.slice(t, o + 1);
  }, FORMAT: function(e) {
    return e.join(",");
  }, DOT_PRODUCT: function(e, t) {
    var o, s = 0, n = e.length;
    for (o = 0; o < n; ++o)
      s += e[o] * t[o];
    return s;
  }, DOT_PRODUCT_ROW_COL: function(e, t, o, s, n, h) {
    var l, p = 0;
    if (t === -1)
      for (l = n; l <= h; ++l)
        p += e[l] * o[l][s];
    else if (s === -1)
      for (l = n; l <= h; ++l)
        p += e[t][l] * o[l];
    else
      for (l = n; l <= h; ++l)
        p += e[t][l] * o[l][s];
    return p;
  } }, d.Z.Math.Nlp;
  var b = __webpack_require__(705), m = __webpack_require__(309), _ = __webpack_require__(922);
  k.Z.Plot = { checkReal: function(e) {
    var t, o, s = !1, n = e.length;
    for (t = 0; t < n; t++)
      if (o = e[t].usrCoords, !isNaN(o[1]) && !isNaN(o[2]) && Math.abs(o[0]) > k.Z.eps) {
        s = !0;
        break;
      }
    return s;
  }, updateParametricCurveNaive: function(e, t, o, s) {
    var n, h, l = !1, p = (o - t) / s;
    for (n = 0; n < s; n++)
      h = t + n * p, e.points[n].setCoordinates(x.Z.COORDS_BY_USER, [e.X(h, l), e.Y(h, l)], !1), e.points[n]._t = h, l = !0;
    return e;
  }, isSegmentOutside: function(e, t, o, s, n) {
    return t < 0 && s < 0 || t > n.canvasHeight && s > n.canvasHeight || e < 0 && o < 0 || e > n.canvasWidth && o > n.canvasWidth;
  }, isDistOK: function(e, t, o, s) {
    return Math.abs(e) < o && Math.abs(t) < s && !isNaN(e + t);
  }, isSegmentDefined: function(e, t, o, s) {
    return !(isNaN(e + t) && isNaN(o + s));
  }, updateParametricCurveOld: function(e, t, o) {
    var s, n, h, l, p, u, v, Z, y, O, S, R = !1, L = new b.Z(x.Z.COORDS_BY_USER, [0, 0], e.board, !1), B = [], X = [], F = [], G = [], W = !1, H = 0, q = function(oe, ee, he) {
      var re, _e, ge = he[1] - oe[1], we = he[2] - oe[2], Ne = ee[0] - oe[1], Le = ee[1] - oe[2], Ue = Ne * Ne + Le * Le;
      return Ue >= k.Z.eps && (re = (ge * Ne + we * Le) / Ue) > 0 && (re <= 1 ? (ge -= re * Ne, we -= re * Le) : (ge -= Ne, we -= Le)), _e = ge * ge + we * we, Math.sqrt(_e);
    };
    for (d.Z.deprecated("Curve.updateParametricCurveOld()"), e.board.updateQuality === e.board.BOARD_QUALITY_LOW ? (y = 15, O = 10, S = 10) : (y = 21, O = 0.7, S = 0.7), G[0] = o - t, s = 1; s < y; s++)
      G[s] = 0.5 * G[s - 1];
    s = 1, B[0] = 1, X[0] = 0, n = t, L.setCoordinates(x.Z.COORDS_BY_USER, [e.X(n, R), e.Y(n, R)], !1), R = !0, p = L.scrCoords[1], u = L.scrCoords[2], n = o, L.setCoordinates(x.Z.COORDS_BY_USER, [e.X(n, R), e.Y(n, R)], !1), h = L.scrCoords[1], l = L.scrCoords[2], F[0] = [h, l], v = 1, Z = 0, e.points = [], e.points[H++] = new b.Z(x.Z.COORDS_BY_SCREEN, [p, u], e.board, !1);
    do {
      for (W = this.isDistOK(h - p, l - u, O, S) || this.isSegmentOutside(p, u, h, l, e.board); Z < y && (!W || Z < 6) && (Z <= 7 || this.isSegmentDefined(p, u, h, l)); )
        B[v] = s, X[v] = Z, F[v] = [h, l], v += 1, n = t + (s = 2 * s - 1) * G[++Z], L.setCoordinates(x.Z.COORDS_BY_USER, [e.X(n, R), e.Y(n, R)], !1, !0), h = L.scrCoords[1], l = L.scrCoords[2], W = this.isDistOK(h - p, l - u, O, S) || this.isSegmentOutside(p, u, h, l, e.board);
      H > 1 && q(e.points[H - 2].scrCoords, [h, l], e.points[H - 1].scrCoords) < 0.015 && (H -= 1), e.points[H] = new b.Z(x.Z.COORDS_BY_SCREEN, [h, l], e.board, !1), e.points[H]._t = n, H += 1, p = h, u = l, h = F[v -= 1][0], l = F[v][1], Z = X[v] + 1, s = 2 * B[v];
    } while (v > 0 && H < 5e5);
    return e.numberPoints = e.points.length, e;
  }, _insertPoint_v2: function(e, t, o) {
    var s = !isNaN(this._lastCrds[1] + this._lastCrds[2]), n = !isNaN(t.scrCoords[1] + t.scrCoords[2]), h = e.board.canvasWidth, l = e.board.canvasHeight, p = 500;
    (!(n = n && t.scrCoords[1] > -500 && t.scrCoords[2] > -500 && t.scrCoords[1] < h + p && t.scrCoords[2] < l + p) && s || n && (!s || Math.abs(t.scrCoords[1] - this._lastCrds[1]) > 0.7 || Math.abs(t.scrCoords[2] - this._lastCrds[2]) > 0.7)) && (t._t = o, e.points.push(t), this._lastCrds = t.copy("scrCoords"));
  }, neighborhood_isNaN_v2: function(e, t) {
    var o, s, n = new b.Z(x.Z.COORDS_BY_USER, [0, 0], e.board, !1);
    return o = t + k.Z.eps, n.setCoordinates(x.Z.COORDS_BY_USER, [e.X(o, !0), e.Y(o, !0)], !1), s = n.usrCoords, !!(isNaN(s[1] + s[2]) || (o = t - k.Z.eps, n.setCoordinates(x.Z.COORDS_BY_USER, [e.X(o, !0), e.Y(o, !0)], !1), s = n.usrCoords, isNaN(s[1] + s[2])));
  }, _borderCase: function(e, t, o, s, n, h, l, p) {
    var u, v, Z, y, O, S, R, L = null, B = !1;
    if (p <= 1) {
      if (v = new b.Z(x.Z.COORDS_BY_USER, [0, 0], e.board, !1), isNaN(t[1] + t[2]) && !isNaN(s[1] + s[2]) && !this.neighborhood_isNaN_v2(e, n) || isNaN(o[1] + o[2]) && !isNaN(s[1] + s[2]) && !this.neighborhood_isNaN_v2(e, h) || isNaN(s[1] + s[2]) && (!isNaN(t[1] + t[2]) || !isNaN(o[1] + o[2])) && !this.neighborhood_isNaN_v2(e, l))
        return !1;
      y = 0;
      do {
        if (isNaN(t[1] + t[2]) && !isNaN(s[1] + s[2]))
          O = n, S = l, R = h;
        else if (isNaN(o[1] + o[2]) && !isNaN(s[1] + s[2]))
          O = h, S = l, R = n;
        else if (isNaN(s[1] + s[2]) && !isNaN(o[1] + o[2]))
          O = l, S = h, R = h + (h - l);
        else {
          if (!isNaN(s[1] + s[2]) || isNaN(t[1] + t[2]))
            return !1;
          O = l, S = n, R = n - (l - n);
        }
        u = 0.5 * (O + S), v.setCoordinates(x.Z.COORDS_BY_USER, [e.X(u, !0), e.Y(u, !0)], !1), Z = v.usrCoords, (B = isNaN(Z[1] + Z[2])) ? O = u : (R = S, S = u), ++y;
      } while (B && y < 30);
      if (y < 30 && (L = Z.slice(), s = Z.slice(), S = u), (e.X(S, !0) - e.X(R, !0)) / (S - R), (e.Y(S, !0) - e.Y(R, !0)) / (S - R), L !== null)
        return this._insertPoint_v2(e, new b.Z(x.Z.COORDS_BY_USER, L, e.board, !1)), !0;
    }
    return !1;
  }, _plotRecursive_v2: function(e, t, o, s, n, h, l) {
    var p, u, v, Z, y, O = 0, S = new b.Z(x.Z.COORDS_BY_USER, [0, 0], e.board, !1);
    if (!(e.numberPoints > 65536))
      return h < this.nanLevel && this._isUndefined(e, t, o, s, n) || h < this.nanLevel && this._isOutside(t, o, s, n, e.board) ? this : (p = 0.5 * (o + n), S.setCoordinates(x.Z.COORDS_BY_USER, [e.X(p, !0), e.Y(p, !0)], !1), u = S.scrCoords, this._borderCase(e, t, s, u, o, n, p, h) || (v = this._triangleDists(t, s, u), Z = h < this.smoothLevel && v[3] < l, y = h < this.jumpLevel && (v[2] > 0.99 * v[0] || v[1] > 0.99 * v[0] || v[0] === 1 / 0 || v[1] === 1 / 0 || v[2] === 1 / 0), h < this.smoothLevel + 2 && v[0] < 0.5 * (v[1] + v[2]) && (O = 0, Z = !1), --h, y ? this._insertPoint_v2(e, new b.Z(x.Z.COORDS_BY_SCREEN, [NaN, NaN], e.board, !1), p) : h <= O || Z ? this._insertPoint_v2(e, S, p) : (this._plotRecursive_v2(e, t, o, u, p, h, l), isNaN(S.scrCoords[1] + S.scrCoords[2]) || this._insertPoint_v2(e, S, p), this._plotRecursive_v2(e, u, p, s, n, h, l))), this);
  }, updateParametricCurve_v2: function(e, t, o) {
    var s, n, h, l, p, u, v, Z, y, O = !1, S = new b.Z(x.Z.COORDS_BY_USER, [0, 0], e.board, !1), R = new b.Z(x.Z.COORDS_BY_USER, [0, 0], e.board, !1);
    return e.board.updateQuality === e.board.BOARD_QUALITY_LOW ? (p = a.Z.evaluate(e.visProp.recursiondepthlow) || 13, u = 2, this.smoothLevel = p - 6, this.jumpLevel = 3) : (p = a.Z.evaluate(e.visProp.recursiondepthhigh) || 17, u = 2, this.smoothLevel = p - 9, this.jumpLevel = 2), this.nanLevel = p - 4, e.points = [], this.xterm === "x" ? (v = 0.3 * ((Z = e.board.getBoundingBox())[2] - Z[0]), 0.3 * (Z[1] - Z[3]), s = Math.max(t, Z[0] - v), n = Math.min(o, Z[2] + v)) : (s = t, n = o), S.setCoordinates(x.Z.COORDS_BY_USER, [e.X(s, O), e.Y(s, O)], !1), O = !0, R.setCoordinates(x.Z.COORDS_BY_USER, [e.X(n, O), e.Y(n, O)], !1), y = this._findStartPoint(e, S.scrCoords, s, R.scrCoords, n), S.setCoordinates(x.Z.COORDS_BY_SCREEN, y[0], !1), s = y[1], y = this._findStartPoint(e, R.scrCoords, n, S.scrCoords, s), R.setCoordinates(x.Z.COORDS_BY_SCREEN, y[0], !1), n = y[1], this._visibleArea = [s, n], h = S.copy("scrCoords"), l = R.copy("scrCoords"), S._t = s, e.points.push(S), this._lastCrds = S.copy("scrCoords"), this._plotRecursive_v2(e, h, s, l, n, p, u), R._t = n, e.points.push(R), e.numberPoints = e.points.length, e;
  }, _insertLimesPoint: function(e, t, o, s, n) {
    var h, l, p;
    Math.abs(this._lastUsrCrds[1]) === 1 / 0 && Math.abs(n.left_x) === 1 / 0 || Math.abs(this._lastUsrCrds[2]) === 1 / 0 && Math.abs(n.left_y) === 1 / 0 || ((h = new b.Z(x.Z.COORDS_BY_USER, [n.left_x, n.left_y], e.board))._t = o, e.points.push(h), isNaN(n.left_x) || isNaN(n.left_y) || isNaN(n.right_x) || isNaN(n.right_y) || !(Math.abs(n.left_x - n.right_x) > k.Z.eps || Math.abs(n.left_y - n.right_y) > k.Z.eps) || ((l = new b.Z(x.Z.COORDS_BY_SCREEN, t, e.board))._t = o, e.points.push(l)), (p = new b.Z(x.Z.COORDS_BY_USER, [n.right_x, n.right_y], e.board))._t = o, e.points.push(p), this._lastScrCrds = p.copy("scrCoords"), this._lastUsrCrds = p.copy("usrCoords"));
  }, _insertPoint: function(e, t, o, s, n) {
    var h, l = !isNaN(this._lastScrCrds[1] + this._lastScrCrds[2]), p = !isNaN(t[1] + t[2]), u = e.board.canvasWidth, v = e.board.canvasHeight, Z = 500;
    a.Z.exists(n) ? this._insertLimesPoint(e, t, o, s, n) : (p = p && t[1] > -500 && t[2] > -500 && t[1] < u + Z && t[2] < v + Z, (l || p) && (p && l && Math.abs(t[1] - this._lastScrCrds[1]) < 0.8 && Math.abs(t[2] - this._lastScrCrds[2]) < 0.8 || Math.abs(t[1]) === 1 / 0 && Math.abs(this._lastUsrCrds[1]) === 1 / 0 || Math.abs(t[2]) === 1 / 0 && Math.abs(this._lastUsrCrds[2]) === 1 / 0 || ((h = new b.Z(x.Z.COORDS_BY_SCREEN, t, e.board))._t = o, e.points.push(h), this._lastScrCrds = h.copy("scrCoords"), this._lastUsrCrds = h.copy("usrCoords"))));
  }, _triangleDists: function(e, t, o) {
    var s;
    return s = [e[0] * t[0], 0.5 * (e[1] + t[1]), 0.5 * (e[2] + t[2])], [_.Z.distance(e, t, 3), _.Z.distance(e, o, 3), _.Z.distance(o, t, 3), _.Z.distance(o, s, 3)];
  }, _isUndefined: function(e, t, o, s, n) {
    var h, l, p;
    if (!isNaN(t[1] + t[2]) || !isNaN(s[1] + s[2]))
      return !1;
    for (p = new b.Z(x.Z.COORDS_BY_USER, [0, 0], e.board, !1), l = 0; l < 20; ++l)
      if (h = o + Math.random() * (n - o), p.setCoordinates(x.Z.COORDS_BY_USER, [e.X(h, !0), e.Y(h, !0)], !1), !isNaN(p.scrCoords[0] + p.scrCoords[1] + p.scrCoords[2]))
        return !1;
    return !0;
  }, _isOutside: function(e, t, o, s, n) {
    var h = 500, l = n.canvasWidth, p = n.canvasHeight;
    return e[1] < -500 && o[1] < -500 || e[2] < -500 && o[2] < -500 || e[1] > l + h && o[1] > l + h || e[2] > p + h && o[2] > p + h;
  }, _isOutsidePoint: function(e, t) {
    var o = 500, s = t.canvasWidth, n = t.canvasHeight;
    return e[1] < -500 || e[2] < -500 || e[1] > s + o || e[2] > n + o;
  }, _findStartPoint: function(e, t, o, s, n) {
    return [t, o];
  }, _getBorderPos: function(e, t, o, s, n, h, l) {
    var p, u, v, Z, y, O;
    if (u = new b.Z(x.Z.COORDS_BY_USER, [0, 0], e.board, !1), Z = 0, isNaN(o[1] + o[2]) && !isNaN(n[1] + n[2]))
      O = t, y = s;
    else if (isNaN(l[1] + l[2]) && !isNaN(n[1] + n[2]))
      O = h, y = s;
    else if (isNaN(n[1] + n[2]) && !isNaN(l[1] + l[2]))
      O = s, y = h;
    else {
      if (!isNaN(n[1] + n[2]) || isNaN(o[1] + o[2]))
        return !1;
      O = s, y = t;
    }
    do
      p = 0.5 * (y + O), u.setCoordinates(x.Z.COORDS_BY_USER, [e.X(p, !0), e.Y(p, !0)], !1), v = u.usrCoords, isNaN(v[1] + v[2]) ? O = p : y = p, ++Z;
    while (Z < 30 && Math.abs(y - O) > k.Z.eps);
    return p;
  }, _getCuspPos: function(e, t, o) {
    var s = [e.X(t, !0), e.Y(t, !0)], n = [e.X(o, !0), e.Y(o, !0)];
    return c.Z.fminbr(function(h) {
      var l = [e.X(h, !0), e.Y(h, !0)];
      return -(Math.sqrt((s[0] - l[0]) * (s[0] - l[0]) + (s[1] - l[1]) * (s[1] - l[1])) + Math.sqrt((n[0] - l[0]) * (n[0] - l[0]) + (n[1] - l[1]) * (n[1] - l[1])));
    }, [t, o], e);
  }, _getJumpPos: function(e, t, o) {
    return c.Z.fminbr(function(s) {
      var n = k.Z.eps * k.Z.eps, h = [e.X(s, !0), e.Y(s, !0)], l = [e.X(s + n, !0), e.Y(s + n, !0)];
      return -Math.abs((l[1] - h[1]) / (l[0] - h[0]));
    }, [t, o], e);
  }, _getLimits: function(e, t) {
    var o, s, n, h, l, p = 2 / (e.maxX() - e.minX());
    return s = (o = A.limit(t, -p, e.X))[0], o[1] === "infinite" && (s = Math.sign(s) * (1 / 0)), h = (o = A.limit(t, -p, e.Y))[0], o[1] === "infinite" && (h = Math.sign(h) * (1 / 0)), n = (o = A.limit(t, p, e.X))[0], o[1] === "infinite" && (n = Math.sign(n) * (1 / 0)), l = (o = A.limit(t, p, e.Y))[0], o[1] === "infinite" && (l = Math.sign(l) * (1 / 0)), { left_x: s, left_y: h, right_x: n, right_y: l, t };
  }, _getLimes: function(e, t, o, s, n, h, l, p, u) {
    var v;
    return p === "border" ? v = this._getBorderPos(e, t, o, s, n, h, l) : p === "cusp" ? v = this._getCuspPos(e, t, h) : p === "jump" && (v = this._getJumpPos(e, t, h)), this._getLimits(e, v);
  }, _plotNonRecursive: function(e, t, o, s, n, h) {
    var l, p, u, v, Z, y, O, S, R, L, B, X = null, F = !1, G = "", W = [], H = 0;
    for (S = e.board.origin.scrCoords, W[H++] = [t, o, s, n, h, 1 / 0]; H > 0; ) {
      if (t = (B = W[--H])[0], o = B[1], s = B[2], n = B[3], R = B[4], L = B[5], F = !1, G = "", X = null, e.points.length > 65536)
        return;
      R < this.nanLevel && (this._isUndefined(e, t, o, s, n) || this._isOutside(t, o, s, n, e.board)) || (l = 0.5 * (o + n), y = e.X(l, !0), O = e.Y(l, !0), p = [1, S[1] + y * e.board.unitX, S[2] - O * e.board.unitY], u = this._triangleDists(t, s, p), v = isNaN(t[1] + t[2]), Z = isNaN(s[1] + s[2]), v && !Z || !v && Z ? G = "border" : u[0] > 0.66 * L || u[0] < this.cusp_threshold * (u[1] + u[2]) || u[1] > 5 * u[2] || u[2] > 5 * u[1] ? G = "cusp" : (u[2] > this.jump_threshold * u[0] || u[1] > this.jump_threshold * u[0] || u[0] === 1 / 0 || u[1] === 1 / 0 || u[2] === 1 / 0) && (G = "jump"), F = G === "" && R < this.smoothLevel && u[3] < this.smooth_threshold, R < this.testLevel && !F && (G === "" ? F = !0 : X = this._getLimes(e, o, t, l, p, n, s, G, R)), X !== null ? (p = [1, NaN, NaN], this._insertPoint(e, p, l, R, X)) : R <= 0 || F ? this._insertPoint(e, p, l, R, null) : (W[H++] = [p, l, s, n, R - 1, u[0]], W[H++] = [t, o, p, l, R - 1, u[0]]));
    }
    return this;
  }, updateParametricCurve_v3: function(e, t, o) {
    var s, n, h, l, p, u, v, Z, y = !1, O = new b.Z(x.Z.COORDS_BY_USER, [0, 0], e.board, !1), S = new b.Z(x.Z.COORDS_BY_USER, [0, 0], e.board, !1);
    return p = e.board.updateQuality === e.board.BOARD_QUALITY_LOW ? a.Z.evaluate(e.visProp.recursiondepthlow) || 14 : a.Z.evaluate(e.visProp.recursiondepthhigh) || 17, this.smoothLevel = 7, this.nanLevel = p - 4, this.testLevel = 4, this.cusp_threshold = 0.5, this.jump_threshold = 0.99, this.smooth_threshold = 2, e.points = [], e.xterm === "x" ? (u = 0.3 * ((v = e.board.getBoundingBox())[2] - v[0]), s = Math.max(t, v[0] - u), n = Math.min(o, v[2] + u)) : (s = t, n = o), O.setCoordinates(x.Z.COORDS_BY_USER, [e.X(s, y), e.Y(s, y)], !1), y = !0, S.setCoordinates(x.Z.COORDS_BY_USER, [e.X(n, y), e.Y(n, y)], !1), Z = this._findStartPoint(e, O.scrCoords, s, S.scrCoords, n), O.setCoordinates(x.Z.COORDS_BY_SCREEN, Z[0], !1), s = Z[1], Z = this._findStartPoint(e, S.scrCoords, n, O.scrCoords, s), S.setCoordinates(x.Z.COORDS_BY_SCREEN, Z[0], !1), n = Z[1], this._visibleArea = [s, n], h = O.copy("scrCoords"), l = S.copy("scrCoords"), O._t = s, e.points.push(O), this._lastScrCrds = O.copy("scrCoords"), this._lastUsrCrds = O.copy("usrCoords"), this._plotNonRecursive(e, h, s, l, n, p), S._t = n, e.points.push(S), e.numberPoints = e.points.length, e;
  }, _criticalInterval: function(e, t, o) {
    var s, n, h, l, p, u, v, Z = !1, y = -1 / 0, O = !1, S = !1, R = 0, L = [], B = [], X = [];
    for (v = m.Z.abs(e), (l = m.Z.median(v)) < 1e-7 ? (l = 1e-7, O = !0) : l *= this.criticalThreshold, s = 0; s < t; s++)
      v[s] > l ? (X.push({ i: s, v: e[s], group: R }), y = s, Z || (Z = !0)) : Z && s > y + 4 && (X.length > 0 && L.push(X.slice(0)), X = [], Z = !1, R++);
    for (Z && X.length > 1 && L.push(X.slice(0)), O && L.length === 0 && (S = !0), n = 0; n < L.length; n++)
      if (B[n] = "point", !((h = L[n].length) < 64)) {
        for (u = 0, p = Math.sign(L[n][0].v), s = 1; s < h; s++)
          Math.sign(L[n][s].v) !== p && (u++, p = Math.sign(L[n][s].v));
        6 * u > h && (B[n] = "interval");
      }
    return { smooth: S, groups: L, types: B };
  }, Component: function() {
    this.left_isNaN = !1, this.right_isNaN = !1, this.left_t = null, this.right_t = null, this.t_values = [], this.x_values = [], this.y_values = [], this.len = 0;
  }, findComponents: function(e, t, o, s) {
    var n, h, l, p, u, v, Z = [], y = 0, O = 0, S = 0, R = !1, L = !1;
    for (l = (o - t) / s, Z[y] = new this.Component(), v = Z[y], n = 0, h = t; n <= s; n++, h += l)
      p = e.X(h, L), u = e.Y(h, L), isNaN(p) || isNaN(u) ? ++S > 1 && R && (v.right_isNaN = !0, v.right_t = h - l, v.len = O, R = !1, Z[++y] = new this.Component(), v = Z[y], S = 0) : (R || (R = !0, O = 0, S > 0 && (v.left_t = h - l, v.left_isNaN = !0)), S = 0, v.t_values[O] = h, v.x_values[O] = p, v.y_values[O] = u, O++), n === 0 && (L = !0);
    return R ? v.len = O : Z.pop(), Z;
  }, getPointType: function(e, t, o, s, n, h, l) {
    var p = n[0], u = h[0], v = s.length, Z = { idx: t, t: o, x: p[t], y: u[t], type: "other" };
    return t < 5 ? (Z.type = "borderleft", Z.idx = 0, Z.t = s[0], Z.x = p[0], Z.y = u[0], Z) : (t > l - 6 && (Z.type = "borderright", Z.idx = v - 1, Z.t = s[v - 1], Z.x = p[v - 1], Z.y = u[v - 1]), Z);
  }, newtonApprox: function(e, t, o, s, n) {
    var h, l = 0;
    for (h = s; h > 0; h--)
      l = (l + n[h][e]) * (t - (h - 1) * o) / h;
    return l + n[0][e];
  }, thiele: function(e, t, o, s, n) {
    var h, l = 0;
    for (h = n; h > 1; h--)
      l = (e - o[s + h]) / (t[h][s + 1] - t[h - 2][s + 1] + l);
    return t[0][s + 1] + (e - o[s + 1]) / (t[1][s + 1] + l);
  }, differenceMethodExperiments: function(e, t) {
    var o, s, n, h, l, p, u, v, Z, y, O, S = e.t_values, R = e.x_values, L = e.y_values, B = [], X = [], F = [], G = [], W = [], H = [], q = [], oe = [], ee = 0, he = [];
    for (l = S[1] - S[0], W.push([]), H.push([]), q.push([]), oe.push([]), n = L.length, o = 0; o < n; o++)
      W[0][o] = R[o], H[0][o] = L[o], q[0][o] = R[o], oe[0][o] = L[o];
    for (W.push([]), H.push([]), q.push([]), oe.push([]), p = l, n = L.length - 1, o = 0; o < n; o++)
      B[o] = R[o + 1] - R[o], X[o] = L[o + 1] - L[o], F[o] = B[o], G[o] = X[o], W[1][o] = B[o], H[1][o] = X[o], q[1][o] = p / B[o], oe[1][o] = p / X[o];
    for (n--, h = Math.min(8, L.length - 1), s = 1; s < h; s++) {
      for (W.push([]), H.push([]), q.push([]), oe.push([]), p *= l, o = 0; o < n; o++)
        B[o] = B[o + 1] - B[o], X[o] = X[o + 1] - X[o], W[s + 1][o] = B[o], H[s + 1][o] = X[o], q[s + 1][o] = p / (q[s][o + 1] - q[s][o]) + q[s - 1][o + 1], oe[s + 1][o] = p / (oe[s][o + 1] - oe[s][o]) + oe[s - 1][o + 1];
      if ((O = this._criticalPoints(X, n, s)) === !1) {
        console.log("Polynomial of degree", s), O = [];
        break;
      }
      if (O.length > 0 && ++ee > 1 && s % 2 == 0)
        break;
      n--;
    }
    for (o = 0; o < O.length; o++) {
      for (v = -1 / 0, Z = 0; Z < O[o].length; Z++)
        (y = Math.abs(O[o][Z].v)) > v && (v = y, u = Z);
      u = Math.floor(O[o][u].i + s / 2), he.push(this.getPointType(t, u, S, R, L, F, G, n + 1));
    }
    return [he, W, H, q, oe];
  }, getCenterOfCriticalInterval: function(e, t, o) {
    var s, n, h, l, p, u = 0, v = 0, Z = o[1] - o[0], y = [];
    for (s = -1 / 0, y = [], n = 0; n < e.length; n++)
      (l = Math.abs(e[n].v)) > s ? (y = [n], s = l, h = n) : s === l && y.push(n);
    if (y.length > 0 && (p = y.reduce(function(O, S) {
      return O + S;
    }, 0) / y.length, h = Math.floor(p), p += e[0].i), s < 1 / 0) {
      for (n = 0; n < e.length; n++)
        u += Math.abs(e[n].v) * e[n].i, v += Math.abs(e[n].v);
      p = u / v;
    }
    return p += t / 2, [e[h].i + t / 2, p, o[Math.floor(p)] + Z * (p - Math.floor(p))];
  }, differenceMethod: function(e, t) {
    var o, s, n, h, l, p, u, v, Z, y, O = e.t_values, S = e.x_values, R = e.y_values, L = [], B = [], X = 0, F = -1, G = -1, W = [], H = [];
    for (n = R.length, L.push(new Float64Array(S)), B.push(new Float64Array(R)), n--, h = Math.min(12, n), s = 0; s < h && (L.push(new Float64Array(n)), B.push(new Float64Array(n)), L[s + 1] = L[s].map(function(q, oe, ee) {
      return ee[oe + 1] - q;
    }), B[s + 1] = B[s].map(function(q, oe, ee) {
      return ee[oe + 1] - q;
    }), (v = this._criticalInterval(B[s + 1], n, s)).smooth === !0 && (G = s, W = []), u = this._criticalInterval(L[s + 1], n, s), F === -1 && u.smooth === !0 && (F = s), !(G >= 0)); s++) {
      if (v.groups.length > 0 && ++X > 2 && (s + 1) % 2 == 0) {
        W = v.groups, y = v.types;
        break;
      }
      n--;
    }
    for (o = 0; o < W.length; o++)
      y[o] !== "interval" && (p = this.getCenterOfCriticalInterval(W[o], s + 1, O), v[0], l = Math.floor(p[1]), Z = p[2], H.push(this.getPointType(t, l, Z, O, L, B, n + 1)));
    return [H, L, B, F, G];
  }, _insertPoint_v4: function(e, t, o, s) {
    var n, h, l, p = null;
    e.points.length > 0 && (p = e.points[e.points.length - 1].scrCoords), n = new b.Z(x.Z.COORDS_BY_USER, t, e.board), p !== null && (h = n.scrCoords[1] - p[1]) * h + (l = n.scrCoords[2] - p[2]) * l < 0.8 * 0.8 || (n._t = o, e.points.push(n));
  }, getInterval: function(e, t, o) {
    var s, n;
    return N.Z.disable(), s = N.Z.Interval(t, o), e.board.mathLib = N.Z, e.board.mathLibJXG = N.Z, e.X(s, !0), n = e.Y(s, !0), e.board.mathLib = Math, e.board.mathLibJXG = d.Z.Math, n;
  }, sign: function(e) {
    return e < 0 ? -1 : e > 0 ? 1 : 0;
  }, handleBorder: function(e, t, o, s, n) {
    var h, l, p, u, v, Z, y, O, S, R, L, B, X = o.idx;
    if (B = t.t_values[1] - t.t_values[0], o.type === "borderleft" ? p = (l = h = t.left_isNaN ? t.left_t : o.t - B) + B : o.type === "borderright" ? l = (p = h = t.right_isNaN ? t.right_t : o.t + B) - B : console.log("No bordercase!!!"), (R = this.findComponents(e, l, p, 32)).length !== 0) {
      for (o.type === "borderleft" && (l = R[0].left_t, p = R[0].t_values[0], B = R[0].t_values[1] - R[0].t_values[0], h = l = l === null ? p - B : l, u = this.getInterval(e, l, p), a.Z.isObject(u) && (y = u.lo, O = u.hi, v = e.X(h, !0), Z = n[1][X] < 0 ? O : y, this._insertPoint_v4(e, [1, v, Z], h))), L = R[0].t_values.length, S = 0; S < L; S++)
        h = R[0].t_values[S], v = R[0].x_values[S], Z = R[0].y_values[S], this._insertPoint_v4(e, [1, v, Z], h);
      o.type === "borderright" && (l = R[0].t_values[L - 1], p = R[0].right_t, B = R[0].t_values[1] - R[0].t_values[0], h = p = p === null ? l + B : p, u = this.getInterval(e, l, p), a.Z.isObject(u) && (y = u.lo, O = u.hi, v = e.X(h, !0), Z = n[1][X] > 0 ? O : y, this._insertPoint_v4(e, [1, v, Z], h)));
    }
  }, _seconditeration_v4: function(e, t, o, s, n) {
    var h, l, p, u, v, Z, y, O, S, R, L, B, X;
    for (l = t.t_values[o.idx - 2], p = t.t_values[o.idx + 2], v = this.findComponents(e, l, p, 64), y = 0; y < v.length; y++) {
      for (Z = v[y], O = (u = this.differenceMethod(Z, e))[0], R = u[1], L = u[2], B = 0, S = 0; S <= O.length; S++) {
        for (X = S === O.length ? Z.len : O[S].idx, h = B; h < X; h++)
          isNaN(Z.x_values[h]) || isNaN(Z.y_values[h]) || this._insertPoint_v4(e, [1, Z.x_values[h], Z.y_values[h]], Z.t_values[h]);
        S < O.length && (this.handleSingularity(e, Z, O[S], R, L), B = O[S].idx + 1);
      }
      X = Z.len, y < v.length - 1 && this._insertPoint_v4(e, [1, NaN, NaN], Z.right_t);
    }
    return this;
  }, _recurse_v4: function(e, t, o, s, n, h, l, p) {
    var u, v, Z = 0.5 * (t + o), y = e.X(Z, !0), O = e.Y(Z, !0);
    p !== 0 ? (u = (y - s) * e.board.unitX, v = (O - n) * e.board.unitY, Math.sqrt(u * u + v * v) > 2 ? this._recurse_v4(e, t, Z, s, n, y, O, p - 1) : this._insertPoint_v4(e, [1, y, O], Z), u = (y - h) * e.board.unitX, v = (O - l) * e.board.unitY, Math.sqrt(u * u + v * v) > 2 ? this._recurse_v4(e, Z, o, y, O, h, l, p - 1) : this._insertPoint_v4(e, [1, y, O], Z)) : this._insertPoint_v4(e, [1, NaN, NaN], Z);
  }, handleSingularity: function(e, t, o, s, n) {
    var h, l, p, u, v, Z, y, O, S, R, L, B = o.idx, X = 100;
    h = o.t, console.log("HandleSingularity at t =", h), l = t.t_values[B - 5], p = t.t_values[B + 5], u = this.getInterval(e, l, p), a.Z.isObject(u) ? (O = u.lo, S = u.hi) : n[0][B - 1] < n[0][B + 1] ? (O = n[0][B - 1], S = n[0][B + 1]) : (O = n[0][B + 1], S = n[0][B - 1]), y = e.X(h, !0), R = (n[0][B - 3] - n[0][B - 5]) / (t.t_values[B - 3] - t.t_values[B - 5]), L = (n[0][B + 3] - n[0][B + 5]) / (t.t_values[B + 3] - t.t_values[B + 5]), console.log(":::", R, L), R < -100 ? (this._insertPoint_v4(e, [1, y, O], h, !0), L <= X && this._insertPoint_v4(e, [1, NaN, NaN], h)) : R > X ? (this._insertPoint_v4(e, [1, y, S], h), L >= -100 && this._insertPoint_v4(e, [1, NaN, NaN], h)) : (O === -1 / 0 && (this._insertPoint_v4(e, [1, y, O], h, !0), this._insertPoint_v4(e, [1, NaN, NaN], h)), S === 1 / 0 && (this._insertPoint_v4(e, [1, NaN, NaN], h), this._insertPoint_v4(e, [1, y, S], h, !0)), o.t < t.t_values[B] ? (v = B - 1, Z = B) : (v = B, Z = B + 1), l = t.t_values[v], p = t.t_values[Z], this._recurse_v4(e, l, p, s[0][v], n[0][v], s[0][Z], n[0][Z], 10)), L < -100 ? this._insertPoint_v4(e, [1, y, S], h) : L > X && this._insertPoint_v4(e, [1, y, O], h);
  }, steps: 1021, criticalThreshold: 1e3, plot_v4: function(e, t, o, s) {
    var n, h, l, p, u, v, Z, y, O, S, R, L, B, X, F, G = (o - t) / s, W = function(oe) {
      return e.Y(oe, !0);
    }, H = function(oe) {
      return -e.Y(oe, !0);
    }, q = 0.5 * G;
    for (l = this.findComponents(e, t, o, s), p = 0; p < l.length; p++) {
      for (u = l[p], v = (O = this.differenceMethod(u, e))[0], S = O[1], R = O[2], O[3], O[4], v.length !== 0 && v[0].type === "borderleft" || v.unshift({ idx: 0, t: u.t_values[0], x: u.x_values[0], y: u.y_values[0], type: "borderleft" }), v[v.length - 1].type !== "borderright" && (h = u.t_values.length, v.push({ idx: h - 1, t: u.t_values[h - 1], x: u.x_values[h - 1], y: u.y_values[h - 1], type: "borderright" })), y = 0, Z = 0; Z <= v.length; Z++) {
        for (h = Z === v.length ? u.len : v[Z].idx - 1, n = y; n < h - 2; n++)
          this._insertPoint_v4(e, [1, u.x_values[n], u.y_values[n]], u.t_values[n]), n >= y + 3 && n < h - 3 && R.length > 3 && Math.abs(R[2][n]) > 0.2 * Math.abs(R[0][n]) && (L = u.t_values[n], q = 0.25 * G, F = this.getInterval(e, L, L + G), a.Z.isObject(F) ? R[2][n] > 0 ? this._insertPoint_v4(e, [1, L + q, F.lo], L + q) : this._insertPoint_v4(e, [1, L + G - q, F.hi], L + G - q) : (B = c.Z.fminbr(W, [L, L + G])) < (X = c.Z.fminbr(H, [L, L + G])) ? (this._insertPoint_v4(e, [1, e.X(B, !0), e.Y(B, !0)], B), this._insertPoint_v4(e, [1, e.X(X, !0), e.Y(X, !0)], X)) : (this._insertPoint_v4(e, [1, e.X(X, !0), e.Y(X, !0)], X), this._insertPoint_v4(e, [1, e.X(B, !0), e.Y(B, !0)], B)));
        Z < v.length && (n = v[Z].idx, v[Z].type === "borderleft" || v[Z].type === "borderright" ? this.handleBorder(e, u, v[Z], S, R) : this._seconditeration_v4(e, u, v[Z], S, R), y = v[Z].idx + 1 + 1);
      }
      h = u.len, p < l.length - 1 && this._insertPoint_v4(e, [1, NaN, NaN], u.right_t);
    }
  }, updateParametricCurve_v4: function(e, t, o) {
    var s, n, h, l;
    e.xterm === "x" ? (h = 0.3 * ((l = e.board.getBoundingBox())[2] - l[0]), s = Math.max(t, l[0] - h), n = Math.min(o, l[2] + h)) : (s = t, n = o), e.points = [], this.plot_v4(e, s, n, this.steps), e.numberPoints = e.points.length;
  }, updateParametricCurve: function(e, t, o) {
    return this.updateParametricCurve_v2(e, t, o);
  } };
  const f = k.Z.Plot;
  k.Z.Metapost = { MP_ENDPOINT: 0, MP_EXPLICIT: 1, MP_GIVEN: 2, MP_CURL: 3, MP_OPEN: 4, MP_END_CYCLE: 5, UNITY: 1, FRACTION_ONE: 1, FRACTION_THREE: 3, ONE_EIGHTY_DEG: Math.PI, THREE_SIXTY_DEG: 2 * Math.PI, EPS_SQ: 1e-5 * 1e-5, make_choices: function(e) {
    var t, o, s, n, h, l, p, u, v, Z, y, O, S, R, L;
    p = e[0];
    do {
      if (!p)
        break;
      l = p.next, p.rtype > this.MP_EXPLICIT && (p.x - l.x) * (p.x - l.x) + (p.y - l.y) * (p.y - l.y) < this.EPS_SQ && (p.rtype = this.MP_EXPLICIT, p.ltype === this.MP_OPEN && (p.ltype = this.MP_CURL, p.set_left_curl(this.UNITY)), l.ltype = this.MP_EXPLICIT, l.rtype === this.MP_OPEN && (l.rtype = this.MP_CURL, l.set_right_curl(this.UNITY)), p.rx = p.x, l.lx = p.x, p.ry = p.y, l.ly = p.y), p = l;
    } while (p !== e[0]);
    for (o = e[0]; o.ltype === this.MP_OPEN && o.rtype === this.MP_OPEN; )
      if ((o = o.next) === e[0]) {
        o.ltype = this.MP_END_CYCLE;
        break;
      }
    for (p = o; p; ) {
      if (l = p.next, p.rtype >= this.MP_GIVEN) {
        for (; l.ltype === this.MP_OPEN && l.rtype === this.MP_OPEN; )
          l = l.next;
        for (s = 0, u = p, h = e.length, O = [], S = [], R = [], L = [null]; Z = u.next, O.push(Z.x - u.x), S.push(Z.y - u.y), R.push(this.mp_pyth_add(O[s], S[s])), s > 0 && (y = S[s - 1] / R[s - 1], v = O[s - 1] / R[s - 1], L.push(Math.atan2(S[s] * v - O[s] * y, O[s] * v + S[s] * y))), s++, (u = Z) === l && (h = s), !(s >= h && u.ltype !== this.MP_END_CYCLE); )
          ;
        s === h ? L.push(0) : L.push(L[1]), l.ltype === this.MP_OPEN && ((n = l.rx - l.x) * n + (t = l.ry - l.y) * t < this.EPS_SQ ? (l.ltype = this.MP_CURL, l.set_left_curl(this.UNITY)) : (l.ltype = this.MP_GIVEN, l.set_left_given(Math.atan2(t, n)))), p.rtype === this.MP_OPEN && p.ltype === this.MP_EXPLICIT && ((n = p.x - p.lx) * n + (t = p.y - p.ly) * t < this.EPS_SQ ? (p.rtype = this.MP_CURL, p.set_right_curl(this.UNITY)) : (p.rtype = this.MP_GIVEN, p.set_right_given(Math.atan2(t, n)))), this.mp_solve_choices(p, l, h, O, S, R, L);
      } else
        p.rtype === this.MP_ENDPOINT && (p.rx = p.x, p.ry = p.y, l.lx = l.x, l.ly = l.y);
      if ((p = l) === o)
        break;
    }
  }, mp_solve_choices: function(e, t, o, s, n, h, l) {
    var p, u, v, Z, y, O, S, R, L, B, X, F, G, W, H, q, oe, ee, he, re, _e, ge, we, Ne, Le, Ue;
    for (y = h.length + 1, B = new Array(y), L = new Array(y), v = new Array(y), H = new Array(y), Le = 0; Le < y; Le++)
      H[Le] = v[Le] = L[Le] = B[Le] = 0;
    for (S = 0, R = e, F = 0; ; ) {
      if (G = R.next, S === 0)
        if (R.rtype === this.MP_GIVEN) {
          if (G.ltype === this.MP_GIVEN)
            return p = Math.atan2(n[0], s[0]), re = (he = this.mp_n_sin_cos(e.right_given() - p))[0], _e = he[1], we = (ge = this.mp_n_sin_cos(t.left_given() - p))[0], Ne = ge[1], void this.mp_set_controls(e, t, s[0], n[0], _e, re, -Ne, we);
          v[0] = R.right_given() - Math.atan2(n[0], s[0]), v[0] = this.reduce_angle(v[0]), B[0] = 0, L[0] = 0;
        } else if (R.rtype === this.MP_CURL) {
          if (G.ltype === this.MP_CURL)
            return e.rtype = this.MP_EXPLICIT, t.ltype = this.MP_EXPLICIT, X = Math.abs(t.left_tension()), q = Math.abs(e.right_tension()), W = this.UNITY / (3 * q), e.rx = e.x + s[0] * W, e.ry = e.y + n[0] * W, W = this.UNITY / (3 * X), t.lx = t.x - s[0] * W, void (t.ly = t.y - n[0] * W);
          ee = R.right_curl(), X = Math.abs(G.left_tension()), q = Math.abs(R.right_tension()), B[0] = this.mp_curl_ratio(ee, q, X), v[0] = -l[1] * B[0], L[0] = 0;
        } else
          R.rtype === this.MP_OPEN && (B[0] = 0, v[0] = 0, L[0] = this.FRACTION_ONE);
      else if (R.ltype === this.MP_END_CYCLE || R.ltype === this.MP_OPEN) {
        if (p = this.UNITY / (3 * Math.abs(F.right_tension()) - this.UNITY), oe = h[S] * (this.FRACTION_THREE - this.UNITY / Math.abs(F.right_tension())), Z = this.UNITY / (3 * Math.abs(G.left_tension()) - this.UNITY), O = h[S - 1] * (this.FRACTION_THREE - this.UNITY / Math.abs(G.left_tension())), oe *= ee = this.FRACTION_ONE - B[S - 1] * p, (X = Math.abs(R.left_tension())) < (q = Math.abs(R.right_tension())) ? oe *= Math.pow(X / q, 2) : X > q && (O *= Math.pow(q / X, 2)), W = O / (O + oe), B[S] = W * Z, u = -l[S + 1] * B[S], F.rtype === this.MP_CURL ? (L[S] = 0, v[S] = u - l[1] * (this.FRACTION_ONE - W)) : (W = (this.FRACTION_ONE - W) / ee, u -= l[S] * W, W *= p, v[S] = u - v[S - 1] * W, L[S] = -L[S - 1] * W), R.ltype === this.MP_END_CYCLE) {
          for (p = 0, Z = this.FRACTION_ONE; (S -= 1) === 0 && (S = o), p = v[S] - p * B[S], Z = L[S] - Z * B[S], S !== o; )
            ;
          for (p /= this.FRACTION_ONE - Z, H[o] = p, v[0] = p, Ue = 1; Ue < o; Ue++)
            v[Ue] = v[Ue] + p * L[Ue];
          break;
        }
      } else {
        if (R.ltype === this.MP_CURL) {
          ee = R.left_curl(), X = Math.abs(R.left_tension()), q = Math.abs(F.right_tension()), W = this.mp_curl_ratio(ee, X, q), H[o] = -v[o - 1] * W / (this.FRACTION_ONE - W * B[o - 1]);
          break;
        }
        if (R.ltype === this.MP_GIVEN) {
          H[o] = R.left_given() - Math.atan2(n[o - 1], s[o - 1]), H[o] = this.reduce_angle(H[o]);
          break;
        }
      }
      F = R, R = G, S += 1;
    }
    for (S = o - 1; S > -1; S--)
      H[S] = v[S] - H[S + 1] * B[S];
    for (R = e, S = 0; G = R.next, re = (he = this.mp_n_sin_cos(H[S]))[0], _e = he[1], we = (ge = this.mp_n_sin_cos(-l[S + 1] - H[S + 1]))[0], Ne = ge[1], this.mp_set_controls(R, G, s[S], n[S], _e, re, Ne, we), R = G, ++S !== o; )
      ;
  }, mp_n_sin_cos: function(e) {
    return [Math.cos(e), Math.sin(e)];
  }, mp_set_controls: function(e, t, o, s, n, h, l, p) {
    var u, v, Z, y, O;
    Z = Math.abs(t.left_tension()), u = Math.abs(e.right_tension()), O = this.mp_velocity(n, h, l, p, u), v = this.mp_velocity(l, p, n, h, Z), (e.right_tension() < 0 || t.left_tension() < 0) && (n >= 0 && l >= 0 || n <= 0 && l <= 0) && (y = Math.abs(n) * p + Math.abs(l) * h) > 0 && (y *= 1.00024414062, e.right_tension() < 0 && this.mp_ab_vs_cd(Math.abs(l), this.FRACTION_ONE, O, y) < 0 && (O = Math.abs(l) / y), t.left_tension() < 0 && this.mp_ab_vs_cd(Math.abs(n), this.FRACTION_ONE, v, y) < 0 && (v = Math.abs(n) / y)), e.rx = e.x + (o * h - s * n) * O, e.ry = e.y + (s * h + o * n) * O, t.lx = t.x - (o * p + s * l) * v, t.ly = t.y - (s * p - o * l) * v, e.rtype = this.MP_EXPLICIT, t.ltype = this.MP_EXPLICIT;
  }, mp_pyth_add: function(e, t) {
    return Math.sqrt(e * e + t * t);
  }, mp_curl_ratio: function(e, t, o) {
    var s = 1 / t, n = 1 / o;
    return Math.min(4, ((3 - s) * s * s * e + n * n * n) / (s * s * s * e + (3 - n) * n * n));
  }, mp_ab_vs_cd: function(e, t, o, s) {
    return e * t == o * s ? 0 : e * t > o * s ? 1 : -1;
  }, mp_velocity: function(e, t, o, s, n) {
    return Math.min(4, (2 + Math.sqrt(2) * (e - o / 16) * (o - e / 16) * (t - s)) / (1.5 * n * (2 + (Math.sqrt(5) - 1) * t + (3 - Math.sqrt(5)) * s)));
  }, reduce_angle: function(e) {
    return Math.abs(e) > this.ONE_EIGHTY_DEG && (e > 0 ? e -= this.THREE_SIXTY_DEG : e += this.THREE_SIXTY_DEG), e;
  }, makeknots: function(e, t) {
    var o, s, n = [];
    for (s = e.length, o = 0; o < s; o++)
      n.push({ x: e[o][0], y: e[o][1], ltype: this.MP_OPEN, rtype: this.MP_OPEN, lx: !1, rx: !1, ly: t, ry: t, left_curl: function() {
        return this.lx || 0;
      }, right_curl: function() {
        return this.rx || 0;
      }, left_tension: function() {
        return this.ly || 1;
      }, right_tension: function() {
        return this.ry || 1;
      }, set_right_curl: function(h) {
        this.rx = h || 0;
      }, set_left_curl: function(h) {
        this.lx = h || 0;
      } });
    for (s = n.length, o = 0; o < s; o++)
      n[o].next = n[o + 1] || n[o], n[o].set_right_given = n[o].set_right_curl, n[o].set_left_given = n[o].set_left_curl, n[o].right_given = n[o].right_curl, n[o].left_given = n[o].left_curl;
    return n[s - 1].next = n[0], n;
  }, curve: function(e, t) {
    var o, s, n, h, l, p, u = !1, v = [], Z = [];
    for (h in l = 1, (t = t || { tension: 1, direction: {}, curl: {}, isClosed: !1 }).hasOwnProperty("tension") && (l = a.Z.evaluate(t.tension)), s = (o = this.makeknots(e, l)).length, a.Z.exists(t.isClosed) && a.Z.evaluate(t.isClosed) && (u = !0), u || (o[0].ltype = this.MP_ENDPOINT, o[0].rtype = this.MP_CURL, o[s - 1].rtype = this.MP_ENDPOINT, o[s - 1].ltype = this.MP_CURL), t)
      if (t.hasOwnProperty(h)) {
        if (n = parseInt(h, 10), isNaN(n) || n < 0 || n >= s)
          continue;
        p = t[n], a.Z.exists(p.type) && p.type === "curl" && (l = a.Z.evaluate(p.curl), n === 0 ? (o[n].rtype = this.MP_CURL, o[n].set_right_curl(l)) : n === s - 1 ? (o[n].ltype = this.MP_CURL, o[n].set_left_curl(l)) : (o[n].ltype = this.MP_CURL, o[n].rtype = this.MP_CURL, o[n].lx = l, o[n].rx = l)), a.Z.exists(p.direction) && (l = a.Z.evaluate(p.direction), a.Z.isArray(l) ? (l[0] !== !1 && (o[n].lx = l[0] * Math.PI / 180, o[n].ltype = this.MP_GIVEN), l[1] !== !1 && (o[n].rx = l[1] * Math.PI / 180, o[n].rtype = this.MP_GIVEN)) : (o[n].lx = l * Math.PI / 180, o[n].rx = l * Math.PI / 180, o[n].ltype = o[n].rtype = this.MP_GIVEN)), a.Z.exists(p.tension) && (l = a.Z.evaluate(p.tension), a.Z.isArray(l) ? (l[0] !== !1 && (o[n].ly = a.Z.evaluate(l[0])), l[1] !== !1 && (o[n].ry = a.Z.evaluate(l[1]))) : (o[n].ly = l, o[n].ry = l));
      }
    for (this.make_choices(o), n = 0; n < s - 1; n++)
      v.push(o[n].x), v.push(o[n].rx), v.push(o[n + 1].lx), Z.push(o[n].y), Z.push(o[n].ry), Z.push(o[n + 1].ly);
    return v.push(o[s - 1].x), Z.push(o[s - 1].y), u && (v.push(o[s - 1].rx), Z.push(o[s - 1].ry), v.push(o[0].lx), Z.push(o[0].ly), v.push(o[0].x), Z.push(o[0].y)), [v, Z];
  } }, k.Z.Metapost;
  var g = [0, 128, 64, 192, 32, 160, 96, 224, 16, 144, 80, 208, 48, 176, 112, 240, 8, 136, 72, 200, 40, 168, 104, 232, 24, 152, 88, 216, 56, 184, 120, 248, 4, 132, 68, 196, 36, 164, 100, 228, 20, 148, 84, 212, 52, 180, 116, 244, 12, 140, 76, 204, 44, 172, 108, 236, 28, 156, 92, 220, 60, 188, 124, 252, 2, 130, 66, 194, 34, 162, 98, 226, 18, 146, 82, 210, 50, 178, 114, 242, 10, 138, 74, 202, 42, 170, 106, 234, 26, 154, 90, 218, 58, 186, 122, 250, 6, 134, 70, 198, 38, 166, 102, 230, 22, 150, 86, 214, 54, 182, 118, 246, 14, 142, 78, 206, 46, 174, 110, 238, 30, 158, 94, 222, 62, 190, 126, 254, 1, 129, 65, 193, 33, 161, 97, 225, 17, 145, 81, 209, 49, 177, 113, 241, 9, 137, 73, 201, 41, 169, 105, 233, 25, 153, 89, 217, 57, 185, 121, 249, 5, 133, 69, 197, 37, 165, 101, 229, 21, 149, 85, 213, 53, 181, 117, 245, 13, 141, 77, 205, 45, 173, 109, 237, 29, 157, 93, 221, 61, 189, 125, 253, 3, 131, 67, 195, 35, 163, 99, 227, 19, 147, 83, 211, 51, 179, 115, 243, 11, 139, 75, 203, 43, 171, 107, 235, 27, 155, 91, 219, 59, 187, 123, 251, 7, 135, 71, 199, 39, 167, 103, 231, 23, 151, 87, 215, 55, 183, 119, 247, 15, 143, 79, 207, 47, 175, 111, 239, 31, 159, 95, 223, 63, 191, 127, 255], C = [3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 0, 0], P = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0, 99, 99], w = [1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577], T = [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13], D = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];
  d.Z.Util = d.Z.Util || {}, d.Z.Util.Unzip = function(e) {
    var t, o, s, n, h = [], l = 0, p = [], u = new Array(32768), v = 0, Z = !1, y = e.length, O = 0, S = 1, R = new Array(288), L = new Array(32), B = 0, X = null, F = (new Array(64), new Array(64), 0), G = new Array(17), W = [];
    function H() {
      return O < y ? e[O++] : -1;
    }
    function q() {
      S = 1;
    }
    function oe() {
      var ye;
      try {
        ye = 1 & S, (S >>= 1) === 0 && (ye = 1 & (S = H()), S = S >> 1 | 128);
      } catch (Ce) {
        throw console.log("Probably problems on iOS7 with >>"), Ce;
      }
      return ye;
    }
    function ee(ye) {
      var Ce = 0, me = ye;
      try {
        for (; me--; )
          Ce = Ce << 1 | oe();
        ye && (Ce = g[Ce] >> 8 - ye);
      } catch (be) {
        throw console.log("Probably problems on iOS7 with >>"), be;
      }
      return Ce;
    }
    function he() {
      v = 0;
    }
    function re(ye) {
      u[v++] = ye, h.push(String.fromCharCode(ye)), v === 32768 && (v = 0);
    }
    function _e() {
      this.b0 = 0, this.b1 = 0, this.jump = null, this.jumppos = -1;
    }
    function ge() {
      for (; ; ) {
        if (G[F] >= n)
          return -1;
        if (s[G[F]] === F)
          return G[F]++;
        G[F]++;
      }
    }
    function we() {
      var ye, Ce = X[B];
      if (F === 17)
        return -1;
      if (B++, F++, (ye = ge()) >= 0)
        Ce.b0 = ye;
      else if (Ce.b0 = 32768, we())
        return -1;
      if ((ye = ge()) >= 0)
        Ce.b1 = ye, Ce.jump = null;
      else if (Ce.b1 = 32768, Ce.jump = X[B], Ce.jumppos = B, we())
        return -1;
      return F--, 0;
    }
    function Ne(ye, Ce, me, be) {
      var ue;
      for (X = ye, B = 0, s = me, n = Ce, ue = 0; ue < 17; ue++)
        G[ue] = 0;
      return F = 0, we() ? -1 : 0;
    }
    function Le(ye) {
      for (var Ce, me, be = 0, ue = ye[be]; ; )
        if (oe()) {
          if (!(32768 & ue.b1))
            return ue.b1;
          for (ue = ue.jump, Ce = ye.length, me = 0; me < Ce; me++)
            if (ye[me] === ue) {
              be = me;
              break;
            }
        } else {
          if (!(32768 & ue.b0))
            return ue.b0;
          ue = ye[++be];
        }
    }
    function Ue() {
      var ye, Ce, me, be, ue, Ae, Ge, pe, Se, Ee, De, He, We, Ye, Be;
      do
        if (ye = oe(), (Ce = ee(2)) === 0)
          for (q(), Se = H(), Se |= H() << 8, De = H(), 65535 & (Se ^ ~(De |= H() << 8)) && d.Z.debug(`BlockLen checksum mismatch
`); Se--; )
            re(H());
        else if (Ce === 1)
          for (; ; )
            if ((be = g[ee(7)] >> 1) > 23 ? (be = be << 1 | oe()) > 199 ? be = (be -= 128) << 1 | oe() : (be -= 48) > 143 && (be += 136) : be += 256, be < 256)
              re(be);
            else {
              if (be === 256)
                break;
              for (pe = ee(P[be -= 257]) + C[be], be = g[ee(5)] >> 3, T[be] > 8 ? (Ee = ee(8), Ee |= ee(T[be] - 8) << 8) : Ee = ee(T[be]), Ee += w[be], be = 0; be < pe; be++)
                re(u[v - Ee & 32767]);
            }
        else if (Ce === 2) {
          for (Ae = new Array(320), We = 257 + ee(5), Ye = 1 + ee(5), Be = 4 + ee(4), be = 0; be < 19; be++)
            Ae[be] = 0;
          for (be = 0; be < Be; be++)
            Ae[D[be]] = ee(3);
          for (pe = L.length, me = 0; me < pe; me++)
            L[me] = new _e();
          if (Ne(L, 19, Ae))
            return he(), 1;
          for (He = We + Ye, me = 0, -1; me < He; )
            if ((be = Le(L)) < 16)
              Ae[me++] = be;
            else if (be === 16) {
              if (me + (be = 3 + ee(2)) > He)
                return he(), 1;
              for (ue = me ? Ae[me - 1] : 0; be--; )
                Ae[me++] = ue;
            } else {
              if (me + (be = be === 17 ? 3 + ee(3) : 11 + ee(7)) > He)
                return he(), 1;
              for (; be--; )
                Ae[me++] = 0;
            }
          for (pe = R.length, me = 0; me < pe; me++)
            R[me] = new _e();
          if (Ne(R, We, Ae))
            return he(), 1;
          for (pe = R.length, me = 0; me < pe; me++)
            L[me] = new _e();
          for (Ge = [], me = We; me < Ae.length; me++)
            Ge[me - We] = Ae[me];
          if (Ne(L, Ye, Ge))
            return he(), 1;
          for (; ; )
            if ((be = Le(R)) >= 256) {
              if ((be -= 256) === 0)
                break;
              for (pe = ee(P[be -= 1]) + C[be], be = Le(L), T[be] > 8 ? (Ee = ee(8), Ee |= ee(T[be] - 8) << 8) : Ee = ee(T[be]), Ee += w[be]; pe--; )
                re(u[v - Ee & 32767]);
            } else
              re(be);
        }
      while (!ye);
      return he(), q(), 0;
    }
    function Qe() {
      var ye, Ce, me, be, ue, Ae = [];
      try {
        if (h = [], Z = !1, Ae[0] = H(), Ae[1] = H(), Ae[0] === 120 && Ae[1] === 218 && (Ue(), p[l] = [h.join(""), "geonext.gxt"], l++), Ae[0] === 31 && Ae[1] === 139 && (Ve(), p[l] = [h.join(""), "file"], l++), Ae[0] === 80 && Ae[1] === 75) {
          if (Z = !0, Ae[2] = H(), Ae[3] = H(), Ae[2] === 3 && Ae[3] === 4) {
            for (Ae[0] = H(), Ae[1] = H(), t = H(), t |= H() << 8, ue = H(), ue |= H() << 8, H(), H(), H(), H(), H(), H() << 8, H() << 16, H() << 24, H(), H() << 8, H() << 16, H() << 24, H(), H() << 8, H() << 16, H() << 24, be = H(), be |= H() << 8, me = H(), me |= H() << 8, ye = 0, W = []; be--; )
              (Ce = H()) === "/" | Ce === ":" ? ye = 0 : ye < 255 && (W[ye++] = String.fromCharCode(Ce));
            for (o || (o = W), ye = 0; ye < me; )
              Ce = H(), ye++;
            if (ue === 8 && (Ue(), p[l] = new Array(2), p[l][0] = h.join(""), p[l][1] = W.join(""), l++), Ve())
              return !1;
          }
          return !0;
        }
      } catch (Ge) {
        throw console.log("Probably problems on iOS7 with >>"), Ge;
      }
      return !1;
    }
    function Ve() {
      var ye, Ce, me = [];
      if (8 & t && (me[0] = H(), me[1] = H(), me[2] = H(), me[3] = H(), me[0] === 80 && me[1] === 75 && me[2] === 7 && me[3] === 8 ? (H(), H() << 8, H() << 16, H() << 24) : me[0] | me[1] << 8 | me[2] << 16 | me[3] << 24, H(), H() << 8, H() << 16, H() << 24, H(), H() << 8, H() << 16, H() << 24), Z && Qe())
        return !1;
      if (me[0] = H(), me[0] !== 8)
        return !0;
      if (t = H(), H(), H(), H(), H(), H(), H(), 4 & t)
        for (me[0] = H(), me[2] = H(), F = me[0] + 256 * me[1], ye = 0; ye < F; ye++)
          H();
      if (8 & t)
        for (ye = 0, W = [], Ce = H(); Ce; )
          Ce !== "7" && Ce !== ":" || (ye = 0), ye < 255 && (W[ye++] = Ce), Ce = H();
      if (16 & t)
        for (Ce = H(); Ce; )
          Ce = H();
      return 2 & t && (H(), H()), Ue(), H(), H() << 8, H() << 16, H() << 24, H(), H() << 8, H() << 16, H() << 24, Z && Qe(), !1;
    }
    G[0] = 0, d.Z.Util.Unzip.prototype.unzipFile = function(ye) {
      var Ce;
      for (this.unzip(), Ce = 0; Ce < p.length; Ce++)
        if (p[Ce][1] === ye)
          return p[Ce][0];
      return "";
    }, d.Z.Util.Unzip.prototype.unzip = function() {
      return Qe(), p;
    };
  };
  const I = d.Z.Util;
  var Y = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 8, 8, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 10, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 3, 3, 11, 6, 6, 6, 5, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 0, 12, 24, 36, 60, 96, 84, 12, 12, 12, 48, 72, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 0, 12, 12, 12, 12, 12, 0, 12, 0, 12, 12, 12, 24, 12, 12, 12, 12, 12, 24, 12, 24, 12, 12, 12, 12, 12, 12, 12, 12, 12, 24, 12, 12, 12, 12, 12, 24, 12, 12, 12, 12, 12, 12, 12, 24, 12, 12, 12, 12, 12, 12, 12, 12, 12, 36, 12, 36, 12, 12, 12, 36, 12, 12, 12, 12, 12, 36, 12, 36, 12, 12, 12, 36, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12];
  d.Z.Util = d.Z.Util || {}, d.Z.Util.UTF8 = { encode: function(e) {
    var t, o, s = "", n = e.length;
    if (e = e.replace(/\r\n/g, `
`), typeof unescape == "function" && typeof encodeURIComponent == "function")
      return unescape(encodeURIComponent(e));
    for (t = 0; t < n; t++)
      (o = e.charCodeAt(t)) < 128 ? s += String.fromCharCode(o) : o > 127 && o < 2048 ? (s += String.fromCharCode(o >> 6 | 192), s += String.fromCharCode(63 & o | 128)) : (s += String.fromCharCode(o >> 12 | 224), s += String.fromCharCode(o >> 6 & 63 | 128), s += String.fromCharCode(63 & o | 128));
    return s;
  }, decode: function(e) {
    var t, o, s, n = 0, h = 0, l = 0, p = [], u = e.length, v = [];
    for (t = 0; t < u; t++)
      o = e.charCodeAt(t), s = Y[o], h = l !== 0 ? 63 & o | h << 6 : 255 >> s & o, (l = Y[256 + l + s]) === 0 && (h > 65535 ? p.push(55232 + (h >> 10), 56320 + (1023 & h)) : p.push(h), ++n % 1e4 == 0 && (v.push(String.fromCharCode.apply(null, p)), p = []));
    return v.push(String.fromCharCode.apply(null, p)), v.join("");
  }, asciiCharCodeAt: function(e, t) {
    var o = e.charCodeAt(t);
    if (o > 255)
      switch (o) {
        case 8364:
          o = 128;
          break;
        case 8218:
          o = 130;
          break;
        case 402:
          o = 131;
          break;
        case 8222:
          o = 132;
          break;
        case 8230:
          o = 133;
          break;
        case 8224:
          o = 134;
          break;
        case 8225:
          o = 135;
          break;
        case 710:
          o = 136;
          break;
        case 8240:
          o = 137;
          break;
        case 352:
          o = 138;
          break;
        case 8249:
          o = 139;
          break;
        case 338:
          o = 140;
          break;
        case 381:
          o = 142;
          break;
        case 8216:
          o = 145;
          break;
        case 8217:
          o = 146;
          break;
        case 8220:
          o = 147;
          break;
        case 8221:
          o = 148;
          break;
        case 8226:
          o = 149;
          break;
        case 8211:
          o = 150;
          break;
        case 8212:
          o = 151;
          break;
        case 732:
          o = 152;
          break;
        case 8482:
          o = 153;
          break;
        case 353:
          o = 154;
          break;
        case 8250:
          o = 155;
          break;
        case 339:
          o = 156;
          break;
        case 382:
          o = 158;
          break;
        case 376:
          o = 159;
      }
    return o;
  } };
  const U = d.Z.Util.UTF8;
  var J = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", z = "=";
  d.Z.Util = d.Z.Util || {}, d.Z.Util.Base64 = { _getByte: function(e, t) {
    return 255 & e.charCodeAt(t);
  }, _getIndex: function(e, t) {
    return J.indexOf(e.charAt(t));
  }, encode: function(e) {
    var t, o, s, n, h, l = [];
    for (n = (s = (h = U.encode(e)).length) % 3, t = 0; t < s - n; t += 3)
      o = this._getByte(h, t) << 16 | this._getByte(h, t + 1) << 8 | this._getByte(h, t + 2), l.push(J.charAt(o >> 18), J.charAt(o >> 12 & 63), J.charAt(o >> 6 & 63), J.charAt(63 & o));
    switch (n) {
      case 1:
        o = this._getByte(h, s - 1), l.push(J.charAt(o >> 2), J.charAt(o << 4 & 63), z, z);
        break;
      case 2:
        o = this._getByte(h, s - 2) << 8 | this._getByte(h, s - 1), l.push(J.charAt(o >> 10), J.charAt(o >> 4 & 63), J.charAt(o << 2 & 63), z);
    }
    return l.join("");
  }, decode: function(e, t) {
    var o, s, n, h, l, p, u = [], v = [];
    if ((n = (o = e.replace(/[^A-Za-z0-9+/=]/g, "")).length) % 4 != 0)
      throw new Error("JSXGraph/utils/base64: Can't decode string (invalid input length).");
    for (o.charAt(n - 1) === z && (h = 1, o.charAt(n - 2) === z && (h = 2), n -= 4), s = 0; s < n; s += 4)
      l = this._getIndex(o, s) << 18 | this._getIndex(o, s + 1) << 12 | this._getIndex(o, s + 2) << 6 | this._getIndex(o, s + 3), v.push(l >> 16, l >> 8 & 255, 255 & l), s % 1e4 == 0 && (u.push(String.fromCharCode.apply(null, v)), v = []);
    switch (h) {
      case 1:
        l = this._getIndex(o, n) << 12 | this._getIndex(o, n + 1) << 6 | this._getIndex(o, n + 2), v.push(l >> 10, l >> 2 & 255);
        break;
      case 2:
        l = this._getIndex(o, s) << 6 | this._getIndex(o, s + 1), v.push(l >> 4);
    }
    return u.push(String.fromCharCode.apply(null, v)), p = u.join(""), t && (p = U.decode(p)), p;
  }, decodeAsArray: function(e) {
    var t, o = this.decode(e), s = [], n = o.length;
    for (t = 0; t < n; t++)
      s[t] = o.charCodeAt(t);
    return s;
  } };
  const V = d.Z.Util.Base64;
  d.Z.Server = { modules: {}, runningCalls: {}, handleError: function(e) {
    d.Z.debug("error occured, server says: " + e.message);
  }, callServer: function(e, t, o, s) {
    var n, h, l, p, u, v, Z;
    for (v in s = s || !1, o)
      o.hasOwnProperty(v) && "" + escape(v) + escape(o[v]);
    u = a.Z.toJSON(o);
    do
      p = e + Math.floor(4096 * Math.random());
    while (a.Z.exists(this.runningCalls[p]));
    return this.runningCalls[p] = { action: e }, a.Z.exists(o.module) && (this.runningCalls[p].module = o.module), n = d.Z.serverBase + "JXGServer.py", h = "action=" + escape(e) + "&id=" + p + "&dataJSON=" + escape(V.encode(u)), this.cbp = function(y) {
      var O, S, R, L, B, X, F, G;
      if (O = new I.Unzip(V.decodeAsArray(y)).unzip(), a.Z.isArray(O) && O.length > 0 && (O = O[0][0]), a.Z.exists(O)) {
        if ((S = window.JSON && window.JSON.parse ? window.JSON.parse(O) : new Function("return " + O)()).type === "error")
          this.handleError(S);
        else if (S.type === "response") {
          for (X = S.id, F = 0; F < S.fields.length; F++)
            L = (R = S.fields[F]).namespace + (typeof new Function("return " + R.namespace)() == "object" ? "." : ".prototype.") + R.name + " = " + R.value, new Function(L)();
          for (F = 0; F < S.handler.length; F++) {
            for (R = S.handler[F], B = [], G = 0; G < R.parameters.length; G++)
              B[G] = '"' + R.parameters[G] + '": ' + R.parameters[G];
            L = "if(typeof JXG.Server.modules." + this.runningCalls[X].module + ' == "undefined")JXG.Server.modules.' + this.runningCalls[X].module + " = {};", L += "JXG.Server.modules." + this.runningCalls[X].module + "." + R.name + "_cb = " + R.callback + ";", L += "JXG.Server.modules." + this.runningCalls[X].module + "." + R.name + " = function (" + R.parameters.join(",") + ', __JXGSERVER_CB__, __JXGSERVER_SYNC) {if(typeof __JXGSERVER_CB__ == "undefined") __JXGSERVER_CB__ = JXG.Server.modules.' + this.runningCalls[X].module + "." + R.name + "_cb;var __JXGSERVER_PAR__ = {" + B.join(",") + ', "module": "' + this.runningCalls[X].module + '", "handler": "' + R.name + '" };JXG.Server.callServer("exec", __JXGSERVER_CB__, __JXGSERVER_PAR__, __JXGSERVER_SYNC);};', new Function(L)();
          }
          delete this.runningCalls[X], t(S.data);
        }
      }
    }, this.cb = d.Z.bind(this.cbp, this), window.XMLHttpRequest ? (l = new XMLHttpRequest()).overrideMimeType("text/plain; charset=iso-8859-1") : l = new ActiveXObject("Microsoft.XMLHTTP"), !(!l || (l.open("POST", n, !s), l.setRequestHeader("Content-type", "application/x-www-form-urlencoded"), s || (l.onreadystatechange = (Z = this.cb, function() {
      return l.readyState === 4 && l.status === 200 && (Z(l.responseText), !0);
    })), l.send(h), !s)) && (this.cb(l.responseText), !0);
  }, loadModule_cb: function(e) {
    var t;
    for (t = 0; t < e.length; t++)
      d.Z.debug(e[t].name + ": " + e[t].value);
  }, loadModule: function(e) {
    return d.Z.Server.callServer("load", d.Z.Server.loadModule_cb, { module: e }, !0);
  } }, d.Z.Server.load = d.Z.Server.loadModule;
  const $ = d.Z.Server;
  var ne;
  k.Z.Symbolic = { generateSymbolicCoordinatesPartial: function(e, t, o, s) {
    var n, h, l, p = t.ancestors, u = 0, v = function(Z) {
      return s === "underscore" ? o + "_{" + Z + "}" : s === "brace" ? o + "[" + Z + "]" : o + Z;
    };
    for (h in e.listOfFreePoints = [], e.listOfDependantPoints = [], p)
      if (p.hasOwnProperty(h) && (n = 0, a.Z.isPoint(p[h]))) {
        for (l in p[h].ancestors)
          p[h].ancestors.hasOwnProperty(l) && n++;
        n === 0 ? (p[h].symbolic.x = p[h].coords.usrCoords[1], p[h].symbolic.y = p[h].coords.usrCoords[2], e.listOfFreePoints.push(p[h])) : (u += 1, p[h].symbolic.x = v(u), u += 1, p[h].symbolic.y = v(u), e.listOfDependantPoints.push(p[h]));
      }
    return a.Z.isPoint(t) && (t.symbolic.x = "x", t.symbolic.y = "y"), u;
  }, clearSymbolicCoordinates: function(e) {
    var t = function(o) {
      var s, n = o && o.length || 0;
      for (s = 0; s < n; s++)
        a.Z.isPoint(o[s]) && (o[s].symbolic.x = "", o[s].symbolic.y = "");
    };
    t(e.listOfFreePoints), t(e.listOfDependantPoints), delete e.listOfFreePoints, delete e.listOfDependantPoints;
  }, generatePolynomials: function(e, t, o) {
    var s, n, h, l, p = t.ancestors, u = [], v = [];
    for (s in o && this.generateSymbolicCoordinatesPartial(e, t, "u", "brace"), p[t.id] = t, p)
      if (p.hasOwnProperty(s) && (l = 0, u = [], a.Z.isPoint(p[s]))) {
        for (n in p[s].ancestors)
          p[s].ancestors.hasOwnProperty(n) && l++;
        if (l > 0)
          for (u = p[s].generatePolynomial(), h = 0; h < u.length; h++)
            v.push(u[h]);
      }
    return o && this.clearSymbolicCoordinates(e), v;
  }, geometricLocusByGroebnerBase: function(e, t) {
    var o, s, n, h, l, p, u, v, Z, y, O, S, R = e.options.locus, L = {}, B = this.generateSymbolicCoordinatesPartial(e, t, "u", "brace"), X = new b.Z(x.Z.COORDS_BY_USR, [0, 0], e), F = new b.Z(x.Z.COORDS_BY_USR, [e.canvasWidth, e.canvasHeight], e), G = 1, W = 0, H = 0, q = 0;
    if ($.modules.geoloci === ne && $.loadModule("geoloci"), $.modules.geoloci === ne)
      throw new Error("JSXGraph: Unable to load JXG.Server module 'geoloci.py'.");
    if (p = X.usrCoords[1], u = F.usrCoords[1], v = F.usrCoords[2], Z = X.usrCoords[2], R.translateToOrigin && e.listOfFreePoints.length > 0) {
      for (W = (n = R.toOrigin !== ne && R.toOrigin !== null && a.Z.isInArray(e.listOfFreePoints, R.toOrigin.id) ? R.toOrigin : e.listOfFreePoints[0]).symbolic.x, H = n.symbolic.y, l = 0; l < e.listOfFreePoints.length; l++)
        e.listOfFreePoints[l].symbolic.x -= W, e.listOfFreePoints[l].symbolic.y -= H;
      if (p -= W, u -= W, v -= H, Z -= H, R.translateTo10 && e.listOfFreePoints.length > 1) {
        for (h = R.to10 !== ne && R.to10 !== null && R.to10.id !== R.toOrigin.id && a.Z.isInArray(e.listOfFreePoints, R.to10.id) ? R.to10 : e.listOfFreePoints[0].id === n.id ? e.listOfFreePoints[1] : e.listOfFreePoints[0], q = _.Z.rad([1, 0], [0, 0], [h.symbolic.x, h.symbolic.y]), y = Math.cos(-q), O = Math.sin(-q), l = 0; l < e.listOfFreePoints.length; l++)
          S = e.listOfFreePoints[l].symbolic.x, e.listOfFreePoints[l].symbolic.x = y * e.listOfFreePoints[l].symbolic.x - O * e.listOfFreePoints[l].symbolic.y, e.listOfFreePoints[l].symbolic.y = O * S + y * e.listOfFreePoints[l].symbolic.y;
        if (h.symbolic.y = 0, S = p, p = y * p - O * v, v = O * S + y * v, S = u, u = y * u - O * Z, Z = O * S + y * Z, R.stretch && Math.abs(h.symbolic.x) > k.Z.eps) {
          for (G = h.symbolic.x, l = 0; l < e.listOfFreePoints.length; l++)
            e.listOfFreePoints[l].symbolic.x /= G, e.listOfFreePoints[l].symbolic.y /= G;
          for (l = 0; l < e.objectsList.length; l++)
            e.objectsList[l].elementClass === x.Z.OBJECT_CLASS_CIRCLE && e.objectsList[l].method === "pointRadius" && (L[l] = e.objectsList[l].radius, e.objectsList[l].radius /= G);
          p /= G, u /= G, v /= G, Z /= G, h.symbolic.x = 1;
        }
      }
      for (l = 0; l < e.listOfFreePoints.length; l++)
        S = e.listOfFreePoints[l].symbolic.x, Math.abs(S) < k.Z.eps && (e.listOfFreePoints[l].symbolic.x = 0), Math.abs(S - Math.round(S)) < k.Z.eps && (e.listOfFreePoints[l].symbolic.x = Math.round(S)), S = e.listOfFreePoints[l].symbolic.y, Math.abs(S) < k.Z.eps && (e.listOfFreePoints[l].symbolic.y = 0), Math.abs(S - Math.round(S)) < k.Z.eps && (e.listOfFreePoints[l].symbolic.y = Math.round(S));
    }
    for (l in o = this.generatePolynomials(e, t).join(","), this.cbp = function(oe) {
      s = oe;
    }, this.cb = a.Z.bind(this.cbp, this), $.modules.geoloci.lociCoCoA(p, u, v, Z, B, o, G, q, W, H, this.cb, !0), this.clearSymbolicCoordinates(e), L)
      L.hasOwnProperty(l) && (e.objects[l].radius = L[l]);
    return s;
  } };
  const Q = k.Z.Symbolic;
  k.Z.Clip = { _isSeparator: function(e) {
    return isNaN(e.coords.usrCoords[1]) && isNaN(e.coords.usrCoords[2]);
  }, makeDoublyLinkedList: function(e) {
    var t, o = null, s = [], n = e.length;
    if (n > 0)
      for (t = 0; t < n; t++)
        this._isSeparator(e[t]) ? (e[t]._next = e[(t + 1) % n], e[t]._prev = e[(n + t - 1) % n]) : (o === null && (o = t, s.push(o)), this._isSeparator(e[(t + 1) % n]) || t === n - 1 ? (e[t]._next = e[o], e[o]._prev = e[t], e[t]._end = !0, o = null) : (e[t]._next = e[(t + 1) % n], e[o]._prev = e[t]), this._isSeparator(e[(n + t - 1) % n]) || (e[t]._prev = e[(n + t - 1) % n]));
    return s;
  }, Vertex: function(e, t, o, s, n, h) {
    this.pos = t, this.intersection = !0, this.coords = e, this.elementClass = x.Z.OBJECT_CLASS_POINT, this.data = { alpha: o, path: s, pathname: n, done: !1, type: h, idx: 0 }, this.neighbour = null, this.entry_exit = !1;
  }, _addToList: function(e, t, o) {
    var s = e.length, n = k.Z.eps * k.Z.eps;
    s > 0 && Math.abs(e[s - 1].coords.usrCoords[0] - t.usrCoords[0]) < n && Math.abs(e[s - 1].coords.usrCoords[1] - t.usrCoords[1]) < n && Math.abs(e[s - 1].coords.usrCoords[2] - t.usrCoords[2]) < n || e.push({ pos: o, intersection: !1, coords: t, elementClass: x.Z.OBJECT_CLASS_POINT });
  }, sortIntersections: function(e) {
    var t, o, s, n, h, l, p = [], u = e.length;
    for (t = 0; t < u; t++)
      if (e[t].sort(function(v, Z) {
        return v.data.alpha > Z.data.alpha ? 1 : -1;
      }), e[t].length > 0) {
        for (h = e[t].length - 1, l = (n = (s = e[t][0]).data.path[s.pos])._next, t === u - 1 && (n._end = !1), s.data.alpha === 0 && s.data.type === "T" ? (n.intersection = !0, n.data = s.data, n.neighbour = s.neighbour, n.neighbour.neighbour = n, n.entry_exit = !1, e[t][0] = n) : (s._prev = n, s._prev._next = s), o = 1; o <= h; o++)
          (s = e[t][o])._prev = e[t][o - 1], s._prev._next = s;
        (s = e[t][h])._next = l, s._next._prev = s, t === u - 1 && (s._end = !0), p = p.concat(e[t]);
      }
    return p;
  }, _inbetween: function(e, t, o) {
    var s, n = k.Z.eps * k.Z.eps, h = o[1] - t[1], l = o[2] - t[2], p = e[1] - t[1], u = e[2] - t[2];
    return h === 0 && l === 0 && p === 0 && u === 0 || (s = Math.abs(p) < n && Math.abs(h) < n ? u / l : p / h, Math.abs(s) < n && (s = 0), s);
  }, _print_array: function(e) {
    var t, o;
    for (t = 0; t < e.length; t++)
      try {
        o = "", e[t]._end && (o = " end"), console.log(t, e[t].coords.usrCoords, e[t].data.type, "	", "prev", e[t]._prev.coords.usrCoords, "next", e[t]._next.coords.usrCoords + o);
      } catch {
        console.log(t, e[t].coords.usrCoords);
      }
  }, _print_list: function(e) {
    for (var t, o = 0; o < 100 && (t = e.data ? e.data.alpha : "-", console.log("	", e.coords.usrCoords, `
		is:`, e.intersection, "end:", e._end, t, `
		-:`, e._prev.coords.usrCoords, `
		+:`, e._next.coords.usrCoords, `
		n:`, e.intersection ? e.neighbour.coords.usrCoords : "-"), !e._end); )
      e = e._next, o++;
  }, _noOverlap: function(e, t, o, s) {
    var n, h, l, p, u, v = Math.sqrt(k.Z.eps), Z = !1;
    for (n = 0; n < 3; n++)
      if (h = Math.min(e[n], t[n]), l = Math.max(e[n], t[n]), p = Math.min(o[n], s[n]), u = Math.max(o[n], s[n]), l < p - v || h > u + v) {
        Z = !0;
        break;
      }
    return Z;
  }, findIntersections: function(e, t, o) {
    var s, n, h, l, p, u, v, Z, y, O, S, R, L, B = [], X = 100 * k.Z.eps, F = e.length, G = t.length, W = [], H = [], q = [], oe = !1, ee = !1;
    for (n = 0; n < G; n++)
      q.push([]);
    for (s = 0; s < F; s++)
      if (H.push([]), this._isSeparator(e[s]) || this._isSeparator(e[(s + 1) % F]))
        oe = !0;
      else {
        if (oe && s === F - 1)
          break;
        for (l = e[s].coords.usrCoords, p = e[(s + 1) % F].coords.usrCoords, n = 0; n < G; n++)
          if (this._isSeparator(t[n]) || this._isSeparator(t[(n + 1) % G]))
            ee = !0;
          else {
            if (ee && n === G - 1)
              break;
            if (u = t[n].coords.usrCoords, v = t[(n + 1) % G].coords.usrCoords, !this._noOverlap(l, p, u, v) && (B = _.Z.meetSegmentSegment(l, p, u, v), Z = _.Z.distance(l, p, 3), y = _.Z.distance(u, v, 3), B[1] * Z > -X && B[1] < 1 - X / Z && B[2] * y > -X && B[2] < 1 - X / y || B[1] === 1 / 0 && B[2] === 1 / 0 && k.Z.norm(B[0], 3) < X)) {
              if (h = new b.Z(x.Z.COORDS_BY_USER, B[0], o), S = "X", Math.abs(B[1]) * Z < X || Math.abs(B[2]) * y < X)
                S = "T", Math.abs(B[1]) * Z < X && (B[1] = 0), Math.abs(B[2]) * y < X && (B[2] = 0), h = B[1] === 0 ? new b.Z(x.Z.COORDS_BY_USER, l, o) : new b.Z(x.Z.COORDS_BY_USER, u, o);
              else if (B[1] === 1 / 0 && B[2] === 1 / 0 && k.Z.norm(B[0], 3) < X) {
                (O = this._inbetween(l, u, v)) >= 0 && O < 1 && (S = "T", h = new b.Z(x.Z.COORDS_BY_USER, l, o), B[1] = 0, B[2] = O, R = new this.Vertex(h, s, B[1], e, "S", S), L = new this.Vertex(h, n, B[2], t, "C", S), R.neighbour = L, L.neighbour = R, H[s].push(R), q[n].push(L)), O = this._inbetween(u, l, p), _.Z.distance(l, u, 3) > X && O >= 0 && O < 1 && (S = "T", h = new b.Z(x.Z.COORDS_BY_USER, u, o), B[1] = O, B[2] = 0, R = new this.Vertex(h, s, B[1], e, "S", S), L = new this.Vertex(h, n, B[2], t, "C", S), R.neighbour = L, L.neighbour = R, H[s].push(R), q[n].push(L));
                continue;
              }
              R = new this.Vertex(h, s, B[1], e, "S", S), L = new this.Vertex(h, n, B[2], t, "C", S), R.neighbour = L, L.neighbour = R, H[s].push(R), q[n].push(L);
            }
          }
      }
    for (W = this.sortIntersections(H), s = 0; s < W.length; s++)
      W[s].data.idx = s, W[s].neighbour.data.idx = s;
    return [W, this.sortIntersections(q)];
  }, _getPosition: function(e, t, o, s) {
    var n = _.Z.det3p(e, t, o), h = _.Z.det3p(e, o, s);
    return _.Z.det3p(t, o, s) >= 0 ? n >= 0 && h >= 0 ? "left" : "right" : n >= 0 || h >= 0 ? "left" : "right";
  }, _classifyDegenerateIntersections: function(e) {
    var t, o, s, n, h, l, p, u, v, Z, y, O, S, R;
    for (v = _.Z.det3p, p = 0, e._tours = 0; ; ) {
      if (e.intersection && e.data.type === "T" && (t = e._next.coords.usrCoords, o = e._prev.coords.usrCoords, _.Z.distance(e.coords.usrCoords, t, 3) < k.Z.eps && (t = e._next._next.coords.usrCoords), _.Z.distance(e.coords.usrCoords, o, 3) < k.Z.eps && (o = e._prev._prev.coords.usrCoords), n = (h = e.neighbour)._prev.coords.usrCoords, s = h._next.coords.usrCoords, _.Z.distance(h.coords.usrCoords, s, 3) < k.Z.eps && (s = h._next._next.coords.usrCoords), _.Z.distance(h.coords.usrCoords, n, 3) < k.Z.eps && (n = h._prev._prev.coords.usrCoords), y = v(e.coords.usrCoords, o, n), O = v(e.coords.usrCoords, t, s), S = v(e.coords.usrCoords, o, s), R = v(e.coords.usrCoords, t, n), y === 0 && O === 0 && S === 0 && R === 0 && (e.coords.usrCoords[1] *= 1 + Math.random() * k.Z.eps, e.coords.usrCoords[2] *= 1 + Math.random() * k.Z.eps, h.coords.usrCoords[1] = e.coords.usrCoords[1], h.coords.usrCoords[2] = e.coords.usrCoords[2], y = v(e.coords.usrCoords, o, n), O = v(e.coords.usrCoords, t, s), S = v(e.coords.usrCoords, o, s), R = v(e.coords.usrCoords, t, n)), Z = !1, y === 0 ? _.Z.affineRatio(e.coords.usrCoords, o, n) < 0 && (Z = !0) : O === 0 ? _.Z.affineRatio(e.coords.usrCoords, t, s) < 0 && (Z = !0) : S === 0 ? _.Z.affineRatio(e.coords.usrCoords, o, s) > 0 && (Z = !0) : R === 0 && _.Z.affineRatio(e.coords.usrCoords, t, n) > 0 && (Z = !0), Z && (u = n, n = s, s = u, u = y, y = S, S = u, u = O, O = R, R = u), a.Z.exists(e.delayedStatus) || (e.delayedStatus = []), y === 0 && O === 0 ? e.delayedStatus = ["on", "on"] : y === 0 ? (l = this._getPosition(t, n, h.coords.usrCoords, s), e.delayedStatus = ["on", l]) : O === 0 ? (l = this._getPosition(o, n, h.coords.usrCoords, s), e.delayedStatus = [l, "on"]) : e.delayedStatus.length === 0 && (this._getPosition(o, n, h.coords.usrCoords, s) !== this._getPosition(t, n, h.coords.usrCoords, s) ? e.data.type = "X" : e.data.type = "B")), a.Z.exists(e._tours) && e._tours++, e._tours > 3 || e._end || p > 1e3) {
        p > 1e3 && console.log("Clipping: _classifyDegenerateIntersections exit"), a.Z.exists(e._tours) && delete e._tours;
        break;
      }
      e.intersection && p++, e = e._next;
    }
  }, _handleIntersectionChains: function(e) {
    var t, o = 0, s = "Null", n = !1, h = !1, l = !1;
    for (l; e.intersection === !0 && (e.data.type === "T" && (e.delayedStatus[0] !== "on" && e.delayedStatus[1] === "on" ? (n = !0, t = e, s = e.delayedStatus[0]) : n && e.delayedStatus[0] === "on" && e.delayedStatus[1] === "on" ? e.data.type = "B" : n && e.delayedStatus[0] === "on" && e.delayedStatus[1] !== "on" && (n = !1, s === e.delayedStatus[1] ? (t.data.type = "DB", e.data.type = "DB") : (t.data.type = "DX", e.data.type = "DX"))), o++), e._end && (h = !0), !h || n; ) {
      if (o > 1e3) {
        console.log("Warning: _handleIntersectionChains: intersection chain reached maximum numbers of iterations");
        break;
      }
      e = e._next;
    }
  }, _handleFullyDegenerateCase: function(e, t, o) {
    var s, n, h, l, p, u, v, Z, y, O, S, R, L, B, X = [e, t];
    for (h = 0; h < 2; h++) {
      for (O = (s = X[h]).length, Z = 0, B = !0; Z < O; Z++)
        if (!s[Z].intersection) {
          B = !1;
          break;
        }
      if (B)
        for (S = (n = X[(h + 1) % 2]).length, Z = 0; Z < O; Z++) {
          for (p = s[Z].coords.usrCoords, u = s[Z]._next.coords.usrCoords, l = [0.5 * (p[0] + u[0]), 0.5 * (p[1] + u[1]), 0.5 * (p[2] + u[2])], y = 0, R = !1; y < S; y++)
            if (Math.abs(_.Z.det3p(n[y].coords.usrCoords, n[(y + 1) % S].coords.usrCoords, l)) < k.Z.eps) {
              R = !0;
              break;
            }
          if (!R) {
            v = { pos: Z, intersection: !1, coords: new b.Z(x.Z.COORDS_BY_USER, l, o), elementClass: x.Z.OBJECT_CLASS_POINT }, L = s[Z]._next, s[Z]._next = v, v._prev = s[Z], v._next = L, L._prev = v, s[Z]._end && (s[Z]._end = !1, v._end = !0);
            break;
          }
        }
    }
  }, _getStatus: function(e, t) {
    for (; e.intersection && !e._end; )
      e = e._next;
    return [e, _.Z.windingNumber(e.coords.usrCoords, t) === 0 ? "entry" : "exit"];
  }, markEntryExit: function(e, t, o) {
    var s, n, h, l, p, u, v, Z = null, y = 0;
    for (u = o.length, p = 0; p < u; p++)
      for (v = o[p], this._classifyDegenerateIntersections(e[v]), this._handleIntersectionChains(e[v]), n = (l = this._getStatus(e[v], t))[0], s = l[1], n._starter = !0, h = 0, Z = null, y = 0; n.intersection === !0 && (n.data.type === "X" && y === 1 && (Z.entry_exit = s, s === "exit" && (Z.data.type = "X"), y = 2), n.data.type !== "X" && n.data.type !== "DB" || (n.entry_exit = s, s = s === "entry" ? "exit" : "entry"), n.data.type === "DX" && (y === 0 ? (Z = n, y = 1) : y === 1 ? (n.entry_exit = s, Z.entry_exit = s, s === "exit" ? Z.data.type = "X" : n.data.type = "X", s = s === "entry" ? "exit" : "entry", Z = null, y = 0) : y === 2 && (n.entry_exit = s, n.data.type = "X", s = s === "entry" ? "exit" : "entry", Z = null, y = 0))), n = n._next, !(a.Z.exists(n._starter) || h > 1e4); )
        h++;
  }, _stayOnPath: function(e, t) {
    var o = !0;
    return e.intersection && e.data.type !== "B" && (o = t === e.entry_exit), o;
  }, _addVertex: function(e, t, o) {
    return isNaN(t.coords.usrCoords[1]) || isNaN(t.coords.usrCoords[2]) || e.push(t), t.intersection && t.data.done ? (o && console.log("Add last intersection point", t.coords.usrCoords, "on", t.data.pathname, t.entry_exit, t.data.type), !0) : (t.intersection && (t.data.done = !0, o && console.log("Add intersection point", t.coords.usrCoords, "on", t.data.pathname, t.entry_exit, t.data.type)), !1);
  }, tracing: function(e, t, o) {
    var s, n, h, l, p = 0, u = 1e4, v = 0, Z = [], y = !1, O = !1;
    for (O; v < t.length && p < u; )
      if ((h = t[v]).data.done || h.data.type !== "X")
        v++;
      else {
        Z.length > 0 && Z.push([NaN, NaN]), l = h.data.idx, s = e, y = this._addVertex(Z, h, O), n = h.entry_exit;
        do {
          if (y)
            break;
          if (o === "intersection" && h.entry_exit === "entry" || o === "union" && h.entry_exit === "exit" || o === "difference" && s === e == (h.entry_exit === "exit")) {
            do
              if (h = h._next, y = this._addVertex(Z, h, O))
                break;
            while (this._stayOnPath(h, n));
            p++;
          } else {
            do
              if (h = h._prev, y = this._addVertex(Z, h, O))
                break;
            while (this._stayOnPath(h, n));
            p++;
          }
          if (y)
            break;
          if (!h.neighbour)
            return console.log("Tracing: emergency break - no neighbour!!!!!!!!!!!!!!!!!", p), [[0], [0]];
          if ((h = h.neighbour).data.done)
            break;
          h.data.done = !0, n = h.entry_exit, s = h.data.path;
        } while (h.data.idx !== l && p < u);
        p >= u && console.log("Tracing: stopping an infinite loop!", p), v++;
      }
    return this._getCoordsArrays(Z, !1);
  }, isEmptyCase: function(e, t, o) {
    return o === "intersection" && (e.length === 0 || t.length === 0) || o === "union" && e.length === 0 && t.length === 0 || o === "difference" && e.length === 0;
  }, _getCoordsArrays: function(e, t) {
    var o, s = [], n = [], h = e.length;
    for (o = 0; o < h; o++)
      e[o].coords ? (s.push(e[o].coords.usrCoords[1]), n.push(e[o].coords.usrCoords[2])) : (s.push(e[o][0]), n.push(e[o][1]));
    return t && h > 0 && (e[0].coords ? (s.push(e[0].coords.usrCoords[1]), n.push(e[0].coords.usrCoords[2])) : (s.push(e[0][0]), n.push(e[0][1]))), [s, n];
  }, handleEmptyIntersection: function(e, t, o) {
    var s, n, h = !1, l = [];
    if (e.length === 0)
      return l = o === "union" ? t : [], this._getCoordsArrays(l, !0);
    if (t.length === 0)
      return l = o === "intersection" ? [] : e, this._getCoordsArrays(l, !0);
    if (e.length > 0)
      for (s = e[0]; s.intersection && !(s = s._next)._end; )
        ;
    if (t.length > 0)
      for (n = t[0]; n.intersection && !(n = n._next)._end; )
        ;
    return _.Z.windingNumber(s.coords.usrCoords, t) === 0 ? _.Z.windingNumber(n.coords.usrCoords, e) !== 0 ? (o === "union" ? (l = l.concat(e)).push(e[0]) : o === "difference" && ((l = l.concat(e)).push(e[0]), _.Z.signedPolygon(e) * _.Z.signedPolygon(t) > 0 && l.reverse(), l.push([NaN, NaN])), o !== "difference" && o !== "intersection" || ((l = l.concat(t)).push(t[0]), h = !1)) : o === "difference" ? (l = l.concat(e), h = !0) : o === "union" && ((l = l.concat(e)).push(e[0]), l.push([NaN, NaN]), (l = l.concat(t)).push(t[0])) : o === "intersection" ? (l = l.concat(e), h = !0) : o === "union" && (l = l.concat(t)).push(t[0]), this._getCoordsArrays(l, h);
  }, _countCrossingIntersections: function(e) {
    var t, o = e.length, s = 0;
    for (t = 0; t < o; t++)
      e[t].data.type === "X" && s++;
    return s;
  }, _getPath: function(e, t) {
    var o, s, n, h, l, p, u, v = [];
    if (e.elementClass !== x.Z.OBJECT_CLASS_CURVE || e.type !== x.Z.OBJECT_TYPE_ARC && e.type !== x.Z.OBJECT_TYPE_SECTOR) {
      if (e.elementClass === x.Z.OBJECT_CLASS_CURVE && a.Z.exists(e.points))
        for (s = e.numberPoints, o = 0; o < s; o++)
          this._addToList(v, e.points[o], o);
      else if (e.type === x.Z.OBJECT_TYPE_POLYGON)
        for (o = 0; o < e.vertices.length; o++)
          this._addToList(v, e.vertices[o].coords, o);
      else if (e.elementClass === x.Z.OBJECT_CLASS_CIRCLE)
        for (u = 359, n = e.Radius(), h = 2 * Math.PI / u, o = 0; o <= u; o++)
          this._addToList(v, new b.Z(x.Z.COORDS_BY_USER, [e.center.coords.usrCoords[0], e.center.coords.usrCoords[1] + Math.cos(o * h) * n, e.center.coords.usrCoords[2] + Math.sin(o * h) * n], t), o);
      else if (a.Z.isArray(e))
        for (s = e.length, o = 0; o < s; o++)
          a.Z.exists(e[o].coords) ? this._addToList(v, e[o].coords, o) : a.Z.isArray(e[o]) ? this._addToList(v, new b.Z(x.Z.COORDS_BY_USER, e[o], t), o) : a.Z.exists(e[o].usrCoords) && this._addToList(v, e[o], o);
    } else {
      for (l = _.Z.rad(e.radiuspoint, e.center, e.anglepoint), u = Math.floor(180 * l / Math.PI), n = e.Radius(), h = l / u, p = Math.atan2(e.radiuspoint.coords.usrCoords[2] - e.center.coords.usrCoords[2], e.radiuspoint.coords.usrCoords[1] - e.center.coords.usrCoords[1]), e.type === x.Z.OBJECT_TYPE_SECTOR && this._addToList(v, e.center.coords, 0), o = 0; o <= u; o++)
        this._addToList(v, new b.Z(x.Z.COORDS_BY_USER, [e.center.coords.usrCoords[0], e.center.coords.usrCoords[1] + Math.cos(o * h + p) * n, e.center.coords.usrCoords[2] + Math.sin(o * h + p) * n], t), o + 1);
      e.type === x.Z.OBJECT_TYPE_SECTOR && this._addToList(v, e.center.coords, u + 2);
    }
    return v;
  }, greinerHormann: function(e, t, o, s) {
    var n, h, l, p, u = [], v = [];
    return (n = (u = this._getPath(e, s)).length) > 0 && _.Z.distance(u[0].coords.usrCoords, u[n - 1].coords.usrCoords, 3) < k.Z.eps && u.pop(), (n = (v = this._getPath(t, s)).length) > 0 && _.Z.distance(v[0].coords.usrCoords, v[n - 1].coords.usrCoords, 3) < k.Z.eps * k.Z.eps && v.pop(), this.isEmptyCase(u, v, o) ? [[], []] : (l = this.makeDoublyLinkedList(u), p = this.makeDoublyLinkedList(v), h = this.findIntersections(u, v, s)[0], this._handleFullyDegenerateCase(u, v, s), this.markEntryExit(u, v, l), this.markEntryExit(v, u, p), this._countCrossingIntersections(h) === 0 ? this.handleEmptyIntersection(u, v, o) : this.tracing(u, h, o));
  }, union: function(e, t, o) {
    return this.greinerHormann(e, t, "union", o);
  }, intersection: function(e, t, o) {
    return this.greinerHormann(e, t, "intersection", o);
  }, difference: function(e, t, o) {
    return this.greinerHormann(e, t, "difference", o);
  } }, d.Z.extend(k.Z.Clip, {}), k.Z.Clip, k.Z.Poly = {}, k.Z.Poly.Ring = function(e) {
    this.vars = e;
  }, d.Z.extend(k.Z.Poly.Ring.prototype, {}), k.Z.Poly.Monomial = function(e, t, o) {
    var s;
    if (!a.Z.exists(e))
      throw new Error("JSXGraph error: In JXG.Math.Poly.monomial missing parameter 'ring'.");
    for (a.Z.isArray(o) || (o = []), s = (o = o.slice(0, e.vars.length)).length; s < e.vars.length; s++)
      o.push(0);
    this.ring = e, this.coefficient = t || 0, this.exponents = a.Z.deepCopy(o);
  }, d.Z.extend(k.Z.Poly.Monomial.prototype, { copy: function() {
    return new k.Z.Poly.Monomial(this.ring, this.coefficient, this.exponents);
  }, print: function() {
    var e, t = [];
    for (e = 0; e < this.ring.vars.length; e++)
      t.push(this.ring.vars[e] + "^" + this.exponents[e]);
    return this.coefficient + "*" + t.join("*");
  } }), k.Z.Poly.Polynomial = function(e, t) {
    var o;
    if (!a.Z.exists(e))
      throw new Error("JSXGraph error: In JXG.Math.Poly.polynomial missing parameter 'ring'.");
    o = a.Z.exists(t) && a.Z.isString(t) ? void 0 : [], this.ring = e, this.monomials = o;
  }, d.Z.extend(k.Z.Poly.Polynomial.prototype, { findSignature: function(e) {
    var t;
    for (t = 0; t < this.monomials.length; t++)
      if (a.Z.cmpArrays(this.monomials[t].exponents, e))
        return t;
    return -1;
  }, addSubMonomial: function(e, t) {
    var o;
    (o = this.findSignature(e.exponents)) > -1 ? this.monomials[o].coefficient += t * e.coefficient : (e.coefficient *= t, this.monomials.push(e));
  }, add: function(e) {
    var t;
    if (!a.Z.exists(e) || e.ring !== this.ring)
      throw new Error("JSXGraph error: In JXG.Math.Poly.polynomial.add either summand is undefined or rings don't match.");
    if (a.Z.isArray(e.exponents))
      this.addSubMonomial(e, 1);
    else
      for (t = 0; t < e.monomials.length; t++)
        this.addSubMonomial(e.monomials[t], 1);
  }, sub: function(e) {
    var t;
    if (!a.Z.exists(e) || e.ring !== this.ring)
      throw new Error("JSXGraph error: In JXG.Math.Poly.polynomial.sub either summand is undefined or rings don't match.");
    if (a.Z.isArray(e.exponents))
      this.addSubMonomial(e, -1);
    else
      for (t = 0; t < e.monomials.length; t++)
        this.addSubMonomial(e.monomials[t], -1);
  }, copy: function() {
    var e, t;
    for (t = new k.Z.Poly.Polynomial(this.ring), e = 0; e < this.monomials.length; e++)
      t.monomials.push(this.monomials[e].copy());
    return t;
  }, print: function() {
    var e, t = [];
    for (e = 0; e < this.monomials.length; e++)
      t.push("(" + this.monomials[e].print() + ")");
    return t.join("+");
  } }), k.Z.Poly, d.Z.Complex = function(e, t) {
    this.isComplex = !0, e && e.isComplex && (t = e.imaginary, e = e.real), this.real = e || 0, this.imaginary = t || 0, this.absval = 0, this.angle = 0;
  }, d.Z.extend(d.Z.Complex.prototype, { toString: function() {
    return this.real + " + " + this.imaginary + "i";
  }, add: function(e) {
    return a.Z.isNumber(e) ? this.real += e : (this.real += e.real, this.imaginary += e.imaginary), this;
  }, sub: function(e) {
    return a.Z.isNumber(e) ? this.real -= e : (this.real -= e.real, this.imaginary -= e.imaginary), this;
  }, mult: function(e) {
    var t, o;
    return a.Z.isNumber(e) ? (this.real *= e, this.imaginary *= e) : (t = this.real, o = this.imaginary, this.real = t * e.real - o * e.imaginary, this.imaginary = t * e.imaginary + o * e.real), this;
  }, div: function(e) {
    var t, o, s;
    if (a.Z.isNumber(e)) {
      if (Math.abs(e) < Math.eps)
        return this.real = 1 / 0, this.imaginary = 1 / 0, this;
      this.real /= e, this.imaginary /= e;
    } else {
      if (Math.abs(e.real) < Math.eps && Math.abs(e.imaginary) < Math.eps)
        return this.real = 1 / 0, this.imaginary = 1 / 0, this;
      t = e.real * e.real + e.imaginary * e.imaginary, s = this.real, o = this.imaginary, this.real = (s * e.real + o * e.imaginary) / t, this.imaginary = (o * e.real - s * e.imaginary) / t;
    }
    return this;
  }, conj: function() {
    return this.imaginary *= -1, this;
  } }), d.Z.C = {}, d.Z.C.add = function(e, t) {
    var o = new d.Z.Complex(e);
    return o.add(t), o;
  }, d.Z.C.sub = function(e, t) {
    var o = new d.Z.Complex(e);
    return o.sub(t), o;
  }, d.Z.C.mult = function(e, t) {
    var o = new d.Z.Complex(e);
    return o.mult(t), o;
  }, d.Z.C.div = function(e, t) {
    var o = new d.Z.Complex(e);
    return o.div(t), o;
  }, d.Z.C.conj = function(e) {
    var t = new d.Z.Complex(e);
    return t.conj(), t;
  }, d.Z.C.abs = function(e) {
    var t = new d.Z.Complex(e);
    return t.conj(), t.mult(e), Math.sqrt(t.real);
  }, d.Z.Complex.C = d.Z.C;
  const K = d.Z.Complex;
  var te = __webpack_require__(766);
  d.Z.AbstractRenderer = function() {
    this.vOffsetText = 0, this.enhancedRendering = !0, this.container = null, this.type = "", this.supportsForeignObject = !1;
  }, d.Z.extend(d.Z.AbstractRenderer.prototype, { _updateVisual: function(e, t, o) {
    (o || this.enhancedRendering) && (t = t || {}, this.setObjectTransition(e), a.Z.evaluate(e.visProp.draft) ? this.setDraft(e) : (t.stroke || (e.highlighted ? (this.setObjectStrokeColor(e, e.visProp.highlightstrokecolor, e.visProp.highlightstrokeopacity), this.setObjectStrokeWidth(e, e.visProp.highlightstrokewidth)) : (this.setObjectStrokeColor(e, e.visProp.strokecolor, e.visProp.strokeopacity), this.setObjectStrokeWidth(e, e.visProp.strokewidth))), t.fill || (e.highlighted ? this.setObjectFillColor(e, e.visProp.highlightfillcolor, e.visProp.highlightfillopacity) : this.setObjectFillColor(e, e.visProp.fillcolor, e.visProp.fillopacity)), t.dash || this.setDashStyle(e, e.visProp), t.shadow || this.setShadow(e), t.gradient || this.setShadow(e), t.tabindex || this.setTabindex(e)));
  }, _getHighlighted: function(e) {
    var t = !1;
    return a.Z.exists(e.board) && a.Z.exists(e.board.highlightedObjects) || (t = !0), !t && a.Z.exists(e.board.highlightedObjects[e.id]) ? "highlight" : "";
  }, drawPoint: function(e) {
    var t, o = te.Z.normalizePointFace(a.Z.evaluate(e.visProp.face));
    t = o === "o" ? "ellipse" : o === "[]" ? "rect" : "path", e.rendNode = this.appendChildPrim(this.createPrim(t, e.id), a.Z.evaluate(e.visProp.layer)), this.appendNodesToElement(e, t), this._updateVisual(e, { dash: !0, shadow: !0 }, !0), this.updatePoint(e);
  }, updatePoint: function(e) {
    var t, o = a.Z.evaluate(e.visProp.size), s = te.Z.normalizePointFace(a.Z.evaluate(e.visProp.face)), n = a.Z.evaluate(e.visProp.sizeunit), h = a.Z.evaluate(e.visProp.zoom);
    isNaN(e.coords.scrCoords[2] + e.coords.scrCoords[1]) || (n === "user" && (o *= Math.sqrt(e.board.unitX * e.board.unitY)), t = (o *= e.board && h ? Math.sqrt(e.board.zoomX * e.board.zoomY) : 1) === 0 ? 0 : o + 1, s === "o" ? this.updateEllipsePrim(e.rendNode, e.coords.scrCoords[1], e.coords.scrCoords[2], t, t) : s === "[]" ? this.updateRectPrim(e.rendNode, e.coords.scrCoords[1] - o, e.coords.scrCoords[2] - o, 2 * o, 2 * o) : this.updatePathPrim(e.rendNode, this.updatePathStringPoint(e, o, s), e.board), this._updateVisual(e, { dash: !1, shadow: !1 }), this.setShadow(e));
  }, changePointStyle: function(e) {
    var t = this.getElementById(e.id);
    a.Z.exists(t) && this.remove(t), this.drawPoint(e), a.Z.clearVisPropOld(e), e.visPropCalc.visible || this.display(e, !1), a.Z.evaluate(e.visProp.draft) && this.setDraft(e);
  }, drawLine: function(e) {
    e.rendNode = this.appendChildPrim(this.createPrim("line", e.id), a.Z.evaluate(e.visProp.layer)), this.appendNodesToElement(e, "lines"), this.updateLine(e);
  }, updateLine: function(e) {
    this._updateVisual(e), this.updatePathWithArrowHeads(e), this.setLineCap(e);
  }, drawCurve: function(e) {
    e.rendNode = this.appendChildPrim(this.createPrim("path", e.id), a.Z.evaluate(e.visProp.layer)), this.appendNodesToElement(e, "path"), this.updateCurve(e);
  }, updateCurve: function(e) {
    this._updateVisual(e), this.updatePathWithArrowHeads(e), this.setLineCap(e);
  }, updatePathWithArrowHeads: function(e, t) {
    var o, s, n = e.visProp, h = t ? "highlight" : "";
    o = t && n.highlightstrokewidth ? Math.max(a.Z.evaluate(n.highlightstrokewidth), a.Z.evaluate(n.strokewidth)) : a.Z.evaluate(n.strokewidth), s = this.getArrowHeadData(e, o, h), this.makeArrows(e, s), e.elementClass === x.Z.OBJECT_CLASS_LINE ? this.updateLineWithEndings(e, s) : e.elementClass === x.Z.OBJECT_CLASS_CURVE && this.updatePath(e), this.setArrowSize(e, s);
  }, getArrowHeadData: function(e, t, o) {
    var s, n, h, l, p = k.Z.eps, u = 0, v = 0, Z = 0, y = 0, O = a.Z.evaluate(e.visProp.firstarrow), S = a.Z.evaluate(e.visProp.lastarrow);
    return (O || S) && (s = a.Z.exists(O.type) ? a.Z.evaluate(O.type) : e.elementClass === x.Z.OBJECT_CLASS_LINE ? 1 : 7, n = a.Z.exists(S.type) ? a.Z.evaluate(S.type) : e.elementClass === x.Z.OBJECT_CLASS_LINE ? 1 : 7, O && (l = 6, a.Z.exists(O.size) && (l = a.Z.evaluate(O.size)), o !== "" && a.Z.exists(O[o + "size"]) && (l = a.Z.evaluate(O[o + "size"])), h = t * l, s === 2 ? (h *= 0.5, p += t * l) : s === 3 ? (h = t * l / 3, p += t) : s === 4 || s === 5 || s === 6 ? (h = t * l / 1.5, p += t * l) : s === 7 ? (h = 0, l = 10, p += t) : p += t * l, u += h, Z = l), S && (l = 6, a.Z.exists(S.size) && (l = a.Z.evaluate(S.size)), o !== "" && a.Z.exists(S[o + "size"]) && (l = a.Z.evaluate(S[o + "size"])), h = t * l, n === 2 ? (h *= 0.5, p += t * l) : n === 3 ? (h = t * l / 3, p += t) : n === 4 || n === 5 || n === 6 ? (h = t * l / 1.5, p += t * l) : n === 7 ? (h = 0, l = 10, p += t) : p += t * l, v += h, y = l)), e.visPropCalc.typeFirst = s, e.visPropCalc.typeLast = n, { evFirst: O, evLast: S, typeFirst: s, typeLast: n, offFirst: u, offLast: v, sizeFirst: Z, sizeLast: y, showFirst: 1, showLast: 1, minLen: p, strokeWidth: t };
  }, updateLineWithEndings: function(e, t) {
    var o, s, n;
    return o = new b.Z(x.Z.COORDS_BY_USER, e.point1.coords.usrCoords, e.board), s = new b.Z(x.Z.COORDS_BY_USER, e.point2.coords.usrCoords, e.board), n = a.Z.evaluate(e.visProp.margin), _.Z.calcStraight(e, o, s, n), this.handleTouchpoints(e, o, s, t), this.getPositionArrowHead(e, o, s, t), this.updateLinePrim(e.rendNode, o.scrCoords[1], o.scrCoords[2], s.scrCoords[1], s.scrCoords[2], e.board), this;
  }, updatePath: function(e) {
    return a.Z.evaluate(e.visProp.handdrawing) ? this.updatePathPrim(e.rendNode, this.updatePathStringBezierPrim(e), e.board) : this.updatePathPrim(e.rendNode, this.updatePathStringPrim(e), e.board), this;
  }, getPositionArrowHead: function(e, t, o, s) {
    var n, h, l, p, u;
    return (s.evFirst || s.evLast) && (h = l = p = u = 0, n = t.distance(x.Z.COORDS_BY_SCREEN, o), s.evFirst && e.board.renderer.type !== "vml" && (n >= s.minLen ? (h = (o.scrCoords[1] - t.scrCoords[1]) * s.offFirst / n, l = (o.scrCoords[2] - t.scrCoords[2]) * s.offFirst / n) : s.showFirst = 0), s.evLast && e.board.renderer.type !== "vml" && (n >= s.minLen ? (p = (o.scrCoords[1] - t.scrCoords[1]) * s.offLast / n, u = (o.scrCoords[2] - t.scrCoords[2]) * s.offLast / n) : s.showLast = 0), t.setCoordinates(x.Z.COORDS_BY_SCREEN, [t.scrCoords[1] + h, t.scrCoords[2] + l], !1, !0), o.setCoordinates(x.Z.COORDS_BY_SCREEN, [o.scrCoords[1] - p, o.scrCoords[2] - u], !1, !0)), this;
  }, handleTouchpoints: function(e, t, o, s) {
    var n, h, l, p, u, v, Z;
    return (s.evFirst || s.evLast) && (l = p = u = v = Z = 0, n = a.Z.evaluate(e.point1.visProp.size) + a.Z.evaluate(e.point1.visProp.strokewidth), h = a.Z.evaluate(e.point2.visProp.size) + a.Z.evaluate(e.point2.visProp.strokewidth), s.evFirst && a.Z.evaluate(e.visProp.touchfirstpoint) && (l = t.distance(x.Z.COORDS_BY_SCREEN, o), p = (o.scrCoords[1] - t.scrCoords[1]) * n / l, u = (o.scrCoords[2] - t.scrCoords[2]) * n / l), s.evLast && a.Z.evaluate(e.visProp.touchlastpoint) && (l = t.distance(x.Z.COORDS_BY_SCREEN, o), v = (o.scrCoords[1] - t.scrCoords[1]) * h / l, Z = (o.scrCoords[2] - t.scrCoords[2]) * h / l), t.setCoordinates(x.Z.COORDS_BY_SCREEN, [t.scrCoords[1] + p, t.scrCoords[2] + u], !1, !0), o.setCoordinates(x.Z.COORDS_BY_SCREEN, [o.scrCoords[1] - v, o.scrCoords[2] - Z], !1, !0)), this;
  }, setArrowSize: function(e, t) {
    return t.evFirst && this._setArrowWidth(e.rendNodeTriangleStart, t.showFirst * t.strokeWidth, e.rendNode, t.sizeFirst), t.evLast && this._setArrowWidth(e.rendNodeTriangleEnd, t.showLast * t.strokeWidth, e.rendNode, t.sizeLast), this;
  }, setLineCap: function(e) {
  }, drawTicks: function(e) {
    e.rendNode = this.appendChildPrim(this.createPrim("path", e.id), a.Z.evaluate(e.visProp.layer)), this.appendNodesToElement(e, "path");
  }, updateTicks: function(e) {
  }, drawEllipse: function(e) {
    e.rendNode = this.appendChildPrim(this.createPrim("ellipse", e.id), a.Z.evaluate(e.visProp.layer)), this.appendNodesToElement(e, "ellipse"), this.updateEllipse(e);
  }, updateEllipse: function(e) {
    this._updateVisual(e);
    var t = e.Radius();
    Math.abs(e.center.coords.usrCoords[0]) > k.Z.eps && !isNaN(t + e.center.coords.scrCoords[1] + e.center.coords.scrCoords[2]) && t * e.board.unitX < 2e6 && this.updateEllipsePrim(e.rendNode, e.center.coords.scrCoords[1], e.center.coords.scrCoords[2], t * e.board.unitX, t * e.board.unitY);
  }, drawPolygon: function(e) {
    e.rendNode = this.appendChildPrim(this.createPrim("polygon", e.id), a.Z.evaluate(e.visProp.layer)), this.appendNodesToElement(e, "polygon"), this.updatePolygon(e);
  }, updatePolygon: function(e) {
    this._updateVisual(e, { stroke: !0, dash: !0 }), this.updatePolygonPrim(e.rendNode, e);
  }, displayCopyright: function(e, t) {
  }, drawInternalText: function(e) {
  }, updateInternalText: function(e) {
  }, drawText: function(e) {
    var t, o, s, n;
    a.Z.evaluate(e.visProp.display) === "html" && M.Z.isBrowser && this.type !== "no" ? ((t = this.container.ownerDocument.createElement("div")).style.position = "absolute", t.className = a.Z.evaluate(e.visProp.cssclass), s = a.Z.evaluate(e.visProp.layer), a.Z.exists(s) || (s = 0), o = this.container.style.zIndex === "" ? 0 : parseInt(this.container.style.zIndex, 10), t.style.zIndex = o + s, this.container.appendChild(t), t.setAttribute("id", this.container.id + "_" + e.id)) : t = this.drawInternalText(e), e.rendNode = t, e.htmlStr = "", e.visProp.islabel && a.Z.exists(e.visProp.anchor) ? (n = a.Z.evaluate(e.visProp.anchor.visProp.visible), e.prepareUpdate().updateVisibility(n)) : e.prepareUpdate().updateVisibility(), this.updateText(e);
  }, updateText: function(e) {
    var t, o, s, n, h, l, p, u, v, Z = e.plaintext;
    if (e.visPropCalc.visible)
      if (this.updateTextStyle(e, !1), a.Z.evaluate(e.visProp.display) === "html" && this.type !== "no") {
        if (isNaN(e.coords.scrCoords[1] + e.coords.scrCoords[2]) || (o = e.coords.scrCoords[1], o = Math.abs(o) < 1e6 ? o : 1e6, t = (u = e.getAnchorX()) === "right" ? e.board.canvasWidth - o : u === "middle" ? o - 0.5 * e.size[0] : o, e.visPropOld.left !== u + t && (u === "right" ? (e.rendNode.style.right = t + "px", e.rendNode.style.left = "auto") : (e.rendNode.style.left = t + "px", e.rendNode.style.right = "auto"), e.visPropOld.left = u + t), o = e.coords.scrCoords[2] + this.vOffsetText, o = Math.abs(o) < 1e6 ? o : 1e6, t = (v = e.getAnchorY()) === "bottom" ? e.board.canvasHeight - o : v === "middle" ? o - 0.5 * e.size[1] : o, e.visPropOld.top !== v + t && (v === "bottom" ? (e.rendNode.style.top = "auto", e.rendNode.style.bottom = t + "px") : (e.rendNode.style.bottom = "auto", e.rendNode.style.top = t + "px"), e.visPropOld.top = v + t)), e.htmlStr !== Z) {
          try {
            e.type === a.Z.OBJECT_TYPE_BUTTON ? e.rendNodeButton.innerHTML = Z : e.type === a.Z.OBJECT_TYPE_CHECKBOX || e.type === a.Z.OBJECT_TYPE_INPUT ? e.rendNodeLabel.innerHTML = Z : e.rendNode.innerHTML = Z;
          } catch {
            s = e.rendNode.parentNode, e.rendNode.parentNode.removeChild(e.rendNode), e.rendNode.innerHTML = Z, s.appendChild(e.rendNode);
          }
          if (e.htmlStr = Z, a.Z.evaluate(e.visProp.usemathjax))
            try {
              MathJax.typeset ? MathJax.typeset([e.rendNode]) : MathJax.Hub.Queue(["Typeset", MathJax.Hub, e.rendNode]), p = "fullscreenwrap_" + (l = e.board.container), document.getElementById(p) && (n = e.board.containerObj._cssFullscreenStore.scale, h = e.board.containerObj._cssFullscreenStore.vshift, M.Z.scaleJSXGraphDiv("#" + p, "#" + l, n, h));
            } catch {
              d.Z.debug("MathJax (not yet) loaded");
            }
          else if (a.Z.evaluate(e.visProp.usekatex))
            try {
              katex.render(Z, e.rendNode, { macros: a.Z.evaluate(e.visProp.katexmacros), throwOnError: !1 });
            } catch {
              d.Z.debug("KaTeX not loaded (yet)");
            }
          else if (a.Z.evaluate(e.visProp.useasciimathml))
            try {
              AMprocessNode(e.rendNode, !1);
            } catch {
              d.Z.debug("AsciiMathML not loaded (yet)");
            }
        }
        this.transformImage(e, e.transformations);
      } else
        this.updateInternalText(e);
  }, _css2js: function(e) {
    var t, o, s, n, h, l = [], p = a.Z.trim(e).replace(/;$/, "").split(";");
    for (o = p.length, t = 0; t < o; ++t)
      a.Z.trim(p[t]) !== "" && (h = p[t].split(":"), s = a.Z.trim(h[0].replace(/-([a-z])/gi, function(u, v) {
        return v.toUpperCase();
      })), n = a.Z.trim(h[1]), l.push({ key: s, val: n }));
    return l;
  }, updateTextStyle: function(e, t) {
    var o, s, n, h, l, p, u, v, Z, y = e.visProp, O = M.Z.isBrowser ? y.display : "internal", S = ["rendNode", "rendNodeTag", "rendNodeLabel"], R = S.length, L = a.Z.evaluate(y.fontunit), B = ["cssdefaultstyle", "cssstyle"], X = B.length;
    if (t ? (n = y.highlightstrokecolor, s = y.highlightstrokeopacity, h = y.highlightcssclass) : (n = y.strokecolor, s = y.strokeopacity, h = y.cssclass), this.type !== "no" && (O === "html" || this.type !== "canvas")) {
      for (v = 0; v < X; v++)
        if ((Z = a.Z.evaluate(y[(t ? "highlight" : "") + B[v]])) !== "" && e.visPropOld[B[v]] !== Z) {
          for (p = this._css2js(Z), l = 0; l < R; l++)
            if (a.Z.exists(e[S[l]]))
              for (u in p)
                p.hasOwnProperty(u) && (e[S[l]].style[p[u].key] = p[u].val);
          e.visPropOld[B[v]] = Z;
        }
      if (o = a.Z.evaluate(y.fontsize), e.visPropOld.fontsize !== o) {
        e.needsSizeUpdate = !0;
        try {
          for (l = 0; l < R; l++)
            a.Z.exists(e[S[l]]) && (e[S[l]].style.fontSize = o + L);
        } catch {
          for (l = 0; l < R; l++)
            a.Z.exists(e[S[l]]) && (e[S[l]].style.fontSize = o);
        }
        e.visPropOld.fontsize = o;
      }
    }
    return this.setTabindex(e), this.setObjectTransition(e), O === "html" && this.type !== "no" ? (e.visPropOld.cssclass !== h && (e.rendNode.className = h, e.visPropOld.cssclass = h, e.needsSizeUpdate = !0), this.setObjectStrokeColor(e, n, s)) : this.updateInternalTextStyle(e, n, s), this;
  }, updateInternalTextStyle: function(e, t, o) {
    this.setObjectStrokeColor(e, t, o);
  }, drawImage: function(e) {
  }, updateImage: function(e) {
    this.updateRectPrim(e.rendNode, e.coords.scrCoords[1], e.coords.scrCoords[2] - e.size[1], e.size[0], e.size[1]), this.updateImageURL(e), this.transformImage(e, e.transformations), this._updateVisual(e, { stroke: !0, dash: !0 }, !0);
  }, joinTransforms: function(e, t) {
    var o, s = e.board.origin.scrCoords[1], n = e.board.origin.scrCoords[2], h = e.board.unitX, l = e.board.unitY, p = t.length, u = [[1, 0, 0], [-s / h, 1 / h, 0], [n / l, 0, -1 / l]];
    for (o = 0; o < p; o++)
      u = k.Z.matMatMult(t[o].matrix, u);
    return u = k.Z.matMatMult([[1, 0, 0], [s, h, 0], [n, 0, -l]], u);
  }, transformImage: function(e, t) {
  }, updateImageURL: function(e) {
  }, updateImageStyle: function(e, t) {
    e.rendNode.className = a.Z.evaluate(t ? e.visProp.highlightcssclass : e.visProp.cssclass);
  }, drawForeignObject: function(e) {
  }, updateForeignObject: function(e) {
  }, appendChildPrim: function(e, t) {
  }, appendNodesToElement: function(e, t) {
  }, createPrim: function(e, t) {
    return null;
  }, remove: function(e) {
  }, makeArrows: function(e, t) {
  }, _setArrowWidth: function(e, t, o) {
  }, updateEllipsePrim: function(e, t, o, s, n) {
  }, updateLinePrim: function(e, t, o, s, n, h) {
  }, updatePathPrim: function(e, t, o) {
  }, updatePathStringPoint: function(e, t, o) {
  }, updatePathStringPrim: function(e) {
  }, updatePathStringBezierPrim: function(e) {
  }, updatePolygonPrim: function(e, t) {
  }, updateRectPrim: function(e, t, o, s, n) {
  }, setPropertyPrim: function(e, t, o) {
  }, setTabindex: function(e) {
    var t;
    e.board.attr.keyboard.enabled && a.Z.exists(e.rendNode) && (t = a.Z.evaluate(e.visProp.tabindex), e.visPropCalc.visible && !a.Z.evaluate(e.visProp.fixed) || (t = null), t !== e.visPropOld.tabindex && (e.rendNode.setAttribute("tabindex", t), e.visPropOld.tabindex = t));
  }, display: function(e, t) {
    e && (e.visPropOld.visible = t);
  }, show: function(e) {
  }, hide: function(e) {
  }, setBuffering: function(e, t) {
  }, setDashStyle: function(e) {
  }, setDraft: function(e) {
    if (a.Z.evaluate(e.visProp.draft)) {
      var t = e.board.options.elements.draft.color, o = e.board.options.elements.draft.opacity;
      this.setObjectTransition(e), e.type === x.Z.OBJECT_TYPE_POLYGON ? this.setObjectFillColor(e, t, o) : (e.elementClass === x.Z.OBJECT_CLASS_POINT ? this.setObjectFillColor(e, t, o) : this.setObjectFillColor(e, "none", 0), this.setObjectStrokeColor(e, t, o), this.setObjectStrokeWidth(e, e.board.options.elements.draft.strokeWidth));
    }
  }, removeDraft: function(e) {
    this.setObjectTransition(e), e.type === x.Z.OBJECT_TYPE_POLYGON ? this.setObjectFillColor(e, e.visProp.fillcolor, e.visProp.fillopacity) : (e.type === x.Z.OBJECT_CLASS_POINT && this.setObjectFillColor(e, e.visProp.fillcolor, e.visProp.fillopacity), this.setObjectStrokeColor(e, e.visProp.strokecolor, e.visProp.strokeopacity), this.setObjectStrokeWidth(e, e.visProp.strokewidth));
  }, setGradient: function(e) {
  }, updateGradient: function(e) {
  }, setObjectTransition: function(e, t) {
  }, setObjectFillColor: function(e, t, o) {
  }, setObjectStrokeColor: function(e, t, o) {
  }, setObjectStrokeWidth: function(e, t) {
  }, setShadow: function(e) {
  }, highlight: function(e) {
    var t, o, s = e.visProp;
    if (this.setObjectTransition(e), !s.draft) {
      if (e.type === x.Z.OBJECT_TYPE_POLYGON)
        for (this.setObjectFillColor(e, s.highlightfillcolor, s.highlightfillopacity), t = 0; t < e.borders.length; t++)
          this.setObjectStrokeColor(e.borders[t], e.borders[t].visProp.highlightstrokecolor, e.borders[t].visProp.highlightstrokeopacity);
      else
        e.elementClass === x.Z.OBJECT_CLASS_TEXT ? this.updateTextStyle(e, !0) : e.type === x.Z.OBJECT_TYPE_IMAGE ? (this.updateImageStyle(e, !0), this.setObjectFillColor(e, s.highlightfillcolor, s.highlightfillopacity)) : (this.setObjectStrokeColor(e, s.highlightstrokecolor, s.highlightstrokeopacity), this.setObjectFillColor(e, s.highlightfillcolor, s.highlightfillopacity));
      s.highlightstrokewidth && (o = Math.max(a.Z.evaluate(s.highlightstrokewidth), a.Z.evaluate(s.strokewidth)), this.setObjectStrokeWidth(e, o), e.elementClass !== x.Z.OBJECT_CLASS_LINE && e.elementClass !== x.Z.OBJECT_CLASS_CURVE || this.updatePathWithArrowHeads(e, !0));
    }
    return this;
  }, noHighlight: function(e) {
    var t, o, s = e.visProp;
    if (this.setObjectTransition(e), !a.Z.evaluate(e.visProp.draft)) {
      if (e.type === x.Z.OBJECT_TYPE_POLYGON)
        for (this.setObjectFillColor(e, s.fillcolor, s.fillopacity), t = 0; t < e.borders.length; t++)
          this.setObjectStrokeColor(e.borders[t], e.borders[t].visProp.strokecolor, e.borders[t].visProp.strokeopacity);
      else
        e.elementClass === x.Z.OBJECT_CLASS_TEXT ? this.updateTextStyle(e, !1) : e.type === x.Z.OBJECT_TYPE_IMAGE ? (this.updateImageStyle(e, !1), this.setObjectFillColor(e, s.fillcolor, s.fillopacity)) : (this.setObjectStrokeColor(e, s.strokecolor, s.strokeopacity), this.setObjectFillColor(e, s.fillcolor, s.fillopacity));
      o = a.Z.evaluate(s.strokewidth), this.setObjectStrokeWidth(e, o), e.elementClass !== x.Z.OBJECT_CLASS_LINE && e.elementClass !== x.Z.OBJECT_CLASS_CURVE || this.updatePathWithArrowHeads(e, !1);
    }
    return this;
  }, suspendRedraw: function() {
  }, unsuspendRedraw: function() {
  }, drawZoomBar: function(e, t) {
    var o, s, n = function(l) {
      l || (l = window.event), l.stopPropagation ? l.stopPropagation() : l.cancelBubble = !0;
    }, h = function(l, p, u) {
      var v;
      u = u || "", (v = o.createElement("span")).innerHTML = l, v.style.paddingLeft = "7px", v.style.paddingRight = "7px", v.classList !== void 0 && v.classList.add("JXG_navigation_button"), v.setAttribute("id", u), s.appendChild(v), M.Z.addEvent(v, "click", function(Z) {
        return a.Z.bind(p, e)(), !1;
      }, e), M.Z.addEvent(v, "mouseup", n, e), M.Z.addEvent(v, "mousedown", n, e), M.Z.addEvent(v, "touchend", n, e), M.Z.addEvent(v, "touchstart", n, e);
    };
    M.Z.isBrowser && this.type !== "no" && (o = e.containerObj.ownerDocument, (s = o.createElement("div")).setAttribute("id", e.container + "_navigationbar"), s.style.color = t.strokecolor, s.style.backgroundColor = t.fillcolor, s.style.padding = t.padding, s.style.position = t.position, s.style.fontSize = t.fontsize, s.style.cursor = t.cursor, s.style.zIndex = t.zindex, e.containerObj.appendChild(s), s.style.right = t.right, s.style.bottom = t.bottom, s.classList !== void 0 && s.classList.add("JXG_navigation"), e.attr.showfullscreen && h(e.attr.fullscreen.symbol, function() {
      e.toFullscreen(e.attr.fullscreen.id);
    }, e.container + "_navigation_fullscreen"), e.attr.showscreenshot && h(e.attr.screenshot.symbol, function() {
      window.setTimeout(function() {
        e.renderer.screenshot(e, "", !1);
      }, 330);
    }, e.container + "_navigation_screenshot"), e.attr.showreload && h("↻", function() {
      e.reload();
    }, e.container + "_navigation_reload"), e.attr.showcleartraces && h("⊗", function() {
      e.clearTraces();
    }, e.container + "_navigation_cleartraces"), e.attr.shownavigation && (e.attr.showzoom && (h("–", e.zoomOut, e.container + "_navigation_out"), h("o", e.zoom100, e.container + "_navigation_100"), h("+", e.zoomIn, e.container + "_navigation_in")), h("←", e.clickLeftArrow, e.container + "_navigation_left"), h("↓", e.clickUpArrow, e.container + "_navigation_down"), h("↑", e.clickDownArrow, e.container + "_navigation_up"), h("→", e.clickRightArrow, e.container + "_navigation_right")));
  }, getElementById: function(e) {
    var t;
    return a.Z.exists(this.container) ? (t = this.container.id + "_" + e, a.Z.exists(CSS) && a.Z.exists(CSS.escape) && (t = CSS.escape(t)), this.container.querySelector("#" + t)) : "";
  }, removeToInsertLater: function(e) {
    var t = e.parentNode, o = e.nextSibling;
    if (t !== null)
      return t.removeChild(e), function() {
        o ? t.insertBefore(e, o) : t.appendChild(e);
      };
  }, resize: function(e, t) {
  }, createTouchpoints: function(e) {
  }, showTouchpoint: function(e) {
  }, hideTouchpoint: function(e) {
  }, updateTouchpoint: function(e, t) {
  }, dumpToDataURI: function(e) {
  }, dumpToCanvas: function(e, t, o, s) {
  }, screenshot: function(e) {
  }, setLayer: function(e, t) {
  } });
  const se = d.Z.AbstractRenderer;
  d.Z.FileReader = { handleRemoteFile: function(e, t, o, s, n, h) {
    var l = !1;
    try {
      l = new XMLHttpRequest(), o.toLowerCase() === "raw" ? l.overrideMimeType("text/plain; charset=" + n) : l.overrideMimeType("text/xml; charset=" + n);
    } catch {
      try {
        l = new ActiveXObject("Msxml2.XMLHTTP");
      } catch {
        try {
          l = new ActiveXObject("Microsoft.XMLHTTP");
        } catch {
          l = !1;
        }
      }
    }
    if (l) {
      l.open("GET", e, s), o.toLowerCase() === "raw" ? this.cbp = function() {
        var p = l;
        p.readyState === 4 && t(p.responseText);
      } : this.cbp = function() {
        var p = l, u = "";
        p.readyState === 4 && (u = !a.Z.exists(p.responseStream) || p.responseText.slice(0, 2) !== "PK" && U.asciiCharCodeAt(p.responseText.slice(0, 1), 0) !== 31 ? p.responseText : V.decode(jxgBinFileReader(p)), this.parseString(u, t, o, h));
      }, this.cb = a.Z.bind(this.cbp, this), l.onreadystatechange = this.cb;
      try {
        l.send(null);
      } catch {
        throw new Error("JSXGraph: A problem occurred while trying to read remote file '" + e + "'.");
      }
    } else
      d.Z.debug("AJAX not activated!");
  }, handleLocalFile: function(e, t, o, s, n, h) {
    a.Z.exists(s) || (s = !0), o.toLowerCase() === "raw" ? this.cbp = function(p) {
      t(p.target.result);
    } : this.cbp = function(p) {
      var u = p.target.result;
      this.parseString(u, t, o, h);
    }, this.cb = a.Z.bind(this.cbp, this);
    var l = new FileReader();
    l.onload = this.cb, o.toLowerCase() === "raw" ? l.readAsText(e) : l.readAsText(e, n);
  }, parseFileContent: function(e, t, o, s, n, h) {
    a.Z.isString(e) || FileReader === void 0 ? this.handleRemoteFile(e, t, o, s, n, h) : this.handleLocalFile(e, t, o, s, n, h);
  }, parseString: function(e, t, o, s) {
    var n;
    if (o = o.toLowerCase(), n = d.Z.readers[o], a.Z.exists(n))
      new n(t, e).read();
    else if (o !== "jessiecode")
      throw new Error("JSXGraph: There is no reader available for '" + o + "'.");
    a.Z.isFunction(s) && s(t);
  } }, !M.Z.isMetroApp() && M.Z.isBrowser && typeof navigator == "object" && /msie/i.test(navigator.userAgent) && !/opera/i.test(navigator.userAgent) && document && document.write && document.write(`<script type="text/vbscript">
Function Base64Encode(inData)
  Const Base64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"
  Dim cOut, sOut, I
  For I = 1 To LenB(inData) Step 3
    Dim nGroup, pOut, sGroup
    nGroup = &H10000 * AscB(MidB(inData, I, 1)) + _
      &H100 * MyASC(MidB(inData, I + 1, 1)) + MyASC(MidB(inData, I + 2, 1))
    nGroup = Oct(nGroup)
    nGroup = String(8 - Len(nGroup), "0") & nGroup
    pOut = Mid(Base64, CLng("&o" & Mid(nGroup, 1, 2)) + 1, 1) + _
      Mid(Base64, CLng("&o" & Mid(nGroup, 3, 2)) + 1, 1) + _
      Mid(Base64, CLng("&o" & Mid(nGroup, 5, 2)) + 1, 1) + _
      Mid(Base64, CLng("&o" & Mid(nGroup, 7, 2)) + 1, 1)
    sOut = sOut + pOut
  Next
  Select Case LenB(inData) Mod 3
    Case 1: '8 bit final
      sOut = Left(sOut, Len(sOut) - 2) + "=="
    Case 2: '16 bit final
      sOut = Left(sOut, Len(sOut) - 1) + "="
  End Select
  Base64Encode = sOut
End Function

Function MyASC(OneChar)
  If OneChar = "" Then MyASC = 0 Else MyASC = AscB(OneChar)
End Function

Function jxgBinFileReader(xhr)
    Dim byteString
    Dim b64String
    Dim i
    byteString = xhr.responseBody
    ReDim byteArray(LenB(byteString))
    For i = 1 To LenB(byteString)
        byteArray(i-1) = AscB(MidB(byteString, i, 1))
    Next
    b64String = Base64Encode(byteString)
    jxgBinFileReader = b64String
End Function
<\/script>
`);
  const de = d.Z.FileReader;
  var ae = __webpack_require__(632), ce = __webpack_require__(254), fe = __webpack_require__(327);
  d.Z.Composition = function(e) {
    var t, o = this, s = ["setAttribute", "setParents", "prepareUpdate", "updateRenderer", "update", "fullUpdate", "highlight", "noHighlight"], n = function(h) {
      return function() {
        var l;
        for (l in o.elements)
          o.elements.hasOwnProperty(l) && a.Z.exists(o.elements[l][h]) && o.elements[l][h].apply(o.elements[l], arguments);
        return o;
      };
    };
    for (t = 0; t < s.length; t++)
      this[s[t]] = n(s[t]);
    for (t in this.elements = {}, this.objects = this.elements, this.elementsByName = {}, this.objectsList = [], this.groups = {}, this.methodMap = { setAttribute: "setAttribute", setProperty: "setAttribute", setParents: "setParents", add: "add", remove: "remove", select: "select" }, e)
      e.hasOwnProperty(t) && this.add(t, e[t]);
    this.dump = !0, this.subs = {};
  }, d.Z.extend(d.Z.Composition.prototype, { add: function(e, t) {
    return !(a.Z.exists(this[e]) || !a.Z.exists(t)) && (a.Z.exists(t.id) ? this.elements[t.id] = t : this.elements[e] = t, a.Z.exists(t.name) && (this.elementsByName[t.name] = t), t.on("attribute:name", this.nameListener, this), this.objectsList.push(t), this[e] = t, this.methodMap[e] = t, !0);
  }, remove: function(e) {
    var t, o = !1;
    for (t in this.elements)
      if (this.elements.hasOwnProperty(t) && this.elements[t].id === this[e].id) {
        o = !0;
        break;
      }
    return o && (delete this.elements[this[e].id], delete this[e]), o;
  }, nameListener: function(e, t, o) {
    delete this.elementsByName[e], this.elementsByName[t] = o;
  }, select: function(e) {
    return a.Z.exists(d.Z.Board) ? d.Z.Board.prototype.select.call(this, e) : new d.Z.Composition();
  }, getParents: function() {
    return this.parents;
  }, getType: function() {
    return this.elType;
  }, getAttributes: function() {
    var e;
    for (e in this.subs)
      this.subs.hasOwnProperty(e) && this.subs[e].visProp;
    return this.attr;
  } });
  const Re = d.Z.Composition;
  d.Z.Board = function(e, t, o, s, n, h, l, p, u, v, Z) {
    if (this.BOARD_MODE_NONE = 0, this.BOARD_MODE_DRAG = 1, this.BOARD_MODE_MOVE_ORIGIN = 2, this.BOARD_MODE_ZOOM = 17, this.BOARD_QUALITY_LOW = 1, this.BOARD_QUALITY_HIGH = 2, a.Z.exists(Z.document) && Z.document !== !1 ? this.document = Z.document : M.Z.isBrowser && (this.document = document), this.container = e, this.containerObj = M.Z.isBrowser ? this.document.getElementById(this.container) : null, M.Z.isBrowser && t.type !== "no" && this.containerObj === null)
      throw new Error(`
JSXGraph: HTML container element '` + e + "' not found.");
    this.renderer = t, this.grids = [], this.options = a.Z.deepCopy(te.Z), this.attr = Z, this.dimension = 2, this.jc = new ce.Z(), this.jc.use(this), this.origin = {}, this.origin.usrCoords = [1, 0, 0], this.origin.scrCoords = [1, s[0], s[1]], this.zoomX = n, this.zoomY = h, this.unitX = l * this.zoomX, this.unitY = p * this.zoomY, this.keepaspectratio = !1, this.canvasWidth = u, this.canvasHeight = v, a.Z.exists(o) && o !== "" && M.Z.isBrowser && !a.Z.exists(this.document.getElementById(o)) ? this.id = o : this.id = this.generateId(), j.Z.eventify(this), this.hooks = [], this.dependentBoards = [], this.inUpdate = !1, this.objects = {}, this.objectsList = [], this.groups = {}, this.animationObjects = {}, this.highlightedObjects = {}, this.numObjects = 0, this.elementsByName = {}, this.mode = this.BOARD_MODE_NONE, this.updateQuality = this.BOARD_QUALITY_HIGH, this.isSuspendedRedraw = !1, this.calculateSnapSizes(), this.drag_dx = 0, this.drag_dy = 0, this.drag_position = [0, 0], this.mouse = {}, this.touches = [], this.xmlString = "", this.cPos = [], this.touchMoveLast = 0, this.touchMoveLastId = 1 / 0, this.positionAccessLast = 0, this.downObjects = [], this.focusObjects = [], this.attr.showcopyright && this.renderer.displayCopyright(x.Z.licenseText, parseInt(this.options.text.fontSize, 10)), this.needsFullUpdate = !1, this.reducedUpdate = !1, this.currentCBDef = "none", this.geonextCompatibilityMode = !1, this.options.text.useASCIIMathML && translateASCIIMath ? init() : this.options.text.useASCIIMathML = !1, this.hasMouseHandlers = !1, this.hasTouchHandlers = !1, this.hasPointerHandlers = !1, this.hasMouseUp = !1, this.hasTouchEnd = !1, this.hasPointerUp = !1, this._drag_offset = [0, 0], this._inputDevice = "mouse", this._board_touches = [], this.selectingMode = !1, this.isSelecting = !1, this._isScrolling = !1, this._isResizing = !1, this.selectingBox = [[0, 0], [0, 0]], this.userLog = [], this.mathLib = Math, this.mathLibJXG = d.Z.Math, this.attr.registerevents && this.addEventHandlers(), this.attr.registerresizeevent && this.addResizeEventHandlers(), this.attr.registerfullscreenevent && this.addFullscreenEventHandlers(), this.methodMap = { update: "update", fullUpdate: "fullUpdate", on: "on", off: "off", trigger: "trigger", setView: "setBoundingBox", setBoundingBox: "setBoundingBox", migratePoint: "migratePoint", colorblind: "emulateColorblindness", suspendUpdate: "suspendUpdate", unsuspendUpdate: "unsuspendUpdate", clearTraces: "clearTraces", left: "clickLeftArrow", right: "clickRightArrow", up: "clickUpArrow", down: "clickDownArrow", zoomIn: "zoomIn", zoomOut: "zoomOut", zoom100: "zoom100", zoomElements: "zoomElements", remove: "removeObject", removeObject: "removeObject" };
  }, d.Z.extend(d.Z.Board.prototype, { generateName: function(e) {
    var t, o, s = this.attr.maxnamelength, n = "", h = "", l = [], p = "";
    if (e.type === x.Z.OBJECT_TYPE_TICKS)
      return "";
    for (t = a.Z.isPoint(e) || a.Z.isPoint3D(e) ? ["", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"] : e.type === x.Z.OBJECT_TYPE_ANGLE ? ["", "&alpha;", "&beta;", "&gamma;", "&delta;", "&epsilon;", "&zeta;", "&eta;", "&theta;", "&iota;", "&kappa;", "&lambda;", "&mu;", "&nu;", "&xi;", "&omicron;", "&pi;", "&rho;", "&sigma;", "&tau;", "&upsilon;", "&phi;", "&chi;", "&psi;", "&omega;"] : ["", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"], a.Z.isPoint(e) || e.elementClass === x.Z.OBJECT_CLASS_LINE || e.type === x.Z.OBJECT_TYPE_ANGLE || (n = e.type === x.Z.OBJECT_TYPE_POLYGON ? "P_{" : e.elementClass === x.Z.OBJECT_CLASS_CIRCLE ? "k_{" : e.elementClass === x.Z.OBJECT_CLASS_TEXT ? "t_{" : "s_{", h = "}"), o = 0; o < s; o++)
      l[o] = 0;
    for (; l[s - 1] < t.length; ) {
      for (l[0] = 1; l[0] < t.length; l[0]++) {
        for (p = n, o = s; o > 0; o--)
          p += t[l[o - 1]];
        if (!a.Z.exists(this.elementsByName[p + h]))
          return p + h;
      }
      for (l[0] = t.length, o = 1; o < s; o++)
        l[o - 1] === t.length && (l[o - 1] = 1, l[o] += 1);
    }
    return "";
  }, generateId: function() {
    for (var e = 1; a.Z.exists(d.Z.boards["jxgBoard" + e]); )
      e = Math.round(65535 * Math.random());
    return "jxgBoard" + e;
  }, setId: function(e, t) {
    var o, s = this.numObjects, n = e.id;
    if (this.numObjects += 1, n === "" || !a.Z.exists(n))
      for (n = this.id + t + s; a.Z.exists(this.objects[n]); )
        o = Math.round(65535 * Math.random()), n = this.id + t + s + "-" + o;
    return e.id = n, this.objects[n] = e, e._pos = this.objectsList.length, this.objectsList[this.objectsList.length] = e, n;
  }, finalizeAdding: function(e) {
    a.Z.evaluate(e.visProp.visible) === !1 && this.renderer.display(e, !1);
  }, finalizeLabel: function(e) {
    e.hasLabel && !a.Z.evaluate(e.label.visProp.islabel) && a.Z.evaluate(e.label.visProp.visible) === !1 && this.renderer.display(e.label, !1);
  }, checkFrameRate: function(e) {
    var t = !1, o = (/* @__PURE__ */ new Date()).getTime();
    return a.Z.exists(e.pointerId) && this.touchMoveLastId !== e.pointerId && (t = !0, this.touchMoveLastId = e.pointerId), !t && (o - this.touchMoveLast) * this.attr.maxframerate >= 1e3 && (t = !0), t && (this.touchMoveLast = o), t;
  }, getCoordsTopLeftCorner: function() {
    var e, t, o, s, n, h = this.document.ownerDocument || this.document, l = h.documentElement || this.document.body.parentNode, p = h.body, u = this.containerObj;
    if (this.cPos.length > 0 && (this.mode === this.BOARD_MODE_DRAG || this.mode === this.BOARD_MODE_MOVE_ORIGIN || (/* @__PURE__ */ new Date()).getTime() - this.positionAccessLast < 1e3))
      return this.cPos;
    if (this.positionAccessLast = (/* @__PURE__ */ new Date()).getTime(), u.getBoundingClientRect) {
      for (o = u.getBoundingClientRect(), s = 1, n = u; n && a.Z.exists(n.parentNode); )
        a.Z.exists(n.style) && a.Z.exists(n.style.zoom) && n.style.zoom !== "" && (s *= parseFloat(n.style.zoom)), n = n.parentNode;
      return (e = [o.left * s, o.top * s])[0] += M.Z.getProp(u, "border-left-width"), e[1] += M.Z.getProp(u, "border-top-width"), this.renderer.type !== "vml" && (e[0] += M.Z.getProp(u, "padding-left"), e[1] += M.Z.getProp(u, "padding-top")), this.cPos = e.slice(), this.cPos;
    }
    return e = M.Z.getOffset(u), t = this.document.documentElement.ownerDocument, !this.containerObj.currentStyle && t.defaultView && (e[0] += M.Z.getProp(l, "margin-left"), e[1] += M.Z.getProp(l, "margin-top"), e[0] += M.Z.getProp(l, "border-left-width"), e[1] += M.Z.getProp(l, "border-top-width"), e[0] += M.Z.getProp(l, "padding-left"), e[1] += M.Z.getProp(l, "padding-top")), p && (e[0] += M.Z.getProp(p, "left"), e[1] += M.Z.getProp(p, "top")), typeof google == "object" && google.translate && (e[0] += 10, e[1] += 25), e[0] += M.Z.getProp(u, "border-left-width"), e[1] += M.Z.getProp(u, "border-top-width"), this.renderer.type !== "vml" && (e[0] += M.Z.getProp(u, "padding-left"), e[1] += M.Z.getProp(u, "padding-top")), e[0] += this.attr.offsetx, e[1] += this.attr.offsety, this.cPos = e.slice(), this.cPos;
  }, getMousePosition: function(e, t) {
    var o, s, n = this.getCoordsTopLeftCorner();
    return o = M.Z.getPosition(e, t, this.document), a.Z.exists(this.cssTransMat) || this.updateCSSTransforms(), s = [1, o[0] - n[0], o[1] - n[1]], (s = k.Z.matVecMult(this.cssTransMat, s))[1] /= s[0], s[2] /= s[0], [s[1], s[2]];
  }, initMoveOrigin: function(e, t) {
    this.drag_dx = e - this.origin.scrCoords[1], this.drag_dy = t - this.origin.scrCoords[2], this.mode = this.BOARD_MODE_MOVE_ORIGIN, this.updateQuality = this.BOARD_QUALITY_LOW;
  }, initMoveObject: function(e, t, o, s) {
    var n, h, l, p = [], u = [], v = this.objectsList.length, Z = { visProp: { layer: -1e4 } };
    for (h = 0; h < v; h++)
      l = (n = this.objectsList[h]).hasPoint && n.hasPoint(e, t), n.visPropCalc.visible && l && (n.triggerEventHandlers([s + "down", "down"], [o]), this.downObjects.push(n)), l && n.isDraggable && n.visPropCalc.visible && (this.geonextCompatibilityMode && (a.Z.isPoint(n) || n.elementClass === x.Z.OBJECT_CLASS_TEXT) || !this.geonextCompatibilityMode) && !a.Z.evaluate(n.visProp.fixed) && (n.visProp.layer > Z.visProp.layer || n.visProp.layer === Z.visProp.layer && n.lastDragTime.getTime() >= Z.lastDragTime.getTime()) && (this.attr.ignorelabels && a.Z.exists(Z.label) && n === Z.label || (Z = n, p.push(Z), a.Z.exists(Z.coords) ? u.push(m.Z.subtract(Z.coords.scrCoords.slice(1), [e, t])) : u.push([0, 0])));
    return this.attr.drag.enabled && p.length > 0 && (this.mode = this.BOARD_MODE_DRAG), this.attr.takefirst ? (p.length = 1, this._drag_offset = u[0]) : (p = p.slice(-1), this._drag_offset = u[u.length - 1]), this._drag_offset || (this._drag_offset = [0, 0]), this.renderer.type === "svg" && a.Z.exists(p[0]) && a.Z.evaluate(p[0].visProp.dragtotopoflayer) && p.length === 1 && a.Z.exists(p[0].rendNode) && p[0].rendNode.parentNode.appendChild(p[0].rendNode), this.previousRotation = 0, this.previousScale = 1, p.length >= 1 && (p[0].highlight(!0), this.triggerEventHandlers(["mousehit", "hit"], [o, p[0]])), p;
  }, moveObject: function(e, t, o, s, n) {
    var h, l, p, u = new b.Z(x.Z.COORDS_BY_SCREEN, this.getScrCoordsOfMouse(e, t), this);
    o && o.obj && ((h = o.obj).coords && (l = h.coords.scrCoords.slice()), this.addLogEntry("drag", h, u.usrCoords.slice(1)), this.drag_position = [u.scrCoords[1], u.scrCoords[2]], this.drag_position = m.Z.add(this.drag_position, this._drag_offset), a.Z.exists(h.coords) ? h.setPositionDirectly(x.Z.COORDS_BY_SCREEN, this.drag_position) : (this.displayInfobox(!1), isNaN(o.targets[0].Xprev + o.targets[0].Yprev) || h.setPositionDirectly(x.Z.COORDS_BY_SCREEN, [u.scrCoords[1], u.scrCoords[2]], [o.targets[0].Xprev, o.targets[0].Yprev]), o.targets[0].Xprev = u.scrCoords[1], o.targets[0].Yprev = u.scrCoords[2]), a.Z.exists(h.coords) && (h.prepareUpdate().update(!1).updateRenderer(), this.updateInfobox(h), h.prepareUpdate().update(!0).updateRenderer()), h.coords && (p = h.coords.scrCoords), h.coords && l[1] === p[1] && l[2] === p[2] || (h.triggerEventHandlers([n + "drag", "drag"], [s]), this.update()), h.highlight(!0), this.triggerEventHandlers(["mousehit", "hit"], [s, h]), h.lastDragTime = /* @__PURE__ */ new Date());
  }, twoFingerMove: function(e, t, o) {
    var s;
    a.Z.exists(e) && a.Z.exists(e.obj) && ((s = e.obj).elementClass === x.Z.OBJECT_CLASS_LINE || s.type === x.Z.OBJECT_TYPE_POLYGON ? this.twoFingerTouchObject(e.targets, s, t) : s.elementClass === x.Z.OBJECT_CLASS_CIRCLE && this.twoFingerTouchCircle(e.targets, s, t), o && s.triggerEventHandlers(["touchdrag", "drag"], [o]));
  }, twoFingerTouchObject: function(e, t, o) {
    var s, n, h, l, p, u, v, Z, y, O, S, R, L, B, X, F, G = 0;
    if (a.Z.exists(e[0]) && a.Z.exists(e[1]) && !isNaN(e[0].Xprev + e[0].Yprev + e[1].Xprev + e[1].Yprev)) {
      if (o === e[0].num ? (B = e[1], X = e[0]) : (B = e[0], X = e[1]), F = new b.Z(x.Z.COORDS_BY_SCREEN, [B.Xprev, B.Yprev], this).usrCoords, n = new b.Z(x.Z.COORDS_BY_SCREEN, [X.Xprev, X.Yprev], this).usrCoords, s = new b.Z(x.Z.COORDS_BY_SCREEN, [X.X, X.Y], this).usrCoords, l = k.Z.crossProduct(F, n), h = k.Z.crossProduct(F, s), u = k.Z.crossProduct(l, h), Math.abs(u[0]) < k.Z.eps)
        return;
      if (a.Z.evaluate(t.visProp.rotatable) && (G = _.Z.rad(n.slice(1), F.slice(1), s.slice(1))), (v = this.create("transform", [G, [F[1], F[2]]], { type: "rotate" })).update(), a.Z.evaluate(t.visProp.scalable) && (p = _.Z.distance(s, F) / _.Z.distance(n, F), Z = this.create("transform", [-F[1], -F[2]], { type: "translate" }), y = this.create("transform", [p, p], { type: "scale" }), O = this.create("transform", [F[1], F[2]], { type: "translate" }), v.melt(Z).melt(y).melt(O)), t.elementClass === x.Z.OBJECT_CLASS_LINE)
        S = [], t.point1.draggable() && S.push(t.point1), t.point2.draggable() && S.push(t.point2), v.applyOnce(S);
      else if (t.type === x.Z.OBJECT_TYPE_POLYGON) {
        for (S = [], L = t.vertices.length - 1, R = 0; R < L; ++R)
          t.vertices[R].draggable() && S.push(t.vertices[R]);
        v.applyOnce(S);
      }
      this.update(), t.highlight(!0);
    }
  }, twoFingerTouchCircle: function(e, t, o) {
    var s, n, h, l, p, u, v, Z, y, O, S;
    t.method !== "pointCircle" && t.method !== "pointLine" && a.Z.exists(e[0]) && a.Z.exists(e[1]) && !isNaN(e[0].Xprev + e[0].Yprev + e[1].Xprev + e[1].Yprev) && (o === e[0].num ? (s = e[1], n = e[0]) : (s = e[0], n = e[1]), p = new b.Z(x.Z.COORDS_BY_SCREEN, [s.Xprev, s.Yprev], this).usrCoords, l = new b.Z(x.Z.COORDS_BY_SCREEN, [n.Xprev, n.Yprev], this).usrCoords, h = new b.Z(x.Z.COORDS_BY_SCREEN, [n.X, n.Y], this).usrCoords, v = _.Z.rad(l.slice(1), p.slice(1), h.slice(1)), Z = this.create("transform", [-p[1], -p[2]], { type: "translate" }), y = this.create("transform", [v], { type: "rotate" }), Z.melt(y), a.Z.evaluate(t.visProp.scalable) && (u = _.Z.distance(p, h) / _.Z.distance(p, l), O = this.create("transform", [u, u], { type: "scale" }), Z.melt(O)), S = this.create("transform", [p[1], p[2]], { type: "translate" }), Z.melt(S), t.center.draggable() && Z.applyOnce([t.center]), t.method === "twoPoints" ? t.point2.draggable() && Z.applyOnce([t.point2]) : t.method === "pointRadius" && a.Z.isNumber(t.updateRadius.origin) && t.setRadius(t.radius * u), this.update(t.center), t.highlight(!0));
  }, highlightElements: function(e, t, o, s) {
    var n, h, l, p = {}, u = this.objectsList.length;
    for (n = 0; n < u; n++)
      l = (h = this.objectsList[n]).id, a.Z.exists(h.hasPoint) && h.visPropCalc.visible && h.hasPoint(e, t) && (this.updateInfobox(h), a.Z.exists(this.highlightedObjects[l]) || (p[l] = h, h.highlight(), this.triggerEventHandlers(["mousehit", "hit"], [o, h, s])), h.mouseover ? h.triggerEventHandlers(["mousemove", "move"], [o]) : (h.triggerEventHandlers(["mouseover", "over"], [o]), h.mouseover = !0));
    for (n = 0; n < u; n++)
      l = (h = this.objectsList[n]).id, h.mouseover && (p[l] || (h.triggerEventHandlers(["mouseout", "out"], [o]), h.mouseover = !1));
  }, saveStartPos: function(e, t) {
    var o, s, n = [];
    if (e.type === x.Z.OBJECT_TYPE_TICKS)
      n.push([1, NaN, NaN]);
    else if (e.elementClass === x.Z.OBJECT_CLASS_LINE)
      n.push(e.point1.coords.usrCoords), n.push(e.point2.coords.usrCoords);
    else if (e.elementClass === x.Z.OBJECT_CLASS_CIRCLE)
      n.push(e.center.coords.usrCoords), e.method === "twoPoints" && n.push(e.point2.coords.usrCoords);
    else if (e.type === x.Z.OBJECT_TYPE_POLYGON)
      for (s = e.vertices.length - 1, o = 0; o < s; o++)
        n.push(e.vertices[o].coords.usrCoords);
    else if (e.type === x.Z.OBJECT_TYPE_SECTOR)
      n.push(e.point1.coords.usrCoords), n.push(e.point2.coords.usrCoords), n.push(e.point3.coords.usrCoords);
    else if (a.Z.isPoint(e) || e.type === x.Z.OBJECT_TYPE_GLIDER)
      n.push(e.coords.usrCoords);
    else if (e.elementClass === x.Z.OBJECT_CLASS_CURVE)
      e.points.length > 0 && n.push(e.points[0].usrCoords);
    else
      try {
        n.push(e.coords.usrCoords);
      } catch (h) {
        d.Z.debug("JSXGraph+ saveStartPos: obj.coords.usrCoords not available: " + h);
      }
    for (s = n.length, o = 0; o < s; o++)
      t.Zstart.push(n[o][0]), t.Xstart.push(n[o][1]), t.Ystart.push(n[o][2]);
  }, mouseOriginMoveStart: function(e) {
    var t, o;
    return (t = this._isRequiredKeyPressed(e, "pan")) && (o = this.getMousePosition(e), this.initMoveOrigin(o[0], o[1])), t;
  }, mouseOriginMove: function(e) {
    var t, o = this.mode === this.BOARD_MODE_MOVE_ORIGIN;
    return o && (t = this.getMousePosition(e), this.moveOrigin(t[0], t[1], !0)), o;
  }, touchStartMoveOriginOneFinger: function(e) {
    var t, o, s = e[d.Z.touchProperty];
    return (t = this.attr.pan.enabled && !this.attr.pan.needtwofingers && s.length === 1) && (o = this.getMousePosition(e, 0), this.initMoveOrigin(o[0], o[1])), t;
  }, touchOriginMove: function(e) {
    var t, o = this.mode === this.BOARD_MODE_MOVE_ORIGIN;
    return o && (t = this.getMousePosition(e, 0), this.moveOrigin(t[0], t[1], !0)), o;
  }, originMoveEnd: function() {
    this.updateQuality = this.BOARD_QUALITY_HIGH, this.mode = this.BOARD_MODE_NONE;
  }, addEventHandlers: function() {
    M.Z.supportsPointerEvents() ? this.addPointerEventHandlers() : (this.addMouseEventHandlers(), this.addTouchEventHandlers()), this.containerObj !== null && (this.containerObj.oncontextmenu = function(e) {
      return a.Z.exists(e) && e.preventDefault(), !1;
    }), this.addKeyboardEventHandlers();
  }, addResizeEventHandlers: function() {
    if (M.Z.isBrowser) {
      try {
        this.startResizeObserver();
      } catch {
        M.Z.addEvent(window, "resize", this.resizeListener, this), this.startIntersectionObserver();
      }
      M.Z.addEvent(window, "scroll", this.scrollListener, this);
    }
  }, removeEventHandlers: function() {
    this.removeMouseEventHandlers(), this.removeTouchEventHandlers(), this.removePointerEventHandlers(), this.removeFullscreenEventHandlers(), this.removeKeyboardEventHandlers(), M.Z.isBrowser && (a.Z.exists(this.resizeObserver) ? this.stopResizeObserver() : (M.Z.removeEvent(window, "resize", this.resizeListener, this), this.stopIntersectionObserver()), M.Z.removeEvent(window, "scroll", this.scrollListener, this));
  }, addPointerEventHandlers: function() {
    if (!this.hasPointerHandlers && M.Z.isBrowser) {
      var e = this.attr.movetarget || this.containerObj;
      window.navigator.msPointerEnabled ? (M.Z.addEvent(this.containerObj, "MSPointerDown", this.pointerDownListener, this), M.Z.addEvent(e, "MSPointerMove", this.pointerMoveListener, this)) : (M.Z.addEvent(this.containerObj, "pointerdown", this.pointerDownListener, this), M.Z.addEvent(e, "pointermove", this.pointerMoveListener, this)), M.Z.addEvent(this.containerObj, "mousewheel", this.mouseWheelListener, this), M.Z.addEvent(this.containerObj, "DOMMouseScroll", this.mouseWheelListener, this), this.containerObj !== null && (this.containerObj.style.touchAction = "none"), this.hasPointerHandlers = !0;
    }
  }, addMouseEventHandlers: function() {
    if (!this.hasMouseHandlers && M.Z.isBrowser) {
      var e = this.attr.movetarget || this.containerObj;
      M.Z.addEvent(this.containerObj, "mousedown", this.mouseDownListener, this), M.Z.addEvent(e, "mousemove", this.mouseMoveListener, this), M.Z.addEvent(this.containerObj, "mousewheel", this.mouseWheelListener, this), M.Z.addEvent(this.containerObj, "DOMMouseScroll", this.mouseWheelListener, this), this.hasMouseHandlers = !0;
    }
  }, addTouchEventHandlers: function(e) {
    if (!this.hasTouchHandlers && M.Z.isBrowser) {
      var t = this.attr.movetarget || this.containerObj;
      M.Z.addEvent(this.containerObj, "touchstart", this.touchStartListener, this), M.Z.addEvent(t, "touchmove", this.touchMoveListener, this), this.hasTouchHandlers = !0;
    }
  }, addFullscreenEventHandlers: function() {
    var e, t = ["fullscreenchange", "mozfullscreenchange", "webkitfullscreenchange", "msfullscreenchange"], o = t.length;
    if (!this.hasFullscreenEventHandlers && M.Z.isBrowser) {
      for (e = 0; e < o; e++)
        M.Z.addEvent(this.document, t[e], this.fullscreenListener, this);
      this.hasFullscreenEventHandlers = !0;
    }
  }, addKeyboardEventHandlers: function() {
    this.attr.keyboard.enabled && !this.hasKeyboardHandlers && M.Z.isBrowser && (M.Z.addEvent(this.containerObj, "keydown", this.keyDownListener, this), M.Z.addEvent(this.containerObj, "focusin", this.keyFocusInListener, this), M.Z.addEvent(this.containerObj, "focusout", this.keyFocusOutListener, this), this.hasKeyboardHandlers = !0);
  }, removeKeyboardEventHandlers: function() {
    this.hasKeyboardHandlers && M.Z.isBrowser && (M.Z.removeEvent(this.containerObj, "keydown", this.keyDownListener, this), M.Z.removeEvent(this.containerObj, "focusin", this.keyFocusInListener, this), M.Z.removeEvent(this.containerObj, "focusout", this.keyFocusOutListener, this), this.hasKeyboardHandlers = !1);
  }, removeFullscreenEventHandlers: function() {
    var e, t = ["fullscreenchange", "mozfullscreenchange", "webkitfullscreenchange", "msfullscreenchange"], o = t.length;
    if (this.hasFullscreenEventHandlers && M.Z.isBrowser) {
      for (e = 0; e < o; e++)
        M.Z.removeEvent(this.document, t[e], this.fullscreenListener, this);
      this.hasFullscreenEventHandlers = !1;
    }
  }, removePointerEventHandlers: function() {
    if (this.hasPointerHandlers && M.Z.isBrowser) {
      var e = this.attr.movetarget || this.containerObj;
      window.navigator.msPointerEnabled ? (M.Z.removeEvent(this.containerObj, "MSPointerDown", this.pointerDownListener, this), M.Z.removeEvent(e, "MSPointerMove", this.pointerMoveListener, this)) : (M.Z.removeEvent(this.containerObj, "pointerdown", this.pointerDownListener, this), M.Z.removeEvent(e, "pointermove", this.pointerMoveListener, this)), M.Z.removeEvent(this.containerObj, "mousewheel", this.mouseWheelListener, this), M.Z.removeEvent(this.containerObj, "DOMMouseScroll", this.mouseWheelListener, this), this.hasPointerUp && (window.navigator.msPointerEnabled ? M.Z.removeEvent(this.document, "MSPointerUp", this.pointerUpListener, this) : (M.Z.removeEvent(this.document, "pointerup", this.pointerUpListener, this), M.Z.removeEvent(this.document, "pointercancel", this.pointerUpListener, this)), this.hasPointerUp = !1), this.hasPointerHandlers = !1;
    }
  }, removeMouseEventHandlers: function() {
    if (this.hasMouseHandlers && M.Z.isBrowser) {
      var e = this.attr.movetarget || this.containerObj;
      M.Z.removeEvent(this.containerObj, "mousedown", this.mouseDownListener, this), M.Z.removeEvent(e, "mousemove", this.mouseMoveListener, this), this.hasMouseUp && (M.Z.removeEvent(this.document, "mouseup", this.mouseUpListener, this), this.hasMouseUp = !1), M.Z.removeEvent(this.containerObj, "mousewheel", this.mouseWheelListener, this), M.Z.removeEvent(this.containerObj, "DOMMouseScroll", this.mouseWheelListener, this), this.hasMouseHandlers = !1;
    }
  }, removeTouchEventHandlers: function() {
    if (this.hasTouchHandlers && M.Z.isBrowser) {
      var e = this.attr.movetarget || this.containerObj;
      M.Z.removeEvent(this.containerObj, "touchstart", this.touchStartListener, this), M.Z.removeEvent(e, "touchmove", this.touchMoveListener, this), this.hasTouchEnd && (M.Z.removeEvent(this.document, "touchend", this.touchEndListener, this), this.hasTouchEnd = !1), this.hasTouchHandlers = !1;
    }
  }, clickLeftArrow: function() {
    return this.moveOrigin(this.origin.scrCoords[1] + 0.1 * this.canvasWidth, this.origin.scrCoords[2]), this;
  }, clickRightArrow: function() {
    return this.moveOrigin(this.origin.scrCoords[1] - 0.1 * this.canvasWidth, this.origin.scrCoords[2]), this;
  }, clickUpArrow: function() {
    return this.moveOrigin(this.origin.scrCoords[1], this.origin.scrCoords[2] - 0.1 * this.canvasHeight), this;
  }, clickDownArrow: function() {
    return this.moveOrigin(this.origin.scrCoords[1], this.origin.scrCoords[2] + 0.1 * this.canvasHeight), this;
  }, gestureChangeListener: function(e) {
    var t, o, s, n, h, l, p, u, v, Z, y, O, S = !1, R = this.attr.zoom.factorx, L = this.attr.zoom.factory;
    return this.mode !== this.BOARD_MODE_ZOOM || (e.preventDefault(), l = _.Z.distance([e.touches[0].clientX, e.touches[0].clientY], [e.touches[1].clientX, e.touches[1].clientY], 2), e.scale === void 0 && (e.scale = l / this.prevDist), !!a.Z.exists(this.prevCoords) && (o = [e.touches[0].clientX - this.prevCoords[0][0], e.touches[0].clientY - this.prevCoords[0][1]], s = [e.touches[1].clientX - this.prevCoords[1][0], e.touches[1].clientY - this.prevCoords[1][1]], o[0] * o[0] + o[1] * o[1] < 100 && s[0] * s[0] + s[1] * s[1] < 100 || (n = _.Z.rad(o, [0, 0], s), this.isPreviousGesture !== "pan" && Math.abs(n) > 0.2 * Math.PI && Math.abs(n) < 1.8 * Math.PI && (S = !0), this.isPreviousGesture === "pan" || S || (Math.abs(e.scale) < 0.77 || Math.abs(e.scale) > 1.3) && (S = !0), h = e.scale / this.prevScale, this.prevScale = e.scale, this.prevCoords = [[e.touches[0].clientX, e.touches[0].clientY], [e.touches[1].clientX, e.touches[1].clientY]], t = new b.Z(x.Z.COORDS_BY_SCREEN, this.getMousePosition(e, 0), this), this.attr.pan.enabled && this.attr.pan.needtwofingers && !S ? (this.isPreviousGesture = "pan", this.moveOrigin(t.scrCoords[1], t.scrCoords[2], !0)) : this.attr.zoom.enabled && Math.abs(h - 1) < 0.5 && ((this.attr.zoom.pinchhorizontal || this.attr.zoom.pinchvertical) && (p = Math.abs(e.touches[0].clientX - e.touches[1].clientX), u = Math.abs(e.touches[0].clientY - e.touches[1].clientY), v = Math.abs(Math.atan2(u, p)), O = Math.PI * this.attr.zoom.pinchsensitivity / 90), this.attr.zoom.pinchhorizontal && v < O ? (this.attr.zoom.factorx = h, this.attr.zoom.factory = 1, Z = 0, y = 0) : this.attr.zoom.pinchvertical && Math.abs(v - 0.5 * Math.PI) < O ? (this.attr.zoom.factorx = 1, this.attr.zoom.factory = h, Z = 0, y = 0) : (this.attr.zoom.factorx = h, this.attr.zoom.factory = h, Z = t.usrCoords[1], y = t.usrCoords[2]), this.zoomIn(Z, y), this.attr.zoom.factorx = R, this.attr.zoom.factory = L)), !1));
  }, gestureStartListener: function(e) {
    var t;
    return e.preventDefault(), this.prevScale = 1, this.prevDist = _.Z.distance([e.touches[0].clientX, e.touches[0].clientY], [e.touches[1].clientX, e.touches[1].clientY], 2), this.prevCoords = [[e.touches[0].clientX, e.touches[0].clientY], [e.touches[1].clientX, e.touches[1].clientY]], this.isPreviousGesture = "none", t = this.getMousePosition(e, 0), this.initMoveOrigin(t[0], t[1]), this.mode = this.BOARD_MODE_ZOOM, !1;
  }, _isRequiredKeyPressed: function(e, t) {
    var o = this.attr[t];
    return !!o.enabled && !(!(o.needshift && e.shiftKey || !o.needshift && !e.shiftKey) || !(o.needctrl && e.ctrlKey || !o.needctrl && !e.ctrlKey));
  }, _isPointerRegistered: function(e) {
    var t, o = this._board_touches.length;
    for (t = 0; t < o; t++)
      if (this._board_touches[t].pointerId === e.pointerId)
        return !0;
    return !1;
  }, _pointerStorePosition: function(e) {
    var t, o;
    for (t = 0, o = !1; t < this._board_touches.length; t++)
      if (this._board_touches[t].pointerId === e.pointerId) {
        this._board_touches[t].clientX = e.clientX, this._board_touches[t].clientY = e.clientY, o = !0;
        break;
      }
    return !o && this._board_touches.length < 2 && this._board_touches.push({ pointerId: e.pointerId, clientX: e.clientX, clientY: e.clientY }), this;
  }, _pointerRemoveTouches: function(e) {
    var t;
    for (t = 0; t < this._board_touches.length; t++)
      if (this._board_touches[t].pointerId === e.pointerId) {
        this._board_touches.splice(t, 1);
        break;
      }
    return this;
  }, _pointerClearTouches: function() {
    this._board_touches.length > 0 && this.dehighlightAll(), this.updateQuality = this.BOARD_QUALITY_HIGH, this.mode = this.BOARD_MODE_NONE, this._board_touches = [], this.touches = [];
  }, _getPointerInputDevice: function(e) {
    if (M.Z.isBrowser) {
      if (e.pointerType === "touch" || window.navigator.msMaxTouchPoints && window.navigator.msMaxTouchPoints > 1)
        return "touch";
      if (e.pointerType === "mouse")
        return "mouse";
      if (e.pointerType === "pen")
        return "pen";
    }
    return "mouse";
  }, pointerDownListener: function(e, t) {
    var o, s, n, h, l, p, u, v, Z, y, O;
    if (!t && this._isPointerRegistered(e))
      return !1;
    if (!t && e.isPrimary && this._pointerClearTouches(), this.hasPointerUp || (window.navigator.msPointerEnabled ? M.Z.addEvent(this.document, "MSPointerUp", this.pointerUpListener, this) : (M.Z.addEvent(this.document, "pointerup", this.pointerUpListener, this), M.Z.addEvent(this.document, "pointercancel", this.pointerUpListener, this)), this.hasPointerUp = !0), this.hasMouseHandlers && this.removeMouseEventHandlers(), this.hasTouchHandlers && this.removeTouchEventHandlers(), this.document.selection && a.Z.isFunction(this.document.selection.empty))
      this.document.selection.empty();
    else if (window.getSelection && (p = window.getSelection()).removeAllRanges)
      try {
        p.removeAllRanges();
      } catch {
      }
    if (this._inputDevice = this._getPointerInputDevice(e), v = this._inputDevice, this.options.precision.hasPoint = this.options.precision[v], h = this.getMousePosition(e), this._testForSelection(e), this.selectingMode)
      return this._startSelecting(h), void this.triggerEventHandlers(["touchstartselecting", "pointerstartselecting", "startselecting"], [e]);
    if (this.attr.drag.enabled && t ? (l = [t], this.mode = this.BOARD_MODE_DRAG) : l = this.initMoveObject(h[0], h[1], e, v), u = { num: e.pointerId, X: h[0], Y: h[1], Xprev: NaN, Yprev: NaN, Xstart: [], Ystart: [], Zstart: [] }, l.length > 0) {
      for (y = l[l.length - 1], Z = !1, o = 0; o < this.touches.length; o++)
        if (this.touches[o].obj === y) {
          s = o, n = this.touches[o].targets.push(u) - 1, Z = !0;
          break;
        }
      Z || (n = 0, s = this.touches.push({ obj: y, targets: [u] }) - 1), this.dehighlightAll(), y.highlight(!0), this.saveStartPos(y, this.touches[s].targets[n]), e && e.preventDefault ? e.preventDefault() : window.event && (window.event.returnValue = !1);
    }
    return this.touches.length > 0 && (e.preventDefault(), e.stopPropagation()), !!M.Z.isBrowser && (this._getPointerInputDevice(e) !== "touch" ? this.mode === this.BOARD_MODE_NONE && this.mouseOriginMoveStart(e) : (this._pointerStorePosition(e), e.touches = this._board_touches, e.touches.length === 1 && this.mode === this.BOARD_MODE_NONE && this.touchStartMoveOriginOneFinger(e) || e.touches.length !== 2 || this.mode !== this.BOARD_MODE_NONE && this.mode !== this.BOARD_MODE_MOVE_ORIGIN || (this.mode === this.BOARD_MODE_MOVE_ORIGIN && this.originMoveEnd(), this.gestureStartListener(e))), O = "none", this.mode !== this.BOARD_MODE_NONE || !a.Z.evaluate(this.attr.browserpan) || a.Z.evaluate(this.attr.pan.enabled) && !a.Z.evaluate(this.attr.pan.needtwofingers) || (O = "pan-x pan-y"), this.containerObj.style.touchAction = O, this.triggerEventHandlers(["touchstart", "down", "pointerdown", "MSPointerDown"], [e]), !0);
  }, pointerMoveListener: function(e) {
    var t, o, s, n, h;
    if (this._getPointerInputDevice(e) === "touch" && !this._isPointerRegistered(e))
      return this.BOARD_MODE_NONE;
    if (!this.checkFrameRate(e))
      return !1;
    if (this.mode !== this.BOARD_MODE_DRAG && (this.dehighlightAll(), this.displayInfobox(!1)), this.mode !== this.BOARD_MODE_NONE && (e.preventDefault(), e.stopPropagation()), this.updateQuality = this.BOARD_QUALITY_LOW, this._inputDevice = this._getPointerInputDevice(e), h = this._inputDevice, this.options.precision.hasPoint = this.options.precision[h], this.selectingMode)
      s = this.getMousePosition(e), this._moveSelecting(s), this.triggerEventHandlers(["touchmoveselecting", "moveselecting", "pointermoveselecting"], [e, this.mode]);
    else if (!this.mouseOriginMove(e))
      if (this.mode === this.BOARD_MODE_DRAG) {
        for (t = 0; t < this.touches.length; t++)
          for (n = this.touches[t].targets, o = 0; o < n.length; o++)
            if (n[o].num === e.pointerId) {
              s = this.getMousePosition(e), n[o].X = s[0], n[o].Y = s[1], n.length === 1 ? this.moveObject(s[0], s[1], this.touches[t], e, h) : n.length === 2 && (this.twoFingerMove(this.touches[t], e.pointerId, e), n[o].Xprev = s[0], n[o].Yprev = s[1]);
              break;
            }
      } else
        this._getPointerInputDevice(e) === "touch" && (this._pointerStorePosition(e), this._board_touches.length === 2 && (e.touches = this._board_touches, this.gestureChangeListener(e))), s = this.getMousePosition(e), this.highlightElements(s[0], s[1], e, -1);
    return this.triggerEventHandlers(["pointermove", "MSPointerMove", "move"], [e, this.mode]), this.updateQuality = this.BOARD_QUALITY_HIGH, this.mode === this.BOARD_MODE_NONE;
  }, pointerUpListener: function(e) {
    var t, o, s, n, h = !1;
    if (this.triggerEventHandlers(["touchend", "up", "pointerup", "MSPointerUp"], [e]), this.displayInfobox(!1), e) {
      for (t = 0; t < this.touches.length; t++)
        for (n = this.touches[t].targets, o = 0; o < n.length; o++)
          if (n[o].num === e.pointerId) {
            n.splice(o, 1), n.length === 0 && this.touches.splice(t, 1);
            break;
          }
    }
    if (this.originMoveEnd(), this.update(), this.selectingMode)
      this._stopSelecting(e), this.triggerEventHandlers(["touchstopselecting", "pointerstopselecting", "stopselecting"], [e]), this.stopSelectionMode();
    else
      for (t = this.downObjects.length - 1; t > -1; t--) {
        for (s = !1, o = 0; o < this.touches.length; o++)
          this.touches[o].obj.id === this.downObjects[t].id && (s = !0);
        s || (this.downObjects[t].triggerEventHandlers(["touchend", "up", "pointerup", "MSPointerUp"], [e]), a.Z.exists(this.downObjects[t].coords) || (this.downObjects[t].snapToGrid(), this.downObjects[t].snapToPoints(), h = !0), this.downObjects.splice(t, 1));
      }
    return this.hasPointerUp && (window.navigator.msPointerEnabled ? M.Z.removeEvent(this.document, "MSPointerUp", this.pointerUpListener, this) : (M.Z.removeEvent(this.document, "pointerup", this.pointerUpListener, this), M.Z.removeEvent(this.document, "pointercancel", this.pointerUpListener, this)), this.hasPointerUp = !1), h && this.update(), this._pointerClearTouches(), !0;
  }, touchStartListener: function(e) {
    var t, o, s, n, h, l, p, u, v, Z, y = this.options.precision.touch, O = e[d.Z.touchProperty];
    for (this.hasTouchEnd || (M.Z.addEvent(this.document, "touchend", this.touchEndListener, this), this.hasTouchEnd = !0), this.document.selection && a.Z.isFunction(this.document.selection.empty) ? this.document.selection.empty() : window.getSelection && window.getSelection().removeAllRanges(), this._inputDevice = "touch", this.options.precision.hasPoint = this.options.precision.touch, t = 0; t < O.length; t++)
      O[t].jxg_isused = !1;
    for (t = 0; t < this.touches.length; t++)
      for (Z = this.touches[t].targets, n = 0; n < Z.length; n++) {
        Z[n].num = -1, y = this.options.precision.touch;
        do {
          for (h = 0; h < O.length; h++)
            if (Math.abs(Math.pow(O[h].screenX - Z[n].X, 2) + Math.pow(O[h].screenY - Z[n].Y, 2)) < y * y) {
              Z[n].num = h, Z[n].X = O[h].screenX, Z[n].Y = O[h].screenY, O[h].jxg_isused = !0;
              break;
            }
          y *= 2;
        } while (Z[n].num === -1 && y < this.options.precision.touchMax);
        Z[n].num === -1 && (d.Z.debug("i couldn't find a targettouches for target no " + n + " on " + this.touches[t].obj.name + " (" + this.touches[t].obj.id + "). Removed the target."), d.Z.debug("eps = " + y + ", touchMax = " + te.Z.precision.touchMax), Z.splice(t, 1));
      }
    for (t = 0; t < O.length; t++)
      if (!O[t].jxg_isused) {
        if (o = this.getMousePosition(e, t), this.selectingMode)
          return this._startSelecting(o), this.triggerEventHandlers(["touchstartselecting", "startselecting"], [e]), e.preventDefault(), e.stopPropagation(), this.options.precision.hasPoint = this.options.precision.mouse, this.touches.length > 0;
        if ((s = this.initMoveObject(o[0], o[1], e, "touch")).length !== 0) {
          if (l = s[s.length - 1], v = { num: t, X: O[t].screenX, Y: O[t].screenY, Xprev: NaN, Yprev: NaN, Xstart: [], Ystart: [], Zstart: [] }, a.Z.isPoint(l) || l.elementClass === x.Z.OBJECT_CLASS_TEXT || l.type === x.Z.OBJECT_TYPE_TICKS || l.type === x.Z.OBJECT_TYPE_IMAGE)
            u = [v], this.saveStartPos(l, u[0]), this.touches.push({ obj: l, targets: u }), l.highlight(!0);
          else if (l.elementClass === x.Z.OBJECT_CLASS_LINE || l.elementClass === x.Z.OBJECT_CLASS_CIRCLE || l.elementClass === x.Z.OBJECT_CLASS_CURVE || l.type === x.Z.OBJECT_TYPE_POLYGON) {
            for (p = !1, n = 0; n < this.touches.length; n++)
              l.id === this.touches[n].obj.id && (p = !0, this.touches[n].targets.length === 1 && (this.saveStartPos(l, v), this.touches[n].targets.push(v)), O[t].jxg_isused = !0);
            p || (u = [v], this.saveStartPos(l, u[0]), this.touches.push({ obj: l, targets: u }), l.highlight(!0));
          }
        }
        O[t].jxg_isused = !0;
      }
    return this.touches.length > 0 && (e.preventDefault(), e.stopPropagation()), O.length === 1 && this.mode === this.BOARD_MODE_NONE && this.touchStartMoveOriginOneFinger(e) || O.length !== 2 || this.mode !== this.BOARD_MODE_NONE && this.mode !== this.BOARD_MODE_MOVE_ORIGIN || (this.mode === this.BOARD_MODE_MOVE_ORIGIN && this.originMoveEnd(), this.gestureStartListener(e)), this.options.precision.hasPoint = this.options.precision.mouse, this.triggerEventHandlers(["touchstart", "down"], [e]), !1;
  }, touchMoveListener: function(e) {
    var t, o, s, n, h = e[d.Z.touchProperty];
    if (!this.checkFrameRate(e))
      return !1;
    if (this.mode !== this.BOARD_MODE_NONE && (e.preventDefault(), e.stopPropagation()), this.mode !== this.BOARD_MODE_DRAG && (this.dehighlightAll(), this.displayInfobox(!1)), this._inputDevice = "touch", this.options.precision.hasPoint = this.options.precision.touch, this.updateQuality = this.BOARD_QUALITY_LOW, this.selectingMode) {
      for (t = 0; t < h.length; t++)
        if (!h[t].jxg_isused) {
          o = this.getMousePosition(e, t), this._moveSelecting(o), this.triggerEventHandlers(["touchmoves", "moveselecting"], [e, this.mode]);
          break;
        }
    } else if (!this.touchOriginMove(e))
      if (this.mode === this.BOARD_MODE_DRAG) {
        for (t = 0; t < this.touches.length; t++)
          if ((n = this.touches[t].targets).length === 1) {
            if (h[n[0].num]) {
              if ((o = this.getMousePosition(e, n[0].num))[0] < 0 || o[0] > this.canvasWidth || o[1] < 0 || o[1] > this.canvasHeight)
                return;
              n[0].X = o[0], n[0].Y = o[1], this.moveObject(o[0], o[1], this.touches[t], e, "touch");
            }
          } else if (n.length === 2 && n[0].num > -1 && n[1].num > -1 && h[n[0].num] && h[n[1].num]) {
            if (o = this.getMousePosition(e, n[0].num), s = this.getMousePosition(e, n[1].num), o[0] < 0 || o[0] > this.canvasWidth || o[1] < 0 || o[1] > this.canvasHeight || s[0] < 0 || s[0] > this.canvasWidth || s[1] < 0 || s[1] > this.canvasHeight)
              return;
            n[0].X = o[0], n[0].Y = o[1], n[1].X = s[0], n[1].Y = s[1], this.twoFingerMove(this.touches[t], n[0].num, e), this.twoFingerMove(this.touches[t], n[1].num), n[0].Xprev = o[0], n[0].Yprev = o[1], n[1].Xprev = s[0], n[1].Yprev = s[1];
          }
      } else
        h.length === 2 && this.gestureChangeListener(e), o = this.getMousePosition(e, 0), this.highlightElements(o[0], o[1], e, -1);
    return this.mode !== this.BOARD_MODE_DRAG && this.displayInfobox(!1), this.triggerEventHandlers(["touchmove", "move"], [e, this.mode]), this.options.precision.hasPoint = this.options.precision.mouse, this.updateQuality = this.BOARD_QUALITY_HIGH, this.mode === this.BOARD_MODE_NONE;
  }, touchEndListener: function(e) {
    var t, o, s, n, h, l, p = this.options.precision.touch, u = [], v = e && e[d.Z.touchProperty], Z = !1;
    if (this.triggerEventHandlers(["touchend", "up"], [e]), this.displayInfobox(!1), this.selectingMode)
      this._stopSelecting(e), this.triggerEventHandlers(["touchstopselecting", "stopselecting"], [e]), this.stopSelectionMode();
    else if (v && v.length > 0) {
      for (t = 0; t < this.touches.length; t++)
        u[t] = this.touches[t];
      for (this.touches.length = 0, t = 0; t < v.length; t++)
        v[t].jxg_isused = !1;
      for (t = 0; t < u.length; t++) {
        for (n = !1, h = 0, l = u[t].targets, o = 0; o < l.length; o++)
          for (l[o].found = !1, s = 0; s < v.length; s++)
            if (Math.abs(Math.pow(v[s].screenX - l[o].X, 2) + Math.pow(v[s].screenY - l[o].Y, 2)) < p * p) {
              l[o].found = !0, l[o].num = s, l[o].X = v[s].screenX, l[o].Y = v[s].screenY, h += 1;
              break;
            }
        if (a.Z.isPoint(u[t].obj) ? n = l[0] && l[0].found : u[t].obj.elementClass === x.Z.OBJECT_CLASS_LINE ? n = l[0] && l[0].found || l[1] && l[1].found : u[t].obj.elementClass === x.Z.OBJECT_CLASS_CIRCLE && (n = h === 1 || h === 3), n)
          for (this.touches.push({ obj: u[t].obj, targets: [] }), o = 0; o < l.length; o++)
            l[o].found && this.touches[this.touches.length - 1].targets.push({ num: l[o].num, X: l[o].screenX, Y: l[o].screenY, Xprev: NaN, Yprev: NaN, Xstart: l[o].Xstart, Ystart: l[o].Ystart, Zstart: l[o].Zstart });
        else
          u[t].obj.noHighlight();
      }
    } else
      this.touches.length = 0;
    for (t = this.downObjects.length - 1; t > -1; t--) {
      for (n = !1, o = 0; o < this.touches.length; o++)
        this.touches[o].obj.id === this.downObjects[t].id && (n = !0);
      n || (this.downObjects[t].triggerEventHandlers(["touchup", "up"], [e]), a.Z.exists(this.downObjects[t].coords) || (this.downObjects[t].snapToGrid(), this.downObjects[t].snapToPoints(), Z = !0), this.downObjects.splice(t, 1));
    }
    return v && v.length !== 0 || (this.hasTouchEnd && (M.Z.removeEvent(this.document, "touchend", this.touchEndListener, this), this.hasTouchEnd = !1), this.dehighlightAll(), this.updateQuality = this.BOARD_QUALITY_HIGH, this.originMoveEnd(), Z && this.update()), !0;
  }, mouseDownListener: function(e) {
    var t, o, s;
    if (this.document.selection && a.Z.isFunction(this.document.selection.empty) ? this.document.selection.empty() : window.getSelection && window.getSelection().removeAllRanges(), !this.hasMouseUp)
      return M.Z.addEvent(this.document, "mouseup", this.mouseUpListener, this), this.hasMouseUp = !0, this._inputDevice = "mouse", this.options.precision.hasPoint = this.options.precision.mouse, t = this.getMousePosition(e), this._testForSelection(e), this.selectingMode ? (this._startSelecting(t), void this.triggerEventHandlers(["mousestartselecting", "startselecting"], [e])) : ((o = this.initMoveObject(t[0], t[1], e, "mouse")).length === 0 ? (this.mode = this.BOARD_MODE_NONE, s = !0) : (this.mouse = { obj: null, targets: [{ X: t[0], Y: t[1], Xprev: NaN, Yprev: NaN }] }, this.mouse.obj = o[o.length - 1], this.dehighlightAll(), this.mouse.obj.highlight(!0), this.mouse.targets[0].Xstart = [], this.mouse.targets[0].Ystart = [], this.mouse.targets[0].Zstart = [], this.saveStartPos(this.mouse.obj, this.mouse.targets[0]), e && e.preventDefault ? e.preventDefault() : window.event && (window.event.returnValue = !1)), this.mode === this.BOARD_MODE_NONE && (s = this.mouseOriginMoveStart(e)), this.triggerEventHandlers(["mousedown", "down"], [e]), s);
  }, mouseMoveListener: function(e) {
    var t;
    if (!this.checkFrameRate(e))
      return !1;
    t = this.getMousePosition(e), this.updateQuality = this.BOARD_QUALITY_LOW, this.mode !== this.BOARD_MODE_DRAG && (this.dehighlightAll(), this.displayInfobox(!1)), this.selectingMode ? (this._moveSelecting(t), this.triggerEventHandlers(["mousemoveselecting", "moveselecting"], [e, this.mode])) : this.mouseOriginMove(e) || (this.mode === this.BOARD_MODE_DRAG ? this.moveObject(t[0], t[1], this.mouse, e, "mouse") : this.highlightElements(t[0], t[1], e, -1), this.triggerEventHandlers(["mousemove", "move"], [e, this.mode])), this.updateQuality = this.BOARD_QUALITY_HIGH;
  }, mouseUpListener: function(e) {
    var t;
    if (this.selectingMode === !1 && this.triggerEventHandlers(["mouseup", "up"], [e]), this.updateQuality = this.BOARD_QUALITY_HIGH, this.mouse && this.mouse.obj && (a.Z.exists(this.mouse.obj.coords) || (this.mouse.obj.snapToGrid(this.mouse.targets[0]), this.mouse.obj.snapToPoints())), this.originMoveEnd(), this.dehighlightAll(), this.update(), this.selectingMode)
      this._stopSelecting(e), this.triggerEventHandlers(["mousestopselecting", "stopselecting"], [e]), this.stopSelectionMode();
    else
      for (t = 0; t < this.downObjects.length; t++)
        this.downObjects[t].triggerEventHandlers(["mouseup", "up"], [e]);
    this.downObjects.length = 0, this.hasMouseUp && (M.Z.removeEvent(this.document, "mouseup", this.mouseUpListener, this), this.hasMouseUp = !1), this.mouse = null;
  }, mouseWheelListener: function(e) {
    if (!this.attr.zoom.wheel || !this._isRequiredKeyPressed(e, "zoom"))
      return !0;
    var t = (e = e || window.event).detail ? -e.detail : e.wheelDelta / 40, o = new b.Z(x.Z.COORDS_BY_SCREEN, this.getMousePosition(e), this);
    return t > 0 ? this.zoomIn(o.usrCoords[1], o.usrCoords[2]) : this.zoomOut(o.usrCoords[1], o.usrCoords[2]), this.triggerEventHandlers(["mousewheel"], [e]), e.preventDefault(), !1;
  }, keyDownListener: function(e) {
    var t, o, s, n, h, l, p = e.target.id, u = 0, v = 0, Z = a.Z.evaluate(this.attr.keyboard.dx) / this.unitX, y = a.Z.evaluate(this.attr.keyboard.dy) / this.unitY, O = !1, S = !0;
    return !(!this.attr.keyboard.enabled || p === "") && (!(n = this.containerObj.shadowRoot || document).activeElement || (o = n.activeElement).tagName !== "INPUT" && o.tagName !== "textarea") && (t = p.replace(this.containerObj.id + "_", ""), o = this.select(t), a.Z.exists(o.coords) && (l = o.coords.usrCoords.slice(1)), a.Z.evaluate(this.attr.keyboard.panshift) && e.shiftKey || a.Z.evaluate(this.attr.keyboard.panctrl) && e.ctrlKey ? (a.Z.evaluate(this.attr.zoom.enabled) === !0 && (O = !0), e.keyCode === 38 ? this.clickUpArrow() : e.keyCode === 40 ? this.clickDownArrow() : e.keyCode === 37 ? this.clickLeftArrow() : e.keyCode === 39 ? this.clickRightArrow() : O && e.keyCode === 171 ? this.zoomIn() : O && e.keyCode === 173 ? this.zoomOut() : O && e.keyCode === 79 ? this.zoom100() : S = !1) : (a.Z.exists(o.visProp) && (a.Z.exists(o.visProp.snaptogrid) && o.visProp.snaptogrid && a.Z.evaluate(o.visProp.snapsizex) && a.Z.evaluate(o.visProp.snapsizey) ? (u = (s = o.getSnapSizes())[0], v = s[1], Z = Math.max(u, Z), y = Math.max(v, y)) : a.Z.exists(o.visProp.attracttogrid) && o.visProp.attracttogrid && a.Z.evaluate(o.visProp.attractordistance) && a.Z.evaluate(o.visProp.attractorunit) && (v = u = 1.1 * a.Z.evaluate(o.visProp.attractordistance), a.Z.evaluate(o.visProp.attractorunit) === "screen" && (u /= this.unitX, v /= this.unitX), Z = Math.max(u, Z), y = Math.max(v, y))), e.keyCode === 38 ? h = [0, y] : e.keyCode === 40 ? h = [0, -y] : e.keyCode === 37 ? h = [-Z, 0] : e.keyCode === 39 ? h = [Z, 0] : S = !1, h && o.isDraggable && o.visPropCalc.visible && (this.geonextCompatibilityMode && (a.Z.isPoint(o) || o.elementClass === x.Z.OBJECT_CLASS_TEXT) || !this.geonextCompatibilityMode) && !a.Z.evaluate(o.visProp.fixed) && (this.mode = this.BOARD_MODE_DRAG, a.Z.exists(o.coords) && (h[0] += l[0], h[1] += l[1]), a.Z.exists(o.coords) ? (o.setPosition(d.Z.COORDS_BY_USER, h), this.updateInfobox(o)) : (this.displayInfobox(!1), o.setPositionDirectly(x.Z.COORDS_BY_USER, h, [0, 0])), this.triggerEventHandlers(["keymove", "move"], [e, this.mode]), o.triggerEventHandlers(["keydrag", "drag"], [e]), this.mode = this.BOARD_MODE_NONE)), this.update(), S && a.Z.exists(e.preventDefault) && e.preventDefault(), S);
  }, keyFocusInListener: function(e) {
    var t, o, s = e.target.id;
    if (!this.attr.keyboard.enabled || s === "")
      return !1;
    t = s.replace(this.containerObj.id + "_", ""), o = this.select(t), a.Z.exists(o.highlight) && (o.highlight(!0), this.focusObjects = [t], o.triggerEventHandlers(["hit"], [e])), a.Z.exists(o.coords) && this.updateInfobox(o);
  }, keyFocusOutListener: function(e) {
    if (!this.attr.keyboard.enabled)
      return !1;
    this.focusObjects = [], this.dehighlightAll(), this.displayInfobox(!1);
  }, updateContainerDims: function() {
    var e, t, o, s, n, h;
    e = (o = this.containerObj.getBoundingClientRect()).width, t = o.height, window && window.getComputedStyle && (s = window.getComputedStyle(this.containerObj, null), n = parseFloat(s.getPropertyValue("border-left-width")) + parseFloat(s.getPropertyValue("border-right-width")), isNaN(n) || (e -= n), h = parseFloat(s.getPropertyValue("border-top-width")) + parseFloat(s.getPropertyValue("border-bottom-width")), isNaN(h) || (t -= h)), e <= 0 || t <= 0 || isNaN(e) || isNaN(t) || (isNaN(this.getBoundingBox()[0]) && this.setBoundingBox(this.attr.boundingbox, this.keepaspectratio, "keep"), a.Z.exists(this._prevDim) && this._prevDim.w === e && this._prevDim.h === t || (this.resizeContainer(e, t, !0), this._prevDim = { w: e, h: t }));
  }, startResizeObserver: function() {
    var e = this;
    M.Z.isBrowser && this.attr.resize && this.attr.resize.enabled && (this.resizeObserver = new ResizeObserver(function(t) {
      e._isResizing || (e._isResizing = !0, window.setTimeout(function() {
        try {
          e.updateContainerDims();
        } catch {
          e.stopResizeObserver();
        } finally {
          e._isResizing = !1;
        }
      }, e.attr.resize.throttle));
    }), this.resizeObserver.observe(this.containerObj));
  }, stopResizeObserver: function() {
    M.Z.isBrowser && this.attr.resize && this.attr.resize.enabled && a.Z.exists(this.resizeObserver) && this.resizeObserver.unobserve(this.containerObj);
  }, resizeListener: function() {
    var e = this;
    M.Z.isBrowser && this.attr.resize && this.attr.resize.enabled && (this._isScrolling || this._isResizing || (this._isResizing = !0, window.setTimeout(function() {
      e.updateContainerDims(), e._isResizing = !1;
    }, this.attr.resize.throttle)));
  }, scrollListener: function(e) {
    var t = this;
    M.Z.isBrowser && (this._isScrolling || (this._isScrolling = !0, window.setTimeout(function() {
      t._isScrolling = !1;
    }, 66)));
  }, startIntersectionObserver: function() {
    var e = this;
    try {
      this.intersectionObserver = new IntersectionObserver(function(t) {
        isNaN(e.getBoundingBox()[0]) && e.updateContainerDims();
      }, { root: null, rootMargin: "0px", threshold: 0.8 }), this.intersectionObserver.observe(e.containerObj);
    } catch {
      console.log("JSXGraph: IntersectionObserver not available in this browser.");
    }
  }, stopIntersectionObserver: function() {
    a.Z.exists(this.intersectionObserver) && this.intersectionObserver.unobserve(this.containerObj);
  }, initInfobox: function() {
    var e = a.Z.copyAttributes({}, this.options, "infobox");
    return e.id = this.id + "_infobox", this.infobox = this.create("text", [0, 0, "0,0"], e), this.infobox.dump = !1, this.displayInfobox(!1), this;
  }, updateInfobox: function(e) {
    var t, o, s, n, h, l, p, u = a.Z.evaluate(e.visProp.showinfobox);
    return !a.Z.evaluate(this.attr.showinfobox) && u === "inherit" || !u || a.Z.isPoint(e) && (s = e.coords.usrCoords[1], n = e.coords.usrCoords[2], l = a.Z.evaluate(this.infobox.visProp.distancex), p = a.Z.evaluate(this.infobox.visProp.distancey), h = a.Z.evaluate(e.visProp.infoboxdigits), this.infobox.setCoords(s + l / this.unitX, n + p / this.unitY), typeof e.infoboxText != "string" ? (h === "auto" ? (t = a.Z.autoDigits(s), o = a.Z.autoDigits(n)) : a.Z.isNumber(h) ? (t = a.Z.toFixed(s, h), o = a.Z.toFixed(n, h)) : (t = s, o = n), this.highlightInfobox(t, o, e)) : this.highlightCustomInfobox(e.infoboxText, e), this.displayInfobox(!0)), this;
  }, displayInfobox: function(e) {
    return !e && this.focusObjects.length > 0 && this.select(this.focusObjects[0]).elementClass === x.Z.OBJECT_CLASS_POINT || this.infobox.hiddenByParent === e && (this.infobox.hiddenByParent = !e, this.infobox.prepareUpdate().updateVisibility(e).updateRenderer()), this;
  }, showInfobox: function(e) {
    return this.displayInfobox(e);
  }, highlightInfobox: function(e, t, o) {
    return this.highlightCustomInfobox("(" + e + ", " + t + ")", o), this;
  }, highlightCustomInfobox: function(e, t) {
    return this.infobox.setText(e), this;
  }, dehighlightAll: function() {
    var e, t, o = {}, s = !1;
    for (e in this.highlightedObjects)
      this.highlightedObjects.hasOwnProperty(e) && (t = this.highlightedObjects[e], this.focusObjects.indexOf(e) < 0 ? ((this.hasMouseHandlers || this.hasPointerHandlers) && t.noHighlight(), s = !0) : o[e] = t);
    return this.highlightedObjects = o, this.renderer.type === "canvas" && s && (this.prepareUpdate(), this.renderer.suspendRedraw(this), this.updateRenderer(), this.renderer.unsuspendRedraw()), this;
  }, getScrCoordsOfMouse: function(e, t) {
    return [e, t];
  }, getUsrCoordsOfMouse: function(e) {
    var t = this.getCoordsTopLeftCorner(), o = M.Z.getPosition(e, null, this.document), s = o[0] - t[0], n = o[1] - t[1];
    return new b.Z(x.Z.COORDS_BY_SCREEN, [s, n], this).usrCoords.slice(1);
  }, getAllUnderMouse: function(e) {
    var t = this.getAllObjectsUnderMouse(e);
    return t.push(this.getUsrCoordsOfMouse(e)), t;
  }, getAllObjectsUnderMouse: function(e) {
    var t, o, s = this.getCoordsTopLeftCorner(), n = M.Z.getPosition(e, null, this.document), h = n[0] - s[0], l = n[1] - s[1], p = [], u = this.objectsList.length;
    for (t = 0; t < u; t++)
      (o = this.objectsList[t]).visPropCalc.visible && o.hasPoint && o.hasPoint(h, l) && (p[p.length] = o);
    return p;
  }, updateCoords: function() {
    var e, t, o = this.objectsList.length;
    for (t = 0; t < o; t++)
      e = this.objectsList[t], a.Z.exists(e.coords) && (a.Z.evaluate(e.visProp.frozen) ? e.coords.screen2usr() : e.coords.usr2screen());
    return this;
  }, moveOrigin: function(e, t, o) {
    var s, n, h, l;
    return a.Z.exists(e) && a.Z.exists(t) && (s = this.origin.scrCoords[1], n = this.origin.scrCoords[2], this.origin.scrCoords[1] = e, this.origin.scrCoords[2] = t, o && (this.origin.scrCoords[1] -= this.drag_dx, this.origin.scrCoords[2] -= this.drag_dy), h = new b.Z(x.Z.COORDS_BY_SCREEN, [0, 0], this).usrCoords, l = new b.Z(x.Z.COORDS_BY_SCREEN, [this.canvasWidth, this.canvasHeight], this).usrCoords, (h[1] < this.maxboundingbox[0] || h[2] > this.maxboundingbox[1] || l[1] > this.maxboundingbox[2] || l[2] < this.maxboundingbox[3]) && (this.origin.scrCoords[1] = s, this.origin.scrCoords[2] = n)), this.updateCoords().clearTraces().fullUpdate(), this.triggerEventHandlers(["boundingbox"]), this;
  }, addConditions: function(e) {
    var t, o, s, n, h, l, p, u = [], v = e.indexOf("<data>"), Z = e.indexOf("</data>"), y = function(B, X, F, G) {
      return function() {
        var W, H;
        H = (W = B.select(X.id)).coords.usrCoords[G], G === 2 ? W.setPositionDirectly(x.Z.COORDS_BY_USER, [F(), H]) : W.setPositionDirectly(x.Z.COORDS_BY_USER, [H, F()]), W.prepareUpdate().update();
      };
    }, O = function(B, X, F) {
      return function() {
        var G, W;
        G = B.select(X.id), W = F(), G.setAttribute({ visible: W });
      };
    }, S = function(B, X, F, G) {
      return function() {
        var W, H;
        W = B.select(X.id), H = F(), G === "strokewidth" ? W.visProp.strokewidth = H : (H = fe.Z.rgba2rgbo(H), W.visProp[G + "color"] = H[0], W.visProp[G + "opacity"] = H[1]);
      };
    }, R = function(B, X, F) {
      return function() {
        B.select(X.id).position = F();
      };
    }, L = function(B, X, F) {
      return function() {
        B.select(X.id).setStyle(F());
      };
    };
    if (!(v < 0)) {
      for (; v >= 0; ) {
        if (o = (t = e.slice(v + 6, Z)).indexOf("="), s = t.slice(0, o), n = t.slice(o + 1), o = s.indexOf("."), h = s.slice(0, o), l = this.elementsByName[a.Z.unescapeHTML(h)], p = s.slice(o + 1).replace(/\s+/g, "").toLowerCase(), n = a.Z.createFunction(n, this, "", !0), a.Z.exists(this.elementsByName[h]))
          switch (p) {
            case "x":
              u.push(y(this, l, n, 2));
              break;
            case "y":
              u.push(y(this, l, n, 1));
              break;
            case "visible":
              u.push(O(this, l, n));
              break;
            case "position":
              u.push(R(this, l, n));
              break;
            case "stroke":
              u.push(S(this, l, n, "stroke"));
              break;
            case "style":
              u.push(L(this, l, n));
              break;
            case "strokewidth":
              u.push(S(this, l, n, "strokewidth"));
              break;
            case "fill":
              u.push(S(this, l, n, "fill"));
              break;
            case "label":
              break;
            default:
              d.Z.debug("property '" + p + "' in conditions not yet implemented:" + n);
          }
        else
          d.Z.debug("debug conditions: |" + h + "| undefined");
        v = (e = e.slice(Z + 7)).indexOf("<data>"), Z = e.indexOf("</data>");
      }
      this.updateConditions = function() {
        var B;
        for (B = 0; B < u.length; B++)
          u[B]();
        return this.prepareUpdate().updateElements(), !0;
      }, this.updateConditions();
    }
  }, updateConditions: function() {
    return !1;
  }, calculateSnapSizes: function() {
    var e = new b.Z(x.Z.COORDS_BY_USER, [0, 0], this), t = new b.Z(x.Z.COORDS_BY_USER, [this.options.grid.gridX, this.options.grid.gridY], this), o = e.scrCoords[1] - t.scrCoords[1], s = e.scrCoords[2] - t.scrCoords[2];
    for (this.options.grid.snapSizeX = this.options.grid.gridX; Math.abs(o) > 25; )
      this.options.grid.snapSizeX *= 2, o /= 2;
    for (this.options.grid.snapSizeY = this.options.grid.gridY; Math.abs(s) > 25; )
      this.options.grid.snapSizeY *= 2, s /= 2;
    return this;
  }, applyZoom: function() {
    return this.updateCoords().calculateSnapSizes().clearTraces().fullUpdate(), this;
  }, zoomIn: function(e, t) {
    var o = this.getBoundingBox(), s = this.attr.zoom.factorx, n = this.attr.zoom.factory, h = (o[2] - o[0]) * (1 - 1 / s), l = (o[1] - o[3]) * (1 - 1 / n), p = 0.5, u = 0.5, v = this.attr.zoom.eps || this.attr.zoom.min || 1e-3;
    return this.zoomX > this.attr.zoom.max && s > 1 || this.zoomY > this.attr.zoom.max && n > 1 || this.zoomX < v && s < 1 || this.zoomY < v && n < 1 ? this : (a.Z.isNumber(e) && a.Z.isNumber(t) && (p = (e - o[0]) / (o[2] - o[0]), u = (o[1] - t) / (o[1] - o[3])), this.setBoundingBox([o[0] + h * p, o[1] - l * u, o[2] - h * (1 - p), o[3] + l * (1 - u)], this.keepaspectratio, "update"), this.applyZoom());
  }, zoomOut: function(e, t) {
    var o = this.getBoundingBox(), s = this.attr.zoom.factorx, n = this.attr.zoom.factory, h = (o[2] - o[0]) * (1 - s), l = (o[1] - o[3]) * (1 - n), p = 0.5, u = 0.5, v = this.attr.zoom.eps || this.attr.zoom.min || 1e-3;
    return this.zoomX < v || this.zoomY < v ? this : (a.Z.isNumber(e) && a.Z.isNumber(t) && (p = (e - o[0]) / (o[2] - o[0]), u = (o[1] - t) / (o[1] - o[3])), this.setBoundingBox([o[0] + h * p, o[1] - l * u, o[2] - h * (1 - p), o[3] + l * (1 - u)], this.keepaspectratio, "update"), this.applyZoom());
  }, zoom100: function() {
    var e, t, o;
    return a.Z.exists(this.attr.boundingbox) ? this.setBoundingBox(this.attr.boundingbox, this.keepaspectratio, "reset") : (t = ((e = this.getBoundingBox())[2] - e[0]) * (1 - this.zoomX) * 0.5, o = (e[1] - e[3]) * (1 - this.zoomY) * 0.5, this.setBoundingBox([e[0] + t, e[1] - o, e[2] - t, e[3] + o], this.keepaspectratio, "reset")), this.applyZoom();
  }, zoomAllPoints: function() {
    var e, t, o, s, n = 0, h = 0, l = 0, p = 0, u = this.objectsList.length;
    for (e = 0; e < u; e++)
      s = this.objectsList[e], a.Z.isPoint(s) && s.visPropCalc.visible && (s.coords.usrCoords[1] < n ? n = s.coords.usrCoords[1] : s.coords.usrCoords[1] > h && (h = s.coords.usrCoords[1]), s.coords.usrCoords[2] > p ? p = s.coords.usrCoords[2] : s.coords.usrCoords[2] < l && (l = s.coords.usrCoords[2]));
    return t = 50 / this.unitX, o = 50 / this.unitY, this.setBoundingBox([n - t, p + o, h + t, l - o], this.keepaspectratio, "update"), this.applyZoom();
  }, zoomElements: function(e) {
    var t, o, s, n, h, l, p, u = [1 / 0, -1 / 0, -1 / 0, 1 / 0];
    if (!a.Z.isArray(e) || e.length === 0)
      return this;
    for (t = 0; t < e.length; t++)
      o = this.select(e[t]).bounds(), a.Z.isArray(o) && (o[0] < u[0] && (u[0] = o[0]), o[1] > u[1] && (u[1] = o[1]), o[2] > u[2] && (u[2] = o[2]), o[3] < u[3] && (u[3] = o[3]));
    return a.Z.isArray(u) && (s = 0.5 * (u[0] + u[2]), n = 0.5 * (u[1] + u[3]), h = 1.5 * (u[2] - u[0]) * 0.5, l = 1.5 * (u[1] - u[3]) * 0.5, p = Math.max(h, l), this.setBoundingBox([s - p, n + p, s + p, n - p], this.keepaspectratio, "update")), this;
  }, setZoom: function(e, t) {
    var o = this.attr.zoom.factorx, s = this.attr.zoom.factory;
    return this.attr.zoom.factorx = e / this.zoomX, this.attr.zoom.factory = t / this.zoomY, this.zoomIn(), this.attr.zoom.factorx = o, this.attr.zoom.factory = s, this;
  }, removeObject: function(e, t) {
    var o, s;
    if (a.Z.isArray(e)) {
      for (s = 0; s < e.length; s++)
        this.removeObject(e[s]);
      return this;
    }
    if (e = this.select(e), !a.Z.exists(e) || a.Z.isString(e))
      return this;
    try {
      for (o in e.childElements)
        e.childElements.hasOwnProperty(o) && e.childElements[o].board.removeObject(e.childElements[o]);
      for (o in e.objects)
        e.objects.hasOwnProperty(o) && e.objects[o].board.removeObject(e.objects[o]);
      if (t)
        for (o in this.objects)
          this.objects.hasOwnProperty(o) && a.Z.exists(this.objects[o].childElements) && a.Z.exists(this.objects[o].childElements.hasOwnProperty(e.id)) && (delete this.objects[o].childElements[e.id], delete this.objects[o].descendants[e.id]);
      else if (a.Z.exists(e.ancestors))
        for (o in e.ancestors)
          e.ancestors.hasOwnProperty(o) && a.Z.exists(e.ancestors[o].childElements) && a.Z.exists(e.ancestors[o].childElements.hasOwnProperty(e.id)) && (delete e.ancestors[o].childElements[e.id], delete e.ancestors[o].descendants[e.id]);
      if (e._pos > -1)
        for (this.objectsList.splice(e._pos, 1), o = e._pos; o < this.objectsList.length; o++)
          this.objectsList[o]._pos--;
      else
        e.type !== x.Z.OBJECT_TYPE_TURTLE && d.Z.debug("Board.removeObject: object " + e.id + " not found in list.");
      delete this.objects[e.id], delete this.elementsByName[e.name], e.visProp && a.Z.evaluate(e.visProp.trace) && e.clearTrace(), a.Z.exists(e.remove) && e.remove();
    } catch (n) {
      d.Z.debug(e.id + ": Could not be removed: " + n);
    }
    return this.update(), this;
  }, removeAncestors: function(e) {
    var t;
    for (t in e.ancestors)
      e.ancestors.hasOwnProperty(t) && this.removeAncestors(e.ancestors[t]);
    return this.removeObject(e), this;
  }, initGeonextBoard: function() {
    var e, t, o;
    return e = this.create("point", [0, 0], { id: this.id + "g00e0", name: "Ursprung", withLabel: !1, visible: !1, fixed: !0 }), t = this.create("point", [1, 0], { id: this.id + "gX0e0", name: "Punkt_1_0", withLabel: !1, visible: !1, fixed: !0 }), o = this.create("point", [0, 1], { id: this.id + "gY0e0", name: "Punkt_0_1", withLabel: !1, visible: !1, fixed: !0 }), this.create("line", [e, t], { id: this.id + "gXLe0", name: "X-Achse", withLabel: !1, visible: !1 }), this.create("line", [e, o], { id: this.id + "gYLe0", name: "Y-Achse", withLabel: !1, visible: !1 }), this;
  }, resizeContainer: function(e, t, o, s) {
    var n, h, l, p, u;
    return h = this.canvasWidth, l = this.canvasHeight, s || (n = this.getBoundingBox()), this.canvasWidth = parseFloat(e), this.canvasHeight = parseFloat(t), o || (this.containerObj.style.width = this.canvasWidth + "px", this.containerObj.style.height = this.canvasHeight + "px"), this.renderer.resize(this.canvasWidth, this.canvasHeight), s ? (p = (this.canvasWidth - h) / 2, u = (this.canvasHeight - l) / 2, this.moveOrigin(this.origin.scrCoords[1] + p, this.origin.scrCoords[2] + u)) : this.setBoundingBox(n, this.keepaspectratio, "keep"), this;
  }, showDependencies: function() {
    var e, t, o, s, n;
    for (e in t = `<p>
`, this.objects)
      if (this.objects.hasOwnProperty(e)) {
        for (o in n = 0, this.objects[e].childElements)
          this.objects[e].childElements.hasOwnProperty(o) && (n += 1);
        for (o in n >= 0 && (t += "<strong>" + this.objects[e].id + ":</strong> "), this.objects[e].childElements)
          this.objects[e].childElements.hasOwnProperty(o) && (t += this.objects[e].childElements[o].id + "(" + this.objects[e].childElements[o].name + "), ");
        t += `<p>
`;
      }
    return t += `</p>
`, (s = window.open()).document.open(), s.document.write(t), s.document.close(), this;
  }, showXML: function() {
    var e = window.open("");
    return e.document.open(), e.document.write("<pre>" + a.Z.escapeHTML(this.xmlString) + "</pre>"), e.document.close(), this;
  }, prepareUpdate: function() {
    var e, t, o = this.objectsList.length;
    for (e = 0; e < o; e++)
      (t = this.objectsList[e]).needsUpdate = t.needsRegularUpdate || this.needsFullUpdate;
    for (e in this.groups)
      this.groups.hasOwnProperty(e) && ((t = this.groups[e]).needsUpdate = t.needsRegularUpdate || this.needsFullUpdate);
    return this;
  }, updateElements: function(e) {
    var t, o;
    for (e = this.select(e), t = 0; t < this.objectsList.length; t++)
      o = this.objectsList[t], this.needsFullUpdate && o.elementClass === x.Z.OBJECT_CLASS_TEXT && o.updateSize(), o.update(!a.Z.exists(e) || o.id !== e.id).updateVisibility();
    for (t in this.groups)
      this.groups.hasOwnProperty(t) && this.groups[t].update(e);
    return this;
  }, updateRenderer: function() {
    var e, t = this.objectsList.length;
    if (this.renderer) {
      if (this.renderer.type === "canvas")
        this.updateRendererCanvas();
      else
        for (e = 0; e < t; e++)
          this.objectsList[e].updateRenderer();
      return this;
    }
  }, updateRendererCanvas: function() {
    var e, t, o, s, n, h = this.objectsList.length, l = this.options.layer, p = this.options.layer.numlayers, u = Number.NEGATIVE_INFINITY;
    for (o = 0; o < p; o++) {
      for (n in s = Number.POSITIVE_INFINITY, l)
        l.hasOwnProperty(n) && l[n] > u && l[n] < s && (s = l[n]);
      for (u = s, e = 0; e < h; e++)
        (t = this.objectsList[e]).visProp.layer === s && t.prepareUpdate().updateRenderer();
    }
    return this;
  }, addHook: function(e, t, o) {
    return d.Z.deprecated("Board.addHook()", "Board.on()"), t = a.Z.def(t, "update"), o = a.Z.def(o, this), this.hooks.push([t, e]), this.on(t, e, o), this.hooks.length - 1;
  }, addEvent: d.Z.shortcut(d.Z.Board.prototype, "on"), removeHook: function(e) {
    return d.Z.deprecated("Board.removeHook()", "Board.off()"), this.hooks[e] && (this.off(this.hooks[e][0], this.hooks[e][1]), this.hooks[e] = null), this;
  }, removeEvent: d.Z.shortcut(d.Z.Board.prototype, "off"), updateHooks: function(e) {
    var t = Array.prototype.slice.call(arguments, 0);
    return d.Z.deprecated("Board.updateHooks()", "Board.triggerEventHandlers()"), t[0] = a.Z.def(t[0], "update"), this.triggerEventHandlers([t[0]], arguments), this;
  }, addChild: function(e) {
    return a.Z.exists(e) && a.Z.exists(e.containerObj) && (this.dependentBoards.push(e), this.update()), this;
  }, removeChild: function(e) {
    var t;
    for (t = this.dependentBoards.length - 1; t >= 0; t--)
      this.dependentBoards[t] === e && this.dependentBoards.splice(t, 1);
    return this;
  }, update: function(e) {
    var t, o, s, n, h;
    if (this.inUpdate || this.isSuspendedUpdate)
      return this;
    for (this.inUpdate = !0, this.attr.minimizereflow === "all" && this.containerObj && this.renderer.type !== "vml" && (h = this.document.activeElement, n = this.renderer.removeToInsertLater(this.containerObj)), this.attr.minimizereflow === "svg" && this.renderer.type === "svg" && (h = this.document.activeElement, n = this.renderer.removeToInsertLater(this.renderer.svgRoot)), this.prepareUpdate().updateElements(e).updateConditions(), this.renderer.suspendRedraw(this), this.updateRenderer(), this.renderer.unsuspendRedraw(), this.triggerEventHandlers(["update"], []), n && (n(), h.focus()), o = this.dependentBoards.length, t = 0; t < o; t++)
      s = this.dependentBoards[t], a.Z.exists(s) && s !== this && (s.updateQuality = this.updateQuality, s.prepareUpdate().updateElements().updateConditions(), s.renderer.suspendRedraw(), s.updateRenderer(), s.renderer.unsuspendRedraw(), s.triggerEventHandlers(["update"], []));
    return this.inUpdate = !1, this;
  }, fullUpdate: function() {
    return this.needsFullUpdate = !0, this.update(), this.needsFullUpdate = !1, this;
  }, addGrid: function() {
    return this.create("grid", []), this;
  }, removeGrids: function() {
    var e;
    for (e = 0; e < this.grids.length; e++)
      this.removeObject(this.grids[e]);
    return this.grids.length = 0, this.update(), this;
  }, create: function(e, t, o) {
    var s, n;
    for (e = e.toLowerCase(), a.Z.exists(t) || (t = []), a.Z.exists(o) || (o = {}), n = 0; n < t.length; n++)
      !a.Z.isString(t[n]) || e === "text" && n === 2 || e === "solidofrevolution3d" && n === 2 || !(e !== "input" && e !== "checkbox" && e !== "button" || n !== 2 && n !== 3) || e === "curve" && n > 0 || (t[n] = this.select(t[n]));
    if (!a.Z.isFunction(d.Z.elements[e]))
      throw new Error("JSXGraph: create: Unknown element type given: " + e);
    return s = d.Z.elements[e](this, t, o), a.Z.exists(s) ? (s.prepareUpdate && s.update && s.updateRenderer && s.fullUpdate(), s) : (d.Z.debug("JSXGraph: create: failure creating " + e), s);
  }, createElement: function() {
    return d.Z.deprecated("Board.createElement()", "Board.create()"), this.create.apply(this, arguments);
  }, clearTraces: function() {
    var e;
    for (e = 0; e < this.objectsList.length; e++)
      this.objectsList[e].clearTrace();
    return this.numTraces = 0, this;
  }, suspendUpdate: function() {
    return this.inUpdate || (this.isSuspendedUpdate = !0), this;
  }, unsuspendUpdate: function() {
    return this.isSuspendedUpdate && (this.isSuspendedUpdate = !1, this.fullUpdate()), this;
  }, setBoundingBox: function(e, t, o) {
    var s, n, h, l, p, u, v, Z, y, O = 0, S = 0, R = 1, L = M.Z.getDimensions(this.container, this.document);
    return a.Z.isArray(e) ? (e[0] < this.maxboundingbox[0] || e[1] > this.maxboundingbox[1] || e[2] > this.maxboundingbox[2] || e[3] < this.maxboundingbox[3] || (a.Z.exists(o) || (o = "reset"), h = this.unitX, l = this.unitY, this.canvasWidth = parseFloat(L.width), this.canvasHeight = parseFloat(L.height), n = this.canvasWidth, s = this.canvasHeight, t ? (p = h / l, o === "keep" && (R = this.zoomX / this.zoomY), Z = h * (u = e[2] - e[0]), y = l * (v = e[1] - e[3]), n >= s ? Z >= y ? (this.unitY = s / v, this.unitX = this.unitY * p) : (this.unitY = s / Math.abs(u) * k.Z.sign(v) / R, this.unitX = this.unitY * p) : y > Z ? (this.unitX = n / u, this.unitY = this.unitX / p) : (this.unitX = n / Math.abs(v) * k.Z.sign(u) * R, this.unitY = this.unitX / p), O = 0.5 * (n / this.unitX - u), S = 0.5 * (s / this.unitY - v), this.keepaspectratio = !0) : (this.unitX = n / (e[2] - e[0]), this.unitY = s / (e[1] - e[3]), this.keepaspectratio = !1), this.moveOrigin(-this.unitX * (e[0] - O), this.unitY * (e[1] + S)), o === "update" ? (this.zoomX *= this.unitX / h, this.zoomY *= this.unitY / l) : o === "reset" && (this.zoomX = a.Z.exists(this.attr.zoomx) ? this.attr.zoomx : 1, this.zoomY = a.Z.exists(this.attr.zoomy) ? this.attr.zoomy : 1)), this) : this;
  }, getBoundingBox: function() {
    var e = new b.Z(x.Z.COORDS_BY_SCREEN, [0, 0], this).usrCoords, t = new b.Z(x.Z.COORDS_BY_SCREEN, [this.canvasWidth, this.canvasHeight], this).usrCoords;
    return [e[1], e[2], t[1], t[2]];
  }, addAnimation: function(e) {
    var t = this;
    return this.animationObjects[e.id] = e, this.animationIntervalCode || (this.animationIntervalCode = window.setInterval(function() {
      t.animate();
    }, e.board.attr.animationdelay)), this;
  }, stopAllAnimation: function() {
    var e;
    for (e in this.animationObjects)
      this.animationObjects.hasOwnProperty(e) && a.Z.exists(this.animationObjects[e]) && (this.animationObjects[e] = null, delete this.animationObjects[e]);
    return window.clearInterval(this.animationIntervalCode), delete this.animationIntervalCode, this;
  }, animate: function() {
    var e, t, o, s, n, h, l, p, u = 0, v = null;
    for (t in this.animationObjects)
      if (this.animationObjects.hasOwnProperty(t) && a.Z.exists(this.animationObjects[t])) {
        if (u += 1, (o = this.animationObjects[t]).animationPath && (s = a.Z.isFunction(o.animationPath) ? o.animationPath((/* @__PURE__ */ new Date()).getTime() - o.animationStart) : o.animationPath.pop(), !a.Z.exists(s) || !a.Z.isArray(s) && isNaN(s) ? delete o.animationPath : (o.setPositionDirectly(x.Z.COORDS_BY_USER, s), o.fullUpdate(), v = o)), o.animationData) {
          for (n in l = 0, o.animationData)
            o.animationData.hasOwnProperty(n) && (h = o.animationData[n].pop(), a.Z.exists(h) ? (l += 1, (e = {})[n] = h, o.setAttribute(e)) : delete o.animationData[h]);
          l === 0 && delete o.animationData;
        }
        a.Z.exists(o.animationData) || a.Z.exists(o.animationPath) || (this.animationObjects[t] = null, delete this.animationObjects[t], a.Z.exists(o.animationCallback) && (p = o.animationCallback, o.animationCallback = null, p()));
      }
    return u === 0 ? (window.clearInterval(this.animationIntervalCode), delete this.animationIntervalCode) : this.update(v), this;
  }, migratePoint: function(e, t, o) {
    var s, n, h, l, p, u, v = !1;
    for (n in e = this.select(e), t = this.select(t), a.Z.exists(e.label) && (u = e.label.id, v = !0, this.removeObject(e.label)), e.childElements)
      if (e.childElements.hasOwnProperty(n)) {
        for (h in l = !1, s = e.childElements[n])
          s.hasOwnProperty(h) && s[h] === e && (s[h] = t, l = !0);
        for (l && delete e.childElements[n], p = 0; p < s.parents.length; p++)
          s.parents[p] === e.id && (s.parents[p] = t.id);
        t.addChild(s);
      }
    return o && (v && (delete t.childElements[u], delete t.descendants[u]), t.label && this.removeObject(t.label), delete this.elementsByName[t.name], t.name = e.name, v && t.createLabel()), this.removeObject(e), a.Z.exists(t.name) && t.name !== "" && (this.elementsByName[t.name] = t), this.fullUpdate(), this;
  }, emulateColorblindness: function(e) {
    var t, o;
    if (a.Z.exists(e) || (e = "none"), this.currentCBDef === e)
      return this;
    for (t in this.objects)
      this.objects.hasOwnProperty(t) && (o = this.objects[t], e !== "none" ? (this.currentCBDef === "none" && (o.visPropOriginal = { strokecolor: o.visProp.strokecolor, fillcolor: o.visProp.fillcolor, highlightstrokecolor: o.visProp.highlightstrokecolor, highlightfillcolor: o.visProp.highlightfillcolor }), o.setAttribute({ strokecolor: fe.Z.rgb2cb(a.Z.evaluate(o.visPropOriginal.strokecolor), e), fillcolor: fe.Z.rgb2cb(a.Z.evaluate(o.visPropOriginal.fillcolor), e), highlightstrokecolor: fe.Z.rgb2cb(a.Z.evaluate(o.visPropOriginal.highlightstrokecolor), e), highlightfillcolor: fe.Z.rgb2cb(a.Z.evaluate(o.visPropOriginal.highlightfillcolor), e) })) : a.Z.exists(o.visPropOriginal) && d.Z.extend(o.visProp, o.visPropOriginal));
    return this.currentCBDef = e, this.update(), this;
  }, select: function(e, t) {
    var o, s, n, h, l = e;
    if (l === null)
      return l;
    if (a.Z.isString(l) && l !== "")
      a.Z.exists(this.objects[l]) ? l = this.objects[l] : a.Z.exists(this.elementsByName[l]) ? l = this.elementsByName[l] : a.Z.exists(this.groups[l]) && (l = this.groups[l]);
    else if (!t && (a.Z.isFunction(l) || a.Z.isObject(l) && !a.Z.isFunction(l.setAttribute))) {
      for (s = {}, h = (o = a.Z.filterElements(this.objectsList, l)).length, n = 0; n < h; n++)
        s[o[n].id] = o[n];
      l = new Re(s);
    } else
      a.Z.isObject(l) && a.Z.exists(l.id) && !a.Z.exists(this.objects[l.id]) && (l = null);
    return l;
  }, hasPoint: function(e, t) {
    var o = e, s = t, n = this.getBoundingBox();
    return a.Z.exists(e) && a.Z.isArray(e.usrCoords) && (o = e.usrCoords[1], s = e.usrCoords[2]), !!(a.Z.isNumber(o) && a.Z.isNumber(s) && n[0] < o && o < n[2] && n[1] > s && s > n[3]);
  }, updateCSSTransforms: function() {
    var e = this.containerObj, t = e, o = e;
    if (this.cssTransMat = M.Z.getCSSTransformMatrix(t), a.Z.exists(t.getRootNode)) {
      for (t = t.parentNode === t.getRootNode() ? t.parentNode.host : t.parentNode; t; )
        this.cssTransMat = k.Z.matMatMult(M.Z.getCSSTransformMatrix(t), this.cssTransMat), t = t.parentNode === t.getRootNode() ? t.parentNode.host : t.parentNode;
      this.cssTransMat = k.Z.inverse(this.cssTransMat);
    } else {
      for (t = t.offsetParent; t; ) {
        for (this.cssTransMat = k.Z.matMatMult(M.Z.getCSSTransformMatrix(t), this.cssTransMat), o = o.parentNode; o !== t; )
          this.cssTransMat = k.Z.matMatMult(M.Z.getCSSTransformMatrix(t), this.cssTransMat), o = o.parentNode;
        t = t.offsetParent;
      }
      this.cssTransMat = k.Z.inverse(this.cssTransMat);
    }
    return this;
  }, startSelectionMode: function() {
    this.selectingMode = !0, this.selectionPolygon.setAttribute({ visible: !0 }), this.selectingBox = [[0, 0], [0, 0]], this._setSelectionPolygonFromBox(), this.selectionPolygon.fullUpdate();
  }, stopSelectionMode: function() {
    return this.selectingMode = !1, this.selectionPolygon.setAttribute({ visible: !1 }), [this.selectionPolygon.vertices[0].coords, this.selectionPolygon.vertices[2].coords];
  }, _startSelecting: function(e) {
    this.isSelecting = !0, this.selectingBox = [[e[0], e[1]], [e[0], e[1]]], this._setSelectionPolygonFromBox();
  }, _moveSelecting: function(e) {
    this.isSelecting && (this.selectingBox[1] = [e[0], e[1]], this._setSelectionPolygonFromBox(), this.selectionPolygon.fullUpdate());
  }, _stopSelecting: function(e) {
    var t = this.getMousePosition(e);
    this.isSelecting = !1, this.selectingBox[1] = [t[0], t[1]], this._setSelectionPolygonFromBox();
  }, _setSelectionPolygonFromBox: function() {
    var e = this.selectingBox[0], t = this.selectingBox[1];
    this.selectionPolygon.vertices[0].setPositionDirectly(d.Z.COORDS_BY_SCREEN, [e[0], e[1]]), this.selectionPolygon.vertices[1].setPositionDirectly(d.Z.COORDS_BY_SCREEN, [e[0], t[1]]), this.selectionPolygon.vertices[2].setPositionDirectly(d.Z.COORDS_BY_SCREEN, [t[0], t[1]]), this.selectionPolygon.vertices[3].setPositionDirectly(d.Z.COORDS_BY_SCREEN, [t[0], e[1]]);
  }, _testForSelection: function(e) {
    this._isRequiredKeyPressed(e, "selection") && (a.Z.exists(this.selectionPolygon) || this._createSelectionPolygon(this.attr), this.startSelectionMode());
  }, _createSelectionPolygon: function(e) {
    var t;
    return a.Z.exists(this.selectionPolygon) || (t = a.Z.copyAttributes(e, te.Z, "board", "selection")).enabled === !0 && (this.selectionPolygon = this.create("polygon", [[0, 0], [0, 0], [0, 0], [0, 0]], t)), this;
  }, __evt__down: function(e) {
  }, __evt__mousedown: function(e) {
  }, __evt__pendown: function(e) {
  }, __evt__pointerdown: function(e) {
  }, __evt__touchstart: function(e) {
  }, __evt__up: function(e) {
  }, __evt__mouseup: function(e) {
  }, __evt__pointerup: function(e) {
  }, __evt__touchend: function(e) {
  }, __evt__move: function(e, t) {
  }, __evt__mousemove: function(e, t) {
  }, __evt__penmove: function(e, t) {
  }, __evt__pointermove: function(e, t) {
  }, __evt__touchmove: function(e, t) {
  }, __evt__keymove: function(e, t) {
  }, __evt__hit: function(e, t, o) {
  }, __evt__mousehit: function(e, t, o) {
  }, __evt__update: function() {
  }, __evt__boundingbox: function() {
  }, __evt__startselecting: function() {
  }, __evt__mousestartselecting: function() {
  }, __evt__pointerstartselecting: function() {
  }, __evt__touchstartselecting: function() {
  }, __evt__stopselecting: function() {
  }, __evt__mousestopselecting: function() {
  }, __evt__pointerstopselecting: function() {
  }, __evt__touchstopselecting: function() {
  }, __evt__moveselecting: function() {
  }, __evt__mousemoveselecting: function() {
  }, __evt__pointermoveselecting: function() {
  }, __evt__touchmoveselecting: function() {
  }, __evt: function() {
  }, toFullscreen: function(e) {
    var t, o, s, n = this.document;
    return e = e || this.container, this._fullscreen_inner_id = e, s = n.getElementById(e), t = "fullscreenwrap_" + e, n.getElementById(t) ? o = n.getElementById(t) : ((o = document.createElement("div")).classList.add("JXG_wrap_private"), o.setAttribute("id", t), s.parentNode.insertBefore(o, s), o.appendChild(s)), o.requestFullscreen = o.requestFullscreen || o.webkitRequestFullscreen || o.mozRequestFullScreen || o.msRequestFullscreen, (n.fullscreenElement !== void 0 ? n.fullscreenElement : n.webkitFullscreenElement !== void 0 ? n.webkitFullscreenElement : n.msFullscreenElement) === null ? o.requestFullscreen && o.requestFullscreen() : a.Z.exists(document.exitFullscreen) ? document.exitFullscreen() : a.Z.exists(document.webkitExitFullscreen) && document.webkitExitFullscreen(), this;
  }, fullscreenListener: function(e) {
    var t, o, s, n = this.document;
    if (t = this._fullscreen_inner_id, a.Z.exists(t)) {
      if (s = n.fullscreenElement !== void 0 ? n.fullscreenElement : n.webkitFullscreenElement !== void 0 ? n.webkitFullscreenElement : n.msFullscreenElement, o = n.getElementById(t), s)
        o._cssFullscreenStore = { id: s.id, isFullscreen: !0, margin: o.style.margin }, o.style.margin = "", M.Z.scaleJSXGraphDiv(s.id, t, n, a.Z.evaluate(this.attr.fullscreen.scale)), s = null;
      else if (a.Z.exists(o._cssFullscreenStore)) {
        try {
          n.styleSheets[n.styleSheets.length - 1].deleteRule(0);
        } catch {
          console.log("JSXGraph: Could not remove CSS rules for full screen mode");
        }
        o._cssFullscreenStore.isFullscreen = !1, o.style.margin = o._cssFullscreenStore.margin;
      }
      this.updateCSSTransforms();
    }
  }, addLogEntry: function(e, t, o) {
    var s, n, h = this.userLog.length - 1;
    return a.Z.exists(t.elementClass) && (n = t.id), a.Z.evaluate(this.attr.logging.enabled) && (s = (/* @__PURE__ */ new Date()).getTime(), h >= 0 && this.userLog[h].type === e && this.userLog[h].id === n && s - this.userLog[h].end < 500 ? (this.userLog[h].end = s, this.userLog[h].endpos = o) : this.userLog.push({ type: e, id: n, start: s, startpos: o, end: s, endpos: o, bbox: this.getBoundingBox(), canvas: [this.canvasWidth, this.canvasHeight], zoom: [this.zoomX, this.zoomY] })), this;
  }, createRoulette: function(e, t, o, s, n, h, l) {
    var p = this;
    return new function() {
      var u, v = 0, Z = 0, y = 0, O = o, S = c.Z.root(function(ee) {
        var he = e.X(O), re = e.Y(O), _e = t.X(ee), ge = t.Y(ee);
        return (he - _e) * (he - _e) + (re - ge) * (re - ge);
      }, [0, 2 * Math.PI]), R = 0, L = 0, B = p.create("transform", [function() {
        return v;
      }], { type: "rotate" }), X = p.create("transform", [function() {
        return v;
      }, function() {
        return e.X(O);
      }, function() {
        return e.Y(O);
      }], { type: "rotate" }), F = p.create("transform", [function() {
        return Z;
      }, function() {
        return y;
      }], { type: "translate" }), G = function(ee, he, re) {
        var _e = c.Z.D(ee.X)(he), ge = c.Z.D(ee.Y)(he), we = c.Z.D(ee.X)(re), Ne = c.Z.D(ee.Y)(re), Le = c.Z.D(ee.X)(0.5 * (he + re)), Ue = c.Z.D(ee.Y)(0.5 * (he + re)), Qe = Math.sqrt(_e * _e + ge * ge), Ve = Math.sqrt(we * we + Ne * Ne);
        return (Qe + 4 * Math.sqrt(Le * Le + Ue * Ue) + Ve) * (re - he) / 6;
      }, W = function(ee) {
        return u - G(t, S, ee);
      }, H = Math.PI / 18, q = 9 * H, oe = null;
      return this.rolling = function() {
        var ee, he, re, _e, ge;
        u = G(e, O, R = O + n * s), L = c.Z.root(W, S), ee = new K(e.X(R), e.Y(R)), he = new K(t.X(L), t.Y(L)), re = new K(c.Z.D(e.X)(R), c.Z.D(e.Y)(R)), _e = new K(c.Z.D(t.X)(L), c.Z.D(t.Y)(L)), ge = K.C.div(re, _e), v = Math.atan2(ge.imaginary, ge.real), ge.div(K.C.abs(ge)), ge.mult(he), Z = ee.real - ge.real, y = ee.imaginary - ge.imaginary, v < -H && v > -q ? (v = -H, X.applyOnce(l)) : v > H && v < q ? (v = H, X.applyOnce(l)) : (B.applyOnce(l), F.applyOnce(l), O = R, S = L), p.update();
      }, this.start = function() {
        return h > 0 && (oe = window.setInterval(this.rolling, h)), this;
      }, this.stop = function() {
        return window.clearInterval(oe), this;
      }, this;
    }();
  } });
  const ke = d.Z.Board;
  d.Z.SVGRenderer = function(e, t) {
    var o;
    for (this.type = "svg", this.isIE = navigator.appVersion.indexOf("MSIE") !== -1 || navigator.userAgent.match(/Trident\//), this.svgRoot = null, this.svgNamespace = "http://www.w3.org/2000/svg", this.xlinkNamespace = "http://www.w3.org/1999/xlink", this.container = e, this.container.style.MozUserSelect = "none", this.container.style.userSelect = "none", this.container.style.overflow = "hidden", this.container.style.position === "" && (this.container.style.position = "relative"), this.svgRoot = this.container.ownerDocument.createElementNS(this.svgNamespace, "svg"), this.svgRoot.style.overflow = "hidden", this.svgRoot.style.display = "block", this.resize(t.width, t.height), this.container.appendChild(this.svgRoot), this.defs = this.container.ownerDocument.createElementNS(this.svgNamespace, "defs"), this.svgRoot.appendChild(this.defs), this.createShadowFilter = function(s, n, h, l, p, u) {
      var v, Z, y, O, S, R = this.container.ownerDocument.createElementNS(this.svgNamespace, "filter");
      return R.setAttributeNS(null, "id", s), R.setAttributeNS(null, "width", "300%"), R.setAttributeNS(null, "height", "300%"), R.setAttributeNS(null, "filterUnits", "userSpaceOnUse"), (v = this.container.ownerDocument.createElementNS(this.svgNamespace, "feOffset")).setAttributeNS(null, "in", "SourceGraphic"), v.setAttributeNS(null, "result", "offOut"), v.setAttributeNS(null, "dx", u[0]), v.setAttributeNS(null, "dy", u[1]), R.appendChild(v), (Z = this.container.ownerDocument.createElementNS(this.svgNamespace, "feColorMatrix")).setAttributeNS(null, "in", "offOut"), Z.setAttributeNS(null, "result", "colorOut"), Z.setAttributeNS(null, "type", "matrix"), n === "none" || !a.Z.isArray(n) || n.length < 3 ? Z.setAttributeNS(null, "values", "0.1 0 0 0 0  0 0.1 0 0 0  0 0 0.1 0 0  0 0 0 " + h + " 0") : (n[0] /= 255, n[1] /= 255, n[2] /= 255, S = l + " 0 0 0 " + n[0] + "  0 " + l + " 0 0 " + n[1] + "  0 0 " + l + " 0 " + n[2] + "  0 0 0 " + h + " 0", Z.setAttributeNS(null, "values", S)), R.appendChild(Z), (y = this.container.ownerDocument.createElementNS(this.svgNamespace, "feGaussianBlur")).setAttributeNS(null, "in", "colorOut"), y.setAttributeNS(null, "result", "blurOut"), y.setAttributeNS(null, "stdDeviation", p), R.appendChild(y), (O = this.container.ownerDocument.createElementNS(this.svgNamespace, "feBlend")).setAttributeNS(null, "in", "SourceGraphic"), O.setAttributeNS(null, "in2", "blurOut"), O.setAttributeNS(null, "mode", "normal"), R.appendChild(O), R;
    }, this.defs.appendChild(this.createShadowFilter(this.container.id + "_f1", "none", 1, 0.1, 3, [5, 5])), this.toURL = function() {
      var s = Array.prototype.slice.call(arguments).join("");
      return a.Z.exists(CSS) && a.Z.exists(CSS.escape) && (s = CSS.escape(s)), "url(#" + s + ")";
    }, this.layer = [], o = 0; o < te.Z.layer.numlayers; o++)
      this.layer[o] = this.container.ownerDocument.createElementNS(this.svgNamespace, "g"), this.svgRoot.appendChild(this.layer[o]);
    try {
      this.foreignObjLayer = this.container.ownerDocument.createElementNS(this.svgNamespace, "foreignObject"), this.foreignObjLayer.setAttribute("display", "none"), this.foreignObjLayer.setAttribute("x", 0), this.foreignObjLayer.setAttribute("y", 0), this.foreignObjLayer.setAttribute("width", "100%"), this.foreignObjLayer.setAttribute("height", "100%"), this.foreignObjLayer.setAttribute("id", this.container.id + "_foreignObj"), this.svgRoot.appendChild(this.foreignObjLayer), this.supportsForeignObject = !0;
    } catch {
      this.supportsForeignObject = !1;
    }
    this.dashArray = ["2, 2", "5, 5", "10, 10", "20, 20", "20, 10, 10, 10", "20, 5, 10, 5"];
  }, d.Z.SVGRenderer.prototype = new se(), d.Z.extend(d.Z.SVGRenderer.prototype, { _createArrowHead: function(e, t, o) {
    var s, n, h, l, p = e.id + "Triangle";
    return a.Z.exists(t) && (p += t), (s = this.createPrim("marker", p)).setAttributeNS(null, "stroke", a.Z.evaluate(e.visProp.strokecolor)), s.setAttributeNS(null, "stroke-opacity", a.Z.evaluate(e.visProp.strokeopacity)), s.setAttributeNS(null, "fill", a.Z.evaluate(e.visProp.strokecolor)), s.setAttributeNS(null, "fill-opacity", a.Z.evaluate(e.visProp.strokeopacity)), s.setAttributeNS(null, "stroke-width", 0), s.setAttributeNS(null, "orient", "auto"), s.setAttributeNS(null, "markerUnits", "strokeWidth"), n = this.container.ownerDocument.createElementNS(this.svgNamespace, "path"), l = 5, t === "End" ? (h = 0, o === 2 ? n.setAttributeNS(null, "d", "M 10,0 L 0,5 L 10,10 L 5,5 z") : o === 3 ? n.setAttributeNS(null, "d", "M 0,0 L 3.33,0 L 3.33,10 L 0,10 z") : o === 4 ? (l = 3.31, n.setAttributeNS(null, "d", "M 0.00,3.31 C 3.53,3.84 7.13,4.50 10.00,6.63 C 9.33,5.52 8.67,4.42 8.00,3.31 C 8.67,2.21 9.33,1.10 10.00,0.00 C 7.13,2.13 3.53,2.79 0.00,3.31")) : o === 5 ? (l = 3.28, n.setAttributeNS(null, "d", "M 0.00,3.28 C 3.39,4.19 6.81,5.07 10.00,6.55 C 9.38,5.56 9.00,4.44 9.00,3.28 C 9.00,2.11 9.38,0.99 10.00,0.00 C 6.81,1.49 3.39,2.37 0.00,3.28")) : o === 6 ? (l = 2.84, n.setAttributeNS(null, "d", "M 0.00,2.84 C 3.39,3.59 6.79,4.35 10.00,5.68 C 9.67,4.73 9.33,3.78 9.00,2.84 C 9.33,1.89 9.67,0.95 10.00,0.00 C 6.79,1.33 3.39,2.09 0.00,2.84")) : o === 7 ? (l = 5.2, n.setAttributeNS(null, "d", "M 0.00,5.20 C 4.04,5.20 7.99,6.92 10.00,10.39 M 10.00,0.00 C 7.99,3.47 4.04,5.20 0.00,5.20")) : n.setAttributeNS(null, "d", "M 10,0 L 0,5 L 10,10 z"), e.elementClass === x.Z.OBJECT_CLASS_LINE && (h = o === 2 ? 4.9 : o === 3 ? 3.3 : o === 4 || o === 5 || o === 6 ? 6.66 : o === 7 ? 0 : 10)) : (h = 10, o === 2 ? n.setAttributeNS(null, "d", "M 0,0 L 10,5 L 0,10 L 5,5 z") : o === 3 ? (h = 3.3, n.setAttributeNS(null, "d", "M 0,0 L 3.33,0 L 3.33,10 L 0,10 z")) : o === 4 ? (l = 3.31, n.setAttributeNS(null, "d", "M 10.00,3.31 C 6.47,3.84 2.87,4.50 0.00,6.63 C 0.67,5.52 1.33,4.42 2.00,3.31 C 1.33,2.21 0.67,1.10 0.00,0.00 C 2.87,2.13 6.47,2.79 10.00,3.31")) : o === 5 ? (l = 3.28, n.setAttributeNS(null, "d", "M 10.00,3.28 C 6.61,4.19 3.19,5.07 0.00,6.55 C 0.62,5.56 1.00,4.44 1.00,3.28 C 1.00,2.11 0.62,0.99 0.00,0.00 C 3.19,1.49 6.61,2.37 10.00,3.28")) : o === 6 ? (l = 2.84, n.setAttributeNS(null, "d", "M 10.00,2.84 C 6.61,3.59 3.21,4.35 0.00,5.68 C 0.33,4.73 0.67,3.78 1.00,2.84 C 0.67,1.89 0.33,0.95 0.00,0.00 C 3.21,1.33 6.61,2.09 10.00,2.84")) : o === 7 ? (l = 5.2, n.setAttributeNS(null, "d", "M 10.00,5.20 C 5.96,5.20 2.01,6.92 0.00,10.39 M 0.00,0.00 C 2.01,3.47 5.96,5.20 10.00,5.20")) : n.setAttributeNS(null, "d", "M 0,0 L 10,5 L 0,10 z"), e.elementClass === x.Z.OBJECT_CLASS_LINE && (h = o === 2 ? 5.1 : o === 3 ? 0.02 : o === 4 || o === 5 || o === 6 ? 3.33 : o === 7 ? 10 : 0.05)), o === 7 && (s.setAttributeNS(null, "fill", "none"), s.setAttributeNS(null, "stroke-width", 1)), s.setAttributeNS(null, "refY", l), s.setAttributeNS(null, "refX", h), s.appendChild(n), s;
  }, _setArrowColor: function(e, t, o, s, n) {
    e && (a.Z.isString(t) && (n !== 7 ? this._setAttribute(function() {
      e.setAttributeNS(null, "stroke", t), e.setAttributeNS(null, "fill", t), e.setAttributeNS(null, "stroke-opacity", o), e.setAttributeNS(null, "fill-opacity", o);
    }, s.visPropOld.fillcolor) : this._setAttribute(function() {
      e.setAttributeNS(null, "fill", "none"), e.setAttributeNS(null, "stroke", t), e.setAttributeNS(null, "stroke-opacity", o);
    }, s.visPropOld.fillcolor)), this.isIE && s.rendNode.parentNode.insertBefore(s.rendNode, s.rendNode));
  }, _setArrowWidth: function(e, t, o, s) {
    var n, h;
    e && (h = (n = t) * s, e.setAttributeNS(null, "viewBox", "0 0 " + 10 * n + " " + 10 * n), e.setAttributeNS(null, "markerHeight", h), e.setAttributeNS(null, "markerWidth", h), e.setAttributeNS(null, "display", "inherit"), this.isIE && o.parentNode.insertBefore(o, o));
  }, updateTicks: function(e) {
    var t, o, s, n, h, l, p, u, v = "", Z = e.ticks.length, y = !0;
    for (t = 0; t < Z; t++) {
      for (h = (s = e.ticks[t])[0], l = s[1], p = h.length, u = " M " + h[0] + " " + l[0], a.Z.isNumber(h[0]) || (y = !1), o = 1; y && o < p; ++o)
        a.Z.isNumber(h[o]) ? u += " L " + h[o] + " " + l[o] : y = !1;
      y && (v += u);
    }
    n = e.rendNode, a.Z.exists(n) || (n = this.createPrim("path", e.id), this.appendChildPrim(n, a.Z.evaluate(e.visProp.layer)), e.rendNode = n), n.setAttributeNS(null, "stroke", a.Z.evaluate(e.visProp.strokecolor)), n.setAttributeNS(null, "fill", "none"), n.setAttributeNS(null, "stroke-opacity", a.Z.evaluate(e.visProp.strokeopacity)), n.setAttributeNS(null, "stroke-width", a.Z.evaluate(e.visProp.strokewidth)), this.updatePathPrim(n, v, e.board);
  }, displayCopyright: function(e, t) {
    var o, s = this.createPrim("text", "licenseText");
    s.setAttributeNS(null, "x", "20px"), s.setAttributeNS(null, "y", 2 + t + "px"), s.setAttributeNS(null, "style", "font-family:Arial,Helvetica,sans-serif; font-size:" + t + "px; fill:#356AA0;  opacity:0.3;"), o = this.container.ownerDocument.createTextNode(e), s.appendChild(o), this.appendChildPrim(s, 0);
  }, drawInternalText: function(e) {
    var t = this.createPrim("text", e.id);
    return t.style.whiteSpace = "nowrap", e.rendNodeText = this.container.ownerDocument.createTextNode(""), t.appendChild(e.rendNodeText), this.appendChildPrim(t, a.Z.evaluate(e.visProp.layer)), t;
  }, updateInternalText: function(e) {
    var t, o = e.plaintext, s = e.getAnchorX(), n = e.getAnchorY();
    e.rendNode.getAttributeNS(null, "class") !== e.visProp.cssclass && (e.rendNode.setAttributeNS(null, "class", a.Z.evaluate(e.visProp.cssclass)), e.needsSizeUpdate = !0), isNaN(e.coords.scrCoords[1] + e.coords.scrCoords[2]) || (t = e.coords.scrCoords[1], e.visPropOld.left !== s + t && (e.rendNode.setAttributeNS(null, "x", t + "px"), s === "left" ? e.rendNode.setAttributeNS(null, "text-anchor", "start") : s === "right" ? e.rendNode.setAttributeNS(null, "text-anchor", "end") : s === "middle" && e.rendNode.setAttributeNS(null, "text-anchor", "middle"), e.visPropOld.left = s + t), t = e.coords.scrCoords[2], e.visPropOld.top !== n + t && (e.rendNode.setAttributeNS(null, "y", t + 0.5 * this.vOffsetText + "px"), n === "bottom" ? e.rendNode.setAttributeNS(null, "dominant-baseline", "text-after-edge") : n === "top" ? e.rendNode.setAttributeNS(null, "dy", "1.6ex") : n === "middle" && e.rendNode.setAttributeNS(null, "dy", "0.6ex"), e.visPropOld.top = n + t)), e.htmlStr !== o && (e.rendNodeText.data = o, e.htmlStr = o), this.transformImage(e, e.transformations);
  }, updateInternalTextStyle: function(e, t, o, s) {
    this.setObjectFillColor(e, t, o);
  }, drawImage: function(e) {
    var t = this.createPrim("image", e.id);
    t.setAttributeNS(null, "preserveAspectRatio", "none"), this.appendChildPrim(t, a.Z.evaluate(e.visProp.layer)), e.rendNode = t, this.updateImage(e);
  }, transformImage: function(e, t) {
    var o, s = e.rendNode, n = "";
    t.length > 0 && (n += " matrix(" + [(o = this.joinTransforms(e, t))[1][1], o[2][1], o[1][2], o[2][2], o[1][0], o[2][0]].join(",") + ") ", s.setAttributeNS(null, "transform", n));
  }, updateImageURL: function(e) {
    var t = a.Z.evaluate(e.url);
    return e._src !== t && (e.imgIsLoaded = !1, e.rendNode.setAttributeNS(this.xlinkNamespace, "xlink:href", t), e._src = t, !0);
  }, updateImageStyle: function(e, t) {
    var o = a.Z.evaluate(t ? e.visProp.highlightcssclass : e.visProp.cssclass);
    e.rendNode.setAttributeNS(null, "class", o);
  }, drawForeignObject: function(e) {
    e.rendNode = this.appendChildPrim(this.createPrim("foreignObject", e.id), a.Z.evaluate(e.visProp.layer)), this.appendNodesToElement(e, "foreignObject"), this.updateForeignObject(e);
  }, updateForeignObject: function(e) {
    e._useUserSize ? e.rendNode.style.overflow = "hidden" : e.rendNode.style.overflow = "visible", this.updateRectPrim(e.rendNode, e.coords.scrCoords[1], e.coords.scrCoords[2] - e.size[1], e.size[0], e.size[1]), e.rendNode.innerHTML = e.content, this._updateVisual(e, { stroke: !0, dash: !0 }, !0);
  }, appendChildPrim: function(e, t) {
    return a.Z.exists(t) ? t >= te.Z.layer.numlayers && (t = te.Z.layer.numlayers - 1) : t = 0, this.layer[t].appendChild(e), e;
  }, createPrim: function(e, t) {
    var o = this.container.ownerDocument.createElementNS(this.svgNamespace, e);
    return o.setAttributeNS(null, "id", this.container.id + "_" + t), o.style.position = "absolute", e === "path" && (o.setAttributeNS(null, "stroke-linecap", "round"), o.setAttributeNS(null, "stroke-linejoin", "round"), o.setAttributeNS(null, "fill-rule", "evenodd")), o;
  }, remove: function(e) {
    a.Z.exists(e) && a.Z.exists(e.parentNode) && e.parentNode.removeChild(e);
  }, setLayer: function(e, t) {
    a.Z.exists(t) ? t >= te.Z.layer.numlayers && (t = te.Z.layer.numlayers - 1) : t = 0, this.layer[t].appendChild(e.rendNode);
  }, makeArrows: function(e, t) {
    var o, s = t.evFirst, n = t.evLast;
    e.visPropOld.firstarrow !== s || e.visPropOld.lastarrow !== n ? (s ? (o = e.rendNodeTriangleStart, a.Z.exists(o) ? this.defs.appendChild(o) : (o = this._createArrowHead(e, "End", t.typeFirst), this.defs.appendChild(o), e.rendNodeTriangleStart = o, e.rendNode.setAttributeNS(null, "marker-start", this.toURL(this.container.id, "_", e.id, "TriangleEnd")))) : (o = e.rendNodeTriangleStart, a.Z.exists(o) && this.remove(o)), n ? (o = e.rendNodeTriangleEnd, a.Z.exists(o) ? this.defs.appendChild(o) : (o = this._createArrowHead(e, "Start", t.typeLast), this.defs.appendChild(o), e.rendNodeTriangleEnd = o, e.rendNode.setAttributeNS(null, "marker-end", this.toURL(this.container.id, "_", e.id, "TriangleStart")))) : (o = e.rendNodeTriangleEnd, a.Z.exists(o) && this.remove(o)), e.visPropOld.firstarrow = s, e.visPropOld.lastarrow = n) : this.isIE && e.visPropCalc.visible && (s || n) && e.rendNode.parentNode.insertBefore(e.rendNode, e.rendNode);
  }, updateEllipsePrim: function(e, t, o, s, n) {
    var h;
    h = 2e5, t = Math.abs(t) < h ? t : h * t / Math.abs(t), o = Math.abs(o) < h ? o : h * o / Math.abs(o), s = Math.abs(s) < h ? s : h * s / Math.abs(s), n = Math.abs(n) < h ? n : h * n / Math.abs(n), e.setAttributeNS(null, "cx", t), e.setAttributeNS(null, "cy", o), e.setAttributeNS(null, "rx", Math.abs(s)), e.setAttributeNS(null, "ry", Math.abs(n));
  }, updateLinePrim: function(e, t, o, s, n) {
    var h;
    h = 2e5, isNaN(t + o + s + n) || (t = Math.abs(t) < h ? t : h * t / Math.abs(t), o = Math.abs(o) < h ? o : h * o / Math.abs(o), s = Math.abs(s) < h ? s : h * s / Math.abs(s), n = Math.abs(n) < h ? n : h * n / Math.abs(n), e.setAttributeNS(null, "x1", t), e.setAttributeNS(null, "y1", o), e.setAttributeNS(null, "x2", s), e.setAttributeNS(null, "y2", n));
  }, updatePathPrim: function(e, t) {
    t === "" && (t = "M 0 0"), e.setAttributeNS(null, "d", t);
  }, updatePathStringPoint: function(e, t, o) {
    var s = "", n = e.coords.scrCoords, h = t * Math.sqrt(3) * 0.5, l = 0.5 * t;
    return o === "x" ? s = " M " + (n[1] - t) + " " + (n[2] - t) + " L " + (n[1] + t) + " " + (n[2] + t) + " M " + (n[1] + t) + " " + (n[2] - t) + " L " + (n[1] - t) + " " + (n[2] + t) : o === "+" ? s = " M " + (n[1] - t) + " " + n[2] + " L " + (n[1] + t) + " " + n[2] + " M " + n[1] + " " + (n[2] - t) + " L " + n[1] + " " + (n[2] + t) : o === "|" ? s = " M " + n[1] + " " + (n[2] - t) + " L " + n[1] + " " + (n[2] + t) : o === "-" ? s = " M " + (n[1] - t) + " " + n[2] + " L " + (n[1] + t) + " " + n[2] : o === "<>" ? s = " M " + (n[1] - t) + " " + n[2] + " L " + n[1] + " " + (n[2] + t) + " L " + (n[1] + t) + " " + n[2] + " L " + n[1] + " " + (n[2] - t) + " Z " : o === "^" ? s = " M " + n[1] + " " + (n[2] - t) + " L " + (n[1] - h) + " " + (n[2] + l) + " L " + (n[1] + h) + " " + (n[2] + l) + " Z " : o === "v" ? s = " M " + n[1] + " " + (n[2] + t) + " L " + (n[1] - h) + " " + (n[2] - l) + " L " + (n[1] + h) + " " + (n[2] - l) + " Z " : o === ">" ? s = " M " + (n[1] + t) + " " + n[2] + " L " + (n[1] - l) + " " + (n[2] - h) + " L " + (n[1] - l) + " " + (n[2] + h) + " Z " : o === "<" && (s = " M " + (n[1] - t) + " " + n[2] + " L " + (n[1] + l) + " " + (n[2] - h) + " L " + (n[1] + l) + " " + (n[2] + h) + " Z "), s;
  }, updatePathStringPrim: function(e) {
    var t, o, s, n = " M ", h = n, l = 5e3, p = "";
    if (e.numberPoints <= 0)
      return "";
    if (s = Math.min(e.points.length, e.numberPoints), e.bezierDegree === 1)
      for (t = 0; t < s; t++)
        o = e.points[t].scrCoords, isNaN(o[1]) || isNaN(o[2]) ? h = n : (o[1] = Math.max(Math.min(o[1], l), -5e3), o[2] = Math.max(Math.min(o[2], l), -5e3), p += h + o[1] + " " + o[2], h = " L ");
    else if (e.bezierDegree === 3)
      for (t = 0; t < s; )
        o = e.points[t].scrCoords, isNaN(o[1]) || isNaN(o[2]) ? h = n : (p += h + o[1] + " " + o[2], h === " C " && (t += 1, p += " " + (o = e.points[t].scrCoords)[1] + " " + o[2], t += 1, p += " " + (o = e.points[t].scrCoords)[1] + " " + o[2]), h = " C "), t += 1;
    return p;
  }, updatePathStringBezierPrim: function(e) {
    var t, o, s, n, h, l, p, u = " M ", v = u, Z = 5e3, y = "", O = a.Z.evaluate(e.visProp.strokewidth), S = a.Z.evaluate(e.visProp.curvetype) !== "plot";
    if (e.numberPoints <= 0)
      return "";
    for (S && e.board.options.curve.RDPsmoothing && (e.points = c.Z.RamerDouglasPeucker(e.points, 0.5)), p = Math.min(e.points.length, e.numberPoints), o = 1; o < 3; o++)
      for (v = u, t = 0; t < p; t++)
        n = e.points[t].scrCoords, isNaN(n[1]) || isNaN(n[2]) ? v = u : (n[1] = Math.max(Math.min(n[1], Z), -5e3), n[2] = Math.max(Math.min(n[2], Z), -5e3), v === u ? y += v + n[1] + " " + n[2] : (s = 2 * o, y += [v, h + 0.333 * (n[1] - h) + O * (s * Math.random() - o), " ", l + 0.333 * (n[2] - l) + O * (s * Math.random() - o), " ", h + 0.666 * (n[1] - h) + O * (s * Math.random() - o), " ", l + 0.666 * (n[2] - l) + O * (s * Math.random() - o), " ", n[1], " ", n[2]].join("")), v = " C ", h = n[1], l = n[2]);
    return y;
  }, updatePolygonPrim: function(e, t) {
    var o, s, n = "", h = t.vertices.length;
    for (e.setAttributeNS(null, "stroke", "none"), e.setAttributeNS(null, "fill-rule", "evenodd"), t.elType === "polygonalchain" && h++, o = 0; o < h - 1; o++) {
      if (!t.vertices[o].isReal)
        return void e.setAttributeNS(null, "points", "");
      n = n + (s = t.vertices[o].coords.scrCoords)[1] + "," + s[2], o < h - 2 && (n += " ");
    }
    n.indexOf("NaN") === -1 && e.setAttributeNS(null, "points", n);
  }, updateRectPrim: function(e, t, o, s, n) {
    e.setAttributeNS(null, "x", t), e.setAttributeNS(null, "y", o), e.setAttributeNS(null, "width", s), e.setAttributeNS(null, "height", n);
  }, setPropertyPrim: function(e, t, o) {
    t !== "stroked" && e.setAttributeNS(null, t, o);
  }, display: function(e, t) {
    var o;
    e && e.rendNode && (e.visPropOld.visible = t, o = e.rendNode, t ? (o.setAttributeNS(null, "display", "inline"), o.style.visibility = "inherit") : (o.setAttributeNS(null, "display", "none"), o.style.visibility = "hidden"));
  }, show: function(e) {
    d.Z.deprecated("Board.renderer.show()", "Board.renderer.display()"), this.display(e, !0);
  }, hide: function(e) {
    d.Z.deprecated("Board.renderer.hide()", "Board.renderer.display()"), this.display(e, !1);
  }, setBuffering: function(e, t) {
    e.rendNode.setAttribute("buffered-rendering", t);
  }, setDashStyle: function(e) {
    var t = a.Z.evaluate(e.visProp.dash), o = e.rendNode;
    t > 0 ? o.setAttributeNS(null, "stroke-dasharray", this.dashArray[t - 1]) : o.hasAttributeNS(null, "stroke-dasharray") && o.removeAttributeNS(null, "stroke-dasharray");
  }, setGradient: function(e) {
    var t, o, s, n = e.rendNode, h = a.Z.evaluate(e.visProp.gradient);
    h === "linear" || h === "radial" ? (t = this.createPrim(h + "Gradient", e.id + "_gradient"), o = this.createPrim("stop", e.id + "_gradient1"), s = this.createPrim("stop", e.id + "_gradient2"), t.appendChild(o), t.appendChild(s), this.defs.appendChild(t), n.setAttributeNS(null, "style", "fill:" + this.toURL(this.container.id + "_" + e.id + "_gradient")), e.gradNode1 = o, e.gradNode2 = s, e.gradNode = t) : n.removeAttributeNS(null, "style");
  }, updateGradientAngle: function(e, t) {
    var o = 1, s = Math.cos(t), n = Math.sin(t);
    Math.abs(s) > Math.abs(n) ? o /= Math.abs(s) : o /= Math.abs(n), s >= 0 ? (e.setAttributeNS(null, "x1", 0), e.setAttributeNS(null, "x2", s * o)) : (e.setAttributeNS(null, "x1", -s * o), e.setAttributeNS(null, "x2", 0)), n >= 0 ? (e.setAttributeNS(null, "y1", 0), e.setAttributeNS(null, "y2", n * o)) : (e.setAttributeNS(null, "y1", -n * o), e.setAttributeNS(null, "y2", 0));
  }, updateGradientCircle: function(e, t, o, s, n, h, l) {
    e.setAttributeNS(null, "cx", 100 * t + "%"), e.setAttributeNS(null, "cy", 100 * o + "%"), e.setAttributeNS(null, "r", 100 * s + "%"), e.setAttributeNS(null, "fx", 100 * n + "%"), e.setAttributeNS(null, "fy", 100 * h + "%"), e.setAttributeNS(null, "fr", 100 * l + "%");
  }, updateGradient: function(e) {
    var t, o, s = e.gradNode1, n = e.gradNode2, h = a.Z.evaluate(e.visProp.gradient);
    a.Z.exists(s) && a.Z.exists(n) && (o = (o = a.Z.evaluate(e.visProp.fillopacity)) > 0 ? o : 0, t = a.Z.evaluate(e.visProp.fillcolor), s.setAttributeNS(null, "style", "stop-color:" + t + ";stop-opacity:" + o), n.setAttributeNS(null, "style", "stop-color:" + a.Z.evaluate(e.visProp.gradientsecondcolor) + ";stop-opacity:" + a.Z.evaluate(e.visProp.gradientsecondopacity)), s.setAttributeNS(null, "offset", 100 * a.Z.evaluate(e.visProp.gradientstartoffset) + "%"), n.setAttributeNS(null, "offset", 100 * a.Z.evaluate(e.visProp.gradientendoffset) + "%"), h === "linear" ? this.updateGradientAngle(e.gradNode, a.Z.evaluate(e.visProp.gradientangle)) : h === "radial" && this.updateGradientCircle(e.gradNode, a.Z.evaluate(e.visProp.gradientcx), a.Z.evaluate(e.visProp.gradientcy), a.Z.evaluate(e.visProp.gradientr), a.Z.evaluate(e.visProp.gradientfx), a.Z.evaluate(e.visProp.gradientfy), a.Z.evaluate(e.visProp.gradientfr)));
  }, setObjectTransition: function(e, t) {
    var o, s, n, h = [], l = 0, p = ["rendNode", "rendNodeTriangleStart", "rendNodeTriangleEnd"];
    if (t === void 0 && (t = a.Z.evaluate(e.visProp.transitionduration)), o = a.Z.evaluate(e.visProp.transitionproperties), t !== e.visPropOld.transitionduration || o !== e.visPropOld.transitionproperties) {
      for (a.Z.exists(o) && (l = o.length), n = 0; n < l; n++)
        h.push(o[n] + " " + t + "ms");
      for (s = h.join(", "), l = p.length, n = 0; n < l; ++n)
        e[p[n]] && (e[p[n]].style.transition = s);
      e.visPropOld.transitionduration = t, e.visPropOld.transitionproperties = o;
    }
  }, _setAttribute: function(e, t) {
    t === "" ? e() : window.setTimeout(e, 1);
  }, setObjectFillColor: function(e, t, o, s) {
    var n, h, l, p, u = a.Z.evaluate(t), v = a.Z.evaluate(o), Z = a.Z.evaluate(e.visProp.gradient);
    v = v > 0 ? v : 0, e.visPropOld.fillcolor === u && e.visPropOld.fillopacity === v && Z === null || (a.Z.exists(u) && u !== !1 && (u.length !== 9 ? (h = u, p = v) : (l = fe.Z.rgba2rgbo(u), h = l[0], p = v * l[1]), n = s === void 0 ? e.rendNode : s, h !== "none" && this._setAttribute(function() {
      n.setAttributeNS(null, "fill", h);
    }, e.visPropOld.fillcolor), e.type === d.Z.OBJECT_TYPE_IMAGE ? this._setAttribute(function() {
      n.setAttributeNS(null, "opacity", p);
    }, e.visPropOld.fillopacity) : (h === "none" ? (p = 0, n.setAttributeNS(null, "pointer-events", "visibleStroke")) : n.setAttributeNS(null, "pointer-events", "visiblePainted"), this._setAttribute(function() {
      n.setAttributeNS(null, "fill-opacity", p);
    }, e.visPropOld.fillopacity)), Z !== "linear" && Z !== "radial" || this.updateGradient(e)), e.visPropOld.fillcolor = u, e.visPropOld.fillopacity = v);
  }, setObjectStrokeColor: function(e, t, o) {
    var s, n, h, l, p = a.Z.evaluate(t), u = a.Z.evaluate(o);
    u = u > 0 ? u : 0, e.visPropOld.strokecolor === p && e.visPropOld.strokeopacity === u || (a.Z.exists(p) && p !== !1 && (p.length !== 9 ? (s = p, h = u) : (n = fe.Z.rgba2rgbo(p), s = n[0], h = u * n[1]), l = e.rendNode, e.elementClass === x.Z.OBJECT_CLASS_TEXT ? a.Z.evaluate(e.visProp.display) === "html" ? this._setAttribute(function() {
      l.style.color = s, l.style.opacity = h;
    }, e.visPropOld.strokecolor) : this._setAttribute(function() {
      l.setAttributeNS(null, "style", "fill:" + s), l.setAttributeNS(null, "style", "fill-opacity:" + h);
    }, e.visPropOld.strokecolor) : this._setAttribute(function() {
      l.setAttributeNS(null, "stroke", s), l.setAttributeNS(null, "stroke-opacity", h);
    }, e.visPropOld.strokecolor), e.elementClass !== x.Z.OBJECT_CLASS_CURVE && e.elementClass !== x.Z.OBJECT_CLASS_LINE || (a.Z.evaluate(e.visProp.firstarrow) && this._setArrowColor(e.rendNodeTriangleStart, s, h, e, e.visPropCalc.typeFirst), a.Z.evaluate(e.visProp.lastarrow) && this._setArrowColor(e.rendNodeTriangleEnd, s, h, e, e.visPropCalc.typeLast))), e.visPropOld.strokecolor = p, e.visPropOld.strokeopacity = u);
  }, setObjectStrokeWidth: function(e, t) {
    var o, s = a.Z.evaluate(t);
    isNaN(s) || e.visPropOld.strokewidth === s || (o = e.rendNode, this.setPropertyPrim(o, "stroked", "true"), a.Z.exists(s) && this.setPropertyPrim(o, "stroke-width", s + "px"), e.visPropOld.strokewidth = s);
  }, setLineCap: function(e) {
    var t = a.Z.evaluate(e.visProp.linecap);
    t !== void 0 && t !== "" && e.visPropOld.linecap !== t && a.Z.exists(e.rendNode) && (this.setPropertyPrim(e.rendNode, "stroke-linecap", t), e.visPropOld.linecap = t);
  }, setShadow: function(e) {
    var t, o, s, n, h, l, p, u, v = a.Z.evaluate(e.visProp.shadow), Z = !0, y = !1;
    (t = JSON.stringify(v)) !== e.visPropOld.shadow && (typeof v == "boolean" ? (Z = !0, y = v, o = "none", s = 3, n = 0.1, h = [5, 5], l = 1) : a.Z.evaluate(v.enabled) ? (Z = !1, y = !0, o = d.Z.rgbParser(a.Z.evaluate(v.color)), s = a.Z.evaluate(v.blur), n = a.Z.evaluate(v.blend), h = a.Z.evaluate(v.offset), l = a.Z.evaluate(v.opacity)) : y = !1, a.Z.exists(e.rendNode) && (y ? Z ? e.rendNode.setAttributeNS(null, "filter", this.toURL(this.container.id + "_f1")) : ((u = this.container.ownerDocument.getElementById(p)) && this.defs.removeChild(u), p = e.rendNode.id + "_f1", this.defs.appendChild(this.createShadowFilter(p, o, l, n, s, h)), e.rendNode.setAttributeNS(null, "filter", this.toURL(p))) : e.rendNode.removeAttributeNS(null, "filter")), e.visPropOld.shadow = t);
  }, suspendRedraw: function() {
  }, unsuspendRedraw: function() {
  }, resize: function(e, t) {
    this.svgRoot.setAttribute("width", parseFloat(e)), this.svgRoot.setAttribute("height", parseFloat(t));
  }, createTouchpoints: function(e) {
    var t, o, s, n;
    for (this.touchpoints = [], t = 0; t < e; t++)
      o = "touchpoint1_" + t, n = this.createPrim("path", o), this.appendChildPrim(n, 19), n.setAttributeNS(null, "d", "M 0 0"), this.touchpoints.push(n), this.setPropertyPrim(n, "stroked", "true"), this.setPropertyPrim(n, "stroke-width", "1px"), n.setAttributeNS(null, "stroke", "#000000"), n.setAttributeNS(null, "stroke-opacity", 1), n.setAttributeNS(null, "display", "none"), s = "touchpoint2_" + t, n = this.createPrim("ellipse", s), this.appendChildPrim(n, 19), this.updateEllipsePrim(n, 0, 0, 0, 0), this.touchpoints.push(n), this.setPropertyPrim(n, "stroked", "true"), this.setPropertyPrim(n, "stroke-width", "1px"), n.setAttributeNS(null, "stroke", "#000000"), n.setAttributeNS(null, "stroke-opacity", 1), n.setAttributeNS(null, "fill", "#ffffff"), n.setAttributeNS(null, "fill-opacity", 0), n.setAttributeNS(null, "display", "none");
  }, showTouchpoint: function(e) {
    this.touchpoints && e >= 0 && 2 * e < this.touchpoints.length && (this.touchpoints[2 * e].setAttributeNS(null, "display", "inline"), this.touchpoints[2 * e + 1].setAttributeNS(null, "display", "inline"));
  }, hideTouchpoint: function(e) {
    this.touchpoints && e >= 0 && 2 * e < this.touchpoints.length && (this.touchpoints[2 * e].setAttributeNS(null, "display", "none"), this.touchpoints[2 * e + 1].setAttributeNS(null, "display", "none"));
  }, updateTouchpoint: function(e, t) {
    var o, s;
    this.touchpoints && e >= 0 && 2 * e < this.touchpoints.length && (o = t[0], s = t[1], this.touchpoints[2 * e].setAttributeNS(null, "d", "M " + (o - 37) + " " + s + " L " + (o + 37) + " " + s + " M " + o + " " + (s - 37) + " L " + o + " " + (s + 37)), this.updateEllipsePrim(this.touchpoints[2 * e + 1], t[0], t[1], 25, 25));
  }, _getValuesOfDOMElements: function(e) {
    var t = [];
    if (e.nodeType === 1)
      for (e = e.firstChild; e; )
        e.id !== void 0 && e.value !== void 0 && t.push([e.id, e.value]), t = t.concat(this._getValuesOfDOMElements(e)), e = e.nextSibling;
    return t;
  }, _getDataUri: function(e, t) {
    var o = new Image();
    o.onload = function() {
      var s = document.createElement("canvas");
      s.width = this.naturalWidth, s.height = this.naturalHeight, s.getContext("2d").drawImage(this, 0, 0), t(s.toDataURL("image/png")), s.remove();
    }, o.src = e;
  }, _getImgDataURL: function(e) {
    var t, o, s, n, h, l;
    if ((o = (t = e.getElementsByTagName("image")).length) > 0)
      for (s = document.createElement("canvas"), l = 0; l < o; l++) {
        t[l].setAttribute("crossorigin", "anonymous"), n = s.getContext("2d"), s.width = t[l].getAttribute("width"), s.height = t[l].getAttribute("height");
        try {
          n.drawImage(t[l], 0, 0, s.width, s.height), h = s.toDataURL(), t[l].setAttribute("xlink:href", h);
        } catch (p) {
          console.log("CORS problem! Image can not be used", p);
        }
      }
    return !0;
  }, dumpToDataURI: function(e) {
    var t, o, s, n = this.svgRoot, h = window.btoa || V.encode, l = [];
    if (this.container.hasChildNodes() && a.Z.exists(this.foreignObjLayer))
      for (e || this.foreignObjLayer.setAttribute("display", "inline"); n.nextSibling; )
        l = l.concat(this._getValuesOfDOMElements(n.nextSibling)), this.foreignObjLayer.appendChild(n.nextSibling);
    if (this._getImgDataURL(n), n.setAttribute("xmlns", "http://www.w3.org/2000/svg"), t = new XMLSerializer().serializeToString(n), e !== !0)
      for (s = l.length, o = 0; o < s; o++)
        t = t.replace('id="' + l[o][0] + '"', 'id="' + l[o][0] + '" value="' + l[o][1] + '"');
    if ((t.match(/xmlns="http:\/\/www.w3.org\/2000\/svg"/g) || []).length > 1 && (t = t.replace(/xmlns="http:\/\/www.w3.org\/2000\/svg"/g, "")), t = t.replace(/&nbsp;/g, " "), a.Z.exists(this.foreignObjLayer) && this.foreignObjLayer.hasChildNodes()) {
      for (; this.foreignObjLayer.firstChild; )
        this.container.appendChild(this.foreignObjLayer.firstChild);
      this.foreignObjLayer.setAttribute("display", "none");
    }
    return "data:image/svg+xml;base64," + h(unescape(encodeURIComponent(t)));
  }, dumpToCanvas: function(e, t, o, s) {
    var n, h, l, p;
    return (l = this.container.ownerDocument.getElementById(e)).width = l.width, p = l.getContext("2d"), t !== void 0 && o !== void 0 && (l.style.width = parseFloat(t) + "px", l.style.height = parseFloat(o) + "px", l.setAttribute("width", parseFloat(t)), l.setAttribute("height", parseFloat(o))), h = new Image(), n = this.dumpToDataURI(s), h.src = n, "Promise" in window ? new Promise(function(u, v) {
      try {
        h.onload = function() {
          p.drawImage(h, 0, 0, t, o), u();
        };
      } catch (Z) {
        v(Z);
      }
    }) : (h.onload = function() {
      window.setTimeout(function() {
        try {
          p.drawImage(h, 0, 0, t, o);
        } catch {
          console.log("screenshots not longer supported on IE");
        }
      }, 200);
    }, this);
  }, screenshot: function(e, t, o) {
    var s, n, h, l, p, u, v, Z, y, O, S, R = this.container.ownerDocument, L = this.container.parentNode, B = e.attr.screenshot, X = !1;
    return this.type === "no" || (v = B.scale * this.container.getBoundingClientRect().width, Z = B.scale * this.container.getBoundingClientRect().height, t === void 0 || t === "" ? (X = !0, (l = new Image()).style.width = v + "px", l.style.height = Z + "px") : (X = !1, l = R.getElementById(t)), X && ((s = R.createElement("div")).style.cssText = B.css, s.style.width = v + "px", s.style.height = Z + "px", s.style.zIndex = this.container.style.zIndex + 120, s.style.position = "absolute", s.style.top = this.container.offsetTop + "px", s.style.left = this.container.offsetLeft + "px"), n = R.createElement("canvas"), h = Math.random().toString(36).substr(2, 5), n.setAttribute("id", h), n.setAttribute("width", v), n.setAttribute("height", Z), n.style.width = v + "px", n.style.height = v + "px", n.style.display = "none", L.appendChild(n), X && (p = R.createElement("span"), u = R.createTextNode("✖"), p.style.cssText = B.cssButton, p.appendChild(u), p.onclick = function() {
      s.parentNode.removeChild(s);
    }, s.appendChild(l), s.appendChild(p), L.insertBefore(s, this.container.nextSibling)), y = R.getElementById(this.container.id + "_navigationbar"), a.Z.exists(y) && (O = y.style.display, y.style.display = "none"), S = function() {
      l.src = n.toDataURL("image/png"), L.removeChild(n);
    }, "Promise" in window ? this.dumpToCanvas(h, v, Z, o).then(S) : (this.dumpToCanvas(h, v, Z, o), window.setTimeout(S, 200)), a.Z.exists(y) && (y.style.display = O)), this;
  } });
  const je = d.Z.SVGRenderer;
  d.Z.VMLRenderer = function(e) {
    this.type = "vml", this.container = e, this.container.style.overflow = "hidden", this.container.style.position === "" && (this.container.style.position = "relative"), this.container.onselectstart = function() {
      return !1;
    }, this.resolution = 10, a.Z.exists(d.Z.vmlStylesheet) || (e.ownerDocument.namespaces.add("jxgvml", "urn:schemas-microsoft-com:vml"), d.Z.vmlStylesheet = this.container.ownerDocument.createStyleSheet(), d.Z.vmlStylesheet.addRule(".jxgvml", "behavior:url(#default#VML)"));
    try {
      e.ownerDocument.namespaces.jxgvml || e.ownerDocument.namespaces.add("jxgvml", "urn:schemas-microsoft-com:vml"), this.createNode = function(t) {
        return e.ownerDocument.createElement("<jxgvml:" + t + ' class="jxgvml">');
      };
    } catch {
      this.createNode = function(o) {
        return e.ownerDocument.createElement("<" + o + ' xmlns="urn:schemas-microsoft.com:vml" class="jxgvml">');
      };
    }
    this.dashArray = ["Solid", "1 1", "ShortDash", "Dash", "LongDash", "ShortDashDot", "LongDashDot"];
  }, d.Z.VMLRenderer.prototype = new se(), d.Z.extend(d.Z.VMLRenderer.prototype, { _setAttr: function(e, t, o, s) {
    try {
      this.container.ownerDocument.documentMode === 8 ? e[t] = o : e.setAttribute(t, o, s);
    } catch {
      d.Z.debug("_setAttr: " + t + " " + o + `<br>
`);
    }
  }, updateTicks: function(e) {
    var t, o, s, n, h, l = this.resolution, p = [];
    for (o = e.ticks.length, t = 0; t < o; t++)
      n = (s = e.ticks[t])[0], h = s[1], a.Z.isNumber(n[0]) && a.Z.isNumber(n[1]) && p.push(" m " + Math.round(l * n[0]) + ", " + Math.round(l * h[0]) + " l " + Math.round(l * n[1]) + ", " + Math.round(l * h[1]) + " ");
    a.Z.exists(e.rendNode) || (e.rendNode = this.createPrim("path", e.id), this.appendChildPrim(e.rendNode, a.Z.evaluate(e.visProp.layer))), this._setAttr(e.rendNode, "stroked", "true"), this._setAttr(e.rendNode, "strokecolor", a.Z.evaluate(e.visProp.strokecolor), 1), this._setAttr(e.rendNode, "strokeweight", a.Z.evaluate(e.visProp.strokewidth)), this._setAttr(e.rendNodeStroke, "opacity", 100 * a.Z.evaluate(e.visProp.strokeopacity) + "%"), this.updatePathPrim(e.rendNode, p, e.board);
  }, displayCopyright: function(e, t) {
    var o, s;
    (o = this.createNode("textbox")).style.position = "absolute", this._setAttr(o, "id", this.container.id + "_licenseText"), o.style.left = 20, o.style.top = 2, o.style.fontSize = t, o.style.color = "#356AA0", o.style.fontFamily = "Arial,Helvetica,sans-serif", this._setAttr(o, "opacity", "30%"), o.style.filter = "progid:DXImageTransform.Microsoft.Matrix(M11='1.0', sizingMethod='auto expand', enabled = false) progid:DXImageTransform.Microsoft.Alpha(opacity = 30, enabled = true)", s = this.container.ownerDocument.createTextNode(e), o.appendChild(s), this.appendChildPrim(o, 0);
  }, drawInternalText: function(e) {
    var t;
    return (t = this.createNode("textbox")).style.position = "absolute", e.rendNodeText = this.container.ownerDocument.createTextNode(""), t.appendChild(e.rendNodeText), this.appendChildPrim(t, 9), t.style.filter = "progid:DXImageTransform.Microsoft.Matrix(M11='1.0', sizingMethod='auto expand', enabled = false) progid:DXImageTransform.Microsoft.Alpha(opacity = 100, enabled = false)", t;
  }, updateInternalText: function(e) {
    var t, o, s, n, h, l, p = e.plaintext, u = this.joinTransforms(e, e.transformations), v = [0, 0], Z = e.rendNode, y = [], O = e.getAnchorX(), S = e.getAnchorY();
    if (!isNaN(e.coords.scrCoords[1] + e.coords.scrCoords[2])) {
      for (O === "right" ? v[0] = 1 : O === "middle" && (v[0] = 0.5), S === "bottom" ? v[1] = 1 : S === "middle" && (v[1] = 0.5), y[0] = k.Z.matVecMult(u, [1, e.coords.scrCoords[1] - v[0] * e.size[0], e.coords.scrCoords[2] + (1 - v[1]) * e.size[1] + this.vOffsetText]), y[0][1] /= y[0][0], y[0][2] /= y[0][0], y[1] = k.Z.matVecMult(u, [1, e.coords.scrCoords[1] + (1 - v[0]) * e.size[0], e.coords.scrCoords[2] + (1 - v[1]) * e.size[1] + this.vOffsetText]), y[1][1] /= y[1][0], y[1][2] /= y[1][0], y[2] = k.Z.matVecMult(u, [1, e.coords.scrCoords[1] + (1 - v[0]) * e.size[0], e.coords.scrCoords[2] - v[1] * e.size[1] + this.vOffsetText]), y[2][1] /= y[2][0], y[2][2] /= y[2][0], y[3] = k.Z.matVecMult(u, [1, e.coords.scrCoords[1] - v[0] * e.size[0], e.coords.scrCoords[2] - v[1] * e.size[1] + this.vOffsetText]), y[3][1] /= y[3][0], y[3][2] /= y[3][0], o = y[0][1], n = y[0][1], s = y[0][2], h = y[0][2], l = 1; l < 4; l++)
        o = Math.max(o, y[l][1]), n = Math.min(n, y[l][1]), s = Math.max(s, y[l][2]), h = Math.min(h, y[l][2]);
      t = v[0] === 1 ? Math.floor(e.board.canvasWidth - o) : Math.floor(n), e.visPropOld.left !== O + t && (v[0] === 1 ? (e.rendNode.style.right = t + "px", e.rendNode.style.left = "auto") : (e.rendNode.style.left = t + "px", e.rendNode.style.right = "auto"), e.visPropOld.left = O + t), t = v[1] === 1 ? Math.floor(e.board.canvasHeight - s) : Math.floor(h), e.visPropOld.top !== S + t && (v[1] === 1 ? (e.rendNode.style.bottom = t + "px", e.rendNode.style.top = "auto") : (e.rendNode.style.top = t + "px", e.rendNode.style.bottom = "auto"), e.visPropOld.top = S + t);
    }
    e.htmlStr !== p && (e.rendNodeText.data = p, e.htmlStr = p), Z.filters.item(0).M11 = u[1][1], Z.filters.item(0).M12 = u[1][2], Z.filters.item(0).M21 = u[2][1], Z.filters.item(0).M22 = u[2][2], Z.filters.item(0).enabled = !0;
  }, drawImage: function(e) {
    var t;
    (t = this.container.ownerDocument.createElement("img")).style.position = "absolute", this._setAttr(t, "id", this.container.id + "_" + e.id), this.container.appendChild(t), this.appendChildPrim(t, a.Z.evaluate(e.visProp.layer)), t.style.filter = "progid:DXImageTransform.Microsoft.Matrix(M11='1.0', sizingMethod='auto expand') progid:DXImageTransform.Microsoft.Alpha(opacity = 100, enabled = false)", e.rendNode = t, this.updateImage(e);
  }, transformImage: function(e, t) {
    var o, s, n, h, l, p, u = e.rendNode, v = [];
    if (t.length > 0) {
      for (o = this.joinTransforms(e, t), v[0] = k.Z.matVecMult(o, e.coords.scrCoords), v[0][1] /= v[0][0], v[0][2] /= v[0][0], v[1] = k.Z.matVecMult(o, [1, e.coords.scrCoords[1] + e.size[0], e.coords.scrCoords[2]]), v[1][1] /= v[1][0], v[1][2] /= v[1][0], v[2] = k.Z.matVecMult(o, [1, e.coords.scrCoords[1] + e.size[0], e.coords.scrCoords[2] - e.size[1]]), v[2][1] /= v[2][0], v[2][2] /= v[2][0], v[3] = k.Z.matVecMult(o, [1, e.coords.scrCoords[1], e.coords.scrCoords[2] - e.size[1]]), v[3][1] /= v[3][0], v[3][2] /= v[3][0], s = v[0][1], h = v[0][1], n = v[0][2], l = v[0][2], p = 1; p < 4; p++)
        s = Math.max(s, v[p][1]), h = Math.min(h, v[p][1]), n = Math.max(n, v[p][2]), l = Math.min(l, v[p][2]);
      u.style.left = Math.floor(h) + "px", u.style.top = Math.floor(l) + "px", u.filters.item(0).M11 = o[1][1], u.filters.item(0).M12 = o[1][2], u.filters.item(0).M21 = o[2][1], u.filters.item(0).M22 = o[2][2], u.filters.item(0).enabled = !0;
    }
  }, updateImageURL: function(e) {
    var t = a.Z.evaluate(e.url);
    this._setAttr(e.rendNode, "src", t);
  }, appendChildPrim: function(e, t) {
    return a.Z.exists(t) || (t = 0), e.style.zIndex = t, this.container.appendChild(e), e;
  }, appendNodesToElement: function(e, t) {
    t !== "shape" && t !== "path" && t !== "polygon" || (e.rendNodePath = this.getElementById(e.id + "_path")), e.rendNodeFill = this.getElementById(e.id + "_fill"), e.rendNodeStroke = this.getElementById(e.id + "_stroke"), e.rendNodeShadow = this.getElementById(e.id + "_shadow"), e.rendNode = this.getElementById(e.id);
  }, createPrim: function(e, t) {
    var o, s, n = this.createNode("fill"), h = this.createNode("stroke"), l = this.createNode("shadow");
    return this._setAttr(n, "id", this.container.id + "_" + t + "_fill"), this._setAttr(h, "id", this.container.id + "_" + t + "_stroke"), this._setAttr(l, "id", this.container.id + "_" + t + "_shadow"), e === "circle" || e === "ellipse" ? ((o = this.createNode("oval")).appendChild(n), o.appendChild(h), o.appendChild(l)) : e === "polygon" || e === "path" || e === "shape" || e === "line" ? ((o = this.createNode("shape")).appendChild(n), o.appendChild(h), o.appendChild(l), s = this.createNode("path"), this._setAttr(s, "id", this.container.id + "_" + t + "_path"), o.appendChild(s)) : ((o = this.createNode(e)).appendChild(n), o.appendChild(h), o.appendChild(l)), o.style.position = "absolute", o.style.left = "0px", o.style.top = "0px", this._setAttr(o, "id", this.container.id + "_" + t), o;
  }, remove: function(e) {
    a.Z.exists(e) && e.removeNode(!0);
  }, makeArrows: function(e) {
    var t, o = a.Z.evaluate(e.visProp.firstarrow), s = a.Z.evaluate(e.visProp.lastarrow);
    e.visPropOld.firstarrow === o && e.visPropOld.lastarrow === s || (o ? (t = e.rendNodeStroke, this._setAttr(t, "startarrow", "block"), this._setAttr(t, "startarrowlength", "long")) : (t = e.rendNodeStroke, a.Z.exists(t) && this._setAttr(t, "startarrow", "none")), s ? (t = e.rendNodeStroke, this._setAttr(t, "id", this.container.id + "_" + e.id + "stroke"), this._setAttr(t, "endarrow", "block"), this._setAttr(t, "endarrowlength", "long")) : (t = e.rendNodeStroke, a.Z.exists(t) && this._setAttr(t, "endarrow", "none")), e.visPropOld.firstarrow = o, e.visPropOld.lastarrow = s);
  }, updateEllipsePrim: function(e, t, o, s, n) {
    e.style.left = Math.floor(t - s) + "px", e.style.top = Math.floor(o - n) + "px", e.style.width = Math.floor(2 * Math.abs(s)) + "px", e.style.height = Math.floor(2 * Math.abs(n)) + "px";
  }, updateLinePrim: function(e, t, o, s, n, h) {
    var l, p = this.resolution;
    isNaN(t + o + s + n) || (l = ["m ", Math.floor(p * t), ", ", Math.floor(p * o), " l ", Math.floor(p * s), ", ", Math.floor(p * n)], this.updatePathPrim(e, l, h));
  }, updatePathPrim: function(e, t, o) {
    var s = o.canvasWidth, n = o.canvasHeight;
    t.length <= 0 && (t = ["m 0,0"]), e.style.width = s, e.style.height = n, this._setAttr(e, "coordsize", [Math.floor(this.resolution * s), Math.floor(this.resolution * n)].join(",")), this._setAttr(e, "path", t.join(""));
  }, updatePathStringPoint: function(e, t, o) {
    var s = [], n = Math.round, h = e.coords.scrCoords, l = t * Math.sqrt(3) * 0.5, p = 0.5 * t, u = this.resolution;
    return o === "x" ? s.push([" m ", n(u * (h[1] - t)), ", ", n(u * (h[2] - t)), " l ", n(u * (h[1] + t)), ", ", n(u * (h[2] + t)), " m ", n(u * (h[1] + t)), ", ", n(u * (h[2] - t)), " l ", n(u * (h[1] - t)), ", ", n(u * (h[2] + t))].join("")) : o === "+" ? s.push([" m ", n(u * (h[1] - t)), ", ", n(u * h[2]), " l ", n(u * (h[1] + t)), ", ", n(u * h[2]), " m ", n(u * h[1]), ", ", n(u * (h[2] - t)), " l ", n(u * h[1]), ", ", n(u * (h[2] + t))].join("")) : o === "<>" ? s.push([" m ", n(u * (h[1] - t)), ", ", n(u * h[2]), " l ", n(u * h[1]), ", ", n(u * (h[2] + t)), " l ", n(u * (h[1] + t)), ", ", n(u * h[2]), " l ", n(u * h[1]), ", ", n(u * (h[2] - t)), " x e "].join("")) : o === "^" ? s.push([" m ", n(u * h[1]), ", ", n(u * (h[2] - t)), " l ", n(u * (h[1] - l)), ", ", n(u * (h[2] + p)), " l ", n(u * (h[1] + l)), ", ", n(u * (h[2] + p)), " x e "].join("")) : o === "v" ? s.push([" m ", n(u * h[1]), ", ", n(u * (h[2] + t)), " l ", n(u * (h[1] - l)), ", ", n(u * (h[2] - p)), " l ", n(u * (h[1] + l)), ", ", n(u * (h[2] - p)), " x e "].join("")) : o === ">" ? s.push([" m ", n(u * (h[1] + t)), ", ", n(u * h[2]), " l ", n(u * (h[1] - p)), ", ", n(u * (h[2] - l)), " l ", n(u * (h[1] - p)), ", ", n(u * (h[2] + l)), " l ", n(u * (h[1] + t)), ", ", n(u * h[2])].join("")) : o === "<" && s.push([" m ", n(u * (h[1] - t)), ", ", n(u * h[2]), " l ", n(u * (h[1] + p)), ", ", n(u * (h[2] - l)), " l ", n(u * (h[1] + p)), ", ", n(u * (h[2] + l)), " x e "].join("")), s;
  }, updatePathStringPrim: function(e) {
    var t, o, s = [], n = this.resolution, h = Math.round, l = " m ", p = l, u = Math.min(e.numberPoints, 8192);
    if (e.numberPoints <= 0)
      return "";
    if (u = Math.min(u, e.points.length), e.bezierDegree === 1)
      for (t = 0; t < u; t++)
        o = e.points[t].scrCoords, isNaN(o[1]) || isNaN(o[2]) ? p = l : (o[1] > 2e4 ? o[1] = 2e4 : o[1] < -2e4 && (o[1] = -2e4), o[2] > 2e4 ? o[2] = 2e4 : o[2] < -2e4 && (o[2] = -2e4), s.push([p, h(n * o[1]), ", ", h(n * o[2])].join("")), p = " l ");
    else if (e.bezierDegree === 3)
      for (t = 0; t < u; )
        o = e.points[t].scrCoords, isNaN(o[1]) || isNaN(o[2]) ? p = l : (s.push([p, h(n * o[1]), ", ", h(n * o[2])].join("")), p === " c " && (t += 1, o = e.points[t].scrCoords, s.push([" ", h(n * o[1]), ", ", h(n * o[2])].join("")), t += 1, o = e.points[t].scrCoords, s.push([" ", h(n * o[1]), ", ", h(n * o[2])].join(""))), p = " c "), t += 1;
    return s.push(" e"), s;
  }, updatePathStringBezierPrim: function(e) {
    var t, o, s, n, h, l, p = [], u = a.Z.evaluate(e.visProp.strokewidth), v = this.resolution, Z = Math.round, y = " m ", O = y, S = a.Z.evaluate(e.visProp.curvetype) !== "plot", R = Math.min(e.numberPoints, 8192);
    if (e.numberPoints <= 0)
      return "";
    for (S && e.board.options.curve.RDPsmoothing && (e.points = c.Z.RamerDouglasPeucker(e.points, 1)), R = Math.min(R, e.points.length), o = 1; o < 3; o++)
      for (O = y, t = 0; t < R; t++)
        n = e.points[t].scrCoords, isNaN(n[1]) || isNaN(n[2]) ? O = y : (n[1] > 2e4 ? n[1] = 2e4 : n[1] < -2e4 && (n[1] = -2e4), n[2] > 2e4 ? n[2] = 2e4 : n[2] < -2e4 && (n[2] = -2e4), O === y ? p.push([O, Z(v * n[1]), " ", Z(v * n[2])].join("")) : (s = 2 * o, p.push([O, Z(v * (h + 0.333 * (n[1] - h) + u * (s * Math.random() - o))), " ", Z(v * (l + 0.333 * (n[2] - l) + u * (s * Math.random() - o))), " ", Z(v * (h + 0.666 * (n[1] - h) + u * (s * Math.random() - o))), " ", Z(v * (l + 0.666 * (n[2] - l) + u * (s * Math.random() - o))), " ", Z(v * n[1]), " ", Z(v * n[2])].join(""))), O = " c ", h = n[1], l = n[2]);
    return p.push(" e"), p;
  }, updatePolygonPrim: function(e, t) {
    var o, s, n = t.vertices.length, h = this.resolution, l = [];
    if (this._setAttr(e, "stroked", "false"), s = t.vertices[0].coords.scrCoords, !isNaN(s[1] + s[2])) {
      for (l.push(["m ", Math.floor(h * s[1]), ",", Math.floor(h * s[2]), " l "].join("")), o = 1; o < n - 1; o++) {
        if (!t.vertices[o].isReal)
          return void this.updatePathPrim(e, "", t.board);
        if (s = t.vertices[o].coords.scrCoords, isNaN(s[1] + s[2]))
          return;
        l.push(Math.floor(h * s[1]) + "," + Math.floor(h * s[2])), o < n - 2 && l.push(", ");
      }
      l.push(" x e"), this.updatePathPrim(e, l, t.board);
    }
  }, updateRectPrim: function(e, t, o, s, n) {
    e.style.left = Math.floor(t) + "px", e.style.top = Math.floor(o) + "px", s >= 0 && (e.style.width = s + "px"), n >= 0 && (e.style.height = n + "px");
  }, setPropertyPrim: function(e, t, o) {
    var s, n = "";
    switch (t) {
      case "stroke":
        n = "strokecolor";
        break;
      case "stroke-width":
        n = "strokeweight";
        break;
      case "stroke-dasharray":
        n = "dashstyle";
    }
    n !== "" && (s = a.Z.evaluate(o), this._setAttr(e, n, s));
  }, display: function(e, t) {
    e && e.rendNode && (e.visPropOld.visible = t, e.rendNode.style.visibility = t ? "inherit" : "hidden");
  }, show: function(e) {
    d.Z.deprecated("Board.renderer.show()", "Board.renderer.display()"), e && e.rendNode && (e.rendNode.style.visibility = "inherit");
  }, hide: function(e) {
    d.Z.deprecated("Board.renderer.hide()", "Board.renderer.display()"), e && e.rendNode && (e.rendNode.style.visibility = "hidden");
  }, setDashStyle: function(e, t) {
    var o;
    t.dash >= 0 && (o = e.rendNodeStroke, this._setAttr(o, "dashstyle", this.dashArray[t.dash]));
  }, setGradient: function(e) {
    var t = e.rendNodeFill, o = a.Z.evaluate(e.visProp.gradient);
    o === "linear" ? (this._setAttr(t, "type", "gradient"), this._setAttr(t, "color2", a.Z.evaluate(e.visProp.gradientsecondcolor)), this._setAttr(t, "opacity2", a.Z.evaluate(e.visProp.gradientsecondopacity)), this._setAttr(t, "angle", a.Z.evaluate(e.visProp.gradientangle))) : o === "radial" ? (this._setAttr(t, "type", "gradientradial"), this._setAttr(t, "color2", a.Z.evaluate(e.visProp.gradientsecondcolor)), this._setAttr(t, "opacity2", a.Z.evaluate(e.visProp.gradientsecondopacity)), this._setAttr(t, "focusposition", 100 * a.Z.evaluate(e.visProp.gradientpositionx) + "%," + 100 * a.Z.evaluate(e.visProp.gradientpositiony) + "%"), this._setAttr(t, "focussize", "0,0")) : this._setAttr(t, "type", "solid");
  }, setObjectFillColor: function(e, t, o) {
    var s, n, h, l = a.Z.evaluate(t), p = a.Z.evaluate(o), u = e.rendNode;
    p = p > 0 ? p : 0, e.visPropOld.fillcolor === l && e.visPropOld.fillopacity === p || (a.Z.exists(l) && l !== !1 && (l.length !== 9 ? (s = l, h = p) : (s = (n = fe.Z.rgba2rgbo(l))[0], h = p * n[1]), s === "none" || s === !1 ? this._setAttr(e.rendNode, "filled", "false") : (this._setAttr(e.rendNode, "filled", "true"), this._setAttr(e.rendNode, "fillcolor", s), a.Z.exists(h) && e.rendNodeFill && this._setAttr(e.rendNodeFill, "opacity", 100 * h + "%")), e.type === x.Z.OBJECT_TYPE_IMAGE && u.filters.length > 1 && (u.filters.item(1).opacity = Math.round(100 * h), u.filters.item(1).enabled = !0)), e.visPropOld.fillcolor = l, e.visPropOld.fillopacity = p);
  }, setObjectStrokeColor: function(e, t, o) {
    var s, n, h, l, p = a.Z.evaluate(t), u = a.Z.evaluate(o), v = e.rendNode;
    u = u > 0 ? u : 0, e.visPropOld.strokecolor === p && e.visPropOld.strokeopacity === u || (a.Z.exists(p) && p !== !1 && (p.length !== 9 ? (s = p, h = u) : (s = (n = t.rgba2rgbo(p))[0], h = u * n[1]), e.elementClass === x.Z.OBJECT_CLASS_TEXT ? (v.filters.length > 1 && (v.filters.item(1).opacity = Math.round(100 * h), v.filters.item(1).enabled = !0), v.style.color = s) : (s !== !1 && (this._setAttr(v, "stroked", "true"), this._setAttr(v, "strokecolor", s)), l = e.rendNodeStroke, a.Z.exists(h) && e.type !== x.Z.OBJECT_TYPE_IMAGE && this._setAttr(l, "opacity", 100 * h + "%"))), e.visPropOld.strokecolor = p, e.visPropOld.strokeopacity = u);
  }, setObjectStrokeWidth: function(e, t) {
    var o, s = a.Z.evaluate(t);
    isNaN(s) || e.visPropOld.strokewidth === s || (o = e.rendNode, this.setPropertyPrim(o, "stroked", "true"), a.Z.exists(s) && (this.setPropertyPrim(o, "stroke-width", s), s === 0 && a.Z.exists(e.rendNodeStroke) && this._setAttr(o, "stroked", "false")), e.visPropOld.strokewidth = s);
  }, setShadow: function(e) {
    var t = e.rendNodeShadow, o = a.Z.evaluate(e.visProp.shadow);
    t && e.visPropOld.shadow !== o && (o ? (this._setAttr(t, "On", "True"), this._setAttr(t, "Offset", "3pt,3pt"), this._setAttr(t, "Opacity", "60%"), this._setAttr(t, "Color", "#aaaaaa")) : this._setAttr(t, "On", "False"), e.visPropOld.shadow = o);
  }, suspendRedraw: function() {
    this.container.style.display = "none";
  }, unsuspendRedraw: function() {
    this.container.style.display = "";
  } });
  const qe = d.Z.VMLRenderer;
  var it = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split("");
  d.Z.Util = d.Z.Util || {}, d.Z.Util.genUUID = function(e) {
    var t, o, s = [], n = 0;
    for ((e = e || "") !== "" && e.substr(e.length - 1) !== "-" && (e += "-"), o = 0; o < 36; o++)
      o === 8 || o === 13 || o === 18 || o === 23 ? s[o] = "-" : o === 14 ? s[o] = "4" : (n <= 2 && (n = 33554432 + 16777216 * Math.random() | 0), t = 15 & n, n >>= 4, s[o] = it[o === 19 ? 3 & t | 8 : t]);
    return e + s.join("");
  };
  const nt = d.Z.Util;
  d.Z.CanvasRenderer = function(e, t) {
    if (this.type = "canvas", this.canvasRoot = null, this.suspendHandle = null, this.canvasId = nt.genUUID(), this.canvasNamespace = null, M.Z.isBrowser)
      this.container = e, this.container.style.MozUserSelect = "none", this.container.style.userSelect = "none", this.container.style.overflow = "hidden", this.container.style.position === "" && (this.container.style.position = "relative"), this.container.innerHTML = ['<canvas id="', this.canvasId, '" width="', t.width, 'px" height="', t.height, 'px"><', "/canvas>"].join(""), this.canvasRoot = this.container.ownerDocument.getElementById(this.canvasId), this.canvasRoot.style.display = "block", this.context = this.canvasRoot.getContext("2d");
    else if (M.Z.isNode())
      try {
        this.canvasRoot = d.Z.createCanvas(500, 500), this.context = this.canvasRoot.getContext("2d");
      } catch {
        throw new Error(`JXG.createCanvas not available.
Install the npm package \`canvas\`
and call:
    import { createCanvas } from "canvas";
    JXG.createCanvas = createCanvas;
`);
      }
    this.dashArray = [[2, 2], [5, 5], [10, 10], [20, 20], [20, 10, 10, 10], [20, 5, 10, 5]];
  }, d.Z.CanvasRenderer.prototype = new se(), d.Z.extend(d.Z.CanvasRenderer.prototype, { _drawPolygon: function(e, t, o) {
    var s, n = e.length, h = this.context;
    if (n > 0) {
      if (o && (h.lineWidth = 0), h.beginPath(), h.moveTo(e[0][0], e[0][1]), t === 1)
        for (s = 1; s < n; s++)
          h.lineTo(e[s][0], e[s][1]);
      else
        for (s = 1; s < n; s += 3)
          h.bezierCurveTo(e[s][0], e[s][1], e[s + 1][0], e[s + 1][1], e[s + 2][0], e[s + 2][1]);
      o ? (h.lineTo(e[0][0], e[0][1]), h.closePath(), h.fill("evenodd")) : h.stroke();
    }
  }, _fill: function(e) {
    var t = this.context;
    t.save(), this._setColor(e, "fill") && t.fill("evenodd"), t.restore();
  }, _rotatePoint: function(e, t, o) {
    return [t * Math.cos(e) - o * Math.sin(e), t * Math.sin(e) + o * Math.cos(e)];
  }, _rotateShape: function(e, t) {
    var o, s = [], n = e.length;
    if (n <= 0)
      return e;
    for (o = 0; o < n; o++)
      s.push(this._rotatePoint(t, e[o][0], e[o][1]));
    return s;
  }, updateGradientAngle: function(e, t) {
    var o, s, n, h, l, p, u, v, Z, y, O, S, R = 1, L = Math.cos(-t), B = Math.sin(-t), X = e.getBoundingBox();
    return Math.abs(L) > Math.abs(B) ? R /= Math.abs(L) : R /= Math.abs(B), L >= 0 ? (n = 0, h = L * R) : (n = -L * R, h = 0), B >= 0 ? (l = 0, p = B * R) : (l = -B * R, p = 0), o = new b.Z(x.Z.COORDS_BY_USER, [X[0], X[1]], e.board), O = (s = new b.Z(x.Z.COORDS_BY_USER, [X[2], X[3]], e.board)).scrCoords[1] - o.scrCoords[1], S = s.scrCoords[2] - o.scrCoords[2], u = o.scrCoords[1] + O * n, Z = o.scrCoords[2] + S * l, v = o.scrCoords[1] + O * h, y = o.scrCoords[2] + S * p, this.context.createLinearGradient(u, Z, v, y);
  }, updateGradientCircle: function(e, t, o, s, n, h, l) {
    var p, u, v, Z, y, O, S, R, L, B, X = e.getBoundingBox();
    return p = new b.Z(x.Z.COORDS_BY_USER, [X[0], X[1]], e.board), L = (u = new b.Z(x.Z.COORDS_BY_USER, [X[2], X[3]], e.board)).scrCoords[1] - p.scrCoords[1], B = p.scrCoords[2] - u.scrCoords[2], v = p.scrCoords[1] + L * t, Z = u.scrCoords[2] + B * o, O = p.scrCoords[1] + L * n, S = u.scrCoords[2] + B * h, y = s * (L + B) * 0.5, R = l * (L + B) * 0.5, this.context.createRadialGradient(O, S, R, v, Z, y);
  }, updateGradient: function(e) {
    var t, o, s, n = a.Z.evaluate(e.visProp.gradient);
    return o = (o = a.Z.evaluate(e.visProp.fillopacity)) > 0 ? o : 0, t = a.Z.evaluate(e.visProp.fillcolor), n === "linear" ? s = this.updateGradientAngle(e, a.Z.evaluate(e.visProp.gradientangle)) : n === "radial" && (s = this.updateGradientCircle(e, a.Z.evaluate(e.visProp.gradientcx), a.Z.evaluate(e.visProp.gradientcy), a.Z.evaluate(e.visProp.gradientr), a.Z.evaluate(e.visProp.gradientfx), a.Z.evaluate(e.visProp.gradientfy), a.Z.evaluate(e.visProp.gradientfr))), s.addColorStop(a.Z.evaluate(e.visProp.gradientstartoffset), t), s.addColorStop(a.Z.evaluate(e.visProp.gradientendoffset), a.Z.evaluate(e.visProp.gradientsecondcolor)), s;
  }, _setColor: function(e, t, o) {
    var s, n, h, l, p, u, v, Z, y = !0, O = e.visProp;
    return t = t || "stroke", o = o || t, s = this._getHighlighted(e), (Z = a.Z.evaluate(e.visProp.gradient)) === "linear" || Z === "radial" ? (this.context[o + "Style"] = this.updateGradient(e), y) : ((h = a.Z.evaluate(O[s + t + "color"])) !== "none" && h !== !1 ? (u = (u = a.Z.evaluate(O[s + t + "opacity"])) > 0 ? u : 0, h.length !== 9 ? (p = h, v = u) : (p = (l = fe.Z.rgba2rgbo(h))[0], v = u * l[1]), this.context.globalAlpha = v, this.context[o + "Style"] = p) : y = !1, n = parseFloat(a.Z.evaluate(O[s + "strokewidth"])), t !== "stroke" || isNaN(n) || (n === 0 ? this.context.globalAlpha = 0 : this.context.lineWidth = n), t === "stroke" && O.linecap !== void 0 && O.linecap !== "" && (this.context.lineCap = O.linecap), y);
  }, _stroke: function(e) {
    var t = this.context, o = a.Z.evaluate(e.visProp.dash);
    t.save(), o > 0 ? t.setLineDash && t.setLineDash(this.dashArray[o]) : this.context.lineDashArray = [], this._setColor(e, "stroke") && t.stroke(), t.restore();
  }, _translateShape: function(e, t, o) {
    var s, n = [], h = e.length;
    if (h <= 0)
      return e;
    for (s = 0; s < h; s++)
      n.push([e[s][0] + t, e[s][1] + o]);
    return n;
  }, drawPoint: function(e) {
    var t = a.Z.evaluate(e.visProp.face), o = a.Z.evaluate(e.visProp.size), s = e.coords.scrCoords, n = o * Math.sqrt(3) * 0.5, h = 0.5 * o, l = parseFloat(a.Z.evaluate(e.visProp.strokewidth)) / 2, p = this.context;
    if (e.visPropCalc.visible)
      switch (t) {
        case "cross":
        case "x":
          p.beginPath(), p.moveTo(s[1] - o, s[2] - o), p.lineTo(s[1] + o, s[2] + o), p.moveTo(s[1] + o, s[2] - o), p.lineTo(s[1] - o, s[2] + o), p.lineCap = "round", p.lineJoin = "round", p.closePath(), this._stroke(e);
          break;
        case "circle":
        case "o":
          p.beginPath(), p.arc(s[1], s[2], o + 1 + l, 0, 2 * Math.PI, !1), p.closePath(), this._fill(e), this._stroke(e);
          break;
        case "square":
        case "[]":
          if (o <= 0)
            break;
          p.save(), this._setColor(e, "stroke", "fill") && p.fillRect(s[1] - o - l, s[2] - o - l, 2 * o + 3 * l, 2 * o + 3 * l), p.restore(), p.save(), this._setColor(e, "fill"), p.fillRect(s[1] - o + l, s[2] - o + l, 2 * o - l, 2 * o - l), p.restore();
          break;
        case "plus":
        case "+":
          p.beginPath(), p.moveTo(s[1] - o, s[2]), p.lineTo(s[1] + o, s[2]), p.moveTo(s[1], s[2] - o), p.lineTo(s[1], s[2] + o), p.lineCap = "round", p.lineJoin = "round", p.closePath(), this._stroke(e);
          break;
        case "divide":
        case "|":
          p.beginPath(), p.moveTo(s[1], s[2] - o), p.lineTo(s[1], s[2] + o), p.lineCap = "round", p.lineJoin = "round", p.closePath(), this._stroke(e);
          break;
        case "minus":
        case "-":
          p.beginPath(), p.moveTo(s[1] - o, s[2]), p.lineTo(s[1] + o, s[2]), p.lineCap = "round", p.lineJoin = "round", p.closePath(), this._stroke(e);
          break;
        case "diamond":
        case "<>":
          p.beginPath(), p.moveTo(s[1] - o, s[2]), p.lineTo(s[1], s[2] + o), p.lineTo(s[1] + o, s[2]), p.lineTo(s[1], s[2] - o), p.closePath(), this._fill(e), this._stroke(e);
          break;
        case "triangleup":
        case "a":
        case "^":
          p.beginPath(), p.moveTo(s[1], s[2] - o), p.lineTo(s[1] - n, s[2] + h), p.lineTo(s[1] + n, s[2] + h), p.closePath(), this._fill(e), this._stroke(e);
          break;
        case "triangledown":
        case "v":
          p.beginPath(), p.moveTo(s[1], s[2] + o), p.lineTo(s[1] - n, s[2] - h), p.lineTo(s[1] + n, s[2] - h), p.closePath(), this._fill(e), this._stroke(e);
          break;
        case "triangleleft":
        case "<":
          p.beginPath(), p.moveTo(s[1] - o, s[2]), p.lineTo(s[1] + h, s[2] - n), p.lineTo(s[1] + h, s[2] + n), p.closePath(), this._fill(e), this._stroke(e);
          break;
        case "triangleright":
        case ">":
          p.beginPath(), p.moveTo(s[1] + o, s[2]), p.lineTo(s[1] - h, s[2] - n), p.lineTo(s[1] - h, s[2] + n), p.closePath(), this._fill(e), this._stroke(e);
      }
  }, updatePoint: function(e) {
    this.drawPoint(e);
  }, drawArrows: function(e, t, o, s, n) {
    var h, l, p, u, v, Z, y, O, S, R, L, B, X, F, G, W, H, q, oe, ee, he = this.context, re = 1, _e = 1, ge = 1, we = n.evFirst, Ne = n.evLast;
    if (a.Z.evaluate(e.visProp.strokecolor) !== "none" && (we || Ne)) {
      if (e.elementClass === x.Z.OBJECT_CLASS_LINE)
        h = t.scrCoords[1], l = t.scrCoords[2], p = o.scrCoords[1], u = o.scrCoords[2], oe = ee = Math.atan2(u - l, p - h);
      else {
        if (h = e.points[0].scrCoords[1], l = e.points[0].scrCoords[2], (q = e.points.length - 1) < 1)
          return;
        p = e.points[e.points.length - 1].scrCoords[1], u = e.points[e.points.length - 1].scrCoords[2], F = e.points[1].scrCoords[1] - e.points[0].scrCoords[1], G = e.points[1].scrCoords[2] - e.points[0].scrCoords[2], W = e.points[q].scrCoords[1] - e.points[q - 1].scrCoords[1], H = e.points[q].scrCoords[2] - e.points[q - 1].scrCoords[2], we && (oe = Math.atan2(G, F)), Ne && (ee = Math.atan2(H, W));
      }
      if (v = a.Z.evaluate(e.visProp[s + "strokewidth"]), we)
        if (Z = v * n.sizeFirst, S = re = n.typeFirst, re === 2)
          O = [[Z, 0.5 * -Z], [0, 0], [Z, 0.5 * Z], [0.5 * Z, 0]];
        else if (re === 3)
          O = [[Z / 3, 0.5 * -Z], [0, 0.5 * -Z], [0, 0.5 * Z], [Z / 3, 0.5 * Z]];
        else if (re === 4)
          for (Z /= 10, _e = 3, X = (O = [[10, 3.31], [6.47, 3.84], [2.87, 4.5], [0, 6.63], [0.67, 5.52], [1.33, 4.42], [2, 3.31], [1.33, 2.21], [0.67, 1.1], [0, 0], [2.87, 2.13], [6.47, 2.79], [10, 3.31]]).length, B = 0; B < X; B++)
            O[B][0] *= -Z, O[B][1] *= Z, O[B][0] += 10 * Z, O[B][1] -= 3.31 * Z;
        else if (re === 5)
          for (Z /= 10, _e = 3, X = (O = [[10, 3.28], [6.61, 4.19], [3.19, 5.07], [0, 6.55], [0.62, 5.56], [1, 4.44], [1, 3.28], [1, 2.11], [0.62, 0.99], [0, 0], [3.19, 1.49], [6.61, 2.37], [10, 3.28]]).length, B = 0; B < X; B++)
            O[B][0] *= -Z, O[B][1] *= Z, O[B][0] += 10 * Z, O[B][1] -= 3.28 * Z;
        else if (re === 6)
          for (Z /= 10, _e = 3, X = (O = [[10, 2.84], [6.61, 3.59], [3.21, 4.35], [0, 5.68], [0.33, 4.73], [0.67, 3.78], [1, 2.84], [0.67, 1.89], [0.33, 0.95], [0, 0], [3.21, 1.33], [6.61, 2.09], [10, 2.84]]).length, B = 0; B < X; B++)
            O[B][0] *= -Z, O[B][1] *= Z, O[B][0] += 10 * Z, O[B][1] -= 2.84 * Z;
        else if (re === 7)
          for (Z = v, _e = 3, X = (O = [[0, 10.39], [2.01, 6.92], [5.96, 5.2], [10, 5.2], [5.96, 5.2], [2.01, 3.47], [0, 0]]).length, B = 0; B < X; B++)
            O[B][0] *= -Z, O[B][1] *= Z, O[B][0] += 10 * Z, O[B][1] -= 5.2 * Z;
        else
          O = [[Z, 0.5 * -Z], [0, 0], [Z, 0.5 * Z]];
      if (Ne)
        if (Z = v * n.sizeLast, R = re = n.typeLast, re === 2)
          y = [[-Z, 0.5 * -Z], [0, 0], [-Z, 0.5 * Z], [0.5 * -Z, 0]];
        else if (re === 3)
          y = [[-Z / 3, 0.5 * -Z], [0, 0.5 * -Z], [0, 0.5 * Z], [-Z / 3, 0.5 * Z]];
        else if (re === 4)
          for (Z /= 10, ge = 3, X = (y = [[10, 3.31], [6.47, 3.84], [2.87, 4.5], [0, 6.63], [0.67, 5.52], [1.33, 4.42], [2, 3.31], [1.33, 2.21], [0.67, 1.1], [0, 0], [2.87, 2.13], [6.47, 2.79], [10, 3.31]]).length, B = 0; B < X; B++)
            y[B][0] *= Z, y[B][1] *= Z, y[B][0] -= 10 * Z, y[B][1] -= 3.31 * Z;
        else if (re === 5)
          for (Z /= 10, ge = 3, X = (y = [[10, 3.28], [6.61, 4.19], [3.19, 5.07], [0, 6.55], [0.62, 5.56], [1, 4.44], [1, 3.28], [1, 2.11], [0.62, 0.99], [0, 0], [3.19, 1.49], [6.61, 2.37], [10, 3.28]]).length, B = 0; B < X; B++)
            y[B][0] *= Z, y[B][1] *= Z, y[B][0] -= 10 * Z, y[B][1] -= 3.28 * Z;
        else if (re === 6)
          for (Z /= 10, ge = 3, X = (y = [[10, 2.84], [6.61, 3.59], [3.21, 4.35], [0, 5.68], [0.33, 4.73], [0.67, 3.78], [1, 2.84], [0.67, 1.89], [0.33, 0.95], [0, 0], [3.21, 1.33], [6.61, 2.09], [10, 2.84]]).length, B = 0; B < X; B++)
            y[B][0] *= Z, y[B][1] *= Z, y[B][0] -= 10 * Z, y[B][1] -= 2.84 * Z;
        else if (re === 7)
          for (Z = v, ge = 3, X = (y = [[0, 10.39], [2.01, 6.92], [5.96, 5.2], [10, 5.2], [5.96, 5.2], [2.01, 3.47], [0, 0]]).length, B = 0; B < X; B++)
            y[B][0] *= Z, y[B][1] *= Z, y[B][0] -= 10 * Z, y[B][1] -= 5.2 * Z;
        else
          y = [[-Z, 0.5 * -Z], [0, 0], [-Z, 0.5 * Z]];
      he.save(), this._setColor(e, "stroke", "fill") && (this._setColor(e, "stroke"), we && (L = S !== 7, this._drawPolygon(this._translateShape(this._rotateShape(O, oe), h, l), _e, L)), Ne && (L = R !== 7, this._drawPolygon(this._translateShape(this._rotateShape(y, ee), p, u), ge, L))), he.restore();
    }
  }, drawLine: function(e) {
    var t, o, s, n, h, l = new b.Z(x.Z.COORDS_BY_USER, e.point1.coords.usrCoords, e.board), p = new b.Z(x.Z.COORDS_BY_USER, e.point2.coords.usrCoords, e.board), u = null;
    e.visPropCalc.visible && (s = this._getHighlighted(e), n = a.Z.evaluate(e.visProp[s + "strokewidth"]), ((h = this.getArrowHeadData(e, n, s)).evFirst || h.evLast) && (u = -4), _.Z.calcStraight(e, l, p, u), this.handleTouchpoints(e, l, p, h), t = new b.Z(x.Z.COORDS_BY_USER, l.usrCoords, e.board), o = new b.Z(x.Z.COORDS_BY_USER, p.usrCoords, e.board), this.getPositionArrowHead(e, l, p, h), this.context.beginPath(), this.context.moveTo(l.scrCoords[1], l.scrCoords[2]), this.context.lineTo(p.scrCoords[1], p.scrCoords[2]), this._stroke(e), (h.evFirst || h.evLast) && this.drawArrows(e, t, o, s, h));
  }, updateLine: function(e) {
    this.drawLine(e);
  }, drawTicks: function() {
  }, updateTicks: function(e) {
    var t, o, s, n, h, l, p = e.ticks.length, u = this.context;
    for (u.beginPath(), t = 0; t < p; t++)
      for (s = (o = e.ticks[t])[0], n = o[1], h = s.length, u.moveTo(s[0], n[0]), l = 1; l < h; ++l)
        u.lineTo(s[l], n[l]);
    u.lineCap = "round", this._stroke(e);
  }, drawCurve: function(e) {
    var t, o, s;
    a.Z.evaluate(e.visProp.handdrawing) ? this.updatePathStringBezierPrim(e) : this.updatePathStringPrim(e), e.numberPoints > 1 && (t = this._getHighlighted(e), o = a.Z.evaluate(e.visProp[t + "strokewidth"]), ((s = this.getArrowHeadData(e, o, t)).evFirst || s.evLast) && this.drawArrows(e, null, null, t, s));
  }, updateCurve: function(e) {
    this.drawCurve(e);
  }, drawEllipse: function(e) {
    var t = e.center.coords.scrCoords[1], o = e.center.coords.scrCoords[2], s = e.board.unitX, n = e.board.unitY, h = 2 * e.Radius(), l = 2 * e.Radius(), p = h * s, u = l * n, v = t - p / 2, Z = o - u / 2, y = p / 2 * 0.5522848, O = u / 2 * 0.5522848, S = v + p, R = Z + u, L = v + p / 2, B = Z + u / 2, X = this.context;
    h > 0 && l > 0 && !isNaN(t + o) && (X.beginPath(), X.moveTo(v, B), X.bezierCurveTo(v, B - O, L - y, Z, L, Z), X.bezierCurveTo(L + y, Z, S, B - O, S, B), X.bezierCurveTo(S, B + O, L + y, R, L, R), X.bezierCurveTo(L - y, R, v, B + O, v, B), X.closePath(), this._fill(e), this._stroke(e));
  }, updateEllipse: function(e) {
    return this.drawEllipse(e);
  }, displayCopyright: function(e, t) {
    var o = this.context;
    o.save(), o.font = t + "px Arial", o.fillStyle = "#aaa", o.lineWidth = 0.5, o.fillText(e, 10, 2 + t), o.restore();
  }, drawInternalText: function(e) {
    var t = a.Z.evaluate(e.visProp.fontsize), o = a.Z.evaluate(e.visProp.fontunit), s = e.getAnchorX(), n = e.getAnchorY(), h = this.context;
    return h.save(), this._setColor(e, "stroke", "fill") && !isNaN(e.coords.scrCoords[1] + e.coords.scrCoords[2]) && (h.font = (t > 0 ? t : 0) + o + " Arial", this.transformImage(e, e.transformations), s === "left" ? h.textAlign = "left" : s === "right" ? h.textAlign = "right" : s === "middle" && (h.textAlign = "center"), n === "bottom" ? h.textBaseline = "bottom" : n === "top" ? h.textBaseline = "top" : n === "middle" && (h.textBaseline = "middle"), h.fillText(e.plaintext, e.coords.scrCoords[1], e.coords.scrCoords[2])), h.restore(), null;
  }, updateInternalText: function(e) {
    this.drawInternalText(e);
  }, setObjectStrokeColor: function(e, t, o) {
    var s, n, h, l, p = a.Z.evaluate(t), u = a.Z.evaluate(o);
    u = u > 0 ? u : 0, e.visPropOld.strokecolor === p && e.visPropOld.strokeopacity === u || (a.Z.exists(p) && p !== !1 && (p.length !== 9 ? (s = p, h = u) : (s = (n = fe.Z.rgba2rgbo(p))[0], h = u * n[1]), l = e.rendNode, e.elementClass === x.Z.OBJECT_CLASS_TEXT && a.Z.evaluate(e.visProp.display) === "html" && (l.style.color = s, l.style.opacity = h)), e.visPropOld.strokecolor = p, e.visPropOld.strokeopacity = u);
  }, drawImage: function(e) {
    e.rendNode = new Image(), e._src = "", this.updateImage(e);
  }, updateImage: function(e) {
    var t = this.context, o = a.Z.evaluate(e.visProp.fillopacity), s = a.Z.bind(function() {
      e.imgIsLoaded = !0, e.size[0] <= 0 || e.size[1] <= 0 || (t.save(), t.globalAlpha = o, this.transformImage(e, e.transformations), t.drawImage(e.rendNode, e.coords.scrCoords[1], e.coords.scrCoords[2] - e.size[1], e.size[0], e.size[1]), t.restore());
    }, this);
    this.updateImageURL(e) ? e.rendNode.onload = s : e.imgIsLoaded && s();
  }, transformImage: function(e, t) {
    var o, s = t.length, n = this.context;
    s > 0 && (o = this.joinTransforms(e, t), Math.abs(c.Z.det(o)) >= k.Z.eps && n.transform(o[1][1], o[2][1], o[1][2], o[2][2], o[1][0], o[2][0]));
  }, updateImageURL: function(e) {
    var t;
    return t = a.Z.evaluate(e.url), e._src !== t && (e.imgIsLoaded = !1, e.rendNode.src = t, e._src = t, !0);
  }, remove: function(e) {
    a.Z.exists(e) && a.Z.exists(e.parentNode) && e.parentNode.removeChild(e);
  }, updatePathStringPrim: function(e) {
    var t, o, s, n, h, l = "M", p = l, u = 5e3, v = this.context;
    if (!(e.numberPoints <= 0)) {
      if (h = Math.min(e.points.length, e.numberPoints), v.beginPath(), e.bezierDegree === 1)
        for (t = 0; t < h; t++)
          o = e.points[t].scrCoords, isNaN(o[1]) || isNaN(o[2]) ? p = l : (o[1] > u ? o[1] = u : o[1] < -5e3 && (o[1] = -5e3), o[2] > u ? o[2] = u : o[2] < -5e3 && (o[2] = -5e3), p === l ? v.moveTo(o[1], o[2]) : v.lineTo(o[1], o[2]), p = "L");
      else if (e.bezierDegree === 3)
        for (t = 0; t < h; )
          o = e.points[t].scrCoords, isNaN(o[1]) || isNaN(o[2]) ? p = l : (p === l ? v.moveTo(o[1], o[2]) : (t += 1, s = e.points[t].scrCoords, t += 1, n = e.points[t].scrCoords, v.bezierCurveTo(o[1], o[2], s[1], s[2], n[1], n[2])), p = "C"), t += 1;
      v.lineCap = "round", this._fill(e), this._stroke(e);
    }
  }, updatePathStringBezierPrim: function(e) {
    var t, o, s, n, h, l, p, u = "M", v = u, Z = 5e3, y = a.Z.evaluate(e.visProp.strokewidth), O = a.Z.evaluate(e.visProp.curvetype) !== "plot", S = this.context;
    if (!(e.numberPoints <= 0)) {
      for (O && e.board.options.curve.RDPsmoothing && (e.points = c.Z.RamerDouglasPeucker(e.points, 0.5)), p = Math.min(e.points.length, e.numberPoints), S.beginPath(), o = 1; o < 3; o++)
        for (v = u, t = 0; t < p; t++)
          n = e.points[t].scrCoords, isNaN(n[1]) || isNaN(n[2]) ? v = u : (n[1] > Z ? n[1] = Z : n[1] < -5e3 && (n[1] = -5e3), n[2] > Z ? n[2] = Z : n[2] < -5e3 && (n[2] = -5e3), v === u ? S.moveTo(n[1], n[2]) : (s = 2 * o, S.bezierCurveTo(h + 0.333 * (n[1] - h) + y * (s * Math.random() - o), l + 0.333 * (n[2] - l) + y * (s * Math.random() - o), h + 0.666 * (n[1] - h) + y * (s * Math.random() - o), l + 0.666 * (n[2] - l) + y * (s * Math.random() - o), n[1], n[2])), v = "C", h = n[1], l = n[2]);
      S.lineCap = "round", this._fill(e), this._stroke(e);
    }
  }, updatePolygonPrim: function(e, t) {
    var o, s, n, h = t.vertices.length, l = this.context, p = !0;
    if (!(h <= 0) && t.visPropCalc.visible) {
      for (t.elType === "polygonalchain" && h++, l.beginPath(), s = 0; !t.vertices[s].isReal && s < h - 1; )
        s++, p = !1;
      for (o = t.vertices[s].coords.scrCoords, l.moveTo(o[1], o[2]), n = s; n < h - 1; n++)
        t.vertices[n].isReal || (p = !1), o = t.vertices[n].coords.scrCoords, l.lineTo(o[1], o[2]);
      l.closePath(), p && this._fill(t);
    }
  }, display: function(e, t) {
    e && e.rendNode && (e.visPropOld.visible = t, e.rendNode.style.visibility = t ? "inherit" : "hidden");
  }, show: function(e) {
    d.Z.deprecated("Board.renderer.show()", "Board.renderer.display()"), a.Z.exists(e.rendNode) && (e.rendNode.style.visibility = "inherit");
  }, hide: function(e) {
    d.Z.deprecated("Board.renderer.hide()", "Board.renderer.display()"), a.Z.exists(e.rendNode) && (e.rendNode.style.visibility = "hidden");
  }, setGradient: function(e) {
    var t;
    t = (t = a.Z.evaluate(e.visProp.fillopacity)) > 0 ? t : 0;
  }, setShadow: function(e) {
    e.visPropOld.shadow !== e.visProp.shadow && (e.visPropOld.shadow = e.visProp.shadow);
  }, highlight: function(e) {
    return e.elementClass === x.Z.OBJECT_CLASS_TEXT && a.Z.evaluate(e.visProp.display) === "html" ? this.updateTextStyle(e, !0) : (e.board.prepareUpdate(), e.board.renderer.suspendRedraw(e.board), e.board.updateRenderer(), e.board.renderer.unsuspendRedraw()), this;
  }, noHighlight: function(e) {
    return e.elementClass === x.Z.OBJECT_CLASS_TEXT && a.Z.evaluate(e.visProp.display) === "html" ? this.updateTextStyle(e, !1) : (e.board.prepareUpdate(), e.board.renderer.suspendRedraw(e.board), e.board.updateRenderer(), e.board.renderer.unsuspendRedraw()), this;
  }, suspendRedraw: function(e) {
    this.context.save(), this.context.clearRect(0, 0, this.canvasRoot.width, this.canvasRoot.height), e && e.attr.showcopyright && this.displayCopyright(d.Z.licenseText, 12);
  }, unsuspendRedraw: function() {
    this.context.restore();
  }, resize: function(e, t) {
    this.container ? (this.canvasRoot.style.width = parseFloat(e) + "px", this.canvasRoot.style.height = parseFloat(t) + "px", this.canvasRoot.setAttribute("width", 2 * parseFloat(e) + "px"), this.canvasRoot.setAttribute("height", 2 * parseFloat(t) + "px")) : (this.canvasRoot.width = 2 * parseFloat(e), this.canvasRoot.height = 2 * parseFloat(t)), this.context = this.canvasRoot.getContext("2d"), this.context.scale(2, 2);
  }, removeToInsertLater: function() {
    return function() {
    };
  } });
  const ht = d.Z.CanvasRenderer;
  d.Z.NoRenderer = function() {
    this.enhancedRendering = !1, this.type = "no";
  }, d.Z.extend(d.Z.NoRenderer.prototype, { drawPoint: function(e) {
  }, updatePoint: function(e) {
  }, changePointStyle: function(e) {
  }, drawLine: function(e) {
  }, updateLine: function(e) {
  }, drawTicks: function(e) {
  }, updateTicks: function(e) {
  }, drawCurve: function(e) {
  }, updateCurve: function(e) {
  }, drawEllipse: function(e) {
  }, updateEllipse: function(e) {
  }, drawPolygon: function(e) {
  }, updatePolygon: function(e) {
  }, displayCopyright: function(e, t) {
  }, drawInternalText: function(e) {
  }, updateInternalText: function(e) {
  }, drawText: function(e) {
  }, updateText: function(e) {
  }, updateTextStyle: function(e, t) {
  }, updateInternalTextStyle: function(e, t, o) {
  }, drawImage: function(e) {
  }, updateImage: function(e) {
  }, transformImage: function(e, t) {
  }, updateImageURL: function(e) {
  }, appendChildPrim: function(e, t) {
  }, appendNodesToElement: function(e, t) {
  }, createPrim: function(e, t) {
    return null;
  }, remove: function(e) {
  }, makeArrows: function(e) {
  }, updateEllipsePrim: function(e, t, o, s, n) {
  }, updateLinePrim: function(e, t, o, s, n, h) {
  }, updatePathPrim: function(e, t, o) {
  }, updatePathStringPoint: function(e, t, o) {
  }, updatePathStringPrim: function(e) {
  }, updatePathStringBezierPrim: function(e) {
  }, updatePolygonPrim: function(e, t) {
  }, updateRectPrim: function(e, t, o, s, n) {
  }, setPropertyPrim: function(e, t, o) {
  }, display: function(e, t) {
    e && (e.visPropOld.visible = t);
  }, show: function(e) {
  }, hide: function(e) {
  }, setBuffering: function(e, t) {
  }, setDashStyle: function(e) {
  }, setDraft: function(e) {
  }, removeDraft: function(e) {
  }, setGradient: function(e) {
  }, updateGradient: function(e) {
  }, setObjectTransition: function(e, t) {
  }, setObjectFillColor: function(e, t, o) {
  }, setObjectStrokeColor: function(e, t, o) {
  }, setObjectStrokeWidth: function(e, t) {
  }, setShadow: function(e) {
  }, highlight: function(e) {
  }, noHighlight: function(e) {
  }, suspendRedraw: function() {
  }, unsuspendRedraw: function() {
  }, drawZoomBar: function(e) {
  }, getElementById: function(e) {
    return null;
  }, resize: function(e, t) {
  }, removeToInsertLater: function() {
    return function() {
    };
  } }), d.Z.NoRenderer.prototype = new se();
  const at = d.Z.NoRenderer;
  d.Z.JSXGraph = { rendererType: (te.Z.board.renderer = "no", M.Z.supportsVML() && (te.Z.board.renderer = "vml", document.onmousemove = function() {
    var e;
    return document.body && (e = document.body.scrollLeft, e += document.body.scrollTop), e;
  }), M.Z.supportsCanvas() && (te.Z.board.renderer = "canvas"), M.Z.supportsSVG() && (te.Z.board.renderer = "svg"), M.Z.isNode() && M.Z.supportsCanvas() && (te.Z.board.renderer = "canvas"), (M.Z.isNode() || te.Z.renderer === "no") && (te.Z.text.display = "internal", te.Z.infobox.display = "internal"), te.Z.board.renderer), initRenderer: function(e, t, o, s) {
    var n;
    if (a.Z.exists(o) && o !== !1 || typeof document != "object" || (o = document), typeof o == "object" && e !== null)
      for (n = o.getElementById(e); n.firstChild; )
        n.removeChild(n.firstChild);
    else
      n = e;
    return s !== void 0 && s !== "auto" || (s = this.rendererType), s === "svg" ? new je(n, t) : s === "vml" ? new qe(n) : s === "canvas" ? new ht(n, t) : new at();
  }, _setAttributes: function(e) {
    var t = a.Z.copyAttributes(e, te.Z, "board");
    return t.zoom = a.Z.copyAttributes(t, te.Z, "board", "zoom"), t.pan = a.Z.copyAttributes(t, te.Z, "board", "pan"), t.drag = a.Z.copyAttributes(t, te.Z, "board", "drag"), t.keyboard = a.Z.copyAttributes(t, te.Z, "board", "keyboard"), t.selection = a.Z.copyAttributes(t, te.Z, "board", "selection"), t.navbar = a.Z.copyAttributes(t.navbar, te.Z, "navbar"), t.screenshot = a.Z.copyAttributes(t, te.Z, "board", "screenshot"), t.resize = a.Z.copyAttributes(t, te.Z, "board", "resize"), t.fullscreen = a.Z.copyAttributes(t, te.Z, "board", "fullscreen"), t.logging = a.Z.copyAttributes(t, te.Z, "board", "logging"), t.movetarget = e.moveTarget || e.movetarget || te.Z.board.moveTarget, t;
  }, _fillBoard: function(e, t, o) {
    e.initInfobox(), e.maxboundingbox = t.maxboundingbox, e.resizeContainer(o.width, o.height, !0, !0), e._createSelectionPolygon(t), e.renderer.drawZoomBar(e, t.navbar), d.Z.boards[e.id] = e;
  }, _setARIA: function(e, t) {
    var o, s, n, h, l, p, u = t.document;
    if (typeof u != "object") {
      if (!M.Z.isBrowser)
        return;
      u = document;
    }
    o = (s = u.getElementById(e)).ownerDocument, h = s.parentNode, l = e + "_ARIAlabel", p = e + "_ARIAdescription", (n = o.createElement("div")).innerHTML = t.title, n.setAttribute("id", l), n.style.display = "none", h.insertBefore(n, s), (n = o.createElement("div")).innerHTML = t.description, n.setAttribute("id", p), n.style.display = "none", h.insertBefore(n, s), s.setAttribute("aria-labelledby", l), s.setAttribute("aria-describedby", p);
  }, _removeARIANodes: function(e) {
    var t, o, s;
    typeof (s = e.document || document) == "object" && (o = e.containerObj.getAttribute("aria-labelledby"), (t = s.getElementById(o)) && t.parentNode && t.parentNode.removeChild(t), o = e.containerObj.getAttribute("aria-describedby"), (t = s.getElementById(o)) && t.parentNode && t.parentNode.removeChild(t));
  }, initBoard: function(e, t) {
    var o, s, n, h, l, p, u, v, Z, y, O, S, R, L, B = 0, X = 0;
    return t = t || {}, y = this._setAttributes(t), v = M.Z.getDimensions(e, y.document), y.unitx || y.unity ? (o = a.Z.def(y.originx, 150), s = a.Z.def(y.originy, 150), n = a.Z.def(y.unitx, 50), h = a.Z.def(y.unity, 50)) : ((Z = y.boundingbox)[0] < y.maxboundingbox[0] && (Z[0] = y.maxboundingbox[0]), Z[1] > y.maxboundingbox[1] && (Z[1] = y.maxboundingbox[1]), Z[2] > y.maxboundingbox[2] && (Z[2] = y.maxboundingbox[2]), Z[3] < y.maxboundingbox[3] && (Z[3] = y.maxboundingbox[3]), p = parseInt(v.width, 10), u = parseInt(v.height, 10), a.Z.exists(Z) && y.keepaspectratio ? (n = p / (Z[2] - Z[0]), h = u / (Z[1] - Z[3]), Math.abs(n) < Math.abs(h) ? X = 0.5 * (u / (h = Math.abs(n) * h / Math.abs(h)) - (Z[1] - Z[3])) : B = 0.5 * (p / (n = Math.abs(h) * n / Math.abs(n)) - (Z[2] - Z[0]))) : (n = p / (Z[2] - Z[0]), h = u / (Z[1] - Z[3])), o = -n * (Z[0] - B), s = h * (Z[1] + X)), l = this.initRenderer(e, v, y.document, y.renderer), this._setARIA(e, y), (L = new ke(e, l, y.id, [o, s], y.zoomfactor * y.zoomx, y.zoomfactor * y.zoomy, n, h, v.width, v.height, y)).keepaspectratio = y.keepaspectratio, this._fillBoard(L, y, v), L.suspendUpdate(), y.axis && (O = typeof y.axis == "object" ? y.axis : {}, S = a.Z.deepCopy(te.Z.board.defaultAxes.x, O), R = a.Z.deepCopy(te.Z.board.defaultAxes.y, O), y.defaultaxes.x && (S = a.Z.deepCopy(S, y.defaultaxes.x)), y.defaultaxes.y && (R = a.Z.deepCopy(R, y.defaultaxes.y)), L.defaultAxes = {}, L.defaultAxes.x = L.create("axis", [[0, 0], [1, 0]], S), L.defaultAxes.y = L.create("axis", [[0, 0], [0, 1]], R)), y.grid && L.create("grid", [], typeof y.grid == "object" ? y.grid : {}), L.unsuspendUpdate(), L;
  }, loadBoardFromFile: function(e, t, o, s, n) {
    var h, l, p, u, v;
    return s = s || {}, h = this._setAttributes(s), u = M.Z.getDimensions(e, h.document), l = this.initRenderer(e, u, h.document, h.renderer), this._setARIA(e, h), p = new ke(e, l, "", [150, 150], 1, 1, 50, 50, u.width, u.height, h), this._fillBoard(p, h, u), v = h.encoding || "iso-8859-1", de.parseFileContent(t, p, o, !0, v, n), p;
  }, loadBoardFromString: function(e, t, o, s, n) {
    var h, l, p, u;
    return s = s || {}, h = this._setAttributes(s), u = M.Z.getDimensions(e, h.document), l = this.initRenderer(e, u, h.document, h.renderer), this._setARIA(e, h), p = new ke(e, l, "", [150, 150], 1, 1, 50, 50, u.width, u.height, h), this._fillBoard(p, h, u), de.parseString(t, p, o, !0, n), p;
  }, freeBoard: function(e) {
    var t;
    for (t in typeof e == "string" && (e = d.Z.boards[e]), this._removeARIANodes(e), e.removeEventHandlers(), e.suspendUpdate(), e.objects)
      e.objects.hasOwnProperty(t) && e.objects[t].remove();
    for (; e.containerObj.firstChild; )
      e.containerObj.removeChild(e.containerObj.firstChild);
    for (t in e.objects)
      e.objects.hasOwnProperty(t) && delete e.objects[t];
    delete e.renderer, e.jc.creator.clearCache(), delete e.jc, delete d.Z.boards[e.id];
  }, registerElement: function(e, t) {
    d.Z.deprecated("JXG.JSXGraph.registerElement()", "JXG.registerElement()"), d.Z.registerElement(e, t);
  } }, M.Z.isBrowser && typeof window == "object" && typeof document == "object" && M.Z.addEvent(window, "load", function() {
    var e, t, o, s, n, h, l, p, u, v, Z, y, O, S, R, L, B, X, F = !1, G = document.getElementsByTagName("script"), W = function(q, oe, ee) {
      var he = d.Z.JSXGraph.initBoard(n, { boundingbox: ee, keepaspectratio: !0, grid: R, axis: S, showReload: !0 });
      if (oe.toLowerCase().indexOf("script") > -1)
        he.construct(q);
      else
        try {
          he.jc.parse(q);
        } catch (re) {
          d.Z.debug(re);
        }
      return he;
    }, H = function(q, oe, ee, he) {
      return function() {
        var re;
        d.Z.JSXGraph.freeBoard(q), (re = W(oe, ee, he)).reload = H(re, oe, ee, he);
      };
    };
    for (t = 0; t < G.length; t++)
      if (e = G[t].getAttribute("type", !1), a.Z.exists(e) && (e.toLowerCase() === "text/jessiescript" || e.toLowerCase() === "jessiescript" || e.toLowerCase() === "text/jessiecode" || e.toLowerCase() === "jessiecode")) {
        if (y = G[t].getAttribute("class", !1) || "", p = G[t].getAttribute("width", !1) || "", u = G[t].getAttribute("height", !1) || "", v = G[t].getAttribute("maxwidth", !1) || "100%", Z = G[t].getAttribute("aspectratio", !1) || "1/1", O = G[t].getAttribute("boundingbox", !1) || "-5, 5, 5, -5", n = G[t].getAttribute("container", !1), B = G[t].getAttribute("src", !1), (O = O.split(",")).length !== 4)
          O = [-5, 5, 5, -5];
        else
          for (o = 0; o < O.length; o++)
            O[o] = parseFloat(O[o]);
        if (S = a.Z.str2Bool(G[t].getAttribute("axis", !1) || "false"), R = a.Z.str2Bool(G[t].getAttribute("grid", !1) || "false"), a.Z.exists(n))
          s = document.getElementById(n);
        else {
          n = "jessiescript_autgen_jxg_" + t, (s = document.createElement("div")).setAttribute("id", n), l = p !== "" ? "width:" + p + ";" : "", l += u !== "" ? "height:" + u + ";" : "", l += v !== "" ? "max-width:" + v + ";" : "", l += Z !== "" ? "aspect-ratio:" + Z + ";" : "", s.setAttribute("style", l), s.setAttribute("class", "jxgbox " + y);
          try {
            document.body.insertBefore(s, G[t]);
          } catch {
            typeof jQuery == "object" && jQuery(s).insertBefore(G[t]);
          }
        }
        L = "", a.Z.exists(B) ? (F = !0, (X = new XMLHttpRequest()).open("GET", B), X.overrideMimeType("text/plain; charset=x-user-defined"), X.addEventListener("load", function() {
          if (!(this.status < 400))
            throw new Error(`
JSXGraph: failed to load file`, B, ":", this.responseText);
          L = this.responseText + `
` + L, (h = W(L, e, O)).reload = H(h, L, e, O);
        }), X.addEventListener("error", function(q) {
          throw new Error(`
JSXGraph: failed to load file`, B, ":", q);
        }), X.send()) : F = !1, document.getElementById(n) ? (L = (L = G[t].innerHTML).replace(/<!\[CDATA\[/g, "").replace(/\]\]>/g, ""), G[t].innerHTML = L, F || ((h = W(L, e, O)).reload = H(h, L, e, O))) : d.Z.debug("JSXGraph: Apparently the div injection failed. Can't create a board, sorry.");
      }
  }, window), d.Z.JSXGraph;
  var Je = __webpack_require__(958), rt = __webpack_require__(218);
  d.Z.Point = function(e, t, o) {
    this.constructor(e, o, x.Z.OBJECT_TYPE_POINT, x.Z.OBJECT_CLASS_POINT), this.element = this.board.select(o.anchor), this.coordsConstructor(t), this.elType = "point", this.id = this.board.setId(this, "P"), this.board.renderer.drawPoint(this), this.board.finalizeAdding(this), this.createGradient(), this.createLabel();
  }, d.Z.Point.prototype = new Je.Z(), a.Z.copyPrototypeMethods(d.Z.Point, rt.Z, "coordsConstructor"), d.Z.extend(d.Z.Point.prototype, { hasPoint: function(e, t) {
    var o, s, n, h = this.coords.scrCoords, l = a.Z.evaluate(this.visProp.sizeunit);
    return a.Z.isObject(a.Z.evaluate(this.visProp.precision)) ? (n = this.board._inputDevice, s = a.Z.evaluate(this.visProp.precision[n])) : s = this.board.options.precision.hasPoint, o = parseFloat(a.Z.evaluate(this.visProp.size)), l === "user" && (o *= Math.sqrt(this.board.unitX * this.board.unitY)), (o += 0.5 * parseFloat(a.Z.evaluate(this.visProp.strokewidth))) < s && (o = s), Math.abs(h[1] - e) < o + 2 && Math.abs(h[2] - t) < o + 2;
  }, update: function(e) {
    return this.needsUpdate ? (this.updateCoords(e), a.Z.evaluate(this.visProp.trace) && this.cloneToBackground(!0), this) : this;
  }, updateTransform: function(e) {
    var t, o;
    if (this.transformations.length === 0 || this.baseElement === null)
      return this;
    for (this === this.baseElement ? (t = this.transformations[0].apply(this.baseElement, "self"), this.coords.setCoordinates(x.Z.COORDS_BY_USER, t)) : t = this.transformations[0].apply(this.baseElement), this.coords.setCoordinates(x.Z.COORDS_BY_USER, t), o = 1; o < this.transformations.length; o++)
      this.coords.setCoordinates(x.Z.COORDS_BY_USER, this.transformations[o].apply(this));
    return this;
  }, updateRenderer: function() {
    return this.updateRendererGeneric("updatePoint"), this;
  }, bounds: function() {
    return this.coords.usrCoords.slice(1).concat(this.coords.usrCoords.slice(1));
  }, makeIntersection: function(e, t, o, s) {
    var n;
    e = this.board.select(e), t = this.board.select(t), n = _.Z.intersectionFunction(this.board, e, t, o, s, this.visProp.alwaysintersect), this.addConstraint([n]);
    try {
      e.addChild(this), t.addChild(this);
    } catch {
      throw new Error("JSXGraph: Can't create 'intersection' with parent types '" + typeof e + "' and '" + typeof t + "'.");
    }
    this.type = x.Z.OBJECT_TYPE_INTERSECTION, this.elType = "intersection", this.parents = [e.id, t.id, o, s], this.generatePolynomial = function() {
      var h = e.generatePolynomial(this), l = t.generatePolynomial(this);
      return h.length === 0 || l.length === 0 ? [] : [h[0], l[0]];
    }, this.prepareUpdate().update();
  }, setStyle: function(e) {
    return this.visProp.face = ["cross", "cross", "cross", "circle", "circle", "circle", "circle", "square", "square", "square", "plus", "plus", "plus"][e], this.visProp.size = [2, 3, 4, 1, 2, 3, 4, 2, 3, 4, 2, 3, 4][e], this.board.renderer.changePointStyle(this), this;
  }, normalizeFace: function(e) {
    return d.Z.deprecated("Point.normalizeFace()", "JXG.normalizePointFace()"), te.Z.normalizePointFace(e);
  }, face: function(e) {
    d.Z.deprecated("Point.face()", "Point.setAttribute()"), this.setAttribute({ face: e });
  }, size: function(e) {
    d.Z.deprecated("Point.size()", "Point.setAttribute()"), this.setAttribute({ size: e });
  }, isOn: function(e, t) {
    var o, s;
    return t = t || k.Z.eps, a.Z.isPoint(e) ? this.Dist(e) < t : e.elementClass === x.Z.OBJECT_CLASS_LINE ? (e.elType !== "segment" || a.Z.evaluate(this.visProp.alwaysintersect) || (o = d.Z.Math.Geometry.projectCoordsToSegment(this.coords.usrCoords, e.point1.coords.usrCoords, e.point2.coords.usrCoords))[1] >= 0 && o[1] <= 1) && _.Z.distPointLine(this.coords.usrCoords, e.stdform) < t : e.elementClass === x.Z.OBJECT_CLASS_CIRCLE ? a.Z.evaluate(e.visProp.hasinnerpoints) ? this.Dist(e.center) < e.Radius() + t : Math.abs(this.Dist(e.center) - e.Radius()) < t : e.elementClass === x.Z.OBJECT_CLASS_CURVE ? (s = _.Z.projectPointToCurve(this, e, this.board)[0], _.Z.distance(this.coords.usrCoords, s.usrCoords, 3) < t) : e.type === x.Z.OBJECT_TYPE_POLYGON ? !(!a.Z.evaluate(e.visProp.hasinnerpoints) || !e.pnpoly(this.coords.usrCoords[1], this.coords.usrCoords[2], d.Z.COORDS_BY_USER)) || (o = _.Z.projectCoordsToPolygon(this.coords.usrCoords, e), _.Z.distance(this.coords.usrCoords, o, 3) < t) : e.type === x.Z.OBJECT_TYPE_TURTLE && (s = _.Z.projectPointToTurtle(this, e, this.board), _.Z.distance(this.coords.usrCoords, s.usrCoords, 3) < t);
  }, cloneToBackground: function() {
    var e = {};
    return e.id = this.id + "T" + this.numTraces, this.numTraces += 1, e.coords = this.coords, e.visProp = a.Z.deepCopy(this.visProp, this.visProp.traceattributes, !0), e.visProp.layer = this.board.options.layer.trace, e.elementClass = x.Z.OBJECT_CLASS_POINT, e.board = this.board, a.Z.clearVisPropOld(e), e.visPropCalc = { visible: a.Z.evaluate(e.visProp.visible) }, this.board.renderer.drawPoint(e), this.traces[e.id] = e.rendNode, this;
  } }), d.Z.createPoint = function(e, t, o) {
    var s, n;
    if (n = a.Z.copyAttributes(o, e.options, "point"), !(s = rt.Z.create(d.Z.Point, e, t, n)))
      throw new Error("JSXGraph: Can't create point with parent types '" + typeof t[0] + "' and '" + typeof t[1] + `'.
Possible parent types: [x,y], [z,x,y], [element,transformation]`);
    return s;
  }, d.Z.createGlider = function(e, t, o) {
    var s, n, h = a.Z.copyAttributes(o, e.options, "glider");
    return n = t.length === 1 ? [0, 0] : t.slice(0, 2), (s = e.create("point", n, h)).makeGlider(t[t.length - 1]), s;
  }, d.Z.createIntersectionPoint = function(e, t, o) {
    var s, n, h, l, p, u, v = a.Z.copyAttributes(o, e.options, "intersection");
    t.push(0, 0), n = e.select(t[0]), h = e.select(t[1]), p = t[2] || 0, u = t[3] || 0, s = e.create("point", [0, 0, 0], v), l = _.Z.intersectionFunction(e, n, h, p, u, s.visProp.alwaysintersect), s.addConstraint([l]);
    try {
      n.addChild(s), h.addChild(s);
    } catch {
      throw new Error("JSXGraph: Can't create 'intersection' with parent types '" + typeof t[0] + "' and '" + typeof t[1] + "'.");
    }
    return s.type = x.Z.OBJECT_TYPE_INTERSECTION, s.elType = "intersection", s.setParents([n.id, h.id]), s.intersectionNumbers = [p, u], s.getParents = function() {
      return this.parents.concat(this.intersectionNumbers);
    }, s.generatePolynomial = function() {
      var Z = n.generatePolynomial(s), y = h.generatePolynomial(s);
      return Z.length === 0 || y.length === 0 ? [] : [Z[0], y[0]];
    }, s;
  }, d.Z.createOtherIntersectionPoint = function(e, t, o) {
    var s, n, h, l;
    if (t.length !== 3 || !a.Z.isPoint(t[2]) || t[0].elementClass !== x.Z.OBJECT_CLASS_LINE && t[0].elementClass !== x.Z.OBJECT_CLASS_CIRCLE || t[1].elementClass !== x.Z.OBJECT_CLASS_LINE && t[1].elementClass !== x.Z.OBJECT_CLASS_CIRCLE)
      throw new Error("JSXGraph: Can't create 'other intersection point' with parent types '" + typeof t[0] + "',  '" + typeof t[1] + "'and  '" + typeof t[2] + `'.
Possible parent types: [circle|line,circle|line,point]`);
    return n = e.select(t[0]), h = e.select(t[1]), l = e.select(t[2]), (s = e.create("point", [function() {
      var p = _.Z.meet(n.stdform, h.stdform, 0, n.board);
      return Math.abs(l.X() - p.usrCoords[1]) > k.Z.eps || Math.abs(l.Y() - p.usrCoords[2]) > k.Z.eps || Math.abs(l.Z() - p.usrCoords[0]) > k.Z.eps ? p : _.Z.meet(n.stdform, h.stdform, 1, n.board);
    }], o)).type = x.Z.OBJECT_TYPE_INTERSECTION, s.elType = "otherintersection", s.setParents([n.id, h.id, l]), n.addChild(s), h.addChild(s), s.generatePolynomial = function() {
      var p = n.generatePolynomial(s), u = h.generatePolynomial(s);
      return p.length === 0 || u.length === 0 ? [] : [p[0], u[0]];
    }, s;
  }, d.Z.createPolePoint = function(e, t, o) {
    var s, n, h, l, p, u, v;
    if (t.length > 1 && (l = t[0].type === x.Z.OBJECT_TYPE_CONIC || t[0].elementClass === x.Z.OBJECT_CLASS_CIRCLE, p = t[1].type === x.Z.OBJECT_TYPE_CONIC || t[1].elementClass === x.Z.OBJECT_CLASS_CIRCLE, u = t[0].elementClass === x.Z.OBJECT_CLASS_LINE, v = t[1].elementClass === x.Z.OBJECT_CLASS_LINE), t.length !== 2 || !(l && v || u && p))
      throw new Error("JSXGraph: Can't create 'pole point' with parent types '" + typeof t[0] + "' and '" + typeof t[1] + `'.
Possible parent type: [conic|circle,line], [line,conic|circle]`);
    return v ? (n = e.select(t[0]), h = e.select(t[1])) : (n = e.select(t[1]), h = e.select(t[0])), (s = e.create("point", [function() {
      var Z = n.quadraticform, y = h.stdform.slice(0, 3);
      return [d.Z.Math.Numerics.det([y, Z[1], Z[2]]), d.Z.Math.Numerics.det([Z[0], y, Z[2]]), d.Z.Math.Numerics.det([Z[0], Z[1], y])];
    }], o)).elType = "polepoint", s.setParents([n.id, h.id]), n.addChild(s), h.addChild(s), s;
  }, d.Z.registerElement("point", d.Z.createPoint), d.Z.registerElement("glider", d.Z.createGlider), d.Z.registerElement("intersection", d.Z.createIntersectionPoint), d.Z.registerElement("otherintersection", d.Z.createOtherIntersectionPoint), d.Z.registerElement("polepoint", d.Z.createPolePoint);
  const ft = d.Z.Point;
  d.Z.Line = function(e, t, o, s) {
    this.constructor(e, s, x.Z.OBJECT_TYPE_LINE, x.Z.OBJECT_CLASS_LINE), this.point1 = this.board.select(t), this.point2 = this.board.select(o), this.ticks = [], this.defaultTicks = null, this.parentPolygon = null, this.id = this.board.setId(this, "L"), this.board.renderer.drawLine(this), this.board.finalizeAdding(this), this.elType = "line", this.point1._is_new ? (this.addChild(this.point1), delete this.point1._is_new) : this.point1.addChild(this), this.point2._is_new ? (this.addChild(this.point2), delete this.point2._is_new) : this.point2.addChild(this), this.inherits.push(this.point1, this.point2), this.updateStdform(), this.createLabel(), this.methodMap = d.Z.deepCopy(this.methodMap, { point1: "point1", point2: "point2", getSlope: "getSlope", getRise: "getRise", getYIntersect: "getRise", getAngle: "getAngle", L: "L", length: "L" });
  }, d.Z.Line.prototype = new Je.Z(), d.Z.extend(d.Z.Line.prototype, { hasPoint: function(e, t) {
    var o, s, n, h, l, p, u, v, Z, y = [], O = [1, e, t], S = a.Z.evaluate(this.visProp.strokewidth);
    return a.Z.isObject(a.Z.evaluate(this.visProp.precision)) ? (Z = this.board._inputDevice, v = a.Z.evaluate(this.visProp.precision[Z])) : v = this.board.options.precision.hasPoint, v += 0.5 * S, y[0] = this.stdform[0] - this.stdform[1] * this.board.origin.scrCoords[1] / this.board.unitX + this.stdform[2] * this.board.origin.scrCoords[2] / this.board.unitY, y[1] = this.stdform[1] / this.board.unitX, y[2] = this.stdform[2] / -this.board.unitY, o = _.Z.distPointLine(O, y), !(isNaN(o) || o > v) && (!(!a.Z.evaluate(this.visProp.straightfirst) || !a.Z.evaluate(this.visProp.straightlast)) || (n = this.point1.coords, h = this.point2.coords, s = [0, y[1], y[2]], s = k.Z.crossProduct(s, O), (s = k.Z.crossProduct(s, y))[1] /= s[0], s[2] /= s[0], s[0] = 1, s = new b.Z(x.Z.COORDS_BY_SCREEN, s.slice(1), this.board).usrCoords, l = n.distance(x.Z.COORDS_BY_USER, h), n = n.usrCoords.slice(0), h = h.usrCoords.slice(0), l < k.Z.eps ? p = 0 : (l === Number.POSITIVE_INFINITY && (l = 1 / k.Z.eps, Math.abs(h[0]) < k.Z.eps ? (l /= _.Z.distance([0, 0, 0], h), h = [1, n[1] + h[1] * l, n[2] + h[2] * l]) : (l /= _.Z.distance([0, 0, 0], n), n = [1, h[1] + n[1] * l, h[2] + n[2] * l])), l = h[u = 1] - n[u], Math.abs(l) < k.Z.eps && (l = h[u = 2] - n[u]), p = (s[u] - n[u]) / l), !(!a.Z.evaluate(this.visProp.straightfirst) && p < 0) && !(!a.Z.evaluate(this.visProp.straightlast) && p > 1)));
  }, update: function() {
    var e;
    return this.needsUpdate ? (this.constrained && (a.Z.isFunction(this.funps) ? (e = this.funps()) && e.length && e.length === 2 && (this.point1 = e[0], this.point2 = e[1]) : (a.Z.isFunction(this.funp1) && (e = this.funp1(), a.Z.isPoint(e) ? this.point1 = e : e && e.length && e.length === 2 && this.point1.setPositionDirectly(x.Z.COORDS_BY_USER, e)), a.Z.isFunction(this.funp2) && (e = this.funp2(), a.Z.isPoint(e) ? this.point2 = e : e && e.length && e.length === 2 && this.point2.setPositionDirectly(x.Z.COORDS_BY_USER, e)))), this.updateSegmentFixedLength(), this.updateStdform(), a.Z.evaluate(this.visProp.trace) && this.cloneToBackground(!0), this) : this;
  }, updateSegmentFixedLength: function() {
    var e, t, o, s, n, h, l, p;
    return this.hasFixedLength ? (e = this.point1.Dist(this.point2), t = this.fixedLength(), o = this.fixedLengthOldCoords[0].distance(x.Z.COORDS_BY_USER, this.point1.coords), s = this.fixedLengthOldCoords[1].distance(x.Z.COORDS_BY_USER, this.point2.coords), (o > k.Z.eps || s > k.Z.eps || e !== t) && (n = this.point1.isDraggable && this.point1.type !== x.Z.OBJECT_TYPE_GLIDER && !a.Z.evaluate(this.point1.visProp.fixed), h = this.point2.isDraggable && this.point2.type !== x.Z.OBJECT_TYPE_GLIDER && !a.Z.evaluate(this.point2.visProp.fixed), e > k.Z.eps ? o > s && h || o <= s && h && !n ? (this.point2.setPositionDirectly(x.Z.COORDS_BY_USER, [this.point1.X() + (this.point2.X() - this.point1.X()) * t / e, this.point1.Y() + (this.point2.Y() - this.point1.Y()) * t / e]), this.point2.fullUpdate()) : (o <= s && n || o > s && n && !h) && (this.point1.setPositionDirectly(x.Z.COORDS_BY_USER, [this.point2.X() + (this.point1.X() - this.point2.X()) * t / e, this.point2.Y() + (this.point1.Y() - this.point2.Y()) * t / e]), this.point1.fullUpdate()) : (l = Math.random() - 0.5, p = Math.random() - 0.5, e = Math.sqrt(l * l + p * p), h ? (this.point2.setPositionDirectly(x.Z.COORDS_BY_USER, [this.point1.X() + l * t / e, this.point1.Y() + p * t / e]), this.point2.fullUpdate()) : n && (this.point1.setPositionDirectly(x.Z.COORDS_BY_USER, [this.point2.X() + l * t / e, this.point2.Y() + p * t / e]), this.point1.fullUpdate())), this.fixedLengthOldCoords[0].setCoordinates(x.Z.COORDS_BY_USER, this.point1.coords.usrCoords), this.fixedLengthOldCoords[1].setCoordinates(x.Z.COORDS_BY_USER, this.point2.coords.usrCoords)), this) : this;
  }, updateStdform: function() {
    var e = k.Z.crossProduct(this.point1.coords.usrCoords, this.point2.coords.usrCoords);
    this.stdform[0] = e[0], this.stdform[1] = e[1], this.stdform[2] = e[2], this.stdform[3] = 0, this.normalize();
  }, updateRenderer: function() {
    return this.needsUpdate ? (this.visPropCalc.visible && (this.isReal = !isNaN(this.point1.coords.usrCoords[1] + this.point1.coords.usrCoords[2] + this.point2.coords.usrCoords[1] + this.point2.coords.usrCoords[2]) && k.Z.innerProduct(this.stdform, this.stdform, 3) >= k.Z.eps * k.Z.eps, this.isReal || this.updateVisibility(!1)), this.visPropCalc.visible && this.board.renderer.updateLine(this), this.hasLabel && this.visPropCalc.visible && this.label && this.label.visPropCalc.visible && this.isReal && (this.label.update(), this.board.renderer.updateText(this.label)), this.setDisplayRendNode(), this.needsUpdate = !1, this) : this;
  }, generatePolynomial: function(e) {
    var t = this.point1.symbolic.x, o = this.point1.symbolic.y, s = this.point2.symbolic.x, n = this.point2.symbolic.y, h = e.symbolic.x, l = e.symbolic.y;
    return [["(", o, ")*(", h, ")-(", o, ")*(", s, ")+(", l, ")*(", s, ")-(", t, ")*(", l, ")+(", t, ")*(", n, ")-(", h, ")*(", n, ")"].join("")];
  }, getRise: function() {
    return Math.abs(this.stdform[2]) >= k.Z.eps ? -this.stdform[0] / this.stdform[2] : 1 / 0;
  }, getSlope: function() {
    return Math.abs(this.stdform[2]) >= k.Z.eps ? -this.stdform[1] / this.stdform[2] : 1 / 0;
  }, getAngle: function() {
    return Math.atan2(-this.stdform[1], this.stdform[2]);
  }, setStraight: function(e, t) {
    return this.visProp.straightfirst = e, this.visProp.straightlast = t, this.board.renderer.updateLine(this), this;
  }, getTextAnchor: function() {
    return new b.Z(x.Z.COORDS_BY_USER, [0.5 * (this.point2.X() + this.point1.X()), 0.5 * (this.point2.Y() + this.point1.Y())], this.board);
  }, setLabelRelativeCoords: function(e) {
    a.Z.exists(this.label) && (this.label.relativeCoords = new b.Z(x.Z.COORDS_BY_SCREEN, [e[0], -e[1]], this.board));
  }, getLabelAnchor: function() {
    var e, t, o = 0, s = new b.Z(x.Z.COORDS_BY_USER, this.point1.coords.usrCoords, this.board), n = new b.Z(x.Z.COORDS_BY_USER, this.point2.coords.usrCoords, this.board), h = a.Z.evaluate(this.visProp.straightfirst), l = a.Z.evaluate(this.visProp.straightlast);
    if ((h || l) && _.Z.calcStraight(this, s, n, 0), s = s.scrCoords, n = n.scrCoords, !a.Z.exists(this.label))
      return new b.Z(x.Z.COORDS_BY_SCREEN, [NaN, NaN], this.board);
    switch (a.Z.evaluate(this.label.visProp.position)) {
      case "last":
        e = n[1], t = n[2];
        break;
      case "first":
        e = s[1], t = s[2];
        break;
      case "lft":
      case "llft":
      case "ulft":
        s[1] <= n[1] ? (e = s[1], t = s[2]) : (e = n[1], t = n[2]);
        break;
      case "rt":
      case "lrt":
      case "urt":
        s[1] > n[1] ? (e = s[1], t = s[2]) : (e = n[1], t = n[2]);
        break;
      default:
        e = 0.5 * (s[1] + n[1]), t = 0.5 * (s[2] + n[2]);
    }
    return (h || l) && (a.Z.exists(this.label) && (o = a.Z.evaluate(this.label.visProp.fontsize)), Math.abs(e) < k.Z.eps ? e = o : this.board.canvasWidth + k.Z.eps > e && e > this.board.canvasWidth - o - k.Z.eps && (e = this.board.canvasWidth - o), k.Z.eps + o > t && t > -k.Z.eps ? t = o : this.board.canvasHeight + k.Z.eps > t && t > this.board.canvasHeight - o - k.Z.eps && (t = this.board.canvasHeight - o)), new b.Z(x.Z.COORDS_BY_SCREEN, [e, t], this.board);
  }, cloneToBackground: function() {
    var e, t, o, s = {};
    return s.id = this.id + "T" + this.numTraces, s.elementClass = x.Z.OBJECT_CLASS_LINE, this.numTraces++, s.point1 = this.point1, s.point2 = this.point2, s.stdform = this.stdform, s.board = this.board, s.visProp = a.Z.deepCopy(this.visProp, this.visProp.traceattributes, !0), s.visProp.layer = this.board.options.layer.trace, a.Z.clearVisPropOld(s), s.visPropCalc = { visible: a.Z.evaluate(s.visProp.visible) }, t = this.getSlope(), e = this.getRise(), s.getSlope = function() {
      return t;
    }, s.getRise = function() {
      return e;
    }, o = this.board.renderer.enhancedRendering, this.board.renderer.enhancedRendering = !0, this.board.renderer.drawLine(s), this.board.renderer.enhancedRendering = o, this.traces[s.id] = s.rendNode, this;
  }, addTransform: function(e) {
    var t, o = a.Z.isArray(e) ? e : [e], s = o.length;
    for (t = 0; t < s; t++)
      this.point1.transformations.push(o[t]), this.point2.transformations.push(o[t]);
    return this;
  }, snapToGrid: function(e) {
    var t, o, s, n, h, l, p, u;
    return a.Z.evaluate(this.visProp.snaptogrid) ? this.parents.length < 3 ? (this.point1.handleSnapToGrid(!0, !0), this.point2.handleSnapToGrid(!0, !0)) : a.Z.exists(e) && (p = a.Z.evaluate(this.visProp.snapsizex), u = a.Z.evaluate(this.visProp.snapsizey), h = (t = new b.Z(x.Z.COORDS_BY_SCREEN, [e.Xprev, e.Yprev], this.board)).usrCoords[1], l = t.usrCoords[2], p <= 0 && this.board.defaultAxes && this.board.defaultAxes.x.defaultTicks && (p = (n = this.board.defaultAxes.x.defaultTicks).ticksDelta * (a.Z.evaluate(n.visProp.minorticks) + 1)), u <= 0 && this.board.defaultAxes && this.board.defaultAxes.y.defaultTicks && (u = (n = this.board.defaultAxes.y.defaultTicks).ticksDelta * (a.Z.evaluate(n.visProp.minorticks) + 1)), p > 0 && u > 0 && (o = _.Z.projectPointToLine({ coords: t }, this, this.board), s = m.Z.subtract([1, Math.round(h / p) * p, Math.round(l / u) * u], o.usrCoords), this.board.create("transform", s.slice(1), { type: "translate" }).applyOnce([this.point1, this.point2]))) : (this.point1.handleSnapToGrid(!1, !0), this.point2.handleSnapToGrid(!1, !0)), this;
  }, snapToPoints: function() {
    var e = a.Z.evaluate(this.visProp.snaptopoints);
    return this.parents.length < 3 && (this.point1.handleSnapToPoints(e), this.point2.handleSnapToPoints(e)), this;
  }, X: function(e) {
    var t, o = this.stdform[2];
    return t = Math.abs(this.point1.coords.usrCoords[0]) > k.Z.eps ? this.point1.coords.usrCoords[1] : this.point2.coords.usrCoords[1], e = 2 * (e - 0.5), (1 - Math.abs(e)) * t - e * o;
  }, Y: function(e) {
    var t, o = this.stdform[1];
    return t = Math.abs(this.point1.coords.usrCoords[0]) > k.Z.eps ? this.point1.coords.usrCoords[2] : this.point2.coords.usrCoords[2], e = 2 * (e - 0.5), (1 - Math.abs(e)) * t + e * o;
  }, Z: function(e) {
    var t = Math.abs(this.point1.coords.usrCoords[0]) > k.Z.eps ? this.point1.coords.usrCoords[0] : this.point2.coords.usrCoords[0];
    return e = 2 * (e - 0.5), (1 - Math.abs(e)) * t;
  }, L: function() {
    return this.point1.Dist(this.point2);
  }, minX: function() {
    return 0;
  }, maxX: function() {
    return 1;
  }, bounds: function() {
    var e = this.point1.coords.usrCoords, t = this.point2.coords.usrCoords;
    return [Math.min(e[1], t[1]), Math.max(e[2], t[2]), Math.max(e[1], t[1]), Math.min(e[2], t[2])];
  }, remove: function() {
    this.removeAllTicks(), Je.Z.prototype.remove.call(this);
  } }), d.Z.createLine = function(e, t, o) {
    var s, n, h, l, p, u, v, Z = [], y = !1, O = !1;
    if (t.length === 2) {
      if (a.Z.isArray(t[0]) && t[0].length > 1)
        u = a.Z.copyAttributes(o, e.options, "line", "point1"), h = e.create("point", t[0], u);
      else if (a.Z.isString(t[0]) || a.Z.isPoint(t[0]))
        h = e.select(t[0]);
      else if (a.Z.isFunction(t[0]) && a.Z.isPoint(t[0]()))
        h = t[0](), O = !0;
      else if (a.Z.isFunction(t[0]) && t[0]().length && t[0]().length >= 2)
        u = a.Z.copyAttributes(o, e.options, "line", "point1"), h = d.Z.createPoint(e, t[0](), u), O = !0;
      else {
        if (!a.Z.isObject(t[0]) || !a.Z.isTransformationOrArray(t[1]))
          throw new Error("JSXGraph: Can't create line with parent types '" + typeof t[0] + "' and '" + typeof t[1] + `'.
Possible parent types: [point,point], [[x1,y1],[x2,y2]], [a,b,c]`);
        y = !0, u = a.Z.copyAttributes(o, e.options, "line", "point1"), h = e.create("point", [t[0].point1, t[1]], u);
      }
      if (y)
        u = a.Z.copyAttributes(o, e.options, "line", "point2"), l = e.create("point", [t[0].point2, t[1]], u);
      else if (a.Z.isArray(t[1]) && t[1].length > 1)
        u = a.Z.copyAttributes(o, e.options, "line", "point2"), l = e.create("point", t[1], u);
      else if (a.Z.isString(t[1]) || a.Z.isPoint(t[1]))
        l = e.select(t[1]);
      else if (a.Z.isFunction(t[1]) && a.Z.isPoint(t[1]()))
        l = t[1](), O = !0;
      else {
        if (!(a.Z.isFunction(t[1]) && t[1]().length && t[1]().length >= 2))
          throw new Error("JSXGraph: Can't create line with parent types '" + typeof t[0] + "' and '" + typeof t[1] + `'.
Possible parent types: [point,point], [[x1,y1],[x2,y2]], [a,b,c]`);
        u = a.Z.copyAttributes(o, e.options, "line", "point2"), l = d.Z.createPoint(e, t[1](), u), O = !0;
      }
      u = a.Z.copyAttributes(o, e.options, "line"), n = new d.Z.Line(e, h, l, u), O ? (n.constrained = !0, n.funp1 = t[0], n.funp2 = t[1]) : y || (n.isDraggable = !0), n.setParents([h.id, l.id]);
    } else if (t.length === 3) {
      for (v = !0, p = 0; p < 3; p++)
        if (a.Z.isNumber(t[p]))
          Z[p] = a.Z.createFunction(t[p]);
        else {
          if (!a.Z.isFunction(t[p]))
            throw new Error("JSXGraph: Can't create line with parent types '" + typeof t[0] + "' and '" + typeof t[1] + "' and '" + typeof t[2] + `'.
Possible parent types: [point,point], [[x1,y1],[x2,y2]], [a,b,c]`);
          Z[p] = t[p], v = !1;
        }
      u = a.Z.copyAttributes(o, e.options, "line", "point1"), h = v ? e.create("point", [Z[2]() * Z[2]() + Z[1]() * Z[1](), Z[2]() - Z[1]() * Z[0]() + Z[2](), -Z[1]() - Z[2]() * Z[0]() - Z[1]()], u) : e.create("point", [function() {
        return 0.5 * (Z[2]() * Z[2]() + Z[1]() * Z[1]());
      }, function() {
        return 0.5 * (Z[2]() - Z[1]() * Z[0]() + Z[2]());
      }, function() {
        return 0.5 * (-Z[1]() - Z[2]() * Z[0]() - Z[1]());
      }], u), u = a.Z.copyAttributes(o, e.options, "line", "point2"), l = v ? e.create("point", [Z[2]() * Z[2]() + Z[1]() * Z[1](), -Z[1]() * Z[0]() + Z[2](), -Z[2]() * Z[0]() - Z[1]()], u) : e.create("point", [function() {
        return Z[2]() * Z[2]() + Z[1]() * Z[1]();
      }, function() {
        return -Z[1]() * Z[0]() + Z[2]();
      }, function() {
        return -Z[2]() * Z[0]() - Z[1]();
      }], u), h.prepareUpdate().update(), l.prepareUpdate().update(), u = a.Z.copyAttributes(o, e.options, "line"), (n = new d.Z.Line(e, h, l, u)).isDraggable = v, n.setParents([h, l]);
    } else if (t.length === 1 && a.Z.isFunction(t[0]) && t[0]().length === 2 && a.Z.isPoint(t[0]()[0]) && a.Z.isPoint(t[0]()[1]))
      s = t[0](), u = a.Z.copyAttributes(o, e.options, "line"), (n = new d.Z.Line(e, s[0], s[1], u)).constrained = !0, n.funps = t[0], n.setParents(s);
    else {
      if (!(t.length === 1 && a.Z.isFunction(t[0]) && t[0]().length === 3 && a.Z.isNumber(t[0]()[0]) && a.Z.isNumber(t[0]()[1]) && a.Z.isNumber(t[0]()[2])))
        throw new Error("JSXGraph: Can't create line with parent types '" + typeof t[0] + "' and '" + typeof t[1] + `'.
Possible parent types: [point,point], [[x1,y1],[x2,y2]], [a,b,c]`);
      s = t[0], u = a.Z.copyAttributes(o, e.options, "line", "point1"), h = e.create("point", [function() {
        var S = s();
        return [0.5 * (S[2] * S[2] + S[1] * S[1]), 0.5 * (S[2] - S[1] * S[0] + S[2]), 0.5 * (-S[1] - S[2] * S[0] - S[1])];
      }], u), u = a.Z.copyAttributes(o, e.options, "line", "point2"), l = e.create("point", [function() {
        var S = s();
        return [S[2] * S[2] + S[1] * S[1], -S[1] * S[0] + S[2], -S[2] * S[0] - S[1]];
      }], u), u = a.Z.copyAttributes(o, e.options, "line"), (n = new d.Z.Line(e, h, l, u)).constrained = !0, n.funps = t[0], n.setParents([h, l]);
    }
    return n;
  }, d.Z.registerElement("line", d.Z.createLine), d.Z.createSegment = function(e, t, o) {
    var s, n;
    if (o.straightFirst = !1, o.straightLast = !1, n = a.Z.copyAttributes(o, e.options, "segment"), s = e.create("line", t.slice(0, 2), n), t.length === 3) {
      if (s.hasFixedLength = !0, a.Z.isNumber(t[2]))
        s.fixedLength = function() {
          return t[2];
        };
      else {
        if (!a.Z.isFunction(t[2]))
          throw new Error("JSXGraph: Can't create segment with third parent type '" + typeof t[2] + `'.
Possible third parent types: number or function`);
        s.fixedLength = t[2];
      }
      s.getParents = function() {
        return this.parents.concat(this.fixedLength());
      }, s.fixedLengthOldCoords = [], s.fixedLengthOldCoords[0] = new b.Z(x.Z.COORDS_BY_USER, s.point1.coords.usrCoords.slice(1, 3), e), s.fixedLengthOldCoords[1] = new b.Z(x.Z.COORDS_BY_USER, s.point2.coords.usrCoords.slice(1, 3), e);
    }
    return s.elType = "segment", s;
  }, d.Z.registerElement("segment", d.Z.createSegment), d.Z.createArrow = function(e, t, o) {
    var s, n;
    return o.straightFirst = !1, o.straightLast = !1, n = a.Z.copyAttributes(o, e.options, "arrow"), (s = e.create("line", t, n)).type = x.Z.OBJECT_TYPE_VECTOR, s.elType = "arrow", s;
  }, d.Z.registerElement("arrow", d.Z.createArrow), d.Z.createAxis = function(e, t, o) {
    var s, n, h, l, p;
    if (!a.Z.isArray(t[0]) && !a.Z.isPoint(t[0]) || !a.Z.isArray(t[1]) && !a.Z.isPoint(t[1]))
      throw new Error("JSXGraph: Can't create axis with parent types '" + typeof t[0] + "' and '" + typeof t[1] + `'.
Possible parent types: [point,point], [[x1,y1],[x2,y2]]`);
    for (l in s = a.Z.copyAttributes(o, e.options, "axis"), (h = e.create("line", t, s)).type = x.Z.OBJECT_TYPE_AXIS, h.isDraggable = !1, h.point1.isDraggable = !1, h.point2.isDraggable = !1, h.ancestors)
      h.ancestors.hasOwnProperty(l) && (h.ancestors[l].type = x.Z.OBJECT_TYPE_AXISPOINT);
    return n = a.Z.copyAttributes(o, e.options, "axis", "ticks"), p = a.Z.exists(n.ticksdistance) ? n.ticksdistance : a.Z.isArray(n.ticks) ? n.ticks : 1, h.defaultTicks = e.create("ticks", [h, p], n), h.defaultTicks.dump = !1, h.elType = "axis", h.subs = { ticks: h.defaultTicks }, h.inherits.push(h.defaultTicks), h;
  }, d.Z.registerElement("axis", d.Z.createAxis), d.Z.createTangent = function(e, t, o) {
    var s, n, h, l, p;
    if (t.length === 1)
      s = t[0], n = s.slideObject;
    else {
      if (t.length !== 2)
        throw new Error("JSXGraph: Can't create tangent with parent types '" + typeof t[0] + "' and '" + typeof t[1] + `'.
Possible parent types: [glider], [point,line|curve|circle|conic]`);
      if (a.Z.isPoint(t[0]))
        s = t[0], n = t[1];
      else {
        if (!a.Z.isPoint(t[1]))
          throw new Error("JSXGraph: Can't create tangent with parent types '" + typeof t[0] + "' and '" + typeof t[1] + `'.
Possible parent types: [glider], [point,line|curve|circle|conic]`);
        n = t[0], s = t[1];
      }
    }
    if (n.elementClass === x.Z.OBJECT_CLASS_LINE ? (p = e.create("line", [n.point1, n.point2], o)).glider = s : n.elementClass === x.Z.OBJECT_CLASS_CURVE && n.type !== x.Z.OBJECT_TYPE_CONIC ? a.Z.evaluate(n.visProp.curvetype) !== "plot" ? (p = e.create("line", [function() {
      var u = n.X, v = n.Y;
      return -s.X() * c.Z.D(v)(s.position) + s.Y() * c.Z.D(u)(s.position);
    }, function() {
      return c.Z.D(n.Y)(s.position);
    }, function() {
      return -c.Z.D(n.X)(s.position);
    }], o), s.addChild(p), p.glider = s) : (p = e.create("line", [function() {
      var u, v, Z, y, O, S, R, L, B, X, F = Math.floor(s.position);
      if (n.bezierDegree === 1)
        F === n.numberPoints - 1 && F--;
      else {
        if (n.bezierDegree !== 3)
          return 0;
        F = 3 * Math.floor(s.position * (n.numberPoints - 1) / 3), Z = (s.position * (n.numberPoints - 1) - F) / 3, F >= n.numberPoints - 1 && (F = n.numberPoints - 4, Z = 1);
      }
      return F < 0 ? 1 : (n.bezierDegree === 1 ? (u = n.points[F].usrCoords, v = n.points[F + 1].usrCoords) : (y = n.points[F].usrCoords, O = n.points[F + 1].usrCoords, S = n.points[F + 2].usrCoords, R = n.points[F + 3].usrCoords, L = (1 - Z) * (1 - Z) * (O[1] - y[1]) + 2 * (1 - Z) * Z * (S[1] - O[1]) + Z * Z * (R[1] - S[1]), B = (1 - Z) * (1 - Z) * (O[2] - y[2]) + 2 * (1 - Z) * Z * (S[2] - O[2]) + Z * Z * (R[2] - S[2]), L /= X = Math.sqrt(L * L + B * B), B /= X, v = [1, (u = s.coords.usrCoords)[1] + L, u[2] + B]), u[2] * v[1] - u[1] * v[2]);
    }, function() {
      var u, v, Z, y, O, S, R, L, B, X, F = Math.floor(s.position);
      if (n.bezierDegree === 1)
        F === n.numberPoints - 1 && F--;
      else {
        if (n.bezierDegree !== 3)
          return 0;
        F = 3 * Math.floor(s.position * (n.numberPoints - 1) / 3), Z = (s.position * (n.numberPoints - 1) - F) / 3, F >= n.numberPoints - 1 && (F = n.numberPoints - 4, Z = 1);
      }
      return F < 0 ? 0 : (n.bezierDegree === 1 ? (u = n.points[F].usrCoords, v = n.points[F + 1].usrCoords) : (y = n.points[F].usrCoords, O = n.points[F + 1].usrCoords, S = n.points[F + 2].usrCoords, R = n.points[F + 3].usrCoords, L = (1 - Z) * (1 - Z) * (O[1] - y[1]) + 2 * (1 - Z) * Z * (S[1] - O[1]) + Z * Z * (R[1] - S[1]), B = (1 - Z) * (1 - Z) * (O[2] - y[2]) + 2 * (1 - Z) * Z * (S[2] - O[2]) + Z * Z * (R[2] - S[2]), L /= X = Math.sqrt(L * L + B * B), B /= X, v = [1, (u = s.coords.usrCoords)[1] + L, u[2] + B]), v[2] - u[2]);
    }, function() {
      var u, v, Z, y, O, S, R, L, B, X, F = Math.floor(s.position);
      if (n.bezierDegree === 1)
        F === n.numberPoints - 1 && F--;
      else {
        if (n.bezierDegree !== 3)
          return 0;
        F = 3 * Math.floor(s.position * (n.numberPoints - 1) / 3), Z = (s.position * (n.numberPoints - 1) - F) / 3, F >= n.numberPoints - 1 && (F = n.numberPoints - 4, Z = 1);
      }
      return F < 0 ? 0 : (n.bezierDegree === 1 ? (u = n.points[F].usrCoords, v = n.points[F + 1].usrCoords) : (y = n.points[F].usrCoords, O = n.points[F + 1].usrCoords, S = n.points[F + 2].usrCoords, R = n.points[F + 3].usrCoords, L = (1 - Z) * (1 - Z) * (O[1] - y[1]) + 2 * (1 - Z) * Z * (S[1] - O[1]) + Z * Z * (R[1] - S[1]), B = (1 - Z) * (1 - Z) * (O[2] - y[2]) + 2 * (1 - Z) * Z * (S[2] - O[2]) + Z * Z * (R[2] - S[2]), L /= X = Math.sqrt(L * L + B * B), B /= X, v = [1, (u = s.coords.usrCoords)[1] + L, u[2] + B]), u[1] - v[1]);
    }], o), s.addChild(p), p.glider = s) : n.type === x.Z.OBJECT_TYPE_TURTLE ? (p = e.create("line", [function() {
      var u = Math.floor(s.position);
      for (h = 0; h < n.objects.length; h++)
        if ((l = n.objects[h]).type === x.Z.OBJECT_TYPE_CURVE) {
          if (u < l.numberPoints)
            break;
          u -= l.numberPoints;
        }
      return u === l.numberPoints - 1 && u--, u < 0 ? 1 : l.Y(u) * l.X(u + 1) - l.X(u) * l.Y(u + 1);
    }, function() {
      var u = Math.floor(s.position);
      for (h = 0; h < n.objects.length; h++)
        if ((l = n.objects[h]).type === x.Z.OBJECT_TYPE_CURVE) {
          if (u < l.numberPoints)
            break;
          u -= l.numberPoints;
        }
      return u === l.numberPoints - 1 && u--, u < 0 ? 0 : l.Y(u + 1) - l.Y(u);
    }, function() {
      var u = Math.floor(s.position);
      for (h = 0; h < n.objects.length; h++)
        if ((l = n.objects[h]).type === x.Z.OBJECT_TYPE_CURVE) {
          if (u < l.numberPoints)
            break;
          u -= l.numberPoints;
        }
      return u === l.numberPoints - 1 && u--, u < 0 ? 0 : l.X(u) - l.X(u + 1);
    }], o), s.addChild(p), p.glider = s) : n.elementClass !== x.Z.OBJECT_CLASS_CIRCLE && n.type !== x.Z.OBJECT_TYPE_CONIC || (p = e.create("line", [function() {
      return k.Z.matVecMult(n.quadraticform, s.coords.usrCoords)[0];
    }, function() {
      return k.Z.matVecMult(n.quadraticform, s.coords.usrCoords)[1];
    }, function() {
      return k.Z.matVecMult(n.quadraticform, s.coords.usrCoords)[2];
    }], o), s.addChild(p), p.glider = s), !a.Z.exists(p))
      throw new Error("JSXGraph: Couldn't create tangent with the given parents.");
    return p.elType = "tangent", p.type = x.Z.OBJECT_TYPE_TANGENT, p.setParents(t), p;
  }, d.Z.createRadicalAxis = function(e, t, o) {
    var s, n, h;
    if (t.length !== 2 || t[0].elementClass !== x.Z.OBJECT_CLASS_CIRCLE || t[1].elementClass !== x.Z.OBJECT_CLASS_CIRCLE)
      throw new Error("JSXGraph: Can't create 'radical axis' with parent types '" + typeof t[0] + "' and '" + typeof t[1] + `'.
Possible parent type: [circle,circle]`);
    return n = e.select(t[0]), h = e.select(t[1]), (s = e.create("line", [function() {
      var l = n.stdform, p = h.stdform;
      return k.Z.matVecMult(k.Z.transpose([l.slice(0, 3), p.slice(0, 3)]), [p[3], -l[3]]);
    }], o)).elType = "radicalaxis", s.setParents([n.id, h.id]), n.addChild(s), h.addChild(s), s;
  }, d.Z.createPolarLine = function(e, t, o) {
    var s, n, h, l, p, u, v;
    if (t.length > 1 && (l = t[0].type === x.Z.OBJECT_TYPE_CONIC || t[0].elementClass === x.Z.OBJECT_CLASS_CIRCLE, p = t[1].type === x.Z.OBJECT_TYPE_CONIC || t[1].elementClass === x.Z.OBJECT_CLASS_CIRCLE, u = a.Z.isPoint(t[0]), v = a.Z.isPoint(t[1])), t.length !== 2 || !(l && v || u && p))
      throw new Error("JSXGraph: Can't create 'polar line' with parent types '" + typeof t[0] + "' and '" + typeof t[1] + `'.
Possible parent type: [conic|circle,point], [point,conic|circle]`);
    return v ? (n = e.select(t[0]), h = e.select(t[1])) : (n = e.select(t[1]), h = e.select(t[0])), (s = e.create("tangent", [n, h], o)).elType = "polarline", s;
  }, d.Z.registerElement("tangent", d.Z.createTangent), d.Z.registerElement("polar", d.Z.createTangent), d.Z.registerElement("radicalaxis", d.Z.createRadicalAxis), d.Z.registerElement("polarline", d.Z.createPolarLine), d.Z.Line, d.Z.Group = function(e, t, o, s, n) {
    var h, l, p, u;
    for (this.board = e, this.objects = {}, h = this.board.numObjects, this.board.numObjects += 1, t !== "" && a.Z.exists(t) ? this.id = t : this.id = this.board.id + "Group" + h, this.board.groups[this.id] = this, this.type = x.Z.OBJECT_TYPE_POINT, this.elementClass = x.Z.OBJECT_CLASS_POINT, o !== "" && a.Z.exists(o) ? this.name = o : this.name = "group_" + this.board.generateName(this), delete this.type, this.coords = {}, this.needsRegularUpdate = n.needsregularupdate, this.rotationCenter = "centroid", this.scaleCenter = null, this.rotationPoints = [], this.translationPoints = [], this.scalePoints = [], this.scaleDirections = {}, this.parents = [], l = a.Z.isArray(s) ? s : Array.prototype.slice.call(arguments, 3), p = 0; p < l.length; p++)
      u = this.board.select(l[p]), !a.Z.evaluate(u.visProp.fixed) && a.Z.exists(u.coords) && this.addPoint(u);
    this.methodMap = { ungroup: "ungroup", add: "addPoint", addPoint: "addPoint", addPoints: "addPoints", addGroup: "addGroup", remove: "removePoint", removePoint: "removePoint", setAttribute: "setAttribute", setProperty: "setAttribute" };
  }, d.Z.extend(d.Z.Group.prototype, { ungroup: function() {
    var e, t, o;
    for (e in this.objects)
      this.objects.hasOwnProperty(e) && (t = this.objects[e].point, a.Z.isArray(t.groups) && (o = a.Z.indexOf(t.groups, this.id)) >= 0 && delete t.groups[o]);
    return this.objects = {}, this;
  }, addParents: function(e) {
    var t, o, s;
    for (o = (s = a.Z.isArray(e) ? e : arguments).length, t = 0; t < o; ++t)
      a.Z.isId(this.board, s[t]) ? this.parents.push(s[t]) : a.Z.exists(s[t].id) && this.parents.push(s[t].id);
    this.parents = a.Z.uniqueArray(this.parents);
  }, setParents: function(e) {
    return this.parents = [], this.addParents(e), this;
  }, getParents: function() {
    return a.Z.isArray(this.parents) ? this.parents : [];
  }, _updateCoordsCache: function(e) {
    var t;
    e !== "" && a.Z.exists(this.objects[e]) && (t = this.objects[e].point, this.coords[t.id] = { usrCoords: t.coords.usrCoords.slice(0) });
  }, update: function() {
    var e, t, o, s, n, h, l, p, u, v, Z = null;
    if (!this.needsUpdate)
      return this;
    if ((e = this._update_find_drag_type()).action === "nothing")
      return this._updateCoordsCache(e.id), this;
    if (Z = this.objects[e.id].point, e.action === "translation")
      u = [Z.coords.usrCoords[1] - this.coords[e.id].usrCoords[1], Z.coords.usrCoords[2] - this.coords[e.id].usrCoords[2]];
    else if (e.action === "rotation" || e.action === "scaling") {
      if (o = e.action === "rotation" ? "rotationCenter" : "scaleCenter", a.Z.isPoint(this[o]))
        v = this[o].coords.usrCoords.slice(1);
      else if (this[o] === "centroid")
        v = this._update_centroid_center();
      else if (a.Z.isArray(this[o]))
        v = this[o];
      else {
        if (!a.Z.isFunction(this[o]))
          return this;
        v = this[o]();
      }
      if (e.action === "rotation")
        p = _.Z.rad(this.coords[e.id].usrCoords.slice(1), v, this.objects[e.id].point), (u = this.board.create("transform", [p, v[0], v[1]], { type: "rotate" })).update();
      else {
        if (e.action !== "scaling")
          return this;
        if (n = _.Z.distance(this.coords[e.id].usrCoords.slice(1), v), Math.abs(n) < k.Z.eps)
          return this;
        n = _.Z.distance(Z.coords.usrCoords.slice(1), v) / n, h = this.scaleDirections[e.id].indexOf("x") >= 0 ? n : 1, l = this.scaleDirections[e.id].indexOf("y") >= 0 ? n : 1, (u = this.board.create("transform", [1, 0, 0, v[0] * (1 - h), h, 0, v[1] * (1 - l), 0, l], { type: "generic" })).update();
      }
    }
    for (t in this._update_apply_transformation(e, u), this.needsUpdate = !1, this.objects)
      if (this.objects.hasOwnProperty(t))
        for (s in this.objects[t].descendants)
          this.objects[t].descendants.hasOwnProperty(s) && (this.objects[t].descendants.needsUpdate = this.objects[t].descendants.needsRegularUpdate || this.board.needsFullUpdate);
    for (t in this.board.updateElements(e), this.objects)
      this.objects.hasOwnProperty(t) && this._updateCoordsCache(t);
    return this;
  }, _update_find_drag_type: function() {
    var e, t, o, s = "nothing", n = [];
    for (e in this.objects)
      this.objects.hasOwnProperty(e) && (t = this.objects[e].point).coords.distance(x.Z.COORDS_BY_USER, this.coords[e]) > k.Z.eps && n.push(t.id);
    return n.length === 0 ? { action: s, id: "", changed: n } : (o = n[0], t = this.objects[o].point, n.length > 1 ? s = "translation" : a.Z.isInArray(this.rotationPoints, t) && a.Z.exists(this.rotationCenter) ? s = "rotation" : a.Z.isInArray(this.scalePoints, t) && a.Z.exists(this.scaleCenter) ? s = "scaling" : a.Z.isInArray(this.translationPoints, t) && (s = "translation"), { action: s, id: o, changed: n });
  }, _update_centroid_center: function() {
    var e, t, o;
    for (o in e = [0, 0], t = 0, this.coords)
      this.coords.hasOwnProperty(o) && (e[0] += this.coords[o].usrCoords[1], e[1] += this.coords[o].usrCoords[2], ++t);
    return t > 0 && (e[0] /= t, e[1] /= t), e;
  }, _update_apply_transformation: function(e, t) {
    var o, s;
    for (o in this.objects)
      this.objects.hasOwnProperty(o) && (a.Z.exists(this.board.objects[o]) ? (s = this.objects[o].point).id !== e.id ? e.action === "translation" ? a.Z.isInArray(e.changed, s.id) || s.coords.setCoordinates(x.Z.COORDS_BY_USER, [this.coords[o].usrCoords[1] + t[0], this.coords[o].usrCoords[2] + t[1]]) : e.action !== "rotation" && e.action !== "scaling" || t.applyOnce([s]) : e.action !== "rotation" && e.action !== "scaling" || s.coords.setCoordinates(x.Z.COORDS_BY_USER, k.Z.matVecMult(t.matrix, this.coords[s.id].usrCoords)) : delete this.objects[o]);
  }, addPoint: function(e) {
    return this.objects[e.id] = { point: this.board.select(e) }, this._updateCoordsCache(e.id), this.translationPoints.push(e), e.groups.push(this.id), e.groups = a.Z.uniqueArray(e.groups), this;
  }, addPoints: function(e) {
    var t;
    for (t = 0; t < e.length; t++)
      this.addPoint(e[t]);
    return this;
  }, addGroup: function(e) {
    var t;
    for (t in e.objects)
      e.objects.hasOwnProperty(t) && this.addPoint(e.objects[t].point);
    return this;
  }, removePoint: function(e) {
    return delete this.objects[e.id], this;
  }, setRotationCenter: function(e) {
    return this.rotationCenter = e, this;
  }, setRotationPoints: function(e) {
    return this._setActionPoints("rotation", e);
  }, addRotationPoint: function(e) {
    return this._addActionPoint("rotation", e);
  }, removeRotationPoint: function(e) {
    return this._removeActionPoint("rotation", e);
  }, setTranslationPoints: function(e) {
    return this._setActionPoints("translation", e);
  }, addTranslationPoint: function(e) {
    return this._addActionPoint("translation", e);
  }, removeTranslationPoint: function(e) {
    return this._removeActionPoint("translation", e);
  }, setScaleCenter: function(e) {
    return this.scaleCenter = e, this;
  }, setScalePoints: function(e, t) {
    var o, s, n;
    for (n = (o = a.Z.isArray(e) ? e : arguments).length, s = 0; s < n; ++s)
      this.scaleDirections[this.board.select(o[s]).id] = t || "xy";
    return this._setActionPoints("scale", e);
  }, addScalePoint: function(e, t) {
    return this._addActionPoint("scale", e), this.scaleDirections[this.board.select(e).id] = t || "xy", this;
  }, removeScalePoint: function(e) {
    return this._removeActionPoint("scale", e);
  }, _setActionPoints: function(e, t) {
    var o, s, n;
    for (n = (o = a.Z.isArray(t) ? t : arguments).length, this[e + "Points"] = [], s = 0; s < n; ++s)
      this._addActionPoint(e, o[s]);
    return this;
  }, _addActionPoint: function(e, t) {
    return this[e + "Points"].push(this.board.select(t)), this;
  }, _removeActionPoint: function(e, t) {
    var o = this[e + "Points"].indexOf(this.board.select(t));
    return o > -1 && this[e + "Points"].splice(o, 1), this;
  }, setProperty: function() {
    d.Z.deprecated("Group.setProperty", "Group.setAttribute()"), this.setAttribute.apply(this, arguments);
  }, setAttribute: function() {
    var e;
    for (e in this.objects)
      this.objects.hasOwnProperty(e) && this.objects[e].point.setAttribute.apply(this.objects[e].point, arguments);
    return this;
  } }), d.Z.createGroup = function(e, t, o) {
    var s = a.Z.copyAttributes(o, e.options, "group"), n = new d.Z.Group(e, s.id, s.name, t, s);
    return n.elType = "group", n.setParents(t), n;
  }, d.Z.registerElement("group", d.Z.createGroup), d.Z.Group, d.Z.Circle = function(e, t, o, s, n) {
    this.constructor(e, n, x.Z.OBJECT_TYPE_CIRCLE, x.Z.OBJECT_CLASS_CIRCLE), this.method = t, this.midpoint = this.board.select(o), this.center = this.board.select(o), this.point2 = null, this.radius = 0, this.line = null, this.circle = null, this.points = [], t === "twoPoints" ? (this.point2 = e.select(s), this.radius = this.Radius()) : t === "pointRadius" ? (this.gxtterm = s, this.updateRadius = a.Z.createFunction(s, this.board, null, !0), this.updateRadius(), this.addParentsFromJCFunctions([this.updateRadius])) : t === "pointLine" ? (this.line = e.select(s), this.radius = this.line.point1.coords.distance(x.Z.COORDS_BY_USER, this.line.point2.coords)) : t === "pointCircle" && (this.circle = e.select(s), this.radius = this.circle.Radius()), this.id = this.board.setId(this, "C"), this.board.renderer.drawEllipse(this), this.board.finalizeAdding(this), this.createGradient(), this.elType = "circle", this.createLabel(), a.Z.exists(this.center._is_new) ? (this.addChild(this.center), delete this.center._is_new) : this.center.addChild(this), t === "pointRadius" ? this.notifyParents(s) : t === "pointLine" ? this.line.addChild(this) : t === "pointCircle" ? this.circle.addChild(this) : t === "twoPoints" && (a.Z.exists(this.point2._is_new) ? (this.addChild(this.point2), delete this.point2._is_new) : this.point2.addChild(this)), this.methodMap = a.Z.deepCopy(this.methodMap, { setRadius: "setRadius", getRadius: "getRadius", Area: "Area", area: "Area", radius: "Radius", center: "center", line: "line", point2: "point2" });
  }, d.Z.Circle.prototype = new Je.Z(), d.Z.extend(d.Z.Circle.prototype, { hasPoint: function(e, t) {
    var o, s, n, h, l, p = this.center.coords.usrCoords, u = new b.Z(x.Z.COORDS_BY_SCREEN, [e, t], this.board), v = this.Radius();
    return a.Z.isObject(a.Z.evaluate(this.visProp.precision)) ? (s = this.board._inputDevice, o = a.Z.evaluate(this.visProp.precision[s])) : o = this.board.options.precision.hasPoint, n = p[1] - u.usrCoords[1], h = p[2] - u.usrCoords[2], l = Math.sqrt(n * n + h * h), o += 0.5 * a.Z.evaluate(this.visProp.strokewidth), o /= Math.sqrt(this.board.unitX * this.board.unitY), a.Z.evaluate(this.visProp.hasinnerpoints) ? l < v + o : Math.abs(l - v) < o;
  }, generatePolynomial: function(e) {
    var t = this.center.symbolic.x, o = this.center.symbolic.y, s = e.symbolic.x, n = e.symbolic.y, h = this.generateRadiusSquared();
    return h === "" ? [] : ["((" + s + ")-(" + t + "))^2 + ((" + n + ")-(" + o + "))^2 - (" + h + ")"];
  }, generateRadiusSquared: function() {
    var e, t, o, s, n = "";
    return this.method === "twoPoints" ? (e = this.center.symbolic.x, t = this.center.symbolic.y, n = "((" + (o = this.point2.symbolic.x) + ")-(" + e + "))^2 + ((" + (s = this.point2.symbolic.y) + ")-(" + t + "))^2") : this.method === "pointRadius" ? a.Z.isNumber(this.radius) && (n = (this.radius * this.radius).toString()) : this.method === "pointLine" ? (o = this.line.point1.symbolic.x, s = this.line.point1.symbolic.y, n = "((" + o + ")-(" + this.line.point2.symbolic.x + "))^2 + ((" + s + ")-(" + this.line.point2.symbolic.y + "))^2") : this.method === "pointCircle" && (n = this.circle.Radius()), n;
  }, update: function() {
    var e, t, o, s, n, h;
    if (this.needsUpdate)
      for (a.Z.evaluate(this.visProp.trace) && this.cloneToBackground(!0), this.method === "pointLine" ? this.radius = this.line.point1.coords.distance(x.Z.COORDS_BY_USER, this.line.point2.coords) : this.method === "pointCircle" ? this.radius = this.circle.Radius() : this.method === "pointRadius" && (this.radius = this.updateRadius()), this.updateStdform(), this.updateQuadraticform(), o = this.center.coords.usrCoords[0], e = this.center.coords.usrCoords[1] / o, t = this.center.coords.usrCoords[2] / o, o /= o, s = this.Radius(), n = 0.551915024494, this.numberPoints = 13, this.dataX = [e + s, e + s, e + s * n, e, e - s * n, e - s, e - s, e - s, e - s * n, e, e + s * n, e + s, e + s], this.dataY = [t, t + s * n, t + s, t + s, t + s, t + s * n, t, t - s * n, t - s, t - s, t - s, t - s * n, t], this.bezierDegree = 3, h = 0; h < this.numberPoints; h++)
        this.points[h] = new b.Z(x.Z.COORDS_BY_USER, [this.dataX[h], this.dataY[h]], this.board);
    return this;
  }, updateQuadraticform: function() {
    var e = this.center, t = e.X(), o = e.Y(), s = this.Radius();
    this.quadraticform = [[t * t + o * o - s * s, -t, -o], [-t, 1, 0], [-o, 0, 1]];
  }, updateStdform: function() {
    this.stdform[3] = 0.5, this.stdform[4] = this.Radius(), this.stdform[1] = -this.center.coords.usrCoords[1], this.stdform[2] = -this.center.coords.usrCoords[2], isFinite(this.stdform[4]) || (this.stdform[0] = a.Z.exists(this.point2) ? -(this.stdform[1] * this.point2.coords.usrCoords[1] + this.stdform[2] * this.point2.coords.usrCoords[2]) : 0), this.normalize();
  }, updateRenderer: function() {
    return this.needsUpdate ? (this.visPropCalc.visible && (this.isReal = !isNaN(this.center.coords.usrCoords[1] + this.center.coords.usrCoords[2] + this.Radius()) && this.center.isReal, this.isReal || this.updateVisibility(!1)), this.visPropCalc.visible && this.board.renderer.updateEllipse(this), this.hasLabel && this.visPropCalc.visible && this.label && this.label.visPropCalc.visible && this.isReal && (this.label.update(), this.board.renderer.updateText(this.label)), this.setDisplayRendNode(), this.needsUpdate = !1, this) : this;
  }, notifyParents: function(e) {
    a.Z.isString(e) && ae.Z.findDependencies(this, e, this.board);
  }, setRadius: function(e) {
    return this.updateRadius = a.Z.createFunction(e, this.board, null, !0), this.addParentsFromJCFunctions([this.updateRadius]), this.board.update(), this;
  }, Radius: function(e) {
    return a.Z.exists(e) ? (this.setRadius(e), this.Radius()) : this.method === "twoPoints" ? a.Z.cmpArrays(this.point2.coords.usrCoords, [0, 0, 0]) || a.Z.cmpArrays(this.center.coords.usrCoords, [0, 0, 0]) ? NaN : this.center.Dist(this.point2) : this.method === "pointLine" || this.method === "pointCircle" ? this.radius : this.method === "pointRadius" ? this.updateRadius() : NaN;
  }, getRadius: function() {
    return d.Z.deprecated("Circle.getRadius()", "Circle.Radius()"), this.Radius();
  }, getTextAnchor: function() {
    return this.center.coords;
  }, getLabelAnchor: function() {
    var e, t, o = this.Radius(), s = this.center.coords.usrCoords, n = 0.7071067811865;
    switch (a.Z.evaluate(this.visProp.label.position)) {
      case "lft":
        e = s[1] - o, t = s[2];
        break;
      case "llft":
        e = s[1] - n * o, t = s[2] - n * o;
        break;
      case "rt":
        e = s[1] + o, t = s[2];
        break;
      case "lrt":
        e = s[1] + n * o, t = s[2] - n * o;
        break;
      case "urt":
        e = s[1] + n * o, t = s[2] + n * o;
        break;
      case "top":
        e = s[1], t = s[2] + o;
        break;
      case "bot":
        e = s[1], t = s[2] - o;
        break;
      default:
        e = s[1] - n * o, t = s[2] + n * o;
    }
    return new b.Z(x.Z.COORDS_BY_USER, [e, t], this.board);
  }, cloneToBackground: function() {
    var e, t = this.Radius(), o = { id: this.id + "T" + this.numTraces, elementClass: x.Z.OBJECT_CLASS_CIRCLE, center: { coords: this.center.coords }, Radius: function() {
      return t;
    }, getRadius: function() {
      return t;
    }, board: this.board, visProp: a.Z.deepCopy(this.visProp, this.visProp.traceattributes, !0) };
    return o.visProp.layer = this.board.options.layer.trace, this.numTraces++, a.Z.clearVisPropOld(o), o.visPropCalc = { visible: a.Z.evaluate(o.visProp.visible) }, e = this.board.renderer.enhancedRendering, this.board.renderer.enhancedRendering = !0, this.board.renderer.drawEllipse(o), this.board.renderer.enhancedRendering = e, this.traces[o.id] = o.rendNode, this;
  }, addTransform: function(e) {
    var t, o = a.Z.isArray(e) ? e : [e], s = o.length;
    for (t = 0; t < s; t++)
      this.center.transformations.push(o[t]), this.method === "twoPoints" && this.point2.transformations.push(o[t]);
    return this;
  }, snapToGrid: function() {
    var e = a.Z.evaluate(this.visProp.snaptogrid);
    return this.center.handleSnapToGrid(e, !0), this.method === "twoPoints" && this.point2.handleSnapToGrid(e, !0), this;
  }, snapToPoints: function() {
    var e = a.Z.evaluate(this.visProp.snaptopoints);
    return this.center.handleSnapToPoints(e), this.method === "twoPoints" && this.point2.handleSnapToPoints(e), this;
  }, X: function(e) {
    return this.Radius() * Math.cos(2 * e * Math.PI) + this.center.coords.usrCoords[1];
  }, Y: function(e) {
    return this.Radius() * Math.sin(2 * e * Math.PI) + this.center.coords.usrCoords[2];
  }, Z: function(e) {
    return 1;
  }, minX: function() {
    return 0;
  }, maxX: function() {
    return 1;
  }, Area: function() {
    var e = this.Radius();
    return e * e * Math.PI;
  }, bounds: function() {
    var e = this.center.coords.usrCoords, t = this.Radius();
    return [e[1] - t, e[2] + t, e[1] + t, e[2] - t];
  }, getParents: function() {
    return this.parents.length === 1 ? this.parents.concat(this.radius) : this.parents;
  } }), d.Z.createCircle = function(e, t, o) {
    var s, n, h, l, p, u = ["center", "point2"];
    if (n = [], p = e.select(t[0]), a.Z.isObject(p) && p.elementClass === x.Z.OBJECT_CLASS_CIRCLE && a.Z.isTransformationOrArray(t[1]))
      return l = a.Z.copyAttributes(o, e.options, "circle"), (s = d.Z.createEllipse(e, [p.center, p.center, function() {
        return 2 * p.Radius();
      }], l)).addTransform(t[1]), s;
    for (h = 0; h < t.length; h++)
      if (a.Z.isPointType(e, t[h])) {
        if ((n = n.concat(a.Z.providePoints(e, [t[h]], o, "circle", [u[h]])))[n.length - 1] === !1)
          throw new Error("JSXGraph: Can't create circle from this type. Please provide a point type.");
      } else
        n.push(t[h]);
    if (l = a.Z.copyAttributes(o, e.options, "circle"), n.length === 2 && a.Z.isPoint(n[0]) && a.Z.isPoint(n[1]))
      s = new d.Z.Circle(e, "twoPoints", n[0], n[1], l);
    else if ((a.Z.isNumber(n[0]) || a.Z.isFunction(n[0]) || a.Z.isString(n[0])) && a.Z.isPoint(n[1]))
      s = new d.Z.Circle(e, "pointRadius", n[1], n[0], l);
    else if ((a.Z.isNumber(n[1]) || a.Z.isFunction(n[1]) || a.Z.isString(n[1])) && a.Z.isPoint(n[0]))
      s = new d.Z.Circle(e, "pointRadius", n[0], n[1], l);
    else if (n[0].elementClass === x.Z.OBJECT_CLASS_CIRCLE && a.Z.isPoint(n[1]))
      s = new d.Z.Circle(e, "pointCircle", n[1], n[0], l);
    else if (n[1].elementClass === x.Z.OBJECT_CLASS_CIRCLE && a.Z.isPoint(n[0]))
      s = new d.Z.Circle(e, "pointCircle", n[0], n[1], l);
    else if (n[0].elementClass === x.Z.OBJECT_CLASS_LINE && a.Z.isPoint(n[1]))
      s = new d.Z.Circle(e, "pointLine", n[1], n[0], l);
    else if (n[1].elementClass === x.Z.OBJECT_CLASS_LINE && a.Z.isPoint(n[0]))
      s = new d.Z.Circle(e, "pointLine", n[0], n[1], l);
    else {
      if (!(t.length === 3 && a.Z.isPoint(n[0]) && a.Z.isPoint(n[1]) && a.Z.isPoint(n[2])))
        throw new Error("JSXGraph: Can't create circle with parent types '" + typeof t[0] + "' and '" + typeof t[1] + `'.
Possible parent types: [point,point], [point,number], [point,function], [point,circle], [point,point,point], [circle,transformation]`);
      if (!d.Z.elements.circumcircle)
        throw new Error("JSXGraph: Can't create circle with three points. Please include the circumcircle element (element/composition).");
      s = d.Z.elements.circumcircle(e, n, l);
    }
    for (s.isDraggable = !0, s.setParents(n), s.elType = "circle", h = 0; h < n.length; h++)
      a.Z.isPoint(n[h]) && s.inherits.push(n[h]);
    return s;
  }, d.Z.registerElement("circle", d.Z.createCircle);
  const ut = d.Z.Circle;
  d.Z.createEllipse = function(e, t, o) {
    var s, n, h, l, p, u, v, Z = [], y = a.Z.copyAttributes(o, e.options, "conic", "foci"), O = a.Z.copyAttributes(o, e.options, "conic", "center"), S = a.Z.copyAttributes(o, e.options, "conic");
    for (u = 0; u < 2; u++)
      if (t[u].length > 1)
        Z[u] = e.create("point", t[u], y);
      else if (a.Z.isPoint(t[u]))
        Z[u] = e.select(t[u]);
      else if (a.Z.isFunction(t[u]) && a.Z.isPoint(t[u]()))
        Z[u] = t[u]();
      else {
        if (!a.Z.isString(t[u]))
          throw new Error("JSXGraph: Can't create Ellipse with parent types '" + typeof t[0] + "' and '" + typeof t[1] + `'.
Possible parent types: [point,point,point], [point,point,number|function]`);
        Z[u] = e.select(t[u]);
      }
    if (a.Z.isNumber(t[2]))
      p = a.Z.createFunction(t[2], e);
    else if (a.Z.isFunction(t[2]) && a.Z.isNumber(t[2]()))
      p = t[2];
    else {
      if (a.Z.isPoint(t[2]))
        l = e.select(t[2]);
      else if (t[2].length > 1)
        l = e.create("point", t[2], y);
      else if (a.Z.isFunction(t[2]) && a.Z.isPoint(t[2]()))
        l = t[2]();
      else {
        if (!a.Z.isString(t[2]))
          throw new Error("JSXGraph: Can't create Ellipse with parent types '" + typeof t[0] + "' and '" + typeof t[1] + "' and '" + typeof t[2] + `'.
Possible parent types: [point,point,point], [point,point,number|function]`);
        l = e.select(t[2]);
      }
      p = function() {
        return l.Dist(Z[0]) + l.Dist(Z[1]);
      };
    }
    for (a.Z.exists(t[4]) || (t[4] = 2 * Math.PI), a.Z.exists(t[3]) || (t[3] = 0), h = e.create("point", [function() {
      return 0.5 * (Z[0].X() + Z[1].X());
    }, function() {
      return 0.5 * (Z[0].Y() + Z[1].Y());
    }], O), (n = e.create("curve", [function(R) {
      return 0;
    }, function(R) {
      return 0;
    }, t[3], t[4]], S)).majorAxis = p, v = n.hasPoint, s = function(R, L) {
      var B, X, F, G, W, H, q, oe, ee;
      L || (X = (B = p()) * B, F = Z[0].X(), G = Z[0].Y(), q = F - (W = Z[1].X()), oe = G - (H = Z[1].Y()), ee = (X - F * F - G * G + W * W + H * H) / (2 * B), n.quadraticform = [[ee * ee - W * W - H * H, ee * q / B + W, ee * oe / B + H], [ee * q / B + W, q * q / X - 1, q * oe / X], [ee * oe / B + H, q * oe / X, oe * oe / X - 1]]);
    }, n.X = function(R, L) {
      var B = p(), X = Z[1].Dist(Z[0]), F = 0.5 * (X * X - B * B) / (X * Math.cos(R) - B), G = Math.atan2(Z[1].Y() - Z[0].Y(), Z[1].X() - Z[0].X());
      return L || s(0, L), Z[0].X() + Math.cos(G + R) * F;
    }, n.Y = function(R, L) {
      var B = p(), X = Z[1].Dist(Z[0]), F = 0.5 * (X * X - B * B) / (X * Math.cos(R) - B), G = Math.atan2(Z[1].Y() - Z[0].Y(), Z[1].X() - Z[0].X());
      return Z[0].Y() + Math.sin(G + R) * F;
    }, n.midpoint = n.center = h, n.type = x.Z.OBJECT_TYPE_CONIC, n.subs = { center: n.center }, n.inherits.push(n.center, Z[0], Z[1]), a.Z.isPoint(l) && n.inherits.push(l), n.hasPoint = function(R, L) {
      var B, X, F, G;
      return a.Z.evaluate(this.visProp.hasinnerpoints) ? (B = Z[0].coords, X = Z[1].coords, F = this.majorAxis(), (G = new b.Z(x.Z.COORDS_BY_SCREEN, [R, L], this.board)).distance(x.Z.COORDS_BY_USER, B) + G.distance(x.Z.COORDS_BY_USER, X) <= F) : v.apply(this, arguments);
    }, h.addChild(n), u = 0; u < 2; u++)
      a.Z.isPoint(Z[u]) && Z[u].addChild(n);
    return a.Z.isPoint(l) && l.addChild(n), n.setParents(t), n;
  }, d.Z.createHyperbola = function(e, t, o) {
    var s, n, h, l, p, u, v = [], Z = a.Z.copyAttributes(o, e.options, "conic", "foci"), y = a.Z.copyAttributes(o, e.options, "conic", "center"), O = a.Z.copyAttributes(o, e.options, "conic");
    for (u = 0; u < 2; u++)
      if (t[u].length > 1)
        v[u] = e.create("point", t[u], Z);
      else if (a.Z.isPoint(t[u]))
        v[u] = e.select(t[u]);
      else if (a.Z.isFunction(t[u]) && a.Z.isPoint(t[u]()))
        v[u] = t[u]();
      else {
        if (!a.Z.isString(t[u]))
          throw new Error("JSXGraph: Can't create Hyperbola with parent types '" + typeof t[0] + "' and '" + typeof t[1] + `'.
Possible parent types: [point,point,point], [point,point,number|function]`);
        v[u] = e.select(t[u]);
      }
    if (a.Z.isNumber(t[2]))
      p = a.Z.createFunction(t[2], e);
    else if (a.Z.isFunction(t[2]) && a.Z.isNumber(t[2]()))
      p = t[2];
    else {
      if (a.Z.isPoint(t[2]))
        l = e.select(t[2]);
      else if (t[2].length > 1)
        l = e.create("point", t[2], Z);
      else if (a.Z.isFunction(t[2]) && a.Z.isPoint(t[2]()))
        l = t[2]();
      else {
        if (!a.Z.isString(t[2]))
          throw new Error("JSXGraph: Can't create Hyperbola with parent types '" + typeof t[0] + "' and '" + typeof t[1] + "' and '" + typeof t[2] + `'.
Possible parent types: [point,point,point], [point,point,number|function]`);
        l = e.select(t[2]);
      }
      p = function() {
        return l.Dist(v[0]) - l.Dist(v[1]);
      };
    }
    for (a.Z.exists(t[4]) || (t[4] = 1.0001 * Math.PI), a.Z.exists(t[3]) || (t[3] = -1.0001 * Math.PI), h = e.create("point", [function() {
      return 0.5 * (v[0].X() + v[1].X());
    }, function() {
      return 0.5 * (v[0].Y() + v[1].Y());
    }], y), (n = e.create("curve", [function(S) {
      return 0;
    }, function(S) {
      return 0;
    }, t[3], t[4]], O)).majorAxis = p, s = function(S, R) {
      var L, B, X, F, G, W, H, q, oe;
      R || (B = (L = p()) * L, X = v[0].X(), F = v[0].Y(), H = X - (G = v[1].X()), q = F - (W = v[1].Y()), oe = (B - X * X - F * F + G * G + W * W) / (2 * L), n.quadraticform = [[oe * oe - G * G - W * W, oe * H / L + G, oe * q / L + W], [oe * H / L + G, H * H / B - 1, H * q / B], [oe * q / L + W, H * q / B, q * q / B - 1]]);
    }, n.X = function(S, R) {
      var L = p(), B = v[1].Dist(v[0]), X = 0.5 * (B * B - L * L) / (B * Math.cos(S) + L), F = Math.atan2(v[1].Y() - v[0].Y(), v[1].X() - v[0].X());
      return R || s(0, R), v[0].X() + Math.cos(F + S) * X;
    }, n.Y = function(S, R) {
      var L = p(), B = v[1].Dist(v[0]), X = 0.5 * (B * B - L * L) / (B * Math.cos(S) + L), F = Math.atan2(v[1].Y() - v[0].Y(), v[1].X() - v[0].X());
      return v[0].Y() + Math.sin(F + S) * X;
    }, n.midpoint = n.center = h, n.subs = { center: n.center }, n.inherits.push(n.center, v[0], v[1]), a.Z.isPoint(l) && n.inherits.push(l), n.type = x.Z.OBJECT_TYPE_CONIC, h.addChild(n), u = 0; u < 2; u++)
      a.Z.isPoint(v[u]) && v[u].addChild(n);
    return a.Z.isPoint(l) && l.addChild(n), n.setParents(t), n;
  }, d.Z.createParabola = function(e, t, o) {
    var s, n, h, l, p = t[0], u = t[1], v = a.Z.copyAttributes(o, e.options, "conic", "foci"), Z = a.Z.copyAttributes(o, e.options, "conic", "center"), y = a.Z.copyAttributes(o, e.options, "conic");
    if (t[0].length > 1)
      p = e.create("point", t[0], v);
    else if (a.Z.isPoint(t[0]))
      p = e.select(t[0]);
    else if (a.Z.isFunction(t[0]) && a.Z.isPoint(t[0]()))
      p = t[0]();
    else {
      if (!a.Z.isString(t[0]))
        throw new Error("JSXGraph: Can't create Parabola with parent types '" + typeof t[0] + "' and '" + typeof t[1] + `'.
Possible parent types: [point,line]`);
      p = e.select(t[0]);
    }
    return a.Z.isArray(u) && u.length === 2 && (l = a.Z.copyAttributes(o, e.options, "conic", "line"), u = e.create("line", u, l)), a.Z.exists(t[3]) || (t[3] = 2 * Math.PI), a.Z.exists(t[2]) || (t[2] = 0), h = e.create("point", [function() {
      return _.Z.projectPointToLine(p, u, e).usrCoords;
    }], Z), (n = e.create("curve", [function(O) {
      return 0;
    }, function(O) {
      return 0;
    }, t[2], t[3]], y)).midpoint = n.center = h, n.subs = { center: n.center }, n.inherits.push(n.center), s = function(O, S) {
      var R, L, B, X, F, G;
      S || (R = u.stdform[1], L = u.stdform[2], B = u.stdform[0], X = R * R + L * L, F = p.X(), G = p.Y(), n.quadraticform = [[B * B - X * (F * F + G * G), B * R + X * F, B * L + X * G], [B * R + X * F, -L * L, R * L], [B * L + X * G, R * L, -R * R]]);
    }, n.X = function(O, S) {
      var R, L = u.getAngle(), B = _.Z.distPointLine(p.coords.usrCoords, u.stdform), X = u.point1.coords.usrCoords, F = u.point2.coords.usrCoords, G = p.coords.usrCoords;
      return X[0] === 0 ? X = [1, F[1] + u.stdform[2], F[2] - u.stdform[1]] : F[0] === 0 && (F = [1, X[1] + u.stdform[2], X[2] - u.stdform[1]]), R = ((F[1] - X[1]) * (G[2] - X[2]) - (F[2] - X[2]) * (G[1] - X[1]) >= 0 ? 1 : -1) * B / (1 - Math.sin(O)), S || s(0, S), p.X() + Math.cos(O + L) * R;
    }, n.Y = function(O, S) {
      var R, L = u.getAngle(), B = _.Z.distPointLine(p.coords.usrCoords, u.stdform), X = u.point1.coords.usrCoords, F = u.point2.coords.usrCoords, G = p.coords.usrCoords;
      return X[0] === 0 ? X = [1, F[1] + u.stdform[2], F[2] - u.stdform[1]] : F[0] === 0 && (F = [1, X[1] + u.stdform[2], X[2] - u.stdform[1]]), R = ((F[1] - X[1]) * (G[2] - X[2]) - (F[2] - X[2]) * (G[1] - X[1]) >= 0 ? 1 : -1) * B / (1 - Math.sin(O)), p.Y() + Math.sin(O + L) * R;
    }, n.type = x.Z.OBJECT_TYPE_CONIC, h.addChild(n), a.Z.isPoint(p) && (p.addChild(n), n.inherits.push(p)), u.addChild(n), n.setParents(t), n;
  }, d.Z.createConic = function(e, t, o) {
    var s, n, h, l, p, u, v, Z, y, O, S, R, L, B, X = [[1, 0, 0], [0, 1, 0], [0, 0, 1]], F = [[1, 0, 0], [0, 1, 0], [0, 0, 1]], G = [], W = [], H = a.Z.copyAttributes(o, e.options, "conic", "point"), q = a.Z.copyAttributes(o, e.options, "conic", "center"), oe = a.Z.copyAttributes(o, e.options, "conic");
    if (t.length === 5)
      B = !0;
    else {
      if (t.length !== 6)
        throw new Error("JSXGraph: Can't create generic Conic with " + t.length + " parameters.");
      B = !1;
    }
    if (B)
      for (R = 0; R < 5; R++)
        if (t[R].length > 1)
          G[R] = e.create("point", t[R], H);
        else if (a.Z.isPoint(t[R]))
          G[R] = e.select(t[R]);
        else if (a.Z.isFunction(t[R]) && a.Z.isPoint(t[R]()))
          G[R] = t[R]();
        else {
          if (!a.Z.isString(t[R]))
            throw new Error("JSXGraph: Can't create Conic section with parent types '" + typeof t[R] + `'.
Possible parent types: [point,point,point,point,point], [a00,a11,a22,a01,a02,a12]`);
          G[R] = e.select(t[R]);
        }
    else
      (L = [[0, 0, 0], [0, 0, 0], [0, 0, 0]])[0][0] = a.Z.isFunction(t[2]) ? function() {
        return t[2]();
      } : function() {
        return t[2];
      }, L[0][1] = a.Z.isFunction(t[4]) ? function() {
        return t[4]();
      } : function() {
        return t[4];
      }, L[0][2] = a.Z.isFunction(t[5]) ? function() {
        return t[5]();
      } : function() {
        return t[5];
      }, L[1][1] = a.Z.isFunction(t[0]) ? function() {
        return t[0]();
      } : function() {
        return t[0];
      }, L[1][2] = a.Z.isFunction(t[3]) ? function() {
        return t[3]();
      } : function() {
        return t[3];
      }, L[2][2] = a.Z.isFunction(t[1]) ? function() {
        return t[1]();
      } : function() {
        return t[1];
      };
    if (p = function(ee) {
      var he, re;
      for (he = 0; he < 3; he++)
        for (re = he; re < 3; re++)
          ee[he][re] += ee[re][he];
      for (he = 0; he < 3; he++)
        for (re = 0; re < he; re++)
          ee[he][re] = ee[re][he];
      return ee;
    }, l = function(ee, he) {
      var re, _e, ge = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
      for (re = 0; re < 3; re++)
        for (_e = 0; _e < 3; _e++)
          ge[re][_e] = ee[re] * he[_e];
      return p(ge);
    }, h = function(ee, he, re) {
      var _e, ge, we, Ne, Le, Ue = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
      for (Le = k.Z.matVecMult(he, re), we = k.Z.innerProduct(re, Le), Le = k.Z.matVecMult(ee, re), Ne = k.Z.innerProduct(re, Le), _e = 0; _e < 3; _e++)
        for (ge = 0; ge < 3; ge++)
          Ue[_e][ge] = we * ee[_e][ge] - Ne * he[_e][ge];
      return Ue;
    }, n = e.create("curve", [function(ee) {
      return 0;
    }, function(ee) {
      return 0;
    }, 0, 2 * Math.PI], oe), s = function(ee, he) {
      var re, _e, ge, we;
      if (!he) {
        if (B) {
          for (re = 0; re < 5; re++)
            W[re] = G[re].coords.usrCoords;
          O = l(k.Z.crossProduct(W[0], W[1]), k.Z.crossProduct(W[2], W[3])), S = l(k.Z.crossProduct(W[0], W[2]), k.Z.crossProduct(W[1], W[3])), F = h(O, S, W[4]);
        } else
          for (re = 0; re < 3; re++)
            for (_e = re; _e < 3; _e++)
              F[re][_e] = L[re][_e](), _e > re && (F[_e][re] = F[re][_e]);
        for (n.quadraticform = F, (u = c.Z.Jacobi(F))[0][0][0] < 0 && (u[0][0][0] *= -1, u[0][1][1] *= -1, u[0][2][2] *= -1), re = 0; re < 3; re++) {
          for (ge = 0, _e = 0; _e < 3; _e++)
            ge += u[1][_e][re] * u[1][_e][re];
          ge = Math.sqrt(ge);
        }
        X = u[1], y = Math.sqrt(Math.abs(u[0][0][0])), v = Math.sqrt(Math.abs(u[0][1][1])), Z = Math.sqrt(Math.abs(u[0][2][2]));
      }
      return u[0][1][1] <= 0 && u[0][2][2] <= 0 ? we = k.Z.matVecMult(X, [1 / y, Math.cos(ee) / v, Math.sin(ee) / Z]) : u[0][1][1] <= 0 && u[0][2][2] > 0 ? we = k.Z.matVecMult(X, [Math.cos(ee) / y, 1 / v, Math.sin(ee) / Z]) : u[0][2][2] < 0 && (we = k.Z.matVecMult(X, [Math.sin(ee) / y, Math.cos(ee) / v, 1 / Z])), a.Z.exists(we) ? (we[1] /= we[0], we[2] /= we[0], we[0] = 1) : we = [1, NaN, NaN], we;
    }, n.X = function(ee, he) {
      return s(ee, he)[1];
    }, n.Y = function(ee, he) {
      return s(ee, he)[2];
    }, n.midpoint = e.create("point", [function() {
      var ee = n.quadraticform;
      return [ee[1][1] * ee[2][2] - ee[1][2] * ee[1][2], ee[1][2] * ee[0][2] - ee[2][2] * ee[0][1], ee[0][1] * ee[1][2] - ee[1][1] * ee[0][2]];
    }], q), n.type = x.Z.OBJECT_TYPE_CONIC, n.center = n.midpoint, n.subs = { center: n.center }, n.inherits.push(n.center), n.inherits = n.inherits.concat(G), B) {
      for (R = 0; R < 5; R++)
        a.Z.isPoint(G[R]) && G[R].addChild(n);
      n.setParents(t);
    }
    return n.addChild(n.center), n;
  }, d.Z.registerElement("ellipse", d.Z.createEllipse), d.Z.registerElement("hyperbola", d.Z.createHyperbola), d.Z.registerElement("parabola", d.Z.createParabola), d.Z.registerElement("conic", d.Z.createConic), d.Z.Polygon = function(e, t, o) {
    this.constructor(e, o, x.Z.OBJECT_TYPE_POLYGON, x.Z.OBJECT_CLASS_AREA);
    var s, n, h, l, p, u = a.Z.copyAttributes(o, e.options, "polygon", "borders");
    for (this.withLines = o.withlines, this.attr_line = u, this.vertices = [], s = 0; s < t.length; s++)
      this.vertices[s] = this.board.select(t[s]), this.vertices[s]._is_new && (delete this.vertices[s]._is_new, this.vertices[s]._is_new_pol = !0);
    if (this.vertices.length > 0 && this.vertices[this.vertices.length - 1].id !== this.vertices[0].id && this.vertices.push(this.vertices[0]), this.borders = [], this.withLines)
      for (h = this.vertices.length - 1, l = 0; l < h; l++)
        s = (l + 1) % h, u.id = u.ids && u.ids[s], u.name = u.names && u.names[s], u.strokecolor = a.Z.isArray(u.colors) && u.colors[s % u.colors.length] || u.strokecolor, u.visible = a.Z.exists(o.borders.visible) ? o.borders.visible : o.visible, u.strokecolor === !1 && (u.strokecolor = "none"), (n = e.create("segment", [this.vertices[s], this.vertices[s + 1]], u)).dump = !1, this.borders[s] = n, n.parentPolygon = this;
    for (this.inherits.push(this.vertices, this.borders), this.id = this.board.setId(this, "Py"), s = 0; s < this.vertices.length - 1; s++)
      p = this.board.select(this.vertices[s]), a.Z.exists(p._is_new_pol) ? (this.addChild(p), delete p._is_new_pol) : p.addChild(this);
    this.board.renderer.drawPolygon(this), this.board.finalizeAdding(this), this.createGradient(), this.elType = "polygon", this.createLabel(), this.methodMap = d.Z.deepCopy(this.methodMap, { borders: "borders", vertices: "vertices", A: "Area", Area: "Area", Perimeter: "Perimeter", L: "Perimeter", Length: "Perimeter", boundingBox: "boundingBox", bounds: "bounds", addPoints: "addPoints", insertPoints: "insertPoints", removePoints: "removePoints" });
  }, d.Z.Polygon.prototype = new Je.Z(), d.Z.extend(d.Z.Polygon.prototype, { pnpoly: function(e, t, o) {
    return _.Z.pnpoly(e, t, this.vertices, o);
  }, hasPoint: function(e, t) {
    var o, s;
    if (a.Z.evaluate(this.visProp.hasinnerpoints) && this.pnpoly(e, t))
      return !0;
    for (s = this.borders.length, o = 0; o < s; o++)
      if (this.borders[o].hasPoint(e, t))
        return !0;
    return !1;
  }, updateRenderer: function() {
    var e, t;
    if (!this.needsUpdate)
      return this;
    if (this.visPropCalc.visible) {
      for (t = this.vertices.length, this.isReal = !0, e = 0; e < t; ++e)
        if (!this.vertices[e].isReal) {
          this.isReal = !1;
          break;
        }
      this.isReal || this.updateVisibility(!1);
    }
    return this.visPropCalc.visible && this.board.renderer.updatePolygon(this), this.hasLabel && this.visPropCalc.visible && this.label && this.label.visPropCalc.visible && this.isReal && (this.label.update(), this.board.renderer.updateText(this.label)), this.setDisplayRendNode(), this.needsUpdate = !1, this;
  }, getTextAnchor: function() {
    var e, t, o, s, n;
    if (this.vertices.length === 0)
      return new b.Z(x.Z.COORDS_BY_USER, [1, 0, 0], this.board);
    for (o = e = this.vertices[0].X(), s = t = this.vertices[0].Y(), n = 0; n < this.vertices.length; n++)
      this.vertices[n].X() < e && (e = this.vertices[n].X()), this.vertices[n].X() > o && (o = this.vertices[n].X()), this.vertices[n].Y() > t && (t = this.vertices[n].Y()), this.vertices[n].Y() < s && (s = this.vertices[n].Y());
    return new b.Z(x.Z.COORDS_BY_USER, [0.5 * (e + o), 0.5 * (t + s)], this.board);
  }, getLabelAnchor: d.Z.shortcut(d.Z.Polygon.prototype, "getTextAnchor"), cloneToBackground: function() {
    var e, t = {};
    return t.id = this.id + "T" + this.numTraces, this.numTraces++, t.vertices = this.vertices, t.visProp = a.Z.deepCopy(this.visProp, this.visProp.traceattributes, !0), t.visProp.layer = this.board.options.layer.trace, t.board = this.board, a.Z.clearVisPropOld(t), t.visPropCalc = { visible: a.Z.evaluate(t.visProp.visible) }, e = this.board.renderer.enhancedRendering, this.board.renderer.enhancedRendering = !0, this.board.renderer.drawPolygon(t), this.board.renderer.enhancedRendering = e, this.traces[t.id] = t.rendNode, this;
  }, hideElement: function(e) {
    var t;
    if (d.Z.deprecated("Element.hideElement()", "Element.setDisplayRendNode()"), this.visPropCalc.visible = !1, this.board.renderer.display(this, !1), !e)
      for (t = 0; t < this.borders.length; t++)
        this.borders[t].hideElement();
    this.hasLabel && a.Z.exists(this.label) && (this.label.hiddenByParent = !0, this.label.visPropCalc.visible && this.label.hideElement());
  }, showElement: function(e) {
    var t;
    if (d.Z.deprecated("Element.showElement()", "Element.setDisplayRendNode()"), this.visPropCalc.visible = !0, this.board.renderer.display(this, !0), !e)
      for (t = 0; t < this.borders.length; t++)
        this.borders[t].showElement().updateRenderer();
    return a.Z.exists(this.label) && this.hasLabel && this.label.hiddenByParent && (this.label.hiddenByParent = !1, this.label.visPropCalc.visible || this.label.showElement().updateRenderer()), this;
  }, Area: function() {
    return Math.abs(_.Z.signedPolygon(this.vertices, !0));
  }, Perimeter: function() {
    var e, t = this.vertices.length, o = 0;
    for (e = 1; e < t; ++e)
      o += this.vertices[e].Dist(this.vertices[e - 1]);
    return o;
  }, boundingBox: function() {
    var e, t, o = [0, 0, 0, 0], s = this.vertices.length - 1;
    if (s === 0)
      return o;
    for (o[0] = this.vertices[0].X(), o[2] = o[0], o[1] = this.vertices[0].Y(), o[3] = o[1], e = 1; e < s; ++e)
      (t = this.vertices[e].X()) < o[0] ? o[0] = t : t > o[2] && (o[2] = t), (t = this.vertices[e].Y()) > o[1] ? o[1] = t : t < o[3] && (o[3] = t);
    return o;
  }, bounds: function() {
    return this.boundingBox();
  }, remove: function() {
    var e;
    for (e = 0; e < this.borders.length; e++)
      this.board.removeObject(this.borders[e]);
    Je.Z.prototype.remove.call(this);
  }, findPoint: function(e) {
    var t;
    if (!a.Z.isPoint(e))
      return -1;
    for (t = 0; t < this.vertices.length; t++)
      if (this.vertices[t].id === e.id)
        return t;
    return -1;
  }, addPoints: function(e) {
    var t, o = Array.prototype.slice.call(arguments);
    return t = this.elType === "polygonalchain" ? this.vertices.length - 1 : this.vertices.length - 2, this.insertPoints.apply(this, [t].concat(o));
  }, insertPoints: function(e, t) {
    var o, s, n, h, l;
    if (arguments.length === 0)
      return this;
    if (n = this.vertices.length - 1, this.elType === "polygon" && n--, e < -1 || e > n)
      return this;
    for (s = arguments.length - 1, o = 1; o < s + 1; o++)
      (l = a.Z.providePoints(this.board, [arguments[o]], {}, "polygon", ["vertices"])[0])._is_new && (this.addChild(l), delete l._is_new), this.vertices.splice(e + o, 0, l);
    if (this.withLines)
      for (h = e + 1, this.elType === "polygon" ? e < 0 ? (this.vertices[this.vertices.length - 1] = this.vertices[0], this.borders[this.borders.length - 1].point2 = this.vertices[this.vertices.length - 1]) : this.borders[e].point2 = this.vertices[h] : e >= 0 && (e < this.borders.length ? this.borders[e].point2 = this.vertices[h] : h = e), o = h; o < h + s; o++)
        this.borders.splice(o, 0, this.board.create("segment", [this.vertices[o], this.vertices[o + 1]], this.attr_line));
    return this.inherits = [], this.inherits.push(this.vertices, this.borders), this.board.update(), this;
  }, removePoints: function(e) {
    var t, o, s, n, h = [], l = [], p = [], u = [];
    for (this.elType === "polygon" && (n = this.vertices.pop()), t = 0; t < arguments.length; t++)
      s = arguments[t], a.Z.isPoint(s) && (s = this.findPoint(s)), a.Z.isNumber(s) && s > -1 && s < this.vertices.length && a.Z.indexOf(p, s) === -1 && p.push(s);
    if (p.length === 0)
      return this.elType === "polygon" && this.vertices.push(n), this;
    for (t = 0; t < p.length; t++)
      this.vertices[p[t]].removeChild(this);
    for (p = p.sort(), h = this.vertices.slice(), l = this.borders.slice(), this.withLines && u.push([p[p.length - 1]]), t = p.length - 1; t > -1; t--)
      h[p[t]] = -1, this.withLines && p.length > 1 && p[t] - 1 > p[t - 1] && (u[u.length - 1][1] = p[t], u.push([p[t - 1]]));
    for (this.withLines && (u[u.length - 1][1] = p[0]), this.vertices = [], t = 0; t < h.length; t++)
      a.Z.isPoint(h[t]) && this.vertices.push(h[t]);
    if (this.elType === "polygon" && this.vertices.length > 1 && this.vertices[this.vertices.length - 1].id !== this.vertices[0].id && this.vertices.push(this.vertices[0]), this.withLines) {
      for (t = 0; t < u.length; t++) {
        for (o = u[t][1] - 1; o < u[t][0] + 1; o++)
          o < 0 ? this.elType === "polygon" && (this.board.removeObject(this.borders[l.length - 1]), l[l.length - 1] = -1) : o < l.length && (this.board.removeObject(this.borders[o]), l[o] = -1);
        u[t][1] !== 0 && u[t][0] !== h.length - 1 && (l[u[t][0] - 1] = this.board.create("segment", [h[u[t][1] - 1], h[u[t][0] + 1]], this.attr_line));
      }
      for (this.borders = [], t = 0; t < l.length; t++)
        l[t] !== -1 && this.borders.push(l[t]);
      this.elType === "polygon" && this.vertices.length > 2 && (u[0][1] === this.vertices.length - 1 || u[u.length - 1][1] === 0) && this.borders.push(this.board.create("segment", [this.vertices[this.vertices.length - 2], this.vertices[0]], this.attr_line));
    }
    return this.inherits = [], this.inherits.push(this.vertices, this.borders), this.board.update(), this;
  }, getParents: function() {
    return this.setParents(this.vertices), this.parents;
  }, getAttributes: function() {
    var e, t = Je.Z.prototype.getAttributes.call(this);
    if (this.withLines)
      for (t.lines = t.lines || {}, t.lines.ids = [], t.lines.colors = [], e = 0; e < this.borders.length; e++)
        t.lines.ids.push(this.borders[e].id), t.lines.colors.push(this.borders[e].visProp.strokecolor);
    return t;
  }, snapToGrid: function() {
    var e, t;
    for (t = !!a.Z.evaluate(this.visProp.snaptogrid), e = 0; e < this.vertices.length; e++)
      this.vertices[e].handleSnapToGrid(t, !0);
  }, setPositionDirectly: function(e, t, o) {
    var s, n, h, l = new b.Z(e, t, this.board), p = new b.Z(e, o, this.board);
    for (h = this.vertices.length - 1, n = 0; n < h; n++)
      if (!this.vertices[n].draggable())
        return this;
    return s = m.Z.subtract(l.usrCoords, p.usrCoords), this.board.create("transform", s.slice(1), { type: "translate" }).applyOnce(this.vertices.slice(0, -1)), this;
  }, sutherlandHodgman: function(e) {
    var t, o, s, n, h, l, p, u = d.Z.Math.Geometry.sortVertices(this.vertices), v = d.Z.Math.Geometry.sortVertices(e.vertices), Z = u.length - 1, y = v.length - 1, O = [], S = function(R, L, B) {
      return (L[1] - R[1]) * (B[2] - R[2]) - (L[2] - R[2]) * (B[1] - R[1]) >= 0;
    };
    for (s = 0; s < y; s++)
      O.push(v[s]);
    for (s = 0; s < Z; s++)
      for (o = O.slice(0), O = [], h = o[(t = o.length) - 1], n = 0; n < t; n++)
        l = o[n], S(u[s], u[s + 1], l) ? (S(u[s], u[s + 1], h) || ((p = d.Z.Math.Geometry.meetSegmentSegment(h, l, u[s], u[s + 1]))[0][1] /= p[0][0], p[0][2] /= p[0][0], p[0][0] = 1, O.push(p[0])), O.push(l)) : S(u[s], u[s + 1], h) && ((p = d.Z.Math.Geometry.meetSegmentSegment(h, l, u[s], u[s + 1]))[0][1] /= p[0][0], p[0][2] /= p[0][0], p[0][0] = 1, O.push(p[0])), h = l;
    return O;
  }, intersect: function(e) {
    return this.sutherlandHodgman(e);
  } }), d.Z.createPolygon = function(e, t, o) {
    var s, n, h, l, p, u, v = [], Z = !1;
    if (a.Z.copyAttributes(o, e.options, "polygon"), (l = e.select(t[0])) === null && (l = t[0]), a.Z.isObject(l) && l.type === x.Z.OBJECT_TYPE_POLYGON && a.Z.isTransformationOrArray(t[1]))
      for (Z = !0, h = l.vertices.length - 1, u = a.Z.copyAttributes(o, e.options, "polygon", "vertices"), n = 0; n < h; n++)
        u.withlabel && (u.name = l.vertices[n].name === "" ? "" : l.vertices[n].name + "'"), v.push(e.create("point", [l.vertices[n], t[1]], u));
    else if ((v = a.Z.providePoints(e, t, o, "polygon", ["vertices"])) === !1)
      throw new Error("JSXGraph: Can't create polygon / polygonalchain with parent types other than 'point' and 'coordinate arrays' or a function returning an array of coordinates. Alternatively, a polygon and a transformation can be supplied");
    if (p = a.Z.copyAttributes(o, e.options, "polygon"), (s = new d.Z.Polygon(e, v, p)).isDraggable = !0, Z)
      for (s.prepareUpdate().update().updateVisibility().updateRenderer(), h = l.vertices.length - 1, n = 0; n < h; n++)
        v[n].prepareUpdate().update().updateVisibility().updateRenderer();
    return s;
  }, d.Z.createRegularPolygon = function(e, t, o) {
    var s, n, h, l, p, u, v, Z = [];
    if (h = t[(p = t.length) - 1], a.Z.isNumber(h) && (t.length !== 3 || h < 3))
      throw new Error("JSXGraph: A regular polygon needs two point types and a number > 2 as input.");
    if (a.Z.isNumber(e.select(h)) ? (p--, u = !1) : (h = p, u = !0), (Z = a.Z.providePoints(e, t.slice(0, p), o, "regularpolygon", ["vertices"])) === !1)
      throw new Error("JSXGraph: Can't create regular polygon with parent types other than 'point' and 'coordinate arrays' or a function returning an array of coordinates");
    for (v = a.Z.copyAttributes(o, e.options, "regularpolygon", "vertices"), n = 2; n < h; n++)
      l = e.create("transform", [Math.PI * (2 - (h - 2) / h), Z[n - 1]], { type: "rotate" }), u ? (Z[n].addTransform(Z[n - 2], l), Z[n].fullUpdate()) : (a.Z.isArray(v.ids) && v.ids.length >= h - 2 && (v.id = v.ids[n - 2]), Z[n] = e.create("point", [Z[n - 2], l], v), Z[n].type = x.Z.OBJECT_TYPE_CAS, Z[n].isDraggable = !0, Z[n].visProp.fixed = !1);
    return v = a.Z.copyAttributes(o, e.options, "regularpolygon"), (s = e.create("polygon", Z, v)).elType = "regularpolygon", s;
  }, d.Z.createPolygonalChain = function(e, t, o) {
    var s, n;
    return s = a.Z.copyAttributes(o, e.options, "polygonalchain"), (n = e.create("polygon", t, s)).elType = "polygonalchain", n.vertices.pop(), e.removeObject(n.borders[n.borders.length - 1]), n.borders.pop(), n;
  }, d.Z.registerElement("polygon", d.Z.createPolygon), d.Z.registerElement("regularpolygon", d.Z.createRegularPolygon), d.Z.registerElement("polygonalchain", d.Z.createPolygonalChain);
  const _t = d.Z.Polygon;
  d.Z.Curve = function(e, t, o) {
    this.constructor(e, o, x.Z.OBJECT_TYPE_CURVE, x.Z.OBJECT_CLASS_CURVE), this.points = [], this.numberPoints = a.Z.evaluate(this.visProp.numberpointshigh), this.bezierDegree = 1, this.dataX = null, this.dataY = null, this.ticks = [], this.qdt = null, a.Z.exists(t[0]) ? this.varname = t[0] : this.varname = "x", this.xterm = t[1], this.yterm = t[2], this.generateTerm(this.varname, this.xterm, this.yterm, t[3], t[4]), this.updateCurve(), this.id = this.board.setId(this, "G"), this.board.renderer.drawCurve(this), this.board.finalizeAdding(this), this.createGradient(), this.elType = "curve", this.createLabel(), a.Z.isString(this.xterm) && this.notifyParents(this.xterm), a.Z.isString(this.yterm) && this.notifyParents(this.yterm), this.methodMap = a.Z.deepCopy(this.methodMap, { generateTerm: "generateTerm", setTerm: "generateTerm", move: "moveTo", moveTo: "moveTo" });
  }, d.Z.Curve.prototype = new Je.Z(), d.Z.extend(d.Z.Curve.prototype, { minX: function() {
    return a.Z.evaluate(this.visProp.curvetype) === "polar" ? 0 : new b.Z(x.Z.COORDS_BY_SCREEN, [0.1 * -this.board.canvasWidth, 0], this.board, !1).usrCoords[1];
  }, maxX: function() {
    return a.Z.evaluate(this.visProp.curvetype) === "polar" ? 2 * Math.PI : new b.Z(x.Z.COORDS_BY_SCREEN, [1.1 * this.board.canvasWidth, 0], this.board, !1).usrCoords[1];
  }, X: function(e) {
    return NaN;
  }, Y: function(e) {
    return NaN;
  }, Z: function(e) {
    return 1;
  }, hasPoint: function(e, t, o) {
    var s, n, h, l, p, u, v, Z, y, O, S, R, L, B, X, F, G = [], W = a.Z.evaluate(this.visProp.numberpointslow), H = (this.maxX() - this.minX()) / W, q = 1 / 0;
    if (a.Z.isObject(a.Z.evaluate(this.visProp.precision)) ? (R = this.board._inputDevice, S = a.Z.evaluate(this.visProp.precision[R])) : S = this.board.options.precision.hasPoint, e = (n = new b.Z(x.Z.COORDS_BY_SCREEN, [e, t], this.board, !1)).usrCoords[1], t = n.usrCoords[2], this.bezierDegree === 1 && a.Z.evaluate(this.visProp.hasinnerpoints) && _.Z.windingNumber([1, e, t], this.points, !0) !== 0)
      return !0;
    if (S += 0.5 * a.Z.evaluate(this.visProp.strokewidth), S *= S, L = this.board.unitX * this.board.unitX, B = this.board.unitY * this.board.unitY, F = this.minX(), this.maxX(), a.Z.exists(this._visibleArea) && (F = this._visibleArea[0], H = (this._visibleArea[1] - F) / W), (X = a.Z.evaluate(this.visProp.curvetype)) === "parameter" || X === "polar")
      for (this.transformations.length > 0 && (this.updateTransformMatrix(), l = k.Z.inverse(this.transformMat), e = (p = k.Z.matVecMult(l, [1, e, t]))[1], t = p[2]), u = 0, s = F; u < W; u++) {
        if ((q = (e - (v = this.X(s, !0))) * (e - v) * L + (t - (Z = this.Y(s, !0))) * (t - Z) * B) <= S)
          return !0;
        s += H;
      }
    else if (X === "plot" || X === "functiongraph") {
      for ((!a.Z.exists(o) || o < 0) && (o = 0), a.Z.exists(this.qdt) && a.Z.evaluate(this.visProp.useqdt) && this.bezierDegree !== 3 ? h = (y = (O = this.qdt.query(new b.Z(x.Z.COORDS_BY_USER, [e, t], this.board))).points).length : (y = this.points, h = this.numberPoints - 1), u = o; u < h; u++)
        if (this.bezierDegree === 3 ? G = _.Z.projectCoordsToBeziersegment([1, e, t], this, u) : O ? (y[u].prev && (G = _.Z.projectCoordsToSegment([1, e, t], y[u].prev.usrCoords, y[u].usrCoords)), y[u].next && y[u + 1] !== y[u].next && (G = _.Z.projectCoordsToSegment([1, e, t], y[u].usrCoords, y[u].next.usrCoords))) : G = _.Z.projectCoordsToSegment([1, e, t], y[u].usrCoords, y[u + 1].usrCoords), G[1] >= 0 && G[1] <= 1 && (e - G[0][1]) * (e - G[0][1]) * L + (t - G[0][2]) * (t - G[0][2]) * B <= S)
          return !0;
      return !1;
    }
    return q < S;
  }, allocatePoints: function() {
    var e, t;
    if (t = this.numberPoints, this.points.length < this.numberPoints)
      for (e = this.points.length; e < t; e++)
        this.points[e] = new b.Z(x.Z.COORDS_BY_USER, [0, 0], this.board, !1);
  }, update: function() {
    return this.needsUpdate && (a.Z.evaluate(this.visProp.trace) && this.cloneToBackground(!0), this.updateCurve()), this;
  }, updateRenderer: function() {
    return this.needsUpdate ? (this.visPropCalc.visible && (this.isReal = f.checkReal(this.points), this.isReal || this.updateVisibility(!1)), this.visPropCalc.visible && this.board.renderer.updateCurve(this), this.hasLabel && this.visPropCalc.visible && this.label && this.label.visPropCalc.visible && this.isReal && (this.label.update(), this.board.renderer.updateText(this.label)), this.setDisplayRendNode(), this.needsUpdate = !1, this) : this;
  }, updateDataArray: function() {
  }, updateCurve: function() {
    var e, t, o, s, n, h, l = this.visProp.plotversion, p = !1;
    if (this.updateTransformMatrix(), this.updateDataArray(), t = this.minX(), o = this.maxX(), a.Z.exists(this.dataX))
      for (this.numberPoints = this.dataX.length, e = this.numberPoints, this.allocatePoints(), h = 0; h < e; h++)
        s = h, a.Z.exists(this.dataY) ? (n = h, this.points[h].setCoordinates(x.Z.COORDS_BY_USER, [this.dataX[h], this.dataY[h]], !1)) : (n = this.X(s), this.points[h].setCoordinates(x.Z.COORDS_BY_USER, [this.dataX[h], this.Y(n, p)], !1)), this.points[h]._t = h, p = !0;
    else if (a.Z.evaluate(this.visProp.doadvancedplot) ? l === 1 || a.Z.evaluate(this.visProp.doadvancedplotold) ? f.updateParametricCurveOld(this, t, o) : l === 2 ? f.updateParametricCurve_v2(this, t, o) : l === 3 ? f.updateParametricCurve_v3(this, t, o) : l === 4 ? f.updateParametricCurve_v4(this, t, o) : f.updateParametricCurve_v2(this, t, o) : (this.board.updateQuality === this.board.BOARD_QUALITY_HIGH ? this.numberPoints = a.Z.evaluate(this.visProp.numberpointshigh) : this.numberPoints = a.Z.evaluate(this.visProp.numberpointslow), this.allocatePoints(), f.updateParametricCurveNaive(this, t, o, this.numberPoints)), e = this.numberPoints, a.Z.evaluate(this.visProp.useqdt) && this.board.updateQuality === this.board.BOARD_QUALITY_HIGH)
      for (this.qdt = new E(this.board.getBoundingBox()), h = 0; h < this.points.length; h++)
        this.qdt.insert(this.points[h]), h > 0 && (this.points[h].prev = this.points[h - 1]), h < e - 1 && (this.points[h].next = this.points[h + 1]);
    for (a.Z.evaluate(this.visProp.curvetype) !== "plot" && a.Z.evaluate(this.visProp.rdpsmoothing) && (this.points = c.Z.RamerDouglasPeucker(this.points, 0.2), this.numberPoints = this.points.length), e = this.numberPoints, h = 0; h < e; h++)
      this.updateTransform(this.points[h]);
    return this;
  }, updateTransformMatrix: function() {
    var e, t, o = this.transformations.length;
    for (this.transformMat = [[1, 0, 0], [0, 1, 0], [0, 0, 1]], t = 0; t < o; t++)
      (e = this.transformations[t]).update(), this.transformMat = k.Z.matMatMult(e.matrix, this.transformMat);
    return this;
  }, updateTransform: function(e) {
    var t;
    return this.transformations.length > 0 && (t = k.Z.matVecMult(this.transformMat, e.usrCoords), e.setCoordinates(x.Z.COORDS_BY_USER, t, !1, !0)), e;
  }, addTransform: function(e) {
    var t, o = a.Z.isArray(e) ? e : [e], s = o.length;
    for (t = 0; t < s; t++)
      this.transformations.push(o[t]);
    return this;
  }, interpolationFunctionFromArray: function(e) {
    var t = "data" + e, o = this;
    return function(s, n) {
      var h, l, p, u, v = o[t], Z = v.length, y = [];
      if (isNaN(s))
        return NaN;
      if (s < 0)
        return a.Z.isFunction(v[0]) ? v[0]() : v[0];
      if (o.bezierDegree === 3) {
        if (s >= (Z - 1) / 3)
          return a.Z.isFunction(v[v.length - 1]) ? v[v.length - 1]() : v[v.length - 1];
        for (h = 3 * Math.floor(s), u = 1 - (p = s % 1), l = 0; l < 4; l++)
          a.Z.isFunction(v[h + l]) ? y[l] = v[h + l]() : y[l] = v[h + l];
        return u * u * (u * y[0] + 3 * p * y[1]) + (3 * u * y[2] + p * y[3]) * p * p;
      }
      if ((h = s > Z - 2 ? Z - 2 : parseInt(Math.floor(s), 10)) === s)
        return a.Z.isFunction(v[h]) ? v[h]() : v[h];
      for (l = 0; l < 2; l++)
        a.Z.isFunction(v[h + l]) ? y[l] = v[h + l]() : y[l] = v[h + l];
      return y[0] + (y[1] - y[0]) * (s - h);
    };
  }, generateTerm: function(e, t, o, s, n) {
    var h, l;
    a.Z.isArray(t) ? (this.dataX = t, this.numberPoints = this.dataX.length, this.X = this.interpolationFunctionFromArray.apply(this, ["X"]), this.visProp.curvetype = "plot", this.isDraggable = !0) : (this.X = a.Z.createFunction(t, this.board, e), a.Z.isString(t) ? this.visProp.curvetype = "functiongraph" : (a.Z.isFunction(t) || a.Z.isNumber(t)) && (this.visProp.curvetype = "parameter"), this.isDraggable = !0), a.Z.isArray(o) ? (this.dataY = o, this.Y = this.interpolationFunctionFromArray.apply(this, ["Y"])) : this.Y = a.Z.createFunction(o, this.board, e), a.Z.isFunction(t) && a.Z.isArray(o) && (h = a.Z.createFunction(o[0], this.board, ""), l = a.Z.createFunction(o[1], this.board, ""), this.X = function(p) {
      return t(p) * Math.cos(p) + h();
    }, this.X.deps = h.deps, this.Y = function(p) {
      return t(p) * Math.sin(p) + l();
    }, this.Y.deps = l.deps, this.visProp.curvetype = "polar"), a.Z.exists(s) && (this.minX = a.Z.createFunction(s, this.board, "")), a.Z.exists(n) && (this.maxX = a.Z.createFunction(n, this.board, "")), this.addParentsFromJCFunctions([this.X, this.Y, this.minX, this.maxX]);
  }, notifyParents: function(e) {
    var t, o, s, n = !1;
    for (t in s = { xterm: 1, yterm: 1 })
      if (s.hasOwnProperty(t) && this.hasOwnProperty(t) && this[t].origin)
        for (o in n = !0, this[t].origin.deps)
          this[t].origin.deps.hasOwnProperty(o) && this[t].origin.deps[o].addChild(this);
    n || ae.Z.findDependencies(this, e, this.board);
  }, getLabelAnchor: function() {
    var e, t, o, s = 0.05 * this.board.canvasWidth, n = 0.05 * this.board.canvasHeight, h = 0.95 * this.board.canvasWidth, l = 0.95 * this.board.canvasHeight;
    switch (a.Z.evaluate(this.visProp.label.position)) {
      case "ulft":
        t = s, o = n;
        break;
      case "llft":
        t = s, o = l;
        break;
      case "rt":
        t = h, o = 0.5 * l;
        break;
      case "lrt":
        t = h, o = l;
        break;
      case "urt":
        t = h, o = n;
        break;
      case "top":
        t = 0.5 * h, o = n;
        break;
      case "bot":
        t = 0.5 * h, o = l;
        break;
      default:
        t = s, o = 0.5 * l;
    }
    return e = new b.Z(x.Z.COORDS_BY_SCREEN, [t, o], this.board, !1), _.Z.projectCoordsToCurve(e.usrCoords[1], e.usrCoords[2], 0, this, this.board)[0];
  }, cloneToBackground: function() {
    var e, t = { id: this.id + "T" + this.numTraces, elementClass: x.Z.OBJECT_CLASS_CURVE, points: this.points.slice(0), bezierDegree: this.bezierDegree, numberPoints: this.numberPoints, board: this.board, visProp: a.Z.deepCopy(this.visProp, this.visProp.traceattributes, !0) };
    return t.visProp.layer = this.board.options.layer.trace, t.visProp.curvetype = this.visProp.curvetype, this.numTraces++, a.Z.clearVisPropOld(t), t.visPropCalc = { visible: a.Z.evaluate(t.visProp.visible) }, e = this.board.renderer.enhancedRendering, this.board.renderer.enhancedRendering = !0, this.board.renderer.drawCurve(t), this.board.renderer.enhancedRendering = e, this.traces[t.id] = t.rendNode, this;
  }, bounds: function() {
    var e, t, o, s = 1 / 0, n = -1 / 0, h = 1 / 0, l = -1 / 0, p = this.points.length;
    if (this.bezierDegree === 3) {
      for (e = 0; e < p; e++)
        this.points[e].X = a.Z.bind(function() {
          return this.usrCoords[1];
        }, this.points[e]), this.points[e].Y = a.Z.bind(function() {
          return this.usrCoords[2];
        }, this.points[e]);
      return o = (t = c.Z.bezier(this.points))[3](), s = c.Z.fminbr(function(u) {
        return t[0](u);
      }, [0, o]), n = c.Z.fminbr(function(u) {
        return -t[0](u);
      }, [0, o]), h = c.Z.fminbr(function(u) {
        return t[1](u);
      }, [0, o]), l = c.Z.fminbr(function(u) {
        return -t[1](u);
      }, [0, o]), s = t[0](s), n = t[0](n), h = t[1](h), [s, l = t[1](l), n, h];
    }
    for (e = 0; e < p; e++)
      s > this.points[e].usrCoords[1] && (s = this.points[e].usrCoords[1]), n < this.points[e].usrCoords[1] && (n = this.points[e].usrCoords[1]), h > this.points[e].usrCoords[2] && (h = this.points[e].usrCoords[2]), l < this.points[e].usrCoords[2] && (l = this.points[e].usrCoords[2]);
    return [s, l, n, h];
  }, getParents: function() {
    var e = [this.xterm, this.yterm, this.minX(), this.maxX()];
    return this.parents.length !== 0 && (e = this.parents), e;
  }, moveTo: function(e) {
    var t, o = [];
    return this.points.length > 0 && !a.Z.evaluate(this.visProp.fixed) && (t = this.points[0], o = e.length === 3 ? [e[0] - t.usrCoords[0], e[1] - t.usrCoords[1], e[2] - t.usrCoords[2]] : [e[0] - t.usrCoords[1], e[1] - t.usrCoords[2]], this.setPosition(x.Z.COORDS_BY_USER, o)), this;
  }, getTransformationSource: function() {
    var e, t;
    return a.Z.exists(this._transformationSource) && (t = this._transformationSource).elementClass === x.Z.OBJECT_CLASS_CURVE && (e = !0), [e, t];
  }, pnpoly: function(e, t, o) {
    var s, n, h, l, p, u, v = this.points, Z = !1;
    for (o === x.Z.COORDS_BY_USER ? (l = (u = new b.Z(x.Z.COORDS_BY_USER, [e, t], this.board)).scrCoords[1], p = u.scrCoords[2]) : (l = e, p = t), s = 0, n = (h = this.points.length) - 2; s < h - 1; n = s++)
      v[s].scrCoords[2] > p != v[n].scrCoords[2] > p && l < (v[n].scrCoords[1] - v[s].scrCoords[1]) * (p - v[s].scrCoords[2]) / (v[n].scrCoords[2] - v[s].scrCoords[2]) + v[s].scrCoords[1] && (Z = !Z);
    return Z;
  } }), d.Z.createCurve = function(e, t, o) {
    var s, n, h = a.Z.copyAttributes(o, e.options, "curve");
    return s = e.select(t[0], !0), a.Z.isTransformationOrArray(t[1]) && a.Z.isObject(s) && (s.type === x.Z.OBJECT_TYPE_CURVE || s.type === x.Z.OBJECT_TYPE_ANGLE || s.type === x.Z.OBJECT_TYPE_ARC || s.type === x.Z.OBJECT_TYPE_CONIC || s.type === x.Z.OBJECT_TYPE_SECTOR) ? (s.type === x.Z.OBJECT_TYPE_SECTOR ? h = a.Z.copyAttributes(o, e.options, "sector") : s.type === x.Z.OBJECT_TYPE_ARC ? h = a.Z.copyAttributes(o, e.options, "arc") : s.type === x.Z.OBJECT_TYPE_ANGLE ? (a.Z.exists(o.withLabel) || (o.withLabel = !1), h = a.Z.copyAttributes(o, e.options, "angle")) : h = a.Z.copyAttributes(o, e.options, "curve"), h = a.Z.copyAttributes(h, e.options, "curve"), (n = new d.Z.Curve(e, ["x", [], []], h)).updateDataArray = function() {
      var l, p = s.numberPoints;
      for (this.bezierDegree = s.bezierDegree, this.dataX = [], this.dataY = [], l = 0; l < p; l++)
        this.dataX.push(s.points[l].usrCoords[1]), this.dataY.push(s.points[l].usrCoords[2]);
      return this;
    }, n.addTransform(t[1]), s.addChild(n), n.setParents([s]), n._transformationSource = s, n) : (h = a.Z.copyAttributes(o, e.options, "curve"), new d.Z.Curve(e, ["x"].concat(t), h));
  }, d.Z.registerElement("curve", d.Z.createCurve), d.Z.createFunctiongraph = function(e, t, o) {
    var s, n = ["x", "x"].concat(t);
    return (s = a.Z.copyAttributes(o, e.options, "curve")).curvetype = "functiongraph", new d.Z.Curve(e, n, s);
  }, d.Z.registerElement("functiongraph", d.Z.createFunctiongraph), d.Z.registerElement("plot", d.Z.createFunctiongraph), d.Z.createSpline = function(e, t, o) {
    var s, n, h;
    return n = function() {
      var l, p = [], u = [];
      return [function(v, Z) {
        var y, O, S;
        if (!Z) {
          if (p = [], u = [], t.length === 2 && a.Z.isArray(t[0]) && a.Z.isArray(t[1]) && t[0].length === t[1].length)
            for (y = 0; y < t[0].length; y++)
              a.Z.isFunction(t[0][y]) ? p.push(t[0][y]()) : p.push(t[0][y]), a.Z.isFunction(t[1][y]) ? u.push(t[1][y]()) : u.push(t[1][y]);
          else
            for (y = 0; y < t.length; y++)
              if (a.Z.isPoint(t[y]))
                p.push(t[y].X()), u.push(t[y].Y());
              else if (a.Z.isArray(t[y]) && t[y].length === 2)
                for (O = 0; O < t.length; O++)
                  a.Z.isFunction(t[O][0]) ? p.push(t[O][0]()) : p.push(t[O][0]), a.Z.isFunction(t[O][1]) ? u.push(t[O][1]()) : u.push(t[O][1]);
              else
                a.Z.isFunction(t[y]) && t[y]().length === 2 && (S = t[y](), p.push(S[0]), u.push(S[1]));
          l = c.Z.splineDef(p, u);
        }
        return c.Z.splineEval(v, p, u, l);
      }, function() {
        return p[0];
      }, function() {
        return p[p.length - 1];
      }];
    }, (o = a.Z.copyAttributes(o, e.options, "curve")).curvetype = "functiongraph", h = n(), (s = new d.Z.Curve(e, ["x", "x", h[0], h[1], h[2]], o)).setParents(t), s.elType = "spline", s;
  }, d.Z.registerElement("spline", d.Z.createSpline), d.Z.createCardinalSpline = function(e, t, o) {
    var s, n, h, l, p, u, v, Z, y, O, S = `
Possible parent types: [points:array, tau:number|function, type:string]`;
    if (!a.Z.exists(t[0]) || !a.Z.isArray(t[0]))
      throw new Error("JSXGraph: JXG.createCardinalSpline: argument 1 'points' has to be array of points or coordinate pairs" + S);
    if (!a.Z.exists(t[1]) || !a.Z.isNumber(t[1]) && !a.Z.isFunction(t[1]))
      throw new Error("JSXGraph: JXG.createCardinalSpline: argument 2 'tau' has to be number between [0,1] or function'" + S);
    if (!a.Z.exists(t[2]) || !a.Z.isString(t[2]))
      throw new Error("JSXGraph: JXG.createCardinalSpline: argument 3 'type' has to be string 'uniform' or 'centripetal'" + S);
    if (o = a.Z.copyAttributes(o, e.options, "curve"), (o = a.Z.copyAttributes(o, e.options, "cardinalspline")).curvetype = "parameter", u = t[0], v = [], !o.isarrayofcoordinates && u.length === 2 && a.Z.isArray(u[0]) && a.Z.isArray(u[1]) && u[0].length === u[1].length)
      for (Z = 0; Z < u[0].length; Z++)
        v[Z] = [], a.Z.isFunction(u[0][Z]) ? v[Z].push(u[0][Z]()) : v[Z].push(u[0][Z]), a.Z.isFunction(u[1][Z]) ? v[Z].push(u[1][Z]()) : v[Z].push(u[1][Z]);
    else
      for (Z = 0; Z < u.length; Z++)
        a.Z.isString(u[Z]) ? v.push(e.select(u[Z])) : a.Z.isPoint(u[Z]) ? v.push(u[Z]) : a.Z.isArray(u[Z]) && u[Z].length === 2 ? (v[Z] = [], a.Z.isFunction(u[Z][0]) ? v[Z].push(u[Z][0]()) : v[Z].push(u[Z][0]), a.Z.isFunction(u[Z][1]) ? v[Z].push(u[Z][1]()) : v[Z].push(u[Z][1])) : a.Z.isFunction(u[Z]) && u[Z]().length === 2 && v.push(t[Z]());
    if (o.createpoints === !0)
      h = a.Z.providePoints(e, v, o, "cardinalspline", ["points"]);
    else
      for (h = [], n = function(R) {
        return { X: function() {
          return v[R][0];
        }, Y: function() {
          return v[R][1];
        }, Dist: function(L) {
          var B = this.X() - L.X(), X = this.Y() - L.Y();
          return Math.sqrt(B * B + X * X);
        } };
      }, Z = 0; Z < v.length; Z++)
        a.Z.isPoint(v[Z]) ? h.push(v[Z]) : h.push(n(Z));
    for (l = t[1], p = t[2], O = ["x"].concat(c.Z.CardinalSpline(h, l, p)), s = new d.Z.Curve(e, O, o), y = h.length, s.setParents(h), Z = 0; Z < y; Z++)
      u = h[Z], a.Z.isPoint(u) && (a.Z.exists(u._is_new) ? (s.addChild(u), delete u._is_new) : u.addChild(s));
    return s.elType = "cardinalspline", s;
  }, d.Z.registerElement("cardinalspline", d.Z.createCardinalSpline), d.Z.createMetapostSpline = function(e, t, o) {
    var s, n, h, l, p, u, v, Z, y = `
Possible parent types: [points:array, controls:object`;
    if (!a.Z.exists(t[0]) || !a.Z.isArray(t[0]))
      throw new Error("JSXGraph: JXG.createMetapostSpline: argument 1 'points' has to be array of points or coordinate pairs" + y);
    if (!a.Z.exists(t[1]) || !a.Z.isObject(t[1]))
      throw new Error("JSXGraph: JXG.createMetapostSpline: argument 2 'controls' has to be a JavaScript object'" + y);
    if (o = a.Z.copyAttributes(o, e.options, "curve"), (o = a.Z.copyAttributes(o, e.options, "metapostspline")).curvetype = "parameter", p = t[0], u = [], !o.isarrayofcoordinates && p.length === 2 && a.Z.isArray(p[0]) && a.Z.isArray(p[1]) && p[0].length === p[1].length)
      for (v = 0; v < p[0].length; v++)
        u[v] = [], a.Z.isFunction(p[0][v]) ? u[v].push(p[0][v]()) : u[v].push(p[0][v]), a.Z.isFunction(p[1][v]) ? u[v].push(p[1][v]()) : u[v].push(p[1][v]);
    else
      for (v = 0; v < p.length; v++)
        a.Z.isString(p[v]) ? u.push(e.select(p[v])) : a.Z.isPoint(p[v]) ? u.push(p[v]) : a.Z.isArray(p[v]) && p[v].length === 2 ? (u[v] = [], a.Z.isFunction(p[v][0]) ? u[v].push(p[v][0]()) : u[v].push(p[v][0]), a.Z.isFunction(p[v][1]) ? u[v].push(p[v][1]()) : u[v].push(p[v][1])) : a.Z.isFunction(p[v]) && p[v]().length === 2 && u.push(t[v]());
    if (o.createpoints === !0)
      h = a.Z.providePoints(e, u, o, "metapostspline", ["points"]);
    else
      for (h = [], n = function(O) {
        return { X: function() {
          return u[O][0];
        }, Y: function() {
          return u[O][1];
        } };
      }, v = 0; v < u.length; v++)
        a.Z.isPoint(u[v]) ? h.push(u[v]) : h.push(n);
    for (l = t[1], (s = new d.Z.Curve(e, ["t", [], [], 0, p.length - 1], o)).updateDataArray = function() {
      var O, S, R = h.length, L = [];
      for (S = 0; S < R; S++)
        L.push([h[S].X(), h[S].Y()]);
      O = d.Z.Math.Metapost.curve(L, l), this.dataX = O[0], this.dataY = O[1];
    }, s.bezierDegree = 3, Z = h.length, s.setParents(h), v = 0; v < Z; v++)
      a.Z.isPoint(h[v]) && h[v].addChild(s);
    return s.elType = "metapostspline", s;
  }, d.Z.registerElement("metapostspline", d.Z.createMetapostSpline), d.Z.createRiemannsum = function(e, t, o) {
    var s, n, h, l, p, u;
    if ((u = a.Z.copyAttributes(o, e.options, "riemannsum")).curvetype = "plot", h = t[0], s = a.Z.createFunction(t[1], e, ""), !a.Z.exists(s))
      throw new Error(`JSXGraph: JXG.createRiemannsum: argument '2' n has to be number or function.
Possible parent types: [function,n:number|function,type,start:number|function,end:number|function]`);
    if (n = a.Z.createFunction(t[2], e, "", !1), !a.Z.exists(n))
      throw new Error(`JSXGraph: JXG.createRiemannsum: argument 3 'type' has to be string or function.
Possible parent types: [function,n:number|function,type,start:number|function,end:number|function]`);
    return l = [[0], [0]].concat(t.slice(3)), (p = e.create("curve", l, u)).sum = 0, p.Value = function() {
      return this.sum;
    }, p.updateDataArray = function() {
      var v = c.Z.riemann(h, s(), n(), this.minX(), this.maxX());
      this.dataX = v[0], this.dataY = v[1], this.sum = v[2];
    }, p.addParentsFromJCFunctions([s, n]), p;
  }, d.Z.registerElement("riemannsum", d.Z.createRiemannsum), d.Z.createTracecurve = function(e, t, o) {
    var s, n, h, l;
    if (t.length !== 2)
      throw new Error(`JSXGraph: Can't create trace curve with given parent'
Possible parent types: [glider, point]`);
    if (n = e.select(t[0]), h = e.select(t[1]), n.type !== x.Z.OBJECT_TYPE_GLIDER || !a.Z.isPoint(h))
      throw new Error("JSXGraph: Can't create trace curve with parent types '" + typeof t[0] + "' and '" + typeof t[1] + `'.
Possible parent types: [glider, point]`);
    return (l = a.Z.copyAttributes(o, e.options, "tracecurve")).curvetype = "plot", (s = e.create("curve", [[0], [0]], l)).updateDataArray = function() {
      var p, u, v, Z, y, O, S, R, L, B = l.numberpoints, X = n.position, F = n.slideObject, G = F.minX();
      for (u = (F.maxX() - G) / B, this.dataX = [], this.dataY = [], F.elementClass !== x.Z.OBJECT_CLASS_CURVE && B++, p = 0; p < B; p++) {
        for (Z in v = G + p * u, O = F.X(v) / F.Z(v), S = F.Y(v) / F.Z(v), n.setPositionDirectly(x.Z.COORDS_BY_USER, [O, S]), R = !1, this.board.objects)
          if (this.board.objects.hasOwnProperty(Z) && ((y = this.board.objects[Z]) === n && (R = !0), R && y.needsRegularUpdate && (L = y.visProp.trace, y.visProp.trace = !1, y.needsUpdate = !0, y.update(!0), y.visProp.trace = L, y === h)))
            break;
        this.dataX[p] = h.X(), this.dataY[p] = h.Y();
      }
      for (Z in n.position = X, R = !1, this.board.objects)
        if (this.board.objects.hasOwnProperty(Z) && ((y = this.board.objects[Z]) === n && (R = !0), R && y.needsRegularUpdate && (L = y.visProp.trace, y.visProp.trace = !1, y.needsUpdate = !0, y.update(!0), y.visProp.trace = L, y === h)))
          break;
    }, s;
  }, d.Z.registerElement("tracecurve", d.Z.createTracecurve), d.Z.createStepfunction = function(e, t, o) {
    var s, n;
    if (t.length !== 2)
      throw new Error(`JSXGraph: Can't create step function with given parent'
Possible parent types: [array, array|function]`);
    return n = a.Z.copyAttributes(o, e.options, "stepfunction"), (s = e.create("curve", t, n)).updateDataArray = function() {
      var h, l = 0, p = this.xterm.length;
      if (this.dataX = [], this.dataY = [], p !== 0)
        for (this.dataX[l] = this.xterm[0], this.dataY[l] = this.yterm[0], ++l, h = 1; h < p; ++h)
          this.dataX[l] = this.xterm[h], this.dataY[l] = this.dataY[l - 1], ++l, this.dataX[l] = this.xterm[h], this.dataY[l] = this.yterm[h], ++l;
    }, s;
  }, d.Z.registerElement("stepfunction", d.Z.createStepfunction), d.Z.createDerivative = function(e, t, o) {
    var s, n, h, l, p;
    if (t.length !== 1 && t[0].class !== x.Z.OBJECT_CLASS_CURVE)
      throw new Error(`JSXGraph: Can't create derivative curve with given parent'
Possible parent types: [curve]`);
    return p = a.Z.copyAttributes(o, e.options, "curve"), n = t[0], h = c.Z.D(n.X), l = c.Z.D(n.Y), (s = e.create("curve", [function(u) {
      return n.X(u);
    }, function(u) {
      return l(u) / h(u);
    }, n.minX(), n.maxX()], p)).setParents(n), s;
  }, d.Z.registerElement("derivative", d.Z.createDerivative), d.Z.createCurveIntersection = function(e, t, o) {
    var s;
    if (t.length !== 2)
      throw new Error(`JSXGraph: Can't create curve intersection with given parent'
Possible parent types: [array, array|function]`);
    return (s = e.create("curve", [[], []], o)).updateDataArray = function() {
      var n = d.Z.Math.Clip.intersection(t[0], t[1], this.board);
      this.dataX = n[0], this.dataY = n[1];
    }, s;
  }, d.Z.createCurveUnion = function(e, t, o) {
    var s;
    if (t.length !== 2)
      throw new Error(`JSXGraph: Can't create curve union with given parent'
Possible parent types: [array, array|function]`);
    return (s = e.create("curve", [[], []], o)).updateDataArray = function() {
      var n = d.Z.Math.Clip.union(t[0], t[1], this.board);
      this.dataX = n[0], this.dataY = n[1];
    }, s;
  }, d.Z.createCurveDifference = function(e, t, o) {
    var s;
    if (t.length !== 2)
      throw new Error(`JSXGraph: Can't create curve difference with given parent'
Possible parent types: [array, array|function]`);
    return (s = e.create("curve", [[], []], o)).updateDataArray = function() {
      var n = d.Z.Math.Clip.difference(t[0], t[1], this.board);
      this.dataX = n[0], this.dataY = n[1];
    }, s;
  }, d.Z.registerElement("curvedifference", d.Z.createCurveDifference), d.Z.registerElement("curveintersection", d.Z.createCurveIntersection), d.Z.registerElement("curveunion", d.Z.createCurveUnion), d.Z.createBoxPlot = function(e, t, o) {
    var s, n, h, l = a.Z.copyAttributes(o, e.options, "boxplot");
    if (t.length !== 3)
      throw new Error(`JSXGraph: Can't create box plot with given parent'
Possible parent types: [array, number|function, number|function] containing quantiles, axis, width`);
    if (t[0].length < 5)
      throw new Error(`JSXGraph: Can't create box plot with given parent[0]'
parent[0] has to conatin at least 5 quantiles.`);
    for (s = e.create("curve", [[], []], l), h = t[0].length, s.Q = [], n = 0; n < h; n++)
      s.Q[n] = a.Z.createFunction(t[0][n], e, null, !0);
    return s.x = a.Z.createFunction(t[1], e, null, !0), s.w = a.Z.createFunction(t[2], e, null, !0), s.updateDataArray = function() {
      var p, u, v, Z, y, O, S, R, L;
      S = a.Z.evaluate(this.visProp.smallwidth), R = a.Z.evaluate(this.visProp.dir), v = (L = this.x()) - 0.5 * this.w(), Z = L - 0.5 * this.w() * S, y = L + 0.5 * this.w(), p = [L, Z, O = L + 0.5 * this.w() * S, L, L, v, v, y, y, L, NaN, v, y, NaN, L, L, Z, O, L], u = [this.Q[0](), this.Q[0](), this.Q[0](), this.Q[0](), this.Q[1](), this.Q[1](), this.Q[3](), this.Q[3](), this.Q[1](), this.Q[1](), NaN, this.Q[2](), this.Q[2](), NaN, this.Q[3](), this.Q[4](), this.Q[4](), this.Q[4](), this.Q[4]()], R === "vertical" ? (this.dataX = p, this.dataY = u) : (this.dataX = u, this.dataY = p);
    }, s.addParentsFromJCFunctions([s.Q, s.x, s.w]), s;
  }, d.Z.registerElement("boxplot", d.Z.createBoxPlot), d.Z.Curve, d.Z.createArc = function(e, t, o) {
    var s, n, h;
    if ((h = a.Z.providePoints(e, t, o, "arc", ["center", "radiusPoint", "anglePoint"])) === !1 || h.length < 3)
      throw new Error("JSXGraph: Can't create Arc with parent types '" + typeof t[0] + "' and '" + typeof t[1] + "' and '" + typeof t[2] + `'.
Possible parent types: [point,point,point], [arc, transformation]`);
    return n = a.Z.copyAttributes(o, e.options, "arc"), (s = e.create("curve", [[0], [0]], n)).elType = "arc", s.setParents(h), s.type = x.Z.OBJECT_TYPE_ARC, s.center = h[0], s.radiuspoint = h[1], s.point2 = s.radiuspoint, s.anglepoint = h[2], s.point3 = s.anglepoint, a.Z.exists(s.center._is_new) ? (s.addChild(s.center), delete s.center._is_new) : s.center.addChild(s), a.Z.exists(s.radiuspoint._is_new) ? (s.addChild(s.radiuspoint), delete s.radiuspoint._is_new) : s.radiuspoint.addChild(s), a.Z.exists(s.anglepoint._is_new) ? (s.addChild(s.anglepoint), delete s.anglepoint._is_new) : s.anglepoint.addChild(s), s.useDirection = n.usedirection, s.updateDataArray = function() {
      var l, p, u, v, Z, y = 1, O = this.radiuspoint, S = this.center, R = this.anglepoint, L = a.Z.evaluate(this.visProp.selection);
      p = _.Z.rad(O, S, R), (L === "minor" && p > Math.PI || L === "major" && p < Math.PI) && (y = -1), this.useDirection && (u = h[1].coords.usrCoords, v = h[3].coords.usrCoords, Z = h[2].coords.usrCoords, (u[1] - Z[1]) * (u[2] - v[2]) - (u[2] - Z[2]) * (u[1] - v[1]) < 0 ? (this.radiuspoint = h[1], this.anglepoint = h[2]) : (this.radiuspoint = h[2], this.anglepoint = h[1])), O = O.coords.usrCoords, S = S.coords.usrCoords, R = R.coords.usrCoords, l = _.Z.bezierArc(O, S, R, !1, y), this.dataX = l[0], this.dataY = l[1], this.bezierDegree = 3, this.updateStdform(), this.updateQuadraticform();
    }, s.Radius = function() {
      return this.radiuspoint.Dist(this.center);
    }, s.getRadius = function() {
      return d.Z.deprecated("Arc.getRadius()", "Arc.Radius()"), this.Radius();
    }, s.Value = function() {
      return this.Radius() * _.Z.rad(this.radiuspoint, this.center, this.anglepoint);
    }, s.hasPoint = function(l, p) {
      var u, v, Z, y, O, S, R, L = this.Radius();
      return a.Z.evaluate(this.visProp.hasinnerpoints) ? this.hasPointSector(l, p) : (a.Z.isObject(a.Z.evaluate(this.visProp.precision)) ? (R = this.board._inputDevice, S = a.Z.evaluate(this.visProp.precision[R])) : S = this.board.options.precision.hasPoint, S /= Math.min(this.board.unitX, this.board.unitY), v = new b.Z(x.Z.COORDS_BY_SCREEN, [l, p], this.board), this.transformations.length > 0 && (this.updateTransformMatrix(), y = k.Z.inverse(this.transformMat), O = k.Z.matVecMult(y, v.usrCoords), v = new b.Z(x.Z.COORDS_BY_USER, O, this.board)), u = this.center.coords.distance(x.Z.COORDS_BY_USER, v), (Z = Math.abs(u - L) < S) && (Z = _.Z.coordsOnArc(this, v)), Z);
    }, s.hasPointSector = function(l, p) {
      var u = new b.Z(x.Z.COORDS_BY_SCREEN, [l, p], this.board), v = this.Radius(), Z = this.center.coords.distance(x.Z.COORDS_BY_USER, u) < v;
      return Z && (Z = _.Z.coordsOnArc(this, u)), Z;
    }, s.getTextAnchor = function() {
      return this.center.coords;
    }, s.getLabelAnchor = function() {
      var l, p, u, v, Z, y = _.Z.rad(this.radiuspoint, this.center, this.anglepoint), O = 10 / this.board.unitX, S = 10 / this.board.unitY, R = this.point2.coords.usrCoords, L = this.center.coords.usrCoords, B = R[1] - L[1], X = R[2] - L[2], F = a.Z.evaluate(this.visProp.selection), G = this.label ? this.label.visProp : this.visProp.label;
      return (F === "minor" && y > Math.PI || F === "major" && y < Math.PI) && (y = -(2 * Math.PI - y)), u = (l = new b.Z(x.Z.COORDS_BY_USER, [L[1] + Math.cos(0.5 * y) * B - Math.sin(0.5 * y) * X, L[2] + Math.sin(0.5 * y) * B + Math.cos(0.5 * y) * X], this.board)).usrCoords[1] - L[1], v = l.usrCoords[2] - L[2], u = u * ((Z = Math.sqrt(u * u + v * v)) + O) / Z, v = v * (Z + S) / Z, p = [L[1] + u, L[2] + v], G.position = _.Z.calcLabelQuadrant(_.Z.rad([1, 0], [0, 0], p)), new b.Z(x.Z.COORDS_BY_USER, p, this.board);
    }, s.updateQuadraticform = ut.prototype.updateQuadraticform, s.updateStdform = ut.prototype.updateStdform, s.methodMap = d.Z.deepCopy(s.methodMap, { getRadius: "getRadius", radius: "Radius", center: "center", radiuspoint: "radiuspoint", anglepoint: "anglepoint", Value: "Value" }), s.prepareUpdate().update(), s;
  }, d.Z.registerElement("arc", d.Z.createArc), d.Z.createSemicircle = function(e, t, o) {
    var s, n, h, l;
    if ((l = a.Z.providePoints(e, t, o, "point")) === !1 || l.length !== 2)
      throw new Error("JSXGraph: Can't create Semicircle with parent types '" + typeof t[0] + "' and '" + typeof t[1] + `'.
Possible parent types: [point,point]`);
    return h = a.Z.copyAttributes(o, e.options, "semicircle", "center"), (n = e.create("midpoint", l, h)).dump = !1, h = a.Z.copyAttributes(o, e.options, "semicircle"), (s = e.create("arc", [n, l[1], l[0]], h)).elType = "semicircle", s.setParents([l[0].id, l[1].id]), s.subs = { midpoint: n }, s.inherits.push(n), s.midpoint = s.center = n, s;
  }, d.Z.registerElement("semicircle", d.Z.createSemicircle), d.Z.createCircumcircleArc = function(e, t, o) {
    var s, n, h, l;
    if ((l = a.Z.providePoints(e, t, o, "point")) === !1 || l.length !== 3)
      throw new Error("JSXGraph: create Circumcircle Arc with parent types '" + typeof t[0] + "' and '" + typeof t[1] + "' and '" + typeof t[2] + `'.
Possible parent types: [point,point,point]`);
    return h = a.Z.copyAttributes(o, e.options, "circumcirclearc", "center"), (n = e.create("circumcenter", l, h)).dump = !1, (h = a.Z.copyAttributes(o, e.options, "circumcirclearc")).usedirection = !0, (s = e.create("arc", [n, l[0], l[2], l[1]], h)).elType = "circumcirclearc", s.setParents([l[0].id, l[1].id, l[2].id]), s.subs = { center: n }, s.inherits.push(n), s.center = n, s;
  }, d.Z.registerElement("circumcirclearc", d.Z.createCircumcircleArc), d.Z.createMinorArc = function(e, t, o) {
    return o.selection = "minor", d.Z.createArc(e, t, o);
  }, d.Z.registerElement("minorarc", d.Z.createMinorArc), d.Z.createMajorArc = function(e, t, o) {
    return o.selection = "major", d.Z.createArc(e, t, o);
  }, d.Z.registerElement("majorarc", d.Z.createMajorArc), d.Z.createSector = function(e, t, o) {
    var s, n, h, l, p, u, v = "invalid";
    if (t[0].elementClass === x.Z.OBJECT_CLASS_LINE && t[1].elementClass === x.Z.OBJECT_CLASS_LINE && (a.Z.isArray(t[2]) || a.Z.isNumber(t[2])) && (a.Z.isArray(t[3]) || a.Z.isNumber(t[3])) && (a.Z.isNumber(t[4]) || a.Z.isFunction(t[4]) || a.Z.isString(t[4])))
      v = "2lines";
    else {
      if ((u = a.Z.providePoints(e, t, o, "sector", ["center", "radiusPoint", "anglePoint"])) === !1)
        throw new Error("JSXGraph: Can't create Sector with parent types '" + typeof t[0] + "' and '" + typeof t[1] + "' and '" + typeof t[2] + "'.");
      v = "3points";
    }
    if (n = a.Z.copyAttributes(o, e.options, "sector"), (s = e.create("curve", [[0], [0]], n)).type = x.Z.OBJECT_TYPE_SECTOR, s.elType = "sector", s.autoRadius = function() {
      var Z = 20 / s.board.unitX, y = 1 / 0, O = 50 / s.board.unitX;
      return a.Z.isPoint(s.center) && (y = 0.3333 * s.center.Dist(s.point2)), Math.max(Z, Math.min(y, O));
    }, v === "2lines")
      s.Radius = function() {
        var Z = a.Z.evaluate(t[4]);
        return Z === "auto" ? this.autoRadius() : Z;
      }, s.line1 = e.select(t[0]), s.line2 = e.select(t[1]), s.line1.addChild(s), s.line2.addChild(s), s.setParents(t), s.point1 = { visProp: {} }, s.point2 = { visProp: {} }, s.point3 = { visProp: {} }, l = _.Z.meetLineLine(s.line1.stdform, s.line2.stdform, 0, e), a.Z.isArray(t[2]) ? (t[2].length === 2 && (t[2] = [1].concat(t[2])), p = _.Z.projectPointToLine({ coords: { usrCoords: t[2] } }, s.line1, e), p = m.Z.subtract(p.usrCoords, l.usrCoords), s.direction1 = k.Z.innerProduct(p, [0, s.line1.stdform[2], -s.line1.stdform[1]], 3) >= 0 ? 1 : -1) : s.direction1 = t[2] >= 0 ? 1 : -1, a.Z.isArray(t[3]) ? (t[3].length === 2 && (t[3] = [1].concat(t[3])), p = _.Z.projectPointToLine({ coords: { usrCoords: t[3] } }, s.line2, e), p = m.Z.subtract(p.usrCoords, l.usrCoords), s.direction2 = k.Z.innerProduct(p, [0, s.line2.stdform[2], -s.line2.stdform[1]], 3) >= 0 ? 1 : -1) : s.direction2 = t[3] >= 0 ? 1 : -1, s.updateDataArray = function() {
        var Z, y, O, S, R, L, B = [0, 0, 0];
        if (y = this.line1, O = this.line2, B = k.Z.crossProduct(y.stdform, O.stdform), Math.abs(B[0]) > k.Z.eps * k.Z.eps && (B[1] /= B[0], B[2] /= B[0], B[0] /= B[0]), Z = this.direction1 * this.Radius(), S = m.Z.add(B, [0, Z * y.stdform[2], -Z * y.stdform[1]]), Z = this.direction2 * this.Radius(), R = m.Z.add(B, [0, Z * O.stdform[2], -Z * O.stdform[1]]), this.point2.coords = new b.Z(x.Z.COORDS_BY_USER, S, s.board), this.point1.coords = new b.Z(x.Z.COORDS_BY_USER, B, s.board), this.point3.coords = new b.Z(x.Z.COORDS_BY_USER, R, s.board), Math.abs(S[0]) < k.Z.eps || Math.abs(B[0]) < k.Z.eps || Math.abs(R[0]) < k.Z.eps)
          return this.dataX = [NaN], void (this.dataY = [NaN]);
        L = _.Z.bezierArc(S, B, R, !0, 1), this.dataX = L[0], this.dataY = L[1], this.bezierDegree = 3;
      }, s.methodMap = d.Z.deepCopy(s.methodMap, { radius: "Radius", getRadius: "Radius", setRadius: "setRadius" });
    else if (v === "3points") {
      for (s.point1 = u[0], s.point2 = u[1], s.point3 = u[2], h = 0; h < 3; h++)
        a.Z.exists(u[h]._is_new) ? (s.addChild(u[h]), delete u[h]._is_new) : u[h].addChild(s);
      s.useDirection = o.usedirection, s.setParents(u), a.Z.exists(u[3]) && (s.point4 = u[3], s.point4.addChild(s)), s.methodMap = d.Z.deepCopy(s.methodMap, { arc: "arc", center: "center", radiuspoint: "radiuspoint", anglepoint: "anglepoint", radius: "Radius", getRadius: "Radius", setRadius: "setRadius" }), s.updateDataArray = function() {
        var Z, y, O, S, R, L = this.point2, B = this.point1, X = this.point3, F = 1, G = a.Z.evaluate(this.visProp.selection);
        if (!L.isReal || !B.isReal || !X.isReal)
          return this.dataX = [NaN], void (this.dataY = [NaN]);
        R = _.Z.rad(L, B, X), (G === "minor" && R > Math.PI || G === "major" && R < Math.PI) && (F = -1), this.useDirection && a.Z.exists(this.point4) && (y = this.point2.coords.usrCoords, O = this.point4.coords.usrCoords, S = this.point3.coords.usrCoords, (y[1] - S[1]) * (y[2] - O[2]) - (y[2] - S[2]) * (y[1] - O[1]) >= 0 && (X = this.point2, L = this.point3)), L = L.coords.usrCoords, B = B.coords.usrCoords, X = X.coords.usrCoords, Z = _.Z.bezierArc(L, B, X, !0, F), this.dataX = Z[0], this.dataY = Z[1], this.bezierDegree = 3;
      }, s.Radius = function() {
        return this.point2.Dist(this.point1);
      }, (n = a.Z.copyAttributes(o, e.options, "sector", "arc")).withLabel = !1, n.name += "_arc", s.arc = e.create("arc", [s.point1, s.point2, s.point3], n), s.addChild(s.arc);
    }
    return s.center = s.point1, s.radiuspoint = s.point2, s.anglepoint = s.point3, s.hasPointCurve = function(Z, y) {
      var O, S, R, L, B, X, F = new b.Z(x.Z.COORDS_BY_SCREEN, [Z, y], this.board), G = this.Radius(), W = this.center.coords.distance(x.Z.COORDS_BY_USER, F), H = a.Z.evaluate(this.visProp.selection);
      return a.Z.isObject(a.Z.evaluate(this.visProp.precision)) ? (B = this.board._inputDevice, L = a.Z.evaluate(this.visProp.precision[B])) : L = this.board.options.precision.hasPoint, L /= Math.min(this.board.unitX, this.board.unitY), (X = Math.abs(W - G) < L) && (O = _.Z.rad(this.point2, this.center, F.usrCoords.slice(1)), S = 0, R = _.Z.rad(this.point2, this.center, this.point3), (H === "minor" && R > Math.PI || H === "major" && R < Math.PI) && (S = R, R = 2 * Math.PI), (O < S || O > R) && (X = !1)), X;
    }, s.hasPointSector = function(Z, y) {
      var O, S, R, L = new b.Z(x.Z.COORDS_BY_SCREEN, [Z, y], this.board), B = this.Radius(), X = this.point1.coords.distance(x.Z.COORDS_BY_USER, L) < B, F = a.Z.evaluate(this.visProp.selection);
      return X && (O = _.Z.rad(this.radiuspoint, this.center, L.usrCoords.slice(1)), S = 0, R = _.Z.rad(this.radiuspoint, this.center, this.anglepoint), (F === "minor" && R > Math.PI || F === "major" && R < Math.PI) && (S = R, R = 2 * Math.PI), (O < S || O > R) && (X = !1)), X;
    }, s.hasPoint = function(Z, y) {
      return a.Z.evaluate(this.visProp.highlightonsector) || a.Z.evaluate(this.visProp.hasinnerpoints) ? this.hasPointSector(Z, y) : this.hasPointCurve(Z, y);
    }, s.getTextAnchor = function() {
      return this.point1.coords;
    }, s.getLabelAnchor = function() {
      var Z, y, O, S, R, L = _.Z.rad(this.point2, this.point1, this.point3), B = 13 / this.board.unitX, X = 13 / this.board.unitY, F = this.point2.coords.usrCoords, G = this.point1.coords.usrCoords, W = F[1] - G[1], H = F[2] - G[2], q = a.Z.evaluate(this.visProp.selection), oe = this.label ? this.label.visProp : this.visProp.label;
      return (q === "minor" && L > Math.PI || q === "major" && L < Math.PI) && (L = -(2 * Math.PI - L)), O = (Z = new b.Z(x.Z.COORDS_BY_USER, [G[1] + Math.cos(0.5 * L) * W - Math.sin(0.5 * L) * H, G[2] + Math.sin(0.5 * L) * W + Math.cos(0.5 * L) * H], this.board)).usrCoords[1] - G[1], S = Z.usrCoords[2] - G[2], O = O * ((R = Math.sqrt(O * O + S * S)) + B) / R, S = S * (R + X) / R, y = [G[1] + O, G[2] + S], oe.position = _.Z.calcLabelQuadrant(_.Z.rad([1, 0], [0, 0], y)), new b.Z(x.Z.COORDS_BY_USER, y, this.board);
    }, s.setRadius = function(Z) {
      s.Radius = function() {
        var y = a.Z.evaluate(Z);
        return y === "auto" ? this.autoRadius() : y;
      };
    }, s.getRadius = function() {
      return d.Z.deprecated("Sector.getRadius()", "Sector.Radius()"), this.Radius();
    }, v === "3points" && (s.setPositionDirectly = function(Z, y, O) {
      var S, R = new b.Z(Z, y, this.board), L = new b.Z(Z, O, this.board);
      return s.point1.draggable() && s.point2.draggable() && s.point3.draggable() ? (S = m.Z.subtract(R.usrCoords, L.usrCoords), this.board.create("transform", S.slice(1), { type: "translate" }).applyOnce([s.point1, s.point2, s.point3]), this) : this;
    }), s.prepareUpdate().update(), s;
  }, d.Z.registerElement("sector", d.Z.createSector), d.Z.createCircumcircleSector = function(e, t, o) {
    var s, n, h, l;
    if ((l = a.Z.providePoints(e, t, o, "point")) === !1)
      throw new Error("JSXGraph: Can't create circumcircle sector with parent types '" + typeof t[0] + "' and '" + typeof t[1] + "' and '" + typeof t[2] + "'.");
    return (n = e.create("circumcenter", l.slice(0, 3), h)).dump = !1, h = a.Z.copyAttributes(o, e.options, "circumcirclesector"), (s = e.create("sector", [n, l[0], l[2], l[1]], h)).elType = "circumcirclesector", s.setParents(l), s.center = n, s.subs = { center: n }, s;
  }, d.Z.registerElement("circumcirclesector", d.Z.createCircumcircleSector), d.Z.createMinorSector = function(e, t, o) {
    return o.selection = "minor", d.Z.createSector(e, t, o);
  }, d.Z.registerElement("minorsector", d.Z.createMinorSector), d.Z.createMajorSector = function(e, t, o) {
    return o.selection = "major", d.Z.createSector(e, t, o);
  }, d.Z.registerElement("majorsector", d.Z.createMajorSector), d.Z.createAngle = function(e, t, o) {
    var s, n, h, l, p, u, v = "invalid";
    if (t[0].elementClass === x.Z.OBJECT_CLASS_LINE && t[1].elementClass === x.Z.OBJECT_CLASS_LINE && (a.Z.isArray(t[2]) || a.Z.isNumber(t[2])) && (a.Z.isArray(t[3]) || a.Z.isNumber(t[3])))
      v = "2lines";
    else {
      if ((u = a.Z.providePoints(e, t, o, "point")) === !1)
        throw new Error("JSXGraph: Can't create angle with parent types '" + typeof t[0] + "' and '" + typeof t[1] + "' and '" + typeof t[2] + "'.");
      v = "3points";
    }
    if (h = a.Z.copyAttributes(o, e.options, "angle"), a.Z.exists(h.name) && h.name !== "" || (h.name = e.generateName({ type: x.Z.OBJECT_TYPE_ANGLE })), n = a.Z.exists(h.radius) ? h.radius : 0, v === "2lines" ? (t.push(n), (s = e.create("sector", t, h)).updateDataArraySector = s.updateDataArray, s.setAngle = function(Z) {
    }, s.free = function(Z) {
    }) : ((s = e.create("sector", [u[1], u[0], u[2]], h)).arc.visProp.priv = !0, s.point = s.point2 = s.radiuspoint = u[0], s.pointsquare = s.point3 = s.anglepoint = u[2], s.Radius = function() {
      var Z = a.Z.evaluate(n);
      return Z === "auto" ? s.autoRadius() : Z;
    }, s.updateDataArraySector = function() {
      var Z, y, O = this.point2, S = this.point1, R = this.point3, L = this.Radius(), B = S.Dist(O), X = 1, F = a.Z.evaluate(this.visProp.selection);
      y = _.Z.rad(O, S, R), (F === "minor" && y > Math.PI || F === "major" && y < Math.PI) && (X = -1), O = O.coords.usrCoords, S = S.coords.usrCoords, R = R.coords.usrCoords, O = [1, S[1] + (O[1] - S[1]) * L / B, S[2] + (O[2] - S[2]) * L / B], R = [1, S[1] + (R[1] - S[1]) * L / B, S[2] + (R[2] - S[2]) * L / B], Z = _.Z.bezierArc(O, S, R, !0, X), this.dataX = Z[0], this.dataY = Z[1], this.bezierDegree = 3;
    }, s.setAngle = function(Z) {
      var y, O, S, R = this.anglepoint, L = this.radiuspoint;
      return R.draggable() && (y = this.board.create("transform", [Z, this.center], { type: "rotate" }), R.addTransform(L, y), y.update(), R.moveTo(k.Z.matVecMult(y.matrix, L.coords.usrCoords)), S = a.Z.isFunction(Z) ? function() {
        return 2 * Math.PI - Z();
      } : function() {
        return 2 * Math.PI - Z;
      }, O = this.board.create("transform", [S, this.center], { type: "rotate" }), R.coords.on("update", function() {
        O.update(), L.moveTo(k.Z.matVecMult(O.matrix, R.coords.usrCoords));
      }), R.setParents(L)), this;
    }, s.free = function() {
      var Z = this.anglepoint;
      return Z.transformations.length > 0 && (Z.transformations.pop(), Z.isDraggable = !0, Z.parents = [], Z.coords.off("update")), this;
    }, s.setParents(u)), a.Z.exists(s.visProp.text) && s.label.setText(a.Z.evaluate(s.visProp.text)), s.elType = "angle", s.type = x.Z.OBJECT_TYPE_ANGLE, s.subs = {}, s.updateDataArraySquare = function() {
      var Z, y, O, S, R, L, B, X, F = this.Radius();
      v === "2lines" && this.updateDataArraySector(), Z = this.point2, y = this.point1, O = this.point3, Z = Z.coords.usrCoords, y = y.coords.usrCoords, O = O.coords.usrCoords, S = _.Z.distance(Z, y, 3), R = _.Z.distance(O, y, 3), Z = [1, y[1] + (Z[1] - y[1]) * F / S, y[2] + (Z[2] - y[2]) * F / S], O = [1, y[1] + (O[1] - y[1]) * F / R, y[2] + (O[2] - y[2]) * F / R], L = k.Z.crossProduct(O, y), B = [-Z[1] * L[1] - Z[2] * L[2], Z[0] * L[1], Z[0] * L[2]], L = k.Z.crossProduct(Z, y), X = [-O[1] * L[1] - O[2] * L[2], O[0] * L[1], O[0] * L[2]], (L = k.Z.crossProduct(B, X))[1] /= L[0], L[2] /= L[0], this.dataX = [y[1], Z[1], L[1], O[1], y[1]], this.dataY = [y[2], Z[2], L[2], O[2], y[2]], this.bezierDegree = 1;
    }, s.updateDataArrayNone = function() {
      this.dataX = [NaN], this.dataY = [NaN], this.bezierDegree = 1;
    }, s.updateDataArray = function() {
      var Z = a.Z.evaluate(this.visProp.type), y = _.Z.trueAngle(this.point2, this.point1, this.point3), O = a.Z.evaluate(this.visProp.selection);
      (O === "minor" && y > 180 || O === "major" && y < 180) && (y = 360 - y), Math.abs(y - 90) < a.Z.evaluate(this.visProp.orthosensitivity) + k.Z.eps && (Z = a.Z.evaluate(this.visProp.orthotype)), Z === "none" ? this.updateDataArrayNone() : Z === "square" ? this.updateDataArraySquare() : Z === "sector" ? this.updateDataArraySector() : Z === "sectordot" && (this.updateDataArraySector(), this.dot.visProp.visible || this.dot.setAttribute({ visible: !0 })), (!this.visProp.visible || Z !== "sectordot" && this.dot.visProp.visible) && this.dot.setAttribute({ visible: !1 });
    }, l = a.Z.copyAttributes(o, e.options, "angle", "dot"), s.dot = e.create("point", [function() {
      var Z, y, O, S, R, L, B, X, F;
      return a.Z.exists(s.dot) && !s.dot.visProp.visible ? [0, 0] : (Z = s.point2.coords.usrCoords, y = s.point1.coords.usrCoords, O = s.Radius(), S = _.Z.distance(Z, y, 3), R = _.Z.rad(s.point2, s.point1, s.point3), ((F = a.Z.evaluate(s.visProp.selection)) === "minor" && R > Math.PI || F === "major" && R < Math.PI) && (R = -(2 * Math.PI - R)), R *= 0.5, L = Math.cos(R), B = Math.sin(R), Z = [1, y[1] + (Z[1] - y[1]) * O / S, y[2] + (Z[2] - y[2]) * O / S], X = [[1, 0, 0], [y[1] - 0.5 * y[1] * L + 0.5 * y[2] * B, 0.5 * L, 0.5 * -B], [y[2] - 0.5 * y[1] * B - 0.5 * y[2] * L, 0.5 * B, 0.5 * L]], k.Z.matVecMult(X, Z));
    }], l), s.dot.dump = !1, s.subs.dot = s.dot, v === "2lines")
      for (p = 0; p < 2; p++)
        e.select(t[p]).addChild(s.dot);
    else
      for (p = 0; p < 3; p++)
        e.select(u[p]).addChild(s.dot);
    return s.getLabelAnchor = function() {
      var Z, y, O, S, R, L, B, X, F, G = 12, W = a.Z.evaluate(s.visProp.selection), H = this.label ? this.label.visProp : this.visProp.label;
      return a.Z.exists(this.label.visProp.fontSize) && (G = a.Z.evaluate(this.label.visProp.fontSize)), G /= this.board.unitX, y = s.point2.coords.usrCoords, O = s.point1.coords.usrCoords, S = s.Radius(), R = _.Z.distance(y, O, 3), L = _.Z.rad(s.point2, s.point1, s.point3), (W === "minor" && L > Math.PI || W === "major" && L < Math.PI) && (L = -(2 * Math.PI - L)), L *= 0.5, B = Math.cos(L), X = Math.sin(L), y = [1, O[1] + (y[1] - O[1]) * S / R, O[2] + (y[2] - O[2]) * S / R], F = [[1, 0, 0], [O[1] - 0.5 * O[1] * B + 0.5 * O[2] * X, 0.5 * B, 0.5 * -X], [O[2] - 0.5 * O[1] * X - 0.5 * O[2] * B, 0.5 * X, 0.5 * B]], (Z = k.Z.matVecMult(F, y))[1] /= Z[0], Z[2] /= Z[0], Z[0] /= Z[0], R = _.Z.distance(Z, O, 3), Z = [Z[0], O[1] + (Z[1] - O[1]) * (S + G) / R, O[2] + (Z[2] - O[2]) * (S + G) / R], H.position = _.Z.calcLabelQuadrant(_.Z.rad([1, 0], [0, 0], Z)), new b.Z(x.Z.COORDS_BY_USER, Z, this.board);
    }, s.Value = function() {
      return _.Z.rad(this.point2, this.point1, this.point3);
    }, s.methodMap = a.Z.deepCopy(s.methodMap, { Value: "Value", setAngle: "setAngle", free: "free" }), s;
  }, d.Z.registerElement("angle", d.Z.createAngle), d.Z.createNonreflexAngle = function(e, t, o) {
    var s;
    return o.selection = "minor", (s = d.Z.createAngle(e, t, o)).Value = function() {
      var n = _.Z.rad(this.point2, this.point1, this.point3);
      return n < Math.PI ? n : 2 * Math.PI - n;
    }, s;
  }, d.Z.registerElement("nonreflexangle", d.Z.createNonreflexAngle), d.Z.createReflexAngle = function(e, t, o) {
    var s;
    return o.selection = "major", (s = d.Z.createAngle(e, t, o)).Value = function() {
      var n = _.Z.rad(this.point2, this.point1, this.point3);
      return n >= Math.PI ? n : 2 * Math.PI - n;
    }, s;
  }, d.Z.registerElement("reflexangle", d.Z.createReflexAngle), d.Z.createOrthogonalProjection = function(e, t, o) {
    var s, n, h, l;
    if (t[0] = e.select(t[0]), t[1] = e.select(t[1]), a.Z.isPointType(e, t[0]) && t[1].elementClass === x.Z.OBJECT_CLASS_LINE)
      n = a.Z.providePoints(e, [t[0]], o, "point")[0], s = t[1];
    else {
      if (!a.Z.isPointType(e, t[1]) || t[0].elementClass !== x.Z.OBJECT_CLASS_LINE)
        throw new Error("JSXGraph: Can't create perpendicular point with parent types '" + typeof t[0] + "' and '" + typeof t[1] + `'.
Possible parent types: [point,line]`);
      n = a.Z.providePoints(e, [t[1]], o, "point")[0], s = t[0];
    }
    return l = a.Z.copyAttributes(o, e.options, "orthogonalprojection"), h = e.create("point", [function() {
      return _.Z.projectPointToLine(n, s, e);
    }], l), a.Z.exists(n._is_new) ? (h.addChild(n), delete n._is_new) : n.addChild(h), s.addChild(h), h.elType = "orthogonalprojection", h.setParents([n.id, h.id]), h.update(), h.generatePolynomial = function() {
      var p = s.point1.symbolic.x, u = s.point1.symbolic.y, v = s.point2.symbolic.x, Z = s.point2.symbolic.y, y = n.symbolic.x, O = n.symbolic.y, S = h.symbolic.x, R = h.symbolic.y;
      return ["(" + u + ")*(" + S + ")-(" + u + ")*(" + v + ")+(" + R + ")*(" + v + ")-(" + p + ")*(" + R + ")+(" + p + ")*(" + Z + ")-(" + S + ")*(" + Z + ")", "(" + O + ")*(" + u + ")-(" + O + ")*(" + Z + ")-(" + R + ")*(" + u + ")+(" + R + ")*(" + Z + ")+(" + y + ")*(" + p + ")-(" + y + ")*(" + v + ")-(" + S + ")*(" + p + ")+(" + S + ")*(" + v + ")"];
    }, h;
  }, d.Z.createPerpendicular = function(e, t, o) {
    var s, n, h, l;
    if (t[0] = e.select(t[0]), t[1] = e.select(t[1]), a.Z.isPointType(e, t[0]) && t[1].elementClass === x.Z.OBJECT_CLASS_LINE)
      n = t[1], s = a.Z.providePoints(e, [t[0]], o, "point")[0];
    else {
      if (!a.Z.isPointType(e, t[1]) || t[0].elementClass !== x.Z.OBJECT_CLASS_LINE)
        throw new Error("JSXGraph: Can't create perpendicular with parent types '" + typeof t[0] + "' and '" + typeof t[1] + `'.
Possible parent types: [line,point]`);
      n = t[0], s = a.Z.providePoints(e, [t[1]], o, "point")[0];
    }
    return l = a.Z.copyAttributes(o, e.options, "perpendicular"), (h = d.Z.createLine(e, [function() {
      return n.stdform[2] * s.X() - n.stdform[1] * s.Y();
    }, function() {
      return -n.stdform[2] * s.Z();
    }, function() {
      return n.stdform[1] * s.Z();
    }], l)).elType = "perpendicular", h.setParents([n.id, s.id]), a.Z.exists(s._is_new) ? (h.addChild(s), delete s._is_new) : s.addChild(h), n.addChild(h), h;
  }, d.Z.createPerpendicularPoint = function(e, t, o) {
    var s, n, h;
    if (t[0] = e.select(t[0]), t[1] = e.select(t[1]), a.Z.isPointType(e, t[0]) && t[1].elementClass === x.Z.OBJECT_CLASS_LINE)
      n = a.Z.providePoints(e, [t[0]], o, "point")[0], s = t[1];
    else {
      if (!a.Z.isPointType(e, t[1]) || t[0].elementClass !== x.Z.OBJECT_CLASS_LINE)
        throw new Error("JSXGraph: Can't create perpendicular point with parent types '" + typeof t[0] + "' and '" + typeof t[1] + `'.
Possible parent types: [point,line]`);
      n = a.Z.providePoints(e, [t[1]], o, "point")[0], s = t[0];
    }
    return h = e.create("point", [function() {
      return _.Z.perpendicular(s, n, e)[0];
    }], o), a.Z.exists(n._is_new) ? (h.addChild(n), delete n._is_new) : n.addChild(h), s.addChild(h), h.elType = "perpendicularpoint", h.setParents([n.id, s.id]), h.update(), h.generatePolynomial = function() {
      var l = s.point1.symbolic.x, p = s.point1.symbolic.y, u = s.point2.symbolic.x, v = s.point2.symbolic.y, Z = n.symbolic.x, y = n.symbolic.y, O = h.symbolic.x, S = h.symbolic.y;
      return ["(" + p + ")*(" + O + ")-(" + p + ")*(" + u + ")+(" + S + ")*(" + u + ")-(" + l + ")*(" + S + ")+(" + l + ")*(" + v + ")-(" + O + ")*(" + v + ")", "(" + y + ")*(" + p + ")-(" + y + ")*(" + v + ")-(" + S + ")*(" + p + ")+(" + S + ")*(" + v + ")+(" + Z + ")*(" + l + ")-(" + Z + ")*(" + u + ")-(" + O + ")*(" + l + ")+(" + O + ")*(" + u + ")"];
    }, h;
  }, d.Z.createPerpendicularSegment = function(e, t, o) {
    var s, n, h, l, p;
    if (t[0] = e.select(t[0]), t[1] = e.select(t[1]), a.Z.isPointType(e, t[0]) && t[1].elementClass === x.Z.OBJECT_CLASS_LINE)
      n = t[1], s = a.Z.providePoints(e, [t[0]], o, "point")[0];
    else {
      if (!a.Z.isPointType(e, t[1]) || t[0].elementClass !== x.Z.OBJECT_CLASS_LINE)
        throw new Error("JSXGraph: Can't create perpendicular with parent types '" + typeof t[0] + "' and '" + typeof t[1] + `'.
Possible parent types: [line,point]`);
      n = t[0], s = a.Z.providePoints(e, [t[1]], o, "point")[0];
    }
    return p = a.Z.copyAttributes(o, e.options, "perpendicularsegment", "point"), (l = d.Z.createPerpendicularPoint(e, [n, s], p)).dump = !1, a.Z.exists(o.layer) || (o.layer = e.options.layer.line), p = a.Z.copyAttributes(o, e.options, "perpendicularsegment"), (h = d.Z.createLine(e, [function() {
      return _.Z.perpendicular(n, s, e)[1] ? [l, s] : [s, l];
    }], p)).point = l, a.Z.exists(s._is_new) ? (h.addChild(s), delete s._is_new) : s.addChild(h), n.addChild(h), h.elType = "perpendicularsegment", h.setParents([s.id, n.id]), h.subs = { point: l }, h.inherits.push(l), h;
  }, d.Z.createMidpoint = function(e, t, o) {
    var s, n, h, l, p;
    for (l = 0; l < t.length; ++l)
      t[l] = e.select(t[l]);
    if (t.length === 2 && a.Z.isPointType(e, t[0]) && a.Z.isPointType(e, t[1]))
      t = a.Z.providePoints(e, t, o, "point"), s = t[0], n = t[1];
    else {
      if (t.length !== 1 || t[0].elementClass !== x.Z.OBJECT_CLASS_LINE)
        throw new Error(`JSXGraph: Can't create midpoint.
Possible parent types: [point,point], [line]`);
      s = t[0].point1, n = t[0].point2;
    }
    return p = a.Z.copyAttributes(o, e.options, "midpoint"), h = e.create("point", [function() {
      var u = s.coords.usrCoords[1] + n.coords.usrCoords[1];
      return isNaN(u) || Math.abs(s.coords.usrCoords[0]) < k.Z.eps || Math.abs(n.coords.usrCoords[0]) < k.Z.eps ? NaN : 0.5 * u;
    }, function() {
      var u = s.coords.usrCoords[2] + n.coords.usrCoords[2];
      return isNaN(u) || Math.abs(s.coords.usrCoords[0]) < k.Z.eps || Math.abs(n.coords.usrCoords[0]) < k.Z.eps ? NaN : 0.5 * u;
    }], p), a.Z.exists(s._is_new) ? (h.addChild(s), delete s._is_new) : s.addChild(h), a.Z.exists(n._is_new) ? (h.addChild(n), delete n._is_new) : n.addChild(h), h.elType = "midpoint", h.setParents([s.id, n.id]), h.prepareUpdate().update(), h.generatePolynomial = function() {
      var u = s.symbolic.x, v = s.symbolic.y, Z = n.symbolic.x, y = n.symbolic.y, O = h.symbolic.x, S = h.symbolic.y;
      return ["(" + v + ")*(" + O + ")-(" + v + ")*(" + Z + ")+(" + S + ")*(" + Z + ")-(" + u + ")*(" + S + ")+(" + u + ")*(" + y + ")-(" + O + ")*(" + y + ")", "(" + u + ")^2 - 2*(" + u + ")*(" + O + ")+(" + v + ")^2-2*(" + v + ")*(" + S + ")-(" + Z + ")^2+2*(" + Z + ")*(" + O + ")-(" + y + ")^2+2*(" + y + ")*(" + S + ")"];
    }, h;
  }, d.Z.createParallelPoint = function(e, t, o) {
    var s, n, h, l, p;
    for (p = 0; p < t.length; ++p)
      t[p] = e.select(t[p]);
    if (t.length === 3 && a.Z.isPointType(e, t[0]) && a.Z.isPointType(e, t[1]) && a.Z.isPointType(e, t[2]))
      t = a.Z.providePoints(e, t, o, "point"), s = t[0], n = t[1], h = t[2];
    else if (a.Z.isPointType(e, t[0]) && t[1].elementClass === x.Z.OBJECT_CLASS_LINE)
      h = a.Z.providePoints(e, [t[0]], o, "point")[0], s = t[1].point1, n = t[1].point2;
    else {
      if (!a.Z.isPointType(e, t[1]) || t[0].elementClass !== x.Z.OBJECT_CLASS_LINE)
        throw new Error("JSXGraph: Can't create parallel point with parent types '" + typeof t[0] + "', '" + typeof t[1] + "' and '" + typeof t[2] + `'.
Possible parent types: [line,point], [point,point,point]`);
      h = a.Z.providePoints(e, [t[1]], o, "point")[0], s = t[0].point1, n = t[0].point2;
    }
    return l = e.create("point", [function() {
      return h.coords.usrCoords[1] + n.coords.usrCoords[1] - s.coords.usrCoords[1];
    }, function() {
      return h.coords.usrCoords[2] + n.coords.usrCoords[2] - s.coords.usrCoords[2];
    }], o), a.Z.exists(s._is_new) ? (l.addChild(s), delete s._is_new) : s.addChild(l), a.Z.exists(n._is_new) ? (l.addChild(n), delete n._is_new) : n.addChild(l), a.Z.exists(h._is_new) ? (l.addChild(h), delete h._is_new) : h.addChild(l), l.elType = "parallelpoint", l.setParents([s.id, n.id, h.id]), l.prepareUpdate().update(), l.generatePolynomial = function() {
      var u = s.symbolic.x, v = s.symbolic.y, Z = n.symbolic.x, y = n.symbolic.y, O = h.symbolic.x, S = h.symbolic.y, R = l.symbolic.x, L = l.symbolic.y;
      return ["(" + y + ")*(" + R + ")-(" + y + ")*(" + O + ")-(" + v + ")*(" + R + ")+(" + v + ")*(" + O + ")-(" + L + ")*(" + Z + ")+(" + L + ")*(" + u + ")+(" + S + ")*(" + Z + ")-(" + S + ")*(" + u + ")", "(" + L + ")*(" + u + ")-(" + L + ")*(" + O + ")-(" + y + ")*(" + u + ")+(" + y + ")*(" + O + ")-(" + R + ")*(" + v + ")+(" + R + ")*(" + S + ")+(" + Z + ")*(" + v + ")-(" + Z + ")*(" + S + ")"];
    }, l;
  }, d.Z.createParallel = function(e, t, o) {
    var s, n, h, l, p, u, v = 1;
    for (p = 0; p < t.length; ++p)
      t[p] = e.select(t[p]);
    return s = null, t.length === 3 ? (s = (t = a.Z.providePoints(e, t, o, "point"))[2], v = 0) : a.Z.isPointType(e, t[0]) ? (s = a.Z.providePoints(e, [t[0]], o, "point")[0], l = function() {
      return t[1].stdform;
    }) : a.Z.isPointType(e, t[1]) && (s = a.Z.providePoints(e, [t[1]], o, "point")[0], l = function() {
      return t[0].stdform;
    }), a.Z.exists(o.layer) || (o.layer = e.options.layer.line), u = a.Z.copyAttributes(o, e.options, "parallel", "point"), (n = v === 1 ? e.create("point", [function() {
      return k.Z.crossProduct([1, 0, 0], l());
    }], u) : e.create("parallelpoint", t, u)).isDraggable = !0, u = a.Z.copyAttributes(o, e.options, "parallel"), (h = e.create("line", [s, n], u)).elType = "parallel", h.subs = { point: n }, h.inherits.push(n), h.setParents([t[0].id, t[1].id]), t.length === 3 && h.addParents(t[2].id), h.point = n, h;
  }, d.Z.createArrowParallel = function(e, t, o) {
    var s;
    try {
      return o.firstArrow = !1, o.lastArrow = !0, (s = d.Z.createParallel(e, t, o).setAttribute({ straightFirst: !1, straightLast: !1 })).elType = "arrowparallel", s;
    } catch {
      throw new Error("JSXGraph: Can't create arrowparallel with parent types '" + typeof t[0] + "' and '" + typeof t[1] + `'.
Possible parent types: [line,point], [point,point,point]`);
    }
  }, d.Z.createNormal = function(e, t, o) {
    var s, n, h, l, p, u, v, Z, y;
    for (l = 0; l < t.length; ++l)
      t[l] = e.select(t[l]);
    if (t.length === 1)
      s = t[0], n = s.slideObject;
    else {
      if (t.length !== 2)
        throw new Error("JSXGraph: Can't create normal with parent types '" + typeof t[0] + "' and '" + typeof t[1] + `'.
Possible parent types: [point,line], [point,circle], [glider]`);
      if (a.Z.isPointType(e, t[0]))
        s = a.Z.providePoints(e, [t[0]], o, "point")[0], n = t[1];
      else {
        if (!a.Z.isPointType(e, t[1]))
          throw new Error("JSXGraph: Can't create normal with parent types '" + typeof t[0] + "' and '" + typeof t[1] + `'.
Possible parent types: [point,line], [point,circle], [glider]`);
        n = t[0], s = a.Z.providePoints(e, [t[1]], o, "point")[0];
      }
    }
    if (v = a.Z.copyAttributes(o, e.options, "normal"), n.elementClass === x.Z.OBJECT_CLASS_LINE)
      y = a.Z.copyAttributes(o, e.options, "normal", "point"), Z = e.create("point", [function() {
        var O = k.Z.crossProduct([1, 0, 0], n.stdform);
        return [O[0], -O[2], O[1]];
      }], y), Z.isDraggable = !0, (h = e.create("line", [s, Z], v)).point = Z, h.subs = { point: Z }, h.inherits.push(Z);
    else if (n.elementClass === x.Z.OBJECT_CLASS_CIRCLE)
      h = e.create("line", [n.midpoint, s], v);
    else if (n.elementClass === x.Z.OBJECT_CLASS_CURVE)
      a.Z.evaluate(n.visProp.curvetype) !== "plot" ? (p = n.X, u = n.Y, h = e.create("line", [function() {
        return -s.X() * c.Z.D(p)(s.position) - s.Y() * c.Z.D(u)(s.position);
      }, function() {
        return c.Z.D(p)(s.position);
      }, function() {
        return c.Z.D(u)(s.position);
      }], v)) : h = e.create("line", [function() {
        var O, S, R, L, B, X, F, G, W, H, q = Math.floor(s.position), oe = s.position - q;
        if (n.bezierdegree === 1)
          q === n.numberPoints - 1 && (q -= 1, oe = 1);
        else {
          if (n.bezierDegree !== 3)
            return 0;
          q = 3 * Math.floor(s.position * (n.numberPoints - 1) / 3), R = (s.position * (n.numberPoints - 1) - q) / 3, q >= n.numberPoints - 1 && (q = n.numberPoints - 4, R = 1);
        }
        return q < 0 ? 1 : n.bezierDegree === 1 ? (n.Y(q) + oe * (n.Y(q + 1) - n.Y(q))) * (n.Y(q) - n.Y(q + 1)) - (n.X(q) + oe * (n.X(q + 1) - n.X(q))) * (n.X(q + 1) - n.X(q)) : (L = n.points[q].usrCoords, B = n.points[q + 1].usrCoords, X = n.points[q + 2].usrCoords, F = n.points[q + 3].usrCoords, G = (1 - R) * (1 - R) * (B[1] - L[1]) + 2 * (1 - R) * R * (X[1] - B[1]) + R * R * (F[1] - X[1]), W = (1 - R) * (1 - R) * (B[2] - L[2]) + 2 * (1 - R) * R * (X[2] - B[2]) + R * R * (F[2] - X[2]), G /= H = Math.sqrt(G * G + W * W), W /= H, S = [1, (O = s.coords.usrCoords)[1] - W, O[2] + G], O[2] * S[1] - O[1] * S[2]);
      }, function() {
        var O, S, R, L, B, X, F, G, W, H = Math.floor(s.position);
        if (n.bezierdegree === 1)
          H === n.numberPoints - 1 && (H -= 1);
        else {
          if (n.bezierDegree !== 3)
            return 0;
          H = 3 * Math.floor(s.position * (n.numberPoints - 1) / 3), S = (s.position * (n.numberPoints - 1) - H) / 3, H >= n.numberPoints - 1 && (H = n.numberPoints - 4, S = 1);
        }
        return H < 0 ? 0 : n.bezierDegree === 1 ? n.X(H + 1) - n.X(H) : (R = n.points[H].usrCoords, L = n.points[H + 1].usrCoords, B = n.points[H + 2].usrCoords, X = n.points[H + 3].usrCoords, F = (1 - S) * (1 - S) * (L[1] - R[1]) + 2 * (1 - S) * S * (B[1] - L[1]) + S * S * (X[1] - B[1]), G = (1 - S) * (1 - S) * (L[2] - R[2]) + 2 * (1 - S) * S * (B[2] - L[2]) + S * S * (X[2] - B[2]), F /= W = Math.sqrt(F * F + G * G), G /= W, [1, (O = s.coords.usrCoords)[1] - G, O[2] + F][2] - O[2]);
      }, function() {
        var O, S, R, L, B, X, F, G, W, H, q = Math.floor(s.position);
        if (n.bezierdegree === 1)
          q === n.numberPoints - 1 && (q -= 1);
        else {
          if (n.bezierDegree !== 3)
            return 0;
          q = 3 * Math.floor(s.position * (n.numberPoints - 1) / 3), R = (s.position * (n.numberPoints - 1) - q) / 3, q >= n.numberPoints - 1 && (q = n.numberPoints - 4, R = 1);
        }
        return q < 0 ? 0 : n.bezierDegree === 1 ? n.Y(q + 1) - n.Y(q) : (L = n.points[q].usrCoords, B = n.points[q + 1].usrCoords, X = n.points[q + 2].usrCoords, F = n.points[q + 3].usrCoords, G = (1 - R) * (1 - R) * (B[1] - L[1]) + 2 * (1 - R) * R * (X[1] - B[1]) + R * R * (F[1] - X[1]), W = (1 - R) * (1 - R) * (B[2] - L[2]) + 2 * (1 - R) * R * (X[2] - B[2]) + R * R * (F[2] - X[2]), G /= H = Math.sqrt(G * G + W * W), W /= H, S = [1, (O = s.coords.usrCoords)[1] - W, O[2] + G], O[1] - S[1]);
      }], v);
    else {
      if (n.type !== x.Z.OBJECT_TYPE_TURTLE)
        throw new Error("JSXGraph: Can't create normal with parent types '" + typeof t[0] + "' and '" + typeof t[1] + `'.
Possible parent types: [point,line], [point,circle], [glider]`);
      h = e.create("line", [function() {
        var O, S, R = Math.floor(s.position), L = s.position - R;
        for (S = 0; S < n.objects.length; S++)
          if ((O = n.objects[S]).type === x.Z.OBJECT_TYPE_CURVE) {
            if (R < O.numberPoints)
              break;
            R -= O.numberPoints;
          }
        return R === O.numberPoints - 1 && (R -= 1, L = 1), R < 0 ? 1 : (O.Y(R) + L * (O.Y(R + 1) - O.Y(R))) * (O.Y(R) - O.Y(R + 1)) - (O.X(R) + L * (O.X(R + 1) - O.X(R))) * (O.X(R + 1) - O.X(R));
      }, function() {
        var O, S, R = Math.floor(s.position);
        for (S = 0; S < n.objects.length; S++)
          if ((O = n.objects[S]).type === x.Z.OBJECT_TYPE_CURVE) {
            if (R < O.numberPoints)
              break;
            R -= O.numberPoints;
          }
        return R === O.numberPoints - 1 && (R -= 1), R < 0 ? 0 : O.X(R + 1) - O.X(R);
      }, function() {
        var O, S, R = Math.floor(s.position);
        for (S = 0; S < n.objects.length; S++)
          if ((O = n.objects[S]).type === x.Z.OBJECT_TYPE_CURVE) {
            if (R < O.numberPoints)
              break;
            R -= O.numberPoints;
          }
        return R === O.numberPoints - 1 && (R -= 1), R < 0 ? 0 : O.Y(R + 1) - O.Y(R);
      }], v);
    }
    return h.elType = "normal", h.setParents(t), a.Z.exists(s._is_new) ? (h.addChild(s), delete s._is_new) : s.addChild(h), n.addChild(h), h;
  }, d.Z.createBisector = function(e, t, o) {
    var s, n, h, l;
    if (t = a.Z.providePoints(e, t, o, "point"), a.Z.isPoint(t[0]) && a.Z.isPoint(t[1]) && a.Z.isPoint(t[2])) {
      for ((l = a.Z.copyAttributes(o, e.options, "bisector", "point")).snapToGrid = !1, (s = e.create("point", [function() {
        return _.Z.angleBisector(t[0], t[1], t[2], e);
      }], l)).dump = !1, h = 0; h < 3; h++)
        a.Z.exists(t[h]._is_new) ? (s.addChild(t[h]), delete t[h]._is_new) : t[h].addChild(s);
      return a.Z.exists(o.layer) || (o.layer = e.options.layer.line), l = a.Z.copyAttributes(o, e.options, "bisector"), (n = d.Z.createLine(e, [t[1], s], l)).point = s, n.elType = "bisector", n.setParents(t), n.subs = { point: s }, n.inherits.push(s), n;
    }
    throw new Error("JSXGraph: Can't create angle bisector with parent types '" + typeof t[0] + "' and '" + typeof t[1] + `'.
Possible parent types: [point,point,point]`);
  }, d.Z.createAngularBisectorsOfTwoLines = function(e, t, o) {
    var s, n, h, l, p = e.select(t[0]), u = e.select(t[1]);
    if (p.elementClass !== x.Z.OBJECT_CLASS_LINE || u.elementClass !== x.Z.OBJECT_CLASS_LINE)
      throw new Error("JSXGraph: Can't create angle bisectors of two lines with parent types '" + typeof t[0] + "' and '" + typeof t[1] + `'.
Possible parent types: [line,line]`);
    return a.Z.exists(o.layer) || (o.layer = e.options.layer.line), h = a.Z.copyAttributes(o, e.options, "bisectorlines", "line1"), s = e.create("line", [function() {
      var v = Math.sqrt(p.stdform[1] * p.stdform[1] + p.stdform[2] * p.stdform[2]), Z = Math.sqrt(u.stdform[1] * u.stdform[1] + u.stdform[2] * u.stdform[2]);
      return p.stdform[0] / v - u.stdform[0] / Z;
    }, function() {
      var v = Math.sqrt(p.stdform[1] * p.stdform[1] + p.stdform[2] * p.stdform[2]), Z = Math.sqrt(u.stdform[1] * u.stdform[1] + u.stdform[2] * u.stdform[2]);
      return p.stdform[1] / v - u.stdform[1] / Z;
    }, function() {
      var v = Math.sqrt(p.stdform[1] * p.stdform[1] + p.stdform[2] * p.stdform[2]), Z = Math.sqrt(u.stdform[1] * u.stdform[1] + u.stdform[2] * u.stdform[2]);
      return p.stdform[2] / v - u.stdform[2] / Z;
    }], h), a.Z.exists(o.layer) || (o.layer = e.options.layer.line), h = a.Z.copyAttributes(o, e.options, "bisectorlines", "line2"), n = e.create("line", [function() {
      var v = Math.sqrt(p.stdform[1] * p.stdform[1] + p.stdform[2] * p.stdform[2]), Z = Math.sqrt(u.stdform[1] * u.stdform[1] + u.stdform[2] * u.stdform[2]);
      return p.stdform[0] / v + u.stdform[0] / Z;
    }, function() {
      var v = Math.sqrt(p.stdform[1] * p.stdform[1] + p.stdform[2] * p.stdform[2]), Z = Math.sqrt(u.stdform[1] * u.stdform[1] + u.stdform[2] * u.stdform[2]);
      return p.stdform[1] / v + u.stdform[1] / Z;
    }, function() {
      var v = Math.sqrt(p.stdform[1] * p.stdform[1] + p.stdform[2] * p.stdform[2]), Z = Math.sqrt(u.stdform[1] * u.stdform[1] + u.stdform[2] * u.stdform[2]);
      return p.stdform[2] / v + u.stdform[2] / Z;
    }], h), l = new Re({ line1: s, line2: n }), s.dump = !1, n.dump = !1, l.elType = "bisectorlines", l.setParents([p.id, u.id]), l.subs = { line1: s, line2: n }, l;
  }, d.Z.createCircumcenter = function(e, t, o) {
    var s, n, h, l, p;
    if (t = a.Z.providePoints(e, t, o, "point"), a.Z.isPoint(t[0]) && a.Z.isPoint(t[1]) && a.Z.isPoint(t[2])) {
      for (h = t[0], l = t[1], p = t[2], s = d.Z.createPoint(e, [function() {
        return _.Z.circumcenter(h, l, p, e);
      }], o), n = 0; n < 3; n++)
        a.Z.exists(t[n]._is_new) ? (s.addChild(t[n]), delete t[n]._is_new) : t[n].addChild(s);
      return s.elType = "circumcenter", s.setParents(t), s.generatePolynomial = function() {
        var u = h.symbolic.x, v = h.symbolic.y, Z = l.symbolic.x, y = l.symbolic.y, O = p.symbolic.x, S = p.symbolic.y, R = s.symbolic.x, L = s.symbolic.y;
        return [["((", R, ")-(", u, "))^2+((", L, ")-(", v, "))^2-((", R, ")-(", Z, "))^2-((", L, ")-(", y, "))^2"].join(""), ["((", R, ")-(", u, "))^2+((", L, ")-(", v, "))^2-((", R, ")-(", O, "))^2-((", L, ")-(", S, "))^2"].join("")];
      }, s;
    }
    throw new Error("JSXGraph: Can't create circumcircle midpoint with parent types '" + typeof t[0] + "', '" + typeof t[1] + "' and '" + typeof t[2] + `'.
Possible parent types: [point,point,point]`);
  }, d.Z.createIncenter = function(e, t, o) {
    var s, n, h, l, p;
    if (!((t = a.Z.providePoints(e, t, o, "point")).length >= 3 && a.Z.isPoint(t[0]) && a.Z.isPoint(t[1]) && a.Z.isPoint(t[2])))
      throw new Error("JSXGraph: Can't create incenter with parent types '" + typeof t[0] + "', '" + typeof t[1] + "' and '" + typeof t[2] + `'.
Possible parent types: [point,point,point]`);
    for (n = t[0], h = t[1], l = t[2], s = e.create("point", [function() {
      var u, v, Z;
      return u = Math.sqrt((h.X() - l.X()) * (h.X() - l.X()) + (h.Y() - l.Y()) * (h.Y() - l.Y())), v = Math.sqrt((n.X() - l.X()) * (n.X() - l.X()) + (n.Y() - l.Y()) * (n.Y() - l.Y())), Z = Math.sqrt((h.X() - n.X()) * (h.X() - n.X()) + (h.Y() - n.Y()) * (h.Y() - n.Y())), new b.Z(x.Z.COORDS_BY_USER, [(u * n.X() + v * h.X() + Z * l.X()) / (u + v + Z), (u * n.Y() + v * h.Y() + Z * l.Y()) / (u + v + Z)], e);
    }], o), p = 0; p < 3; p++)
      a.Z.exists(t[p]._is_new) ? (s.addChild(t[p]), delete t[p]._is_new) : t[p].addChild(s);
    return s.elType = "incenter", s.setParents(t), s;
  }, d.Z.createCircumcircle = function(e, t, o) {
    var s, n, h, l;
    if ((t = a.Z.providePoints(e, t, o, "point")) === !1)
      throw new Error("JSXGraph: Can't create circumcircle with parent types '" + typeof t[0] + "', '" + typeof t[1] + "' and '" + typeof t[2] + `'.
Possible parent types: [point,point,point]`);
    try {
      for (h = a.Z.copyAttributes(o, e.options, "circumcircle", "center"), (s = d.Z.createCircumcenter(e, t, h)).dump = !1, a.Z.exists(o.layer) || (o.layer = e.options.layer.circle), h = a.Z.copyAttributes(o, e.options, "circumcircle"), (n = d.Z.createCircle(e, [s, t[0]], h)).elType = "circumcircle", n.setParents(t), n.subs = { center: s }, n.inherits.push(n), l = 0; l < 3; l++)
        a.Z.exists(t[l]._is_new) ? (n.addChild(t[l]), delete t[l]._is_new) : t[l].addChild(n);
    } catch {
      throw new Error("JSXGraph: Can't create circumcircle with parent types '" + typeof t[0] + "', '" + typeof t[1] + "' and '" + typeof t[2] + `'.
Possible parent types: [point,point,point]`);
    }
    return n;
  }, d.Z.createIncircle = function(e, t, o) {
    var s, n, h, l;
    if ((t = a.Z.providePoints(e, t, o, "point")) === !1)
      throw new Error("JSXGraph: Can't create circumcircle with parent types '" + typeof t[0] + "', '" + typeof t[1] + "' and '" + typeof t[2] + `'.
Possible parent types: [point,point,point]`);
    try {
      for (l = a.Z.copyAttributes(o, e.options, "incircle", "center"), (n = d.Z.createIncenter(e, t, l)).dump = !1, a.Z.exists(o.layer) || (o.layer = e.options.layer.circle), l = a.Z.copyAttributes(o, e.options, "incircle"), (h = d.Z.createCircle(e, [n, function() {
        var p = Math.sqrt((t[1].X() - t[2].X()) * (t[1].X() - t[2].X()) + (t[1].Y() - t[2].Y()) * (t[1].Y() - t[2].Y())), u = Math.sqrt((t[0].X() - t[2].X()) * (t[0].X() - t[2].X()) + (t[0].Y() - t[2].Y()) * (t[0].Y() - t[2].Y())), v = Math.sqrt((t[1].X() - t[0].X()) * (t[1].X() - t[0].X()) + (t[1].Y() - t[0].Y()) * (t[1].Y() - t[0].Y())), Z = (p + u + v) / 2;
        return Math.sqrt((Z - p) * (Z - u) * (Z - v) / Z);
      }], l)).elType = "incircle", h.setParents(t), s = 0; s < 3; s++)
        a.Z.exists(t[s]._is_new) ? (h.addChild(t[s]), delete t[s]._is_new) : t[s].addChild(h);
      h.center = n, h.subs = { center: h.center }, h.inherits.push(n);
    } catch {
      throw new Error("JSXGraph: Can't create circumcircle with parent types '" + typeof t[0] + "', '" + typeof t[1] + "' and '" + typeof t[2] + `'.
Possible parent types: [point,point,point]`);
    }
    return h;
  }, d.Z.createReflection = function(e, t, o) {
    var s, n, h, l, p, u, v, Z, y = `
Possible parent types: [point|line|curve|polygon|circle|arc|sector, line]`;
    for (u = 0; u < t.length; ++u)
      t[u] = e.select(t[u]);
    if (v = a.Z.copyAttributes(o, e.options, "reflection"), a.Z.isPoint(t[0]))
      n = a.Z.providePoints(e, [t[0]], Z)[0];
    else {
      if (t[0].elementClass !== x.Z.OBJECT_CLASS_CURVE && t[0].elementClass !== x.Z.OBJECT_CLASS_LINE && t[0].type !== x.Z.OBJECT_TYPE_POLYGON && t[0].elementClass !== x.Z.OBJECT_CLASS_CIRCLE)
        throw new Error("JSXGraph: Can't create reflection element with parent types '" + typeof t[0] + "' and '" + typeof t[1] + "'." + y);
      n = t[0];
    }
    if (t[1].elementClass !== x.Z.OBJECT_CLASS_LINE)
      throw new Error("JSXGraph: Can't create reflected element with parent types '" + typeof t[0] + "' and '" + typeof t[1] + "'." + y);
    if (s = t[1], p = d.Z.createTransform(e, [s], { type: "reflect" }), a.Z.isPoint(n))
      h = d.Z.createPoint(e, [n, p], v);
    else if (n.elementClass === x.Z.OBJECT_CLASS_CURVE)
      h = d.Z.createCurve(e, [n, p], v);
    else if (n.elementClass === x.Z.OBJECT_CLASS_LINE)
      h = d.Z.createLine(e, [n, p], v);
    else if (n.type === x.Z.OBJECT_TYPE_POLYGON)
      h = d.Z.createPolygon(e, [n, p], v);
    else {
      if (n.elementClass !== x.Z.OBJECT_CLASS_CIRCLE)
        throw new Error("JSXGraph: Can't create reflected element with parent types '" + typeof t[0] + "' and '" + typeof t[1] + "'." + y);
      v.type.toLowerCase() === "euclidean" ? (Z = a.Z.copyAttributes(o, e.options, "reflection", "center"), (l = d.Z.createPoint(e, [n.center, p], Z)).prepareUpdate().update().updateVisibility(a.Z.evaluate(l.visProp.visible)).updateRenderer(), h = d.Z.createCircle(e, [l, function() {
        return n.Radius();
      }], v)) : h = d.Z.createCircle(e, [n, p], v);
    }
    return a.Z.exists(n._is_new) && (h.addChild(n), delete n._is_new), s.addChild(h), h.elType = "reflection", h.addParents(s), h.prepareUpdate().update(), a.Z.isPoint(h) && (h.generatePolynomial = function() {
      var O = s.point1.symbolic.x, S = s.point1.symbolic.y, R = s.point2.symbolic.x, L = s.point2.symbolic.y, B = n.symbolic.x, X = n.symbolic.y, F = h.symbolic.x, G = h.symbolic.y;
      return [["((", G, ")-(", X, "))*((", S, ")-(", L, "))+((", O, ")-(", R, "))*((", F, ")-(", B, "))"].join(""), ["((", F, ")-(", O, "))^2+((", G, ")-(", S, "))^2-((", B, ")-(", O, "))^2-((", X, ")-(", S, "))^2"].join("")];
    }), h;
  }, d.Z.createMirrorElement = function(e, t, o) {
    var s, n, h, l, p, u, v, Z, y = `
Possible parent types: [point|line|curve|polygon|circle|arc|sector, point]`;
    for (n = 0; n < t.length; ++n)
      t[n] = e.select(t[n]);
    if (v = a.Z.copyAttributes(o, e.options, "mirrorelement"), a.Z.isPoint(t[0]))
      s = a.Z.providePoints(e, [t[0]], v)[0];
    else {
      if (t[0].elementClass !== x.Z.OBJECT_CLASS_CURVE && t[0].elementClass !== x.Z.OBJECT_CLASS_LINE && t[0].type !== x.Z.OBJECT_TYPE_POLYGON && t[0].elementClass !== x.Z.OBJECT_CLASS_CIRCLE)
        throw new Error("JSXGraph: Can't create mirror element with parent types '" + typeof t[0] + "' and '" + typeof t[1] + "'." + y);
      s = t[0];
    }
    if (!a.Z.isPoint(t[1]))
      throw new Error("JSXGraph: Can't create mirror element with parent types '" + typeof t[0] + "' and '" + typeof t[1] + "'." + y);
    if (Z = a.Z.copyAttributes(o, e.options, "mirrorelement", "point"), h = a.Z.providePoints(e, [t[1]], Z)[0], u = d.Z.createTransform(e, [Math.PI, h], { type: "rotate" }), a.Z.isPoint(s))
      l = d.Z.createPoint(e, [s, u], v);
    else if (s.elementClass === x.Z.OBJECT_CLASS_CURVE)
      l = d.Z.createCurve(e, [s, u], v);
    else if (s.elementClass === x.Z.OBJECT_CLASS_LINE)
      l = d.Z.createLine(e, [s, u], v);
    else if (s.type === x.Z.OBJECT_TYPE_POLYGON)
      l = d.Z.createPolygon(e, [s, u], v);
    else {
      if (s.elementClass !== x.Z.OBJECT_CLASS_CIRCLE)
        throw new Error("JSXGraph: Can't create mirror element with parent types '" + typeof t[0] + "' and '" + typeof t[1] + "'." + y);
      v.type.toLowerCase() === "euclidean" ? (Z = a.Z.copyAttributes(o, e.options, "mirrorelement", "center"), (p = d.Z.createPoint(e, [s.center, u], Z)).prepareUpdate().update().updateVisibility(a.Z.evaluate(p.visProp.visible)).updateRenderer(), l = d.Z.createCircle(e, [p, function() {
        return s.Radius();
      }], v)) : l = d.Z.createCircle(e, [s, u], v);
    }
    return a.Z.exists(s._is_new) && (l.addChild(s), delete s._is_new), h.addChild(l), l.elType = "mirrorelement", l.addParents(h), l.prepareUpdate().update(), l;
  }, d.Z.createMirrorPoint = function(e, t, o) {
    var s = d.Z.createMirrorElement(e, t, o);
    return s.elType = "mirrorpoint", s;
  }, d.Z.createIntegral = function(e, t, o) {
    var s, n, h, l, p, u, v, Z, y, O, S, R, L, B, X = null;
    if (a.Z.isArray(t[0]) && t[1].elementClass === x.Z.OBJECT_CLASS_CURVE)
      s = t[0], n = t[1];
    else {
      if (!a.Z.isArray(t[1]) || t[0].elementClass !== x.Z.OBJECT_CLASS_CURVE)
        throw new Error("JSXGraph: Can't create integral with parent types '" + typeof t[0] + "' and '" + typeof t[1] + `'.
Possible parent types: [[number|function,number|function],curve]`);
      s = t[1], n = t[0];
    }
    return (h = a.Z.copyAttributes(o, e.options, "integral")).withLabel = !1, B = e.create("curve", [[0], [0]], h), l = s[0], p = s[1], a.Z.isFunction(l) ? (v = function() {
      return n.Y(u());
    }, l = (u = l)()) : (u = l, v = n.Y(l)), a.Z.isFunction(p) ? (y = function() {
      return n.Y(Z());
    }, p = (Z = p)()) : (Z = p, y = n.Y(p)), h = a.Z.copyAttributes(o, e.options, "integral", "curveLeft"), O = e.create("glider", [u, v, n], h), a.Z.isFunction(u) && O.hideElement(), h = a.Z.copyAttributes(o, e.options, "integral", "baseLeft"), S = e.create("point", [function() {
      return a.Z.evaluate(B.visProp.axis) === "y" ? 0 : O.X();
    }, function() {
      return a.Z.evaluate(B.visProp.axis) === "y" ? O.Y() : 0;
    }], h), h = a.Z.copyAttributes(o, e.options, "integral", "curveRight"), R = e.create("glider", [Z, y, n], h), a.Z.isFunction(Z) && R.hideElement(), h = a.Z.copyAttributes(o, e.options, "integral", "baseRight"), L = e.create("point", [function() {
      return a.Z.evaluate(B.visProp.axis) === "y" ? 0 : R.X();
    }, function() {
      return a.Z.evaluate(B.visProp.axis) === "y" ? R.Y() : 0;
    }], h), (h = a.Z.copyAttributes(o, e.options, "integral")).withlabel !== !1 && h.axis !== "y" && (h = a.Z.copyAttributes(o, e.options, "integral", "label"), h = a.Z.copyAttributes(h, e.options, "label"), (X = e.create("text", [function() {
      var F = new b.Z(x.Z.COORDS_BY_SCREEN, [a.Z.evaluate(this.visProp.offset[0]) + this.board.origin.scrCoords[1], 0], this.board, !1), G = this.board.getBoundingBox(), W = 0.1 * (G[2] - G[0]), H = R.X();
      return H < G[0] ? H = G[0] + W : H > G[2] && (H = G[2] - W), H + F.usrCoords[1];
    }, function() {
      var F = new b.Z(x.Z.COORDS_BY_SCREEN, [0, a.Z.evaluate(this.visProp.offset[1]) + this.board.origin.scrCoords[2]], this.board, !1), G = this.board.getBoundingBox(), W = 0.1 * (G[1] - G[3]), H = R.Y();
      return H > G[1] ? H = G[1] - W : H < G[3] && (H = G[3] + W), H + F.usrCoords[2];
    }, function() {
      var F = c.Z.NewtonCotes([S.X(), L.X()], n.Y);
      return "&int; = " + a.Z.toFixed(F, 4);
    }], h)).dump = !1, O.addChild(X), R.addChild(X)), O.dump = !1, S.dump = !1, R.dump = !1, L.dump = !1, B.elType = "integral", B.setParents([n.id, s]), B.subs = { curveLeft: O, baseLeft: S, curveRight: R, baseRight: L }, B.inherits.push(O, S, R, L), h.withLabel && (B.subs.label = X, B.inherits.push(X)), B.Value = function() {
      return c.Z.I([S.X(), L.X()], n.Y);
    }, B.updateDataArray = function() {
      var F, G, W, H, q, oe, ee, he, re;
      if (a.Z.evaluate(this.visProp.axis) === "y") {
        for (O.Y() < R.Y() ? (oe = O.X(), he = O.Y(), ee = R.X(), re = R.Y()) : (oe = R.X(), he = R.Y(), ee = O.X(), re = O.Y()), H = Math.min(oe, ee), q = Math.max(oe, ee), F = [0, oe], G = [he, he], W = 0; W < n.numberPoints; W++)
          he <= n.points[W].usrCoords[2] && H <= n.points[W].usrCoords[1] && n.points[W].usrCoords[2] <= re && n.points[W].usrCoords[1] <= q && (F.push(n.points[W].usrCoords[1]), G.push(n.points[W].usrCoords[2]));
        F.push(ee), G.push(re), F.push(0), G.push(re), F.push(0), G.push(he);
      } else {
        for (S.X() < L.X() ? (H = S.X(), q = L.X()) : (H = L.X(), q = S.X()), F = [H, H], G = [0, n.Y(H)], W = 0; W < n.numberPoints; W++)
          H <= n.points[W].usrCoords[1] && n.points[W].usrCoords[1] <= q && (F.push(n.points[W].usrCoords[1]), G.push(n.points[W].usrCoords[2]));
        F.push(q), G.push(n.Y(q)), F.push(q), G.push(0), F.push(H), G.push(0);
      }
      this.dataX = F, this.dataY = G;
    }, O.addChild(B), R.addChild(B), S.addChild(B), L.addChild(B), B.baseLeft = S, B.baseRight = L, B.curveLeft = O, B.curveRight = R, B.methodMap = d.Z.deepCopy(B.methodMap, { curveLeft: "curveLeft", baseLeft: "baseLeft", curveRight: "curveRight", baseRight: "baseRight", Value: "Value" }), B.label = X, B;
  }, d.Z.createGrid = function(e, t, o) {
    var s, n;
    return n = a.Z.copyAttributes(o, e.options, "grid"), (s = e.create("curve", [[null], [null]], n)).elType = "grid", s.type = x.Z.OBJECT_TYPE_GRID, s.updateDataArray = function() {
      var h, l, p, u, v, Z = a.Z.evaluate(this.visProp.gridx), y = a.Z.evaluate(this.visProp.gridy);
      for (u = a.Z.isArray(this.visProp.topleft) ? new b.Z(a.Z.evaluate(this.visProp.tltype) || x.Z.COORDS_BY_USER, this.visProp.topleft, e) : new b.Z(x.Z.COORDS_BY_SCREEN, [0, 0], e), v = a.Z.isArray(this.visProp.bottomright) ? new b.Z(a.Z.evaluate(this.visProp.brtype) || x.Z.COORDS_BY_USER, this.visProp.bottomright, e) : new b.Z(x.Z.COORDS_BY_SCREEN, [e.canvasWidth, e.canvasHeight], e), e.options.grid.hasGrid = !0, s.dataX = [], s.dataY = [], h = Math.floor(u.usrCoords[2] / y) * y, l = Math.ceil(v.usrCoords[2] / y) * y, u.usrCoords[2] < v.usrCoords[2] && (h = Math.ceil(v.usrCoords[2] / y) * y, l = Math.floor(u.usrCoords[2] / y) * y), p = h; p > l - y; p -= y)
        s.dataX.push(u.usrCoords[1], v.usrCoords[1], NaN), s.dataY.push(p, p, NaN);
      for (h = Math.ceil(u.usrCoords[1] / Z) * Z, l = Math.floor(v.usrCoords[1] / Z) * Z, u.usrCoords[1] > v.usrCoords[1] && (h = Math.floor(v.usrCoords[1] / Z) * Z, l = Math.ceil(u.usrCoords[1] / Z) * Z), p = h; p < l + Z; p += Z)
        s.dataX.push(p, p, NaN), s.dataY.push(u.usrCoords[2], v.usrCoords[2], NaN);
    }, s.hasPoint = function() {
      return !1;
    }, e.grids.push(s), s;
  }, d.Z.createInequality = function(e, t, o) {
    var s, n, h;
    if (h = a.Z.copyAttributes(o, e.options, "inequality"), t[0].elementClass === x.Z.OBJECT_CLASS_LINE)
      (n = e.create("curve", [[], []], h)).hasPoint = function() {
        return !1;
      }, n.updateDataArray = function() {
        var l, p, u, v = e.getBoundingBox(), Z = h.inverse ? -1 : 1, y = 1.5 * Math.max(v[2] - v[0], v[1] - v[3]), O = { coords: { usrCoords: [1, (v[0] + v[2]) / 2, h.inverse ? v[1] : v[3]] } }, S = t[0].stdform.slice(1), R = S;
        u = 1.5 * Math.max(_.Z.perpendicular(t[0], O, e)[0].distance(x.Z.COORDS_BY_USER, O.coords), y), u *= Z, O = { coords: { usrCoords: [1, (v[0] + v[2]) / 2, (v[1] + v[3]) / 2] } }, l = [1, (O = Math.abs(k.Z.innerProduct(O.coords.usrCoords, t[0].stdform, 3)) >= k.Z.eps ? _.Z.perpendicular(t[0], O, e)[0].usrCoords : O.coords.usrCoords)[1] + S[1] * y, O[2] - S[0] * y], p = [1, O[1] - R[1] * y, O[2] + R[0] * y], this.dataX = [l[1], l[1] + S[0] * u, p[1] + R[0] * u, p[1], l[1]], this.dataY = [l[2], l[2] + S[1] * u, p[2] + R[1] * u, p[2], l[2]];
      };
    else if (t[0].elementClass === x.Z.OBJECT_CLASS_CURVE && t[0].visProp.curvetype === "functiongraph")
      (n = e.create("curve", [[], []], h)).updateDataArray = function() {
        var l, p, u, v, Z, y, O, S, R, L = this.board.getBoundingBox(), B = [], X = t[0].minX(), F = t[0].maxX(), G = 0.3 * (L[1] - L[3]);
        if (l = a.Z.evaluate(this.visProp.inverse) ? 1 : 3, this.dataX = [], this.dataY = [], (v = t[0].points.length) !== 0)
          for (L[1] += G, L[3] -= G, u = -1; u < v - 1; ) {
            for (Z = u + 1, p = v; Z < v; Z++)
              if (t[0].points[Z].isReal()) {
                p = Z;
                break;
              }
            if (p >= v)
              break;
            for (Z = p, u = v - 1; Z < v - 1; Z++)
              if (!t[0].points[Z + 1].isReal()) {
                u = Z;
                break;
              }
            for (S = t[0].points[p].usrCoords[1], R = t[0].points[u].usrCoords[1], y = L[0] < X ? X : L[0], O = L[2] > F ? F : L[2], y = p === 0 ? y : Math.max(y, S), O = u === v - 1 ? O : Math.min(O, R), O = u === v - 1 ? F : R, (B = []).push([1, y = p === 0 ? X : S, L[l]]), B.push([1, y, t[0].points[p].usrCoords[2]]), Z = p; Z <= u; Z++)
              B.push(t[0].points[Z].usrCoords);
            for (B.push([1, O, t[0].points[u].usrCoords[2]]), B.push([1, O, L[l]]), B.push(B[0]), Z = 0; Z < B.length; Z++)
              this.dataX.push(B[Z][1]), this.dataY.push(B[Z][2]);
            u < v - 1 && (this.dataX.push(NaN), this.dataY.push(NaN));
          }
      }, n.hasPoint = function() {
        return !1;
      };
    else if (s = a.Z.createFunction(t[0]), n.addParentsFromJCFunctions([s]), !a.Z.exists(s))
      throw new Error(`JSXGraph: Can't create area with the given parents.
Possible parent types: [line], [function]`);
    return n.addParents(t[0]), n;
  }, d.Z.registerElement("arrowparallel", d.Z.createArrowParallel), d.Z.registerElement("bisector", d.Z.createBisector), d.Z.registerElement("bisectorlines", d.Z.createAngularBisectorsOfTwoLines), d.Z.registerElement("msector", d.Z.createMsector), d.Z.registerElement("circumcircle", d.Z.createCircumcircle), d.Z.registerElement("circumcirclemidpoint", d.Z.createCircumcenter), d.Z.registerElement("circumcenter", d.Z.createCircumcenter), d.Z.registerElement("incenter", d.Z.createIncenter), d.Z.registerElement("incircle", d.Z.createIncircle), d.Z.registerElement("integral", d.Z.createIntegral), d.Z.registerElement("midpoint", d.Z.createMidpoint), d.Z.registerElement("mirrorelement", d.Z.createMirrorElement), d.Z.registerElement("mirrorpoint", d.Z.createMirrorPoint), d.Z.registerElement("normal", d.Z.createNormal), d.Z.registerElement("orthogonalprojection", d.Z.createOrthogonalProjection), d.Z.registerElement("parallel", d.Z.createParallel), d.Z.registerElement("parallelpoint", d.Z.createParallelPoint), d.Z.registerElement("perpendicular", d.Z.createPerpendicular), d.Z.registerElement("perpendicularpoint", d.Z.createPerpendicularPoint), d.Z.registerElement("perpendicularsegment", d.Z.createPerpendicularSegment), d.Z.registerElement("reflection", d.Z.createReflection), d.Z.registerElement("grid", d.Z.createGrid), d.Z.registerElement("inequality", d.Z.createInequality), d.Z.createLocus = function(e, t, o) {
    var s, n;
    if (!a.Z.isArray(t) || t.length !== 1 || !a.Z.isPoint(t[0]))
      throw new Error(`JSXGraph: Can't create locus with parent of type other than point.
Possible parent types: [point]`);
    return n = t[0], (s = e.create("curve", [[null], [null]], o)).dontCallServer = !1, s.elType = "locus", s.setParents([n.id]), s.updateDataArray = function() {
      var h, l, p;
      s.board.mode > 0 || (h = Q.generatePolynomials(e, n, !0).join("|")) !== s.spe && (s.spe = h, l = function(u, v, Z, y) {
        var O;
        s.dataX = u, s.dataY = v, s.eq = Z, s.ctime = y, s.generatePolynomial = (O = Z, function(S) {
          var R, L = "(" + S.symbolic.x + ")", B = "(" + S.symbolic.y + ")", X = [];
          for (R = 0; R < O.length; R++)
            X[R] = O[R].replace(/\*\*/g, "^").replace(/x/g, L).replace(/y/g, B);
          return X;
        });
      }, l((p = Q.geometricLocusByGroebnerBase(e, n, l)).datax, p.datay, p.polynomial, p.exectime));
    }, s;
  }, d.Z.registerElement("locus", d.Z.createLocus), __webpack_require__(573), d.Z.Image = function(e, t, o, s, n) {
    this.constructor(e, o, x.Z.OBJECT_TYPE_IMAGE, x.Z.OBJECT_CLASS_OTHER), this.element = this.board.select(o.anchor), this.coordsConstructor(t), this.W = a.Z.createFunction(n[0], this.board, ""), this.H = a.Z.createFunction(n[1], this.board, ""), this.addParentsFromJCFunctions([this.W, this.H]), this.usrSize = [this.W(), this.H()], this.size = [Math.abs(this.usrSize[0] * e.unitX), Math.abs(this.usrSize[1] * e.unitY)], this.url = s, this.elType = "image", this.span = [this.coords.usrCoords.slice(0), [this.coords.usrCoords[0], this.W(), 0], [this.coords.usrCoords[0], 0, this.H()]], this.id = this.board.setId(this, "Im"), this.board.renderer.drawImage(this), this.board.finalizeAdding(this), this.methodMap = d.Z.deepCopy(this.methodMap, { addTransformation: "addTransform", trans: "addTransform" });
  }, d.Z.Image.prototype = new Je.Z(), a.Z.copyPrototypeMethods(d.Z.Image, rt.Z, "coordsConstructor"), d.Z.extend(d.Z.Image.prototype, { hasPoint: function(e, t) {
    var o, s, n, h, l, p, u, v, Z, y = this.transformations.length;
    return a.Z.isObject(a.Z.evaluate(this.visProp.precision)) ? (h = this.board._inputDevice, l = a.Z.evaluate(this.visProp.precision[h])) : l = this.board.options.precision.hasPoint, y === 0 ? (o = e - this.coords.scrCoords[1], s = this.coords.scrCoords[2] - t, o >= -(n = l) && o - this.size[0] <= n && s >= -n && s - this.size[1] <= n) : (u = [(p = (p = new b.Z(x.Z.COORDS_BY_SCREEN, [e, t], this.board)).usrCoords)[0] - this.span[0][0], p[1] - this.span[0][1], p[2] - this.span[0][2]], 0 <= (v = (Z = k.Z.innerProduct)(u, this.span[1])) && v <= Z(this.span[1], this.span[1]) && 0 <= (v = Z(u, this.span[2])) && v <= Z(this.span[2], this.span[2]));
  }, update: function(e) {
    return this.needsUpdate ? (this.updateCoords(e), this.updateSize(), this.updateSpan(), this) : this;
  }, updateRenderer: function() {
    return this.updateRendererGeneric("updateImage");
  }, updateSize: function() {
    return this.usrSize = [this.W(), this.H()], this.size = [Math.abs(this.usrSize[0] * this.board.unitX), Math.abs(this.usrSize[1] * this.board.unitY)], this;
  }, updateSpan: function() {
    var e, t, o = this.transformations.length, s = [];
    if (o === 0)
      this.span = [[this.Z(), this.X(), this.Y()], [this.Z(), this.W(), 0], [this.Z(), 0, this.H()]];
    else {
      for (s[0] = [this.Z(), this.X(), this.Y()], s[1] = [this.Z(), this.X() + this.W(), this.Y()], s[2] = [this.Z(), this.X(), this.Y() + this.H()], e = 0; e < o; e++)
        for (t = 0; t < 3; t++)
          s[t] = k.Z.matVecMult(this.transformations[e].matrix, s[t]);
      for (t = 0; t < 3; t++)
        s[t][1] /= s[t][0], s[t][2] /= s[t][0], s[t][0] /= s[t][0];
      for (t = 1; t < 3; t++)
        s[t][0] -= s[0][0], s[t][1] -= s[0][1], s[t][2] -= s[0][2];
      this.span = s;
    }
    return this;
  }, addTransform: function(e) {
    var t;
    if (a.Z.isArray(e))
      for (t = 0; t < e.length; t++)
        this.transformations.push(e[t]);
    else
      this.transformations.push(e);
    return this;
  }, getParents: function() {
    var e = [this.url, [this.Z(), this.X(), this.Y()], this.usrSize];
    return this.parents.length !== 0 && (e = this.parents), e;
  }, setSize: function(e, t) {
    return this.W = a.Z.createFunction(e, this.board, ""), this.H = a.Z.createFunction(t, this.board, ""), this.addParentsFromJCFunctions([this.W, this.H]), this;
  }, W: function() {
  }, H: function() {
  } }), d.Z.createImage = function(e, t, o) {
    var s, n, h = t[0], l = t[1], p = t[2];
    if (s = a.Z.copyAttributes(o, e.options, "image"), !(n = rt.Z.create(d.Z.Image, e, l, s, h, p)))
      throw new Error("JSXGraph: Can't create image with parent types '" + typeof t[0] + "' and '" + typeof t[1] + `'.
Possible parent types: [x,y], [z,x,y], [element,transformation]`);
    return s.rotate !== 0 && n.addRotation(s.rotate), n;
  }, d.Z.registerElement("image", d.Z.createImage), d.Z.Image, d.Z.createSlider = function(e, t, o) {
    var s, n, h, l, p, u, v, Z, y, O, S, R, L, B, X, F, G, W, H, q, oe;
    return G = (oe = a.Z.copyAttributes(o, e.options, "slider")).withticks, F = oe.withlabel, W = oe.snapwidth, oe = a.Z.copyAttributes(o, e.options, "slider", "point1"), v = e.create("point", t[0], oe), oe = a.Z.copyAttributes(o, e.options, "slider", "point2"), Z = e.create("point", t[1], oe), oe = a.Z.copyAttributes(o, e.options, "slider", "baseline"), (O = e.create("segment", [v, Z], oe)).updateStdform(), s = v.coords.usrCoords.slice(1), n = Z.coords.usrCoords.slice(1), h = t[2][0], l = t[2][1], p = t[2][2], u = p - h, q = (H = a.Z.evaluate(W)) === -1 ? l : Math.round(l / H) * H, B = s[0] + (n[0] - s[0]) * (q - h) / (p - h), X = s[1] + (n[1] - s[1]) * (q - h) / (p - h), (oe = a.Z.copyAttributes(o, e.options, "slider")).withLabel = !1, (y = e.create("glider", [B, X, O], oe)).setAttribute({ snapwidth: W }), oe = a.Z.copyAttributes(o, e.options, "slider", "highline"), S = e.create("segment", [v, y], oe), y.Value = function() {
      var ee = this._smax - this._smin, he = a.Z.evaluate(this.visProp.snapwidth);
      return he === -1 ? this.position * ee + this._smin : Math.round((this.position * ee + this._smin) / he) * he;
    }, y.methodMap = a.Z.deepCopy(y.methodMap, { Value: "Value", setValue: "setValue", smax: "_smax", smin: "_smin", setMax: "setMax", setMin: "setMin" }), y._smax = p, y._smin = h, y.setMax = function(ee) {
      return this._smax = ee, this;
    }, y.setValue = function(ee) {
      var he = this._smax - this._smin;
      return Math.abs(he) > k.Z.eps ? this.position = (ee - this._smin) / he : this.position = 0, this.position = Math.max(0, Math.min(1, this.position)), this;
    }, y.setMin = function(ee) {
      return this._smin = ee, this;
    }, F && (oe = a.Z.copyAttributes(o, e.options, "slider", "label"), L = e.create("text", [function() {
      return 0.05 * (Z.X() - v.X()) + Z.X();
    }, function() {
      return 0.05 * (Z.Y() - v.Y()) + Z.Y();
    }, function() {
      var ee, he = a.Z.evaluate(y.visProp.digits), re = a.Z.evaluate(y.visProp.suffixlabel), _e = a.Z.evaluate(y.visProp.unitlabel), ge = a.Z.evaluate(y.visProp.postlabel);
      return he === 2 && a.Z.evaluate(y.visProp.precision) !== 2 && (he = a.Z.evaluate(y.visProp.precision)), ee = re !== null ? re : y.name && y.name !== "" ? y.name + " = " : "", ee += a.Z.toFixed(y.Value(), he), _e !== null && (ee += _e), ge !== null && (ee += ge), ee;
    }], oe), y.label = L, y.visProp.withlabel = !0, y.hasLabel = !0), y.point1 = v, y.point2 = Z, y.baseline = O, y.highline = S, G && (oe = a.Z.copyAttributes(o, e.options, "slider", "ticks"), a.Z.exists(oe.generatelabeltext) || (oe.generateLabelText = function(ee, he, re) {
      var _e = y.point1.Dist(y.point2), ge = y._smin, we = y._smax, Ne = this.getDistanceFromZero(he, ee) * (we - ge) / _e + ge;
      return _e < k.Z.eps || Math.abs(Ne) < k.Z.eps ? "0" : this.formatLabelText(Ne);
    }), R = e.create("ticks", [y.baseline, y.point1.Dist(v) / 2, function(ee) {
      var he = y.point1.Dist(y.point2), re = y.point1.coords.distance(x.Z.COORDS_BY_USER, ee);
      return he < k.Z.eps ? 0 : re / he * u + h;
    }], oe), y.ticks = R), y.remove = function() {
      F && e.removeObject(L), e.removeObject(S), e.removeObject(O), e.removeObject(Z), e.removeObject(v), ft.prototype.remove.call(y);
    }, v.dump = !1, Z.dump = !1, O.dump = !1, S.dump = !1, F && (L.dump = !1), y.elType = "slider", y.parents = t, y.subs = { point1: v, point2: Z, baseLine: O, highLine: S }, y.inherits.push(v, Z, O, S), G && (R.dump = !1, y.subs.ticks = R, y.inherits.push(R)), y.getParents = function() {
      return [this.point1.coords.usrCoords.slice(1), this.point2.coords.usrCoords.slice(1), [this._smin, this.position * (this._smax - this._smin) + this._smin, this._smax]];
    }, y.baseline.on("up", function(ee) {
      var he, re;
      a.Z.evaluate(y.visProp.moveonup) && !a.Z.evaluate(y.visProp.fixed) && (he = O.board.getMousePosition(ee, 0), re = new b.Z(x.Z.COORDS_BY_SCREEN, he, this.board), y.moveTo([re.usrCoords[1], re.usrCoords[2]]), y.triggerEventHandlers(["drag"], [ee]));
    }), y.prepareUpdate().update(), e.isSuspendedUpdate || (y.updateVisibility().updateRenderer(), y.baseline.updateVisibility().updateRenderer(), y.highline.updateVisibility().updateRenderer(), G && y.ticks.updateVisibility().updateRenderer()), y;
  }, d.Z.registerElement("slider", d.Z.createSlider), d.Z.createTapemeasure = function(e, t, o) {
    var s, n, h, l, p, u, v, Z, y, O, S;
    return s = t[0], n = t[1], h = a.Z.copyAttributes(o, e.options, "tapemeasure", "point1"), Z = e.create("point", s, h), h = a.Z.copyAttributes(o, e.options, "tapemeasure", "point2"), y = e.create("point", n, h), Z.setAttribute({ ignoredSnapToPoints: [y] }), y.setAttribute({ ignoredSnapToPoints: [Z] }), h = a.Z.copyAttributes(o, e.options, "tapemeasure"), l = h.withticks, p = h.withlabel, (u = h.digits) === 2 && h.precision !== 2 && (u = h.precision), p && (h.withlabel = !0), v = e.create("segment", [Z, y], h), p && (O = o.name && o.name !== "" ? o.name + " = " : "", v.label.setText(function() {
      return O + a.Z.toFixed(Z.Dist(y), u);
    })), l && (h = a.Z.copyAttributes(o, e.options, "tapemeasure", "ticks"), S = e.create("ticks", [v, 0.1], h), v.inherits.push(S)), v.remove = function() {
      l && v.removeTicks(S), e.removeObject(y), e.removeObject(Z), Je.Z.prototype.remove.call(this);
    }, v.Value = function() {
      return Z.Dist(y);
    }, Z.dump = !1, y.dump = !1, v.elType = "tapemeasure", v.getParents = function() {
      return [[Z.X(), Z.Y()], [y.X(), y.Y()]];
    }, v.subs = { point1: Z, point2: y }, l && (S.dump = !1), v.methodMap = d.Z.deepCopy(v.methodMap, { Value: "Value" }), v.prepareUpdate().update(), e.isSuspendedUpdate || (v.updateVisibility().updateRenderer(), v.point1.updateVisibility().updateRenderer(), v.point2.updateVisibility().updateRenderer()), v;
  }, d.Z.registerElement("tapemeasure", d.Z.createTapemeasure), d.Z.DataSource = function() {
    return this.data = [], this.columnHeaders = [], this.rowHeaders = [], this;
  }, d.Z.extend(d.Z.DataSource.prototype, { loadFromArray: function(e, t, o) {
    var s, n, h;
    if (a.Z.isArray(t) && (this.columnHeaders = t, t = !1), a.Z.isArray(o) && (this.rowHeaders = o, o = !1), this.data = [], t && (this.columnHeaders = []), o && (this.rowHeaders = []), a.Z.exists(e)) {
      for (this.data = [], s = 0; s < e.length; s++)
        for (this.data[s] = [], n = 0; n < e[s].length; n++)
          h = e[s][n], parseFloat(h).toString() === h ? this.data[s][n] = parseFloat(h) : this.data[s][n] = h !== "-" ? h : NaN;
      if (t && (this.columnHeaders = this.data[0].slice(1), this.data = this.data.slice(1)), o)
        for (this.rowHeaders = [], s = 0; s < this.data.length; s++)
          this.rowHeaders.push(this.data[s][0]), this.data[s] = this.data[s].slice(1);
    }
    return this;
  }, loadFromTable: function(e, t, o) {
    var s, n, h, l, p;
    if (a.Z.isArray(t) && (this.columnHeaders = t, t = !1), a.Z.isArray(o) && (this.rowHeaders = o, o = !1), this.data = [], t && (this.columnHeaders = []), o && (this.rowHeaders = []), e = document.getElementById(e), a.Z.exists(e)) {
      for (s = e.getElementsByTagName("tr"), this.data = [], n = 0; n < s.length; n++)
        for (l = s[n].getElementsByTagName("td"), this.data[n] = [], h = 0; h < l.length; h++)
          p = l[h].innerHTML, parseFloat(p).toString() === p ? this.data[n][h] = parseFloat(p) : this.data[n][h] = p !== "-" ? p : NaN;
      if (t && (this.columnHeaders = this.data[0].slice(1), this.data = this.data.slice(1)), o)
        for (this.rowHeaders = [], n = 0; n < this.data.length; n++)
          this.rowHeaders.push(this.data[n][0]), this.data[n] = this.data[n].slice(1);
    }
    return this;
  }, addColumn: function(e, t, o) {
    throw new Error("not implemented");
  }, addRow: function(e, t, o) {
    throw new Error("not implemented");
  }, getColumn: function(e) {
    var t, o = [];
    if (a.Z.isString(e)) {
      for (t = 0; t < this.columnHeaders.length; t++)
        if (e === this.columnHeaders[t]) {
          e = t;
          break;
        }
    }
    for (t = 0; t < this.data.length; t++)
      this.data[t].length > e && (o[t] = parseFloat(this.data[t][e]));
    return o;
  }, getRow: function(e) {
    var t, o;
    if (a.Z.isString(e)) {
      for (o = 0; o < this.rowHeaders.length; o++)
        if (e === this.rowHeaders[o]) {
          e = o;
          break;
        }
    }
    for (t = [], o = 0; o < this.data[e].length; o++)
      t[o] = this.data[e][o];
    return t;
  } });
  const Zt = d.Z.DataSource;
  d.Z.Chart = function(e, t, o) {
    var s, n, h, l, p, u;
    if (this.constructor(e, o), !a.Z.isArray(t) || t.length === 0)
      throw new Error("JSXGraph: Can't create a chart without data");
    if (this.elements = [], a.Z.isNumber(t[0]))
      for (n = t, s = [], h = 0; h < n.length; h++)
        s[h] = h + 1;
    else if (t.length === 1 && a.Z.isArray(t[0]))
      for (n = t[0], s = [], u = a.Z.evaluate(n).length, h = 0; h < u; h++)
        s[h] = h + 1;
    else
      t.length === 2 && (u = Math.min(t[0].length, t[1].length), s = t[0].slice(0, u), n = t[1].slice(0, u));
    if (a.Z.isArray(n) && n.length === 0)
      throw new Error("JSXGraph: Can't create charts without data.");
    for (p = o.chartstyle.replace(/ /g, "").split(","), h = 0; h < p.length; h++) {
      switch (p[h]) {
        case "bar":
          l = this.drawBar(e, s, n, o);
          break;
        case "line":
          l = this.drawLine(e, s, n, o);
          break;
        case "fit":
          l = this.drawFit(e, s, n, o);
          break;
        case "spline":
          l = this.drawSpline(e, s, n, o);
          break;
        case "pie":
          l = this.drawPie(e, n, o);
          break;
        case "point":
          l = this.drawPoints(e, s, n, o);
          break;
        case "radar":
          l = this.drawRadar(e, t, o);
      }
      this.elements.push(l);
    }
    return this.id = this.board.setId(this, "Chart"), this.elements;
  }, d.Z.Chart.prototype = new Je.Z(), d.Z.extend(d.Z.Chart.prototype, { drawLine: function(e, t, o, s) {
    return s.fillcolor = "none", s.highlightfillcolor = "none", e.create("curve", [t, o], s);
  }, drawSpline: function(e, t, o, s) {
    return s.fillColor = "none", s.highlightfillcolor = "none", e.create("spline", [t, o], s);
  }, drawFit: function(e, t, o, s) {
    var n = s.degree;
    return n = Math.max(parseInt(n, 10), 1) || 1, s.fillcolor = "none", s.highlightfillcolor = "none", e.create("functiongraph", [c.Z.regressionPolynomial(n, t, o)], s);
  }, drawBar: function(e, t, o, s) {
    var n, h, l, p, u, v, Z, y, O, S, R = [], L = [], B = function(F, G) {
      return function() {
        return t[F]() - G * l;
      };
    }, X = { fixed: !0, withLabel: !1, visible: !1, name: "" };
    if ((O = a.Z.copyAttributes(s, e.options, "chart")) && O.width)
      l = O.width;
    else {
      if (t.length <= 1)
        l = 1;
      else
        for (l = t[1] - t[0], n = 1; n < t.length - 1; n++)
          l = t[n + 1] - t[n] < l ? t[n + 1] - t[n] : l;
      l *= 0.8;
    }
    for (S = a.Z.copyAttributes(s, e.options, "chart", "label"), n = 0; n < t.length; n++)
      a.Z.isFunction(t[n]) ? (p = B(n, -0.5), u = B(n, 0), v = B(n, 0.5)) : (p = t[n] - 0.5 * l, u = t[n], v = t[n] + 0.5 * l), Z = a.Z.isFunction(o[n]) ? o[n]() : o[n], Z = o[n], O.dir === "horizontal" ? (L[0] = e.create("point", [0, p], X), L[1] = e.create("point", [Z, p], X), L[2] = e.create("point", [Z, v], X), L[3] = e.create("point", [0, v], X), a.Z.exists(O.labels) && a.Z.exists(O.labels[n]) && (S.anchorY = "middle", (h = e.create("text", [Z, u, O.labels[n]], S)).visProp.anchorx = function(F) {
        return function() {
          return F.X() >= 0 ? "left" : "right";
        };
      }(h))) : (L[0] = e.create("point", [p, 0], X), L[1] = e.create("point", [p, Z], X), L[2] = e.create("point", [v, Z], X), L[3] = e.create("point", [v, 0], X), a.Z.exists(O.labels) && a.Z.exists(O.labels[n]) && (S.anchorX = "middle", (h = e.create("text", [u, Z, O.labels[n]], S)).visProp.anchory = function(F) {
        return function() {
          return F.Y() >= 0 ? "bottom" : "top";
        };
      }(h))), a.Z.isArray(O.colors) && (y = O.colors, O.fillcolor = y[n % y.length]), R[n] = e.create("polygon", L, O), a.Z.exists(O.labels) && a.Z.exists(O.labels[n]) && (R[n].text = h);
    return R;
  }, drawPoints: function(e, t, o, s) {
    var n, h = [], l = s.infoboxarray;
    for (s.fixed = !0, s.name = "", n = 0; n < t.length; n++)
      s.infoboxtext = !!l && l[n % l.length], h[n] = e.create("point", [t[n], o[n]], s);
    return h;
  }, drawPie: function(e, t, o) {
    var s, n, h = [], l = [], p = (m.Z.sum(t), o.colors), u = o.highlightcolors, v = o.labels, Z = o.radius || 4, y = Z, O = o.center || [0, 0], S = O[0], R = O[1], L = function(W, H, q) {
      return function() {
        var oe, ee, he, re = 0;
        for (ee = 0; ee <= W; ee++)
          re += parseFloat(a.Z.evaluate(t[ee]));
        for (oe = re, ee = W + 1; ee < t.length; ee++)
          oe += parseFloat(a.Z.evaluate(t[ee]));
        return he = oe !== 0 ? 2 * Math.PI * re / oe : 0, y() * Math[H](he) + q;
      };
    }, B = function(W, H) {
      var q = -this.point1.coords.usrCoords[1] + this.point2.coords.usrCoords[1], oe = -this.point1.coords.usrCoords[2] + this.point2.coords.usrCoords[2];
      a.Z.exists(this.label) && (this.label.rendNode.style.fontSize = H * a.Z.evaluate(this.label.visProp.fontsize) + "px", this.label.fullUpdate()), this.point2.coords = new b.Z(x.Z.COORDS_BY_USER, [this.point1.coords.usrCoords[1] + q * W, this.point1.coords.usrCoords[2] + oe * W], this.board), this.fullUpdate();
    }, X = function() {
      this.highlighted || (this.highlighted = !0, this.board.highlightedObjects[this.id] = this, this.board.renderer.highlight(this), B.call(this, 1.1, 2));
    }, F = function() {
      this.highlighted && (this.highlighted = !1, this.board.renderer.noHighlight(this), B.call(this, 0.9090909, 1));
    }, G = { fixed: !0, withLabel: !1, visible: !1, name: "" };
    if (!a.Z.isArray(v))
      for (v = [], s = 0; s < t.length; s++)
        v[s] = "";
    for (a.Z.isFunction(Z) || (y = function() {
      return Z;
    }), o.highlightonsector = o.highlightonsector || !1, o.straightfirst = !1, o.straightlast = !1, n = e.create("point", [S, R], G), h[0] = e.create("point", [function() {
      return y() + S;
    }, function() {
      return R;
    }], G), s = 0; s < t.length; s++)
      h[s + 1] = e.create("point", [L(s, "cos", S), L(s, "sin", R)], G), o.name = v[s], o.withlabel = o.name !== "", o.fillcolor = p && p[s % p.length], o.labelcolor = p && p[s % p.length], o.highlightfillcolor = u && u[s % u.length], l[s] = e.create("sector", [n, h[s], h[s + 1]], o), o.highlightonsector && (l[s].hasPoint = l[s].hasPointSector), o.highlightbysize && (l[s].highlight = X, l[s].noHighlight = F);
    return { sectors: l, points: h, midpoint: n };
  }, drawRadar: function(e, t, o) {
    var s, n, h, l, p, u, v, Z, y, O, S, R, L, B, X, F, G, W, H, q, oe, ee, he, re, _e, ge, we, Ne, Le, Ue, Qe, Ve, ye, Ce, me, be, ue, Ae, Ge, pe, Se, Ee, De = t.length, He = function() {
      var Ye, Be, Pe, et, Fe = a.Z.evaluate(this.visProp.label.offset).slice(0);
      return Ye = this.point1.X(), Be = this.point2.X(), Pe = this.point1.Y(), et = this.point2.Y(), Be < Ye && (Fe[0] = -Fe[0]), et < Pe && (Fe[1] = -Fe[1]), this.setLabelRelativeCoords(Fe), new b.Z(x.Z.COORDS_BY_USER, [this.point2.X(), this.point2.Y()], this.board);
    }, We = function(Ye, Be) {
      var Pe, et, Fe;
      return Pe = e.create("transform", [-(X[Be] - L[Be]), 0], { type: "translate" }), et = e.create("transform", [H / (F[Be] + B[Be] - (X[Be] - L[Be])), 1], { type: "scale" }), Pe.melt(et), Fe = e.create("transform", [Ye], { type: "rotate" }), Pe.melt(Fe), Pe;
    };
    if (De <= 0)
      throw new Error("JSXGraph radar chart: no data");
    if (h = o.paramarray, !a.Z.exists(h))
      throw new Error("JSXGraph radar chart: need paramArray attribute");
    if ((l = h.length) <= 1)
      throw new Error("JSXGraph radar chart: need more than one param in paramArray");
    for (s = 0; s < De; s++)
      if (l !== t[s].length)
        throw new Error("JSXGraph radar chart: use data length equal to number of params (" + t[s].length + " != " + l + ")");
    for (p = [], u = [], n = 0; n < l; n++)
      p[n] = t[0][n], u[n] = p[n];
    for (s = 1; s < De; s++)
      for (n = 0; n < l; n++)
        t[s][n] > p[n] && (p[n] = t[s][n]), t[s][n] < u[n] && (u[n] = t[s][n]);
    for (v = [], Z = [], s = 0; s < De; s++)
      v[s] = "", Z[s] = [];
    for (y = [], O = [], S = o.startshiftratio || 0, R = o.endshiftratio || 0, s = 0; s < l; s++)
      y[s] = (p[s] - u[s]) * S, O[s] = (p[s] - u[s]) * R;
    if (L = o.startshiftarray || y, B = o.endshiftarray || O, X = o.startarray || u, a.Z.exists(o.start))
      for (s = 0; s < l; s++)
        X[s] = o.start;
    if (F = o.endarray || p, a.Z.exists(o.end))
      for (s = 0; s < l; s++)
        F[s] = o.end;
    if (L.length !== l)
      throw new Error("JSXGraph radar chart: start shifts length is not equal to number of parameters");
    if (B.length !== l)
      throw new Error("JSXGraph radar chart: end shifts length is not equal to number of parameters");
    if (X.length !== l)
      throw new Error("JSXGraph radar chart: starts length is not equal to number of parameters");
    if (F.length !== l)
      throw new Error("JSXGraph radar chart: snds length is not equal to number of parameters");
    for (G = o.labelarray || v, W = o.colors, o.highlightcolors, H = o.radius || 10, Se = o.strokewidth || 1, a.Z.exists(o.highlightonsector) || (o.highlightonsector = !1), q = { name: o.name, id: o.id, strokewidth: Se, polystrokewidth: o.polystrokewidth || Se, strokecolor: o.strokecolor || "black", straightfirst: !1, straightlast: !1, fillcolor: o.fillColor || "#FFFF88", fillopacity: o.fillOpacity || 0.4, highlightfillcolor: o.highlightFillColor || "#FF7400", highlightstrokecolor: o.highlightStrokeColor || "black", gradient: o.gradient || "none" }, ee = (oe = o.center || [0, 0])[0], he = oe[1], re = e.create("point", [ee, he], { name: "", fixed: !0, withlabel: !1, visible: !1 }), ge = _e = o.startangle || 0, we = [], Ne = [], s = 0; s < l; s++)
      for (ge += 2 * Math.PI / l, Ue = H * Math.cos(ge) + ee, Qe = H * Math.sin(ge) + he, we[s] = e.create("point", [Ue, Qe], { name: "", fixed: !0, withlabel: !1, visible: !1 }), Ne[s] = e.create("line", [re, we[s]], { name: h[s], strokeColor: q.strokecolor, strokeWidth: q.strokewidth, strokeOpacity: 1, straightFirst: !1, straightLast: !1, withLabel: !0, highlightStrokeColor: q.highlightstrokecolor }), Ne[s].getLabelAnchor = He, Le = We(ge, s), n = 0; n < t.length; n++)
        Ee = t[n][s], Z[n][s] = e.create("point", [Ee, 0], { name: "", fixed: !0, withlabel: !1, visible: !1 }), Z[n][s].addTransform(Z[n][s], Le);
    for (Ve = [], s = 0; s < De; s++)
      for (q.labelcolor = W && W[s % W.length], q.strokecolor = W && W[s % W.length], q.fillcolor = W && W[s % W.length], Ve[s] = e.create("polygon", Z[s], { withLines: !0, withLabel: !1, fillColor: q.fillcolor, fillOpacity: q.fillopacity, highlightFillColor: q.highlightfillcolor }), n = 0; n < l; n++)
        Ve[s].borders[n].setAttribute("strokecolor:" + W[s % W.length]), Ve[s].borders[n].setAttribute("strokewidth:" + q.polystrokewidth);
    switch (o.legendposition || "none") {
      case "right":
        Ce = o.legendleftoffset || 2, me = o.legendtopoffset || 1, this.legend = e.create("legend", [ee + H + Ce, he + H - me], { labels: G, colors: W });
        break;
      case "none":
        break;
      default:
        d.Z.debug("Unknown legend position");
    }
    if (ye = [], o.showcircles) {
      for (be = [], s = 0; s < 6; s++)
        be[s] = 20 * s;
      if (be[0] = "0", (Ae = (ue = o.circlelabelarray || be).length) < 2)
        throw new Error("JSXGraph radar chart: too less circles in circleLabelArray");
      for (Ge = [], Le = We(_e + Math.PI / l, 0), q.fillcolor = "none", q.highlightfillcolor = "none", q.strokecolor = o.strokecolor || "black", q.strokewidth = o.circlestrokewidth || 0.5, q.layer = 0, pe = (F[0] - X[0]) / (Ae - 1), s = 0; s < Ae; s++)
        Ge[s] = e.create("point", [X[0] + s * pe, 0], { name: ue[s], size: 0, fixed: !0, withLabel: !0, visible: !0 }), Ge[s].addTransform(Ge[s], Le), ye[s] = e.create("circle", [re, Ge[s]], q);
    }
    return this.rendNode = Ve[0].rendNode, { circles: ye, lines: Ne, points: Z, midpoint: re, polygons: Ve };
  }, updateRenderer: function() {
    return this;
  }, update: function() {
    return this.needsUpdate && this.updateDataArray(), this;
  }, updateDataArray: function() {
    return this;
  } }), d.Z.createChart = function(e, t, o) {
    var s, n, h, l, p, u, v, Z, y, O, S, R, L, B, X, F, G = [], W = M.Z.isBrowser ? e.document.getElementById(t[0]) : null;
    if (t.length === 1 && a.Z.isString(t[0])) {
      if (a.Z.exists(W)) {
        if (y = a.Z.copyAttributes(o, e.options, "chart"), s = (W = new Zt().loadFromTable(t[0], y.withheaders, y.withheaders)).data, p = W.columnHeaders, n = W.rowHeaders, O = y.width, S = y.name, R = y.strokecolor, L = y.fillcolor, B = y.highlightstrokecolor, X = y.highlightfillcolor, e.suspendUpdate(), F = s.length, Z = [], y.rows && a.Z.isArray(y.rows)) {
          for (h = 0; h < F; h++)
            for (l = 0; l < y.rows.length; l++)
              if (y.rows[l] === h || y.withheaders && y.rows[l] === n[h]) {
                Z.push(s[h]);
                break;
              }
        } else
          Z = s;
        for (F = Z.length, h = 0; h < F; h++) {
          if (v = [], y.chartstyle && y.chartstyle.indexOf("bar") !== -1) {
            for (u = O || 0.8, v.push(1 - u / 2 + (h + 0.5) * u / F), l = 1; l < Z[h].length; l++)
              v.push(v[l - 1] + 1);
            y.width = u / F;
          }
          S && S.length === F ? y.name = S[h] : y.withheaders && (y.name = p[h]), R && R.length === F ? y.strokecolor = R[h] : y.strokecolor = fe.Z.hsv2rgb((h + 1) / F * 360, 0.9, 0.6), L && L.length === F ? y.fillcolor = L[h] : y.fillcolor = fe.Z.hsv2rgb((h + 1) / F * 360, 0.9, 1), B && B.length === F ? y.highlightstrokecolor = B[h] : y.highlightstrokecolor = fe.Z.hsv2rgb((h + 1) / F * 360, 0.9, 1), X && X.length === F ? y.highlightfillcolor = X[h] : y.highlightfillcolor = fe.Z.hsv2rgb((h + 1) / F * 360, 0.9, 0.6), y.chartstyle && y.chartstyle.indexOf("bar") !== -1 ? G.push(new d.Z.Chart(e, [v, Z[h]], y)) : G.push(new d.Z.Chart(e, [Z[h]], y));
        }
        e.unsuspendUpdate();
      }
      return G;
    }
    return y = a.Z.copyAttributes(o, e.options, "chart"), new d.Z.Chart(e, t, y);
  }, d.Z.registerElement("chart", d.Z.createChart), d.Z.Legend = function(e, t, o) {
    var s;
    if (this.constructor(), s = a.Z.copyAttributes(o, e.options, "legend"), this.board = e, this.coords = new b.Z(x.Z.COORDS_BY_USER, t, this.board), this.myAtts = {}, this.label_array = s.labelarray || s.labels, this.color_array = s.colorarray || s.colors, this.lines = [], this.myAtts.strokewidth = s.strokewidth || 5, this.myAtts.straightfirst = !1, this.myAtts.straightlast = !1, this.myAtts.withlabel = !0, this.myAtts.fixed = !0, this.style = s.legendstyle || s.style, this.style !== "vertical")
      throw new Error("JSXGraph: Unknown legend style: " + this.style);
    this.drawVerticalLegend(e, s);
  }, d.Z.Legend.prototype = new Je.Z(), d.Z.Legend.prototype.drawVerticalLegend = function(e, t) {
    var o, s = t.linelength || 1, n = (t.rowheight || 20) / this.board.unitY, h = function() {
      return this.setLabelRelativeCoords(this.visProp.label.offset), new b.Z(x.Z.COORDS_BY_USER, [this.point2.X(), this.point2.Y()], this.board);
    };
    for (o = 0; o < this.label_array.length; o++)
      this.myAtts.name = this.label_array[o], this.myAtts.strokecolor = this.color_array[o % this.color_array.length], this.myAtts.highlightstrokecolor = this.color_array[o % this.color_array.length], this.myAtts.label = { offset: [10, 0], strokeColor: this.color_array[o % this.color_array.length], strokeWidth: this.myAtts.strokewidth }, this.lines[o] = e.create("line", [[this.coords.usrCoords[1], this.coords.usrCoords[2] - o * n], [this.coords.usrCoords[1] + s, this.coords.usrCoords[2] - o * n]], this.myAtts), this.lines[o].getLabelAnchor = h, this.lines[o].prepareUpdate().update().updateVisibility(a.Z.evaluate(this.lines[o].visProp.visible)).updateRenderer();
  }, d.Z.createLegend = function(e, t, o) {
    var s = [0, 0];
    if (!a.Z.exists(t) || t.length !== 2)
      throw new Error("JSXGraph: Legend element needs two numbers as parameters");
    return s = t, new d.Z.Legend(e, s, o);
  }, d.Z.registerElement("legend", d.Z.createLegend), d.Z.Chart, d.Z.Legend, d.Z.Transformation = function(e, t, o) {
    this.elementClass = x.Z.OBJECT_CLASS_OTHER, this.type = x.Z.OBJECT_TYPE_TRANSFORMATION, this.matrix = [[1, 0, 0], [0, 1, 0], [0, 0, 1]], this.board = e, this.isNumericMatrix = !1, this.setMatrix(e, t, o), this.methodMap = { apply: "apply", applyOnce: "applyOnce", bindTo: "bindTo", bind: "bindTo", melt: "melt" };
  }, d.Z.Transformation.prototype = {}, d.Z.extend(d.Z.Transformation.prototype, { update: function() {
    return this;
  }, setMatrix: function(e, t, o) {
    var s;
    for (this.isNumericMatrix = !0, s = 0; s < o.length; s++)
      if (typeof o[s] != "number") {
        this.isNumericMatrix = !1;
        break;
      }
    if (t === "translate") {
      if (o.length !== 2)
        throw new Error("JSXGraph: translate transformation needs 2 parameters.");
      this.evalParam = a.Z.createEvalFunction(e, o, 2), this.update = function() {
        this.matrix[1][0] = this.evalParam(0), this.matrix[2][0] = this.evalParam(1);
      };
    } else if (t === "scale") {
      if (o.length !== 2)
        throw new Error("JSXGraph: scale transformation needs 2 parameters.");
      this.evalParam = a.Z.createEvalFunction(e, o, 2), this.update = function() {
        this.matrix[1][1] = this.evalParam(0), this.matrix[2][2] = this.evalParam(1);
      };
    } else if (t === "reflect")
      o.length < 4 && (o[0] = e.select(o[0])), o.length === 2 && (o[1] = e.select(o[1])), o.length === 4 && (this.evalParam = a.Z.createEvalFunction(e, o, 4)), this.update = function() {
        var n, h, l, p, u, v, Z, y;
        o.length === 1 ? Z = o[0].stdform : o.length === 2 ? Z = k.Z.crossProduct(o[1].coords.usrCoords, o[0].coords.usrCoords) : o.length === 4 && (Z = k.Z.crossProduct([1, this.evalParam(2), this.evalParam(3)], [1, this.evalParam(0), this.evalParam(1)])), n = Z[1], h = Z[2], v = (y = [-(l = Z[0]) * n, -l * h, n * n + h * h])[2], p = y[0] / y[2], u = y[1] / y[2], n = -Z[2], h = Z[1], this.matrix[1][1] = (n * n - h * h) / v, this.matrix[1][2] = 2 * n * h / v, this.matrix[2][1] = this.matrix[1][2], this.matrix[2][2] = -this.matrix[1][1], this.matrix[1][0] = p * (1 - this.matrix[1][1]) - u * this.matrix[1][2], this.matrix[2][0] = u * (1 - this.matrix[2][2]) - p * this.matrix[2][1];
      };
    else if (t === "rotate")
      o.length === 3 ? this.evalParam = a.Z.createEvalFunction(e, o, 3) : o.length > 0 && o.length <= 2 && (this.evalParam = a.Z.createEvalFunction(e, o, 1), o.length !== 2 || a.Z.isArray(o[1]) || (o[1] = e.select(o[1]))), this.update = function() {
        var n, h, l = this.evalParam(0), p = Math.cos(l), u = Math.sin(l);
        this.matrix[1][1] = p, this.matrix[1][2] = -u, this.matrix[2][1] = u, this.matrix[2][2] = p, o.length > 1 && (o.length === 3 ? (n = this.evalParam(1), h = this.evalParam(2)) : a.Z.isArray(o[1]) ? (n = o[1][0], h = o[1][1]) : (n = o[1].X(), h = o[1].Y()), this.matrix[1][0] = n * (1 - p) + h * u, this.matrix[2][0] = h * (1 - p) - n * u);
      };
    else if (t === "shear") {
      if (o.length !== 2)
        throw new Error("JSXGraph: shear transformation needs 2 parameters.");
      this.evalParam = a.Z.createEvalFunction(e, o, 2), this.update = function() {
        this.matrix[1][2] = this.evalParam(0), this.matrix[2][1] = this.evalParam(1);
      };
    } else if (t === "generic") {
      if (o.length !== 9)
        throw new Error("JSXGraph: generic transformation needs 9 parameters.");
      this.evalParam = a.Z.createEvalFunction(e, o, 9), this.update = function() {
        this.matrix[0][0] = this.evalParam(0), this.matrix[0][1] = this.evalParam(1), this.matrix[0][2] = this.evalParam(2), this.matrix[1][0] = this.evalParam(3), this.matrix[1][1] = this.evalParam(4), this.matrix[1][2] = this.evalParam(5), this.matrix[2][0] = this.evalParam(6), this.matrix[2][1] = this.evalParam(7), this.matrix[2][2] = this.evalParam(8);
      };
    }
  }, apply: function(e, t) {
    return this.update(), a.Z.exists(t) ? k.Z.matVecMult(this.matrix, e.initialCoords.usrCoords) : k.Z.matVecMult(this.matrix, e.coords.usrCoords);
  }, applyOnce: function(e) {
    var t, o, s;
    for (a.Z.isArray(e) || (e = [e]), o = e.length, s = 0; s < o; s++)
      this.update(), t = k.Z.matVecMult(this.matrix, e[s].coords.usrCoords), e[s].coords.setCoordinates(x.Z.COORDS_BY_USER, t);
  }, bindTo: function(e) {
    var t, o;
    if (a.Z.isArray(e))
      for (o = e.length, t = 0; t < o; t++)
        e[t].transformations.push(this);
    else
      e.transformations.push(this);
  }, setProperty: function(e) {
    d.Z.deprecated("Transformation.setProperty()", "Transformation.setAttribute()");
  }, setAttribute: function(e) {
  }, melt: function(e) {
    var t, o, s, n, h, l, p = [];
    for (o = e.matrix.length, s = this.matrix[0].length, t = 0; t < o; t++)
      p[t] = [];
    for (this.update(), e.update(), t = 0; t < o; t++)
      for (l = 0; l < s; l++) {
        for (h = 0, n = 0; n < o; n++)
          h += e.matrix[t][n] * this.matrix[n][l];
        p[t][l] = h;
      }
    return this.update = function() {
      var u = this.matrix.length, v = this.matrix[0].length;
      for (t = 0; t < u; t++)
        for (l = 0; l < v; l++)
          this.matrix[t][l] = p[t][l];
    }, this;
  }, getParents: function() {
    var e = [[].concat.apply([], this.matrix)];
    return this.parents.length !== 0 && (e = this.parents), e;
  } }), d.Z.createTransform = function(e, t, o) {
    return new d.Z.Transformation(e, o.type, t);
  }, d.Z.registerElement("transform", d.Z.createTransform), d.Z.Transformation, d.Z.Turtle = function(e, t, o) {
    var s, n, h;
    return this.constructor(e, o, x.Z.OBJECT_TYPE_TURTLE, x.Z.OBJECT_CLASS_OTHER), this.turtleIsHidden = !1, this.board = e, this.visProp.curveType = "plot", this._attributes = a.Z.copyAttributes(this.visProp, e.options, "turtle"), delete this._attributes.id, s = 0, n = 0, h = 90, t.length !== 0 && (t.length === 3 ? (s = t[0], n = t[1], h = t[2]) : t.length === 2 ? a.Z.isArray(t[0]) ? (s = t[0][0], n = t[0][1], h = t[1]) : (s = t[0], n = t[1]) : (s = t[0][0], n = t[0][1])), this.init(s, n, h), this.methodMap = a.Z.deepCopy(this.methodMap, { forward: "forward", fd: "forward", back: "back", bk: "back", right: "right", rt: "right", left: "left", lt: "left", penUp: "penUp", pu: "penUp", penDown: "penDown", pd: "penDown", clearScreen: "clearScreen", cs: "clearScreen", clean: "clean", setPos: "setPos", home: "home", hideTurtle: "hideTurtle", ht: "hideTurtle", showTurtle: "showTurtle", st: "showTurtle", penSize: "setPenSize", penColor: "setPenColor", getPenColor: "getPenColor", getHighlightPenColor: "getHighlightPenColor", getPenSize: "getPenSize", pushTurtle: "pushTurtle", push: "pushTurtle", popTurtle: "popTurtle", pop: "popTurtle", lookTo: "lookTo", pos: "pos", moveTo: "moveTo", X: "X", Y: "Y" }), this;
  }, d.Z.Turtle.prototype = new Je.Z(), d.Z.extend(d.Z.Turtle.prototype, { init: function(e, t, o) {
    var s = { fixed: !0, name: "", visible: !1, withLabel: !1 };
    this.arrowLen = 20 / Math.sqrt(this.board.unitX * this.board.unitX + this.board.unitY * this.board.unitY), this.pos = [e, t], this.isPenDown = !0, this.dir = 90, this.stack = [], this.objects = [], this.curve = this.board.create("curve", [[this.pos[0]], [this.pos[1]]], this._attributes), this.objects.push(this.curve), this.turtle = this.board.create("point", this.pos, s), this.objects.push(this.turtle), this.turtle2 = this.board.create("point", [this.pos[0], this.pos[1] + this.arrowLen], s), this.objects.push(this.turtle2), this.visProp.arrow.lastArrow = !0, this.visProp.arrow.straightFirst = !1, this.visProp.arrow.straightLast = !1, this.arrow = this.board.create("line", [this.turtle, this.turtle2], this.visProp.arrow), this.objects.push(this.arrow), this.subs = { arrow: this.arrow }, this.inherits.push(this.arrow), this.right(90 - o), this.board.update();
  }, forward: function(e) {
    if (e === 0)
      return this;
    var t, o = e * Math.cos(this.dir * Math.PI / 180), s = e * Math.sin(this.dir * Math.PI / 180);
    return this.turtleIsHidden || ((t = this.board.create("transform", [o, s], { type: "translate" })).applyOnce(this.turtle), t.applyOnce(this.turtle2)), this.isPenDown && this.curve.dataX.length >= 8192 && (this.curve = this.board.create("curve", [[this.pos[0]], [this.pos[1]]], this._attributes), this.objects.push(this.curve)), this.pos[0] += o, this.pos[1] += s, this.isPenDown && (this.curve.dataX.push(this.pos[0]), this.curve.dataY.push(this.pos[1])), this.board.update(), this;
  }, back: function(e) {
    return this.forward(-e);
  }, right: function(e) {
    return this.dir -= e, this.dir %= 360, this.turtleIsHidden || this.board.create("transform", [-e * Math.PI / 180, this.turtle], { type: "rotate" }).applyOnce(this.turtle2), this.board.update(), this;
  }, left: function(e) {
    return this.right(-e);
  }, penUp: function() {
    return this.isPenDown = !1, this;
  }, penDown: function() {
    return this.isPenDown = !0, this.curve = this.board.create("curve", [[this.pos[0]], [this.pos[1]]], this._attributes), this.objects.push(this.curve), this;
  }, clean: function() {
    var e, t;
    for (e = 0; e < this.objects.length; e++)
      (t = this.objects[e]).type === x.Z.OBJECT_TYPE_CURVE && (this.board.removeObject(t), this.objects.splice(e, 1));
    return this.curve = this.board.create("curve", [[this.pos[0]], [this.pos[1]]], this._attributes), this.objects.push(this.curve), this.board.update(), this;
  }, clearScreen: function() {
    var e, t, o = this.objects.length;
    for (e = 0; e < o; e++)
      t = this.objects[e], this.board.removeObject(t);
    return this.init(0, 0, 90), this;
  }, setPos: function(e, t) {
    return a.Z.isArray(e) ? this.pos = e : this.pos = [e, t], this.turtleIsHidden || (this.turtle.setPositionDirectly(x.Z.COORDS_BY_USER, [e, t]), this.turtle2.setPositionDirectly(x.Z.COORDS_BY_USER, [e, t + this.arrowLen]), this.board.create("transform", [-(this.dir - 90) * Math.PI / 180, this.turtle], { type: "rotate" }).applyOnce(this.turtle2)), this.curve = this.board.create("curve", [[this.pos[0]], [this.pos[1]]], this._attributes), this.objects.push(this.curve), this.board.update(), this;
  }, setPenSize: function(e) {
    return this.curve = this.board.create("curve", [[this.pos[0]], [this.pos[1]]], this.copyAttr("strokeWidth", e)), this.objects.push(this.curve), this;
  }, setPenColor: function(e) {
    return this.curve = this.board.create("curve", [[this.pos[0]], [this.pos[1]]], this.copyAttr("strokeColor", e)), this.objects.push(this.curve), this;
  }, getPenAttribute: function(e) {
    var t, o = this.objects.length;
    return t = o === 4 ? 0 : o - 1, a.Z.evaluate(this.objects[t].visProp[e]);
  }, getPenSize: function() {
    return this.getPenAttribute("strokewidth");
  }, getPenColor: function() {
    return this.getPenAttribute("strokecolor");
  }, getHighlightPenColor: function() {
    return this.getPenAttribute("highlightstrokecolor");
  }, setHighlightPenColor: function(e) {
    return this.curve = this.board.create("curve", [[this.pos[0]], [this.pos[1]]], this.copyAttr("highlightStrokeColor", e)), this.objects.push(this.curve), this;
  }, setAttribute: function(e) {
    var t, o, s, n = this.objects.length;
    for (t = 0; t < n; t++)
      (o = this.objects[t]).type === x.Z.OBJECT_TYPE_CURVE && o.setAttribute(e);
    return s = this.visProp.id, this.visProp = a.Z.deepCopy(this.curve.visProp), this.visProp.id = s, this._attributes = a.Z.deepCopy(this.visProp), delete this._attributes.id, this;
  }, copyAttr: function(e, t) {
    return this._attributes[e.toLowerCase()] = t, this._attributes;
  }, showTurtle: function() {
    return this.turtleIsHidden = !1, this.arrow.setAttribute({ visible: !0 }), this.visProp.arrow.visible = !1, this.setPos(this.pos[0], this.pos[1]), this.board.update(), this;
  }, hideTurtle: function() {
    return this.turtleIsHidden = !0, this.arrow.setAttribute({ visible: !1 }), this.visProp.arrow.visible = !1, this.board.update(), this;
  }, home: function() {
    return this.pos = [0, 0], this.setPos(this.pos[0], this.pos[1]), this;
  }, pushTurtle: function() {
    return this.stack.push([this.pos[0], this.pos[1], this.dir]), this;
  }, popTurtle: function() {
    var e = this.stack.pop();
    return this.pos[0] = e[0], this.pos[1] = e[1], this.dir = e[2], this.setPos(this.pos[0], this.pos[1]), this;
  }, lookTo: function(e) {
    var t, o, s, n, h;
    return a.Z.isArray(e) ? (t = this.pos[0], o = this.pos[1], s = e[0], n = e[1], h = Math.atan2(n - o, s - t), this.right(this.dir - 180 * h / Math.PI)) : a.Z.isNumber(e) && this.right(this.dir - e), this;
  }, moveTo: function(e) {
    var t, o, s;
    return a.Z.isArray(e) && (t = e[0] - this.pos[0], o = e[1] - this.pos[1], this.turtleIsHidden || ((s = this.board.create("transform", [t, o], { type: "translate" })).applyOnce(this.turtle), s.applyOnce(this.turtle2)), this.isPenDown && this.curve.dataX.length >= 8192 && (this.curve = this.board.create("curve", [[this.pos[0]], [this.pos[1]]], this._attributes), this.objects.push(this.curve)), this.pos[0] = e[0], this.pos[1] = e[1], this.isPenDown && (this.curve.dataX.push(this.pos[0]), this.curve.dataY.push(this.pos[1])), this.board.update()), this;
  }, fd: function(e) {
    return this.forward(e);
  }, bk: function(e) {
    return this.back(e);
  }, lt: function(e) {
    return this.left(e);
  }, rt: function(e) {
    return this.right(e);
  }, pu: function() {
    return this.penUp();
  }, pd: function() {
    return this.penDown();
  }, ht: function() {
    return this.hideTurtle();
  }, st: function() {
    return this.showTurtle();
  }, cs: function() {
    return this.clearScreen();
  }, push: function() {
    return this.pushTurtle();
  }, pop: function() {
    return this.popTurtle();
  }, evalAt: function(e, t) {
    var o, s, n, h, l = this.objects.length;
    for (o = 0, s = 0; o < l; o++)
      if ((n = this.objects[o]).elementClass === x.Z.OBJECT_CLASS_CURVE) {
        if (s <= e && e < s + n.numberPoints)
          return h = e - s, n[t](h);
        s += n.numberPoints;
      }
    return this[t]();
  }, X: function(e) {
    return a.Z.exists(e) ? this.evalAt(e, "X") : this.pos[0];
  }, Y: function(e) {
    return a.Z.exists(e) ? this.evalAt(e, "Y") : this.pos[1];
  }, Z: function(e) {
    return 1;
  }, minX: function() {
    return 0;
  }, maxX: function() {
    var e, t = this.objects.length, o = 0;
    for (e = 0; e < t; e++)
      this.objects[e].elementClass === x.Z.OBJECT_CLASS_CURVE && (o += this.objects[e].numberPoints);
    return o;
  }, hasPoint: function(e, t) {
    var o, s;
    for (o = 0; o < this.objects.length; o++)
      if ((s = this.objects[o]).type === x.Z.OBJECT_TYPE_CURVE && s.hasPoint(e, t))
        return !0;
    return !1;
  } }), d.Z.createTurtle = function(e, t, o) {
    var s;
    return t = t || [], s = a.Z.copyAttributes(o, e.options, "turtle"), new d.Z.Turtle(e, t, s);
  }, d.Z.registerElement("turtle", d.Z.createTurtle), d.Z.Turtle, d.Z.Ticks = function(e, t, o) {
    if (this.constructor(e.board, o, x.Z.OBJECT_TYPE_TICKS, x.Z.OBJECT_CLASS_OTHER), this.line = e, this.board = this.line.board, this.ticksFunction = null, this.fixedTicks = null, this.equidistant = !1, this.labelsData = [], a.Z.isFunction(t))
      throw this.ticksFunction = t, new Error("Function arguments are no longer supported.");
    a.Z.isArray(t) ? this.fixedTicks = t : ((Math.abs(t) < k.Z.eps || t < 0) && (t = o.defaultdistance), this.ticksFunction = this.makeTicksFunction(t), this.equidistant = !0), this.minTicksDistance = o.minticksdistance, this.ticks = [], this.ticksDelta = 1, this.labels = [], this.labelData = [], this.labelCounter = 0, this.id = this.line.addTicks(this), this.elType = "ticks", this.inherits.push(this.labels), this.board.setId(this, "Ti");
  }, d.Z.Ticks.prototype = new Je.Z(), d.Z.extend(d.Z.Ticks.prototype, { makeTicksFunction: function(e) {
    return function() {
      var t, o, s;
      return a.Z.evaluate(this.visProp.insertticks) ? ((s = (o = this.getLowerAndUpperBounds(this.getZeroCoordinates(), "ticksdistance")).upper - o.lower) <= 6 * (t = Math.pow(10, Math.floor(Math.log(0.6 * s) / Math.LN10))) && (t *= 0.5), t) : e;
    };
  }, hasPoint: function(e, t) {
    var o, s, n, h, l = this.ticks && this.ticks.length || 0;
    if (a.Z.isObject(a.Z.evaluate(this.visProp.precision)) ? (h = this.board._inputDevice, n = a.Z.evaluate(this.visProp.precision[h])) : n = this.board.options.precision.hasPoint, n += 0.5 * a.Z.evaluate(this.visProp.strokewidth), !a.Z.evaluate(this.line.visProp.scalable) || this.line.elementClass === x.Z.OBJECT_CLASS_CURVE || this.line.stdform[1] !== 0 && this.line.stdform[2] !== 0 && this.line.type !== x.Z.OBJECT_TYPE_AXIS)
      return !1;
    for (o = 0; o < l; o++)
      if ((s = this.ticks[o])[2] && !(this.line.stdform[1] === 0 && Math.abs(s[0][0] - this.line.point1.coords.scrCoords[1]) < k.Z.eps || this.line.stdform[2] === 0 && Math.abs(s[1][0] - this.line.point1.coords.scrCoords[2]) < k.Z.eps) && (Math.abs(s[0][0] - s[0][1]) >= 1 || Math.abs(s[1][0] - s[1][1]) >= 1)) {
        if (this.line.stdform[1] === 0) {
          if (Math.abs(t - 0.5 * (s[1][0] + s[1][1])) < 2 * n && s[0][0] - n < e && e < s[0][1] + n)
            return !0;
        } else if (this.line.stdform[2] === 0 && Math.abs(e - 0.5 * (s[0][0] + s[0][1])) < 2 * n && s[1][0] - n < t && t < s[1][1] + n)
          return !0;
      }
    return !1;
  }, setPositionDirectly: function(e, t, o) {
    var s, n, h = new b.Z(e, t, this.board), l = new b.Z(e, o, this.board), p = this.board.getBoundingBox();
    return this.line.type === x.Z.OBJECT_TYPE_AXIS && a.Z.evaluate(this.line.visProp.scalable) ? (Math.abs(this.line.stdform[1]) < k.Z.eps && Math.abs(h.usrCoords[1] * l.usrCoords[1]) > k.Z.eps ? (s = l.usrCoords[1] / h.usrCoords[1], p[0] *= s, p[2] *= s, this.board.setBoundingBox(p, this.board.keepaspectratio, "update")) : Math.abs(this.line.stdform[2]) < k.Z.eps && Math.abs(h.usrCoords[2] * l.usrCoords[2]) > k.Z.eps && (n = l.usrCoords[2] / h.usrCoords[2], p[3] *= n, p[1] *= n, this.board.setBoundingBox(p, this.board.keepaspectratio, "update")), this) : this;
  }, calculateTicksCoordinates: function() {
    var e, t, o, s;
    if (!(this.line.elementClass === x.Z.OBJECT_CLASS_LINE && (this.setTicksSizeVariables(), Math.abs(this.dx) < k.Z.eps && Math.abs(this.dy) < k.Z.eps)))
      return e = this.getZeroCoordinates(), t = this.line.elementClass === x.Z.OBJECT_CLASS_LINE ? this.getLowerAndUpperBounds(e) : { lower: this.line.minX(), upper: this.line.maxX() }, a.Z.evaluate(this.visProp.type) === "polar" && (s = this.board.getBoundingBox(), o = Math.max(Math.sqrt(s[0] * s[0] + s[1] * s[1]), Math.sqrt(s[2] * s[2] + s[3] * s[3])), t.upper = o), this.ticks = [], this.labelsData = [], this.equidistant ? this.generateEquidistantTicks(e, t) : this.generateFixedTicks(e, t), this;
  }, setTicksSizeVariables: function(e) {
    var t, o, s, n, h = 0.5 * a.Z.evaluate(this.visProp.majorheight), l = 0.5 * a.Z.evaluate(this.visProp.minorheight);
    a.Z.exists(e) ? (o = this.line.minX(), s = this.line.maxX(), (n = this.line.points.length) < 2 ? (this.dxMaj = 0, this.dyMaj = 0) : k.Z.relDif(e, o) < k.Z.eps ? (this.dxMaj = this.line.points[0].usrCoords[2] - this.line.points[1].usrCoords[2], this.dyMaj = this.line.points[1].usrCoords[1] - this.line.points[0].usrCoords[1]) : k.Z.relDif(e, s) < k.Z.eps ? (this.dxMaj = this.line.points[n - 2].usrCoords[2] - this.line.points[n - 1].usrCoords[2], this.dyMaj = this.line.points[n - 1].usrCoords[1] - this.line.points[n - 2].usrCoords[1]) : (this.dxMaj = -c.Z.D(this.line.Y)(e), this.dyMaj = c.Z.D(this.line.X)(e))) : (this.dxMaj = this.line.stdform[1], this.dyMaj = this.line.stdform[2]), this.dxMin = this.dxMaj, this.dyMin = this.dyMaj, this.dx = this.dxMaj, this.dy = this.dyMaj, t = Math.sqrt(this.dxMaj * this.dxMaj * this.board.unitX * this.board.unitX + this.dyMaj * this.dyMaj * this.board.unitY * this.board.unitY), this.dxMaj *= h / t * this.board.unitX, this.dyMaj *= h / t * this.board.unitY, this.dxMin *= l / t * this.board.unitX, this.dyMin *= l / t * this.board.unitY, this.minStyle = a.Z.evaluate(this.visProp.minorheight) < 0 ? "infinite" : "finite", this.majStyle = a.Z.evaluate(this.visProp.majorheight) < 0 ? "infinite" : "finite";
  }, getZeroCoordinates: function() {
    var e, t, o, s, n, h, l, p, u = a.Z.evaluate(this.visProp.anchor);
    return this.line.elementClass === x.Z.OBJECT_CLASS_LINE ? this.line.type === x.Z.OBJECT_TYPE_AXIS ? _.Z.projectPointToLine({ coords: { usrCoords: [1, 0, 0] } }, this.line, this.board) : (o = this.line.point1.coords.usrCoords[0], e = this.line.point1.coords.usrCoords[1], t = this.line.point1.coords.usrCoords[2], h = this.line.point2.coords.usrCoords[0], s = this.line.point2.coords.usrCoords[1], n = this.line.point2.coords.usrCoords[2], u === "right" ? this.line.point2.coords : u === "middle" ? new b.Z(x.Z.COORDS_BY_USER, [0.5 * (o + h), 0.5 * (e + s), 0.5 * (t + n)], this.board) : a.Z.isNumber(u) ? new b.Z(x.Z.COORDS_BY_USER, [o + (h - o) * u, e + (s - e) * u, t + (n - t) * u], this.board) : this.line.point1.coords) : (l = this.line.minX(), p = this.line.maxX(), u === "right" ? p : u === "middle" ? 0.5 * (l + p) : a.Z.isNumber(u) ? l * (1 - u) + p * u : l);
  }, getLowerAndUpperBounds: function(e, t) {
    var o, s, n, h, l, p, u, v, Z, y, O = a.Z.evaluate(this.line.visProp.straightfirst), S = a.Z.evaluate(this.line.visProp.straightlast), R = a.Z.evaluate(this.visProp.includeboundaries);
    return this.line.elementClass === x.Z.OBJECT_CLASS_CURVE ? { lower: this.line.minX(), upper: this.line.maxX() } : (l = new b.Z(x.Z.COORDS_BY_USER, this.line.point1.coords.usrCoords, this.board), p = new b.Z(x.Z.COORDS_BY_USER, this.line.point2.coords.usrCoords, this.board), u = Math.abs(l.usrCoords[0]) >= k.Z.eps && l.scrCoords[1] >= 0 && l.scrCoords[1] <= this.board.canvasWidth && l.scrCoords[2] >= 0 && l.scrCoords[2] <= this.board.canvasHeight, v = Math.abs(p.usrCoords[0]) >= k.Z.eps && p.scrCoords[1] >= 0 && p.scrCoords[1] <= this.board.canvasWidth && p.scrCoords[2] >= 0 && p.scrCoords[2] <= this.board.canvasHeight, a.Z.exists(t) || t === "tickdistance" ? _.Z.calcStraight(this.line, l, p, a.Z.evaluate(this.line.visProp.margin)) : _.Z.calcLineDelimitingPoints(this.line, l, p), n = a.Z.evaluate(this.line.visProp.firstarrow), h = a.Z.evaluate(this.line.visProp.lastarrow), (n || h) && (this.board.renderer.getPositionArrowHead(this.line, l, p, a.Z.evaluate(this.line.visProp.strokewidth)), n && l.setCoordinates(x.Z.COORDS_BY_SCREEN, [l.scrCoords[1], l.scrCoords[2]]), h && p.setCoordinates(x.Z.COORDS_BY_SCREEN, [p.scrCoords[1], p.scrCoords[2]])), (Z = this.getDistanceFromZero(e, l)) < (y = this.getDistanceFromZero(e, p)) ? (o = Z, O || !u || R || (o += k.Z.eps), s = y, S || !v || R || (s -= k.Z.eps)) : y < Z ? (o = y, S || !v || R || (o += k.Z.eps), s = Z, O || !u || R || (s -= k.Z.eps)) : (o = 0, s = 0), { lower: o, upper: s });
  }, getDistanceFromZero: function(e, t) {
    var o, s, n, h, l;
    return o = this.line.point1.coords, s = this.line.point2.coords, l = e.distance(x.Z.COORDS_BY_USER, t), n = [s.usrCoords[0] - o.usrCoords[0], s.usrCoords[1] - o.usrCoords[1], s.usrCoords[2] - o.usrCoords[2]], h = [t.usrCoords[0] - e.usrCoords[0], t.usrCoords[1] - e.usrCoords[1], t.usrCoords[2] - e.usrCoords[2]], k.Z.innerProduct(n, h, 3) < 0 && (l *= -1), l;
  }, generateEquidistantTicks: function(e, t) {
    var o, s, n = k.Z.eps, h = this.equidistant ? this.ticksFunction(1) : this.ticksDelta, l = a.Z.evaluate(this.visProp.insertticks), p = a.Z.evaluate(this.visProp.minorticks);
    if (this.line.elementClass === x.Z.OBJECT_CLASS_LINE && (s = this.getXandYdeltas()), h *= a.Z.evaluate(this.visProp.scale), l && this.minTicksDistance > k.Z.eps ? (h = this.adjustTickDistance(h, e, s), h /= p + 1) : l || (h /= p + 1), this.ticksDelta = h, !(h < k.Z.eps)) {
      for (o = 0, a.Z.evaluate(this.visProp.drawzero) || (o = h); o <= t.upper + n && (o >= t.lower - n && this.processTickPosition(e, o, h, s), o += h, !(t.upper - o > 1e4 * h)); )
        ;
      for (o = -h; o >= t.lower - n && (o <= t.upper + n && this.processTickPosition(e, o, h, s), !((o -= h) - t.lower > 1e4 * h)); )
        ;
    }
  }, adjustTickDistance: function(e, t, o) {
    var s, n, h, l = 1, p = a.Z.evaluate(this.visProp.minorticks);
    if (this.line.elementClass === x.Z.OBJECT_CLASS_CURVE)
      return e;
    if (this.getLowerAndUpperBounds(t, "ticksdistance"), s = t.usrCoords[1] + o.x * e, n = t.usrCoords[2] + o.y * e, h = t.distance(x.Z.COORDS_BY_SCREEN, new b.Z(x.Z.COORDS_BY_USER, [s, n], this.board)), e === 0)
      return 0;
    for (; h / (p + 1) < this.minTicksDistance; )
      e *= l === 1 ? 2 : 5, l *= -1, s = t.usrCoords[1] + o.x * e, n = t.usrCoords[2] + o.y * e, h = t.distance(x.Z.COORDS_BY_SCREEN, new b.Z(x.Z.COORDS_BY_USER, [s, n], this.board));
    return e;
  }, processTickPosition: function(e, t, o, s) {
    var n, h, l, p, u, v = a.Z.evaluate(this.visProp.ticksperlabel), Z = null;
    this.line.elementClass === x.Z.OBJECT_CLASS_LINE ? (n = e.usrCoords[1] + t * s.x, h = e.usrCoords[2] + t * s.y) : (n = this.line.X(e + t), h = this.line.Y(e + t)), l = new b.Z(x.Z.COORDS_BY_USER, [n, h], this.board), this.line.elementClass === x.Z.OBJECT_CLASS_CURVE && (Z = e + t, this.setTicksSizeVariables(Z)), l.major = Math.round(t / o) % (a.Z.evaluate(this.visProp.minorticks) + 1) == 0, v || (v = a.Z.evaluate(this.visProp.minorticks) + 1), u = Math.round(t / o) % v == 0, (p = this.createTickPath(l, l.major)).length === 3 && (this.ticks.push(p), u && a.Z.evaluate(this.visProp.drawlabels) ? this.labelsData.push(this.generateLabelData(this.generateLabelText(l, e, Z), l, this.ticks.length)) : this.labelsData.push(null));
  }, generateFixedTicks: function(e, t) {
    var o, s, n, h, l, p, u, v, Z = k.Z.eps, y = a.Z.isArray(this.visProp.labels), O = a.Z.evaluate(this.visProp.drawlabels);
    for (this.line.elementClass === x.Z.OBJECT_CLASS_LINE && (v = this.getXandYdeltas()), n = 0; n < this.fixedTicks.length; n++)
      this.line.elementClass === x.Z.OBJECT_CLASS_LINE ? (u = this.fixedTicks[n], l = e.usrCoords[1] + u * v.x, p = e.usrCoords[2] + u * v.y) : (u = e + this.fixedTicks[n], l = this.line.X(u), p = this.line.Y(u)), o = new b.Z(x.Z.COORDS_BY_USER, [l, p], this.board), this.line.elementClass === x.Z.OBJECT_CLASS_CURVE && this.setTicksSizeVariables(u), (h = this.createTickPath(o, !0)).length === 3 && u >= t.lower - Z && u <= t.upper + Z && (this.ticks.push(h), O && (y || a.Z.exists(this.visProp.labels[n])) ? (s = y ? a.Z.evaluate(this.visProp.labels[n]) : u, this.labelsData.push(this.generateLabelData(this.generateLabelText(o, e, s), o, n))) : this.labelsData.push(null));
  }, getXandYdeltas: function() {
    var e, t, o = this.line.point1.Dist(this.line.point2);
    return this.line.type === x.Z.OBJECT_TYPE_AXIS ? (e = this.line.point1.coords.usrCoords, t = this.line.point2.coords.usrCoords, (e[1] > t[1] || Math.abs(e[1] - t[1]) < k.Z.eps && e[2] > t[2]) && (e = this.line.point2.coords.usrCoords, t = this.line.point1.coords.usrCoords)) : (e = this.line.point1.coords.usrCoords, t = this.line.point2.coords.usrCoords), { x: (t[1] - e[1]) / o, y: (t[2] - e[2]) / o };
  }, _isInsideCanvas: function(e, t, o) {
    var s = this.board.canvasWidth, n = this.board.canvasHeight;
    return o === void 0 && (o = 0), e[0] >= o && e[0] <= s - o && t[0] >= o && t[0] <= n - o || e[1] >= o && e[1] <= s - o && t[1] >= o && t[1] <= n - o;
  }, createTickPath: function(e, t) {
    var o, s, n, h, l, p, u, v, Z, y, O, S, R, L, B, X, F, G = [-2e6, -2e6], W = [-2e6, -2e6];
    if (o = e.scrCoords, t ? (h = this.dxMaj, l = this.dyMaj, Z = this.majStyle, B = a.Z.evaluate(this.visProp.majortickendings[0]) > 0, X = a.Z.evaluate(this.visProp.majortickendings[1]) > 0) : (h = this.dxMin, l = this.dyMin, Z = this.minStyle, B = a.Z.evaluate(this.visProp.tickendings[0]) > 0, X = a.Z.evaluate(this.visProp.tickendings[1]) > 0), s = [-l * o[1] - h * o[2], l, h], t && a.Z.evaluate(this.visProp.type) === "polar") {
      if (S = this.board.getBoundingBox(), L = (R = 2 * Math.PI) / 180, o = e.usrCoords, (O = Math.sqrt(o[1] * o[1] + o[2] * o[2])) < Math.max(Math.sqrt(S[0] * S[0] + S[1] * S[1]), Math.sqrt(S[2] * S[2] + S[3] * S[3]))) {
        for (G = [], W = [], y = 0; y <= R; y += L)
          G.push(this.board.origin.scrCoords[1] + O * Math.cos(y) * this.board.unitX), W.push(this.board.origin.scrCoords[2] + O * Math.sin(y) * this.board.unitY);
        return [G, W, t];
      }
    } else {
      if (Z === "infinite") {
        if (a.Z.evaluate(this.visProp.ignoreinfinitetickendings) && (B = X = !0), n = _.Z.meetLineBoard(s, this.board), B && X)
          G[0] = n[0].scrCoords[1], G[1] = n[1].scrCoords[1], W[0] = n[0].scrCoords[2], W[1] = n[1].scrCoords[2];
        else if ((F = [k.Z.innerProduct(n[0].usrCoords.slice(1, 3), this.line.stdform.slice(1, 3)) + this.line.stdform[0], k.Z.innerProduct(n[1].usrCoords.slice(1, 3), this.line.stdform.slice(1, 3)) + this.line.stdform[0]])[0] < F[1] && (n.reverse(), F.reverse()), B) {
          if (F[0] < 0)
            return [];
          F[1] < 0 ? (G[0] = n[0].scrCoords[1], W[0] = n[0].scrCoords[2], G[1] = o[1], W[1] = o[2]) : (G[0] = n[0].scrCoords[1], W[0] = n[0].scrCoords[2], G[1] = n[1].scrCoords[1], W[1] = n[1].scrCoords[2]);
        } else if (X) {
          if (F[1] > 0)
            return [];
          F[0] > 0 ? (G[0] = o[1], W[0] = o[2], G[1] = n[1].scrCoords[1], W[1] = n[1].scrCoords[2]) : (G[0] = n[0].scrCoords[1], W[0] = n[0].scrCoords[2], G[1] = n[1].scrCoords[1], W[1] = n[1].scrCoords[2]);
        }
      } else
        v = a.Z.evaluate(this.visProp.face) === ">" ? Math.PI / 4 : a.Z.evaluate(this.visProp.face) === "<" ? -Math.PI / 4 : 0, p = Math.cos(v) * h - Math.sin(v) * l, u = Math.sin(v) * h + Math.cos(v) * l, G[0] = o[1] + p * B, W[0] = o[2] - u * B, G[1] = o[1], W[1] = o[2], v = -v, p = Math.cos(v) * h - Math.sin(v) * l, u = Math.sin(v) * h + Math.cos(v) * l, G[2] = o[1] - p * X, W[2] = o[2] + u * X;
      if (this._isInsideCanvas(G, W))
        return [G, W, t];
    }
    return [];
  }, formatLabelText: function(e) {
    var t, o, s = a.Z.evaluate(this.visProp.scalesymbol);
    return a.Z.isNumber(e) ? (((t = (Math.round(1e11 * e) / 1e11).toString()).length > a.Z.evaluate(this.visProp.maxlabellength) || t.indexOf("e") !== -1) && (o = a.Z.evaluate(this.visProp.digits), a.Z.evaluate(this.visProp.precision) !== 3 && o === 3 && (o = a.Z.evaluate(this.visProp.precision)), t = e.toExponential(o).toString()), a.Z.evaluate(this.visProp.beautifulscientificticklabels) && (t = this.beautifyScientificNotationLabel(t)), t.indexOf(".") > -1 && t.indexOf("e") === -1 && (t = (t = t.replace(/0+$/, "")).replace(/\.$/, ""))) : t = e.toString(), s.length > 0 && (t === "1" ? t = s : t === "-1" ? t = "-" + s : t !== "0" && (t += s)), a.Z.evaluate(this.visProp.useunicodeminus) && (t = t.replace(/-/g, "−")), t;
  }, beautifyScientificNotationLabel: function(e) {
    return e.indexOf("e") === -1 ? e : (parseFloat(e.substring(0, e.indexOf("e"))) + e.substring(e.indexOf("e"))).replace(/e(.*)$/g, function(t, o) {
      var s = "•10";
      return s += o.replace(/-/g, "⁻").replace(/\+/g, "").replace(/0/g, "⁰").replace(/1/g, "¹").replace(/2/g, "²").replace(/3/g, "³").replace(/4/g, "⁴").replace(/5/g, "⁵").replace(/6/g, "⁶").replace(/7/g, "⁷").replace(/8/g, "⁸").replace(/9/g, "⁹");
    });
  }, generateLabelText: function(e, t, o) {
    var s;
    if (!a.Z.exists(o)) {
      if (s = this.getDistanceFromZero(t, e), Math.abs(s) < k.Z.eps)
        return "0";
      o = s / a.Z.evaluate(this.visProp.scale);
    }
    return this.formatLabelText(o);
  }, generateLabelData: function(e, t, o) {
    var s, n, h, l;
    return l = a.Z.evaluate(this.visProp.label.fontsize), s = [t.scrCoords[1], t.scrCoords[1]], n = [t.scrCoords[2], t.scrCoords[2]], h = l === void 0 ? 12 : l, h *= 0.5, this._isInsideCanvas(s, n, h) ? (s = a.Z.evaluate(this.visProp.label.offset[0]), n = a.Z.evaluate(this.visProp.label.offset[1]), { x: t.usrCoords[1] + s / this.board.unitX, y: t.usrCoords[2] + n / this.board.unitY, t: e, i: o }) : null;
  }, update: function() {
    return this.needsUpdate && this.board.canvasWidth !== 0 && this.board.canvasHeight !== 0 && this.calculateTicksCoordinates(), this;
  }, updateRenderer: function() {
    return this.needsUpdate ? (this.visPropCalc.visible && this.board.renderer.updateTicks(this), this.updateRendererLabels(), this.setDisplayRendNode(), this.needsUpdate = !1, this) : this;
  }, updateRendererLabels: function() {
    var e, t, o, s, n, h, l, p;
    for (o = this.labelsData.length, s = this.labels.length, e = 0, t = 0; e < o; e++)
      this.labelsData[e] !== null && (l = this.labelsData[e], t < s ? ((h = this.labels[t]).setText(l.t), h.setCoords(l.x, l.y), t++) : (this.labelCounter += 1, n = { isLabel: !0, layer: this.board.options.layer.line, highlightStrokeColor: this.board.options.text.strokeColor, highlightStrokeWidth: this.board.options.text.strokeWidth, highlightStrokeOpacity: this.board.options.text.strokeOpacity, priv: this.visProp.priv }, (n = a.Z.deepCopy(n, this.visProp.label)).id = this.id + l.i + "Label" + this.labelCounter, h = d.Z.createText(this.board, [l.x, l.y, l.t], n), this.addChild(h), h.setParents(this), h.isDraggable = !1, h.dump = !1, this.labels.push(h)), (p = a.Z.evaluate(this.visProp.label.visible)) === "inherit" && (p = this.visPropCalc.visible), h.prepareUpdate().updateVisibility(p).updateRenderer(), h.distanceX = a.Z.evaluate(this.visProp.label.offset[0]), h.distanceY = a.Z.evaluate(this.visProp.label.offset[1]));
    for (t = o = t; t < s; t++)
      this.board.renderer.display(this.labels[t], !1), this.labels[t].visProp.visible = this.labels[t].visPropCalc.visible = !1;
    return this;
  }, hideElement: function() {
    var e;
    for (d.Z.deprecated("Element.hideElement()", "Element.setDisplayRendNode()"), this.visPropCalc.visible = !1, this.board.renderer.display(this, !1), e = 0; e < this.labels.length; e++)
      a.Z.exists(this.labels[e]) && this.labels[e].hideElement();
    return this;
  }, showElement: function() {
    var e;
    for (d.Z.deprecated("Element.showElement()", "Element.setDisplayRendNode()"), this.visPropCalc.visible = !0, this.board.renderer.display(this, !1), e = 0; e < this.labels.length; e++)
      a.Z.exists(this.labels[e]) && this.labels[e].showElement();
    return this;
  } }), d.Z.createTicks = function(e, t, o) {
    var s, n, h = a.Z.copyAttributes(o, e.options, "ticks");
    if (n = t.length < 2 ? h.ticksdistance : t[1], t[0].elementClass !== x.Z.OBJECT_CLASS_LINE && t[0].elementClass !== x.Z.OBJECT_CLASS_CURVE)
      throw new Error("JSXGraph: Can't create Ticks with parent types '" + typeof t[0] + "'.");
    return s = new d.Z.Ticks(t[0], n, h), a.Z.isFunction(h.generatelabelvalue) && (s.generateLabelText = h.generatelabelvalue), a.Z.isFunction(h.generatelabeltext) && (s.generateLabelText = h.generatelabeltext), s.setParents(t[0]), s.isDraggable = !0, s.fullUpdate(t[0].visPropCalc.visible), s;
  }, d.Z.createHatchmark = function(e, t, o) {
    var s, n, h, l, p, u = [], v = a.Z.copyAttributes(o, e.options, "hatch");
    if (t[0].elementClass !== x.Z.OBJECT_CLASS_LINE && t[0].elementClass !== x.Z.OBJECT_CLASS_CURVE || typeof t[1] != "number")
      throw new Error("JSXGraph: Can't create Hatch mark with parent types '" + typeof t[0] + "' and '" + typeof t[1] + " and ''" + typeof t[2] + "'.");
    for (h = 0.5 * -(((s = t[1]) - 1) * (l = v.ticksdistance)), n = 0; n < s; n++)
      u[n] = h + n * l;
    return (p = e.create("ticks", [t[0], u], v)).elType = "hatch", t[0].inherits.push(p), p;
  }, d.Z.registerElement("ticks", d.Z.createTicks), d.Z.registerElement("hash", d.Z.createHatchmark), d.Z.registerElement("hatch", d.Z.createHatchmark), d.Z.Ticks, d.Z.CA = function(e, t, o) {
    this.node = e, this.createNode = t, this.parser = o;
  }, d.Z.extend(d.Z.CA.prototype, { findMapNode: function(e, t) {
    var o, s, n;
    if (t.value === "op_assign" && t.children[0].value === e)
      return t.children[1];
    if (t.children) {
      for (s = t.children.length, o = 0; o < s; ++o)
        if ((n = this.findMapNode(e, t.children[o])) !== null)
          return n;
    }
    return null;
  }, setMath: function(e) {
    var t, o;
    if ((e.type != "node_op" || e.value != "op_add" && e.value != "op_sub" && e.value != "op_mul" && e.value != "op_div" && e.value != "op_neg" && e.value != "op_execfun" && e.value != "op_exp") && e.type != "node_var" && e.type != "node_const" || (e.isMath = !0), e.children)
      for (o = e.children.length, t = 0; t < o; ++t)
        this.setMath(e.children[t]);
  }, deriveElementary: function(e, t) {
    var o, s = e.children[0].value, n = e.children[1];
    switch (s) {
      case "abs":
        o = this.createNode("node_op", "op_div", n[0], this.createNode("node_op", "op_execfun", this.createNode("node_var", "sqrt"), [this.createNode("node_op", "op_mul", a.Z.deepCopy(n[0]), a.Z.deepCopy(n[0]))]));
        break;
      case "sqrt":
        o = this.createNode("node_op", "op_div", this.createNode("node_const", 1), this.createNode("node_op", "op_mul", this.createNode("node_const", 2), this.createNode(e.type, e.value, a.Z.deepCopy(e.children[0]), a.Z.deepCopy(e.children[1]))));
        break;
      case "sin":
        o = this.createNode("node_op", "op_execfun", this.createNode("node_var", "cos"), a.Z.deepCopy(n));
        break;
      case "cos":
        o = this.createNode("node_op", "op_neg", this.createNode("node_op", "op_execfun", this.createNode("node_var", "sin"), a.Z.deepCopy(n)));
        break;
      case "tan":
        o = this.createNode("node_op", "op_div", this.createNode("node_const", 1), this.createNode("node_op", "op_exp", this.createNode("node_op", "op_execfun", this.createNode("node_var", "cos"), a.Z.deepCopy(n)), this.createNode("node_const", 2)));
        break;
      case "cot":
        o = this.createNode("node_op", "op_neg", this.createNode("node_op", "op_div", this.createNode("node_const", 1), this.createNode("node_op", "op_exp", this.createNode("node_op", "op_execfun", this.createNode("node_var", "sin"), a.Z.deepCopy(n)), this.createNode("node_const", 2))));
        break;
      case "exp":
        o = this.createNode(e.type, e.value, a.Z.deepCopy(e.children[0]), a.Z.deepCopy(e.children[1]));
        break;
      case "pow":
        o = this.createNode("node_op", "op_mul", this.createNode("node_op", "op_execfun", a.Z.deepCopy(e.children[0]), a.Z.deepCopy(e.children[1])), this.createNode("node_op", "op_add", this.createNode("node_op", "op_mul", this.derivative(e.children[1][0], t), this.createNode("node_op", "op_div", a.Z.deepCopy(e.children[1][1]), a.Z.deepCopy(e.children[1][0]))), this.createNode("node_op", "op_mul", this.derivative(e.children[1][1], t), this.createNode("node_op", "op_execfun", this.createNode("node_var", "log"), [a.Z.deepCopy(e.children[1][0])]))));
        break;
      case "log":
      case "ln":
        o = this.createNode("node_op", "op_div", this.createNode("node_const", 1), a.Z.deepCopy(n[0]));
        break;
      case "log2":
      case "lb":
      case "ld":
        o = this.createNode("node_op", "op_mul", this.createNode("node_op", "op_div", this.createNode("node_const", 1), a.Z.deepCopy(n[0])), this.createNode("node_const", 1.4426950408889634));
        break;
      case "log10":
      case "lg":
        o = this.createNode("node_op", "op_mul", this.createNode("node_op", "op_div", this.createNode("node_const", 1), a.Z.deepCopy(n[0])), this.createNode("node_const", 0.43429448190325176));
        break;
      case "asin":
        o = this.createNode("node_op", "op_div", this.createNode("node_const", 1), this.createNode("node_op", "op_execfun", this.createNode("node_var", "sqrt"), [this.createNode("node_op", "op_sub", this.createNode("node_const", 1), this.createNode("node_op", "op_mul", a.Z.deepCopy(n[0]), a.Z.deepCopy(n[0])))]));
        break;
      case "acos":
        o = this.createNode("node_op", "op_neg", this.createNode("node_op", "op_div", this.createNode("node_const", 1), this.createNode("node_op", "op_execfun", this.createNode("node_var", "sqrt"), [this.createNode("node_op", "op_sub", this.createNode("node_const", 1), this.createNode("node_op", "op_mul", a.Z.deepCopy(n[0]), a.Z.deepCopy(n[0])))])));
        break;
      case "atan":
        o = this.createNode("node_op", "op_div", this.createNode("node_const", 1), this.createNode("node_op", "op_add", this.createNode("node_const", 1), this.createNode("node_op", "op_mul", a.Z.deepCopy(n[0]), a.Z.deepCopy(n[0]))));
        break;
      case "acot":
        o = this.createNode("node_op", "op_neg", this.createNode("node_op", "op_div", this.createNode("node_const", 1), this.createNode("node_op", "op_add", this.createNode("node_const", 1), this.createNode("node_op", "op_mul", a.Z.deepCopy(n[0]), a.Z.deepCopy(n[0])))));
        break;
      case "sinh":
        o = this.createNode("node_op", "op_execfun", this.createNode("node_var", "cosh"), [a.Z.deepCopy(n[0])]);
        break;
      case "cosh":
        o = this.createNode("node_op", "op_execfun", this.createNode("node_var", "sinh"), [a.Z.deepCopy(n[0])]);
        break;
      case "tanh":
        o = this.createNode("node_op", "op_sub", this.createNode("node_const", 1), this.createNode("node_op", "op_exp", this.createNode("node_op", "op_execfun", this.createNode("node_var", "tanh"), [a.Z.deepCopy(n[0])]), this.createNode("node_const", 2)));
        break;
      case "asinh":
        o = this.createNode("node_op", "op_div", this.createNode("node_const", 1), this.createNode("node_op", "op_execfun", this.createNode("node_var", "sqrt"), [this.createNode("node_op", "op_add", this.createNode("node_op", "op_mul", a.Z.deepCopy(n[0]), a.Z.deepCopy(n[0])), this.createNode("node_const", 1))]));
        break;
      case "acosh":
        o = this.createNode("node_op", "op_div", this.createNode("node_const", 1), this.createNode("node_op", "op_execfun", this.createNode("node_var", "sqrt"), [this.createNode("node_op", "op_sub", this.createNode("node_op", "op_mul", a.Z.deepCopy(n[0]), a.Z.deepCopy(n[0])), this.createNode("node_const", 1))]));
        break;
      case "atanh":
        o = this.createNode("node_op", "op_div", this.createNode("node_const", 1), this.createNode("node_op", "op_sub", this.createNode("node_const", 1), this.createNode("node_op", "op_mul", a.Z.deepCopy(n[0]), a.Z.deepCopy(n[0]))));
        break;
      default:
        throw o = this.createNode("node_const", 0), console.log('Derivative of "' + s + '" not yet implemented'), new Error("Error(" + this.line + "): ");
    }
    return o;
  }, derivative: function(e, t) {
    var o;
    switch (e.type) {
      case "node_op":
        switch (e.value) {
          case "op_execfun":
            o = e.children[0].value == "pow" ? this.deriveElementary(e, t) : e.children[1].length === 0 ? this.createNode("node_const", 0) : this.createNode("node_op", "op_mul", this.deriveElementary(e, t), this.derivative(e.children[1][0], t));
            break;
          case "op_div":
            o = this.createNode("node_op", "op_div", this.createNode("node_op", "op_sub", this.createNode("node_op", "op_mul", this.derivative(e.children[0], t), a.Z.deepCopy(e.children[1])), this.createNode("node_op", "op_mul", a.Z.deepCopy(e.children[0]), this.derivative(e.children[1], t))), this.createNode("node_op", "op_mul", a.Z.deepCopy(e.children[1]), a.Z.deepCopy(e.children[1])));
            break;
          case "op_mul":
            o = this.createNode("node_op", "op_add", this.createNode("node_op", "op_mul", a.Z.deepCopy(e.children[0]), this.derivative(e.children[1], t)), this.createNode("node_op", "op_mul", this.derivative(e.children[0], t), a.Z.deepCopy(e.children[1])));
            break;
          case "op_neg":
            o = this.createNode("node_op", "op_neg", this.derivative(e.children[0], t));
            break;
          case "op_add":
          case "op_sub":
            o = this.createNode("node_op", e.value, this.derivative(e.children[0], t), this.derivative(e.children[1], t));
            break;
          case "op_exp":
            o = this.createNode("node_op", "op_mul", a.Z.deepCopy(e), this.createNode("node_op", "op_add", this.createNode("node_op", "op_mul", this.derivative(e.children[0], t), this.createNode("node_op", "op_div", a.Z.deepCopy(e.children[1]), a.Z.deepCopy(e.children[0]))), this.createNode("node_op", "op_mul", this.derivative(e.children[1], t), this.createNode("node_op", "op_execfun", this.createNode("node_var", "log"), [a.Z.deepCopy(e.children[0])]))));
        }
        break;
      case "node_var":
        o = e.value === t ? this.createNode("node_const", 1) : this.createNode("node_const", 0);
        break;
      case "node_const":
        o = this.createNode("node_const", 0);
    }
    return o;
  }, expandDerivatives: function(e, t, o) {
    var s, n, h, l, p, u, v, Z, y, O, S;
    if (!e)
      return 0;
    for (this.line = e.line, this.col = e.col, s = e.children.length, n = 0; n < s; ++n)
      if (e.children[n] && e.children[n].type)
        e.children[n] = this.expandDerivatives(e.children[n], e, o);
      else if (a.Z.isArray(e.children[n]))
        for (h = 0; h < e.children[n].length; ++h)
          e.children[n][h] && e.children[n][h].type && (e.children[n][h] = this.expandDerivatives(e.children[n][h], e, o));
    if (e.type === "node_op" && e.value === "op_execfun" && e.children[0] && e.children[0].value === "D") {
      if (e.children[1][0].type == "node_var" ? (Z = e.children[1][0].value, O = (l = this.findMapNode(Z, o)).children[0], y = e.children[1].length >= 2 ? e.children[1][1].value : l.children[0][0], p = l.children[1]) : (p = e.children[1][0], O = ["x"], y = e.children[1].length >= 2 ? e.children[1][1].value : "x"), v = p, (S = e.children[1].length >= 3 ? e.children[1][2].value : 1) >= 1)
        for (; S >= 1; )
          v = this.derivative(v, y), v = this.removeTrivialNodes(v), S--;
      u = t.type == "node_op" && t.value == "op_assign" ? this.createNode("node_op", "op_map", O, v) : v, this.setMath(u), e.type = u.type, e.value = u.value, e.children[0] = u.children[0], e.children[1] = u.children[1];
    }
    return e;
  }, removeTrivialNodes: function(e) {
    var t, o, s, n, h;
    if (a.Z.isArray(e))
      for (o = e.length, t = 0; t < o; ++t)
        e[t] = this.removeTrivialNodes(e[t]);
    if (e.type != "node_op" || !e.children)
      return e;
    for (o = e.children.length, t = 0; t < o; ++t) {
      this.mayNotBeSimplified = !1;
      do
        e.children[t] = this.removeTrivialNodes(e.children[t]);
      while (this.mayNotBeSimplified);
    }
    switch (e.value) {
      case "op_map":
        if (s = e.children[0], (n = e.children[1]).type == "node_var") {
          for (t = 0; t < s.length; ++t)
            if (s[t] == n.value) {
              n.isMath = !0;
              break;
            }
        }
        break;
      case "op_add":
        if (s = e.children[0], n = e.children[1], s.type == "node_const" && s.value === 0)
          return n;
        if (n.type == "node_const" && n.value === 0)
          return s;
        if (s.type == "node_const" && n.type == "node_const")
          return s.value += n.value, s;
        break;
      case "op_mul":
        if (s = e.children[0], n = e.children[1], s.type == "node_const" && s.value == 1)
          return n;
        if (n.type == "node_const" && n.value == 1 || s.type == "node_const" && s.value === 0)
          return s;
        if (n.type == "node_const" && n.value === 0 || n.type == "node_const" && n.value === 0)
          return n;
        if (s.type == "node_op" && s.value == "op_neg" && n.type == "node_op" && n.value == "op_neg")
          return e.children = [s.children[0], n.children[0]], this.mayNotBeSimplified = !0, e;
        if (s.value == "op_neg" && n.value != "op_neg")
          return e.type = "node_op", e.value = "op_neg", e.children = [this.createNode("node_op", "op_mul", s.children[0], n)], this.mayNotBeSimplified = !0, e;
        if (s.value != "op_neg" && n.value == "op_neg")
          return e.type = "node_op", e.value = "op_neg", e.children = [this.createNode("node_op", "op_mul", s, n.children[0])], this.mayNotBeSimplified = !0, e;
        if (s.value == "op_div" && s.children[0].type == "node_const" && s.children[0].value == 1)
          return e.type = "node_op", e.value = "op_div", e.children = [n, s.children[1]], this.mayNotBeSimplified = !0, e;
        if (n.value == "op_div" && n.children[0].type == "node_const" && n.children[0].value == 1)
          return e.type = "node_op", e.value = "op_div", e.children = [s, n.children[1]], this.mayNotBeSimplified = !0, e;
        if (s.type != "node_const" && n.type == "node_const")
          return e.children = [n, s], this.mayNotBeSimplified = !0, e;
        if (s.type != "node_const" && n.type == "node_op" && n.value == "op_neg" && n.children[0].type == "node_const")
          return e.children = [n, s], this.mayNotBeSimplified = !0, e;
        if (s.type == "node_op" && s.value != "op_execfun" && (n.type == "node_var" || n.type == "node_op" && n.value == "op_execfun"))
          return e.children = [n, s], this.mayNotBeSimplified = !0, e;
        if (s.type != "node_op" && n.type == "node_op" && n.value == "op_neg" && n.children[0].type == "node_var")
          return e.children = [n, s], this.mayNotBeSimplified = !0, e;
        if (s.type != "node_const" && n.type == "node_op" && (n.value == "op_mul" || n.value == "op_div") && n.children[0].type == "node_const")
          return h = n.children[0], n.children[0] = s, e.children = [h, n], this.mayNotBeSimplified = !0, e;
        if (n.type != "node_const" && s.type == "node_op" && s.value == "op_mul" && s.children[0].type == "node_const")
          return e.children = [s.children[0], this.createNode("node_op", "op_mul", s.children[1], n)], this.mayNotBeSimplified = !0, e;
        if (s.type == "node_const" && n.type == "node_const")
          return s.value *= n.value, s;
        if (s.type == "node_const" && n.type == "node_op" && (n.value == "op_mul" || n.value == "op_div") && n.children[0].type == "node_const")
          return n.children[0].value *= s.value, n;
        if (s.hash = this.parser.compile(s), n.hash = this.parser.compile(n), s.hash === n.hash)
          return e.value = "op_exp", e.children[1] = this.createNode("node_const", 2), e;
        if (s.type == "node_const" && n.type == "node_op" && (n.value == "op_mul" || n.value == "op_div") && n.children[0].type == "node_const")
          return n.children[0].value *= s.value, n;
        if (n.type == "node_op" && n.value == "op_exp" && (s.hash || (s.hash = this.parser.compile(s)), n.children[0].hash || (n.children[0].hash = this.parser.compile(n.children[0])), s.hash === n.children[0].hash))
          return n.children[1] = this.createNode("node_op", "op_add", n.children[1], this.createNode("node_const", 1)), this.mayNotBeSimplified = !0, n;
        if (s.type == "node_op" && s.value == "op_exp" && n.type == "node_op" && n.value == "op_exp" && (s.children[0].hash = this.parser.compile(s.children[0]), n.children[0].hash = this.parser.compile(n.children[0]), s.children[0].hash === n.children[0].hash))
          return s.children[1] = this.createNode("node_op", "op_add", s.children[1], n.children[1]), this.mayNotBeSimplified = !0, s;
        break;
      case "op_sub":
        if (s = e.children[0], n = e.children[1], s.type == "node_const" && s.value === 0)
          return e.value = "op_neg", e.children[0] = n, e;
        if (n.type == "node_const" && n.value === 0)
          return s;
        if (s.type == "node_const" && n.type == "node_const" && s.value == n.value)
          return this.createNode("node_const", 0);
        if (s.type == "node_var" && n.type == "node_var" && s.value == n.value)
          return this.createNode("node_const", 0);
        if (s.type == "node_const" && n.type == "node_const")
          return s.value -= n.value, s;
        if (s.type == "node_op" && s.value == "op_mul" && n.type == "node_op" && n.value == "op_mul" && (s.children[1].hash = this.parser.compile(s.children[1]), n.children[1].hash = this.parser.compile(n.children[1]), s.children[1].hash === n.children[1].hash))
          return e.value = "op_mul", e.children = [this.createNode("node_op", "op_sub", s.children[0], n.children[0]), s.children[1]], this.mayNotBeSimplified = !0, e;
        if (s.type == "node_op" && s.value == "op_mul" && (s.children[1].hash = this.parser.compile(s.children[1]), n.hash = this.parser.compile(n), s.children[1].hash === n.hash))
          return e.value = "op_mul", e.children = [this.createNode("node_op", "op_sub", s.children[0], this.createNode("node_const", 1)), n], this.mayNotBeSimplified = !0, e;
        if (n.type == "node_op" && n.value == "op_mul" && (n.children[1].hash = this.parser.compile(n.children[1]), s.hash = this.parser.compile(s), n.children[1].hash === s.hash))
          return e.value = "op_mul", e.children = [this.createNode("node_op", "op_sub", this.createNode("node_const", 1), n.children[0]), s], this.mayNotBeSimplified = !0, e;
        break;
      case "op_neg":
        if ((s = e.children[0]).type == "node_const" && s.value === 0)
          return s;
        if (s.type == "node_op" && s.value == "op_neg")
          return s.children[0];
        break;
      case "op_div":
        if (s = e.children[0], n = e.children[1], s.type == "node_const" && n.type == "node_const" && s.value == n.value && s.value !== 0)
          return s.value = 1, s;
        if (s.type == "node_const" && s.value === 0 && n.type == "node_const" && n.value !== 0)
          return s.value = 0, s;
        if (s.type == "node_const" && s.value === 0 && (n.type == "node_op" || n.type == "node_var"))
          return e.type = "node_const", e.value = 0, e;
        if (s.type == "node_var" && n.type == "node_var" && s.value == n.value)
          return this.createNode("node_const", 1);
        if (s.type == "node_const" && s.value !== 0 && n.type == "node_const" && n.value === 0)
          return s.value > 0 ? s.value = 1 / 0 : s.value = -1 / 0, s;
        if (s.type == "node_op" && s.value == "op_neg" && n.type == "node_op" && n.value == "op_neg")
          return e.children = [s.children[0], n.children[0]], this.mayNotBeSimplified = !0, e;
        if (s.value == "op_neg" && n.value != "op_neg")
          return e.type = "node_op", e.value = "op_neg", e.children = [this.createNode("node_op", "op_div", s.children[0], n)], this.mayNotBeSimplified = !0, e;
        if (s.value != "op_neg" && n.value == "op_neg")
          return e.type = "node_op", e.value = "op_neg", e.children = [this.createNode("node_op", "op_div", s, n.children[0])], this.mayNotBeSimplified = !0, e;
        if (s.type == "node_op" && s.value == "op_exp" && (n.hash || (n.hash = this.parser.compile(n)), s.children[0].hash || (s.children[0].hash = this.parser.compile(s.children[0])), n.hash === s.children[0].hash))
          return s.children[1] = this.createNode("node_op", "op_sub", s.children[1], this.createNode("node_const", 1)), this.mayNotBeSimplified = !0, s;
        if (n.type != "node_const" && s.type == "node_op" && s.value == "op_mul" && s.children[0].type == "node_const")
          return e.value = "op_mul", e.children = [s.children[0], this.createNode("node_op", "op_div", s.children[1], n)], this.mayNotBeSimplified = !0, e;
        if (s.type == "node_op" && s.value == "op_exp" && n.type == "node_op" && n.value == "op_exp" && (s.children[0].hash = this.parser.compile(s.children[0]), n.children[0].hash = this.parser.compile(n.children[0]), s.children[0].hash === n.children[0].hash))
          return s.children[1] = this.createNode("node_op", "op_sub", s.children[1], n.children[1]), this.mayNotBeSimplified = !0, s;
        break;
      case "op_exp":
        if (s = e.children[0], (n = e.children[1]).type == "node_const" && n.value === 0)
          return n.value = 1, n;
        if (n.type == "node_const" && n.value == 1 || s.type == "node_const" && s.value == 1 || s.type == "node_const" && s.value === 0 && n.type == "node_const" && n.value !== 0)
          return s;
        if (s.type == "node_op" && s.value == "op_exp")
          return e.children = [s.children[0], this.createNode("node_op", "op_mul", s.children[1], n)], e;
    }
    switch (e.value) {
      case "op_add":
        if (s = e.children[0], n = e.children[1], s.type == "node_const" && n.type == "node_const" && s.value == n.value)
          return s.value += n.value, s;
        if (s.type == "node_var" && n.type == "node_var" && s.value == n.value)
          return e.children[0] = this.createNode("node_const", 2), e.value = "op_mul", e;
        if (s.type == "node_op" && s.value == "op_neg")
          return e.value = "op_sub", e.children[0] = n, e.children[1] = s.children[0], this.mayNotBeSimplified = !0, e;
        if (n.type == "node_op" && n.value == "op_neg")
          return e.value = "op_sub", e.children[1] = n.children[0], this.mayNotBeSimplified = !0, e;
        if (s.type == "node_op" && s.value == "op_mul" && n.type == "node_op" && n.value == "op_mul" && (s.children[1].hash = this.parser.compile(s.children[1]), n.children[1].hash = this.parser.compile(n.children[1]), s.children[1].hash === n.children[1].hash))
          return e.value = "op_mul", e.children = [this.createNode("node_op", "op_add", s.children[0], n.children[0]), s.children[1]], this.mayNotBeSimplified = !0, e;
        if (s.type == "node_op" && s.value == "op_mul" && (s.children[1].hash = this.parser.compile(s.children[1]), n.hash = this.parser.compile(n), s.children[1].hash === n.hash))
          return e.value = "op_mul", e.children = [this.createNode("node_op", "op_add", s.children[0], this.createNode("node_const", 1)), n], this.mayNotBeSimplified = !0, e;
        if (n.type == "node_op" && n.value == "op_mul" && (n.children[1].hash = this.parser.compile(n.children[1]), s.hash = this.parser.compile(s), n.children[1].hash === s.hash))
          return e.value = "op_mul", e.children = [this.createNode("node_op", "op_add", this.createNode("node_const", 1), n.children[0]), s], this.mayNotBeSimplified = !0, e;
        break;
      case "op_sub":
        if (s = e.children[0], (n = e.children[1]).type == "node_op" && n.value == "op_neg")
          return e.value = "op_add", e.children[1] = n.children[0], this.mayNotBeSimplified = !0, e;
        break;
      case "op_execfun":
        return this.simplifyElementary(e);
    }
    return e;
  }, simplifyElementary: function(e) {
    var t = e.children[0].value, o = e.children[1];
    if (o.length == 0)
      return e;
    switch (t) {
      case "sin":
      case "tan":
        if (o[0].type == "node_const" && o[0].value === 0 || o[0].type == "node_var" && o[0].value == "PI" || o[0].type == "node_op" && o[0].value == "op_mul" && o[0].children[0].type == "node_const" && o[0].children[0].value % 1 == 0 && o[0].children[1].type == "node_var" && o[0].children[1].value == "PI")
          return e.type = "node_const", e.value = 0, e;
        break;
      case "cos":
        if (o[0].type == "node_const" && o[0].value === 0)
          return e.type = "node_const", e.value = 1, e;
        if (o[0].type == "node_var" && o[0].value == "PI")
          return e.type = "node_op", e.value = "op_neg", e.children = [this.createNode("node_const", 1)], e;
        break;
      case "exp":
        if (o[0].type == "node_const" && o[0].value === 0)
          return e.type = "node_const", e.value = 1, e;
        break;
      case "pow":
        if (o[1].type == "node_const" && o[1].value === 0)
          return e.type = "node_const", e.value = 1, e;
    }
    return e;
  } }), d.Z.CA, d.Z.Dump = { addMarkers: function(e, t, o) {
    var s, n, h;
    for (s in a.Z.isArray(t) || (t = [t]), a.Z.isArray(o) || (o = [o]), n = Math.min(t.length, o.length), t.length = n, o.length = n, e.objects)
      if (e.objects.hasOwnProperty(s))
        for (h = 0; h < n; h++)
          e.objects[s][t[h]] = o[h];
  }, deleteMarkers: function(e, t) {
    var o, s, n;
    for (o in a.Z.isArray(t) || (t = [t]), s = t.length, t.length = s, e.objects)
      if (e.objects.hasOwnProperty(o))
        for (n = 0; n < s; n++)
          delete e.objects[o][t[n]];
  }, str: function(e) {
    return typeof e == "string" && e.substr(0, 7) !== "function" && (e = '"' + e + '"'), e;
  }, minimizeObject: function(e, t) {
    var o, s, n, h = {}, l = a.Z.deepCopy(e), p = [];
    for (n = 1; n < arguments.length; n++)
      p.push(arguments[n]);
    for (h = a.Z.deepCopy(h, d.Z.Options.elements, !0), n = p.length; n > 0; n--)
      h = a.Z.deepCopy(h, p[n - 1], !0);
    for (o in h)
      h.hasOwnProperty(o) && (s = o.toLowerCase(), typeof h[o] != "object" && h[o] === l[s] && delete l[s]);
    return l;
  }, prepareAttributes: function(e, t) {
    var o, s;
    for (s in o = this.minimizeObject(t.getAttributes(), d.Z.Options[t.elType]), t.subs)
      t.subs.hasOwnProperty(s) && (o[s] = this.minimizeObject(t.subs[s].getAttributes(), d.Z.Options[t.elType][s], d.Z.Options[t.subs[s].elType]), o[s].id = t.subs[s].id, o[s].name = t.subs[s].name);
    return o.id = t.id, o.name = t.name, o;
  }, setBoundingBox: function(e, t, o) {
    return e.push({ obj: o, method: "setBoundingBox", params: [t.getBoundingBox(), t.keepaspectratio] }), e;
  }, dump: function(e) {
    var t, o, s, n, h = [], l = [], p = e.objectsList.length;
    for (this.addMarkers(e, "dumped", !1), t = 0; t < p; t++)
      if (s = {}, !(o = e.objectsList[t]).dumped && o.dump) {
        for (s.type = o.getType(), s.parents = o.getParents().slice(), s.type === "point" && s.parents[0] === 1 && (s.parents = s.parents.slice(1)), n = 0; n < s.parents.length; n++)
          a.Z.isString(s.parents[n]) && s.parents[n][0] !== "'" && s.parents[n][0] !== '"' ? s.parents[n] = '"' + s.parents[n] + '"' : a.Z.isArray(s.parents[n]) && (s.parents[n] = "[" + s.parents[n].toString() + "]");
        s.attributes = this.prepareAttributes(e, o), s.type === "glider" && o.onPolygon && h.push({ obj: o.id, prop: "onPolygon", val: !0 }), l.push(s);
      }
    return this.deleteMarkers(e, "dumped"), { elements: l, props: h, methods: [] };
  }, arrayToParamStr: function(e, t) {
    var o, s = [];
    for (o = 0; o < e.length; o++)
      s.push(t.call(this, e[o]));
    return s.join(", ");
  }, toJCAN: function(e) {
    var t, o, s;
    switch (typeof e) {
      case "object":
        if (e) {
          if (o = [], a.Z.isArray(e)) {
            for (t = 0; t < e.length; t++)
              o.push(this.toJCAN(e[t]));
            return "[" + o.join(",") + "]";
          }
          for (s in e)
            e.hasOwnProperty(s) && o.push(s + ": " + this.toJCAN(e[s]));
          return "<<" + o.join(", ") + ">> ";
        }
        return "null";
      case "string":
        return "'" + e.replace(/\\/g, "\\\\").replace(/(["'])/g, "\\$1") + "'";
      case "number":
      case "boolean":
        return e.toString();
      case "null":
        return "null";
    }
  }, toJessie: function(e) {
    var t, o, s, n = this.dump(e), h = [];
    for (n.methods = this.setBoundingBox(n.methods, e, "$board"), o = n.elements, t = 0; t < o.length; t++)
      o[t].attributes.name.length > 0 && h.push("// " + o[t].attributes.name), h.push("s" + t + " = " + o[t].type + "(" + o[t].parents.join(", ") + ") " + this.toJCAN(o[t].attributes).replace(/\n/, "\\n") + ";"), o[t].type === "axis" && (s = o[t].attributes.id, e.objects[s].defaultTicks === null && h.push("s" + t + ".removeAllTicks();")), h.push("");
    for (t = 0; t < n.methods.length; t++)
      h.push(n.methods[t].obj + "." + n.methods[t].method + "(" + this.arrayToParamStr(n.methods[t].params, this.toJCAN) + ");"), h.push("");
    for (t = 0; t < n.props.length; t++)
      h.push(n.props[t].obj + "." + n.props[t].prop + " = " + this.toJCAN(n.props[t].val) + ";"), h.push("");
    return h.join(`
`);
  }, toJavaScript: function(e) {
    var t, o, s, n = this.dump(e), h = [];
    for (n.methods = this.setBoundingBox(n.methods, e, "board"), o = n.elements, t = 0; t < o.length; t++)
      h.push('board.create("' + o[t].type + '", [' + o[t].parents.join(", ") + "], " + a.Z.toJSON(o[t].attributes) + ");"), o[t].type === "axis" && (s = o[t].attributes.id, e.objects[s].defaultTicks === null && h.push('board.objects["' + s + '"].removeTicks(board.objects["' + s + '"].defaultTicks);'));
    for (t = 0; t < n.methods.length; t++)
      h.push(n.methods[t].obj + "." + n.methods[t].method + "(" + this.arrayToParamStr(n.methods[t].params, a.Z.toJSON) + ");"), h.push("");
    for (t = 0; t < n.props.length; t++)
      h.push(n.props[t].obj + "." + n.props[t].prop + " = " + a.Z.toJSON(n.props[t].val) + ";"), h.push("");
    return h.join(`
`);
  } }, d.Z.Dump, d.Z.createComb = function(e, t, o) {
    var s, n, h, l, p;
    if (t.length !== 2)
      throw p = t.map(function(u) {
        return "'" + typeof u + "'";
      }), new Error("JSXGraph: Can't create comb with parent types " + p.join(", ") + `.
Possible parent types: [point,point], [[x1,y1],[x2,y2]]`);
    if (a.Z.isArray(t[0]) && t[0].length > 1)
      l = a.Z.copyAttributes(o, e.options, "comb", "point1"), s = e.create("point", t[0], l);
    else if (a.Z.isString(t[0]) || a.Z.isPoint(t[0]))
      s = e.select(t[0]);
    else if (a.Z.isFunction(t[0]) && a.Z.isPoint(t[0]()))
      s = t[0]();
    else {
      if (!(a.Z.isFunction(t[0]) && t[0]().length && t[0]().length >= 2))
        throw new Error("JSXGraph: Can't create comb with parent types '" + typeof t[0] + "' and '" + typeof t[1] + `'.
Possible parent types: [point,point], [[x1,y1],[x2,y2]]`);
      l = a.Z.copyAttributes(o, e.options, "comb", "point1"), s = d.Z.createPoint(e, t[0](), l);
    }
    if (a.Z.isArray(t[1]) && t[1].length > 1)
      l = a.Z.copyAttributes(o, e.options, "comb", "point2"), n = e.create("point", t[1], l);
    else if (a.Z.isString(t[1]) || a.Z.isPoint(t[1]))
      n = e.select(t[1]);
    else if (a.Z.isFunction(t[1]) && a.Z.isPoint(t[1]()))
      n = t[1]();
    else {
      if (!(a.Z.isFunction(t[1]) && t[1]().length && t[1]().length >= 2))
        throw new Error("JSXGraph: Can't create comb with parent types '" + typeof t[0] + "' and '" + typeof t[1] + `'.
Possible parent types: [point,point], [[x1,y1],[x2,y2]]`);
      l = a.Z.copyAttributes(o, e.options, "comb", "point2"), n = d.Z.createPoint(e, t[1](), l);
    }
    return l = a.Z.copyAttributes(o, e.options, "comb"), a.Z.merge(l, a.Z.copyAttributes(o, e.options, "comb", "curve")), (h = e.create("curve", [[0], [0]], l)).updateDataArray = function() {
      var u, v, Z, y, O, S, R, L, B, X, F = 0, G = s.Dist(n), W = s, H = n;
      for (L = a.Z.evaluate(h.visProp.frequency), B = -a.Z.evaluate(h.visProp.angle), X = a.Z.evaluate(h.visProp.width), a.Z.evaluate(h.visProp.reverse) && (W = n, H = s, B = -B), u = Math.cos(B), v = Math.sin(B), Z = (H.X() - W.X()) / G, y = (H.Y() - W.Y()) / G, u *= X / Math.abs(v), v *= X / Math.abs(v), this.dataX = [], this.dataY = []; F < G; )
        O = W.X() + Z * F, S = W.Y() + y * F, v *= R = Math.min(u, G - F) / Math.abs(u), u *= R, this.dataX.push(O), this.dataY.push(S), this.dataX.push(O + Z * u + y * v), this.dataY.push(S - Z * v + y * u), this.dataX.push(NaN), this.dataY.push(NaN), F += L;
    }, h;
  }, d.Z.registerElement("comb", d.Z.createComb);
  var Ct = function() {
    _t.prototype.remove.call(this), this.board.removeObject(this.toppoint), this.board.removeObject(this.glider), this.board.removeObject(this.baseline), this.board.removeObject(this.basepoint), this.board.removeObject(this.label), this._isPrivateTangent && this.board.removeObject(this.tangent);
  }, yt = function() {
    return this.tangent.getSlope();
  };
  d.Z.createSlopeTriangle = function(e, t, o) {
    var s, n, h, l, p, u, v, Z, y, O = !1;
    if (t.length === 1 && t[0].type === x.Z.OBJECT_TYPE_TANGENT)
      n = t[0], h = n.glider;
    else if (t.length === 1 && t[0].type === x.Z.OBJECT_TYPE_GLIDER)
      h = t[0], y = a.Z.copyAttributes(o, e.options, "slopetriangle", "tangent"), n = e.create("tangent", [h], y), O = !0;
    else {
      if (t.length !== 2 || t[0].elementClass !== x.Z.OBJECT_CLASS_LINE || !a.Z.isPoint(t[1]))
        throw new Error("JSXGraph: Can't create slope triangle with parent types '" + typeof t[0] + "'.");
      n = t[0], h = t[1];
    }
    return y = a.Z.copyAttributes(o, e.options, "slopetriangle", "basepoint"), v = e.create("point", [function() {
      return [h.X() + 1, h.Y()];
    }], y), y = a.Z.copyAttributes(o, e.options, "slopetriangle", "baseline"), u = e.create("line", [h, v], y), y = a.Z.copyAttributes(o, e.options, "slopetriangle", "glider"), l = e.create("glider", [h.X() + 1, h.Y(), u], y), y = a.Z.copyAttributes(o, e.options, "slopetriangle", "toppoint"), p = e.create("point", [function() {
      return [l.X(), l.Y() + (l.X() - h.X()) * n.getSlope()];
    }], y), (y = a.Z.copyAttributes(o, e.options, "slopetriangle")).borders = a.Z.copyAttributes(y.borders, e.options, "slopetriangle", "borders"), (s = e.create("polygon", [h, l, p], y)).Value = yt, s.tangent = n, s._isPrivateTangent = O, s.borders[2].setArrow(!1, !1), y = a.Z.copyAttributes(o, e.options, "slopetriangle", "label"), (Z = e.create("text", [function() {
      return l.X() + 0.1;
    }, function() {
      return 0.5 * (l.Y() + p.Y());
    }, function() {
      return "";
    }], y))._setText(function() {
      return a.Z.toFixed(s.Value(), a.Z.evaluate(Z.visProp.digits));
    }), Z.fullUpdate(), s.glider = l, s.basepoint = v, s.baseline = u, s.toppoint = p, s.label = Z, s.subs = { glider: l, basePoint: v, baseLine: u, topPoint: p, label: Z }, s.inherits.push(l, v, u, p, Z), s.methodMap = d.Z.deepCopy(s.methodMap, { tangent: "tangent", glider: "glider", basepoint: "basepoint", baseline: "baseline", toppoint: "toppoint", label: "label", Value: "Value", V: "Value" }), s.remove = Ct, s;
  }, d.Z.registerElement("slopetriangle", d.Z.createSlopeTriangle);
  var Pt = function() {
    this._value = this.rendNodeCheckbox.checked, this.board.update();
  };
  d.Z.createCheckbox = function(e, t, o) {
    var s, n, h = a.Z.copyAttributes(o, e.options, "checkbox");
    return n = [t[0], t[1], '<span style="display:inline"><input type="checkbox" /><label for=""></label></span>'], (s = e.create("text", n, h)).type = a.Z.OBJECT_TYPE_CHECKBOX, s.rendNodeCheckbox = s.rendNode.childNodes[0].childNodes[0], s.rendNodeLabel = s.rendNode.childNodes[0].childNodes[1], s.rendNodeTag = s.rendNodeCheckbox, s.rendNodeTag.disabled = !!h.disabled, s.rendNodeCheckbox.id = s.rendNode.id + "_checkbox", s.rendNodeLabel.id = s.rendNode.id + "_label", s.rendNodeLabel.setAttribute("for", s.rendNodeCheckbox.id), s.setText(t[2]), s.visPropOld.fontsize = "0px", e.renderer.updateTextStyle(s, !1), s.rendNodeCheckbox.checked = h.checked, s._value = h.checked, s.Value = function() {
      return this._value;
    }, s.update = function() {
      return this.needsUpdate && (d.Z.Text.prototype.update.call(this), this._value = this.rendNodeCheckbox.checked), this;
    }, M.Z.addEvent(s.rendNodeCheckbox, "change", Pt, s), s;
  }, d.Z.registerElement("checkbox", d.Z.createCheckbox);
  var Nt = function(e) {
    this._value = this.rendNodeInput.value, this.board.update();
  };
  d.Z.createInput = function(e, t, o) {
    var s, n, h = a.Z.copyAttributes(o, e.options, "input");
    return n = [t[0], t[1], '<span style="display:inline; white-space:nowrap; padding:0px;"><span></span><input type="text" maxlength="' + h.maxlength + '" style="width:100%"/></span>'], (s = e.create("text", n, h)).type = a.Z.OBJECT_TYPE_INPUT, s.rendNodeLabel = s.rendNode.childNodes[0].childNodes[0], s.rendNodeInput = s.rendNode.childNodes[0].childNodes[1], s.rendNodeInput.value = t[2], s.rendNodeTag = s.rendNodeInput, s.rendNodeTag.disabled = !!h.disabled, s.rendNodeLabel.id = s.rendNode.id + "_label", s.rendNodeInput.id = s.rendNode.id + "_input", s.setText(t[3]), s._value = t[2], s.update = function() {
      return this.needsUpdate && (d.Z.Text.prototype.update.call(this), this._value = this.rendNodeInput.value), this;
    }, s.Value = function() {
      return this._value;
    }, s.set = function(l) {
      return this._value = l, this.rendNodeInput.value = l, this;
    }, M.Z.addEvent(s.rendNodeInput, "input", Nt, s), M.Z.addEvent(s.rendNodeInput, "mousedown", function(l) {
      a.Z.exists(l.stopPropagation) && l.stopPropagation();
    }, s), M.Z.addEvent(s.rendNodeInput, "touchstart", function(l) {
      a.Z.exists(l.stopPropagation) && l.stopPropagation();
    }, s), M.Z.addEvent(s.rendNodeInput, "pointerdown", function(l) {
      a.Z.exists(l.stopPropagation) && l.stopPropagation();
    }, s), s.visPropOld.fontsize = "0px", e.renderer.updateTextStyle(s, !1), s;
  }, d.Z.registerElement("input", d.Z.createInput);
  var At = function() {
    this._handler && this._handler(), this.board.update();
  };
  d.Z.createButton = function(e, t, o) {
    var s, n, h = a.Z.copyAttributes(o, e.options, "button");
    return n = [t[0], t[1], '<button type="button" style="width:100%;"></button>'], (s = e.create("text", n, h)).type = a.Z.OBJECT_TYPE_BUTTON, s.rendNodeButton = s.rendNode.childNodes[0], s.rendNodeButton.id = s.rendNode.id + "_button", s.rendNodeTag = s.rendNodeButton, s.rendNodeTag.disabled = !!h.disabled, s.setText(t[2]), s.visPropOld.fontsize = "0px", e.renderer.updateTextStyle(s, !1), t[3] && (a.Z.isString(t[3]) ? (s._jc = new d.Z.JessieCode(), s._jc.use(e), s._handler = function() {
      s._jc.parse(t[3]);
    }) : s._handler = t[3]), M.Z.addEvent(s.rendNodeButton, "click", At, s), M.Z.addEvent(s.rendNodeButton, "mousedown", function(l) {
      a.Z.exists(l.stopPropagation) && l.stopPropagation();
    }, s), M.Z.addEvent(s.rendNodeButton, "touchstart", function(l) {
      a.Z.exists(l.stopPropagation) && l.stopPropagation();
    }, s), M.Z.addEvent(s.rendNodeButton, "pointerdown", function(l) {
      a.Z.exists(l.stopPropagation) && l.stopPropagation();
    }, s), s;
  }, d.Z.registerElement("button", d.Z.createButton), d.Z.ForeignObject = function(e, t, o, s, n) {
    this.constructor(e, o, x.Z.OBJECT_TYPE_FOREIGNOBJECT, x.Z.OBJECT_CLASS_OTHER), this.element = this.board.select(o.anchor), this.coordsConstructor(t), this._useUserSize = !1, this.size = [1, 1], a.Z.exists(n) && n.length > 0 && (this._useUserSize = !0, this.W = a.Z.createFunction(n[0], this.board, ""), this.H = a.Z.createFunction(n[1], this.board, ""), this.addParentsFromJCFunctions([this.W, this.H]), this.usrSize = [this.W(), this.H()]), this.content = s, this.elType = "foreignobject", this.id = this.board.setId(this, "Im"), this.board.renderer.drawForeignObject(this), this.board.finalizeAdding(this), this.methodMap = d.Z.deepCopy(this.methodMap, { addTransformation: "addTransform", trans: "addTransform" });
  }, d.Z.ForeignObject.prototype = new Je.Z(), a.Z.copyPrototypeMethods(d.Z.ForeignObject, rt.Z, "coordsConstructor"), d.Z.extend(d.Z.ForeignObject.prototype, { hasPoint: function(e, t) {
    var o, s, n, h, l, p, u, v, Z, y = this.transformations.length;
    return a.Z.isObject(a.Z.evaluate(this.visProp.precision)) ? (h = this.board._inputDevice, l = a.Z.evaluate(this.visProp.precision[h])) : l = this.board.options.precision.hasPoint, y === 0 ? (o = e - this.coords.scrCoords[1], s = this.coords.scrCoords[2] - t, o >= -(n = l) && o - this.size[0] <= n && s >= -n && s - this.size[1] <= n) : (u = [(p = (p = new b.Z(x.Z.COORDS_BY_SCREEN, [e, t], this.board)).usrCoords)[0] - this.span[0][0], p[1] - this.span[0][1], p[2] - this.span[0][2]], 0 <= (v = (Z = k.Z.innerProduct)(u, this.span[1])) && v <= Z(this.span[1], this.span[1]) && 0 <= (v = Z(u, this.span[2])) && v <= Z(this.span[2], this.span[2]));
  }, update: function(e) {
    return this.needsUpdate ? (this.updateCoords(e), this.updateSize(), this) : this;
  }, updateRenderer: function() {
    return this.updateRendererGeneric("updateForeignObject");
  }, updateSize: function() {
    var e = [0, 0];
    return this._useUserSize ? (this.usrSize = [this.W(), this.H()], this.size = [Math.abs(this.usrSize[0] * this.board.unitX), Math.abs(this.usrSize[1] * this.board.unitY)]) : this.rendNode.hasChildNodes() && (e = this.rendNode.childNodes[0].getBoundingClientRect(), this.size = [e.width, e.height]), this;
  }, updateSpan: function() {
    var e, t, o = this.transformations.length, s = [];
    if (o === 0)
      this.span = [[this.Z(), this.X(), this.Y()], [this.Z(), this.W(), 0], [this.Z(), 0, this.H()]];
    else {
      for (s[0] = [this.Z(), this.X(), this.Y()], s[1] = [this.Z(), this.X() + this.W(), this.Y()], s[2] = [this.Z(), this.X(), this.Y() + this.H()], e = 0; e < o; e++)
        for (t = 0; t < 3; t++)
          s[t] = k.Z.matVecMult(this.transformations[e].matrix, s[t]);
      for (t = 0; t < 3; t++)
        s[t][1] /= s[t][0], s[t][2] /= s[t][0], s[t][0] /= s[t][0];
      for (t = 1; t < 3; t++)
        s[t][0] -= s[0][0], s[t][1] -= s[0][1], s[t][2] -= s[0][2];
      this.span = s;
    }
    return this;
  }, addTransform: function(e) {
    var t;
    if (a.Z.isArray(e))
      for (t = 0; t < e.length; t++)
        this.transformations.push(e[t]);
    else
      this.transformations.push(e);
    return this;
  }, getParents: function() {
    var e = [this.url, [this.Z(), this.X(), this.Y()], this.usrSize];
    return this.parents.length !== 0 && (e = this.parents), e;
  }, setSize: function(e, t) {
    return this.W = a.Z.createFunction(e, this.board, ""), this.H = a.Z.createFunction(t, this.board, ""), this._useUserSize = !0, this.addParentsFromJCFunctions([this.W, this.H]), this;
  }, W: function() {
  }, H: function() {
  } }), d.Z.createForeignObject = function(e, t, o) {
    var s, n, h = t[0], l = t[1], p = [];
    if (t.length >= 2 && (p = t[2]), s = a.Z.copyAttributes(o, e.options, "foreignobject"), !(n = rt.Z.create(d.Z.ForeignObject, e, l, s, h, p)))
      throw new Error("JSXGraph: Can't create foreignObject with parent types '" + typeof t[0] + "' and '" + typeof t[1] + `'.
Possible parent types: [string, [x, y], [w, h]], [string, [x, y]], [element,transformation]`);
    return n;
  }, d.Z.registerElement("foreignobject", d.Z.createForeignObject), d.Z.registerElement("fo", d.Z.createForeignObject), d.Z.ForeignObject, d.Z.extend(te.Z, { axes3d: { axesPosition: "center", xAxis: { visible: !0, point2: { name: "x" } }, yAxis: { visible: !0, point2: { name: "y" } }, zAxis: { visible: !0, point2: { name: "z" } }, xPlaneRear: { visible: !0, layer: 0, mesh3d: { layer: 1 } }, yPlaneRear: { visible: !0, layer: 0, mesh3d: { layer: 1 } }, zPlaneRear: { visible: !0, layer: 0, mesh3d: { layer: 1 } }, xPlaneFront: { visible: !1, layer: 0, mesh3d: { layer: 1 } }, yPlaneFront: { visible: !1, layer: 0, mesh3d: { layer: 1 } }, zPlaneFront: { visible: !1, layer: 0, mesh3d: { layer: 1 } }, xPlaneRearYAxis: { visible: "inherit", strokeColor: "#888888", strokeWidth: 1 }, xPlaneRearZAxis: { visible: "inherit", strokeColor: "#888888", strokeWidth: 1 }, xPlaneFrontYAxis: { visible: "inherit", strokeColor: "#888888", strokeWidth: 1 }, xPlaneFrontZAxis: { visible: "inherit", strokeColor: "#888888", strokeWidth: 1 }, yPlaneRearXAxis: { visible: "inherit", strokeColor: "#888888", strokeWidth: 1 }, yPlaneRearZAxis: { visible: "inherit", strokeColor: "#888888", strokeWidth: 1 }, yPlaneFrontXAxis: { visible: "inherit", strokeColor: "#888888", strokeWidth: 1 }, yPlaneFrontZAxis: { visible: "inherit", strokeColor: "#888888", strokeWidth: 1 }, zPlaneRearXAxis: { visible: "inherit", strokeColor: "#888888", strokeWidth: 1 }, zPlaneRearYAxis: { visible: "inherit", strokeColor: "#888888", strokeWidth: 1 }, zPlaneFrontXAxis: { visible: "inherit", strokeColor: "#888888", strokeWidth: 1 }, zPlaneFrontYAxis: { visible: "inherit", strokeColor: "#888888", strokeWidth: 1 } }, axis3d: { highlight: !1, strokecolor: "black", strokeWidth: 1, tabindex: null, point1: { visible: !1, name: "" }, point2: { visible: !1, name: "", label: { visible: !0 } } }, curve3d: { highlight: !1, tabindex: -1, strokeWidth: 1, numberPointsHigh: 200 }, mesh3d: { strokeWidth: 1, strokeColor: "#9a9a9a", strokeOpacity: 0.6, highlight: !1, fillColor: "#9a9a9a", fillOpacity: 0.1, tabindex: null, visible: "inherit" }, line3d: { strokeWidth: 1, strokeColor: "black", fixed: !0, tabindex: null, gradient: "linear", gradientSecondColor: "#ffffff", point: { visible: !1, name: "" }, point1: { visible: !1, name: "" }, point2: { visible: !1, name: "" } }, plane3d: { strokeWidth: 0, strokeColor: "black", strokeOpacity: 1, highlight: !1, tabindex: null, gradient: "linear", gradientSecondColor: "#ffffff", gradientAngle: Math.PI, fillColor: "#a7a7a7", fillOpacity: 0.6, point: { visible: !1, name: "", fixed: !0 } }, point3d: { infoboxDigits: "auto", strokeWidth: 0, gradient: "radial", gradientSecondColor: "#555555", fillColor: "yellow", highlightStrokeColor: "#555555" }, surface3d: { highlight: !1, tabindex: -1, strokeWidth: 1, stepsU: 30, stepsV: 30 }, view3d: { needsRegularUpdate: !0 } }), d.Z.Options, d.Z.View3D = function(e, t, o) {
    this.constructor(e, o, x.Z.OBJECT_TYPE_VIEW3D, x.Z.OBJECT_CLASS_3D), this.objects = {}, this.objectsList = [], this.elementsByName = {}, this.defaultAxes = null, this.matrix3D = [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0]], this.llftCorner = t[0], this.size = t[1], this.bbox3D = t[2], this.r = -1, this.timeoutAzimuth = null, this.id = this.board.setId(this, "V"), this.board.finalizeAdding(this), this.elType = "view3d", this.methodMap = a.Z.deepCopy(this.methodMap, {});
  }, d.Z.View3D.prototype = new Je.Z(), d.Z.extend(d.Z.View3D.prototype, { create: function(e, t, o) {
    var s = [];
    return e.indexOf("3d") > 0 && s.push(this), this.board.create(e, s.concat(t), o);
  }, select: function(e, t) {
    var o, s, n, h, l = e;
    if (l === null)
      return l;
    if (a.Z.isString(l) && l !== "")
      a.Z.exists(this.objects[l]) ? l = this.objects[l] : a.Z.exists(this.elementsByName[l]) && (l = this.elementsByName[l]);
    else if (!t && (a.Z.isFunction(l) || a.Z.isObject(l) && !a.Z.isFunction(l.setAttribute))) {
      for (s = {}, h = (o = a.Z.filterElements(this.objectsList, l)).length, n = 0; n < h; n++)
        s[o[n].id] = o[n];
      l = new Re(s);
    } else
      a.Z.isObject(l) && a.Z.exists(l.id) && !a.Z.exists(this.objects[l.id]) && (l = null);
    return l;
  }, update: function() {
    var e, t, o, s, n;
    return a.Z.exists(this.el_slide) && a.Z.exists(this.az_slide) && this.needsUpdate ? (e = this.el_slide.Value(), t = this.r, o = this.az_slide.Value(), s = t * Math.sin(e), n = [[1, 0, 0], [0, 1, 0], [0, 0, 1]], this.matrix3D = [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0]], this.matrix3D[1][1] = t * Math.cos(o), this.matrix3D[1][2] = -t * Math.sin(o), this.matrix3D[2][1] = s * Math.sin(o), this.matrix3D[2][2] = s * Math.cos(o), this.matrix3D[2][3] = Math.cos(e), n[1][1] = this.size[0] / (this.bbox3D[0][1] - this.bbox3D[0][0]), n[2][2] = this.size[1] / (this.bbox3D[1][1] - this.bbox3D[1][0]), n[1][0] = this.llftCorner[0] - n[1][1] * this.bbox3D[0][0], n[2][0] = this.llftCorner[1] - n[2][2] * this.bbox3D[1][0], this.matrix3D = k.Z.matMatMult(n, this.matrix3D), this) : this;
  }, updateRenderer: function() {
    return this.needsUpdate = !1, this;
  }, project3DTo2D: function(e, t, o) {
    var s;
    return s = arguments.length === 3 ? [1, e, t, o] : e.length === 3 ? [1].concat(e) : e, k.Z.matVecMult(this.matrix3D, s);
  }, project2DTo3DPlane: function(e, t, o) {
    var s, n, h, l, p = t.slice(1), u = [1, 0, 0, 0];
    o = o || [1, 0, 0, 0], l = k.Z.norm(p, 3), h = k.Z.innerProduct(o.slice(1), p, 3) / l, (s = this.matrix3D.slice(0, 3)).push([0].concat(p)), n = e.coords.usrCoords.concat([h]);
    try {
      s[2][3] === 1 && (s[2][1] = s[2][2] = 1e-3 * k.Z.eps), u = k.Z.Numerics.Gauss(s, n);
    } catch {
      u = [0, NaN, NaN, NaN];
    }
    return u;
  }, project3DToCube: function(e) {
    var t = this.bbox3D;
    return e[1] < t[0][0] && (e[1] = t[0][0]), e[1] > t[0][1] && (e[1] = t[0][1]), e[2] < t[1][0] && (e[2] = t[1][0]), e[2] > t[1][1] && (e[2] = t[1][1]), e[3] < t[2][0] && (e[3] = t[2][0]), e[3] > t[2][1] && (e[3] = t[2][1]), e;
  }, intersectionLineCube: function(e, t, o) {
    var s, n, h, l;
    for (s = o, n = 0; n < 3; n++)
      t[n] !== 0 && (h = (this.bbox3D[n][0] - e[n]) / t[n], l = (this.bbox3D[n][1] - e[n]) / t[n], s = o < 0 ? Math.max(s, Math.min(h, l)) : Math.min(s, Math.max(h, l)));
    return s;
  }, isInCube: function(e) {
    return e[0] > this.bbox3D[0][0] - k.Z.eps && e[0] < this.bbox3D[0][1] + k.Z.eps && e[1] > this.bbox3D[1][0] - k.Z.eps && e[1] < this.bbox3D[1][1] + k.Z.eps && e[2] > this.bbox3D[2][0] - k.Z.eps && e[2] < this.bbox3D[2][1] + k.Z.eps;
  }, intersectionPlanePlane: function(e, t, o) {
    var s, n, h, l, p = [[], []];
    return o = o || t.d, s = k.Z.Geometry.meet3Planes(e.normal, e.d, t.normal, o, k.Z.crossProduct(e.normal, t.normal), 0), n = k.Z.Geometry.meetPlanePlane(e.vec1, e.vec2, t.vec1, t.vec2), h = this.intersectionLineCube(s, n, 1 / 0), l = k.Z.axpy(h, n, s), this.isInCube(l) && (p[0] = l), h = this.intersectionLineCube(s, n, -1 / 0), l = k.Z.axpy(h, n, s), this.isInCube(l) && (p[1] = l), p;
  }, getMesh: function(e, t, o) {
    var s, n, h, l, p, u, v, Z = [0, 0, 0], y = t[2], O = o[2], S = [], R = [];
    for (u = (a.Z.evaluate(t[1]) - a.Z.evaluate(t[0])) / y, v = (a.Z.evaluate(o[1]) - a.Z.evaluate(o[0])) / O, s = 0; s <= y; s++) {
      for (h = t[0] + u * s, n = 0; n <= O; n++)
        l = o[0] + v * n, Z = a.Z.isFunction(e) ? e(h, l) : [e[0](h, l), e[1](h, l), e[2](h, l)], p = this.project3DTo2D(Z), S.push(p[1]), R.push(p[2]);
      S.push(NaN), R.push(NaN);
    }
    for (n = 0; n <= O; n++) {
      for (l = o[0] + v * n, s = 0; s <= y; s++)
        h = t[0] + u * s, Z = a.Z.isFunction(e) ? e(h, l) : [e[0](h, l), e[1](h, l), e[2](h, l)], p = this.project3DTo2D(Z), S.push(p[1]), R.push(p[2]);
      S.push(NaN), R.push(NaN);
    }
    return [S, R];
  }, animateAzimuth: function() {
    var e = this.az_slide._smin, t = this.az_slide._smax - e, o = this.az_slide.Value() + 0.1;
    this.az_slide.position = (o - e) / t, this.az_slide.position > 1 && (this.az_slide.position = 0), this.board.update(), this.timeoutAzimuth = setTimeout(function() {
      this.animateAzimuth();
    }.bind(this), 200);
  }, stopAzimuth: function() {
    clearTimeout(this.timeoutAzimuth), this.timeoutAzimuth = null;
  } }), d.Z.createView3D = function(e, t, o) {
    var s, n, h, l, p, u, v = t[0], Z = t[1];
    return n = a.Z.copyAttributes(o, e.options, "view3d"), (s = new d.Z.View3D(e, t, n)).defaultAxes = s.create("axes3d", t, o), h = v[0], l = v[1], p = Z[0], u = Z[1], s.az_slide = e.create("slider", [[h - 1, l - 2], [h + p + 1, l - 2], [0, 1, 2 * Math.PI]], { style: 6, name: "az", point1: { frozen: !0 }, point2: { frozen: !0 } }), s.el_slide = e.create("slider", [[h - 1, l], [h - 1, l + u], [0, 0.3, Math.PI / 2]], { style: 6, name: "el", point1: { frozen: !0 }, point2: { frozen: !0 } }), s.board.highlightInfobox = function(y, O, S) {
      var R, L, B, X, F = S.board, G = null;
      for (L = 0; L < S.parents.length && !(G = F.objects[S.parents[L]]).is3D; L++)
        ;
      if (G) {
        if (X = [1, 0, 0, G.coords[3]], B = s.project2DTo3DPlane(G.element2D, [1, 0, 0, 1], X), !s.isInCube(B))
          return void s.board.highlightCustomInfobox("", G);
        (R = a.Z.evaluate(G.visProp.infoboxdigits)) === "auto" ? s.board.highlightCustomInfobox("(" + a.Z.autoDigits(G.X()) + " | " + a.Z.autoDigits(G.Y()) + " | " + a.Z.autoDigits(G.Z()) + ")", G) : s.board.highlightCustomInfobox("(" + a.Z.toFixed(G.X(), R) + " | " + a.Z.toFixed(G.Y(), R) + " | " + a.Z.toFixed(G.Z(), R) + ")", G);
      } else
        s.board.highlightCustomInfobox("(" + y + ", " + O + ")", S);
    }, s.board.update(), s;
  }, d.Z.registerElement("view3d", d.Z.createView3D), d.Z.View3D, d.Z.GeometryElement3D = function(e, t) {
    this.elType = t, this.id = this.board.setId(this, t), this.view = e, this.element2D = null, this.is3D = !0, this.view.objects[this.id] = this, this.view.objectsList.push(this), this.name !== "" && (this.view.elementsByName[this.name] = this);
  }, d.Z.GeometryElement3D, d.Z.createAxes3D = function(e, t, o) {
    var s, n, h, l, p, u, v, Z, y, O, S, R, L, B, X, F, G, W = t[0], H = ["x", "y", "z"], q = "Axis", oe = ["Rear", "Front"], ee = [0, 0, 0], he = [0, 0, 0], re = {};
    if (a.Z.exists(W.bbox3D))
      for (s = 0; s < H.length; s++)
        ee[s] = W.bbox3D[s][0], he[s] = W.bbox3D[s][1];
    else
      for (s = 0; s < H.length; s++)
        ee[s] = t[1][s], he[s] = t[2][1];
    for (v = (u = a.Z.copyAttributes(o, e.options, "axes3d")).axesposition, s = 0; s < H.length; s++)
      X = (Z = H[s]) + q, v === "center" ? (y = [0, 0, 0], (O = [0, 0, 0])[s] = he[s], re[X] = W.create("axis3d", [y, O], u[X.toLowerCase()])) : (X += "Border", y = ee.slice(), O = he.slice(), s === 2 ? (y[1] = he[1], O[0] = ee[0]) : (y[s] = he[s], O[2] = ee[2]), O[s] = he[s], u[X.toLowerCase()].lastArrow = !1, re[X] = W.create("axis3d", [y, O], u[X.toLowerCase()]), G = { visible: !0, minorTicks: 0, tickEndings: [0, 1], drawLabels: !1 }, s === 2 && (G.tickEndings = [1, 0]), re[X + "Ticks"] = W.create("ticks", [re[X], 1], G));
    for (re.O = W.create("intersection", [re[H[0] + q], re[H[1] + q]], { name: "", visible: !1, withLabel: !1 }), s = 0; s < H.length; s++)
      for (l = (s + 1) % 3, p = (s + 2) % 3, Z = H[s], n = 0; n < oe.length; n++)
        (y = [0, 0, 0])[s] = n === 0 ? ee[s] : he[s], R = [0, 0, 0], (S = [0, 0, 0])[l] = 1, R[p] = 1, L = [ee[l], he[l]], B = [ee[p], he[p]], X = Z + "Plane" + oe[n], u = a.Z.copyAttributes(o, e.options, "axes3d", X), re[X] = W.create("plane3d", [y, S, R, L, B], u), re[X].elType = "axisplane3d";
    for (s = 0; s < H.length; s++)
      for (Z = H[s], n = 0; n < oe.length; n++)
        for (h = 1; h <= 2; h++)
          X = Z + "Plane" + oe[n] + H[l = (s + h) % 3].toUpperCase() + "Axis", F = Z + "Plane" + oe[n], (y = [0, 0, 0])[s] = (O = [0, 0, 0])[s] = n === 0 ? ee[s] : he[s], y[l] = ee[l], O[l] = he[l], u = a.Z.copyAttributes(o, e.options, "axes3d", X), re[X] = W.create("axis3d", [y, O], u), re[F].addChild(re[X]), re[F].element2D.inherits.push(re[X]);
    return re;
  }, d.Z.registerElement("axes3d", d.Z.createAxes3D), d.Z.createAxis3D = function(e, t, o) {
    var s, n, h, l, p, u, v = t[0], Z = t[1], y = t[2];
    return s = a.Z.copyAttributes(o.point1, e.options, "axis3d", "point1"), n = v.create("point", [(l = Z[0], p = Z[1], u = Z[2], function() {
      return v.project3DTo2D(l, p, u)[1];
    }), function(O, S, R) {
      return function() {
        return v.project3DTo2D(O, S, R)[2];
      };
    }(Z[0], Z[1], Z[2])], s), s = a.Z.copyAttributes(o.point2, e.options, "axis3d", "point2"), h = v.create("point", [function(O, S, R) {
      return function() {
        return v.project3DTo2D(O, S, R)[1];
      };
    }(y[0], y[1], y[2]), function(O, S, R) {
      return function() {
        return v.project3DTo2D(O, S, R)[2];
      };
    }(y[0], y[1], y[2])], s), s = a.Z.copyAttributes(o, e.options, "axis3d"), v.create("arrow", [n, h], s);
  }, d.Z.registerElement("axis3d", d.Z.createAxis3D), d.Z.createMesh3D = function(e, t, o) {
    var s, n = t[0], h = t[1], l = t[2], p = t[3], u = t[4], v = t[5];
    return (s = n.create("curve", [[], []], o)).updateDataArray = function() {
      var Z, y, O, S, R = p[0], L = p[1], B = v[0], X = v[1], F = [0, 0, 0], G = [0, 0, 0], W = [0, 0, 0];
      if (this.dataX = [], this.dataY = [], a.Z.isFunction(h))
        W = h().slice(1);
      else
        for (S = 0; S < 3; S++)
          W[S] = a.Z.evaluate(h[S]);
      for (S = 0; S < 3; S++)
        F[S] = a.Z.evaluate(l[S]), G[S] = a.Z.evaluate(u[S]);
      for (Z = d.Z.Math.norm(F, 3), y = d.Z.Math.norm(G, 3), S = 0; S < 3; S++)
        F[S] /= Z, G[S] /= y;
      O = n.getMesh([function(H, q) {
        return W[0] + H * F[0] + q * G[0];
      }, function(H, q) {
        return W[1] + H * F[1] + q * G[1];
      }, function(H, q) {
        return W[2] + H * F[2] + q * G[2];
      }], [Math.ceil(R), Math.floor(L), (Math.ceil(L) - Math.floor(R)) / 1], [Math.ceil(B), Math.floor(X), (Math.ceil(X) - Math.floor(B)) / 1]), this.dataX = O[0], this.dataY = O[1];
    }, s;
  }, d.Z.registerElement("mesh3d", d.Z.createMesh3D), d.Z.Point3D = function(e, t, o, s) {
    this.constructor(e.board, s, x.Z.OBJECT_TYPE_POINT3D, x.Z.OBJECT_CLASS_3D), this.constructor3D(e, "point3d"), this.id = this.view.board.setId(this, "P3D"), this.board.finalizeAdding(this), this.coords = [0, 0, 0, 0], this.F = t, this.slide = o, this.X = function() {
      return this.coords[1];
    }, this.Y = function() {
      return this.coords[2];
    }, this.Z = function() {
      return this.coords[3];
    }, this._params = null, this._c2d = null, this.methodMap = a.Z.deepCopy(this.methodMap, {});
  }, d.Z.Point3D.prototype = new d.Z.GeometryElement(), a.Z.copyPrototypeMethods(d.Z.Point3D, d.Z.GeometryElement3D, "constructor3D"), d.Z.extend(d.Z.Point3D.prototype, { updateCoords: function() {
    var e;
    if (a.Z.isFunction(this.F))
      this.coords = [1].concat(a.Z.evaluate(this.F));
    else
      for (this.coords[0] = 1, e = 0; e < 3; e++)
        a.Z.isFunction(this.F[e]) && (this.coords[e + 1] = a.Z.evaluate(this.F[e]));
    return this;
  }, initCoords: function() {
    var e;
    if (a.Z.isFunction(this.F))
      this.coords = [1].concat(a.Z.evaluate(this.F));
    else
      for (this.coords[0] = 1, e = 0; e < 3; e++)
        this.coords[e + 1] = a.Z.evaluate(this.F[e]);
    return this;
  }, normalizeCoords: function() {
    return Math.abs(this.coords[0]) > k.Z.eps && (this.coords[1] /= this.coords[0], this.coords[2] /= this.coords[0], this.coords[3] /= this.coords[0], this.coords[0] = 1), this;
  }, setPosition: function(e, t) {
    var o = this.coords;
    return this.coords.slice(), e.length === 3 ? (o[0] = 1, o[1] = e[0], o[2] = e[1], o[3] = e[2]) : (o[0] = e[0], o[1] = e[1], o[2] = e[2], o[3] = e[2], this.normalizeCoords()), this;
  }, update: function(e) {
    var t, o;
    return this.element2D.draggable() && _.Z.distance(this._c2d, this.element2D.coords.usrCoords) !== 0 ? this.slide ? this.projectCoords2Surface() : (o = [1, 0, 0, this.coords[3]], (t = this.view.project2DTo3DPlane(this.element2D, [1, 0, 0, 1], o))[0] !== 0 && (this.coords = this.view.project3DToCube(t))) : (this.updateCoords(), this.element2D.coords.setCoordinates(x.Z.COORDS_BY_USER, this.view.project3DTo2D([1, this.X(), this.Y(), this.Z()]))), this._c2d = this.element2D.coords.usrCoords.slice(), this;
  }, updateRenderer: function() {
    return this.needsUpdate = !1, this;
  }, projectCoords2Surface: function() {
    var e, t, o, s = [0, 0], n = this.slide, h = this;
    n !== null && (o = function(l, p, u, v) {
      var Z = [1, n.X(u[0], u[1]), n.Y(u[0], u[1]), n.Z(u[0], u[1])], y = h.view.project3DTo2D(Z);
      return v[0] = h.element2D.X() - y[1], v[1] = h.element2D.Y() - y[2], v[0] * v[0] + v[1] * v[1];
    }, a.Z.exists(this._params) && (s = this._params.slice()), k.Z.Nlp.FindMinimum(o, 2, 2, s, 5, 1e-6, 0, 200), e = [1, n.X(s[0], s[1]), n.Y(s[0], s[1]), n.Z(s[0], s[1])], t = this.view.project3DTo2D(e), this._params = s, this.coords = e, this.element2D.coords.setCoordinates(x.Z.COORDS_BY_USER, t), this._c2d = t);
  }, __evt__update3D: function(e) {
  } }), d.Z.createPoint3D = function(e, t, o) {
    var s, n, h, l, p, u = t[0];
    if (h = t.length > 2 && a.Z.exists(t[t.length - 1].is3D) ? t.pop() : null, t.length === 2)
      n = t[1];
    else {
      if (t.length !== 4)
        throw new Error("JSXGraph: Can't create point3d with parent types '" + typeof t[0] + "' and '" + typeof t[1] + `'.
Possible parent types: [[x,y,z]], [x,y,z]`);
      n = t.slice(1);
    }
    return s = a.Z.copyAttributes(o, e.options, "point3d"), (p = new d.Z.Point3D(u, n, h, s)).initCoords(), l = u.project3DTo2D(p.coords), s.name = p.name, p.element2D = u.create("point", l, s), p.addChild(p.element2D), p.inherits.push(p.element2D), p.element2D.setParents(p), p._c2d = p.element2D.coords.usrCoords.slice(), p;
  }, d.Z.registerElement("point3d", d.Z.createPoint3D), d.Z.Curve3D = function(e, t, o, s, n, h, l) {
    this.constructor(e.board, l, x.Z.OBJECT_TYPE_CURVE3D, x.Z.OBJECT_CLASS_3D), this.constructor3D(e, "surface3d"), this.id = this.view.board.setId(this, "S3D"), this.board.finalizeAdding(this), this.F = t, this.X = o, this.Y = s, this.Z = n, this.F !== null && (this.X = function(p) {
      return this.F(p)[0];
    }, this.Y = function(p) {
      return this.F(p)[1];
    }, this.Z = function(p) {
      return this.F(p)[2];
    }), this.range = h, this.methodMap = a.Z.deepCopy(this.methodMap, {});
  }, d.Z.Curve3D.prototype = new d.Z.GeometryElement(), a.Z.copyPrototypeMethods(d.Z.Curve3D, d.Z.GeometryElement3D, "constructor3D"), d.Z.extend(d.Z.Curve3D.prototype, { updateDataArray: function() {
    var e, t, o, s, n, h, l, p, u = a.Z.evaluate(this.visProp.numberpointshigh), v = [0, 0, 0];
    if (l = [], p = [], a.Z.isArray(this.X))
      for (u = this.X.length, h = 0; h < u; h++)
        v = [this.X[h], this.Y[h], this.Z[h]], n = this.view.project3DTo2D(v), l.push(n[1]), p.push(n[2]);
    else
      for (e = a.Z.evaluate(this.range), t = a.Z.evaluate(e[0]), s = ((o = a.Z.evaluate(e[1])) - t) / (u - 1), h = t; h <= o; h += s)
        v = this.F !== null ? this.F(h) : [this.X(h), this.Y(h), this.Z(h)], n = this.view.project3DTo2D(v), l.push(n[1]), p.push(n[2]);
    return { X: l, Y: p };
  }, update: function() {
    return this;
  }, updateRenderer: function() {
    return this.needsUpdate = !1, this;
  } }), d.Z.createCurve3D = function(e, t, o) {
    var s, n, h, l, p, u, v, Z = t[0];
    return t.length === 3 ? (s = t[1], p = t[2], n = null, h = null, l = null) : (n = t[1], h = t[2], l = t[3], p = t[4], s = null), u = a.Z.copyAttributes(o, e.options, "curve3d"), (v = new d.Z.Curve3D(Z, s, n, h, l, p, u)).element2D = e.create("curve", [[], []], u), v.element2D.updateDataArray = function() {
      var y = v.updateDataArray();
      this.dataX = y.X, this.dataY = y.Y;
    }, v.addChild(v.element2D), v.inherits.push(v.element2D), v.element2D.setParents(v), v.element2D.prepareUpdate().update(), e.isSuspendedUpdate || v.element2D.updateVisibility().updateRenderer(), v;
  }, d.Z.registerElement("curve3d", d.Z.createCurve3D), d.Z.Line3D = function(e, t, o, s, n) {
    this.constructor(e.board, n, x.Z.OBJECT_TYPE_LINE3D, x.Z.OBJECT_CLASS_3D), this.constructor3D(e, "line3d"), this.id = this.view.board.setId(this, "L3D"), this.board.finalizeAdding(this), this.point = t, this.direction = o, this.range = s || [-1 / 0, 1 / 0], this.point1 = null, this.point2 = null, this.methodMap = a.Z.deepCopy(this.methodMap, {});
  }, d.Z.Line3D.prototype = new d.Z.GeometryElement(), a.Z.copyPrototypeMethods(d.Z.Line3D, d.Z.GeometryElement3D, "constructor3D"), d.Z.extend(d.Z.Line3D.prototype, { getPointCoords: function(e) {
    var t, o, s, n = [];
    if (t = [this.point.X(), this.point.Y(), this.point.Z()], a.Z.isFunction(this.direction))
      n = this.direction();
    else
      for (o = 1; o < 4; o++)
        n.push(a.Z.evaluate(this.direction[o]));
    return s = a.Z.evaluate(e), Math.abs(s) === 1 / 0 && (e = this.view.intersectionLineCube(t, n, s)), [t[0] + n[0] * s, t[1] + n[1] * s, t[2] + n[2] * s];
  }, update: function() {
    return this;
  }, updateRenderer: function() {
    return this.needsUpdate = !1, this;
  } }), d.Z.createLine3D = function(e, t, o) {
    var s, n, h, l, p, u, v, Z, y = t[0];
    return s = a.Z.copyAttributes(o, e.options, "line3d"), a.Z.isPoint3D(t[2]) || t.length === 3 && (a.Z.isArray(t[2]) || a.Z.isFunction(t[2])) ? (u = a.Z.providePoints3D(y, [t[1]], o, "line3d", ["point1"])[0], v = a.Z.providePoints3D(y, [t[2]], o, "line3d", ["point2"])[0], l = function() {
      return [v.X() - u.X(), v.Y() - u.Y(), v.Z() - u.Z()];
    }, p = [0, 1], Z = new d.Z.Line3D(y, u, l, p, s)) : (h = a.Z.providePoints3D(y, [t[1]], o, "line3d", ["point"])[0], a.Z.isFunction(t[2]) ? l = t[2] : t[2].length === 3 ? l = [1].concat(t[2]) : t[2].length === 4 && (l = t[2]), p = t[3], n = a.Z.providePoints3D(y, [[0, 0, 0], [0, 0, 0]], o, "line3d", ["point1", "point2"]), Z = new d.Z.Line3D(y, h, l, p, s), n[0].F = function() {
      return Z.getPointCoords(a.Z.evaluate(Z.range[0]));
    }, n[0].prepareUpdate().update(), u = n[0], n[1].F = function() {
      return Z.getPointCoords(a.Z.evaluate(Z.range[1]));
    }, n[1].prepareUpdate().update(), v = n[1]), Z.element2D = y.create("segment", [u.element2D, v.element2D], s), Z.addChild(Z.element2D), Z.inherits.push(Z.element2D), Z.element2D.setParents(Z), u.addChild(Z), v.addChild(Z), Z.point1 = u, Z.point2 = v, Z.update(), Z.element2D.prepareUpdate().update().updateRenderer(), Z;
  }, d.Z.registerElement("line3d", d.Z.createLine3D), d.Z.Plane3D = function(e, t, o, s, n, h, l) {
    this.constructor(e.board, l, x.Z.OBJECT_TYPE_PLANE3D, x.Z.OBJECT_CLASS_3D), this.constructor3D(e, "plane3d"), this.id = this.view.board.setId(this, "PL3D"), this.board.finalizeAdding(this), this.point = t, this.direction1 = o, this.direction2 = n, this.range1 = s || [-1 / 0, 1 / 0], this.range2 = h || [-1 / 0, 1 / 0], this.vec1 = [0, 0, 0], this.vec2 = [0, 0, 0], this.grid = null, this.normal = [0, 0, 0], this.d = 0, this.updateNormal(), this.methodMap = a.Z.deepCopy(this.methodMap, {});
  }, d.Z.Plane3D.prototype = new d.Z.GeometryElement(), a.Z.copyPrototypeMethods(d.Z.Plane3D, d.Z.GeometryElement3D, "constructor3D"), d.Z.extend(d.Z.Plane3D.prototype, { updateNormal: function() {
    var e, t;
    for (e = 0; e < 3; e++)
      this.vec1[e] = a.Z.evaluate(this.direction1[e]), this.vec2[e] = a.Z.evaluate(this.direction2[e]);
    if (this.normal = k.Z.crossProduct(this.vec1, this.vec2), t = k.Z.norm(this.normal), Math.abs(t) > k.Z.eps)
      for (e = 0; e < 3; e++)
        this.normal[e] /= t;
    return this.d = k.Z.innerProduct(this.point.coords.slice(1), this.normal, 3), this;
  }, updateDataArray: function() {
    var e, t, o, s, n, h, l, p, u, v, Z, y, O, S, R = ["xPlaneRear", "yPlaneRear", "zPlaneRear"], L = [], B = [0, 0, 0], X = [0, 0, 0], F = [0, 0, 0], G = [0, 0, 0], W = this.view;
    if (this.dataX = [], this.dataY = [], this.updateNormal(), this.elType !== "axisplane3d" && W.defaultAxes && a.Z.evaluate(this.range1[0]) === -1 / 0 && a.Z.evaluate(this.range1[1]) === 1 / 0 && a.Z.evaluate(this.range2[0]) === -1 / 0 && a.Z.evaluate(this.range2[1]) === 1 / 0) {
      for (v = 0; v < R.length; v++) {
        if ((G = W.intersectionPlanePlane(this, W.defaultAxes[R[v]]))[0].length === 3 && G[1].length === 3) {
          for (u = 0; u < L.length && !(_.Z.distance(G[0], L[u][0], 3) < k.Z.eps && _.Z.distance(G[1], L[u][1], 3) < k.Z.eps || _.Z.distance(G[0], L[u][1], 3) < k.Z.eps && _.Z.distance(G[1], L[u][0], 3) < k.Z.eps); u++)
            ;
          u === L.length && L.push(G.slice());
        }
        if ((G = [0, 0, 0])[v] = W.bbox3D[v][1], p = k.Z.innerProduct(G, W.defaultAxes[R[v]].normal, 3), (G = W.intersectionPlanePlane(this, W.defaultAxes[R[v]], p))[0].length === 3 && G[1].length === 3) {
          for (u = 0; u < L.length && !(_.Z.distance(G[0], L[u][0], 3) < k.Z.eps && _.Z.distance(G[1], L[u][1], 3) < k.Z.eps || _.Z.distance(G[0], L[u][1], 3) < k.Z.eps && _.Z.distance(G[1], L[u][0], 3) < k.Z.eps); u++)
            ;
          u === L.length && L.push(G.slice());
        }
      }
      O = 0, u = 0;
      do {
        for ((G = L[O][u]).length === 3 && (n = W.project3DTo2D(G), this.dataX.push(n[1]), this.dataY.push(n[2])), u = (u + 1) % 2, G = L[O][u], S = O, v = 0; v < L.length; v++) {
          if (v !== O && _.Z.distance(G, L[v][0]) < k.Z.eps) {
            O = v, u = 0;
            break;
          }
          if (v !== O && _.Z.distance(G, L[v][1]) < k.Z.eps) {
            O = v, u = 1;
            break;
          }
        }
        if (O === S) {
          console.log("Error: update plane3d: did not find next", O);
          break;
        }
      } while (O !== 0);
      n = W.project3DTo2D(L[0][0]), this.dataX.push(n[1]), this.dataY.push(n[2]);
    } else {
      for (e = a.Z.evaluate(this.range1[0]), t = a.Z.evaluate(this.range1[1]), o = a.Z.evaluate(this.range2[0]), s = a.Z.evaluate(this.range2[1]), F = this.point.coords.slice(1), B = this.vec1.slice(), X = this.vec2.slice(), h = k.Z.norm(B, 3), l = k.Z.norm(X, 3), u = 0; u < 3; u++)
        B[u] /= h, X[u] /= l;
      for (v = 0; v < 4; v++) {
        switch (v) {
          case 0:
            Z = e, y = o;
            break;
          case 1:
            Z = t, y = o;
            break;
          case 2:
            Z = t, y = s;
            break;
          case 3:
            Z = e, y = s;
        }
        for (u = 0; u < 3; u++)
          G[u] = F[u] + Z * B[u] + y * X[u];
        n = W.project3DTo2D(G), this.dataX.push(n[1]), this.dataY.push(n[2]);
      }
      this.dataX.push(this.dataX[0]), this.dataY.push(this.dataY[0]);
    }
    return { X: this.dataX, Y: this.dataY };
  }, update: function() {
    return this;
  }, updateRenderer: function() {
    return this.needsUpdate = !1, this;
  } }), d.Z.createPlane3D = function(e, t, o) {
    var s, n, h, l, p = t[0], u = t[2], v = t[3], Z = t[4] || [-1 / 0, 1 / 0], y = t[5] || [-1 / 0, 1 / 0];
    return n = a.Z.providePoints3D(p, [t[1]], o, "plane3d", ["point"])[0], s = a.Z.copyAttributes(o, e.options, "plane3d"), h = new d.Z.Plane3D(p, n, u, Z, v, y, s), n.addChild(h), h.element2D = p.create("curve", [[], []], s), h.element2D.updateDataArray = function() {
      var O = h.updateDataArray();
      this.dataX = O.X, this.dataY = O.Y;
    }, h.addChild(h.element2D), h.inherits.push(h.element2D), h.element2D.setParents(h), s = a.Z.copyAttributes(o.mesh3d, e.options, "mesh3d"), Math.abs(h.range1[0]) !== 1 / 0 && Math.abs(h.range1[1]) !== 1 / 0 && Math.abs(h.range2[0]) !== 1 / 0 && Math.abs(h.range2[1]) !== 1 / 0 && (l = p.create("mesh3d", [function() {
      return n.coords;
    }, u, Z, v, y], s), h.grid = l, h.addChild(l), h.inherits.push(l), l.setParents(h)), h.element2D.prepareUpdate().update(), e.isSuspendedUpdate || h.element2D.updateVisibility().updateRenderer(), h;
  }, d.Z.registerElement("plane3d", d.Z.createPlane3D), d.Z.Surface3D = function(e, t, o, s, n, h, l, p) {
    this.constructor(e.board, p, x.Z.OBJECT_TYPE_SURFACE3D, x.Z.OBJECT_CLASS_3D), this.constructor3D(e, "surface3d"), this.id = this.view.board.setId(this, "S3D"), this.board.finalizeAdding(this), this.F = t, this.X = o, this.Y = s, this.Z = n, this.F !== null && (this.X = function(u, v) {
      return this.F(u, v)[0];
    }, this.Y = function(u, v) {
      return this.F(u, v)[1];
    }, this.Z = function(u, v) {
      return this.F(u, v)[2];
    }), this.range_u = h, this.range_v = l, this.methodMap = a.Z.deepCopy(this.methodMap, {});
  }, d.Z.Surface3D.prototype = new d.Z.GeometryElement(), a.Z.copyPrototypeMethods(d.Z.Surface3D, d.Z.GeometryElement3D, "constructor3D"), d.Z.extend(d.Z.Surface3D.prototype, { updateDataArray: function() {
    var e, t, o = a.Z.evaluate(this.visProp.stepsu), s = a.Z.evaluate(this.visProp.stepsv), n = a.Z.evaluate(this.range_u), h = a.Z.evaluate(this.range_v);
    return e = this.F !== null ? this.F : [this.X, this.Y, this.Z], { X: (t = this.view.getMesh(e, n.concat([o]), h.concat([s])))[0], Y: t[1] };
  }, update: function() {
    return this;
  }, updateRenderer: function() {
    return this.needsUpdate = !1, this;
  } }), d.Z.createParametricSurface3D = function(e, t, o) {
    var s, n, h, l, p, u, v, Z, y = t[0];
    return t.length === 4 ? (s = t[1], p = t[2], u = t[3], n = null, h = null, l = null) : (n = t[1], h = t[2], l = t[3], p = t[4], u = t[5], s = null), v = a.Z.copyAttributes(o, e.options, "surface3d"), (Z = new d.Z.Surface3D(y, s, n, h, l, p, u, v)).element2D = y.create("curve", [[], []], v), Z.element2D.updateDataArray = function() {
      var O = Z.updateDataArray();
      this.dataX = O.X, this.dataY = O.Y;
    }, Z.addChild(Z.element2D), Z.inherits.push(Z.element2D), Z.element2D.setParents(Z), Z.element2D.prepareUpdate().update(), e.isSuspendedUpdate || Z.element2D.updateVisibility().updateRenderer(), Z;
  }, d.Z.registerElement("parametricsurface3d", d.Z.createParametricSurface3D), d.Z.createFunctiongraph3D = function(e, t, o) {
    var s = t[0], n = t[1], h = t[2], l = t[3];
    return s.create("parametricsurface3d", [function(p, u) {
      return p;
    }, function(p, u) {
      return u;
    }, n, h, l], o);
  }, d.Z.registerElement("functiongraph3d", d.Z.createFunctiongraph3D);
  const Et = d.Z.COORDS_BY_SCREEN, Rt = d.Z.COORDS_BY_USER, Dt = d.Z.Dump, Lt = d.Z.JSXGraph, kt = d.Z.Math, Bt = d.Z.Options, Ot = d.Z.boards, Oe = d.Z.elements, xe = d.Z.palette, Jt = d.Z.paletteWong, xt = d.Z.Board, ze = d.Z.Chart, Ze = d.Z.Circle, Te = d.Z.Complex, Xe = d.Z.Composition, Me = d.Z.Coords, le = d.Z.CoordsElement, ve = d.Z.Curve, ie = d.Z.GeometryElement, It = d.Z.Group, Gt = d.Z.Image, zt = d.Z.JessieCode, Yt = d.Z.Line, Ht = d.Z.Point, Ke = d.Z.Polygon, ct = d.Z.Text, St = d.Z.Ticks, wt = d.Z.Transformation, Wt = d.Z.Turtle, st = d.Z.View3D, Tt = d.Z.LMS2rgb, dt = d.Z.addEvent, ot = d.Z.autoDigits, jt = d.Z.autoHighlight, bt = d.Z.bind, lt = d.Z.capitalize, Xt = d.Z.clearVisPropOld, vt = d.Z.clone, Vt = d.Z.cloneAndCopy, pt = d.Z.cmpArrays, Ut = d.Z.coordsArrayToMatrix, gt = d.Z.copyAttributes, Kt = d.Z.createEvalFunction, Qt = d.Z.createFunction, ei = d.Z.createHTMLSlider, ti = d.Z.debug, ii = d.Z.debugInt, si = d.Z.debugLine, ri = d.Z.debugWST, oi = d.Z.deepCopy, ni = d.Z.def, ai = d.Z.deprecated, hi = d.Z.eliminateDuplicates, li = d.Z.escapeHTML, ci = d.Z.evalSlider, di = d.Z.evaluate, ui = d.Z.filterElements, pi = d.Z.getBoardByContainerId, fi = d.Z.getCSSTransformMatrix, _i = d.Z.getCSSTransform, gi = d.Z.getDimensions, mi = d.Z.getOffset, bi = d.Z.getPosition, vi = d.Z.getProp, Zi = d.Z.hex2rgb, Ci = d.Z.hsv2rgb, yi = d.Z.isAndroid, Pi = d.Z.isApple, Ei = d.Z.isArray, Oi = d.Z.isInArray, xi = d.Z.isInObject, Si = d.Z.isMetroApp, wi = d.Z.isMozilla, Ti = d.Z.isName, Mi = d.Z.isNode, Ni = d.Z.isNumber, Ai = d.Z.isObject, Ri = d.Z.isPointType, Di = d.Z.isString, Li = d.Z.isTouchDevice, ki = d.Z.isTransformationOrArray, Bi = d.Z.isWebWorker, Ii = d.Z.isWebkitAndroid, Yi = d.Z.isWebkitApple, ji = d.Z.keys, Xi = d.Z.merge, Ui = d.Z.normalizePointFace, Fi = d.Z.providePoints, Ji = d.Z.registerElement, Gi = d.Z.registerReader, zi = d.Z.removeAllEvents, Hi = d.Z.removeElementFromArray, Wi = d.Z.removeEvent, Vi = d.Z.rgb2LMS, $i = d.Z.rgb2bw, qi = d.Z.rgb2cb, Ki = d.Z.rgb2css, Qi = d.Z.rgb2hex, es = d.Z.rgb2hsv, ts = d.Z.rgbParser, is = d.Z.rgba2rgbo, ss = d.Z.rgbo2rgba, rs = d.Z.sanitizeHTML, os = d.Z.shortcut, ns = d.Z.str2Bool, as = d.Z.supportsCanvas, hs = d.Z.supportsPointerEvents, ls = d.Z.supportsSVG, cs = d.Z.supportsVML, ds = d.Z.swap, us = d.Z.timedChunk, ps = d.Z.toFixed, fs = d.Z.toFullscreen, _s = d.Z.toJSON, gs = d.Z.trim, ms = d.Z.trimNumber, bs = d.Z.truncate, vs = d.Z.unescapeHTML, Zs = d.Z.uniqueArray, Cs = d.Z.useBlackWhiteOptions, ys = d.Z.useStandardOptions, Ps = d.Z.warn;
  M.Z.isBrowser ? window.JXG = d.Z : M.Z.isWebWorker() && (self.JXG = d.Z);
  const Es = d.Z;
})();
var __webpack_exports__default = __webpack_exports__.ZP;
const BoardContext = createContext(), graph = React__default.memo(function d(M) {
  let { name: x, id: a, SVs: j, children: k, actions: N, callAction: A } = useDoenetRenderer(M);
  const [E, c] = useState(null), b = useRef(null), m = useRef(null), _ = useRef(null), f = useRef(null), g = useRef(!1), C = useRef(!1), P = useRef(!1);
  let w = useRef(null), T = useRef(null), D = j.showNavigation && !j.fixAxes, I = (ne) => {
    A({
      action: N.recordVisibilityChange,
      args: { isVisible: ne }
    });
  };
  if (useEffect(() => {
    if (!j.haveGraphParent)
      return () => {
        A({
          action: N.recordVisibilityChange,
          args: { isVisible: !1 }
        });
      };
  }, []), useEffect(() => {
    if (j.haveGraphParent)
      return;
    let ne = [j.xmin, j.ymax, j.xmax, j.ymin];
    m.current = ne, __webpack_exports__default.Options.layer.numlayers = 100, __webpack_exports__default.Options.navbar.highlightFillColor = "var(--canvastext)", __webpack_exports__default.Options.navbar.strokeColor = "var(--canvastext)";
    let Q = !1;
    Array.isArray(j.grid) && (Q = !0, __webpack_exports__default.Options.grid.gridX = j.grid[0], __webpack_exports__default.Options.grid.gridY = j.grid[1]);
    let K = window.JXG.JSXGraph.initBoard(a, {
      boundingbox: ne,
      axis: !1,
      showCopyright: !1,
      showNavigation: !1,
      // will add navigation buttons later so can style them
      // keepAspectRatio: SVs.identicalAxisScales,
      zoom: { wheel: !j.fixAxes },
      pan: { enabled: !j.fixAxes },
      grid: Q
    });
    K.itemsRenderedLowQuality = {}, K.on("boundingbox", () => {
      if (!g.current) {
        let de = K.getBoundingBox(), [ae, ce, fe, Re] = de, ke = Math.abs(fe - ae), je = Math.abs(ce - Re), qe = de.map(
          (it, nt) => Math.abs(it - m.current[nt])
        );
        Math.max(
          qe[0] / ke,
          qe[1] / je,
          qe[2] / ke,
          qe[3] / je
        ) > 1e-12 && (m.current = de, A({
          action: N.changeAxisLimits,
          args: { xmin: ae, xmax: fe, ymin: Re, ymax: ce }
        }));
      }
    }), c(K), b.current = {
      width: parseFloat(sizeToCSS(j.width)),
      aspectRatio: j.aspectRatio
    }, j.displayXAxis && z(K), j.displayYAxis && J(K), C.current = !0, P.current = D;
    function te(de) {
      var Re;
      let ae = de.target.id;
      if (ae === "")
        return !1;
      let ce = ae.replace(a + "_", ""), fe = K.select(ce);
      (Re = fe.triggerEventHandlers) == null || Re.call(fe, ["keyfocusout"], [de]);
    }
    K.containerObj.addEventListener("focusout", te);
    function se(de) {
      var Re;
      let ae = de.target.id;
      if (ae === "")
        return !1;
      let ce = ae.replace(a + "_", ""), fe = K.select(ce);
      (Re = fe.triggerEventHandlers) == null || Re.call(fe, ["keydown"], [de]);
    }
    return K.containerObj.addEventListener("keydown", se), () => {
      K.off("boundingbox");
    };
  }, []), useEffect(() => {
    E && D && V();
  }, [E]), j.haveGraphParent)
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("a", { name: a }),
      k
    ] });
  const Y = {
    width: sizeToCSS(j.width),
    aspectRatio: String(j.aspectRatio),
    maxWidth: "100%"
  };
  let U = {};
  if (j.hidden ? Y.display = "none" : j.displayMode === "inline" ? U = { display: "inline-block", verticalAlign: "middle" } : U = { display: "flex", justifyContent: j.horizontalAlign }, j.showBorder ? Y.border = "2px solid var(--canvastext)" : Y.border = "none", Y.marginBottom = "12px", Y.marginTop = "12px", Y.backgroundColor = "var(--canvas)", Y.color = "var(--canvastext)", !E)
    return /* @__PURE__ */ jsxRuntimeExports.jsx(VisibilitySensor, { partialVisibility: !0, onChange: I, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: U, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("a", { name: a }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { id: a, className: "jxgbox", style: Y })
    ] }) });
  if (C.current)
    C.current = !1;
  else {
    Array.isArray(j.grid) ? ((__webpack_exports__default.Options.grid.gridX !== j.grid[0] || __webpack_exports__default.Options.grid.gridY !== j.grid[1]) && (__webpack_exports__default.Options.grid.gridX = j.grid[0], __webpack_exports__default.Options.grid.gridY = j.grid[1], E.grids.length > 0 && (E.removeObject(E.grids[0]), E.grids = [])), E.grids.length === 0 && E.create("grid", [], { gridX: j.grid[0], gridY: j.grid[1] })) : E.grids.length > 0 && (E.removeObject(E.grids[0]), E.grids = []), j.grid === "dense" ? (_.current && (_.current.defaultTicks.setAttribute({ majorHeight: -1 }), _.current.defaultTicks.setAttribute({ minorHeight: -1 })), f.current && (f.current.defaultTicks.setAttribute({ majorHeight: -1 }), f.current.defaultTicks.setAttribute({ minorHeight: -1 }))) : j.grid === "medium" ? (_.current && (_.current.defaultTicks.setAttribute({ majorHeight: -1 }), _.current.defaultTicks.setAttribute({ minorHeight: 10 })), f.current && (f.current.defaultTicks.setAttribute({ majorHeight: -1 }), f.current.defaultTicks.setAttribute({ minorHeight: 10 }))) : (_.current && (_.current.defaultTicks.setAttribute({ majorHeight: 12 }), _.current.defaultTicks.setAttribute({ minorHeight: 10 })), f.current && (f.current.defaultTicks.setAttribute({ majorHeight: 12 }), f.current.defaultTicks.setAttribute({ minorHeight: 10 })));
    let ne = j.displayXAxis ? !_.current : !!_.current, Q = j.displayYAxis ? !f.current : !!f.current;
    if (Q && !ne && j.displayXAxis && (E.removeObject(_.current), _.current = null), ne && !Q && j.displayYAxis && (E.removeObject(f.current), f.current = null), j.displayXAxis)
      if (_.current) {
        let se = !!j.xlabel;
        if (se !== w.current && (_.current.setAttribute({ withlabel: se }), w.current = se), _.current.name = j.xlabel, _.current.defaultTicks.setAttribute({
          drawLabels: j.displayXAxisTickLabels
        }), _.current.hasLabel) {
          let de = "rt", ae = [5, 10], ce = "right";
          j.xlabelPosition === "left" && (de = "lft", ce = "left", ae = [-5, 10]), _.current.label.visProp.position = de, _.current.label.visProp.anchorx = ce, _.current.label.visProp.offset = ae, _.current.label.needsUpdate = !0, _.current.label.fullUpdate();
        }
      } else
        z(E);
    else
      _.current && (E.removeObject(_.current), _.current = null);
    if (j.displayYAxis)
      if (f.current) {
        let se = !!j.ylabel;
        if (se !== T.current && (f.current.setAttribute({ withlabel: se }), T.current = se), f.current.name = j.ylabel, f.current.defaultTicks.setAttribute({
          drawLabels: j.displayYAxisTickLabels
        }), f.current.hasLabel) {
          let de = "rt", ae = [-10, -5], ce = "right";
          j.ylabelPosition === "bottom" && (de = "lft", ae[1] = 5), j.ylabelAlignment === "right" && (ce = "left", ae[0] = 10), f.current.label.visProp.position = de, f.current.label.visProp.offset = ae, f.current.label.visProp.anchorx = ce, f.current.label.needsUpdate = !0, f.current.label.fullUpdate();
        }
      } else
        J(E);
    else
      f.current && (E.removeObject(f.current), f.current = null);
    D ? P.current || (V(), P.current = !0) : P.current && ($(), P.current = !1);
    let K = {
      width: parseFloat(sizeToCSS(j.width)),
      aspectRatio: j.aspectRatio
    };
    (K.width !== b.current.width || K.aspectRatio !== b.current.aspectRatio) && Number.isFinite(K.width) && Number.isFinite(K.aspectRatio) && (b.current = K);
    let te = [j.xmin, j.ymax, j.xmax, j.ymin];
    te.some((se, de) => se !== m.current[de]) && (g.current = !0, E.setBoundingBox(te), g.current = !1, E.fullUpdate(), E.updateQuality === E.BOARD_QUALITY_LOW && (E.itemsRenderedLowQuality[a] = E), m.current = te);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(VisibilitySensor, { partialVisibility: !0, onChange: I, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: U, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("a", { name: a }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { id: a, className: "jxgbox", style: Y }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(BoardContext.Provider, { value: E, children: k })
  ] }) });
  function J(ne) {
    let Q = { highlight: !1, fixed: !0 };
    if (j.ylabel) {
      let K = "rt", te = [-10, -5], se = "right";
      j.ylabelPosition === "bottom" && (K = "lft", te[1] = 5), j.ylabelAlignment === "right" && (se = "left", te[0] = 10), Q.name = j.ylabel, Q.withLabel = !0, Q.label = {
        position: K,
        offset: te,
        anchorx: se,
        strokeColor: "var(--canvastext)",
        highlight: !1
      }, j.ylabelHasLatex && (Q.label.useMathJax = !0);
    }
    if (T.current = !!j.ylabel, Q.strokeColor = "var(--canvastext)", Q.highlight = !1, Q.ticks = {
      ticksDistance: 2,
      label: {
        offset: [12, -2],
        layer: 2,
        strokeColor: "var(--canvastext)",
        highlightStrokeColor: "var(--canvastext)",
        highlightStrokeOpacity: 1
      },
      strokeColor: "var(--canvastext)",
      strokeOpacity: 0.5,
      // minorTicks: 4,
      precision: 4,
      drawLabels: j.displayYAxisTickLabels
    }, j.yTickScaleFactor !== null) {
      let K = Context.fromAst(j.yTickScaleFactor), te = K.evaluate_to_constant();
      if (te > 0) {
        let se = K.toString();
        Q.ticks.scale = te, Q.ticks.scaleSymbol = se;
      }
    }
    j.grid === "dense" ? (Q.ticks.majorHeight = -1, Q.ticks.minorHeight = -1) : j.grid === "medium" ? (Q.ticks.majorHeight = -1, Q.ticks.minorHeight = 10) : (Q.ticks.majorHeight = 12, Q.ticks.minorHeight = 10), j.displayXAxis || (Q.ticks.drawZero = !0), ne.suspendUpdate(), f.current = ne.create(
      "axis",
      [
        [0, 0],
        [0, 1]
      ],
      Q
    ), f.current.defaultTicks.ticksFunction = function() {
      var K, te, se;
      return te = this.getLowerAndUpperBounds(
        this.getZeroCoordinates(),
        "ticksdistance"
      ), se = te.upper - te.lower, K = Math.pow(10, Math.floor(Math.log(0.2 * se) / Math.LN10)), se <= 6 * K && (K *= 0.5), K;
    }, f.current.defaultTicks.generateEquidistantTicks = function(K, te) {
      var se, de = 1e-6, ae, ce = this.equidistant ? this.ticksFunction(1) : this.ticksDelta, fe = 4;
      if (this.visProp.minorticks = 4, ae = this.getXandYdeltas(), ce *= this.visProp.scale, this.minTicksDistance > 1e-6) {
        ce = this.adjustTickDistance(ce, K, ae);
        let Re = 10 ** Math.floor(Math.log10(ce)) * this.visProp.scale;
        Math.abs(ce / Re - 2) < 1e-14 && (fe = 3, this.visProp.minorticks = 3), ce /= fe + 1;
      }
      if (this.ticksDelta = ce, !(ce < 1e-6)) {
        for (se = 0, this.visProp.drawzero || (se = ce); se <= te.upper + de && (se >= te.lower - de && this.processTickPosition(
          K,
          se,
          ce,
          ae
        ), se += ce, !(te.upper - se > ce * 1e4)); )
          ;
        for (se = -ce; se >= te.lower - de && (se <= te.upper + de && this.processTickPosition(
          K,
          se,
          ce,
          ae
        ), se -= ce, !(se - te.lower > ce * 1e4)); )
          ;
      }
    }, ne.unsuspendUpdate();
  }
  function z(ne) {
    let Q = { highlight: !1, fixed: !0 };
    if (j.xlabel) {
      let K = "rt", te = [5, 10], se = "right";
      j.xlabelPosition === "left" && (K = "lft", se = "left", te = [-5, 10]), Q.name = j.xlabel, Q.withLabel = !0, Q.label = {
        position: K,
        offset: te,
        anchorx: se,
        strokeColor: "var(--canvastext)",
        highlight: !1
      }, j.xlabelHasLatex && (Q.label.useMathJax = !0);
    }
    if (w.current = !!j.xlabel, Q.ticks = {
      ticksDistance: 2,
      label: {
        offset: [-5, -15],
        layer: 2,
        strokeColor: "var(--canvastext)",
        highlightStrokeColor: "var(--canvastext)",
        highlightStrokeOpacity: 1
      },
      strokeColor: "var(--canvastext)",
      strokeOpacity: 0.5,
      // minorTicks: 4,
      precision: 4,
      drawLabels: j.displayXAxisTickLabels
    }, j.xTickScaleFactor !== null) {
      let K = Context.fromAst(j.xTickScaleFactor), te = K.evaluate_to_constant();
      if (te > 0) {
        let se = K.toString();
        Q.ticks.scale = te, Q.ticks.scaleSymbol = se;
      }
    }
    Q.strokeColor = "var(--canvastext)", Q.highlight = !1, j.grid === "dense" ? (Q.ticks.majorHeight = -1, Q.ticks.minorHeight = -1) : j.grid === "medium" ? (Q.ticks.majorHeight = -1, Q.ticks.minorHeight = 10) : (Q.ticks.majorHeight = 12, Q.ticks.minorHeight = 10), j.displayYAxis || (Q.ticks.drawZero = !0), ne.suspendUpdate(), _.current = ne.create(
      "axis",
      [
        [0, 0],
        [1, 0]
      ],
      Q
    ), _.current.defaultTicks.ticksFunction = function() {
      var K, te, se;
      return te = this.getLowerAndUpperBounds(
        this.getZeroCoordinates(),
        "ticksdistance"
      ), se = te.upper - te.lower, K = Math.pow(10, Math.floor(Math.log(0.2 * se) / Math.LN10)), se <= 6 * K && (K *= 0.5), K;
    }, _.current.defaultTicks.generateEquidistantTicks = function(K, te) {
      this.minTicksDistance = 2 * Math.max(
        2.5,
        Math.log10(Math.abs(te.lower)),
        Math.log10(Math.abs(te.upper))
      );
      var se, de = 1e-6, ae, ce = this.equidistant ? this.ticksFunction(1) : this.ticksDelta, fe = 4;
      if (this.visProp.minorticks = 4, ae = this.getXandYdeltas(), ce *= this.visProp.scale, this.minTicksDistance > 1e-6) {
        ce = this.adjustTickDistance(ce, K, ae);
        let Re = 10 ** Math.floor(Math.log10(ce)) * this.visProp.scale;
        Math.abs(ce / Re - 2) < 1e-14 && (fe = 3, this.visProp.minorticks = 3), ce /= fe + 1;
      }
      if (this.ticksDelta = ce, !(ce < 1e-6)) {
        for (se = 0, this.visProp.drawzero || (se = ce); se <= te.upper + de && (se >= te.lower - de && this.processTickPosition(
          K,
          se,
          ce,
          ae
        ), se += ce, !(te.upper - se > ce * 1e4)); )
          ;
        for (se = -ce; se >= te.lower - de && (se <= te.upper + de && this.processTickPosition(
          K,
          se,
          ce,
          ae
        ), se -= ce, !(se - te.lower > ce * 1e4)); )
          ;
      }
    }, ne.unsuspendUpdate();
  }
  function V() {
    let ne = document.querySelector(
      "#" + cesc(a) + "_navigationbar"
    ), Q = function(se, de, ae) {
      var ce = function() {
        return ae.apply(E, arguments);
      };
      E["x_internal" + de] = E["x_internal" + de] || [], E["x_internal" + de].push(ce), se.addEventListener(de, ce, !1);
    }, K = function(se) {
      se || (se = window.event), se.stopPropagation ? se.stopPropagation() : se.cancelBubble = !0;
    }, te = function(se, de) {
      var ae;
      ae = document.createElement("span"), ne.appendChild(ae), ae.setAttribute("style", "color: var(--canvastext); opacity: 0.7");
      let ce = document.createTextNode(se);
      ae.appendChild(ce), ae.style.paddingLeft = "7px", ae.style.paddingRight = "7px", ae.classList !== void 0 && ae.classList.add("JXG_navigation_button"), Q(
        ae,
        "click",
        function(fe) {
          return de.bind(E)(), !1;
        }
      ), Q(ae, "mouseup", K), Q(ae, "mousedown", K), Q(ae, "touchend", K), Q(ae, "touchstart", K);
    };
    E.attr.showzoom && (te("–", E.zoomOut), te("o", E.zoom100), te("+", E.zoomIn)), te("←", E.clickLeftArrow), te("↓", E.clickUpArrow), te("↑", E.clickDownArrow), te("→", E.clickRightArrow);
  }
  function $() {
    for (let ne = 7; ne >= 1; ne--)
      document.querySelector(
        "#" + cesc(a) + "_navigationbar > :first-child"
      ).remove();
    E.internalclick = [], E.internalmousedown = [], E.internalmouseup = [], E.internaltouchend = [], E.internaltouchstart = [];
  }
});
let tempCounter = 0;
const BASE_LAYER_OFFSET = tempCounter++, IMAGE_LAYER_OFFSET = tempCounter++, LINE_LAYER_OFFSET = tempCounter++, VERTEX_LAYER_OFFSET = tempCounter++, CONTROL_POINT_LAYER_OFFSET = tempCounter++, POINT_LAYER_OFFSET = tempCounter++, TEXT_LAYER_OFFSET = tempCounter++;
export {
  BASE_LAYER_OFFSET,
  BoardContext,
  CONTROL_POINT_LAYER_OFFSET,
  IMAGE_LAYER_OFFSET,
  LINE_LAYER_OFFSET,
  POINT_LAYER_OFFSET,
  TEXT_LAYER_OFFSET,
  VERTEX_LAYER_OFFSET,
  graph as default
};
