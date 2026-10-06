import AuthoredValueList from "./AuthoredValueList";
import me from "math-expressions";
import {
    convertValueToMathExpression,
    returnTextStyleDescriptionDefinitions,
    vectorOperators,
} from "@doenet/utils";
import {
    evaluateToNumber,
    isUnspecifiedComponentValue,
} from "../../utils/math";
import { parseMathText } from "../MathList";

/**
 * Base class for the lists of graphical objects an author writes out:
 * `<pointList>` and `<vectorList>` (Doenet/DoenetML#2162). Each is a list
 * component (`AuthoredValueList`) holding the math of each entry's
 * coordinates (a point's `coords`, a vector's displacement), which a parent
 * reads, and the viewer draws, as one point or vector per entry, dragged
 * entry by entry.
 *
 * The entries share one number of dimensions, the largest among them
 * (`numDimensions`); an entry with fewer coordinates has 0 in the others.
 *
 * An entry from an authored child (`<point styleNumber="2">` with a
 * `<label>`, or the point a reference `$P` copies) is drawn with the child's
 * label and style, and whether it is hidden, fixed or draggable
 * (`entryChildren`, `listEntryChildRendererVariables`); the other entries are
 * drawn as a point or vector with no attributes is. A click or focus on an
 * entry from a child is the child's (`performOnEntryChild`).
 *
 * The array `points` or `vectors` holds the coordinates of each entry, by
 * entry and coordinate (`pointX2_1`), for the components that take a list
 * as an attribute (`vertices`, `through`); a write to it goes to the entry.
 */
export default class GraphicalValueList extends AuthoredValueList {
    static componentType = "_graphicalValueList";

    // The values a parent reads are the coordinates, held as one math per
    // entry, which a parent that takes maths reads as it reads a point.
    static additionalSchemaChildren = ["string", "math"];

    // The array, by entry and coordinate, that a component taking the list
    // as an attribute reads (`points`), the prefix of one coordinate of it
    // (`pointX`), and the state variable a shadowed array of that form
    // populates.
    static coordinatesArrayName = undefined;
    static coordinatesArrayPrefix = undefined;

    /**
     * The variables the renderer of an entry reads that, for an entry from
     * an authored child, are the child's. Each is an array of the list with
     * one value per entry (`entryVariableName`): the child's, or the list's
     * variable of that name.
     */
    static get listEntryChildRendererVariables() {
        return [
            "applyStyleToLabel",
            "maskLabel",
            "layer",
            "draggable",
            "labelPosition",
            "showCoordsWhenDragging",
            "controlOrder",
            "disabled",
            "fixLocation",
            "selectedStyle",
            "label",
            "labelHasLatex",
            "labelFromParent",
            "labelForGraph",
            "hideOffGraphIndicator",
        ];
    }

    // How an entry of a list of graphical objects is drawn when it is not
    // an authored child, as a point or vector with no attributes is.
    static get listEntryRendererDefaults() {
        return {
            applyStyleToLabel: () => false,
            maskLabel: () => false,
            layer: () => 0,
            draggable: () => true,
            labelPosition: () => "upperright",
            showCoordsWhenDragging: () => true,
            controlOrder: () => 0,
            label: () => "",
            labelHasLatex: () => false,
            labelFromParent: () => false,
            labelForGraph: () => "",
        };
    }

    /**
     * The definitions of the descriptions of a style that a point or vector
     * has (`styleDescription`, `textColor`), which an entry has of the style
     * it is drawn with (`entrySelectedStyle`), in an array of the list with
     * one per entry (`entryVariableName`).
     */
    static returnEntryStyleDescriptionDefinitions() {
        return returnTextStyleDescriptionDefinitions();
    }

    static buildListEntryStateVariables() {
        const variables = super.buildListEntryStateVariables();
        for (const name of [
            ...this.listEntryChildRendererVariables,
            ...Object.keys(this.returnEntryStyleDescriptionDefinitions()),
        ]) {
            variables[name] = entryVariableName(name);
        }
        // A list shown as its sources (a `<collect>` or `<sort>` made a
        // list) hides an entry as the copy of its source was hidden
        // (`AuthoredValueList`'s `entryHiddens`).
        variables.hidden = this.listEntriesShownAsSources
            ? "entryHiddens"
            : "entryHidden";
        variables.fixed = "entryFixed";
        return variables;
    }

    /**
     * The variables whose change queues an update of the list's renderer,
     * keyed by name (`Core.rendererVariablesOf`): its own renderer
     * variables, and the variables of the list its entries' renderers read
     * (`listEntryStateVariables`, as
     * `RendererInstructionBuilder.listEntryRendererState` reads them). So an
     * entry is drawn again when its tail, or the label or style of the child
     * it is from, changes without its value changing.
     */
    get rendererVariables() {
        const listClass = this.constructor;
        let variables = rendererVariablesOfListClass.get(listClass);
        if (variables === undefined) {
            const classes = this.componentInfoObjects.allComponentClasses;
            const rendererVariablesOf = (componentClass) =>
                componentClass.returnStateVariableInfo({
                    onlyForRenderer: true,
                }).stateVariableDescriptions;
            variables = { ...rendererVariablesOf(listClass) };
            for (const name of [
                ...Object.keys(
                    rendererVariablesOf(
                        classes[listClass.listEntryComponentType],
                    ),
                ),
                ...listClass.listEntryAdditionalRendererVariables,
            ]) {
                const listVariable = listClass.listEntryStateVariables[name];
                if (listVariable !== undefined) {
                    variables[listVariable] = true;
                }
            }
            rendererVariablesOfListClass.set(listClass, variables);
        }
        return variables;
    }

    static get listPerEntryVariables() {
        return [
            ...super.listPerEntryVariables,
            ...this.listEntryChildRendererVariables.map(entryVariableName),
            ...Object.keys(this.returnEntryStyleDescriptionDefinitions()).map(
                entryVariableName,
            ),
            "entryHidden",
            "entryFixed",
        ];
    }

    // Text the list reads itself is a piece in one pair of parentheses
    // (`(1, 2)`), whose coordinates it splits at the commas; other text
    // (`(1, 2) + (3, 4)`) is made a point or vector by sugar, which reads
    // such an expression.
    static keepsTextPiece(text) {
        return isOneParenthesizedGroup(text.trim());
    }

    // A piece of text is the math it is read as, with its coordinates as a
    // point's or vector's (`(1, 2)` is the vector of 1 and 2).
    static parseTextPiece(text, settings) {
        return coordinatesValue(parseMathText(text, settings));
    }

    static returnChildGroups() {
        return [...super.returnChildGroups(), ...this.listOtherChildGroups];
    }

    // Child groups that hold no entries.
    static listOtherChildGroups = [];

    static createAttributesObject() {
        let attributes = super.createAttributesObject();

        attributes.unordered = {
            createComponentOfType: "boolean",
            createStateVariable: "unorderedPrelim",
            defaultValue: false,
            description:
                "Whether the order of items in this list should be treated as unordered (e.g. for matching).",
        };

        return attributes;
    }

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        const listClass = this;
        const arrayName = this.listValuesArrayName;
        const componentGroups = this.listChildGroups.map((x) => x.group);
        const coordinatesArrayName = this.coordinatesArrayName;
        const coordinatesArrayPrefix = this.coordinatesArrayPrefix;
        const rowPrefix = this.listEntryComponentType;
        const shadowName = this.primaryStateVariableForDefinition;
        const childRendererVariables = this.listEntryChildRendererVariables;

        // The values of a shadowed array of entries, each the array of its
        // coordinates (a polygon's `vertices`), or the values a `copy=` of
        // the list holds, each a math (`serializeUnlinkedAsValues`).
        stateVariableDefinitions[shadowName] = {
            defaultValue: null,
            hasEssential: true,
            returnDependencies: () => ({}),
            definition: () => ({
                useEssentialOrDefaultValue: { [shadowName]: true },
            }),
            inverseDefinition: ({ desiredStateVariableValues }) => ({
                success: true,
                instructions: [
                    {
                        setEssentialValue: shadowName,
                        value: desiredStateVariableValues[shadowName],
                    },
                ],
            }),
        };

        // What `AuthoredValueList` reads of the shadowed array: each entry
        // as a math, written back in the form the shadowed array has.
        stateVariableDefinitions.listValuesShadow = {
            returnDependencies: () => ({
                shadow: {
                    dependencyType: "stateVariable",
                    variableName: shadowName,
                },
            }),
            definition: ({ dependencyValues }) => ({
                setValue: {
                    listValuesShadow:
                        dependencyValues.shadow?.map(coordinatesValue) ?? null,
                },
            }),
            inverseDefinition: ({
                desiredStateVariableValues,
                dependencyValues,
            }) => ({
                success: true,
                instructions: [
                    {
                        setDependency: "shadow",
                        desiredValue:
                            desiredStateVariableValues.listValuesShadow.map(
                                (value, ind) =>
                                    Array.isArray(
                                        dependencyValues.shadow?.[ind],
                                    )
                                        ? coordinatesOf(value)
                                        : value,
                            ),
                    },
                ],
            }),
        };

        // The largest number of dimensions among the entries, 2 when there
        // are none, read from where each entry comes from, as the entries
        // are, so that it does not depend on their values.
        stateVariableDefinitions.numDimensions = {
            description:
                "The number of dimensions of the items, the largest among them.",
            public: true,
            shadowVariable: true,
            shadowingInstructions: {
                createComponentOfType: "integer",
            },
            returnDependencies: () => ({
                entryStructure: {
                    dependencyType: "stateVariable",
                    variableName: "entryStructure",
                },
                children: {
                    dependencyType: "child",
                    childGroups: componentGroups,
                    variableNames: ["numDimensions"],
                    variablesOptional: true,
                    skipComponentIndices: true,
                },
                textPieceEntryValues: {
                    dependencyType: "stateVariable",
                    variableName: "textPieceEntryValues",
                },
                shadow: {
                    dependencyType: "stateVariable",
                    variableName: "listValuesShadow",
                },
            }),
            definition({ dependencyValues }) {
                let numDimensions = 0;
                for (const source of dependencyValues.entryStructure) {
                    let n = 1;
                    if (source.pieceInd !== undefined) {
                        n = numCoordinates(
                            dependencyValues.textPieceEntryValues[
                                source.pieceInd
                            ],
                        );
                    } else if (source.componentInd !== undefined) {
                        n =
                            dependencyValues.children[source.componentInd]
                                ?.stateValues.numDimensions;
                    } else if (source.shadowInd !== undefined) {
                        n = numCoordinates(
                            dependencyValues.shadow?.[source.shadowInd],
                        );
                    }
                    numDimensions = Math.max(
                        numDimensions,
                        Number.isFinite(n) ? n : 1,
                    );
                }
                if (numDimensions === 0) {
                    numDimensions = 2;
                }
                return {
                    setValue: { numDimensions },
                    checkForActualChange: { numDimensions: true },
                };
            },
        };

        // Each entry has every dimension of the list: a coordinate it does
        // not have is 0. A subclass adjusts the values further, as computed
        // and as written (`adjustEntryValues`). The values are the entries'
        // locations (`isLocation`), as are `points` below and a vector
        // list's tails and heads, so `fixLocation` keeps them from being
        // written, as it keeps a point's coordinates.
        const baseValues = stateVariableDefinitions[arrayName];
        stateVariableDefinitions[arrayName] = {
            ...baseValues,
            isLocation: true,
            returnArrayDependenciesByKey(args) {
                const dependencies =
                    baseValues.returnArrayDependenciesByKey(args);
                dependencies.globalDependencies = {
                    ...dependencies.globalDependencies,
                    numDimensions: {
                        dependencyType: "stateVariable",
                        variableName: "numDimensions",
                    },
                    ...listClass.entryValueAdjustmentDependencies(),
                };
                return dependencies;
            },
            arrayDefinitionByKey(args) {
                const result = baseValues.arrayDefinitionByKey(args);
                const entries = result.setValue[arrayName];
                const { numDimensions } = args.globalDependencyValues;
                for (const arrayKey in entries) {
                    entries[arrayKey] = withNumDimensions(
                        entries[arrayKey],
                        numDimensions,
                    );
                }
                listClass.adjustEntryValues(
                    entries,
                    args.globalDependencyValues,
                );
                return result;
            },
            async inverseArrayDefinitionByKey(args) {
                const { numDimensions } = args.globalDependencyValues;
                // A coordinate the write leaves unspecified (a copy of an
                // entry writing one coordinate at a time) keeps the value
                // it has, or was given earlier in the same write.
                if (!args.workspace.writtenEntries) {
                    args.workspace.writtenEntries = {};
                }
                const written = args.workspace.writtenEntries;
                const desired = {};
                for (const [arrayKey, value] of Object.entries(
                    args.desiredStateVariableValues[arrayName],
                )) {
                    let entry = withNumDimensions(
                        coordinatesValue(convertValueToMathExpression(value)),
                        numDimensions,
                    );
                    if (hasUnspecifiedCoordinate(entry)) {
                        const current =
                            written[arrayKey] ??
                            (await args.stateValues[arrayName])[arrayKey];
                        entry = withSpecifiedCoordinates(entry, current);
                    }
                    written[arrayKey] = entry;
                    desired[arrayKey] = entry;
                }
                listClass.adjustEntryValues(
                    desired,
                    args.globalDependencyValues,
                );
                return baseValues.inverseArrayDefinitionByKey({
                    ...args,
                    desiredStateVariableValues: {
                        ...args.desiredStateVariableValues,
                        [arrayName]: desired,
                    },
                });
            },
        };

        // Whether the values are adjusted beyond their number of dimensions
        // (`adjustEntryValues`), so that a coordinate is read from the whole
        // value.
        stateVariableDefinitions.entryValuesAdjusted = {
            returnDependencies: () =>
                listClass.entryValueAdjustmentDependencies(),
            definition: ({ dependencyValues }) => ({
                setValue: {
                    entryValuesAdjusted:
                        listClass.entryValuesAreAdjusted(dependencyValues),
                },
            }),
        };

        // The coordinates of each entry, by entry and coordinate, which the
        // components taking the list as an attribute read and write: one
        // coordinate (`pointX2_1`), or all of an entry (`point2`). A
        // coordinate of an entry from an authored child is the child's, so
        // that it depends on that coordinate alone, as a point whose
        // coordinates read the line through it needs.
        stateVariableDefinitions[coordinatesArrayName] = {
            isArray: true,
            isLocation: true,
            numDimensions: 2,
            entryPrefixes: [coordinatesArrayPrefix, rowPrefix],
            stateVariablesDeterminingDependencies: [
                "entryStructure",
                "entryValuesAdjusted",
            ],
            returnEntryDimensions: (prefix) => (prefix === rowPrefix ? 1 : 0),
            getArrayKeysFromVarName({
                arrayEntryPrefix,
                varEnding,
                arraySize,
            }) {
                if (arrayEntryPrefix === coordinatesArrayPrefix) {
                    // `pointX1_2` is the second coordinate of the first point
                    const indices = varEnding
                        .split("_")
                        .map((x) => Number(x) - 1);
                    if (
                        indices.length !== 2 ||
                        !indices.every((x) => Number.isInteger(x) && x >= 0)
                    ) {
                        return [];
                    }
                    if (
                        arraySize &&
                        !indices.every((x, i) => x < arraySize[i])
                    ) {
                        return [];
                    }
                    // Without the array's size, the keys of a potential
                    // entry.
                    return [String(indices)];
                }
                // `point3` is every coordinate of the third point
                const entryInd = Number(varEnding) - 1;
                if (!(Number.isInteger(entryInd) && entryInd >= 0)) {
                    return [];
                }
                if (!arraySize) {
                    // a potential entry: its first coordinate
                    return [`${entryInd},0`];
                }
                if (entryInd >= arraySize[0]) {
                    return [];
                }
                return Array.from(
                    { length: arraySize[1] },
                    (_, i) => `${entryInd},${i}`,
                );
            },
            arrayVarNameFromPropIndex(propIndex, varName) {
                if (varName === coordinatesArrayName) {
                    // further indices are ignored
                    return propIndex.length === 1
                        ? `${rowPrefix}${propIndex[0]}`
                        : `${coordinatesArrayPrefix}${propIndex[0]}_${propIndex[1]}`;
                }
                if (varName.startsWith(rowPrefix)) {
                    const entryNum = Number(varName.slice(rowPrefix.length));
                    if (Number.isInteger(entryNum) && entryNum > 0) {
                        return `${coordinatesArrayPrefix}${entryNum}_${propIndex[0]}`;
                    }
                }
                return null;
            },
            returnArraySizeDependencies: () => ({
                numEntries: {
                    dependencyType: "stateVariable",
                    variableName: "numEntries",
                },
                numDimensions: {
                    dependencyType: "stateVariable",
                    variableName: "numDimensions",
                },
            }),
            returnArraySize({ dependencyValues }) {
                return [
                    dependencyValues.numEntries,
                    dependencyValues.numDimensions,
                ];
            },
            returnArrayDependenciesByKey({ arrayKeys, stateValues }) {
                const dependenciesByKey = {};
                for (const arrayKey of arrayKeys) {
                    const [entryInd, dim] = arrayKey.split(",").map(Number);
                    const source = stateValues.entryStructure[entryInd];
                    if (
                        source?.componentInd !== undefined &&
                        !stateValues.entryValuesAdjusted
                    ) {
                        dependenciesByKey[arrayKey] = {
                            child: {
                                dependencyType: "child",
                                childGroups: componentGroups,
                                variableNames: [`x${dim + 1}`],
                                variablesOptional: true,
                                childIndices: [source.componentInd],
                            },
                        };
                    } else {
                        dependenciesByKey[arrayKey] = {
                            entry: {
                                dependencyType: "stateVariable",
                                variableName: `${listClass.listValuesEntryPrefix}${entryInd + 1}`,
                            },
                        };
                    }
                }
                return { dependenciesByKey };
            },
            arrayDefinitionByKey({ dependencyValuesByKey, arrayKeys }) {
                const coordinates = {};
                for (const arrayKey of arrayKeys) {
                    const dim = Number(arrayKey.split(",")[1]);
                    const dependencyValues = dependencyValuesByKey[arrayKey];
                    if (dependencyValues.child) {
                        const child = dependencyValues.child[0];
                        const x = child?.stateValues[`x${dim + 1}`];
                        // a coordinate the child does not have is 0
                        coordinates[arrayKey] = child
                            ? x === undefined
                                ? me.fromAst(0)
                                : convertValueToMathExpression(x)
                            : me.fromAst("\uff3f");
                    } else {
                        coordinates[arrayKey] =
                            coordinatesOf(dependencyValues.entry)[dim] ??
                            me.fromAst("\uff3f");
                    }
                }
                return { setValue: { [coordinatesArrayName]: coordinates } };
            },
            inverseArrayDefinitionByKey({
                desiredStateVariableValues,
                dependencyValuesByKey,
                dependencyNamesByKey,
                workspace,
            }) {
                // The coordinates of one write can arrive one by one, so
                // those written to an entry that is not a child's are kept
                // in the workspace, and the entry is written all of them
                // each time.
                if (!workspace.coordinatesOfEntries) {
                    workspace.coordinatesOfEntries = {};
                }
                const instructions = [];
                const written = {};
                for (const [arrayKey, value] of Object.entries(
                    desiredStateVariableValues[coordinatesArrayName],
                )) {
                    const dependencyValues = dependencyValuesByKey[arrayKey];
                    if (!dependencyValues) {
                        continue;
                    }
                    if (dependencyValues.child) {
                        if (dependencyValues.child.length === 1) {
                            instructions.push({
                                setDependency:
                                    dependencyNamesByKey[arrayKey].child,
                                desiredValue:
                                    convertValueToMathExpression(value),
                                childIndex: 0,
                                variableIndex: 0,
                            });
                        }
                        continue;
                    }
                    const [entryInd, dim] = arrayKey.split(",").map(Number);
                    if (!workspace.coordinatesOfEntries[entryInd]) {
                        workspace.coordinatesOfEntries[entryInd] =
                            coordinatesOf(dependencyValues.entry);
                    }
                    workspace.coordinatesOfEntries[entryInd][dim] =
                        convertValueToMathExpression(value);
                    written[entryInd] = arrayKey;
                }
                for (const [entryInd, arrayKey] of Object.entries(written)) {
                    instructions.push({
                        setDependency: dependencyNamesByKey[arrayKey].entry,
                        desiredValue: vectorOf(
                            workspace.coordinatesOfEntries[entryInd],
                        ),
                    });
                }
                return { success: true, instructions };
            },
        };

        // For each entry from an authored child (or from a list among the
        // children), the child, as `{ componentIdx, listEntryIndex }`, with
        // the values of the variables its renderer reads that the entry
        // takes from it (`listEntryChildRendererVariables`), and its own
        // `hide` and `fixed`; `null` for another entry. A reference to the whole list
        // reads the list's.
        stateVariableDefinitions.entryChildren = {
            shadowVariable: true,
            returnDependencies: () => ({
                entryStructure: {
                    dependencyType: "stateVariable",
                    variableName: "entryStructure",
                },
                children: {
                    dependencyType: "child",
                    childGroups: componentGroups,
                    variableNames: [...childRendererVariables, "hide", "fixed"],
                    variablesOptional: true,
                },
            }),
            definition({ dependencyValues }) {
                const entryChildren = dependencyValues.entryStructure.map(
                    (source) => {
                        const child =
                            source.componentInd === undefined
                                ? undefined
                                : dependencyValues.children[
                                      source.componentInd
                                  ];
                        if (!child) {
                            return null;
                        }
                        return {
                            componentIdx: child.componentIdx,
                            listEntryIndex: child.listEntryIndex,
                            stateValues: { ...child.stateValues },
                        };
                    },
                );
                return { setValue: { entryChildren } };
            },
        };

        // Each variable the renderer of an entry from a child takes from the
        // child, for every entry.
        for (const name of childRendererVariables) {
            const entryName = entryVariableName(name);
            stateVariableDefinitions[entryName] = {
                returnDependencies: () => ({
                    entryChildren: {
                        dependencyType: "stateVariable",
                        variableName: "entryChildren",
                    },
                    listValue: {
                        dependencyType: "stateVariable",
                        variableName: name,
                    },
                }),
                definition: ({ dependencyValues }) => ({
                    setValue: {
                        [entryName]: dependencyValues.entryChildren.map(
                            (child) =>
                                child?.stateValues[name] === undefined
                                    ? dependencyValues.listValue
                                    : child.stateValues[name],
                        ),
                    },
                }),
            };
        }

        // Each description of an entry's style, as a point or vector
        // describes its own, of the style the entry is drawn with.
        for (const [name, definition] of Object.entries(
            this.returnEntryStyleDescriptionDefinitions(),
        )) {
            const entryName = entryVariableName(name);
            stateVariableDefinitions[entryName] = {
                returnDependencies() {
                    // the entry's style in place of the list's
                    const dependencies = definition.returnDependencies();
                    delete dependencies.selectedStyle;
                    return {
                        ...dependencies,
                        entrySelectedStyle: {
                            dependencyType: "stateVariable",
                            variableName: "entrySelectedStyle",
                        },
                    };
                },
                definition: ({ dependencyValues }) => ({
                    setValue: {
                        [entryName]: dependencyValues.entrySelectedStyle.map(
                            (selectedStyle) =>
                                definition.definition({
                                    dependencyValues: {
                                        ...dependencyValues,
                                        selectedStyle,
                                    },
                                }).setValue[name],
                        ),
                    },
                }),
            };
        }

        // An entry is hidden with the list, and an entry from a child that
        // is hidden by its own `hide` is hidden too, except in a reference
        // to the list, which the list's own `hide` does not hide either
        // (`hideIsOwn`).
        stateVariableDefinitions.entryHidden = {
            returnDependencies: () => ({
                entryChildren: {
                    dependencyType: "stateVariable",
                    variableName: "entryChildren",
                },
                hidden: {
                    dependencyType: "stateVariable",
                    variableName: "hidden",
                },
                hideIsOwn: {
                    dependencyType: "stateVariable",
                    variableName: "hideIsOwn",
                },
            }),
            definition: ({ dependencyValues }) => ({
                setValue: {
                    entryHidden: dependencyValues.entryChildren.map(
                        (child) =>
                            dependencyValues.hidden ||
                            (!dependencyValues.hideIsOwn &&
                                Boolean(child?.stateValues.hide)),
                    ),
                },
            }),
        };

        // An entry is fixed with the list, and an entry from a child that is
        // fixed is fixed too.
        stateVariableDefinitions.entryFixed = {
            returnDependencies: () => ({
                entryChildren: {
                    dependencyType: "stateVariable",
                    variableName: "entryChildren",
                },
                entriesFixed: {
                    dependencyType: "stateVariable",
                    variableName: "entriesFixed",
                },
            }),
            definition: ({ dependencyValues }) => ({
                setValue: {
                    entryFixed: dependencyValues.entryChildren.map(
                        (child) =>
                            dependencyValues.entriesFixed ||
                            Boolean(child?.stateValues.fixed),
                    ),
                },
            }),
        };

        // Whether an entry that leaves the graph is shown by an indicator at
        // its edge, as for a point in the graph.
        stateVariableDefinitions.hideOffGraphIndicator = {
            returnDependencies: () => ({
                graphAncestor: {
                    dependencyType: "ancestor",
                    componentType: "graph",
                    variableNames: ["hideOffGraphIndicators"],
                },
            }),
            definition: ({ dependencyValues }) => ({
                setValue: {
                    hideOffGraphIndicator: Boolean(
                        dependencyValues.graphAncestor?.stateValues
                            .hideOffGraphIndicators,
                    ),
                },
            }),
        };

        return stateVariableDefinitions;
    }

    /**
     * The dependencies `adjustEntryValues` reads, as global dependencies of
     * the array of values.
     */
    static entryValueAdjustmentDependencies() {
        return {};
    }

    /**
     * Whether `adjustEntryValues`, given its dependencies, changes values.
     */
    static entryValuesAreAdjusted(dependencyValues) {
        return false;
    }

    /**
     * Adjust the values of entries (`{ [index]: value }`, each with the
     * list's number of dimensions) in place, as computed and as written.
     */
    static adjustEntryValues(entries, dependencyValues) {}

    /**
     * Whether the entry `listEntryIndex` takes an action of the renderer
     * that drags it: it is neither fixed nor undraggable.
     */
    async entryCanBeDragged(listEntryIndex, draggableVariable = "draggable") {
        if (!Number.isInteger(listEntryIndex)) {
            return false;
        }
        const fixed = (await this.stateValues.entryFixed)[listEntryIndex];
        const draggable = (
            await this.stateValues[entryVariableName(draggableVariable)]
        )?.[listEntryIndex];
        return fixed === false && draggable !== false;
    }

    /**
     * A click or focus on entry `listEntryIndex`: for an entry from a child,
     * the child's own action (`actionName`), with the entry's index when the
     * child is a list; for another entry, the actions chained to the list,
     * unless the entry is fixed.
     */
    async performOnEntryChild({ actionName, triggeringAction, args }) {
        const { listEntryIndex, actionId, sourceInformation = {} } = args;
        const skipRendererUpdate = args.skipRendererUpdate ?? false;
        const child = (await this.stateValues.entryChildren)[listEntryIndex];
        if (child) {
            const { listEntryIndex: _, ...childArgs } = args;
            await this.coreFunctions.performAction({
                componentIdx: child.componentIdx,
                actionName,
                args: {
                    ...childArgs,
                    componentIdx: child.componentIdx,
                    ...(child.listEntryIndex === undefined
                        ? {}
                        : { listEntryIndex: child.listEntryIndex }),
                },
            });
            return;
        }
        if (
            triggeringAction !== undefined &&
            !(await this.stateValues.entryFixed)[listEntryIndex]
        ) {
            await this.coreFunctions.triggerChainedActions({
                triggeringAction,
                componentIdx: this.componentIdx,
                actionId,
                sourceInformation,
                skipRendererUpdate,
            });
        }
    }
}

/** `rendererVariables` of each list class, made once per class. */
const rendererVariablesOfListClass = new WeakMap();

/** The array of a list holding variable `name` of each entry's renderer. */
export function entryVariableName(name) {
    return `entry${name[0].toUpperCase()}${name.slice(1)}`;
}

/**
 * `value`, a math or an array of coordinates, as the math of coordinates a
 * point's `coords` is: a vector of them, or the one coordinate.
 */
export function coordinatesValue(value) {
    // an array of coordinates, not a math's tree that a saved state holds
    if (Array.isArray(value) && typeof value[0] !== "string") {
        return vectorOf(value.map((x) => convertValueToMathExpression(x)));
    }
    const math = convertValueToMathExpression(value);
    const tree = math.tree;
    if (Array.isArray(tree) && vectorOperators.includes(tree[0])) {
        return tree[0] === "vector"
            ? math
            : me.fromAst(["vector", ...tree.slice(1)]);
    }
    return math;
}

/** The coordinates of `value`, the math of a point's coordinates. */
export function coordinatesOf(value) {
    if (value === undefined || value === null) {
        return [];
    }
    const tree = value.tree;
    if (Array.isArray(tree) && vectorOperators.includes(tree[0])) {
        return tree.slice(1).map((x) => me.fromAst(x));
    }
    return [value];
}

/** The math of the coordinates `coordinates`, as `coordinatesValue` makes. */
export function vectorOf(coordinates) {
    if (coordinates.length === 1) {
        return coordinates[0];
    }
    return me.fromAst(["vector", ...coordinates.map((x) => x.tree)]);
}

/** The number of coordinates of `value`, a math or an array of them. */
function numCoordinates(value) {
    if (value === undefined || value === null) {
        return 1;
    }
    return coordinatesOf(coordinatesValue(value)).length;
}

/**
 * `value` with `numDimensions` coordinates: the ones it has, then 0.
 */
export function withNumDimensions(value, numDimensions) {
    const coordinates = coordinatesOf(coordinatesValue(value));
    if (coordinates.length === numDimensions) {
        return vectorOf(coordinates);
    }
    const padded = [];
    for (let i = 0; i < numDimensions; i++) {
        padded.push(coordinates[i] ?? me.fromAst(0));
    }
    return vectorOf(padded);
}

/** The coordinates of `value` as numbers, `NaN` where one has no number. */
export function numericalCoordinates(value) {
    return coordinatesOf(value).map((x) => evaluateToNumber(x));
}

/**
 * Whether `text` is one pair of parentheses around the rest (`(1, (2))`,
 * not `(1, 2) + (3, 4)`).
 */
function isOneParenthesizedGroup(text) {
    if (text[0] !== "(" || text[text.length - 1] !== ")") {
        return false;
    }
    let depth = 0;
    for (let i = 0; i < text.length; i++) {
        if (text[i] === "(") {
            depth++;
        } else if (text[i] === ")") {
            depth--;
            if (depth === 0 && i < text.length - 1) {
                return false;
            }
        }
    }
    return depth === 0;
}

/** Whether a coordinate of `value` is unspecified by the write it is in. */
export function hasUnspecifiedCoordinate(value) {
    return coordinatesOf(value).some(isUnspecifiedComponentValue);
}

/**
 * `value` with each coordinate the write leaves unspecified taken from
 * `current`.
 */
export function withSpecifiedCoordinates(value, current) {
    const currentCoordinates = coordinatesOf(current);
    return vectorOf(
        coordinatesOf(value).map((x, i) =>
            isUnspecifiedComponentValue(x)
                ? (currentCoordinates[i] ?? me.fromAst("\uff3f"))
                : x,
        ),
    );
}
