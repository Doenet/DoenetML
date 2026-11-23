import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import { updateMathInputValue } from "../utils/actions";
import { componentOrListEntry } from "../utils/list-entries";
import { getDiagnosticsByType } from "../utils/diagnostics";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

describe("lorem tag tests @group2", async () => {
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
                    (
                        await componentOrListEntry(
                            core,
                            stateVariables,
                            resolvePathToNodeIdx,
                            `lPars[${ind + 1}]`,
                        )
                    ).stateValues.text,
                ).eq(stateVariables[repl.componentIdx].activeChildren[0]);
            }

            for (let [ind, repl] of stateVariables[
                await resolvePathToNodeIdx("sentences.lSens")
            ].replacements!.entries()) {
                if (ind % 2 === 1) {
                    continue;
                }

                expect(
                    (
                        await componentOrListEntry(
                            core,
                            stateVariables,
                            resolvePathToNodeIdx,
                            `lSens[${ind / 2 + 1}]`,
                        )
                    ).stateValues.text,
                ).eq(stateVariables[repl.componentIdx].activeChildren[0]);
            }

            for (let [ind, repl] of stateVariables[
                await resolvePathToNodeIdx("words.lWords")
            ].replacements!.entries()) {
                if (ind % 2 === 1) {
                    continue;
                }

                expect(
                    (
                        await componentOrListEntry(
                            core,
                            stateVariables,
                            resolvePathToNodeIdx,
                            `lWords[${ind / 2 + 1}]`,
                        )
                    ).stateValues.text,
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

        const n1 = (
            await componentOrListEntry(
                core,
                stateVariables,
                resolvePathToNodeIdx,
                "s[1]",
            )
        ).stateValues.value;

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
            (
                await componentOrListEntry(
                    core,
                    stateVariables,
                    resolvePathToNodeIdx,
                    "lPars[1]",
                )
            ).stateValues.text,
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
            (
                await componentOrListEntry(
                    core,
                    stateVariables,
                    resolvePathToNodeIdx,
                    "s[1]",
                )
            ).stateValues.value,
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
            (
                await componentOrListEntry(
                    core,
                    stateVariables,
                    resolvePathToNodeIdx,
                    "lPars[1]",
                )
            ).stateValues.text,
        ).eq(paragraph1);

        ({ core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <lorem name="lPars" generateParagraphs="1"  />
  <selectFromSequence from="1" to="2" name="s" />
  `,
            requestedVariantIndex: 2,
        }));

        stateVariables = await core.returnAllStateVariables(false, true);

        const n2 = (
            await componentOrListEntry(
                core,
                stateVariables,
                resolvePathToNodeIdx,
                "s[1]",
            )
        ).stateValues.value;
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
            (
                await componentOrListEntry(
                    core,
                    stateVariables,
                    resolvePathToNodeIdx,
                    "lPars[1]",
                )
            ).stateValues.text,
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
            (
                await componentOrListEntry(
                    core,
                    stateVariables,
                    resolvePathToNodeIdx,
                    "s[1]",
                )
            ).stateValues.value,
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
            (
                await componentOrListEntry(
                    core,
                    stateVariables,
                    resolvePathToNodeIdx,
                    "lPars[1]",
                )
            ).stateValues.text,
        ).eq(paragraph2);
    });

    // A parameter read from the number of a section was a false circular
    // dependency, wherever the section was (#2623 item 3): the paragraphs
    // were made again, with new random text, whenever the parameter was
    // marked stale, and replacing them marked it stale again.
    describe("a parameter read from a section's number", () => {
        async function paragraphs(doenetML: string) {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML,
            });
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            const { errors, warnings } = getDiagnosticsByType(core);
            return {
                errors,
                warnings,
                count: stateVariables[await resolvePathToNodeIdx("l")]
                    .replacements!.length,
            };
        }

        for (const property of ["sectionNumber", "ownNumber"]) {
            it(`$s.${property} after the section`, async () => {
                const { errors, warnings, count } = await paragraphs(`
<section/>
<section name="s"/>
<lorem name="l" generateParagraphs="$s.${property}"/>
`);
                expect(errors).eqls([]);
                expect(warnings).eqls([]);
                expect(count).eq(2);
            });

            it(`$s.${property} before the section`, async () => {
                const { errors, warnings, count } = await paragraphs(`
<lorem name="l" generateParagraphs="$s.${property}"/>
<section/>
<section/>
<section name="s"/>
`);
                expect(errors).eqls([]);
                expect(warnings).eqls([]);
                expect(count).eq(3);
            });
        }

        it("words and sentences too, and through a number", async () => {
            for (const doenetML of [
                `<section name="s"/><p><lorem name="l" generateWords="$s.sectionNumber"/></p>`,
                `<section name="s"/><p><lorem name="l" generateSentences="$s.sectionNumber"/></p>`,
                `<section name="s"/><number name="n">$s.sectionNumber</number><lorem name="l" generateParagraphs="$n"/>`,
                `<section name="s"/><lorem name="l" generateParagraphs="$s.title"/>`,
            ]) {
                const { errors } = await paragraphs(doenetML);
                expect(errors, doenetML).eqls([]);
            }
        });
    });

    it("the text is kept until a parameter changes", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<mathInput name="n" prefill="2" />
<lorem name="l" generateParagraphs="$n"/>
`,
        });
        async function texts() {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            return stateVariables[
                await resolvePathToNodeIdx("l")
            ].replacements!.map(
                (replacement) =>
                    stateVariables[replacement.componentIdx].activeChildren[0],
            );
        }
        const before = await texts();
        expect(before.length).eq(2);

        // the same value entered again: the same paragraphs
        await updateMathInputValue({
            latex: "2",
            componentIdx: await resolvePathToNodeIdx("n"),
            core,
        });
        expect(await texts()).eqls(before);

        // a new value: new paragraphs
        await updateMathInputValue({
            latex: "3",
            componentIdx: await resolvePathToNodeIdx("n"),
            core,
        });
        expect((await texts()).length).eq(3);
    });
});
