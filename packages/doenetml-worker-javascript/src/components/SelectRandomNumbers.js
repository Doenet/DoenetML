import { sampleFromRandomNumbers } from "../utils/randomNumbers";
import SampleRandomNumbers from "./SampleRandomNumbers";
import {
    choicesDecidedByDoenetML,
    keptSelection,
    NUM_TO_SELECT_VARIABLE,
    withNumToSelect,
} from "../utils/selectErrors";
export default class SelectRandomNumbers extends SampleRandomNumbers {
    // `<sampleRandomNumbers>` offers a `resample` action, and this component
    // has no use for it: it draws once from the variant's generator, and
    // `selectedValues` is immutable so that the draw stays the draw. The
    // inherited action also writes `sampledValues`, the variable deleted
    // below in favor of `selectedValues`, so calling it threw on a variable
    // that is not there -- a console stack trace, nothing said to the author,
    // and the throw carrying off whatever else shared the trigger on its way
    // out: past `CallAction.callAction`'s own trailing `triggerChainedActions`,
    // so anything chained with `triggerWith` never ran, and on out of the
    // un-`try`'d loop in `TriggerSet.triggerActions` that had called it, so the
    // rest of a `<triggerSet>` never ran either. Removing the action leaves
    // `<callAction>` to report that the action is unavailable, which is what
    // an author who asked for it needs to hear.
    constructor(args) {
        super(args);

        delete this.actions.resample;

        // Whether the DoenetML alone decides what it draws: then a fresh
        // load under the same variant draws the same values
        // (`definitionEssentialValuesReproducible`)
        this.doenetAttributes.choicesDecidedByDoenetML =
            choicesDecidedByDoenetML({
                component: this,
                attributeNames: Object.keys(this.attributes ?? {}).filter(
                    (name) => !name.startsWith("_"),
                ),
                componentInfoObjects: args.componentInfoObjects,
            });
    }

    /**
     * Whether a fresh load reproduces its selection, so a save
     * can leave it out (`BaseComponent.definitionEssentialValuesAreReproducible`):
     * only when the DoenetML alone decides what it chooses from. A value
     * that decides it, such as an input, can have changed by the time the
     * document is loaded again, and the select must keep the choices it was
     * made with, never choosing again.
     */
    get definitionEssentialValuesReproducible() {
        return this.doenetAttributes.choicesDecidedByDoenetML !== false;
    }

    static componentType = "selectRandomNumbers";

    static listEntryValuesVariable = "selectedValues";

    // Unlike `<sampleRandomNumbers>`, which it extends, this draws from the
    // variant's generator -- it deletes `variantDeterminesSeed` and takes
    // `sharedParameters.variantRng` unconditionally -- so a fresh build of the
    // same document under the same variant reproduces its selection and there
    // is nothing to persist.
    static definitionEssentialValuesAreReproducible = true;

    static componentDocs = {
        summary:
            "Selects a fixed set of random numbers to create document variants",
    };
    static allowInSchemaAsComponent = ["number"];

    static createsVariants = true;

    static createAttributesObject() {
        let attributes = super.createAttributesObject();

        delete attributes.numSamples;
        delete attributes.variantDeterminesSeed;

        // The count `<sampleRandomNumbers>` highlights is deleted above, so this
        // takes its place beside the inherited `type` in the highlighted section.
        attributes.numToSelect = {
            highlighted: true,
            description: "How many random numbers to select.",
            createComponentOfType: "integer",
            createStateVariable: "specifiedNumToSelect",
            // fixed with the selection made from it; the public `numToSelect`
            // is kept with the selection (`NUM_TO_SELECT_VARIABLE`)
            immutable: true,
            defaultValue: 1,
        };

        return attributes;
    }

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        stateVariableDefinitions.variants = {
            returnDependencies: () => ({
                variants: {
                    dependencyType: "variants",
                },
            }),
            definition: function ({ dependencyValues }) {
                return { setValue: { variants: dependencyValues.variants } };
            },
        };

        stateVariableDefinitions.step.immutable = true;
        // `exclude` is frozen alongside the range it narrows. It was the one
        // parameter left following its reference, and the moments are lazy, so a
        // reference that changed before anything read them gave a `mean` and a
        // `variance` for an exclusion set the selection had not been drawn from ---
        // and, where the change altered how many values survived, for no set of
        // values at all, since the count they divide by is frozen here while the
        // exclusions they sum over were not (Doenet/DoenetML#1997).
        stateVariableDefinitions.exclude.immutable = true;
        stateVariableDefinitions.from.immutable = true;
        stateVariableDefinitions.from.additionalStateVariablesDefined[0].immutable = true;
        stateVariableDefinitions.from.additionalStateVariablesDefined[1].immutable = true;

        // The distribution parameters are frozen alongside the moments: a selection
        // is made once, so a parameter that kept updating would describe something
        // other than the numbers on the page.
        stateVariableDefinitions.numTotal.immutable = true;
        stateVariableDefinitions.numSuccesses.immutable = true;
        stateVariableDefinitions.numDraws.immutable = true;
        stateVariableDefinitions.numTrials.immutable = true;
        stateVariableDefinitions.probability.immutable = true;

        // The gaussian, log-normal, normal-mixture and poisson parameters are frozen
        // for the same reason, and additionally because `selectedValues` reads them
        // directly:
        // they are what the selection was drawn from, so a moment derived from them
        // later must see what the draw saw, not whatever a reference has since
        // become.
        stateVariableDefinitions.gaussianMean.immutable = true;
        stateVariableDefinitions.gaussianStandardDeviation.immutable = true;
        stateVariableDefinitions.gaussianStandardDeviation.additionalStateVariablesDefined[0].immutable = true;
        stateVariableDefinitions.logMean.immutable = true;
        stateVariableDefinitions.logStandardDeviation.immutable = true;
        stateVariableDefinitions.logStandardDeviation.additionalStateVariablesDefined[0].immutable = true;
        stateVariableDefinitions.means.immutable = true;
        stateVariableDefinitions.standardDeviations.immutable = true;
        stateVariableDefinitions.standardDeviations.additionalStateVariablesDefined[0].immutable = true;
        stateVariableDefinitions.weights.immutable = true;
        stateVariableDefinitions.poissonMean.immutable = true;

        stateVariableDefinitions.mean.immutable = true;
        stateVariableDefinitions.variance.immutable = true;
        stateVariableDefinitions.standardDeviation.immutable = true;

        delete stateVariableDefinitions.sampledValues;

        stateVariableDefinitions.selectedValues = {
            immutable: true,
            hasEssential: true,
            // to keep a selection already made (`keptSelection`)
            provideEssentialValuesInDefinition: true,
            additionalStateVariablesDefined: [NUM_TO_SELECT_VARIABLE],
            shadowVariable: true,
            returnDependencies: ({ sharedParameters }) => ({
                numSamples: {
                    dependencyType: "stateVariable",
                    variableName: "specifiedNumToSelect",
                },
                type: {
                    dependencyType: "stateVariable",
                    variableName: "type",
                },
                from: {
                    dependencyType: "stateVariable",
                    variableName: "from",
                },
                to: {
                    dependencyType: "stateVariable",
                    variableName: "to",
                },
                step: {
                    dependencyType: "stateVariable",
                    variableName: "step",
                },
                exclude: {
                    dependencyType: "stateVariable",
                    variableName: "exclude",
                },
                numDiscreteValues: {
                    dependencyType: "stateVariable",
                    variableName: "numDiscreteValues",
                },
                // the gaussian's parameters as written, not the reported moments,
                // which are NaN for anything unusable and so could not say which of
                // the two was wrong
                mean: {
                    dependencyType: "stateVariable",
                    variableName: "gaussianMean",
                },
                standardDeviation: {
                    dependencyType: "stateVariable",
                    variableName: "gaussianStandardDeviation",
                },
                logMean: {
                    dependencyType: "stateVariable",
                    variableName: "logMean",
                },
                logStandardDeviation: {
                    dependencyType: "stateVariable",
                    variableName: "logStandardDeviation",
                },
                means: {
                    dependencyType: "stateVariable",
                    variableName: "means",
                },
                standardDeviations: {
                    dependencyType: "stateVariable",
                    variableName: "standardDeviations",
                },
                weights: {
                    dependencyType: "stateVariable",
                    variableName: "weights",
                },
                numTotal: {
                    dependencyType: "stateVariable",
                    variableName: "numTotal",
                },
                numSuccesses: {
                    dependencyType: "stateVariable",
                    variableName: "numSuccesses",
                },
                numDraws: {
                    dependencyType: "stateVariable",
                    variableName: "numDraws",
                },
                numTrials: {
                    dependencyType: "stateVariable",
                    variableName: "numTrials",
                },
                probability: {
                    dependencyType: "stateVariable",
                    variableName: "probability",
                },
                poissonMean: {
                    dependencyType: "stateVariable",
                    variableName: "poissonMean",
                },
                variants: {
                    dependencyType: "stateVariable",
                    variableName: "variants",
                },
                rng: {
                    dependencyType: "value",
                    value: sharedParameters.variantRng,
                    doNotProxy: true,
                },
            }),
            definition: (args) =>
                withNumToSelect(
                    selectValues(args),
                    args.dependencyValues.numSamples,
                ),
        };

        function selectValues({ dependencyValues, essentialValues }) {
            // A selection already made, as on a reload, is kept
            const kept = keptSelection(essentialValues, [
                "selectedValues",
                "numToSelect",
            ]);
            if (kept) {
                return kept;
            }
            // The values the requested variant gives are taken as given,
            // whatever the select would choose now: a select keeps the
            // choices it was made with, as it keeps `numToSelect`, and never
            // chooses again (#2389). `[]`, or `null`, is a selection of
            // nothing.
            let desiredValues =
                dependencyValues.variants?.desiredVariant?.values;
            if (desiredValues === null) {
                desiredValues = [];
            }
            if (Array.isArray(desiredValues)) {
                // Still check the parameters they came from: replaying a
                // variant should report the same problems as generating it,
                // rather than accepting the saved numbers silently. Asking
                // for none draws nothing, so the variant's own randomness is
                // untouched.
                const { diagnostics } = sampleFromRandomNumbers({
                    ...dependencyValues,
                    numSamples: 0,
                });

                // with them, how many were selected
                return {
                    ...withNumToSelect(
                        {
                            setEssentialValue: {
                                selectedValues: desiredValues,
                            },
                            setValue: { selectedValues: desiredValues },
                        },
                        desiredValues.length,
                    ),
                    sendDiagnostics: diagnostics,
                };
            }

            if (dependencyValues.numSamples < 1) {
                return {
                    setEssentialValue: { selectedValues: [] },
                    setValue: { selectedValues: [] },
                };
            }

            const { sampledValues: selectedValues, diagnostics } =
                sampleFromRandomNumbers(dependencyValues);

            return {
                setEssentialValue: { selectedValues },
                setValue: { selectedValues },
                sendDiagnostics: diagnostics,
            };
        }

        stateVariableDefinitions.isVariantComponent = {
            returnDependencies: () => ({}),
            definition: () => ({ setValue: { isVariantComponent: true } }),
        };

        stateVariableDefinitions.generatedVariantInfo = {
            returnDependencies: () => ({
                selectedValues: {
                    dependencyType: "stateVariable",
                    variableName: "selectedValues",
                },
            }),
            definition({ dependencyValues, componentIdx }) {
                let generatedVariantInfo = {
                    values: dependencyValues.selectedValues,
                    meta: { createdBy: componentIdx },
                };

                return { setValue: { generatedVariantInfo } };
            },
        };

        return stateVariableDefinitions;
    }

    static determineNumberOfUniqueVariants() {
        return { success: false };
    }
}
