import CompositeComponent from "./abstract/CompositeComponent";
import { deepClone } from "@doenet/utils";
import { verifyReplacementsMatchSpecifiedType } from "../utils/copy";
import { setUpVariantSeedAndRng } from "../utils/variants";
import { convertUnresolvedAttributesForComponentType } from "../utils/dast/convertNormalizedDast";
export default class Group extends CompositeComponent {
    static componentType = "group";

    static allowInSchemaAsComponent = ["_inline", "_block", "_graphical"];

    static treatAsComponentForRecursiveReplacements = true;
    static includeBlankStringChildren = true;
    static renderedDefault = true;

    static createsVariants = true;

    static serializeReplacementsForChildren = true;
    static replacementsAlreadyInResolver = true;

    static stateVariableToEvaluateAfterReplacements =
        "readyToExpandWhenResolved";

    static useSerializedChildrenComponentIndices = true;
    static addExtraSerializedChildrenWhenShadowing = true;

    static keepChildrenSerialized({ serializedComponent }) {
        if (serializedComponent.children === undefined) {
            return [];
        } else {
            return Object.keys(serializedComponent.children);
        }
    }

    // since don't have child groups, tell schema about children here
    static additionalSchemaChildren = ["_base"];

    static createAttributesObject() {
        let attributes = super.createAttributesObject();
        attributes.rendered = {
            createComponentOfType: "boolean",
            createStateVariable: "rendered",
            defaultValue: this.renderedDefault,
            public: true,
        };
        attributes.isResponse = {
            leaveRaw: true,
        };
        attributes.createComponentOfType = {
            createPrimitiveOfType: "string",
        };
        attributes.numComponents = {
            createPrimitiveOfType: "number",
        };

        attributes.asList = {
            createPrimitiveOfType: "boolean",
            createStateVariable: "asList",
            defaultValue: false,
        };

        return attributes;
    }

    // don't need child groups
    // as all children will remain serialized

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        let componentClass = this;

        stateVariableDefinitions.serializedChildren = {
            returnDependencies: () => ({
                serializedChildren: {
                    dependencyType: "serializedChildren",
                    doNotProxy: true,
                },
            }),
            definition: function ({ dependencyValues }) {
                return {
                    setValue: {
                        serializedChildren: dependencyValues.serializedChildren,
                    },
                };
            },
        };

        stateVariableDefinitions.readyToExpandWhenResolved = {
            returnDependencies: () => ({
                rendered: {
                    dependencyType: "stateVariable",
                    variableName: "rendered",
                },
            }),
            definition: function () {
                return { setValue: { readyToExpandWhenResolved: true } };
            },
            markStale() {
                return { updateReplacements: true };
            },
        };

        stateVariableDefinitions.isVariantComponent = {
            returnDependencies: () => ({}),
            definition: () => ({ setValue: { isVariantComponent: true } }),
        };

        stateVariableDefinitions.generatedVariantInfo = {
            returnDependencies: ({
                sharedParameters,
                componentInfoObjects,
            }) => ({
                variantSeed: {
                    dependencyType: "value",
                    value: sharedParameters.variantSeed,
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
                    useReplacementsForComposites: true,
                    recurseToMatchedChildren: false,
                    variablesOptional: true,
                    includeNonActiveChildren: true,
                    ignoreReplacementsOfEncounteredComposites: true,
                },
            }),
            definition({ dependencyValues, componentIdx }) {
                let generatedVariantInfo = {
                    seed: dependencyValues.variantSeed,
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

                return {
                    setValue: {
                        generatedVariantInfo,
                    },
                };
            },
        };

        stateVariableDefinitions.numComponentsSpecified = {
            returnDependencies: () => ({
                numComponentsAttr: {
                    dependencyType: "attributePrimitive",
                    attributeName: "numComponents",
                },
                typeAttr: {
                    dependencyType: "attributePrimitive",
                    attributeName: "createComponentOfType",
                },
            }),
            definition({ dependencyValues, componentInfoObjects }) {
                let numComponentsSpecified;

                if (dependencyValues.typeAttr) {
                    let componentType =
                        componentInfoObjects.componentTypeLowerCaseMapping[
                            dependencyValues.typeAttr.toLowerCase()
                        ];

                    if (
                        !(
                            componentType in
                            componentInfoObjects.allComponentClasses
                        )
                    ) {
                        throw Error(
                            `Invalid componentType ${dependencyValues.typeAttr} of a ${componentClass.componentType}.`,
                        );
                    }
                    if (dependencyValues.numComponentsAttr !== null) {
                        numComponentsSpecified =
                            dependencyValues.numComponentsAttr;
                    } else {
                        numComponentsSpecified = 1;
                    }
                } else if (dependencyValues.numComponentsAttr !== null) {
                    throw Error(
                        `You must specify createComponentOfType when specifying numComponents for a ${componentClass.componentType}.`,
                    );
                } else {
                    numComponentsSpecified = null;
                }

                return { setValue: { numComponentsSpecified } };
            },
        };

        return stateVariableDefinitions;
    }

    static async createSerializedReplacements({
        component,
        components,
        nComponents,
        componentInfoObjects,
        workspace,
        publicCaseInsensitiveAliasSubstitutions,
    }) {
        let errors = [];
        let warnings = [];

        // evaluate numComponentsSpecified so get error if specify numComponents without createComponentOfType
        await component.stateValues.numComponentsSpecified;

        if (!(await component.stateValues.rendered)) {
            return { replacements: [], errors, warnings, nComponents };
        } else {
            let replacements = deepClone(
                await component.state.serializedChildren.value,
            );

            const stateIdInfo = {
                prefix: `${component.stateId}|`,
                num: workspace.replacementsCreated,
            };

            if ("isResponse" in component.attributes) {
                // pass isResponse to replacements

                for (let repl of replacements) {
                    if (typeof repl !== "object") {
                        continue;
                    }

                    const res = convertUnresolvedAttributesForComponentType({
                        attributes: {
                            isResponse: component.attributes.isResponse,
                        },
                        componentType: repl.componentType,
                        componentInfoObjects,
                        nComponents,
                        stateIdInfo,
                    });

                    nComponents = res.nComponents;
                    const attributesFromComposite = res.attributes;
                    if (!repl.attributes) {
                        repl.attributes = {};
                    }

                    Object.assign(repl.attributes, attributesFromComposite);
                }
            }

            if (workspace.replacementsCreated === undefined) {
                workspace.replacementsCreated = 0;
            }

            let verificationResult = await verifyReplacementsMatchSpecifiedType(
                {
                    component,
                    replacements,
                    componentInfoObjects,
                    compositeAttributesObj: this.createAttributesObject(),
                    components,
                    publicCaseInsensitiveAliasSubstitutions,
                    nComponents,
                    stateIdInfo,
                },
            );
            nComponents = verificationResult.nComponents;
            errors.push(...verificationResult.errors);
            warnings.push(...verificationResult.warnings);

            // console.log(`serialized replacements for ${component.componentIdx}`)
            // console.log(JSON.parse(JSON.stringify(verificationResult.replacements)))

            workspace.replacementsCreated = stateIdInfo.num;

            return {
                replacements: verificationResult.replacements,
                errors,
                warnings,
                nComponents,
            };
        }
    }

    static async calculateReplacementChanges({
        component,
        componentInfoObjects,
        nComponents,
        workspace,
    }) {
        // TODO: don't yet have a way to return errors and warnings!
        let errors = [];
        let warnings = [];

        if (!(await component.stateValues.rendered)) {
            if (
                component.replacements.length > 0 &&
                component.replacementsToWithhold === 0
            ) {
                let replacementsToWithhold = component.replacements.length;
                let replacementInstruction = {
                    changeType: "changeReplacementsToWithhold",
                    replacementsToWithhold,
                };
                return { replacementChanges: [replacementInstruction] };
            } else {
                return { replacementChanges: [] };
            }
        } else {
            if (component.replacements.length > 0) {
                if (component.replacementsToWithhold > 0) {
                    let replacementInstruction = {
                        changeType: "changeReplacementsToWithhold",
                        replacementsToWithhold: 0,
                    };
                    return { replacementChanges: [replacementInstruction] };
                } else {
                    return { replacementChanges: [] };
                }
            } else {
                let createResult = await this.createSerializedReplacements({
                    component,
                    componentInfoObjects,
                    nComponents,
                    workspace,
                });

                let replacements = createResult.replacements;
                errors.push(...createResult.errors);
                warnings.push(...createResult.warnings);
                nComponents = createResult.nComponents;

                let replacementInstruction = {
                    changeType: "add",
                    changeTopLevelReplacements: true,
                    firstReplacementInd: 0,
                    numberReplacementsToReplace: 0,
                    serializedReplacements: replacements,
                    replacementsToWithhold: 0,
                };

                return {
                    replacementChanges: [replacementInstruction],
                    nComponents,
                };
            }
        }
    }

    static setUpVariant({
        serializedComponent,
        sharedParameters,
        descendantVariantComponents,
    }) {
        setUpVariantSeedAndRng({
            serializedComponent,
            sharedParameters,
            descendantVariantComponents,
            useSubpartVariantRng: true,
        });
    }

    get allPotentialRendererTypes() {
        let allPotentialRendererTypes = super.allPotentialRendererTypes;

        let additionalRendererTypes =
            this.potentialRendererTypesFromSerializedComponents(
                this.serializedChildren,
            );
        for (let rendererType of additionalRendererTypes) {
            if (!allPotentialRendererTypes.includes(rendererType)) {
                allPotentialRendererTypes.push(rendererType);
            }
        }

        return allPotentialRendererTypes;
    }
}
