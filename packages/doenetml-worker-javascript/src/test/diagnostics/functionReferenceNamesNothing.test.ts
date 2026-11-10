import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import { getDiagnosticsByType } from "../utils/diagnostics";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

/**
 * A function reference whose name names nothing, or more than one thing
 * (#2419), is reported as the same failure of a plain reference is:
 * `doenet-w0104` or `doenet-w0105`, quoting the whole function reference as
 * written, arguments included, and marked there. The missing value shows as
 * the plain reference's does: `＿`, in text as in a `<math>`. A function
 * reference in an attribute is reported the same way. In the parenthesized form
 * `$$(f)(2)`, the parentheses are not part of the quoted reference (`$$f(2)`),
 * as they are not for a plain reference, but the warning is marked at all of
 * it.
 *
 * The arguments are quoted after an index too (`$$f[2](2)`), whichever warning
 * the index gives, and a reference in the arguments of a function reference
 * that names nothing is resolved, and reported when it fails, at the same time
 * (#2434). The arguments are made as if written in a `<setup>` where the
 * function reference is, so a name in them names what is made (D40, #2489).
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

const twoFs = `<group><function name="f">x</function><function name="f">x^2</function></group>`;

describe("A function reference that names nothing @group4", async () => {
    it("is coded and quotes the whole function reference", async () => {
        const cases: {
            doenetML: string;
            text: string;
            code: string;
            reference: string;
            message: string;
            /** Where the warning is marked, if not at `reference`. */
            marked?: string;
        }[] = [
            {
                doenetML: `<p name="p">[$$f(2)]</p>`,
                text: "[＿]",
                code: "doenet-w0104",
                reference: "$$f(2)",
                message: "No referent found for reference: `$$f(2)`",
            },
            {
                doenetML: `${twoFs}<p name="p">[$$f(2)]</p>`,
                text: "[＿]",
                code: "doenet-w0105",
                reference: "$$f(2)",
                message: "Multiple referents found for reference: `$$f(2)`",
            },
            {
                doenetML: `<p name="p"><math>$$f(2)+1</math></p>`,
                text: "＿ + 1",
                code: "doenet-w0104",
                reference: "$$f(2)",
                message: "No referent found for reference: `$$f(2)`",
            },
            {
                doenetML: `<p name="p"><math>$f+1</math></p>`,
                text: "＿ + 1",
                code: "doenet-w0104",
                reference: "$f",
                message: "No referent found for reference: `$f`",
            },
            {
                doenetML: `<p name="p">[$$(f)(2)]</p>`,
                text: "[＿]",
                code: "doenet-w0104",
                reference: "$$f(2)",
                message: "No referent found for reference: `$$f(2)`",
                marked: "$$(f)(2)",
            },
            {
                doenetML: `${twoFs}<p name="p">[$$(f)(2)]</p>`,
                text: "[＿]",
                code: "doenet-w0105",
                reference: "$$f(2)",
                message: "Multiple referents found for reference: `$$f(2)`",
                marked: "$$(f)(2)",
            },
            {
                doenetML: `<p name="p"><math>$$(f)(2)+1</math></p>`,
                text: "＿ + 1",
                code: "doenet-w0104",
                reference: "$$f(2)",
                message: "No referent found for reference: `$$f(2)`",
                marked: "$$(f)(2)",
            },
            {
                doenetML: `<number name="i">1</number><p name="p">[$$(f[$(i)])(2)]</p>`,
                text: "[＿]",
                code: "doenet-w0104",
                reference: "$$f[$(i)](2)",
                message: "No referent found for reference: `$$f[$(i)](2)`",
                marked: "$$(f[$(i)])(2)",
            },
            {
                doenetML: `${twoFs}<p name="p">[$(f)]</p>`,
                text: "[＿]",
                code: "doenet-w0105",
                reference: "$f",
                message: "Multiple referents found for reference: `$f`",
                marked: "$(f)",
            },
            {
                // A parenthesis in an index is not the one closing the path.
                doenetML: `${twoFs}<p name="p">[$(f[)])]</p>`,
                text: "[＿]",
                code: "doenet-w0105",
                reference: "$f[)]",
                message: "Multiple referents found for reference: `$f[)]`",
                marked: "$(f[)])",
            },
            {
                doenetML: `${twoFs}<p name="p">[$$(f)((x), 3)]</p>`,
                text: "[＿]",
                code: "doenet-w0105",
                reference: "$$f((x), 3)",
                message:
                    "Multiple referents found for reference: `$$f((x), 3)`",
                marked: "$$(f)((x), 3)",
            },
            {
                doenetML: `<point name="P" x="$$f(2)" y="3" /><p name="p">$P</p>`,
                text: "(＿, 3)",
                code: "doenet-w0104",
                reference: "$$f(2)",
                message: "No referent found for reference: `$$f(2)`",
            },
            {
                doenetML: `<p name="p">[$$f(2, 3)]</p>`,
                text: "[＿]",
                code: "doenet-w0104",
                reference: "$$f(2, 3)",
                message: "No referent found for reference: `$$f(2, 3)`",
            },
        ];

        for (const {
            doenetML,
            text,
            code,
            reference,
            message,
            marked = reference,
        } of cases) {
            const shown = await shownAndReported(doenetML);
            expect(shown.text, doenetML).eq(text);
            expect(shown.errors, doenetML).eqls([]);
            expect(shown.infos, doenetML).eqls([]);
            expect(shown.warnings.length, doenetML).eq(1);
            const [warning] = shown.warnings;
            expect(warning.code, doenetML).eq(code);
            expect(warning.args, doenetML).eqls({ reference });
            expect(warning.message, doenetML).eq(message);
            const { start, end } = warning.position!;
            expect(doenetML.substring(start.offset!, end.offset!), doenetML).eq(
                marked,
            );
        }
    });

    it("quotes the arguments after an index (#2434)", async () => {
        const groupF = `<group name="f"><function>x^2</function></group>`;
        const cases: {
            doenetML: string;
            text: string;
            code: string;
            args: { reference: string; [arg: string]: unknown };
            marked: string;
        }[] = [
            {
                doenetML: `<function name="f">x^2</function><p name="p">[$$f[2](2)]</p>`,
                text: "[＿]",
                code: "doenet-w0180",
                args: { reference: "$$f[2](2)", component: "function" },
                marked: "$$f[2](2)",
            },
            {
                doenetML: `<function name="f">x^2</function><p name="p"><math>$$f[2](2)+1</math></p>`,
                text: "＿ + 1",
                code: "doenet-w0180",
                args: { reference: "$$f[2](2)", component: "function" },
                marked: "$$f[2](2)",
            },
            {
                doenetML: `<function name="f">x^2</function><p name="p">[$$(f[2])((x), 3)]</p>`,
                text: "[＿]",
                code: "doenet-w0180",
                args: { reference: "$$f[2]((x), 3)", component: "function" },
                marked: "$$(f[2])((x), 3)",
            },
            {
                // an index past the one child of a group names nothing, as
                // any index after a group does (D27)
                doenetML: `${groupF}<p name="p">[$$f[2](2)]</p>`,
                text: "[＿]",
                code: "doenet-w0188",
                args: {
                    reference: "$$f[2](2)",
                    suggestion: "$$f.x(2)",
                    child: "none",
                    container: "group",
                    component: "group",
                },
                marked: "$$f[2](2)",
            },
            {
                // an index never selects the child of a group (D27)
                doenetML: `${groupF}<p name="p">[$$f[1](2)]</p>`,
                text: "[＿]",
                code: "doenet-w0188",
                args: {
                    reference: "$$f[1](2)",
                    suggestion: "$$f.x(2)",
                    child: "unnamed",
                    container: "group",
                    component: "group",
                },
                marked: "$$f[1](2)",
            },
            {
                // an index past the iterations of a repeat
                doenetML: `<repeat name="r" for="1 2" valueName="v"><function>x^$v</function></repeat><p name="p">[$$r[3](2)]</p>`,
                text: "[＿]",
                code: "doenet-w0181",
                args: {
                    reference: "$$r[3](2)",
                    component: "repeat",
                    kind: "iteration",
                    count: 2,
                },
                marked: "$$r[3](2)",
            },
        ];

        for (const { doenetML, text, code, args, marked } of cases) {
            const shown = await shownAndReported(doenetML);
            expect(shown.text, doenetML).eq(text);
            expect(shown.errors, doenetML).eqls([]);
            expect(shown.infos, doenetML).eqls([]);
            expect(shown.warnings.length, doenetML).eq(1);
            const [warning] = shown.warnings;
            expect(warning.code, doenetML).eq(code);
            expect(warning.args, doenetML).eqls(args);
            expect(warning.message, doenetML).contain(
                "`" + args.reference + "`",
            );
            const { start, end } = warning.position!;
            expect(doenetML.substring(start.offset!, end.offset!), doenetML).eq(
                marked,
            );
        }
    });

    it("still reports a reference in its arguments (#2434)", async () => {
        const cases: {
            doenetML: string;
            text: string;
            /** Each reference reported, `w0104`, quoted and marked as written. */
            references: string[];
        }[] = [
            {
                doenetML: `<p name="p">[$$f($a)]</p>`,
                text: "[＿]",
                references: ["$$f($a)", "$a"],
            },
            {
                doenetML: `<p name="p"><math>$$f($a)+1</math></p>`,
                text: "＿ + 1",
                references: ["$$f($a)", "$a"],
            },
            {
                doenetML: `<p name="p">[$$f($a, $$g($b))]</p>`,
                text: "[＿]",
                references: ["$$f($a, $$g($b))", "$a", "$$g($b)", "$b"],
            },
            {
                doenetML: `<p name="p">[$$f(<math>$a+1</math>)]</p>`,
                text: "[＿]",
                references: ["$$f(<math>$a+1</math>)", "$a"],
            },
            {
                // a reference in the arguments that resolves is not reported
                doenetML: `<number name="a">2</number><p name="p">[$$f($a)]</p>`,
                text: "[＿]",
                references: ["$$f($a)"],
            },
            {
                doenetML: `<point name="P" x="$$f($a)" y="3" /><p name="p">$P</p>`,
                text: "(＿, 3)",
                references: ["$$f($a)", "$a"],
            },
            {
                // the arguments are made as if in a `<setup>` where the
                // function reference is (D40, #2489), so a name in them names
                // what is made
                doenetML: `<p name="p">[$$f(<math name="m">2</math>)] [$m] [<math extend="$m"/>]</p>`,
                text: "[＿] [2] [2]",
                references: [`$$f(<math name="m">2</math>)`],
            },
            {
                doenetML: `<p name="p">[$$f(<group name="g"><math name="m">2</math></group>)] [$g] [$g.m]</p>`,
                text: "[＿] [2] [2]",
                references: [
                    `$$f(<group name="g"><math name="m">2</math></group>)`,
                ],
            },
            {
                // a name in the branches of a container there too
                doenetML: `<p name="p">[$$f(<conditionalContent><case condition="true"><math name="m">2</math></case></conditionalContent>)] [$m]</p>`,
                text: "[＿] [2]",
                references: [
                    `$$f(<conditionalContent><case condition="true"><math name="m">2</math></case></conditionalContent>)`,
                ],
            },
        ];

        for (const { doenetML, text, references } of cases) {
            const shown = await shownAndReported(doenetML);
            expect(shown.text, doenetML).eq(text);
            expect(shown.errors, doenetML).eqls([]);
            expect(shown.infos, doenetML).eqls([]);
            expect(
                shown.warnings.map((warning: any) => [
                    warning.code,
                    warning.args.reference,
                    doenetML.substring(
                        warning.position.start.offset,
                        warning.position.end.offset,
                    ),
                ]),
                doenetML,
            ).eqls(
                references.map((reference) => [
                    "doenet-w0104",
                    reference,
                    reference,
                ]),
            );
        }
    });
});
