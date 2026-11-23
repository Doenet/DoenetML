/**
 * When an `extend` or `copy` may be written as a different tag than the
 * component it is of (D26, REF-5): `<T extend="$x"/>` or `<T copy="$x"/>`,
 * where `T` is not x's type, asks for a T made from x. This module is the one
 * table that decides when that is allowed. `Copy.js` applies it
 * (`typeChangeStatus`), before a replacement that is not a `T` is made one by
 * wrapping it in a new `T` (`verifyReplacementsMatchSpecifiedType`).
 *
 * Allowed:
 * - between the value types math, number and text, and between boolean and
 *   text, a text being a boolean only while it is the word `true` or
 *   `false`. A boolean is not a number or a math, nor a number or a math a
 *   boolean (D47 decisions 3 and 4): `<number convertBoolean>` is the one
 *   place a boolean is read as `1` or `0`, and a comparison (`$n != 0`) is
 *   how a number decides a boolean (`booleanNumber`);
 * - between the geometric types point, vector and coords;
 * - math from a point, vector or coords, as the tuple of its coordinates;
 * - a point, vector or coords from a math whose value is a tuple;
 * - a value type from an input, as the input's value is: `<math
 *   extend="$mi"/>` of a `<mathInput>`, and anything its value can be made
 *   into;
 * - an angle as the math of its measure, and a label as its text
 *   (`VALUED_AS`), but not a boolean from a label: REF-5 makes a boolean
 *   only from a text, and a label is not one (#2656);
 * - any other component as a type it stands in as where its own type is not
 *   taken (its `adapters`): an `<ion>` as the text of its name, a `<line>`
 *   as the math of its equation, and, for an adapter to a value type, as any
 *   value type.
 *
 * Anything else is not, and is reported by its kind, each with the clearer
 * form the author can write instead: an input made from a value
 * (`inputFromValue`), a container read as a value (`container`), and any
 * other pair (`unrelated`).
 *
 * A list written as the tag (`<mathList extend="$g"/>`) is not decided here:
 * it is made from what it copies by its own rules (#2231).
 */

import { vectorOperators } from "@doenet/utils";

/** The value types, which are made from one another. */
const VALUE_TYPES = ["math", "number", "text", "boolean"];

/** The geometric types, which are made from one another. */
const GEOMETRIC_TYPES = ["point", "vector", "coords"];

/**
 * The type of the value of each input that has one a value type can be made
 * from. An input written as a different tag from its value is not allowed
 * (`inputFromValue`), and one not listed here is no value type's source.
 */
const INPUT_VALUE_TYPES = {
    mathInput: "math",
    matrixInput: "math",
    fractionInput: "math",
    textInput: "text",
    choiceInput: "text",
    booleanInput: "boolean",
};

/**
 * Other types whose value is one of the value types, so that they are made
 * from, and into, the others as that type: an angle is its measure in
 * radians, a math, and a label its text (their `adapters`).
 */
const VALUED_AS = {
    angle: "math",
    label: "text",
};

/**
 * The family a component type belongs to for a type change: the value or
 * geometric type it is or inherits from (`<integer>` is a number), or the
 * input it is. The geometric types are checked first: a `<coords>` inherits
 * from `<math>` (`Coords.js`), and is geometric.
 */
function familyOf(componentType, componentInfoObjects) {
    for (const [type, valueType] of Object.entries(VALUED_AS)) {
        if (
            componentInfoObjects.isInheritedComponentType({
                inheritedComponentType: componentType,
                baseComponentType: type,
            })
        ) {
            return { kind: "value", type: valueType };
        }
    }
    for (const baseType of [...GEOMETRIC_TYPES, ...VALUE_TYPES]) {
        if (
            componentInfoObjects.isInheritedComponentType({
                inheritedComponentType: componentType,
                baseComponentType: baseType,
            })
        ) {
            return { kind: "value", type: baseType };
        }
    }
    for (const inputType in INPUT_VALUE_TYPES) {
        if (
            componentInfoObjects.isInheritedComponentType({
                inheritedComponentType: componentType,
                baseComponentType: inputType,
            })
        ) {
            return {
                kind: "input",
                type: inputType,
                valueType: INPUT_VALUE_TYPES[inputType],
            };
        }
    }
    if (
        componentInfoObjects.isInheritedComponentType({
            inheritedComponentType: componentType,
            baseComponentType: "_input",
        })
    ) {
        return { kind: "input", type: componentType };
    }
    return { kind: "other", type: componentType };
}

/**
 * Whether a `writtenType` may be made from a component of `sourceType`, and,
 * if allowed only for some of the source's values, which check its value
 * must pass (`valueAllowsTypeChange`):
 * - `{ allowed: true }`;
 * - `{ allowed: true, valueCheck: "tuple" | "boolean" }`, the check on the
 *   value of the source, or, for an input, of its value;
 * - `{ allowed: false, kind: "inputFromValue" | "container" | "unrelated" }`;
 * - `{ allowed: false, kind: "booleanNumber", mix }`, a boolean as a number
 *   or a math (`mix` is `"booleanAsNumber"`), or a number or a math as a
 *   boolean (`"numberAsBoolean"`), with an input as its value.
 *
 * A composite is not decided here: what it stands for is its content
 * (`Copy.js`, `typeChangeStatus`).
 */
export function typeChangeRule({
    writtenType,
    sourceType,
    componentInfoObjects,
}) {
    if (
        componentInfoObjects.isInheritedComponentType({
            inheritedComponentType: sourceType,
            baseComponentType: writtenType,
        })
    ) {
        return { allowed: true };
    }

    const written = familyOf(writtenType, componentInfoObjects);
    let source = familyOf(sourceType, componentInfoObjects);

    if (written.kind === "input") {
        if (source.kind === "value") {
            return { allowed: false, kind: "inputFromValue" };
        }
        return { allowed: false, kind: "unrelated" };
    }

    const sourceClass = componentInfoObjects.allComponentClasses[sourceType];

    // What any other component stands in as where its own type is not
    // taken (`adapters`, as `ChildMatcher` substitutes them): an `<ion>` as
    // the text of its name, a `<line>` as the math of its equation. Value
    // types and inputs are decided by the table alone, so that its checks
    // on a math's value are not passed over.
    const adapterCount =
        source.kind === "other" ? (sourceClass?.numAdapters ?? 0) : 0;
    for (let n = 0; n < adapterCount; n++) {
        const adapterType = sourceClass.getAdapterComponentType(
            n,
            componentInfoObjects.publicStateVariableInfo,
        );
        if (!adapterType) {
            continue;
        }
        if (
            componentInfoObjects.isInheritedComponentType({
                inheritedComponentType: adapterType,
                baseComponentType: writtenType,
            })
        ) {
            return { allowed: true };
        }
        const adapted = familyOf(adapterType, componentInfoObjects);
        if (
            adapted.kind === "value" &&
            VALUE_TYPES.includes(adapted.type) &&
            VALUE_TYPES.includes(written.type) &&
            booleanNumberMix(adapted.type, written.type) === undefined
        ) {
            return { allowed: true };
        }
    }

    if (written.kind !== "value") {
        return { allowed: false, kind: "unrelated" };
    }

    if (source.kind === "input") {
        if (!source.valueType) {
            return { allowed: false, kind: "unrelated" };
        }
        source = { kind: "value", type: source.valueType };
    }

    if (source.kind === "value") {
        if (
            written.type === "boolean" &&
            componentInfoObjects.isInheritedComponentType({
                inheritedComponentType: sourceType,
                baseComponentType: "label",
            })
        ) {
            // A label stands in as its text (`VALUED_AS`), but REF-5 makes
            // a boolean only from a text itself.
            return { allowed: false, kind: "unrelated" };
        }
        const writtenIsValue = VALUE_TYPES.includes(written.type);
        const sourceIsValue = VALUE_TYPES.includes(source.type);
        if (writtenIsValue && sourceIsValue) {
            const mix = booleanNumberMix(source.type, written.type);
            if (mix !== undefined) {
                return { allowed: false, kind: "booleanNumber", mix };
            }
            if (written.type === "boolean" && source.type === "text") {
                return { allowed: true, valueCheck: "boolean" };
            }
            return { allowed: true };
        }
        if (!writtenIsValue && !sourceIsValue) {
            return { allowed: true };
        }
        if (written.type === "math") {
            // from a point, vector or coords, as its coordinates
            return { allowed: true };
        }
        if (source.type === "math") {
            // a point, vector or coords from a math that is a tuple
            return { allowed: true, valueCheck: "tuple" };
        }
        return { allowed: false, kind: "unrelated" };
    }

    if (isContainer(sourceType, componentInfoObjects)) {
        return { allowed: false, kind: "container" };
    }
    return { allowed: false, kind: "unrelated" };
}

/**
 * Which way a value of `sourceType` made a `writtenType` mixes a boolean and
 * a number (D47 decisions 3 and 4), both value types (`VALUE_TYPES`):
 * `"booleanAsNumber"`, `"numberAsBoolean"`, or `undefined` for no mix.
 */
function booleanNumberMix(sourceType, writtenType) {
    const numeric = (type) => type === "math" || type === "number";
    if (sourceType === "boolean" && numeric(writtenType)) {
        return "booleanAsNumber";
    }
    if (numeric(sourceType) && writtenType === "boolean") {
        return "numberAsBoolean";
    }
    return undefined;
}

/**
 * Whether a `writtenType` made from a value whose type is not known yet is
 * checked against that value (`valueAllowsTypeChange`): a point, vector or
 * coords made from a math, or a boolean made from a text. What it is made
 * from is decided later, as the selected values of a `<choiceInput>` or the
 * one component a composite holds.
 */
export function typeChangeChecksValue({ writtenType, componentInfoObjects }) {
    return ["math", "text"].some(
        (sourceType) =>
            typeChangeRule({ writtenType, sourceType, componentInfoObjects })
                .valueCheck !== undefined,
    );
}

/**
 * Whether a `writtenType` made from an input of `sourceType` is made from
 * the input's value (`INPUT_VALUE_TYPES`), as the type change allows
 * (`typeChangeRule`): `<point extend="$mi"/>` of a `<mathInput>` is a point
 * made from mi's value, a math, which it follows and writes back to, as
 * `<point extend="$m"/>` of a `<math>` is. `Copy.js` then reads the input's
 * `variableForImplicitProp` (its `implicitProp`) though that makes a
 * different type than the one written.
 */
export function madeFromInputValue({
    writtenType,
    sourceType,
    componentInfoObjects,
}) {
    const source = familyOf(sourceType, componentInfoObjects);
    if (source.kind !== "input" || !source.valueType) {
        return false;
    }
    return typeChangeRule({ writtenType, sourceType, componentInfoObjects })
        .allowed;
}

/**
 * Whether a component of this type holds other content whose text can be
 * read, as a `<p>` does: one whose children are rendered (`renderChildren`)
 * and that has a public `text`, so that `$p.text`, which the error suggests,
 * works. A `<section>`, `<div>` or `<graph>` has no `text`.
 */
function isContainer(componentType, componentInfoObjects) {
    return Boolean(
        componentInfoObjects.allComponentClasses[componentType]
            ?.renderChildren &&
        componentInfoObjects.publicStateVariableInfo[componentType]
            ?.stateVariableDescriptions?.text,
    );
}

/**
 * Whether `value`, the value of a math or a text, passes `valueCheck`
 * (`typeChangeRule`): a tuple or vector (`vectorOperators`, as `Point.js`
 * reads its coordinates, including `⟨1,2⟩`) for a point, vector or coords to
 * be made from it; for a boolean, made only from a text (D47 decision 4),
 * the word `true` or `false`, as a `<boolean>` reads a text
 * (`utils/booleanLogic.js`).
 */
export function valueAllowsTypeChange(valueCheck, value) {
    const tree = value?.tree;
    if (valueCheck === "tuple") {
        return Array.isArray(tree) && vectorOperators.includes(tree[0]);
    }
    if (valueCheck === "boolean") {
        // a text, which is true or false only as that word
        const word = String(value ?? "")
            .trim()
            .toLowerCase();
        return word === "true" || word === "false";
    }
    return true;
}
