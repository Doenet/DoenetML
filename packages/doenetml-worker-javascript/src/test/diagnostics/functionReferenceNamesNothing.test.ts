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
 * the plain reference's does: nothing in text, `＿` in a `<math>`. A function
 * reference in an attribute is reported the same way. In the parenthesized form
 * `$$(f)(2)`, the parentheses are not part of the quoted reference (`$$f(2)`),
 * as they are not for a plain reference, but the warning is marked at all of
 * it.
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
                text: "[]",
                code: "doenet-w0104",
                reference: "$$f(2)",
                message: "No referent found for reference: `$$f(2)`",
            },
            {
                doenetML: `${twoFs}<p name="p">[$$f(2)]</p>`,
                text: "[]",
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
                text: "[]",
                code: "doenet-w0104",
                reference: "$$f(2)",
                message: "No referent found for reference: `$$f(2)`",
                marked: "$$(f)(2)",
            },
            {
                doenetML: `${twoFs}<p name="p">[$$(f)(2)]</p>`,
                text: "[]",
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
                text: "[]",
                code: "doenet-w0104",
                reference: "$$f[$(i)](2)",
                message: "No referent found for reference: `$$f[$(i)](2)`",
                marked: "$$(f[$(i)])(2)",
            },
            {
                doenetML: `${twoFs}<p name="p">[$(f)]</p>`,
                text: "[]",
                code: "doenet-w0105",
                reference: "$f",
                message: "Multiple referents found for reference: `$f`",
                marked: "$(f)",
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
                text: "[]",
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
});
