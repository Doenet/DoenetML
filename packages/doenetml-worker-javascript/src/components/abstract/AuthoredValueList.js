import ValueListComponent, {
    entryKind,
    entryValueOfType,
} from "./ValueListComponent";
import me from "math-expressions";
import { convertValueToMathExpression } from "@doenet/utils";
import {
    returnGroupIntoComponentTypeSeparatedBySpacesOutsideParens,
    splitBySpacesOutsideParens,
} from "../commonsugar/lists";
import { returnNumberDisplayAttributes } from "../../utils/numberDisplay";
import { returnUnorderedListStateVariableDefinitions } from "../../utils/unorderedLists";

/**
 * Base class for the lists an author writes out: `<numberList>`,
 * `<mathList>`, `<textList>`, `<booleanList>` and `<intervalList>`. Each is a
 * list component (`ValueListComponent`, Doenet/DoenetML#2160): one component
 * holding its values, which a parent reads, and the viewer draws, as one
 * child per value.
 *
 * The entries come from the list's children, in order:
 * - its text, split at the spaces outside parentheses, each piece parsed as
 *   a value of the entries' type by the list (`parseTextPiece`), with no
 *   component for it;
 * - an authored child (`<math displayDigits="5">pi</math>`), which stays a
 *   component, and whose entry is its value, shown with the display settings
 *   it sets;
 * - a reference (`$a`), a value reference (`_ref`) to what it reads;
 * - a list among the children, or a reference to one, which gives its
 *   entries.
 *
 * A piece of text mixed with a reference (`$f(x)`) is made a component of
 * the entries' type by sugar, as before.
 *
 * A value written to an entry goes where the entry's value comes from: the
 * child, the list a nested entry belongs to, or, for a piece of text, the
 * list itself (`textPieceWrites`), which keeps it and saves it.
 *
 * A list made by shadowing a variable that holds an array (a `<numberList>`
 * a reference to `matrixSize` makes) has no children, and its entries are
 * that array (`listValuesShadow`).
 */
export default class AuthoredValueList extends ValueListComponent {
    static componentType = "_authoredValueList";

    static listEntryValuesVariable = "listValues";
    static listEntriesWriteToValues = true;
    static listEntriesFixedByDefault = false;
    static listEntryDisplaySettingsVariable = "entryDisplaySettings";

    static includeBlankStringChildren = true;
    static removeBlankStringChildrenPostSugar = true;

    // The list reads its children as its entries, so a composite among them
    // with no replacement adds no entry.
    static descendantCompositesMustHaveAReplacement = false;

    // Include children that can be added due to sugar
    static additionalSchemaChildren = ["string"];

    // A reference to the whole list reads these of the list itself, as
    // they were the list's own when it was a composite (`$l.unordered`).
    static listOwnProperties = [
        ...ValueListComponent.listOwnProperties,
        "unordered",
        "maxNumber",
        "mergeMathLists",
        "functionSymbols",
        "splitSymbols",
        "parseScientificNotation",
    ];

    // The child groups whose children are entries, besides text.
    static listChildGroups = [];

    // When another component has an attribute that is this list, or a
    // variable whose shadow is this list, the array of values populates it.
    static get stateVariableToBeShadowed() {
        return this.listValuesArrayName;
    }
    static primaryStateVariableForDefinition = "listValuesShadow";

    /**
     * Whether a piece of text that sugar finds on its own stays text for
     * the list to parse (`parseTextPiece`), rather than being made a
     * component of the entries' type. All pieces, unless a subclass parses
     * only some.
     */
    static keepsTextPiece(text) {
        return true;
    }

    /**
     * The pieces of `text` that are entries: the text separated at the
     * spaces outside parentheses, as sugar separates it.
     */
    static splitTextIntoPieces(text) {
        return splitBySpacesOutsideParens(text);
    }

    /**
     * The value of the entries' type that a piece of text is: how a
     * component of that type made from the text would read it. `settings`
     * are the list's `textPieceParseSettings`.
     */
    static parseTextPiece(text, settings) {
        throw Error(`${this.componentType} must define parseTextPiece`);
    }

    /**
     * Whether a math child whose value is a list (`1, 2, 3`) is several
     * entries, one for each of its items. `sources` are the children and
     * pieces of text the entries come from, `mergeAttribute` the
     * `mergeMathLists` attribute when the list has one.
     */
    static mergesMathChild({ sources, mergeAttribute }) {
        return false;
    }

    static createAttributesObject() {
        let attributes = super.createAttributesObject();

        attributes.maxNumber = {
            description: "Maximum number of items to retain in the list.",
            createComponentOfType: "number",
            createStateVariable: "maxNumber",
            defaultValue: Infinity,
            public: true,
        };

        return attributes;
    }

    static returnSugarInstructions() {
        let sugarInstructions = super.returnSugarInstructions();

        const listClass = this;
        const group =
            returnGroupIntoComponentTypeSeparatedBySpacesOutsideParens({
                componentType: this.listEntryComponentType,
                keepTextGroup: (text) => listClass.keepsTextPiece(text),
            });

        sugarInstructions.push({
            replacementFunction: function ({
                matchedChildren,
                componentInfoObjects,
                nComponents,
                stateIdInfo,
            }) {
                return group({
                    matchedChildren,
                    componentInfoObjects,
                    nComponents,
                    stateIdInfo,
                });
            },
        });

        return sugarInstructions;
    }

    static returnChildGroups() {
        return [
            ...this.listChildGroups,
            {
                group: "strings",
                componentTypes: ["string"],
            },
        ];
    }

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        const listClass = this;
        const entryType = this.listEntryComponentType;
        const kind = entryKind(entryType);
        const childGroups = [
            ...this.listChildGroups.map((x) => x.group),
            "strings",
        ];
        const displayNames =
            kind === "math" || kind === "number"
                ? Object.keys(returnNumberDisplayAttributes())
                : [];

        Object.assign(
            stateVariableDefinitions,
            returnUnorderedListStateVariableDefinitions(),
        );

        stateVariableDefinitions.listValuesShadow = {
            defaultValue: null,
            hasEssential: true,
            returnDependencies: () => ({}),
            definition: () => ({
                useEssentialOrDefaultValue: {
                    listValuesShadow: true,
                },
            }),
        };

        // What a piece of text is parsed with; a `<mathList>` gives its
        // `splitSymbols`, `functionSymbols` and `parseScientificNotation`.
        stateVariableDefinitions.textPieceParseSettings = {
            returnDependencies: () => ({}),
            definition: () => ({ setValue: { textPieceParseSettings: {} } }),
        };

        // The pieces of the list's text, and the value each is parsed as.
        stateVariableDefinitions.textPieceValues = {
            returnDependencies: () => ({
                stringChildren: {
                    dependencyType: "child",
                    childGroups: ["strings"],
                },
                settings: {
                    dependencyType: "stateVariable",
                    variableName: "textPieceParseSettings",
                },
            }),
            definition({ dependencyValues }) {
                const textPieceValues = [];
                for (const text of dependencyValues.stringChildren) {
                    for (const piece of listClass.splitTextIntoPieces(text)) {
                        textPieceValues.push(
                            listClass.parseTextPiece(
                                piece,
                                dependencyValues.settings,
                            ),
                        );
                    }
                }
                return { setValue: { textPieceValues } };
            },
        };

        // A value written to the entry of a piece of text, by the piece's
        // index, which stands for the piece's value from then on. A reader's
        // writes are saved and read back on load.
        stateVariableDefinitions.textPieceWrites = {
            isArray: true,
            entryPrefixes: ["textPieceWrite"],
            hasEssential: true,
            defaultValueByArrayKey: () => null,
            returnArraySizeDependencies: () => ({
                textPieceValues: {
                    dependencyType: "stateVariable",
                    variableName: "textPieceValues",
                },
            }),
            returnArraySize({ dependencyValues }) {
                return [dependencyValues.textPieceValues.length];
            },
            returnArrayDependenciesByKey: () => ({}),
            arrayDefinitionByKey({ arrayKeys }) {
                const useEssential = {};
                for (const arrayKey of arrayKeys) {
                    useEssential[arrayKey] = true;
                }
                return {
                    useEssentialOrDefaultValue: {
                        textPieceWrites: useEssential,
                    },
                };
            },
            inverseArrayDefinitionByKey: ({ desiredStateVariableValues }) => ({
                success: true,
                instructions: [
                    {
                        setEssentialValue: "textPieceWrites",
                        value: desiredStateVariableValues.textPieceWrites,
                    },
                ],
            }),
        };

        stateVariableDefinitions.mergeMathLists = {
            returnDependencies: () => ({
                mergeMathListsAttr: {
                    dependencyType: "attributeComponent",
                    attributeName: "mergeMathLists",
                    variableNames: ["value"],
                },
                children: {
                    dependencyType: "child",
                    childGroups,
                    skipComponentIndices: true,
                },
            }),
            definition({ dependencyValues }) {
                const sources = [];
                for (const child of dependencyValues.children) {
                    if (typeof child === "string") {
                        for (const piece of listClass.splitTextIntoPieces(
                            child,
                        )) {
                            sources.push(piece);
                        }
                    } else {
                        sources.push(child);
                    }
                }
                return {
                    setValue: {
                        mergeMathLists: listClass.mergesMathChild({
                            sources,
                            mergeAttribute:
                                dependencyValues.mergeMathListsAttr?.stateValues
                                    .value,
                        }),
                    },
                };
            },
        };

        // The values of the entries (`values`), where each comes from
        // (`sources`), and the display settings each is shown with
        // (`displaySettings`, `null` for the list's).
        stateVariableDefinitions.listEntries = {
            // A reference to the whole list reads them from the list.
            shadowVariable: true,
            returnDependencies: () => ({
                children: {
                    dependencyType: "child",
                    childGroups,
                    variableNames: [
                        "value",
                        ...displayNames,
                        "referentInfo",
                        "entryOfReference",
                    ],
                    variablesOptional: true,
                },
                textPieceValues: {
                    dependencyType: "stateVariable",
                    variableName: "textPieceValues",
                },
                textPieceWrites: {
                    dependencyType: "stateVariable",
                    variableName: "textPieceWrites",
                },
                shadow: {
                    dependencyType: "stateVariable",
                    variableName: "listValuesShadow",
                },
                maxNumber: {
                    dependencyType: "stateVariable",
                    variableName: "maxNumber",
                },
                mergeMathLists: {
                    dependencyType: "stateVariable",
                    variableName: "mergeMathLists",
                },
                ...Object.fromEntries(
                    displayNames.map((name) => [
                        name,
                        { dependencyType: "stateVariable", variableName: name },
                    ]),
                ),
            }),
            definition({ dependencyValues, usedDefault }) {
                let values = [];
                let entrySources = [];
                let entryDisplaySettings = [];

                const listSettings = {};
                const listSetsDisplay = {};
                for (const name of displayNames) {
                    listSettings[name] = dependencyValues[name];
                    listSetsDisplay[name] = !usedDefault[name];
                }

                // The value of one source of entries (a child or a piece of
                // text), which is one entry, or, when the math lists merge
                // and it is a list, one entry per item.
                function addEntries(value, source, settings) {
                    if (
                        dependencyValues.mergeMathLists &&
                        value instanceof me.class &&
                        Array.isArray(value.tree) &&
                        value.tree[0] === "list"
                    ) {
                        const nComponents = value.tree.length - 1;
                        for (let i = 0; i < nComponents; i++) {
                            values.push(
                                entryValueOfType(
                                    value.get_component(i),
                                    entryType,
                                ),
                            );
                            entrySources.push({
                                ...source,
                                component: i,
                                nComponents,
                            });
                            entryDisplaySettings.push(settings);
                        }
                    } else {
                        values.push(entryValueOfType(value, entryType));
                        entrySources.push(source);
                        entryDisplaySettings.push(settings);
                    }
                }

                let pieceInd = 0;
                let componentInd = 0;
                for (const [
                    childInd,
                    child,
                ] of dependencyValues.children.entries()) {
                    if (typeof child === "string") {
                        for (const _piece of listClass.splitTextIntoPieces(
                            child,
                        )) {
                            const write =
                                dependencyValues.textPieceWrites[pieceInd];
                            addEntries(
                                write === null || write === undefined
                                    ? dependencyValues.textPieceValues[pieceInd]
                                    : restoredValue(write, kind),
                                { pieceInd },
                                null,
                            );
                            pieceInd++;
                        }
                        continue;
                    }

                    const settings = childDisplaySettings({
                        child,
                        childUsedDefault: usedDefault.children?.[componentInd],
                        displayNames,
                        listSettings,
                        listSetsDisplay,
                    });
                    componentInd++;

                    addEntries(child.stateValues.value, { childInd }, settings);
                }

                if (
                    dependencyValues.children.length === 0 &&
                    dependencyValues.shadow !== null
                ) {
                    values = [...dependencyValues.shadow];
                    entrySources = values.map((_, shadowInd) => ({
                        shadowInd,
                    }));
                    entryDisplaySettings = values.map(() => null);
                }

                const maxNumber = dependencyValues.maxNumber;
                if (values.length > maxNumber) {
                    values = values.slice(0, maxNumber);
                    entrySources = entrySources.slice(0, maxNumber);
                    entryDisplaySettings = entryDisplaySettings.slice(
                        0,
                        maxNumber,
                    );
                }

                return {
                    setValue: {
                        listEntries: {
                            values,
                            sources: entrySources,
                            displaySettings: entryDisplaySettings,
                        },
                    },
                };
            },
            async inverseDefinition({
                desiredStateVariableValues,
                dependencyValues,
                stateValues,
                workspace,
            }) {
                // the values desired at some entries, by their index
                const desired = desiredStateVariableValues.listEntries;
                const { values, sources: entrySources } =
                    await stateValues.listEntries;

                const instructions = [];
                const pieceWrites = {};
                // The entries of one write can arrive one by one, so what
                // was written to a source holding several of them is kept
                // in the workspace until the write is done.
                if (!workspace.mergedSources) {
                    workspace.mergedSources = {};
                }
                const mergedSources = workspace.mergedSources;
                let wroteShadow = false;

                for (const key in desired) {
                    const source = entrySources[key];
                    if (!source) {
                        continue;
                    }
                    const value = desired[key];
                    if (source.component !== undefined) {
                        // An item of a math whose value is a list: the
                        // child or piece of text is written the whole list.
                        const sourceKey =
                            source.pieceInd === undefined
                                ? `child${source.childInd}`
                                : `piece${source.pieceInd}`;
                        if (!mergedSources[sourceKey]) {
                            const first = Number(key) - source.component;
                            mergedSources[sourceKey] = {
                                source,
                                items: values
                                    .slice(first, first + source.nComponents)
                                    .map((x) =>
                                        convertValueToMathExpression(x),
                                    ),
                            };
                        }
                        mergedSources[sourceKey].items[source.component] =
                            convertValueToMathExpression(value);
                        mergedSources[sourceKey].written = true;
                    } else if (source.pieceInd !== undefined) {
                        pieceWrites[source.pieceInd] = value;
                    } else if (source.shadowInd !== undefined) {
                        if (!workspace.shadowWrites) {
                            workspace.shadowWrites = [
                                ...dependencyValues.shadow,
                            ];
                        }
                        workspace.shadowWrites[source.shadowInd] = value;
                        wroteShadow = true;
                    } else {
                        const child =
                            dependencyValues.children[source.childInd];
                        instructions.push({
                            setDependency: "children",
                            desiredValue: valueForChild(value, child),
                            childIndex: source.childInd,
                            variableIndex: 0,
                        });
                    }
                }

                for (const { source, items, written } of Object.values(
                    mergedSources,
                )) {
                    if (!written) {
                        continue;
                    }
                    const list = me.fromAst([
                        "list",
                        ...items.map((x) => x.tree),
                    ]);
                    if (source.pieceInd !== undefined) {
                        pieceWrites[source.pieceInd] = list;
                    } else {
                        instructions.push({
                            setDependency: "children",
                            desiredValue: list,
                            childIndex: source.childInd,
                            variableIndex: 0,
                        });
                    }
                }
                if (Object.keys(pieceWrites).length > 0) {
                    instructions.push({
                        setDependency: "textPieceWrites",
                        desiredValue: pieceWrites,
                    });
                }
                if (wroteShadow) {
                    instructions.push({
                        setDependency: "shadow",
                        desiredValue: workspace.shadowWrites,
                    });
                }

                return { success: true, instructions };
            },
        };

        stateVariableDefinitions.listValues = {
            returnDependencies: () => ({
                listEntries: {
                    dependencyType: "stateVariable",
                    variableName: "listEntries",
                },
            }),
            definition: ({ dependencyValues }) => ({
                setValue: { listValues: dependencyValues.listEntries.values },
            }),
            inverseDefinition: ({ desiredStateVariableValues }) => ({
                success: true,
                instructions: [
                    {
                        setDependency: "listEntries",
                        desiredValue: desiredStateVariableValues.listValues,
                    },
                ],
            }),
        };

        stateVariableDefinitions.entryDisplaySettings = {
            returnDependencies: () => ({
                listEntries: {
                    dependencyType: "stateVariable",
                    variableName: "listEntries",
                },
            }),
            definition: ({ dependencyValues }) => ({
                setValue: {
                    entryDisplaySettings:
                        dependencyValues.listEntries.displaySettings,
                },
            }),
        };

        stateVariableDefinitions.entriesInUnorderedList = {
            returnDependencies: () => ({
                unordered: {
                    dependencyType: "stateVariable",
                    variableName: "unordered",
                },
            }),
            definition: ({ dependencyValues, usedDefault }) => ({
                setValue: {
                    entriesInUnorderedList:
                        !usedDefault.unordered &&
                        Boolean(dependencyValues.unordered),
                },
            }),
        };

        // The number of values, by the names authors have used for it.
        stateVariableDefinitions.numComponents = {
            description: "The number of items in the list.",
            public: true,
            shadowingInstructions: {
                createComponentOfType: "number",
            },
            returnDependencies: () => ({
                numEntries: {
                    dependencyType: "stateVariable",
                    variableName: "numEntries",
                },
            }),
            definition: ({ dependencyValues }) => ({
                setValue: { numComponents: dependencyValues.numEntries },
            }),
        };

        stateVariableDefinitions.numValues = {
            isAlias: true,
            targetVariableName: "numComponents",
            description: "The number of values in the list.",
        };

        stateVariableDefinitions.values = {
            isAlias: true,
            targetVariableName: this.listValuesArrayName,
        };

        return stateVariableDefinitions;
    }
}

/**
 * The display settings the entry of `child` is shown with, or `null` for the
 * list's. A setting the child sets itself wins over the list's, except that
 * the list's wins over one a reference reads from its referent: the list is
 * then the innermost thing an author wrote around the value. A setting the
 * list does not set is the child's.
 */
function childDisplaySettings({
    child,
    childUsedDefault,
    displayNames,
    listSettings,
    listSetsDisplay,
}) {
    if (displayNames.length === 0) {
        return null;
    }
    const isReference =
        child.stateValues.referentInfo !== undefined ||
        Boolean(child.stateValues.entryOfReference);
    const settings = {};
    let differs = false;

    // `displayDigits` and `displayDecimals` go together: whichever sets one
    // of them sets both.
    const groups = [["displayDigits", "displayDecimals"]];
    for (const name of displayNames) {
        if (name !== "displayDigits" && name !== "displayDecimals") {
            groups.push([name]);
        }
    }

    for (const names of groups) {
        const childValues = names.map((name) => child.stateValues[name]);
        const childSets =
            childValues.every((value) => value !== undefined) &&
            names.some((name) => !childUsedDefault?.[name]);
        const listSets = names.some((name) => listSetsDisplay[name]);
        const useChild = childSets && !(isReference && listSets);
        for (const [i, name] of names.entries()) {
            settings[name] = useChild ? childValues[i] : listSettings[name];
            if (settings[name] !== listSettings[name]) {
                differs = true;
            }
        }
    }

    return differs ? settings : null;
}

/** `value`, written to an entry, as `child` takes it. */
function valueForChild(value, child) {
    if (child.stateValues.value instanceof me.class) {
        return convertValueToMathExpression(value);
    }
    if (
        typeof child.stateValues.value === "number" &&
        value instanceof me.class
    ) {
        const number = value.evaluate_to_constant();
        return typeof number === "number" ? number : NaN;
    }
    return value;
}

/**
 * A value written to a piece of text, as the entry holds it. A saved state
 * keeps a math as its tree.
 */
function restoredValue(value, kind) {
    if (kind === "math" && !(value instanceof me.class)) {
        return convertValueToMathExpression(value);
    }
    return value;
}
