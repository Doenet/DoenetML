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
import { codedDiagnostic } from "../../utils/diagnostics";

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
 * to, or, for a piece of text, the list itself (`textPieceWrites`, or
 * `compositeTextPieceWrites` for text a composite among the children
 * gives), which keeps it with that text and saves it.
 *
 * A list made by shadowing a variable that holds an array (a `<numberList>`
 * a reference to `matrixSize` makes) has no children, and its entries are
 * that array (`listValuesShadow`).
 */
export default class AuthoredValueList extends ValueListComponent {
    static componentType = "_authoredValueList";

    static listEntriesFixedByDefault = false;

    // Each display setting of each entry is an array of its own
    // (`entryDisplayDigits`, …).
    static get listEntryOwnArrays() {
        const kind = entryKind(this.listEntryComponentType);
        if (kind !== "math" && kind !== "number") {
            return {};
        }
        return Object.fromEntries(
            Object.keys(returnNumberDisplayAttributes()).map((name) => [
                name,
                entryOwnArrayName(name),
            ]),
        );
    }

    // A `copy=` of the list holds its values, as they are.
    static serializeUnlinkedAsValues = true;
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
     * spaces outside parentheses, as sugar separates it. `null` for text
     * that is not a list of entries (`<intervalList>` text that is not
     * intervals), which gives none and is reported.
     */
    static splitTextIntoPieces(text) {
        return splitBySpacesOutsideParens(text);
    }

    // Whether `splitTextIntoPieces` can find text that is not a list of
    // entries, which is then reported.
    static textCanBeInvalid = false;

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

        // Texts and booleans are not shown with number display settings.
        const kind = entryKind(this.listEntryComponentType);
        if (kind === "text" || kind === "boolean") {
            for (const name in returnNumberDisplayAttributes()) {
                delete attributes[name];
            }
        }

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

    async serialize(parameters = {}) {
        const serialized = await super.serialize(parameters);
        if (parameters.copyAll && !parameters.serializingDescendant) {
            serialized.state.entryDisplaySettingsShadow = [
                ...(await this.stateValues.entryDisplaySettings),
            ];
        }
        return serialized;
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

        if (displayNames.length === 0) {
            for (const name in returnNumberDisplayAttributes()) {
                stateVariableDefinitions[name] = {
                    ...stateVariableDefinitions[name],
                    public: false,
                };
                delete stateVariableDefinitions[name].shadowingInstructions;
            }
        }

        stateVariableDefinitions.listValuesShadow = {
            defaultValue: null,
            hasEssential: true,
            returnDependencies: () => ({}),
            definition: () => ({
                useEssentialOrDefaultValue: {
                    listValuesShadow: true,
                },
            }),
            // A `copy=` of the list holds its values here
            // (`serializeUnlinkedAsValues`), and a value written to one of
            // its entries is kept here.
            inverseDefinition: ({ desiredStateVariableValues }) => ({
                success: true,
                instructions: [
                    {
                        setEssentialValue: "listValuesShadow",
                        value: desiredStateVariableValues.listValuesShadow,
                    },
                ],
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
                    for (const piece of listClass.splitTextIntoPieces(text) ??
                        []) {
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

        // Where a value written to each piece of text is kept: for a piece
        // of the list's own text, its index among those pieces, in
        // `textPieceWrites`; for a piece of text a composite among the
        // children gives (`<repeat>`, `<conditionalContent>`), a key in
        // `compositeTextPieceWrites` made of the innermost such composite,
        // the string's place among that composite's text, and the piece's
        // place in the string. A write so stays with its own text as other
        // text appears and disappears, and is saved and read back on load.
        stateVariableDefinitions.textPieceWriteKeys = {
            returnDependencies: () => ({
                stringChildren: {
                    dependencyType: "child",
                    childGroups: ["strings"],
                    reportCompositeChanges: true,
                },
            }),
            definition({ dependencyValues }) {
                const stringChildren = dependencyValues.stringChildren;
                const ranges = stringChildren.compositeReplacementRange ?? [];
                const textPieceWriteKeys = [];
                let ownPieceInd = 0;
                const numStringsOfComposite = {};
                for (const [childInd, text] of stringChildren.entries()) {
                    const stateId = innermostCompositeStateId(ranges, childInd);
                    let stringKey = null;
                    if (stateId !== undefined) {
                        const stringInd = numStringsOfComposite[stateId] ?? 0;
                        numStringsOfComposite[stateId] = stringInd + 1;
                        stringKey = `${stateId}:${stringInd}`;
                    }
                    const pieces = listClass.splitTextIntoPieces(text) ?? [];
                    for (const pieceInString of pieces.keys()) {
                        textPieceWriteKeys.push(
                            stringKey === null
                                ? ownPieceInd++
                                : `${stringKey}:${pieceInString}`,
                        );
                    }
                }
                return { setValue: { textPieceWriteKeys } };
            },
        };

        // A value written to a piece of the list's own text, which stands
        // for the piece's value from then on.
        stateVariableDefinitions.textPieceWrites = {
            isArray: true,
            entryPrefixes: ["textPieceWrite"],
            hasEssential: true,
            defaultValueByArrayKey: () => null,
            returnArraySizeDependencies: () => ({
                textPieceWriteKeys: {
                    dependencyType: "stateVariable",
                    variableName: "textPieceWriteKeys",
                },
            }),
            returnArraySize({ dependencyValues }) {
                return [
                    dependencyValues.textPieceWriteKeys.filter(
                        (key) => typeof key === "number",
                    ).length,
                ];
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

        // A value written to a piece of text a composite among the children
        // gives, by the piece's key (`textPieceWriteKeys`).
        stateVariableDefinitions.compositeTextPieceWrites = {
            hasEssential: true,
            defaultValue: {},
            returnDependencies: () => ({}),
            definition: () => ({
                useEssentialOrDefaultValue: { compositeTextPieceWrites: true },
            }),
            inverseDefinition: ({ desiredStateVariableValues }) => ({
                success: true,
                instructions: [
                    {
                        setEssentialValue: "compositeTextPieceWrites",
                        value: desiredStateVariableValues.compositeTextPieceWrites,
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
                textPieceWriteKeys: {
                    dependencyType: "stateVariable",
                    variableName: "textPieceWriteKeys",
                },
                textPieceWrites: {
                    dependencyType: "stateVariable",
                    variableName: "textPieceWrites",
                },
                compositeTextPieceWrites: {
                    dependencyType: "stateVariable",
                    variableName: "compositeTextPieceWrites",
                },
            }),
            definition: ({ dependencyValues }) => ({
                setValue: {
                    textPieceEntryValues: dependencyValues.textPieceValues.map(
                        (value, pieceInd) => {
                            const writeKey =
                                dependencyValues.textPieceWriteKeys[pieceInd];
                            const write =
                                typeof writeKey === "number"
                                    ? dependencyValues.textPieceWrites[writeKey]
                                    : dependencyValues.compositeTextPieceWrites[
                                          writeKey
                                      ];
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
                        sources.push(
                            ...(listClass.splitTextIntoPieces(child) ?? []),
                        );
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
        // of text (`pieceInd`, with where a value written to it is kept,
        // `writeKey`), a child (`componentInd`, among the children
        // that are not text, once a list among them is its entries), an
        // item of a piece or child whose value is a list, when the math
        // lists merge (`component` of `nComponents`), or the array the list
        // shadows (`shadowInd`). Only merging reads the values, to count the
        // items. A reference with nothing to read (`referentInfo` of
        // `null`, as for `$r.x` of a `<repeat>`) or to an entry past the end
        // of a list (`pastEndOfList`, `ValueRef.js`) gives none.
        stateVariableDefinitions.entryStructure = {
            stateVariablesDeterminingDependencies: ["mergeMathLists"],
            returnDependencies({ stateValues }) {
                return {
                    children: {
                        dependencyType: "child",
                        childGroups,
                        variableNames: stateValues.mergeMathLists
                            ? ["value", "referentInfo", "pastEndOfList"]
                            : ["referentInfo", "pastEndOfList"],
                        variablesOptional: true,
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
                    textPieceWriteKeys: {
                        dependencyType: "stateVariable",
                        variableName: "textPieceWriteKeys",
                    },
                    shadow: {
                        dependencyType: "stateVariable",
                        variableName: "listValuesShadow",
                    },
                    maxNumber: {
                        dependencyType: "stateVariable",
                        variableName: "maxNumber",
                    },
                    ...(listClass.textCanBeInvalid
                        ? {
                              isAttributeChildFor: {
                                  dependencyType: "doenetAttribute",
                                  attributeName: "isAttributeChildFor",
                              },
                              parent: {
                                  dependencyType: "parentIdentity",
                              },
                          }
                        : {}),
                };
            },
            definition({ dependencyValues }) {
                let entryStructure = [];
                // Text that is not a list of entries gives none, and is
                // reported as a child the list cannot take.
                let invalidText = false;

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
                        const pieces = listClass.splitTextIntoPieces(child);
                        if (pieces === null) {
                            invalidText = true;
                        }
                        for (const _piece of pieces ?? []) {
                            addSources(
                                dependencyValues.textPieceEntryValues?.[
                                    pieceInd
                                ],
                                {
                                    pieceInd,
                                    writeKey:
                                        dependencyValues.textPieceWriteKeys[
                                            pieceInd
                                        ],
                                },
                            );
                            pieceInd++;
                        }
                    } else {
                        // A reference with nothing to read, or past the end
                        // of a list, gives no entry.
                        if (
                            child.stateValues?.referentInfo !== null &&
                            !child.stateValues?.pastEndOfList
                        ) {
                            addSources(child.stateValues?.value, {
                                componentInd,
                            });
                        }
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
                        Math.max(0, dependencyValues.maxNumber),
                    );
                }

                const sendDiagnostics = [];
                if (invalidText) {
                    sendDiagnostics.push(
                        dependencyValues.isAttributeChildFor
                            ? codedDiagnostic({
                                  type: "warning",
                                  code: "doenet-w0106",
                                  args: {
                                      attribute:
                                          dependencyValues.isAttributeChildFor,
                                      componentType:
                                          dependencyValues.parent
                                              ?.componentType,
                                  },
                              })
                            : codedDiagnostic({
                                  type: "warning",
                                  code: "doenet-w0107",
                                  args: {
                                      componentType: listClass.componentType,
                                      children: "string",
                                  },
                              }),
                    );
                }
                return { setValue: { entryStructure }, sendDiagnostics };
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
                // Whether the entries are fixed is read when one is written,
                // so reading them does not depend on it.
                const globalDependencies = {
                    entryStructure: {
                        dependencyType: "stateVariable",
                        variableName: "entryStructure",
                    },
                };
                if (
                    stateValues.entryStructure.some(
                        (source) => source.shadowInd !== undefined,
                    )
                ) {
                    globalDependencies.shadow = {
                        dependencyType: "stateVariable",
                        variableName: "listValuesShadow",
                    };
                }
                if (
                    stateValues.entryStructure.some(
                        (source) => typeof source.writeKey === "string",
                    )
                ) {
                    globalDependencies.compositeTextPieceWrites = {
                        dependencyType: "stateVariable",
                        variableName: "compositeTextPieceWrites",
                    };
                }
                const dependenciesByKey = {};
                for (const arrayKey of arrayKeys) {
                    const source = stateValues.entryStructure[arrayKey];
                    if (source?.pieceInd !== undefined) {
                        dependenciesByKey[arrayKey] = {
                            piece: {
                                dependencyType: "stateVariable",
                                variableName: "textPieceValues",
                            },
                        };
                        if (typeof source.writeKey === "number") {
                            dependenciesByKey[arrayKey].write = {
                                dependencyType: "stateVariable",
                                variableName: `textPieceWrite${source.writeKey + 1}`,
                            };
                        }
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
                        compositeTextPieceWrites:
                            globalDependencyValues.compositeTextPieceWrites,
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
                if (await stateValues.entriesFixed) {
                    return { success: false };
                }
                const entryStructure = globalDependencyValues.entryStructure;
                const desired = desiredStateVariableValues[arrayName];

                const instructions = [];
                let wroteShadow = false;
                let wroteCompositeText = false;
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
                                compositeTextPieceWrites:
                                    globalDependencyValues.compositeTextPieceWrites,
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

                    if (typeof source.writeKey === "string") {
                        if (!workspace.compositeTextPieceWrites) {
                            workspace.compositeTextPieceWrites = {
                                ...globalDependencyValues.compositeTextPieceWrites,
                            };
                        }
                        workspace.compositeTextPieceWrites[source.writeKey] =
                            value;
                        wroteCompositeText = true;
                    } else if (source.pieceInd !== undefined) {
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
                if (wroteCompositeText) {
                    instructions.push({
                        setDependency: "compositeTextPieceWrites",
                        desiredValue: workspace.compositeTextPieceWrites,
                    });
                }

                return { success: true, instructions };
            },
        };

        // The display settings of the entries of the list a `copy=` holds
        // the values of (`serializeUnlinkedAsValues`), as they were there.
        stateVariableDefinitions.entryDisplaySettingsShadow = {
            defaultValue: null,
            hasEssential: true,
            returnDependencies: () => ({}),
            definition: () => ({
                useEssentialOrDefaultValue: {
                    entryDisplaySettingsShadow: true,
                },
            }),
        };

        // The display settings each entry is shown with, `null` for the
        // list's.
        // Each display setting of each entry, as an array, which an entry
        // read by itself (`$l[2]`, `<math copy="$l[2]"/>`) takes as its own,
        // so that it is shown as it is in the list.
        const valuesShadowing = {};
        for (const name of displayNames) {
            const entryArrayName = entryOwnArrayName(name);
            stateVariableDefinitions[entryArrayName] = {
                isArray: true,
                entryPrefixes: [entryArrayName],
                companionOfEachEntry: true,
                shadowVariable: true,
                shadowingInstructions: {
                    createComponentOfType:
                        stateVariableDefinitions[name].shadowingInstructions
                            .createComponentOfType,
                },
                // never written: an entry that takes the default is marked
                // so (`useEssentialOrDefaultValue`)
                hasEssential: true,
                returnArraySizeDependencies: () => ({
                    numEntries: {
                        dependencyType: "stateVariable",
                        variableName: "numEntries",
                    },
                }),
                returnArraySize({ dependencyValues }) {
                    return [dependencyValues.numEntries];
                },
                returnArrayDependenciesByKey: () => ({
                    globalDependencies: {
                        entryDisplaySettings: {
                            dependencyType: "stateVariable",
                            variableName: "entryDisplaySettings",
                        },
                        listSetting: {
                            dependencyType: "stateVariable",
                            variableName: name,
                        },
                    },
                }),
                // A setting neither the entry nor the list sets is a default,
                // so a copy of the entry (`<math copy="$l[1]"/>`) leaves it
                // to where the copy is.
                arrayDefinitionByKey({
                    globalDependencyValues,
                    globalUsedDefault,
                    arrayKeys,
                }) {
                    const values = {};
                    const defaults = {};
                    for (const arrayKey of arrayKeys) {
                        const settings =
                            globalDependencyValues.entryDisplaySettings[
                                arrayKey
                            ];
                        const value =
                            settings?.[name] ??
                            globalDependencyValues.listSetting;
                        if (
                            !settings?.setByEntry?.includes(name) &&
                            globalUsedDefault.listSetting
                        ) {
                            defaults[arrayKey] = { defaultValue: value };
                        } else {
                            values[arrayKey] = value;
                        }
                    }
                    return {
                        setValue: { [entryArrayName]: values },
                        useEssentialOrDefaultValue: {
                            [entryArrayName]: defaults,
                        },
                    };
                },
            };
            valuesShadowing[name] = {
                ...stateVariableDefinitions[arrayName].shadowingInstructions
                    .addAttributeComponentsShadowingStateVariables[name],
                stateVariableToShadow: entryArrayName,
            };
        }
        if (displayNames.length > 0) {
            const shadowingInstructions =
                stateVariableDefinitions[arrayName].shadowingInstructions;
            stateVariableDefinitions[arrayName].shadowingInstructions = {
                ...shadowingInstructions,
                addAttributeComponentsShadowingStateVariables: {
                    ...shadowingInstructions.addAttributeComponentsShadowingStateVariables,
                    ...valuesShadowing,
                },
            };
        }

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
                        "displaySettings",
                        "referentInfo",
                        "entryOfReference",
                    ],
                    variablesOptional: true,
                },
                shadow: {
                    dependencyType: "stateVariable",
                    variableName: "entryDisplaySettingsShadow",
                },
                copyListViaComposite: {
                    dependencyType: "stateVariable",
                    variableName: "copyListViaComposite",
                },
                extendListViaComposite: {
                    dependencyType: "stateVariable",
                    variableName: "extendListViaComposite",
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
                if (dependencyValues.shadow !== null) {
                    // The entries' settings as they were in the list a
                    // `copy=` holds the values of. Settings the copy's
                    // author gives are on the list holding this one, which
                    // shows these entries as a reference's
                    // (`entriesOfReference`).
                    return {
                        setValue: {
                            entryDisplaySettings:
                                dependencyValues.entryStructure.map(
                                    (source) =>
                                        dependencyValues.shadow[
                                            source.shadowInd
                                        ] ?? null,
                                ),
                        },
                    };
                }
                // The children a `copy=` or `extend=` of the list makes
                // (`<mathList copy="$P.xs" displayDigits="3" />`) are what
                // the list references, so its own settings win over theirs.
                const referenceComposites = [
                    dependencyValues.copyListViaComposite,
                    dependencyValues.extendListViaComposite,
                ].filter((idx) => idx != null);
                const ranges = (
                    dependencyValues.children.compositeReplacementRange ?? []
                ).filter((range) =>
                    referenceComposites.includes(range.compositeIdx),
                );
                const settingsByChild = dependencyValues.children.map(
                    (child, componentInd) =>
                        childDisplaySettings({
                            child,
                            fromReference: ranges.some(
                                (range) =>
                                    range.firstInd <= componentInd &&
                                    range.lastInd >= componentInd,
                            ),
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

/** The array holding display setting `name` of each entry. */
function entryOwnArrayName(name) {
    return `entry${name[0].toUpperCase()}${name.slice(1)}`;
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
function entrySourceValue({
    source,
    dependencyValues,
    shadow,
    compositeTextPieceWrites,
    entryType,
}) {
    if (source?.pieceInd !== undefined) {
        const write =
            typeof source.writeKey === "string"
                ? compositeTextPieceWrites?.[source.writeKey]
                : dependencyValues?.write;
        return write === null || write === undefined
            ? dependencyValues?.piece?.[source.pieceInd]
            : restoredValue(write, entryKind(entryType));
    }
    if (source?.componentInd !== undefined) {
        return dependencyValues?.child?.[0]?.stateValues.value;
    }
    if (source?.shadowInd !== undefined) {
        const value = shadow?.[source.shadowInd];
        return value === undefined
            ? undefined
            : restoredValue(value, entryKind(entryType));
    }
    return undefined;
}

/**
 * The `stateId` of the innermost composite among a list's children whose
 * replacements include string child `childInd`, given the ranges of the
 * child dependency (`compositeReplacementRange`); `undefined` for the
 * list's own text. Of nested composites, the inner one comes later.
 */
function innermostCompositeStateId(ranges, childInd) {
    let innermost;
    for (const range of ranges) {
        if (
            range.firstInd <= childInd &&
            range.lastInd >= childInd &&
            (innermost === undefined ||
                range.lastInd - range.firstInd <=
                    innermost.lastInd - innermost.firstInd)
        ) {
            innermost = range;
        }
    }
    return innermost?.compositeStateId;
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
    fromReference = false,
    childUsedDefault,
    displayNames,
    listSettings,
    listSetsDisplay,
}) {
    if (displayNames.length === 0) {
        return null;
    }
    const isReference =
        fromReference ||
        child.stateValues.referentInfo !== undefined ||
        Boolean(child.stateValues.entryOfReference);
    const settings = {};
    // the settings the entry has of its own, rather than the list's
    const setByEntry = [];
    let differs = false;

    // `displayDigits` and `displayDecimals` go together: whichever sets one
    // of them sets both.
    const groups = [["displayDigits", "displayDecimals"]];
    for (const name of displayNames) {
        if (name !== "displayDigits" && name !== "displayDecimals") {
            groups.push([name]);
        }
    }

    // An entry of a list among the children that is shown with settings of
    // its own (`displaySettings`) has set those it lists in `setByEntry`.
    const ownSettings = child.stateValues.displaySettings ?? undefined;

    for (const names of groups) {
        const childValues = names.map((name) =>
            ownSettings ? ownSettings[name] : child.stateValues[name],
        );
        const childSets =
            childValues.every((value) => value !== undefined) &&
            (ownSettings !== undefined
                ? names.some((name) => ownSettings.setByEntry?.includes(name))
                : names.some((name) => !childUsedDefault?.[name]));
        const listSets = names.some((name) => listSetsDisplay[name]);
        const useChild = childSets && !(isReference && listSets);
        for (const [i, name] of names.entries()) {
            settings[name] = useChild ? childValues[i] : listSettings[name];
            if (settings[name] !== listSettings[name]) {
                differs = true;
            }
            if (useChild) {
                setByEntry.push(name);
            }
        }
    }

    return differs || setByEntry.length > 0
        ? { ...settings, setByEntry }
        : null;
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
 * A value written to a piece of text, or to an entry of the values a copy
 * holds, as the entry holds it. A saved state keeps a math as its tree.
 */
function restoredValue(value, kind) {
    if (kind === "math" && !(value instanceof me.class)) {
        return convertValueToMathExpression(value);
    }
    return value;
}
