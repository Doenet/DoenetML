import { describe, expect, it, afterAll, beforeAll } from "vitest";
import util from "util";
import { toXml as xastToXml } from "xast-util-to-xml";
import { FlatDastRoot } from "@doenet/doenetml-worker";
import { renderFlatDastToPretext } from "../src/utils/pretext/render-to-pretext";
import { RunThroughCore } from "./utils/run-through-core";

const origLog = console.log;
console.log = (...args) => {
    origLog(...args.map((x) => util.inspect(x, false, 10, true)));
};

let coreRunner: RunThroughCore;

function renderToPretextString(flatDast: FlatDastRoot) {
    return xastToXml(renderFlatDastToPretext(flatDast), {
        closeEmptyElements: true,
    });
}

afterAll(async () => {
    await coreRunner.close();
});

beforeAll(async () => {
    // Infrequently, the browser download can fail due to transient network issues.
    // To mitigate this, we implement a retry mechanism with exponential backoff.

    const maxRetries = 3;
    const initialDelay = 1000; // 1 second
    let lastError: Error | undefined;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            coreRunner = new RunThroughCore();
            await coreRunner.processToFlatDast(`<p>Hi</p>`);

            // Success - exit retry loop
            break;
        } catch (e) {
            await coreRunner.close(); // Ensure any partially initialized browser is closed before retrying

            // If this is not the last attempt, wait before retrying
            if (attempt < maxRetries) {
                const delay = initialDelay * Math.pow(2, attempt);
                console.warn(
                    `Failed to download browser (attempt ${attempt + 1}/${maxRetries + 1}): ${e}`,
                );
                await new Promise((resolve) => setTimeout(resolve, delay));
            } else {
                // Last attempt failed - throw the error
                throw e;
            }
        }
    }
}, 40000);

describe("Pretext export", async () => {
    let source: string;

    it("Can process doenet code run through core", async () => {
        source = `<p>hello world</p>`;
        const res = await coreRunner.processToFlatDast(source);
    }, 40000);
    it("Wraps root in <pretext> tag", async () => {
        source = `<p>Hi</p>`;
        expect(await coreRunner.processToFlatDast(source))
            .toMatchInlineSnapshot(`
          "<?xml version="1.0" encoding="UTF-8"?>
          <pretext>
          <article>
          <p>Hi</p>
          </article>
          </pretext>"
        `);
    });

    it("adds xml:id to reffable element and xref points to it", async () => {
        source = `
           <section name="foo">
               <title>Named section</title>
               <p>Section text</p>
           </section>
           <p>Jump to <ref to="$foo" /></p>
       `;

        // The important part is that the xref and the section share the same xml:id and ref attribute.
        expect(await coreRunner.processToFlatDast(source))
            .toMatchInlineSnapshot(`
          "<?xml version="1.0" encoding="UTF-8"?>
          <pretext>
          <article>
          <section xml:id="doenet-id-1">
              <title>Named section</title>
                         
                         <p>Section text</p>
                     </section>
                     <p>Jump to <xref ref="doenet-id-1"></xref></p>
          </article>
          </pretext>"
        `);
    });

    // <br /> and <hr /> are removed when converting to PreTeXt
    it("<br /> and <hr /> are removed when converting to PreTeXt", async () => {
        source = `<p>Line 1<br />Line 2</p><hr /><p>After hr</p>`;
        expect(
            await coreRunner.processToFlatDastAsFragment(source),
        ).toMatchInlineSnapshot(`"<p>Line 1Line 2</p><p>After hr</p>"`);
    });

    it("source of an <m> gets rendered", async () => {
        source = `<p>Here is some math: <m>\\frac{1}{2}</m></p>`;
        expect(
            await coreRunner.processToFlatDastAsFragment(source),
        ).toMatchInlineSnapshot(
            `"<p>Here is some math: <m>\\frac{1}{2}</m></p>"`,
        );
    });

    it("renders mathInput nested inside answer", async () => {
        source = `<answer><mathInput /><mathInput /></answer>`;
        expect(await coreRunner.processToFlatDastAsFragment(source)).toContain(
            `<m><fillin characters="8"></fillin></m>`,
        );
    });

    it("mathInput renders its label", async () => {
        source = `<answer><mathInput><label>My Label</label></mathInput></answer>`;
        expect(await coreRunner.processToFlatDastAsFragment(source)).toContain(
            `My Label <m><fillin characters="8"></fillin></m>`,
        );
    });

    it("mathInput renders a label containing math", async () => {
        source = `<answer><mathInput><label>x <m>y^2</m><m>z</m></label></mathInput></answer>`;
        expect(await coreRunner.processToFlatDastAsFragment(source)).toContain(
            `x <m>y^2</m><m>z</m> <m><fillin characters="8"></fillin></m>`,
        );
    });

    // <sideBySide> and <blockQuote> get rendered in lower case
    it("<sideBySide> and <blockQuote> are rendered in lower case", async () => {
        source = `<sideBySide><blockQuote>Quote text</blockQuote></sideBySide>`;
        expect(
            await coreRunner.processToFlatDastAsFragment(source),
        ).toMatchInlineSnapshot(
            `"<sidebyside><blockquote>Quote text</blockquote></sidebyside>"`,
        );
    });
    it("<codeEditor> is rendered as <program>", async () => {
        source = `<codeEditor><p>Some code</p></codeEditor>`;
        expect(await coreRunner.processToFlatDastAsFragment(source))
            .toMatchInlineSnapshot(`
              "<program language="xml">&#x3C;p>Some code&#x3C;/p>
              </program>"
            `);
    });

    it("<subsetOfReals> is rendered as <m>", async () => {
        source = `<subsetOfReals>(1,2)</subsetOfReals>`;
        expect(
            await coreRunner.processToFlatDastAsFragment(source),
        ).toMatchInlineSnapshot(`"<m>\\left( 1, 2 \\right)</m>"`);
    });

    it("<orbitalDiagram> is rendered as <tabular>", async () => {
        source = `<orbitalDiagram labels="a b">(u, d, e, d) (e)</orbitalDiagram>`;
        expect(
            await coreRunner.processToFlatDastAsFragment(source),
        ).toMatchInlineSnapshot(
            `"<tabular><row><cell>b</cell><cell></cell></row><row><cell>a</cell><cell>↑</cell><cell>↓</cell><cell></cell><cell>↓</cell></row></tabular>"`,
        );
    });

    it("<angle> is rendered as <m>", async () => {
        source = `<angle>30</angle>`;
        expect(
            await coreRunner.processToFlatDastAsFragment(source),
        ).toMatchInlineSnapshot(`"<m>30</m>"`);
    });

    it("<number> is rendered", async () => {
        source = `<number>42</number>`;
        expect(
            await coreRunner.processToFlatDastAsFragment(source),
        ).toMatchInlineSnapshot(`"42"`);
    });

    it("<atom> is rendered as <m>", async () => {
        source = `<atom symbol="Na" />`;
        expect(
            await coreRunner.processToFlatDastAsFragment(source),
        ).toMatchInlineSnapshot(`"<m>\\text{Na}</m>"`);
    });

    it("inline select-multiple choiceInput renders multiple selected choices", async () => {
        source = `<text hide name="selectedChoices">Apple, Pear</text><choiceInput inline selectMultiple bindValueTo="$selectedChoices"><choice>Apple</choice><choice>Banana</choice><choice>Pear</choice></choiceInput>`;
        expect(
            await coreRunner.processToFlatDastAsFragment(source),
        ).toMatchInlineSnapshot(`" Apple, Pear"`);
    });

    it("asList renders setup number values as comma-separated text", async () => {
        source = `<setup>
  <number name="a">2</number>
  <number name="b">3</number>
  <number name="c">5</number>
</setup>
<p>The first three primes are: <asList>$a $b $c</asList>.</p>`;
        expect(await coreRunner.processToFlatDastAsFragment(source))
            .toMatchInlineSnapshot(`
          "
          <p>The first three primes are: 2, 3, 5.</p>"
        `);
    });

    it("spreadsheet renders at tabular", async () => {
        source = `<spreadsheet minNumRows="5" minNumColumns="5" hiddenRows="1 2" hiddenColumns="2">
  <cellBlock rowNum="2" colNum="B">
    <row>
      <cell>x</cell>
      <cell>y</cell>
    </row>
    <row>
      <cell>1</cell>
      <cell>2</cell>
    </row>
    <row>
      <cell>3</cell>
      <cell>4</cell>
    </row>
  </cellBlock>
</spreadsheet>`;
        expect(await coreRunner.processToFlatDastAsFragment(source))
            .toMatchInlineSnapshot(`
          "<tabular><row header="yes" bottom="minor"><cell right="minor"><em></em></cell><cell right="minor">A</cell><cell right="minor">C</cell><cell right="minor">D</cell><cell right="minor">E</cell></row><row bottom="minor"><cell right="minor"><em>3</em></cell><cell right="minor"></cell><cell right="minor">2</cell><cell right="minor"></cell><cell right="minor"></cell></row><row bottom="minor"><cell right="minor"><em>4</em></cell><cell right="minor"></cell><cell right="minor">4</cell><cell right="minor"></cell><cell right="minor"></cell></row><row bottom="minor"><cell right="minor"><em>5</em></cell><cell right="minor"></cell><cell right="minor"></cell><cell right="minor"></cell><cell right="minor"></cell></row></tabular>"
        `);
    });

    // TODO: un-skip when direct <md> conversion behavior is finalized
    it.skip("<md> is rendered as numbered display math", async () => {
        source = `<md><mrow>\\frac{1}{2}</mrow></md>`;
        expect(await coreRunner.processToFlatDastAsFragment(source))
            .toMatchInlineSnapshot(`
                    "<?xml version="1.0" encoding="UTF-8"?>
                    <pretext>
                    <article>
                    <md number="yes"><mrow>\\frac{1}{2}</mrow></md>
                    </article>
                    </pretext>"
                `);
    });

    // TODO: un-skip when <division> tags are supported
    it.skip("expands <division> to pretext element", async () => {
        source = `
           <division>
               <title>Foo</title>
               <p>How about foo?</p>
           </division>
       `;
        expect(await coreRunner.processToFlatDast(source))
            .toMatchInlineSnapshot(`
          "<?xml version="1.0" encoding="UTF-8"?>
          <pretext>
          <article>
          <section xml:id="doenet-id-1">
              <title>Foo</title>
                         
                      <p>How about foo?</p>
                  </section>
          </article>
          </pretext>"
        `);
    });

    // Unknown tags are not supported right now
    // it("passes through unknown elements", async () => {
    //     source = `
    //        <myCustomTag withAttr="foo">Hi</myCustomTag>
    //    `;
    //     expect(await coreRunner.processToFlatDast(source))
    //         .toMatchInlineSnapshot(`
    //       "<?xml version="1.0" encoding="UTF-8"?>
    //       <pretext>
    //       <article>
    //       <myCustomTag withAttr="foo">Hi</myCustomTag>
    //       </article>
    //       </pretext>"
    //     `);
    // });

    // Unknown tags are not supported right now
    // it("passes through attributes that conflict with special React prop names", async () => {
    //     source = `
    //        <myCustomTag ref="foo"><p ref="hi" />Hi</myCustomTag>
    //    `;
    //     expect(await coreRunner.processToFlatDast(source))
    //         .toMatchInlineSnapshot(`
    //       "<?xml version="1.0" encoding="UTF-8"?>
    //       <pretext>
    //       <article>
    //       <myCustomTag ref="foo"><p ref="hi" />Hi</myCustomTag>
    //       </article>
    //       </pretext>"
    //     `);
    // });

    // TODO: un-skip when <pretext> and <book> tags are supported
    it.skip("preserved existing <book> or <article> or <pretext> tags", async () => {
        source = `
           <book>Hi</book>
       `;
        expect(await coreRunner.processToFlatDastAsFragment(source))
            .toMatchInlineSnapshot(`
          "<?xml version="1.0" encoding="UTF-8"?>
          <pretext>
          <book>
          Hi
          </book>
          </pretext>"
        `);
    });

    // TODO: un-skip when <pretext> and <book> tags are supported
    it.skip("preserved existing <book> or <article> or <pretext> tags 2", async () => {
        source = `
           <pretext>   <book>Hi</book> Z </pretext>
       `;
        expect(await coreRunner.processToFlatDastAsFragment(source))
            .toMatchInlineSnapshot(`
          "<?xml version="1.0" encoding="UTF-8"?>
          <pretext>
             <book>
          Hi
          </book> Z 
          </pretext>"
        `);
    });

    // it("<docinfo> is not included in the auto-inserted division", async () => {
    //     source = `
    //        <docinfo>Hi</docinfo> <section>Foo</section>
    //    `;
    //     expect(await coreRunner.processToFlatDast(source)).toMatchInlineSnapshot(`
    //       "<?xml version="1.0" encoding="UTF-8"?>
    //       <pretext>
    //       <docinfo>Hi</docinfo><article>
    //        <section xml:id="doenet-id-2">Foo</section>
    //       </article>
    //       </pretext>"
    //     `);
    // });

    // TODO: un-skip when <pretext> and <article> tags are supported
    it.skip("name attribute is removed but pretext:name is not", async () => {
        source = `
           <pretext><article><p name="foo">hi</p><p pretext:name="foo">there</p></article></pretext>
       `;
        expect(await coreRunner.processToFlatDastAsFragment(source))
            .toMatchInlineSnapshot(`
          "<?xml version="1.0" encoding="UTF-8"?>
          <pretext>
          <article>
          <p>hi</p><p name="foo">there</p>
          </article>
          </pretext>"
        `);
    });

    it("renders a graph with a point", async () => {
        source = `<graph><point name="P" x="1" y="2" /></graph>`;
        expect(
            await coreRunner.processToFlatDastAsFragment(source),
        ).toMatchInlineSnapshot(
            `"<image><prefigure label="prefigure-doenet-id-1" xmlns="https://prefigure.org"><diagram dimensions="(425,425)"><coordinates bbox="(-10,-10,10,10)"><axes axes="all"></axes><point at="point_0" p="(1,2)" style="circle" size="5" fill="#1f5dff" stroke="#1f5dff" fill-opacity="0.7" stroke-opacity="0.7" thickness="4"></point></coordinates><annotations></annotations></diagram></prefigure></image>"`,
        );
    });

    it("renders a cascade", async () => {
        source = `<cascade boxAll>
                    <section>
                        <p>hi</p>
                        <problem><p><answer>4</answer></p></problem>
                    </section>
                    <section>
                        <p>there</p>
                    </section>
                  </cascade>`;
        expect(await coreRunner.processToFlatDastAsFragment(source))
            .toMatchInlineSnapshot(`
              "<section xml:id="doenet-id-2">
                                      <p>hi</p>
                                      <problem xml:id="doenet-id-4"><p><m><fillin characters="8"></fillin></m></p></problem>
                                  </section><section xml:id="doenet-id-9">
                                      <p>there</p>
                                  </section>"
            `);
    });

    it("convertMultiple assigns different xml:id's to elements with the same name across fragments", async () => {
        // Two fragments, each with an element named "foo"
        // When converted together, they should get different xml:id's
        const fragments = [
            `<section name="foo"><title>First</title></section>`,
            `<section name="foo"><title>Second</title></section>`,
        ];

        const results =
            await coreRunner.processMultipleFragmentsToFlatDast(fragments);

        expect(results).toHaveLength(2);

        // Extract xml:id from each result
        const firstIdMatch = results[0].match(/xml:id="([^"]+)"/);
        const secondIdMatch = results[1].match(/xml:id="([^"]+)"/);

        expect(firstIdMatch).not.toBeNull();
        expect(secondIdMatch).not.toBeNull();

        const firstId = firstIdMatch![1];
        const secondId = secondIdMatch![1];

        // The IDs should be different because they are converted as fragments
        // with unique ID assignment across multiple conversions
        expect(firstId).not.toBe(secondId);
    });

    it("convertMultiple keeps xref refs aligned with xml:id targets", async () => {
        const fragments = [
            `<section name="foo"><title>First</title></section><p>Jump to <ref to="$foo" /></p>`,
            `<section name="foo"><title>Second</title></section><p>Jump to <ref to="$foo" /></p>`,
        ];

        const results =
            await coreRunner.processMultipleFragmentsToFlatDast(fragments);

        expect(results).toHaveLength(2);

        const firstIdMatch = results[0].match(/xml:id="([^"]+)"/);
        const firstRefMatch = results[0].match(/<xref ref="([^"]+)"/);
        const secondIdMatch = results[1].match(/xml:id="([^"]+)"/);
        const secondRefMatch = results[1].match(/<xref ref="([^"]+)"/);

        expect(firstIdMatch).not.toBeNull();
        expect(firstRefMatch).not.toBeNull();
        expect(secondIdMatch).not.toBeNull();
        expect(secondRefMatch).not.toBeNull();

        expect(firstRefMatch![1]).toBe(firstIdMatch![1]);
        expect(secondRefMatch![1]).toBe(secondIdMatch![1]);
    });

    it("<booleanInput> renders as math fillin", async () => {
        source = `<booleanInput><label>Is it true?</label></booleanInput>`;
        expect(
            await coreRunner.processToFlatDastAsFragment(source),
        ).toMatchInlineSnapshot(
            `"Is it true? <m><fillin characters="8"></fillin></m>"`,
        );
    });

    it("<booleanInput> can have a label containing math", async () => {
        source = `<booleanInput><label>x <m>y^2</m><m>z</m></label></booleanInput>`;
        expect(
            await coreRunner.processToFlatDastAsFragment(source),
        ).toMatchInlineSnapshot(
            `"x <m>y^2</m><m>z</m> <m><fillin characters="8"></fillin></m>"`,
        );
    });

    it("<matrixInput> renders as math fillin", async () => {
        source = `<matrixInput><label>Enter a matrix</label></matrixInput>`;
        expect(
            await coreRunner.processToFlatDastAsFragment(source),
        ).toMatchInlineSnapshot(
            `"Enter a matrix <m><fillin characters="8"></fillin></m>"`,
        );
    });

    it("<orbitalDiagramInput> renders as math fillin", async () => {
        source = `<orbitalDiagramInput></orbitalDiagramInput>`;
        expect(
            await coreRunner.processToFlatDastAsFragment(source),
        ).toMatchInlineSnapshot(`"<m><fillin characters="8"></fillin></m>"`);
    });

    it("<image> renders with source attribute", async () => {
        source = `<image source="my-image.png" />`;
        expect(
            await coreRunner.processToFlatDastAsFragment(source),
        ).toMatchInlineSnapshot(`"<image source="my-image.png"></image>"`);
    });

    it("<image> with shortDescription renders shortdescription", async () => {
        source = `<image source="my-image.png"><shortDescription>A nice image</shortDescription></image>`;
        expect(
            await coreRunner.processToFlatDastAsFragment(source),
        ).toMatchInlineSnapshot(
            `"<image source="my-image.png"><shortdescription>A nice image</shortdescription></image>"`,
        );
    });

    it("<paginator> passes children through without the tag", async () => {
        source = `<paginator><p>Content</p></paginator><paginatorControls />`;
        expect(
            await coreRunner.processToFlatDastAsFragment(source),
        ).toMatchInlineSnapshot(`"<p>Content</p>"`);
    });

    it("<isBetween> renders as em", async () => {
        source = `<math name="x">5</math><isBetween limits="0 10">$x</isBetween>`;
        expect(
            await coreRunner.processToFlatDastAsFragment(source),
        ).toMatchInlineSnapshot(`"<m>5</m><em>true</em>"`);
    });

    it("<isInteger> renders as em", async () => {
        source = `<isInteger>5</isInteger>`;
        expect(
            await coreRunner.processToFlatDastAsFragment(source),
        ).toMatchInlineSnapshot(`"<em>true</em>"`);
    });

    it("<isNumber> renders as em", async () => {
        source = `<isNumber>3.5</isNumber>`;
        expect(
            await coreRunner.processToFlatDastAsFragment(source),
        ).toMatchInlineSnapshot(`"<em>true</em>"`);
    });

    it("<hasSameFactoring> renders as em", async () => {
        source = `<math name="a">x^2-1</math><math name="b">(x-1)(x+1)</math><hasSameFactoring>$a $b</hasSameFactoring>`;
        expect(
            await coreRunner.processToFlatDastAsFragment(source),
        ).toMatchInlineSnapshot(
            `"<m>x^{2} - 1</m><m>\\left(x - 1\\right) \\left(x + 1\\right)</m><em>false</em>"`,
        );
    });

    it("<intComma> renders comma-formatted number text", async () => {
        source = `<intComma>25236501</intComma>`;
        expect(
            await coreRunner.processToFlatDastAsFragment(source),
        ).toMatchInlineSnapshot(`"25,236,501"`);
    });

    it("<integer> renders as text", async () => {
        source = `<integer>42</integer>`;
        expect(
            await coreRunner.processToFlatDastAsFragment(source),
        ).toMatchInlineSnapshot(`"42"`);
    });

    it("<pluralize> renders plural text", async () => {
        source = `<pluralize>dog</pluralize>`;
        expect(
            await coreRunner.processToFlatDastAsFragment(source),
        ).toMatchInlineSnapshot(`"dogs"`);
    });

    it("<latex> renders LaTeX text", async () => {
        source = `<latex>\\frac{1}{2}</latex>`;
        expect(
            await coreRunner.processToFlatDastAsFragment(source),
        ).toMatchInlineSnapshot(`"\\frac{1}{2}"`);
    });

    it("<label> renders its value text", async () => {
        source = `<label>My label text</label>`;
        expect(
            await coreRunner.processToFlatDastAsFragment(source),
        ).toMatchInlineSnapshot(`"My label text"`);
    });

    it("<displayDoenetML> renders its DoenetML source text", async () => {
        source = `<displayDoenetML><m>x+y</m></displayDoenetML>`;
        expect(
            await coreRunner.processToFlatDastAsFragment(source),
        ).toMatchInlineSnapshot(`"&#x3C;m>x+y&#x3C;/m>"`);
    });

    it("<derivative> renders as m", async () => {
        source = `<function name="f" variable="x">x^2</function><derivative>$f</derivative>`;
        expect(
            await coreRunner.processToFlatDastAsFragment(source),
        ).toMatchInlineSnapshot(`"<m>x^{2}</m><m>2 x</m>"`);
    });

    it("<matrix> renders as m", async () => {
        source = `<matrix><row>1 0</row><row>0 1</row></matrix>`;
        expect(
            await coreRunner.processToFlatDastAsFragment(source),
        ).toMatchInlineSnapshot(
            `"<m>\\begin{bmatrix} 1 &#x26; 0 \\\\ 0 &#x26; 1 \\end{bmatrix}</m>"`,
        );
    });

    it("<interval> renders as m", async () => {
        source = `<interval>(3,4)</interval>`;
        expect(
            await coreRunner.processToFlatDastAsFragment(source),
        ).toMatchInlineSnapshot(`"<m>\\left( 3, 4 \\right)</m>"`);
    });

    it("<ion> renders as m", async () => {
        source = `<ion symbol="H" />`;
        expect(
            await coreRunner.processToFlatDastAsFragment(source),
        ).toMatchInlineSnapshot(`"<m>\\text{H}^+</m>"`);
    });

    it("<ionicCompound> renders as m", async () => {
        source = `<ionicCompound name="caF"><ion symbol="Ca"/><ion symbol="F"/></ionicCompound>`;
        expect(
            await coreRunner.processToFlatDastAsFragment(source),
        ).toMatchInlineSnapshot(`"<m>\\text{Ca} \\text{F}_{2}</m>"`);
    });

    it("<function> renders as m", async () => {
        source = `<function variable="x">x^2</function>`;
        expect(
            await coreRunner.processToFlatDastAsFragment(source),
        ).toMatchInlineSnapshot(`"<m>x^{2}</m>"`);
    });

    it("<extractMathOperator> renders the operator as text", async () => {
        source = `<math name="expr">x+y</math><extractMathOperator>$expr</extractMathOperator>`;
        expect(
            await coreRunner.processToFlatDastAsFragment(source),
        ).toMatchInlineSnapshot(`"<m>x + y</m>+"`);
    });
});
