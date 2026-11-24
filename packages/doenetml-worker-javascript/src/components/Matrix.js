import { returnNumberDisplayStateVariableDefinitions } from "../utils/numberDisplay";
import MathComponent from "./Math";
import me from "math-expressions";
import { convertValueToMathExpression } from "@doenet/utils";
import { codedDiagnostic } from "../utils/diagnostics";

export default class Matrix extends MathComponent {
    static componentType = "matrix";
    // An object, not a value, though built on `<math>` (D46).
    static isValue = false;

    /**
     * A matrix uses one `<math>` child, the last one written (REF-4a), so a
     * `<math>` written on a copy replaces its source's, and one written on
     * an extend is ignored (`addChildrenFromComposite`, #2546).
     */
    static childGroupsReadOnce = ["maths"];

    /**
     * Of the children written on a copy or extend (`added`), those a matrix
     * does not use beside those from its source (`fromSource`): a `<math>`
     * is its value only when it has no rows or columns. Rows and columns are
     * added to the source's (REF-4). (`addChildrenFromComposite`, #2486)
     */
    static childrenIgnoredBeside({ fromSource, added, groupOf }) {
        const hasRowsOrColumns = [...fromSource, ...added].some((child) =>
            ["rows", "columns"].includes(groupOf(child)),
        );
        return added.filter(
            (child) => groupOf(child) === "maths" && hasRowsOrColumns,
        );
    }

    static componentDocs = {
        summary: "A matrix of math values",
        // `<row>` and `<column>` children are sugared to `<matrixRow>` and
        // `<matrixColumn>` at runtime. Editor help follows the same indirection
        // so authors see the matrix-aware description rather than the tabular
        // <row> / unrelated <column> ones.
        childAliases: { row: "matrixRow", column: "matrixColumn" },
    };
    static rendererType = "math";

    // An index selects a row, as a 1×n matrix, and a second index an entry:
    // `$M[i]` is `$M.matrix[i]` (D27).
    static variableForIndexAsProp = "matrix";

    // Include children that can be added due to sugar
    static additionalSchemaChildren = ["row", "column"];

    static returnChildGroups() {
        return [
            {
                group: "rows",
                componentTypes: ["matrixRow"],
            },
            {
                group: "columns",
                componentTypes: ["matrixColumn"],
            },
            {
                group: "maths",
                componentTypes: ["math"],
                excludeFromSchema: true,
            },
        ];
    }

    static createAttributesObject() {
        let attributes = super.createAttributesObject();

        attributes.defaultEntry = {
            createComponentOfType: "math",
            createStateVariable: "defaultEntry",
            defaultValue: me.fromAst(0),
            description:
                "Value used for entries that aren't explicitly specified.",
        };
        attributes.numRows = {
            createComponentOfType: "integer",
            description: "Number of rows in the matrix.",
        };
        attributes.numColumns = {
            createComponentOfType: "integer",
            description: "Number of columns in the matrix.",
        };

        return attributes;
    }

    static returnSugarInstructions() {
        let sugarInstructions = super.returnSugarInstructions();

        let replaceRowAndColumnChildren = function ({
            matchedChildren,
            componentInfoObjects,
            nComponents,
            stateIdInfo,
        }) {
            if (matchedChildren.length === 0) {
                return { success: false };
            }

            let newChildren = [];

            let foundRowsOrColumns = false;

            const isMath = (child) =>
                typeof child === "object" &&
                componentInfoObjects.componentIsSpecifiedType(child, "math");

            /**
             * Make a `<row>` or `<column>` (written, or made with `copy` or
             * `extend`) a row or column of the matrix. Returns whether it
             * was one.
             */
            function renameRowOrColumn(child) {
                if (!child.doenetAttributes) {
                    child.doenetAttributes = {};
                }
                if (child.componentType === "column") {
                    child.doenetAttributes.createNameFromComponentType =
                        "column";
                    child.componentType = "matrixColumn";
                    return true;
                } else if (child.componentType === "row") {
                    child.doenetAttributes.createNameFromComponentType = "row";
                    child.componentType = "matrixRow";
                    return true;
                } else if (
                    child.attributes?._createComponentOfType?.primitive
                        .value === "column"
                ) {
                    child.doenetAttributes.createNameFromComponentType =
                        "column";
                    child.attributes._createComponentOfType.primitive.value =
                        "matrixColumn";
                    return true;
                } else if (
                    child.attributes?._createComponentOfType?.primitive
                        .value === "row"
                ) {
                    child.doenetAttributes.createNameFromComponentType = "row";
                    child.attributes._createComponentOfType.primitive.value =
                        "matrixRow";
                    return true;
                }
                return false;
            }

            /**
             * Rows and columns a composite written in the matrix expands to
             * are the matrix's rows and columns, as if written in its place
             * (COMP-1, #1873): a `<repeat>` of rows, a `<group>`, a case or
             * an option holding them. Each is renamed, at any depth through
             * composites and the options and cases of a `<select>` or
             * `<conditionalContent>`. Returns whether any was found.
             *
             * Those it shows are counted in `numRowsShown`, and a `<math>`
             * beside them in `numMathsInComposites`; not those in a
             * `<setup>`, which shows nothing. A row in a `<setup>` is still
             * renamed, so that `$r` copies it into the matrix as a row.
             */
            function renameRowsAndColumnsInComposite(
                composite,
                inSetup = false,
            ) {
                const hidden =
                    inSetup ||
                    componentInfoObjects.componentIsSpecifiedType(
                        composite,
                        "setup",
                    );
                let found = false;
                for (const child of composite.children ?? []) {
                    if (typeof child !== "object") {
                        continue;
                    }
                    if (renameRowOrColumn(child)) {
                        found = true;
                        if (!hidden) {
                            numRowsShown++;
                        }
                    } else if (isMath(child)) {
                        if (!hidden) {
                            numMathsInComposites++;
                        }
                    } else if (
                        isWrittenComposite(child) ||
                        ["option", "case", "else"].some((type) =>
                            componentInfoObjects.componentIsSpecifiedType(
                                child,
                                type,
                            ),
                        )
                    ) {
                        found =
                            renameRowsAndColumnsInComposite(child, hidden) ||
                            found;
                    }
                }
                return found;
            }

            let numRowsShown = 0;
            let numMathsInComposites = 0;

            /** Whether `child` is a composite written out, not a reference or a copy. */
            function isWrittenComposite(child) {
                return (
                    child.componentType !== "_copy" &&
                    componentInfoObjects.isInheritedComponentType({
                        inheritedComponentType: child.componentType,
                        baseComponentType: "_composite",
                    })
                );
            }

            for (let child of matchedChildren) {
                if (typeof child === "string") {
                    continue;
                }
                if (renameRowOrColumn(child)) {
                    foundRowsOrColumns = true;
                    numRowsShown++;
                } else if (
                    isWrittenComposite(child) &&
                    renameRowsAndColumnsInComposite(child)
                ) {
                    foundRowsOrColumns = true;
                }

                newChildren.push(child);
            }

            const diagnostics = [];
            const nonBlank = matchedChildren.filter(
                (child) => typeof child !== "string" || child.trim() !== "",
            );
            const mathChildren = nonBlank.filter(isMath);

            if (foundRowsOrColumns) {
                // A `<math>` is the matrix's value only when it has no rows
                // or columns.
                // A `<math>` beside rows only in a `<setup>` is the matrix's
                // value.
                if (
                    numRowsShown > 0 &&
                    (mathChildren.length > 0 || numMathsInComposites > 0)
                ) {
                    diagnostics.push(
                        codedDiagnostic({
                            type: "warning",
                            code: "doenet-w0194",
                            args: { reason: "rows" },
                        }),
                    );
                } else if (
                    numRowsShown === 0 &&
                    nonBlank.some((child) => typeof child === "string")
                ) {
                    // Rows only in a `<setup>`, which shows nothing: text
                    // beside them is the matrix's value, made a `<math>`
                    // as when there are no rows, and the `<setup>` is kept
                    // beside it (`<matrix><setup><row name="r">1
                    // 2</row></setup>x</matrix>` is `[[x]]`).
                    const isSetup = (child) =>
                        typeof child === "object" &&
                        componentInfoObjects.componentIsSpecifiedType(
                            child,
                            "setup",
                        );
                    newChildren = [
                        ...matchedChildren.filter(isSetup),
                        {
                            type: "serialized",
                            componentType: "math",
                            componentIdx: nComponents++,
                            stateId: stateIdInfo
                                ? `${stateIdInfo.prefix}${stateIdInfo.num++}`
                                : undefined,
                            children: matchedChildren.filter(
                                (child) => !isSetup(child),
                            ),
                            attributes: {},
                            doenetAttributes: {},
                            state: {},
                        },
                    ];
                }
            } else if (nonBlank.length > 1 && nonBlank.every(isMath)) {
                // A matrix uses one `<math>` child: of several written, the
                // last (REF-4a). They are not joined into one expression, as
                // the children of a `<math>` are (#2546). The matrix reads
                // the last (`childIndices: [-1]`).
                diagnostics.push(
                    codedDiagnostic({
                        type: "warning",
                        code: "doenet-w0194",
                        args: { reason: "several" },
                    }),
                );
                newChildren = mathChildren;
            } else {
                if (matchedChildren.length > 1 || !isMath(matchedChildren[0])) {
                    newChildren = [
                        {
                            type: "serialized",
                            componentType: "math",
                            componentIdx: nComponents++,
                            stateId: stateIdInfo
                                ? `${stateIdInfo.prefix}${stateIdInfo.num++}`
                                : undefined,
                            children: matchedChildren,
                            attributes: {},
                            doenetAttributes: {},
                            state: {},
                        },
                    ];
                }
            }

            return {
                success: true,
                newChildren,
                nComponents,
                diagnostics,
            };
        };

        sugarInstructions.push({
            replacementFunction: replaceRowAndColumnChildren,
        });

        return sugarInstructions;
    }

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        delete stateVariableDefinitions.codePre;
        delete stateVariableDefinitions.mathChildrenFunctionSymbols;
        delete stateVariableDefinitions.expressionWithCodes;
        delete stateVariableDefinitions.mathChildrenWithCanBeModified;
        delete stateVariableDefinitions.codesAdjacentToStrings;
        delete stateVariableDefinitions.canBeModified;
        delete stateVariableDefinitions.mathChildrenByVectorComponent;

        Object.assign(
            stateVariableDefinitions,
            returnNumberDisplayStateVariableDefinitions(),
        );

        stateVariableDefinitions.unordered = {
            description:
                "Whether matrix entries should be treated as unordered.",
            public: true,
            shadowingInstructions: {
                createComponentOfType: "boolean",
            },
            returnDependencies: () => ({}),
            definition() {
                return {
                    setValue: { unordered: false },
                };
            },
        };

        stateVariableDefinitions.matrixSizePre = {
            returnDependencies: () => ({
                rowChildren: {
                    dependencyType: "child",
                    childGroups: ["rows"],
                    variableNames: ["numComponents"],
                },
                colChildren: {
                    dependencyType: "child",
                    childGroups: ["columns"],
                    variableNames: ["numComponents"],
                },
                // the last `<math>`, the one a matrix uses (REF-4a)
                mathChildren: {
                    dependencyType: "child",
                    childGroups: ["maths"],
                    childIndices: [-1],
                    variableNames: ["matrixSize"],
                },
                numRowsAttr: {
                    dependencyType: "attributeComponent",
                    attributeName: "numRows",
                    variableNames: ["value"],
                },
                numColumnsAttr: {
                    dependencyType: "attributeComponent",
                    attributeName: "numColumns",
                    variableNames: ["value"],
                },
            }),
            definition({ dependencyValues }) {
                let numRows = null,
                    numColumns = null;

                if (dependencyValues.numRowsAttr) {
                    numRows = dependencyValues.numRowsAttr.stateValues.value;
                    if (!(Number.isFinite(numRows) && numRows > 0)) {
                        numRows = null;
                    }
                }
                if (dependencyValues.numColumnsAttr) {
                    numColumns =
                        dependencyValues.numColumnsAttr.stateValues.value;
                    if (!(Number.isFinite(numColumns) && numColumns > 0)) {
                        numColumns = null;
                    }
                }

                if (dependencyValues.rowChildren.length > 0) {
                    if (numRows === null) {
                        numRows = dependencyValues.rowChildren.length;
                    }
                    if (numColumns === null) {
                        numColumns = Math.max(
                            1,
                            ...dependencyValues.rowChildren.map(
                                (x) => x.stateValues.numComponents,
                            ),
                        );
                    }
                } else if (dependencyValues.colChildren.length > 0) {
                    if (numColumns === null) {
                        numColumns = dependencyValues.colChildren.length;
                    }
                    if (numRows === null) {
                        numRows = Math.max(
                            1,
                            ...dependencyValues.colChildren.map(
                                (x) => x.stateValues.numComponents,
                            ),
                        );
                    }
                } else if (dependencyValues.mathChildren.length === 1) {
                    if (numRows === null) {
                        numRows =
                            dependencyValues.mathChildren[0].stateValues
                                .matrixSize[0];
                    }
                    if (numColumns === null) {
                        numColumns =
                            dependencyValues.mathChildren[0].stateValues
                                .matrixSize[1];
                    }
                } else {
                    // if numRows or numColumns is not specified, set to 1,
                    // except if both are not specified, set both to 0
                    if (numRows === null) {
                        if (numColumns === null) {
                            numRows = 0;
                            numColumns = 0;
                        } else {
                            numRows = 1;
                        }
                    } else if (numColumns === null) {
                        numColumns = 1;
                    }
                }

                return { setValue: { matrixSizePre: [numRows, numColumns] } };
            },
        };

        stateVariableDefinitions.matrixPre = {
            isArray: true,
            numDimensions: 2,
            hasEssential: true,
            // a save holds a math-expression as its tree, so a restored value
            // must be made a math-expression again
            set: convertValueToMathExpression,
            returnArraySizeDependencies: () => ({
                matrixSizePre: {
                    dependencyType: "stateVariable",
                    variableName: "matrixSizePre",
                },
            }),
            returnArraySize({ dependencyValues }) {
                return dependencyValues.matrixSizePre;
            },
            returnArrayDependenciesByKey: ({ arrayKeys }) => {
                let globalDependencies = {
                    defaultEntry: {
                        dependencyType: "stateVariable",
                        variableName: "defaultEntry",
                    },
                    rowChildIdentities: {
                        dependencyType: "child",
                        childGroups: ["rows"],
                    },
                    colChildIdentities: {
                        dependencyType: "child",
                        childGroups: ["columns"],
                    },
                };
                let dependenciesByKey = {};

                for (let arrayKey of arrayKeys) {
                    let [rowInd, colInd] = arrayKey.split(",");
                    dependenciesByKey[arrayKey] = {
                        rowChild: {
                            dependencyType: "child",
                            childGroups: ["rows"],
                            childIndices: [rowInd],
                            variableNames: ["math" + (Number(colInd) + 1)],
                        },
                        colChild: {
                            dependencyType: "child",
                            childGroups: ["columns"],
                            childIndices: [colInd],
                            variableNames: ["math" + (Number(rowInd) + 1)],
                        },
                        mathChild: {
                            dependencyType: "child",
                            childGroups: ["maths"],
                            childIndices: [-1],
                            variableNames: [
                                "matrixEntry" +
                                    (Number(rowInd) + 1) +
                                    "_" +
                                    (Number(colInd) + 1),
                            ],
                        },
                    };
                }

                return { globalDependencies, dependenciesByKey };
            },
            arrayDefinitionByKey({
                globalDependencyValues,
                dependencyValuesByKey,
                arrayKeys,
                arraySize,
            }) {
                let matrix = {};
                let essentialMatrix = {};
                let useRows =
                    globalDependencyValues.rowChildIdentities.length > 0;
                let useColumns =
                    globalDependencyValues.colChildIdentities.length > 0;

                for (let arrayKey of arrayKeys) {
                    let [rowInd, colInd] = arrayKey.split(",");

                    let entry;
                    if (useRows) {
                        entry =
                            dependencyValuesByKey[arrayKey].rowChild[0]
                                ?.stateValues["math" + (Number(colInd) + 1)];
                    } else if (useColumns) {
                        entry =
                            dependencyValuesByKey[arrayKey].colChild[0]
                                ?.stateValues["math" + (Number(rowInd) + 1)];
                    } else {
                        entry =
                            dependencyValuesByKey[arrayKey].mathChild[0]
                                ?.stateValues[
                                "matrixEntry" +
                                    (Number(rowInd) + 1) +
                                    "_" +
                                    (Number(colInd) + 1)
                            ];
                    }

                    if (entry === undefined) {
                        essentialMatrix[arrayKey] = {
                            defaultValue: globalDependencyValues.defaultEntry,
                        };
                    } else {
                        matrix[arrayKey] = entry;
                    }
                }

                return {
                    setValue: { matrixPre: matrix },
                    useEssentialOrDefaultValue: { matrixPre: essentialMatrix },
                };
            },
            async inverseArrayDefinitionByKey({
                desiredStateVariableValues,
                globalDependencyValues,
                dependencyValuesByKey,
                dependencyNamesByKey,
            }) {
                let instructions = [];
                let newMatrixValues = {};
                let useRows =
                    globalDependencyValues.rowChildIdentities.length > 0;
                let useColumns =
                    globalDependencyValues.colChildIdentities.length > 0;

                for (let arrayKey in desiredStateVariableValues.matrixPre) {
                    let [rowInd, colInd] = arrayKey.split(",");

                    if (useRows) {
                        let entry =
                            dependencyValuesByKey[arrayKey].rowChild[0]
                                ?.stateValues["math" + (Number(colInd) + 1)];
                        if (entry === undefined) {
                            newMatrixValues[arrayKey] =
                                desiredStateVariableValues.matrixPre[arrayKey];
                        } else {
                            instructions.push({
                                setDependency:
                                    dependencyNamesByKey[arrayKey].rowChild,
                                desiredValue:
                                    desiredStateVariableValues.matrixPre[
                                        arrayKey
                                    ],
                                childIndex: 0,
                                variableIndex: 0,
                            });
                        }
                    } else if (useColumns) {
                        let entry =
                            dependencyValuesByKey[arrayKey].colChild[0]
                                ?.stateValues["math" + (Number(rowInd) + 1)];
                        if (entry === undefined) {
                            newMatrixValues[arrayKey] =
                                desiredStateVariableValues.matrixPre[arrayKey];
                        } else {
                            instructions.push({
                                setDependency:
                                    dependencyNamesByKey[arrayKey].colChild,
                                desiredValue:
                                    desiredStateVariableValues.matrixPre[
                                        arrayKey
                                    ],
                                childIndex: 0,
                                variableIndex: 0,
                            });
                        }
                    } else {
                        let entry =
                            dependencyValuesByKey[arrayKey].mathChild[0]
                                ?.stateValues[
                                "matrixEntry" +
                                    (Number(rowInd) + 1) +
                                    "_" +
                                    (Number(colInd) + 1)
                            ];
                        if (entry === undefined) {
                            newMatrixValues[arrayKey] =
                                desiredStateVariableValues.matrixPre[arrayKey];
                        } else {
                            instructions.push({
                                setDependency:
                                    dependencyNamesByKey[arrayKey].mathChild,
                                desiredValue:
                                    desiredStateVariableValues.matrixPre[
                                        arrayKey
                                    ],
                                childIndex: 0,
                                variableIndex: 0,
                            });
                        }
                    }
                }

                if (Object.keys(newMatrixValues).length > 0) {
                    instructions.push({
                        setEssentialValue: "matrixPre",
                        value: newMatrixValues,
                    });
                }

                return {
                    success: true,
                    instructions,
                };
            },
        };

        stateVariableDefinitions.unnormalizedValue = {
            returnDependencies: () => ({
                matrixPre: {
                    dependencyType: "stateVariable",
                    variableName: "matrixPre",
                },
                matrixSizePre: {
                    dependencyType: "stateVariable",
                    variableName: "matrixSizePre",
                },
            }),
            hasEssential: true,
            // a save holds a math-expression as its tree, so a restored value
            // must be made a math-expression again
            set: convertValueToMathExpression,
            defaultValue: me.fromAst(["matrix", ["tuple", 0, 0], ["tuple"]]), // 0x0 matrix
            definition({ dependencyValues }) {
                let matrixValues = ["tuple"];
                for (let i = 0; i < dependencyValues.matrixSizePre[0]; i++) {
                    matrixValues.push([
                        "tuple",
                        ...dependencyValues.matrixPre[i].map((x) => x.tree),
                    ]);
                }

                let unnormalizedValue = me.fromAst([
                    "matrix",
                    ["tuple", ...dependencyValues.matrixSizePre],
                    matrixValues,
                ]);

                return { setValue: { unnormalizedValue } };
            },
            inverseDefinition({
                dependencyValues,
                desiredStateVariableValues,
            }) {
                let desiredTree =
                    desiredStateVariableValues.unnormalizedValue.tree;

                if (!(
                    Array.isArray(desiredTree) &&
                    desiredTree[0] === "matrix" &&
                    desiredTree[1]?.[1] === dependencyValues.matrixSizePre[0] &&
                    desiredTree[1]?.[2] === dependencyValues.matrixSizePre[1]
                )) {
                    return { success: false };
                }

                let desiredMatrix = {};

                for (let i = 0; i < dependencyValues.matrixSizePre[0]; i++) {
                    for (
                        let j = 0;
                        j < dependencyValues.matrixSizePre[1];
                        j++
                    ) {
                        desiredMatrix[`${i},${j}`] = me.fromAst(
                            desiredTree[2][i + 1][j + 1],
                        );
                    }
                }

                return {
                    success: true,
                    instructions: [
                        {
                            setDependency: "matrixPre",
                            desiredValue: desiredMatrix,
                        },
                    ],
                };
            },
        };

        stateVariableDefinitions.canBeModified = {
            returnDependencies: () => ({
                fixed: {
                    dependencyType: "stateVariable",
                    variableName: "fixed",
                },
            }),
            definition({ dependencyValues }) {
                return {
                    setValue: {
                        canBeModified: !dependencyValues.fixed,
                    },
                };
            },
        };

        return stateVariableDefinitions;
    }
}
