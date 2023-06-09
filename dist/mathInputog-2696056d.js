var p = Object.defineProperty;
var m = (n, e, t) => e in n ? p(n, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : n[e] = t;
var d = (n, e, t) => (m(n, typeof e != "symbol" ? e + "" : e, t), t);
import { A as x, D as f, C as v, j as a, F as h, f as S, a as V, b as D, c as g } from "./index-64c78e6b.js";
import y from "react";
import l from "react-dom";
import "styled-components";
import { m as u } from "./index-7299e64f.js";
u.addStyles();
let b = u.EditableMathField;
class F {
  render() {
    return null;
  }
}
class R extends F {
  constructor(e) {
    console.log("old one"), super(e), this.state = { latex: "" }, this.handlePressEnter = this.handlePressEnter.bind(this), this.handleBlur = this.handleBlur.bind(this), this.handleFocus = this.handleFocus.bind(this), this.onChangeHandler = this.onChangeHandler.bind(this), this.mathExpression = this.doenetSvData.valueForDisplay, this.doenetSvData.rawRendererValue !== null ? this.latexValue = this.doenetSvData.rawRendererValue : (this.latexValue = c(this.doenetSvData.valueForDisplay.toLatex()), this.actions.updateRawValue({
      rawRendererValue: this.latexValue,
      transient: !1
    })), this.latexValueSetInRender = !0, this.valueToRevertTo = this.doenetSvData.value, this.valueForDisplayToRevertTo = this.doenetSvData.valueForDisplay, this.latexValue === "＿" && (this.latexValue = "");
  }
  componentDidMount() {
  }
  calculateMathExpressionFromLatex(e) {
    let t;
    e = x(e), e = e.replace(/\^(\w)/g, "^{$1}");
    let i = f({
      functionSymbols: this.doenetSvData.functionSymbols,
      splitSymbols: this.doenetSvData.splitSymbols
    });
    try {
      t = i(e);
    } catch {
      t = v.fromAst("＿");
    }
    return t;
  }
  updateImmediateValueFromLatex(e) {
    let t = this.calculateMathExpressionFromLatex(
      this.latexValue
    ), i = this.calculateMathExpressionFromLatex(e), s = e !== this.latexValue || this.latexValueSetFromValueForDisplay, r = !this.latexValueSetInRender, o = !i.equalsViaSyntax(t) || !this.latexValueSetInRender && e !== this.latexValue;
    this.latexValue = e, this.latexValueSetInRender = !1, this.latexValueSetFromValueForDisplay = !1, o ? (this.mathExpression = i, this.actions.updateImmediateValue({
      mathExpression: i,
      rawRendererValue: this.latexValue,
      transient: !0,
      skippable: !0
    })) : s && this.actions.updateRawValue({
      rawRendererValue: this.latexValue,
      transient: r,
      skippable: r
    });
  }
  updateValidationState() {
    this.validationState = "unvalidated", (this.doenetSvData.valueHasBeenValidated || this.doenetSvData.numberOfAttemptsLeft < 1) && (this.doenetSvData.creditAchieved === 1 ? this.validationState = "correct" : this.doenetSvData.creditAchieved === 0 ? this.validationState = "incorrect" : this.validationState = "partialcorrect");
  }
  // handleDragEnter(e) {
  //   this.setState({
  //     isDragging: true,
  //     clickXOffset: e.pageX - this.state.previewLeftOffset,
  //     clickYOffset: e.pageY - this.state.previewTopOffset,
  //   })
  // }
  // handleDragThrough(e) {
  //   if(this.state.isDragging){
  //     // console.log();
  //     this.setState({previewLeftOffset: e.pageX - this.state.clickXOffset, previewTopOffset: e.pageY - this.state.clickYOffset});
  //   }
  // }
  // handleDragExit(e){
  //   this.setState({
  //     isDragging: false,
  //     clickXOffset: 0,
  //     clickYOffset: 0,
  //   })
  // }
  async handlePressEnter(e) {
    this.valueToRevertTo = this.doenetSvData.immediateValue, this.valueForDisplayToRevertTo = this.mathExpression, this.doenetSvData.value.equalsViaSyntax(this.doenetSvData.immediateValue) ? await this.actions.updateRawValue({
      rawRendererValue: this.latexValue,
      transient: !1
    }) : await this.actions.updateValue(), this.doenetSvData.includeCheckWork && this.validationState === "unvalidated" && await this.actions.submitAnswer(), this.forceUpdate();
  }
  // handleKeyDown(e) {
  //   if (e.key === "Escape") {
  //     if (!this.mathExpression.equalsViaSyntax(this.valueForDisplayToRevertTo)) {
  //       this.mathExpression = this.valueForDisplayToRevertTo;
  //       this.actions.updateImmediateValue({
  //         mathExpression: this.valueToRevertTo
  //       });
  //       this.forceUpdate();
  //     }
  //   }
  // }
  handleFocus(e) {
    this.focused = !0, this.forceUpdate();
  }
  async handleBlur(e) {
    this.focused = !1, this.valueToRevertTo = this.doenetSvData.immediateValue, this.valueForDisplayToRevertTo = this.mathExpression, this.doenetSvData.value.equalsViaSyntax(this.doenetSvData.immediateValue) ? await this.actions.updateRawValue({
      rawRendererValue: this.latexValue,
      transient: !1
    }) : await this.actions.updateValue(), this.forceUpdate();
  }
  async onChangeHandler(e) {
    this.updateImmediateValueFromLatex(e), this.forceUpdate();
  }
  render() {
    if (this.doenetSvData.hidden)
      return null;
    this.updateValidationState();
    let e = this.doenetSvData.disabled;
    this.focused, this.valueForDisplayToRevertTo.equalsViaSyntax(
      this.doenetSvData.valueForDisplay
    ) || (this.mathExpression = this.doenetSvData.valueForDisplay, this.latexValue = c(this.mathExpression.toLatex()), this.latexValue === "＿" && (this.latexValue = ""), this.latexValueSetInRender = !0, this.latexValueSetFromValueForDisplay = !0, this.valueToRevertTo = this.doenetSvData.value, this.valueForDisplayToRevertTo = this.doenetSvData.valueForDisplay);
    let t = {
      position: "relative",
      width: "30px",
      height: "24px",
      fontSize: "20px",
      fontWeight: "bold",
      color: "#ffffff",
      display: "inline-block",
      textAlign: "center",
      top: "3px",
      padding: "2px",
      zIndex: "0"
    }, i = null;
    if (this.doenetSvData.includeCheckWork) {
      if (this.validationState === "unvalidated")
        e ? t.backgroundColor = "rgb(200,200,200)" : t.backgroundColor = "rgb(2, 117, 216)", i = /* @__PURE__ */ a.jsx(
          "button",
          {
            id: this.componentName + "_submit",
            tabIndex: "0",
            disabled: e,
            ref: (s) => {
              this.target = s && l.findDOMNode(s);
            },
            style: t,
            onClick: this.actions.submitAnswer,
            onKeyPress: (s) => {
              s.key === "Enter" && this.actions.submitAnswer();
            },
            children: /* @__PURE__ */ a.jsx(h, { icon: S, transform: { rotate: 90 } })
          }
        );
      else if (this.doenetSvData.showCorrectness)
        if (this.validationState === "correct")
          t.backgroundColor = "rgb(92, 184, 92)", i = /* @__PURE__ */ a.jsx(
            "span",
            {
              id: this.componentName + "_correct",
              style: t,
              ref: (s) => {
                this.target = s && l.findDOMNode(s);
              },
              children: /* @__PURE__ */ a.jsx(h, { icon: V })
            }
          );
        else if (this.validationState === "partialcorrect") {
          let r = `${Math.round(this.doenetSvData.creditAchieved * 100)} %`;
          t.width = "50px", t.backgroundColor = "#efab34", i = /* @__PURE__ */ a.jsx(
            "span",
            {
              id: this.componentName + "_partial",
              style: t,
              ref: (o) => {
                this.target = o && l.findDOMNode(o);
              },
              children: r
            }
          );
        } else
          t.backgroundColor = "rgb(187, 0, 0)", i = /* @__PURE__ */ a.jsx(
            "span",
            {
              id: this.componentName + "_incorrect",
              style: t,
              ref: (s) => {
                this.target = s && l.findDOMNode(s);
              },
              children: /* @__PURE__ */ a.jsx(h, { icon: D })
            }
          );
      else
        t.backgroundColor = "rgb(74, 3, 217)", i = /* @__PURE__ */ a.jsx(
          "span",
          {
            id: this.componentName + "_saved",
            style: t,
            ref: (s) => {
              this.target = s && l.findDOMNode(s);
            },
            children: /* @__PURE__ */ a.jsx(h, { icon: g })
          }
        );
      this.doenetSvData.numberOfAttemptsLeft < 0 ? i = /* @__PURE__ */ a.jsxs(a.Fragment, { children: [
        i,
        /* @__PURE__ */ a.jsx("span", { children: "(no attempts remaining)" })
      ] }) : this.doenetSvData.numberOfAttemptsLeft < 1 / 0 && (i = /* @__PURE__ */ a.jsxs(a.Fragment, { children: [
        i,
        /* @__PURE__ */ a.jsxs("span", { children: [
          "(attempts remaining: ",
          this.doenetSvData.numberOfAttemptsLeft,
          ")"
        ] })
      ] }));
    }
    return /* @__PURE__ */ a.jsxs(y.Fragment, { children: [
      /* @__PURE__ */ a.jsx("a", { name: this.componentName }),
      /* @__PURE__ */ a.jsxs("span", { className: "textInputSurroundingBox", id: this.componentName, children: [
        /* @__PURE__ */ a.jsx("span", { style: { margin: "10px" }, children: /* @__PURE__ */ a.jsx(
          b,
          {
            latex: this.latexValue,
            config: {
              autoCommands: "sqrt pi theta integral infinity",
              autoOperatorNames: "arg deg det dim exp gcd hom ker lg lim ln log max min Pr sin cos tan arcsin arccos arctan sinh cosh tanh sec csc cot coth sin cos tan sec cosec csc cotan cot ctg arcsin arccos arctan arcsec arccosec arccsc arccotan arccot arcctg sinh cosh tanh sech cosech csch cotanh coth ctgh arsinh arcosh artanh arsech arcosech arcsch arcotanh arcoth arctgh arcsinh arccosh arctanh arcsech arccosech arccsch arccotanh arccoth arcctgh",
              handlers: {
                enter: this.handlePressEnter
              }
            },
            onChange: (s) => {
              this.onChangeHandler(s.latex());
            },
            onBlur: this.handleBlur,
            onFocus: this.handleFocus
          }
        ) }),
        i
      ] })
    ] });
  }
}
d(R, "initializeChildrenOnConstruction", !1);
function c(n) {
  return n.replaceAll("\\,", "").replaceAll(/\\var{([^{}]*)}/g, "$1");
}
export {
  R as default
};
