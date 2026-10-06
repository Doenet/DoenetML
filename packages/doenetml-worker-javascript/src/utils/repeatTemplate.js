/**
 * The template of a repeat made a list (`_repeatValueList`,
 * `components/RepeatValueList.js`), analysed once and evaluated, and
 * inverted, at each entry's index. Part of Doenet/DoenetML#2163 (F6); see
 * `docs/f6-repeat-templates-as-lists.md`.
 *
 * The template is a `<math>` or `<number>` (`utils/dast/repeatLists.ts`
 * decides which qualify), with nested `<math>`s. Each is a node. The values
 * a node reads are codes, as a `<math>`'s math children are:
 * - an entry code reads, at index k, entry k of a list (`$i`, `$v`,
 *   `$l[$i]`), the same list at every index;
 * - a constant code reads one value, the same at every index, which a child
 *   of the list reads (`repeatTemplateConstant`);
 * - a nested node is the value of that node at index k.
 *
 * Each node is computed as the component would compute it, with the value
 * functions it uses (`utils/valueFunctions/`) and the defaults of the
 * attributes a template cannot set (its parse settings).
 */
import me from "math-expressions";
import {
    convertValueToMathExpression,
    normalizeMathExpression,
} from "@doenet/utils";
import {
    mathCodePre,
    mathExpressionWithCodes,
    mathInverseAnalysis,
    mathValueFromCodes,
    invertMathValue,
} from "./valueFunctions/math";
import {
    numberFromDesiredValue,
    numberFromString,
    numberValueFromCodes,
} from "./valueFunctions/number";
import { numberToMathExpression, plainComplex } from "./math";

const BLANK = me.fromAst("＿");

/** The parse settings of a `<math>` with none set, as its defaults give. */
const PARSE_SETTINGS = {
    format: "text",
    functionSymbols: ["f", "g"],
    functionSymbolChildIndices: [],
    splitSymbols: true,
    parseScientificNotation: false,
};

/**
 * The analysis of the serialized `template`: its nodes, the template's own
 * first (`nodes[0]`), and the list each entry code reads (`entryLists`, by
 * the component index the reference resolved to).
 *
 * A node is `{ type, simplify, expand, fixed, codes, ... }`, where each code
 * is `{ entry: e }`, `{ constant: c }` or `{ node: n }`. A math node also has
 * its `codePre`, `expressionWithCodes` and `numStrings`; a number node the
 * `string` it reads when its one child is text.
 */
export function analyzeRepeatTemplate(template) {
    const nodes = [];
    const entryLists = [];

    function entryCode(reference) {
        const nodeIdx = (reference.extending.Ref ?? reference.extending)
            .nodeIdx;
        let e = entryLists.indexOf(nodeIdx);
        if (e === -1) {
            e = entryLists.length;
            entryLists.push(nodeIdx);
        }
        return { entry: e };
    }

    function codeOf(child) {
        const constant = child.doenetAttributes?.repeatTemplateConstant;
        if (constant !== undefined) {
            return { constant };
        }
        if (child.doenetAttributes?.repeatEntry) {
            return entryCode(child);
        }
        return { node: addNode(child) };
    }

    function addNode(component) {
        const ind = nodes.length;
        const node = {
            type: component.componentType,
            simplify: literalSimplify(component.attributes.simplify),
            expand: literalBoolean(component.attributes.expand),
            fixed: literalBoolean(component.attributes.fixed) ?? false,
            codes: [],
        };
        nodes.push(node);

        if (node.type === "math") {
            const content = [];
            const strings = [];
            for (const child of component.children) {
                if (typeof child === "string") {
                    content.push(child);
                    strings.push(child);
                } else {
                    node.codes.push(codeOf(child));
                    content.push({});
                }
            }
            node.numStrings = strings.length;
            node.codePre = mathCodePre(strings);
            node.expressionWithCodes = mathExpressionWithCodes({
                content,
                codePre: node.codePre,
                ...PARSE_SETTINGS,
            });
        } else {
            const children = component.children.filter(
                (child) => typeof child !== "string" || child.trim() !== "",
            );
            const child = children[0];
            if (typeof child === "string") {
                node.string = child;
            } else if (child !== undefined) {
                node.codes.push(codeOf(child));
            }
        }
        return ind;
    }

    addNode(template);
    return { nodes, entryLists };
}

/**
 * The value of node `ind` (the template's own by default) at one index.
 * `codeValue(code)` gives the value of an entry or constant code there.
 * `settings` are the template's own `simplify` and `expand`, which the list
 * holds.
 */
export function evaluateRepeatTemplate({
    analysis,
    codeValue,
    settings,
    ind = 0,
}) {
    const node = analysis.nodes[ind];
    if (node === undefined) {
        return BLANK;
    }
    const valueOf = (code) =>
        code.node === undefined
            ? codeValue(code)
            : evaluateRepeatTemplate({
                  analysis,
                  codeValue,
                  settings,
                  ind: code.node,
              });

    if (node.type === "math") {
        if (node.expressionWithCodes === null) {
            return BLANK;
        }
        const value = mathValueFromCodes({
            expressionWithCodes: node.expressionWithCodes,
            codePre: node.codePre,
            codeValues: node.codes.map((code) => asMath(valueOf(code))),
        });
        return normalizeMathExpression({
            value,
            simplify: ind === 0 ? settings.simplify : (node.simplify ?? "none"),
            expand: ind === 0 ? settings.expand : (node.expand ?? false),
            createVectors: false,
            createIntervals: false,
            assumptions: BLANK,
        });
    }

    // a number
    if (node.string !== undefined) {
        return plainComplex(numberFromString(node.string));
    }
    if (node.codes.length === 0) {
        return NaN;
    }
    const value = valueOf(node.codes[0]);
    if (!(value instanceof me.class)) {
        return plainComplex(value);
    }
    return (
        numberValueFromCodes({
            parsedExpression: me.fromAst("code0"),
            mathValuesByCode: { code0: value },
            numberValuesByCode: {},
            valueOnNaN: NaN,
        }) ?? NaN
    );
}

/**
 * What to write so that node `ind` at one index becomes `desiredValue`:
 * `{ success: true, writes }`, where `writes` is a list of `{ code,
 * desiredValue }` for entry and constant codes, or `{ success: false }`.
 * `{ success: false, needsStrings: true }` when the template would take the
 * value only by changing its text, which the list does not write
 * (`RepeatValueList` keeps such a value as written to the entry).
 *
 * `codeValue(code)` and `codeCanBeModified(code)` give the value of an entry
 * or constant code at that index, and whether it takes a write.
 */
export function invertRepeatTemplate({
    analysis,
    desiredValue,
    codeValue,
    codeCanBeModified,
    settings,
    ind = 0,
}) {
    const node = analysis.nodes[ind];
    if (node === undefined || node.fixed) {
        return { success: false };
    }
    const context = { analysis, codeValue, codeCanBeModified, settings };

    if (node.type === "number") {
        if (node.string !== undefined) {
            return { success: false, needsStrings: true };
        }
        if (node.codes.length === 0) {
            return { success: false };
        }
        const number = numberFromDesiredValue(desiredValue, NaN);
        const code = node.codes[0];
        const current = valueOfCode(code, context);
        return writeCode(
            code,
            current instanceof me.class
                ? numberToMathExpression(number)
                : number,
            context,
        );
    }

    // a math
    const desired = convertValueToMathExpression(desiredValue);
    if (node.codes.length === 1 && node.numStrings === 0) {
        return writeCode(node.codes[0], desired, context);
    }
    if (node.codes.length === 0) {
        return { success: false, needsStrings: node.numStrings > 0 };
    }
    const childCanBeModified = node.codes.map((code) =>
        canBeModified(code, context),
    );
    const inverseAnalysis = mathInverseAnalysis({
        expressionWithCodes: node.expressionWithCodes,
        codePre: node.codePre,
        childCanBeModified,
        modifyIndirectly: true,
        fixed: false,
        fixLocation: false,
    });
    if (!inverseAnalysis.canBeModified) {
        return { success: false };
    }
    const inverse = invertMathValue({
        desiredValue: desired,
        numStrings: node.numStrings,
        codeValues: node.codes.map((code) =>
            asMath(valueOfCode(code, context)),
        ),
        childCanBeModified,
        childrenToSkip: [],
        analysis: inverseAnalysis,
        expressionWithCodes: node.expressionWithCodes,
        codePre: node.codePre,
        simplify: ind === 0 ? settings.simplify : (node.simplify ?? "none"),
        expand: ind === 0 ? settings.expand : (node.expand ?? false),
        createVectors: false,
        createIntervals: false,
    });
    if (!inverse.success) {
        return { success: false };
    }
    if (inverse.expressionWithCodes || inverse.valueShadow) {
        return { success: false, needsStrings: true };
    }
    const writes = [];
    for (const childInd in inverse.childValues) {
        const code = node.codes[childInd];
        const current = valueOfCode(code, context);
        const result = writeCode(
            code,
            current instanceof me.class
                ? inverse.childValues[childInd]
                : numberFromDesiredValue(inverse.childValues[childInd], NaN),
            context,
        );
        if (!result.success) {
            return result;
        }
        writes.push(...result.writes);
    }
    return { success: true, writes };
}

/** Write `desiredValue` to `code`, through the node it is if one. */
function writeCode(code, desiredValue, context) {
    if (code.node !== undefined) {
        return invertRepeatTemplate({
            ...context,
            desiredValue,
            ind: code.node,
        });
    }
    if (!context.codeCanBeModified(code)) {
        return { success: false };
    }
    return { success: true, writes: [{ code, desiredValue }] };
}

function valueOfCode(code, context) {
    return code.node === undefined
        ? context.codeValue(code)
        : evaluateRepeatTemplate({ ...context, ind: code.node });
}

/** Whether `code` takes a write, through the node it is if one. */
function canBeModified(code, context) {
    if (code.node === undefined) {
        return context.codeCanBeModified(code);
    }
    const node = context.analysis.nodes[code.node];
    if (node.fixed || node.string !== undefined) {
        return false;
    }
    if (node.type === "number" || node.numStrings === 0) {
        return node.codes.some((inner) => canBeModified(inner, context));
    }
    return mathInverseAnalysis({
        expressionWithCodes: node.expressionWithCodes,
        codePre: node.codePre,
        childCanBeModified: node.codes.map((inner) =>
            canBeModified(inner, context),
        ),
        modifyIndirectly: true,
        fixed: false,
        fixLocation: false,
    }).canBeModified;
}

function asMath(value) {
    if (value instanceof me.class) {
        return value;
    }
    if (value === undefined || value === null) {
        return BLANK;
    }
    return numberToMathExpression(value);
}

/**
 * The `simplify` written on a nested `<math>`, as the attribute reads it
 * (`simplify` alone is `full`), or `undefined`.
 */
function literalSimplify(attribute) {
    const text = literalText(attribute);
    if (text === undefined) {
        return undefined;
    }
    const value = text.trim().toLowerCase();
    if (value === "" || value === "true") {
        return "full";
    }
    if (value === "false") {
        return "none";
    }
    return SIMPLIFY_VALUES[value] ?? "none";
}

const SIMPLIFY_VALUES = {
    none: "none",
    full: "full",
    numbers: "numbers",
    numberspreserveorder: "numbersPreserveOrder",
    normalizeorder: "normalizeOrder",
};

function literalBoolean(attribute) {
    const text = literalText(attribute);
    if (text === undefined) {
        return undefined;
    }
    if (typeof text === "boolean") {
        return text;
    }
    const value = text.trim().toLowerCase();
    return value === "" || value === "true";
}

function literalText(attribute) {
    if (attribute === undefined) {
        return undefined;
    }
    if (attribute.type === "primitive") {
        return attribute.primitive.value;
    }
    const component = attribute.component;
    if (component?.state?.value !== undefined) {
        return component.state.value;
    }
    return (component?.children ?? []).join("");
}
