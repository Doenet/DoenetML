import { describe, expect, it } from "vitest";
import { lezerToDast, lezerToDastV6 } from "../src/lezer-to-dast";
import { toXml } from "../src/dast-to-xml/dast-util-to-xml";
import util from "util";
import { DastRoot } from "../src/types";
import { updateSyntaxFromV06toV07 } from "../src/v06-to-v07";
import { reparseAttribute } from "../src/v06-to-v07/reparse-attribute";

const origLog = console.log;
console.log = (...args) => {
    try {
        origLog(...args.map((x) => util.inspect(x, false, 10, true)));
    } catch {
        origLog(...args);
    }
};

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

        expect(toXml(await updateSyntaxFromV06toV07(source))).toEqual(
            correctSource,
        );

        // Make sure if there are already dollar signs, they are not added again
        expect(toXml(await updateSyntaxFromV06toV07(correctSource))).toEqual(
            correctSource,
        );
    });

    it("removes newNamespace attribute", async () => {
        source = `<graph name="g" newNamespace><point name="p" /></graph>`;
        correctSource = `<graph name="g"><point name="p" /></graph>`;
        expect(toXml(await updateSyntaxFromV06toV07(source))).toEqual(
            correctSource,
        );
    });

    it("macro path slashes get turned into dots", async () => {
        source = `$(foo/bar[3][4][$(b/c).d].baz)`;
        correctSource = `$foo.bar[3][4][$b.c.d].baz`;
        expect(toXml(await updateSyntaxFromV06toV07(source))).toEqual(
            correctSource,
        );
    });

    it("macro path slashes get turned into dots in attributes", async () => {
        source = `<p foo="$(foo/bar[3][4][$(b/c).d].baz)" />`;
        correctSource = `<p foo="$foo.bar[3][4][$b.c.d].baz" />`;
        expect(
            toXml(
                await updateSyntaxFromV06toV07(source, {
                    doNotUpgradeAttributeSyntax: true,
                    doNotUpgradeCopyTags: true,
                }),
            ),
        ).toEqual(correctSource);
    });

    it("attributes aren't lost when turning slashes get turned into dots", async () => {
        source = `$foo.bar{baz="abc"}`;
        correctSource = `$foo.bar{baz="abc"}`;
        expect(
            toXml(
                await updateSyntaxFromV06toV07(source, {
                    doNotUpgradeCopyTags: true,
                    doNotUpgradeAttributeSyntax: true,
                }),
            ),
        ).toEqual(correctSource);
    });

    it("corrects capitalization in element names", async () => {
        source = `<pOiNt />`;
        correctSource = `<point />`;
        expect(toXml(await updateSyntaxFromV06toV07(source))).toEqual(
            correctSource,
        );
    });

    it("copySource gets converted to extend or copy", async () => {
        source = `<point copySource="P" name="P2" />`;
        correctSource = `<point extend="$P" name="P2" />`;
        expect(toXml(await updateSyntaxFromV06toV07(source))).toEqual(
            correctSource,
        );

        source = `<point CopySource="P" name="P2" />`;
        correctSource = `<point extend="$P" name="P2" />`;
        expect(toXml(await updateSyntaxFromV06toV07(source))).toEqual(
            correctSource,
        );

        source = `<point copySource="P" name="P2" link="true" />`;
        correctSource = `<point extend="$P" name="P2" />`;
        expect(toXml(await updateSyntaxFromV06toV07(source))).toEqual(
            correctSource,
        );

        source = `<point copySource="P" name="P2" link="false" />`;
        correctSource = `<point copy="$P" name="P2" />`;
        expect(toXml(await updateSyntaxFromV06toV07(source))).toEqual(
            correctSource,
        );
    });

    it("copySource gets converted in the presence of assignNames", async () => {
        source = `<math copySource="P.x" assignNames="x" />`;
        correctSource = `<math extend="$P.x" name="x" />`;
        expect(toXml(await updateSyntaxFromV06toV07(source))).toEqual(
            correctSource,
        );

        source = `<math copySource="P" copyProp="x" assignNames="x" />`;
        correctSource = `<math extend="$P.x" name="x" />`;
        expect(toXml(await updateSyntaxFromV06toV07(source))).toEqual(
            correctSource,
        );
    });

    it("collect gets converted to its new format", async () => {
        source = `<collect componentTypes="point" name="points" source="panel" assignNames="q1 q2 q3 q4 q5" />`;
        correctSource = `<collect componentType="point" name="points" from="$panel" />`;
        expect(toXml(await updateSyntaxFromV06toV07(source))).toEqual(
            correctSource,
        );

        // References to the old `assignNames` get updated
        source = `<collect componentTypes="point" name="points" source="panel" assignNames="q1 q2 q3 q4 q5" /> $q1 $q4`;
        correctSource = `<collect componentType="point" name="points" from="$panel" /> $points[1] $points[4]`;
        expect(toXml(await updateSyntaxFromV06toV07(source))).toEqual(
            correctSource,
        );

        // References to the old `assignNames` get updated
        source = `<p name="p"><collect componentTypes="point" name="points" source="panel" assignNames="q1 q2 q3 q4 q5" /></p> $p.q1 $q4`;
        correctSource = `<p name="p"><collect componentType="point" name="points" from="$panel" /></p> $p.points[1] $points[4]`;
        expect(toXml(await updateSyntaxFromV06toV07(source))).toEqual(
            correctSource,
        );
    });

    it("can resolve the referent of a copy tag", async () => {
        source = `<math name="m">5</math><copy source="m" name="k" />$k`;
        correctSource = `<math name="m">5</math><math extend="$m" name="k" />$k`;
        expect(toXml(await updateSyntaxFromV06toV07(source))).toEqual(
            correctSource,
        );
    });

    it("can resolve the referent of a copy tag (advanced)", async () => {
        source = `<point name="m" /><copy source="m.x" name="k" />$k`;
        correctSource = `<point name="m" /><math extend="$m.x" name="k" />$k`;
        expect(toXml(await updateSyntaxFromV06toV07(source))).toEqual(
            correctSource,
        );

        source = `<polygon name="m" /><copy source="m.vertices[0]" name="k" />$k`;
        correctSource = `<polygon name="m" /><point extend="$m.vertices[0]" name="k" />$k`;
        expect(toXml(await updateSyntaxFromV06toV07(source))).toEqual(
            correctSource,
        );
    });

    it("can convert macros with attributes into copy tags", async () => {
        source = `$x{foo="bar"}`;
        correctSource = `<copy foo="bar" source="$x" />`;
        expect(
            toXml(
                await updateSyntaxFromV06toV07(source, {
                    doNotUpgradeCopyTags: true,
                }),
            ),
        ).toEqual(correctSource);

        source = `$x[2].y{foo="bar"}`;
        correctSource = `<copy foo="bar" source="$x[2].y" />`;
        expect(
            toXml(
                await updateSyntaxFromV06toV07(source, {
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
                await updateSyntaxFromV06toV07(source, {
                    doNotUpgradeCopyTags: true,
                }),
            ),
        ).toEqual(correctSource);

        source = `<point x="$x.y{foo='bar'}" />`;
        correctSource = `<setup><copy source="$x.y" foo="bar" name="ref1" /></setup><point x="$ref1" />`;
        expect(
            toXml(
                await updateSyntaxFromV06toV07(source, {
                    doNotUpgradeCopyTags: true,
                }),
            ),
        ).toEqual(correctSource);
    });

    it("can convert macros with attributes that are in attributes into copy tags (realistic examples)", async () => {
        source = `<math name="a">5</math><point x="$a{foo='bar'}" />`;
        correctSource = `<setup><math extend="$a" foo="bar" name="ref1" /></setup><math name="a">5</math><point x="$ref1" />`;
        expect(toXml(await updateSyntaxFromV06toV07(source))).toEqual(
            correctSource,
        );
    });

    it("can reparse attributes", async () => {
        expect(toXml(reparseAttribute("t"))).toEqual("t");
        expect(toXml(reparseAttribute("$t"))).toEqual("$t");
    });
});
