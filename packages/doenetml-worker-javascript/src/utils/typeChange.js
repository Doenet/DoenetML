/**
 * When an `extend` or `copy` may be written as a different tag than the
 * component it is of (D26, REF-5): `<T extend="$x"/>` or `<T copy="$x"/>`,
 * where `T` is not x's type, asks for a T made from x. This module is the one
 * table that decides when that is allowed. `Copy.js` applies it
 * (`typeChangeStatus`), before a replacement that is not a `T` is made one by
 * wrapping it in a new `T` (`verifyReplacementsMatchSpecifiedType`).
 *
 * Allowed:
 * - between the value types math, number and text, and a text from a
 *   boolean (shown as the word). A text is not a boolean (D68), a boolean is
 *   not a number or a math, nor a number or a math a boolean (D47 decisions
 *   3 and 4): `<number convertBoolean>` is the one place a boolean is read
 *   as `1` or `0`, and a comparison (`$n != 0`, `$t = true`) is how a number
 *   or a text decides a boolean (`mix`). A number from a text is missing
 *   while the text isn't a number (`valueCheck` `"number"`);
 * - between the geometric types point, vector and coords;
 * - math from a point, vector or coords, as the tuple of its coordinates;
 * - a point, vector or coords from a math whose value is a tuple;
 * - a value type from an input, as the input's value is: `<math
 *   extend="$mi"/>` of a `<mathInput>`, and anything its value can be made
 *   into (an input is its value, REF-1a, D69 decision 3);
 * - an angle as the math of its measure, and from a math (`VALUED_AS`, D66
 *   decision 17, D69 decision 3);
 * - any other component as a type it stands in as (its `adapters`), and
 *   nothing further (D69): an `<ion>` as the text of its name, a `<line>` as
 *   the math of its equation, a `<label>` as its text. A `<line>` is not a
 *   number, though its equation is a math (`standsInAs`).
 *
 * Anything else is not, and is reported by its kind, each with the clearer
 * form the author can write instead: an input made from a value
 * (`inputFromValue`), a container read as a value (`container`), a
 * component made into what it doesn't stand in as (`standsInAs`), and any
 * other pair (`unrelated`).
 *
 * A list written as the tag (`<mathList extend="$g"/>`) is not decided here:
 * it is made from what it copies by its own rules (#2231).
 */

import { vectorOperators } from "@doenet/utils";
import { textToMath } from "./valueFunctions/text";

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
 * The one type that is not a value type but is made from, and into, the
 * value types as one (D69 decision 3, D66 decision 17): an angle is its
 * measure in radians, a math.
 */
const VALUED_AS = {
    angle: "math",
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
 * - `{ allowed: true, valueCheck: "tuple" | "number" }`, the check on the
 *   value of the source, or, for an input, of its value;
 * - `{ allowed: false, kind: "inputFromValue" | "container" | "unrelated" }`;
 * - `{ allowed: false, kind: "mix", mix }`, a value as a type it isn't
 *   read as without the author asking: a boolean as a number or a math
 *   (`mix` is `"booleanAsNumber"`), a number or a math as a boolean
 *   (`"numberAsBoolean"`), or a text as a boolean (`"textAsBoolean"`, D68),
 *   with an input as its value, and a component that stands in as a text
 *   (a `<label>`) as one;
 * - `{ allowed: false, kind: "standsInAs", standsInAs, property }`, a
 *   component made into a type it doesn't stand in as (D69): `standsInAs`
 *   is the types it does (its adapters'), and `property` a property of it
 *   that gives the value meant, if it has one (`valuePropertyFor`).
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

    // What any other component stands in as (its `adapters`, as
    // `ChildMatcher` substitutes them where its own type is not taken):
    // an `<ion>` as the text of its name, a `<line>` as the math of its
    // equation. It is made into those types only, not into what they
    // could be made into in turn (D69). Value types and inputs are
    // decided by the table alone, so that its checks on a math's value
    // are not passed over.
    const standsInAs =
        source.kind === "other"
            ? adapterTypesOf(sourceType, componentInfoObjects)
            : [];
    if (
        standsInAs.some((adapterType) =>
            componentInfoObjects.isInheritedComponentType({
                inheritedComponentType: adapterType,
                baseComponentType: writtenType,
            }),
        )
    ) {
        return { allowed: true };
    }

    if (written.kind !== "value") {
        return { allowed: false, kind: "unrelated" };
    }

    if (standsInAs.length > 0) {
        if (
            written.type === "boolean" &&
            standsInAs.every((adapterType) =>
                componentInfoObjects.isInheritedComponentType({
                    inheritedComponentType: adapterType,
                    baseComponentType: "text",
                }),
            )
        ) {
            // what stands in only as a text, a `<label>`, is no more true
            // or false than a text is (D68 decision 1)
            return { allowed: false, kind: "mix", mix: "textAsBoolean" };
        }
        return {
            allowed: false,
            kind: "standsInAs",
            standsInAs,
            property: valuePropertyFor(
                sourceType,
                writtenType,
                componentInfoObjects,
            ),
        };
    }

    if (source.kind === "input") {
        if (!source.valueType) {
            return { allowed: false, kind: "unrelated" };
        }
        source = { kind: "value", type: source.valueType };
    }

    if (source.kind === "value") {
        const writtenIsValue = VALUE_TYPES.includes(written.type);
        const sourceIsValue = VALUE_TYPES.includes(source.type);
        if (writtenIsValue && sourceIsValue) {
            const mix = valueMix(source.type, written.type);
            if (mix !== undefined) {
                return { allowed: false, kind: "mix", mix };
            }
            if (written.type === "number" && source.type === "text") {
                // a text that isn't a number makes a missing number (VAL-5)
                return { allowed: true, valueCheck: "number" };
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
 * The types a component of `componentType` stands in as where its own type
 * is not taken: those of its `adapters` (`ChildMatcher`), in order, each
 * once.
 */
export function adapterTypesOf(componentType, componentInfoObjects) {
    const componentClass =
        componentInfoObjects.allComponentClasses[componentType];
    const types = [];
    for (let n = 0; n < (componentClass?.numAdapters ?? 0); n++) {
        const adapterType = componentClass.getAdapterComponentType(
            n,
            componentInfoObjects.publicStateVariableInfo,
        );
        if (
            adapterType &&
            !adapterType.startsWith("_") &&
            !types.includes(adapterType)
        ) {
            types.push(adapterType);
        }
    }
    return types;
}

/**
 * The property of a component of `sourceType` that gives the value a
 * `writtenType` made from it would mean, which a message suggests in place
 * of the type change (D69): `slope` for a `<number>` of a `<line>`,
 * `equation` for a `<text>` of one. Each class names its own
 * (`static valueProperties`, by the value type written); `""` for none.
 */
export function valuePropertyFor(
    sourceType,
    writtenType,
    componentInfoObjects,
) {
    const properties =
        componentInfoObjects.allComponentClasses[sourceType]?.valueProperties;
    if (!properties) {
        return "";
    }
    const written = familyOf(writtenType, componentInfoObjects);
    return properties[written.type] ?? "";
}

/**
 * Whether a component of `componentType` is one that stands in as a value
 * only through its adapters (D69): neither a value type, an input, a
 * geometric type nor an angle, but with an adapter to one of the value
 * types, as a `<line>`, an `<ion>`, a `<function>`, an `<m>` or a
 * `<label>` has.
 */
export function standsInAsValueOnly(componentType, componentInfoObjects) {
    if (familyOf(componentType, componentInfoObjects).kind !== "other") {
        return false;
    }
    return adapterTypesOf(componentType, componentInfoObjects).some(
        (adapterType) => {
            const family = familyOf(adapterType, componentInfoObjects);
            return family.kind === "value" && VALUE_TYPES.includes(family.type);
        },
    );
}

/**
 * Which way a value of `sourceType` made a `writtenType` mixes values that
 * are not read as each other unless the author asks (D47 decisions 3 and 4,
 * D68), both value types (`VALUE_TYPES`): `"booleanAsNumber"`,
 * `"numberAsBoolean"`, `"textAsBoolean"`, or `undefined` for no mix.
 */
function valueMix(sourceType, writtenType) {
    const numeric = (type) => type === "math" || type === "number";
    if (sourceType === "boolean" && numeric(writtenType)) {
        return "booleanAsNumber";
    }
    if (numeric(sourceType) && writtenType === "boolean") {
        return "numberAsBoolean";
    }
    if (sourceType === "text" && writtenType === "boolean") {
        return "textAsBoolean";
    }
    return undefined;
}

/**
 * Whether a `writtenType` made from a value whose type is not known yet is
 * checked against that value (`valueAllowsTypeChange`): a point, vector or
 * coords made from a math, or a number made from a text. What it is made
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
 * be made from it; for a number, made from a text, a text that reads as a
 * number, as a `<number>` reads a text: through its `math` (`Text.js`'s
 * `number`), so `1e3` or a blank is not one, though `Number()` reads it,
 * and a text that is LaTeX (`isLatex`, a `<latex>`) is read as LaTeX
 * (`\frac{1}{2}`).
 */
export function valueAllowsTypeChange(
    valueCheck,
    value,
    { isLatex = false } = {},
) {
    const tree = value?.tree;
    if (valueCheck === "tuple") {
        return Array.isArray(tree) && vectorOperators.includes(tree[0]);
    }
    if (valueCheck === "number") {
        if (typeof value !== "string") {
            return true;
        }
        const number = textToMath({
            value,
            isLatex: Boolean(isLatex),
        }).evaluate_to_constant();
        if (typeof number === "number") {
            return !Number.isNaN(number);
        }
        // a complex number (`3+4i`)
        return (
            typeof number?.re === "number" &&
            typeof number?.im === "number" &&
            !Number.isNaN(number.re) &&
            !Number.isNaN(number.im)
        );
    }
    return true;
}

/**
 * The arguments of `doenet-e0065` (`type-change-unrelated`) for `rule`, a
 * type change `typeChangeRule` doesn't allow and that is not an input made
 * from a value or a container read as a value: `mix` says which form the
 * message suggests. `sourceType` is the type the source gives.
 */
export function unrelatedTypeChangeArgs({
    rule,
    sourceType,
    writtenType,
    componentInfoObjects,
}) {
    if (rule.kind === "mix") {
        return { sourceType, mix: rule.mix };
    }
    if (rule.kind === "standsInAs") {
        return {
            sourceType,
            mix: "standsInAs",
            standsInAs: rule.standsInAs
                .map((type) => `\`<${type}>\``)
                .join(", "),
            standsInAsCount: rule.standsInAs.length,
            property: rule.property || "none",
        };
    }
    if (
        componentInfoObjects.allComponentClasses[writtenType]?.isContent &&
        !componentInfoObjects.allComponentClasses[sourceType]?.isContent
    ) {
        // a container made from a value or an object holds it
        // (`<label>$m</label>`, D69 decision 4)
        return { sourceType, mix: "inContent" };
    }
    return { sourceType };
}
