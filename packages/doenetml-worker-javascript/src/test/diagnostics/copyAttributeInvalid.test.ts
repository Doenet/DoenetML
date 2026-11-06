import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import { getDiagnosticsByType } from "../utils/diagnostics";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

/**
 * An attribute a component does not have, written on it with `copy`,
 * `copyWithState` or `extend`, is a warning, `doenet-w0187`, marked at the
 * attribute (#2332, DIAG-1: an attribute that is ignored). The component is
 * still shown, as what it copies. It is the same for every kind of
 * component, a list included. Written on the component without `copy` or
 * `extend`, the same attribute is still an error (`doenet-e0004`).
 */
async function shownAndReported(doenetML: string) {
    const { core, resolvePathToNodeIdx } = await createTestCore({
        doenetML,
    });
    const stateVariables = await core.returnAllStateVariables(false, true);
    const text =
        stateVariables[await resolvePathToNodeIdx("p")].stateValues.text;
    const { warnings, errors, infos } = getDiagnosticsByType(core);
    return { text, warnings, errors, infos };
}

describe("An attribute a copy or extend does not have @group4", async () => {
    it("is a warning, the same for every kind of component", async () => {
        const cases: {
            doenetML: string;
            text: string;
            componentType: string;
            attribute?: string;
        }[] = [
            {
                doenetML: `<math name="m">x</math><math name="a" extend="$m" blink="true"/><p name="p">$a</p>`,
                text: "x",
                componentType: "math",
            },
            {
                doenetML: `<math name="m">x</math><math name="a" copy="$m" blink="true"/><p name="p">$a</p>`,
                text: "x",
                componentType: "math",
            },
            {
                doenetML: `<math name="m">x</math><math name="a" copyWithState="$m" blink="true"/><p name="p">$a</p>`,
                text: "x",
                componentType: "math",
            },
            {
                doenetML: `<point name="P">(1,2)</point><point name="a" extend="$P" blink="true"/><p name="p">$a</p>`,
                text: "(1, 2)",
                componentType: "point",
            },
            {
                // a property
                doenetML: `<point name="P">(1,2)</point><math name="a" extend="$P.x" blink="true"/><p name="p">$a</p>`,
                text: "1",
                componentType: "math",
            },
            {
                doenetML: `<section name="s"><title>hi</title></section><section name="a" extend="$s" blink="true"/><p name="p">$a.title</p>`,
                text: "hi",
                componentType: "section",
            },
            {
                doenetML: `<group name="g"><text>hi</text></group><p name="p"><group extend="$g" blink="true"/></p>`,
                text: "hi",
                componentType: "group",
            },
            {
                // a list, which keeps the attributes on the list itself
                doenetML: `<mathList name="ml">x y</mathList><mathList name="a" extend="$ml" blink="true"/><p name="p">$a</p>`,
                text: "x, y",
                componentType: "mathList",
            },
            {
                doenetML: `<mathList name="ml">x y</mathList><mathList name="a" copy="$ml" blink="true"/><p name="p">$a</p>`,
                text: "x, y",
                componentType: "mathList",
            },
            {
                // a v0.6 idiom: `link` is not an attribute (#2329)
                doenetML: `<point name="P">(1,2)</point><point name="a" extend="$P" link="false"/><p name="p">$a</p>`,
                text: "(1, 2)",
                componentType: "point",
                attribute: "link",
            },
            {
                // in the case the author wrote it
                doenetML: `<math name="m">x</math><math name="a" extend="$m" Blink="true"/><p name="p">$a</p>`,
                text: "x",
                componentType: "math",
                attribute: "Blink",
            },
        ];

        for (const {
            doenetML,
            text,
            componentType,
            attribute = "blink",
        } of cases) {
            const shown = await shownAndReported(doenetML);
            expect(shown.text, doenetML).eq(text);
            expect(shown.errors, doenetML).eqls([]);
            expect(shown.infos, doenetML).eqls([]);
            expect(shown.warnings.length, doenetML).eq(1);
            const [warning] = shown.warnings;
            expect(warning.code, doenetML).eq("doenet-w0187");
            expect(warning.args, doenetML).eqls({ attribute, componentType });
            expect(warning.message, doenetML).eq(
                `The \`${attribute}\` attribute is ignored: a \`<${componentType}>\` has no such attribute.`,
            );
            const { start, end } = warning.position!;
            expect(doenetML.substring(start.offset!, end.offset!), doenetML).eq(
                `${attribute}="${attribute === "link" ? "false" : "true"}"`,
            );
        }
    });

    it("an attribute the component or the copy has is not reported", async () => {
        for (const doenetML of [
            `<math name="m">x+x</math><math name="a" extend="$m" simplify="full"/><p name="p">$a</p>`,
            `<math name="m">x+x</math><math name="a" copy="$m" SIMPLIFY="full"/><p name="p">$a</p>`,
            `<mathList name="ml">x y</mathList><mathList name="a" extend="$ml" asList="false"/><p name="p">$a</p>`,
            `<math name="m">x</math><math name="a" extend="$m" hide/><p name="p">$a</p>`,
        ]) {
            const shown = await shownAndReported(doenetML);
            expect(shown.errors, doenetML).eqls([]);
            expect(shown.warnings, doenetML).eqls([]);
            expect(shown.infos, doenetML).eqls([]);
        }
    });

    it("on a component without copy or extend, it is still an error", async () => {
        const { errors, warnings } = await shownAndReported(
            `<math name="a" blink="true">x</math><p name="p">$a</p>`,
        );
        expect(warnings).eqls([]);
        expect(errors.length).eq(1);
        expect(errors[0].code).eq("doenet-e0004");
    });

    it("a module's extend reports what it ignores itself", async () => {
        const { errors, warnings } = await shownAndReported(
            `<module name="mo"><p>hi</p></module><module name="a" extend="$mo" blink="true"/><p name="p">x</p>`,
        );
        expect(errors).eqls([]);
        expect(warnings.map((w: any) => w.code)).eqls(["doenet-w0168"]);
    });
});
