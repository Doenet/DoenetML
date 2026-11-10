import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import { Dependency } from "../../core/dependencies/Dependency";
import { DependencyHandler } from "../../core/dependencies/DependencyHandler";
import { PASSED } from "../../core/dependencies/circularCheckMarks";
import { getDiagnosticsByType } from "../utils/diagnostics";
import { takeErrorsReportedAfterLoad } from "../utils/errorsAfterLoad";
import { INPUTS, PROPERTIES_READ } from "../../utils/dast/referenceCycles";
import {
    movePoint,
    updateBooleanInputValue,
    updateMathInputValue,
} from "../utils/actions";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

/**
 * Doenet/DoenetML#1665: an attribute written in terms of the values its own
 * component has yet to produce cannot be evaluated until the component is
 * expanded, and the component cannot be expanded until the attribute is
 * evaluated. Each case below exhausted the heap before #1665, and stopped
 * the document with "Circular dependency involving these components" after
 * it. The cycle is now decided when the document loads (#2473,
 * `utils/dast/referenceCycles.ts`): an index into a composite or a list of
 * values (`$a[1]`) reads what it is made from, its attributes, so the
 * reference in the attribute is an error, `doenet-e0005`, where it is
 * written, and the rest of the document renders (D14, DIAG-4, DIAG-5).
 *
 * The shapes are gathered here rather than spread over the component suites
 * because none of them is about the component: they all fail at the same step
 * of reference resolution.
 */
describe("Circular reference tests @group2", async () => {
    const selfReferentialAttributes: [string, string, string][] = [
        [
            "selectFromSequence exclude (the reported case)",
            `<selectFromSequence name="a" from="1" to="10" numToSelect="2" exclude="2$a[1]"/>`,
            "doenet-e0005 1:73-78",
        ],
        [
            "selectFromSequence from",
            `<selectFromSequence name="a" from="$a[1]" to="10" numToSelect="2"/>`,
            "doenet-e0005 1:36-41",
        ],
        [
            "selectFromSequence numToSelect",
            `<selectFromSequence name="a" from="1" to="10" numToSelect="$a[1]"/>`,
            "doenet-e0005 1:60-65",
        ],
        [
            "sequence step",
            `<sequence name="a" from="1" to="10" step="$a[1]"/>`,
            "doenet-e0005 1:43-48",
        ],
        [
            "sequence length",
            `<sequence name="a" from="1" length="$a[1]"/>`,
            "doenet-e0005 1:37-42",
        ],
        [
            "select numToSelect",
            `<select name="a" numToSelect="$a[1]"><option><math>1</math></option><option><math>2</math></option></select>`,
            "doenet-e0005 1:31-36",
        ],
        [
            "repeat for",
            `<repeat name="r" valueName="v" for="$r[1]"><number>$v</number></repeat>`,
            "doenet-e0005 1:37-42",
        ],
        [
            "conditionalContent condition",
            `<conditionalContent name="c" condition="$c[1] > 0"><number>1</number></conditionalContent>`,
            "doenet-e0005 1:41-46",
        ],
        // what a composite's branches decide by, too
        [
            "case condition",
            `<conditionalContent name="c"><case condition="$c[1] > 0"><number>1</number></case></conditionalContent>`,
            "doenet-e0005 1:47-52",
        ],
        [
            "option selectWeight",
            `<select name="s"><option selectWeight="$s[1]"><number>1</number></option><option><number>2</number></option></select>`,
            "doenet-e0005 1:40-45",
        ],
        // a sampler
        [
            "sampleRandomNumbers numSamples",
            `<sampleRandomNumbers name="s" numSamples="$s[1]"/>`,
            "doenet-e0005 1:43-48",
        ],
        [
            "selectRandomNumbers to",
            `<selectRandomNumbers name="s" from="1" to="$s[1]"/>`,
            "doenet-e0005 1:44-49",
        ],
        // a whole reference to the component, in an attribute it is made from
        [
            "selectFromSequence exclude, by the whole selection",
            `<selectFromSequence name="a" from="1" to="10"/><selectFromSequence name="b" from="1" to="10" exclude="$a $b"/>`,
            "doenet-e0005 1:106-108",
        ],
    ];

    for (const [description, doenetML, error] of selfReferentialAttributes) {
        it(`${description} is an error at load`, async () => {
            const { errors, rest } = await errorsAndRest(doenetML);
            expect(errors).eqls([error]);
            expect(rest).eq("rest");
        });
    }

    // Two components, each excluding a value the other has yet to produce:
    // the same cycle, drawn across a pair rather than closed on one component.
    // Both ends are errors.
    it("mutually referential excludes are each an error at load", async () => {
        const { errors, rest } = await errorsAndRest(`
    <selectFromSequence name="a" from="1" to="10" exclude="$b[1]"/>
    <selectFromSequence name="b" from="1" to="10" exclude="$a[1]"/>
    `);
        expect(errors).eqls(["doenet-e0005 2:60-65", "doenet-e0005 3:60-65"]);
        expect(rest).eq("rest");
    });

    // An attribute that only displays or styles what the composite makes is
    // not read when it is made, so a reference to it there is not a cycle.
    for (const doenetML of [
        `<sequence name="a" from="1" to="5" displayDigits="$a[1]"/>`,
        `<repeat name="r" for="1 2" valueName="v" hide="$r[1]"><boolean>$v=3</boolean></repeat>`,
    ]) {
        it(`not a cycle: ${doenetML}`, async () => {
            const { errors, rest } = await errorsAndRest(doenetML);
            expect(errors).eqls([]);
            expect(rest).eq("rest");
        });
    }
});

/**
 * Where an error is reported, as `code line:column-column`, and what the
 * paragraph `p` beside the cycle shows: the rest of the document renders
 * (DIAG-5).
 */
async function errorsAndRest(doenetML: string) {
    const { core, resolvePathToNodeIdx } = await createTestCore({
        doenetML: `${doenetML}<p name="p">rest</p>`,
    });
    const stateVariables = await core.returnAllStateVariables(false, true);
    return {
        core,
        resolvePathToNodeIdx,
        errors: errorsAt(core),
        rest: stateVariables[await resolvePathToNodeIdx("p")].stateValues.text,
    };
}

function errorsAt(core: any) {
    return getDiagnosticsByType(core).errors.map(
        (error) =>
            `${error.code} ${error.position?.start.line}:${error.position?.start.column}-${error.position?.end.column}`,
    );
}

/**
 * Cycles that run through children and `extend` rather than through an
 * attribute. A reference that depends on itself through what is written is
 * found when the document loads, from the references the resolver resolved
 * (`utils/dast/referenceCycles.ts`): it is an error, `doenet-e0005`, at
 * where the reference is written, one at each reference on the cycle, and
 * the rest of the document renders (D14, NAME-7, DIAG-4, DIAG-5).
 *
 * So is a cycle through an input's `prefill` (#2473).
 *
 * The no-cycle cases guard the other side: the check memoizes what it has
 * searched and drops the memo of everything upstream of a changed edge, and
 * a reference that is set up before its target has any dependencies of its
 * own must still be searched once the target gets them.
 */
describe("Circular references through children and extend @group2", async () => {
    it("a text that contains a reference to itself", async () => {
        const { errors, rest } = await errorsAndRest(
            `<text name="t">$t</text>`,
        );
        expect(errors).eqls(["doenet-e0005 1:16-18"]);
        expect(rest).eq("rest");
    });

    it("two texts that reference each other", async () => {
        const { errors, rest, core } = await errorsAndRest(`
    <text name="t1">$t2</text>
    <text name="t2">$t1</text>
    `);
        expect(errors).eqls(["doenet-e0005 2:21-24", "doenet-e0005 3:21-24"]);
        expect(
            getDiagnosticsByType(core).errors.map((error) => error.message),
        ).eqls([
            "Circular dependency detected involving `<text>` component.",
            "Circular dependency detected involving `<text>` component.",
        ]);
        expect(rest).eq("rest");
    });

    it("a number and a math that reference each other", async () => {
        const { errors, rest } = await errorsAndRest(`
    <number name="a">$m</number>
    <math name="m">$a+1</math>
    `);
        expect(errors).eqls(["doenet-e0005 2:22-24", "doenet-e0005 3:20-22"]);
        expect(rest).eq("rest");
    });

    it("two maths that extend each other", async () => {
        const { errors, rest } = await errorsAndRest(`
    <math extend="$b1" name="b2" />
    <math extend="$b2" name="b1" />
    `);
        expect(errors).eqls(["doenet-e0005 2:5-36", "doenet-e0005 3:5-36"]);
        expect(rest).eq("rest");
    });

    it("a mathInput prefilled with its own value", async () => {
        const { errors, rest } = await errorsAndRest(
            `<mathInput name="mi" prefill="$mi.value" />`,
        );
        expect(errors).eqls(["doenet-e0005 1:31-40"]);
        expect(rest).eq("rest");
    });

    it("a long chain of references is not a cycle", async () => {
        const length = 60;
        let doenetML = `<number name="n1">1</number>`;
        for (let i = 2; i <= length; i++) {
            doenetML += `<number name="n${i}">$n${i - 1}+1</number>`;
        }
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML,
        });

        // The memos cover only the load; they are dropped once it is done
        // (and regrow for whatever a later evaluation sets up). The blocker
        // order is rebuilt then, keeping positions only for the items of the
        // few blockers still outstanding.
        const dependencies = core.core.dependencies;
        expect(dependencies.circularCheckMarks.size).eq(0);
        const outstanding = new Set<string>();
        for (const [type, entries] of dependencies.resolveBlockers
            .neededToResolve) {
            for (const [code, blockers] of entries) {
                outstanding.add(`${type}:${code}`);
                for (const blockerType in blockers) {
                    for (const blockerCode of blockers[blockerType]) {
                        outstanding.add(`${blockerType}:${blockerCode}`);
                    }
                }
            }
        }
        expect(outstanding.size).toBeLessThan(10);
        expect(dependencies.blockerOrder.size).eq(outstanding.size);

        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx(`n${length}`)].stateValues
                .value,
        ).eq(length);
    });

    it("a reference reached along two paths is not a cycle", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <number name="a">1</number>
    <number name="b">$a+1</number>
    <number name="c">$a+2</number>
    <number name="d">$b+$c</number>
    <number name="e">$d+$a</number>
    `,
        });
        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("e")].stateValues.value,
        ).eq(6);
    });
});

/**
 * Reference cycles are decided when the document loads, from what is written
 * in every branch, so the same errors are there before and after a reader
 * changes which branch is shown (DIAG-7, D38). Doenet/DoenetML#2439 and the
 * state-variable cycles of #2463.
 */
describe("Reference cycles decided at load @group2", async () => {
    // B29
    it("a math that indexes itself", async () => {
        const { errors, rest } = await errorsAndRest(
            `<math name="m">(1, $m[2])</math>`,
        );
        expect(errors).eqls(["doenet-e0005 1:20-25"]);
        expect(rest).eq("rest");
    });

    it("a math written with copyWithState of itself, or of a math reading it", async () => {
        const self = await errorsAndRest(`<math name="z" copyWithState="$z"/>`);
        expect(self.errors).eqls(["doenet-e0005 1:1-36"]);
        expect(self.rest).eq("rest");
        const pair = await errorsAndRest(
            `<math name="a" copyWithState="$b"/><math name="b">$a</math>`,
        );
        expect(pair.errors).eqls([
            "doenet-e0005 1:1-36",
            "doenet-e0005 1:51-53",
        ]);
        expect(pair.rest).eq("rest");
    });

    it("a math that extends itself", async () => {
        const { errors, rest, core } = await errorsAndRest(
            `<math name="z" extend="$z"/>`,
        );
        expect(errors).eqls(["doenet-e0005 1:1-29"]);
        expect(getDiagnosticsByType(core).errors[0].message).eq(
            "Circular dependency detected involving `<math>` component.",
        );
        expect(rest).eq("rest");
    });

    it("two maths that read each other", async () => {
        const { errors, rest } = await errorsAndRest(
            `<math name="z1">$z2</math><math name="z2">$z1</math>`,
        );
        expect(errors).eqls(["doenet-e0005 1:17-20", "doenet-e0005 1:43-46"]);
        expect(rest).eq("rest");
    });

    it("a reference to a component on a cycle reports nothing more", async () => {
        const { errors, rest } = await errorsAndRest(
            `<math name="z1">$z2</math><math name="z2">$z1</math><math name="w">$z1</math>`,
        );
        expect(errors).eqls(["doenet-e0005 1:17-20", "doenet-e0005 1:43-46"]);
        expect(rest).eq("rest");
    });

    it("each error names the type its reference is of, whatever the order written", async () => {
        const { core } = await errorsAndRest(
            `<math name="a" extend="$b"/><math name="b">$a</math>`,
        );
        expect(
            getDiagnosticsByType(core).errors.map((error) => error.message),
        ).eqls([
            "Circular dependency detected involving `<math>` component.",
            "Circular dependency detected involving `<math>` component.",
        ]);
    });

    // A label that is content, not the label of what holds it, is part of
    // that value.
    for (const [description, doenetML, error] of [
        [
            "a label holding a reference to the label it is in",
            `<label name="l"><label>$l</label></label>`,
            "doenet-e0005 1:24-26",
        ],
        [
            "a label in an m, holding a reference to the m",
            `<m name="mm"><label>$mm</label></m>`,
            "doenet-e0005 1:21-24",
        ],
    ]) {
        it(description, async () => {
            const { errors, rest } = await errorsAndRest(doenetML);
            expect(errors).eqls([error]);
            expect(rest).eq("rest");
        });
    }

    // What is written in a reference made as a composite is part of what it
    // makes, in a case not shown too.
    for (const [form, end] of [
        ["extend", 90],
        ["copy", 88],
    ] as const) {
        it(`a group written with ${form}, holding a reference to itself`, async () => {
            const { errors, rest } = await errorsAndRest(
                `<group name="s"><math>1</math></group><group name="g" ${form}="$s"><math>$g</math></group>`,
            );
            expect(errors).eqls([
                `doenet-e0005 1:39-${end}`,
                `doenet-e0005 1:${end - 17}-${end - 15}`,
            ]);
            expect(rest).eq("rest");
        });
    }

    it("a group extend holding a reference to itself, in a case not shown yet", async () => {
        const { errors, core, resolvePathToNodeIdx } = await errorsAndRest(
            `<booleanInput name="b"/><group name="s"><math>1</math></group><conditionalContent><case condition="$b"><group name="g" extend="$s"><math>$g</math></group></case></conditionalContent>`,
        );
        expect(errors).toHaveLength(2);
        expect(errors.every((error) => error.startsWith("doenet-e0005"))).true;
        await updateBooleanInputValue({
            boolean: true,
            componentIdx: await resolvePathToNodeIdx("b"),
            core,
        });
        expect(errorsAt(core)).eqls(errors);
    });

    it("a text holding a reference to itself inside an em, in a case not shown yet", async () => {
        const { errors, rest, core, resolvePathToNodeIdx } =
            await errorsAndRest(
                `<booleanInput name="b"/><conditionalContent><case condition="$b"><text name="t"><em>$t</em></text></case></conditionalContent>`,
            );
        expect(errors).eqls(["doenet-e0005 1:85-87"]);
        expect(rest).eq("rest");
        await updateBooleanInputValue({
            boolean: true,
            componentIdx: await resolvePathToNodeIdx("b"),
            core,
        });
        expect(errorsAt(core)).eqls(errors);
    });

    it("a cycle in a setup is found", async () => {
        const { errors, rest } = await errorsAndRest(
            `<setup><math name="a">$b</math><math name="b">$a</math></setup>`,
        );
        expect(errors).eqls(["doenet-e0005 1:23-25", "doenet-e0005 1:47-49"]);
        expect(rest).eq("rest");
    });

    // An extend of a composite that makes its content makes nothing of what
    // is written in it, which is its own error, not a cycle.
    it("children written in an extend of a repeat are an error, not a cycle", async () => {
        const { core, rest } = await errorsAndRest(
            `<repeat for="1 2" valueName="v" name="x"><text>$v</text></repeat><repeat extend="$x" name="x2"><text>$x2</text></repeat>`,
        );
        expect(
            getDiagnosticsByType(core).errors.map((error) => error.code),
        ).eqls(["doenet-e0057"]);
        expect(rest).eq("rest");
    });

    it("a module extend holding a reference to itself", async () => {
        const { errors, rest } = await errorsAndRest(
            `<module name="md"><math>1</math></module><module name="m2" extend="$md"><math>$m2</math></module>`,
        );
        expect(errors).eqls(["doenet-e0005 1:42-98", "doenet-e0005 1:79-82"]);
        expect(rest).eq("rest");
    });

    // B32: before, the extends gave nothing at load, and switching the case
    // on reported `doenet-e0005` at one of them, and, with an `<else>`, an
    // uncoded error.
    for (const withElse of [false, true]) {
        it(`two conditionalContents extending each other${withElse ? ", with an else" : ""}`, async () => {
            const otherwise = (value: number) =>
                withElse ? `<else><math>${value}</math></else>` : "";
            const { errors, rest, core, resolvePathToNodeIdx } =
                await errorsAndRest(`<booleanInput name="b"/>
<conditionalContent name="c1"><case condition="$b"><math extend="$c2"/></case>${otherwise(1)}</conditionalContent>
<conditionalContent name="c2"><case condition="$b"><math extend="$c1"/></case>${otherwise(2)}</conditionalContent>
`);
            const atLoad = ["doenet-e0005 2:52-72", "doenet-e0005 3:52-72"];
            expect(errors).eqls(atLoad);
            expect(rest).eq("rest");

            await updateBooleanInputValue({
                boolean: true,
                componentIdx: await resolvePathToNodeIdx("b"),
                core,
            });
            expect(errorsAt(core)).eqls(atLoad);
            await updateBooleanInputValue({
                boolean: false,
                componentIdx: await resolvePathToNodeIdx("b"),
                core,
            });
            expect(errorsAt(core)).eqls(atLoad);
        });
    }

    it("a cycle in a case not shown yet is reported at load", async () => {
        const { errors, rest, core, resolvePathToNodeIdx } =
            await errorsAndRest(`<booleanInput name="b"/>
<conditionalContent><case condition="$b"><text name="t1">$t2</text><text name="t2">$t1</text></case></conditionalContent>
`);
        const atLoad = ["doenet-e0005 2:58-61", "doenet-e0005 2:84-87"];
        expect(errors).eqls(atLoad);
        expect(rest).eq("rest");

        await updateBooleanInputValue({
            boolean: true,
            componentIdx: await resolvePathToNodeIdx("b"),
            core,
        });
        expect(errorsAt(core)).eqls(atLoad);
    });

    it("a cycle through a reference in a case not shown yet is reported at load", async () => {
        const { errors, rest, core, resolvePathToNodeIdx } =
            await errorsAndRest(`<mathInput name="i" prefill="1"/>
<number name="n">
  <conditionalContent condition="$i=1">1</conditionalContent>
  <conditionalContent condition="$i=2">$n+1</conditionalContent>
</number>
`);
        const atLoad = ["doenet-e0005 4:40-42"];
        expect(errors).eqls(atLoad);
        expect(rest).eq("rest");

        await updateMathInputValue({
            latex: "2",
            componentIdx: await resolvePathToNodeIdx("i"),
            core,
        });
        expect(errorsAt(core)).eqls(atLoad);
    });

    it("a cycle in a repeat's template is reported once, at load", async () => {
        const { errors, rest, core, resolvePathToNodeIdx } =
            await errorsAndRest(`<mathInput name="n" prefill="0"/>
<repeatForSequence length="$n"><math name="a">$b</math><math name="b">$a</math></repeatForSequence>
`);
        const atLoad = ["doenet-e0005 2:47-49", "doenet-e0005 2:71-73"];
        expect(errors).eqls(atLoad);
        expect(rest).eq("rest");

        await updateMathInputValue({
            latex: "2",
            componentIdx: await resolvePathToNodeIdx("n"),
            core,
        });
        expect(errorsAt(core)).eqls(atLoad);
    });

    // The edges the load-time check does not draw, as they may read nothing
    // of what is written where the reference is.
    const notCycles: [string, string][] = [
        [
            "a point's label reading the point",
            `<point name="P"><label>$P</label>(1,2)</point>`,
        ],
        [
            "a property of the component it is in",
            `<point name="P">(1, 2)<label>$P.x</label></point>`,
        ],
        [
            "an index into the group it is in",
            `<group name="g"><math name="a">1</math><math name="b">$g[1]+1</math></group>`,
        ],
        [
            "an index into the text list it is in, to an item before it",
            `<textList name="l"><text>a</text><text>$l[1]</text></textList>`,
        ],
        [
            "an index into the boolean list it is in, to an item before it",
            `<booleanList name="l"><boolean>true</boolean><boolean>$l[1]</boolean></booleanList>`,
        ],
        [
            // an index names nothing in a number (`doenet-w0100`)
            "an index into the number it is in",
            `<number name="n">1 + $n[1]</number>`,
        ],
        [
            "a reference to a sibling in a repeat's template",
            `<repeat for="1 2" valueName="v"><math name="a">$v</math><math name="b">$a+1</math></repeat>`,
        ],
        [
            "a chain",
            `<math name="a">1</math><math name="b">$a+1</math><math name="c">$b+$a</math>`,
        ],
        // a `<math>` made from its attributes alone, which takes no children
        [
            "a math written in an evaluate, holding a reference to the evaluate",
            `<function name="f">x</function><evaluate name="e" function="$f" input="1"><math>$e</math></evaluate>`,
        ],
        // a setup makes nothing, so a reference to it reads nothing in it
        [
            "a reference to a setup, in the setup",
            `<setup name="s"><math>$s</math></setup>`,
        ],
        // an index into what a group extend or copy makes names, when the
        // document runs, the first of what it makes: the copy of `t`
        [
            "an index into a group extend, in the group extend",
            `<group name="g"><text name="t">a</text></group><group extend="$g" name="h"><text>$h[1]</text></group>`,
        ],
        [
            "an index into a group copy, in the group copy",
            `<group name="g"><text name="t">a</text></group><group copy="$g" name="h"><text>$h[1]</text></group>`,
        ],
    ];
    for (const [description, doenetML] of notCycles) {
        it(`${description} is not a cycle`, async () => {
            const { errors, rest } = await errorsAndRest(doenetML);
            expect(errors).eqls([]);
            expect(rest).eq("rest");
        });
    }
});

/**
 * Doenet/DoenetML#2473: cycles closed through a property, an attribute, an
 * index, a name every branch declares, a tag whose content is its children,
 * or a `copy` in what it is of. Each stopped the document, or was reported
 * only when it was reached; each is now decided when the document loads, an
 * error at each reference on the cycle, whether or not the branch holding it
 * is shown, while the rest renders, and nothing new appears when a reader
 * changes the case (D14, NAME-7, DIAG-4, DIAG-5, DIAG-7).
 */
describe("Cycles through a property, an attribute, an index or a branch name, decided at load @group2", async () => {
    it("a number or a text reading its own value", async () => {
        const number = await errorsAndRest(
            `<number name="n">$n.value</number>`,
        );
        expect(number.errors).eqls(["doenet-e0005 1:18-26"]);
        expect(number.rest).eq("rest");
        const text = await errorsAndRest(`<text name="t">$t.value</text>`);
        expect(text.errors).eqls(["doenet-e0005 1:16-24"]);
        expect(text.rest).eq("rest");
    });

    it("a text reading its own value, in a case not shown yet", async () => {
        const { errors, rest, core, resolvePathToNodeIdx } =
            await errorsAndRest(
                `<booleanInput name="b"/><conditionalContent condition="$b"><text name="t">$t.value</text></conditionalContent>`,
            );
        expect(errors).eqls(["doenet-e0005 1:75-83"]);
        expect(rest).eq("rest");
        await updateBooleanInputValue({
            boolean: true,
            componentIdx: await resolvePathToNodeIdx("b"),
            core,
        });
        expect(errorsAt(core)).eqls(errors);
    });

    it("a number reading its own value in a case that turns true", async () => {
        const { errors, rest, core, resolvePathToNodeIdx } =
            await errorsAndRest(
                `<mathInput name="i" prefill="1"/><number name="n"><conditionalContent condition="$i=1">1</conditionalContent><conditionalContent condition="$i=2">$n.value+1</conditionalContent></number>`,
            );
        expect(errors).eqls(["doenet-e0005 1:147-155"]);
        expect(rest).eq("rest");
        await updateMathInputValue({
            latex: "2",
            componentIdx: await resolvePathToNodeIdx("i"),
            core,
        });
        expect(errorsAt(core)).eqls(errors);
    });

    // Every property listed as made from what is written in the tag
    // (`PROPERTIES_READ`), each found to be circular when the document ran.
    const contentOf: Record<string, string> = {
        mathList: "1 2",
        numberList: "1 2",
        textList: "a b",
        booleanList: "true false",
        boolean: "true",
        integer: "1",
        number: "1",
        math: "1",
        m: "1",
        md: "1",
    };
    const tagOf: Record<string, string> = {
        _inlineRenderInlineChildren: "em",
        _textOrInline: "title",
    };
    for (const [base, properties] of PROPERTIES_READ) {
        const tag = tagOf[base] ?? base;
        for (const property of properties) {
            const doenetML = `<${tag} name="x">${contentOf[tag] ?? "a"} $x.${property}</${tag}>`;
            it(`a property made from what is written: ${doenetML}`, async () => {
                const { errors, rest } = await errorsAndRest(doenetML);
                expect(errors).toHaveLength(1);
                expect(errors[0]).toMatch(/^doenet-e0005 /);
                expect(rest).eq("rest");
            });
        }
    }

    // Every property of an input listed as made from where its value starts
    // (`INPUTS`), and the input as a whole, in each such attribute.
    const choices = `<choice>a</choice><choice>b</choice>`;
    for (const [tag, { attributes, properties }] of INPUTS) {
        const children = tag === "choiceInput" ? choices : "";
        for (const [attribute, read] of [
            ...properties.map((property) => [attributes[0], `$x.${property}`]),
            ...attributes.map((attribute) => [attribute, "$x"]),
        ]) {
            const doenetML = `<${tag} name="x" ${attribute}="${read}">${children}</${tag}>`;
            it(`an input made from itself: ${doenetML}`, async () => {
                const { errors, rest } = await errorsAndRest(doenetML);
                expect(errors).toHaveLength(1);
                expect(errors[0]).toMatch(/^doenet-e0005 /);
                expect(rest).eq("rest");
            });
        }
    }

    it("a mathInput prefilled with a math that reads it", async () => {
        const { errors, rest } = await errorsAndRest(
            `<mathInput name="mi" prefill="$x"/><math name="x">$mi.value+1</math>`,
        );
        expect(errors).eqls(["doenet-e0005 1:31-33", "doenet-e0005 1:51-60"]);
        expect(rest).eq("rest");
    });

    it("a number whose index into a list reads the number", async () => {
        // the reference, and the reference in its index
        const { errors, rest } = await errorsAndRest(
            `<numberList name="l">1 2 3</numberList><number name="i">$l[$i]</number>`,
        );
        expect(errors).eqls(["doenet-e0005 1:57-63", "doenet-e0005 1:60-62"]);
        expect(rest).eq("rest");
    });

    it("a math, a text or a boolean whose index reads it", async () => {
        // Before, these loaded with the error at the index's reference only,
        // a blank where the reference is and a warning that the index did not
        // work out to a number (`doenet-w0163`); now the reference is on the
        // cycle too, and the tag holding it is the error.
        for (const [doenetML, componentType] of [
            [`<math name="m">(1,2)</math><math name="i">$m[$i]</math>`, "math"],
            [
                `<numberList name="l">1 2 3</numberList><text name="i">$l[$i]</text>`,
                "text",
            ],
            [
                `<numberList name="l">1 2 3</numberList><boolean name="i">$l[$i]</boolean>`,
                "boolean",
            ],
        ]) {
            const { errors, rest, core, resolvePathToNodeIdx } =
                await errorsAndRest(doenetML);
            expect(errors).toHaveLength(2);
            expect(rest).eq("rest");
            const diagnostics = getDiagnosticsByType(core);
            expect(diagnostics.errors[1].message).eq(
                `Circular dependency detected involving \`<${componentType}>\` component.`,
            );
            expect(diagnostics.warnings).toHaveLength(0);
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(
                stateVariables[await resolvePathToNodeIdx("i")].componentType,
            ).eq("_error");
        }
    });

    it("the error at a reference in an index names the type of what it is of", async () => {
        // not the `<integer>` the index is made, which is not written
        const { core } = await errorsAndRest(
            `<numberList name="l">1 2 3</numberList><number name="n">$l[$n]</number>`,
        );
        expect(
            getDiagnosticsByType(core).errors.map((error) => error.message),
        ).eqls([
            "Circular dependency detected involving `<numberList>` component.",
            "Circular dependency detected involving `<number>` component.",
        ]);
    });

    it("an index into a math list or a number list it is in", async () => {
        const math = await errorsAndRest(
            `<mathList name="l">1 $l[1]</mathList>`,
        );
        expect(math.errors).eqls(["doenet-e0005 1:22-27"]);
        expect(math.rest).eq("rest");
        const number = await errorsAndRest(
            `<numberList name="l">1 $l[1]</numberList>`,
        );
        expect(number.errors).eqls(["doenet-e0005 1:24-29"]);
        expect(number.rest).eq("rest");
    });

    // Before, the document failed to load with an internal error.
    it("an index into a math written with extend, in it", async () => {
        const { errors, rest } = await errorsAndRest(
            `<math name="m">1</math><math name="m2" extend="$m">$m2[1]</math>`,
        );
        expect(errors).eqls(["doenet-e0005 1:24-65", "doenet-e0005 1:52-58"]);
        expect(rest).eq("rest");
    });

    it("a name every case declares, read by what one case's reads", async () => {
        const { errors, rest, core, resolvePathToNodeIdx } =
            await errorsAndRest(
                `<booleanInput name="b"/><conditionalContent name="cc"><case condition="$b"><math name="x">$y</math></case><else><math name="x">1</math></else></conditionalContent><math name="y">$cc.x</math>`,
            );
        expect(errors).eqls(["doenet-e0005 1:91-93", "doenet-e0005 1:179-184"]);
        expect(rest).eq("rest");
        for (const value of [true, false]) {
            await updateBooleanInputValue({
                boolean: value,
                componentIdx: await resolvePathToNodeIdx("b"),
                core,
            });
            expect(errorsAt(core)).eqls(errors);
        }
    });

    it("a name every case declares, read through a property", async () => {
        const { errors, rest, core, resolvePathToNodeIdx } =
            await errorsAndRest(
                `<booleanInput name="b"/><conditionalContent><case condition="$b"><text name="x">$y.value</text></case><else><text name="x">a</text></else></conditionalContent><text name="y">$x.value</text>`,
            );
        expect(errors).eqls(["doenet-e0005 1:81-89", "doenet-e0005 1:175-183"]);
        expect(rest).eq("rest");
        await updateBooleanInputValue({
            boolean: true,
            componentIdx: await resolvePathToNodeIdx("b"),
            core,
        });
        expect(errorsAt(core)).eqls(errors);
    });

    // Before, the variant that picked the first option did not finish
    // loading (D39).
    it("a name every option of a one-pick select declares, in every variant", async () => {
        for (const requestedVariantIndex of [1, 2, 3, 4]) {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `<select name="s"><option><math name="x">$y</math></option><option><math name="x">1</math></option></select><math name="y">$x</math><p name="p">rest</p>`,
                requestedVariantIndex,
            });
            expect(errorsAt(core)).eqls([
                "doenet-e0005 1:41-43",
                "doenet-e0005 1:123-125",
            ]);
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(
                stateVariables[await resolvePathToNodeIdx("p")].stateValues
                    .text,
            ).eq("rest");
        }
    });

    // A reference in a case is there only while that case is shown, so it
    // names what its own case declares, not what the others do.
    it("a name every case declares, read from within a case, from the other case's", async () => {
        const { errors, rest, core, resolvePathToNodeIdx } =
            await errorsAndRest(
                `<booleanInput name="b"/><conditionalContent name="cc"><case condition="$b"><math name="x">$cc.y</math><math name="y">1</math></case><else><math name="x">2</math><math name="y">$cc.x</math></else></conditionalContent><p name="out">$cc.x, $cc.y</p>`,
            );
        expect(errors).eqls([]);
        expect(rest).eq("rest");
        for (const [value, shown] of [
            [true, "1, 1"],
            [false, "2, 2"],
        ] as const) {
            await updateBooleanInputValue({
                boolean: value,
                componentIdx: await resolvePathToNodeIdx("b"),
                core,
            });
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(
                stateVariables[await resolvePathToNodeIdx("out")].stateValues
                    .text,
            ).eq(shown);
            expect(errorsAt(core)).eqls([]);
        }
    });

    it("a name every option of a one-pick select declares, read from within an option, from the other option's", async () => {
        for (const requestedVariantIndex of [1, 2]) {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `<select name="s"><option><math name="x">$s.y</math><math name="y">1</math></option><option><math name="x">2</math><math name="y">$s.x</math></option></select><p name="out">$s.x, $s.y</p>`,
                requestedVariantIndex,
            });
            expect(errorsAt(core)).eqls([]);
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(
                stateVariables[await resolvePathToNodeIdx("out")].stateValues
                    .text,
            ).oneOf(["1, 1", "2, 2"]);
        }
    });

    it("a name every case declares, read from an attribute within a case, from the other case's", async () => {
        for (const value of [true, false]) {
            const { errors, rest } = await errorsAndRest(
                `<boolean name="b">${value}</boolean><conditionalContent name="cc"><case condition="$b"><p><mathInput name="x" prefill="$cc.y"/></p><mathInput name="y"/></case><else><mathInput name="x"/><mathInput name="y" prefill="$cc.x"/></else></conditionalContent>`,
            );
            expect(errors).eqls([]);
            expect(rest).eq("rest");
        }
        // within one case, still a cycle
        const { errors, rest } = await errorsAndRest(
            `<conditionalContent name="cc"><case condition="false"><mathInput name="x" prefill="$cc.y"/><math name="y">$cc.x</math></case><else><mathInput name="x"/><math name="y">1</math></else></conditionalContent>`,
        );
        expect(errors).eqls(["doenet-e0005 1:84-89", "doenet-e0005 1:107-112"]);
        expect(rest).eq("rest");
    });

    it("a name every case declares, read from within a case, from its own case's", async () => {
        const { errors, rest } = await errorsAndRest(
            `<conditionalContent name="cc"><case condition="false"><math name="x">$cc.x+1</math></case><else><math name="x">1</math></else></conditionalContent>`,
        );
        expect(errors).eqls(["doenet-e0005 1:70-75"]);
        expect(rest).eq("rest");
    });

    it("a paragraph holding a reference to itself, in a case not shown yet", async () => {
        const { errors, rest, core, resolvePathToNodeIdx } =
            await errorsAndRest(
                `<booleanInput name="b"/><conditionalContent condition="$b"><p name="q">a $q</p></conditionalContent>`,
            );
        expect(errors).eqls(["doenet-e0005 1:74-76"]);
        expect(rest).eq("rest");
        await updateBooleanInputValue({
            boolean: true,
            componentIdx: await resolvePathToNodeIdx("b"),
            core,
        });
        expect(errorsAt(core)).eqls(errors);
    });

    // the same for the other tags whose content is their children
    for (const [tag, doenetML] of [
        ["div", `<div name="q">a $q</div>`],
        ["li", `<ol><li name="q">a $q</li></ol>`],
        ["section", `<section name="q"><p>a $q</p></section>`],
        ["title", `<section name="q"><title>a $q</title></section>`],
    ]) {
        it(`a ${tag} holding a reference to itself, in a case not shown yet`, async () => {
            const { errors, rest } = await errorsAndRest(
                `<booleanInput name="b"/><conditionalContent condition="$b">${doenetML}</conditionalContent>`,
            );
            expect(errors).toHaveLength(1);
            expect(errors[0]).toMatch(/^doenet-e0005 /);
            expect(rest).eq("rest");
        });
    }

    it("two paragraphs holding references to each other", async () => {
        const { errors, rest } = await errorsAndRest(
            `<p name="q">a $r</p><p name="r">$q</p>`,
        );
        expect(errors).eqls(["doenet-e0005 1:15-17", "doenet-e0005 1:33-35"]);
        expect(rest).eq("rest");
    });

    // Before, the `copy` and `copyWithState` forms stopped the document; the
    // `extend` form was an error at load already.
    for (const [form, end] of [
        ["copy", 43],
        ["copyWithState", 52],
        ["extend", 45],
    ] as const) {
        it(`a math written with ${form} of the group it is in`, async () => {
            const { errors, rest } = await errorsAndRest(
                `<group name="g"><math name="a" ${form}="$g"/></group>`,
            );
            expect(errors).eqls([`doenet-e0005 1:17-${end}`]);
            expect(rest).eq("rest");
        });
    }

    // What these read is not what is written where the reference is.
    const notCycles: [string, string][] = [
        [
            "a property of a math not made from it",
            `<math name="x">1 $x.hide</math>`,
        ],
        ["the format of a math", `<math name="x">1 $x.format</math>`],
        [
            "a section's title, in a paragraph of the section",
            `<section name="s"><p>See $s.title</p></section>`,
        ],
        [
            "a point, in a text in its label",
            `<point name="P"><label><text>$P</text></label></point>`,
        ],
        [
            "an input, in its label",
            `<mathInput name="mi"><label>$mi</label></mathInput>`,
        ],
        [
            "a name every case declares, read by a math the cases don't read",
            `<conditionalContent><case condition="true"><math name="x">1</math></case><else><math name="x">2</math></else></conditionalContent><math name="y">$x+1</math>`,
        ],
        // a collect reads what it collects, not the group
        [
            "a collect from the group it is in",
            `<group name="g"><point>(1,2)</point><collect from="$g" componentTypes="point"/></group>`,
        ],
        [
            "a collect from the section it is in",
            `<section name="s"><point>(1,2)</point><p><collect from="$s" componentTypes="point"/></p></section>`,
        ],
        [
            "an index into a group, in an attribute that only shows it",
            `<group name="g" hide="$g[1]"><boolean>false</boolean></group>`,
        ],
        // an input that starts from an index into a list that holds it
        // reads only that entry
        [
            "a mathInput prefilled with an index into a math list that holds it",
            `<mathList name="l">1 $mi</mathList><mathInput name="mi" prefill="$l[1]"/>`,
        ],
        [
            "a mathInput bound to an index into a number list that holds it",
            `<numberList name="l">1 $mi</numberList><mathInput name="mi" bindValueTo="$l[1]"/>`,
        ],
        [
            "a mathInput prefilled with a math reading an index into a math list that holds it",
            `<mathList name="l">1 $mi</mathList><math name="y">$l[1]</math><mathInput name="mi" prefill="$y"/>`,
        ],
        [
            "a matrixInput prefilled with an index into a math list that holds it",
            `<mathList name="l">1 $mi</mathList><matrixInput name="mi" prefill="$l[1]"/>`,
        ],
        [
            "a choiceInput preselecting an index into a number list that holds it",
            `<numberList name="l">1 $ci.selectedIndex</numberList><choiceInput name="ci" preselectChoice="$l[1]"><choice>a</choice><choice>b</choice></choiceInput>`,
        ],
    ];
    for (const [description, doenetML] of notCycles) {
        it(`${description} is not a cycle`, async () => {
            const { errors, rest } = await errorsAndRest(doenetML);
            expect(errors).eqls([]);
            expect(rest).eq("rest");
        });
    }
});

/**
 * Cycles the load-time check does not find (the "not covered" list of #2473):
 * each still stops the document when it is reached, as before. A new edge in
 * `referenceCycles.ts` that finds one moves it to the tests above.
 */
describe("Reference cycles not found at load @group2", async () => {
    for (const [description, doenetML] of [
        [
            "an attribute of a tag that is neither a composite nor an input",
            `<math name="m" simplify="$m=1">1</math>`,
        ],
        [
            "a function evaluated at the component",
            `<function name="f">x</function><number name="n">$$f($n)</number>`,
        ],
        [
            "an index into a repeat in its own template",
            `<repeat name="r" for="1 2" valueName="v"><math>$v+$r[1]</math></repeat>`,
        ],
        [
            "an index into a text list as its own entry",
            `<textList name="l">a $l[1]</textList>`,
        ],
        [
            "both an input's prefill and an index into a math list",
            `<mathList name="l">1 $mi</mathList><mathInput name="mi" prefill="$l[2]"/>`,
        ],
        [
            "a case's condition reading a name its conditionalContent declares",
            `<conditionalContent name="cc"><case condition="$cc.x=1"><math name="x">1</math></case><else><math name="x">2</math></else></conditionalContent>`,
        ],
        [
            "an index into a shuffle in its own children",
            `<shuffle name="sh"><math>1</math><math>$sh[1]</math></shuffle>`,
        ],
        [
            "an index into a sort in its own children",
            `<sort name="sh"><math>1</math><math>$sh[1]</math></sort>`,
        ],
    ]) {
        it(`${description} still stops the document`, async () => {
            await expect(createTestCore({ doenetML })).rejects.toThrow(
                "Circular dependency involving these components",
            );
        });
    }
});

/**
 * The edges from a memoized variable to a variable that is not memoized.
 * Edges to a name the target does not have are left out: the
 * `variablesOptional` filter records them on neither side, so no reset could
 * climb through them anyway. So are edges to the placeholder a dependency on
 * components alone records.
 */
function memoizedAboveUnmemoized(handler: any) {
    const unmarkedBelow: string[] = [];
    let passed = 0;
    for (const [componentIdx, marks] of handler.circularCheckMarks._marks) {
        for (const [varName, mark] of marks) {
            if (mark !== PASSED) {
                continue;
            }
            passed++;
            const downDeps =
                handler.downstreamDependencies[componentIdx]?.[varName];
            for (const dependencyName in downDeps) {
                const dep = downDeps[dependencyName];
                const indices = dep.downstreamComponentIndices;
                const mappedNames =
                    dep.mappedDownstreamVariableNamesByComponent;
                if (!indices || !mappedNames) {
                    continue;
                }
                for (let ind = 0; ind < indices.length; ind++) {
                    for (const name of mappedNames[ind]) {
                        if (
                            name !== dep.downstreamVariableNameIfNoVariables &&
                            handler._components[indices[ind]]?.state?.[name] &&
                            handler.circularCheckMarks.get(
                                indices[ind],
                                name,
                            ) !== PASSED
                        ) {
                            unmarkedBelow.push(
                                `${componentIdx}|${varName} -> ${indices[ind]}|${name}`,
                            );
                        }
                    }
                }
            }
        }
    }
    return { passed, unmarkedBelow };
}

/**
 * The state-variable cycle check, driven directly. A cycle in a document
 * that the load-time check does not break closes in the resolve-blocker
 * graph first, since the target of the edge that closes it cannot have
 * resolved, so the cyclic documents above that throw are all rejected by
 * that check; this one reports a cycle only on the update path,
 * when a dependency is re-pointed at a variable that has already resolved,
 * and no document is known that reaches it. Except for one case that
 * inspects the memos a real load leaves, these cases add edges to the
 * handler's tables the way `Dependency.addDownstreamComponent` records them,
 * with the memo reset it performs. The cases that add edges with
 * `addDependencyAndCheck` (on one or several variables) or at random then run
 * `Dependency.checkForCircular` itself on a stand-in dependency; the others
 * call the check the way it does.
 */
describe("State-variable cycle check driven directly @group2", async () => {
    const circularError = "Circular dependency involving these components";

    // Four numbers on four lines, so the report's line numbers say which
    // components it names and in what order.
    async function handlerWithFourNumbers() {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `<number name="a">1</number>
<number name="b">2</number>
<number name="c">3</number>
<number name="d">4</number>`,
        });
        const dependencies = core.core.dependencies;
        const idx: Record<string, number> = {};
        for (const name of ["a", "b", "c", "d"]) {
            idx[name] = await resolvePathToNodeIdx(name);
        }

        /** An edge from `from` to `to` in a variable `v` of each. */
        function addEdge(from: string, to: string) {
            const dep = {
                dependencyName: `${from}_to_${to}`,
                upstreamComponentIdx: idx[from],
                upstreamVariableNames: ["v"],
                downstreamComponentIndices: [idx[to]],
                mappedDownstreamVariableNamesByComponent: [["v"]],
            };
            const down = (dependencies.downstreamDependencies[idx[from]] ??=
                {});
            (down.v ??= {})[dep.dependencyName] = dep;
            const up = (dependencies.upstreamDependencies[idx[to]] ??= {});
            up.v = (up.v ?? []).concat(dep);
            dependencies.resetCircularCheckPassed(idx[from], "v");
        }

        function check(name: string) {
            dependencies.checkForCircularDependency({
                componentIdx: idx[name],
                varName: "v",
            });
        }

        const search = vi.spyOn(dependencies, "checkForCircularDependency");

        /**
         * A dependency of `v` of `from` set up as `Dependency` sets one up:
         * each edge, to each named variable of each target in turn,
         * recorded, then the memo reset if the edge can close a cycle, and
         * otherwise its target marked as passed. Then
         * `Dependency.checkForCircular` runs, as it does after a dependency
         * is set up. Returns whether it searched.
         */
        function addDependencyAndCheck(
            from: string,
            targets: [to: string, varNames: string[]][],
        ) {
            const dep = {
                dependencyName: `${from}_to_${targets
                    .map(([to, varNames]) => `${to}.${varNames.join(".")}`)
                    .join("_")}`,
                dependencyHandler: dependencies,
                upstreamComponentIdx: idx[from],
                upstreamVariableNames: ["v"],
                downstreamComponentIndices: targets.map(([to]) => idx[to]),
                mappedDownstreamVariableNamesByComponent: targets.map(
                    ([, varNames]) => varNames,
                ),
            };
            const down = (dependencies.downstreamDependencies[idx[from]] ??=
                {});
            (down.v ??= {})[dep.dependencyName] = dep;
            for (const [to, varNames] of targets) {
                const up = (dependencies.upstreamDependencies[idx[to]] ??= {});
                for (const varName of varNames) {
                    up[varName] = (up[varName] ?? []).concat(dep);
                    if (dependencies.edgeCanCloseCycle(dep, idx[to], varName)) {
                        dependencies.resetCircularCheckPassed(idx[from], "v");
                    } else {
                        dependencies.markLeafPassed(idx[to], varName);
                    }
                }
            }
            const searchesBefore = search.mock.calls.length;
            Dependency.prototype.checkForCircular.call(dep);
            return search.mock.calls.length > searchesBefore;
        }

        /** `addDependencyAndCheck` with one edge, to `v` of `to`. */
        function addEdgeAndCheck(from: string, to: string) {
            return addDependencyAndCheck(from, [[to, ["v"]]]);
        }

        return {
            dependencies,
            idx,
            addEdge,
            addEdgeAndCheck,
            addDependencyAndCheck,
            check,
        };
    }

    it("an edge to a variable with no dependencies is not searched", async () => {
        const { addEdgeAndCheck } = await handlerWithFourNumbers();
        expect(addEdgeAndCheck("a", "b")).toBe(false);
        expect(addEdgeAndCheck("b", "c")).toBe(false);
        // c now depends on nothing, but b does, so this one is searched
        expect(addEdgeAndCheck("d", "b")).toBe(true);
    });

    // A dependency on several variables is searched if any one of its
    // edges can close a cycle, wherever that edge comes among them.
    it("a dependency on several variables is searched if any edge can close a cycle", async () => {
        const { addEdgeAndCheck, addDependencyAndCheck } =
            await handlerWithFourNumbers();
        addEdgeAndCheck("b", "c");
        // `w` of every number and `v` of `c` and `d` depend on nothing
        expect(
            addDependencyAndCheck("a", [
                ["c", ["v", "w"]],
                ["d", ["v"]],
            ]),
        ).toBe(false);
        // only the second target can close a cycle
        expect(
            addDependencyAndCheck("d", [
                ["c", ["v"]],
                ["b", ["v"]],
            ]),
        ).toBe(true);
        // only the second variable of the target can close a cycle
        expect(addDependencyAndCheck("a", [["d", ["w", "v"]]])).toBe(true);
        // only the first target can close a cycle
        expect(
            addDependencyAndCheck("a", [
                ["b", ["v"]],
                ["c", ["v"]],
            ]),
        ).toBe(true);
    });

    it("a cycle closed by a later edge of a dependency is found", async () => {
        const { addEdgeAndCheck, addDependencyAndCheck } =
            await handlerWithFourNumbers();
        addEdgeAndCheck("a", "d");
        expect(() =>
            addDependencyAndCheck("d", [
                ["b", ["v"]],
                ["c", ["w", "v"]],
                ["a", ["w", "v"]],
            ]),
        ).toThrow(circularError);
    });

    it("a variable depending on itself is always searched", async () => {
        const { dependencies, idx, addEdgeAndCheck } =
            await handlerWithFourNumbers();
        // Even before the dependency is recorded below `a`, when `a` still
        // depends on nothing.
        expect(
            dependencies.edgeCanCloseCycle(
                { upstreamComponentIdx: idx.a, upstreamVariableNames: ["v"] },
                idx.a,
                "v",
            ),
        ).toBe(true);
        expect(() => addEdgeAndCheck("a", "a")).toThrow(
            `${circularError}: <number> (line 1).`,
        );
    });

    // The skip relies on the edge that later leads out of the skipped
    // variable: its reset reaches back through the skipped edge, and its
    // search goes forward from there, so a cycle through it is still found.
    // Against a plain reachability search, over random edges between 40
    // variables, added the way `Dependency` adds them and removed with no
    // reset at all: an added edge must be reported exactly when it closes a
    // cycle, and a search from anywhere must pass while there is none.
    it("agrees with a brute-force search over random edges", async () => {
        const { dependencies, idx } = await handlerWithFourNumbers();
        const nodes: [number, string][] = [];
        for (const name of ["a", "b", "c", "d"]) {
            for (let k = 0; k < 10; k++) {
                nodes.push([idx[name], `x${k}`]);
            }
        }
        const key = ([c, v]: [number, string]) => `${c}|${v}`;
        const edges = new Map<string, any>();

        const reaches = (from: string, to: string) => {
            const seen = new Set<string>();
            const stack = [from];
            while (stack.length > 0) {
                const node = stack.pop()!;
                if (node === to) {
                    return true;
                }
                if (seen.has(node)) {
                    continue;
                }
                seen.add(node);
                for (const [edgeKey] of edges) {
                    const [a, b] = edgeKey.split(">");
                    if (a === node) {
                        stack.push(b);
                    }
                }
            }
            return false;
        };

        const addEdge = (from: [number, string], to: [number, string]) => {
            const dep = {
                dependencyName: `${key(from)}>${key(to)}`,
                dependencyHandler: dependencies,
                upstreamComponentIdx: from[0],
                upstreamVariableNames: [from[1]],
                downstreamComponentIndices: [to[0]],
                mappedDownstreamVariableNamesByComponent: [[to[1]]],
            };
            const down = (dependencies.downstreamDependencies[from[0]] ??= {});
            (down[from[1]] ??= {})[dep.dependencyName] = dep;
            const up = (dependencies.upstreamDependencies[to[0]] ??= {});
            up[to[1]] = (up[to[1]] ?? []).concat(dep);
            edges.set(dep.dependencyName, dep);
            if (dependencies.edgeCanCloseCycle(dep, to[0], to[1])) {
                dependencies.resetCircularCheckPassed(from[0], from[1]);
            } else {
                dependencies.markLeafPassed(to[0], to[1]);
            }
            Dependency.prototype.checkForCircular.call(dep);
        };

        const removeEdge = (name: string) => {
            const dep = edges.get(name);
            edges.delete(name);
            const from = dep.upstreamComponentIdx;
            const fromVar = dep.upstreamVariableNames[0];
            const to = dep.downstreamComponentIndices[0];
            const toVar = dep.mappedDownstreamVariableNamesByComponent[0][0];
            delete dependencies.downstreamDependencies[from][fromVar][name];
            dependencies.upstreamDependencies[to][toVar] =
                dependencies.upstreamDependencies[to][toVar].filter(
                    (d: any) => d !== dep,
                );
        };

        let seed = 2132;
        const random = () => {
            seed = (seed * 1103515245 + 12345) % 2 ** 31;
            return seed / 2 ** 31;
        };
        const pick = () => nodes[Math.floor(random() * nodes.length)];

        let cyclesFound = 0;
        for (let step = 0; step < 3000; step++) {
            const r = random();
            // About as many removals as additions, which keeps the graph
            // sparse enough that many targets depend on nothing.
            if (edges.size > 0 && r < 0.4) {
                const names = [...edges.keys()];
                removeEdge(names[Math.floor(random() * names.length)]);
            } else if (r < 0.55) {
                const node = pick();
                expect(() =>
                    dependencies.checkForCircularDependency({
                        componentIdx: node[0],
                        varName: node[1],
                    }),
                ).not.toThrow();
            } else {
                const from = pick();
                const to = pick();
                const name = `${key(from)}>${key(to)}`;
                if (edges.has(name)) {
                    continue;
                }
                const closesCycle =
                    key(from) === key(to) || reaches(key(to), key(from));
                let threw = false;
                try {
                    addEdge(from, to);
                } catch (e) {
                    threw = true;
                }
                expect(threw, `adding ${name}`).toBe(closesCycle);
                if (threw) {
                    // A cycle ends the document; take the edge back out and
                    // start the memos afresh to go on.
                    cyclesFound++;
                    removeEdge(name);
                    dependencies.circularCheckMarks.clear();
                }
            }
        }
        expect(cyclesFound).toBeGreaterThan(10);
    });

    it("a cycle closed through a variable that had no dependencies is found", async () => {
        const { addEdgeAndCheck, check } = await handlerWithFourNumbers();
        addEdgeAndCheck("a", "b");
        check("a"); // memoizes a and b as passed
        addEdgeAndCheck("b", "c"); // skipped: c depends on nothing
        expect(() => addEdgeAndCheck("c", "a")).toThrow(circularError);
    });

    // The handler tests above add edges themselves; this one checks what
    // `Dependency` leaves behind over a real load. Each edge it skips must
    // leave its target marked, or a memoized variable would sit above an
    // unmemoized one and a later reset would stop short of it.
    it("leaves no memoized variable above an unmemoized one after a load", async () => {
        const found: { passed: number; unmarkedBelow: string[] }[] = [];
        const clear = DependencyHandler.prototype.clearCircularCheckMemos;
        const spy = vi
            .spyOn(DependencyHandler.prototype, "clearCircularCheckMemos")
            .mockImplementation(function (this: DependencyHandler) {
                found.push(memoizedAboveUnmemoized(this));
                return clear.call(this);
            });
        try {
            await createTestCore({
                doenetML: `<mathinput name="n" prefill="3"/>
<graph>
  <point name="P">(1,2)</point>
  <line through="$P (3,4)"/>
  <circle center="$P" radius="$P.x"/>
</graph>
<repeatForSequence from="1" to="$n" valueName="v">
  <math simplify>$v^2+$n</math><point>($v, $v^2)</point>
</repeatForSequence>`,
            });
        } finally {
            spy.mockRestore();
        }
        expect(found).toHaveLength(1);
        expect(found[0].passed).toBeGreaterThan(0);
        expect(found[0].unmarkedBelow).toEqual([]);
    });

    it("reports the path that closes a cycle, once", async () => {
        const { addEdge, check } = await handlerWithFourNumbers();
        addEdge("d", "a");
        addEdge("a", "b");
        addEdge("b", "c");
        expect(() => check("d")).not.toThrow();

        addEdge("c", "a");
        // The path runs from the variable searched to the one that closed
        // the cycle: c, a, b.
        expect(() => check("c")).toThrow(
            `${circularError}: <number> (line 3), <number> (line 1), <number> (line 2).`,
        );
        // The variables on that path keep their memo, so the cycle is not
        // reported again, by a search at the same variable or from above it.
        expect(() => check("c")).not.toThrow();
        expect(() => check("d")).not.toThrow();
    });

    it("a reset below a cycle re-arms the report up to the top", async () => {
        const { dependencies, idx, addEdge, check } =
            await handlerWithFourNumbers();
        addEdge("d", "a");
        addEdge("a", "b");
        addEdge("b", "c");
        addEdge("c", "a");
        expect(() => check("c")).toThrow(circularError);
        expect(() => check("d")).not.toThrow();

        // What a dependency change below c does: drop c's memo and every
        // memo upstream of it, d's included.
        dependencies.resetCircularCheckPassed(idx.c, "v");
        expect(() => check("d")).toThrow(
            `${circularError}: <number> (line 4), <number> (line 1), <number> (line 2), <number> (line 3).`,
        );
    });

    it("a variable that depends on itself", async () => {
        const { addEdge, check } = await handlerWithFourNumbers();
        addEdge("a", "a");
        expect(() => check("a")).toThrow(
            `${circularError}: <number> (line 1).`,
        );
    });
});

/**
 * Doenet/DoenetML#2137: a cycle that comes into existence after load. The
 * blocker check found it all along and threw, but the request queue caught
 * the error, the action reported a failure with an empty message, and the
 * core carried on with a cycle in its graph: the next evaluation that reached
 * it recursed until the worker ran out of memory.
 *
 * A circular dependency raised by an update now stops the document, as one
 * found during load does: the request that raised it is rejected with the
 * cycle's message, so is every later request, and the viewer is told to show
 * the message in place of the document.
 *
 * A cycle through references in what is written, a property such as
 * `$n.value` or an input's `prefill`, in a case shown or not, is found when
 * the document loads (`utils/dast/referenceCycles.ts`), so these documents
 * close theirs through a function (`$$f($n)`, the `input` of an
 * `<evaluate>`), which that check does not follow.
 */
describe("Circular references created after load @group2", async () => {
    const circularError = "Circular dependency involving these components";

    async function loadAndWatch(doenetML: string) {
        const result = await createTestCore({ doenetML });
        const stopped: string[] = [];
        result.core.core!.updateRenderersCallback = (args: any) => {
            if (args.documentStopped !== undefined) {
                stopped.push(args.documentStopped);
            }
        };
        return { ...result, stopped };
    }

    async function expectDocumentStopped({
        core,
        stopped,
        laterAction,
    }: {
        core: Awaited<ReturnType<typeof createTestCore>>["core"];
        stopped: string[];
        laterAction: Parameters<typeof core.requestAction>[0];
    }) {
        expect(stopped).toHaveLength(1);
        expect(stopped[0]).toContain(circularError);

        // A later request is not run: running it is what used to exhaust the
        // heap.
        const later = await core.requestAction(laterAction);
        expect(later.success).toBe(false);
        expect(later.errMsg).toBe(stopped[0]);
    }

    it("a dependency re-pointed into a cycle stops the document", async () => {
        const { core, resolvePathToNodeIdx, stopped } = await loadAndWatch(`
<mathInput name="i" prefill="1"/>
<function name="f">x</function>
<number name="n">
  <conditionalContent condition="$i=1">1</conditionalContent>
  <conditionalContent condition="$i=2">$$f($n)+1</conditionalContent>
</number>`);
        const iIdx = await resolvePathToNodeIdx("i");

        await core.requestAction({
            componentIdx: iIdx,
            actionName: "updateRawValue",
            args: { rawRendererValue: "2" },
        });
        const result = await core.requestAction({
            componentIdx: iIdx,
            actionName: "updateValue",
            args: {},
        });
        expect(result.success).toBe(false);
        expect(result.errMsg).toContain(circularError);

        await expectDocumentStopped({
            core,
            stopped,
            laterAction: {
                componentIdx: iIdx,
                actionName: "updateRawValue",
                args: { rawRendererValue: "1" },
            },
        });
    });

    it("a number reading its own value switched on stops the document", async () => {
        const { core, resolvePathToNodeIdx, stopped } = await loadAndWatch(`
<booleanInput name="b"/>
<function name="f">x</function>
<conditionalContent condition="$b"><number name="t">$$f($t)</number></conditionalContent>`);
        const bIdx = await resolvePathToNodeIdx("b");

        const result = await core.requestAction({
            componentIdx: bIdx,
            actionName: "updateBoolean",
            args: { boolean: true },
        });
        expect(result.success).toBe(false);
        expect(result.errMsg).toContain(circularError);

        await expectDocumentStopped({
            core,
            stopped,
            laterAction: {
                componentIdx: bIdx,
                actionName: "updateBoolean",
                args: { boolean: false },
            },
        });
    });

    // `returnAllStateVariables` is reached outside the queue: `DocViewer`
    // installs it as a `window` function on every page. Evaluating `n` after
    // the stop is the recursion that ran the worker out of memory, so without
    // the check this test kills the vitest worker.
    it("a state dump of a stopped document is refused without evaluating", async () => {
        const { core, resolvePathToNodeIdx, stopped } = await loadAndWatch(`
<mathInput name="i" prefill="1"/>
<function name="f">x</function>
<number name="n">
  <conditionalContent condition="$i=1">1</conditionalContent>
  <conditionalContent condition="$i=2">$$f($n)+1</conditionalContent>
</number>`);
        const iIdx = await resolvePathToNodeIdx("i");

        // a running document dumps its state as before
        await expect(
            core.returnAllStateVariables(false, true),
        ).resolves.toBeTruthy();

        await core.requestAction({
            componentIdx: iIdx,
            actionName: "updateRawValue",
            args: { rawRendererValue: "2" },
        });
        await core.requestAction({
            componentIdx: iIdx,
            actionName: "updateValue",
            args: {},
        });
        expect(stopped).toHaveLength(1);

        await expect(core.returnAllStateVariables(false, true)).rejects.toThrow(
            stopped[0],
        );
    });

    it("a stopped document evaluates nothing from outside the queue", async () => {
        // The input's keystroke schedules the debounced save, which fires
        // after the stop. Building the save evaluates `n`, which recursed
        // until the worker ran out of memory (vitest reports the worker
        // exiting unexpectedly). Terminating sends the visibility recorded
        // below as an event, which the stopped queue rejects; a terminate
        // that throws reads to the viewer as a wedged core.
        vi.useFakeTimers();
        try {
            const { core, resolvePathToNodeIdx, stopped } = await loadAndWatch(`
<p name="p"><mathInput name="i" prefill="1"/></p>
<function name="f">x</function>
<number name="n">
  <conditionalContent condition="$i=1">1</conditionalContent>
  <conditionalContent condition="$i=2">$$f($n)+1</conditionalContent>
</number>`);
            const iIdx = await resolvePathToNodeIdx("i");

            await core.requestAction({
                componentIdx: await resolvePathToNodeIdx("p"),
                actionName: "recordVisibilityChange",
                args: { isVisible: true },
            });
            await core.requestAction({
                componentIdx: iIdx,
                actionName: "updateRawValue",
                args: { rawRendererValue: "2" },
            });
            await core.requestAction({
                componentIdx: iIdx,
                actionName: "updateValue",
                args: {},
            });
            expect(stopped).toHaveLength(1);

            await vi.advanceTimersByTimeAsync(5000);
            await core.saveImmediately();
            await core.terminate();
        } finally {
            vi.useRealTimers();
        }
    });

    it("a save built before the stop is still delivered on terminate", async () => {
        // The second keystroke's save is built while the 60-second throttle
        // holds it back. The stop skips building any new save, but the held
        // one evaluates nothing to deliver, and `terminate` sends it.
        vi.useFakeTimers();
        try {
            const {
                core,
                resolvePathToNodeIdx,
                stopped,
                lastStateReport,
                pendingReports,
            } = await loadAndWatch(`
<mathInput name="i" prefill="1"/>
<function name="f">x</function>
<number name="n">
  <conditionalContent condition="$i=1">1</conditionalContent>
  <conditionalContent condition="$i=2">$$f($n)+1</conditionalContent>
</number>`);
            const iIdx = await resolvePathToNodeIdx("i");
            async function enter(value: string) {
                await core.requestAction({
                    componentIdx: iIdx,
                    actionName: "updateRawValue",
                    args: { rawRendererValue: value },
                });
                await core.requestAction({
                    componentIdx: iIdx,
                    actionName: "updateValue",
                    args: {},
                });
            }

            await enter("3");
            await vi.advanceTimersByTimeAsync(1500);
            await enter("5");
            await vi.advanceTimersByTimeAsync(1500);
            const held = pendingReports.at(-1)?.state;
            expect(held).toBeDefined();
            expect(lastStateReport.payload).not.toEqual(held);

            await enter("2");
            expect(stopped).toHaveLength(1);

            await core.terminate();
            expect(lastStateReport.payload).toEqual(held);
        } finally {
            vi.useRealTimers();
        }
    });

    it("an event queued behind the stopping update is dropped quietly", async () => {
        // The first update queues its "selected" event when it finishes, by
        // which time the second update is ahead of it in the queue. The
        // second raises the cycle, and the stop rejects the queued event,
        // which nobody awaits.
        const unhandled: unknown[] = [];
        const onUnhandled = (reason: unknown) => unhandled.push(reason);
        process.on("unhandledRejection", onUnhandled);
        try {
            const { core, resolvePathToNodeIdx, stopped } = await loadAndWatch(`
<booleanInput name="b1"/>
<booleanInput name="b"/>
<function name="f">x</function>
<conditionalContent condition="$b"><number name="t">$$f($t)</number></conditionalContent>`);
            const b1Idx = await resolvePathToNodeIdx("b1");
            const bIdx = await resolvePathToNodeIdx("b");

            const first = core.requestAction({
                componentIdx: b1Idx,
                actionName: "updateBoolean",
                args: { boolean: true },
            });
            const second = core.requestAction({
                componentIdx: bIdx,
                actionName: "updateBoolean",
                args: { boolean: true },
            });
            expect((await first).success).not.toBe(false);
            expect((await second).success).toBe(false);
            expect(stopped).toHaveLength(1);

            await new Promise((resolve) => setTimeout(resolve, 50));
            expect(unhandled).toEqual([]);
        } finally {
            process.off("unhandledRejection", onUnhandled);
        }
    });

    it("hiding a stopped document sends its visibility quietly", async () => {
        // The browser tab is hidden after the stop: the core suspends
        // visibility measuring, which sends the visibility recorded below as
        // an event that the stopped queue rejects. Nobody awaits it.
        const unhandled: unknown[] = [];
        const onUnhandled = (reason: unknown) => unhandled.push(reason);
        process.on("unhandledRejection", onUnhandled);
        vi.useFakeTimers();
        try {
            const { core, resolvePathToNodeIdx, stopped } = await loadAndWatch(`
<p name="p"><mathInput name="i" prefill="1"/></p>
<function name="f">x</function>
<number name="n">
  <conditionalContent condition="$i=1">1</conditionalContent>
  <conditionalContent condition="$i=2">$$f($n)+1</conditionalContent>
</number>`);
            const iIdx = await resolvePathToNodeIdx("i");

            await core.requestAction({
                componentIdx: await resolvePathToNodeIdx("p"),
                actionName: "recordVisibilityChange",
                args: { isVisible: true },
            });
            await vi.advanceTimersByTimeAsync(5000);
            await core.requestAction({
                componentIdx: iIdx,
                actionName: "updateRawValue",
                args: { rawRendererValue: "2" },
            });
            await core.requestAction({
                componentIdx: iIdx,
                actionName: "updateValue",
                args: {},
            });
            expect(stopped).toHaveLength(1);

            core.handleVisibilityChange(false);
            await vi.advanceTimersByTimeAsync(100);
        } finally {
            vi.useRealTimers();
        }
        try {
            await new Promise((resolve) => setTimeout(resolve, 50));
            expect(unhandled).toEqual([]);
        } finally {
            process.off("unhandledRejection", onUnhandled);
        }
    });

    it("hiding a running document logs a failed visibility suspend", async () => {
        // The rejection the stop produces is dropped (above); any other
        // failure of the unawaited suspend is logged, not left unhandled.
        const unhandled: unknown[] = [];
        const onUnhandled = (reason: unknown) => unhandled.push(reason);
        process.on("unhandledRejection", onUnhandled);
        const logged: unknown[][] = [];
        const errorSpy = vi
            .spyOn(console, "error")
            .mockImplementation((...args) => {
                logged.push(args);
            });
        try {
            const { core } = await loadAndWatch(`<p>hello</p>`);
            const failure = new Error("suspend failed");
            (core.core as any).visibilityTracker.suspendVisibilityMeasuring =
                async () => {
                    throw failure;
                };

            core.handleVisibilityChange(false);
            await new Promise((resolve) => setTimeout(resolve, 50));

            expect(unhandled).toEqual([]);
            expect(logged).toEqual([
                ["Error in visibility suspend on hide:", failure],
            ]);
        } finally {
            errorSpy.mockRestore();
            process.off("unhandledRejection", onUnhandled);
        }
    });

    it("the same switch with no cycle leaves the document running", async () => {
        const { core, resolvePathToNodeIdx, stopped } = await loadAndWatch(`
<booleanInput name="b"/>
<conditionalContent condition="$b"><text name="t">hello</text></conditionalContent>`);
        const bIdx = await resolvePathToNodeIdx("b");

        const result = await core.requestAction({
            componentIdx: bIdx,
            actionName: "updateBoolean",
            args: { boolean: true },
        });
        expect(result.success).not.toBe(false);
        expect(stopped).toHaveLength(0);
    });
});

/**
 * Doenet/DoenetML#2405: a reference inside the component it names (`$S` in
 * `S`) is replaced by the circular-dependency error, or, where the source's
 * value can stand in (a point's coordinates in a `<label>`), by that value.
 * Neither shadows the source, and a copy of `S` holds a counterpart of the
 * reference that names the copy. Updating that reference remade it on every
 * pass, as its replacement did not shadow its source, and remaking it
 * changed the copy it is in, which marked it to be updated again, until the
 * document stopped with an internal error. It should load as `S` alone does.
 */
describe("A copy of a component that references itself @group2", async () => {
    async function textsAndErrors(doenetML: string, paths: string[]) {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML,
        });
        const stateVariables = await core.returnAllStateVariables(false, true);
        const texts: Record<string, string> = {};
        for (const path of paths) {
            texts[path] =
                stateVariables[
                    await resolvePathToNodeIdx(path)
                ].stateValues.text;
        }
        const errorCodes = getDiagnosticsByType(core).errors.map((e) => e.code);
        return { texts, errorCodes };
    }

    const section = `<section name="S"><title>T</title><p name="q">hi [$S]</p></section>`;

    it("the section alone reports the reference as circular", async () => {
        const { texts, errorCodes } = await textsAndErrors(section, ["S.q"]);
        expect(texts).eqls({ "S.q": "hi []" });
        expect(errorCodes).eqls(["doenet-e0005"]);
    });

    it("a copy of the section loads and shows what the section shows", async () => {
        const { texts, errorCodes } = await textsAndErrors(
            `${section}
<section name="S2" copy="$S"/>
<p name="after">after</p>`,
            ["S.q", "S2.q", "after"],
        );
        expect(texts).eqls({
            "S.q": "hi []",
            "S2.q": "hi []",
            after: "after",
        });
        expect(errorCodes).eqls(["doenet-e0005"]);
    });

    it("a copy of a copy of the section loads", async () => {
        const { texts, errorCodes } = await textsAndErrors(
            `${section}
<section name="S2" copy="$S"/>
<section name="S3" copy="$S2"/>`,
            ["S.q", "S2.q", "S3.q"],
        );
        expect(texts).eqls({
            "S.q": "hi []",
            "S2.q": "hi []",
            "S3.q": "hi []",
        });
        expect(errorCodes).eqls(["doenet-e0005"]);
    });

    it("an extend of the section loads", async () => {
        const { texts, errorCodes } = await textsAndErrors(
            `${section}
<section name="S2" extend="$S"/>`,
            ["S.q", "S2.q"],
        );
        expect(texts).eqls({ "S.q": "hi []", "S2.q": "hi []" });
        expect(errorCodes).eqls(["doenet-e0005"]);
    });

    // The reference is an error at load (`referenceCycles.ts`), and a title
    // holding an error made at load is the default title, as it is for any
    // cycle in a title (`<title>T <math name="z" extend="$z"/></title>`).
    it("a copy of a section whose title references it loads", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `<section name="S"><title>T $S</title><p>hi</p></section>
<section name="S2" copy="$S"/>`,
        });
        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("S")].stateValues.title,
        ).eq("Section 1");
        expect(
            stateVariables[await resolvePathToNodeIdx("S2")].stateValues.title,
        ).eq("Section 2");
        expect(getDiagnosticsByType(core).errors.map((e) => e.code)).eqls([
            "doenet-e0005",
        ]);
    });

    // The same reference names the section, then another component, then
    // the section again: a change of source remakes the copy's counterpart
    // of the reference each time.
    it("a copy of a group whose reference switches between the group and another component loads", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `<mathInput name="n" prefill="1"/>
<group name="g"><text>one</text><p name="q">hi [$g[$n]]</p></group>
<group name="g2" copy="$g"/>
<p name="after">after</p>`,
        });
        const nIdx = await resolvePathToNodeIdx("n");

        async function texts() {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            const result: string[] = [];
            for (const path of ["g.q", "g2.q", "after"]) {
                result.push(
                    stateVariables[await resolvePathToNodeIdx(path)].stateValues
                        .text,
                );
            }
            return result;
        }

        expect(await texts()).eqls(["hi [one]", "hi [one]", "after"]);
        expect(getDiagnosticsByType(core).errors).eqls([]);

        await updateMathInputValue({ latex: "2", componentIdx: nIdx, core });
        expect(await texts()).eqls(["hi []", "hi []", "after"]);
        expect(getDiagnosticsByType(core).errors.map((e) => e.code)).eqls([
            "doenet-e0005",
        ]);
        // A known violation of DIAG-7: a cycle through an index that a value
        // decides is found only after load (#2473), which the end-of-load
        // assertion reports.
        expect(takeErrorsReportedAfterLoad().map((e) => e.code)).eqls([
            "doenet-e0005",
        ]);

        await updateMathInputValue({ latex: "1", componentIdx: nIdx, core });
        expect(await texts()).eqls(["hi [one]", "hi [one]", "after"]);
    });

    // In a label, the reference falls back to the point's value, which is
    // not circular. The copy's label names the copy, so it follows the copy
    // when it moves, and not the point it was copied from.
    it("a copy of a point whose label references it loads, and its label follows it", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `<graph><point name="P"><label>a $P</label></point>
<point name="P2" copy="$P"/></graph>`,
        });
        const PIdx = await resolvePathToNodeIdx("P");
        const P2Idx = await resolvePathToNodeIdx("P2");

        async function labels() {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            return [
                stateVariables[PIdx].stateValues.label,
                stateVariables[P2Idx].stateValues.label,
            ];
        }

        const origin = "a \\(\\left( 0, 0 \\right)\\)";
        expect(await labels()).eqls([origin, origin]);
        expect(getDiagnosticsByType(core).errors).eqls([]);

        await movePoint({ componentIdx: P2Idx, x: 3, y: 4, core });
        expect(await labels()).eqls([origin, "a \\(\\left( 3, 4 \\right)\\)"]);

        await movePoint({ componentIdx: PIdx, x: -1, y: 2, core });
        expect(await labels()).eqls([
            "a \\(\\left( -1, 2 \\right)\\)",
            "a \\(\\left( 3, 4 \\right)\\)",
        ]);
    });
});

/**
 * Doenet/DoenetML#2418: composites that keep queuing each other to be
 * updated, through a cycle the dependency graph does not see, stopped the
 * whole document with an internal error after 100 passes. The copy in
 * Doenet/DoenetML#2405 was one before Doenet/DoenetML#2412; the stub below
 * undoes that fix, so the copy inside `S2` is remade on every pass again.
 * The copy should be reported as circular and stopped, and the rest of the
 * document should load.
 *
 * Doenet/DoenetML#2405's copy was of a `<section>` holding a reference to
 * itself, which is now an error at load (#2473). These documents hold the
 * reference in a `<p>` in a point's label, which the check at load does not
 * follow (`referenceCycles.ts`), so it is still made, and found circular,
 * when the document runs.
 */
describe("Composites whose replacements never settle @group2", async () => {
    async function withLoopingCopy<T>(run: () => Promise<T>) {
        const Copy = (await import("../../components/abstract/Copy")).default;
        const original = Copy.calculateReplacementChanges;
        const spy = vi
            .spyOn(Copy, "calculateReplacementChanges")
            .mockImplementation(async function (this: any, args: any) {
                // Forget that the copy is inside its source, so it is
                // remade, as it was before Doenet/DoenetML#2412.
                args.workspace.sourceContainsCopyBySource = [];
                return original.call(this, args);
            });
        try {
            return await run();
        } finally {
            spy.mockRestore();
        }
    }

    it("are reported as circular and stopped, and the rest of the document loads", async () => {
        await withLoopingCopy(async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `<graph><point name="S"><label><p name="q">hi [$S]</p></label></point>
<point name="S2" copy="$S"/></graph>
<p name="after">after</p>`,
            });
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            const texts: string[] = [];
            for (const path of ["S.q", "S2.q", "after"]) {
                texts.push(
                    stateVariables[await resolvePathToNodeIdx(path)].stateValues
                        .text,
                );
            }
            expect(texts).eqls(["hi []", "hi []", "after"]);

            // The copy of `$S` inside `S2`, which kept being remade.
            const stopped = Object.values(core.core!._components)
                .filter((c: any) => c?.isInErrorState)
                .map((c: any) => [c.componentType, c.position?.start.line]);
            expect(stopped).eqls([["_copy", 1]]);

            // Reported with the same code, at the same place, as `$S` in `S`
            // is, so the two records are one.
            expect(
                getDiagnosticsByType(core).errors.map((e) => [
                    e.code,
                    e.message,
                    e.position?.start.line,
                ]),
            ).eqls([["doenet-e0005", "Circular dependency detected.", 1]]);
        });
    });

    // `S3` copies `S2`, so its copy is remade on every pass too, but only
    // because the copy inside `S2` is; it queues nothing that comes back to
    // it. It should be left running, and not reported as circular.
    it("leaves out a composite that is only downstream of the loop", async () => {
        await withLoopingCopy(async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `<graph><point name="S"><label><p name="q">hi [$S]</p></label></point>
<point name="S2" copy="$S"/>
<point name="S3" copy="$S2"/></graph>`,
            });
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(
                stateVariables[await resolvePathToNodeIdx("S3.q")].stateValues
                    .text,
            ).eq("hi []");

            // Only the copies of `$S` inside `S2` and inside `S3`, which
            // keep remaking themselves, not the copy that makes `S3`.
            const stopped = Object.values(core.core!._components)
                .filter((c: any) => c?.isInErrorState)
                .map((c: any) => [c.componentType, c.position?.start.line]);
            expect(stopped).eqls([
                ["_copy", 1],
                ["_copy", 1],
            ]);
            expect(
                getDiagnosticsByType(core).errors.map((e) => [
                    e.code,
                    e.position?.start.line,
                ]),
            ).eqls([["doenet-e0005", 1]]);
        });
    });
});

describe("Composites that queue each other in turn @group2", async () => {
    it("are both reported and stopped", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `<mathInput name="mi" prefill="1"/>
<conditionalContent name="a" condition="$mi > 1"><p>big</p></conditionalContent>
<conditionalContent name="b" condition="$mi > 1"><p>big</p></conditionalContent>`,
        });
        const miIdx = await resolvePathToNodeIdx("mi");
        const aIdx = await resolvePathToNodeIdx("a");
        const bIdx = await resolvePathToNodeIdx("b");

        const ConditionalContent = (
            await import("../../components/ConditionalContent")
        ).default;
        const original = ConditionalContent.calculateReplacementChanges;
        const spy = vi
            .spyOn(ConditionalContent, "calculateReplacementChanges")
            .mockImplementation(async function (this: any, args: any) {
                // Each asks for the other to be updated.
                core.core!.updateInfo.compositesToUpdateReplacements.add(
                    args.component.componentIdx === aIdx ? bIdx : aIdx,
                );
                return original.call(this, args);
            });
        try {
            await updateMathInputValue({
                latex: "2",
                componentIdx: miIdx,
                core,
            });
        } finally {
            spy.mockRestore();
        }

        expect([
            core.core!._components[aIdx].isInErrorState,
            core.core!._components[bIdx].isInErrorState,
        ]).eqls([true, true]);
        expect(
            getDiagnosticsByType(core).errors.map((e) => [
                e.code,
                e.position?.start.line,
            ]),
        ).eqls([
            ["doenet-e0005", 2],
            ["doenet-e0005", 3],
        ]);
        // A loop that only a bug in a composite makes is caught after load,
        // which the end-of-load assertion reports (DIAG-7).
        expect(takeErrorsReportedAfterLoad().map((e) => e.code)).eqls([
            "doenet-e0005",
            "doenet-e0005",
        ]);
    });
});

describe("A composite that queues itself on every pass @group2", async () => {
    it("is reported as circular at its own position and stopped, and the document keeps working", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `<mathInput name="mi" prefill="1"/>
<conditionalContent name="cc" condition="$mi > 1"><p>big</p></conditionalContent>
<p name="echo">$mi</p>`,
        });
        const miIdx = await resolvePathToNodeIdx("mi");
        const ccIdx = await resolvePathToNodeIdx("cc");
        const echoIdx = await resolvePathToNodeIdx("echo");

        const ConditionalContent = (
            await import("../../components/ConditionalContent")
        ).default;
        const original = ConditionalContent.calculateReplacementChanges;
        let nCalls = 0;
        const spy = vi
            .spyOn(ConditionalContent, "calculateReplacementChanges")
            .mockImplementation(async function (this: any, args: any) {
                nCalls++;
                // Ask to be updated again, without end.
                core.core!.updateInfo.compositesToUpdateReplacements.add(
                    args.component.componentIdx,
                );
                return original.call(this, args);
            });
        try {
            await updateMathInputValue({
                latex: "2",
                componentIdx: miIdx,
                core,
            });
        } finally {
            spy.mockRestore();
        }

        // Stopped after 100 passes, not made to run without end.
        expect(nCalls).greaterThan(100);
        expect(nCalls).lessThan(200);
        expect(core.core!._components[ccIdx].isInErrorState).eq(true);
        expect(
            getDiagnosticsByType(core).errors.map((e) => [
                e.code,
                e.message,
                e.position?.start.line,
            ]),
        ).eqls([
            [
                "doenet-e0005",
                "Circular dependency detected involving `<conditionalContent>` component.",
                2,
            ],
        ]);
        // caught after load, which the end-of-load assertion reports (DIAG-7)
        expect(takeErrorsReportedAfterLoad().map((e) => e.code)).eqls([
            "doenet-e0005",
        ]);

        // The rest of the document still responds.
        await updateMathInputValue({ latex: "3", componentIdx: miIdx, core });
        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables[echoIdx].stateValues.text).eq("3");
    });
});

describe("Composites in a loop that none can be singled out of @group2", async () => {
    it("stop the update with an error that names them", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `<mathInput name="mi" prefill="1"/>
<conditionalContent name="cc" condition="$mi > 1"><p>big</p></conditionalContent>`,
        });
        const miIdx = await resolvePathToNodeIdx("mi");

        const ConditionalContent = (
            await import("../../components/ConditionalContent")
        ).default;
        const original = ConditionalContent.calculateReplacementChanges;
        const queueSpy = vi
            .spyOn(ConditionalContent, "calculateReplacementChanges")
            .mockImplementation(async function (this: any, args: any) {
                core.core!.updateInfo.compositesToUpdateReplacements.add(
                    args.component.componentIdx,
                );
                return original.call(this, args);
            });
        // As if no composite had been queued in every recent pass, which is
        // what happens when the components looping are not composites.
        const loopingSpy = vi
            .spyOn(core.core!.essentialValueWriter, "loopingComposites")
            .mockReturnValue([]);
        // The update that hits the loop is stopped, and the error is
        // logged rather than returned to the action.
        const errorSpy = vi
            .spyOn(console, "error")
            .mockImplementation(() => {});
        let nLoopingCalls: number;
        let logged: string[];
        try {
            await updateMathInputValue({
                latex: "2",
                componentIdx: miIdx,
                core,
            }).catch(() => {});
        } finally {
            nLoopingCalls = loopingSpy.mock.calls.length;
            logged = errorSpy.mock.calls.map((args) => String(args[0]));
            queueSpy.mockRestore();
            loopingSpy.mockRestore();
            errorSpy.mockRestore();
        }

        expect(nLoopingCalls).eq(1);
        expect(logged).toContain(
            "Error: Seem to have an infinite loop while calculating replacement changes. Circular dependency involving these components: <conditionalContent> (line 2).",
        );
    });
});
