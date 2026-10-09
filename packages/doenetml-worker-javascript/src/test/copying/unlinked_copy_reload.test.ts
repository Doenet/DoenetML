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
    it("keeps its value and its children's values, and follows what its attributes reference", async () => {
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
        // `cm` has the `fixed="$bi"` written on `m`, which follows `bi`
        const changed = { ...initial, cmFixed: true };

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
        await check(changed);

        await core.saveImmediately();
        const savedState = scoreState.state;
        ({ core, resolvePathToNodeIdx } = await createTestCore({
            doenetML,
            initialState: savedState,
        }));
        await check(changed);

        // only the copies whose source changed are held (`c` and `cp`)
        const coreState = JSON.parse(savedState);
        const held = Object.keys(coreState.__copySnapshots ?? {});
        expect(held.length).eq(2);
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

    it("holds nothing once its only held copy is deleted", async () => {
        // switching the case deletes the copy in the case left
        const doenetML = `
    <booleanInput name="b" prefill="true" />
    <mathInput name="mi" prefill="1" />
    <conditionalContent>
        <case condition="$b"><math copy="$mi" name="c" /></case>
        <else><text>none</text></else>
    </conditionalContent>
    `;
        const { core, resolvePathToNodeIdx, scoreState } = await createTestCore(
            { doenetML },
        );
        await updateMathInputValue({
            latex: "5",
            componentIdx: await resolvePathToNodeIdx("mi"),
            core,
        });
        await core.saveImmediately();
        expect(
            Object.keys(JSON.parse(scoreState.state).__copySnapshots).length,
        ).eq(1);

        await updateBooleanInputValue({
            boolean: false,
            componentIdx: await resolvePathToNodeIdx("b"),
            core,
        });
        await core.saveImmediately();
        expect(JSON.parse(scoreState.state)).not.toHaveProperty(
            "__copySnapshots",
        );
    });

    it("keeps its value through a reload while its source is inactive", async () => {
        // On load the copy is made again from `cc.a`, inactive then: a copy
        // of its type still, with no value of its own (main shows a blank),
        // which takes the held snapshot.
        const doenetML = `
    <booleanInput name="b" prefill="true" />
    <conditionalContent name="cc" condition="$b">
        <mathInput name="a" prefill="1" />
    </conditionalContent>
    <math copy="$cc.a" name="c" />
    <mathInput name="other" />
    `;
        let { core, resolvePathToNodeIdx, scoreState } = await createTestCore({
            doenetML,
        });
        async function check(c: any, a: any) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            const sv = async (name: string) =>
                stateVariables[await resolvePathToNodeIdx(name)].stateValues;
            expect((await sv("c")).value.tree).eq(c);
            if (a !== undefined) {
                expect((await sv("cc.a")).value.tree).eq(a);
            }
        }
        async function reload() {
            await core.saveImmediately();
            const state = scoreState.state;
            ({ core, resolvePathToNodeIdx, scoreState } = await createTestCore({
                doenetML,
                initialState: state,
            }));
            return JSON.parse(state);
        }

        await updateMathInputValue({
            latex: "5",
            componentIdx: await resolvePathToNodeIdx("cc.a"),
            core,
        });
        await updateBooleanInputValue({
            boolean: false,
            componentIdx: await resolvePathToNodeIdx("b"),
            core,
        });
        await check(1, 5);

        let saved = await reload();
        expect(Object.keys(saved.__copySnapshots).length).eq(1);
        // `cc.a` is not made while `b` is false
        await check(1, undefined);

        // the source active again does not make the copy again
        await updateBooleanInputValue({
            boolean: true,
            componentIdx: await resolvePathToNodeIdx("b"),
            core,
        });
        await check(1, 5);
        saved = await reload();
        expect(Object.keys(saved.__copySnapshots).length).eq(1);
        await check(1, 5);
    });

    it("takes a held entry only for a component of its type", async () => {
        // A copy of a `<conditionalContent>` is made from whichever case is
        // active: made again on load with `b` false, its textInput has the
        // `stateId`s the mathInput had, and takes nothing held of the
        // mathInput (its prefill `1` would have shown in the textInput).
        const doenetML = `
    <booleanInput name="b" prefill="true" />
    <conditionalContent name="cc">
        <case condition="$b"><mathInput name="a" prefill="1" /></case>
        <else><textInput name="t" prefill="hi" /></else>
    </conditionalContent>
    <group copy="$cc" name="c" />
    `;
        let { core, resolvePathToNodeIdx, scoreState } = await createTestCore({
            doenetML,
        });
        async function sv(name: string) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            return stateVariables[await resolvePathToNodeIdx(name)];
        }
        async function reload() {
            await core.saveImmediately();
            const state = scoreState.state;
            ({ core, resolvePathToNodeIdx, scoreState } = await createTestCore({
                doenetML,
                initialState: state,
            }));
            return JSON.parse(state);
        }

        await updateMathInputValue({
            latex: "5",
            componentIdx: await resolvePathToNodeIdx("cc.a"),
            core,
        });
        await updateBooleanInputValue({
            boolean: false,
            componentIdx: await resolvePathToNodeIdx("b"),
            core,
        });
        expect((await sv("c.a")).stateValues.value.tree).eq(1);

        await reload();
        const t = await sv("c.t");
        expect(t.componentType).eq("textInput");
        expect(t.stateValues.value).eq("hi");
    });

    it("is made from its source as restored when made again with a different shape", async () => {
        // Made again on load with `b` false, the copy has no replacements
        // but itself. It keeps nothing of the mathInput it had, so it is not
        // held on later saves, and once `b` is true a reload makes it again
        // from its source as restored, as a copy was made before snapshots
        // were held.
        const doenetML = `
    <booleanInput name="b" prefill="true" />
    <conditionalContent name="cc" condition="$b">
        <mathInput name="a" prefill="1" />
    </conditionalContent>
    <group copy="$cc" name="c" />
    <mathInput name="other" />
    `;
        let { core, resolvePathToNodeIdx, scoreState } = await createTestCore({
            doenetML,
        });
        async function sv(name: string) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            return stateVariables[await resolvePathToNodeIdx(name)];
        }
        async function reload() {
            await core.saveImmediately();
            const state = scoreState.state;
            ({ core, resolvePathToNodeIdx, scoreState } = await createTestCore({
                doenetML,
                initialState: state,
            }));
            return JSON.parse(state);
        }

        await updateMathInputValue({
            latex: "5",
            componentIdx: await resolvePathToNodeIdx("cc.a"),
            core,
        });
        await updateBooleanInputValue({
            boolean: false,
            componentIdx: await resolvePathToNodeIdx("b"),
            core,
        });
        expect((await sv("c.a")).stateValues.value.tree).eq(1);

        const held = (await reload()).__copySnapshots;
        expect(Object.keys(held).length).eq(1);
        expect((await sv("c")).activeChildren).eqls([]);

        // later saves hold nothing of the copy
        await updateMathInputValue({
            latex: "2",
            componentIdx: await resolvePathToNodeIdx("other"),
            core,
        });
        expect((await reload()).__copySnapshots).eq(undefined);
        expect((await sv("c")).activeChildren).eqls([]);

        await updateBooleanInputValue({
            boolean: true,
            componentIdx: await resolvePathToNodeIdx("b"),
            core,
        });
        // the copy now shows nothing where one made now has a mathInput
        expect(Object.keys((await reload()).__copySnapshots)).eqls(
            Object.keys(held),
        );
        expect((await sv("cc.a")).stateValues.value.tree).eq(5);
        expect((await sv("c.a")).stateValues.value.tree).eq(5);

        await updateMathInputValue({
            latex: "3",
            componentIdx: await resolvePathToNodeIdx("other"),
            core,
        });
        expect((await reload()).__copySnapshots).eq(undefined);
        expect((await sv("c.a")).stateValues.value.tree).eq(5);
    });

    it("takes nothing held of another case's components", async () => {
        // The cases' wrappers differ in type and their mathInputs do not:
        // made again on load with `b` false, the copy's div has the
        // `stateId` its p had and takes nothing held. Made again with `b`
        // true, its mathInput has the `stateId` the div's had, but shows
        // its source as restored, not the div's mathInput's prefill `2`.
        const doenetML = `
    <booleanInput name="b" prefill="true" />
    <conditionalContent name="cc">
        <case condition="$b"><p><mathInput name="a" prefill="1" /></p></case>
        <else><div><mathInput name="t" prefill="2" /></div></else>
    </conditionalContent>
    <group copy="$cc" name="c" />
    `;
        let { core, resolvePathToNodeIdx, scoreState } = await createTestCore({
            doenetML,
        });
        async function sv(name: string) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            return stateVariables[await resolvePathToNodeIdx(name)];
        }
        async function reload() {
            await core.saveImmediately();
            const state = scoreState.state;
            ({ core, resolvePathToNodeIdx, scoreState } = await createTestCore({
                doenetML,
                initialState: state,
            }));
            return JSON.parse(state);
        }

        await updateMathInputValue({
            latex: "5",
            componentIdx: await resolvePathToNodeIdx("cc.a"),
            core,
        });
        await updateBooleanInputValue({
            boolean: false,
            componentIdx: await resolvePathToNodeIdx("b"),
            core,
        });
        expect((await sv("c.a")).stateValues.value.tree).eq(1);

        await reload();
        expect((await sv("c.t")).stateValues.value.tree).eq(2);

        await updateBooleanInputValue({
            boolean: true,
            componentIdx: await resolvePathToNodeIdx("b"),
            core,
        });
        await reload();
        const source = (await sv("cc.a")).stateValues.value.tree;
        const copy = (await sv("c.a")).stateValues.value.tree;
        expect(copy).not.eq(2);
        expect(copy).eq(source);
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

    it("keeps a value a reader wrote over a literal attribute of its source", async () => {
        // `hide="false"` is a literal attribute; a copy takes it with what a
        // reader wrote over it, so a copy made again after the reader
        // toggled `t` would be hidden
        const doenetML = `
    <text name="t" hide="false">a</text>
    <text copy="$t" name="c" />
    <p name="p"><text name="inner" hide="false">b</text></p>
    <p copy="$p" name="cp" />
    <booleanInput name="b1" bindValueTo="$t.hide" />
    <booleanInput name="b2" bindValueTo="$inner.hide" />
    `;
        let { core, resolvePathToNodeIdx, scoreState } = await createTestCore({
            doenetML,
        });
        async function hidden() {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            const sv = async (name: string) =>
                stateVariables[await resolvePathToNodeIdx(name)].stateValues;
            return [
                (await sv("t")).hidden,
                (await sv("c")).hidden,
                (await sv("inner")).hidden,
                (await sv("cp.inner")).hidden,
            ];
        }
        for (const name of ["b1", "b2"]) {
            await updateBooleanInputValue({
                boolean: true,
                componentIdx: await resolvePathToNodeIdx(name),
                core,
            });
        }
        expect(await hidden()).eqls([true, false, true, false]);

        await core.saveImmediately();
        ({ core, resolvePathToNodeIdx } = await createTestCore({
            doenetML,
            initialState: scoreState.state,
        }));
        expect(await hidden()).eqls([true, false, true, false]);
    });
});
