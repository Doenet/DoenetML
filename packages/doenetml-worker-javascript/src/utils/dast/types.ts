import { Position, RefResolution, Source } from "@doenet/doenetml-worker";

/**
 * A JSON representation of an instance of a DoenetML component
 */
export type SerializedComponent = {
    type: "serialized";
    componentType: string;
    children: (SerializedComponent | string)[];
    attributes: Record<string, SerializedAttribute>;
    position?: Position;
    extending?: Source<RefResolution>;
    state: Record<string, any>;
    skipSugar?: boolean;
    doenetAttributes?: Record<string, any>; // TODO: remove doenetAttributes?
};

export function isSerializedComponent(
    obj: unknown,
): obj is SerializedComponent {
    const typedObj = obj as SerializedComponent;
    return (
        typeof typedObj === "object" &&
        typedObj !== null &&
        typedObj.type === "serialized" &&
        typeof typedObj.componentType === "string" &&
        Array.isArray(typedObj.children) &&
        typedObj.children.every(
            (child) =>
                typeof child === "string" || isSerializedComponent(child),
        ) &&
        typeof typedObj.attributes === "object" &&
        typedObj.attributes !== null &&
        Object.values(typedObj.attributes).every((attr) =>
            isSerializedAttribute(attr),
        ) &&
        typeof typedObj.state === "object" &&
        typedObj.state !== null
    );
}

/** The allowable data types for primitive attributes */
export type PrimitiveAttributeValue =
    | string
    | boolean
    | number
    | string[]
    | number[];

export function isPrimitiveAttributeValue(
    obj: unknown,
): obj is PrimitiveAttributeValue {
    return (
        typeof obj === "string" ||
        typeof obj === "boolean" ||
        typeof obj === "number" ||
        (Array.isArray(obj) &&
            (obj.every((v) => typeof v === "string") ||
                obj.every((v) => typeof v === "number")))
    );
}

/** An attribute that has been resolved into a (serialized) component */
type ComponentAttribute = {
    type: "component";
    name: string;
    component: SerializedComponent;
    ignoreFixed?: boolean;
};

function isComponentAttribute(obj: unknown): obj is ComponentAttribute {
    const typedObj = obj as ComponentAttribute;
    return (
        typeof typedObj === "object" &&
        typedObj !== null &&
        typedObj.type === "component" &&
        typeof typedObj.name === "string" &&
        isSerializedComponent(typedObj.component) &&
        (typedObj.ignoreFixed === undefined ||
            typeof typedObj.ignoreFixed === "boolean")
    );
}

/** An attribute whose value is a primitive data type */
type PrimitiveAttribute = {
    type: "primitive";
    name: string;
    primitive: PrimitiveAttributeValue;
    ignoreFixed?: boolean;
};

function isPrimitiveAttribute(obj: unknown): obj is PrimitiveAttribute {
    const typedObj = obj as PrimitiveAttribute;
    return (
        typeof typedObj === "object" &&
        typedObj !== null &&
        typedObj.type === "primitive" &&
        typeof typedObj.name === "string" &&
        isPrimitiveAttributeValue(typedObj.primitive) &&
        (typedObj.ignoreFixed === undefined ||
            typeof typedObj.ignoreFixed === "boolean")
    );
}

/**
 * An attribute that has not yet been resolved from determining its parent component type.
 * Typically used to store attributes in composites before they are added to its replacements.
 */
type UnresolvedAttribute = {
    type: "unresolved";
    name: string;
    childrenForFutureComponent: (SerializedComponent | string)[];
    ignoreFixed?: boolean;
};

function isUnresolvedAttribute(obj: unknown): obj is UnresolvedAttribute {
    const typedObj = obj as UnresolvedAttribute;
    return (
        typeof typedObj === "object" &&
        typedObj !== null &&
        typedObj.type === "unresolved" &&
        typeof typedObj.name === "string" &&
        Array.isArray(typedObj.childrenForFutureComponent) &&
        typedObj.childrenForFutureComponent.every(
            (child) =>
                typeof child === "string" || isSerializedComponent(child),
        ) &&
        (typedObj.ignoreFixed === undefined ||
            typeof typedObj.ignoreFixed === "boolean")
    );
}

/** An instance of an attribute in a `SerializedComponent` */
export type SerializedAttribute =
    | ComponentAttribute
    | PrimitiveAttribute
    | UnresolvedAttribute;

export function isSerializedAttribute(
    obj: unknown,
): obj is SerializedAttribute {
    return (
        isComponentAttribute(obj) ||
        isPrimitiveAttribute(obj) ||
        isUnresolvedAttribute(obj)
    );
}

export type ErrorRecord = {
    message: string;
    position?: Position;
};

export type WarningRecord = ErrorRecord & { level: number };

/**
 * Information about the definition of an attribute for a component type.
 *
 * Typically most fields are undefined, as many cover specialized cases.
 */
export type AttributeDefinition<T> = {
    /** Create an attribute of type "component" with componentType `createComponentOfType` */
    createComponentOfType?: string;
    /** Create an attribute of type "primitive" with primitive type determined by `createPrimitiveOfType` */
    createPrimitiveOfType?: string;
    /**
     * If specified, then create a state variable named `createStateVariable` in the component
     * whose value is determined by this attribute
     */
    createStateVariable?: string;
    /**
     * If creating a state variable and the attribute is not specified,
     * give the state variable the value `defaultValue`.
     */
    defaultValue?: T;
    /** The state variable created from this attribute is public. */
    public?: boolean;
    /** The value of the state variable created from this attribute is sent to the renderer. */
    forRenderer?: boolean;
    /** If `true`, then variable from this attribute ignores the value of the `fixed` variable. */
    ignoreFixed?: boolean;
    // `propagateToProps` is only on `modifyIndirectly`. It means this attribute
    // is propagated to references of props. (Normally references of props don't copy attributes.)
    propagateToProps?: boolean;
    excludeFromSchema?: boolean;
    /**
     * If this attribute isn't specified, then the state variable created from this attribute
     * will fall back to copying the value of the state variable
     * `fallBackToParentStateVariable` from the parent.
     */
    fallBackToParentStateVariable?: string;
    /** when create the `createComponentOfType`, give it these attributes */
    attributesForCreatedComponent?: Record<string, string>;
    /** when create the `createComponentOfType`, copy these attributes from the parent */
    copyComponentAttributesForCreatedComponent?: string[];
    // TODO: track down how `stateVariableToShadow` is used.
    stateVariableToShadow?: string;
    /** If `true` in an array state variable that has wrapping components,
     * add the attribute to the outer component
     * rather than the inner components (the default) */
    addToOuterIfWrappedArray?: boolean;
    /**
     * If this attribute value is specified to be "true" or it is given no value,
     * then set the attribute's value to `valueForTrue`.
     */
    valueForTrue?: T;
    /**
     * If this attribute value is specified to be "false",
     * then set the attribute's value to `valueForFalse`.
     */
    valueForFalse?: T;
    /**
     * Assuming the attribute is numerical, clamp the value of the state variable
     * created from this attribute to values between the clamp limits
     */
    clamp?: [number, number];
    /** A list of the valid values for this attribute */
    validValues?: T[];
    /** When the value of this attribute is changed, call the action `triggerActionOnChange`. */
    triggerActionOnChange?: string;
    /** If `true`, attribute values are converted to lower case */
    toLowerCase?: boolean;
    /** If `true`, leave the attribute serialized when the component is created */
    leaveRaw?: boolean;
    /** If this primitive attribute is not specified, create the attribute with this value */
    defaultPrimitiveValue?: T;
    /**
     * Run this function on the value of this primitive attribute,
     * modifying its value to the return value,
     * or creating an error if this function throws an exception.
     */
    validatePrimitives?: (arg: T) => T;
    /**
     * When creating a state variable from this numerical attribute
     * and the result is not a finite number, instead use the value `transformNonFiniteTo`.
     */
    transformNonFiniteTo?: T;
    /**
     * When creating the text state variable from this attribute,
     * trim off the whitespace from the beginning and end.
     */
    trim?: boolean;
};
