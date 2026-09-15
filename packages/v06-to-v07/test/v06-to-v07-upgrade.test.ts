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
            [1:8-1:19: There is no equivalent to the $(../x) syntax; a best-guess was made when converting $(x/../bar)],
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
            [1:8-1:22: There is no equivalent to the $(../x) syntax; a best-guess was made when converting $(x/../../bar)],
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

        // A reference from outside the namespace gets updated at the part that names the
        // assigned component. v0.6 addressed that with a slash — dot notation there would
        // have been a prop of `p`, which is a different thing entirely.
        source = `<p name="p" newNamespace><collect componentTypes="point" name="points" source="panel" assignNames="q1 q2 q3 q4 q5" /></p> $(p/q1) $(p/q4)`;
        correctSource = `<p name="p"><collect componentType="point" name="points" from="$panel" /></p> $p.points[1] $p.points[4]`;
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

    it("leaves a prop access alone", async () => {
        // In v0.6, dot notation reached public state variables and nothing else, so a
        // part written after a `.` never named a component `assignNames` created. Here
        // `x` and `y` are assigned names *and* the props of a point: `$p.y` was the
        // point's y-coordinate, and rewriting it would read something else entirely.
        source = `<selectFromSequence assignNames="x y" numToSelect="2" from="1" to="10" /><point name="p">(3,4)</point><p>$p.x $p.y</p>`;
        let result = await updateSyntaxFromV06toV07(source);
        expect(result.xml).toEqual(
            `<selectFromSequence name="x" numToSelect="2" from="1" to="10" /><point name="p">(3,4)</point><p>$p.x $p.y</p>`,
        );

        // The same holds when nothing has a prop of that name: v0.6 dot notation could
        // only ever have been a prop, so the reference was already broken and repairing
        // it is not the converter's job.
        source = `<p name="p"><collect componentTypes="point" name="points" source="panel" assignNames="q1 q2" /></p> $p.q1`;
        result = await updateSyntaxFromV06toV07(source);
        expect(result.xml).toEqual(
            `<p name="p"><collect componentType="point" name="points" from="$panel" /></p> $p.q1`,
        );

        // A v0.6 namespace segment names a component rather than a prop, so the part
        // after the slash is converted — and the `.value` after it is still left alone.
        source = `<graph name="g" newNamespace><selectFromSequence assignNames="a b" numToSelect="2" from="1" to="5" /></graph><p>$(g/a) $(g/b.value)</p>`;
        result = await updateSyntaxFromV06toV07(source);
        expect(result.xml).toEqual(
            `<graph name="g"><selectFromSequence name="a" numToSelect="2" from="1" to="5" /></graph><p>$g.a[1] $g.a[2].value</p>`,
        );
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

describe("regressions found by the second review", () => {
    let source: string;
    let correctSource: string;

    it("converts a function macro inside a macro's index", async () => {
        source = `<p a="$list[$$(g/h)(2)]" />`;
        correctSource = `<p a="$list[$$g.h(2)]" />`;
        expect(
            await updateSyntax(source, { doNotUpgradeCopyTags: true }),
        ).toEqual(correctSource);
    });

    it("leaves a namespace segment that happens to be named like a list prop", async () => {
        // `$(g/maths)` names a component; only a prop access is a list's contents.
        source = `<p>$(g/maths)</p>`;
        correctSource = `<p>$g.maths</p>`;
        expect(
            await updateSyntax(source, { doNotUpgradeCopyTags: true }),
        ).toEqual(correctSource);
    });

    it("never names an element after an internal component type", async () => {
        // `1p` is not a legal name, so the point becomes an `_error` — and a `<copy>` of
        // it used to be renamed to `<_error>`, which is not an element anyone can write.
        source = `<point name="1p">(1,2)</point><copy source="1p" name="k" />`;
        const { xml } = await updateSyntaxFromV06toV07(source);
        expect(xml).not.toContain("<_error");
        expect(xml).toContain(`<copy source="1p" name="k" />`);
    });

    it("renames and resolves a hyphenated name in a dollar-less source", async () => {
        source = `<selectFromSequence assignNames="foo-bar baz" numToSelect="2" from="1" to="9" /><copy source="foo-bar" name="k" />`;
        correctSource = `<selectFromSequence name="foo-bar" numToSelect="2" from="1" to="9" /><number extend="$(foo-bar[1])" name="k" />`;
        expect(await updateSyntax(source)).toEqual(correctSource);
    });
});

describe("regressions found by the third review", () => {
    let source: string;
    let correctSource: string;

    it("renames a reference written inside a dollar-less source's index", async () => {
        source = `<selectFromSequence assignNames="a b" numToSelect="2" /><copy source="g/list[$a]" />`;
        correctSource = `<selectFromSequence name="a" numToSelect="2" /><copy source="g.list[$a[1]]" />`;
        expect(
            await updateSyntax(source, { doNotUpgradeCopyTags: true }),
        ).toEqual(correctSource);
    });

    it("reports a leading ../ as well as one in the middle", async () => {
        // There is nothing to drop, but the reference still ends up somewhere the author
        // did not write.
        const res = await updateSyntaxFromV06toV07(`<copy source="../f" />`, {
            doNotUpgradeCopyTags: true,
        });
        expect(toXml(res.dast)).toEqual(`<copy source="f" />`);
        expect(res.vfile.messages).toHaveLength(1);
    });

    it("does not promote an assigned name that v0.7 would reject", async () => {
        source = `<selectFromSequence assignNames="1abc" /> $1abc`;
        const res = await updateSyntaxFromV06toV07(source, {
            doNotUpgradeCopyTags: true,
        });
        expect(toXml(res.dast)).not.toContain(`name="1abc"`);
        expect(res.vfile.messages.map((m) => m.ruleId)).toContain(
            "assign-names/invalid-name",
        );
    });

    it("keeps a copy's own name when the assigned name matches it", async () => {
        source = `<math name="m">5</math><copy source="m" name="a" assignNames="a" /> $a`;
        correctSource = `<math name="m">5</math><copy source="m" name="a" /> $a`;
        expect(
            await updateSyntax(source, { doNotUpgradeCopyTags: true }),
        ).toEqual(correctSource);
    });

    it("normalizes a padded name a copy already had", async () => {
        source = `<math name="m">5</math><copy source="m" name=" a " assignNames="b" /> $b`;
        correctSource = `<math name="m">5</math><copy source="m" name="a" /> $a`;
        expect(
            await updateSyntax(source, { doNotUpgradeCopyTags: true }),
        ).toEqual(correctSource);
    });
});

describe("regressions found by the fourth review", () => {
    let source: string;
    let correctSource: string;

    it("converts a parent path inside a function macro", async () => {
        // The diagnostic for `..` was built from the already-converted macro, which the
        // v0.6 serializer cannot read — so this threw instead of converting.
        source = `<p>$$(../f)(2)</p>`;
        correctSource = `<p>$$f(2)</p>`;
        const res = await updateSyntaxFromV06toV07(source, {
            doNotUpgradeCopyTags: true,
        });
        expect(toXml(res.dast)).toEqual(correctSource);
        expect(res.vfile.messages).toHaveLength(1);
    });

    it("keeps a numbered list prop when the name needs parentheses", async () => {
        // Dropping `prop` before the index was in place widened the copy from one item
        // to the whole list.
        source = `<mathList name="foo-bar">1 2 3</mathList><copy source="foo-bar" prop="math2" name="k" />`;
        correctSource = `<mathList name="foo-bar">1 2 3</mathList><copy source="foo-bar[2]" name="k" />`;
        expect(
            await updateSyntax(source, { doNotUpgradeCopyTags: true }),
        ).toEqual(correctSource);
    });

    it("writes a reference list token in the form that can express it", async () => {
        // `$a-b` is a subtraction and `$g/a` is `$g` followed by text, so neither is the
        // reference the attribute needs.
        source = `<answer><award sourcesAreResponses="a-b"><when>1=1</when></award></answer>`;
        correctSource = `<answer><award referencesAreResponses="$(a-b)"><when>1=1</when></award></answer>`;
        expect(
            await updateSyntax(source, { doNotUpgradeCopyTags: true }),
        ).toEqual(correctSource);

        source = `<answer><award sourcesAreResponses="g/a"><when>1=1</when></award></answer>`;
        correctSource = `<answer><award referencesAreResponses="$g.a"><when>1=1</when></award></answer>`;
        expect(
            await updateSyntax(source, { doNotUpgradeCopyTags: true }),
        ).toEqual(correctSource);
    });
});

describe("regressions found by the fifth review", () => {
    let source: string;
    let correctSource: string;

    it("tells apart the same assigned name in two namespaces", async () => {
        // v0.6 let both of these be called `a`, and a reference said which it meant by
        // writing the namespace. Only one can keep the bare name once the namespaces are
        // gone, so each reference has to follow the one it was reaching into.
        source = `<graph name="g1" newNamespace><selectFromSequence assignNames="a b" numToSelect="2" from="1" to="5" /></graph><graph name="g2" newNamespace><selectFromSequence assignNames="a b" numToSelect="2" from="1" to="5" /></graph><p>$(g1/a) $(g2/a) $(g2/b)</p>`;
        const res = await updateSyntaxFromV06toV07(source, {
            doNotUpgradeCopyTags: true,
        });
        const xml = toXml(res.dast);
        expect(xml).toContain(
            `<p>$g1.a[1] $g2.selectFromSequence[1] $g2.selectFromSequence[2]</p>`,
        );
        // Two namespaces using one name is not a clash, so nothing is reported.
        expect(res.vfile.messages.map((m) => m.ruleId)).not.toContain(
            "assign-names/duplicate-name",
        );
    });

    it("still reports two composites assigning one name in the same place", async () => {
        source = `<selectFromSequence assignNames="a b" numToSelect="2" /><selectFromSequence assignNames="a c" numToSelect="2" /> $a $b`;
        const res = await updateSyntaxFromV06toV07(source, {
            doNotUpgradeCopyTags: true,
        });
        // The first keeps the name and the references; the second gets its own.
        expect(toXml(res.dast)).toContain(`$a[1] $a[2]`);
        expect(res.vfile.messages.map((m) => m.ruleId)).toContain(
            "assign-names/duplicate-name",
        );
    });

    it("does not read a copy's own attributes as module parameters", async () => {
        // `link` belongs to the `<copy>`, so it says nothing about the external target.
        source = `<copy uri="doenet:cid=abc" link="false" />`;
        const res = await updateSyntaxFromV06toV07(source, {
            doNotUpgradeCopyTags: true,
        });
        expect(toXml(res.dast)).toEqual(source);
        expect(res.vfile.messages.map((m) => m.ruleId)).toContain(
            "external-copy/unknown-component-type",
        );
    });

    it("normalizes a reference token that already has a dollar sign", async () => {
        source = `<answer><award sourcesAreResponses="$g/a"><when>1=1</when></award></answer>`;
        correctSource = `<answer><award referencesAreResponses="$g.a"><when>1=1</when></award></answer>`;
        expect(
            await updateSyntax(source, { doNotUpgradeCopyTags: true }),
        ).toEqual(correctSource);
    });

    it("does not move a reference when a copy's own name is already taken", async () => {
        source = `<point name="a">(1,2)</point><copy source="m" name="c" assignNames="a" /> $a`;
        correctSource = `<point name="a">(1,2)</point><copy source="m" name="c" /> $a`;
        expect(
            await updateSyntax(source, { doNotUpgradeCopyTags: true }),
        ).toEqual(correctSource);
    });
});

describe("regressions found by the sixth review", () => {
    let source: string;
    let correctSource: string;

    it("only treats a namespace as a namespace boundary", async () => {
        // `<p name="wrapper">` is named but was never a namespace, so the v0.6 reference
        // is `$(g/a)` and the scope recorded for the composite has to say the same.
        source = `<graph name="g" newNamespace><p name="wrapper"><selectFromSequence assignNames="a b" numToSelect="2" from="1" to="5" /></p></graph><p>$(g/a)</p>`;
        correctSource = `<graph name="g"><p name="wrapper"><selectFromSequence name="a" numToSelect="2" from="1" to="5" /></p></graph><p>$g.a[1]</p>`;
        expect(
            await updateSyntax(source, { doNotUpgradeCopyTags: true }),
        ).toEqual(correctSource);
    });

    it("resolves a reference within its own namespace", async () => {
        // Neither `$a` names a namespace, so only where each is written says which
        // composite it meant.
        source = `<graph name="g1" newNamespace><selectFromSequence assignNames="a b" numToSelect="2" from="1" to="5" /><p>$a</p></graph><graph name="g2" newNamespace><selectFromSequence assignNames="a b" numToSelect="2" from="1" to="5" /><p>$a</p></graph>`;
        const xml = await updateSyntax(source, {
            doNotUpgradeCopyTags: true,
        });
        expect(xml).toContain(`<p>$a[1]</p></graph>`);
        expect(xml).toContain(`<p>$selectFromSequence[1]</p></graph>`);
    });

    it("does not read a copy's own attributes as module parameters", async () => {
        // `numComponents` belongs to v0.6's `<copy>`, so it says nothing about the target.
        source = `<copy uri="doenet:cid=abc" numComponents="2" />`;
        const res = await updateSyntaxFromV06toV07(source, {
            doNotUpgradeCopyTags: true,
        });
        expect(toXml(res.dast)).toEqual(source);
        expect(res.vfile.messages.map((m) => m.ruleId)).toContain(
            "external-copy/unknown-component-type",
        );
    });
});

describe("regressions found by the seventh review", () => {
    let source: string;

    it("keeps two unnamed namespaces apart", async () => {
        // A `<template newNamespace>` has no name, so nothing can reach into it from
        // outside — but it still keeps its contents apart from a sibling's, and a
        // reference written inside one means that one.
        source = `<map name="m1"><template newNamespace><selectFromSequence assignNames="a b" numToSelect="2" from="1" to="5" /><p>$a</p></template><sources alias="v"><sequence from="1" to="2" /></sources></map><map name="m2"><template newNamespace><selectFromSequence assignNames="a b" numToSelect="2" from="1" to="5" /><p>$a</p></template><sources alias="w"><sequence from="1" to="2" /></sources></map>`;
        const res = await updateSyntaxFromV06toV07(source, {
            doNotUpgradeCopyTags: true,
        });
        const xml = toXml(res.dast);
        // Each map's local reference resolves to its own composite.
        expect(xml).toContain(
            `<selectFromSequence name="a" numToSelect="2" from="1" to="5" /><p>$a[1]</p>`,
        );
        expect(xml).toContain(
            `<selectFromSequence name="selectFromSequence" numToSelect="2" from="1" to="5" /><p>$selectFromSequence[1]</p>`,
        );
        // Two namespaces using one name was always legal, so nothing is reported.
        expect(res.vfile.messages.map((m) => m.ruleId)).not.toContain(
            "assign-names/duplicate-name",
        );
    });

    it("finds a self reference nested inside an attribute", async () => {
        source = `<selectFromSequence assignNames="a" from="1" to="9" exclude="$$f($a)" /> $a`;
        const res = await updateSyntaxFromV06toV07(source, {
            doNotUpgradeCopyTags: true,
        });
        expect(res.vfile.messages.map((m) => m.ruleId)).toContain(
            "assign-names/self-reference",
        );
    });
});

describe("regressions found by the eighth review", () => {
    let source: string;

    it("keeps `prop` on a <copy> whose referent cannot be resolved", async () => {
        // The referent type decides what the `<copy>` becomes, so when it cannot be
        // found the tag is left alone and reported. Dropping `prop` on the way past
        // would quietly turn "the x of it" into "all of it".
        source = `<copy source="missing" prop="x" />`;
        const res = await updateSyntaxFromV06toV07(source);
        const xml = toXml(res.dast);
        expect(xml).toContain(`prop="x"`);
        expect(xml).toContain(`<copy`);
        expect(res.vfile.messages.length).toBeGreaterThan(0);
    });

    it("removes `prop` once the referent does resolve", async () => {
        source = `<point name="P">(1,2)</point><copy source="P" prop="x" />`;
        const res = await updateSyntaxFromV06toV07(source);
        const xml = toXml(res.dast);
        expect(xml).not.toContain(`prop=`);
        expect(xml).toContain(`extend="$P.x"`);
    });

    it("does not invent a name for an assignNames that names nothing", async () => {
        // `assignNames="()"` parses successfully but hands out no names, so the
        // `<map>` has nothing to be called.
        source = `<map assignNames="()"><template><p>hi</p></template><sources alias="v"><sequence from="1" to="2" /></sources></map>`;
        const res = await updateSyntaxFromV06toV07(source, {
            doNotUpgradeCopyTags: true,
        });
        const xml = toXml(res.dast);
        expect(xml).not.toContain("name=");
        expect(xml).toContain("<repeatForSequence");
    });

    it("counts a map template's bare text when mapping nested positions", async () => {
        // v0.6 skipped the text when handing `a` out, so `a` was the `<math>`; v0.7
        // counts the text as a replacement, which puts the `<math>` second.
        source = `<map assignNames="(a)"><template>text <math>x</math></template><sources alias="v"><sequence from="1" to="2" /></sources></map> $a`;
        const res = await updateSyntaxFromV06toV07(source, {
            doNotUpgradeCopyTags: true,
        });
        const xml = toXml(res.dast);
        expect(xml).toContain(`$a[1][2]`);
        expect(res.vfile.messages.map((m) => m.ruleId)).toContain(
            "assign-names/primitive-skew",
        );
    });

    it("leaves an all-element map template at the identity mapping", async () => {
        source = `<map assignNames="(a b)"><template><math>x</math><math>y</math></template><sources alias="v"><sequence from="1" to="2" /></sources></map> $a $b`;
        const res = await updateSyntaxFromV06toV07(source, {
            doNotUpgradeCopyTags: true,
        });
        const xml = toXml(res.dast);
        expect(xml).toContain(`$a[1][1] $a[1][2]`);
        expect(res.vfile.messages.map((m) => m.ruleId)).not.toContain(
            "assign-names/primitive-skew",
        );
    });
});

describe("regressions found by the ninth review", () => {
    let source: string;

    it('treats newNamespace="false" as no namespace at all', async () => {
        // v0.6 read `newNamespace` as a primitive boolean, so only a bare attribute or
        // the literal `true` made a namespace. Scoping the inner assignment to a
        // boundary that never existed would stop the outer `$a` from matching it.
        source = `<p newNamespace="false"><selectFromSequence assignNames="a b" numToSelect="2" from="1" to="5" /></p> $a`;
        const res = await updateSyntaxFromV06toV07(source, {
            doNotUpgradeCopyTags: true,
        });
        expect(toXml(res.dast)).toContain(`$a[1]`);
    });

    it("still honours a bare newNamespace", async () => {
        source = `<p newNamespace><selectFromSequence assignNames="a b" numToSelect="2" from="1" to="5" /> $a</p>`;
        const res = await updateSyntaxFromV06toV07(source, {
            doNotUpgradeCopyTags: true,
        });
        expect(toXml(res.dast)).toContain(`$a[1]`);
    });

    it("collapses `..` in a macro nested inside another macro's index", async () => {
        // Converting the outer macro copies the macros in its indices, so collapsing
        // only the outer result left the copy that reaches the tree with its `..`.
        source = `<p a="$list[$(x/../b)]" />`;
        const res = await updateSyntaxFromV06toV07(source, {
            doNotUpgradeCopyTags: true,
        });
        const xml = toXml(res.dast);
        expect(xml).not.toContain("..");
        expect(xml).toEqual(`<p a="$list[$b]" />`);
    });

    it("collapses `..` in a macro nested inside a macro attribute", async () => {
        source = `<p a="$list{fixed=$(x/../b)}" />`;
        const res = await updateSyntaxFromV06toV07(source, {
            doNotUpgradeCopyTags: true,
        });
        expect(toXml(res.dast)).not.toContain("..");
    });

    it("reports each `..` exactly once", async () => {
        source = `<p a="$list[$(x/../b)]" />`;
        const res = await updateSyntaxFromV06toV07(source, {
            doNotUpgradeCopyTags: true,
        });
        expect(
            res.vfile.messages.filter((m) => (m.reason || "").includes("../x")),
        ).toHaveLength(1);
    });

    it("says `link` by choosing between copy and extend", async () => {
        // v0.7 has no `link`: `extend` is always linked and `copy` never is.
        source = `<copy uri="doenet:cid=abc" vmin="-1" link="false" />`;
        const res = await updateSyntaxFromV06toV07(source, {
            doNotUpgradeCopyTags: true,
        });
        const xml = toXml(res.dast);
        expect(xml).toContain(`<module copy="doenet:cid=abc" vmin="-1"`);
        expect(xml).not.toContain(`link=`);
    });

    it('uses extend for link="true"', async () => {
        source = `<copy uri="doenet:cid=abc" vmin="-1" link="true" />`;
        const res = await updateSyntaxFromV06toV07(source, {
            doNotUpgradeCopyTags: true,
        });
        const xml = toXml(res.dast);
        expect(xml).toContain(`<module extend="doenet:cid=abc" vmin="-1"`);
        expect(xml).not.toContain(`link=`);
    });

    it("drops a v0.6 copy control rather than reinterpreting it as a module attribute", async () => {
        source = `<copy uri="doenet:cid=abc" vmin="-1" assignNamesSkip="1" />`;
        const res = await updateSyntaxFromV06toV07(source, {
            doNotUpgradeCopyTags: true,
        });
        const xml = toXml(res.dast);
        expect(xml).toContain(`<module`);
        expect(xml).toContain(`vmin="-1"`);
        expect(xml).not.toContain(`assignNamesSkip`);
        expect(res.vfile.messages.map((m) => m.ruleId)).toContain(
            "external-copy/dropped-copy-controls",
        );
    });

    it("leaves an external copy alone when it narrows what it copies", async () => {
        source = `<copy uri="doenet:cid=abc" vmin="-1" prop="x" />`;
        const res = await updateSyntaxFromV06toV07(source, {
            doNotUpgradeCopyTags: true,
        });
        const xml = toXml(res.dast);
        expect(xml).toContain(`<copy`);
        expect(xml).toContain(`prop="x"`);
        expect(xml).not.toContain(`<module`);
        expect(res.vfile.messages.map((m) => m.ruleId)).toContain(
            "external-copy/narrowed",
        );
    });

    it("copies rather than extends a module, which v0.6 never linked", async () => {
        // v0.6's default for `link` was "linked, unless this copies by cid/uri or the
        // target is a module", so a module copy has to become `copy`, not `extend`.
        source = `<setup><module name="m"><p>hi</p></module></setup><copy source="m" />`;
        const res = await updateSyntaxFromV06toV07(source);
        const xml = toXml(res.dast);
        expect(xml).toContain(`<module copy="$m" />`);
        expect(xml).not.toContain(`extend=`);
    });

    it("extends a non-module referent, which v0.6 did link", async () => {
        source = `<point name="P">(1,2)</point><copy source="P" />`;
        const res = await updateSyntaxFromV06toV07(source);
        expect(toXml(res.dast)).toContain(`<point extend="$P" />`);
    });

    it("copies rather than extends a module reached through copySource", async () => {
        source = `<setup><module name="m"><p>hi</p></module></setup><module copySource="m" />`;
        const res = await updateSyntaxFromV06toV07(source, {
            doNotUpgradeCopyTags: true,
        });
        const xml = toXml(res.dast);
        expect(xml).toContain(`<module copy="$m" />`);
        expect(xml).not.toContain(`extend=`);
    });

    it("still converts an ordinary parameterized external copy", async () => {
        source = `<copy uri="doenet:cid=abc" vmin="-1" assignNames="a" />`;
        const res = await updateSyntaxFromV06toV07(source, {
            doNotUpgradeCopyTags: true,
        });
        const xml = toXml(res.dast);
        expect(xml).toContain(
            `<module copy="doenet:cid=abc" vmin="-1" name="a"`,
        );
        expect(res.vfile.messages.map((m) => m.ruleId)).not.toContain(
            "external-copy/dropped-copy-controls",
        );
    });
});

describe("regressions found by the tenth review", () => {
    let source: string;

    it("does not let copySource and a composite both take one name", async () => {
        // The `copySource` path promoted its assigned name to `name` without claiming
        // it, so a later `assignNames` took the same one and v0.7 saw two components
        // called `a`.
        source = `<math name="m">x</math><math copySource="m" assignNames="a" /><selectFromSequence assignNames="a" from="1" to="5" /> $a`;
        const res = await updateSyntaxFromV06toV07(source, {
            doNotUpgradeCopyTags: true,
        });
        const xml = toXml(res.dast);
        expect(xml.match(/name="a"/g) ?? []).toHaveLength(1);
    });

    it("points a reference at the copySource element that took its name", async () => {
        source = `<math name="m">x</math><math copySource="m" assignNames="a" /> $a`;
        const res = await updateSyntaxFromV06toV07(source, {
            doNotUpgradeCopyTags: true,
        });
        const xml = toXml(res.dast);
        expect(xml).toContain(`<math extend="$m" name="a" />`);
        expect(xml).toContain(`$a`);
    });

    it("keeps an assigned name that collides only in another namespace", async () => {
        // v0.6 resolved `$a` inside `g2` to `g2`'s own `a` — the copy — and only
        // outside it to the point. A whole-document collision check gave the copy a
        // generated name but registered nothing, stranding the inner reference.
        source = `<group name="g1"><point name="a">(1,2)</point></group><group name="g2" newNamespace><copy source="../g1" assignNames="a" /> $a</group>`;
        const res = await updateSyntaxFromV06toV07(source, {
            doNotUpgradeCopyTags: true,
        });
        const xml = toXml(res.dast);
        // The point keeps the bare name, the copy takes a generated one, and the
        // reference inside g2 follows the copy rather than the point.
        expect(xml).toContain(`<point name="a">(1,2)</point>`);
        expect(xml).toContain(
            `<group name="g2"><copy source="g1" name="copy" /> $copy</group>`,
        );
        expect(res.vfile.messages.map((m) => m.ruleId)).not.toContain(
            "copy/name-already-taken",
        );
    });

    it("does not point a copy's own source at the copy", async () => {
        // `source` says what is copied and `assignNames` names the result, so the two
        // are different components even when they are spelled the same. Redirecting
        // the source would make the copy copy itself.
        source = `<math name="x0">-5</math><exercise name="ex" newNamespace><copy source="../x0" assignNames="x0" /><p>$x0</p></exercise>`;
        const res = await updateSyntaxFromV06toV07(source, {
            doNotUpgradeCopyTags: true,
        });
        expect(toXml(res.dast)).toContain(
            `<copy source="x0" name="copy" /><p>$copy</p>`,
        );
    });

    it("still refuses a name held by a component in the same namespace", async () => {
        source = `<point name="a">(1,2)</point><copy source="a" assignNames="a" /> $a`;
        const res = await updateSyntaxFromV06toV07(source, {
            doNotUpgradeCopyTags: true,
        });
        expect(res.vfile.messages.map((m) => m.ruleId)).toContain(
            "copy/name-already-taken",
        );
    });
});
