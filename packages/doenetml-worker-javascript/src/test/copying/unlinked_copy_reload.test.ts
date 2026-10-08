import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import {
    updateBooleanInputValue,
    updateMathInputValue,
} from "../utils/actions";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

/**
 * An unlinked copy (`copy=`) keeps what it made of its source, through a
 * reload as before one: a reload makes it again, and takes what a save held
 * of it when a copy made then would differ.
 */
describe("An unlinked copy through a reload @group4", () => {
    it("keeps its value, its fixed and its children's values", async () => {
        const doenetML = `
    <mathInput name="mi" prefill="1" />
    <math copy="$mi" name="c" />
    <booleanInput name="bi" />
    <math name="m" fixed="$bi">x</math>
    <math copy="$m" name="cm" />
    <p name="p"><mathInput name="inner" prefill="2" /></p>
    <p copy="$p" name="cp" />
    <mathInput name="other" prefill="7" />
    <math copy="$other" name="co" />
    `;
        let { core, resolvePathToNodeIdx, scoreState } = await createTestCore({
            doenetML,
        });
        async function check(expected: Record<string, any>) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            const sv = async (name: string) =>
                stateVariables[await resolvePathToNodeIdx(name)].stateValues;
            expect((await sv("c")).value.tree).eq(expected.c);
            expect((await sv("cm")).fixed).eq(expected.cmFixed);
            expect((await sv("cp.inner")).value.tree).eqls(expected.inner);
            expect((await sv("co")).value.tree).eq(7);
        }

        const initial = { c: 1, cmFixed: false, inner: 2 };
        await check(initial);

        await updateMathInputValue({
            latex: "5",
            componentIdx: await resolvePathToNodeIdx("mi"),
            core,
        });
        await updateBooleanInputValue({
            boolean: true,
            componentIdx: await resolvePathToNodeIdx("bi"),
            core,
        });
        await updateMathInputValue({
            latex: "9",
            componentIdx: await resolvePathToNodeIdx("p.inner"),
            core,
        });
        await check(initial);

        await core.saveImmediately();
        const savedState = scoreState.state;
        ({ core, resolvePathToNodeIdx } = await createTestCore({
            doenetML,
            initialState: savedState,
        }));
        await check(initial);

        // only the copies whose source changed are held
        const coreState = JSON.parse(savedState);
        const held = Object.keys(coreState.__copySnapshots ?? {});
        expect(held.length).eq(3);
    });

    it("holds nothing when no copy's source changed", async () => {
        const doenetML = `
    <mathInput name="mi" prefill="1" />
    <math copy="$mi" name="c" />
    <mathInput name="other" />
    `;
        const { core, resolvePathToNodeIdx, scoreState } = await createTestCore(
            { doenetML },
        );
        await updateMathInputValue({
            latex: "3",
            componentIdx: await resolvePathToNodeIdx("other"),
            core,
        });
        await core.saveImmediately();
        const coreState = JSON.parse(scoreState.state);
        expect(coreState.__copySnapshots).eq(undefined);
    });
});
