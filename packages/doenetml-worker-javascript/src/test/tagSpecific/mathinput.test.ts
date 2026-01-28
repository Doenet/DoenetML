import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
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
vi.mock("hyperformula");

describe("MathInput tag tests", async () => {
    it("mathInput references", async () => {
        // A fairly involved test
        // to check for bugs that have shown up after multiple manipulations

        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <mathInput prefill='x+1' name="mi1" />
    <mathInput extend="$mi1" name="mi1a"  />
    <mathInput name="mi2" />
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("mi1")].stateValues
                    .rawRendererValue,
            ),
        ).eq("x+1");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("mi1a")].stateValues
                    .rawRendererValue,
            ),
        ).eq("x+1");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("mi2")].stateValues
                    .rawRendererValue,
            ),
        ).eq("");

        expect(
            stateVariables[await resolvePathToNodeIdx("mi1")].stateValues
                .immediateValue.tree,
        ).eqls(["+", "x", 1]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1a")].stateValues
                .immediateValue.tree,
        ).eqls(["+", "x", 1]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi2")].stateValues
                .immediateValue.tree,
        ).to.eq("\uFF3F");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1")].stateValues.value
                .tree,
        ).eqls(["+", "x", 1]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1a")].stateValues.value
                .tree,
        ).eqls(["+", "x", 1]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi2")].stateValues.value
                .tree,
        ).to.eq("\uFF3F");

        // Type 2 in first mathInput
        await updateMathInputImmediateValue({
            latex: "x+12",
            componentIdx: await resolvePathToNodeIdx("mi1"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("mi1")].stateValues
                    .rawRendererValue,
            ),
        ).eq("x+12");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("mi1a")].stateValues
                    .rawRendererValue,
            ),
        ).eq("x+12");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("mi2")].stateValues
                    .rawRendererValue,
            ),
        ).eq("");

        expect(
            stateVariables[await resolvePathToNodeIdx("mi1")].stateValues
                .immediateValue.tree,
        ).eqls(["+", "x", 12]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1a")].stateValues
                .immediateValue.tree,
        ).eqls(["+", "x", 12]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi2")].stateValues
                .immediateValue.tree,
        ).to.eq("\uFF3F");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1")].stateValues.value
                .tree,
        ).eqls(["+", "x", 1]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1a")].stateValues.value
                .tree,
        ).eqls(["+", "x", 1]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi2")].stateValues.value
                .tree,
        ).to.eq("\uFF3F");

        // Changing to 3 in first mathInput
        await updateMathInputImmediateValue({
            latex: "x+1",
            componentIdx: await resolvePathToNodeIdx("mi1"),
            core,
        });
        await updateMathInputImmediateValue({
            latex: "x+13",
            componentIdx: await resolvePathToNodeIdx("mi1"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("mi1")].stateValues
                    .rawRendererValue,
            ),
        ).eq("x+13");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("mi1a")].stateValues
                    .rawRendererValue,
            ),
        ).eq("x+13");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("mi2")].stateValues
                    .rawRendererValue,
            ),
        ).eq("");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1")].stateValues
                .immediateValue.tree,
        ).eqls(["+", "x", 13]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1a")].stateValues
                .immediateValue.tree,
        ).eqls(["+", "x", 13]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi2")].stateValues
                .immediateValue.tree,
        ).to.eq("\uFF3F");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1")].stateValues.value
                .tree,
        ).eqls(["+", "x", 1]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1a")].stateValues.value
                .tree,
        ).eqls(["+", "x", 1]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi2")].stateValues.value
                .tree,
        ).to.eq("\uFF3F");

        // Update value (e.g., by pressing Enter) in first mathInput
        await updateMathInputValueToImmediateValue({
            componentIdx: await resolvePathToNodeIdx("mi1"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("mi1")].stateValues
                    .rawRendererValue,
            ),
        ).eq("x+13");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("mi1a")].stateValues
                    .rawRendererValue,
            ),
        ).eq("x+13");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("mi2")].stateValues
                    .rawRendererValue,
            ),
        ).eq("");

        expect(
            stateVariables[await resolvePathToNodeIdx("mi1")].stateValues
                .immediateValue.tree,
        ).eqls(["+", "x", 13]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1a")].stateValues
                .immediateValue.tree,
        ).eqls(["+", "x", 13]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi2")].stateValues
                .immediateValue.tree,
        ).to.eq("\uFF3F");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1")].stateValues.value
                .tree,
        ).eqls(["+", "x", 13]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1a")].stateValues.value
                .tree,
        ).eqls(["+", "x", 13]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi2")].stateValues.value
                .tree,
        ).to.eq("\uFF3F");

        // Erasing 13 and typing y second mathInput
        await updateMathInputImmediateValue({
            latex: "x+1",
            componentIdx: await resolvePathToNodeIdx("mi1a"),
            core,
        });
        await updateMathInputImmediateValue({
            latex: "x+",
            componentIdx: await resolvePathToNodeIdx("mi1a"),
            core,
        });
        await updateMathInputImmediateValue({
            latex: "x+y",
            componentIdx: await resolvePathToNodeIdx("mi1a"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("mi1")].stateValues
                    .rawRendererValue,
            ),
        ).eq("x+y");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("mi1a")].stateValues
                    .rawRendererValue,
            ),
        ).eq("x+y");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("mi2")].stateValues
                    .rawRendererValue,
            ),
        ).eq("");

        expect(
            stateVariables[await resolvePathToNodeIdx("mi1")].stateValues
                .immediateValue.tree,
        ).eqls(["+", "x", "y"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1a")].stateValues
                .immediateValue.tree,
        ).eqls(["+", "x", "y"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi2")].stateValues
                .immediateValue.tree,
        ).to.eq("\uFF3F");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1")].stateValues.value
                .tree,
        ).eqls(["+", "x", 13]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1a")].stateValues.value
                .tree,
        ).eqls(["+", "x", 13]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi2")].stateValues.value
                .tree,
        ).to.eq("\uFF3F");

        // Update value (e.g., by changing focus) of second mathInput
        await updateMathInputValueToImmediateValue({
            componentIdx: await resolvePathToNodeIdx("mi1a"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("mi1")].stateValues
                    .rawRendererValue,
            ),
        ).eq("x+y");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("mi1a")].stateValues
                    .rawRendererValue,
            ),
        ).eq("x+y");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("mi2")].stateValues
                    .rawRendererValue,
            ),
        ).eq("");

        expect(
            stateVariables[await resolvePathToNodeIdx("mi1")].stateValues
                .immediateValue.tree,
        ).eqls(["+", "x", "y"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1a")].stateValues
                .immediateValue.tree,
        ).eqls(["+", "x", "y"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi2")].stateValues
                .immediateValue.tree,
        ).to.eq("\uFF3F");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1")].stateValues.value
                .tree,
        ).eqls(["+", "x", "y"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1a")].stateValues.value
                .tree,
        ).eqls(["+", "x", "y"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi2")].stateValues.value
                .tree,
        ).to.eq("\uFF3F");

        // Typing pq in third mathInput
        await updateMathInputImmediateValue({
            latex: "p",
            componentIdx: await resolvePathToNodeIdx("mi2"),
            core,
        });
        await updateMathInputImmediateValue({
            latex: "pq",
            componentIdx: await resolvePathToNodeIdx("mi2"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("mi1")].stateValues
                    .rawRendererValue,
            ),
        ).eq("x+y");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("mi1a")].stateValues
                    .rawRendererValue,
            ),
        ).eq("x+y");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("mi2")].stateValues
                    .rawRendererValue,
            ),
        ).eq("pq");

        expect(
            stateVariables[await resolvePathToNodeIdx("mi1")].stateValues
                .immediateValue.tree,
        ).eqls(["+", "x", "y"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1a")].stateValues
                .immediateValue.tree,
        ).eqls(["+", "x", "y"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi2")].stateValues
                .immediateValue.tree,
        ).eqls(["*", "p", "q"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1")].stateValues.value
                .tree,
        ).eqls(["+", "x", "y"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1a")].stateValues.value
                .tree,
        ).eqls(["+", "x", "y"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi2")].stateValues.value
                .tree,
        ).to.eq("\uFF3F");

        // update value (e.g., update value) in mathInput 3
        await updateMathInputValueToImmediateValue({
            componentIdx: await resolvePathToNodeIdx("mi2"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("mi1")].stateValues
                    .rawRendererValue,
            ),
        ).eq("x+y");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("mi1a")].stateValues
                    .rawRendererValue,
            ),
        ).eq("x+y");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("mi2")].stateValues
                    .rawRendererValue,
            ),
        ).eq("pq");

        expect(
            stateVariables[await resolvePathToNodeIdx("mi1")].stateValues
                .immediateValue.tree,
        ).eqls(["+", "x", "y"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1a")].stateValues
                .immediateValue.tree,
        ).eqls(["+", "x", "y"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi2")].stateValues
                .immediateValue.tree,
        ).eqls(["*", "p", "q"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1")].stateValues.value
                .tree,
        ).eqls(["+", "x", "y"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1a")].stateValues.value
                .tree,
        ).eqls(["+", "x", "y"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi2")].stateValues.value
                .tree,
        ).eqls(["*", "p", "q"]);

        // type abc in mathInput 2
        await updateMathInputImmediateValue({
            latex: "",
            componentIdx: await resolvePathToNodeIdx("mi1a"),
            core,
        });
        await updateMathInputImmediateValue({
            latex: "a",
            componentIdx: await resolvePathToNodeIdx("mi1a"),
            core,
        });
        await updateMathInputImmediateValue({
            latex: "ab",
            componentIdx: await resolvePathToNodeIdx("mi1a"),
            core,
        });
        await updateMathInputImmediateValue({
            latex: "abc",
            componentIdx: await resolvePathToNodeIdx("mi1a"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("mi1")].stateValues
                    .rawRendererValue,
            ),
        ).eq("abc");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("mi1a")].stateValues
                    .rawRendererValue,
            ),
        ).eq("abc");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("mi2")].stateValues
                    .rawRendererValue,
            ),
        ).eq("pq");

        expect(
            stateVariables[await resolvePathToNodeIdx("mi1")].stateValues
                .immediateValue.tree,
        ).eqls(["*", "a", "b", "c"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1a")].stateValues
                .immediateValue.tree,
        ).eqls(["*", "a", "b", "c"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi2")].stateValues
                .immediateValue.tree,
        ).eqls(["*", "p", "q"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1")].stateValues.value
                .tree,
        ).eqls(["+", "x", "y"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1a")].stateValues.value
                .tree,
        ).eqls(["+", "x", "y"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi2")].stateValues.value
                .tree,
        ).eqls(["*", "p", "q"]);

        // update value (e.g., blur) mathInput 2
        await updateMathInputValueToImmediateValue({
            componentIdx: await resolvePathToNodeIdx("mi1a"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("mi1")].stateValues
                    .rawRendererValue,
            ),
        ).eq("abc");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("mi1a")].stateValues
                    .rawRendererValue,
            ),
        ).eq("abc");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("mi2")].stateValues
                    .rawRendererValue,
            ),
        ).eq("pq");

        expect(
            stateVariables[await resolvePathToNodeIdx("mi1")].stateValues
                .immediateValue.tree,
        ).eqls(["*", "a", "b", "c"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1a")].stateValues
                .immediateValue.tree,
        ).eqls(["*", "a", "b", "c"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi2")].stateValues
                .immediateValue.tree,
        ).eqls(["*", "p", "q"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1")].stateValues.value
                .tree,
        ).eqls(["*", "a", "b", "c"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1a")].stateValues.value
                .tree,
        ).eqls(["*", "a", "b", "c"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi2")].stateValues.value
                .tree,
        ).eqls(["*", "p", "q"]);

        // delete and reenter abc in mathInput 1

        await updateMathInputImmediateValue({
            latex: "",
            componentIdx: await resolvePathToNodeIdx("mi1"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("mi1")].stateValues
                    .rawRendererValue,
            ),
        ).eq("");

        await updateMathInputImmediateValue({
            latex: "a",
            componentIdx: await resolvePathToNodeIdx("mi1"),
            core,
        });
        await updateMathInputImmediateValue({
            latex: "ab",
            componentIdx: await resolvePathToNodeIdx("mi1"),
            core,
        });
        await updateMathInputImmediateValue({
            latex: "abc",
            componentIdx: await resolvePathToNodeIdx("mi1"),
            core,
        });
        await updateMathInputValueToImmediateValue({
            componentIdx: await resolvePathToNodeIdx("mi1"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("mi1")].stateValues
                    .rawRendererValue,
            ),
        ).eq("abc");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("mi1a")].stateValues
                    .rawRendererValue,
            ),
        ).eq("abc");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("mi2")].stateValues
                    .rawRendererValue,
            ),
        ).eq("pq");

        expect(
            stateVariables[await resolvePathToNodeIdx("mi1")].stateValues
                .immediateValue.tree,
        ).eqls(["*", "a", "b", "c"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1a")].stateValues
                .immediateValue.tree,
        ).eqls(["*", "a", "b", "c"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi2")].stateValues
                .immediateValue.tree,
        ).eqls(["*", "p", "q"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1")].stateValues.value
                .tree,
        ).eqls(["*", "a", "b", "c"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1a")].stateValues.value
                .tree,
        ).eqls(["*", "a", "b", "c"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi2")].stateValues.value
                .tree,
        ).eqls(["*", "p", "q"]);

        // type u/v in mathInput 3

        await updateMathInputImmediateValue({
            latex: "",
            componentIdx: await resolvePathToNodeIdx("mi2"),
            core,
        });
        await updateMathInputImmediateValue({
            latex: "u",
            componentIdx: await resolvePathToNodeIdx("mi2"),
            core,
        });
        await updateMathInputImmediateValue({
            latex: "u/",
            componentIdx: await resolvePathToNodeIdx("mi2"),
            core,
        });
        await updateMathInputImmediateValue({
            latex: "u/v",
            componentIdx: await resolvePathToNodeIdx("mi2"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("mi1")].stateValues
                    .rawRendererValue,
            ),
        ).eq("abc");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("mi1a")].stateValues
                    .rawRendererValue,
            ),
        ).eq("abc");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("mi2")].stateValues
                    .rawRendererValue,
            ),
        ).eq("u/v");

        expect(
            stateVariables[await resolvePathToNodeIdx("mi1")].stateValues
                .immediateValue.tree,
        ).eqls(["*", "a", "b", "c"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1a")].stateValues
                .immediateValue.tree,
        ).eqls(["*", "a", "b", "c"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi2")].stateValues
                .immediateValue.tree,
        ).eqls(["/", "u", "v"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1")].stateValues.value
                .tree,
        ).eqls(["*", "a", "b", "c"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1a")].stateValues.value
                .tree,
        ).eqls(["*", "a", "b", "c"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi2")].stateValues.value
                .tree,
        ).eqls(["*", "p", "q"]);

        // blue mathInput 2 and type d in mathInput 1
        await updateMathInputValueToImmediateValue({
            componentIdx: await resolvePathToNodeIdx("mi2"),
            core,
        });

        await updateMathInputImmediateValue({
            latex: "abcd",
            componentIdx: await resolvePathToNodeIdx("mi1"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("mi1")].stateValues
                    .rawRendererValue,
            ),
        ).eq("abcd");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("mi1a")].stateValues
                    .rawRendererValue,
            ),
        ).eq("abcd");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("mi2")].stateValues
                    .rawRendererValue,
            ),
        ).eq("u/v");

        expect(
            stateVariables[await resolvePathToNodeIdx("mi1")].stateValues
                .immediateValue.tree,
        ).eqls(["*", "a", "b", "c", "d"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1a")].stateValues
                .immediateValue.tree,
        ).eqls(["*", "a", "b", "c", "d"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi2")].stateValues
                .immediateValue.tree,
        ).eqls(["/", "u", "v"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1")].stateValues.value
                .tree,
        ).eqls(["*", "a", "b", "c"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1a")].stateValues.value
                .tree,
        ).eqls(["*", "a", "b", "c"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi2")].stateValues.value
                .tree,
        ).eqls(["/", "u", "v"]);

        // Update value (e.g., blur) first mathInput
        await updateMathInputValueToImmediateValue({
            componentIdx: await resolvePathToNodeIdx("mi1"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("mi1")].stateValues
                    .rawRendererValue,
            ),
        ).eq("abcd");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("mi1a")].stateValues
                    .rawRendererValue,
            ),
        ).eq("abcd");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("mi2")].stateValues
                    .rawRendererValue,
            ),
        ).eq("u/v");

        expect(
            stateVariables[await resolvePathToNodeIdx("mi1")].stateValues
                .immediateValue.tree,
        ).eqls(["*", "a", "b", "c", "d"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1a")].stateValues
                .immediateValue.tree,
        ).eqls(["*", "a", "b", "c", "d"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi2")].stateValues
                .immediateValue.tree,
        ).eqls(["/", "u", "v"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1")].stateValues.value
                .tree,
        ).eqls(["*", "a", "b", "c", "d"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1a")].stateValues.value
                .tree,
        ).eqls(["*", "a", "b", "c", "d"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi2")].stateValues.value
                .tree,
        ).eqls(["/", "u", "v"]);

        // Clearing second mathInput

        await updateMathInputImmediateValue({
            latex: "",
            componentIdx: await resolvePathToNodeIdx("mi1a"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("mi1")].stateValues
                    .rawRendererValue,
            ),
        ).eq("");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("mi1a")].stateValues
                    .rawRendererValue,
            ),
        ).eq("");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("mi2")].stateValues
                    .rawRendererValue,
            ),
        ).eq("u/v");

        expect(
            stateVariables[await resolvePathToNodeIdx("mi1")].stateValues
                .immediateValue.tree,
        ).to.eq("\uFF3F");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1a")].stateValues
                .immediateValue.tree,
        ).to.eq("\uFF3F");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi2")].stateValues
                .immediateValue.tree,
        ).eqls(["/", "u", "v"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1")].stateValues.value
                .tree,
        ).eqls(["*", "a", "b", "c", "d"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1a")].stateValues.value
                .tree,
        ).eqls(["*", "a", "b", "c", "d"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi2")].stateValues.value
                .tree,
        ).eqls(["/", "u", "v"]);

        // update value (e.g., by blurring) of second mathInput

        await updateMathInputValueToImmediateValue({
            componentIdx: await resolvePathToNodeIdx("mi1a"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("mi1")].stateValues
                    .rawRendererValue,
            ),
        ).eq("");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("mi1a")].stateValues
                    .rawRendererValue,
            ),
        ).eq("");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("mi2")].stateValues
                    .rawRendererValue,
            ),
        ).eq("u/v");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1")].stateValues
                .immediateValue.tree,
        ).to.eq("\uFF3F");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1a")].stateValues
                .immediateValue.tree,
        ).to.eq("\uFF3F");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi2")].stateValues
                .immediateValue.tree,
        ).eqls(["/", "u", "v"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1")].stateValues.value
                .tree,
        ).to.eq("\uFF3F");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1a")].stateValues.value
                .tree,
        ).to.eq("\uFF3F");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi2")].stateValues.value
                .tree,
        ).eqls(["/", "u", "v"]);
    });

    it("mathInput references with invalid math expressions", async () => {
        let doenetML = `
    <mathInput name="mi1" />
    <mathInput extend="$mi1" name="mi1a"  />
    `;

        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("mi1")].stateValues
                    .rawRendererValue,
            ),
        ).eq("");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("mi1a")].stateValues
                    .rawRendererValue,
            ),
        ).eq("");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1")].stateValues
                .immediateValue.tree,
        ).eqls("＿");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1a")].stateValues
                .immediateValue.tree,
        ).eqls("＿");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1")].stateValues.value
                .tree,
        ).eqls("＿");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1a")].stateValues.value
                .tree,
        ).eqls("＿");

        // Type x~ in first mathInput
        await updateMathInputImmediateValue({
            latex: "x",
            componentIdx: await resolvePathToNodeIdx("mi1"),
            core,
        });
        await updateMathInputValue({
            latex: "x~",
            componentIdx: await resolvePathToNodeIdx("mi1"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("mi1")].stateValues
                    .rawRendererValue,
            ),
        ).eq("x~");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("mi1a")].stateValues
                    .rawRendererValue,
            ),
        ).eq("x~");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1")].stateValues
                .immediateValue.tree,
        ).eqls("＿");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1a")].stateValues
                .immediateValue.tree,
        ).eqls("＿");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1")].stateValues.value
                .tree,
        ).eqls("＿");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1a")].stateValues.value
                .tree,
        ).eqls("＿");

        // Delete ~ and add -y in copied mathInput
        await updateMathInputImmediateValue({
            latex: "x",
            componentIdx: await resolvePathToNodeIdx("mi1a"),
            core,
        });
        await updateMathInputImmediateValue({
            latex: "x-",
            componentIdx: await resolvePathToNodeIdx("mi1a"),
            core,
        });
        await updateMathInputImmediateValue({
            latex: "x-y",
            componentIdx: await resolvePathToNodeIdx("mi1a"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("mi1")].stateValues
                    .rawRendererValue,
            ),
        ).eq("x-y");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("mi1a")].stateValues
                    .rawRendererValue,
            ),
        ).eq("x-y");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1")].stateValues
                .immediateValue.tree,
        ).eqls(["+", "x", ["-", "y"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1a")].stateValues
                .immediateValue.tree,
        ).eqls(["+", "x", ["-", "y"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1")].stateValues.value
                .tree,
        ).eqls("＿");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1a")].stateValues.value
                .tree,
        ).eqls("＿");

        // update value (e.g., blur)
        await updateMathInputValueToImmediateValue({
            componentIdx: await resolvePathToNodeIdx("mi1a"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("mi1")].stateValues
                    .rawRendererValue,
            ),
        ).eq("x-y");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("mi1a")].stateValues
                    .rawRendererValue,
            ),
        ).eq("x-y");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1")].stateValues
                .immediateValue.tree,
        ).eqls(["+", "x", ["-", "y"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1a")].stateValues
                .immediateValue.tree,
        ).eqls(["+", "x", ["-", "y"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1")].stateValues.value
                .tree,
        ).eqls(["+", "x", ["-", "y"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1a")].stateValues.value
                .tree,
        ).eqls(["+", "x", ["-", "y"]]);

        // Add & in copied mathInput
        await updateMathInputImmediateValue({
            latex: "x-y@",
            componentIdx: await resolvePathToNodeIdx("mi1a"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("mi1")].stateValues
                    .rawRendererValue,
            ),
        ).eq("x-y@");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("mi1a")].stateValues
                    .rawRendererValue,
            ),
        ).eq("x-y@");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1")].stateValues
                .immediateValue.tree,
        ).eqls("＿");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1a")].stateValues
                .immediateValue.tree,
        ).eqls("＿");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1")].stateValues.value
                .tree,
        ).eqls(["+", "x", ["-", "y"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1a")].stateValues.value
                .tree,
        ).eqls(["+", "x", ["-", "y"]]);

        // Delete @ and add *z in first mathInput
        await updateMathInputValueToImmediateValue({
            componentIdx: await resolvePathToNodeIdx("mi1a"),
            core,
        });

        await updateMathInputImmediateValue({
            latex: "x-y",
            componentIdx: await resolvePathToNodeIdx("mi1"),
            core,
        });
        await updateMathInputImmediateValue({
            latex: "x-y*",
            componentIdx: await resolvePathToNodeIdx("mi1"),
            core,
        });
        await updateMathInputImmediateValue({
            latex: "x-y*z",
            componentIdx: await resolvePathToNodeIdx("mi1"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("mi1")].stateValues
                    .rawRendererValue,
            ),
        ).eq("x-y*z");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("mi1a")].stateValues
                    .rawRendererValue,
            ),
        ).eq("x-y*z");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1")].stateValues
                .immediateValue.tree,
        ).eqls(["+", "x", ["-", ["*", "y", "z"]]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1a")].stateValues
                .immediateValue.tree,
        ).eqls(["+", "x", ["-", ["*", "y", "z"]]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1")].stateValues.value
                .tree,
        ).eqls("＿");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1a")].stateValues.value
                .tree,
        ).eqls("＿");

        // Update value (e.g., update value)
        await updateMathInputValueToImmediateValue({
            componentIdx: await resolvePathToNodeIdx("mi1"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("mi1")].stateValues
                    .rawRendererValue,
            ),
        ).eq("x-y*z");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("mi1a")].stateValues
                    .rawRendererValue,
            ),
        ).eq("x-y*z");

        expect(
            stateVariables[await resolvePathToNodeIdx("mi1")].stateValues
                .immediateValue.tree,
        ).eqls(["+", "x", ["-", ["*", "y", "z"]]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1a")].stateValues
                .immediateValue.tree,
        ).eqls(["+", "x", ["-", ["*", "y", "z"]]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1")].stateValues.value
                .tree,
        ).eqls(["+", "x", ["-", ["*", "y", "z"]]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1a")].stateValues.value
                .tree,
        ).eqls(["+", "x", ["-", ["*", "y", "z"]]]);
    });

    it("mathInput references with incomplete math expressions", async () => {
        let doenetML = `
    <mathInput name="mi1" />
    <mathInput extend="$mi1" name="mi1a"  />
    `;

        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("mi1")].stateValues
                    .rawRendererValue,
            ),
        ).eq("");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("mi1a")].stateValues
                    .rawRendererValue,
            ),
        ).eq("");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1")].stateValues
                .immediateValue.tree,
        ).eqls("＿");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1a")].stateValues
                .immediateValue.tree,
        ).eqls("＿");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1")].stateValues.value
                .tree,
        ).eqls("＿");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1a")].stateValues.value
                .tree,
        ).eqls("＿");

        // Type x- in first mathInput
        await updateMathInputImmediateValue({
            latex: "x",
            componentIdx: await resolvePathToNodeIdx("mi1"),
            core,
        });
        await updateMathInputValue({
            latex: "x-",
            componentIdx: await resolvePathToNodeIdx("mi1"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("mi1")].stateValues
                    .rawRendererValue,
            ),
        ).eq("x-");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("mi1a")].stateValues
                    .rawRendererValue,
            ),
        ).eq("x-");

        expect(
            stateVariables[await resolvePathToNodeIdx("mi1")].stateValues
                .immediateValue.tree,
        ).eqls("x-");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1a")].stateValues
                .immediateValue.tree,
        ).eqls("x-");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1")].stateValues.value
                .tree,
        ).eqls("x-");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1a")].stateValues.value
                .tree,
        ).eqls("x-");

        // Add y in copied mathInput
        await updateMathInputImmediateValue({
            latex: "x-y",
            componentIdx: await resolvePathToNodeIdx("mi1a"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("mi1")].stateValues
                    .rawRendererValue,
            ),
        ).eq("x-y");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("mi1a")].stateValues
                    .rawRendererValue,
            ),
        ).eq("x-y");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1")].stateValues
                .immediateValue.tree,
        ).eqls(["+", "x", ["-", "y"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1a")].stateValues
                .immediateValue.tree,
        ).eqls(["+", "x", ["-", "y"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1")].stateValues.value
                .tree,
        ).eqls("x-");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1a")].stateValues.value
                .tree,
        ).eqls("x-");

        // update value (e.g., blur)
        await updateMathInputValueToImmediateValue({
            componentIdx: await resolvePathToNodeIdx("mi1a"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("mi1")].stateValues
                    .rawRendererValue,
            ),
        ).eq("x-y");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("mi1a")].stateValues
                    .rawRendererValue,
            ),
        ).eq("x-y");

        expect(
            stateVariables[await resolvePathToNodeIdx("mi1")].stateValues
                .immediateValue.tree,
        ).eqls(["+", "x", ["-", "y"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1a")].stateValues
                .immediateValue.tree,
        ).eqls(["+", "x", ["-", "y"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1")].stateValues.value
                .tree,
        ).eqls(["+", "x", ["-", "y"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1a")].stateValues.value
                .tree,
        ).eqls(["+", "x", ["-", "y"]]);

        // Add * in copied mathInput
        await updateMathInputImmediateValue({
            latex: "x-y*",
            componentIdx: await resolvePathToNodeIdx("mi1a"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("mi1")].stateValues
                    .rawRendererValue,
            ),
        ).eq("x-y*");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("mi1a")].stateValues
                    .rawRendererValue,
            ),
        ).eq("x-y*");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1")].stateValues
                .immediateValue.tree,
        ).eqls(["+", "x", ["-", ["*", "y", "＿"]]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1a")].stateValues
                .immediateValue.tree,
        ).eqls(["+", "x", ["-", ["*", "y", "＿"]]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1")].stateValues.value
                .tree,
        ).eqls(["+", "x", ["-", "y"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1a")].stateValues.value
                .tree,
        ).eqls(["+", "x", ["-", "y"]]);

        // Add z in first mathInput
        await updateMathInputValueToImmediateValue({
            componentIdx: await resolvePathToNodeIdx("mi1a"),
            core,
        });
        await updateMathInputImmediateValue({
            latex: "x-y*z",
            componentIdx: await resolvePathToNodeIdx("mi1"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("mi1")].stateValues
                    .rawRendererValue,
            ),
        ).eq("x-y*z");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("mi1a")].stateValues
                    .rawRendererValue,
            ),
        ).eq("x-y*z");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1")].stateValues
                .immediateValue.tree,
        ).eqls(["+", "x", ["-", ["*", "y", "z"]]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1a")].stateValues
                .immediateValue.tree,
        ).eqls(["+", "x", ["-", ["*", "y", "z"]]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1")].stateValues.value
                .tree,
        ).eqls(["+", "x", ["-", ["*", "y", "＿"]]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1a")].stateValues.value
                .tree,
        ).eqls(["+", "x", ["-", ["*", "y", "＿"]]]);

        // Update value (e.g., update value)
        await updateMathInputValueToImmediateValue({
            componentIdx: await resolvePathToNodeIdx("mi1"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("mi1")].stateValues
                    .rawRendererValue,
            ),
        ).eq("x-y*z");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("mi1a")].stateValues
                    .rawRendererValue,
            ),
        ).eq("x-y*z");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1")].stateValues
                .immediateValue.tree,
        ).eqls(["+", "x", ["-", ["*", "y", "z"]]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1a")].stateValues
                .immediateValue.tree,
        ).eqls(["+", "x", ["-", ["*", "y", "z"]]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1")].stateValues.value
                .tree,
        ).eqls(["+", "x", ["-", ["*", "y", "z"]]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1a")].stateValues.value
                .tree,
        ).eqls(["+", "x", ["-", ["*", "y", "z"]]]);
    });

    it("downstream from mathInput", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p>Original math: <math>1+2x</math></p>
    <p>MathInput based on math: <mathInput bindValueTo="$_math1" name="mi1" /></p>
    <p>Copied mathInput: <mathInput extend="$mi1" name="mi2" /></p>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("mi1")].stateValues
                    .rawRendererValue,
            ),
        ).eq("1+2x");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("mi2")].stateValues
                    .rawRendererValue,
            ),
        ).eq("1+2x");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1")].stateValues.value
                .tree,
        ).eqls(["+", 1, ["*", 2, "x"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("_math1")].stateValues
                .value.tree,
        ).eqls(["+", 1, ["*", 2, "x"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi2")].stateValues.value
                .tree,
        ).eqls(["+", 1, ["*", 2, "x"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1")].stateValues
                .immediateValue.tree,
        ).eqls(["+", 1, ["*", 2, "x"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi2")].stateValues
                .immediateValue.tree,
        ).eqls(["+", 1, ["*", 2, "x"]]);

        // type new values
        await updateMathInputImmediateValue({
            latex: "",
            componentIdx: await resolvePathToNodeIdx("mi1"),
            core,
        });
        await updateMathInputImmediateValue({
            latex: "x",
            componentIdx: await resolvePathToNodeIdx("mi1"),
            core,
        });
        await updateMathInputImmediateValue({
            latex: "xy",
            componentIdx: await resolvePathToNodeIdx("mi1"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("mi1")].stateValues
                    .rawRendererValue,
            ),
        ).eq("xy");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("mi2")].stateValues
                    .rawRendererValue,
            ),
        ).eq("xy");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1")].stateValues.value
                .tree,
        ).eqls(["+", 1, ["*", 2, "x"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("_math1")].stateValues
                .value.tree,
        ).eqls(["+", 1, ["*", 2, "x"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi2")].stateValues.value
                .tree,
        ).eqls(["+", 1, ["*", 2, "x"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1")].stateValues
                .immediateValue.tree,
        ).eqls(["*", "x", "y"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi2")].stateValues
                .immediateValue.tree,
        ).eqls(["*", "x", "y"]);

        // update value
        await updateMathInputValueToImmediateValue({
            componentIdx: await resolvePathToNodeIdx("mi1"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("mi1")].stateValues
                    .rawRendererValue,
            ),
        ).eq("xy");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("mi2")].stateValues
                    .rawRendererValue,
            ),
        ).eq("xy");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1")].stateValues.value
                .tree,
        ).eqls(["*", "x", "y"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("_math1")].stateValues
                .value.tree,
        ).eqls(["*", "x", "y"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi2")].stateValues.value
                .tree,
        ).eqls(["*", "x", "y"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1")].stateValues
                .immediateValue.tree,
        ).eqls(["*", "x", "y"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi2")].stateValues
                .immediateValue.tree,
        ).eqls(["*", "x", "y"]);

        // enter new values in referenced
        await updateMathInputValue({
            latex: "qr",
            componentIdx: await resolvePathToNodeIdx("mi1"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("mi1")].stateValues
                    .rawRendererValue,
            ),
        ).eq("qr");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("mi2")].stateValues
                    .rawRendererValue,
            ),
        ).eq("qr");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1")].stateValues.value
                .tree,
        ).eqls(["*", "q", "r"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("_math1")].stateValues
                .value.tree,
        ).eqls(["*", "q", "r"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi2")].stateValues.value
                .tree,
        ).eqls(["*", "q", "r"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1")].stateValues
                .immediateValue.tree,
        ).eqls(["*", "q", "r"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi2")].stateValues
                .immediateValue.tree,
        ).eqls(["*", "q", "r"]);
    });

    it("downstream from mathInput, prefill ignored", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p>Original math: <math>1+2x</math></p>
    <p>MathInput based on math: <mathInput prefill="x^2/9" bindValueTo="$_math1" name="mi1" /></p>
    <p>Copied mathInput: <mathInput extend="$mi1" name="mi2" /></p>

    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("mi1")].stateValues
                    .rawRendererValue,
            ),
        ).eq("1+2x");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("mi2")].stateValues
                    .rawRendererValue,
            ),
        ).eq("1+2x");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1")].stateValues.value
                .tree,
        ).eqls(["+", 1, ["*", 2, "x"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("_math1")].stateValues
                .value.tree,
        ).eqls(["+", 1, ["*", 2, "x"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi2")].stateValues.value
                .tree,
        ).eqls(["+", 1, ["*", 2, "x"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1")].stateValues
                .immediateValue.tree,
        ).eqls(["+", 1, ["*", 2, "x"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi2")].stateValues
                .immediateValue.tree,
        ).eqls(["+", 1, ["*", 2, "x"]]);
    });

    it("downstream from mathInput, normal downstream rules apply", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p>Original math: <math simplify>1+<math>3x</math></math></p>
    <p>MathInput based on math: <mathInput bindValueTo="$_math1" name="mi1" /></p>
    <p>Copied mathInput: <mathInput extend="$mi1" name="mi2" /></p>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("mi1")].stateValues
                    .rawRendererValue,
            ),
        ).eq("3x+1");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("mi2")].stateValues
                    .rawRendererValue,
            ),
        ).eq("3x+1");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1")].stateValues.value
                .tree,
        ).eqls(["+", ["*", 3, "x"], 1]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi2")].stateValues.value
                .tree,
        ).eqls(["+", ["*", 3, "x"], 1]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1")].stateValues
                .immediateValue.tree,
        ).eqls(["+", ["*", 3, "x"], 1]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi2")].stateValues
                .immediateValue.tree,
        ).eqls(["+", ["*", 3, "x"], 1]);
        expect(
            stateVariables[await resolvePathToNodeIdx("_math1")].stateValues
                .value.tree,
        ).eqls(["+", ["*", 3, "x"], 1]);
        expect(
            stateVariables[await resolvePathToNodeIdx("_math2")].stateValues
                .value.tree,
        ).eqls(["*", 3, "x"]);

        // type new values
        await updateMathInputValue({
            latex: "xy",
            componentIdx: await resolvePathToNodeIdx("mi1"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("mi1")].stateValues
                    .rawRendererValue,
            ),
        ).eq("xy");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("mi2")].stateValues
                    .rawRendererValue,
            ),
        ).eq("xy");

        expect(
            stateVariables[await resolvePathToNodeIdx("mi1")].stateValues.value
                .tree,
        ).eqls(["*", "x", "y"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi2")].stateValues.value
                .tree,
        ).eqls(["*", "x", "y"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1")].stateValues
                .immediateValue.tree,
        ).eqls(["*", "x", "y"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi2")].stateValues
                .immediateValue.tree,
        ).eqls(["*", "x", "y"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("_math1")].stateValues
                .value.tree,
        ).eqls(["*", "x", "y"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("_math2")].stateValues
                .value.tree,
        ).eqls(["+", ["*", "x", "y"], -1]);

        // enter new values in reffed
        await updateMathInputValue({
            latex: "qr",
            componentIdx: await resolvePathToNodeIdx("mi2"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("mi1")].stateValues
                    .rawRendererValue,
            ),
        ).eq("qr");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("mi2")].stateValues
                    .rawRendererValue,
            ),
        ).eq("qr");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1")].stateValues.value
                .tree,
        ).eqls(["*", "q", "r"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi2")].stateValues.value
                .tree,
        ).eqls(["*", "q", "r"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1")].stateValues
                .immediateValue.tree,
        ).eqls(["*", "q", "r"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi2")].stateValues
                .immediateValue.tree,
        ).eqls(["*", "q", "r"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("_math1")].stateValues
                .value.tree,
        ).eqls(["*", "q", "r"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("_math2")].stateValues
                .value.tree,
        ).eqls(["+", ["*", "q", "r"], -1]);
    });

    it("downstream from mathInput via child", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p>Original math: <math>1+2x</math></p>
    <p>MathInput based on math: <mathInput name="mi1" >$_math1</mathInput></p>
    <p>Copied mathInput: <mathInput extend="$mi1" name="mi2" /></p>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("mi1")].stateValues
                    .rawRendererValue,
            ),
        ).eq("1+2x");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("mi2")].stateValues
                    .rawRendererValue,
            ),
        ).eq("1+2x");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1")].stateValues.value
                .tree,
        ).eqls(["+", 1, ["*", 2, "x"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("_math1")].stateValues
                .value.tree,
        ).eqls(["+", 1, ["*", 2, "x"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi2")].stateValues.value
                .tree,
        ).eqls(["+", 1, ["*", 2, "x"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1")].stateValues
                .immediateValue.tree,
        ).eqls(["+", 1, ["*", 2, "x"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi2")].stateValues
                .immediateValue.tree,
        ).eqls(["+", 1, ["*", 2, "x"]]);

        // type new values
        await updateMathInputImmediateValue({
            latex: "",
            componentIdx: await resolvePathToNodeIdx("mi1"),
            core,
        });
        await updateMathInputImmediateValue({
            latex: "x",
            componentIdx: await resolvePathToNodeIdx("mi1"),
            core,
        });
        await updateMathInputImmediateValue({
            latex: "xy",
            componentIdx: await resolvePathToNodeIdx("mi1"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("mi1")].stateValues
                    .rawRendererValue,
            ),
        ).eq("xy");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("mi2")].stateValues
                    .rawRendererValue,
            ),
        ).eq("xy");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1")].stateValues.value
                .tree,
        ).eqls(["+", 1, ["*", 2, "x"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("_math1")].stateValues
                .value.tree,
        ).eqls(["+", 1, ["*", 2, "x"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi2")].stateValues.value
                .tree,
        ).eqls(["+", 1, ["*", 2, "x"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1")].stateValues
                .immediateValue.tree,
        ).eqls(["*", "x", "y"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi2")].stateValues
                .immediateValue.tree,
        ).eqls(["*", "x", "y"]);

        // update value
        await updateMathInputValueToImmediateValue({
            componentIdx: await resolvePathToNodeIdx("mi1"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("mi1")].stateValues
                    .rawRendererValue,
            ),
        ).eq("xy");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("mi2")].stateValues
                    .rawRendererValue,
            ),
        ).eq("xy");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1")].stateValues.value
                .tree,
        ).eqls(["*", "x", "y"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("_math1")].stateValues
                .value.tree,
        ).eqls(["*", "x", "y"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi2")].stateValues.value
                .tree,
        ).eqls(["*", "x", "y"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1")].stateValues
                .immediateValue.tree,
        ).eqls(["*", "x", "y"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi2")].stateValues
                .immediateValue.tree,
        ).eqls(["*", "x", "y"]);

        // enter new values in referenced
        await updateMathInputValue({
            latex: "qr",
            componentIdx: await resolvePathToNodeIdx("mi1"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("mi1")].stateValues
                    .rawRendererValue,
            ),
        ).eq("qr");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("mi2")].stateValues
                    .rawRendererValue,
            ),
        ).eq("qr");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1")].stateValues.value
                .tree,
        ).eqls(["*", "q", "r"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("_math1")].stateValues
                .value.tree,
        ).eqls(["*", "q", "r"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi2")].stateValues.value
                .tree,
        ).eqls(["*", "q", "r"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1")].stateValues
                .immediateValue.tree,
        ).eqls(["*", "q", "r"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi2")].stateValues
                .immediateValue.tree,
        ).eqls(["*", "q", "r"]);
    });

    it("downstream from mathInput via child, prefill ignored", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p>Original math: <math>1+2x</math></p>
    <p>MathInput based on math: <mathInput prefill="x^2/9" name="mi1" >$_math1</mathInput></p>
    <p>Copied mathInput: <mathInput extend="$mi1" name="mi2" /></p>

    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("mi1")].stateValues
                    .rawRendererValue,
            ),
        ).eq("1+2x");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("mi2")].stateValues
                    .rawRendererValue,
            ),
        ).eq("1+2x");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1")].stateValues.value
                .tree,
        ).eqls(["+", 1, ["*", 2, "x"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("_math1")].stateValues
                .value.tree,
        ).eqls(["+", 1, ["*", 2, "x"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi2")].stateValues.value
                .tree,
        ).eqls(["+", 1, ["*", 2, "x"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1")].stateValues
                .immediateValue.tree,
        ).eqls(["+", 1, ["*", 2, "x"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi2")].stateValues
                .immediateValue.tree,
        ).eqls(["+", 1, ["*", 2, "x"]]);
    });

    it("combination children including string", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p>Original math: <math>x</math></p>
    <p>MathInput based on math and strings: <mathInput name="mi1" >2$_math1+1</mathInput></p>

    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("mi1")].stateValues
                    .rawRendererValue,
            ),
        ).eq("2x+1");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1")].stateValues.value
                .tree,
        ).eqls(["+", ["*", 2, "x"], 1]);
        expect(
            stateVariables[await resolvePathToNodeIdx("_math1")].stateValues
                .value.tree,
        ).eqls("x");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1")].stateValues
                .immediateValue.tree,
        ).eqls(["+", ["*", 2, "x"], 1]);

        // type in new values
        await updateMathInputValue({
            latex: "2y+1",
            componentIdx: await resolvePathToNodeIdx("mi1"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("mi1")].stateValues
                    .rawRendererValue,
            ),
        ).eq("2y+1");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1")].stateValues.value
                .tree,
        ).eqls(["+", ["*", 2, "y"], 1]);
        expect(
            stateVariables[await resolvePathToNodeIdx("_math1")].stateValues
                .value.tree,
        ).eqls("y");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1")].stateValues
                .immediateValue.tree,
        ).eqls(["+", ["*", 2, "y"], 1]);
    });

    it("child overrides bindValueTo", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p>Original math: <math>x</math></p>
    <p>MathInput with child and bindValueTo: <mathInput name="mi1" bindValueTo="$_math1">y</mathInput></p>

    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("mi1")].stateValues
                    .rawRendererValue,
            ),
        ).eq("y");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1")].stateValues.value
                .tree,
        ).eqls("y");
        expect(
            stateVariables[await resolvePathToNodeIdx("_math1")].stateValues
                .value.tree,
        ).eqls("x");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1")].stateValues
                .immediateValue.tree,
        ).eqls("y");

        // type in new values
        await updateMathInputValue({
            latex: "2z",
            componentIdx: await resolvePathToNodeIdx("mi1"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("mi1")].stateValues
                    .rawRendererValue,
            ),
        ).eq("2z");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1")].stateValues.value
                .tree,
        ).eqls(["*", 2, "z"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("_math1")].stateValues
                .value.tree,
        ).eqls("x");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1")].stateValues
                .immediateValue.tree,
        ).eqls(["*", 2, "z"]);
    });

    it("downstream from mathInput via child, normal downstream rules apply", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p>Original math: <math simplify>1+<math>3x</math></math></p>
    <p>MathInput based on math: <mathInput name="mi1" >$_math1</mathInput></p>
    <p>Copied mathInput: <mathInput extend="$mi1" name="mi2" /></p>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("mi1")].stateValues
                    .rawRendererValue,
            ),
        ).eq("3x+1");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("mi2")].stateValues
                    .rawRendererValue,
            ),
        ).eq("3x+1");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1")].stateValues.value
                .tree,
        ).eqls(["+", ["*", 3, "x"], 1]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi2")].stateValues.value
                .tree,
        ).eqls(["+", ["*", 3, "x"], 1]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1")].stateValues
                .immediateValue.tree,
        ).eqls(["+", ["*", 3, "x"], 1]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi2")].stateValues
                .immediateValue.tree,
        ).eqls(["+", ["*", 3, "x"], 1]);
        expect(
            stateVariables[await resolvePathToNodeIdx("_math1")].stateValues
                .value.tree,
        ).eqls(["+", ["*", 3, "x"], 1]);
        expect(
            stateVariables[await resolvePathToNodeIdx("_math2")].stateValues
                .value.tree,
        ).eqls(["*", 3, "x"]);

        // type new values
        await updateMathInputValue({
            latex: "xy",
            componentIdx: await resolvePathToNodeIdx("mi1"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("mi1")].stateValues
                    .rawRendererValue,
            ),
        ).eq("xy");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("mi2")].stateValues
                    .rawRendererValue,
            ),
        ).eq("xy");

        expect(
            stateVariables[await resolvePathToNodeIdx("mi1")].stateValues.value
                .tree,
        ).eqls(["*", "x", "y"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi2")].stateValues.value
                .tree,
        ).eqls(["*", "x", "y"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1")].stateValues
                .immediateValue.tree,
        ).eqls(["*", "x", "y"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi2")].stateValues
                .immediateValue.tree,
        ).eqls(["*", "x", "y"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("_math1")].stateValues
                .value.tree,
        ).eqls(["*", "x", "y"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("_math2")].stateValues
                .value.tree,
        ).eqls(["+", ["*", "x", "y"], -1]);

        // enter new values in reffed
        await updateMathInputValue({
            latex: "qr",
            componentIdx: await resolvePathToNodeIdx("mi2"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("mi1")].stateValues
                    .rawRendererValue,
            ),
        ).eq("qr");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("mi2")].stateValues
                    .rawRendererValue,
            ),
        ).eq("qr");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1")].stateValues.value
                .tree,
        ).eqls(["*", "q", "r"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi2")].stateValues.value
                .tree,
        ).eqls(["*", "q", "r"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1")].stateValues
                .immediateValue.tree,
        ).eqls(["*", "q", "r"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi2")].stateValues
                .immediateValue.tree,
        ).eqls(["*", "q", "r"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("_math1")].stateValues
                .value.tree,
        ).eqls(["*", "q", "r"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("_math2")].stateValues
                .value.tree,
        ).eqls(["+", ["*", "q", "r"], -1]);
    });

    it("values revert if bind to value that is not updatable", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p>Original math: <math>1+<math>2x</math><math>z</math></math></p>
    <p>MathInput based on math: <mathInput bindValueTo="$_math1" name="mi1" /></p>
    <p>Copied mathInput: <mathInput extend="$mi1" name="mi2" /></p>
 
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("mi1")].stateValues
                    .rawRendererValue,
            ),
        ).eq("1+2xz");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("mi2")].stateValues
                    .rawRendererValue,
            ),
        ).eq("1+2xz");

        expect(
            stateVariables[await resolvePathToNodeIdx("mi1")].stateValues.value
                .tree,
        ).eqls(["+", 1, ["*", 2, "x", "z"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi2")].stateValues.value
                .tree,
        ).eqls(["+", 1, ["*", 2, "x", "z"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1")].stateValues
                .immediateValue.tree,
        ).eqls(["+", 1, ["*", 2, "x", "z"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi2")].stateValues
                .immediateValue.tree,
        ).eqls(["+", 1, ["*", 2, "x", "z"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("_math1")].stateValues
                .value.tree,
        ).eqls(["+", 1, ["*", 2, "x", "z"]]);

        // type new values
        await updateMathInputImmediateValue({
            latex: "xy",
            componentIdx: await resolvePathToNodeIdx("mi1"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("mi1")].stateValues
                    .rawRendererValue,
            ),
        ).eq("xy");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("mi2")].stateValues
                    .rawRendererValue,
            ),
        ).eq("xy");

        expect(
            stateVariables[await resolvePathToNodeIdx("mi1")].stateValues.value
                .tree,
        ).eqls(["+", 1, ["*", 2, "x", "z"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi2")].stateValues.value
                .tree,
        ).eqls(["+", 1, ["*", 2, "x", "z"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1")].stateValues
                .immediateValue.tree,
        ).eqls(["*", "x", "y"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi2")].stateValues
                .immediateValue.tree,
        ).eqls(["*", "x", "y"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("_math1")].stateValues
                .value.tree,
        ).eqls(["+", 1, ["*", 2, "x", "z"]]);

        // value revert when updateValue (e.g., update value)
        await updateMathInputValueToImmediateValue({
            componentIdx: await resolvePathToNodeIdx("mi1"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("mi1")].stateValues
                    .rawRendererValue,
            ),
        ).eq("1+2xz");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("mi2")].stateValues
                    .rawRendererValue,
            ),
        ).eq("1+2xz");

        expect(
            stateVariables[await resolvePathToNodeIdx("mi1")].stateValues.value
                .tree,
        ).eqls(["+", 1, ["*", 2, "x", "z"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi2")].stateValues.value
                .tree,
        ).eqls(["+", 1, ["*", 2, "x", "z"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1")].stateValues
                .immediateValue.tree,
        ).eqls(["+", 1, ["*", 2, "x", "z"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi2")].stateValues
                .immediateValue.tree,
        ).eqls(["+", 1, ["*", 2, "x", "z"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("_math1")].stateValues
                .value.tree,
        ).eqls(["+", 1, ["*", 2, "x", "z"]]);

        // type new values in copy

        await updateMathInputImmediateValue({
            latex: "qr",
            componentIdx: await resolvePathToNodeIdx("mi2"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("mi1")].stateValues
                    .rawRendererValue,
            ),
        ).eq("qr");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("mi2")].stateValues
                    .rawRendererValue,
            ),
        ).eq("qr");

        expect(
            stateVariables[await resolvePathToNodeIdx("mi1")].stateValues.value
                .tree,
        ).eqls(["+", 1, ["*", 2, "x", "z"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi2")].stateValues.value
                .tree,
        ).eqls(["+", 1, ["*", 2, "x", "z"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1")].stateValues
                .immediateValue.tree,
        ).eqls(["*", "q", "r"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi2")].stateValues
                .immediateValue.tree,
        ).eqls(["*", "q", "r"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("_math1")].stateValues
                .value.tree,
        ).eqls(["+", 1, ["*", 2, "x", "z"]]);

        // values revert when update value (e.g., blur)

        await updateMathInputValueToImmediateValue({
            componentIdx: await resolvePathToNodeIdx("mi2"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("mi1")].stateValues
                    .rawRendererValue,
            ),
        ).eq("1+2xz");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("mi2")].stateValues
                    .rawRendererValue,
            ),
        ).eq("1+2xz");

        expect(
            stateVariables[await resolvePathToNodeIdx("mi1")].stateValues.value
                .tree,
        ).eqls(["+", 1, ["*", 2, "x", "z"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi2")].stateValues.value
                .tree,
        ).eqls(["+", 1, ["*", 2, "x", "z"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1")].stateValues
                .immediateValue.tree,
        ).eqls(["+", 1, ["*", 2, "x", "z"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi2")].stateValues
                .immediateValue.tree,
        ).eqls(["+", 1, ["*", 2, "x", "z"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("_math1")].stateValues
                .value.tree,
        ).eqls(["+", 1, ["*", 2, "x", "z"]]);
    });

    it("values revert if bind to fixed value", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p>Original math: <math fixed>x</math></p>
    <p>MathInput based on math: <mathInput bindValueTo="$_math1" name="mi1" /></p>
    <p>Copied mathInput: <mathInput extend="$mi1" name="mi2" /></p>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("mi1")].stateValues
                    .rawRendererValue,
            ),
        ).eq("x");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("mi2")].stateValues
                    .rawRendererValue,
            ),
        ).eq("x");

        expect(
            stateVariables[await resolvePathToNodeIdx("mi1")].stateValues.value
                .tree,
        ).eq("x");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi2")].stateValues.value
                .tree,
        ).eq("x");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1")].stateValues
                .immediateValue.tree,
        ).eq("x");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi2")].stateValues
                .immediateValue.tree,
        ).eq("x");
        expect(
            stateVariables[await resolvePathToNodeIdx("_math1")].stateValues
                .value.tree,
        ).eq("x");

        // type new values
        await updateMathInputImmediateValue({
            latex: "y",
            componentIdx: await resolvePathToNodeIdx("mi1"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("mi1")].stateValues
                    .rawRendererValue,
            ),
        ).eq("y");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("mi2")].stateValues
                    .rawRendererValue,
            ),
        ).eq("y");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1")].stateValues.value
                .tree,
        ).eq("x");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi2")].stateValues.value
                .tree,
        ).eq("x");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1")].stateValues
                .immediateValue.tree,
        ).eq("y");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi2")].stateValues
                .immediateValue.tree,
        ).eq("y");
        expect(
            stateVariables[await resolvePathToNodeIdx("_math1")].stateValues
                .value.tree,
        ).eq("x");

        // value revert when update value (e.g., press enter)
        await updateMathInputValueToImmediateValue({
            componentIdx: await resolvePathToNodeIdx("mi1"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("mi1")].stateValues
                    .rawRendererValue,
            ),
        ).eq("x");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("mi2")].stateValues
                    .rawRendererValue,
            ),
        ).eq("x");

        expect(
            stateVariables[await resolvePathToNodeIdx("mi1")].stateValues.value
                .tree,
        ).eq("x");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi2")].stateValues.value
                .tree,
        ).eq("x");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1")].stateValues
                .immediateValue.tree,
        ).eq("x");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi2")].stateValues
                .immediateValue.tree,
        ).eq("x");
        expect(
            stateVariables[await resolvePathToNodeIdx("_math1")].stateValues
                .value.tree,
        ).eq("x");

        // type new values in copy
        await updateMathInputImmediateValue({
            latex: "z",
            componentIdx: await resolvePathToNodeIdx("mi2"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("mi1")].stateValues
                    .rawRendererValue,
            ),
        ).eq("z");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("mi2")].stateValues
                    .rawRendererValue,
            ),
        ).eq("z");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1")].stateValues.value
                .tree,
        ).eq("x");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi2")].stateValues.value
                .tree,
        ).eq("x");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1")].stateValues
                .immediateValue.tree,
        ).eq("z");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi2")].stateValues
                .immediateValue.tree,
        ).eq("z");
        expect(
            stateVariables[await resolvePathToNodeIdx("_math1")].stateValues
                .value.tree,
        ).eq("x");

        // values revert when update value (e.g., blur)
        await updateMathInputValueToImmediateValue({
            componentIdx: await resolvePathToNodeIdx("mi2"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("mi1")].stateValues
                    .rawRendererValue,
            ),
        ).eq("x");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("mi2")].stateValues
                    .rawRendererValue,
            ),
        ).eq("x");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1")].stateValues.value
                .tree,
        ).eq("x");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi2")].stateValues.value
                .tree,
        ).eq("x");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1")].stateValues
                .immediateValue.tree,
        ).eq("x");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi2")].stateValues
                .immediateValue.tree,
        ).eq("x");
        expect(
            stateVariables[await resolvePathToNodeIdx("_math1")].stateValues
                .value.tree,
        ).eq("x");
    });

    it("mathInput based on value of mathInput", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p>Original mathInput: <mathInput name="mi1" prefill="x+1"/></p>
    <p>mathInput based on mathInput: <mathInput bindValueTo="$mi1" name="mi2" /></p>
  `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("mi1")].stateValues
                    .rawRendererValue,
            ),
        ).eq("x+1");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("mi2")].stateValues
                    .rawRendererValue,
            ),
        ).eq("x+1");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1")].stateValues
                .immediateValue.tree,
        ).eqls(["+", "x", 1]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1")].stateValues.value
                .tree,
        ).eqls(["+", "x", 1]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi2")].stateValues
                .immediateValue.tree,
        ).eqls(["+", "x", 1]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi2")].stateValues.value
                .tree,
        ).eqls(["+", "x", 1]);

        // type 2 in first mathInput
        await updateMathInputImmediateValue({
            latex: "x+12",
            componentIdx: await resolvePathToNodeIdx("mi1"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("mi1")].stateValues
                    .rawRendererValue,
            ),
        ).eq("x+12");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("mi2")].stateValues
                    .rawRendererValue,
            ),
        ).eq("x+1");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1")].stateValues
                .immediateValue.tree,
        ).eqls(["+", "x", 12]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1")].stateValues.value
                .tree,
        ).eqls(["+", "x", 1]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi2")].stateValues
                .immediateValue.tree,
        ).eqls(["+", "x", 1]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi2")].stateValues.value
                .tree,
        ).eqls(["+", "x", 1]);

        // update value (e.g., press enter)
        await updateMathInputValueToImmediateValue({
            componentIdx: await resolvePathToNodeIdx("mi1"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("mi1")].stateValues
                    .rawRendererValue,
            ),
        ).eq("x+12");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("mi2")].stateValues
                    .rawRendererValue,
            ),
        ).eq("x+12");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1")].stateValues
                .immediateValue.tree,
        ).eqls(["+", "x", 12]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1")].stateValues.value
                .tree,
        ).eqls(["+", "x", 12]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi2")].stateValues
                .immediateValue.tree,
        ).eqls(["+", "x", 12]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi2")].stateValues.value
                .tree,
        ).eqls(["+", "x", 12]);

        // type 3 in second mathInput
        await updateMathInputImmediateValue({
            latex: "x+123",
            componentIdx: await resolvePathToNodeIdx("mi2"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("mi1")].stateValues
                    .rawRendererValue,
            ),
        ).eq("x+12");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("mi2")].stateValues
                    .rawRendererValue,
            ),
        ).eq("x+123");

        expect(
            stateVariables[await resolvePathToNodeIdx("mi1")].stateValues
                .immediateValue.tree,
        ).eqls(["+", "x", 12]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1")].stateValues.value
                .tree,
        ).eqls(["+", "x", 12]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi2")].stateValues
                .immediateValue.tree,
        ).eqls(["+", "x", 123]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi2")].stateValues.value
                .tree,
        ).eqls(["+", "x", 12]);

        // update value (e.g., blur)
        await updateMathInputValueToImmediateValue({
            componentIdx: await resolvePathToNodeIdx("mi2"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("mi1")].stateValues
                    .rawRendererValue,
            ),
        ).eq("x+123");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("mi2")].stateValues
                    .rawRendererValue,
            ),
        ).eq("x+123");

        expect(
            stateVariables[await resolvePathToNodeIdx("mi1")].stateValues
                .immediateValue.tree,
        ).eqls(["+", "x", 123]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1")].stateValues.value
                .tree,
        ).eqls(["+", "x", 123]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi2")].stateValues
                .immediateValue.tree,
        ).eqls(["+", "x", 123]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi2")].stateValues.value
                .tree,
        ).eqls(["+", "x", 123]);
    });

    it("mathInput based on immediate value of mathInput", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p>Original mathInput: <mathInput name="mi1" prefill="x+1"/></p>
    <p>mathInput based on mathInput: <mathInput bindValueTo="$mi1.immediateValue" name="mi2" /></p>
  `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("mi1")].stateValues
                    .rawRendererValue,
            ),
        ).eq("x+1");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("mi2")].stateValues
                    .rawRendererValue,
            ),
        ).eq("x+1");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1")].stateValues
                .immediateValue.tree,
        ).eqls(["+", "x", 1]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1")].stateValues.value
                .tree,
        ).eqls(["+", "x", 1]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi2")].stateValues
                .immediateValue.tree,
        ).eqls(["+", "x", 1]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi2")].stateValues.value
                .tree,
        ).eqls(["+", "x", 1]);

        // type 2 in first mathInput
        await updateMathInputImmediateValue({
            latex: "x+12",
            componentIdx: await resolvePathToNodeIdx("mi1"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("mi1")].stateValues
                    .rawRendererValue,
            ),
        ).eq("x+12");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("mi2")].stateValues
                    .rawRendererValue,
            ),
        ).eq("x+12");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1")].stateValues
                .immediateValue.tree,
        ).eqls(["+", "x", 12]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1")].stateValues.value
                .tree,
        ).eqls(["+", "x", 1]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi2")].stateValues
                .immediateValue.tree,
        ).eqls(["+", "x", 12]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi2")].stateValues.value
                .tree,
        ).eqls(["+", "x", 12]);

        // update value (e.g., press enter)
        await updateMathInputValueToImmediateValue({
            componentIdx: await resolvePathToNodeIdx("mi1"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("mi1")].stateValues
                    .rawRendererValue,
            ),
        ).eq("x+12");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("mi2")].stateValues
                    .rawRendererValue,
            ),
        ).eq("x+12");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1")].stateValues
                .immediateValue.tree,
        ).eqls(["+", "x", 12]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1")].stateValues.value
                .tree,
        ).eqls(["+", "x", 12]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi2")].stateValues
                .immediateValue.tree,
        ).eqls(["+", "x", 12]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi2")].stateValues.value
                .tree,
        ).eqls(["+", "x", 12]);

        // type 3 in second mathInput
        await updateMathInputImmediateValue({
            latex: "x+123",
            componentIdx: await resolvePathToNodeIdx("mi2"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("mi1")].stateValues
                    .rawRendererValue,
            ),
        ).eq("x+12");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("mi2")].stateValues
                    .rawRendererValue,
            ),
        ).eq("x+123");

        expect(
            stateVariables[await resolvePathToNodeIdx("mi1")].stateValues
                .immediateValue.tree,
        ).eqls(["+", "x", 12]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1")].stateValues.value
                .tree,
        ).eqls(["+", "x", 12]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi2")].stateValues
                .immediateValue.tree,
        ).eqls(["+", "x", 123]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi2")].stateValues.value
                .tree,
        ).eqls(["+", "x", 12]);

        // update value (e.g., blur)
        await updateMathInputValueToImmediateValue({
            componentIdx: await resolvePathToNodeIdx("mi2"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("mi1")].stateValues
                    .rawRendererValue,
            ),
        ).eq("x+123");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("mi2")].stateValues
                    .rawRendererValue,
            ),
        ).eq("x+123");

        expect(
            stateVariables[await resolvePathToNodeIdx("mi1")].stateValues
                .immediateValue.tree,
        ).eqls(["+", "x", 123]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1")].stateValues.value
                .tree,
        ).eqls(["+", "x", 123]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi2")].stateValues
                .immediateValue.tree,
        ).eqls(["+", "x", 123]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi2")].stateValues.value
                .tree,
        ).eqls(["+", "x", 123]);
    });

    it("accurately reduce vector length", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <text>Enter vector</text>
    <mathInput name="a"/>
    <math extend="$a.value" name="b" />
    `,
        });

        // verify fixed bug where didn't reduce size of a vector

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("a")].stateValues
                    .rawRendererValue,
            ),
        ).eq("");

        await updateMathInputValue({
            latex: "(1,2,3)",
            componentIdx: await resolvePathToNodeIdx("a"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("b")].stateValues
                    .latex,
            ),
        ).eq("(1,2,3)");

        await updateMathInputValue({
            latex: "(2,3)",
            componentIdx: await resolvePathToNodeIdx("a"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("b")].stateValues
                    .latex,
            ),
        ).eq("(2,3)");
    });

    it("function symbols", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p>f, g: <mathInput name="a"/></p>
    <p><math extend="$a.value" name="a2" /></p>

    <p>h, q: <mathInput name="b" functionSymbols="h q" /></p>
    <p><math extend="$b.value" name="b2" /></p>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("a2")].stateValues.value
                .tree,
        ).eqls("\uff3f");
        expect(
            stateVariables[await resolvePathToNodeIdx("b2")].stateValues.value
                .tree,
        ).eqls("\uff3f");

        await updateMathInputValue({
            latex: "f(x)",
            componentIdx: await resolvePathToNodeIdx("a"),
            core,
        });
        await updateMathInputValue({
            latex: "f(x)",
            componentIdx: await resolvePathToNodeIdx("b"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("a")].stateValues.value
                .tree,
        ).eqls(["apply", "f", "x"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("a2")].stateValues.value
                .tree,
        ).eqls(["apply", "f", "x"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("b")].stateValues.value
                .tree,
        ).eqls(["*", "f", "x"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("b2")].stateValues.value
                .tree,
        ).eqls(["*", "f", "x"]);

        await updateMathInputValue({
            latex: "g(f)",
            componentIdx: await resolvePathToNodeIdx("a"),
            core,
        });
        await updateMathInputValue({
            latex: "g(f)",
            componentIdx: await resolvePathToNodeIdx("b"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("a")].stateValues.value
                .tree,
        ).eqls(["apply", "g", "f"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("a2")].stateValues.value
                .tree,
        ).eqls(["apply", "g", "f"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("b")].stateValues.value
                .tree,
        ).eqls(["*", "g", "f"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("b2")].stateValues.value
                .tree,
        ).eqls(["*", "g", "f"]);

        await updateMathInputValue({
            latex: "h(q)",
            componentIdx: await resolvePathToNodeIdx("a"),
            core,
        });
        await updateMathInputValue({
            latex: "h(q)",
            componentIdx: await resolvePathToNodeIdx("b"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("a")].stateValues.value
                .tree,
        ).eqls(["*", "h", "q"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("a2")].stateValues.value
                .tree,
        ).eqls(["*", "h", "q"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("b")].stateValues.value
                .tree,
        ).eqls(["apply", "h", "q"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("b2")].stateValues.value
                .tree,
        ).eqls(["apply", "h", "q"]);

        await updateMathInputValue({
            latex: "q(z)",
            componentIdx: await resolvePathToNodeIdx("a"),
            core,
        });
        await updateMathInputValue({
            latex: "q(z)",
            componentIdx: await resolvePathToNodeIdx("b"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("a")].stateValues.value
                .tree,
        ).eqls(["*", "q", "z"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("a2")].stateValues.value
                .tree,
        ).eqls(["*", "q", "z"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("b")].stateValues.value
                .tree,
        ).eqls(["apply", "q", "z"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("b2")].stateValues.value
                .tree,
        ).eqls(["apply", "q", "z"]);
    });

    it("display digits", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <text>a</text>
    <p>a: <mathInput name="a" displayDigits="5" prefill="sin(2x)"/></p>
    <p>a2: <math extend="$a.value" name="a2" /></p>
    <p>a3: <math extend="$a.immediateValue" name="a3" /></p>
    <p>a4: <math extend="$a.value" name="a4" displayDigits="16" /></p>
    <p>a5: <math extend="$a.immediateValue" name="a5" displayDigits="16" /></p>

    <p>b: <math name="b" displayDigits="10">10e^(3y)</math></p>
    <p>b2: <mathInput name="b2" bindValueTo="$b"  displayDigits="3" /></p>
    <p>b3: <math extend="$b2.value" name="b3" /></p>
    <p>b4: <math extend="$b2.immediateValue" name="b4" /></p>
    <p>b5: <math extend="$b2.value" name="b5" displayDigits="16" /></p>
    <p>b6: <math extend="$b2.immediateValue" name="b6" displayDigits="16" /></p>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("a")].stateValues
                    .rawRendererValue,
            ),
        ).eq("\\sin(2x)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("a2")].stateValues
                    .latex,
            ),
        ).eq("\\sin(2x)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("a3")].stateValues
                    .latex,
            ),
        ).eq("\\sin(2x)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("a4")].stateValues
                    .latex,
            ),
        ).eq("\\sin(2x)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("a5")].stateValues
                    .latex,
            ),
        ).eq("\\sin(2x)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("b")].stateValues
                    .latex,
            ),
        ).eq("10e^{3y}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("b2")].stateValues
                    .rawRendererValue,
            ),
        ).eq("10e^{3y}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("b3")].stateValues
                    .latex,
            ),
        ).eq("10e^{3y}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("b4")].stateValues
                    .latex,
            ),
        ).eq("10e^{3y}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("b5")].stateValues
                    .latex,
            ),
        ).eq("10e^{3y}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("b6")].stateValues
                    .latex,
            ),
        ).eq("10e^{3y}");

        expect(
            stateVariables[await resolvePathToNodeIdx("a")].stateValues.value
                .tree,
        ).eqls(["apply", "sin", ["*", 2, "x"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("a")].stateValues
                .valueForDisplay.tree,
        ).eqls(["apply", "sin", ["*", 2, "x"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("a2")].stateValues.value
                .tree,
        ).eqls(["apply", "sin", ["*", 2, "x"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("a2")].stateValues
                .valueForDisplay.tree,
        ).eqls(["apply", "sin", ["*", 2, "x"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("a3")].stateValues.value
                .tree,
        ).eqls(["apply", "sin", ["*", 2, "x"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("a3")].stateValues
                .valueForDisplay.tree,
        ).eqls(["apply", "sin", ["*", 2, "x"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("a4")].stateValues.value
                .tree,
        ).eqls(["apply", "sin", ["*", 2, "x"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("a4")].stateValues
                .valueForDisplay.tree,
        ).eqls(["apply", "sin", ["*", 2, "x"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("a5")].stateValues.value
                .tree,
        ).eqls(["apply", "sin", ["*", 2, "x"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("a5")].stateValues
                .valueForDisplay.tree,
        ).eqls(["apply", "sin", ["*", 2, "x"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("b")].stateValues.value
                .tree,
        ).eqls(["*", 10, ["^", "e", ["*", 3, "y"]]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("b2")].stateValues.value
                .tree,
        ).eqls(["*", 10, ["^", "e", ["*", 3, "y"]]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("b2")].stateValues
                .valueForDisplay.tree,
        ).eqls(["*", 10, ["^", "e", ["*", 3, "y"]]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("b3")].stateValues.value
                .tree,
        ).eqls(["*", 10, ["^", "e", ["*", 3, "y"]]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("b3")].stateValues
                .valueForDisplay.tree,
        ).eqls(["*", 10, ["^", "e", ["*", 3, "y"]]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("b4")].stateValues.value
                .tree,
        ).eqls(["*", 10, ["^", "e", ["*", 3, "y"]]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("b4")].stateValues
                .valueForDisplay.tree,
        ).eqls(["*", 10, ["^", "e", ["*", 3, "y"]]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("b5")].stateValues.value
                .tree,
        ).eqls(["*", 10, ["^", "e", ["*", 3, "y"]]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("b5")].stateValues
                .valueForDisplay.tree,
        ).eqls(["*", 10, ["^", "e", ["*", 3, "y"]]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("b6")].stateValues.value
                .tree,
        ).eqls(["*", 10, ["^", "e", ["*", 3, "y"]]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("b6")].stateValues
                .valueForDisplay.tree,
        ).eqls(["*", 10, ["^", "e", ["*", 3, "y"]]]);

        await updateMathInputImmediateValue({
            latex: "\\sin(345.15389319x)",
            componentIdx: await resolvePathToNodeIdx("a"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("a")].stateValues
                    .rawRendererValue,
            ),
        ).eq("\\sin(345.15389319x)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("a2")].stateValues
                    .latex,
            ),
        ).eq("\\sin(2x)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("a3")].stateValues
                    .latex,
            ),
        ).eq("\\sin(345.15x)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("a4")].stateValues
                    .latex,
            ),
        ).eq("\\sin(2x)");

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("a5")].stateValues
                    .latex,
            ),
        ).eq("\\sin(345.15389319x)");

        await updateMathInputValueToImmediateValue({
            componentIdx: await resolvePathToNodeIdx("a"),
            core,
        });
        await updateMathInputImmediateValue({
            latex: "2.047529344518e^{0.0000073013048309y}",
            componentIdx: await resolvePathToNodeIdx("b2"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("a")].stateValues
                    .rawRendererValue,
            ),
        ).eq("\\sin(345.15x)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("a2")].stateValues
                    .latex,
            ),
        ).eq("\\sin(345.15x)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("a3")].stateValues
                    .latex,
            ),
        ).eq("\\sin(345.15x)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("a4")].stateValues
                    .latex,
            ),
        ).eq("\\sin(345.15389319x)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("a5")].stateValues
                    .latex,
            ),
        ).eq("\\sin(345.15389319x)");

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("b")].stateValues
                    .latex,
            ),
        ).eq("10e^{3y}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("b2")].stateValues
                    .rawRendererValue,
            ),
        ).eq("2.047529344518e^{0.0000073013048309y}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("b3")].stateValues
                    .latex,
            ),
        ).eq("10e^{3y}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("b4")].stateValues
                    .latex,
            ),
        ).eq("2.05e^{0.0000073y}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("b5")].stateValues
                    .latex,
            ),
        ).eq("10e^{3y}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("b6")].stateValues
                    .latex,
            ),
        ).eq("2.047529344518e^{0.0000073013048309y}");

        await updateMathInputValueToImmediateValue({
            componentIdx: await resolvePathToNodeIdx("b2"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("b")].stateValues
                    .latex,
            ),
        ).eq("2.047529345e^{0.000007301304831y}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("b2")].stateValues
                    .rawRendererValue,
            ),
        ).eq("2.05e^{0.0000073y}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("b3")].stateValues
                    .latex,
            ),
        ).eq("2.05e^{0.0000073y}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("b4")].stateValues
                    .latex,
            ),
        ).eq("2.05e^{0.0000073y}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("b5")].stateValues
                    .latex,
            ),
        ).eq("2.047529344518e^{0.0000073013048309y}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("b6")].stateValues
                    .latex,
            ),
        ).eq("2.047529344518e^{0.0000073013048309y}");

        expect(
            stateVariables[await resolvePathToNodeIdx("a")].stateValues.value
                .tree,
        ).eqls(["apply", "sin", ["*", 345.15389319, "x"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("a")].stateValues
                .valueForDisplay.tree,
        ).eqls(["apply", "sin", ["*", 345.15, "x"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("a2")].stateValues.value
                .tree,
        ).eqls(["apply", "sin", ["*", 345.15389319, "x"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("a2")].stateValues
                .valueForDisplay.tree,
        ).eqls(["apply", "sin", ["*", 345.15, "x"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("a3")].stateValues.value
                .tree,
        ).eqls(["apply", "sin", ["*", 345.15389319, "x"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("a3")].stateValues
                .valueForDisplay.tree,
        ).eqls(["apply", "sin", ["*", 345.15, "x"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("a4")].stateValues.value
                .tree,
        ).eqls(["apply", "sin", ["*", 345.15389319, "x"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("a4")].stateValues
                .valueForDisplay.tree,
        ).eqls(["apply", "sin", ["*", 345.15389319, "x"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("a5")].stateValues.value
                .tree,
        ).eqls(["apply", "sin", ["*", 345.15389319, "x"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("a5")].stateValues
                .valueForDisplay.tree,
        ).eqls(["apply", "sin", ["*", 345.15389319, "x"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("b")].stateValues.value
                .tree,
        ).eqls([
            "*",
            2.047529344518,
            ["^", "e", ["*", 0.0000073013048309, "y"]],
        ]);
        expect(
            stateVariables[await resolvePathToNodeIdx("b2")].stateValues.value
                .tree,
        ).eqls([
            "*",
            2.047529344518,
            ["^", "e", ["*", 0.0000073013048309, "y"]],
        ]);
        expect(
            stateVariables[await resolvePathToNodeIdx("b2")].stateValues
                .valueForDisplay.tree,
        ).eqls(["*", 2.05, ["^", "e", ["*", 0.0000073, "y"]]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("b3")].stateValues.value
                .tree,
        ).eqls([
            "*",
            2.047529344518,
            ["^", "e", ["*", 0.0000073013048309, "y"]],
        ]);
        expect(
            stateVariables[await resolvePathToNodeIdx("b3")].stateValues
                .valueForDisplay.tree,
        ).eqls(["*", 2.05, ["^", "e", ["*", 0.0000073, "y"]]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("b4")].stateValues.value
                .tree,
        ).eqls([
            "*",
            2.047529344518,
            ["^", "e", ["*", 0.0000073013048309, "y"]],
        ]);
        expect(
            stateVariables[await resolvePathToNodeIdx("b4")].stateValues
                .valueForDisplay.tree,
        ).eqls(["*", 2.05, ["^", "e", ["*", 0.0000073, "y"]]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("b5")].stateValues.value
                .tree,
        ).eqls([
            "*",
            2.047529344518,
            ["^", "e", ["*", 0.0000073013048309, "y"]],
        ]);
        expect(
            stateVariables[await resolvePathToNodeIdx("b5")].stateValues
                .valueForDisplay.tree,
        ).eqls([
            "*",
            2.047529344518,
            ["^", "e", ["*", 0.0000073013048309, "y"]],
        ]);
        expect(
            stateVariables[await resolvePathToNodeIdx("b6")].stateValues.value
                .tree,
        ).eqls([
            "*",
            2.047529344518,
            ["^", "e", ["*", 0.0000073013048309, "y"]],
        ]);
        expect(
            stateVariables[await resolvePathToNodeIdx("b6")].stateValues
                .valueForDisplay.tree,
        ).eqls([
            "*",
            2.047529344518,
            ["^", "e", ["*", 0.0000073013048309, "y"]],
        ]);

        await updateMathInputImmediateValue({
            latex: "\\sin(345.14x)",
            componentIdx: await resolvePathToNodeIdx("a"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("a")].stateValues
                    .rawRendererValue,
            ),
        ).eq("\\sin(345.14x)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("a2")].stateValues
                    .latex,
            ),
        ).eq("\\sin(345.15x)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("a3")].stateValues
                    .latex,
            ),
        ).eq("\\sin(345.14x)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("a4")].stateValues
                    .latex,
            ),
        ).eq("\\sin(345.15389319x)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("a5")].stateValues
                    .latex,
            ),
        ).eq("\\sin(345.14x)");

        expect(
            stateVariables[await resolvePathToNodeIdx("a")].stateValues.value
                .tree,
        ).eqls(["apply", "sin", ["*", 345.15389319, "x"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("a")].stateValues
                .valueForDisplay.tree,
        ).eqls(["apply", "sin", ["*", 345.15, "x"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("a2")].stateValues.value
                .tree,
        ).eqls(["apply", "sin", ["*", 345.15389319, "x"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("a2")].stateValues
                .valueForDisplay.tree,
        ).eqls(["apply", "sin", ["*", 345.15, "x"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("a3")].stateValues.value
                .tree,
        ).eqls(["apply", "sin", ["*", 345.14, "x"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("a3")].stateValues
                .valueForDisplay.tree,
        ).eqls(["apply", "sin", ["*", 345.14, "x"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("a4")].stateValues.value
                .tree,
        ).eqls(["apply", "sin", ["*", 345.15389319, "x"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("a4")].stateValues
                .valueForDisplay.tree,
        ).eqls(["apply", "sin", ["*", 345.15389319, "x"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("a5")].stateValues.value
                .tree,
        ).eqls(["apply", "sin", ["*", 345.14, "x"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("a5")].stateValues
                .valueForDisplay.tree,
        ).eqls(["apply", "sin", ["*", 345.14, "x"]]);

        await updateMathInputValueToImmediateValue({
            componentIdx: await resolvePathToNodeIdx("a"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("a")].stateValues
                    .rawRendererValue,
            ),
        ).eq("\\sin(345.14x)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("a2")].stateValues
                    .latex,
            ),
        ).eq("\\sin(345.14x)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("a3")].stateValues
                    .latex,
            ),
        ).eq("\\sin(345.14x)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("a4")].stateValues
                    .latex,
            ),
        ).eq("\\sin(345.14x)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("a5")].stateValues
                    .latex,
            ),
        ).eq("\\sin(345.14x)");

        expect(
            stateVariables[await resolvePathToNodeIdx("a")].stateValues.value
                .tree,
        ).eqls(["apply", "sin", ["*", 345.14, "x"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("a")].stateValues
                .valueForDisplay.tree,
        ).eqls(["apply", "sin", ["*", 345.14, "x"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("a2")].stateValues.value
                .tree,
        ).eqls(["apply", "sin", ["*", 345.14, "x"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("a2")].stateValues
                .valueForDisplay.tree,
        ).eqls(["apply", "sin", ["*", 345.14, "x"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("a3")].stateValues.value
                .tree,
        ).eqls(["apply", "sin", ["*", 345.14, "x"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("a3")].stateValues
                .valueForDisplay.tree,
        ).eqls(["apply", "sin", ["*", 345.14, "x"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("a4")].stateValues.value
                .tree,
        ).eqls(["apply", "sin", ["*", 345.14, "x"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("a4")].stateValues
                .valueForDisplay.tree,
        ).eqls(["apply", "sin", ["*", 345.14, "x"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("a5")].stateValues.value
                .tree,
        ).eqls(["apply", "sin", ["*", 345.14, "x"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("a5")].stateValues
                .valueForDisplay.tree,
        ).eqls(["apply", "sin", ["*", 345.14, "x"]]);

        await updateMathInputImmediateValue({
            latex: "6.05e^{0.0000073y}",
            componentIdx: await resolvePathToNodeIdx("b2"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("b")].stateValues
                    .latex,
            ),
        ).eq("2.047529345e^{0.000007301304831y}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("b2")].stateValues
                    .rawRendererValue,
            ),
        ).eq("6.05e^{0.0000073y}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("b3")].stateValues
                    .latex,
            ),
        ).eq("2.05e^{0.0000073y}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("b4")].stateValues
                    .latex,
            ),
        ).eq("6.05e^{0.0000073y}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("b5")].stateValues
                    .latex,
            ),
        ).eq("2.047529344518e^{0.0000073013048309y}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("b6")].stateValues
                    .latex,
            ),
        ).eq("6.05e^{0.0000073y}");

        expect(
            stateVariables[await resolvePathToNodeIdx("b")].stateValues.value
                .tree,
        ).eqls([
            "*",
            2.047529344518,
            ["^", "e", ["*", 0.0000073013048309, "y"]],
        ]);
        expect(
            stateVariables[await resolvePathToNodeIdx("b2")].stateValues.value
                .tree,
        ).eqls([
            "*",
            2.047529344518,
            ["^", "e", ["*", 0.0000073013048309, "y"]],
        ]);
        expect(
            stateVariables[await resolvePathToNodeIdx("b2")].stateValues
                .valueForDisplay.tree,
        ).eqls(["*", 2.05, ["^", "e", ["*", 0.0000073, "y"]]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("b3")].stateValues.value
                .tree,
        ).eqls([
            "*",
            2.047529344518,
            ["^", "e", ["*", 0.0000073013048309, "y"]],
        ]);
        expect(
            stateVariables[await resolvePathToNodeIdx("b3")].stateValues
                .valueForDisplay.tree,
        ).eqls(["*", 2.05, ["^", "e", ["*", 0.0000073, "y"]]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("b4")].stateValues.value
                .tree,
        ).eqls(["*", 6.05, ["^", "e", ["*", 0.0000073, "y"]]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("b4")].stateValues
                .valueForDisplay.tree,
        ).eqls(["*", 6.05, ["^", "e", ["*", 0.0000073, "y"]]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("b5")].stateValues.value
                .tree,
        ).eqls([
            "*",
            2.047529344518,
            ["^", "e", ["*", 0.0000073013048309, "y"]],
        ]);
        expect(
            stateVariables[await resolvePathToNodeIdx("b5")].stateValues
                .valueForDisplay.tree,
        ).eqls([
            "*",
            2.047529344518,
            ["^", "e", ["*", 0.0000073013048309, "y"]],
        ]);
        expect(
            stateVariables[await resolvePathToNodeIdx("b6")].stateValues.value
                .tree,
        ).eqls(["*", 6.05, ["^", "e", ["*", 0.0000073, "y"]]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("b6")].stateValues
                .valueForDisplay.tree,
        ).eqls(["*", 6.05, ["^", "e", ["*", 0.0000073, "y"]]]);

        await updateMathInputValueToImmediateValue({
            componentIdx: await resolvePathToNodeIdx("b2"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("b")].stateValues
                    .latex,
            ),
        ).eq("6.05e^{0.0000073y}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("b2")].stateValues
                    .rawRendererValue,
            ),
        ).eq("6.05e^{0.0000073y}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("b3")].stateValues
                    .latex,
            ),
        ).eq("6.05e^{0.0000073y}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("b4")].stateValues
                    .latex,
            ),
        ).eq("6.05e^{0.0000073y}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("b5")].stateValues
                    .latex,
            ),
        ).eq("6.05e^{0.0000073y}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("b6")].stateValues
                    .latex,
            ),
        ).eq("6.05e^{0.0000073y}");

        expect(
            stateVariables[await resolvePathToNodeIdx("b")].stateValues.value
                .tree,
        ).eqls(["*", 6.05, ["^", "e", ["*", 0.0000073, "y"]]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("b2")].stateValues.value
                .tree,
        ).eqls(["*", 6.05, ["^", "e", ["*", 0.0000073, "y"]]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("b2")].stateValues
                .valueForDisplay.tree,
        ).eqls(["*", 6.05, ["^", "e", ["*", 0.0000073, "y"]]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("b3")].stateValues.value
                .tree,
        ).eqls(["*", 6.05, ["^", "e", ["*", 0.0000073, "y"]]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("b3")].stateValues
                .valueForDisplay.tree,
        ).eqls(["*", 6.05, ["^", "e", ["*", 0.0000073, "y"]]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("b4")].stateValues.value
                .tree,
        ).eqls(["*", 6.05, ["^", "e", ["*", 0.0000073, "y"]]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("b4")].stateValues
                .valueForDisplay.tree,
        ).eqls(["*", 6.05, ["^", "e", ["*", 0.0000073, "y"]]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("b5")].stateValues.value
                .tree,
        ).eqls(["*", 6.05, ["^", "e", ["*", 0.0000073, "y"]]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("b5")].stateValues
                .valueForDisplay.tree,
        ).eqls(["*", 6.05, ["^", "e", ["*", 0.0000073, "y"]]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("b6")].stateValues.value
                .tree,
        ).eqls(["*", 6.05, ["^", "e", ["*", 0.0000073, "y"]]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("b6")].stateValues
                .valueForDisplay.tree,
        ).eqls(["*", 6.05, ["^", "e", ["*", 0.0000073, "y"]]]);
    });

    it("display decimals", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p>a: <mathInput name="a" displayDecimals="2" prefill="sin(2x)"/></p>
    <p>a2: <math extend="$a.value" name="a2" /></p>
    <p>a3: <math extend="$a.immediateValue" name="a3" /></p>

    <p>b: <math name="b" displayDigits="10">10e^(3y)</math></p>
    <p>b2: <mathInput name="b2" bindValueTo="$b" displayDecimals="8" /></p>
    <p>b3: <math extend="$b2.value" name="b3" /></p>
    <p>b4: <math extend="$b2.immediateValue" name="b4" /></p>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("a")].stateValues
                    .rawRendererValue,
            ),
        ).eq("\\sin(2x)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("a2")].stateValues
                    .latex,
            ),
        ).eq("\\sin(2x)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("a3")].stateValues
                    .latex,
            ),
        ).eq("\\sin(2x)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("b")].stateValues
                    .latex,
            ),
        ).eq("10e^{3y}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("b2")].stateValues
                    .rawRendererValue,
            ),
        ).eq("10e^{3y}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("b3")].stateValues
                    .latex,
            ),
        ).eq("10e^{3y}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("b4")].stateValues
                    .latex,
            ),
        ).eq("10e^{3y}");

        expect(
            stateVariables[await resolvePathToNodeIdx("a")].stateValues.value
                .tree,
        ).eqls(["apply", "sin", ["*", 2, "x"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("a")].stateValues
                .valueForDisplay.tree,
        ).eqls(["apply", "sin", ["*", 2, "x"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("a2")].stateValues.value
                .tree,
        ).eqls(["apply", "sin", ["*", 2, "x"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("a2")].stateValues
                .valueForDisplay.tree,
        ).eqls(["apply", "sin", ["*", 2, "x"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("a3")].stateValues.value
                .tree,
        ).eqls(["apply", "sin", ["*", 2, "x"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("a3")].stateValues
                .valueForDisplay.tree,
        ).eqls(["apply", "sin", ["*", 2, "x"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("b")].stateValues.value
                .tree,
        ).eqls(["*", 10, ["^", "e", ["*", 3, "y"]]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("b2")].stateValues.value
                .tree,
        ).eqls(["*", 10, ["^", "e", ["*", 3, "y"]]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("b2")].stateValues
                .valueForDisplay.tree,
        ).eqls(["*", 10, ["^", "e", ["*", 3, "y"]]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("b3")].stateValues.value
                .tree,
        ).eqls(["*", 10, ["^", "e", ["*", 3, "y"]]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("b3")].stateValues
                .valueForDisplay.tree,
        ).eqls(["*", 10, ["^", "e", ["*", 3, "y"]]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("b4")].stateValues.value
                .tree,
        ).eqls(["*", 10, ["^", "e", ["*", 3, "y"]]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("b4")].stateValues
                .valueForDisplay.tree,
        ).eqls(["*", 10, ["^", "e", ["*", 3, "y"]]]);

        await updateMathInputImmediateValue({
            latex: "\\sin(345.15389319x)",
            componentIdx: await resolvePathToNodeIdx("a"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("a")].stateValues
                    .rawRendererValue,
            ),
        ).eq("\\sin(345.15389319x)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("a2")].stateValues
                    .latex,
            ),
        ).eq("\\sin(2x)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("a3")].stateValues
                    .latex,
            ),
        ).eq("\\sin(345.15x)");

        await updateMathInputValueToImmediateValue({
            componentIdx: await resolvePathToNodeIdx("a"),
            core,
        });
        await updateMathInputImmediateValue({
            latex: "2.047529344518e^{0.0000073013048309y}",
            componentIdx: await resolvePathToNodeIdx("b2"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("a")].stateValues
                    .rawRendererValue,
            ),
        ).eq("\\sin(345.15x)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("a2")].stateValues
                    .latex,
            ),
        ).eq("\\sin(345.15x)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("a3")].stateValues
                    .latex,
            ),
        ).eq("\\sin(345.15x)");

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("b")].stateValues
                    .latex,
            ),
        ).eq("10e^{3y}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("b2")].stateValues
                    .rawRendererValue,
            ),
        ).eq("2.047529344518e^{0.0000073013048309y}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("b3")].stateValues
                    .latex,
            ),
        ).eq("10e^{3y}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("b4")].stateValues
                    .latex,
            ),
        ).eq("2.04752934e^{0.0000073y}");

        await updateMathInputValueToImmediateValue({
            componentIdx: await resolvePathToNodeIdx("b2"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("b")].stateValues
                    .latex,
            ),
        ).eq("2.047529345e^{0.000007301304831y}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("b2")].stateValues
                    .rawRendererValue,
            ),
        ).eq("2.04752934e^{0.0000073y}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("b3")].stateValues
                    .latex,
            ),
        ).eq("2.04752934e^{0.0000073y}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("b4")].stateValues
                    .latex,
            ),
        ).eq("2.04752934e^{0.0000073y}");

        expect(
            stateVariables[await resolvePathToNodeIdx("a")].stateValues.value
                .tree,
        ).eqls(["apply", "sin", ["*", 345.15389319, "x"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("a")].stateValues
                .valueForDisplay.tree,
        ).eqls(["apply", "sin", ["*", 345.15, "x"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("a2")].stateValues.value
                .tree,
        ).eqls(["apply", "sin", ["*", 345.15389319, "x"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("a2")].stateValues
                .valueForDisplay.tree,
        ).eqls(["apply", "sin", ["*", 345.15, "x"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("a3")].stateValues.value
                .tree,
        ).eqls(["apply", "sin", ["*", 345.15389319, "x"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("a3")].stateValues
                .valueForDisplay.tree,
        ).eqls(["apply", "sin", ["*", 345.15, "x"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("b")].stateValues.value
                .tree,
        ).eqls([
            "*",
            2.047529344518,
            ["^", "e", ["*", 0.0000073013048309, "y"]],
        ]);
        expect(
            stateVariables[await resolvePathToNodeIdx("b2")].stateValues.value
                .tree,
        ).eqls([
            "*",
            2.047529344518,
            ["^", "e", ["*", 0.0000073013048309, "y"]],
        ]);
        expect(
            stateVariables[await resolvePathToNodeIdx("b2")].stateValues
                .valueForDisplay.tree,
        ).eqls(["*", 2.04752934, ["^", "e", ["*", 0.0000073, "y"]]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("b3")].stateValues.value
                .tree,
        ).eqls([
            "*",
            2.047529344518,
            ["^", "e", ["*", 0.0000073013048309, "y"]],
        ]);
        expect(
            stateVariables[await resolvePathToNodeIdx("b3")].stateValues
                .valueForDisplay.tree,
        ).eqls(["*", 2.04752934, ["^", "e", ["*", 0.0000073, "y"]]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("b4")].stateValues.value
                .tree,
        ).eqls([
            "*",
            2.047529344518,
            ["^", "e", ["*", 0.0000073013048309, "y"]],
        ]);
        expect(
            stateVariables[await resolvePathToNodeIdx("b4")].stateValues
                .valueForDisplay.tree,
        ).eqls(["*", 2.04752934, ["^", "e", ["*", 0.0000073, "y"]]]);

        await updateMathInputImmediateValue({
            latex: "\\sin(345.14x)",
            componentIdx: await resolvePathToNodeIdx("a"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("a")].stateValues
                    .rawRendererValue,
            ),
        ).eq("\\sin(345.14x)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("a2")].stateValues
                    .latex,
            ),
        ).eq("\\sin(345.15x)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("a3")].stateValues
                    .latex,
            ),
        ).eq("\\sin(345.14x)");

        expect(
            stateVariables[await resolvePathToNodeIdx("a")].stateValues.value
                .tree,
        ).eqls(["apply", "sin", ["*", 345.15389319, "x"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("a")].stateValues
                .valueForDisplay.tree,
        ).eqls(["apply", "sin", ["*", 345.15, "x"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("a2")].stateValues.value
                .tree,
        ).eqls(["apply", "sin", ["*", 345.15389319, "x"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("a2")].stateValues
                .valueForDisplay.tree,
        ).eqls(["apply", "sin", ["*", 345.15, "x"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("a3")].stateValues.value
                .tree,
        ).eqls(["apply", "sin", ["*", 345.14, "x"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("a3")].stateValues
                .valueForDisplay.tree,
        ).eqls(["apply", "sin", ["*", 345.14, "x"]]);

        await updateMathInputValueToImmediateValue({
            componentIdx: await resolvePathToNodeIdx("a"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("a")].stateValues
                    .rawRendererValue,
            ),
        ).eq("\\sin(345.14x)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("a2")].stateValues
                    .latex,
            ),
        ).eq("\\sin(345.14x)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("a3")].stateValues
                    .latex,
            ),
        ).eq("\\sin(345.14x)");

        expect(
            stateVariables[await resolvePathToNodeIdx("a")].stateValues.value
                .tree,
        ).eqls(["apply", "sin", ["*", 345.14, "x"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("a")].stateValues
                .valueForDisplay.tree,
        ).eqls(["apply", "sin", ["*", 345.14, "x"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("a2")].stateValues.value
                .tree,
        ).eqls(["apply", "sin", ["*", 345.14, "x"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("a2")].stateValues
                .valueForDisplay.tree,
        ).eqls(["apply", "sin", ["*", 345.14, "x"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("a3")].stateValues.value
                .tree,
        ).eqls(["apply", "sin", ["*", 345.14, "x"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("a3")].stateValues
                .valueForDisplay.tree,
        ).eqls(["apply", "sin", ["*", 345.14, "x"]]);

        await updateMathInputImmediateValue({
            latex: "6.04752934e^{0.0000073y}",
            componentIdx: await resolvePathToNodeIdx("b2"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("b")].stateValues
                    .latex,
            ),
        ).eq("2.047529345e^{0.000007301304831y}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("b2")].stateValues
                    .rawRendererValue,
            ),
        ).eq("6.04752934e^{0.0000073y}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("b3")].stateValues
                    .latex,
            ),
        ).eq("2.04752934e^{0.0000073y}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("b4")].stateValues
                    .latex,
            ),
        ).eq("6.04752934e^{0.0000073y}");

        expect(
            stateVariables[await resolvePathToNodeIdx("b")].stateValues.value
                .tree,
        ).eqls([
            "*",
            2.047529344518,
            ["^", "e", ["*", 0.0000073013048309, "y"]],
        ]);
        expect(
            stateVariables[await resolvePathToNodeIdx("b2")].stateValues.value
                .tree,
        ).eqls([
            "*",
            2.047529344518,
            ["^", "e", ["*", 0.0000073013048309, "y"]],
        ]);
        expect(
            stateVariables[await resolvePathToNodeIdx("b2")].stateValues
                .valueForDisplay.tree,
        ).eqls(["*", 2.04752934, ["^", "e", ["*", 0.0000073, "y"]]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("b3")].stateValues.value
                .tree,
        ).eqls([
            "*",
            2.047529344518,
            ["^", "e", ["*", 0.0000073013048309, "y"]],
        ]);
        expect(
            stateVariables[await resolvePathToNodeIdx("b3")].stateValues
                .valueForDisplay.tree,
        ).eqls(["*", 2.04752934, ["^", "e", ["*", 0.0000073, "y"]]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("b4")].stateValues.value
                .tree,
        ).eqls(["*", 6.04752934, ["^", "e", ["*", 0.0000073, "y"]]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("b4")].stateValues
                .valueForDisplay.tree,
        ).eqls(["*", 6.04752934, ["^", "e", ["*", 0.0000073, "y"]]]);

        await updateMathInputValueToImmediateValue({
            componentIdx: await resolvePathToNodeIdx("b2"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("b")].stateValues
                    .latex,
            ),
        ).eq("6.04752934e^{0.0000073y}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("b2")].stateValues
                    .rawRendererValue,
            ),
        ).eq("6.04752934e^{0.0000073y}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("b3")].stateValues
                    .latex,
            ),
        ).eq("6.04752934e^{0.0000073y}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("b4")].stateValues
                    .latex,
            ),
        ).eq("6.04752934e^{0.0000073y}");

        expect(
            stateVariables[await resolvePathToNodeIdx("b")].stateValues.value
                .tree,
        ).eqls(["*", 6.04752934, ["^", "e", ["*", 0.0000073, "y"]]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("b2")].stateValues.value
                .tree,
        ).eqls(["*", 6.04752934, ["^", "e", ["*", 0.0000073, "y"]]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("b2")].stateValues
                .valueForDisplay.tree,
        ).eqls(["*", 6.04752934, ["^", "e", ["*", 0.0000073, "y"]]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("b3")].stateValues.value
                .tree,
        ).eqls(["*", 6.04752934, ["^", "e", ["*", 0.0000073, "y"]]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("b3")].stateValues
                .valueForDisplay.tree,
        ).eqls(["*", 6.04752934, ["^", "e", ["*", 0.0000073, "y"]]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("b4")].stateValues.value
                .tree,
        ).eqls(["*", 6.04752934, ["^", "e", ["*", 0.0000073, "y"]]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("b4")].stateValues
                .valueForDisplay.tree,
        ).eqls(["*", 6.04752934, ["^", "e", ["*", 0.0000073, "y"]]]);
    });

    it("display small as zero", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <text>a</text>
    <p>a: <mathInput name="a" displayDigits="5" prefill="sin(2x)"/></p>
    <p>a2: <math extend="$a.value" name="a2" /></p>
    <p>a3: <math extend="$a.immediatevalue" name="a3" /></p>
  
    <p>b: <math name="b" displayDigits="10" displaySmallAsZero="false">10e^(3y)</math></p>
    <p>b2: <mathInput name="b2" bindValueTo="$b"  displayDigits="3" /></p>
    <p>b3: <math extend="$b2.value" name="b3" /></p>
    <p>b4: <math extend="$b2.immediatevalue" name="b4" /></p>

    <p>c: <mathInput name="c" displayDigits="5" prefill="sin(2x)" displaySmallAsZero /></p>
    <p>c2: <math extend="$c.value" name="c2" /></p>
    <p>c3: <math extend="$c.immediatevalue" name="c3" /></p>

    <p>d: <math name="d" displayDigits="10" displaySmallAsZero="false">10e^(3y)</math></p>
    <p>d2: <mathInput name="d2" bindValueTo="$d"  displayDigits="3" displaySmallAsZero /></p>
    <p>d3: <math extend="$d2.value" name="d3" /></p>
    <p>d4: <math extend="$d2.immediatevalue" name="d4" /></p>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("a")].stateValues
                    .rawRendererValue,
            ),
        ).eq("\\sin(2x)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("a2")].stateValues
                    .latex,
            ),
        ).eq("\\sin(2x)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("a3")].stateValues
                    .latex,
            ),
        ).eq("\\sin(2x)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("b")].stateValues
                    .latex,
            ),
        ).eq("10e^{3y}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("b2")].stateValues
                    .rawRendererValue,
            ),
        ).eq("10e^{3y}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("b3")].stateValues
                    .latex,
            ),
        ).eq("10e^{3y}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("b4")].stateValues
                    .latex,
            ),
        ).eq("10e^{3y}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("c")].stateValues
                    .rawRendererValue,
            ),
        ).eq("\\sin(2x)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("c2")].stateValues
                    .latex,
            ),
        ).eq("\\sin(2x)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("c3")].stateValues
                    .latex,
            ),
        ).eq("\\sin(2x)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("d")].stateValues
                    .latex,
            ),
        ).eq("10e^{3y}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("d2")].stateValues
                    .rawRendererValue,
            ),
        ).eq("10e^{3y}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("d3")].stateValues
                    .latex,
            ),
        ).eq("10e^{3y}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("d4")].stateValues
                    .latex,
            ),
        ).eq("10e^{3y}");

        expect(
            stateVariables[await resolvePathToNodeIdx("a")].stateValues.value
                .tree,
        ).eqls(["apply", "sin", ["*", 2, "x"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("a")].stateValues
                .valueForDisplay.tree,
        ).eqls(["apply", "sin", ["*", 2, "x"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("a2")].stateValues.value
                .tree,
        ).eqls(["apply", "sin", ["*", 2, "x"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("a2")].stateValues
                .valueForDisplay.tree,
        ).eqls(["apply", "sin", ["*", 2, "x"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("a3")].stateValues.value
                .tree,
        ).eqls(["apply", "sin", ["*", 2, "x"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("a3")].stateValues
                .valueForDisplay.tree,
        ).eqls(["apply", "sin", ["*", 2, "x"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("b")].stateValues.value
                .tree,
        ).eqls(["*", 10, ["^", "e", ["*", 3, "y"]]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("b2")].stateValues.value
                .tree,
        ).eqls(["*", 10, ["^", "e", ["*", 3, "y"]]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("b2")].stateValues
                .valueForDisplay.tree,
        ).eqls(["*", 10, ["^", "e", ["*", 3, "y"]]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("b3")].stateValues.value
                .tree,
        ).eqls(["*", 10, ["^", "e", ["*", 3, "y"]]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("b3")].stateValues
                .valueForDisplay.tree,
        ).eqls(["*", 10, ["^", "e", ["*", 3, "y"]]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("b4")].stateValues.value
                .tree,
        ).eqls(["*", 10, ["^", "e", ["*", 3, "y"]]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("b4")].stateValues
                .valueForDisplay.tree,
        ).eqls(["*", 10, ["^", "e", ["*", 3, "y"]]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("c")].stateValues.value
                .tree,
        ).eqls(["apply", "sin", ["*", 2, "x"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("c")].stateValues
                .valueForDisplay.tree,
        ).eqls(["apply", "sin", ["*", 2, "x"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("c2")].stateValues.value
                .tree,
        ).eqls(["apply", "sin", ["*", 2, "x"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("c2")].stateValues
                .valueForDisplay.tree,
        ).eqls(["apply", "sin", ["*", 2, "x"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("c3")].stateValues.value
                .tree,
        ).eqls(["apply", "sin", ["*", 2, "x"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("c3")].stateValues
                .valueForDisplay.tree,
        ).eqls(["apply", "sin", ["*", 2, "x"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("d")].stateValues.value
                .tree,
        ).eqls(["*", 10, ["^", "e", ["*", 3, "y"]]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("d2")].stateValues.value
                .tree,
        ).eqls(["*", 10, ["^", "e", ["*", 3, "y"]]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("d2")].stateValues
                .valueForDisplay.tree,
        ).eqls(["*", 10, ["^", "e", ["*", 3, "y"]]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("d3")].stateValues.value
                .tree,
        ).eqls(["*", 10, ["^", "e", ["*", 3, "y"]]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("d3")].stateValues
                .valueForDisplay.tree,
        ).eqls(["*", 10, ["^", "e", ["*", 3, "y"]]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("d4")].stateValues.value
                .tree,
        ).eqls(["*", 10, ["^", "e", ["*", 3, "y"]]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("d4")].stateValues
                .valueForDisplay.tree,
        ).eqls(["*", 10, ["^", "e", ["*", 3, "y"]]]);

        await updateMathInputValue({
            latex: "\\sin(0.000000000000000472946384739473x)",
            componentIdx: await resolvePathToNodeIdx("a"),
            core,
        });
        await updateMathInputValue({
            latex: "0.0000000000000934720357236e^{0.0000000000000073013048309y}",
            componentIdx: await resolvePathToNodeIdx("b2"),
            core,
        });
        await updateMathInputValue({
            latex: "\\sin(0.000000000000000472946384739473x)",
            componentIdx: await resolvePathToNodeIdx("c"),
            core,
        });
        await updateMathInputValue({
            latex: "0.0000000000000934720357236e^{0.0000000000000073013048309y}",
            componentIdx: await resolvePathToNodeIdx("d2"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("a")].stateValues
                    .rawRendererValue,
            ),
        ).eq("\\sin(4.7295\\cdot10^{-16}x)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("a2")].stateValues
                    .latex,
            ),
        ).eq("\\sin(4.7295\\cdot10^{-16}x)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("a3")].stateValues
                    .latex,
            ),
        ).eq("\\sin(4.7295\\cdot10^{-16}x)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("b")].stateValues
                    .latex,
            ),
        ).eq("9.347203572\\cdot10^{-14}e^{7.301304831\\cdot10^{-15}y}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("b2")].stateValues
                    .rawRendererValue,
            ),
        ).eq("9.35\\cdot10^{-14}e^{7.3\\cdot10^{-15}y}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("b3")].stateValues
                    .latex,
            ),
        ).eq("9.35\\cdot10^{-14}e^{7.3\\cdot10^{-15}y}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("b4")].stateValues
                    .latex,
            ),
        ).eq("9.35\\cdot10^{-14}e^{7.3\\cdot10^{-15}y}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("c")].stateValues
                    .rawRendererValue,
            ),
        ).eq("\\sin(0x)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("c2")].stateValues
                    .latex,
            ),
        ).eq("\\sin(0x)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("c3")].stateValues
                    .latex,
            ),
        ).eq("\\sin(0x)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("d")].stateValues
                    .latex,
            ),
        ).eq("9.347203572\\cdot10^{-14}e^{7.301304831\\cdot10^{-15}y}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("d2")].stateValues
                    .rawRendererValue,
            ),
        ).eq("9.35\\cdot10^{-14}e^{0y}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("d3")].stateValues
                    .latex,
            ),
        ).eq("9.35\\cdot10^{-14}e^{0y}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("d4")].stateValues
                    .latex,
            ),
        ).eq("9.35\\cdot10^{-14}e^{0y}");

        expect(
            stateVariables[await resolvePathToNodeIdx("a")].stateValues.value
                .tree,
        ).eqls(["apply", "sin", ["*", 4.72946384739473e-16, "x"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("a")].stateValues
                .valueForDisplay.tree,
        ).eqls(["apply", "sin", ["*", 4.7295e-16, "x"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("a2")].stateValues.value
                .tree,
        ).eqls(["apply", "sin", ["*", 4.72946384739473e-16, "x"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("a2")].stateValues
                .valueForDisplay.tree,
        ).eqls(["apply", "sin", ["*", 4.7295e-16, "x"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("a3")].stateValues.value
                .tree,
        ).eqls(["apply", "sin", ["*", 4.72946384739473e-16, "x"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("a3")].stateValues
                .valueForDisplay.tree,
        ).eqls(["apply", "sin", ["*", 4.7295e-16, "x"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("b")].stateValues.value
                .tree,
        ).eqls([
            "*",
            9.34720357236e-14,
            ["^", "e", ["*", 7.3013048309e-15, "y"]],
        ]);
        expect(
            stateVariables[await resolvePathToNodeIdx("b2")].stateValues.value
                .tree,
        ).eqls([
            "*",
            9.34720357236e-14,
            ["^", "e", ["*", 7.3013048309e-15, "y"]],
        ]);
        expect(
            stateVariables[await resolvePathToNodeIdx("b2")].stateValues
                .valueForDisplay.tree,
        ).eqls(["*", 9.35e-14, ["^", "e", ["*", 7.3e-15, "y"]]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("b3")].stateValues.value
                .tree,
        ).eqls([
            "*",
            9.34720357236e-14,
            ["^", "e", ["*", 7.3013048309e-15, "y"]],
        ]);
        expect(
            stateVariables[await resolvePathToNodeIdx("b3")].stateValues
                .valueForDisplay.tree,
        ).eqls(["*", 9.35e-14, ["^", "e", ["*", 7.3e-15, "y"]]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("b4")].stateValues.value
                .tree,
        ).eqls([
            "*",
            9.34720357236e-14,
            ["^", "e", ["*", 7.3013048309e-15, "y"]],
        ]);
        expect(
            stateVariables[await resolvePathToNodeIdx("b4")].stateValues
                .valueForDisplay.tree,
        ).eqls(["*", 9.35e-14, ["^", "e", ["*", 7.3e-15, "y"]]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("c")].stateValues.value
                .tree,
        ).eqls(["apply", "sin", ["*", 4.72946384739473e-16, "x"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("c")].stateValues
                .valueForDisplay.tree,
        ).eqls(["apply", "sin", ["*", 0, "x"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("c2")].stateValues.value
                .tree,
        ).eqls(["apply", "sin", ["*", 4.72946384739473e-16, "x"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("c2")].stateValues
                .valueForDisplay.tree,
        ).eqls(["apply", "sin", ["*", 0, "x"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("c3")].stateValues.value
                .tree,
        ).eqls(["apply", "sin", ["*", 4.72946384739473e-16, "x"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("c3")].stateValues
                .valueForDisplay.tree,
        ).eqls(["apply", "sin", ["*", 0, "x"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("d")].stateValues.value
                .tree,
        ).eqls([
            "*",
            9.34720357236e-14,
            ["^", "e", ["*", 7.3013048309e-15, "y"]],
        ]);
        expect(
            stateVariables[await resolvePathToNodeIdx("d2")].stateValues.value
                .tree,
        ).eqls([
            "*",
            9.34720357236e-14,
            ["^", "e", ["*", 7.3013048309e-15, "y"]],
        ]);
        expect(
            stateVariables[await resolvePathToNodeIdx("d2")].stateValues
                .valueForDisplay.tree,
        ).eqls(["*", 9.35e-14, ["^", "e", ["*", 0, "y"]]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("d3")].stateValues.value
                .tree,
        ).eqls([
            "*",
            9.34720357236e-14,
            ["^", "e", ["*", 7.3013048309e-15, "y"]],
        ]);
        expect(
            stateVariables[await resolvePathToNodeIdx("d3")].stateValues
                .valueForDisplay.tree,
        ).eqls(["*", 9.35e-14, ["^", "e", ["*", 0, "y"]]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("d4")].stateValues.value
                .tree,
        ).eqls([
            "*",
            9.34720357236e-14,
            ["^", "e", ["*", 7.3013048309e-15, "y"]],
        ]);
        expect(
            stateVariables[await resolvePathToNodeIdx("d4")].stateValues
                .valueForDisplay.tree,
        ).eqls(["*", 9.35e-14, ["^", "e", ["*", 0, "y"]]]);

        await updateMathInputValue({
            latex: "\\sin(5.7295\\cdot10^{-16}x)",
            componentIdx: await resolvePathToNodeIdx("a"),
            core,
        });
        await updateMathInputValue({
            latex: "8.35\\cdot10^{-14}e^{7.3\\cdot10^{-15}y}",
            componentIdx: await resolvePathToNodeIdx("b2"),
            core,
        });
        await updateMathInputValue({
            latex: "\\sin(30x)",
            componentIdx: await resolvePathToNodeIdx("c"),
            core,
        });
        await updateMathInputValue({
            latex: "6.35\\cdot10^{-14}e^{0y}",
            componentIdx: await resolvePathToNodeIdx("d2"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("a")].stateValues
                    .rawRendererValue,
            ),
        ).eq("\\sin(5.7295\\cdot10^{-16}x)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("a2")].stateValues
                    .latex,
            ),
        ).eq("\\sin(5.7295\\cdot10^{-16}x)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("a3")].stateValues
                    .latex,
            ),
        ).eq("\\sin(5.7295\\cdot10^{-16}x)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("b")].stateValues
                    .latex,
            ),
        ).eq("8.35\\cdot10^{-14}e^{7.3\\cdot10^{-15}y}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("b2")].stateValues
                    .rawRendererValue,
            ),
        ).eq("8.35\\cdot10^{-14}e^{7.3\\cdot10^{-15}y}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("b3")].stateValues
                    .latex,
            ),
        ).eq("8.35\\cdot10^{-14}e^{7.3\\cdot10^{-15}y}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("b4")].stateValues
                    .latex,
            ),
        ).eq("8.35\\cdot10^{-14}e^{7.3\\cdot10^{-15}y}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("c")].stateValues
                    .rawRendererValue,
            ),
        ).eq("\\sin(30x)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("c2")].stateValues
                    .latex,
            ),
        ).eq("\\sin(30x)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("c3")].stateValues
                    .latex,
            ),
        ).eq("\\sin(30x)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("d")].stateValues
                    .latex,
            ),
        ).eq("6.35\\cdot10^{-14}e^{0y}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("d2")].stateValues
                    .rawRendererValue,
            ),
        ).eq("6.35\\cdot10^{-14}e^{0y}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("d3")].stateValues
                    .latex,
            ),
        ).eq("6.35\\cdot10^{-14}e^{0y}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("d4")].stateValues
                    .latex,
            ),
        ).eq("6.35\\cdot10^{-14}e^{0y}");

        expect(
            stateVariables[await resolvePathToNodeIdx("a")].stateValues.value
                .tree,
        ).eqls(["apply", "sin", ["*", 5.7295, ["^", 10, -16], "x"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("a")].stateValues
                .valueForDisplay.tree,
        ).eqls(["apply", "sin", ["*", 5.7295, ["^", 10, -16], "x"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("a2")].stateValues.value
                .tree,
        ).eqls(["apply", "sin", ["*", 5.7295, ["^", 10, -16], "x"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("a2")].stateValues
                .valueForDisplay.tree,
        ).eqls(["apply", "sin", ["*", 5.7295, ["^", 10, -16], "x"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("a3")].stateValues.value
                .tree,
        ).eqls(["apply", "sin", ["*", 5.7295, ["^", 10, -16], "x"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("a3")].stateValues
                .valueForDisplay.tree,
        ).eqls(["apply", "sin", ["*", 5.7295, ["^", 10, -16], "x"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("b")].stateValues.value
                .tree,
        ).eqls([
            "*",
            8.35,
            ["^", 10, -14],
            ["^", "e", ["*", 7.3, ["^", 10, -15], "y"]],
        ]);
        expect(
            stateVariables[await resolvePathToNodeIdx("b2")].stateValues.value
                .tree,
        ).eqls([
            "*",
            8.35,
            ["^", 10, -14],
            ["^", "e", ["*", 7.3, ["^", 10, -15], "y"]],
        ]);
        expect(
            stateVariables[await resolvePathToNodeIdx("b2")].stateValues
                .valueForDisplay.tree,
        ).eqls([
            "*",
            8.35,
            ["^", 10, -14],
            ["^", "e", ["*", 7.3, ["^", 10, -15], "y"]],
        ]);
        expect(
            stateVariables[await resolvePathToNodeIdx("b3")].stateValues.value
                .tree,
        ).eqls([
            "*",
            8.35,
            ["^", 10, -14],
            ["^", "e", ["*", 7.3, ["^", 10, -15], "y"]],
        ]);
        expect(
            stateVariables[await resolvePathToNodeIdx("b3")].stateValues
                .valueForDisplay.tree,
        ).eqls([
            "*",
            8.35,
            ["^", 10, -14],
            ["^", "e", ["*", 7.3, ["^", 10, -15], "y"]],
        ]);
        expect(
            stateVariables[await resolvePathToNodeIdx("b4")].stateValues.value
                .tree,
        ).eqls([
            "*",
            8.35,
            ["^", 10, -14],
            ["^", "e", ["*", 7.3, ["^", 10, -15], "y"]],
        ]);
        expect(
            stateVariables[await resolvePathToNodeIdx("b4")].stateValues
                .valueForDisplay.tree,
        ).eqls([
            "*",
            8.35,
            ["^", 10, -14],
            ["^", "e", ["*", 7.3, ["^", 10, -15], "y"]],
        ]);
        expect(
            stateVariables[await resolvePathToNodeIdx("c")].stateValues.value
                .tree,
        ).eqls(["apply", "sin", ["*", 30, "x"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("c")].stateValues
                .valueForDisplay.tree,
        ).eqls(["apply", "sin", ["*", 30, "x"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("c2")].stateValues.value
                .tree,
        ).eqls(["apply", "sin", ["*", 30, "x"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("c2")].stateValues
                .valueForDisplay.tree,
        ).eqls(["apply", "sin", ["*", 30, "x"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("c3")].stateValues.value
                .tree,
        ).eqls(["apply", "sin", ["*", 30, "x"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("c3")].stateValues
                .valueForDisplay.tree,
        ).eqls(["apply", "sin", ["*", 30, "x"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("d")].stateValues.value
                .tree,
        ).eqls(["*", 6.35, ["^", 10, -14], ["^", "e", ["*", 0, "y"]]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("d2")].stateValues.value
                .tree,
        ).eqls(["*", 6.35, ["^", 10, -14], ["^", "e", ["*", 0, "y"]]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("d2")].stateValues
                .valueForDisplay.tree,
        ).eqls(["*", 6.35, ["^", 10, -14], ["^", "e", ["*", 0, "y"]]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("d3")].stateValues.value
                .tree,
        ).eqls(["*", 6.35, ["^", 10, -14], ["^", "e", ["*", 0, "y"]]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("d3")].stateValues
                .valueForDisplay.tree,
        ).eqls(["*", 6.35, ["^", 10, -14], ["^", "e", ["*", 0, "y"]]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("d4")].stateValues.value
                .tree,
        ).eqls(["*", 6.35, ["^", 10, -14], ["^", "e", ["*", 0, "y"]]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("d4")].stateValues
                .valueForDisplay.tree,
        ).eqls(["*", 6.35, ["^", 10, -14], ["^", "e", ["*", 0, "y"]]]);
    });

    it("propagate larger default display digits", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p>a: <mathInput name="a" prefill="123.4567891234"/></p>
    <p>a2: <math extend="$a.value" name="a2" /></p>
    <p>a3: <math extend="$a.immediateValue" name="a3" /></p>
    <p>a4: <math extend="$a.value" name="a4" displayDigits="4" displayDecimals="2" /></p>
    <p>a5: <math extend="$a.immediateValue" name="a5" displayDigits="4" displayDecimals="2" /></p>

    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("a")].stateValues
                    .rawRendererValue,
            ),
        ).eq("123.4567891");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("a2")].stateValues
                    .latex,
            ),
        ).eq("123.4567891");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("a3")].stateValues
                    .latex,
            ),
        ).eq("123.4567891");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("a4")].stateValues
                    .latex,
            ),
        ).eq("123.46");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("a5")].stateValues
                    .latex,
            ),
        ).eq("123.46");

        await updateMathInputValue({
            latex: "98765.4321876",
            componentIdx: await resolvePathToNodeIdx("a"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("a")].stateValues
                    .rawRendererValue,
            ),
        ).eq("98765.43219");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("a2")].stateValues
                    .latex,
            ),
        ).eq("98765.43219");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("a3")].stateValues
                    .latex,
            ),
        ).eq("98765.43219");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("a4")].stateValues
                    .latex,
            ),
        ).eq("98765.43");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("a5")].stateValues
                    .latex,
            ),
        ).eq("98765.43");
    });

    it("propagate false default display small as zero", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p>a: <mathInput name="a" prefill="123.4567891234"/></p>
    <p>a2: <math extend="$a.value" name="a2" /></p>
    <p>a3: <math extend="$a.immediateValue" name="a3" /></p>
    <p>a4: <math extend="$a.value" name="a4" displaySmallAsZero /></p>
    <p>a5: <math extend="$a.immediateValue" name="a5" displaySmallAsZero /></p>

    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("a")].stateValues
                    .rawRendererValue,
            ),
        ).eq("123.4567891");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("a2")].stateValues
                    .latex,
            ),
        ).eq("123.4567891");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("a3")].stateValues
                    .latex,
            ),
        ).eq("123.4567891");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("a4")].stateValues
                    .latex,
            ),
        ).eq("123.4567891");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("a5")].stateValues
                    .latex,
            ),
        ).eq("123.4567891");

        await updateMathInputValue({
            latex: "0.00000000000000004736286523434185",
            componentIdx: await resolvePathToNodeIdx("a"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("a")].stateValues
                    .rawRendererValue,
            ),
        ).eq("4.736286523\\cdot10^{-17}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("a2")].stateValues
                    .latex,
            ),
        ).eq("4.736286523\\cdot10^{-17}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("a3")].stateValues
                    .latex,
            ),
        ).eq("4.736286523\\cdot10^{-17}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("a4")].stateValues
                    .latex,
            ),
        ).eq("0");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("a5")].stateValues
                    .latex,
            ),
        ).eq("0");
    });

    it("display digits, change from downstream", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p>a: <mathInput name="a" displayDigits="5" prefill="3"/></p>

    <p>b: <math name="b" displayDigits="10">5</math></p>
    <p>b2: <mathInput name="b2" bindValueTo="$b"  displayDigits="3" /></p>

    <graph>
      <point name="p">($a, $b2)</point>
    </graph>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("a")].stateValues.value
                .tree,
        ).eq(3);
        expect(
            stateVariables[await resolvePathToNodeIdx("a")].stateValues
                .valueForDisplay.tree,
        ).eq(3);
        expect(
            stateVariables[await resolvePathToNodeIdx("p")].stateValues.xs[0]
                .tree,
        ).eq(3);
        expect(
            stateVariables[await resolvePathToNodeIdx("b")].stateValues.value
                .tree,
        ).eq(5);
        expect(
            stateVariables[await resolvePathToNodeIdx("b")].stateValues
                .valueForDisplay.tree,
        ).eq(5);
        expect(
            stateVariables[await resolvePathToNodeIdx("b2")].stateValues.value
                .tree,
        ).eq(5);
        expect(
            stateVariables[await resolvePathToNodeIdx("b2")].stateValues
                .valueForDisplay.tree,
        ).eq(5);
        expect(
            stateVariables[await resolvePathToNodeIdx("p")].stateValues.xs[1]
                .tree,
        ).eq(5);

        await updateMathInputValue({
            latex: "2.4295639461593",
            componentIdx: await resolvePathToNodeIdx("a"),
            core,
        });
        await updateMathInputValue({
            latex: "9.3935596792746",
            componentIdx: await resolvePathToNodeIdx("b2"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("a")].stateValues.value
                .tree,
        ).eq(2.4295639461593);
        expect(
            stateVariables[await resolvePathToNodeIdx("a")].stateValues
                .valueForDisplay.tree,
        ).eq(2.4296);
        expect(
            stateVariables[await resolvePathToNodeIdx("p")].stateValues.xs[0]
                .tree,
        ).eq(2.4295639461593);
        expect(
            stateVariables[await resolvePathToNodeIdx("b")].stateValues.value
                .tree,
        ).eq(9.3935596792746);
        expect(
            stateVariables[await resolvePathToNodeIdx("b")].stateValues
                .valueForDisplay.tree,
        ).eq(9.393559679);
        expect(
            stateVariables[await resolvePathToNodeIdx("b2")].stateValues.value
                .tree,
        ).eq(9.3935596792746);
        expect(
            stateVariables[await resolvePathToNodeIdx("b2")].stateValues
                .valueForDisplay.tree,
        ).eq(9.39);
        expect(
            stateVariables[await resolvePathToNodeIdx("p")].stateValues.xs[1]
                .tree,
        ).eq(9.3935596792746);

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("p"),
            x: 7.936497798143,
            y: 2.142218345836,
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("a")].stateValues.value
                .tree,
        ).eq(7.936497798143);
        expect(
            stateVariables[await resolvePathToNodeIdx("a")].stateValues
                .valueForDisplay.tree,
        ).eq(7.9365);
        expect(
            stateVariables[await resolvePathToNodeIdx("p")].stateValues.xs[0]
                .tree,
        ).eq(7.936497798143);
        expect(
            stateVariables[await resolvePathToNodeIdx("b")].stateValues.value
                .tree,
        ).eq(2.142218345836);
        expect(
            stateVariables[await resolvePathToNodeIdx("b")].stateValues
                .valueForDisplay.tree,
        ).eq(2.142218346);
        expect(
            stateVariables[await resolvePathToNodeIdx("b2")].stateValues.value
                .tree,
        ).eq(2.142218345836);
        expect(
            stateVariables[await resolvePathToNodeIdx("b2")].stateValues
                .valueForDisplay.tree,
        ).eq(2.14);
        expect(
            stateVariables[await resolvePathToNodeIdx("p")].stateValues.xs[1]
                .tree,
        ).eq(2.142218345836);
    });

    it("display decimals, change from downstream", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p>a: <mathInput name="a" displayDecimals="4" prefill="3"/></p>

    <p>b: <math name="b" displayDigits="10">5</math></p>
    <p>b2: <mathInput name="b2" bindValueTo="$b"  displayDecimals="2" /></p>

    <graph>
      <point name="p">($a, $b2)</point>
    </graph>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("a")].stateValues.value
                .tree,
        ).eq(3);
        expect(
            stateVariables[await resolvePathToNodeIdx("a")].stateValues
                .valueForDisplay.tree,
        ).eq(3);
        expect(
            stateVariables[await resolvePathToNodeIdx("p")].stateValues.xs[0]
                .tree,
        ).eq(3);
        expect(
            stateVariables[await resolvePathToNodeIdx("b")].stateValues.value
                .tree,
        ).eq(5);
        expect(
            stateVariables[await resolvePathToNodeIdx("b")].stateValues
                .valueForDisplay.tree,
        ).eq(5);
        expect(
            stateVariables[await resolvePathToNodeIdx("b2")].stateValues.value
                .tree,
        ).eq(5);
        expect(
            stateVariables[await resolvePathToNodeIdx("b2")].stateValues
                .valueForDisplay.tree,
        ).eq(5);
        expect(
            stateVariables[await resolvePathToNodeIdx("p")].stateValues.xs[1]
                .tree,
        ).eq(5);

        await updateMathInputValue({
            latex: "2.4295639461593",
            componentIdx: await resolvePathToNodeIdx("a"),
            core,
        });
        await updateMathInputValue({
            latex: "9.3935596792746",
            componentIdx: await resolvePathToNodeIdx("b2"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("a")].stateValues.value
                .tree,
        ).eq(2.4295639461593);
        expect(
            stateVariables[await resolvePathToNodeIdx("a")].stateValues
                .valueForDisplay.tree,
        ).eq(2.4296);
        expect(
            stateVariables[await resolvePathToNodeIdx("p")].stateValues.xs[0]
                .tree,
        ).eq(2.4295639461593);
        expect(
            stateVariables[await resolvePathToNodeIdx("b")].stateValues.value
                .tree,
        ).eq(9.3935596792746);
        expect(
            stateVariables[await resolvePathToNodeIdx("b")].stateValues
                .valueForDisplay.tree,
        ).eq(9.393559679);
        expect(
            stateVariables[await resolvePathToNodeIdx("b2")].stateValues.value
                .tree,
        ).eq(9.3935596792746);
        expect(
            stateVariables[await resolvePathToNodeIdx("b2")].stateValues
                .valueForDisplay.tree,
        ).eq(9.39);
        expect(
            stateVariables[await resolvePathToNodeIdx("p")].stateValues.xs[1]
                .tree,
        ).eq(9.3935596792746);

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("p"),
            x: 7.936497798143,
            y: 2.142218345836,
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("a")].stateValues.value
                .tree,
        ).eq(7.936497798143);
        expect(
            stateVariables[await resolvePathToNodeIdx("a")].stateValues
                .valueForDisplay.tree,
        ).eq(7.9365);
        expect(
            stateVariables[await resolvePathToNodeIdx("p")].stateValues.xs[0]
                .tree,
        ).eq(7.936497798143);
        expect(
            stateVariables[await resolvePathToNodeIdx("b")].stateValues.value
                .tree,
        ).eq(2.142218345836);
        expect(
            stateVariables[await resolvePathToNodeIdx("b")].stateValues
                .valueForDisplay.tree,
        ).eq(2.142218346);
        expect(
            stateVariables[await resolvePathToNodeIdx("b2")].stateValues.value
                .tree,
        ).eq(2.142218345836);
        expect(
            stateVariables[await resolvePathToNodeIdx("b2")].stateValues
                .valueForDisplay.tree,
        ).eq(2.14);
        expect(
            stateVariables[await resolvePathToNodeIdx("p")].stateValues.xs[1]
                .tree,
        ).eq(2.142218345836);
    });

    it("substitute unicode", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p>a: <mathInput name="a" /></p>
    <p>a2: <math extend="$a.value" name="a2" /></p>
    <p>a3: <math extend="$a.value" name="a3" simplify /></p>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("a2")].stateValues.value
                .tree,
        ).eq("\uff3f");

        // unicode α U+03B1
        await updateMathInputValue({
            latex: "α",
            componentIdx: await resolvePathToNodeIdx("a"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("a")].stateValues
                    .rawRendererValue,
            ),
        ).eq("α");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("a2")].stateValues
                    .latex,
            ),
        ).eq("\\alpha");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("a3")].stateValues
                    .latex,
            ),
        ).eq("\\alpha");

        expect(
            stateVariables[await resolvePathToNodeIdx("a")].stateValues.value
                .tree,
        ).eqls("alpha");
        expect(
            stateVariables[await resolvePathToNodeIdx("a2")].stateValues.value
                .tree,
        ).eqls("alpha");
        expect(
            stateVariables[await resolvePathToNodeIdx("a3")].stateValues.value
                .tree,
        ).eqls("alpha");

        // latex \\alpha\\beta
        await updateMathInputValue({
            latex: "\\alpha\\beta",
            componentIdx: await resolvePathToNodeIdx("a"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("a")].stateValues
                    .rawRendererValue,
            ),
        ).eq("\\alpha\\beta");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("a2")].stateValues
                    .latex,
            ),
        ).eq("\\alpha\\beta");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("a3")].stateValues
                    .latex,
            ),
        ).eq("\\alpha\\beta");

        expect(
            stateVariables[await resolvePathToNodeIdx("a")].stateValues.value
                .tree,
        ).eqls(["*", "alpha", "beta"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("a2")].stateValues.value
                .tree,
        ).eqls(["*", "alpha", "beta"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("a3")].stateValues.value
                .tree,
        ).eqls(["*", "alpha", "beta"]);

        // unicode − U+2212 is subtraction

        await updateMathInputValue({
            latex: "y\u2212z",
            componentIdx: await resolvePathToNodeIdx("a"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("a")].stateValues
                    .rawRendererValue,
            ),
        ).eq("y\u2212z");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("a2")].stateValues
                    .latex,
            ),
        ).eq("y-z");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("a3")].stateValues
                    .latex,
            ),
        ).eq("y-z");
        expect(
            stateVariables[await resolvePathToNodeIdx("a")].stateValues.value
                .tree,
        ).eqls(["+", "y", ["-", "z"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("a2")].stateValues.value
                .tree,
        ).eqls(["+", "y", ["-", "z"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("a3")].stateValues.value
                .tree,
        ).eqls(["+", "y", ["-", "z"]]);

        // normal minus

        await updateMathInputValue({
            latex: "a-b",
            componentIdx: await resolvePathToNodeIdx("a"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("a")].stateValues
                    .rawRendererValue,
            ),
        ).eq("a-b");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("a2")].stateValues
                    .latex,
            ),
        ).eq("a-b");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("a3")].stateValues
                    .latex,
            ),
        ).eq("a-b");
        expect(
            stateVariables[await resolvePathToNodeIdx("a")].stateValues.value
                .tree,
        ).eqls(["+", "a", ["-", "b"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("a2")].stateValues.value
                .tree,
        ).eqls(["+", "a", ["-", "b"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("a3")].stateValues.value
                .tree,
        ).eqls(["+", "a", ["-", "b"]]);

        // unicode ⋅ U+22C5 is multiplication

        await updateMathInputValue({
            latex: "y\u22C5z",
            componentIdx: await resolvePathToNodeIdx("a"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("a")].stateValues
                    .rawRendererValue,
            ),
        ).eq("y\u22C5z");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("a2")].stateValues
                    .latex,
            ),
        ).eq("yz");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("a3")].stateValues
                    .latex,
            ),
        ).eq("yz");
        expect(
            stateVariables[await resolvePathToNodeIdx("a")].stateValues.value
                .tree,
        ).eqls(["*", "y", "z"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("a2")].stateValues.value
                .tree,
        ).eqls(["*", "y", "z"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("a3")].stateValues.value
                .tree,
        ).eqls(["*", "y", "z"]);

        // normal *

        await updateMathInputValue({
            latex: "a*b",
            componentIdx: await resolvePathToNodeIdx("a"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("a")].stateValues
                    .rawRendererValue,
            ),
        ).eq("a*b");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("a2")].stateValues
                    .latex,
            ),
        ).eq("ab");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("a3")].stateValues
                    .latex,
            ),
        ).eq("ab");
        expect(
            stateVariables[await resolvePathToNodeIdx("a")].stateValues.value
                .tree,
        ).eqls(["*", "a", "b"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("a2")].stateValues.value
                .tree,
        ).eqls(["*", "a", "b"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("a3")].stateValues.value
                .tree,
        ).eqls(["*", "a", "b"]);

        // unicode · U+00B7 becomes multiplication

        await updateMathInputValue({
            latex: "y\u00B7z",
            componentIdx: await resolvePathToNodeIdx("a"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("a")].stateValues
                    .rawRendererValue,
            ),
        ).eq("y\u00B7z");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("a2")].stateValues
                    .latex,
            ),
        ).eq("yz");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("a3")].stateValues
                    .latex,
            ),
        ).eq("yz");
        expect(
            stateVariables[await resolvePathToNodeIdx("a")].stateValues.value
                .tree,
        ).eqls(["*", "y", "z"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("a2")].stateValues.value
                .tree,
        ).eqls(["*", "y", "z"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("a3")].stateValues.value
                .tree,
        ).eqls(["*", "y", "z"]);

        // unicode × U+00D7 becomes multiplication

        await updateMathInputValue({
            latex: "u\u00D7v",
            componentIdx: await resolvePathToNodeIdx("a"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("a")].stateValues
                    .rawRendererValue,
            ),
        ).eq("u\u00D7v");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("a2")].stateValues
                    .latex,
            ),
        ).eq("uv");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("a3")].stateValues
                    .latex,
            ),
        ).eq("uv");
        expect(
            stateVariables[await resolvePathToNodeIdx("a")].stateValues.value
                .tree,
        ).eqls(["*", "u", "v"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("a2")].stateValues.value
                .tree,
        ).eqls(["*", "u", "v"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("a3")].stateValues.value
                .tree,
        ).eqls(["*", "u", "v"]);

        // unicode ∪ U+222A becomes union

        await updateMathInputValue({
            latex: "A\u222AB",
            componentIdx: await resolvePathToNodeIdx("a"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("a")].stateValues
                    .rawRendererValue,
            ),
        ).eq("A\u222AB");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("a2")].stateValues
                    .latex,
            ),
        ).eq("A\\cupB");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("a3")].stateValues
                    .latex,
            ),
        ).eq("A\\cupB");
        expect(
            stateVariables[await resolvePathToNodeIdx("a")].stateValues.value
                .tree,
        ).eqls(["union", "A", "B"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("a2")].stateValues.value
                .tree,
        ).eqls(["union", "A", "B"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("a3")].stateValues.value
                .tree,
        ).eqls(["union", "A", "B"]);

        // unicode ∩ U+2229 becomes intersect

        await updateMathInputValue({
            latex: "A\u2229B",
            componentIdx: await resolvePathToNodeIdx("a"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("a")].stateValues
                    .rawRendererValue,
            ),
        ).eq("A\u2229B");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("a2")].stateValues
                    .latex,
            ),
        ).eq("A\\capB");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("a3")].stateValues
                    .latex,
            ),
        ).eq("A\\capB");
        expect(
            stateVariables[await resolvePathToNodeIdx("a")].stateValues.value
                .tree,
        ).eqls(["intersect", "A", "B"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("a2")].stateValues.value
                .tree,
        ).eqls(["intersect", "A", "B"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("a3")].stateValues.value
                .tree,
        ).eqls(["intersect", "A", "B"]);

        // unicode ∞ U+221E becomes infinity

        await updateMathInputValue({
            latex: "\u221E",
            componentIdx: await resolvePathToNodeIdx("a"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("a")].stateValues
                    .rawRendererValue,
            ),
        ).eq("\u221E");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("a2")].stateValues
                    .latex,
            ),
        ).eq("\\infty");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("a3")].stateValues
                    .latex,
            ),
        ).eq("\\infty");
        expect(
            stateVariables[await resolvePathToNodeIdx("a")].stateValues.value
                .tree,
        ).eq(Infinity);
        expect(
            stateVariables[await resolvePathToNodeIdx("a2")].stateValues.value
                .tree,
        ).eq(Infinity);
        expect(
            stateVariables[await resolvePathToNodeIdx("a3")].stateValues.value
                .tree,
        ).eq(Infinity);

        // unicode µ U+00B5 becomes mu

        await updateMathInputValue({
            latex: "\u00B5",
            componentIdx: await resolvePathToNodeIdx("a"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("a")].stateValues
                    .rawRendererValue,
            ),
        ).eq("\u00B5");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("a2")].stateValues
                    .latex,
            ),
        ).eq("\\mu");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("a3")].stateValues
                    .latex,
            ),
        ).eq("\\mu");
        expect(
            stateVariables[await resolvePathToNodeIdx("a")].stateValues.value
                .tree,
        ).eq("mu");
        expect(
            stateVariables[await resolvePathToNodeIdx("a2")].stateValues.value
                .tree,
        ).eq("mu");
        expect(
            stateVariables[await resolvePathToNodeIdx("a3")].stateValues.value
                .tree,
        ).eq("mu");

        // unicode μ U+03BC becomes mu

        await updateMathInputValue({
            latex: "\u03BC",
            componentIdx: await resolvePathToNodeIdx("a"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("a")].stateValues
                    .rawRendererValue,
            ),
        ).eq("\u03BC");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("a2")].stateValues
                    .latex,
            ),
        ).eq("\\mu");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("a3")].stateValues
                    .latex,
            ),
        ).eq("\\mu");
        expect(
            stateVariables[await resolvePathToNodeIdx("a")].stateValues.value
                .tree,
        ).eq("mu");
        expect(
            stateVariables[await resolvePathToNodeIdx("a2")].stateValues.value
                .tree,
        ).eq("mu");
        expect(
            stateVariables[await resolvePathToNodeIdx("a3")].stateValues.value
                .tree,
        ).eq("mu");

        // unicode ′ U+2032 becomes apostrophe

        await updateMathInputValue({
            latex: "f\u2032",
            componentIdx: await resolvePathToNodeIdx("a"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("a")].stateValues
                    .rawRendererValue,
            ),
        ).eq("f\u2032");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("a2")].stateValues
                    .latex,
            ),
        ).eq("f'");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("a3")].stateValues
                    .latex,
            ),
        ).eq("f'");
        expect(
            stateVariables[await resolvePathToNodeIdx("a")].stateValues.value
                .tree,
        ).eqls(["prime", "f"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("a2")].stateValues.value
                .tree,
        ).eqls(["prime", "f"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("a3")].stateValues.value
                .tree,
        ).eqls(["prime", "f"]);
    });

    it("exponent with numbers", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p>a: <mathInput name="a" /></p>
    <p>a2: <math extend="$a.value" name="a2" /></p>
    <p>a3: <math simplify name="a3">$a</math></p>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("a2")].stateValues
                    .value.tree,
            ),
        ).eq("\uff3f");

        await updateMathInputValue({
            latex: "3^25",
            componentIdx: await resolvePathToNodeIdx("a"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("a")].stateValues.value
                .tree,
        ).eqls(["*", ["^", 3, 2], 5]);
        expect(
            stateVariables[await resolvePathToNodeIdx("a2")].stateValues.value
                .tree,
        ).eqls(["*", ["^", 3, 2], 5]);
        expect(
            stateVariables[await resolvePathToNodeIdx("a3")].stateValues.value
                .tree,
        ).eqls(45);

        await updateMathInputValue({
            latex: "3^{25}",
            componentIdx: await resolvePathToNodeIdx("a"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("a")].stateValues.value
                .tree,
        ).eqls(["^", 3, 25]);
        expect(
            stateVariables[await resolvePathToNodeIdx("a2")].stateValues.value
                .tree,
        ).eqls(["^", 3, 25]);
        expect(
            stateVariables[await resolvePathToNodeIdx("a3")].stateValues.value
                .tree,
        ).eqls(847288609443);

        await updateMathInputValue({
            latex: "3^{2x}",
            componentIdx: await resolvePathToNodeIdx("a"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("a")].stateValues.value
                .tree,
        ).eqls(["^", 3, ["*", 2, "x"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("a2")].stateValues.value
                .tree,
        ).eqls(["^", 3, ["*", 2, "x"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("a3")].stateValues.value
                .tree,
        ).eqls(["^", 3, ["*", 2, "x"]]);

        await updateMathInputValue({
            latex: "3^2x",
            componentIdx: await resolvePathToNodeIdx("a"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("a")].stateValues.value
                .tree,
        ).eqls(["*", ["^", 3, 2], "x"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("a2")].stateValues.value
                .tree,
        ).eqls(["*", ["^", 3, 2], "x"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("a3")].stateValues.value
                .tree,
        ).eqls(["*", 9, "x"]);

        await updateMathInputValue({
            latex: "3^{x2}",
            componentIdx: await resolvePathToNodeIdx("a"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("a")].stateValues.value
                .tree,
        ).eqls(["^", 3, "x2"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("a2")].stateValues.value
                .tree,
        ).eqls(["^", 3, "x2"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("a3")].stateValues.value
                .tree,
        ).eqls(["^", 3, "x2"]);

        await updateMathInputValue({
            latex: "3^x2",
            componentIdx: await resolvePathToNodeIdx("a"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("a")].stateValues.value
                .tree,
        ).eqls(["*", ["^", 3, "x"], 2]);
        expect(
            stateVariables[await resolvePathToNodeIdx("a2")].stateValues.value
                .tree,
        ).eqls(["*", ["^", 3, "x"], 2]);
        expect(
            stateVariables[await resolvePathToNodeIdx("a3")].stateValues.value
                .tree,
        ).eqls(["*", 2, ["^", 3, "x"]]);

        await updateMathInputValue({
            latex: "f^32",
            componentIdx: await resolvePathToNodeIdx("a"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("a")].stateValues.value
                .tree,
        ).eqls(["*", ["^", "f", 3], 2]);
        expect(
            stateVariables[await resolvePathToNodeIdx("a2")].stateValues.value
                .tree,
        ).eqls(["*", ["^", "f", 3], 2]);
        expect(
            stateVariables[await resolvePathToNodeIdx("a3")].stateValues.value
                .tree,
        ).eqls(["*", 2, ["^", "f", 3]]);

        await updateMathInputValue({
            latex: "x^32",
            componentIdx: await resolvePathToNodeIdx("a"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("a")].stateValues.value
                .tree,
        ).eqls(["*", ["^", "x", 3], 2]);
        expect(
            stateVariables[await resolvePathToNodeIdx("a2")].stateValues.value
                .tree,
        ).eqls(["*", ["^", "x", 3], 2]);
        expect(
            stateVariables[await resolvePathToNodeIdx("a3")].stateValues.value
                .tree,
        ).eqls(["*", 2, ["^", "x", 3]]);
    });

    it("subscript with numbers", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p>a: <mathInput name="a" /></p>
    <p>a2: <math extend="$a.value" name="a2" /></p>
    <p>a3: <math simplify name="a3">$a</math></p>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("a2")].stateValues.value
                .tree,
        ).eqls("\uff3f");

        await updateMathInputValue({
            latex: "3_25",
            componentIdx: await resolvePathToNodeIdx("a"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("a")].stateValues.value
                .tree,
        ).eqls(["*", ["_", 3, 2], 5]);
        expect(
            stateVariables[await resolvePathToNodeIdx("a2")].stateValues.value
                .tree,
        ).eqls(["*", ["_", 3, 2], 5]);
        expect(
            stateVariables[await resolvePathToNodeIdx("a3")].stateValues.value
                .tree,
        ).eqls(["*", 5, ["_", 3, 2]]);

        await updateMathInputValue({
            latex: "3_{25}",
            componentIdx: await resolvePathToNodeIdx("a"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("a")].stateValues.value
                .tree,
        ).eqls(["_", 3, 25]);
        expect(
            stateVariables[await resolvePathToNodeIdx("a2")].stateValues.value
                .tree,
        ).eqls(["_", 3, 25]);
        expect(
            stateVariables[await resolvePathToNodeIdx("a3")].stateValues.value
                .tree,
        ).eqls(["_", 3, 25]);

        await updateMathInputValue({
            latex: "3_{2x}",
            componentIdx: await resolvePathToNodeIdx("a"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("a")].stateValues.value
                .tree,
        ).eqls(["_", 3, ["*", 2, "x"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("a2")].stateValues.value
                .tree,
        ).eqls(["_", 3, ["*", 2, "x"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("a3")].stateValues.value
                .tree,
        ).eqls(["_", 3, ["*", 2, "x"]]);

        await updateMathInputValue({
            latex: "3_2x",
            componentIdx: await resolvePathToNodeIdx("a"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("a")].stateValues.value
                .tree,
        ).eqls(["*", ["_", 3, 2], "x"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("a2")].stateValues.value
                .tree,
        ).eqls(["*", ["_", 3, 2], "x"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("a3")].stateValues.value
                .tree,
        ).eqls(["*", "x", ["_", 3, 2]]);

        await updateMathInputValue({
            latex: "3_{x2}",
            componentIdx: await resolvePathToNodeIdx("a"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("a")].stateValues.value
                .tree,
        ).eqls(["_", 3, "x2"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("a2")].stateValues.value
                .tree,
        ).eqls(["_", 3, "x2"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("a3")].stateValues.value
                .tree,
        ).eqls(["_", 3, "x2"]);

        await updateMathInputValue({
            latex: "3_x2",
            componentIdx: await resolvePathToNodeIdx("a"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("a")].stateValues.value
                .tree,
        ).eqls(["*", ["_", 3, "x"], 2]);
        expect(
            stateVariables[await resolvePathToNodeIdx("a2")].stateValues.value
                .tree,
        ).eqls(["*", ["_", 3, "x"], 2]);
        expect(
            stateVariables[await resolvePathToNodeIdx("a3")].stateValues.value
                .tree,
        ).eqls(["*", 2, ["_", 3, "x"]]);

        await updateMathInputValue({
            latex: "f_32",
            componentIdx: await resolvePathToNodeIdx("a"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("a")].stateValues.value
                .tree,
        ).eqls(["*", ["_", "f", 3], 2]);
        expect(
            stateVariables[await resolvePathToNodeIdx("a2")].stateValues.value
                .tree,
        ).eqls(["*", ["_", "f", 3], 2]);
        expect(
            stateVariables[await resolvePathToNodeIdx("a3")].stateValues.value
                .tree,
        ).eqls(["*", 2, ["_", "f", 3]]);

        await updateMathInputValue({
            latex: "x_32",
            componentIdx: await resolvePathToNodeIdx("a"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("a")].stateValues.value
                .tree,
        ).eqls(["*", ["_", "x", 3], 2]);
        expect(
            stateVariables[await resolvePathToNodeIdx("a2")].stateValues.value
                .tree,
        ).eqls(["*", ["_", "x", 3], 2]);
        expect(
            stateVariables[await resolvePathToNodeIdx("a3")].stateValues.value
                .tree,
        ).eqls(["*", 2, ["_", "x", 3]]);
    });

    it("rawValue is updated", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph>
      <point x="1" y="2" name="A">
          <constrainToGrid />
      </point>
    </graph>
    
    <mathInput name="mi" bindValueTo="$A.x" />
    
    <math extend="$A.x" name="Ax" />

    <graph>
      <point x="$mi" y="3" name="B" />
    </graph>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues
                .rawRendererValue,
        ).eq("1");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues
                .immediateValue.tree,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues.value
                .tree,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("A")].stateValues.xs.map(
                (x) => x.tree,
            ),
        ).eqls([1, 2]);
        expect(
            stateVariables[await resolvePathToNodeIdx("B")].stateValues.xs.map(
                (x) => x.tree,
            ),
        ).eqls([1, 3]);

        await updateMathInputValue({
            latex: "-7.4",
            componentIdx: await resolvePathToNodeIdx("mi"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues
                .rawRendererValue,
        ).eq("-7");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues
                .immediateValue.tree,
        ).eq(-7);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues.value
                .tree,
        ).eq(-7);
        expect(
            stateVariables[await resolvePathToNodeIdx("A")].stateValues.xs.map(
                (x) => x.tree,
            ),
        ).eqls([-7, 2]);
        expect(
            stateVariables[await resolvePathToNodeIdx("B")].stateValues.xs.map(
                (x) => x.tree,
            ),
        ).eqls([-7, 3]);

        // move point A

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("A"),
            x: 3.9,
            y: -8.4,
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues
                .rawRendererValue,
        ).eq("4");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues
                .immediateValue.tree,
        ).eq(4);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues.value
                .tree,
        ).eq(4);
        expect(
            stateVariables[await resolvePathToNodeIdx("A")].stateValues.xs.map(
                (x) => x.tree,
            ),
        ).eqls([4, -8]);
        expect(
            stateVariables[await resolvePathToNodeIdx("B")].stateValues.xs.map(
                (x) => x.tree,
            ),
        ).eqls([4, 3]);

        // move point B

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("B"),
            x: 5.1,
            y: 1.3,
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues
                .rawRendererValue,
        ).eq("5");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues
                .immediateValue.tree,
        ).eq(5);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues.value
                .tree,
        ).eq(5);
        expect(
            stateVariables[await resolvePathToNodeIdx("A")].stateValues.xs.map(
                (x) => x.tree,
            ),
        ).eqls([5, -8]);
        expect(
            stateVariables[await resolvePathToNodeIdx("B")].stateValues.xs.map(
                (x) => x.tree,
            ),
        ).eqls([5, 1.3]);
    });

    it("chain update off mathInput", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <mathInput name="mi" />

    <math simplify name="x">x</math>
    <updateValue triggerWith="$mi" target="$x" newValue="$x+$mi" />
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("x")].stateValues.value
                .tree,
        ).eq("x");

        await updateMathInputImmediateValue({
            latex: "y",
            componentIdx: await resolvePathToNodeIdx("mi"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues
                .immediateValue.tree,
        ).eq("y");
        expect(
            stateVariables[await resolvePathToNodeIdx("x")].stateValues.value
                .tree,
        ).eq("x");

        await updateMathInputImmediateValue({
            latex: "",
            componentIdx: await resolvePathToNodeIdx("mi"),
            core,
        });
        await updateMathInputImmediateValue({
            latex: "x",
            componentIdx: await resolvePathToNodeIdx("mi"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues
                .immediateValue.tree,
        ).eq("x");
        expect(
            stateVariables[await resolvePathToNodeIdx("x")].stateValues.value
                .tree,
        ).eq("x");

        await updateMathInputValueToImmediateValue({
            componentIdx: await resolvePathToNodeIdx("mi"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues.value
                .tree,
        ).eq("x");
        expect(
            stateVariables[await resolvePathToNodeIdx("x")].stateValues.value
                .tree,
        ).eqls(["*", 2, "x"]);

        await updateMathInputImmediateValue({
            latex: "",
            componentIdx: await resolvePathToNodeIdx("mi"),
            core,
        });
        await updateMathInputImmediateValue({
            latex: "y",
            componentIdx: await resolvePathToNodeIdx("mi"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues
                .immediateValue.tree,
        ).eq("y");
        expect(
            stateVariables[await resolvePathToNodeIdx("x")].stateValues.value
                .tree,
        ).eqls(["*", 2, "x"]);

        await updateMathInputImmediateValue({
            latex: "y+x",
            componentIdx: await resolvePathToNodeIdx("mi"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues
                .immediateValue.tree,
        ).eqls(["+", "y", "x"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("x")].stateValues.value
                .tree,
        ).eqls(["*", 2, "x"]);

        await updateMathInputValueToImmediateValue({
            componentIdx: await resolvePathToNodeIdx("mi"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues.value
                .tree,
        ).eqls(["+", "y", "x"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("x")].stateValues.value
                .tree,
        ).eqls(["+", ["*", 3, "x"], "y"]);
    });

    it("split symbols in mathInput", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <mathInput name="mins" splitSymbols="false" />
    <mathInput name="mis" />

    <p>No split: <math extend="$mins" name="mns"/></p>
    <p>Split: <math extend="$mis" name="ms"/></p>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("mns")].stateValues.value
                .tree,
        ).eq("\uff3f");

        await updateMathInputValue({
            latex: "xy",
            componentIdx: await resolvePathToNodeIdx("mins"),
            core,
        });
        await updateMathInputValue({
            latex: "xy",
            componentIdx: await resolvePathToNodeIdx("mis"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("mins")].stateValues.value
                .tree,
        ).eqls("xy");
        expect(
            stateVariables[await resolvePathToNodeIdx("mis")].stateValues.value
                .tree,
        ).eqls(["*", "x", "y"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mns")].stateValues.value
                .tree,
        ).eqls("xy");
        expect(
            stateVariables[await resolvePathToNodeIdx("ms")].stateValues.value
                .tree,
        ).eqls(["*", "x", "y"]);

        await updateMathInputValue({
            latex: "xy0",
            componentIdx: await resolvePathToNodeIdx("mins"),
            core,
        });
        await updateMathInputValue({
            latex: "xy0",
            componentIdx: await resolvePathToNodeIdx("mis"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("mins")].stateValues.value
                .tree,
        ).eqls("xy0");
        expect(
            stateVariables[await resolvePathToNodeIdx("mis")].stateValues.value
                .tree,
        ).eqls("xy0");
        expect(
            stateVariables[await resolvePathToNodeIdx("mns")].stateValues.value
                .tree,
        ).eqls("xy0");
        expect(
            stateVariables[await resolvePathToNodeIdx("ms")].stateValues.value
                .tree,
        ).eqls("xy0");

        await updateMathInputValue({
            latex: "xy_{uv}",
            componentIdx: await resolvePathToNodeIdx("mins"),
            core,
        });
        await updateMathInputValue({
            latex: "xy_{uv}",
            componentIdx: await resolvePathToNodeIdx("mis"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("mins")].stateValues.value
                .tree,
        ).eqls(["_", "xy", "uv"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mis")].stateValues.value
                .tree,
        ).eqls(["*", "x", ["_", "y", ["*", "u", "v"]]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mns")].stateValues.value
                .tree,
        ).eqls(["_", "xy", "uv"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("ms")].stateValues.value
                .tree,
        ).eqls(["*", "x", ["_", "y", ["*", "u", "v"]]]);
    });

    it("normalize begin/end ldots in mathInput", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <mathInput name="mi" />

    <p>Value: <math extend="$mi" name="m"/></p>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("m")].stateValues.value
                .tree,
        ).eq("\uff3f");

        // use periods, no commas

        await updateMathInputValue({
            latex: "...x,y,z...",
            componentIdx: await resolvePathToNodeIdx("mi"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues.value
                .tree,
        ).eqls(["list", ["ldots"], "x", "y", "z", ["ldots"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m")].stateValues.value
                .tree,
        ).eqls(["list", ["ldots"], "x", "y", "z", ["ldots"]]);

        // add spaces in between some periods

        await updateMathInputValue({
            latex: "\\ .\\ .\\ .x,y,a..\\ .\\ ",
            componentIdx: await resolvePathToNodeIdx("mi"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues.value
                .tree,
        ).eqls(["list", ["ldots"], "x", "y", "a", ["ldots"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m")].stateValues.value
                .tree,
        ).eqls(["list", ["ldots"], "x", "y", "a", ["ldots"]]);

        // add commas after first set of periods

        await updateMathInputValue({
            latex: "\\ .\\ .\\ .,b,y,a..\\ .\\ ",
            componentIdx: await resolvePathToNodeIdx("mi"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues.value
                .tree,
        ).eqls(["list", ["ldots"], "b", "y", "a", ["ldots"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m")].stateValues.value
                .tree,
        ).eqls(["list", ["ldots"], "b", "y", "a", ["ldots"]]);

        // add commas before second set of periods

        await updateMathInputValue({
            latex: "\\ .\\ .\\ .,b,y,c,..\\ .\\ ",
            componentIdx: await resolvePathToNodeIdx("mi"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues.value
                .tree,
        ).eqls(["list", ["ldots"], "b", "y", "c", ["ldots"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m")].stateValues.value
                .tree,
        ).eqls(["list", ["ldots"], "b", "y", "c", ["ldots"]]);

        // change second set of periods to ldots

        await updateMathInputValue({
            latex: "\\ .\\ .\\ .,b,y,d,\\ldots\\ ",
            componentIdx: await resolvePathToNodeIdx("mi"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues.value
                .tree,
        ).eqls(["list", ["ldots"], "b", "y", "d", ["ldots"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m")].stateValues.value
                .tree,
        ).eqls(["list", ["ldots"], "b", "y", "d", ["ldots"]]);

        // change first set of periods to ldots

        await updateMathInputValue({
            latex: "\\ \\ldots\\ ,e,y,d,\\ldots\\ ",
            componentIdx: await resolvePathToNodeIdx("mi"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues.value
                .tree,
        ).eqls(["list", ["ldots"], "e", "y", "d", ["ldots"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m")].stateValues.value
                .tree,
        ).eqls(["list", ["ldots"], "e", "y", "d", ["ldots"]]);

        // remove first comma

        await updateMathInputValue({
            latex: "\\ \\ldots\\ f,y,d,\\ldots\\ ",
            componentIdx: await resolvePathToNodeIdx("mi"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues.value
                .tree,
        ).eqls(["list", ["ldots"], "f", "y", "d", ["ldots"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m")].stateValues.value
                .tree,
        ).eqls(["list", ["ldots"], "f", "y", "d", ["ldots"]]);

        // remove last comma

        await updateMathInputValue({
            latex: "\\ \\ldots\\ f,y,g\\ldots\\ ",
            componentIdx: await resolvePathToNodeIdx("mi"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues.value
                .tree,
        ).eqls(["list", ["ldots"], "f", "y", "g", ["ldots"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m")].stateValues.value
                .tree,
        ).eqls(["list", ["ldots"], "f", "y", "g", ["ldots"]]);
    });

    it("mathInput eliminates multicharacter symbols", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <math name="varWithNum">x2</math>
    <math name="noSplit" splitSymbols="false">xyz</math>
    <mathInput name="varWithNum2" bindValueTo="$varWithNum" />
    <mathInput name="noSplit2" splitSymbols="false" bindValueTo="$noSplit" />
    <math extend="$varWithNum2.value" name="varWithNum3" />
    <math extend="$noSplit2.value" name="noSplit3" />
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("varWithNum")].stateValues
                .value.tree,
        ).eq("x2");
        expect(
            stateVariables[await resolvePathToNodeIdx("varWithNum2")]
                .stateValues.value.tree,
        ).eq("x2");
        expect(
            stateVariables[await resolvePathToNodeIdx("varWithNum3")]
                .stateValues.value.tree,
        ).eq("x2");
        expect(
            stateVariables[await resolvePathToNodeIdx("noSplit")].stateValues
                .value.tree,
        ).eq("xyz");
        expect(
            stateVariables[await resolvePathToNodeIdx("noSplit2")].stateValues
                .value.tree,
        ).eq("xyz");
        expect(
            stateVariables[await resolvePathToNodeIdx("noSplit3")].stateValues
                .value.tree,
        ).eq("xyz");

        await updateMathInputValue({
            latex: "xu9j",
            componentIdx: await resolvePathToNodeIdx("varWithNum2"),
            core,
        });
        await updateMathInputValue({
            latex: "xyuv",
            componentIdx: await resolvePathToNodeIdx("noSplit2"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("varWithNum")].stateValues
                .value.tree,
        ).eq("xu9j");
        expect(
            stateVariables[await resolvePathToNodeIdx("varWithNum2")]
                .stateValues.value.tree,
        ).eq("xu9j");
        expect(
            stateVariables[await resolvePathToNodeIdx("varWithNum3")]
                .stateValues.value.tree,
        ).eq("xu9j");
        expect(
            stateVariables[await resolvePathToNodeIdx("noSplit")].stateValues
                .value.tree,
        ).eq("xyuv");
        expect(
            stateVariables[await resolvePathToNodeIdx("noSplit2")].stateValues
                .value.tree,
        ).eq("xyuv");
        expect(
            stateVariables[await resolvePathToNodeIdx("noSplit3")].stateValues
                .value.tree,
        ).eq("xyuv");
    });

    it("mathInput prefills 1", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p>
    <math format="latex" name="unionLatex">A \\cup B</math>
    <math name="unionText">A union B</math>
    <m name="unionM">A \\cup B</m>
    </p>

    <p>
    <mathInput name="union1" prefill="$unionLatex" />
    <mathInput name="union2" prefill="$unionText" format="latex" />
    <mathInput name="union3" prefill="A union B" />
    <mathInput name="union4" prefill="A \\cup B" format="latex" />
    <mathInput name="union5" prefillLatex="A \\cup B" />
    <mathInput name="union6" prefillLatex="$unionLatex" />
    <mathInput name="union7" prefillLatex="$unionM" />
    <math extend="$union1.value" name="union1m" />
    <math extend="$union2.value" name="union2m" />
    <math extend="$union3.value" name="union3m" />
    <math extend="$union4.value" name="union4m" />
    <math extend="$union5.value" name="union5m" />
    <math extend="$union6.value" name="union6m" />
    <math extend="$union7.value" name="union7m" />
    </p>

    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("union1")].stateValues
                .value.tree,
        ).eqls(["union", "A", "B"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("union2")].stateValues
                .value.tree,
        ).eqls(["union", "A", "B"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("union3")].stateValues
                .value.tree,
        ).eqls(["union", "A", "B"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("union4")].stateValues
                .value.tree,
        ).eqls(["union", "A", "B"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("union5")].stateValues
                .value.tree,
        ).eqls(["union", "A", "B"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("union6")].stateValues
                .value.tree,
        ).eqls(["union", "A", "B"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("union7")].stateValues
                .value.tree,
        ).eqls(["union", "A", "B"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("union1m")].stateValues
                .value.tree,
        ).eqls(["union", "A", "B"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("union2m")].stateValues
                .value.tree,
        ).eqls(["union", "A", "B"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("union3m")].stateValues
                .value.tree,
        ).eqls(["union", "A", "B"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("union4m")].stateValues
                .value.tree,
        ).eqls(["union", "A", "B"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("union5m")].stateValues
                .value.tree,
        ).eqls(["union", "A", "B"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("union6m")].stateValues
                .value.tree,
        ).eqls(["union", "A", "B"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("union7m")].stateValues
                .value.tree,
        ).eqls(["union", "A", "B"]);
    });

    it("mathInput prefills 2", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p>
    <math splitSymbols="false" name="noSplit">xy</math>
    <math name="split">xy</math>
    </p>

    
    <p>
    <mathInput name="splits1" prefill="$noSplit" />
    <mathInput name="splits2" prefill="$noSplit" splitSymbols="false" />
    <mathInput name="splits3" prefill="$split" />
    <mathInput name="splits4" prefill="$split" splitSymbols="false" />
    <mathInput name="splits5" prefill="xy" />
    <mathInput name="splits6" prefill="xy" splitSymbols="false" />
    <mathInput name="splits7" prefillLatex="xy" />
    <mathInput name="splits8" prefillLatex="xy" splitSymbols="false" />
    <math extend="$splits1.value" name="splits1m" />
    <math extend="$splits2.value" name="splits2m" />
    <math extend="$splits3.value" name="splits3m" />
    <math extend="$splits4.value" name="splits4m" />
    <math extend="$splits5.value" name="splits5m" />
    <math extend="$splits6.value" name="splits6m" />
    <math extend="$splits7.value" name="splits7m" />
    <math extend="$splits8.value" name="splits8m" />
    </p>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("splits1")].stateValues
                .value.tree,
        ).eqls("xy");
        expect(
            stateVariables[await resolvePathToNodeIdx("splits2")].stateValues
                .value.tree,
        ).eqls("xy");
        expect(
            stateVariables[await resolvePathToNodeIdx("splits3")].stateValues
                .value.tree,
        ).eqls(["*", "x", "y"]);
        // TODO: do we care that this doesn't work anymore
        // expect(
        //     stateVariables[await resolvePathToNodeIdx("splits4")].stateValues.value
        //         .tree,
        // ).eqls("xy");
        expect(
            stateVariables[await resolvePathToNodeIdx("splits5")].stateValues
                .value.tree,
        ).eqls(["*", "x", "y"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("splits6")].stateValues
                .value.tree,
        ).eqls("xy");
        expect(
            stateVariables[await resolvePathToNodeIdx("splits7")].stateValues
                .value.tree,
        ).eqls(["*", "x", "y"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("splits8")].stateValues
                .value.tree,
        ).eqls("xy");
        expect(
            stateVariables[await resolvePathToNodeIdx("splits1m")].stateValues
                .value.tree,
        ).eqls("xy");
        expect(
            stateVariables[await resolvePathToNodeIdx("splits2m")].stateValues
                .value.tree,
        ).eqls("xy");
        expect(
            stateVariables[await resolvePathToNodeIdx("splits3m")].stateValues
                .value.tree,
        ).eqls(["*", "x", "y"]);
        // TODO: do we care that this doesn't work anymore
        // expect(
        //     stateVariables[await resolvePathToNodeIdx("splits4m")].stateValues.value
        //         .tree,
        // ).eqls("xy");
        expect(
            stateVariables[await resolvePathToNodeIdx("splits5m")].stateValues
                .value.tree,
        ).eqls(["*", "x", "y"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("splits6m")].stateValues
                .value.tree,
        ).eqls("xy");
        expect(
            stateVariables[await resolvePathToNodeIdx("splits7m")].stateValues
                .value.tree,
        ).eqls(["*", "x", "y"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("splits8m")].stateValues
                .value.tree,
        ).eqls("xy");

        await updateMathInputValue({
            latex: "xyz",
            componentIdx: await resolvePathToNodeIdx("splits1"),
            core,
        });
        await updateMathInputValue({
            latex: "xyz",
            componentIdx: await resolvePathToNodeIdx("splits2"),
            core,
        });
        await updateMathInputValue({
            latex: "xyz",
            componentIdx: await resolvePathToNodeIdx("splits3"),
            core,
        });
        await updateMathInputValue({
            latex: "xyz",
            componentIdx: await resolvePathToNodeIdx("splits4"),
            core,
        });
        await updateMathInputValue({
            latex: "xyz",
            componentIdx: await resolvePathToNodeIdx("splits5"),
            core,
        });
        await updateMathInputValue({
            latex: "xyz",
            componentIdx: await resolvePathToNodeIdx("splits6"),
            core,
        });
        await updateMathInputValue({
            latex: "xyz",
            componentIdx: await resolvePathToNodeIdx("splits7"),
            core,
        });
        await updateMathInputValue({
            latex: "xyz",
            componentIdx: await resolvePathToNodeIdx("splits8"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("splits1")].stateValues
                .value.tree,
        ).eqls(["*", "x", "y", "z"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("splits2")].stateValues
                .value.tree,
        ).eqls("xyz");
        expect(
            stateVariables[await resolvePathToNodeIdx("splits3")].stateValues
                .value.tree,
        ).eqls(["*", "x", "y", "z"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("splits4")].stateValues
                .value.tree,
        ).eqls("xyz");
        expect(
            stateVariables[await resolvePathToNodeIdx("splits5")].stateValues
                .value.tree,
        ).eqls(["*", "x", "y", "z"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("splits6")].stateValues
                .value.tree,
        ).eqls("xyz");
        expect(
            stateVariables[await resolvePathToNodeIdx("splits7")].stateValues
                .value.tree,
        ).eqls(["*", "x", "y", "z"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("splits8")].stateValues
                .value.tree,
        ).eqls("xyz");
        expect(
            stateVariables[await resolvePathToNodeIdx("splits1m")].stateValues
                .value.tree,
        ).eqls(["*", "x", "y", "z"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("splits2m")].stateValues
                .value.tree,
        ).eqls("xyz");
        expect(
            stateVariables[await resolvePathToNodeIdx("splits3m")].stateValues
                .value.tree,
        ).eqls(["*", "x", "y", "z"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("splits4m")].stateValues
                .value.tree,
        ).eqls("xyz");
        expect(
            stateVariables[await resolvePathToNodeIdx("splits5m")].stateValues
                .value.tree,
        ).eqls(["*", "x", "y", "z"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("splits6m")].stateValues
                .value.tree,
        ).eqls("xyz");
        expect(
            stateVariables[await resolvePathToNodeIdx("splits7m")].stateValues
                .value.tree,
        ).eqls(["*", "x", "y", "z"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("splits8m")].stateValues
                .value.tree,
        ).eqls("xyz");
    });

    it("mathInput prefills 3", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p>
    <math functionSymbols="h" name="hFunction">h(x)</math>
    <math name="hNoFunction">h(x)</math>
    </p>

    <p>
    <mathInput name="hFunction1" prefill="$hFunction" />
    <mathInput name="hFunction2" prefill="$hFunction" functionSymbols="h" />
    <mathInput name="hFunction3" prefill="$hNoFunction" />
    <mathInput name="hFunction4" prefill="$hNoFunction" functionSymbols="h" />
    <mathInput name="hFunction5" prefill="h(x)" />
    <mathInput name="hFunction6" prefill="h(x)" functionSymbols="h" />
    <mathInput name="hFunction7" prefillLatex="h(x)" />
    <mathInput name="hFunction8" prefillLatex="h(x)" functionSymbols="h" />
    <math extend="$hFunction1.value" name="hFunction1m" />
    <math extend="$hFunction2.value" name="hFunction2m" />
    <math extend="$hFunction3.value" name="hFunction3m" />
    <math extend="$hFunction4.value" name="hFunction4m" />
    <math extend="$hFunction5.value" name="hFunction5m" />
    <math extend="$hFunction6.value" name="hFunction6m" />
    <math extend="$hFunction7.value" name="hFunction7m" />
    <math extend="$hFunction8.value" name="hFunction8m" />
    </p>

    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("hFunction1")]
                    .stateValues.rawRendererValue,
            ),
        ).eq("h(x)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("hFunction2")]
                    .stateValues.rawRendererValue,
            ),
        ).eq("h(x)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("hFunction3")]
                    .stateValues.rawRendererValue,
            ),
        ).eq("hx");
        // TODO: do we care that this doesn't work anymore?
        // expect(
        //     cleanLatex(
        //         stateVariables[await resolvePathToNodeIdx("hFunction4")].stateValues
        //             .rawRendererValue,
        //     ),
        // ).eq("h(x)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("hFunction5")]
                    .stateValues.rawRendererValue,
            ),
        ).eq("hx");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("hFunction6")]
                    .stateValues.rawRendererValue,
            ),
        ).eq("h(x)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("hFunction7")]
                    .stateValues.rawRendererValue,
            ),
        ).eq("h(x)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("hFunction8")]
                    .stateValues.rawRendererValue,
            ),
        ).eq("h(x)");

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("hFunction1m")]
                    .stateValues.latex,
            ),
        ).eq("h(x)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("hFunction2m")]
                    .stateValues.latex,
            ),
        ).eq("h(x)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("hFunction3m")]
                    .stateValues.latex,
            ),
        ).eq("hx");
        // TODO: do we care that this doesn't work anymore?
        // expect(
        //     cleanLatex(
        //         stateVariables[await resolvePathToNodeIdx("hFunction4m")].stateValues
        //             .latex,
        //     ),
        // ).eq("h(x)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("hFunction5m")]
                    .stateValues.latex,
            ),
        ).eq("hx");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("hFunction6m")]
                    .stateValues.latex,
            ),
        ).eq("h(x)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("hFunction7m")]
                    .stateValues.latex,
            ),
        ).eq("hx");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("hFunction8m")]
                    .stateValues.latex,
            ),
        ).eq("h(x)");

        expect(
            stateVariables[await resolvePathToNodeIdx("hFunction1")].stateValues
                .value.tree,
        ).eqls(["apply", "h", "x"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("hFunction2")].stateValues
                .value.tree,
        ).eqls(["apply", "h", "x"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("hFunction3")].stateValues
                .value.tree,
        ).eqls(["*", "h", "x"]);
        // TODO: do we care that this doesn't work anymore?
        // expect(
        //     stateVariables[await resolvePathToNodeIdx("hFunction4")].stateValues.value
        //         .tree,
        // ).eqls(["apply", "h", "x"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("hFunction5")].stateValues
                .value.tree,
        ).eqls(["*", "h", "x"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("hFunction6")].stateValues
                .value.tree,
        ).eqls(["apply", "h", "x"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("hFunction7")].stateValues
                .value.tree,
        ).eqls(["*", "h", "x"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("hFunction8")].stateValues
                .value.tree,
        ).eqls(["apply", "h", "x"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("hFunction1m")]
                .stateValues.value.tree,
        ).eqls(["apply", "h", "x"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("hFunction2m")]
                .stateValues.value.tree,
        ).eqls(["apply", "h", "x"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("hFunction3m")]
                .stateValues.value.tree,
        ).eqls(["*", "h", "x"]);
        // TODO: do we care that this doesn't work anymore?
        // expect(
        //     stateVariables[await resolvePathToNodeIdx("hFunction4m")].stateValues
        //         .value.tree,
        // ).eqls(["apply", "h", "x"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("hFunction5m")]
                .stateValues.value.tree,
        ).eqls(["*", "h", "x"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("hFunction6m")]
                .stateValues.value.tree,
        ).eqls(["apply", "h", "x"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("hFunction7m")]
                .stateValues.value.tree,
        ).eqls(["*", "h", "x"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("hFunction8m")]
                .stateValues.value.tree,
        ).eqls(["apply", "h", "x"]);

        await updateMathInputValue({
            latex: "h(y)",
            componentIdx: await resolvePathToNodeIdx("hFunction1"),
            core,
        });
        await updateMathInputValue({
            latex: "h(y)",
            componentIdx: await resolvePathToNodeIdx("hFunction2"),
            core,
        });
        await updateMathInputValue({
            latex: "h(y)",
            componentIdx: await resolvePathToNodeIdx("hFunction3"),
            core,
        });
        await updateMathInputValue({
            latex: "h(y)",
            componentIdx: await resolvePathToNodeIdx("hFunction4"),
            core,
        });
        await updateMathInputValue({
            latex: "h(y)",
            componentIdx: await resolvePathToNodeIdx("hFunction5"),
            core,
        });
        await updateMathInputValue({
            latex: "h(y)",
            componentIdx: await resolvePathToNodeIdx("hFunction6"),
            core,
        });
        await updateMathInputValue({
            latex: "h(y)",
            componentIdx: await resolvePathToNodeIdx("hFunction7"),
            core,
        });
        await updateMathInputValue({
            latex: "h(y)",
            componentIdx: await resolvePathToNodeIdx("hFunction8"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("hFunction1")]
                    .stateValues.rawRendererValue,
            ),
        ).eq("h(y)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("hFunction2")]
                    .stateValues.rawRendererValue,
            ),
        ).eq("h(y)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("hFunction3")]
                    .stateValues.rawRendererValue,
            ),
        ).eq("h(y)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("hFunction4")]
                    .stateValues.rawRendererValue,
            ),
        ).eq("h(y)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("hFunction5")]
                    .stateValues.rawRendererValue,
            ),
        ).eq("h(y)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("hFunction6")]
                    .stateValues.rawRendererValue,
            ),
        ).eq("h(y)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("hFunction7")]
                    .stateValues.rawRendererValue,
            ),
        ).eq("h(y)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("hFunction8")]
                    .stateValues.rawRendererValue,
            ),
        ).eq("h(y)");

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("hFunction1m")]
                    .stateValues.latex,
            ),
        ).eq("hy");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("hFunction2m")]
                    .stateValues.latex,
            ),
        ).eq("h(y)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("hFunction3m")]
                    .stateValues.latex,
            ),
        ).eq("hy");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("hFunction4m")]
                    .stateValues.latex,
            ),
        ).eq("h(y)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("hFunction5m")]
                    .stateValues.latex,
            ),
        ).eq("hy");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("hFunction6m")]
                    .stateValues.latex,
            ),
        ).eq("h(y)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("hFunction7m")]
                    .stateValues.latex,
            ),
        ).eq("hy");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("hFunction8m")]
                    .stateValues.latex,
            ),
        ).eq("h(y)");

        expect(
            stateVariables[await resolvePathToNodeIdx("hFunction1")].stateValues
                .value.tree,
        ).eqls(["*", "h", "y"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("hFunction2")].stateValues
                .value.tree,
        ).eqls(["apply", "h", "y"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("hFunction3")].stateValues
                .value.tree,
        ).eqls(["*", "h", "y"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("hFunction4")].stateValues
                .value.tree,
        ).eqls(["apply", "h", "y"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("hFunction5")].stateValues
                .value.tree,
        ).eqls(["*", "h", "y"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("hFunction6")].stateValues
                .value.tree,
        ).eqls(["apply", "h", "y"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("hFunction7")].stateValues
                .value.tree,
        ).eqls(["*", "h", "y"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("hFunction8")].stateValues
                .value.tree,
        ).eqls(["apply", "h", "y"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("hFunction1m")]
                .stateValues.value.tree,
        ).eqls(["*", "h", "y"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("hFunction2m")]
                .stateValues.value.tree,
        ).eqls(["apply", "h", "y"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("hFunction3m")]
                .stateValues.value.tree,
        ).eqls(["*", "h", "y"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("hFunction4m")]
                .stateValues.value.tree,
        ).eqls(["apply", "h", "y"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("hFunction5m")]
                .stateValues.value.tree,
        ).eqls(["*", "h", "y"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("hFunction6m")]
                .stateValues.value.tree,
        ).eqls(["apply", "h", "y"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("hFunction7m")]
                .stateValues.value.tree,
        ).eqls(["*", "h", "y"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("hFunction8m")]
                .stateValues.value.tree,
        ).eqls(["apply", "h", "y"]);
    });

    it("prefillFromLatex", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p>Prefill with m: <m>\\frac{a}{b} \\int_a^b \\hat{f}(x) dx</m></p>
    <p>Result: <mathInput prefillLatex="$_m1" name="input1" /></p>
    <p name="pv1">Value: <math extend="$input1" name="iv1" /></p>
    <p name="pr1">Raw value: $input1.rawRendererValue</p>

    <p>Prefill with phrase including "\\ "</p>
    <p>Result: <mathInput prefillLatex="hello\\ there (a)(b)" name="input2" /></p>
    <p name="pv2">Value: <math extend="$input2" name="iv2" /></p>
    <p name="pr2">Raw value: $input2.rawRendererValue</p>

    <p>Prefill with a \\text</p>
    <p>Result: <mathInput prefillLatex="\\text{hello there} (a)(b)" name="input3" /></p>
    <p name="pv3">Value: <math extend="$input3" name="iv3" /></p>
    <p name="pr3">Raw value: $input3.rawRendererValue</p>

    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("input1")].stateValues
                .value.tree,
        ).eq("\uff3f");
        expect(
            stateVariables[await resolvePathToNodeIdx("input1")].stateValues
                .immediateValue.tree,
        ).eq("\uff3f");
        expect(
            stateVariables[await resolvePathToNodeIdx("input1")].stateValues
                .rawRendererValue,
        ).eq("\\frac{a}{b} \\int_a^b \\hat{f}(x) dx");
        expect(
            stateVariables[await resolvePathToNodeIdx("input2")].stateValues
                .value.tree,
        ).eqls([
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
        expect(
            stateVariables[await resolvePathToNodeIdx("input2")].stateValues
                .immediateValue.tree,
        ).eqls([
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
        expect(
            stateVariables[await resolvePathToNodeIdx("input2")].stateValues
                .rawRendererValue,
        ).eq("hello\\ there (a)(b)");
        expect(
            stateVariables[await resolvePathToNodeIdx("input3")].stateValues
                .value.tree,
        ).eq("\uff3f");
        expect(
            stateVariables[await resolvePathToNodeIdx("input3")].stateValues
                .immediateValue.tree,
        ).eq("\uff3f");
        expect(
            stateVariables[await resolvePathToNodeIdx("input3")].stateValues
                .rawRendererValue,
        ).eq("\\text{hello there} (a)(b)");

        await updateMathInputValue({
            latex: "\\frac{a}{b} \\int_a^b f(x) dx",
            componentIdx: await resolvePathToNodeIdx("input1"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("iv1")].stateValues
                    .latex,
            ),
        ).eq("\\frac{a}{b}\\int_{a}^{b}f(x)dx");
        expect(
            stateVariables[await resolvePathToNodeIdx("pr1")].stateValues.text,
        ).eq("Raw value: \\frac{a}{b} \\int_a^b f(x) dx");

        // expect(stateVariables['/input1'].stateValues.value.tree).eqls(["*", ["/", "a", "b"], "a", ["apply", "f", "x"], "d", "x"])
        // expect(stateVariables['/input1'].stateValues.immediateValue.tree).eqls(["*", ["/", "a", "b"], "a", ["apply", "f", "x"], "d", "x"])
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("input1")].stateValues
                    .rawRendererValue,
            ),
        ).eq("\\frac{a}{b}\\int_a^bf(x)dx");

        await updateMathInputValue({
            latex: "hello(a)(b)",
            componentIdx: await resolvePathToNodeIdx("input2"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("iv2")].stateValues
                    .latex,
            ),
        ).eq("helloab");
        expect(
            stateVariables[await resolvePathToNodeIdx("pr2")].stateValues.text,
        ).eq("Raw value: hello(a)(b)");

        expect(
            stateVariables[await resolvePathToNodeIdx("input2")].stateValues
                .value.tree,
        ).eqls(["*", "h", "e", "l", "l", "o", "a", "b"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("input2")].stateValues
                .immediateValue.tree,
        ).eqls(["*", "h", "e", "l", "l", "o", "a", "b"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("input2")].stateValues
                .rawRendererValue,
        ).eq("hello(a)(b)");

        await updateMathInputValue({
            latex: "\\text{h}(a)(b)",
            componentIdx: await resolvePathToNodeIdx("input3"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("iv3")].stateValues
                    .latex,
            ),
        ).eq("\uff3f");
        expect(
            stateVariables[await resolvePathToNodeIdx("pr3")].stateValues.text,
        ).eq("Raw value: \\text{h}(a)(b)");

        expect(
            stateVariables[await resolvePathToNodeIdx("input3")].stateValues
                .value.tree,
        ).eq("\uff3f");
        expect(
            stateVariables[await resolvePathToNodeIdx("input3")].stateValues
                .immediateValue.tree,
        ).eq("\uff3f");
        expect(
            stateVariables[await resolvePathToNodeIdx("input3")].stateValues
                .rawRendererValue,
        ).eq("\\text{h}(a)(b)");

        await updateMathInputValue({
            latex: "(a)(b)",
            componentIdx: await resolvePathToNodeIdx("input3"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("iv3")].stateValues
                    .latex,
            ),
        ).eq("ab");
        expect(
            stateVariables[await resolvePathToNodeIdx("pr3")].stateValues.text,
        ).eq("Raw value: (a)(b)");

        expect(
            stateVariables[await resolvePathToNodeIdx("input3")].stateValues
                .value.tree,
        ).eqls(["*", "a", "b"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("input3")].stateValues
                .immediateValue.tree,
        ).eqls(["*", "a", "b"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("input3")].stateValues
                .rawRendererValue,
        ).eq("(a)(b)");
    });

    it("convert and/or into logicals", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <mathInput name="mi" />

    <p>Value: <math extend="$mi.value" name="m" /></p>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("m")].stateValues.value
                .tree,
        ).eq("\uff3f");

        // equalities with or

        await updateMathInputValue({
            latex: "x=1 or u=x",
            componentIdx: await resolvePathToNodeIdx("mi"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues.value
                .tree,
        ).eqls(["or", ["=", "x", 1], ["=", "u", "x"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m")].stateValues.value
                .tree,
        ).eqls(["or", ["=", "x", 1], ["=", "u", "x"]]);

        // inequalities with and
        await updateMathInputValue({
            latex: "x>3 and x \\le 5",
            componentIdx: await resolvePathToNodeIdx("mi"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues.value
                .tree,
        ).eqls(["and", [">", "x", 3], ["le", "x", 5]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m")].stateValues.value
                .tree,
        ).eqls(["and", [">", "x", 3], ["le", "x", 5]]);

        // don't convert if not word
        await updateMathInputValue({
            latex: "AandBorC",
            componentIdx: await resolvePathToNodeIdx("mi"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues.value
                .tree,
        ).eqls(["*", "A", "a", "n", "d", "B", "o", "r", "C"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m")].stateValues.value
                .tree,
        ).eqls(["*", "A", "a", "n", "d", "B", "o", "r", "C"]);

        // add parens or spaces
        await updateMathInputValue({
            latex: "(A)and B or(C)",
            componentIdx: await resolvePathToNodeIdx("mi"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues.value
                .tree,
        ).eqls(["or", ["and", "A", "B"], "C"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m")].stateValues.value
                .tree,
        ).eqls(["or", ["and", "A", "B"], "C"]);
    });

    it("union from U", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <booleanInput name="ufu" />
    <mathInput name="mi" unionFromU="$ufu" />

    <p>Value: <math extend="$mi.value" name="m" /></p>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("m")].stateValues.value
                .tree,
        ).eq("\uff3f");

        // A U C without unionFromU

        await updateMathInputValue({
            latex: "A U C",
            componentIdx: await resolvePathToNodeIdx("mi"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues.value
                .tree,
        ).eqls(["*", "A", "U", "C"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m")].stateValues.value
                .tree,
        ).eqls(["*", "A", "U", "C"]);

        // activate unionFromU and modify text

        await updateBooleanInputValue({
            boolean: true,
            componentIdx: await resolvePathToNodeIdx("ufu"),
            core,
        });
        await updateMathInputValue({
            latex: "A U B",
            componentIdx: await resolvePathToNodeIdx("mi"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues.value
                .tree,
        ).eqls(["union", "A", "B"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m")].stateValues.value
                .tree,
        ).eqls(["union", "A", "B"]);

        // no substitution without spaces

        await updateMathInputValue({
            latex: "A UB",
            componentIdx: await resolvePathToNodeIdx("mi"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues.value
                .tree,
        ).eqls(["*", "A", "U", "B"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m")].stateValues.value
                .tree,
        ).eqls(["*", "A", "U", "B"]);

        // add parens

        await updateMathInputValue({
            latex: "A U(B)",
            componentIdx: await resolvePathToNodeIdx("mi"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues.value
                .tree,
        ).eqls(["union", "A", "B"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m")].stateValues.value
                .tree,
        ).eqls(["union", "A", "B"]);
    });

    it("mathInput can merge coordinates", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <mathInput name="coords" prefill="(1,2)" />
  <graph>
    <point name="P" coords="$coords" />
  </graph>
  <p>Change x-coordinate: <mathInput name="x1" bindValueTo="$P.x1" /></p>
  <p>Change y-coordinate: <mathInput name="x2" bindValueTo="$P.x2" /></p>
  `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("coords")].stateValues
                    .rawRendererValue,
            ),
        ).eq("(1,2)");

        await updateMathInputValue({
            latex: "3",
            componentIdx: await resolvePathToNodeIdx("x1"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("coords")].stateValues
                    .rawRendererValue,
            ),
        ).eq("(3,2)");

        await updateMathInputValue({
            latex: "4",
            componentIdx: await resolvePathToNodeIdx("x2"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("coords")].stateValues
                    .rawRendererValue,
            ),
        ).eq("(3,4)");
    });

    it("mathInput can merge coordinates, immediateValue", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <mathInput name="coords" prefill="(1,2)" />
  <graph>
    <point name="P" coords="$coords.immediateValue" />
  </graph>
  <p>Change x-coordinate: <mathInput name="x1" bindValueTo="$P.x1" /></p>
  <p>Change y-coordinate: <mathInput name="x2" bindValueTo="$P.x2" /></p>
  `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("coords")].stateValues
                    .rawRendererValue,
            ),
        ).eq("(1,2)");

        await updateMathInputValue({
            latex: "3",
            componentIdx: await resolvePathToNodeIdx("x1"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("coords")].stateValues
                    .rawRendererValue,
            ),
        ).eq("(3,2)");

        await updateMathInputValue({
            latex: "4",
            componentIdx: await resolvePathToNodeIdx("x2"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("coords")].stateValues
                    .rawRendererValue,
            ),
        ).eq("(3,4)");
    });

    it("change prefill", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <p><mathInput name="mi" prefill="(1,2)" /></p>
  <p>Value: <math extend="$mi.value" name="m" /></p>
  <p>Prefill: <math extend="$mi.prefill" name="pf" /></p>
  <p>Change prefill: <mathInput name="mipf" bindValueTo="$mi.prefill" /></p>
  `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("pf")].stateValues.value
                .tree,
        ).eqls(["tuple", 1, 2]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m")].stateValues.value
                .tree,
        ).eqls(["tuple", 1, 2]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues.value
                .tree,
        ).eqls(["tuple", 1, 2]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues.prefill
                .tree,
        ).eqls(["tuple", 1, 2]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mipf")].stateValues.value
                .tree,
        ).eqls(["tuple", 1, 2]);

        // change prefill

        await updateMathInputValue({
            latex: "(1,5)",
            componentIdx: await resolvePathToNodeIdx("mipf"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("pf")].stateValues.value
                .tree,
        ).eqls(["tuple", 1, 5]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m")].stateValues.value
                .tree,
        ).eqls(["tuple", 1, 5]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues.value
                .tree,
        ).eqls(["tuple", 1, 5]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues.prefill
                .tree,
        ).eqls(["tuple", 1, 5]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mipf")].stateValues.value
                .tree,
        ).eqls(["tuple", 1, 5]);

        // change value

        await updateMathInputValue({
            latex: "(1,9)",
            componentIdx: await resolvePathToNodeIdx("mi"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("pf")].stateValues.value
                .tree,
        ).eqls(["tuple", 1, 5]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m")].stateValues.value
                .tree,
        ).eqls(["tuple", 1, 9]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues.value
                .tree,
        ).eqls(["tuple", 1, 9]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues.prefill
                .tree,
        ).eqls(["tuple", 1, 5]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mipf")].stateValues.value
                .tree,
        ).eqls(["tuple", 1, 5]);

        // change prefill again

        await updateMathInputValue({
            latex: "(1,7)",
            componentIdx: await resolvePathToNodeIdx("mipf"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("pf")].stateValues.value
                .tree,
        ).eqls(["tuple", 1, 7]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m")].stateValues.value
                .tree,
        ).eqls(["tuple", 1, 9]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues.value
                .tree,
        ).eqls(["tuple", 1, 9]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues.prefill
                .tree,
        ).eqls(["tuple", 1, 7]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mipf")].stateValues.value
                .tree,
        ).eqls(["tuple", 1, 7]);
    });

    it("mathInput with number child", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <p><mathInput name="mi" ><number /></mathInput></p>
  <p>Value: <math extend="$mi.value" name="mv" /></p>
  <p>Immediate Value: <math extend="$mi.immediateValue" name="miv" /></p>
  `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("mv")].stateValues.value
                .tree,
        ).eqls(NaN);
        expect(
            stateVariables[await resolvePathToNodeIdx("miv")].stateValues.value
                .tree,
        ).eqls(NaN);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues
                .rawRendererValue,
        ).eqls("");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues.value
                .tree,
        ).eqls(NaN);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues
                .immediateValue.tree,
        ).eqls(NaN);

        // type a number

        await updateMathInputImmediateValue({
            latex: "5",
            componentIdx: await resolvePathToNodeIdx("mi"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("mv")].stateValues.value
                .tree,
        ).eqls(NaN);
        expect(
            stateVariables[await resolvePathToNodeIdx("miv")].stateValues.value
                .tree,
        ).eqls(5);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues
                .rawRendererValue,
        ).eqls("5");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues.value
                .tree,
        ).eqls(NaN);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues
                .immediateValue.tree,
        ).eqls(5);

        // update value (e.g., hit enter)

        await updateMathInputValueToImmediateValue({
            componentIdx: await resolvePathToNodeIdx("mi"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("mv")].stateValues.value
                .tree,
        ).eqls(5);
        expect(
            stateVariables[await resolvePathToNodeIdx("miv")].stateValues.value
                .tree,
        ).eqls(5);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues
                .rawRendererValue,
        ).eqls("5");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues.value
                .tree,
        ).eqls(5);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues
                .immediateValue.tree,
        ).eqls(5);

        // type pi

        await updateMathInputImmediateValue({
            latex: "\\pi",
            componentIdx: await resolvePathToNodeIdx("mi"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("mv")].stateValues.value
                .tree,
        ).eqls(5);
        expect(
            stateVariables[await resolvePathToNodeIdx("miv")].stateValues.value
                .tree,
        ).eqls("pi");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues
                .rawRendererValue,
        ).eqls("\\pi");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues.value
                .tree,
        ).eqls(5);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues
                .immediateValue.tree,
        ).eqls("pi");

        // update value (e.g., hit enter)

        await updateMathInputValueToImmediateValue({
            componentIdx: await resolvePathToNodeIdx("mi"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("mv")].stateValues.value
                .tree,
        ).eqls(Math.PI);
        expect(
            stateVariables[await resolvePathToNodeIdx("mv")].stateValues
                .valueForDisplay.tree,
        ).eqls(3.141592654);
        expect(
            stateVariables[await resolvePathToNodeIdx("miv")].stateValues.value
                .tree,
        ).eqls(Math.PI);
        expect(
            stateVariables[await resolvePathToNodeIdx("miv")].stateValues
                .valueForDisplay.tree,
        ).eqls(3.141592654);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues
                .rawRendererValue,
        ).eqls("3.141592654");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues.value
                .tree,
        ).eqls(Math.PI);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues
                .immediateValue.tree,
        ).eqls(Math.PI);

        // type x
        await updateMathInputImmediateValue({
            latex: "x",
            componentIdx: await resolvePathToNodeIdx("mi"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("mv")].stateValues.value
                .tree,
        ).eqls(Math.PI);
        expect(
            stateVariables[await resolvePathToNodeIdx("mv")].stateValues
                .valueForDisplay.tree,
        ).eqls(3.141592654);
        expect(
            stateVariables[await resolvePathToNodeIdx("miv")].stateValues.value
                .tree,
        ).eqls("x");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues
                .rawRendererValue,
        ).eqls("x");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues.value
                .tree,
        ).eqls(Math.PI);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues
                .immediateValue.tree,
        ).eqls("x");

        // update value (e.g., hit enter)

        await updateMathInputValueToImmediateValue({
            componentIdx: await resolvePathToNodeIdx("mi"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("mv")].stateValues.value
                .tree,
        ).eqls(NaN);
        expect(
            stateVariables[await resolvePathToNodeIdx("miv")].stateValues.value
                .tree,
        ).eqls(NaN);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues
                .rawRendererValue,
        ).eqls("");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues.value
                .tree,
        ).eqls(NaN);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues
                .immediateValue.tree,
        ).eqls(NaN);

        // type 2/3

        await updateMathInputImmediateValue({
            latex: "2/3",
            componentIdx: await resolvePathToNodeIdx("mi"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("mv")].stateValues.value
                .tree,
        ).eqls(NaN);
        expect(
            stateVariables[await resolvePathToNodeIdx("miv")].stateValues.value
                .tree,
        ).eqls(["/", 2, 3]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues
                .rawRendererValue,
        ).eqls("2/3");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues.value
                .tree,
        ).eqls(NaN);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues
                .immediateValue.tree,
        ).eqls(["/", 2, 3]);

        // update value (e.g., hit enter)

        await updateMathInputValueToImmediateValue({
            componentIdx: await resolvePathToNodeIdx("mi"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("mv")].stateValues.value
                .tree,
        ).eqls(2 / 3);
        expect(
            stateVariables[await resolvePathToNodeIdx("mv")].stateValues
                .valueForDisplay.tree,
        ).eqls(0.6666666667);
        expect(
            stateVariables[await resolvePathToNodeIdx("miv")].stateValues.value
                .tree,
        ).eqls(2 / 3);
        expect(
            stateVariables[await resolvePathToNodeIdx("miv")].stateValues
                .valueForDisplay.tree,
        ).eqls(0.6666666667);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues
                .rawRendererValue,
        ).eqls("0.6666666667");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues.value
                .tree,
        ).eqls(2 / 3);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues
                .immediateValue.tree,
        ).eqls(2 / 3);
    });

    it("mathInput with number child, do not hide NaN", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <p><mathInput name="mi" hideNaN="false"><number /></mathInput></p>
  <p>Value: <math extend="$mi.value" name="mv" /></p>
  <p>Immediate Value: <math extend="$mi.immediateValue" name="miv" /></p>
  `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("mv")].stateValues.value
                .tree,
        ).eqls(NaN);
        expect(
            stateVariables[await resolvePathToNodeIdx("miv")].stateValues.value
                .tree,
        ).eqls(NaN);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues
                .rawRendererValue,
        ).eqls("NaN");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues.value
                .tree,
        ).eqls(NaN);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues
                .immediateValue.tree,
        ).eqls(NaN);

        // type a number

        await updateMathInputImmediateValue({
            latex: "5",
            componentIdx: await resolvePathToNodeIdx("mi"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("mv")].stateValues.value
                .tree,
        ).eqls(NaN);
        expect(
            stateVariables[await resolvePathToNodeIdx("miv")].stateValues.value
                .tree,
        ).eqls(5);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues
                .rawRendererValue,
        ).eqls("5");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues.value
                .tree,
        ).eqls(NaN);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues
                .immediateValue.tree,
        ).eqls(5);

        // update value (e.g., hit enter)

        await updateMathInputValueToImmediateValue({
            componentIdx: await resolvePathToNodeIdx("mi"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("mv")].stateValues.value
                .tree,
        ).eqls(5);
        expect(
            stateVariables[await resolvePathToNodeIdx("miv")].stateValues.value
                .tree,
        ).eqls(5);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues
                .rawRendererValue,
        ).eqls("5");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues.value
                .tree,
        ).eqls(5);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues
                .immediateValue.tree,
        ).eqls(5);

        // type pi

        await updateMathInputImmediateValue({
            latex: "\\pi",
            componentIdx: await resolvePathToNodeIdx("mi"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("mv")].stateValues.value
                .tree,
        ).eqls(5);
        expect(
            stateVariables[await resolvePathToNodeIdx("miv")].stateValues.value
                .tree,
        ).eqls("pi");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues
                .rawRendererValue,
        ).eqls("\\pi");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues.value
                .tree,
        ).eqls(5);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues
                .immediateValue.tree,
        ).eqls("pi");

        // update value (e.g., hit enter)

        await updateMathInputValueToImmediateValue({
            componentIdx: await resolvePathToNodeIdx("mi"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("mv")].stateValues.value
                .tree,
        ).eqls(Math.PI);
        expect(
            stateVariables[await resolvePathToNodeIdx("mv")].stateValues
                .valueForDisplay.tree,
        ).eqls(3.141592654);
        expect(
            stateVariables[await resolvePathToNodeIdx("miv")].stateValues.value
                .tree,
        ).eqls(Math.PI);
        expect(
            stateVariables[await resolvePathToNodeIdx("miv")].stateValues
                .valueForDisplay.tree,
        ).eqls(3.141592654);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues
                .rawRendererValue,
        ).eqls("3.141592654");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues.value
                .tree,
        ).eqls(Math.PI);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues
                .immediateValue.tree,
        ).eqls(Math.PI);

        // type x
        await updateMathInputImmediateValue({
            latex: "x",
            componentIdx: await resolvePathToNodeIdx("mi"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("mv")].stateValues.value
                .tree,
        ).eqls(Math.PI);
        expect(
            stateVariables[await resolvePathToNodeIdx("mv")].stateValues
                .valueForDisplay.tree,
        ).eqls(3.141592654);
        expect(
            stateVariables[await resolvePathToNodeIdx("miv")].stateValues.value
                .tree,
        ).eqls("x");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues
                .rawRendererValue,
        ).eqls("x");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues.value
                .tree,
        ).eqls(Math.PI);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues
                .immediateValue.tree,
        ).eqls("x");

        // update value (e.g., hit enter)

        await updateMathInputValueToImmediateValue({
            componentIdx: await resolvePathToNodeIdx("mi"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("mv")].stateValues.value
                .tree,
        ).eqls(NaN);
        expect(
            stateVariables[await resolvePathToNodeIdx("miv")].stateValues.value
                .tree,
        ).eqls(NaN);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues
                .rawRendererValue,
        ).eqls("NaN");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues.value
                .tree,
        ).eqls(NaN);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues
                .immediateValue.tree,
        ).eqls(NaN);

        // type 2/3

        await updateMathInputImmediateValue({
            latex: "2/3",
            componentIdx: await resolvePathToNodeIdx("mi"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("mv")].stateValues.value
                .tree,
        ).eqls(NaN);
        expect(
            stateVariables[await resolvePathToNodeIdx("miv")].stateValues.value
                .tree,
        ).eqls(["/", 2, 3]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues
                .rawRendererValue,
        ).eqls("2/3");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues.value
                .tree,
        ).eqls(NaN);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues
                .immediateValue.tree,
        ).eqls(["/", 2, 3]);

        // update value (e.g., hit enter)

        await updateMathInputValueToImmediateValue({
            componentIdx: await resolvePathToNodeIdx("mi"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("mv")].stateValues.value
                .tree,
        ).eqls(2 / 3);
        expect(
            stateVariables[await resolvePathToNodeIdx("mv")].stateValues
                .valueForDisplay.tree,
        ).eqls(0.6666666667);
        expect(
            stateVariables[await resolvePathToNodeIdx("miv")].stateValues.value
                .tree,
        ).eqls(2 / 3);
        expect(
            stateVariables[await resolvePathToNodeIdx("miv")].stateValues
                .valueForDisplay.tree,
        ).eqls(0.6666666667);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues
                .rawRendererValue,
        ).eqls("0.6666666667");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues.value
                .tree,
        ).eqls(2 / 3);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues
                .immediateValue.tree,
        ).eqls(2 / 3);
    });

    it("mathInput with number child, value on NaN", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <p><mathInput name="mi"><number valueOnNaN='0' /></mathInput></p>
  <p>Value: <math extend="$mi.value" name="mv" /></p>
  <p>Immediate Value: <math extend="$mi.immediateValue" name="miv" /></p>
  `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("mv")].stateValues.value
                .tree,
        ).eqls(0);
        expect(
            stateVariables[await resolvePathToNodeIdx("miv")].stateValues.value
                .tree,
        ).eqls(0);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues
                .rawRendererValue,
        ).eqls("0");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues.value
                .tree,
        ).eqls(0);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues
                .immediateValue.tree,
        ).eqls(0);

        // type a number

        await updateMathInputImmediateValue({
            latex: "5",
            componentIdx: await resolvePathToNodeIdx("mi"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("mv")].stateValues.value
                .tree,
        ).eqls(0);
        expect(
            stateVariables[await resolvePathToNodeIdx("miv")].stateValues.value
                .tree,
        ).eqls(5);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues
                .rawRendererValue,
        ).eqls("5");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues.value
                .tree,
        ).eqls(0);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues
                .immediateValue.tree,
        ).eqls(5);

        // update value (e.g., hit enter)

        await updateMathInputValueToImmediateValue({
            componentIdx: await resolvePathToNodeIdx("mi"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("mv")].stateValues.value
                .tree,
        ).eqls(5);
        expect(
            stateVariables[await resolvePathToNodeIdx("miv")].stateValues.value
                .tree,
        ).eqls(5);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues
                .rawRendererValue,
        ).eqls("5");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues.value
                .tree,
        ).eqls(5);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues
                .immediateValue.tree,
        ).eqls(5);

        // type pi

        await updateMathInputImmediateValue({
            latex: "\\pi",
            componentIdx: await resolvePathToNodeIdx("mi"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("mv")].stateValues.value
                .tree,
        ).eqls(5);
        expect(
            stateVariables[await resolvePathToNodeIdx("miv")].stateValues.value
                .tree,
        ).eqls("pi");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues
                .rawRendererValue,
        ).eqls("\\pi");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues.value
                .tree,
        ).eqls(5);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues
                .immediateValue.tree,
        ).eqls("pi");

        // update value (e.g., hit enter)

        await updateMathInputValueToImmediateValue({
            componentIdx: await resolvePathToNodeIdx("mi"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("mv")].stateValues.value
                .tree,
        ).eqls(Math.PI);
        expect(
            stateVariables[await resolvePathToNodeIdx("mv")].stateValues
                .valueForDisplay.tree,
        ).eqls(3.141592654);
        expect(
            stateVariables[await resolvePathToNodeIdx("miv")].stateValues.value
                .tree,
        ).eqls(Math.PI);
        expect(
            stateVariables[await resolvePathToNodeIdx("miv")].stateValues
                .valueForDisplay.tree,
        ).eqls(3.141592654);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues
                .rawRendererValue,
        ).eqls("3.141592654");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues.value
                .tree,
        ).eqls(Math.PI);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues
                .immediateValue.tree,
        ).eqls(Math.PI);

        // type x
        await updateMathInputImmediateValue({
            latex: "x",
            componentIdx: await resolvePathToNodeIdx("mi"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("mv")].stateValues.value
                .tree,
        ).eqls(Math.PI);
        expect(
            stateVariables[await resolvePathToNodeIdx("mv")].stateValues
                .valueForDisplay.tree,
        ).eqls(3.141592654);
        expect(
            stateVariables[await resolvePathToNodeIdx("miv")].stateValues.value
                .tree,
        ).eqls("x");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues
                .rawRendererValue,
        ).eqls("x");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues.value
                .tree,
        ).eqls(Math.PI);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues
                .immediateValue.tree,
        ).eqls("x");

        // update value (e.g., hit enter)

        await updateMathInputValueToImmediateValue({
            componentIdx: await resolvePathToNodeIdx("mi"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("mv")].stateValues.value
                .tree,
        ).eqls(0);
        expect(
            stateVariables[await resolvePathToNodeIdx("miv")].stateValues.value
                .tree,
        ).eqls(0);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues
                .rawRendererValue,
        ).eqls("0");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues.value
                .tree,
        ).eqls(0);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues
                .immediateValue.tree,
        ).eqls(0);

        // type 2/3

        await updateMathInputImmediateValue({
            latex: "2/3",
            componentIdx: await resolvePathToNodeIdx("mi"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("mv")].stateValues.value
                .tree,
        ).eqls(0);
        expect(
            stateVariables[await resolvePathToNodeIdx("miv")].stateValues.value
                .tree,
        ).eqls(["/", 2, 3]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues
                .rawRendererValue,
        ).eqls("2/3");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues.value
                .tree,
        ).eqls(0);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues
                .immediateValue.tree,
        ).eqls(["/", 2, 3]);

        // update value (e.g., hit enter)

        await updateMathInputValueToImmediateValue({
            componentIdx: await resolvePathToNodeIdx("mi"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("mv")].stateValues.value
                .tree,
        ).eqls(2 / 3);
        expect(
            stateVariables[await resolvePathToNodeIdx("mv")].stateValues
                .valueForDisplay.tree,
        ).eqls(0.6666666667);
        expect(
            stateVariables[await resolvePathToNodeIdx("miv")].stateValues.value
                .tree,
        ).eqls(2 / 3);
        expect(
            stateVariables[await resolvePathToNodeIdx("miv")].stateValues
                .valueForDisplay.tree,
        ).eqls(0.6666666667);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues
                .rawRendererValue,
        ).eqls("0.6666666667");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues.value
                .tree,
        ).eqls(2 / 3);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues
                .immediateValue.tree,
        ).eqls(2 / 3);
    });

    it("mathInput with number child, force positive integer", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <p><mathInput name="mi">
    <clampNumber lowerValue="1" upperValue="Infinity"><integer/></clampNumber>
  </mathInput></p>
  <p>Value: <math extend="$mi.value" name="mv" /></p>
  <p>Immediate Value: <math extend="$mi.immediateValue" name="miv" /></p>
  `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("mv")].stateValues.value
                .tree,
        ).eqls(NaN);
        expect(
            stateVariables[await resolvePathToNodeIdx("miv")].stateValues.value
                .tree,
        ).eqls(NaN);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues
                .rawRendererValue,
        ).eqls("");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues.value
                .tree,
        ).eqls(NaN);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues
                .immediateValue.tree,
        ).eqls(NaN);

        // type a number

        await updateMathInputImmediateValue({
            latex: "5",
            componentIdx: await resolvePathToNodeIdx("mi"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("mv")].stateValues.value
                .tree,
        ).eqls(NaN);
        expect(
            stateVariables[await resolvePathToNodeIdx("miv")].stateValues.value
                .tree,
        ).eqls(5);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues
                .rawRendererValue,
        ).eqls("5");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues.value
                .tree,
        ).eqls(NaN);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues
                .immediateValue.tree,
        ).eqls(5);

        // update value (e.g., hit enter)

        await updateMathInputValueToImmediateValue({
            componentIdx: await resolvePathToNodeIdx("mi"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("mv")].stateValues.value
                .tree,
        ).eqls(5);
        expect(
            stateVariables[await resolvePathToNodeIdx("miv")].stateValues.value
                .tree,
        ).eqls(5);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues
                .rawRendererValue,
        ).eqls("5");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues.value
                .tree,
        ).eqls(5);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues
                .immediateValue.tree,
        ).eqls(5);

        // type pi

        await updateMathInputImmediateValue({
            latex: "\\pi",
            componentIdx: await resolvePathToNodeIdx("mi"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("mv")].stateValues.value
                .tree,
        ).eqls(5);
        expect(
            stateVariables[await resolvePathToNodeIdx("miv")].stateValues.value
                .tree,
        ).eqls("pi");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues
                .rawRendererValue,
        ).eqls("\\pi");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues.value
                .tree,
        ).eqls(5);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues
                .immediateValue.tree,
        ).eqls("pi");

        // update value (e.g., hit enter)

        await updateMathInputValueToImmediateValue({
            componentIdx: await resolvePathToNodeIdx("mi"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("mv")].stateValues.value
                .tree,
        ).eqls(3);
        expect(
            stateVariables[await resolvePathToNodeIdx("miv")].stateValues.value
                .tree,
        ).eqls(3);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues
                .rawRendererValue,
        ).eqls("3");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues.value
                .tree,
        ).eqls(3);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues
                .immediateValue.tree,
        ).eqls(3);

        // type x
        await updateMathInputImmediateValue({
            latex: "x",
            componentIdx: await resolvePathToNodeIdx("mi"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("mv")].stateValues.value
                .tree,
        ).eqls(3);
        expect(
            stateVariables[await resolvePathToNodeIdx("miv")].stateValues.value
                .tree,
        ).eqls("x");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues
                .rawRendererValue,
        ).eqls("x");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues.value
                .tree,
        ).eqls(3);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues
                .immediateValue.tree,
        ).eqls("x");

        // update value (e.g., hit enter)

        await updateMathInputValueToImmediateValue({
            componentIdx: await resolvePathToNodeIdx("mi"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("mv")].stateValues.value
                .tree,
        ).eqls(NaN);
        expect(
            stateVariables[await resolvePathToNodeIdx("miv")].stateValues.value
                .tree,
        ).eqls(NaN);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues
                .rawRendererValue,
        ).eqls("");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues.value
                .tree,
        ).eqls(NaN);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues
                .immediateValue.tree,
        ).eqls(NaN);

        // type 2/3

        await updateMathInputImmediateValue({
            latex: "2/3",
            componentIdx: await resolvePathToNodeIdx("mi"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("mv")].stateValues.value
                .tree,
        ).eqls(NaN);
        expect(
            stateVariables[await resolvePathToNodeIdx("miv")].stateValues.value
                .tree,
        ).eqls(["/", 2, 3]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues
                .rawRendererValue,
        ).eqls("2/3");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues.value
                .tree,
        ).eqls(NaN);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues
                .immediateValue.tree,
        ).eqls(["/", 2, 3]);

        // update value (e.g., hit enter)

        await updateMathInputValueToImmediateValue({
            componentIdx: await resolvePathToNodeIdx("mi"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("mv")].stateValues.value
                .tree,
        ).eqls(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("miv")].stateValues.value
                .tree,
        ).eqls(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues
                .rawRendererValue,
        ).eqls("1");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues.value
                .tree,
        ).eqls(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues
                .immediateValue.tree,
        ).eqls(1);
    });

    it("copy raw renderer value, handle incomplete math", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <mathInput name="mi" />
  <text name="rv" extend="$mi.rawRendererValue" />
  `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues.value
                .tree,
        ).eqls("\uff3f");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues
                .immediateValue.tree,
        ).eqls("\uff3f");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues
                .rawRendererValue,
        ).eqls("");
        expect(
            stateVariables[await resolvePathToNodeIdx("rv")].stateValues.value,
        ).eqls("");

        // enter value that parses to math
        await updateMathInputValue({
            latex: "a",
            componentIdx: await resolvePathToNodeIdx("mi"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues.value
                .tree,
        ).eqls("a");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues
                .immediateValue.tree,
        ).eqls("a");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues
                .rawRendererValue,
        ).eqls("a");
        expect(
            stateVariables[await resolvePathToNodeIdx("rv")].stateValues.value,
        ).eqls("a");

        // enter value that is incomplete in math

        await updateMathInputValue({
            latex: "a^{ }",
            componentIdx: await resolvePathToNodeIdx("mi"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues.value
                .tree,
        ).eqls(["^", "a", "\uff3f"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues
                .immediateValue.tree,
        ).eqls(["^", "a", "\uff3f"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues
                .rawRendererValue,
        ).eqls("a^{ }");
        expect(
            stateVariables[await resolvePathToNodeIdx("rv")].stateValues.value,
        ).eqls("a^{ }");

        // still have incomplete math

        await updateMathInputValue({
            latex: "a^{bc+}",
            componentIdx: await resolvePathToNodeIdx("mi"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues.value
                .tree,
        ).eqls(["^", "a", ["+", ["*", "b", "c"], "\uff3f"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues
                .immediateValue.tree,
        ).eqls(["^", "a", ["+", ["*", "b", "c"], "\uff3f"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues
                .rawRendererValue,
        ).eqls("a^{bc+}");
        expect(
            stateVariables[await resolvePathToNodeIdx("rv")].stateValues.value,
        ).eqls("a^{bc+}");

        // complete to valid math

        await updateMathInputValue({
            latex: "a^{bc+d}",
            componentIdx: await resolvePathToNodeIdx("mi"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues.value
                .tree,
        ).eqls(["^", "a", ["+", ["*", "b", "c"], "d"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues
                .immediateValue.tree,
        ).eqls(["^", "a", ["+", ["*", "b", "c"], "d"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues
                .rawRendererValue,
        ).eqls("a^{bc+d}");
        expect(
            stateVariables[await resolvePathToNodeIdx("rv")].stateValues.value,
        ).eqls("a^{bc+d}");

        // incomplete math again

        await updateMathInputValue({
            latex: "a^{bc+d}-",
            componentIdx: await resolvePathToNodeIdx("mi"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues.value
                .tree,
        ).eqls(["+", ["^", "a", ["+", ["*", "b", "c"], "d"]], ["-", "\uff3f"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues
                .immediateValue.tree,
        ).eqls(["+", ["^", "a", ["+", ["*", "b", "c"], "d"]], ["-", "\uff3f"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues
                .rawRendererValue,
        ).eqls("a^{bc+d}-");
        expect(
            stateVariables[await resolvePathToNodeIdx("rv")].stateValues.value,
        ).eqls("a^{bc+d}-");

        // complete to valid math again

        await updateMathInputValue({
            latex: "a^{bc+d}-e",
            componentIdx: await resolvePathToNodeIdx("mi"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues.value
                .tree,
        ).eqls(["+", ["^", "a", ["+", ["*", "b", "c"], "d"]], ["-", "e"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues
                .immediateValue.tree,
        ).eqls(["+", ["^", "a", ["+", ["*", "b", "c"], "d"]], ["-", "e"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues
                .rawRendererValue,
        ).eqls("a^{bc+d}-e");
        expect(
            stateVariables[await resolvePathToNodeIdx("rv")].stateValues.value,
        ).eqls("a^{bc+d}-e");
    });

    it("copy raw renderer value, handle invalid math", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <mathInput name="mi" />
  <text name="rv" extend="$mi.rawRendererValue" />
  `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues.value
                .tree,
        ).eqls("\uff3f");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues
                .immediateValue.tree,
        ).eqls("\uff3f");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues
                .rawRendererValue,
        ).eqls("");
        expect(
            stateVariables[await resolvePathToNodeIdx("rv")].stateValues.value,
        ).eqls("");

        // enter value that parses to math
        await updateMathInputValue({
            latex: "a",
            componentIdx: await resolvePathToNodeIdx("mi"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues.value
                .tree,
        ).eqls("a");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues
                .immediateValue.tree,
        ).eqls("a");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues
                .rawRendererValue,
        ).eqls("a");
        expect(
            stateVariables[await resolvePathToNodeIdx("rv")].stateValues.value,
        ).eqls("a");

        // enter value that is error in math

        await updateMathInputValue({
            latex: "a@",
            componentIdx: await resolvePathToNodeIdx("mi"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues.value
                .tree,
        ).eqls("\uff3f");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues
                .immediateValue.tree,
        ).eqls("\uff3f");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues
                .rawRendererValue,
        ).eqls("a@");
        expect(
            stateVariables[await resolvePathToNodeIdx("rv")].stateValues.value,
        ).eqls("a@");

        // still have error in math

        await updateMathInputValue({
            latex: "ab+@",
            componentIdx: await resolvePathToNodeIdx("mi"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues.value
                .tree,
        ).eqls("\uff3f");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues
                .immediateValue.tree,
        ).eqls("\uff3f");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues
                .rawRendererValue,
        ).eqls("ab+@");
        expect(
            stateVariables[await resolvePathToNodeIdx("rv")].stateValues.value,
        ).eqls("ab+@");

        // make valid math

        await updateMathInputValue({
            latex: "ab+c",
            componentIdx: await resolvePathToNodeIdx("mi"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues.value
                .tree,
        ).eqls(["+", ["*", "a", "b"], "c"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues
                .immediateValue.tree,
        ).eqls(["+", ["*", "a", "b"], "c"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues
                .rawRendererValue,
        ).eqls("ab+c");
        expect(
            stateVariables[await resolvePathToNodeIdx("rv")].stateValues.value,
        ).eqls("ab+c");
    });

    it("parse scientific notation", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <p><mathInput name="mi1" prefill="5E+1" /> <math name="m1" extend="$mi1" /></p>
  <p><mathInput name="mi2" prefill="5E+1" parseScientificNotation /> <math name="m2" extend="$mi2" /></p>

  `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("mi1")].stateValues
                    .rawRendererValue,
            ),
        ).eq("5E+1");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1")].stateValues.value
                .tree,
        ).eqls(["+", ["*", 5, "E"], 1]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m1")].stateValues.value
                .tree,
        ).eqls(["+", ["*", 5, "E"], 1]);
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("mi1")].stateValues
                    .rawRendererValue,
            ),
        ).eq("5E+1");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi2")].stateValues.value
                .tree,
        ).eqls(50);
        expect(
            stateVariables[await resolvePathToNodeIdx("m2")].stateValues.value
                .tree,
        ).eqls(50);

        await updateMathInputValue({
            latex: "2x-3E+2",
            componentIdx: await resolvePathToNodeIdx("mi1"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("mi1")].stateValues
                    .rawRendererValue,
            ),
        ).eq("2x-3E+2");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1")].stateValues.value
                .tree,
        ).eqls(["+", ["*", 2, "x"], ["-", ["*", 3, "E"]], 2]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m1")].stateValues.value
                .tree,
        ).eqls(["+", ["*", 2, "x"], ["-", ["*", 3, "E"]], 2]);

        await updateMathInputValue({
            latex: "2x-3E+2",
            componentIdx: await resolvePathToNodeIdx("mi2"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("mi2")].stateValues
                    .rawRendererValue,
            ),
        ).eq("2x-3E+2");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi2")].stateValues.value
                .tree,
        ).eqls(["+", ["*", 2, "x"], -300]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m2")].stateValues.value
                .tree,
        ).eqls(["+", ["*", 2, "x"], -300]);
    });

    it("remove strings", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <mathInput name="mi1" removeStrings="," />
    <mathInput name="mi2" removeStrings="$ %" />
    <mathInput name="mi3" removeStrings=", $ % dx" />
  `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("mi1")].stateValues.value
                .tree,
        ).eqls("\uff3f");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi2")].stateValues.value
                .tree,
        ).eqls("\uff3f");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi3")].stateValues.value
                .tree,
        ).eqls("\uff3f");

        await updateMathInputValue({
            latex: "12,345",
            componentIdx: await resolvePathToNodeIdx("mi1"),
            core,
        });
        await updateMathInputValue({
            latex: "12,345",
            componentIdx: await resolvePathToNodeIdx("mi2"),
            core,
        });
        await updateMathInputValue({
            latex: "12,345",
            componentIdx: await resolvePathToNodeIdx("mi3"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("mi1")].stateValues.value
                .tree,
        ).eq(12345);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi2")].stateValues.value
                .tree,
        ).eqls(["list", 12, 345]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi3")].stateValues.value
                .tree,
        ).eq(12345);

        await updateMathInputValue({
            latex: "\\$45.23",
            componentIdx: await resolvePathToNodeIdx("mi1"),
            core,
        });
        await updateMathInputValue({
            latex: "\\$45.23",
            componentIdx: await resolvePathToNodeIdx("mi2"),
            core,
        });
        await updateMathInputValue({
            latex: "\\$45.23",
            componentIdx: await resolvePathToNodeIdx("mi3"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("mi1")].stateValues.value
                .tree,
        ).eqls(["unit", "$", 45.23]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi2")].stateValues.value
                .tree,
        ).eq(45.23);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi3")].stateValues.value
                .tree,
        ).eq(45.23);

        await updateMathInputValue({
            latex: "78\\%",
            componentIdx: await resolvePathToNodeIdx("mi1"),
            core,
        });
        await updateMathInputValue({
            latex: "78\\%",
            componentIdx: await resolvePathToNodeIdx("mi2"),
            core,
        });
        await updateMathInputValue({
            latex: "78\\%",
            componentIdx: await resolvePathToNodeIdx("mi3"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("mi1")].stateValues.value
                .tree,
        ).eqls(["unit", 78, "%"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi2")].stateValues.value
                .tree,
        ).eq(78);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi3")].stateValues.value
                .tree,
        ).eq(78);

        await updateMathInputValue({
            latex: "\\$34,000\\%dx",
            componentIdx: await resolvePathToNodeIdx("mi1"),
            core,
        });
        await updateMathInputValue({
            latex: "\\$34,000\\%dx",
            componentIdx: await resolvePathToNodeIdx("mi2"),
            core,
        });
        await updateMathInputValue({
            latex: "\\$34,000\\%dx",
            componentIdx: await resolvePathToNodeIdx("mi3"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("mi1")].stateValues.value
                .tree,
        ).eqls(["unit", "$", ["*", ["unit", 34000, "%"], "d", "x"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi2")].stateValues.value
                .tree,
        ).eqls(["list", 34, ["*", 0, "d", "x"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi3")].stateValues.value
                .tree,
        ).eq(34000);
    });

    it("mathInput updates not messed up with invalid child logic containing a composite", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
      <ol>
        <math name="m">x</math> $m
        <li><mathInput name="mi" /> <math name="m2" extend="$mi" /></li>
      </ol>
  `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("m")].stateValues.value
                .tree,
        ).eqls("x");

        await updateMathInputValue({
            latex: "\\sqrt{4}",
            componentIdx: await resolvePathToNodeIdx("mi"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues.value
                .tree,
        ).eqls(["apply", "sqrt", 4]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m2")].stateValues.value
                .tree,
        ).eqls(["apply", "sqrt", 4]);
    });

    it("valueChanged", async () => {
        let doenetML = `
    <p><mathInput name="mi1" /> <math extend="$mi1" name="mi1a" /> <boolean extend="$mi1.valueChanged" name="mi1changed" /> <math extend="$mi1.immediateValue" name="mi1iva" /> <boolean extend="$mi1.immediateValueChanged" name="mi1ivchanged" /></p>
    <p><mathInput name="mi2" prefill="x" /> <math extend="$mi2" name="mi2a" /> <boolean extend="$mi2.valueChanged" name="mi2changed" /> <math extend="$mi2.immediateValue" name="mi2iva" /> <boolean extend="$mi2.immediateValueChanged" name="mi2ivchanged" /></p>
    <p><mathInput name="mi3" bindValueTo="$mi1" /> <math extend="$mi3" name="mi3a" /> <boolean extend="$mi3.valueChanged" name="mi3changed" /> <math extend="$mi3.immediateValue" name="mi3iva" /> <boolean extend="$mi3.immediateValueChanged" name="mi3ivchanged" /></p>
    <p><mathInput name="mi4">$mi2.immediateValue</mathInput> <math extend="$mi4" name="mi4a" /> <boolean extend="$mi4.valueChanged" name="mi4changed" /> <math extend="$mi4.immediateValue" name="mi4iva" /> <boolean extend="$mi4.immediateValueChanged" name="mi4ivchanged" /></p>

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
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(
                stateVariables[await resolvePathToNodeIdx("mi1")].stateValues
                    .value.tree,
            ).eq(mi1);
            expect(
                stateVariables[await resolvePathToNodeIdx("mi2")].stateValues
                    .value.tree,
            ).eq(mi2);
            expect(
                stateVariables[await resolvePathToNodeIdx("mi3")].stateValues
                    .value.tree,
            ).eq(mi3);
            expect(
                stateVariables[await resolvePathToNodeIdx("mi4")].stateValues
                    .value.tree,
            ).eq(mi4);

            expect(
                stateVariables[await resolvePathToNodeIdx("mi1a")].stateValues
                    .value.tree,
            ).eq(mi1);
            expect(
                stateVariables[await resolvePathToNodeIdx("mi2a")].stateValues
                    .value.tree,
            ).eq(mi2);
            expect(
                stateVariables[await resolvePathToNodeIdx("mi3a")].stateValues
                    .value.tree,
            ).eq(mi3);
            expect(
                stateVariables[await resolvePathToNodeIdx("mi4a")].stateValues
                    .value.tree,
            ).eq(mi4);

            expect(
                stateVariables[await resolvePathToNodeIdx("mi1iva")].stateValues
                    .value.tree,
            ).eq(mi1iv);
            expect(
                stateVariables[await resolvePathToNodeIdx("mi2iva")].stateValues
                    .value.tree,
            ).eq(mi2iv);
            expect(
                stateVariables[await resolvePathToNodeIdx("mi3iva")].stateValues
                    .value.tree,
            ).eq(mi3iv);
            expect(
                stateVariables[await resolvePathToNodeIdx("mi4iva")].stateValues
                    .value.tree,
            ).eq(mi4iv);

            expect(
                stateVariables[await resolvePathToNodeIdx("mi1changed")]
                    .stateValues.value,
            ).eq(mi1changed);
            expect(
                stateVariables[await resolvePathToNodeIdx("mi2changed")]
                    .stateValues.value,
            ).eq(mi2changed);
            expect(
                stateVariables[await resolvePathToNodeIdx("mi3changed")]
                    .stateValues.value,
            ).eq(mi3changed);
            expect(
                stateVariables[await resolvePathToNodeIdx("mi4changed")]
                    .stateValues.value,
            ).eq(mi4changed);

            expect(
                stateVariables[await resolvePathToNodeIdx("mi1ivchanged")]
                    .stateValues.value,
            ).eq(mi1ivchanged);
            expect(
                stateVariables[await resolvePathToNodeIdx("mi2ivchanged")]
                    .stateValues.value,
            ).eq(mi2ivchanged);
            expect(
                stateVariables[await resolvePathToNodeIdx("mi3ivchanged")]
                    .stateValues.value,
            ).eq(mi3ivchanged);
            expect(
                stateVariables[await resolvePathToNodeIdx("mi4ivchanged")]
                    .stateValues.value,
            ).eq(mi4ivchanged);
        }

        let { core, resolvePathToNodeIdx } = await createTestCore({
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
            componentIdx: await resolvePathToNodeIdx("mi1"),
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
            componentIdx: await resolvePathToNodeIdx("mi1"),
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
            componentIdx: await resolvePathToNodeIdx("mi2"),
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
            componentIdx: await resolvePathToNodeIdx("mi2"),
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
            componentIdx: await resolvePathToNodeIdx("mi3"),
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
            componentIdx: await resolvePathToNodeIdx("mi3"),
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
            componentIdx: await resolvePathToNodeIdx("mi4"),
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
            componentIdx: await resolvePathToNodeIdx("mi4"),
            core,
        });

        await check_items(
            [mi1, mi2, mi3, mi4],
            [mi1iv, mi2iv, mi3iv, mi4iv],
            [mi1changed, mi2changed, mi3changed, mi4changed],
            [mi1ivchanged, mi2ivchanged, mi3ivchanged, mi4ivchanged],
        );

        // reload

        ({ core, resolvePathToNodeIdx } = await createTestCore({
            doenetML,
        }));

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
            componentIdx: await resolvePathToNodeIdx("mi3"),
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
            componentIdx: await resolvePathToNodeIdx("mi3"),
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
            componentIdx: await resolvePathToNodeIdx("mi4"),
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
            componentIdx: await resolvePathToNodeIdx("mi4"),
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
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p><mathInput name="mi1" ><label>Type something</label></mathInput></p>
    <p><mathInput name="mi2"><label>Hello <math>a/b</math></label></mathInput></p>

     `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1")].stateValues.label,
        ).eq("Type something");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi2")].stateValues.label,
        ).eq("Hello \\(\\frac{a}{b}\\)");
    });

    it("bound to fixed math", async () => {
        // Verify that fixed bug
        // where deleting the mathInput contents wasn't restored on enter
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <math name="m" fixed>1</math>
    <p><mathInput name="mi1">$m</mathInput>
    <math name="mi1v" extend="$mi1.value" />,
    <math name="mi1iv" extend="$mi1.immediateValue" />,
    <text name="mi1rv" extend="$mi1.rawRendererValue" /></p>
    <p><mathInput name="mi2" bindValueTo="$m" />
    <math name="mi2v" extend="$mi2.value" />,
    <math name="mi2iv" extend="$mi2.immediateValue" />,
    <text name="mi2rv" extend="$mi2.rawRendererValue" /></p>
     `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("m")].stateValues.value
                .tree,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1")].stateValues.value
                .tree,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1")].stateValues
                .immediateValue.tree,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1v")].stateValues.value
                .tree,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1iv")].stateValues
                .value.tree,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1rv")].stateValues
                .value,
        ).eq("1");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi2")].stateValues.value
                .tree,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi2")].stateValues
                .immediateValue.tree,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi2v")].stateValues.value
                .tree,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi2iv")].stateValues
                .value.tree,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi2rv")].stateValues
                .value,
        ).eq("1");

        // Delete contents from mathInput 1
        await updateMathInputImmediateValue({
            latex: "",
            componentIdx: await resolvePathToNodeIdx("mi1"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("m")].stateValues.value
                .tree,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1")].stateValues.value
                .tree,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1")].stateValues
                .immediateValue.tree,
        ).eq("\uff3f");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1v")].stateValues.value
                .tree,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1iv")].stateValues
                .value.tree,
        ).eq("\uff3f");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1rv")].stateValues
                .value,
        ).eq("");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi2")].stateValues.value
                .tree,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi2")].stateValues
                .immediateValue.tree,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi2v")].stateValues.value
                .tree,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi2iv")].stateValues
                .value.tree,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi2rv")].stateValues
                .value,
        ).eq("1");

        // Contents of mathInput 1 restored on enter

        await updateMathInputValueToImmediateValue({
            componentIdx: await resolvePathToNodeIdx("mi1"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("m")].stateValues.value
                .tree,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1")].stateValues.value
                .tree,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1")].stateValues
                .immediateValue.tree,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1v")].stateValues.value
                .tree,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1iv")].stateValues
                .value.tree,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1rv")].stateValues
                .value,
        ).eq("1");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi2")].stateValues.value
                .tree,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi2")].stateValues
                .immediateValue.tree,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi2v")].stateValues.value
                .tree,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi2iv")].stateValues
                .value.tree,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi2rv")].stateValues
                .value,
        ).eq("1");

        // Add contents to mathInput 1

        await updateMathInputImmediateValue({
            latex: "12",
            componentIdx: await resolvePathToNodeIdx("mi1"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("m")].stateValues.value
                .tree,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1")].stateValues.value
                .tree,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1")].stateValues
                .immediateValue.tree,
        ).eq(12);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1v")].stateValues.value
                .tree,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1iv")].stateValues
                .value.tree,
        ).eq(12);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1rv")].stateValues
                .value,
        ).eq("12");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi2")].stateValues.value
                .tree,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi2")].stateValues
                .immediateValue.tree,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi2v")].stateValues.value
                .tree,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi2iv")].stateValues
                .value.tree,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi2rv")].stateValues
                .value,
        ).eq("1");

        // Contents of mathInput 1 restored on enter

        await updateMathInputValueToImmediateValue({
            componentIdx: await resolvePathToNodeIdx("mi1"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("m")].stateValues.value
                .tree,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1")].stateValues.value
                .tree,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1")].stateValues
                .immediateValue.tree,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1v")].stateValues.value
                .tree,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1iv")].stateValues
                .value.tree,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1rv")].stateValues
                .value,
        ).eq("1");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi2")].stateValues.value
                .tree,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi2")].stateValues
                .immediateValue.tree,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi2v")].stateValues.value
                .tree,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi2iv")].stateValues
                .value.tree,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi2rv")].stateValues
                .value,
        ).eq("1");

        // Delete contents from mathInput 2

        await updateMathInputImmediateValue({
            latex: "",
            componentIdx: await resolvePathToNodeIdx("mi2"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("m")].stateValues.value
                .tree,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1")].stateValues.value
                .tree,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1")].stateValues
                .immediateValue.tree,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1v")].stateValues.value
                .tree,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1iv")].stateValues
                .value.tree,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1rv")].stateValues
                .value,
        ).eq("1");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi2")].stateValues.value
                .tree,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi2")].stateValues
                .immediateValue.tree,
        ).eq("\uff3f");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi2v")].stateValues.value
                .tree,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi2iv")].stateValues
                .value.tree,
        ).eq("\uff3f");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi2rv")].stateValues
                .value,
        ).eq("");

        // Contents of mathInput 2 restored on enter

        await updateMathInputValueToImmediateValue({
            componentIdx: await resolvePathToNodeIdx("mi2"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("m")].stateValues.value
                .tree,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1")].stateValues.value
                .tree,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1")].stateValues
                .immediateValue.tree,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1v")].stateValues.value
                .tree,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1iv")].stateValues
                .value.tree,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1rv")].stateValues
                .value,
        ).eq("1");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi2")].stateValues.value
                .tree,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi2")].stateValues
                .immediateValue.tree,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi2v")].stateValues.value
                .tree,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi2iv")].stateValues
                .value.tree,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi2rv")].stateValues
                .value,
        ).eq("1");

        // Add contents to mathInput 2

        await updateMathInputImmediateValue({
            latex: "12",
            componentIdx: await resolvePathToNodeIdx("mi2"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("m")].stateValues.value
                .tree,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1")].stateValues.value
                .tree,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1")].stateValues
                .immediateValue.tree,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1v")].stateValues.value
                .tree,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1iv")].stateValues
                .value.tree,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1rv")].stateValues
                .value,
        ).eq("1");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi2")].stateValues.value
                .tree,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi2")].stateValues
                .immediateValue.tree,
        ).eq(12);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi2v")].stateValues.value
                .tree,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi2iv")].stateValues
                .value.tree,
        ).eq(12);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi2rv")].stateValues
                .value,
        ).eq("12");

        // Contents of mathInput 2 restored on enter

        await updateMathInputValueToImmediateValue({
            componentIdx: await resolvePathToNodeIdx("mi2"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("m")].stateValues.value
                .tree,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1")].stateValues.value
                .tree,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1")].stateValues
                .immediateValue.tree,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1v")].stateValues.value
                .tree,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1iv")].stateValues
                .value.tree,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi1rv")].stateValues
                .value,
        ).eq("1");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi2")].stateValues.value
                .tree,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi2")].stateValues
                .immediateValue.tree,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi2v")].stateValues.value
                .tree,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi2iv")].stateValues
                .value.tree,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi2rv")].stateValues
                .value,
        ).eq("1");
    });

    it("mathInputs specifying point", async () => {
        // two mathInputs specifying the x and y coordinate of a single point
        // demonstrates two-way data binding

        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <mathInput name="x" prefill="1"/>
    <mathInput name="y" prefill="2"/>
    <graph>
    <point name="P">($x,$y)</point>
    </graph>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("x")].stateValues.value
                .tree,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("y")].stateValues.value
                .tree,
        ).eq(2);
        expect(
            stateVariables[await resolvePathToNodeIdx("P")].stateValues.xs[0]
                .tree,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("P")].stateValues.xs[1]
                .tree,
        ).eq(2);

        // Enter -3 for x
        await updateMathInputValue({
            latex: "-3",
            componentIdx: await resolvePathToNodeIdx("x"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("x")].stateValues.value
                .tree,
        ).eq(-3);
        expect(
            stateVariables[await resolvePathToNodeIdx("y")].stateValues.value
                .tree,
        ).eq(2);
        expect(
            stateVariables[await resolvePathToNodeIdx("P")].stateValues.xs[0]
                .tree,
        ).eq(-3);
        expect(
            stateVariables[await resolvePathToNodeIdx("P")].stateValues.xs[1]
                .tree,
        ).eq(2);

        // Enter -4 for y
        await updateMathInputValue({
            latex: "-4",
            componentIdx: await resolvePathToNodeIdx("y"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("x")].stateValues.value
                .tree,
        ).eq(-3);
        expect(
            stateVariables[await resolvePathToNodeIdx("y")].stateValues.value
                .tree,
        ).eq(-4);
        expect(
            stateVariables[await resolvePathToNodeIdx("P")].stateValues.xs[0]
                .tree,
        ).eq(-3);
        expect(
            stateVariables[await resolvePathToNodeIdx("P")].stateValues.xs[1]
                .tree,
        ).eq(-4);

        // move point to (5,-6)
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P"),
            x: 5,
            y: -6,
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("x")].stateValues.value
                .tree,
        ).eq(5);
        expect(
            stateVariables[await resolvePathToNodeIdx("y")].stateValues.value
                .tree,
        ).eq(-6);
        expect(
            stateVariables[await resolvePathToNodeIdx("P")].stateValues.xs[0]
                .tree,
        ).eq(5);
        expect(
            stateVariables[await resolvePathToNodeIdx("P")].stateValues.xs[1]
                .tree,
        ).eq(-6);
    });

    it("mathInput specifying point -- non-invertible x", async () => {
        // x-coordinate is the square of the first mathInput
        // therefore, cannot invert from x-coordinate to mathInput
        // so that cannot change x-coordinate directly by dragging point

        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <mathInput name="x" prefill="3"/>
    <mathInput name="y" prefill="2"/>
    <graph>
    <point name="P">($x^2,$y)</point>
    </graph>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("x")].stateValues.value
                .tree,
        ).eq(3);
        expect(
            stateVariables[await resolvePathToNodeIdx("y")].stateValues.value
                .tree,
        ).eq(2);
        expect(
            stateVariables[await resolvePathToNodeIdx("P")].stateValues.xs[0]
                .tree,
        ).eq(9);
        expect(
            stateVariables[await resolvePathToNodeIdx("P")].stateValues.xs[1]
                .tree,
        ).eq(2);

        // Enter -1.2 for x
        await updateMathInputValue({
            latex: "-1.2",
            componentIdx: await resolvePathToNodeIdx("x"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("x")].stateValues.value
                .tree,
        ).eq(-1.2);
        expect(
            stateVariables[await resolvePathToNodeIdx("y")].stateValues.value
                .tree,
        ).eq(2);
        expect(
            stateVariables[await resolvePathToNodeIdx("P")].stateValues.xs[0]
                .tree,
        ).eq(1.44);
        expect(
            stateVariables[await resolvePathToNodeIdx("P")].stateValues.xs[1]
                .tree,
        ).eq(2);

        // try to move point to (5,6), only y changes
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P"),
            x: 5,
            y: 6,
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("x")].stateValues.value
                .tree,
        ).eq(-1.2);
        expect(
            stateVariables[await resolvePathToNodeIdx("y")].stateValues.value
                .tree,
        ).eq(6);
        expect(
            stateVariables[await resolvePathToNodeIdx("P")].stateValues.xs[0]
                .tree,
        ).eq(1.44);
        expect(
            stateVariables[await resolvePathToNodeIdx("P")].stateValues.xs[1]
                .tree,
        ).eq(6);
    });

    it("mathInput specifying point -- product", async () => {
        // x-coordinate of a point is product of mathInputs
        // Since cannot determine both factors from the product
        // the transformation is non-invertible
        // and cannot directly change the x-coordinate of point by dragging

        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <mathInput name="a" prefill="-3"/>
    <mathInput name="b" prefill="2"/>
    <graph>
        <point name="P">($a$b, -7)</point>
    </graph>
   `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("a")].stateValues.value
                .tree,
        ).eq(-3);
        expect(
            stateVariables[await resolvePathToNodeIdx("b")].stateValues.value
                .tree,
        ).eq(2);
        expect(
            stateVariables[await resolvePathToNodeIdx("P")].stateValues.xs[0]
                .tree,
        ).eq(-6);
        expect(
            stateVariables[await resolvePathToNodeIdx("P")].stateValues.xs[1]
                .tree,
        ).eq(-7);

        // Enter -1.5 for a
        await updateMathInputValue({
            latex: "-1.5",
            componentIdx: await resolvePathToNodeIdx("a"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("a")].stateValues.value
                .tree,
        ).eq(-1.5);
        expect(
            stateVariables[await resolvePathToNodeIdx("b")].stateValues.value
                .tree,
        ).eq(2);
        expect(
            stateVariables[await resolvePathToNodeIdx("P")].stateValues.xs[0]
                .tree,
        ).eq(-3);
        expect(
            stateVariables[await resolvePathToNodeIdx("P")].stateValues.xs[1]
                .tree,
        ).eq(-7);

        // try to move point to (5,6), only y changes
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P"),
            x: 5,
            y: 6,
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("a")].stateValues.value
                .tree,
        ).eq(-1.5);
        expect(
            stateVariables[await resolvePathToNodeIdx("b")].stateValues.value
                .tree,
        ).eq(2);
        expect(
            stateVariables[await resolvePathToNodeIdx("P")].stateValues.xs[0]
                .tree,
        ).eq(-3);
        expect(
            stateVariables[await resolvePathToNodeIdx("P")].stateValues.xs[1]
                .tree,
        ).eq(6);
    });

    it("mathInput specifying point -- product, make invertible", async () => {
        // x-coordinate of a point is product of mathInputs
        // Since one factor is marked with modifyIndirectly=false,
        // we leave that factor constant when changing the x-coordinate by dragging
        // and modify the other factor to match the new x-coordinate

        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <mathInput name="a" prefill="-3"/>
    <mathInput name="b" prefill="2"/>
    <graph>
    <point name="P">($a<math extend="$b" modifyIndirectly="false" />, -7)</point>
    </graph>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("a")].stateValues.value
                .tree,
        ).eq(-3);
        expect(
            stateVariables[await resolvePathToNodeIdx("b")].stateValues.value
                .tree,
        ).eq(2);
        expect(
            stateVariables[await resolvePathToNodeIdx("P")].stateValues.xs[0]
                .tree,
        ).eq(-6);
        expect(
            stateVariables[await resolvePathToNodeIdx("P")].stateValues.xs[1]
                .tree,
        ).eq(-7);

        // Enter -1.5 for a
        await updateMathInputValue({
            latex: "-1.5",
            componentIdx: await resolvePathToNodeIdx("a"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("a")].stateValues.value
                .tree,
        ).eq(-1.5);
        expect(
            stateVariables[await resolvePathToNodeIdx("b")].stateValues.value
                .tree,
        ).eq(2);
        expect(
            stateVariables[await resolvePathToNodeIdx("P")].stateValues.xs[0]
                .tree,
        ).eq(-3);
        expect(
            stateVariables[await resolvePathToNodeIdx("P")].stateValues.xs[1]
                .tree,
        ).eq(-7);

        // try to move point to (5,6)
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P"),
            x: 5,
            y: 6,
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("a")].stateValues.value
                .tree,
        ).eqls(["/", 5, 2]);
        expect(
            stateVariables[await resolvePathToNodeIdx("b")].stateValues.value
                .tree,
        ).eq(2);
        expect(
            stateVariables[await resolvePathToNodeIdx("P")].stateValues.xs[0]
                .tree,
        ).eq(5);
        expect(
            stateVariables[await resolvePathToNodeIdx("P")].stateValues.xs[1]
                .tree,
        ).eq(6);
    });

    it("vector and matrix components", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
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
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
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

            expect(
                stateVariables[await resolvePathToNodeIdx("p1")].stateValues
                    .text,
            ).eq(`Number of dimensions: ${numDimensions}`);
            expect(
                stateVariables[await resolvePathToNodeIdx("mi")].stateValues
                    .numDimensions,
            ).eq(numDimensions);

            expect(
                stateVariables[await resolvePathToNodeIdx("p2")].stateValues
                    .text,
            ).eq(`x: ${x1}`);
            expect(
                stateVariables[await resolvePathToNodeIdx("p5")].stateValues
                    .text,
            ).eq(`x1: ${x1}`);
            expect(
                stateVariables[await resolvePathToNodeIdx("mi")].stateValues.x1
                    .tree,
            ).eqls(x1.tree);

            if (x2) {
                expect(
                    stateVariables[await resolvePathToNodeIdx("p3")].stateValues
                        .text,
                ).eq(`y: ${x2}`);
                expect(
                    stateVariables[await resolvePathToNodeIdx("p6")].stateValues
                        .text,
                ).eq(`x2: ${x2}`);
                expect(
                    stateVariables[await resolvePathToNodeIdx("mi")].stateValues
                        .x2.tree,
                ).eqls(x2.tree);
            } else {
                expect(
                    stateVariables[await resolvePathToNodeIdx("p3")].stateValues
                        .text,
                ).eq(`y: `);
                expect(
                    stateVariables[await resolvePathToNodeIdx("p6")].stateValues
                        .text,
                ).eq(`x2: `);
                expect(
                    stateVariables[await resolvePathToNodeIdx("mi")].stateValues
                        .x2,
                ).eq(undefined);
            }

            if (x3) {
                expect(
                    stateVariables[await resolvePathToNodeIdx("p4")].stateValues
                        .text,
                ).eq(`z: ${x3}`);
                expect(
                    stateVariables[await resolvePathToNodeIdx("p7")].stateValues
                        .text,
                ).eq(`x3: ${x3}`);
                expect(
                    stateVariables[await resolvePathToNodeIdx("mi")].stateValues
                        .x3.tree,
                ).eqls(x3.tree);
            } else {
                expect(
                    stateVariables[await resolvePathToNodeIdx("p4")].stateValues
                        .text,
                ).eq(`z: `);
                expect(
                    stateVariables[await resolvePathToNodeIdx("p7")].stateValues
                        .text,
                ).eq(`x3: `);
                expect(
                    stateVariables[await resolvePathToNodeIdx("mi")].stateValues
                        .x3,
                ).eq(undefined);
            }

            if (x4) {
                expect(
                    stateVariables[await resolvePathToNodeIdx("p8")].stateValues
                        .text,
                ).eq(`x4: ${x4}`);
                expect(
                    stateVariables[await resolvePathToNodeIdx("mi")].stateValues
                        .x4.tree,
                ).eqls(x4.tree);
            } else {
                expect(
                    stateVariables[await resolvePathToNodeIdx("p8")].stateValues
                        .text,
                ).eq(`x4: `);
                expect(
                    stateVariables[await resolvePathToNodeIdx("mi")].stateValues
                        .x4,
                ).eq(undefined);
            }

            expect(
                stateVariables[await resolvePathToNodeIdx("p9")].stateValues
                    .text,
            ).eq(`v: ${asVec}`);
            if (numDimensions === 1) {
                expect(
                    stateVariables[
                        await resolvePathToNodeIdx("mi")
                    ].stateValues.vector.map((v) => v.tree),
                ).eqls([math.tree]);
            } else {
                expect(
                    stateVariables[
                        await resolvePathToNodeIdx("mi")
                    ].stateValues.vector.map((v) => v.tree),
                ).eqls(math.tree.slice(1));
            }

            if (i === 1) {
                expect(
                    stateVariables[await resolvePathToNodeIdx("p10")]
                        .stateValues.text,
                ).eq(`v[${i}]: ${x1}`);
            } else if (i <= numDimensions) {
                expect(
                    stateVariables[await resolvePathToNodeIdx("p10")]
                        .stateValues.text,
                ).eq(`v[${i}]: ${math.get_component(i - 1)}`);
            } else {
                expect(
                    stateVariables[await resolvePathToNodeIdx("p10")]
                        .stateValues.text,
                ).eq(`v[${i}]: `);
            }

            expect(
                stateVariables[await resolvePathToNodeIdx("p11")].stateValues
                    .text,
            ).eq(`Matrix size: ${numDimensions}, 1`);
            expect(
                stateVariables[await resolvePathToNodeIdx("mi")].stateValues
                    .matrixSize,
            ).eqls([numDimensions, 1]);
            expect(
                stateVariables[await resolvePathToNodeIdx("p12")].stateValues
                    .text,
            ).eq(`Number of rows: ${numDimensions}`);
            expect(
                stateVariables[await resolvePathToNodeIdx("mi")].stateValues
                    .numRows,
            ).eq(numDimensions);
            expect(
                stateVariables[await resolvePathToNodeIdx("p13")].stateValues
                    .text,
            ).eq(`Number of columns: 1`);
            expect(
                stateVariables[await resolvePathToNodeIdx("mi")].stateValues
                    .numColumns,
            ).eq(1);
            if (numDimensions === 1) {
                expect(
                    stateVariables[await resolvePathToNodeIdx("p14")]
                        .stateValues.text,
                ).eq(`Matrix: [ [ ${math} ] ]`);
                expect(
                    stateVariables[
                        await resolvePathToNodeIdx("mi")
                    ].stateValues.matrix.map((v) => v.map((x) => x.tree)),
                ).eqls([[math.tree]]);
            } else {
                expect(
                    stateVariables[await resolvePathToNodeIdx("p14")]
                        .stateValues.text,
                ).eq(
                    `Matrix: [ ${[...Array(numDimensions).keys()].map((i) => `[ ${math.get_component(i)} ]`).join(", ")} ]`,
                );
                expect(
                    stateVariables[
                        await resolvePathToNodeIdx("mi")
                    ].stateValues.matrix.map((v) => v.map((x) => x.tree)),
                ).eqls(math.tree.slice(1).map((v) => [v]));
            }

            if (i === 1) {
                expect(
                    stateVariables[await resolvePathToNodeIdx("p15")]
                        .stateValues.text,
                ).eq(`Matrix[${i}]: [ [ ${x1} ] ]`);
            } else if (i <= numDimensions) {
                expect(
                    stateVariables[await resolvePathToNodeIdx("p15")]
                        .stateValues.text,
                ).eq(`Matrix[${i}]: [ [ ${math.get_component(i - 1)} ] ]`);
            } else {
                expect(
                    stateVariables[await resolvePathToNodeIdx("p15")]
                        .stateValues.text,
                ).eq(`Matrix[${i}]: `);
            }

            if (i === 1) {
                expect(
                    stateVariables[await resolvePathToNodeIdx("p16")]
                        .stateValues.text,
                ).eq(`Matrix[${i}][1]: ${x1}`);
            } else if (i <= numDimensions) {
                expect(
                    stateVariables[await resolvePathToNodeIdx("p16")]
                        .stateValues.text,
                ).eq(`Matrix[${i}][1]: ${math.get_component(i - 1)}`);
            } else {
                expect(
                    stateVariables[await resolvePathToNodeIdx("p16")]
                        .stateValues.text,
                ).eq(`Matrix[${i}][1]: `);
            }

            expect(
                stateVariables[await resolvePathToNodeIdx("p17")].stateValues
                    .text,
            ).eq(`Number of list items: ${numDimensions}`);

            expect(
                stateVariables[await resolvePathToNodeIdx("p18")].stateValues
                    .text,
            ).eq(`List: ${asList}`);
            if (numDimensions === 1) {
                expect(
                    stateVariables[
                        await resolvePathToNodeIdx("mi")
                    ].stateValues.list.map((v) => v.tree),
                ).eqls([math.tree]);
            } else {
                expect(
                    stateVariables[
                        await resolvePathToNodeIdx("mi")
                    ].stateValues.list.map((v) => v.tree),
                ).eqls(math.tree.slice(1));
            }

            expect(
                stateVariables[await resolvePathToNodeIdx("p19")].stateValues
                    .text,
            ).eq(`Math list from list: ${asList}`);
            if (numDimensions === 1) {
                expect(
                    stateVariables[
                        await resolvePathToNodeIdx("ml")
                    ].stateValues.maths.map((v) => v.tree),
                ).eqls([math.tree]);
            } else {
                expect(
                    stateVariables[
                        await resolvePathToNodeIdx("ml")
                    ].stateValues.maths.map((v) => v.tree),
                ).eqls(math.tree.slice(1));
            }

            if (numDimensions === 1) {
                let num = math.evaluate_to_constant();

                expect(
                    stateVariables[await resolvePathToNodeIdx("p20")]
                        .stateValues.text,
                ).eq(`Number list from list: ${num}`);
                expect(
                    stateVariables[await resolvePathToNodeIdx("nl")].stateValues
                        .numbers,
                ).eqls([num]);
            } else {
                let nums = math.tree
                    .slice(1)
                    .map((v) => me.fromAst(v).evaluate_to_constant());

                expect(
                    stateVariables[await resolvePathToNodeIdx("p20")]
                        .stateValues.text,
                ).eq(`Number list from list: ${nums.join(", ")}`);

                expect(
                    stateVariables[await resolvePathToNodeIdx("nl")].stateValues
                        .numbers,
                ).eqls(nums);
            }
        }

        let math = me.fromAst("\uff3f");
        let i = 1;
        await check_items(math, i);

        await updateMathInputValue({
            latex: "(1,2)",
            componentIdx: await resolvePathToNodeIdx("mi"),
            core,
        });
        math = me.fromAst(["vector", 1, 2]);
        await check_items(math, i);

        i = 2;
        await updateMathInputValue({
            latex: i.toString(),
            componentIdx: await resolvePathToNodeIdx("i"),
            core,
        });
        await check_items(math, i);

        i = 3;
        await updateMathInputValue({
            latex: i.toString(),
            componentIdx: await resolvePathToNodeIdx("i"),
            core,
        });
        await check_items(math, i);

        await updateMathInputValue({
            latex: "(a,b,c)",
            componentIdx: await resolvePathToNodeIdx("mi"),
            core,
        });
        math = me.fromAst(["vector", "a", "b", "c"]);
        await check_items(math, i);

        i = 4;
        await updateMathInputValue({
            latex: i.toString(),
            componentIdx: await resolvePathToNodeIdx("i"),
            core,
        });
        await check_items(math, i);

        i = 2;
        await updateMathInputValue({
            latex: i.toString(),
            componentIdx: await resolvePathToNodeIdx("i"),
            core,
        });
        await check_items(math, i);

        await updateMathInputValue({
            latex: "xyz",
            componentIdx: await resolvePathToNodeIdx("mi"),
            core,
        });
        math = me.fromAst(["*", "x", "y", "z"]);
        await check_items(math, i);

        i = 1;
        await updateMathInputValue({
            latex: i.toString(),
            componentIdx: await resolvePathToNodeIdx("i"),
            core,
        });
        await check_items(math, i);

        await updateMathInputValue({
            latex: "p,q",
            componentIdx: await resolvePathToNodeIdx("mi"),
            core,
        });
        math = me.fromAst(["list", "p", "q"]);
        await check_items(math, i);

        await updateMathInputValue({
            latex: "5,4,3",
            componentIdx: await resolvePathToNodeIdx("mi"),
            core,
        });
        math = me.fromAst(["list", 5, 4, 3]);
        await check_items(math, i);
    });

    it("warning if no short description or label", async () => {
        let { core } = await createTestCore({
            doenetML: `
                <mathInput />
                <mathInput><shortDescription>hello</shortDescription></mathInput>
                <mathInput><label>hello</label></mathInput>
            `,
        });

        let errorWarnings = core.core!.errorWarnings;

        expect(errorWarnings.errors.length).eq(0);
        expect(errorWarnings.warnings.length).eq(1);

        expect(errorWarnings.warnings[0].message).contain(
            `must have a short description or a label`,
        );
        expect(errorWarnings.warnings[0].position.start.line).eq(2);
        expect(errorWarnings.warnings[0].position.end.line).eq(2);
    });

    it("with description", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p><mathInput name="mi">
        <label>Hi</label>
        <description>
            <p>Hello!</p>
        </description>
    </mathInput></p>

     `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues
                .childIndicesToRender,
        ).eqls([1]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].activeChildren
                .length,
        ).eq(2);

        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].activeChildren[1]
                .componentType,
        ).eq("description");
    });

    it("remove repeated superscripts and subscripts", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <mathInput name="mi1" prefillLatex="x^{^{2}}"/>
    <mathInput name="mi2" prefillLatex="y_{_{3}}"/>

    <p name="pLatex1">$mi1.rawRendererValue</p>
    <p name="pLatex2">$mi2.rawRendererValue</p>
    <p name="pValue1"><math name="m1" extend="$mi1" /></p>
    <p name="pValue2"><math name="m2" extend="$mi2" /></p>
    <p name="pValueLatex1">$m1.latex</p>
    <p name="pValueLatex2">$m2.latex</p>
    
     `,
        });
        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("pLatex1")].stateValues
                .text,
        ).eq("x^{^{2}}");
        expect(
            stateVariables[await resolvePathToNodeIdx("pLatex2")].stateValues
                .text,
        ).eq("y_{_{3}}");
        expect(
            stateVariables[await resolvePathToNodeIdx("pValue1")].stateValues
                .text,
        ).eq("x²");
        expect(
            stateVariables[await resolvePathToNodeIdx("pValue2")].stateValues
                .text,
        ).eq("y₃");
        expect(
            stateVariables[await resolvePathToNodeIdx("pValueLatex1")]
                .stateValues.text,
        ).eq("x^{2}");
        expect(
            stateVariables[await resolvePathToNodeIdx("pValueLatex2")]
                .stateValues.text,
        ).eq("y_{3}");

        expect(
            stateVariables[await resolvePathToNodeIdx("mi1")].stateValues.value
                .tree,
        ).eqls(me.fromLatex("x^2").tree);
        expect(
            stateVariables[await resolvePathToNodeIdx("mi2")].stateValues.value
                .tree,
        ).eqls(me.fromLatex("y_3").tree);
    });
});
