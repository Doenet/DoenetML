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

    it("<delete> and <insert> keep their PreTeXt names", async () => {
        source = `<p>The answer is <delete>4</delete> <insert>5</insert>.</p>`;
        expect(
            await coreRunner.processToFlatDastAsFragment(source),
        ).toMatchInlineSnapshot(
            `"<p>The answer is <delete>4</delete> <insert>5</insert>.</p>"`,
        );
    });

    it("an expanded input becomes room to write inside a handout", async () => {
        // A text area is a place to write a long answer, which on paper is blank
        // space. PreTeXt only leaves that space inside a printout division.
        source = `<p>Explain your reasoning: <textInput expanded /></p>`;
        expect(await coreRunner.processToFlatDastAsFragment(source))
            .toMatchInlineSnapshot(`
              "<handout>
              <title></title><p workspace="1.25in">Explain your reasoning: </p>
              </handout>"
            `);
    });

    it("room to write is sized by the input's height", async () => {
        source = `<p>Explain: <textInput expanded height="3in" /></p>`;
        expect(await coreRunner.processToFlatDastAsFragment(source)).toContain(
            `<p workspace="3in">`,
        );
    });

    it("two expanded inputs in a paragraph each get their own room", async () => {
        source = `<p>A <textInput expanded /> B <textInput expanded height="2in" /></p>`;
        expect(await coreRunner.processToFlatDastAsFragment(source)).toContain(
            `<p workspace="3.25in">`,
        );
    });

    it("a hand-graded answer written on its own gets room to write in", async () => {
        // The `expanded` answer sugars in an expanded text input, but is written
        // outside any paragraph, so the space needs a paragraph of its own.
        source = `<answer type="text" handGraded expanded />`;
        expect(await coreRunner.processToFlatDastAsFragment(source))
            .toMatchInlineSnapshot(`
              "<handout>
              <title></title><p workspace="1.25in"></p>
              </handout>"
            `);
    });

    it("an answer written with the response it expects gets room to write too", async () => {
        // Content asks the answer for an input as much as `handGraded` does, so an
        // answer written with the response it expects sugars in the same expanded input
        // and gets the same room. The expected response itself is not printed.
        source = `<answer type="text" expanded>The correct answer</answer>`;
        expect(await coreRunner.processToFlatDastAsFragment(source))
            .toMatchInlineSnapshot(`
              "<handout>
              <title></title><p workspace="1.25in"></p>
              </handout>"
            `);
    });

    it("a hand-graded answer keeps its label alongside the room to write", async () => {
        // Only the input is replaced by the space; the answer wrapping it still
        // renders the label that asks the question.
        source = `<answer type="text" handGraded expanded><label>Explain</label></answer>`;
        expect(await coreRunner.processToFlatDastAsFragment(source))
            .toMatchInlineSnapshot(`
              "<handout>
              <title></title><p workspace="1.25in">Explain </p>
              </handout>"
            `);
    });

    it("an expanded input keeps the label written on it", async () => {
        // The input is replaced by the space, so a label written on the input itself
        // would go with it. Nothing else is left to ask the question — unlike an
        // `<answer>`'s label, which the answer stays behind to draw — so it takes the
        // input's place and the space follows it.
        source = `<textInput expanded height="0.5in"><label>Your name:</label></textInput>`;
        expect(await coreRunner.processToFlatDastAsFragment(source)).toContain(
            `<p workspace="0.5in">Your name: </p>`,
        );
    });

    it("a hand-graded answer in a list item keeps the item's text in the paragraph", async () => {
        // A list item holds either inline content or blocks, never a mix, so the
        // paragraph carrying the space takes in the text written alongside it.
        source = `<ol><li>Why? <answer type="text" handGraded expanded /></li></ol>`;
        expect(await coreRunner.processToFlatDastAsFragment(source)).toContain(
            `<li xml:id="doenet-id-2"><p workspace="1.25in">Why? </p></li>`,
        );
    });

    it("a list item's inline elements are taken into the paragraph too", async () => {
        // The run the paragraph takes in is not just written-out text: an
        // expression left beside the paragraph would be the same illegal mix.
        source = `<ol><li><m>2+2=</m> <answer type="text" handGraded expanded /></li></ol>`;
        expect(await coreRunner.processToFlatDastAsFragment(source)).toContain(
            `<li xml:id="doenet-id-2"><p workspace="1.25in"><m>2+2=</m> </p></li>`,
        );
    });

    it("a list item's other components are taken into the paragraph too", async () => {
        // The run is decided by naming the components that stand on their own,
        // so one that renders as text is taken in whether or not the export has
        // been taught anything else about it.
        source = `<ol><li><latex>x^2</latex> <answer type="text" handGraded expanded /></li></ol>`;
        expect(await coreRunner.processToFlatDastAsFragment(source)).toContain(
            `<li xml:id="doenet-id-2"><p workspace="1.25in">x^2 </p></li>`,
        );
    });

    it("a component showing text is taken in, though a block one is not", async () => {
        // `<displayDoenetML>` shows its text with no element around it, so it is
        // part of the run; `<codeEditor>` exports as a `<program>`, which stands
        // on its own and is left standing.
        source = `<ol><li><displayDoenetML>Why?</displayDoenetML> <answer type="text" handGraded expanded /></li></ol>`;
        expect(await coreRunner.processToFlatDastAsFragment(source)).toContain(
            `<li xml:id="doenet-id-2"><p workspace="1.25in">Why? </p></li>`,
        );

        source = `<ol><li><codeEditor>x</codeEditor><answer type="text" handGraded expanded /></li></ol>`;
        expect(await coreRunner.processToFlatDastAsFragment(source)).toContain(
            `</program><p workspace="1.25in"></p></li>`,
        );
    });

    it("a choice input is a block or part of the run, as it is written", async () => {
        // The same tag reads both ways: a choice input lists every choice as its
        // own block, unless it is written inline, where it is the chosen one read
        // as part of the sentence.
        source = `<ol><li><choiceInput><choice>yes</choice><choice>no</choice></choiceInput><answer type="text" handGraded expanded /></li></ol>`;
        expect(await coreRunner.processToFlatDastAsFragment(source)).toContain(
            `<li xml:id="doenet-id-2"><ol><li>◯ yes</li><li>◯ no</li></ol><p workspace="1.25in"></p></li>`,
        );

        source = `<ol><li>Pick: <choiceInput inline><choice>yes</choice><choice>no</choice></choiceInput> <answer type="text" handGraded expanded /></li></ol>`;
        expect(await coreRunner.processToFlatDastAsFragment(source)).toContain(
            `<li xml:id="doenet-id-2"><p workspace="1.25in">Pick: <fillin characters="21"></fillin> </p></li>`,
        );
    });

    it("room to write is placed outside the formatting around the question", async () => {
        // A paragraph may not sit inside `<em>`, so the space is placed outside
        // it and the formatting is taken into the paragraph with the rest.
        source = `<ol><li><em>Why? <answer type="text" handGraded expanded /></em></li></ol>`;
        expect(await coreRunner.processToFlatDastAsFragment(source)).toContain(
            `<li xml:id="doenet-id-2"><p workspace="1.25in"><em>Why? </em></p></li>`,
        );
    });

    it("room to write is placed outside a deletion around the question", async () => {
        source = `<ol><li><delete>Why? <answer type="text" handGraded expanded /></delete></li></ol>`;
        expect(await coreRunner.processToFlatDastAsFragment(source)).toContain(
            `<li xml:id="doenet-id-2"><p workspace="1.25in"><delete>Why? </delete></p></li>`,
        );
    });

    it("blocks inside a wrapper that shows only its children still stand", async () => {
        // A `<paginator>`, like a `<div>`, exports as its children alone, so what it
        // holds is what decides whether the paragraph takes it in.
        source = `<ol><li><paginator><p>Content</p></paginator><answer type="text" handGraded expanded /></li></ol>`;
        expect(await coreRunner.processToFlatDastAsFragment(source)).toContain(
            `<li xml:id="doenet-id-2"><p>Content</p><p workspace="1.25in"></p></li>`,
        );

        source = `<div><p>Content</p></div><answer type="text" handGraded expanded />`;
        expect(await coreRunner.processToFlatDastAsFragment(source)).toContain(
            `<p>Content</p><p workspace="1.25in"></p>`,
        );
    });

    it("a list item's blocks are left standing beside the room to write", async () => {
        // A list item already holding blocks takes no run in: the paragraph
        // carrying the space stands as one more block of its own.
        source = `<ol><li><p>Why?</p><answer type="text" handGraded expanded /></li></ol>`;
        expect(await coreRunner.processToFlatDastAsFragment(source)).toContain(
            `<li xml:id="doenet-id-2"><p>Why?</p><p workspace="1.25in"></p></li>`,
        );
    });

    it("room to write inside a problem stays inside the problem", async () => {
        source = `<problem><p>Explain.</p><answer type="text" handGraded expanded /></problem>`;
        expect(await coreRunner.processToFlatDastAsFragment(source)).toContain(
            `<p>Explain.</p><p workspace="1.25in"></p></problem>`,
        );
    });

    it("a document without an expanded input is not made into a handout", async () => {
        source = `<p>Short answer: <textInput /></p>`;
        expect(
            await coreRunner.processToFlatDastAsFragment(source),
        ).toMatchInlineSnapshot(
            `"<p>Short answer: <fillin characters="21"></fillin></p>"`,
        );
    });

    it("a hidden expanded input claims no room to write", async () => {
        // An input the reader never sees asks them nothing, so it needs no room
        // and the document holding it is not made into a handout.
        source = `<p>Explain: <textInput expanded hide /></p>`;
        expect(
            await coreRunner.processToFlatDastAsFragment(source),
        ).toMatchInlineSnapshot(`"<p>Explain: </p>"`);
    });

    it("only the section holding an expanded input becomes a handout", async () => {
        source = `<section><title>A</title><p>Why? <textInput expanded /></p></section><section><title>B</title><p>Plain</p></section>`;
        const exported = await coreRunner.processToFlatDastAsFragment(source);
        expect(exported).toContain(`<handout xml:id="doenet-id-1">`);
        expect(exported).toContain(`<section xml:id="doenet-id-6">`);
    });

    it("a section with no title of its own is not given one when it becomes a handout", async () => {
        // PreTeXt heads an untitled `<handout>` with its default title for the division,
        // the bare word "Handout", where the same section left alone would have carried
        // no heading text at all. The empty title suppresses it, so becoming a printout
        // does not invent a heading the author never wrote.
        source = `<section><p>Why? <textInput expanded /></p></section>`;
        const exported = await coreRunner.processToFlatDastAsFragment(source);
        expect(exported).toContain(`<handout xml:id="doenet-id-1">`);
        expect(exported).toContain(`<title></title>`);
        expect(exported.match(/<title>/g)).toHaveLength(1);
    });

    it("a section's own title is kept when it becomes a handout", async () => {
        // Only a division with no title of its own is given the empty one.
        source = `<section><title>A</title><p>Why? <textInput expanded /></p></section>`;
        const exported = await coreRunner.processToFlatDastAsFragment(source);
        expect(exported).toContain(`<title>A</title>`);
        expect(exported.match(/<title>/g)).toHaveLength(1);
    });

    it("a section holding sections of its own is served by the document handout", async () => {
        // The section cannot become the handout itself, since it would then hold a
        // division. The handout goes around the whole document instead, which serves the
        // input and leaves both sections standing where they were written.
        source = `<section><title>A</title><p>Why? <textInput expanded /></p><section><title>B</title><p>Inner</p></section></section>`;
        const exported = await coreRunner.processToFlatDastAsFragment(source);
        expect(exported).toContain(`<p workspace="1.25in">Why? </p>`);
        // The handout around the document carries no `xml:id`, where a section retagged
        // as one would; both sections are still written as sections.
        expect(exported).toContain(`<handout>`);
        expect(exported).toContain(`<section xml:id="doenet-id-1">`);
        expect(exported).toContain(`<section xml:id="doenet-id-5">`);
        expect(exported).not.toContain(`<fillin`);
    });

    it("a section that could have held the space is left a section when another input cannot use it", async () => {
        // The choice is made for the document as a whole, so a section that would have
        // become the handout on its own is left alone once a second input is found
        // outside it. One handout around the document serves both.
        source = `<section><title>A</title><p>Q1 <textInput expanded /></p></section><p>Q2 <textInput expanded /></p>`;
        const exported = await coreRunner.processToFlatDastAsFragment(source);
        expect(exported.match(/<handout/g)).toHaveLength(1);
        expect(exported).toContain(`<section xml:id="doenet-id-1">`);
        expect(exported.match(/workspace="1.25in"/g)).toHaveLength(2);
    });

    it("a problem written beside a section gets room to write", async () => {
        // A `<problem>` is not a division and so cannot become a handout itself. The
        // handout goes around the whole document, which serves it.
        source = `<section><title>S</title><p>x</p></section><problem><p>Q <textInput expanded /></p></problem>`;
        const exported = await coreRunner.processToFlatDastAsFragment(source);
        expect(exported).toContain(`<handout>`);
        expect(exported).toContain(`<p workspace="1.25in">Q </p>`);
        expect(exported).not.toContain(`<fillin`);
    });

    it("a run of problems beside a section shares a single handout", async () => {
        // One handout for the document, rather than one apiece, so the printed page is
        // not broken up by a heading before every problem.
        source = `<section><title>S</title><p>x</p></section><problem><p>Q1 <textInput expanded /></p></problem><problem><p>Q2 <textInput expanded /></p></problem>`;
        const exported = await coreRunner.processToFlatDastAsFragment(source);
        expect(exported.match(/<handout/g)).toHaveLength(1);
        expect(exported.match(/workspace="1.25in"/g)).toHaveLength(2);
    });

    it("a division nested inside a block is still served by the document handout", async () => {
        // A handout may hold divisions, so however the sections are arranged around the
        // input, the one around the document reaches it.
        source = `<problem><p>Q <textInput expanded /></p><section><title>B</title><p>x</p></section></problem><section><title>C</title><p>y</p></section>`;
        const exported = await coreRunner.processToFlatDastAsFragment(source);
        expect(exported).toContain(`<handout>`);
        expect(exported).toContain(`<p workspace="1.25in">Q </p>`);
        expect(exported).not.toContain(`<fillin`);
    });

    it("the handout wrapped around a whole document is left untitled", async () => {
        // The document's title stays on the `<article>`, which needs one. The handout is
        // given an empty title rather than a copy: untitled, PreTeXt would head it with
        // its default title for the division — the bare word "Handout" — and a copy
        // would print the activity's title twice. Neither is a title the author wrote.
        source = `<title>My activity</title><p>Why? <textInput expanded /></p>`;
        expect(await coreRunner.processToFlatDast(source))
            .toMatchInlineSnapshot(`
              "<?xml version="1.0" encoding="UTF-8"?>
              <pretext>
              <article>
              <title>My activity</title><handout>
              <title></title><p workspace="1.25in">Why? </p>
              </handout>
              </article>
              </pretext>"
            `);
    });

    it("a document in pages becomes a worksheet of them, its listed problems exercises", async () => {
        // PreTeXt honors a `<page>` only as a child of a printout, so the `<problems>`
        // holding the pages is dissolved to bring them up to the worksheet. Its problems
        // print as worksheet exercises, which PreTeXt heads with their number alone, as
        // the items of the list they were.
        source = `<page><p>Intro</p></page>
<problems>
  <page><problem><p>A</p></problem></page>
  <page><problem><p>B</p></problem></page>
</problems>`;
        expect(await coreRunner.processToFlatDast(source))
            .toMatchInlineSnapshot(`
              "<?xml version="1.0" encoding="UTF-8"?>
              <pretext>
              <article>
              <worksheet>
              <title></title><page>
              <p>Intro</p>
              </page>
              <page>
              <exercise xml:id="doenet-id-5"><p>A</p></exercise>
              </page><page>
              <exercise xml:id="doenet-id-9"><p>B</p></exercise>
              </page>
              </worksheet>
              </article>
              </pretext>"
            `);
    });

    it("writing space on a page is served by the worksheet, not a handout of its own", async () => {
        source = `<page><problem><p>Q <textInput expanded height="2in" /></p></problem></page>`;
        const exported = await coreRunner.processToFlatDast(source);
        expect(exported.match(/<worksheet>/g)).toHaveLength(1);
        expect(exported).not.toContain(`<handout`);
        expect(exported).toContain(`<p workspace="2in">Q </p>`);
    });

    it("a problem that is not a list item stays a problem on a page", async () => {
        source = `<page><problem><p>A</p></problem></page>`;
        const exported = await coreRunner.processToFlatDast(source);
        expect(exported).toContain(`<page>`);
        expect(exported).toContain(`<problem `);
        expect(exported).not.toContain(`<exercise`);
    });

    it("text beside the pages of a worksheet is given a paragraph", async () => {
        // Text written at the document level, or in a container dissolved to bring the
        // pages up, ends up in the worksheet, where PreTeXt drops text not in a paragraph.
        source = `<div>Before <page><p>A</p></page></div><page><p>B</p></page>After`;
        const exported = await coreRunner.processToFlatDast(source);
        expect(exported).toContain(`<p>Before</p><page>`);
        expect(exported).toContain(`</page><p>After</p>`);
    });

    it("a page inside a section exports as its children", async () => {
        // PreTeXt has no page but a printout's, and a section cannot be dissolved.
        source = `<section><title>S</title><page><p>Inside</p></page></section>`;
        const exported = await coreRunner.processToFlatDast(source);
        expect(exported).not.toContain(`<page`);
        expect(exported).not.toContain(`<worksheet`);
        expect(exported).toContain(`<p>Inside</p>`);

        // Nor is the list around such a section dissolved: with no page to bring up, the
        // document is left as it was, its list and the list's title included.
        source = `<problems><title>List</title><problem><p>Q</p></problem><section><page><p>Inside</p></page></section></problems>`;
        const withPage = await coreRunner.processToFlatDast(source);
        expect(withPage).not.toContain(`<worksheet`);
        expect(withPage).toContain(`List`);
        expect(withPage).toEqual(
            await coreRunner.processToFlatDast(
                source.replace(`<page>`, `<div>`).replace(`</page>`, `</div>`),
            ),
        );
    });

    it("the rows of an <md> are each an <mrow>", async () => {
        // Without their own `<mrow>`s, the rows have nothing to align in, and every
        // `\\amp` is a "Misplaced &".
        source = `<md><mrow>x \\amp = 1</mrow><mrow>y \\amp = 2</mrow></md>`;
        expect(
            await coreRunner.processToFlatDastAsFragment(source),
        ).toMatchInlineSnapshot(
            `"<md number="no"><mrow>x \\amp = 1</mrow><mrow>y \\amp = 2</mrow></md>"`,
        );
    });

    it("the rows of an <mdn> are each an <mrow>, numbered by PreTeXt", async () => {
        // PreTeXt numbers the equations itself, so the core's `\\tag{n}` is taken off
        // and the display as a whole is marked numbered.
        source = `<mdn><mrow>x \\amp = 1</mrow><mrow>y \\amp = 2</mrow></mdn>`;
        expect(
            await coreRunner.processToFlatDastAsFragment(source),
        ).toMatchInlineSnapshot(
            `"<md number="yes"><mrow>x \\amp = 1</mrow><mrow>y \\amp = 2</mrow></md>"`,
        );
    });

    it("a row numbered unlike its display says so", async () => {
        source = `<mdn><mrow>x \\amp = 1</mrow><mrow number="false">y \\amp = 2</mrow></mdn>`;
        expect(
            await coreRunner.processToFlatDastAsFragment(source),
        ).toMatchInlineSnapshot(
            `"<md number="yes"><mrow>x \\amp = 1</mrow><mrow number="no">y \\amp = 2</mrow></md>"`,
        );

        source = `<md><mrow>x \\amp = 1</mrow><mrow number>y \\amp = 2</mrow></md>`;
        expect(
            await coreRunner.processToFlatDastAsFragment(source),
        ).toMatchInlineSnapshot(
            `"<md number="no"><mrow>x \\amp = 1</mrow><mrow number="yes">y \\amp = 2</mrow></md>"`,
        );
    });

    it("a single-row <men> is a numbered <md> without the core's tag", async () => {
        source = `<men>x = 1</men>`;
        expect(
            await coreRunner.processToFlatDastAsFragment(source),
        ).toMatchInlineSnapshot(`"<md number="yes">x = 1</md>"`);
    });

    it("a line break in an <men> keeps it one equation, with one number", async () => {
        // On screen an `<men>` is one equation however many lines it has, so its lines
        // are gathered rather than split into rows PreTeXt would number one by one.
        source = `<men>a = 1 \\\\ b = 2</men>`;
        const exported = await coreRunner.processToFlatDastAsFragment(source);
        expect(exported).not.toContain(`<mrow`);
        expect(exported).toMatch(
            /^<md number="yes">\\begin\{gathered\}.*\\end\{gathered\}<\/md>$/,
        );
    });

    it("an empty row is kept, and the core's tag never leaks", async () => {
        // Each row DoenetML numbers is a row PreTeXt numbers.
        source = `<mdn><mrow></mrow><mrow>y = 2</mrow></mdn>`;
        expect(
            await coreRunner.processToFlatDastAsFragment(source),
        ).toMatchInlineSnapshot(
            `"<md number="yes"><mrow></mrow><mrow>y = 2</mrow></md>"`,
        );

        source = `<mdn><mrow></mrow></mdn>`;
        const exported = await coreRunner.processToFlatDastAsFragment(source);
        expect(exported).not.toContain(`\\tag`);
        expect(exported).not.toContain(`\\notag`);
    });

    it("a row break inside an environment does not split a display", async () => {
        source = `<me>\\begin{array}{cc} a \\amp b \\\\ c \\amp d \\end{array}</me>`;
        const exported = await coreRunner.processToFlatDastAsFragment(source);
        expect(exported).not.toContain(`<mrow>`);
        expect(exported).toContain(`\\\\`);
    });

    it("an unnumbered display says it is unnumbered", async () => {
        // A PreTeXt document may number equations by default, so a display that is not
        // numbered on screen says so rather than leaving it to that default.
        source = `<me>x = 1</me>`;
        expect(
            await coreRunner.processToFlatDastAsFragment(source),
        ).toMatchInlineSnapshot(`"<md number="no">x = 1</md>"`);

        source = `<md><mrow>x = 1</mrow></md>`;
        expect(
            await coreRunner.processToFlatDastAsFragment(source),
        ).toMatchInlineSnapshot(`"<md number="no">x = 1</md>"`);
    });

    it("a tag the author wrote is kept, and the row given no number", async () => {
        // The author's tag stays in the math, and PreTeXt is told not to add a number of
        // its own beside it.
        source = `<mdn><mrow>x \\tag{A}</mrow><mrow>y</mrow></mdn>`;
        expect(
            await coreRunner.processToFlatDastAsFragment(source),
        ).toMatchInlineSnapshot(
            `"<md number="yes"><mrow number="no">x \\tag{A}</mrow><mrow>y</mrow></md>"`,
        );

        source = `<md><mrow>x \\tag{A}</mrow><mrow>y</mrow></md>`;
        expect(
            await coreRunner.processToFlatDastAsFragment(source),
        ).toMatchInlineSnapshot(
            `"<md number="no"><mrow>x \\tag{A}</mrow><mrow>y</mrow></md>"`,
        );

        // A tag of digits alone is the author's too, when the author wrote it.
        source = `<md><mrow>x \\tag{7}</mrow><mrow>y</mrow></md>`;
        expect(
            await coreRunner.processToFlatDastAsFragment(source),
        ).toMatchInlineSnapshot(
            `"<md number="no"><mrow>x \\tag{7}</mrow><mrow>y</mrow></md>"`,
        );

        // Braces inside the tag, and a starred tag.
        source = `<mdn><mrow>x \\tag{a_{1}}</mrow><mrow>y \\tag*{B}</mrow></mdn>`;
        expect(
            await coreRunner.processToFlatDastAsFragment(source),
        ).toMatchInlineSnapshot(
            `"<md number="yes"><mrow number="no">x \\tag{a_{1}}</mrow><mrow number="no">y \\tag*{B}</mrow></md>"`,
        );

        source = `<men>\\tag{Q} x</men>`;
        expect(
            await coreRunner.processToFlatDastAsFragment(source),
        ).toMatchInlineSnapshot(`"<md number="no">\\tag{Q} x</md>"`);
    });

    it("text written straight into a problem is given a paragraph", async () => {
        // PreTeXt drops text that is not in a paragraph. A display goes in with the text
        // around it, since PreTeXt writes an `<md>` inside a paragraph.
        source = `<problem>For the system <me>x=1</me> find the equilibria.<ol><li>Now</li></ol></problem>`;
        const exported = await coreRunner.processToFlatDastAsFragment(source);
        expect(exported).toMatch(
            /<problem[^>]*><p>For the system <md number="no">x=1<\/md> find the equilibria\.<\/p><ol>/,
        );

        // Without a block beside it, too.
        source = `<problem>Only text</problem>`;
        expect(await coreRunner.processToFlatDastAsFragment(source)).toMatch(
            /<problem[^>]*><p>Only text<\/p><\/problem>/,
        );
    });

    it("text written straight into the parts of a problem is given a paragraph", async () => {
        source = `<problem><statement>Find the equilibria.</statement><hint>Factor.</hint><givenAnswer>0, 1</givenAnswer><solution>They are <m>0</m> and <m>1</m>.</solution></problem>`;
        expect(
            await coreRunner.processToFlatDastAsFragment(source),
        ).toMatchInlineSnapshot(
            `"<problem xml:id="doenet-id-1"><statement><p>Find the equilibria.</p></statement><hint><p>Factor.</p></hint><answer><p>0, 1</p></answer><solution><p>They are <m>0</m> and <m>1</m>.</p></solution></problem>"`,
        );
    });

    it("text written straight into an introduction or a conclusion is given a paragraph", async () => {
        source = `<section><introduction>Read this first.</introduction><p>Body</p><conclusion>That is all.</conclusion></section>`;
        expect(await coreRunner.processToFlatDastAsFragment(source)).toContain(
            `<introduction><p>Read this first.</p></introduction><p>Body</p><conclusion><p>That is all.</p></conclusion>`,
        );
    });

    it("a solution keeps its content, for the publisher to show or hide", async () => {
        source = `<problem><statement><p>What is 1+1?</p></statement><solution><p>It is 2.</p></solution></problem>`;
        expect(await coreRunner.processToFlatDastAsFragment(source)).toContain(
            `<solution><p>It is 2.</p></solution>`,
        );
    });

    it("the parts of a statement are not taken into a paragraph", async () => {
        // A `<statement>` or `<solution>` inside a `<p>` is no longer read as a part of
        // the problem: the solution escapes the publisher's settings for solutions.
        source = `<problem><statement><p>What is 1+1?</p></statement><solution><p>2</p></solution></problem>`;
        let exported = await coreRunner.processToFlatDastAsFragment(source);
        expect(exported).toMatch(/<problem[^>]*><statement>/);
        expect(exported).not.toContain("<p><statement>");
        expect(exported).not.toMatch(/<p>[^<]*<solution/);

        source = `<theorem><statement><p>T</p></statement><proof><p>P</p></proof></theorem>`;
        expect(await coreRunner.processToFlatDastAsFragment(source)).toMatch(
            /<theorem[^>]*><statement>/,
        );

        // Text beside a hint is given a paragraph of its own, and the hint stands apart.
        source = `<problem>What is 1+1? <hint><p>Count.</p></hint></problem>`;
        expect(await coreRunner.processToFlatDastAsFragment(source)).toMatch(
            /<p>What is 1\+1\?<\/p><hint>/,
        );

        source = `<section>Intro<paragraphs><title>P</title><p>x</p></paragraphs></section>`;
        expect(await coreRunner.processToFlatDastAsFragment(source)).toMatch(
            /<p>Intro<\/p><paragraphs>/,
        );
    });

    it("a blank text input prints its label and is as wide as on screen", async () => {
        // 200px at PreTeXt's 5/11 em a character, with 16px text: 28 characters.
        source = `<p><textInput width="200px"><label>Name (print):</label></textInput></p>`;
        expect(
            await coreRunner.processToFlatDastAsFragment(source),
        ).toMatchInlineSnapshot(
            `"<p>Name (print): <fillin characters="28"></fillin></p>"`,
        );
    });

    it("a text input's label with math writes the math as <m>", async () => {
        source = `<p><textInput><label>Value of <m>x</m>:</label></textInput></p>`;
        expect(
            await coreRunner.processToFlatDastAsFragment(source),
        ).toMatchInlineSnapshot(
            `"<p>Value of <m>x</m>: <fillin characters="21"></fillin></p>"`,
        );
    });

    it("an answer's label is kept apart from an input written inside it", async () => {
        // An input written out inside an `<answer>` does not inherit its label, so the
        // space after the label must come from the answer.
        source = `<p><answer><label>Pick:</label><choiceInput inline preselectChoice="1"><choice credit="1">yes</choice><choice>no</choice></choiceInput></answer></p>`;
        expect(await coreRunner.processToFlatDastAsFragment(source)).toContain(
            `Pick: <em>yes</em>`,
        );

        source = `<p><answer><label>A:</label><mathInput /><award>x</award></answer></p>`;
        expect(await coreRunner.processToFlatDastAsFragment(source)).toContain(
            `A: <m><fillin`,
        );

        source = `<p><answer><label>A:</label><textInput /><award>x</award></answer></p>`;
        expect(await coreRunner.processToFlatDastAsFragment(source)).toContain(
            `A: <fillin`,
        );

        // An input with a label of its own draws it after the answer's.
        source = `<p><answer><label>A</label><textInput><label>B</label></textInput><award>x</award></answer></p>`;
        expect(await coreRunner.processToFlatDastAsFragment(source)).toContain(
            `A B <fillin`,
        );
    });

    it("a text input leaves the label it inherits to its answer", async () => {
        // The answer draws the label; the input it was sugared into must not repeat it.
        source = `<p><answer type="text"><label>Your word:</label>hello</answer></p>`;
        const exported = await coreRunner.processToFlatDastAsFragment(source);
        expect(exported.match(/Your word:/g)).toHaveLength(1);
        // The space between the label and the blank is still the input's to supply.
        expect(exported).toContain(`Your word: <fillin`);
    });

    it("converts the variant it is asked for", async () => {
        source = `<select name="s">apple banana cherry</select><p>$s</p>`;
        const variants = [];
        for (const variantIndex of [1, 2, 3]) {
            variants.push(
                await coreRunner.processToFlatDastAsFragment(source, {
                    variantIndex,
                }),
            );
        }
        // Each variant selects a different option, and asking again for one gives it back.
        expect(new Set(variants).size).toBe(3);
        expect(
            await coreRunner.processToFlatDastAsFragment(source, {
                variantIndex: 2,
            }),
        ).toBe(variants[1]);
    });

    it("a list item holding only text is left without a paragraph", async () => {
        source = `<ol><li>Plain</li></ol>`;
        expect(await coreRunner.processToFlatDastAsFragment(source)).toContain(
            `>Plain</li>`,
        );
    });

    it("an unfilled input inside an <m> becomes a fillin", async () => {
        // An input written inside an expression is a blank the reader writes
        // on, so it exports as PreTeXt's own <fillin> rather than as nothing.
        source = `<p><m>x = <textInput /> + 3</m></p>`;
        expect(await coreRunner.processToFlatDastAsFragment(source)).toContain(
            `<m>x = <fillin characters="8"></fillin> + 3</m>`,
        );
    });

    it("an input with a value inside an <m> exports the value", async () => {
        source = `<p><m>x = <textInput prefill="y^2" /> + 3</m></p>`;
        const exported = await coreRunner.processToFlatDastAsFragment(source);
        expect(exported).toContain(`<m>x = y^2 + 3</m>`);
        expect(exported).not.toContain("fillin");
    });

    it("a math input inside an <m> exports as mathematics", async () => {
        // The field contributes its value as LaTeX, so an exported worksheet
        // shows the expression the reader entered rather than a plain-text
        // transcription of it.
        source = `<p><m>x = <mathInput prefillLatex="\\sqrt{2}" /> + 3</m></p>`;
        const exported = await coreRunner.processToFlatDastAsFragment(source);
        expect(exported).toContain(`<m>x = \\sqrt{2} + 3</m>`);
        expect(exported).not.toContain("fillin");
    });

    it("an unfilled math input inside an <m> becomes a fillin", async () => {
        source = `<p><m>x = <mathInput /> + 3</m></p>`;
        expect(await coreRunner.processToFlatDastAsFragment(source)).toContain(
            `<m>x = <fillin characters="8"></fillin> + 3</m>`,
        );
    });

    it("an unfilled input inside an <md> becomes a fillin", async () => {
        source = `<md><mrow>f(x) \\amp = x^2</mrow><mrow>f'(x) \\amp = <textInput /></mrow></md>`;
        expect(await coreRunner.processToFlatDastAsFragment(source)).toContain(
            `<fillin characters="8"></fillin>`,
        );
    });

    it("renders mathInput nested inside answer", async () => {
        source = `<answer><mathInput /><mathInput /></answer>`;
        expect(await coreRunner.processToFlatDastAsFragment(source)).toContain(
            `<m><fillin characters="8"></fillin></m>`,
        );
    });

    it("a label written on the answer is not repeated by its math input", async () => {
        // An input inherits `label` from the answer around it, the same way it inherits
        // `expanded`. The answer is the one that renders it — an expanded input is
        // replaced by writing space before export, and the label has to survive that — so
        // the input drops the copy it inherited.
        source = `<answer><label>How many?</label>42</answer>`;
        const exported = await coreRunner.processToFlatDastAsFragment(source);
        expect(exported).toContain(
            `How many? <m><fillin characters="8"></fillin></m>`,
        );
        expect(exported.match(/How many\?/g)).toHaveLength(1);
    });

    it("a label written on the answer is not repeated by its choice input", async () => {
        source = `<answer inline><label>Pick one</label><choice credit="1">yes</choice><choice>no</choice></answer>`;
        const exported = await coreRunner.processToFlatDastAsFragment(source);
        expect(exported.match(/Pick one/g)).toHaveLength(1);
        expect(exported).toContain(`Pick one <fillin characters="21">`);
    });

    it("the label of a choice input is not one of its choices", async () => {
        // The viewer is handed the `<label>` child to show its markup; the export draws
        // the label from the input instead, so the child must not be counted as a choice.
        source = `<choiceInput preselectChoice="2"><label>Pick one</label><choice>yes</choice><choice>no</choice></choiceInput>`;
        expect(
            await coreRunner.processToFlatDastAsFragment(source),
        ).toMatchInlineSnapshot(
            `"<p>Pick one </p><ol><li>◯ yes</li><li>⦿ no</li></ol>"`,
        );

        source = `<p><choiceInput inline preselectChoice="2"><label>Pick one</label><choice>yes</choice><choice>no</choice></choiceInput></p>`;
        expect(
            await coreRunner.processToFlatDastAsFragment(source),
        ).toMatchInlineSnapshot(`"<p>Pick one <em>no</em></p>"`);
    });

    it("the label of a choice input that is not inline heads its list", async () => {
        // Where the list stands on its own, the label is a paragraph of its own above it.
        source = `<problem><choiceInput><label>Which <em>one</em>?</label><choice>A</choice><choice>B</choice></choiceInput></problem>`;
        expect(await coreRunner.processToFlatDastAsFragment(source)).toContain(
            `<p>Which <em>one</em>? </p><ol><li>◯ A</li><li>◯ B</li></ol>`,
        );

        // Inside a paragraph, it is written into that paragraph.
        source = `<p>First: <choiceInput><label>Which?</label><choice>A</choice><choice>B</choice></choiceInput></p>`;
        expect(
            await coreRunner.processToFlatDastAsFragment(source),
        ).toMatchInlineSnapshot(
            `"<p>First: Which? <ol><li>◯ A</li><li>◯ B</li></ol></p>"`,
        );

        // A list item holds blocks of its own, even in a list inside a paragraph.
        source = `<p>Questions: <ol><li>Which? <choiceInput><label>L</label><choice>A</choice><choice>B</choice></choiceInput></li></ol></p>`;
        expect(await coreRunner.processToFlatDastAsFragment(source)).toContain(
            `<p>Which?</p><p>L </p><ol><li>◯ A</li><li>◯ B</li></ol>`,
        );

        // A label it inherits from its answer is printed once, by the answer.
        source = `<p><answer><label>Pick</label><choiceInput><choice>A</choice><choice>B</choice></choiceInput></answer></p>`;
        const exported = await coreRunner.processToFlatDastAsFragment(source);
        expect(exported.match(/Pick/g)).toHaveLength(1);
    });

    it("a label keeps its markup", async () => {
        // The label is printed from the `<label>` element, not the `label` string, which
        // has only the text.
        source = `<p><textInput><label>Keep <delete>A</delete> <insert>B</insert> <em>C</em></label></textInput></p>`;
        expect(await coreRunner.processToFlatDastAsFragment(source)).toContain(
            `<p>Keep <delete>A</delete> <insert>B</insert> <em>C</em> <fillin`,
        );

        source = `<p><choiceInput inline preselectChoice="2"><label>Pick <em>one</em></label><choice>yes</choice><choice>no</choice></choiceInput></p>`;
        expect(await coreRunner.processToFlatDastAsFragment(source)).toContain(
            `<p>Pick <em>one</em> <em>no</em></p>`,
        );

        // A label written on its own
        source = `<p><label>Before <delete>gone</delete> </label></p>`;
        expect(await coreRunner.processToFlatDastAsFragment(source)).toContain(
            `<p>Before <delete>gone</delete></p>`,
        );
    });

    it("a label copied from another prints a lone \\( or \\) as written", async () => {
        // A label with no children of its own has only its string to print.
        source = `<textInput name="t"><label>a \\) b</label></textInput><p>$t.label</p><p><label extend="$t.label"/></p>`;
        expect(await coreRunner.processToFlatDastAsFragment(source)).toContain(
            `<p>a \\) b</p><p>a \\) b</p>`,
        );
    });

    it("an answer's label keeps its markup and is printed once", async () => {
        source = `<p><answer><label>Enter <delete>y</delete> <m>x</m>:</label>x</answer></p>`;
        const exported = await coreRunner.processToFlatDastAsFragment(source);
        expect(exported).toContain(
            `<p>Enter <delete>y</delete> <m>x</m>: <m><fillin`,
        );
        expect(exported.match(/<delete>/g)).toHaveLength(1);
    });

    it("the label left in place of an expanded input keeps its markup", async () => {
        source = `<textInput expanded height="0.5in"><label>Your <em>full</em> name:</label></textInput>`;
        expect(await coreRunner.processToFlatDastAsFragment(source)).toContain(
            `<p workspace="0.5in">Your <em>full</em> name: </p>`,
        );

        source = `<answer type="text" handGraded expanded><label>Explain <delete>why</delete></label></answer>`;
        const exported = await coreRunner.processToFlatDastAsFragment(source);
        expect(exported).toContain(
            `<p workspace="1.25in">Explain <delete>why</delete> </p>`,
        );
        expect(exported.match(/<delete>/g)).toHaveLength(1);
    });

    it("a label that comes from no `<label>` is printed from its string", async () => {
        source = `<p><textInput name="yourName" labelIsName /></p>`;
        expect(await coreRunner.processToFlatDastAsFragment(source)).toContain(
            `<p>your name <fillin`,
        );
    });

    it("the label of a slider or a button is not written out", async () => {
        source = `<p><slider><label>Slide</label></slider> <updateValue target="$n" newValue="$n+1"><label>Add one</label></updateValue> <number name="n">1</number></p>`;
        const exported = await coreRunner.processToFlatDastAsFragment(source);
        expect(exported).not.toContain("Slide");
        expect(exported).not.toContain("Add one");
    });

    it("the math in a label written on the answer is written as <m>", async () => {
        // The answer draws the label its input inherited, so it is the answer that has to
        // write the math in it as `<m>`; left as text, the `\(` and `\)` print literally.
        source = `<p><answer><label>Value of <m>x</m>:</label>42</answer></p>`;
        expect(
            await coreRunner.processToFlatDastAsFragment(source),
        ).toMatchInlineSnapshot(
            `"<p>Value of <m>x</m>: <m><fillin characters="8"></fillin></m></p>"`,
        );
    });

    it("a text input given a share of the page gets the default blank", async () => {
        // A percentage says nothing about paper, so it gets the blank as long as a math one.
        source = `<p><textInput width="50%" /></p>`;
        expect(
            await coreRunner.processToFlatDastAsFragment(source),
        ).toMatchInlineSnapshot(`"<p><fillin characters="21"></fillin></p>"`);
    });

    it("a footnote exports as PreTeXt's <fn>", async () => {
        // PreTeXt spells a footnote `<fn>`. Left unmapped, `<footnote>` reaches the
        // fallback renderer, which emits a literal `<footnote>` that PreTeXt has no
        // template for — so the note's text runs on inside the citing sentence.
        source = `<p>Claim<footnote>The source.</footnote></p>`;
        expect(await coreRunner.processToFlatDastAsFragment(source)).toContain(
            `<p>Claim<fn>The source.</fn></p>`,
        );
    });

    it("textInput renders its label", async () => {
        // A text input drew its blank and nothing else, so a label written on one was
        // lost — including the question a stand-alone input asks.
        source = `<p>x <textInput><label>Your name:</label></textInput></p>`;
        expect(await coreRunner.processToFlatDastAsFragment(source)).toContain(
            `<p>x Your name: <fillin characters="21"></fillin></p>`,
        );
    });

    it("a label written on the answer is not repeated by its text input", async () => {
        source = `<p><answer type="text"><label>Your name:</label>Ada</answer></p>`;
        const exported = await coreRunner.processToFlatDastAsFragment(source);
        expect(exported.match(/Your name:/g)).toHaveLength(1);
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
        ).toMatchInlineSnapshot(`"Apple, Pear"`);
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

    it("spreadsheet column widths become <col> widths", async () => {
        // One `<col>` per drawn column: none for the hidden column C, an empty
        // one for the generated row-number column, and a percentage for each
        // column that has one. The pixel width of D has no PreTeXt spelling.
        // With the default row labels and a percentage width, 50px of an
        // assumed 600px page (8.33%) goes to the labels and 3.65% to LaTeX's
        // padding around each of the two columns with a width, and 30% and
        // 50% are shares of the rest. The A/B labels stay bare.
        source = `<spreadsheet minNumRows="1" minNumColumns="4" hiddenColumns="3">
  <col width="30%" />
  <col />
  <col width="10%" />
  <column colNum="B" width="50%" />
  <column colNum="D" width="80px" />
  <row><cell>a</cell></row>
</spreadsheet>`;
        expect(
            await coreRunner.processToFlatDastAsFragment(source),
        ).toMatchInlineSnapshot(
            `"<tabular><col></col><col width="25.31%"></col><col width="42.18%"></col><col></col><row header="yes" bottom="minor"><cell right="minor"><em></em></cell><cell right="minor">A</cell><cell right="minor">B</cell><cell right="minor">D</cell></row><row bottom="minor"><cell right="minor"><em>1</em></cell><cell right="minor"><p>a</p></cell><cell right="minor"><p></p></cell><cell right="minor"></cell></row></tabular>"`,
        );
    });

    it("spreadsheet column widths print as they are drawn", async () => {
        // On screen the percentages are shares of the width beside a 50px
        // row-label strip, padding included. In print LaTeX pads each column
        // outside its width (3.65% of the default line), so the columns
        // divide what is left after that and, on a 400px spreadsheet with
        // row labels, after the labels' 12.5%. Every cell of a column with a
        // width is a paragraph, which is what makes PreTeXt apply the width.
        source = `<spreadsheet minNumRows="1" minNumColumns="2" columnHeaders="false" rowHeaders="false">
  <col width="35%" />
  <col width="65%" />
  <row><cell>Candidates:</cell></row>
</spreadsheet>
<spreadsheet minNumRows="1" minNumColumns="2" columnHeaders="false" width="400px">
  <col width="40%" />
  <col width="60%" />
  <row><cell>Candidates:</cell></row>
</spreadsheet>`;
        expect(await coreRunner.processToFlatDastAsFragment(source))
            .toMatchInlineSnapshot(`
          "<tabular><col width="32.44%"></col><col width="60.25%"></col><row bottom="minor"><cell right="minor"><p>Candidates:</p></cell><cell right="minor"><p></p></cell></row></tabular>
          <tabular><col></col><col width="32.08%"></col><col width="48.12%"></col><row bottom="minor"><cell right="minor"><em>1</em></cell><cell right="minor"><p>Candidates:</p></cell><cell right="minor"><p></p></cell></row></tabular>"
        `);
    });

    it("spreadsheet row numbers get the room they need in print", async () => {
        // On a 1000px spreadsheet the 50px row-label strip is only 5%, less
        // than LaTeX needs for the number "10" and the padding around it, so
        // the row-number column gets what it needs instead.
        source = `<spreadsheet minNumRows="10" minNumColumns="2" columnHeaders="false" width="1000px">
  <col width="35%" />
  <col width="65%" />
</spreadsheet>`;
        const result = await coreRunner.processToFlatDastAsFragment(source);
        expect(result).toMatch(
            /^<tabular><col><\/col><col width="29.97%"><\/col><col width="55.67%"><\/col>/,
        );
    });

    it("spreadsheet widths over 100% are scaled to fit", async () => {
        // PreTeXt refuses a tabular whose `<col>` widths add up to over 100%.
        source = `<spreadsheet minNumRows="1" minNumColumns="3" columnHeaders="false">
  <col width="60%" />
  <col width="30%" />
  <col width="60%" />
  <row><cell>a</cell></row>
</spreadsheet>`;
        expect(
            await coreRunner.processToFlatDastAsFragment(source),
        ).toMatchInlineSnapshot(
            `"<tabular><col></col><col width="32.29%"></col><col width="16.14%"></col><col width="32.29%"></col><row bottom="minor"><cell right="minor"><em>1</em></cell><cell right="minor"><p>a</p></cell><cell right="minor"><p></p></cell><cell right="minor"><p></p></cell></row></tabular>"`,
        );
    });

    it("spreadsheet widths are dropped when padding alone fills the line", async () => {
        // Thirty columns with widths need 30 x 3.65% of the line for LaTeX's
        // padding alone, leaving the widths nothing; they are written as
        // plain columns rather than as zero or negative widths.
        source = `<spreadsheet minNumRows="1" minNumColumns="30" columnHeaders="false" rowHeaders="false">
  ${Array(30).fill('<col width="3%" />').join("")}
  <row><cell>a</cell></row>
</spreadsheet>`;
        const result = await coreRunner.processToFlatDastAsFragment(source);
        expect(result).not.toMatch(/width=/);
        expect(result).not.toMatch(/<p>/);
    });

    it("spreadsheet without a percentage width writes no <col>", async () => {
        source = `<spreadsheet minNumRows="1" minNumColumns="2" columnHeaders="false" rowHeaders="false">
  <col width="80px" />
  <row><cell>a</cell></row>
</spreadsheet>`;
        expect(
            await coreRunner.processToFlatDastAsFragment(source),
        ).toMatchInlineSnapshot(
            `"<tabular><row bottom="minor"><cell right="minor">a</cell><cell right="minor"></cell></row></tabular>"`,
        );
    });

    it("spreadsheet header row is emphasized", async () => {
        source = `<spreadsheet minNumRows="2" minNumColumns="2" columnHeaders="false" rowHeaders="false">
  <row header>
    <cell>name</cell>
    <cell>value</cell>
  </row>
  <row>
    <cell>a</cell>
    <cell>1</cell>
  </row>
</spreadsheet>`;
        expect(
            await coreRunner.processToFlatDastAsFragment(source),
        ).toMatchInlineSnapshot(
            `"<tabular><row header="yes" bottom="minor"><cell right="minor">name</cell><cell right="minor">value</cell></row><row bottom="minor"><cell right="minor">a</cell><cell right="minor">1</cell></row></tabular>"`,
        );
    });

    it("spreadsheet header row is emphasized only where it has cells", async () => {
        source = `<spreadsheet minNumRows="2" minNumColumns="3" columnHeaders="false" rowHeaders="false">
  <row header>
    <cell>name</cell>
  </row>
  <row>
    <cell>a</cell>
    <cell>1</cell>
  </row>
</spreadsheet>`;
        expect(
            await coreRunner.processToFlatDastAsFragment(source),
        ).toMatchInlineSnapshot(
            `"<tabular><row header="yes" bottom="minor"><cell right="minor">name</cell><cell right="minor"></cell><cell right="minor"></cell></row><row bottom="minor"><cell right="minor">a</cell><cell right="minor">1</cell><cell right="minor"></cell></row></tabular>"`,
        );
    });

    it("spreadsheet header row is emphasized under the generated row and column labels", async () => {
        // The default A/B/C strip and 1/2/3 column shift what each rendered
        // row and cell stands for, and a hidden column shifts it again, so the
        // emphasis has to be looked up by spreadsheet position, not by
        // position in the rendered table.
        source = `<spreadsheet minNumRows="3" minNumColumns="3" hiddenColumns="1">
  <row>
    <cell>x</cell>
    <cell>y</cell>
    <cell>z</cell>
  </row>
  <row header>
    <cell>name</cell>
    <cell>value</cell>
    <cell>note</cell>
  </row>
</spreadsheet>`;
        expect(
            await coreRunner.processToFlatDastAsFragment(source),
        ).toMatchInlineSnapshot(
            `"<tabular><row header="yes" bottom="minor"><cell right="minor"><em></em></cell><cell right="minor">B</cell><cell right="minor">C</cell></row><row bottom="minor"><cell right="minor"><em>1</em></cell><cell right="minor">y</cell><cell right="minor">z</cell></row><row header="yes" bottom="minor"><cell right="minor"><em>2</em></cell><cell right="minor">value</cell><cell right="minor">note</cell></row><row bottom="minor"><cell right="minor"><em>3</em></cell><cell right="minor"></cell><cell right="minor"></cell></row></tabular>"`,
        );
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

    it("does not export a title written in a cascade", async () => {
        // A cascade has no heading, so a `<title>` in one is not rendered
        // and has nowhere to go in the export either.
        source = `<cascade>
                    <title>Steps</title>
                    <section><p>hi</p></section>
                  </cascade>`;
        const result = await coreRunner.processToFlatDastAsFragment(source);
        expect(result).not.toContain("Steps");
        expect(result).toContain("<p>hi</p>");
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
    // The `<tabular>` output asserted below was checked against PreTeXt's own
    // RelaxNG schema (`.github/skills/pretext-authoring/docs/references/
    // pretext.rng`), wrapped in a `<paragraphs>` so the fragment had a legal
    // place to sit: every snapshot in this group validates. There is no
    // RelaxNG validator among this package's dependencies, so the check is a
    // manual one and any new attribute spelling here is worth re-running it
    // for. Two shapes do *not* validate, both from markup PreTeXt has no
    // reading of and both unchanged by these renderers: a `<tabular>` with no
    // `<row>`, and a `<row>` with no `<cell>`.
    it("<tabular> keeps its borders and alignment, in PreTeXt's spelling", async () => {
        source = `<tabular halign="end" topBorder="major" startBorder="minor" bottomBorder="medium" endBorder="minor">
  <row header valign="top" bottomBorder="major">
    <cell>Name</cell>
    <cell halign="center" endBorder="medium">Value</cell>
  </row>
  <row startBorder="major">
    <cell colSpan="2">everything</cell>
  </row>
</tabular>`;
        expect(
            await coreRunner.processToFlatDastAsFragment(source),
        ).toMatchInlineSnapshot(
            `"<tabular halign="right" top="major" bottom="medium" left="minor" right="minor"><row header="yes" valign="top" bottom="major"><cell>Name</cell><cell halign="center" right="medium">Value</cell></row><row left="major"><cell colspan="2">everything</cell></row></tabular>"`,
        );
    });

    it("<col> is written back out ahead of the rows", async () => {
        source = `<tabular>
  <col width="25%" topBorder="major" />
  <col width="15%" halign="end" endBorder="minor" />
  <row>
    <cell>Pennsylvania</cell>
    <cell>19</cell>
    <cell>Rust Belt</cell>
  </row>
</tabular>`;
        expect(
            await coreRunner.processToFlatDastAsFragment(source),
        ).toMatchInlineSnapshot(
            `"<tabular><col width="23.17%" top="major"></col><col width="13.9%" halign="right" right="minor"></col><col></col><row><cell><p>Pennsylvania</p></cell><cell><p>19</p></cell><cell>Rust Belt</cell></row></tabular>"`,
        );
    });

    it("tabular cells in columns with widths print as paragraphs", async () => {
        // A cell spanning a column with no width stays bare, since PreTeXt
        // would count that column as 20%; a cell that already holds a
        // paragraph, directly or through a `<div>`, is left as it is.
        source = `<tabular>
  <col width="30%" />
  <col width="70%" />
  <col />
  <row><cell>a</cell><cell><p>b</p></cell><cell>c</cell></row>
  <row><cell colSpan="2">ab</cell><cell>c</cell></row>
  <row><cell>a</cell><cell colSpan="2">bc</cell></row>
  <row><cell><div><p>a</p></div></cell><cell>b</cell><cell>c</cell></row>
</tabular>`;
        expect(
            await coreRunner.processToFlatDastAsFragment(source),
        ).toMatchInlineSnapshot(
            `"<tabular><col width="27.81%"></col><col width="64.89%"></col><col></col><row><cell><p>a</p></cell><cell><p>b</p></cell><cell>c</cell></row><row><cell colspan="2"><p>ab</p></cell><cell>c</cell></row><row><cell><p>a</p></cell><cell colspan="2">bc</cell></row><row><cell><p>a</p></cell><cell><p>b</p></cell><cell>c</cell></row></tabular>"`,
        );
    });

    it("tabular column widths are rescaled for padding and to fit", async () => {
        // In a half-width tabular the padding is twice the share of the box;
        // widths over 100% are scaled down, as PreTeXt refuses them. In a
        // tenth-width tabular the padding of three columns alone fills the
        // box, so the widths are dropped and the cells left bare.
        source = `<tabular width="50%">
  <col width="50%" />
  <col width="50%" />
  <row><cell>a</cell><cell>b</cell></row>
</tabular>
<tabular>
  <col width="80%" />
  <col width="40%" />
  <row><cell>a</cell><cell>b</cell></row>
</tabular>
<tabular width="10%">
  <col width="30%" />
  <col width="30%" />
  <col width="30%" />
  <row><cell>a</cell><cell>b</cell><cell>c</cell></row>
</tabular>`;
        expect(await coreRunner.processToFlatDastAsFragment(source))
            .toMatchInlineSnapshot(`
          "<tabular width="50%"><col width="42.7%"></col><col width="42.7%"></col><row><cell><p>a</p></cell><cell><p>b</p></cell></row></tabular>
          <tabular><col width="61.8%"></col><col width="30.9%"></col><row><cell><p>a</p></cell><cell><p>b</p></cell></row></tabular>
          <tabular width="10%"><col></col><col></col><col></col><row><cell>a</cell><cell>b</cell><cell>c</cell></row></tabular>"
        `);
    });

    it("a setting a cell only inherited is written once, on the element that set it", async () => {
        source = `<tabular halign="center">
  <col halign="end" />
  <row>
    <cell>a</cell>
    <cell>b</cell>
  </row>
</tabular>`;
        // Neither cell repeats an alignment: the first takes "right" from its
        // `<col>` and the second "center" from the `<tabular>`, and both are
        // already written on those.
        expect(
            await coreRunner.processToFlatDastAsFragment(source),
        ).toMatchInlineSnapshot(
            `"<tabular halign="center"><col halign="right"></col><col></col><row><cell>a</cell><cell>b</cell></row></tabular>"`,
        );
    });

    it("a spanning cell's trailing border comes from the last column it covers", async () => {
        source = `<tabular>
  <col halign="center" endBorder="minor" />
  <col halign="end" endBorder="major" />
  <row>
    <cell colSpan="2">A</cell>
  </row>
</tabular>`;
        // The cell's right edge falls at the right of the second column, so
        // `right="major"` is what it already inherits and nothing is repeated
        // on the cell; its alignment comes from the first column it covers.
        expect(
            await coreRunner.processToFlatDastAsFragment(source),
        ).toMatchInlineSnapshot(
            `"<tabular><col halign="center" right="minor"></col><col halign="right" right="major"></col><row><cell colspan="2">A</cell></row></tabular>"`,
        );
    });

    it("a colSpan that is not a genuine span is not written out", async () => {
        // Each of these occupies exactly one column, in the worker and in
        // HTML alike, so writing `colspan="0"` out would describe a span
        // nothing else in the document agrees with. PreTeXt's schema does
        // not catch it — `colspan` is declared there with no datatype.
        source = `<tabular>
  <row>
    <cell colSpan="0">a</cell>
    <cell colSpan="-2">b</cell>
    <cell colSpan="x">c</cell>
    <cell colSpan="2">d</cell>
  </row>
</tabular>`;
        expect(
            await coreRunner.processToFlatDastAsFragment(source),
        ).toMatchInlineSnapshot(
            `"<tabular><row><cell>a</cell><cell>b</cell><cell>c</cell><cell colspan="2">d</cell></row></tabular>"`,
        );
    });

    it("a runaway colSpan is written out clamped, not verbatim", async () => {
        // The worker stops counting columns at 1000, so the table it
        // describes has 1001 columns; writing `colspan="2000000"` into it
        // would contradict the `<col>` list written alongside.
        source = `<tabular>
  <col halign="end" />
  <row>
    <cell colSpan="2000000">a</cell>
    <cell>b</cell>
  </row>
</tabular>`;
        const fragment = await coreRunner.processToFlatDastAsFragment(source);
        expect(fragment).toContain(`<cell colspan="1000">a</cell>`);
        expect(fragment.match(/<col>|<col /g)?.length).eq(1001);
    });

    it("only a width PreTeXt can express crosses over", async () => {
        // A percentage is written out; the 100% a `<tabular>` defaults to is
        // what PreTeXt assumes anyway; and PreTeXt has neither an absolute
        // width nor a height for a tabular, so those are dropped.
        expect(
            await coreRunner.processToFlatDastAsFragment(
                `<tabular width="50%"><row><cell>a</cell></row></tabular>`,
            ),
        ).toMatchInlineSnapshot(
            `"<tabular width="50%"><row><cell>a</cell></row></tabular>"`,
        );
        expect(
            await coreRunner.processToFlatDastAsFragment(
                `<tabular><row><cell>a</cell></row></tabular>`,
            ),
        ).toMatchInlineSnapshot(
            `"<tabular><row><cell>a</cell></row></tabular>"`,
        );
        expect(
            await coreRunner.processToFlatDastAsFragment(
                `<tabular width="120px" height="200px"><row><cell>a</cell></row></tabular>`,
            ),
        ).toMatchInlineSnapshot(
            `"<tabular><row><cell>a</cell></row></tabular>"`,
        );
    });

    it("a cell with no children still exports its text", async () => {
        // `<cell prefill>` sets the cell's content without giving it a child,
        // so the fallback to the cell's `text` is what carries it across.
        source = `<tabular>
  <row>
    <cell prefill="hi" />
    <cell />
  </row>
</tabular>`;
        expect(
            await coreRunner.processToFlatDastAsFragment(source),
        ).toMatchInlineSnapshot(
            `"<tabular><row><cell>hi</cell><cell></cell></row></tabular>"`,
        );
    });
});
