import { describe, expect, it } from "vitest";
import { getPrefigureXML, getWarnings } from "./graph-prefigure.helpers";
import {
    prefigureGraph,
    withStyleDefinitions,
} from "./graph-prefigure.fixtures";

/** The `<label>` elements in a PreFigure document, in order. */
function labels(prefigureXML: string): string[] {
    return prefigureXML.match(/<label [^>]*>.*?<\/label>/g) ?? [];
}

describe("Graph prefigure renderer text @group4", () => {
    it("draws each text-like child as a label at its anchor", async () => {
        const prefigureXML = await getPrefigureXML(
            prefigureGraph(`
  <text anchor="(1,2)">hello</text>
  <number anchor="(3,4)">5</number>
  <math anchor="(-1,-2)">x^2</math>
  <m anchor="(-3,-4)">\\alpha</m>
  <label anchor="(5,6)">L <m>y</m></label>`),
        );

        expect(labels(prefigureXML)).toEqual([
            '<label at="text_0" anchor="(1,2)" alignment="c" color="currentColor">hello</label>',
            '<label at="number_1" anchor="(3,4)" alignment="c" color="currentColor">5</label>',
            '<label at="math_2" anchor="(-1,-2)" alignment="c" color="currentColor"><m>x^{2}</m></label>',
            '<label at="m_3" anchor="(-3,-4)" alignment="c" color="currentColor"><m>\\alpha</m></label>',
            '<label at="label_4" anchor="(5,6)" alignment="c" color="currentColor">L <m>y</m></label>',
        ]);
    });

    it("draws an md as aligned rows, without the align environment's \\notag", async () => {
        const prefigureXML = await getPrefigureXML(
            prefigureGraph(
                '<md anchor="(1,1)"><mrow>a &amp;= b</mrow><mrow>c &amp;= d</mrow></md>',
            ),
        );

        expect(labels(prefigureXML)).toEqual([
            '<label at="md_0" anchor="(1,1)" alignment="c" color="currentColor"><m>\\begin{aligned}a &amp; = b\\\\c &amp; = d\\end{aligned}</m></label>',
        ]);
    });

    it("draws a numbered md row without its \\tag, which aligned does not allow", async () => {
        const prefigureXML = await getPrefigureXML(
            prefigureGraph(
                '<md anchor="(1,1)"><mrow number>a = b</mrow><mrow>c = d</mrow></md>',
            ),
        );

        expect(labels(prefigureXML)).toEqual([
            '<label at="md_0" anchor="(1,1)" alignment="c" color="currentColor"><m>\\begin{aligned}a = b\\\\c = d\\end{aligned}</m></label>',
        ]);
    });

    it("draws components that inherit from a text-like type as that type", async () => {
        const prefigureXML = await getPrefigureXML(`
<function name="f">x^2</function>
${prefigureGraph(`
  <integer anchor="(1,1)">3</integer>
  <mdn anchor="(2,2)"><mrow>a = b</mrow></mdn>
  <me anchor="(3,3)">y</me>
  <evaluate anchor="(4,4)" function="$f" input="2" />`)}`);

        expect(labels(prefigureXML)).toEqual([
            '<label at="integer_0" anchor="(1,1)" alignment="c" color="currentColor">3</label>',
            '<label at="mdn_1" anchor="(2,2)" alignment="c" color="currentColor"><m>\\begin{aligned}a = b\\end{aligned}</m></label>',
            '<label at="me_2" anchor="(3,3)" alignment="c" color="currentColor"><m>y</m></label>',
            '<label at="evaluate_3" anchor="(4,4)" alignment="c" color="currentColor"><m>4</m></label>',
        ]);
    });

    it("skips a component that inherits from math but has no renderer", async () => {
        const prefigureXML = await getPrefigureXML(
            prefigureGraph(`
  <periodicSet offsets="1" period="2" />
  <text anchor="(1,1)">shown</text>`),
        );

        expect(labels(prefigureXML)).toEqual([
            '<label at="text_0" anchor="(1,1)" alignment="c" color="currentColor">shown</label>',
        ]);
    });

    it("lets an annotation refer to a drawn text", async () => {
        const prefigureXML = await getPrefigureXML(
            prefigureGraph(`
  <text name="t" anchor="(1,1)">hi</text>
  <annotations><annotation ref="$t" text="a text" /></annotations>`),
        );

        expect(prefigureXML).toContain(
            '<annotation ref="text_0" text="a text"></annotation>',
        );
    });

    it("maps positionFromAnchor to alignment", async () => {
        const positions: [string, string][] = [
            ["upperRight", "ne"],
            ["upperLeft", "nw"],
            ["lowerRight", "se"],
            ["lowerLeft", "sw"],
            ["top", "n"],
            ["bottom", "s"],
            ["left", "w"],
            ["right", "e"],
            ["center", "c"],
        ];

        const prefigureXML = await getPrefigureXML(
            prefigureGraph(
                positions
                    .map(
                        ([position], i) =>
                            `<text anchor="(${i},0)" positionFromAnchor="${position}">T${i}</text>`,
                    )
                    .join("\n"),
            ),
        );

        const alignments = labels(prefigureXML).map(
            (label) => label.match(/alignment="([^"]*)"/)?.[1],
        );
        expect(alignments).toEqual(positions.map(([, alignment]) => alignment));
    });

    it("escapes text content", async () => {
        const prefigureXML = await getPrefigureXML(
            prefigureGraph('<text anchor="(0,0)">a &lt; b &amp; c</text>'),
        );

        expect(prefigureXML).toContain(">a &lt; b &amp; c</label>");
    });

    it("skips hidden and empty texts without a warning", async () => {
        const doenetML = prefigureGraph(`
  <text anchor="(1,1)" hide>hidden</text>
  <text anchor="(2,2)"></text>
  <text anchor="(4,4)">shown</text>`);

        const prefigureXML = await getPrefigureXML(doenetML);
        const drawn = labels(prefigureXML);
        expect(drawn).toHaveLength(1);
        expect(drawn[0]).toMatch(/anchor="\(4,4\)"[^>]*>shown<\/label>$/);

        const { warnings } = await getWarnings(doenetML);
        expect(warnings).toEqual([]);
    });

    it("draws a point's label once, as part of the point", async () => {
        const prefigureXML = await getPrefigureXML(
            prefigureGraph(`
  <shortDescription>A labeled point</shortDescription>
  <point>(1,2)<label>P</label></point>`),
        );

        expect(labels(prefigureXML)).toEqual([]);
        expect(prefigureXML).toContain(">P</point>");
        expect(prefigureXML).not.toContain("A labeled point");
    });

    it("draws text from a repeat, a reference, and a nested graph", async () => {
        const prefigureXML = await getPrefigureXML(`
<text name="outside">copied</text>
${prefigureGraph(`
  <repeatForSequence from="1" to="2" valueName="i">
    <text anchor="($i,-5)">R$i</text>
  </repeatForSequence>
  $outside
  <graph><text anchor="(-3,3)">nested</text></graph>`)}`);

        const contents = labels(prefigureXML).map(
            (label) => label.match(/>([^<]*)<\/label>/)?.[1],
        );
        expect(contents.sort()).toEqual(["R1", "R2", "copied", "nested"]);
        expect(prefigureXML).toContain('anchor="(1,-5)"');
        expect(prefigureXML).toContain('anchor="(-3,3)"');
    });

    it("places a text whose anchor does not evaluate at the origin", async () => {
        const prefigureXML = await getPrefigureXML(
            prefigureGraph('<text anchor="(a,2)">T</text>'),
        );

        expect(prefigureXML).toContain('anchor="(0,2)"');
    });

    it("keeps an author's text color, and its dark-mode variant", async () => {
        const doenetML = withStyleDefinitions(
            '    <styleDefinition styleNumber="5" textColor="red" textColorDarkMode="pink" />',
            prefigureGraph(`
  <text anchor="(1,1)" styleNumber="5">red</text>
  <text anchor="(2,2)">default</text>`),
        );

        const light = labels(await getPrefigureXML(doenetML));
        expect(light[0]).toContain('color="red"');
        expect(light[1]).toContain('color="currentColor"');

        const dark = labels(
            await getPrefigureXML(doenetML, "g", { theme: "dark" }),
        );
        expect(dark[0]).toContain('color="pink"');
        expect(dark[1]).toContain('color="currentColor"');
    });
});
