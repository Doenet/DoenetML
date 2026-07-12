import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import { updateValue } from "../utils/actions";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

/**
 * Tests for lazy state-variable materialization (issue #1459):
 * dependency structures are built on demand at the first resolution
 * attempt instead of eagerly at component construction.
 */
describe("Lazy state variable tests @group4", async () => {
    it("undemanded state variables have no dependency structures until first read", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <function name="f">sin(x)</function>
    <function name="g" maxima="(1,2) (4,3)" />
    `,
        });

        const fIdx = await resolvePathToNodeIdx("f");
        const gIdx = await resolvePathToNodeIdx("g");
        const components = core.core!.components!;
        const dependencies = core.core!.dependencies;

        // `formula` is demanded by the renderer, so its dependencies exist
        expect(dependencies.downstreamDependencies[fIdx].formula).toBeTypeOf(
            "object",
        );
        expect(components[fIdx].state.formula.isResolved).eq(true);

        // extrema were never demanded: no dependency slot, no blocker-ledger
        // entries, not resolved
        expect(dependencies.downstreamDependencies[fIdx].allMaxima).eq(
            undefined,
        );
        expect(components[fIdx].state.allMaxima.isResolved).eq(false);
        expect(
            JSON.stringify(
                dependencies.resolveBlockers.neededToResolve[fIdx] ?? {},
            ),
        ).not.contain("allMaxima");

        // first read materializes the dependencies and produces the correct
        // value
        expect(await components[gIdx].state.numMaxima.value).eq(2);
        expect(components[gIdx].state.numMaxima.isResolved).eq(true);
        expect(dependencies.downstreamDependencies[gIdx].numMaxima).toBeTypeOf(
            "object",
        );
    });

    it("inverse-setting a never-read variable of a never-rendered component works", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <setup><number name="n">5</number></setup>
    <updateValue name="uv" target="$n" newValue="8" />
    `,
        });

        const nIdx = await resolvePathToNodeIdx("n");

        await updateValue({
            componentIdx: await resolvePathToNodeIdx("uv"),
            core,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables[nIdx].stateValues.value).eq(8);
    });

    it("saved state restores into variables of a never-rendered component", async () => {
        const doenetML = `
    <setup><number name="n">5</number></setup>
    <updateValue name="uv" target="$n" newValue="8" />
    <p name="p">count: $n</p>
    `;

        let { core, resolvePathToNodeIdx, scoreState } = await createTestCore({
            doenetML,
        });

        await updateValue({
            componentIdx: await resolvePathToNodeIdx("uv"),
            core,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("p")].stateValues.text,
        ).eq("count: 8");

        // non-submission updates only schedule a debounced save, so flush
        // before grabbing the reported state
        await core.saveImmediately();
        const endingState = scoreState.state;

        // reload with saved state; the essential value must land on the
        // not-yet-resolved variable and be reflected at first read
        ({ core, resolvePathToNodeIdx } = await createTestCore({
            doenetML,
            initialState: endingState,
        }));

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("p")].stateValues.text,
        ).eq("count: 8");
        expect(
            stateVariables[await resolvePathToNodeIdx("n")].stateValues.value,
        ).eq(8);
    });
});
