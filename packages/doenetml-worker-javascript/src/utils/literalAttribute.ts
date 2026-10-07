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
 * literal (`copyOfLiteralAttribute`).
 *
 * Booleans are literals only when the conversion already found their value
 * (`"true"`, `"false"`, or no value); other boolean text is an expression for
 * a `<boolean>` to evaluate. An attribute whose definition has
 * `keepAttributeComponent` keeps its component, for a reader that reads more
 * of it than its value (a graph's `grid`), as does one whose conversion marks
 * its component (`fixed`, marked `ignoreParentFixed`).
 */
import type { SerializedComponent } from "./dast/types";
import {
    numberFromDesiredValue,
    numberFromString,
} from "./valueFunctions/number";
import me from "math-expressions";
import { vectorOperators } from "@doenet/utils";
import { isUnspecifiedComponentValue, plainComplex, textToAst } from "./math";
import { textFromChildren } from "./text";

export type LiteralAttribute = {
    type: "literal";
    name: string;
    /** The type the attribute component would have been. */
    componentType: string;
    /** What the author wrote, for a value computed from it. */
    text?: string;
    /** For a point, what the author wrote for each coordinate. */
    coordinateTexts?: string[];
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
 * it has a reference, a component, attributes of its own, a mark of its
 * conversion (`ignoreParentFixed`, for `fixed`), or (for a boolean) an
 * expression to evaluate; or its definition `attrDef` keeps the component
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
    attrDef?: {
        keepAttributeComponent?: boolean;
        literalWhenNumeric?: boolean;
    };
    sourceDoc?: number;
}): LiteralAttribute | undefined {
    const componentType = component.componentType;
    if (attrDef?.keepAttributeComponent) {
        return undefined;
    }
    if (attrDef?.literalWhenNumeric) {
        const numeric = numericLiteral(name, component);
        if (numeric) {
            if (sourceDoc !== undefined) {
                numeric.sourceDoc = sourceDoc;
            }
            if (component.position) {
                numeric.position = component.position;
            }
            return numeric;
        }
    }
    if (!LITERAL_ATTRIBUTE_TYPES.has(componentType)) {
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
 * A number as an author writes it, with no exponent, so that it parses to
 * the same number whatever the parse settings (`splitSymbols`,
 * `parseScientificNotation`, …) of the component that has the attribute.
 */
const PLAIN_NUMBER = /^\s*-?(\d+\.?\d*|\.\d+)\s*$/;

/** Whether `component` has nothing but the one child `text`, a plain number. */
function isPlainNumberComponent(component: any, componentType: string) {
    return (
        typeof component === "object" &&
        component?.componentType === componentType &&
        Object.keys(component.attributes ?? {}).length === 0 &&
        !component.extending &&
        Object.keys(component.state ?? {}).length === 0 &&
        component.children?.length === 1 &&
        typeof component.children[0] === "string" &&
        PLAIN_NUMBER.test(component.children[0])
    );
}

/**
 * For an attribute whose definition has `literalWhenNumeric`, the literal a
 * `math` or a `point` attribute component made of plain numbers stands for
 * (`anchor="(1,2)"`, which the point's sugar made into maths of `xs`).
 */
function numericLiteral(
    name: string,
    component: SerializedComponent,
): LiteralAttribute | undefined {
    if (
        Object.keys(component.doenetAttributes ?? {}).some(
            (key) => key !== "isAttributeChildFor",
        ) ||
        component.extending ||
        Object.keys(component.state ?? {}).length > 0
    ) {
        return undefined;
    }
    if (component.componentType === "math") {
        if (isPlainNumberComponent(component, "math")) {
            return {
                type: "literal",
                name,
                componentType: "math",
                text: component.children[0] as string,
            };
        }
        return undefined;
    }
    if (component.componentType !== "point") {
        return undefined;
    }
    const attributeNames = Object.keys(component.attributes ?? {});
    const xs: any = component.attributes?.xs;
    if (
        (component.children ?? []).length > 0 ||
        attributeNames.length !== 1 ||
        xs?.type !== "component" ||
        xs.component.componentType !== "mathList" ||
        Object.keys(xs.component.attributes ?? {}).length > 0 ||
        xs.component.extending ||
        Object.keys(xs.component.state ?? {}).length > 0 ||
        xs.component.children.length === 0 ||
        !xs.component.children.every((child: any) =>
            isPlainNumberComponent(child, "math"),
        )
    ) {
        return undefined;
    }
    return {
        type: "literal",
        name,
        componentType: "point",
        coordinateTexts: xs.component.children.map(
            (child: any) => child.children[0],
        ),
    };
}

/** The math a plain number written as `text` is. */
function mathFromPlainNumber(text: string) {
    return me.fromAst(textToAst.convert(text));
}

/**
 * The coordinates of a point whose coordinates are `xs`: a vector of them,
 * or the one coordinate, as `Point`'s `coords`.
 */
function coordsFromXs(xs: any[]) {
    return xs.length === 1
        ? xs[0]
        : me.fromAst(["vector", ...xs.map((x) => x.tree)]);
}

/**
 * The variables a reader may ask of the literal attribute `attribute`, as it
 * asked them of its attribute component, given its value `value`
 * (`literalAttributeValue`, or a value a reader wrote over it): the `value`;
 * for a point, its `coords` and the variables of its coordinates.
 */
export function literalAttributeVariables(
    attribute: LiteralAttribute,
    value: any,
): Record<string, any> {
    if (attribute.componentType !== "point") {
        return { value };
    }
    const tree = value.tree;
    const xs =
        Array.isArray(tree) && (tree[0] === "vector" || tree[0] === "tuple")
            ? tree.slice(1).map((x: any) => me.fromAst(x))
            : [value];
    const variables: Record<string, any> = {
        coords: value,
        xs,
        numDimensions: xs.length,
    };
    xs.forEach((x: any, i: number) => {
        variables[`x${i + 1}`] = x;
        variables[["x", "y", "z"][i]] = x;
    });
    return variables;
}

/**
 * The value of the literal attribute `attribute`: the `value` of an attribute
 * component of its type whose one child is its text, or, for a point, its
 * `coords`.
 */
export function literalAttributeValue(
    attribute: LiteralAttribute,
    componentInfoObjects: any,
) {
    if ("value" in attribute) {
        // an unlinked copy takes a value written over its source's literal,
        // which comes back from saved state as a tree
        return literalWrittenValue(attribute, attribute.value);
    }
    if (attribute.componentType === "point") {
        // simplified, as `Point`'s `xs` are: `-0` is `0`
        return coordsFromXs(
            attribute.coordinateTexts!.map((text) =>
                mathFromPlainNumber(text).simplify(),
            ),
        );
    }
    const text = attribute.text!;
    switch (attribute.componentType) {
        case "math":
            return mathFromPlainNumber(text);
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
                const reference =
                    literal ||
                    attributesObject[attrName]?.keepAttributeComponent
                        ? undefined
                        : referenceAttributeComponent(attribute.component);
                attributes[attrName] = literal ?? {
                    ...attribute,
                    component: convertLiteralAttributes(
                        [reference ?? attribute.component],
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
    currentValue?: any,
) {
    switch (attribute.componentType) {
        case "point":
            return pointFromDesiredCoords(desiredValue, currentValue);
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

/**
 * The coordinates a point keeps when `desired` is written to coordinates
 * `current`, as `Point`'s inverse keeps them: the point keeps its number of
 * coordinates; a coordinate that `desired` leaves unspecified, or does not
 * reach, keeps its current value; a `desired` that is not a vector is its
 * first coordinate. Each coordinate is simplified, as `Point`'s `xs` are.
 */
function pointFromDesiredCoords(desired: any, current: any) {
    if (!current) {
        return desired;
    }
    const currentXs = literalAttributeVariables(
        { type: "literal", name: "", componentType: "point" },
        current,
    ).xs;
    const desiredTree = desired?.tree;
    const desiredIsVector =
        Array.isArray(desiredTree) && vectorOperators.includes(desiredTree[0]);
    const xs = currentXs.map((currentX: any, i: number) => {
        let x;
        if (desiredIsVector) {
            if (i < desiredTree.length - 1) {
                x = desired.get_component(i);
            }
        } else if (i === 0) {
            x = desired;
        }
        return isUnspecifiedComponentValue(x) ? currentX : x.simplify();
    });
    return coordsFromXs(xs);
}

/**
 * The value written over the literal attribute `attribute` (an entry of
 * `literalAttributeWrites`) as a value of its type. Saved state keeps a math
 * as its tree, and restores the math values of a state variable it knows to
 * hold one, which an entry of this object is not, so a `math` or a `point`
 * written over a literal comes back as a tree.
 */
export function literalWrittenValue(attribute: LiteralAttribute, written: any) {
    if (
        (attribute.componentType === "math" ||
            attribute.componentType === "point") &&
        !(written instanceof me.class)
    ) {
        return me.fromAst(
            written?.objectType === "math-expression" ? written.tree : written,
        );
    }
    return written;
}

/**
 * For an attribute component of a type holding one value whose only content
 * is one value reference presenting as that type (`hide="$b"`: a `boolean`
 * holding a `_ref` presenting as a `boolean`), that value reference, to be
 * the attribute component in its place (Doenet/DoenetML#2129, step B2): it
 * already presents as the attribute's type, and reads and writes the
 * referent as the component holding it did. `undefined` otherwise, as for
 * `displayDigits="$n"` with a number `n`, whose `integer` rounds it.
 */
function referenceAttributeComponent(
    component: SerializedComponent,
): SerializedComponent | undefined {
    const children = component.children ?? [];
    const reference = children[0];
    if (
        !LITERAL_ATTRIBUTE_TYPES.has(component.componentType) ||
        children.length !== 1 ||
        typeof reference !== "object" ||
        reference.componentType !== "_ref" ||
        reference.doenetAttributes?.presentedComponentType !==
            component.componentType ||
        Object.keys(component.attributes ?? {}).length > 0 ||
        component.extending ||
        Object.keys(component.state ?? {}).length > 0 ||
        Object.keys(component.doenetAttributes ?? {}).some(
            (key) => key !== "isAttributeChildFor",
        )
    ) {
        return undefined;
    }
    return {
        ...reference,
        doenetAttributes: {
            ...reference.doenetAttributes,
            isAttributeChildFor:
                component.doenetAttributes?.isAttributeChildFor,
            // where the attribute is written (`condition="$c"`), which a
            // diagnostic about the attribute points to
            // (`AttributeComponentDependency`); a diagnostic about the
            // reference points to the reference (`$c`), its `position`
            ...(component.position
                ? { attributePosition: component.position }
                : {}),
        },
        position: reference.position ?? component.position,
    };
}
