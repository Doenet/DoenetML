import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import { updateMathInputValue } from "../utils/actions";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

describe("lorem tag tests", async () => {
    it("paragraphs, sentences, and words", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <section name="paragraphs">
    <title>Paragraphs</title>
  
    <p>Number of paragraphs: <mathInput name="numPars" prefill="3" /></p>
    
    <lorem name="lPars" generateParagraphs="$numPars"/>
  </section>
  
  <section name="sentences">
    <title>Sentences</title>
    
    <p>Number of sentences: <mathInput name="numSens" prefill="3" /></p>
  
    <p><lorem name="lSens" generateSentences="$numSens"/></p>
  
  </section>
  
  <section name="words">
    <title>Words</title>
    
    <p>Number of words: <mathInput name="numWords" prefill="3" /></p>
  
    <p><lorem name="lWords" generateWords="$numWords"/></p>
  </section>

  <p>
   <number extend="$words.numWords.value" name="numWords" />
  </p>
  `,
        });

        // TODO: not entirely sure what this is checking now we converted away from namespaces

        async function check_items(nParagraphs, nSentences, nWords) {
            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );

            expect(
                stateVariables[await resolvePathToNodeIdx("paragraphs.lPars")]
                    .replacements!.length,
            ).eq(nParagraphs);
            expect(
                stateVariables[await resolvePathToNodeIdx("sentences.lSens")]
                    .replacements!.length,
            ).eq(2 * nSentences - 1);
            expect(
                stateVariables[await resolvePathToNodeIdx("words.lWords")]
                    .replacements!.length,
            ).eq(2 * nWords - 1);

            for (let [ind, repl] of stateVariables[
                await resolvePathToNodeIdx("paragraphs.lPars")
            ].replacements!.entries()) {
                expect(
                    stateVariables[
                        await resolvePathToNodeIdx(`lPars[${ind + 1}]`)
                    ].stateValues.text,
                ).eq(stateVariables[repl.componentIdx].activeChildren[0]);
            }

            for (let [ind, repl] of stateVariables[
                await resolvePathToNodeIdx("sentences.lSens")
            ].replacements!.entries()) {
                if (ind % 2 === 1) {
                    continue;
                }

                expect(
                    stateVariables[
                        await resolvePathToNodeIdx(`lSens[${ind / 2 + 1}]`)
                    ].stateValues.text,
                ).eq(stateVariables[repl.componentIdx].activeChildren[0]);
            }

            for (let [ind, repl] of stateVariables[
                await resolvePathToNodeIdx("words.lWords")
            ].replacements!.entries()) {
                if (ind % 2 === 1) {
                    continue;
                }

                expect(
                    stateVariables[
                        await resolvePathToNodeIdx(`lWords[${ind / 2 + 1}]`)
                    ].stateValues.text,
                ).eq(stateVariables[repl.componentIdx].activeChildren[0]);
            }
            return stateVariables;
        }

        let names = ["a", "b", "c", "d", "e", "f"];

        let nParagraphs = 3,
            nSentences = 3,
            nWords = 3;

        await check_items(nParagraphs, nSentences, nWords);

        nParagraphs = 6;
        nSentences = 2;
        nWords = 5;

        await updateMathInputValue({
            latex: `${nParagraphs}`,
            componentIdx: await resolvePathToNodeIdx("paragraphs.numPars"),
            core,
        });
        await updateMathInputValue({
            latex: `${nSentences}`,
            componentIdx: await resolvePathToNodeIdx("sentences.numSens"),
            core,
        });
        await updateMathInputValue({
            latex: `${nWords}`,
            componentIdx: await resolvePathToNodeIdx("words.numWords"),
            core,
        });

        await check_items(nParagraphs, nSentences, nWords);
    });

    it("changes only with variant", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <lorem name="lPars" generateParagraphs="1" />
  <selectFromSequence from="1" to="2" name="s" />
  `,
            requestedVariantIndex: 1,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        const n1 =
            stateVariables[await resolvePathToNodeIdx("s[1]")].stateValues
                .value;

        expect(
            stateVariables[await resolvePathToNodeIdx("lPars")].replacements!
                .length,
        ).eq(1);

        const paragraph1 =
            stateVariables[
                stateVariables[await resolvePathToNodeIdx("lPars")]
                    .replacements![0].componentIdx
            ].activeChildren[0];

        expect(
            stateVariables[await resolvePathToNodeIdx("lPars[1]")].stateValues
                .text,
        ).eq(paragraph1);

        ({ core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <lorem name="lPars" generateParagraphs="1"  />
  <selectFromSequence from="1" to="2" name="s" />
  `,
            requestedVariantIndex: 1,
        }));

        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("s[1]")].stateValues
                .value,
        ).eq(n1);
        expect(
            stateVariables[await resolvePathToNodeIdx("lPars")].replacements!
                .length,
        ).eq(1);

        expect(
            stateVariables[
                stateVariables[await resolvePathToNodeIdx("lPars")]
                    .replacements![0].componentIdx
            ].activeChildren[0],
        ).eq(paragraph1);

        expect(
            stateVariables[await resolvePathToNodeIdx("lPars[1]")].stateValues
                .text,
        ).eq(paragraph1);

        ({ core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <lorem name="lPars" generateParagraphs="1"  />
  <selectFromSequence from="1" to="2" name="s" />
  `,
            requestedVariantIndex: 2,
        }));

        stateVariables = await core.returnAllStateVariables(false, true);

        const n2 =
            stateVariables[await resolvePathToNodeIdx("s[1]")].stateValues
                .value;
        expect(n2).eq(3 - n1);
        expect(
            stateVariables[await resolvePathToNodeIdx("lPars")].replacements!
                .length,
        ).eq(1);

        const paragraph2 =
            stateVariables[
                stateVariables[await resolvePathToNodeIdx("lPars")]
                    .replacements![0].componentIdx
            ].activeChildren[0];
        expect(paragraph2).not.eq(paragraph1);

        expect(
            stateVariables[await resolvePathToNodeIdx("lPars[1]")].stateValues
                .text,
        ).eq(paragraph2);

        ({ core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <text>d</text>
  <lorem name="lPars" generateParagraphs="1" />
  <selectFromSequence from="1" to="2" name="s" />
  `,
            requestedVariantIndex: 2,
        }));

        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("s[1]")].stateValues
                .value,
        ).eq(n2);
        expect(
            stateVariables[await resolvePathToNodeIdx("lPars")].replacements!
                .length,
        ).eq(1);

        expect(
            stateVariables[
                stateVariables[await resolvePathToNodeIdx("lPars")]
                    .replacements![0].componentIdx
            ].activeChildren[0],
        ).eq(paragraph2);

        expect(
            stateVariables[await resolvePathToNodeIdx("lPars[1]")].stateValues
                .text,
        ).eq(paragraph2);
    });
});
