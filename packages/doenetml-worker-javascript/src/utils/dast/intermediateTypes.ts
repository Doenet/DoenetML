////////////////////////////////////////////
// Types just used for intermediate steps in
// converting the dast
////////////////////////////////////////////

import { Position, RefResolution, Source } from "@doenet/doenetml-worker";

/**
 * A preliminary step toward creating a `SerializedComponent`,
 * which is a unflattened version of a node from the normalized dast
 */
export type UnflattenedComponent = {
    type: "unflattened";
    componentType: string;
    componentIdx: number;
    stateId?: string;
    children: (UnflattenedComponent | string)[];
    attributes: Record<string, UnflattenedAttribute>;
    doenetAttributes?: Record<string, any>;
    position?: Position;
    sourceDoc?: number;
    childrenPosition?: Position;
    extending?: Source<UnflattenedRefResolution>;
    originalIdx?: number;
    state: Record<string, any>;
    /**
     * The component type as the author wrote it, when it is no longer what
     * `componentType` says.
     *
     * An index has to evaluate to a whole number, so a lone `<number>` written
     * between a reference's brackets is retyped to `integer` on the way through
     * (`convertToCopy`). That is right for the value and wrong for a message: an
     * attribute error on markup the author typed must name the tag they typed.
     * Absent whenever nothing retyped the component, which is almost always.
     */
    authoredComponentType?: string;
};

export function isUnflattenedComponent(
    obj: unknown,
): obj is UnflattenedComponent {
    const typedObj = obj as UnflattenedComponent;
    return (
        typeof typedObj === "object" &&
        typedObj !== null &&
        typedObj.type === "unflattened" &&
        typeof typedObj.componentType === "string" &&
        typeof typedObj.componentIdx === "number" &&
        Array.isArray(typedObj.children) &&
        typedObj.children.every(
            (child) =>
                typeof child === "string" || isUnflattenedComponent(child),
        ) &&
        typeof typedObj.attributes === "object" &&
        typedObj.attributes !== null &&
        Object.values(typedObj.attributes).every((attr) =>
            isUnflattenedAttribute(attr),
        ) &&
        typeof typedObj.state === "object" &&
        typedObj.state !== null
    );
}

export type UnflattenedRefResolution = {
    nodeIdx: number;
    unresolvedPath: UnflattenedPathPart[] | null;
    originalPath: UnflattenedPathPart[];
    nodesInResolvedPath: number[];
};

export interface UnflattenedPathPart {
    name: string;
    index: UnflattenedIndex[];
    position?: Position;
    sourceDoc?: number;
}

export interface UnflattenedIndex {
    value: (UnflattenedComponent | string)[];
    position?: Position;
    sourceDoc?: number;
}

/**
 * A preliminary step toward creating a `SerializedAttribute`,
 * which is a unflattened version of an attribute from the normalized dast
 */
export type UnflattenedAttribute = {
    name: string;
    children: (UnflattenedComponent | string)[];
    position?: Position;
    sourceDoc?: number;
};

export function isUnflattenedAttribute(
    obj: unknown,
): obj is UnflattenedAttribute {
    const typedObj = obj as UnflattenedAttribute;
    return (
        typeof typedObj === "object" &&
        typedObj !== null &&
        typeof typedObj.name === "string" &&
        Array.isArray(typedObj.children) &&
        typedObj.children.every(
            (child) =>
                typeof child === "string" || isUnflattenedComponent(child),
        )
    );
}
