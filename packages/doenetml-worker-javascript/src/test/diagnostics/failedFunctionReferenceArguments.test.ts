import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import { getDiagnosticsByType } from "../utils/diagnostics";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

/**
 * The arguments of a function reference that names nothing (`$$f(…)` with no
 * `f`) are made as if written in a `<setup>` at the reference's place (D40,
 * NAME-4, #2489): they are not shown, but a component named in them is made,
 * and its name names it, as a name in a `<setup>` does.
 */
async function shownAndReported(doenetML: string, names = ["p"]) {
    const { core, resolvePathToNodeIdx } = await createTestCore({ doenetML });
    const stateVariables = await core.returnAllStateVariables(false, true);
    const texts: string[] = [];
    for (const name of names) {
        texts.push(
            stateVariables[await resolvePathToNodeIdx(name)].stateValues.text,
        );
    }
    const { warnings, errors, infos } = getDiagnosticsByType(core);
    return { texts, warnings, errors, infos };
}

describe("The arguments of a function reference that names nothing @group4", async () => {
    it("makes a component named in them, which its name names", async () => {
        const { texts, warnings, errors, infos } = await shownAndReported(
            `<p name="p">[$$f(<math name="m">x</math>)] [$m]</p>`,
        );
        // The function reference is a blank, and its arguments are not shown
        expect(texts).eqls(["[＿] [x]"]);
        expect(warnings.map((w) => [w.code, w.args.reference])).eqls([
            ["doenet-w0104", '$$f(<math name="m">x</math>)'],
        ]);
        expect([...errors, ...infos]).eqls([]);
    });

    it("reaches a component named in them through an enclosing name, and an extend of it", async () => {
        const { texts, warnings } = await shownAndReported(
            `<section name="g"><p name="p">[$$f(<math name="m">x</math>)] [$g.m] [<math extend="$m"/>]</p></section>`,
        );
        expect(texts).eqls(["[＿] [x] [x]"]);
        expect(warnings.map((w) => w.code)).eqls(["doenet-w0104"]);
    });

    it("declares a name in them where the reference is, as a setup there would", async () => {
        // Beside the arguments, the name in them is found before one further
        // out. From outside, both are found, which is ambiguous, as for a name
        // written in a `<setup>` there.
        const outer = await shownAndReported(
            `<math name="m">y</math><p name="p">[$$f(<math name="m">x</math>)] [$m]</p><p name="q">[$m]</p>`,
            ["p", "q"],
        );
        const outerSetup = await shownAndReported(
            `<math name="m">y</math><p name="p">[<setup><math name="m">x</math></setup>] [$m]</p><p name="q">[$m]</p>`,
            ["p", "q"],
        );
        expect(outer.texts).eqls(["[＿] [x]", "[＿]"]);
        expect(outerSetup.texts).eqls(["[] [x]", "[＿]"]);
        expect(outer.warnings.map((w) => [w.code, w.args.reference])).eqls([
            ["doenet-w0104", '$$f(<math name="m">x</math>)'],
            ["doenet-w0105", "$m"],
        ]);
        expect(outerSetup.warnings.map((w) => [w.code, w.args.reference])).eqls(
            [["doenet-w0105", "$m"]],
        );
        // The same name as another in the same scope is ambiguous, as for a
        // name written in a `<setup>` beside it
        const ambiguous = await shownAndReported(
            `<p name="p"><math name="m">y</math>[$$f(<math name="m">x</math>)] [$m]</p>`,
        );
        const setup = await shownAndReported(
            `<p name="p"><math name="m">y</math>[<setup><math name="m">x</math></setup>] [$m]</p>`,
        );
        expect(ambiguous.texts[0]).eq(setup.texts[0].replace("[]", "[＿]"));
        expect(ambiguous.warnings.map((w) => w.code)).toContain("doenet-w0105");
        expect(setup.warnings.map((w) => w.code)).toContain("doenet-w0105");
    });

    it("reports a reference in them that names nothing, with the function reference", async () => {
        const { texts, warnings } = await shownAndReported(
            `<p name="p">[$$f($a, 2)]</p>`,
        );
        expect(texts).eqls(["[＿]"]);
        expect(warnings.map((w) => [w.code, w.args.reference])).eqls([
            ["doenet-w0104", "$$f($a, 2)"],
            ["doenet-w0104", "$a"],
        ]);
    });

    it("makes what is named in the arguments of nested function references that name nothing", async () => {
        const { texts, warnings } = await shownAndReported(
            `<p name="p">[$$g($$f(<math name="m">x</math>))] [$m]</p>`,
        );
        expect(texts).eqls(["[＿] [x]"]);
        expect(warnings.map((w) => w.code)).eqls([
            "doenet-w0104",
            "doenet-w0104",
        ]);
    });
});
