import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import {
    updateBooleanInputValue,
    updateMathInputValue,
} from "../utils/actions";
import { DiagnosticsManager } from "../../core/DiagnosticsManager";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

/**
 * A diagnostic caused by values that can change appears when its condition
 * starts and goes away when it ends (B33, DIAG-1, DIAG-2): while it holds
 * there is one of it, however often it is decided again, and the
 * diagnostics after a reload match those before it (DIAG-6).
 */

/** A document whose diagnostics are read as `[code, line, message]`. */
async function setup(doenetML: string) {
    let { core, resolvePathToNodeIdx, scoreState } = await createTestCore({
        doenetML,
    });

    /**
     * The diagnostics reported now with one of `codes`, as code, type, line
     * and message, in the order of their lines.
     */
    function diagnostics(codes: string[]) {
        return (core as any).core.diagnostics
            .filter((d: any) => codes.includes(d.code))
            .map((d: any) => ({
                code: d.code,
                type: d.type,
                line: d.position?.start.line,
                message: d.message,
            }))
            .sort((a: any, b: any) => a.line - b.line);
    }

    /** Save the document's state and load it again from what was saved. */
    async function reload() {
        await core.saveImmediately();
        ({ core, resolvePathToNodeIdx, scoreState } = await createTestCore({
            doenetML,
            initialState: scoreState.state,
        }));
    }

    /**
     * The diagnostics with one of `codes` now and after a reload, which
     * must be the same (DIAG-6).
     */
    async function diagnosticsSurvivingReload(codes: string[]) {
        const before = diagnostics(codes);
        await reload();
        expect(diagnostics(codes)).eqls(before);
        return before;
    }

    async function text(name: string) {
        const stateVariables = await core.returnAllStateVariables(false, true);
        return stateVariables[await resolvePathToNodeIdx(name)].stateValues
            .text;
    }

    return {
        diagnostics,
        diagnosticsSurvivingReload,
        text,
        async setBoolean(name: string, boolean: boolean) {
            await updateBooleanInputValue({
                boolean,
                componentIdx: await resolvePathToNodeIdx(name),
                core,
            });
        },
        async setMath(name: string, latex: string) {
            await updateMathInputValue({
                latex,
                componentIdx: await resolvePathToNodeIdx(name),
                core,
            });
        },
        async resample(name: string) {
            await core.requestAction({
                componentIdx: await resolvePathToNodeIdx(name),
                actionName: "resample",
                args: {},
            });
        },
        /** Ask for every state variable, so each condition is decided. */
        async refresh() {
            await core.returnAllStateVariables(false, true);
        },
    };
}

const TYPE_CHANGE_CODES = [
    "doenet-e0064",
    "doenet-e0065",
    "doenet-i0053",
    "doenet-i0054",
];

describe("A value-driven diagnostic follows its condition (B33) @group4", () => {
    it("a typed extend of a conditionalContent whose cases hold different types is an error that stays as the case switches (D36)", async () => {
        const d = await setup(`
<booleanInput name="b"/>
<conditionalContent name="cc">
  <case condition="$b"><point>(1,2)</point></case>
  <else><text>no</text></else>
</conditionalContent>
<p name="p1"><text name="t" extend="$cc"/></p>
`);
        const error = {
            code: "doenet-e0065",
            type: "error",
            line: 7,
            message:
                "A `<text>` can't be made from `$cc`, which gives a `<point>`. To show it as it is, write `$cc`.",
        };
        expect(await d.text("p1")).eq("");
        expect(d.diagnostics(TYPE_CHANGE_CODES)).eqls([error]);

        for (let i = 0; i < 3; i++) {
            await d.setBoolean("b", true);
            expect(await d.text("p1")).eq("");
            expect(d.diagnostics(TYPE_CHANGE_CODES)).eqls([error]);

            await d.setBoolean("b", false);
            expect(await d.text("p1")).eq("");
            expect(d.diagnostics(TYPE_CHANGE_CODES)).eqls([error]);
        }
        expect(await d.diagnosticsSurvivingReload(TYPE_CHANGE_CODES)).eqls([
            error,
        ]);
    });

    it("an index that names nothing has an info while it does, after a reload too", async () => {
        const d = await setup(`
<mathInput name="n" prefill="1"/>
<repeat name="r" for="a b" valueName="v"><text>$v</text></repeat>
<p name="p1"><text name="t" extend="$r[$n]"/></p>
`);
        const info = {
            code: "doenet-i0054",
            type: "info",
            line: 4,
            message:
                "`$r[$n]` names nothing now, so this `<text>` is missing until it does.",
        };
        expect(await d.diagnosticsSurvivingReload(TYPE_CHANGE_CODES)).eqls([]);

        for (let i = 0; i < 2; i++) {
            await d.setMath("n", "3");
            expect(await d.text("p1")).eq("＿");
            expect(d.diagnostics(TYPE_CHANGE_CODES)).eqls([info]);
            expect(await d.diagnosticsSurvivingReload(TYPE_CHANGE_CODES)).eqls([
                info,
            ]);

            await d.setMath("n", "2");
            expect(await d.text("p1")).eq("b");
            expect(d.diagnostics(TYPE_CHANGE_CODES)).eqls([]);
            expect(await d.diagnosticsSurvivingReload(TYPE_CHANGE_CODES)).eqls(
                [],
            );
        }
    });

    it("an info naming a value replaces the one before it, and goes when the value matches", async () => {
        const d = await setup(`
<mathInput name="mi" prefill="x"/>
<group name="g"><math>$mi</math></group>
<p name="p1"><point name="P" extend="$g"/></p>
`);
        function infoNaming(value: string) {
            return {
                code: "doenet-i0053",
                type: "info",
                line: 4,
                message: `A \`<point>\` can't be made from \`$g\` while its value, ${value}, isn't a tuple of coordinates, so it is missing until it is.`,
            };
        }
        expect(d.diagnostics(TYPE_CHANGE_CODES)).eqls([infoNaming("x")]);

        await d.setMath("mi", "y");
        expect(d.diagnostics(TYPE_CHANGE_CODES)).eqls([infoNaming("y")]);

        await d.setMath("mi", "(1,2)");
        expect(await d.text("p1")).eq("(1, 2)");
        expect(d.diagnostics(TYPE_CHANGE_CODES)).eqls([]);

        await d.setMath("mi", "z");
        expect(await d.diagnosticsSurvivingReload(TYPE_CHANGE_CODES)).eqls([
            infoNaming("z"),
        ]);
    });

    it("an info of an unlinked copy names the value it was made from, after a reload too", async () => {
        // A `copy` stays as it was made, a missing `<point>`, and so does its
        // info.
        const d = await setup(`
<mathInput name="mi" prefill="x"/>
<group name="g"><math>$mi</math></group>
<p name="p1"><point name="P" copy="$g"/></p>
`);
        const infoNamingX = {
            code: "doenet-i0053",
            type: "info",
            line: 4,
            message:
                "A `<point>` can't be made from `$g` while its value, x, isn't a tuple of coordinates, so it is missing until it is.",
        };
        expect(d.diagnostics(TYPE_CHANGE_CODES)).eqls([infoNamingX]);

        await d.setMath("mi", "y");
        expect(await d.text("p1")).eq("＿");
        expect(await d.diagnosticsSurvivingReload(TYPE_CHANGE_CODES)).eqls([
            infoNamingX,
        ]);

        await d.setMath("mi", "(1,2)");
        expect(await d.text("p1")).eq("＿");
        expect(await d.diagnosticsSurvivingReload(TYPE_CHANGE_CODES)).eqls([
            infoNamingX,
        ]);
    });

    it("an info of an extend in a case that is withheld is not reported while it is", async () => {
        const d = await setup(`
<booleanInput name="show" prefill="true"/>
<mathInput name="mi" prefill="x"/>
<group name="g"><math>$mi</math></group>
<conditionalContent>
  <case condition="$show"><p name="p1"><point extend="$g"/></p></case>
</conditionalContent>
`);
        expect(d.diagnostics(TYPE_CHANGE_CODES).map((x: any) => x.line)).eqls([
            6,
        ]);

        await d.setBoolean("show", false);
        expect(await d.diagnosticsSurvivingReload(TYPE_CHANGE_CODES)).eqls([]);

        await d.setBoolean("show", true);
        expect(
            (await d.diagnosticsSurvivingReload(TYPE_CHANGE_CODES)).map(
                (x: any) => x.line,
            ),
        ).eqls([6]);
    });

    it("an info of an extend that is deleted goes with it", async () => {
        // With an `<else>`, the case not chosen is deleted, not withheld.
        const d = await setup(`
<booleanInput name="show" prefill="true"/>
<mathInput name="mi" prefill="x"/>
<group name="g"><math>$mi</math></group>
<conditionalContent>
  <case condition="$show"><p name="p1"><point extend="$g"/></p></case>
  <else><p>hidden</p></else>
</conditionalContent>
`);
        expect(d.diagnostics(TYPE_CHANGE_CODES).map((x: any) => x.line)).eqls([
            6,
        ]);

        await d.setBoolean("show", false);
        expect(await d.diagnosticsSurvivingReload(TYPE_CHANGE_CODES)).eqls([]);

        await d.setBoolean("show", true);
        expect(
            (await d.diagnosticsSurvivingReload(TYPE_CHANGE_CODES)).map(
                (x: any) => x.line,
            ),
        ).eqls([6]);
    });

    it("an index into a math follows the value from a scalar to a tuple and back", async () => {
        const d = await setup(`
<mathInput name="mi" prefill="5"/>
<math name="m">$mi</math>
<p name="p">[$m[2]]</p>
`);
        // an info, as `m`'s value comes from an input (DIAG-2)
        const warning = {
            code: "doenet-w0100",
            type: "info",
            line: 4,
            message: "Cannot reference index `$m[2]`",
        };
        expect(await d.text("p")).eq("[＿]");
        expect(d.diagnostics(["doenet-w0100"])).eqls([warning]);

        for (let i = 0; i < 2; i++) {
            await d.setMath("mi", "(1,2)");
            expect(await d.text("p")).eq("[2]");
            expect(d.diagnostics(["doenet-w0100"])).eqls([]);

            await d.setMath("mi", "7");
            expect(await d.text("p")).eq("[＿]");
            expect(d.diagnostics(["doenet-w0100"])).eqls([warning]);
        }
    });

    it("an index into a math that is a tuple at load is reported once it becomes a scalar", async () => {
        const d = await setup(`
<mathInput name="mi" prefill="(1,2)"/>
<math name="m">$mi</math>
<p name="p">[$m[2]]</p>
`);
        expect(await d.text("p")).eq("[2]");
        expect(await d.diagnosticsSurvivingReload(["doenet-w0100"])).eqls([]);

        await d.setMath("mi", "3");
        // an index into a scalar names nothing, a blank (D37)
        expect(await d.text("p")).eq("[＿]");
        expect(
            (await d.diagnosticsSurvivingReload(["doenet-w0100"])).map(
                (x: any) => x.code,
            ),
        ).eqls(["doenet-w0100"]);

        await d.setMath("mi", "(4,5)");
        expect(await d.text("p")).eq("[5]");
        expect(await d.diagnosticsSurvivingReload(["doenet-w0100"])).eqls([]);
    });

    it("the index warning of a copy stays as it was when the copy was made", async () => {
        // A `copy` does not follow its source, so its warning explains what
        // it shows: the warning it was made with. `$m[2]` follows the value.
        const d = await setup(`
<mathInput name="mi" prefill="5"/>
<math name="m">$mi</math>
<p name="linked">[$m[2]]</p>
<p name="copied">[<math copy="$m[2]"/>]</p>
`);
        function lines() {
            return d
                .diagnostics(["doenet-w0100"])
                .map((x: any) => [x.line, x.message]);
        }
        const linkedWarning = [4, "Cannot reference index `$m[2]`"];
        const copiedWarning = [5, "Cannot reference index `$m[2]`"];
        expect(lines()).eqls([linkedWarning, copiedWarning]);

        await d.setMath("mi", "(1,2)");
        expect(await d.text("linked")).eq("[2]");
        expect(await d.text("copied")).eq("[＿]");
        expect(lines()).eqls([copiedWarning]);
        expect(
            (await d.diagnosticsSurvivingReload(["doenet-w0100"])).map(
                (x: any) => x.line,
            ),
        ).eqls([5]);

        await d.setMath("mi", "7");
        expect(lines()).eqls([linkedWarning, copiedWarning]);
        expect(
            (await d.diagnosticsSurvivingReload(["doenet-w0100"])).map(
                (x: any) => x.line,
            ),
        ).eqls([4, 5]);
    });

    it("a copy made from a tuple has no index warning when the value becomes a scalar", async () => {
        const d = await setup(`
<mathInput name="mi" prefill="(1,2)"/>
<math name="m">$mi</math>
<p name="linked">[$m[2]]</p>
<p name="copied">[<math copy="$m[2]"/>]</p>
`);
        expect(d.diagnostics(["doenet-w0100"])).eqls([]);

        await d.setMath("mi", "3");
        // an index into a scalar names nothing, a blank (D37)
        expect(await d.text("linked")).eq("[＿]");
        expect(await d.text("copied")).eq("[2]");
        expect(
            (await d.diagnosticsSurvivingReload(["doenet-w0100"])).map(
                (x: any) => x.line,
            ),
        ).eqls([4]);
    });
    it("a copy keeps its index warning through a reload when what it shows does not tell", async () => {
        // A copy of nothing entered shows nothing and has no warning, as one
        // of a scalar shows nothing and has one: a save holds the copy, so
        // a reload reports the warning it was made with.
        const d = await setup(`
<mathInput name="mi"/>
<math name="m">$mi</math>
<p name="linked">[$m[2]]</p>
<p name="copied">[<math copy="$m[2]"/>]</p>
`);
        expect(d.diagnostics(["doenet-w0100"])).eqls([]);

        await d.setMath("mi", "5");
        expect(await d.text("copied")).eq("[＿]");
        expect(
            (await d.diagnosticsSurvivingReload(["doenet-w0100"])).map(
                (x: any) => x.line,
            ),
        ).eqls([4]);

        await d.setMath("mi", "");
        expect(await d.diagnosticsSurvivingReload(["doenet-w0100"])).eqls([]);
    });

    it("a copy of a second index keeps its warning through a reload", async () => {
        // `$m[2][1]` shows nothing whether `$m[2]` is a scalar or not.
        const d = await setup(`
<mathInput name="mi" prefill="(1,2)"/>
<math name="m">$mi</math>
<p name="copied">[<math copy="$m[2][1]"/>]</p>
`);
        expect(d.diagnostics(["doenet-w0100"]).map((x: any) => x.line)).eqls([
            4,
        ]);

        await d.setMath("mi", "((1,2),(3,4))");
        expect(await d.text("copied")).eq("[＿]");
        expect(
            (await d.diagnosticsSurvivingReload(["doenet-w0100"])).map(
                (x: any) => x.line,
            ),
        ).eqls([4]);
    });
});

describe("Infos that follow their value, after a reload too (#2506) @group4", () => {
    it("a selectRandomNumbers whose selection a reload keeps reports its info again", async () => {
        // Its parameter is a reference, so a save holds its selection, and
        // a reload keeps it rather than selecting again (#2468).
        const d = await setup(`<selectFromSequence name="sd" from="-1" to="-1"/>
<selectRandomNumbers type="gaussian" standardDeviation="$sd"/>
<selectRandomNumbers type="gaussian" standardDeviation="-1"/>
<booleanInput name="b"/>`);
        const expected = [
            { code: "doenet-w0126", type: "info", line: 2 },
            { code: "doenet-w0126", type: "warning", line: 3 },
        ];
        await d.refresh();
        expect(
            d.diagnostics(["doenet-w0126"]).map(({ message, ...d }) => d),
        ).eqls(expected);
        // an interaction, so there is a save to load from
        await d.setBoolean("b", true);
        expect(
            (await d.diagnosticsSurvivingReload(["doenet-w0126"])).map(
                ({ message, ...d }) => d,
            ),
        ).eqls(expected);
    });

    it("a resample reports what its parameters give, as the first draw did", async () => {
        const d = await setup(`<mathInput name="sd" prefill="-1"/>
<sampleRandomNumbers name="s" type="gaussian" standardDeviation="$sd"/>
<sampleRandomNumbers name="s2" type="gaussian" standardDeviation="-1"/>`);
        const levels = async () => {
            await d.refresh();
            return d
                .diagnostics(["doenet-w0126"])
                .map(({ type, line }: any) => [type, line]);
        };
        const both = [
            ["info", 2],
            ["warning", 3],
        ];
        expect(await levels()).eqls(both);
        await d.resample("s");
        await d.resample("s2");
        expect(await levels()).eqls(both);

        await d.setMath("sd", "1");
        await d.resample("s");
        expect(await levels()).eqls([["warning", 3]]);

        await d.setMath("sd", "-2");
        expect(await levels()).eqls(both);
        await d.resample("s");
        expect(await levels()).eqls(both);
        expect(
            (await d.diagnosticsSurvivingReload(["doenet-w0126"])).map(
                ({ type, line }: any) => [type, line],
            ),
        ).eqls(both);
    });

    it("w0072 comes back each time the case holding the source is no longer active", async () => {
        const d = await setup(`<booleanInput name="b"/>
<conditionalContent name="cc">
  <case condition="$b"><section name="S"><math>x</math></section></case>
</conditionalContent>
<p name="p"><collect componentType="math" from="$cc.S"/></p>`);
        const info = [
            {
                code: "doenet-w0072",
                type: "info",
                line: 5,
                message: "No source found for collect.",
            },
        ];
        const check = async (shown: boolean) => {
            // collects what a reload would: nothing while the case isn't active
            expect(await d.text("p")).eq(shown ? "x" : "");
            expect(d.diagnostics(["doenet-w0072"])).eqls(shown ? [] : info);
        };
        await check(false);
        for (let i = 0; i < 3; i++) {
            await d.setBoolean("b", true);
            await check(true);
            await d.setBoolean("b", false);
            await check(false);
        }
        expect(await d.diagnosticsSurvivingReload(["doenet-w0072"])).eqls(info);
        await d.setBoolean("b", true);
        await check(true);
        expect(await d.diagnosticsSurvivingReload(["doenet-w0072"])).eqls([]);
    });

    it("a tag of an iteration that isn't there has an info while it isn't", async () => {
        const d = await setup(`<mathInput name="i" prefill="0"/>
<repeat name="r" for="1 2" valueName="v"><math>$v</math></repeat>
<p name="p"><math extend="$r[$i]"/></p>
<p>$r[$i]</p>`);
        const levels = async () => {
            await d.refresh();
            return d
                .diagnostics(["doenet-i0054", "doenet-w0104", "doenet-w0181"])
                .map(({ code, type, line }: any) => [code, type, line]);
        };
        // below 1
        expect(await levels()).eqls([
            ["doenet-i0054", "info", 3],
            ["doenet-w0104", "info", 4],
        ]);
        await d.setMath("i", "2");
        expect(await levels()).eqls([]);
        expect(await d.text("p")).eq("2");
        // past the iterations: the bare reference says how many there are
        await d.setMath("i", "3");
        const past = [
            ["doenet-i0054", "info", 3],
            ["doenet-w0181", "info", 4],
        ];
        expect(await levels()).eqls(past);
        expect(
            (
                await d.diagnosticsSurvivingReload([
                    "doenet-i0054",
                    "doenet-w0104",
                    "doenet-w0181",
                ])
            ).map(({ code, type, line }: any) => [code, type, line]),
        ).eqls(past);
    });
});

describe("An index that names nothing in what a value shows follows it (#2506) @group4", () => {
    it("w0181 past a repeat in the case shown is an info while it is past", async () => {
        const d = await setup(`<booleanInput name="b"/>
<conditionalContent name="cc">
  <case condition="$b"><repeat name="r" for="1 2" valueName="v"><math>$v</math></repeat></case>
  <else><repeat name="r" for="1" valueName="v"><math>$v</math></repeat></else>
</conditionalContent>
<p name="p">[$cc.r[2]]</p>
<repeat name="r2" for="1" valueName="v"><math>$v</math></repeat>
<p>$r2[2]</p>`);
        const past = (lines: number[]) =>
            lines.map((line) => [line === 6 ? "info" : "warning", line]);
        const levels = async () => {
            await d.refresh();
            return d
                .diagnostics(["doenet-w0181"])
                .map(({ type, line }: any) => [type, line]);
        };
        // past one written as `for="1"` is a warning, as written
        expect(await levels()).eqls(past([6, 8]));
        for (let i = 0; i < 2; i++) {
            await d.setBoolean("b", true);
            expect(await d.text("p")).eq("[2]");
            expect(await levels()).eqls(past([8]));
            await d.setBoolean("b", false);
            expect(await d.text("p")).eq("[＿]");
            expect(await levels()).eqls(past([6, 8]));
        }
        await d.setBoolean("b", true);
        expect(
            (await d.diagnosticsSurvivingReload(["doenet-w0181"])).map(
                ({ type, line }: any) => [type, line],
            ),
        ).eqls(past([8]));
    });

    it("w0188 after a group in the case shown is an info while it holds several", async () => {
        const d = await setup(`<booleanInput name="b"/>
<conditionalContent name="cc">
  <case condition="$b"><group name="x"><math>a</math></group></case>
  <else><group name="x"><math>a</math><math>b</math></group></else>
</conditionalContent>
<p name="p">[$cc.x[1]]</p>
<conditionalContent name="cc2">
  <case condition="false"><group name="x"><math>a</math></group></case>
  <else><group name="x"><math>a</math><math>b</math></group></else>
</conditionalContent>
<p>[$cc2.x[1]]</p>`);
        const codes = ["doenet-w0188", "doenet-w0100"];
        const levels = async () => {
            await d.refresh();
            return d
                .diagnostics(codes)
                .map(({ code, type, line }: any) => [code, type, line]);
        };
        // a case whose condition is written `false` is never shown: the
        // group is decided by the DoenetML, a warning
        const several = [
            ["doenet-w0188", "info", 6],
            ["doenet-w0188", "warning", 11],
        ];
        // one math, which takes no index, while the case is shown
        const one = [
            ["doenet-w0100", "info", 6],
            ["doenet-w0188", "warning", 11],
        ];
        expect(await levels()).eqls(several);
        for (let i = 0; i < 2; i++) {
            await d.setBoolean("b", true);
            expect(await levels()).eqls(one);
            await d.setBoolean("b", false);
            expect(await levels()).eqls(several);
        }
        await d.setBoolean("b", true);
        expect(
            (await d.diagnosticsSurvivingReload(codes)).map(
                ({ code, type, line }: any) => [code, type, line],
            ),
        ).eqls(one);
    });

    it("w0188 after an iteration holding several stays a warning as iterations come and go", async () => {
        // Every iteration is made from the same template
        const d = await setup(`<mathInput name="n" prefill="2"/>
<repeatForSequence name="r" length="$n" valueName="v"><math>$v</math><math>2$v</math></repeatForSequence>
<p>[$r[1][3]]</p>`);
        const levels = async () => {
            await d.refresh();
            return d
                .diagnostics(["doenet-w0188"])
                .map(({ type, line }: any) => [type, line]);
        };
        expect(await levels()).eqls([["warning", 3]]);
        await d.setMath("n", "1");
        expect(await levels()).eqls([["warning", 3]]);
        expect(
            (await d.diagnosticsSurvivingReload(["doenet-w0188"])).map(
                ({ type, line }: any) => [type, line],
            ),
        ).eqls([["warning", 3]]);
    });
});

describe("DiagnosticsManager conditions (B33) @group4", () => {
    function info(message: string, line = 1) {
        return {
            type: "info" as const,
            message,
            position: {
                start: { line, column: 1, offset: 0 },
                end: { line, column: 2, offset: 1 },
            },
        };
    }

    it("replaces what a condition gave, and withdraws it when it ends", () => {
        const manager = new DiagnosticsManager({ preliminaryDiagnostics: [] });
        manager.setConditionDiagnostics(1, "c", [info("a")]);
        manager.setConditionDiagnostics(1, "c", [info("a")]);
        expect(manager.diagnostics.map((d) => d.message)).eqls(["a"]);

        manager.setConditionDiagnostics(1, "c", [info("b")]);
        expect(manager.diagnostics.map((d) => d.message)).eqls(["b"]);

        manager.getDiagnostics();
        manager.setConditionDiagnostics(1, "c", []);
        expect(manager.diagnostics).eqls([]);
        expect(manager.hasPendingDiagnostics).eq(true);
    });

    it("keeps a diagnostic two components hold until neither does", () => {
        // Two iterations of a repeat made from the same markup report the
        // same diagnostic at the same place.
        const manager = new DiagnosticsManager({ preliminaryDiagnostics: [] });
        manager.setConditionDiagnostics(1, "c", [info("a")]);
        manager.setConditionDiagnostics(2, "c", [info("a")]);
        expect(manager.diagnostics.map((d) => d.message)).eqls(["a"]);

        manager.setConditionDiagnostics(1, "c", []);
        expect(manager.diagnostics.map((d) => d.message)).eqls(["a"]);

        manager.withdrawConditionDiagnostics(2);
        expect(manager.diagnostics).eqls([]);
    });

    it("reports a warning a condition gives while its component isn't shown, and keeps it once deleted (#2506)", () => {
        const manager = new DiagnosticsManager({ preliminaryDiagnostics: [] });
        const shown = new Set([1, 2]);
        manager.isShown = (idx) => shown.has(idx);
        const warning = { ...info("w", 2), type: "warning" as const };
        manager.setConditionDiagnostics(1, "c", [info("i"), warning]);
        expect(manager.diagnostics.map((d) => d.message)).eqls(["i", "w"]);

        // withheld: the info explains nothing shown, the warning stays
        shown.delete(1);
        expect(manager.diagnostics.map((d) => d.message)).eqls(["w"]);

        // deleted: the warning stays, and is kept once if made again
        manager.withdrawConditionDiagnostics(1);
        expect(manager.diagnostics.map((d) => d.message)).eqls(["w"]);
        manager.setConditionDiagnostics(2, "c", [info("i"), warning]);
        expect(manager.diagnostics.map((d) => d.message)).eqls(["w", "i"]);
        manager.withdrawConditionDiagnostics(2);
        expect(manager.diagnostics.map((d) => d.message)).eqls(["w"]);
    });

    it("keeps a diagnostic also added for good", () => {
        const manager = new DiagnosticsManager({ preliminaryDiagnostics: [] });
        manager.setConditionDiagnostics(1, "c", [info("a")]);
        manager.addDiagnostic(info("a"));
        manager.setConditionDiagnostics(1, "c", []);
        expect(manager.diagnostics.map((d) => d.message)).eqls(["a"]);
    });

    it("decides a watched condition again on refresh, until it says there is nothing to decide", async () => {
        const manager = new DiagnosticsManager({ preliminaryDiagnostics: [] });
        let state: "holds" | "ends" | "gone" = "holds";
        await manager.watchCondition(1, "w", async () =>
            state === "gone" ? null : state === "holds" ? [info("w")] : [],
        );
        expect(manager.diagnostics.map((d) => d.message)).eqls(["w"]);

        state = "ends";
        await manager.refreshWatchedConditions();
        expect(manager.diagnostics).eqls([]);

        state = "holds";
        await manager.refreshWatchedConditions();
        expect(manager.diagnostics.map((d) => d.message)).eqls(["w"]);

        state = "gone";
        await manager.refreshWatchedConditions();
        expect(manager.diagnostics).eqls([]);
        expect(manager._watchedConditions.size).eq(0);
    });
});
