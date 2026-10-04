import BaseComponent from "./BaseComponent";
import me from "math-expressions";
import {
    normalizeMathExpression,
    returnSelectedStyleStateVariableDefinition,
} from "@doenet/utils";
import {
    buildNumberDisplayParameters,
    returnNumberDisplayAttributeComponentShadowing,
    returnNumberDisplayAttributes,
    returnNumberDisplayStateVariableDefinitions,
} from "../../utils/numberDisplay";
import {
    numberToMathExpression,
    plainComplex,
    roundForDisplay,
    superSubscriptsToUnicode,
} from "../../utils/math";

/**
 * Base class for a list component: one component that holds a list of values
 * and renders them itself, which a parent sees as one child per value, of
 * type `listEntryComponentType` (see `BaseComponent`). Part of
 * Doenet/DoenetML#2157.
 *
 * A composite that makes one component per value costs those components and
 * everything a parent reads from each of them. Here the values stay in one
 * array, and a parent's child dependency reads the whole array once and hands
 * the parent's definitions one record per entry (`childDependencies.ts`), so
 * `<sum>$l</sum>`, `<math>$l</math>` and `<numberList>$l</numberList>` read
 * the entries as they read a composite's replacements.
 *
 * A subclass names, in `listEntryValuesVariable`, the state variable that
 * computes the values as a plain array; this class keeps them in the public
 * array `maths` or `numbers`, which `$l[2]` indexes, and computes from them
 * what a parent reads of an entry: its text, its latex, and its value as the
 * other type. An entry reads its display settings, `hidden` and `fixed` from
 * the list. The values are computed, so the entries are `fixed` and cannot be
 * modified.
 */
export default class ValueListComponent extends BaseComponent {
    static componentType = "_valueList";
    static rendererType = "valueList";

    // `$l[2]` picks an entry.
    static takesIndex = true;

    // A reference to the whole list shadows its values and their number
    // (`maths` or `numbers`, `numEntries`), so it needs none of the
    // children they were computed from.
    static serializeChildrenOnlyIfUnlinked = true;

    // `math` or `number`; set by a subclass.
    static listEntryComponentType = undefined;

    // The state variable of the subclass that computes the values.
    static listEntryValuesVariable = undefined;

    static get listValuesArrayName() {
        return this.listEntryComponentType === "math" ? "maths" : "numbers";
    }

    static listEntryCountVariable = "numEntries";

    static get variableForIndexAsProp() {
        return this.listValuesArrayName;
    }

    static get listEntryStateVariables() {
        const otherType =
            this.listEntryComponentType === "math" ? "number" : "math";
        const variables = {
            value: this.listValuesArrayName,
            [otherType]: "entryOtherTypeValues",
            text: "entryTexts",
            latex: "entryLatexes",
            isNumber: "entryIsNumbers",
            hidden: "hidden",
            fixed: "entriesFixed",
            canBeModified: "entriesCanBeModified",
            unordered: "entriesUnordered",
        };
        for (const name in returnNumberDisplayAttributes()) {
            variables[name] = name;
        }
        return variables;
    }

    static get listPerEntryVariables() {
        return [
            this.listValuesArrayName,
            "entryOtherTypeValues",
            "entryTexts",
            "entryLatexes",
            "entryIsNumbers",
        ];
    }

    /**
     * The variables of the blank component of `componentType` (a `<math>` or
     * a `<text>`) that a parent that must have a replacement
     * (`descendantCompositesMustHaveAReplacement`) sees in place of a
     * reference to a list with no entries, as a copy of an empty composite
     * gives it one (`utils/copy.js`), by the name of each entry variable.
     */
    static listBlankEntryStateValues(componentType) {
        if (componentType === "text") {
            return { value: "", text: "" };
        }
        const blank = me.fromAst("\uff3f");
        const params = buildNumberDisplayParameters({});
        return {
            value: blank,
            math: blank,
            number: NaN,
            isNumber: false,
            text: mathText(blank, params),
            latex: mathLatex(blank, params),
        };
    }

    static createAttributesObject() {
        let attributes = super.createAttributesObject();

        Object.assign(attributes, returnNumberDisplayAttributes());

        attributes.asList = {
            createPrimitiveOfType: "boolean",
            createStateVariable: "asList",
            defaultValue: true,
            highlighted: true,
            forRenderer: true,
            description:
                "Whether to render the items separated by commas (true) or with no separator (false).",
        };

        return attributes;
    }

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        const entryType = this.listEntryComponentType;
        const valuesVariable = this.listEntryValuesVariable;
        const arrayName = this.listValuesArrayName;
        const entryPrefix = entryType;

        Object.assign(
            stateVariableDefinitions,
            returnSelectedStyleStateVariableDefinition(),
        );

        // The entries were `<math>` and `<number>` components with no
        // children, so they take no display settings from the list's
        // children.
        Object.assign(
            stateVariableDefinitions,
            returnNumberDisplayStateVariableDefinitions(),
        );

        // How many values there are, recounted whenever they change. Going
        // stale queues the list, as a composite is queued to update its
        // replacements (`EssentialValueWriter.updateListEntryCount`).
        stateVariableDefinitions.computedNumEntries = {
            returnDependencies: () => ({
                values: {
                    dependencyType: "stateVariable",
                    variableName: valuesVariable,
                },
            }),
            markStale: () => ({ updateReplacements: true }),
            definition({ dependencyValues }) {
                return {
                    setValue: {
                        computedNumEntries: dependencyValues.values.length,
                    },
                };
            },
        };

        // The number of entries, which a parent's child dependency and the
        // size of the array of values read. It does not go stale when the
        // values change, only when the queued list finds that their number
        // did (`entryCountChanged`), so that a change of values alone leaves the entries
        // and what depends on them where they are. A reference to the whole
        // list reads the number of the list it references.
        stateVariableDefinitions.numEntries = {
            shadowVariable: true,
            returnDependencies: () => ({
                computedNumEntries: {
                    dependencyType: "stateVariable",
                    variableName: "computedNumEntries",
                },
            }),
            markStale() {
                // A reference's `numEntries` is the shadow of the list's,
                // which goes stale only when it changed.
                return this.svComponent.entryCountChanged ||
                    this.shadowOfComponentIdx !== undefined
                    ? {}
                    : { fresh: { numEntries: true } };
            },
            definition({ dependencyValues }) {
                return {
                    setValue: {
                        numEntries: dependencyValues.computedNumEntries,
                    },
                };
            },
        };

        stateVariableDefinitions[arrayName] = {
            description:
                entryType === "math"
                    ? "The values of the list, as maths."
                    : "The values of the list, as numbers.",
            public: true,
            isArray: true,
            entryPrefixes: [entryPrefix],
            // A reference to the whole list is a shadow that reads the values
            // from the list it references rather than computing them.
            shadowVariable: true,
            // An entry's display settings are the list's, for a reference to
            // one entry as for the entries a parent sees.
            shadowingInstructions: {
                createComponentOfType: entryType,
                addAttributeComponentsShadowingStateVariables:
                    returnNumberDisplayAttributeComponentShadowing(),
            },
            returnArraySizeDependencies: () => ({
                numEntries: {
                    dependencyType: "stateVariable",
                    variableName: "numEntries",
                },
            }),
            returnArraySize({ dependencyValues }) {
                return [dependencyValues.numEntries];
            },
            returnArrayDependenciesByKey() {
                return {
                    globalDependencies: {
                        values: {
                            dependencyType: "stateVariable",
                            variableName: valuesVariable,
                        },
                    },
                };
            },
            arrayDefinitionByKey({ globalDependencyValues, arrayKeys }) {
                // The array is sized by `numEntries`, which catches up with
                // the number of values only once a change is done, so it
                // can briefly be longer than the values; an entry past them
                // is blank until then.
                let values = {};
                for (let arrayKey of arrayKeys) {
                    values[arrayKey] =
                        globalDependencyValues.values[arrayKey] ??
                        (entryType === "math" ? me.fromAst("＿") : NaN);
                }
                return { setValue: { [arrayName]: values } };
            },
        };

        stateVariableDefinitions.entriesFixed = {
            returnDependencies: () => ({}),
            definition: () => ({ setValue: { entriesFixed: true } }),
        };

        stateVariableDefinitions.entriesCanBeModified = {
            returnDependencies: () => ({}),
            definition: () => ({ setValue: { entriesCanBeModified: false } }),
        };

        stateVariableDefinitions.entriesUnordered = {
            returnDependencies: () => ({}),
            definition: () => ({ setValue: { entriesUnordered: false } }),
        };

        const displayDependencies = {
            displayDigits: {
                dependencyType: "stateVariable",
                variableName: "displayDigits",
            },
            displayDecimals: {
                dependencyType: "stateVariable",
                variableName: "displayDecimals",
            },
            displaySmallAsZero: {
                dependencyType: "stateVariable",
                variableName: "displaySmallAsZero",
            },
            padZeros: {
                dependencyType: "stateVariable",
                variableName: "padZeros",
            },
            avoidScientificNotation: {
                dependencyType: "stateVariable",
                variableName: "avoidScientificNotation",
            },
        };

        // What `valueForDisplay` is for each entry: the value rounded for
        // display, as `<math>` and `<number>` round it.
        stateVariableDefinitions.entryValuesForDisplay = {
            returnDependencies: () => ({
                values: {
                    dependencyType: "stateVariable",
                    variableName: arrayName,
                },
                ...displayDependencies,
            }),
            definition({ dependencyValues }) {
                const entryValuesForDisplay = dependencyValues.values.map(
                    (value) =>
                        entryType === "math"
                            ? mathValueForDisplay(value, dependencyValues)
                            : numberValueForDisplay(value, dependencyValues),
                );
                return { setValue: { entryValuesForDisplay } };
            },
        };

        stateVariableDefinitions.entryTexts = {
            forRenderer: true,
            returnDependencies: () => ({
                entryValuesForDisplay: {
                    dependencyType: "stateVariable",
                    variableName: "entryValuesForDisplay",
                },
                ...displayDependencies,
            }),
            definition({ dependencyValues }) {
                const params = buildNumberDisplayParameters(dependencyValues);
                const entryTexts = dependencyValues.entryValuesForDisplay.map(
                    (value) =>
                        entryType === "math"
                            ? mathText(value, params)
                            : numberToMathExpression(value).toString(params),
                );
                return { setValue: { entryTexts } };
            },
        };

        stateVariableDefinitions.entryLatexes = {
            forRenderer: true,
            returnDependencies: () => ({
                entryValuesForDisplay: {
                    dependencyType: "stateVariable",
                    variableName: "entryValuesForDisplay",
                },
                ...displayDependencies,
            }),
            definition({ dependencyValues }) {
                const params = buildNumberDisplayParameters(dependencyValues);
                const entryLatexes = dependencyValues.entryValuesForDisplay.map(
                    (value) =>
                        entryType === "math"
                            ? mathLatex(value, params)
                            : numberToMathExpression(value).toLatex(params),
                );
                return { setValue: { entryLatexes } };
            },
        };

        // The value of each entry as the other type: an entry `<math>`'s
        // `number`, or an entry `<number>`'s `math`.
        stateVariableDefinitions.entryOtherTypeValues = {
            returnDependencies: () => ({
                values: {
                    dependencyType: "stateVariable",
                    variableName: arrayName,
                },
            }),
            definition({ dependencyValues }) {
                const entryOtherTypeValues = dependencyValues.values.map(
                    (value) =>
                        entryType === "math"
                            ? (plainComplex(value.evaluate_to_constant()) ??
                              NaN)
                            : numberToMathExpression(value),
                );
                return { setValue: { entryOtherTypeValues } };
            },
        };

        stateVariableDefinitions.entryIsNumbers = {
            returnDependencies: () => ({
                values: {
                    dependencyType: "stateVariable",
                    variableName: arrayName,
                },
            }),
            definition({ dependencyValues }) {
                const entryIsNumbers = dependencyValues.values.map((value) =>
                    entryType === "math"
                        ? Number.isFinite(value.tree)
                        : Number.isFinite(value),
                );
                return { setValue: { entryIsNumbers } };
            },
        };

        // A `<math>` entry renders its latex, and a `<number>` entry its
        // text, as each does on its own.
        stateVariableDefinitions.entryType = {
            forRenderer: true,
            returnDependencies: () => ({}),
            definition: () => ({ setValue: { entryType } }),
        };

        return stateVariableDefinitions;
    }
}

function mathValueForDisplay(value, displaySettings) {
    return normalizeMathExpression({
        value: roundForDisplay({ value, dependencyValues: displaySettings }),
        simplify: "none",
        expand: false,
    });
}

function numberValueForDisplay(value, displaySettings) {
    return plainComplex(
        roundForDisplay({
            value: numberToMathExpression(value),
            dependencyValues: displaySettings,
        }).evaluate_to_constant(),
    );
}

function mathText(valueForDisplay, params) {
    try {
        return superSubscriptsToUnicode(valueForDisplay.toString(params));
    } catch (e) {
        return "＿";
    }
}

function mathLatex(valueForDisplay, params) {
    try {
        return valueForDisplay.toLatex(params);
    } catch (e) {
        return "＿";
    }
}
