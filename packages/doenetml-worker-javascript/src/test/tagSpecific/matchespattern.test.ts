import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import { cleanLatex } from "../utils/math";
import {
    updateBooleanInputValue,
    updateMathInputValue,
} from "../utils/actions";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

describe("MatchesPattern tag tests", async () => {
    it("match linear pattern", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <p>Pattern: <math name="pattern">()x+()</math></p>
  <p>Expression: <mathInput name="expr" /></p>

  <p>Default settings: <matchesPattern name="default" pattern="$pattern">
    $expr
  </matchesPattern></p>
  <p>Matches: <mathList extend="$default.patternMatches" name="dm" /></p>

  <p>No permutations: <matchesPattern name="noperm" pattern="$pattern" allowPermutations="false">
    $expr
  </matchesPattern></p>
  <p>Matches: <mathList extend="$noperm.patternMatches" name="npm" /></p>

  <p>Implicit identities: <matchesPattern name="implicitIdents" pattern="$pattern" allowImplicitIdentities>
    $expr
  </matchesPattern></p>
  <p>Matches: <mathList extend="$implicitIdents.patternMatches" name="iim" /></p>

  <p>Require numeric matches: <matchesPattern name="requireNumeric" pattern="$pattern" requireNumericMatches>
    $expr
  </matchesPattern></p>
  <p>Matches: <mathList extend="$requireNumeric.patternMatches" name="rnm" /></p>

  <p>Require variable matches: <matchesPattern name="requireVariable" pattern="$pattern" requirevariableMatches>
    $expr
  </matchesPattern></p>
  <p>Matches: <mathList extend="$requireVariable.patternMatches" name="rvm" /></p>

  <p>Variable except x: <matchesPattern name="excludeX" pattern="$pattern" excludeMatches="x" requirevariableMatches>
    $expr
  </matchesPattern></p>
  <p>Matches: <mathList extend="$excludeX.patternMatches" name="exm" /></p>


  `,
        });

        let matchNames = {
            default: ["dm[1]", "dm[2]"],
            noperm: ["npm[1]", "npm[2]"],
            implicitIdents: ["iim[1]", "iim[2]"],
            requireNumeric: ["rnm[1]", "rnm[2]"],
            requireVariable: ["rvm[1]", "rvm[2]"],
            excludeX: ["exm[1]", "exm[2]"],
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
                componentIdx: await resolvePathToNodeIdx("expr"),
                core,
            });
            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );

            let dResults = desiredResults[expr];

            for (let name in dResults) {
                let res = dResults[name];
                if (res) {
                    expect(
                        stateVariables[await resolvePathToNodeIdx(`${name}`)]
                            .stateValues.value,
                    ).to.be.true;
                    expect(
                        cleanLatex(
                            stateVariables[
                                await resolvePathToNodeIdx(
                                    `${matchNames[name][0]}`,
                                )
                            ].stateValues.latex,
                        ),
                    ).eq(res[0]);
                    expect(
                        cleanLatex(
                            stateVariables[
                                await resolvePathToNodeIdx(
                                    `${matchNames[name][1]}`,
                                )
                            ].stateValues.latex,
                        ),
                    ).eq(res[1]);
                } else {
                    expect(
                        stateVariables[await resolvePathToNodeIdx(`${name}`)]
                            .stateValues.value,
                    ).to.be.false;
                    expect(
                        stateVariables[
                            await resolvePathToNodeIdx(`${matchNames[name][0]}`)
                        ],
                    ).eq(undefined);
                    expect(
                        stateVariables[
                            await resolvePathToNodeIdx(`${matchNames[name][1]}`)
                        ],
                    ).eq(undefined);
                }
            }
        }
    });

    it("match quadratic pattern, base test", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <p>Pattern: <math name="pattern">()x^2+()x+()</math></p>
  <p>Expression: <mathInput name="expr" /></p>

  <p>Default settings: <matchesPattern name="default" pattern="$pattern">
    $expr
  </matchesPattern></p>
  <p>Matches: <mathList extend="$default.patternMatches" name="dm" /></p>

  <p>No permutations: <matchesPattern name="noperm" pattern="$pattern" allowPermutations="false">
    $expr
  </matchesPattern></p>
  <p>Matches: <mathList extend="$noperm.patternMatches" name="npm" /></p>

  <p>Implicit identities: <matchesPattern name="implicitIdents" pattern="$pattern" allowImplicitIdentities>
    $expr
  </matchesPattern></p>
  <p>Matches: <mathList extend="$implicitIdents.patternMatches" name="iim" /></p>

  <p>Require numeric matches: <matchesPattern name="requireNumeric" pattern="$pattern" requireNumericMatches>
    $expr
  </matchesPattern></p>
  <p>Matches: <mathList extend="$requireNumeric.patternMatches" name="rnm" /></p>

  <p>Require variable matches: <matchesPattern name="requireVariable" pattern="$pattern" requirevariableMatches>
    $expr
  </matchesPattern></p>
  <p>Matches: <mathList extend="$requireVariable.patternMatches" name="rvm" /></p>

  <p>Variable except x: <matchesPattern name="excludeX" pattern="$pattern" excludeMatches="x" requirevariableMatches>
    $expr
  </matchesPattern></p>
  <p>Matches: <mathList extend="$excludeX.patternMatches" name="exm" /></p>


  `,
        });

        let matchNames = {
            default: ["dm[1]", "dm[2]", "dm[3]"],
            noperm: ["npm[1]", "npm[2]", "npm[3]"],
            implicitIdents: ["iim[1]", "iim[2]", "iim[3]"],
            requireNumeric: ["rnm[1]", "rnm[2]", "rnm[3]"],
            requireVariable: ["rvm[1]", "rvm[2]", "rvm[3]"],
            excludeX: ["exm[1]", "exm[2]", "exm[3]"],
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
                componentIdx: await resolvePathToNodeIdx("expr"),
                core,
            });
            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );

            let dResults = desiredResults[expr];

            for (let name in dResults) {
                let res = dResults[name];
                if (res) {
                    expect(
                        stateVariables[await resolvePathToNodeIdx(`${name}`)]
                            .stateValues.value,
                    ).to.be.true;
                    expect(
                        cleanLatex(
                            stateVariables[
                                await resolvePathToNodeIdx(
                                    `${matchNames[name][0]}`,
                                )
                            ].stateValues.latex,
                        ),
                    ).eq(res[0]);
                    expect(
                        cleanLatex(
                            stateVariables[
                                await resolvePathToNodeIdx(
                                    `${matchNames[name][1]}`,
                                )
                            ].stateValues.latex,
                        ),
                    ).eq(res[1]);
                } else {
                    expect(
                        stateVariables[await resolvePathToNodeIdx(`${name}`)]
                            .stateValues.value,
                    ).to.be.false;
                    expect(
                        stateVariables[
                            await resolvePathToNodeIdx(`${matchNames[name][0]}`)
                        ],
                    ).eq(undefined);
                    expect(
                        stateVariables[
                            await resolvePathToNodeIdx(`${matchNames[name][1]}`)
                        ],
                    ).eq(undefined);
                }
            }
        }
    });

    it("match quadratic pattern, combine matches for flexibility", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <p>Pattern 1: <math name="pattern1">()x^2+()x+()</math></p>
  <p>Pattern 2: <math name="pattern2">()x^2+()</math></p>
  <p>Expression: <mathInput name="expr" /></p>

  <p>base: <boolean name="base">
    <matchesPattern name="base1" pattern="$pattern1" allowImplicitIdentities>$expr</matchesPattern>
    or <matchesPattern name="base2" pattern="$pattern2" allowImplicitIdentities>$expr</matchesPattern>
  </boolean></p>
  <p>Matches: 
    <conditionalContent name="bm">
      <case condition="$base1">$base1.patternMatches[1] $base1.patternMatches[2] $base1.patternMatch3</case>
      <case condition="$base2">$base2.patternMatches[1] <math>0</math> $base2.patternMatch2</case>
    </conditionalContent>
  </p>

  <p>Require numeric matches: <boolean name="requireNumeric">
    <matchesPattern name="requireNumeric1" pattern="$pattern1" requireNumericMatches allowImplicitIdentities>$expr</matchesPattern>
    or <matchesPattern name="requireNumeric2" pattern="$pattern2" requireNumericMatches allowImplicitIdentities>$expr</matchesPattern>
  </boolean></p>
  <p>Matches: 
    <conditionalContent name="rnm">
      <case condition="$requireNumeric1">$requireNumeric1.patternMatches[1] $requireNumeric1.patternMatches[2] $requireNumeric1.patternMatch3</case>
      <case condition="$requireNumeric2">$requireNumeric2.patternMatches[1] <math>0</math> $requireNumeric2.patternMatch2</case>
    </conditionalContent>
  </p>
  
  <p>Anything except x: <boolean name="excludeX">
    <matchesPattern name="excludeX1" pattern="$pattern1" excludeMatches="x" allowImplicitIdentities>$expr</matchesPattern>
    or <matchesPattern name="excludeX2" pattern="$pattern2" excludeMatches="x" allowImplicitIdentities>$expr</matchesPattern>
  </boolean></p>
  <p>Matches: 
    <conditionalContent name="exm">
      <case condition="$excludeX1">$excludeX1.patternMatches[1] $excludeX1.patternMatches[2] $excludeX1.patternMatch3</case>
      <case condition="$excludeX2">$excludeX2.patternMatches[1] <math>0</math> $excludeX2.patternMatch2</case>
    </conditionalContent>
  </p>
  `,
        });

        let matchNames = {
            base: ["bm[1][1]", "bm[1][2]", "bm[1][3]"],
            requireNumeric: ["rnm[1][1]", "rnm[1][2]", "rnm[1][3]"],
            excludeX: ["exm[1][1]", "exm[1][2]", "exm[1][3]"],
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
                componentIdx: await resolvePathToNodeIdx("expr"),
                core,
            });
            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );

            let dResults = desiredResults[expr];

            for (let name in dResults) {
                let res = dResults[name];
                if (res) {
                    expect(
                        stateVariables[await resolvePathToNodeIdx(`${name}`)]
                            .stateValues.value,
                    ).to.be.true;
                    let match1 =
                        stateVariables[
                            await resolvePathToNodeIdx(`${matchNames[name][0]}`)
                        ];

                    if (match1.componentType === "copy") {
                        match1 =
                            stateVariables[
                                match1.replacements![0].componentIdx
                            ];
                    }
                    expect(cleanLatex(match1.stateValues.latex)).eq(res[0]);
                    let match2 =
                        stateVariables[
                            await resolvePathToNodeIdx(`${matchNames[name][1]}`)
                        ];

                    if (match2.componentType === "copy") {
                        match2 =
                            stateVariables[
                                match2.replacements![0].componentIdx
                            ];
                    }
                    expect(cleanLatex(match2.stateValues.latex)).eq(res[1]);
                    let match3 =
                        stateVariables[
                            await resolvePathToNodeIdx(`${matchNames[name][2]}`)
                        ];
                    if (match3.componentType === "copy") {
                        match3 =
                            stateVariables[
                                match3.replacements![0].componentIdx
                            ];
                    }
                    expect(cleanLatex(match3.stateValues.latex)).eq(res[2]);
                } else {
                    expect(
                        stateVariables[await resolvePathToNodeIdx(`${name}`)]
                            .stateValues.value,
                    ).to.be.false;
                    expect(
                        stateVariables[
                            await resolvePathToNodeIdx(`${matchNames[name][0]}`)
                        ],
                    ).eq(undefined);
                    expect(
                        stateVariables[
                            await resolvePathToNodeIdx(`${matchNames[name][1]}`)
                        ],
                    ).eq(undefined);
                    expect(
                        stateVariables[
                            await resolvePathToNodeIdx(`${matchNames[name][2]}`)
                        ],
                    ).eq(undefined);
                }
            }
        }
    });

    it("handle case with no pattern specified", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <p><matchesPattern name="mp">hello</matchesPattern></p>
  `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx(`mp`)].stateValues.value,
        ).to.be.false;
    });

    it("works with string or multiple children", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <p><matchesPattern name="mps" pattern="()^()">e^(x+2)</matchesPattern></p>
  <p>Matches: <mathList extend="$mps.patternMatches" name="mpsm" /></p>
  <p><matchesPattern name="mpm" pattern="()^()">e^(<math>x</math>+<math>2</math>)</matchesPattern></p>
  <p>Matches: <mathList extend="$mpm.patternMatches" name="mpmm" /></p>


  `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx(`mps`)].stateValues.value,
        ).to.be.true;
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx(`mpsm[1]`)]
                    .stateValues.latex,
            ),
        ).eq("e");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx(`mpsm[2]`)]
                    .stateValues.latex,
            ),
        ).eq("x+2");

        expect(
            stateVariables[await resolvePathToNodeIdx(`mpm`)].stateValues.value,
        ).to.be.true;
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx(`mpmm[1]`)]
                    .stateValues.latex,
            ),
        ).eq("e");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx(`mpmm[2]`)]
                    .stateValues.latex,
            ),
        ).eq("x+2");
    });

    it("match expression with blanks", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <text>a</text>
  <p>Pattern: <math name="pattern"> < </math></p>
  <p>Expression: <mathInput name="expr" /></p>
  <p><booleanInput name="matchBlanks"><label>Match expression with blanks</label></booleanInput> <boolean name="matchBlanks2" extend="$matchBlanks" /></p>

  <p>Matches: <matchesPattern name="match" pattern="$pattern" matchExpressionWithBlanks="$matchBlanks">
    $expr
  </matchesPattern></p>
  <p>Matches: <mathList extend="$match.patternMatches" name="m" /></p>


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
                componentIdx: await resolvePathToNodeIdx("expr"),
                core,
            });
            await updateBooleanInputValue({
                boolean: true,
                componentIdx: await resolvePathToNodeIdx("matchBlanks"),
                core,
            });

            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );

            let dResults = desiredResults[expr];

            let res = dResults.blanks;
            if (res) {
                expect(
                    stateVariables[await resolvePathToNodeIdx(`match`)]
                        .stateValues.value,
                ).to.be.true;
                expect(
                    cleanLatex(
                        stateVariables[await resolvePathToNodeIdx(`m[1]`)]
                            .stateValues.latex,
                    ),
                ).eq(res[0]);
                expect(
                    cleanLatex(
                        stateVariables[await resolvePathToNodeIdx(`m[2]`)]
                            .stateValues.latex,
                    ),
                ).eq(res[1]);
            } else {
                expect(
                    stateVariables[await resolvePathToNodeIdx(`match`)]
                        .stateValues.value,
                ).to.be.false;
                expect(stateVariables[await resolvePathToNodeIdx(`m[1]`)]).eq(
                    undefined,
                );
                expect(stateVariables[await resolvePathToNodeIdx(`m[2]`)]).eq(
                    undefined,
                );
            }

            await updateBooleanInputValue({
                boolean: false,
                componentIdx: await resolvePathToNodeIdx("matchBlanks"),
                core,
            });

            stateVariables = await core.returnAllStateVariables(false, true);

            dResults = desiredResults[expr];

            res = dResults.default;
            if (res) {
                expect(
                    stateVariables[await resolvePathToNodeIdx(`match`)]
                        .stateValues.value,
                ).to.be.true;
                expect(
                    cleanLatex(
                        stateVariables[await resolvePathToNodeIdx(`m[1]`)]
                            .stateValues.latex,
                    ),
                ).eq(res[0]);
                expect(
                    cleanLatex(
                        stateVariables[await resolvePathToNodeIdx(`m[2]`)]
                            .stateValues.latex,
                    ),
                ).eq(res[1]);
            } else {
                expect(
                    stateVariables[await resolvePathToNodeIdx(`match`)]
                        .stateValues.value,
                ).to.be.false;
                expect(stateVariables[await resolvePathToNodeIdx(`m[1]`)]).eq(
                    undefined,
                );
                expect(stateVariables[await resolvePathToNodeIdx(`m[2]`)]).eq(
                    undefined,
                );
            }
        }
    });
});
