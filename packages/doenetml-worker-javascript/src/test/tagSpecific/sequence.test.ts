import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import {
    updateBooleanInputValue,
    updateMathInputValue,
    updateTextInputValue,
} from "../utils/actions";
import me from "math-expressions";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

describe("Sequence tag tests", async () => {
    it("number sequence, no parameters", async () => {
        let core = await createTestCore({
            doenetML: `
    <p name="p"><sequence/></p>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        let children = stateVariables["/p"].activeChildren.map(
            (x) => stateVariables[x.componentIdx],
        );
        expect(children.length).eq(10);
        for (let i = 0; i < 10; i++) {
            expect(children[i].stateValues.value).eq(i + 1);
        }
    });

    it("number sequence, just from", async () => {
        let core = await createTestCore({
            doenetML: `
    <p name="p"><sequence from="-4"/></p>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        let children = stateVariables["/p"].activeChildren.map(
            (x) => stateVariables[x.componentIdx],
        );
        expect(children.length).eq(10);
        for (let i = 0; i < 10; i++) {
            expect(children[i].stateValues.value).eq(i - 4);
        }
    });

    it("number sequence, just to", async () => {
        let core = await createTestCore({
            doenetML: `
    <p name="p"><sequence to="3"/></p>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        let children = stateVariables["/p"].activeChildren.map(
            (x) => stateVariables[x.componentIdx],
        );
        expect(children.length).eq(3);
        for (let i = 0; i < 3; i++) {
            expect(children[i].stateValues.value).eq(3 + i - 2);
        }
    });

    it("number sequence, just step", async () => {
        let core = await createTestCore({
            doenetML: `
    <p name="p"><sequence step="-2"/></p>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        let children = stateVariables["/p"].activeChildren.map(
            (x) => stateVariables[x.componentIdx],
        );
        expect(children.length).eq(10);
        for (let i = 0; i < 10; i++) {
            expect(children[i].stateValues.value).eq(1 + i * -2);
        }
    });

    it("number sequence, just length", async () => {
        let core = await createTestCore({
            doenetML: `
    <p name="p"><sequence length="5"/></p>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        let children = stateVariables["/p"].activeChildren.map(
            (x) => stateVariables[x.componentIdx],
        );
        expect(children.length).eq(5);
        for (let i = 0; i < 5; i++) {
            expect(children[i].stateValues.value).eq(1 + i);
        }
    });

    it("number sequence, from and to", async () => {
        let core = await createTestCore({
            doenetML: `
    <p name="p"><sequence from="-3" to="4"/></p>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        let children = stateVariables["/p"].activeChildren.map(
            (x) => stateVariables[x.componentIdx],
        );
        expect(children.length).eq(8);
        for (let i = 0; i < 8; i++) {
            expect(children[i].stateValues.value).eq(-3 + i);
        }
    });

    it("number sequence, from and to, not matching", async () => {
        let core = await createTestCore({
            doenetML: `
    <p name="p"><sequence from="-3" to="4.1"/></p>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        let children = stateVariables["/p"].activeChildren.map(
            (x) => stateVariables[x.componentIdx],
        );
        expect(children.length).eq(8);
        for (let i = 0; i < 8; i++) {
            expect(children[i].stateValues.value).eq(-3 + i);
        }
    });

    it("number sequence, from and to, adjust for round-off error", async () => {
        let core = await createTestCore({
            doenetML: `
    <p name="p"><sequence from="1" to="(0.1+0.7)*10"/></p>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        let children = stateVariables["/p"].activeChildren.map(
            (x) => stateVariables[x.componentIdx],
        );
        expect(children.length).eq(8);
        for (let i = 0; i < 8; i++) {
            expect(children[i].stateValues.value).eq(i + 1);
        }
    });

    it("math sequence, from and to, adjust for round-off error", async () => {
        let core = await createTestCore({
            doenetML: `
    <p name="p"><sequence type="math" from="1" to="(0.1+0.7)*10"/></p>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        let children = stateVariables["/p"].activeChildren.map(
            (x) => stateVariables[x.componentIdx],
        );
        expect(children.length).eq(8);
        for (let i = 0; i < 8; i++) {
            expect(children[i].stateValues.value.tree).eq(i + 1);
        }
    });

    it("number sequence, from and step", async () => {
        let core = await createTestCore({
            doenetML: `
    <p name="p"><sequence from="2" step="-4"/></p>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        let children = stateVariables["/p"].activeChildren.map(
            (x) => stateVariables[x.componentIdx],
        );
        expect(children.length).eq(10);
        for (let i = 0; i < 10; i++) {
            expect(children[i].stateValues.value).eq(2 + i * -4);
        }
    });

    it("number sequence, from and length", async () => {
        let core = await createTestCore({
            doenetML: `
    <p name="p"><sequence from="11" length="3"/></p>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        let children = stateVariables["/p"].activeChildren.map(
            (x) => stateVariables[x.componentIdx],
        );
        expect(children.length).eq(3);
        for (let i = 0; i < 3; i++) {
            expect(children[i].stateValues.value).eq(11 + i);
        }
    });

    it("number sequence, to and step", async () => {
        let core = await createTestCore({
            doenetML: `
    <p name="p"><sequence to="21" step="3"/></p>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        let children = stateVariables["/p"].activeChildren.map(
            (x) => stateVariables[x.componentIdx],
        );
        expect(children.length).eq(7);
        for (let i = 0; i < 7; i++) {
            expect(children[i].stateValues.value).eq(21 + 3 * (i - 6));
        }
    });

    it("number sequence, to and step, adjust for round-off error", async () => {
        let core = await createTestCore({
            doenetML: `
    <p name="p"><sequence to="1.4" step="0.1"/></p>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        let children = stateVariables["/p"].activeChildren.map(
            (x) => stateVariables[x.componentIdx],
        );
        expect(children.length).eq(5);
        for (let i = 0; i < 5; i++) {
            expect(
                Math.abs(children[i].stateValues.value - (1 + i * 0.1)),
            ).lessThan(1e-14);
        }
    });

    it("math sequence, to and step, adjust for round-off error", async () => {
        let core = await createTestCore({
            doenetML: `
    <p name="p"><sequence type="math" to="1.4" step="0.1"/></p>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        let children = stateVariables["/p"].activeChildren.map(
            (x) => stateVariables[x.componentIdx],
        );
        expect(children.length).eq(5);
        for (let i = 0; i < 5; i++) {
            expect(
                Math.abs(children[i].stateValues.value - (1 + i * 0.1)),
            ).lessThan(1e-14);
        }
    });

    it("number sequence, to and length", async () => {
        let core = await createTestCore({
            doenetML: `
    <p name="p"><sequence to="-8" length="4"/></p>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        let children = stateVariables["/p"].activeChildren.map(
            (x) => stateVariables[x.componentIdx],
        );
        expect(children.length).eq(4);
        for (let i = 0; i < 4; i++) {
            expect(children[i].stateValues.value).eq(-8 + (i - 3));
        }
    });

    it("number sequence, step and length", async () => {
        let core = await createTestCore({
            doenetML: `
    <p name="p"><sequence step="5" length="6"/></p>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        let children = stateVariables["/p"].activeChildren.map(
            (x) => stateVariables[x.componentIdx],
        );
        expect(children.length).eq(6);
        for (let i = 0; i < 6; i++) {
            expect(children[i].stateValues.value).eq(1 + 5 * i);
        }
    });

    it("number sequence, from, to, and step", async () => {
        let core = await createTestCore({
            doenetML: `
    <p name="p"><sequence from="9" to="2" step="-2" /></p>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        let children = stateVariables["/p"].activeChildren.map(
            (x) => stateVariables[x.componentIdx],
        );
        expect(children.length).eq(4);
        for (let i = 0; i < 4; i++) {
            expect(children[i].stateValues.value).eq(9 - 2 * i);
        }
    });

    it("number sequence, from, to, and step, adjust for round-off errors", async () => {
        let core = await createTestCore({
            doenetML: `
    <p name="p"><sequence from="0.2" to="0.5" step="0.1" /></p>
    `,
        });

        let sequence = [0.2, 0.3, 0.4, 0.5];

        let stateVariables = await core.returnAllStateVariables(false, true);
        let children = stateVariables["/p"].activeChildren.map(
            (x) => stateVariables[x.componentIdx],
        );
        expect(children.length).eq(4);
        for (let i = 0; i < 4; i++) {
            expect(
                Math.abs(children[i].stateValues.value - sequence[i]),
            ).lessThan(1e-14);
        }
    });

    it("math sequence, from, to, and step, adjust for round-off errors", async () => {
        let core = await createTestCore({
            doenetML: `
    <p name="p"><sequence type="math" from="0.2" to="0.5" step="0.1" /></p>
    `,
        });

        let sequence = [0.2, 0.3, 0.4, 0.5];

        let stateVariables = await core.returnAllStateVariables(false, true);
        let children = stateVariables["/p"].activeChildren.map(
            (x) => stateVariables[x.componentIdx],
        );
        expect(children.length).eq(4);
        for (let i = 0; i < 4; i++) {
            expect(
                Math.abs(children[i].stateValues.value - sequence[i]),
            ).lessThan(1e-14);
        }
    });

    it("number sequence, from, to, and length", async () => {
        let core = await createTestCore({
            doenetML: `
    <p name="p"><sequence from="-5" to="5" length="6" /></p>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        let children = stateVariables["/p"].activeChildren.map(
            (x) => stateVariables[x.componentIdx],
        );
        expect(children.length).eq(6);
        for (let i = 0; i < 6; i++) {
            expect(children[i].stateValues.value).eq(-5 + 2 * i);
        }
    });

    it("number sequence, from, step, and length", async () => {
        let core = await createTestCore({
            doenetML: `
    <p name="p"><sequence from="8" step="-2" length="5" /></p>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        let children = stateVariables["/p"].activeChildren.map(
            (x) => stateVariables[x.componentIdx],
        );
        expect(children.length).eq(5);
        for (let i = 0; i < 5; i++) {
            expect(children[i].stateValues.value).eq(8 - 2 * i);
        }
    });

    it("number sequence, to, step, and length", async () => {
        let core = await createTestCore({
            doenetML: `
    <p name="p"><sequence to="8" step="-2" length="5" /></p>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        let children = stateVariables["/p"].activeChildren.map(
            (x) => stateVariables[x.componentIdx],
        );
        expect(children.length).eq(5);
        for (let i = 0; i < 5; i++) {
            expect(children[i].stateValues.value).eq(8 - 2 * (i - 4));
        }
    });

    it("letters sequence, lowercase", async () => {
        let core = await createTestCore({
            doenetML: `
    <p name="p"><sequence type="letters" from="c" to="Q" length="5" /></p>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        let children = stateVariables["/p"].activeChildren.map(
            (x) => stateVariables[x.componentIdx],
        );
        expect(children.length).eq(5);
        expect(children[0].stateValues.value).eq("c");
        expect(children[1].stateValues.value).eq("f");
        expect(children[2].stateValues.value).eq("i");
        expect(children[3].stateValues.value).eq("l");
        expect(children[4].stateValues.value).eq("o");
    });

    it("letters sequence, uppercase", async () => {
        let core = await createTestCore({
            doenetML: `
    <p name="p"><sequence type="letters" from="Y" to="f" step="-4" /></p>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        let children = stateVariables["/p"].activeChildren.map(
            (x) => stateVariables[x.componentIdx],
        );
        expect(children.length).eq(5);
        expect(children[0].stateValues.value).eq("Y");
        expect(children[1].stateValues.value).eq("U");
        expect(children[2].stateValues.value).eq("Q");
        expect(children[3].stateValues.value).eq("M");
        expect(children[4].stateValues.value).eq("I");
    });

    it("letters sequence, multicharacter", async () => {
        let core = await createTestCore({
            doenetML: `
    <p name="p"><sequence type="letters" from="aZ" step="3" length="4" /></p>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        let children = stateVariables["/p"].activeChildren.map(
            (x) => stateVariables[x.componentIdx],
        );
        expect(children.length).eq(4);
        expect(children[0].stateValues.value).eq("az");
        expect(children[1].stateValues.value).eq("bc");
        expect(children[2].stateValues.value).eq("bf");
        expect(children[3].stateValues.value).eq("bi");
    });

    it("letters sequence, stays valid", async () => {
        let core = await createTestCore({
            doenetML: `
    <p name="p"><sequence type="letters" to="q" step="3" length="10" /></p>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        let children = stateVariables["/p"].activeChildren.map(
            (x) => stateVariables[x.componentIdx],
        );
        expect(children.length).eq(6);
        expect(children[0].stateValues.value).eq("b");
        expect(children[1].stateValues.value).eq("e");
        expect(children[2].stateValues.value).eq("h");
        expect(children[3].stateValues.value).eq("k");
        expect(children[4].stateValues.value).eq("n");
        expect(children[5].stateValues.value).eq("q");
    });

    it("letters sequence, no parameters", async () => {
        let core = await createTestCore({
            doenetML: `
    <p name="p"><sequence type="letters"/></p>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        let children = stateVariables["/p"].activeChildren.map(
            (x) => stateVariables[x.componentIdx],
        );
        expect(children.length).eq(10);
        expect(children[0].stateValues.value).eq("a");
        expect(children[1].stateValues.value).eq("b");
        expect(children[2].stateValues.value).eq("c");
        expect(children[3].stateValues.value).eq("d");
        expect(children[4].stateValues.value).eq("e");
        expect(children[5].stateValues.value).eq("f");
        expect(children[6].stateValues.value).eq("g");
        expect(children[7].stateValues.value).eq("h");
        expect(children[8].stateValues.value).eq("i");
        expect(children[9].stateValues.value).eq("j");
    });

    it("math sequence, calculate step", async () => {
        let core = await createTestCore({
            doenetML: `
    <p name="p"><sequence type="math" from="3x" to="3y" length="4" /></p>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        let children = stateVariables["/p"].activeChildren.map(
            (x) => stateVariables[x.componentIdx],
        );
        expect(children.length).eq(4);
        expect(children[0].stateValues.value.tree).eqls(["*", 3, "x"]);
        expect(children[1].stateValues.value.tree).eqls([
            "+",
            ["*", 2, "x"],
            "y",
        ]);
        expect(children[2].stateValues.value.tree).eqls([
            "+",
            "x",
            ["*", 2, "y"],
        ]);
        expect(children[3].stateValues.value.tree).eqls(["*", 3, "y"]);
    });

    it("number sequence, excludes", async () => {
        let core = await createTestCore({
            doenetML: `
    <p name="p"><sequence from="-1" length="10" exclude="$exclude2  0 6" /></p>
    <p>Also exclude: <mathInput name="exclude2" /></p>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        let children = stateVariables["/p"].activeChildren.map(
            (x) => stateVariables[x.componentIdx],
        );
        expect(children.length).eq(8);
        let ind = 0;
        for (let i = 0; i < 10; i++) {
            if (i == 1 || i == 7) {
                continue;
            }
            expect(children[ind].stateValues.value).eq(i - 1);
            ind++;
        }

        // also exclude 7
        await updateMathInputValue({
            latex: "7",
            name: "/exclude2",
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        children = stateVariables["/p"].activeChildren.map(
            (x) => stateVariables[x.componentIdx],
        );
        expect(children.length).eq(7);
        ind = 0;
        for (let i = 0; i < 10; i++) {
            if (i == 1 || i == 7 || i == 8) {
                continue;
            }
            expect(children[ind].stateValues.value).eq(i - 1);
            ind++;
        }

        // also exclude 6 twice
        await updateMathInputValue({
            latex: "6",
            name: "/exclude2",
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        children = stateVariables["/p"].activeChildren.map(
            (x) => stateVariables[x.componentIdx],
        );
        expect(children.length).eq(8);
        ind = 0;
        for (let i = 0; i < 10; i++) {
            if (i == 1 || i == 7) {
                continue;
            }
            expect(children[ind].stateValues.value).eq(i - 1);
            ind++;
        }

        // also exclude 12
        await updateMathInputValue({
            latex: "12",
            name: "/exclude2",
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        children = stateVariables["/p"].activeChildren.map(
            (x) => stateVariables[x.componentIdx],
        );
        expect(children.length).eq(8);
        ind = 0;
        for (let i = 0; i < 10; i++) {
            if (i == 1 || i == 7) {
                continue;
            }
            expect(children[ind].stateValues.value).eq(i - 1);
            ind++;
        }

        // also exclude 3
        await updateMathInputValue({
            latex: "3",
            name: "/exclude2",
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        children = stateVariables["/p"].activeChildren.map(
            (x) => stateVariables[x.componentIdx],
        );
        expect(children.length).eq(7);
        ind = 0;
        for (let i = 0; i < 10; i++) {
            if (i == 1 || i == 7 || i == 4) {
                continue;
            }
            expect(children[ind].stateValues.value).eq(i - 1);
            ind++;
        }

        // don't exclude anything else
        await updateMathInputValue({
            latex: "",
            name: "/exclude2",
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        children = stateVariables["/p"].activeChildren.map(
            (x) => stateVariables[x.componentIdx],
        );
        expect(children.length).eq(8);
        ind = 0;
        for (let i = 0; i < 10; i++) {
            if (i == 1 || i == 7) {
                continue;
            }
            expect(children[ind].stateValues.value).eq(i - 1);
            ind++;
        }
    });

    it("number sequence, excludes, adjust for round-off errors", async () => {
        let core = await createTestCore({
            doenetML: `
    <p name="p"><sequence from='.1' to=' .8' step=' .1' exclude='.3 .6 .7' /></p>
    `,
        });

        let sequence = [0.1, 0.2, 0.4, 0.5, 0.8];

        let stateVariables = await core.returnAllStateVariables(false, true);
        let children = stateVariables["/p"].activeChildren.map(
            (x) => stateVariables[x.componentIdx],
        );
        expect(children.length).eq(5);
        for (let i = 0; i < 5; i++) {
            expect(
                Math.abs(children[i].stateValues.value - sequence[i]),
            ).lessThan(1e-14);
        }
    });

    it("letters sequence, excludes", async () => {
        let core = await createTestCore({
            doenetML: `
    <p name="p"><sequence type="letters" length="10" exclude="$e  b f" /></p>
    <p>Also exclude: <textInput name="e" /></p>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        let children = stateVariables["/p"].activeChildren.map(
            (x) => stateVariables[x.componentIdx],
        );
        expect(children.length).eq(8);
        let ind = 0;
        for (let i = 0; i < 10; i++) {
            if (i == 1 || i == 5) {
                continue;
            }
            expect(children[ind].stateValues.value).eq(
                String.fromCharCode(97 + i),
            );
            ind++;
        }

        // also exclude i
        await updateTextInputValue({ text: "i", name: "/e", core });
        stateVariables = await core.returnAllStateVariables(false, true);
        children = stateVariables["/p"].activeChildren.map(
            (x) => stateVariables[x.componentIdx],
        );
        expect(children.length).eq(7);
        ind = 0;
        for (let i = 0; i < 10; i++) {
            if (i == 1 || i == 5 || i == 8) {
                continue;
            }
            expect(children[ind].stateValues.value).eq(
                String.fromCharCode(97 + i),
            );
            ind++;
        }

        // also exclude f twice
        await updateTextInputValue({ text: "f", name: "/e", core });

        stateVariables = await core.returnAllStateVariables(false, true);
        children = stateVariables["/p"].activeChildren.map(
            (x) => stateVariables[x.componentIdx],
        );
        expect(children.length).eq(8);
        ind = 0;
        for (let i = 0; i < 10; i++) {
            if (i == 1 || i == 5) {
                continue;
            }
            expect(children[ind].stateValues.value).eq(
                String.fromCharCode(97 + i),
            );
            ind++;
        }

        // also exclude l
        await updateTextInputValue({ text: "l", name: "/e", core });

        stateVariables = await core.returnAllStateVariables(false, true);
        children = stateVariables["/p"].activeChildren.map(
            (x) => stateVariables[x.componentIdx],
        );
        expect(children.length).eq(8);
        ind = 0;
        for (let i = 0; i < 10; i++) {
            if (i == 1 || i == 5) {
                continue;
            }
            expect(children[ind].stateValues.value).eq(
                String.fromCharCode(97 + i),
            );
            ind++;
        }

        // also exclude C
        await updateTextInputValue({ text: "C", name: "/e", core });

        stateVariables = await core.returnAllStateVariables(false, true);
        children = stateVariables["/p"].activeChildren.map(
            (x) => stateVariables[x.componentIdx],
        );
        expect(children.length).eq(7);
        ind = 0;
        for (let i = 0; i < 10; i++) {
            if (i == 1 || i == 5 || i == 2) {
                continue;
            }
            expect(children[ind].stateValues.value).eq(
                String.fromCharCode(97 + i),
            );
            ind++;
        }

        // don't exclude anything else
        await updateTextInputValue({ text: "", name: "/e", core });

        stateVariables = await core.returnAllStateVariables(false, true);
        children = stateVariables["/p"].activeChildren.map(
            (x) => stateVariables[x.componentIdx],
        );
        expect(children.length).eq(8);
        ind = 0;
        for (let i = 0; i < 10; i++) {
            if (i == 1 || i == 5) {
                continue;
            }
            expect(children[ind].stateValues.value).eq(
                String.fromCharCode(97 + i),
            );
            ind++;
        }
    });

    it("math sequence, excludes", async () => {
        let core = await createTestCore({
            doenetML: `
    <p name="p"><sequence type="math" length="10" from="x" step="x" exclude="2x 6x  $e" /></p>
    <p>Also exclude: <mathinput name="e" /></p>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        let children = stateVariables["/p"].activeChildren.map(
            (x) => stateVariables[x.componentIdx],
        );
        expect(children.length).eq(8);
        let ind = 0;
        for (let i = 0; i < 10; i++) {
            if (i == 1 || i == 5) {
                continue;
            }
            expect(
                me
                    .fromAst(children[ind].stateValues.value)
                    .equals(me.fromText((1 + i).toString() + "x")),
            ).eq(true);
            ind++;
        }

        // also exclude 9x
        await updateMathInputValue({ latex: "9x", name: "/e", core });

        stateVariables = await core.returnAllStateVariables(false, true);
        children = stateVariables["/p"].activeChildren.map(
            (x) => stateVariables[x.componentIdx],
        );
        expect(children.length).eq(7);
        ind = 0;
        for (let i = 0; i < 10; i++) {
            if (i == 1 || i == 5 || i == 8) {
                continue;
            }
            expect(
                me
                    .fromAst(children[ind].stateValues.value)
                    .equals(me.fromText((1 + i).toString() + "x")),
            ).eq(true);
            ind++;
        }

        // also exclude 6x twice
        await updateMathInputValue({ latex: "6x", name: "/e", core });

        stateVariables = await core.returnAllStateVariables(false, true);
        children = stateVariables["/p"].activeChildren.map(
            (x) => stateVariables[x.componentIdx],
        );
        expect(children.length).eq(8);
        ind = 0;
        for (let i = 0; i < 10; i++) {
            if (i == 1 || i == 5) {
                continue;
            }
            expect(
                me
                    .fromAst(children[ind].stateValues.value)
                    .equals(me.fromText((1 + i).toString() + "x")),
            ).eq(true);
            ind++;
        }

        // also exclude 12x
        await updateMathInputValue({ latex: "12x", name: "/e", core });

        stateVariables = await core.returnAllStateVariables(false, true);
        children = stateVariables["/p"].activeChildren.map(
            (x) => stateVariables[x.componentIdx],
        );
        expect(children.length).eq(8);
        ind = 0;
        for (let i = 0; i < 10; i++) {
            if (i == 1 || i == 5) {
                continue;
            }
            expect(
                me
                    .fromAst(children[ind].stateValues.value)
                    .equals(me.fromText((1 + i).toString() + "x")),
            ).eq(true);
            ind++;
        }

        // also exclude 3x
        await updateMathInputValue({ latex: "3x", name: "/e", core });

        stateVariables = await core.returnAllStateVariables(false, true);
        children = stateVariables["/p"].activeChildren.map(
            (x) => stateVariables[x.componentIdx],
        );
        expect(children.length).eq(7);
        ind = 0;
        for (let i = 0; i < 10; i++) {
            if (i == 1 || i == 5 || i == 2) {
                continue;
            }
            expect(
                me
                    .fromAst(children[ind].stateValues.value)
                    .equals(me.fromText((1 + i).toString() + "x")),
            ).eq(true);
            ind++;
        }

        // don't exclude anything else
        await updateMathInputValue({ latex: "", name: "/e", core });

        stateVariables = await core.returnAllStateVariables(false, true);
        children = stateVariables["/p"].activeChildren.map(
            (x) => stateVariables[x.componentIdx],
        );
        expect(children.length).eq(8);
        ind = 0;
        for (let i = 0; i < 10; i++) {
            if (i == 1 || i == 5) {
                continue;
            }
            expect(
                me
                    .fromAst(children[ind].stateValues.value)
                    .equals(me.fromText((1 + i).toString() + "x")),
            ).eq(true);
            ind++;
        }
    });

    it("math sequence, excludes, adjust for round-off errors", async () => {
        let core = await createTestCore({
            doenetML: `
    <p name="p"><sequence type="math" from='.1' to=' .8' step=' .1' exclude='.3 .6 .7' /></p>
    `,
        });

        let sequence = [0.1, 0.2, 0.4, 0.5, 0.8];

        let stateVariables = await core.returnAllStateVariables(false, true);
        let children = stateVariables["/p"].activeChildren.map(
            (x) => stateVariables[x.componentIdx],
        );
        expect(children.length).eq(5);
        for (let i = 0; i < 5; i++) {
            expect(
                Math.abs(children[i].stateValues.value - sequence[i]),
            ).lessThan(1e-14);
        }
    });

    it("sequence of decimals rounds on display", async () => {
        let core = await createTestCore({
            doenetML: `
    <p name="p"><sequence step="0.1" from="0" to="1" /></p>
    `,
        });

        // Round when displaying to show 10ths correctly
        // But, don't round internally
        let stateVariables = await core.returnAllStateVariables(false, true);
        let children = stateVariables["/p"].activeChildren.map(
            (x) => stateVariables[x.componentIdx],
        );
        expect(children.length).eq(11);

        for (let i = 0; i < 11; i++) {
            // Note: i/10 is rounded to have one decimal
            // but 0.1*i can have extra decimals due to round-off errors
            expect(children[i].stateValues.valueForDisplay).eq(i / 10);
            expect(children[i].stateValues.value).eq(0.1 * i);
        }
    });

    it("sequence with number operators", async () => {
        let core = await createTestCore({
            doenetML: `
    <math name="n">5</math>
    <number name="m">10</number>
    <p name="p"><sequence from="$min" to="$max"/></p>
    <number name="min">
      <min>$n<number>11</number></min>
    </number>
    <number name="max">
      <max><math>$m+3</math><number>11</number></max>
    </number>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        let children = stateVariables["/p"].activeChildren.map(
            (x) => stateVariables[x.componentIdx],
        );
        expect(children.length).eq(9);

        for (let i = 0; i < 9; i++) {
            expect(children[i].stateValues.valueForDisplay).eq(i + 5);
            expect(children[i].stateValues.value).eq(i + 5);
        }
    });

    it("initially invalid to", async () => {
        let core = await createTestCore({
            doenetML: `
  <mathInput name="n"/>
  <p name="p"><sequence name="seq" from="2" to="$n" /></p>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/seq"].stateValues.validSequence).eq(false);
        let children = stateVariables["/p"].activeChildren.map(
            (x) => stateVariables[x.componentIdx],
        );
        expect(children.length).eq(0);

        await updateMathInputValue({ latex: "2", name: "/n", core });

        stateVariables = await core.returnAllStateVariables(false, true);
        children = stateVariables["/p"].activeChildren.map(
            (x) => stateVariables[x.componentIdx],
        );
        expect(children.length).eq(1);
        expect(stateVariables[children[0].componentIdx].stateValues.value).eq(
            2,
        );
        expect(stateVariables["/seq"].stateValues.validSequence).eq(true);
    });

    it("number sequence, excluding every 3 plus another", async () => {
        let core = await createTestCore({
            doenetML: `
    <p name="p"><sequence name="every3" hide from="2" to="10" step="3" /><sequence from="1" to="10" exclude="$every3 9" /></p>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/p"].stateValues.text).eq("1, 3, 4, 6, 7, 10");
    });

    it("number sequence, excluding from different sources", async () => {
        let core = await createTestCore({
            doenetML: `
    <mathList name="e1">4 6</mathList><numberList name="e2">2 8</numberList><number name="e3">7</number>
    <p name="p"><sequence from="1" to="10" exclude="$e1 $e2 $e3" /></p>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/p"].stateValues.text).eq("1, 3, 5, 9, 10");
    });

    it("sequences hide dynamically", async () => {
        let core = await createTestCore({
            doenetML: `
    <booleanInput name='h1' prefill="false" >
      <label>Hide first sequence</label>
    </booleanInput>
    <booleanInput name='h2' prefill="true" >
      <label>Hide second sequence</label>
    </booleanInput>
    <p>Length of sequence 1: <mathInput name="n1" prefill="4" /></p>
    <p>Length of sequence 2: <mathInput name="n2" prefill="4" /></p>

    <p name="s1">sequence 1: <sequence hide="$h1" length="$n1" /></p>
    <p name="s2">sequence 2: <sequence hide="$h2" length="$n2" /></p>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/s1"].stateValues.text).eq(
            "sequence 1: 1, 2, 3, 4",
        );
        expect(stateVariables["/s2"].stateValues.text).eq("sequence 2: ");

        await updateMathInputValue({ latex: "6", name: "/n1", core });
        await updateMathInputValue({ latex: "6", name: "/n2", core });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/s1"].stateValues.text).eq(
            "sequence 1: 1, 2, 3, 4, 5, 6",
        );
        expect(stateVariables["/s2"].stateValues.text).eq("sequence 2: ");

        await updateBooleanInputValue({
            boolean: true,
            name: "/h1",
            core,
        });
        await updateBooleanInputValue({
            boolean: false,
            name: "/h2",
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/s1"].stateValues.text).eq("sequence 1: ");
        expect(stateVariables["/s2"].stateValues.text).eq(
            "sequence 2: 1, 2, 3, 4, 5, 6",
        );

        await updateMathInputValue({ latex: "8", name: "/n1", core });
        await updateMathInputValue({ latex: "8", name: "/n2", core });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/s1"].stateValues.text).eq("sequence 1: ");
        expect(stateVariables["/s2"].stateValues.text).eq(
            "sequence 2: 1, 2, 3, 4, 5, 6, 7, 8",
        );

        await updateBooleanInputValue({
            boolean: false,
            name: "/h1",
            core,
        });
        await updateBooleanInputValue({
            boolean: true,
            name: "/h2",
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/s1"].stateValues.text).eq(
            "sequence 1: 1, 2, 3, 4, 5, 6, 7, 8",
        );
        expect(stateVariables["/s2"].stateValues.text).eq("sequence 2: ");

        await updateMathInputValue({ latex: "3", name: "/n1", core });
        await updateMathInputValue({ latex: "3", name: "/n2", core });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/s1"].stateValues.text).eq(
            "sequence 1: 1, 2, 3",
        );
        expect(stateVariables["/s2"].stateValues.text).eq("sequence 2: ");

        await updateBooleanInputValue({
            boolean: true,
            name: "/h1",
            core,
        });
        await updateBooleanInputValue({
            boolean: false,
            name: "/h2",
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/s1"].stateValues.text).eq("sequence 1: ");
        expect(stateVariables["/s2"].stateValues.text).eq(
            "sequence 2: 1, 2, 3",
        );

        await updateMathInputValue({ latex: "4", name: "/n1", core });
        await updateMathInputValue({ latex: "4", name: "/n2", core });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/s1"].stateValues.text).eq("sequence 1: ");
        expect(stateVariables["/s2"].stateValues.text).eq(
            "sequence 2: 1, 2, 3, 4",
        );
    });

    it("sequence fixed by default", async () => {
        let core = await createTestCore({
            doenetML: `
    <p>From: <mathInput name="from" prefill="1" /></p>
    <p>Step: <mathInput name="step" prefill="2" /></p>

    <p name="theList"><sequence assignNames="a b" from="$from" step="$step" to="7" /></p>

    <p>Change first: <mathInput name="a2" bindValueTo="$a" /></p>
    <p>Change second: <mathInput name="b2" bindValueTo="$b" /></p>

    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/theList"].stateValues.text).eq("1, 3, 5, 7");

        await updateMathInputValue({ latex: "21", name: "/a2", core });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/theList"].stateValues.text).eq("1, 3, 5, 7");

        await updateMathInputValue({ latex: "2", name: "/b2", core });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/theList"].stateValues.text).eq("1, 3, 5, 7");

        await updateMathInputValue({
            latex: "4",
            name: "/from",
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/theList"].stateValues.text).eq("4, 6");

        await updateMathInputValue({ latex: "8", name: "/a2", core });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/theList"].stateValues.text).eq("4, 6");

        await updateMathInputValue({ latex: "2", name: "/b2", core });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/theList"].stateValues.text).eq("4, 6");

        await updateMathInputValue({
            latex: "6",
            name: "/step",
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/theList"].stateValues.text).eq("4");

        await updateMathInputValue({ latex: "9", name: "/a2", core });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/theList"].stateValues.text).eq("4");

        await updateMathInputValue({ latex: "41", name: "/b2", core });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/theList"].stateValues.text).eq("4");
    });

    it("can override fixed property", async () => {
        let core = await createTestCore({
            doenetML: `
    <p>From: <mathInput name="from" prefill="1" /></p>
    <p>Step: <mathInput name="step" prefill="2" /></p>
    <p>Fixed: <booleanInput name="fx" /></p>

    <p name="theList"><sequence assignNames="a b" from="$from" step="$step" to="7" fixed="$fx" /></p>

    <p>Change first: <mathInput name="a2" bindValueTo="$a" /></p>
    <p>Change second: <mathInput name="b2" bindValueTo="$b" /></p>

    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/theList"].stateValues.text).eq("1, 3, 5, 7");

        await updateMathInputValue({ latex: "21", name: "/a2", core });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/theList"].stateValues.text).eq("21, 3, 5, 7");

        await updateMathInputValue({ latex: "0", name: "/b2", core });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/theList"].stateValues.text).eq("21, 0, 5, 7");

        await updateMathInputValue({
            latex: "4",
            name: "/from",
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/theList"].stateValues.text).eq("4, 6");

        await updateMathInputValue({ latex: "8", name: "/a2", core });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/theList"].stateValues.text).eq("8, 6");

        await updateMathInputValue({ latex: "2", name: "/b2", core });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/theList"].stateValues.text).eq("8, 2");

        await updateMathInputValue({
            latex: "6",
            name: "/step",
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/theList"].stateValues.text).eq("4");

        await updateMathInputValue({ latex: "9", name: "/a2", core });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/theList"].stateValues.text).eq("9");

        await updateMathInputValue({ latex: "41", name: "/b2", core });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/theList"].stateValues.text).eq("9");

        await updateBooleanInputValue({
            boolean: true,
            name: "/fx",
            core,
        });

        await updateMathInputValue({
            latex: "1",
            name: "/step",
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/theList"].stateValues.text).eq("4, 5, 6, 7");

        await updateMathInputValue({ latex: "9", name: "/a2", core });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/theList"].stateValues.text).eq("4, 5, 6, 7");

        await updateMathInputValue({ latex: "41", name: "/b2", core });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/theList"].stateValues.text).eq("4, 5, 6, 7");

        await updateBooleanInputValue({
            boolean: false,
            name: "/fx",
            core,
        });

        await updateMathInputValue({ latex: "9", name: "/a2", core });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/theList"].stateValues.text).eq("9, 5, 6, 7");

        await updateMathInputValue({ latex: "41", name: "/b2", core });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/theList"].stateValues.text).eq("9, 41, 6, 7");
    });

    it('copies with link="false" are not fixed', async () => {
        let core = await createTestCore({
            doenetML: `
    <p>From: <mathInput name="from" prefill="1" /></p>
    <p>Step: <mathInput name="step" prefill="2" /></p>

    <p name="theList"><sequence assignNames="a b" from="$from" step="$step" to="7" /></p>

    <p>Change first: <mathInput name="a2" bindValueTo="$a{link='false'}" /></p>
    <p>Change second: <mathInput name="b2" bindValueTo="$b{link='false'}" /></p>

    <p>Copy of a2: $a2{name="a3"}</p>
    <p>Copy of b2: $b2{name="b3"}</p>

    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/theList"].stateValues.text).eq("1, 3, 5, 7");
        expect(stateVariables["/a2"].stateValues.value.tree).eq(1);
        expect(stateVariables["/b2"].stateValues.value.tree).eq(3);
        expect(stateVariables["/a3"].stateValues.value.tree).eq(1);
        expect(stateVariables["/b3"].stateValues.value.tree).eq(3);

        await updateMathInputValue({ latex: "21", name: "/a2", core });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/theList"].stateValues.text).eq("1, 3, 5, 7");
        expect(stateVariables["/a2"].stateValues.value.tree).eq(21);
        expect(stateVariables["/b2"].stateValues.value.tree).eq(3);
        expect(stateVariables["/a3"].stateValues.value.tree).eq(21);
        expect(stateVariables["/b3"].stateValues.value.tree).eq(3);

        await updateMathInputValue({ latex: "0", name: "/b2", core });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/theList"].stateValues.text).eq("1, 3, 5, 7");
        expect(stateVariables["/a2"].stateValues.value.tree).eq(21);
        expect(stateVariables["/b2"].stateValues.value.tree).eq(0);
        expect(stateVariables["/a3"].stateValues.value.tree).eq(21);
        expect(stateVariables["/b3"].stateValues.value.tree).eq(0);

        await updateMathInputValue({
            latex: "4",
            name: "/from",
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/theList"].stateValues.text).eq("4, 6");
        expect(stateVariables["/a2"].stateValues.value.tree).eq(21);
        expect(stateVariables["/b2"].stateValues.value.tree).eq(0);
        expect(stateVariables["/a3"].stateValues.value.tree).eq(21);
        expect(stateVariables["/b3"].stateValues.value.tree).eq(0);

        await updateMathInputValue({ latex: "8", name: "/a2", core });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/theList"].stateValues.text).eq("4, 6");
        expect(stateVariables["/a2"].stateValues.value.tree).eq(8);
        expect(stateVariables["/b2"].stateValues.value.tree).eq(0);
        expect(stateVariables["/a3"].stateValues.value.tree).eq(8);
        expect(stateVariables["/b3"].stateValues.value.tree).eq(0);

        await updateMathInputValue({
            latex: "6",
            name: "/step",
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/theList"].stateValues.text).eq("4");
        expect(stateVariables["/a2"].stateValues.value.tree).eq(8);
        expect(stateVariables["/b2"].stateValues.value.tree).eq(0);
        expect(stateVariables["/a3"].stateValues.value.tree).eq(8);
        expect(stateVariables["/b3"].stateValues.value.tree).eq(0);

        await updateMathInputValue({ latex: "9", name: "/a2", core });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/theList"].stateValues.text).eq("4");
        expect(stateVariables["/a2"].stateValues.value.tree).eq(9);
        expect(stateVariables["/b2"].stateValues.value.tree).eq(0);
        expect(stateVariables["/a3"].stateValues.value.tree).eq(9);
        expect(stateVariables["/b3"].stateValues.value.tree).eq(0);

        await updateMathInputValue({ latex: "2", name: "/b2", core });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/theList"].stateValues.text).eq("4");
        expect(stateVariables["/a2"].stateValues.value.tree).eq(9);
        expect(stateVariables["/b2"].stateValues.value.tree).eq(2);
        expect(stateVariables["/a3"].stateValues.value.tree).eq(9);
        expect(stateVariables["/b3"].stateValues.value.tree).eq(2);

        await updateMathInputValue({
            latex: "8",
            name: "/from",
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/theList"].stateValues.text).eq("");
        expect(stateVariables["/a2"].stateValues.value.tree).eq(9);
        expect(stateVariables["/b2"].stateValues.value.tree).eq(2);
        expect(stateVariables["/a3"].stateValues.value.tree).eq(9);
        expect(stateVariables["/b3"].stateValues.value.tree).eq(2);

        await updateMathInputValue({ latex: "3", name: "/a2", core });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/theList"].stateValues.text).eq("");
        expect(stateVariables["/a2"].stateValues.value.tree).eq(3);
        expect(stateVariables["/b2"].stateValues.value.tree).eq(2);
        expect(stateVariables["/a3"].stateValues.value.tree).eq(3);
        expect(stateVariables["/b3"].stateValues.value.tree).eq(2);

        await updateMathInputValue({
            latex: "3",
            name: "/step",
            core,
        });
        await updateMathInputValue({
            latex: "0",
            name: "/from",
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/theList"].stateValues.text).eq("0, 3, 6");
        expect(stateVariables["/a2"].stateValues.value.tree).eq(3);
        expect(stateVariables["/b2"].stateValues.value.tree).eq(2);
        expect(stateVariables["/a3"].stateValues.value.tree).eq(3);
        expect(stateVariables["/b3"].stateValues.value.tree).eq(2);

        await updateMathInputValue({ latex: "8", name: "/a2", core });
        await updateMathInputValue({ latex: "7", name: "/b2", core });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/theList"].stateValues.text).eq("0, 3, 6");
        expect(stateVariables["/a2"].stateValues.value.tree).eq(8);
        expect(stateVariables["/b2"].stateValues.value.tree).eq(7);
        expect(stateVariables["/a3"].stateValues.value.tree).eq(8);
        expect(stateVariables["/b3"].stateValues.value.tree).eq(7);
    });

    it("number sequence, from and to using strings with operators", async () => {
        let core = await createTestCore({
            doenetML: `
    <p name="p"><sequence from="2-5" to="3+1"/></p>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        let children = stateVariables["/p"].activeChildren.map(
            (x) => stateVariables[x.componentIdx],
        );
        expect(children.length).eq(8);
        for (let i = 0; i < 8; i++) {
            expect(children[i].stateValues.value).eq(-3 + i);
        }
    });

    it("number sequence, excludes with operators from macros", async () => {
        let core = await createTestCore({
            doenetML: `
    <number name="n1">2</number>
    <number name="n2">6</number>
    <p name="p"><sequence from="0" to="8" exclude="$n1 $n2-$n1 $n2/$n1 $n2+1" /></p>
    `,
        });

        let nums = [0, 1, 5, 6, 8];

        let stateVariables = await core.returnAllStateVariables(false, true);
        let children = stateVariables["/p"].activeChildren.map(
            (x) => stateVariables[x.componentIdx],
        );
        expect(children.length).eq(nums.length);
        for (let [ind, child] of children.entries()) {
            expect(child.stateValues.value).eq(nums[ind]);
        }
    });

    it("warnings", async () => {
        let core = await createTestCore({
            doenetML: `
    <sequence length="-1"/>
    <sequence step="x"/>
    <sequence type="letters" step="x" />
    <sequence from="y" />
    <sequence type="letters" from="1" />
    <sequence type="math" from="$nan" />
    <sequence to="y" />
    <sequence type="letters" to="1" />
    <sequence type="math" to="$nan" />

    <number name="nan" />
    `,
        });

        let errorWarnings = core.core!.errorWarnings;

        expect(errorWarnings.errors.length).eq(0);
        expect(errorWarnings.warnings.length).eq(9);

        expect(errorWarnings.warnings[0].message).contain(
            `Invalid length of sequence.  Must be a non-negative integer`,
        );
        expect(errorWarnings.warnings[0].level).eq(1);
        expect(errorWarnings.warnings[0].doenetMLrange.lineBegin).eq(2);
        expect(errorWarnings.warnings[0].doenetMLrange.charBegin).eq(5);
        expect(errorWarnings.warnings[0].doenetMLrange.lineEnd).eq(2);
        expect(errorWarnings.warnings[0].doenetMLrange.charEnd).eq(27);

        expect(errorWarnings.warnings[1].message).contain(
            `Invalid step of sequence.  Must be a number for sequence of type number`,
        );
        expect(errorWarnings.warnings[1].level).eq(1);
        expect(errorWarnings.warnings[1].doenetMLrange.lineBegin).eq(3);
        expect(errorWarnings.warnings[1].doenetMLrange.charBegin).eq(5);
        expect(errorWarnings.warnings[1].doenetMLrange.lineEnd).eq(3);
        expect(errorWarnings.warnings[1].doenetMLrange.charEnd).eq(24);

        expect(errorWarnings.warnings[2].message).contain(
            `Invalid step of sequence.  Must be a number for sequence of type letters`,
        );
        expect(errorWarnings.warnings[2].level).eq(1);
        expect(errorWarnings.warnings[2].doenetMLrange.lineBegin).eq(4);
        expect(errorWarnings.warnings[2].doenetMLrange.charBegin).eq(5);
        expect(errorWarnings.warnings[2].doenetMLrange.lineEnd).eq(4);
        expect(errorWarnings.warnings[2].doenetMLrange.charEnd).eq(40);

        expect(errorWarnings.warnings[3].message).contain(
            `Invalid "from" of number sequence.  Must be a number`,
        );
        expect(errorWarnings.warnings[3].level).eq(1);
        expect(errorWarnings.warnings[3].doenetMLrange.lineBegin).eq(5);
        expect(errorWarnings.warnings[3].doenetMLrange.charBegin).eq(5);
        expect(errorWarnings.warnings[3].doenetMLrange.lineEnd).eq(5);
        expect(errorWarnings.warnings[3].doenetMLrange.charEnd).eq(25);

        expect(errorWarnings.warnings[4].message).contain(
            `Invalid "from" of letters sequence.  Must be a letter combination`,
        );
        expect(errorWarnings.warnings[4].level).eq(1);
        expect(errorWarnings.warnings[4].doenetMLrange.lineBegin).eq(6);
        expect(errorWarnings.warnings[4].doenetMLrange.charBegin).eq(5);
        expect(errorWarnings.warnings[4].doenetMLrange.lineEnd).eq(6);
        expect(errorWarnings.warnings[4].doenetMLrange.charEnd).eq(40);

        expect(errorWarnings.warnings[5].message).contain(
            `Invalid "from" of sequence`,
        );
        expect(errorWarnings.warnings[5].level).eq(1);
        expect(errorWarnings.warnings[5].doenetMLrange.lineBegin).eq(7);
        expect(errorWarnings.warnings[5].doenetMLrange.charBegin).eq(5);
        expect(errorWarnings.warnings[5].doenetMLrange.lineEnd).eq(7);
        expect(errorWarnings.warnings[5].doenetMLrange.charEnd).eq(40);

        expect(errorWarnings.warnings[6].message).contain(
            `Invalid "to" of number sequence.  Must be a number.`,
        );
        expect(errorWarnings.warnings[6].level).eq(1);
        expect(errorWarnings.warnings[6].doenetMLrange.lineBegin).eq(8);
        expect(errorWarnings.warnings[6].doenetMLrange.charBegin).eq(5);
        expect(errorWarnings.warnings[6].doenetMLrange.lineEnd).eq(8);
        expect(errorWarnings.warnings[6].doenetMLrange.charEnd).eq(23);

        expect(errorWarnings.warnings[7].message).contain(
            `Invalid "to" of letters sequence.  Must be a letter combination`,
        );
        expect(errorWarnings.warnings[7].level).eq(1);
        expect(errorWarnings.warnings[7].doenetMLrange.lineBegin).eq(9);
        expect(errorWarnings.warnings[7].doenetMLrange.charBegin).eq(5);
        expect(errorWarnings.warnings[7].doenetMLrange.lineEnd).eq(9);
        expect(errorWarnings.warnings[7].doenetMLrange.charEnd).eq(38);

        expect(errorWarnings.warnings[8].message).contain(
            `Invalid "to" of sequence`,
        );
        expect(errorWarnings.warnings[8].level).eq(1);
        expect(errorWarnings.warnings[8].doenetMLrange.lineBegin).eq(10);
        expect(errorWarnings.warnings[8].doenetMLrange.charBegin).eq(5);
        expect(errorWarnings.warnings[8].doenetMLrange.lineEnd).eq(10);
        expect(errorWarnings.warnings[8].doenetMLrange.charEnd).eq(38);
    });

    it("sequence displays as list by default", async () => {
        let core = await createTestCore({
            doenetML: `
    <p name="pdefault"><sequence name="default" /></p>
    <p name="pnocommas"><sequence asList="false" name="nocommas" /></p>
    <p name="pwithcommas"><sequence asList name="withcommas" /></p>
    <p name="pdefault2">$default</p>
    <p name="pnocommas2">$nocommas</p>
    <p name="pwithcommas2">$withcommas</p>
    <p name="pnocommas3">$default{asList="false"}</p>
    <p name="pnocommas3a">$withcommas{asList="false"}</p>
    <p name="pwithcommas3">$nocommas{asList="true"}</p>
    <p name="pdefault4" copysource="pdefault" />
    <p name="pnocommas4" copysource="pnocommas" />
    <p name="pwithcommas4" copysource="pwithcommas" />
    <p name="pdefault5" copysource="pdefault2" />
    <p name="pnocommas5" copysource="pnocommas2" />
    <p name="pwithcommas5" copysource="pwithcommas2" />
    <p name="pnocommas6" copysource="pnocommas3" />
    <p name="pnocommas6a" copysource="pnocommas3a" />
    <p name="pwithcommas6" copysource="pwithcommas3" />

    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/pdefault"].stateValues.text).eq(
            "1, 2, 3, 4, 5, 6, 7, 8, 9, 10",
        );
        expect(stateVariables["/pdefault2"].stateValues.text).eq(
            "1, 2, 3, 4, 5, 6, 7, 8, 9, 10",
        );
        expect(stateVariables["/pdefault4"].stateValues.text).eq(
            "1, 2, 3, 4, 5, 6, 7, 8, 9, 10",
        );
        expect(stateVariables["/pdefault5"].stateValues.text).eq(
            "1, 2, 3, 4, 5, 6, 7, 8, 9, 10",
        );
        expect(stateVariables["/pnocommas"].stateValues.text).eq("12345678910");
        expect(stateVariables["/pnocommas2"].stateValues.text).eq(
            "12345678910",
        );
        expect(stateVariables["/pnocommas3"].stateValues.text).eq(
            "12345678910",
        );
        expect(stateVariables["/pnocommas3a"].stateValues.text).eq(
            "12345678910",
        );
        expect(stateVariables["/pnocommas4"].stateValues.text).eq(
            "12345678910",
        );
        expect(stateVariables["/pnocommas5"].stateValues.text).eq(
            "12345678910",
        );
        expect(stateVariables["/pnocommas6"].stateValues.text).eq(
            "12345678910",
        );
        expect(stateVariables["/pnocommas6a"].stateValues.text).eq(
            "12345678910",
        );
        expect(stateVariables["/pwithcommas"].stateValues.text).eq(
            "1, 2, 3, 4, 5, 6, 7, 8, 9, 10",
        );
        expect(stateVariables["/pwithcommas2"].stateValues.text).eq(
            "1, 2, 3, 4, 5, 6, 7, 8, 9, 10",
        );
        expect(stateVariables["/pwithcommas3"].stateValues.text).eq(
            "1, 2, 3, 4, 5, 6, 7, 8, 9, 10",
        );
        expect(stateVariables["/pwithcommas4"].stateValues.text).eq(
            "1, 2, 3, 4, 5, 6, 7, 8, 9, 10",
        );
        expect(stateVariables["/pwithcommas5"].stateValues.text).eq(
            "1, 2, 3, 4, 5, 6, 7, 8, 9, 10",
        );
        expect(stateVariables["/pwithcommas6"].stateValues.text).eq(
            "1, 2, 3, 4, 5, 6, 7, 8, 9, 10",
        );
    });

    it("rounding", async () => {
        let core = await createTestCore({
            doenetML: `
    <text>a</text>
    <p><sequence assignNames="n1a n1b n1c" from="10.12345" length="3" step="0.03257" displayDigits="10" /></p>
    <p><sequence assignNames="n2a n2b n2c" from="10.12345" length="3" step="0.03257" displayDigits="3" /></p>
    <p><sequence assignNames="n3a n3b n3c" from="10.12345" length="3" step="0.03257" displayDecimals="3" /></p>
    <p><sequence assignNames="n4a n4b n4c" from="10" length="3" displayDigits="3" padZeros /></p>

    <p><number name="n1a1">$n1a</number> <number name="n1b1">$n1b</number> <number name="n1c1">$n1c</number></p>
    <p><number name="n2a1">$n2a</number> <number name="n2b1">$n2b</number> <number name="n2c1">$n2c</number></p>
    <p><number name="n3a1">$n3a</number> <number name="n3b1">$n3b</number> <number name="n3c1">$n3c</number></p>
    <p><number name="n4a1">$n4a</number> <number name="n4b1">$n4b</number> <number name="n4c1">$n4c</number></p>

    `,
        });

        let na = 10.12345;
        let nb = na + 0.03257;
        let nc = nb + 0.03257;

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/n1a"].stateValues.text).eq(
            String(Math.round(na * 10 ** 8) / 10 ** 8),
        );
        expect(stateVariables["/n1b"].stateValues.text).eq(
            String(Math.round(nb * 10 ** 8) / 10 ** 8),
        );
        expect(stateVariables["/n1c"].stateValues.text).eq(
            String(Math.round(nc * 10 ** 8) / 10 ** 8),
        );
        expect(stateVariables["/n2a"].stateValues.text).eq(
            String(Math.round(na * 10 ** 1) / 10 ** 1),
        );
        expect(stateVariables["/n2b"].stateValues.text).eq(
            String(Math.round(nb * 10 ** 1) / 10 ** 1),
        );
        expect(stateVariables["/n2c"].stateValues.text).eq(
            String(Math.round(nc * 10 ** 1) / 10 ** 1),
        );
        expect(stateVariables["/n3a"].stateValues.text).eq(
            String(Math.round(na * 10 ** 3) / 10 ** 3),
        );
        expect(stateVariables["/n3b"].stateValues.text).eq(
            String(Math.round(nb * 10 ** 3) / 10 ** 3),
        );
        expect(stateVariables["/n3c"].stateValues.text).eq(
            String(Math.round(nc * 10 ** 3) / 10 ** 3),
        );
        expect(stateVariables["/n4a"].stateValues.text).eq("10.0");
        expect(stateVariables["/n4b"].stateValues.text).eq("11.0");
        expect(stateVariables["/n4c"].stateValues.text).eq("12.0");

        expect(stateVariables["/n1a1"].stateValues.text).eq(
            String(Math.round(na * 10 ** 8) / 10 ** 8),
        );
        expect(stateVariables["/n1b1"].stateValues.text).eq(
            String(Math.round(nb * 10 ** 8) / 10 ** 8),
        );
        expect(stateVariables["/n1c1"].stateValues.text).eq(
            String(Math.round(nc * 10 ** 8) / 10 ** 8),
        );
        expect(stateVariables["/n2a1"].stateValues.text).eq(
            String(Math.round(na * 10 ** 1) / 10 ** 1),
        );
        expect(stateVariables["/n2b1"].stateValues.text).eq(
            String(Math.round(nb * 10 ** 1) / 10 ** 1),
        );
        expect(stateVariables["/n2c1"].stateValues.text).eq(
            String(Math.round(nc * 10 ** 1) / 10 ** 1),
        );
        expect(stateVariables["/n3a1"].stateValues.text).eq(
            String(Math.round(na * 10 ** 3) / 10 ** 3),
        );
        expect(stateVariables["/n3b1"].stateValues.text).eq(
            String(Math.round(nb * 10 ** 3) / 10 ** 3),
        );
        expect(stateVariables["/n3c1"].stateValues.text).eq(
            String(Math.round(nc * 10 ** 3) / 10 ** 3),
        );
        expect(stateVariables["/n4a1"].stateValues.text).eq("10.0");
        expect(stateVariables["/n4b1"].stateValues.text).eq("11.0");
        expect(stateVariables["/n4c1"].stateValues.text).eq("12.0");
    });
});
