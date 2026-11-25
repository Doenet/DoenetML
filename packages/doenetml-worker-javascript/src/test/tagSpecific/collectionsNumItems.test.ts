import { afterEach, describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import { setListFormsEnabled } from "../../utils/dast/listForms";
import { setRepeatListsEnabled } from "../../utils/dast/repeatLists";
import { updateMathInputValue } from "../utils/actions";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

/**
 * A collection's own properties (COLL-2, D41 decision 2): `numItems`, the
 * number of items an index selects among, on every collection however it is
 * built, and the settings every component has. They win over the items'
 * properties of the same name. Nothing else is the collection's own: the
 * aliases a `<collect>`, `<sort>` or `<shuffle>` built as a list inherited
 * from the list it is built on name nothing, as after the composite (COMP-4,
 * #2271). Any other property after a collection names nothing, with a
 * warning suggesting an index (D59, `doenet-w0200`).
 *
 * Each document is loaded with `<collect>`, `<sort>`, `<shuffle>` and
 * `<repeat>` built as lists where they can be, and as composites, and what
 * an author sees must be the same.
 */
describe("A collection's own properties @group4", () => {
    afterEach(() => {
        setListFormsEnabled(true);
        setRepeatListsEnabled(true);
    });

    async function load(doenetML: string, asLists: boolean) {
        setListFormsEnabled(asLists);
        setRepeatListsEnabled(asLists);
        try {
            return await createTestCore({ doenetML });
        } finally {
            setListFormsEnabled(true);
            setRepeatListsEnabled(true);
        }
    }

    /**
     * The text of each `<p>` named in `names`, the types of the components
     * named in `types`, and the codes of the diagnostics with their lines,
     * for each build.
     */
    async function bothBuilds({
        doenetML,
        names,
        types = [],
    }: {
        doenetML: string;
        names: string[];
        types?: string[];
    }) {
        const results: {
            texts: Record<string, string>;
            types: Record<string, string>;
            diagnostics: string[];
        }[] = [];
        for (const asLists of [true, false]) {
            const { core, resolvePathToNodeIdx } = await load(
                doenetML,
                asLists,
            );
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            const texts: Record<string, string> = {};
            for (const name of names) {
                texts[name] =
                    stateVariables[
                        await resolvePathToNodeIdx(name)
                    ].stateValues.text;
            }
            const typesFound: Record<string, string> = {};
            for (const name of types) {
                typesFound[name] =
                    stateVariables[
                        await resolvePathToNodeIdx(name)
                    ].componentType;
            }
            const diagnostics = (core as any).core.diagnostics
                .filter((d: any) => !d.code?.startsWith("doenet-a"))
                .map(
                    (d: any) =>
                        `${d.type} ${d.code} line ${d.position?.start.line}`,
                )
                .sort();
            results.push({ texts, types: typesFound, diagnostics });
        }
        return { lists: results[0], composites: results[1] };
    }

    it("numItems on every collection, built either way", async () => {
        const collections: [string, string, string][] = [
            // [name, DoenetML, numItems]
            ["ml", `<mathList name="ml">x y z</mathList>`, "3"],
            ["nl", `<numberList name="nl">1 2 3 4</numberList>`, "4"],
            ["tl", `<textList name="tl">a b</textList>`, "2"],
            ["bl", `<booleanList name="bl">true false</booleanList>`, "2"],
            ["il", `<intervalList name="il">(1,2) [3,4]</intervalList>`, "2"],
            ["pl", `<pointList name="pl">(1,2) (3,4)</pointList>`, "2"],
            ["vl", `<vectorList name="vl">(1,2) (3,4) (5,6)</vectorList>`, "3"],
            ["tul", `<tupleList name="tul">(1,2) (3,4)</tupleList>`, "2"],
            ["sq", `<sequence name="sq" from="3" to="7"/>`, "5"],
            [
                "sfs",
                `<selectFromSequence name="sfs" from="1" to="10" numToSelect="3"/>`,
                "3",
            ],
            ["srn", `<selectRandomNumbers name="srn" numToSelect="2"/>`, "2"],
            ["sarn", `<sampleRandomNumbers name="sarn" numSamples="4"/>`, "4"],
            [
                "spn",
                `<selectPrimeNumbers name="spn" numToSelect="2" to="20"/>`,
                "2",
            ],
            [
                "sapn",
                `<samplePrimeNumbers name="sapn" numSamples="3" to="20"/>`,
                "3",
            ],
            ["cs", `<cumulativeSum name="cs">1 2 3</cumulativeSum>`, "3"],
            ["df", `<differences name="df">1 4 9</differences>`, "2"],
            [
                "cp",
                `<graph name="g"><point>(1,2)</point><point>(3,4)</point></graph><collect name="cp" from="$g" componentType="point"/>`,
                "2",
            ],
            [
                "cpp",
                `<section name="sec"><p>A</p><p>B</p><p>C</p></section><collect name="cpp" from="$sec" componentType="p"/>`,
                "3",
            ],
            ["so", `<sort name="so">3 1 2</sort>`, "3"],
            ["sh", `<shuffle name="sh">3 1 2 4</shuffle>`, "4"],
            [
                "rp",
                `<repeat name="rp" for="1 2 3" valueName="v"><number>$v</number></repeat>`,
                "3",
            ],
            [
                "rpp",
                `<repeat name="rpp" for="1 2" valueName="v"><p>$v</p></repeat>`,
                "2",
            ],
            [
                "rfs",
                `<repeatForSequence name="rfs" length="4" valueName="v"><math>$v</math></repeatForSequence>`,
                "4",
            ],
            [
                "sel",
                `<select name="sel" numToSelect="2"><option><math>x</math></option><option><math>y</math></option><option><math>z</math></option></select>`,
                "2",
            ],
            [
                "fi",
                `<functionIterates name="fi" function="2x" initialValue="1" numIterates="5"/>`,
                "5",
            ],
        ];

        const doenetML =
            collections.map(([, dml]) => dml).join("\n") +
            "\n" +
            collections
                .map(([name]) => `<p name="n_${name}">$${name}.numItems</p>`)
                .join("\n");
        const { lists, composites } = await bothBuilds({
            doenetML,
            names: collections.map(([name]) => `n_${name}`),
            types: ["cp", "so", "sh"],
        });
        // (a property after a repeat keeps it a composite: `repeatLists.ts`)
        expect(lists.types).toEqual({
            cp: "_collectList",
            so: "_sortList",
            sh: "_shuffleList",
        });
        expect(composites.types).toEqual({
            cp: "collect",
            so: "sort",
            sh: "shuffle",
        });
        const expected = Object.fromEntries(
            collections.map(([name, , numItems]) => [`n_${name}`, numItems]),
        );
        expect(lists.texts).toEqual(expected);
        expect(composites.texts).toEqual(expected);
        expect(lists.diagnostics).toEqual([]);
        expect(composites.diagnostics).toEqual([]);
    });

    it("a conditionalContent or a one-pick chooser has no numItems (D72)", async () => {
        // It shows one thing, and is not a collection: `numItems` names
        // nothing, as for the math it shows. (It was 1, or 0 while no case
        // was shown.)
        const { lists, composites } = await bothBuilds({
            doenetML: `
<conditionalContent name="cc"><case condition="true"><math>q</math></case></conditionalContent>
<select name="s"><option><math>x</math></option><option><math>y</math></option></select>
<selectFromSequence name="sfs" from="1" to="10"/>
<p name="p1">$cc.numItems</p>
<p name="p2">$s.numItems</p>
<p name="p3">$sfs.numItems</p>
`,
            names: ["p1", "p2", "p3"],
        });
        const expected = { p1: "＿", p2: "＿", p3: "＿" };
        expect(lists.texts).toEqual(expected);
        expect(composites.texts).toEqual(expected);
        const warnings = [
            "warning doenet-w0104 line 5",
            "warning doenet-w0104 line 6",
            "warning doenet-w0104 line 7",
        ];
        expect(lists.diagnostics).toEqual(warnings);
        expect(composites.diagnostics).toEqual(warnings);
    });

    it("numItems follows the items", async () => {
        const doenetML = `
<mathInput name="n" prefill="2" />
<repeatForSequence name="r" length="$n" valueName="v"><p>$v</p></repeatForSequence>
<sequence name="sq" length="$n" />
<p name="pr">$r.numItems</p>
<p name="psq">$sq.numItems</p>
`;
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML,
        });
        async function texts() {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            const result: string[] = [];
            for (const name of ["pr", "psq"]) {
                result.push(
                    stateVariables[await resolvePathToNodeIdx(name)].stateValues
                        .text,
                );
            }
            return result;
        }
        expect(await texts()).toEqual(["2", "2"]);
        await updateMathInputValue({
            latex: "4",
            componentIdx: await resolvePathToNodeIdx("n"),
            core,
        });
        expect(await texts()).toEqual(["4", "4"]);
    });

    it("numItems wins over the items' numItems; an item that is a collection is reached by index", async () => {
        const { lists, composites } = await bothBuilds({
            doenetML: `
<repeat name="r" for="1 2 3" valueName="v"><sequence length="$v"/></repeat>
<select name="s" numToSelect="2"><option><sequence length="4"/></option><option><sequence length="4"/></option></select>
<p name="p1">$r.numItems</p>
<p name="p2">$r[3].numItems</p>
<p name="p3">$s.numItems</p>
<p name="p4">$s[1].numItems</p>
`,
            names: ["p1", "p2", "p3", "p4"],
        });
        const expected = { p1: "3", p2: "3", p3: "2", p4: "4" };
        expect(lists.texts).toEqual(expected);
        expect(composites.texts).toEqual(expected);
        expect(lists.diagnostics).toEqual([]);
    });

    it("text a shuffle leaves out is not an item", async () => {
        const { lists, composites } = await bothBuilds({
            doenetML: `
<div><shuffle name="sh"><p>a</p>, <p>b</p></shuffle></div>
<p name="p1">$sh.numItems</p>
<p name="p2">$sh[3].text</p>
`,
            names: ["p1", "p2"],
        });
        // `numItems` was 3, counting the `, `, while `$sh[3]` reports that
        // the shuffle has only 2 items.
        const expected = { p1: "2", p2: "＿" };
        expect(lists.texts).toEqual(expected);
        expect(composites.texts).toEqual(expected);
        expect(lists.diagnostics).toEqual([
            "warning doenet-w0015 line 2",
            "warning doenet-w0181 line 4",
        ]);
    });

    it("a group holding one collection has its numItems and settings (COLL-3), built either way", async () => {
        const { lists, composites } = await bothBuilds({
            doenetML: `
<repeat name="r" for="1 2" valueName="v"><point name="P">($v,0)</point></repeat>
<group name="gp"><point>(1,2)</point><point>(3,4)</point></group>
<collect name="c" from="$gp" componentType="point"/>
<sort name="so"><number>3</number><number>1</number><number>2</number></sort>
<conditionalContent name="cc"><case condition="true"><point>(5,6)</point></case></conditionalContent>
<group name="gr">$r</group>
<group name="gc">$c</group>
<group name="gs">$so</group>
<group name="gcc">$cc</group>
<group name="gw"><repeat for="1 2 3" valueName="v"><point>($v,0)</point></repeat></group>
<p name="p1">$gr.numItems</p>
<p name="p2">$gc.numItems</p>
<p name="p3">$gs.numItems</p>
<p name="p4">$gcc.numItems</p>
<p name="p5">$gw.numItems</p>
<p name="p6">$gr.fixed</p>
<p name="p7">$gr.x</p>
<p name="p8">$gr.P.x</p>
`,
            names: ["p1", "p2", "p3", "p4", "p5", "p6", "p7", "p8"],
        });
        // Before: the items' `numItems` (a blank, `doenet-w0104`) and each
        // item's `fixed`, except where the collection was built as a list.
        // A `<conditionalContent>` is not a collection (D72): `gcc` holds
        // the point it shows, which has no `numItems`.
        const expected = {
            p1: "2",
            p2: "2",
            p3: "3",
            p4: "＿",
            p5: "3",
            p6: "false",
            // Any other property or name is the collection's: names nothing
            // (D59; it was each item's under D41).
            p7: "＿",
            p8: "＿",
        };
        expect(lists.texts).toEqual(expected);
        expect(composites.texts).toEqual(expected);
        const warnings = [
            "warning doenet-w0104 line 15",
            "warning doenet-w0200 line 18",
            "warning doenet-w0200 line 19",
        ];
        expect(lists.diagnostics).toEqual(warnings);
        expect(composites.diagnostics).toEqual(warnings);
    });

    it("an alias a collect, sort or shuffle would inherit from a list names nothing, built either way", async () => {
        const doenetML = `
<graph name="g">
  <point>(1,2)</point><point>(3,4)</point>
  <vector>(1,0)</vector>
</graph>
<section name="sec"><interval>(1,2)</interval><interval>[3,4]</interval></section>
<collect name="cp" from="$g" componentType="point"/>
<collect name="cv" from="$g" componentType="vector"/>
<collect name="ci" from="$sec" componentType="interval"/>
<sort name="so">3 1 2</sort>
<shuffle name="sh"><point>(1,2)</point><point>(3,4)</point></shuffle>
<p name="p1">$cp.numPoints</p>
<p name="p2">$cp.numComponents</p>
<p name="p3">$cp.numValues</p>
<p name="p4">$cv.numVectors</p>
<p name="p5">$ci.numIntervals</p>
<p name="p6">$so.numValues</p>
<p name="p7">$so.maxNumber</p>
<p name="p8">$so.unordered</p>
<p name="p9">$sh.numPoints</p>
<p name="p10">$cp.numItems $cv.numItems $ci.numItems $so.numItems $sh.numItems</p>
<p name="p11">$cp.x</p>
<p name="p12">$sh.numDimensions</p>
`;
        const names = [
            "p1",
            "p2",
            "p3",
            "p4",
            "p5",
            "p6",
            "p7",
            "p8",
            "p9",
            "p10",
            "p11",
            "p12",
        ];
        const { lists, composites } = await bothBuilds({
            doenetML,
            names,
            types: ["cp", "cv", "ci", "so", "sh"],
        });
        expect(Object.values(lists.types)).toEqual([
            "_collectList",
            "_collectList",
            "_collectList",
            "_sortList",
            "_shuffleList",
        ]);
        expect(Object.values(composites.types)).toEqual([
            "collect",
            "collect",
            "collect",
            "sort",
            "shuffle",
        ]);
        expect(lists.texts).toEqual(composites.texts);
        expect(lists.texts.p10).toEqual("2 1 2 3 2");
        // any other property after the collection names nothing (D59; it
        // was each item's under D41)
        expect(lists.texts.p11).toEqual("＿");
        expect(lists.texts.p12).toEqual("＿");
        for (const name of names.slice(0, 9)) {
            expect(lists.texts[name]).toEqual("＿");
        }
        // each names nothing, with the warning that suggests an index
        const expected = [12, 13, 14, 15, 16, 17, 18, 19, 20, 22, 23]
            .map((line) => `warning doenet-w0200 line ${line}`)
            .sort();
        expect(lists.diagnostics).toEqual(expected);
        expect(composites.diagnostics).toEqual(expected);
    });

    it("the lists an author writes keep their older names for the count", async () => {
        const { lists } = await bothBuilds({
            doenetML: `
<pointList name="pl">(1,2) (3,4)</pointList>
<vectorList name="vl">(1,2)</vectorList>
<intervalList name="il">(1,2) (3,4) (5,6)</intervalList>
<numberList name="nl">1 2 3 4</numberList>
<p name="p1">$pl.numPoints $pl.numComponents $pl.numValues $pl.numItems</p>
<p name="p2">$vl.numVectors $il.numIntervals $nl.numComponents $nl.numValues</p>
`,
            names: ["p1", "p2"],
        });
        expect(lists.texts).toEqual({ p1: "2 2 2 2", p2: "1 3 4 4" });
        expect(lists.diagnostics).toEqual([]);
    });

    it("a polygon's vertices from a collect of points, built either way (#2270)", async () => {
        const { lists, composites } = await bothBuilds({
            doenetML: `
<graph name="g"><point>(1,2)</point><point>(3,4)</point><point>(5,0)</point></graph>
<collect name="c" from="$g" componentType="point"/>
<graph><polygon name="poly" vertices="$c"/></graph>
<p name="p">$poly.numVertices</p>
`,
            names: ["p"],
        });
        expect(lists.texts).toEqual({ p: "3" });
        expect(composites.texts).toEqual({ p: "3" });
    });

    it("a collection's settings are its own", async () => {
        const { lists, composites } = await bothBuilds({
            doenetML: `
<pointList name="pl"><point fixed>(1,2)</point> (3,4)</pointList>
<sequence name="sq" length="2"/>
<repeat name="r" for="1 2" valueName="v"><point fixed>($v, 0)</point></repeat>
<select name="s" numToSelect="2"><option><point fixed>(1,2)</point></option><option><point fixed>(3,4)</point></option></select>
<conditionalContent name="cc"><case condition="true"><point fixed>(5,6)</point></case></conditionalContent>
<graph name="g"><point fixed>(1,2)</point><point>(3,4)</point></graph>
<collect name="c" from="$g" componentType="point"/>
<p name="p1">$pl.fixed $sq.fixed $r.fixed $s.fixed $cc.fixed $c.fixed</p>
<p name="p2">$pl.hide $sq.hide $r.hide $s.hide $cc.hide $c.hide</p>
<p name="p3">$pl.disabled $r.disabled $s.disabled $cc.disabled $c.disabled</p>
<p name="p4">$pl[1].fixed $r[1].fixed $s[1].fixed $c[1].fixed</p>
`,
            names: ["p1", "p2", "p3", "p4"],
        });
        const expected = {
            p1: "false false false false false false",
            p2: "false false false false false false",
            p3: "false false false false false",
            // an item's own, by index (a `<conditionalContent>` has no
            // items: `$cc[1]` is the point's first coordinate, D72)
            p4: "true true true true",
        };
        expect(lists.texts).toEqual(expected);
        expect(composites.texts).toEqual(expected);
        expect(lists.diagnostics).toEqual([]);
        expect(composites.diagnostics).toEqual([]);
    });

    it("a collection's own properties in another case name nothing, built either way (D51)", async () => {
        // As any property in another case (`$P.X`): names are matched
        // exactly. Before, `$s.numitems` was the sort's own as a list and
        // named nothing after the composite, and `$s.Fixed` was the sort's
        // own as a list and each item's after the composite (#2569 item 5).
        const { lists, composites } = await bothBuilds({
            doenetML: `
<repeat name="r" for="1 2" valueName="v"><point fixed>($v, 0)</point></repeat>
<select name="s" numToSelect="2"><option><point fixed>(1,2)</point></option><option><point fixed>(3,4)</point></option></select>
<collect name="c" from="$r" componentType="point"/>
<sort name="so" sortByProp="x">$c</sort>
<shuffle name="sh"><point fixed>(1,2)</point><point fixed>(3,4)</point></shuffle>
<p name="p1">$r.numitems $s.NUMITEMS $c.NumItems $so.numitems $sh.numitems</p>
<p name="p2">$r.Fixed $s.FIXED $c.Fixed $so.Fixed $sh.Fixed</p>
<p name="p3">$r.numItems $s.numItems $c.numItems $so.numItems $sh.numItems</p>
`,
            names: ["p1", "p2", "p3"],
        });
        const expected = {
            p1: "＿ ＿ ＿ ＿ ＿",
            p2: "＿ ＿ ＿ ＿ ＿",
            p3: "2 2 2 2 2",
        };
        expect(lists.texts).toEqual(expected);
        expect(composites.texts).toEqual(expected);
        const missing = [
            ...Array(5).fill("warning doenet-w0104 line 7"),
            ...Array(5).fill("warning doenet-w0104 line 8"),
        ];
        expect(lists.diagnostics).toEqual(missing);
        expect(composites.diagnostics).toEqual(missing);
    });

    it("a collection's attributes are not properties of its own", async () => {
        const { lists, composites } = await bothBuilds({
            doenetML: `
<graph name="g"><point>(1,2)</point></graph>
<collect name="c" from="$g" componentType="point"/>
<repeatForSequence name="r" length="2"><math>x</math></repeatForSequence>
<sequence name="sq" length="2"/>
<p name="p1">$c.from</p>
<p name="p2">$r.length</p>
<p name="p3">$sq.length</p>
`,
            names: ["p1", "p2", "p3"],
        });
        expect(lists.texts).toEqual({ p1: "＿", p2: "＿", p3: "＿" });
        expect(composites.texts).toEqual(lists.texts);
    });

    it("an attribute of a collection is not a property of its own, so names nothing (D41 decision 2, D59)", async () => {
        // Before: each of these was the collection's attribute (`$c.maxNumber`
        // was `5`, `$sel.numToSelect` `2`, `$fi.numIterates` `2`, …).
        const { lists, composites } = await bothBuilds({
            doenetML: `
<graph name="g"><point name="A">(1,2)</point><point>(3,4)</point></graph>
<collect name="c" from="$g" componentType="point" maxNumber="5"/>
<collect name="cm" from="$ml" componentType="math" maxNumber="5"/>
<mathList name="ml">a b</mathList>
<sort name="s" sortVectorsBy="angle" sortByComponent="1">$A <point>(0,1)</point></sort>
<shuffle name="sh">$A <point>(0,1)</point></shuffle>
<select name="sel" numToSelect="2" withReplacement><option><math>1</math></option><option><math>2</math></option></select>
<functionIterates name="fi" function="2x" initialValue="1" numIterates="2" forceSymbolic/>
<selectFromSequence name="sfs" from="1" to="10" numToSelect="2" sort withReplacement/>
<searchSorted name="ss" target="2" side="right">1 2 3</searchSorted>
<binCounts name="bc" bins="0 2 4" closed="left">1 3</binCounts>
<cumulativeSum name="cs" forceNumeric>1 2</cumulativeSum>
<sortIndices name="si" sortVectorsBy="angle">$A <point>(0,1)</point></sortIndices>
<p name="p1">[$c.maxNumber][$cm.maxNumber][$s.sortVectorsBy][$s.sortByComponent]</p>
<p name="p2">[$sel.numToSelect][$sel.withReplacement][$fi.numIterates][$fi.forceSymbolic]</p>
<p name="p3">[$sfs.sort][$sfs.withReplacement][$sfs.numToSelect][$ss.side][$bc.closed][$cs.forceNumeric][$si.sortVectorsBy]</p>
<p name="p4">[$c.numItems][$sel.numItems][$fi.numItems][$c.hide][$s.fixed][$c.x][$sh.numItems]</p>
`,
            names: ["p1", "p2", "p3", "p4"],
        });
        expect(lists.texts).toEqual({
            p1: "[＿][＿][＿][＿]",
            p2: "[＿][＿][＿][＿]",
            p3: "[＿][＿][＿][＿][＿][＿][＿]",
            // `$c.x` names nothing (D59; it was each item's under D41)
            p4: "[2][2][2][false][false][＿][2]",
        });
        expect(composites.texts).toEqual(lists.texts);
        expect(composites.diagnostics).toEqual(lists.diagnostics);
        // No collection is in error: a property of a component in error
        // reports nothing more (DIAG-5), so it would not test this.
        expect(lists.diagnostics.filter((d) => d.startsWith("error"))).toEqual(
            [],
        );
        // Each names nothing, being no property of the collection's own, with
        // the warning that suggests an index (`doenet-w0200`, D59; under D41
        // it was read of each item, `doenet-w0104`).
        expect(lists.diagnostics.filter((d) => d.includes("w0200"))).toEqual(
            Array(16)
                .fill(0)
                .map(
                    (_, i) =>
                        `warning doenet-w0200 line ${i < 4 ? 15 : i < 8 ? 16 : i < 15 ? 17 : 18}`,
                ),
        );
    });

    it("how a list you write reads its maths is not a property of it", async () => {
        // Before: `$ml.splitSymbols` was `false`, `$ml.functionSymbols` `g`.
        const { lists, composites } = await bothBuilds({
            doenetML: `
<mathList name="ml" splitSymbols="false" functionSymbols="g">ab g(x)</mathList>
<p name="p1">[$ml.splitSymbols][$ml.functionSymbols][$ml.numItems]</p>
`,
            names: ["p1"],
        });
        expect(lists.texts).toEqual({ p1: "[＿][＿][2]" });
        expect(composites.texts).toEqual(lists.texts);
        // names nothing, as no property of the list's own (D59)
        expect(lists.diagnostics).toEqual([
            "warning doenet-w0200 line 3",
            "warning doenet-w0200 line 3",
        ]);
    });

    it("keeps an attribute documented as a property of a list, a tally or a sampler", async () => {
        // An authored list's `maxNumber`, `unordered` and `mergeMathLists`,
        // a `<tally>`'s `categories` (those that turned up), and the
        // distribution a sampler draws from (the expected `mean`). D41 leaves
        // the older properties of authored lists open.
        const { lists, composites } = await bothBuilds({
            doenetML: `
<mathList name="ml" maxNumber="3" unordered>a b</mathList>
<tally name="t">a b a</tally>
<sampleRandomNumbers name="srn" numSamples="2" from="1" to="3" type="uniform"/>
<sampleMultivariateRandomNumber name="smv" type="hypergeometric" numInCategories="5 3 2" numDraws="4"/>
<p name="p1">[$ml.maxNumber][$ml.unordered][$ml.mergeMathLists][$t.categories]</p>
<p name="p2">[$srn.mean][$srn.type][$srn.from][$smv.numTotal]</p>
<p name="p3">[$srn.numSamples]</p>
`,
            names: ["p1", "p2", "p3"],
        });
        expect(lists.texts).toEqual({
            p1: "[3][true][false][a, b]",
            p2: "[2][uniform][1][10]",
            p3: "[＿]",
        });
        expect(composites.texts).toEqual(lists.texts);
    });
});
