import { describe, expect, it, vi } from "vitest";
import { createTestCore, returnAllStateVariables } from "../utils/test-core";
import {
    updateBooleanInputValue,
    updateMathInputValue,
    updateSelectedIndices,
    updateTextInputValue,
} from "../utils/actions";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

describe("Boolean tag tests", async () => {
    it("basic boolean evaluation", async () => {
        let core = await createTestCore({
            doenetML: `
    <p>
    <boolean name="t1">true</boolean>
    <boolean name="t2">trUe</boolean>
    <boolean name="t3">1</boolean>
    <boolean name="t4">10</boolean>
    <boolean name="t5">3+1>1</boolean>
    <boolean name="t6"><math>1 > 2</math> = <math>2 < 1</math></boolean>
    <boolean name="t7">not false</boolean>
    <boolean name="t8">true or false</boolean>
    <boolean name="t9">true and not false</boolean>
    <boolean name="t10">true or not false</boolean>
    <boolean name="t11">not true or not false</boolean>
    <boolean name="t12">not not true</boolean>
    <boolean name="t13">not(true and false)</boolean>
    <boolean name="t14">not(not true or false)</boolean>
    <boolean name="t15">not(not true and false)</boolean>
    <boolean name="t16">not(not true and not false)</boolean>
    <boolean name="t17">not 0</boolean>
    <boolean name="t18"><math>1</math> &lt; <math>3</math></boolean>
    <boolean name="t19">not x</boolean>
    <boolean name="t20"><math>1</math></boolean>
    <boolean name="t21">x-x+1</boolean>
    <boolean name="t22"><math>x-x+1</math></boolean>
    <boolean name="t23">xy = x*y</boolean>
    <boolean name="t24"><math>xy</math> = xy</boolean>
    <boolean name="t25"><text>hello</text> = hello</boolean>
    <boolean name="t26"><boolean>1</boolean> = true</boolean>
    <boolean name="t27"><boolean>0</boolean> = false</boolean>
    <boolean name="t28"><number>0/0</number> = <number>0/0</number></boolean>
    <boolean name="t29"><number>-0/0</number> = <number>0/0</number></boolean>
    <boolean name="t30"><number>3/0</number> = <number>4/0</number></boolean>
    <boolean name="t31"><number>3/0</number> = <number>-4/-0</number></boolean>
    <boolean name="t32"><number>3/-0</number> = <number>-4/0</number></boolean>
    <boolean name="t33"><number>5</number> = <math>5</math></boolean>
    <boolean name="t34"><number>0/0</number> = <math simplify>0/0</math></boolean>
    <boolean name="t35"><number>3/0</number> = <math simplify>4/0</math></boolean>
    <boolean name="t36"><number>3/-0</number> = <math simplify>-4/0</math></boolean>
    <boolean name="t37">  true    </boolean>

    </p>

    <p>
    <boolean name="f1">false</boolean>
    <boolean name="f2">t</boolean>
    <boolean name="f3">f</boolean>
    <boolean name="f4">hello</boolean>
    <boolean name="f5">0</boolean>
    <boolean name="f6">x</boolean>
    <boolean name="f7">x>1</boolean>
    <boolean name="f8"></boolean>
    <boolean name="f9">not true</boolean>
    <boolean name="f10">true and false</boolean>
    <boolean name="f11">not true or false</boolean>
    <boolean name="f12">not true and false</boolean>
    <boolean name="f13">not true and not false</boolean>
    <boolean name="f14">not not false</boolean>
    <boolean name="f15">not(true or false)</boolean>
    <boolean name="f16">not(true and not false)</boolean>
    <boolean name="f17">not(true or not false)</boolean>
    <boolean name="f18">not(not true or not false)</boolean>
    <boolean name="f19">not 1</boolean>
    <boolean name="f20"><math>3</math> &lt; <math>1</math></boolean>
    <boolean name="f21"><math>2 > 1</math></boolean>
    <boolean name="f22"><math>xy</math> != xy</boolean>
    <boolean name="f23"><text>hello</text> != hello</boolean>
    <boolean name="f24"><boolean>1</boolean> != true</boolean>
    <boolean name="f25"><boolean>0</boolean> != false</boolean>
    <boolean name="f26"><text>true</text></boolean>
    <boolean name="f27"><math>true</math></boolean>
    <boolean name="f28"><number>3/-0</number> = <number>3/0</number></boolean>
    <boolean name="f29"><number>3/0</number> = <number>0/0</number></boolean>
    <boolean name="f30"><number>3/-0</number> = <number>0/0</number></boolean>
    <boolean name="f31">0 = <math>t=4</math></boolean>
    </p>

    `,
        });

        let nTrues = 37,
            nFalses = 31;

        let stateVariables = await returnAllStateVariables(core);
        for (let i = 1; i <= nTrues; i++) {
            expect(
                stateVariables[`/t${i}`].stateValues.value,
                `expected t${i} to be true`,
            ).to.be.true;
        }
        for (let i = 1; i <= nFalses; i++) {
            expect(
                stateVariables[`/f${i}`].stateValues.value,
                `expected f${i} to be false`,
            ).to.be.false;
        }
    });

    it("boolean based on math", async () => {
        let core = await createTestCore({
            doenetML: `
    <mathInput name="mi" prefill="0" />

    <boolean name="b">$mi</boolean>
      Hello there!
    </text>
    `,
        });

        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables[`/b`].stateValues.value).to.be.false;

        await updateMathInputValue({ latex: "3", name: "/mi", core });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables[`/b`].stateValues.value).to.be.true;

        await updateMathInputValue({ latex: "2x", name: "/mi", core });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables[`/b`].stateValues.value).to.be.false;

        await updateMathInputValue({
            latex: "2x-x-x",
            name: "/mi",
            core,
        });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables[`/b`].stateValues.value).to.be.false;
    });

    it("boolean based on complex numbers", async () => {
        let core = await createTestCore({
            doenetML: `
    <p><number name="a">3+4i</number> <number name="b">3i</number> <number name="c">pi+e i</number></p>

    <p><boolean name="t1">isnumber(re($c))</boolean></p>
    <p><boolean name="t2">isnumber(im($c))</boolean></p>
    <p><boolean name="f1">isnumber($c)</boolean></p>
    <p><boolean name="f2">isinteger(re($c))</boolean></p>
    <p><boolean name="f3">isinteger(im($c))</boolean></p>
    <p><boolean name="f4">isinteger($c)</boolean></p>
    <p><boolean name="t3">isinteger(re($a))</boolean></p>
    <p><boolean name="t4">isinteger(im($a))</boolean></p>
    <p><boolean name="f5">isinteger($a)</boolean></p>
    <p><boolean name="t5">re($a)</boolean></p>
    <p><boolean name="f6">re($b)</boolean></p>
    <p><boolean name="t6">re($c)</boolean></p>
    <p><boolean name="t7">re($a) <= 3</boolean></p>
    <p><boolean name="f7">re($a) < 3</boolean></p>
    <p><boolean name="t8">im($a) <= 4</boolean></p>
    <p><boolean name="f8">im($a) < 4</boolean></p>
    <p><boolean name="t9">abs($a) <= 5</boolean></p>
    <p><boolean name="f9">abs($a) < 5</boolean></p>
        
    `,
        });

        let nTrues = 9,
            nFalses = 9;

        let stateVariables = await returnAllStateVariables(core);
        for (let i = 1; i <= nTrues; i++) {
            expect(
                stateVariables[`/t${i}`].stateValues.value,
                `expected t${i} to be true`,
            ).to.be.true;
        }
        for (let i = 1; i <= nFalses; i++) {
            expect(
                stateVariables[`/f${i}`].stateValues.value,
                `expected f${i} to be false`,
            ).to.be.false;
        }
    });

    it("boolean from computation", async () => {
        let core = await createTestCore({
            doenetML: `
    <mathinput prefill="1" name="i" />

    <boolean name="b1">mod($i,2) = 1</boolean>
    <boolean name="b2">abs(cos(pi*$i/2)) < 10^(-12)</boolean>
    <boolean name="b3">(-1)^$i = 1</boolean>
    <boolean name="b4">floor(($i+1)/2) = ceil(($i-1)/2)</boolean>
    
    `,
        });

        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables[`/b1`].stateValues.value).to.be.true;
        expect(stateVariables[`/b2`].stateValues.value).to.be.true;
        expect(stateVariables[`/b3`].stateValues.value).to.be.false;
        expect(stateVariables[`/b4`].stateValues.value).to.be.false;

        await updateMathInputValue({ latex: "4", name: "/i", core });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables[`/b1`].stateValues.value).to.be.false;
        expect(stateVariables[`/b2`].stateValues.value).to.be.false;
        expect(stateVariables[`/b3`].stateValues.value).to.be.true;
        expect(stateVariables[`/b4`].stateValues.value).to.be.true;

        await updateMathInputValue({ latex: "-7", name: "/i", core });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables[`/b1`].stateValues.value).to.be.true;
        expect(stateVariables[`/b2`].stateValues.value).to.be.true;
        expect(stateVariables[`/b3`].stateValues.value).to.be.false;
        expect(stateVariables[`/b4`].stateValues.value).to.be.false;

        await updateMathInputValue({ latex: "0", name: "/i", core });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables[`/b1`].stateValues.value).to.be.false;
        expect(stateVariables[`/b2`].stateValues.value).to.be.false;
        expect(stateVariables[`/b3`].stateValues.value).to.be.true;
        expect(stateVariables[`/b4`].stateValues.value).to.be.true;
    });

    it("boolean with lists and sequences", async () => {
        let core = await createTestCore({
            doenetML: `
    <boolean name="t1"><math>1,2</math> = <mathlist>1 2</mathlist></boolean>
    <boolean name="t2"><math>1,2</math> = <mathlist unordered>2 1</mathlist></boolean>
    <boolean name="t3"><math unordered>1,2</math> = <mathlist>2 1</mathlist></boolean>
    <boolean name="t4"><math unordered>1,2</math> = <mathlist unordered>2 1</mathlist></boolean>
    <boolean name="t5"><numberlist>1 2</numberlist> = <mathlist>1 2</mathlist></boolean>
    <boolean name="t6"><mathlist unordered>1 2</mathlist> = <mathlist>2 1</mathlist></boolean>
    <boolean name="t7"><numberlist unordered>1 2</numberlist> = <mathlist>2 1</mathlist></boolean>
    <boolean name="t8"><numberlist unordered>1 2</numberlist> = <numberlist>2 1</numberlist></boolean>
    <boolean name="t9"><textlist unordered>a b</textlist> = <textlist>b a</textlist></boolean>
    <boolean name="t10"><booleanlist unordered>true false</booleanlist> = <booleanlist>false true</booleanlist></boolean>
    <boolean name="t11"><mathlist>1</mathlist> = <math>1</math></boolean>
    <boolean name="t12"><mathlist>1</mathlist> = <number>1</number></boolean>
    <boolean name="t13"><numberlist>1</numberlist> = <math>1</math></boolean>
    <boolean name="t14"><numberlist>1</numberlist> = <number>1</number></boolean>
    <boolean name="t15"><text>a, b</text> = <textlist>a b</textlist></boolean>
    <boolean name="t16"><text>a, b</text> = <textlist unordered>b a</textlist></boolean>
    <boolean name="t17"><text>a,b</text> = <textlist>a b</textlist></boolean>
    <boolean name="t18"><mathList>1 2</mathList> = <sequence from="1" to="2" /></boolean>
    <boolean name="t19"><numberList>1 2</numberList> = <sequence from="1" to="2" /></boolean>
    <boolean name="t20"><math>1, 2</math> = <sequence from="1" to="2" /></boolean>
    <boolean name="t21"><textList>d f</textList> = <sequence type="letters" from="d" to="f" step="2" /></boolean>
    <boolean name="t22"><mathList>2x 3x</mathList> = <sequence type="math" from="2x" step="x" length="2" /></boolean>



    <boolean name="f1"><math>1,2</math> = <mathlist>2 1</mathlist></boolean>
    <boolean name="f2"><mathlist>1 2</mathlist> = <mathlist>2 1</mathlist></boolean>
    <boolean name="f3"><numberlist>1 2</numberlist> = <mathlist>2 1</mathlist></boolean>
    <boolean name="f4"><numberlist>1 2</numberlist> = <numberlist>2 1</numberlist></boolean>
    <boolean name="f5"><textlist>a b</textlist> = <textlist>b a</textlist></boolean>
    <boolean name="f6"><booleanlist>true false</booleanlist> = <booleanlist>false true</booleanlist></boolean>
    <boolean name="f7"><mathlist></mathlist> = <mathlist>1</mathlist></boolean>
    <boolean name="f8"><numberlist></numberlist> = <mathlist>1</mathlist></boolean>
    <boolean name="f9"><numberlist>1</numberlist> = <mathlist>0</mathlist></boolean>
    <boolean name="f10"><numberlist></numberlist> = <numberlist>1</numberlist></boolean>
    <boolean name="f11"><textlist></textlist> = <textlist>a</textlist></boolean>
    <boolean name="f12"><mathlist>1</mathlist> = <math>2</math></boolean>
    <boolean name="f13"><mathlist>1</mathlist> = <number>2</number></boolean>
    <boolean name="f14"><numberlist>1</numberlist> = <math>2</math></boolean>
    <boolean name="f15"><numberlist>1</numberlist> = <number>2</number></boolean>
    <boolean name="f16"><mathlist></mathlist> = <math></math></boolean>
    <boolean name="f17"><numberlist></numberlist> = <number></number></boolean>
    <boolean name="f18"><textlist></textlist> = <text></text></boolean>
    <boolean name="f19"><text>a, b</text> = <textlist>b a</textlist></boolean>
    <boolean name="f20"><math>1</math><math>2</math> = <sequence from="1" to="2" /></boolean>
    <boolean name="f21"><math>(1, 2)</math> = <mathList>1 2</mathList></boolean>
    <boolean name="f22">(1, 2) = <mathList>1 2</mathList></boolean>
    <boolean name="f23">1, 2 = <mathList>1 2</mathList></boolean>
    <boolean name="f24"><textList>d e f</textList> = <sequence type="letters" from="d" to="f" step="2" /></boolean>
    <boolean name="f25"><mathList>2x 3x</mathList> = <sequence type="math" from="2x" step="x" length="3" /></boolean>

    `,
        });

        let nTrues = 22,
            nFalses = 25;

        let stateVariables = await returnAllStateVariables(core);
        for (let i = 1; i <= nTrues; i++) {
            expect(
                stateVariables[`/t${i}`].stateValues.value,
                `expected t${i} to be true`,
            ).to.be.true;
        }
        for (let i = 1; i <= nFalses; i++) {
            expect(
                stateVariables[`/f${i}`].stateValues.value,
                `expected f${i} to be false`,
            ).to.be.false;
        }
    });

    it("element of list, set, composite, or string", async () => {
        let elements = [
            {
                element: "1",
                set: "<mathlist>1 2</mathlist>",
                isElement: true,
                isElementCaseInsensitive: true,
            },
            {
                element: "1",
                set: "<numberlist>1 2</numberlist>",
                isElement: true,
                isElementCaseInsensitive: true,
            },
            {
                element: "1",
                set: "<math>1,2</math>",
                isElement: true,
                isElementCaseInsensitive: true,
            },
            {
                element: "1",
                set: "<math>{1,2}</math>",
                isElement: true,
                isElementCaseInsensitive: true,
            },
            {
                element: "1",
                set: "{1,2}",
                isElement: true,
                isElementCaseInsensitive: true,
            },
            {
                element: "1",
                set: "<sequence from='1' to='2' />",
                isElement: true,
                isElementCaseInsensitive: true,
            },
            {
                element: "<math>1</math>",
                set: "<mathlist>1 2</mathlist>",
                isElement: true,
                isElementCaseInsensitive: true,
            },
            {
                element: "<math>1</math>",
                set: "<numberlist>1 2</numberlist>",
                isElement: true,
                isElementCaseInsensitive: true,
            },
            {
                element: "<math>1</math>",
                set: "<math>1,2</math>",
                isElement: true,
                isElementCaseInsensitive: true,
            },
            {
                element: "<math>1</math>",
                set: "<math>{1,2}</math>",
                isElement: true,
                isElementCaseInsensitive: true,
            },
            {
                element: "<math>1</math>",
                set: "{1,2}",
                isElement: true,
                isElementCaseInsensitive: true,
            },
            {
                element: "<math>1</math>",
                set: "<sequence from='1' to='2' />",
                isElement: true,
                isElementCaseInsensitive: true,
            },
            {
                element: "<number>1</number>",
                set: "<mathlist>1 2</mathlist>",
                isElement: true,
                isElementCaseInsensitive: true,
            },
            {
                element: "<number>1</number>",
                set: "<numberlist>1 2</numberlist>",
                isElement: true,
                isElementCaseInsensitive: true,
            },
            {
                element: "<number>1</number>",
                set: "<math>1,2</math>",
                isElement: true,
                isElementCaseInsensitive: true,
            },
            {
                element: "<number>1</number>",
                set: "<math>{1,2}</math>",
                isElement: true,
                isElementCaseInsensitive: true,
            },
            {
                element: "<number>1</number>",
                set: "{1,2}",
                isElement: true,
                isElementCaseInsensitive: true,
            },
            {
                element: "<number>1</number>",
                set: "<sequence from='1' to='2' />",
                isElement: true,
                isElementCaseInsensitive: true,
            },
            {
                element: "<numberList>1</numberList>",
                set: "<sequence from='1' to='2' />",
                isElement: true,
                isElementCaseInsensitive: true,
            },
            {
                element: "3",
                set: "<mathlist>1 2</mathlist>",
                isElement: false,
                isElementCaseInsensitive: false,
            },
            {
                element: "3",
                set: "<numberlist>1 2</numberlist>",
                isElement: false,
                isElementCaseInsensitive: false,
            },
            {
                element: "3",
                set: "<math>1,2</math>",
                isElement: false,
                isElementCaseInsensitive: false,
            },
            {
                element: "3",
                set: "<math>{1,2}</math>",
                isElement: false,
                isElementCaseInsensitive: false,
            },
            {
                element: "3",
                set: "{1,2}",
                isElement: false,
                isElementCaseInsensitive: false,
            },
            {
                element: "3",
                set: "<sequence from='1' to='2' />",
                isElement: false,
                isElementCaseInsensitive: false,
            },
            {
                element: "3",
                set: "3",
                isElement: true,
                isElementCaseInsensitive: true,
            },
            {
                element: "3",
                set: "<mathList>3</mathList>",
                isElement: true,
                isElementCaseInsensitive: true,
            },
            {
                element: "3",
                set: "<numberList>3</numberList>",
                isElement: true,
                isElementCaseInsensitive: true,
            },
            {
                element: "2, 3",
                set: "{1,2}",
                isElement: false,
                isElementCaseInsensitive: false,
                isInvalid: true,
            },
            {
                element: "1",
                set: "[1,2)",
                isElement: true,
                isElementCaseInsensitive: true,
            },
            {
                element: "1",
                set: "<math>[1,2)</math>",
                isElement: true,
                isElementCaseInsensitive: true,
            },
            {
                element: "1",
                set: "<subsetOfReals>[1,2)</subsetOfReals>",
                isElement: true,
                isElementCaseInsensitive: true,
            },
            {
                element: "1",
                set: "<subsetOfReals>1 <= x < 2</subsetOfReals>",
                isElement: true,
                isElementCaseInsensitive: true,
            },
            {
                element: "1",
                set: "(1,2)",
                isElement: false,
                isElementCaseInsensitive: false,
            },
            {
                element: "1",
                set: "<math>(1,2)</math>",
                isElement: false,
                isElementCaseInsensitive: false,
            },
            {
                element: "1",
                set: "<subsetOfReals>(1,2)</subsetOfReals>",
                isElement: false,
                isElementCaseInsensitive: false,
            },
            {
                element: "1",
                set: "<subsetOfReals>1 < x < 2</subsetOfReals>",
                isElement: false,
                isElementCaseInsensitive: false,
            },
            {
                element: "3",
                set: "(1,4) intersect (2,5)",
                isElement: true,
                isElementCaseInsensitive: true,
            },
            {
                element: "2",
                set: "(1,4) intersect (2,5)",
                isElement: false,
                isElementCaseInsensitive: false,
            },
            {
                element: "2x",
                set: "<mathlist>x+x y/2</mathlist>",
                isElement: true,
                isElementCaseInsensitive: true,
            },
            {
                element: "2x",
                set: "<math>x+x, y/2</math>",
                isElement: true,
                isElementCaseInsensitive: true,
            },
            {
                element: "2x",
                set: "<math>{x+x, y/2}</math>",
                isElement: true,
                isElementCaseInsensitive: true,
            },
            {
                element: "2x",
                set: "{x+x, y/2}",
                isElement: true,
                isElementCaseInsensitive: true,
            },
            {
                element: "2x",
                set: "<sequence type='math' from='x' step='x' length='3' />",
                isElement: true,
                isElementCaseInsensitive: true,
            },
            {
                element: "<math>2x</math>",
                set: "<mathlist>x+x y/2</mathlist>",
                isElement: true,
                isElementCaseInsensitive: true,
            },
            {
                element: "<math>2x</math>",
                set: "<math>x+x, y/2</math>",
                isElement: true,
                isElementCaseInsensitive: true,
            },
            {
                element: "<math>2x</math>",
                set: "<math>{x+x, y/2}</math>",
                isElement: true,
                isElementCaseInsensitive: true,
            },
            {
                element: "<math>2x</math>",
                set: "{x+x, y/2}",
                isElement: true,
                isElementCaseInsensitive: true,
            },
            {
                element: "<math>2x</math>",
                set: "<sequence type='math' from='x' step='x' length='3' />",
                isElement: true,
                isElementCaseInsensitive: true,
            },
            {
                element: "2x",
                set: "x+x",
                isElement: true,
                isElementCaseInsensitive: true,
            },
            {
                element: "2x",
                set: "<mathlist>x+X y/2</mathlist>",
                isElement: false,
                isElementCaseInsensitive: true,
            },
            {
                element: "2x",
                set: "<math>x+X, y/2</math>",
                isElement: false,
                isElementCaseInsensitive: true,
            },
            {
                element: "2x",
                set: "{x+X, y/2}",
                isElement: false,
                isElementCaseInsensitive: true,
            },
            {
                element: "2x",
                set: "x+X",
                isElement: false,
                isElementCaseInsensitive: true,
            },
            {
                element: "x",
                set: "<mathlist>x+X y/2</mathlist>",
                isElement: false,
                isElementCaseInsensitive: false,
            },
            {
                element: "x",
                set: "<math>x+X, y/2</math>",
                isElement: false,
                isElementCaseInsensitive: false,
            },
            {
                element: "x",
                set: "{x+X, y/2}",
                isElement: false,
                isElementCaseInsensitive: false,
            },
            {
                element: "b",
                set: "abc",
                isElement: false,
                isElementCaseInsensitive: false,
            },
            {
                element: "b",
                set: "<text>abc</text>",
                isElement: true,
                isElementCaseInsensitive: true,
            },
            {
                element: "<text>b</text>",
                set: "abc",
                isElement: true,
                isElementCaseInsensitive: true,
            },
            {
                element: "<text>b</text>",
                set: "<text>abc</text>",
                isElement: true,
                isElementCaseInsensitive: true,
            },
            {
                element: "b",
                set: "<text>ABC</text>",
                isElement: false,
                isElementCaseInsensitive: true,
            },
            {
                element: "<text>b</text>",
                set: "ABC",
                isElement: false,
                isElementCaseInsensitive: true,
            },
            {
                element: "<text>b</text>",
                set: "<text>ABC</text>",
                isElement: false,
                isElementCaseInsensitive: true,
            },
            {
                element: "b",
                set: "<textlist>abc</textlist>",
                isElement: true,
                isElementCaseInsensitive: true,
            },
            {
                element: "b",
                set: "<textlist>abc def</textlist>",
                isElement: false,
                isElementCaseInsensitive: false,
            },
            {
                element: "abc",
                set: "<textlist>abc def</textlist>",
                isElement: true,
                isElementCaseInsensitive: true,
            },
            {
                element: "abc",
                set: "<textlist>ABC def</textlist>",
                isElement: false,
                isElementCaseInsensitive: true,
            },
            {
                element: "truE",
                set: "<booleanlist>false true</booleanlist>",
                isElement: true,
                isElementCaseInsensitive: true,
            },
            {
                element: "true",
                set: "<booleanlist>false false</booleanlist>",
                isElement: false,
                isElementCaseInsensitive: false,
            },
            {
                element: "<boolean>truE</boolean>",
                set: "<booleanlist>false true</booleanlist>",
                isElement: true,
                isElementCaseInsensitive: true,
            },
            {
                element: "<boolean>true</boolean>",
                set: "<booleanlist>false false</booleanlist>",
                isElement: false,
                isElementCaseInsensitive: false,
            },
        ];

        let doenetML = "";

        for (let [ind, info] of elements.entries()) {
            doenetML += `\n<boolean name="s${ind}">${info.element} elementof ${info.set}</boolean>`;
            doenetML += `\n<boolean name="n${ind}">${info.element} notelementof ${info.set}</boolean>`;
            doenetML += `\n<boolean caseInsensitiveMatch name="sci${ind}">${info.element} elementof ${info.set}</boolean>`;
            doenetML += `\n<boolean caseInsensitiveMatch name="nsci${ind}">${info.element} notelementof ${info.set}</boolean>`;
        }

        let core = await createTestCore({
            doenetML,
        });

        let stateVariables = await returnAllStateVariables(core);

        for (let [ind, info] of elements.entries()) {
            expect(
                stateVariables[`/s${ind}`].stateValues.value,
                `Checking if ${info.element} is element of ${info.set}`,
            ).eq(info.isElement && !info.isInvalid);
            expect(
                stateVariables[`/n${ind}`].stateValues.value,
                `Checking if ${info.element} is not element of ${info.set}`,
            ).eq(!info.isElement && !info.isInvalid);
            expect(
                stateVariables[`/sci${ind}`].stateValues.value,
                `Checking if ${info.element} is case-insensitive element of ${info.set}`,
            ).eq(info.isElementCaseInsensitive && !info.isInvalid);
            expect(
                stateVariables[`/nsci${ind}`].stateValues.value,
                `Checking if ${info.element} is not case-insensitive element of ${info.set}`,
            ).eq(!info.isElementCaseInsensitive && !info.isInvalid);
        }
    });

    it("subset or superset of list or set", async () => {
        let elements = [
            {
                set1: "<mathList>x+x y-y</mathList>",
                set2: "<mathList>z 2x q 0</mathList>",
                isSubset: true,
                isSubsetCaseInsensitive: true,
                isSuperset: false,
                isSupersetCaseInsensitive: false,
            },
            {
                set1: "<mathList>x+X Y-y</mathList>",
                set2: "<mathList>z 2X q 0</mathList>",
                isSubset: false,
                isSubsetCaseInsensitive: true,
                isSuperset: false,
                isSupersetCaseInsensitive: false,
            },
            {
                set1: "<mathList>z 2x q 0</mathList>",
                set2: "<mathList>x+x y-y</mathList>",
                isSubset: false,
                isSubsetCaseInsensitive: false,
                isSuperset: true,
                isSupersetCaseInsensitive: true,
            },
            {
                set1: "<mathList>z 2X q 0</mathList>",
                set2: "<mathList>x+X Y-y</mathList>",
                isSubset: false,
                isSubsetCaseInsensitive: false,
                isSuperset: false,
                isSupersetCaseInsensitive: true,
            },
            {
                set1: "<mathList>x+x y-y v</mathList>",
                set2: "<mathList>z 2x q 0</mathList>",
                isSubset: false,
                isSubsetCaseInsensitive: false,
                isSuperset: false,
                isSupersetCaseInsensitive: false,
            },
            {
                set1: "<mathList>x+x y-y q 0 2x 2x z</mathList>",
                set2: "<mathList>z 2x q 0 q</mathList>",
                isSubset: true,
                isSubsetCaseInsensitive: true,
                isSuperset: true,
                isSupersetCaseInsensitive: true,
            },
            {
                set1: "z",
                set2: "<mathList>z 2x</mathList>",
                isSubset: true,
                isSubsetCaseInsensitive: true,
                isSuperset: false,
                isSupersetCaseInsensitive: false,
            },
            {
                set1: "<math>z</math>",
                set2: "<mathList>z 2x</mathList>",
                isSubset: true,
                isSubsetCaseInsensitive: true,
                isSuperset: false,
                isSupersetCaseInsensitive: false,
            },
            {
                set1: "<mathList>z</mathList>",
                set2: "<mathList>z 2x</mathList>",
                isSubset: true,
                isSubsetCaseInsensitive: true,
                isSuperset: false,
                isSupersetCaseInsensitive: false,
            },
            {
                set1: "(1,2)",
                set2: "(0,3)",
                isSubset: true,
                isSubsetCaseInsensitive: true,
                isSuperset: false,
                isSupersetCaseInsensitive: false,
            },
            {
                set1: "(0,3)",
                set2: "(1,2)",
                isSubset: false,
                isSubsetCaseInsensitive: false,
                isSuperset: true,
                isSupersetCaseInsensitive: true,
            },
            {
                set1: "(0,3)",
                set2: "(2,3]",
                isSubset: false,
                isSubsetCaseInsensitive: false,
                isSuperset: false,
                isSupersetCaseInsensitive: false,
            },
            {
                set1: "{2,3}",
                set2: "[2,4)",
                isSubset: true,
                isSubsetCaseInsensitive: true,
                isSuperset: false,
                isSupersetCaseInsensitive: false,
            },
            {
                set1: "{3}",
                set2: "[2,4)",
                isSubset: true,
                isSubsetCaseInsensitive: true,
                isSuperset: false,
                isSupersetCaseInsensitive: false,
            },
            {
                set1: "3",
                set2: "[2,4)",
                isSubset: true,
                isSubsetCaseInsensitive: true,
                isSuperset: false,
                isSupersetCaseInsensitive: false,
            },
            {
                set1: "2,3",
                set2: "[2,4)",
                isSubset: false,
                isSubsetCaseInsensitive: false,
                isSuperset: false,
                isSupersetCaseInsensitive: false,
                isInvalid: true,
            },
            {
                set1: "{3}",
                set2: "[2,3] intersect [3,4)",
                isSubset: true,
                isSubsetCaseInsensitive: true,
                isSuperset: true,
                isSupersetCaseInsensitive: true,
            },
            {
                set1: "<textList>hello there</textList>",
                set2: "<textList>there bye hello</textList>",
                isSubset: true,
                isSubsetCaseInsensitive: true,
                isSuperset: false,
                isSupersetCaseInsensitive: false,
            },
            {
                set1: "<textList>hellO there</textList>",
                set2: "<textList>tHere bye hello</textList>",
                isSubset: false,
                isSubsetCaseInsensitive: true,
                isSuperset: false,
                isSupersetCaseInsensitive: false,
            },
            {
                set1: "<textList>there bye hello</textList>",
                set2: "<textList>hello there</textList>",
                isSubset: false,
                isSubsetCaseInsensitive: false,
                isSuperset: true,
                isSupersetCaseInsensitive: true,
            },
            {
                set1: "<textList>tHere bye hello</textList>",
                set2: "<textList>hellO there</textList>",
                isSubset: false,
                isSubsetCaseInsensitive: false,
                isSuperset: false,
                isSupersetCaseInsensitive: true,
            },
            {
                set1: "<textList>ere hel</textList>",
                set2: "<textList>there hello</textList>",
                isSubset: false,
                isSubsetCaseInsensitive: false,
                isSuperset: false,
                isSupersetCaseInsensitive: false,
            },
            {
                set1: "<textList>hello there there hello hello</textList>",
                set2: "<textList>there hello bye</textList>",
                isSubset: true,
                isSubsetCaseInsensitive: true,
                isSuperset: false,
                isSupersetCaseInsensitive: false,
            },
            {
                set1: "<text>hello</text>",
                set2: "<textList>there hello bye</textList>",
                isSubset: true,
                isSubsetCaseInsensitive: true,
                isSuperset: false,
                isSupersetCaseInsensitive: false,
            },
            {
                set1: "hello",
                set2: "<textList>there hello bye</textList>",
                isSubset: true,
                isSubsetCaseInsensitive: true,
                isSuperset: false,
                isSupersetCaseInsensitive: false,
            },
            {
                set1: "<text>hello there</text>",
                set2: "<textList>there hello bye</textList>",
                isSubset: false,
                isSubsetCaseInsensitive: false,
                isSuperset: false,
                isSupersetCaseInsensitive: false,
            },
            {
                set1: "<extract prop='words'><text>hello there</text></extract>",
                set2: "<textList>there hello bye</textList>",
                isSubset: true,
                isSubsetCaseInsensitive: true,
                isSuperset: false,
                isSupersetCaseInsensitive: false,
            },
            {
                set1: "<textList>a c</textList>",
                set2: "<sequence type='letters' from='a' to='e' step='2' />",
                isSubset: true,
                isSubsetCaseInsensitive: true,
                isSuperset: false,
                isSupersetCaseInsensitive: false,
            },
            {
                set1: "<text>a, c</text>",
                set2: "<sequence type='letters' from='a' to='e' step='2' />",
                isSubset: false,
                isSubsetCaseInsensitive: false,
                isSuperset: false,
                isSupersetCaseInsensitive: false,
            },
            {
                set1: "<extract prop='list'><text>a, c</text></extract>",
                set2: "<sequence type='letters' from='a' to='e' step='2' />",
                isSubset: true,
                isSubsetCaseInsensitive: true,
                isSuperset: false,
                isSupersetCaseInsensitive: false,
            },
            {
                set1: "<text>ace</text>",
                set2: "<sequence type='letters' from='a' to='e' step='2' />",
                isSubset: false,
                isSubsetCaseInsensitive: false,
                isSuperset: false,
                isSupersetCaseInsensitive: false,
            },
            {
                set1: "<extract prop='characters'><text>ace</text></extract>",
                set2: "<sequence type='letters' from='a' to='e' step='2' />",
                isSubset: true,
                isSubsetCaseInsensitive: true,
                isSuperset: true,
                isSupersetCaseInsensitive: true,
            },
            {
                set1: "<textList>A c</textList>",
                set2: "<sequence type='letters' from='a' to='e' step='2' />",
                isSubset: false,
                isSubsetCaseInsensitive: true,
                isSuperset: false,
                isSupersetCaseInsensitive: false,
            },
            {
                set1: "<textList>a b</textList>",
                set2: "<sequence type='letters' from='a' to='e' step='2' />",
                isSubset: false,
                isSubsetCaseInsensitive: false,
                isSuperset: false,
                isSupersetCaseInsensitive: false,
            },
            {
                set1: "<textList>a b c</textList>",
                set2: "<sequence type='letters' from='a' to='d' step='2' />",
                isSubset: false,
                isSubsetCaseInsensitive: false,
                isSuperset: true,
                isSupersetCaseInsensitive: true,
            },
            {
                set1: "<booleanList>true true</booleanList>",
                set2: "<booleanList>true false</booleanList>",
                isSubset: true,
                isSubsetCaseInsensitive: true,
                isSuperset: false,
                isSupersetCaseInsensitive: false,
            },
            {
                set1: "<booleanList>true true</booleanList>",
                set2: "<booleanList>false false</booleanList>",
                isSubset: false,
                isSubsetCaseInsensitive: false,
                isSuperset: false,
                isSupersetCaseInsensitive: false,
            },
            {
                set1: "<booleanList>false true true</booleanList>",
                set2: "<booleanList>true false</booleanList>",
                isSubset: true,
                isSubsetCaseInsensitive: true,
                isSuperset: true,
                isSupersetCaseInsensitive: true,
            },
            {
                set1: "<boolean>true</boolean>",
                set2: "<booleanList>true false</booleanList>",
                isSubset: true,
                isSubsetCaseInsensitive: true,
                isSuperset: false,
                isSupersetCaseInsensitive: false,
            },
            {
                set1: "true",
                set2: "<booleanList>true false</booleanList>",
                isSubset: true,
                isSubsetCaseInsensitive: true,
                isSuperset: false,
                isSupersetCaseInsensitive: false,
            },
        ];

        let doenetML = "";

        for (let [ind, info] of elements.entries()) {
            doenetML += `\n<boolean name="sb${ind}">${info.set1} subset ${info.set2}</boolean>`;
            doenetML += `\n<boolean name="nsb${ind}">${info.set1} notsubset ${info.set2}</boolean>`;
            doenetML += `\n<boolean name="sp${ind}">${info.set1} superset ${info.set2}</boolean>`;
            doenetML += `\n<boolean name="nsp${ind}">${info.set1} notsuperset ${info.set2}</boolean>`;
            doenetML += `\n<boolean caseInsensitiveMatch name="sbci${ind}">${info.set1} subset ${info.set2}</boolean>`;
            doenetML += `\n<boolean caseInsensitiveMatch name="nsbci${ind}">${info.set1} notsubset ${info.set2}</boolean>`;
            doenetML += `\n<boolean caseInsensitiveMatch name="spci${ind}">${info.set1} superset ${info.set2}</boolean>`;
            doenetML += `\n<boolean caseInsensitiveMatch name="nspci${ind}">${info.set1} notsuperset ${info.set2}</boolean>`;
        }

        let core = await createTestCore({
            doenetML,
        });

        let stateVariables = await returnAllStateVariables(core);

        for (let [ind, info] of elements.entries()) {
            expect(
                stateVariables[`/sb${ind}`].stateValues.value,
                `Checking if ${info.set1} is subset of ${info.set2}`,
            ).eq(info.isSubset && !info.isInvalid);
            expect(
                stateVariables[`/nsb${ind}`].stateValues.value,
                `Checking if ${info.set1} is not subset of ${info.set2}`,
            ).eq(!info.isSubset && !info.isInvalid);
            expect(
                stateVariables[`/sp${ind}`].stateValues.value,
                `Checking if ${info.set1} is superset of ${info.set2}`,
            ).eq(info.isSuperset && !info.isInvalid);
            expect(
                stateVariables[`/nsp${ind}`].stateValues.value,
                `Checking if ${info.set1} is not superset of ${info.set2}`,
            ).eq(!info.isSuperset && !info.isInvalid);
            expect(
                stateVariables[`/sbci${ind}`].stateValues.value,
                `Checking if ${info.set1} is case-insensitive subset of ${info.set2}`,
            ).eq(info.isSubsetCaseInsensitive && !info.isInvalid);
            expect(
                stateVariables[`/nsbci${ind}`].stateValues.value,
                `Checking if ${info.set1} is not case-insensitive subset of ${info.set2}`,
            ).eq(!info.isSubsetCaseInsensitive && !info.isInvalid);
            expect(
                stateVariables[`/spci${ind}`].stateValues.value,
                `Checking if ${info.set1} is case-insensitive superset of ${info.set2}`,
            ).eq(info.isSupersetCaseInsensitive && !info.isInvalid);
            expect(
                stateVariables[`/nspci${ind}`].stateValues.value,
                `Checking if ${info.set1} is not case-insensitive superset of ${info.set2}`,
            ).eq(!info.isSupersetCaseInsensitive && !info.isInvalid);
        }
    });

    it("boolean with texts", async () => {
        let core = await createTestCore({
            doenetML: `
    <boolean name="t1"><text>hello there</text> = hello there</boolean>
    <boolean name="t2"><text>hello there</text> = <text>hello</text> <text>there</text></boolean>
    <boolean name="t3"><text>hello there</text> = hello  there</boolean>
    <boolean name="t4"><text>hello there</text> = <text>hello</text><text>there</text></boolean>
    <boolean name="t5"><text>hellothere</text> = <text><text>hello</text><text>there</text></text></boolean>
    <boolean name="t6"><textlist>hello</textlist> = hello</boolean>
    <boolean name="t7"><text>hello  there</text> = hello there</boolean>
    <boolean name="t8"><text>hello  there</text> = hello  there</boolean>
    <boolean name="t9"><textlist>hello there</textlist> = <text>hello,there</text></boolean>
    <boolean name="t10"><textlist>hello there</textlist> = <text>hello, there</text></boolean>
    <boolean name="t11"><textlist>hello there</textlist> = <text> hello ,   there   </text></boolean>

    <boolean name="f1"><text>hello there</text> = hellothere</boolean>
    <boolean name="f2"><text>hello there</text> = <text>hellothere</text></boolean>
    <boolean name="f3"><text>hello there</text> = <text><text>hello</text><text>there</text></text></boolean>
    <boolean name="f4"><textlist>hello there</textlist> = hello there</boolean>
    <boolean name="f5"><textlist>hello there</textlist> = hello, there</boolean>
    `,
        });

        let nTrues = 11,
            nFalses = 5;

        let stateVariables = await returnAllStateVariables(core);
        for (let i = 1; i <= nTrues; i++) {
            expect(
                stateVariables[`/t${i}`].stateValues.value,
                `expected t${i} to be true`,
            ).to.be.true;
        }
        for (let i = 1; i <= nFalses; i++) {
            expect(
                stateVariables[`/f${i}`].stateValues.value,
                `expected f${i} to be false`,
            ).to.be.false;
        }
    });

    it("math errors and invalid targets are not equal", async () => {
        let core = await createTestCore({
            doenetML: `

    <boolean name="f1"><math></math> = <math></math></boolean>
    <boolean name="t1"><math></math> != <math></math></boolean>
    <boolean name="f2"><math>/</math> = <math>-</math></boolean>
    <boolean name="t2"><math>/</math> != <math>-</math></boolean>

    <boolean name="f3">$invalid = $invalid</boolean>
    <boolean name="t3">$invalid != $invalid</boolean>
    <boolean name="f4">$nothing = $nada</boolean>
    <boolean name="t4">$nothing != $nada</boolean>
    
    `,
        });
        let nTrues = 4,
            nFalses = 4;

        let stateVariables = await returnAllStateVariables(core);
        for (let i = 1; i <= nTrues; i++) {
            expect(
                stateVariables[`/t${i}`].stateValues.value,
                `expected t${i} to be true`,
            ).to.be.true;
        }
        for (let i = 1; i <= nFalses; i++) {
            expect(
                stateVariables[`/f${i}`].stateValues.value,
                `expected f${i} to be false`,
            ).to.be.false;
        }
    });

    it("boolean with number strings for text", async () => {
        let core = await createTestCore({
            doenetML: `
    <choiceinput name="c">
      <choice>1</choice>
      <choice>2</choice>
      <choice>three</choice>
      <choice>four</choice>
    </choiceinput>

    <boolean name="one">$c = 1</boolean>
    <boolean name="two">$c = <text>2</text></boolean>
    <boolean name="three">$c = three</boolean>
    <boolean name="four">$c = <text>four</text></boolean>
    `,
        });

        let stateVariables = await returnAllStateVariables(core);

        expect(stateVariables[`/one`].stateValues.value).to.be.false;
        expect(stateVariables[`/two`].stateValues.value).to.be.false;
        expect(stateVariables[`/three`].stateValues.value).to.be.false;
        expect(stateVariables[`/four`].stateValues.value).to.be.false;

        await updateSelectedIndices({ name: "/c", selectedIndices: [1], core });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables[`/one`].stateValues.value).to.be.true;
        expect(stateVariables[`/two`].stateValues.value).to.be.false;
        expect(stateVariables[`/three`].stateValues.value).to.be.false;
        expect(stateVariables[`/four`].stateValues.value).to.be.false;

        await updateSelectedIndices({ name: "/c", selectedIndices: [2], core });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables[`/one`].stateValues.value).to.be.false;
        expect(stateVariables[`/two`].stateValues.value).to.be.true;
        expect(stateVariables[`/three`].stateValues.value).to.be.false;
        expect(stateVariables[`/four`].stateValues.value).to.be.false;

        await updateSelectedIndices({ name: "/c", selectedIndices: [3], core });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables[`/one`].stateValues.value).to.be.false;
        expect(stateVariables[`/two`].stateValues.value).to.be.false;
        expect(stateVariables[`/three`].stateValues.value).to.be.true;
        expect(stateVariables[`/four`].stateValues.value).to.be.false;

        await updateSelectedIndices({ name: "/c", selectedIndices: [4], core });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables[`/one`].stateValues.value).to.be.false;
        expect(stateVariables[`/two`].stateValues.value).to.be.false;
        expect(stateVariables[`/three`].stateValues.value).to.be.false;
        expect(stateVariables[`/four`].stateValues.value).to.be.true;
    });

    it("boolean adapts to text", async () => {
        let core = await createTestCore({
            doenetML: `
    <booleanInput name="bi" />
    <p><text name="t">You are hungry. $bi</text></p>
    <p>Are you sure? <textInput bindValueTo="$bi" name="ti" /></p>
    `,
        });

        let stateVariables = await returnAllStateVariables(core);

        expect(stateVariables[`/t`].stateValues.value).eq(
            "You are hungry. false",
        );
        expect(stateVariables[`/ti`].stateValues.value).eq("false");

        await updateBooleanInputValue({
            boolean: true,
            name: "/bi",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables[`/t`].stateValues.value).eq(
            "You are hungry. true",
        );
        expect(stateVariables[`/ti`].stateValues.value).eq("true");

        await updateTextInputValue({
            text: "false",
            name: "/ti",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables[`/t`].stateValues.value).eq(
            "You are hungry. false",
        );
        expect(stateVariables[`/ti`].stateValues.value).eq("false");

        await updateTextInputValue({
            text: "tRuE",
            name: "/ti",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables[`/t`].stateValues.value).eq(
            "You are hungry. true",
        );
        expect(stateVariables[`/ti`].stateValues.value).eq("true");

        await updateTextInputValue({ text: "0", name: "/ti", core });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables[`/t`].stateValues.value).eq(
            "You are hungry. true",
        );
        expect(stateVariables[`/ti`].stateValues.value).eq("true");

        await updateTextInputValue({ text: "1=0", name: "/ti", core });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables[`/t`].stateValues.value).eq(
            "You are hungry. true",
        );
        expect(stateVariables[`/ti`].stateValues.value).eq("true");

        await updateTextInputValue({ text: "f", name: "/ti", core });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables[`/t`].stateValues.value).eq(
            "You are hungry. true",
        );
        expect(stateVariables[`/ti`].stateValues.value).eq("true");

        await updateTextInputValue({
            text: "FALSE",
            name: "/ti",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables[`/t`].stateValues.value).eq(
            "You are hungry. false",
        );
        expect(stateVariables[`/ti`].stateValues.value).eq("false");

        await updateTextInputValue({ text: "1", name: "/ti", core });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables[`/t`].stateValues.value).eq(
            "You are hungry. false",
        );
        expect(stateVariables[`/ti`].stateValues.value).eq("false");

        await updateTextInputValue({ text: "t", name: "/ti", core });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables[`/t`].stateValues.value).eq(
            "You are hungry. false",
        );
        expect(stateVariables[`/ti`].stateValues.value).eq("false");

        await updateBooleanInputValue({
            boolean: true,
            name: "/bi",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables[`/t`].stateValues.value).eq(
            "You are hungry. true",
        );
        expect(stateVariables[`/ti`].stateValues.value).eq("true");

        await updateBooleanInputValue({
            boolean: false,
            name: "/bi",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables[`/t`].stateValues.value).eq(
            "You are hungry. false",
        );
        expect(stateVariables[`/ti`].stateValues.value).eq("false");
    });

    it("boolean does not adapt while number adapts", async () => {
        let core = await createTestCore({
            doenetML: `
    <boolean name="b1"><number>3</number> != 1 and <boolean>true</boolean></boolean>
    <boolean name="b2"><number>3</number> != 1 and <boolean>true</boolean> and <number>4</number> = <math>4</math></boolean>
    `,
        });

        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables[`/b1`].stateValues.value).to.be.true;
        expect(stateVariables[`/b2`].stateValues.value).to.be.true;
    });

    it("overwrite properties when copying", async () => {
        let core = await createTestCore({
            doenetML: `
    <boolean name="b">x+x = 2x</boolean>

    $b{symbolicEquality name="b1"}
    $b1{symbolicEquality="false" name="b2"}
    $b2{symbolicEquality="true" name="b3"}
    
    $b1{simplifyOnCompare name="b4"}
    $b4{simplifyOnCompare="false" name="b5"}
    $b5{simplifyOnCompare="true" name="b6"}
    `,
        });

        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables[`/b`].stateValues.value).to.be.true;
        expect(stateVariables[`/b1`].stateValues.value).to.be.false;
        expect(stateVariables[`/b2`].stateValues.value).to.be.true;
        expect(stateVariables[`/b3`].stateValues.value).to.be.false;
        expect(stateVariables[`/b4`].stateValues.value).to.be.true;
        expect(stateVariables[`/b5`].stateValues.value).to.be.false;
        expect(stateVariables[`/b6`].stateValues.value).to.be.true;
    });

    it("verify fix of boolean simplifyOnCompare bug", async () => {
        let core = await createTestCore({
            doenetML: `
    <boolean simplifyOnCompare symbolicEquality name="b1">
      <math>-5e^(-t)</math> = <math simplify>-5e^(-t)</math>
    </boolean>
    <boolean simplifyOnCompare symbolicEquality name="b2">
      <math name="orig">-5e^(-t)</math> = $orig.value{simplify}
    </boolean>
    `,
        });

        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables[`/b1`].stateValues.value).to.be.true;
        expect(stateVariables[`/b2`].stateValues.value).to.be.true;
    });

    it("case insensitive match", async () => {
        let core = await createTestCore({
            doenetML: `
    <boolean name="b1">a/B = A/b</boolean>
    <boolean name="b2" caseInsensitiveMatch>a/B = A/b</boolean>
    <boolean name="b3"><math>a/B</math> = <math>A/b</math></boolean>
    <boolean name="b4" caseInsensitiveMatch><math>a/B</math> = <math>A/b</math></boolean>
    <boolean name="b5"><text>one Word</text> = <text>One word</text></boolean>
    <boolean name="b6" caseInsensitiveMatch><text>one Word</text> = <text>One word</text></boolean>
    `,
        });

        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables[`/b1`].stateValues.value).to.be.false;
        expect(stateVariables[`/b2`].stateValues.value).to.be.true;
        expect(stateVariables[`/b3`].stateValues.value).to.be.false;
        expect(stateVariables[`/b4`].stateValues.value).to.be.true;
        expect(stateVariables[`/b5`].stateValues.value).to.be.false;
        expect(stateVariables[`/b6`].stateValues.value).to.be.true;
    });

    it("match blanks", async () => {
        let core = await createTestCore({
            doenetML: `
    <boolean name="b1">/a = /a</boolean>
    <boolean name="b2" matchBlanks>/a = /a</boolean>
    <boolean name="b3"><math>/a</math> = <math>/a</math></boolean>
    <boolean name="b4" matchBlanks><math>/a</math> = <math>/a</math></boolean>
    <boolean name="b5"><math>/a</math> = /a</boolean>
    <boolean name="b6" matchBlanks><math>/a</math> = /a</boolean>
    <boolean name="b7"><math>_6^14C</math> = <math>_6^14C</math></boolean>
    <boolean name="b8" matchBlanks><math>_6^14C</math> = <math>_6^14C</math></boolean>
    `,
        });

        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables[`/b1`].stateValues.value).to.be.false;
        expect(stateVariables[`/b2`].stateValues.value).to.be.true;
        expect(stateVariables[`/b3`].stateValues.value).to.be.false;
        expect(stateVariables[`/b4`].stateValues.value).to.be.true;
        expect(stateVariables[`/b5`].stateValues.value).to.be.false;
        expect(stateVariables[`/b6`].stateValues.value).to.be.true;
        expect(stateVariables[`/b7`].stateValues.value).to.be.false;
        expect(stateVariables[`/b8`].stateValues.value).to.be.true;
    });

    it("boolean with symbolic functions", async () => {
        let core = await createTestCore({
            doenetML: `
    <boolean name="t1">
      <math>(f(a)-g(b))(x)</math> = <math>(g(b)-f(a))(-x)</math>
    </boolean>
    <boolean name="t2">
      <math>(f(a)-g(f))(x)</math> = <math>(g(f)-f(a))(-x)</math>
    </boolean>
    <boolean name="t3">
      <math>(f_3(a)-g_2(b))(x)</math> = <math>(g_2(b)-f_3(a))(-x)</math>
    </boolean>
    <boolean name="t4">
      <math>(f^3(a)-g^2(b))(x)</math> = <math>(g^2(b)-f^3(a))(-x)</math>
    </boolean>
    <boolean name="f1">
      <math>(f(a)-g(b))(x)</math> = <math>(f(b)-g(a))(-x)</math>
    </boolean>
    <boolean name="f2">
      <math>(f(a)-g(f))(x)</math> = <math>(f(g)-g(a))(-x)</math>
    </boolean>
    <boolean name="f3">
      <math>(f_3(a)-g_2(b))(x)</math> = <math>(g_3(b)-f_2(a))(-x)</math>
    </boolean>
    <boolean name="f4">
      <math>(f^3(a)-g^2(b))(x)</math> = <math>(g^3(b)-f^2(a))(-x)</math>
    </boolean>
    `,
        });

        let nTrues = 4,
            nFalses = 4;

        let stateVariables = await returnAllStateVariables(core);
        for (let i = 1; i <= nTrues; i++) {
            expect(
                stateVariables[`/t${i}`].stateValues.value,
                `expected t${i} to be true`,
            ).to.be.true;
        }
        for (let i = 1; i <= nFalses; i++) {
            expect(
                stateVariables[`/f${i}`].stateValues.value,
                `expected f${i} to be false`,
            ).to.be.false;
        }
    });

    it("symbolicEquality correctly matches negative numbers", async () => {
        let core = await createTestCore({
            doenetML: `
    <math name="p5">5</math>
    <math name="p5x">5x</math>
    <math name="n5">-5</math>
    <math name="n5b">-$p5</math>
    <math name="nn5">-$n5</math>
    <math name="nn5b">-$n5b</math>
    <math name="n5x">-5x</math>
    <math name="n5xb">-$p5x</math>
    <math name="n5xc">$n5 x</math>
    <math name="n5xd">$n5b x</math>
    <math name="nn5x">-$n5x</math>
    <math name="nn5xb">-$n5xb</math>
    <math name="nn5xc">-$n5xc</math>
    <math name="nn5xd">-$n5xd</math>

    <boolean name="t1" symbolicEquality>$n5 = -5</boolean>
    <boolean name="t2" symbolicEquality>$n5b = -5</boolean>
    <boolean name="t3" symbolicEquality>$n5 = $n5b</boolean>
    <boolean name="t4" symbolicEquality>$nn5 = $nn5b</boolean>
    <boolean name="t5" symbolicEquality>$n5x = -5x</boolean>
    <boolean name="t6" symbolicEquality>$n5xb = -5x</boolean>
    <boolean name="t7" symbolicEquality>$n5xc = -5x</boolean>
    <boolean name="t8" symbolicEquality>$n5xd = -5x</boolean>
    <boolean name="t9" symbolicEquality>$n5xb = $n5x</boolean>
    <boolean name="t10" symbolicEquality>$n5xc = $n5x</boolean>
    <boolean name="t11" symbolicEquality>$n5xd = $n5x</boolean>
    <boolean name="t12" symbolicEquality>$n5xc = $n5xb</boolean>
    <boolean name="t13" symbolicEquality>$n5xd = $n5xb</boolean>
    <boolean name="t14" symbolicEquality>$n5xd = $n5xc</boolean>
    <boolean name="t15" symbolicEquality>7-$p5-$p5x = 7-5-5x</boolean>
    <boolean name="t16" symbolicEquality>7+$n5+$n5x = 7-5-5x</boolean>

    <boolean name="f1" symbolicEquality>$nn5 = $p5</boolean>
    <boolean name="f2" symbolicEquality>$nn5b = $p5</boolean>
    <boolean name="f3" symbolicEquality>$nn5 = 5</boolean>
    <boolean name="f4" symbolicEquality>$nn5b = 5</boolean>
    <boolean name="f5" symbolicEquality>$nn5x = $p5x</boolean>
    <boolean name="f6" symbolicEquality>$nn5xb = $p5x</boolean>
    <boolean name="f7" symbolicEquality>$nn5xc = $p5x</boolean>
    <boolean name="f8" symbolicEquality>$nn5xd = $p5x</boolean>
    <boolean name="f9" symbolicEquality>$nn5x = 5x</boolean>
    <boolean name="f10" symbolicEquality>$nn5xb = 5x</boolean>
    <boolean name="f11" symbolicEquality>$nn5xc = 5x</boolean>
    <boolean name="f12" symbolicEquality>$nn5xd = 5x</boolean>
    <boolean name="f13" symbolicEquality>7-$n5-$n5x = 7+5+5x</boolean>
    <boolean name="f14" symbolicEquality>7-$p5x-$p5 = 7-5-5x</boolean>
    <boolean name="f15" symbolicEquality>7+$n5x+$n5 = 7-5-5x</boolean>

    `,
        });

        let nTrues = 16,
            nFalses = 15;

        let stateVariables = await returnAllStateVariables(core);
        for (let i = 1; i <= nTrues; i++) {
            expect(
                stateVariables[`/t${i}`].stateValues.value,
                `expected t${i} to be true`,
            ).to.be.true;
        }
        for (let i = 1; i <= nFalses; i++) {
            expect(
                stateVariables[`/f${i}`].stateValues.value,
                `expected f${i} to be false`,
            ).to.be.false;
        }
    });
});
