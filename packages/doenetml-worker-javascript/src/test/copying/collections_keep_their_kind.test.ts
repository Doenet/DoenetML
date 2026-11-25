import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import { getDiagnosticsByType } from "../utils/diagnostics";
import { updateBooleanInputValue } from "../utils/actions";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

/**
 * A tag made from a collection keeps the collection's kind (COLL-1, D64),
 * a tag that makes its own content is made only from its own kind (D48
 * decision 2), and what an index into a `<conditionalContent>` or an
 * iteration holds is type-checked at load (REF-5, D36). Each is decided when
 * the document loads, so it is the same live and after a reload (DIAG-6,
 * DIAG-7).
 */
async function load(doenetML: string) {
    let { core, resolvePathToNodeIdx, scoreState } = await createTestCore({
        doenetML,
    });

    /** Every diagnostic, as `code: message`, errors first. */
    function diagnostics() {
        const all = getDiagnosticsByType(core);
        return [...all.errors, ...all.warnings, ...all.infos].map(
            (d: any) => `${d.code}: ${d.message}`,
        );
    }

    /** The codes of the errors reported. */
    function errorCodes() {
        return getDiagnosticsByType(core).errors.map((d: any) => d.code);
    }

    /** The type of the component `name` names, `_error` for an error. */
    async function typeOf(name: string) {
        return (core as any).core._components[await resolvePathToNodeIdx(name)]
            ?.componentType;
    }

    /** The state value `variable` of the component `name` names. */
    async function stateValue(name: string, variable: string) {
        const stateVariables = await core.returnAllStateVariables(false, true);
        return stateVariables[await resolvePathToNodeIdx(name)].stateValues[
            variable
        ];
    }

    /** The text of the component `name` names. */
    async function text(name: string) {
        return await stateValue(name, "text");
    }

    async function setBoolean(name: string, boolean: boolean) {
        await updateBooleanInputValue({
            boolean,
            componentIdx: await resolvePathToNodeIdx(name),
            core,
        });
    }

    /** Save the document's state and load it again from what was saved. */
    async function reload() {
        await core.saveImmediately();
        ({ core, resolvePathToNodeIdx, scoreState } = await createTestCore({
            doenetML,
            initialState: scoreState.state,
        }));
    }

    return {
        diagnostics,
        errorCodes,
        typeOf,
        stateValue,
        text,
        setBoolean,
        reload,
    };
}

const repeat = `<repeat name="r" for="1 2" valueName="v"><math>$v</math></repeat>`;

describe("A <group> made from a collection is an error at load (D64, #2649) @group4", () => {
    const collections: [string, string, string][] = [
        ["a repeat", repeat, "repeat"],
        [
            "a repeatForSequence",
            `<repeatForSequence name="r" length="2" valueName="v"><math>$v</math></repeatForSequence>`,
            "repeatForSequence",
        ],
        [
            "a select of several",
            `<select name="r" numToSelect="2"><option><math>1</math></option><option><math>2</math></option></select>`,
            "select",
        ],
        [
            "a select whose numToSelect is a reference",
            `<number name="n">1</number><select name="r" numToSelect="$n"><option><math>1</math></option><option><math>2</math></option></select>`,
            "select",
        ],
        [
            "a selectFromSequence of several",
            `<selectFromSequence name="r" to="5" numToSelect="2"/>`,
            "selectFromSequence",
        ],
        ["a mathList", `<mathList name="r">1 2</mathList>`, "mathList"],
        [
            "a pointList",
            `<pointList name="r">(1,2) (3,4)</pointList>`,
            "pointList",
        ],
        ["a sequence", `<sequence name="r" to="3"/>`, "sequence"],
        [
            "a collect",
            `<p name="p"><math>1</math></p><collect name="r" from="$p" componentType="math"/>`,
            "collect",
        ],
        [
            "a sort",
            `<sort name="r"><math>2</math><math>1</math></sort>`,
            "sort",
        ],
        [
            "a shuffle",
            `<shuffle name="r"><math>2</math><math>1</math></shuffle>`,
            "shuffle",
        ],
        [
            "an extend of a repeat",
            `${repeat.replace('name="r"', 'name="r0"')}<repeat name="r" extend="$r0"/>`,
            "repeat",
        ],
    ];

    for (const [label, source, tag] of collections) {
        for (const how of ["extend", "copy", "copyWithState"]) {
            it(`a group made with ${how} from ${label}`, async () => {
                const d = await load(
                    `${source}<p name="before">before</p><group name="g" ${how}="$r"/><p name="after">after</p>`,
                );
                const expected = [
                    `doenet-e0065: A \`<group>\` can't be made from \`$r\`, a \`<${tag}>\`: a \`<${tag}>\` holds many things, and keeps its kind when a tag is made from it. To put it in a group, write \`<group>$r</group>\`, with anything else the group holds beside it. To show the same \`<${tag}>\` again, write \`<${tag} ${how}="$r"/>\`.`,
                ];
                expect(
                    d.diagnostics().filter((x) => x.startsWith("doenet-e")),
                ).eqls(expected);
                expect(await d.typeOf("g")).eq("_error");
                // the rest of the document renders (DIAG-5)
                expect(await d.text("after")).eq("after");

                await d.reload();
                expect(
                    d.diagnostics().filter((x) => x.startsWith("doenet-e")),
                ).eqls(expected);
                expect(await d.typeOf("g")).eq("_error");
            });
        }
    }

    it("a group made from a collection named inside a section", async () => {
        const d = await load(
            `<section name="sec">${repeat}</section><group name="g" extend="$sec.r"/>`,
        );
        expect(d.errorCodes()).eqls(["doenet-e0065"]);
        expect(await d.typeOf("g")).eq("_error");
    });

    it("a group made from a collection named after an index", async () => {
        // in an iteration of a repeat, and in a pick of a select: before,
        // each showed nothing, with no message
        const inner = `<repeat name="r" for="1 2" valueName="j"><math>$j</math></repeat>`;
        for (const doenetML of [
            `<repeat name="outer" for="1 2" valueName="i">${inner}</repeat><group name="g" extend="$outer[1].r"/>`,
            `<select name="s" numToSelect="2"><option>${inner}</option><option>${inner}</option></select><group name="g" extend="$s[1].r"/>`,
        ]) {
            const d = await load(doenetML);
            expect(d.errorCodes()).eqls(["doenet-e0065"]);
            expect(await d.typeOf("g")).eq("_error");
        }
    });

    it("is reported at load in a case that is not true yet (DIAG-7)", async () => {
        const d = await load(
            `<booleanInput name="b"/>${repeat}<conditionalContent><case condition="$b"><group name="g" extend="$r"/></case></conditionalContent>`,
        );
        expect(d.errorCodes()).eqls(["doenet-e0065"]);
        await d.setBoolean("b", true);
        expect(d.errorCodes()).eqls(["doenet-e0065"]);
        expect(await d.typeOf("g")).eq("_error");
    });

    const allowed: [string, string][] = [
        [
            "a group",
            `<group name="h"><math>1</math><math>2</math></group><group name="g" extend="$h"/>`,
        ],
        [
            "a group holding a collection",
            `${repeat}<group name="h">$r</group><group name="g" extend="$h"/>`,
        ],
        ["an iteration", `${repeat}<group name="g" extend="$r[1]"/>`],
        [
            "a group named in an iteration",
            `<repeat name="outer" for="1 2" valueName="i"><group name="h"><math>$i</math></group></repeat><group name="g" extend="$outer[1].h"/>`,
        ],
        [
            "a pick",
            `<select name="s" numToSelect="2"><option><math>1</math></option><option><math>2</math></option></select><group name="g" extend="$s[1]"/>`,
        ],
        [
            "a one-pick select",
            `<select name="s"><option><math>1</math></option><option><math>2</math></option></select><group name="g" extend="$s"/>`,
        ],
        [
            "a select whose numToSelect is written as 1",
            `<select name="s" numToSelect="1"><option><math>1</math></option><option><math>2</math></option></select><group name="g" copy="$s"/>`,
        ],
        [
            "a conditionalContent",
            `<booleanInput name="b"/><conditionalContent name="cc"><case condition="$b"><math>1</math></case><else><math>2</math></else></conditionalContent><group name="g" extend="$cc"/>`,
        ],
    ];
    for (const [label, doenetML] of allowed) {
        it(`a group made from ${label} is unchanged`, async () => {
            const d = await load(doenetML);
            expect(d.errorCodes()).eqls([]);
            expect(await d.typeOf("g")).eq("group");
        });
    }

    it("a group holding a list, and its name through it, still work", async () => {
        const d = await load(
            `<pointList name="pl"><point name="P">(1,2)</point><point>(3,4)</point></pointList><group name="g">$pl</group><point name="Q" extend="$g.P"/>`,
        );
        expect(d.errorCodes()).eqls([]);
        expect((await d.stateValue("Q", "xs")).map((x: any) => x.tree)).eqls([
            1, 2,
        ]);
    });
});

describe("A <group> made from one component that isn't a composite is an error at load (decided on #2670) @group4", () => {
    const components: [string, string, string][] = [
        ["a math", `<math name="m">x+1</math>`, "math"],
        ["a number", `<number name="m">3</number>`, "number"],
        ["a text", `<text name="m">hi</text>`, "text"],
        ["a boolean", `<boolean name="m">true</boolean>`, "boolean"],
        ["a point", `<graph><point name="m">(1,2)</point></graph>`, "point"],
        ["a mathInput", `<mathInput name="m" prefill="y"/>`, "mathInput"],
        [
            "a choiceInput",
            `<choiceInput name="m"><choice>a</choice><choice>b</choice></choiceInput>`,
            "choiceInput",
        ],
        ["an answer", `<answer name="m">x</answer>`, "answer"],
        ["a p", `<p name="m">hello <math>z</math></p>`, "p"],
        [
            "a section",
            `<section name="m"><title>T</title><p>in it</p></section>`,
            "section",
        ],
        [
            "a copy of a math",
            `<math name="x">5</math><math name="m" copy="$x"/>`,
            "math",
        ],
    ];

    for (const [label, source, tag] of components) {
        for (const how of ["extend", "copy", "copyWithState"]) {
            it(`a group made with ${how} from ${label}`, async () => {
                const d = await load(
                    `${source}<p name="before">before</p><group name="g" ${how}="$m"/><p name="after">after</p>`,
                );
                const expected = [
                    `doenet-e0065: A \`<group>\` can't be made from \`$m\`, a \`<${tag}>\`: a \`<${tag}>\` is one component, not a group, and keeps its kind when a tag is made from it. To put it in a group, write \`<group>$m</group>\`, with anything else the group holds beside it. To show the same \`<${tag}>\` again, write \`<${tag} ${how}="$m"/>\`.`,
                ];
                expect(
                    d.diagnostics().filter((x) => x.startsWith("doenet-e")),
                ).eqls(expected);
                expect(await d.typeOf("g")).eq("_error");
                // the rest of the document renders (DIAG-5)
                expect(await d.text("after")).eq("after");

                await d.reload();
                expect(
                    d.diagnostics().filter((x) => x.startsWith("doenet-e")),
                ).eqls(expected);
                expect(await d.typeOf("g")).eq("_error");
            });
        }
    }

    it("the forms the message suggests work", async () => {
        const d = await load(
            `<math name="m">x+1</math><group name="g">$m</group><math name="m2" extend="$m"/><p name="p">$g $m2</p>`,
        );
        expect(d.errorCodes()).eqls([]);
        expect(await d.typeOf("g")).eq("group");
        expect(await d.text("p")).eq("x + 1 x + 1");
    });

    it("an error even with children written inside", async () => {
        const d = await load(
            `<math name="m">x</math><group name="g" extend="$m"><text>more</text></group>`,
        );
        expect(d.errorCodes()).eqls(["doenet-e0065"]);
        expect(await d.typeOf("g")).eq("_error");
    });

    it("a component named inside a section, a group, an iteration or a pick", async () => {
        for (const [doenetML, source] of [
            [
                `<section name="sec"><math name="m">q</math></section><group name="g" extend="$sec.m"/>`,
                "$sec.m",
            ],
            [
                `<group name="h"><math name="m">1</math></group><group name="g" extend="$h.m"/>`,
                "$h.m",
            ],
            [
                `<repeat name="r" for="1 2" valueName="v"><math name="m">$v</math></repeat><group name="g" extend="$r[1].m"/>`,
                "$r[1].m",
            ],
            [
                `<select name="s"><option><math name="m">1</math></option><option><math name="m">2</math></option></select><group name="g" extend="$s.m"/>`,
                "$s.m",
            ],
        ]) {
            const d = await load(doenetML);
            expect(d.diagnostics()).eqls([
                `doenet-e0065: A \`<group>\` can't be made from \`${source}\`, a \`<math>\`: a \`<math>\` is one component, not a group, and keeps its kind when a tag is made from it. To put it in a group, write \`<group>${source}</group>\`, with anything else the group holds beside it. To show the same \`<math>\` again, write \`<math extend="${source}"/>\`.`,
            ]);
            expect(await d.typeOf("g")).eq("_error");
        }
    });

    it("the value of a repeat, when its `for` decides one tag", async () => {
        for (const [doenetML, source, tag] of [
            [
                `<repeat name="r" for="1 2" valueName="v"><math>$v</math></repeat><group name="g" extend="$r[1].v"/>`,
                "$r[1].v",
                "math",
            ],
            [
                `<repeat name="r" for="a b" type="text" valueName="v"><text>$v</text></repeat><group name="g" extend="$r[1].v"/>`,
                "$r[1].v",
                "text",
            ],
            [
                `<point name="A">(1,2)</point><point name="B">(3,4)</point><repeat name="r" for="$A $B" valueName="v"><p>$v</p></repeat><group name="g" extend="$r[1].v"/>`,
                "$r[1].v",
                "point",
            ],
            [
                `<repeatForSequence name="r" length="2" valueName="v"><math>$v</math></repeatForSequence><group name="g" extend="$r[1].v"/>`,
                "$r[1].v",
                "number",
            ],
            [
                `<repeat name="r" for="1 2" valueName="v"><p><group extend="$v"/></p></repeat><group name="g" extend="$r[1].v"/>`,
                "$v",
                "math",
            ],
        ]) {
            const d = await load(doenetML);
            const expected = `doenet-e0065: A \`<group>\` can't be made from \`${source}\`, a \`<${tag}>\`: a \`<${tag}>\` is one component, not a group, and keeps its kind when a tag is made from it. To put it in a group, write \`<group>${source}</group>\`, with anything else the group holds beside it. To show the same \`<${tag}>\` again, write \`<${tag} extend="${source}"/>\`.`;
            expect(d.diagnostics()).includes(expected);
            expect(await d.typeOf("g")).eq("_error");
            await d.reload();
            expect(d.diagnostics()).includes(expected);
        }
        // the forms the message suggests work
        const d = await load(
            `<repeat name="r" for="1 2" valueName="v"><math>$v</math></repeat><p name="p"><group>$r[2].v</group> <math extend="$r[2].v"/></p>`,
        );
        expect(d.errorCodes()).eqls([]);
        expect(await d.text("p")).eq("2 2");
    });

    it("is reported at load in a case that is not true yet (DIAG-7)", async () => {
        const d = await load(
            `<booleanInput name="b"/><math name="m">x</math><conditionalContent><case condition="$b"><group name="g" extend="$m"/></case></conditionalContent>`,
        );
        expect(d.errorCodes()).eqls(["doenet-e0065"]);
        await d.reload();
        expect(d.errorCodes()).eqls(["doenet-e0065"]);
        await d.setBoolean("b", true);
        expect(d.errorCodes()).eqls(["doenet-e0065"]);
        expect(await d.typeOf("g")).eq("_error");
    });

    // Left as they were: another composite, a property, an entry of a list,
    // and a reference that names nothing or an error, each reported by
    // its own message if at all.
    const unchanged: [string, string, string[]][] = [
        [
            "a module",
            `<module name="mod"><math>1</math></module><group name="g" extend="$mod"/>`,
            [],
        ],
        [
            "a substitute",
            `<substitute name="sub" match="x" replacement="y"><math>x+1</math></substitute><group name="g" extend="$sub"/>`,
            [],
        ],
        [
            "a property of a composite",
            `<group name="h"><math>1</math></group><group name="g" extend="$h.numItems"/>`,
            [],
        ],
        [
            "a selectFromSequence that picks one",
            `<selectFromSequence name="sfs" length="5"/><group name="g" extend="$sfs"/>`,
            [],
        ],
        [
            "an item of a collect",
            `<group name="h"><math>1</math></group><collect name="col" componentType="math" from="$h"/><group name="g" extend="$col[1]"/>`,
            [],
        ],
        [
            "the value of a repeat over groups",
            `<group name="h"><math>1</math><math>2</math></group><repeat name="r" for="$h" valueName="v"><p>$v</p></repeat><group name="g" extend="$r[1].v"/>`,
            [],
        ],
    ];
    for (const [label, doenetML, codes] of unchanged) {
        it(`a group made from ${label} is unchanged`, async () => {
            const d = await load(doenetML);
            expect(d.errorCodes()).eqls(codes);
            expect(await d.typeOf("g")).eq("group");
        });
    }

    it("a group made from a group with children written inside is unchanged (D71)", async () => {
        const d = await load(
            `<group name="h"><math>1</math></group><group name="g" extend="$h"><math>2</math></group><p name="p">$g</p>`,
        );
        expect(d.errorCodes()).eqls([]);
        expect(await d.typeOf("g")).eq("group");
        expect(await d.text("p")).eq("12");
    });
});

describe("A <group> made from a property or an entry of a list is an error at load when that is (decided on #2670) @group4", () => {
    const P = `<graph><point name="P">(1,2)</point><polygon name="poly" vertices="(0,0) (1,0) (0,1)"/></graph>`;
    const sources: [string, string, string, "one" | "collection", string][] = [
        [
            "a math property",
            `<math name="m">x+1</math>`,
            "$m.value",
            "one",
            "math",
        ],
        ["a coordinate of a point", P, "$P.x", "one", "math"],
        ["an entry of a property", P, "$P.xs[1]", "one", "math"],
        ["a vertex", P, "$poly.vertices[1]", "one", "point"],
        [
            "the value of a textInput",
            `<textInput name="ti" prefill="a"/>`,
            "$ti.value",
            "one",
            "text",
        ],
        [
            "an entry of a mathList",
            `<mathList name="ml">a b</mathList>`,
            "$ml[1]",
            "one",
            "math",
        ],
        [
            "an entry of a pointList",
            `<pointList name="pl">(1,2) (3,4)</pointList>`,
            "$pl[1]",
            "one",
            "point",
        ],
        [
            "an entry by a reference",
            `<number name="n">2</number><mathList name="ml">a b</mathList>`,
            "$ml[$n]",
            "one",
            "math",
        ],
        [
            "an entry of a sequence",
            `<sequence name="seq" length="3"/>`,
            "$seq[1]",
            "one",
            "number",
        ],
        [
            "an entry of a list in a section",
            `<section name="sec"><mathList name="ml">a b</mathList></section>`,
            "$sec.ml[1]",
            "one",
            "math",
        ],
        [
            "a property through a name",
            `<section name="sec"><math name="m">q</math></section>`,
            "$sec.m.value",
            "one",
            "math",
        ],
        [
            "a property through an iteration",
            `<repeat name="r" for="1 2" valueName="v"><math name="m">$v</math></repeat>`,
            "$r[1].m.value",
            "one",
            "math",
        ],
        ["a property of several values", P, "$P.xs", "collection", "mathList"],
        [
            "the vertices of a polygon",
            P,
            "$poly.vertices",
            "collection",
            "pointList",
        ],
    ];
    const message = (
        source: string,
        groupFrom: "one" | "collection",
        tag: string,
        how: string,
    ) =>
        groupFrom === "one"
            ? `doenet-e0065: A \`<group>\` can't be made from \`${source}\`, a \`<${tag}>\`: a \`<${tag}>\` is one component, not a group, and keeps its kind when a tag is made from it. To put it in a group, write \`<group>${source}</group>\`, with anything else the group holds beside it. To show the same \`<${tag}>\` again, write \`<${tag} ${how}="${source}"/>\`.`
            : `doenet-e0065: A \`<group>\` can't be made from \`${source}\`, a \`<${tag}>\`: a \`<${tag}>\` holds many things, and keeps its kind when a tag is made from it. To put it in a group, write \`<group>${source}</group>\`, with anything else the group holds beside it. To show the same \`<${tag}>\` again, write \`<${tag} ${how}="${source}"/>\`.`;

    for (const [label, doenetML, source, groupFrom, tag] of sources) {
        it(`a group made from ${label} (${source})`, async () => {
            const d = await load(
                `${doenetML}<group name="g" extend="${source}"/><p name="after">after</p>`,
            );
            const expected = [message(source, groupFrom, tag, "extend")];
            expect(
                d.diagnostics().filter((x) => x.startsWith("doenet-e")),
            ).eqls(expected);
            expect(await d.typeOf("g")).eq("_error");
            expect(await d.text("after")).eq("after");
            await d.reload();
            expect(
                d.diagnostics().filter((x) => x.startsWith("doenet-e")),
            ).eqls(expected);
            expect(await d.typeOf("g")).eq("_error");
        });
    }

    for (const how of ["copy", "copyWithState"]) {
        it(`with ${how}, the message names ${how}`, async () => {
            const d = await load(
                `<math name="m">x+1</math><group name="g" ${how}="$m.value"/><mathList name="ml">a b</mathList><group name="h" ${how}="$ml[1]"/>`,
            );
            expect(d.diagnostics()).eqls([
                message("$m.value", "one", "math", how),
                message("$ml[1]", "one", "math", how),
            ]);
        });
    }

    it("the forms the message suggests work", async () => {
        const d = await load(
            `${P}<math name="m">x+1</math><mathList name="ml">a b</mathList>
            <p name="p1"><group>$m.value</group> <math extend="$m.value"/></p>
            <p name="p2"><group>$ml[1]</group> <math copyWithState="$ml[1]"/></p>
            <p name="p3"><group>$P.xs</group> <mathList extend="$P.xs"/></p>
            <p name="p4"><pointList copy="$poly.vertices"/></p>`,
        );
        expect(d.errorCodes()).eqls([]);
        expect(await d.text("p1")).eq("x + 1 x + 1");
        expect(await d.text("p2")).eq("a a");
        expect(await d.text("p3")).eq("1, 2 1, 2");
        expect(await d.text("p4")).eq("(0, 0), (1, 0), (0, 1)");
    });

    it("is reported at load in a case that is not true yet (DIAG-7)", async () => {
        const doenetML = `<booleanInput name="b"/><conditionalContent><case condition="$b"><math name="m">x</math><group name="g" extend="$m.value"/></case></conditionalContent>`;
        const d = await load(doenetML);
        expect(d.errorCodes()).eqls(["doenet-e0065"]);
        await d.reload();
        expect(d.errorCodes()).eqls(["doenet-e0065"]);
        await d.setBoolean("b", true);
        expect(d.errorCodes()).eqls(["doenet-e0065"]);
        expect(await d.typeOf("g")).eq("_error");
    });

    it("an index into a repeat, a select that picks one, and a name of a group, are unchanged", async () => {
        const d = await load(
            `<repeat name="r" for="1 2" valueName="v"><group name="h"><math>$v</math></group></repeat>
            <select name="s"><option><math>1</math></option></select>
            <group name="g1" extend="$r[1]"/><group name="g2" extend="$s"/><group name="g3" extend="$r[1].h"/>`,
        );
        expect(d.errorCodes()).eqls([]);
        expect(await d.typeOf("g1")).eq("group");
        expect(await d.typeOf("g2")).eq("group");
        expect(await d.typeOf("g3")).eq("group");
    });
});

describe("A tag that makes its own content is made only from its own kind (D48 decision 2, #2594) @group4", () => {
    const ownContent: [string, string, string, string][] = [
        [
            "a repeat from a number",
            `<number name="n">2</number><repeat name="e" extend="$n"/>`,
            "repeat",
            "$n",
        ],
        [
            "a repeat from an iteration",
            `${repeat}<repeat name="e" extend="$r[1]"/>`,
            "repeat",
            "$r[1]",
        ],
        [
            "a repeat from a group",
            `<group name="h"><math>1</math></group><repeat name="e" extend="$h"/>`,
            "repeat",
            "$h",
        ],
        [
            "a select from a number",
            `<number name="n">2</number><select name="e" extend="$n"/>`,
            "select",
            "$n",
        ],
        [
            "a collect copied from a number",
            `<number name="n">2</number><collect name="e" copy="$n"/>`,
            "collect",
            "$n",
        ],
        [
            "a sort from a repeat",
            `${repeat}<sort name="e" extend="$r"/>`,
            "sort",
            "$r",
        ],
    ];
    for (const [label, doenetML, tag, source] of ownContent) {
        it(label, async () => {
            const d = await load(doenetML);
            const expected = [
                `doenet-e0071: A \`<${tag}>\` makes its content itself, so it can be made only from another \`<${tag}>\`, and \`${source}\` isn't one. To show it as it is, write \`${source}\`.`,
            ];
            expect(d.diagnostics()).eqls(expected);
            expect(await d.typeOf("e")).eq("_error");
            await d.reload();
            expect(d.diagnostics()).eqls(expected);
        });
    }

    it("a property is a value, as before", async () => {
        const d = await load(
            `<number name="n">2</number><repeat name="e" extend="$n.value"/>`,
        );
        expect(d.diagnostics()).eqls([
            "doenet-e0071: A `<repeat>` makes its content itself, so it can be made only from another `<repeat>`, and `$n.value` is a value. To show it as it is, write `$n.value`.",
        ]);
    });

    it("is reported at load in a case that is not true yet (DIAG-7)", async () => {
        const d = await load(
            `<booleanInput name="b"/><number name="n">2</number><conditionalContent><case condition="$b"><repeat name="e" extend="$n"/></case></conditionalContent>`,
        );
        expect(d.errorCodes()).eqls(["doenet-e0071"]);
        await d.setBoolean("b", true);
        expect(d.errorCodes()).eqls(["doenet-e0071"]);
    });

    const values: [string, string, string, string][] = [
        [
            "a sequence from a number",
            `<number name="n">2</number><sequence name="e" extend="$n"/>`,
            "sequence",
            "$n",
        ],
        [
            "a selectFromSequence from a number",
            `<number name="n">2</number><selectFromSequence name="e" extend="$n"/>`,
            "selectFromSequence",
            "$n",
        ],
        [
            "a sequence from a selectFromSequence, a class built on a sequence",
            `<selectFromSequence name="s" to="5" numToSelect="2"/><sequence name="e" extend="$s"/>`,
            "sequence",
            "$s",
        ],
        [
            "a sampleRandomNumbers from a selectRandomNumbers (#1986)",
            `<selectRandomNumbers name="s" type="gaussian" mean="3" standardDeviation="1" numToSelect="5"/><sampleRandomNumbers name="e" extend="$s"/><p name="p">$e</p>`,
            "sampleRandomNumbers",
            "$s",
        ],
        [
            "a sampleRandomNumbers from a one-pick selectRandomNumbers",
            `<selectRandomNumbers name="s"/><sampleRandomNumbers name="e" copy="$s"/>`,
            "sampleRandomNumbers",
            "$s",
        ],
        [
            "a selectRandomNumbers from a sampleRandomNumbers",
            `<sampleRandomNumbers name="s" numSamples="5"/><selectRandomNumbers name="e" extend="$s"/>`,
            "selectRandomNumbers",
            "$s",
        ],
    ];
    for (const [label, doenetML, tag, source] of values) {
        it(label, async () => {
            const d = await load(doenetML);
            const expected = [
                `doenet-e0071: A \`<${tag}>\` makes its values from its own attributes, so it can be made only from another \`<${tag}>\`, and \`${source}\` isn't always one. To show it as it is, write \`${source}\`.`,
            ];
            expect(d.diagnostics()).eqls(expected);
            expect(await d.typeOf("e")).eq("_error");
            await d.reload();
            expect(d.diagnostics()).eqls(expected);
        });
    }

    const sameTag: [string, string][] = [
        ["a repeat from a repeat", `${repeat}<repeat name="e" extend="$r"/>`],
        [
            "a select copied from a select",
            `<select name="s"><option><math>1</math></option></select><select name="e" copy="$s"/>`,
        ],
        [
            "a sampleRandomNumbers from a sampleRandomNumbers",
            `<sampleRandomNumbers name="s" numSamples="3"/><sampleRandomNumbers name="e" extend="$s"/>`,
        ],
        [
            "a selectRandomNumbers from a selectRandomNumbers",
            `<selectRandomNumbers name="s" numToSelect="3"/><selectRandomNumbers name="e" extend="$s"/>`,
        ],
        [
            "a sequence from a sequence",
            `<sequence name="s" to="3"/><sequence name="e" extend="$s"/>`,
        ],
    ];
    for (const [label, doenetML] of sameTag) {
        it(`${label} is allowed`, async () => {
            const d = await load(doenetML);
            expect(d.errorCodes()).eqls([]);
            expect(await d.typeOf("e")).not.eq("_error");
        });
    }
});

describe("An index into what a conditionalContent shows is type-checked at load (REF-5, D72, D74) @group4", () => {
    // An index after a `<conditionalContent>` reaches into what its shown case
    // holds, as after a `<group>` of one (D72), typed at load from what the
    // cases hold (D74).
    const cc = (a: string, b: string) =>
        `<booleanInput name="b"/><conditionalContent name="cc"><case condition="$b">${a}</case><else>${b}</else></conditionalContent>`;

    it("a boolean from an entry of the math a case holds", async () => {
        const d = await load(
            `${cc("<math>(1,2)</math>", "<math>(3,4)</math>")}<boolean name="e" extend="$cc[1]"/>`,
        );
        const expected = [
            "doenet-e0065: A `<boolean>` can't be made from `$cc[1]`, which gives a `<math>`: a number is not true or false. To test it, write a comparison such as `<boolean>$cc[1] != 0</boolean>`.",
        ];
        expect(d.diagnostics()).eqls(expected);
        expect(await d.typeOf("e")).eq("_error");
        await d.setBoolean("b", true);
        expect(d.diagnostics()).eqls(expected);
        await d.reload();
        expect(d.diagnostics()).eqls(expected);
    });

    it("a math from an entry of the math a case holds", async () => {
        const d = await load(
            `${cc("<math>(1,2)</math>", "<math>(3,4)</math>")}<math name="e" extend="$cc[2]"/>`,
        );
        expect(d.diagnostics()).eqls([]);
        expect(await d.text("e")).eq("4");
        await d.setBoolean("b", true);
        expect(await d.text("e")).eq("2");
    });

    it("an index into the text a case holds names nothing", async () => {
        const d = await load(
            `${cc("<text>hi</text>", "<text>bye</text>")}<point name="e" extend="$cc[1]"/>`,
        );
        const expected = ["doenet-w0100: Cannot reference index `$cc[1]`"];
        expect(d.diagnostics()).eqls(expected);
        expect(await d.typeOf("e")).eq("point");
        await d.setBoolean("b", true);
        expect(d.diagnostics()).eqls(expected);
        await d.reload();
        expect(d.diagnostics()).eqls(expected);
    });

    it("cases holding a text and a math are an error at load", async () => {
        const d = await load(
            `${cc("<text>hi</text>", "<math>(1,2)</math>")}<math name="e" extend="$cc[1]"/>`,
        );
        const expected = [
            "doenet-e0095: `$cc[1]` can't be used: an index after `cc` reaches into what the case shown holds, which must be one component of one type in every case, and one holds a `<text>` and another a `<math>`. Hold one type in each.",
        ];
        expect(d.diagnostics()).eqls(expected);
        expect(await d.typeOf("e")).eq("_error");
        await d.setBoolean("b", true);
        expect(d.diagnostics()).eqls(expected);
        await d.reload();
        expect(d.diagnostics()).eqls(expected);
    });
});

describe("A scalar tag made from an iteration holding a list is decided at load (#2654 item 5) @group4", () => {
    const list = `<mathList name="x">1 2 3</mathList>`;

    it("a math from an iteration holding a reference to a mathList", async () => {
        const d = await load(
            `${list}<repeat name="r" for="1" valueName="v">$x</repeat><math name="e" extend="$r[1]"/>`,
        );
        const expected = [
            "doenet-e0064: A `<math>` can be made from a `<mathList>` only when it holds one component, and `$r[1]` holds 3. To use one of them, write `$r[1][1]`. To read them all as one value, write `<math>$r[1]</math>`.",
        ];
        expect(d.diagnostics()).eqls(expected);
        expect(await d.typeOf("e")).eq("_error");
        await d.reload();
        expect(d.diagnostics()).eqls(expected);
    });

    it("a math from an iteration holding a mathList written in it", async () => {
        const d = await load(
            `<repeat name="r" for="1" valueName="v"><mathList>1 2</mathList></repeat><math name="e" extend="$r[1]"/>`,
        );
        expect(d.errorCodes()).eqls(["doenet-e0064"]);
        expect(await d.typeOf("e")).eq("_error");
    });

    it("a math from an iteration holding $cc.x, a mathList in each case", async () => {
        const d = await load(
            `<booleanInput name="b"/><conditionalContent name="cc"><case condition="$b"><mathList name="x">1 2 3</mathList></case><else><mathList name="x">4 5</mathList></else></conditionalContent><repeat name="r" for="1" valueName="v">$cc.x</repeat><math name="e" extend="$r[1]"/>`,
        );
        expect(d.errorCodes()).eqls(["doenet-e0064"]);
        await d.setBoolean("b", true);
        expect(d.errorCodes()).eqls(["doenet-e0064"]);
    });

    it("a math from a group holding a mathList", async () => {
        const d = await load(
            `${list}<group name="h">$x</group><math name="e" extend="$h"/>`,
        );
        expect(d.errorCodes()).eqls(["doenet-e0064"]);
    });

    it("the message's index names an entry, or says to name the list", async () => {
        // An entry has no name of its own: the message gives an index that
        // names one, and the form it gives works.
        const h = await load(
            `${list}<group name="h">$x</group><math name="e" extend="$h"/><math name="f" extend="$h[1]"/>`,
        );
        expect(h.diagnostics()).eqls([
            "doenet-e0064: A `<math>` can be made from a `<mathList>` only when it holds one component, and `$h` holds 3. To use one of them, write `$h[1]`. To read them all as one value, write `<math>$h</math>`.",
        ]);
        expect(await h.text("f")).eq("1");
        const r = await load(
            `<repeat name="r" for="1"><mathList>1 2</mathList></repeat><math name="e" extend="$r[1]"/><math name="f" extend="$r[1][2]"/>`,
        );
        expect(r.diagnostics()).eqls([
            "doenet-e0064: A `<math>` can be made from a `<mathList>` only when it holds one component, and `$r[1]` holds 2. To use one of them, write `$r[1][1]`. To read them all as one value, write `<math>$r[1]</math>`.",
        ]);
        expect(await r.text("f")).eq("2");
        // an index after `$cc` reaches into the list its case holds (D72)
        const c = await load(
            `<conditionalContent name="cc"><case condition="true"><mathList name="l">1 2</mathList></case></conditionalContent><math name="e" extend="$cc"/><math name="f" extend="$cc[1]"/>`,
        );
        expect(c.diagnostics()).eqls([
            "doenet-e0064: A `<math>` can be made from a `<mathList>` only when it holds one component, and `$cc` holds 2. To use one of them, write `$cc[1]`. To read them all as one value, write `<math>$cc</math>`.",
        ]);
        expect(await c.text("f")).eq("1");
    });

    it("a list beside another component counts its entries", async () => {
        // the message counts all the group or iteration holds, not the list
        const g = await load(
            `<group name="g">${list}<math>4</math></group><math name="e" extend="$g"/>`,
        );
        expect(g.diagnostics()).eqls([
            "doenet-e0064: A `<math>` can be made from a `<group>` only when it holds one component, and `$g` holds 4. To use one of them, give it a name and refer to it by that name. To read them all as one value, write `<math>$g</math>`.",
        ]);
        const r = await load(
            `<repeat name="r" for="1" valueName="v"><mathList>1 2</mathList><math>3</math></repeat><math name="e" extend="$r[1]"/>`,
        );
        expect(r.diagnostics()).eqls([
            "doenet-e0064: A `<math>` can be made from `$r[1]` only when it always holds one component, and an iteration of the `<repeat>` holds 3. To read what it holds as one value, write `<math>$r[1]</math>`.",
        ]);
        const one = await load(
            `<group name="g"><mathList>1</mathList><math>2</math></group><math name="e" extend="$g"/>`,
        );
        expect(one.errorCodes()).eqls(["doenet-e0064"]);
    });

    it("a list in one case only is what a case holds", async () => {
        // the other case shows one math, so `$cc` does not always hold 3
        const c = await load(
            `${list}<booleanInput name="b"/><conditionalContent name="cc"><case condition="$b">$x</case><else><math>5</math></else></conditionalContent><math name="e" extend="$cc"/>`,
        );
        expect(c.diagnostics()).eqls([
            "doenet-e0064: A `<math>` can be made from `$cc` only when it always holds one component, and a case of the `<conditionalContent>` holds 3. To read what it holds as one value, write `<math>$cc</math>`.",
        ]);
        const s = await load(
            `${list}<select name="s"><option>$x</option><option><math>5</math></option></select><math name="e" extend="$s"/>`,
        );
        expect(s.diagnostics()).eqls([
            "doenet-e0064: A `<math>` can be made from `$s` only when it always holds one component, and an option of the `<select>` holds 3. To read what it holds as one value, write `<math>$s</math>`.",
        ]);
        // An index after the select reaches into its pick (D72): a
        // `<mathList>` in one option and a `<math>` in another (D74).
        const si = await load(
            `${list}<select name="s"><option>$x</option><option><math>5</math></option></select><math name="e" extend="$s[1]"/>`,
        );
        expect(si.diagnostics()).eqls([
            "doenet-e0095: `$s[1]` can't be used: an index after `s` reaches into what the pick holds, which must be one component of one type in every option, and one holds a `<mathList>` and another a `<math>`. Hold one type in each.",
        ]);
    });

    it("is reported at load in a case that is not true yet (DIAG-7)", async () => {
        const d = await load(
            `<booleanInput name="b"/>${list}<conditionalContent><case condition="$b"><repeat name="r" for="1" valueName="v">$x</repeat><math name="e" extend="$r[1]"/></case></conditionalContent>`,
        );
        expect(d.errorCodes()).eqls(["doenet-e0064"]);
        await d.setBoolean("b", true);
        expect(d.errorCodes()).eqls(["doenet-e0064"]);
    });

    it("a mathList from iterations holding a mathList is allowed", async () => {
        const d = await load(
            `${list}<repeat name="r" for="1 2" valueName="v">$x</repeat><mathList name="e" extend="$r"/>`,
        );
        expect(d.errorCodes()).eqls([]);
        expect((await d.stateValue("e", "maths")).map((x: any) => x.tree)).eqls(
            [1, 2, 3, 1, 2, 3],
        );
    });
});
