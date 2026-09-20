import BaseComponent from "./abstract/BaseComponent";
import {
    determineVariantsForSection,
    getVariantsForDescendantsForUniqueVariants,
} from "../utils/variants";
import { returnStyleDefinitionStateVariables } from "@doenet/utils";
import { SUPPORTED_LOCALES, resolveDocumentLocale } from "@doenet/i18n";
import { returnFeedbackDefinitionStateVariables } from "../utils/feedback";
import {
    returnCheckWorkCreditStateVariableDefinition,
    returnScoredSectionAttributes,
    returnScoredSectionStateVariableDefinition,
    submitAllAnswers,
} from "../utils/scoredSection";
import { codedDiagnostic } from "../utils/diagnostics";
import { returnSubmitLabelStateVariableDefinitions } from "../utils/answer";

export default class Document extends BaseComponent {
    constructor(args) {
        super(args);

        Object.assign(this.actions, {
            submitAllAnswers: this.submitAllAnswers.bind(this),
            recordVisibilityChange: this.recordVisibilityChange.bind(this),
        });
    }
    static componentType = "document";

    static componentDocs = {
        summary:
            "The top-level container for a DoenetML document (added implicitly if not present)",
    };
    static rendererType = "section";
    static renderChildren = true;

    static canDisplayChildErrors = true;

    static createsVariants = true;

    static includeBlankStringChildren = true;

    static createAttributesObject() {
        let attributes = super.createAttributesObject();

        delete attributes.hide;
        delete attributes.disabled;
        delete attributes.modifyIndirectly;
        delete attributes.fixed;
        delete attributes.styleNumber;
        delete attributes.isResponse;
        delete attributes.isPotentialResponse;

        // The document shares the scored-section attributes (score aggregation
        // plus section-wide check work), but always aggregates the scores of
        // its children and has no enclosing section to weight it, so it drops
        // the `aggregateScores`/`weight` attributes.
        let scoredAttributes = returnScoredSectionAttributes();
        delete scoredAttributes.aggregateScores;
        delete scoredAttributes.weight;
        Object.assign(attributes, scoredAttributes);

        // at this point, we are creating these attributes
        // so that having them in the doenetML is valid
        // Do we want to do something with these attributes?
        attributes.xmlns = {
            createPrimitiveOfType: "string",
            description:
                "XML namespace declaration (accepted for compatibility; not used).",
        };
        attributes.type = {
            createPrimitiveOfType: "string",
            description: "Document type identifier.",
        };

        // `suggestedValues`, not `validValues` — see the contract on
        // `AttributeDefinition`. The roster of translated languages is not the
        // set of tags an author may write, so these are offered and never
        // enforced.
        attributes.lang = {
            createPrimitiveOfType: "string",
            description:
                'BCP-47 language tag for the document\'s content, e.g. "es" or "es-MX". ' +
                "Overrides the locale supplied by the hosting page. Any language tag may " +
                "be used; the suggested values are the languages DoenetML ships " +
                "translations for, and content in any other language still renders with " +
                "its computed prose in English.",
            suggestedValues: SUPPORTED_LOCALES.map(({ locale, label }) => ({
                value: locale,
                description: label,
            })),
        };

        return attributes;
    }

    static returnChildGroups() {
        return [
            {
                group: "variantControl",
                componentTypes: ["variantControl"],
            },
            {
                group: "title",
                componentTypes: ["title"],
            },
            {
                group: "setups",
                componentTypes: ["setup"],
            },
            {
                group: "styleDefinitions",
                componentTypes: ["styleDefinition"],
            },
            {
                group: "stylePalettes",
                componentTypes: ["stylePalette"],
            },
            {
                group: "feedbackDefinitions",
                componentTypes: ["feedbackDefinition"],
            },
            {
                group: "anything",
                componentTypes: ["_base"],
            },
        ];
    }

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        // Note: style definition state variables allow one to redefine the style
        // via styledefinitions inside a setup in the document
        let styleDefinitionStateVariables =
            returnStyleDefinitionStateVariables();
        Object.assign(stateVariableDefinitions, styleDefinitionStateVariables);

        let feedbackDefinitionStateVariables =
            returnFeedbackDefinitionStateVariables();
        Object.assign(
            stateVariableDefinitions,
            feedbackDefinitionStateVariables,
        );

        Object.assign(
            stateVariableDefinitions,
            returnScoredSectionStateVariableDefinition(),
        );

        // The document is the top-level scored container and always aggregates
        // the scores of its children, so it drops the opt-in `aggregateScores`
        // state variable.
        delete stateVariableDefinitions.aggregateScores;

        // `creditAchievedForProgress` exists so a `<cascade>` can ask whether a
        // step is complete. A document is never a step of one, and the shared
        // definition is written against the `aggregateScores` just deleted, so
        // it goes too rather than being overridden the way `creditAchieved` is.
        delete stateVariableDefinitions.creditAchievedForProgress;

        // The shared submit labels read the *enclosing* document's language,
        // which is right for everything inside a document and wrong for the
        // document itself: an ancestor dependency skips the component it runs
        // on, so a root `<document lang="es">` would label its own
        // section-wide check-work button against the host's locale rather than
        // the one it declares. Re-take them, reading its own `locale`.
        Object.assign(
            stateVariableDefinitions,
            returnSubmitLabelStateVariableDefinitions({
                ownLocale: true,
                button: "the section-wide submit button",
            }),
        );

        stateVariableDefinitions.titleChildName = {
            forRenderer: true,
            returnDependencies: () => ({
                titleChild: {
                    dependencyType: "child",
                    childGroups: ["title"],
                },
            }),
            definition({ dependencyValues }) {
                let titleChildName = null;
                if (dependencyValues.titleChild.length > 0) {
                    titleChildName =
                        dependencyValues.titleChild[0].componentIdx;
                }
                return {
                    setValue: { titleChildName },
                };
            },
        };

        stateVariableDefinitions.title = {
            description: "The document's title.",
            public: true,
            shadowingInstructions: {
                createComponentOfType: "text",
            },
            forRenderer: true,
            returnDependencies: () => ({
                titleChild: {
                    dependencyType: "child",
                    childGroups: ["title"],
                    variableNames: ["text"],
                },
            }),
            definition({ dependencyValues }) {
                if (dependencyValues.titleChild.length === 0) {
                    return { setValue: { title: "" } };
                } else {
                    return {
                        setValue: {
                            title: dependencyValues.titleChild[0].stateValues
                                .text,
                        },
                    };
                }
            },
        };

        // Theme is used to by styleDescriptions to use the dark mode words if theme is dark.
        // It is set to be either "light" or "dark" via an action sent by the viewer.
        stateVariableDefinitions.theme = {
            hasEssential: true,
            defaultValue: "light",
            returnDependencies: () => ({
                documentAncestor: {
                    dependencyType: "ancestor",
                    componentType: "document",
                    variableNames: ["theme"],
                },
            }),
            definition({ dependencyValues }) {
                if (dependencyValues.documentAncestor) {
                    // this document is inside another document so use the ancestor's value
                    return {
                        setValue: {
                            theme: dependencyValues.documentAncestor.stateValues
                                .theme,
                        },
                    };
                } else {
                    return { useEssentialOrDefaultValue: { theme: true } };
                }
            },
            inverseDefinition({
                desiredStateVariableValues,
                dependencyValues,
            }) {
                if (dependencyValues.documentAncestor) {
                    return {
                        success: true,
                        instructions: [
                            {
                                setDependency: "documentAncestor",
                                desiredValue: desiredStateVariableValues.theme,
                            },
                        ],
                    };
                } else {
                    return {
                        success: true,
                        instructions: [
                            {
                                setEssentialValue: "theme",
                                value: desiredStateVariableValues.theme,
                            },
                        ],
                    };
                }
            },
        };

        // The content's language, as a BCP-47 tag. Drives translation of the
        // prose the core computes (style descriptions and the like) and, via
        // `renderedLang` below, the `lang` attribute the DOM carries over a
        // nested document's subtree — which is what lets a screen reader
        // pronounce that content correctly.
        //
        // Precedence: an authored `lang` attribute wins over the locale the
        // hosting page supplied via `setLocaleData`, which falls back to "en".
        // The author knows what language they wrote in; the host only knows
        // what language it would prefer.
        stateVariableDefinitions.locale = {
            description:
                "The BCP-47 language tag in effect for the document's content.",
            public: true,
            shadowingInstructions: {
                createComponentOfType: "text",
            },
            // `renderedLang` is the tag the section renderer writes as a
            // `lang` attribute, or null for no attribute at all (#1546). The
            // same language as `locale`, narrowed to where the DOM has
            // something to add: only a nested document, and only when its
            // language differs from the one already in effect around it.
            //
            // The viewer labels the whole activity from the outermost
            // document's language, on the wrapper it renders around it. So the
            // outermost document needs no tag of its own, a nested one that
            // merely restates the surrounding language would say nothing new,
            // and "already in effect" is known here at every depth.
            additionalStateVariablesDefined: [
                { variableName: "renderedLang", forRenderer: true },
            ],
            returnDependencies: () => ({
                lang: {
                    dependencyType: "attributePrimitive",
                    attributeName: "lang",
                },
                hostLocale: {
                    dependencyType: "locale",
                },
                documentAncestor: {
                    dependencyType: "ancestor",
                    componentType: "document",
                    variableNames: ["locale"],
                },
            }),
            definition({ dependencyValues }) {
                // The language already in effect around this document, if it
                // is nested in one: every document above it either declared
                // its own or inherited one the same way, so that chain is
                // resolved by the time it gets here.
                const inherited =
                    dependencyValues.documentAncestor?.stateValues.locale;
                // An enclosing document stands in for the host's locale, so a
                // nested document that declares no language of its own follows
                // the one it sits in rather than jumping back to the host's.
                // `resolveDocumentLocale` does the rest: it trims, so a blank
                // `lang` counts as absent, and normalizes, so the comparison
                // below is between canonical tags.
                const locale = resolveDocumentLocale(
                    dependencyValues.lang,
                    inherited ?? dependencyValues.hostLocale,
                );
                return {
                    setValue: {
                        locale,
                        // Silent wherever the DOM already says this language.
                        renderedLang:
                            inherited && locale !== inherited ? locale : null,
                    },
                };
            },
        };

        stateVariableDefinitions.level = {
            forRenderer: true,
            returnDependencies: () => ({}),
            definition: () => ({ setValue: { level: 0 } }),
        };

        stateVariableDefinitions.numScoredDescendants = {
            returnDependencies: () => ({
                scoredDescendants: {
                    dependencyType: "stateVariable",
                    variableName: "scoredDescendants",
                },
            }),
            definition({ dependencyValues }) {
                return {
                    setValue: {
                        numScoredDescendants:
                            dependencyValues.scoredDescendants.length,
                    },
                };
            },
        };

        stateVariableDefinitions.componentCreditAchieved = {
            isArray: true,
            returnArraySizeDependencies: () => ({
                numScoredDescendants: {
                    dependencyType: "stateVariable",
                    variableName: "numScoredDescendants",
                },
            }),
            returnArraySize({ dependencyValues }) {
                return [dependencyValues.numScoredDescendants];
            },
            stateVariablesDeterminingDependencies: ["scoredDescendants"],
            returnArrayDependenciesByKey({ arrayKeys, stateValues }) {
                let dependenciesByKey = {};
                for (let arrayKey of arrayKeys) {
                    let descendant = stateValues.scoredDescendants[arrayKey];
                    if (descendant) {
                        dependenciesByKey[arrayKey] = {
                            creditAchieved: {
                                dependencyType: "stateVariable",
                                componentIdx: descendant.componentIdx,
                                variableName: "creditAchieved",
                            },
                        };
                    }
                }

                return { dependenciesByKey };
            },
            arrayDefinitionByKey({ dependencyValuesByKey, arrayKeys }) {
                let componentCreditAchieved = {};

                for (let arrayKey of arrayKeys) {
                    componentCreditAchieved[arrayKey] =
                        dependencyValuesByKey[arrayKey].creditAchieved;
                }

                return { setValue: { componentCreditAchieved } };
            },
        };

        stateVariableDefinitions.componentNumberByAnswerName = {
            stateVariablesDeterminingDependencies: ["scoredDescendants"],
            returnDependencies({ stateValues }) {
                let dependencies = {
                    scoredDescendants: {
                        dependencyType: "stateVariable",
                        variableName: "scoredDescendants",
                    },
                };
                for (let ind in stateValues.scoredDescendants) {
                    let descendant = stateValues.scoredDescendants[ind];
                    dependencies[`descendantsOf${ind}`] = {
                        dependencyType: "descendant",
                        ancestorIdx: descendant.componentIdx,
                        componentTypes: ["answer", "_blockScoredComponent"],
                        recurseToMatchedChildren: false,
                    };
                }

                return dependencies;
            },
            definition({ dependencyValues, componentInfoObjects }) {
                let componentNumberByAnswerName = {};

                for (let [
                    ind,
                    component,
                ] of dependencyValues.scoredDescendants.entries()) {
                    let componentNumber = ind + 1;
                    for (let answerDescendant of dependencyValues[
                        `descendantsOf${ind}`
                    ]) {
                        componentNumberByAnswerName[
                            answerDescendant.componentIdx
                        ] = componentNumber;
                    }
                    if (
                        componentInfoObjects.isInheritedComponentType({
                            inheritedComponentType: component.componentType,
                            baseComponentType: "answer",
                        }) ||
                        componentInfoObjects.isInheritedComponentType({
                            inheritedComponentType: component.componentType,
                            baseComponentType: "_blockScoredComponent",
                        })
                    ) {
                        componentNumberByAnswerName[component.componentIdx] =
                            componentNumber;
                    }
                }

                return { setValue: { componentNumberByAnswerName } };
            },
        };

        stateVariableDefinitions.docVariantInfo = {
            isArray: true,
            returnArraySizeDependencies: () => ({
                numScoredDescendants: {
                    dependencyType: "stateVariable",
                    variableName: "numScoredDescendants",
                },
            }),
            returnArraySize({ dependencyValues }) {
                return [dependencyValues.numScoredDescendants];
            },
            stateVariablesDeterminingDependencies: ["scoredDescendants"],
            returnArrayDependenciesByKey({ arrayKeys, stateValues }) {
                let dependenciesByKey = {};
                for (let arrayKey of arrayKeys) {
                    let descendant = stateValues.scoredDescendants[arrayKey];
                    if (descendant) {
                        dependenciesByKey[arrayKey] = {
                            generatedVariantInfo: {
                                dependencyType: "stateVariable",
                                componentIdx: descendant.componentIdx,
                                variableName: "generatedVariantInfo",
                                variablesOptional: true,
                            },
                        };
                    }
                }

                return { dependenciesByKey };
            },
            arrayDefinitionByKey({ dependencyValuesByKey, arrayKeys }) {
                let docVariantInfo = {};

                for (let arrayKey of arrayKeys) {
                    docVariantInfo[arrayKey] =
                        dependencyValuesByKey[arrayKey].generatedVariantInfo;
                }

                return { setValue: { docVariantInfo } };
            },
        };

        // Overrides the shared `creditAchieved` for two reasons: that version
        // returns 0 unless `aggregateScores` is enabled (the document always
        // aggregates), and this version aggregates from the document-specific
        // `componentCreditAchieved` array (which the core also reads to report
        // per-item scores to the host) instead of re-resolving each descendant.
        stateVariableDefinitions.creditAchieved = {
            description:
                "Aggregate credit achieved (0 to 1) for scored content in the document.",
            public: true,
            forRenderer: true,
            defaultValue: 0,
            shadowingInstructions: {
                createComponentOfType: "number",
                addAttributeComponentsShadowingStateVariables: {
                    displayDigits: {
                        stateVariableToShadow: "displayDigitsForCreditAchieved",
                    },
                    displayDecimals: {
                        stateVariableToShadow:
                            "displayDecimalsForCreditAchieved",
                    },
                },
            },
            additionalStateVariablesDefined: [
                {
                    variableName: "percentCreditAchieved",
                    public: true,
                    description:
                        "Aggregate credit achieved as a percentage (0 to 100) for scored content in the document.",
                    shadowingInstructions: {
                        createComponentOfType: "number",
                        addAttributeComponentsShadowingStateVariables: {
                            displayDigits: {
                                stateVariableToShadow:
                                    "displayDigitsForCreditAchieved",
                            },
                            displayDecimals: {
                                stateVariableToShadow:
                                    "displayDecimalsForCreditAchieved",
                            },
                        },
                    },
                },
            ],
            returnDependencies: () => ({
                scoredDescendants: {
                    dependencyType: "stateVariable",
                    variableName: "scoredDescendants",
                },
                componentCreditAchieved: {
                    dependencyType: "stateVariable",
                    variableName: "componentCreditAchieved",
                },
            }),
            definition({ dependencyValues }) {
                let creditSum = 0;
                let totalWeight = 0;

                for (let [
                    ind,
                    component,
                ] of dependencyValues.scoredDescendants.entries()) {
                    let weight = component.stateValues.weight;
                    creditSum +=
                        dependencyValues.componentCreditAchieved[ind] * weight;
                    totalWeight += weight;
                }
                let creditAchieved;

                if (totalWeight > 0) {
                    creditAchieved = creditSum / totalWeight;
                } else {
                    // give full credit if there are no scored items
                    creditAchieved = 1;
                }

                let percentCreditAchieved = creditAchieved * 100;

                return { setValue: { creditAchieved, percentCreditAchieved } };
            },
        };

        // Overrides the shared `creditAchievedForCheckWork` for the same reason
        // as `creditAchieved` above: the document always aggregates, rather
        // than only when `aggregateScores` is enabled. The rule is unchanged,
        // so it still comes from the shared definition.
        stateVariableDefinitions.creditAchievedForCheckWork =
            returnCheckWorkCreditStateVariableDefinition({
                alwaysAggregate: true,
            });

        // Overrides the shared `creditAchievedIfSubmit` for the same reason as
        // `creditAchieved` above: the document always aggregates, rather than
        // only when `aggregateScores` is enabled.
        stateVariableDefinitions.creditAchievedIfSubmit = {
            defaultValue: 0,
            stateVariablesDeterminingDependencies: ["scoredDescendants"],
            returnDependencies({ stateValues }) {
                let dependencies = {
                    scoredDescendants: {
                        dependencyType: "stateVariable",
                        variableName: "scoredDescendants",
                    },
                };
                for (let [
                    ind,
                    descendant,
                ] of stateValues.scoredDescendants.entries()) {
                    dependencies["creditAchievedIfSubmit" + ind] = {
                        dependencyType: "stateVariable",
                        componentIdx: descendant.componentIdx,
                        variableName: "creditAchievedIfSubmit",
                    };
                }

                return dependencies;
            },
            definition({ dependencyValues }) {
                let creditSum = 0;
                let totalWeight = 0;

                for (let [
                    ind,
                    component,
                ] of dependencyValues.scoredDescendants.entries()) {
                    let weight = component.stateValues.weight;
                    creditSum +=
                        dependencyValues["creditAchievedIfSubmit" + ind] *
                        weight;
                    totalWeight += weight;
                }
                let creditAchievedIfSubmit = creditSum / totalWeight;

                return { setValue: { creditAchievedIfSubmit } };
            },
        };

        stateVariableDefinitions.generatedVariantInfo = {
            providePreviousValuesInDefinition: true,
            returnDependencies: ({
                sharedParameters,
                componentInfoObjects,
            }) => ({
                variantIndex: {
                    dependencyType: "value",
                    value: sharedParameters.variantIndex,
                },
                variantName: {
                    dependencyType: "value",
                    value: sharedParameters.variantName,
                },
                variantDescendants: {
                    dependencyType: "descendant",
                    componentTypes: Object.keys(
                        componentInfoObjects.componentTypesCreatingVariants,
                    ),
                    variableNames: [
                        "isVariantComponent",
                        "generatedVariantInfo",
                    ],
                    recurseToMatchedChildren: false,
                    variablesOptional: true,
                    includeNonActiveChildren: true,
                    ignoreReplacementsOfEncounteredComposites: true,
                },
            }),
            definition({ dependencyValues, componentIdx, previousValues }) {
                let generatedVariantInfo = {
                    index: dependencyValues.variantIndex,
                    name: dependencyValues.variantName,
                    meta: {
                        createdBy: componentIdx,
                    },
                };

                let subvariants = (generatedVariantInfo.subvariants = []);

                for (let descendant of dependencyValues.variantDescendants) {
                    if (descendant.stateValues.isVariantComponent) {
                        subvariants.push(
                            descendant.stateValues.generatedVariantInfo,
                        );
                    } else if (descendant.stateValues.generatedVariantInfo) {
                        subvariants.push(
                            ...descendant.stateValues.generatedVariantInfo
                                .subvariants,
                        );
                    }
                }

                for (let [ind, subvar] of subvariants.entries()) {
                    if (
                        !subvar.subvariants &&
                        previousValues.generatedVariantInfo
                    ) {
                        // check if previously had subvariants
                        let previousSubvariants =
                            previousValues.generatedVariantInfo.subvariants;
                        if (previousSubvariants[ind]?.subvariants) {
                            subvariants[ind] = Object.assign(
                                {},
                                subvariants[ind],
                            );
                            subvariants[ind].subvariants =
                                previousSubvariants[ind].subvariants;
                        }
                    }
                }

                return { setValue: { generatedVariantInfo } };
            },
        };

        stateVariableDefinitions.containerTag = {
            forRenderer: true,
            returnDependencies: () => ({}),
            definition: () => ({ setValue: { containerTag: "div" } }),
        };

        return stateVariableDefinitions;
    }

    async submitAllAnswers({
        actionId,
        sourceInformation = {},
        skipRendererUpdate = false,
    }) {
        return submitAllAnswers({
            component: this,
            actionId,
            sourceInformation,
            skipRendererUpdate,
        });
    }

    recordVisibilityChange({ isVisible }) {
        this.coreFunctions.requestRecordEvent({
            verb: "visibilityChanged",
            object: {
                componentIdx: this.componentIdx,
                componentType: this.componentType,
            },
            result: { isVisible },
        });
    }

    static setUpVariant({
        serializedComponent,
        sharedParameters,
        descendantVariantComponents,
        core,
    }) {
        // console.log("****Variant for document*****")

        let numVariants = serializedComponent.variants.numVariants;

        let variantIndex;
        // check if desiredVariant was specified
        let desiredVariant = serializedComponent.variants.desiredVariant;
        if (desiredVariant !== undefined) {
            if (desiredVariant.index !== undefined) {
                let desiredVariantIndex = Number(desiredVariant.index);
                if (!Number.isFinite(desiredVariantIndex)) {
                    core.addDiagnostic(
                        codedDiagnostic({
                            type: "info",
                            code: "doenet-i0010",
                            args: { index: String(desiredVariant.index) },
                            position: serializedComponent.position,
                            sourceDoc: serializedComponent.sourceDoc,
                        }),
                    );
                    variantIndex = 1;
                } else {
                    if (!Number.isInteger(desiredVariantIndex)) {
                        core.addDiagnostic(
                            codedDiagnostic({
                                type: "info",
                                code: "doenet-i0011",
                                args: { index: String(desiredVariant.index) },
                                position: serializedComponent.position,
                                sourceDoc: serializedComponent.sourceDoc,
                            }),
                        );
                        desiredVariantIndex = Math.round(desiredVariantIndex);
                    }
                    let indexFrom0 = (desiredVariantIndex - 1) % numVariants;
                    if (indexFrom0 < 0) {
                        indexFrom0 += numVariants;
                    }
                    variantIndex = indexFrom0 + 1;
                }
            }
        }

        if (variantIndex === undefined) {
            // if variant index wasn't specified, use first variant
            variantIndex = 1;
        }

        sharedParameters.allPossibleVariants =
            serializedComponent.variants.allPossibleVariants;
        sharedParameters.allVariantNames =
            serializedComponent.variants.allVariantNames;

        sharedParameters.variantSeed =
            serializedComponent.variants.allPossibleVariantSeeds[
                variantIndex - 1
            ];
        sharedParameters.variantIndex = variantIndex;
        sharedParameters.variantName =
            serializedComponent.variants.allPossibleVariants[variantIndex - 1];
        sharedParameters.uniqueIndex =
            serializedComponent.variants.allPossibleVariantUniqueIndices[
                variantIndex - 1
            ];

        sharedParameters.variantRng = sharedParameters.rngClass(
            sharedParameters.variantSeed,
        );
        sharedParameters.subpartVariantRng = sharedParameters.rngClass(
            sharedParameters.variantSeed + "s",
        );

        // console.log("Document variant name: " + sharedParameters.variantName);

        // if subvariants were specified, add those to the corresponding descendants
        if (desiredVariant?.subvariants && descendantVariantComponents) {
            for (let ind in desiredVariant.subvariants) {
                let subvariant = desiredVariant.subvariants[ind];
                let variantComponent = descendantVariantComponents[ind];
                if (variantComponent === undefined) {
                    break;
                }
                variantComponent.variants.desiredVariant = subvariant;
            }
        }

        // console.log("Desired variant for document");
        // console.log(desiredVariant);
    }

    static determineNumberOfUniqueVariants({
        serializedComponent,
        componentInfoObjects,
        infoDiagnostics,
    }) {
        return determineVariantsForSection({
            serializedComponent,
            componentInfoObjects,
            isDocument: true,
            infoDiagnostics,
        });
    }

    static getUniqueVariant({
        serializedComponent,
        variantIndex,
        componentInfoObjects,
    }) {
        let originalVariantIndex =
            serializedComponent.variants.allPossibleVariantUniqueIndices[
                variantIndex - 1
            ];

        if (originalVariantIndex === undefined) {
            return { success: false };
        }

        let result = getVariantsForDescendantsForUniqueVariants({
            variantIndex: originalVariantIndex,
            serializedComponent,
            componentInfoObjects,
        });

        if (!result.success) {
            return { success: false };
        }

        return {
            success: true,
            desiredVariant: {
                index: variantIndex,
                subvariants: result.desiredVariants,
            },
        };
    }
}
