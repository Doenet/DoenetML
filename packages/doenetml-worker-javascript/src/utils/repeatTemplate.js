/**
 * The template of a repeat made a list (`_repeatValueList`,
 * `components/RepeatValueList.js`), analysed once and evaluated, and
 * inverted, at each entry's index. Part of Doenet/DoenetML#2163 (F6); see
 * `docs/f6-repeat-templates-as-lists.md`.
 *
 * The template is a `<math>`, `<number>` or `<point>`
 * (`utils/dast/repeatLists.ts` decides which qualify), with nested `<math>`s
 * and `<number>`s, and a point's coordinates. Each is a node. The values
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
import {
    coordinatesOf,
    vectorOf,
} from "../components/abstract/GraphicalValueList";

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
 * A node is `{ type, simplify, expand, fixed, codes, entryCodes, ... }`,
 * where each code is `{ entry: e }`, `{ constant: c }` or `{ node: n }`, and
 * `entryCodes` and `constantCodes` are the entry and constant codes the node
 * reads, itself or through a nested node. A math node also has its
 * `codePre`, `expressionWithCodes` and `numStrings`; a number node the
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

        if (node.type === "point") {
            // its coordinates, the maths sugar made of its content
            for (const child of component.attributes.xs?.component.children ??
                []) {
                if (typeof child !== "string") {
                    node.codes.push({ node: addNode(child) });
                }
            }
        } else if (node.type === "math") {
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

    // The entry and constant codes each node reads, itself or through a
    // nested node, so that a value computed from one node alone (a point's
    // coordinate) depends on those alone.
    function codesOf(ind) {
        const node = nodes[ind];
        if (node.entryCodes === undefined) {
            const entryCodes = new Set();
            const constantCodes = new Set();
            for (const code of node.codes) {
                if (code.entry !== undefined) {
                    entryCodes.add(code.entry);
                } else if (code.constant !== undefined) {
                    constantCodes.add(code.constant);
                } else if (code.node !== undefined) {
                    const nested = codesOf(code.node);
                    nested.entryCodes.forEach((e) => entryCodes.add(e));
                    nested.constantCodes.forEach((c) => constantCodes.add(c));
                }
            }
            node.entryCodes = [...entryCodes];
            node.constantCodes = [...constantCodes].sort((a, b) => a - b);
        }
        return node;
    }
    nodes.forEach((_, ind) => codesOf(ind));

    return { nodes, entryLists };
}

/**
 * Node `ind` of `analysis`, with its text as written to one entry
 * (`texts[ind]`, from `invertRepeatTemplate`) in place of the template's, as
 * a write to an iteration's component edited that component's text.
 */
function nodeAt(analysis, ind, texts) {
    const node = analysis.nodes[ind];
    const text = texts?.[ind];
    if (!text || node === undefined) {
        return node;
    }
    if (text.expressionWithCodes !== undefined && node.type === "math") {
        return {
            ...node,
            expressionWithCodes: me.fromAst(text.expressionWithCodes),
        };
    }
    if (text.string !== undefined && node.type === "number") {
        return { ...node, string: text.string };
    }
    return node;
}

/**
 * The value of node `ind` (the template's own by default) at one index.
 * `codeValue(code)` gives the value of an entry or constant code there.
 * `settings` are the template's own `simplify` and `expand`, which the list
 * holds, and `texts` the text of each node as written to this entry, by the
 * node's index, for those that were.
 */
export function evaluateRepeatTemplate({
    analysis,
    codeValue,
    settings,
    texts,
    ind = 0,
}) {
    const node = nodeAt(analysis, ind, texts);
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
                  texts,
                  ind: code.node,
              });

    if (node.type === "point") {
        // each coordinate simplified, as a point's `unconstrainedXs` reads
        // its coordinates
        return vectorOf(
            node.codes.map((code) => asMath(valueOf(code)).simplify()),
        );
    }

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
    if (value === undefined || value === null) {
        // what it reads is missing, as an entry past the end of a list
        // (`$l[$i]`), which the component reads as no number
        return NaN;
    }
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
 * `{ success: true, writes, texts }`, or `{ success: false }`. `writes` is a
 * list of `{ code, desiredValue }` for entry and constant codes. `texts` is
 * the new text of each node, by its index, that takes the value by changing
 * its text, as a `<math>` or `<number>` changes its text: the expression with
 * codes as a tree, or a number's string.
 *
 * `codeValue(code)` and `codeCanBeModified(code)` give the value of an entry
 * or constant code at that index, and whether it takes a write, and `texts`
 * the text of each node as written to the entry before, for those that were.
 */
export function invertRepeatTemplate({
    analysis,
    desiredValue,
    codeValue,
    codeCanBeModified,
    settings,
    texts,
    fixLocation = false,
    ind = 0,
}) {
    const node = nodeAt(analysis, ind, texts);
    // a `<math>` under `fixLocation` takes no write, as `mathInverseAnalysis`
    // reports for it
    if (
        node === undefined ||
        node.fixed ||
        (fixLocation && node.type === "math")
    ) {
        return { success: false };
    }
    const context = {
        analysis,
        codeValue,
        codeCanBeModified,
        settings,
        texts,
        fixLocation,
    };

    if (node.type === "point") {
        // Each coordinate is written on its own, as a point's coordinates
        // are, and one that does not take its value is left as it is.
        const coordinates = coordinatesOf(
            convertValueToMathExpression(desiredValue),
        );
        const writes = [];
        const newTexts = {};
        let changesOne = false;
        let wroteOne = false;
        for (const [dim, code] of node.codes.entries()) {
            const desired = coordinates[dim];
            const current = asMath(valueOfCode(code, context));
            if (
                desired === undefined ||
                JSON.stringify(desired.tree) === JSON.stringify(current.tree)
            ) {
                continue;
            }
            changesOne = true;
            const result = writeCode(code, desired, context);
            if (result.success) {
                wroteOne = true;
                writes.push(...result.writes);
                Object.assign(newTexts, result.texts);
            }
        }
        return wroteOne || !changesOne
            ? { success: true, writes, texts: newTexts }
            : { success: false };
    }

    if (node.type === "number") {
        const number = numberFromDesiredValue(desiredValue, NaN);
        if (node.string !== undefined) {
            return {
                success: true,
                writes: [],
                // as a `<number>` writes its text, which a complex number,
                // held as `{ re, im }`, needs
                texts: {
                    [ind]: {
                        string: numberToMathExpression(number).toString(),
                    },
                },
            };
        }
        if (node.codes.length === 0) {
            // an empty `<number>` takes the value as its own, as the
            // component does with no children
            return {
                success: true,
                writes: [],
                // as a `<number>` writes its text, which a complex number,
                // held as `{ re, im }`, needs
                texts: {
                    [ind]: {
                        string: numberToMathExpression(number).toString(),
                    },
                },
            };
        }
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
        // text alone, or nothing (a `<math>` with no children takes the
        // value as its own)
        return {
            success: true,
            writes: [],
            texts: { [ind]: { expressionWithCodes: desired.tree } },
        };
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
    if (!inverse.success || inverse.valueShadow) {
        return { success: false };
    }
    const writes = [];
    const newTexts = {};
    if (inverse.expressionWithCodes) {
        newTexts[ind] = {
            expressionWithCodes: inverse.expressionWithCodes.tree,
        };
    }
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
        Object.assign(newTexts, result.texts);
    }
    return { success: true, writes, texts: newTexts };
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
    return { success: true, writes: [{ code, desiredValue }], texts: {} };
}

function valueOfCode(code, context) {
    return code.node === undefined
        ? context.codeValue(code)
        : evaluateRepeatTemplate({ ...context, ind: code.node });
}

/**
 * Whether the template takes a write at all, as the iteration's component
 * reports it (`canBeModified`): given whether each entry and constant code it
 * reads takes one (`codeCanBeModified`), and not as written to one entry. A
 * `<math>` under `fixLocation` takes none, as `mathInverseAnalysis` reports.
 */
export function templateCanBeModified({
    analysis,
    codeCanBeModified,
    fixLocation = false,
}) {
    if (analysis.nodes.length === 0) {
        return false;
    }
    return canBeModified(
        { node: 0 },
        { analysis, codeCanBeModified, fixLocation },
    );
}

/** Whether `code` takes a write, through the node it is if one. */
function canBeModified(code, context) {
    if (code.node === undefined) {
        return context.codeCanBeModified(code);
    }
    const node = nodeAt(context.analysis, code.node, context.texts);
    if (node.fixed || (context.fixLocation && node.type === "math")) {
        return false;
    }
    if (node.string !== undefined || node.codes.length === 0) {
        return true;
    }
    // One child alone is written as it is, as `<math>` and `<number>` write
    // a single child; more than one, side by side, are a product, which
    // `mathInverseAnalysis` decides, as `<math>` does.
    if (
        node.type === "number" ||
        (node.numStrings === 0 && node.codes.length === 1)
    ) {
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
