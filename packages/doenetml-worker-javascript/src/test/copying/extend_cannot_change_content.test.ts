import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import { getDiagnosticsByType } from "../utils/diagnostics";
import { updateMathInputValue, updateSelectedIndices } from "../utils/actions";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

/**
 * An `extend` is the same component again: it shares its source's content
 * and state. It can have its own name and look different, but it cannot
 * change what the component makes or what its state can hold. Trying to is
 * an error, located on the extend, which shows the error in place of the
 * content while the rest of the document renders (D32, #2404).
 */
describe("An extend cannot change what a tag makes @group4", () => {
    /**
     * Each tag whose content is made rather than written, with a source named
     * `x` and the text it shows. A `<p name="after">` follows, so that each
     * test can check that the rest of the document renders.
     */
    const SOURCES: Record<string, { doenetML: string; text: string }> = {
        repeat: {
            doenetML: `<repeat name="x" for="1 2" valueName="v"><text name="y">a$v</text></repeat>`,
            text: "a1, a2",
        },
        repeatForSequence: {
            doenetML: `<repeatForSequence name="x" from="1" to="2" valueName="v"><text name="y">a$v</text></repeatForSequence>`,
            text: "a1, a2",
        },
        select: {
            doenetML: `<select name="x"><option><text name="y">a</text></option></select>`,
            text: "a",
        },
        selectFromSequence: {
            doenetML: `<selectFromSequence name="x" from="4" to="4" />`,
            text: "4",
        },
        shuffle: {
            doenetML: `<shuffle name="x"><text>a</text></shuffle>`,
            text: "a",
        },
        conditionalContent: {
            doenetML: `<conditionalContent name="x"><case condition="false"><text>b</text></case><else><text>a</text></else></conditionalContent>`,
            text: "a",
        },
        collect: {
            doenetML: `<group name="g" hide><text>a</text></group><collect name="x" componentType="text" from="$g" />`,
            text: "a",
        },
        sort: {
            doenetML: `<sort name="x"><number>2</number><number>1</number></sort>`,
            text: "1, 2",
        },
        sequence: {
            doenetML: `<sequence name="x" from="1" to="3" />`,
            text: "1, 2, 3",
        },
        substitute: {
            doenetML: `<substitute name="x" type="text" match="b" replacement="a">b</substitute>`,
            text: "a",
        },
        sortIndices: {
            doenetML: `<sortIndices name="x"><number>3</number><number>1</number><number>2</number></sortIndices>`,
            text: "2, 3, 1",
        },
        split: {
            doenetML: `<split name="x" splitBy="comma">a,b</split>`,
            text: "a, b",
        },
        intersection: {
            doenetML: `<intersection name="x"><line through="(0,0) (1,1)" /><line through="(0,1) (1,0)" /></intersection>`,
            text: "(0.5, 0.5)",
        },
    };

    async function textsOf(
        core: any,
        resolvePathToNodeIdx: any,
        names: string[],
    ) {
        const stateVariables = await core.returnAllStateVariables(false, true);
        const texts: string[] = [];
        for (const name of names) {
            texts.push(
                stateVariables[await resolvePathToNodeIdx(name)].stateValues
                    .text,
            );
        }
        return texts;
    }

    for (const [tag, { doenetML, text }] of Object.entries(SOURCES)) {
        it(`a bare, named and appearance-only extend of a <${tag}> show its content, as does a copy of the named one`, async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `<p name="p0">${doenetML}</p>
<p name="p1">$x</p>
<p name="p2"><${tag} extend="$x" /></p>
<p name="p3"><${tag} extend="$x" name="e" /></p>
<p name="p4"><${tag} extend="$x" hide="false" styleNumber="2" /></p>
<p name="p5"><${tag} copy="$e" /></p>
<p name="after">after</p>`,
            });

            const diagnosticsByType = getDiagnosticsByType(core);
            expect(diagnosticsByType.errors).eqls([]);
            expect(diagnosticsByType.warnings).eqls([]);

            expect(
                await textsOf(core, resolvePathToNodeIdx, [
                    "p0",
                    "p1",
                    "p2",
                    "p3",
                    "p4",
                    "p5",
                    "after",
                ]),
            ).eqls([text, text, text, text, text, text, "after"]);
        });
    }

    it("a display setting on an extend takes effect", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `<p name="p0"><sequence name="x" from="1.2345" to="2.2345" /></p>
<p name="p1"><sequence extend="$x" displayDigits="2" /></p>
<p name="p2"><selectFromSequence name="y" from="1.2345" to="1.2345" /></p>
<p name="p3"><selectFromSequence extend="$y" displayDecimals="1" /></p>`,
        });

        const diagnosticsByType = getDiagnosticsByType(core);
        expect(diagnosticsByType.errors).eqls([]);
        expect(diagnosticsByType.warnings).eqls([]);
        expect(
            await textsOf(core, resolvePathToNodeIdx, ["p0", "p1", "p2", "p3"]),
        ).eqls(["1.23, 2.23", "1.2, 2.2", "1.23", "1.2"]);
    });

    it("a named extend reaches what is inside it", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `${SOURCES.repeat.doenetML.replace('name="x"', 'name="r"')}
${SOURCES.select.doenetML.replace('name="x"', 'name="s"')}
<repeat extend="$r" name="er" />
<select extend="$s" name="es" />
<p name="p1">$er[2].y</p>
<p name="p2">$es.y</p>`,
        });

        expect(getDiagnosticsByType(core).errors).eqls([]);
        expect(await textsOf(core, resolvePathToNodeIdx, ["p1", "p2"])).eqls([
            "a2",
            "a",
        ]);
    });

    /**
     * Each attribute that decides what its tag makes, written on an extend.
     * The value is checked only for the error it gives.
     */
    const CONTENT_ATTRIBUTES: [string, string, string][] = [
        // repeating
        ["repeat", "for", "3 4"],
        ["repeat", "valueName", "w"],
        ["repeat", "indexName", "i"],
        ["repeatForSequence", "length", "3"],
        ["repeatForSequence", "from", "3"],
        ["repeatForSequence", "to", "3"],
        ["repeatForSequence", "step", "2"],
        // choosing at random
        ["select", "numToSelect", "2"],
        ["select", "withReplacement", "true"],
        ["selectFromSequence", "from", "1"],
        ["selectFromSequence", "exclude", "4"],
        // choosing by condition
        ["conditionalContent", "condition", "true"],
        // gathering
        ["collect", "componentType", "number"],
        ["collect", "from", "$x"],
        ["collect", "maxNumber", "1"],
        // generating
        ["sequence", "from", "2"],
        ["sequence", "to", "5"],
        ["sequence", "step", "2"],
        ["sequence", "length", "2"],
        ["sequence", "exclude", "2"],
        ["sequence", "type", "letters"],
        // computing
        ["substitute", "match", "c"],
        ["substitute", "replacement", "c"],
        ["substitute", "type", "math"],
        ["split", "splitBy", "character"],
        ["shuffle", "type", "math"],
        ["sortIndices", "sortByProp", "text"],
    ];

    for (const [tag, attribute, value] of CONTENT_ATTRIBUTES) {
        it(`\`${attribute}\` on an extend of a <${tag}> is an error`, async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `<p name="p0">${SOURCES[tag].doenetML}</p>
<p name="p1"><${tag} extend="$x" ${attribute}="${value}" /></p>
<p name="after">after</p>`,
            });

            const diagnosticsByType = getDiagnosticsByType(core);
            expect(diagnosticsByType.warnings).eqls([]);
            expect(
                diagnosticsByType.errors.map((error) => [
                    error.code,
                    error.message,
                    error.position?.start.line,
                ]),
            ).eqls([
                [
                    "doenet-e0056",
                    `A \`<${tag}>\` makes its content from \`${attribute}\`. An \`extend\` shows the same content as \`$x\`, so it can't change \`${attribute}\`. To show the content of \`$x\` again, remove \`${attribute}\`. To make a new \`<${tag}>\` with a different \`${attribute}\`, use \`copy\`.`,
                    2,
                ],
            ]);

            expect(
                await textsOf(core, resolvePathToNodeIdx, [
                    "p0",
                    "p1",
                    "after",
                ]),
            ).eqls([SOURCES[tag].text, "", "after"]);
        });
    }

    it("a distribution parameter or a number of samples on an extend of a <sampleRandomNumbers> is an error", async () => {
        const { core } = await createTestCore({
            doenetML: `<sampleRandomNumbers name="x" numSamples="2" mean="0" />
<p><sampleRandomNumbers extend="$x" numSamples="3" mean="5" /></p>`,
        });

        const diagnosticsByType = getDiagnosticsByType(core);
        expect(diagnosticsByType.warnings).eqls([]);
        expect(
            diagnosticsByType.errors.map((error) => error.args?.attribute),
        ).eqls(["numSamples", "mean"]);
    });

    const CHILDREN: [string, string, string][] = [
        [
            "repeat",
            "<text>b</text>",
            "Children written inside an `extend` of a `<repeat>` would be a new template, but an extend shows the same content as `$x`. To repeat a different template, use `copy`.",
        ],
        [
            "select",
            "<option><text>b</text></option>",
            "Children written inside an `extend` of a `<select>` would be new options, but an extend shows the same choice as `$x`. To choose from more options, use `copy`.",
        ],
        [
            "conditionalContent",
            "<case condition='true'><text>b</text></case>",
            "Children written inside an `extend` of a `<conditionalContent>` would be new cases, but an extend shows the same content as `$x`. To choose from other cases, use `copy`.",
        ],
        [
            "conditionalContent",
            "<text>b</text>",
            "Children written inside an `extend` of a `<conditionalContent>` would be new cases, but an extend shows the same content as `$x`. To choose from other cases, use `copy`.",
        ],
        [
            "shuffle",
            "<text>b</text>",
            "Children written inside an `extend` of a `<shuffle>` would be new inputs to what it makes, but an extend shows the same content as `$x`. To make a `<shuffle>` from different children, use `copy`.",
        ],
        [
            "sort",
            "<number>0</number>",
            "Children written inside an `extend` of a `<sort>` would be new inputs to what it makes, but an extend shows the same content as `$x`. To make a `<sort>` from different children, use `copy`.",
        ],
        [
            "sortIndices",
            "<number>0</number>",
            "Children written inside an `extend` of a `<sortIndices>` would be new inputs to what it makes, but an extend shows the same content as `$x`. To make a `<sortIndices>` from different children, use `copy`.",
        ],
        [
            "substitute",
            "c",
            "Children written inside an `extend` of a `<substitute>` would be new inputs to what it makes, but an extend shows the same content as `$x`. To make a `<substitute>` from different children, use `copy`.",
        ],
    ];

    for (const [tag, children, message] of CHILDREN) {
        it(`children ${children} written inside an extend of a <${tag}> are an error`, async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `<p name="p0">${SOURCES[tag].doenetML}</p>
<p name="p1"><${tag} extend="$x">${children}</${tag}></p>
<p name="after">after</p>`,
            });

            const diagnosticsByType = getDiagnosticsByType(core);
            expect(diagnosticsByType.warnings).eqls([]);
            expect(
                diagnosticsByType.errors.map((error) => [
                    error.code,
                    error.message,
                    error.position?.start.line,
                ]),
            ).eqls([["doenet-e0057", message, 2]]);

            expect(
                await textsOf(core, resolvePathToNodeIdx, [
                    "p0",
                    "p1",
                    "after",
                ]),
            ).eqls([SOURCES[tag].text, "", "after"]);
        });
    }

    it("children written inside an extend of an <intersection> are an error", async () => {
        const { core } = await createTestCore({
            doenetML: `<graph>
  <intersection name="x"><line through="(0,0) (1,1)" /><line through="(0,1) (1,0)" /></intersection>
  <intersection extend="$x"><line through="(0,0) (1,2)" /></intersection>
</graph>`,
        });

        const diagnosticsByType = getDiagnosticsByType(core);
        expect(diagnosticsByType.warnings).eqls([]);
        expect(diagnosticsByType.errors.map((error) => error.code)).eqls([
            "doenet-e0057",
        ]);
    });

    it("a written attribute and children are each reported, with one error shown", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `<p name="p0">${SOURCES.repeat.doenetML}</p>
<p name="p1"><repeat extend="$x" for="3" valueName="w"><text>$w</text></repeat></p>`,
        });

        const diagnosticsByType = getDiagnosticsByType(core);
        expect(diagnosticsByType.errors.map((error) => error.code)).eqls([
            "doenet-e0056",
            "doenet-e0056",
            "doenet-e0057",
        ]);
        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("p1")].activeChildren.map(
                (child: any) => child.componentType,
            ),
        ).eqls(["_error"]);
    });

    it("an extend stays an error as its source's content or its index changes", async () => {
        // The source's content changing remakes the extend's replacements,
        // which must still be the error alone, not made into the tag the
        // extend is written as.
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `<mathInput name="n" prefill="2" />
<p name="p0"><repeatForSequence name="x" length="$n" valueName="v"><text>a$v</text></repeatForSequence></p>
<p name="p1"><repeatForSequence extend="$x" length="3" /></p>
<p name="p2"><repeatForSequence extend="$x"><text>z</text></repeatForSequence></p>
<repeat name="r" for="1 2" valueName="v"><sequence from="1" to="$v" /></repeat>
<p name="p3"><sequence extend="$r[$n]" to="5" /></p>
<p name="after">after</p>`,
        });

        async function check(text: string) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            for (const name of ["p1", "p2", "p3"]) {
                expect(
                    stateVariables[
                        await resolvePathToNodeIdx(name)
                    ].activeChildren.map((child: any) => child.componentType),
                    name,
                ).eqls(["_error"]);
            }
            expect(
                await textsOf(core, resolvePathToNodeIdx, ["p0", "after"]),
            ).eqls([text, "after"]);
        }

        await check("a1, a2");

        await updateMathInputValue({
            latex: "1",
            componentIdx: await resolvePathToNodeIdx("n"),
            core,
        });
        await check("a1");

        await updateMathInputValue({
            latex: "2",
            componentIdx: await resolvePathToNodeIdx("n"),
            core,
        });
        await check("a1, a2");

        // `$r[$n]` is reported for each index it has been expanded with
        expect(
            getDiagnosticsByType(core).errors.map((error) => [
                error.code,
                error.args?.source,
            ]),
        ).eqls([
            ["doenet-e0056", "$x"],
            ["doenet-e0057", "$x"],
            ["doenet-e0056", "$r[2]"],
            ["doenet-e0056", "$r[1]"],
        ]);
    });

    it("an attribute given by a reference on an extend is reported once, with nothing about its value", async () => {
        const { core } = await createTestCore({
            doenetML: `<booleanInput name="b" /><mathInput name="n" prefill="2" />
${SOURCES.select.doenetML}
<p><select extend="$x" withReplacement="$b" numToSelect="$n" /></p>
${SOURCES.conditionalContent.doenetML.replace('name="x"', 'name="cc"')}
<p><conditionalContent extend="$cc" condition="$b" /></p>`,
        });

        const diagnosticsByType = getDiagnosticsByType(core);
        expect(
            diagnosticsByType.warnings.filter(
                (warning) => warning.type !== "accessibility",
            ),
        ).eqls([]);
        expect(
            diagnosticsByType.errors.map((error) => error.args?.attribute),
        ).eqls(["withReplacement", "numToSelect", "condition"]);
    });

    it("a module attribute on an extend of a <module> is an error, while the extend itself is not", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `<module name="m"><moduleAttributes><text name="item">a</text></moduleAttributes><p name="p">$item</p></module>
<module extend="$m" name="e" />
<module extend="$m" item="b" name="f" />
<p name="after">after</p>`,
        });

        const diagnosticsByType = getDiagnosticsByType(core);
        expect(diagnosticsByType.warnings).eqls([]);
        expect(
            diagnosticsByType.errors.map((error) => [
                error.code,
                error.message,
                error.position?.start.line,
            ]),
        ).eqls([
            [
                "doenet-e0060",
                "A `<module>` makes its content from its attributes. An `extend` shows the same content as `$m`, so it can't change `item`. To make the module with a different `item`, use `copy`.",
                3,
            ],
        ]);
        expect(
            await textsOf(core, resolvePathToNodeIdx, ["m.p", "e.p", "after"]),
        ).eqls(["a", "a", "after"]);
    });

    it("an attribute a <module> does not declare is ignored on its extend, as it is not a module attribute", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `<module name="m"><moduleAttributes><text name="item">a</text></moduleAttributes><p name="p">$item</p></module>
<module extend="$m" name="e" displayDigits="3" />
<module extend="$m" name="f" Item="b" />`,
        });

        const diagnosticsByType = getDiagnosticsByType(core);
        expect(
            diagnosticsByType.warnings.map((warning) => [
                warning.code,
                warning.position?.start.line,
            ]),
        ).eqls([["doenet-w0168", 2]]);
        // A module attribute is matched ignoring case, as a copy matches it
        expect(
            diagnosticsByType.errors.map((error) => [
                error.code,
                error.args?.attribute,
                error.position?.start.line,
            ]),
        ).eqls([["doenet-e0060", "Item", 3]]);
        expect(await textsOf(core, resolvePathToNodeIdx, ["e.p"])).eqls(["a"]);
    });

    it("a <group> or <module> extend can be given children, and a repeat inside an extended group is shown", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `<group name="g"><repeat for="1 2" valueName="v"><text>a$v</text></repeat></group>
<p name="p1"><group extend="$g" /></p>
<p name="p2"><group extend="$g"><text>b</text></group></p>
<module name="m"><text>c</text></module>
<p name="p3"><module extend="$m"><text>d</text></module></p>`,
        });

        const diagnosticsByType = getDiagnosticsByType(core);
        expect(diagnosticsByType.errors).eqls([]);
        expect(diagnosticsByType.warnings).eqls([]);
        expect(
            await textsOf(core, resolvePathToNodeIdx, ["p1", "p2", "p3"]),
        ).eqls(["a1, a2", "a1, a2b", "cd"]);
    });

    describe("a <choiceInput>", () => {
        const choiceInput = `<choiceInput name="ci"><shortDescription>pick</shortDescription><choice>a</choice><choice>b</choice></choiceInput>`;

        it("a bare, named and disabled extend share its selection", async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `${choiceInput}
<p>$ci</p>
<choiceInput extend="$ci" name="e" />
<choiceInput extend="$ci" name="d" disabled />`,
            });

            const diagnosticsByType = getDiagnosticsByType(core);
            expect(diagnosticsByType.errors).eqls([]);
            expect(diagnosticsByType.warnings).eqls([]);

            await updateSelectedIndices({
                componentIdx: await resolvePathToNodeIdx("e"),
                selectedIndices: [2],
                core,
            });

            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            for (const name of ["ci", "e", "d"]) {
                const stateValues =
                    stateVariables[await resolvePathToNodeIdx(name)]
                        .stateValues;
                expect(stateValues.selectedIndices, name).eqls([2]);
                expect(stateValues.selectedValues, name).eqls(["b"]);
            }
            expect(
                stateVariables[await resolvePathToNodeIdx("d")].stateValues
                    .disabled,
            ).eq(true);
        });

        it("choices written inside an extend are an error", async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `${choiceInput}
<choiceInput extend="$ci" name="e"><choice>c</choice></choiceInput>
<p name="after">after</p>`,
            });

            const diagnosticsByType = getDiagnosticsByType(core);
            expect(diagnosticsByType.warnings).eqls([]);
            expect(
                diagnosticsByType.errors.map((error) => [
                    error.code,
                    error.message,
                    error.position?.start.line,
                ]),
            ).eqls([
                [
                    "doenet-e0058",
                    "Choices written inside an `extend` of a `<choiceInput>` would be new choices, but an extend shares its selection with `$ci`, which has no such choice. To offer more choices, use `copy`.",
                    2,
                ],
            ]);

            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(
                stateVariables[await resolvePathToNodeIdx("e")].componentType,
            ).eq("_error");
            expect(
                stateVariables[await resolvePathToNodeIdx("ci")].stateValues
                    .numChoices,
            ).eq(2);
            expect(
                stateVariables[await resolvePathToNodeIdx("after")].stateValues
                    .text,
            ).eq("after");
        });

        it("shuffleOrder on an extend is an error", async () => {
            const { core } = await createTestCore({
                doenetML: `${choiceInput}
<choiceInput extend="$ci" shuffleOrder />`,
            });

            const diagnosticsByType = getDiagnosticsByType(core);
            expect(diagnosticsByType.warnings).eqls([]);
            expect(
                diagnosticsByType.errors.map((error) => [
                    error.code,
                    error.message,
                ]),
            ).eqls([
                [
                    "doenet-e0059",
                    "An `extend` of a `<choiceInput>` shares its selection with `$ci`, which counts the choices in the order `$ci` shows them, so it can't change `shuffleOrder`. To show the choices in a different order, use `copy`.",
                ],
            ]);
        });
    });

    describe("the parts of a choosing tag can't be extended", () => {
        for (const [doenetML, extend, componentType, parentType] of [
            [
                `<conditionalContent><case name="c" condition="true"><text>a</text></case></conditionalContent>`,
                `<case extend="$c" />`,
                "case",
                "conditionalContent",
            ],
            [
                `<conditionalContent><case condition="false"><text>a</text></case><else name="c"><text>b</text></else></conditionalContent>`,
                `<else extend="$c" />`,
                "else",
                "conditionalContent",
            ],
            [
                `<select><option name="c"><text>a</text></option></select>`,
                `<option extend="$c" />`,
                "option",
                "select",
            ],
            [
                `<select><option name="c"><text>a</text></option></select>`,
                `$c`,
                "option",
                "select",
            ],
        ]) {
            it(`${extend}`, async () => {
                const { core, resolvePathToNodeIdx } = await createTestCore({
                    doenetML: `${doenetML}
<section>${extend}</section>
<p name="after">after</p>`,
                });

                const diagnosticsByType = getDiagnosticsByType(core);
                expect(
                    diagnosticsByType.errors.map((error) => [
                        error.code,
                        error.message,
                        error.position?.start.line,
                    ]),
                ).eqls([
                    [
                        "doenet-e0061",
                        `\`<${componentType}>\` is part of a \`<${parentType}>\`, and means something only there, so it can't be extended.`,
                        2,
                    ],
                ]);
                expect(
                    await textsOf(core, resolvePathToNodeIdx, ["after"]),
                ).eqls(["after"]);
            });
        }
    });
});
