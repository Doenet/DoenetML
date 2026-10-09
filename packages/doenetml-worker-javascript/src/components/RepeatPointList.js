import PointList from "./PointList";
import PointComponent from "./Point";
import GraphicalComponent from "./abstract/GraphicalComponent";
import {
    coordinatesOf,
    coordinatesValue,
    graphicalEntryValuesDefinition,
    vectorOf,
} from "./abstract/GraphicalValueList";
import {
    UNSPECIFIED_COMPONENT,
    isUnspecifiedComponentValue,
} from "../utils/math";
import {
    REPEAT_LIST_STATICS,
    addRepeatListAttributes,
    addRepeatListDefinitions,
    entryCodeDependency,
    evaluatorDependencies,
    repeatTemplateEntriesDefinition,
    templateContext,
    readWritability,
} from "./abstract/repeatList";
import {
    evaluateRepeatTemplate,
    invertRepeatTemplate,
} from "../utils/repeatTemplate";
import me from "math-expressions";
import {
    convertValueToMathExpression,
    returnSelectedStyleStateVariableDefinition,
} from "@doenet/utils";

/**
 * The coordinates an entry has an array of its own for (`x1` to `x3`), each
 * computed from that coordinate of the template alone.
 */
const NUM_COORDINATE_ARRAYS = 3;

/**
 * The attributes of a template `<point>` that its renderer reads, which the
 * list holds as its own and draws every entry with.
 */
export const REPEAT_POINT_RENDERER_ATTRIBUTES = [
    "labelPosition",
    "draggable",
    "showCoordsWhenDragging",
    "layer",
];

/**
 * A `<repeat>` or `<repeatForSequence>` whose template is one `<point>`, made
 * a list of points by the pass in `utils/dast/repeatLists.ts`. Part of
 * Doenet/DoenetML#2163 (F6, step 5); see
 * `docs/f6-repeat-templates-as-lists.md`.
 *
 * It is a `<pointList>` whose entries come from the template, as a
 * `RepeatValueList`'s do (`repeatList.js`): entry k is the point the template
 * gives with what it reads at index k, each coordinate a node of the
 * template. It has no authored entries. The template's attributes are the
 * list's own, and every entry is drawn with them, as each iteration's point
 * was drawn with the same ones: its `styleNumber`, marker style and size,
 * `labelPosition`, `draggable`, `showCoordsWhenDragging` and `layer`
 * (`REPEAT_POINT_RENDERER_ATTRIBUTES`). The template's constraints are the
 * list's constraint children, which constrain each entry as they constrained
 * each iteration's point (`PointList.adjustEntryValues`).
 *
 * Each coordinate of the entries is an array of its own (`entryCoordinates1`,
 * read as the entries' `x1`, `$Ps.x`), computed from that coordinate of the
 * template alone, with the constraints applied coordinate by coordinate when
 * each constrains coordinates independently (`constrainToGrid`), as a point
 * does: a value the template's y reads may read the entries' x (the dot
 * plots' stack heights read `$Ps.x`).
 *
 * A drag of entry k writes each coordinate through the template on its own,
 * as a point's coordinates are written: to the entries and values the
 * coordinate reads, or to that entry's copy of its text. A coordinate that
 * does not take its value (`<number fixed>`, `$i`) keeps it.
 */
export default class RepeatPointList extends PointList {
    static componentType = "_repeatPointList";

    // The entries come from the template; the list has no authored ones.
    static listChildGroups = [];

    static listOtherChildGroups = [
        {
            group: "constraints",
            componentTypes: ["_constraint"],
        },
        {
            group: "iterationLists",
            componentTypes: ["_repeatValues", "_repeatIndices"],
        },
        {
            group: "constants",
            componentTypes: ["_base"],
        },
    ];

    // An entry is fixed only as the template was, by its own `fixed` or an
    // ancestor's.
    static listEntriesFixedByDefault = false;

    // The marker style and size a `<point>` can set.
    static styleOverrideCategories = PointComponent.styleOverrideCategories;

    // Each coordinate of an entry is read from its own array.
    static buildListEntryStateVariables() {
        const variables = super.buildListEntryStateVariables();
        for (let n = 1; n <= NUM_COORDINATE_ARRAYS; n++) {
            variables[`x${n}`] = `entryCoordinates${n}`;
        }
        return variables;
    }

    static get listPerEntryVariables() {
        const variables = [...super.listPerEntryVariables];
        for (let n = 1; n <= NUM_COORDINATE_ARRAYS; n++) {
            variables.push(`entryCoordinates${n}`);
        }
        return variables;
    }

    static derivedEntryProperty(name) {
        const match = /^x([1-9]\d*)$/.exec(name);
        if (match && Number(match[1]) <= NUM_COORDINATE_ARRAYS) {
            return undefined;
        }
        return super.derivedEntryProperty(name);
    }

    // The template's attributes, which the list holds as its own, in place
    // of a point's defaults.
    static get listEntryRendererDefaults() {
        const defaults = { ...super.listEntryRendererDefaults };
        for (const name of REPEAT_POINT_RENDERER_ATTRIBUTES) {
            delete defaults[name];
        }
        return defaults;
    }

    static createAttributesObject() {
        const attributes = super.createAttributesObject();
        addRepeatListAttributes(attributes);
        const pointAttributes = PointComponent.createAttributesObject();
        for (const name of REPEAT_POINT_RENDERER_ATTRIBUTES) {
            attributes[name] = pointAttributes[name];
        }
        GraphicalComponent.addStyleOverrideAttributes.call(this, attributes);
        return attributes;
    }

    static returnStateVariableDefinitions() {
        const stateVariableDefinitions = super.returnStateVariableDefinitions();
        const arrayName = this.listValuesArrayName;

        addRepeatListDefinitions(stateVariableDefinitions);

        // Every entry is the template's; none comes from an authored child.
        stateVariableDefinitions.entryStructure = {
            returnDependencies: () => ({
                numIterates: {
                    dependencyType: "stateVariable",
                    variableName: "numIterates",
                },
            }),
            definition: ({ dependencyValues }) => ({
                setValue: {
                    entryStructure: Array.from(
                        { length: dependencyValues.numIterates },
                        () => ({}),
                    ),
                },
            }),
        };

        // The number of coordinates of the template's point.
        stateVariableDefinitions.numDimensions = {
            ...stateVariableDefinitions.numDimensions,
            returnDependencies: () => ({
                templateAnalysis: {
                    dependencyType: "stateVariable",
                    variableName: "templateAnalysis",
                },
            }),
            definition: ({ dependencyValues }) => ({
                setValue: {
                    numDimensions:
                        dependencyValues.templateAnalysis.nodes[0]?.codes
                            .length || 2,
                },
                checkForActualChange: { numDimensions: true },
            }),
        };

        // Entry k is the template's point at index k, with the list's
        // dimensions and constraints.
        stateVariableDefinitions[arrayName] = entryValuesDefinition({
            listClass: this,
            baseValues: stateVariableDefinitions[arrayName],
        });

        // Whether every constraint constrains each coordinate on its own.
        stateVariableDefinitions.independentConstraints = {
            returnDependencies: () => ({
                constraintChildren: {
                    dependencyType: "child",
                    childGroups: ["constraints"],
                    variableNames: ["independentComponentConstraints"],
                },
            }),
            definition: ({ dependencyValues }) => ({
                setValue: {
                    independentConstraints:
                        dependencyValues.constraintChildren.every(
                            (child) =>
                                child.stateValues
                                    .independentComponentConstraints,
                        ),
                },
            }),
        };

        for (let n = 1; n <= NUM_COORDINATE_ARRAYS; n++) {
            stateVariableDefinitions[`entryCoordinates${n}`] =
                coordinateArrayDefinition({ n, arrayName });
        }

        // The style of the entries, with the marker style and size the
        // template set.
        Object.assign(
            stateVariableDefinitions,
            returnSelectedStyleStateVariableDefinition({
                overrideAttributeNames:
                    GraphicalComponent.returnStyleOverrideGroups
                        .call(this)
                        .flatMap((group) => Object.keys(group)),
            }),
        );

        return stateVariableDefinitions;
    }
}

Object.assign(RepeatPointList, REPEAT_LIST_STATICS);

/**
 * The array of coordinate `n` (from 1) of each entry: the template's
 * coordinate `n` at the entry's index, computed from what that coordinate
 * reads alone, and constrained coordinate by coordinate, when every
 * constraint is independent by coordinate (`independentConstraints`), as a
 * point constrains it (`returnConstraintDefinitions`). Otherwise it is the
 * coordinate of the whole entry (`arrayName`). A value written to it is
 * constrained as a point constrains a value written to one coordinate, and
 * written through that coordinate of the template alone: by coordinate, or,
 * when the constraints are not by coordinate, with the entry's other
 * coordinates, by writing the entry with only this coordinate specified
 * (`entryValuesDefinition`).
 */
/**
 * The constant codes coordinate `n` of the template reads, in order, the
 * children of the list's `constants` it depends on.
 */
function constantCodesOf(templateAnalysis, n) {
    const node = templateAnalysis.nodes[0]?.codes[n - 1]?.node;
    return node === undefined ? [] : templateAnalysis.nodes[node].constantCodes;
}

/**
 * `globalDependencyValues` of coordinate `n`, whose `constants` hold only
 * the constants it reads, with each at its code, as the template reads them.
 */
function withConstantsByCode(globalDependencyValues, n) {
    const constants = [];
    constantCodesOf(globalDependencyValues.templateAnalysis, n).forEach(
        (c, i) => {
            constants[c] = globalDependencyValues.constants[i];
        },
    );
    return { ...globalDependencyValues, constants };
}

function coordinateArrayDefinition({ n, arrayName }) {
    const name = `entryCoordinates${n}`;
    const variable = `x${n}`;
    const blank = () => me.fromAst("\uff3f");

    function applyComponentConstraints(value, constraintChildren) {
        let variables = { [variable]: value };
        for (const constraintChild of constraintChildren) {
            const result =
                constraintChild.stateValues.applyComponentConstraint(variables);
            if (result.constrained) {
                variables = {
                    [variable]: convertValueToMathExpression(
                        result.variables[variable],
                    ),
                };
            }
        }
        return variables[variable];
    }

    return {
        isArray: true,
        entryPrefixes: [`entryCoordinate${n}_`],
        // A reference to the whole list (a polygon's `vertices="$Ps"`)
        // reads the list's: it holds no template to compute them from.
        shadowVariable: true,
        // a reference to the coordinates of every entry (`$Ps.x`) is a math
        // for each
        shadowingInstructions: {
            createComponentOfType: "math",
        },
        stateVariablesDeterminingDependencies: [
            "templateAnalysis",
            "entryListPrefixes",
            "independentConstraints",
            "evaluateSymbolically",
        ],
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
        // Points with fewer coordinates have none here, as an iteration's
        // point had no `y` to read (`$Ps.y` of points `(x)` shows nothing).
        returnArraySize({ dependencyValues }) {
            return [
                n <= dependencyValues.numDimensions
                    ? dependencyValues.numEntries
                    : 0,
            ];
        },
        returnArrayDependenciesByKey({ arrayKeys, stateValues }) {
            const { templateAnalysis, entryListPrefixes } = stateValues;
            const coordinateNode =
                templateAnalysis.nodes[0]?.codes[n - 1]?.node;
            const globalDependencies = {
                ...evaluatorDependencies({
                    templateAnalysis,
                    evaluateSymbolically: stateValues.evaluateSymbolically,
                    evaluateNodes:
                        coordinateNode === undefined
                            ? []
                            : templateAnalysis.nodes[coordinateNode]
                                  .evaluateNodes,
                }),
                templateAnalysis: {
                    dependencyType: "stateVariable",
                    variableName: "templateAnalysis",
                },
                // What decides whether a write is taken is read only when
                // one is (`readWritability`). Only the values the coordinate
                // reads, so that one read only by another coordinate can read
                // this one (`$Ps.x` in the template's `y`).
                constants: {
                    dependencyType: "child",
                    childGroups: ["constants"],
                    childIndices: constantCodesOf(templateAnalysis, n),
                    variableNames: ["value"],
                    variablesOptional: true,
                },
                constraintChildren: {
                    dependencyType: "child",
                    childGroups: ["constraints"],
                    variableNames: [
                        "applyConstraint",
                        "applyComponentConstraint",
                    ],
                    variablesOptional: true,
                },
                independentConstraints: {
                    dependencyType: "stateVariable",
                    variableName: "independentConstraints",
                },
            };
            const dependenciesByKey = {};
            for (const arrayKey of arrayKeys) {
                const index = Number(arrayKey) + 1;
                const dependencies = {};
                if (!stateValues.independentConstraints) {
                    // the coordinate is read from, and written to, the
                    // constrained entry
                    dependencies.entry = {
                        dependencyType: "stateVariable",
                        variableName: `pointValue${index}`,
                    };
                } else if (coordinateNode !== undefined) {
                    // what the coordinate is written through
                    dependencies.write = {
                        dependencyType: "stateVariable",
                        variableName: `entryWrite${index}`,
                    };
                    for (const e of templateAnalysis.nodes[coordinateNode]
                        .entryCodes) {
                        dependencies[`entry${e}`] = entryCodeDependency({
                            templateAnalysis,
                            entryListPrefixes,
                            e,
                            index,
                        });
                    }
                }
                dependenciesByKey[arrayKey] = dependencies;
            }
            return { globalDependencies, dependenciesByKey };
        },
        arrayDefinitionByKey({
            globalDependencyValues,
            dependencyValuesByKey,
            arrayKeys,
        }) {
            const coordinateNode =
                globalDependencyValues.templateAnalysis.nodes[0]?.codes[n - 1]
                    ?.node;
            const values = {};
            for (const arrayKey of arrayKeys) {
                const dependencyValues = dependencyValuesByKey[arrayKey];
                if (!globalDependencyValues.independentConstraints) {
                    values[arrayKey] =
                        coordinatesOf(dependencyValues.entry)[n - 1] ?? blank();
                } else if (coordinateNode === undefined) {
                    values[arrayKey] = blank();
                } else {
                    // simplified, as a point's coordinates are
                    const value = convertValueToMathExpression(
                        evaluateRepeatTemplate({
                            ...templateContext({
                                globalDependencyValues: withConstantsByCode(
                                    globalDependencyValues,
                                    n,
                                ),
                                dependencyValues,
                            }),
                            ind: coordinateNode,
                        }),
                    ).simplify();
                    values[arrayKey] = applyComponentConstraints(
                        value,
                        globalDependencyValues.constraintChildren,
                    );
                }
            }
            return { setValue: { [name]: values } };
        },
        async inverseArrayDefinitionByKey({
            desiredStateVariableValues,
            globalDependencyValues,
            dependencyValuesByKey,
            dependencyNamesByKey,
            stateValues,
        }) {
            if (await stateValues.entriesFixed) {
                return { success: false };
            }
            const coordinateNode =
                globalDependencyValues.templateAnalysis.nodes[0]?.codes[n - 1]
                    ?.node;
            const instructions = [];
            for (const [arrayKey, desired] of Object.entries(
                desiredStateVariableValues[name],
            )) {
                const dependencyValues = dependencyValuesByKey[arrayKey];
                if (!dependencyValues || coordinateNode === undefined) {
                    continue;
                }
                const value = convertValueToMathExpression(desired);
                if (!globalDependencyValues.independentConstraints) {
                    // As a point does: the entry is written with this
                    // coordinate alone specified, so that the coordinates
                    // written in one update are constrained together
                    // (`writingSpecifiedCoordinates`).
                    const coordinates = coordinatesOf(
                        dependencyValues.entry,
                    ).map(() => me.fromAst(UNSPECIFIED_COMPONENT));
                    coordinates[n - 1] = value;
                    instructions.push({
                        setDependency: dependencyNamesByKey[arrayKey].entry,
                        desiredValue: vectorOf(coordinates),
                    });
                    continue;
                }
                const constantCodes = constantCodesOf(
                    globalDependencyValues.templateAnalysis,
                    n,
                );
                const written = writeThroughTemplate({
                    globalDependencyValues: withConstantsByCode(
                        globalDependencyValues,
                        n,
                    ),
                    constantChildIndex: (c) => constantCodes.indexOf(c),
                    dependencyValues,
                    writability: await readWritability(stateValues),
                    dependencyNames: dependencyNamesByKey[arrayKey],
                    desiredValue: applyComponentConstraints(
                        value,
                        globalDependencyValues.constraintChildren,
                    ),
                    ind: coordinateNode,
                });
                if (!written.success) {
                    return { success: false };
                }
                instructions.push(...written.instructions);
            }
            return { success: true, instructions };
        },
    };
}

/**
 * The instructions writing `desiredValue` through node `ind` of the template,
 * for one entry, whose dependencies are `dependencyValues`
 * (`dependencyNames`): the entry's copy of the template's text, and the
 * entries and values the node reads. `texts` holds the entry's texts written
 * earlier in the same write, and `writability` what decides whether a write
 * is taken (`readWritability`). `constantChildIndex` gives the child of the
 * `constants` dependency that holds a constant code.
 */
function writeThroughTemplate({
    globalDependencyValues,
    constantChildIndex = (c) => c,
    dependencyValues,
    dependencyNames,
    desiredValue,
    ind,
    writability,
    texts = dependencyValues.write,
}) {
    const inverse = invertRepeatTemplate({
        ...templateContext({
            globalDependencyValues,
            dependencyValues,
            writability,
        }),
        desiredValue,
        ind,
    });
    if (!inverse.success) {
        return { success: false };
    }
    const instructions = [];
    if (Object.keys(inverse.texts).length > 0) {
        instructions.push({
            setDependency: dependencyNames.write,
            desiredValue: { ...texts, ...inverse.texts },
        });
    }
    for (const { code, desiredValue } of inverse.writes) {
        instructions.push(
            code.entry !== undefined
                ? {
                      setDependency: dependencyNames[`entry${code.entry}`],
                      desiredValue,
                  }
                : {
                      setDependency: "constants",
                      desiredValue,
                      childIndex: constantChildIndex(code.constant),
                      variableIndex: 0,
                  },
        );
    }
    return { success: true, texts: inverse.texts, instructions };
}

/**
 * The entries' values: the template's point at each index
 * (`repeatTemplateEntriesDefinition`), with the list's dimensions and
 * constraints (`graphicalEntryValuesDefinition`).
 *
 * An entry written with some coordinates unspecified has only the
 * coordinates specified in the update written, as a point writes only the
 * coordinates written to it. A coordinate array writes its coordinate this
 * way when the constraints are not by coordinate: the unspecified coordinates
 * are filled in from the entry's value, or those written earlier in the same
 * update, and the whole entry is constrained, so that two coordinates written
 * in one update (a point copying `$Ps[2].P.x` and `$Ps[2].P.y`, dragged) are
 * constrained together. Each coordinate specified so far in the update is
 * then written through its own node of the template; the others keep their
 * values.
 */
function entryValuesDefinition({ listClass, baseValues }) {
    const arrayName = listClass.listValuesArrayName;
    const templateValues = repeatTemplateEntriesDefinition({
        baseValues,
        arrayName,
        entryType: "point",
    });
    const values = graphicalEntryValuesDefinition({
        listClass,
        baseValues: {
            ...templateValues,
            async inverseArrayDefinitionByKey(args) {
                const specified = args.workspace.specifiedCoordinates ?? {};
                const desired = args.desiredStateVariableValues[arrayName];
                const whole = {};
                const partial = [];
                for (const arrayKey in desired) {
                    if (specified[arrayKey]?.includes(false)) {
                        partial.push(arrayKey);
                    } else {
                        whole[arrayKey] = desired[arrayKey];
                    }
                }
                if (partial.length === 0) {
                    return templateValues.inverseArrayDefinitionByKey(args);
                }
                if (await args.stateValues.entriesFixed) {
                    return { success: false };
                }
                const instructions = [];
                if (Object.keys(whole).length > 0) {
                    const result =
                        await templateValues.inverseArrayDefinitionByKey({
                            ...args,
                            desiredStateVariableValues: {
                                ...args.desiredStateVariableValues,
                                [arrayName]: whole,
                            },
                        });
                    if (!result.success) {
                        return result;
                    }
                    instructions.push(...result.instructions);
                }
                const { globalDependencyValues } = args;
                const writability = await readWritability(args.stateValues);
                const codes =
                    globalDependencyValues.templateAnalysis.nodes[0]?.codes ??
                    [];
                for (const arrayKey of partial) {
                    const dependencyValues =
                        args.dependencyValuesByKey[arrayKey];
                    if (!dependencyValues) {
                        continue;
                    }
                    const coordinates = coordinatesOf(desired[arrayKey]);
                    let texts = dependencyValues.write;
                    for (const [i, isSpecified] of specified[
                        arrayKey
                    ].entries()) {
                        if (!isSpecified || codes[i] === undefined) {
                            continue;
                        }
                        const written = writeThroughTemplate({
                            globalDependencyValues,
                            dependencyValues,
                            writability,
                            dependencyNames:
                                args.dependencyNamesByKey[arrayKey],
                            desiredValue: coordinates[i],
                            ind: codes[i].node,
                            texts,
                        });
                        if (!written.success) {
                            return { success: false };
                        }
                        texts = { ...texts, ...written.texts };
                        instructions.push(...written.instructions);
                    }
                }
                return { success: true, instructions };
            },
        },
    });
    return {
        ...values,
        async inverseArrayDefinitionByKey(args) {
            const { numDimensions } = args.globalDependencyValues;
            if (!args.workspace.specifiedCoordinates) {
                args.workspace.specifiedCoordinates = {};
            }
            const specified = args.workspace.specifiedCoordinates;
            for (const [arrayKey, value] of Object.entries(
                args.desiredStateVariableValues[arrayName],
            )) {
                const coordinates = coordinatesOf(coordinatesValue(value));
                specified[arrayKey] = Array.from(
                    { length: numDimensions },
                    (_, i) =>
                        specified[arrayKey]?.[i] === true ||
                        i >= coordinates.length ||
                        !isUnspecifiedComponentValue(coordinates[i]),
                );
            }
            return values.inverseArrayDefinitionByKey(args);
        },
    };
}
