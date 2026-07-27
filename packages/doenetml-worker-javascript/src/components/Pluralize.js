import Text from "./Text";
import nlp from "compromise";
import compromise_numbers from "compromise-numbers";

import { renameStateVariable } from "../utils/stateVariables";
import { codedDiagnostic } from "../utils/diagnostics";
import {
    contentLocale,
    isEnglishContent,
    returnContentLocaleDependencies,
} from "../utils/contentLocale";

nlp.extend(compromise_numbers);

/**
 * `<pluralize>` is English-only, and stays that way.
 *
 * It works by running an English part-of-speech model (`compromise`) over the
 * text, finding the nouns, and inflecting them. Nothing about that generalizes:
 * a correct plural in another language needs that language's own morphology,
 * usually its gender system, and often a dictionary — Spanish alone needs to
 * know that "lápiz" pluralizes to "lápices" — and shipping a model per language
 * is not a thing this component can grow into.
 *
 * So in a document written in anything else the model does not run. What still
 * can is `pluralForm`, where the author has supplied their language's plural
 * themselves — see {@link pluralizeWithoutTheModel}. With no `pluralForm` the
 * text passes through unchanged and a warning says so; silence would be worse,
 * since the author would see their singular in the output and have no way to
 * tell that a component they asked for had declined to do anything. `<lorem>`
 * is the neighbouring case that needs no warning — its output is Latin by
 * design, in every locale, and a translated lorem ipsum is not a thing anyone
 * wants.
 */
export default class Pluralize extends Text {
    static componentType = "pluralize";

    static componentDocs = {
        summary:
            "Renders a word in its singular or plural form based on a count (English only)",
    };
    static rendererType = "text";

    static createAttributesObject() {
        let attributes = super.createAttributesObject();
        attributes.pluralForm = {
            description:
                "Custom plural form to use (overrides automatic pluralization).",
            createComponentOfType: "text",
            createStateVariable: "pluralForm",
            defaultValue: null,
            public: true,
        };
        attributes.basedOnNumber = {
            description:
                "Number that determines whether to use the singular or plural form.",
            createComponentOfType: "number",
            createStateVariable: "basedOnNumber",
            defaultValue: null,
            public: true,
        };
        return attributes;
    }

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        // rename unnormalizedValue to unnormalizedValuePreOperator
        renameStateVariable({
            stateVariableDefinitions,
            oldName: "value",
            newName: "valuePrePluralize",
        });

        stateVariableDefinitions.value = {
            description: "The selected (singular or plural) word.",
            public: true,
            shadowingInstructions: {
                createComponentOfType: "text",
            },
            returnDependencies: () => ({
                valuePrePluralize: {
                    dependencyType: "stateVariable",
                    variableName: "valuePrePluralize",
                },
                pluralForm: {
                    dependencyType: "stateVariable",
                    variableName: "pluralForm",
                },
                basedOnNumber: {
                    dependencyType: "stateVariable",
                    variableName: "basedOnNumber",
                },
                ...returnContentLocaleDependencies(),
            }),
            definition: function ({ dependencyValues }) {
                if (!isEnglishContent(dependencyValues)) {
                    return pluralizeWithoutTheModel(dependencyValues);
                }

                let text = nlp(dependencyValues.valuePrePluralize);

                let allwords = text.values().toNumber().all().terms().json();

                if (allwords.length === 0) {
                    return {
                        setValue: { value: dependencyValues.valuePrePluralize },
                    };
                }

                let makePlural;
                if (dependencyValues.basedOnNumber !== null) {
                    makePlural = numberDesignatesPlural(
                        dependencyValues.basedOnNumber,
                    );
                }

                if (allwords.length === 1) {
                    // if have just one word, assume it is the noun to pluralize

                    // if didn't have basedOnNumber, make it plural
                    if (makePlural === undefined) {
                        makePlural = true;
                    }

                    if (!makePlural) {
                        return {
                            setValue: {
                                value: dependencyValues.valuePrePluralize,
                            },
                        };
                    }

                    // if have pluralForm, the one word should be turned into the pluralForm
                    if (dependencyValues.pluralForm !== null) {
                        return {
                            setValue: {
                                value: dependencyValues.pluralForm,
                            },
                        };
                    } else {
                        // attempt to pluralize via nlp
                        return {
                            setValue: {
                                value: text
                                    .nouns()
                                    .toPlural()
                                    .all()
                                    .out("text"),
                            },
                        };
                    }
                }

                // have more than one word
                // if don't have basedOnNumber, look for numbers before nouns to determine if plurals
                if (makePlural === undefined) {
                    // find indices in allwords of nouns and values
                    let nounIndices = [];
                    let valueIndices = [];

                    let nouns = text.nouns().json();

                    for (let [ind, word] of allwords.entries()) {
                        let nextNoun = nouns[nounIndices.length];

                        if (word.terms[0].tags.includes("Value")) {
                            valueIndices.push(ind);
                        }
                        if (
                            nextNoun !== undefined &&
                            nextNoun.text === word.text
                        ) {
                            nounIndices.push(ind);
                        }
                    }

                    // specify make plural by each noun.
                    // use the value immediately preceeding
                    makePlural = [];

                    let numbers = text.values().numbers().json();

                    let lastValueInd = -1;
                    for (let ind of nounIndices) {
                        while (
                            Number(valueIndices[lastValueInd + 1]) < Number(ind)
                        ) {
                            lastValueInd++;
                        }

                        if (
                            numbers[lastValueInd] &&
                            numberDesignatesPlural(
                                Number(numbers[lastValueInd].normal),
                            )
                        ) {
                            makePlural.push(true);
                        } else {
                            makePlural.push(false);
                        }
                    }
                }

                if (makePlural === false) {
                    return {
                        setValue: { value: dependencyValues.valuePrePluralize },
                    };
                }

                // not sure why have to create new text for this to work
                let text2 = nlp(dependencyValues.valuePrePluralize);

                if (dependencyValues.pluralForm !== null) {
                    // replace all nouns with plural form
                    for (let [ind, nounObj] of text.nouns().data().entries()) {
                        if (makePlural === true || makePlural[ind] === true) {
                            text2.replace(
                                nounObj.text,
                                dependencyValues.pluralForm,
                            );
                        }
                    }
                } else {
                    let numNouns = text.nouns().json().length;
                    for (let ind = 0; ind < numNouns; ind++) {
                        if (makePlural === true || makePlural[ind] === true) {
                            text2.nouns(ind).toPlural().all();
                        }
                    }
                }
                return {
                    setValue: {
                        value: text2.out("text"),
                    },
                };
            },
        };

        stateVariableDefinitions.text = {
            description: "The selected word as a text string.",
            public: true,
            shadowingInstructions: {
                createComponentOfType: "text",
            },
            forRenderer: true,
            returnDependencies: () => ({
                value: {
                    dependencyType: "stateVariable",
                    variableName: "value",
                },
            }),
            definition: ({ dependencyValues }) => ({
                setValue: { text: dependencyValues.value },
            }),
        };

        return stateVariableDefinitions;
    }
}

function numberDesignatesPlural(num) {
    return num !== 1;
}

/**
 * `<pluralize>` in a document that is not written in English.
 *
 * The part-of-speech model cannot run, but the one path through this component
 * that never needed it still can: an author who wrote `pluralForm` has
 * supplied their language's plural themselves, and `basedOnNumber` chooses
 * between the two forms by arithmetic. That is the single-word English path
 * with the model taken out of it, and it is exactly the remedy the warning
 * recommends — so ignoring it while recommending it would be worse than not
 * warning at all.
 *
 * Unlike the English path it does not require the text to be a single word:
 * without a tokenizer for the language there is nothing to count, and an
 * author who names the plural of a phrase means the phrase.
 *
 * Only a `<pluralize>` with no plural to fall back on is left as it was
 * written, and only that one warns.
 */
function pluralizeWithoutTheModel(dependencyValues) {
    const { valuePrePluralize, pluralForm, basedOnNumber } = dependencyValues;

    if (pluralForm !== null) {
        const makePlural =
            basedOnNumber === null || numberDesignatesPlural(basedOnNumber);
        return {
            setValue: { value: makePlural ? pluralForm : valuePrePluralize },
        };
    }

    return {
        setValue: { value: valuePrePluralize },
        sendDiagnostics: [
            codedDiagnostic({
                type: "warning",
                code: "doenet-w0111",
                args: { locale: contentLocale(dependencyValues) },
            }),
        ],
    };
}
