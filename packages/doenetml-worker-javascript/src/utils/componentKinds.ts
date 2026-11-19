/**
 * What a type is for a `<sort>`, `<sortIndices>` or `<shuffle>` (COLL-4, D46
 * part 2): every component an author writes is of one of three kinds.
 *
 * - **A value** stands for a value: `<math>`, `<number>`, `<integer>`,
 *   `<text>`, `<boolean>`, the tags built on them (`<sum>`, `<latex>`), and
 *   the inputs, which stand for what they hold. Its type is the value's, with
 *   integer, number and math one type (D44 decision 3): `math`, `text` or
 *   `boolean`. An input is of the kind and type of what a reference to it is
 *   (`staticValueReferenceTarget`): a `<matrixInput>` is a `math`, as `$mi`
 *   of one is a `<math>`, and a `<subsetOfRealsInput>`, holding a
 *   `<subsetOfReals>`, is that object.
 * - **An object** is one thing with an identity of its own: `<point>`,
 *   `<line>`, `<atom>`, `<answer>`, a `<matrix>`. Its type is its tag, with
 *   the tags built on it: the first author tag its class is built on
 *   (a `<triangle>` is a `<polyline>`, as a `<polygon>` is).
 * - **Content** is the content it holds and shows: `<p>`, sections,
 *   `<feedback>`, `<graph>`, `<image>`, `<m>`, `<label>`. All content is one
 *   type, `content`; so is a wrapper of several components (a `<group>`, an
 *   iteration, a pick or a shown case), which `reorderedItemsAtLoad.ts`
 *   decides.
 *
 * Content and values are each declared, by `static isContent = true` and
 * `static isValue = true` on the class (inherited by the classes built on
 * it, and turned off with `false`), and everything else is an object. No
 * other flag separates them: `renderChildren` is set on inputs and `<answer>`
 * too, and `variableForImplicitProp` on `<answer>`, `<award>` and `<label>`.
 * `test/utils/componentKinds.test.ts` lists every author tag with its kind,
 * so a new component has to be placed.
 */
import type { ComponentInfoObjects } from "./componentInfoObjects";
import { staticValueReferenceTarget } from "./valueReference";

export type ComponentKind = "value" | "object" | "content";

/** The types a value can be: integer, number and math are one type. */
const VALUE_TYPES = ["math", "text", "boolean"] as const;

function inherits(
    componentType: string,
    base: string,
    componentInfoObjects: ComponentInfoObjects,
) {
    return componentInfoObjects.isInheritedComponentType({
        inheritedComponentType: componentType,
        baseComponentType: base,
    });
}

/**
 * The type of the value a component of `componentType` is (`math`, `text` or
 * `boolean`), by the tag it is built on, or `undefined` for another.
 */
function baseValueType(
    componentType: string,
    componentInfoObjects: ComponentInfoObjects,
) {
    if (inherits(componentType, "number", componentInfoObjects)) {
        return "math";
    }
    return VALUE_TYPES.find((base) =>
        inherits(componentType, base, componentInfoObjects),
    );
}

/**
 * The kind of a component of `componentType`, and the one type it is of
 * (see above): for a value, `math`, `text` or `boolean`; for an object, the
 * first author tag its class is built on; for content, `content`.
 * `undefined` for a tag not known, or for an input whose value's type isn't
 * known at load. The type of a `<slider>`'s or `<choiceInput>`'s value is
 * not its tag's but its own, decided from the DoenetML when it loads
 * (`propertyTypes`, its `doenetAttributes.propertyTypes`, TYPE, D45).
 */
export function kindOfComponentType(
    componentType: string,
    componentInfoObjects: ComponentInfoObjects,
    seen: Set<string> = new Set(),
    propertyTypes?: Record<string, string>,
): { kind: ComponentKind; type: string } | undefined {
    const componentClass: any =
        componentInfoObjects.allComponentClasses[componentType];
    if (!componentClass || seen.has(componentType)) {
        return undefined;
    }
    if (componentClass.isContent) {
        return { kind: "content", type: "content" };
    }
    if (componentClass.isValue) {
        const valueType = baseValueType(componentType, componentInfoObjects);
        if (valueType !== undefined) {
            return { kind: "value", type: valueType };
        }
        // An input stands for what it holds, the value of its implicit
        // property (`$m` of a `<mathInput>` is its math).
        const target = staticValueReferenceTarget({
            targetComponentType: componentType,
            unresolvedPath: null,
            componentInfoObjects,
            propertyTypes,
        });
        // A `<choiceInput>`'s value is its `selectedValues`, an array whose
        // one entry's type is decided at load.
        const decidedType =
            target?.valueComponentType ??
            propertyTypes?.[componentClass.variableForImplicitProp];
        if (decidedType === undefined || decidedType === componentType) {
            return undefined;
        }
        return kindOfComponentType(
            decidedType,
            componentInfoObjects,
            new Set(seen).add(componentType),
        );
    }
    return { kind: "object", type: objectType(componentClass) };
}

/**
 * The type of an object of the class `componentClass`: the first author tag
 * it is built on that is an object too, so the tags built on one are one
 * type with it. A `<matrix>`, built on `<math>`, is a `<matrix>`.
 */
function objectType(componentClass: any): string {
    let type: string = componentClass.componentType;
    for (
        let ancestor = Object.getPrototypeOf(componentClass);
        ancestor?.componentType !== undefined;
        ancestor = Object.getPrototypeOf(ancestor)
    ) {
        if (ancestor.isValue || ancestor.isContent) {
            break;
        }
        if (!ancestor.componentType.startsWith("_")) {
            type = ancestor.componentType;
        }
    }
    return type;
}
