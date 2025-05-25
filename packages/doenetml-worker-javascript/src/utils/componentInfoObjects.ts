import * as ComponentTypes from "../ComponentTypes";
import { DoenetMLComponentClass } from "./dast/types";

/**
 * `ComponentInfoObjects` is a collection of data structures that describe the components
 * available in DoenetML and their properties.
 */
export type ComponentInfoObjects = {
    /** A record of all the actual component classes, keyed by component type */
    allComponentClasses: Record<string, DoenetMLComponentClass<any>>;
    /** A subset of `allComponentClasses`, filtered to just include those components that create variants */
    componentTypesCreatingVariants: Record<string, DoenetMLComponentClass<any>>;
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
            attributes?: {
                createComponentOfType?: {
                    primitive: { type: "string"; value: string };
                };
            };
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
    const allComponentClasses: Record<
        string,
        DoenetMLComponentClass<any>
    > = ComponentTypes.allComponentClasses() as Record<
        string,
        DoenetMLComponentClass<any>
    >;
    /** A subset of `allComponentClasses`, filtered to just include those components that create variants */
    const componentTypesCreatingVariants: Record<
        string,
        DoenetMLComponentClass<any>
    > = ComponentTypes.componentTypesCreatingVariants() as Record<
        string,
        DoenetMLComponentClass<any>
    >;

    /** A mapping from a lower-cased version of `componentType` to the actual `componentType`
     * of each component available in DoenetML */
    const componentTypeLowerCaseMapping: Record<string, string> = {};
    for (const componentType in allComponentClasses) {
        componentTypeLowerCaseMapping[componentType.toLowerCase()] =
            componentType;
    }

    /** A record of information about the state variables of a component, keyed by component type */
    const stateVariableInfo: Record<string, StateVariableInfo> = {};
    for (const componentType in allComponentClasses) {
        Object.defineProperty(stateVariableInfo, componentType, {
            get: function () {
                const info =
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
    const publicStateVariableInfo: Record<string, any> = {};
    for (const componentType in allComponentClasses) {
        Object.defineProperty(publicStateVariableInfo, componentType, {
            get: function () {
                const info = allComponentClasses[
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
        const componentClass = allComponentClasses[componentType];
        if (!componentClass) {
            return false;
        }

        const isComposite = isInheritedComponentType({
            inheritedComponentType: componentType,
            baseComponentType: "_composite",
        });

        return (
            isComposite &&
            (includeNonStandard ||
                !componentClass.treatAsComponentForRecursiveReplacements)
        );
    }

    const componentTypeIsSpecifiedType = (
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
    const componentIsSpecifiedType = (
        comp: {
            componentType: string;
            attributes?: {
                createComponentOfType?: {
                    primitive: { type: "string"; value: string };
                };
            };
        },
        specifiedCType: string,
    ) =>
        componentTypeIsSpecifiedType(comp.componentType, specifiedCType) ||
        (comp.attributes?.createComponentOfType?.primitive !== undefined &&
            componentTypeIsSpecifiedType(
                comp.attributes?.createComponentOfType?.primitive.value,
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
