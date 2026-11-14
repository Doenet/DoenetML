/**
 * The value a component of the document holds, worked out at load by the
 * functions the component itself uses when the document runs, so that the
 * check of what a random choice can select (`choiceFeasibilityAtLoad.ts`)
 * can't disagree with the document about a value: how text is parsed as a
 * number (`<number>pi</number>`, `3!`, `10%`), that an `<integer>` rounds
 * what it holds, that a `<boolean>` reads a number as true when it isn't 0,
 * or that space around letters is part of the text.
 *
 * A component is given as its content: its strings, as written, and for each
 * component in it the value that component has, of one of the types a
 * parameter can read (`RunTimeChild`). What is computed mirrors the
 * component's `value` state variable with every attribute at its default:
 * - `<number>`: `Number.js` (`numberFromString` for one string,
 *   `buildParsedExpression` and `numberValueFromCodes` otherwise), with
 *   `valueOnNaN` `NaN` and `convertBoolean` false;
 * - `<integer>`: that, rounded (`Integer.js`);
 * - `<math>`: `Math.js` (`mathExpressionWithCodes`, `mathValueFromCodes`,
 *   then `normalizeMathExpression` with `simplify="none"`);
 * - `<boolean>`: `Boolean.js` (`buildParsedExpression`,
 *   `booleanValueFromCodes`, the compare settings at their defaults);
 * - `<text>`: `Text.js` (`textFromChildren`).
 */
import me from "math-expressions";
import { normalizeMathExpression } from "@doenet/utils";
import { buildParsedExpression } from "../booleanLogic";
import {
    numberFromString,
    numberValueFromCodes,
} from "../valueFunctions/number";
import {
    mathCodePre,
    mathExpressionWithCodes,
    mathValueFromCodes,
} from "../valueFunctions/math";
import { booleanValueFromCodes } from "../valueFunctions/boolean";
import { textFromChildren } from "../text";
import { plainComplex, numberToMathExpression } from "../math";

/**
 * What parsing content gives depends only on its strings and the types of
 * the components in it, not on their values, so it is kept by those, as a
 * component keeps it while its children's values change.
 */
const parsedByShape = new Map<string, any>();

/** `parse()`, kept by `kind` and the shape of `content`. */
function parsedOnce<T>(
    kind: string,
    content: (string | RunTimeChild)[],
    parse: () => T,
): T {
    const key = JSON.stringify([
        kind,
        content.map((c) => (typeof c === "string" ? c : [c.componentType])),
    ]);
    if (!parsedByShape.has(key)) {
        if (parsedByShape.size > 10000) {
            parsedByShape.clear();
        }
        parsedByShape.set(key, parse());
    }
    return parsedByShape.get(key);
}

/** A component's value, of a type a parameter can read. */
export type RunTimeChild =
    | { componentType: "number"; value: number }
    | { componentType: "math"; value: any }
    | { componentType: "text"; value: string }
    | { componentType: "boolean"; value: boolean };

/** The types `runTimeValue` computes. */
export const RUN_TIME_TYPES = new Set([
    "number",
    "integer",
    "math",
    "boolean",
    "text",
]);

/**
 * The value a component of type `componentType` holds when its content is
 * `content`: its strings and the values of the components in it.
 */
export function runTimeValue(
    componentType: string,
    content: (string | RunTimeChild)[],
    componentInfoObjects: any,
): RunTimeChild {
    switch (componentType) {
        case "integer": {
            const number = numberValue(content, componentInfoObjects);
            return {
                componentType: "number",
                value: typeof number === "number" ? Math.round(number) : NaN,
            };
        }
        case "math":
            return { componentType: "math", value: mathValue(content) };
        case "boolean":
            return {
                componentType: "boolean",
                value: booleanValue(content, componentInfoObjects),
            };
        case "text":
            return {
                componentType: "text",
                value: textFromChildren(content.map(asChildComponent)),
            };
        default:
            return {
                componentType: "number",
                value: numberValue(content, componentInfoObjects),
            };
    }
}

/**
 * A value as the component of its type, as a component's state is given to
 * the functions above: its `value`, its `text`, and as a `<text>` its
 * `number`.
 */
function asChildComponent(child: string | RunTimeChild): any {
    if (typeof child === "string") {
        return child;
    }
    return {
        componentType: child.componentType,
        stateValues: {
            value: child.value,
            text: textOf(child),
            number:
                child.componentType === "text"
                    ? numberFromString(child.value)
                    : child.value,
        },
    };
}

/** The text a value shows. */
function textOf(child: RunTimeChild): string {
    if (child.componentType === "math") {
        try {
            return child.value.toString();
        } catch (e) {
            return "＿";
        }
    }
    return String(child.value);
}

/** `<number>`'s `value` (`Number.js`). */
function numberValue(
    content: (string | RunTimeChild)[],
    componentInfoObjects: any,
): number {
    const strings = content.filter((c): c is string => typeof c === "string");
    const children = content.filter(
        (c): c is RunTimeChild => typeof c !== "string",
    );
    // text is read as a number, as `convertBoolean` is false
    const numberStrings =
        strings.length +
        children.filter(
            (c) => c.componentType === "number" || c.componentType === "text",
        ).length;
    const maths = children.filter((c) => c.componentType === "math").length;
    const others = children.filter((c) => c.componentType === "boolean").length;

    if (numberStrings <= 1 && maths + others === 0) {
        if (children.length === 0) {
            if (strings.length === 0) {
                return NaN;
            }
            return asNumber(
                numberFromString(strings[0], { componentInfoObjects } as any),
            );
        }
        const child = children[0];
        return asNumber(
            child.componentType === "text"
                ? numberFromString(child.value, { componentInfoObjects } as any)
                : child.value,
        );
    }

    const allChildren = content.map((c) =>
        typeof c === "string"
            ? c
            : {
                  ...asChildComponent(c),
                  componentType:
                      c.componentType === "text" ? "number" : c.componentType,
              },
    );
    const { parsedExpression, codePre } = parsedOnce(
        "number",
        content,
        () =>
            buildParsedExpression({
                dependencyValues: { stringChildren: strings, allChildren },
                componentInfoObjects,
            }).setValue,
    );
    if (parsedExpression === null) {
        return NaN;
    }
    const mathValuesByCode: Record<string, any> = {};
    const numberValuesByCode: Record<string, number> = {};
    let subnum = 0;
    for (const child of children) {
        const code = codePre + subnum;
        if (child.componentType === "math") {
            mathValuesByCode[code] = child.value;
        } else if (child.componentType === "number") {
            numberValuesByCode[code] = child.value;
        } else if (child.componentType === "text") {
            numberValuesByCode[code] = asNumber(
                numberFromString(child.value, { componentInfoObjects } as any),
            );
        } else {
            // a boolean: `Number.js` reads it only with `convertBoolean`
            return NaN;
        }
        subnum++;
    }
    const number = numberValueFromCodes({
        parsedExpression,
        mathValuesByCode,
        numberValuesByCode,
        valueOnNaN: NaN,
    });
    return number === null ? NaN : asNumber(number);
}

/** A real number, or `NaN` for anything else (a complex number). */
function asNumber(value: any): number {
    const plain = plainComplex(value);
    return typeof plain === "number" ? plain : NaN;
}

/** `<math>`'s `value` (`Math.js`), with its attributes at their defaults. */
function mathValue(content: (string | RunTimeChild)[]): any {
    const strings = content.filter((c): c is string => typeof c === "string");
    const children = content.filter(
        (c): c is RunTimeChild => typeof c !== "string",
    );
    const codePre = mathCodePre(strings);
    // a number, a text or a boolean in a `<math>` is adapted to a math
    const codeValues = children.map((child) => {
        if (child.componentType === "math") {
            return child.value;
        }
        if (child.componentType === "number") {
            return numberToMathExpression(child.value);
        }
        return me.fromAst(textOf(child));
    });
    const expressionWithCodes = parsedOnce("math", content, () =>
        mathExpressionWithCodes({
            content: content.map((c) =>
                typeof c === "string" ? c : { componentType: "math" },
            ),
            codePre,
            format: "text",
            functionSymbols: ["f", "g"],
            functionSymbolChildIndices: [],
            splitSymbols: true,
            parseScientificNotation: false,
        }),
    );
    if (expressionWithCodes === null) {
        return me.fromAst("＿");
    }
    const value = mathValueFromCodes({
        expressionWithCodes,
        codePre,
        codeValues,
    });
    return normalizeMathExpression({
        value,
        simplify: "none",
        expand: false,
        createVectors: false,
        createIntervals: false,
    });
}

/** `<boolean>`'s `value` (`Boolean.js`), its compare settings default. */
function booleanValue(
    content: (string | RunTimeChild)[],
    componentInfoObjects: any,
): boolean {
    if (content.length === 0) {
        return true;
    }
    const strings = content.filter((c): c is string => typeof c === "string");
    const allChildren = content.map(asChildComponent);
    const { parsedExpression, codePre } = parsedOnce(
        "boolean",
        content,
        () =>
            buildParsedExpression({
                dependencyValues: { stringChildren: strings, allChildren },
                componentInfoObjects,
            }).setValue,
    );
    const byCode: Record<string, Record<string, any>> = {
        mathChildrenByCode: {},
        numberChildrenByCode: {},
        textChildrenByCode: {},
        booleanChildrenByCode: {},
        otherChildrenByCode: {},
    };
    let subnum = 0;
    for (const child of allChildren) {
        if (typeof child === "string") {
            continue;
        }
        const group = `${child.componentType}ChildrenByCode`;
        byCode[group][codePre + subnum] = child;
        subnum++;
    }
    return booleanValueFromCodes({
        parsedExpression,
        childrenAndSettings: {
            ...byCode,
            symbolicEquality: false,
            expandOnCompare: false,
            simplifyOnCompare: "none",
            unorderedCompare: false,
            matchByExactPositions: false,
            allowedErrorInNumbers: 0,
            includeErrorInNumberExponents: false,
            allowedErrorIsAbsolute: false,
            numSignErrorsMatched: 0,
            numPeriodicSetMatchesRequired: 3,
            caseInsensitiveMatch: false,
            matchBlanks: false,
        },
        canOverrideUnorderedCompare: true,
    });
}
