import AuthoredValueList from "./abstract/AuthoredValueList";
import me from "math-expressions";
import { normalizeMathExpression } from "@doenet/utils";
import { textToMathFactory } from "../utils/math";

export default class MathList extends AuthoredValueList {
    static componentType = "mathList";

    static componentDocs = {
        summary: "A list of math expressions",
    };

    static listEntryComponentType = "math";

    static allowInSchemaAsComponent = ["math"];

    static listChildGroups = [
        {
            group: "maths",
            componentTypes: ["math"],
        },
    ];

    static createAttributesObject() {
        let attributes = super.createAttributesObject();

        attributes.unordered = {
            createComponentOfType: "boolean",
            createStateVariable: "unorderedPrelim",
            defaultValue: false,
            description:
                "Whether the order of items in this list should be treated as unordered (e.g. for matching).",
        };
        attributes.mergeMathLists = {
            createComponentOfType: "boolean",
            description:
                "Whether nested math-list children should be flattened into this list.",
        };

        attributes.functionSymbols = {
            description:
                "Symbols treated as function names when parsing items.",
            createComponentOfType: "textList",
            createStateVariable: "functionSymbols",
            defaultValue: ["f", "g"],
            public: true,
            fallBackToParentStateVariable: "functionSymbols",
            fallBackToSourceCompositeStateVariable: "functionSymbols",
        };

        attributes.referencesAreFunctionSymbols = {
            createReferences: true,
            createStateVariable: "referencesAreFunctionSymbols",
            defaultValue: [],
            fallBackToParentStateVariable: "referencesAreFunctionSymbols",
            fallBackToSourceCompositeStateVariable:
                "referencesAreFunctionSymbols",
            description:
                "References whose names should be treated as function symbols when parsing items.",
        };

        attributes.splitSymbols = {
            description:
                "Whether multi-character symbols are split into a product of variables.",
            createComponentOfType: "boolean",
            createStateVariable: "splitSymbols",
            defaultValue: true,
            public: true,
            fallBackToParentStateVariable: "splitSymbols",
            fallBackToSourceCompositeStateVariable: "splitSymbols",
        };

        attributes.parseScientificNotation = {
            description:
                "Whether to parse expressions like 1e3 as scientific notation.",
            createComponentOfType: "boolean",
            createStateVariable: "parseScientificNotation",
            defaultValue: false,
            public: true,
            fallBackToParentStateVariable: "parseScientificNotation",
        };

        return attributes;
    }

    // A math is read from text as a `<math>` reads it.
    static parseTextPiece(text, settings) {
        return parseMathText(text, settings);
    }

    // Whether a math whose value is a list (`1, 2, 3`) is one entry per item:
    // when asked to, or when it is the list's only child or piece of text.
    static mergesMathChild({ sources, mergeAttribute }) {
        return Boolean(mergeAttribute) || sources.length === 1;
    }

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        stateVariableDefinitions.textPieceParseSettings = {
            returnDependencies: () => ({
                functionSymbols: {
                    dependencyType: "stateVariable",
                    variableName: "functionSymbols",
                },
                splitSymbols: {
                    dependencyType: "stateVariable",
                    variableName: "splitSymbols",
                },
                parseScientificNotation: {
                    dependencyType: "stateVariable",
                    variableName: "parseScientificNotation",
                },
            }),
            definition: ({ dependencyValues }) => ({
                setValue: { textPieceParseSettings: { ...dependencyValues } },
            }),
        };

        const mergeMathLists = stateVariableDefinitions.mergeMathLists;
        stateVariableDefinitions.mergeMathLists = {
            ...mergeMathLists,
            description:
                "Whether nested math lists are merged into the parent list.",
            public: true,
            shadowingInstructions: {
                createComponentOfType: "boolean",
            },
        };

        return stateVariableDefinitions;
    }
}

/**
 * The math that `text` is, as a `<math>` of text format with the parse
 * settings `settings` reads it (blank when it does not parse).
 * `createIntervals` reads it as an `<interval>` does.
 */
export function parseMathText(
    text,
    { functionSymbols, splitSymbols, parseScientificNotation } = {},
    { createIntervals = false } = {},
) {
    let value;
    try {
        value = textToMathFactory({
            functionSymbols,
            splitSymbols,
            parseScientificNotation,
        })(text);
    } catch (e) {
        value = me.fromAst("＿");
    }
    return normalizeMathExpression({
        value,
        simplify: "none",
        expand: false,
        createVectors: false,
        createIntervals,
    });
}
