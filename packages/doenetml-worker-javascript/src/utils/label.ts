import { ComponentInfoObjects } from "./componentInfoObjects";
import { SerializedAttribute, SerializedComponent } from "./dast/types";

export function returnLabelAttributes() {
    return {
        labelIsName: {
            createComponentOfType: "boolean",
            createStateVariable: "labelIsName",
            defaultValue: false,
            public: true,
        },
    };
}

export function returnWrapNonLabelsDescriptionsSugarFunction({
    wrappingComponentType,
    createAttributeOfType,
    onlyStringOrMacros = false,
    customWrappingFunction,
    wrapSingleIfNotWrappingComponentType = false,
}: {
    wrappingComponentType: string;
    createAttributeOfType: string;
    onlyStringOrMacros?: boolean;
    customWrappingFunction: (
        arg: (SerializedComponent | string)[],
        nComponents: number,
        stateIdInfo?: { prefix: string; num: number },
    ) => { newChildren: (SerializedComponent | string)[]; nComponents: number };
    wrapSingleIfNotWrappingComponentType?: boolean;
}) {
    return function ({
        matchedChildren,
        componentInfoObjects,
        nComponents,
        stateIdInfo,
    }: {
        matchedChildren: (string | SerializedComponent)[];
        componentInfoObjects: ComponentInfoObjects;
        nComponents: number;
        stateIdInfo?: { prefix: string; num: number };
    }):
        | { success: false }
        | {
              success: true;
              newAttributes?: Record<string, SerializedAttribute>;
              newChildren?: (string | SerializedComponent)[];
              nComponents: number;
          } {
        if (matchedChildren.length === 0) {
            return { success: false as const };
        }

        const componentIsLabelOrDescription = (
            x: SerializedComponent | string,
        ) =>
            typeof x !== "string" &&
            (componentInfoObjects.componentIsSpecifiedType(x, "label") ||
                componentInfoObjects.componentIsSpecifiedType(
                    x,
                    "description",
                ) ||
                componentInfoObjects.componentIsSpecifiedType(
                    x,
                    "shortDescription",
                ));
        if (
            onlyStringOrMacros &&
            !matchedChildren.every(
                (child) =>
                    typeof child === "string" ||
                    (child.extending && "Ref" in child.extending) ||
                    componentIsLabelOrDescription(child),
            )
        ) {
            return { success: false as const };
        }

        // wrap first group of non-label/description children in wrappingComponentType

        let childIsLabelDescription = matchedChildren.map(
            componentIsLabelOrDescription,
        );

        let childrenToWrap: (string | SerializedComponent)[] = [];
        let childrenToNotWrapBegin: (string | SerializedComponent)[] = [];
        let childrenToNotWrapEnd: (string | SerializedComponent)[] = [];

        if (childIsLabelDescription.filter((x) => x).length === 0) {
            childrenToWrap = matchedChildren;
        } else {
            if (childIsLabelDescription[0]) {
                // started with label/description, find first non-label/description child
                const firstNonLabelDescriptionInd =
                    childIsLabelDescription.indexOf(false);
                if (firstNonLabelDescriptionInd !== -1) {
                    childrenToNotWrapBegin = matchedChildren.slice(
                        0,
                        firstNonLabelDescriptionInd,
                    );
                    matchedChildren = matchedChildren.slice(
                        firstNonLabelDescriptionInd,
                    );
                    childIsLabelDescription = childIsLabelDescription.slice(
                        firstNonLabelDescriptionInd,
                    );
                }
            }

            // now we don't have label/description at the beginning
            // find first label/description ind
            const firstLabelDescriptionInd =
                childIsLabelDescription.indexOf(true);
            if (firstLabelDescriptionInd === -1) {
                childrenToWrap = matchedChildren;
            } else {
                childrenToWrap = matchedChildren.slice(
                    0,
                    firstLabelDescriptionInd,
                );
                childrenToNotWrapEnd = matchedChildren.slice(
                    firstLabelDescriptionInd,
                );
            }
        }

        if (childrenToWrap.length === 0) {
            return { success: false as const };
        }

        if (createAttributeOfType) {
            return {
                success: true as const,
                newAttributes: {
                    [createAttributeOfType]: {
                        type: "component",
                        name: createAttributeOfType,
                        component: {
                            type: "serialized",
                            componentType: wrappingComponentType,
                            componentIdx: nComponents++,
                            stateId: stateIdInfo
                                ? `${stateIdInfo.prefix}${stateIdInfo.num++}`
                                : undefined,
                            children: childrenToWrap,
                            attributes: {},
                            state: {},
                            doenetAttributes: {},
                        },
                    },
                },
                newChildren: [
                    ...childrenToNotWrapBegin,
                    ...childrenToNotWrapEnd,
                ],
                nComponents,
            };
        } else {
            // apply only if have a single string/composite or multiple children to wrap
            if (
                (childrenToWrap.length === 1 &&
                    typeof childrenToWrap[0] !== "string" &&
                    (!wrapSingleIfNotWrappingComponentType ||
                        componentInfoObjects.componentIsSpecifiedType(
                            childrenToWrap[0],
                            wrappingComponentType,
                        ))) ||
                childrenToWrap.length === 0
            ) {
                return { success: false as const };
            }

            let wrappedChildren: (string | SerializedComponent)[];
            if (customWrappingFunction) {
                const wrapResult = customWrappingFunction(
                    childrenToWrap,
                    nComponents,
                    stateIdInfo,
                );

                wrappedChildren = wrapResult.newChildren;
                nComponents = wrapResult.nComponents;
            } else {
                wrappedChildren = [
                    {
                        type: "serialized",
                        componentType: wrappingComponentType,
                        componentIdx: nComponents++,
                        stateId: stateIdInfo
                            ? `${stateIdInfo.prefix}${stateIdInfo.num++}`
                            : undefined,
                        children: childrenToWrap,
                        attributes: {},
                        state: {},
                        doenetAttributes: {},
                    },
                ];
            }

            return {
                success: true as const,
                newChildren: [
                    ...childrenToNotWrapBegin,
                    ...wrappedChildren,
                    ...childrenToNotWrapEnd,
                ],
                nComponents,
            };
        }
    };
}

// TODO: lots of work if want to convert state variable definitions to Typescript
export function returnLabelStateVariableDefinitions() {
    let stateVariableDefinitions: Record<string, any> = {};

    stateVariableDefinitions.componentNameAndShadowSourceNames = {
        returnDependencies: () => ({
            shadowSource: {
                dependencyType: "shadowSource",
                variableNames: ["componentNameAndShadowSourceNames"],
            },
            unlinkedCopySource: {
                dependencyType: "unlinkedCopySource",
                variableNames: ["componentNameAndShadowSourceNames"],
            },
            name: {
                dependencyType: "attributePrimitive",
                attributeName: "name",
            },
        }),
        definition({
            dependencyValues,
        }: {
            dependencyValues: {
                shadowSource: any;
                unlinkedCopySource: any;
                name: string | null;
            };
        }) {
            const componentNameAndShadowSourceNames: string[] = [];

            if (dependencyValues.name != null) {
                componentNameAndShadowSourceNames.push(dependencyValues.name);
            }
            if (
                dependencyValues.shadowSource?.stateValues
                    .componentNameAndShadowSourceNames
            ) {
                componentNameAndShadowSourceNames.push(
                    ...dependencyValues.shadowSource.stateValues
                        .componentNameAndShadowSourceNames,
                );
            } else if (
                dependencyValues.unlinkedCopySource?.stateValues
                    .componentNameAndShadowSourceNames
            ) {
                componentNameAndShadowSourceNames.push(
                    ...dependencyValues.unlinkedCopySource.stateValues
                        .componentNameAndShadowSourceNames,
                );
            }
            return { setValue: { componentNameAndShadowSourceNames } };
        },
    };

    stateVariableDefinitions.label = {
        forRenderer: true,
        public: true,
        shadowingInstructions: {
            createComponentOfType: "label",
            addStateVariablesShadowingStateVariables: {
                hasLatex: {
                    stateVariableToShadow: "labelHasLatex",
                },
            },
        },
        hasEssential: true,
        doNotShadowEssential: true,
        defaultValue: "",
        provideEssentialValuesInDefinition: true,
        additionalStateVariablesDefined: [
            {
                variableName: "labelHasLatex",
                forRenderer: true,
            },
        ],
        returnDependencies: () => ({
            labelChild: {
                dependencyType: "child",
                childGroups: ["labels"],
                variableNames: ["value", "hasLatex", "hidden"],
                dontRecurseToShadows: true,
            },
            // Note: assuming component has a labelIsName attribute
            // that creates an attribute component and state variable
            labelIsName: {
                dependencyType: "stateVariable",
                variableName: "labelIsName",
            },
            labelIsNameAttr: {
                dependencyType: "attributeComponent",
                attributeName: "labelIsName",
                dontRecurseToShadows: true,
            },
            componentNameAndShadowSourceNames: {
                dependencyType: "stateVariable",
                variableName: "componentNameAndShadowSourceNames",
            },
            shadowSource: {
                dependencyType: "shadowSource",
                variableNames: ["label", "labelHasLatex"],
            },
            unlinkedCopySource: {
                dependencyType: "unlinkedCopySource",
                variableNames: ["label", "labelHasLatex"],
            },
        }),
        definition({
            dependencyValues,
            essentialValues,
        }: {
            dependencyValues: Record<string, any>;
            essentialValues: Record<string, any>;
        }) {
            let labelChild =
                dependencyValues.labelChild[
                    dependencyValues.labelChild.length - 1
                ];

            if (labelChild) {
                if (labelChild.stateValues.hidden) {
                    return {
                        setValue: {
                            label: "",
                            labelHasLatex: false,
                        },
                    };
                } else {
                    return {
                        setValue: {
                            label: labelChild.stateValues.value,
                            labelHasLatex: labelChild.stateValues.hasLatex,
                        },
                    };
                }
            } else if (essentialValues.label !== undefined) {
                return {
                    useEssentialOrDefaultValue: {
                        label: true,
                    },
                    setValue: { labelHasLatex: false },
                };
            } else if (
                dependencyValues.labelIsName &&
                dependencyValues.labelIsNameAttr
            ) {
                // find a valid name for a label from the component name
                // or the name of one of its shadow targets,

                let label = "_";
                let cNames = dependencyValues.componentNameAndShadowSourceNames;

                for (let cN of cNames) {
                    label = cN;
                    if (label[0] !== "_") {
                        break;
                    }
                }
                if (label[0] === "_") {
                    // if label from componentIdx starts with two underscores,
                    // it is an automatically generated component name that has random characters in it
                    // Don't display name, as they are for internal use only (and the user cannot refer to them)
                    // (Nov 2024) Also now that are phasing out automatically generated names with single _,
                    // don't display those either.
                    return {
                        setValue: {
                            label: "",
                            labelHasLatex: false,
                        },
                    };
                }

                // we have a user supplied name

                if (label.includes("_") || label.includes("-")) {
                    label = label.replace(/[_\-]/g, " ");
                } else if (label.match(/^[a-z]/)) {
                    if (label.match(/[A-Z]/)) {
                        // label starts with a lower case letter and has an upper case letter
                        // treat as camel case and add spaces and lowercase letters
                        label = label.replace(/([A-Z])/g, " $1").toLowerCase();
                    }
                } else if (label.match(/^[A-Z]/)) {
                    if (label.match(/[a-z]/)) {
                        // label starts with a upper case letter and has an lower case letter
                        // treat as pascal case and add spaces
                        label = label.replace(/([A-Z])/g, " $1");
                        label = label.slice(1); // delete extra space at beginning
                    }
                }

                return {
                    setValue: {
                        label,
                        labelHasLatex: false,
                    },
                };
            } else if (
                typeof dependencyValues.shadowSource?.stateValues.label ===
                "string"
            ) {
                return {
                    setValue: {
                        label: dependencyValues.shadowSource.stateValues.label,
                        labelHasLatex: Boolean(
                            dependencyValues.shadowSource.stateValues
                                .labelHasLatex,
                        ),
                    },
                };
            } else if (
                typeof dependencyValues.unlinkedCopySource?.stateValues
                    .label === "string"
            ) {
                return {
                    setValue: {
                        label: dependencyValues.unlinkedCopySource.stateValues
                            .label,
                        labelHasLatex: Boolean(
                            dependencyValues.unlinkedCopySource.stateValues
                                .labelHasLatex,
                        ),
                    },
                };
            } else {
                return {
                    useEssentialOrDefaultValue: { label: true },
                    setValue: { labelHasLatex: false },
                };
            }
        },
        inverseDefinition({
            desiredStateVariableValues,
            dependencyValues,
        }: {
            desiredStateVariableValues: Record<string, any>;
            dependencyValues: Record<string, any>;
        }) {
            if (typeof desiredStateVariableValues.label !== "string") {
                return { success: false };
            }

            let lastLabelInd = dependencyValues.labelChild.length - 1;
            let labelChild = dependencyValues.labelChild[lastLabelInd];

            if (labelChild) {
                return {
                    success: true,
                    instructions: [
                        {
                            setDependency: "labelChild",
                            desiredValue: desiredStateVariableValues.label,
                            childIndex: lastLabelInd,
                            variableIndex: 0,
                        },
                    ],
                };
            } else if (
                dependencyValues.labelIsName &&
                dependencyValues.labelIsNameAttr
            ) {
                return {
                    success: true,
                    instructions: [
                        {
                            setEssentialValue: "label",
                            value: desiredStateVariableValues.label,
                        },
                    ],
                };
            } else if (
                typeof dependencyValues.shadowSource?.stateValues.label ===
                "string"
            ) {
                return {
                    success: true,
                    instructions: [
                        {
                            setDependency: "shadowSource",
                            desiredValue: desiredStateVariableValues.label,
                            variableIndex: 0,
                        },
                    ],
                };
            } else {
                return {
                    success: true,
                    instructions: [
                        {
                            setEssentialValue: "label",
                            value: desiredStateVariableValues.label,
                        },
                    ],
                };
            }
        },
    };

    stateVariableDefinitions.labelForGraph = {
        forRenderer: true,
        returnDependencies: () => ({
            label: {
                dependencyType: "stateVariable",
                variableName: "label",
            },
            labelHasLatex: {
                dependencyType: "stateVariable",
                variableName: "labelHasLatex",
            },
        }),
        definition({
            dependencyValues,
        }: {
            dependencyValues: Record<string, any>;
        }) {
            let labelForGraph;
            if (dependencyValues.labelHasLatex) {
                // when not inside parents
                // replace all _ with &UnderBar; and all ^ with &Hat;
                let nParens = 0;
                labelForGraph = "";
                for (let s of dependencyValues.label) {
                    if (s === "(") {
                        nParens++;
                    } else if (s === ")") {
                        nParens--;
                    } else if (nParens === 0) {
                        if (s === "_") {
                            s = "&UnderBar;";
                        } else if (s === "^") {
                            s = "&Hat;";
                        }
                    }
                    labelForGraph += s;
                }
            } else {
                labelForGraph = dependencyValues.label
                    .replaceAll("_", "&UnderBar;")
                    .replaceAll("^", "&Hat;");
            }

            return { setValue: { labelForGraph } };
        },
    };
    return stateVariableDefinitions;
}
