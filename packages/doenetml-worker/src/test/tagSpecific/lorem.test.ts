import { describe, expect, it, vi } from "vitest";
import { createTestCore, returnAllStateVariables } from "../utils/test-core";
import { updateMathInputValue } from "../utils/actions";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);

describe("lorem tag tests", async () => {
    it("paragraphs, sentences, and words", async () => {
        let core = await createTestCore({
            doenetML: `
  <section name="paragraphs" newNamespace>
    <title>Paragraphs</title>
  
    <p>Number of paragraphs: <mathinput name="numPars" prefill="3" /></p>
    
    <lorem name="lPars" generateParagraphs="$numPars" assignNames="a b c d e f g" />
  </section>
  
  <section name="sentences" newNamespace>
    <title>Sentences</title>
    
    <p>Number of sentences: <mathinput name="numSens" prefill="3" /></p>
  
    <p><lorem name="lSens" generateSentences="$numSens" assignNames="a b c d e f g" /></p>
  
  </section>
  
  <section name="words" newNamespace>
    <title>Words</title>
    
    <p>Number of words: <mathinput name="numWords" prefill="3" /></p>
  
    <p><lorem name="lWords" generateWords="$numWords" assignNames="a b c d e f g" /></p>
  </section>

  <p>
    $(words/numWords.value{assignNames="numWords"})
  </p>
  `,
        });

        let names = ["a", "b", "c", "d", "e", "f"];

        let stateVariables = await returnAllStateVariables(core);

        let nParagraphs = 3,
            nSentences = 3,
            nWords = 3;

        expect(stateVariables["/paragraphs/lPars"].replacements!.length).eq(
            nParagraphs,
        );
        expect(stateVariables["/sentences/lSens"].replacements!.length).eq(
            2 * nSentences - 1,
        );
        expect(stateVariables["/words/lWords"].replacements!.length).eq(
            2 * nWords - 1,
        );

        for (let [ind, repl] of stateVariables[
            "/paragraphs/lPars"
        ].replacements!.entries()) {
            expect(
                stateVariables[`/paragraphs/${names[ind]}`].stateValues.text,
            ).eq(stateVariables[repl.componentName].activeChildren[0]);
        }

        for (let [ind, repl] of stateVariables[
            "/sentences/lSens"
        ].replacements!.entries()) {
            if (ind % 2 === 1) {
                continue;
            }

            expect(
                stateVariables[`/sentences/${names[ind / 2]}`].stateValues.text,
            ).eq(stateVariables[repl.componentName].activeChildren[0]);
        }

        for (let [ind, repl] of stateVariables[
            "/words/lWords"
        ].replacements!.entries()) {
            if (ind % 2 === 1) {
                continue;
            }

            expect(
                stateVariables[`/words/${names[ind / 2]}`].stateValues.text,
            ).eq(stateVariables[repl.componentName].activeChildren[0]);
        }

        nParagraphs = 6;
        nSentences = 2;
        nWords = 5;

        await updateMathInputValue({
            latex: `${nParagraphs}`,
            name: "/paragraphs/numPars",
            core,
        });
        await updateMathInputValue({
            latex: `${nSentences}`,
            name: "/sentences/numSens",
            core,
        });
        await updateMathInputValue({
            latex: `${nWords}`,
            name: "/words/numWords",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/paragraphs/lPars"].replacements!.length).eq(
            nParagraphs,
        );
        expect(stateVariables["/sentences/lSens"].replacements!.length).eq(
            2 * nSentences - 1,
        );
        expect(stateVariables["/words/lWords"].replacements!.length).eq(
            2 * nWords - 1,
        );

        for (let [ind, repl] of stateVariables[
            "/paragraphs/lPars"
        ].replacements!.entries()) {
            expect(
                stateVariables[`/paragraphs/${names[ind]}`].stateValues.text,
            ).eq(stateVariables[repl.componentName].activeChildren[0]);
        }

        for (let [ind, repl] of stateVariables[
            "/sentences/lSens"
        ].replacements!.entries()) {
            if (ind % 2 === 1) {
                continue;
            }

            expect(
                stateVariables[`/sentences/${names[ind / 2]}`].stateValues.text,
            ).eq(stateVariables[repl.componentName].activeChildren[0]);
        }

        for (let [ind, repl] of stateVariables[
            "/words/lWords"
        ].replacements!.entries()) {
            if (ind % 2 === 1) {
                continue;
            }

            expect(
                stateVariables[`/words/${names[ind / 2]}`].stateValues.text,
            ).eq(stateVariables[repl.componentName].activeChildren[0]);
        }
    });

    it("changes only with variant", async () => {
        let core = await createTestCore({
            doenetML: `
  <lorem name="lPars" generateParagraphs="1" assignNames="a" />
  <selectFromSequence from="1" to="2" assignNames="n" />
  `,
            requestedVariantIndex: 1,
        });

        let stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/n"].stateValues.value).eq(1);
        expect(stateVariables["/lPars"].replacements!.length).eq(1);

        let paragraph0 =
            stateVariables[
                stateVariables["/lPars"].replacements![0].componentName
            ].activeChildren[0];

        expect(stateVariables["/a"].stateValues.text).eq(paragraph0);

        core = await createTestCore({
            doenetML: `
  <lorem name="lPars" generateParagraphs="1" assignNames="a" />
  <selectFromSequence from="1" to="2" assignNames="n" />
  `,
            requestedVariantIndex: 1,
        });

        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/n"].stateValues.value).eq(1);
        expect(stateVariables["/lPars"].replacements!.length).eq(1);

        expect(
            stateVariables[
                stateVariables["/lPars"].replacements![0].componentName
            ].activeChildren[0],
        ).eq(paragraph0);

        expect(stateVariables["/a"].stateValues.text).eq(paragraph0);

        core = await createTestCore({
            doenetML: `
  <lorem name="lPars" generateParagraphs="1" assignNames="a" />
  <selectFromSequence from="1" to="2" assignNames="n" />
  `,
            requestedVariantIndex: 2,
        });

        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/n"].stateValues.value).eq(2);
        expect(stateVariables["/lPars"].replacements!.length).eq(1);

        let paragraph1 =
            stateVariables[
                stateVariables["/lPars"].replacements![0].componentName
            ].activeChildren[0];
        expect(paragraph1).not.eq(paragraph0);

        expect(stateVariables["/a"].stateValues.text).eq(paragraph1);

        core = await createTestCore({
            doenetML: `
  <text>d</text>
  <lorem name="lPars" generateParagraphs="1" assignNames="a" />
  <selectFromSequence from="1" to="2" assignNames="n" />
  `,
            requestedVariantIndex: 2,
        });

        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/n"].stateValues.value).eq(2);
        expect(stateVariables["/lPars"].replacements!.length).eq(1);

        expect(
            stateVariables[
                stateVariables["/lPars"].replacements![0].componentName
            ].activeChildren[0],
        ).eq(paragraph1);

        expect(stateVariables["/a"].stateValues.text).eq(paragraph1);
    });
});
