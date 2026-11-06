import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import { getDiagnosticsByType } from "../utils/diagnostics";
import {
    movePoint,
    moveText,
    updateBooleanInputValue,
    updateMathInputValue,
    updateTextInputValue,
} from "../utils/actions";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

/**
 * A document, and the means to reload it from what a save holds: with
 * `legacy`, from a save that holds each copy's snapshot alone, as those made
 * before #2441 do.
 */
async function reloader(doenetML: string) {
    let { core, resolvePathToNodeIdx, scoreState } = await createTestCore({
        doenetML,
    });
    let diagnostics = getDiagnosticsByType(core);
    async function resolve(name: string) {
        return await resolvePathToNodeIdx(name);
    }
    /** The state of the named component, or `undefined` if it is not made. */
    async function sv(name: string) {
        const stateVariables = await core.returnAllStateVariables(false, true);
        let idx;
        try {
            idx = await resolvePathToNodeIdx(name);
        } catch {
            return undefined;
        }
        return stateVariables[idx];
    }
    async function setBoolean(name: string, boolean: boolean) {
        await updateBooleanInputValue({
            boolean,
            componentIdx: await resolvePathToNodeIdx(name),
            core,
        });
    }
    async function reload({ legacy = false } = {}) {
        await core.saveImmediately();
        const saved = JSON.parse(scoreState.state);
        if (legacy) {
            for (const [stateId, held] of Object.entries(
                saved.__copySnapshots ?? {},
            )) {
                saved.__copySnapshots[stateId] = Array.isArray(held)
                    ? held
                    : (held as any).snapshot;
            }
        }
        ({ core, resolvePathToNodeIdx, scoreState } = await createTestCore({
            doenetML,
            initialState: JSON.stringify(saved),
        }));
        diagnostics = getDiagnosticsByType(core);
        return saved;
    }
    /** The source named by each info that a type change shows nothing. */
    function typeChangeInfos() {
        return diagnostics.infos
            .filter((d: any) =>
                ["doenet-e0065", "doenet-i0053"].includes(d.code),
            )
            .map((d: any) => d.args?.source);
    }
    /**
     * The coordinates of each point shown, in document order, not counting
     * one inside another (a point made from a math holds a point).
     */
    async function pointsShown() {
        const stateVariables = await core.returnAllStateVariables(false, true);
        const points = (Object.values(stateVariables) as any[]).filter(
            (sv) => sv.componentType === "point",
        );
        const inner = new Set(
            points.flatMap((sv) =>
                sv.activeChildren.map((child: any) => child.componentIdx),
            ),
        );
        return points
            .filter((sv) => !inner.has(sv.componentIdx))
            .map((sv) => sv.stateValues.xs.map((x: any) => x.tree));
    }
    return {
        core: () => core,
        resolve,
        sv,
        setBoolean,
        reload,
        typeChangeInfos,
        pointsShown,
    };
}

/**
 * An unlinked copy (`copy=`) keeps what it made of its source, through a
 * reload as before one: a reload makes it again, and takes what a save held
 * of it when a copy made then would differ.
 */
describe("An unlinked copy through a reload @group4", () => {
    it("keeps its value and its children's values, and follows what its attributes reference", async () => {
        const doenetML = `
    <mathInput name="mi" prefill="1" />
    <math copyWithState="$mi" name="c" />
    <booleanInput name="bi" />
    <math name="m" fixed="$bi">x</math>
    <math copyWithState="$m" name="cm" />
    <p name="p"><mathInput name="inner" prefill="2" /></p>
    <p copyWithState="$p" name="cp" />
    <mathInput name="other" prefill="7" />
    <math copyWithState="$other" name="co" />
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
    <math copyWithState="$mi" name="c" />
    <point name="P">(1,2)</point>
    <point copyWithState="$P" name="cP" />
    <selectFromSequence name="s" from="1" to="100" />
    <number copyWithState="$s" name="cs" />
    <p name="p"><math copyWithState="$cP.x" name="cx" /></p>
    <p copyWithState="$p" name="cp" />
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

    it("keeps what it made while its case is not active", async () => {
        // Switching the case deletes the copy in the case left, and makes it
        // again when the case comes back, with what it made before, as a
        // `<conditionalContent>` with one case keeps it by withholding it.
        // That holds whether or not a save came between.
        const doenetML = `
    <booleanInput name="b" prefill="true" />
    <mathInput name="mi" prefill="1" />
    <conditionalContent name="cc">
        <case condition="$b"><math copyWithState="$mi" name="c" /></case>
        <else><text>none</text></else>
    </conditionalContent>
    `;
        for (const saveBetween of [true, false]) {
            const { core, resolvePathToNodeIdx, scoreState } =
                await createTestCore({ doenetML });
            async function setB(boolean: boolean) {
                await updateBooleanInputValue({
                    boolean,
                    componentIdx: await resolvePathToNodeIdx("b"),
                    core,
                });
            }
            async function c() {
                const stateVariables = await core.returnAllStateVariables(
                    false,
                    true,
                );
                return stateVariables[await resolvePathToNodeIdx("cc.c")]
                    .stateValues.value.tree;
            }
            await updateMathInputValue({
                latex: "5",
                componentIdx: await resolvePathToNodeIdx("mi"),
                core,
            });
            if (saveBetween) {
                await core.saveImmediately();
            }
            await setB(false);
            await core.saveImmediately();
            expect(
                Object.keys(JSON.parse(scoreState.state).__copySnapshots),
            ).toHaveLength(1);

            await setB(true);
            expect(await c()).eq(1);
            await core.saveImmediately();
            expect(
                Object.keys(JSON.parse(scoreState.state).__copySnapshots),
            ).toHaveLength(1);
        }
    });

    it("keeps its value through a reload while its source is inactive", async () => {
        // On load the copy is made again from `cc`, inactive then, and
        // takes the held snapshot. It is a `<group>`, which may hold
        // nothing: `<math copyWithState="$cc.a"/>` is an error, as `a` is absent
        // while the case is not (D36, #2450).
        const doenetML = `
    <booleanInput name="b" prefill="true" />
    <conditionalContent name="cc" condition="$b">
        <mathInput name="a" prefill="1" />
    </conditionalContent>
    <group copyWithState="$cc" name="g" />
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
            expect((await sv("g.a")).value.tree).eq(c);
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

    it("is made again from the case of a conditionalContent it was made from, with the reader's edits", async () => {
        // A copy of a `<conditionalContent>` is made from whichever case is
        // active. Made from the first case and edited, it is made again on
        // load from that case, with the edit, whichever case is active then
        // (#2441). Its components take nothing of the other case's: no
        // textInput is made.
        const doenetML = `
    <booleanInput name="b" prefill="true" />
    <conditionalContent name="cc">
        <case condition="$b"><mathInput name="a" prefill="1" /></case>
        <else><textInput name="t" prefill="hi" /></else>
    </conditionalContent>
    <group copyWithState="$cc" name="c" />
    `;
        const { sv, reload, setBoolean, core, resolve } =
            await reloader(doenetML);

        await updateMathInputValue({
            latex: "7",
            componentIdx: await resolve("c.a"),
            core: core(),
        });
        await updateMathInputValue({
            latex: "5",
            componentIdx: await resolve("cc.a"),
            core: core(),
        });
        await setBoolean("b", false);
        expect((await sv("c.a")).stateValues.value.tree).eq(7);

        const saved = await reload();
        expect(Object.values(saved.__copySnapshots)).toMatchObject([
            { caseIndex: 0 },
        ]);
        expect((await sv("cc.t")).stateValues.value).eq("hi");
        expect((await sv("c.a")).stateValues.value.tree).eq(7);
        expect(await sv("c.t")).eq(undefined);

        // the case active again, and a reload then, keep what the copy made
        await setBoolean("b", true);
        await reload();
        expect((await sv("cc.a")).stateValues.value.tree).eq(5);
        expect((await sv("c.a")).stateValues.value.tree).eq(7);
    });

    it("made while no case was active, is made again with nothing", async () => {
        // With one case, the copy made while it is active is made again from
        // it when it is not, and the copy made while it is not is made again
        // with nothing when it is.
        const doenetML = `
    <booleanInput name="b" prefill="true" />
    <conditionalContent name="cc" condition="$b">
        <mathInput name="a" prefill="1" />
    </conditionalContent>
    <group copyWithState="$cc" name="c" />
    <booleanInput name="b2" />
    <conditionalContent name="cc2" condition="$b2">
        <mathInput name="a2" prefill="2" />
    </conditionalContent>
    <group copyWithState="$cc2" name="c2" />
    `;
        const { sv, reload, setBoolean, core, resolve } =
            await reloader(doenetML);

        await updateMathInputValue({
            latex: "5",
            componentIdx: await resolve("cc.a"),
            core: core(),
        });
        await setBoolean("b", false);
        await setBoolean("b2", true);
        expect((await sv("c.a")).stateValues.value.tree).eq(1);
        expect((await sv("c2")).activeChildren).eqls([]);

        await reload();
        expect((await sv("c.a")).stateValues.value.tree).eq(1);
        expect((await sv("cc2.a2")).stateValues.value.tree).eq(2);
        expect((await sv("c2")).activeChildren).eqls([]);

        await setBoolean("b", true);
        await reload();
        expect((await sv("cc.a")).stateValues.value.tree).eq(5);
        expect((await sv("c.a")).stateValues.value.tree).eq(1);
        expect((await sv("c2")).activeChildren).eqls([]);
    });

    it("a save made before what decided a copy was held makes it from its source as restored", async () => {
        // A save that holds a snapshot alone, as those made before #2441
        // do, makes a copy of a `<conditionalContent>` again from the case
        // active on load: its components take nothing held of the other
        // case's, whose ids name that case (`case0|`, not `case1|`): the
        // textInput does not take the mathInput's value, and the div's
        // mathInput not the p's.
        const doenetML = `
    <booleanInput name="b" prefill="true" />
    <conditionalContent name="cc">
        <case condition="$b"><mathInput name="a" prefill="1" /></case>
        <else><textInput name="t" prefill="hi" /></else>
    </conditionalContent>
    <group copyWithState="$cc" name="c" />
    <conditionalContent name="cc2">
        <case condition="$b"><p><mathInput name="a" prefill="1" /></p></case>
        <else><div><mathInput name="t" prefill="2" /></div></else>
    </conditionalContent>
    <group copyWithState="$cc2" name="c2" />
    `;
        const { sv, reload, setBoolean, core, resolve } =
            await reloader(doenetML);

        for (const name of ["c.a", "c2.a"]) {
            await updateMathInputValue({
                latex: "5",
                componentIdx: await resolve(name),
                core: core(),
            });
        }
        await setBoolean("b", false);

        const saved = await reload({ legacy: true });
        expect(Object.keys(saved.__copySnapshots)).toHaveLength(2);
        const t = await sv("c.t");
        expect(t.componentType).eq("textInput");
        expect(t.stateValues.value).eq("hi");
        expect((await sv("c2.t")).stateValues.value.tree).eq(2);
        expect(await sv("c.a")).eq(undefined);
    });

    it("written as a different tag, is made as it was when made", async () => {
        // Whether the copy is made from the math it copies, or is
        // `<point/>`, is decided from the value of the math, or of the math
        // a `<conditionalContent>` holds, when it is made. A reload makes it
        // as it was, not from what is decided then (#2441, D36).
        const doenetML = `
    <math name="m">x</math>
    <mathInput name="mi" bindValueTo="$m" />
    <booleanInput name="b" />
    <conditionalContent>
        <case condition="$b"><point copyWithState="$m" name="P" /></case>
    </conditionalContent>
    <conditionalContent name="cc">
        <case condition="$b"><math>(3,4)</math></case>
        <else><math>hi</math></else>
    </conditionalContent>
    <point copyWithState="$cc" name="Q" />
    <booleanInput name="b2" prefill="true" />
    <conditionalContent name="cc2">
        <case condition="$b2"><math>(5,6)</math></case>
        <else><math>hi</math></else>
    </conditionalContent>
    <point copyWithState="$cc2" name="R" />
    <math name="m2">x</math>
    <mathInput name="mi2" bindValueTo="$m2" />
    <point copyWithState="$m2" name="S" />
    `;
        const {
            reload,
            setBoolean,
            core,
            resolve,
            typeChangeInfos,
            pointsShown,
        } = await reloader(doenetML);

        await updateMathInputValue({
            latex: "(1,2)",
            componentIdx: await resolve("mi"),
            core: core(),
        });
        await setBoolean("b", true);
        await updateMathInputValue({
            latex: "y",
            componentIdx: await resolve("mi"),
            core: core(),
        });
        await setBoolean("b2", false);
        await updateMathInputValue({
            latex: "(7,8)",
            componentIdx: await resolve("mi2"),
            core: core(),
        });
        // `P` was made from `(1,2)`, and `R` from the case holding `(5,6)`;
        // `Q` while the case held `hi`, and `S` while `m2` was `x`, so they
        // are `<point/>`, at (0, 0)
        const shown = [
            [0, 0],
            [0, 0],
            [1, 2],
            [5, 6],
        ];
        /** The points shown, in order of their coordinates. */
        async function sortedPointsShown() {
            return (await pointsShown()).sort(
                (a: number[], b: number[]) => a[0] - b[0],
            );
        }
        expect(await sortedPointsShown()).eqls(shown);
        expect(typeChangeInfos().sort()).eqls(["$cc", "$m2"]);

        const saved = await reload();
        expect(Object.keys(saved.__copySnapshots)).toHaveLength(4);
        expect(await sortedPointsShown()).eqls(shown);
        // `Q` and `S` are reported as they were when made
        expect(typeChangeInfos().sort()).eqls(["$cc", "$m2"]);
    });

    it("of a mathInput, written as a point, keeps what it was made from", async () => {
        // The copy's point holds a copy of the mathInput, which keeps the
        // value it had, though the mathInput's is not a tuple on load
        const doenetML = `
    <mathInput name="mi" prefill="x" />
    <booleanInput name="b" />
    <conditionalContent>
        <case condition="$b"><point copyWithState="$mi" name="P" /></case>
    </conditionalContent>
    `;
        const { reload, setBoolean, core, resolve } = await reloader(doenetML);
        await updateMathInputValue({
            latex: "(1,2)",
            componentIdx: await resolve("mi"),
            core: core(),
        });
        await setBoolean("b", true);
        await updateMathInputValue({
            latex: "y",
            componentIdx: await resolve("mi"),
            core: core(),
        });

        /** The value of each mathInput a point holds. */
        async function inPoints() {
            const stateVariables = await core().returnAllStateVariables(
                false,
                true,
            );
            const result = [];
            for (const sv of Object.values(stateVariables) as any[]) {
                if (sv.componentType === "point") {
                    for (const child of sv.activeChildren) {
                        result.push(
                            stateVariables[child.componentIdx].stateValues.value
                                .tree,
                        );
                    }
                }
            }
            return result;
        }
        expect(await inPoints()).eqls([["tuple", 1, 2]]);
        await reload();
        expect(await inPoints()).eqls([["tuple", 1, 2]]);
    });

    it("deleted and made again without a reload, is made as it was", async () => {
        // Leaving a case deletes the copies in it, and coming back makes
        // them again, from what decided what they made when they were made
        // (`keepSavedStateForRecreation`): `P` is still made from the math,
        // whose value is no longer a tuple, and `g` from the case of `cc`
        // it was made from, with the reader's edit.
        const doenetML = `
    <math name="m">x</math>
    <mathInput name="mi" bindValueTo="$m" />
    <booleanInput name="b" />
    <booleanInput name="c" prefill="true" />
    <booleanInput name="o" prefill="true" />
    <conditionalContent>
        <case condition="$b"><point copyWithState="$m" name="P" /></case>
        <else>no point</else>
    </conditionalContent>
    <conditionalContent name="cc">
        <case condition="$c"><mathInput name="a" prefill="1" /></case>
        <else><textInput name="t" prefill="hi" /></else>
    </conditionalContent>
    <conditionalContent name="outer">
        <case condition="$o"><group copyWithState="$cc" name="g" /></case>
        <else>no group</else>
    </conditionalContent>
    `;
        const { sv, setBoolean, core, resolve, pointsShown } =
            await reloader(doenetML);
        await updateMathInputValue({
            latex: "(1,2)",
            componentIdx: await resolve("mi"),
            core: core(),
        });
        await setBoolean("b", true);
        await updateMathInputValue({
            latex: "y",
            componentIdx: await resolve("mi"),
            core: core(),
        });
        await updateMathInputValue({
            latex: "7",
            componentIdx: await resolve("outer.g.a"),
            core: core(),
        });
        await setBoolean("c", false);
        expect(await pointsShown()).eqls([[1, 2]]);
        expect((await sv("outer.g.a")).stateValues.value.tree).eq(7);

        await setBoolean("b", false);
        await setBoolean("o", false);
        expect(await pointsShown()).eqls([]);
        expect(await sv("outer.g.a")).eq(undefined);

        await setBoolean("b", true);
        await setBoolean("o", true);
        expect(await pointsShown()).eqls([[1, 2]]);
        expect((await sv("outer.g.a")).stateValues.value.tree).eq(7);
        expect(await sv("outer.g.t")).eq(undefined);
    });

    it("keeps values its source holds in primitive children or in essential state", async () => {
        // Dragging `<point>(1,2)</point>` or binding an input to
        // `<text>hi</text>` changes the source's string child, not its
        // essential state.
        const doenetML = `
    <graph><point name="P">(1,2)</point><point copyWithState="$P" name="Q" />
        <point name="A" /><point copyWithState="$A" name="B" /></graph>
    <text name="t">hi</text><textInput bindValueTo="$t" name="ti" />
    <text copyWithState="$t" name="t2" />
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
    <text copyWithState="$t" name="c" />
    <p name="p"><text name="inner" hide="false">b</text></p>
    <p copyWithState="$p" name="cp" />
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

    it("keeps a reader's change to what a copy given a type read from its text", async () => {
        // `type` on a copy of a `<sort>` reads its text again (#2414). What
        // it makes of the text is given the copy's ids, which do not move
        // when more is made ahead of it, as the repeat does after `n`
        // changes.
        const doenetML = `
    <mathInput name="n" prefill="1" />
    <repeatForSequence length="$n"><math>1</math><math>2</math></repeatForSequence>
    <graph><sort name="s" type="number">3 1 2</sort></graph>
    <graph><sort copyWithState="$s" type="text" name="c" /></graph>
    `;
        let { core, resolvePathToNodeIdx, scoreState } = await createTestCore({
            doenetML,
        });
        /** The text and anchor of each component the copy shows. */
        async function shown() {
            const c = (core as any).core._components[
                await resolvePathToNodeIdx("c")
            ];
            const result = [];
            for (const r of c.replacements) {
                result.push([
                    await r.stateValues.text,
                    (await r.stateValues.anchor).toString(),
                ]);
            }
            return result;
        }
        const c = (core as any).core._components[
            await resolvePathToNodeIdx("c")
        ];
        await moveText({
            componentIdx: c.replacements[0].componentIdx,
            x: 5,
            y: 7,
            core,
        });
        await updateMathInputValue({
            latex: "4",
            componentIdx: await resolvePathToNodeIdx("n"),
            core,
        });
        const moved = [
            ["1", "(5, 7)"],
            ["2", "(0, 0)"],
            ["3", "(0, 0)"],
        ];
        expect(await shown()).eqls(moved);

        await core.saveImmediately();
        ({ core, resolvePathToNodeIdx } = await createTestCore({
            doenetML,
            initialState: scoreState.state,
        }));
        expect(await shown()).eqls(moved);
    });
});

/**
 * A copy of a component named in a case of a `<conditionalContent>` (`$cc.p`)
 * is made from the case it was made from, through a reload, whichever case
 * is active then (B35): a `copy` shows the paragraph it was made from, and a
 * `copyWithState` that with the reader's edits.
 */
describe("A copy of a name in a case through a reload @group4", () => {
    function doenetMLFor(form: string, reference = "$cc.p", written = "p") {
        return `
    <mathInput name="n" prefill="1"/>
    <conditionalContent name="cc">
      <case condition="$n = 1"><p name="p">one: <mathInput name="a"/></p></case>
      <else><p name="p">other: <mathInput name="a"/></p></else>
    </conditionalContent>
    <booleanInput name="b"/>
    <conditionalContent><case condition="$b"><${written} ${form}="${reference}" name="pc"/></case></conditionalContent>
    `;
    }
    async function setN(
        r: Awaited<ReturnType<typeof reloader>>,
        latex: string,
    ) {
        await updateMathInputValue({
            latex,
            componentIdx: await r.resolve("n"),
            core: r.core(),
        });
    }

    for (const form of ["copy", "copyWithState"]) {
        it(`${form}: made from the first case, then the case changed`, async () => {
            const r = await reloader(doenetMLFor(form));
            await r.setBoolean("b", true);
            expect((await r.sv("pc")).stateValues.text).eq("one: ＿");
            await updateMathInputValue({
                latex: "5",
                componentIdx: await r.resolve("pc.a"),
                core: r.core(),
            });
            await setN(r, "2");
            expect((await r.sv("cc.p")).stateValues.text).eq("other: ＿");
            expect((await r.sv("pc")).stateValues.text).eq("one: 5");

            const saved = await r.reload();
            expect(Object.values(saved.__copySnapshots)).toMatchObject([
                {
                    sourceCase: {
                        cases: [{ stateId: "/~cc", caseIndex: 0 }],
                    },
                },
            ]);
            expect((await r.sv("cc.p")).stateValues.text).eq("other: ＿");
            expect((await r.sv("pc")).stateValues.text).eq("one: 5");

            // the first case active again, and a reload then, keep it
            await setN(r, "1");
            await r.reload();
            expect((await r.sv("pc")).stateValues.text).eq("one: 5");

            // and the case changed again, with a reload
            await setN(r, "3");
            await r.reload();
            expect((await r.sv("cc.p")).stateValues.text).eq("other: ＿");
            expect((await r.sv("pc")).stateValues.text).eq("one: 5");
        });

        it(`${form}: made from the else, then the first case active`, async () => {
            const r = await reloader(doenetMLFor(form));
            await setN(r, "2");
            await r.setBoolean("b", true);
            await updateMathInputValue({
                latex: "6",
                componentIdx: await r.resolve("pc.a"),
                core: r.core(),
            });
            await setN(r, "1");
            expect((await r.sv("pc")).stateValues.text).eq("other: 6");

            await r.reload();
            expect((await r.sv("cc.p")).stateValues.text).eq("one: ＿");
            expect((await r.sv("pc")).stateValues.text).eq("other: 6");
        });

        it(`${form}: of a deeper path, keeps the case`, async () => {
            const r = await reloader(doenetMLFor(form, "$cc.p.a", "mathInput"));
            await setN(r, "2");
            await r.setBoolean("b", true);
            await updateMathInputValue({
                latex: "6",
                componentIdx: await r.resolve("pc"),
                core: r.core(),
            });
            await setN(r, "1");
            expect((await r.sv("pc")).stateValues.value.tree).eq(6);
            const saved = await r.reload();
            expect(Object.values(saved.__copySnapshots)).toMatchObject([
                {
                    sourceCase: {
                        cases: [{ stateId: "/~cc", caseIndex: 1 }],
                    },
                },
            ]);
            expect((await r.sv("pc")).stateValues.value.tree).eq(6);
        });
    }

    for (const form of ["copy", "copyWithState"]) {
        it(`${form}: made from the one case, kept while no case is active`, async () => {
            // `$cc.p` names nothing while `b` is false, and the copy is made
            // again from the case it was made from, with the reader's value.
            const r = await reloader(`
    <booleanInput name="b" prefill="true"/>
    <conditionalContent name="cc">
      <case condition="$b"><p name="p">one: <mathInput name="a"/></p></case>
    </conditionalContent>
    <p ${form}="$cc.p" name="pc"/>
    `);
            await updateMathInputValue({
                latex: "5",
                componentIdx: await r.resolve("pc.a"),
                core: r.core(),
            });
            await r.setBoolean("b", false);
            expect((await r.sv("pc")).stateValues.text).eq("one: 5");

            await r.reload();
            expect((await r.sv("pc")).stateValues.text).eq("one: 5");

            await r.setBoolean("b", true);
            await r.reload();
            expect((await r.sv("cc.p")).stateValues.text).eq("one: ＿");
            expect((await r.sv("pc")).stateValues.text).eq("one: 5");
        });
    }

    it("of a name inside a group in a case, keeps the case", async () => {
        // A name in only some cases names nothing, in any case, so is not
        // made from one (`$cc.y` of a `y` only in the first case).
        const doenetML = `
    <mathInput name="n" prefill="1"/>
    <conditionalContent name="cc">
      <case condition="$n = 1"><group name="g"><text name="x">one</text><text name="y">only one</text></group></case>
      <else><group name="g"><text name="x">other</text></group></else>
    </conditionalContent>
    <text copy="$cc.g.x" name="cgx"/>
    <text copy="$cc.x" name="cx"/>
    <text copy="$cc.y" name="cy"/>
    `;
        const r = await reloader(doenetML);
        await setN(r, "2");
        expect((await r.sv("cc.x")).stateValues.value).eq("other");
        expect((await r.sv("cgx")).stateValues.value).eq("one");
        expect((await r.sv("cx")).stateValues.value).eq("one");
        expect((await r.sv("cy")).stateValues.value).eq("");

        await r.reload();
        expect((await r.sv("cc.x")).stateValues.value).eq("other");
        expect((await r.sv("cgx")).stateValues.value).eq("one");
        expect((await r.sv("cx")).stateValues.value).eq("one");
        expect((await r.sv("cy")).stateValues.value).eq("");
    });

    it("of a name in a nested conditionalContent, keeps both cases", async () => {
        // `ct` is made from the first case of each, and `ct2` from the
        // second case of the inner one, which the inner one need not have
        // when the outer one has its first case again.
        const doenetML = `
    <mathInput name="n" prefill="1"/>
    <mathInput name="m" prefill="1"/>
    <conditionalContent name="outer">
      <case condition="$n = 1"><conditionalContent name="inner">
        <case condition="$m = 1"><text name="t">one one</text></case>
        <else><text name="t">one other</text></else>
      </conditionalContent></case>
      <else><text name="t">other</text></else>
    </conditionalContent>
    <text copy="$outer.t" name="ct"/>
    <booleanInput name="b"/>
    <conditionalContent><case condition="$b"><text copy="$outer.t" name="ct2"/></case></conditionalContent>
    `;
        const r = await reloader(doenetML);
        async function setM(latex: string) {
            await updateMathInputValue({
                latex,
                componentIdx: await r.resolve("m"),
                core: r.core(),
            });
        }
        await setM("2");
        expect((await r.sv("ct")).stateValues.value).eq("one one");
        const saved = await r.reload();
        expect(Object.values(saved.__copySnapshots)).toMatchObject([
            {
                sourceCase: {
                    cases: [
                        { stateId: "/~outer", caseIndex: 0 },
                        { stateId: "/~outer/~inner", caseIndex: 0 },
                    ],
                },
            },
        ]);
        expect((await r.sv("outer.t")).stateValues.value).eq("one other");
        expect((await r.sv("ct")).stateValues.value).eq("one one");

        await r.setBoolean("b", true);
        expect((await r.sv("ct2")).stateValues.value).eq("one other");
        await setM("1");
        await setN(r, "2");
        expect((await r.sv("outer.t")).stateValues.value).eq("other");
        await r.reload();
        expect((await r.sv("outer.t")).stateValues.value).eq("other");
        expect((await r.sv("ct")).stateValues.value).eq("one one");
        expect((await r.sv("ct2")).stateValues.value).eq("one other");
    });

    for (const form of ["copy", "copyWithState"]) {
        it(`${form}: a conditionalContent copy of one named in a case keeps that case, and decides its own`, async () => {
            // `c` is a new `<conditionalContent>` made from the `inner` of
            // the first case of `outer`: it decides its own case from `$b`,
            // also after a reload while `outer` has its `<else>`, whose
            // `inner` it was not made from.
            const doenetML = `
    <booleanInput name="a" prefill="true"/>
    <booleanInput name="b" prefill="true"/>
    <conditionalContent name="outer">
      <case condition="$a"><conditionalContent name="inner">
        <case condition="$b"><p name="p">one <mathInput name="m"/></p></case>
        <else><p name="p">two <mathInput name="m"/></p></else>
      </conditionalContent></case>
      <else><conditionalContent name="inner">
        <case condition="$b"><p name="p">e1</p></case>
        <else><p name="p">e2</p></else>
      </conditionalContent></else>
    </conditionalContent>
    <conditionalContent ${form}="$outer.inner" name="c"/>
    `;
            const r = await reloader(doenetML);
            async function setM(latex: string) {
                await updateMathInputValue({
                    latex,
                    componentIdx: await r.resolve("c.m"),
                    core: r.core(),
                });
            }
            await setM("5");
            await r.setBoolean("b", false);
            await setM("6");
            await r.setBoolean("a", false);
            expect((await r.sv("outer.p")).stateValues.text).eq("e2");
            expect((await r.sv("c.p")).stateValues.text).eq("two 6");

            await r.reload();
            expect((await r.sv("outer.p")).stateValues.text).eq("e2");
            expect((await r.sv("c.p")).stateValues.text).eq("two 6");
            await r.setBoolean("b", true);
            expect((await r.sv("c.p")).stateValues.text).eq("one 5");
            await r.reload();
            expect((await r.sv("outer.p")).stateValues.text).eq("e1");
            expect((await r.sv("c.p")).stateValues.text).eq("one 5");
        });
    }
});

/**
 * What was saved of a component is restored only to a component of the type
 * it was saved from (B36). A copy of a `<collect>` made again on load is
 * made from what the collect holds then, and counts its `stateId`s from its
 * own, so a component of another type can have the `stateId` a saved one
 * had.
 */
describe("A saved value restored to a component of another type @group4", () => {
    const doenetMLFor = (tail: string) => `
    <booleanInput name="b"/>
    <section name="s"><conditionalContent name="cc">
      <case condition="$b"><textInput name="i"/></case>
      <else><mathInput name="i"/></else>
    </conditionalContent></section>
    <collect name="col" componentType="_input" from="$s"/>
    ${tail}
    `;

    for (const form of ["copy", "copyWithState"]) {
        it(`is dropped, for a ${form} of a collect`, async () => {
            const r = await reloader(
                doenetMLFor(`<group ${form}="$col" name="gc"/>`),
            );
            await updateMathInputValue({
                latex: "x+1",
                componentIdx: await r.resolve("gc.i"),
                core: r.core(),
            });
            await r.setBoolean("b", true);

            const saved = await r.reload();
            // the mathInput the reader typed into, which the textInput made
            // again on load has the `stateId` of
            const [stateId] = Object.entries(saved.__componentTypes).find(
                ([, type]) => type === "mathInput",
            )!;
            expect(saved[stateId].value).eqls(["+", "x", 1]);

            const i = await r.sv("gc.i");
            expect(i.componentType).eq("textInput");
            expect(i.stateValues.value).eq("");
            await updateTextInputValue({
                text: "hello",
                componentIdx: await r.resolve("gc.i"),
                core: r.core(),
            });

            const resaved = await r.reload();
            expect(resaved.__componentTypes[stateId]).eq("textInput");
            expect((await r.sv("gc.i")).stateValues.value).eq("hello");
        });
    }

    it("does not happen for a collect, or a linked copy of one", async () => {
        // their components shadow what they collect, whose values are saved
        // under its own `stateId`
        const r = await reloader(
            doenetMLFor(`<group extend="$col" name="ge"/>`),
        );
        await updateMathInputValue({
            latex: "x+1",
            componentIdx: await r.resolve("ge.i"),
            core: r.core(),
        });
        await r.setBoolean("b", true);
        const saved = await r.reload();
        expect(Object.keys(saved.__componentTypes).sort()).eqls([
            "/~b",
            "/~s/~cc/1/0/0",
        ]);
        expect((await r.sv("ge.i")).stateValues.value).eq("");
        expect((await r.sv("col[1]")).stateValues.value).eq("");
    });

    it("saves the type only of what it saves", async () => {
        const r = await reloader(`
    <mathInput name="m" prefill="1"/>
    <booleanInput name="b"/>
    `);
        await r.setBoolean("b", true);
        const saved = await r.reload();
        expect(saved.__componentTypes).eqls({ "/~b": "booleanInput" });
    });
});
