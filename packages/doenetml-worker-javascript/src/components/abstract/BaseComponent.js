import createStateProxyHandler from "../../StateProxyHandler";
import { flattenDeep, mapDeep } from "@doenet/utils";
import { deepClone, enumerateCombinations } from "@doenet/utils";
import { gatherVariantComponents } from "../../utils/variants";
import {
    returnDefaultArrayVarNameFromPropIndex,
    returnDefaultGetArrayKeysFromVarName,
} from "../../utils/stateVariables";

export default class BaseComponent {
    constructor({
        componentIdx,
        rootName,
        ancestors,
        serializedComponent,
        definingChildren,
        serializedChildren,
        attributes,
        stateVariableDefinitions,
        componentInfoObjects,
        coreFunctions,
        flags,
        shadow,
        numerics,
        parentSharedParameters,
        sharedParameters,
        refResolution,
    }) {
        this.numerics = numerics;
        this.parentSharedParameters = parentSharedParameters;
        this.sharedParameters = sharedParameters;

        this.componentIdx = componentIdx;
        this.rootName = rootName;
        this.ancestors = ancestors;
        this.counters = {};

        this.componentInfoObjects = componentInfoObjects;
        this.coreFunctions = coreFunctions;
        this.flags = flags;

        if (shadow === true) {
            this.isShadow = true;
        }

        this.definingChildren = definingChildren;
        if (this.definingChildren === undefined) {
            this.definingChildren = [];
        }

        this.serializedChildren = serializedChildren;

        this.attributes = attributes;

        if (refResolution) {
            this.refResolution = refResolution;
        }

        this.state = {};
        for (let stateVariable in stateVariableDefinitions) {
            // need to separately create a shallow copy of each state variable
            // as state variable definitions of multiple variables could be same object
            this.state[stateVariable] = Object.assign(
                {},
                stateVariableDefinitions[stateVariable],
            );
        }
        this.stateValues = new Proxy(this.state, createStateProxyHandler());

        this.essentialState = {};

        if (serializedComponent.state) {
            this.essentialState = deepClone(serializedComponent.state);
        }

        this.doenetAttributes = {};
        if (serializedComponent.doenetAttributes !== undefined) {
            Object.assign(
                this.doenetAttributes,
                serializedComponent.doenetAttributes,
            );
        }

        if (serializedComponent.variants !== undefined) {
            this.variants = serializedComponent.variants;
        }

        if (serializedComponent.position) {
            this.position = serializedComponent.position;
        }
        if (serializedComponent.sourceDoc !== undefined) {
            this.sourceDoc = serializedComponent.sourceDoc;
        }

        if (serializedComponent.childrenPosition) {
            this.childrenPosition = serializedComponent.childrenPosition;
        }

        if (serializedComponent.answerNumber) {
            this.answerNumber = serializedComponent.answerNumber;
        }

        this.actions = {
            copyDoenetMLToClipboard: this.copyDoenetMLToClipboard.bind(this),
        };
    }

    static componentType = "_base";

    static get rendererType() {
        return this.componentType;
    }

    get componentType() {
        return this.constructor.componentType;
    }

    get componentOrAdaptedIdx() {
        if (this.adaptedFrom) {
            return this.adaptedFrom.componentIdx;
        } else {
            return this.componentIdx;
        }
    }

    get rendererType() {
        return this.constructor.rendererType;
    }

    get allPotentialRendererTypes() {
        let allPotentialRendererTypes = ["_error"];
        if (this.rendererType) {
            allPotentialRendererTypes.push(this.rendererType);
        }

        // include any potential renderer type that could be
        // created from a public state variable
        for (let varName in this.state) {
            let stateVarObj = this.state[varName];
            if (stateVarObj.public) {
                let componentTypes = stateVarObj.componentType;
                if (!Array.isArray(componentTypes)) {
                    componentTypes = [componentTypes];
                }
                if (stateVarObj.wrappingComponents) {
                    componentTypes.push(
                        ...flattenDeep(stateVarObj.wrappingComponents).map(
                            (x) =>
                                typeof x === "object" ? x.componentType : x,
                        ),
                    );
                }
                for (let componentType of componentTypes) {
                    let componentClass =
                        this.componentInfoObjects.allComponentClasses[
                            componentType
                        ];
                    if (componentClass) {
                        let rendererType = componentClass.rendererType;
                        if (
                            rendererType &&
                            !allPotentialRendererTypes.includes(rendererType)
                        ) {
                            allPotentialRendererTypes.push(rendererType);
                        }
                    }
                }
            }
        }

        // include renderers from components it could adapt to
        if (this.constructor.adapters) {
            for (let adapterInfo of this.constructor.adapters) {
                let componentType;
                if (typeof adapterInfo === "string") {
                    componentType = adapterInfo;
                } else {
                    componentType = adapterInfo.componentType;
                }
                let componentClass =
                    this.componentInfoObjects.allComponentClasses[
                        componentType
                    ];
                if (componentClass) {
                    let rendererType = componentClass.rendererType;
                    if (
                        rendererType &&
                        !allPotentialRendererTypes.includes(rendererType)
                    ) {
                        allPotentialRendererTypes.push(rendererType);
                    }
                }
            }
        }

        if (!this.rendererType) {
            return allPotentialRendererTypes;
        }

        // recurse to all children
        for (const childIdxStr in this.allChildren) {
            let child = this.allChildren[childIdxStr].component;
            if (typeof child !== "object") {
                continue;
            } else {
                for (let rendererType of child.allPotentialRendererTypes) {
                    if (!allPotentialRendererTypes.includes(rendererType)) {
                        allPotentialRendererTypes.push(rendererType);
                    }
                }
            }
        }

        return allPotentialRendererTypes;
    }

    potentialRendererTypesFromSerializedComponents(serializedComponents) {
        let potentialRendererTypes = [];

        for (let comp of serializedComponents) {
            let compClass =
                this.componentInfoObjects.allComponentClasses[
                    comp.componentType
                ];
            if (compClass) {
                let rendererType = compClass.rendererType;
                if (
                    rendererType &&
                    !potentialRendererTypes.includes(rendererType)
                ) {
                    potentialRendererTypes.push(rendererType);
                }

                // include any potential renderer type that could be
                // created from a public state variable

                let stateVariableDescriptions =
                    compClass.returnStateVariableInfo({
                        onlyPublic: true,
                    }).stateVariableDescriptions;

                for (let varName in stateVariableDescriptions) {
                    let stateDescrip = stateVariableDescriptions[varName];

                    let componentTypes =
                        stateDescrip.shadowingInstructions
                            ?.createComponentOfType;
                    if (!Array.isArray(componentTypes)) {
                        componentTypes = [componentTypes];
                    }
                    if (stateDescrip.wrappingComponents) {
                        componentTypes.push(
                            ...flattenDeep(stateDescrip.wrappingComponents).map(
                                (x) =>
                                    typeof x === "object" ? x.componentType : x,
                            ),
                        );
                    }
                    for (let componentType of componentTypes) {
                        let componentClass =
                            this.componentInfoObjects.allComponentClasses[
                                componentType
                            ];
                        if (componentClass) {
                            let rendererType = componentClass.rendererType;
                            if (
                                rendererType &&
                                !potentialRendererTypes.includes(rendererType)
                            ) {
                                potentialRendererTypes.push(rendererType);
                            }
                        }
                    }
                }

                // include renderers from components it could adapt to
                if (compClass.adapters) {
                    for (let adapterInfo of compClass.adapters) {
                        let componentType;
                        if (typeof adapterInfo === "string") {
                            componentType = adapterInfo;
                        } else {
                            componentType = adapterInfo.componentType;
                        }
                        let componentClass =
                            this.componentInfoObjects.allComponentClasses[
                                componentType
                            ];
                        if (componentClass) {
                            let rendererType = componentClass.rendererType;
                            if (
                                rendererType &&
                                !potentialRendererTypes.includes(rendererType)
                            ) {
                                potentialRendererTypes.push(rendererType);
                            }
                        }
                    }
                }
            }

            if (comp.children) {
                let childRenderTypes =
                    this.potentialRendererTypesFromSerializedComponents(
                        comp.children,
                    );
                for (let rendererType of childRenderTypes) {
                    if (!potentialRendererTypes.includes(rendererType)) {
                        potentialRendererTypes.push(rendererType);
                    }
                }
            }
        }

        return potentialRendererTypes;
    }

    get childrenMatched() {
        return (
            this.childrenMatchedWithPlaceholders &&
            !this.placeholderActiveChildrenIndices
        );
    }
    get matchedCompositeChildren() {
        return (
            this.matchedCompositeChildrenWithPlaceholders &&
            !this.placeholderActiveChildrenIndices
        );
    }

    static createAttributesObject() {
        return {
            name: {
                createPrimitiveOfType: "string",
            },
            hide: {
                createComponentOfType: "boolean",
                createStateVariable: "hide",
                defaultValue: false,
                public: true,
            },
            disabled: {
                createComponentOfType: "boolean",
                createStateVariable: "disabledPreliminary",
                defaultValue: false,
            },
            fixed: {
                createComponentOfType: "boolean",
                createStateVariable: "fixedPreliminary",
                defaultValue: false,
                ignoreFixed: true,
            },
            fixLocation: {
                createComponentOfType: "boolean",
                createStateVariable: "fixLocationPreliminary",
                defaultValue: false,
            },
            modifyIndirectly: {
                createComponentOfType: "boolean",
                createStateVariable: "modifyIndirectly",
                defaultValue: true,
                public: true,
                propagateToProps: true,
                excludeFromSchema: true,
            },
            styleNumber: {
                createComponentOfType: "integer",
                createStateVariable: "styleNumber",
                defaultValue: 1,
                public: true,
                fallBackToParentStateVariable: "styleNumber",
            },
            isResponse: {
                createPrimitiveOfType: "boolean",
                createStateVariable: "isResponse",
                defaultValue: false,
                public: true,
            },
            permid: {
                createPrimitiveOfType: "string",
                createStateVariable: "permid",
                defaultValue: "",
                public: true,
                excludeFromSchema: true,
            },

            // Adding `extend` and `copy` attributes so they are in the schema for all components.
            // These attributes are unused, as the `extend` and `copy` attributes are removed
            // from the dast when references are expanded.
            extend: {
                createReferences: true,
            },
            copy: {
                createReferences: true,
            },
        };
    }

    static returnSugarInstructions() {
        return [];
    }

    static returnChildGroups() {
        return [
            {
                group: "errors",
                componentTypes: ["_error"],
            },
        ];
    }

    static get childGroups() {
        if (this.hasOwnProperty("childGroupsData")) {
            return this.childGroupsData;
        } else {
            this.childGroupsData = this.returnChildGroups();
            return this.childGroupsData;
        }
    }

    static childGroupOfComponentTypeData;

    static get childGroupOfComponentType() {
        if (this.hasOwnProperty("childGroupOfComponentTypeData")) {
            return this.childGroupOfComponentTypeData;
        } else {
            this.childGroupOfComponentTypeData = {};
            return this.childGroupOfComponentTypeData;
        }
    }

    static childGroupIndsByNameData;

    static get childGroupIndsByName() {
        if (this.hasOwnProperty("childGroupIndsByNameData")) {
            return Object.assign({}, this.childGroupIndsByNameData);
        }

        this.childGroupIndsByNameData = {};
        for (let [ind, group] of this.childGroups.entries()) {
            if (group.group in this.childGroupIndsByNameData) {
                throw Error(
                    `Invalid childGroups for componentClass ${this.componentType}: ${group} is repeated`,
                );
            }
            this.childGroupIndsByNameData[group.group] = ind;
        }

        return Object.assign({}, this.childGroupIndsByNameData);
    }

    returnMatchedChildIndices(childGroups) {
        let matchedIndices = [];
        for (let groupName of childGroups) {
            let matches = this.childMatchesByGroup[groupName];
            if (!matches) {
                return undefined;
            }
            matchedIndices.push(...matches);
        }
        return matchedIndices.sort((a, b) => a - b);
    }

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = {};

        stateVariableDefinitions.hidden = {
            public: true,
            shadowingInstructions: {
                createComponentOfType: "boolean",
            },
            forRenderer: true,
            returnDependencies: () => ({
                hide: {
                    dependencyType: "stateVariable",
                    variableName: "hide",
                    variablesOptional: true,
                },
                parentHidden: {
                    dependencyType: "parentStateVariable",
                    variableName: "hidden",
                },
                sourceCompositeHidden: {
                    dependencyType: "sourceCompositeStateVariable",
                    variableName: "hidden",
                },
                adapterSourceHidden: {
                    dependencyType: "adapterSourceStateVariable",
                    variableName: "hidden",
                },
                parentChildrenToHide: {
                    dependencyType: "parentStateVariable",
                    variableName: "childrenToHide",
                },
            }),
            definition: ({ dependencyValues, componentIdx }) => {
                return {
                    setValue: {
                        hidden: Boolean(
                            dependencyValues.parentHidden ||
                            dependencyValues.sourceCompositeHidden ||
                            dependencyValues.adapterSourceHidden ||
                            dependencyValues.hide ||
                            (Array.isArray(
                                dependencyValues.parentChildrenToHide,
                            ) &&
                                dependencyValues.parentChildrenToHide.includes(
                                    componentIdx,
                                )),
                        ),
                    },
                };
            },
            markStale: () => ({ updateParentRenderedChildren: true }),
            inverseDefinition({ desiredStateVariableValues }) {
                return {
                    success: true,
                    instructions: [
                        {
                            setDependency: "hide",
                            desiredValue: desiredStateVariableValues.hidden,
                        },
                    ],
                };
            },
        };

        stateVariableDefinitions.disabled = {
            public: true,
            shadowingInstructions: {
                createComponentOfType: "boolean",
            },
            forRenderer: true,
            hasEssential: true,
            doNotShadowEssential: true,
            defaultValue: false,
            returnDependencies: () => ({
                disabledPreliminary: {
                    dependencyType: "stateVariable",
                    variableName: "disabledPreliminary",
                    variablesOptional: true,
                },
                readOnly: {
                    dependencyType: "flag",
                    flagName: "readOnly",
                },
                parentDisabled: {
                    dependencyType: "parentStateVariable",
                    variableName: "disabled",
                },
                sourceCompositeDisabled: {
                    dependencyType: "sourceCompositeStateVariable",
                    variableName: "disabled",
                },
                adapterSourceDisabled: {
                    dependencyType: "adapterSourceStateVariable",
                    variableName: "disabled",
                },
            }),
            definition({ dependencyValues, usedDefault }) {
                if (dependencyValues.readOnly) {
                    return { setValue: { disabled: true } };
                }

                if (!usedDefault.disabledPreliminary) {
                    return {
                        setValue: {
                            disabled: Boolean(
                                dependencyValues.disabledPreliminary,
                            ),
                        },
                    };
                }

                let disabled = false;
                let useEssential = true;

                if (
                    dependencyValues.parentDisabled !== null &&
                    !usedDefault.parentDisabled
                ) {
                    disabled = disabled || dependencyValues.parentDisabled;
                    useEssential = false;
                }
                if (
                    dependencyValues.sourceCompositeDisabled !== null &&
                    !usedDefault.sourceCompositeDisabled
                ) {
                    disabled =
                        disabled || dependencyValues.sourceCompositeDisabled;
                    useEssential = false;
                }
                if (
                    dependencyValues.adapterSourceDisabled !== null &&
                    !usedDefault.adapterSourceDisabled
                ) {
                    disabled =
                        disabled || dependencyValues.adapterSourceDisabled;
                    useEssential = false;
                }

                if (useEssential) {
                    return {
                        useEssentialOrDefaultValue: {
                            disabled: true,
                        },
                    };
                } else {
                    return { setValue: { disabled } };
                }
            },
            inverseDefinition({
                dependencyValues,
                desiredStateVariableValues,
            }) {
                if (dependencyValues.disabledPreliminary !== null) {
                    return {
                        success: true,
                        instructions: [
                            {
                                setDependency: "disabledPreliminary",
                                desiredValue:
                                    desiredStateVariableValues.disabled,
                            },
                        ],
                    };
                } else {
                    return {
                        success: true,
                        instructions: [
                            {
                                setEssentialValue: "disabled",
                                value: desiredStateVariableValues.disabled,
                            },
                        ],
                    };
                }
            },
        };

        // If fixed is set to true, then the inverseDefinition
        // of any state variable, except those marked with ignoreFixed, will fail.
        // Note that fixed does not influence the forward definition,
        // so that if state variables of a fixed component are based other state variables,
        // and those state variables change, the fixed component's state variable
        // will change to reflect those new values.
        stateVariableDefinitions.fixed = {
            public: true,
            shadowingInstructions: {
                createComponentOfType: "boolean",
            },
            forRenderer: true,
            defaultValue: false,
            hasEssential: true,
            doNotShadowEssential: true,
            ignoreFixed: true,
            returnDependencies: () => ({
                fixedPreliminary: {
                    dependencyType: "stateVariable",
                    variableName: "fixedPreliminary",
                    variablesOptional: true,
                },
                parentFixed: {
                    dependencyType: "parentStateVariable",
                    variableName: "fixed",
                },
                sourceCompositeFixed: {
                    dependencyType: "sourceCompositeStateVariable",
                    variableName: "fixed",
                },
                adapterSourceFixed: {
                    dependencyType: "adapterSourceStateVariable",
                    variableName: "fixed",
                },
                shadowSourceFixed: {
                    dependencyType: "shadowSourceStateVariable",
                    variableName: "fixed",
                },
                shadowSource: {
                    dependencyType: "shadowSource",
                    givePropVariableValue: true,
                },
                ignoreParentFixed: {
                    dependencyType: "doenetAttribute",
                    attributeName: "ignoreParentFixed",
                },
            }),
            definition({ dependencyValues, usedDefault }) {
                if (!usedDefault.fixedPreliminary) {
                    return {
                        setValue: {
                            fixed: dependencyValues.fixedPreliminary,
                        },
                    };
                }

                let fixed = false;
                let useEssential = true;

                if (
                    dependencyValues.parentFixed !== null &&
                    !usedDefault.parentFixed &&
                    !dependencyValues.ignoreParentFixed
                ) {
                    fixed = fixed || dependencyValues.parentFixed;
                    useEssential = false;
                }
                if (
                    dependencyValues.sourceCompositeFixed !== null &&
                    !usedDefault.sourceCompositeFixed
                ) {
                    fixed = fixed || dependencyValues.sourceCompositeFixed;
                    useEssential = false;
                }
                if (
                    dependencyValues.adapterSourceFixed !== null &&
                    !usedDefault.adapterSourceFixed
                ) {
                    fixed = fixed || dependencyValues.adapterSourceFixed;
                    useEssential = false;
                }
                if (
                    dependencyValues.shadowSourceFixed !== null &&
                    !usedDefault.shadowSourceFixed
                ) {
                    // If the shadow source is fixed, then we fix this component, too.
                    // Exception: if we are shadowing the `fixed` state variable itself,
                    // then we do not fix this component, or we will be unable to change the `fixed` state variable.
                    // In this case, the `ignoreFixed` of this state variable is insufficient,
                    // because it will be the `value` state variable that we need to change on the shadow.
                    if (
                        dependencyValues.shadowSource.stateValues &&
                        !("fixed" in dependencyValues.shadowSource.stateValues)
                    ) {
                        fixed = fixed || dependencyValues.shadowSourceFixed;
                        useEssential = false;
                    }
                }

                if (useEssential) {
                    return {
                        useEssentialOrDefaultValue: {
                            fixed: true,
                        },
                    };
                } else {
                    return { setValue: { fixed } };
                }
            },
            inverseDefinition({
                dependencyValues,
                desiredStateVariableValues,
            }) {
                if (dependencyValues.fixedPreliminary !== null) {
                    return {
                        success: true,
                        instructions: [
                            {
                                setDependency: "fixedPreliminary",
                                desiredValue: desiredStateVariableValues.fixed,
                            },
                        ],
                    };
                } else {
                    return {
                        success: true,
                        instructions: [
                            {
                                setEssentialValue: "fixed",
                                value: desiredStateVariableValues.fixed,
                            },
                        ],
                    };
                }
            },
        };

        // If fixLocation is set to true, then the inverseDefinition
        // of any state variable marked with isLocation will fail.
        // The intent is that any variables specifying the location of a graphical object
        // will be marked with isLocation so that authors can set the fixLocation attribute
        // on components that should stay in the same location but should be modifiable
        // in other respects.
        // Note that fixLocation does not influence the forward definition,
        // so that if an component with fixedLocation set has a location state variable
        // that is based on other state variables,
        // and those state variables change, the location state variable
        // will change to reflect those new values.
        stateVariableDefinitions.fixLocation = {
            public: true,
            shadowingInstructions: {
                createComponentOfType: "boolean",
            },
            forRenderer: true,
            defaultValue: false,
            hasEssential: true,
            doNotShadowEssential: true,
            returnDependencies: () => ({
                fixLocationPreliminary: {
                    dependencyType: "stateVariable",
                    variableName: "fixLocationPreliminary",
                    variablesOptional: true,
                },
                parentFixLocation: {
                    dependencyType: "parentStateVariable",
                    variableName: "fixLocation",
                },
                sourceCompositeFixLocation: {
                    dependencyType: "sourceCompositeStateVariable",
                    variableName: "fixLocation",
                },
                adapterSourceFixLocation: {
                    dependencyType: "adapterSourceStateVariable",
                    variableName: "fixLocation",
                },
                shadowSourceFixLocation: {
                    dependencyType: "shadowSourceStateVariable",
                    variableName: "fixLocation",
                },
            }),
            definition({ dependencyValues, usedDefault }) {
                if (!usedDefault.fixLocationPreliminary) {
                    return {
                        setValue: {
                            fixLocation:
                                dependencyValues.fixLocationPreliminary,
                        },
                    };
                }

                let fixLocation = false;
                let useEssential = true;

                if (
                    dependencyValues.parentFixLocation !== null &&
                    !usedDefault.parentFixLocation
                ) {
                    fixLocation =
                        fixLocation || dependencyValues.parentFixLocation;
                    useEssential = false;
                }
                if (
                    dependencyValues.sourceCompositeFixLocation !== null &&
                    !usedDefault.sourceCompositeFixLocation
                ) {
                    fixLocation =
                        fixLocation ||
                        dependencyValues.sourceCompositeFixLocation;
                    useEssential = false;
                }
                if (
                    dependencyValues.adapterSourceFixLocation !== null &&
                    !usedDefault.adapterSourceFixLocation
                ) {
                    fixLocation =
                        fixLocation ||
                        dependencyValues.adapterSourceFixLocation;
                    useEssential = false;
                }
                if (
                    dependencyValues.shadowSourceFixLocation !== null &&
                    !usedDefault.shadowSourceFixLocation
                ) {
                    fixLocation =
                        fixLocation || dependencyValues.shadowSourceFixLocation;
                    useEssential = false;
                }

                if (useEssential) {
                    return {
                        useEssentialOrDefaultValue: {
                            fixLocation: true,
                        },
                    };
                } else {
                    return { setValue: { fixLocation } };
                }
            },
            inverseDefinition({
                dependencyValues,
                desiredStateVariableValues,
            }) {
                if (dependencyValues.fixLocationPreliminary !== null) {
                    return {
                        success: true,
                        instructions: [
                            {
                                setDependency: "fixLocationPreliminary",
                                desiredValue:
                                    desiredStateVariableValues.fixLocation,
                            },
                        ],
                    };
                } else {
                    return {
                        success: true,
                        instructions: [
                            {
                                setEssentialValue: "fixLocation",
                                value: desiredStateVariableValues.fixLocation,
                            },
                        ],
                    };
                }
            },
        };

        stateVariableDefinitions.isInactiveCompositeReplacement = {
            defaultValue: false,
            hasEssential: true,
            returnDependencies: () => ({}),
            definition: () => ({
                useEssentialOrDefaultValue: {
                    isInactiveCompositeReplacement: true,
                },
            }),
            inverseDefinition({ desiredStateVariableValues }) {
                return {
                    success: true,
                    instructions: [
                        {
                            setEssentialValue: {
                                variableName: "isInactiveCompositeReplacement",
                                value: desiredStateVariableValues.isInactiveCompositeReplacement,
                            },
                        },
                    ],
                };
            },
        };

        stateVariableDefinitions.doenetML = {
            public: true,
            shadowingInstructions: {
                createComponentOfType: "text",
            },
            returnDependencies: () => ({
                doenetML: {
                    dependencyType: "doenetML",
                },
            }),
            definition({ dependencyValues }) {
                let doenetML = dependencyValues.doenetML;
                if (!doenetML) {
                    doenetML = "";
                }
                return { setValue: { doenetML } };
            },
        };

        return stateVariableDefinitions;
    }

    static returnNormalizedStateVariableDefinitions(numerics) {
        // return state variable definitions
        // where have added additionalStateVariablesDefined

        //  add state variable definitions from component class
        let newDefinitions = this.returnStateVariableDefinitions(numerics);

        if (!newDefinitions) {
            throw Error(
                `Error in state variable definitions of ${this.componentType}: returnStateVariableDefinitions did not return anything`,
            );
        }

        let cleanAdditionalStateVariableDefined = function (
            additionalStateVariablesDefined,
        ) {
            for (let [
                ind,
                varObj,
            ] of additionalStateVariablesDefined.entries()) {
                if (typeof varObj === "object") {
                    additionalStateVariablesDefined[ind] = varObj.variableName;
                }
            }
        };

        let defAttributesToCopy = [
            "returnDependencies",
            "definition",
            "inverseDefinition",
            "stateVariablesDeterminingDependencies",
            "stateVariablesDeterminingArraySizeDependencies",
            "isArray",
            "numDimensions",
            "returnArraySizeDependencies",
            "returnArraySize",
            "returnArrayDependenciesByKey",
            "arrayDefinitionByKey",
            "inverseArrayDefinitionByKey",
            "basedOnArrayKeyStateVariables",
            "markStale",
            "getPreviousDependencyValuesForMarkStale",
            "determineDependenciesImmediately",
            "createWorkspace",
            "workspace",
            "provideEssentialValuesInDefinition",
            "providePreviousValuesInDefinition",
            "isLocation",
        ];

        let stateVariableDefinitions = {};

        for (let varName in newDefinitions) {
            let thisDef = newDefinitions[varName];
            stateVariableDefinitions[varName] = thisDef;

            if (thisDef.createWorkspace) {
                thisDef.workspace = {};
            }

            if (thisDef.additionalStateVariablesDefined) {
                for (let [
                    ind,
                    otherVarObj,
                ] of thisDef.additionalStateVariablesDefined.entries()) {
                    let defCopy = {};
                    for (let attr of defAttributesToCopy) {
                        if (attr in thisDef) {
                            defCopy[attr] = thisDef[attr];
                        }
                    }
                    defCopy.additionalStateVariablesDefined = [
                        ...thisDef.additionalStateVariablesDefined,
                    ];
                    defCopy.additionalStateVariablesDefined[ind] = varName;
                    cleanAdditionalStateVariableDefined(
                        defCopy.additionalStateVariablesDefined,
                    );

                    let otherVarName = otherVarObj;

                    // if otherVarObj is actually an object (rather than a string)
                    // then get variableName and assign other attributes
                    // to the copied state variable definition
                    if (typeof otherVarObj === "object") {
                        otherVarName = otherVarObj.variableName;
                        otherVarObj = Object.assign({}, otherVarObj);
                        delete otherVarObj.variableName;
                        Object.assign(defCopy, otherVarObj);
                    }

                    stateVariableDefinitions[otherVarName] = defCopy;
                }

                cleanAdditionalStateVariableDefined(
                    thisDef.additionalStateVariablesDefined,
                );
            }
        }

        return stateVariableDefinitions;
    }

    static returnStateVariableInfo({
        onlyPublic = false,
        onlyForRenderer = false,
    } = {}) {
        let attributeObject = this.createAttributesObject();

        let stateVariableDescriptions = {};
        let arrayEntryPrefixes = {};
        let aliases = {};

        for (let attrName in attributeObject) {
            let attrObj = attributeObject[attrName];
            let varName = attrObj.createStateVariable;
            if (varName) {
                if (
                    (!onlyPublic || attrObj.public) &&
                    (!onlyForRenderer || attrObj.forRenderer)
                ) {
                    if (attrObj.public) {
                        let attributeFromPrimitive =
                            !attrObj.createComponentOfType;
                        let createComponentOfType;
                        if (attributeFromPrimitive) {
                            createComponentOfType =
                                attrObj.createPrimitiveOfType;
                            if (createComponentOfType === "string") {
                                createComponentOfType = "text";
                            }
                        } else {
                            createComponentOfType =
                                attrObj.createComponentOfType;
                        }
                        stateVariableDescriptions[varName] = {
                            createComponentOfType,
                            public: true,
                            isArray: false,
                        };
                    } else {
                        stateVariableDescriptions[varName] = {
                            public: false,
                            isArray: false,
                        };
                    }
                }
            }
        }

        let stateDef = this.returnNormalizedStateVariableDefinitions();

        for (let varName in stateDef) {
            let theStateDef = stateDef[varName];
            if (theStateDef.isAlias) {
                aliases[varName] = theStateDef.targetVariableName;
                continue;
            }
            if (
                (!onlyPublic || theStateDef.public) &&
                (!onlyForRenderer || theStateDef.forRenderer)
            ) {
                if (theStateDef.public) {
                    stateVariableDescriptions[varName] = {
                        createComponentOfType:
                            theStateDef.shadowingInstructions
                                .createComponentOfType,
                        public: true,
                        isArray: Boolean(theStateDef.isArray),
                    };
                } else {
                    stateVariableDescriptions[varName] = {
                        public: false,
                        isArray: Boolean(theStateDef.isArray),
                    };
                }
                if (theStateDef.isArray) {
                    stateVariableDescriptions[varName].isArray = true;
                    stateVariableDescriptions[varName].numDimensions =
                        theStateDef.numDimensions === undefined
                            ? 1
                            : theStateDef.numDimensions;
                    stateVariableDescriptions[varName].wrappingComponents =
                        theStateDef.shadowingInstructions
                            ?.returnWrappingComponents
                            ? theStateDef.shadowingInstructions.returnWrappingComponents()
                            : [];

                    stateVariableDescriptions[varName].indexAliases =
                        theStateDef.indexAliases;

                    let entryPrefixes;
                    if (theStateDef.entryPrefixes) {
                        entryPrefixes = theStateDef.entryPrefixes;
                    } else {
                        entryPrefixes = [varName];
                    }
                    for (let prefix of entryPrefixes) {
                        arrayEntryPrefixes[prefix] = {
                            arrayVariableName: varName,
                            numDimensions: theStateDef.returnEntryDimensions
                                ? theStateDef.returnEntryDimensions(prefix)
                                : 0,
                            wrappingComponents: theStateDef
                                .shadowingInstructions?.returnWrappingComponents
                                ? theStateDef.shadowingInstructions.returnWrappingComponents(
                                      prefix,
                                  )
                                : [],
                        };
                    }
                    if (theStateDef.getArrayKeysFromVarName) {
                        stateVariableDescriptions[
                            varName
                        ].getArrayKeysFromVarName =
                            theStateDef.getArrayKeysFromVarName;
                    } else {
                        stateVariableDescriptions[
                            varName
                        ].getArrayKeysFromVarName =
                            returnDefaultGetArrayKeysFromVarName(
                                stateVariableDescriptions[varName]
                                    .numDimensions,
                            );
                    }
                    if (theStateDef.arrayVarNameFromPropIndex) {
                        stateVariableDescriptions[
                            varName
                        ].arrayVarNameFromPropIndex =
                            theStateDef.arrayVarNameFromPropIndex;
                    } else {
                        stateVariableDescriptions[
                            varName
                        ].arrayVarNameFromPropIndex =
                            returnDefaultArrayVarNameFromPropIndex(
                                stateVariableDescriptions[varName]
                                    .numDimensions,
                                entryPrefixes[0],
                            );
                    }
                }
            }
        }

        return { stateVariableDescriptions, arrayEntryPrefixes, aliases };
    }

    get parentIdx() {
        if (this.ancestors === undefined || this.ancestors.length === 0) {
            return;
        }
        return this.ancestors[0].componentIdx;
    }

    get allDescendants() {
        let descendants = [];
        for (let name in this.allChildren) {
            let child = this.allChildren[name].component;
            descendants = [...descendants, name, ...child.allDescendants];
        }
        return descendants;
    }

    async serialize(parameters = {}) {
        if (parameters.errorIfEncounterComponent?.includes(this.componentIdx)) {
            throw Error("Encountered " + this.componentIdx);
        }

        let includeDefiningChildren = true;
        // let stateVariablesToInclude = [];

        const serializedComponent = {
            type: "serialized",
            componentType: this.componentType,
            componentIdx: this.componentIdx,
            children: [],
            attributes: {},
            doenetAttributes: {},
            state: {},
            sourceDoc: this.sourceDoc,
        };

        let serializedChildren = [];

        let parametersForChildren = { ...parameters };

        let primitiveSourceAttributesToIgnore;
        if (parameters.primitiveSourceAttributesToIgnore) {
            primitiveSourceAttributesToIgnore =
                parameters.primitiveSourceAttributesToIgnore;
        } else {
            primitiveSourceAttributesToIgnore = [];
        }

        let componentSourceAttributesToIgnore;
        if (parameters.componentSourceAttributesToIgnore) {
            componentSourceAttributesToIgnore =
                parameters.componentSourceAttributesToIgnore;
        } else {
            componentSourceAttributesToIgnore = [];
        }

        if (includeDefiningChildren) {
            if (
                this.constructor.serializeReplacementsForChildren &&
                this.isExpanded &&
                (!("rendered" in this.state) ||
                    (await this.state.rendered.value))
            ) {
                for (let repl of this.replacements) {
                    if (typeof repl !== "object") {
                        serializedChildren.push(repl);
                    } else {
                        serializedChildren.push(
                            await repl.serialize(parametersForChildren),
                        );
                    }
                }
            } else {
                for (let child of this.definingChildren) {
                    if (typeof child !== "object") {
                        serializedChildren.push(child);
                    } else {
                        serializedChildren.push(
                            await child.serialize(parametersForChildren),
                        );
                    }
                }

                if (this.serializedChildren !== undefined) {
                    // if this component has `copyInChildren` set,
                    // then its serialized children will have actual components made from them,
                    // so they should be shadowed.
                    let shadowComponents =
                        this.attributes.copyInChildren?.primitive?.value;
                    for (let child of this.serializedChildren) {
                        serializedChildren.push(
                            this.copySerializedComponent(
                                child,
                                shadowComponents,
                            ),
                        );
                    }
                }
            }

            if (serializedChildren.length > 0) {
                serializedComponent.children = serializedChildren;
            }
        }

        for (let attrName in this.attributes) {
            let attribute = this.attributes[attrName];
            if (attribute.component) {
                // only copy attribute components if copy all and not set to be ignored
                // Note that, unlike for the primitive case, below,
                // attributeToIgnore supersedes copyAll.
                // As of Nov 2024, the only componentSourceAttributesToIgnore
                // is labelIsName when copying without link.
                if (
                    parameters.copyAll &&
                    !componentSourceAttributesToIgnore.includes(attrName)
                    //  || this.constructor.copyComponentAttributes?.includes(attrName)
                ) {
                    serializedComponent.attributes[attrName] = {
                        type: "component",
                        component: await attribute.component.serialize(
                            parametersForChildren,
                        ),
                        sourceDoc: attribute.component.sourceDoc,
                    };
                }
            } else if (attribute.references) {
                const references = [];

                for (const refComp of attribute.references) {
                    references.push(
                        await refComp.serialize(parametersForChildren),
                    );
                }

                serializedComponent.attributes[attrName] = {
                    type: "references",
                    references,
                    stringChildren: attribute.stringChildren,
                    sourceDoc: attribute.sourceDoc,
                };
            } else {
                // copy others if copy all or not set to be ignored
                if (
                    !primitiveSourceAttributesToIgnore.includes(attrName) ||
                    parameters.copyAll
                ) {
                    serializedComponent.attributes[attrName] = JSON.parse(
                        JSON.stringify(attribute),
                    );
                    // // set to create a new componentIdx
                    // if (attrName === "createComponentIdx") {
                    //     serializedComponent.attributes.createComponentIdx.primitive.value =
                    //         nComponents++;
                    // }
                }
            }
        }

        // always copy essential state
        if (
            this.essentialState &&
            Object.keys(this.essentialState).length > 0
        ) {
            serializedComponent.state = deepClone(this.essentialState);
        }

        if (
            parameters.copyPrimaryEssential ||
            (parameters.copyPrimaryEssentialIfShadow && this.shadows)
        ) {
            let primaryEssentialStateVariable = "value";
            if (this.constructor.primaryEssentialStateVariable) {
                primaryEssentialStateVariable =
                    this.constructor.primaryEssentialStateVariable;
            } else if (this.constructor.primaryStateVariableForDefinition) {
                primaryEssentialStateVariable =
                    this.constructor.primaryStateVariableForDefinition;
            }

            if (this.state[primaryEssentialStateVariable]) {
                // primaryEssentialStateVariable is the state variable we want to set in the copy,
                // but it might have a differently named essential state variable
                // associated with it.
                if (
                    this.state[primaryEssentialStateVariable].essentialVarName
                ) {
                    primaryEssentialStateVariable =
                        this.state[primaryEssentialStateVariable]
                            .essentialVarName;
                }

                let stateVariableToBeShadowed = "value";
                if (this.constructor.stateVariableToBeShadowed) {
                    stateVariableToBeShadowed =
                        this.constructor.stateVariableToBeShadowed;
                } else if (this.constructor.primaryStateVariableForDefinition) {
                    stateVariableToBeShadowed =
                        this.constructor.primaryStateVariableForDefinition;
                }

                if (this.state[stateVariableToBeShadowed]) {
                    // copy the value of stateVariableToBeShadowed of source
                    // to the state of primaryEssentialStateVariable of the copy
                    if (!serializedComponent.state) {
                        serializedComponent.state = {};
                    }

                    serializedComponent.state[primaryEssentialStateVariable] =
                        await this.stateValues[stateVariableToBeShadowed];
                }
            }
        }

        if (
            parameters.copyEssentialState ||
            (parameters.copyEssentialStateIfShadow && this.shadows)
        ) {
            for (let varName in this.state) {
                if (!(varName in serializedComponent.state)) {
                    let stateVar = this.state[varName];
                    if (stateVar.hasEssential) {
                        const value = await this.stateValues[varName];
                        if (!stateVar.usedDefault) {
                            serializedComponent.state[varName] = value;
                        }
                    }
                }
            }
        }

        if (this.position) {
            serializedComponent.position = JSON.parse(
                JSON.stringify(this.position),
            );
        }

        if (this.childrenPosition) {
            serializedComponent.childrenPosition = JSON.parse(
                JSON.stringify(this.childrenPosition),
            );
        }

        if (parameters.copyVariants) {
            if (this.state.generatedVariantInfo) {
                serializedComponent.variants = {
                    desiredVariant: await this.stateValues.generatedVariantInfo,
                };
            }
        }

        serializedComponent.originalIdx = this.componentIdx;
        serializedComponent.originalDoenetAttributes = deepClone(
            this.doenetAttributes,
        );
        serializedComponent.doenetAttributes = deepClone(this.doenetAttributes);
        serializedComponent.originalAttributes = deepClone(
            serializedComponent.attributes,
        );
        // XXX: lost whether this was a Ref, an ExtendAttribute or a CopyAttribute
        if (this.refResolution) {
            serializedComponent.extending = {
                Ref: {
                    nodeIdx: this.refResolution.nodeIdx,
                    unresolvedPath: deepClone(
                        this.refResolution.unresolvedPath,
                    ),
                    originalPath: await this.serializePath(
                        this.refResolution.originalPath,
                        parametersForChildren,
                    ),
                    nodesInResolvedPath: deepClone(
                        this.refResolution.nodesInResolvedPath,
                    ),
                },
            };
        }

        // delete serializedComponent.attributes.name;
        delete serializedComponent.doenetAttributes.prescribedName;

        return serializedComponent;
    }

    async serializePath(path, parametersForChildren) {
        if (path == null) {
            return path;
        }

        let newPath = [];

        for (const pathPart of path) {
            const newPathPart = {
                name: pathPart.name,
                position: pathPart.position,
                sourceDoc: pathPart.sourceDoc,
                index: [],
            };

            for (const index of pathPart.index) {
                const newIndex = {
                    position: index.position,
                    sourceDoc: index.sourceDoc,
                    value: [],
                };
                for (let comp of index.value) {
                    if (typeof comp !== "object") {
                        newIndex.value.push(comp);
                    } else {
                        newIndex.value.push(
                            await comp.serialize(parametersForChildren),
                        );
                    }
                }
                newPathPart.index.push(newIndex);
            }

            newPath.push(newPathPart);
        }
        return newPath;
    }

    copySerializedComponent(serializedComponent, shadowComponents = false) {
        if (typeof serializedComponent !== "object") {
            return serializedComponent;
        }

        let serializedChildren = [];
        if (serializedComponent.children !== undefined) {
            // XXX: should we set `shadowComponents` recursively here?
            for (let child of serializedComponent.children) {
                serializedChildren.push(this.copySerializedComponent(child));
            }
        }

        let serializedCopy = {
            type: "serialized",
            componentType: serializedComponent.componentType,
            componentIdx: serializedComponent.componentIdx,
            originalIdx: serializedComponent.componentIdx,
            dontShadowOriginalIndex: !shadowComponents,
            children: serializedChildren,
            state: {},
            doenetAttributes: {},
            attributes: {},
            sourceDoc: serializedComponent.sourceDoc,
        };

        if (serializedComponent.doenetAttributes != undefined) {
            serializedCopy.originalDoenetAttributes = deepClone(
                serializedComponent.doenetAttributes,
            );
            serializedCopy.doenetAttributes = deepClone(
                serializedComponent.doenetAttributes,
            );
            delete serializedCopy.doenetAttributes.prescribedName;
        }

        if (serializedComponent.attributes != undefined) {
            serializedCopy.attributes = deepClone(
                serializedComponent.attributes,
            );
            serializedCopy.originalAttributes = deepClone(
                serializedComponent.attributes,
            );
        }

        if (serializedComponent.extending != undefined) {
            serializedCopy.extending = deepClone(serializedComponent.extending);
        }

        if (serializedComponent.position !== undefined) {
            serializedCopy.position = deepClone(serializedComponent.position);
        }

        if (serializedComponent.state !== undefined) {
            // shallow copy of state
            Object.assign(serializedCopy.state, serializedComponent.state);
        }

        return serializedCopy;
    }

    // TODO: this function is not being used (7/13/2025). Delete it?
    copySerializedComponentToDast(serializedComponent) {
        if (typeof serializedComponent !== "object") {
            return { type: "text", value: serializedComponent };
        }

        let dastChildren = [];
        if (serializedComponent.children !== undefined) {
            for (let child of serializedComponent.children) {
                dastChildren.push(this.copySerializedComponentToDast(child));
            }
        }

        let dastCopy = {
            type: "element",
            name: serializedComponent.componentType,
            attributes: {
                originalIdx: {
                    type: "attribute",
                    name: "originalIdx",
                    children: [
                        {
                            type: "text",
                            value: serializedComponent.componentIdx.toString(),
                        },
                    ],
                },
            },
            children: dastChildren,
        };

        if (serializedComponent.attributes.name) {
            dastElement.attributes.name = {
                type: "attribute",
                name: "name",
                children: [
                    {
                        type: "text",
                        value: serializedComponent.attributes.name.primitive
                            .value,
                    },
                ],
            };
        }

        if (serializedComponent.position !== undefined) {
            dastCopy.position = deepClone(serializedComponent.position);
        }

        return dastCopy;
    }

    static adapters = [];

    static get numAdapters() {
        return this.adapters.length;
    }

    getAdapter(ind) {
        if (ind >= this.constructor.adapters.length) {
            return;
        }

        let adapter = this.constructor.adapters[ind];

        let adapterStateVariable;
        let adapterComponentType;
        let substituteForPrimaryStateVariable;
        let stateVariablesToShadow;

        // adapter could be either
        // - a string specifying a public state variable, or
        // - an object specify a public state variable and, optionally
        //   a component type and a state variable for the new component
        if (typeof adapter === "string") {
            adapterStateVariable = adapter;
        } else {
            adapterStateVariable = adapter.stateVariable;
            adapterComponentType = adapter.componentType;
            substituteForPrimaryStateVariable =
                adapter.substituteForPrimaryStateVariable;
            stateVariablesToShadow = adapter.stateVariablesToShadow;
        }

        // look in state for matching public value
        let stateFromAdapter = this.state[adapterStateVariable];
        if (
            stateFromAdapter === undefined ||
            (!stateFromAdapter.public && !adapterComponentType)
        ) {
            throw Error(
                "Invalid adapter " +
                    adapterStateVariable +
                    " in " +
                    this.componentType,
            );
        }

        if (adapterComponentType === undefined) {
            // if didn't override componentType, use componentType from state variable
            adapterComponentType =
                stateFromAdapter.shadowingInstructions.createComponentOfType;
        }

        return {
            type: "serialized",
            componentType: adapterComponentType,
            attribute: {},
            children: [],
            doenetAttributes: [],
            downstreamDependencies: {
                [this.componentIdx]: [
                    {
                        dependencyType: "adapter",
                        adapterVariable: adapterStateVariable,
                        adapterTargetIdentity: {
                            componentIdx: this.componentIdx,
                            componentType: this.componentType,
                        },
                        substituteForPrimaryStateVariable,
                        stateVariablesToShadow,
                    },
                ],
            },
        };
    }

    static getAdapterComponentType(ind, publicStateVariableInfo) {
        if (ind >= this.adapters.length) {
            return;
        }

        let adapter = this.adapters[ind];

        let adapterStateVariable;
        let adapterComponentType;

        // adapter could be either
        // - a string specifying a public state variable, or
        // - an object specify a public state variable and, optionally
        //   a component type and a state variable for the new component
        if (typeof adapter === "string") {
            adapterStateVariable = adapter;
        } else {
            adapterStateVariable = adapter.stateVariable;
            adapterComponentType = adapter.componentType;
        }

        if (adapterComponentType === undefined) {
            // if didn't override componentType, use createComponentOfType from state variable

            let stateVarInfo = publicStateVariableInfo[this.componentType];

            let varInfo =
                stateVarInfo.stateVariableDescriptions[adapterStateVariable];
            if (!varInfo) {
                throw Error(
                    "Invalid adapter " +
                        adapterStateVariable +
                        " in " +
                        this.componentType,
                );
            }

            adapterComponentType = varInfo.createComponentOfType;

            if (!adapterComponentType) {
                throw Error(
                    `Couldn't get adapter component type for ${adapterStateVariable} of componentType ${this.componentType}`,
                );
            }
        }

        return adapterComponentType;
    }

    static determineNumberOfUniqueVariants({
        serializedComponent,
        componentInfoObjects,
    }) {
        let numVariants = serializedComponent.variants?.numVariants;

        if (numVariants !== undefined) {
            return { success: true, numVariants };
        }

        let descendantVariantComponents = [];

        if (serializedComponent.children) {
            descendantVariantComponents = gatherVariantComponents({
                serializedComponents: serializedComponent.children,
                componentInfoObjects,
            });
        }

        if (serializedComponent.variants === undefined) {
            serializedComponent.variants = {};
        }

        serializedComponent.variants.descendantVariantComponents =
            descendantVariantComponents;

        // number of variants is the product of
        // number of variants for each descendantVariantComponent
        numVariants = 1;

        let numVariantsByDescendant = [];
        for (let descendant of descendantVariantComponents) {
            let descendantClass =
                componentInfoObjects.allComponentClasses[
                    descendant.componentType
                ];
            let result = descendantClass.determineNumberOfUniqueVariants({
                serializedComponent: descendant,
                componentInfoObjects,
            });
            if (!result.success) {
                return { success: false };
            }
            numVariantsByDescendant.push(result.numVariants);
            numVariants *= result.numVariants;
        }

        if (!(numVariants > 0)) {
            return { success: false };
        }

        serializedComponent.variants.numVariants = numVariants;
        serializedComponent.variants.uniqueVariantData = {
            numVariantsByDescendant,
        };

        return { success: true, numVariants };
    }

    static getUniqueVariant({
        serializedComponent,
        variantIndex,
        componentInfoObjects,
    }) {
        let numVariants = serializedComponent.variants?.numVariants;
        if (numVariants === undefined) {
            return { success: false };
        }

        if (
            !Number.isInteger(variantIndex) ||
            variantIndex < 1 ||
            variantIndex > numVariants
        ) {
            return { success: false };
        }

        let haveNontrivialSubvariants = false;

        let numVariantsByDescendant =
            serializedComponent.variants.uniqueVariantData
                .numVariantsByDescendant;
        let descendantVariantComponents =
            serializedComponent.variants.descendantVariantComponents;

        let subvariants = [];

        if (descendantVariantComponents.length > 0) {
            let indicesForEachDescendant = enumerateCombinations({
                numberOfOptionsByIndex: numVariantsByDescendant,
                maxNumber: variantIndex,
            })[variantIndex - 1].map((x) => x + 1);

            // for each descendant, get unique variant corresponding
            // to the selected variant number and include that as a subvariant

            for (
                let descendantNum = 0;
                descendantNum < numVariantsByDescendant.length;
                descendantNum++
            ) {
                if (numVariantsByDescendant[descendantNum] > 1) {
                    let descendant = descendantVariantComponents[descendantNum];
                    let compClass =
                        componentInfoObjects.allComponentClasses[
                            descendant.componentType
                        ];
                    let result = compClass.getUniqueVariant({
                        serializedComponent: descendant,
                        variantIndex: indicesForEachDescendant[descendantNum],
                        componentInfoObjects,
                    });
                    if (!result.success) {
                        return { success: false };
                    }
                    subvariants.push(result.desiredVariant);
                    haveNontrivialSubvariants = true;
                } else {
                    subvariants.push({});
                }
            }
        }

        let desiredVariant = { index: variantIndex };
        if (haveNontrivialSubvariants) {
            desiredVariant.subvariants = subvariants;
        }

        return { success: true, desiredVariant };
    }

    // An action that can be called from DoenetML with a `<callAction>`
    // that will copy the DoenetML of the targeted component to the clipboard
    // (assuming the component was in the original source file).
    // TODO: add test
    // TODO: add documentation
    async copyDoenetMLToClipboard({ actionId }) {
        let doenetML = await this.stateValues.doenetML;

        if (doenetML) {
            this.coreFunctions.copyToClipboard({ text: doenetML, actionId });
        }
    }
}
