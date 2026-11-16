import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import { getDiagnosticsByType } from "../utils/diagnostics";
import {
    submitAnswer,
    updateMathInputValue,
    updateSelectedIndices,
} from "../utils/actions";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

/**
 * D42: an `<award>` or a `<choice>` can only be copied. Its state records the
 * last submission of the answer or choice input holding it (ANS-1), so an
 * `extend` (sharing that record) and a `copyWithState` (starting from
 * another's) are an error at load (`doenet-e0078`), shown in place of the
 * award or choice. A `copy` writes it again here (D33, CPY-1).
 */
describe("An award or a choice can only be copied (D42) @group4", () => {
    async function load(doenetML: string) {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML,
        });
        const stateVariables = await core.returnAllStateVariables(false, true);
        return { core, resolvePathToNodeIdx, stateVariables };
    }

    function errorsOf(core: any) {
        return getDiagnosticsByType(core).errors.map((e) => ({
            code: e.code,
            args: e.args,
        }));
    }

    const awardSetup = `<setup><award name="aw"><when>$mi = 2</when></award></setup><mathInput name="mi"/>`;

    it("an extend or a copyWithState of an award is an error, whose message suggests copy", async () => {
        for (const how of ["extend", "copyWithState"]) {
            for (const tag of ["award", "Award"]) {
                const { core, stateVariables } = await load(
                    `${awardSetup}<answer name="ans"><${tag} name="aw2" ${how}="$aw"/></answer>`,
                );
                expect(errorsOf(core), `${tag} ${how}`).eqls([
                    {
                        code: "doenet-e0078",
                        args: {
                            componentType: "award",
                            parentType: "answer",
                            how,
                            source: "$aw",
                        },
                    },
                ]);
                const message = getDiagnosticsByType(core).errors[0].message;
                expect(message).contain(`<award copy="$aw"/>`);
                expect(message).contain(`\`${how}\``);
                // no award is made: the error is in its place. (`<Award>`,
                // as a reference's tag keeps the case written, is wrapped
                // in an award by the answer's sugar.)
                if (tag === "award")
                    expect(
                        Object.values(stateVariables).filter(
                            (c: any) => c.componentType === "award",
                        ).length,
                    ).eq(1);
            }
        }
    });

    it("an extend or a copyWithState of a choice is an error, whose message suggests copy", async () => {
        for (const how of ["extend", "copyWithState"]) {
            const { core, stateVariables } = await load(
                `<choiceInput name="ci"><choice name="c">a</choice><choice ${how}="$c"/><choice>b</choice></choiceInput>`,
            );
            expect(errorsOf(core), how).eqls([
                {
                    code: "doenet-e0078",
                    args: {
                        componentType: "choice",
                        parentType: "choiceInput",
                        how,
                        source: "$c",
                    },
                },
            ]);
            expect(getDiagnosticsByType(core).errors[0].message).contain(
                `<choice copy="$c"/>`,
            );
            // the choice input has the two choices written out
            expect(
                stateVariables[
                    Object.keys(stateVariables).find(
                        (k) =>
                            stateVariables[k].componentType === "choiceInput",
                    )!
                ].stateValues.choiceTexts,
            ).eqls(["a", "b"]);
        }
    });

    it("an extend written as an award is an error whatever it is of", async () => {
        // the source's tag is not given at load: the tag written decides
        const { core } = await load(
            `<mathInput name="mi"/><repeatForSequence name="r" length="2" valueName="v"><award name="aw"><when>$mi = $v</when></award></repeatForSequence><answer><award extend="$r[1].aw"/></answer>`,
        );
        expect(errorsOf(core).map((e) => e.code)).eqls(["doenet-e0078"]);
    });

    it("a copy, a bare reference, an answer extend and an extend of what holds an award are no error", async () => {
        for (const body of [
            `<answer><award copy="$aw"/></answer>`,
            `<answer><award copy="$aw" credit="0.5"/></answer>`,
            `<p>$aw</p>`,
            `<answer name="a"><award><when>$mi = 2</when></award></answer><answer extend="$a"/>`,
            `<section name="s"><answer><award><when>$mi = 2</when></award></answer></section><section extend="$s"/>`,
            `<choiceInput><choice name="c">a</choice><choice copy="$c"/></choiceInput>`,
            `<choiceInput name="ci"><choice>a</choice><choice>b</choice></choiceInput><choiceInput extend="$ci"/>`,
        ]) {
            const { core } = await load(`${awardSetup}${body}`);
            expect(errorsOf(core), body).eqls([]);
        }
    });

    it("a copied award gives credit from its own answer's submission", async () => {
        const { core, resolvePathToNodeIdx } = await load(
            `${awardSetup}<mathInput name="mi2"/>
            <answer name="a1"><award name="aw1"><when>$mi = 2</when></award></answer>
            <answer name="a2"><award copy="$aw1"/></answer>`,
        );
        await updateMathInputValue({
            latex: "2",
            componentIdx: await resolvePathToNodeIdx("mi"),
            core,
        });
        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("a1"),
            core,
        });
        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("a1")].stateValues
                .creditAchieved,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("a2")].stateValues
                .creditAchieved,
        ).eq(0);
        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("a2"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("a2")].stateValues
                .creditAchieved,
        ).eq(1);
    });

    it("a copied choice is selected and submitted in its own choice input", async () => {
        const { core, resolvePathToNodeIdx } = await load(`
            <answer name="a1"><choiceInput name="ci1"><choice name="cat" credit="1">meow</choice><choice>woof</choice></choiceInput></answer>
            <answer name="a2"><choiceInput name="ci2"><choice>woof</choice><choice copy="$cat" credit="0.5"/></choiceInput></answer>`);
        await updateSelectedIndices({
            componentIdx: await resolvePathToNodeIdx("ci2"),
            selectedIndices: [2],
            core,
        });
        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("a2"),
            core,
        });
        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("a2")].stateValues
                .creditAchieved,
        ).eq(0.5);
        expect(
            stateVariables[await resolvePathToNodeIdx("a1")].stateValues
                .creditAchieved,
        ).eq(0);
        expect(
            stateVariables[await resolvePathToNodeIdx("cat")].stateValues
                .submitted,
        ).eq(false);
        expect(errorsOf(core)).eqls([]);
    });
});

/**
 * An `<answer>` decides from its awards whether to add an input, and of which
 * type. A copied award is its source written in place (CPY-1), so the answer
 * decides as it does for the award written out (#2531).
 */
describe("An answer holding a copied award adds the input the written-out award gets @group4", () => {
    async function inputsOf(doenetML: string) {
        const { core } = await createTestCore({ doenetML });
        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(getDiagnosticsByType(core).errors).eqls([]);
        const types = Object.values(stateVariables).map(
            (c: any) => c.componentType,
        );
        return {
            mathInputs: types.filter((t) => t === "mathInput").length,
            textInputs: types.filter((t) => t === "textInput").length,
            booleanInputs: types.filter((t) => t === "booleanInput").length,
        };
    }

    const sources = `<setup>
        <award name="when"><when>$mi = 2</when></award>
        <award name="math">x</award>
        <award name="text"><text>hi</text></award>
        <award name="boolean"><boolean>true</boolean></award>
        <award name="refs" referencesAreResponses="$mi"><math>$mi</math></award>
        <award name="copyOfWhen" copy="$when"/>
    </setup><mathInput name="mi"/>`;

    for (const [name, writtenOut] of [
        ["when", `<award><when>$mi = 2</when></award>`],
        ["math", `<award>x</award>`],
        ["text", `<award><text>hi</text></award>`],
        ["boolean", `<award><boolean>true</boolean></award>`],
        [
            "refs",
            `<award referencesAreResponses="$mi"><math>$mi</math></award>`,
        ],
        ["copyOfWhen", `<award><when>$mi = 2</when></award>`],
    ]) {
        it(`an award with ${name}`, async () => {
            const expected = await inputsOf(
                `${sources}<answer>${writtenOut}</answer>`,
            );
            const copied = await inputsOf(
                `${sources}<answer><award copy="$${name}"/></answer>`,
            );
            expect(copied).eqls(expected);
        });
    }

    it("children written on the copy count with its source's", async () => {
        const expected = await inputsOf(
            `${sources}<answer><award><when>$mi = 2</when><text>hi</text></award></answer>`,
        );
        expect(expected.textInputs).eq(1);
        const copied = await inputsOf(
            `${sources}<answer><award copy="$when"><text>hi</text></award></answer>`,
        );
        expect(copied).eqls(expected);
    });

    it("the references of a copied award in an answer with no input are its responses", async () => {
        for (const award of [
            `<award><when>$mi = 2</when></award>`,
            `<award copy="$when"/>`,
        ]) {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `${sources}<answer name="ans">${award}</answer>`,
            });
            await updateMathInputValue({
                latex: "2",
                componentIdx: await resolvePathToNodeIdx("mi"),
                core,
            });
            const ans = await resolvePathToNodeIdx("ans");
            await submitAnswer({ componentIdx: ans, core });
            const stateValues = (
                await core.returnAllStateVariables(false, true)
            )[ans].stateValues;
            expect(stateValues.creditAchieved, award).eq(1);
            expect(stateValues.numResponses, award).eq(1);
            expect(stateValues.submittedResponses[0].tree, award).eq(2);
        }
    });
});
