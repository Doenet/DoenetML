import BaseComponent from "./BaseComponent";
import me from "math-expressions";
import {
    normalizeMathExpression,
    returnSelectedStyleStateVariableDefinition,
    returnTextStyleDescriptionDefinitions,
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
import { returnMathVectorMatrixStateVariableDefinitions } from "../../utils/mathVectorMatrixStateVariables";

/**
 * Base class for a list component: one component that holds a list of values,
 * which a parent sees, and the viewer draws, as one child per value, of
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
 * computes the values as a plain array; this class keeps them in the array
 * `maths` or `numbers`, which `$l[2]` indexes, and computes from them
 * what a parent reads of an entry: its text, its latex, and its value as the
 * other type. An entry reads its display settings, `hidden` and `fixed` from
 * the list. The values are computed, so the entries are `fixed` and cannot be
 * modified.
 */
export default class ValueListComponent extends BaseComponent {
    static componentType = "_valueList";
    // The list is drawn as its entries, each by the renderer of its type
    // (`RendererInstructionBuilder`), so it has no renderer of its own; this
    // is the type its entries need.
    static get rendererType() {
        return this.listEntryComponentType;
    }

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

    // Built once for each list class.
    static get listEntryStateVariables() {
        if (!Object.hasOwn(this, "builtListEntryStateVariables")) {
            this.builtListEntryStateVariables = Object.freeze(
                this.buildListEntryStateVariables(),
            );
        }
        return this.builtListEntryStateVariables;
    }

    static buildListEntryStateVariables() {
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
            disabled: "disabled",
            fixLocation: "fixLocation",
            selectedStyle: "selectedStyle",
            styleNumber: "styleNumber",
            doenetML: "doenetML",
        };
        for (const name in returnTextStyleDescriptionDefinitions()) {
            variables[name] = name;
        }
        for (const name in ENTRY_RENDERER_DEFAULTS) {
            variables[name] = name;
        }
        for (const name in returnNumberDisplayAttributes()) {
            variables[name] = name;
        }
        return variables;
    }

    // A reference to the whole list reads these of the list itself
    // (`$l.styleNumber` is the style of the list as a whole).
    static listOwnProperties = [
        "styleNumber",
        "hide",
        "modifyIndirectly",
        "isResponse",
        "permid",
        "doenetML",
    ];

    // The properties of a `<math>` entry that a `<math>` computes from its
    // value (`$l[2].numDimensions`, `$l[2].x`), computed from the entry's
    // value in the same way.
    static get listEntryDerivedProperties() {
        return this.listEntryComponentType === "math"
            ? MATH_ENTRY_DERIVED_PROPERTIES
            : {};
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

        // A reference to the whole list (`$l`), and a `<collect>` that
        // gathers the list by the type of its entries, show the entries,
        // which the list's own `hide` does not hide, as the copies of a
        // composite's replacements were not hidden by the composite's `hide`.
        // So does a copy of such a reference, made by referencing something
        // that holds it (`$p` for `<p name="p">$l</p>`, or `$g` for
        // `<group name="g">$l</group>`). Such a list is hidden only by a
        // `hide` of its own, its parent or its source composite. A copy that
        // is another list of this type (`<cumulativeSum extend="$l">`,
        // `<collect componentType="cumulativeSum">`), or a reference to
        // something holding the list itself (`$g` for
        // `<group name="g"><cumulativeSum hide>…</cumulativeSum></group>`),
        // is hidden with the list.
        const listComponentType = this.componentType;
        stateVariableDefinitions.hideIsOwn = {
            returnDependencies: () => ({
                shadowSource: {
                    dependencyType: "shadowSource",
                },
                shadowSourceHideIsOwn: {
                    dependencyType: "shadowSourceStateVariable",
                    variableName: "hideIsOwn",
                },
                sourceComposite: {
                    dependencyType: "sourceCompositeIdentity",
                },
                sourceCompositeExtends: {
                    dependencyType: "sourceCompositeStateVariable",
                    variableName: "extendIdx",
                },
                sourceCompositeCreatesType: {
                    dependencyType: "sourceCompositeStateVariable",
                    variableName: "createComponentOfType",
                },
                sourceCompositeCollectsType: {
                    dependencyType: "sourceCompositeStateVariable",
                    variableName: "componentTypeToCollect",
                },
            }),
            definition({ dependencyValues, componentInfoObjects }) {
                let hideIsOwn = false;
                if (dependencyValues.shadowSource !== null) {
                    const sourceType =
                        dependencyValues.sourceComposite?.componentType;
                    const shadowsShownList = Boolean(
                        dependencyValues.shadowSourceHideIsOwn,
                    );
                    if (sourceType === "_copy") {
                        hideIsOwn =
                            dependencyValues.sourceCompositeCreatesType ==
                                null &&
                            (dependencyValues.sourceCompositeExtends ===
                                dependencyValues.shadowSource.componentIdx ||
                                shadowsShownList);
                    } else if (sourceType === "collect") {
                        const collected =
                            dependencyValues.sourceCompositeCollectsType;
                        hideIsOwn =
                            collected != null &&
                            !componentInfoObjects.isInheritedComponentType({
                                inheritedComponentType: listComponentType,
                                baseComponentType: collected,
                            });
                    } else {
                        hideIsOwn = shadowsShownList;
                    }
                }
                return { setValue: { hideIsOwn } };
            },
        };

        const baseHidden = stateVariableDefinitions.hidden;
        stateVariableDefinitions.hidden = {
            ...baseHidden,
            returnDependencies: (args) => ({
                ...baseHidden.returnDependencies(args),
                ownHide: {
                    dependencyType: "attributeComponent",
                    attributeName: "hide",
                    variableNames: ["value"],
                    dontRecurseToShadows: true,
                },
                hideIsOwn: {
                    dependencyType: "stateVariable",
                    variableName: "hideIsOwn",
                },
            }),
            definition(args) {
                const { dependencyValues } = args;
                if (!dependencyValues.hideIsOwn) {
                    return baseHidden.definition(args);
                }
                return baseHidden.definition({
                    ...args,
                    dependencyValues: {
                        ...dependencyValues,
                        hide: Boolean(
                            dependencyValues.ownHide?.stateValues.value,
                        ),
                    },
                });
            },
        };

        Object.assign(
            stateVariableDefinitions,
            returnSelectedStyleStateVariableDefinition(),
        );

        // How the text of every entry is styled, which a reference to an
        // entry reads (`$l[2].textColor`).
        for (const [name, definition] of Object.entries(
            returnTextStyleDescriptionDefinitions(),
        )) {
            stateVariableDefinitions[name] = { ...definition, public: false };
        }

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
                // which goes stale only when it changed. Either way, the
                // parent now renders another number of entries.
                return this.svComponent.entryCountChanged ||
                    this.shadowOfComponentIdx !== undefined
                    ? { updateParentRenderedChildren: true }
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

        // Not a property an author names: `$l[2]` and `$l[2].value` read it
        // (`listEntryPropertyPath`), as does a reference to the whole list.
        stateVariableDefinitions[arrayName] = {
            isArray: true,
            entryPrefixes: [entryPrefix],
            // A reference to the whole list is a shadow that reads the values
            // from the list it references rather than computing them.
            shadowVariable: true,
            // An entry's display settings are the list's, for a reference to
            // one entry as for the entries a parent sees. A copy of an entry
            // (`<math copy="$l[2]"/>`) takes the list's display attributes as
            // written, so one given as a reference (`displayDigits="$dd"`)
            // keeps following it.
            shadowingInstructions: {
                createComponentOfType: entryType,
                addAttributeComponentsShadowingStateVariables:
                    returnNumberDisplayAttributeComponentShadowing(),
                attributesToShadow: Object.keys(
                    returnNumberDisplayAttributes(),
                ),
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

        // What the renderer of an entry reads beyond its value, at the
        // values a `<math>` or `<number>` has by default.
        for (const [name, value] of Object.entries(ENTRY_RENDERER_DEFAULTS)) {
            stateVariableDefinitions[name] = {
                forRenderer: true,
                returnDependencies: () => ({}),
                definition: () => ({ setValue: { [name]: value() } }),
            };
        }

        return stateVariableDefinitions;
    }
}

/**
 * The variables the renderer of a `<math>` or `<number>` entry reads besides
 * its `latex` or `text`, `hidden`, `disabled`, `fixed`, `fixLocation` and
 * `selectedStyle`, with the values those components have by default.
 */
const ENTRY_RENDERER_DEFAULTS = {
    anchor: () => me.fromAst(["vector", 0, 0]),
    positionFromAnchor: () => "center",
    draggable: () => true,
    layer: () => 0,
    renderMode: () => "inline",
    renderAsMath: () => false,
    clickTarget: () => false,
};

const mathStructure = returnMathVectorMatrixStateVariableDefinitions();

function entryNumDimensions(value) {
    return mathStructure.numDimensions.definition({
        dependencyValues: { value },
    }).setValue.numDimensions;
}

function entryMatrixSize(value) {
    return mathStructure.matrixSize.definition({ dependencyValues: { value } })
        .setValue.matrixSize;
}

// The entry's components as a vector: the value itself when it has one
// dimension, otherwise a tuple of its components.
function entryVector(value) {
    const numDimensions = entryNumDimensions(value);
    const { vector } = mathStructure.vector.arrayDefinitionByKey({
        globalDependencyValues: { value },
        arraySize: [numDimensions],
    }).setValue;
    if (numDimensions === 1) {
        return vector[0];
    }
    return me.fromAst([
        "tuple",
        ...Array.from({ length: numDimensions }, (_, i) => vector[i].tree),
    ]);
}

// The entry as a matrix (a number is a 1 × 1 matrix).
function entryMatrix(value) {
    const [numRows, numColumns] = entryMatrixSize(value);
    const { matrix } = mathStructure.matrix.arrayDefinitionByKey({
        globalDependencyValues: { value },
        arraySize: [numRows, numColumns],
    }).setValue;
    const rows = Array.from({ length: numRows }, (_, i) => [
        "tuple",
        ...Array.from(
            { length: numColumns },
            (_, j) => matrix[`${i},${j}`]?.tree ?? "\uff3f",
        ),
    ]);
    return me.fromAst([
        "matrix",
        ["tuple", numRows, numColumns],
        ["tuple", ...rows],
    ]);
}

/**
 * The properties of a `<math>` entry computed from one of its values (`from`,
 * an entry property), with the type of the component that holds each, and
 * the property of a `<math>` whose display settings it travels with.
 */
const MATH_ENTRY_DERIVED_PROPERTIES = {
    numDimensions: {
        from: "value",
        componentType: "integer",
        compute: entryNumDimensions,
    },
    matrixSize: {
        from: "value",
        componentType: "numberList",
        compute: entryMatrixSize,
    },
    numRows: {
        from: "value",
        componentType: "integer",
        compute: (value) => entryMatrixSize(value)[0],
    },
    numColumns: {
        from: "value",
        componentType: "integer",
        compute: (value) => entryMatrixSize(value)[1],
    },
    isNumeric: {
        from: "number",
        componentType: "boolean",
        compute: (number) => Number.isFinite(number),
    },
    x1: {
        from: "value",
        componentType: "math",
        companionsOf: "vector",
        compute: (value) =>
            mathStructure.vector.arrayDefinitionByKey({
                globalDependencyValues: { value },
                arraySize: [entryNumDimensions(value)],
            }).setValue.vector[0],
    },
    vector: {
        from: "value",
        componentType: "math",
        companionsOf: "vector",
        compute: entryVector,
    },
    list: {
        from: "value",
        componentType: "math",
        companionsOf: "list",
        compute: entryVector,
    },
    matrix: {
        from: "value",
        componentType: "math",
        companionsOf: "matrix",
        compute: entryMatrix,
    },
};

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
