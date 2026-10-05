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
 * Each entry depends on where its value comes from and nothing else
 * (`entryStructure` says where), so that `<point>($Q.y, 2)</point>` and
 * `<point name="Q">(1, $P.x)</point>`, whose coordinates are such lists,
 * read each other's coordinates without a cycle. A value written to an
 * entry goes to that same place: the child, the list a nested entry belongs
 * to, or, for a piece of text, the list itself (`textPieceWrites`), which
 * keeps it and saves it.
 *
 * A list made by shadowing a variable that holds an array (a `<numberList>`
 * a reference to `matrixSize` makes) has no children, and its entries are
 * that array (`listValuesShadow`).
 */
export default class AuthoredValueList extends ValueListComponent {
    static componentType = "_authoredValueList";

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
        const arrayName = this.listValuesArrayName;
        const componentGroups = this.listChildGroups.map((x) => x.group);
        const childGroups = [...componentGroups, "strings"];
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

        // The value each piece of the list's text is parsed as.
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

        // The value of each piece of text: what was written to it, or what
        // it is parsed as.
        stateVariableDefinitions.textPieceEntryValues = {
            returnDependencies: () => ({
                textPieceValues: {
                    dependencyType: "stateVariable",
                    variableName: "textPieceValues",
                },
                textPieceWrites: {
                    dependencyType: "stateVariable",
                    variableName: "textPieceWrites",
                },
            }),
            definition: ({ dependencyValues }) => ({
                setValue: {
                    textPieceEntryValues: dependencyValues.textPieceValues.map(
                        (value, pieceInd) => {
                            const write =
                                dependencyValues.textPieceWrites[pieceInd];
                            return write === null || write === undefined
                                ? value
                                : restoredValue(write, kind);
                        },
                    ),
                },
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
                        sources.push(...listClass.splitTextIntoPieces(child));
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

        // Where each entry's value comes from, without its value: a piece
        // of text (`pieceInd`), a child (`componentInd`, among the children
        // that are not text, once a list among them is its entries), an
        // item of a piece or child whose value is a list, when the math
        // lists merge (`component` of `nComponents`), or the array the list
        // shadows (`shadowInd`). Only merging reads the values, to count the
        // items.
        stateVariableDefinitions.entryStructure = {
            stateVariablesDeterminingDependencies: ["mergeMathLists"],
            returnDependencies({ stateValues }) {
                return {
                    children: {
                        dependencyType: "child",
                        childGroups,
                        variableNames: stateValues.mergeMathLists
                            ? ["value"]
                            : [],
                        skipComponentIndices: true,
                    },
                    ...(stateValues.mergeMathLists
                        ? {
                              textPieceEntryValues: {
                                  dependencyType: "stateVariable",
                                  variableName: "textPieceEntryValues",
                              },
                          }
                        : {}),
                    shadow: {
                        dependencyType: "stateVariable",
                        variableName: "listValuesShadow",
                    },
                    maxNumber: {
                        dependencyType: "stateVariable",
                        variableName: "maxNumber",
                    },
                };
            },
            definition({ dependencyValues }) {
                let entryStructure = [];

                function addSources(value, source) {
                    if (isMathList(value)) {
                        const nComponents = value.tree.length - 1;
                        for (let i = 0; i < nComponents; i++) {
                            entryStructure.push({
                                ...source,
                                component: i,
                                nComponents,
                            });
                        }
                    } else {
                        entryStructure.push(source);
                    }
                }

                let pieceInd = 0;
                let componentInd = 0;
                for (const child of dependencyValues.children) {
                    if (typeof child === "string") {
                        for (const _piece of listClass.splitTextIntoPieces(
                            child,
                        )) {
                            addSources(
                                dependencyValues.textPieceEntryValues?.[
                                    pieceInd
                                ],
                                { pieceInd },
                            );
                            pieceInd++;
                        }
                    } else {
                        addSources(child.stateValues?.value, { componentInd });
                        componentInd++;
                    }
                }

                if (
                    dependencyValues.children.length === 0 &&
                    dependencyValues.shadow !== null
                ) {
                    entryStructure = dependencyValues.shadow.map(
                        (_, shadowInd) => ({ shadowInd }),
                    );
                }

                if (entryStructure.length > dependencyValues.maxNumber) {
                    entryStructure = entryStructure.slice(
                        0,
                        dependencyValues.maxNumber,
                    );
                }

                return { setValue: { entryStructure } };
            },
        };

        // The number of entries is that of `entryStructure`, so it does not
        // depend on their values.
        stateVariableDefinitions.computedNumEntries = {
            ...stateVariableDefinitions.computedNumEntries,
            returnDependencies: () => ({
                entryStructure: {
                    dependencyType: "stateVariable",
                    variableName: "entryStructure",
                },
            }),
            definition: ({ dependencyValues }) => ({
                setValue: {
                    computedNumEntries: dependencyValues.entryStructure.length,
                },
            }),
        };

        // Each entry reads where its value comes from, and a value written
        // to it goes there.
        stateVariableDefinitions[arrayName] = {
            ...stateVariableDefinitions[arrayName],
            stateVariablesDeterminingDependencies: ["entryStructure"],
            returnArrayDependenciesByKey({ arrayKeys, stateValues }) {
                const globalDependencies = {
                    entryStructure: {
                        dependencyType: "stateVariable",
                        variableName: "entryStructure",
                    },
                    entriesFixed: {
                        dependencyType: "stateVariable",
                        variableName: "entriesFixed",
                    },
                    shadow: {
                        dependencyType: "stateVariable",
                        variableName: "listValuesShadow",
                    },
                };
                const dependenciesByKey = {};
                for (const arrayKey of arrayKeys) {
                    const source = stateValues.entryStructure[arrayKey];
                    if (source?.pieceInd !== undefined) {
                        dependenciesByKey[arrayKey] = {
                            piece: {
                                dependencyType: "stateVariable",
                                variableName: "textPieceValues",
                            },
                            write: {
                                dependencyType: "stateVariable",
                                variableName: `textPieceWrite${source.pieceInd + 1}`,
                            },
                        };
                    } else if (source?.componentInd !== undefined) {
                        dependenciesByKey[arrayKey] = {
                            child: {
                                dependencyType: "child",
                                childGroups: componentGroups,
                                variableNames: ["value"],
                                childIndices: [source.componentInd],
                            },
                        };
                    }
                }
                return { globalDependencies, dependenciesByKey };
            },
            arrayDefinitionByKey({
                globalDependencyValues,
                dependencyValuesByKey,
                arrayKeys,
            }) {
                const entries = {};
                const unchangedChecks = {};
                for (const arrayKey of arrayKeys) {
                    const source =
                        globalDependencyValues.entryStructure[arrayKey];
                    const sourceValue = entrySourceValue({
                        source,
                        dependencyValues: dependencyValuesByKey[arrayKey],
                        shadow: globalDependencyValues.shadow,
                        entryType,
                    });
                    entries[arrayKey] =
                        source?.component === undefined
                            ? sourceValue
                            : isMathList(sourceValue)
                              ? sourceValue.get_component(source.component)
                              : undefined;
                    entries[arrayKey] =
                        entries[arrayKey] === undefined
                            ? blankValue(kind)
                            : entryValueOfType(entries[arrayKey], entryType);
                    unchangedChecks[arrayKey] = true;
                }
                return {
                    setValue: { [arrayName]: entries },
                    checkForActualChange: { [arrayName]: unchangedChecks },
                };
            },
            async inverseArrayDefinitionByKey({
                desiredStateVariableValues,
                globalDependencyValues,
                dependencyValuesByKey,
                dependencyNamesByKey,
                stateValues,
                workspace,
            }) {
                if (globalDependencyValues.entriesFixed) {
                    return { success: false };
                }
                const entryStructure = globalDependencyValues.entryStructure;
                const desired = desiredStateVariableValues[arrayName];

                const instructions = [];
                let wroteShadow = false;
                // The entries of one write can arrive one by one, so what
                // was written to a source holding several of them is kept
                // in the workspace until the write is done.
                if (!workspace.itemsOfSources) {
                    workspace.itemsOfSources = {};
                }

                for (const arrayKey in desired) {
                    const source = entryStructure[arrayKey];
                    if (!source) {
                        continue;
                    }
                    let value = entryValueOfType(desired[arrayKey], entryType);

                    if (source.component !== undefined) {
                        // An item of a math whose value is a list: the
                        // child or piece of text is written the whole list.
                        const sourceKey =
                            source.pieceInd === undefined
                                ? `child${source.componentInd}`
                                : `piece${source.pieceInd}`;
                        let items = workspace.itemsOfSources[sourceKey];
                        if (!items) {
                            const current = entrySourceValue({
                                source,
                                dependencyValues:
                                    dependencyValuesByKey[arrayKey],
                                shadow: globalDependencyValues.shadow,
                                entryType,
                            });
                            items = workspace.itemsOfSources[sourceKey] =
                                current.tree
                                    .slice(1)
                                    .map((tree) => me.fromAst(tree));
                        }
                        items[source.component] =
                            convertValueToMathExpression(value);
                        value = me.fromAst([
                            "list",
                            ...items.map((x) => x.tree),
                        ]);
                    }

                    if (source.pieceInd !== undefined) {
                        instructions.push({
                            setDependency: dependencyNamesByKey[arrayKey].write,
                            desiredValue: value,
                        });
                    } else if (source.shadowInd !== undefined) {
                        if (!workspace.shadowWrites) {
                            workspace.shadowWrites = [
                                ...globalDependencyValues.shadow,
                            ];
                        }
                        workspace.shadowWrites[source.shadowInd] = value;
                        wroteShadow = true;
                    } else {
                        const child =
                            dependencyValuesByKey[arrayKey].child?.[0];
                        if (!child) {
                            continue;
                        }
                        instructions.push({
                            setDependency: dependencyNamesByKey[arrayKey].child,
                            desiredValue: valueForChild(value, child),
                            childIndex: 0,
                            variableIndex: 0,
                        });
                    }
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

        // The display settings each entry is shown with, `null` for the
        // list's.
        stateVariableDefinitions.entryDisplaySettings = {
            // A reference to the whole list reads them from the list.
            shadowVariable: true,
            returnDependencies: () => ({
                entryStructure: {
                    dependencyType: "stateVariable",
                    variableName: "entryStructure",
                },
                children: {
                    dependencyType: "child",
                    childGroups: componentGroups,
                    variableNames: [
                        ...displayNames,
                        "referentInfo",
                        "entryOfReference",
                    ],
                    variablesOptional: true,
                },
                ...Object.fromEntries(
                    displayNames.map((name) => [
                        name,
                        { dependencyType: "stateVariable", variableName: name },
                    ]),
                ),
            }),
            definition({ dependencyValues, usedDefault }) {
                const listSettings = {};
                const listSetsDisplay = {};
                for (const name of displayNames) {
                    listSettings[name] = dependencyValues[name];
                    listSetsDisplay[name] = !usedDefault[name];
                }
                const settingsByChild = dependencyValues.children.map(
                    (child, componentInd) =>
                        childDisplaySettings({
                            child,
                            childUsedDefault:
                                usedDefault.children?.[componentInd],
                            displayNames,
                            listSettings,
                            listSetsDisplay,
                        }),
                );
                return {
                    setValue: {
                        entryDisplaySettings:
                            dependencyValues.entryStructure.map((source) =>
                                source.componentInd === undefined
                                    ? null
                                    : settingsByChild[source.componentInd],
                            ),
                    },
                };
            },
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

        // An entry can be written unless the list is fixed.
        stateVariableDefinitions.entriesCanBeModified = {
            returnDependencies: () => ({
                entriesFixed: {
                    dependencyType: "stateVariable",
                    variableName: "entriesFixed",
                },
            }),
            definition: ({ dependencyValues }) => ({
                setValue: {
                    entriesCanBeModified: !dependencyValues.entriesFixed,
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
            targetVariableName: arrayName,
        };

        return stateVariableDefinitions;
    }
}

/** Whether `value` is a math whose value is a list (`1, 2, 3`). */
function isMathList(value) {
    return (
        value instanceof me.class &&
        Array.isArray(value.tree) &&
        value.tree[0] === "list"
    );
}

/**
 * The value of the source of an entry (`entryStructure`), from the entry's
 * dependencies: the piece of text, the child, or the entry of the shadowed
 * array. For an item of a list, the whole list.
 */
function entrySourceValue({ source, dependencyValues, shadow, entryType }) {
    if (source?.pieceInd !== undefined) {
        const write = dependencyValues?.write;
        return write === null || write === undefined
            ? dependencyValues?.piece?.[source.pieceInd]
            : restoredValue(write, entryKind(entryType));
    }
    if (source?.componentInd !== undefined) {
        return dependencyValues?.child?.[0]?.stateValues.value;
    }
    if (source?.shadowInd !== undefined) {
        return shadow?.[source.shadowInd];
    }
    return undefined;
}

/** The value of an entry of `kind` that has none. */
function blankValue(kind) {
    if (kind === "math") {
        return me.fromAst("＿");
    }
    if (kind === "boolean") {
        return false;
    }
    return kind === "text" ? "" : NaN;
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
