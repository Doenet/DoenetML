import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import { getDiagnosticsByType } from "../utils/diagnostics";
import {
    updateBooleanInputValue,
    updateMathInputValue,
} from "../utils/actions";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

/**
 * DIAG-7 (D38): an error is decided when the document loads, from the
 * DoenetML alone, so no error appears while a reader works. Each document
 * below has content that is made only after an interaction (a case that is
 * not true yet, an iteration of a repeat whose length starts at 0), with an
 * error in it that follows from what the author wrote. The error is reported
 * when the document loads, and is the same, once, after the content is made.
 */
const before = `<booleanInput name="b"/><mathInput name="n" prefill="0"/><math name="mm">y</math>`;
const inCase = (content: string) =>
    `<conditionalContent name="cc"><case condition="$b">${content}</case></conditionalContent>`;
const inRepeat = (content: string) =>
    `<repeatForSequence name="r" length="$n" valueName="v">${content}</repeatForSequence>`;

const documents: [string, string, string[]][] = [
    // a name in a case with no else, as a tag it can't be
    [
        "a name in a case, as a tag of another type",
        `${inCase(`<math name="m">x</math>`)}<p extend="$m"/>`,
        ["doenet-e0065"],
    ],
    [
        "a name after the conditionalContent, as a tag of another type",
        `${inCase(`<math name="m">x</math>`)}<p extend="$cc.m"/>`,
        ["doenet-e0065"],
    ],
    [
        "a point in a case, as a text",
        `${inCase(`<point name="P">(1,2)</point>`)}<text extend="$P"/>`,
        ["doenet-e0065"],
    ],
    [
        "a math in a case, as an input",
        `${inCase(`<math name="m">x</math>`)}<mathInput extend="$m"/>`,
        ["doenet-e0062"],
    ],
    // a name in an iteration not made yet
    [
        "a name in an iteration, as a tag of another type",
        `${inRepeat(`<math name="m">$v</math>`)}<p extend="$r[1].m"/>`,
        ["doenet-e0065"],
    ],
    [
        "a paragraph in an iteration, as a math",
        `${inRepeat(`<p name="q">$v</p>`)}<math extend="$r[1].q"/>`,
        ["doenet-e0063"],
    ],
    // a tag in content made later
    [
        "a tag in a case, of a component outside it",
        inCase(`<p extend="$mm"/>`),
        ["doenet-e0065"],
    ],
    [
        "a tag in a repeat, of a component outside it",
        inRepeat(`<p extend="$mm"/>`),
        ["doenet-e0065"],
    ],
    [
        "a tag in a repeat, of its value",
        inRepeat(`<p extend="$v"/>`),
        ["doenet-e0065"],
    ],
    [
        "a tag in a case, of a group of two",
        inCase(
            `<group name="gg"><math>1</math><math>2</math></group><math extend="$gg"/>`,
        ),
        ["doenet-e0064"],
    ],
    [
        "a list tag in a repeat, of a group of two types",
        inRepeat(`<mathList extend="$gg"/>`) +
            `<group name="gg"><math>1</math><text>a</text></group>`,
        ["doenet-e0066"],
    ],
    [
        "a tag in a case, of the conditionalContent holding it",
        inCase(`<math extend="$cc"/>`),
        ["doenet-e0005"],
    ],
    // a bare reference to a name of different types in the branches
    [
        "a bare reference in a case, to a name of different types",
        `<conditionalContent><case condition="$b"><math name="x">1</math></case><else><text name="x">t</text></else></conditionalContent>${inCase(`$x`)}`,
        ["doenet-w0184"],
    ],
    // a tag that does not exist
    ["an unknown tag in a case", inCase(`<bogus/>`), ["doenet-e0002"]],
    ["an unknown tag in a repeat", inRepeat(`<bogus/>`), ["doenet-e0002"]],
    // an extend that would change what its source makes (D32)
    [
        "an extend in a case that changes a sequence's content",
        `<sequence name="s" from="1" to="3"/>${inCase(`<sequence extend="$s" to="5"/>`)}`,
        ["doenet-e0056"],
    ],
    [
        "an extend in a repeat that adds a repeat's template",
        `<repeat name="rr" for="1 2" valueName="w"><text>$w</text></repeat>${inRepeat(`<repeat extend="$rr"><text>z</text></repeat>`)}`,
        ["doenet-e0057"],
    ],
    [
        "an extend in a case of a case",
        `<conditionalContent><case name="c1" condition="true"><text>a</text></case></conditionalContent>${inCase(`<case extend="$c1"/>`)}`,
        ["doenet-e0061"],
    ],
    [
        "an extend in a case of a choiceInput that shuffles it",
        `<choiceInput name="ci"><choice>a</choice><choice>b</choice></choiceInput>${inCase(`<choiceInput extend="$ci" shuffleOrder/>`)}`,
        ["doenet-e0059"],
    ],
    [
        "an extend in a case of a module that sets one of its attributes",
        `<module name="mod"><moduleAttributes><text name="title">t</text></moduleAttributes><p>$title</p></module>${inCase(`<module extend="$mod" title="u"/>`)}`,
        ["doenet-e0060"],
    ],
    [
        "an extend in a case of a sequence named in an iteration",
        `<repeat name="rs" for="1 2" valueName="w"><sequence name="s" from="1" to="$w"/></repeat>${inCase(`<sequence extend="$rs[1].s" to="5"/>`)}`,
        ["doenet-e0056"],
    ],
    // a scalar tag of a list whose entries are written
    [
        "a tag in a case, of a list of two written entries",
        `<mathList name="ml">1 2</mathList>${inCase(`<math extend="$ml"/>`)}`,
        ["doenet-e0064"],
    ],
    [
        "a tag in a repeat, of a list with no entries",
        `<numberList name="nl"/>${inRepeat(`<number extend="$nl"/>`)}`,
        ["doenet-e0064"],
    ],
    // a choice its literals decide
    [
        "a select in a case with more to select than options",
        inCase(`<select numToSelect="3"><option>a</option></select>`),
        ["doenet-e0035"],
    ],
    [
        "a select in a repeat with more to select than options",
        inRepeat(
            `<select numToSelect="2" withReplacement="false"><option>a</option></select>`,
        ),
        ["doenet-e0035"],
    ],
    [
        "a select in a case with a numToSelect that rounds to more than its options",
        inCase(`<select numToSelect="2.5"><option>a</option></select>`),
        ["doenet-e0035"],
    ],
    [
        "a select in a case with withReplacement written empty, which is false",
        inCase(
            `<select numToSelect="3" withReplacement=""><option>a</option></select>`,
        ),
        ["doenet-e0035"],
    ],
    // what is decided at load is what the content gives when it is made
    [
        "a tag in a case, of a list whose maxNumber keeps two of its entries",
        `<numberList name="nl" maxNumber="2.5">1 2 3</numberList>${inCase(`<number extend="$nl"/>`)}`,
        ["doenet-e0064"],
    ],
    [
        "a tag in a case, of a list whose maxNumber keeps one of its entries",
        `<numberList name="nl" maxNumber="1.5">1 2</numberList>${inCase(`<number extend="$nl"/>`)}`,
        [],
    ],
    [
        "a group in a case, of a repeat, with a child",
        `<repeat name="rr" for="1 2" valueName="w"><text>$w</text></repeat>${inCase(`<group extend="$rr"><text>z</text></group>`)}`,
        [],
    ],
];

describe("Errors are decided when the document loads (DIAG-7) @group4", () => {
    for (const [label, body, codes] of documents) {
        it(label, async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `${before}${body}`,
            });
            const errorCodes = () =>
                getDiagnosticsByType(core).errors.map((e) => e.code);

            await core.returnAllStateVariables(false, true);
            expect(errorCodes(), "at load").eqls(codes);

            // what is made after an interaction gives no new error
            await updateBooleanInputValue({
                boolean: true,
                componentIdx: await resolvePathToNodeIdx("b"),
                core,
            });
            await updateMathInputValue({
                latex: "2",
                componentIdx: await resolvePathToNodeIdx("n"),
                core,
            });
            await core.returnAllStateVariables(false, true);
            expect(errorCodes(), "after").eqls(codes);
        });
    }
});

describe("A tag in what it is of @group4", () => {
    it("is made from what a group holds when it is in the group's setup", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `<group name="g"><setup><math extend="$g" name="z"/></setup><math>1</math></group><p name="out">$z</p>`,
        });
        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(getDiagnosticsByType(core).errors).eqls([]);
        expect(
            stateVariables[await resolvePathToNodeIdx("out")].stateValues.text,
        ).eq("1");
    });
});
