import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import { updateMathInputValue } from "../utils/actions";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

describe("Integer tag tests", async () => {
    it("1.2+1.1", async () => {
        let { core, resolveComponentName } = await createTestCore({
            doenetML: `
      <integer extend="$int1" name="int2" />
      <integer name="int1">1.2+1.1</integer>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[resolveComponentName("int2")].stateValues.value,
        ).eq(2);
        expect(
            stateVariables[resolveComponentName("int1")].stateValues.value,
        ).eq(2);
    });

    it(`non-numeric value`, async () => {
        let { core, resolveComponentName } = await createTestCore({
            doenetML: `
      <integer extend="$int1" name="int2" />
      <integer name="int1">x+1</integer>
      `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[resolveComponentName("int2")].stateValues.value,
        ).eqls(NaN);
        expect(
            stateVariables[resolveComponentName("int1")].stateValues.value,
        ).eqls(NaN);
    });

    it(`entering non-integer values dynamically`, async () => {
        let { core, resolveComponentName } = await createTestCore({
            doenetML: `
      <integer name="n">$mi</integer>
      <mathInput name="mi" />
      `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[resolveComponentName("n")].stateValues.value,
        ).eqls(NaN);
        expect(
            stateVariables[resolveComponentName("mi")].stateValues
                .rawRendererValue,
        ).eq("");

        await updateMathInputValue({
            latex: "-6.5",
            componentIdx: resolveComponentName("mi"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables[resolveComponentName("n")].stateValues.value).eq(
            -6,
        );
        expect(
            stateVariables[resolveComponentName("mi")].stateValues
                .rawRendererValue,
        ).eq("-6.5");

        await updateMathInputValue({
            latex: "-6.5x",
            componentIdx: resolveComponentName("mi"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[resolveComponentName("n")].stateValues.value,
        ).eqls(NaN);
        expect(
            stateVariables[resolveComponentName("mi")].stateValues
                .rawRendererValue,
        ).eq("-6.5x");

        await updateMathInputValue({
            latex: "9.5",
            componentIdx: resolveComponentName("mi"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables[resolveComponentName("n")].stateValues.value).eq(
            10,
        );
        expect(
            stateVariables[resolveComponentName("mi")].stateValues
                .rawRendererValue,
        ).eq("9.5");
    });

    it(`entering non-integer through inverse`, async () => {
        let { core, resolveComponentName } = await createTestCore({
            doenetML: `
      <integer name="n">5</integer>
      <mathInput name="mi" bindValueTo="$n" hideNaN="false" />
      `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables[resolveComponentName("n")].stateValues.value).eq(
            5,
        );
        expect(
            stateVariables[resolveComponentName("mi")].stateValues
                .rawRendererValue,
        ).eq("5");

        await updateMathInputValue({
            latex: "-6.5",
            componentIdx: resolveComponentName("mi"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables[resolveComponentName("n")].stateValues.value).eq(
            -6,
        );
        expect(
            stateVariables[resolveComponentName("mi")].stateValues
                .rawRendererValue,
        ).eq("-6");

        await updateMathInputValue({
            latex: "-6.5x",
            componentIdx: resolveComponentName("mi"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[resolveComponentName("n")].stateValues.value,
        ).eqls(NaN);
        expect(
            stateVariables[resolveComponentName("mi")].stateValues
                .rawRendererValue,
        ).eq("NaN");

        // Note: change to 3 and then 31 to verify bug doesn't reappear
        await updateMathInputValue({
            latex: "3",
            componentIdx: resolveComponentName("mi"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables[resolveComponentName("n")].stateValues.value).eq(
            3,
        );
        expect(
            stateVariables[resolveComponentName("mi")].stateValues
                .rawRendererValue,
        ).eq("3");

        await updateMathInputValue({
            latex: "31",
            componentIdx: resolveComponentName("mi"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables[resolveComponentName("n")].stateValues.value).eq(
            31,
        );
        expect(
            stateVariables[resolveComponentName("mi")].stateValues
                .rawRendererValue,
        ).eq("31");

        await updateMathInputValue({
            latex: "31.5",
            componentIdx: resolveComponentName("mi"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables[resolveComponentName("n")].stateValues.value).eq(
            32,
        );
        expect(
            stateVariables[resolveComponentName("mi")].stateValues
                .rawRendererValue,
        ).eq("32");
    });
});
