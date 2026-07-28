import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import { cleanLatex } from "../utils/math";
import {
    updateBooleanInputValue,
    updateMathInputValue,
} from "../utils/actions";
import { getDiagnosticsByType } from "../utils/diagnostics";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

/**
 * Drive a `<matchesPattern>` through a table of expressions.
 *
 * Expects a document that names its `<mathInput>` `expr`, its
 * `<matchesPattern>` `m`, and a `<mathList extend="$m.patternMatches">` `mm`.
 * `expected` maps the latex to type to the matches expected back, in order,
 * or to `false` when the pattern should not match.
 */
async function checkMatches({
    core,
    resolvePathToNodeIdx,
    numMatches,
    expected,
}: {
    core: any;
    resolvePathToNodeIdx: (path: string) => Promise<number>;
    numMatches: number;
    expected: Record<string, string[] | false>;
}) {
    for (let expr in expected) {
        await updateMathInputValue({
            latex: expr,
            componentIdx: await resolvePathToNodeIdx("expr"),
            core,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        const res = expected[expr];

        expect(
            stateVariables[await resolvePathToNodeIdx("m")].stateValues.value,
            expr,
        ).eq(res !== false);

        for (let ind = 1; ind <= numMatches; ind++) {
            const match =
                stateVariables[await resolvePathToNodeIdx(`mm[${ind}]`)];
            if (res === false) {
                expect(match, `${expr}, match ${ind}`).eq(undefined);
            } else {
                expect(
                    cleanLatex(match.stateValues.latex),
                    `${expr}, match ${ind}`,
                ).eq(res[ind - 1]);
            }
        }
    }
}

describe("MatchesPattern tag tests @group3", async () => {
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

    it("a repeated parameter requires the same subexpression each time", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <p>Expression: <mathInput name="expr" /></p>
  <p><matchesPattern name="m" pattern="sin(a)^2+cos(a)^2" parameters="a">$expr</matchesPattern></p>
  <p>Matches: <mathList extend="$m.patternMatches" name="mm" /></p>
  `,
        });

        await checkMatches({
            core,
            resolvePathToNodeIdx,
            numMatches: 1,
            expected: {
                "\\sin(x)^2+\\cos(x)^2": ["x"],
                "\\sin(y)^2+\\cos(y)^2": ["y"],
                "\\cos(3t)^2+\\sin(3t)^2": ["3t"],
                "\\sin(x)^2+\\cos(y)^2": false,
                "\\sin(x)^2+\\cos(x)^3": false,
            },
        });
    });

    it("match several parameters at once", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <p>Expression: <mathInput name="expr" /></p>
  <p><matchesPattern name="m" pattern="sin(xz)+exp(xa)+y" parameters="x y">$expr</matchesPattern></p>
  <p>Matches: <mathList extend="$m.patternMatches" name="mm" /></p>
  `,
        });

        await checkMatches({
            core,
            resolvePathToNodeIdx,
            numMatches: 2,
            expected: {
                "\\sin(qz)+\\exp(qa)+9": ["q", "9"],
                "\\sin((u+v)z)+\\exp((u+v)a)+9": ["u+v", "9"],
                // the two occurrences of `x` disagree
                "\\sin(qz)+\\exp(ra)+9": false,
                // `z` and `a` are literals, not placeholders
                "\\sin(z)+\\exp(a)+9": false,
            },
        });
    });

    it("a parameter is a placeholder everywhere it occurs in the pattern", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <p>Expression: <mathInput name="expr" /></p>
  <p><matchesPattern name="m" pattern="x+x" parameters="x">$expr</matchesPattern></p>
  <p>Matches: <mathList extend="$m.patternMatches" name="mm" /></p>
  `,
        });

        await checkMatches({
            core,
            resolvePathToNodeIdx,
            numMatches: 1,
            expected: {
                "q+q": ["q"],
                // `x` cannot also be a literal in a pattern that names it
                "x+x": ["x"],
                "q+r": false,
            },
        });
    });

    it("a parameter named twice is a single placeholder", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <p>Expression: <mathInput name="expr" /></p>
  <p><matchesPattern name="m" pattern="ax+b" parameters="a b a">$expr</matchesPattern></p>
  <p>Matches: <mathList extend="$m.patternMatches" name="mm" /></p>
  `,
        });

        // Listing `a` again adds no entry to `patternMatches`, so `b` stays
        // the second match.
        await checkMatches({
            core,
            resolvePathToNodeIdx,
            numMatches: 2,
            expected: { "3x+5": ["3", "5"] },
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("m")].stateValues
                .numMatches,
        ).eq(2);
        expect(getDiagnosticsByType(core).warnings.length).eq(0);
    });

    it("blanks are matched literally when parameters are specified", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <p>Expression: <mathInput name="expr" /></p>
  <p><matchesPattern name="m" pattern="ax+()" parameters="a" matchExpressionWithBlanks="$matchBlanks">$expr</matchesPattern></p>
  <p>Matches: <mathList extend="$m.patternMatches" name="mm" /></p>
  <p><booleanInput name="matchBlanks" /></p>
  `,
        });

        // The `()` no longer absorbs the second term, so only an expression
        // that has a blank of its own can match — and that needs
        // `matchExpressionWithBlanks`.
        await checkMatches({
            core,
            resolvePathToNodeIdx,
            numMatches: 1,
            expected: { "3x+5": false, "3x+": false },
        });

        await updateBooleanInputValue({
            boolean: true,
            componentIdx: await resolvePathToNodeIdx("matchBlanks"),
            core,
        });

        await checkMatches({
            core,
            resolvePathToNodeIdx,
            numMatches: 1,
            expected: { "3x+5": false, "3x+": ["3"] },
        });
    });

    it("an empty parameter list leaves the pattern with no placeholders", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <p>Expression: <mathInput name="expr" /></p>
  <p><matchesPattern name="m" pattern="3x+()" parameters="" matchExpressionWithBlanks>$expr</matchesPattern></p>
  <p>Matches: <mathList extend="$m.patternMatches" name="mm" /></p>
  `,
        });

        await checkMatches({
            core,
            resolvePathToNodeIdx,
            numMatches: 0,
            expected: { "3x+5": false, "3x+": [] },
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("m")].stateValues
                .numMatches,
        ).eq(0);
    });

    it("distinct subscripted parameters are separate placeholders", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <p>Expression: <mathInput name="expr" /></p>
  <p><matchesPattern name="m" pattern="x_1+x_2 x_1" parameters="x_1 x_2">$expr</matchesPattern></p>
  <p>Matches: <mathList extend="$m.patternMatches" name="mm" /></p>
  `,
        });

        await checkMatches({
            core,
            resolvePathToNodeIdx,
            numMatches: 2,
            expected: { "q+rq": ["q", "r"], "q+rs": false },
        });
    });

    it("a subscripted parameter is not reached through its base", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <p>Expression: <mathInput name="expr" /></p>
  <p><matchesPattern name="m" pattern="x+x_1 x" parameters="x x_1">$expr</matchesPattern></p>
  <p>Matches: <mathList extend="$m.patternMatches" name="mm" /></p>
  `,
        });

        // If `x_1` were rewritten through the `x` inside it, it could no
        // longer be a placeholder of its own and `r` would not match.
        await checkMatches({
            core,
            resolvePathToNodeIdx,
            numMatches: 2,
            expected: { "q+rq": ["q", "r"], "q+rs": false },
        });
    });

    it("a function name can be a parameter", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <p>Expression: <mathInput name="expr" /></p>
  <p><matchesPattern name="m" pattern="f(x)+f(y)" parameters="f">$expr</matchesPattern></p>
  <p>Matches: <mathList extend="$m.patternMatches" name="mm" /></p>
  `,
        });

        await checkMatches({
            core,
            resolvePathToNodeIdx,
            numMatches: 1,
            expected: {
                "\\sin(x)+\\sin(y)": ["\\sin"],
                "\\sin(x)+\\cos(y)": false,
            },
        });
    });

    it("a primed parameter can be a placeholder", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <p>Expression: <mathInput name="expr" /></p>
  <p><matchesPattern name="m" pattern="f'(x)+f'(y)" parameters="f'">$expr</matchesPattern></p>
  <p>Matches: <mathList extend="$m.patternMatches" name="mm" /></p>
  `,
        });

        await checkMatches({
            core,
            resolvePathToNodeIdx,
            numMatches: 1,
            expected: { "g(x)+g(y)": ["g"], "g(x)+h(y)": false },
        });
    });

    it("parameters honor requireNumericMatches and requireVariableMatches", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <p>Expression: <mathInput name="expr" /></p>
  <p><matchesPattern name="m" pattern="cx+c" parameters="c" requireNumericMatches>$expr</matchesPattern></p>
  <p>Matches: <mathList extend="$m.patternMatches" name="mm" /></p>
  <p><matchesPattern name="mv" pattern="cx+c" parameters="c" requireVariableMatches>$expr</matchesPattern></p>
  <p>Matches: <mathList extend="$mv.patternMatches" name="mvm" /></p>
  `,
        });

        await checkMatches({
            core,
            resolvePathToNodeIdx,
            numMatches: 1,
            expected: { "3x+3": ["3"], "ax+a": false },
        });

        // `mv` takes the opposite view of the `ax+a` left in the input above:
        // a variable is what it requires.
        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("mv")].stateValues.value,
        ).to.be.true;
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("mvm[1]")].stateValues
                    .latex,
            ),
        ).eq("a");
    });

    it("parameters honor allowImplicitIdentities", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <p>Expression: <mathInput name="expr" /></p>
  <p><matchesPattern name="m" pattern="ax+a" parameters="a" allowImplicitIdentities>$expr</matchesPattern></p>
  <p>Matches: <mathList extend="$m.patternMatches" name="mm" /></p>
  <p><matchesPattern name="m2" pattern="ax+b" parameters="a b" allowImplicitIdentities>$expr</matchesPattern></p>
  <p>Matches: <mathList extend="$m2.patternMatches" name="mm2" /></p>
  `,
        });

        await checkMatches({
            core,
            resolvePathToNodeIdx,
            numMatches: 1,
            expected: {
                "x+1": ["1"],
                "3x+3": ["3"],
                "3x+4": false,
                "3x": false,
            },
        });

        // `m2` still matches the `3x` left in the input above, with `b` bound
        // to the missing constant term. A binding of `0` is a match, not the
        // blank an unbound parameter reports.
        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("m2")].stateValues.value,
        ).to.be.true;
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("mm2[2]")].stateValues
                    .latex,
            ),
        ).eq("0");
    });

    it("parameters honor allowPermutations", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <p>Expression: <mathInput name="expr" /></p>
  <p><matchesPattern name="m" pattern="ax+a" parameters="a">$expr</matchesPattern></p>
  <p>Matches: <mathList extend="$m.patternMatches" name="mm" /></p>
  <p><matchesPattern name="noperm" pattern="ax+a" parameters="a" allowPermutations="false">$expr</matchesPattern></p>
  `,
        });

        await checkMatches({
            core,
            resolvePathToNodeIdx,
            numMatches: 1,
            expected: { "3+3x": ["3"] },
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("noperm")].stateValues
                .value,
        ).to.be.false;
    });

    it("parameters honor excludeMatches", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <p>Expression: <mathInput name="expr" /></p>
  <p><matchesPattern name="m" pattern="ax+a" parameters="a" excludeMatches="q">$expr</matchesPattern></p>
  <p>Matches: <mathList extend="$m.patternMatches" name="mm" /></p>
  `,
        });

        await checkMatches({
            core,
            resolvePathToNodeIdx,
            numMatches: 1,
            expected: { "3x+3": ["3"], "qx+q": false },
        });
    });

    it("a parameter missing from the pattern keeps its place and warns", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <p>Expression: <mathInput name="expr" /></p>
  <p><matchesPattern name="m" pattern="ax" parameters="a b">$expr</matchesPattern></p>
  <p>Matches: <mathList extend="$m.patternMatches" name="mm" /></p>
  `,
        });

        // `b` stays in the list so that `patternMatches` keeps lining up with
        // the order the parameters were named in.
        await checkMatches({
            core,
            resolvePathToNodeIdx,
            numMatches: 2,
            expected: { "3x": ["3", "＿"] },
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("m")].stateValues
                .numMatches,
        ).eq(2);

        const { warnings } = getDiagnosticsByType(core);
        expect(warnings.length).eq(1);
        expect(warnings[0].code).eq("doenet-w0118");
        expect(warnings[0].args).eqls({ parameters: ["b"] });
        expect(warnings[0].message).eq(
            "`<matchesPattern>`: the parameter b does not occur in the pattern, so it will always match a blank.",
        );
    });

    it("a parameter that is not a variable is ignored with a warning", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <p>Expression: <mathInput name="expr" /></p>
  <p><matchesPattern name="m" pattern="yx" parameters="2 x^2 y">$expr</matchesPattern></p>
  <p>Matches: <mathList extend="$m.patternMatches" name="mm" /></p>
  `,
        });

        await checkMatches({
            core,
            resolvePathToNodeIdx,
            numMatches: 1,
            expected: { "3x": ["3"], "3z": false },
        });

        const { warnings } = getDiagnosticsByType(core);
        expect(warnings.length).eq(1);
        expect(warnings[0].code).eq("doenet-w0117");
        expect(warnings[0].args).eqls({ parameters: ["2", "x^2"] });
        expect(warnings[0].message).eq(
            "`<matchesPattern>`: ignoring 2 and x^2 in `parameters`, as a parameter must be a variable.",
        );
    });

    it("a blank listed as a parameter is ignored with a warning", async () => {
        const { core } = await createTestCore({
            doenetML: `
  <matchesPattern name="m" pattern="()x" parameters="()">3x</matchesPattern>
  `,
        });

        const { warnings } = getDiagnosticsByType(core);
        expect(warnings.length).eq(1);
        expect(warnings[0].code).eq("doenet-w0117");
        expect(warnings[0].args).eqls({ parameters: ["＿"] });
    });

    it("the same rejected parameter listed twice is reported once", async () => {
        const { core } = await createTestCore({
            doenetML: `
  <matchesPattern name="m" pattern="ax" parameters="2 2 x^2 x^2">3x</matchesPattern>
  `,
        });

        const { warnings } = getDiagnosticsByType(core);
        expect(warnings.length).eq(1);
        expect(warnings[0].args).eqls({ parameters: ["2", "x^2"] });
    });

    it("a parameter is renamed away from a variable already in the pattern", async () => {
        // A placeholder must not be spelled like something the pattern
        // matches literally, so the generated name skips `AAA`.
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <math name="pat" splitSymbols="false">AAA b + b</math>
  <p>Expression: <mathInput name="expr" splitSymbols="false" /></p>
  <p><matchesPattern name="m" pattern="$pat" parameters="b">$expr</matchesPattern></p>
  <p>Matches: <mathList extend="$m.patternMatches" name="mm" /></p>
  `,
        });

        await checkMatches({
            core,
            resolvePathToNodeIdx,
            numMatches: 1,
            expected: { "AAA 3 + 3": ["3"], "AAA 3 + 4": false },
        });
    });

    it("changing parameters at runtime recomputes the match", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <p>Parameters: <mathInput name="params" prefill="a" /></p>
  <p>Expression: <mathInput name="expr" /></p>
  <p><matchesPattern name="m" pattern="ax+a" parameters="$params">$expr</matchesPattern></p>
  <p>Matches: <mathList extend="$m.patternMatches" name="mm" /></p>
  `,
        });

        await checkMatches({
            core,
            resolvePathToNodeIdx,
            numMatches: 1,
            expected: { "3x+3": ["3"], "3x+4": false },
        });
        expect(getDiagnosticsByType(core).warnings.length).eq(0);

        // `b` does not occur in the pattern, so nothing is a placeholder any
        // more and only the literal `ax+a` matches.
        await updateMathInputValue({
            latex: "b",
            componentIdx: await resolvePathToNodeIdx("params"),
            core,
        });

        await checkMatches({
            core,
            resolvePathToNodeIdx,
            numMatches: 1,
            expected: { "3x+3": false, "ax+a": ["＿"] },
        });

        let warnings = getDiagnosticsByType(core).warnings;
        expect(warnings.length).eq(1);
        expect(warnings[0].code).eq("doenet-w0118");

        // Returning to `a` and back to `b` recomputes both ways without
        // raising the same warning a second time.
        await updateMathInputValue({
            latex: "a",
            componentIdx: await resolvePathToNodeIdx("params"),
            core,
        });
        await checkMatches({
            core,
            resolvePathToNodeIdx,
            numMatches: 1,
            expected: { "3x+3": ["3"] },
        });

        await updateMathInputValue({
            latex: "b",
            componentIdx: await resolvePathToNodeIdx("params"),
            core,
        });
        await checkMatches({
            core,
            resolvePathToNodeIdx,
            numMatches: 1,
            expected: { "3x+3": false },
        });
        expect(getDiagnosticsByType(core).warnings.length).eq(1);
    });

    it("changing the pattern at runtime recomputes the match", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <p>Pattern: <mathInput name="pat" prefill="ax+a" /></p>
  <p>Expression: <mathInput name="expr" /></p>
  <p><matchesPattern name="m" pattern="$pat" parameters="a">$expr</matchesPattern></p>
  <p>Matches: <mathList extend="$m.patternMatches" name="mm" /></p>
  `,
        });

        await checkMatches({
            core,
            resolvePathToNodeIdx,
            numMatches: 1,
            expected: { "3x+3": ["3"], "3x+4": false },
        });
        expect(getDiagnosticsByType(core).warnings.length).eq(0);

        await updateMathInputValue({
            latex: "ax^2+a",
            componentIdx: await resolvePathToNodeIdx("pat"),
            core,
        });

        await checkMatches({
            core,
            resolvePathToNodeIdx,
            numMatches: 1,
            expected: { "3x+3": false, "3x^2+3": ["3"] },
        });

        // A pattern that no longer mentions `a` warns; going back clears the
        // way for a match again.
        await updateMathInputValue({
            latex: "bx+b",
            componentIdx: await resolvePathToNodeIdx("pat"),
            core,
        });
        await checkMatches({
            core,
            resolvePathToNodeIdx,
            numMatches: 1,
            expected: { "3x+3": false },
        });
        expect(getDiagnosticsByType(core).warnings.length).eq(1);
        expect(getDiagnosticsByType(core).warnings[0].code).eq("doenet-w0118");

        await updateMathInputValue({
            latex: "ax+a",
            componentIdx: await resolvePathToNodeIdx("pat"),
            core,
        });
        await checkMatches({
            core,
            resolvePathToNodeIdx,
            numMatches: 1,
            expected: { "3x+3": ["3"] },
        });
    });
});
