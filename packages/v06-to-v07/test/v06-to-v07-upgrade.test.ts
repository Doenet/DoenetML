import { describe, expect, it } from "vitest";
import { toXml } from "@doenet/parser";
import util from "util";
import { updateSyntaxFromV06toV07 } from "../src/index";
import { reparseAttribute } from "../src/reparse-attribute";

const origLog = console.log;
console.log = (...args) => {
    try {
        origLog(...args.map((x) => util.inspect(x, false, 10, true)));
    } catch {
        origLog(...args);
    }
};

async function updateSyntax(
    ...args: Parameters<typeof updateSyntaxFromV06toV07>
) {
    const { dast } = await updateSyntaxFromV06toV07(...args);
    return dast;
}

describe("v06 to v07 update", () => {
    let source: string;
    let correctSource: string;

    it("ensures $ before `target`, `triggerWith`, etc.", async () => {
        const NEEDS_TRANSFORMING = [
            ["target", "t"],
            ["triggerWith", "tw"],
            ["triggerWhenObjectsClicked", "toc"],
            ["triggerWhenObjectsFocused", "tof"],
            ["referencesAreFunctionSymbols", "r"],
            ["updateWith", "uw"],
            ["forObject", "fo"],
            ["paginator", "p"],
        ];
        // We don't care about correct DoenetML. Just well-formed XML.
        source = `<document><p>content</p>${NEEDS_TRANSFORMING.map(
            ([attr, name]) => `<doenet ${attr}="${name}" />`,
        ).join("")}</document>`;
        correctSource = `<document><p>content</p>${NEEDS_TRANSFORMING.map(
            ([attr, name]) => `<doenet ${attr}="$${name}" />`,
        ).join("")}</document>`;

        expect(toXml(await updateSyntax(source))).toEqual(correctSource);

        // Make sure if there are already dollar signs, they are not added again
        expect(toXml(await updateSyntax(correctSource))).toEqual(correctSource);
    });

    it("removes newNamespace attribute", async () => {
        source = `<graph name="g" newNamespace><point name="p" /></graph>`;
        correctSource = `<graph name="g"><point name="p" /></graph>`;
        expect(toXml(await updateSyntax(source))).toEqual(correctSource);
    });

    it("macro path slashes get turned into dots", async () => {
        source = `$(foo/bar[3][4][$(b/c).d].baz)`;
        correctSource = `$foo.bar[3][4][$b.c.d].baz`;
        expect(toXml(await updateSyntax(source))).toEqual(correctSource);
    });

    it("macro path slashes get turned into dots in attributes", async () => {
        source = `<p foo="$(foo/bar[3][4][$(b/c).d].baz)" />`;
        correctSource = `<p foo="$foo.bar[3][4][$b.c.d].baz" />`;
        expect(
            toXml(
                await updateSyntax(source, {
                    doNotUpgradeAttributeSyntax: true,
                    doNotUpgradeCopyTags: true,
                }),
            ),
        ).toEqual(correctSource);
    });

    it("copy source slashes get turned into dots", async () => {
        source = `<copy source="foo/bar[3][4][$(b/c).d].baz"/>`;
        correctSource = `<copy source="foo.bar[3][4][$b.c.d].baz" />`;
        expect(
            toXml(
                await updateSyntax(source, {
                    doNotUpgradeCopyTags: true,
                }),
            ),
        ).toEqual(correctSource);
    });

    it(".. in macro path with slashes gets removed", async () => {
        source = `<p foo="$(x/../bar)" />`;
        correctSource = `<p foo="$bar" />`;

        let res = await updateSyntaxFromV06toV07(source, {
            doNotUpgradeAttributeSyntax: true,
            doNotUpgradeCopyTags: true,
        });
        expect(toXml(res.dast)).toEqual(correctSource);

        expect(res.vfile.messages).toMatchInlineSnapshot(`
          [
            [1:1-1:1: There is no equivalent to the $(../x) syntax; a best-guess was made when converting $(x/../bar)],
          ]
        `);

        // Only one error message even if there are two `..` in the path
        source = `<p foo="$(x/../../bar)" />`;
        correctSource = `<p foo="$bar" />`;

        res = await updateSyntaxFromV06toV07(source, {
            doNotUpgradeAttributeSyntax: true,
            doNotUpgradeCopyTags: true,
        });
        expect(toXml(res.dast)).toEqual(correctSource);

        expect(res.vfile.messages).toMatchInlineSnapshot(`
          [
            [1:1-1:1: There is no equivalent to the $(../x) syntax; a best-guess was made when converting $(x/../../bar)],
          ]
        `);
    });

    it("attributes aren't lost when turning slashes get turned into dots", async () => {
        source = `$foo.bar{baz="abc"}`;
        correctSource = `$foo.bar{baz="abc"}`;
        expect(
            toXml(
                await updateSyntax(source, {
                    doNotUpgradeCopyTags: true,
                    doNotUpgradeAttributeSyntax: true,
                }),
            ),
        ).toEqual(correctSource);
    });

    it("corrects capitalization in element names", async () => {
        source = `<pOiNt />`;
        correctSource = `<point />`;
        expect(toXml(await updateSyntax(source))).toEqual(correctSource);
    });

    it("ref element target attribute becomes to", async () => {
        source = `<ref target="$foo" />`;
        correctSource = `<ref to="$foo" />`;
        expect(toXml(await updateSyntax(source))).toEqual(correctSource);
    });

    it("copySource gets converted to extend or copy", async () => {
        source = `<point copySource="P" name="P2" />`;
        correctSource = `<point extend="$P" name="P2" />`;
        expect(toXml(await updateSyntax(source))).toEqual(correctSource);

        source = `<point CopySource="P" name="P2" />`;
        correctSource = `<point extend="$P" name="P2" />`;
        expect(toXml(await updateSyntax(source))).toEqual(correctSource);

        source = `<point copySource="P" name="P2" link="true" />`;
        correctSource = `<point extend="$P" name="P2" />`;
        expect(toXml(await updateSyntax(source))).toEqual(correctSource);

        source = `<point copySource="P" name="P2" link="false" />`;
        correctSource = `<point copy="$P" name="P2" />`;
        expect(toXml(await updateSyntax(source))).toEqual(correctSource);
    });

    it("copySource gets converted in the presence of assignNames", async () => {
        source = `<math copySource="P.x" assignNames="x" />`;
        correctSource = `<math extend="$P.x" name="x" />`;
        expect(toXml(await updateSyntax(source))).toEqual(correctSource);

        source = `<math copySource="P" copyProp="x" assignNames="x" />`;
        correctSource = `<math extend="$P.x" name="x" />`;
        expect(toXml(await updateSyntax(source))).toEqual(correctSource);
    });

    it("collect gets converted to its new format", async () => {
        source = `<collect componentTypes="point" name="points" source="panel" assignNames="q1 q2 q3 q4 q5" />`;
        correctSource = `<collect componentType="point" name="points" from="$panel" />`;
        expect(toXml(await updateSyntax(source))).toEqual(correctSource);

        // References to the old `assignNames` get updated
        source = `<collect componentTypes="point" name="points" source="panel" assignNames="q1 q2 q3 q4 q5" /> $q1 $q4`;
        correctSource = `<collect componentType="point" name="points" from="$panel" /> $points[1] $points[4]`;
        expect(toXml(await updateSyntax(source))).toEqual(correctSource);

        // References to the old `assignNames` get updated
        source = `<p name="p"><collect componentTypes="point" name="points" source="panel" assignNames="q1 q2 q3 q4 q5" /></p> $p.q1 $q4`;
        correctSource = `<p name="p"><collect componentType="point" name="points" from="$panel" /></p> $p.points[1] $points[4]`;
        expect(toXml(await updateSyntax(source))).toEqual(correctSource);
    });

    it("collect with prop gets converted to its new format", async () => {
        source = `<collect componentTypes="point" name="xs" source="panel" prop="x" assignNames="x1 x2 x3 x4 x5" />`;
        correctSource = `<setup><collect componentType="point" name="collect_xs" from="$panel" /></setup><mathList name="xs" extend="$collect_xs.x" />`;
        expect(toXml(await updateSyntax(source))).toEqual(correctSource);

        // References to the old `assignNames` get updated
        source = `<collect componentTypes="point" name="xs" source="panel" prop="x" assignNames="x1 x2 x3 x4 x5" /> $x1 $x4`;
        correctSource = `<setup><collect componentType="point" name="collect_xs" from="$panel" /></setup><mathList name="xs" extend="$collect_xs.x" /> $xs[1] $xs[4]`;
        expect(toXml(await updateSyntax(source))).toEqual(correctSource);
    });

    it("can resolve the referent of a copy tag", async () => {
        source = `<math name="m">5</math><copy source="m" name="k" />$k`;
        correctSource = `<math name="m">5</math><math extend="$m" name="k" />$k`;
        expect(toXml(await updateSyntax(source))).toEqual(correctSource);
    });

    it("can convert an unlinked copy tag", async () => {
        source = `<math name="m">5</math><copy source="m" name="k" link="false" />$k`;
        correctSource = `<math name="m">5</math><math copy="$m" name="k" />$k`;
        expect(toXml(await updateSyntax(source))).toEqual(correctSource);
    });

    it("can convert a prop in a copy tag", async () => {
        source = `<point name="P">(1,2)</point><copy source="P" prop="x" name="k" />$k`;
        correctSource = `<point name="P">(1,2)</point><math extend="$P.x" name="k" />$k`;
        expect(toXml(await updateSyntax(source))).toEqual(correctSource);
    });

    it("can convert a prop in a copy tag with assignNames", async () => {
        source = `<point name="P">(1,2)</point><copy source="P" prop="x" assignNames="k" />$k`;
        correctSource = `<point name="P">(1,2)</point><math extend="$P.x" name="k" />$k`;
        expect(toXml(await updateSyntax(source))).toEqual(correctSource);
    });

    it("can resolve the referent of a copy tag (advanced)", async () => {
        source = `<point name="m" /><copy source="m.x" name="k" />$k`;
        correctSource = `<point name="m" /><math extend="$m.x" name="k" />$k`;
        expect(toXml(await updateSyntax(source))).toEqual(correctSource);

        source = `<polygon name="m" /><copy source="m.vertices[0]" name="k" />$k`;
        correctSource = `<polygon name="m" /><point extend="$m.vertices[0]" name="k" />$k`;
        expect(toXml(await updateSyntax(source))).toEqual(correctSource);
    });

    it("can convert macros with attributes into copy tags", async () => {
        source = `$x{foo="bar"}`;
        correctSource = `<copy foo="bar" source="$x" />`;
        expect(
            toXml(
                await updateSyntax(source, {
                    doNotUpgradeCopyTags: true,
                }),
            ),
        ).toEqual(correctSource);

        source = `$x[2].y{foo="bar"}`;
        correctSource = `<copy foo="bar" source="$x[2].y" />`;
        expect(
            toXml(
                await updateSyntax(source, {
                    doNotUpgradeCopyTags: true,
                }),
            ),
        ).toEqual(correctSource);
    });

    it("can convert macros with attributes that are in attributes into copy tags", async () => {
        source = `<point x="$x{foo='bar'}" />`;
        correctSource = `<setup><copy source="$x" foo="bar" name="ref1" /></setup><point x="$ref1" />`;
        expect(
            toXml(
                await updateSyntax(source, {
                    doNotUpgradeCopyTags: true,
                }),
            ),
        ).toEqual(correctSource);

        source = `<point x="$x.y{foo='bar'}" />`;
        correctSource = `<setup><copy source="$x.y" foo="bar" name="ref1" /></setup><point x="$ref1" />`;
        expect(
            toXml(
                await updateSyntax(source, {
                    doNotUpgradeCopyTags: true,
                }),
            ),
        ).toEqual(correctSource);
    });

    it("can convert macros with attributes that are in attributes into copy tags (realistic examples)", async () => {
        source = `<math name="a">5</math><point x="$a{foo='bar'}" />`;
        correctSource = `<setup><math extend="$a" foo="bar" name="ref1" /></setup><math name="a">5</math><point x="$ref1" />`;
        expect(toXml(await updateSyntax(source))).toEqual(correctSource);
    });

    it("can convert function macros", async () => {
        source = `$$f(2)`;
        correctSource = `$$f(2)`;
        expect(toXml(await updateSyntax(source))).toEqual(correctSource);

        source = `$$(x/f)(2)`;
        correctSource = `$$x.f(2)`;
        expect(toXml(await updateSyntax(source))).toEqual(correctSource);
    });

    it("function macros arguments get upgraded", async () => {
        source = `$$f($(x/y))`;
        correctSource = `$$f($x.y)`;
        expect(toXml(await updateSyntax(source))).toEqual(correctSource);
    });

    it("can reparse attributes", async () => {
        expect(toXml(reparseAttribute("t"))).toEqual("t");
        expect(toXml(reparseAttribute("$t"))).toEqual("$t");
    });

    it("map of sequence gets converted to a repeatForSequence", async () => {
        source = `
        <map assignNames="item1 item2" name="items">
            <template newNamespace><math name="m">$v^2</math><number name="n">$i^2</number></template>
            <sources alias="v" indexAlias="i">
               <sequence from="3" to="4" />
            </sources>
        </map>`;
        correctSource = `
        <repeatForSequence from="3" to="4" name="items" valueName="v" indexName="i"><math name="m">$v^2</math><number name="n">$i^2</number></repeatForSequence>`;
        expect(toXml(await updateSyntax(source))).toEqual(correctSource);

        // References to the old `assignNames` get updated
        source = `
        <map assignNames="item1 item2" name="items">
            <template newNamespace><math name="m">$v^2</math><number name="n">$i^2</number></template>
            <sources alias="v" indexAlias="i">
               <sequence from="3" to="4" />
            </sources>
        </map>
        $(item1/m) $(items[1]/n) $(items[2]/m) $(item2/n)`;
        correctSource = `
        <repeatForSequence from="3" to="4" name="items" valueName="v" indexName="i"><math name="m">$v^2</math><number name="n">$i^2</number></repeatForSequence>
        $items[1].m $items[1].n $items[2].m $items[2].n`;
        expect(toXml(await updateSyntax(source))).toEqual(correctSource);
    });

    it("map of non-sequence gets converted to a repeat over a group", async () => {
        source = `
        <map assignNames="item1 item2" name="items">
            <template newNamespace><math name="m">$v^2</math><number name="n">$i^2</number></template>
            <sources alias="v" indexAlias="i">
               <number>3</number><number>4</number>
            </sources>
        </map>`;
        correctSource = `
        <setup><group name="group">
               <number>3</number><number>4</number>
            </group></setup><repeat for="$group" name="items" valueName="v" indexName="i"><math name="m">$v^2</math><number name="n">$i^2</number></repeat>`;
        expect(toXml(await updateSyntax(source))).toEqual(correctSource);

        // References to the old `assignNames` get updated
        source = `
        <map assignNames="item1 item2" name="items">
            <template newNamespace><math name="m">$v^2</math><number name="n">$i^2</number></template>
            <sources alias="v" indexAlias="i"><number>3</number><number>4</number></sources>
        </map>
        $(item1/m) $(items[1]/n) $(items[2]/m) $(item2/n)`;
        correctSource = `
        <setup><group name="group"><number>3</number><number>4</number></group></setup><repeat for="$group" name="items" valueName="v" indexName="i"><math name="m">$v^2</math><number name="n">$i^2</number></repeat>
        $items[1].m $items[1].n $items[2].m $items[2].n`;
        expect(toXml(await updateSyntax(source))).toEqual(correctSource);
    });

    it("module gets converted to its new format", async () => {
        source = `
        <module name="m">
            <setup>
                <customAttribute componentType="number" attribute="a" assignNames="a" defaultValue="1" />
            </setup>
            <number name="twoa">2$a</number>
        </module>`;
        correctSource = `
        <module name="m">
            <moduleAttributes><number name="a">1</number></moduleAttributes>
            <number name="twoa">2$a</number>
        </module>`;
        expect(toXml(await updateSyntax(source))).toEqual(correctSource);
    });
});
