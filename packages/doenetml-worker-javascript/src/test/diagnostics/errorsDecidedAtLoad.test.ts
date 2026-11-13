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
        "an extend in a repeat, written as a math, of an option",
        `<select><option name="o"><text>a</text></option></select>${inRepeat(`<math extend="$o"/>`)}`,
        ["doenet-e0061"],
    ],
    [
        "an extend in a case of a choiceInput that shuffles it",
        `<choiceInput name="ci"><choice>a</choice><choice>b</choice></choiceInput>${inCase(`<choiceInput extend="$ci" shuffleOrder/>`)}`,
        ["doenet-e0059"],
    ],
    [
        "an extend in a case of a choiceInput that adds a choice",
        `<choiceInput name="ci"><choice>a</choice><choice>b</choice></choiceInput>${inCase(`<choiceInput extend="$ci"><choice>c</choice></choiceInput>`)}`,
        ["doenet-e0058"],
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
    [
        "a group in a case, of a repeat, with a child, made from what the repeat makes",
        `<repeat name="rr" for="1 2" valueName="w"><text>$w</text></repeat>${inCase(`<group extend="$rr"><text>z</text></group>`)}`,
        [],
    ],
    // a select whose literals keep it from selecting
    [
        "a select in a case with more to select than options",
        inCase(`<select numToSelect="3"><option>a</option></select>`),
        ["doenet-e0035"],
    ],
    [
        "a select in a repeat with more to select than options, without replacement",
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
        "a select in a case with withReplacement written as False",
        inCase(
            `<select numToSelect="3" withReplacement="False"><option>a</option></select>`,
        ),
        ["doenet-e0035"],
    ],
    [
        "a select in a case with an option and an extend of it, which is no option",
        inCase(
            `<select numToSelect="2"><option name="o1">a</option><option extend="$o1"/></select>`,
        ),
        ["doenet-e0061", "doenet-e0035"],
    ],
    // what is decided at load is what the content gives when it is made
    [
        "a select in a case with no options, which selects nothing",
        inCase(`<select numToSelect="2"/><select></select>`),
        [],
    ],
    [
        "a select in a case with withReplacement written as an expression, which is true",
        inCase(
            `<select numToSelect="3" withReplacement="1"><option>a</option></select><select numToSelect="3" withReplacement="1>0"><option>a</option></select>`,
        ),
        [],
    ],
    [
        "a select in a case with an option written as an extend, which is no option",
        `<option name="o">q</option>${inCase(`<select numToSelect="3"><option extend="$o"/></select>`)}`,
        ["doenet-e0061"],
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
    [
        "a tag in a case, of a list of entries separated by commas",
        `<mathList name="ml">x + 1, y</mathList>${inCase(`<math extend="$ml"/>`)}`,
        ["doenet-e0064"],
    ],
    [
        "a tag in a repeat, of a list of texts with spaces, separated by commas",
        `<textList name="tl">a b, c</textList>${inRepeat(`<text extend="$tl"/>`)}`,
        ["doenet-e0064"],
    ],
    [
        "a tag in a case, of a list of points separated by a comma",
        `<pointList name="pl">(1,2), (3,4)</pointList>${inCase(`<point extend="$pl"/>`)}`,
        ["doenet-e0064"],
    ],
    [
        "a tag in a repeat, of a list of booleans, one an expression",
        `<booleanList name="bl">true x=x</booleanList>${inRepeat(`<boolean extend="$bl"/>`)}`,
        ["doenet-e0064"],
    ],
    [
        "a tag in a case, of a list of two numbers written as tags",
        `<numberList name="nl"><number>1</number><number>2</number></numberList>${inCase(`<number extend="$nl"/>`)}`,
        ["doenet-e0064"],
    ],
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
        "a tag in a case, of a list of one tuple, with commas in brackets",
        `<mathList name="ml">(1, 2)</mathList>${inCase(`<math extend="$ml"/>`)}`,
        [],
    ],
    [
        "a tag in a case, of a list with an entry in error",
        `<mathList name="ml">1 <bogus/></mathList>${inCase(`<math extend="$ml"/>`)}`,
        ["doenet-e0002"],
    ],
    [
        "a tag in a case, of a list with an error inside an entry",
        `<numberList name="nl"><number><bogus/></number><number>2</number></numberList>${inCase(`<number extend="$nl"/>`)}`,
        ["doenet-e0002"],
    ],
    // a module made from what is not one
    [
        "a module in a case, of a math",
        inCase(`<module extend="$mm"/>`),
        ["doenet-e0065"],
    ],
    [
        "a module in a repeat, of a group",
        `<group name="g"><text>a</text></group>${inRepeat(`<module extend="$g" name="mg"/>`)}`,
        ["doenet-e0065"],
    ],
    [
        "a module in a case, of a math holding an error",
        `<math name="me"><bogus/></math>${inCase(`<module extend="$me"/>`)}`,
        ["doenet-e0002"],
    ],
    [
        "a module in a case, of a module",
        `<module name="mod"><text>a</text></module>${inCase(`<module extend="$mod"/>`)}`,
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

/**
 * The same errors, in an option a `<select>` did not pick: its content is
 * never made, but the error is still reported, at load. Each document is
 * loaded with the content in the first option and in the second, so that
 * in one of the two it is not picked.
 */
const inOption = (content: string, first: boolean) => {
    const options = [
        `<option><text>other</text></option>`,
        `<option>${content}</option>`,
    ];
    return `<select>${(first ? options.reverse() : options).join("")}</select>`;
};

const inOptions: [string, string, string, string[]][] = [
    [
        "an extend that changes a sequence's content",
        `<sequence name="s" from="1" to="3"/>`,
        `<sequence extend="$s" to="5"/>`,
        ["doenet-e0056"],
    ],
    [
        "a select with more to select than options",
        "",
        `<select numToSelect="3"><option>a</option></select>`,
        ["doenet-e0035"],
    ],
    [
        "a tag of a list of two written entries",
        `<mathList name="ml">1, 2</mathList>`,
        `<math extend="$ml"/>`,
        ["doenet-e0064"],
    ],
    [
        "a module of a math",
        `<math name="m">x</math>`,
        `<module extend="$m"/>`,
        ["doenet-e0065"],
    ],
];

describe("Errors are decided when the document loads, in an option not picked (DIAG-7) @group4", () => {
    for (const [label, outside, content, codes] of inOptions) {
        it(label, async () => {
            for (const first of [true, false]) {
                const { core } = await createTestCore({
                    doenetML: `${outside}${inOption(content, first)}`,
                });
                await core.returnAllStateVariables(false, true);
                expect(
                    getDiagnosticsByType(core).errors.map((e) => e.code),
                    `first: ${first}`,
                ).eqls(codes);
            }
        });
    }
});

/**
 * What the DoenetML does not give exactly as a literal is not decided at
 * load, and is decided when the content is made, as it was: the same error
 * where the content is made at load. These are the inputs where a check at
 * load once disagreed with the run time (#2491).
 */
const leftToRunTime: [string, string, string[]][] = [
    [
        "a numToSelect written as an expression",
        `<select numToSelect="1+2"><option>a</option></select>`,
        ["doenet-e0035"],
    ],
    [
        "a withReplacement written empty, which is false",
        `<select numToSelect="3" withReplacement=""><option>a</option></select>`,
        ["doenet-e0035"],
    ],
    [
        "a list extending a list of two written entries",
        `<mathList name="ml">1 2</mathList><mathList name="ml2" extend="$ml"/><math extend="$ml2"/>`,
        ["doenet-e0064"],
    ],
    [
        "a list holding a list of two written entries",
        `<mathList name="ml">1 2</mathList><mathList name="ml2">$ml</mathList><math extend="$ml2"/>`,
        ["doenet-e0064"],
    ],
    [
        "a list extending a list that keeps one, with an entry added",
        `<mathList name="ml" maxNumber="1">1 2</mathList><mathList name="ml2" extend="$ml">3</mathList><math extend="$ml2"/>`,
        [],
    ],
    [
        "a list of maths, each of which may be a list",
        `<mathList name="ml"><math>1</math><math>2</math></mathList><math extend="$ml"/>`,
        ["doenet-e0064"],
    ],
    [
        "a list with a maxNumber written as an expression",
        `<mathList name="ml" maxNumber="1+1">1 2</mathList><math extend="$ml"/>`,
        ["doenet-e0064"],
    ],
    [
        "a module of a repeat, with an attribute of the repeat",
        `<repeat name="x" for="1 2" valueName="w"><text>$w</text></repeat><module extend="$x" for="3"/>`,
        ["doenet-e0065"],
    ],
    [
        "a module of a sequence, changing its content",
        `<sequence name="q" to="3"/><module extend="$q" to="5"/>`,
        ["doenet-e0056"],
    ],
];

describe("What is not a literal is decided when the content is made, as before @group4", () => {
    for (const [label, body, codes] of leftToRunTime) {
        it(label, async () => {
            const { core } = await createTestCore({ doenetML: body });
            await core.returnAllStateVariables(false, true);
            expect(getDiagnosticsByType(core).errors.map((e) => e.code)).eqls(
                codes,
            );
        });
    }
});

describe("How many entries a value makes a list hold (DIAG-2, DIAG-7) @group4", () => {
    async function setup(doenetML: string) {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML,
        });
        async function text(name: string) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            return stateVariables[await resolvePathToNodeIdx(name)].stateValues
                .text;
        }
        async function setN(latex: string) {
            await updateMathInputValue({
                latex,
                componentIdx: await resolvePathToNodeIdx("n"),
                core,
            });
        }
        function countDiagnostics() {
            return core.core!.diagnostics.filter(
                (d: any) => d.code === "doenet-e0064",
            );
        }
        return { core, resolvePathToNodeIdx, text, setN, countDiagnostics };
    }

    it("makes a tag of it missing, with an info, never an error", async () => {
        const { core, text, setN, countDiagnostics } = await setup(`
<mathInput name="n" prefill="1"/>
<mathList name="ml" maxNumber="$n">1 2</mathList>
<p name="p1"><math extend="$ml"/></p>
`);
        expect(await text("p1")).eq("1");
        expect(countDiagnostics()).eqls([]);

        await setN("2");
        expect(await text("p1")).eq("＿");
        expect(countDiagnostics().map((d: any) => [d.type, d.args.count])).eqls(
            [["info", 2]],
        );

        await setN("0");
        expect(await text("p1")).eq("＿");
        expect(countDiagnostics().map((d: any) => [d.type, d.args.count])).eqls(
            [["info", 0]],
        );

        await setN("1");
        expect(await text("p1")).eq("1");
        expect(countDiagnostics()).eqls([]);
        expect(getDiagnosticsByType(core).errors).eqls([]);
    });

    it("is an info at load, in content made later, and through an extend of the list", async () => {
        const { core, resolvePathToNodeIdx, text, countDiagnostics } =
            await setup(`
<booleanInput name="b"/>
<mathInput name="n" prefill="2"/>
<mathList name="ml" maxNumber="$n">1 2</mathList>
<mathList name="ml2" extend="$ml"/>
<p name="p1"><math extend="$ml"/></p>
<p name="p2"><math extend="$ml2"/></p>
<conditionalContent><case condition="$b"><p name="p3"><math extend="$ml"/></p></case></conditionalContent>
`);
        expect(await text("p1")).eq("＿");
        expect(await text("p2")).eq("＿");
        expect(countDiagnostics().map((d: any) => d.type)).eqls([
            "info",
            "info",
        ]);
        expect(getDiagnosticsByType(core).errors).eqls([]);

        await updateBooleanInputValue({
            boolean: true,
            componentIdx: await resolvePathToNodeIdx("b"),
            core,
        });
        expect(await text("p3")).eq("＿");
        expect(countDiagnostics().map((d: any) => d.type)).eqls([
            "info",
            "info",
            "info",
        ]);
        expect(getDiagnosticsByType(core).errors).eqls([]);
    });
});

describe("A select whose literals keep it from selecting (DIAG-7) @group4", () => {
    it("is reported at load, and takes the error from its mark when made, selecting nothing", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `<booleanInput name="b"/>${inCase(`<select name="s" numToSelect="3"><option><text>a</text></option></select>`)}`,
        });
        const errors = () =>
            getDiagnosticsByType(core).errors.map((e) => [
                e.code,
                e.message,
                e.position?.start.line,
                e.position?.start.column,
            ]);
        await core.returnAllStateVariables(false, true);
        const atLoad = errors();
        expect(atLoad).eqls([
            ["doenet-e0035", "Cannot select 3 components from only 1.", 1, 76],
        ]);

        await updateBooleanInputValue({
            boolean: true,
            componentIdx: await resolvePathToNodeIdx("b"),
            core,
        });
        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("s")].stateValues
                .selectedIndices,
        ).eqls([]);
        expect(errors()).eqls(atLoad);
    });

    it("is decided again for a copy that writes its own numToSelect", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `<select name="s" numToSelect="3"><option><text>a</text></option></select><select name="c" copy="$s" numToSelect="1"/>`,
        });
        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(getDiagnosticsByType(core).errors.map((e) => e.code)).eqls([
            "doenet-e0035",
        ]);
        expect(
            stateVariables[await resolvePathToNodeIdx("c")].stateValues
                .selectedIndices,
        ).eqls([1]);
    });
});

/**
 * SEL-8 (#2508 part 5, #2506): a warning about what the author wrote is
 * reported at load in every case, option and iteration template, picked or
 * not, at its line, as an error is. What a reference written there names,
 * and an attribute a copy can't take, are decided when the document loads.
 */
describe("Warnings decided at load, in content made later (SEL-8) @group4", () => {
    const warningsIn: [string, string, string, string][] = [
        [
            "a literal index that names nothing",
            `<mathList name="l">1 2</mathList>`,
            `<p>$l[0]</p>`,
            "doenet-w0104",
        ],
        ["a name that names nothing", "", `<p>$nothing</p>`, "doenet-w0104"],
        [
            "an attribute an extend can't take",
            `<math name="m1">1</math>`,
            `<text extend="$m1" bar="1"/>`,
            "doenet-w0187",
        ],
    ];
    for (const [label, outside, content, code] of warningsIn) {
        it(label, async () => {
            for (const [where, doenetML] of [
                ["a case", `${before}${outside}${inCase(content)}`],
                ["a repeat", `${before}${outside}${inRepeat(content)}`],
                ["an option", `${outside}${inOption(content, true)}`],
                ["an option", `${outside}${inOption(content, false)}`],
            ]) {
                const { core } = await createTestCore({ doenetML });
                await core.returnAllStateVariables(false, true);
                expect(
                    getDiagnosticsByType(core).warnings.map((w) => w.code),
                    where,
                ).eqls([code]);
            }
        });
    }

    it("a warning a component decides when it is made is not reported before (known gap)", async () => {
        // `w0027` is decided by the `<circle>` it is about, which is made
        // only when the case is shown; once shown it stays (#2506).
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `${before}${inCase(`<graph><circle through="(x,1) (2,3) (4,1)"/></graph>`)}`,
        });
        const warnings = () =>
            getDiagnosticsByType(core).warnings.map((w) => w.code);
        await core.returnAllStateVariables(false, true);
        expect(warnings()).eqls([]);
        for (const boolean of [true, false]) {
            await updateBooleanInputValue({
                boolean,
                componentIdx: await resolvePathToNodeIdx("b"),
                core,
            });
            await core.returnAllStateVariables(false, true);
            expect(warnings(), `shown: ${boolean}`).eqls(["doenet-w0027"]);
        }
    });
});
