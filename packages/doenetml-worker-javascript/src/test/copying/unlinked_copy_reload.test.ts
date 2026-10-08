import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import {
    movePoint,
    updateBooleanInputValue,
    updateMathInputValue,
    updateTextInputValue,
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
    <point name="P">(1,2)</point>
    <point copy="$P" name="cP" />
    <selectFromSequence name="s" from="1" to="100" />
    <number copy="$s" name="cs" />
    <p name="p"><math copy="$cP.x" name="cx" /></p>
    <p copy="$p" name="cp" />
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

    it("keeps values its source holds in primitive children or in essential state", async () => {
        // Dragging `<point>(1,2)</point>` or binding an input to
        // `<text>hi</text>` changes the source's string child, not its
        // essential state.
        const doenetML = `
    <graph><point name="P">(1,2)</point><point copy="$P" name="Q" />
        <point name="A" /><point copy="$A" name="B" /></graph>
    <text name="t">hi</text><textInput bindValueTo="$t" name="ti" />
    <text copy="$t" name="t2" />
    `;
        let { core, resolvePathToNodeIdx, scoreState } = await createTestCore({
            doenetML,
        });
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P"),
            x: 3,
            y: 4,
            core,
        });
        // a point with no children holds its coordinates in essential state
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("A"),
            x: 5,
            y: 6,
            core,
        });
        await updateTextInputValue({
            text: "yo",
            componentIdx: await resolvePathToNodeIdx("ti"),
            core,
        });
        await core.saveImmediately();
        ({ core, resolvePathToNodeIdx } = await createTestCore({
            doenetML,
            initialState: scoreState.state,
        }));
        const stateVariables = await core.returnAllStateVariables(false, true);
        const sv = async (name: string) =>
            stateVariables[await resolvePathToNodeIdx(name)].stateValues;
        expect((await sv("P")).xs.map((x: any) => x.tree)).eqls([3, 4]);
        expect((await sv("Q")).xs.map((x: any) => x.tree)).eqls([1, 2]);
        expect((await sv("A")).xs.map((x: any) => x.tree)).eqls([5, 6]);
        expect((await sv("B")).xs.map((x: any) => x.tree)).eqls([0, 0]);
        expect((await sv("t")).value).eq("yo");
        expect((await sv("t2")).value).eq("hi");
    });
});
