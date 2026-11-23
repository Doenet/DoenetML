import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import { getDiagnosticsByType } from "../utils/diagnostics";
import { setLoadCycleBackstop } from "../../utils/loadCycleBlame";

vi.stubGlobal("postMessage", vi.fn());
vi.mock("hyperformula");

/**
 * The run-time backstop for cycles at load (D57, D14, NAME-7, #2623 item 1).
 * A circular dependency the load-time checks don't predict, thrown while the
 * document loads, is blamed on one authored node on the cycle, and the
 * document is built again with that node as `doenet-e0005`. The rest
 * renders.
 */
describe("A circular dependency at load becomes a located e0005 @group2", () => {
    /**
     * Load `doenetML`, check that it reports one error, `doenet-e0005`,
     * marked at `blamed` (the text it covers, on one line), and that the
     * `<p name="p">` renders `hi`. Returns the core.
     */
    async function expectBlamed(doenetML: string, blamed: string) {
        const result = await createTestCore({ doenetML });
        const { core, resolvePathToNodeIdx } = result;
        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("p")].stateValues.text,
            doenetML,
        ).eq("hi");
        const { errors } = getDiagnosticsByType(core);
        expect(
            errors.map((error) => error.code),
            doenetML,
        ).eqls(["doenet-e0005"]);
        const { start, end } = errors[0].position!;
        expect(start.line, doenetML).eq(end.line);
        const line = doenetML.split("\n")[start.line - 1];
        expect(line.slice(start.column - 1, end.column - 1), doenetML).eq(
            blamed,
        );
        return result;
    }

    // Each stopped the document with "Circular dependency" (#2623 item 1):
    // the load-time check of a section's number has no edge for it.
    it("shapes the section numbering check doesn't predict", async () => {
        for (const [doenetML, blamed] of [
            // a path whose value reads the number: the reference to the
            // number, written in the point, is blamed
            [
                `$r[1].x
<repeatForSequence name="r" to="1"><point>($s.sectionNumber,1)</point></repeatForSequence>
<section name="s"><p name="p">hi</p></section>`,
                "$s.sectionNumber",
            ],
            [
                `$cc.q.x
<conditionalContent name="cc"><case condition="true"><point name="q">($s.sectionNumber,1)</point></case></conditionalContent>
<section name="s"><p name="p">hi</p></section>`,
                "$s.sectionNumber",
            ],
            [
                `$sel[1].q.x
<select name="sel"><option><point name="q">($s.sectionNumber,1)</point></option></select>
<section name="s"><p name="p">hi</p></section>`,
                "$s.sectionNumber",
            ],
            // a property whose value reads the number: the reference to the
            // number, written in an attribute, is blamed, though the run
            // time's cycle names the component it is in
            [
                `$cc.hidden
<conditionalContent name="cc" hide="$s.sectionNumber=1"><p>a</p></conditionalContent>
<section name="s"><p name="p">hi</p></section>`,
                "$s.sectionNumber",
            ],
            // a section's own number reads the same numbering (D56)
            [
                `$cc.hidden
<conditionalContent name="cc" hide="$s.ownNumber=1"><p>a</p></conditionalContent>
<section name="s"><p name="p">hi</p></section>`,
                "$s.ownNumber",
            ],
            // an iteration of a repeat whose iteration reads the number (was
            // `$r.numIterations`, each iteration's, which names nothing since
            // D59)
            [
                `$r[1]
<repeatForSequence name="r" to="2"><conditionalContent condition="$s.sectionNumber=1"><p>a</p></conditionalContent></repeatForSequence>
<section name="s"><p name="p">hi</p></section>`,
                "$s.sectionNumber",
            ],
            // a group holding a section and a composite reading the number
            [
                `$g
<group name="g"><section/><conditionalContent condition="$s.sectionNumber=1"><p>a</p></conditionalContent></group>
<section name="s"><p name="p">hi</p></section>`,
                "$s.sectionNumber",
            ],
            // a name reached through an inner composite reading the number
            [
                `$cc.q
<conditionalContent name="cc"><case condition="true"><conditionalContent condition="$s.sectionNumber=1"><p name="q">a</p></conditionalContent></case></conditionalContent>
<section name="s"><p name="p">hi</p></section>`,
                "$s.sectionNumber",
            ],
            [
                `$sel[1].q
<select name="sel"><option><conditionalContent condition="$s.sectionNumber=1"><p name="q">a</p></conditionalContent></option></select>
<section name="s"><p name="p">hi</p></section>`,
                "$s.sectionNumber",
            ],
            // a collect of sections from inside a `<p>` (it ran away: "infinite
            // loop while calculating replacement changes")
            [
                `<collect from="$g" componentType="section"/>
<section name="s"/>
<group name="g"><p><repeatForSequence to="$s.sectionNumber"><section/></repeatForSequence></p></group>
<p name="p">hi</p>`,
                `<collect from="$g" componentType="section"/>`,
            ],
        ]) {
            await expectBlamed(doenetML, blamed);
        }
    });

    // Each stopped the document with "Circular dependency" (#2623 item 1),
    // through something other than the numbering.
    it("other cycles at load", async () => {
        for (const [doenetML, blamed] of [
            // a section's title read inside it, which waits for what it
            // holds: the reference to the title is blamed
            [
                `<section name="s"><p name="p">hi</p>
<conditionalContent condition="$s.title='x'"><p>a</p></conditionalContent>
</section>`,
                "$s.title",
            ],
            // the number of a section in a branch, read through the branch
            [
                `<p name="p">hi</p>
$cc.q.title
<conditionalContent name="cc"><case><section name="q"/></case></conditionalContent>`,
                "$cc.q.title",
            ],
            [
                `<p name="p">hi</p>
$r[1].q.title
<repeatForSequence name="r" to="1"><section name="q"/></repeatForSequence>`,
                "$r[1].q.title",
            ],
            // a collect inside the group it collects from
            [
                `<p name="p">hi</p>
<group name="g"><collect from="$g" componentType="p"/><p>a</p></group>`,
                `<collect from="$g" componentType="p"/>`,
            ],
        ]) {
            await expectBlamed(doenetML, blamed);
        }
    });

    // The reference to a section's number is blamed before any composite on
    // the cycle, even one written before it.
    it("blames the reference to the number first", async () => {
        await expectBlamed(
            `<repeatForSequence name="r" to="1"><point name="P">($s.sectionNumber,1)</point></repeatForSequence>
$r[1].P.x
<section name="s"><p name="p">hi</p></section>`,
            "$s.sectionNumber",
        );
    });

    // A reference to the number of a section not on the cycle, written
    // beside one to the number of a section on it, is not blamed; nor is one
    // written in what a section on the cycle holds, which is not on it.
    it("blames the reference to the number of a section on the cycle", async () => {
        await expectBlamed(
            `<section name="t"/>
$cc.hidden
<conditionalContent name="cc" hide="$t.sectionNumber=1 or $s.sectionNumber=1"><p>a</p></conditionalContent>
<section name="s"><p name="p">hi</p></section>`,
            "$s.sectionNumber",
        );
        await expectBlamed(
            `<section name="s"><p name="p">hi</p><p>$s.title</p>
<conditionalContent condition="$s.title='x'"><p>a</p></conditionalContent>
</section>`,
            "$s.title",
        );
        // the number of `t`, off the cycle, is on it only through what holds
        // its value: the composite on the cycle is blamed (rule 2), and in
        // it, the reference that makes the cycle
        await expectBlamed(
            `<section name="t"/>
<p name="p">hi</p>
<repeatForSequence to="1"><p name="q" hide="$q.text='1'">$t.sectionNumber</p></repeatForSequence>`,
            "$q.text",
        );
        // the number of `s`, on the cycle, read in an attribute the cycle
        // doesn't run through (`displayDigits`): the reference that makes
        // the cycle is blamed, not it
        await expectBlamed(
            `<p name="p">hi</p>
<section name="s" fixed="$n.fixed"/>
<number name="n" fixed="$s.fixed" displayDigits="$s.sectionNumber">1</number>`,
            "$n.fixed",
        );
        await expectBlamed(
            `<p name="p">hi</p>
<section name="s" fixed="$r[1].n.fixed"/>
<repeatForSequence name="r" to="1"><number name="n" fixed="$s.fixed" displayDigits="$s.sectionNumber">1</number></repeatForSequence>`,
            "$r[1].n.fixed",
        );
        // a copy that writes the attribute the cycle runs through: the
        // variable is the copy's (`m`'s `fixed`), not that of what it copies,
        // so the number read in `n`'s `hide`, off the cycle, is not blamed
        // (that stopped the document: the rebuild met the same cycle)
        for (const copy of [
            `<number extend="$n" name="m" fixed="$s.fixed"/>`,
            `<number copy="$n" name="m" fixed="$s.fixed"/>`,
        ]) {
            await expectBlamed(
                `<p name="p">hi</p>
<section name="s" fixed="$m.fixed"/>
<number name="n" hide="$s.sectionNumber=5">1</number>
${copy}
<section/>`,
                "$m.fixed",
            );
        }
        // the same with the copy in a repeat's template: the reference that
        // made it is an instance of the one written
        for (const copy of [
            `<number extend="$n" name="m" fixed="$s.fixed"/>`,
            `<number copy="$n" name="m" fixed="$s.fixed"/>`,
        ]) {
            await expectBlamed(
                `<p name="p">hi</p>
<section name="s" fixed="$r[1].m.fixed"/>
<number name="n" hide="$s.sectionNumber=5">1</number>
<repeatForSequence name="r" to="1">${copy}</repeatForSequence>
<section/>`,
                "$r[1].m.fixed",
            );
        }
    });

    // In a chain of copies, the reference that writes the attribute the
    // cycle runs through is blamed, not one in the middle of the chain,
    // which doesn't break the cycle (#2633 item 3). Blaming `n` stopped the
    // document; with the backstop repeating (D61 decision 2), `n` and `j`
    // were false errors beside `m`.
    it("in a chain of copies, blames the copy that writes the attribute", async () => {
        for (const kind of ["extend", "copy"]) {
            for (const chain of [
                `<number ${kind}="$k" name="m" fixed="$m.fixed"/>`,
                `<number ${kind}="$k" name="n"/>
<number ${kind}="$n" name="m" fixed="$m.fixed"/>`,
                `<number ${kind}="$k" name="j"/>
<number ${kind}="$j" name="n"/>
<number ${kind}="$n" name="m" fixed="$m.fixed"/>`,
            ]) {
                await expectBlamed(
                    `<p name="p">hi</p>
<number name="k">1</number>
${chain}`,
                    chain.split("\n").at(-1)!,
                );
            }
        }
    });

    // Of the references in one attribute, the one the cycle runs through is
    // blamed, not a reference to a section's number beside it, off the
    // cycle (#2633 item 4).
    it("blames the reference in an attribute that is on the cycle", async () => {
        await expectBlamed(
            `<p name="p">hi</p>
<section name="s" hide="$n.hide"/>
<number name="n" hide="$s.hide and $s.sectionNumber=1">1</number>`,
            "$n.hide",
        );
        // the reference to the number, when it is the one on the cycle, is
        // still blamed first
        await expectBlamed(
            `$cc.hidden
<conditionalContent name="cc" hide="$t.hidden and $s.sectionNumber=1"><p>a</p></conditionalContent>
<section name="t"/>
<section name="s"><p name="p">hi</p></section>`,
            "$s.sectionNumber",
        );
    });

    // A reference to the number written in an index is made the error too:
    // the rebuild looks for it there, and stopped the document when it didn't
    // find it (DIAG-5).
    it("blames a reference to the number in an index", async () => {
        await expectBlamed(
            `<mathList name="l">1 2 3</mathList>
$cc.hidden
<conditionalContent name="cc" hide="$l[$s.sectionNumber] > 1"><p>a</p></conditionalContent>
<section name="s"><p name="p">hi</p></section>`,
            "$s.sectionNumber",
        );
    });

    // With no reference among the components the cycle reports, the first
    // written in document order is blamed, and in it, the first reference
    // written to a component on the cycle (DIAG-4).
    it("blames a reference written in the component blamed", async () => {
        await expectBlamed(
            `<p name="p">hi</p>
<point name="P1">($P2.y, $P2.x)</point>
<point name="P2">($P1.y, $P1.x)</point>`,
            "$P2.y",
        );
        await expectBlamed(
            `<p name="p">hi</p>
<point name="P">($P.x+1, 2)</point>`,
            "$P.x",
        );
        await expectBlamed(
            `<p name="p">hi</p>
<line name="l" through="(0,0) ($l.slope+1,3)"/>`,
            "$l.slope",
        );
    });

    // With a composite blamed, the reference made the error is the one
    // written in a node on the cycle (the point), not an earlier reference
    // to that node off the cycle (`$P.y`, `$n`), which would leave the cycle
    // unbroken and the document stopped.
    it("in a composite blamed, a reference written in the cycle is the error", async () => {
        for (const [doenetML, blamed] of [
            [
                `<p name="p">hi</p>
<repeatForSequence to="2"><p>$P.y</p><point name="P">($P.x+1, 2)</point></repeatForSequence>`,
                "$P.x",
            ],
            [
                `<p name="p">hi</p>
<select><option><p>$P.y</p><point name="P">($P.x+1, 2)</point></option></select>`,
                "$P.x",
            ],
            [
                `<p name="p">hi</p>
<repeatForSequence to="1"><p>$l.slope</p><line name="l" through="(0,0) ($l.slope+1,3)"/></repeatForSequence>`,
                "$l.slope",
            ],
            [
                `<p name="p">hi</p>
<repeatForSequence to="1"><p>$n</p><number name="n" fixed="$n.fixed">1</number></repeatForSequence>`,
                "$n.fixed",
            ],
        ]) {
            await expectBlamed(doenetML, blamed);
        }
    });

    // What the composites of the load that stopped added to the resolver is
    // gone: the names they made resolve to what the rebuilt document makes.
    it("names made by composites resolve after a rebuild", async () => {
        const { core, resolvePathToNodeIdx } = await expectBlamed(
            `$r[1].x
<repeatForSequence name="r" to="1"><point>($s.sectionNumber,1)</point></repeatForSequence>
<repeatForSequence name="r2" to="2" valueName="v"><p name="q">$v</p></repeatForSequence>
$r2[2].q
<section name="s"><p name="p">hi</p></section>`,
            "$s.sectionNumber",
        );
        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("r2[2].q")].stateValues
                .text,
        ).eq("2");
    });

    // What the composites of the load that stopped added to the resolver is
    // gone: the resolver the rebuild starts from is the one saved before the
    // document was converted. Without it, the collect's copy of the `<p>`
    // from the load that stopped is still named (`g:1.p`), and the sections
    // the runaway collect made are still in the resolver.
    it("the rebuild starts from the resolver as it was before the load", async () => {
        const { rustCore } = await expectBlamed(
            `<p name="p">hi</p>
<group name="g"><collect from="$g" componentType="p"/><p name="q">a</p></group>`,
            `<collect from="$g" componentType="p"/>`,
        );
        expect(
            rustCore
                .calculate_root_names()
                .names.filter((name: string | undefined) => name),
        ).eqls(["p", "g", "g:1", "q"]);

        const { rustCore: rustCore2 } = await expectBlamed(
            `<collect from="$g" componentType="section"/>
<section name="s"/>
<group name="g"><p><repeatForSequence to="$s.sectionNumber"><section/></repeatForSequence></p></group>
<p name="p">hi</p>`,
            `<collect from="$g" componentType="section"/>`,
        );
        expect(rustCore2.calculate_root_names().names.length).lessThan(30);
    });

    // The rebuilt document is what a reload builds: the same error, and the
    // rest renders (DIAG-6, SAVE-1).
    it("a reload gives the same error", async () => {
        const doenetML = `$cc.hidden
<conditionalContent name="cc" hide="$s.sectionNumber=1"><p>a</p></conditionalContent>
<section name="s"><p name="p">hi</p></section>`;
        const { core, scoreState } = await expectBlamed(
            doenetML,
            "$s.sectionNumber",
        );
        await core.saveImmediately();
        const { core: reloaded, resolvePathToNodeIdx } = await createTestCore({
            doenetML,
            initialState: scoreState.state,
        });
        const stateVariables = await reloaded.returnAllStateVariables(
            false,
            true,
        );
        expect(
            stateVariables[await resolvePathToNodeIdx("p")].stateValues.text,
        ).eq("hi");
        expect(
            getDiagnosticsByType(reloaded).errors.map((error) => [
                error.code,
                error.position?.start.line,
                error.position?.start.column,
                error.position?.end.column,
            ]),
        ).eqls([["doenet-e0005", 2, 37, 53]]);
    });

    /**
     * Load `doenetML`, check that the `<p name="p">` renders `hi`, and return
     * the `doenet-e0005`s, each as the text it covers.
     */
    async function blamedTexts(doenetML: string) {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML,
        });
        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("p")].stateValues.text,
            doenetML,
        ).eq("hi");
        const { errors } = getDiagnosticsByType(core);
        const lines = doenetML.split("\n");
        return errors.map((error) => {
            expect(error.code, doenetML).eq("doenet-e0005");
            const { start, end } = error.position!;
            expect(start.line, doenetML).eq(end.line);
            return lines[start.line - 1].slice(
                start.column - 1,
                end.column - 1,
            );
        });
    }

    // The load is rebuilt again for each cycle it meets, keeping the nodes
    // already blamed (D61 decision 2): independent cycles are each
    // `doenet-e0005`, and the rest renders.
    it("two and three independent cycles are each blamed", async () => {
        expect(
            await blamedTexts(`<p name="p">hi</p>
<number name="n" fixed="$n.fixed">1</number>
<number name="m" fixed="$m.fixed">2</number>`),
        ).eqls(["$n.fixed", "$m.fixed"]);
        expect(
            await blamedTexts(`<number name="n" fixed="$n.fixed">1</number>
<point name="P">($P.x+1, 2)</point>
<p name="p">hi</p>
$cc.hidden
<conditionalContent name="cc" hide="$s.sectionNumber=1"><p>a</p></conditionalContent>
<section name="s"/>`),
        ).eqls(["$n.fixed", "$P.x", "$s.sectionNumber"]);
    });

    // Five rebuilds, so five independent cycles load; a sixth stops the
    // document, as before the backstop (D61 decision 2).
    it("past five rebuilds, the document stops", async () => {
        const cycles = (count: number) =>
            Array.from(
                { length: count },
                (_, i) =>
                    `<number name="n${i}" fixed="$n${i}.fixed">${i}</number>`,
            ).join("\n");
        expect(
            await blamedTexts(`<p name="p">hi</p>
${cycles(5)}`),
        ).eqls(Array.from({ length: 5 }, (_, i) => `$n${i}.fixed`));
        await expect(
            createTestCore({
                doenetML: `<p name="p">hi</p>
${cycles(6)}`,
            }),
        ).rejects.toThrow("Circular dependency");
    });

    // A host that gives no way to put the resolver back, or whose saved
    // resolver is gone, can't rebuild the document: it stops, as it did
    // before the backstop.
    it("without the resolver saved, the document stops", async () => {
        for (const resolverSave of ["none", "restoreFails"] as const) {
            await expect(
                createTestCore({
                    doenetML: `<p name="p">hi</p><number name="n" fixed="$n.fixed">1</number>`,
                    resolverSave,
                }),
                resolverSave,
            ).rejects.toThrow("Circular dependency");
        }
    });

    // Without the backstop, the shapes above stop the document, as they did
    // before it.
    it("without the backstop, the document stops", async () => {
        const was = setLoadCycleBackstop(false);
        try {
            await expect(
                createTestCore({
                    doenetML: `<p name="p">hi</p><number name="n" fixed="$n.fixed">1</number>`,
                }),
            ).rejects.toThrow("Circular dependency");
        } finally {
            setLoadCycleBackstop(was);
        }
    });
});
