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

    it("keeps what it made while its case is not active", async () => {
        // Switching the case deletes the copy in the case left, and makes it
        // again when the case comes back, with what it made before, as a
        // `<conditionalContent>` with one case keeps it by withholding it.
        // That holds whether or not a save came between.
        const doenetML = `
    <booleanInput name="b" prefill="true" />
    <mathInput name="mi" prefill="1" />
    <conditionalContent name="cc">
        <case condition="$b"><math copy="$mi" name="c" /></case>
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
    <group copy="$cc" name="c" />
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
    <group copy="$cc" name="c" />
    <booleanInput name="b2" />
    <conditionalContent name="cc2" condition="$b2">
        <mathInput name="a2" prefill="2" />
    </conditionalContent>
    <group copy="$cc2" name="c2" />
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
    <group copy="$cc" name="c" />
    <conditionalContent name="cc2">
        <case condition="$b"><p><mathInput name="a" prefill="1" /></p></case>
        <else><div><mathInput name="t" prefill="2" /></div></else>
    </conditionalContent>
    <group copy="$cc2" name="c2" />
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

    it("written as a different tag, is shown, or not, as it was when made", async () => {
        // Whether the copy is made is decided from the value of a math, or
        // from what a `<conditionalContent>` holds, when it is made. A reload
        // makes it as it was, not from what is decided then (#2441).
        const doenetML = `
    <math name="m">x</math>
    <mathInput name="mi" bindValueTo="$m" />
    <booleanInput name="b" />
    <conditionalContent>
        <case condition="$b"><point copy="$m" name="P" /></case>
    </conditionalContent>
    <conditionalContent name="cc">
        <case condition="$b"><math>(3,4)</math></case>
        <else><text>hi</text></else>
    </conditionalContent>
    <point copy="$cc" name="Q" />
    <booleanInput name="b2" prefill="true" />
    <conditionalContent name="cc2">
        <case condition="$b2"><math>(5,6)</math></case>
        <else><text>hi</text></else>
    </conditionalContent>
    <point copy="$cc2" name="R" />
    <math name="m2">x</math>
    <mathInput name="mi2" bindValueTo="$m2" />
    <point copy="$m2" name="S" />
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
        // `Q` while the case held a text, and `S` while `m2` was `x`, so
        // they show nothing
        const shown = [
            [1, 2],
            [5, 6],
        ];
        expect(await pointsShown()).eqls(shown);
        expect(typeChangeInfos().sort()).eqls(["$cc", "$m2"]);

        const saved = await reload();
        expect(Object.keys(saved.__copySnapshots)).toHaveLength(4);
        expect(await pointsShown()).eqls(shown);
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
        <case condition="$b"><point copy="$mi" name="P" /></case>
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
        <case condition="$b"><point copy="$m" name="P" /></case>
        <else>no point</else>
    </conditionalContent>
    <conditionalContent name="cc">
        <case condition="$c"><mathInput name="a" prefill="1" /></case>
        <else><textInput name="t" prefill="hi" /></else>
    </conditionalContent>
    <conditionalContent name="outer">
        <case condition="$o"><group copy="$cc" name="g" /></case>
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

    it("keeps a reader's change to what a copy given a type read from its text", async () => {
        // `type` on a copy of a `<sort>` reads its text again (#2414). What
        // it makes of the text is given the copy's ids, which do not move
        // when more is made ahead of it, as the repeat does after `n`
        // changes.
        const doenetML = `
    <mathInput name="n" prefill="1" />
    <repeatForSequence length="$n"><math>1</math><math>2</math></repeatForSequence>
    <graph><sort name="s" type="number">3 1 2</sort></graph>
    <graph><sort copy="$s" type="text" name="c" /></graph>
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
