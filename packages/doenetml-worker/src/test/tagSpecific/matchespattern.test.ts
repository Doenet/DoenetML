import { describe, expect, it, vi } from "vitest";
import { createTestCore, returnAllStateVariables } from "../utils/test-core";
import { cleanLatex } from "../utils/math";
import {
    updateBooleanInputValue,
    updateMathInputValue,
} from "../utils/actions";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);

describe("MatchesPattern tag tests", async () => {
    it("match linear pattern", async () => {
        let core = await createTestCore({
            doenetML: `
  <p>Pattern: <math name="pattern">()x+()</math></p>
  <p>Expression: <mathinput name="expr" /></p>

  <p>Default settings: <matchesPattern name="default" pattern="$pattern">
    $expr
  </matchesPattern></p>
  <p>Matches: <copy source="default.patternMatches" assignNames="dm1 dm2" /></p>

  <p>No permutations: <matchesPattern name="noperm" pattern="$pattern" allowPermutations="false">
    $expr
  </matchesPattern></p>
  <p>Matches: <copy source="noperm.patternMatches" assignNames="npm1 npm2" /></p>

  <p>Implicit identities: <matchesPattern name="implicitIdents" pattern="$pattern" allowImplicitIdentities>
    $expr
  </matchesPattern></p>
  <p>Matches: <copy source="implicitIdents.patternMatches" assignNames="iim1 iim2" /></p>

  <p>Require numeric matches: <matchesPattern name="requireNumeric" pattern="$pattern" requireNumericMatches>
    $expr
  </matchesPattern></p>
  <p>Matches: <copy source="requireNumeric.patternMatches" assignNames="rnm1 rnm2" /></p>

  <p>Require variable matches: <matchesPattern name="requireVariable" pattern="$pattern" requirevariableMatches>
    $expr
  </matchesPattern></p>
  <p>Matches: <copy source="requireVariable.patternMatches" assignNames="rvm1 rvm2" /></p>

  <p>Variable except x: <matchesPattern name="excludeX" pattern="$pattern" excludeMatches="x" requirevariableMatches>
    $expr
  </matchesPattern></p>
  <p>Matches: <copy source="excludeX.patternMatches" assignNames="exm1 exm2" /></p>


  `,
        });

        let matchNames = {
            default: ["dm1", "dm2"],
            noperm: ["npm1", "npm2"],
            implicitIdents: ["iim1", "iim2"],
            requireNumeric: ["rnm1", "rnm2"],
            requireVariable: ["rvm1", "rvm2"],
            excludeX: ["exm1", "exm2"],
        };

        let desiredResults = {
            "": {
                default: false,
                noperm: false,
                implicitIdents: false,
                requireNumeric: false,
                requireVariable: false,
                excludeX: false,
            },
            x: {
                default: false,
                noperm: false,
                implicitIdents: ["1", "0"],
                requireNumeric: false,
                requireVariable: false,
                excludeX: false,
            },
            "x+y": {
                default: false,
                noperm: false,
                implicitIdents: ["1", "y"],
                requireNumeric: false,
                requireVariable: false,
                excludeX: false,
            },
            "2x+y": {
                default: ["2", "y"],
                noperm: ["2", "y"],
                implicitIdents: ["2", "y"],
                requireNumeric: false,
                requireVariable: false,
                excludeX: false,
            },
            "y+2x": {
                default: ["2", "y"],
                noperm: false,
                implicitIdents: ["2", "y"],
                requireNumeric: false,
                requireVariable: false,
                excludeX: false,
            },
            "x*2+y": {
                default: ["2", "y"],
                noperm: false,
                implicitIdents: ["2", "y"],
                requireNumeric: false,
                requireVariable: false,
                excludeX: false,
            },
            "(y+z)x+7+e^{q+5}": {
                default: ["y+z", "7+e^{q+5}"],
                noperm: ["y+z", "7+e^{q+5}"],
                implicitIdents: ["y+z", "7+e^{q+5}"],
                requireNumeric: false,
                requireVariable: false,
                excludeX: false,
            },
            "\\pi x+\\sqrt{3}": {
                default: ["\\pi", "\\sqrt{3}"],
                noperm: ["\\pi", "\\sqrt{3}"],
                implicitIdents: ["\\pi", "\\sqrt{3}"],
                requireNumeric: ["\\pi", "\\sqrt{3}"],
                requireVariable: false,
                excludeX: false,
            },
            "ax+b": {
                default: ["a", "b"],
                noperm: ["a", "b"],
                implicitIdents: ["a", "b"],
                requireNumeric: false,
                requireVariable: ["a", "b"],
                excludeX: ["a", "b"],
            },
            "ax+x": {
                default: ["a", "x"],
                noperm: ["a", "x"],
                implicitIdents: ["a", "x"],
                requireNumeric: false,
                requireVariable: ["a", "x"],
                excludeX: false,
            },
            "ax+x+x": {
                default: ["a", "x+x"],
                noperm: ["a", "x+x"],
                implicitIdents: ["a", "x+x"],
                requireNumeric: false,
                requireVariable: false,
                excludeX: false,
            },
            "b+xa": {
                default: ["a", "b"],
                noperm: false,
                implicitIdents: ["a", "b"],
                requireNumeric: false,
                requireVariable: ["a", "b"],
                excludeX: ["a", "b"],
            },
            "ax+b+c": {
                default: ["a", "b+c"],
                noperm: ["a", "b+c"],
                implicitIdents: ["a", "b+c"],
                requireNumeric: false,
                requireVariable: false,
                excludeX: false,
            },
            "(1+2)x+3+4": {
                default: ["1+2", "3+4"],
                noperm: ["1+2", "3+4"],
                implicitIdents: ["1+2", "3+4"],
                requireNumeric: ["1+2", "3+4"],
                requireVariable: false,
                excludeX: false,
            },
        };

        for (let expr in desiredResults) {
            await updateMathInputValue({
                latex: expr,
                name: "/expr",
                core,
            });
            let stateVariables = await returnAllStateVariables(core);

            let dResults = desiredResults[expr];

            for (let name in dResults) {
                let res = dResults[name];
                if (res) {
                    expect(stateVariables[`/${name}`].stateValues.value).to.be
                        .true;
                    expect(
                        cleanLatex(
                            stateVariables[`/${matchNames[name][0]}`]
                                .stateValues.latex,
                        ),
                    ).eq(res[0]);
                    expect(
                        cleanLatex(
                            stateVariables[`/${matchNames[name][1]}`]
                                .stateValues.latex,
                        ),
                    ).eq(res[1]);
                } else {
                    expect(stateVariables[`/${name}`].stateValues.value).to.be
                        .false;
                    expect(stateVariables[`/${matchNames[name][0]}`]).eq(
                        undefined,
                    );
                    expect(stateVariables[`/${matchNames[name][1]}`]).eq(
                        undefined,
                    );
                }
            }
        }
    });

    it("match quadratic pattern, base test", async () => {
        let core = await createTestCore({
            doenetML: `
  <p>Pattern: <math name="pattern">()x^2+()x+()</math></p>
  <p>Expression: <mathinput name="expr" /></p>

  <p>Default settings: <matchesPattern name="default" pattern="$pattern">
    $expr
  </matchesPattern></p>
  <p>Matches: <copy source="default.patternMatches" assignNames="dm1 dm2 dm3" /></p>

  <p>No permutations: <matchesPattern name="noperm" pattern="$pattern" allowPermutations="false">
    $expr
  </matchesPattern></p>
  <p>Matches: <copy source="noperm.patternMatches" assignNames="npm1 npm2 npm3" /></p>

  <p>Implicit identities: <matchesPattern name="implicitIdents" pattern="$pattern" allowImplicitIdentities>
    $expr
  </matchesPattern></p>
  <p>Matches: <copy source="implicitIdents.patternMatches" assignNames="iim1 iim2 iim3" /></p>

  <p>Require numeric matches: <matchesPattern name="requireNumeric" pattern="$pattern" requireNumericMatches>
    $expr
  </matchesPattern></p>
  <p>Matches: <copy source="requireNumeric.patternMatches" assignNames="rnm1 rnm2 rnm3" /></p>

  <p>Require variable matches: <matchesPattern name="requireVariable" pattern="$pattern" requirevariableMatches>
    $expr
  </matchesPattern></p>
  <p>Matches: <copy source="requireVariable.patternMatches" assignNames="rvm1 rvm2 rvm3" /></p>

  <p>Variable except x: <matchesPattern name="excludeX" pattern="$pattern" excludeMatches="x" requirevariableMatches>
    $expr
  </matchesPattern></p>
  <p>Matches: <copy source="excludeX.patternMatches" assignNames="exm1 exm2 exm3" /></p>


  `,
        });

        let matchNames = {
            default: ["dm1", "dm2", "dm3"],
            noperm: ["npm1", "npm2", "npm3"],
            implicitIdents: ["iim1", "iim2", "iim3"],
            requireNumeric: ["rnm1", "rnm2", "rnm3"],
            requireVariable: ["rvm1", "rvm2", "rvm3"],
            excludeX: ["exm1", "exm2", "exm3"],
        };

        let desiredResults = {
            "": {
                default: false,
                noperm: false,
                implicitIdents: false,
                requireNumeric: false,
                requireVariable: false,
                excludeX: false,
            },
            x: {
                default: false,
                noperm: false,
                implicitIdents: false,
                requireNumeric: false,
                requireVariable: false,
                excludeX: false,
            },
            "x^2": {
                default: false,
                noperm: false,
                implicitIdents: false,
                requireNumeric: false,
                requireVariable: false,
                excludeX: false,
            },
            "x^2+x": {
                default: false,
                noperm: false,
                implicitIdents: ["1", "1", "0"],
                requireNumeric: false,
                requireVariable: false,
                excludeX: false,
            },
            "1x^2+1x+0": {
                default: ["1", "1", "0"],
                noperm: ["1", "1", "0"],
                implicitIdents: ["1", "1", "0"],
                requireNumeric: ["1", "1", "0"],
                requireVariable: false,
                excludeX: false,
            },
            "ax^2+bx+c": {
                default: ["a", "b", "c"],
                noperm: ["a", "b", "c"],
                implicitIdents: ["a", "b", "c"],
                requireNumeric: false,
                requireVariable: ["a", "b", "c"],
                excludeX: ["a", "b", "c"],
            },
            "ax^2+c+bx": {
                default: ["a", "b", "c"],
                noperm: false,
                implicitIdents: ["a", "b", "c"],
                requireNumeric: false,
                requireVariable: ["a", "b", "c"],
                excludeX: ["a", "b", "c"],
            },
            "xx^2+bx+c": {
                default: ["x", "b", "c"],
                noperm: ["x", "b", "c"],
                implicitIdents: ["x", "b", "c"],
                requireNumeric: false,
                requireVariable: ["x", "b", "c"],
                excludeX: false,
            },
        };

        for (let expr in desiredResults) {
            await updateMathInputValue({
                latex: expr,
                name: "/expr",
                core,
            });
            let stateVariables = await returnAllStateVariables(core);

            let dResults = desiredResults[expr];

            for (let name in dResults) {
                let res = dResults[name];
                if (res) {
                    expect(stateVariables[`/${name}`].stateValues.value).to.be
                        .true;
                    expect(
                        cleanLatex(
                            stateVariables[`/${matchNames[name][0]}`]
                                .stateValues.latex,
                        ),
                    ).eq(res[0]);
                    expect(
                        cleanLatex(
                            stateVariables[`/${matchNames[name][1]}`]
                                .stateValues.latex,
                        ),
                    ).eq(res[1]);
                } else {
                    expect(stateVariables[`/${name}`].stateValues.value).to.be
                        .false;
                    expect(stateVariables[`/${matchNames[name][0]}`]).eq(
                        undefined,
                    );
                    expect(stateVariables[`/${matchNames[name][1]}`]).eq(
                        undefined,
                    );
                }
            }
        }
    });

    it("match quadratic pattern, combine matches for flexibility", async () => {
        let core = await createTestCore({
            doenetML: `
  <p>Pattern 1: <math name="pattern1">()x^2+()x+()</math></p>
  <p>Pattern 2: <math name="pattern2">()x^2+()</math></p>
  <p>Expression: <mathinput name="expr" /></p>

  <p>base: <boolean name="base">
    <matchesPattern name="base1" pattern="$pattern1" allowImplicitIdentities>$expr</matchesPattern>
    or <matchesPattern name="base2" pattern="$pattern2" allowImplicitIdentities>$expr</matchesPattern>
  </boolean></p>
  <p>Matches: 
    <conditionalContent assignNames="(bm1 bm2 bm3)" maximumNumberToShow="1">
      <case condition="$base1">$base1.patternMatches[1] $base1.patternMatches[2] $base1.patternMatch3</case>
      <case condition="$base2">$base2.patternMatches[1] <math>0</math> $base2.patternMatch2</case>
    </conditionalContent>
  </p>

  <p>Require numeric matches: <boolean name="requireNumeric">
    <matchesPattern name="requireNumeric1" pattern="$pattern1" requireNumericMatches allowImplicitIdentities>$expr</matchesPattern>
    or <matchesPattern name="requireNumeric2" pattern="$pattern2" requireNumericMatches allowImplicitIdentities>$expr</matchesPattern>
  </boolean></p>
  <p>Matches: 
    <conditionalContent assignNames="(rnm1 rnm2 rnm3)" maximumNumberToShow="1">
      <case condition="$requireNumeric1">$requireNumeric1.patternMatches[1] $requireNumeric1.patternMatches[2] $requireNumeric1.patternMatch3</case>
      <case condition="$requireNumeric2">$requireNumeric2.patternMatches[1] <math>0</math> $requireNumeric2.patternMatch2</case>
    </conditionalContent>
  </p>
  
  <p>Anything except x: <boolean name="excludeX">
    <matchesPattern name="excludeX1" pattern="$pattern1" excludeMatches="x" allowImplicitIdentities>$expr</matchesPattern>
    or <matchesPattern name="excludeX2" pattern="$pattern2" excludeMatches="x" allowImplicitIdentities>$expr</matchesPattern>
  </boolean></p>
  <p>Matches: 
    <conditionalContent assignNames="(exm1 exm2 exm3)" maximumNumberToShow="1">
      <case condition="$excludeX1">$excludeX1.patternMatches[1] $excludeX1.patternMatches[2] $excludeX1.patternMatch3</case>
      <case condition="$excludeX2">$excludeX2.patternMatches[1] <math>0</math> $excludeX2.patternMatch2</case>
    </conditionalContent>
  </p>
  `,
        });

        let matchNames = {
            base: ["bm1", "bm2", "bm3"],
            requireNumeric: ["rnm1", "rnm2", "rnm3"],
            excludeX: ["exm1", "exm2", "exm3"],
        };

        let desiredResults = {
            "": {
                base: false,
                requireNumeric: false,
                excludeX: false,
            },
            "x^2": {
                base: ["1", "0", "0"],
                requireNumeric: ["1", "0", "0"],
                excludeX: ["1", "0", "0"],
            },
            "x^2+x": {
                base: ["1", "1", "0"],
                requireNumeric: ["1", "1", "0"],
                excludeX: ["1", "1", "0"],
            },
            "x^2+x+1": {
                base: ["1", "1", "1"],
                requireNumeric: ["1", "1", "1"],
                excludeX: ["1", "1", "1"],
            },
            "3x^2-5x+\\pi": {
                base: ["3", "-5", "\\pi"],
                requireNumeric: ["3", "-5", "\\pi"],
                excludeX: ["3", "-5", "\\pi"],
            },
            "ax^2+bx+c": {
                base: ["a", "b", "c"],
                requireNumeric: false,
                excludeX: ["a", "b", "c"],
            },
            "ax^2+c": {
                base: ["a", "0", "c"],
                requireNumeric: false,
                excludeX: ["a", "0", "c"],
            },
            "xx^2+c": {
                base: ["x", "0", "c"],
                requireNumeric: false,
                excludeX: false,
            },
            "xx^2+bx+c": {
                base: ["x", "b", "c"],
                requireNumeric: false,
                excludeX: false,
            },
            "3/2x^2+5/7x+2/3": {
                base: ["\\frac{3}{2}", "\\frac{5}{7}", "\\frac{2}{3}"],
                requireNumeric: [
                    "\\frac{3}{2}",
                    "\\frac{5}{7}",
                    "\\frac{2}{3}",
                ],
                excludeX: ["\\frac{3}{2}", "\\frac{5}{7}", "\\frac{2}{3}"],
            },
            "3/2x^2+2/3": {
                base: ["\\frac{3}{2}", "0", "\\frac{2}{3}"],
                requireNumeric: ["\\frac{3}{2}", "0", "\\frac{2}{3}"],
                excludeX: ["\\frac{3}{2}", "0", "\\frac{2}{3}"],
            },
        };

        for (let expr in desiredResults) {
            await updateMathInputValue({
                latex: expr,
                name: "/expr",
                core,
            });
            let stateVariables = await returnAllStateVariables(core);

            let dResults = desiredResults[expr];

            for (let name in dResults) {
                let res = dResults[name];
                if (res) {
                    expect(stateVariables[`/${name}`].stateValues.value).to.be
                        .true;
                    let match1 = stateVariables[`/${matchNames[name][0]}`];
                    if (match1.componentType === "copy") {
                        match1 =
                            stateVariables[
                                match1.replacements![0].componentName
                            ];
                    }
                    expect(cleanLatex(match1.stateValues.latex)).eq(res[0]);
                    let match2 = stateVariables[`/${matchNames[name][1]}`];
                    if (match2.componentType === "copy") {
                        match2 =
                            stateVariables[
                                match2.replacements![0].componentName
                            ];
                    }
                    expect(cleanLatex(match2.stateValues.latex)).eq(res[1]);
                    let match3 = stateVariables[`/${matchNames[name][2]}`];
                    if (match3.componentType === "copy") {
                        match3 =
                            stateVariables[
                                match3.replacements![0].componentName
                            ];
                    }
                    expect(cleanLatex(match3.stateValues.latex)).eq(res[2]);
                } else {
                    expect(stateVariables[`/${name}`].stateValues.value).to.be
                        .false;
                    expect(stateVariables[`/${matchNames[name][0]}`]).eq(
                        undefined,
                    );
                    expect(stateVariables[`/${matchNames[name][1]}`]).eq(
                        undefined,
                    );
                    expect(stateVariables[`/${matchNames[name][2]}`]).eq(
                        undefined,
                    );
                }
            }
        }
    });

    it("handle case with no pattern specified", async () => {
        let core = await createTestCore({
            doenetML: `
  <p><matchesPattern name="mp">hello</matchesPattern></p>
  `,
        });

        let stateVariables = await returnAllStateVariables(core);

        expect(stateVariables[`/mp`].stateValues.value).to.be.false;
    });

    it("works with string or multiple children", async () => {
        let core = await createTestCore({
            doenetML: `
  <p><matchesPattern name="mps" pattern="()^()">e^(x+2)</matchesPattern></p>
  <p>Matches: <copy source="mps.patternMatches" assignNames="mpsm1 mpsm2" /></p>
  <p><matchesPattern name="mpm" pattern="()^()">e^(<math>x</math>+<math>2</math>)</matchesPattern></p>
  <p>Matches: <copy source="mpm.patternMatches" assignNames="mpmm1 mpmm2" /></p>


  `,
        });

        let stateVariables = await returnAllStateVariables(core);

        expect(stateVariables[`/mps`].stateValues.value).to.be.true;
        expect(cleanLatex(stateVariables[`/mpsm1`].stateValues.latex)).eq("e");
        expect(cleanLatex(stateVariables[`/mpsm2`].stateValues.latex)).eq(
            "x+2",
        );

        expect(stateVariables[`/mpm`].stateValues.value).to.be.true;
        expect(cleanLatex(stateVariables[`/mpmm1`].stateValues.latex)).eq("e");
        expect(cleanLatex(stateVariables[`/mpmm2`].stateValues.latex)).eq(
            "x+2",
        );
    });

    it("match expression with blanks", async () => {
        let core = await createTestCore({
            doenetML: `
  <text>a</text>
  <p>Pattern: <math name="pattern"> < </math></p>
  <p>Expression: <mathinput name="expr" /></p>
  <p><booleanInput name="matchBlanks"><label>Match expression with blanks</label></booleanInput> <boolean name="matchBlanks2" copySource="matchBlanks" /></p>

  <p>Matches: <matchesPattern name="match" pattern="$pattern" matchExpressionWithBlanks="$matchBlanks">
    $expr
  </matchesPattern></p>
  <p>Matches: <copy source="match.patternMatches" assignNames="m1 m2" /></p>


  `,
        });

        let desiredResults = {
            "": {
                default: false,
                blanks: false,
            },
            "<": {
                default: false,
                blanks: ["\uff3f", "\uff3f"],
            },
            ">": {
                default: false,
                blanks: ["\uff3f", "\uff3f"],
            },
            "x<y": {
                default: ["x", "y"],
                blanks: ["x", "y"],
            },
            "x>y": {
                default: ["y", "x"],
                blanks: ["y", "x"],
            },
            "a>": {
                default: false,
                blanks: ["\uff3f", "a"],
            },
            "a<": {
                default: false,
                blanks: ["a", "\uff3f"],
            },
            ">c": {
                default: false,
                blanks: ["c", "\uff3f"],
            },
            "<c": {
                default: false,
                blanks: ["\uff3f", "c"],
            },
            "q/r < st": {
                default: ["\\frac{q}{r}", "st"],
                blanks: ["\\frac{q}{r}", "st"],
            },
            "q/ < st": {
                default: false,
                blanks: ["\\frac{q}{\uff3f}", "st"],
            },
        };

        for (let expr in desiredResults) {
            await updateMathInputValue({
                latex: expr,
                name: "/expr",
                core,
            });
            await updateBooleanInputValue({
                boolean: true,
                name: "/matchBlanks",
                core,
            });

            let stateVariables = await returnAllStateVariables(core);

            let dResults = desiredResults[expr];

            let res = dResults.blanks;
            if (res) {
                expect(stateVariables[`/match`].stateValues.value).to.be.true;
                expect(cleanLatex(stateVariables[`/m1`].stateValues.latex)).eq(
                    res[0],
                );
                expect(cleanLatex(stateVariables[`/m2`].stateValues.latex)).eq(
                    res[1],
                );
            } else {
                expect(stateVariables[`/match`].stateValues.value).to.be.false;
                expect(stateVariables[`/m1`]).eq(undefined);
                expect(stateVariables[`/m2`]).eq(undefined);
            }

            await updateBooleanInputValue({
                boolean: false,
                name: "/matchBlanks",
                core,
            });

            stateVariables = await returnAllStateVariables(core);

            dResults = desiredResults[expr];

            res = dResults.default;
            if (res) {
                expect(stateVariables[`/match`].stateValues.value).to.be.true;
                expect(cleanLatex(stateVariables[`/m1`].stateValues.latex)).eq(
                    res[0],
                );
                expect(cleanLatex(stateVariables[`/m2`].stateValues.latex)).eq(
                    res[1],
                );
            } else {
                expect(stateVariables[`/match`].stateValues.value).to.be.false;
                expect(stateVariables[`/m1`]).eq(undefined);
                expect(stateVariables[`/m2`]).eq(undefined);
            }
        }
    });
});
