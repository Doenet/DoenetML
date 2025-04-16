import * as ComponentTypes from "../ComponentTypes";

/**
 * `ComponentInfoObjects` is a collection of data structures that describe the components
 * available in DoenetML and their properties.
 */
export type ComponentInfoObjects = {
    /** A record of all the actual component classes, keyed by component type */
    allComponentClasses: Record<string, any>;
    /** A subset of `allComponentClasses`, filtered to just include those components that create variants */
    componentTypesCreatingVariants: Record<string, any>;
    /** A mapping from a lower-cased version of `componentType` to the actual `componentType`
     * of each component available in DoenetML */
    componentTypeLowerCaseMapping: Record<string, string>;
    /** A function that returns `true` if `inheritedComponentType` is inherited from `baseComponentType` */
    isInheritedComponentType: ({
        inheritedComponentType,
        baseComponentType,
    }: {
        inheritedComponentType: string;
        baseComponentType: string;
    }) => boolean;
    /** A function that returns true if `componentType` is a composite component.
     *
     * TODO: determine the criteria for `non-standard` and whether or not that distinction is still relevant.
     */
    isCompositeComponent: ({
        componentType,
        includeNonStandard,
    }: {
        componentType: string;
        includeNonStandard?: boolean;
    }) => boolean;
    /** A record of information about the state variables of a component, keyed by component type */
    stateVariableInfo: Record<string, StateVariableInfo>;
    /** A record of information about the public state variables of a component, keyed by component type */
    publicStateVariableInfo: Record<string, StateVariableInfo>;
    /** A generalization of `isInheritedComponentType` that checks if either a component's componentType
     * or its `createComponentOfType` attribute represent a component that is inherited from `specifiedCType`.
     */
    componentIsSpecifiedType: (
        comp: {
            componentType: string;
            attributes?: { createComponentOfType?: { primitive: string } };
        },
        specifiedCType: string,
    ) => boolean;
};

/**
 * Information about the state variables of a single component type
 */
type StateVariableInfo = {
    stateVariableDescriptions: Record<string, StateVariableDescription>;
    aliases: Record<string, string>;
    arrayEntryPrefixes: Record<string, ArrayEntryPrefixDescription>;
};

/**
 * Information about a particular state variable
 */
type StateVariableDescription = {
    public: boolean;
    isArray: boolean;
    createComponentOfType?: string;
    numDimensions?: number;
    /** See description of returnWrappingComponents in Core.js */
    wrappingComponents?: (
        | string
        | { componentType: string; isAttributeNamed: string }
    )[][];
    entryPrefixes: string[];
};

/**
 * Information about a particular array entry prefix of a component type
 */
type ArrayEntryPrefixDescription = {
    arrayVariableName: string;
    numDimensions: number;
    wrappingComponents: (
        | string
        | { componentType: string; isAttributeNamed: string }
    )[][];
};

/**
 * Create the `componentInfoObjects` collection of data structures that describe the components
 * available in DoenetML and their properties.
 */
export function createComponentInfoObjects(): ComponentInfoObjects {
    /** A record of all the actual component classes, keyed by component type */
    let allComponentClasses: Record<string, any> =
        ComponentTypes.allComponentClasses();
    /** A subset of `allComponentClasses`, filtered to just include those components that create variants */
    let componentTypesCreatingVariants: Record<string, any> =
        ComponentTypes.componentTypesCreatingVariants();

    /** A mapping from a lower-cased version of `componentType` to the actual `componentType`
     * of each component available in DoenetML */
    let componentTypeLowerCaseMapping: Record<string, string> = {};
    for (let componentType in allComponentClasses) {
        componentTypeLowerCaseMapping[componentType.toLowerCase()] =
            componentType;
    }

    /** A record of information about the state variables of a component, keyed by component type */
    let stateVariableInfo: Record<string, StateVariableInfo> = {};
    for (let componentType in allComponentClasses) {
        Object.defineProperty(stateVariableInfo, componentType, {
            get: function () {
                let info =
                    allComponentClasses[
                        componentType
                    ].returnStateVariableInfo();
                delete stateVariableInfo[componentType];
                return (stateVariableInfo[componentType] = info);
                //@ts-ignore
            }.bind(this),
            configurable: true,
        });
    }

    /** A record of information about the public state variables of a component, keyed by component type */
    let publicStateVariableInfo: Record<string, any> = {};
    for (let componentType in allComponentClasses) {
        Object.defineProperty(publicStateVariableInfo, componentType, {
            get: function () {
                let info = allComponentClasses[
                    componentType
                ].returnStateVariableInfo({
                    onlyPublic: true,
                });
                delete publicStateVariableInfo[componentType];
                return (publicStateVariableInfo[componentType] = info);
                //@ts-ignore
            }.bind(this),
            configurable: true,
        });
    }

    /** A function that returns `true` if `inheritedComponentType` is inherited from `baseComponentType` */
    function isInheritedComponentType({
        inheritedComponentType,
        baseComponentType,
    }: {
        inheritedComponentType: string;
        baseComponentType: string;
    }): boolean {
        if (inheritedComponentType === baseComponentType) {
            return true;
        }
        if (inheritedComponentType === "string") {
            return (
                baseComponentType === "_base" || baseComponentType === "_inline"
            );
        } else if (baseComponentType === "string") {
            return false;
        }

        let baseClass = allComponentClasses[baseComponentType];
        if (!baseClass) {
            return false;
        }
        return baseClass.isPrototypeOf(
            allComponentClasses[inheritedComponentType],
        );
    }

    /** A function that returns true if `componentType` is a composite component.
     *
     * TODO: determine the criteria for `non-standard` and whether or not that distinction is still relevant.
     */
    function isCompositeComponent({
        componentType,
        includeNonStandard = true,
    }: {
        componentType: string;
        includeNonStandard?: boolean;
    }): boolean {
        let componentClass = allComponentClasses[componentType];
        if (!componentClass) {
            return false;
        }

        let isComposite = isInheritedComponentType({
            inheritedComponentType: componentType,
            baseComponentType: "_composite",
        });

        return (
            isComposite &&
            (includeNonStandard ||
                !componentClass.treatAsComponentForRecursiveReplacements)
        );
    }

    let componentTypeIsSpecifiedType = (
        cType: string,
        specifiedCType: string,
    ) =>
        isInheritedComponentType({
            inheritedComponentType: cType,
            baseComponentType: specifiedCType,
        });

    /** A generalization of `isInheritedComponentType` that checks if either a component's componentType
     * or its `createComponentOfType` attribute represent a component that is inherited from `specifiedCType`.
     */
    let componentIsSpecifiedType = (
        comp: {
            componentType: string;
            attributes?: { createComponentOfType?: { primitive: string } };
        },
        specifiedCType: string,
    ) =>
        componentTypeIsSpecifiedType(comp.componentType, specifiedCType) ||
        (comp.attributes?.createComponentOfType?.primitive !== undefined &&
            componentTypeIsSpecifiedType(
                comp.attributes?.createComponentOfType?.primitive,
                specifiedCType,
            ));

    return {
        allComponentClasses,
        componentTypesCreatingVariants,
        componentTypeLowerCaseMapping,
        isInheritedComponentType,
        isCompositeComponent,
        stateVariableInfo,
        publicStateVariableInfo,
        componentIsSpecifiedType,
    };
}
