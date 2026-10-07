/**
 * An attribute written as a literal, held as that value rather than as an
 * attribute component (Doenet/DoenetML#2129, step B1a).
 *
 * `displayDigits="5"`, `hide`, `simplify` and `minWidth="12"` were each an
 * attribute component: a whole `integer`, `boolean` or `text` component,
 * with its own state variables and dependencies, whose one job was to hold a
 * value the author wrote out. When the attribute's type holds one value
 * (`boolean`, `number`, `integer`, `text`) and the author wrote a plain
 * string, the attribute slot now holds the string, and the value it stands
 * for is computed from it by the same functions the component used
 * (`literalAttributeValue`). Readers see what they saw: the
 * `attributeComponent` dependency answers with the value, as the component's
 * `value` (`AttributeComponentDependency`).
 *
 * A reader's write to such an attribute (a toggled `hide`, a dragged
 * regular polygon's `radius`) is kept in the essential `literalAttributeWrites`
 * of the component that has the attribute (`BaseComponent`), by attribute
 * name, where it is saved and restored and where the dependency reading the
 * literal finds it, also for a linked copy that reads the attribute from
 * that component. A copy keeps its own: it is not copied with essential
 * state, and an unlinked copy takes it as the value of its copy of the
 * literal (`BaseComponent.serialize`).
 *
 * Booleans are literals only when the conversion already found their value
 * (`"true"`, `"false"`, or no value); other boolean text is an expression for
 * a `<boolean>` to evaluate. An attribute whose definition has
 * `keepAttributeComponent` keeps its component, for a reader that reads more
 * of it than its value (a graph's `grid`).
 */
import type { SerializedComponent } from "./dast/types";
import {
    numberFromDesiredValue,
    numberFromString,
} from "./valueFunctions/number";
import { plainComplex } from "./math";
import { textFromChildren } from "./text";

export type LiteralAttribute = {
    type: "literal";
    name: string;
    /** The type the attribute component would have been. */
    componentType: string;
    /** What the author wrote, for a value computed from it. */
    text?: string;
    /**
     * The value itself, when the conversion already computed it (an
     * attribute written with no value, or `"true"` for a boolean).
     */
    value?: any;
    /** Where the author wrote it, for diagnostics about the attribute. */
    position?: any;
    sourceDoc?: number;
};

/** The types an attribute held as a literal may have: each holds one value. */
const LITERAL_ATTRIBUTE_TYPES = new Set([
    "boolean",
    "number",
    "integer",
    "text",
]);

/**
 * The literal that the serialized attribute component `component` of the
 * attribute `name` stands for, or `undefined` if it is more than a literal:
 * it has a reference, a component, attributes of its own, or (for a boolean)
 * an expression to evaluate; or its definition `attrDef` keeps the component
 * (`keepAttributeComponent`) for a reader that reads more of it than its
 * value.
 */
export function literalFromAttributeComponent({
    name,
    component,
    attrDef,
    sourceDoc,
}: {
    name: string;
    component: SerializedComponent;
    attrDef?: { keepAttributeComponent?: boolean };
    sourceDoc?: number;
}): LiteralAttribute | undefined {
    const componentType = component.componentType;
    if (
        !LITERAL_ATTRIBUTE_TYPES.has(componentType) ||
        attrDef?.keepAttributeComponent
    ) {
        return undefined;
    }
    if (
        Object.keys(component.attributes ?? {}).length > 0 ||
        component.extending ||
        Object.keys(component.doenetAttributes ?? {}).some(
            (key) => key !== "isAttributeChildFor",
        )
    ) {
        return undefined;
    }
    const children = component.children ?? [];
    const stateKeys = Object.keys(component.state ?? {});

    const literal: LiteralAttribute = { type: "literal", name, componentType };
    if (sourceDoc !== undefined) {
        literal.sourceDoc = sourceDoc;
    }
    if (component.position) {
        literal.position = component.position;
    }

    if (
        children.length === 0 &&
        stateKeys.length === 1 &&
        stateKeys[0] === "value"
    ) {
        // the conversion already found the value: an attribute written with
        // no value, or a boolean written as `"true"` or `"false"`
        literal.value = component.state!.value;
        return literal;
    }
    if (
        componentType !== "boolean" &&
        stateKeys.length === 0 &&
        children.length === 1 &&
        typeof children[0] === "string"
    ) {
        literal.text = children[0];
        return literal;
    }
    return undefined;
}

/**
 * The value of the literal attribute `attribute`: the `value` of an attribute
 * component of its type whose one child is its text.
 */
export function literalAttributeValue(
    attribute: LiteralAttribute,
    componentInfoObjects: any,
) {
    if ("value" in attribute) {
        return attribute.value;
    }
    const text = attribute.text!;
    switch (attribute.componentType) {
        case "text":
            return textFromChildren([text]);
        case "number":
            return plainComplex(
                numberFromString(text, { componentInfoObjects } as any),
            );
        case "integer":
            return Math.round(
                plainComplex(
                    numberFromString(text, { componentInfoObjects } as any),
                ),
            );
    }
    throw Error(
        `An attribute of type ${attribute.componentType} cannot be a literal.`,
    );
}

const attributesObjects = new WeakMap<object, Record<string, any>>();

/** The attribute definitions of `componentClass`, made once per class. */
export function attributesObjectOf(componentClass: any): Record<string, any> {
    if (!componentClass) {
        return {};
    }
    let attributesObject = attributesObjects.get(componentClass);
    if (!attributesObject) {
        attributesObject = componentClass.createAttributesObject() ?? {};
        attributesObjects.set(componentClass, attributesObject!);
    }
    return attributesObject!;
}

/**
 * The attributes of the serialized component tree `components`, and of the
 * components they hold, with each attribute component that is only a literal
 * replaced by the literal (`literalFromAttributeComponent`). An attribute the
 * component's class adds to the resolver keeps its component.
 */
export function convertLiteralAttributes(
    components: (SerializedComponent | string)[],
    componentInfoObjects: any,
): (SerializedComponent | string)[] {
    return components.map((component) => {
        if (typeof component !== "object" || component === null) {
            return component;
        }
        const newComponent = { ...component };
        if (newComponent.children) {
            newComponent.children = convertLiteralAttributes(
                newComponent.children,
                componentInfoObjects,
            );
        }
        if (newComponent.attributes) {
            const componentClass =
                componentInfoObjects.allComponentClasses[
                    newComponent.componentType
                ];
            const attributesObject = attributesObjectOf(componentClass);
            const attributes = { ...newComponent.attributes };
            for (const attrName in attributes) {
                const attribute: any = attributes[attrName];
                if (attribute.type !== "component") {
                    continue;
                }
                const literal =
                    attrName === componentClass?.addAttributeToResolver
                        ? undefined
                        : literalFromAttributeComponent({
                              name: attribute.name ?? attrName,
                              component: attribute.component,
                              attrDef: attributesObject[attrName],
                              sourceDoc: attribute.sourceDoc,
                          });
                attributes[attrName] = literal ?? {
                    ...attribute,
                    component: convertLiteralAttributes(
                        [attribute.component],
                        componentInfoObjects,
                    )[0],
                };
            }
            newComponent.attributes = attributes;
        }
        return newComponent;
    });
}

/**
 * The serialized attribute component `attribute` holds, or, for a literal,
 * the one it stands for: a component of its type whose one child is its
 * text, or whose `state` is its value. For the readers of serialized
 * components that look for an attribute's written text (`numToSelect` of a
 * `<select>`, `sort` of a variant control, …).
 */
export function serializedAttributeComponent(
    attribute: any,
): SerializedComponent | undefined {
    if (attribute?.type === "literal") {
        return {
            type: "serialized",
            componentType: attribute.componentType,
            componentIdx: -1,
            attributes: {},
            doenetAttributes: {},
            state: "value" in attribute ? { value: attribute.value } : {},
            children: attribute.text === undefined ? [] : [attribute.text],
        } as SerializedComponent;
    }
    return attribute?.component;
}

/**
 * A copy of the literal attribute `attribute` of the component `owner`, with
 * the value a reader wrote over it (`literalAttributeWrites`) in place of
 * what the author wrote, as a copy of the attribute component it stands for
 * took that component's essential state.
 */
export function copyOfLiteralAttribute(
    attribute: LiteralAttribute,
    owner: any,
): LiteralAttribute {
    const literal: LiteralAttribute = JSON.parse(JSON.stringify(attribute));
    const writes = owner.essentialState?.literalAttributeWrites;
    if (writes && attribute.name in writes) {
        delete literal.text;
        literal.value = writes[attribute.name];
    }
    return literal;
}

/**
 * The value a write of `desiredValue` to the literal attribute `attribute`
 * keeps (`literalAttributeWrites`): what the attribute component of its type
 * would have kept, a number for a `number`, rounded for an `integer`; or
 * `undefined` if that component would have ignored the write. A `text`
 * written as text ignored a value that is not a string, which its text child
 * could not take.
 */
export function literalWriteValue(
    attribute: LiteralAttribute,
    desiredValue: any,
) {
    switch (attribute.componentType) {
        case "number":
            return numberFromDesiredValue(desiredValue, NaN);
        case "integer":
            return Math.round(numberFromDesiredValue(desiredValue, NaN));
        case "boolean":
            return Boolean(desiredValue);
        case "text":
            if ("value" in attribute) {
                return desiredValue === null ? "" : String(desiredValue);
            }
            return typeof desiredValue === "string" ? desiredValue : undefined;
    }
    return desiredValue;
}
