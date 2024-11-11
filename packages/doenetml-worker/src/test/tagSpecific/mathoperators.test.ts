import { describe, expect, it, vi } from "vitest";
import { createTestCore, returnAllStateVariables } from "../utils/test-core";
import me from "math-expressions";
import { movePoint, updateMathInputValue } from "../utils/actions";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

describe("Math operator tests", async () => {
    it("sum", async () => {
        let core = await createTestCore({
            doenetML: `
      <sum name="numbers"><number>3</number><number>17</number><number>5-4</number></sum>
      <sum name="numbersForceSymbolic" forceSymbolic><number>3</number><number>17</number><number>5-4</number></sum>
      <sum name="numbersForceSymbolicSimplify" forceSymbolic simplify><number>3</number><number>17</number><number>5-4</number></sum>
      <sum name="numbersWithNumberMath"><math>3</math><number>17</number><number>5-4</number></sum>
      <sum name="numbersWithNumberMathForceSymbolic" forceSymbolic><math>3</math><number>17</number><number>5-4</number></sum>
      <sum name="numbersWithNumberMathForceSymbolicSimplify" forceSymbolic simplify><math>3</math><number>17</number><number>5-4</number></sum>
      <sum name="numbersWithNumericMath"><math>6/2</math><number>17</number><number>5-4</number></sum>
      <sum name="numbersWithNumericMathSimplify" simplify><math>6/2</math><number>17</number><number>5-4</number></sum>
      <sum name="numbersWithNumericMathForceNumeric" forceNumeric><math>6/2</math><number>17</number><number>5-4</number></sum>
      <sum name="withNumberSum"><math>3</math><sum><number>17</number><number>5-4</number></sum></sum>
      <sum name="vars"><math>x</math><math>x+y</math><math>x+y+z</math></sum>
      <sum name="varsSimplify" simplify><math>x</math><math>x+y</math><math>x+y+z</math></sum>
      <sum name="varsForcedNumeric" forceNumeric><math>x</math><math>x+y</math><math>x+y+z</math></sum>
      $numbers{name="numbersb"}
      $vars{name="varsb"}
      `,
        });

        let stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/numbers"].stateValues.value.tree).eq(21);
        expect(stateVariables["/numbers"].stateValues.isNumericOperator).eq(
            true,
        );
        expect(stateVariables["/numbers"].stateValues.isNumber).eq(true);
        expect(
            stateVariables["/numbersForceSymbolic"].stateValues.value.tree,
        ).eqls(["+", 3, 17, 1]);
        expect(
            stateVariables["/numbersForceSymbolic"].stateValues
                .isNumericOperator,
        ).eq(false);
        expect(stateVariables["/numbersForceSymbolic"].stateValues.isNumber).eq(
            false,
        );
        expect(
            stateVariables["/numbersForceSymbolicSimplify"].stateValues.value
                .tree,
        ).eq(21);
        expect(
            stateVariables["/numbersForceSymbolicSimplify"].stateValues
                .isNumericOperator,
        ).eq(false);
        expect(
            stateVariables["/numbersForceSymbolicSimplify"].stateValues
                .isNumber,
        ).eq(true);
        expect(
            stateVariables["/numbersWithNumberMath"].stateValues.value.tree,
        ).eq(21);
        expect(
            stateVariables["/numbersWithNumberMath"].stateValues
                .isNumericOperator,
        ).eq(true);
        expect(
            stateVariables["/numbersWithNumberMath"].stateValues.isNumber,
        ).eq(true);
        expect(
            stateVariables["/numbersWithNumberMathForceSymbolic"].stateValues
                .value.tree,
        ).eqls(["+", 3, 17, 1]);
        expect(
            stateVariables["/numbersWithNumberMathForceSymbolic"].stateValues
                .isNumericOperator,
        ).eq(false);
        expect(
            stateVariables["/numbersWithNumberMathForceSymbolic"].stateValues
                .isNumber,
        ).eq(false);
        expect(
            stateVariables["/numbersWithNumberMathForceSymbolicSimplify"]
                .stateValues.value.tree,
        ).eq(21);
        expect(
            stateVariables["/numbersWithNumberMathForceSymbolicSimplify"]
                .stateValues.isNumericOperator,
        ).eq(false);
        expect(
            stateVariables["/numbersWithNumberMathForceSymbolicSimplify"]
                .stateValues.isNumber,
        ).eq(true);
        expect(
            stateVariables["/numbersWithNumericMath"].stateValues.value.tree,
        ).eqls(["+", ["/", 6, 2], 17, 1]);
        expect(
            stateVariables["/numbersWithNumericMath"].stateValues
                .isNumericOperator,
        ).eq(false);
        expect(
            stateVariables["/numbersWithNumericMath"].stateValues.isNumber,
        ).eq(false);
        expect(
            stateVariables["/numbersWithNumericMathSimplify"].stateValues.value
                .tree,
        ).eq(21);
        expect(
            stateVariables["/numbersWithNumericMathSimplify"].stateValues
                .isNumericOperator,
        ).eq(false);
        expect(
            stateVariables["/numbersWithNumericMathSimplify"].stateValues
                .isNumber,
        ).eq(true);
        expect(
            stateVariables["/numbersWithNumericMathForceNumeric"].stateValues
                .value.tree,
        ).eq(21);
        expect(
            stateVariables["/numbersWithNumericMathForceNumeric"].stateValues
                .isNumericOperator,
        ).eq(true);
        expect(
            stateVariables["/numbersWithNumericMathForceNumeric"].stateValues
                .isNumber,
        ).eq(true);
        expect(stateVariables["/withNumberSum"].stateValues.value.tree).eq(21);
        expect(
            stateVariables["/withNumberSum"].stateValues.isNumericOperator,
        ).eq(true);
        expect(stateVariables["/withNumberSum"].stateValues.isNumber).eq(true);
        expect(stateVariables["/vars"].stateValues.value.tree).eqls([
            "+",
            "x",
            "x",
            "y",
            "x",
            "y",
            "z",
        ]);
        expect(stateVariables["/vars"].stateValues.isNumericOperator).eq(false);
        expect(stateVariables["/vars"].stateValues.isNumber).eq(false);
        expect(stateVariables["/varsSimplify"].stateValues.value.tree).eqls([
            "+",
            ["*", 3, "x"],
            ["*", 2, "y"],
            "z",
        ]);
        expect(
            stateVariables["/varsSimplify"].stateValues.isNumericOperator,
        ).eq(false);
        expect(stateVariables["/varsSimplify"].stateValues.isNumber).eq(false);
        expect(
            stateVariables["/varsForcedNumeric"].stateValues.value.tree,
        ).eqls(NaN);
        expect(
            stateVariables["/varsForcedNumeric"].stateValues.isNumericOperator,
        ).eq(true);
        expect(stateVariables["/varsForcedNumeric"].stateValues.isNumber).eq(
            false,
        );
        expect(stateVariables["/numbersb"].stateValues.value.tree).eq(21);
        expect(stateVariables["/numbersb"].stateValues.isNumericOperator).eq(
            true,
        );
        expect(stateVariables["/numbersb"].stateValues.isNumber).eq(true);
        expect(stateVariables["/varsb"].stateValues.value.tree).eqls([
            "+",
            "x",
            "x",
            "y",
            "x",
            "y",
            "z",
        ]);
        expect(stateVariables["/varsb"].stateValues.isNumericOperator).eq(
            false,
        );
        expect(stateVariables["/varsb"].stateValues.isNumber).eq(false);
    });

    it("sum with sugar", async () => {
        let core = await createTestCore({
            doenetML: `
      <number name="a">3</number>
      <number name="b">17</number>
      <number name="c">5-4</number>
      <math name="aNumberMath">3</math>
      <math name="aNumericMath">6/2</math>
      <sum name="numbers"><number>3</number><number>17</number><number>5-4</number></sum>
      <sum name="numbersAsString">3 17 1</sum>
      <sum name="numbersAsStringForceSymbolic" forceSymbolic>3 17 1</sum>
      <sum name="numbersAsStringForceSymbolicSimplify" forceSymbolic simplify>3 17 1</sum>
      <sum name="numericAsString">6/2 17 5-4</sum>
      <sum name="numericAsStringSimplify" simplify>6/2 17 5-4</sum>
      <sum name="numericAsStringForceNumeric" forceNumeric>6/2 17 5-4</sum>
      <sum name="numbersAsMacros">$a$b$c</sum>
      <sum name="numbersAsMacrosForceSymbolic" forceSymbolic>$a$b$c</sum>
      <sum name="numbersAsMacrosForceSymbolicSimplify" forceSymbolic simplify>$a$b$c</sum>
      <sum name="numbersAsMacros2">$a $b $c</sum>
      <sum name="withNumberMathMacro">$aNumberMath$b$c</sum>
      <sum name="withNumberMathMacroForceSymbolic" forceSymbolic>$aNumberMath$b$c</sum>
      <sum name="withNumberMathMacroForceSymbolicSimplify" forceSymbolic simplify>$aNumberMath$b$c</sum>
      <sum name="withNumericMathMacro">$aNumericMath$b$c</sum>
      <sum name="withNumericMathMacroSimplify" simplify>$aNumericMath$b$c</sum>
      <sum name="withNumericMathMacroForceNumeric" forceNumeric>$aNumericMath$b$c</sum>
      <sum name="vars"><math>x</math><math>x+y</math><math>x+y+z</math></sum>
      <sum name="varsAsString">x x+y x+y+z</sum>
      <sum name="varsAsStringSimplify" simplify>x x+y x+y+z</sum>
      <sum name="varsAsStringForceNumeric" forceNumeric>x x+y x+y+z</sum>
      `,
        });

        let stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/numbers"].stateValues.value.tree).eq(21);
        expect(stateVariables["/numbers"].stateValues.isNumericOperator).eq(
            true,
        );
        expect(stateVariables["/numbers"].stateValues.isNumber).eq(true);
        expect(stateVariables["/numbersAsString"].stateValues.value.tree).eq(
            21,
        );
        expect(
            stateVariables["/numbersAsString"].stateValues.isNumericOperator,
        ).eq(true);
        expect(stateVariables["/numbersAsString"].stateValues.isNumber).eq(
            true,
        );
        expect(
            stateVariables["/numbersAsStringForceSymbolic"].stateValues.value
                .tree,
        ).eqls(["+", 3, 17, 1]);
        expect(
            stateVariables["/numbersAsStringForceSymbolic"].stateValues
                .isNumericOperator,
        ).eq(false);
        expect(
            stateVariables["/numbersAsStringForceSymbolic"].stateValues
                .isNumber,
        ).eq(false);
        expect(
            stateVariables["/numbersAsStringForceSymbolicSimplify"].stateValues
                .value.tree,
        ).eq(21);
        expect(
            stateVariables["/numbersAsStringForceSymbolicSimplify"].stateValues
                .isNumericOperator,
        ).eq(false);
        expect(
            stateVariables["/numbersAsStringForceSymbolicSimplify"].stateValues
                .isNumber,
        ).eq(true);
        expect(stateVariables["/numericAsString"].stateValues.value.tree).eqls([
            "+",
            ["/", 6, 2],
            17,
            5,
            -4,
        ]);
        expect(
            stateVariables["/numericAsString"].stateValues.isNumericOperator,
        ).eq(false);
        expect(stateVariables["/numericAsString"].stateValues.isNumber).eq(
            false,
        );
        expect(
            stateVariables["/numericAsStringSimplify"].stateValues.value.tree,
        ).eq(21);
        expect(
            stateVariables["/numericAsStringSimplify"].stateValues
                .isNumericOperator,
        ).eq(false);
        expect(
            stateVariables["/numericAsStringSimplify"].stateValues.isNumber,
        ).eq(true);
        expect(
            stateVariables["/numericAsStringForceNumeric"].stateValues.value
                .tree,
        ).eq(21);
        expect(
            stateVariables["/numericAsStringForceNumeric"].stateValues
                .isNumericOperator,
        ).eq(true);
        expect(
            stateVariables["/numericAsStringForceNumeric"].stateValues.isNumber,
        ).eq(true);
        expect(stateVariables["/numbersAsMacros"].stateValues.value.tree).eq(
            21,
        );
        expect(
            stateVariables["/numbersAsMacros"].stateValues.isNumericOperator,
        ).eq(true);
        expect(stateVariables["/numbersAsMacros"].stateValues.isNumber).eq(
            true,
        );
        expect(
            stateVariables["/numbersAsMacrosForceSymbolic"].stateValues.value
                .tree,
        ).eqls(["+", 3, 17, 1]);
        expect(
            stateVariables["/numbersAsMacrosForceSymbolic"].stateValues
                .isNumericOperator,
        ).eq(false);
        expect(
            stateVariables["/numbersAsMacrosForceSymbolic"].stateValues
                .isNumber,
        ).eq(false);
        expect(
            stateVariables["/numbersAsMacrosForceSymbolicSimplify"].stateValues
                .value.tree,
        ).eq(21);
        expect(
            stateVariables["/numbersAsMacrosForceSymbolicSimplify"].stateValues
                .isNumericOperator,
        ).eq(false);
        expect(
            stateVariables["/numbersAsMacrosForceSymbolicSimplify"].stateValues
                .isNumber,
        ).eq(true);
        expect(stateVariables["/numbersAsMacros2"].stateValues.value.tree).eq(
            21,
        );
        expect(
            stateVariables["/numbersAsMacros2"].stateValues.isNumericOperator,
        ).eq(true);
        expect(stateVariables["/numbersAsMacros2"].stateValues.isNumber).eq(
            true,
        );
        expect(
            stateVariables["/withNumberMathMacro"].stateValues.value.tree,
        ).eq(21);
        expect(
            stateVariables["/withNumberMathMacro"].stateValues
                .isNumericOperator,
        ).eq(true);
        expect(stateVariables["/withNumberMathMacro"].stateValues.isNumber).eq(
            true,
        );
        expect(
            stateVariables["/withNumberMathMacroForceSymbolic"].stateValues
                .value.tree,
        ).eqls(["+", 3, 17, 1]);
        expect(
            stateVariables["/withNumberMathMacroForceSymbolic"].stateValues
                .isNumericOperator,
        ).eq(false);
        expect(
            stateVariables["/withNumberMathMacroForceSymbolic"].stateValues
                .isNumber,
        ).eq(false);
        expect(
            stateVariables["/withNumberMathMacroForceSymbolicSimplify"]
                .stateValues.value.tree,
        ).eq(21);
        expect(
            stateVariables["/withNumberMathMacroForceSymbolicSimplify"]
                .stateValues.isNumericOperator,
        ).eq(false);
        expect(
            stateVariables["/withNumberMathMacroForceSymbolicSimplify"]
                .stateValues.isNumber,
        ).eq(true);
        expect(
            stateVariables["/withNumericMathMacro"].stateValues.value.tree,
        ).eqls(["+", ["/", 6, 2], 17, 1]);
        expect(
            stateVariables["/withNumericMathMacro"].stateValues
                .isNumericOperator,
        ).eq(false);
        expect(stateVariables["/withNumericMathMacro"].stateValues.isNumber).eq(
            false,
        );
        expect(
            stateVariables["/withNumericMathMacroSimplify"].stateValues.value
                .tree,
        ).eq(21);
        expect(
            stateVariables["/withNumericMathMacroSimplify"].stateValues
                .isNumericOperator,
        ).eq(false);
        expect(
            stateVariables["/withNumericMathMacroSimplify"].stateValues
                .isNumber,
        ).eq(true);
        expect(
            stateVariables["/withNumericMathMacroForceNumeric"].stateValues
                .value.tree,
        ).eq(21);
        expect(
            stateVariables["/withNumericMathMacroForceNumeric"].stateValues
                .isNumericOperator,
        ).eq(true);
        expect(
            stateVariables["/withNumericMathMacroForceNumeric"].stateValues
                .isNumber,
        ).eq(true);
        expect(stateVariables["/vars"].stateValues.value.tree).eqls([
            "+",
            "x",
            "x",
            "y",
            "x",
            "y",
            "z",
        ]);
        expect(stateVariables["/vars"].stateValues.isNumericOperator).eq(false);
        expect(stateVariables["/vars"].stateValues.isNumber).eq(false);
        expect(stateVariables["/varsAsString"].stateValues.value.tree).eqls([
            "+",
            "x",
            "x",
            "y",
            "x",
            "y",
            "z",
        ]);
        expect(
            stateVariables["/varsAsString"].stateValues.isNumericOperator,
        ).eq(false);
        expect(stateVariables["/varsAsString"].stateValues.isNumber).eq(false);
        expect(
            stateVariables["/varsAsStringSimplify"].stateValues.value.tree,
        ).eqls(["+", ["*", 3, "x"], ["*", 2, "y"], "z"]);
        expect(
            stateVariables["/varsAsStringSimplify"].stateValues
                .isNumericOperator,
        ).eq(false);
        expect(stateVariables["/varsAsStringSimplify"].stateValues.isNumber).eq(
            false,
        );
        expect(
            stateVariables["/varsAsStringForceNumeric"].stateValues.value.tree,
        ).eqls(NaN);
        expect(
            stateVariables["/varsAsStringForceNumeric"].stateValues
                .isNumericOperator,
        ).eq(true);
        expect(
            stateVariables["/varsAsStringForceNumeric"].stateValues.isNumber,
        ).eq(false);
    });

    it("sum as math expression", async () => {
        let core = await createTestCore({
            doenetML: `
      <group name="nums" asList>
        <number name="a">3</number>
        <number name="b">17</number>
        <number name="c">5-4</number>
      </group>
      <math name="numberString">sum(3,17,5-4)</math>
      <math name="numberStringSimplify" simplify>sum(3,17,5-4)</math>
      <math name="numberStringProduct">sum(3 17 5-4)</math>
      <math name="numberStringProductSimplify" simplify>sum(3 17 5-4)</math>
      <math name="numberComponentsCommas">
        sum(<number>3</number>,<number>17</number>,<number>5-4</number>)
      </math>
      <math name="numberComponentsCommasSimplify" simplify>
      sum(<number>3</number>,<number>17</number>,<number>5-4</number>)
      </math>
      <math name="numberComponentsProduct">
        sum(<number>3</number><number>17</number><number>5-4</number>)
      </math>
      <math name="numberComponentsProductSimplify" simplify>
        sum(<number>3</number><number>17</number><number>5-4</number>)
      </math>
      <math name="macrosCommas">
        sum($a,$b,$c)
      </math>
      <math name="macrosCommasSimplify" simplify>
        sum($a,$b,$c)
      </math>
      <math name="macrosProduct">
        sum($a$b$c)
      </math>
      <math name="macrosProductSimplify" simplify>
        sum($a$b$c)
      </math>
      <math name="group">
        sum($nums)
      </math>
      <math name="groupPlusGroup">
        sum($nums) + sum($nums)
      </math>
      <math name="groupSimplify" simplify>
        sum($nums)
      </math>
      <math name="groupPlus">
        sum($nums, $a, $b, $c)
      </math>
      <math name="groupPlusSimplify" simplify>
        sum($nums, $a, $b, $c)
      </math>
      <math name="groupPlus2">
        sum($a, $b, $c, $nums)
      </math>
      <math name="groupPlus2Simplify" simplify>
        sum($a, $b, $c, $nums)
      </math>
      <math name="groupPlus3">
        sum($a, $b, $nums, $c)
      </math>
      <math name="groupPlus3Simplify" simplify>
        sum($a, $b, $nums, $c)
      </math>
      `,
        });

        let stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/numberString"].stateValues.value.tree).eqls([
            "apply",
            "sum",
            ["tuple", 3, 17, ["+", 5, -4]],
        ]);
        expect(stateVariables["/numberString"].stateValues.isNumber).eq(false);
        expect(
            stateVariables["/numberStringSimplify"].stateValues.value.tree,
        ).eq(21);
        expect(stateVariables["/numberStringSimplify"].stateValues.isNumber).eq(
            true,
        );
        expect(
            stateVariables["/numberStringProduct"].stateValues.value.tree,
        ).eqls(["apply", "sum", ["+", ["*", 3, 17, 5], -4]]);
        expect(stateVariables["/numberStringProduct"].stateValues.isNumber).eq(
            false,
        );
        expect(
            stateVariables["/numberStringProductSimplify"].stateValues.value
                .tree,
        ).eq(251);
        expect(
            stateVariables["/numberStringProductSimplify"].stateValues.isNumber,
        ).eq(true);

        expect(
            stateVariables["/numberComponentsCommas"].stateValues.value.tree,
        ).eqls(["apply", "sum", ["tuple", 3, 17, 1]]);
        expect(
            await stateVariables["/numberComponentsCommas"].stateValues
                .isNumber,
        ).eq(false);
        expect(
            stateVariables["/numberComponentsCommasSimplify"].stateValues.value
                .tree,
        ).eq(21);
        expect(
            stateVariables["/numberComponentsCommasSimplify"].stateValues
                .isNumber,
        ).eq(true);
        expect(
            stateVariables["/numberComponentsProduct"].stateValues.value.tree,
        ).eqls(["apply", "sum", ["*", 3, 17, 1]]);
        expect(
            stateVariables["/numberComponentsProduct"].stateValues.isNumber,
        ).eq(false);
        expect(
            stateVariables["/numberComponentsProductSimplify"].stateValues.value
                .tree,
        ).eq(51);
        expect(
            stateVariables["/numberComponentsProductSimplify"].stateValues
                .isNumber,
        ).eq(true);

        expect(stateVariables["/macrosCommas"].stateValues.value.tree).eqls([
            "apply",
            "sum",
            ["tuple", 3, 17, 1],
        ]);
        expect(stateVariables["/macrosCommas"].stateValues.isNumber).eq(false);
        expect(
            stateVariables["/macrosCommasSimplify"].stateValues.value.tree,
        ).eq(21);
        expect(stateVariables["/macrosCommasSimplify"].stateValues.isNumber).eq(
            true,
        );
        expect(stateVariables["/macrosProduct"].stateValues.value.tree).eqls([
            "apply",
            "sum",
            ["*", 3, 17, 1],
        ]);
        expect(stateVariables["/macrosProduct"].stateValues.isNumber).eq(false);
        expect(
            stateVariables["/macrosProductSimplify"].stateValues.value.tree,
        ).eq(51);
        expect(
            stateVariables["/macrosProductSimplify"].stateValues.isNumber,
        ).eq(true);

        expect(stateVariables["/group"].stateValues.value.tree).eqls([
            "apply",
            "sum",
            ["tuple", 3, 17, 1],
        ]);
        expect(stateVariables["/group"].stateValues.isNumber).eq(false);
        expect(stateVariables["/groupPlusGroup"].stateValues.value.tree).eqls([
            "+",
            ["apply", "sum", ["tuple", 3, 17, 1]],
            ["apply", "sum", ["tuple", 3, 17, 1]],
        ]);
        expect(stateVariables["/groupPlusGroup"].stateValues.isNumber).eq(
            false,
        );
        expect(stateVariables["/groupSimplify"].stateValues.value.tree).eq(21);
        expect(stateVariables["/groupSimplify"].stateValues.isNumber).eq(true);

        expect(stateVariables["/groupPlus"].stateValues.value.tree).eqls([
            "apply",
            "sum",
            ["tuple", 3, 17, 1, 3, 17, 1],
        ]);
        expect(stateVariables["/groupPlus"].stateValues.isNumber).eq(false);
        expect(stateVariables["/groupPlusSimplify"].stateValues.value.tree).eq(
            42,
        );
        expect(stateVariables["/groupPlusSimplify"].stateValues.isNumber).eq(
            true,
        );

        expect(stateVariables["/groupPlus2"].stateValues.value.tree).eqls([
            "apply",
            "sum",
            ["tuple", 3, 17, 1, 3, 17, 1],
        ]);
        expect(stateVariables["/groupPlus2"].stateValues.isNumber).eq(false);
        expect(stateVariables["/groupPlus2Simplify"].stateValues.value.tree).eq(
            42,
        );
        expect(stateVariables["/groupPlus2Simplify"].stateValues.isNumber).eq(
            true,
        );

        expect(stateVariables["/groupPlus3"].stateValues.value.tree).eqls([
            "apply",
            "sum",
            ["tuple", 3, 17, 3, 17, 1, 1],
        ]);
        expect(stateVariables["/groupPlus3"].stateValues.isNumber).eq(false);
        expect(stateVariables["/groupPlus3Simplify"].stateValues.value.tree).eq(
            42,
        );
        expect(stateVariables["/groupPlus3Simplify"].stateValues.isNumber).eq(
            true,
        );
    });

    it("sum with lists", async () => {
        let core = await createTestCore({
            doenetML: `
      <sum name="numbers"><numberList>3 17 5-4</numberList></sum>
      <sum name="numbersForceSymbolic" forceSymbolic><numberList>3 17 5-4</numberList></sum>
      <sum name="numbersForceSymbolicSimplify" forceSymbolic simplify><numberList>3 17 5-4</numberList></sum>
      <sum name="numbersWithNumberMath"><math>3</math><numberList>17 5-4</numberList></sum>
      <sum name="numbersWithNumberMathForceSymbolic" forceSymbolic><math>3</math><numberList>17 5-4</numberList></sum>
      <sum name="numbersWithNumberMathForceSymbolicSimplify" forceSymbolic simplify><math>3</math><numberList>17 5-4</numberList></sum>
      <sum name="numbersWithNumericMath"><math>6/2</math><numberList>17 5-4</numberList></sum>
      <sum name="numbersWithNumericMathSimplify" simplify><math>6/2</math><numberList>17 5-4</numberList></sum>
      <sum name="numbersWithNumericMathForceNumeric" forceNumeric><math>6/2</math><numberList>17 5-4</numberList></sum>
      <sum name="withNumberSum"><math>3</math><sum><numberList>17 5-4</numberList></sum></sum>
      <sum name="vars"><mathList>x x+y x+y+z</mathList></sum>
      <sum name="varsSimplify" simplify><mathList>x x+y x+y+z</mathList></sum>
      <sum name="varsForcedNumeric" forceNumeric><mathList>x x+y x+y+z</mathList></sum>
      $numbers{name="numbersb"}
      $vars{name="varsb"}
      `,
        });

        let stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/numbers"].stateValues.value.tree).eq(21);
        expect(stateVariables["/numbers"].stateValues.isNumericOperator).eq(
            true,
        );
        expect(stateVariables["/numbers"].stateValues.isNumber).eq(true);
        expect(
            stateVariables["/numbersForceSymbolic"].stateValues.value.tree,
        ).eqls(["+", 3, 17, 1]);
        expect(
            stateVariables["/numbersForceSymbolic"].stateValues
                .isNumericOperator,
        ).eq(false);
        expect(stateVariables["/numbersForceSymbolic"].stateValues.isNumber).eq(
            false,
        );
        expect(
            stateVariables["/numbersForceSymbolicSimplify"].stateValues.value
                .tree,
        ).eq(21);
        expect(
            stateVariables["/numbersForceSymbolicSimplify"].stateValues
                .isNumericOperator,
        ).eq(false);
        expect(
            stateVariables["/numbersForceSymbolicSimplify"].stateValues
                .isNumber,
        ).eq(true);
        expect(
            stateVariables["/numbersWithNumberMath"].stateValues.value.tree,
        ).eq(21);
        expect(
            stateVariables["/numbersWithNumberMath"].stateValues
                .isNumericOperator,
        ).eq(true);
        expect(
            stateVariables["/numbersWithNumberMath"].stateValues.isNumber,
        ).eq(true);
        expect(
            stateVariables["/numbersWithNumberMathForceSymbolic"].stateValues
                .value.tree,
        ).eqls(["+", 3, 17, 1]);
        expect(
            stateVariables["/numbersWithNumberMathForceSymbolic"].stateValues
                .isNumericOperator,
        ).eq(false);
        expect(
            stateVariables["/numbersWithNumberMathForceSymbolic"].stateValues
                .isNumber,
        ).eq(false);
        expect(
            stateVariables["/numbersWithNumberMathForceSymbolicSimplify"]
                .stateValues.value.tree,
        ).eq(21);
        expect(
            stateVariables["/numbersWithNumberMathForceSymbolicSimplify"]
                .stateValues.isNumericOperator,
        ).eq(false);
        expect(
            stateVariables["/numbersWithNumberMathForceSymbolicSimplify"]
                .stateValues.isNumber,
        ).eq(true);
        expect(
            stateVariables["/numbersWithNumericMath"].stateValues.value.tree,
        ).eqls(["+", ["/", 6, 2], 17, 1]);
        expect(
            stateVariables["/numbersWithNumericMath"].stateValues
                .isNumericOperator,
        ).eq(false);
        expect(
            stateVariables["/numbersWithNumericMath"].stateValues.isNumber,
        ).eq(false);
        expect(
            stateVariables["/numbersWithNumericMathSimplify"].stateValues.value
                .tree,
        ).eq(21);
        expect(
            stateVariables["/numbersWithNumericMathSimplify"].stateValues
                .isNumericOperator,
        ).eq(false);
        expect(
            stateVariables["/numbersWithNumericMathSimplify"].stateValues
                .isNumber,
        ).eq(true);
        expect(
            stateVariables["/numbersWithNumericMathForceNumeric"].stateValues
                .value.tree,
        ).eq(21);
        expect(
            stateVariables["/numbersWithNumericMathForceNumeric"].stateValues
                .isNumericOperator,
        ).eq(true);
        expect(
            stateVariables["/numbersWithNumericMathForceNumeric"].stateValues
                .isNumber,
        ).eq(true);
        expect(stateVariables["/withNumberSum"].stateValues.value.tree).eq(21);
        expect(
            stateVariables["/withNumberSum"].stateValues.isNumericOperator,
        ).eq(true);
        expect(stateVariables["/withNumberSum"].stateValues.isNumber).eq(true);
        expect(stateVariables["/vars"].stateValues.value.tree).eqls([
            "+",
            "x",
            "x",
            "y",
            "x",
            "y",
            "z",
        ]);
        expect(stateVariables["/vars"].stateValues.isNumericOperator).eq(false);
        expect(stateVariables["/vars"].stateValues.isNumber).eq(false);
        expect(stateVariables["/varsSimplify"].stateValues.value.tree).eqls([
            "+",
            ["*", 3, "x"],
            ["*", 2, "y"],
            "z",
        ]);
        expect(
            stateVariables["/varsSimplify"].stateValues.isNumericOperator,
        ).eq(false);
        expect(stateVariables["/varsSimplify"].stateValues.isNumber).eq(false);
        expect(
            stateVariables["/varsForcedNumeric"].stateValues.value.tree,
        ).eqls(NaN);
        expect(
            stateVariables["/varsForcedNumeric"].stateValues.isNumericOperator,
        ).eq(true);
        expect(stateVariables["/varsForcedNumeric"].stateValues.isNumber).eq(
            false,
        );
        expect(stateVariables["/numbersb"].stateValues.value.tree).eq(21);
        expect(stateVariables["/numbersb"].stateValues.isNumericOperator).eq(
            true,
        );
        expect(stateVariables["/numbersb"].stateValues.isNumber).eq(true);
        expect(stateVariables["/varsb"].stateValues.value.tree).eqls([
            "+",
            "x",
            "x",
            "y",
            "x",
            "y",
            "z",
        ]);
        expect(stateVariables["/varsb"].stateValues.isNumericOperator).eq(
            false,
        );
        expect(stateVariables["/varsb"].stateValues.isNumber).eq(false);
    });

    it("product", async () => {
        let core = await createTestCore({
            doenetML: `
      <product name="numbers"><number>3</number><number>17</number><number>5-4</number></product>
      <product name="numbersForceSymbolic" forceSymbolic><number>3</number><number>17</number><number>5-4</number></product>
      <product name="numbersForceSymbolicSimplify" forceSymbolic simplify><number>3</number><number>17</number><number>5-4</number></product>
      <product name="numbersWithNumberMath"><math>3</math><number>17</number><number>5-4</number></product>
      <product name="numbersWithNumberMathForceSymbolic" forceSymbolic><math>3</math><number>17</number><number>5-4</number></product>
      <product name="numbersWithNumberMathForceSymbolicSimplify" forceSymbolic simplify><math>3</math><number>17</number><number>5-4</number></product>
      <product name="numbersWithNumericMath"><math>6/2</math><number>17</number><number>5-4</number></product>
      <product name="numbersWithNumericMathSimplify" simplify><math>6/2</math><number>17</number><number>5-4</number></product>
      <product name="numbersWithNumericMathForceNumeric" forceNumeric><math>6/2</math><number>17</number><number>5-4</number></product>
      <product name="withNumberProduct"><math>3</math><product><number>17</number><number>5-4</number></product></product>
      <product name="vars"><math>x</math><math>x+y</math><math>x+y+z</math></product>
      <product name="varsExpand" expand><math>x</math><math>x+y</math><math>x+y+z</math></product>
      <product name="varsForcedNumeric" forceNumeric><math>x</math><math>x+y</math><math>x+y+z</math></product>
      $numbers{name="numbersb"}
      $vars{name="varsb"}
      `,
        });

        let stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/numbers"].stateValues.value.tree).eq(51);
        expect(stateVariables["/numbers"].stateValues.isNumericOperator).eq(
            true,
        );
        expect(stateVariables["/numbers"].stateValues.isNumber).eq(true);
        expect(
            stateVariables["/numbersForceSymbolic"].stateValues.value.tree,
        ).eqls(["*", 3, 17, 1]);
        expect(
            stateVariables["/numbersForceSymbolic"].stateValues
                .isNumericOperator,
        ).eq(false);
        expect(stateVariables["/numbersForceSymbolic"].stateValues.isNumber).eq(
            false,
        );
        expect(
            stateVariables["/numbersForceSymbolicSimplify"].stateValues.value
                .tree,
        ).eq(51);
        expect(
            stateVariables["/numbersForceSymbolicSimplify"].stateValues
                .isNumericOperator,
        ).eq(false);
        expect(
            stateVariables["/numbersForceSymbolicSimplify"].stateValues
                .isNumber,
        ).eq(true);
        expect(
            stateVariables["/numbersWithNumberMath"].stateValues.value.tree,
        ).eq(51);
        expect(
            stateVariables["/numbersWithNumberMath"].stateValues
                .isNumericOperator,
        ).eq(true);
        expect(
            stateVariables["/numbersWithNumberMath"].stateValues.isNumber,
        ).eq(true);
        expect(
            stateVariables["/numbersWithNumberMathForceSymbolic"].stateValues
                .value.tree,
        ).eqls(["*", 3, 17, 1]);
        expect(
            stateVariables["/numbersWithNumberMathForceSymbolic"].stateValues
                .isNumericOperator,
        ).eq(false);
        expect(
            stateVariables["/numbersWithNumberMathForceSymbolic"].stateValues
                .isNumber,
        ).eq(false);
        expect(
            stateVariables["/numbersWithNumberMathForceSymbolicSimplify"]
                .stateValues.value.tree,
        ).eq(51);
        expect(
            stateVariables["/numbersWithNumberMathForceSymbolicSimplify"]
                .stateValues.isNumericOperator,
        ).eq(false);
        expect(
            stateVariables["/numbersWithNumberMathForceSymbolicSimplify"]
                .stateValues.isNumber,
        ).eq(true);
        expect(
            stateVariables["/numbersWithNumericMath"].stateValues.value.tree,
        ).eqls(["*", ["/", 6, 2], 17, 1]);
        expect(
            stateVariables["/numbersWithNumericMath"].stateValues
                .isNumericOperator,
        ).eq(false);
        expect(
            stateVariables["/numbersWithNumericMath"].stateValues.isNumber,
        ).eq(false);
        expect(
            stateVariables["/numbersWithNumericMathSimplify"].stateValues.value
                .tree,
        ).eq(51);
        expect(
            stateVariables["/numbersWithNumericMathSimplify"].stateValues
                .isNumericOperator,
        ).eq(false);
        expect(
            stateVariables["/numbersWithNumericMathSimplify"].stateValues
                .isNumber,
        ).eq(true);
        expect(
            stateVariables["/numbersWithNumericMathForceNumeric"].stateValues
                .value.tree,
        ).eq(51);
        expect(
            stateVariables["/numbersWithNumericMathForceNumeric"].stateValues
                .isNumericOperator,
        ).eq(true);
        expect(
            stateVariables["/numbersWithNumericMathForceNumeric"].stateValues
                .isNumber,
        ).eq(true);
        expect(stateVariables["/withNumberProduct"].stateValues.value.tree).eq(
            51,
        );
        expect(
            stateVariables["/withNumberProduct"].stateValues.isNumericOperator,
        ).eq(true);
        expect(stateVariables["/withNumberProduct"].stateValues.isNumber).eq(
            true,
        );
        expect(stateVariables["/vars"].stateValues.value.tree).eqls([
            "*",
            "x",
            ["+", "x", "y"],
            ["+", "x", "y", "z"],
        ]);
        expect(stateVariables["/vars"].stateValues.isNumericOperator).eq(false);
        expect(stateVariables["/vars"].stateValues.isNumber).eq(false);
        expect(stateVariables["/varsExpand"].stateValues.value.tree).eqls([
            "+",
            ["^", "x", 3],
            ["*", 2, "y", ["^", "x", 2]],
            ["*", "z", ["^", "x", 2]],
            ["*", "x", ["^", "y", 2]],
            ["*", "x", "y", "z"],
        ]);
        expect(stateVariables["/varsExpand"].stateValues.isNumericOperator).eq(
            false,
        );
        expect(stateVariables["/varsExpand"].stateValues.isNumber).eq(false);
        expect(
            stateVariables["/varsForcedNumeric"].stateValues.value.tree,
        ).eqls(NaN);
        expect(
            stateVariables["/varsForcedNumeric"].stateValues.isNumericOperator,
        ).eq(true);
        expect(stateVariables["/varsForcedNumeric"].stateValues.isNumber).eq(
            false,
        );
        expect(stateVariables["/numbersb"].stateValues.value.tree).eq(51);
        expect(stateVariables["/numbersb"].stateValues.isNumericOperator).eq(
            true,
        );
        expect(stateVariables["/numbersb"].stateValues.isNumber).eq(true);
        expect(stateVariables["/varsb"].stateValues.value.tree).eqls([
            "*",
            "x",
            ["+", "x", "y"],
            ["+", "x", "y", "z"],
        ]);
        expect(stateVariables["/varsb"].stateValues.isNumericOperator).eq(
            false,
        );
        expect(stateVariables["/varsb"].stateValues.isNumber).eq(false);
    });

    it("product with sugar", async () => {
        let core = await createTestCore({
            doenetML: `
      <number name="a">3</number>
      <number name="b">17</number>
      <number name="c">5-4</number>
      <math name="aNumberMath">3</math>
      <math name="aNumericMath">6/2</math>
      <product name="numbers"><number>3</number><number>17</number><number>5-4</number></product>
      <product name="numbersAsString">3 17 1</product>
      <product name="numbersAsStringForceSymbolic" forceSymbolic>3 17 1</product>
      <product name="numbersAsStringForceSymbolicSimplify" forceSymbolic simplify>3 17 1</product>
      <product name="numericAsString">6/2 17 5-4</product>
      <product name="numericAsStringSimplify" simplify>6/2 17 5-4</product>
      <product name="numericAsStringForceNumeric" forceNumeric>6/2 17 5-4</product>
      <product name="numbersAsMacros">$a$b$c</product>
      <product name="numbersAsMacrosForceSymbolic" forceSymbolic>$a$b$c</product>
      <product name="numbersAsMacrosForceSymbolicSimplify" forceSymbolic simplify>$a$b$c</product>
      <product name="numbersAsMacros2">$a $b $c</product>
      <product name="withNumberMathMacro">$aNumberMath$b$c</product>
      <product name="withNumberMathMacroForceSymbolic" forceSymbolic>$aNumberMath$b$c</product>
      <product name="withNumberMathMacroForceSymbolicSimplify" forceSymbolic simplify>$aNumberMath$b$c</product>
      <product name="withNumericMathMacro">$aNumericMath$b$c</product>
      <product name="withNumericMathMacroSimplify" simplify>$aNumericMath$b$c</product>
      <product name="withNumericMathMacroForceNumeric" forceNumeric>$aNumericMath$b$c</product>
      <product name="vars"><math>x</math><math>x+y</math><math>x+y+z</math></product>
      <product name="varsAsString">x x+y x+y+z</product>
      <product name="varsAsStringExpand" expand>x x+y x+y+z</product>
      <product name="varsAsStringForceNumeric" forceNumeric>x x+y x+y+z</product>
      `,
        });

        let stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/numbers"].stateValues.value.tree).eq(51);
        expect(stateVariables["/numbers"].stateValues.isNumericOperator).eq(
            true,
        );
        expect(stateVariables["/numbers"].stateValues.isNumber).eq(true);
        expect(stateVariables["/numbersAsString"].stateValues.value.tree).eq(
            51,
        );
        expect(
            stateVariables["/numbersAsString"].stateValues.isNumericOperator,
        ).eq(true);
        expect(stateVariables["/numbersAsString"].stateValues.isNumber).eq(
            true,
        );
        expect(
            stateVariables["/numbersAsStringForceSymbolic"].stateValues.value
                .tree,
        ).eqls(["*", 3, 17, 1]);
        expect(
            stateVariables["/numbersAsStringForceSymbolic"].stateValues
                .isNumericOperator,
        ).eq(false);
        expect(
            stateVariables["/numbersAsStringForceSymbolic"].stateValues
                .isNumber,
        ).eq(false);
        expect(
            stateVariables["/numbersAsStringForceSymbolicSimplify"].stateValues
                .value.tree,
        ).eq(51);
        expect(
            stateVariables["/numbersAsStringForceSymbolicSimplify"].stateValues
                .isNumericOperator,
        ).eq(false);
        expect(
            stateVariables["/numbersAsStringForceSymbolicSimplify"].stateValues
                .isNumber,
        ).eq(true);
        expect(stateVariables["/numericAsString"].stateValues.value.tree).eqls([
            "*",
            ["/", 6, 2],
            17,
            ["+", 5, -4],
        ]);
        expect(
            stateVariables["/numericAsString"].stateValues.isNumericOperator,
        ).eq(false);
        expect(stateVariables["/numericAsString"].stateValues.isNumber).eq(
            false,
        );
        expect(
            stateVariables["/numericAsStringSimplify"].stateValues.value.tree,
        ).eq(51);
        expect(
            stateVariables["/numericAsStringSimplify"].stateValues
                .isNumericOperator,
        ).eq(false);
        expect(
            stateVariables["/numericAsStringSimplify"].stateValues.isNumber,
        ).eq(true);
        expect(
            stateVariables["/numericAsStringForceNumeric"].stateValues.value
                .tree,
        ).eq(51);
        expect(
            stateVariables["/numericAsStringForceNumeric"].stateValues
                .isNumericOperator,
        ).eq(true);
        expect(
            stateVariables["/numericAsStringForceNumeric"].stateValues.isNumber,
        ).eq(true);
        expect(stateVariables["/numbersAsMacros"].stateValues.value.tree).eq(
            51,
        );
        expect(
            stateVariables["/numbersAsMacros"].stateValues.isNumericOperator,
        ).eq(true);
        expect(stateVariables["/numbersAsMacros"].stateValues.isNumber).eq(
            true,
        );
        expect(
            stateVariables["/numbersAsMacrosForceSymbolic"].stateValues.value
                .tree,
        ).eqls(["*", 3, 17, 1]);
        expect(
            stateVariables["/numbersAsMacrosForceSymbolic"].stateValues
                .isNumericOperator,
        ).eq(false);
        expect(
            stateVariables["/numbersAsMacrosForceSymbolic"].stateValues
                .isNumber,
        ).eq(false);
        expect(
            stateVariables["/numbersAsMacrosForceSymbolicSimplify"].stateValues
                .value.tree,
        ).eq(51);
        expect(
            stateVariables["/numbersAsMacrosForceSymbolicSimplify"].stateValues
                .isNumericOperator,
        ).eq(false);
        expect(
            stateVariables["/numbersAsMacrosForceSymbolicSimplify"].stateValues
                .isNumber,
        ).eq(true);
        expect(stateVariables["/numbersAsMacros2"].stateValues.value.tree).eq(
            51,
        );
        expect(
            stateVariables["/numbersAsMacros2"].stateValues.isNumericOperator,
        ).eq(true);
        expect(stateVariables["/numbersAsMacros2"].stateValues.isNumber).eq(
            true,
        );
        expect(
            stateVariables["/withNumberMathMacro"].stateValues.value.tree,
        ).eq(51);
        expect(
            stateVariables["/withNumberMathMacro"].stateValues
                .isNumericOperator,
        ).eq(true);
        expect(stateVariables["/withNumberMathMacro"].stateValues.isNumber).eq(
            true,
        );
        expect(
            stateVariables["/withNumberMathMacroForceSymbolic"].stateValues
                .value.tree,
        ).eqls(["*", 3, 17, 1]);
        expect(
            stateVariables["/withNumberMathMacroForceSymbolic"].stateValues
                .isNumericOperator,
        ).eq(false);
        expect(
            stateVariables["/withNumberMathMacroForceSymbolic"].stateValues
                .isNumber,
        ).eq(false);
        expect(
            stateVariables["/withNumberMathMacroForceSymbolicSimplify"]
                .stateValues.value.tree,
        ).eq(51);
        expect(
            stateVariables["/withNumberMathMacroForceSymbolicSimplify"]
                .stateValues.isNumericOperator,
        ).eq(false);
        expect(
            stateVariables["/withNumberMathMacroForceSymbolicSimplify"]
                .stateValues.isNumber,
        ).eq(true);
        expect(
            stateVariables["/withNumericMathMacro"].stateValues.value.tree,
        ).eqls(["*", ["/", 6, 2], 17, 1]);
        expect(
            stateVariables["/withNumericMathMacro"].stateValues
                .isNumericOperator,
        ).eq(false);
        expect(stateVariables["/withNumericMathMacro"].stateValues.isNumber).eq(
            false,
        );
        expect(
            stateVariables["/withNumericMathMacroSimplify"].stateValues.value
                .tree,
        ).eq(51);
        expect(
            stateVariables["/withNumericMathMacroSimplify"].stateValues
                .isNumericOperator,
        ).eq(false);
        expect(
            stateVariables["/withNumericMathMacroSimplify"].stateValues
                .isNumber,
        ).eq(true);
        expect(
            stateVariables["/withNumericMathMacroForceNumeric"].stateValues
                .value.tree,
        ).eq(51);
        expect(
            stateVariables["/withNumericMathMacroForceNumeric"].stateValues
                .isNumericOperator,
        ).eq(true);
        expect(
            stateVariables["/withNumericMathMacroForceNumeric"].stateValues
                .isNumber,
        ).eq(true);
        expect(stateVariables["/vars"].stateValues.value.tree).eqls([
            "*",
            "x",
            ["+", "x", "y"],
            ["+", "x", "y", "z"],
        ]);
        expect(stateVariables["/vars"].stateValues.isNumericOperator).eq(false);
        expect(stateVariables["/vars"].stateValues.isNumber).eq(false);
        expect(stateVariables["/varsAsString"].stateValues.value.tree).eqls([
            "*",
            "x",
            ["+", "x", "y"],
            ["+", "x", "y", "z"],
        ]);
        expect(
            stateVariables["/varsAsString"].stateValues.isNumericOperator,
        ).eq(false);
        expect(stateVariables["/varsAsString"].stateValues.isNumber).eq(false);
        expect(
            stateVariables["/varsAsStringExpand"].stateValues.value.tree,
        ).eqls([
            "+",
            ["^", "x", 3],
            ["*", 2, "y", ["^", "x", 2]],
            ["*", "z", ["^", "x", 2]],
            ["*", "x", ["^", "y", 2]],
            ["*", "x", "y", "z"],
        ]);
        expect(
            stateVariables["/varsAsStringExpand"].stateValues.isNumericOperator,
        ).eq(false);
        expect(stateVariables["/varsAsStringExpand"].stateValues.isNumber).eq(
            false,
        );
        expect(
            stateVariables["/varsAsStringForceNumeric"].stateValues.value.tree,
        ).eqls(NaN);
        expect(
            stateVariables["/varsAsStringForceNumeric"].stateValues
                .isNumericOperator,
        ).eq(true);
        expect(
            stateVariables["/varsAsStringForceNumeric"].stateValues.isNumber,
        ).eq(false);
    });

    it("prod as math expression", async () => {
        let core = await createTestCore({
            doenetML: `
      <group name="nums" asList>
        <number name="a">3</number>
        <number name="b">17</number>
        <number name="c">5-4</number>
      </group>
      <math name="numberString">prod(3,17,5-4)</math>
      <math name="numberStringSimplify" simplify>prod(3,17,5-4)</math>
      <math name="numberStringProduct">prod(3 17 5-4)</math>
      <math name="numberStringProductSimplify" simplify>prod(3 17 5-4)</math>
      <math name="numberComponentsCommas">
        prod(<number>3</number>,<number>17</number>,<number>5-4</number>)
      </math>
      <math name="numberComponentsCommasSimplify" simplify>
      prod(<number>3</number>,<number>17</number>,<number>5-4</number>)
      </math>
      <math name="numberComponentsProduct">
        prod(<number>3</number><number>17</number><number>5-4</number>)
      </math>
      <math name="numberComponentsProductSimplify" simplify>
        prod(<number>3</number><number>17</number><number>5-4</number>)
      </math>
      <math name="macrosCommas">
        prod($a,$b,$c)
      </math>
      <math name="macrosCommasSimplify" simplify>
        prod($a,$b,$c)
      </math>
      <math name="macrosProduct">
        prod($a$b$c)
      </math>
      <math name="macrosProductSimplify" simplify>
        prod($a$b$c)
      </math>
      <math name="group">
        prod($nums)
      </math>
      <math name="groupSimplify" simplify>
        prod($nums)
      </math>
      <math name="groupPlus">
        prod($nums, $a, $b, $c)
      </math>
      <math name="groupPlusSimplify" simplify>
        prod($nums, $a, $b, $c)
      </math>
      <math name="groupPlus2">
        prod($a, $b, $c, $nums)
      </math>
      <math name="groupPlus2Simplify" simplify>
        prod($a, $b, $c, $nums)
      </math>
      <math name="groupPlus3">
        prod($a, $b, $nums, $c)
      </math>
      <math name="groupPlus3Simplify" simplify>
        prod($a, $b, $nums, $c)
      </math>
      `,
        });

        let stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/numberString"].stateValues.value.tree).eqls([
            "apply",
            "prod",
            ["tuple", 3, 17, ["+", 5, -4]],
        ]);
        expect(stateVariables["/numberString"].stateValues.isNumber).eq(false);
        expect(
            stateVariables["/numberStringSimplify"].stateValues.value.tree,
        ).eq(51);
        expect(stateVariables["/numberStringSimplify"].stateValues.isNumber).eq(
            true,
        );
        expect(
            stateVariables["/numberStringProduct"].stateValues.value.tree,
        ).eqls(["apply", "prod", ["+", ["*", 3, 17, 5], -4]]);
        expect(stateVariables["/numberStringProduct"].stateValues.isNumber).eq(
            false,
        );
        expect(
            stateVariables["/numberStringProductSimplify"].stateValues.value
                .tree,
        ).eq(251);
        expect(
            stateVariables["/numberStringProductSimplify"].stateValues.isNumber,
        ).eq(true);

        expect(
            stateVariables["/numberComponentsCommas"].stateValues.value.tree,
        ).eqls(["apply", "prod", ["tuple", 3, 17, 1]]);
        expect(
            stateVariables["/numberComponentsCommas"].stateValues.isNumber,
        ).eq(false);
        expect(
            stateVariables["/numberComponentsCommasSimplify"].stateValues.value
                .tree,
        ).eq(51);
        expect(
            stateVariables["/numberComponentsCommasSimplify"].stateValues
                .isNumber,
        ).eq(true);
        expect(
            stateVariables["/numberComponentsProduct"].stateValues.value.tree,
        ).eqls(["apply", "prod", ["*", 3, 17, 1]]);
        expect(
            stateVariables["/numberComponentsProduct"].stateValues.isNumber,
        ).eq(false);
        expect(
            stateVariables["/numberComponentsProductSimplify"].stateValues.value
                .tree,
        ).eq(51);
        expect(
            stateVariables["/numberComponentsProductSimplify"].stateValues
                .isNumber,
        ).eq(true);

        expect(stateVariables["/macrosCommas"].stateValues.value.tree).eqls([
            "apply",
            "prod",
            ["tuple", 3, 17, 1],
        ]);
        expect(stateVariables["/macrosCommas"].stateValues.isNumber).eq(false);
        expect(
            stateVariables["/macrosCommasSimplify"].stateValues.value.tree,
        ).eq(51);
        expect(stateVariables["/macrosCommasSimplify"].stateValues.isNumber).eq(
            true,
        );
        expect(stateVariables["/macrosProduct"].stateValues.value.tree).eqls([
            "apply",
            "prod",
            ["*", 3, 17, 1],
        ]);
        expect(stateVariables["/macrosProduct"].stateValues.isNumber).eq(false);
        expect(
            stateVariables["/macrosProductSimplify"].stateValues.value.tree,
        ).eq(51);
        expect(
            stateVariables["/macrosProductSimplify"].stateValues.isNumber,
        ).eq(true);

        expect(stateVariables["/group"].stateValues.value.tree).eqls([
            "apply",
            "prod",
            ["tuple", 3, 17, 1],
        ]);
        expect(stateVariables["/group"].stateValues.isNumber).eq(false);
        expect(stateVariables["/groupSimplify"].stateValues.value.tree).eq(51);
        expect(stateVariables["/groupSimplify"].stateValues.isNumber).eq(true);

        expect(stateVariables["/groupPlus"].stateValues.value.tree).eqls([
            "apply",
            "prod",
            ["tuple", 3, 17, 1, 3, 17, 1],
        ]);
        expect(stateVariables["/groupPlus"].stateValues.isNumber).eq(false);
        expect(stateVariables["/groupPlusSimplify"].stateValues.value.tree).eq(
            2601,
        );
        expect(stateVariables["/groupPlusSimplify"].stateValues.isNumber).eq(
            true,
        );

        expect(stateVariables["/groupPlus2"].stateValues.value.tree).eqls([
            "apply",
            "prod",
            ["tuple", 3, 17, 1, 3, 17, 1],
        ]);
        expect(stateVariables["/groupPlus2"].stateValues.isNumber).eq(false);
        expect(stateVariables["/groupPlus2Simplify"].stateValues.value.tree).eq(
            2601,
        );
        expect(stateVariables["/groupPlus2Simplify"].stateValues.isNumber).eq(
            true,
        );

        expect(stateVariables["/groupPlus3"].stateValues.value.tree).eqls([
            "apply",
            "prod",
            ["tuple", 3, 17, 3, 17, 1, 1],
        ]);
        expect(stateVariables["/groupPlus3"].stateValues.isNumber).eq(false);
        expect(stateVariables["/groupPlus3Simplify"].stateValues.value.tree).eq(
            2601,
        );
        expect(stateVariables["/groupPlus3Simplify"].stateValues.isNumber).eq(
            true,
        );
    });

    it("product with lists", async () => {
        let core = await createTestCore({
            doenetML: `
      <product name="numbers"><numberList>3 17 5-4</numberList></product>
      <product name="numbersForceSymbolic" forceSymbolic><numberList>3 17 5-4</numberList></product>
      <product name="numbersForceSymbolicSimplify" forceSymbolic simplify><numberList>3 17 5-4</numberList></product>
      <product name="numbersWithNumberMath"><math>3</math><numberList>17 5-4</numberList></product>
      <product name="numbersWithNumberMathForceSymbolic" forceSymbolic><math>3</math><numberList>17 5-4</numberList></product>
      <product name="numbersWithNumberMathForceSymbolicSimplify" forceSymbolic simplify><math>3</math><numberList>17 5-4</numberList></product>
      <product name="numbersWithNumericMath"><math>6/2</math><numberList>17 5-4</numberList></product>
      <product name="numbersWithNumericMathSimplify" simplify><math>6/2</math><numberList>17 5-4</numberList></product>
      <product name="numbersWithNumericMathForceNumeric" forceNumeric><math>6/2</math><numberList>17 5-4</numberList></product>
      <product name="withNumberProduct"><math>3</math><product><numberList>17 5-4</numberList></product></product>
      <product name="vars"><mathList>x x+y x+y+z</mathList></product>
      <product name="varsExpand" expand><mathList>x x+y x+y+z</mathList></product>
      <product name="varsForcedNumeric" forceNumeric><mathList>x x+y x+y+z</mathList></product>
      $numbers{name="numbersb"}
      $vars{name="varsb"}
      `,
        });

        let stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/numbers"].stateValues.value.tree).eq(51);
        expect(stateVariables["/numbers"].stateValues.isNumericOperator).eq(
            true,
        );
        expect(stateVariables["/numbers"].stateValues.isNumber).eq(true);
        expect(
            stateVariables["/numbersForceSymbolic"].stateValues.value.tree,
        ).eqls(["*", 3, 17, 1]);
        expect(
            stateVariables["/numbersForceSymbolic"].stateValues
                .isNumericOperator,
        ).eq(false);
        expect(stateVariables["/numbersForceSymbolic"].stateValues.isNumber).eq(
            false,
        );
        expect(
            stateVariables["/numbersForceSymbolicSimplify"].stateValues.value
                .tree,
        ).eq(51);
        expect(
            stateVariables["/numbersForceSymbolicSimplify"].stateValues
                .isNumericOperator,
        ).eq(false);
        expect(
            stateVariables["/numbersForceSymbolicSimplify"].stateValues
                .isNumber,
        ).eq(true);
        expect(
            stateVariables["/numbersWithNumberMath"].stateValues.value.tree,
        ).eq(51);
        expect(
            stateVariables["/numbersWithNumberMath"].stateValues
                .isNumericOperator,
        ).eq(true);
        expect(
            stateVariables["/numbersWithNumberMath"].stateValues.isNumber,
        ).eq(true);
        expect(
            stateVariables["/numbersWithNumberMathForceSymbolic"].stateValues
                .value.tree,
        ).eqls(["*", 3, 17, 1]);
        expect(
            stateVariables["/numbersWithNumberMathForceSymbolic"].stateValues
                .isNumericOperator,
        ).eq(false);
        expect(
            stateVariables["/numbersWithNumberMathForceSymbolic"].stateValues
                .isNumber,
        ).eq(false);
        expect(
            stateVariables["/numbersWithNumberMathForceSymbolicSimplify"]
                .stateValues.value.tree,
        ).eq(51);
        expect(
            stateVariables["/numbersWithNumberMathForceSymbolicSimplify"]
                .stateValues.isNumericOperator,
        ).eq(false);
        expect(
            stateVariables["/numbersWithNumberMathForceSymbolicSimplify"]
                .stateValues.isNumber,
        ).eq(true);
        expect(
            stateVariables["/numbersWithNumericMath"].stateValues.value.tree,
        ).eqls(["*", ["/", 6, 2], 17, 1]);
        expect(
            stateVariables["/numbersWithNumericMath"].stateValues
                .isNumericOperator,
        ).eq(false);
        expect(
            stateVariables["/numbersWithNumericMath"].stateValues.isNumber,
        ).eq(false);
        expect(
            stateVariables["/numbersWithNumericMathSimplify"].stateValues.value
                .tree,
        ).eq(51);
        expect(
            stateVariables["/numbersWithNumericMathSimplify"].stateValues
                .isNumericOperator,
        ).eq(false);
        expect(
            stateVariables["/numbersWithNumericMathSimplify"].stateValues
                .isNumber,
        ).eq(true);
        expect(
            stateVariables["/numbersWithNumericMathForceNumeric"].stateValues
                .value.tree,
        ).eq(51);
        expect(
            stateVariables["/numbersWithNumericMathForceNumeric"].stateValues
                .isNumericOperator,
        ).eq(true);
        expect(
            stateVariables["/numbersWithNumericMathForceNumeric"].stateValues
                .isNumber,
        ).eq(true);
        expect(stateVariables["/withNumberProduct"].stateValues.value.tree).eq(
            51,
        );
        expect(
            stateVariables["/withNumberProduct"].stateValues.isNumericOperator,
        ).eq(true);
        expect(stateVariables["/withNumberProduct"].stateValues.isNumber).eq(
            true,
        );
        expect(stateVariables["/vars"].stateValues.value.tree).eqls([
            "*",
            "x",
            ["+", "x", "y"],
            ["+", "x", "y", "z"],
        ]);
        expect(stateVariables["/vars"].stateValues.isNumericOperator).eq(false);
        expect(stateVariables["/vars"].stateValues.isNumber).eq(false);
        expect(stateVariables["/varsExpand"].stateValues.value.tree).eqls([
            "+",
            ["^", "x", 3],
            ["*", 2, "y", ["^", "x", 2]],
            ["*", "z", ["^", "x", 2]],
            ["*", "x", ["^", "y", 2]],
            ["*", "x", "y", "z"],
        ]);
        expect(stateVariables["/varsExpand"].stateValues.isNumericOperator).eq(
            false,
        );
        expect(stateVariables["/varsExpand"].stateValues.isNumber).eq(false);
        expect(
            stateVariables["/varsForcedNumeric"].stateValues.value.tree,
        ).eqls(NaN);
        expect(
            stateVariables["/varsForcedNumeric"].stateValues.isNumericOperator,
        ).eq(true);
        expect(stateVariables["/varsForcedNumeric"].stateValues.isNumber).eq(
            false,
        );
        expect(stateVariables["/numbersb"].stateValues.value.tree).eq(51);
        expect(stateVariables["/numbersb"].stateValues.isNumericOperator).eq(
            true,
        );
        expect(stateVariables["/numbersb"].stateValues.isNumber).eq(true);
        expect(stateVariables["/varsb"].stateValues.value.tree).eqls([
            "*",
            "x",
            ["+", "x", "y"],
            ["+", "x", "y", "z"],
        ]);
        expect(stateVariables["/varsb"].stateValues.isNumericOperator).eq(
            false,
        );
        expect(stateVariables["/varsb"].stateValues.isNumber).eq(false);
    });

    it("clamp number", async () => {
        let core = await createTestCore({
            doenetML: `
      <clampNumber>55.3</clampNumber>
      <clampNumber>-55.3</clampNumber>
      <clampNumber>0.3</clampNumber>

      <clampNumber lowervalue="10" uppervalue="40">55.3</clampNumber>
      <clampNumber lowervalue="10" uppervalue="40">-55.3</clampNumber>
      <clampNumber lowervalue="10" uppervalue="40">12</clampNumber>

      <clampNumber lowervalue="10" uppervalue="40"><math>55.3</math></clampNumber>
      <clampNumber lowervalue="10" uppervalue="40"><number>-55.3</number></clampNumber>
      <clampNumber lowervalue="10" uppervalue="40"><number>12</number></clampNumber>

      <clampNumber lowervalue="10" uppervalue="40">x+y</clampNumber>
      <clampNumber lowervalue="10" uppervalue="40"><math>x+y</math></clampNumber>

      <number name="a">4</number>

      <clampNumber lowervalue="10" uppervalue="40">12$a</clampNumber>
      <clampNumber lowervalue="10" uppervalue="40">-12$a</clampNumber>
      <clampNumber lowervalue="10" uppervalue="40">3$a</clampNumber>

      $_clampnumber1{name="clampnumber1b"}
      $_clampnumber5{name="clampnumber5b"}
      $_clampnumber9{name="clampnumber9b"}
      $_clampnumber14{name="clampnumber14b"}

      `,
        });

        let stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/_clampnumber1"].stateValues.value.tree).eq(1);
        expect(stateVariables["/_clampnumber2"].stateValues.value.tree).eq(0);
        expect(stateVariables["/_clampnumber3"].stateValues.value.tree).eq(0.3);
        expect(stateVariables["/_clampnumber4"].stateValues.value.tree).eq(40);
        expect(stateVariables["/_clampnumber5"].stateValues.value.tree).eq(10);
        expect(stateVariables["/_clampnumber6"].stateValues.value.tree).eq(12);
        expect(stateVariables["/_clampnumber7"].stateValues.value.tree).eq(40);
        expect(stateVariables["/_clampnumber8"].stateValues.value.tree).eq(10);
        expect(stateVariables["/_clampnumber9"].stateValues.value.tree).eq(12);
        expect(stateVariables["/_clampnumber10"].stateValues.value.tree).eqls(
            NaN,
        );
        expect(stateVariables["/_clampnumber11"].stateValues.value.tree).eqls(
            NaN,
        );
        expect(stateVariables["/_clampnumber12"].stateValues.value.tree).eq(40);
        expect(stateVariables["/_clampnumber13"].stateValues.value.tree).eq(10);
        expect(stateVariables["/_clampnumber14"].stateValues.value.tree).eq(12);
        expect(stateVariables["/clampnumber1b"].stateValues.value.tree).eq(1);
        expect(stateVariables["/clampnumber5b"].stateValues.value.tree).eq(10);
        expect(stateVariables["/clampnumber9b"].stateValues.value.tree).eq(12);
        expect(stateVariables["/clampnumber14b"].stateValues.value.tree).eq(12);
        expect(
            stateVariables["/_clampnumber1"].stateValues.isNumericOperator,
        ).eq(true);
        expect(
            stateVariables["/_clampnumber2"].stateValues.isNumericOperator,
        ).eq(true);
        expect(
            stateVariables["/_clampnumber3"].stateValues.isNumericOperator,
        ).eq(true);
        expect(
            stateVariables["/_clampnumber4"].stateValues.isNumericOperator,
        ).eq(true);
        expect(
            stateVariables["/_clampnumber5"].stateValues.isNumericOperator,
        ).eq(true);
        expect(
            stateVariables["/_clampnumber6"].stateValues.isNumericOperator,
        ).eq(true);
        expect(
            stateVariables["/_clampnumber7"].stateValues.isNumericOperator,
        ).eq(true);
        expect(
            stateVariables["/_clampnumber8"].stateValues.isNumericOperator,
        ).eq(true);
        expect(
            stateVariables["/_clampnumber9"].stateValues.isNumericOperator,
        ).eq(true);
        expect(
            stateVariables["/_clampnumber10"].stateValues.isNumericOperator,
        ).eq(true);
        expect(
            stateVariables["/_clampnumber11"].stateValues.isNumericOperator,
        ).eq(true);
        expect(
            stateVariables["/_clampnumber12"].stateValues.isNumericOperator,
        ).eq(true);
        expect(
            stateVariables["/_clampnumber13"].stateValues.isNumericOperator,
        ).eq(true);
        expect(
            stateVariables["/_clampnumber14"].stateValues.isNumericOperator,
        ).eq(true);
        expect(
            stateVariables["/clampnumber1b"].stateValues.isNumericOperator,
        ).eq(true);
        expect(
            stateVariables["/clampnumber5b"].stateValues.isNumericOperator,
        ).eq(true);
        expect(
            stateVariables["/clampnumber9b"].stateValues.isNumericOperator,
        ).eq(true);
        expect(
            stateVariables["/clampnumber14b"].stateValues.isNumericOperator,
        ).eq(true);
        expect(stateVariables["/_clampnumber1"].stateValues.isNumber).eq(true);
        expect(stateVariables["/_clampnumber2"].stateValues.isNumber).eq(true);
        expect(stateVariables["/_clampnumber3"].stateValues.isNumber).eq(true);
        expect(stateVariables["/_clampnumber4"].stateValues.isNumber).eq(true);
        expect(stateVariables["/_clampnumber5"].stateValues.isNumber).eq(true);
        expect(stateVariables["/_clampnumber6"].stateValues.isNumber).eq(true);
        expect(stateVariables["/_clampnumber7"].stateValues.isNumber).eq(true);
        expect(stateVariables["/_clampnumber8"].stateValues.isNumber).eq(true);
        expect(stateVariables["/_clampnumber9"].stateValues.isNumber).eq(true);
        expect(stateVariables["/_clampnumber10"].stateValues.isNumber).eq(
            false,
        );
        expect(stateVariables["/_clampnumber11"].stateValues.isNumber).eq(
            false,
        );
        expect(stateVariables["/_clampnumber12"].stateValues.isNumber).eq(true);
        expect(stateVariables["/_clampnumber13"].stateValues.isNumber).eq(true);
        expect(stateVariables["/_clampnumber14"].stateValues.isNumber).eq(true);
        expect(stateVariables["/clampnumber1b"].stateValues.isNumber).eq(true);
        expect(stateVariables["/clampnumber5b"].stateValues.isNumber).eq(true);
        expect(stateVariables["/clampnumber9b"].stateValues.isNumber).eq(true);
        expect(stateVariables["/clampnumber14b"].stateValues.isNumber).eq(true);
    });

    it("wrap number periodic", async () => {
        let core = await createTestCore({
            doenetML: `
      <wrapnumberperiodic>55.3</wrapnumberperiodic>
      <wrapnumberperiodic>-55.3</wrapnumberperiodic>
      <wrapnumberperiodic>0.3</wrapnumberperiodic>

      <wrapnumberperiodic lowervalue="10" uppervalue="40">55.3</wrapnumberperiodic>
      <wrapnumberperiodic lowervalue="10" uppervalue="40">-55.3</wrapnumberperiodic>
      <wrapnumberperiodic lowervalue="10" uppervalue="40">12</wrapnumberperiodic>

      <wrapnumberperiodic lowervalue="10" uppervalue="40"><math>55.3</math></wrapnumberperiodic>
      <wrapnumberperiodic lowervalue="10" uppervalue="40"><number>-55.3</number></wrapnumberperiodic>
      <wrapnumberperiodic lowervalue="10" uppervalue="40"><number>12</number></wrapnumberperiodic>

      <wrapnumberperiodic lowervalue="10" uppervalue="40">x+y</wrapnumberperiodic>
      <wrapnumberperiodic lowervalue="10" uppervalue="40"><math>x+y</math></wrapnumberperiodic>

      <number name="a">4</number>

      <wrapnumberperiodic lowervalue="10" uppervalue="40">12$a</wrapnumberperiodic>
      <wrapnumberperiodic lowervalue="10" uppervalue="40">-12$a</wrapnumberperiodic>
      <wrapnumberperiodic lowervalue="10" uppervalue="40">3$a</wrapnumberperiodic>

      $_wrapnumberperiodic1{name="wrapnumberperiodic1b"}
      $_wrapnumberperiodic5{name="wrapnumberperiodic5b"}
      $_wrapnumberperiodic9{name="wrapnumberperiodic9b"}
      $_wrapnumberperiodic14{name="wrapnumberperiodic14b"}

      `,
        });

        let stateVariables = await returnAllStateVariables(core);

        expect(
            stateVariables["/_wrapnumberperiodic1"].stateValues.value.tree,
        ).closeTo(0.3, 1e-12);
        expect(
            stateVariables["/_wrapnumberperiodic2"].stateValues.value.tree,
        ).closeTo(0.7, 1e-12);
        expect(
            stateVariables["/_wrapnumberperiodic3"].stateValues.value.tree,
        ).closeTo(0.3, 1e-12);
        expect(
            stateVariables["/_wrapnumberperiodic4"].stateValues.value.tree,
        ).closeTo(25.3, 1e-12);
        expect(
            stateVariables["/_wrapnumberperiodic5"].stateValues.value.tree,
        ).closeTo(34.7, 1e-12);
        expect(
            stateVariables["/_wrapnumberperiodic6"].stateValues.value.tree,
        ).closeTo(12, 1e-12);
        expect(
            stateVariables["/_wrapnumberperiodic7"].stateValues.value.tree,
        ).closeTo(25.3, 1e-12);
        expect(
            stateVariables["/_wrapnumberperiodic8"].stateValues.value.tree,
        ).closeTo(34.7, 1e-12);
        expect(
            stateVariables["/_wrapnumberperiodic9"].stateValues.value.tree,
        ).closeTo(12, 1e-12);
        expect(
            stateVariables["/_wrapnumberperiodic10"].stateValues.value.tree,
        ).eqls(NaN);
        expect(
            stateVariables["/_wrapnumberperiodic11"].stateValues.value.tree,
        ).eqls(NaN);
        expect(
            stateVariables["/_wrapnumberperiodic12"].stateValues.value.tree,
        ).closeTo(18, 1e-12);
        expect(
            stateVariables["/_wrapnumberperiodic13"].stateValues.value.tree,
        ).closeTo(12, 1e-12);
        expect(
            stateVariables["/_wrapnumberperiodic14"].stateValues.value.tree,
        ).closeTo(12, 1e-12);
        expect(
            stateVariables["/wrapnumberperiodic1b"].stateValues.value.tree,
        ).closeTo(0.3, 1e-12);
        expect(
            stateVariables["/wrapnumberperiodic5b"].stateValues.value.tree,
        ).closeTo(34.7, 1e-12);
        expect(
            stateVariables["/wrapnumberperiodic9b"].stateValues.value.tree,
        ).closeTo(12, 1e-12);
        expect(
            stateVariables["/wrapnumberperiodic14b"].stateValues.value.tree,
        ).closeTo(12, 1e-12);
        expect(
            stateVariables["/_wrapnumberperiodic1"].stateValues
                .isNumericOperator,
        ).eq(true);
        expect(
            stateVariables["/_wrapnumberperiodic2"].stateValues
                .isNumericOperator,
        ).eq(true);
        expect(
            stateVariables["/_wrapnumberperiodic3"].stateValues
                .isNumericOperator,
        ).eq(true);
        expect(
            stateVariables["/_wrapnumberperiodic4"].stateValues
                .isNumericOperator,
        ).eq(true);
        expect(
            stateVariables["/_wrapnumberperiodic5"].stateValues
                .isNumericOperator,
        ).eq(true);
        expect(
            stateVariables["/_wrapnumberperiodic6"].stateValues
                .isNumericOperator,
        ).eq(true);
        expect(
            stateVariables["/_wrapnumberperiodic7"].stateValues
                .isNumericOperator,
        ).eq(true);
        expect(
            stateVariables["/_wrapnumberperiodic8"].stateValues
                .isNumericOperator,
        ).eq(true);
        expect(
            stateVariables["/_wrapnumberperiodic9"].stateValues
                .isNumericOperator,
        ).eq(true);
        expect(
            stateVariables["/_wrapnumberperiodic10"].stateValues
                .isNumericOperator,
        ).eq(true);
        expect(
            stateVariables["/_wrapnumberperiodic11"].stateValues
                .isNumericOperator,
        ).eq(true);
        expect(
            stateVariables["/_wrapnumberperiodic12"].stateValues
                .isNumericOperator,
        ).eq(true);
        expect(
            stateVariables["/_wrapnumberperiodic13"].stateValues
                .isNumericOperator,
        ).eq(true);
        expect(
            stateVariables["/_wrapnumberperiodic14"].stateValues
                .isNumericOperator,
        ).eq(true);
        expect(
            stateVariables["/wrapnumberperiodic1b"].stateValues
                .isNumericOperator,
        ).eq(true);
        expect(
            stateVariables["/wrapnumberperiodic5b"].stateValues
                .isNumericOperator,
        ).eq(true);
        expect(
            stateVariables["/wrapnumberperiodic9b"].stateValues
                .isNumericOperator,
        ).eq(true);
        expect(
            stateVariables["/wrapnumberperiodic14b"].stateValues
                .isNumericOperator,
        ).eq(true);
        expect(stateVariables["/_wrapnumberperiodic1"].stateValues.isNumber).eq(
            true,
        );
        expect(stateVariables["/_wrapnumberperiodic2"].stateValues.isNumber).eq(
            true,
        );
        expect(stateVariables["/_wrapnumberperiodic3"].stateValues.isNumber).eq(
            true,
        );
        expect(stateVariables["/_wrapnumberperiodic4"].stateValues.isNumber).eq(
            true,
        );
        expect(stateVariables["/_wrapnumberperiodic5"].stateValues.isNumber).eq(
            true,
        );
        expect(stateVariables["/_wrapnumberperiodic6"].stateValues.isNumber).eq(
            true,
        );
        expect(stateVariables["/_wrapnumberperiodic7"].stateValues.isNumber).eq(
            true,
        );
        expect(stateVariables["/_wrapnumberperiodic8"].stateValues.isNumber).eq(
            true,
        );
        expect(stateVariables["/_wrapnumberperiodic9"].stateValues.isNumber).eq(
            true,
        );
        expect(
            stateVariables["/_wrapnumberperiodic10"].stateValues.isNumber,
        ).eq(false);
        expect(
            stateVariables["/_wrapnumberperiodic11"].stateValues.isNumber,
        ).eq(false);
        expect(
            stateVariables["/_wrapnumberperiodic12"].stateValues.isNumber,
        ).eq(true);
        expect(
            stateVariables["/_wrapnumberperiodic13"].stateValues.isNumber,
        ).eq(true);
        expect(
            stateVariables["/_wrapnumberperiodic14"].stateValues.isNumber,
        ).eq(true);
        expect(stateVariables["/wrapnumberperiodic1b"].stateValues.isNumber).eq(
            true,
        );
        expect(stateVariables["/wrapnumberperiodic5b"].stateValues.isNumber).eq(
            true,
        );
        expect(stateVariables["/wrapnumberperiodic9b"].stateValues.isNumber).eq(
            true,
        );
        expect(
            stateVariables["/wrapnumberperiodic14b"].stateValues.isNumber,
        ).eq(true);
    });

    it("clamp and wrap number updatable", async () => {
        let core = await createTestCore({
            doenetML: `
      <graph name="graph1">
        <point name="P1" layer="1">(6,7)</point>
        <point name="P2">
          (<clampnumber lowervalue="-2" uppervalue="5">
            $P1.x
          </clampnumber>,
          <wrapnumberperiodic lowervalue="-2" uppervalue="5">
            $P1.y
          </wrapnumberperiodic>
          )
        </point>
        <point name="P3">($P2.y, $P2.x)</point>
      </graph>

      $graph1{name="g2"}
      `,
        });

        let clamp = (x) => Math.min(5, Math.max(-2, x));
        let wrap = (x) => -2 + me.math.mod(x + 2, 7);

        let stateVariables = await returnAllStateVariables(core);
        let x = 6,
            y = 7;
        expect(stateVariables["/P1"].stateValues.xs[0].tree).eq(x);
        expect(stateVariables["/P1"].stateValues.xs[1].tree).eq(y);
        expect(stateVariables["/P2"].stateValues.xs[0].tree).eq(clamp(x));
        expect(stateVariables["/P2"].stateValues.xs[1].tree).eq(wrap(y));
        expect(stateVariables["/P3"].stateValues.xs[0].tree).eq(wrap(y));
        expect(stateVariables["/P3"].stateValues.xs[1].tree).eq(clamp(x));

        let g2children = stateVariables["/g2"].activeChildren.map(
            (x) => stateVariables[x.componentName],
        );
        expect((await g2children[0].stateValues.xs)[0].tree).eq(x);
        expect((await g2children[0].stateValues.xs)[1].tree).eq(y);
        expect((await g2children[1].stateValues.xs)[0].tree).eq(clamp(x));
        expect((await g2children[1].stateValues.xs)[1].tree).eq(wrap(y));
        expect((await g2children[2].stateValues.xs)[0].tree).eq(wrap(y));
        expect((await g2children[2].stateValues.xs)[1].tree).eq(clamp(x));

        // move point 1
        x = -5;
        y = 0;
        await movePoint({ name: "/P1", x, y, core });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/P1"].stateValues.xs[0].tree).eq(x);
        expect(stateVariables["/P1"].stateValues.xs[1].tree).eq(y);
        expect(stateVariables["/P2"].stateValues.xs[0].tree).eq(clamp(x));
        expect(stateVariables["/P2"].stateValues.xs[1].tree).eq(wrap(y));
        expect(stateVariables["/P3"].stateValues.xs[0].tree).eq(wrap(y));
        expect(stateVariables["/P3"].stateValues.xs[1].tree).eq(clamp(x));

        g2children = stateVariables["/g2"].activeChildren.map(
            (x) => stateVariables[x.componentName],
        );
        expect((await g2children[0].stateValues.xs)[0].tree).eq(x);
        expect((await g2children[0].stateValues.xs)[1].tree).eq(y);
        expect((await g2children[1].stateValues.xs)[0].tree).eq(clamp(x));
        expect((await g2children[1].stateValues.xs)[1].tree).eq(wrap(y));
        expect((await g2children[2].stateValues.xs)[0].tree).eq(wrap(y));
        expect((await g2children[2].stateValues.xs)[1].tree).eq(clamp(x));

        // move point 2
        x = 9;
        y = -3;
        await movePoint({ name: "/P2", x, y, core });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/P1"].stateValues.xs[0].tree).eq(clamp(x));
        expect(stateVariables["/P1"].stateValues.xs[1].tree).eq(wrap(y));
        expect(stateVariables["/P2"].stateValues.xs[0].tree).eq(clamp(x));
        expect(stateVariables["/P2"].stateValues.xs[1].tree).eq(wrap(y));
        expect(stateVariables["/P3"].stateValues.xs[0].tree).eq(wrap(y));
        expect(stateVariables["/P3"].stateValues.xs[1].tree).eq(clamp(x));

        g2children = stateVariables["/g2"].activeChildren.map(
            (x) => stateVariables[x.componentName],
        );
        expect((await g2children[0].stateValues.xs)[0].tree).eq(clamp(x));
        expect((await g2children[0].stateValues.xs)[1].tree).eq(wrap(y));
        expect((await g2children[1].stateValues.xs)[0].tree).eq(clamp(x));
        expect((await g2children[1].stateValues.xs)[1].tree).eq(wrap(y));
        expect((await g2children[2].stateValues.xs)[0].tree).eq(wrap(y));
        expect((await g2children[2].stateValues.xs)[1].tree).eq(clamp(x));

        // move point 3
        x = -4;
        y = 8;
        await movePoint({ name: "/P3", x: y, y: x, core });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/P1"].stateValues.xs[0].tree).eq(clamp(x));
        expect(stateVariables["/P1"].stateValues.xs[1].tree).eq(wrap(y));
        expect(stateVariables["/P2"].stateValues.xs[0].tree).eq(clamp(x));
        expect(stateVariables["/P2"].stateValues.xs[1].tree).eq(wrap(y));
        expect(stateVariables["/P3"].stateValues.xs[0].tree).eq(wrap(y));
        expect(stateVariables["/P3"].stateValues.xs[1].tree).eq(clamp(x));

        g2children = stateVariables["/g2"].activeChildren.map(
            (x) => stateVariables[x.componentName],
        );
        expect((await g2children[0].stateValues.xs)[0].tree).eq(clamp(x));
        expect((await g2children[0].stateValues.xs)[1].tree).eq(wrap(y));
        expect((await g2children[1].stateValues.xs)[0].tree).eq(clamp(x));
        expect((await g2children[1].stateValues.xs)[1].tree).eq(wrap(y));
        expect((await g2children[2].stateValues.xs)[0].tree).eq(wrap(y));
        expect((await g2children[2].stateValues.xs)[1].tree).eq(clamp(x));

        // move point 4
        x = 10;
        y = -10;

        await movePoint({
            name: stateVariables["/g2"].activeChildren[0].componentName,
            x,
            y,
            core,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/P1"].stateValues.xs[0].tree).eq(x);
        expect(stateVariables["/P1"].stateValues.xs[1].tree).eq(y);
        expect(stateVariables["/P2"].stateValues.xs[0].tree).eq(clamp(x));
        expect(stateVariables["/P2"].stateValues.xs[1].tree).eq(wrap(y));
        expect(stateVariables["/P3"].stateValues.xs[0].tree).eq(wrap(y));
        expect(stateVariables["/P3"].stateValues.xs[1].tree).eq(clamp(x));

        g2children = stateVariables["/g2"].activeChildren.map(
            (x) => stateVariables[x.componentName],
        );
        expect((await g2children[0].stateValues.xs)[0].tree).eq(x);
        expect((await g2children[0].stateValues.xs)[1].tree).eq(y);
        expect((await g2children[1].stateValues.xs)[0].tree).eq(clamp(x));
        expect((await g2children[1].stateValues.xs)[1].tree).eq(wrap(y));
        expect((await g2children[2].stateValues.xs)[0].tree).eq(wrap(y));
        expect((await g2children[2].stateValues.xs)[1].tree).eq(clamp(x));

        // move point 5
        x = 11;
        y = -13;

        await movePoint({
            name: stateVariables["/g2"].activeChildren[1].componentName,
            x,
            y,
            core,
        });

        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/P1"].stateValues.xs[0].tree).eq(clamp(x));
        expect(stateVariables["/P1"].stateValues.xs[1].tree).eq(wrap(y));
        expect(stateVariables["/P2"].stateValues.xs[0].tree).eq(clamp(x));
        expect(stateVariables["/P2"].stateValues.xs[1].tree).eq(wrap(y));
        expect(stateVariables["/P3"].stateValues.xs[0].tree).eq(wrap(y));
        expect(stateVariables["/P3"].stateValues.xs[1].tree).eq(clamp(x));

        g2children = stateVariables["/g2"].activeChildren.map(
            (x) => stateVariables[x.componentName],
        );
        expect((await g2children[0].stateValues.xs)[0].tree).eq(clamp(x));
        expect((await g2children[0].stateValues.xs)[1].tree).eq(wrap(y));
        expect((await g2children[1].stateValues.xs)[0].tree).eq(clamp(x));
        expect((await g2children[1].stateValues.xs)[1].tree).eq(wrap(y));
        expect((await g2children[2].stateValues.xs)[0].tree).eq(wrap(y));
        expect((await g2children[2].stateValues.xs)[1].tree).eq(clamp(x));

        // move point 6
        x = -3;
        y = 12;

        await movePoint({
            name: stateVariables["/g2"].activeChildren[2].componentName,
            x: y,
            y: x,
            core,
        });

        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/P1"].stateValues.xs[0].tree).eq(clamp(x));
        expect(stateVariables["/P1"].stateValues.xs[1].tree).eq(wrap(y));
        expect(stateVariables["/P2"].stateValues.xs[0].tree).eq(clamp(x));
        expect(stateVariables["/P2"].stateValues.xs[1].tree).eq(wrap(y));
        expect(stateVariables["/P3"].stateValues.xs[0].tree).eq(wrap(y));
        expect(stateVariables["/P3"].stateValues.xs[1].tree).eq(clamp(x));

        g2children = stateVariables["/g2"].activeChildren.map(
            (x) => stateVariables[x.componentName],
        );
        expect((await g2children[0].stateValues.xs)[0].tree).eq(clamp(x));
        expect((await g2children[0].stateValues.xs)[1].tree).eq(wrap(y));
        expect((await g2children[1].stateValues.xs)[0].tree).eq(clamp(x));
        expect((await g2children[1].stateValues.xs)[1].tree).eq(wrap(y));
        expect((await g2children[2].stateValues.xs)[0].tree).eq(wrap(y));
        expect((await g2children[2].stateValues.xs)[1].tree).eq(clamp(x));
    });

    it("round", async () => {
        let core = await createTestCore({
            doenetML: `
      <round>55.3252326</round>
      <round>log(31)</round>
      <round>0.5</round>

      <round numDecimals="1">55.3252326</round>
      <round numDecimals="2">log(31)</round>
      <round numDecimals="3">0.5555</round>

      <round numDigits="3">55.3252326</round>
      <round numDigits="4">log(31)</round>
      <round numDigits="5">0.555555</round>

      <round numDigits="3"><math>sin(55.3252326 x)</math></round>
      <round numDigits="3">log(31) exp(3) <number>sin(2)</number></round>

      <round numDecimals="-6"><math>exp(20) pi</math></round>

      $_round1{name="round1b"}
      $_round5{name="round5b"}
      $_round11{name="round11b"}
  
      `,
        });

        let stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/_round1"].stateValues.value.tree).eq(55);
        expect(stateVariables["/_round2"].stateValues.value.tree).eq(3);
        expect(stateVariables["/_round3"].stateValues.value.tree).eq(1);
        expect(stateVariables["/_round4"].stateValues.value.tree).eq(55.3);
        expect(stateVariables["/_round5"].stateValues.value.tree).eq(3.43);
        expect(stateVariables["/_round6"].stateValues.value.tree).eq(0.556);
        expect(stateVariables["/_round7"].stateValues.value.tree).eq(55.3);
        expect(stateVariables["/_round8"].stateValues.value.tree).eq(3.434);
        expect(stateVariables["/_round9"].stateValues.value.tree).eq(0.55556);
        expect(stateVariables["/_round10"].stateValues.value.tree).eqls([
            "apply",
            "sin",
            ["*", 55.3, "x"],
        ]);
        expect(stateVariables["/_round11"].stateValues.value.tree).eq(62.7);
        expect(stateVariables["/_round12"].stateValues.value.tree).eq(
            1524000000,
        );
        expect(stateVariables["/round1b"].stateValues.value.tree).eq(55);
        expect(stateVariables["/round5b"].stateValues.value.tree).eq(3.43);
        expect(stateVariables["/round11b"].stateValues.value.tree).eq(62.7);
    });

    it("round ignores display rounding of math children", async () => {
        let core = await createTestCore({
            doenetML: `
      <round numDigits="6"><math>55.3252326</math></round>
      <round numDigits="6"><number>55.3252326</number></round>
      <round numDecimals="6"><math>55.3252326</math></round>
      <round numDecimals="6"><number>55.3252326</number></round>

      <round numDigits="6"><math displayDigits="1">55.3252326</math></round>
      <round numDigits="6"><number displayDecimals="1">55.3252326</number></round>
      <round numDecimals="6"><math displayDigits="1">55.3252326</math></round>
      <round numDecimals="6"><number displayDecimals="1">55.3252326</number></round>

      <math copysource="_round1" name="r1a" />
      <math copysource="_round2" name="r2a" />
      <math copysource="_round3" name="r3a" />
      <math copysource="_round4" name="r4a" />
      
      <math copysource="_round5" name="r5a" />
      <math copysource="_round6" name="r6a" />
      <math copysource="_round7" name="r7a" />
      <math copysource="_round8" name="r8a" />

      <math copysource="_round1.value" name="r1b" />
      <math copysource="_round2.value" name="r2b" />
      <math copysource="_round3.value" name="r3b" />
      <math copysource="_round4.value" name="r4b" />
      
      <math copysource="_round5.value" name="r5b" />
      <math copysource="_round6.value" name="r6b" />
      <math copysource="_round7.value" name="r7b" />
      <math copysource="_round8.value" name="r8b" />

  
      `,
        });

        let stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/_round1"].stateValues.value.tree).eqls(55.3252);

        expect(stateVariables["/_round2"].stateValues.value.tree).eqls(55.3252);
        expect(stateVariables["/_round3"].stateValues.value.tree).eqls(
            55.325233,
        );
        expect(stateVariables["/_round4"].stateValues.value.tree).eqls(
            55.325233,
        );

        expect(stateVariables["/_round5"].stateValues.value.tree).eqls(55.3252);
        expect(stateVariables["/_round6"].stateValues.value.tree).eqls(55.3252);
        expect(stateVariables["/_round7"].stateValues.value.tree).eqls(
            55.325233,
        );
        expect(stateVariables["/_round8"].stateValues.value.tree).eqls(
            55.325233,
        );

        expect(stateVariables["/r1a"].stateValues.value.tree).eqls(55.3252);
        expect(stateVariables["/r2a"].stateValues.value.tree).eqls(55.3252);
        expect(stateVariables["/r3a"].stateValues.value.tree).eqls(55.325233);
        expect(stateVariables["/r4a"].stateValues.value.tree).eqls(55.325233);

        expect(stateVariables["/r5a"].stateValues.value.tree).eqls(55.3252);
        expect(stateVariables["/r6a"].stateValues.value.tree).eqls(55.3252);
        expect(stateVariables["/r7a"].stateValues.value.tree).eqls(55.325233);
        expect(stateVariables["/r8a"].stateValues.value.tree).eqls(55.325233);

        expect(stateVariables["/r1b"].stateValues.value.tree).eqls(55.3252);
        expect(stateVariables["/r2b"].stateValues.value.tree).eqls(55.3252);
        expect(stateVariables["/r3b"].stateValues.value.tree).eqls(55.325233);
        expect(stateVariables["/r4b"].stateValues.value.tree).eqls(55.325233);

        expect(stateVariables["/r5b"].stateValues.value.tree).eqls(55.3252);
        expect(stateVariables["/r6b"].stateValues.value.tree).eqls(55.3252);
        expect(stateVariables["/r7b"].stateValues.value.tree).eqls(55.325233);
        expect(stateVariables["/r8b"].stateValues.value.tree).eqls(55.325233);
    });

    it("convert set to list", async () => {
        let core = await createTestCore({
            doenetML: `
      <p><math>{1,2,3,2,1}</math></p>
      <p><math>(1,2,3,2,1)</math></p>
      <p><math>1,2,3,2,1</math></p>

      <p><convertSetToList>$_math1</convertSetToList></p>
      <p><convertSetToList>$_math2</convertSetToList></p>
      <p><convertSetToList>$_math3</convertSetToList></p>

      <p>$_convertsettolist1{name="r1"}</p>
      <p>$_convertsettolist2{name="r2"}</p>
      <p>$_convertsettolist3{name="r3"}</p>

      `,
        });

        let stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/_math1"].stateValues.value.tree).eqls([
            "set",
            1,
            2,
            3,
            2,
            1,
        ]);
        expect(stateVariables["/_math2"].stateValues.value.tree).eqls([
            "tuple",
            1,
            2,
            3,
            2,
            1,
        ]);
        expect(stateVariables["/_math3"].stateValues.value.tree).eqls([
            "list",
            1,
            2,
            3,
            2,
            1,
        ]);
        expect(
            stateVariables["/_convertsettolist1"].stateValues.value.tree,
        ).eqls(["list", 1, 2, 3]);
        expect(
            stateVariables["/_convertsettolist2"].stateValues.value.tree,
        ).eqls(["tuple", 1, 2, 3, 2, 1]);
        expect(
            stateVariables["/_convertsettolist3"].stateValues.value.tree,
        ).eqls(["list", 1, 2, 3, 2, 1]);
        expect(stateVariables["/r1"].stateValues.value.tree).eqls([
            "list",
            1,
            2,
            3,
        ]);
        expect(stateVariables["/r2"].stateValues.value.tree).eqls([
            "tuple",
            1,
            2,
            3,
            2,
            1,
        ]);
        expect(stateVariables["/r3"].stateValues.value.tree).eqls([
            "list",
            1,
            2,
            3,
            2,
            1,
        ]);
        expect(stateVariables["/_convertsettolist1"].stateValues.unordered).eq(
            true,
        );
        expect(stateVariables["/_convertsettolist2"].stateValues.unordered).eq(
            true,
        );
        expect(stateVariables["/_convertsettolist3"].stateValues.unordered).eq(
            true,
        );
        expect(stateVariables["/r1"].stateValues.unordered).eq(true);
        expect(stateVariables["/r2"].stateValues.unordered).eq(true);
        expect(stateVariables["/r3"].stateValues.unordered).eq(true);
    });

    it("convert set to list, initially unresolved", async () => {
        let core = await createTestCore({
            doenetML: `
      <p><math name="m">7</math>
      <selectFromSequence assignNames='p' hide='true' exclude="$m $n" from="-10" to="10" />
      </p>

      <p><convertSetToList><math>{$m,$n,$p,$m}</math></convertSetToList></p>
      <p>$_convertsettolist1{name="csl2"}</p>

      <p>$n3{name="n2"}
      $num1{name="n"}
      <math name="num1" simplify>$n2+$num2</math>
      <math name="num2" simplify>$n3+$num3</math>
      $num3{name="n3"}
      <number name="num3">1</number></p>
      `,
        });

        let stateVariables = await returnAllStateVariables(core);
        let p = await stateVariables["/p"].stateValues.value;
        expect(
            stateVariables["/_convertsettolist1"].stateValues.value.tree,
        ).eqls(["list", 7, 3, p]);
        expect(stateVariables["/csl2"].stateValues.value.tree).eqls([
            "list",
            7,
            3,
            p,
        ]);
        expect(stateVariables["/_convertsettolist1"].stateValues.unordered).eq(
            true,
        );
        expect(stateVariables["/csl2"].stateValues.unordered).eq(true);
    });

    it("floor and ceil", async () => {
        let core = await createTestCore({
            doenetML: `
      <floor>55.3252326</floor>
      <ceil>log(31)</ceil>

      <floor>$_floor1/$_ceil1</floor>
      <ceil>$_ceil1/$_floor1</ceil>

      <p>Allow for slight roundoff error:
      <floor>3.999999999999999</floor>
      <ceil>-6999.999999999999</ceil>
      </p>

      $_floor2{name="f2a"}
      $_ceil2{name="c2a"}

      <floor>2.1x</floor>
      <ceil>-3.2y</ceil>
  
      `,
        });

        let stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/_floor1"].stateValues.value.tree).eq(55);
        expect(stateVariables["/_ceil1"].stateValues.value.tree).eq(4);
        expect(stateVariables["/_floor2"].stateValues.value.tree).eq(13);
        expect(stateVariables["/_ceil2"].stateValues.value.tree).eq(1);
        expect(stateVariables["/_floor3"].stateValues.value.tree).eq(4);
        expect(stateVariables["/_ceil3"].stateValues.value.tree).eq(-7000);
        expect(stateVariables["/f2a"].stateValues.value.tree).eq(13);
        expect(stateVariables["/c2a"].stateValues.value.tree).eq(1);
        expect(stateVariables["/_floor4"].stateValues.value.tree).eqls([
            "apply",
            "floor",
            ["*", 2.1, "x"],
        ]);
        expect(stateVariables["/_ceil4"].stateValues.value.tree).eqls([
            "apply",
            "ceil",
            ["-", ["*", 3.2, "y"]],
        ]);
    });

    it("floor and ceil as math expression", async () => {
        let core = await createTestCore({
            doenetML: `
      <math displayDigits="10" name="floor1" format="latex">\\lfloor 55.3252326 \\rfloor</math>
      <math displayDigits="10" name="floor2">floor(55.3252326)</math>
      <math displayDigits="10" name="floor1simp" copySource="floor1" simplify />
      <math displayDigits="10" name="floor2simp" copySource="floor2" simplify />
      <math displayDigits="10" name="ceil1" format="latex">\\lceil \\log(31.1) \\rceil</math>
      <math displayDigits="10" name="ceil2">ceil(log(31.1))</math>
      <math displayDigits="10" name="ceil1simp" copySource="ceil1" simplify />
      <math displayDigits="10" name="ceil2simp" copySource="ceil2" simplify />

      <math displayDigits="10" name="floor3" format="latex" simplify>\\lfloor $floor1/$ceil1 \\rfloor</math>
      <math displayDigits="10" name="floor4" simplify>floor($floor1/$ceil1)</math>
      <math displayDigits="10" name="ceil3" format="latex" simplify>\\lceil $ceil1/$floor1 \\rceil</math>
      <math displayDigits="10" name="ceil4" simplify>ceil($ceil1/$floor1)</math>

      <p>Allow for slight roundoff error:
      <math displayDigits="10" format="latex" name="floor5" simplify>\\lfloor 3.999999999999999 \\rfloor</math>
      <math displayDigits="10" name="floor6" simplify>floor 3.999999999999999</math>
      <math displayDigits="10" format="latex" name="ceil5" simplify>\\lceil -6999.999999999999 \\rceil</math>
      <math displayDigits="10" name="ceil6" simplify>ceil -6999.999999999999</math>
      </p>

      `,
        });

        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/floor1"].stateValues.value.tree).eqls([
            "apply",
            "floor",
            55.3252326,
        ]);
        expect(stateVariables["/floor2"].stateValues.value.tree).eqls([
            "apply",
            "floor",
            55.3252326,
        ]);
        expect(stateVariables["/floor1simp"].stateValues.value.tree).eq(55);
        expect(stateVariables["/floor2simp"].stateValues.value.tree).eq(55);
        expect(stateVariables["/ceil1"].stateValues.value.tree).eqls([
            "apply",
            "ceil",
            ["apply", "log", 31.1],
        ]);
        expect(stateVariables["/ceil2"].stateValues.value.tree).eqls([
            "apply",
            "ceil",
            ["apply", "log", 31.1],
        ]);
        expect(stateVariables["/ceil1simp"].stateValues.value.tree).eq(4);
        expect(stateVariables["/ceil2simp"].stateValues.value.tree).eq(4);
        expect(stateVariables["/floor3"].stateValues.value.tree).eq(13);
        expect(stateVariables["/floor4"].stateValues.value.tree).eq(13);
        expect(stateVariables["/ceil3"].stateValues.value.tree).eq(1);
        expect(stateVariables["/ceil4"].stateValues.value.tree).eq(1);
        expect(stateVariables["/floor5"].stateValues.value.tree).eq(4);
        expect(stateVariables["/floor6"].stateValues.value.tree).eq(4);
        expect(stateVariables["/ceil5"].stateValues.value.tree).eq(-7000);
        expect(stateVariables["/ceil6"].stateValues.value.tree).eq(-7000);
    });

    it("abs", async () => {
        let core = await createTestCore({
            doenetML: `
      <abs>-5.3</abs>
      <abs>-x</abs>
      `,
        });

        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/_abs1"].stateValues.value.tree).eq(5.3);
        expect(stateVariables["/_abs2"].stateValues.value.tree).eqls([
            "apply",
            "abs",
            ["-", "x"],
        ]);
    });

    it("invert abs", async () => {
        let core = await createTestCore({
            doenetML: `
      <abs name="a1">-9</abs>
      <mathinput bindValueTo="$a1" name="a2" />
      $a2.value{assignNames="a3"}
      `,
        });

        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/a1"].stateValues.value.tree).eq(9);
        expect(stateVariables["/a2"].stateValues.value.tree).eq(9);
        expect(stateVariables["/a3"].stateValues.value.tree).eq(9);

        await updateMathInputValue({ name: "/a2", latex: "-3", core });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/a1"].stateValues.value.tree).eq(0);
        expect(stateVariables["/a2"].stateValues.value.tree).eq(0);
        expect(stateVariables["/a3"].stateValues.value.tree).eq(0);

        await updateMathInputValue({ name: "/a2", latex: "7", core });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/a1"].stateValues.value.tree).eq(7);
        expect(stateVariables["/a2"].stateValues.value.tree).eq(7);
        expect(stateVariables["/a3"].stateValues.value.tree).eq(7);

        await updateMathInputValue({ name: "/a2", latex: "x", core });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/a1"].stateValues.value.tree).eqls([
            "apply",
            "abs",
            "x",
        ]);
        expect(stateVariables["/a2"].stateValues.value.tree).eqls([
            "apply",
            "abs",
            "x",
        ]);
        expect(stateVariables["/a3"].stateValues.value.tree).eqls([
            "apply",
            "abs",
            "x",
        ]);

        await updateMathInputValue({ name: "/a2", latex: "y", core });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/a1"].stateValues.value.tree).eqls([
            "apply",
            "abs",
            "y",
        ]);
        expect(stateVariables["/a2"].stateValues.value.tree).eqls([
            "apply",
            "abs",
            "y",
        ]);
        expect(stateVariables["/a3"].stateValues.value.tree).eqls([
            "apply",
            "abs",
            "y",
        ]);
    });

    it("floor, ceil, round and abs updatable", async () => {
        let core = await createTestCore({
            doenetML: `
      <graph>
        <point layer="1">(6.1,7.6)</point>
        <point>
          (
          <floor>
            $_point1.x
          </floor>,
          <ceil>
            $_point1.y
          </ceil>
          )
        </point>
        <point>(<abs>$_point2.y</abs>, <round>$_point1.x</round>)</point>
      </graph>

      $_graph1{name="g2"}
      `,
        });

        let stateVariables = await returnAllStateVariables(core);
        let g2ChildrenNames = stateVariables["/g2"].activeChildren.map(
            (x) => x.componentName,
        );

        let checkPoints = async function (x, y) {
            let stateVariables = await returnAllStateVariables(core);

            expect(stateVariables["/_point1"].stateValues.xs[0].tree).eq(x);
            expect(stateVariables["/_point1"].stateValues.xs[1].tree).eq(y);
            expect(stateVariables["/_point2"].stateValues.xs[0].tree).eq(
                Math.floor(x),
            );
            expect(stateVariables["/_point2"].stateValues.xs[1].tree).eq(
                Math.ceil(y),
            );
            expect(stateVariables["/_point3"].stateValues.xs[0].tree).eq(
                Math.abs(Math.ceil(y)),
            );
            expect(stateVariables["/_point3"].stateValues.xs[1].tree).eq(
                Math.round(x),
            );

            let g2Children = g2ChildrenNames.map((x) => stateVariables[x]);
            expect((await g2Children[0].stateValues.xs)[0].tree).eq(x);
            expect((await g2Children[0].stateValues.xs)[1].tree).eq(y);
            expect((await g2Children[1].stateValues.xs)[0].tree).eq(
                Math.floor(x),
            );
            expect((await g2Children[1].stateValues.xs)[1].tree).eq(
                Math.ceil(y),
            );
            expect((await g2Children[2].stateValues.xs)[0].tree).eq(
                Math.abs(Math.ceil(y)),
            );
            expect((await g2Children[2].stateValues.xs)[1].tree).eq(
                Math.round(x),
            );
        };

        await checkPoints(6.1, 7.6);

        // move point 1, positive y

        let x = -5.1;
        let y = 0.3;

        await movePoint({ name: "/_point1", x, y, core });
        await checkPoints(x, y);

        // move point 1, negative y

        x = -7.9;
        y = -5.8;
        await movePoint({ name: "/_point1", x, y, core });
        await checkPoints(x, y);

        // move point 2, positive y

        x = 3.4;
        y = 8.6;
        await movePoint({ name: "/_point2", x, y, core });
        await checkPoints(x, y);

        // move point 2, negative y

        x = 7.7;
        y = -4.4;

        await movePoint({ name: "/_point2", x, y, core });
        await checkPoints(x, y);

        // move point 3, positive x

        x = 9.4;
        y = -1.3;
        await movePoint({ name: "/_point3", x, y, core });
        await checkPoints(y, x);

        // move point 3, negative x

        x = -8.9;
        y = -4.6;
        await movePoint({ name: "/_point3", x, y, core });
        await checkPoints(y, 0);

        // move point 4, positive y

        x = 6.8;
        y = 3.7;

        await movePoint({ name: g2ChildrenNames[0], x, y, core });
        await checkPoints(x, y);

        // move point 4, negative y

        x = 1.2;
        y = -1.4;
        await movePoint({ name: g2ChildrenNames[0], x, y, core });
        await checkPoints(x, y);

        // move point 5, positive y

        x = -6.6;
        y = 3.2;
        await movePoint({ name: g2ChildrenNames[1], x, y, core });
        await checkPoints(x, y);

        // move point 5, negative y

        x = -4.3;
        y = -8.9;
        await movePoint({ name: g2ChildrenNames[1], x, y, core });
        await checkPoints(x, y);

        // move point 6, positive x

        x = 6.4;
        y = 2.3;
        await movePoint({ name: g2ChildrenNames[2], x, y, core });
        await checkPoints(y, x);

        // move point 6, negative x

        x = -5.6;
        y = 7.8;
        await movePoint({ name: g2ChildrenNames[2], x, y, core });
        await checkPoints(y, 0);
    });

    it("sign", async () => {
        let core = await createTestCore({
            doenetML: `
      <sign>-5.3</sign>
      <sign>63</sign>
      <sign>0</sign>
      `,
        });

        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/_sign1"].stateValues.value.tree).eq(-1);
        expect(stateVariables["/_sign2"].stateValues.value.tree).eq(1);
        expect(stateVariables["/_sign3"].stateValues.value.tree).eq(0);
    });

    it("mean", async () => {
        let core = await createTestCore({
            doenetML: `
      <mean name="numbers"><number>3</number><number>17</number><number>5-4</number></mean>
      <mean name="numbersForceSymbolic" forceSymbolic><number>3</number><number>17</number><number>5-4</number></mean>
      <mean name="numbersForceSymbolicSimplify" forceSymbolic simplify><number>3</number><number>17</number><number>5-4</number></mean>
      <mean name="numbersWithNumberMath"><math>3</math><number>17</number><number>5-4</number></mean>
      <mean name="numbersWithNumberMathForceSymbolic" forceSymbolic><math>3</math><number>17</number><number>5-4</number></mean>
      <mean name="numbersWithNumberMathForceSymbolicSimplify" forceSymbolic simplify><math>3</math><number>17</number><number>5-4</number></mean>
      <mean name="numbersWithNumericMath"><math>6/2</math><number>17</number><number>5-4</number></mean>
      <mean name="numbersWithNumericMathSimplify" simplify><math>6/2</math><number>17</number><number>5-4</number></mean>
      <mean name="numbersWithNumericMathForceNumeric" forceNumeric><math>6/2</math><number>17</number><number>5-4</number></mean>
      <mean name="withNumberMean"><math>3</math><mean><number>17</number><number>5-4</number></mean></mean>
      <mean name="vars"><math>x</math><math>x+y</math><math>x+y+z</math></mean>
      <mean name="varsSimplify" simplify><math>x</math><math>x+y</math><math>x+y+z</math></mean>
      <mean name="varsForcedNumeric" forceNumeric><math>x</math><math>x+y</math><math>x+y+z</math></mean>
      $numbers{name="numbersb"}
      $vars{name="varsb"}
      `,
        });

        let stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/numbers"].stateValues.value.tree).eq(7);
        expect(stateVariables["/numbers"].stateValues.isNumericOperator).eq(
            true,
        );
        expect(stateVariables["/numbers"].stateValues.isNumber).eq(true);
        expect(
            stateVariables["/numbersForceSymbolic"].stateValues.value.tree,
        ).eqls(["/", ["+", 3, 17, 1], 3]);
        expect(
            stateVariables["/numbersForceSymbolic"].stateValues
                .isNumericOperator,
        ).eq(false);
        expect(stateVariables["/numbersForceSymbolic"].stateValues.isNumber).eq(
            false,
        );
        expect(
            stateVariables["/numbersForceSymbolicSimplify"].stateValues.value
                .tree,
        ).eq(7);
        expect(
            stateVariables["/numbersForceSymbolicSimplify"].stateValues
                .isNumericOperator,
        ).eq(false);
        expect(
            stateVariables["/numbersForceSymbolicSimplify"].stateValues
                .isNumber,
        ).eq(true);
        expect(
            stateVariables["/numbersWithNumberMath"].stateValues.value.tree,
        ).eq(7);
        expect(
            stateVariables["/numbersWithNumberMath"].stateValues
                .isNumericOperator,
        ).eq(true);
        expect(
            stateVariables["/numbersWithNumberMath"].stateValues.isNumber,
        ).eq(true);
        expect(
            stateVariables["/numbersWithNumberMathForceSymbolic"].stateValues
                .value.tree,
        ).eqls(["/", ["+", 3, 17, 1], 3]);
        expect(
            stateVariables["/numbersWithNumberMathForceSymbolic"].stateValues
                .isNumericOperator,
        ).eq(false);
        expect(
            stateVariables["/numbersWithNumberMathForceSymbolic"].stateValues
                .isNumber,
        ).eq(false);
        expect(
            stateVariables["/numbersWithNumberMathForceSymbolicSimplify"]
                .stateValues.value.tree,
        ).eq(7);
        expect(
            stateVariables["/numbersWithNumberMathForceSymbolicSimplify"]
                .stateValues.isNumericOperator,
        ).eq(false);
        expect(
            stateVariables["/numbersWithNumberMathForceSymbolicSimplify"]
                .stateValues.isNumber,
        ).eq(true);
        expect(
            stateVariables["/numbersWithNumericMath"].stateValues.value.tree,
        ).eqls(["/", ["+", ["/", 6, 2], 17, 1], 3]);
        expect(
            stateVariables["/numbersWithNumericMath"].stateValues
                .isNumericOperator,
        ).eq(false);
        expect(
            stateVariables["/numbersWithNumericMath"].stateValues.isNumber,
        ).eq(false);
        expect(
            stateVariables["/numbersWithNumericMathSimplify"].stateValues.value
                .tree,
        ).eq(7);
        expect(
            stateVariables["/numbersWithNumericMathSimplify"].stateValues
                .isNumericOperator,
        ).eq(false);
        expect(
            stateVariables["/numbersWithNumericMathSimplify"].stateValues
                .isNumber,
        ).eq(true);
        expect(
            stateVariables["/numbersWithNumericMathForceNumeric"].stateValues
                .value.tree,
        ).eq(7);
        expect(
            stateVariables["/numbersWithNumericMathForceNumeric"].stateValues
                .isNumericOperator,
        ).eq(true);
        expect(
            stateVariables["/numbersWithNumericMathForceNumeric"].stateValues
                .isNumber,
        ).eq(true);
        expect(stateVariables["/withNumberMean"].stateValues.value.tree).eq(6);
        expect(
            stateVariables["/withNumberMean"].stateValues.isNumericOperator,
        ).eq(true);
        expect(stateVariables["/withNumberMean"].stateValues.isNumber).eq(true);
        expect(stateVariables["/vars"].stateValues.value.tree).eqls([
            "/",
            ["+", "x", "x", "y", "x", "y", "z"],
            3,
        ]);
        expect(stateVariables["/vars"].stateValues.isNumericOperator).eq(false);
        expect(stateVariables["/vars"].stateValues.isNumber).eq(false);
        expect(stateVariables["/varsSimplify"].stateValues.value.tree).eqls([
            "/",
            ["+", ["*", 3, "x"], ["*", 2, "y"], "z"],
            3,
        ]);
        expect(
            stateVariables["/varsSimplify"].stateValues.isNumericOperator,
        ).eq(false);
        expect(stateVariables["/varsSimplify"].stateValues.isNumber).eq(false);
        expect(
            stateVariables["/varsForcedNumeric"].stateValues.value.tree,
        ).eqls(NaN);
        expect(
            stateVariables["/varsForcedNumeric"].stateValues.isNumericOperator,
        ).eq(true);
        expect(stateVariables["/varsForcedNumeric"].stateValues.isNumber).eq(
            false,
        );
        expect(stateVariables["/numbersb"].stateValues.value.tree).eq(7);
        expect(stateVariables["/numbersb"].stateValues.isNumericOperator).eq(
            true,
        );
        expect(stateVariables["/numbersb"].stateValues.isNumber).eq(true);
        expect(stateVariables["/varsb"].stateValues.value.tree).eqls([
            "/",
            ["+", "x", "x", "y", "x", "y", "z"],
            3,
        ]);
        expect(stateVariables["/varsb"].stateValues.isNumericOperator).eq(
            false,
        );
        expect(stateVariables["/varsb"].stateValues.isNumber).eq(false);
    });

    it("mean with sugar", async () => {
        let core = await createTestCore({
            doenetML: `
      <number name="a">3</number>
      <number name="b">17</number>
      <number name="c">5-4</number>
      <math name="aNumberMath">3</math>
      <math name="aNumericMath">6/2</math>
      <mean name="numbers"><number>3</number><number>17</number><number>5-4</number></mean>
      <mean name="numbersAsString">3 17 1</mean>
      <mean name="numbersAsStringForceSymbolic" forceSymbolic>3 17 1</mean>
      <mean name="numbersAsStringForceSymbolicSimplify" forceSymbolic simplify>3 17 1</mean>
      <mean name="numericAsString">6/2 17 5-4</mean>
      <mean name="numericAsStringSimplify" simplify>6/2 17 5-4</mean>
      <mean name="numericAsStringForceNumeric" forceNumeric>6/2 17 5-4</mean>
      <mean name="numbersAsMacros">$a$b$c</mean>
      <mean name="numbersAsMacrosForceSymbolic" forceSymbolic>$a$b$c</mean>
      <mean name="numbersAsMacrosForceSymbolicSimplify" forceSymbolic simplify>$a$b$c</mean>
      <mean name="numbersAsMacros2">$a $b $c</mean>
      <mean name="withNumberMathMacro">$aNumberMath$b$c</mean>
      <mean name="withNumberMathMacroForceSymbolic" forceSymbolic>$aNumberMath$b$c</mean>
      <mean name="withNumberMathMacroForceSymbolicSimplify" forceSymbolic simplify>$aNumberMath$b$c</mean>
      <mean name="withNumericMathMacro">$aNumericMath$b$c</mean>
      <mean name="withNumericMathMacroSimplify" simplify>$aNumericMath$b$c</mean>
      <mean name="withNumericMathMacroForceNumeric" forceNumeric>$aNumericMath$b$c</mean>
      <mean name="vars"><math>x</math><math>x+y</math><math>x+y+z</math></mean>
      <mean name="varsAsString">x x+y x+y+z</mean>
      <mean name="varsAsStringSimplify" simplify>x x+y x+y+z</mean>
      <mean name="varsAsStringForceNumeric" forceNumeric>x x+y x+y+z</mean>
      `,
        });

        let stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/numbers"].stateValues.value.tree).eq(7);
        expect(stateVariables["/numbers"].stateValues.isNumericOperator).eq(
            true,
        );
        expect(stateVariables["/numbers"].stateValues.isNumber).eq(true);
        expect(stateVariables["/numbersAsString"].stateValues.value.tree).eq(7);
        expect(
            stateVariables["/numbersAsString"].stateValues.isNumericOperator,
        ).eq(true);
        expect(stateVariables["/numbersAsString"].stateValues.isNumber).eq(
            true,
        );
        expect(
            stateVariables["/numbersAsStringForceSymbolic"].stateValues.value
                .tree,
        ).eqls(["/", ["+", 3, 17, 1], 3]);
        expect(
            stateVariables["/numbersAsStringForceSymbolic"].stateValues
                .isNumericOperator,
        ).eq(false);
        expect(
            stateVariables["/numbersAsStringForceSymbolic"].stateValues
                .isNumber,
        ).eq(false);
        expect(
            stateVariables["/numbersAsStringForceSymbolicSimplify"].stateValues
                .value.tree,
        ).eq(7);
        expect(
            stateVariables["/numbersAsStringForceSymbolicSimplify"].stateValues
                .isNumericOperator,
        ).eq(false);
        expect(
            stateVariables["/numbersAsStringForceSymbolicSimplify"].stateValues
                .isNumber,
        ).eq(true);
        expect(stateVariables["/numericAsString"].stateValues.value.tree).eqls([
            "/",
            ["+", ["/", 6, 2], 17, 5, -4],
            3,
        ]);
        expect(
            stateVariables["/numericAsString"].stateValues.isNumericOperator,
        ).eq(false);
        expect(stateVariables["/numericAsString"].stateValues.isNumber).eq(
            false,
        );
        expect(
            stateVariables["/numericAsStringSimplify"].stateValues.value.tree,
        ).eq(7);
        expect(
            stateVariables["/numericAsStringSimplify"].stateValues
                .isNumericOperator,
        ).eq(false);
        expect(
            stateVariables["/numericAsStringSimplify"].stateValues.isNumber,
        ).eq(true);
        expect(
            stateVariables["/numericAsStringForceNumeric"].stateValues.value
                .tree,
        ).eq(7);
        expect(
            stateVariables["/numericAsStringForceNumeric"].stateValues
                .isNumericOperator,
        ).eq(true);
        expect(
            stateVariables["/numericAsStringForceNumeric"].stateValues.isNumber,
        ).eq(true);
        expect(stateVariables["/numbersAsMacros"].stateValues.value.tree).eq(7);
        expect(
            stateVariables["/numbersAsMacros"].stateValues.isNumericOperator,
        ).eq(true);
        expect(stateVariables["/numbersAsMacros"].stateValues.isNumber).eq(
            true,
        );
        expect(
            stateVariables["/numbersAsMacrosForceSymbolic"].stateValues.value
                .tree,
        ).eqls(["/", ["+", 3, 17, 1], 3]);
        expect(
            stateVariables["/numbersAsMacrosForceSymbolic"].stateValues
                .isNumericOperator,
        ).eq(false);
        expect(
            stateVariables["/numbersAsMacrosForceSymbolic"].stateValues
                .isNumber,
        ).eq(false);
        expect(
            stateVariables["/numbersAsMacrosForceSymbolicSimplify"].stateValues
                .value.tree,
        ).eq(7);
        expect(
            stateVariables["/numbersAsMacrosForceSymbolicSimplify"].stateValues
                .isNumericOperator,
        ).eq(false);
        expect(
            stateVariables["/numbersAsMacrosForceSymbolicSimplify"].stateValues
                .isNumber,
        ).eq(true);
        expect(stateVariables["/numbersAsMacros2"].stateValues.value.tree).eq(
            7,
        );
        expect(
            stateVariables["/numbersAsMacros2"].stateValues.isNumericOperator,
        ).eq(true);
        expect(stateVariables["/numbersAsMacros2"].stateValues.isNumber).eq(
            true,
        );
        expect(
            stateVariables["/withNumberMathMacro"].stateValues.value.tree,
        ).eq(7);
        expect(
            stateVariables["/withNumberMathMacro"].stateValues
                .isNumericOperator,
        ).eq(true);
        expect(stateVariables["/withNumberMathMacro"].stateValues.isNumber).eq(
            true,
        );
        expect(
            stateVariables["/withNumberMathMacroForceSymbolic"].stateValues
                .value.tree,
        ).eqls(["/", ["+", 3, 17, 1], 3]);
        expect(
            stateVariables["/withNumberMathMacroForceSymbolic"].stateValues
                .isNumericOperator,
        ).eq(false);
        expect(
            stateVariables["/withNumberMathMacroForceSymbolic"].stateValues
                .isNumber,
        ).eq(false);
        expect(
            stateVariables["/withNumberMathMacroForceSymbolicSimplify"]
                .stateValues.value.tree,
        ).eq(7);
        expect(
            stateVariables["/withNumberMathMacroForceSymbolicSimplify"]
                .stateValues.isNumericOperator,
        ).eq(false);
        expect(
            stateVariables["/withNumberMathMacroForceSymbolicSimplify"]
                .stateValues.isNumber,
        ).eq(true);
        expect(
            stateVariables["/withNumericMathMacro"].stateValues.value.tree,
        ).eqls(["/", ["+", ["/", 6, 2], 17, 1], 3]);
        expect(
            stateVariables["/withNumericMathMacro"].stateValues
                .isNumericOperator,
        ).eq(false);
        expect(stateVariables["/withNumericMathMacro"].stateValues.isNumber).eq(
            false,
        );
        expect(
            stateVariables["/withNumericMathMacroSimplify"].stateValues.value
                .tree,
        ).eq(7);
        expect(
            stateVariables["/withNumericMathMacroSimplify"].stateValues
                .isNumericOperator,
        ).eq(false);
        expect(
            stateVariables["/withNumericMathMacroSimplify"].stateValues
                .isNumber,
        ).eq(true);
        expect(
            stateVariables["/withNumericMathMacroForceNumeric"].stateValues
                .value.tree,
        ).eq(7);
        expect(
            stateVariables["/withNumericMathMacroForceNumeric"].stateValues
                .isNumericOperator,
        ).eq(true);
        expect(
            stateVariables["/withNumericMathMacroForceNumeric"].stateValues
                .isNumber,
        ).eq(true);
        expect(stateVariables["/vars"].stateValues.value.tree).eqls([
            "/",
            ["+", "x", "x", "y", "x", "y", "z"],
            3,
        ]);
        expect(stateVariables["/vars"].stateValues.isNumericOperator).eq(false);
        expect(stateVariables["/vars"].stateValues.isNumber).eq(false);
        expect(stateVariables["/varsAsString"].stateValues.value.tree).eqls([
            "/",
            ["+", "x", "x", "y", "x", "y", "z"],
            3,
        ]);
        expect(
            stateVariables["/varsAsString"].stateValues.isNumericOperator,
        ).eq(false);
        expect(stateVariables["/varsAsString"].stateValues.isNumber).eq(false);
        expect(
            stateVariables["/varsAsStringSimplify"].stateValues
                .isNumericOperator,
        ).eq(false);
        expect(
            stateVariables["/varsAsStringSimplify"].stateValues.value.tree,
        ).eqls(["/", ["+", ["*", 3, "x"], ["*", 2, "y"], "z"], 3]);
        expect(stateVariables["/varsAsStringSimplify"].stateValues.isNumber).eq(
            false,
        );
        expect(
            stateVariables["/varsAsStringForceNumeric"].stateValues.value.tree,
        ).eqls(NaN);
        expect(
            stateVariables["/varsAsStringForceNumeric"].stateValues
                .isNumericOperator,
        ).eq(true);
        expect(
            stateVariables["/varsAsStringForceNumeric"].stateValues.isNumber,
        ).eq(false);
    });

    it("mean as math expression", async () => {
        let core = await createTestCore({
            doenetML: `
      <group name="nums" asList>
        <number name="a">3</number>
        <number name="b">17</number>
        <number name="c">5-4</number>
      </group>
      <math name="numberString">mean(3,17,5-4)</math>
      <math name="numberStringSimplify" simplify>mean(3,17,5-4)</math>
      <math name="numberStringProduct">mean(3 17 5-4)</math>
      <math name="numberStringProductSimplify" simplify>mean(3 17 5-4)</math>
      <math name="numberComponentsCommas">
        mean(<number>3</number>,<number>17</number>,<number>5-4</number>)
      </math>
      <math name="numberComponentsCommasSimplify" simplify>
      mean(<number>3</number>,<number>17</number>,<number>5-4</number>)
      </math>
      <math name="numberComponentsProduct">
        mean(<number>3</number><number>17</number><number>5-4</number>)
      </math>
      <math name="numberComponentsProductSimplify" simplify>
        mean(<number>3</number><number>17</number><number>5-4</number>)
      </math>
      <math name="macrosCommas">
        mean($a,$b,$c)
      </math>
      <math name="macrosCommasSimplify" simplify>
        mean($a,$b,$c)
      </math>
      <math name="macrosProduct">
        mean($a$b$c)
      </math>
      <math name="macrosProductSimplify" simplify>
        mean($a$b$c)
      </math>
      <math name="group">
        mean($nums)
      </math>
      <math name="groupSimplify" simplify>
        mean($nums)
      </math>
      <math name="groupPlus">
        mean($nums, $a, $b, $c)
      </math>
      <math name="groupPlusSimplify" simplify>
        mean($nums, $a, $b, $c)
      </math>
      <math name="groupPlus2">
        mean($a, $b, $c, $nums)
      </math>
      <math name="groupPlus2Simplify" simplify>
        mean($a, $b, $c, $nums)
      </math>
      <math name="groupPlus3">
        mean($a, $b, $nums, $c)
      </math>
      <math name="groupPlus3Simplify" simplify>
        mean($a, $b, $nums, $c)
      </math>
      `,
        });

        let stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/numberString"].stateValues.value.tree).eqls([
            "apply",
            "mean",
            ["tuple", 3, 17, ["+", 5, -4]],
        ]);
        expect(stateVariables["/numberString"].stateValues.isNumber).eq(false);
        expect(
            stateVariables["/numberStringSimplify"].stateValues.value.tree,
        ).eq(7);
        expect(stateVariables["/numberStringSimplify"].stateValues.isNumber).eq(
            true,
        );
        expect(
            stateVariables["/numberStringProduct"].stateValues.value.tree,
        ).eqls(["apply", "mean", ["+", ["*", 3, 17, 5], -4]]);
        expect(stateVariables["/numberStringProduct"].stateValues.isNumber).eq(
            false,
        );
        expect(
            stateVariables["/numberStringProductSimplify"].stateValues.value
                .tree,
        ).eq(251);
        expect(
            stateVariables["/numberStringProductSimplify"].stateValues.isNumber,
        ).eq(true);

        expect(
            stateVariables["/numberComponentsCommas"].stateValues.value.tree,
        ).eqls(["apply", "mean", ["tuple", 3, 17, 1]]);
        expect(
            stateVariables["/numberComponentsCommas"].stateValues.isNumber,
        ).eq(false);
        expect(
            stateVariables["/numberComponentsCommasSimplify"].stateValues.value
                .tree,
        ).eq(7);
        expect(
            stateVariables["/numberComponentsCommasSimplify"].stateValues
                .isNumber,
        ).eq(true);
        expect(
            stateVariables["/numberComponentsProduct"].stateValues.value.tree,
        ).eqls(["apply", "mean", ["*", 3, 17, 1]]);
        expect(
            stateVariables["/numberComponentsProduct"].stateValues.isNumber,
        ).eq(false);
        expect(
            stateVariables["/numberComponentsProductSimplify"].stateValues.value
                .tree,
        ).eq(51);
        expect(
            stateVariables["/numberComponentsProductSimplify"].stateValues
                .isNumber,
        ).eq(true);

        expect(stateVariables["/macrosCommas"].stateValues.value.tree).eqls([
            "apply",
            "mean",
            ["tuple", 3, 17, 1],
        ]);
        expect(stateVariables["/macrosCommas"].stateValues.isNumber).eq(false);
        expect(
            stateVariables["/macrosCommasSimplify"].stateValues.value.tree,
        ).eq(7);
        expect(stateVariables["/macrosCommasSimplify"].stateValues.isNumber).eq(
            true,
        );
        expect(stateVariables["/macrosProduct"].stateValues.value.tree).eqls([
            "apply",
            "mean",
            ["*", 3, 17, 1],
        ]);
        expect(stateVariables["/macrosProduct"].stateValues.isNumber).eq(false);
        expect(
            stateVariables["/macrosProductSimplify"].stateValues.value.tree,
        ).eq(51);
        expect(
            stateVariables["/macrosProductSimplify"].stateValues.isNumber,
        ).eq(true);

        expect(stateVariables["/group"].stateValues.value.tree).eqls([
            "apply",
            "mean",
            ["tuple", 3, 17, 1],
        ]);
        expect(stateVariables["/group"].stateValues.isNumber).eq(false);
        expect(stateVariables["/groupSimplify"].stateValues.value.tree).eq(7);
        expect(stateVariables["/groupSimplify"].stateValues.isNumber).eq(true);

        expect(stateVariables["/groupPlus"].stateValues.value.tree).eqls([
            "apply",
            "mean",
            ["tuple", 3, 17, 1, 3, 17, 1],
        ]);
        expect(stateVariables["/groupPlus"].stateValues.isNumber).eq(false);
        expect(stateVariables["/groupPlusSimplify"].stateValues.value.tree).eq(
            7,
        );
        expect(stateVariables["/groupPlusSimplify"].stateValues.isNumber).eq(
            true,
        );

        expect(stateVariables["/groupPlus2"].stateValues.value.tree).eqls([
            "apply",
            "mean",
            ["tuple", 3, 17, 1, 3, 17, 1],
        ]);
        expect(stateVariables["/groupPlus2"].stateValues.isNumber).eq(false);
        expect(stateVariables["/groupPlus2Simplify"].stateValues.value.tree).eq(
            7,
        );
        expect(stateVariables["/groupPlus2Simplify"].stateValues.isNumber).eq(
            true,
        );

        expect(stateVariables["/groupPlus3"].stateValues.value.tree).eqls([
            "apply",
            "mean",
            ["tuple", 3, 17, 3, 17, 1, 1],
        ]);
        expect(stateVariables["/groupPlus3"].stateValues.isNumber).eq(false);
        expect(stateVariables["/groupPlus3Simplify"].stateValues.value.tree).eq(
            7,
        );
        expect(stateVariables["/groupPlus3Simplify"].stateValues.isNumber).eq(
            true,
        );
    });

    it("mean additional cases", async () => {
        let core = await createTestCore({
            doenetML: `
    <p name="pPrime">Mean of first primes: <mean name="meanPrime">2 3 5 7</mean></p>
    <p>Copying that mean: $meanPrime{name="meanPrimeb"}</p>
    $pPrime{name="pPrimeb"}

    <p name="p100">Mean of numbers from 1 to 100: <mean name="mean100"><sequence to="100" /></mean></p>
    <p>Copying that mean: $mean100{name="mean100b"}</p>
    $p100{name="p100b"}
    `,
        });

        let stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/meanPrime"].stateValues.value.tree).eq(4.25);
        expect(stateVariables["/meanPrimeb"].stateValues.value.tree).eq(4.25);
        expect(
            stateVariables[
                stateVariables["/pPrimeb"].activeChildren[1].componentName
            ].stateValues.value.tree,
        ).eq(4.25);
        expect(stateVariables["/mean100"].stateValues.value.tree).eq(50.5);
        expect(stateVariables["/mean100b"].stateValues.value.tree).eq(50.5);
        expect(
            stateVariables[
                stateVariables["/p100b"].activeChildren[1].componentName
            ].stateValues.value.tree,
        ).eq(50.5);
    });

    it("median", async () => {
        let core = await createTestCore({
            doenetML: `
      <median name="numbers"><number>3</number><number>17</number><number>5-4</number></median>
      <median name="sugared">1 4 5 10000</median>
      <median name="noSymbolic">1 4 5 x+1</median>
      `,
        });

        let stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/numbers"].stateValues.value.tree).eq(3);
        expect(stateVariables["/numbers"].stateValues.isNumericOperator).eq(
            true,
        );
        expect(stateVariables["/numbers"].stateValues.isNumber).eq(true);

        expect(stateVariables["/sugared"].stateValues.value.tree).eq(4.5);
        expect(stateVariables["/sugared"].stateValues.isNumericOperator).eq(
            true,
        );
        expect(stateVariables["/sugared"].stateValues.isNumber).eq(true);

        expect(stateVariables["/noSymbolic"].stateValues.value.tree).eqls(NaN);
        expect(stateVariables["/noSymbolic"].stateValues.isNumericOperator).eq(
            true,
        );
        expect(stateVariables["/noSymbolic"].stateValues.isNumber).eq(false);
    });

    // TODO: skipping most checks of ugly expressions for now
    it("variance", async () => {
        let core = await createTestCore({
            doenetML: `
      <variance name="numbers"><number>3</number><number>17</number><number>5-4</number></variance>
      <variance name="numbersForceSymbolic" forceSymbolic><number>3</number><number>17</number><number>5-4</number></variance>
      <variance name="numbersForceSymbolicSimplify" forceSymbolic simplify><number>3</number><number>17</number><number>5-4</number></variance>
      <variance name="numbersWithNumberMath"><math>3</math><number>17</number><number>5-4</number></variance>
      <variance name="numbersWithNumberMathForceSymbolic" forceSymbolic><math>3</math><number>17</number><number>5-4</number></variance>
      <variance name="numbersWithNumberMathForceSymbolicSimplify" forceSymbolic simplify><math>3</math><number>17</number><number>5-4</number></variance>
      <variance name="numbersWithNumericMath"><math>6/2</math><number>17</number><number>5-4</number></variance>
      <variance name="numbersWithNumericMathSimplify" simplify><math>6/2</math><number>17</number><number>5-4</number></variance>
      <variance name="numbersWithNumericMathForceNumeric" forceNumeric><math>6/2</math><number>17</number><number>5-4</number></variance>
      <variance name="withNumberVariance"><math>3</math><variance><number>17</number><number>5-4</number></variance></variance>
      <variance name="vars"><math>x</math><math>x+y</math><math>x+y+z</math></variance>
      <variance name="varsSimplify" simplify><math>x</math><math>x+y</math><math>x+y+z</math></variance>
      <variance name="varsForcedNumeric" forceNumeric><math>x</math><math>x+y</math><math>x+y+z</math></variance>
      $numbers{name="numbersb"}
      $vars{name="varsb"}
      `,
        });

        let stateVariables = await returnAllStateVariables(core);

        let theVariance = me.math.variance([3, 17, 1]);
        let theVarianceString = theVariance.toString();

        expect(stateVariables["/numbers"].stateValues.value.tree).eq(
            theVariance,
        );
        expect(stateVariables["/numbers"].stateValues.isNumericOperator).eq(
            true,
        );
        expect(stateVariables["/numbers"].stateValues.isNumber).eq(true);
        // expect(stateVariables['/numbersForceSymbolic'].stateValues.value.tree).eqls(['/', ['+', 3, 17, 1], 3]);
        expect(
            stateVariables["/numbersForceSymbolic"].stateValues
                .isNumericOperator,
        ).eq(false);
        expect(stateVariables["/numbersForceSymbolic"].stateValues.isNumber).eq(
            false,
        );
        expect(
            stateVariables["/numbersForceSymbolicSimplify"].stateValues.value
                .tree,
        ).eq(theVariance);
        expect(
            stateVariables["/numbersForceSymbolicSimplify"].stateValues
                .isNumericOperator,
        ).eq(false);
        expect(
            stateVariables["/numbersForceSymbolicSimplify"].stateValues
                .isNumber,
        ).eq(true);
        expect(
            stateVariables["/numbersWithNumberMath"].stateValues.value.tree,
        ).eq(theVariance);
        expect(
            stateVariables["/numbersWithNumberMath"].stateValues
                .isNumericOperator,
        ).eq(true);
        expect(
            stateVariables["/numbersWithNumberMath"].stateValues.isNumber,
        ).eq(true);
        // expect(stateVariables['/numbersWithNumberMathForceSymbolic'].stateValues.value.tree).eqls(['/', ['+', 3, 17, 1], 3]);
        expect(
            stateVariables["/numbersWithNumberMathForceSymbolic"].stateValues
                .isNumericOperator,
        ).eq(false);
        expect(
            stateVariables["/numbersWithNumberMathForceSymbolic"].stateValues
                .isNumber,
        ).eq(false);
        expect(
            stateVariables["/numbersWithNumberMathForceSymbolicSimplify"]
                .stateValues.value.tree,
        ).eq(theVariance);
        expect(
            stateVariables["/numbersWithNumberMathForceSymbolicSimplify"]
                .stateValues.isNumericOperator,
        ).eq(false);
        expect(
            stateVariables["/numbersWithNumberMathForceSymbolicSimplify"]
                .stateValues.isNumber,
        ).eq(true);
        // expect(stateVariables['/numbersWithNumericMath'].stateValues.value.tree).eqls(['/', ['+', ['/', 6, 2], 17, 1], 3]);
        expect(
            stateVariables["/numbersWithNumericMath"].stateValues
                .isNumericOperator,
        ).eq(false);
        expect(
            stateVariables["/numbersWithNumericMath"].stateValues.isNumber,
        ).eq(false);
        expect(
            stateVariables["/numbersWithNumericMathSimplify"].stateValues.value
                .tree,
        ).eq(theVariance);
        expect(
            stateVariables["/numbersWithNumericMathSimplify"].stateValues
                .isNumericOperator,
        ).eq(false);
        expect(
            stateVariables["/numbersWithNumericMathSimplify"].stateValues
                .isNumber,
        ).eq(true);
        expect(
            stateVariables["/numbersWithNumericMathForceNumeric"].stateValues
                .value.tree,
        ).eq(theVariance);
        expect(
            stateVariables["/numbersWithNumericMathForceNumeric"].stateValues
                .isNumericOperator,
        ).eq(true);
        expect(
            stateVariables["/numbersWithNumericMathForceNumeric"].stateValues
                .isNumber,
        ).eq(true);
        expect(stateVariables["/withNumberVariance"].stateValues.value.tree).eq(
            me.math.variance([3, me.math.variance([17, 1])]),
        );
        expect(
            stateVariables["/withNumberVariance"].stateValues.isNumericOperator,
        ).eq(true);
        expect(stateVariables["/withNumberVariance"].stateValues.isNumber).eq(
            true,
        );
        // expect(stateVariables['/vars'].stateValues.value.tree).eqls(['/', ['+', 'x', 'x', 'y', 'x', 'y', 'z'], 3]);
        expect(stateVariables["/vars"].stateValues.isNumericOperator).eq(false);
        expect(stateVariables["/vars"].stateValues.isNumber).eq(false);
        // expect(stateVariables['/varsSimplify'].stateValues.value.tree).eqls(['/', ['+', ['*', 3, 'x'], ['*', 2, 'y'], 'z'], 3]);
        expect(
            stateVariables["/varsSimplify"].stateValues.isNumericOperator,
        ).eq(false);
        expect(stateVariables["/varsSimplify"].stateValues.isNumber).eq(false);
        expect(
            stateVariables["/varsForcedNumeric"].stateValues.value.tree,
        ).eqls(NaN);
        expect(
            stateVariables["/varsForcedNumeric"].stateValues.isNumericOperator,
        ).eq(true);
        expect(stateVariables["/varsForcedNumeric"].stateValues.isNumber).eq(
            false,
        );
        expect(stateVariables["/numbersb"].stateValues.value.tree).eq(
            theVariance,
        );
        expect(stateVariables["/numbersb"].stateValues.isNumericOperator).eq(
            true,
        );
        expect(stateVariables["/numbersb"].stateValues.isNumber).eq(true);
        // expect(stateVariables["/varsb"].stateValues.value.tree).eqls(['/', ['+', 'x', 'x', 'y', 'x', 'y', 'z'], 3]);
        expect(stateVariables["/varsb"].stateValues.isNumericOperator).eq(
            false,
        );
        expect(stateVariables["/varsb"].stateValues.isNumber).eq(false);
    });

    it("variance with sugar", async () => {
        let core = await createTestCore({
            doenetML: `
      <number name="a">3</number>
      <number name="b">17</number>
      <number name="c">5-4</number>
      <math name="aNumberMath">3</math>
      <math name="aNumericMath">6/2</math>
      <variance name="numbers"><number>3</number><number>17</number><number>5-4</number></variance>
      <variance name="numbersAsString">3 17 1</variance>
      <variance name="numbersAsStringForceSymbolic" forceSymbolic>3 17 1</variance>
      <variance name="numbersAsStringForceSymbolicSimplify" forceSymbolic simplify>3 17 1</variance>
      <variance name="numericAsString">6/2 17 5-4</variance>
      <variance name="numericAsStringSimplify" simplify>6/2 17 5-4</variance>
      <variance name="numericAsStringForceNumeric" forceNumeric>6/2 17 5-4</variance>
      <variance name="numbersAsMacros">$a$b$c</variance>
      <variance name="numbersAsMacrosForceSymbolic" forceSymbolic>$a$b$c</variance>
      <variance name="numbersAsMacrosForceSymbolicSimplify" forceSymbolic simplify>$a$b$c</variance>
      <variance name="numbersAsMacros2">$a $b $c</variance>
      <variance name="withNumberMathMacro">$aNumberMath$b$c</variance>
      <variance name="withNumberMathMacroForceSymbolic" forceSymbolic>$aNumberMath$b$c</variance>
      <variance name="withNumberMathMacroForceSymbolicSimplify" forceSymbolic simplify>$aNumberMath$b$c</variance>
      <variance name="withNumericMathMacro">$aNumericMath$b$c</variance>
      <variance name="withNumericMathMacroSimplify" simplify>$aNumericMath$b$c</variance>
      <variance name="withNumericMathMacroForceNumeric" forceNumeric>$aNumericMath$b$c</variance>
      <variance name="vars"><math>x</math><math>x+y</math><math>x+y+z</math></variance>
      <variance name="varsAsString">x x+y x+y+z</variance>
      <variance name="varsAsStringSimplify" simplify>x x+y x+y+z</variance>
      <variance name="varsAsStringForceNumeric" forceNumeric>x x+y x+y+z</variance>
      `,
        });

        let theVariance = me.math.variance([3, 17, 1]);
        let theVarianceString = theVariance.toString();

        let stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/numbers"].stateValues.value.tree).eq(
            theVariance,
        );
        expect(stateVariables["/numbers"].stateValues.isNumericOperator).eq(
            true,
        );
        expect(stateVariables["/numbers"].stateValues.isNumber).eq(true);
        expect(stateVariables["/numbersAsString"].stateValues.value.tree).eq(
            theVariance,
        );
        expect(
            stateVariables["/numbersAsString"].stateValues.isNumericOperator,
        ).eq(true);
        expect(stateVariables["/numbersAsString"].stateValues.isNumber).eq(
            true,
        );
        // expect(stateVariables['/numbersAsStringForceSymbolic'].stateValues.value.tree).eqls(['/', ['+', 3, 17, 1], 3]);
        expect(
            stateVariables["/numbersAsStringForceSymbolic"].stateValues
                .isNumericOperator,
        ).eq(false);
        expect(
            stateVariables["/numbersAsStringForceSymbolic"].stateValues
                .isNumber,
        ).eq(false);
        expect(
            stateVariables["/numbersAsStringForceSymbolicSimplify"].stateValues
                .value.tree,
        ).eq(theVariance);
        expect(
            stateVariables["/numbersAsStringForceSymbolicSimplify"].stateValues
                .isNumericOperator,
        ).eq(false);
        expect(
            stateVariables["/numbersAsStringForceSymbolicSimplify"].stateValues
                .isNumber,
        ).eq(true);
        // expect(stateVariables['/numericAsString'].stateValues.value.tree).eqls(['/', ['+', ['/', 6, 2], 17, 5, -4], 3]);
        expect(
            stateVariables["/numericAsString"].stateValues.isNumericOperator,
        ).eq(false);
        expect(stateVariables["/numericAsString"].stateValues.isNumber).eq(
            false,
        );
        expect(
            stateVariables["/numericAsStringSimplify"].stateValues.value.tree,
        ).eq(theVariance);
        expect(
            stateVariables["/numericAsStringSimplify"].stateValues
                .isNumericOperator,
        ).eq(false);
        expect(
            stateVariables["/numericAsStringSimplify"].stateValues.isNumber,
        ).eq(true);
        expect(
            stateVariables["/numericAsStringForceNumeric"].stateValues.value
                .tree,
        ).eq(theVariance);
        expect(
            stateVariables["/numericAsStringForceNumeric"].stateValues
                .isNumericOperator,
        ).eq(true);
        expect(
            stateVariables["/numericAsStringForceNumeric"].stateValues.isNumber,
        ).eq(true);
        expect(stateVariables["/numbersAsMacros"].stateValues.value.tree).eq(
            theVariance,
        );
        expect(
            stateVariables["/numbersAsMacros"].stateValues.isNumericOperator,
        ).eq(true);
        expect(stateVariables["/numbersAsMacros"].stateValues.isNumber).eq(
            true,
        );
        // expect(stateVariables['/numbersAsMacrosForceSymbolic'].stateValues.value.tree).eqls(['/', ['+', 3, 17, 1], 3]);
        expect(
            stateVariables["/numbersAsMacrosForceSymbolic"].stateValues
                .isNumericOperator,
        ).eq(false);
        expect(
            stateVariables["/numbersAsMacrosForceSymbolic"].stateValues
                .isNumber,
        ).eq(false);
        expect(
            stateVariables["/numbersAsMacrosForceSymbolicSimplify"].stateValues
                .value.tree,
        ).eq(theVariance);
        expect(
            stateVariables["/numbersAsMacrosForceSymbolicSimplify"].stateValues
                .isNumericOperator,
        ).eq(false);
        expect(
            stateVariables["/numbersAsMacrosForceSymbolicSimplify"].stateValues
                .isNumber,
        ).eq(true);
        expect(stateVariables["/numbersAsMacros2"].stateValues.value.tree).eq(
            theVariance,
        );
        expect(
            stateVariables["/numbersAsMacros2"].stateValues.isNumericOperator,
        ).eq(true);
        expect(stateVariables["/numbersAsMacros2"].stateValues.isNumber).eq(
            true,
        );
        expect(
            stateVariables["/withNumberMathMacro"].stateValues.value.tree,
        ).eq(theVariance);
        expect(
            stateVariables["/withNumberMathMacro"].stateValues
                .isNumericOperator,
        ).eq(true);
        expect(stateVariables["/withNumberMathMacro"].stateValues.isNumber).eq(
            true,
        );
        // expect(stateVariables['/withNumberMathMacroForceSymbolic'].stateValues.value.tree).eqls(['/', ['+', 3, 17, 1], 3]);
        expect(
            stateVariables["/withNumberMathMacroForceSymbolic"].stateValues
                .isNumericOperator,
        ).eq(false);
        expect(
            stateVariables["/withNumberMathMacroForceSymbolic"].stateValues
                .isNumber,
        ).eq(false);
        expect(
            stateVariables["/withNumberMathMacroForceSymbolicSimplify"]
                .stateValues.value.tree,
        ).eq(theVariance);
        expect(
            stateVariables["/withNumberMathMacroForceSymbolicSimplify"]
                .stateValues.isNumericOperator,
        ).eq(false);
        expect(
            stateVariables["/withNumberMathMacroForceSymbolicSimplify"]
                .stateValues.isNumber,
        ).eq(true);
        // expect(stateVariables['/withNumericMathMacro'].stateValues.value.tree).eqls(['/', ['+', ['/', 6, 2], 17, 1], 3]);
        expect(
            stateVariables["/withNumericMathMacro"].stateValues
                .isNumericOperator,
        ).eq(false);
        expect(stateVariables["/withNumericMathMacro"].stateValues.isNumber).eq(
            false,
        );
        expect(
            stateVariables["/withNumericMathMacroSimplify"].stateValues.value
                .tree,
        ).eq(theVariance);
        expect(
            stateVariables["/withNumericMathMacroSimplify"].stateValues
                .isNumericOperator,
        ).eq(false);
        expect(
            stateVariables["/withNumericMathMacroSimplify"].stateValues
                .isNumber,
        ).eq(true);
        expect(
            stateVariables["/withNumericMathMacroForceNumeric"].stateValues
                .value.tree,
        ).eq(theVariance);
        expect(
            stateVariables["/withNumericMathMacroForceNumeric"].stateValues
                .isNumericOperator,
        ).eq(true);
        expect(
            stateVariables["/withNumericMathMacroForceNumeric"].stateValues
                .isNumber,
        ).eq(true);
        // expect(stateVariables['/vars'].stateValues.value.tree).eqls(['/', ['+', 'x', 'x', 'y', 'x', 'y', 'z'], 3]);
        expect(stateVariables["/vars"].stateValues.isNumericOperator).eq(false);
        expect(stateVariables["/vars"].stateValues.isNumber).eq(false);
        // expect(stateVariables['/varsAsString'].stateValues.value.tree).eqls(['/', ['+', 'x', 'x', 'y', 'x', 'y', 'z'], 3]);
        expect(
            stateVariables["/varsAsString"].stateValues.isNumericOperator,
        ).eq(false);
        expect(stateVariables["/varsAsString"].stateValues.isNumber).eq(false);
        expect(
            stateVariables["/varsAsStringSimplify"].stateValues
                .isNumericOperator,
        ).eq(false);
        // expect(stateVariables['/varsAsStringSimplify'].stateValues.value.tree).eqls(['/', ['+', ['*', 3, 'x'], ['*', 2, 'y'], 'z'], 3]);
        expect(stateVariables["/varsAsStringSimplify"].stateValues.isNumber).eq(
            false,
        );
        expect(
            stateVariables["/varsAsStringForceNumeric"].stateValues.value.tree,
        ).eqls(NaN);
        expect(
            stateVariables["/varsAsStringForceNumeric"].stateValues
                .isNumericOperator,
        ).eq(true);
        expect(
            stateVariables["/varsAsStringForceNumeric"].stateValues.isNumber,
        ).eq(false);
    });

    it("variance as math expression", async () => {
        let core = await createTestCore({
            doenetML: `
      <group name="nums" asList>
        <number name="a">3</number>
        <number name="b">17</number>
        <number name="c">5-4</number>
      </group>
      <math name="numberString">variance(3,17,5-4)</math>
      <math name="numberStringSimplify" simplify>variance(3,17,5-4)</math>
      <math name="numberStringProduct">variance(3 17 5-4)</math>
      <math name="numberStringProductSimplify" simplify>variance(3 17 5-4)</math>
      <math name="numberComponentsCommas">
        variance(<number>3</number>,<number>17</number>,<number>5-4</number>)
      </math>
      <math name="numberComponentsCommasSimplify" simplify>
      variance(<number>3</number>,<number>17</number>,<number>5-4</number>)
      </math>
      <math name="numberComponentsProduct">
        variance(<number>3</number><number>17</number><number>5-4</number>)
      </math>
      <math name="numberComponentsProductSimplify" simplify>
        variance(<number>3</number><number>17</number><number>5-4</number>)
      </math>
      <math name="macrosCommas">
        variance($a,$b,$c)
      </math>
      <math name="macrosCommasSimplify" simplify>
        variance($a,$b,$c)
      </math>
      <math name="macrosProduct">
        variance($a$b$c)
      </math>
      <math name="macrosProductSimplify" simplify>
        variance($a$b$c)
      </math>
      <math name="group">
        variance($nums)
      </math>
      <math name="groupSimplify" simplify>
        variance($nums)
      </math>
      <math name="groupPlus">
        variance($nums, $a, $b, 13)
      </math>
      <math name="groupPlusSimplify" simplify>
        variance($nums, $a, $b, 13)
      </math>
      <math name="groupPlus2">
        variance($a, $b, 13, $nums)
      </math>
      <math name="groupPlus2Simplify" simplify>
        variance($a, $b, 13, $nums)
      </math>
      <math name="groupPlus3">
        variance($a, $b, $nums, 13)
      </math>
      <math name="groupPlus3Simplify" simplify>
        variance($a, $b, $nums, 13)
      </math>
      `,
        });

        let theVariance = me.math.variance([3, 17, 1]);
        let theVariance2 = me.math.variance([3, 17, 1, 3, 17, 13]);

        let stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/numberString"].stateValues.value.tree).eqls([
            "apply",
            "variance",
            ["tuple", 3, 17, ["+", 5, -4]],
        ]);
        expect(stateVariables["/numberString"].stateValues.isNumber).eq(false);
        expect(
            stateVariables["/numberStringSimplify"].stateValues.value.tree,
        ).eq(theVariance);
        expect(stateVariables["/numberStringSimplify"].stateValues.isNumber).eq(
            true,
        );
        expect(
            stateVariables["/numberStringProduct"].stateValues.value.tree,
        ).eqls(["apply", "variance", ["+", ["*", 3, 17, 5], -4]]);
        expect(stateVariables["/numberStringProduct"].stateValues.isNumber).eq(
            false,
        );
        expect(
            stateVariables["/numberStringProductSimplify"].stateValues.value
                .tree,
        ).eq(0);
        expect(
            stateVariables["/numberStringProductSimplify"].stateValues.isNumber,
        ).eq(true);

        expect(
            stateVariables["/numberComponentsCommas"].stateValues.value.tree,
        ).eqls(["apply", "variance", ["tuple", 3, 17, 1]]);
        expect(
            stateVariables["/numberComponentsCommas"].stateValues.isNumber,
        ).eq(false);
        expect(
            stateVariables["/numberComponentsCommasSimplify"].stateValues.value
                .tree,
        ).eq(theVariance);
        expect(
            stateVariables["/numberComponentsCommasSimplify"].stateValues
                .isNumber,
        ).eq(true);
        expect(
            stateVariables["/numberComponentsProduct"].stateValues.value.tree,
        ).eqls(["apply", "variance", ["*", 3, 17, 1]]);
        expect(
            stateVariables["/numberComponentsProduct"].stateValues.isNumber,
        ).eq(false);
        expect(
            stateVariables["/numberComponentsProductSimplify"].stateValues.value
                .tree,
        ).eq(0);
        expect(
            stateVariables["/numberComponentsProductSimplify"].stateValues
                .isNumber,
        ).eq(true);

        expect(stateVariables["/macrosCommas"].stateValues.value.tree).eqls([
            "apply",
            "variance",
            ["tuple", 3, 17, 1],
        ]);
        expect(stateVariables["/macrosCommas"].stateValues.isNumber).eq(false);
        expect(
            stateVariables["/macrosCommasSimplify"].stateValues.value.tree,
        ).eq(theVariance);
        expect(stateVariables["/macrosCommasSimplify"].stateValues.isNumber).eq(
            true,
        );
        expect(stateVariables["/macrosProduct"].stateValues.value.tree).eqls([
            "apply",
            "variance",
            ["*", 3, 17, 1],
        ]);
        expect(stateVariables["/macrosProduct"].stateValues.isNumber).eq(false);
        expect(
            stateVariables["/macrosProductSimplify"].stateValues.value.tree,
        ).eq(0);
        expect(
            stateVariables["/macrosProductSimplify"].stateValues.isNumber,
        ).eq(true);

        expect(stateVariables["/group"].stateValues.value.tree).eqls([
            "apply",
            "variance",
            ["tuple", 3, 17, 1],
        ]);
        expect(stateVariables["/group"].stateValues.isNumber).eq(false);
        expect(stateVariables["/groupSimplify"].stateValues.value.tree).eq(
            theVariance,
        );
        expect(stateVariables["/groupSimplify"].stateValues.isNumber).eq(true);

        expect(stateVariables["/groupPlus"].stateValues.value.tree).eqls([
            "apply",
            "variance",
            ["tuple", 3, 17, 1, 3, 17, 13],
        ]);
        expect(stateVariables["/groupPlus"].stateValues.isNumber).eq(false);
        expect(stateVariables["/groupPlusSimplify"].stateValues.value.tree).eq(
            theVariance2,
        );
        expect(stateVariables["/groupPlusSimplify"].stateValues.isNumber).eq(
            true,
        );

        expect(stateVariables["/groupPlus2"].stateValues.value.tree).eqls([
            "apply",
            "variance",
            ["tuple", 3, 17, 13, 3, 17, 1],
        ]);
        expect(stateVariables["/groupPlus2"].stateValues.isNumber).eq(false);
        expect(stateVariables["/groupPlus2Simplify"].stateValues.value.tree).eq(
            theVariance2,
        );
        expect(stateVariables["/groupPlus2Simplify"].stateValues.isNumber).eq(
            true,
        );

        expect(stateVariables["/groupPlus3"].stateValues.value.tree).eqls([
            "apply",
            "variance",
            ["tuple", 3, 17, 3, 17, 1, 13],
        ]);
        expect(stateVariables["/groupPlus3"].stateValues.isNumber).eq(false);
        expect(stateVariables["/groupPlus3Simplify"].stateValues.value.tree).eq(
            theVariance2,
        );
        expect(stateVariables["/groupPlus3Simplify"].stateValues.isNumber).eq(
            true,
        );
    });

    it("variance additional cases", async () => {
        let core = await createTestCore({
            doenetML: `
    <p name="pPrime">Variance of first primes: <variance displayDigits="10" name="variancePrime">2 3 5 7</variance></p>
    <p>Copying that variance: $variancePrime{name="variancePrimeb"}</p>
    $pPrime{name="pPrimeb"}

    <p name="p100">Variance of numbers from 1 to 100: <variance displayDigits="10" name="variance100"><sequence to="100" /></variance></p>
    <p>Copying that variance: $variance100{name="variance100b"}</p>
    $p100{name="p100b"}
    `,
        });

        let variancePrimes = me.math.variance(2, 3, 5, 7);
        let variance100 = me.math.variance(
            Array.from({ length: 100 }, (_, i) => i + 1),
        );

        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/variancePrime"].stateValues.value.tree).closeTo(
            variancePrimes,
            1e-12,
        );
        expect(
            stateVariables["/variancePrimeb"].stateValues.value.tree,
        ).closeTo(variancePrimes, 1e-12);
        expect(
            stateVariables[
                stateVariables["/pPrimeb"].activeChildren[1].componentName
            ].stateValues.value.tree,
        ).closeTo(variancePrimes, 1e-12);
        expect(stateVariables["/variance100"].stateValues.value.tree).closeTo(
            variance100,
            1e-12,
        );
        expect(stateVariables["/variance100b"].stateValues.value.tree).closeTo(
            variance100,
            1e-12,
        );
        expect(
            stateVariables[
                stateVariables["/p100b"].activeChildren[1].componentName
            ].stateValues.value.tree,
        ).closeTo(variance100, 1e-12);
    });

    // TODO: skipping most checks of ugly expressions for now
    it("population variance", async () => {
        let core = await createTestCore({
            doenetML: `
        <variance population displayDigits="10" name="numbers"><number>4</number><number>16</number><number>5-4</number></variance>
        <variance population displayDigits="10" name="numbersForceSymbolic" forceSymbolic><number>4</number><number>16</number><number>5-4</number></variance>
        <variance population displayDigits="10" name="numbersForceSymbolicSimplify" forceSymbolic simplify><number>4</number><number>16</number><number>5-4</number></variance>
        <variance population displayDigits="10" name="numbersWithNumberMath"><math>4</math><number>16</number><number>5-4</number></variance>
        <variance population displayDigits="10" name="numbersWithNumberMathForceSymbolic" forceSymbolic><math>4</math><number>16</number><number>5-4</number></variance>
        <variance population displayDigits="10" name="numbersWithNumberMathForceSymbolicSimplify" forceSymbolic simplify><math>4</math><number>16</number><number>5-4</number></variance>
        <variance population displayDigits="10" name="numbersWithNumericMath"><math>8/2</math><number>16</number><number>5-4</number></variance>
        <variance population displayDigits="10" name="numbersWithNumericMathSimplify" simplify><math>8/2</math><number>16</number><number>5-4</number></variance>
        <variance population displayDigits="10" name="numbersWithNumericMathForceNumeric" forceNumeric><math>8/2</math><number>16</number><number>5-4</number></variance>
        <variance population displayDigits="10" name="withNumberVariance"><math>4</math><variance population><number>17</number><number>5-4</number></variance></variance>
        <variance population displayDigits="10" name="vars"><math>x</math><math>x+y</math><math>x+y+z</math></variance>
        <variance population displayDigits="10" name="varsSimplify" simplify><math>x</math><math>x+y</math><math>x+y+z</math></variance>
        <variance population displayDigits="10" name="varsForcedNumeric" forceNumeric><math>x</math><math>x+y</math><math>x+y+z</math></variance>
        $numbers{name="numbersb"}
        $vars{name="varsb"}
        `,
        });

        let stateVariables = await returnAllStateVariables(core);

        let theVariance = me.math.variance([4, 16, 1], "uncorrected");

        expect(stateVariables["/numbers"].stateValues.value.tree).eq(
            theVariance,
        );
        expect(stateVariables["/numbers"].stateValues.isNumericOperator).eq(
            true,
        );
        expect(stateVariables["/numbers"].stateValues.isNumber).eq(true);
        // expect(stateVariables['/numbersForceSymbolic'].stateValues.value.tree).eqls(['/', ['+', 3, 17, 1], 3]);
        expect(
            stateVariables["/numbersForceSymbolic"].stateValues
                .isNumericOperator,
        ).eq(false);
        expect(stateVariables["/numbersForceSymbolic"].stateValues.isNumber).eq(
            false,
        );
        expect(
            stateVariables["/numbersForceSymbolicSimplify"].stateValues.value
                .tree,
        ).eq(theVariance);
        expect(
            stateVariables["/numbersForceSymbolicSimplify"].stateValues
                .isNumericOperator,
        ).eq(false);
        expect(
            stateVariables["/numbersForceSymbolicSimplify"].stateValues
                .isNumber,
        ).eq(true);
        expect(
            stateVariables["/numbersWithNumberMath"].stateValues.value.tree,
        ).eq(theVariance);
        expect(
            stateVariables["/numbersWithNumberMath"].stateValues
                .isNumericOperator,
        ).eq(true);
        expect(
            stateVariables["/numbersWithNumberMath"].stateValues.isNumber,
        ).eq(true);
        // expect(stateVariables['/numbersWithNumberMathForceSymbolic'].stateValues.value.tree).eqls(['/', ['+', 3, 17, 1], 3]);
        expect(
            stateVariables["/numbersWithNumberMathForceSymbolic"].stateValues
                .isNumericOperator,
        ).eq(false);
        expect(
            stateVariables["/numbersWithNumberMathForceSymbolic"].stateValues
                .isNumber,
        ).eq(false);
        expect(
            stateVariables["/numbersWithNumberMathForceSymbolicSimplify"]
                .stateValues.value.tree,
        ).eq(theVariance);
        expect(
            stateVariables["/numbersWithNumberMathForceSymbolicSimplify"]
                .stateValues.isNumericOperator,
        ).eq(false);
        expect(
            stateVariables["/numbersWithNumberMathForceSymbolicSimplify"]
                .stateValues.isNumber,
        ).eq(true);
        // expect(stateVariables['/numbersWithNumericMath'].stateValues.value.tree).eqls(['/', ['+', ['/', 6, 2], 17, 1], 3]);
        expect(
            stateVariables["/numbersWithNumericMath"].stateValues
                .isNumericOperator,
        ).eq(false);
        expect(
            stateVariables["/numbersWithNumericMath"].stateValues.isNumber,
        ).eq(false);
        expect(
            stateVariables["/numbersWithNumericMathSimplify"].stateValues.value
                .tree,
        ).eq(theVariance);
        expect(
            stateVariables["/numbersWithNumericMathSimplify"].stateValues
                .isNumericOperator,
        ).eq(false);
        expect(
            stateVariables["/numbersWithNumericMathSimplify"].stateValues
                .isNumber,
        ).eq(true);
        expect(
            stateVariables["/numbersWithNumericMathForceNumeric"].stateValues
                .value.tree,
        ).eq(theVariance);
        expect(
            stateVariables["/numbersWithNumericMathForceNumeric"].stateValues
                .isNumericOperator,
        ).eq(true);
        expect(
            stateVariables["/numbersWithNumericMathForceNumeric"].stateValues
                .isNumber,
        ).eq(true);
        expect(stateVariables["/withNumberVariance"].stateValues.value.tree).eq(
            me.math.variance(
                [4, me.math.variance([17, 1], "uncorrected")],
                "uncorrected",
            ),
        );
        expect(
            stateVariables["/withNumberVariance"].stateValues.isNumericOperator,
        ).eq(true);
        expect(stateVariables["/withNumberVariance"].stateValues.isNumber).eq(
            true,
        );
        // expect(stateVariables['/vars'].stateValues.value.tree).eqls(['/', ['+', 'x', 'x', 'y', 'x', 'y', 'z'], 3]);
        expect(stateVariables["/vars"].stateValues.isNumericOperator).eq(false);
        expect(stateVariables["/vars"].stateValues.isNumber).eq(false);
        // expect(stateVariables['/varsSimplify'].stateValues.value.tree).eqls(['/', ['+', ['*', 3, 'x'], ['*', 2, 'y'], 'z'], 3]);
        expect(
            stateVariables["/varsSimplify"].stateValues.isNumericOperator,
        ).eq(false);
        expect(stateVariables["/varsSimplify"].stateValues.isNumber).eq(false);
        expect(
            stateVariables["/varsForcedNumeric"].stateValues.value.tree,
        ).eqls(NaN);
        expect(
            stateVariables["/varsForcedNumeric"].stateValues.isNumericOperator,
        ).eq(true);
        expect(stateVariables["/varsForcedNumeric"].stateValues.isNumber).eq(
            false,
        );
        expect(stateVariables["/numbersb"].stateValues.value.tree).eq(
            theVariance,
        );
        expect(stateVariables["/numbersb"].stateValues.isNumericOperator).eq(
            true,
        );
        expect(stateVariables["/numbersb"].stateValues.isNumber).eq(true);
        // expect(stateVariables["/varsb"].stateValues.value.tree).eqls(['/', ['+', 'x', 'x', 'y', 'x', 'y', 'z'], 3]);
        expect(stateVariables["/varsb"].stateValues.isNumericOperator).eq(
            false,
        );
        expect(stateVariables["/varsb"].stateValues.isNumber).eq(false);
    });

    it("population variance additional cases", async () => {
        let core = await createTestCore({
            doenetML: `
    <p name="pPrime">Variance of first primes: <variance population displayDigits="10" name="variancePrime">2 3 5 7</variance></p>
    <p>Copying that variance: $variancePrime{name="variancePrimeb"}</p>
    $pPrime{name="pPrimeb"}

    <p name="p100">Variance of numbers from 1 to 100: <variance population displayDigits="10" name="variance100"><sequence to="100" /></variance></p>
    <p>Copying that variance: $variance100{name="variance100b"}</p>
    $p100{name="p100b"}
    `,
        });

        let variancePrimes = me.math.variance([2, 3, 5, 7], "uncorrected");
        let variance100 = me.math.variance(
            Array.from({ length: 100 }, (_, i) => i + 1),
            "uncorrected",
        );

        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/variancePrime"].stateValues.value.tree).closeTo(
            variancePrimes,
            1e-12,
        );
        expect(
            stateVariables["/variancePrimeb"].stateValues.value.tree,
        ).closeTo(variancePrimes, 1e-12);
        expect(
            stateVariables[
                stateVariables["/pPrimeb"].activeChildren[1].componentName
            ].stateValues.value.tree,
        ).closeTo(variancePrimes, 1e-12);
        expect(stateVariables["/variance100"].stateValues.value.tree).closeTo(
            variance100,
            1e-12,
        );
        expect(stateVariables["/variance100b"].stateValues.value.tree).closeTo(
            variance100,
            1e-12,
        );
        expect(
            stateVariables[
                stateVariables["/p100b"].activeChildren[1].componentName
            ].stateValues.value.tree,
        ).closeTo(variance100, 1e-12);
    });

    // TODO: skipping most checks of ugly expressions for now
    it("standard deviation", async () => {
        let core = await createTestCore({
            doenetML: `
      <standarddeviation displayDigits="10" name="numbers"><number>3</number><number>17</number><number>5-4</number></standarddeviation>
      <standarddeviation displayDigits="10" name="numbersForceSymbolic" forceSymbolic><number>3</number><number>17</number><number>5-4</number></standarddeviation>
      <standarddeviation displayDigits="10" name="numbersForceSymbolicSimplify" forceSymbolic simplify><number>3</number><number>17</number><number>5-4</number></standarddeviation>
      <standarddeviation displayDigits="10" name="numbersWithNumberMath"><math>3</math><number>17</number><number>5-4</number></standarddeviation>
      <standarddeviation displayDigits="10" name="numbersWithNumberMathForceSymbolic" forceSymbolic><math>3</math><number>17</number><number>5-4</number></standarddeviation>
      <standarddeviation displayDigits="10" name="numbersWithNumberMathForceSymbolicSimplify" forceSymbolic simplify><math>3</math><number>17</number><number>5-4</number></standarddeviation>
      <standarddeviation displayDigits="10" name="numbersWithNumericMath"><math>6/2</math><number>17</number><number>5-4</number></standarddeviation>
      <standarddeviation displayDigits="10" name="numbersWithNumericMathSimplify" simplify><math>6/2</math><number>17</number><number>5-4</number></standarddeviation>
      <standarddeviation displayDigits="10" name="numbersWithNumericMathForceNumeric" forceNumeric><math>6/2</math><number>17</number><number>5-4</number></standarddeviation>
      <standarddeviation displayDigits="10" name="withNumberStandardDeviation"><math>3</math><standarddeviation><number>17</number><number>5-4</number></standarddeviation></standarddeviation>
      <standarddeviation displayDigits="10" name="vars"><math>x</math><math>x+y</math><math>x+y+z</math></standarddeviation>
      <standarddeviation displayDigits="10" name="varsSimplify" simplify><math>x</math><math>x+y</math><math>x+y+z</math></standarddeviation>
      <standarddeviation displayDigits="10" name="varsForcedNumeric" forceNumeric><math>x</math><math>x+y</math><math>x+y+z</math></standarddeviation>
      $numbers{name="numbersb"}
      $vars{name="varsb"}
      `,
        });

        let stateVariables = await returnAllStateVariables(core);

        let theStandardDeviation = me.math.std([3, 17, 1]);

        expect(stateVariables["/numbers"].stateValues.value.tree).closeTo(
            theStandardDeviation,
            1e-12,
        );
        expect(stateVariables["/numbers"].stateValues.isNumericOperator).eq(
            true,
        );
        expect(stateVariables["/numbers"].stateValues.isNumber).eq(true);
        // expect(stateVariables['/numbersForceSymbolic'].stateValues.value.tree).eqls(['/', ['+', 3, 17, 1], 3]);
        expect(
            stateVariables["/numbersForceSymbolic"].stateValues
                .isNumericOperator,
        ).eq(false);
        expect(stateVariables["/numbersForceSymbolic"].stateValues.isNumber).eq(
            false,
        );
        expect(
            stateVariables["/numbersForceSymbolicSimplify"].stateValues
                .isNumericOperator,
        ).eq(false);
        expect(
            stateVariables["/numbersForceSymbolicSimplify"].stateValues.value
                .tree,
        ).eqls(["apply", "sqrt", 76]);
        expect(
            stateVariables["/numbersForceSymbolicSimplify"].stateValues
                .isNumber,
        ).eq(false);
        expect(
            stateVariables["/numbersWithNumberMath"].stateValues.value.tree,
        ).closeTo(theStandardDeviation, 1e-16);
        expect(
            stateVariables["/numbersWithNumberMath"].stateValues
                .isNumericOperator,
        ).eq(true);
        expect(
            stateVariables["/numbersWithNumberMath"].stateValues.isNumber,
        ).eq(true);
        // expect(stateVariables['/numbersWithNumberMathForceSymbolic'].stateValues.value.tree).eqls(['/', ['+', 3, 17, 1], 3]);
        expect(
            stateVariables["/numbersWithNumberMathForceSymbolic"].stateValues
                .isNumericOperator,
        ).eq(false);
        expect(
            stateVariables["/numbersWithNumberMathForceSymbolicSimplify"]
                .stateValues.value.tree,
        ).eqls(["apply", "sqrt", 76]);
        expect(
            stateVariables["/numbersWithNumberMathForceSymbolic"].stateValues
                .isNumber,
        ).eq(false);
        expect(
            stateVariables["/numbersWithNumberMathForceSymbolicSimplify"]
                .stateValues.isNumericOperator,
        ).eq(false);
        expect(
            stateVariables["/numbersWithNumberMathForceSymbolicSimplify"]
                .stateValues.isNumber,
        ).eq(false);
        // expect(stateVariables['/numbersWithNumericMath'].stateValues.value.tree).eqls(['/', ['+', ['/', 6, 2], 17, 1], 3]);
        expect(
            stateVariables["/numbersWithNumericMath"].stateValues
                .isNumericOperator,
        ).eq(false);
        expect(
            stateVariables["/numbersWithNumericMath"].stateValues.isNumber,
        ).eq(false);
        expect(
            stateVariables["/numbersWithNumericMathSimplify"].stateValues.value
                .tree,
        ).eqls(["apply", "sqrt", 76]);
        expect(
            stateVariables["/numbersWithNumericMathSimplify"].stateValues
                .isNumericOperator,
        ).eq(false);
        expect(
            stateVariables["/numbersWithNumericMathSimplify"].stateValues
                .isNumber,
        ).eq(false);
        expect(
            stateVariables["/numbersWithNumericMathForceNumeric"].stateValues
                .value.tree,
        ).closeTo(theStandardDeviation, 1e-12);
        expect(
            stateVariables["/numbersWithNumericMathForceNumeric"].stateValues
                .isNumericOperator,
        ).eq(true);
        expect(
            stateVariables["/numbersWithNumericMathForceNumeric"].stateValues
                .isNumber,
        ).eq(true);
        expect(
            stateVariables["/withNumberStandardDeviation"].stateValues.value
                .tree,
        ).closeTo(me.math.std([3, me.math.std([17, 1])]), 1e-12);
        expect(
            stateVariables["/withNumberStandardDeviation"].stateValues
                .isNumericOperator,
        ).eq(true);
        expect(
            stateVariables["/withNumberStandardDeviation"].stateValues.isNumber,
        ).eq(true);
        // expect(stateVariables['/vars'].stateValues.value.tree).eqls(['/', ['+', 'x', 'x', 'y', 'x', 'y', 'z'], 3]);
        expect(stateVariables["/vars"].stateValues.isNumericOperator).eq(false);
        expect(stateVariables["/vars"].stateValues.isNumber).eq(false);
        // expect(stateVariables['/varsSimplify'].stateValues.value.tree).eqls(['/', ['+', ['*', 3, 'x'], ['*', 2, 'y'], 'z'], 3]);
        expect(
            stateVariables["/varsSimplify"].stateValues.isNumericOperator,
        ).eq(false);
        expect(stateVariables["/varsSimplify"].stateValues.isNumber).eq(false);
        expect(
            stateVariables["/varsForcedNumeric"].stateValues.value.tree,
        ).eqls(NaN);
        expect(
            stateVariables["/varsForcedNumeric"].stateValues.isNumericOperator,
        ).eq(true);
        expect(stateVariables["/varsForcedNumeric"].stateValues.isNumber).eq(
            false,
        );
        expect(stateVariables["/numbersb"].stateValues.value.tree).closeTo(
            theStandardDeviation,
            1e-12,
        );
        expect(stateVariables["/numbersb"].stateValues.isNumericOperator).eq(
            true,
        );
        expect(stateVariables["/numbersb"].stateValues.isNumber).eq(true);
        // expect(stateVariables["/varsb"].stateValues.value.tree).eqls(['/', ['+', 'x', 'x', 'y', 'x', 'y', 'z'], 3]);
        expect(stateVariables["/varsb"].stateValues.isNumericOperator).eq(
            false,
        );
        expect(stateVariables["/varsb"].stateValues.isNumber).eq(false);
    });

    it("standard deviation as math expression", async () => {
        let core = await createTestCore({
            doenetML: `
      <group name="nums" asList>
        <number name="a">13</number>
        <number name="b">25</number>
        <number name="c">5-4</number>
      </group>
      <math name="numberString">std(13,25,5-4)</math>
      <math name="numberStringSimplify" simplify>std(13,25,5-4)</math>
      <math name="numberStringProduct">std(13 25 5-4)</math>
      <math name="numberStringProductSimplify" simplify>std(13 25 5-4)</math>
      <math name="numberComponentsCommas">
        std(<number>13</number>,<number>25</number>,<number>5-4</number>)
      </math>
      <math name="numberComponentsCommasSimplify" simplify>
      std(<number>13</number>,<number>25</number>,<number>5-4</number>)
      </math>
      <math name="numberComponentsProduct">
        std(<number>13</number><number>25</number><number>5-4</number>)
      </math>
      <math name="numberComponentsProductSimplify" simplify>
        std(<number>13</number><number>25</number><number>5-4</number>)
      </math>
      <math name="macrosCommas">
        std($a,$b,$c)
      </math>
      <math name="macrosCommasSimplify" simplify>
        std($a,$b,$c)
      </math>
      <math name="macrosProduct">
        std($a$b$c)
      </math>
      <math name="macrosProductSimplify" simplify>
        std($a$b$c)
      </math>
      <math name="group">
        std($nums)
      </math>
      <math name="groupSimplify" simplify>
        std($nums)
      </math>
      `,
        });

        let theStd = me.math.std([13, 25, 1]);
        let theStdString = theStd.toString();

        let stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/numberString"].stateValues.value.tree).eqls([
            "apply",
            "std",
            ["tuple", 13, 25, ["+", 5, -4]],
        ]);
        expect(stateVariables["/numberString"].stateValues.isNumber).eq(false);
        expect(
            stateVariables["/numberStringSimplify"].stateValues.value.tree,
        ).eq(theStd);
        expect(stateVariables["/numberStringSimplify"].stateValues.isNumber).eq(
            true,
        );
        expect(
            stateVariables["/numberStringProduct"].stateValues.value.tree,
        ).eqls(["apply", "std", ["+", ["*", 13, 25, 5], -4]]);
        expect(stateVariables["/numberStringProduct"].stateValues.isNumber).eq(
            false,
        );
        expect(
            stateVariables["/numberStringProductSimplify"].stateValues.value
                .tree,
        ).eq(0);
        expect(
            stateVariables["/numberStringProductSimplify"].stateValues.isNumber,
        ).eq(true);

        expect(
            stateVariables["/numberComponentsCommas"].stateValues.value.tree,
        ).eqls(["apply", "std", ["tuple", 13, 25, 1]]);
        expect(
            stateVariables["/numberComponentsCommas"].stateValues.isNumber,
        ).eq(false);
        expect(
            stateVariables["/numberComponentsCommasSimplify"].stateValues.value
                .tree,
        ).eq(theStd);
        expect(
            stateVariables["/numberComponentsCommasSimplify"].stateValues
                .isNumber,
        ).eq(true);
        expect(
            stateVariables["/numberComponentsProduct"].stateValues.value.tree,
        ).eqls(["apply", "std", ["*", 13, 25, 1]]);
        expect(
            stateVariables["/numberComponentsProduct"].stateValues.isNumber,
        ).eq(false);
        expect(
            stateVariables["/numberComponentsProductSimplify"].stateValues.value
                .tree,
        ).eq(0);
        expect(
            stateVariables["/numberComponentsProductSimplify"].stateValues
                .isNumber,
        ).eq(true);

        expect(stateVariables["/macrosCommas"].stateValues.value.tree).eqls([
            "apply",
            "std",
            ["tuple", 13, 25, 1],
        ]);
        expect(stateVariables["/macrosCommas"].stateValues.isNumber).eq(false);
        expect(
            stateVariables["/macrosCommasSimplify"].stateValues.value.tree,
        ).eq(theStd);
        expect(stateVariables["/macrosCommasSimplify"].stateValues.isNumber).eq(
            true,
        );
        expect(stateVariables["/macrosProduct"].stateValues.value.tree).eqls([
            "apply",
            "std",
            ["*", 13, 25, 1],
        ]);
        expect(stateVariables["/macrosProduct"].stateValues.isNumber).eq(false);
        expect(
            stateVariables["/macrosProductSimplify"].stateValues.value.tree,
        ).eq(0);
        expect(
            stateVariables["/macrosProductSimplify"].stateValues.isNumber,
        ).eq(true);

        expect(stateVariables["/group"].stateValues.value.tree).eqls([
            "apply",
            "std",
            ["tuple", 13, 25, 1],
        ]);
        expect(stateVariables["/group"].stateValues.isNumber).eq(false);
        expect(stateVariables["/groupSimplify"].stateValues.value.tree).eq(
            theStd,
        );
        expect(stateVariables["/groupSimplify"].stateValues.isNumber).eq(true);
    });

    it("standard deviation additional cases", async () => {
        let core = await createTestCore({
            doenetML: `
    <p name="pPrime">Standard deviation of first primes: <standarddeviation displayDigits="10" name="standarddeviationPrime">2 3 5 7</standarddeviation></p>
    <p>Copying that standard deviation: $standarddeviationPrime{name="standarddeviationPrimeb"}</p>
    $pPrime{name="pPrimeb"}

    <p name="p100">Standard deviation of numbers from 1 to 100: <standarddeviation displayDigits="10" name="standarddeviation100"><sequence to="100" /></standarddeviation></p>
    <p>Copying that standard deviation: $standarddeviation100{name="standarddeviation100b"}</p>
    $p100{name="p100b"}
    `,
        });

        let stdPrimes = me.math.std(2, 3, 5, 7);
        let std100 = me.math.std(Array.from({ length: 100 }, (_, i) => i + 1));

        let stateVariables = await returnAllStateVariables(core);
        expect(
            stateVariables["/standarddeviationPrime"].stateValues.value.tree,
        ).closeTo(stdPrimes, 1e-12);
        expect(
            stateVariables["/standarddeviationPrimeb"].stateValues.value.tree,
        ).closeTo(stdPrimes, 1e-12);
        expect(
            stateVariables[
                stateVariables["/pPrimeb"].activeChildren[1].componentName
            ].stateValues.value.tree,
        ).closeTo(stdPrimes, 1e-12);
        expect(
            stateVariables["/standarddeviation100"].stateValues.value.tree,
        ).closeTo(std100, 1e-12);
        expect(
            stateVariables["/standarddeviation100b"].stateValues.value.tree,
        ).closeTo(std100, 1e-12);
        expect(
            stateVariables[
                stateVariables["/p100b"].activeChildren[1].componentName
            ].stateValues.value.tree,
        ).closeTo(std100, 1e-12);
    });

    // TODO: skipping most checks of ugly expressions for now
    it("population standard deviation", async () => {
        let core = await createTestCore({
            doenetML: `
      <standarddeviation displayDigits="10" population name="numbers"><number>4</number><number>16</number><number>5-4</number></standarddeviation>
      <standarddeviation displayDigits="10" population name="numbersForceSymbolic" forceSymbolic><number>4</number><number>16</number><number>5-4</number></standarddeviation>
      <standarddeviation displayDigits="10" population name="numbersForceSymbolicSimplify" forceSymbolic simplify><number>4</number><number>16</number><number>5-4</number></standarddeviation>
      <standarddeviation displayDigits="10" population name="numbersWithNumberMath"><math>4</math><number>16</number><number>5-4</number></standarddeviation>
      <standarddeviation displayDigits="10" population name="numbersWithNumberMathForceSymbolic" forceSymbolic><math>4</math><number>16</number><number>5-4</number></standarddeviation>
      <standarddeviation displayDigits="10" population name="numbersWithNumberMathForceSymbolicSimplify" forceSymbolic simplify><math>4</math><number>16</number><number>5-4</number></standarddeviation>
      <standarddeviation displayDigits="10" population name="numbersWithNumericMath"><math>8/2</math><number>16</number><number>5-4</number></standarddeviation>
      <standarddeviation displayDigits="10" population name="numbersWithNumericMathSimplify" simplify><math>8/2</math><number>16</number><number>5-4</number></standarddeviation>
      <standarddeviation displayDigits="10" population name="numbersWithNumericMathForceNumeric" forceNumeric><math>8/2</math><number>16</number><number>5-4</number></standarddeviation>
      <standarddeviation displayDigits="10" population name="withNumberStandardDeviation"><math>3</math><standarddeviation displayDigits="10" population><number>17</number><number>5-4</number></standarddeviation></standarddeviation>
      <standarddeviation displayDigits="10" population name="vars"><math>x</math><math>x+y</math><math>x+y+z</math></standarddeviation>
      <standarddeviation displayDigits="10" population name="varsSimplify" simplify><math>x</math><math>x+y</math><math>x+y+z</math></standarddeviation>
      <standarddeviation displayDigits="10" population name="varsForcedNumeric" forceNumeric><math>x</math><math>x+y</math><math>x+y+z</math></standarddeviation>
      $numbers{name="numbersb"}
      $vars{name="varsb"}
      `,
        });

        let stateVariables = await returnAllStateVariables(core);

        let theStandardDeviation = me.math.std([4, 16, 1], "uncorrected");

        expect(stateVariables["/numbers"].stateValues.value.tree).closeTo(
            theStandardDeviation,
            1e-12,
        );
        expect(stateVariables["/numbers"].stateValues.isNumericOperator).eq(
            true,
        );
        expect(stateVariables["/numbers"].stateValues.isNumber).eq(true);
        // expect(stateVariables['/numbersForceSymbolic'].stateValues.value.tree).eqls(['/', ['+', 3, 17, 1], 3]);
        expect(
            stateVariables["/numbersForceSymbolic"].stateValues
                .isNumericOperator,
        ).eq(false);
        expect(stateVariables["/numbersForceSymbolic"].stateValues.isNumber).eq(
            false,
        );
        expect(
            stateVariables["/numbersForceSymbolicSimplify"].stateValues
                .isNumericOperator,
        ).eq(false);
        expect(
            stateVariables["/numbersForceSymbolicSimplify"].stateValues.value
                .tree,
        ).eqls(["apply", "sqrt", 42]);
        expect(
            stateVariables["/numbersForceSymbolicSimplify"].stateValues
                .isNumber,
        ).eq(false);
        expect(
            stateVariables["/numbersWithNumberMath"].stateValues.value.tree,
        ).closeTo(theStandardDeviation, 1e-16);
        expect(
            stateVariables["/numbersWithNumberMath"].stateValues
                .isNumericOperator,
        ).eq(true);
        expect(
            stateVariables["/numbersWithNumberMath"].stateValues.isNumber,
        ).eq(true);
        // expect(stateVariables['/numbersWithNumberMathForceSymbolic'].stateValues.value.tree).eqls(['/', ['+', 3, 17, 1], 3]);
        expect(
            stateVariables["/numbersWithNumberMathForceSymbolic"].stateValues
                .isNumericOperator,
        ).eq(false);
        expect(
            stateVariables["/numbersWithNumberMathForceSymbolicSimplify"]
                .stateValues.value.tree,
        ).eqls(["apply", "sqrt", 42]);
        expect(
            stateVariables["/numbersWithNumberMathForceSymbolic"].stateValues
                .isNumber,
        ).eq(false);
        expect(
            stateVariables["/numbersWithNumberMathForceSymbolicSimplify"]
                .stateValues.isNumericOperator,
        ).eq(false);
        expect(
            stateVariables["/numbersWithNumberMathForceSymbolicSimplify"]
                .stateValues.isNumber,
        ).eq(false);
        // expect(stateVariables['/numbersWithNumericMath'].stateValues.value.tree).eqls(['/', ['+', ['/', 6, 2], 17, 1], 3]);
        expect(
            stateVariables["/numbersWithNumericMath"].stateValues
                .isNumericOperator,
        ).eq(false);
        expect(
            stateVariables["/numbersWithNumericMath"].stateValues.isNumber,
        ).eq(false);
        expect(
            stateVariables["/numbersWithNumericMathSimplify"].stateValues.value
                .tree,
        ).eqls(["apply", "sqrt", 42]);
        expect(
            stateVariables["/numbersWithNumericMathSimplify"].stateValues
                .isNumericOperator,
        ).eq(false);
        expect(
            stateVariables["/numbersWithNumericMathSimplify"].stateValues
                .isNumber,
        ).eq(false);
        expect(
            stateVariables["/numbersWithNumericMathForceNumeric"].stateValues
                .value.tree,
        ).closeTo(theStandardDeviation, 1e-12);
        expect(
            stateVariables["/numbersWithNumericMathForceNumeric"].stateValues
                .isNumericOperator,
        ).eq(true);
        expect(
            stateVariables["/numbersWithNumericMathForceNumeric"].stateValues
                .isNumber,
        ).eq(true);
        expect(
            stateVariables["/withNumberStandardDeviation"].stateValues.value
                .tree,
        ).closeTo(
            me.math.std(
                [3, me.math.std([17, 1], "uncorrected")],
                "uncorrected",
            ),
            1e-12,
        );
        expect(
            stateVariables["/withNumberStandardDeviation"].stateValues
                .isNumericOperator,
        ).eq(true);
        expect(
            stateVariables["/withNumberStandardDeviation"].stateValues.isNumber,
        ).eq(true);
        // expect(stateVariables['/vars'].stateValues.value.tree).eqls(['/', ['+', 'x', 'x', 'y', 'x', 'y', 'z'], 3]);
        expect(stateVariables["/vars"].stateValues.isNumericOperator).eq(false);
        expect(stateVariables["/vars"].stateValues.isNumber).eq(false);
        // expect(stateVariables['/varsSimplify'].stateValues.value.tree).eqls(['/', ['+', ['*', 3, 'x'], ['*', 2, 'y'], 'z'], 3]);
        expect(
            stateVariables["/varsSimplify"].stateValues.isNumericOperator,
        ).eq(false);
        expect(stateVariables["/varsSimplify"].stateValues.isNumber).eq(false);
        expect(
            stateVariables["/varsForcedNumeric"].stateValues.value.tree,
        ).eqls(NaN);
        expect(
            stateVariables["/varsForcedNumeric"].stateValues.isNumericOperator,
        ).eq(true);
        expect(stateVariables["/varsForcedNumeric"].stateValues.isNumber).eq(
            false,
        );
        expect(stateVariables["/numbersb"].stateValues.value.tree).closeTo(
            theStandardDeviation,
            1e-12,
        );
        expect(stateVariables["/numbersb"].stateValues.isNumericOperator).eq(
            true,
        );
        expect(stateVariables["/numbersb"].stateValues.isNumber).eq(true);
        // expect(stateVariables["/varsb"].stateValues.value.tree).eqls(['/', ['+', 'x', 'x', 'y', 'x', 'y', 'z'], 3]);
        expect(stateVariables["/varsb"].stateValues.isNumericOperator).eq(
            false,
        );
        expect(stateVariables["/varsb"].stateValues.isNumber).eq(false);
    });

    it("population standard deviation additional cases", async () => {
        let core = await createTestCore({
            doenetML: `
    <p name="pPrime">Standard deviation of first primes: <standarddeviation displayDigits="10" population name="standarddeviationPrime">2 3 5 7</standarddeviation></p>
    <p>Copying that standard deviation: $standarddeviationPrime{name="standarddeviationPrimeb"}</p>
    $pPrime{name="pPrimeb"}

    <p name="p100">Standard deviation of numbers from 1 to 100: <standarddeviation displayDigits="10" population name="standarddeviation100"><sequence to="100" /></standarddeviation></p>
    <p>Copying that standard deviation: $standarddeviation100{name="standarddeviation100b"}</p>
    $p100{name="p100b"}
    `,
        });

        let stdPrimes = me.math.std([2, 3, 5, 7], "uncorrected");
        let std100 = me.math.std(
            Array.from({ length: 100 }, (_, i) => i + 1),
            "uncorrected",
        );

        let stateVariables = await returnAllStateVariables(core);
        expect(
            stateVariables["/standarddeviationPrime"].stateValues.value.tree,
        ).closeTo(stdPrimes, 1e-12);
        expect(
            stateVariables["/standarddeviationPrimeb"].stateValues.value.tree,
        ).closeTo(stdPrimes, 1e-12);
        expect(
            stateVariables[
                stateVariables["/pPrimeb"].activeChildren[1].componentName
            ].stateValues.value.tree,
        ).closeTo(stdPrimes, 1e-12);
        expect(
            stateVariables["/standarddeviation100"].stateValues.value.tree,
        ).closeTo(std100, 1e-12);
        expect(
            stateVariables["/standarddeviation100b"].stateValues.value.tree,
        ).closeTo(std100, 1e-12);
        expect(
            stateVariables[
                stateVariables["/p100b"].activeChildren[1].componentName
            ].stateValues.value.tree,
        ).closeTo(std100, 1e-12);
    });

    it("count", async () => {
        let core = await createTestCore({
            doenetML: `
      <count name="numbers"><number>3</number><number>17</number><number>5-4</number></count>
      <count name="numbersForceSymbolic" forceSymbolic><number>3</number><number>17</number><number>5-4</number></count>
      <count name="numbersForceSymbolicSimplify" forceSymbolic simplify><number>3</number><number>17</number><number>5-4</number></count>
      <count name="numbersWithNumberMath"><math>3</math><number>17</number><number>5-4</number></count>
      <count name="numbersWithNumberMathForceSymbolic" forceSymbolic><math>3</math><number>17</number><number>5-4</number></count>
      <count name="numbersWithNumberMathForceSymbolicSimplify" forceSymbolic simplify><math>3</math><number>17</number><number>5-4</number></count>
      <count name="numbersWithNumericMath"><math>6/2</math><number>17</number><number>5-4</number></count>
      <count name="numbersWithNumericMathSimplify" simplify><math>6/2</math><number>17</number><number>5-4</number></count>
      <count name="numbersWithNumericMathForceNumeric" forceNumeric><math>6/2</math><number>17</number><number>5-4</number></count>
      <count name="withNumberCount"><math>3</math><count><number>17</number><number>5-4</number></count></count>
      <count name="vars"><math>x</math><math>x+y</math><math>x+y+z</math></count>
      <count name="varsSimplify" simplify><math>x</math><math>x+y</math><math>x+y+z</math></count>
      <count name="varsForcedNumeric" forceNumeric><math>x</math><math>x+y</math><math>x+y+z</math></count>
      $numbers{name="numbersb"}
      $vars{name="varsb"}
      `,
        });

        let stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/numbers"].stateValues.value.tree).eq(3);
        expect(stateVariables["/numbers"].stateValues.isNumericOperator).eq(
            true,
        );
        expect(stateVariables["/numbers"].stateValues.isNumber).eq(true);
        expect(
            stateVariables["/numbersForceSymbolic"].stateValues.value.tree,
        ).eq(3);
        expect(
            stateVariables["/numbersForceSymbolic"].stateValues
                .isNumericOperator,
        ).eq(true);
        expect(stateVariables["/numbersForceSymbolic"].stateValues.isNumber).eq(
            true,
        );
        expect(
            stateVariables["/numbersForceSymbolicSimplify"].stateValues.value
                .tree,
        ).eq(3);
        expect(
            stateVariables["/numbersForceSymbolicSimplify"].stateValues
                .isNumericOperator,
        ).eq(true);
        expect(
            stateVariables["/numbersForceSymbolicSimplify"].stateValues
                .isNumber,
        ).eq(true);
        expect(
            stateVariables["/numbersWithNumberMath"].stateValues.value.tree,
        ).eq(3);
        expect(
            stateVariables["/numbersWithNumberMath"].stateValues
                .isNumericOperator,
        ).eq(true);
        expect(
            stateVariables["/numbersWithNumberMath"].stateValues.isNumber,
        ).eq(true);
        expect(
            stateVariables["/numbersWithNumberMathForceSymbolic"].stateValues
                .value.tree,
        ).eq(3);
        expect(
            stateVariables["/numbersWithNumberMathForceSymbolic"].stateValues
                .isNumericOperator,
        ).eq(true);
        expect(
            stateVariables["/numbersWithNumberMathForceSymbolic"].stateValues
                .isNumber,
        ).eq(true);
        expect(
            stateVariables["/numbersWithNumberMathForceSymbolicSimplify"]
                .stateValues.value.tree,
        ).eq(3);
        expect(
            stateVariables["/numbersWithNumberMathForceSymbolicSimplify"]
                .stateValues.isNumericOperator,
        ).eq(true);
        expect(
            stateVariables["/numbersWithNumberMathForceSymbolicSimplify"]
                .stateValues.isNumber,
        ).eq(true);
        expect(
            stateVariables["/numbersWithNumericMath"].stateValues.value.tree,
        ).eq(3);
        expect(
            stateVariables["/numbersWithNumericMath"].stateValues
                .isNumericOperator,
        ).eq(true);
        expect(
            stateVariables["/numbersWithNumericMath"].stateValues.isNumber,
        ).eq(true);
        expect(
            stateVariables["/numbersWithNumericMathSimplify"].stateValues.value
                .tree,
        ).eq(3);
        expect(
            stateVariables["/numbersWithNumericMathSimplify"].stateValues
                .isNumericOperator,
        ).eq(true);
        expect(
            stateVariables["/numbersWithNumericMathSimplify"].stateValues
                .isNumber,
        ).eq(true);
        expect(
            stateVariables["/numbersWithNumericMathForceNumeric"].stateValues
                .value.tree,
        ).eq(3);
        expect(
            stateVariables["/numbersWithNumericMathForceNumeric"].stateValues
                .isNumericOperator,
        ).eq(true);
        expect(
            stateVariables["/numbersWithNumericMathForceNumeric"].stateValues
                .isNumber,
        ).eq(true);
        expect(stateVariables["/withNumberCount"].stateValues.value.tree).eq(2);
        expect(
            stateVariables["/withNumberCount"].stateValues.isNumericOperator,
        ).eq(true);
        expect(stateVariables["/withNumberCount"].stateValues.isNumber).eq(
            true,
        );
        expect(stateVariables["/vars"].stateValues.value.tree).eq(3);
        expect(stateVariables["/vars"].stateValues.isNumericOperator).eq(true);
        expect(stateVariables["/vars"].stateValues.isNumber).eq(true);
        expect(stateVariables["/varsSimplify"].stateValues.value.tree).eq(3);
        expect(
            stateVariables["/varsSimplify"].stateValues.isNumericOperator,
        ).eq(true);
        expect(stateVariables["/varsSimplify"].stateValues.isNumber).eq(true);
        expect(stateVariables["/varsForcedNumeric"].stateValues.value.tree).eq(
            3,
        );
        expect(
            stateVariables["/varsForcedNumeric"].stateValues.isNumericOperator,
        ).eq(true);
        expect(stateVariables["/varsForcedNumeric"].stateValues.isNumber).eq(
            true,
        );
        expect(stateVariables["/numbersb"].stateValues.value.tree).eq(3);
        expect(stateVariables["/numbersb"].stateValues.isNumericOperator).eq(
            true,
        );
        expect(stateVariables["/numbersb"].stateValues.isNumber).eq(true);
        expect(stateVariables["/varsb"].stateValues.value.tree).eq(3);
        expect(stateVariables["/varsb"].stateValues.isNumericOperator).eq(true);
        expect(stateVariables["/varsb"].stateValues.isNumber).eq(true);
    });

    it("count with sugar", async () => {
        let core = await createTestCore({
            doenetML: `
      <number name="a">3</number>
      <number name="b">17</number>
      <number name="c">5-4</number>
      <math name="aNumberMath">3</math>
      <math name="aNumericMath">6/2</math>
      <count name="numbers"><number>3</number><number>17</number><number>5-4</number></count>
      <count name="numbersAsString">3 17 1</count>
      <count name="numbersAsStringForceSymbolic" forceSymbolic>3 17 1</count>
      <count name="numbersAsStringForceSymbolicSimplify" forceSymbolic simplify>3 17 1</count>
      <count name="numericAsString">6/2 17 5-4</count>
      <count name="numericAsStringSimplify" simplify>6/2 17 5-4</count>
      <count name="numericAsStringForceNumeric" forceNumeric>6/2 17 5-4</count>
      <count name="numbersAsMacros">$a$b$c</count>
      <count name="numbersAsMacrosForceSymbolic" forceSymbolic>$a$b$c</count>
      <count name="numbersAsMacrosForceSymbolicSimplify" forceSymbolic simplify>$a$b$c</count>
      <count name="numbersAsMacros2">$a $b $c</count>
      <count name="withNumberMathMacro">$aNumberMath$b$c</count>
      <count name="withNumberMathMacroForceSymbolic" forceSymbolic>$aNumberMath$b$c</count>
      <count name="withNumberMathMacroForceSymbolicSimplify" forceSymbolic simplify>$aNumberMath$b$c</count>
      <count name="withNumericMathMacro">$aNumericMath$b$c</count>
      <count name="withNumericMathMacroSimplify" simplify>$aNumericMath$b$c</count>
      <count name="withNumericMathMacroForceNumeric" forceNumeric>$aNumericMath$b$c</count>
      <count name="vars"><math>x</math><math>x+y</math><math>x+y+z</math></count>
      <count name="varsAsString">x x+y x+y+z</count>
      <count name="varsAsStringSimplify" simplify>x x+y x+y+z</count>
      <count name="varsAsStringForceNumeric" forceNumeric>x x+y x+y+z</count>
      `,
        });

        let stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/numbers"].stateValues.value.tree).eq(3);
        expect(stateVariables["/numbers"].stateValues.isNumericOperator).eq(
            true,
        );
        expect(stateVariables["/numbers"].stateValues.isNumber).eq(true);
        expect(stateVariables["/numbersAsString"].stateValues.value.tree).eq(3);
        expect(
            stateVariables["/numbersAsString"].stateValues.isNumericOperator,
        ).eq(true);
        expect(stateVariables["/numbersAsString"].stateValues.isNumber).eq(
            true,
        );
        expect(
            stateVariables["/numbersAsStringForceSymbolic"].stateValues.value
                .tree,
        ).eq(3);
        expect(
            stateVariables["/numbersAsStringForceSymbolic"].stateValues
                .isNumericOperator,
        ).eq(true);
        expect(
            stateVariables["/numbersAsStringForceSymbolic"].stateValues
                .isNumber,
        ).eq(true);
        expect(
            stateVariables["/numbersAsStringForceSymbolicSimplify"].stateValues
                .value.tree,
        ).eq(3);
        expect(
            stateVariables["/numbersAsStringForceSymbolicSimplify"].stateValues
                .isNumericOperator,
        ).eq(true);
        expect(
            stateVariables["/numbersAsStringForceSymbolicSimplify"].stateValues
                .isNumber,
        ).eq(true);
        expect(stateVariables["/numericAsString"].stateValues.value.tree).eq(3);
        expect(
            stateVariables["/numericAsString"].stateValues.isNumericOperator,
        ).eq(true);
        expect(stateVariables["/numericAsString"].stateValues.isNumber).eq(
            true,
        );
        expect(
            stateVariables["/numericAsStringSimplify"].stateValues.value.tree,
        ).eq(3);
        expect(
            stateVariables["/numericAsStringSimplify"].stateValues
                .isNumericOperator,
        ).eq(true);
        expect(
            stateVariables["/numericAsStringSimplify"].stateValues.isNumber,
        ).eq(true);
        expect(
            stateVariables["/numericAsStringForceNumeric"].stateValues.value
                .tree,
        ).eq(3);
        expect(
            stateVariables["/numericAsStringForceNumeric"].stateValues
                .isNumericOperator,
        ).eq(true);
        expect(
            stateVariables["/numericAsStringForceNumeric"].stateValues.isNumber,
        ).eq(true);
        expect(stateVariables["/numbersAsMacros"].stateValues.value.tree).eq(3);
        expect(
            stateVariables["/numbersAsMacros"].stateValues.isNumericOperator,
        ).eq(true);
        expect(stateVariables["/numbersAsMacros"].stateValues.isNumber).eq(
            true,
        );
        expect(
            stateVariables["/numbersAsMacrosForceSymbolic"].stateValues.value
                .tree,
        ).eq(3);
        expect(
            stateVariables["/numbersAsMacrosForceSymbolic"].stateValues
                .isNumericOperator,
        ).eq(true);
        expect(
            stateVariables["/numbersAsMacrosForceSymbolic"].stateValues
                .isNumber,
        ).eq(true);
        expect(
            stateVariables["/numbersAsMacrosForceSymbolicSimplify"].stateValues
                .value.tree,
        ).eq(3);
        expect(
            stateVariables["/numbersAsMacrosForceSymbolicSimplify"].stateValues
                .isNumericOperator,
        ).eq(true);
        expect(
            stateVariables["/numbersAsMacrosForceSymbolicSimplify"].stateValues
                .isNumber,
        ).eq(true);
        expect(stateVariables["/numbersAsMacros2"].stateValues.value.tree).eq(
            3,
        );
        expect(
            stateVariables["/numbersAsMacros2"].stateValues.isNumericOperator,
        ).eq(true);
        expect(stateVariables["/numbersAsMacros2"].stateValues.isNumber).eq(
            true,
        );
        expect(
            stateVariables["/withNumberMathMacro"].stateValues.value.tree,
        ).eq(3);
        expect(
            stateVariables["/withNumberMathMacro"].stateValues
                .isNumericOperator,
        ).eq(true);
        expect(stateVariables["/withNumberMathMacro"].stateValues.isNumber).eq(
            true,
        );
        expect(
            stateVariables["/withNumberMathMacroForceSymbolic"].stateValues
                .value.tree,
        ).eq(3);
        expect(
            stateVariables["/withNumberMathMacroForceSymbolic"].stateValues
                .isNumericOperator,
        ).eq(true);
        expect(
            stateVariables["/withNumberMathMacroForceSymbolic"].stateValues
                .isNumber,
        ).eq(true);
        expect(
            stateVariables["/withNumberMathMacroForceSymbolicSimplify"]
                .stateValues.value.tree,
        ).eq(3);
        expect(
            stateVariables["/withNumberMathMacroForceSymbolicSimplify"]
                .stateValues.isNumericOperator,
        ).eq(true);
        expect(
            stateVariables["/withNumberMathMacroForceSymbolicSimplify"]
                .stateValues.isNumber,
        ).eq(true);
        expect(
            stateVariables["/withNumericMathMacro"].stateValues.value.tree,
        ).eq(3);
        expect(
            stateVariables["/withNumericMathMacro"].stateValues
                .isNumericOperator,
        ).eq(true);
        expect(stateVariables["/withNumericMathMacro"].stateValues.isNumber).eq(
            true,
        );
        expect(
            stateVariables["/withNumericMathMacroSimplify"].stateValues.value
                .tree,
        ).eq(3);
        expect(
            stateVariables["/withNumericMathMacroSimplify"].stateValues
                .isNumericOperator,
        ).eq(true);
        expect(
            stateVariables["/withNumericMathMacroSimplify"].stateValues
                .isNumber,
        ).eq(true);
        expect(
            stateVariables["/withNumericMathMacroForceNumeric"].stateValues
                .value.tree,
        ).eq(3);
        expect(
            stateVariables["/withNumericMathMacroForceNumeric"].stateValues
                .isNumericOperator,
        ).eq(true);
        expect(
            stateVariables["/withNumericMathMacroForceNumeric"].stateValues
                .isNumber,
        ).eq(true);
        expect(stateVariables["/vars"].stateValues.value.tree).eq(3);
        expect(stateVariables["/vars"].stateValues.isNumericOperator).eq(true);
        expect(stateVariables["/vars"].stateValues.isNumber).eq(true);
        expect(stateVariables["/varsAsString"].stateValues.value.tree).eq(3);
        expect(
            stateVariables["/varsAsString"].stateValues.isNumericOperator,
        ).eq(true);
        expect(stateVariables["/varsAsString"].stateValues.isNumber).eq(true);
        expect(
            stateVariables["/varsAsStringSimplify"].stateValues.value.tree,
        ).eq(3);
        expect(
            stateVariables["/varsAsStringSimplify"].stateValues
                .isNumericOperator,
        ).eq(true);
        expect(stateVariables["/varsAsStringSimplify"].stateValues.isNumber).eq(
            true,
        );
        expect(
            stateVariables["/varsAsStringForceNumeric"].stateValues.value.tree,
        ).eq(3);
        expect(
            stateVariables["/varsAsStringForceNumeric"].stateValues
                .isNumericOperator,
        ).eq(true);
        expect(
            stateVariables["/varsAsStringForceNumeric"].stateValues.isNumber,
        ).eq(true);
    });

    it("count as math expression", async () => {
        let core = await createTestCore({
            doenetML: `
      <group name="nums" asList>
        <number name="a">3</number>
        <number name="b">17</number>
        <number name="c">5-4</number>
      </group>
      <math name="numberString">count(3,17,5-4)</math>
      <math name="numberStringSimplify" simplify>count(3,17,5-4)</math>
      <math name="numberStringArray">count([3,17,5-4])</math>
      <math name="numberStringArraySimplify" simplify>count([3,17,5-4])</math>
      <math name="numberStringProduct">count(3 17 5-4)</math>
      <math name="numberStringProductSimplify" simplify>count(3 17 5-4)</math>
      <math name="numberComponentsCommas">
        count(<number>3</number>,<number>17</number>,<number>5-4</number>)
      </math>
      <math name="numberComponentsCommasSimplify" simplify>
      count(<number>3</number>,<number>17</number>,<number>5-4</number>)
      </math>
      <math name="numberComponentsProduct">
        count(<number>3</number><number>17</number><number>5-4</number>)
      </math>
      <math name="numberComponentsProductSimplify" simplify>
        count(<number>3</number><number>17</number><number>5-4</number>)
      </math>
      <math name="macrosCommas">
        count($a,$b,$c)
      </math>
      <math name="macrosCommasSimplify" simplify>
        count($a,$b,$c)
      </math>
      <math name="macrosProduct">
        count($a$b$c)
      </math>
      <math name="macrosProductSimplify" simplify>
        count($a$b$c)
      </math>
      <math name="group">
        count($nums)
      </math>
      <math name="groupSimplify" simplify>
        count($nums)
      </math>
      <math name="groupPlus">
        count($nums, $a, $b, $c)
      </math>
      <math name="groupPlusSimplify" simplify>
        count($nums, $a, $b, $c)
      </math>
      <math name="groupPlus2">
        count($a, $b, $c, $nums)
      </math>
      <math name="groupPlus2Simplify" simplify>
        count($a, $b, $c, $nums)
      </math>
      <math name="groupPlus3">
        count($a, $b, $nums, $c)
      </math>
      <math name="groupPlus3Simplify" simplify>
        count($a, $b, $nums, $c)
      </math>
      `,
        });

        let stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/numberString"].stateValues.value.tree).eqls([
            "apply",
            "count",
            ["tuple", 3, 17, ["+", 5, -4]],
        ]);
        expect(stateVariables["/numberString"].stateValues.isNumber).eq(false);
        expect(
            stateVariables["/numberStringSimplify"].stateValues.value.tree,
        ).eq(3);
        expect(stateVariables["/numberStringSimplify"].stateValues.isNumber).eq(
            true,
        );
        expect(
            stateVariables["/numberStringArray"].stateValues.value.tree,
        ).eqls(["apply", "count", ["array", 3, 17, ["+", 5, -4]]]);
        expect(stateVariables["/numberStringArray"].stateValues.isNumber).eq(
            false,
        );
        expect(
            stateVariables["/numberStringArraySimplify"].stateValues.value.tree,
        ).eq(3);
        expect(
            stateVariables["/numberStringArraySimplify"].stateValues.isNumber,
        ).eq(true);
        expect(
            stateVariables["/numberStringProduct"].stateValues.value.tree,
        ).eqls(["apply", "count", ["+", ["*", 3, 17, 5], -4]]);
        expect(stateVariables["/numberStringProduct"].stateValues.isNumber).eq(
            false,
        );
        expect(
            stateVariables["/numberStringProductSimplify"].stateValues.value
                .tree,
        ).eq(1);
        expect(
            stateVariables["/numberStringProductSimplify"].stateValues.isNumber,
        ).eq(true);

        expect(
            stateVariables["/numberComponentsCommas"].stateValues.value.tree,
        ).eqls(["apply", "count", ["tuple", 3, 17, 1]]);
        expect(
            stateVariables["/numberComponentsCommas"].stateValues.isNumber,
        ).eq(false);
        expect(
            stateVariables["/numberComponentsCommasSimplify"].stateValues.value
                .tree,
        ).eq(3);
        expect(
            stateVariables["/numberComponentsCommasSimplify"].stateValues
                .isNumber,
        ).eq(true);
        expect(
            stateVariables["/numberComponentsProduct"].stateValues.value.tree,
        ).eqls(["apply", "count", ["*", 3, 17, 1]]);
        expect(
            stateVariables["/numberComponentsProduct"].stateValues.isNumber,
        ).eq(false);
        expect(
            stateVariables["/numberComponentsProductSimplify"].stateValues.value
                .tree,
        ).eq(1);
        expect(
            stateVariables["/numberComponentsProductSimplify"].stateValues
                .isNumber,
        ).eq(true);

        expect(stateVariables["/macrosCommas"].stateValues.value.tree).eqls([
            "apply",
            "count",
            ["tuple", 3, 17, 1],
        ]);
        expect(stateVariables["/macrosCommas"].stateValues.isNumber).eq(false);
        expect(
            stateVariables["/macrosCommasSimplify"].stateValues.value.tree,
        ).eq(3);
        expect(stateVariables["/macrosCommasSimplify"].stateValues.isNumber).eq(
            true,
        );
        expect(stateVariables["/macrosProduct"].stateValues.value.tree).eqls([
            "apply",
            "count",
            ["*", 3, 17, 1],
        ]);
        expect(stateVariables["/macrosProduct"].stateValues.isNumber).eq(false);
        expect(
            stateVariables["/macrosProductSimplify"].stateValues.value.tree,
        ).eq(1);
        expect(
            stateVariables["/macrosProductSimplify"].stateValues.isNumber,
        ).eq(true);

        expect(stateVariables["/group"].stateValues.value.tree).eqls([
            "apply",
            "count",
            ["tuple", 3, 17, 1],
        ]);
        expect(stateVariables["/group"].stateValues.isNumber).eq(false);
        expect(stateVariables["/groupSimplify"].stateValues.value.tree).eq(3);
        expect(stateVariables["/groupSimplify"].stateValues.isNumber).eq(true);

        expect(stateVariables["/groupPlus"].stateValues.value.tree).eqls([
            "apply",
            "count",
            ["tuple", 3, 17, 1, 3, 17, 1],
        ]);
        expect(stateVariables["/groupPlus"].stateValues.isNumber).eq(false);
        expect(stateVariables["/groupPlusSimplify"].stateValues.value.tree).eq(
            6,
        );
        expect(stateVariables["/groupPlusSimplify"].stateValues.isNumber).eq(
            true,
        );

        expect(stateVariables["/groupPlus2"].stateValues.value.tree).eqls([
            "apply",
            "count",
            ["tuple", 3, 17, 1, 3, 17, 1],
        ]);
        expect(stateVariables["/groupPlus2"].stateValues.isNumber).eq(false);
        expect(stateVariables["/groupPlus2Simplify"].stateValues.value.tree).eq(
            6,
        );
        expect(stateVariables["/groupPlus2Simplify"].stateValues.isNumber).eq(
            true,
        );

        expect(stateVariables["/groupPlus3"].stateValues.value.tree).eqls([
            "apply",
            "count",
            ["tuple", 3, 17, 3, 17, 1, 1],
        ]);
        expect(stateVariables["/groupPlus3"].stateValues.isNumber).eq(false);
        expect(stateVariables["/groupPlus3Simplify"].stateValues.value.tree).eq(
            6,
        );
        expect(stateVariables["/groupPlus3Simplify"].stateValues.isNumber).eq(
            true,
        );
    });

    it("count additional cases", async () => {
        let core = await createTestCore({
            doenetML: `
    <p name="pPrime">Count of first primes: <count name="countPrime">2 3 5 7</count></p>
    <p>Copying that count: $countPrime{name="countPrimeb"}</p>
    $pPrime{name="pPrimeb"}

    <p name="p100">Count of numbers from 1 to 100: <count name="count100"><sequence to="100" /></count></p>
    <p>Copying that count: $count100{name="count100b"}</p>
    $p100{name="p100b"}
    `,
        });

        let stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/countPrime"].stateValues.value.tree).eq(4);
        expect(stateVariables["/countPrimeb"].stateValues.value.tree).eq(4);
        expect(
            stateVariables[
                stateVariables["/pPrimeb"].activeChildren[1].componentName
            ].stateValues.value.tree,
        ).eq(4);
        expect(stateVariables["/count100"].stateValues.value.tree).eq(100);
        expect(stateVariables["/count100b"].stateValues.value.tree).eq(100);
        expect(
            stateVariables[
                stateVariables["/p100b"].activeChildren[1].componentName
            ].stateValues.value.tree,
        ).eq(100);
    });

    it("min", async () => {
        let core = await createTestCore({
            doenetML: `
      <min name="numbers"><number>3</number><number>17</number><number>5-4</number></min>
      <min name="numbersForceSymbolic" forceSymbolic><number>3</number><number>17</number><number>5-4</number></min>
      <min name="numbersForceSymbolicSimplify" forceSymbolic simplify><number>3</number><number>17</number><number>5-4</number></min>
      <min name="numbersWithNumberMath"><math>3</math><number>17</number><number>5-4</number></min>
      <min name="numbersWithNumberMathForceSymbolic" forceSymbolic><math>3</math><number>17</number><number>5-4</number></min>
      <min name="numbersWithNumberMathForceSymbolicSimplify" forceSymbolic simplify><math>3</math><number>17</number><number>5-4</number></min>
      <min name="numbersWithNumericMath"><math>6/2</math><number>17</number><number>5-4</number></min>
      <min name="numbersWithNumericMathSimplify" simplify><math>6/2</math><number>17</number><number>5-4</number></min>
      <min name="numbersWithNumericMathForceNumeric" forceNumeric><math>6/2</math><number>17</number><number>5-4</number></min>
      <min name="withNumberMin"><math>3</math><min><number>17</number><number>5-4</number></min></min>
      <min name="vars"><math>x</math><math>x+y</math><math>x+y+z</math></min>
      <min name="varsSimplify" simplify><math>x</math><math>x+y</math><math>x+y+z</math></min>
      <min name="varsForcedNumeric" forceNumeric><math>x</math><math>x+y</math><math>x+y+z</math></min>
      $numbers{name="numbersb"}
      $vars{name="varsb"}
      `,
        });

        let stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/numbers"].stateValues.value.tree).eq(1);
        expect(stateVariables["/numbers"].stateValues.isNumericOperator).eq(
            true,
        );
        expect(stateVariables["/numbers"].stateValues.isNumber).eq(true);
        expect(
            stateVariables["/numbersForceSymbolic"].stateValues.value.tree,
        ).eqls(["apply", "min", ["tuple", 3, 17, 1]]);
        expect(
            stateVariables["/numbersForceSymbolic"].stateValues
                .isNumericOperator,
        ).eq(false);
        expect(stateVariables["/numbersForceSymbolic"].stateValues.isNumber).eq(
            false,
        );
        expect(
            stateVariables["/numbersForceSymbolicSimplify"].stateValues.value
                .tree,
        ).eq(1);
        expect(
            stateVariables["/numbersForceSymbolicSimplify"].stateValues
                .isNumericOperator,
        ).eq(false);
        expect(
            stateVariables["/numbersForceSymbolicSimplify"].stateValues
                .isNumber,
        ).eq(true);
        expect(
            stateVariables["/numbersWithNumberMath"].stateValues.value.tree,
        ).eq(1);
        expect(
            stateVariables["/numbersWithNumberMath"].stateValues
                .isNumericOperator,
        ).eq(true);
        expect(
            stateVariables["/numbersWithNumberMath"].stateValues.isNumber,
        ).eq(true);
        expect(
            stateVariables["/numbersWithNumberMathForceSymbolic"].stateValues
                .value.tree,
        ).eqls(["apply", "min", ["tuple", 3, 17, 1]]);
        expect(
            stateVariables["/numbersWithNumberMathForceSymbolic"].stateValues
                .isNumericOperator,
        ).eq(false);
        expect(
            stateVariables["/numbersWithNumberMathForceSymbolic"].stateValues
                .isNumber,
        ).eq(false);
        expect(
            stateVariables["/numbersWithNumberMathForceSymbolicSimplify"]
                .stateValues.value.tree,
        ).eq(1);
        expect(
            stateVariables["/numbersWithNumberMathForceSymbolicSimplify"]
                .stateValues.isNumericOperator,
        ).eq(false);
        expect(
            stateVariables["/numbersWithNumberMathForceSymbolicSimplify"]
                .stateValues.isNumber,
        ).eq(true);
        expect(
            stateVariables["/numbersWithNumericMath"].stateValues.value.tree,
        ).eqls(["apply", "min", ["tuple", ["/", 6, 2], 17, 1]]);
        expect(
            stateVariables["/numbersWithNumericMath"].stateValues
                .isNumericOperator,
        ).eq(false);
        expect(
            stateVariables["/numbersWithNumericMath"].stateValues.isNumber,
        ).eq(false);
        expect(
            stateVariables["/numbersWithNumericMathSimplify"].stateValues.value
                .tree,
        ).eq(1);
        expect(
            stateVariables["/numbersWithNumericMathSimplify"].stateValues
                .isNumericOperator,
        ).eq(false);
        expect(
            stateVariables["/numbersWithNumericMathSimplify"].stateValues
                .isNumber,
        ).eq(true);
        expect(
            stateVariables["/numbersWithNumericMathForceNumeric"].stateValues
                .value.tree,
        ).eq(1);
        expect(
            stateVariables["/numbersWithNumericMathForceNumeric"].stateValues
                .isNumericOperator,
        ).eq(true);
        expect(
            stateVariables["/numbersWithNumericMathForceNumeric"].stateValues
                .isNumber,
        ).eq(true);
        expect(stateVariables["/withNumberMin"].stateValues.value.tree).eq(1);
        expect(
            stateVariables["/withNumberMin"].stateValues.isNumericOperator,
        ).eq(true);
        expect(stateVariables["/withNumberMin"].stateValues.isNumber).eq(true);
        expect(stateVariables["/vars"].stateValues.value.tree).eqls([
            "apply",
            "min",
            ["tuple", "x", ["+", "x", "y"], ["+", "x", "y", "z"]],
        ]);
        expect(stateVariables["/vars"].stateValues.isNumericOperator).eq(false);
        expect(stateVariables["/vars"].stateValues.isNumber).eq(false);
        expect(stateVariables["/varsSimplify"].stateValues.value.tree).eqls([
            "apply",
            "min",
            ["tuple", "x", ["+", "x", "y"], ["+", "x", "y", "z"]],
        ]);
        expect(
            stateVariables["/varsSimplify"].stateValues.isNumericOperator,
        ).eq(false);
        expect(stateVariables["/varsSimplify"].stateValues.isNumber).eq(false);
        expect(
            stateVariables["/varsForcedNumeric"].stateValues.value.tree,
        ).eqls(NaN);
        expect(
            stateVariables["/varsForcedNumeric"].stateValues.isNumericOperator,
        ).eq(true);
        expect(stateVariables["/varsForcedNumeric"].stateValues.isNumber).eq(
            false,
        );
        expect(stateVariables["/numbersb"].stateValues.value.tree).eq(1);
        expect(stateVariables["/numbersb"].stateValues.isNumericOperator).eq(
            true,
        );
        expect(stateVariables["/numbersb"].stateValues.isNumber).eq(true);
        expect(stateVariables["/varsb"].stateValues.value.tree).eqls([
            "apply",
            "min",
            ["tuple", "x", ["+", "x", "y"], ["+", "x", "y", "z"]],
        ]);
        expect(stateVariables["/varsb"].stateValues.isNumericOperator).eq(
            false,
        );
        expect(stateVariables["/varsb"].stateValues.isNumber).eq(false);
    });

    it("min with sugar", async () => {
        let core = await createTestCore({
            doenetML: `
      <number name="a">3</number>
      <number name="b">17</number>
      <number name="c">5-4</number>
      <math name="aNumberMath">3</math>
      <math name="aNumericMath">6/2</math>
      <min name="numbers"><number>3</number><number>17</number><number>5-4</number></min>
      <min name="numbersAsString">3 17 1</min>
      <min name="numbersAsStringForceSymbolic" forceSymbolic>3 17 1</min>
      <min name="numbersAsStringForceSymbolicSimplify" forceSymbolic simplify>3 17 1</min>
      <min name="numericAsString">6/2 17 5-4</min>
      <min name="numericAsStringSimplify" simplify>6/2 17 5-4</min>
      <min name="numericAsStringForceNumeric" forceNumeric>6/2 17 5-4</min>
      <min name="numbersAsMacros">$a$b$c</min>
      <min name="numbersAsMacrosForceSymbolic" forceSymbolic>$a$b$c</min>
      <min name="numbersAsMacrosForceSymbolicSimplify" forceSymbolic simplify>$a$b$c</min>
      <min name="numbersAsMacros2">$a $b $c</min>
      <min name="withNumberMathMacro">$aNumberMath$b$c</min>
      <min name="withNumberMathMacroForceSymbolic" forceSymbolic>$aNumberMath$b$c</min>
      <min name="withNumberMathMacroForceSymbolicSimplify" forceSymbolic simplify>$aNumberMath$b$c</min>
      <min name="withNumericMathMacro">$aNumericMath$b$c</min>
      <min name="withNumericMathMacroSimplify" simplify>$aNumericMath$b$c</min>
      <min name="withNumericMathMacroForceNumeric" forceNumeric>$aNumericMath$b$c</min>
      <min name="vars"><math>x</math><math>x+y</math><math>x+y+z</math></min>
      <min name="varsAsString">x x+y x+y+z</min>
      <min name="varsAsStringSimplify" simplify>x x+y x+y+z</min>
      <min name="varsAsStringForceNumeric" forceNumeric>x x+y x+y+z</min>
      `,
        });

        let stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/numbers"].stateValues.value.tree).eq(1);
        expect(stateVariables["/numbers"].stateValues.isNumericOperator).eq(
            true,
        );
        expect(stateVariables["/numbers"].stateValues.isNumber).eq(true);
        expect(stateVariables["/numbersAsString"].stateValues.value.tree).eq(1);
        expect(
            stateVariables["/numbersAsString"].stateValues.isNumericOperator,
        ).eq(true);
        expect(stateVariables["/numbersAsString"].stateValues.isNumber).eq(
            true,
        );
        expect(
            stateVariables["/numbersAsStringForceSymbolic"].stateValues.value
                .tree,
        ).eqls(["apply", "min", ["tuple", 3, 17, 1]]);
        expect(
            stateVariables["/numbersAsStringForceSymbolic"].stateValues
                .isNumericOperator,
        ).eq(false);
        expect(
            stateVariables["/numbersAsStringForceSymbolic"].stateValues
                .isNumber,
        ).eq(false);
        expect(
            stateVariables["/numbersAsStringForceSymbolicSimplify"].stateValues
                .value.tree,
        ).eq(1);
        expect(
            stateVariables["/numbersAsStringForceSymbolicSimplify"].stateValues
                .isNumericOperator,
        ).eq(false);
        expect(
            stateVariables["/numbersAsStringForceSymbolicSimplify"].stateValues
                .isNumber,
        ).eq(true);
        expect(stateVariables["/numericAsString"].stateValues.value.tree).eqls([
            "apply",
            "min",
            ["tuple", ["/", 6, 2], 17, ["+", 5, -4]],
        ]);
        expect(
            stateVariables["/numericAsString"].stateValues.isNumericOperator,
        ).eq(false);
        expect(stateVariables["/numericAsString"].stateValues.isNumber).eq(
            false,
        );
        expect(
            stateVariables["/numericAsStringSimplify"].stateValues.value.tree,
        ).eq(1);
        expect(
            stateVariables["/numericAsStringSimplify"].stateValues
                .isNumericOperator,
        ).eq(false);
        expect(
            stateVariables["/numericAsStringSimplify"].stateValues.isNumber,
        ).eq(true);
        expect(
            stateVariables["/numericAsStringForceNumeric"].stateValues.value
                .tree,
        ).eq(1);
        expect(
            stateVariables["/numericAsStringForceNumeric"].stateValues
                .isNumericOperator,
        ).eq(true);
        expect(
            stateVariables["/numericAsStringForceNumeric"].stateValues.isNumber,
        ).eq(true);
        expect(stateVariables["/numbersAsMacros"].stateValues.value.tree).eq(1);
        expect(
            stateVariables["/numbersAsMacros"].stateValues.isNumericOperator,
        ).eq(true);
        expect(stateVariables["/numbersAsMacros"].stateValues.isNumber).eq(
            true,
        );
        expect(
            stateVariables["/numbersAsMacrosForceSymbolic"].stateValues.value
                .tree,
        ).eqls(["apply", "min", ["tuple", 3, 17, 1]]);
        expect(
            stateVariables["/numbersAsMacrosForceSymbolic"].stateValues
                .isNumericOperator,
        ).eq(false);
        expect(
            stateVariables["/numbersAsMacrosForceSymbolic"].stateValues
                .isNumber,
        ).eq(false);
        expect(
            stateVariables["/numbersAsMacrosForceSymbolicSimplify"].stateValues
                .value.tree,
        ).eq(1);
        expect(
            stateVariables["/numbersAsMacrosForceSymbolicSimplify"].stateValues
                .isNumericOperator,
        ).eq(false);
        expect(
            stateVariables["/numbersAsMacrosForceSymbolicSimplify"].stateValues
                .isNumber,
        ).eq(true);
        expect(stateVariables["/numbersAsMacros2"].stateValues.value.tree).eq(
            1,
        );
        expect(
            stateVariables["/numbersAsMacros2"].stateValues.isNumericOperator,
        ).eq(true);
        expect(stateVariables["/numbersAsMacros2"].stateValues.isNumber).eq(
            true,
        );
        expect(
            stateVariables["/withNumberMathMacro"].stateValues.value.tree,
        ).eq(1);
        expect(
            stateVariables["/withNumberMathMacro"].stateValues
                .isNumericOperator,
        ).eq(true);
        expect(stateVariables["/withNumberMathMacro"].stateValues.isNumber).eq(
            true,
        );
        expect(
            stateVariables["/withNumberMathMacroForceSymbolic"].stateValues
                .value.tree,
        ).eqls(["apply", "min", ["tuple", 3, 17, 1]]);
        expect(
            stateVariables["/withNumberMathMacroForceSymbolic"].stateValues
                .isNumericOperator,
        ).eq(false);
        expect(
            stateVariables["/withNumberMathMacroForceSymbolic"].stateValues
                .isNumber,
        ).eq(false);
        expect(
            stateVariables["/withNumberMathMacroForceSymbolicSimplify"]
                .stateValues.value.tree,
        ).eq(1);
        expect(
            stateVariables["/withNumberMathMacroForceSymbolicSimplify"]
                .stateValues.isNumericOperator,
        ).eq(false);
        expect(
            stateVariables["/withNumberMathMacroForceSymbolicSimplify"]
                .stateValues.isNumber,
        ).eq(true);
        expect(
            stateVariables["/withNumericMathMacro"].stateValues.value.tree,
        ).eqls(["apply", "min", ["tuple", ["/", 6, 2], 17, 1]]);
        expect(
            stateVariables["/withNumericMathMacro"].stateValues
                .isNumericOperator,
        ).eq(false);
        expect(stateVariables["/withNumericMathMacro"].stateValues.isNumber).eq(
            false,
        );
        expect(
            stateVariables["/withNumericMathMacroSimplify"].stateValues.value
                .tree,
        ).eq(1);
        expect(
            stateVariables["/withNumericMathMacroSimplify"].stateValues
                .isNumericOperator,
        ).eq(false);
        expect(
            stateVariables["/withNumericMathMacroSimplify"].stateValues
                .isNumber,
        ).eq(true);
        expect(
            stateVariables["/withNumericMathMacroForceNumeric"].stateValues
                .value.tree,
        ).eq(1);
        expect(
            stateVariables["/withNumericMathMacroForceNumeric"].stateValues
                .isNumericOperator,
        ).eq(true);
        expect(
            stateVariables["/withNumericMathMacroForceNumeric"].stateValues
                .isNumber,
        ).eq(true);
        expect(stateVariables["/vars"].stateValues.value.tree).eqls([
            "apply",
            "min",
            ["tuple", "x", ["+", "x", "y"], ["+", "x", "y", "z"]],
        ]);
        expect(stateVariables["/vars"].stateValues.isNumericOperator).eq(false);
        expect(stateVariables["/vars"].stateValues.isNumber).eq(false);
        expect(stateVariables["/varsAsString"].stateValues.value.tree).eqls([
            "apply",
            "min",
            ["tuple", "x", ["+", "x", "y"], ["+", "x", "y", "z"]],
        ]);
        expect(
            stateVariables["/varsAsString"].stateValues.isNumericOperator,
        ).eq(false);
        expect(stateVariables["/varsAsString"].stateValues.isNumber).eq(false);
        expect(
            stateVariables["/varsAsStringSimplify"].stateValues.value.tree,
        ).eqls([
            "apply",
            "min",
            ["tuple", "x", ["+", "x", "y"], ["+", "x", "y", "z"]],
        ]);
        expect(
            stateVariables["/varsAsStringSimplify"].stateValues
                .isNumericOperator,
        ).eq(false);
        expect(stateVariables["/varsAsStringSimplify"].stateValues.isNumber).eq(
            false,
        );
        expect(
            stateVariables["/varsAsStringForceNumeric"].stateValues.value.tree,
        ).eqls(NaN);
        expect(
            stateVariables["/varsAsStringForceNumeric"].stateValues
                .isNumericOperator,
        ).eq(true);
        expect(
            stateVariables["/varsAsStringForceNumeric"].stateValues.isNumber,
        ).eq(false);
    });

    it("min as math expression", async () => {
        let core = await createTestCore({
            doenetML: `
      <group name="nums" asList>
        <number name="a">3</number>
        <number name="b">17</number>
        <number name="c">5-4</number>
      </group>
      <math name="numberString">min(3,17,5-4)</math>
      <math name="numberStringSimplify" simplify>min(3,17,5-4)</math>
      <math name="numberStringProduct">min(3 17 5-4)</math>
      <math name="numberStringProductSimplify" simplify>min(3 17 5-4)</math>
      <math name="numberComponentsCommas">
        min(<number>3</number>,<number>17</number>,<number>5-4</number>)
      </math>
      <math name="numberComponentsCommasSimplify" simplify>
      min(<number>3</number>,<number>17</number>,<number>5-4</number>)
      </math>
      <math name="numberComponentsProduct">
        min(<number>3</number><number>17</number><number>5-4</number>)
      </math>
      <math name="numberComponentsProductSimplify" simplify>
        min(<number>3</number><number>17</number><number>5-4</number>)
      </math>
      <math name="macrosCommas">
        min($a,$b,$c)
      </math>
      <math name="macrosCommasSimplify" simplify>
        min($a,$b,$c)
      </math>
      <math name="macrosProduct">
        min($a$b$c)
      </math>
      <math name="macrosProductSimplify" simplify>
        min($a$b$c)
      </math>
      <math name="group">
        min($nums)
      </math>
      <math name="groupSimplify" simplify>
        min($nums)
      </math>
      <math name="groupPlus">
        min($nums, $a, $b, $c)
      </math>
      <math name="groupPlusSimplify" simplify>
        min($nums, $a, $b, $c)
      </math>
      <math name="groupPlus2">
        min($a, $b, $c, $nums)
      </math>
      <math name="groupPlus2Simplify" simplify>
        min($a, $b, $c, $nums)
      </math>
      <math name="groupPlus3">
        min($a, $b, $nums, $c)
      </math>
      <math name="groupPlus3Simplify" simplify>
        min($a, $b, $nums, $c)
      </math>
      `,
        });

        let stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/numberString"].stateValues.value.tree).eqls([
            "apply",
            "min",
            ["tuple", 3, 17, ["+", 5, -4]],
        ]);
        expect(stateVariables["/numberString"].stateValues.isNumber).eq(false);
        expect(
            stateVariables["/numberStringSimplify"].stateValues.value.tree,
        ).eq(1);
        expect(stateVariables["/numberStringSimplify"].stateValues.isNumber).eq(
            true,
        );
        expect(
            stateVariables["/numberStringProduct"].stateValues.value.tree,
        ).eqls(["apply", "min", ["+", ["*", 3, 17, 5], -4]]);
        expect(stateVariables["/numberStringProduct"].stateValues.isNumber).eq(
            false,
        );
        expect(
            stateVariables["/numberStringProductSimplify"].stateValues.value
                .tree,
        ).eq(251);
        expect(
            stateVariables["/numberStringProductSimplify"].stateValues.isNumber,
        ).eq(true);

        expect(
            stateVariables["/numberComponentsCommas"].stateValues.value.tree,
        ).eqls(["apply", "min", ["tuple", 3, 17, 1]]);
        expect(
            stateVariables["/numberComponentsCommas"].stateValues.isNumber,
        ).eq(false);
        expect(
            stateVariables["/numberComponentsCommasSimplify"].stateValues.value
                .tree,
        ).eq(1);
        expect(
            stateVariables["/numberComponentsCommasSimplify"].stateValues
                .isNumber,
        ).eq(true);
        expect(
            stateVariables["/numberComponentsProduct"].stateValues.value.tree,
        ).eqls(["apply", "min", ["*", 3, 17, 1]]);
        expect(
            stateVariables["/numberComponentsProduct"].stateValues.isNumber,
        ).eq(false);
        expect(
            stateVariables["/numberComponentsProductSimplify"].stateValues.value
                .tree,
        ).eq(51);
        expect(
            stateVariables["/numberComponentsProductSimplify"].stateValues
                .isNumber,
        ).eq(true);

        expect(stateVariables["/macrosCommas"].stateValues.value.tree).eqls([
            "apply",
            "min",
            ["tuple", 3, 17, 1],
        ]);
        expect(stateVariables["/macrosCommas"].stateValues.isNumber).eq(false);
        expect(
            stateVariables["/macrosCommasSimplify"].stateValues.value.tree,
        ).eq(1);
        expect(stateVariables["/macrosCommasSimplify"].stateValues.isNumber).eq(
            true,
        );
        expect(stateVariables["/macrosProduct"].stateValues.value.tree).eqls([
            "apply",
            "min",
            ["*", 3, 17, 1],
        ]);
        expect(stateVariables["/macrosProduct"].stateValues.isNumber).eq(false);
        expect(
            stateVariables["/macrosProductSimplify"].stateValues.value.tree,
        ).eq(51);
        expect(
            stateVariables["/macrosProductSimplify"].stateValues.isNumber,
        ).eq(true);

        expect(stateVariables["/group"].stateValues.value.tree).eqls([
            "apply",
            "min",
            ["tuple", 3, 17, 1],
        ]);
        expect(stateVariables["/group"].stateValues.isNumber).eq(false);
        expect(stateVariables["/groupSimplify"].stateValues.value.tree).eq(1);
        expect(stateVariables["/groupSimplify"].stateValues.isNumber).eq(true);

        expect(stateVariables["/groupPlus"].stateValues.value.tree).eqls([
            "apply",
            "min",
            ["tuple", 3, 17, 1, 3, 17, 1],
        ]);
        expect(stateVariables["/groupPlus"].stateValues.isNumber).eq(false);
        expect(stateVariables["/groupPlusSimplify"].stateValues.value.tree).eq(
            1,
        );
        expect(stateVariables["/groupPlusSimplify"].stateValues.isNumber).eq(
            true,
        );

        expect(stateVariables["/groupPlus2"].stateValues.value.tree).eqls([
            "apply",
            "min",
            ["tuple", 3, 17, 1, 3, 17, 1],
        ]);
        expect(stateVariables["/groupPlus2"].stateValues.isNumber).eq(false);
        expect(stateVariables["/groupPlus2Simplify"].stateValues.value.tree).eq(
            1,
        );
        expect(stateVariables["/groupPlus2Simplify"].stateValues.isNumber).eq(
            true,
        );

        expect(stateVariables["/groupPlus3"].stateValues.value.tree).eqls([
            "apply",
            "min",
            ["tuple", 3, 17, 3, 17, 1, 1],
        ]);
        expect(stateVariables["/groupPlus3"].stateValues.isNumber).eq(false);
        expect(stateVariables["/groupPlus3Simplify"].stateValues.value.tree).eq(
            1,
        );
        expect(stateVariables["/groupPlus3Simplify"].stateValues.isNumber).eq(
            true,
        );
    });

    it("max", async () => {
        let core = await createTestCore({
            doenetML: `
      <max name="numbers"><number>3</number><number>17</number><number>5-4</number></max>
      <max name="numbersForceSymbolic" forceSymbolic><number>3</number><number>17</number><number>5-4</number></max>
      <max name="numbersForceSymbolicSimplify" forceSymbolic simplify><number>3</number><number>17</number><number>5-4</number></max>
      <max name="numbersWithNumberMath"><math>3</math><number>17</number><number>5-4</number></max>
      <max name="numbersWithNumberMathForceSymbolic" forceSymbolic><math>3</math><number>17</number><number>5-4</number></max>
      <max name="numbersWithNumberMathForceSymbolicSimplify" forceSymbolic simplify><math>3</math><number>17</number><number>5-4</number></max>
      <max name="numbersWithNumericMath"><math>6/2</math><number>17</number><number>5-4</number></max>
      <max name="numbersWithNumericMathSimplify" simplify><math>6/2</math><number>17</number><number>5-4</number></max>
      <max name="numbersWithNumericMathForceNumeric" forceNumeric><math>6/2</math><number>17</number><number>5-4</number></max>
      <max name="withNumberMax"><math>3</math><max><number>17</number><number>5-4</number></max></max>
      <max name="vars"><math>x</math><math>x+y</math><math>x+y+z</math></max>
      <max name="varsSimplify" simplify><math>x</math><math>x+y</math><math>x+y+z</math></max>
      <max name="varsForcedNumeric" forceNumeric><math>x</math><math>x+y</math><math>x+y+z</math></max>
      $numbers{name="numbersb"}
      $vars{name="varsb"}
      `,
        });

        let stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/numbers"].stateValues.value.tree).eq(17);
        expect(stateVariables["/numbers"].stateValues.isNumericOperator).eq(
            true,
        );
        expect(stateVariables["/numbers"].stateValues.isNumber).eq(true);
        expect(
            stateVariables["/numbersForceSymbolic"].stateValues.value.tree,
        ).eqls(["apply", "max", ["tuple", 3, 17, 1]]);
        expect(
            stateVariables["/numbersForceSymbolic"].stateValues
                .isNumericOperator,
        ).eq(false);
        expect(stateVariables["/numbersForceSymbolic"].stateValues.isNumber).eq(
            false,
        );
        expect(
            stateVariables["/numbersForceSymbolicSimplify"].stateValues.value
                .tree,
        ).eq(17);
        expect(
            stateVariables["/numbersForceSymbolicSimplify"].stateValues
                .isNumericOperator,
        ).eq(false);
        expect(
            stateVariables["/numbersForceSymbolicSimplify"].stateValues
                .isNumber,
        ).eq(true);
        expect(
            stateVariables["/numbersWithNumberMath"].stateValues.value.tree,
        ).eq(17);
        expect(
            stateVariables["/numbersWithNumberMath"].stateValues
                .isNumericOperator,
        ).eq(true);
        expect(
            stateVariables["/numbersWithNumberMath"].stateValues.isNumber,
        ).eq(true);
        expect(
            stateVariables["/numbersWithNumberMathForceSymbolic"].stateValues
                .value.tree,
        ).eqls(["apply", "max", ["tuple", 3, 17, 1]]);
        expect(
            stateVariables["/numbersWithNumberMathForceSymbolic"].stateValues
                .isNumericOperator,
        ).eq(false);
        expect(
            stateVariables["/numbersWithNumberMathForceSymbolic"].stateValues
                .isNumber,
        ).eq(false);
        expect(
            stateVariables["/numbersWithNumberMathForceSymbolicSimplify"]
                .stateValues.value.tree,
        ).eq(17);
        expect(
            stateVariables["/numbersWithNumberMathForceSymbolicSimplify"]
                .stateValues.isNumericOperator,
        ).eq(false);
        expect(
            stateVariables["/numbersWithNumberMathForceSymbolicSimplify"]
                .stateValues.isNumber,
        ).eq(true);
        expect(
            stateVariables["/numbersWithNumericMath"].stateValues.value.tree,
        ).eqls(["apply", "max", ["tuple", ["/", 6, 2], 17, 1]]);
        expect(
            stateVariables["/numbersWithNumericMath"].stateValues
                .isNumericOperator,
        ).eq(false);
        expect(
            stateVariables["/numbersWithNumericMath"].stateValues.isNumber,
        ).eq(false);
        expect(
            stateVariables["/numbersWithNumericMathSimplify"].stateValues.value
                .tree,
        ).eq(17);
        expect(
            stateVariables["/numbersWithNumericMathSimplify"].stateValues
                .isNumericOperator,
        ).eq(false);
        expect(
            stateVariables["/numbersWithNumericMathSimplify"].stateValues
                .isNumber,
        ).eq(true);
        expect(
            stateVariables["/numbersWithNumericMathForceNumeric"].stateValues
                .value.tree,
        ).eq(17);
        expect(
            stateVariables["/numbersWithNumericMathForceNumeric"].stateValues
                .isNumericOperator,
        ).eq(true);
        expect(
            stateVariables["/numbersWithNumericMathForceNumeric"].stateValues
                .isNumber,
        ).eq(true);
        expect(stateVariables["/withNumberMax"].stateValues.value.tree).eq(17);
        expect(
            stateVariables["/withNumberMax"].stateValues.isNumericOperator,
        ).eq(true);
        expect(stateVariables["/withNumberMax"].stateValues.isNumber).eq(true);
        expect(stateVariables["/vars"].stateValues.value.tree).eqls([
            "apply",
            "max",
            ["tuple", "x", ["+", "x", "y"], ["+", "x", "y", "z"]],
        ]);
        expect(stateVariables["/vars"].stateValues.isNumericOperator).eq(false);
        expect(stateVariables["/vars"].stateValues.isNumber).eq(false);
        expect(stateVariables["/varsSimplify"].stateValues.value.tree).eqls([
            "apply",
            "max",
            ["tuple", "x", ["+", "x", "y"], ["+", "x", "y", "z"]],
        ]);
        expect(
            stateVariables["/varsSimplify"].stateValues.isNumericOperator,
        ).eq(false);
        expect(stateVariables["/varsSimplify"].stateValues.isNumber).eq(false);
        expect(
            stateVariables["/varsForcedNumeric"].stateValues.value.tree,
        ).eqls(NaN);
        expect(
            stateVariables["/varsForcedNumeric"].stateValues.isNumericOperator,
        ).eq(true);
        expect(stateVariables["/varsForcedNumeric"].stateValues.isNumber).eq(
            false,
        );
        expect(stateVariables["/numbersb"].stateValues.value.tree).eq(17);
        expect(stateVariables["/numbersb"].stateValues.isNumericOperator).eq(
            true,
        );
        expect(stateVariables["/numbersb"].stateValues.isNumber).eq(true);
        expect(stateVariables["/varsb"].stateValues.value.tree).eqls([
            "apply",
            "max",
            ["tuple", "x", ["+", "x", "y"], ["+", "x", "y", "z"]],
        ]);
        expect(stateVariables["/varsb"].stateValues.isNumericOperator).eq(
            false,
        );
        expect(stateVariables["/varsb"].stateValues.isNumber).eq(false);
    });

    it("max with sugar", async () => {
        let core = await createTestCore({
            doenetML: `
      <number name="a">3</number>
      <number name="b">17</number>
      <number name="c">5-4</number>
      <math name="aNumberMath">3</math>
      <math name="aNumericMath">6/2</math>
      <max name="numbers"><number>3</number><number>17</number><number>5-4</number></max>
      <max name="numbersAsString">3 17 1</max>
      <max name="numbersAsStringForceSymbolic" forceSymbolic>3 17 1</max>
      <max name="numbersAsStringForceSymbolicSimplify" forceSymbolic simplify>3 17 1</max>
      <max name="numericAsString">6/2 17 5-4</max>
      <max name="numericAsStringSimplify" simplify>6/2 17 5-4</max>
      <max name="numericAsStringForceNumeric" forceNumeric>6/2 17 5-4</max>
      <max name="numbersAsMacros">$a$b$c</max>
      <max name="numbersAsMacrosForceSymbolic" forceSymbolic>$a$b$c</max>
      <max name="numbersAsMacrosForceSymbolicSimplify" forceSymbolic simplify>$a$b$c</max>
      <max name="numbersAsMacros2">$a $b $c</max>
      <max name="withNumberMathMacro">$aNumberMath$b$c</max>
      <max name="withNumberMathMacroForceSymbolic" forceSymbolic>$aNumberMath$b$c</max>
      <max name="withNumberMathMacroForceSymbolicSimplify" forceSymbolic simplify>$aNumberMath$b$c</max>
      <max name="withNumericMathMacro">$aNumericMath$b$c</max>
      <max name="withNumericMathMacroSimplify" simplify>$aNumericMath$b$c</max>
      <max name="withNumericMathMacroForceNumeric" forceNumeric>$aNumericMath$b$c</max>
      <max name="vars"><math>x</math><math>x+y</math><math>x+y+z</math></max>
      <max name="varsAsString">x x+y x+y+z</max>
      <max name="varsAsStringSimplify" simplify>x x+y x+y+z</max>
      <max name="varsAsStringForceNumeric" forceNumeric>x x+y x+y+z</max>
      `,
        });

        let stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/numbers"].stateValues.value.tree).eq(17);
        expect(stateVariables["/numbers"].stateValues.isNumericOperator).eq(
            true,
        );
        expect(stateVariables["/numbers"].stateValues.isNumber).eq(true);
        expect(stateVariables["/numbersAsString"].stateValues.value.tree).eq(
            17,
        );
        expect(
            stateVariables["/numbersAsString"].stateValues.isNumericOperator,
        ).eq(true);
        expect(stateVariables["/numbersAsString"].stateValues.isNumber).eq(
            true,
        );
        expect(
            stateVariables["/numbersAsStringForceSymbolic"].stateValues.value
                .tree,
        ).eqls(["apply", "max", ["tuple", 3, 17, 1]]);
        expect(
            stateVariables["/numbersAsStringForceSymbolic"].stateValues
                .isNumericOperator,
        ).eq(false);
        expect(
            stateVariables["/numbersAsStringForceSymbolic"].stateValues
                .isNumber,
        ).eq(false);
        expect(
            stateVariables["/numbersAsStringForceSymbolicSimplify"].stateValues
                .value.tree,
        ).eq(17);
        expect(
            stateVariables["/numbersAsStringForceSymbolicSimplify"].stateValues
                .isNumericOperator,
        ).eq(false);
        expect(
            stateVariables["/numbersAsStringForceSymbolicSimplify"].stateValues
                .isNumber,
        ).eq(true);
        expect(stateVariables["/numericAsString"].stateValues.value.tree).eqls([
            "apply",
            "max",
            ["tuple", ["/", 6, 2], 17, ["+", 5, -4]],
        ]);
        expect(
            stateVariables["/numericAsString"].stateValues.isNumericOperator,
        ).eq(false);
        expect(stateVariables["/numericAsString"].stateValues.isNumber).eq(
            false,
        );
        expect(
            stateVariables["/numericAsStringSimplify"].stateValues.value.tree,
        ).eq(17);
        expect(
            stateVariables["/numericAsStringSimplify"].stateValues
                .isNumericOperator,
        ).eq(false);
        expect(
            stateVariables["/numericAsStringSimplify"].stateValues.isNumber,
        ).eq(true);
        expect(
            stateVariables["/numericAsStringForceNumeric"].stateValues.value
                .tree,
        ).eq(17);
        expect(
            stateVariables["/numericAsStringForceNumeric"].stateValues
                .isNumericOperator,
        ).eq(true);
        expect(
            stateVariables["/numericAsStringForceNumeric"].stateValues.isNumber,
        ).eq(true);
        expect(stateVariables["/numbersAsMacros"].stateValues.value.tree).eq(
            17,
        );
        expect(
            stateVariables["/numbersAsMacros"].stateValues.isNumericOperator,
        ).eq(true);
        expect(stateVariables["/numbersAsMacros"].stateValues.isNumber).eq(
            true,
        );
        expect(
            stateVariables["/numbersAsMacrosForceSymbolic"].stateValues.value
                .tree,
        ).eqls(["apply", "max", ["tuple", 3, 17, 1]]);
        expect(
            stateVariables["/numbersAsMacrosForceSymbolic"].stateValues
                .isNumericOperator,
        ).eq(false);
        expect(
            stateVariables["/numbersAsMacrosForceSymbolic"].stateValues
                .isNumber,
        ).eq(false);
        expect(
            stateVariables["/numbersAsMacrosForceSymbolicSimplify"].stateValues
                .value.tree,
        ).eq(17);
        expect(
            stateVariables["/numbersAsMacrosForceSymbolicSimplify"].stateValues
                .isNumericOperator,
        ).eq(false);
        expect(
            stateVariables["/numbersAsMacrosForceSymbolicSimplify"].stateValues
                .isNumber,
        ).eq(true);
        expect(stateVariables["/numbersAsMacros2"].stateValues.value.tree).eq(
            17,
        );
        expect(
            stateVariables["/numbersAsMacros2"].stateValues.isNumericOperator,
        ).eq(true);
        expect(stateVariables["/numbersAsMacros2"].stateValues.isNumber).eq(
            true,
        );
        expect(
            stateVariables["/withNumberMathMacro"].stateValues.value.tree,
        ).eq(17);
        expect(
            stateVariables["/withNumberMathMacro"].stateValues
                .isNumericOperator,
        ).eq(true);
        expect(stateVariables["/withNumberMathMacro"].stateValues.isNumber).eq(
            true,
        );
        expect(
            stateVariables["/withNumberMathMacroForceSymbolic"].stateValues
                .value.tree,
        ).eqls(["apply", "max", ["tuple", 3, 17, 1]]);
        expect(
            stateVariables["/withNumberMathMacroForceSymbolic"].stateValues
                .isNumericOperator,
        ).eq(false);
        expect(
            stateVariables["/withNumberMathMacroForceSymbolic"].stateValues
                .isNumber,
        ).eq(false);
        expect(
            stateVariables["/withNumberMathMacroForceSymbolicSimplify"]
                .stateValues.value.tree,
        ).eq(17);
        expect(
            stateVariables["/withNumberMathMacroForceSymbolicSimplify"]
                .stateValues.isNumericOperator,
        ).eq(false);
        expect(
            stateVariables["/withNumberMathMacroForceSymbolicSimplify"]
                .stateValues.isNumber,
        ).eq(true);
        expect(
            stateVariables["/withNumericMathMacro"].stateValues.value.tree,
        ).eqls(["apply", "max", ["tuple", ["/", 6, 2], 17, 1]]);
        expect(
            stateVariables["/withNumericMathMacro"].stateValues
                .isNumericOperator,
        ).eq(false);
        expect(stateVariables["/withNumericMathMacro"].stateValues.isNumber).eq(
            false,
        );
        expect(
            stateVariables["/withNumericMathMacroSimplify"].stateValues.value
                .tree,
        ).eq(17);
        expect(
            stateVariables["/withNumericMathMacroSimplify"].stateValues
                .isNumericOperator,
        ).eq(false);
        expect(
            stateVariables["/withNumericMathMacroSimplify"].stateValues
                .isNumber,
        ).eq(true);
        expect(
            stateVariables["/withNumericMathMacroForceNumeric"].stateValues
                .value.tree,
        ).eq(17);
        expect(
            stateVariables["/withNumericMathMacroForceNumeric"].stateValues
                .isNumericOperator,
        ).eq(true);
        expect(
            stateVariables["/withNumericMathMacroForceNumeric"].stateValues
                .isNumber,
        ).eq(true);
        expect(stateVariables["/vars"].stateValues.value.tree).eqls([
            "apply",
            "max",
            ["tuple", "x", ["+", "x", "y"], ["+", "x", "y", "z"]],
        ]);
        expect(stateVariables["/vars"].stateValues.isNumericOperator).eq(false);
        expect(stateVariables["/vars"].stateValues.isNumber).eq(false);
        expect(stateVariables["/varsAsString"].stateValues.value.tree).eqls([
            "apply",
            "max",
            ["tuple", "x", ["+", "x", "y"], ["+", "x", "y", "z"]],
        ]);
        expect(
            stateVariables["/varsAsString"].stateValues.isNumericOperator,
        ).eq(false);
        expect(stateVariables["/varsAsString"].stateValues.isNumber).eq(false);
        expect(
            stateVariables["/varsAsStringSimplify"].stateValues.value.tree,
        ).eqls([
            "apply",
            "max",
            ["tuple", "x", ["+", "x", "y"], ["+", "x", "y", "z"]],
        ]);
        expect(
            stateVariables["/varsAsStringSimplify"].stateValues
                .isNumericOperator,
        ).eq(false);
        expect(stateVariables["/varsAsStringSimplify"].stateValues.isNumber).eq(
            false,
        );
        expect(
            stateVariables["/varsAsStringForceNumeric"].stateValues.value.tree,
        ).eqls(NaN);
        expect(
            stateVariables["/varsAsStringForceNumeric"].stateValues
                .isNumericOperator,
        ).eq(true);
        expect(
            stateVariables["/varsAsStringForceNumeric"].stateValues.isNumber,
        ).eq(false);
    });

    it("max as math expression", async () => {
        let core = await createTestCore({
            doenetML: `
      <group name="nums" asList>
        <number name="a">3</number>
        <number name="b">17</number>
        <number name="c">5-4</number>
      </group>
      <math name="numberString">max(3,17,5-4)</math>
      <math name="numberStringSimplify" simplify>max(3,17,5-4)</math>
      <math name="numberStringProduct">max(3 17 5-4)</math>
      <math name="numberStringProductSimplify" simplify>max(3 17 5-4)</math>
      <math name="numberComponentsCommas">
        max(<number>3</number>,<number>17</number>,<number>5-4</number>)
      </math>
      <math name="numberComponentsCommasSimplify" simplify>
      max(<number>3</number>,<number>17</number>,<number>5-4</number>)
      </math>
      <math name="numberComponentsProduct">
        max(<number>3</number><number>17</number><number>5-4</number>)
      </math>
      <math name="numberComponentsProductSimplify" simplify>
        max(<number>3</number><number>17</number><number>5-4</number>)
      </math>
      <math name="macrosCommas">
        max($a,$b,$c)
      </math>
      <math name="macrosCommasSimplify" simplify>
        max($a,$b,$c)
      </math>
      <math name="macrosProduct">
        max($a$b$c)
      </math>
      <math name="macrosProductSimplify" simplify>
        max($a$b$c)
      </math>
      <math name="group">
        max($nums)
      </math>
      <math name="groupSimplify" simplify>
        max($nums)
      </math>
      <math name="groupPlus">
        max($nums, $a, $b, $c)
      </math>
      <math name="groupPlusSimplify" simplify>
        max($nums, $a, $b, $c)
      </math>
      <math name="groupPlus2">
        max($a, $b, $c, $nums)
      </math>
      <math name="groupPlus2Simplify" simplify>
        max($a, $b, $c, $nums)
      </math>
      <math name="groupPlus3">
        max($a, $b, $nums, $c)
      </math>
      <math name="groupPlus3Simplify" simplify>
        max($a, $b, $nums, $c)
      </math>
      `,
        });

        let stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/numberString"].stateValues.value.tree).eqls([
            "apply",
            "max",
            ["tuple", 3, 17, ["+", 5, -4]],
        ]);
        expect(stateVariables["/numberString"].stateValues.isNumber).eq(false);
        expect(
            stateVariables["/numberStringSimplify"].stateValues.value.tree,
        ).eq(17);
        expect(stateVariables["/numberStringSimplify"].stateValues.isNumber).eq(
            true,
        );
        expect(
            stateVariables["/numberStringProduct"].stateValues.value.tree,
        ).eqls(["apply", "max", ["+", ["*", 3, 17, 5], -4]]);
        expect(stateVariables["/numberStringProduct"].stateValues.isNumber).eq(
            false,
        );
        expect(
            stateVariables["/numberStringProductSimplify"].stateValues.value
                .tree,
        ).eq(251);
        expect(
            stateVariables["/numberStringProductSimplify"].stateValues.isNumber,
        ).eq(true);

        expect(
            stateVariables["/numberComponentsCommas"].stateValues.value.tree,
        ).eqls(["apply", "max", ["tuple", 3, 17, 1]]);
        expect(
            stateVariables["/numberComponentsCommas"].stateValues.isNumber,
        ).eq(false);
        expect(
            stateVariables["/numberComponentsCommasSimplify"].stateValues.value
                .tree,
        ).eq(17);
        expect(
            stateVariables["/numberComponentsCommasSimplify"].stateValues
                .isNumber,
        ).eq(true);
        expect(
            stateVariables["/numberComponentsProduct"].stateValues.value.tree,
        ).eqls(["apply", "max", ["*", 3, 17, 1]]);
        expect(
            stateVariables["/numberComponentsProduct"].stateValues.isNumber,
        ).eq(false);
        expect(
            stateVariables["/numberComponentsProductSimplify"].stateValues.value
                .tree,
        ).eq(51);
        expect(
            stateVariables["/numberComponentsProductSimplify"].stateValues
                .isNumber,
        ).eq(true);

        expect(stateVariables["/macrosCommas"].stateValues.value.tree).eqls([
            "apply",
            "max",
            ["tuple", 3, 17, 1],
        ]);
        expect(stateVariables["/macrosCommas"].stateValues.isNumber).eq(false);
        expect(
            stateVariables["/macrosCommasSimplify"].stateValues.value.tree,
        ).eq(17);
        expect(stateVariables["/macrosCommasSimplify"].stateValues.isNumber).eq(
            true,
        );
        expect(stateVariables["/macrosProduct"].stateValues.value.tree).eqls([
            "apply",
            "max",
            ["*", 3, 17, 1],
        ]);
        expect(stateVariables["/macrosProduct"].stateValues.isNumber).eq(false);
        expect(
            stateVariables["/macrosProductSimplify"].stateValues.value.tree,
        ).eq(51);
        expect(
            stateVariables["/macrosProductSimplify"].stateValues.isNumber,
        ).eq(true);

        expect(stateVariables["/group"].stateValues.value.tree).eqls([
            "apply",
            "max",
            ["tuple", 3, 17, 1],
        ]);
        expect(stateVariables["/group"].stateValues.isNumber).eq(false);
        expect(stateVariables["/groupSimplify"].stateValues.value.tree).eq(17);
        expect(stateVariables["/groupSimplify"].stateValues.isNumber).eq(true);

        expect(stateVariables["/groupPlus"].stateValues.value.tree).eqls([
            "apply",
            "max",
            ["tuple", 3, 17, 1, 3, 17, 1],
        ]);
        expect(stateVariables["/groupPlus"].stateValues.isNumber).eq(false);
        expect(stateVariables["/groupPlusSimplify"].stateValues.value.tree).eq(
            17,
        );
        expect(stateVariables["/groupPlusSimplify"].stateValues.isNumber).eq(
            true,
        );

        expect(stateVariables["/groupPlus2"].stateValues.value.tree).eqls([
            "apply",
            "max",
            ["tuple", 3, 17, 1, 3, 17, 1],
        ]);
        expect(stateVariables["/groupPlus2"].stateValues.isNumber).eq(false);
        expect(stateVariables["/groupPlus2Simplify"].stateValues.value.tree).eq(
            17,
        );
        expect(stateVariables["/groupPlus2Simplify"].stateValues.isNumber).eq(
            true,
        );

        expect(stateVariables["/groupPlus3"].stateValues.value.tree).eqls([
            "apply",
            "max",
            ["tuple", 3, 17, 3, 17, 1, 1],
        ]);
        expect(stateVariables["/groupPlus3"].stateValues.isNumber).eq(false);
        expect(stateVariables["/groupPlus3Simplify"].stateValues.value.tree).eq(
            17,
        );
        expect(stateVariables["/groupPlus3Simplify"].stateValues.isNumber).eq(
            true,
        );
    });

    it("max can be invertible", async () => {
        let core = await createTestCore({
            doenetML: `
      <max name="numbers00"><number>3</number><number>6</number></max>
      <max name="numbers01"><number>3</number><number fixed>6</number></max>
      <max name="numbers10"><number fixed>3</number><number>6</number></max>
      <max name="numbers11"><number fixed>3</number><number fixed>6</number></max>

      <max name="maths00"><math>3</math><math>6</math></max>
      <max name="maths01"><math>3</math><math fixed>6</math></max>
      <max name="maths10"><math fixed>3</math><math>6</math></max>
      <max name="maths11"><math fixed>3</math><math fixed>6</math></max>

      <mathinput name="minumbers00" bindValueTo="$numbers00" />
      <mathinput name="minumbers01" bindValueTo="$numbers01" />
      <mathinput name="minumbers10" bindValueTo="$numbers10" />
      <mathinput name="minumbers11" bindValueTo="$numbers11" />

      <mathinput name="mimaths00" bindValueTo="$maths00" />
      <mathinput name="mimaths01" bindValueTo="$maths01" />
      <mathinput name="mimaths10" bindValueTo="$maths10" />
      <mathinput name="mimaths11" bindValueTo="$maths11" />


      `,
        });

        let stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/numbers00"].stateValues.value.tree).eq(6);
        expect(stateVariables["/numbers01"].stateValues.value.tree).eq(6);
        expect(stateVariables["/numbers10"].stateValues.value.tree).eq(6);
        expect(stateVariables["/numbers11"].stateValues.value.tree).eq(6);
        expect(stateVariables["/maths00"].stateValues.value.tree).eq(6);
        expect(stateVariables["/maths01"].stateValues.value.tree).eq(6);
        expect(stateVariables["/maths10"].stateValues.value.tree).eq(6);
        expect(stateVariables["/maths11"].stateValues.value.tree).eq(6);

        await updateMathInputValue({
            name: "/minumbers00",
            latex: "9",
            core,
        });
        await updateMathInputValue({
            name: "/minumbers01",
            latex: "9",
            core,
        });
        await updateMathInputValue({
            name: "/minumbers10",
            latex: "9",
            core,
        });
        await updateMathInputValue({
            name: "/minumbers11",
            latex: "9",
            core,
        });

        await updateMathInputValue({
            name: "/mimaths00",
            latex: "9",
            core,
        });
        await updateMathInputValue({
            name: "/mimaths01",
            latex: "9",
            core,
        });
        await updateMathInputValue({
            name: "/mimaths10",
            latex: "9",
            core,
        });
        await updateMathInputValue({
            name: "/mimaths11",
            latex: "9",
            core,
        });

        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/numbers00"].stateValues.value.tree).eq(6);
        expect(stateVariables["/numbers01"].stateValues.value.tree).eq(9);
        expect(stateVariables["/numbers10"].stateValues.value.tree).eq(9);
        expect(stateVariables["/numbers11"].stateValues.value.tree).eq(6);
        expect(stateVariables["/maths00"].stateValues.value.tree).eq(6);
        expect(stateVariables["/maths01"].stateValues.value.tree).eq(9);
        expect(stateVariables["/maths10"].stateValues.value.tree).eq(9);
        expect(stateVariables["/maths11"].stateValues.value.tree).eq(6);

        await updateMathInputValue({
            name: "/minumbers00",
            latex: "5",
            core,
        });
        await updateMathInputValue({
            name: "/minumbers01",
            latex: "5",
            core,
        });
        await updateMathInputValue({
            name: "/minumbers10",
            latex: "5",
            core,
        });
        await updateMathInputValue({
            name: "/minumbers11",
            latex: "5",
            core,
        });

        await updateMathInputValue({
            name: "/mimaths00",
            latex: "5",
            core,
        });
        await updateMathInputValue({
            name: "/mimaths01",
            latex: "5",
            core,
        });
        await updateMathInputValue({
            name: "/mimaths10",
            latex: "5",
            core,
        });
        await updateMathInputValue({
            name: "/mimaths11",
            latex: "5",
            core,
        });

        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/numbers00"].stateValues.value.tree).eq(6);
        expect(stateVariables["/numbers01"].stateValues.value.tree).eq(6);
        expect(stateVariables["/numbers10"].stateValues.value.tree).eq(5);
        expect(stateVariables["/numbers11"].stateValues.value.tree).eq(6);
        expect(stateVariables["/maths00"].stateValues.value.tree).eq(6);
        expect(stateVariables["/maths01"].stateValues.value.tree).eq(6);
        expect(stateVariables["/maths10"].stateValues.value.tree).eq(5);
        expect(stateVariables["/maths11"].stateValues.value.tree).eq(6);

        await updateMathInputValue({
            name: "/minumbers00",
            latex: "2",
            core,
        });
        await updateMathInputValue({
            name: "/minumbers01",
            latex: "2",
            core,
        });
        await updateMathInputValue({
            name: "/minumbers10",
            latex: "2",
            core,
        });
        await updateMathInputValue({
            name: "/minumbers11",
            latex: "2",
            core,
        });

        await updateMathInputValue({
            name: "/mimaths00",
            latex: "2",
            core,
        });
        await updateMathInputValue({
            name: "/mimaths01",
            latex: "2",
            core,
        });
        await updateMathInputValue({
            name: "/mimaths10",
            latex: "2",
            core,
        });
        await updateMathInputValue({
            name: "/mimaths11",
            latex: "2",
            core,
        });

        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/numbers00"].stateValues.value.tree).eq(6);
        expect(stateVariables["/numbers01"].stateValues.value.tree).eq(6);
        expect(stateVariables["/numbers10"].stateValues.value.tree).eq(3);
        expect(stateVariables["/numbers11"].stateValues.value.tree).eq(6);
        expect(stateVariables["/maths00"].stateValues.value.tree).eq(6);
        expect(stateVariables["/maths01"].stateValues.value.tree).eq(6);
        expect(stateVariables["/maths10"].stateValues.value.tree).eq(3);
        expect(stateVariables["/maths11"].stateValues.value.tree).eq(6);

        await updateMathInputValue({
            name: "/minumbers00",
            latex: "x",
            core,
        });
        await updateMathInputValue({
            name: "/minumbers01",
            latex: "x",
            core,
        });
        await updateMathInputValue({
            name: "/minumbers10",
            latex: "x",
            core,
        });
        await updateMathInputValue({
            name: "/minumbers11",
            latex: "x",
            core,
        });

        await updateMathInputValue({
            name: "/mimaths00",
            latex: "x",
            core,
        });
        await updateMathInputValue({
            name: "/mimaths01",
            latex: "x",
            core,
        });
        await updateMathInputValue({
            name: "/mimaths10",
            latex: "x",
            core,
        });
        await updateMathInputValue({
            name: "/mimaths11",
            latex: "x",
            core,
        });

        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/numbers00"].stateValues.value.tree).eq(6);
        expect(stateVariables["/numbers01"].stateValues.value.tree).eqls(NaN);
        expect(stateVariables["/numbers10"].stateValues.value.tree).eqls(NaN);
        expect(stateVariables["/numbers11"].stateValues.value.tree).eq(6);
        expect(stateVariables["/maths00"].stateValues.value.tree).eq(6);
        expect(stateVariables["/maths01"].stateValues.value.tree).eqls([
            "apply",
            "max",
            ["tuple", "x", 6],
        ]);
        expect(stateVariables["/maths10"].stateValues.value.tree).eqls([
            "apply",
            "max",
            ["tuple", 3, "x"],
        ]);
        expect(stateVariables["/maths11"].stateValues.value.tree).eq(6);

        await updateMathInputValue({
            name: "/minumbers00",
            latex: "y",
            core,
        });
        await updateMathInputValue({
            name: "/minumbers01",
            latex: "y",
            core,
        });
        await updateMathInputValue({
            name: "/minumbers10",
            latex: "y",
            core,
        });
        await updateMathInputValue({
            name: "/minumbers11",
            latex: "y",
            core,
        });

        await updateMathInputValue({
            name: "/mimaths00",
            latex: "y",
            core,
        });
        await updateMathInputValue({
            name: "/mimaths01",
            latex: "y",
            core,
        });
        await updateMathInputValue({
            name: "/mimaths10",
            latex: "y",
            core,
        });
        await updateMathInputValue({
            name: "/mimaths11",
            latex: "y",
            core,
        });

        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/numbers00"].stateValues.value.tree).eq(6);
        expect(stateVariables["/numbers01"].stateValues.value.tree).eqls(NaN);
        expect(stateVariables["/numbers10"].stateValues.value.tree).eqls(NaN);
        expect(stateVariables["/numbers11"].stateValues.value.tree).eq(6);
        expect(stateVariables["/maths00"].stateValues.value.tree).eq(6);
        expect(stateVariables["/maths01"].stateValues.value.tree).eqls([
            "apply",
            "max",
            ["tuple", "y", 6],
        ]);
        expect(stateVariables["/maths10"].stateValues.value.tree).eqls([
            "apply",
            "max",
            ["tuple", 3, "y"],
        ]);
        expect(stateVariables["/maths11"].stateValues.value.tree).eq(6);

        await updateMathInputValue({
            name: "/minumbers00",
            latex: "7",
            core,
        });
        await updateMathInputValue({
            name: "/minumbers01",
            latex: "7",
            core,
        });
        await updateMathInputValue({
            name: "/minumbers10",
            latex: "7",
            core,
        });
        await updateMathInputValue({
            name: "/minumbers11",
            latex: "7",
            core,
        });

        await updateMathInputValue({
            name: "/mimaths00",
            latex: "7",
            core,
        });
        await updateMathInputValue({
            name: "/mimaths01",
            latex: "7",
            core,
        });
        await updateMathInputValue({
            name: "/mimaths10",
            latex: "7",
            core,
        });
        await updateMathInputValue({
            name: "/mimaths11",
            latex: "7",
            core,
        });

        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/numbers00"].stateValues.value.tree).eq(6);
        expect(stateVariables["/numbers01"].stateValues.value.tree).eq(7);
        expect(stateVariables["/numbers10"].stateValues.value.tree).eq(7);
        expect(stateVariables["/numbers11"].stateValues.value.tree).eq(6);
        expect(stateVariables["/maths00"].stateValues.value.tree).eq(6);
        expect(stateVariables["/maths01"].stateValues.value.tree).eq(7);
        expect(stateVariables["/maths10"].stateValues.value.tree).eq(7);
        expect(stateVariables["/maths11"].stateValues.value.tree).eq(6);
    });

    it("mod", async () => {
        let core = await createTestCore({
            doenetML: `
      <mod name="numbers"><number>17</number><number>3</number></mod>
      <mod name="numbersForceSymbolic" forceSymbolic><number>17</number><number>3</number></mod>
      <mod name="numbersForceSymbolicSimplify" forceSymbolic simplify><number>17</number><number>3</number></mod>
      <mod name="numbersWithNumberMath"><number>17</number><math>3</math></mod>
      <mod name="numbersWithNumberMathForceSymbolic" forceSymbolic><number>17</number><math>3</math></mod>
      <mod name="numbersWithNumberMathForceSymbolicSimplify" forceSymbolic simplify><number>17</number><math>3</math></mod>
      <mod name="numbersWithNumericMath"><number>17</number><math>6/2</math></mod>
      <mod name="numbersWithNumericMathSimplify" simplify><number>17</number><math>6/2</math></mod>
      <mod name="numbersWithNumericMathForceNumeric" forceNumeric><number>17</number><math>6/2</math></mod>
      <mod name="withNumberMod"><math>17</math><mod><number>16</number><number>9</number></mod></mod>
      $numbers{name="numbersb"}
      `,
        });

        let stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/numbers"].stateValues.value.tree).eq(2);
        expect(stateVariables["/numbers"].stateValues.isNumericOperator).eq(
            true,
        );
        expect(stateVariables["/numbers"].stateValues.isNumber).eq(true);
        expect(
            stateVariables["/numbersForceSymbolic"].stateValues.value.tree,
        ).eqls(["apply", "mod", ["tuple", 17, 3]]);
        expect(
            stateVariables["/numbersForceSymbolic"].stateValues
                .isNumericOperator,
        ).eq(false);
        expect(stateVariables["/numbersForceSymbolic"].stateValues.isNumber).eq(
            false,
        );
        expect(
            stateVariables["/numbersForceSymbolicSimplify"].stateValues.value
                .tree,
        ).eq(2);
        expect(
            stateVariables["/numbersForceSymbolicSimplify"].stateValues
                .isNumericOperator,
        ).eq(false);
        expect(
            stateVariables["/numbersForceSymbolicSimplify"].stateValues
                .isNumber,
        ).eq(true);
        expect(
            stateVariables["/numbersWithNumberMath"].stateValues.value.tree,
        ).eq(2);
        expect(
            stateVariables["/numbersWithNumberMath"].stateValues
                .isNumericOperator,
        ).eq(true);
        expect(
            stateVariables["/numbersWithNumberMath"].stateValues.isNumber,
        ).eq(true);
        expect(
            stateVariables["/numbersWithNumberMathForceSymbolic"].stateValues
                .value.tree,
        ).eqls(["apply", "mod", ["tuple", 17, 3]]);
        expect(
            stateVariables["/numbersWithNumberMathForceSymbolic"].stateValues
                .isNumericOperator,
        ).eq(false);
        expect(
            stateVariables["/numbersWithNumberMathForceSymbolic"].stateValues
                .isNumber,
        ).eq(false);
        expect(
            stateVariables["/numbersWithNumberMathForceSymbolicSimplify"]
                .stateValues.value.tree,
        ).eq(2);
        expect(
            stateVariables["/numbersWithNumberMathForceSymbolicSimplify"]
                .stateValues.isNumericOperator,
        ).eq(false);
        expect(
            stateVariables["/numbersWithNumberMathForceSymbolicSimplify"]
                .stateValues.isNumber,
        ).eq(true);
        expect(
            stateVariables["/numbersWithNumericMath"].stateValues.value.tree,
        ).eqls(["apply", "mod", ["tuple", 17, ["/", 6, 2]]]);
        expect(
            stateVariables["/numbersWithNumericMath"].stateValues
                .isNumericOperator,
        ).eq(false);
        expect(
            stateVariables["/numbersWithNumericMath"].stateValues.isNumber,
        ).eq(false);
        expect(
            stateVariables["/numbersWithNumericMathSimplify"].stateValues.value
                .tree,
        ).eq(2);
        expect(
            stateVariables["/numbersWithNumericMathSimplify"].stateValues
                .isNumericOperator,
        ).eq(false);
        expect(
            stateVariables["/numbersWithNumericMathSimplify"].stateValues
                .isNumber,
        ).eq(true);
        expect(
            stateVariables["/numbersWithNumericMathForceNumeric"].stateValues
                .value.tree,
        ).eq(2);
        expect(
            stateVariables["/numbersWithNumericMathForceNumeric"].stateValues
                .isNumericOperator,
        ).eq(true);
        expect(
            stateVariables["/numbersWithNumericMathForceNumeric"].stateValues
                .isNumber,
        ).eq(true);
        expect(stateVariables["/withNumberMod"].stateValues.value.tree).eq(3);
        expect(
            stateVariables["/withNumberMod"].stateValues.isNumericOperator,
        ).eq(true);
        expect(stateVariables["/withNumberMod"].stateValues.isNumber).eq(true);
        expect(stateVariables["/numbersb"].stateValues.value.tree).eq(2);
        expect(stateVariables["/numbersb"].stateValues.isNumericOperator).eq(
            true,
        );
        expect(stateVariables["/numbersb"].stateValues.isNumber).eq(true);
    });

    it("mod with sugar", async () => {
        let core = await createTestCore({
            doenetML: `
      <number name="a">17</number>
      <number name="b">3</number>
      <math name="bNumberMath">3</math>
      <math name="bNumericMath">6/2</math>
      <mod name="numbers"><number>17</number><number>3</number></mod>
      <mod name="numbersAsString">17 3</mod>
      <mod name="numbersAsStringForceSymbolic" forceSymbolic>17 3</mod>
      <mod name="numbersAsStringForceSymbolicSimplify" forceSymbolic simplify>17 3</mod>
      <mod name="numericAsString">17 6/2</mod>
      <mod name="numericAsStringSimplify" simplify>17 6/2</mod>
      <mod name="numericAsStringForceNumeric" forceNumeric>17 6/2</mod>
      <mod name="numbersAsMacros">$a$b</mod>
      <mod name="numbersAsMacrosForceSymbolic" forceSymbolic>$a$b</mod>
      <mod name="numbersAsMacrosForceSymbolicSimplify" forceSymbolic simplify>$a$b</mod>
      <mod name="numbersAsMacros2">$a $b</mod>
      <mod name="withNumberMathMacro">$a$bNumberMath</mod>
      <mod name="withNumberMathMacroForceSymbolic" forceSymbolic>$a$bNumberMath</mod>
      <mod name="withNumberMathMacroForceSymbolicSimplify" forceSymbolic simplify>$a$bNumberMath</mod>
      <mod name="withNumericMathMacro">$a$bNumericMath</mod>
      <mod name="withNumericMathMacroSimplify" simplify>$a$bNumericMath</mod>
      <mod name="withNumericMathMacroForceNumeric" forceNumeric>$a$bNumericMath</mod>
      `,
        });

        let stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/numbers"].stateValues.value.tree).eq(2);
        expect(stateVariables["/numbers"].stateValues.isNumericOperator).eq(
            true,
        );
        expect(stateVariables["/numbers"].stateValues.isNumber).eq(true);
        expect(stateVariables["/numbersAsString"].stateValues.value.tree).eq(2);
        expect(
            stateVariables["/numbersAsString"].stateValues.isNumericOperator,
        ).eq(true);
        expect(stateVariables["/numbersAsString"].stateValues.isNumber).eq(
            true,
        );
        expect(
            stateVariables["/numbersAsStringForceSymbolic"].stateValues.value
                .tree,
        ).eqls(["apply", "mod", ["tuple", 17, 3]]);
        expect(
            stateVariables["/numbersAsStringForceSymbolic"].stateValues
                .isNumericOperator,
        ).eq(false);
        expect(
            stateVariables["/numbersAsStringForceSymbolic"].stateValues
                .isNumber,
        ).eq(false);
        expect(
            stateVariables["/numbersAsStringForceSymbolicSimplify"].stateValues
                .value.tree,
        ).eq(2);
        expect(
            stateVariables["/numbersAsStringForceSymbolicSimplify"].stateValues
                .isNumericOperator,
        ).eq(false);
        expect(
            stateVariables["/numbersAsStringForceSymbolicSimplify"].stateValues
                .isNumber,
        ).eq(true);
        expect(stateVariables["/numericAsString"].stateValues.value.tree).eqls([
            "apply",
            "mod",
            ["tuple", 17, ["/", 6, 2]],
        ]);
        expect(
            stateVariables["/numericAsString"].stateValues.isNumericOperator,
        ).eq(false);
        expect(stateVariables["/numericAsString"].stateValues.isNumber).eq(
            false,
        );
        expect(
            stateVariables["/numericAsStringSimplify"].stateValues.value.tree,
        ).eq(2);
        expect(
            stateVariables["/numericAsStringSimplify"].stateValues
                .isNumericOperator,
        ).eq(false);
        expect(
            stateVariables["/numericAsStringSimplify"].stateValues.isNumber,
        ).eq(true);
        expect(
            stateVariables["/numericAsStringForceNumeric"].stateValues.value
                .tree,
        ).eq(2);
        expect(
            stateVariables["/numericAsStringForceNumeric"].stateValues
                .isNumericOperator,
        ).eq(true);
        expect(
            stateVariables["/numericAsStringForceNumeric"].stateValues.isNumber,
        ).eq(true);
        expect(stateVariables["/numbersAsMacros"].stateValues.value.tree).eq(2);
        expect(
            stateVariables["/numbersAsMacros"].stateValues.isNumericOperator,
        ).eq(true);
        expect(stateVariables["/numbersAsMacros"].stateValues.isNumber).eq(
            true,
        );
        expect(
            stateVariables["/numbersAsMacrosForceSymbolic"].stateValues.value
                .tree,
        ).eqls(["apply", "mod", ["tuple", 17, 3]]);
        expect(
            stateVariables["/numbersAsMacrosForceSymbolic"].stateValues
                .isNumericOperator,
        ).eq(false);
        expect(
            stateVariables["/numbersAsMacrosForceSymbolic"].stateValues
                .isNumber,
        ).eq(false);
        expect(
            stateVariables["/numbersAsMacrosForceSymbolicSimplify"].stateValues
                .value.tree,
        ).eq(2);
        expect(
            stateVariables["/numbersAsMacrosForceSymbolicSimplify"].stateValues
                .isNumericOperator,
        ).eq(false);
        expect(
            stateVariables["/numbersAsMacrosForceSymbolicSimplify"].stateValues
                .isNumber,
        ).eq(true);
        expect(stateVariables["/numbersAsMacros2"].stateValues.value.tree).eq(
            2,
        );
        expect(
            stateVariables["/numbersAsMacros2"].stateValues.isNumericOperator,
        ).eq(true);
        expect(stateVariables["/numbersAsMacros2"].stateValues.isNumber).eq(
            true,
        );
        expect(
            stateVariables["/withNumberMathMacro"].stateValues.value.tree,
        ).eq(2);
        expect(
            stateVariables["/withNumberMathMacro"].stateValues
                .isNumericOperator,
        ).eq(true);
        expect(stateVariables["/withNumberMathMacro"].stateValues.isNumber).eq(
            true,
        );
        expect(
            stateVariables["/withNumberMathMacroForceSymbolic"].stateValues
                .value.tree,
        ).eqls(["apply", "mod", ["tuple", 17, 3]]);
        expect(
            stateVariables["/withNumberMathMacroForceSymbolic"].stateValues
                .isNumericOperator,
        ).eq(false);
        expect(
            stateVariables["/withNumberMathMacroForceSymbolic"].stateValues
                .isNumber,
        ).eq(false);
        expect(
            stateVariables["/withNumberMathMacroForceSymbolicSimplify"]
                .stateValues.value.tree,
        ).eq(2);
        expect(
            stateVariables["/withNumberMathMacroForceSymbolicSimplify"]
                .stateValues.isNumericOperator,
        ).eq(false);
        expect(
            stateVariables["/withNumberMathMacroForceSymbolicSimplify"]
                .stateValues.isNumber,
        ).eq(true);
        expect(
            stateVariables["/withNumericMathMacro"].stateValues.value.tree,
        ).eqls(["apply", "mod", ["tuple", 17, ["/", 6, 2]]]);
        expect(
            stateVariables["/withNumericMathMacro"].stateValues
                .isNumericOperator,
        ).eq(false);
        expect(stateVariables["/withNumericMathMacro"].stateValues.isNumber).eq(
            false,
        );
        expect(
            stateVariables["/withNumericMathMacroSimplify"].stateValues.value
                .tree,
        ).eq(2);
        expect(
            stateVariables["/withNumericMathMacroSimplify"].stateValues
                .isNumericOperator,
        ).eq(false);
        expect(
            stateVariables["/withNumericMathMacroSimplify"].stateValues
                .isNumber,
        ).eq(true);
        expect(
            stateVariables["/withNumericMathMacroForceNumeric"].stateValues
                .value.tree,
        ).eq(2);
        expect(
            stateVariables["/withNumericMathMacroForceNumeric"].stateValues
                .isNumericOperator,
        ).eq(true);
        expect(
            stateVariables["/withNumericMathMacroForceNumeric"].stateValues
                .isNumber,
        ).eq(true);
    });

    it("mod as math expression", async () => {
        let core = await createTestCore({
            doenetML: `
      <group name="nums" asList>
        <number name="a">17</number>
        <number name="b">3</number>
      </group>
      <math name="numberString">mod(17,3)</math>
      <math name="numberStringSimplify" simplify>mod(17,3)</math>
      <math name="numberComponentsCommas">
        mod(<number>17</number>,<number>3</number>)
      </math>
      <math name="numberComponentsCommasSimplify" simplify>
      mod(<number>17</number>,<number>3</number>)
      </math>
      <math name="macrosCommas">
        mod($a,$b)
      </math>
      <math name="macrosCommasSimplify" simplify>
        mod($a,$b)
      </math>
      <math name="group">
        mod($nums)
      </math>
      <math name="groupSimplify" simplify>
        mod($nums)
      </math>
      `,
        });

        let stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/numberString"].stateValues.value.tree).eqls([
            "apply",
            "mod",
            ["tuple", 17, 3],
        ]);
        expect(stateVariables["/numberString"].stateValues.isNumber).eq(false);
        expect(
            stateVariables["/numberStringSimplify"].stateValues.value.tree,
        ).eq(2);
        expect(stateVariables["/numberStringSimplify"].stateValues.isNumber).eq(
            true,
        );

        expect(
            stateVariables["/numberComponentsCommas"].stateValues.value.tree,
        ).eqls(["apply", "mod", ["tuple", 17, 3]]);
        expect(
            stateVariables["/numberComponentsCommas"].stateValues.isNumber,
        ).eq(false);
        expect(
            stateVariables["/numberComponentsCommasSimplify"].stateValues.value
                .tree,
        ).eq(2);
        expect(
            stateVariables["/numberComponentsCommasSimplify"].stateValues
                .isNumber,
        ).eq(true);

        expect(stateVariables["/macrosCommas"].stateValues.value.tree).eqls([
            "apply",
            "mod",
            ["tuple", 17, 3],
        ]);
        expect(stateVariables["/macrosCommas"].stateValues.isNumber).eq(false);
        expect(
            stateVariables["/macrosCommasSimplify"].stateValues.value.tree,
        ).eq(2);
        expect(stateVariables["/macrosCommasSimplify"].stateValues.isNumber).eq(
            true,
        );

        expect(stateVariables["/group"].stateValues.value.tree).eqls([
            "apply",
            "mod",
            ["tuple", 17, 3],
        ]);
        expect(stateVariables["/group"].stateValues.isNumber).eq(false);
        expect(stateVariables["/groupSimplify"].stateValues.value.tree).eq(2);
        expect(stateVariables["/groupSimplify"].stateValues.isNumber).eq(true);
    });

    it("gcd", async () => {
        let core = await createTestCore({
            doenetML: `
      <gcd name="gcd1"><number>135</number><number>81</number></gcd>
      <gcd name="gcd2">135 81 63</gcd>
      <gcd name="gcd3">x y z</gcd>
      `,
        });

        let stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/gcd1"].stateValues.value.tree).eq(27);
        expect(stateVariables["/gcd2"].stateValues.value.tree).eq(9);
        expect(stateVariables["/gcd3"].stateValues.value.tree).eqls([
            "apply",
            "gcd",
            ["tuple", "x", "y", "z"],
        ]);
    });

    it("lcm", async () => {
        let core = await createTestCore({
            doenetML: `
      <lcm name="lcm1"><number>135</number><number>81</number></lcm>
      <lcm name="lcm2">135 81 63</lcm>
      <lcm name="lcm3">x y z</lcm>
      `,
        });

        let stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/lcm1"].stateValues.value.tree).eq(405);
        expect(stateVariables["/lcm2"].stateValues.value.tree).eq(2835);
        expect(stateVariables["/lcm3"].stateValues.value.tree).eqls([
            "apply",
            "lcm",
            ["tuple", "x", "y", "z"],
        ]);
    });

    it("extract parts of math expression", async () => {
        let core = await createTestCore({
            doenetML: `
      <text>a</text>
      <p>original expression: <math name="expr" functionSymbols="f g">f(x)+g(y,z)+h(q)</math></p>
      <p>Operator: <extractMathOperator name="operator">$expr</extractMathOperator></p>
      <p>Number of operands: <extractMath type="numOperands" name="numOperands">$expr</extractMath></p>
      <p>First operand: <extractMath type="Operand" name="operand1" operandNumber="1">$expr</extractMath></p>
      <p>Second operand: <extractMath type="Operand" name="operand2" operandNumber="2">$expr</extractMath></p>
      <p>Third operand: <extractMath type="Operand" name="operand3" operandNumber="3">$expr</extractMath></p>
      <p>No fourth operand: <extractMath type="Operand" name="blank1" operandNumber="4">$expr</extractMath></p>
      <p>Function from first operand: <extractMath type="function" name="f">$operand1</extractMath></p>
      <p>Function from second operand: <extractMath type="function" name="g">$operand2</extractMath></p>
      <p>No function from third operand: <extractMath type="function" name="blank2">$operand3</extractMath></p>
      <p>Function argument from first operand: <extractMath type="functionArgument" name="farg1">$operand1</extractMath></p>
      <p>Function argument from first operand again: <extractMath type="functionArgument" argumentNumber="1" name="farg1a">$operand1</extractMath></p>
      <p>No second function argument from first operand: <extractMath type="functionArgument" argumentNumber="2" name="blank3">$operand1</extractMath></p>
      <p>All function arguments from second operand: <extractMath type="functionArgument" name="gargAll">$operand2</extractMath></p>
      <p>First function argument from second operand: <extractMath type="functionArgument" argumentNumber="1" name="garg1">$operand2</extractMath></p>
      <p>Second function argument from second operand: <extractMath type="functionArgument" argumentNumber="2" name="garg2">$operand2</extractMath></p>
      <p>No third function argument from second operand: <extractMath type="functionArgument" argumentNumber="3" name="blank4">$operand2</extractMath></p>
      <p>No function argument from third operand: <extractMath type="functionArgument" name="blank5">$operand3</extractMath></p>
      <p>Number of operands from first operand: <extractMath type="numOperands" name="numOperands1">$operand1</extractMath></p>
      <p>First operand from first operand: <extractMath type="operand" operandNumber="1" name="operand11">$operand1</extractMath></p>


      <p>Pick operand number: <mathinput name="nOperand" prefill="1" /></p>
      <p>Resulting operand: <extractMath type="operand" operandNumber="$nOperand" name="operandN">$expr</extractMath></p>
      <p>Function of resulting operand: <extractMath type="function" name="functionN">$operandN</extractMath></p>
      <p>Pick argument number: <mathinput name="nArgument" prefill="1" /></p>
      <p>Resulting argument: <extractMath type="functionArgument" argumentNumber="$nArgument" name="argumentN">$operandN</extractMath></p>
      `,
        });

        let stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/operator"].stateValues.value).eq("+");
        expect(stateVariables["/numOperands"].stateValues.value.tree).eq(3);
        expect(stateVariables["/operand1"].stateValues.value.tree).eqls([
            "apply",
            "f",
            "x",
        ]);
        expect(stateVariables["/operand2"].stateValues.value.tree).eqls([
            "apply",
            "g",
            ["tuple", "y", "z"],
        ]);
        expect(stateVariables["/operand3"].stateValues.value.tree).eqls([
            "*",
            "h",
            "q",
        ]);
        expect(stateVariables["/blank1"].stateValues.value.tree).eqls("＿");
        expect(stateVariables["/f"].stateValues.value.tree).eqls("f");
        expect(stateVariables["/g"].stateValues.value.tree).eqls("g");
        expect(stateVariables["/blank2"].stateValues.value.tree).eqls("＿");
        expect(stateVariables["/farg1"].stateValues.value.tree).eqls("x");
        expect(stateVariables["/farg1a"].stateValues.value.tree).eqls("x");
        expect(stateVariables["/blank3"].stateValues.value.tree).eqls("＿");
        expect(stateVariables["/gargAll"].stateValues.value.tree).eqls([
            "tuple",
            "y",
            "z",
        ]);
        expect(stateVariables["/garg1"].stateValues.value.tree).eqls("y");
        expect(stateVariables["/garg2"].stateValues.value.tree).eqls("z");
        expect(stateVariables["/blank4"].stateValues.value.tree).eqls("＿");
        expect(stateVariables["/blank5"].stateValues.value.tree).eqls("＿");
        expect(stateVariables["/numOperands1"].stateValues.value.tree).eq(1);
        expect(stateVariables["/operand11"].stateValues.value.tree).eqls([
            "apply",
            "f",
            "x",
        ]);

        expect(stateVariables["/operandN"].stateValues.value.tree).eqls([
            "apply",
            "f",
            "x",
        ]);
        expect(stateVariables["/functionN"].stateValues.value.tree).eqls("f");
        expect(stateVariables["/argumentN"].stateValues.value.tree).eqls("x");

        await updateMathInputValue({
            latex: "2",
            name: "/nArgument",
            core,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/argumentN"].stateValues.value.tree).eqls("＿");

        await updateMathInputValue({
            latex: "2",
            name: "/nOperand",
            core,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/operandN"].stateValues.value.tree).eqls([
            "apply",
            "g",
            ["tuple", "y", "z"],
        ]);
        expect(stateVariables["/functionN"].stateValues.value.tree).eqls("g");
        expect(stateVariables["/argumentN"].stateValues.value.tree).eqls("z");

        await updateMathInputValue({
            latex: "3",
            name: "/nArgument",
            core,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/argumentN"].stateValues.value.tree).eqls("＿");

        await updateMathInputValue({
            latex: "1",
            name: "/nArgument",
            core,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/argumentN"].stateValues.value.tree).eqls("y");

        await updateMathInputValue({
            latex: "3",
            name: "/nOperand",
            core,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/operandN"].stateValues.value.tree).eqls([
            "*",
            "h",
            "q",
        ]);
        expect(stateVariables["/functionN"].stateValues.value.tree).eqls("＿");
        expect(stateVariables["/argumentN"].stateValues.value.tree).eqls("＿");

        await updateMathInputValue({
            latex: "4",
            name: "/nOperand",
            core,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/operandN"].stateValues.value.tree).eqls("＿");
        expect(stateVariables["/functionN"].stateValues.value.tree).eqls("＿");
        expect(stateVariables["/argumentN"].stateValues.value.tree).eqls("＿");
    });

    it("warning with operand", async () => {
        let core = await createTestCore({
            doenetML: `
      <p>original expression: <math name="expr">x+y</math></p>
      <p>Bad operand: <extractMath type="Operand" name="operand1">$expr</extractMath></p>
      `,
        });

        let errorWarnings = core.errorWarnings;

        expect(errorWarnings.errors.length).eq(0);
        expect(errorWarnings.warnings.length).eq(1);

        expect(errorWarnings.warnings[0].message).contain(
            `Must specify a operandNumber when extracting a math operand`,
        );
        expect(errorWarnings.warnings[0].level).eq(1);
        expect(errorWarnings.warnings[0].doenetMLrange.lineBegin).eq(3);
        expect(errorWarnings.warnings[0].doenetMLrange.charBegin).eq(23);
        expect(errorWarnings.warnings[0].doenetMLrange.lineEnd).eq(3);
        expect(errorWarnings.warnings[0].doenetMLrange.charEnd).eq(85);
    });

    it("math operators that take multiple inputs ignore composites with no replacements", async () => {
        let core = await createTestCore({
            doenetML: `
      <function name="f" domain="[0,2]" simplify>(x+1)(x-2)(x-4)</function>
      <p>Min on [0,2]: <min name="min02">$$f(0) $(f.minimumValues) $$f(2)</min>.</p>
      <p>Abs treats as product of three factors: <abs name="abs">$$f(0) $(f.minimumValues) $$f(2)</abs>.</p>
      `,
        });

        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/min02"].stateValues.value.tree).eq(0);
        expect(stateVariables["/abs"].stateValues.value.tree).eqls([
            "apply",
            "abs",
            ["*", 8, "＿", 0],
        ]);
    });
});
