import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import { updateBooleanInputValue } from "../utils/actions";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

/**
 * A hidden entry of any list (decision D29 of the principles, #2265). Every
 * list follows one rule:
 * 1. an entry carries its source's own `hide` (`$l[k].hide`), never the
 *    list's;
 * 2. `$l[k].hidden` is true when the entry's `hide` is, or the list is hidden;
 * 3. a hidden entry is not drawn, so it is not in the text of what holds it,
 *    but it still counts for indices and wherever the list is read as a
 *    value (`<math>$l</math>`);
 * 4. a reference to the entry (`$l[k]`), or to the whole list (`$l`), keeps
 *    the entry hidden; one made hidden only by the list's own `hide` is
 *    shown (CTX-8).
 */
describe("A hidden entry of a list @group4", async () => {
    /**
     * The types of what `name` draws, in order, leaving out what it does not
     * draw (`childrenInstructions`).
     */
    async function drawnIn(
        core: any,
        resolvePathToNodeIdx: any,
        name: string,
    ): Promise<string[]> {
        const rendererState =
            core.core.rendererInstructionBuilder.rendererState;
        return rendererState[
            await resolvePathToNodeIdx(name)
        ].childrenInstructions
            .filter((child: any) => typeof child === "object" && child)
            .map((child: any) => child.componentType);
    }

    async function textsOf(
        core: any,
        resolvePathToNodeIdx: any,
        names: string[],
    ) {
        const stateVariables = await core.returnAllStateVariables(false, true);
        const texts: Record<string, string> = {};
        for (const name of names) {
            texts[name] =
                stateVariables[
                    await resolvePathToNodeIdx(name)
                ].stateValues.text;
        }
        return texts;
    }

    /**
     * Each list written with its first entry's source hidden, with the type
     * its entries are drawn as, the text of the list without that entry, and
     * the text of `<math>$l</math>`, which includes it.
     */
    const lists = [
        {
            list: `<mathList name="l"><math hide>1</math><math>2</math></mathList>`,
            drawnAs: "math",
            shown: "2",
            value: "1, 2",
        },
        {
            list: `<numberList name="l"><number hide>1</number><number>2</number></numberList>`,
            drawnAs: "number",
            shown: "2",
            value: "1, 2",
        },
        {
            list: `<textList name="l"><text hide>a</text><text>b</text></textList>`,
            drawnAs: "text",
            shown: "b",
        },
        {
            list: `<booleanList name="l"><boolean hide>true</boolean><boolean>false</boolean></booleanList>`,
            drawnAs: "boolean",
            shown: "false",
        },
        {
            list: `<intervalList name="l"><interval hide>(1,2)</interval><interval>(3,4)</interval></intervalList>`,
            drawnAs: "interval",
            shown: "(3, 4)",
        },
        {
            list: `<tupleList name="l"><math hide>(1,2)</math><math>(3,4)</math></tupleList>`,
            drawnAs: "math",
            shown: "(3, 4)",
            value: "(1, 2), (3, 4)",
        },
        {
            list: `<pointList name="l"><point hide>(1,2)</point><point>(3,4)</point></pointList>`,
            drawnAs: "point",
            graphical: true,
            value: "(1, 2), (3, 4)",
        },
        {
            list: `<vectorList name="l"><vector hide>(1,2)</vector><vector>(3,4)</vector></vectorList>`,
            drawnAs: "vector",
            graphical: true,
        },
        {
            list: `<mathList name="l">$h1 $h2</mathList>`,
            setup: `<math name="h1" hide>1</math><math name="h2">2</math>`,
            drawnAs: "math",
            shown: "2",
            value: "1, 2",
        },
        {
            list: `<numberList name="l"><sort><number hide>1</number><number>2</number></sort></numberList>`,
            drawnAs: "number",
            shown: "2",
            value: "1, 2",
        },
        {
            list: `<numberList name="l"><group><number hide>1</number><number>2</number></group></numberList>`,
            drawnAs: "number",
            shown: "2",
            value: "1, 2",
        },
        {
            list: `<mathList name="l"><mathList><math hide>1</math></mathList><math>2</math></mathList>`,
            drawnAs: "math",
            shown: "2",
            value: "1, 2",
        },
        {
            list: `<sort name="l"><number hide>1</number><number>2</number></sort>`,
            drawnAs: "number",
            shown: "2",
            value: "1, 2",
        },
        {
            list: `<sort name="l">$l0</sort>`,
            setup: `<mathList name="l0"><math hide>1</math><math>2</math></mathList>`,
            drawnAs: "math",
            shown: "2",
            value: "1, 2",
        },
        {
            list: `<collect name="l" from="$s" componentType="number" />`,
            setup: `<section name="s"><number hide>1</number><number>2</number></section>`,
            drawnAs: "number",
            shown: "2",
            value: "1, 2",
        },
        {
            list: `<collect name="l" from="$s" componentType="point" />`,
            setup: `<graph name="s"><point hide>(1,2)</point><point>(3,4)</point></graph>`,
            drawnAs: "point",
            graphical: true,
        },
        {
            list: `<mathList name="l" copy="$l0" />`,
            setup: `<mathList name="l0"><math hide>1</math><math>2</math></mathList>`,
            drawnAs: "math",
            shown: "2",
            value: "1, 2",
        },
        {
            list: `<mathList name="l" extend="$l0" />`,
            setup: `<mathList name="l0"><math hide>1</math><math>2</math></mathList>`,
            drawnAs: "math",
            shown: "2",
            value: "1, 2",
        },
        {
            list: `<group name="l" asList><number hide>1</number><number>2</number></group>`,
            drawnAs: "number",
            shown: "2",
            value: "1, 2",
        },
    ];

    for (const { list, setup, drawnAs, shown, value, graphical } of lists) {
        it(list, async () => {
            const holder = graphical ? "graph" : "p";
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <setup>${setup ?? ""}</setup>
    <${holder} name="direct">${list}</${holder}>
    <${holder} name="ref">$l</${holder}>
    <${holder} name="entry">$l[1] $l[2]</${holder}>
    <p name="props">$l[1].hide $l[1].hidden $l[2].hide $l[2].hidden $l.hide</p>
    ${value ? `<math name="value">$l</math>` : ""}
    `,
            });

            // drawn, directly and by a reference to the list or its entries
            for (const name of ["direct", "ref", "entry"]) {
                expect(
                    await drawnIn(core, resolvePathToNodeIdx, name),
                    name,
                ).eqls([drawnAs]);
            }
            if (shown !== undefined) {
                expect(
                    await textsOf(core, resolvePathToNodeIdx, [
                        "direct",
                        "ref",
                    ]),
                ).eqls({ direct: shown, ref: shown });
            }

            // the entry carries its source's `hide`; the list's own is false
            expect(
                (await textsOf(core, resolvePathToNodeIdx, ["props"])).props,
            ).eq("true true false false false");

            // a value position counts the hidden entry
            if (value) {
                expect(
                    (await textsOf(core, resolvePathToNodeIdx, ["value"]))
                        .value,
                ).eq(value);
            }
        });
    }

    it("a hidden list hides its entries, but not a reference to an entry, whose `hide` is its source's", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <section name="s"><number>1</number><number>2</number></section>
    <p name="direct">
      <mathList name="ml" hide>1 2</mathList>
      <sort name="st" hide>2 1</sort>
      <collect name="c" hide from="$s" componentType="number" />
    </p>
    <p name="entries">$ml[1] $st[1] $c[1]</p>
    <p name="props">$ml[1].hide $ml[1].hidden $st[1].hide $st[1].hidden $c[1].hide $c[1].hidden $c[2].hide</p>
    `,
        });

        expect(await drawnIn(core, resolvePathToNodeIdx, "direct")).eqls([]);
        expect(
            await textsOf(core, resolvePathToNodeIdx, ["entries", "props"]),
        ).eqls({
            entries: "1 1 1",
            props: "false true false true false true false",
        });
    });

    it("an entry hidden by an attribute that changes is drawn as it changes", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <booleanInput name="h" />
    <p name="p"><numberList name="nl"><number hide="$h">1</number><number>2</number></numberList></p>
    <graph name="g"><pointList name="pl"><point hide="$h">(1,2)</point><point>(3,4)</point></pointList></graph>
    <p name="props">$nl[1].hide $pl[1].hide</p>
    `,
        });

        expect(await drawnIn(core, resolvePathToNodeIdx, "p")).eqls([
            "number",
            "number",
        ]);
        expect(await drawnIn(core, resolvePathToNodeIdx, "g")).eqls([
            "point",
            "point",
        ]);
        expect(await textsOf(core, resolvePathToNodeIdx, ["p", "props"])).eqls({
            p: "1, 2",
            props: "false false",
        });

        await updateBooleanInputValue({
            boolean: true,
            componentIdx: await resolvePathToNodeIdx("h"),
            core,
        });
        expect(await drawnIn(core, resolvePathToNodeIdx, "p")).eqls(["number"]);
        expect(await drawnIn(core, resolvePathToNodeIdx, "g")).eqls(["point"]);
        expect(await textsOf(core, resolvePathToNodeIdx, ["p", "props"])).eqls({
            p: "2",
            props: "true true",
        });
    });

    it("an entry of a generated list has no `hide` of its own", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p name="p"><sequence name="s" from="1" to="2" /></p>
    <p name="props">$s[1].hide $s[1].hidden</p>
    `,
        });

        expect(await textsOf(core, resolvePathToNodeIdx, ["p", "props"])).eqls({
            p: "1, 2",
            props: "false false",
        });
    });
    it("a hidden entry is left out of the text of a choice holding the list", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <booleanInput name="h" />
    <textList name="tl"><text hide="$h">a</text><text>b</text></textList>
    <collect name="cr" hide="false" from="$s" componentType="text" />
    <section name="s"><text hide>x</text><text>y</text></section>
    <textList name="hl" hide><text>u</text></textList>
    <choiceInput name="ci" inline>
        <choice>$tl</choice>
        <choice>$cr</choice>
        <choice>$hl[1]</choice>
    </choiceInput>
    `,
        });

        const choiceTexts = async () =>
            (await core.returnAllStateVariables(false, true))[
                await resolvePathToNodeIdx("ci")
            ].stateValues.choiceTexts;

        // a `<collect hide="false">` does not show an entry whose source is
        // hidden (D29), and an entry hidden only by its list is shown by
        // `$hl[1]`
        expect(await choiceTexts()).eqls(["a, b", "y", "u"]);

        await updateBooleanInputValue({
            boolean: true,
            componentIdx: await resolvePathToNodeIdx("h"),
            core,
        });
        expect(await choiceTexts()).eqls(["b", "y", "u"]);
    });

    it("an unlinked copy of an entry keeps the `hide` it was made with through a reload", async () => {
        // The copies are made while their sources are shown (hidden, for
        // the third entries); the reader then flips each source, by an
        // attribute (`hide="$b"`) or by writing its `hide` (`bindValueTo`),
        // saves and reloads. Made again from the flipped sources, each copy
        // must still take the snapshot it was made with (CPY-2).
        const doenetML = `
    <booleanInput name="b" />
    <booleanInput name="a" prefill="true" />
    <booleanInput name="bP" bindValueTo="$P2.hide" />
    <booleanInput name="bM" bindValueTo="$m2.hide" />
    <booleanInput name="bN" bindValueTo="$n2.hide" />
    <graph><pointList name="pl"><point hide="$b">(1,2)</point><point name="P2">(3,4)</point><point hide="$a">(5,6)</point></pointList></graph>
    <p><mathList name="ml"><math hide="$b">x</math><math name="m2">y</math><math hide="$a">z</math></mathList></p>
    <section name="s"><number hide="$b">1</number><number name="n2">2</number><number hide="$a">3</number></section>
    <collect name="c" from="$s" componentType="number" />
    <graph><point copy="$pl[1]" name="p1" /><point copy="$pl[2]" name="p2" /><point copy="$pl[3]" name="p3" /></graph>
    <p><math copy="$ml[1]" name="m1c" /><math copy="$ml[2]" name="m2c" /><math copy="$ml[3]" name="m3c" /></p>
    <p><number copy="$c[1]" name="c1" /><number copy="$c[2]" name="c2" /><number copy="$c[3]" name="c3" /></p>
    `;
        const copies = [
            "p1",
            "p2",
            "p3",
            "m1c",
            "m2c",
            "m3c",
            "c1",
            "c2",
            "c3",
        ];
        const made = [
            false,
            false,
            true,
            false,
            false,
            true,
            false,
            false,
            true,
        ];
        let { core, resolvePathToNodeIdx, scoreState } = await createTestCore({
            doenetML,
        });
        const hides = async () => {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            const values: boolean[] = [];
            for (const name of copies) {
                values.push(
                    stateVariables[await resolvePathToNodeIdx(name)].stateValues
                        .hide,
                );
            }
            return values;
        };
        const setAll = async (value: boolean) => {
            for (const name of ["b", "bP", "bM", "bN"]) {
                await updateBooleanInputValue({
                    boolean: value,
                    componentIdx: await resolvePathToNodeIdx(name),
                    core,
                });
            }
            await updateBooleanInputValue({
                boolean: !value,
                componentIdx: await resolvePathToNodeIdx("a"),
                core,
            });
        };

        expect(await hides()).eqls(made);
        await setAll(true);
        expect(await hides()).eqls(made);

        await core.saveImmediately();
        ({ core, resolvePathToNodeIdx } = await createTestCore({
            doenetML,
            initialState: scoreState.state,
        }));
        expect(await hides()).eqls(made);

        await setAll(false);
        expect(await hides()).eqls(made);
    });
});

/**
 * A parent that reads its children while ignoring its own hiding (a
 * `<choice>`'s text, the child an `<li>` leads with) counts a child exactly
 * when the child would be drawn if the parent were shown (D29, #2375). So
 * for each content, the choice's text is the text of a `<p>` holding the
 * same content, and an `<li>` holding it leads with the list's first entry
 * only when the `<p>` draws it, and otherwise with the string ` r`.
 */
describe("What a parent ignoring its own hiding counts of a list @group4", async () => {
    const contents = [
        { content: `<textList hide>q</textList> r`, text: " r" },
        { content: `<group hide><text>q</text></group> r`, text: " r" },
        // a bare reference to a hidden list or group is shown (D9)
        { content: `$tl r`, text: "q r" },
        { content: `$g r`, text: "q r" },
        // an entry referenced on its own is shown when only the list is
        // hidden (D29 rule 4), and an `extend` of a hidden list is hidden
        { content: `$tl[1] r`, text: "q r" },
        { content: `<textList extend="$tl"/> r`, text: " r" },
        {
            content: `<group hide><textList>q</textList></group> r`,
            text: " r",
        },
        // a bare reference to a hidden `<collect>` is hidden
        // (`listHiddenWithReferences`)
        { content: `$c r`, text: " r" },
        {
            content: `<collect hide componentType="text" from="$s"/> r`,
            text: " r",
        },
        { content: `<textList><text hide>q</text></textList> r`, text: " r" },
        { content: `<sequence hide from="1" to="2"/> r`, text: " r" },
        {
            content: `<group hide><sequence from="1" to="2"/></group> r`,
            text: " r",
        },
        { content: `$seq r`, text: "1, 2 r" },
        {
            content: `<numberList hide><number>1</number></numberList> r`,
            text: " r",
        },
        { content: `<mathList hide>x</mathList> r`, text: " r" },
        { content: `<booleanList hide>true</booleanList> r`, text: " r" },
        { content: `<sort hide>2 1</sort> r`, text: " r" },
    ];

    for (const { content, text } of contents) {
        it(content, async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <setup>
      <textList name="tl" hide>q</textList>
      <section name="s"><text>q</text></section>
      <group name="g" hide><text>q</text></group>
      <sequence name="seq" hide from="1" to="2"/>
    </setup>
    <collect name="c" hide componentType="text" from="$s"/>
    <choiceInput><choice name="ch">${content}</choice></choiceInput>
    <p name="p">${content}</p>
    <ol><li name="li">${content}</li></ol>
    `,
            });

            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            const stateValues = async (name: string) =>
                stateVariables[await resolvePathToNodeIdx(name)].stateValues;

            expect((await stateValues("p")).text).eq(text);
            expect((await stateValues("ch")).text).eq(text);
            expect(
                (await stateValues("li")).childrenToRenderInlineForListItem.map(
                    (child: any) => child.componentType,
                ),
            ).eqls(text === " r" ? [] : [text === "q r" ? "text" : "number"]);
        });
    }

    it("a list's `hide` that changes changes what the choice counts", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <booleanInput name="h" />
    <choiceInput><choice name="ch"><numberList hide="$h">1 2</numberList> r</choice></choiceInput>
    <p name="props">$ch.text</p>
    `,
        });

        const choiceText = async () =>
            (await core.returnAllStateVariables(false, true))[
                await resolvePathToNodeIdx("ch")
            ].stateValues.text;

        expect(await choiceText()).eq("1, 2 r");

        await updateBooleanInputValue({
            boolean: true,
            componentIdx: await resolvePathToNodeIdx("h"),
            core,
        });
        expect(await choiceText()).eq(" r");

        await updateBooleanInputValue({
            boolean: false,
            componentIdx: await resolvePathToNodeIdx("h"),
            core,
        });
        expect(await choiceText()).eq("1, 2 r");
    });
});
