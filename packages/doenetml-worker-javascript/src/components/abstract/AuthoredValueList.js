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
import { copiedReferentVariableName } from "../../utils/valueReference";

// A reference to the whole list reads these of the list itself, as they were
// the list's own when it was a composite (`$l.unordered`).
const AUTHORED_LIST_OWN_PROPERTIES = [
    ...ValueListComponent.listOwnProperties,
    "unordered",
    "maxNumber",
    "mergeMathLists",
    "functionSymbols",
    "splitSymbols",
    "parseScientificNotation",
];

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
    constructor(args) {
        super(args);

        if (this.constructor.listEntriesAnchoredBySources) {
            Object.assign(this.actions, {
                moveMath: this.moveEntry.bind(this),
                moveNumber: this.moveEntry.bind(this),
                moveText: this.moveEntry.bind(this),
            });
        }
    }

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

    // The child groups whose children are entries, besides text.
    static listChildGroups = [];

    // Whether each entry is shown as its source shows itself: hidden by an
    // authored child's own `hide`, in the child's style and, for a math, its
    // `renderMode` (or a referenced component's, for a reference that stands
    // for a copy of it), as the copy of each child that `<sort>` and
    // `<shuffle>` made was (`entryPresentation`). Otherwise every entry is
    // shown in the list's style.
    static listEntriesShownAsSources = false;

    // A list shown as its sources has the style and `hide` of each source,
    // which a reference to every entry's (`$c.styleNumber`) reads entry by
    // entry, as it read them of each copy the composite made.
    static get listOwnProperties() {
        return this.listEntriesShownAsSources
            ? AUTHORED_LIST_OWN_PROPERTIES.filter(
                  (name) => name !== "styleNumber" && name !== "hide",
              )
            : AUTHORED_LIST_OWN_PROPERTIES;
    }

    // Whether each entry is placed in a graph, and dragged there, as the
    // component it comes from is (`entryGraphSources`): the entries of maths,
    // numbers, texts and intervals, which are drawn at an anchor.
    static get listEntriesAnchoredBySources() {
        return (
            this.listEntryChildRendererVariables === undefined &&
            entryKind(this.listEntryComponentType) !== "boolean"
        );
    }

    static buildListEntryStateVariables() {
        const variables = super.buildListEntryStateVariables();
        if (this.listEntriesAnchoredBySources) {
            Object.assign(variables, ENTRY_GRAPH_ARRAYS);
            // the component an entry is placed as, which a list holding
            // this one places that entry as in turn
            variables.listEntryGraphSource = "entryGraphSources";
        }
        if (this.listEntriesShownAsSources) {
            Object.assign(variables, this.listEntryPresentationVariables);
            // the component an entry stands for, which a list reading the
            // entry stands it for in turn
            variables.listEntrySourceComponent = "entrySourceComponents";
        }
        return variables;
    }

    // Built once for each class, as the viewer reads it for each entry.
    static get listPerEntryVariables() {
        if (!Object.hasOwn(this, "builtListPerEntryVariables")) {
            const variables = [...super.listPerEntryVariables];
            if (this.listEntriesAnchoredBySources) {
                variables.push(
                    ...Object.values(ENTRY_GRAPH_ARRAYS),
                    "entryGraphSources",
                );
            }
            if (this.listEntriesShownAsSources) {
                variables.push(
                    ...Object.values(this.listEntryPresentationVariables),
                    "entrySourceComponents",
                );
            }
            this.builtListPerEntryVariables = Object.freeze(variables);
        }
        return this.builtListPerEntryVariables;
    }

    // The variable holding, for each entry, the component it stands for, or
    // `null`, whose properties are the entry's where the list holds none of
    // its own for that entry (`listEntryPropertyArrays.ts`).
    static get listEntrySourcesVariable() {
        return this.listEntriesShownAsSources
            ? "entrySourceComponents"
            : undefined;
    }

    // The attributes a component made from one entry (`<number
    // extend="$c[2]"/>`) takes from the arrays of a list shown as its
    // sources, as the copy of the entry's source took them
    // (`addAttributeComponentsShadowingStateVariables`). A drawn `$c[2]`
    // takes all but `renderMode`, which a drawn reference sends as a
    // constant.
    static get listEntryCopiedAttributes() {
        if (!this.listEntriesShownAsSources) {
            return {};
        }
        return Object.fromEntries(
            Object.entries(this.listEntryPresentationVariables)
                .filter(([name]) => name in ENTRY_ATTRIBUTE_TYPES)
                .map(([name, arrayName]) => [
                    name,
                    { stateVariableToShadow: arrayName },
                ]),
        );
    }

    // The entry variables shown as the source shows them, with the array of
    // the list that holds them.
    static get listEntryPresentationVariables() {
        if (!Object.hasOwn(this, "builtListEntryPresentationVariables")) {
            const { renderMode, ...arrays } = ENTRY_PRESENTATION_ARRAYS;
            // a `renderMode` for the entries that are drawn as maths
            this.builtListEntryPresentationVariables =
                "renderMode" in this.listEntryRendererDefaults
                    ? ENTRY_PRESENTATION_ARRAYS
                    : Object.freeze(arrays);
        }
        return this.builtListEntryPresentationVariables;
    }

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
        if (!this.constructor.serializeUnlinkedAsValues) {
            // A copy reads its values from the children and attributes it
            // is made with, also as part of an unlinked copy of a
            // `<repeat>` (`copyPrimaryEssential`).
            delete serialized.state.listValuesShadow;
            // A linked copy of the list (in an `extend` of its parent) has
            // no children of its own (`serializeChildrenOnlyIfUnlinked`).
            // An unlinked copy of it is made from the children of the list
            // it copies.
            const source =
                parameters.copyAll &&
                this.shadows &&
                parameters.components?.[this.shadows.componentIdx];
            if (source) {
                const serializedSource = await source.serialize(parameters);
                serialized.children = serializedSource.children;
                serialized.state = {
                    ...serializedSource.state,
                    ...serialized.state,
                };
            }
        } else if (parameters.copyAll && !parameters.serializingDescendant) {
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

        if (listClass.listEntriesShownAsSources) {
            Object.assign(
                stateVariableDefinitions,
                returnEntryPresentationDefinitions(listClass),
            );
            // An entry read by itself (`<number extend="$c[1]"/>`, `$c[1]`
            // in a `<sort>` that stays a composite) takes the entry's `hide`,
            // style and `renderMode`, as the copy of the entry's source did;
            // `$c[1]` drawn, or in a `<group>`, takes all but `renderMode`.
            const shadowingInstructions =
                stateVariableDefinitions[arrayName].shadowingInstructions;
            stateVariableDefinitions[arrayName].shadowingInstructions = {
                ...shadowingInstructions,
                addAttributeComponentsShadowingStateVariables: {
                    ...shadowingInstructions.addAttributeComponentsShadowingStateVariables,
                    ...listClass.listEntryCopiedAttributes,
                },
            };
        }

        if (listClass.listEntriesAnchoredBySources) {
            Object.assign(
                stateVariableDefinitions,
                returnEntryGraphDefinitions(listClass),
            );
        }

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

    /**
     * A drag of entry `listEntryIndex` to `(x, y, z)`, which moves the anchor
     * of the component the entry is placed as (`entryGraphSources`), unless
     * the entry is fixed, its location is fixed or it cannot be dragged.
     */
    async moveEntry({ x, y, z, listEntryIndex, ...args }) {
        if (!(await this.entryCanBeMoved(listEntryIndex))) {
            return;
        }
        const components = ["vector"];
        if (x !== undefined) {
            components[1] = x;
        }
        if (y !== undefined) {
            components[2] = y;
        }
        if (z !== undefined) {
            components[3] = z;
        }
        return await this.writeEntryFromAction({
            ...args,
            listEntryIndex,
            values: { entryAnchor: me.fromAst(components) },
            result: { x, y, z },
        });
    }

    /** Whether entry `listEntryIndex` takes a drag (`moveEntry`). */
    async entryCanBeMoved(listEntryIndex) {
        if (!Number.isInteger(listEntryIndex)) {
            return false;
        }
        const source = (await this.stateValues.entryGraphSources)[
            listEntryIndex
        ];
        return (
            typeof source === "number" &&
            (await this.stateValues.entryFixed)[listEntryIndex] === false &&
            (await this.stateValues.entryFixLocation)[listEntryIndex] ===
                false &&
            (await this.stateValues.entryDraggable)[listEntryIndex] === true
        );
    }

    /**
     * Write `values` (by state variable) to entry `listEntryIndex`, as a drag
     * of its renderer, recording the interaction as `result`.
     */
    async writeEntryFromAction({
        listEntryIndex,
        values,
        result,
        transient,
        skippable,
        actionId,
        sourceDetails,
        sourceInformation = {},
        skipRendererUpdate = false,
    }) {
        const updateInstructions = Object.entries(values).map(
            ([stateVariable, value]) => ({
                updateType: "updateValue",
                componentIdx: this.componentIdx,
                stateVariable,
                value: { [listEntryIndex]: value },
                sourceDetails,
            }),
        );
        if (transient) {
            return await this.coreFunctions.performUpdate({
                updateInstructions,
                transient,
                skippable,
                actionId,
                sourceInformation,
                skipRendererUpdate,
            });
        }
        return await this.coreFunctions.performUpdate({
            updateInstructions,
            actionId,
            sourceInformation,
            skipRendererUpdate,
            event: {
                verb: "interacted",
                object: {
                    componentIdx: this.componentIdx,
                    componentType: this.componentType,
                },
                context: { listEntryIndex },
                result,
            },
        });
    }
}

/**
 * The arrays of a list whose entries are placed as their sources
 * (`listEntriesAnchoredBySources`) holding, for each entry, the entry
 * variable they are named by.
 */
const ENTRY_GRAPH_ARRAYS = Object.freeze({
    anchor: "entryAnchor",
    positionFromAnchor: "entryPositionFromAnchor",
    draggable: "entryDraggable",
    layer: "entryLayer",
    fixed: "entryFixed",
    fixLocation: "entryFixLocation",
});

/**
 * The variables of the component an entry is placed as that place it, each
 * with the value an entry placed as no component has, and whether the list's
 * own value of the variable also applies to every entry (`fixed`,
 * `fixLocation`).
 */
const ENTRY_GRAPH_SOURCE_VARIABLES = Object.freeze({
    positionFromAnchor: { none: "center" },
    draggable: { none: false },
    layer: { none: 0 },
    fixed: { none: false, orList: "entriesFixed" },
    fixLocation: { none: false, orList: "fixLocation" },
});

/**
 * The component whose anchor places the entry of `source`, a child of a
 * list or a component a list reads an entry from: for an entry of a list,
 * the component that list places the entry as (or `null`); for a value
 * reference, its referent when it references the referent's own value (`$m`,
 * `$m.value`), and none when it references another value (`$m.x`, `$l[2]`);
 * otherwise the component itself. `stateValues` holds `listEntryGraphSource` and
 * `referentInfo`, when the source has them.
 */
export function graphSourceOf(source) {
    if (!source) {
        return null;
    }
    if (source.listEntryIndex !== undefined) {
        return source.stateValues?.listEntryGraphSource ?? null;
    }
    const referentInfo = source.stateValues?.referentInfo;
    if (referentInfo !== undefined) {
        return referentInfo?.referencedPrimaryValue &&
            referentInfo.listEntryPosition === undefined
            ? referentInfo.componentIdx
            : null;
    }
    return source.componentIdx;
}

/**
 * The definitions of a list whose entries are placed as their sources
 * (`listEntriesAnchoredBySources`): the component each entry is placed as
 * (`entryGraphSources`), and from it an array of a value per entry for each
 * variable that places an entry in a graph (`ENTRY_GRAPH_ARRAYS`). An entry
 * placed as no component (one from text) is at the origin and cannot be
 * dragged. A value written to an entry's anchor (a drag, `moveEntry`) goes
 * to that component's anchor.
 */
function returnEntryGraphDefinitions(listClass) {
    const componentGroups = listClass.listChildGroups.map((x) => x.group);
    const definitions = {};

    // The component each entry comes from among the children, which, for a
    // child an adapter made (a `<number>` in a `<mathList>`), is that adapter.
    definitions.entryChildGraphSources = {
        returnDependencies: () => ({
            entryStructure: {
                dependencyType: "stateVariable",
                variableName: "entryStructure",
            },
            children: {
                dependencyType: "child",
                childGroups: componentGroups,
                variableNames: ["listEntryGraphSource", "referentInfo"],
                variablesOptional: true,
            },
        }),
        definition: ({ dependencyValues }) => ({
            setValue: {
                entryChildGraphSources: dependencyValues.entryStructure.map(
                    (source) =>
                        source.componentInd === undefined
                            ? null
                            : graphSourceOf(
                                  dependencyValues.children[
                                      source.componentInd
                                  ],
                              ),
                ),
            },
            checkForActualChange: { entryChildGraphSources: true },
        }),
    };

    // Each entry is placed as the component it comes from, the one the
    // author wrote, which an adapter was made from.
    definitions.entryGraphSources = {
        // A reference to the whole list reads the list's.
        shadowVariable: true,
        stateVariablesDeterminingDependencies: ["entryChildGraphSources"],
        returnDependencies({ stateValues }) {
            const dependencies = {
                entryChildGraphSources: {
                    dependencyType: "stateVariable",
                    variableName: "entryChildGraphSources",
                },
            };
            for (const sourceIdx of new Set(
                stateValues.entryChildGraphSources,
            )) {
                if (typeof sourceIdx === "number") {
                    dependencies[`adaptedFrom${sourceIdx}`] = {
                        dependencyType: "adapterSource",
                        componentIdx: sourceIdx,
                    };
                }
            }
            return dependencies;
        },
        definition: ({ dependencyValues }) => ({
            setValue: {
                entryGraphSources: dependencyValues.entryChildGraphSources.map(
                    (sourceIdx) =>
                        typeof sourceIdx === "number"
                            ? (dependencyValues[`adaptedFrom${sourceIdx}`]
                                  ?.componentIdx ?? sourceIdx)
                            : null,
                ),
            },
            checkForActualChange: { entryGraphSources: true },
        }),
    };

    // The variables of each entry's component that place it, by entry.
    definitions.entryGraphValues = {
        stateVariablesDeterminingDependencies: ["entryGraphSources"],
        returnDependencies({ stateValues }) {
            const dependencies = {
                entryGraphSources: {
                    dependencyType: "stateVariable",
                    variableName: "entryGraphSources",
                },
            };
            for (const sourceIdx of new Set(stateValues.entryGraphSources)) {
                if (typeof sourceIdx === "number") {
                    dependencies[`source${sourceIdx}`] = {
                        dependencyType: "multipleStateVariables",
                        componentIdx: sourceIdx,
                        variableNames: Object.keys(
                            ENTRY_GRAPH_SOURCE_VARIABLES,
                        ),
                        variablesOptional: true,
                    };
                }
            }
            return dependencies;
        },
        definition: ({ dependencyValues }) => ({
            setValue: {
                entryGraphValues: dependencyValues.entryGraphSources.map(
                    (sourceIdx) =>
                        typeof sourceIdx === "number"
                            ? (dependencyValues[`source${sourceIdx}`]
                                  ?.stateValues ?? {})
                            : null,
                ),
            },
        }),
    };

    for (const [name, { none, orList }] of Object.entries(
        ENTRY_GRAPH_SOURCE_VARIABLES,
    )) {
        const arrayName = ENTRY_GRAPH_ARRAYS[name];
        definitions[arrayName] = {
            forRenderer: true,
            returnDependencies: () => ({
                entryGraphValues: {
                    dependencyType: "stateVariable",
                    variableName: "entryGraphValues",
                },
                ...(orList
                    ? {
                          listValue: {
                              dependencyType: "stateVariable",
                              variableName: orList,
                          },
                      }
                    : {}),
            }),
            definition: ({ dependencyValues }) => ({
                setValue: {
                    [arrayName]: dependencyValues.entryGraphValues.map(
                        (values) => {
                            const value = values?.[name] ?? none;
                            return orList
                                ? Boolean(dependencyValues.listValue || value)
                                : value;
                        },
                    ),
                },
            }),
        };
    }

    // The anchor of each entry's component, read and written there.
    definitions.entryAnchor = {
        forRenderer: true,
        isLocation: true,
        stateVariablesDeterminingDependencies: ["entryGraphSources"],
        returnDependencies({ stateValues }) {
            const dependencies = {
                entryGraphSources: {
                    dependencyType: "stateVariable",
                    variableName: "entryGraphSources",
                },
            };
            for (const sourceIdx of new Set(stateValues.entryGraphSources)) {
                if (typeof sourceIdx === "number") {
                    dependencies[`anchor${sourceIdx}`] = {
                        dependencyType: "stateVariable",
                        componentIdx: sourceIdx,
                        variableName: "anchor",
                        variablesOptional: true,
                    };
                }
            }
            return dependencies;
        },
        definition: ({ dependencyValues }) => ({
            setValue: {
                entryAnchor: dependencyValues.entryGraphSources.map(
                    (sourceIdx) =>
                        (typeof sourceIdx === "number"
                            ? dependencyValues[`anchor${sourceIdx}`]
                            : undefined) ?? me.fromAst(["vector", 0, 0]),
                ),
            },
        }),
        inverseDefinition({ desiredStateVariableValues, dependencyValues }) {
            const instructions = [];
            for (const [key, anchor] of Object.entries(
                desiredStateVariableValues.entryAnchor,
            )) {
                const sourceIdx = dependencyValues.entryGraphSources[key];
                if (
                    typeof sourceIdx === "number" &&
                    dependencyValues[`anchor${sourceIdx}`] !== undefined
                ) {
                    instructions.push({
                        setDependency: `anchor${sourceIdx}`,
                        desiredValue: anchor,
                    });
                }
            }
            return instructions.length > 0
                ? { success: true, instructions }
                : { success: false };
        },
    };

    return definitions;
}

/** The array holding display setting `name` of each entry. */
export function entryOwnArrayName(name) {
    return `entry${name[0].toUpperCase()}${name.slice(1)}`;
}

/** Whether `value` is a math whose value is a list (`1, 2, 3`). */
export function isMathList(value) {
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
export function entrySourceValue({
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
export function blankValue(kind) {
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
export function childDisplaySettings({
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
export function valueForChild(value, child) {
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
export function restoredValue(value, kind) {
    if (kind === "math" && !(value instanceof me.class)) {
        return convertValueToMathExpression(value);
    }
    return value;
}

/**
 * The arrays of a list shown as its sources (`listEntriesShownAsSources`)
 * holding, for each entry, the entry variable they are named by. An entry's
 * `hide` is the list's, if the list sets one, else its source's; a list that
 * reads the entry (`<sort>$c</sort>`) hides it by that. Its `hidden` is also
 * true when the list is hidden.
 */
export const ENTRY_PRESENTATION_ARRAYS = Object.freeze({
    hide: "entryHides",
    hidden: "entryHiddens",
    selectedStyle: "entrySelectedStyles",
    styleNumber: "entryStyleNumbers",
    renderMode: "entryRenderModes",
});

/**
 * The variables of a child, read by `entryPresentation`, that say how its
 * entry is shown: its own, and those of the referent of a reference that
 * stands for a copy of it (`copiedReferentVariableName`).
 */
export const ENTRY_PRESENTATION_SOURCE_VARIABLES = [
    "hide",
    "selectedStyle",
    "styleNumber",
    "renderMode",
    copiedReferentVariableName("hide"),
    copiedReferentVariableName("selectedStyle"),
    copiedReferentVariableName("styleNumber"),
    copiedReferentVariableName("renderMode"),
];

/**
 * How the entry of `source`, a child or a component a list reads an entry
 * from, is shown, from its variables (`ENTRY_PRESENTATION_SOURCE_VARIABLES`):
 * `hide`, `selectedStyle`, `styleNumber` and `renderMode`, each `undefined`
 * when the source
 * does not say, so that the list's own is used. A reference that stands for a
 * copy of its referent gives the referent's.
 */
export function sourcePresentation(stateValues = {}) {
    const read = (name) =>
        stateValues[copiedReferentVariableName(name)] ?? stateValues[name];
    return {
        hide: read("hide") ?? undefined,
        selectedStyle: read("selectedStyle") ?? undefined,
        styleNumber: read("styleNumber") ?? undefined,
        renderMode: read("renderMode") ?? undefined,
    };
}

/**
 * The definitions of a list shown as its sources (`listEntriesShownAsSources`):
 * how each entry's source shows itself (`entryPresentation`; a piece of text
 * as the list), and from that, an array of a value per entry for each
 * presentation variable (`ENTRY_PRESENTATION_ARRAYS`), which the viewer
 * reads for each entry. An entry is hidden with the list or by its source's
 * own `hide`.
 */
function returnEntryPresentationDefinitions(listClass) {
    const componentGroups = listClass.listChildGroups.map((x) => x.group);
    const definitions = {};

    definitions.entryPresentation = {
        // A reference to the whole list reads the list's.
        shadowVariable: true,
        returnDependencies: () => ({
            entryStructure: {
                dependencyType: "stateVariable",
                variableName: "entryStructure",
            },
            children: {
                dependencyType: "child",
                childGroups: componentGroups,
                variableNames: ENTRY_PRESENTATION_SOURCE_VARIABLES,
                variablesOptional: true,
            },
        }),
        definition: ({ dependencyValues }) => ({
            setValue: {
                entryPresentation: dependencyValues.entryStructure.map(
                    (source) =>
                        source.componentInd === undefined
                            ? {}
                            : sourcePresentation(
                                  dependencyValues.children[source.componentInd]
                                      ?.stateValues,
                              ),
                ),
            },
        }),
    };

    // An authored child, or a reference among the children, stands for
    // itself; the entries of a list among them and the pieces of text
    // stand for no component.
    // The component each entry stands for: an authored child itself, the
    // referent of a reference to a whole component (`$m`), and for an entry
    // of a list among the children, the component that list's entry stands
    // for, if any. A piece of text stands for none.
    definitions.entrySourceComponents = {
        shadowVariable: true,
        returnDependencies: () => ({
            entryStructure: {
                dependencyType: "stateVariable",
                variableName: "entryStructure",
            },
            children: {
                dependencyType: "child",
                childGroups: componentGroups,
                variableNames: ["listEntrySourceComponent", "referentInfo"],
                variablesOptional: true,
            },
        }),
        definition: ({ dependencyValues }) => ({
            setValue: {
                entrySourceComponents: dependencyValues.entryStructure.map(
                    (source) =>
                        source.componentInd === undefined
                            ? null
                            : sourceComponentOf(
                                  dependencyValues.children[
                                      source.componentInd
                                  ],
                              ),
                ),
            },
            checkForActualChange: { entrySourceComponents: true },
        }),
    };

    Object.assign(definitions, returnEntryPresentationArrays(listClass));

    return definitions;
}

/**
 * The attribute of the list that, when the list sets it, decides an entry
 * presentation variable for every entry over what each source says, as a
 * `<collect>`'s own `hide` and `styleNumber` were given to every copy it
 * made.
 */
const LIST_SETTING_OF_PRESENTATION = {
    hide: "hide",
    hidden: "hide",
    selectedStyle: "styleNumber",
    styleNumber: "styleNumber",
};

/**
 * The arrays of a value per entry of a list shown as its sources
 * (`ENTRY_PRESENTATION_ARRAYS`), computed from its `entryPresentation` and
 * the list's own variable of the same name, or the list's `hide` or
 * `styleNumber` where it sets one (`LIST_SETTING_OF_PRESENTATION`). Those an
 * entry read by itself takes as attributes (`ENTRY_ATTRIBUTE_TYPES`) are
 * arrays with an entry per entry (`entryAttributeArrayDefinition`). Changing
 * which entries are hidden changes the children the parent draws.
 */
export function returnEntryPresentationArrays(listClass) {
    const definitions = {};
    const arrays = listClass.listEntryPresentationVariables;
    for (const [entryVariable, arrayName] of Object.entries(arrays)) {
        if (entryVariable in ENTRY_ATTRIBUTE_TYPES) {
            definitions[arrayName] = entryAttributeArrayDefinition(
                entryVariable,
                arrayName,
            );
            continue;
        }
        const listSetting = LIST_SETTING_OF_PRESENTATION[entryVariable];
        definitions[arrayName] = {
            forRenderer: true,
            returnDependencies: () => ({
                entryPresentation: {
                    dependencyType: "stateVariable",
                    variableName: "entryPresentation",
                },
                listValue: {
                    dependencyType: "stateVariable",
                    variableName: entryVariable,
                },
                ...(listSetting
                    ? {
                          listSetting: {
                              dependencyType: "stateVariable",
                              variableName: listSetting,
                          },
                      }
                    : {}),
            }),
            ...(entryVariable === "hidden"
                ? { markStale: () => ({ updateParentRenderedChildren: true }) }
                : {}),
            definition({ dependencyValues, usedDefault }) {
                const listSets =
                    Boolean(listSetting) && !usedDefault.listSetting;
                const values = dependencyValues.entryPresentation.map(
                    (presentation) => {
                        if (entryVariable === "hidden") {
                            // The list's `hide` hides the entry even where
                            // the list is not hidden: a reference to the
                            // whole list (`$c`) shows what the list shows.
                            return Boolean(
                                dependencyValues.listValue ||
                                (listSets
                                    ? dependencyValues.listSetting
                                    : presentation.hide),
                            );
                        }
                        if (listSets) {
                            return dependencyValues.listValue;
                        }
                        return (
                            presentation[entryVariable] ??
                            dependencyValues.listValue
                        );
                    },
                );
                return { setValue: { [arrayName]: values } };
            },
        };
    }
    return definitions;
}

/**
 * The entry presentation variables that a component made from one entry
 * (`<number extend="$c[2]"/>`) takes as attributes of its own, as the copy
 * of the entry's source took them, with the type of each attribute. A drawn
 * `$c[2]` takes all but `renderMode`.
 */
export const ENTRY_ATTRIBUTE_TYPES = Object.freeze({
    hide: "boolean",
    styleNumber: "integer",
    renderMode: "text",
});

/**
 * The array `arrayName` of `entryVariable` (one of `ENTRY_ATTRIBUTE_TYPES`)
 * of each entry of a list shown as its sources: the list's, if it sets one,
 * else the source's, else the list's default. It has an entry per entry
 * (`entryStyleNumber2`), which the component made from one entry takes as
 * its own attribute (`companionOfEachEntry`); a value neither the list nor
 * the source sets is a default, which leaves that attribute to where the
 * component is.
 */
function entryAttributeArrayDefinition(entryVariable, arrayName) {
    const listSetting = LIST_SETTING_OF_PRESENTATION[entryVariable];
    return {
        isArray: true,
        entryPrefixes: [arrayName.slice(0, -1)],
        companionOfEachEntry: true,
        forRenderer: entryVariable !== "hide",
        hasEssential: true,
        shadowingInstructions: {
            createComponentOfType: ENTRY_ATTRIBUTE_TYPES[entryVariable],
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
        returnArrayDependenciesByKey: () => ({
            globalDependencies: {
                entryPresentation: {
                    dependencyType: "stateVariable",
                    variableName: "entryPresentation",
                },
                listValue: {
                    dependencyType: "stateVariable",
                    variableName: entryVariable,
                },
            },
        }),
        arrayDefinitionByKey({
            globalDependencyValues,
            globalUsedDefault,
            arrayKeys,
        }) {
            const listSets =
                Boolean(listSetting) && !globalUsedDefault.listValue;
            const values = {};
            const defaults = {};
            for (const arrayKey of arrayKeys) {
                const fromSource =
                    globalDependencyValues.entryPresentation[arrayKey]?.[
                        entryVariable
                    ];
                if (listSets) {
                    values[arrayKey] = globalDependencyValues.listValue;
                } else if (
                    fromSource === undefined ||
                    (entryVariable === "hide" && !fromSource)
                ) {
                    defaults[arrayKey] = {
                        defaultValue:
                            entryVariable === "hide"
                                ? false
                                : globalDependencyValues.listValue,
                    };
                } else {
                    values[arrayKey] = fromSource;
                }
            }
            return {
                setValue: { [arrayName]: values },
                useEssentialOrDefaultValue: { [arrayName]: defaults },
            };
        },
    };
}

/**
 * The component that `source` stands for as the source of an entry: an entry
 * of a list, the component that list's entry stands for (or `null`); the
 * referent of a value reference to a whole component (`$m`, not `$m.x` or
 * `$l[2]`); otherwise the component itself. `stateValues` holds
 * `listEntrySourceComponent` and `referentInfo`, when the source has them.
 */
export function sourceComponentOf(source) {
    if (!source) {
        return null;
    }
    if (source.listEntryIndex !== undefined) {
        return source.stateValues?.listEntrySourceComponent ?? null;
    }
    const referentInfo = source.stateValues?.referentInfo;
    if (
        referentInfo?.referencedPrimaryValue &&
        referentInfo.listEntryPosition === undefined
    ) {
        return referentInfo.componentIdx;
    }
    return source.componentIdx;
}
