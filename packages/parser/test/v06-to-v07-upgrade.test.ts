import { describe, expect, it } from "vitest";
import { lezerToDast } from "../src/lezer-to-dast";
import { toXml } from "../src/dast-to-xml/dast-util-to-xml";
import util from "util";
import { DastRoot } from "../src/types";
import { updateSyntaxFromV06toV07 } from "../src/v06-to-v07";
import { reparseAttribute } from "../src/v06-to-v07/reparse-attribute";

const origLog = console.log;
console.log = (...args) => {
    origLog(...args.map((x) => util.inspect(x, false, 10, true)));
};

describe("v06 to v07 update", () => {
    let source: string;
    let correctSource: string;
    let parsed: DastRoot;

    it("ensures $ before `target`, `triggerWith`, etc.", () => {
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
        parsed = lezerToDast(source);

        expect(toXml(updateSyntaxFromV06toV07(parsed))).toEqual(correctSource);

        // Make sure if there are already dollar signs, they are not added again
        expect(
            toXml(updateSyntaxFromV06toV07(lezerToDast(correctSource))),
        ).toEqual(correctSource);
    });

    it("removes newNamespace attribute", () => {
        source = `<graph name="g" newNamespace><point name="p" /></graph>`;
        correctSource = `<graph name="g"><point name="p" /></graph>`;
        expect(toXml(updateSyntaxFromV06toV07(lezerToDast(source)))).toEqual(
            correctSource,
        );
    });

    it("corrects capitalization in element names", () => {
        source = `<pOiNt />`;
        correctSource = `<point />`;
        expect(toXml(updateSyntaxFromV06toV07(lezerToDast(source)))).toEqual(
            correctSource,
        );
    });

    it("copySource gets converted to extend or copy", () => {
        source = `<point copySource="P" name="P2" />`;
        correctSource = `<point extend="$P" name="P2" />`;
        expect(toXml(updateSyntaxFromV06toV07(lezerToDast(source)))).toEqual(
            correctSource,
        );

        source = `<point CopySource="P" name="P2" />`;
        correctSource = `<point extend="$P" name="P2" />`;
        expect(toXml(updateSyntaxFromV06toV07(lezerToDast(source)))).toEqual(
            correctSource,
        );

        source = `<point copySource="P" name="P2" link="true" />`;
        correctSource = `<point extend="$P" name="P2" />`;
        expect(toXml(updateSyntaxFromV06toV07(lezerToDast(source)))).toEqual(
            correctSource,
        );

        source = `<point copySource="P" name="P2" link="false" />`;
        correctSource = `<point copy="$P" name="P2" />`;
        expect(toXml(updateSyntaxFromV06toV07(lezerToDast(source)))).toEqual(
            correctSource,
        );
    });

    it("copySource gets converted in the presence of assignNames", () => {
        source = `<math copySource="P.x" assignNames="x" />`;
        correctSource = `<math extend="$P.x" name="x" />`;
        expect(toXml(updateSyntaxFromV06toV07(lezerToDast(source)))).toEqual(
            correctSource,
        );

        source = `<math copySource="P" copyProp="x" assignNames="x" />`;
        correctSource = `<math extend="$P.x" name="x" />`;
        expect(toXml(updateSyntaxFromV06toV07(lezerToDast(source)))).toEqual(
            correctSource,
        );
    });

    it("collect gets converted to its new format", () => {
        source = `<collect componentTypes="point" name="points" source="panel" assignNames="q1 q2 q3 q4 q5" />`;
        correctSource = `<collect componentType="point" name="points" from="$panel" />`;
        expect(toXml(updateSyntaxFromV06toV07(lezerToDast(source)))).toEqual(
            correctSource,
        );

        // References to the old `assignNames` get updated
        source = `<collect componentTypes="point" name="points" source="panel" assignNames="q1 q2 q3 q4 q5" /> $q1 $q4`;
        correctSource = `<collect componentType="point" name="points" from="$panel" /> $points[1] $points[4]`;
        expect(toXml(updateSyntaxFromV06toV07(lezerToDast(source)))).toEqual(
            correctSource,
        );

        // References to the old `assignNames` get updated
        source = `<p name="p"><collect componentTypes="point" name="points" source="panel" assignNames="q1 q2 q3 q4 q5" /></p> $p.q1 $q4`;
        correctSource = `<p name="p"><collect componentType="point" name="points" from="$panel" /></p> $p.points[1] $points[4]`;
        expect(toXml(updateSyntaxFromV06toV07(lezerToDast(source)))).toEqual(
            correctSource,
        );
    });

    it("can reparse attributes", () => {
        expect(toXml(reparseAttribute("t"))).toEqual("t");
        expect(toXml(reparseAttribute("$t"))).toEqual("$t");
    });
});
