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
    children: (UnflattenedComponent | string)[];
    attributes: Record<string, UnflattenedAttribute>;
    position?: Position;
    extending?: Source<RefResolution>;
    state: Record<string, any>;
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

/**
 * A preliminary step toward creating a `SerializedAttribute`,
 * which is a unflattened version of an attribute from the normalized dast
 */
export type UnflattenedAttribute = {
    name: string;
    children: (UnflattenedComponent | string)[];
    position?: Position;
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
