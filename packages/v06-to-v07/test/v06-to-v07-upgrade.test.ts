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
    const { xml } = await updateSyntaxFromV06toV07(...args);
    return xml;
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

        expect(await updateSyntax(source)).toEqual(correctSource);

        // Make sure if there are already dollar signs, they are not added again
        expect(await updateSyntax(correctSource)).toEqual(correctSource);
    });

    it("removes newNamespace attribute", async () => {
        source = `<graph name="g" newNamespace><point name="p" /></graph>`;
        correctSource = `<graph name="g"><point name="p" /></graph>`;
        expect(await updateSyntax(source)).toEqual(correctSource);
    });

    it("removes newNamespace attribute, different capitalization", async () => {
        source = `<graph name="g" newNameSpace><point name="p" /></graph>`;
        correctSource = `<graph name="g"><point name="p" /></graph>`;
        expect(await updateSyntax(source)).toEqual(correctSource);
    });

    it("macro path slashes get turned into dots", async () => {
        source = `$(foo/bar[3][4][$(b/c).d].baz)`;
        correctSource = `$foo.bar[3][4][$b.c.d].baz`;
        expect(await updateSyntax(source)).toEqual(correctSource);
    });

    it("macro path slashes get turned into dots in attributes", async () => {
        source = `<p foo="$(foo/bar[3][4][$(b/c).d].baz)" />`;
        correctSource = `<p foo="$foo.bar[3][4][$b.c.d].baz" />`;
        expect(
            await updateSyntax(source, {
                doNotUpgradeAttributeSyntax: true,
                doNotUpgradeCopyTags: true,
            }),
        ).toEqual(correctSource);
    });

    it("copy source slashes get turned into dots", async () => {
        source = `<copy source="foo/bar[3][4][$(b/c).d].baz"/>`;
        correctSource = `<copy source="foo.bar[3][4][$b.c.d].baz" />`;
        expect(
            await updateSyntax(source, {
                doNotUpgradeCopyTags: true,
            }),
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

    it("../ in attributes that are turned into references gets removed", async () => {
        source = `<update target="x/../bar" />`;
        correctSource = `<update target="$bar" />`;

        let res = await updateSyntaxFromV06toV07(source, {
            doNotUpgradeAttributeSyntax: true,
            doNotUpgradeCopyTags: true,
        });
        expect(toXml(res.dast)).toEqual(correctSource);

        source = `<number copySource="x/../bar" />`;
        correctSource = `<number extend="$bar" />`;

        res = await updateSyntaxFromV06toV07(source, {
            doNotUpgradeAttributeSyntax: true,
            doNotUpgradeCopyTags: true,
        });
        expect(toXml(res.dast)).toEqual(correctSource);
    });

    it("attributes aren't lost when turning slashes get turned into dots", async () => {
        source = `$foo.bar{baz="abc"}`;
        correctSource = `$foo.bar{baz="abc"}`;
        expect(
            await updateSyntax(source, {
                doNotUpgradeCopyTags: true,
                doNotUpgradeAttributeSyntax: true,
            }),
        ).toEqual(correctSource);
    });

    it("corrects capitalization in element names", async () => {
        source = `<pOiNt />`;
        correctSource = `<point />`;
        expect(await updateSyntax(source)).toEqual(correctSource);
    });

    it("ref element target attribute becomes to", async () => {
        source = `<ref target="$foo" />`;
        correctSource = `<ref to="$foo" />`;
        expect(await updateSyntax(source)).toEqual(correctSource);
    });

    it("ref element uri attribute becomes to", async () => {
        source = `<ref uri="https://doenet.org" />`;
        correctSource = `<ref to="https://doenet.org" />`;
        expect(await updateSyntax(source)).toEqual(correctSource);
    });

    it("copySource gets converted to extend or copy", async () => {
        source = `<point copySource="P" name="P2" />`;
        correctSource = `<point extend="$P" name="P2" />`;
        expect(await updateSyntax(source)).toEqual(correctSource);

        source = `<point CopySource="P" name="P2" />`;
        correctSource = `<point extend="$P" name="P2" />`;
        expect(await updateSyntax(source)).toEqual(correctSource);

        source = `<point copySource="P" name="P2" link="true" />`;
        correctSource = `<point extend="$P" name="P2" />`;
        expect(await updateSyntax(source)).toEqual(correctSource);

        source = `<point copySource="P" name="P2" link="false" />`;
        correctSource = `<point copy="$P" name="P2" />`;
        expect(await updateSyntax(source)).toEqual(correctSource);
    });

    it("copySource gets converted in the presence of assignNames", async () => {
        source = `<math copySource="P.x" assignNames="x" />`;
        correctSource = `<math extend="$P.x" name="x" />`;
        expect(await updateSyntax(source)).toEqual(correctSource);

        source = `<math copySource="P" copyProp="x" assignNames="x" />`;
        correctSource = `<math extend="$P.x" name="x" />`;
        expect(await updateSyntax(source)).toEqual(correctSource);
    });

    it("collect gets converted to its new format", async () => {
        source = `<collect componentTypes="point" name="points" source="panel" assignNames="q1 q2 q3 q4 q5" />`;
        correctSource = `<collect componentType="point" name="points" from="$panel" />`;
        expect(await updateSyntax(source)).toEqual(correctSource);

        // target attribute get converted as well
        source = `<collect componentTypes="point" name="points" target="panel" assignNames="q1 q2 q3 q4 q5" />`;
        correctSource = `<collect componentType="point" name="points" from="$panel" />`;
        expect(await updateSyntax(source)).toEqual(correctSource);

        // References to the old `assignNames` get updated
        source = `<collect componentTypes="point" name="points" source="panel" assignNames="q1 q2 q3 q4 q5" /> $q1 $q4`;
        correctSource = `<collect componentType="point" name="points" from="$panel" /> $points[1] $points[4]`;
        expect(await updateSyntax(source)).toEqual(correctSource);

        // References to the old `assignNames` get updated
        source = `<p name="p"><collect componentTypes="point" name="points" source="panel" assignNames="q1 q2 q3 q4 q5" /></p> $p.q1 $q4`;
        correctSource = `<p name="p"><collect componentType="point" name="points" from="$panel" /></p> $p.points[1] $points[4]`;
        expect(await updateSyntax(source)).toEqual(correctSource);
    });

    it("collect with prop gets converted to its new format", async () => {
        source = `<collect componentTypes="point" name="xs" source="panel" prop="x" assignNames="x1 x2 x3 x4 x5" />`;
        correctSource = `<setup><collect componentType="point" name="collect_xs" from="$panel" /></setup><mathList name="xs" extend="$collect_xs.x" />`;
        expect(await updateSyntax(source)).toEqual(correctSource);

        // References to the old `assignNames` get updated
        source = `<collect componentTypes="point" name="xs" source="panel" prop="x" assignNames="x1 x2 x3 x4 x5" /> $x1 $x4`;
        correctSource = `<setup><collect componentType="point" name="collect_xs" from="$panel" /></setup><mathList name="xs" extend="$collect_xs.x" /> $xs[1] $xs[4]`;
        expect(await updateSyntax(source)).toEqual(correctSource);
    });

    it("collect prop without name", async () => {
        source = `
        <collect source="a" componentTypes="math" prop="value"/>
`;
        correctSource = `
        <setup><collect from="$a" componentType="math" name="collect_list" /></setup><mathList name="list" extend="$collect_list.value" />
`;
        expect(await updateSyntax(source)).toEqual(correctSource);
    });

    it("collect with assignNames but no name", async () => {
        // The assigned names used to be turned into indices of the `<collect>`'s own
        // `name`, so a `<collect>` that had none stopped the conversion outright. The
        // first assigned name now becomes the name, as on any other composite.
        source = `<collect componentTypes="point" source="panel" assignNames="q1 q2" /> $q1 $q2`;
        correctSource = `<collect componentType="point" from="$panel" name="q1" /> $q1[1] $q1[2]`;
        expect(await updateSyntax(source)).toEqual(correctSource);

        source = `<collect componentTypes="point" source="panel" prop="x" assignNames="x1 x2" /> $x1 $x2`;
        correctSource = `<setup><collect componentType="point" from="$panel" name="collect_x1" /></setup><mathList name="x1" extend="$collect_x1.x" /> $x1[1] $x1[2]`;
        expect(await updateSyntax(source)).toEqual(correctSource);
    });

    it("a blank or padded name is replaced by the name the references use", async () => {
        // The name a reference is converted to comes from the `name` attribute's
        // *trimmed* value, and from the assigned names when the attribute is blank, so
        // the attribute itself has to be written back or it names something else.
        source = `<select name=" p " assignNames="a b" numToSelect="2">x y</select> $a $b`;
        correctSource = `<select name="p" numToSelect="2">x y</select> $p[1] $p[2]`;
        expect(await updateSyntax(source)).toEqual(correctSource);

        source = `<select name="" assignNames="a b" numToSelect="2">x y</select> $a $b`;
        correctSource = `<select name="a" numToSelect="2">x y</select> $a[1] $a[2]`;
        expect(await updateSyntax(source)).toEqual(correctSource);

        // The `<collect prop>` path builds the hoisted collect's name out of this one,
        // so an untrimmed name there produced `$collect_ c .x`, which is not a reference.
        source = `<collect componentTypes="point" source="panel" prop="x" name=" c " assignNames="a b" /> $a $b`;
        correctSource = `<setup><collect componentType="point" from="$panel" name="collect_c" /></setup><mathList name="c" extend="$collect_c.x" /> $c[1] $c[2]`;
        expect(await updateSyntax(source)).toEqual(correctSource);
    });

    it("warns when an assigned name is rewritten inside a prop access", async () => {
        // `x` and `y` are assigned names *and* the props of a point, so `$p.y` is
        // rewritten to a different prop of `p` entirely. The rewrite is still made,
        // because a v0.6 namespace path arrives here looking exactly the same, but this
        // is the shape that cannot be right, so it has to be reported.
        source = `<selectFromSequence assignNames="x y" numToSelect="2" from="1" to="10" /><point name="p">(3,4)</point><p>$p.x $p.y</p>`;
        let result = await updateSyntaxFromV06toV07(source);
        expect(result.xml).toEqual(
            `<selectFromSequence name="x" numToSelect="2" from="1" to="10" /><point name="p">(3,4)</point><p>$p.x[1] $p.x[2]</p>`,
        );
        expect(
            result.vfile.messages
                .filter((m) => m.ruleId === "assign-names/prop-like-reference")
                .map((m) => m.reason),
        ).toHaveLength(2);

        // A v0.6 namespace segment names a component rather than a prop, so converting
        // the part after the slash is exactly right and must not warn.
        source = `<graph name="g" newNamespace><selectFromSequence assignNames="a b" numToSelect="2" from="1" to="5" /></graph><p>$(g/a) $(g/b.value)</p>`;
        result = await updateSyntaxFromV06toV07(source);
        expect(result.xml).toEqual(
            `<graph name="g"><selectFromSequence name="a" numToSelect="2" from="1" to="5" /></graph><p>$g.a[1] $g.a[2].value</p>`,
        );
        expect(
            result.vfile.messages.filter(
                (m) => m.ruleId === "assign-names/prop-like-reference",
            ),
        ).toHaveLength(0);
    });

    it("correct capitalization of componentTypes attribute", async () => {
        source = `
        <collect source="a" componentTypes="mathinput"/>
`;
        correctSource = `
        <collect from="$a" componentType="mathInput" />
`;
        expect(await updateSyntax(source)).toEqual(correctSource);
    });

    it("can resolve the referent of a copy tag", async () => {
        source = `<math name="m">5</math><copy source="m" name="k" />$k`;
        correctSource = `<math name="m">5</math><math extend="$m" name="k" />$k`;
        expect(await updateSyntax(source)).toEqual(correctSource);
    });

    it("can convert an unlinked copy tag", async () => {
        source = `<math name="m">5</math><copy source="m" name="k" link="false" />$k`;
        correctSource = `<math name="m">5</math><math copy="$m" name="k" />$k`;
        expect(await updateSyntax(source)).toEqual(correctSource);
    });

    it("can convert a prop in a copy tag", async () => {
        source = `<point name="P">(1,2)</point><copy source="P" prop="x" name="k" />$k`;
        correctSource = `<point name="P">(1,2)</point><math extend="$P.x" name="k" />$k`;
        expect(await updateSyntax(source)).toEqual(correctSource);
    });

    it("can convert a prop in a copy tag with assignNames", async () => {
        source = `<point name="P">(1,2)</point><copy source="P" prop="x" assignNames="k" />$k`;
        correctSource = `<point name="P">(1,2)</point><math extend="$P.x" name="k" />$k`;
        expect(await updateSyntax(source)).toEqual(correctSource);
    });

    it("can resolve the referent of a copy tag (advanced)", async () => {
        source = `<point name="m" /><copy source="m.x" name="k" />$k`;
        correctSource = `<point name="m" /><math extend="$m.x" name="k" />$k`;
        expect(await updateSyntax(source)).toEqual(correctSource);

        source = `<polygon name="m" /><copy source="m.vertices[0]" name="k" />$k`;
        correctSource = `<polygon name="m" /><point extend="$m.vertices[0]" name="k" />$k`;
        expect(await updateSyntax(source)).toEqual(correctSource);
    });

    it("can convert macros with attributes into copy tags", async () => {
        source = `$x{foo="bar"}`;
        correctSource = `<copy foo="bar" source="$x" />`;
        expect(
            await updateSyntax(source, {
                doNotUpgradeCopyTags: true,
            }),
        ).toEqual(correctSource);

        source = `$x[2].y{foo="bar"}`;
        correctSource = `<copy foo="bar" source="$x[2].y" />`;
        expect(
            await updateSyntax(source, {
                doNotUpgradeCopyTags: true,
            }),
        ).toEqual(correctSource);
    });

    it("can convert macros with attributes that are in attributes into copy tags", async () => {
        source = `<point x="$x{foo='bar'}" />`;
        correctSource = `<setup><copy source="$x" foo="bar" name="ref1" /></setup><point x="$ref1" />`;
        expect(
            await updateSyntax(source, {
                doNotUpgradeCopyTags: true,
            }),
        ).toEqual(correctSource);

        source = `<point x="$x.y{foo='bar'}" />`;
        correctSource = `<setup><copy source="$x.y" foo="bar" name="ref1" /></setup><point x="$ref1" />`;
        expect(
            await updateSyntax(source, {
                doNotUpgradeCopyTags: true,
            }),
        ).toEqual(correctSource);
    });

    it("can convert macros with attributes that are in attributes into copy tags (realistic examples)", async () => {
        source = `<math name="a">5</math><point x="$a{foo='bar'}" />`;
        correctSource = `<setup><math extend="$a" foo="bar" name="ref1" /></setup><math name="a">5</math><point x="$ref1" />`;
        expect(await updateSyntax(source)).toEqual(correctSource);
    });

    it("can convert function macros", async () => {
        source = `$$f(2)`;
        correctSource = `$$f(2)`;
        expect(await updateSyntax(source)).toEqual(correctSource);

        source = `$$(x/f)(2)`;
        correctSource = `$$x.f(2)`;
        expect(await updateSyntax(source)).toEqual(correctSource);
    });

    it("function macros arguments get upgraded", async () => {
        source = `$$f($(x/y))`;
        correctSource = `$$f($x.y)`;
        expect(await updateSyntax(source)).toEqual(correctSource);
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
        expect(await updateSyntax(source)).toEqual(correctSource);

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
        expect(await updateSyntax(source)).toEqual(correctSource);
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
        expect(await updateSyntax(source)).toEqual(correctSource);

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
        expect(await updateSyntax(source)).toEqual(correctSource);
    });

    it("map with assignNames and no name gets converted to a repeatForSequence", async () => {
        source = `
        <map assignNames="a b">
            <template newNamespace><math name="m">$v^2</math><number name="n">$i^2</number></template>
            <sources alias="v" indexAlias="i">
               <sequence from="3" to="4" />
            </sources>
        </map>
        $(a/m) $(a/n) $(b/m) $(b/n)`;
        correctSource = `
        <repeatForSequence from="3" to="4" name="a" valueName="v" indexName="i"><math name="m">$v^2</math><number name="n">$i^2</number></repeatForSequence>
        $a[1].m $a[1].n $a[2].m $a[2].n`;
        expect(await updateSyntax(source)).toEqual(correctSource);
    });

    it("leaves references alone when a map cannot be converted", async () => {
        // Without a `<sources>` the `<map>` is left for a human, `assignNames` and all,
        // so its assigned names must not be rewritten into indices of a name that
        // nothing ends up carrying.
        source = `<map assignNames="a b"><template><p>x</p></template></map> $a $b`;
        const res = await updateSyntaxFromV06toV07(source, {
            doNotUpgradeCopyTags: true,
        });
        expect(toXml(res.dast)).toEqual(source);
        expect(res.vfile.messages.map((m) => m.reason)).toEqual([
            "Map element must have both a template and sources children to be converted",
        ]);
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
        expect(await updateSyntax(source)).toEqual(correctSource);
    });

    it("selectFromSequence with assignNames gets converted", async () => {
        source = `<selectFromSequence assignNames="n" /> $n`;
        correctSource = `<selectFromSequence name="n" /> $n`;
        expect(await updateSyntax(source)).toEqual(correctSource);
    });

    it("selectFromSequence selecting 2 with assignNames gets converted", async () => {
        source = `<selectFromSequence assignNames="n m" numToSelect="2" /> $n $m`;
        correctSource = `<selectFromSequence name="n" numToSelect="2" /> $n[1] $n[2]`;
        expect(await updateSyntax(source)).toEqual(correctSource);
    });

    it("selectFromSequence with assignNames and name", async () => {
        source = `<selectFromSequence assignNames="n m" name="s" numToSelect="2" /> $n $m $s`;
        correctSource = `<selectFromSequence name="s" numToSelect="2" /> $s[1] $s[2] $s`;
        expect(await updateSyntax(source)).toEqual(correctSource);
    });

    it("select with assignNames gets converted", async () => {
        source = `<select assignNames="n" >a b c d</select> $n`;
        correctSource = `<select name="n">a b c d</select> $n`;
        expect(await updateSyntax(source)).toEqual(correctSource);
    });

    it("select selecting 2 with assignNames gets converted", async () => {
        source = `<select assignNames="n m" numToSelect="2" >a b c d</select> $n $m`;
        correctSource = `<select name="n" numToSelect="2">a b c d</select> $n[1] $n[2]`;
        expect(await updateSyntax(source)).toEqual(correctSource);
    });

    it("select with assignNames and name", async () => {
        source = `<select name="s" assignNames="n m" numToSelect="2" >a b c d</select> $n $m $s`;
        correctSource = `<select name="s" numToSelect="2">a b c d</select> $s[1] $s[2] $s`;
        expect(await updateSyntax(source)).toEqual(correctSource);
    });

    it("conditionalContent assignNames becomes indices under the selected case", async () => {
        // `<case>` is a transparent wrapper in v0.7 and only the selected one produces a
        // replacement, so every name sits under the single index `[1]`.
        source = `<conditionalContent assignNames="(a b)"><case condition="$c"><math name="m">x</math><number>2</number></case><else><math>y</math><number>3</number></else></conditionalContent> $a $b`;
        correctSource = `<conditionalContent name="a"><case condition="$c"><math name="m">x</math><number>2</number></case><else><math>y</math><number>3</number></else></conditionalContent> $a[1][1] $a[1][2]`;
        expect(await updateSyntax(source)).toEqual(correctSource);
    });

    it("select with options and nested assignNames", async () => {
        source = `<select assignNames="(a b) (c d)" numToSelect="2"><option><math>x</math><number>1</number></option><option><math>y</math><number>2</number></option></select> $a $b $c $d`;
        correctSource = `<select name="a" numToSelect="2"><option><math>x</math><number>1</number></option><option><math>y</math><number>2</number></option></select> $a[1][1] $a[1][2] $a[2][1] $a[2][2]`;
        expect(await updateSyntax(source)).toEqual(correctSource);
    });

    it("sort with assignNames does not take the single-name shortcut", async () => {
        // `<sort>` produces one replacement per input, so `assignNames` always becomes
        // indices even when only one name is given.
        source = `<sort assignNames="a b c"><point>(1,2)</point></sort> $a $b $c`;
        correctSource = `<sort name="a"><point>(1,2)</point></sort> $a[1] $a[2] $a[3]`;
        expect(await updateSyntax(source)).toEqual(correctSource);
    });

    it("references inside attribute values get renamed", async () => {
        source = `<selectFromSequence assignNames="a c" name="s" numToSelect="2" /><selectFromSequence assignNames="b" from="-6abs($a)" to="6abs($a)" /> $b`;
        correctSource = `<selectFromSequence name="s" numToSelect="2" /><selectFromSequence name="b" from="-6abs($s[1])" to="6abs($s[1])" /> $b`;
        expect(await updateSyntax(source)).toEqual(correctSource);
    });

    it("references inside macro indices and function macro arguments get renamed", async () => {
        source = `<selectFromSequence assignNames="p q" numToSelect="2" /> $list[$p]`;
        correctSource = `<selectFromSequence name="p" numToSelect="2" /> $list[$p[1]]`;
        expect(
            await updateSyntax(source, { doNotUpgradeCopyTags: true }),
        ).toEqual(correctSource);

        source = `<selectFromSequence assignNames="p q" numToSelect="2" /> $$f($p)`;
        correctSource = `<selectFromSequence name="p" numToSelect="2" /> $$f($p[1])`;
        expect(
            await updateSyntax(source, { doNotUpgradeCopyTags: true }),
        ).toEqual(correctSource);
    });

    it("references in a dollar-less source attribute get renamed", async () => {
        source = `<selectFromSequence assignNames="p q" numToSelect="2" /><copy source="p" />`;
        correctSource = `<selectFromSequence name="p" numToSelect="2" /><copy source="p[1]" />`;
        expect(
            await updateSyntax(source, { doNotUpgradeCopyTags: true }),
        ).toEqual(correctSource);
    });

    it("indices already written by the author are preserved", async () => {
        source = `<selectFromSequence assignNames="a b" numToSelect="2" /> $a[2]`;
        correctSource = `<selectFromSequence name="a" numToSelect="2" /> $a[1][2]`;
        expect(
            await updateSyntax(source, { doNotUpgradeCopyTags: true }),
        ).toEqual(correctSource);
    });

    it("unbalanced parentheses in assignNames are reported and left alone", async () => {
        source = `<select assignNames="(a b" numToSelect="2">x y</select> $a`;
        correctSource = `<select numToSelect="2">x y</select> $a`;

        const res = await updateSyntaxFromV06toV07(source, {
            doNotUpgradeCopyTags: true,
        });
        expect(toXml(res.dast)).toEqual(correctSource);
        expect(res.vfile.messages.map((m) => m.ruleId)).toEqual([
            "assign-names/unbalanced-parens",
        ]);
    });

    it("warns when a branch mixes plain text with components", async () => {
        // v0.6 skipped bare text when handing out names; v0.7 counts it as a
        // replacement, so the indices shift and the author needs to check them.
        source = `<conditionalContent assignNames="(a b)"><case condition="$c">text <math name="m">x</math><number>2</number></case></conditionalContent> $a $b`;
        correctSource = `<conditionalContent name="a"><case condition="$c">text <math name="m">x</math><number>2</number></case></conditionalContent> $a[1][2] $a[1][3]`;

        const res = await updateSyntaxFromV06toV07(source);
        expect(toXml(res.dast)).toEqual(correctSource);
        expect(res.vfile.messages.map((m) => m.ruleId)).toEqual([
            "assign-names/primitive-skew",
        ]);
    });

    it("map with nested assignNames and no name gets converted", async () => {
        source = `<map assignNames="(p1 s1) (p2 s2)"><template newNamespace><math name="m">$v</math><number name="n">$i</number></template><sources alias="v"><sequence from="1" to="2" /></sources></map> $p1 $s1 $p2 $s2`;
        correctSource = `<repeatForSequence from="1" to="2" name="p1" valueName="v"><math name="m">$v</math><number name="n">$i</number></repeatForSequence> $p1[1][1] $p1[1][2] $p1[2][1] $p1[2][2]`;
        expect(await updateSyntax(source)).toEqual(correctSource);
    });

    it("module setup keeps everything that is not a customAttribute", async () => {
        source = `<module name="m"><setup><customAttribute componentType="number" attribute="a" assignNames="a" defaultValue="1" /><number name="twice">2$a</number></setup><number name="t">$twice</number></module>`;
        correctSource = `<module name="m"><moduleAttributes><number name="a">1</number></moduleAttributes><setup><number name="twice">2$a</number></setup><number name="t">$twice</number></module>`;
        expect(await updateSyntax(source)).toEqual(correctSource);
    });

    it("resolves a copy whose source became an indexed reference", async () => {
        // Rewriting `assignNames` turns `source="p"` into `source="p[1]"`, and the
        // referent's type is the type of that one replacement, not of the composite.
        source = `<selectFromSequence assignNames="p q" numToSelect="2" from="1" to="10" /><copy source="p" name="k" />`;
        correctSource = `<selectFromSequence name="p" numToSelect="2" from="1" to="10" /><number extend="$p[1]" name="k" />`;
        expect(await updateSyntax(source)).toEqual(correctSource);

        source = `<select assignNames="a b" numToSelect="2">x y z</select><copy source="b" name="k" />`;
        correctSource = `<select name="a" numToSelect="2">x y z</select><group extend="$a[2]" name="k" />`;
        expect(await updateSyntax(source)).toEqual(correctSource);
    });

    it("two composites cannot both claim the same assigned name", async () => {
        // v0.7 rejects a duplicate `name`, so only the first composite gets to reuse the
        // shared token; the second falls back to a generated name.
        source = `<selectFromSequence assignNames="a b" numToSelect="2" /><select assignNames="a c" numToSelect="2">x y</select> $a $b $c`;
        correctSource = `<selectFromSequence name="a" numToSelect="2" /><select name="select" numToSelect="2">x y</select> $a[1] $a[2] $select[2]`;

        const res = await updateSyntaxFromV06toV07(source, {
            doNotUpgradeCopyTags: true,
        });
        expect(toXml(res.dast)).toEqual(correctSource);
        expect(res.vfile.messages.map((m) => m.ruleId)).toEqual([
            "assign-names/duplicate-name",
        ]);
    });

    it("two composites taking the single-name shortcut cannot share a name", async () => {
        // Both of these would otherwise become `name="a"`, which v0.7 rejects. The first
        // keeps the name (so `$a` still resolves to it) and the second is renamed.
        source = `<selectFromSequence assignNames="a" from="1" to="5" /><selectFromSequence assignNames="a" from="1" to="5" /> $a`;
        correctSource = `<selectFromSequence name="a" from="1" to="5" /><selectFromSequence name="selectFromSequence" from="1" to="5" /> $a`;

        const res = await updateSyntaxFromV06toV07(source, {
            doNotUpgradeCopyTags: true,
        });
        expect(toXml(res.dast)).toEqual(correctSource);
        expect(res.vfile.messages.map((m) => m.ruleId)).toEqual([
            "assign-names/duplicate-name",
        ]);
    });

    it("does not let a later composite steal a name the shortcut already used", async () => {
        source = `<selectFromSequence assignNames="a" from="1" to="5" /><selectFromSequence assignNames="a b" numToSelect="2" /> $a $b`;
        correctSource = `<selectFromSequence name="a" from="1" to="5" /><selectFromSequence name="selectFromSequence" numToSelect="2" /> $a $selectFromSequence[2]`;

        const res = await updateSyntaxFromV06toV07(source, {
            doNotUpgradeCopyTags: true,
        });
        expect(toXml(res.dast)).toEqual(correctSource);
        expect(res.vfile.messages.map((m) => m.ruleId)).toEqual([
            "assign-names/duplicate-name",
        ]);
    });

    it("drops an assignNames value that names nothing", async () => {
        for (const value of ["", "()", "( )"]) {
            const res = await updateSyntaxFromV06toV07(
                `<selectFromSequence assignNames="${value}" from="1" to="5" />`,
                { doNotUpgradeCopyTags: true },
            );
            expect(toXml(res.dast)).toEqual(
                `<selectFromSequence from="1" to="5" />`,
            );
            expect(res.vfile.messages).toEqual([]);
        }
    });

    it("flags a composite whose own attribute refers to the name it is given", async () => {
        // `$aa` resolved to nothing in v0.6; with the name on the element it is circular.
        source = `<selectFromSequence assignNames="aa" from="-4" to="4" exclude="$aa" /> $aa`;
        correctSource = `<selectFromSequence name="aa" from="-4" to="4" exclude="$aa" /> $aa`;

        const res = await updateSyntaxFromV06toV07(source, {
            doNotUpgradeCopyTags: true,
        });
        expect(toXml(res.dast)).toEqual(correctSource);
        expect(res.vfile.messages.map((m) => m.ruleId)).toEqual([
            "assign-names/self-reference",
        ]);
    });

    it("still converts a document whose <copy> tags cannot be resolved", async () => {
        // The document cannot be loaded (the reference is circular), but everything that
        // does not need the document loaded should still be converted.
        source = `<selectFromSequence assignNames="aa" from="-4" to="4" exclude="$aa" /><copy source="aa" />`;

        const res = await updateSyntaxFromV06toV07(source);
        expect(toXml(res.dast)).toContain(`<selectFromSequence name="aa"`);
        expect(res.vfile.messages.map((m) => m.ruleId)).toContain(
            "copy/could-not-load-document",
        );
    });

    it("leaves slashes alone in a source attribute that is a URL", async () => {
        // `source` names a component on `<copy>`/`<collect>`/`<extract>`, but it is a URL
        // on `<image>` and `<video>`, where the slashes are path separators.
        for (const src of [
            `<image source="images/plot.png" />`,
            `<video source="clips/intro.mp4" />`,
        ]) {
            expect(
                await updateSyntax(src, { doNotUpgradeCopyTags: true }),
            ).toEqual(src);
        }
    });

    it("resolves ../ in a source attribute the same way as in a macro", async () => {
        source = `<copy source="x/../f" />`;
        correctSource = `<copy source="f" />`;
        const res = await updateSyntaxFromV06toV07(source, {
            doNotUpgradeCopyTags: true,
        });
        expect(toXml(res.dast)).toEqual(correctSource);
        expect(res.vfile.messages).toHaveLength(1);
    });

    it("list item props become indices on the list", async () => {
        // v0.6 reached a list's contents through `maths`/`math2`; v0.7 indexes the list.
        source = `<mathList name="eq">1 2 3</mathList><p>$eq.maths</p><p>$eq.math2</p>`;
        correctSource = `<mathList name="eq">1 2 3</mathList><p>$eq</p><p>$eq[2]</p>`;
        expect(await updateSyntax(source)).toEqual(correctSource);

        source = `<mathList name="eq">1 2 3</mathList><copy prop="maths" source="eq" name="k" />`;
        correctSource = `<mathList name="eq">1 2 3</mathList><mathList extend="$eq" name="k" />`;
        expect(await updateSyntax(source)).toEqual(correctSource);

        source = `<mathList name="eq">1 2 3</mathList><copy prop="math2" source="eq" name="k" />`;
        correctSource = `<mathList name="eq">1 2 3</mathList><math extend="$eq[2]" name="k" />`;
        expect(await updateSyntax(source)).toEqual(correctSource);

        source = `<mathList name="eq">1 2 3</mathList><math name="m" copySource="eq" copyProp="math1" />`;
        correctSource = `<mathList name="eq">1 2 3</mathList><math name="m" extend="$eq[1]" />`;
        expect(await updateSyntax(source)).toEqual(correctSource);
    });

    it("constraints element is removed and replaced with children", async () => {
        source = `
        <point>
            (3,4)
            <constraints><constrainToGrid /><constrainToGraph /></constraints>
        </point>`;
        correctSource = `
        <point>
            (3,4)
            <constrainToGrid /><constrainToGraph />
        </point>`;
        expect(await updateSyntax(source)).toEqual(correctSource);
    });

    it("styleDefinitions element is removed and replaced with children", async () => {
        source = `
        <setup>
            <styleDefinitions><styleDefinition /></styleDefinitions>
        </setup>`;
        correctSource = `
        <setup>
            <styleDefinition />
        </setup>`;
        expect(await updateSyntax(source)).toEqual(correctSource);
    });

    it("feedbackDefinitions element is removed and replaced with children", async () => {
        source = `
        <setup>
            <feedbackDefinitions><feedbackDefinition /></feedbackDefinitions>
        </setup>`;
        correctSource = `
        <setup>
            <feedbackDefinition />
        </setup>`;
        expect(await updateSyntax(source)).toEqual(correctSource);
    });
});

describe("v0.6-only element capitalization", () => {
    it("normalizes elements that v0.7 no longer has", async () => {
        // These names are not in the v0.7 component list, so they used to be left alone
        // and the plugins that match on them silently did nothing.
        const { xml } = await updateSyntaxFromV06toV07(
            `<Map assignNames="a b" name="m"><Template newNamespace><math name="q">$v</math></Template><Sources alias="v"><sequence from="1" to="2" /></Sources></Map> $a`,
        );
        expect(xml).toEqual(
            `<repeatForSequence from="1" to="2" name="m" valueName="v"><math name="q">$v</math></repeatForSequence> $m[1]`,
        );
    });

    it("normalizes a capitalized constraints wrapper", async () => {
        const { xml } = await updateSyntaxFromV06toV07(
            `<point>(3,4)<Constraints><constrainToGrid /></Constraints></point>`,
        );
        expect(xml).toEqual(`<point>(3,4)<constrainToGrid /></point>`);
    });
});

describe("regressions found by review", () => {
    let source: string;
    let correctSource: string;

    it("converts a function macro nested in another's arguments inside an attribute", async () => {
        // The ordinary traversal never enters an attribute, so these were left in v0.6
        // shape — and later passes then tripped over them.
        source = `<p a="$$f($$(g/h)(2))" />`;
        correctSource = `<p a="$$f($$g.h(2))" />`;
        expect(
            await updateSyntax(source, { doNotUpgradeCopyTags: true }),
        ).toEqual(correctSource);

        // ...and a reference inside those arguments is still renamed.
        source = `<selectFromSequence assignNames="q r" numToSelect="2" /><p a="$$f($$(g/h)($q))" />`;
        correctSource = `<selectFromSequence name="q" numToSelect="2" /><p a="$$f($$g.h($q[1]))" />`;
        expect(
            await updateSyntax(source, { doNotUpgradeCopyTags: true }),
        ).toEqual(correctSource);
    });

    it("keeps references to a hyphenated assigned name", async () => {
        source = `<selectFromSequence assignNames="foo-bar baz" numToSelect="2" /> $(foo-bar) $baz`;
        correctSource = `<selectFromSequence name="foo-bar" numToSelect="2" /> $(foo-bar[1]) $(foo-bar[2])`;
        expect(
            await updateSyntax(source, { doNotUpgradeCopyTags: true }),
        ).toEqual(correctSource);
    });

    it("turns an image's description into the accessibility text v0.7 requires", async () => {
        // v0.6 rendered `description` as the image's `alt`; dropping it would lose the
        // alternative text for every converted image.
        source = `<image description="a plot of x squared" source="x.png" />`;
        correctSource = `<image source="x.png"><shortDescription>a plot of x squared</shortDescription></image>`;
        expect(
            await updateSyntax(source, { doNotUpgradeCopyTags: true }),
        ).toEqual(correctSource);
    });
});
