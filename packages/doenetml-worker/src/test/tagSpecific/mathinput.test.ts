import { describe, expect, it, vi } from "vitest";
import { createTestCore, returnAllStateVariables } from "../utils/test-core";
import { cleanLatex } from "../utils/math";
import {
    movePoint,
    updateBooleanInputValue,
    updateMathInputImmediateValue,
    updateMathInputValue,
    updateMathInputValueToImmediateValue,
} from "../utils/actions";
import me from "math-expressions";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);

describe("MathInput tag tests", async () => {
    it("mathInput references", async () => {
        // A fairly involved test
        // to check for bugs that have shown up after multiple manipulations

        let core = await createTestCore({
            doenetML: `
    <mathInput prefill='x+1' name="mi1" />
    <mathInput copySource="mi1" name="mi1a"  />
    <copy prop='value' source="mi1" assignNames="v1" />
    <copy prop='immediatevalue' source="mi1" assignNames="iv1"  />
    <copy prop='value' source="mi1a" assignNames="v1a" />
    <copy prop='immediatevalue' source="mi1a" assignNames="iv1a"  />
    <mathInput name="mi2" />
    <copy prop='value' source="mi2" assignNames="v2" />
    <copy prop='immediatevalue' source="mi2" assignNames="iv2"  />
    `,
        });

        let stateVariables = await returnAllStateVariables(core);
        expect(
            cleanLatex(stateVariables["/mi1"].stateValues.rawRendererValue),
        ).eq("x+1");
        expect(
            cleanLatex(stateVariables["/mi1a"].stateValues.rawRendererValue),
        ).eq("x+1");
        expect(
            cleanLatex(stateVariables["/mi2"].stateValues.rawRendererValue),
        ).eq("");

        expect(stateVariables["/mi1"].stateValues.immediateValue.tree).eqls([
            "+",
            "x",
            1,
        ]);
        expect(stateVariables["/mi1a"].stateValues.immediateValue.tree).eqls([
            "+",
            "x",
            1,
        ]);
        expect(stateVariables["/mi2"].stateValues.immediateValue.tree).to.eq(
            "\uFF3F",
        );
        expect(stateVariables["/mi1"].stateValues.value.tree).eqls([
            "+",
            "x",
            1,
        ]);
        expect(stateVariables["/mi1a"].stateValues.value.tree).eqls([
            "+",
            "x",
            1,
        ]);
        expect(stateVariables["/mi2"].stateValues.value.tree).to.eq("\uFF3F");

        // Type 2 in first mathInput
        await updateMathInputImmediateValue({
            latex: "x+12",
            name: "/mi1",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(
            cleanLatex(stateVariables["/mi1"].stateValues.rawRendererValue),
        ).eq("x+12");
        expect(
            cleanLatex(stateVariables["/mi1a"].stateValues.rawRendererValue),
        ).eq("x+12");
        expect(
            cleanLatex(stateVariables["/mi2"].stateValues.rawRendererValue),
        ).eq("");

        expect(stateVariables["/mi1"].stateValues.immediateValue.tree).eqls([
            "+",
            "x",
            12,
        ]);
        expect(stateVariables["/mi1a"].stateValues.immediateValue.tree).eqls([
            "+",
            "x",
            12,
        ]);
        expect(stateVariables["/mi2"].stateValues.immediateValue.tree).to.eq(
            "\uFF3F",
        );
        expect(stateVariables["/mi1"].stateValues.value.tree).eqls([
            "+",
            "x",
            1,
        ]);
        expect(stateVariables["/mi1a"].stateValues.value.tree).eqls([
            "+",
            "x",
            1,
        ]);
        expect(stateVariables["/mi2"].stateValues.value.tree).to.eq("\uFF3F");

        // Changing to 3 in first mathInput
        await updateMathInputImmediateValue({
            latex: "x+1",
            name: "/mi1",
            core,
        });
        await updateMathInputImmediateValue({
            latex: "x+13",
            name: "/mi1",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(
            cleanLatex(stateVariables["/mi1"].stateValues.rawRendererValue),
        ).eq("x+13");
        expect(
            cleanLatex(stateVariables["/mi1a"].stateValues.rawRendererValue),
        ).eq("x+13");
        expect(
            cleanLatex(stateVariables["/mi2"].stateValues.rawRendererValue),
        ).eq("");
        expect(stateVariables["/mi1"].stateValues.immediateValue.tree).eqls([
            "+",
            "x",
            13,
        ]);
        expect(stateVariables["/mi1a"].stateValues.immediateValue.tree).eqls([
            "+",
            "x",
            13,
        ]);
        expect(stateVariables["/mi2"].stateValues.immediateValue.tree).to.eq(
            "\uFF3F",
        );
        expect(stateVariables["/mi1"].stateValues.value.tree).eqls([
            "+",
            "x",
            1,
        ]);
        expect(stateVariables["/mi1a"].stateValues.value.tree).eqls([
            "+",
            "x",
            1,
        ]);
        expect(stateVariables["/mi2"].stateValues.value.tree).to.eq("\uFF3F");

        // Update value (e.g., by pressing Enter) in first mathInput
        await updateMathInputValueToImmediateValue({
            name: "/mi1",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(
            cleanLatex(stateVariables["/mi1"].stateValues.rawRendererValue),
        ).eq("x+13");
        expect(
            cleanLatex(stateVariables["/mi1a"].stateValues.rawRendererValue),
        ).eq("x+13");
        expect(
            cleanLatex(stateVariables["/mi2"].stateValues.rawRendererValue),
        ).eq("");

        expect(stateVariables["/mi1"].stateValues.immediateValue.tree).eqls([
            "+",
            "x",
            13,
        ]);
        expect(stateVariables["/mi1a"].stateValues.immediateValue.tree).eqls([
            "+",
            "x",
            13,
        ]);
        expect(stateVariables["/mi2"].stateValues.immediateValue.tree).to.eq(
            "\uFF3F",
        );
        expect(stateVariables["/mi1"].stateValues.value.tree).eqls([
            "+",
            "x",
            13,
        ]);
        expect(stateVariables["/mi1a"].stateValues.value.tree).eqls([
            "+",
            "x",
            13,
        ]);
        expect(stateVariables["/mi2"].stateValues.value.tree).to.eq("\uFF3F");

        // Erasing 13 and typing y second mathInput
        await updateMathInputImmediateValue({
            latex: "x+1",
            name: "/mi1a",
            core,
        });
        await updateMathInputImmediateValue({
            latex: "x+",
            name: "/mi1a",
            core,
        });
        await updateMathInputImmediateValue({
            latex: "x+y",
            name: "/mi1a",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(
            cleanLatex(stateVariables["/mi1"].stateValues.rawRendererValue),
        ).eq("x+y");
        expect(
            cleanLatex(stateVariables["/mi1a"].stateValues.rawRendererValue),
        ).eq("x+y");
        expect(
            cleanLatex(stateVariables["/mi2"].stateValues.rawRendererValue),
        ).eq("");

        expect(stateVariables["/mi1"].stateValues.immediateValue.tree).eqls([
            "+",
            "x",
            "y",
        ]);
        expect(stateVariables["/mi1a"].stateValues.immediateValue.tree).eqls([
            "+",
            "x",
            "y",
        ]);
        expect(stateVariables["/mi2"].stateValues.immediateValue.tree).to.eq(
            "\uFF3F",
        );
        expect(stateVariables["/mi1"].stateValues.value.tree).eqls([
            "+",
            "x",
            13,
        ]);
        expect(stateVariables["/mi1a"].stateValues.value.tree).eqls([
            "+",
            "x",
            13,
        ]);
        expect(stateVariables["/mi2"].stateValues.value.tree).to.eq("\uFF3F");

        // Update value (e.g., by changing focus) of second mathInput
        await updateMathInputValueToImmediateValue({
            name: "/mi1a",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(
            cleanLatex(stateVariables["/mi1"].stateValues.rawRendererValue),
        ).eq("x+y");
        expect(
            cleanLatex(stateVariables["/mi1a"].stateValues.rawRendererValue),
        ).eq("x+y");
        expect(
            cleanLatex(stateVariables["/mi2"].stateValues.rawRendererValue),
        ).eq("");

        expect(stateVariables["/mi1"].stateValues.immediateValue.tree).eqls([
            "+",
            "x",
            "y",
        ]);
        expect(stateVariables["/mi1a"].stateValues.immediateValue.tree).eqls([
            "+",
            "x",
            "y",
        ]);
        expect(stateVariables["/mi2"].stateValues.immediateValue.tree).to.eq(
            "\uFF3F",
        );
        expect(stateVariables["/mi1"].stateValues.value.tree).eqls([
            "+",
            "x",
            "y",
        ]);
        expect(stateVariables["/mi1a"].stateValues.value.tree).eqls([
            "+",
            "x",
            "y",
        ]);
        expect(stateVariables["/mi2"].stateValues.value.tree).to.eq("\uFF3F");

        // Typing pq in third mathInput
        await updateMathInputImmediateValue({
            latex: "p",
            name: "/mi2",
            core,
        });
        await updateMathInputImmediateValue({
            latex: "pq",
            name: "/mi2",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(
            cleanLatex(stateVariables["/mi1"].stateValues.rawRendererValue),
        ).eq("x+y");
        expect(
            cleanLatex(stateVariables["/mi1a"].stateValues.rawRendererValue),
        ).eq("x+y");
        expect(
            cleanLatex(stateVariables["/mi2"].stateValues.rawRendererValue),
        ).eq("pq");

        expect(stateVariables["/mi1"].stateValues.immediateValue.tree).eqls([
            "+",
            "x",
            "y",
        ]);
        expect(stateVariables["/mi1a"].stateValues.immediateValue.tree).eqls([
            "+",
            "x",
            "y",
        ]);
        expect(stateVariables["/mi2"].stateValues.immediateValue.tree).eqls([
            "*",
            "p",
            "q",
        ]);
        expect(stateVariables["/mi1"].stateValues.value.tree).eqls([
            "+",
            "x",
            "y",
        ]);
        expect(stateVariables["/mi1a"].stateValues.value.tree).eqls([
            "+",
            "x",
            "y",
        ]);
        expect(stateVariables["/mi2"].stateValues.value.tree).to.eq("\uFF3F");

        // update value (e.g., update value) in mathInput 3
        await updateMathInputValueToImmediateValue({
            name: "/mi2",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(
            cleanLatex(stateVariables["/mi1"].stateValues.rawRendererValue),
        ).eq("x+y");
        expect(
            cleanLatex(stateVariables["/mi1a"].stateValues.rawRendererValue),
        ).eq("x+y");
        expect(
            cleanLatex(stateVariables["/mi2"].stateValues.rawRendererValue),
        ).eq("pq");

        expect(stateVariables["/mi1"].stateValues.immediateValue.tree).eqls([
            "+",
            "x",
            "y",
        ]);
        expect(stateVariables["/mi1a"].stateValues.immediateValue.tree).eqls([
            "+",
            "x",
            "y",
        ]);
        expect(stateVariables["/mi2"].stateValues.immediateValue.tree).eqls([
            "*",
            "p",
            "q",
        ]);
        expect(stateVariables["/mi1"].stateValues.value.tree).eqls([
            "+",
            "x",
            "y",
        ]);
        expect(stateVariables["/mi1a"].stateValues.value.tree).eqls([
            "+",
            "x",
            "y",
        ]);
        expect(stateVariables["/mi2"].stateValues.value.tree).eqls([
            "*",
            "p",
            "q",
        ]);

        // type abc in mathInput 2
        await updateMathInputImmediateValue({
            latex: "",
            name: "/mi1a",
            core,
        });
        await updateMathInputImmediateValue({
            latex: "a",
            name: "/mi1a",
            core,
        });
        await updateMathInputImmediateValue({
            latex: "ab",
            name: "/mi1a",
            core,
        });
        await updateMathInputImmediateValue({
            latex: "abc",
            name: "/mi1a",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(
            cleanLatex(stateVariables["/mi1"].stateValues.rawRendererValue),
        ).eq("abc");
        expect(
            cleanLatex(stateVariables["/mi1a"].stateValues.rawRendererValue),
        ).eq("abc");
        expect(
            cleanLatex(stateVariables["/mi2"].stateValues.rawRendererValue),
        ).eq("pq");

        expect(stateVariables["/mi1"].stateValues.immediateValue.tree).eqls([
            "*",
            "a",
            "b",
            "c",
        ]);
        expect(stateVariables["/mi1a"].stateValues.immediateValue.tree).eqls([
            "*",
            "a",
            "b",
            "c",
        ]);
        expect(stateVariables["/mi2"].stateValues.immediateValue.tree).eqls([
            "*",
            "p",
            "q",
        ]);
        expect(stateVariables["/mi1"].stateValues.value.tree).eqls([
            "+",
            "x",
            "y",
        ]);
        expect(stateVariables["/mi1a"].stateValues.value.tree).eqls([
            "+",
            "x",
            "y",
        ]);
        expect(stateVariables["/mi2"].stateValues.value.tree).eqls([
            "*",
            "p",
            "q",
        ]);

        // update value (e.g., blur) mathInput 2
        await updateMathInputValueToImmediateValue({
            name: "/mi1a",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(
            cleanLatex(stateVariables["/mi1"].stateValues.rawRendererValue),
        ).eq("abc");
        expect(
            cleanLatex(stateVariables["/mi1a"].stateValues.rawRendererValue),
        ).eq("abc");
        expect(
            cleanLatex(stateVariables["/mi2"].stateValues.rawRendererValue),
        ).eq("pq");

        expect(stateVariables["/mi1"].stateValues.immediateValue.tree).eqls([
            "*",
            "a",
            "b",
            "c",
        ]);
        expect(stateVariables["/mi1a"].stateValues.immediateValue.tree).eqls([
            "*",
            "a",
            "b",
            "c",
        ]);
        expect(stateVariables["/mi2"].stateValues.immediateValue.tree).eqls([
            "*",
            "p",
            "q",
        ]);
        expect(stateVariables["/mi1"].stateValues.value.tree).eqls([
            "*",
            "a",
            "b",
            "c",
        ]);
        expect(stateVariables["/mi1a"].stateValues.value.tree).eqls([
            "*",
            "a",
            "b",
            "c",
        ]);
        expect(stateVariables["/mi2"].stateValues.value.tree).eqls([
            "*",
            "p",
            "q",
        ]);

        // delete and reenter abc in mathInput 1

        await updateMathInputImmediateValue({
            latex: "",
            name: "/mi1",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(
            cleanLatex(stateVariables["/mi1"].stateValues.rawRendererValue),
        ).eq("");

        await updateMathInputImmediateValue({
            latex: "a",
            name: "/mi1",
            core,
        });
        await updateMathInputImmediateValue({
            latex: "ab",
            name: "/mi1",
            core,
        });
        await updateMathInputImmediateValue({
            latex: "abc",
            name: "/mi1",
            core,
        });
        await updateMathInputValueToImmediateValue({
            name: "/mi1",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(
            cleanLatex(stateVariables["/mi1"].stateValues.rawRendererValue),
        ).eq("abc");
        expect(
            cleanLatex(stateVariables["/mi1a"].stateValues.rawRendererValue),
        ).eq("abc");
        expect(
            cleanLatex(stateVariables["/mi2"].stateValues.rawRendererValue),
        ).eq("pq");

        expect(stateVariables["/mi1"].stateValues.immediateValue.tree).eqls([
            "*",
            "a",
            "b",
            "c",
        ]);
        expect(stateVariables["/mi1a"].stateValues.immediateValue.tree).eqls([
            "*",
            "a",
            "b",
            "c",
        ]);
        expect(stateVariables["/mi2"].stateValues.immediateValue.tree).eqls([
            "*",
            "p",
            "q",
        ]);
        expect(stateVariables["/mi1"].stateValues.value.tree).eqls([
            "*",
            "a",
            "b",
            "c",
        ]);
        expect(stateVariables["/mi1a"].stateValues.value.tree).eqls([
            "*",
            "a",
            "b",
            "c",
        ]);
        expect(stateVariables["/mi2"].stateValues.value.tree).eqls([
            "*",
            "p",
            "q",
        ]);

        // type u/v in mathInput 3

        await updateMathInputImmediateValue({
            latex: "",
            name: "/mi2",
            core,
        });
        await updateMathInputImmediateValue({
            latex: "u",
            name: "/mi2",
            core,
        });
        await updateMathInputImmediateValue({
            latex: "u/",
            name: "/mi2",
            core,
        });
        await updateMathInputImmediateValue({
            latex: "u/v",
            name: "/mi2",
            core,
        });

        stateVariables = await returnAllStateVariables(core);

        expect(
            cleanLatex(stateVariables["/mi1"].stateValues.rawRendererValue),
        ).eq("abc");
        expect(
            cleanLatex(stateVariables["/mi1a"].stateValues.rawRendererValue),
        ).eq("abc");
        expect(
            cleanLatex(stateVariables["/mi2"].stateValues.rawRendererValue),
        ).eq("u/v");

        expect(stateVariables["/mi1"].stateValues.immediateValue.tree).eqls([
            "*",
            "a",
            "b",
            "c",
        ]);
        expect(stateVariables["/mi1a"].stateValues.immediateValue.tree).eqls([
            "*",
            "a",
            "b",
            "c",
        ]);
        expect(stateVariables["/mi2"].stateValues.immediateValue.tree).eqls([
            "/",
            "u",
            "v",
        ]);
        expect(stateVariables["/mi1"].stateValues.value.tree).eqls([
            "*",
            "a",
            "b",
            "c",
        ]);
        expect(stateVariables["/mi1a"].stateValues.value.tree).eqls([
            "*",
            "a",
            "b",
            "c",
        ]);
        expect(stateVariables["/mi2"].stateValues.value.tree).eqls([
            "*",
            "p",
            "q",
        ]);

        // blue mathInput 2 and type d in mathInput 1
        await updateMathInputValueToImmediateValue({
            name: "/mi2",
            core,
        });

        await updateMathInputImmediateValue({
            latex: "abcd",
            name: "/mi1",
            core,
        });

        stateVariables = await returnAllStateVariables(core);

        expect(
            cleanLatex(stateVariables["/mi1"].stateValues.rawRendererValue),
        ).eq("abcd");
        expect(
            cleanLatex(stateVariables["/mi1a"].stateValues.rawRendererValue),
        ).eq("abcd");
        expect(
            cleanLatex(stateVariables["/mi2"].stateValues.rawRendererValue),
        ).eq("u/v");

        expect(stateVariables["/mi1"].stateValues.immediateValue.tree).eqls([
            "*",
            "a",
            "b",
            "c",
            "d",
        ]);
        expect(stateVariables["/mi1a"].stateValues.immediateValue.tree).eqls([
            "*",
            "a",
            "b",
            "c",
            "d",
        ]);
        expect(stateVariables["/mi2"].stateValues.immediateValue.tree).eqls([
            "/",
            "u",
            "v",
        ]);
        expect(stateVariables["/mi1"].stateValues.value.tree).eqls([
            "*",
            "a",
            "b",
            "c",
        ]);
        expect(stateVariables["/mi1a"].stateValues.value.tree).eqls([
            "*",
            "a",
            "b",
            "c",
        ]);
        expect(stateVariables["/mi2"].stateValues.value.tree).eqls([
            "/",
            "u",
            "v",
        ]);

        // Update value (e.g., blur) first mathInput
        await updateMathInputValueToImmediateValue({
            name: "/mi1",
            core,
        });

        stateVariables = await returnAllStateVariables(core);

        expect(
            cleanLatex(stateVariables["/mi1"].stateValues.rawRendererValue),
        ).eq("abcd");
        expect(
            cleanLatex(stateVariables["/mi1a"].stateValues.rawRendererValue),
        ).eq("abcd");
        expect(
            cleanLatex(stateVariables["/mi2"].stateValues.rawRendererValue),
        ).eq("u/v");

        expect(stateVariables["/mi1"].stateValues.immediateValue.tree).eqls([
            "*",
            "a",
            "b",
            "c",
            "d",
        ]);
        expect(stateVariables["/mi1a"].stateValues.immediateValue.tree).eqls([
            "*",
            "a",
            "b",
            "c",
            "d",
        ]);
        expect(stateVariables["/mi2"].stateValues.immediateValue.tree).eqls([
            "/",
            "u",
            "v",
        ]);
        expect(stateVariables["/mi1"].stateValues.value.tree).eqls([
            "*",
            "a",
            "b",
            "c",
            "d",
        ]);
        expect(stateVariables["/mi1a"].stateValues.value.tree).eqls([
            "*",
            "a",
            "b",
            "c",
            "d",
        ]);
        expect(stateVariables["/mi2"].stateValues.value.tree).eqls([
            "/",
            "u",
            "v",
        ]);

        // Clearing second mathInput

        await updateMathInputImmediateValue({
            latex: "",
            name: "/mi1a",
            core,
        });

        stateVariables = await returnAllStateVariables(core);

        expect(
            cleanLatex(stateVariables["/mi1"].stateValues.rawRendererValue),
        ).eq("");
        expect(
            cleanLatex(stateVariables["/mi1a"].stateValues.rawRendererValue),
        ).eq("");
        expect(
            cleanLatex(stateVariables["/mi2"].stateValues.rawRendererValue),
        ).eq("u/v");

        expect(stateVariables["/mi1"].stateValues.immediateValue.tree).to.eq(
            "\uFF3F",
        );
        expect(stateVariables["/mi1a"].stateValues.immediateValue.tree).to.eq(
            "\uFF3F",
        );
        expect(stateVariables["/mi2"].stateValues.immediateValue.tree).eqls([
            "/",
            "u",
            "v",
        ]);
        expect(stateVariables["/mi1"].stateValues.value.tree).eqls([
            "*",
            "a",
            "b",
            "c",
            "d",
        ]);
        expect(stateVariables["/mi1a"].stateValues.value.tree).eqls([
            "*",
            "a",
            "b",
            "c",
            "d",
        ]);
        expect(stateVariables["/mi2"].stateValues.value.tree).eqls([
            "/",
            "u",
            "v",
        ]);

        // update value (e.g., by blurring) of second mathInput

        await updateMathInputValueToImmediateValue({
            name: "/mi1a",
            core,
        });

        stateVariables = await returnAllStateVariables(core);

        expect(
            cleanLatex(stateVariables["/mi1"].stateValues.rawRendererValue),
        ).eq("");
        expect(
            cleanLatex(stateVariables["/mi1a"].stateValues.rawRendererValue),
        ).eq("");
        expect(
            cleanLatex(stateVariables["/mi2"].stateValues.rawRendererValue),
        ).eq("u/v");
        expect(stateVariables["/mi1"].stateValues.immediateValue.tree).to.eq(
            "\uFF3F",
        );
        expect(stateVariables["/mi1a"].stateValues.immediateValue.tree).to.eq(
            "\uFF3F",
        );
        expect(stateVariables["/mi2"].stateValues.immediateValue.tree).eqls([
            "/",
            "u",
            "v",
        ]);
        expect(stateVariables["/mi1"].stateValues.value.tree).to.eq("\uFF3F");
        expect(stateVariables["/mi1a"].stateValues.value.tree).to.eq("\uFF3F");
        expect(stateVariables["/mi2"].stateValues.value.tree).eqls([
            "/",
            "u",
            "v",
        ]);
    });

    it("mathinput references with invalid math expressions", async () => {
        let doenetML = `
    <mathinput name="mi1" />
    <mathinput copySource="mi1" name="mi1a"  />
    `;

        let core = await createTestCore({
            doenetML,
        });

        let stateVariables = await returnAllStateVariables(core);

        expect(
            cleanLatex(stateVariables["/mi1"].stateValues.rawRendererValue),
        ).eq("");
        expect(
            cleanLatex(stateVariables["/mi1a"].stateValues.rawRendererValue),
        ).eq("");
        expect(stateVariables["/mi1"].stateValues.immediateValue.tree).eqls(
            "＿",
        );
        expect(stateVariables["/mi1a"].stateValues.immediateValue.tree).eqls(
            "＿",
        );
        expect(stateVariables["/mi1"].stateValues.value.tree).eqls("＿");
        expect(stateVariables["/mi1a"].stateValues.value.tree).eqls("＿");

        // Type x~ in first mathinput
        await updateMathInputImmediateValue({
            latex: "x",
            name: "/mi1",
            core,
        });
        await updateMathInputValue({
            latex: "x~",
            name: "/mi1",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(
            cleanLatex(stateVariables["/mi1"].stateValues.rawRendererValue),
        ).eq("x~");
        expect(
            cleanLatex(stateVariables["/mi1a"].stateValues.rawRendererValue),
        ).eq("x~");
        expect(stateVariables["/mi1"].stateValues.immediateValue.tree).eqls(
            "＿",
        );
        expect(stateVariables["/mi1a"].stateValues.immediateValue.tree).eqls(
            "＿",
        );
        expect(stateVariables["/mi1"].stateValues.value.tree).eqls("＿");
        expect(stateVariables["/mi1a"].stateValues.value.tree).eqls("＿");

        // Delete ~ and add -y in copied mathinput
        await updateMathInputImmediateValue({
            latex: "x",
            name: "/mi1a",
            core,
        });
        await updateMathInputImmediateValue({
            latex: "x-",
            name: "/mi1a",
            core,
        });
        await updateMathInputImmediateValue({
            latex: "x-y",
            name: "/mi1a",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(
            cleanLatex(stateVariables["/mi1"].stateValues.rawRendererValue),
        ).eq("x-y");
        expect(
            cleanLatex(stateVariables["/mi1a"].stateValues.rawRendererValue),
        ).eq("x-y");
        expect(stateVariables["/mi1"].stateValues.immediateValue.tree).eqls([
            "+",
            "x",
            ["-", "y"],
        ]);
        expect(stateVariables["/mi1a"].stateValues.immediateValue.tree).eqls([
            "+",
            "x",
            ["-", "y"],
        ]);
        expect(stateVariables["/mi1"].stateValues.value.tree).eqls("＿");
        expect(stateVariables["/mi1a"].stateValues.value.tree).eqls("＿");

        // update value (e.g., blur)
        await updateMathInputValueToImmediateValue({
            name: "/mi1a",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(
            cleanLatex(stateVariables["/mi1"].stateValues.rawRendererValue),
        ).eq("x-y");
        expect(
            cleanLatex(stateVariables["/mi1a"].stateValues.rawRendererValue),
        ).eq("x-y");
        expect(stateVariables["/mi1"].stateValues.immediateValue.tree).eqls([
            "+",
            "x",
            ["-", "y"],
        ]);
        expect(stateVariables["/mi1a"].stateValues.immediateValue.tree).eqls([
            "+",
            "x",
            ["-", "y"],
        ]);
        expect(stateVariables["/mi1"].stateValues.value.tree).eqls([
            "+",
            "x",
            ["-", "y"],
        ]);
        expect(stateVariables["/mi1a"].stateValues.value.tree).eqls([
            "+",
            "x",
            ["-", "y"],
        ]);

        // Add & in copied mathinput
        await updateMathInputImmediateValue({
            latex: "x-y@",
            name: "/mi1a",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(
            cleanLatex(stateVariables["/mi1"].stateValues.rawRendererValue),
        ).eq("x-y@");
        expect(
            cleanLatex(stateVariables["/mi1a"].stateValues.rawRendererValue),
        ).eq("x-y@");
        expect(stateVariables["/mi1"].stateValues.immediateValue.tree).eqls(
            "＿",
        );
        expect(stateVariables["/mi1a"].stateValues.immediateValue.tree).eqls(
            "＿",
        );
        expect(stateVariables["/mi1"].stateValues.value.tree).eqls([
            "+",
            "x",
            ["-", "y"],
        ]);
        expect(stateVariables["/mi1a"].stateValues.value.tree).eqls([
            "+",
            "x",
            ["-", "y"],
        ]);

        // Delete @ and add *z in first mathinput
        await updateMathInputValueToImmediateValue({
            name: "/mi1a",
            core,
        });

        await updateMathInputImmediateValue({
            latex: "x-y",
            name: "/mi1",
            core,
        });
        await updateMathInputImmediateValue({
            latex: "x-y*",
            name: "/mi1",
            core,
        });
        await updateMathInputImmediateValue({
            latex: "x-y*z",
            name: "/mi1",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(
            cleanLatex(stateVariables["/mi1"].stateValues.rawRendererValue),
        ).eq("x-y*z");
        expect(
            cleanLatex(stateVariables["/mi1a"].stateValues.rawRendererValue),
        ).eq("x-y*z");
        expect(stateVariables["/mi1"].stateValues.immediateValue.tree).eqls([
            "+",
            "x",
            ["-", ["*", "y", "z"]],
        ]);
        expect(stateVariables["/mi1a"].stateValues.immediateValue.tree).eqls([
            "+",
            "x",
            ["-", ["*", "y", "z"]],
        ]);
        expect(stateVariables["/mi1"].stateValues.value.tree).eqls("＿");
        expect(stateVariables["/mi1a"].stateValues.value.tree).eqls("＿");

        // Update value (e.g., update value)
        await updateMathInputValueToImmediateValue({
            name: "/mi1",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(
            cleanLatex(stateVariables["/mi1"].stateValues.rawRendererValue),
        ).eq("x-y*z");
        expect(
            cleanLatex(stateVariables["/mi1a"].stateValues.rawRendererValue),
        ).eq("x-y*z");

        expect(stateVariables["/mi1"].stateValues.immediateValue.tree).eqls([
            "+",
            "x",
            ["-", ["*", "y", "z"]],
        ]);
        expect(stateVariables["/mi1a"].stateValues.immediateValue.tree).eqls([
            "+",
            "x",
            ["-", ["*", "y", "z"]],
        ]);
        expect(stateVariables["/mi1"].stateValues.value.tree).eqls([
            "+",
            "x",
            ["-", ["*", "y", "z"]],
        ]);
        expect(stateVariables["/mi1a"].stateValues.value.tree).eqls([
            "+",
            "x",
            ["-", ["*", "y", "z"]],
        ]);
    });

    it("mathinput references with incomplete math expressions", async () => {
        let doenetML = `
    <mathinput name="mi1" />
    <mathinput copysource="mi1" name="mi1a"  />
    <copy prop='value' source="mi1" assignNames="v1" />
    <copy prop='immediatevalue' source="mi1" assignNames="iv1"  />
    <copy prop='value' source="mi1a" assignNames="v1a" />
    <copy prop='immediatevalue' source="mi1a" assignNames="iv1a"  />
    <p><booleaninput name="bi" /> $bi.value{assignNames="b"}</p>
    `;

        let core = await createTestCore({
            doenetML,
        });

        let stateVariables = await returnAllStateVariables(core);

        expect(
            cleanLatex(stateVariables["/mi1"].stateValues.rawRendererValue),
        ).eq("");
        expect(
            cleanLatex(stateVariables["/mi1a"].stateValues.rawRendererValue),
        ).eq("");
        expect(stateVariables["/mi1"].stateValues.immediateValue.tree).eqls(
            "＿",
        );
        expect(stateVariables["/mi1a"].stateValues.immediateValue.tree).eqls(
            "＿",
        );
        expect(stateVariables["/mi1"].stateValues.value.tree).eqls("＿");
        expect(stateVariables["/mi1a"].stateValues.value.tree).eqls("＿");

        // Type x- in first mathinput
        await updateMathInputImmediateValue({
            latex: "x",
            name: "/mi1",
            core,
        });
        await updateMathInputValue({
            latex: "x-",
            name: "/mi1",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(
            cleanLatex(stateVariables["/mi1"].stateValues.rawRendererValue),
        ).eq("x-");
        expect(
            cleanLatex(stateVariables["/mi1a"].stateValues.rawRendererValue),
        ).eq("x-");

        expect(stateVariables["/mi1"].stateValues.immediateValue.tree).eqls(
            "x-",
        );
        expect(stateVariables["/mi1a"].stateValues.immediateValue.tree).eqls(
            "x-",
        );
        expect(stateVariables["/mi1"].stateValues.value.tree).eqls("x-");
        expect(stateVariables["/mi1a"].stateValues.value.tree).eqls("x-");

        // Add y in copied mathinput
        await updateMathInputImmediateValue({
            latex: "x-y",
            name: "/mi1a",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(
            cleanLatex(stateVariables["/mi1"].stateValues.rawRendererValue),
        ).eq("x-y");
        expect(
            cleanLatex(stateVariables["/mi1a"].stateValues.rawRendererValue),
        ).eq("x-y");
        expect(stateVariables["/mi1"].stateValues.immediateValue.tree).eqls([
            "+",
            "x",
            ["-", "y"],
        ]);
        expect(stateVariables["/mi1a"].stateValues.immediateValue.tree).eqls([
            "+",
            "x",
            ["-", "y"],
        ]);
        expect(stateVariables["/mi1"].stateValues.value.tree).eqls("x-");
        expect(stateVariables["/mi1a"].stateValues.value.tree).eqls("x-");

        // update value (e.g., blur)
        await updateMathInputValueToImmediateValue({
            name: "/mi1a",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(
            cleanLatex(stateVariables["/mi1"].stateValues.rawRendererValue),
        ).eq("x-y");
        expect(
            cleanLatex(stateVariables["/mi1a"].stateValues.rawRendererValue),
        ).eq("x-y");

        expect(stateVariables["/mi1"].stateValues.immediateValue.tree).eqls([
            "+",
            "x",
            ["-", "y"],
        ]);
        expect(stateVariables["/mi1a"].stateValues.immediateValue.tree).eqls([
            "+",
            "x",
            ["-", "y"],
        ]);
        expect(stateVariables["/mi1"].stateValues.value.tree).eqls([
            "+",
            "x",
            ["-", "y"],
        ]);
        expect(stateVariables["/mi1a"].stateValues.value.tree).eqls([
            "+",
            "x",
            ["-", "y"],
        ]);

        // Add * in copied mathinput
        await updateMathInputImmediateValue({
            latex: "x-y*",
            name: "/mi1a",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(
            cleanLatex(stateVariables["/mi1"].stateValues.rawRendererValue),
        ).eq("x-y*");
        expect(
            cleanLatex(stateVariables["/mi1a"].stateValues.rawRendererValue),
        ).eq("x-y*");
        expect(stateVariables["/mi1"].stateValues.immediateValue.tree).eqls([
            "+",
            "x",
            ["-", ["*", "y", "＿"]],
        ]);
        expect(stateVariables["/mi1a"].stateValues.immediateValue.tree).eqls([
            "+",
            "x",
            ["-", ["*", "y", "＿"]],
        ]);
        expect(stateVariables["/mi1"].stateValues.value.tree).eqls([
            "+",
            "x",
            ["-", "y"],
        ]);
        expect(stateVariables["/mi1a"].stateValues.value.tree).eqls([
            "+",
            "x",
            ["-", "y"],
        ]);

        // Add z in first mathinput
        await updateMathInputValueToImmediateValue({
            name: "/mi1a",
            core,
        });
        await updateMathInputImmediateValue({
            latex: "x-y*z",
            name: "/mi1",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(
            cleanLatex(stateVariables["/mi1"].stateValues.rawRendererValue),
        ).eq("x-y*z");
        expect(
            cleanLatex(stateVariables["/mi1a"].stateValues.rawRendererValue),
        ).eq("x-y*z");
        expect(stateVariables["/mi1"].stateValues.immediateValue.tree).eqls([
            "+",
            "x",
            ["-", ["*", "y", "z"]],
        ]);
        expect(stateVariables["/mi1a"].stateValues.immediateValue.tree).eqls([
            "+",
            "x",
            ["-", ["*", "y", "z"]],
        ]);
        expect(stateVariables["/mi1"].stateValues.value.tree).eqls([
            "+",
            "x",
            ["-", ["*", "y", "＿"]],
        ]);
        expect(stateVariables["/mi1a"].stateValues.value.tree).eqls([
            "+",
            "x",
            ["-", ["*", "y", "＿"]],
        ]);

        // Update value (e.g., update value)
        await updateMathInputValueToImmediateValue({
            name: "/mi1",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(
            cleanLatex(stateVariables["/mi1"].stateValues.rawRendererValue),
        ).eq("x-y*z");
        expect(
            cleanLatex(stateVariables["/mi1a"].stateValues.rawRendererValue),
        ).eq("x-y*z");
        expect(stateVariables["/mi1"].stateValues.immediateValue.tree).eqls([
            "+",
            "x",
            ["-", ["*", "y", "z"]],
        ]);
        expect(stateVariables["/mi1a"].stateValues.immediateValue.tree).eqls([
            "+",
            "x",
            ["-", ["*", "y", "z"]],
        ]);
        expect(stateVariables["/mi1"].stateValues.value.tree).eqls([
            "+",
            "x",
            ["-", ["*", "y", "z"]],
        ]);
        expect(stateVariables["/mi1a"].stateValues.value.tree).eqls([
            "+",
            "x",
            ["-", ["*", "y", "z"]],
        ]);
    });

    it("downstream from mathinput", async () => {
        let core = await createTestCore({
            doenetML: `
    <p>Original math: <math>1+2x</math></p>
    <p>MathInput based on math: <mathinput bindValueTo="$_math1" name="mi1" /></p>
    <p>Copied mathinput: <mathinput copySource="mi1" name="mi2" /></p>
    `,
        });

        let stateVariables = await returnAllStateVariables(core);

        expect(
            cleanLatex(stateVariables["/mi1"].stateValues.rawRendererValue),
        ).eq("1+2x");
        expect(
            cleanLatex(stateVariables["/mi2"].stateValues.rawRendererValue),
        ).eq("1+2x");
        expect(stateVariables["/mi1"].stateValues.value.tree).eqls([
            "+",
            1,
            ["*", 2, "x"],
        ]);
        expect(stateVariables["/_math1"].stateValues.value.tree).eqls([
            "+",
            1,
            ["*", 2, "x"],
        ]);
        expect(stateVariables["/mi2"].stateValues.value.tree).eqls([
            "+",
            1,
            ["*", 2, "x"],
        ]);
        expect(stateVariables["/mi1"].stateValues.immediateValue.tree).eqls([
            "+",
            1,
            ["*", 2, "x"],
        ]);
        expect(stateVariables["/mi2"].stateValues.immediateValue.tree).eqls([
            "+",
            1,
            ["*", 2, "x"],
        ]);

        // type new values
        await updateMathInputImmediateValue({
            latex: "",
            name: "/mi1",
            core,
        });
        await updateMathInputImmediateValue({
            latex: "x",
            name: "/mi1",
            core,
        });
        await updateMathInputImmediateValue({
            latex: "xy",
            name: "/mi1",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(
            cleanLatex(stateVariables["/mi1"].stateValues.rawRendererValue),
        ).eq("xy");
        expect(
            cleanLatex(stateVariables["/mi2"].stateValues.rawRendererValue),
        ).eq("xy");
        expect(stateVariables["/mi1"].stateValues.value.tree).eqls([
            "+",
            1,
            ["*", 2, "x"],
        ]);
        expect(stateVariables["/_math1"].stateValues.value.tree).eqls([
            "+",
            1,
            ["*", 2, "x"],
        ]);
        expect(stateVariables["/mi2"].stateValues.value.tree).eqls([
            "+",
            1,
            ["*", 2, "x"],
        ]);
        expect(stateVariables["/mi1"].stateValues.immediateValue.tree).eqls([
            "*",
            "x",
            "y",
        ]);
        expect(stateVariables["/mi2"].stateValues.immediateValue.tree).eqls([
            "*",
            "x",
            "y",
        ]);

        // update value
        await updateMathInputValueToImmediateValue({
            name: "/mi1",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(
            cleanLatex(stateVariables["/mi1"].stateValues.rawRendererValue),
        ).eq("xy");
        expect(
            cleanLatex(stateVariables["/mi2"].stateValues.rawRendererValue),
        ).eq("xy");
        expect(stateVariables["/mi1"].stateValues.value.tree).eqls([
            "*",
            "x",
            "y",
        ]);
        expect(stateVariables["/_math1"].stateValues.value.tree).eqls([
            "*",
            "x",
            "y",
        ]);
        expect(stateVariables["/mi2"].stateValues.value.tree).eqls([
            "*",
            "x",
            "y",
        ]);
        expect(stateVariables["/mi1"].stateValues.immediateValue.tree).eqls([
            "*",
            "x",
            "y",
        ]);
        expect(stateVariables["/mi2"].stateValues.immediateValue.tree).eqls([
            "*",
            "x",
            "y",
        ]);

        // enter new values in referenced
        await updateMathInputValue({
            latex: "qr",
            name: "/mi1",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(
            cleanLatex(stateVariables["/mi1"].stateValues.rawRendererValue),
        ).eq("qr");
        expect(
            cleanLatex(stateVariables["/mi2"].stateValues.rawRendererValue),
        ).eq("qr");
        expect(stateVariables["/mi1"].stateValues.value.tree).eqls([
            "*",
            "q",
            "r",
        ]);
        expect(stateVariables["/_math1"].stateValues.value.tree).eqls([
            "*",
            "q",
            "r",
        ]);
        expect(stateVariables["/mi2"].stateValues.value.tree).eqls([
            "*",
            "q",
            "r",
        ]);
        expect(stateVariables["/mi1"].stateValues.immediateValue.tree).eqls([
            "*",
            "q",
            "r",
        ]);
        expect(stateVariables["/mi2"].stateValues.immediateValue.tree).eqls([
            "*",
            "q",
            "r",
        ]);
    });

    it("downstream from mathinput, prefill ignored", async () => {
        let core = await createTestCore({
            doenetML: `
    <p>Original math: <math>1+2x</math></p>
    <p>MathInput based on math: <mathinput prefill="x^2/9" bindValueTo="$_math1" name="mi1" /></p>
    <p>Copied mathinput: <mathinput copysource="mi1" name="mi2" /></p>

    `,
        });

        let stateVariables = await returnAllStateVariables(core);

        expect(
            cleanLatex(stateVariables["/mi1"].stateValues.rawRendererValue),
        ).eq("1+2x");
        expect(
            cleanLatex(stateVariables["/mi2"].stateValues.rawRendererValue),
        ).eq("1+2x");
        expect(stateVariables["/mi1"].stateValues.value.tree).eqls([
            "+",
            1,
            ["*", 2, "x"],
        ]);
        expect(stateVariables["/_math1"].stateValues.value.tree).eqls([
            "+",
            1,
            ["*", 2, "x"],
        ]);
        expect(stateVariables["/mi2"].stateValues.value.tree).eqls([
            "+",
            1,
            ["*", 2, "x"],
        ]);
        expect(stateVariables["/mi1"].stateValues.immediateValue.tree).eqls([
            "+",
            1,
            ["*", 2, "x"],
        ]);
        expect(stateVariables["/mi2"].stateValues.immediateValue.tree).eqls([
            "+",
            1,
            ["*", 2, "x"],
        ]);
    });

    it("downstream from mathinput, normal downstream rules apply", async () => {
        let core = await createTestCore({
            doenetML: `
    <p>Original math: <math simplify>1+<math>3x</math></math></p>
    <p>MathInput based on math: <mathinput bindValueTo="$_math1" name="mi1" /></p>
    <p>Copied mathinput: <mathinput copysource="mi1" name="mi2" /></p>
    `,
        });

        let stateVariables = await returnAllStateVariables(core);

        expect(
            cleanLatex(stateVariables["/mi1"].stateValues.rawRendererValue),
        ).eq("3x+1");
        expect(
            cleanLatex(stateVariables["/mi2"].stateValues.rawRendererValue),
        ).eq("3x+1");
        expect(stateVariables["/mi1"].stateValues.value.tree).eqls([
            "+",
            ["*", 3, "x"],
            1,
        ]);
        expect(stateVariables["/mi2"].stateValues.value.tree).eqls([
            "+",
            ["*", 3, "x"],
            1,
        ]);
        expect(stateVariables["/mi1"].stateValues.immediateValue.tree).eqls([
            "+",
            ["*", 3, "x"],
            1,
        ]);
        expect(stateVariables["/mi2"].stateValues.immediateValue.tree).eqls([
            "+",
            ["*", 3, "x"],
            1,
        ]);
        expect(stateVariables["/_math1"].stateValues.value.tree).eqls([
            "+",
            ["*", 3, "x"],
            1,
        ]);
        expect(stateVariables["/_math2"].stateValues.value.tree).eqls([
            "*",
            3,
            "x",
        ]);

        // type new values
        await updateMathInputValue({
            latex: "xy",
            name: "/mi1",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(
            cleanLatex(stateVariables["/mi1"].stateValues.rawRendererValue),
        ).eq("xy");
        expect(
            cleanLatex(stateVariables["/mi2"].stateValues.rawRendererValue),
        ).eq("xy");

        expect(stateVariables["/mi1"].stateValues.value.tree).eqls([
            "*",
            "x",
            "y",
        ]);
        expect(stateVariables["/mi2"].stateValues.value.tree).eqls([
            "*",
            "x",
            "y",
        ]);
        expect(stateVariables["/mi1"].stateValues.immediateValue.tree).eqls([
            "*",
            "x",
            "y",
        ]);
        expect(stateVariables["/mi2"].stateValues.immediateValue.tree).eqls([
            "*",
            "x",
            "y",
        ]);
        expect(stateVariables["/_math1"].stateValues.value.tree).eqls([
            "*",
            "x",
            "y",
        ]);
        expect(stateVariables["/_math2"].stateValues.value.tree).eqls([
            "+",
            ["*", "x", "y"],
            -1,
        ]);

        // enter new values in reffed
        await updateMathInputValue({
            latex: "qr",
            name: "/mi2",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(
            cleanLatex(stateVariables["/mi1"].stateValues.rawRendererValue),
        ).eq("qr");
        expect(
            cleanLatex(stateVariables["/mi2"].stateValues.rawRendererValue),
        ).eq("qr");
        expect(stateVariables["/mi1"].stateValues.value.tree).eqls([
            "*",
            "q",
            "r",
        ]);
        expect(stateVariables["/mi2"].stateValues.value.tree).eqls([
            "*",
            "q",
            "r",
        ]);
        expect(stateVariables["/mi1"].stateValues.immediateValue.tree).eqls([
            "*",
            "q",
            "r",
        ]);
        expect(stateVariables["/mi2"].stateValues.immediateValue.tree).eqls([
            "*",
            "q",
            "r",
        ]);
        expect(stateVariables["/_math1"].stateValues.value.tree).eqls([
            "*",
            "q",
            "r",
        ]);
        expect(stateVariables["/_math2"].stateValues.value.tree).eqls([
            "+",
            ["*", "q", "r"],
            -1,
        ]);
    });

    it("downstream from mathinput via child", async () => {
        let core = await createTestCore({
            doenetML: `
    <p>Original math: <math>1+2x</math></p>
    <p>MathInput based on math: <mathinput name="mi1" >$_math1</mathinput></p>
    <p>Copied mathinput: <mathinput copySource="mi1" name="mi2" /></p>
    `,
        });

        let stateVariables = await returnAllStateVariables(core);

        expect(
            cleanLatex(stateVariables["/mi1"].stateValues.rawRendererValue),
        ).eq("1+2x");
        expect(
            cleanLatex(stateVariables["/mi2"].stateValues.rawRendererValue),
        ).eq("1+2x");
        expect(stateVariables["/mi1"].stateValues.value.tree).eqls([
            "+",
            1,
            ["*", 2, "x"],
        ]);
        expect(stateVariables["/_math1"].stateValues.value.tree).eqls([
            "+",
            1,
            ["*", 2, "x"],
        ]);
        expect(stateVariables["/mi2"].stateValues.value.tree).eqls([
            "+",
            1,
            ["*", 2, "x"],
        ]);
        expect(stateVariables["/mi1"].stateValues.immediateValue.tree).eqls([
            "+",
            1,
            ["*", 2, "x"],
        ]);
        expect(stateVariables["/mi2"].stateValues.immediateValue.tree).eqls([
            "+",
            1,
            ["*", 2, "x"],
        ]);

        // type new values
        await updateMathInputImmediateValue({
            latex: "",
            name: "/mi1",
            core,
        });
        await updateMathInputImmediateValue({
            latex: "x",
            name: "/mi1",
            core,
        });
        await updateMathInputImmediateValue({
            latex: "xy",
            name: "/mi1",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(
            cleanLatex(stateVariables["/mi1"].stateValues.rawRendererValue),
        ).eq("xy");
        expect(
            cleanLatex(stateVariables["/mi2"].stateValues.rawRendererValue),
        ).eq("xy");
        expect(stateVariables["/mi1"].stateValues.value.tree).eqls([
            "+",
            1,
            ["*", 2, "x"],
        ]);
        expect(stateVariables["/_math1"].stateValues.value.tree).eqls([
            "+",
            1,
            ["*", 2, "x"],
        ]);
        expect(stateVariables["/mi2"].stateValues.value.tree).eqls([
            "+",
            1,
            ["*", 2, "x"],
        ]);
        expect(stateVariables["/mi1"].stateValues.immediateValue.tree).eqls([
            "*",
            "x",
            "y",
        ]);
        expect(stateVariables["/mi2"].stateValues.immediateValue.tree).eqls([
            "*",
            "x",
            "y",
        ]);

        // update value
        await updateMathInputValueToImmediateValue({
            name: "/mi1",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(
            cleanLatex(stateVariables["/mi1"].stateValues.rawRendererValue),
        ).eq("xy");
        expect(
            cleanLatex(stateVariables["/mi2"].stateValues.rawRendererValue),
        ).eq("xy");
        expect(stateVariables["/mi1"].stateValues.value.tree).eqls([
            "*",
            "x",
            "y",
        ]);
        expect(stateVariables["/_math1"].stateValues.value.tree).eqls([
            "*",
            "x",
            "y",
        ]);
        expect(stateVariables["/mi2"].stateValues.value.tree).eqls([
            "*",
            "x",
            "y",
        ]);
        expect(stateVariables["/mi1"].stateValues.immediateValue.tree).eqls([
            "*",
            "x",
            "y",
        ]);
        expect(stateVariables["/mi2"].stateValues.immediateValue.tree).eqls([
            "*",
            "x",
            "y",
        ]);

        // enter new values in referenced
        await updateMathInputValue({
            latex: "qr",
            name: "/mi1",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(
            cleanLatex(stateVariables["/mi1"].stateValues.rawRendererValue),
        ).eq("qr");
        expect(
            cleanLatex(stateVariables["/mi2"].stateValues.rawRendererValue),
        ).eq("qr");
        expect(stateVariables["/mi1"].stateValues.value.tree).eqls([
            "*",
            "q",
            "r",
        ]);
        expect(stateVariables["/_math1"].stateValues.value.tree).eqls([
            "*",
            "q",
            "r",
        ]);
        expect(stateVariables["/mi2"].stateValues.value.tree).eqls([
            "*",
            "q",
            "r",
        ]);
        expect(stateVariables["/mi1"].stateValues.immediateValue.tree).eqls([
            "*",
            "q",
            "r",
        ]);
        expect(stateVariables["/mi2"].stateValues.immediateValue.tree).eqls([
            "*",
            "q",
            "r",
        ]);
    });

    it("downstream from mathinput via child, prefill ignored", async () => {
        let core = await createTestCore({
            doenetML: `
    <p>Original math: <math>1+2x</math></p>
    <p>MathInput based on math: <mathinput prefill="x^2/9" name="mi1" >$_math1</mathinput></p>
    <p>Copied mathinput: <mathinput copysource="mi1" name="mi2" /></p>

    `,
        });

        let stateVariables = await returnAllStateVariables(core);

        expect(
            cleanLatex(stateVariables["/mi1"].stateValues.rawRendererValue),
        ).eq("1+2x");
        expect(
            cleanLatex(stateVariables["/mi2"].stateValues.rawRendererValue),
        ).eq("1+2x");
        expect(stateVariables["/mi1"].stateValues.value.tree).eqls([
            "+",
            1,
            ["*", 2, "x"],
        ]);
        expect(stateVariables["/_math1"].stateValues.value.tree).eqls([
            "+",
            1,
            ["*", 2, "x"],
        ]);
        expect(stateVariables["/mi2"].stateValues.value.tree).eqls([
            "+",
            1,
            ["*", 2, "x"],
        ]);
        expect(stateVariables["/mi1"].stateValues.immediateValue.tree).eqls([
            "+",
            1,
            ["*", 2, "x"],
        ]);
        expect(stateVariables["/mi2"].stateValues.immediateValue.tree).eqls([
            "+",
            1,
            ["*", 2, "x"],
        ]);
    });

    it("combination children including string", async () => {
        let core = await createTestCore({
            doenetML: `
    <p>Original math: <math>x</math></p>
    <p>MathInput based on math and strings: <mathinput name="mi1" >2$_math1+1</mathinput></p>

    `,
        });

        let stateVariables = await returnAllStateVariables(core);

        expect(
            cleanLatex(stateVariables["/mi1"].stateValues.rawRendererValue),
        ).eq("2x+1");
        expect(stateVariables["/mi1"].stateValues.value.tree).eqls([
            "+",
            ["*", 2, "x"],
            1,
        ]);
        expect(stateVariables["/_math1"].stateValues.value.tree).eqls("x");
        expect(stateVariables["/mi1"].stateValues.immediateValue.tree).eqls([
            "+",
            ["*", 2, "x"],
            1,
        ]);

        // type in new values
        await updateMathInputValue({
            latex: "2y+1",
            name: "/mi1",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(
            cleanLatex(stateVariables["/mi1"].stateValues.rawRendererValue),
        ).eq("2y+1");
        expect(stateVariables["/mi1"].stateValues.value.tree).eqls([
            "+",
            ["*", 2, "y"],
            1,
        ]);
        expect(stateVariables["/_math1"].stateValues.value.tree).eqls("y");
        expect(stateVariables["/mi1"].stateValues.immediateValue.tree).eqls([
            "+",
            ["*", 2, "y"],
            1,
        ]);
    });

    it("child overrides bindValueTo", async () => {
        let core = await createTestCore({
            doenetML: `
    <p>Original math: <math>x</math></p>
    <p>MathInput with child and bindValueTo: <mathinput name="mi1" bindValueTo="$_math1">y</mathinput></p>

    `,
        });

        let stateVariables = await returnAllStateVariables(core);

        expect(
            cleanLatex(stateVariables["/mi1"].stateValues.rawRendererValue),
        ).eq("y");
        expect(stateVariables["/mi1"].stateValues.value.tree).eqls("y");
        expect(stateVariables["/_math1"].stateValues.value.tree).eqls("x");
        expect(stateVariables["/mi1"].stateValues.immediateValue.tree).eqls(
            "y",
        );

        // type in new values
        await updateMathInputValue({
            latex: "2z",
            name: "/mi1",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(
            cleanLatex(stateVariables["/mi1"].stateValues.rawRendererValue),
        ).eq("2z");
        expect(stateVariables["/mi1"].stateValues.value.tree).eqls([
            "*",
            2,
            "z",
        ]);
        expect(stateVariables["/_math1"].stateValues.value.tree).eqls("x");
        expect(stateVariables["/mi1"].stateValues.immediateValue.tree).eqls([
            "*",
            2,
            "z",
        ]);
    });

    it("downstream from mathinput via child, normal downstream rules apply", async () => {
        let core = await createTestCore({
            doenetML: `
    <p>Original math: <math simplify>1+<math>3x</math></math></p>
    <p>MathInput based on math: <mathinput name="mi1" >$_math1</mathinput></p>
    <p>Copied mathinput: <mathinput copysource="mi1" name="mi2" /></p>
    `,
        });

        let stateVariables = await returnAllStateVariables(core);

        expect(
            cleanLatex(stateVariables["/mi1"].stateValues.rawRendererValue),
        ).eq("3x+1");
        expect(
            cleanLatex(stateVariables["/mi2"].stateValues.rawRendererValue),
        ).eq("3x+1");
        expect(stateVariables["/mi1"].stateValues.value.tree).eqls([
            "+",
            ["*", 3, "x"],
            1,
        ]);
        expect(stateVariables["/mi2"].stateValues.value.tree).eqls([
            "+",
            ["*", 3, "x"],
            1,
        ]);
        expect(stateVariables["/mi1"].stateValues.immediateValue.tree).eqls([
            "+",
            ["*", 3, "x"],
            1,
        ]);
        expect(stateVariables["/mi2"].stateValues.immediateValue.tree).eqls([
            "+",
            ["*", 3, "x"],
            1,
        ]);
        expect(stateVariables["/_math1"].stateValues.value.tree).eqls([
            "+",
            ["*", 3, "x"],
            1,
        ]);
        expect(stateVariables["/_math2"].stateValues.value.tree).eqls([
            "*",
            3,
            "x",
        ]);

        // type new values
        await updateMathInputValue({
            latex: "xy",
            name: "/mi1",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(
            cleanLatex(stateVariables["/mi1"].stateValues.rawRendererValue),
        ).eq("xy");
        expect(
            cleanLatex(stateVariables["/mi2"].stateValues.rawRendererValue),
        ).eq("xy");

        expect(stateVariables["/mi1"].stateValues.value.tree).eqls([
            "*",
            "x",
            "y",
        ]);
        expect(stateVariables["/mi2"].stateValues.value.tree).eqls([
            "*",
            "x",
            "y",
        ]);
        expect(stateVariables["/mi1"].stateValues.immediateValue.tree).eqls([
            "*",
            "x",
            "y",
        ]);
        expect(stateVariables["/mi2"].stateValues.immediateValue.tree).eqls([
            "*",
            "x",
            "y",
        ]);
        expect(stateVariables["/_math1"].stateValues.value.tree).eqls([
            "*",
            "x",
            "y",
        ]);
        expect(stateVariables["/_math2"].stateValues.value.tree).eqls([
            "+",
            ["*", "x", "y"],
            -1,
        ]);

        // enter new values in reffed
        await updateMathInputValue({
            latex: "qr",
            name: "/mi2",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(
            cleanLatex(stateVariables["/mi1"].stateValues.rawRendererValue),
        ).eq("qr");
        expect(
            cleanLatex(stateVariables["/mi2"].stateValues.rawRendererValue),
        ).eq("qr");
        expect(stateVariables["/mi1"].stateValues.value.tree).eqls([
            "*",
            "q",
            "r",
        ]);
        expect(stateVariables["/mi2"].stateValues.value.tree).eqls([
            "*",
            "q",
            "r",
        ]);
        expect(stateVariables["/mi1"].stateValues.immediateValue.tree).eqls([
            "*",
            "q",
            "r",
        ]);
        expect(stateVariables["/mi2"].stateValues.immediateValue.tree).eqls([
            "*",
            "q",
            "r",
        ]);
        expect(stateVariables["/_math1"].stateValues.value.tree).eqls([
            "*",
            "q",
            "r",
        ]);
        expect(stateVariables["/_math2"].stateValues.value.tree).eqls([
            "+",
            ["*", "q", "r"],
            -1,
        ]);
    });

    it("values revert if bind to value that is not updatable", async () => {
        let core = await createTestCore({
            doenetML: `
    <p>Original math: <math>1+<math>2x</math><math>z</math></math></p>
    <p>MathInput based on math: <mathinput bindValueTo="$_math1" name="mi1" /></p>
    <p>Copied mathinput: <mathinput copySource="mi1" name="mi2" /></p>
 
    `,
        });

        let stateVariables = await returnAllStateVariables(core);

        expect(
            cleanLatex(stateVariables["/mi1"].stateValues.rawRendererValue),
        ).eq("1+2xz");
        expect(
            cleanLatex(stateVariables["/mi2"].stateValues.rawRendererValue),
        ).eq("1+2xz");

        expect(stateVariables["/mi1"].stateValues.value.tree).eqls([
            "+",
            1,
            ["*", 2, "x", "z"],
        ]);
        expect(stateVariables["/mi2"].stateValues.value.tree).eqls([
            "+",
            1,
            ["*", 2, "x", "z"],
        ]);
        expect(stateVariables["/mi1"].stateValues.immediateValue.tree).eqls([
            "+",
            1,
            ["*", 2, "x", "z"],
        ]);
        expect(stateVariables["/mi2"].stateValues.immediateValue.tree).eqls([
            "+",
            1,
            ["*", 2, "x", "z"],
        ]);
        expect(stateVariables["/_math1"].stateValues.value.tree).eqls([
            "+",
            1,
            ["*", 2, "x", "z"],
        ]);

        // type new values
        await updateMathInputImmediateValue({
            latex: "xy",
            name: "/mi1",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(
            cleanLatex(stateVariables["/mi1"].stateValues.rawRendererValue),
        ).eq("xy");
        expect(
            cleanLatex(stateVariables["/mi2"].stateValues.rawRendererValue),
        ).eq("xy");

        expect(stateVariables["/mi1"].stateValues.value.tree).eqls([
            "+",
            1,
            ["*", 2, "x", "z"],
        ]);
        expect(stateVariables["/mi2"].stateValues.value.tree).eqls([
            "+",
            1,
            ["*", 2, "x", "z"],
        ]);
        expect(stateVariables["/mi1"].stateValues.immediateValue.tree).eqls([
            "*",
            "x",
            "y",
        ]);
        expect(stateVariables["/mi2"].stateValues.immediateValue.tree).eqls([
            "*",
            "x",
            "y",
        ]);
        expect(stateVariables["/_math1"].stateValues.value.tree).eqls([
            "+",
            1,
            ["*", 2, "x", "z"],
        ]);

        // value revert when updateValue (e.g., update value)
        await updateMathInputValueToImmediateValue({
            name: "/mi1",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(
            cleanLatex(stateVariables["/mi1"].stateValues.rawRendererValue),
        ).eq("1+2xz");
        expect(
            cleanLatex(stateVariables["/mi2"].stateValues.rawRendererValue),
        ).eq("1+2xz");

        expect(stateVariables["/mi1"].stateValues.value.tree).eqls([
            "+",
            1,
            ["*", 2, "x", "z"],
        ]);
        expect(stateVariables["/mi2"].stateValues.value.tree).eqls([
            "+",
            1,
            ["*", 2, "x", "z"],
        ]);
        expect(stateVariables["/mi1"].stateValues.immediateValue.tree).eqls([
            "+",
            1,
            ["*", 2, "x", "z"],
        ]);
        expect(stateVariables["/mi2"].stateValues.immediateValue.tree).eqls([
            "+",
            1,
            ["*", 2, "x", "z"],
        ]);
        expect(stateVariables["/_math1"].stateValues.value.tree).eqls([
            "+",
            1,
            ["*", 2, "x", "z"],
        ]);

        // type new values in copy

        await updateMathInputImmediateValue({
            latex: "qr",
            name: "/mi2",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(
            cleanLatex(stateVariables["/mi1"].stateValues.rawRendererValue),
        ).eq("qr");
        expect(
            cleanLatex(stateVariables["/mi2"].stateValues.rawRendererValue),
        ).eq("qr");

        expect(stateVariables["/mi1"].stateValues.value.tree).eqls([
            "+",
            1,
            ["*", 2, "x", "z"],
        ]);
        expect(stateVariables["/mi2"].stateValues.value.tree).eqls([
            "+",
            1,
            ["*", 2, "x", "z"],
        ]);
        expect(stateVariables["/mi1"].stateValues.immediateValue.tree).eqls([
            "*",
            "q",
            "r",
        ]);
        expect(stateVariables["/mi2"].stateValues.immediateValue.tree).eqls([
            "*",
            "q",
            "r",
        ]);
        expect(stateVariables["/_math1"].stateValues.value.tree).eqls([
            "+",
            1,
            ["*", 2, "x", "z"],
        ]);

        // values revert when update value (e.g., blur)

        await updateMathInputValueToImmediateValue({
            name: "/mi2",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(
            cleanLatex(stateVariables["/mi1"].stateValues.rawRendererValue),
        ).eq("1+2xz");
        expect(
            cleanLatex(stateVariables["/mi2"].stateValues.rawRendererValue),
        ).eq("1+2xz");

        expect(stateVariables["/mi1"].stateValues.value.tree).eqls([
            "+",
            1,
            ["*", 2, "x", "z"],
        ]);
        expect(stateVariables["/mi2"].stateValues.value.tree).eqls([
            "+",
            1,
            ["*", 2, "x", "z"],
        ]);
        expect(stateVariables["/mi1"].stateValues.immediateValue.tree).eqls([
            "+",
            1,
            ["*", 2, "x", "z"],
        ]);
        expect(stateVariables["/mi2"].stateValues.immediateValue.tree).eqls([
            "+",
            1,
            ["*", 2, "x", "z"],
        ]);
        expect(stateVariables["/_math1"].stateValues.value.tree).eqls([
            "+",
            1,
            ["*", 2, "x", "z"],
        ]);
    });

    it("values revert if bind to fixed value", async () => {
        let core = await createTestCore({
            doenetML: `
    <p>Original math: <math fixed>x</math></p>
    <p>MathInput based on math: <mathinput bindValueTo="$_math1" name="mi1" /></p>
    <p>Copied mathinput: <mathinput copysource="mi1" name="mi2" /></p>
    `,
        });

        let stateVariables = await returnAllStateVariables(core);

        expect(
            cleanLatex(stateVariables["/mi1"].stateValues.rawRendererValue),
        ).eq("x");
        expect(
            cleanLatex(stateVariables["/mi2"].stateValues.rawRendererValue),
        ).eq("x");

        expect(stateVariables["/mi1"].stateValues.value.tree).eq("x");
        expect(stateVariables["/mi2"].stateValues.value.tree).eq("x");
        expect(stateVariables["/mi1"].stateValues.immediateValue.tree).eq("x");
        expect(stateVariables["/mi2"].stateValues.immediateValue.tree).eq("x");
        expect(stateVariables["/_math1"].stateValues.value.tree).eq("x");

        // type new values
        await updateMathInputImmediateValue({
            latex: "y",
            name: "/mi1",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(
            cleanLatex(stateVariables["/mi1"].stateValues.rawRendererValue),
        ).eq("y");
        expect(
            cleanLatex(stateVariables["/mi2"].stateValues.rawRendererValue),
        ).eq("y");
        expect(stateVariables["/mi1"].stateValues.value.tree).eq("x");
        expect(stateVariables["/mi2"].stateValues.value.tree).eq("x");
        expect(stateVariables["/mi1"].stateValues.immediateValue.tree).eq("y");
        expect(stateVariables["/mi2"].stateValues.immediateValue.tree).eq("y");
        expect(stateVariables["/_math1"].stateValues.value.tree).eq("x");

        // value revert when update value (e.g., press enter)
        await updateMathInputValueToImmediateValue({
            name: "/mi1",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(
            cleanLatex(stateVariables["/mi1"].stateValues.rawRendererValue),
        ).eq("x");
        expect(
            cleanLatex(stateVariables["/mi2"].stateValues.rawRendererValue),
        ).eq("x");

        expect(stateVariables["/mi1"].stateValues.value.tree).eq("x");
        expect(stateVariables["/mi2"].stateValues.value.tree).eq("x");
        expect(stateVariables["/mi1"].stateValues.immediateValue.tree).eq("x");
        expect(stateVariables["/mi2"].stateValues.immediateValue.tree).eq("x");
        expect(stateVariables["/_math1"].stateValues.value.tree).eq("x");

        // type new values in copy
        await updateMathInputImmediateValue({
            latex: "z",
            name: "/mi2",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(
            cleanLatex(stateVariables["/mi1"].stateValues.rawRendererValue),
        ).eq("z");
        expect(
            cleanLatex(stateVariables["/mi2"].stateValues.rawRendererValue),
        ).eq("z");
        expect(stateVariables["/mi1"].stateValues.value.tree).eq("x");
        expect(stateVariables["/mi2"].stateValues.value.tree).eq("x");
        expect(stateVariables["/mi1"].stateValues.immediateValue.tree).eq("z");
        expect(stateVariables["/mi2"].stateValues.immediateValue.tree).eq("z");
        expect(stateVariables["/_math1"].stateValues.value.tree).eq("x");

        // values revert when update value (e.g., blur)
        await updateMathInputValueToImmediateValue({
            name: "/mi2",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(
            cleanLatex(stateVariables["/mi1"].stateValues.rawRendererValue),
        ).eq("x");
        expect(
            cleanLatex(stateVariables["/mi2"].stateValues.rawRendererValue),
        ).eq("x");
        expect(stateVariables["/mi1"].stateValues.value.tree).eq("x");
        expect(stateVariables["/mi2"].stateValues.value.tree).eq("x");
        expect(stateVariables["/mi1"].stateValues.immediateValue.tree).eq("x");
        expect(stateVariables["/mi2"].stateValues.immediateValue.tree).eq("x");
        expect(stateVariables["/_math1"].stateValues.value.tree).eq("x");
    });

    it("mathinput based on value of mathinput", async () => {
        let core = await createTestCore({
            doenetML: `
    <p>Original mathinput: <mathinput name="mi1" prefill="x+1"/></p>
    <p>mathinput based on mathinput: <mathinput bindValueTo="$mi1" name="mi2" /></p>
  `,
        });

        let stateVariables = await returnAllStateVariables(core);

        expect(
            cleanLatex(stateVariables["/mi1"].stateValues.rawRendererValue),
        ).eq("x+1");
        expect(
            cleanLatex(stateVariables["/mi2"].stateValues.rawRendererValue),
        ).eq("x+1");
        expect(stateVariables["/mi1"].stateValues.immediateValue.tree).eqls([
            "+",
            "x",
            1,
        ]);
        expect(stateVariables["/mi1"].stateValues.value.tree).eqls([
            "+",
            "x",
            1,
        ]);
        expect(stateVariables["/mi2"].stateValues.immediateValue.tree).eqls([
            "+",
            "x",
            1,
        ]);
        expect(stateVariables["/mi2"].stateValues.value.tree).eqls([
            "+",
            "x",
            1,
        ]);

        // type 2 in first mathinput
        await updateMathInputImmediateValue({
            latex: "x+12",
            name: "/mi1",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(
            cleanLatex(stateVariables["/mi1"].stateValues.rawRendererValue),
        ).eq("x+12");
        expect(
            cleanLatex(stateVariables["/mi2"].stateValues.rawRendererValue),
        ).eq("x+1");
        expect(stateVariables["/mi1"].stateValues.immediateValue.tree).eqls([
            "+",
            "x",
            12,
        ]);
        expect(stateVariables["/mi1"].stateValues.value.tree).eqls([
            "+",
            "x",
            1,
        ]);
        expect(stateVariables["/mi2"].stateValues.immediateValue.tree).eqls([
            "+",
            "x",
            1,
        ]);
        expect(stateVariables["/mi2"].stateValues.value.tree).eqls([
            "+",
            "x",
            1,
        ]);

        // update value (e.g., press enter)
        await updateMathInputValueToImmediateValue({
            name: "/mi1",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(
            cleanLatex(stateVariables["/mi1"].stateValues.rawRendererValue),
        ).eq("x+12");
        expect(
            cleanLatex(stateVariables["/mi2"].stateValues.rawRendererValue),
        ).eq("x+12");
        expect(stateVariables["/mi1"].stateValues.immediateValue.tree).eqls([
            "+",
            "x",
            12,
        ]);
        expect(stateVariables["/mi1"].stateValues.value.tree).eqls([
            "+",
            "x",
            12,
        ]);
        expect(stateVariables["/mi2"].stateValues.immediateValue.tree).eqls([
            "+",
            "x",
            12,
        ]);
        expect(stateVariables["/mi2"].stateValues.value.tree).eqls([
            "+",
            "x",
            12,
        ]);

        // type 3 in second mathinput
        await updateMathInputImmediateValue({
            latex: "x+123",
            name: "/mi2",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(
            cleanLatex(stateVariables["/mi1"].stateValues.rawRendererValue),
        ).eq("x+12");
        expect(
            cleanLatex(stateVariables["/mi2"].stateValues.rawRendererValue),
        ).eq("x+123");

        expect(stateVariables["/mi1"].stateValues.immediateValue.tree).eqls([
            "+",
            "x",
            12,
        ]);
        expect(stateVariables["/mi1"].stateValues.value.tree).eqls([
            "+",
            "x",
            12,
        ]);
        expect(stateVariables["/mi2"].stateValues.immediateValue.tree).eqls([
            "+",
            "x",
            123,
        ]);
        expect(stateVariables["/mi2"].stateValues.value.tree).eqls([
            "+",
            "x",
            12,
        ]);

        // update value (e.g., blur)
        await updateMathInputValueToImmediateValue({
            name: "/mi2",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(
            cleanLatex(stateVariables["/mi1"].stateValues.rawRendererValue),
        ).eq("x+123");
        expect(
            cleanLatex(stateVariables["/mi2"].stateValues.rawRendererValue),
        ).eq("x+123");

        expect(stateVariables["/mi1"].stateValues.immediateValue.tree).eqls([
            "+",
            "x",
            123,
        ]);
        expect(stateVariables["/mi1"].stateValues.value.tree).eqls([
            "+",
            "x",
            123,
        ]);
        expect(stateVariables["/mi2"].stateValues.immediateValue.tree).eqls([
            "+",
            "x",
            123,
        ]);
        expect(stateVariables["/mi2"].stateValues.value.tree).eqls([
            "+",
            "x",
            123,
        ]);
    });

    it("mathinput based on immediate value of mathinput", async () => {
        let core = await createTestCore({
            doenetML: `
    <p>Original mathinput: <mathinput name="mi1" prefill="x+1"/></p>
    <p>mathinput based on mathinput: <mathinput bindValueTo="$mi1.immediateValue" name="mi2" /></p>
  `,
        });

        let stateVariables = await returnAllStateVariables(core);

        expect(
            cleanLatex(stateVariables["/mi1"].stateValues.rawRendererValue),
        ).eq("x+1");
        expect(
            cleanLatex(stateVariables["/mi2"].stateValues.rawRendererValue),
        ).eq("x+1");
        expect(stateVariables["/mi1"].stateValues.immediateValue.tree).eqls([
            "+",
            "x",
            1,
        ]);
        expect(stateVariables["/mi1"].stateValues.value.tree).eqls([
            "+",
            "x",
            1,
        ]);
        expect(stateVariables["/mi2"].stateValues.immediateValue.tree).eqls([
            "+",
            "x",
            1,
        ]);
        expect(stateVariables["/mi2"].stateValues.value.tree).eqls([
            "+",
            "x",
            1,
        ]);

        // type 2 in first mathinput
        await updateMathInputImmediateValue({
            latex: "x+12",
            name: "/mi1",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(
            cleanLatex(stateVariables["/mi1"].stateValues.rawRendererValue),
        ).eq("x+12");
        expect(
            cleanLatex(stateVariables["/mi2"].stateValues.rawRendererValue),
        ).eq("x+12");
        expect(stateVariables["/mi1"].stateValues.immediateValue.tree).eqls([
            "+",
            "x",
            12,
        ]);
        expect(stateVariables["/mi1"].stateValues.value.tree).eqls([
            "+",
            "x",
            1,
        ]);
        expect(stateVariables["/mi2"].stateValues.immediateValue.tree).eqls([
            "+",
            "x",
            12,
        ]);
        expect(stateVariables["/mi2"].stateValues.value.tree).eqls([
            "+",
            "x",
            12,
        ]);

        // update value (e.g., press enter)
        await updateMathInputValueToImmediateValue({
            name: "/mi1",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(
            cleanLatex(stateVariables["/mi1"].stateValues.rawRendererValue),
        ).eq("x+12");
        expect(
            cleanLatex(stateVariables["/mi2"].stateValues.rawRendererValue),
        ).eq("x+12");
        expect(stateVariables["/mi1"].stateValues.immediateValue.tree).eqls([
            "+",
            "x",
            12,
        ]);
        expect(stateVariables["/mi1"].stateValues.value.tree).eqls([
            "+",
            "x",
            12,
        ]);
        expect(stateVariables["/mi2"].stateValues.immediateValue.tree).eqls([
            "+",
            "x",
            12,
        ]);
        expect(stateVariables["/mi2"].stateValues.value.tree).eqls([
            "+",
            "x",
            12,
        ]);

        // type 3 in second mathinput
        await updateMathInputImmediateValue({
            latex: "x+123",
            name: "/mi2",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(
            cleanLatex(stateVariables["/mi1"].stateValues.rawRendererValue),
        ).eq("x+12");
        expect(
            cleanLatex(stateVariables["/mi2"].stateValues.rawRendererValue),
        ).eq("x+123");

        expect(stateVariables["/mi1"].stateValues.immediateValue.tree).eqls([
            "+",
            "x",
            12,
        ]);
        expect(stateVariables["/mi1"].stateValues.value.tree).eqls([
            "+",
            "x",
            12,
        ]);
        expect(stateVariables["/mi2"].stateValues.immediateValue.tree).eqls([
            "+",
            "x",
            123,
        ]);
        expect(stateVariables["/mi2"].stateValues.value.tree).eqls([
            "+",
            "x",
            12,
        ]);

        // update value (e.g., blur)
        await updateMathInputValueToImmediateValue({
            name: "/mi2",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(
            cleanLatex(stateVariables["/mi1"].stateValues.rawRendererValue),
        ).eq("x+123");
        expect(
            cleanLatex(stateVariables["/mi2"].stateValues.rawRendererValue),
        ).eq("x+123");

        expect(stateVariables["/mi1"].stateValues.immediateValue.tree).eqls([
            "+",
            "x",
            123,
        ]);
        expect(stateVariables["/mi1"].stateValues.value.tree).eqls([
            "+",
            "x",
            123,
        ]);
        expect(stateVariables["/mi2"].stateValues.immediateValue.tree).eqls([
            "+",
            "x",
            123,
        ]);
        expect(stateVariables["/mi2"].stateValues.value.tree).eqls([
            "+",
            "x",
            123,
        ]);
    });

    it("accurately reduce vector length", async () => {
        let core = await createTestCore({
            doenetML: `
    <text>Enter vector</text>
    <mathinput name="a"/>
    <copy source="a" prop="value" assignNames="b" />
    `,
        });

        // verify fixed bug where didn't reduce size of a vector

        let stateVariables = await returnAllStateVariables(core);
        expect(
            cleanLatex(stateVariables["/a"].stateValues.rawRendererValue),
        ).eq("");

        await updateMathInputValue({
            latex: "(1,2,3)",
            name: "/a",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(cleanLatex(stateVariables["/b"].stateValues.latex)).eq(
            "(1,2,3)",
        );

        await updateMathInputValue({
            latex: "(2,3)",
            name: "/a",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(cleanLatex(stateVariables["/b"].stateValues.latex)).eq("(2,3)");
    });

    it("function symbols", async () => {
        let core = await createTestCore({
            doenetML: `
    <p>f, g: <mathinput name="a"/></p>
    <p><copy source="a" prop="value" assignNames="a2" /></p>

    <p>h, q: <mathinput name="b" functionSymbols="h q" /></p>
    <p><copy source="b" prop="value" assignNames="b2" /></p>
    `,
        });

        let stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/a2"].stateValues.value.tree).eqls("\uff3f");
        expect(stateVariables["/b2"].stateValues.value.tree).eqls("\uff3f");

        await updateMathInputValue({
            latex: "f(x)",
            name: "/a",
            core,
        });
        await updateMathInputValue({
            latex: "f(x)",
            name: "/b",
            core,
        });

        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/a"].stateValues.value.tree).eqls([
            "apply",
            "f",
            "x",
        ]);
        expect(stateVariables["/a2"].stateValues.value.tree).eqls([
            "apply",
            "f",
            "x",
        ]);
        expect(stateVariables["/b"].stateValues.value.tree).eqls([
            "*",
            "f",
            "x",
        ]);
        expect(stateVariables["/b2"].stateValues.value.tree).eqls([
            "*",
            "f",
            "x",
        ]);

        await updateMathInputValue({
            latex: "g(f)",
            name: "/a",
            core,
        });
        await updateMathInputValue({
            latex: "g(f)",
            name: "/b",
            core,
        });

        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/a"].stateValues.value.tree).eqls([
            "apply",
            "g",
            "f",
        ]);
        expect(stateVariables["/a2"].stateValues.value.tree).eqls([
            "apply",
            "g",
            "f",
        ]);
        expect(stateVariables["/b"].stateValues.value.tree).eqls([
            "*",
            "g",
            "f",
        ]);
        expect(stateVariables["/b2"].stateValues.value.tree).eqls([
            "*",
            "g",
            "f",
        ]);

        await updateMathInputValue({
            latex: "h(q)",
            name: "/a",
            core,
        });
        await updateMathInputValue({
            latex: "h(q)",
            name: "/b",
            core,
        });

        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/a"].stateValues.value.tree).eqls([
            "*",
            "h",
            "q",
        ]);
        expect(stateVariables["/a2"].stateValues.value.tree).eqls([
            "*",
            "h",
            "q",
        ]);
        expect(stateVariables["/b"].stateValues.value.tree).eqls([
            "apply",
            "h",
            "q",
        ]);
        expect(stateVariables["/b2"].stateValues.value.tree).eqls([
            "apply",
            "h",
            "q",
        ]);

        await updateMathInputValue({
            latex: "q(z)",
            name: "/a",
            core,
        });
        await updateMathInputValue({
            latex: "q(z)",
            name: "/b",
            core,
        });

        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/a"].stateValues.value.tree).eqls([
            "*",
            "q",
            "z",
        ]);
        expect(stateVariables["/a2"].stateValues.value.tree).eqls([
            "*",
            "q",
            "z",
        ]);
        expect(stateVariables["/b"].stateValues.value.tree).eqls([
            "apply",
            "q",
            "z",
        ]);
        expect(stateVariables["/b2"].stateValues.value.tree).eqls([
            "apply",
            "q",
            "z",
        ]);
    });

    it("display digits", async () => {
        let core = await createTestCore({
            doenetML: `
    <text>a</text>
    <p>a: <mathinput name="a" displayDigits="5" prefill="sin(2x)"/></p>
    <p>a2: <copy source="a" prop="value" assignNames="a2" /></p>
    <p>a3: <copy source="a" prop="immediateValue" assignNames="a3" /></p>
    <p>a4: <copy source="a" prop="value" assignNames="a4" displayDigits="16" /></p>
    <p>a5: <copy source="a" prop="immediateValue" assignNames="a5" displayDigits="16" /></p>

    <p>b: <math name="b" displayDigits="10">10e^(3y)</math></p>
    <p>b2: <mathinput name="b2" bindValueTo="$b"  displayDigits="3" /></p>
    <p>b3: <copy source="b2" prop="value" assignNames="b3" /></p>
    <p>b4: <copy source="b2" prop="immediateValue" assignNames="b4" /></p>
    <p>b5: <copy source="b2" prop="value" assignNames="b5" displayDigits="16" /></p>
    <p>b6: <copy source="b2" prop="immediateValue" assignNames="b6" displayDigits="16" /></p>
    `,
        });

        let stateVariables = await returnAllStateVariables(core);
        expect(
            cleanLatex(stateVariables["/a"].stateValues.rawRendererValue),
        ).eq("\\sin(2x)");
        expect(cleanLatex(stateVariables["/a2"].stateValues.latex)).eq(
            "\\sin(2x)",
        );
        expect(cleanLatex(stateVariables["/a3"].stateValues.latex)).eq(
            "\\sin(2x)",
        );
        expect(cleanLatex(stateVariables["/a4"].stateValues.latex)).eq(
            "\\sin(2x)",
        );
        expect(cleanLatex(stateVariables["/a5"].stateValues.latex)).eq(
            "\\sin(2x)",
        );
        expect(cleanLatex(stateVariables["/b"].stateValues.latex)).eq(
            "10e^{3y}",
        );
        expect(
            cleanLatex(stateVariables["/b2"].stateValues.rawRendererValue),
        ).eq("10e^{3y}");
        expect(cleanLatex(stateVariables["/b3"].stateValues.latex)).eq(
            "10e^{3y}",
        );
        expect(cleanLatex(stateVariables["/b4"].stateValues.latex)).eq(
            "10e^{3y}",
        );
        expect(cleanLatex(stateVariables["/b5"].stateValues.latex)).eq(
            "10e^{3y}",
        );
        expect(cleanLatex(stateVariables["/b6"].stateValues.latex)).eq(
            "10e^{3y}",
        );

        expect(stateVariables["/a"].stateValues.value.tree).eqls([
            "apply",
            "sin",
            ["*", 2, "x"],
        ]);
        expect(stateVariables["/a"].stateValues.valueForDisplay.tree).eqls([
            "apply",
            "sin",
            ["*", 2, "x"],
        ]);
        expect(stateVariables["/a2"].stateValues.value.tree).eqls([
            "apply",
            "sin",
            ["*", 2, "x"],
        ]);
        expect(stateVariables["/a2"].stateValues.valueForDisplay.tree).eqls([
            "apply",
            "sin",
            ["*", 2, "x"],
        ]);
        expect(stateVariables["/a3"].stateValues.value.tree).eqls([
            "apply",
            "sin",
            ["*", 2, "x"],
        ]);
        expect(stateVariables["/a3"].stateValues.valueForDisplay.tree).eqls([
            "apply",
            "sin",
            ["*", 2, "x"],
        ]);
        expect(stateVariables["/a4"].stateValues.value.tree).eqls([
            "apply",
            "sin",
            ["*", 2, "x"],
        ]);
        expect(stateVariables["/a4"].stateValues.valueForDisplay.tree).eqls([
            "apply",
            "sin",
            ["*", 2, "x"],
        ]);
        expect(stateVariables["/a5"].stateValues.value.tree).eqls([
            "apply",
            "sin",
            ["*", 2, "x"],
        ]);
        expect(stateVariables["/a5"].stateValues.valueForDisplay.tree).eqls([
            "apply",
            "sin",
            ["*", 2, "x"],
        ]);
        expect(stateVariables["/b"].stateValues.value.tree).eqls([
            "*",
            10,
            ["^", "e", ["*", 3, "y"]],
        ]);
        expect(stateVariables["/b2"].stateValues.value.tree).eqls([
            "*",
            10,
            ["^", "e", ["*", 3, "y"]],
        ]);
        expect(stateVariables["/b2"].stateValues.valueForDisplay.tree).eqls([
            "*",
            10,
            ["^", "e", ["*", 3, "y"]],
        ]);
        expect(stateVariables["/b3"].stateValues.value.tree).eqls([
            "*",
            10,
            ["^", "e", ["*", 3, "y"]],
        ]);
        expect(stateVariables["/b3"].stateValues.valueForDisplay.tree).eqls([
            "*",
            10,
            ["^", "e", ["*", 3, "y"]],
        ]);
        expect(stateVariables["/b4"].stateValues.value.tree).eqls([
            "*",
            10,
            ["^", "e", ["*", 3, "y"]],
        ]);
        expect(stateVariables["/b4"].stateValues.valueForDisplay.tree).eqls([
            "*",
            10,
            ["^", "e", ["*", 3, "y"]],
        ]);
        expect(stateVariables["/b5"].stateValues.value.tree).eqls([
            "*",
            10,
            ["^", "e", ["*", 3, "y"]],
        ]);
        expect(stateVariables["/b5"].stateValues.valueForDisplay.tree).eqls([
            "*",
            10,
            ["^", "e", ["*", 3, "y"]],
        ]);
        expect(stateVariables["/b6"].stateValues.value.tree).eqls([
            "*",
            10,
            ["^", "e", ["*", 3, "y"]],
        ]);
        expect(stateVariables["/b6"].stateValues.valueForDisplay.tree).eqls([
            "*",
            10,
            ["^", "e", ["*", 3, "y"]],
        ]);

        await updateMathInputImmediateValue({
            latex: "\\sin(345.15389319x)",
            name: "/a",
            core,
        });

        stateVariables = await returnAllStateVariables(core);

        expect(
            cleanLatex(stateVariables["/a"].stateValues.rawRendererValue),
        ).eq("\\sin(345.15389319x)");
        expect(cleanLatex(stateVariables["/a2"].stateValues.latex)).eq(
            "\\sin(2x)",
        );
        expect(cleanLatex(stateVariables["/a3"].stateValues.latex)).eq(
            "\\sin(345.15x)",
        );
        expect(cleanLatex(stateVariables["/a4"].stateValues.latex)).eq(
            "\\sin(2x)",
        );

        expect(cleanLatex(stateVariables["/a5"].stateValues.latex)).eq(
            "\\sin(345.15389319x)",
        );

        await updateMathInputValueToImmediateValue({
            name: "/a",
            core,
        });
        await updateMathInputImmediateValue({
            latex: "2.047529344518e^{0.0000073013048309y}",
            name: "/b2",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(
            cleanLatex(stateVariables["/a"].stateValues.rawRendererValue),
        ).eq("\\sin(345.15x)");
        expect(cleanLatex(stateVariables["/a2"].stateValues.latex)).eq(
            "\\sin(345.15x)",
        );
        expect(cleanLatex(stateVariables["/a3"].stateValues.latex)).eq(
            "\\sin(345.15x)",
        );
        expect(cleanLatex(stateVariables["/a4"].stateValues.latex)).eq(
            "\\sin(345.15389319x)",
        );
        expect(cleanLatex(stateVariables["/a5"].stateValues.latex)).eq(
            "\\sin(345.15389319x)",
        );

        expect(cleanLatex(stateVariables["/b"].stateValues.latex)).eq(
            "10e^{3y}",
        );
        expect(
            cleanLatex(stateVariables["/b2"].stateValues.rawRendererValue),
        ).eq("2.047529344518e^{0.0000073013048309y}");
        expect(cleanLatex(stateVariables["/b3"].stateValues.latex)).eq(
            "10e^{3y}",
        );
        expect(cleanLatex(stateVariables["/b4"].stateValues.latex)).eq(
            "2.05e^{0.0000073y}",
        );
        expect(cleanLatex(stateVariables["/b5"].stateValues.latex)).eq(
            "10e^{3y}",
        );
        expect(cleanLatex(stateVariables["/b6"].stateValues.latex)).eq(
            "2.047529344518e^{0.0000073013048309y}",
        );

        await updateMathInputValueToImmediateValue({
            name: "/b2",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(cleanLatex(stateVariables["/b"].stateValues.latex)).eq(
            "2.047529345e^{0.000007301304831y}",
        );
        expect(
            cleanLatex(stateVariables["/b2"].stateValues.rawRendererValue),
        ).eq("2.05e^{0.0000073y}");
        expect(cleanLatex(stateVariables["/b3"].stateValues.latex)).eq(
            "2.05e^{0.0000073y}",
        );
        expect(cleanLatex(stateVariables["/b4"].stateValues.latex)).eq(
            "2.05e^{0.0000073y}",
        );
        expect(cleanLatex(stateVariables["/b5"].stateValues.latex)).eq(
            "2.047529344518e^{0.0000073013048309y}",
        );
        expect(cleanLatex(stateVariables["/b6"].stateValues.latex)).eq(
            "2.047529344518e^{0.0000073013048309y}",
        );

        expect(stateVariables["/a"].stateValues.value.tree).eqls([
            "apply",
            "sin",
            ["*", 345.15389319, "x"],
        ]);
        expect(stateVariables["/a"].stateValues.valueForDisplay.tree).eqls([
            "apply",
            "sin",
            ["*", 345.15, "x"],
        ]);
        expect(stateVariables["/a2"].stateValues.value.tree).eqls([
            "apply",
            "sin",
            ["*", 345.15389319, "x"],
        ]);
        expect(stateVariables["/a2"].stateValues.valueForDisplay.tree).eqls([
            "apply",
            "sin",
            ["*", 345.15, "x"],
        ]);
        expect(stateVariables["/a3"].stateValues.value.tree).eqls([
            "apply",
            "sin",
            ["*", 345.15389319, "x"],
        ]);
        expect(stateVariables["/a3"].stateValues.valueForDisplay.tree).eqls([
            "apply",
            "sin",
            ["*", 345.15, "x"],
        ]);
        expect(stateVariables["/a4"].stateValues.value.tree).eqls([
            "apply",
            "sin",
            ["*", 345.15389319, "x"],
        ]);
        expect(stateVariables["/a4"].stateValues.valueForDisplay.tree).eqls([
            "apply",
            "sin",
            ["*", 345.15389319, "x"],
        ]);
        expect(stateVariables["/a5"].stateValues.value.tree).eqls([
            "apply",
            "sin",
            ["*", 345.15389319, "x"],
        ]);
        expect(stateVariables["/a5"].stateValues.valueForDisplay.tree).eqls([
            "apply",
            "sin",
            ["*", 345.15389319, "x"],
        ]);
        expect(stateVariables["/b"].stateValues.value.tree).eqls([
            "*",
            2.047529344518,
            ["^", "e", ["*", 0.0000073013048309, "y"]],
        ]);
        expect(stateVariables["/b2"].stateValues.value.tree).eqls([
            "*",
            2.047529344518,
            ["^", "e", ["*", 0.0000073013048309, "y"]],
        ]);
        expect(stateVariables["/b2"].stateValues.valueForDisplay.tree).eqls([
            "*",
            2.05,
            ["^", "e", ["*", 0.0000073, "y"]],
        ]);
        expect(stateVariables["/b3"].stateValues.value.tree).eqls([
            "*",
            2.047529344518,
            ["^", "e", ["*", 0.0000073013048309, "y"]],
        ]);
        expect(stateVariables["/b3"].stateValues.valueForDisplay.tree).eqls([
            "*",
            2.05,
            ["^", "e", ["*", 0.0000073, "y"]],
        ]);
        expect(stateVariables["/b4"].stateValues.value.tree).eqls([
            "*",
            2.047529344518,
            ["^", "e", ["*", 0.0000073013048309, "y"]],
        ]);
        expect(stateVariables["/b4"].stateValues.valueForDisplay.tree).eqls([
            "*",
            2.05,
            ["^", "e", ["*", 0.0000073, "y"]],
        ]);
        expect(stateVariables["/b5"].stateValues.value.tree).eqls([
            "*",
            2.047529344518,
            ["^", "e", ["*", 0.0000073013048309, "y"]],
        ]);
        expect(stateVariables["/b5"].stateValues.valueForDisplay.tree).eqls([
            "*",
            2.047529344518,
            ["^", "e", ["*", 0.0000073013048309, "y"]],
        ]);
        expect(stateVariables["/b6"].stateValues.value.tree).eqls([
            "*",
            2.047529344518,
            ["^", "e", ["*", 0.0000073013048309, "y"]],
        ]);
        expect(stateVariables["/b6"].stateValues.valueForDisplay.tree).eqls([
            "*",
            2.047529344518,
            ["^", "e", ["*", 0.0000073013048309, "y"]],
        ]);

        await updateMathInputImmediateValue({
            latex: "\\sin(345.14x)",
            name: "/a",
            core,
        });

        stateVariables = await returnAllStateVariables(core);

        expect(
            cleanLatex(stateVariables["/a"].stateValues.rawRendererValue),
        ).eq("\\sin(345.14x)");
        expect(cleanLatex(stateVariables["/a2"].stateValues.latex)).eq(
            "\\sin(345.15x)",
        );
        expect(cleanLatex(stateVariables["/a3"].stateValues.latex)).eq(
            "\\sin(345.14x)",
        );
        expect(cleanLatex(stateVariables["/a4"].stateValues.latex)).eq(
            "\\sin(345.15389319x)",
        );
        expect(cleanLatex(stateVariables["/a5"].stateValues.latex)).eq(
            "\\sin(345.14x)",
        );

        expect(stateVariables["/a"].stateValues.value.tree).eqls([
            "apply",
            "sin",
            ["*", 345.15389319, "x"],
        ]);
        expect(stateVariables["/a"].stateValues.valueForDisplay.tree).eqls([
            "apply",
            "sin",
            ["*", 345.15, "x"],
        ]);
        expect(stateVariables["/a2"].stateValues.value.tree).eqls([
            "apply",
            "sin",
            ["*", 345.15389319, "x"],
        ]);
        expect(stateVariables["/a2"].stateValues.valueForDisplay.tree).eqls([
            "apply",
            "sin",
            ["*", 345.15, "x"],
        ]);
        expect(stateVariables["/a3"].stateValues.value.tree).eqls([
            "apply",
            "sin",
            ["*", 345.14, "x"],
        ]);
        expect(stateVariables["/a3"].stateValues.valueForDisplay.tree).eqls([
            "apply",
            "sin",
            ["*", 345.14, "x"],
        ]);
        expect(stateVariables["/a4"].stateValues.value.tree).eqls([
            "apply",
            "sin",
            ["*", 345.15389319, "x"],
        ]);
        expect(stateVariables["/a4"].stateValues.valueForDisplay.tree).eqls([
            "apply",
            "sin",
            ["*", 345.15389319, "x"],
        ]);
        expect(stateVariables["/a5"].stateValues.value.tree).eqls([
            "apply",
            "sin",
            ["*", 345.14, "x"],
        ]);
        expect(stateVariables["/a5"].stateValues.valueForDisplay.tree).eqls([
            "apply",
            "sin",
            ["*", 345.14, "x"],
        ]);

        await updateMathInputValueToImmediateValue({
            name: "/a",
            core,
        });

        stateVariables = await returnAllStateVariables(core);

        expect(
            cleanLatex(stateVariables["/a"].stateValues.rawRendererValue),
        ).eq("\\sin(345.14x)");
        expect(cleanLatex(stateVariables["/a2"].stateValues.latex)).eq(
            "\\sin(345.14x)",
        );
        expect(cleanLatex(stateVariables["/a3"].stateValues.latex)).eq(
            "\\sin(345.14x)",
        );
        expect(cleanLatex(stateVariables["/a4"].stateValues.latex)).eq(
            "\\sin(345.14x)",
        );
        expect(cleanLatex(stateVariables["/a5"].stateValues.latex)).eq(
            "\\sin(345.14x)",
        );

        expect(stateVariables["/a"].stateValues.value.tree).eqls([
            "apply",
            "sin",
            ["*", 345.14, "x"],
        ]);
        expect(stateVariables["/a"].stateValues.valueForDisplay.tree).eqls([
            "apply",
            "sin",
            ["*", 345.14, "x"],
        ]);
        expect(stateVariables["/a2"].stateValues.value.tree).eqls([
            "apply",
            "sin",
            ["*", 345.14, "x"],
        ]);
        expect(stateVariables["/a2"].stateValues.valueForDisplay.tree).eqls([
            "apply",
            "sin",
            ["*", 345.14, "x"],
        ]);
        expect(stateVariables["/a3"].stateValues.value.tree).eqls([
            "apply",
            "sin",
            ["*", 345.14, "x"],
        ]);
        expect(stateVariables["/a3"].stateValues.valueForDisplay.tree).eqls([
            "apply",
            "sin",
            ["*", 345.14, "x"],
        ]);
        expect(stateVariables["/a4"].stateValues.value.tree).eqls([
            "apply",
            "sin",
            ["*", 345.14, "x"],
        ]);
        expect(stateVariables["/a4"].stateValues.valueForDisplay.tree).eqls([
            "apply",
            "sin",
            ["*", 345.14, "x"],
        ]);
        expect(stateVariables["/a5"].stateValues.value.tree).eqls([
            "apply",
            "sin",
            ["*", 345.14, "x"],
        ]);
        expect(stateVariables["/a5"].stateValues.valueForDisplay.tree).eqls([
            "apply",
            "sin",
            ["*", 345.14, "x"],
        ]);

        await updateMathInputImmediateValue({
            latex: "6.05e^{0.0000073y}",
            name: "/b2",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(cleanLatex(stateVariables["/b"].stateValues.latex)).eq(
            "2.047529345e^{0.000007301304831y}",
        );
        expect(
            cleanLatex(stateVariables["/b2"].stateValues.rawRendererValue),
        ).eq("6.05e^{0.0000073y}");
        expect(cleanLatex(stateVariables["/b3"].stateValues.latex)).eq(
            "2.05e^{0.0000073y}",
        );
        expect(cleanLatex(stateVariables["/b4"].stateValues.latex)).eq(
            "6.05e^{0.0000073y}",
        );
        expect(cleanLatex(stateVariables["/b5"].stateValues.latex)).eq(
            "2.047529344518e^{0.0000073013048309y}",
        );
        expect(cleanLatex(stateVariables["/b6"].stateValues.latex)).eq(
            "6.05e^{0.0000073y}",
        );

        expect(stateVariables["/b"].stateValues.value.tree).eqls([
            "*",
            2.047529344518,
            ["^", "e", ["*", 0.0000073013048309, "y"]],
        ]);
        expect(stateVariables["/b2"].stateValues.value.tree).eqls([
            "*",
            2.047529344518,
            ["^", "e", ["*", 0.0000073013048309, "y"]],
        ]);
        expect(stateVariables["/b2"].stateValues.valueForDisplay.tree).eqls([
            "*",
            2.05,
            ["^", "e", ["*", 0.0000073, "y"]],
        ]);
        expect(stateVariables["/b3"].stateValues.value.tree).eqls([
            "*",
            2.047529344518,
            ["^", "e", ["*", 0.0000073013048309, "y"]],
        ]);
        expect(stateVariables["/b3"].stateValues.valueForDisplay.tree).eqls([
            "*",
            2.05,
            ["^", "e", ["*", 0.0000073, "y"]],
        ]);
        expect(stateVariables["/b4"].stateValues.value.tree).eqls([
            "*",
            6.05,
            ["^", "e", ["*", 0.0000073, "y"]],
        ]);
        expect(stateVariables["/b4"].stateValues.valueForDisplay.tree).eqls([
            "*",
            6.05,
            ["^", "e", ["*", 0.0000073, "y"]],
        ]);
        expect(stateVariables["/b5"].stateValues.value.tree).eqls([
            "*",
            2.047529344518,
            ["^", "e", ["*", 0.0000073013048309, "y"]],
        ]);
        expect(stateVariables["/b5"].stateValues.valueForDisplay.tree).eqls([
            "*",
            2.047529344518,
            ["^", "e", ["*", 0.0000073013048309, "y"]],
        ]);
        expect(stateVariables["/b6"].stateValues.value.tree).eqls([
            "*",
            6.05,
            ["^", "e", ["*", 0.0000073, "y"]],
        ]);
        expect(stateVariables["/b6"].stateValues.valueForDisplay.tree).eqls([
            "*",
            6.05,
            ["^", "e", ["*", 0.0000073, "y"]],
        ]);

        await updateMathInputValueToImmediateValue({
            name: "/b2",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(cleanLatex(stateVariables["/b"].stateValues.latex)).eq(
            "6.05e^{0.0000073y}",
        );
        expect(
            cleanLatex(stateVariables["/b2"].stateValues.rawRendererValue),
        ).eq("6.05e^{0.0000073y}");
        expect(cleanLatex(stateVariables["/b3"].stateValues.latex)).eq(
            "6.05e^{0.0000073y}",
        );
        expect(cleanLatex(stateVariables["/b4"].stateValues.latex)).eq(
            "6.05e^{0.0000073y}",
        );
        expect(cleanLatex(stateVariables["/b5"].stateValues.latex)).eq(
            "6.05e^{0.0000073y}",
        );
        expect(cleanLatex(stateVariables["/b6"].stateValues.latex)).eq(
            "6.05e^{0.0000073y}",
        );

        expect(stateVariables["/b"].stateValues.value.tree).eqls([
            "*",
            6.05,
            ["^", "e", ["*", 0.0000073, "y"]],
        ]);
        expect(stateVariables["/b2"].stateValues.value.tree).eqls([
            "*",
            6.05,
            ["^", "e", ["*", 0.0000073, "y"]],
        ]);
        expect(stateVariables["/b2"].stateValues.valueForDisplay.tree).eqls([
            "*",
            6.05,
            ["^", "e", ["*", 0.0000073, "y"]],
        ]);
        expect(stateVariables["/b3"].stateValues.value.tree).eqls([
            "*",
            6.05,
            ["^", "e", ["*", 0.0000073, "y"]],
        ]);
        expect(stateVariables["/b3"].stateValues.valueForDisplay.tree).eqls([
            "*",
            6.05,
            ["^", "e", ["*", 0.0000073, "y"]],
        ]);
        expect(stateVariables["/b4"].stateValues.value.tree).eqls([
            "*",
            6.05,
            ["^", "e", ["*", 0.0000073, "y"]],
        ]);
        expect(stateVariables["/b4"].stateValues.valueForDisplay.tree).eqls([
            "*",
            6.05,
            ["^", "e", ["*", 0.0000073, "y"]],
        ]);
        expect(stateVariables["/b5"].stateValues.value.tree).eqls([
            "*",
            6.05,
            ["^", "e", ["*", 0.0000073, "y"]],
        ]);
        expect(stateVariables["/b5"].stateValues.valueForDisplay.tree).eqls([
            "*",
            6.05,
            ["^", "e", ["*", 0.0000073, "y"]],
        ]);
        expect(stateVariables["/b6"].stateValues.value.tree).eqls([
            "*",
            6.05,
            ["^", "e", ["*", 0.0000073, "y"]],
        ]);
        expect(stateVariables["/b6"].stateValues.valueForDisplay.tree).eqls([
            "*",
            6.05,
            ["^", "e", ["*", 0.0000073, "y"]],
        ]);
    });

    it("display decimals", async () => {
        let core = await createTestCore({
            doenetML: `
    <p>a: <mathinput name="a" displayDecimals="2" prefill="sin(2x)"/></p>
    <p>a2: <copy source="a" prop="value" assignNames="a2" /></p>
    <p>a3: <copy source="a" prop="immediateValue" assignNames="a3" /></p>

    <p>b: <math name="b" displayDigits="10">10e^(3y)</math></p>
    <p>b2: <mathinput name="b2" bindValueTo="$b" displayDecimals="8" /></p>
    <p>b3: <copy source="b2" prop="value" assignNames="b3" /></p>
    <p>b4: <copy source="b2" prop="immediateValue" assignNames="b4" /></p>
    `,
        });

        let stateVariables = await returnAllStateVariables(core);

        expect(
            cleanLatex(stateVariables["/a"].stateValues.rawRendererValue),
        ).eq("\\sin(2x)");
        expect(cleanLatex(stateVariables["/a2"].stateValues.latex)).eq(
            "\\sin(2x)",
        );
        expect(cleanLatex(stateVariables["/a3"].stateValues.latex)).eq(
            "\\sin(2x)",
        );
        expect(cleanLatex(stateVariables["/b"].stateValues.latex)).eq(
            "10e^{3y}",
        );
        expect(
            cleanLatex(stateVariables["/b2"].stateValues.rawRendererValue),
        ).eq("10e^{3y}");
        expect(cleanLatex(stateVariables["/b3"].stateValues.latex)).eq(
            "10e^{3y}",
        );
        expect(cleanLatex(stateVariables["/b4"].stateValues.latex)).eq(
            "10e^{3y}",
        );

        expect(stateVariables["/a"].stateValues.value.tree).eqls([
            "apply",
            "sin",
            ["*", 2, "x"],
        ]);
        expect(stateVariables["/a"].stateValues.valueForDisplay.tree).eqls([
            "apply",
            "sin",
            ["*", 2, "x"],
        ]);
        expect(stateVariables["/a2"].stateValues.value.tree).eqls([
            "apply",
            "sin",
            ["*", 2, "x"],
        ]);
        expect(stateVariables["/a2"].stateValues.valueForDisplay.tree).eqls([
            "apply",
            "sin",
            ["*", 2, "x"],
        ]);
        expect(stateVariables["/a3"].stateValues.value.tree).eqls([
            "apply",
            "sin",
            ["*", 2, "x"],
        ]);
        expect(stateVariables["/a3"].stateValues.valueForDisplay.tree).eqls([
            "apply",
            "sin",
            ["*", 2, "x"],
        ]);
        expect(stateVariables["/b"].stateValues.value.tree).eqls([
            "*",
            10,
            ["^", "e", ["*", 3, "y"]],
        ]);
        expect(stateVariables["/b2"].stateValues.value.tree).eqls([
            "*",
            10,
            ["^", "e", ["*", 3, "y"]],
        ]);
        expect(stateVariables["/b2"].stateValues.valueForDisplay.tree).eqls([
            "*",
            10,
            ["^", "e", ["*", 3, "y"]],
        ]);
        expect(stateVariables["/b3"].stateValues.value.tree).eqls([
            "*",
            10,
            ["^", "e", ["*", 3, "y"]],
        ]);
        expect(stateVariables["/b3"].stateValues.valueForDisplay.tree).eqls([
            "*",
            10,
            ["^", "e", ["*", 3, "y"]],
        ]);
        expect(stateVariables["/b4"].stateValues.value.tree).eqls([
            "*",
            10,
            ["^", "e", ["*", 3, "y"]],
        ]);
        expect(stateVariables["/b4"].stateValues.valueForDisplay.tree).eqls([
            "*",
            10,
            ["^", "e", ["*", 3, "y"]],
        ]);

        await updateMathInputImmediateValue({
            latex: "\\sin(345.15389319x)",
            name: "/a",
            core,
        });

        stateVariables = await returnAllStateVariables(core);

        expect(
            cleanLatex(stateVariables["/a"].stateValues.rawRendererValue),
        ).eq("\\sin(345.15389319x)");
        expect(cleanLatex(stateVariables["/a2"].stateValues.latex)).eq(
            "\\sin(2x)",
        );
        expect(cleanLatex(stateVariables["/a3"].stateValues.latex)).eq(
            "\\sin(345.15x)",
        );

        await updateMathInputValueToImmediateValue({
            name: "/a",
            core,
        });
        await updateMathInputImmediateValue({
            latex: "2.047529344518e^{0.0000073013048309y}",
            name: "/b2",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(
            cleanLatex(stateVariables["/a"].stateValues.rawRendererValue),
        ).eq("\\sin(345.15x)");
        expect(cleanLatex(stateVariables["/a2"].stateValues.latex)).eq(
            "\\sin(345.15x)",
        );
        expect(cleanLatex(stateVariables["/a3"].stateValues.latex)).eq(
            "\\sin(345.15x)",
        );

        expect(cleanLatex(stateVariables["/b"].stateValues.latex)).eq(
            "10e^{3y}",
        );
        expect(
            cleanLatex(stateVariables["/b2"].stateValues.rawRendererValue),
        ).eq("2.047529344518e^{0.0000073013048309y}");
        expect(cleanLatex(stateVariables["/b3"].stateValues.latex)).eq(
            "10e^{3y}",
        );
        expect(cleanLatex(stateVariables["/b4"].stateValues.latex)).eq(
            "2.04752934e^{0.0000073y}",
        );

        await updateMathInputValueToImmediateValue({
            name: "/b2",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(cleanLatex(stateVariables["/b"].stateValues.latex)).eq(
            "2.047529345e^{0.000007301304831y}",
        );
        expect(
            cleanLatex(stateVariables["/b2"].stateValues.rawRendererValue),
        ).eq("2.04752934e^{0.0000073y}");
        expect(cleanLatex(stateVariables["/b3"].stateValues.latex)).eq(
            "2.04752934e^{0.0000073y}",
        );
        expect(cleanLatex(stateVariables["/b4"].stateValues.latex)).eq(
            "2.04752934e^{0.0000073y}",
        );

        expect(stateVariables["/a"].stateValues.value.tree).eqls([
            "apply",
            "sin",
            ["*", 345.15389319, "x"],
        ]);
        expect(stateVariables["/a"].stateValues.valueForDisplay.tree).eqls([
            "apply",
            "sin",
            ["*", 345.15, "x"],
        ]);
        expect(stateVariables["/a2"].stateValues.value.tree).eqls([
            "apply",
            "sin",
            ["*", 345.15389319, "x"],
        ]);
        expect(stateVariables["/a2"].stateValues.valueForDisplay.tree).eqls([
            "apply",
            "sin",
            ["*", 345.15, "x"],
        ]);
        expect(stateVariables["/a3"].stateValues.value.tree).eqls([
            "apply",
            "sin",
            ["*", 345.15389319, "x"],
        ]);
        expect(stateVariables["/a3"].stateValues.valueForDisplay.tree).eqls([
            "apply",
            "sin",
            ["*", 345.15, "x"],
        ]);
        expect(stateVariables["/b"].stateValues.value.tree).eqls([
            "*",
            2.047529344518,
            ["^", "e", ["*", 0.0000073013048309, "y"]],
        ]);
        expect(stateVariables["/b2"].stateValues.value.tree).eqls([
            "*",
            2.047529344518,
            ["^", "e", ["*", 0.0000073013048309, "y"]],
        ]);
        expect(stateVariables["/b2"].stateValues.valueForDisplay.tree).eqls([
            "*",
            2.04752934,
            ["^", "e", ["*", 0.0000073, "y"]],
        ]);
        expect(stateVariables["/b3"].stateValues.value.tree).eqls([
            "*",
            2.047529344518,
            ["^", "e", ["*", 0.0000073013048309, "y"]],
        ]);
        expect(stateVariables["/b3"].stateValues.valueForDisplay.tree).eqls([
            "*",
            2.04752934,
            ["^", "e", ["*", 0.0000073, "y"]],
        ]);
        expect(stateVariables["/b4"].stateValues.value.tree).eqls([
            "*",
            2.047529344518,
            ["^", "e", ["*", 0.0000073013048309, "y"]],
        ]);
        expect(stateVariables["/b4"].stateValues.valueForDisplay.tree).eqls([
            "*",
            2.04752934,
            ["^", "e", ["*", 0.0000073, "y"]],
        ]);

        await updateMathInputImmediateValue({
            latex: "\\sin(345.14x)",
            name: "/a",
            core,
        });

        stateVariables = await returnAllStateVariables(core);

        expect(
            cleanLatex(stateVariables["/a"].stateValues.rawRendererValue),
        ).eq("\\sin(345.14x)");
        expect(cleanLatex(stateVariables["/a2"].stateValues.latex)).eq(
            "\\sin(345.15x)",
        );
        expect(cleanLatex(stateVariables["/a3"].stateValues.latex)).eq(
            "\\sin(345.14x)",
        );

        expect(stateVariables["/a"].stateValues.value.tree).eqls([
            "apply",
            "sin",
            ["*", 345.15389319, "x"],
        ]);
        expect(stateVariables["/a"].stateValues.valueForDisplay.tree).eqls([
            "apply",
            "sin",
            ["*", 345.15, "x"],
        ]);
        expect(stateVariables["/a2"].stateValues.value.tree).eqls([
            "apply",
            "sin",
            ["*", 345.15389319, "x"],
        ]);
        expect(stateVariables["/a2"].stateValues.valueForDisplay.tree).eqls([
            "apply",
            "sin",
            ["*", 345.15, "x"],
        ]);
        expect(stateVariables["/a3"].stateValues.value.tree).eqls([
            "apply",
            "sin",
            ["*", 345.14, "x"],
        ]);
        expect(stateVariables["/a3"].stateValues.valueForDisplay.tree).eqls([
            "apply",
            "sin",
            ["*", 345.14, "x"],
        ]);

        await updateMathInputValueToImmediateValue({
            name: "/a",
            core,
        });

        stateVariables = await returnAllStateVariables(core);

        expect(
            cleanLatex(stateVariables["/a"].stateValues.rawRendererValue),
        ).eq("\\sin(345.14x)");
        expect(cleanLatex(stateVariables["/a2"].stateValues.latex)).eq(
            "\\sin(345.14x)",
        );
        expect(cleanLatex(stateVariables["/a3"].stateValues.latex)).eq(
            "\\sin(345.14x)",
        );

        expect(stateVariables["/a"].stateValues.value.tree).eqls([
            "apply",
            "sin",
            ["*", 345.14, "x"],
        ]);
        expect(stateVariables["/a"].stateValues.valueForDisplay.tree).eqls([
            "apply",
            "sin",
            ["*", 345.14, "x"],
        ]);
        expect(stateVariables["/a2"].stateValues.value.tree).eqls([
            "apply",
            "sin",
            ["*", 345.14, "x"],
        ]);
        expect(stateVariables["/a2"].stateValues.valueForDisplay.tree).eqls([
            "apply",
            "sin",
            ["*", 345.14, "x"],
        ]);
        expect(stateVariables["/a3"].stateValues.value.tree).eqls([
            "apply",
            "sin",
            ["*", 345.14, "x"],
        ]);
        expect(stateVariables["/a3"].stateValues.valueForDisplay.tree).eqls([
            "apply",
            "sin",
            ["*", 345.14, "x"],
        ]);

        await updateMathInputImmediateValue({
            latex: "6.04752934e^{0.0000073y}",
            name: "/b2",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(cleanLatex(stateVariables["/b"].stateValues.latex)).eq(
            "2.047529345e^{0.000007301304831y}",
        );
        expect(
            cleanLatex(stateVariables["/b2"].stateValues.rawRendererValue),
        ).eq("6.04752934e^{0.0000073y}");
        expect(cleanLatex(stateVariables["/b3"].stateValues.latex)).eq(
            "2.04752934e^{0.0000073y}",
        );
        expect(cleanLatex(stateVariables["/b4"].stateValues.latex)).eq(
            "6.04752934e^{0.0000073y}",
        );

        expect(stateVariables["/b"].stateValues.value.tree).eqls([
            "*",
            2.047529344518,
            ["^", "e", ["*", 0.0000073013048309, "y"]],
        ]);
        expect(stateVariables["/b2"].stateValues.value.tree).eqls([
            "*",
            2.047529344518,
            ["^", "e", ["*", 0.0000073013048309, "y"]],
        ]);
        expect(stateVariables["/b2"].stateValues.valueForDisplay.tree).eqls([
            "*",
            2.04752934,
            ["^", "e", ["*", 0.0000073, "y"]],
        ]);
        expect(stateVariables["/b3"].stateValues.value.tree).eqls([
            "*",
            2.047529344518,
            ["^", "e", ["*", 0.0000073013048309, "y"]],
        ]);
        expect(stateVariables["/b3"].stateValues.valueForDisplay.tree).eqls([
            "*",
            2.04752934,
            ["^", "e", ["*", 0.0000073, "y"]],
        ]);
        expect(stateVariables["/b4"].stateValues.value.tree).eqls([
            "*",
            6.04752934,
            ["^", "e", ["*", 0.0000073, "y"]],
        ]);
        expect(stateVariables["/b4"].stateValues.valueForDisplay.tree).eqls([
            "*",
            6.04752934,
            ["^", "e", ["*", 0.0000073, "y"]],
        ]);

        await updateMathInputValueToImmediateValue({
            name: "/b2",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(cleanLatex(stateVariables["/b"].stateValues.latex)).eq(
            "6.04752934e^{0.0000073y}",
        );
        expect(
            cleanLatex(stateVariables["/b2"].stateValues.rawRendererValue),
        ).eq("6.04752934e^{0.0000073y}");
        expect(cleanLatex(stateVariables["/b3"].stateValues.latex)).eq(
            "6.04752934e^{0.0000073y}",
        );
        expect(cleanLatex(stateVariables["/b4"].stateValues.latex)).eq(
            "6.04752934e^{0.0000073y}",
        );

        expect(stateVariables["/b"].stateValues.value.tree).eqls([
            "*",
            6.04752934,
            ["^", "e", ["*", 0.0000073, "y"]],
        ]);
        expect(stateVariables["/b2"].stateValues.value.tree).eqls([
            "*",
            6.04752934,
            ["^", "e", ["*", 0.0000073, "y"]],
        ]);
        expect(stateVariables["/b2"].stateValues.valueForDisplay.tree).eqls([
            "*",
            6.04752934,
            ["^", "e", ["*", 0.0000073, "y"]],
        ]);
        expect(stateVariables["/b3"].stateValues.value.tree).eqls([
            "*",
            6.04752934,
            ["^", "e", ["*", 0.0000073, "y"]],
        ]);
        expect(stateVariables["/b3"].stateValues.valueForDisplay.tree).eqls([
            "*",
            6.04752934,
            ["^", "e", ["*", 0.0000073, "y"]],
        ]);
        expect(stateVariables["/b4"].stateValues.value.tree).eqls([
            "*",
            6.04752934,
            ["^", "e", ["*", 0.0000073, "y"]],
        ]);
        expect(stateVariables["/b4"].stateValues.valueForDisplay.tree).eqls([
            "*",
            6.04752934,
            ["^", "e", ["*", 0.0000073, "y"]],
        ]);
    });

    it("display small as zero", async () => {
        let core = await createTestCore({
            doenetML: `
    <text>a</text>
    <p>a: <mathinput name="a" displayDigits="5" prefill="sin(2x)"/></p>
    <p>a2: <copy source="a" prop="value" assignNames="a2" /></p>
    <p>a3: <copy source="a" prop="immediatevalue" assignNames="a3" /></p>
  
    <p>b: <math name="b" displayDigits="10" displaySmallAsZero="false">10e^(3y)</math></p>
    <p>b2: <mathinput name="b2" bindValueTo="$b"  displayDigits="3" /></p>
    <p>b3: <copy source="b2" prop="value" assignNames="b3" /></p>
    <p>b4: <copy source="b2" prop="immediatevalue" assignNames="b4" /></p>

    <p>c: <mathinput name="c" displayDigits="5" prefill="sin(2x)" displaySmallAsZero /></p>
    <p>c2: <copy source="c" prop="value" assignNames="c2" /></p>
    <p>c3: <copy source="c" prop="immediatevalue" assignNames="c3" /></p>

    <p>d: <math name="d" displayDigits="10" displaySmallAsZero="false">10e^(3y)</math></p>
    <p>d2: <mathinput name="d2" bindValueTo="$d"  displayDigits="3" displaySmallAsZero /></p>
    <p>d3: <copy source="d2" prop="value" assignNames="d3" /></p>
    <p>d4: <copy source="d2" prop="immediatevalue" assignNames="d4" /></p>
    `,
        });

        let stateVariables = await returnAllStateVariables(core);
        expect(
            cleanLatex(stateVariables["/a"].stateValues.rawRendererValue),
        ).eq("\\sin(2x)");
        expect(cleanLatex(stateVariables["/a2"].stateValues.latex)).eq(
            "\\sin(2x)",
        );
        expect(cleanLatex(stateVariables["/a3"].stateValues.latex)).eq(
            "\\sin(2x)",
        );
        expect(cleanLatex(stateVariables["/b"].stateValues.latex)).eq(
            "10e^{3y}",
        );
        expect(
            cleanLatex(stateVariables["/b2"].stateValues.rawRendererValue),
        ).eq("10e^{3y}");
        expect(cleanLatex(stateVariables["/b3"].stateValues.latex)).eq(
            "10e^{3y}",
        );
        expect(cleanLatex(stateVariables["/b4"].stateValues.latex)).eq(
            "10e^{3y}",
        );
        expect(
            cleanLatex(stateVariables["/c"].stateValues.rawRendererValue),
        ).eq("\\sin(2x)");
        expect(cleanLatex(stateVariables["/c2"].stateValues.latex)).eq(
            "\\sin(2x)",
        );
        expect(cleanLatex(stateVariables["/c3"].stateValues.latex)).eq(
            "\\sin(2x)",
        );
        expect(cleanLatex(stateVariables["/d"].stateValues.latex)).eq(
            "10e^{3y}",
        );
        expect(
            cleanLatex(stateVariables["/d2"].stateValues.rawRendererValue),
        ).eq("10e^{3y}");
        expect(cleanLatex(stateVariables["/d3"].stateValues.latex)).eq(
            "10e^{3y}",
        );
        expect(cleanLatex(stateVariables["/d4"].stateValues.latex)).eq(
            "10e^{3y}",
        );

        expect(stateVariables["/a"].stateValues.value.tree).eqls([
            "apply",
            "sin",
            ["*", 2, "x"],
        ]);
        expect(stateVariables["/a"].stateValues.valueForDisplay.tree).eqls([
            "apply",
            "sin",
            ["*", 2, "x"],
        ]);
        expect(stateVariables["/a2"].stateValues.value.tree).eqls([
            "apply",
            "sin",
            ["*", 2, "x"],
        ]);
        expect(stateVariables["/a2"].stateValues.valueForDisplay.tree).eqls([
            "apply",
            "sin",
            ["*", 2, "x"],
        ]);
        expect(stateVariables["/a3"].stateValues.value.tree).eqls([
            "apply",
            "sin",
            ["*", 2, "x"],
        ]);
        expect(stateVariables["/a3"].stateValues.valueForDisplay.tree).eqls([
            "apply",
            "sin",
            ["*", 2, "x"],
        ]);
        expect(stateVariables["/b"].stateValues.value.tree).eqls([
            "*",
            10,
            ["^", "e", ["*", 3, "y"]],
        ]);
        expect(stateVariables["/b2"].stateValues.value.tree).eqls([
            "*",
            10,
            ["^", "e", ["*", 3, "y"]],
        ]);
        expect(stateVariables["/b2"].stateValues.valueForDisplay.tree).eqls([
            "*",
            10,
            ["^", "e", ["*", 3, "y"]],
        ]);
        expect(stateVariables["/b3"].stateValues.value.tree).eqls([
            "*",
            10,
            ["^", "e", ["*", 3, "y"]],
        ]);
        expect(stateVariables["/b3"].stateValues.valueForDisplay.tree).eqls([
            "*",
            10,
            ["^", "e", ["*", 3, "y"]],
        ]);
        expect(stateVariables["/b4"].stateValues.value.tree).eqls([
            "*",
            10,
            ["^", "e", ["*", 3, "y"]],
        ]);
        expect(stateVariables["/b4"].stateValues.valueForDisplay.tree).eqls([
            "*",
            10,
            ["^", "e", ["*", 3, "y"]],
        ]);
        expect(stateVariables["/c"].stateValues.value.tree).eqls([
            "apply",
            "sin",
            ["*", 2, "x"],
        ]);
        expect(stateVariables["/c"].stateValues.valueForDisplay.tree).eqls([
            "apply",
            "sin",
            ["*", 2, "x"],
        ]);
        expect(stateVariables["/c2"].stateValues.value.tree).eqls([
            "apply",
            "sin",
            ["*", 2, "x"],
        ]);
        expect(stateVariables["/c2"].stateValues.valueForDisplay.tree).eqls([
            "apply",
            "sin",
            ["*", 2, "x"],
        ]);
        expect(stateVariables["/c3"].stateValues.value.tree).eqls([
            "apply",
            "sin",
            ["*", 2, "x"],
        ]);
        expect(stateVariables["/c3"].stateValues.valueForDisplay.tree).eqls([
            "apply",
            "sin",
            ["*", 2, "x"],
        ]);
        expect(stateVariables["/d"].stateValues.value.tree).eqls([
            "*",
            10,
            ["^", "e", ["*", 3, "y"]],
        ]);
        expect(stateVariables["/d2"].stateValues.value.tree).eqls([
            "*",
            10,
            ["^", "e", ["*", 3, "y"]],
        ]);
        expect(stateVariables["/d2"].stateValues.valueForDisplay.tree).eqls([
            "*",
            10,
            ["^", "e", ["*", 3, "y"]],
        ]);
        expect(stateVariables["/d3"].stateValues.value.tree).eqls([
            "*",
            10,
            ["^", "e", ["*", 3, "y"]],
        ]);
        expect(stateVariables["/d3"].stateValues.valueForDisplay.tree).eqls([
            "*",
            10,
            ["^", "e", ["*", 3, "y"]],
        ]);
        expect(stateVariables["/d4"].stateValues.value.tree).eqls([
            "*",
            10,
            ["^", "e", ["*", 3, "y"]],
        ]);
        expect(stateVariables["/d4"].stateValues.valueForDisplay.tree).eqls([
            "*",
            10,
            ["^", "e", ["*", 3, "y"]],
        ]);

        await updateMathInputValue({
            latex: "\\sin(0.000000000000000472946384739473x)",
            name: "/a",
            core,
        });
        await updateMathInputValue({
            latex: "0.0000000000000934720357236e^{0.0000000000000073013048309y}",
            name: "/b2",
            core,
        });
        await updateMathInputValue({
            latex: "\\sin(0.000000000000000472946384739473x)",
            name: "/c",
            core,
        });
        await updateMathInputValue({
            latex: "0.0000000000000934720357236e^{0.0000000000000073013048309y}",
            name: "/d2",
            core,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(
            cleanLatex(stateVariables["/a"].stateValues.rawRendererValue),
        ).eq("\\sin(4.7295\\cdot10^{-16}x)");
        expect(cleanLatex(stateVariables["/a2"].stateValues.latex)).eq(
            "\\sin(4.7295\\cdot10^{-16}x)",
        );
        expect(cleanLatex(stateVariables["/a3"].stateValues.latex)).eq(
            "\\sin(4.7295\\cdot10^{-16}x)",
        );
        expect(cleanLatex(stateVariables["/b"].stateValues.latex)).eq(
            "9.347203572\\cdot10^{-14}e^{7.301304831\\cdot10^{-15}y}",
        );
        expect(
            cleanLatex(stateVariables["/b2"].stateValues.rawRendererValue),
        ).eq("9.35\\cdot10^{-14}e^{7.3\\cdot10^{-15}y}");
        expect(cleanLatex(stateVariables["/b3"].stateValues.latex)).eq(
            "9.35\\cdot10^{-14}e^{7.3\\cdot10^{-15}y}",
        );
        expect(cleanLatex(stateVariables["/b4"].stateValues.latex)).eq(
            "9.35\\cdot10^{-14}e^{7.3\\cdot10^{-15}y}",
        );
        expect(
            cleanLatex(stateVariables["/c"].stateValues.rawRendererValue),
        ).eq("\\sin(0x)");
        expect(cleanLatex(stateVariables["/c2"].stateValues.latex)).eq(
            "\\sin(0x)",
        );
        expect(cleanLatex(stateVariables["/c3"].stateValues.latex)).eq(
            "\\sin(0x)",
        );
        expect(cleanLatex(stateVariables["/d"].stateValues.latex)).eq(
            "9.347203572\\cdot10^{-14}e^{7.301304831\\cdot10^{-15}y}",
        );
        expect(
            cleanLatex(stateVariables["/d2"].stateValues.rawRendererValue),
        ).eq("9.35\\cdot10^{-14}e^{0y}");
        expect(cleanLatex(stateVariables["/d3"].stateValues.latex)).eq(
            "9.35\\cdot10^{-14}e^{0y}",
        );
        expect(cleanLatex(stateVariables["/d4"].stateValues.latex)).eq(
            "9.35\\cdot10^{-14}e^{0y}",
        );

        expect(stateVariables["/a"].stateValues.value.tree).eqls([
            "apply",
            "sin",
            ["*", 4.72946384739473e-16, "x"],
        ]);
        expect(stateVariables["/a"].stateValues.valueForDisplay.tree).eqls([
            "apply",
            "sin",
            ["*", 4.7295e-16, "x"],
        ]);
        expect(stateVariables["/a2"].stateValues.value.tree).eqls([
            "apply",
            "sin",
            ["*", 4.72946384739473e-16, "x"],
        ]);
        expect(stateVariables["/a2"].stateValues.valueForDisplay.tree).eqls([
            "apply",
            "sin",
            ["*", 4.7295e-16, "x"],
        ]);
        expect(stateVariables["/a3"].stateValues.value.tree).eqls([
            "apply",
            "sin",
            ["*", 4.72946384739473e-16, "x"],
        ]);
        expect(stateVariables["/a3"].stateValues.valueForDisplay.tree).eqls([
            "apply",
            "sin",
            ["*", 4.7295e-16, "x"],
        ]);
        expect(stateVariables["/b"].stateValues.value.tree).eqls([
            "*",
            9.34720357236e-14,
            ["^", "e", ["*", 7.3013048309e-15, "y"]],
        ]);
        expect(stateVariables["/b2"].stateValues.value.tree).eqls([
            "*",
            9.34720357236e-14,
            ["^", "e", ["*", 7.3013048309e-15, "y"]],
        ]);
        expect(stateVariables["/b2"].stateValues.valueForDisplay.tree).eqls([
            "*",
            9.35e-14,
            ["^", "e", ["*", 7.3e-15, "y"]],
        ]);
        expect(stateVariables["/b3"].stateValues.value.tree).eqls([
            "*",
            9.34720357236e-14,
            ["^", "e", ["*", 7.3013048309e-15, "y"]],
        ]);
        expect(stateVariables["/b3"].stateValues.valueForDisplay.tree).eqls([
            "*",
            9.35e-14,
            ["^", "e", ["*", 7.3e-15, "y"]],
        ]);
        expect(stateVariables["/b4"].stateValues.value.tree).eqls([
            "*",
            9.34720357236e-14,
            ["^", "e", ["*", 7.3013048309e-15, "y"]],
        ]);
        expect(stateVariables["/b4"].stateValues.valueForDisplay.tree).eqls([
            "*",
            9.35e-14,
            ["^", "e", ["*", 7.3e-15, "y"]],
        ]);
        expect(stateVariables["/c"].stateValues.value.tree).eqls([
            "apply",
            "sin",
            ["*", 4.72946384739473e-16, "x"],
        ]);
        expect(stateVariables["/c"].stateValues.valueForDisplay.tree).eqls([
            "apply",
            "sin",
            ["*", 0, "x"],
        ]);
        expect(stateVariables["/c2"].stateValues.value.tree).eqls([
            "apply",
            "sin",
            ["*", 4.72946384739473e-16, "x"],
        ]);
        expect(stateVariables["/c2"].stateValues.valueForDisplay.tree).eqls([
            "apply",
            "sin",
            ["*", 0, "x"],
        ]);
        expect(stateVariables["/c3"].stateValues.value.tree).eqls([
            "apply",
            "sin",
            ["*", 4.72946384739473e-16, "x"],
        ]);
        expect(stateVariables["/c3"].stateValues.valueForDisplay.tree).eqls([
            "apply",
            "sin",
            ["*", 0, "x"],
        ]);
        expect(stateVariables["/d"].stateValues.value.tree).eqls([
            "*",
            9.34720357236e-14,
            ["^", "e", ["*", 7.3013048309e-15, "y"]],
        ]);
        expect(stateVariables["/d2"].stateValues.value.tree).eqls([
            "*",
            9.34720357236e-14,
            ["^", "e", ["*", 7.3013048309e-15, "y"]],
        ]);
        expect(stateVariables["/d2"].stateValues.valueForDisplay.tree).eqls([
            "*",
            9.35e-14,
            ["^", "e", ["*", 0, "y"]],
        ]);
        expect(stateVariables["/d3"].stateValues.value.tree).eqls([
            "*",
            9.34720357236e-14,
            ["^", "e", ["*", 7.3013048309e-15, "y"]],
        ]);
        expect(stateVariables["/d3"].stateValues.valueForDisplay.tree).eqls([
            "*",
            9.35e-14,
            ["^", "e", ["*", 0, "y"]],
        ]);
        expect(stateVariables["/d4"].stateValues.value.tree).eqls([
            "*",
            9.34720357236e-14,
            ["^", "e", ["*", 7.3013048309e-15, "y"]],
        ]);
        expect(stateVariables["/d4"].stateValues.valueForDisplay.tree).eqls([
            "*",
            9.35e-14,
            ["^", "e", ["*", 0, "y"]],
        ]);

        await updateMathInputValue({
            latex: "\\sin(5.7295\\cdot10^{-16}x)",
            name: "/a",
            core,
        });
        await updateMathInputValue({
            latex: "8.35\\cdot10^{-14}e^{7.3\\cdot10^{-15}y}",
            name: "/b2",
            core,
        });
        await updateMathInputValue({
            latex: "\\sin(30x)",
            name: "/c",
            core,
        });
        await updateMathInputValue({
            latex: "6.35\\cdot10^{-14}e^{0y}",
            name: "/d2",
            core,
        });

        stateVariables = await returnAllStateVariables(core);

        expect(
            cleanLatex(stateVariables["/a"].stateValues.rawRendererValue),
        ).eq("\\sin(5.7295\\cdot10^{-16}x)");
        expect(cleanLatex(stateVariables["/a2"].stateValues.latex)).eq(
            "\\sin(5.7295\\cdot10^{-16}x)",
        );
        expect(cleanLatex(stateVariables["/a3"].stateValues.latex)).eq(
            "\\sin(5.7295\\cdot10^{-16}x)",
        );
        expect(cleanLatex(stateVariables["/b"].stateValues.latex)).eq(
            "8.35\\cdot10^{-14}e^{7.3\\cdot10^{-15}y}",
        );
        expect(
            cleanLatex(stateVariables["/b2"].stateValues.rawRendererValue),
        ).eq("8.35\\cdot10^{-14}e^{7.3\\cdot10^{-15}y}");
        expect(cleanLatex(stateVariables["/b3"].stateValues.latex)).eq(
            "8.35\\cdot10^{-14}e^{7.3\\cdot10^{-15}y}",
        );
        expect(cleanLatex(stateVariables["/b4"].stateValues.latex)).eq(
            "8.35\\cdot10^{-14}e^{7.3\\cdot10^{-15}y}",
        );
        expect(
            cleanLatex(stateVariables["/c"].stateValues.rawRendererValue),
        ).eq("\\sin(30x)");
        expect(cleanLatex(stateVariables["/c2"].stateValues.latex)).eq(
            "\\sin(30x)",
        );
        expect(cleanLatex(stateVariables["/c3"].stateValues.latex)).eq(
            "\\sin(30x)",
        );
        expect(cleanLatex(stateVariables["/d"].stateValues.latex)).eq(
            "6.35\\cdot10^{-14}e^{0y}",
        );
        expect(
            cleanLatex(stateVariables["/d2"].stateValues.rawRendererValue),
        ).eq("6.35\\cdot10^{-14}e^{0y}");
        expect(cleanLatex(stateVariables["/d3"].stateValues.latex)).eq(
            "6.35\\cdot10^{-14}e^{0y}",
        );
        expect(cleanLatex(stateVariables["/d4"].stateValues.latex)).eq(
            "6.35\\cdot10^{-14}e^{0y}",
        );

        expect(stateVariables["/a"].stateValues.value.tree).eqls([
            "apply",
            "sin",
            ["*", 5.7295, ["^", 10, -16], "x"],
        ]);
        expect(stateVariables["/a"].stateValues.valueForDisplay.tree).eqls([
            "apply",
            "sin",
            ["*", 5.7295, ["^", 10, -16], "x"],
        ]);
        expect(stateVariables["/a2"].stateValues.value.tree).eqls([
            "apply",
            "sin",
            ["*", 5.7295, ["^", 10, -16], "x"],
        ]);
        expect(stateVariables["/a2"].stateValues.valueForDisplay.tree).eqls([
            "apply",
            "sin",
            ["*", 5.7295, ["^", 10, -16], "x"],
        ]);
        expect(stateVariables["/a3"].stateValues.value.tree).eqls([
            "apply",
            "sin",
            ["*", 5.7295, ["^", 10, -16], "x"],
        ]);
        expect(stateVariables["/a3"].stateValues.valueForDisplay.tree).eqls([
            "apply",
            "sin",
            ["*", 5.7295, ["^", 10, -16], "x"],
        ]);
        expect(stateVariables["/b"].stateValues.value.tree).eqls([
            "*",
            8.35,
            ["^", 10, -14],
            ["^", "e", ["*", 7.3, ["^", 10, -15], "y"]],
        ]);
        expect(stateVariables["/b2"].stateValues.value.tree).eqls([
            "*",
            8.35,
            ["^", 10, -14],
            ["^", "e", ["*", 7.3, ["^", 10, -15], "y"]],
        ]);
        expect(stateVariables["/b2"].stateValues.valueForDisplay.tree).eqls([
            "*",
            8.35,
            ["^", 10, -14],
            ["^", "e", ["*", 7.3, ["^", 10, -15], "y"]],
        ]);
        expect(stateVariables["/b3"].stateValues.value.tree).eqls([
            "*",
            8.35,
            ["^", 10, -14],
            ["^", "e", ["*", 7.3, ["^", 10, -15], "y"]],
        ]);
        expect(stateVariables["/b3"].stateValues.valueForDisplay.tree).eqls([
            "*",
            8.35,
            ["^", 10, -14],
            ["^", "e", ["*", 7.3, ["^", 10, -15], "y"]],
        ]);
        expect(stateVariables["/b4"].stateValues.value.tree).eqls([
            "*",
            8.35,
            ["^", 10, -14],
            ["^", "e", ["*", 7.3, ["^", 10, -15], "y"]],
        ]);
        expect(stateVariables["/b4"].stateValues.valueForDisplay.tree).eqls([
            "*",
            8.35,
            ["^", 10, -14],
            ["^", "e", ["*", 7.3, ["^", 10, -15], "y"]],
        ]);
        expect(stateVariables["/c"].stateValues.value.tree).eqls([
            "apply",
            "sin",
            ["*", 30, "x"],
        ]);
        expect(stateVariables["/c"].stateValues.valueForDisplay.tree).eqls([
            "apply",
            "sin",
            ["*", 30, "x"],
        ]);
        expect(stateVariables["/c2"].stateValues.value.tree).eqls([
            "apply",
            "sin",
            ["*", 30, "x"],
        ]);
        expect(stateVariables["/c2"].stateValues.valueForDisplay.tree).eqls([
            "apply",
            "sin",
            ["*", 30, "x"],
        ]);
        expect(stateVariables["/c3"].stateValues.value.tree).eqls([
            "apply",
            "sin",
            ["*", 30, "x"],
        ]);
        expect(stateVariables["/c3"].stateValues.valueForDisplay.tree).eqls([
            "apply",
            "sin",
            ["*", 30, "x"],
        ]);
        expect(stateVariables["/d"].stateValues.value.tree).eqls([
            "*",
            6.35,
            ["^", 10, -14],
            ["^", "e", ["*", 0, "y"]],
        ]);
        expect(stateVariables["/d2"].stateValues.value.tree).eqls([
            "*",
            6.35,
            ["^", 10, -14],
            ["^", "e", ["*", 0, "y"]],
        ]);
        expect(stateVariables["/d2"].stateValues.valueForDisplay.tree).eqls([
            "*",
            6.35,
            ["^", 10, -14],
            ["^", "e", ["*", 0, "y"]],
        ]);
        expect(stateVariables["/d3"].stateValues.value.tree).eqls([
            "*",
            6.35,
            ["^", 10, -14],
            ["^", "e", ["*", 0, "y"]],
        ]);
        expect(stateVariables["/d3"].stateValues.valueForDisplay.tree).eqls([
            "*",
            6.35,
            ["^", 10, -14],
            ["^", "e", ["*", 0, "y"]],
        ]);
        expect(stateVariables["/d4"].stateValues.value.tree).eqls([
            "*",
            6.35,
            ["^", 10, -14],
            ["^", "e", ["*", 0, "y"]],
        ]);
        expect(stateVariables["/d4"].stateValues.valueForDisplay.tree).eqls([
            "*",
            6.35,
            ["^", 10, -14],
            ["^", "e", ["*", 0, "y"]],
        ]);
    });

    it("propagate larger default display digits", async () => {
        let core = await createTestCore({
            doenetML: `
    <p>a: <mathinput name="a" prefill="123.4567891234"/></p>
    <p>a2: <copy source="a" prop="value" assignNames="a2" /></p>
    <p>a3: <copy source="a" prop="immediateValue" assignNames="a3" /></p>
    <p>a4: <copy source="a" prop="value" assignNames="a4" displayDigits="4" displayDecimals="2" /></p>
    <p>a5: <copy source="a" prop="immediateValue" assignNames="a5" displayDigits="4" displayDecimals="2" /></p>

    `,
        });

        let stateVariables = await returnAllStateVariables(core);
        expect(
            cleanLatex(stateVariables["/a"].stateValues.rawRendererValue),
        ).eq("123.4567891");
        expect(cleanLatex(stateVariables["/a2"].stateValues.latex)).eq(
            "123.4567891",
        );
        expect(cleanLatex(stateVariables["/a3"].stateValues.latex)).eq(
            "123.4567891",
        );
        expect(cleanLatex(stateVariables["/a4"].stateValues.latex)).eq(
            "123.46",
        );
        expect(cleanLatex(stateVariables["/a5"].stateValues.latex)).eq(
            "123.46",
        );

        await updateMathInputValue({
            latex: "98765.4321876",
            name: "/a",
            core,
        });
        stateVariables = await returnAllStateVariables(core);
        expect(
            cleanLatex(stateVariables["/a"].stateValues.rawRendererValue),
        ).eq("98765.43219");
        expect(cleanLatex(stateVariables["/a2"].stateValues.latex)).eq(
            "98765.43219",
        );
        expect(cleanLatex(stateVariables["/a3"].stateValues.latex)).eq(
            "98765.43219",
        );
        expect(cleanLatex(stateVariables["/a4"].stateValues.latex)).eq(
            "98765.43",
        );
        expect(cleanLatex(stateVariables["/a5"].stateValues.latex)).eq(
            "98765.43",
        );
    });

    it("propagate false default display small as zero", async () => {
        let core = await createTestCore({
            doenetML: `
    <p>a: <mathinput name="a" prefill="123.4567891234"/></p>
    <p>a2: <copy source="a" prop="value" assignNames="a2" /></p>
    <p>a3: <copy source="a" prop="immediateValue" assignNames="a3" /></p>
    <p>a4: <copy source="a" prop="value" assignNames="a4" displaySmallAsZero /></p>
    <p>a5: <copy source="a" prop="immediateValue" assignNames="a5" displaySmallAsZero /></p>

    `,
        });

        let stateVariables = await returnAllStateVariables(core);
        expect(
            cleanLatex(stateVariables["/a"].stateValues.rawRendererValue),
        ).eq("123.4567891");
        expect(cleanLatex(stateVariables["/a2"].stateValues.latex)).eq(
            "123.4567891",
        );
        expect(cleanLatex(stateVariables["/a3"].stateValues.latex)).eq(
            "123.4567891",
        );
        expect(cleanLatex(stateVariables["/a4"].stateValues.latex)).eq(
            "123.4567891",
        );
        expect(cleanLatex(stateVariables["/a5"].stateValues.latex)).eq(
            "123.4567891",
        );

        await updateMathInputValue({
            latex: "0.00000000000000004736286523434185",
            name: "/a",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(
            cleanLatex(stateVariables["/a"].stateValues.rawRendererValue),
        ).eq("4.736286523\\cdot10^{-17}");
        expect(cleanLatex(stateVariables["/a2"].stateValues.latex)).eq(
            "4.736286523\\cdot10^{-17}",
        );
        expect(cleanLatex(stateVariables["/a3"].stateValues.latex)).eq(
            "4.736286523\\cdot10^{-17}",
        );
        expect(cleanLatex(stateVariables["/a4"].stateValues.latex)).eq("0");
        expect(cleanLatex(stateVariables["/a5"].stateValues.latex)).eq("0");
    });

    it("display digits, change from downstream", async () => {
        let core = await createTestCore({
            doenetML: `
    <p>a: <mathinput name="a" displayDigits="5" prefill="3"/></p>

    <p>b: <math name="b" displayDigits="10">5</math></p>
    <p>b2: <mathinput name="b2" bindValueTo="$b"  displayDigits="3" /></p>

    <graph>
      <point name="p">($a, $b2)</point>
    </graph>
    `,
        });

        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/a"].stateValues.value.tree).eq(3);
        expect(stateVariables["/a"].stateValues.valueForDisplay.tree).eq(3);
        expect(stateVariables["/p"].stateValues.xs[0].tree).eq(3);
        expect(stateVariables["/b"].stateValues.value.tree).eq(5);
        expect(stateVariables["/b"].stateValues.valueForDisplay.tree).eq(5);
        expect(stateVariables["/b2"].stateValues.value.tree).eq(5);
        expect(stateVariables["/b2"].stateValues.valueForDisplay.tree).eq(5);
        expect(stateVariables["/p"].stateValues.xs[1].tree).eq(5);

        await updateMathInputValue({
            latex: "2.4295639461593",
            name: "/a",
            core,
        });
        await updateMathInputValue({
            latex: "9.3935596792746",
            name: "/b2",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/a"].stateValues.value.tree).eq(2.4295639461593);
        expect(stateVariables["/a"].stateValues.valueForDisplay.tree).eq(
            2.4296,
        );
        expect(stateVariables["/p"].stateValues.xs[0].tree).eq(2.4295639461593);
        expect(stateVariables["/b"].stateValues.value.tree).eq(9.3935596792746);
        expect(stateVariables["/b"].stateValues.valueForDisplay.tree).eq(
            9.393559679,
        );
        expect(stateVariables["/b2"].stateValues.value.tree).eq(
            9.3935596792746,
        );
        expect(stateVariables["/b2"].stateValues.valueForDisplay.tree).eq(9.39);
        expect(stateVariables["/p"].stateValues.xs[1].tree).eq(9.3935596792746);

        await movePoint({
            name: "/p",
            x: 7.936497798143,
            y: 2.142218345836,
            core,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/a"].stateValues.value.tree).eq(7.936497798143);
        expect(stateVariables["/a"].stateValues.valueForDisplay.tree).eq(
            7.9365,
        );
        expect(stateVariables["/p"].stateValues.xs[0].tree).eq(7.936497798143);
        expect(stateVariables["/b"].stateValues.value.tree).eq(2.142218345836);
        expect(stateVariables["/b"].stateValues.valueForDisplay.tree).eq(
            2.142218346,
        );
        expect(stateVariables["/b2"].stateValues.value.tree).eq(2.142218345836);
        expect(stateVariables["/b2"].stateValues.valueForDisplay.tree).eq(2.14);
        expect(stateVariables["/p"].stateValues.xs[1].tree).eq(2.142218345836);
    });

    it("display decimals, change from downstream", async () => {
        let core = await createTestCore({
            doenetML: `
    <p>a: <mathinput name="a" displayDecimals="4" prefill="3"/></p>

    <p>b: <math name="b" displayDigits="10">5</math></p>
    <p>b2: <mathinput name="b2" bindValueTo="$b"  displayDecimals="2" /></p>

    <graph>
      <point name="p">($a, $b2)</point>
    </graph>
    `,
        });

        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/a"].stateValues.value.tree).eq(3);
        expect(stateVariables["/a"].stateValues.valueForDisplay.tree).eq(3);
        expect(stateVariables["/p"].stateValues.xs[0].tree).eq(3);
        expect(stateVariables["/b"].stateValues.value.tree).eq(5);
        expect(stateVariables["/b"].stateValues.valueForDisplay.tree).eq(5);
        expect(stateVariables["/b2"].stateValues.value.tree).eq(5);
        expect(stateVariables["/b2"].stateValues.valueForDisplay.tree).eq(5);
        expect(stateVariables["/p"].stateValues.xs[1].tree).eq(5);

        await updateMathInputValue({
            latex: "2.4295639461593",
            name: "/a",
            core,
        });
        await updateMathInputValue({
            latex: "9.3935596792746",
            name: "/b2",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/a"].stateValues.value.tree).eq(2.4295639461593);
        expect(stateVariables["/a"].stateValues.valueForDisplay.tree).eq(
            2.4296,
        );
        expect(stateVariables["/p"].stateValues.xs[0].tree).eq(2.4295639461593);
        expect(stateVariables["/b"].stateValues.value.tree).eq(9.3935596792746);
        expect(stateVariables["/b"].stateValues.valueForDisplay.tree).eq(
            9.393559679,
        );
        expect(stateVariables["/b2"].stateValues.value.tree).eq(
            9.3935596792746,
        );
        expect(stateVariables["/b2"].stateValues.valueForDisplay.tree).eq(9.39);
        expect(stateVariables["/p"].stateValues.xs[1].tree).eq(9.3935596792746);

        await movePoint({
            name: "/p",
            x: 7.936497798143,
            y: 2.142218345836,
            core,
        });

        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/a"].stateValues.value.tree).eq(7.936497798143);
        expect(stateVariables["/a"].stateValues.valueForDisplay.tree).eq(
            7.9365,
        );
        expect(stateVariables["/p"].stateValues.xs[0].tree).eq(7.936497798143);
        expect(stateVariables["/b"].stateValues.value.tree).eq(2.142218345836);
        expect(stateVariables["/b"].stateValues.valueForDisplay.tree).eq(
            2.142218346,
        );
        expect(stateVariables["/b2"].stateValues.value.tree).eq(2.142218345836);
        expect(stateVariables["/b2"].stateValues.valueForDisplay.tree).eq(2.14);
        expect(stateVariables["/p"].stateValues.xs[1].tree).eq(2.142218345836);
    });

    it("substitute unicode", async () => {
        let core = await createTestCore({
            doenetML: `
    <p>a: <mathinput name="a" /></p>
    <p>a2: $a.value{assignNames="a2"}</p>
    <p>a3: <copy prop="value" source="a" simplify assignNames="a3" /></p>
    `,
        });

        let stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/a2"].stateValues.value.tree).eq("\uff3f");

        // unicode α U+03B1
        await updateMathInputValue({
            latex: "α",
            name: "/a",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(
            cleanLatex(stateVariables["/a"].stateValues.rawRendererValue),
        ).eq("α");
        expect(cleanLatex(stateVariables["/a2"].stateValues.latex)).eq(
            "\\alpha",
        );
        expect(cleanLatex(stateVariables["/a3"].stateValues.latex)).eq(
            "\\alpha",
        );

        expect(stateVariables["/a"].stateValues.value.tree).eqls("alpha");
        expect(stateVariables["/a2"].stateValues.value.tree).eqls("alpha");
        expect(stateVariables["/a3"].stateValues.value.tree).eqls("alpha");

        // latex \\alpha\\beta
        await updateMathInputValue({
            latex: "\\alpha\\beta",
            name: "/a",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(
            cleanLatex(stateVariables["/a"].stateValues.rawRendererValue),
        ).eq("\\alpha\\beta");
        expect(cleanLatex(stateVariables["/a2"].stateValues.latex)).eq(
            "\\alpha\\beta",
        );
        expect(cleanLatex(stateVariables["/a3"].stateValues.latex)).eq(
            "\\alpha\\beta",
        );

        expect(stateVariables["/a"].stateValues.value.tree).eqls([
            "*",
            "alpha",
            "beta",
        ]);
        expect(stateVariables["/a2"].stateValues.value.tree).eqls([
            "*",
            "alpha",
            "beta",
        ]);
        expect(stateVariables["/a3"].stateValues.value.tree).eqls([
            "*",
            "alpha",
            "beta",
        ]);

        // unicode − U+2212 is subtraction

        await updateMathInputValue({
            latex: "y\u2212z",
            name: "/a",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(
            cleanLatex(stateVariables["/a"].stateValues.rawRendererValue),
        ).eq("y\u2212z");
        expect(cleanLatex(stateVariables["/a2"].stateValues.latex)).eq("y-z");
        expect(cleanLatex(stateVariables["/a3"].stateValues.latex)).eq("y-z");
        expect(stateVariables["/a"].stateValues.value.tree).eqls([
            "+",
            "y",
            ["-", "z"],
        ]);
        expect(stateVariables["/a2"].stateValues.value.tree).eqls([
            "+",
            "y",
            ["-", "z"],
        ]);
        expect(stateVariables["/a3"].stateValues.value.tree).eqls([
            "+",
            "y",
            ["-", "z"],
        ]);

        // normal minus

        await updateMathInputValue({
            latex: "a-b",
            name: "/a",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(
            cleanLatex(stateVariables["/a"].stateValues.rawRendererValue),
        ).eq("a-b");
        expect(cleanLatex(stateVariables["/a2"].stateValues.latex)).eq("a-b");
        expect(cleanLatex(stateVariables["/a3"].stateValues.latex)).eq("a-b");
        expect(stateVariables["/a"].stateValues.value.tree).eqls([
            "+",
            "a",
            ["-", "b"],
        ]);
        expect(stateVariables["/a2"].stateValues.value.tree).eqls([
            "+",
            "a",
            ["-", "b"],
        ]);
        expect(stateVariables["/a3"].stateValues.value.tree).eqls([
            "+",
            "a",
            ["-", "b"],
        ]);

        // unicode ⋅ U+22C5 is multiplication

        await updateMathInputValue({
            latex: "y\u22C5z",
            name: "/a",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(
            cleanLatex(stateVariables["/a"].stateValues.rawRendererValue),
        ).eq("y\u22C5z");
        expect(cleanLatex(stateVariables["/a2"].stateValues.latex)).eq("yz");
        expect(cleanLatex(stateVariables["/a3"].stateValues.latex)).eq("yz");
        expect(stateVariables["/a"].stateValues.value.tree).eqls([
            "*",
            "y",
            "z",
        ]);
        expect(stateVariables["/a2"].stateValues.value.tree).eqls([
            "*",
            "y",
            "z",
        ]);
        expect(stateVariables["/a3"].stateValues.value.tree).eqls([
            "*",
            "y",
            "z",
        ]);

        // normal *

        await updateMathInputValue({
            latex: "a*b",
            name: "/a",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(
            cleanLatex(stateVariables["/a"].stateValues.rawRendererValue),
        ).eq("a*b");
        expect(cleanLatex(stateVariables["/a2"].stateValues.latex)).eq("ab");
        expect(cleanLatex(stateVariables["/a3"].stateValues.latex)).eq("ab");
        expect(stateVariables["/a"].stateValues.value.tree).eqls([
            "*",
            "a",
            "b",
        ]);
        expect(stateVariables["/a2"].stateValues.value.tree).eqls([
            "*",
            "a",
            "b",
        ]);
        expect(stateVariables["/a3"].stateValues.value.tree).eqls([
            "*",
            "a",
            "b",
        ]);

        // unicode · U+00B7 becomes multiplication

        await updateMathInputValue({
            latex: "y\u00B7z",
            name: "/a",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(
            cleanLatex(stateVariables["/a"].stateValues.rawRendererValue),
        ).eq("y\u00B7z");
        expect(cleanLatex(stateVariables["/a2"].stateValues.latex)).eq("yz");
        expect(cleanLatex(stateVariables["/a3"].stateValues.latex)).eq("yz");
        expect(stateVariables["/a"].stateValues.value.tree).eqls([
            "*",
            "y",
            "z",
        ]);
        expect(stateVariables["/a2"].stateValues.value.tree).eqls([
            "*",
            "y",
            "z",
        ]);
        expect(stateVariables["/a3"].stateValues.value.tree).eqls([
            "*",
            "y",
            "z",
        ]);

        // unicode × U+00D7 becomes multiplication

        await updateMathInputValue({
            latex: "u\u00D7v",
            name: "/a",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(
            cleanLatex(stateVariables["/a"].stateValues.rawRendererValue),
        ).eq("u\u00D7v");
        expect(cleanLatex(stateVariables["/a2"].stateValues.latex)).eq("uv");
        expect(cleanLatex(stateVariables["/a3"].stateValues.latex)).eq("uv");
        expect(stateVariables["/a"].stateValues.value.tree).eqls([
            "*",
            "u",
            "v",
        ]);
        expect(stateVariables["/a2"].stateValues.value.tree).eqls([
            "*",
            "u",
            "v",
        ]);
        expect(stateVariables["/a3"].stateValues.value.tree).eqls([
            "*",
            "u",
            "v",
        ]);

        // unicode ∪ U+222A becomes union

        await updateMathInputValue({
            latex: "A\u222AB",
            name: "/a",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(
            cleanLatex(stateVariables["/a"].stateValues.rawRendererValue),
        ).eq("A\u222AB");
        expect(cleanLatex(stateVariables["/a2"].stateValues.latex)).eq(
            "A\\cupB",
        );
        expect(cleanLatex(stateVariables["/a3"].stateValues.latex)).eq(
            "A\\cupB",
        );
        expect(stateVariables["/a"].stateValues.value.tree).eqls([
            "union",
            "A",
            "B",
        ]);
        expect(stateVariables["/a2"].stateValues.value.tree).eqls([
            "union",
            "A",
            "B",
        ]);
        expect(stateVariables["/a3"].stateValues.value.tree).eqls([
            "union",
            "A",
            "B",
        ]);

        // unicode ∩ U+2229 becomes intersect

        await updateMathInputValue({
            latex: "A\u2229B",
            name: "/a",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(
            cleanLatex(stateVariables["/a"].stateValues.rawRendererValue),
        ).eq("A\u2229B");
        expect(cleanLatex(stateVariables["/a2"].stateValues.latex)).eq(
            "A\\capB",
        );
        expect(cleanLatex(stateVariables["/a3"].stateValues.latex)).eq(
            "A\\capB",
        );
        expect(stateVariables["/a"].stateValues.value.tree).eqls([
            "intersect",
            "A",
            "B",
        ]);
        expect(stateVariables["/a2"].stateValues.value.tree).eqls([
            "intersect",
            "A",
            "B",
        ]);
        expect(stateVariables["/a3"].stateValues.value.tree).eqls([
            "intersect",
            "A",
            "B",
        ]);

        // unicode ∞ U+221E becomes infinity

        await updateMathInputValue({
            latex: "\u221E",
            name: "/a",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(
            cleanLatex(stateVariables["/a"].stateValues.rawRendererValue),
        ).eq("\u221E");
        expect(cleanLatex(stateVariables["/a2"].stateValues.latex)).eq(
            "\\infty",
        );
        expect(cleanLatex(stateVariables["/a3"].stateValues.latex)).eq(
            "\\infty",
        );
        expect(stateVariables["/a"].stateValues.value.tree).eq(Infinity);
        expect(stateVariables["/a2"].stateValues.value.tree).eq(Infinity);
        expect(stateVariables["/a3"].stateValues.value.tree).eq(Infinity);

        // unicode µ U+00B5 becomes mu

        await updateMathInputValue({
            latex: "\u00B5",
            name: "/a",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(
            cleanLatex(stateVariables["/a"].stateValues.rawRendererValue),
        ).eq("\u00B5");
        expect(cleanLatex(stateVariables["/a2"].stateValues.latex)).eq("\\mu");
        expect(cleanLatex(stateVariables["/a3"].stateValues.latex)).eq("\\mu");
        expect(stateVariables["/a"].stateValues.value.tree).eq("mu");
        expect(stateVariables["/a2"].stateValues.value.tree).eq("mu");
        expect(stateVariables["/a3"].stateValues.value.tree).eq("mu");

        // unicode μ U+03BC becomes mu

        await updateMathInputValue({
            latex: "\u03BC",
            name: "/a",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(
            cleanLatex(stateVariables["/a"].stateValues.rawRendererValue),
        ).eq("\u03BC");
        expect(cleanLatex(stateVariables["/a2"].stateValues.latex)).eq("\\mu");
        expect(cleanLatex(stateVariables["/a3"].stateValues.latex)).eq("\\mu");
        expect(stateVariables["/a"].stateValues.value.tree).eq("mu");
        expect(stateVariables["/a2"].stateValues.value.tree).eq("mu");
        expect(stateVariables["/a3"].stateValues.value.tree).eq("mu");

        // unicode ′ U+2032 becomes apostrophe

        await updateMathInputValue({
            latex: "f\u2032",
            name: "/a",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(
            cleanLatex(stateVariables["/a"].stateValues.rawRendererValue),
        ).eq("f\u2032");
        expect(cleanLatex(stateVariables["/a2"].stateValues.latex)).eq("f'");
        expect(cleanLatex(stateVariables["/a3"].stateValues.latex)).eq("f'");
        expect(stateVariables["/a"].stateValues.value.tree).eqls([
            "prime",
            "f",
        ]);
        expect(stateVariables["/a2"].stateValues.value.tree).eqls([
            "prime",
            "f",
        ]);
        expect(stateVariables["/a3"].stateValues.value.tree).eqls([
            "prime",
            "f",
        ]);
    });

    it("exponent with numbers", async () => {
        let core = await createTestCore({
            doenetML: `
    <p>a: <mathinput name="a" /></p>
    <p>a2: $a.value{assignNames="a2"}</p>
    <p>a3: <math simplify name="a3">$a</math></p>
    `,
        });

        let stateVariables = await returnAllStateVariables(core);

        expect(cleanLatex(stateVariables["/a2"].stateValues.value.tree)).eq(
            "\uff3f",
        );

        await updateMathInputValue({
            latex: "3^25",
            name: "/a",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/a"].stateValues.value.tree).eqls([
            "*",
            ["^", 3, 2],
            5,
        ]);
        expect(stateVariables["/a2"].stateValues.value.tree).eqls([
            "*",
            ["^", 3, 2],
            5,
        ]);
        expect(stateVariables["/a3"].stateValues.value.tree).eqls(45);

        await updateMathInputValue({
            latex: "3^{25}",
            name: "/a",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/a"].stateValues.value.tree).eqls(["^", 3, 25]);
        expect(stateVariables["/a2"].stateValues.value.tree).eqls(["^", 3, 25]);
        expect(stateVariables["/a3"].stateValues.value.tree).eqls(847288609443);

        await updateMathInputValue({
            latex: "3^{2x}",
            name: "/a",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/a"].stateValues.value.tree).eqls([
            "^",
            3,
            ["*", 2, "x"],
        ]);
        expect(stateVariables["/a2"].stateValues.value.tree).eqls([
            "^",
            3,
            ["*", 2, "x"],
        ]);
        expect(stateVariables["/a3"].stateValues.value.tree).eqls([
            "^",
            3,
            ["*", 2, "x"],
        ]);

        await updateMathInputValue({
            latex: "3^2x",
            name: "/a",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/a"].stateValues.value.tree).eqls([
            "*",
            ["^", 3, 2],
            "x",
        ]);
        expect(stateVariables["/a2"].stateValues.value.tree).eqls([
            "*",
            ["^", 3, 2],
            "x",
        ]);
        expect(stateVariables["/a3"].stateValues.value.tree).eqls([
            "*",
            9,
            "x",
        ]);

        await updateMathInputValue({
            latex: "3^{x2}",
            name: "/a",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/a"].stateValues.value.tree).eqls([
            "^",
            3,
            "x2",
        ]);
        expect(stateVariables["/a2"].stateValues.value.tree).eqls([
            "^",
            3,
            "x2",
        ]);
        expect(stateVariables["/a3"].stateValues.value.tree).eqls([
            "^",
            3,
            "x2",
        ]);

        await updateMathInputValue({
            latex: "3^x2",
            name: "/a",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/a"].stateValues.value.tree).eqls([
            "*",
            ["^", 3, "x"],
            2,
        ]);
        expect(stateVariables["/a2"].stateValues.value.tree).eqls([
            "*",
            ["^", 3, "x"],
            2,
        ]);
        expect(stateVariables["/a3"].stateValues.value.tree).eqls([
            "*",
            2,
            ["^", 3, "x"],
        ]);

        await updateMathInputValue({
            latex: "f^32",
            name: "/a",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/a"].stateValues.value.tree).eqls([
            "*",
            ["^", "f", 3],
            2,
        ]);
        expect(stateVariables["/a2"].stateValues.value.tree).eqls([
            "*",
            ["^", "f", 3],
            2,
        ]);
        expect(stateVariables["/a3"].stateValues.value.tree).eqls([
            "*",
            2,
            ["^", "f", 3],
        ]);

        await updateMathInputValue({
            latex: "x^32",
            name: "/a",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/a"].stateValues.value.tree).eqls([
            "*",
            ["^", "x", 3],
            2,
        ]);
        expect(stateVariables["/a2"].stateValues.value.tree).eqls([
            "*",
            ["^", "x", 3],
            2,
        ]);
        expect(stateVariables["/a3"].stateValues.value.tree).eqls([
            "*",
            2,
            ["^", "x", 3],
        ]);
    });

    it("subscript with numbers", async () => {
        let core = await createTestCore({
            doenetML: `
    <p>a: <mathinput name="a" /></p>
    <p>a2: $a.value{assignNames="a2"}</p>
    <p>a3: <math simplify name="a3">$a</math></p>
    `,
        });

        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/a2"].stateValues.value.tree).eqls("\uff3f");

        await updateMathInputValue({
            latex: "3_25",
            name: "/a",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/a"].stateValues.value.tree).eqls([
            "*",
            ["_", 3, 2],
            5,
        ]);
        expect(stateVariables["/a2"].stateValues.value.tree).eqls([
            "*",
            ["_", 3, 2],
            5,
        ]);
        expect(stateVariables["/a3"].stateValues.value.tree).eqls([
            "*",
            5,
            ["_", 3, 2],
        ]);

        await updateMathInputValue({
            latex: "3_{25}",
            name: "/a",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/a"].stateValues.value.tree).eqls(["_", 3, 25]);
        expect(stateVariables["/a2"].stateValues.value.tree).eqls(["_", 3, 25]);
        expect(stateVariables["/a3"].stateValues.value.tree).eqls(["_", 3, 25]);

        await updateMathInputValue({
            latex: "3_{2x}",
            name: "/a",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/a"].stateValues.value.tree).eqls([
            "_",
            3,
            ["*", 2, "x"],
        ]);
        expect(stateVariables["/a2"].stateValues.value.tree).eqls([
            "_",
            3,
            ["*", 2, "x"],
        ]);
        expect(stateVariables["/a3"].stateValues.value.tree).eqls([
            "_",
            3,
            ["*", 2, "x"],
        ]);

        await updateMathInputValue({
            latex: "3_2x",
            name: "/a",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/a"].stateValues.value.tree).eqls([
            "*",
            ["_", 3, 2],
            "x",
        ]);
        expect(stateVariables["/a2"].stateValues.value.tree).eqls([
            "*",
            ["_", 3, 2],
            "x",
        ]);
        expect(stateVariables["/a3"].stateValues.value.tree).eqls([
            "*",
            "x",
            ["_", 3, 2],
        ]);

        await updateMathInputValue({
            latex: "3_{x2}",
            name: "/a",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/a"].stateValues.value.tree).eqls([
            "_",
            3,
            "x2",
        ]);
        expect(stateVariables["/a2"].stateValues.value.tree).eqls([
            "_",
            3,
            "x2",
        ]);
        expect(stateVariables["/a3"].stateValues.value.tree).eqls([
            "_",
            3,
            "x2",
        ]);

        await updateMathInputValue({
            latex: "3_x2",
            name: "/a",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/a"].stateValues.value.tree).eqls([
            "*",
            ["_", 3, "x"],
            2,
        ]);
        expect(stateVariables["/a2"].stateValues.value.tree).eqls([
            "*",
            ["_", 3, "x"],
            2,
        ]);
        expect(stateVariables["/a3"].stateValues.value.tree).eqls([
            "*",
            2,
            ["_", 3, "x"],
        ]);

        await updateMathInputValue({
            latex: "f_32",
            name: "/a",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/a"].stateValues.value.tree).eqls([
            "*",
            ["_", "f", 3],
            2,
        ]);
        expect(stateVariables["/a2"].stateValues.value.tree).eqls([
            "*",
            ["_", "f", 3],
            2,
        ]);
        expect(stateVariables["/a3"].stateValues.value.tree).eqls([
            "*",
            2,
            ["_", "f", 3],
        ]);

        await updateMathInputValue({
            latex: "x_32",
            name: "/a",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/a"].stateValues.value.tree).eqls([
            "*",
            ["_", "x", 3],
            2,
        ]);
        expect(stateVariables["/a2"].stateValues.value.tree).eqls([
            "*",
            ["_", "x", 3],
            2,
        ]);
        expect(stateVariables["/a3"].stateValues.value.tree).eqls([
            "*",
            2,
            ["_", "x", 3],
        ]);
    });

    it("rawValue is updated", async () => {
        let core = await createTestCore({
            doenetML: `
    <graph>
      <point x="1" y="2" name="A">
        <constraints>
          <constrainToGrid />
        </constraints>
      </point>
    </graph>
    
    <mathinput name="mi" bindValueTo="$A.x" />
    
    <copy prop='x' source="A" assignNames="Ax" />

    <graph>
      <point x="$mi" y="3" name="B" />
    </graph>
    `,
        });

        let stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/mi"].stateValues.rawRendererValue).eq("1");
        expect(stateVariables["/mi"].stateValues.immediateValue.tree).eq(1);
        expect(stateVariables["/mi"].stateValues.value.tree).eq(1);
        expect(stateVariables["/A"].stateValues.xs.map((x) => x.tree)).eqls([
            1, 2,
        ]);
        expect(stateVariables["/B"].stateValues.xs.map((x) => x.tree)).eqls([
            1, 3,
        ]);

        await updateMathInputValue({
            latex: "-7.4",
            name: "/mi",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/mi"].stateValues.rawRendererValue).eq("-7");
        expect(stateVariables["/mi"].stateValues.immediateValue.tree).eq(-7);
        expect(stateVariables["/mi"].stateValues.value.tree).eq(-7);
        expect(stateVariables["/A"].stateValues.xs.map((x) => x.tree)).eqls([
            -7, 2,
        ]);
        expect(stateVariables["/B"].stateValues.xs.map((x) => x.tree)).eqls([
            -7, 3,
        ]);

        // move point A

        await movePoint({ name: "/A", x: 3.9, y: -8.4, core });

        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/mi"].stateValues.rawRendererValue).eq("4");
        expect(stateVariables["/mi"].stateValues.immediateValue.tree).eq(4);
        expect(stateVariables["/mi"].stateValues.value.tree).eq(4);
        expect(stateVariables["/A"].stateValues.xs.map((x) => x.tree)).eqls([
            4, -8,
        ]);
        expect(stateVariables["/B"].stateValues.xs.map((x) => x.tree)).eqls([
            4, 3,
        ]);

        // move point B

        await movePoint({ name: "/B", x: 5.1, y: 1.3, core });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/mi"].stateValues.rawRendererValue).eq("5");
        expect(stateVariables["/mi"].stateValues.immediateValue.tree).eq(5);
        expect(stateVariables["/mi"].stateValues.value.tree).eq(5);
        expect(stateVariables["/A"].stateValues.xs.map((x) => x.tree)).eqls([
            5, -8,
        ]);
        expect(stateVariables["/B"].stateValues.xs.map((x) => x.tree)).eqls([
            5, 1.3,
        ]);
    });

    it("chain update off mathinput", async () => {
        let core = await createTestCore({
            doenetML: `
    <mathinput name="mi" />

    <math simplify name="x">x</math>
    <updateValue triggerWith="mi" target="x" newValue="$x+$mi" />
    `,
        });

        let stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/x"].stateValues.value.tree).eq("x");

        await updateMathInputImmediateValue({
            latex: "y",
            name: "/mi",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/mi"].stateValues.immediateValue.tree).eq("y");
        expect(stateVariables["/x"].stateValues.value.tree).eq("x");

        await updateMathInputImmediateValue({
            latex: "",
            name: "/mi",
            core,
        });
        await updateMathInputImmediateValue({
            latex: "x",
            name: "/mi",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/mi"].stateValues.immediateValue.tree).eq("x");
        expect(stateVariables["/x"].stateValues.value.tree).eq("x");

        await updateMathInputValueToImmediateValue({
            name: "/mi",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/mi"].stateValues.value.tree).eq("x");
        expect(stateVariables["/x"].stateValues.value.tree).eqls(["*", 2, "x"]);

        await updateMathInputImmediateValue({
            latex: "",
            name: "/mi",
            core,
        });
        await updateMathInputImmediateValue({
            latex: "y",
            name: "/mi",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/mi"].stateValues.immediateValue.tree).eq("y");
        expect(stateVariables["/x"].stateValues.value.tree).eqls(["*", 2, "x"]);

        await updateMathInputImmediateValue({
            latex: "y+x",
            name: "/mi",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/mi"].stateValues.immediateValue.tree).eqls([
            "+",
            "y",
            "x",
        ]);
        expect(stateVariables["/x"].stateValues.value.tree).eqls(["*", 2, "x"]);

        await updateMathInputValueToImmediateValue({
            name: "/mi",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/mi"].stateValues.value.tree).eqls([
            "+",
            "y",
            "x",
        ]);
        expect(stateVariables["/x"].stateValues.value.tree).eqls([
            "+",
            ["*", 3, "x"],
            "y",
        ]);
    });

    it("split symbols in mathinput", async () => {
        let core = await createTestCore({
            doenetML: `
    <mathinput name="mins" splitSymbols="false" />
    <mathinput name="mis" />

    <p>No split: <copy prop="value" source="mins" assignNames="mns"/></p>
    <p>Split: <copy prop="value" source="mis" assignNames="ms"/></p>
    `,
        });

        let stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/mns"].stateValues.value.tree).eq("\uff3f");

        await updateMathInputValue({
            latex: "xy",
            name: "/mins",
            core,
        });
        await updateMathInputValue({
            latex: "xy",
            name: "/mis",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/mins"].stateValues.value.tree).eqls("xy");
        expect(stateVariables["/mis"].stateValues.value.tree).eqls([
            "*",
            "x",
            "y",
        ]);
        expect(stateVariables["/mns"].stateValues.value.tree).eqls("xy");
        expect(stateVariables["/ms"].stateValues.value.tree).eqls([
            "*",
            "x",
            "y",
        ]);

        await updateMathInputValue({
            latex: "xy0",
            name: "/mins",
            core,
        });
        await updateMathInputValue({
            latex: "xy0",
            name: "/mis",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/mins"].stateValues.value.tree).eqls("xy0");
        expect(stateVariables["/mis"].stateValues.value.tree).eqls("xy0");
        expect(stateVariables["/mns"].stateValues.value.tree).eqls("xy0");
        expect(stateVariables["/ms"].stateValues.value.tree).eqls("xy0");

        await updateMathInputValue({
            latex: "xy_{uv}",
            name: "/mins",
            core,
        });
        await updateMathInputValue({
            latex: "xy_{uv}",
            name: "/mis",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/mins"].stateValues.value.tree).eqls([
            "_",
            "xy",
            "uv",
        ]);
        expect(stateVariables["/mis"].stateValues.value.tree).eqls([
            "*",
            "x",
            ["_", "y", ["*", "u", "v"]],
        ]);
        expect(stateVariables["/mns"].stateValues.value.tree).eqls([
            "_",
            "xy",
            "uv",
        ]);
        expect(stateVariables["/ms"].stateValues.value.tree).eqls([
            "*",
            "x",
            ["_", "y", ["*", "u", "v"]],
        ]);
    });

    it("normalize begin/end ldots in mathinput", async () => {
        let core = await createTestCore({
            doenetML: `
    <mathinput name="mi" />

    <p>Value: <copy prop="value" source="mi" assignNames="m"/></p>
    `,
        });

        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/m"].stateValues.value.tree).eq("\uff3f");

        // use periods, no commas

        await updateMathInputValue({
            latex: "...x,y,z...",
            name: "/mi",
            core,
        });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/mi"].stateValues.value.tree).eqls([
            "list",
            ["ldots"],
            "x",
            "y",
            "z",
            ["ldots"],
        ]);
        expect(stateVariables["/m"].stateValues.value.tree).eqls([
            "list",
            ["ldots"],
            "x",
            "y",
            "z",
            ["ldots"],
        ]);

        // add spaces in between some periods

        await updateMathInputValue({
            latex: "\\ .\\ .\\ .x,y,a..\\ .\\ ",
            name: "/mi",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/mi"].stateValues.value.tree).eqls([
            "list",
            ["ldots"],
            "x",
            "y",
            "a",
            ["ldots"],
        ]);
        expect(stateVariables["/m"].stateValues.value.tree).eqls([
            "list",
            ["ldots"],
            "x",
            "y",
            "a",
            ["ldots"],
        ]);

        // add commas after first set of periods

        await updateMathInputValue({
            latex: "\\ .\\ .\\ .,b,y,a..\\ .\\ ",
            name: "/mi",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/mi"].stateValues.value.tree).eqls([
            "list",
            ["ldots"],
            "b",
            "y",
            "a",
            ["ldots"],
        ]);
        expect(stateVariables["/m"].stateValues.value.tree).eqls([
            "list",
            ["ldots"],
            "b",
            "y",
            "a",
            ["ldots"],
        ]);

        // add commas before second set of periods

        await updateMathInputValue({
            latex: "\\ .\\ .\\ .,b,y,c,..\\ .\\ ",
            name: "/mi",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/mi"].stateValues.value.tree).eqls([
            "list",
            ["ldots"],
            "b",
            "y",
            "c",
            ["ldots"],
        ]);
        expect(stateVariables["/m"].stateValues.value.tree).eqls([
            "list",
            ["ldots"],
            "b",
            "y",
            "c",
            ["ldots"],
        ]);

        // change second set of periods to ldots

        await updateMathInputValue({
            latex: "\\ .\\ .\\ .,b,y,d,\\ldots\\ ",
            name: "/mi",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/mi"].stateValues.value.tree).eqls([
            "list",
            ["ldots"],
            "b",
            "y",
            "d",
            ["ldots"],
        ]);
        expect(stateVariables["/m"].stateValues.value.tree).eqls([
            "list",
            ["ldots"],
            "b",
            "y",
            "d",
            ["ldots"],
        ]);

        // change first set of periods to ldots

        await updateMathInputValue({
            latex: "\\ \\ldots\\ ,e,y,d,\\ldots\\ ",
            name: "/mi",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/mi"].stateValues.value.tree).eqls([
            "list",
            ["ldots"],
            "e",
            "y",
            "d",
            ["ldots"],
        ]);
        expect(stateVariables["/m"].stateValues.value.tree).eqls([
            "list",
            ["ldots"],
            "e",
            "y",
            "d",
            ["ldots"],
        ]);

        // remove first comma

        await updateMathInputValue({
            latex: "\\ \\ldots\\ f,y,d,\\ldots\\ ",
            name: "/mi",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/mi"].stateValues.value.tree).eqls([
            "list",
            ["ldots"],
            "f",
            "y",
            "d",
            ["ldots"],
        ]);
        expect(stateVariables["/m"].stateValues.value.tree).eqls([
            "list",
            ["ldots"],
            "f",
            "y",
            "d",
            ["ldots"],
        ]);

        // remove last comma

        await updateMathInputValue({
            latex: "\\ \\ldots\\ f,y,g\\ldots\\ ",
            name: "/mi",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/mi"].stateValues.value.tree).eqls([
            "list",
            ["ldots"],
            "f",
            "y",
            "g",
            ["ldots"],
        ]);
        expect(stateVariables["/m"].stateValues.value.tree).eqls([
            "list",
            ["ldots"],
            "f",
            "y",
            "g",
            ["ldots"],
        ]);
    });

    it("mathinput eliminates multicharacter symbols", async () => {
        let core = await createTestCore({
            doenetML: `
    <math name="varWithNum">x2</math>
    <math name="noSplit" splitSymbols="false">xyz</math>
    <mathinput name="varWithNum2" bindValueTo="$varWithNum" />
    <mathinput name="noSplit2" splitSymbols="false" bindValueTo="$noSplit" />
    <copy prop="value" source="varWithNum2" assignNames="varWithNum3"/>
    <copy prop="value" source="noSplit2" assignNames="noSplit3"/>
    `,
        });

        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/varWithNum"].stateValues.value.tree).eq("x2");
        expect(stateVariables["/varWithNum2"].stateValues.value.tree).eq("x2");
        expect(stateVariables["/varWithNum3"].stateValues.value.tree).eq("x2");
        expect(stateVariables["/noSplit"].stateValues.value.tree).eq("xyz");
        expect(stateVariables["/noSplit2"].stateValues.value.tree).eq("xyz");
        expect(stateVariables["/noSplit3"].stateValues.value.tree).eq("xyz");

        await updateMathInputValue({
            latex: "xu9j",
            name: "/varWithNum2",
            core,
        });
        await updateMathInputValue({
            latex: "xyuv",
            name: "/noSplit2",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/varWithNum"].stateValues.value.tree).eq("xu9j");
        expect(stateVariables["/varWithNum2"].stateValues.value.tree).eq(
            "xu9j",
        );
        expect(stateVariables["/varWithNum3"].stateValues.value.tree).eq(
            "xu9j",
        );
        expect(stateVariables["/noSplit"].stateValues.value.tree).eq("xyuv");
        expect(stateVariables["/noSplit2"].stateValues.value.tree).eq("xyuv");
        expect(stateVariables["/noSplit3"].stateValues.value.tree).eq("xyuv");
    });

    it("mathinput prefills 1", async () => {
        let core = await createTestCore({
            doenetML: `
    <p>
    <math format="latex" name="unionLatex">A \\cup B</math>
    <math name="unionText">A union B</math>
    <m name="unionM">A \\cup B</m>
    </p>

    <p>
    <mathinput name="union1" prefill="$unionLatex" />
    <mathinput name="union2" prefill="$unionText" format="latex" />
    <mathinput name="union3" prefill="A union B" />
    <mathinput name="union4" prefill="A \\cup B" format="latex" />
    <mathinput name="union5" prefillLatex="A \\cup B" />
    <mathinput name="union6" prefillLatex="$unionLatex" />
    <mathinput name="union7" prefillLatex="$unionM" />
    $union1.value{assignNames="union1m"}
    $union2.value{assignNames="union2m"}
    $union3.value{assignNames="union3m"}
    $union4.value{assignNames="union4m"}
    $union5.value{assignNames="union5m"}
    $union6.value{assignNames="union6m"}
    $union7.value{assignNames="union7m"}
    </p>

    `,
        });

        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/union1"].stateValues.value.tree).eqls([
            "union",
            "A",
            "B",
        ]);
        expect(stateVariables["/union2"].stateValues.value.tree).eqls([
            "union",
            "A",
            "B",
        ]);
        expect(stateVariables["/union3"].stateValues.value.tree).eqls([
            "union",
            "A",
            "B",
        ]);
        expect(stateVariables["/union4"].stateValues.value.tree).eqls([
            "union",
            "A",
            "B",
        ]);
        expect(stateVariables["/union5"].stateValues.value.tree).eqls([
            "union",
            "A",
            "B",
        ]);
        expect(stateVariables["/union6"].stateValues.value.tree).eqls([
            "union",
            "A",
            "B",
        ]);
        expect(stateVariables["/union7"].stateValues.value.tree).eqls([
            "union",
            "A",
            "B",
        ]);
        expect(stateVariables["/union1m"].stateValues.value.tree).eqls([
            "union",
            "A",
            "B",
        ]);
        expect(stateVariables["/union2m"].stateValues.value.tree).eqls([
            "union",
            "A",
            "B",
        ]);
        expect(stateVariables["/union3m"].stateValues.value.tree).eqls([
            "union",
            "A",
            "B",
        ]);
        expect(stateVariables["/union4m"].stateValues.value.tree).eqls([
            "union",
            "A",
            "B",
        ]);
        expect(stateVariables["/union5m"].stateValues.value.tree).eqls([
            "union",
            "A",
            "B",
        ]);
        expect(stateVariables["/union6m"].stateValues.value.tree).eqls([
            "union",
            "A",
            "B",
        ]);
        expect(stateVariables["/union7m"].stateValues.value.tree).eqls([
            "union",
            "A",
            "B",
        ]);
    });

    it("mathinput prefills 2", async () => {
        let core = await createTestCore({
            doenetML: `
    <p>
    <math splitSymbols="false" name="noSplit">xy</math>
    <math name="split">xy</math>
    </p>

    
    <p>
    <mathinput name="splits1" prefill="$noSplit" />
    <mathinput name="splits2" prefill="$noSplit" splitSymbols="false" />
    <mathinput name="splits3" prefill="$split" />
    <mathinput name="splits4" prefill="$split" splitSymbols="false" />
    <mathinput name="splits5" prefill="xy" />
    <mathinput name="splits6" prefill="xy" splitSymbols="false" />
    <mathinput name="splits7" prefillLatex="xy" />
    <mathinput name="splits8" prefillLatex="xy" splitSymbols="false" />
    $splits1.value{assignNames="splits1m"}
    $splits2.value{assignNames="splits2m"}
    $splits3.value{assignNames="splits3m"}
    $splits4.value{assignNames="splits4m"}
    $splits5.value{assignNames="splits5m"}
    $splits6.value{assignNames="splits6m"}
    $splits7.value{assignNames="splits7m"}
    $splits8.value{assignNames="splits8m"}
    </p>
    `,
        });

        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/splits1"].stateValues.value.tree).eqls("xy");
        expect(stateVariables["/splits2"].stateValues.value.tree).eqls("xy");
        expect(stateVariables["/splits3"].stateValues.value.tree).eqls([
            "*",
            "x",
            "y",
        ]);
        expect(stateVariables["/splits4"].stateValues.value.tree).eqls([
            "*",
            "x",
            "y",
        ]);
        expect(stateVariables["/splits5"].stateValues.value.tree).eqls([
            "*",
            "x",
            "y",
        ]);
        expect(stateVariables["/splits6"].stateValues.value.tree).eqls("xy");
        expect(stateVariables["/splits7"].stateValues.value.tree).eqls([
            "*",
            "x",
            "y",
        ]);
        expect(stateVariables["/splits8"].stateValues.value.tree).eqls("xy");
        expect(stateVariables["/splits1m"].stateValues.value.tree).eqls("xy");
        expect(stateVariables["/splits2m"].stateValues.value.tree).eqls("xy");
        expect(stateVariables["/splits3m"].stateValues.value.tree).eqls([
            "*",
            "x",
            "y",
        ]);
        expect(stateVariables["/splits4m"].stateValues.value.tree).eqls([
            "*",
            "x",
            "y",
        ]);
        expect(stateVariables["/splits5m"].stateValues.value.tree).eqls([
            "*",
            "x",
            "y",
        ]);
        expect(stateVariables["/splits6m"].stateValues.value.tree).eqls("xy");
        expect(stateVariables["/splits7m"].stateValues.value.tree).eqls([
            "*",
            "x",
            "y",
        ]);
        expect(stateVariables["/splits8m"].stateValues.value.tree).eqls("xy");

        await updateMathInputValue({
            latex: "xyz",
            name: "/splits1",
            core,
        });
        await updateMathInputValue({
            latex: "xyz",
            name: "/splits2",
            core,
        });
        await updateMathInputValue({
            latex: "xyz",
            name: "/splits3",
            core,
        });
        await updateMathInputValue({
            latex: "xyz",
            name: "/splits4",
            core,
        });
        await updateMathInputValue({
            latex: "xyz",
            name: "/splits5",
            core,
        });
        await updateMathInputValue({
            latex: "xyz",
            name: "/splits6",
            core,
        });
        await updateMathInputValue({
            latex: "xyz",
            name: "/splits7",
            core,
        });
        await updateMathInputValue({
            latex: "xyz",
            name: "/splits8",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/splits1"].stateValues.value.tree).eqls([
            "*",
            "x",
            "y",
            "z",
        ]);
        expect(stateVariables["/splits2"].stateValues.value.tree).eqls("xyz");
        expect(stateVariables["/splits3"].stateValues.value.tree).eqls([
            "*",
            "x",
            "y",
            "z",
        ]);
        expect(stateVariables["/splits4"].stateValues.value.tree).eqls("xyz");
        expect(stateVariables["/splits5"].stateValues.value.tree).eqls([
            "*",
            "x",
            "y",
            "z",
        ]);
        expect(stateVariables["/splits6"].stateValues.value.tree).eqls("xyz");
        expect(stateVariables["/splits7"].stateValues.value.tree).eqls([
            "*",
            "x",
            "y",
            "z",
        ]);
        expect(stateVariables["/splits8"].stateValues.value.tree).eqls("xyz");
        expect(stateVariables["/splits1m"].stateValues.value.tree).eqls([
            "*",
            "x",
            "y",
            "z",
        ]);
        expect(stateVariables["/splits2m"].stateValues.value.tree).eqls("xyz");
        expect(stateVariables["/splits3m"].stateValues.value.tree).eqls([
            "*",
            "x",
            "y",
            "z",
        ]);
        expect(stateVariables["/splits4m"].stateValues.value.tree).eqls("xyz");
        expect(stateVariables["/splits5m"].stateValues.value.tree).eqls([
            "*",
            "x",
            "y",
            "z",
        ]);
        expect(stateVariables["/splits6m"].stateValues.value.tree).eqls("xyz");
        expect(stateVariables["/splits7m"].stateValues.value.tree).eqls([
            "*",
            "x",
            "y",
            "z",
        ]);
        expect(stateVariables["/splits8m"].stateValues.value.tree).eqls("xyz");
    });

    it("mathinput prefills 3", async () => {
        let core = await createTestCore({
            doenetML: `
    <p>
    <math functionSymbols="h" name="hFunction">h(x)</math>
    <math name="hNoFunction">h(x)</math>
    </p>

    <p>
    <mathinput name="hFunction1" prefill="$hFunction" />
    <mathinput name="hFunction2" prefill="$hFunction" functionSymbols="h" />
    <mathinput name="hFunction3" prefill="$hNoFunction" />
    <mathinput name="hFunction4" prefill="$hNoFunction" functionSymbols="h" />
    <mathinput name="hFunction5" prefill="h(x)" />
    <mathinput name="hFunction6" prefill="h(x)" functionSymbols="h" />
    <mathinput name="hFunction7" prefillLatex="h(x)" />
    <mathinput name="hFunction8" prefillLatex="h(x)" functionSymbols="h" />
    $hFunction1.value{assignNames="hFunction1m"}
    $hFunction2.value{assignNames="hFunction2m"}
    $hFunction3.value{assignNames="hFunction3m"}
    $hFunction4.value{assignNames="hFunction4m"}
    $hFunction5.value{assignNames="hFunction5m"}
    $hFunction6.value{assignNames="hFunction6m"}
    $hFunction7.value{assignNames="hFunction7m"}
    $hFunction8.value{assignNames="hFunction8m"}
    </p>

    `,
        });

        let stateVariables = await returnAllStateVariables(core);

        expect(
            cleanLatex(
                stateVariables["/hFunction1"].stateValues.rawRendererValue,
            ),
        ).eq("h(x)");
        expect(
            cleanLatex(
                stateVariables["/hFunction2"].stateValues.rawRendererValue,
            ),
        ).eq("h(x)");
        expect(
            cleanLatex(
                stateVariables["/hFunction3"].stateValues.rawRendererValue,
            ),
        ).eq("hx");
        expect(
            cleanLatex(
                stateVariables["/hFunction4"].stateValues.rawRendererValue,
            ),
        ).eq("hx");
        expect(
            cleanLatex(
                stateVariables["/hFunction5"].stateValues.rawRendererValue,
            ),
        ).eq("hx");
        expect(
            cleanLatex(
                stateVariables["/hFunction6"].stateValues.rawRendererValue,
            ),
        ).eq("h(x)");
        expect(
            cleanLatex(
                stateVariables["/hFunction7"].stateValues.rawRendererValue,
            ),
        ).eq("h(x)");
        expect(
            cleanLatex(
                stateVariables["/hFunction8"].stateValues.rawRendererValue,
            ),
        ).eq("h(x)");

        expect(cleanLatex(stateVariables["/hFunction1m"].stateValues.latex)).eq(
            "h(x)",
        );
        expect(cleanLatex(stateVariables["/hFunction2m"].stateValues.latex)).eq(
            "h(x)",
        );
        expect(cleanLatex(stateVariables["/hFunction3m"].stateValues.latex)).eq(
            "hx",
        );
        expect(cleanLatex(stateVariables["/hFunction4m"].stateValues.latex)).eq(
            "hx",
        );
        expect(cleanLatex(stateVariables["/hFunction5m"].stateValues.latex)).eq(
            "hx",
        );
        expect(cleanLatex(stateVariables["/hFunction6m"].stateValues.latex)).eq(
            "h(x)",
        );
        expect(cleanLatex(stateVariables["/hFunction7m"].stateValues.latex)).eq(
            "hx",
        );
        expect(cleanLatex(stateVariables["/hFunction8m"].stateValues.latex)).eq(
            "h(x)",
        );

        expect(stateVariables["/hFunction1"].stateValues.value.tree).eqls([
            "apply",
            "h",
            "x",
        ]);
        expect(stateVariables["/hFunction2"].stateValues.value.tree).eqls([
            "apply",
            "h",
            "x",
        ]);
        expect(stateVariables["/hFunction3"].stateValues.value.tree).eqls([
            "*",
            "h",
            "x",
        ]);
        expect(stateVariables["/hFunction4"].stateValues.value.tree).eqls([
            "*",
            "h",
            "x",
        ]);
        expect(stateVariables["/hFunction5"].stateValues.value.tree).eqls([
            "*",
            "h",
            "x",
        ]);
        expect(stateVariables["/hFunction6"].stateValues.value.tree).eqls([
            "apply",
            "h",
            "x",
        ]);
        expect(stateVariables["/hFunction7"].stateValues.value.tree).eqls([
            "*",
            "h",
            "x",
        ]);
        expect(stateVariables["/hFunction8"].stateValues.value.tree).eqls([
            "apply",
            "h",
            "x",
        ]);
        expect(stateVariables["/hFunction1m"].stateValues.value.tree).eqls([
            "apply",
            "h",
            "x",
        ]);
        expect(stateVariables["/hFunction2m"].stateValues.value.tree).eqls([
            "apply",
            "h",
            "x",
        ]);
        expect(stateVariables["/hFunction3m"].stateValues.value.tree).eqls([
            "*",
            "h",
            "x",
        ]);
        expect(stateVariables["/hFunction4m"].stateValues.value.tree).eqls([
            "*",
            "h",
            "x",
        ]);
        expect(stateVariables["/hFunction5m"].stateValues.value.tree).eqls([
            "*",
            "h",
            "x",
        ]);
        expect(stateVariables["/hFunction6m"].stateValues.value.tree).eqls([
            "apply",
            "h",
            "x",
        ]);
        expect(stateVariables["/hFunction7m"].stateValues.value.tree).eqls([
            "*",
            "h",
            "x",
        ]);
        expect(stateVariables["/hFunction8m"].stateValues.value.tree).eqls([
            "apply",
            "h",
            "x",
        ]);

        await updateMathInputValue({
            latex: "h(y)",
            name: "/hFunction1",
            core,
        });
        await updateMathInputValue({
            latex: "h(y)",
            name: "/hFunction2",
            core,
        });
        await updateMathInputValue({
            latex: "h(y)",
            name: "/hFunction3",
            core,
        });
        await updateMathInputValue({
            latex: "h(y)",
            name: "/hFunction4",
            core,
        });
        await updateMathInputValue({
            latex: "h(y)",
            name: "/hFunction5",
            core,
        });
        await updateMathInputValue({
            latex: "h(y)",
            name: "/hFunction6",
            core,
        });
        await updateMathInputValue({
            latex: "h(y)",
            name: "/hFunction7",
            core,
        });
        await updateMathInputValue({
            latex: "h(y)",
            name: "/hFunction8",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(
            cleanLatex(
                stateVariables["/hFunction1"].stateValues.rawRendererValue,
            ),
        ).eq("h(y)");
        expect(
            cleanLatex(
                stateVariables["/hFunction2"].stateValues.rawRendererValue,
            ),
        ).eq("h(y)");
        expect(
            cleanLatex(
                stateVariables["/hFunction3"].stateValues.rawRendererValue,
            ),
        ).eq("h(y)");
        expect(
            cleanLatex(
                stateVariables["/hFunction4"].stateValues.rawRendererValue,
            ),
        ).eq("h(y)");
        expect(
            cleanLatex(
                stateVariables["/hFunction5"].stateValues.rawRendererValue,
            ),
        ).eq("h(y)");
        expect(
            cleanLatex(
                stateVariables["/hFunction6"].stateValues.rawRendererValue,
            ),
        ).eq("h(y)");
        expect(
            cleanLatex(
                stateVariables["/hFunction7"].stateValues.rawRendererValue,
            ),
        ).eq("h(y)");
        expect(
            cleanLatex(
                stateVariables["/hFunction8"].stateValues.rawRendererValue,
            ),
        ).eq("h(y)");

        expect(cleanLatex(stateVariables["/hFunction1m"].stateValues.latex)).eq(
            "hy",
        );
        expect(cleanLatex(stateVariables["/hFunction2m"].stateValues.latex)).eq(
            "h(y)",
        );
        expect(cleanLatex(stateVariables["/hFunction3m"].stateValues.latex)).eq(
            "hy",
        );
        expect(cleanLatex(stateVariables["/hFunction4m"].stateValues.latex)).eq(
            "h(y)",
        );
        expect(cleanLatex(stateVariables["/hFunction5m"].stateValues.latex)).eq(
            "hy",
        );
        expect(cleanLatex(stateVariables["/hFunction6m"].stateValues.latex)).eq(
            "h(y)",
        );
        expect(cleanLatex(stateVariables["/hFunction7m"].stateValues.latex)).eq(
            "hy",
        );
        expect(cleanLatex(stateVariables["/hFunction8m"].stateValues.latex)).eq(
            "h(y)",
        );

        expect(stateVariables["/hFunction1"].stateValues.value.tree).eqls([
            "*",
            "h",
            "y",
        ]);
        expect(stateVariables["/hFunction2"].stateValues.value.tree).eqls([
            "apply",
            "h",
            "y",
        ]);
        expect(stateVariables["/hFunction3"].stateValues.value.tree).eqls([
            "*",
            "h",
            "y",
        ]);
        expect(stateVariables["/hFunction4"].stateValues.value.tree).eqls([
            "apply",
            "h",
            "y",
        ]);
        expect(stateVariables["/hFunction5"].stateValues.value.tree).eqls([
            "*",
            "h",
            "y",
        ]);
        expect(stateVariables["/hFunction6"].stateValues.value.tree).eqls([
            "apply",
            "h",
            "y",
        ]);
        expect(stateVariables["/hFunction7"].stateValues.value.tree).eqls([
            "*",
            "h",
            "y",
        ]);
        expect(stateVariables["/hFunction8"].stateValues.value.tree).eqls([
            "apply",
            "h",
            "y",
        ]);
        expect(stateVariables["/hFunction1m"].stateValues.value.tree).eqls([
            "*",
            "h",
            "y",
        ]);
        expect(stateVariables["/hFunction2m"].stateValues.value.tree).eqls([
            "apply",
            "h",
            "y",
        ]);
        expect(stateVariables["/hFunction3m"].stateValues.value.tree).eqls([
            "*",
            "h",
            "y",
        ]);
        expect(stateVariables["/hFunction4m"].stateValues.value.tree).eqls([
            "apply",
            "h",
            "y",
        ]);
        expect(stateVariables["/hFunction5m"].stateValues.value.tree).eqls([
            "*",
            "h",
            "y",
        ]);
        expect(stateVariables["/hFunction6m"].stateValues.value.tree).eqls([
            "apply",
            "h",
            "y",
        ]);
        expect(stateVariables["/hFunction7m"].stateValues.value.tree).eqls([
            "*",
            "h",
            "y",
        ]);
        expect(stateVariables["/hFunction8m"].stateValues.value.tree).eqls([
            "apply",
            "h",
            "y",
        ]);
    });

    it("prefillFromLatex", async () => {
        let core = await createTestCore({
            doenetML: `
    <p>Prefill with m: <m>\\frac{a}{b} \\int_a^b \\hat{f}(x) dx</m></p>
    <p>Result: <mathinput prefillLatex="$_m1" name="input1" /></p>
    <p name="pv1">Value: $input1{name="iv1"}</p>
    <p name="pr1">Raw value: $input1.rawRendererValue</p>

    <p>Prefill with phrase including "\\ "</p>
    <p>Result: <mathinput prefillLatex="hello\\ there (a)(b)" name="input2" /></p>
    <p name="pv2">Value: $input2{name="iv2"}</p>
    <p name="pr2">Raw value: $input2.rawRendererValue</p>

    <p>Prefill with a \\text</p>
    <p>Result: <mathinput prefillLatex="\\text{hello there} (a)(b)" name="input3" /></p>
    <p name="pv3">Value: $input3{name="iv3"}</p>
    <p name="pr3">Raw value: $input3.rawRendererValue</p>

    `,
        });

        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/input1"].stateValues.value.tree).eq("\uff3f");
        expect(stateVariables["/input1"].stateValues.immediateValue.tree).eq(
            "\uff3f",
        );
        expect(stateVariables["/input1"].stateValues.rawRendererValue).eq(
            "\\frac{a}{b} \\int_a^b \\hat{f}(x) dx",
        );
        expect(stateVariables["/input2"].stateValues.value.tree).eqls([
            "*",
            "h",
            "e",
            "l",
            "l",
            "o",
            "t",
            "h",
            "e",
            "r",
            "e",
            "a",
            "b",
        ]);
        expect(stateVariables["/input2"].stateValues.immediateValue.tree).eqls([
            "*",
            "h",
            "e",
            "l",
            "l",
            "o",
            "t",
            "h",
            "e",
            "r",
            "e",
            "a",
            "b",
        ]);
        expect(stateVariables["/input2"].stateValues.rawRendererValue).eq(
            "hello\\ there (a)(b)",
        );
        expect(stateVariables["/input3"].stateValues.value.tree).eq("\uff3f");
        expect(stateVariables["/input3"].stateValues.immediateValue.tree).eq(
            "\uff3f",
        );
        expect(stateVariables["/input3"].stateValues.rawRendererValue).eq(
            "\\text{hello there} (a)(b)",
        );

        await updateMathInputValue({
            latex: "\\frac{a}{b} \\int_a^b f(x) dx",
            name: "/input1",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(cleanLatex(stateVariables["/iv1"].stateValues.latex)).eq(
            "(\\frac{a}{b})\\int_{a}^{b}f(x)dx",
        );
        expect(stateVariables["/pr1"].stateValues.text).eq(
            "Raw value: \\frac{a}{b} \\int_a^b f(x) dx",
        );

        // expect(stateVariables['/input1'].stateValues.value.tree).eqls(["*", ["/", "a", "b"], "a", ["apply", "f", "x"], "d", "x"])
        // expect(stateVariables['/input1'].stateValues.immediateValue.tree).eqls(["*", ["/", "a", "b"], "a", ["apply", "f", "x"], "d", "x"])
        expect(
            cleanLatex(stateVariables["/input1"].stateValues.rawRendererValue),
        ).eq("\\frac{a}{b}\\int_a^bf(x)dx");

        await updateMathInputValue({
            latex: "hello(a)(b)",
            name: "/input2",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(cleanLatex(stateVariables["/iv2"].stateValues.latex)).eq(
            "helloab",
        );
        expect(stateVariables["/pr2"].stateValues.text).eq(
            "Raw value: hello(a)(b)",
        );

        expect(stateVariables["/input2"].stateValues.value.tree).eqls([
            "*",
            "h",
            "e",
            "l",
            "l",
            "o",
            "a",
            "b",
        ]);
        expect(stateVariables["/input2"].stateValues.immediateValue.tree).eqls([
            "*",
            "h",
            "e",
            "l",
            "l",
            "o",
            "a",
            "b",
        ]);
        expect(stateVariables["/input2"].stateValues.rawRendererValue).eq(
            "hello(a)(b)",
        );

        await updateMathInputValue({
            latex: "\\text{h}(a)(b)",
            name: "/input3",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(cleanLatex(stateVariables["/iv3"].stateValues.latex)).eq(
            "\uff3f",
        );
        expect(stateVariables["/pr3"].stateValues.text).eq(
            "Raw value: \\text{h}(a)(b)",
        );

        expect(stateVariables["/input3"].stateValues.value.tree).eq("\uff3f");
        expect(stateVariables["/input3"].stateValues.immediateValue.tree).eq(
            "\uff3f",
        );
        expect(stateVariables["/input3"].stateValues.rawRendererValue).eq(
            "\\text{h}(a)(b)",
        );

        await updateMathInputValue({
            latex: "(a)(b)",
            name: "/input3",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(cleanLatex(stateVariables["/iv3"].stateValues.latex)).eq("ab");
        expect(stateVariables["/pr3"].stateValues.text).eq("Raw value: (a)(b)");

        expect(stateVariables["/input3"].stateValues.value.tree).eqls([
            "*",
            "a",
            "b",
        ]);
        expect(stateVariables["/input3"].stateValues.immediateValue.tree).eqls([
            "*",
            "a",
            "b",
        ]);
        expect(stateVariables["/input3"].stateValues.rawRendererValue).eq(
            "(a)(b)",
        );
    });

    it("convert and/or into logicals", async () => {
        let core = await createTestCore({
            doenetML: `
    <mathinput name="mi" />

    <p>Value: <copy prop="value" source="mi" assignNames="m"/></p>
    `,
        });

        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/m"].stateValues.value.tree).eq("\uff3f");

        // equalities with or

        await updateMathInputValue({
            latex: "x=1 or u=x",
            name: "/mi",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/mi"].stateValues.value.tree).eqls([
            "or",
            ["=", "x", 1],
            ["=", "u", "x"],
        ]);
        expect(stateVariables["/m"].stateValues.value.tree).eqls([
            "or",
            ["=", "x", 1],
            ["=", "u", "x"],
        ]);

        // inequalities with and
        await updateMathInputValue({
            latex: "x>3 and x \\le 5",
            name: "/mi",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/mi"].stateValues.value.tree).eqls([
            "and",
            [">", "x", 3],
            ["le", "x", 5],
        ]);
        expect(stateVariables["/m"].stateValues.value.tree).eqls([
            "and",
            [">", "x", 3],
            ["le", "x", 5],
        ]);

        // don't convert if not word
        await updateMathInputValue({
            latex: "AandBorC",
            name: "/mi",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/mi"].stateValues.value.tree).eqls([
            "*",
            "A",
            "a",
            "n",
            "d",
            "B",
            "o",
            "r",
            "C",
        ]);
        expect(stateVariables["/m"].stateValues.value.tree).eqls([
            "*",
            "A",
            "a",
            "n",
            "d",
            "B",
            "o",
            "r",
            "C",
        ]);

        // add parens or spaces
        await updateMathInputValue({
            latex: "(A)and B or(C)",
            name: "/mi",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/mi"].stateValues.value.tree).eqls([
            "or",
            ["and", "A", "B"],
            "C",
        ]);
        expect(stateVariables["/m"].stateValues.value.tree).eqls([
            "or",
            ["and", "A", "B"],
            "C",
        ]);
    });

    it("union from U", async () => {
        let core = await createTestCore({
            doenetML: `
    <booleanInput name="ufu" />
    <mathinput name="mi" unionFromU="$ufu" />

    <p>Value: <copy prop="value" source="mi" assignNames="m"/></p>
    `,
        });

        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/m"].stateValues.value.tree).eq("\uff3f");

        // A U C without unionFromU

        await updateMathInputValue({
            latex: "A U C",
            name: "/mi",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/mi"].stateValues.value.tree).eqls([
            "*",
            "A",
            "U",
            "C",
        ]);
        expect(stateVariables["/m"].stateValues.value.tree).eqls([
            "*",
            "A",
            "U",
            "C",
        ]);

        // activate unionFromU and modify text

        await updateBooleanInputValue({
            boolean: true,
            name: "/ufu",
            core,
        });
        await updateMathInputValue({
            latex: "A U B",
            name: "/mi",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/mi"].stateValues.value.tree).eqls([
            "union",
            "A",
            "B",
        ]);
        expect(stateVariables["/m"].stateValues.value.tree).eqls([
            "union",
            "A",
            "B",
        ]);

        // no substitution without spaces

        await updateMathInputValue({
            latex: "A UB",
            name: "/mi",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/mi"].stateValues.value.tree).eqls([
            "*",
            "A",
            "U",
            "B",
        ]);
        expect(stateVariables["/m"].stateValues.value.tree).eqls([
            "*",
            "A",
            "U",
            "B",
        ]);

        // add parens

        await updateMathInputValue({
            latex: "A U(B)",
            name: "/mi",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/mi"].stateValues.value.tree).eqls([
            "union",
            "A",
            "B",
        ]);
        expect(stateVariables["/m"].stateValues.value.tree).eqls([
            "union",
            "A",
            "B",
        ]);
    });

    it("mathinput can merge coordinates", async () => {
        let core = await createTestCore({
            doenetML: `
  <mathinput name="coords" prefill="(1,2)" />
  <graph>
    <point name="P" coords="$coords" />
  </graph>
  <p>Change x-coordinate: <mathinput name="x1" bindValueTo="$P.x1" /></p>
  <p>Change y-coordinate: <mathinput name="x2" bindValueTo="$P.x2" /></p>
  `,
        });

        let stateVariables = await returnAllStateVariables(core);
        expect(
            cleanLatex(stateVariables["/coords"].stateValues.rawRendererValue),
        ).eq("(1,2)");

        await updateMathInputValue({
            latex: "3",
            name: "/x1",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(
            cleanLatex(stateVariables["/coords"].stateValues.rawRendererValue),
        ).eq("(3,2)");

        await updateMathInputValue({
            latex: "4",
            name: "/x2",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(
            cleanLatex(stateVariables["/coords"].stateValues.rawRendererValue),
        ).eq("(3,4)");
    });

    it("mathinput can merge coordinates, immediateValue", async () => {
        let core = await createTestCore({
            doenetML: `
  <mathinput name="coords" prefill="(1,2)" />
  <graph>
    <point name="P" coords="$coords.immediateValue" />
  </graph>
  <p>Change x-coordinate: <mathinput name="x1" bindValueTo="$P.x1" /></p>
  <p>Change y-coordinate: <mathinput name="x2" bindValueTo="$P.x2" /></p>
  `,
        });

        let stateVariables = await returnAllStateVariables(core);
        expect(
            cleanLatex(stateVariables["/coords"].stateValues.rawRendererValue),
        ).eq("(1,2)");

        await updateMathInputValue({
            latex: "3",
            name: "/x1",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(
            cleanLatex(stateVariables["/coords"].stateValues.rawRendererValue),
        ).eq("(3,2)");

        await updateMathInputValue({
            latex: "4",
            name: "/x2",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(
            cleanLatex(stateVariables["/coords"].stateValues.rawRendererValue),
        ).eq("(3,4)");
    });

    it("change prefill", async () => {
        let core = await createTestCore({
            doenetML: `
  <p><mathinput name="mi" prefill="(1,2)" /></p>
  <p>Value: $mi.value{assignNames="m"}</p>
  <p>Prefill: <copy source="mi" prop="prefill" assignNames="pf" /></p>
  <p>Change prefill: <mathinput name="mipf" bindValueTo="$mi.prefill" /></p>
  `,
        });

        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/pf"].stateValues.value.tree).eqls([
            "tuple",
            1,
            2,
        ]);
        expect(stateVariables["/m"].stateValues.value.tree).eqls([
            "tuple",
            1,
            2,
        ]);
        expect(stateVariables["/mi"].stateValues.value.tree).eqls([
            "tuple",
            1,
            2,
        ]);
        expect(stateVariables["/mi"].stateValues.prefill.tree).eqls([
            "tuple",
            1,
            2,
        ]);
        expect(stateVariables["/mipf"].stateValues.value.tree).eqls([
            "tuple",
            1,
            2,
        ]);

        // change prefill

        await updateMathInputValue({
            latex: "(1,5)",
            name: "/mipf",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/pf"].stateValues.value.tree).eqls([
            "tuple",
            1,
            5,
        ]);
        expect(stateVariables["/m"].stateValues.value.tree).eqls([
            "tuple",
            1,
            5,
        ]);
        expect(stateVariables["/mi"].stateValues.value.tree).eqls([
            "tuple",
            1,
            5,
        ]);
        expect(stateVariables["/mi"].stateValues.prefill.tree).eqls([
            "tuple",
            1,
            5,
        ]);
        expect(stateVariables["/mipf"].stateValues.value.tree).eqls([
            "tuple",
            1,
            5,
        ]);

        // change value

        await updateMathInputValue({
            latex: "(1,9)",
            name: "/mi",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/pf"].stateValues.value.tree).eqls([
            "tuple",
            1,
            5,
        ]);
        expect(stateVariables["/m"].stateValues.value.tree).eqls([
            "tuple",
            1,
            9,
        ]);
        expect(stateVariables["/mi"].stateValues.value.tree).eqls([
            "tuple",
            1,
            9,
        ]);
        expect(stateVariables["/mi"].stateValues.prefill.tree).eqls([
            "tuple",
            1,
            5,
        ]);
        expect(stateVariables["/mipf"].stateValues.value.tree).eqls([
            "tuple",
            1,
            5,
        ]);

        // change prefill again

        await updateMathInputValue({
            latex: "(1,7)",
            name: "/mipf",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/pf"].stateValues.value.tree).eqls([
            "tuple",
            1,
            7,
        ]);
        expect(stateVariables["/m"].stateValues.value.tree).eqls([
            "tuple",
            1,
            9,
        ]);
        expect(stateVariables["/mi"].stateValues.value.tree).eqls([
            "tuple",
            1,
            9,
        ]);
        expect(stateVariables["/mi"].stateValues.prefill.tree).eqls([
            "tuple",
            1,
            7,
        ]);
        expect(stateVariables["/mipf"].stateValues.value.tree).eqls([
            "tuple",
            1,
            7,
        ]);
    });

    it("mathinput with number child", async () => {
        let core = await createTestCore({
            doenetML: `
  <p><mathinput name="mi" ><number /></mathinput></p>
  <p>Value: $mi.value{assignNames="mv"}</p>
  <p>Immediate Value: $mi.immediateValue{assignNames="miv"}</p>
  `,
        });

        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/mv"].stateValues.value.tree).eqls(NaN);
        expect(stateVariables["/miv"].stateValues.value.tree).eqls(NaN);
        expect(stateVariables["/mi"].stateValues.rawRendererValue).eqls("");
        expect(stateVariables["/mi"].stateValues.value.tree).eqls(NaN);
        expect(stateVariables["/mi"].stateValues.immediateValue.tree).eqls(NaN);

        // type a number

        await updateMathInputImmediateValue({
            latex: "5",
            name: "/mi",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/mv"].stateValues.value.tree).eqls(NaN);
        expect(stateVariables["/miv"].stateValues.value.tree).eqls(5);
        expect(stateVariables["/mi"].stateValues.rawRendererValue).eqls("5");
        expect(stateVariables["/mi"].stateValues.value.tree).eqls(NaN);
        expect(stateVariables["/mi"].stateValues.immediateValue.tree).eqls(5);

        // update value (e.g., hit enter)

        await updateMathInputValueToImmediateValue({
            name: "/mi",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/mv"].stateValues.value.tree).eqls(5);
        expect(stateVariables["/miv"].stateValues.value.tree).eqls(5);
        expect(stateVariables["/mi"].stateValues.rawRendererValue).eqls("5");
        expect(stateVariables["/mi"].stateValues.value.tree).eqls(5);
        expect(stateVariables["/mi"].stateValues.immediateValue.tree).eqls(5);

        // type pi

        await updateMathInputImmediateValue({
            latex: "\\pi",
            name: "/mi",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/mv"].stateValues.value.tree).eqls(5);
        expect(stateVariables["/miv"].stateValues.value.tree).eqls("pi");
        expect(stateVariables["/mi"].stateValues.rawRendererValue).eqls("\\pi");
        expect(stateVariables["/mi"].stateValues.value.tree).eqls(5);
        expect(stateVariables["/mi"].stateValues.immediateValue.tree).eqls(
            "pi",
        );

        // update value (e.g., hit enter)

        await updateMathInputValueToImmediateValue({
            name: "/mi",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/mv"].stateValues.value.tree).eqls(Math.PI);
        expect(stateVariables["/mv"].stateValues.valueForDisplay.tree).eqls(
            3.141592654,
        );
        expect(stateVariables["/miv"].stateValues.value.tree).eqls(Math.PI);
        expect(stateVariables["/miv"].stateValues.valueForDisplay.tree).eqls(
            3.141592654,
        );
        expect(stateVariables["/mi"].stateValues.rawRendererValue).eqls(
            "3.141592654",
        );
        expect(stateVariables["/mi"].stateValues.value.tree).eqls(Math.PI);
        expect(stateVariables["/mi"].stateValues.immediateValue.tree).eqls(
            Math.PI,
        );

        // type x
        await updateMathInputImmediateValue({
            latex: "x",
            name: "/mi",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/mv"].stateValues.value.tree).eqls(Math.PI);
        expect(stateVariables["/mv"].stateValues.valueForDisplay.tree).eqls(
            3.141592654,
        );
        expect(stateVariables["/miv"].stateValues.value.tree).eqls("x");
        expect(stateVariables["/mi"].stateValues.rawRendererValue).eqls("x");
        expect(stateVariables["/mi"].stateValues.value.tree).eqls(Math.PI);
        expect(stateVariables["/mi"].stateValues.immediateValue.tree).eqls("x");

        // update value (e.g., hit enter)

        await updateMathInputValueToImmediateValue({
            name: "/mi",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/mv"].stateValues.value.tree).eqls(NaN);
        expect(stateVariables["/miv"].stateValues.value.tree).eqls(NaN);
        expect(stateVariables["/mi"].stateValues.rawRendererValue).eqls("");
        expect(stateVariables["/mi"].stateValues.value.tree).eqls(NaN);
        expect(stateVariables["/mi"].stateValues.immediateValue.tree).eqls(NaN);

        // type 2/3

        await updateMathInputImmediateValue({
            latex: "2/3",
            name: "/mi",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/mv"].stateValues.value.tree).eqls(NaN);
        expect(stateVariables["/miv"].stateValues.value.tree).eqls(["/", 2, 3]);
        expect(stateVariables["/mi"].stateValues.rawRendererValue).eqls("2/3");
        expect(stateVariables["/mi"].stateValues.value.tree).eqls(NaN);
        expect(stateVariables["/mi"].stateValues.immediateValue.tree).eqls([
            "/",
            2,
            3,
        ]);

        // update value (e.g., hit enter)

        await updateMathInputValueToImmediateValue({
            name: "/mi",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/mv"].stateValues.value.tree).eqls(2 / 3);
        expect(stateVariables["/mv"].stateValues.valueForDisplay.tree).eqls(
            0.6666666667,
        );
        expect(stateVariables["/miv"].stateValues.value.tree).eqls(2 / 3);
        expect(stateVariables["/miv"].stateValues.valueForDisplay.tree).eqls(
            0.6666666667,
        );
        expect(stateVariables["/mi"].stateValues.rawRendererValue).eqls(
            "0.6666666667",
        );
        expect(stateVariables["/mi"].stateValues.value.tree).eqls(2 / 3);
        expect(stateVariables["/mi"].stateValues.immediateValue.tree).eqls(
            2 / 3,
        );
    });

    it("mathinput with number child, do not hide NaN", async () => {
        let core = await createTestCore({
            doenetML: `
  <p><mathinput name="mi" hideNaN="false"><number /></mathinput></p>
  <p>Value: $mi.value{assignNames="mv"}</p>
  <p>Immediate Value: $mi.immediateValue{assignNames="miv"}</p>
  `,
        });

        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/mv"].stateValues.value.tree).eqls(NaN);
        expect(stateVariables["/miv"].stateValues.value.tree).eqls(NaN);
        expect(stateVariables["/mi"].stateValues.rawRendererValue).eqls("NaN");
        expect(stateVariables["/mi"].stateValues.value.tree).eqls(NaN);
        expect(stateVariables["/mi"].stateValues.immediateValue.tree).eqls(NaN);

        // type a number

        await updateMathInputImmediateValue({
            latex: "5",
            name: "/mi",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/mv"].stateValues.value.tree).eqls(NaN);
        expect(stateVariables["/miv"].stateValues.value.tree).eqls(5);
        expect(stateVariables["/mi"].stateValues.rawRendererValue).eqls("5");
        expect(stateVariables["/mi"].stateValues.value.tree).eqls(NaN);
        expect(stateVariables["/mi"].stateValues.immediateValue.tree).eqls(5);

        // update value (e.g., hit enter)

        await updateMathInputValueToImmediateValue({
            name: "/mi",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/mv"].stateValues.value.tree).eqls(5);
        expect(stateVariables["/miv"].stateValues.value.tree).eqls(5);
        expect(stateVariables["/mi"].stateValues.rawRendererValue).eqls("5");
        expect(stateVariables["/mi"].stateValues.value.tree).eqls(5);
        expect(stateVariables["/mi"].stateValues.immediateValue.tree).eqls(5);

        // type pi

        await updateMathInputImmediateValue({
            latex: "\\pi",
            name: "/mi",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/mv"].stateValues.value.tree).eqls(5);
        expect(stateVariables["/miv"].stateValues.value.tree).eqls("pi");
        expect(stateVariables["/mi"].stateValues.rawRendererValue).eqls("\\pi");
        expect(stateVariables["/mi"].stateValues.value.tree).eqls(5);
        expect(stateVariables["/mi"].stateValues.immediateValue.tree).eqls(
            "pi",
        );

        // update value (e.g., hit enter)

        await updateMathInputValueToImmediateValue({
            name: "/mi",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/mv"].stateValues.value.tree).eqls(Math.PI);
        expect(stateVariables["/mv"].stateValues.valueForDisplay.tree).eqls(
            3.141592654,
        );
        expect(stateVariables["/miv"].stateValues.value.tree).eqls(Math.PI);
        expect(stateVariables["/miv"].stateValues.valueForDisplay.tree).eqls(
            3.141592654,
        );
        expect(stateVariables["/mi"].stateValues.rawRendererValue).eqls(
            "3.141592654",
        );
        expect(stateVariables["/mi"].stateValues.value.tree).eqls(Math.PI);
        expect(stateVariables["/mi"].stateValues.immediateValue.tree).eqls(
            Math.PI,
        );

        // type x
        await updateMathInputImmediateValue({
            latex: "x",
            name: "/mi",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/mv"].stateValues.value.tree).eqls(Math.PI);
        expect(stateVariables["/mv"].stateValues.valueForDisplay.tree).eqls(
            3.141592654,
        );
        expect(stateVariables["/miv"].stateValues.value.tree).eqls("x");
        expect(stateVariables["/mi"].stateValues.rawRendererValue).eqls("x");
        expect(stateVariables["/mi"].stateValues.value.tree).eqls(Math.PI);
        expect(stateVariables["/mi"].stateValues.immediateValue.tree).eqls("x");

        // update value (e.g., hit enter)

        await updateMathInputValueToImmediateValue({
            name: "/mi",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/mv"].stateValues.value.tree).eqls(NaN);
        expect(stateVariables["/miv"].stateValues.value.tree).eqls(NaN);
        expect(stateVariables["/mi"].stateValues.rawRendererValue).eqls("NaN");
        expect(stateVariables["/mi"].stateValues.value.tree).eqls(NaN);
        expect(stateVariables["/mi"].stateValues.immediateValue.tree).eqls(NaN);

        // type 2/3

        await updateMathInputImmediateValue({
            latex: "2/3",
            name: "/mi",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/mv"].stateValues.value.tree).eqls(NaN);
        expect(stateVariables["/miv"].stateValues.value.tree).eqls(["/", 2, 3]);
        expect(stateVariables["/mi"].stateValues.rawRendererValue).eqls("2/3");
        expect(stateVariables["/mi"].stateValues.value.tree).eqls(NaN);
        expect(stateVariables["/mi"].stateValues.immediateValue.tree).eqls([
            "/",
            2,
            3,
        ]);

        // update value (e.g., hit enter)

        await updateMathInputValueToImmediateValue({
            name: "/mi",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/mv"].stateValues.value.tree).eqls(2 / 3);
        expect(stateVariables["/mv"].stateValues.valueForDisplay.tree).eqls(
            0.6666666667,
        );
        expect(stateVariables["/miv"].stateValues.value.tree).eqls(2 / 3);
        expect(stateVariables["/miv"].stateValues.valueForDisplay.tree).eqls(
            0.6666666667,
        );
        expect(stateVariables["/mi"].stateValues.rawRendererValue).eqls(
            "0.6666666667",
        );
        expect(stateVariables["/mi"].stateValues.value.tree).eqls(2 / 3);
        expect(stateVariables["/mi"].stateValues.immediateValue.tree).eqls(
            2 / 3,
        );
    });

    it("mathinput with number child, value on NaN", async () => {
        let core = await createTestCore({
            doenetML: `
  <p><mathinput name="mi"><number valueOnNaN='0' /></mathinput></p>
  <p>Value: $mi.value{assignNames="mv"}</p>
  <p>Immediate Value: $mi.immediateValue{assignNames="miv"}</p>
  `,
        });

        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/mv"].stateValues.value.tree).eqls(0);
        expect(stateVariables["/miv"].stateValues.value.tree).eqls(0);
        expect(stateVariables["/mi"].stateValues.rawRendererValue).eqls("0");
        expect(stateVariables["/mi"].stateValues.value.tree).eqls(0);
        expect(stateVariables["/mi"].stateValues.immediateValue.tree).eqls(0);

        // type a number

        await updateMathInputImmediateValue({
            latex: "5",
            name: "/mi",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/mv"].stateValues.value.tree).eqls(0);
        expect(stateVariables["/miv"].stateValues.value.tree).eqls(5);
        expect(stateVariables["/mi"].stateValues.rawRendererValue).eqls("5");
        expect(stateVariables["/mi"].stateValues.value.tree).eqls(0);
        expect(stateVariables["/mi"].stateValues.immediateValue.tree).eqls(5);

        // update value (e.g., hit enter)

        await updateMathInputValueToImmediateValue({
            name: "/mi",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/mv"].stateValues.value.tree).eqls(5);
        expect(stateVariables["/miv"].stateValues.value.tree).eqls(5);
        expect(stateVariables["/mi"].stateValues.rawRendererValue).eqls("5");
        expect(stateVariables["/mi"].stateValues.value.tree).eqls(5);
        expect(stateVariables["/mi"].stateValues.immediateValue.tree).eqls(5);

        // type pi

        await updateMathInputImmediateValue({
            latex: "\\pi",
            name: "/mi",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/mv"].stateValues.value.tree).eqls(5);
        expect(stateVariables["/miv"].stateValues.value.tree).eqls("pi");
        expect(stateVariables["/mi"].stateValues.rawRendererValue).eqls("\\pi");
        expect(stateVariables["/mi"].stateValues.value.tree).eqls(5);
        expect(stateVariables["/mi"].stateValues.immediateValue.tree).eqls(
            "pi",
        );

        // update value (e.g., hit enter)

        await updateMathInputValueToImmediateValue({
            name: "/mi",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/mv"].stateValues.value.tree).eqls(Math.PI);
        expect(stateVariables["/mv"].stateValues.valueForDisplay.tree).eqls(
            3.141592654,
        );
        expect(stateVariables["/miv"].stateValues.value.tree).eqls(Math.PI);
        expect(stateVariables["/miv"].stateValues.valueForDisplay.tree).eqls(
            3.141592654,
        );
        expect(stateVariables["/mi"].stateValues.rawRendererValue).eqls(
            "3.141592654",
        );
        expect(stateVariables["/mi"].stateValues.value.tree).eqls(Math.PI);
        expect(stateVariables["/mi"].stateValues.immediateValue.tree).eqls(
            Math.PI,
        );

        // type x
        await updateMathInputImmediateValue({
            latex: "x",
            name: "/mi",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/mv"].stateValues.value.tree).eqls(Math.PI);
        expect(stateVariables["/mv"].stateValues.valueForDisplay.tree).eqls(
            3.141592654,
        );
        expect(stateVariables["/miv"].stateValues.value.tree).eqls("x");
        expect(stateVariables["/mi"].stateValues.rawRendererValue).eqls("x");
        expect(stateVariables["/mi"].stateValues.value.tree).eqls(Math.PI);
        expect(stateVariables["/mi"].stateValues.immediateValue.tree).eqls("x");

        // update value (e.g., hit enter)

        await updateMathInputValueToImmediateValue({
            name: "/mi",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/mv"].stateValues.value.tree).eqls(0);
        expect(stateVariables["/miv"].stateValues.value.tree).eqls(0);
        expect(stateVariables["/mi"].stateValues.rawRendererValue).eqls("0");
        expect(stateVariables["/mi"].stateValues.value.tree).eqls(0);
        expect(stateVariables["/mi"].stateValues.immediateValue.tree).eqls(0);

        // type 2/3

        await updateMathInputImmediateValue({
            latex: "2/3",
            name: "/mi",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/mv"].stateValues.value.tree).eqls(0);
        expect(stateVariables["/miv"].stateValues.value.tree).eqls(["/", 2, 3]);
        expect(stateVariables["/mi"].stateValues.rawRendererValue).eqls("2/3");
        expect(stateVariables["/mi"].stateValues.value.tree).eqls(0);
        expect(stateVariables["/mi"].stateValues.immediateValue.tree).eqls([
            "/",
            2,
            3,
        ]);

        // update value (e.g., hit enter)

        await updateMathInputValueToImmediateValue({
            name: "/mi",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/mv"].stateValues.value.tree).eqls(2 / 3);
        expect(stateVariables["/mv"].stateValues.valueForDisplay.tree).eqls(
            0.6666666667,
        );
        expect(stateVariables["/miv"].stateValues.value.tree).eqls(2 / 3);
        expect(stateVariables["/miv"].stateValues.valueForDisplay.tree).eqls(
            0.6666666667,
        );
        expect(stateVariables["/mi"].stateValues.rawRendererValue).eqls(
            "0.6666666667",
        );
        expect(stateVariables["/mi"].stateValues.value.tree).eqls(2 / 3);
        expect(stateVariables["/mi"].stateValues.immediateValue.tree).eqls(
            2 / 3,
        );
    });

    it("mathinput with number child, force positive integer", async () => {
        let core = await createTestCore({
            doenetML: `
  <p><mathinput name="mi">
    <clampNumber lowerValue="1" upperValue="Infinity"><integer/></clampNumber>
  </mathinput></p>
  <p>Value: $mi.value{assignNames="mv"}</p>
  <p>Immediate Value: $mi.immediateValue{assignNames="miv"}</p>
  `,
        });

        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/mv"].stateValues.value.tree).eqls(NaN);
        expect(stateVariables["/miv"].stateValues.value.tree).eqls(NaN);
        expect(stateVariables["/mi"].stateValues.rawRendererValue).eqls("");
        expect(stateVariables["/mi"].stateValues.value.tree).eqls(NaN);
        expect(stateVariables["/mi"].stateValues.immediateValue.tree).eqls(NaN);

        // type a number

        await updateMathInputImmediateValue({
            latex: "5",
            name: "/mi",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/mv"].stateValues.value.tree).eqls(NaN);
        expect(stateVariables["/miv"].stateValues.value.tree).eqls(5);
        expect(stateVariables["/mi"].stateValues.rawRendererValue).eqls("5");
        expect(stateVariables["/mi"].stateValues.value.tree).eqls(NaN);
        expect(stateVariables["/mi"].stateValues.immediateValue.tree).eqls(5);

        // update value (e.g., hit enter)

        await updateMathInputValueToImmediateValue({
            name: "/mi",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/mv"].stateValues.value.tree).eqls(5);
        expect(stateVariables["/miv"].stateValues.value.tree).eqls(5);
        expect(stateVariables["/mi"].stateValues.rawRendererValue).eqls("5");
        expect(stateVariables["/mi"].stateValues.value.tree).eqls(5);
        expect(stateVariables["/mi"].stateValues.immediateValue.tree).eqls(5);

        // type pi

        await updateMathInputImmediateValue({
            latex: "\\pi",
            name: "/mi",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/mv"].stateValues.value.tree).eqls(5);
        expect(stateVariables["/miv"].stateValues.value.tree).eqls("pi");
        expect(stateVariables["/mi"].stateValues.rawRendererValue).eqls("\\pi");
        expect(stateVariables["/mi"].stateValues.value.tree).eqls(5);
        expect(stateVariables["/mi"].stateValues.immediateValue.tree).eqls(
            "pi",
        );

        // update value (e.g., hit enter)

        await updateMathInputValueToImmediateValue({
            name: "/mi",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/mv"].stateValues.value.tree).eqls(3);
        expect(stateVariables["/miv"].stateValues.value.tree).eqls(3);
        expect(stateVariables["/mi"].stateValues.rawRendererValue).eqls("3");
        expect(stateVariables["/mi"].stateValues.value.tree).eqls(3);
        expect(stateVariables["/mi"].stateValues.immediateValue.tree).eqls(3);

        // type x
        await updateMathInputImmediateValue({
            latex: "x",
            name: "/mi",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/mv"].stateValues.value.tree).eqls(3);
        expect(stateVariables["/miv"].stateValues.value.tree).eqls("x");
        expect(stateVariables["/mi"].stateValues.rawRendererValue).eqls("x");
        expect(stateVariables["/mi"].stateValues.value.tree).eqls(3);
        expect(stateVariables["/mi"].stateValues.immediateValue.tree).eqls("x");

        // update value (e.g., hit enter)

        await updateMathInputValueToImmediateValue({
            name: "/mi",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/mv"].stateValues.value.tree).eqls(NaN);
        expect(stateVariables["/miv"].stateValues.value.tree).eqls(NaN);
        expect(stateVariables["/mi"].stateValues.rawRendererValue).eqls("");
        expect(stateVariables["/mi"].stateValues.value.tree).eqls(NaN);
        expect(stateVariables["/mi"].stateValues.immediateValue.tree).eqls(NaN);

        // type 2/3

        await updateMathInputImmediateValue({
            latex: "2/3",
            name: "/mi",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/mv"].stateValues.value.tree).eqls(NaN);
        expect(stateVariables["/miv"].stateValues.value.tree).eqls(["/", 2, 3]);
        expect(stateVariables["/mi"].stateValues.rawRendererValue).eqls("2/3");
        expect(stateVariables["/mi"].stateValues.value.tree).eqls(NaN);
        expect(stateVariables["/mi"].stateValues.immediateValue.tree).eqls([
            "/",
            2,
            3,
        ]);

        // update value (e.g., hit enter)

        await updateMathInputValueToImmediateValue({
            name: "/mi",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/mv"].stateValues.value.tree).eqls(1);
        expect(stateVariables["/miv"].stateValues.value.tree).eqls(1);
        expect(stateVariables["/mi"].stateValues.rawRendererValue).eqls("1");
        expect(stateVariables["/mi"].stateValues.value.tree).eqls(1);
        expect(stateVariables["/mi"].stateValues.immediateValue.tree).eqls(1);
    });

    it("copy raw renderer value, handle incomplete math", async () => {
        let core = await createTestCore({
            doenetML: `
  <mathinput name="mi" />
  <text name="rv" copySource="mi.rawRendererValue" />
  `,
        });

        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/mi"].stateValues.value.tree).eqls("\uff3f");
        expect(stateVariables["/mi"].stateValues.immediateValue.tree).eqls(
            "\uff3f",
        );
        expect(stateVariables["/mi"].stateValues.rawRendererValue).eqls("");
        expect(stateVariables["/rv"].stateValues.value).eqls("");

        // enter value that parses to math
        await updateMathInputValue({
            latex: "a",
            name: "/mi",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/mi"].stateValues.value.tree).eqls("a");
        expect(stateVariables["/mi"].stateValues.immediateValue.tree).eqls("a");
        expect(stateVariables["/mi"].stateValues.rawRendererValue).eqls("a");
        expect(stateVariables["/rv"].stateValues.value).eqls("a");

        // enter value that is incomplete in math

        await updateMathInputValue({
            latex: "a^{ }",
            name: "/mi",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/mi"].stateValues.value.tree).eqls([
            "^",
            "a",
            "\uff3f",
        ]);
        expect(stateVariables["/mi"].stateValues.immediateValue.tree).eqls([
            "^",
            "a",
            "\uff3f",
        ]);
        expect(stateVariables["/mi"].stateValues.rawRendererValue).eqls(
            "a^{ }",
        );
        expect(stateVariables["/rv"].stateValues.value).eqls("a^{ }");

        // still have incomplete math

        await updateMathInputValue({
            latex: "a^{bc+}",
            name: "/mi",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/mi"].stateValues.value.tree).eqls([
            "^",
            "a",
            ["+", ["*", "b", "c"], "\uff3f"],
        ]);
        expect(stateVariables["/mi"].stateValues.immediateValue.tree).eqls([
            "^",
            "a",
            ["+", ["*", "b", "c"], "\uff3f"],
        ]);
        expect(stateVariables["/mi"].stateValues.rawRendererValue).eqls(
            "a^{bc+}",
        );
        expect(stateVariables["/rv"].stateValues.value).eqls("a^{bc+}");

        // complete to valid math

        await updateMathInputValue({
            latex: "a^{bc+d}",
            name: "/mi",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/mi"].stateValues.value.tree).eqls([
            "^",
            "a",
            ["+", ["*", "b", "c"], "d"],
        ]);
        expect(stateVariables["/mi"].stateValues.immediateValue.tree).eqls([
            "^",
            "a",
            ["+", ["*", "b", "c"], "d"],
        ]);
        expect(stateVariables["/mi"].stateValues.rawRendererValue).eqls(
            "a^{bc+d}",
        );
        expect(stateVariables["/rv"].stateValues.value).eqls("a^{bc+d}");

        // incomplete math again

        await updateMathInputValue({
            latex: "a^{bc+d}-",
            name: "/mi",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/mi"].stateValues.value.tree).eqls([
            "+",
            ["^", "a", ["+", ["*", "b", "c"], "d"]],
            ["-", "\uff3f"],
        ]);
        expect(stateVariables["/mi"].stateValues.immediateValue.tree).eqls([
            "+",
            ["^", "a", ["+", ["*", "b", "c"], "d"]],
            ["-", "\uff3f"],
        ]);
        expect(stateVariables["/mi"].stateValues.rawRendererValue).eqls(
            "a^{bc+d}-",
        );
        expect(stateVariables["/rv"].stateValues.value).eqls("a^{bc+d}-");

        // complete to valid math again

        await updateMathInputValue({
            latex: "a^{bc+d}-e",
            name: "/mi",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/mi"].stateValues.value.tree).eqls([
            "+",
            ["^", "a", ["+", ["*", "b", "c"], "d"]],
            ["-", "e"],
        ]);
        expect(stateVariables["/mi"].stateValues.immediateValue.tree).eqls([
            "+",
            ["^", "a", ["+", ["*", "b", "c"], "d"]],
            ["-", "e"],
        ]);
        expect(stateVariables["/mi"].stateValues.rawRendererValue).eqls(
            "a^{bc+d}-e",
        );
        expect(stateVariables["/rv"].stateValues.value).eqls("a^{bc+d}-e");
    });

    it("copy raw renderer value, handle invalid math", async () => {
        let core = await createTestCore({
            doenetML: `
  <mathinput name="mi" />
  <text name="rv" copyprop="rawRendererValue" copySource="mi" />
  `,
        });

        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/mi"].stateValues.value.tree).eqls("\uff3f");
        expect(stateVariables["/mi"].stateValues.immediateValue.tree).eqls(
            "\uff3f",
        );
        expect(stateVariables["/mi"].stateValues.rawRendererValue).eqls("");
        expect(stateVariables["/rv"].stateValues.value).eqls("");

        // enter value that parses to math
        await updateMathInputValue({
            latex: "a",
            name: "/mi",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/mi"].stateValues.value.tree).eqls("a");
        expect(stateVariables["/mi"].stateValues.immediateValue.tree).eqls("a");
        expect(stateVariables["/mi"].stateValues.rawRendererValue).eqls("a");
        expect(stateVariables["/rv"].stateValues.value).eqls("a");

        // enter value that is error in math

        await updateMathInputValue({
            latex: "a@",
            name: "/mi",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/mi"].stateValues.value.tree).eqls("\uff3f");
        expect(stateVariables["/mi"].stateValues.immediateValue.tree).eqls(
            "\uff3f",
        );
        expect(stateVariables["/mi"].stateValues.rawRendererValue).eqls("a@");
        expect(stateVariables["/rv"].stateValues.value).eqls("a@");

        // still have error in math

        await updateMathInputValue({
            latex: "ab+@",
            name: "/mi",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/mi"].stateValues.value.tree).eqls("\uff3f");
        expect(stateVariables["/mi"].stateValues.immediateValue.tree).eqls(
            "\uff3f",
        );
        expect(stateVariables["/mi"].stateValues.rawRendererValue).eqls("ab+@");
        expect(stateVariables["/rv"].stateValues.value).eqls("ab+@");

        // make valid math

        await updateMathInputValue({
            latex: "ab+c",
            name: "/mi",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/mi"].stateValues.value.tree).eqls([
            "+",
            ["*", "a", "b"],
            "c",
        ]);
        expect(stateVariables["/mi"].stateValues.immediateValue.tree).eqls([
            "+",
            ["*", "a", "b"],
            "c",
        ]);
        expect(stateVariables["/mi"].stateValues.rawRendererValue).eqls("ab+c");
        expect(stateVariables["/rv"].stateValues.value).eqls("ab+c");
    });

    it("parse scientific notation", async () => {
        let core = await createTestCore({
            doenetML: `
  <p><mathinput name="mi1" prefill="5E+1" /> <math name="m1" copySource="mi1" /></p>
  <p><mathinput name="mi2" prefill="5E+1" parseScientificNotation /> <math name="m2" copySource="mi2" /></p>

  `,
        });

        let stateVariables = await returnAllStateVariables(core);
        expect(
            cleanLatex(stateVariables["/mi1"].stateValues.rawRendererValue),
        ).eq("5E+1");
        expect(stateVariables["/mi1"].stateValues.value.tree).eqls([
            "+",
            ["*", 5, "E"],
            1,
        ]);
        expect(stateVariables["/m1"].stateValues.value.tree).eqls([
            "+",
            ["*", 5, "E"],
            1,
        ]);
        expect(
            cleanLatex(stateVariables["/mi1"].stateValues.rawRendererValue),
        ).eq("5E+1");
        expect(stateVariables["/mi2"].stateValues.value.tree).eqls(50);
        expect(stateVariables["/m2"].stateValues.value.tree).eqls(50);

        await updateMathInputValue({
            latex: "2x-3E+2",
            name: "/mi1",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(
            cleanLatex(stateVariables["/mi1"].stateValues.rawRendererValue),
        ).eq("2x-3E+2");
        expect(stateVariables["/mi1"].stateValues.value.tree).eqls([
            "+",
            ["*", 2, "x"],
            ["-", ["*", 3, "E"]],
            2,
        ]);
        expect(stateVariables["/m1"].stateValues.value.tree).eqls([
            "+",
            ["*", 2, "x"],
            ["-", ["*", 3, "E"]],
            2,
        ]);

        await updateMathInputValue({
            latex: "2x-3E+2",
            name: "/mi2",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(
            cleanLatex(stateVariables["/mi2"].stateValues.rawRendererValue),
        ).eq("2x-3E+2");
        expect(stateVariables["/mi2"].stateValues.value.tree).eqls([
            "+",
            ["*", 2, "x"],
            -300,
        ]);
        expect(stateVariables["/m2"].stateValues.value.tree).eqls([
            "+",
            ["*", 2, "x"],
            -300,
        ]);
    });

    it("remove strings", async () => {
        let core = await createTestCore({
            doenetML: `
    <mathinput name="mi1" removeStrings="," />
    <mathinput name="mi2" removeStrings="$ %" />
    <mathinput name="mi3" removeStrings=", $ % dx" />
  `,
        });

        let stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/mi1"].stateValues.value.tree).eqls("\uff3f");
        expect(stateVariables["/mi2"].stateValues.value.tree).eqls("\uff3f");
        expect(stateVariables["/mi3"].stateValues.value.tree).eqls("\uff3f");

        await updateMathInputValue({
            latex: "12,345",
            name: "/mi1",
            core,
        });
        await updateMathInputValue({
            latex: "12,345",
            name: "/mi2",
            core,
        });
        await updateMathInputValue({
            latex: "12,345",
            name: "/mi3",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/mi1"].stateValues.value.tree).eq(12345);
        expect(stateVariables["/mi2"].stateValues.value.tree).eqls([
            "list",
            12,
            345,
        ]);
        expect(stateVariables["/mi3"].stateValues.value.tree).eq(12345);

        await updateMathInputValue({
            latex: "\\$45.23",
            name: "/mi1",
            core,
        });
        await updateMathInputValue({
            latex: "\\$45.23",
            name: "/mi2",
            core,
        });
        await updateMathInputValue({
            latex: "\\$45.23",
            name: "/mi3",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/mi1"].stateValues.value.tree).eqls([
            "unit",
            "$",
            45.23,
        ]);
        expect(stateVariables["/mi2"].stateValues.value.tree).eq(45.23);
        expect(stateVariables["/mi3"].stateValues.value.tree).eq(45.23);

        await updateMathInputValue({
            latex: "78\\%",
            name: "/mi1",
            core,
        });
        await updateMathInputValue({
            latex: "78\\%",
            name: "/mi2",
            core,
        });
        await updateMathInputValue({
            latex: "78\\%",
            name: "/mi3",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/mi1"].stateValues.value.tree).eqls([
            "unit",
            78,
            "%",
        ]);
        expect(stateVariables["/mi2"].stateValues.value.tree).eq(78);
        expect(stateVariables["/mi3"].stateValues.value.tree).eq(78);

        await updateMathInputValue({
            latex: "\\$34,000\\%dx",
            name: "/mi1",
            core,
        });
        await updateMathInputValue({
            latex: "\\$34,000\\%dx",
            name: "/mi2",
            core,
        });
        await updateMathInputValue({
            latex: "\\$34,000\\%dx",
            name: "/mi3",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/mi1"].stateValues.value.tree).eqls([
            "unit",
            "$",
            ["*", ["unit", 34000, "%"], "d", "x"],
        ]);
        expect(stateVariables["/mi2"].stateValues.value.tree).eqls([
            "list",
            34,
            ["*", 0, "d", "x"],
        ]);
        expect(stateVariables["/mi3"].stateValues.value.tree).eq(34000);
    });

    it("mathinput updates not messed up with invalid child logic containing a composite", async () => {
        let core = await createTestCore({
            doenetML: `
      <ol>
        <math name="m">x</math> $m
        <li><mathinput name="mi" /> <math name="m2" copySource="mi" /></li>
      </ol>
  `,
        });

        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/m"].stateValues.value.tree).eqls("x");

        await updateMathInputValue({
            latex: "\\sqrt{4}",
            name: "/mi",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/mi"].stateValues.value.tree).eqls([
            "apply",
            "sqrt",
            4,
        ]);
        expect(stateVariables["/m2"].stateValues.value.tree).eqls([
            "apply",
            "sqrt",
            4,
        ]);
    });

    it("valueChanged", async () => {
        let doenetML = `
    <p><mathInput name="mi1" /> <math copySource="mi1" name="mi1a" /> <boolean copysource="mi1.valueChanged" name="mi1changed" /> <math copySource="mi1.immediateValue" name="mi1iva" /> <boolean copysource="mi1.immediateValueChanged" name="mi1ivchanged" /></p>
    <p><mathInput name="mi2" prefill="x" /> <math copySource="mi2" name="mi2a" /> <boolean copysource="mi2.valueChanged" name="mi2changed" /> <math copySource="mi2.immediateValue" name="mi2iva" /> <boolean copysource="mi2.immediateValueChanged" name="mi2ivchanged" /></p>
    <p><mathInput name="mi3" bindValueTo="$mi1" /> <math copySource="mi3" name="mi3a" /> <boolean copysource="mi3.valueChanged" name="mi3changed" /> <math copySource="mi3.immediateValue" name="mi3iva" /> <boolean copysource="mi3.immediateValueChanged" name="mi3ivchanged" /></p>
    <p><mathInput name="mi4">$mi2.immediateValue</mathInput> <math copySource="mi4" name="mi4a" /> <boolean copysource="mi4.valueChanged" name="mi4changed" /> <math copySource="mi4.immediateValue" name="mi4iva" /> <boolean copysource="mi4.immediateValueChanged" name="mi4ivchanged" /></p>

    `;

        async function check_items(
            [mi1, mi2, mi3, mi4]: [
                mi1: string,
                mi2: string,
                mi3: string,
                mi4: string,
            ],
            [mi1iv, mi2iv, mi3iv, mi4iv]: [
                mi1iv: string,
                mi2iv: string,
                mi3iv: string,
                mi4iv: string,
            ],
            [mi1changed, mi2changed, mi3changed, mi4changed]: [
                mi1changed: boolean,
                mi2changed: boolean,
                mi3changed: boolean,
                mi4changed: boolean,
            ],
            [mi1ivchanged, mi2ivchanged, mi3ivchanged, mi4ivchanged]: [
                mi1ivchanged: boolean,
                mi2ivchanged: boolean,
                mi3ivchanged: boolean,
                mi4ivchanged: boolean,
            ],
        ) {
            const stateVariables = await returnAllStateVariables(core);
            expect(stateVariables["/mi1"].stateValues.value.tree).eq(mi1);
            expect(stateVariables["/mi2"].stateValues.value.tree).eq(mi2);
            expect(stateVariables["/mi3"].stateValues.value.tree).eq(mi3);
            expect(stateVariables["/mi4"].stateValues.value.tree).eq(mi4);

            expect(stateVariables["/mi1a"].stateValues.value.tree).eq(mi1);
            expect(stateVariables["/mi2a"].stateValues.value.tree).eq(mi2);
            expect(stateVariables["/mi3a"].stateValues.value.tree).eq(mi3);
            expect(stateVariables["/mi4a"].stateValues.value.tree).eq(mi4);

            expect(stateVariables["/mi1iva"].stateValues.value.tree).eq(mi1iv);
            expect(stateVariables["/mi2iva"].stateValues.value.tree).eq(mi2iv);
            expect(stateVariables["/mi3iva"].stateValues.value.tree).eq(mi3iv);
            expect(stateVariables["/mi4iva"].stateValues.value.tree).eq(mi4iv);

            expect(stateVariables["/mi1changed"].stateValues.value).eq(
                mi1changed,
            );
            expect(stateVariables["/mi2changed"].stateValues.value).eq(
                mi2changed,
            );
            expect(stateVariables["/mi3changed"].stateValues.value).eq(
                mi3changed,
            );
            expect(stateVariables["/mi4changed"].stateValues.value).eq(
                mi4changed,
            );

            expect(stateVariables["/mi1ivchanged"].stateValues.value).eq(
                mi1ivchanged,
            );
            expect(stateVariables["/mi2ivchanged"].stateValues.value).eq(
                mi2ivchanged,
            );
            expect(stateVariables["/mi3ivchanged"].stateValues.value).eq(
                mi3ivchanged,
            );
            expect(stateVariables["/mi4ivchanged"].stateValues.value).eq(
                mi4ivchanged,
            );
        }

        let core = await createTestCore({
            doenetML,
        });

        let mi1 = "\uff3f",
            mi2 = "x",
            mi3 = "\uff3f",
            mi4 = "x";
        let mi1iv = "\uff3f",
            mi2iv = "x",
            mi3iv = "\uff3f",
            mi4iv = "x";
        let mi1changed = false,
            mi2changed = false,
            mi3changed = false,
            mi4changed = false;
        let mi1ivchanged = false,
            mi2ivchanged = false,
            mi3ivchanged = false,
            mi4ivchanged = false;

        await check_items(
            [mi1, mi2, mi3, mi4],
            [mi1iv, mi2iv, mi3iv, mi4iv],
            [mi1changed, mi2changed, mi3changed, mi4changed],
            [mi1ivchanged, mi2ivchanged, mi3ivchanged, mi4ivchanged],
        );

        // type in first marks only first immediate value as changed
        mi1iv = "y";
        mi1ivchanged = true;
        await updateMathInputImmediateValue({
            latex: mi1iv,
            name: "/mi1",
            core,
        });

        await check_items(
            [mi1, mi2, mi3, mi4],
            [mi1iv, mi2iv, mi3iv, mi4iv],
            [mi1changed, mi2changed, mi3changed, mi4changed],
            [mi1ivchanged, mi2ivchanged, mi3ivchanged, mi4ivchanged],
        );

        // update value in first marks only first value as changed
        mi1 = mi3 = mi3iv = mi1iv;
        mi1changed = true;
        await updateMathInputValueToImmediateValue({
            name: "/mi1",
            core,
        });

        await check_items(
            [mi1, mi2, mi3, mi4],
            [mi1iv, mi2iv, mi3iv, mi4iv],
            [mi1changed, mi2changed, mi3changed, mi4changed],
            [mi1ivchanged, mi2ivchanged, mi3ivchanged, mi4ivchanged],
        );

        // type in second marks only second immediate value as changed
        mi4 = mi4iv = mi2iv = "z";
        mi2ivchanged = true;
        await updateMathInputImmediateValue({
            latex: mi2iv,
            name: "/mi2",
            core,
        });

        await check_items(
            [mi1, mi2, mi3, mi4],
            [mi1iv, mi2iv, mi3iv, mi4iv],
            [mi1changed, mi2changed, mi3changed, mi4changed],
            [mi1ivchanged, mi2ivchanged, mi3ivchanged, mi4ivchanged],
        );

        // update value in second marks only second value as changed
        mi2 = mi2iv;
        mi2changed = true;
        await updateMathInputValueToImmediateValue({
            name: "/mi2",
            core,
        });

        await check_items(
            [mi1, mi2, mi3, mi4],
            [mi1iv, mi2iv, mi3iv, mi4iv],
            [mi1changed, mi2changed, mi3changed, mi4changed],
            [mi1ivchanged, mi2ivchanged, mi3ivchanged, mi4ivchanged],
        );

        // type in third marks third immediate value as changed
        mi3iv = "a";
        mi3ivchanged = true;
        await updateMathInputImmediateValue({
            latex: mi3iv,
            name: "/mi3",
            core,
        });

        await check_items(
            [mi1, mi2, mi3, mi4],
            [mi1iv, mi2iv, mi3iv, mi4iv],
            [mi1changed, mi2changed, mi3changed, mi4changed],
            [mi1ivchanged, mi2ivchanged, mi3ivchanged, mi4ivchanged],
        );

        // update value in third marks third value as changed
        mi1 = mi1iv = mi3 = mi3iv;
        mi3changed = true;

        await updateMathInputValueToImmediateValue({
            name: "/mi3",
            core,
        });

        await check_items(
            [mi1, mi2, mi3, mi4],
            [mi1iv, mi2iv, mi3iv, mi4iv],
            [mi1changed, mi2changed, mi3changed, mi4changed],
            [mi1ivchanged, mi2ivchanged, mi3ivchanged, mi4ivchanged],
        );

        // type in fourth marks fourth immediate value as changed
        mi4iv = "b";
        mi4ivchanged = true;
        await updateMathInputImmediateValue({
            latex: mi4iv,
            name: "/mi4",
            core,
        });

        await check_items(
            [mi1, mi2, mi3, mi4],
            [mi1iv, mi2iv, mi3iv, mi4iv],
            [mi1changed, mi2changed, mi3changed, mi4changed],
            [mi1ivchanged, mi2ivchanged, mi3ivchanged, mi4ivchanged],
        );

        // update value in fourth marks fourth value as changed
        mi2 = mi2iv = mi4 = mi4iv;
        mi4changed = true;
        await updateMathInputValueToImmediateValue({
            name: "/mi4",
            core,
        });

        await check_items(
            [mi1, mi2, mi3, mi4],
            [mi1iv, mi2iv, mi3iv, mi4iv],
            [mi1changed, mi2changed, mi3changed, mi4changed],
            [mi1ivchanged, mi2ivchanged, mi3ivchanged, mi4ivchanged],
        );

        // reload

        core = await createTestCore({
            doenetML,
        });

        mi1 = "\uff3f";
        mi2 = "x";
        mi3 = "\uff3f";
        mi4 = "x";
        mi1iv = "\uff3f";
        mi2iv = "x";
        mi3iv = "\uff3f";
        mi4iv = "x";
        mi1changed = false;
        mi2changed = false;
        mi3changed = false;
        mi4changed = false;
        mi1ivchanged = false;
        mi2ivchanged = false;
        mi3ivchanged = false;
        mi4ivchanged = false;

        await check_items(
            [mi1, mi2, mi3, mi4],
            [mi1iv, mi2iv, mi3iv, mi4iv],
            [mi1changed, mi2changed, mi3changed, mi4changed],
            [mi1ivchanged, mi2ivchanged, mi3ivchanged, mi4ivchanged],
        );

        // type in third marks only third immediate value as changed
        mi3iv = "y";
        mi3ivchanged = true;
        await updateMathInputImmediateValue({
            latex: mi3iv,
            name: "/mi3",
            core,
        });
        await check_items(
            [mi1, mi2, mi3, mi4],
            [mi1iv, mi2iv, mi3iv, mi4iv],
            [mi1changed, mi2changed, mi3changed, mi4changed],
            [mi1ivchanged, mi2ivchanged, mi3ivchanged, mi4ivchanged],
        );

        // update value in third marks first and third value/immediateValue as changed
        mi1 = mi1iv = mi3 = mi3iv;
        mi1changed = true;
        mi1ivchanged = true;
        mi3changed = true;

        await updateMathInputValueToImmediateValue({
            name: "/mi3",
            core,
        });
        await check_items(
            [mi1, mi2, mi3, mi4],
            [mi1iv, mi2iv, mi3iv, mi4iv],
            [mi1changed, mi2changed, mi3changed, mi4changed],
            [mi1ivchanged, mi2ivchanged, mi3ivchanged, mi4ivchanged],
        );

        // type in fourth marks only fourth immediate value as changed
        mi4iv = "z";
        mi4ivchanged = true;

        await updateMathInputImmediateValue({
            latex: mi4iv,
            name: "/mi4",
            core,
        });
        await check_items(
            [mi1, mi2, mi3, mi4],
            [mi1iv, mi2iv, mi3iv, mi4iv],
            [mi1changed, mi2changed, mi3changed, mi4changed],
            [mi1ivchanged, mi2ivchanged, mi3ivchanged, mi4ivchanged],
        );

        // update value in fourth marks third and fourth value/immediateValue as changed
        mi2 = mi2iv = mi4 = mi4iv;
        mi2changed = true;
        mi2ivchanged = true;
        mi4changed = true;
        await updateMathInputValueToImmediateValue({
            name: "/mi4",
            core,
        });
        await check_items(
            [mi1, mi2, mi3, mi4],
            [mi1iv, mi2iv, mi3iv, mi4iv],
            [mi1changed, mi2changed, mi3changed, mi4changed],
            [mi1ivchanged, mi2ivchanged, mi3ivchanged, mi4ivchanged],
        );
    });

    it("math input with label", async () => {
        let core = await createTestCore({
            doenetML: `
    <p><mathInput name="mi1" ><label>Type something</label></mathInput></p>
    <p><mathInput name="mi2"><label>Hello <math>a/b</math></label></mathInput></p>

     `,
        });

        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/mi1"].stateValues.label).eq("Type something");
        expect(stateVariables["/mi2"].stateValues.label).eq(
            "Hello \\(\\frac{a}{b}\\)",
        );
    });

    it("bound to fixed math", async () => {
        // Verify that fixed bug
        // where deleting the mathinput contents wasn't restored on enter
        let core = await createTestCore({
            doenetML: `
    <math name="m" fixed>1</math>
    <p><mathinput name="mi1">$m</mathinput>
    <math name="mi1v" copySource="mi1.value" />,
    <math name="mi1iv" copySource="mi1.immediateValue" />,
    <text name="mi1rv" copySource="mi1.rawRendererValue" /></p>
    <p><mathinput name="mi2" bindValueTo="$m" />
    <math name="mi2v" copySource="mi2.value" />,
    <math name="mi2iv" copySource="mi2.immediateValue" />,
    <text name="mi2rv" copySource="mi2.rawRendererValue" /></p>
     `,
        });

        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/m"].stateValues.value.tree).eq(1);
        expect(stateVariables["/mi1"].stateValues.value.tree).eq(1);
        expect(stateVariables["/mi1"].stateValues.immediateValue.tree).eq(1);
        expect(stateVariables["/mi1v"].stateValues.value.tree).eq(1);
        expect(stateVariables["/mi1iv"].stateValues.value.tree).eq(1);
        expect(stateVariables["/mi1rv"].stateValues.value).eq("1");
        expect(stateVariables["/mi2"].stateValues.value.tree).eq(1);
        expect(stateVariables["/mi2"].stateValues.immediateValue.tree).eq(1);
        expect(stateVariables["/mi2v"].stateValues.value.tree).eq(1);
        expect(stateVariables["/mi2iv"].stateValues.value.tree).eq(1);
        expect(stateVariables["/mi2rv"].stateValues.value).eq("1");

        // Delete contents from mathinput 1
        await updateMathInputImmediateValue({
            latex: "",
            name: "/mi1",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/m"].stateValues.value.tree).eq(1);
        expect(stateVariables["/mi1"].stateValues.value.tree).eq(1);
        expect(stateVariables["/mi1"].stateValues.immediateValue.tree).eq(
            "\uff3f",
        );
        expect(stateVariables["/mi1v"].stateValues.value.tree).eq(1);
        expect(stateVariables["/mi1iv"].stateValues.value.tree).eq("\uff3f");
        expect(stateVariables["/mi1rv"].stateValues.value).eq("");
        expect(stateVariables["/mi2"].stateValues.value.tree).eq(1);
        expect(stateVariables["/mi2"].stateValues.immediateValue.tree).eq(1);
        expect(stateVariables["/mi2v"].stateValues.value.tree).eq(1);
        expect(stateVariables["/mi2iv"].stateValues.value.tree).eq(1);
        expect(stateVariables["/mi2rv"].stateValues.value).eq("1");

        // Contents of mathinput 1 restored on enter

        await updateMathInputValueToImmediateValue({
            name: "/mi1",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/m"].stateValues.value.tree).eq(1);
        expect(stateVariables["/mi1"].stateValues.value.tree).eq(1);
        expect(stateVariables["/mi1"].stateValues.immediateValue.tree).eq(1);
        expect(stateVariables["/mi1v"].stateValues.value.tree).eq(1);
        expect(stateVariables["/mi1iv"].stateValues.value.tree).eq(1);
        expect(stateVariables["/mi1rv"].stateValues.value).eq("1");
        expect(stateVariables["/mi2"].stateValues.value.tree).eq(1);
        expect(stateVariables["/mi2"].stateValues.immediateValue.tree).eq(1);
        expect(stateVariables["/mi2v"].stateValues.value.tree).eq(1);
        expect(stateVariables["/mi2iv"].stateValues.value.tree).eq(1);
        expect(stateVariables["/mi2rv"].stateValues.value).eq("1");

        // Add contents to mathinput 1

        await updateMathInputImmediateValue({
            latex: "12",
            name: "/mi1",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/m"].stateValues.value.tree).eq(1);
        expect(stateVariables["/mi1"].stateValues.value.tree).eq(1);
        expect(stateVariables["/mi1"].stateValues.immediateValue.tree).eq(12);
        expect(stateVariables["/mi1v"].stateValues.value.tree).eq(1);
        expect(stateVariables["/mi1iv"].stateValues.value.tree).eq(12);
        expect(stateVariables["/mi1rv"].stateValues.value).eq("12");
        expect(stateVariables["/mi2"].stateValues.value.tree).eq(1);
        expect(stateVariables["/mi2"].stateValues.immediateValue.tree).eq(1);
        expect(stateVariables["/mi2v"].stateValues.value.tree).eq(1);
        expect(stateVariables["/mi2iv"].stateValues.value.tree).eq(1);
        expect(stateVariables["/mi2rv"].stateValues.value).eq("1");

        // Contents of mathinput 1 restored on enter

        await updateMathInputValueToImmediateValue({
            name: "/mi1",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/m"].stateValues.value.tree).eq(1);
        expect(stateVariables["/mi1"].stateValues.value.tree).eq(1);
        expect(stateVariables["/mi1"].stateValues.immediateValue.tree).eq(1);
        expect(stateVariables["/mi1v"].stateValues.value.tree).eq(1);
        expect(stateVariables["/mi1iv"].stateValues.value.tree).eq(1);
        expect(stateVariables["/mi1rv"].stateValues.value).eq("1");
        expect(stateVariables["/mi2"].stateValues.value.tree).eq(1);
        expect(stateVariables["/mi2"].stateValues.immediateValue.tree).eq(1);
        expect(stateVariables["/mi2v"].stateValues.value.tree).eq(1);
        expect(stateVariables["/mi2iv"].stateValues.value.tree).eq(1);
        expect(stateVariables["/mi2rv"].stateValues.value).eq("1");

        // Delete contents from mathinput 2

        await updateMathInputImmediateValue({
            latex: "",
            name: "/mi2",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/m"].stateValues.value.tree).eq(1);
        expect(stateVariables["/mi1"].stateValues.value.tree).eq(1);
        expect(stateVariables["/mi1"].stateValues.immediateValue.tree).eq(1);
        expect(stateVariables["/mi1v"].stateValues.value.tree).eq(1);
        expect(stateVariables["/mi1iv"].stateValues.value.tree).eq(1);
        expect(stateVariables["/mi1rv"].stateValues.value).eq("1");
        expect(stateVariables["/mi2"].stateValues.value.tree).eq(1);
        expect(stateVariables["/mi2"].stateValues.immediateValue.tree).eq(
            "\uff3f",
        );
        expect(stateVariables["/mi2v"].stateValues.value.tree).eq(1);
        expect(stateVariables["/mi2iv"].stateValues.value.tree).eq("\uff3f");
        expect(stateVariables["/mi2rv"].stateValues.value).eq("");

        // Contents of mathinput 2 restored on enter

        await updateMathInputValueToImmediateValue({
            name: "/mi2",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/m"].stateValues.value.tree).eq(1);
        expect(stateVariables["/mi1"].stateValues.value.tree).eq(1);
        expect(stateVariables["/mi1"].stateValues.immediateValue.tree).eq(1);
        expect(stateVariables["/mi1v"].stateValues.value.tree).eq(1);
        expect(stateVariables["/mi1iv"].stateValues.value.tree).eq(1);
        expect(stateVariables["/mi1rv"].stateValues.value).eq("1");
        expect(stateVariables["/mi2"].stateValues.value.tree).eq(1);
        expect(stateVariables["/mi2"].stateValues.immediateValue.tree).eq(1);
        expect(stateVariables["/mi2v"].stateValues.value.tree).eq(1);
        expect(stateVariables["/mi2iv"].stateValues.value.tree).eq(1);
        expect(stateVariables["/mi2rv"].stateValues.value).eq("1");

        // Add contents to mathinput 2

        await updateMathInputImmediateValue({
            latex: "12",
            name: "/mi2",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/m"].stateValues.value.tree).eq(1);
        expect(stateVariables["/mi1"].stateValues.value.tree).eq(1);
        expect(stateVariables["/mi1"].stateValues.immediateValue.tree).eq(1);
        expect(stateVariables["/mi1v"].stateValues.value.tree).eq(1);
        expect(stateVariables["/mi1iv"].stateValues.value.tree).eq(1);
        expect(stateVariables["/mi1rv"].stateValues.value).eq("1");
        expect(stateVariables["/mi2"].stateValues.value.tree).eq(1);
        expect(stateVariables["/mi2"].stateValues.immediateValue.tree).eq(12);
        expect(stateVariables["/mi2v"].stateValues.value.tree).eq(1);
        expect(stateVariables["/mi2iv"].stateValues.value.tree).eq(12);
        expect(stateVariables["/mi2rv"].stateValues.value).eq("12");

        // Contents of mathinput 2 restored on enter

        await updateMathInputValueToImmediateValue({
            name: "/mi2",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/m"].stateValues.value.tree).eq(1);
        expect(stateVariables["/mi1"].stateValues.value.tree).eq(1);
        expect(stateVariables["/mi1"].stateValues.immediateValue.tree).eq(1);
        expect(stateVariables["/mi1v"].stateValues.value.tree).eq(1);
        expect(stateVariables["/mi1iv"].stateValues.value.tree).eq(1);
        expect(stateVariables["/mi1rv"].stateValues.value).eq("1");
        expect(stateVariables["/mi2"].stateValues.value.tree).eq(1);
        expect(stateVariables["/mi2"].stateValues.immediateValue.tree).eq(1);
        expect(stateVariables["/mi2v"].stateValues.value.tree).eq(1);
        expect(stateVariables["/mi2iv"].stateValues.value.tree).eq(1);
        expect(stateVariables["/mi2rv"].stateValues.value).eq("1");
    });

    it("mathInputs specifying point", async () => {
        // two mathInputs specifying the x and y coordinate of a single point
        // demonstrates two-way data binding

        let core = await createTestCore({
            doenetML: `
    <mathInput name="x" prefill="1"/>
    <mathInput name="y" prefill="2"/>
    <graph>
    <point name="P">($x,$y)</point>
    </graph>
    `,
        });

        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/x"].stateValues.value.tree).eq(1);
        expect(stateVariables["/y"].stateValues.value.tree).eq(2);
        expect(stateVariables["/P"].stateValues.xs[0].tree).eq(1);
        expect(stateVariables["/P"].stateValues.xs[1].tree).eq(2);

        // Enter -3 for x
        await updateMathInputValue({ latex: "-3", name: "/x", core });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/x"].stateValues.value.tree).eq(-3);
        expect(stateVariables["/y"].stateValues.value.tree).eq(2);
        expect(stateVariables["/P"].stateValues.xs[0].tree).eq(-3);
        expect(stateVariables["/P"].stateValues.xs[1].tree).eq(2);

        // Enter -4 for y
        await updateMathInputValue({ latex: "-4", name: "/y", core });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/x"].stateValues.value.tree).eq(-3);
        expect(stateVariables["/y"].stateValues.value.tree).eq(-4);
        expect(stateVariables["/P"].stateValues.xs[0].tree).eq(-3);
        expect(stateVariables["/P"].stateValues.xs[1].tree).eq(-4);

        // move point to (5,-6)
        await movePoint({ name: "/P", x: 5, y: -6, core });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/x"].stateValues.value.tree).eq(5);
        expect(stateVariables["/y"].stateValues.value.tree).eq(-6);
        expect(stateVariables["/P"].stateValues.xs[0].tree).eq(5);
        expect(stateVariables["/P"].stateValues.xs[1].tree).eq(-6);
    });

    it("mathInput specifying point -- non-invertible x", async () => {
        // x-coordinate is the square of the first mathInput
        // therefore, cannot invert from x-coordinate to mathInput
        // so that cannot change x-coordinate directly by dragging point

        let core = await createTestCore({
            doenetML: `
    <mathInput name="x" prefill="3"/>
    <mathInput name="y" prefill="2"/>
    <graph>
    <point name="P">($x^2,$y)</point>
    </graph>
    `,
        });

        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/x"].stateValues.value.tree).eq(3);
        expect(stateVariables["/y"].stateValues.value.tree).eq(2);
        expect(stateVariables["/P"].stateValues.xs[0].tree).eq(9);
        expect(stateVariables["/P"].stateValues.xs[1].tree).eq(2);

        // Enter -1.2 for x
        await updateMathInputValue({
            latex: "-1.2",
            name: "/x",
            core,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/x"].stateValues.value.tree).eq(-1.2);
        expect(stateVariables["/y"].stateValues.value.tree).eq(2);
        expect(stateVariables["/P"].stateValues.xs[0].tree).eq(1.44);
        expect(stateVariables["/P"].stateValues.xs[1].tree).eq(2);

        // try to move point to (5,6), only y changes
        await movePoint({ name: "/P", x: 5, y: 6, core });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/x"].stateValues.value.tree).eq(-1.2);
        expect(stateVariables["/y"].stateValues.value.tree).eq(6);
        expect(stateVariables["/P"].stateValues.xs[0].tree).eq(1.44);
        expect(stateVariables["/P"].stateValues.xs[1].tree).eq(6);
    });

    it("mathInput specifying point -- product", async () => {
        // x-coordinate of a point is product of mathInputs
        // Since cannot determine both factors from the product
        // the transformation is non-invertible
        // and cannot directly change the x-coordinate of point by dragging

        let core = await createTestCore({
            doenetML: `
    <mathInput name="a" prefill="-3"/>
    <mathInput name="b" prefill="2"/>
    <graph>
        <point name="P">($a$b, -7)</point>
    </graph>
   `,
        });

        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/a"].stateValues.value.tree).eq(-3);
        expect(stateVariables["/b"].stateValues.value.tree).eq(2);
        expect(stateVariables["/P"].stateValues.xs[0].tree).eq(-6);
        expect(stateVariables["/P"].stateValues.xs[1].tree).eq(-7);

        // Enter -1.5 for a
        await updateMathInputValue({
            latex: "-1.5",
            name: "/a",
            core,
        });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/a"].stateValues.value.tree).eq(-1.5);
        expect(stateVariables["/b"].stateValues.value.tree).eq(2);
        expect(stateVariables["/P"].stateValues.xs[0].tree).eq(-3);
        expect(stateVariables["/P"].stateValues.xs[1].tree).eq(-7);

        // try to move point to (5,6), only y changes
        await movePoint({ name: "/P", x: 5, y: 6, core });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/a"].stateValues.value.tree).eq(-1.5);
        expect(stateVariables["/b"].stateValues.value.tree).eq(2);
        expect(stateVariables["/P"].stateValues.xs[0].tree).eq(-3);
        expect(stateVariables["/P"].stateValues.xs[1].tree).eq(6);
    });

    it("mathInput specifying point -- product, make invertible", async () => {
        // x-coordinate of a point is product of mathInputs
        // Since one factor is marked with modifyIndirectly=false,
        // we leave that factor constant when changing the x-coordinate by dragging
        // and modify the other factor to match the new x-coordinate

        let core = await createTestCore({
            doenetML: `
    <mathInput name="a" prefill="-3"/>
    <mathInput name="b" prefill="2"/>
    <graph>
    <point name="P">($a$b{modifyIndirectly="false"}, -7)</point>
    </graph>
    `,
        });

        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/a"].stateValues.value.tree).eq(-3);
        expect(stateVariables["/b"].stateValues.value.tree).eq(2);
        expect(stateVariables["/P"].stateValues.xs[0].tree).eq(-6);
        expect(stateVariables["/P"].stateValues.xs[1].tree).eq(-7);

        // Enter -1.5 for a
        await updateMathInputValue({
            latex: "-1.5",
            name: "/a",
            core,
        });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/a"].stateValues.value.tree).eq(-1.5);
        expect(stateVariables["/b"].stateValues.value.tree).eq(2);
        expect(stateVariables["/P"].stateValues.xs[0].tree).eq(-3);
        expect(stateVariables["/P"].stateValues.xs[1].tree).eq(-7);

        // try to move point to (5,6)
        await movePoint({ name: "/P", x: 5, y: 6, core });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/a"].stateValues.value.tree).eqls(["/", 5, 2]);
        expect(stateVariables["/b"].stateValues.value.tree).eq(2);
        expect(stateVariables["/P"].stateValues.xs[0].tree).eq(5);
        expect(stateVariables["/P"].stateValues.xs[1].tree).eq(6);
    });

    it("vector and matrix components", async () => {
        let core = await createTestCore({
            doenetML: `
    <p>Value: <mathInput name="mi" /></p>
    <p>Index: <mathInput name="i" prefill="1" /></p>

    <p name="p1">Number of dimensions: $mi.numDimensions</p>
    <p name="p2">x: $mi.x</p>
    <p name="p3">y: $mi.y</p>
    <p name="p4">z: $mi.z</p>
    <p name="p5">x1: $mi.x1</p>
    <p name="p6">x2: $mi.x2</p>
    <p name="p7">x3: $mi.x3</p>
    <p name="p8">x4: $mi.x4</p>
    <p name="p9">v: $mi.vector</p>
    <p name="p10">v[$i]: $mi.vector[$i]</p>
    <p name="p11">Matrix size: $mi.matrixSize</p>
    <p name="p12">Number of rows: $mi.numRows</p>
    <p name="p13">Number of columns: $mi.numColumns</p>
    <p name="p14">Matrix: $mi.matrix</p>
    <p name="p15">Matrix[$i]: $mi.matrix[$i]</p>
    <p name="p16">Matrix[$i][1]: $mi.matrix[$i][1]</p>
    <p name="p17">Number of list items: $mi.numListItems</p>
    <p name="p18">List: $mi.list</p>
    <p name="p19">Math list from list: <mathList name="ml">$mi.list</mathList></p>
    <p name="p20">Number list from list: <numberList name="nl">$mi.list</numberList></p>

    `,
        });

        async function check_items(math: any, ind: number) {
            const stateVariables = await returnAllStateVariables(core);
            let mathTree = math.tree;

            let numDimensions = ["vector", "list"].includes(mathTree[0])
                ? mathTree.length - 1
                : 1;
            let x1, x2, x3, x4;
            try {
                x1 = math.get_component(0);
            } catch (e) {
                x1 = math;
            }
            try {
                x2 = math.get_component(1);
            } catch (e) {
                x2 = null;
            }
            try {
                x3 = math.get_component(2);
            } catch (e) {
                x3 = null;
            }
            try {
                x4 = math.get_component(3);
            } catch (e) {
                x4 = null;
            }

            let asVec = math;
            if (mathTree[0] === "list") {
                asVec = me.fromAst(["vector", ...mathTree.slice(1)]);
            }

            let asList = math;
            if (mathTree[0] === "vector") {
                asList = me.fromAst(["list", ...mathTree.slice(1)]);
            }

            expect(stateVariables["/p1"].stateValues.text).eq(
                `Number of dimensions: ${numDimensions}`,
            );
            expect(stateVariables["/mi"].stateValues.numDimensions).eq(
                numDimensions,
            );

            expect(stateVariables["/p2"].stateValues.text).eq(`x: ${x1}`);
            expect(stateVariables["/p5"].stateValues.text).eq(`x1: ${x1}`);
            expect(stateVariables["/mi"].stateValues.x1.tree).eqls(x1.tree);

            if (x2) {
                expect(stateVariables["/p3"].stateValues.text).eq(`y: ${x2}`);
                expect(stateVariables["/p6"].stateValues.text).eq(`x2: ${x2}`);
                expect(stateVariables["/mi"].stateValues.x2.tree).eqls(x2.tree);
            } else {
                expect(stateVariables["/p3"].stateValues.text).eq(`y: `);
                expect(stateVariables["/p6"].stateValues.text).eq(`x2: `);
                expect(stateVariables["/mi"].stateValues.x2).eq(undefined);
            }

            if (x3) {
                expect(stateVariables["/p4"].stateValues.text).eq(`z: ${x3}`);
                expect(stateVariables["/p7"].stateValues.text).eq(`x3: ${x3}`);
                expect(stateVariables["/mi"].stateValues.x3.tree).eqls(x3.tree);
            } else {
                expect(stateVariables["/p4"].stateValues.text).eq(`z: `);
                expect(stateVariables["/p7"].stateValues.text).eq(`x3: `);
                expect(stateVariables["/mi"].stateValues.x3).eq(undefined);
            }

            if (x4) {
                expect(stateVariables["/p8"].stateValues.text).eq(`x4: ${x4}`);
                expect(stateVariables["/mi"].stateValues.x4.tree).eqls(x4.tree);
            } else {
                expect(stateVariables["/p8"].stateValues.text).eq(`x4: `);
                expect(stateVariables["/mi"].stateValues.x4).eq(undefined);
            }

            expect(stateVariables["/p9"].stateValues.text).eq(`v: ${asVec}`);
            if (numDimensions === 1) {
                expect(
                    stateVariables["/mi"].stateValues.vector.map((v) => v.tree),
                ).eqls([math.tree]);
            } else {
                expect(
                    stateVariables["/mi"].stateValues.vector.map((v) => v.tree),
                ).eqls(math.tree.slice(1));
            }

            if (i === 1) {
                expect(stateVariables["/p10"].stateValues.text).eq(
                    `v[${i}]: ${x1}`,
                );
            } else if (i <= numDimensions) {
                expect(stateVariables["/p10"].stateValues.text).eq(
                    `v[${i}]: ${math.get_component(i - 1)}`,
                );
            } else {
                expect(stateVariables["/p10"].stateValues.text).eq(`v[${i}]: `);
            }

            expect(stateVariables["/p11"].stateValues.text).eq(
                `Matrix size: ${numDimensions}, 1`,
            );
            expect(stateVariables["/mi"].stateValues.matrixSize).eqls([
                numDimensions,
                1,
            ]);
            expect(stateVariables["/p12"].stateValues.text).eq(
                `Number of rows: ${numDimensions}`,
            );
            expect(stateVariables["/mi"].stateValues.numRows).eq(numDimensions);
            expect(stateVariables["/p13"].stateValues.text).eq(
                `Number of columns: 1`,
            );
            expect(stateVariables["/mi"].stateValues.numColumns).eq(1);
            if (numDimensions === 1) {
                expect(stateVariables["/p14"].stateValues.text).eq(
                    `Matrix: [ [ ${math} ] ]`,
                );
                expect(
                    stateVariables["/mi"].stateValues.matrix.map((v) =>
                        v.map((x) => x.tree),
                    ),
                ).eqls([[math.tree]]);
            } else {
                expect(stateVariables["/p14"].stateValues.text).eq(
                    `Matrix: [ ${[...Array(numDimensions).keys()].map((i) => `[ ${math.get_component(i)} ]`).join(", ")} ]`,
                );
                expect(
                    stateVariables["/mi"].stateValues.matrix.map((v) =>
                        v.map((x) => x.tree),
                    ),
                ).eqls(math.tree.slice(1).map((v) => [v]));
            }

            if (i === 1) {
                expect(stateVariables["/p15"].stateValues.text).eq(
                    `Matrix[${i}]: [ [ ${x1} ] ]`,
                );
            } else if (i <= numDimensions) {
                expect(stateVariables["/p15"].stateValues.text).eq(
                    `Matrix[${i}]: [ [ ${math.get_component(i - 1)} ] ]`,
                );
            } else {
                expect(stateVariables["/p15"].stateValues.text).eq(
                    `Matrix[${i}]: `,
                );
            }

            if (i === 1) {
                expect(stateVariables["/p16"].stateValues.text).eq(
                    `Matrix[${i}][1]: ${x1}`,
                );
            } else if (i <= numDimensions) {
                expect(stateVariables["/p16"].stateValues.text).eq(
                    `Matrix[${i}][1]: ${math.get_component(i - 1)}`,
                );
            } else {
                expect(stateVariables["/p16"].stateValues.text).eq(
                    `Matrix[${i}][1]: `,
                );
            }

            expect(stateVariables["/p17"].stateValues.text).eq(
                `Number of list items: ${numDimensions}`,
            );

            expect(stateVariables["/p18"].stateValues.text).eq(
                `List: ${asList}`,
            );
            if (numDimensions === 1) {
                expect(
                    stateVariables["/mi"].stateValues.list.map((v) => v.tree),
                ).eqls([math.tree]);
            } else {
                expect(
                    stateVariables["/mi"].stateValues.list.map((v) => v.tree),
                ).eqls(math.tree.slice(1));
            }

            expect(stateVariables["/p19"].stateValues.text).eq(
                `Math list from list: ${asList}`,
            );
            if (numDimensions === 1) {
                expect(
                    stateVariables["/ml"].stateValues.maths.map((v) => v.tree),
                ).eqls([math.tree]);
            } else {
                expect(
                    stateVariables["/ml"].stateValues.maths.map((v) => v.tree),
                ).eqls(math.tree.slice(1));
            }

            if (numDimensions === 1) {
                let num = math.evaluate_to_constant();

                expect(stateVariables["/p20"].stateValues.text).eq(
                    `Number list from list: ${num}`,
                );
                expect(stateVariables["/nl"].stateValues.numbers).eqls([num]);
            } else {
                let nums = math.tree
                    .slice(1)
                    .map((v) => me.fromAst(v).evaluate_to_constant());

                expect(stateVariables["/p20"].stateValues.text).eq(
                    `Number list from list: ${nums.join(", ")}`,
                );

                expect(stateVariables["/nl"].stateValues.numbers).eqls(nums);
            }
        }

        let math = me.fromAst("\uff3f");
        let i = 1;
        await check_items(math, i);

        await updateMathInputValue({
            latex: "(1,2)",
            name: "/mi",
            core,
        });
        math = me.fromAst(["vector", 1, 2]);
        await check_items(math, i);

        i = 2;
        await updateMathInputValue({
            latex: i.toString(),
            name: "/i",
            core,
        });
        await check_items(math, i);

        i = 3;
        await updateMathInputValue({
            latex: i.toString(),
            name: "/i",
            core,
        });
        await check_items(math, i);

        await updateMathInputValue({
            latex: "(a,b,c)",
            name: "/mi",
            core,
        });
        math = me.fromAst(["vector", "a", "b", "c"]);
        await check_items(math, i);

        i = 4;
        await updateMathInputValue({
            latex: i.toString(),
            name: "/i",
            core,
        });
        await check_items(math, i);

        i = 2;
        await updateMathInputValue({
            latex: i.toString(),
            name: "/i",
            core,
        });
        await check_items(math, i);

        await updateMathInputValue({
            latex: "xyz",
            name: "/mi",
            core,
        });
        math = me.fromAst(["*", "x", "y", "z"]);
        await check_items(math, i);

        i = 1;
        await updateMathInputValue({
            latex: i.toString(),
            name: "/i",
            core,
        });
        await check_items(math, i);

        await updateMathInputValue({
            latex: "p,q",
            name: "/mi",
            core,
        });
        math = me.fromAst(["list", "p", "q"]);
        await check_items(math, i);

        await updateMathInputValue({
            latex: "5,4,3",
            name: "/mi",
            core,
        });
        math = me.fromAst(["list", 5, 4, 3]);
        await check_items(math, i);
    });
});
