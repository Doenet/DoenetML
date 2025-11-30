import { describe, expect, it, vi } from "vitest";
import { createTestCore, ResolvePathToNodeIdx } from "../utils/test-core";
import { movePoint, updateMathInputValue } from "../utils/actions";
import me from "math-expressions";
import { PublicDoenetMLCore } from "../../CoreWorker";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

describe("Function Operator tag tests", async () => {
    async function test_function_operator({
        symbolic,
        f1Markup,
        f2Markup,
        fop1,
        fop2,
        label1,
        label2,
    }: {
        symbolic: boolean;
        f1Markup: string;
        f2Markup: string;
        fop1: (arg0: number) => number;
        fop2: (arg0: number) => number;
        label1?: string;
        label2?: string;
    }) {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <function name="f" symbolic="${symbolic}">x^3</function>
    ${f1Markup}
    ${f2Markup}

    <setup><sequence name="s" step="0.4" from="-2" to="2" /></setup>
    <p><repeat for="$s" valueName="x" name="repeat1">
      <evaluate function="$f1" input="$x" />
    </repeat></p>
    <p><repeat for="$s" valueName="x" name="repeat2">
      $$f2($x)
    </repeat></p>
    <p><repeat extend="$repeat1" name="repeat1a" /></p>
    <p><repeat extend="$repeat2" name="repeat2a" /></p>
    `,
        });

        let f = (x) => x ** 3;
        let f1 = (x) => fop1(f(x));
        let f2 = (x) => fop2(f(x));

        // -2, -1.6, -1.2, ..., 2
        let xs = [...Array(11).keys()].map((v) => 0.4 * (v - 5));

        const stateVariables = await core.returnAllStateVariables(false, true);
        let map1Names: string[] = stateVariables[
            await resolvePathToNodeIdx("repeat1")
        ].replacements!.map(
            (template) =>
                stateVariables[template.componentIdx].replacements![0]
                    .componentIdx,
        );
        let map2Names: string[] = stateVariables[
            await resolvePathToNodeIdx("repeat2")
        ].replacements!.map(
            (template) =>
                stateVariables[template.componentIdx].replacements![0]
                    .componentIdx,
        );
        let map1aNames: string[] = stateVariables[
            await resolvePathToNodeIdx("repeat1a")
        ].replacements!.map(
            (template) =>
                stateVariables[template.componentIdx].replacements![0]
                    .componentIdx,
        );
        let map2aNames: string[] = stateVariables[
            await resolvePathToNodeIdx("repeat2a")
        ].replacements!.map(
            (template) =>
                stateVariables[template.componentIdx].replacements![0]
                    .componentIdx,
        );

        let f1d =
            stateVariables[await resolvePathToNodeIdx("f1")].stateValues
                .numericalfs[0];
        let f2d =
            stateVariables[await resolvePathToNodeIdx("f2")].stateValues
                .numericalfs[0];

        for (let [i, x] of xs.entries()) {
            expect(stateVariables[map1Names[i]].stateValues.value.tree).closeTo(
                f1(x),
                1e-10,
            );
            expect(stateVariables[map2Names[i]].stateValues.value.tree).closeTo(
                f2(x),
                1e-10,
            );
            expect(
                stateVariables[map1aNames[i]].stateValues.value.tree,
            ).closeTo(f1(x), 1e-10);
            expect(
                stateVariables[map2aNames[i]].stateValues.value.tree,
            ).closeTo(f2(x), 1e-10);

            expect(f1d(x)).closeTo(f1(x), 1e-10);
            expect(f2d(x)).closeTo(f2(x), 1e-10);
        }

        if (label1 !== undefined) {
            expect(
                stateVariables[await resolvePathToNodeIdx("f1")].stateValues
                    .label,
            ).eq(label1);
        }
        if (label2 !== undefined) {
            expect(
                stateVariables[await resolvePathToNodeIdx("f2")].stateValues
                    .label,
            ).eq(label2);
        }
    }

    it("clamp function", async () => {
        await test_function_operator({
            symbolic: true,
            f1Markup: `<clampFunction name="f1">$f</clampFunction>`,
            f2Markup: `<clampFunction name="f2" lowerValue="-3" upperValue="5">$f</clampFunction>`,
            fop1: (x) => Math.min(1, Math.max(0, x)),
            fop2: (x) => Math.min(5, Math.max(-3, x)),
        });
    });

    it("clamp function, numeric, labeled", async () => {
        await test_function_operator({
            symbolic: false,
            f1Markup: `<clampFunction name="f1">$f<label>clamp 1</label></clampFunction>`,
            f2Markup: `<clampFunction name="f2" lowerValue="-3" upperValue="5">$f<label>clamp 2</label></clampFunction>`,
            fop1: (x) => Math.min(1, Math.max(0, x)),
            fop2: (x) => Math.min(5, Math.max(-3, x)),
            label1: "clamp 1",
            label2: "clamp 2",
        });
    });

    it("wrap function", async () => {
        // Note: added domain [-2,2] to reduce time spent calculating all the extrema
        // when calling returnAllStateVariables()
        await test_function_operator({
            symbolic: true,
            f1Markup: `<wrapFunctionPeriodic name="f1" domain="[-2,2]">$f</wrapFunctionPeriodic>`,
            f2Markup: `<wrapFunctionPeriodic name="f2" lowerValue="-2" upperValue="3" domain="[-2,2]">$f</wrapFunctionPeriodic>`,
            fop1: (x) => me.math.mod(x, 1),
            fop2: (x) => -2 + me.math.mod(x + 2, 5),
        });
    });

    it("wrap function, numeric", async () => {
        // Note: added domain [-2,2] to reduce time spent calculating all the extrema
        // when calling returnAllStateVariables()
        await test_function_operator({
            symbolic: false,
            f1Markup: `<wrapFunctionPeriodic name="f1" domain="[-2,2]">$f</wrapFunctionPeriodic>`,
            f2Markup: `<wrapFunctionPeriodic name="f2" lowerValue="-2" upperValue="3" domain="[-2,2]">$f</wrapFunctionPeriodic>`,
            fop1: (x) => me.math.mod(x, 1),
            fop2: (x) => -2 + me.math.mod(x + 2, 5),
        });
    });

    it("derivative", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p><m>a =</m> <mathInput name="a" prefill="1" /></p>
    <p><m>b =</m> <mathInput name="b" prefill="1" /></p>
    <p><m>c =</m> <mathInput name="c" prefill="1" /></p>
    <p><m>x =</m> <mathInput name="x" prefill="x" /></p>

    <math hide name="formula" simplify>
        $a sin($b$x + $c)
    </math>

    <p name="pf"><m>f($x) =
    <function name="f" variable="$x">$formula</function>
    </m></p>

    <p name="pfp"><m>f'($x) =
    <derivative name="fp">$f</derivative>
    </m></p>

    <graph>
      $f
      $g
      <point name="P1" x="3" y="4">
          <constrainTo>$f</constrainTo>
      </point>
      <point name="P2" x="3" y="4">
          <constrainTo>$fp</constrainTo>
      </point>
    </graph>

    `,
        });

        async function check_items({
            a,
            b,
            c,
            x,
            x1,
            x2,
        }: {
            a: string;
            b: string;
            c: string;
            x: string;
            x1: number;
            x2: number;
        }) {
            // @ts-ignore
            let f = me.fromText(`${a} sin(${b} ${x} + ${c})`).simplify();
            // @ts-ignore
            let fp = me.fromText(`${a} ${b} cos(${b} ${x} + ${c})`).simplify();
            let fString = f.toString();
            let fpString = fp.toString();

            let fFun0 = f.f();
            let fFunExpect = (z) => fFun0({ [x]: z });
            let fpFun0 = fp.f();
            let fpFunExpect = (z) => fpFun0({ [x]: z });

            let y1 = fFunExpect(x1);
            let y2 = fpFunExpect(x2);

            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(
                stateVariables[await resolvePathToNodeIdx("pf")].stateValues
                    .text,
            ).eq(`f(${x}) = ${fString}`);
            expect(
                stateVariables[await resolvePathToNodeIdx("pfp")].stateValues
                    .text,
            ).eq(`f'(${x}) = ${fpString}`);

            expect(
                stateVariables[
                    await resolvePathToNodeIdx("f")
                ].stateValues.formula.toString(),
            ).eq(fString);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("fp")
                ].stateValues.formula.toString(),
            ).eq(fpString);

            expect(
                stateVariables[await resolvePathToNodeIdx("P1")].stateValues
                    .xs[0].tree,
            ).closeTo(x1, 1e-12);
            expect(
                stateVariables[await resolvePathToNodeIdx("P1")].stateValues
                    .xs[1].tree,
            ).closeTo(y1, 1e-12);
            expect(
                stateVariables[await resolvePathToNodeIdx("P2")].stateValues
                    .xs[0].tree,
            ).closeTo(x2, 1e-12);
            expect(
                stateVariables[await resolvePathToNodeIdx("P2")].stateValues
                    .xs[1].tree,
            ).closeTo(y2, 1e-12);

            let fFun =
                stateVariables[await resolvePathToNodeIdx("f")].stateValues
                    .numericalfs[0];
            let fpFun =
                stateVariables[await resolvePathToNodeIdx("fp")].stateValues
                    .numericalfs[0];

            for (let i = 1; i <= 21; i++) {
                let x = 0.2 * (i - 11);
                expect(fFun(x)).closeTo(fFunExpect(x), 1e-10);
                expect(fpFun(x)).closeTo(fpFunExpect(x), 1e-10);
            }
        }

        let a = "1",
            b = "1",
            c = "1",
            x = "x",
            x1 = 3,
            x2 = 3;

        await check_items({ a, b, c, x, x1, x2 });

        x1 = -3;
        x2 = 5;

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P1"),
            x: x1,
            y: 11,
            core,
        });
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P2"),
            x: x2,
            y: -9,
            core,
        });

        await check_items({ a, b, c, x, x1, x2 });

        a = "2";
        b = "pi";
        c = "e";
        x = "q";

        await updateMathInputValue({
            latex: a,
            componentIdx: await resolvePathToNodeIdx("a"),
            core,
        });
        await updateMathInputValue({
            latex: "\\pi",
            componentIdx: await resolvePathToNodeIdx("b"),
            core,
        });
        await updateMathInputValue({
            latex: c,
            componentIdx: await resolvePathToNodeIdx("c"),
            core,
        });
        await updateMathInputValue({
            latex: x,
            componentIdx: await resolvePathToNodeIdx("x"),
            core,
        });

        await check_items({ a, b, c, x, x1, x2 });

        x1 = 9;
        x2 = -7;

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P1"),
            x: x1,
            y: -6,
            core,
        });
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P2"),
            x: x2,
            y: 0,
            core,
        });

        await check_items({ a, b, c, x, x1, x2 });
    });

    async function check_list(
        core: PublicDoenetMLCore,
        resolvePathToNodeIdx: ResolvePathToNodeIdx,
    ) {
        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d1")
            ].stateValues.formula.equals(me.fromText("2x")),
        ).eq(true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d2")
            ].stateValues.formula.equals(me.fromText("2x")),
        ).eq(true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d2b")
            ].stateValues.formula.equals(me.fromText("2x")),
        ).eq(true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d2c")
            ].stateValues.formula.equals(me.fromText("2x")),
        ).eq(true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d3")
            ].stateValues.formula.equals(me.fromText("2x sin(z)")),
        ).eq(true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d4")
            ].stateValues.formula.equals(me.fromText("x^2cos(z)")),
        ).eq(true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d4b")
            ].stateValues.formula.equals(me.fromText("x^2cos(z)")),
        ).eq(true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d5")
            ].stateValues.formula.equals(me.fromText("cos(x)")),
        ).eq(true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d5b")
            ].stateValues.formula.equals(me.fromText("cos(x)")),
        ).eq(true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d6")
            ].stateValues.formula.equals(me.fromText("2e^(2y)")),
        ).eq(true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d6b")
            ].stateValues.formula.equals(me.fromText("2e^(2y)")),
        ).eq(true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d7")
            ].stateValues.formula.equals(me.fromText("yz")),
        ).eq(true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d7b")
            ].stateValues.formula.equals(me.fromText("yz")),
        ).eq(true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d8")
            ].stateValues.formula.equals(me.fromText("xy")),
        ).eq(true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d8b")
            ].stateValues.formula.equals(me.fromText("xy")),
        ).eq(true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d9")
            ].stateValues.formula.equals(me.fromText("0")),
        ).eq(true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d10")
            ].stateValues.formula.equals(me.fromText("0")),
        ).eq(true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d11")
            ].stateValues.formula.equals(me.fromText("0")),
        ).eq(true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d12")
            ].stateValues.formula.equals(me.fromText("0")),
        ).eq(true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d13")
            ].stateValues.formula.equals(me.fromText("xz")),
        ).eq(true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d14")
            ].stateValues.formula.equals(me.fromText("xz")),
        ).eq(true);

        const d1 =
            stateVariables[await resolvePathToNodeIdx("d1")].stateValues
                .numericalfs[0];
        const d2 =
            stateVariables[await resolvePathToNodeIdx("d2")].stateValues
                .numericalfs[0];
        const d2b =
            stateVariables[await resolvePathToNodeIdx("d2b")].stateValues
                .numericalfs[0];
        const d2c =
            stateVariables[await resolvePathToNodeIdx("d2c")].stateValues
                .numericalfs[0];
        const d5 =
            stateVariables[await resolvePathToNodeIdx("d5")].stateValues
                .numericalfs[0];
        const d5b =
            stateVariables[await resolvePathToNodeIdx("d5b")].stateValues
                .numericalfs[0];
        const d6 =
            stateVariables[await resolvePathToNodeIdx("d6")].stateValues
                .numericalfs[0];
        const d6b =
            stateVariables[await resolvePathToNodeIdx("d6b")].stateValues
                .numericalfs[0];
        const d9 =
            stateVariables[await resolvePathToNodeIdx("d9")].stateValues
                .numericalfs[0];
        const d10 =
            stateVariables[await resolvePathToNodeIdx("d10")].stateValues
                .numericalfs[0];
        const d11 =
            stateVariables[await resolvePathToNodeIdx("d11")].stateValues
                .numericalfs[0];
        const d12 =
            stateVariables[await resolvePathToNodeIdx("d12")].stateValues
                .numericalfs[0];

        for (let i = 1; i <= 21; i++) {
            let x = 0.2 * (i - 11);
            expect(d1(x)).closeTo(2 * x, 1e-10);
            expect(d2(x)).closeTo(2 * x, 1e-10);
            expect(d2b(x)).closeTo(2 * x, 1e-10);
            expect(d2c(x)).closeTo(2 * x, 1e-10);
            expect(d5(x)).closeTo(Math.cos(x), 1e-10);
            expect(d5b(x)).closeTo(Math.cos(x), 1e-10);
            expect(d6(x)).closeTo(2 * Math.exp(2 * x), 1e-10);
            expect(d6b(x)).closeTo(2 * Math.exp(2 * x), 1e-10);
            expect(d9(x)).closeTo(0, 1e-10);
            expect(d10(x)).closeTo(0, 1e-10);
            expect(d11(x)).closeTo(0, 1e-10);
            expect(d12(x)).closeTo(0, 1e-10);
        }
    }

    it("derivative 2", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
      <function name="f1">sin(x)</function>
      <function name="f2" variables="y">e^(2y)</function>
      <function name="f3">xyz</function>
      <function name="f4" variable="z">xyz</function>
      <derivative name="d1"><function>x^2</function></derivative>
      <derivative name="d2"><math name="x2">x^2</math></derivative>
      <derivative name="d2b">$x2</derivative>
      <derivative name="d2c">$x2</derivative>
      <derivative name="d3"><function>x^2sin(z)</function></derivative>
      <derivative name="d4" variables="z">x^2sin(z)</derivative>
      <math name='var'>z</math><number name="a">2</number>
      <derivative name="d4b" variable="$var">x^$a sin($var)</derivative>
      <derivative name="d5">$f1</derivative>
      <derivative name="d5b">$f1</derivative>
      <derivative name="d6">$f2</derivative>
      <derivative name="d6b">$f2</derivative>
      <derivative name="d7">$f3</derivative>
      <derivative name="d7b">$f3</derivative>
      <derivative name="d8">$f4</derivative>
      <derivative name="d8b">$f4</derivative>
      <derivative variables="q" name="d9">$f1</derivative>
      <derivative variable="q" name="d10">$f2</derivative>
      <derivative variables="q" name="d11">$f3</derivative>
      <derivative variable="q" name="d12">$f4</derivative>
      <derivative variables="y" name="d13">$f3</derivative>
      <derivative variable="y" name="d14">$f4</derivative>
      `,
        });

        await check_list(core, resolvePathToNodeIdx);
    });

    it("derivative 2, labeled", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
      <function name="f1">sin(x)</function>
      <function name="f2" variable="y">e^(2y)</function>
      <function name="f3">xyz</function>
      <function name="f4" variables="z">xyz</function>
      <derivative name="d1"><function>x^2</function><label>d1</label></derivative>
      <derivative name="d2"><label>d2</label><math name="x2">x^2</math></derivative>
      <derivative name="d2b">$x2<label>d2b</label></derivative>
      <derivative name="d2c"><label>d2c</label>$x2</derivative>
      <derivative name="d3"><function>x^2sin(z)</function><label>d3</label></derivative>
      <derivative name="d4" variable="z"><label>d4</label>x^2sin(z)</derivative>
      <math name='var'>z</math><number name="a">2</number>
      <derivative name="d4b" variables="$var">x^$a sin($var)<label>d4b</label></derivative>
      <derivative name="d5"><label>d5</label>$f1</derivative>
      <derivative name="d5b">$f1<label>d5b</label></derivative>
      <derivative name="d6">$f2<label>d6</label></derivative>
      <derivative name="d6b"><label>d6b</label>$f2</derivative>
      <derivative name="d7">$f3<label>d7</label></derivative>
      <derivative name="d7b"><label>d7b</label>$f3</derivative>
      <derivative name="d8"><label>d8</label>$f4</derivative>
      <derivative name="d8b">$f4<label>d8b</label></derivative>
      <derivative variable="q" name="d9"><label>d9</label>$f1</derivative>
      <derivative variables="q" name="d10">$f2<label>d10</label></derivative>
      <derivative variable="q" name="d11"><label>d11</label>$f3</derivative>
      <derivative variables="q" name="d12">$f4<label>d12</label></derivative>
      <derivative variable="y" name="d13"><label>d13</label>$f3</derivative>
      <derivative variables="y" name="d14">$f4<label>d14</label></derivative>
      `,
        });

        await check_list(core, resolvePathToNodeIdx);

        const stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("d1")].stateValues.label,
        ).eq("d1");
        expect(
            stateVariables[await resolvePathToNodeIdx("d2")].stateValues.label,
        ).eq("d2");
        expect(
            stateVariables[await resolvePathToNodeIdx("d2b")].stateValues.label,
        ).eq("d2b");
        expect(
            stateVariables[await resolvePathToNodeIdx("d2c")].stateValues.label,
        ).eq("d2c");
        expect(
            stateVariables[await resolvePathToNodeIdx("d3")].stateValues.label,
        ).eq("d3");
        expect(
            stateVariables[await resolvePathToNodeIdx("d4")].stateValues.label,
        ).eq("d4");
        expect(
            stateVariables[await resolvePathToNodeIdx("d4b")].stateValues.label,
        ).eq("d4b");
        expect(
            stateVariables[await resolvePathToNodeIdx("d5")].stateValues.label,
        ).eq("d5");
        expect(
            stateVariables[await resolvePathToNodeIdx("d5b")].stateValues.label,
        ).eq("d5b");
        expect(
            stateVariables[await resolvePathToNodeIdx("d6")].stateValues.label,
        ).eq("d6");
        expect(
            stateVariables[await resolvePathToNodeIdx("d6b")].stateValues.label,
        ).eq("d6b");
        expect(
            stateVariables[await resolvePathToNodeIdx("d7")].stateValues.label,
        ).eq("d7");
        expect(
            stateVariables[await resolvePathToNodeIdx("d7b")].stateValues.label,
        ).eq("d7b");
        expect(
            stateVariables[await resolvePathToNodeIdx("d8")].stateValues.label,
        ).eq("d8");
        expect(
            stateVariables[await resolvePathToNodeIdx("d8b")].stateValues.label,
        ).eq("d8b");
        expect(
            stateVariables[await resolvePathToNodeIdx("d9")].stateValues.label,
        ).eq("d9");
        expect(
            stateVariables[await resolvePathToNodeIdx("d10")].stateValues.label,
        ).eq("d10");
        expect(
            stateVariables[await resolvePathToNodeIdx("d11")].stateValues.label,
        ).eq("d11");
        expect(
            stateVariables[await resolvePathToNodeIdx("d12")].stateValues.label,
        ).eq("d12");
        expect(
            stateVariables[await resolvePathToNodeIdx("d13")].stateValues.label,
        ).eq("d13");
        expect(
            stateVariables[await resolvePathToNodeIdx("d14")].stateValues.label,
        ).eq("d14");
    });

    it("derivative of trig functions raised to powers", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <function name="f1">sin(x)^2</function>
    <function name="f1a">sin^2(x)</function>
    <function name="f2">tan(x)^3</function>
    <function name="f2a">tan^3(x)</function>
    <derivative name="d1">$f1</derivative>
    <derivative name="d1a">$f1a</derivative>
    <derivative name="d2">$f2</derivative>
    <derivative name="d2a">$f2a</derivative>
    `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d1")
            ].stateValues.formula.equals(me.fromText("2 sin(x) cos(x)")),
        ).be.true;
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d1a")
            ].stateValues.formula.equals(me.fromText("2 sin(x) cos(x)")),
        ).be.true;
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d2")
            ].stateValues.formula.equals(me.fromText("3 tan^2(x) sec^2(x)")),
        ).be.true;
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d2a")
            ].stateValues.formula.equals(me.fromText("3 tan^2(x) sec^2(x)")),
        ).be.true;
    });

    it("specifying derivative variables of a function", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
      <p><function name="f1" numInputs="3">sin(x+y^2)z</function>
      <function name="f2" variables="z y x">sin(x+y^2)z</function>
      <function name="f3" variables="x y">sin(x+y^2)z</function>
      <function name="f4" variables="x_1 x_2 x_3">sin(x_1+x_2^2)x_3</function></p>

      <p><derivative name="d11">$f1</derivative>
      <derivative name="d12" variable="z">$f1</derivative>
      <derivative name="d13" derivVariables="x">$f1</derivative>
      <derivative name="d14" derivVariable="z">$f1</derivative>
      <derivative name="d15" derivVariables="y z">$f1</derivative>
      <derivative name="d16" derivVariables="x x y">$f1</derivative>
      <derivative name="d17" derivVariable="u">$f1</derivative>
      <derivative name="d18" derivVariables="x x y" variables="z">$f1</derivative></p>

      <p><derivative name="d21">$f2</derivative>
      <derivative name="d22" variables="x">$f2</derivative>
      <derivative name="d23" derivVariable="x">$f2</derivative>
      <derivative name="d24" derivVariables="z">$f2</derivative>
      <derivative name="d25" derivVariables="y z">$f2</derivative>
      <derivative name="d26" derivVariables="x x y">$f2</derivative>
      <derivative name="d27" derivVariables="u">$f2</derivative>
      <derivative name="d28" derivVariables="x x y" variables="z">$f2</derivative></p>

      <p><derivative name="d31">$f3</derivative>
      <derivative name="d32" variables="z">$f3</derivative>
      <derivative name="d33" derivVariables="x">$f3</derivative>
      <derivative name="d34" derivVariable="z">$f3</derivative>
      <derivative name="d35" derivVariables="y z">$f3</derivative>
      <derivative name="d36" derivVariables="x x y">$f3</derivative>
      <derivative name="d37" derivVariable="u">$f3</derivative>
      <derivative name="d38" derivVariables="x x y" variables="z">$f3</derivative></p>

      <p><derivative name="d41">$f4</derivative>
      <derivative name="d42" derivVariables="x_1 x_2 x_3">$f4</derivative>
      <derivative name="d43" derivVariable="x">$f4</derivative>
      <derivative name="d44" derivVariables="x_1 x_2 x_3" variables="x_3 x_2 x_1">$f4</derivative></p>

      `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[
                await resolvePathToNodeIdx("d11")
            ].stateValues.formula.equals(me.fromText("cos(x+y^2)z")),
        ).eq(true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d11")
            ].stateValues.variables.map((x) => x.tree),
        ).eqls(["x", "y", "z"]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d11")
            ].stateValues.derivVariables.map((x) => x.tree),
        ).eqls(["x"]);

        expect(
            stateVariables[
                await resolvePathToNodeIdx("d12")
            ].stateValues.formula.equals(me.fromText("sin(x+y^2)")),
        ).eq(true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d12")
            ].stateValues.variables.map((x) => x.tree),
        ).eqls(["z"]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d12")
            ].stateValues.derivVariables.map((x) => x.tree),
        ).eqls(["z"]);

        expect(
            stateVariables[
                await resolvePathToNodeIdx("d13")
            ].stateValues.formula.equals(me.fromText("cos(x+y^2)z")),
        ).eq(true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d13")
            ].stateValues.variables.map((x) => x.tree),
        ).eqls(["x", "y", "z"]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d13")
            ].stateValues.derivVariables.map((x) => x.tree),
        ).eqls(["x"]);

        expect(
            stateVariables[
                await resolvePathToNodeIdx("d14")
            ].stateValues.formula.equals(me.fromText("sin(x+y^2)")),
        ).eq(true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d14")
            ].stateValues.variables.map((x) => x.tree),
        ).eqls(["x", "y", "z"]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d14")
            ].stateValues.derivVariables.map((x) => x.tree),
        ).eqls(["z"]);

        expect(
            stateVariables[
                await resolvePathToNodeIdx("d15")
            ].stateValues.formula.equals(me.fromText("2 y cos(x+y^2)")),
        ).eq(true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d15")
            ].stateValues.variables.map((x) => x.tree),
        ).eqls(["x", "y", "z"]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d15")
            ].stateValues.derivVariables.map((x) => x.tree),
        ).eqls(["y", "z"]);

        expect(
            stateVariables[
                await resolvePathToNodeIdx("d16")
            ].stateValues.formula.equals(me.fromText("-2 y cos(x+y^2)z")),
        ).eq(true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d16")
            ].stateValues.variables.map((x) => x.tree),
        ).eqls(["x", "y", "z"]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d16")
            ].stateValues.derivVariables.map((x) => x.tree),
        ).eqls(["x", "x", "y"]);

        expect(
            stateVariables[
                await resolvePathToNodeIdx("d17")
            ].stateValues.formula.equals(me.fromText("0")),
        ).eq(true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d17")
            ].stateValues.variables.map((x) => x.tree),
        ).eqls(["x", "y", "z"]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d17")
            ].stateValues.derivVariables.map((x) => x.tree),
        ).eqls(["u"]);

        expect(
            stateVariables[
                await resolvePathToNodeIdx("d18")
            ].stateValues.formula.equals(me.fromText("-2 y cos(x+y^2)z")),
        ).eq(true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d18")
            ].stateValues.variables.map((x) => x.tree),
        ).eqls(["z"]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d18")
            ].stateValues.derivVariables.map((x) => x.tree),
        ).eqls(["x", "x", "y"]);

        expect(
            stateVariables[
                await resolvePathToNodeIdx("d21")
            ].stateValues.formula.equals(me.fromText("sin(x+y^2)")),
        ).eq(true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d21")
            ].stateValues.variables.map((x) => x.tree),
        ).eqls(["z", "y", "x"]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d21")
            ].stateValues.derivVariables.map((x) => x.tree),
        ).eqls(["z"]);

        expect(
            stateVariables[
                await resolvePathToNodeIdx("d22")
            ].stateValues.formula.equals(me.fromText("cos(x+y^2)z")),
        ).eq(true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d22")
            ].stateValues.variables.map((x) => x.tree),
        ).eqls(["x"]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d22")
            ].stateValues.derivVariables.map((x) => x.tree),
        ).eqls(["x"]);

        expect(
            stateVariables[
                await resolvePathToNodeIdx("d23")
            ].stateValues.formula.equals(me.fromText("cos(x+y^2)z")),
        ).eq(true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d23")
            ].stateValues.variables.map((x) => x.tree),
        ).eqls(["z", "y", "x"]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d23")
            ].stateValues.derivVariables.map((x) => x.tree),
        ).eqls(["x"]);

        expect(
            stateVariables[
                await resolvePathToNodeIdx("d24")
            ].stateValues.formula.equals(me.fromText("sin(x+y^2)")),
        ).eq(true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d24")
            ].stateValues.variables.map((x) => x.tree),
        ).eqls(["z", "y", "x"]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d24")
            ].stateValues.derivVariables.map((x) => x.tree),
        ).eqls(["z"]);

        expect(
            stateVariables[
                await resolvePathToNodeIdx("d25")
            ].stateValues.formula.equals(me.fromText("2 y cos(x+y^2)")),
        ).eq(true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d25")
            ].stateValues.variables.map((x) => x.tree),
        ).eqls(["z", "y", "x"]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d25")
            ].stateValues.derivVariables.map((x) => x.tree),
        ).eqls(["y", "z"]);

        expect(
            stateVariables[
                await resolvePathToNodeIdx("d26")
            ].stateValues.formula.equals(me.fromText("-2 y cos(x+y^2)z")),
        ).eq(true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d26")
            ].stateValues.variables.map((x) => x.tree),
        ).eqls(["z", "y", "x"]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d26")
            ].stateValues.derivVariables.map((x) => x.tree),
        ).eqls(["x", "x", "y"]);

        expect(
            stateVariables[
                await resolvePathToNodeIdx("d27")
            ].stateValues.formula.equals(me.fromText("0")),
        ).eq(true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d27")
            ].stateValues.variables.map((x) => x.tree),
        ).eqls(["z", "y", "x"]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d27")
            ].stateValues.derivVariables.map((x) => x.tree),
        ).eqls(["u"]);

        expect(
            stateVariables[
                await resolvePathToNodeIdx("d28")
            ].stateValues.formula.equals(me.fromText("-2 y cos(x+y^2)z")),
        ).eq(true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d28")
            ].stateValues.variables.map((x) => x.tree),
        ).eqls(["z"]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d28")
            ].stateValues.derivVariables.map((x) => x.tree),
        ).eqls(["x", "x", "y"]);

        expect(
            stateVariables[
                await resolvePathToNodeIdx("d31")
            ].stateValues.formula.equals(me.fromText("cos(x+y^2)z")),
        ).eq(true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d31")
            ].stateValues.variables.map((x) => x.tree),
        ).eqls(["x", "y"]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d31")
            ].stateValues.derivVariables.map((x) => x.tree),
        ).eqls(["x"]);

        expect(
            stateVariables[
                await resolvePathToNodeIdx("d32")
            ].stateValues.formula.equals(me.fromText("sin(x+y^2)")),
        ).eq(true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d32")
            ].stateValues.variables.map((x) => x.tree),
        ).eqls(["z"]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d32")
            ].stateValues.derivVariables.map((x) => x.tree),
        ).eqls(["z"]);

        expect(
            stateVariables[
                await resolvePathToNodeIdx("d33")
            ].stateValues.formula.equals(me.fromText("cos(x+y^2)z")),
        ).eq(true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d33")
            ].stateValues.variables.map((x) => x.tree),
        ).eqls(["x", "y"]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d33")
            ].stateValues.derivVariables.map((x) => x.tree),
        ).eqls(["x"]);

        expect(
            stateVariables[
                await resolvePathToNodeIdx("d34")
            ].stateValues.formula.equals(me.fromText("sin(x+y^2)")),
        ).eq(true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d34")
            ].stateValues.variables.map((x) => x.tree),
        ).eqls(["x", "y"]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d34")
            ].stateValues.derivVariables.map((x) => x.tree),
        ).eqls(["z"]);

        expect(
            stateVariables[
                await resolvePathToNodeIdx("d35")
            ].stateValues.formula.equals(me.fromText("2 y cos(x+y^2)")),
        ).eq(true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d35")
            ].stateValues.variables.map((x) => x.tree),
        ).eqls(["x", "y"]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d35")
            ].stateValues.derivVariables.map((x) => x.tree),
        ).eqls(["y", "z"]);

        expect(
            stateVariables[
                await resolvePathToNodeIdx("d36")
            ].stateValues.formula.equals(me.fromText("-2 y cos(x+y^2)z")),
        ).eq(true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d36")
            ].stateValues.variables.map((x) => x.tree),
        ).eqls(["x", "y"]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d36")
            ].stateValues.derivVariables.map((x) => x.tree),
        ).eqls(["x", "x", "y"]);

        expect(
            stateVariables[
                await resolvePathToNodeIdx("d37")
            ].stateValues.formula.equals(me.fromText("0")),
        ).eq(true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d37")
            ].stateValues.variables.map((x) => x.tree),
        ).eqls(["x", "y"]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d37")
            ].stateValues.derivVariables.map((x) => x.tree),
        ).eqls(["u"]);

        expect(
            stateVariables[
                await resolvePathToNodeIdx("d38")
            ].stateValues.formula.equals(me.fromText("-2 y cos(x+y^2)z")),
        ).eq(true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d38")
            ].stateValues.variables.map((x) => x.tree),
        ).eqls(["z"]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d38")
            ].stateValues.derivVariables.map((x) => x.tree),
        ).eqls(["x", "x", "y"]);

        expect(
            stateVariables[
                await resolvePathToNodeIdx("d41")
            ].stateValues.formula.equals(me.fromText("cos(x_1+x_2^2)x_3")),
        ).eq(true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d41")
            ].stateValues.variables.map((x) => x.tree),
        ).eqls([
            ["_", "x", 1],
            ["_", "x", 2],
            ["_", "x", 3],
        ]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d41")
            ].stateValues.derivVariables.map((x) => x.tree),
        ).eqls([["_", "x", 1]]);

        expect(
            stateVariables[
                await resolvePathToNodeIdx("d42")
            ].stateValues.formula.equals(me.fromText("-2 x_2 sin(x_1+x_2^2)")),
        ).eq(true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d42")
            ].stateValues.variables.map((x) => x.tree),
        ).eqls([
            ["_", "x", 1],
            ["_", "x", 2],
            ["_", "x", 3],
        ]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d42")
            ].stateValues.derivVariables.map((x) => x.tree),
        ).eqls([
            ["_", "x", 1],
            ["_", "x", 2],
            ["_", "x", 3],
        ]);

        expect(
            stateVariables[
                await resolvePathToNodeIdx("d43")
            ].stateValues.formula.equals(me.fromText("0")),
        ).eq(true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d43")
            ].stateValues.variables.map((x) => x.tree),
        ).eqls([
            ["_", "x", 1],
            ["_", "x", 2],
            ["_", "x", 3],
        ]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d43")
            ].stateValues.derivVariables.map((x) => x.tree),
        ).eqls(["x"]);

        expect(
            stateVariables[
                await resolvePathToNodeIdx("d44")
            ].stateValues.formula.equals(me.fromText("-2 x_2 sin(x_1+x_2^2)")),
        ).eq(true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d44")
            ].stateValues.variables.map((x) => x.tree),
        ).eqls([
            ["_", "x", 3],
            ["_", "x", 2],
            ["_", "x", 1],
        ]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d44")
            ].stateValues.derivVariables.map((x) => x.tree),
        ).eqls([
            ["_", "x", 1],
            ["_", "x", 2],
            ["_", "x", 3],
        ]);
    });

    it("specifying derivative variables of an expression", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
      <math name="m1">sin(x+y^2)z</math>
      <math name="m2">sin(x_1+x_2^2)x_3</math>
      <derivative name="d1">$m1</derivative>
      <derivative name="d2" variable="x">$m1</derivative>
      <derivative name="d3" variables="x y z">$m1</derivative>
      <derivative name="d4" variables="z y x">$m1</derivative>
      <derivative name="d5" derivVariables="x">$m1</derivative>
      <derivative name="d5a" derivVariable="x" variables="x y z">$m1</derivative>
      <derivative name="d6" derivVariables="x x">$m1</derivative>
      <derivative name="d6a" derivVariable="x"><derivative derivVariable="x">$m1</derivative></derivative>
      <derivative name="d6b" derivVariables="x" variables="x y z"><derivative derivVariables="x">$m1</derivative></derivative>
      <derivative name="d6c" derivVariables="x"><derivative derivVariable="x" variables="x y z">$m1</derivative></derivative>
      <derivative name="d6d" derivVariables="x x" variables="x y z">$m1</derivative>
      <derivative name="d7" derivVariables="x y">$m1</derivative>
      <derivative name="d7a" derivVariable="y"><derivative derivVariables="x">$m1</derivative></derivative>
      <derivative name="d7b" derivVariables="y" variables="x y z"><derivative derivVariable="x">$m1</derivative></derivative>
      <derivative name="d7c" derivVariable="y"><derivative derivVariables="x" variables="x y z">$m1</derivative></derivative>
      <derivative name="d8" derivVariables="x y z">$m1</derivative>
      <derivative name="d8a" derivVariables="z"><derivative derivVariable="y"><derivative derivVariables="x">$m1</derivative></derivative></derivative>
      <derivative name="d8b" derivVariable="z" variables="x y z"><derivative derivVariables="y"><derivative derivVariable="x">$m1</derivative></derivative></derivative>
      <derivative name="d8c" derivVariables="z"><derivative derivVariable="y"><derivative derivVariables="x" variables="x y z">$m1</derivative></derivative></derivative>
      <derivative name="d9" derivVariables="x y z x">$m1</derivative>
      <derivative name="d9a" derivVariables="x"><derivative derivVariables="z"><derivative derivVariables="y"><derivative derivVariables="x">$m1</derivative></derivative></derivative></derivative>
      <derivative name="d9b" derivVariable="x"><derivative derivVariable="z" variables="x y z"><derivative derivVariable="y"><derivative derivVariables="x">$m1</derivative></derivative></derivative></derivative>
      <derivative name="d9c" derivVariable="x"><derivative derivVariables="z"><derivative derivVariables="y" variables="x y z"><derivative derivVariables="x">$m1</derivative></derivative></derivative></derivative>
      <derivative name="d10" derivVariables="q">$m1</derivative>
      <derivative name="d11" derivVariable="y" variables="x y z">$m1</derivative>
      <derivative name="d12" derivVariables="y" variables="x z">$m1</derivative>


      <derivative name="d13" variables="x_1 x_2 x_3">$m2</derivative>
      <derivative name="d14" derivVariables="x_1 x_1">$m2</derivative>
      <derivative name="d15" derivVariables="x_1 x_1" variables="x_1 x_2 x_3">$m2</derivative>

      `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[
                await resolvePathToNodeIdx("d1")
            ].stateValues.formula.equals(me.fromText("cos(x+y^2)z")),
        ).eq(true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d1")
            ].stateValues.variables.map((x) => x.tree),
        ).eqls(["x"]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d1")
            ].stateValues.derivVariables.map((x) => x.tree),
        ).eqls(["x"]);

        expect(
            stateVariables[
                await resolvePathToNodeIdx("d2")
            ].stateValues.formula.equals(me.fromText("cos(x+y^2)z")),
        ).eq(true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d2")
            ].stateValues.variables.map((x) => x.tree),
        ).eqls(["x"]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d2")
            ].stateValues.derivVariables.map((x) => x.tree),
        ).eqls(["x"]);

        expect(
            stateVariables[
                await resolvePathToNodeIdx("d3")
            ].stateValues.formula.equals(me.fromText("cos(x+y^2)z")),
        ).eq(true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d3")
            ].stateValues.variables.map((x) => x.tree),
        ).eqls(["x", "y", "z"]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d3")
            ].stateValues.derivVariables.map((x) => x.tree),
        ).eqls(["x"]);

        expect(
            stateVariables[
                await resolvePathToNodeIdx("d4")
            ].stateValues.formula.equals(me.fromText("sin(x+y^2)")),
        ).eq(true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d4")
            ].stateValues.variables.map((x) => x.tree),
        ).eqls(["z", "y", "x"]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d4")
            ].stateValues.derivVariables.map((x) => x.tree),
        ).eqls(["z"]);

        expect(
            stateVariables[
                await resolvePathToNodeIdx("d5")
            ].stateValues.formula.equals(me.fromText("cos(x+y^2)z")),
        ).eq(true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d5")
            ].stateValues.variables.map((x) => x.tree),
        ).eqls(["x"]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d5")
            ].stateValues.derivVariables.map((x) => x.tree),
        ).eqls(["x"]);

        expect(
            stateVariables[
                await resolvePathToNodeIdx("d5a")
            ].stateValues.formula.equals(me.fromText("cos(x+y^2)z")),
        ).eq(true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d5a")
            ].stateValues.variables.map((x) => x.tree),
        ).eqls(["x", "y", "z"]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d5a")
            ].stateValues.derivVariables.map((x) => x.tree),
        ).eqls(["x"]);

        expect(
            stateVariables[
                await resolvePathToNodeIdx("d6")
            ].stateValues.formula.equals(me.fromText("-sin(x+y^2)z")),
        ).eq(true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d6")
            ].stateValues.variables.map((x) => x.tree),
        ).eqls(["x"]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d6")
            ].stateValues.derivVariables.map((x) => x.tree),
        ).eqls(["x", "x"]);

        expect(
            stateVariables[
                await resolvePathToNodeIdx("d6a")
            ].stateValues.formula.equals(me.fromText("-sin(x+y^2)z")),
        ).eq(true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d6a")
            ].stateValues.variables.map((x) => x.tree),
        ).eqls(["x"]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d6a")
            ].stateValues.derivVariables.map((x) => x.tree),
        ).eqls(["x"]);

        expect(
            stateVariables[
                await resolvePathToNodeIdx("d6b")
            ].stateValues.formula.equals(me.fromText("-sin(x+y^2)z")),
        ).eq(true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d6b")
            ].stateValues.variables.map((x) => x.tree),
        ).eqls(["x", "y", "z"]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d6b")
            ].stateValues.derivVariables.map((x) => x.tree),
        ).eqls(["x"]);

        expect(
            stateVariables[
                await resolvePathToNodeIdx("d6c")
            ].stateValues.formula.equals(me.fromText("-sin(x+y^2)z")),
        ).eq(true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d6c")
            ].stateValues.variables.map((x) => x.tree),
        ).eqls(["x", "y", "z"]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d6c")
            ].stateValues.derivVariables.map((x) => x.tree),
        ).eqls(["x"]);

        expect(
            stateVariables[
                await resolvePathToNodeIdx("d6d")
            ].stateValues.formula.equals(me.fromText("-sin(x+y^2)z")),
        ).eq(true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d6d")
            ].stateValues.variables.map((x) => x.tree),
        ).eqls(["x", "y", "z"]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d6d")
            ].stateValues.derivVariables.map((x) => x.tree),
        ).eqls(["x", "x"]);

        expect(
            stateVariables[
                await resolvePathToNodeIdx("d7")
            ].stateValues.formula.equals(me.fromText("-2 y sin(x+y^2)z")),
        ).eq(true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d7")
            ].stateValues.variables.map((x) => x.tree),
        ).eqls(["x", "y"]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d7")
            ].stateValues.derivVariables.map((x) => x.tree),
        ).eqls(["x", "y"]);

        expect(
            stateVariables[
                await resolvePathToNodeIdx("d7a")
            ].stateValues.formula.equals(me.fromText("-2 y sin(x+y^2)z")),
        ).eq(true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d7a")
            ].stateValues.variables.map((x) => x.tree),
        ).eqls(["x"]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d7a")
            ].stateValues.derivVariables.map((x) => x.tree),
        ).eqls(["y"]);

        expect(
            stateVariables[
                await resolvePathToNodeIdx("d7b")
            ].stateValues.formula.equals(me.fromText("-2 y sin(x+y^2)z")),
        ).eq(true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d7b")
            ].stateValues.variables.map((x) => x.tree),
        ).eqls(["x", "y", "z"]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d7b")
            ].stateValues.derivVariables.map((x) => x.tree),
        ).eqls(["y"]);

        expect(
            stateVariables[
                await resolvePathToNodeIdx("d7c")
            ].stateValues.formula.equals(me.fromText("-2 y sin(x+y^2)z")),
        ).eq(true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d7c")
            ].stateValues.variables.map((x) => x.tree),
        ).eqls(["x", "y", "z"]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d7c")
            ].stateValues.derivVariables.map((x) => x.tree),
        ).eqls(["y"]);

        expect(
            stateVariables[
                await resolvePathToNodeIdx("d8")
            ].stateValues.formula.equals(me.fromText("-2 y sin(x+y^2)")),
        ).eq(true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d8")
            ].stateValues.variables.map((x) => x.tree),
        ).eqls(["x", "y", "z"]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d8")
            ].stateValues.derivVariables.map((x) => x.tree),
        ).eqls(["x", "y", "z"]);

        expect(
            stateVariables[
                await resolvePathToNodeIdx("d8a")
            ].stateValues.formula.equals(me.fromText("-2 y sin(x+y^2)")),
        ).eq(true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d8a")
            ].stateValues.variables.map((x) => x.tree),
        ).eqls(["x"]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d8a")
            ].stateValues.derivVariables.map((x) => x.tree),
        ).eqls(["z"]);

        expect(
            stateVariables[
                await resolvePathToNodeIdx("d8b")
            ].stateValues.formula.equals(me.fromText("-2 y sin(x+y^2)")),
        ).eq(true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d8b")
            ].stateValues.variables.map((x) => x.tree),
        ).eqls(["x", "y", "z"]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d8b")
            ].stateValues.derivVariables.map((x) => x.tree),
        ).eqls(["z"]);

        expect(
            stateVariables[
                await resolvePathToNodeIdx("d8c")
            ].stateValues.formula.equals(me.fromText("-2 y sin(x+y^2)")),
        ).eq(true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d8c")
            ].stateValues.variables.map((x) => x.tree),
        ).eqls(["x", "y", "z"]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d8c")
            ].stateValues.derivVariables.map((x) => x.tree),
        ).eqls(["z"]);

        expect(
            stateVariables[
                await resolvePathToNodeIdx("d9")
            ].stateValues.formula.equals(me.fromText("-2 y cos(x+y^2)")),
        ).eq(true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d9")
            ].stateValues.variables.map((x) => x.tree),
        ).eqls(["x", "y", "z"]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d9")
            ].stateValues.derivVariables.map((x) => x.tree),
        ).eqls(["x", "y", "z", "x"]);

        expect(
            stateVariables[
                await resolvePathToNodeIdx("d9a")
            ].stateValues.formula.equals(me.fromText("-2 y cos(x+y^2)")),
        ).eq(true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d9a")
            ].stateValues.variables.map((x) => x.tree),
        ).eqls(["x"]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d9a")
            ].stateValues.derivVariables.map((x) => x.tree),
        ).eqls(["x"]);

        expect(
            stateVariables[
                await resolvePathToNodeIdx("d9b")
            ].stateValues.formula.equals(me.fromText("-2 y cos(x+y^2)")),
        ).eq(true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d9b")
            ].stateValues.variables.map((x) => x.tree),
        ).eqls(["x", "y", "z"]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d9b")
            ].stateValues.derivVariables.map((x) => x.tree),
        ).eqls(["x"]);

        expect(
            stateVariables[
                await resolvePathToNodeIdx("d9c")
            ].stateValues.formula.equals(me.fromText("-2 y cos(x+y^2)")),
        ).eq(true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d9c")
            ].stateValues.variables.map((x) => x.tree),
        ).eqls(["x", "y", "z"]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d9c")
            ].stateValues.derivVariables.map((x) => x.tree),
        ).eqls(["x"]);

        expect(
            stateVariables[
                await resolvePathToNodeIdx("d10")
            ].stateValues.formula.equals(me.fromText("0")),
        ).eq(true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d10")
            ].stateValues.variables.map((x) => x.tree),
        ).eqls(["q"]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d10")
            ].stateValues.derivVariables.map((x) => x.tree),
        ).eqls(["q"]);

        expect(
            stateVariables[
                await resolvePathToNodeIdx("d11")
            ].stateValues.formula.equals(me.fromText("2 y cos(x+y^2)z")),
        ).eq(true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d11")
            ].stateValues.variables.map((x) => x.tree),
        ).eqls(["x", "y", "z"]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d11")
            ].stateValues.derivVariables.map((x) => x.tree),
        ).eqls(["y"]);

        expect(
            stateVariables[
                await resolvePathToNodeIdx("d12")
            ].stateValues.formula.equals(me.fromText("2 y cos(x+y^2)z")),
        ).eq(true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d12")
            ].stateValues.variables.map((x) => x.tree),
        ).eqls(["x", "z"]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d12")
            ].stateValues.derivVariables.map((x) => x.tree),
        ).eqls(["y"]);

        expect(
            stateVariables[
                await resolvePathToNodeIdx("d13")
            ].stateValues.formula.equals(me.fromText("cos(x_1+x_2^2)x_3")),
        ).eq(true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d13")
            ].stateValues.variables.map((x) => x.tree),
        ).eqls([
            ["_", "x", 1],
            ["_", "x", 2],
            ["_", "x", 3],
        ]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d13")
            ].stateValues.derivVariables.map((x) => x.tree),
        ).eqls([["_", "x", 1]]);

        expect(
            stateVariables[
                await resolvePathToNodeIdx("d14")
            ].stateValues.formula.equals(me.fromText("-sin(x_1+x_2^2)x_3")),
        ).eq(true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d14")
            ].stateValues.variables.map((x) => x.tree),
        ).eqls([["_", "x", 1]]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d14")
            ].stateValues.derivVariables.map((x) => x.tree),
        ).eqls([
            ["_", "x", 1],
            ["_", "x", 1],
        ]);

        expect(
            stateVariables[
                await resolvePathToNodeIdx("d15")
            ].stateValues.formula.equals(me.fromText("-sin(x_1+x_2^2)x_3")),
        ).eq(true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d15")
            ].stateValues.variables.map((x) => x.tree),
        ).eqls([
            ["_", "x", 1],
            ["_", "x", 2],
            ["_", "x", 3],
        ]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d15")
            ].stateValues.derivVariables.map((x) => x.tree),
        ).eqls([
            ["_", "x", 1],
            ["_", "x", 1],
        ]);
    });

    it("derivative of function with changed variables", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
      <function name="f1" variables="x y z">sin(x+y^2)z</function>
      <function name="f2" variables="z y x">$f1</function>
      <function name="g1" variables="x_1 x_2 x_3">sin(x_1+x_2^2)x_3</function>
      <function name="g2" variables="x_3 x_2 x_1">$g1</function>
      <derivative name="df1">$f1</derivative>
      <derivative name="d2f1">$df1</derivative>
      <derivative name="df2">$f2</derivative>
      <derivative name="d2f2">$df2</derivative>
      <derivative name="dg1">$g1</derivative>
      <derivative name="d2g1">$dg1</derivative>
      <derivative name="dg2">$g2</derivative>
      <derivative name="d2g2">$dg2</derivative>

      `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[
                await resolvePathToNodeIdx("df1")
            ].stateValues.formula.equals(me.fromText("cos(x+y^2)z")),
        ).eq(true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("df1")
            ].stateValues.variables.map((x) => x.tree),
        ).eqls(["x", "y", "z"]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("df1")
            ].stateValues.derivVariables.map((x) => x.tree),
        ).eqls(["x"]);

        expect(
            stateVariables[
                await resolvePathToNodeIdx("df2")
            ].stateValues.formula.equals(me.fromText("sin(x+y^2)")),
        ).eq(true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("df2")
            ].stateValues.variables.map((x) => x.tree),
        ).eqls(["z", "y", "x"]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("df2")
            ].stateValues.derivVariables.map((x) => x.tree),
        ).eqls(["z"]);

        expect(
            stateVariables[
                await resolvePathToNodeIdx("dg1")
            ].stateValues.formula.equals(me.fromText("cos(x_1+x_2^2)x_3")),
        ).eq(true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("dg1")
            ].stateValues.variables.map((x) => x.tree),
        ).eqls([
            ["_", "x", 1],
            ["_", "x", 2],
            ["_", "x", 3],
        ]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("dg1")
            ].stateValues.derivVariables.map((x) => x.tree),
        ).eqls([["_", "x", 1]]);

        expect(
            stateVariables[
                await resolvePathToNodeIdx("dg2")
            ].stateValues.formula.equals(me.fromText("sin(x_1+x_2^2)")),
        ).eq(true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("dg2")
            ].stateValues.variables.map((x) => x.tree),
        ).eqls([
            ["_", "x", 3],
            ["_", "x", 2],
            ["_", "x", 1],
        ]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("dg2")
            ].stateValues.derivVariables.map((x) => x.tree),
        ).eqls([["_", "x", 3]]);
    });

    it("derivative of function with changed variables, convert to single variable function", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
      <section name="fs">
      <function name="f1" variables="x y z">sin(x)z</function>
      <function name="f2" variables="z y x">$f1.formula</function>
      <function name="f3" variables="x y z">sin(x)yz</function>
      <function name="f4" variables="z y x">$f3.formula</function>
      
      <derivative derivvariables="z" name="df1" >$f1</derivative>
      <derivative name="df2">$f2</derivative>
      <function variable="x" name="df2a">$df2.formula</function>
      <derivative derivvariables="z y" name="df3zy">$f3</derivative>
      <derivative derivvariable="y" name="df3y">$f3</derivative>
      <derivative derivvariables="z" name="df3zya">$df3y</derivative>
      <derivative derivvariables="z y" name="df4zy">$f4</derivative>
      <derivative name="df4z">$f4</derivative>
      <derivative derivvariable="y" name="df4yz">$df4z</derivative>
      <function variables="x" name="df4zya">$df4zy.formula</function>
      <function variable="x" name="df4yza">$df4yz.formula</function>
      </section>

      <graph>
        $df2a
      </graph>
      
      <graph>
        $df4zya
      </graph>
      
      <graph>
        $df4yza
      </graph>

      <repeat for ="-2 0 2" valueName="v" name="ts">
          <p><evaluate function="$fs.df1" input="$v 0 0" name="df1" />
          <evaluate function="$fs.df2a" input="$v" name="df2a" />
          <evaluate function="$fs.df3zy" input="$v 0 0" name="df3zy" />
          <evaluate function="$fs.df3zya" input="$v 0 0" name="df3zya" />
          <evaluate function="$fs.df4zya" input="$v" name="df4zya" />
          <evaluate function="$fs.df4yza" input="$v" name="df4yza" />
          <evaluate forceNumeric displayDigits="3" function="$fs.df1" input="$v 0 0" name="df1n" />
          <evaluate forceNumeric displayDigits="3" function="$fs.df2a" input="$v" name="df2an" />
          <evaluate forceNumeric displayDigits="3" function="$fs.df3zy" input="$v 0 0" name="df3zyn" />
          <evaluate forceNumeric displayDigits="3" function="$fs.df3zya" input="$v 0 0" name="df3zyan" />
          <evaluate forceNumeric displayDigits="3" function="$fs.df4zya" input="$v" name="df4zyan" />
          <evaluate forceNumeric displayDigits="3" function="$fs.df4yza" input="$v" name="df4yzan" /></p>
      </repeat>
      `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[
                await resolvePathToNodeIdx("df1")
            ].stateValues.formula.equals(me.fromText("sin(x)")),
        ).eq(true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("df1")
            ].stateValues.variables.map((x) => x.tree),
        ).eqls(["x", "y", "z"]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("df1")
            ].stateValues.derivVariables.map((x) => x.tree),
        ).eqls(["z"]);

        expect(
            stateVariables[
                await resolvePathToNodeIdx("df2")
            ].stateValues.formula.equals(me.fromText("sin(x)")),
        ).eq(true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("df2")
            ].stateValues.variables.map((x) => x.tree),
        ).eqls(["z", "y", "x"]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("df2")
            ].stateValues.derivVariables.map((x) => x.tree),
        ).eqls(["z"]);

        expect(
            stateVariables[
                await resolvePathToNodeIdx("df2a")
            ].stateValues.formula.equals(me.fromText("sin(x)")),
        ).eq(true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("df2a")
            ].stateValues.variables.map((x) => x.tree),
        ).eqls(["x"]);

        expect(
            stateVariables[
                await resolvePathToNodeIdx("df3zy")
            ].stateValues.formula.equals(me.fromText("sin(x)")),
        ).eq(true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("df3zy")
            ].stateValues.variables.map((x) => x.tree),
        ).eqls(["x", "y", "z"]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("df3zy")
            ].stateValues.derivVariables.map((x) => x.tree),
        ).eqls(["z", "y"]);

        expect(
            stateVariables[
                await resolvePathToNodeIdx("df3y")
            ].stateValues.formula.equals(me.fromText("sin(x)z")),
        ).eq(true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("df3y")
            ].stateValues.variables.map((x) => x.tree),
        ).eqls(["x", "y", "z"]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("df3y")
            ].stateValues.derivVariables.map((x) => x.tree),
        ).eqls(["y"]);

        expect(
            stateVariables[
                await resolvePathToNodeIdx("df3zya")
            ].stateValues.formula.equals(me.fromText("sin(x)")),
        ).eq(true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("df3zya")
            ].stateValues.variables.map((x) => x.tree),
        ).eqls(["x", "y", "z"]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("df3zya")
            ].stateValues.derivVariables.map((x) => x.tree),
        ).eqls(["z"]);

        expect(
            stateVariables[
                await resolvePathToNodeIdx("df4zy")
            ].stateValues.formula.equals(me.fromText("sin(x)")),
        ).eq(true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("df4zy")
            ].stateValues.variables.map((x) => x.tree),
        ).eqls(["z", "y", "x"]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("df4zy")
            ].stateValues.derivVariables.map((x) => x.tree),
        ).eqls(["z", "y"]);

        expect(
            stateVariables[
                await resolvePathToNodeIdx("df4z")
            ].stateValues.formula.equals(me.fromText("sin(x)y")),
        ).eq(true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("df4z")
            ].stateValues.variables.map((x) => x.tree),
        ).eqls(["z", "y", "x"]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("df4z")
            ].stateValues.derivVariables.map((x) => x.tree),
        ).eqls(["z"]);

        expect(
            stateVariables[
                await resolvePathToNodeIdx("df4yz")
            ].stateValues.formula.equals(me.fromText("sin(x)")),
        ).eq(true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("df4yz")
            ].stateValues.variables.map((x) => x.tree),
        ).eqls(["z", "y", "x"]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("df4yz")
            ].stateValues.derivVariables.map((x) => x.tree),
        ).eqls(["y"]);

        expect(
            stateVariables[
                await resolvePathToNodeIdx("df4zya")
            ].stateValues.formula.equals(me.fromText("sin(x)")),
        ).eq(true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("df4zya")
            ].stateValues.variables.map((x) => x.tree),
        ).eqls(["x"]);

        expect(
            stateVariables[
                await resolvePathToNodeIdx("df4yza")
            ].stateValues.formula.equals(me.fromText("sin(x)")),
        ).eq(true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("df4yza")
            ].stateValues.variables.map((x) => x.tree),
        ).eqls(["x"]);

        expect(
            stateVariables[await resolvePathToNodeIdx("ts[1].df1")].stateValues
                .value.tree,
        ).eqls(["apply", "sin", -2]);
        expect(
            stateVariables[await resolvePathToNodeIdx("ts[1].df2a")].stateValues
                .value.tree,
        ).eqls(["apply", "sin", -2]);
        expect(
            stateVariables[await resolvePathToNodeIdx("ts[1].df3zy")]
                .stateValues.value.tree,
        ).eqls(["apply", "sin", -2]);
        expect(
            stateVariables[await resolvePathToNodeIdx("ts[1].df3zya")]
                .stateValues.value.tree,
        ).eqls(["apply", "sin", -2]);
        expect(
            stateVariables[await resolvePathToNodeIdx("ts[1].df4zya")]
                .stateValues.value.tree,
        ).eqls(["apply", "sin", -2]);
        expect(
            stateVariables[await resolvePathToNodeIdx("ts[1].df4yza")]
                .stateValues.value.tree,
        ).eqls(["apply", "sin", -2]);
        expect(
            stateVariables[await resolvePathToNodeIdx("ts[1].df1n")].stateValues
                .value.tree,
        ).closeTo(Math.sin(-2), 1e-10);
        expect(
            stateVariables[await resolvePathToNodeIdx("ts[1].df2an")]
                .stateValues.value.tree,
        ).closeTo(Math.sin(-2), 1e-10);
        expect(
            stateVariables[await resolvePathToNodeIdx("ts[1].df3zyn")]
                .stateValues.value.tree,
        ).closeTo(Math.sin(-2), 1e-10);
        expect(
            stateVariables[await resolvePathToNodeIdx("ts[1].df3zyan")]
                .stateValues.value.tree,
        ).closeTo(Math.sin(-2), 1e-10);
        expect(
            stateVariables[await resolvePathToNodeIdx("ts[1].df4zyan")]
                .stateValues.value.tree,
        ).closeTo(Math.sin(-2), 1e-10);
        expect(
            stateVariables[await resolvePathToNodeIdx("ts[1].df4yzan")]
                .stateValues.value.tree,
        ).closeTo(Math.sin(-2), 1e-10);

        expect(
            stateVariables[await resolvePathToNodeIdx("ts[2].df1")].stateValues
                .value.tree,
        ).eq(0);
        expect(
            stateVariables[await resolvePathToNodeIdx("ts[2].df2a")].stateValues
                .value.tree,
        ).eq(0);
        expect(
            stateVariables[await resolvePathToNodeIdx("ts[2].df3zy")]
                .stateValues.value.tree,
        ).eq(0);
        expect(
            stateVariables[await resolvePathToNodeIdx("ts[2].df3zya")]
                .stateValues.value.tree,
        ).eq(0);
        expect(
            stateVariables[await resolvePathToNodeIdx("ts[2].df4zya")]
                .stateValues.value.tree,
        ).eq(0);
        expect(
            stateVariables[await resolvePathToNodeIdx("ts[2].df4yza")]
                .stateValues.value.tree,
        ).eq(0);
        expect(
            stateVariables[await resolvePathToNodeIdx("ts[2].df1n")].stateValues
                .value.tree,
        ).closeTo(0, 1e-10);
        expect(
            stateVariables[await resolvePathToNodeIdx("ts[2].df2an")]
                .stateValues.value.tree,
        ).closeTo(0, 1e-10);
        expect(
            stateVariables[await resolvePathToNodeIdx("ts[2].df3zyn")]
                .stateValues.value.tree,
        ).closeTo(0, 1e-10);
        expect(
            stateVariables[await resolvePathToNodeIdx("ts[2].df3zyan")]
                .stateValues.value.tree,
        ).closeTo(0, 1e-10);
        expect(
            stateVariables[await resolvePathToNodeIdx("ts[2].df4zyan")]
                .stateValues.value.tree,
        ).closeTo(0, 1e-10);
        expect(
            stateVariables[await resolvePathToNodeIdx("ts[2].df4yzan")]
                .stateValues.value.tree,
        ).closeTo(0, 1e-10);

        expect(
            stateVariables[await resolvePathToNodeIdx("ts[3].df1")].stateValues
                .value.tree,
        ).eqls(["apply", "sin", 2]);
        expect(
            stateVariables[await resolvePathToNodeIdx("ts[3].df2a")].stateValues
                .value.tree,
        ).eqls(["apply", "sin", 2]);
        expect(
            stateVariables[await resolvePathToNodeIdx("ts[3].df3zy")]
                .stateValues.value.tree,
        ).eqls(["apply", "sin", 2]);
        expect(
            stateVariables[await resolvePathToNodeIdx("ts[3].df3zya")]
                .stateValues.value.tree,
        ).eqls(["apply", "sin", 2]);
        expect(
            stateVariables[await resolvePathToNodeIdx("ts[3].df4zya")]
                .stateValues.value.tree,
        ).eqls(["apply", "sin", 2]);
        expect(
            stateVariables[await resolvePathToNodeIdx("ts[3].df4yza")]
                .stateValues.value.tree,
        ).eqls(["apply", "sin", 2]);
        expect(
            stateVariables[await resolvePathToNodeIdx("ts[3].df1n")].stateValues
                .value.tree,
        ).closeTo(Math.sin(2), 1e-10);
        expect(
            stateVariables[await resolvePathToNodeIdx("ts[3].df2an")]
                .stateValues.value.tree,
        ).closeTo(Math.sin(2), 1e-10);
        expect(
            stateVariables[await resolvePathToNodeIdx("ts[3].df3zyn")]
                .stateValues.value.tree,
        ).closeTo(Math.sin(2), 1e-10);
        expect(
            stateVariables[await resolvePathToNodeIdx("ts[3].df3zyan")]
                .stateValues.value.tree,
        ).closeTo(Math.sin(2), 1e-10);
        expect(
            stateVariables[await resolvePathToNodeIdx("ts[3].df4zyan")]
                .stateValues.value.tree,
        ).closeTo(Math.sin(2), 1e-10);
        expect(
            stateVariables[await resolvePathToNodeIdx("ts[3].df4yzan")]
                .stateValues.value.tree,
        ).closeTo(Math.sin(2), 1e-10);

        let df1 =
            stateVariables[await resolvePathToNodeIdx("df1")].stateValues
                .numericalfs[0];
        let df2a =
            stateVariables[await resolvePathToNodeIdx("df2a")].stateValues
                .numericalfs[0];
        let df3zy =
            stateVariables[await resolvePathToNodeIdx("df3zy")].stateValues
                .numericalfs[0];
        let df3zya =
            stateVariables[await resolvePathToNodeIdx("df3zya")].stateValues
                .numericalfs[0];
        let df4zya =
            stateVariables[await resolvePathToNodeIdx("df4zya")].stateValues
                .numericalfs[0];
        let df4yza =
            stateVariables[await resolvePathToNodeIdx("df4yza")].stateValues
                .numericalfs[0];

        for (let i = 1; i <= 21; i++) {
            let x = 0.2 * (i - 11);
            expect(df1(x, 0, 0)).closeTo(Math.sin(x), 1e-10);
            expect(df2a(x)).closeTo(Math.sin(x), 1e-10);
            expect(df3zy(x, 0, 0)).closeTo(Math.sin(x), 1e-10);
            expect(df3zya(x, 0, 0)).closeTo(Math.sin(x), 1e-10);
            expect(df4zya(x)).closeTo(Math.sin(x), 1e-10);
            expect(df4yza(x)).closeTo(Math.sin(x), 1e-10);
        }
    });

    it("derivative with empty variables attribute", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
      <derivative name="d1" variables="">x^2</derivative>

      <graph>
        $d1
      </graph>
      `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[
                await resolvePathToNodeIdx("d1")
            ].stateValues.formula.equals(me.fromText("2x")),
        ).eq(true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d1")
            ].stateValues.variables.map((x) => x.tree),
        ).eqls(["x"]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d1")
            ].stateValues.derivVariables.map((x) => x.tree),
        ).eqls(["x"]);

        let d1 =
            stateVariables[await resolvePathToNodeIdx("d1")].stateValues
                .numericalfs[0];

        for (let i = 1; i <= 21; i++) {
            let x = 0.2 * (i - 11);
            expect(d1(x)).closeTo(2 * x, 1e-10);
        }
    });

    it("derivatives of vector-valued functions", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
      <function name="f1">(sin(x), cos(x))</function>
      <function name="f2" variables="y">(e^(2y), y, log(y))</function>
      <function name="f3">(xyz, xy, xz, yz)</function>
      <function name="f4" variable="z">(xyz, xy, xz, yz)</function>
      <derivative name="d1"><function>(x^2, x^3)</function></derivative>
      <derivative name="d2"><math name="x2">(x^2, x^3)</math></derivative>
      <derivative name="d2b">$x2</derivative>
      <derivative name="d2c">$x2</derivative>
      <derivative name="d3"><function>(x^2sin(z), z^2sin(x))</function></derivative>
      <derivative name="d4" variables="z">(x^2sin(z),z^2sin(x))</derivative>
      <math name='var'>z</math><number name="a">2</number>
      <derivative name="d4b" variable="$var">(x^$a sin($var), $var^$a sin(x))</derivative>
      <derivative name="d5">$f1</derivative>
      <derivative name="d5b">$f1</derivative>
      <derivative name="d6">$f2</derivative>
      <derivative name="d6b">$f2</derivative>
      <derivative name="d7">$f3</derivative>
      <derivative name="d7b">$f3</derivative>
      <derivative name="d8">$f4</derivative>
      <derivative name="d8b">$f4</derivative>
      <derivative variables="q" name="d9">$f1</derivative>
      <derivative variable="q" name="d10">$f2</derivative>
      <derivative variables="q" name="d11">$f3</derivative>
      <derivative variable="q" name="d12">$f4</derivative>
      <derivative variables="y" name="d13">$f3</derivative>
      <derivative variable="y" name="d14">$f4</derivative>
      `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d1")
            ].stateValues.formula.equals(me.fromText("(2x,3x^2)")),
        ).eq(true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d2")
            ].stateValues.formula.equals(me.fromText("(2x,3x^2)")),
        ).eq(true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d2b")
            ].stateValues.formula.equals(me.fromText("(2x,3x^2)")),
        ).eq(true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d2c")
            ].stateValues.formula.equals(me.fromText("(2x,3x^2)")),
        ).eq(true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d3")
            ].stateValues.formula.equals(
                me.fromText("(2x sin(z), z^2 cos(x))"),
            ),
        ).eq(true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d4")
            ].stateValues.formula.equals(me.fromText("(x^2cos(z), 2z sin(x))")),
        ).eq(true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d4b")
            ].stateValues.formula.equals(me.fromText("(x^2cos(z), 2z sin(x))")),
        ).eq(true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d5")
            ].stateValues.formula.equals(me.fromText("(cos(x),-sin(x))")),
        ).eq(true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d5b")
            ].stateValues.formula.equals(me.fromText("(cos(x), -sin(x))")),
        ).eq(true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d6")
            ].stateValues.formula.equals(me.fromText("(2e^(2y),1,1/y)")),
        ).eq(true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d6b")
            ].stateValues.formula.equals(me.fromText("(2e^(2y),1,1/y)")),
        ).eq(true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d7")
            ].stateValues.formula.equals(me.fromText("(yz, y, z, 0)")),
        ).eq(true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d7b")
            ].stateValues.formula.equals(me.fromText("(yz, y, z, 0)")),
        ).eq(true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d8")
            ].stateValues.formula.equals(me.fromText("(xy, 0, x, y)")),
        ).eq(true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d8b")
            ].stateValues.formula.equals(me.fromText("(xy, 0, x, y)")),
        ).eq(true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d9")
            ].stateValues.formula.equals(me.fromText("(0,0)")),
        ).eq(true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d10")
            ].stateValues.formula.equals(me.fromText("(0,0,0)")),
        ).eq(true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d11")
            ].stateValues.formula.equals(me.fromText("(0,0,0,0)")),
        ).eq(true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d12")
            ].stateValues.formula.equals(me.fromText("(0,0,0,0)")),
        ).eq(true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d13")
            ].stateValues.formula.equals(me.fromText("(xz,x,0,z)")),
        ).eq(true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d14")
            ].stateValues.formula.equals(me.fromText("(xz,x,0,z)")),
        ).eq(true);

        let d1_1 =
            stateVariables[await resolvePathToNodeIdx("d1")].stateValues
                .numericalfs[0];
        let d1_2 =
            stateVariables[await resolvePathToNodeIdx("d1")].stateValues
                .numericalfs[1];
        let d2_1 =
            stateVariables[await resolvePathToNodeIdx("d2")].stateValues
                .numericalfs[0];
        let d2_2 =
            stateVariables[await resolvePathToNodeIdx("d2")].stateValues
                .numericalfs[1];
        let d2b_1 =
            stateVariables[await resolvePathToNodeIdx("d2b")].stateValues
                .numericalfs[0];
        let d2b_2 =
            stateVariables[await resolvePathToNodeIdx("d2b")].stateValues
                .numericalfs[1];
        let d2c_1 =
            stateVariables[await resolvePathToNodeIdx("d2c")].stateValues
                .numericalfs[0];
        let d2c_2 =
            stateVariables[await resolvePathToNodeIdx("d2c")].stateValues
                .numericalfs[1];
        let d5_1 =
            stateVariables[await resolvePathToNodeIdx("d5")].stateValues
                .numericalfs[0];
        let d5_2 =
            stateVariables[await resolvePathToNodeIdx("d5")].stateValues
                .numericalfs[1];
        let d5b_1 =
            stateVariables[await resolvePathToNodeIdx("d5b")].stateValues
                .numericalfs[0];
        let d5b_2 =
            stateVariables[await resolvePathToNodeIdx("d5b")].stateValues
                .numericalfs[1];
        let d6_1 =
            stateVariables[await resolvePathToNodeIdx("d6")].stateValues
                .numericalfs[0];
        let d6_2 =
            stateVariables[await resolvePathToNodeIdx("d6")].stateValues
                .numericalfs[1];
        let d6_3 =
            stateVariables[await resolvePathToNodeIdx("d6")].stateValues
                .numericalfs[2];
        let d6b_1 =
            stateVariables[await resolvePathToNodeIdx("d6b")].stateValues
                .numericalfs[0];
        let d6b_2 =
            stateVariables[await resolvePathToNodeIdx("d6b")].stateValues
                .numericalfs[1];
        let d6b_3 =
            stateVariables[await resolvePathToNodeIdx("d6b")].stateValues
                .numericalfs[2];
        let d9_1 =
            stateVariables[await resolvePathToNodeIdx("d9")].stateValues
                .numericalfs[0];
        let d9_2 =
            stateVariables[await resolvePathToNodeIdx("d9")].stateValues
                .numericalfs[1];
        let d10_1 =
            stateVariables[await resolvePathToNodeIdx("d10")].stateValues
                .numericalfs[0];
        let d10_2 =
            stateVariables[await resolvePathToNodeIdx("d10")].stateValues
                .numericalfs[1];
        let d10_3 =
            stateVariables[await resolvePathToNodeIdx("d10")].stateValues
                .numericalfs[2];
        let d11_1 =
            stateVariables[await resolvePathToNodeIdx("d11")].stateValues
                .numericalfs[0];
        let d11_2 =
            stateVariables[await resolvePathToNodeIdx("d11")].stateValues
                .numericalfs[1];
        let d11_3 =
            stateVariables[await resolvePathToNodeIdx("d11")].stateValues
                .numericalfs[2];
        let d11_4 =
            stateVariables[await resolvePathToNodeIdx("d11")].stateValues
                .numericalfs[3];
        let d12_1 =
            stateVariables[await resolvePathToNodeIdx("d12")].stateValues
                .numericalfs[0];
        let d12_2 =
            stateVariables[await resolvePathToNodeIdx("d12")].stateValues
                .numericalfs[1];
        let d12_3 =
            stateVariables[await resolvePathToNodeIdx("d12")].stateValues
                .numericalfs[2];
        let d12_4 =
            stateVariables[await resolvePathToNodeIdx("d12")].stateValues
                .numericalfs[3];

        for (let i = 1; i <= 21; i++) {
            let x = 0.2 * (i - 11);
            expect(d1_1(x)).closeTo(2 * x, 1e-10);
            expect(d1_2(x)).closeTo(3 * x ** 2, 1e-10);
            expect(d2_1(x)).closeTo(2 * x, 1e-10);
            expect(d2_2(x)).closeTo(3 * x ** 2, 1e-10);
            expect(d2b_1(x)).closeTo(2 * x, 1e-10);
            expect(d2b_2(x)).closeTo(3 * x ** 2, 1e-10);
            expect(d2c_1(x)).closeTo(2 * x, 1e-10);
            expect(d2c_2(x)).closeTo(3 * x ** 2, 1e-10);
            expect(d5_1(x)).closeTo(Math.cos(x), 1e-10);
            expect(d5_2(x)).closeTo(-Math.sin(x), 1e-10);
            expect(d5b_1(x)).closeTo(Math.cos(x), 1e-10);
            expect(d5b_2(x)).closeTo(-Math.sin(x), 1e-10);
            expect(d6_1(x)).closeTo(2 * Math.exp(2 * x), 1e-10);
            expect(d6_2(x)).closeTo(1, 1e-10);
            if (x === 0) {
                expect(d6_3(x)).eq(Infinity);
            } else {
                expect(d6_3(x)).closeTo(1 / x, 1e-10);
            }
            expect(d6b_1(x)).closeTo(2 * Math.exp(2 * x), 1e-10);
            expect(d6b_2(x)).closeTo(1, 1e-10);
            if (x === 0) {
                expect(d6b_3(x)).eq(Infinity);
            } else {
                expect(d6b_3(x)).closeTo(1 / x, 1e-10);
            }
            expect(d9_1(x)).closeTo(0, 1e-10);
            expect(d9_2(x)).closeTo(0, 1e-10);
            expect(d10_1(x)).closeTo(0, 1e-10);
            expect(d10_2(x)).closeTo(0, 1e-10);
            expect(d10_3(x)).closeTo(0, 1e-10);
            expect(d11_1(x)).closeTo(0, 1e-10);
            expect(d11_2(x)).closeTo(0, 1e-10);
            expect(d11_3(x)).closeTo(0, 1e-10);
            expect(d11_4(x)).closeTo(0, 1e-10);
            expect(d12_1(x)).closeTo(0, 1e-10);
            expect(d12_2(x)).closeTo(0, 1e-10);
            expect(d12_3(x)).closeTo(0, 1e-10);
            expect(d12_4(x)).closeTo(0, 1e-10);
        }
    });

    // check to make sure fixed bug where wasn't displaying inside <m>
    it("derivative displayed inside <m>", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
      <p name="p1">Let <m>f(x) = <function name="f">sin(x)</function></m>.</p>
      <p name="p2">Then <m>f'(x) = <derivative>$f</derivative></m>.</p>
      `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("p1")].stateValues.text,
        ).eq("Let f(x) = sin(x).");
        expect(
            stateVariables[await resolvePathToNodeIdx("p2")].stateValues.text,
        ).eq("Then f'(x) = cos(x).");
    });

    it("derivatives of interpolated function", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
      <graph>
        <function minima='(3,4)' name="f" />
        <derivative name="d1">$f</derivative>
        <derivative name="d2">$d1</derivative>
        <derivative name="d3">$d2</derivative>
        <derivative name="d4">$d3</derivative>
        <derivative name="d5">$d4</derivative>
        <derivative name="d6">$d5</derivative>
      </graph>
      `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        let f1 =
            stateVariables[await resolvePathToNodeIdx("f")].stateValues
                .numericalfs[0];
        let d1 =
            stateVariables[await resolvePathToNodeIdx("d1")].stateValues
                .numericalfs[0];
        let d2 =
            stateVariables[await resolvePathToNodeIdx("d2")].stateValues
                .numericalfs[0];
        let d3 =
            stateVariables[await resolvePathToNodeIdx("d3")].stateValues
                .numericalfs[0];
        let d4 =
            stateVariables[await resolvePathToNodeIdx("d4")].stateValues
                .numericalfs[0];
        let d5 =
            stateVariables[await resolvePathToNodeIdx("d5")].stateValues
                .numericalfs[0];
        let d6 =
            stateVariables[await resolvePathToNodeIdx("d6")].stateValues
                .numericalfs[0];

        for (let x = -10; x <= 10; x += 0.5) {
            expect(f1(x)).eq((x - 3) ** 2 + 4);
            expect(d1(x)).eq(2 * (x - 3));
            expect(d2(x)).eq(2);
            expect(d3(x)).eq(0);
            expect(d4(x)).eq(0);
            expect(d5(x)).eq(0);
            expect(d6(x)).eq(0);
        }
    });

    it("derivatives of interpolated function 2", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
      <graph>
        <function name="f" minima="(3,4)" through="(-1,5) (4,2)" maxima="(1,0)" />
        <derivative name="d1">$f</derivative>
        <derivative name="d2">$d1</derivative>
        <derivative name="d3">$d2</derivative>
        <derivative name="d4">$d3</derivative>
      </graph>
      `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        let dx = 0.0001;

        let f =
            stateVariables[await resolvePathToNodeIdx("f")].stateValues
                .numericalfs[0];
        let d1 =
            stateVariables[await resolvePathToNodeIdx("d1")].stateValues
                .numericalfs[0];
        let d2 =
            stateVariables[await resolvePathToNodeIdx("d2")].stateValues
                .numericalfs[0];
        let d3 =
            stateVariables[await resolvePathToNodeIdx("d3")].stateValues
                .numericalfs[0];
        let d4 =
            stateVariables[await resolvePathToNodeIdx("d4")].stateValues
                .numericalfs[0];

        // make sure we don't get within dx of a grid point
        for (let x = -10.02412412; x <= 10; x += 0.5) {
            let f0 = f(x);
            let f1 = f(x + dx);
            let fp05 = d1(x + dx / 2);
            expect(fp05).closeTo((f1 - f0) / dx, 1e-6);

            let fpn05 = d1(x - dx / 2);
            let fpp0 = d2(x);
            expect(fpp0).closeTo((fp05 - fpn05) / dx, 1e-6);

            let fpp1 = d2(x + dx);
            let fppp05 = d3(x + dx / 2);
            expect(fppp05).closeTo((fpp1 - fpp0) / dx, 1e-6);

            let fpppn05 = d3(x - dx / 2);
            let fpppp0 = d4(x);
            expect(fpppp0).closeTo((fppp05 - fpppn05) / dx, 1e-6);
        }
    });

    it("derivatives of interpolated function that is not a function", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
      <graph>
        <function through='(3,4) (3,5)' name="f" />
        <derivative name="df">$f</derivative>
      </graph>

      <p name="p1">f(3) = $$f(3)</p>
      <p name="p2">f'(3) = $$df(3)</p>


      `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("p1")].stateValues.text,
        ).eq("f(3) = NaN");
        expect(
            stateVariables[await resolvePathToNodeIdx("p2")].stateValues.text,
        ).eq("f'(3) = NaN");

        let f =
            stateVariables[await resolvePathToNodeIdx("f")].stateValues
                .numericalfs[0];
        let df =
            stateVariables[await resolvePathToNodeIdx("df")].stateValues
                .numericalfs[0];
        expect(f(3)).eqls(NaN);
        expect(df(3)).eqls(NaN);
    });

    it("derivatives of interpolated function specified with variables", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
      <function name="f" variables="x" maxima="(5,-3)" minima="(-5,3)" />
      <function name="g" styleNumber="2" variable="y" minima="(3,-9)" maxima="(-3,9)" />
    
      <derivative name="df1">$f</derivative>
      <derivative name="dg1" styleNumber="2">$g</derivative>
    
      <derivative name="df1b" derivVariables="x">$f</derivative>
      <derivative name="zero1" derivVariable="x" styleNumber="2">$g</derivative>
    
      <derivative name="zero2" derivVariables="y">$f</derivative>
      <derivative name="dg1b" derivVariable="y" styleNumber="2">$g</derivative>
    
      <derivative name="df2" derivVariables="x x">$f</derivative>
      <derivative name="dg2" derivVariables="y y" styleNumber="2">$g</derivative>

      <derivative name="zero3" derivVariables="x y">$f</derivative>
      <derivative name="zero4" derivVariables="x y" styleNumber="2">$g</derivative>

      <derivative name="zero5" derivVariables="y x">$f</derivative>
      <derivative name="zero6" derivVariables="y x" styleNumber="2">$g</derivative>

      <derivative name="df3" derivVariables="x x x">$f</derivative>
      <derivative name="dg3" derivVariables="y y y" styleNumber="2">$g</derivative>
    
      <derivative name="df4" derivVariables="x x x x">$f</derivative>
      <derivative name="dg4" derivVariables="y y y y" styleNumber="2">$g</derivative>
      
      `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        let dx = 0.0001;

        let f =
            stateVariables[await resolvePathToNodeIdx("f")].stateValues
                .numericalfs[0];
        let df1 =
            stateVariables[await resolvePathToNodeIdx("df1")].stateValues
                .numericalfs[0];
        let df1b =
            stateVariables[await resolvePathToNodeIdx("df1b")].stateValues
                .numericalfs[0];
        let df2 =
            stateVariables[await resolvePathToNodeIdx("df2")].stateValues
                .numericalfs[0];
        let df3 =
            stateVariables[await resolvePathToNodeIdx("df3")].stateValues
                .numericalfs[0];
        let df4 =
            stateVariables[await resolvePathToNodeIdx("df4")].stateValues
                .numericalfs[0];
        let g =
            stateVariables[await resolvePathToNodeIdx("g")].stateValues
                .numericalfs[0];
        let dg1 =
            stateVariables[await resolvePathToNodeIdx("dg1")].stateValues
                .numericalfs[0];
        let dg1b =
            stateVariables[await resolvePathToNodeIdx("dg1b")].stateValues
                .numericalfs[0];
        let dg2 =
            stateVariables[await resolvePathToNodeIdx("dg2")].stateValues
                .numericalfs[0];
        let dg3 =
            stateVariables[await resolvePathToNodeIdx("dg3")].stateValues
                .numericalfs[0];
        let dg4 =
            stateVariables[await resolvePathToNodeIdx("dg4")].stateValues
                .numericalfs[0];
        let zero1 =
            stateVariables[await resolvePathToNodeIdx("zero1")].stateValues
                .numericalfs[0];
        let zero2 =
            stateVariables[await resolvePathToNodeIdx("zero2")].stateValues
                .numericalfs[0];
        let zero3 =
            stateVariables[await resolvePathToNodeIdx("zero3")].stateValues
                .numericalfs[0];
        let zero4 =
            stateVariables[await resolvePathToNodeIdx("zero4")].stateValues
                .numericalfs[0];
        let zero5 =
            stateVariables[await resolvePathToNodeIdx("zero5")].stateValues
                .numericalfs[0];
        let zero6 =
            stateVariables[await resolvePathToNodeIdx("zero6")].stateValues
                .numericalfs[0];

        // make sure we don't get within dx of a grid point
        for (let x = -10.02412412; x <= 10; x += 0.5) {
            let f_0 = f(x);
            let f_1 = f(x + dx);
            let df1_05 = df1(x + dx / 2);
            let df1b_05 = df1b(x + dx / 2);
            expect(df1_05).closeTo((f_1 - f_0) / dx, 1e-6);
            expect(df1b_05).eq(df1_05);

            let g_0 = g(x);
            let g_1 = g(x + dx);
            let dg1_05 = dg1(x + dx / 2);
            let dg1b_05 = dg1b(x + dx / 2);
            expect(dg1_05).closeTo((g_1 - g_0) / dx, 1e-6);
            expect(dg1b_05).eq(dg1_05);

            let df1_n05 = df1(x - dx / 2);
            let df2_0 = df2(x);
            expect(df2_0).closeTo((df1b_05 - df1_n05) / dx, 1e-6);

            let dg1_n05 = dg1(x - dx / 2);
            let dg2_0 = dg2(x);
            expect(dg2_0).closeTo((dg1b_05 - dg1_n05) / dx, 1e-6);

            let df2_1 = df2(x + dx);
            let df3_05 = df3(x + dx / 2);
            expect(df3_05).closeTo((df2_1 - df2_0) / dx, 1e-6);

            let dg2_1 = dg2(x + dx);
            let dg3_05 = dg3(x + dx / 2);
            expect(dg3_05).closeTo((dg2_1 - dg2_0) / dx, 1e-6);

            let df3_n05 = df3(x - dx / 2);
            let df4_0 = df4(x);
            expect(df4_0).closeTo((df3_05 - df3_n05) / dx, 1e-6);

            let dg3_n05 = dg3(x - dx / 2);
            let dg4_0 = dg4(x);
            expect(dg4_0).closeTo((dg3_05 - dg3_n05) / dx, 1e-6);

            expect(zero1(x)).eq(0);
            expect(zero2(x)).eq(0);
            expect(zero3(x)).eq(0);
            expect(zero4(x)).eq(0);
            expect(zero5(x)).eq(0);
            expect(zero6(x)).eq(0);
        }
    });

    it("derivatives of interpolated function with changed variables", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
      <function name="f" variables="x" maxima="(5,-3)" minima="(-5,3)" />
      <function name="g" styleNumber="2" variable="y" >$f</function>
      <function name="h" styleNumber="3" variables="z" >$g</function>
    
      <derivative name="df1">$f</derivative>
      <derivative name="dg1" styleNumber="2">$g</derivative>
      <derivative name="dh1" styleNumber="3">$h</derivative>
    
      <derivative name="df1b" derivVariable="x">$f</derivative>
      <derivative name="zero1" derivVariables="x" styleNumber="2">$g</derivative>
      <derivative name="zero2" derivVariable="x" styleNumber="3">$h</derivative>
    
      <derivative name="zero3" derivVariables="y">$f</derivative>
      <derivative name="dg1b" derivVariable="y" styleNumber="2">$g</derivative>
      <derivative name="zero4" derivVariables="y" styleNumber="3">$h</derivative>
    
      <derivative name="zero5" derivVariable="z">$f</derivative>
      <derivative name="zero6" derivVariables="z" styleNumber="2">$g</derivative>
      <derivative name="dh1b" derivVariable="z" styleNumber="3">$h</derivative>

      <derivative name="df2" derivVariables="x x">$f</derivative>
      <derivative name="dg2" derivVariables="y y" styleNumber="2">$g</derivative>
      <derivative name="dh2" derivVariables="z z" styleNumber="3">$h</derivative>
    
      <derivative name="df2b" derivVariable="x"><derivative derivVariable="x">$f</derivative></derivative>
      <derivative name="dg2b" derivVariables="y" styleNumber="2"><derivative derivVariables="y">$g</derivative></derivative>
      <derivative name="dh2b" derivVariables="z" styleNumber="3"><derivative derivVariable="z">$h</derivative></derivative>

      <derivative name="zero7" derivVariables="x y">$f</derivative>
      <derivative name="zero8" derivVariables="x y" styleNumber="2">$g</derivative>
      <derivative name="zero9" derivVariables="x y" styleNumber="3">$h</derivative>

      <derivative name="zero10" derivVariables="y x">$f</derivative>
      <derivative name="zero11" derivVariables="y x" styleNumber="2">$g</derivative>
      <derivative name="zero12" derivVariables="y x" styleNumber="3">$h</derivative>

      <derivative name="df3" derivVariables="x x x">$f</derivative>
      <derivative name="dg3" derivVariables="y y y" styleNumber="2">$g</derivative>
      <derivative name="dh3" derivVariables="z z z" styleNumber="2">$h</derivative>
    
      <derivative name="df4" derivVariables="x x x x">$f</derivative>
      <derivative name="dg4" derivVariables="y y y y" styleNumber="2">$g</derivative>
      <derivative name="dh4" derivVariables="z z z z" styleNumber="2">$h</derivative>

      <number name="dx">0.0001</number>
      <setup><sequence name="s" from="-10.02412412" to="10" step="3.1" /></setup>
      <repeat for="$s" valueName="x" name="ts">
          <p><evaluate function="$(f)" input="$x" name="f_0" />
          <evaluate function="$(df1)" input="$x+$(dx)/2" name="df1_05" />
          <evaluate function="$(df1b)" input="$x+$(dx)/2" name="df1b_05" />
          <evaluate function="$(df2)" input="$x" name="df2_0" />
          <evaluate function="$(df2b)" input="$x" name="df2b_0" />
          <evaluate function="$(df3)" input="$x+$(dx)/2" name="df3_05" />
          <evaluate function="$(df4)" input="$x" name="df4_0" />
          
          <evaluate function="$(g)" input="$x" name="g_0" />
          <evaluate function="$(dg1)" input="$x+$(dx)/2" name="dg1_05" />
          <evaluate function="$(dg1b)" input="$x+$(dx)/2" name="dg1b_05" />
          <evaluate function="$(dg2)" input="$x" name="dg2_0" />
          <evaluate function="$(dg2b)" input="$x" name="dg2b_0" />
          <evaluate function="$(dg3)" input="$x+$(dx)/2" name="dg3_05" />
          <evaluate function="$(dg4)" input="$x" name="dg4_0" />

          <evaluate function="$(h)" input="$x" name="h_0" />
          <evaluate function="$(dh1)" input="$x+$(dx)/2" name="dh1_05" />
          <evaluate function="$(dh1b)" input="$x+$(dx)/2" name="dh1b_05" />
          <evaluate function="$(dh2)" input="$x" name="dh2_0" />
          <evaluate function="$(dh2b)" input="$x" name="dh2b_0" />
          <evaluate function="$(dh3)" input="$x+$(dx)/2" name="dh3_05" />
          <evaluate function="$(dh4)" input="$x" name="dh4_0" /></p>
      </repeat>
      
      `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        let dx = 0.0001;

        let f =
            stateVariables[await resolvePathToNodeIdx("f")].stateValues
                .numericalfs[0];
        let df1 =
            stateVariables[await resolvePathToNodeIdx("df1")].stateValues
                .numericalfs[0];
        let df1b =
            stateVariables[await resolvePathToNodeIdx("df1b")].stateValues
                .numericalfs[0];
        let df2 =
            stateVariables[await resolvePathToNodeIdx("df2")].stateValues
                .numericalfs[0];
        let df2b =
            stateVariables[await resolvePathToNodeIdx("df2b")].stateValues
                .numericalfs[0];
        let df3 =
            stateVariables[await resolvePathToNodeIdx("df3")].stateValues
                .numericalfs[0];
        let df4 =
            stateVariables[await resolvePathToNodeIdx("df4")].stateValues
                .numericalfs[0];
        let g =
            stateVariables[await resolvePathToNodeIdx("g")].stateValues
                .numericalfs[0];
        let dg1 =
            stateVariables[await resolvePathToNodeIdx("dg1")].stateValues
                .numericalfs[0];
        let dg1b =
            stateVariables[await resolvePathToNodeIdx("dg1b")].stateValues
                .numericalfs[0];
        let dg2 =
            stateVariables[await resolvePathToNodeIdx("dg2")].stateValues
                .numericalfs[0];
        let dg2b =
            stateVariables[await resolvePathToNodeIdx("dg2b")].stateValues
                .numericalfs[0];
        let dg3 =
            stateVariables[await resolvePathToNodeIdx("dg3")].stateValues
                .numericalfs[0];
        let dg4 =
            stateVariables[await resolvePathToNodeIdx("dg4")].stateValues
                .numericalfs[0];
        let h =
            stateVariables[await resolvePathToNodeIdx("h")].stateValues
                .numericalfs[0];
        let dh1 =
            stateVariables[await resolvePathToNodeIdx("dh1")].stateValues
                .numericalfs[0];
        let dh1b =
            stateVariables[await resolvePathToNodeIdx("dh1b")].stateValues
                .numericalfs[0];
        let dh2 =
            stateVariables[await resolvePathToNodeIdx("dh2")].stateValues
                .numericalfs[0];
        let dh2b =
            stateVariables[await resolvePathToNodeIdx("dh2b")].stateValues
                .numericalfs[0];
        let dh3 =
            stateVariables[await resolvePathToNodeIdx("dh3")].stateValues
                .numericalfs[0];
        let dh4 =
            stateVariables[await resolvePathToNodeIdx("dh4")].stateValues
                .numericalfs[0];
        let zero1 =
            stateVariables[await resolvePathToNodeIdx("zero1")].stateValues
                .numericalfs[0];
        let zero2 =
            stateVariables[await resolvePathToNodeIdx("zero2")].stateValues
                .numericalfs[0];
        let zero3 =
            stateVariables[await resolvePathToNodeIdx("zero3")].stateValues
                .numericalfs[0];
        let zero4 =
            stateVariables[await resolvePathToNodeIdx("zero4")].stateValues
                .numericalfs[0];
        let zero5 =
            stateVariables[await resolvePathToNodeIdx("zero5")].stateValues
                .numericalfs[0];
        let zero6 =
            stateVariables[await resolvePathToNodeIdx("zero6")].stateValues
                .numericalfs[0];
        let zero7 =
            stateVariables[await resolvePathToNodeIdx("zero7")].stateValues
                .numericalfs[0];
        let zero8 =
            stateVariables[await resolvePathToNodeIdx("zero8")].stateValues
                .numericalfs[0];
        let zero9 =
            stateVariables[await resolvePathToNodeIdx("zero9")].stateValues
                .numericalfs[0];
        let zero10 =
            stateVariables[await resolvePathToNodeIdx("zero10")].stateValues
                .numericalfs[0];
        let zero11 =
            stateVariables[await resolvePathToNodeIdx("zero11")].stateValues
                .numericalfs[0];
        let zero12 =
            stateVariables[await resolvePathToNodeIdx("zero12")].stateValues
                .numericalfs[0];

        let i = 0;

        // make sure we don't get within dx of a grid point
        for (let x = -10.02412412; x <= 10; x += 3.1) {
            i++;

            //console.log({ i });
            let f_0 = f(x);
            let f_1 = f(x + dx);
            let df1_05 = df1(x + dx / 2);
            let df1b_05 = df1b(x + dx / 2);
            expect(df1_05).closeTo((f_1 - f_0) / dx, 1e-6);
            expect(df1b_05).eq(df1_05);

            let f_0a =
                stateVariables[await resolvePathToNodeIdx(`ts[${i}].f_0`)]
                    .stateValues.value.tree;
            expect(f_0a).closeTo(f_0, 1e-10);
            let df1_05a =
                stateVariables[await resolvePathToNodeIdx(`ts[${i}].df1_05`)]
                    .stateValues.value.tree;
            expect(df1_05a).closeTo(df1_05, 1e-10);
            let df1b_05a =
                stateVariables[await resolvePathToNodeIdx(`ts[${i}].df1b_05`)]
                    .stateValues.value.tree;
            expect(df1b_05a).closeTo(df1b_05, 1e-10);

            let g_0 = g(x);
            let g_1 = g(x + dx);
            expect(g_0).eq(f_0);
            expect(g_1).eq(f_1);
            let dg1_05 = dg1(x + dx / 2);
            let dg1b_05 = dg1b(x + dx / 2);
            expect(dg1_05).closeTo((g_1 - g_0) / dx, 1e-6);
            expect(dg1b_05).eq(dg1_05);

            let g_0a =
                stateVariables[await resolvePathToNodeIdx(`ts[${i}].g_0`)]
                    .stateValues.value.tree;
            expect(g_0a).closeTo(f_0, 1e-10);
            let dg1_05a =
                stateVariables[await resolvePathToNodeIdx(`ts[${i}].dg1_05`)]
                    .stateValues.value.tree;
            expect(dg1_05a).closeTo(df1_05, 1e-10);
            let dg1b_05a =
                stateVariables[await resolvePathToNodeIdx(`ts[${i}].dg1b_05`)]
                    .stateValues.value.tree;
            expect(dg1b_05a).closeTo(df1b_05, 1e-10);

            let h_0 = h(x);
            let h_1 = h(x + dx);
            expect(h_0).eq(f_0);
            expect(h_1).eq(f_1);
            let dh1_05 = dh1(x + dx / 2);
            let dh1b_05 = dh1b(x + dx / 2);
            expect(dh1_05).closeTo((h_1 - h_0) / dx, 1e-6);
            expect(dh1b_05).eq(dh1_05);

            let h_0a =
                stateVariables[await resolvePathToNodeIdx(`ts[${i}].h_0`)]
                    .stateValues.value.tree;
            expect(h_0a).closeTo(f_0, 1e-10);
            let dh1_05a =
                stateVariables[await resolvePathToNodeIdx(`ts[${i}].dh1_05`)]
                    .stateValues.value.tree;
            expect(dh1_05a).closeTo(df1_05, 1e-10);
            let dh1b_05a =
                stateVariables[await resolvePathToNodeIdx(`ts[${i}].dh1b_05`)]
                    .stateValues.value.tree;
            expect(dh1b_05a).closeTo(df1b_05, 1e-10);

            let df1_n05 = df1(x - dx / 2);
            let df2_0 = df2(x);
            expect(df2_0).closeTo((df1b_05 - df1_n05) / dx, 1e-6);

            let df2_0a =
                stateVariables[await resolvePathToNodeIdx(`ts[${i}].df2_0`)]
                    .stateValues.value.tree;
            expect(df2_0a).closeTo(df2_0, 1e-10);

            let dg2_0 = dg2(x);
            expect(dg2_0).eq(df2_0);

            let dg2_0a =
                stateVariables[await resolvePathToNodeIdx(`ts[${i}].dg2_0`)]
                    .stateValues.value.tree;
            expect(dg2_0a).closeTo(df2_0, 1e-10);

            let dh2_0 = dh2(x);
            expect(dh2_0).eq(df2_0);

            let dh2_0a =
                stateVariables[await resolvePathToNodeIdx(`ts[${i}].dh2_0`)]
                    .stateValues.value.tree;
            expect(dh2_0a).closeTo(df2_0, 1e-10);

            let df2b_0 = df2b(x);
            expect(df2b_0).eq(df2_0);

            let df2b_0a =
                stateVariables[await resolvePathToNodeIdx(`ts[${i}].df2b_0`)]
                    .stateValues.value.tree;
            expect(df2b_0a).closeTo(df2b_0, 1e-10);

            let dg2b_0 = dg2b(x);
            expect(dg2b_0).eq(dg2_0);

            let dg2b_0a =
                stateVariables[await resolvePathToNodeIdx(`ts[${i}].dg2b_0`)]
                    .stateValues.value.tree;
            expect(dg2b_0a).closeTo(df2b_0, 1e-10);

            let dh2b_0 = dh2b(x);
            expect(dh2b_0).eq(dh2_0);

            let dh2b_0a =
                stateVariables[await resolvePathToNodeIdx(`ts[${i}].dh2b_0`)]
                    .stateValues.value.tree;
            expect(dh2b_0a).closeTo(df2b_0, 1e-10);

            let df2_1 = df2(x + dx);
            let df3_05 = df3(x + dx / 2);
            expect(df3_05).closeTo((df2_1 - df2_0) / dx, 1e-6);

            let df3_05a =
                stateVariables[await resolvePathToNodeIdx(`ts[${i}].df3_05`)]
                    .stateValues.value.tree;
            expect(df3_05a).closeTo(df3_05, 1e-10);

            let dg3_05 = dg3(x + dx / 2);
            expect(dg3_05).eq(df3_05);

            let dg3_05a =
                stateVariables[await resolvePathToNodeIdx(`ts[${i}].dg3_05`)]
                    .stateValues.value.tree;
            expect(dg3_05a).closeTo(df3_05, 1e-10);

            let dh3_05 = dh3(x + dx / 2);
            expect(dh3_05).eq(df3_05);

            let dh3_05a =
                stateVariables[await resolvePathToNodeIdx(`ts[${i}].dh3_05`)]
                    .stateValues.value.tree;
            expect(dh3_05a).closeTo(df3_05, 1e-10);

            let df3_n05 = df3(x - dx / 2);
            let df4_0 = df4(x);
            expect(df4_0).closeTo((df3_05 - df3_n05) / dx, 1e-6);

            let df4_0a =
                stateVariables[await resolvePathToNodeIdx(`ts[${i}].df4_0`)]
                    .stateValues.value.tree;
            expect(df4_0a).closeTo(df4_0, 1e-10);

            let dg4_0 = dg4(x);
            expect(dg4_0).eq(df4_0);

            let dg4_0a =
                stateVariables[await resolvePathToNodeIdx(`ts[${i}].dg4_0`)]
                    .stateValues.value.tree;
            expect(dg4_0a).closeTo(df4_0, 1e-10);

            let dh4_0 = dh4(x);
            expect(dh4_0).eq(df4_0);

            let dh4_0a =
                stateVariables[await resolvePathToNodeIdx(`ts[${i}].dh4_0`)]
                    .stateValues.value.tree;
            expect(dh4_0a).closeTo(df4_0, 1e-10);

            expect(zero1(x)).eq(0);
            expect(zero2(x)).eq(0);
            expect(zero3(x)).eq(0);
            expect(zero4(x)).eq(0);
            expect(zero5(x)).eq(0);
            expect(zero6(x)).eq(0);
            expect(zero7(x)).eq(0);
            expect(zero8(x)).eq(0);
            expect(zero9(x)).eq(0);
            expect(zero10(x)).eq(0);
            expect(zero11(x)).eq(0);
            expect(zero12(x)).eq(0);
        }
    });

    it("derivatives of interpolated function with changed variables, subscript", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
      <function name="f" variable="x_1" maxima="(5,-3)" minima="(-5,3)" />
      <function name="g" styleNumber="2" variables="x_2" >$f</function>
    
      <derivative name="df1">$f</derivative>
      <derivative name="dg1" styleNumber="2">$g</derivative>
    
      <derivative name="df1b" derivVariable="x_1">$f</derivative>
      <derivative name="zero1" derivVariables="x_1" styleNumber="2">$g</derivative>
    
      <derivative name="zero2" derivVariables="x_2">$f</derivative>
      <derivative name="dg1b" derivVariable="x_2" styleNumber="2">$g</derivative>
    
      <derivative name="df2" derivVariables="x_1 x_1">$f</derivative>
      <derivative name="dg2" derivVariables="x_2 x_2" styleNumber="2">$g</derivative>
    
      <derivative name="df2b" derivVariable="x_1"><derivative derivVariable="x_1">$f</derivative></derivative>
      <derivative name="dg2b" derivVariables="x_2" styleNumber="2"><derivative derivVariables="x_2">$g</derivative></derivative>

      <derivative name="zero3" derivVariables="x_1 x_2">$f</derivative>
      <derivative name="zero4" derivVariables="x_1 x_2" styleNumber="2">$g</derivative>

      <derivative name="zero5" derivVariables="x_2 x_1">$f</derivative>
      <derivative name="zero6" derivVariables="x_2 x_1" styleNumber="2">$g</derivative>

      <derivative name="df3" derivVariables="x_1 x_1 x_1">$f</derivative>
      <derivative name="dg3" derivVariables="x_2 x_2 x_2" styleNumber="2">$g</derivative>
    
      <derivative name="df4" derivVariables="x_1 x_1 x_1 x_1">$f</derivative>
      <derivative name="dg4" derivVariables="x_2 x_2 x_2 x_2" styleNumber="2">$g</derivative>
    
      `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        let dx = 0.0001;

        let f =
            stateVariables[await resolvePathToNodeIdx("f")].stateValues
                .numericalfs[0];
        let df1 =
            stateVariables[await resolvePathToNodeIdx("df1")].stateValues
                .numericalfs[0];
        let df1b =
            stateVariables[await resolvePathToNodeIdx("df1b")].stateValues
                .numericalfs[0];
        let df2 =
            stateVariables[await resolvePathToNodeIdx("df2")].stateValues
                .numericalfs[0];
        let df2b =
            stateVariables[await resolvePathToNodeIdx("df2b")].stateValues
                .numericalfs[0];
        let df3 =
            stateVariables[await resolvePathToNodeIdx("df3")].stateValues
                .numericalfs[0];
        let df4 =
            stateVariables[await resolvePathToNodeIdx("df4")].stateValues
                .numericalfs[0];
        let g =
            stateVariables[await resolvePathToNodeIdx("g")].stateValues
                .numericalfs[0];
        let dg1 =
            stateVariables[await resolvePathToNodeIdx("dg1")].stateValues
                .numericalfs[0];
        let dg1b =
            stateVariables[await resolvePathToNodeIdx("dg1b")].stateValues
                .numericalfs[0];
        let dg2 =
            stateVariables[await resolvePathToNodeIdx("dg2")].stateValues
                .numericalfs[0];
        let dg2b =
            stateVariables[await resolvePathToNodeIdx("dg2b")].stateValues
                .numericalfs[0];
        let dg3 =
            stateVariables[await resolvePathToNodeIdx("dg3")].stateValues
                .numericalfs[0];
        let dg4 =
            stateVariables[await resolvePathToNodeIdx("dg4")].stateValues
                .numericalfs[0];
        let zero1 =
            stateVariables[await resolvePathToNodeIdx("zero1")].stateValues
                .numericalfs[0];
        let zero2 =
            stateVariables[await resolvePathToNodeIdx("zero2")].stateValues
                .numericalfs[0];
        let zero3 =
            stateVariables[await resolvePathToNodeIdx("zero3")].stateValues
                .numericalfs[0];
        let zero4 =
            stateVariables[await resolvePathToNodeIdx("zero4")].stateValues
                .numericalfs[0];
        let zero5 =
            stateVariables[await resolvePathToNodeIdx("zero5")].stateValues
                .numericalfs[0];
        let zero6 =
            stateVariables[await resolvePathToNodeIdx("zero6")].stateValues
                .numericalfs[0];

        // make sure we don't get within dx of a grid point
        for (let x = -10.02412412; x <= 10; x += 0.5) {
            let f_0 = f(x);
            let f_1 = f(x + dx);
            let df1_05 = df1(x + dx / 2);
            let df1b_05 = df1b(x + dx / 2);
            expect(df1_05).closeTo((f_1 - f_0) / dx, 1e-6);
            expect(df1b_05).eq(df1_05);

            let dg1_05 = dg1(x + dx / 2);
            let dg1b_05 = dg1b(x + dx / 2);
            expect(dg1_05).eq(dg1_05);
            expect(dg1b_05).eq(dg1_05);

            let df1_n05 = df1(x - dx / 2);
            let df2_0 = df2(x);
            expect(df2_0).closeTo((df1b_05 - df1_n05) / dx, 1e-6);

            let dg2_0 = dg2(x);
            expect(dg2_0).eq(df2_0);

            let df2b_0 = df2b(x);
            expect(df2b_0).eq(df2_0);

            let dg2b_0 = dg2b(x);
            expect(dg2b_0).eq(dg2_0);

            let df2_1 = df2(x + dx);
            let df3_05 = df3(x + dx / 2);
            expect(df3_05).closeTo((df2_1 - df2_0) / dx, 1e-6);

            let dg3_05 = dg3(x + dx / 2);
            expect(dg3_05).eq(df3_05);

            let df3_n05 = df3(x - dx / 2);
            let df4_0 = df4(x);
            expect(df4_0).closeTo((df3_05 - df3_n05) / dx, 1e-6);

            let dg4_0 = dg4(x);
            expect(dg4_0).eq(df4_0);

            expect(zero1(x)).eq(0);
            expect(zero2(x)).eq(0);
            expect(zero3(x)).eq(0);
            expect(zero4(x)).eq(0);
            expect(zero5(x)).eq(0);
            expect(zero6(x)).eq(0);
        }
    });

    it("extrema of derivative", { timeout: 200000 }, async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p><m>c_1 =</m> <mathInput name="c_1" prefill="1" /></p>
    <p><m>c_2 =</m> <mathInput name="c_2" prefill="1" /></p>
    <p><m>c_3 =</m> <mathInput name="c_3" prefill="3" /></p>
    <p><m>c_4 =</m> <mathInput name="c_4" prefill="4" /></p>
    <p><m>c_5 =</m> <mathInput name="c_5" prefill="5" /></p>
    <p><m>c_6 =</m> <mathInput name="c_6" prefill="1" /></p>
    <p><m>x =</m> <mathInput name="x" prefill="x" /></p>

    <math hide name="formula" simplify>
      $c_1 $x^5/20 - $c_1($c_2+$c_3+$c_4) $x^4/12
      + $c_1($c_2*$c_3 + $c_2 $c_4 + $c_3$c_4)$x^3/6
      - $c_1$c_2$c_3$c_4$x^2/2 + $c_5$x + $c_6
    </math>

    <p><m>f($x) =
    <function name="f" variable="$x">$formula</function>
    </m></p>

    <p><m>f'($x) =
    <derivative name="fp">$f</derivative>
    </m></p>

    <p>again, <m>f'($x) = <derivative extend="$fp" name="fp2" />
    </m></p>

    <p>Number of minima of f': <number extend="$fp.numMinima" name="nMinima" /></p>
    <p>Minima of f': <mathList displayDecimals="5" name="min" extend="$fp.minima" /></p> 

    <p>Number of maxima of f': <number extend="$fp.numMaxima" name="nMaxima" /></p>
    <p>Maxima of f': <mathList displayDecimals="5" name="max" extend="$fp.maxima" /></p> 

    <p>To repeat:</p>
    <p>Number of minima of f': <number extend="$fp2.numMinima" name="nMinima2" /></p>
    <p>Minima of f': <mathList displayDecimals="5" name="min2" extend="$fp2.minima" /></p> 

    <p>Number of maxima of f': <number extend="$fp2.numMaxima" name="nMaxima2" /></p>
    <p>Maxima of f': <mathList displayDecimals="5" name="max2" extend="$fp2.maxima" /></p> 

    `,
        });

        function fp(
            x: number,
            c1: number,
            c2: number,
            c3: number,
            c4: number,
            c5: number,
        ) {
            return (
                (c1 * x ** 4) / 4 -
                (c1 * (c2 + c3 + c4) * x ** 3) / 3 +
                (c1 * (c2 * c3 + c2 * c4 + c3 * c4) * x ** 2) / 2 -
                c1 * c2 * c3 * c4 * x +
                c5
            );
        }

        function fpMinima(
            c1: number,
            c2: number,
            c3: number,
            c4: number,
            c5: number,
        ) {
            let extrema = [c2, c3, c4].sort((a, b) => a - b);
            let minima: number[][] = [];
            if (c1 > 0) {
                minima.push([extrema[0], fp(extrema[0], c1, c2, c3, c4, c5)]);
                minima.push([extrema[2], fp(extrema[2], c1, c2, c3, c4, c5)]);
            } else {
                minima.push([extrema[1], fp(extrema[1], c1, c2, c3, c4, c5)]);
            }
            return minima;
        }

        function fpMaxima(
            c1: number,
            c2: number,
            c3: number,
            c4: number,
            c5: number,
        ) {
            let extrema = [c2, c3, c4].sort((a, b) => a - b);
            let maxima: number[][] = [];
            if (c1 > 0) {
                maxima.push([extrema[1], fp(extrema[1], c1, c2, c3, c4, c5)]);
            } else {
                maxima.push([extrema[0], fp(extrema[0], c1, c2, c3, c4, c5)]);
                maxima.push([extrema[2], fp(extrema[2], c1, c2, c3, c4, c5)]);
            }
            return maxima;
        }

        async function verifyExtrema(c1, c2, c3, c4, c5) {
            let minima = fpMinima(c1, c2, c3, c4, c5);
            let nMinima = minima.length;
            let maxima = fpMaxima(c1, c2, c3, c4, c5);
            let nMaxima = maxima.length;

            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );

            expect(
                stateVariables[await resolvePathToNodeIdx("nMinima")]
                    .stateValues.value,
            ).eq(nMinima);
            expect(
                stateVariables[await resolvePathToNodeIdx("nMinima2")]
                    .stateValues.value,
            ).eq(nMinima);

            expect(
                stateVariables[await resolvePathToNodeIdx("min[1]")].stateValues
                    .text,
            ).eq(`( ${minima[0][0]}, ${me.math.round(minima[0][1], 5)} )`);
            expect(
                stateVariables[await resolvePathToNodeIdx("min2[1]")]
                    .stateValues.text,
            ).eq(`( ${minima[0][0]}, ${me.math.round(minima[0][1], 5)} )`);
            if (nMinima === 2) {
                expect(
                    stateVariables[await resolvePathToNodeIdx("min[2]")]
                        .stateValues.text,
                ).eq(`( ${minima[1][0]}, ${me.math.round(minima[1][1], 5)} )`);
                expect(
                    stateVariables[await resolvePathToNodeIdx("min2[2]")]
                        .stateValues.text,
                ).eq(`( ${minima[1][0]}, ${me.math.round(minima[1][1], 5)} )`);
            } else {
                expect(stateVariables[await resolvePathToNodeIdx("min[2]")]).eq(
                    undefined,
                );
                expect(
                    stateVariables[await resolvePathToNodeIdx("min2[2]")],
                ).eq(undefined);
            }

            expect(
                stateVariables[await resolvePathToNodeIdx("nMaxima")]
                    .stateValues.value,
            ).eq(nMaxima);
            expect(
                stateVariables[await resolvePathToNodeIdx("nMaxima2")]
                    .stateValues.value,
            ).eq(nMaxima);

            expect(
                stateVariables[await resolvePathToNodeIdx("max[1]")].stateValues
                    .text,
            ).eq(`( ${maxima[0][0]}, ${me.math.round(maxima[0][1], 5)} )`);
            expect(
                stateVariables[await resolvePathToNodeIdx("max2[1]")]
                    .stateValues.text,
            ).eq(`( ${maxima[0][0]}, ${me.math.round(maxima[0][1], 5)} )`);
            if (nMaxima === 2) {
                expect(
                    stateVariables[await resolvePathToNodeIdx("max[2]")]
                        .stateValues.text,
                ).eq(`( ${maxima[1][0]}, ${me.math.round(maxima[1][1], 5)} )`);
                expect(
                    stateVariables[await resolvePathToNodeIdx("max2[2]")]
                        .stateValues.text,
                ).eq(`( ${maxima[1][0]}, ${me.math.round(maxima[1][1], 5)} )`);
            } else {
                expect(stateVariables[await resolvePathToNodeIdx("max[2]")]).eq(
                    undefined,
                );
                expect(
                    stateVariables[await resolvePathToNodeIdx("max2[2]")],
                ).eq(undefined);
            }
        }

        let c1 = 1,
            c2 = 1,
            c3 = 3,
            c4 = 4,
            c5 = 5,
            c6 = 1,
            v = "x";

        await verifyExtrema(c1, c2, c3, c4, c5);

        c1 = 3;
        await updateMathInputValue({
            latex: c1.toString(),
            componentIdx: await resolvePathToNodeIdx("c_1"),
            core,
        });
        await verifyExtrema(c1, c2, c3, c4, c5);

        c2 = -5;
        await updateMathInputValue({
            latex: c2.toString(),
            componentIdx: await resolvePathToNodeIdx("c_2"),
            core,
        });
        await verifyExtrema(c1, c2, c3, c4, c5);

        c3 = 1;
        await updateMathInputValue({
            latex: c3.toString(),
            componentIdx: await resolvePathToNodeIdx("c_3"),
            core,
        });
        await verifyExtrema(c1, c2, c3, c4, c5);

        c4 = -6;
        await updateMathInputValue({
            latex: c4.toString(),
            componentIdx: await resolvePathToNodeIdx("c_4"),
            core,
        });
        await verifyExtrema(c1, c2, c3, c4, c5);

        c5 = 3;
        await updateMathInputValue({
            latex: c5.toString(),
            componentIdx: await resolvePathToNodeIdx("c_5"),
            core,
        });
        await verifyExtrema(c1, c2, c3, c4, c5);

        c6 = 2;
        await updateMathInputValue({
            latex: c6.toString(),
            componentIdx: await resolvePathToNodeIdx("c_6"),
            core,
        });
        await verifyExtrema(c1, c2, c3, c4, c5);

        v = "y";
        await updateMathInputValue({
            latex: v,
            componentIdx: await resolvePathToNodeIdx("x"),
            core,
        });
        await verifyExtrema(c1, c2, c3, c4, c5);

        c1 = 2;
        await updateMathInputValue({
            latex: c1.toString(),
            componentIdx: await resolvePathToNodeIdx("c_1"),
            core,
        });
        await verifyExtrema(c1, c2, c3, c4, c5);

        c2 = 4;
        await updateMathInputValue({
            latex: c2.toString(),
            componentIdx: await resolvePathToNodeIdx("c_2"),
            core,
        });
        await verifyExtrema(c1, c2, c3, c4, c5);

        c3 = -8;
        await updateMathInputValue({
            latex: c3.toString(),
            componentIdx: await resolvePathToNodeIdx("c_3"),
            core,
        });
        await verifyExtrema(c1, c2, c3, c4, c5);

        c4 = 9;
        await updateMathInputValue({
            latex: c4.toString(),
            componentIdx: await resolvePathToNodeIdx("c_4"),
            core,
        });
        await verifyExtrema(c1, c2, c3, c4, c5);

        c5 = -2;
        await updateMathInputValue({
            latex: c5.toString(),
            componentIdx: await resolvePathToNodeIdx("c_5"),
            core,
        });
        await verifyExtrema(c1, c2, c3, c4, c5);

        c6 = 6;
        await updateMathInputValue({
            latex: c6.toString(),
            componentIdx: await resolvePathToNodeIdx("c_6"),
            core,
        });
        await verifyExtrema(c1, c2, c3, c4, c5);

        v = "q";
        await updateMathInputValue({
            latex: v,
            componentIdx: await resolvePathToNodeIdx("x"),
            core,
        });
        await verifyExtrema(c1, c2, c3, c4, c5);
    });

    it("extrema of derivative of interpolated function", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
      <graph>
        <function name="f" minima="(-5,-3) (0,-5)" maxima="(-3,0) (6,8)" />
        <derivative name="fp">$f</derivative>
      </graph>

      <derivative extend="$fp" name="fp2" />

      <p>Number of minima of f': <number extend="$fp.numMinima" name="nMinima" /></p>
      <p>Minima of f': <mathList displayDecimals="5" name="min" extend="$fp.minima" /></p> 
  
      <p>Number of maxima of f': <number extend="$fp.numMaxima" name="nMaxima" /></p>
      <p>Maxima of f': <mathList displayDecimals="5" name="max" extend="$fp.maxima" /></p> 
  
      <p>To repeat:</p>
      <p>Number of minima of f': <number extend="$fp2.numMinima" name="nMinima2" /></p>
      <p>Minima of f': <mathList displayDecimals="5" name="min2" extend="$fp2.minima" /></p> 
  
      <p>Number of maxima of f': <number extend="$fp2.numMaxima" name="nMaxima2" /></p>
      <p>Maxima of f': <mathList displayDecimals="5" name="max2" extend="$fp2.maxima" /></p> 
  
      `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);

        let fp =
            stateVariables[await resolvePathToNodeIdx("fp")].stateValues
                .numericalfs[0];

        expect(
            stateVariables[await resolvePathToNodeIdx("nMinima")].stateValues
                .value,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("nMinima2")].stateValues
                .value,
        ).eq(1);

        expect(
            stateVariables[await resolvePathToNodeIdx("nMaxima")].stateValues
                .value,
        ).eq(2);
        expect(
            stateVariables[await resolvePathToNodeIdx("nMaxima2")].stateValues
                .value,
        ).eq(2);

        let max1x = (-5 - 3) / 2;
        expect(
            stateVariables[await resolvePathToNodeIdx("max[1]")].stateValues
                .text,
        ).eq(`( ${max1x}, ${me.math.round(fp(max1x), 5)} )`);
        expect(
            stateVariables[await resolvePathToNodeIdx("max2[1]")].stateValues
                .text,
        ).eq(`( ${max1x}, ${me.math.round(fp(max1x), 5)} )`);

        let min1x = (-3 + 0) / 2;

        expect(
            stateVariables[await resolvePathToNodeIdx("min[1]")].stateValues
                .text,
        ).eq(`( ${min1x}, ${me.math.round(fp(min1x), 5)} )`);
        expect(
            stateVariables[await resolvePathToNodeIdx("min2[1]")].stateValues
                .text,
        ).eq(`( ${min1x}, ${me.math.round(fp(min1x), 5)} )`);

        let max2x = (0 + 6) / 2;
        expect(
            stateVariables[await resolvePathToNodeIdx("max[2]")].stateValues
                .text,
        ).eq(`( ${max2x}, ${me.math.round(fp(max2x), 5)} )`);
        expect(
            stateVariables[await resolvePathToNodeIdx("max2[2]")].stateValues
                .text,
        ).eq(`( ${max2x}, ${me.math.round(fp(max2x), 5)} )`);
    });

    it("handle no child", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
      <p name="p1"><derivative name="d1" symbolic></derivative></p>
      <p name="p2"><derivative name="d2">$nothing</derivative></p>

      <p name="p3">$$d1(0)</p>
      <p name="p4">$$d2(0)</p>
      `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("p1")].stateValues.text,
        ).eq("\uff3f");
        expect(
            stateVariables[await resolvePathToNodeIdx("p2")].stateValues.text,
        ).eq("\uff3f");
        expect(
            stateVariables[await resolvePathToNodeIdx("p3")].stateValues.text,
        ).eq("NaN");
        expect(
            stateVariables[await resolvePathToNodeIdx("p4")].stateValues.text,
        ).eq("NaN");

        let d1 =
            stateVariables[await resolvePathToNodeIdx("d1")].stateValues
                .numericalfs[0];
        let d2 =
            stateVariables[await resolvePathToNodeIdx("d2")].stateValues
                .numericalfs[0];

        expect(d1(0)).eqls(NaN);
        expect(d2(0)).eqls(NaN);
    });
});
