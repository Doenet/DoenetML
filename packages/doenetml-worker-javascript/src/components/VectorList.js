import GraphicalValueList, {
    coordinatesOf,
    coordinatesValue,
    hasUnspecifiedCoordinate,
    withSpecifiedCoordinates,
    numericalCoordinates,
    vectorOf,
    withNumDimensions,
} from "./abstract/GraphicalValueList";
import me from "math-expressions";
import {
    convertValueToMathExpression,
    returnGraphicalStyleDescriptionDefinitions,
} from "@doenet/utils";

/**
 * A list of vectors, held as the math of each vector's displacement
 * (`vectorDisplacements`) and of its tail (`entryTails`), with its head
 * their sum, which a parent reads, and the viewer draws, as one vector per
 * entry, dragged entry by entry (Doenet/DoenetML#2162).
 *
 * An entry the list reads from text (`(1, 2)`) is a displacement, with its
 * tail at the origin until its tail is moved; the list keeps a tail written to
 * it with the text it came from (`pieceTailWrites`). An entry from an
 * authored `<vector>` has the vector's tail and head, and a drag of it is a
 * drag of that vector.
 */
export default class VectorList extends GraphicalValueList {
    constructor(args) {
        super(args);

        Object.assign(this.actions, {
            moveVector: this.moveVector.bind(this),
            moveVectorSinglePoint: this.moveVectorSinglePoint.bind(this),
            vectorClicked: this.vectorClicked.bind(this),
            vectorFocused: this.vectorFocused.bind(this),
        });
    }

    static componentType = "vectorList";

    static componentDocs = {
        summary: "A list of vectors",
    };

    static listEntryComponentType = "vector";

    static allowInSchemaAsComponent = ["vector"];

    static listChildGroups = [
        {
            group: "vectors",
            componentTypes: ["vector"],
        },
    ];

    static stateVariableToBeShadowed = "vectors";
    static primaryStateVariableForDefinition = "vectorsShadow";

    static listValuesEntryPrefix = "vectorValue";

    static coordinatesArrayName = "vectors";
    static coordinatesArrayPrefix = "vectorX";

    static get listEntryChildRendererVariables() {
        return [
            ...super.listEntryChildRendererVariables,
            "headDraggable",
            "tailDraggable",
        ];
    }

    static get listEntryDragAttributes() {
        return [
            ...super.listEntryDragAttributes,
            "headDraggable",
            "tailDraggable",
        ];
    }

    static get listEntryRendererDefaults() {
        return {
            ...super.listEntryRendererDefaults,
            labelPosition: () => "center",
            headDraggable: () => true,
            tailDraggable: () => true,
        };
    }

    static returnEntryStyleDescriptionDefinitions() {
        return {
            ...super.returnEntryStyleDescriptionDefinitions(),
            ...returnGraphicalStyleDescriptionDefinitions({
                kind: "stroke",
                noun: "vector",
            }),
        };
    }

    static buildListEntryStateVariables() {
        const variables = super.buildListEntryStateVariables();
        variables.displacementCoords = this.listValuesArrayName;
        variables.tail = "entryTails";
        variables.head = "entryHeads";
        variables.numericalEndpoints = "entryNumericalEndpoints";
        variables.nearestPoint = "entryNearestPoints";
        return variables;
    }

    static get listPerEntryVariables() {
        return [
            ...super.listPerEntryVariables,
            "entryTails",
            "entryHeads",
            "entryNumericalEndpoints",
            "entryNearestPoints",
        ];
    }

    // An entry's displacement (`$vl[2].displacement`), shown as a vector's
    // is, and its magnitude, as a vector's.
    static get listEntryDerivedProperties() {
        return {
            ...super.listEntryDerivedProperties,
            displacement: {
                from: "value",
                componentType: "math",
                companionsOf: "displacement",
                compute: (value) => value,
                invert: (value) => value,
            },
            magnitude: {
                from: "value",
                componentType: "math",
                compute: magnitudeOf,
                writeThrough: "entryEndpointWrites",
                writeThroughValue: (magnitude) => ({ magnitude }),
            },
        };
    }

    // A coordinate of an entry's head or tail (`$vl[2].headX1`,
    // `$vl[2].tail[2]`), as a vector's, besides the properties listed.
    static derivedEntryProperty(name) {
        const derived = super.derivedEntryProperty(name);
        if (derived !== undefined) {
            return derived;
        }
        const match = /^(head|tail)X([1-9]\d*)$/.exec(name);
        if (match) {
            return endpointCoordinateProperty(match[1], Number(match[2]));
        }
        return undefined;
    }

    async serialize(parameters = {}) {
        const serialized = await super.serialize(parameters);
        if (parameters.copyAll && !parameters.serializingDescendant) {
            serialized.state.tailsShadow = [
                ...(await this.stateValues.entryTails),
            ];
        }
        return serialized;
    }

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        const arrayName = this.listValuesArrayName;
        const componentGroups = this.listChildGroups.map((x) => x.group);

        // A copy of an entry (`$vl[2]`) has the entry's tail.
        const shadowing =
            stateVariableDefinitions[arrayName].shadowingInstructions;
        stateVariableDefinitions[arrayName].shadowingInstructions = {
            ...shadowing,
            addAttributeComponentsShadowingStateVariables: {
                ...shadowing.addAttributeComponentsShadowingStateVariables,
                tail: { stateVariableToShadow: "entryTails" },
            },
        };

        stateVariableDefinitions.numVectors = {
            isAlias: true,
            targetVariableName: "numComponents",
            description: "The number of vectors in the list.",
        };

        // A tail written to an entry the list reads from text, by where the
        // text's written values are kept (`textPieceWriteKeys`).
        stateVariableDefinitions.pieceTailWrites = {
            hasEssential: true,
            defaultValue: {},
            returnDependencies: () => ({}),
            definition: () => ({
                useEssentialOrDefaultValue: { pieceTailWrites: true },
            }),
            inverseDefinition: ({ desiredStateVariableValues }) => ({
                success: true,
                instructions: [
                    {
                        setEssentialValue: "pieceTailWrites",
                        value: desiredStateVariableValues.pieceTailWrites,
                    },
                ],
            }),
        };

        // The tails of the vectors a `copy=` of the list holds the
        // displacements of (`serializeUnlinkedAsValues`).
        stateVariableDefinitions.tailsShadow = {
            hasEssential: true,
            defaultValue: null,
            returnDependencies: () => ({}),
            definition: () => ({
                useEssentialOrDefaultValue: { tailsShadow: true },
            }),
            inverseDefinition: ({ desiredStateVariableValues }) => ({
                success: true,
                instructions: [
                    {
                        setEssentialValue: "tailsShadow",
                        value: desiredStateVariableValues.tailsShadow,
                    },
                ],
            }),
        };

        // The tail and head of each entry from an authored child, as the
        // child has them; `null` for another entry. A reference to the
        // whole list reads the list's.
        stateVariableDefinitions.entryChildEndpoints = {
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
                        "tail",
                        "head",
                        "displacement",
                        "basedOnHead",
                        "basedOnTail",
                        "basedOnDisplacement",
                        "displacementCoords",
                    ],
                    variablesOptional: true,
                },
            }),
            definition: ({ dependencyValues }) => ({
                setValue: {
                    entryChildEndpoints: dependencyValues.entryStructure.map(
                        (source) => {
                            const child =
                                source.componentInd === undefined
                                    ? undefined
                                    : dependencyValues.children[
                                          source.componentInd
                                      ];
                            if (child?.stateValues.tail === undefined) {
                                return null;
                            }
                            return {
                                tail: coordinatesValue(child.stateValues.tail),
                                head: coordinatesValue(child.stateValues.head),
                            };
                        },
                    ),
                },
            }),
            // A tail or displacement written to an entry from a child
            // (`{ [index]: { tail, displacement } }`, either one left out
            // when it is not written) is written to the child. A `<vector>`
            // is written the variables it is defined by (`basedOnHead`, …),
            // each computed from the tail and displacement written, as a drag
            // of the vector writes them (`Vector.moveVector`), so that none
            // is computed from another's value from before the write. The
            // entry of a list among the children (a `copy=` of a list holds
            // one) is written its tail and its displacement.
            inverseDefinition({
                desiredStateVariableValues,
                dependencyValues,
                workspace,
            }) {
                // The tail and the displacement of one write come one at a
                // time, from `entryTails` and the values; each is kept here
                // until the write is done.
                if (!workspace.written) {
                    workspace.written = {};
                }
                const instructions = [];
                for (const [key, desired] of Object.entries(
                    desiredStateVariableValues.entryChildEndpoints,
                )) {
                    const written = (workspace.written[key] = {
                        ...workspace.written[key],
                        ...desired,
                    });
                    const componentInd =
                        dependencyValues.entryStructure[Number(key)]
                            ?.componentInd;
                    const child = dependencyValues.children[componentInd];
                    if (!child) {
                        continue;
                    }
                    const write = (variableIndex, value) =>
                        instructions.push({
                            setDependency: "children",
                            desiredValue:
                                child.listEntryIndex === undefined
                                    ? coordinatesOf(value)
                                    : value,
                            childIndex: componentInd,
                            variableIndex,
                        });
                    if (child.stateValues.basedOnHead === undefined) {
                        if (written.tail !== undefined) {
                            write(0, written.tail);
                        }
                        if (written.displacement !== undefined) {
                            write(6, written.displacement);
                        }
                        continue;
                    }
                    for (const [variableIndex, value] of writesToVector(
                        written,
                        child.stateValues,
                    )) {
                        write(variableIndex, value);
                    }
                }
                return { success: true, instructions };
            },
        };

        // A displacement written to an entry from a `<vector>` among the
        // children is written with its tail (`entryChildEndpoints`).
        stateVariableDefinitions[arrayName] = withDisplacementsWrittenWithTails(
            stateVariableDefinitions[arrayName],
            arrayName,
        );

        // The tail of each entry: the child's, the one written to it, the
        // one a `copy=` holds, or the origin. It travels with the entry, so
        // a copy of one (`<vector extend="$vl[2]"/>`) has its tail.
        stateVariableDefinitions.entryTails = {
            isArray: true,
            isLocation: true,
            entryPrefixes: ["entryTail"],
            companionOfEachEntry: true,
            // A reference to the whole list reads the list's.
            shadowVariable: true,
            shadowingInstructions: {
                createComponentOfType: "math",
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
                    entryStructure: {
                        dependencyType: "stateVariable",
                        variableName: "entryStructure",
                    },
                    entryChildEndpoints: {
                        dependencyType: "stateVariable",
                        variableName: "entryChildEndpoints",
                    },
                    pieceTailWrites: {
                        dependencyType: "stateVariable",
                        variableName: "pieceTailWrites",
                    },
                    tailsShadow: {
                        dependencyType: "stateVariable",
                        variableName: "tailsShadow",
                    },
                    numDimensions: {
                        dependencyType: "stateVariable",
                        variableName: "numDimensions",
                    },
                },
            }),
            arrayDefinitionByKey({ globalDependencyValues, arrayKeys }) {
                const entryTails = {};
                for (const arrayKey of arrayKeys) {
                    entryTails[arrayKey] = entryTail(
                        globalDependencyValues,
                        Number(arrayKey),
                    );
                }
                return { setValue: { entryTails } };
            },
            inverseArrayDefinitionByKey({
                desiredStateVariableValues,
                globalDependencyValues,
                workspace,
            }) {
                const { entryStructure, entryChildEndpoints, numDimensions } =
                    globalDependencyValues;
                const pieceTailWrites = {
                    ...globalDependencyValues.pieceTailWrites,
                };
                let tailsShadow = globalDependencyValues.tailsShadow;
                const childTails = {};
                let wrotePiece = false;
                let wroteShadow = false;
                for (const [key, value] of Object.entries(
                    desiredStateVariableValues.entryTails,
                )) {
                    const ind = Number(key);
                    const source = entryStructure[ind];
                    if (!source) {
                        continue;
                    }
                    // A coordinate the write leaves unspecified keeps the
                    // value it has, or was given earlier in the same write.
                    if (!workspace.writtenTails) {
                        workspace.writtenTails = {};
                    }
                    let tail = withNumDimensions(
                        coordinatesValue(convertValueToMathExpression(value)),
                        numDimensions,
                    );
                    if (hasUnspecifiedCoordinate(tail)) {
                        tail = withSpecifiedCoordinates(
                            tail,
                            workspace.writtenTails[ind] ??
                                entryTail(globalDependencyValues, ind),
                        );
                    }
                    workspace.writtenTails[ind] = tail;
                    if (entryChildEndpoints[ind] !== null) {
                        childTails[ind] = tail;
                    } else if (source.writeKey !== undefined) {
                        pieceTailWrites[source.writeKey] = tail;
                        wrotePiece = true;
                    } else if (source.shadowInd !== undefined) {
                        tailsShadow = [...(tailsShadow ?? [])];
                        tailsShadow[source.shadowInd] = tail;
                        wroteShadow = true;
                    }
                }
                const instructions = [];
                if (Object.keys(childTails).length > 0) {
                    instructions.push({
                        setDependency: "entryChildEndpoints",
                        desiredValue: Object.fromEntries(
                            Object.entries(childTails).map(([ind, tail]) => [
                                ind,
                                { tail },
                            ]),
                        ),
                    });
                }
                if (wrotePiece) {
                    instructions.push({
                        setDependency: "pieceTailWrites",
                        desiredValue: pieceTailWrites,
                    });
                }
                if (wroteShadow) {
                    instructions.push({
                        setDependency: "tailsShadow",
                        desiredValue: tailsShadow,
                    });
                }
                return { success: true, instructions };
            },
        };

        // The head of each entry: the child's, or its tail plus its
        // displacement. A head written to an entry not from a child moves
        // its displacement and keeps its tail.
        stateVariableDefinitions.entryHeads = {
            isLocation: true,
            returnDependencies: () => ({
                entryChildEndpoints: {
                    dependencyType: "stateVariable",
                    variableName: "entryChildEndpoints",
                },
                entryTails: {
                    dependencyType: "stateVariable",
                    variableName: "entryTails",
                },
                values: {
                    dependencyType: "stateVariable",
                    variableName: arrayName,
                },
                numDimensions: {
                    dependencyType: "stateVariable",
                    variableName: "numDimensions",
                },
            }),
            definition: ({ dependencyValues }) => ({
                setValue: {
                    entryHeads: dependencyValues.entryTails.map((tail, ind) => {
                        const childHead =
                            dependencyValues.entryChildEndpoints[ind]?.head;
                        if (childHead !== undefined) {
                            return withNumDimensions(
                                childHead,
                                dependencyValues.numDimensions,
                            );
                        }
                        return sumOf(tail, dependencyValues.values[ind]);
                    }),
                },
            }),
            inverseDefinition({
                desiredStateVariableValues,
                dependencyValues,
            }) {
                const desiredValue = {};
                for (const [key, value] of Object.entries(
                    desiredStateVariableValues.entryHeads,
                )) {
                    const ind = Number(key);
                    if (dependencyValues.entryTails[ind] === undefined) {
                        continue;
                    }
                    desiredValue[ind] = differenceOf(
                        convertValueToMathExpression(value),
                        dependencyValues.entryTails[ind],
                    );
                }
                return {
                    success: true,
                    instructions: [{ setDependency: "values", desiredValue }],
                };
            },
        };

        // The tail and head of each entry as numbers, which its renderer
        // draws.
        stateVariableDefinitions.entryNumericalEndpoints = {
            returnDependencies: () => ({
                entryTails: {
                    dependencyType: "stateVariable",
                    variableName: "entryTails",
                },
                entryHeads: {
                    dependencyType: "stateVariable",
                    variableName: "entryHeads",
                },
                numDimensions: {
                    dependencyType: "stateVariable",
                    variableName: "numDimensions",
                },
            }),
            definition: ({ dependencyValues }) => ({
                setValue: {
                    entryNumericalEndpoints: dependencyValues.entryTails.map(
                        (tail, ind) => {
                            const endpoints = [
                                numericalCoordinates(tail),
                                numericalCoordinates(
                                    dependencyValues.entryHeads[ind],
                                ),
                            ];
                            // a vector in one dimension has numbers for
                            // endpoints, as for a `<vector>`
                            return dependencyValues.numDimensions === 1
                                ? endpoints.map((x) => x[0])
                                : endpoints;
                        },
                    ),
                },
            }),
        };

        // For each entry, the point of it nearest to a given point, as for
        // a `<vector>`: in two dimensions, with numbers for endpoints.
        stateVariableDefinitions.entryNearestPoints = {
            returnDependencies: () => ({
                entryNumericalEndpoints: {
                    dependencyType: "stateVariable",
                    variableName: "entryNumericalEndpoints",
                },
                numDimensions: {
                    dependencyType: "stateVariable",
                    variableName: "numDimensions",
                },
            }),
            definition: ({ dependencyValues }) => ({
                setValue: {
                    entryNearestPoints:
                        dependencyValues.entryNumericalEndpoints.map(
                            (endpoints) =>
                                nearestPointOfSegment(
                                    endpoints,
                                    dependencyValues.numDimensions,
                                ),
                        ),
                },
            }),
        };

        // Where a write to a coordinate of an entry's head or tail
        // (`$vl[2].headX1`, through `endpointCoordinateProperty`) or to its
        // magnitude is gathered, and written as a vector writes them: a
        // coordinate of the tail moves the tail and keeps the displacement,
        // one of the head keeps the tail, and the magnitude scales the
        // displacement. One write can set several coordinates of an entry,
        // each through an array of its own, and the entry takes them
        // together.
        stateVariableDefinitions.entryEndpointWrites = {
            returnDependencies: () => ({
                values: {
                    dependencyType: "stateVariable",
                    variableName: arrayName,
                },
                entryTails: {
                    dependencyType: "stateVariable",
                    variableName: "entryTails",
                },
                entryHeads: {
                    dependencyType: "stateVariable",
                    variableName: "entryHeads",
                },
            }),
            definition: () => ({
                setValue: { entryEndpointWrites: null },
            }),
            inverseDefinition({
                desiredStateVariableValues,
                dependencyValues,
                workspace,
            }) {
                if (!workspace.endpointCoordinates) {
                    workspace.endpointCoordinates = { tail: {}, head: {} };
                }
                const desired = { tail: {}, head: {}, values: {} };
                for (const [key, write] of Object.entries(
                    desiredStateVariableValues.entryEndpointWrites,
                )) {
                    for (const endpoint of ["tail", "head"]) {
                        if (write[endpoint] === undefined) {
                            continue;
                        }
                        const written = {
                            ...workspace.endpointCoordinates[endpoint][key],
                            ...write[endpoint],
                        };
                        workspace.endpointCoordinates[endpoint][key] = written;
                        const current = coordinatesOf(
                            dependencyValues[
                                endpoint === "tail"
                                    ? "entryTails"
                                    : "entryHeads"
                            ][key],
                        );
                        desired[endpoint][key] = vectorOf(
                            current.map((x, i) =>
                                written[i + 1] === undefined
                                    ? x
                                    : convertValueToMathExpression(
                                          written[i + 1],
                                      ),
                            ),
                        );
                    }
                    if (write.magnitude !== undefined) {
                        const displacement = coordinatesOf(
                            dependencyValues.values[key],
                        ).map((x) => x.evaluate_to_constant());
                        const length = Math.sqrt(
                            displacement.reduce((a, x) => a + x * x, 0),
                        );
                        const magnitude = convertValueToMathExpression(
                            write.magnitude,
                        ).evaluate_to_constant();
                        if (
                            !displacement.every(Number.isFinite) ||
                            !(length > 0) ||
                            !Number.isFinite(magnitude) ||
                            magnitude < 0
                        ) {
                            return { success: false };
                        }
                        desired.values[key] = vectorOf(
                            displacement.map((x) =>
                                me.fromAst((x / length) * magnitude),
                            ),
                        );
                    }
                }
                const instructions = [];
                for (const [dependency, desiredValue] of [
                    ["entryTails", desired.tail],
                    ["entryHeads", desired.head],
                    ["values", desired.values],
                ]) {
                    if (Object.keys(desiredValue).length > 0) {
                        instructions.push({
                            setDependency: dependency,
                            desiredValue,
                        });
                    }
                }
                return { success: true, instructions };
            },
        };

        return stateVariableDefinitions;
    }

    async moveVectorSinglePoint({ x, y, pointRole, ...args }) {
        if (!Number.isFinite(x) || !Number.isFinite(y)) {
            console.warn(
                `Invalid vector point coordinates: x=${x}, y=${y}, role=${pointRole}`,
            );
            return;
        }
        if (pointRole === "head") {
            return await this.moveVector({ ...args, headcoords: [x, y] });
        } else if (pointRole === "tail") {
            return await this.moveVector({ ...args, tailcoords: [x, y] });
        } else if (pointRole === "displacement") {
            return await this.moveVector({ ...args, displacement: [x, y] });
        }
        console.warn(`Invalid pointRole for vector: ${pointRole}`);
    }

    /**
     * A drag of the renderer of entry `listEntryIndex`: of its head, its
     * tail, or the whole vector (both), or a new displacement. An entry
     * from a child is the child's drag. Otherwise a dragged tail keeps the
     * head where it was, and a dragged head the tail.
     */
    async moveVector({
        tailcoords,
        headcoords,
        displacement,
        listEntryIndex,
        ...args
    }) {
        const child = (await this.stateValues.entryChildren)[listEntryIndex];
        if (child) {
            const { componentIdx: _, ...childArgs } = args;
            return await this.coreFunctions.performAction({
                componentIdx: child.componentIdx,
                actionName: "moveVector",
                args: {
                    ...childArgs,
                    tailcoords,
                    headcoords,
                    displacement,
                    ...(child.listEntryIndex === undefined
                        ? {}
                        : { listEntryIndex: child.listEntryIndex }),
                },
            });
        }

        const draggableVariable =
            tailcoords !== undefined
                ? headcoords !== undefined
                    ? "draggable"
                    : "tailDraggable"
                : "headDraggable";
        if (
            !(await this.entryCanBeDragged(listEntryIndex, draggableVariable))
        ) {
            return;
        }

        const arrayName = this.constructor.listValuesArrayName;
        const tail = (await this.stateValues.entryTails)[listEntryIndex];
        const head = (await this.stateValues.entryHeads)[listEntryIndex];

        // A drag gives the coordinates it moves (two, in a graph); the
        // others keep their values, as for a `<vector>`.
        const values = {};
        let newTail = tail;
        if (tailcoords !== undefined) {
            newTail = withCoordinates(tail, tailcoords);
            values.entryTails = newTail;
        }
        if (headcoords !== undefined) {
            values[arrayName] = differenceOf(
                withCoordinates(head, headcoords),
                newTail,
            );
        } else if (tailcoords !== undefined) {
            values[arrayName] = differenceOf(head, newTail);
        } else if (displacement !== undefined) {
            values[arrayName] = withCoordinates(
                (await this.stateValues[arrayName])[listEntryIndex],
                displacement,
            );
        } else {
            return;
        }

        return await this.writeEntryFromAction({
            ...args,
            listEntryIndex,
            values,
            result: {
                head: headcoords,
                tail: tailcoords,
                ...(displacement === undefined ? {} : { displacement }),
            },
        });
    }

    async vectorClicked(args) {
        await this.performOnEntryChild({
            actionName: "vectorClicked",
            triggeringAction: "click",
            args,
        });
    }

    async vectorFocused(args) {
        await this.performOnEntryChild({
            actionName: "vectorFocused",
            triggeringAction: "focus",
            args,
        });
    }
}

/**
 * The tail of entry `ind`, from `entryTails`'s dependencies: the child's,
 * the one written to it, the one a `copy=` holds, or the origin, with the
 * list's number of dimensions.
 */
function entryTail(
    {
        entryStructure,
        entryChildEndpoints,
        pieceTailWrites,
        tailsShadow,
        numDimensions,
    },
    ind,
) {
    const source = entryStructure[ind];
    let tail = entryChildEndpoints[ind]?.tail;
    if (tail === undefined) {
        const written =
            source?.writeKey !== undefined
                ? pieceTailWrites[source.writeKey]
                : source?.shadowInd !== undefined
                  ? tailsShadow?.[source.shadowInd]
                  : undefined;
        tail =
            written === undefined || written === null
                ? me.fromAst(0)
                : coordinatesValue(written);
    }
    return withNumDimensions(tail, numDimensions);
}

/**
 * `value`, a math of coordinates, with its first coordinates the numbers
 * `numbers` and the rest as they are.
 */
function withCoordinates(value, numbers) {
    const coordinates = coordinatesOf(value);
    return vectorOf(
        numbers.length >= coordinates.length
            ? numbers.map((x) => me.fromAst(x))
            : coordinates.map((x, i) =>
                  i < numbers.length ? me.fromAst(numbers[i]) : x,
              ),
    );
}

/**
 * `values`, the definition of the values (displacements) of a vector list,
 * with a displacement written to an entry that has a tail and head of its
 * own (`entryChildEndpoints`: a `<vector>` among the children, or one a
 * `<collect>` gathers) written with its tail, through
 * `entryChildEndpoints`; the others as `values` writes them.
 */
export function withDisplacementsWrittenWithTails(values, arrayName) {
    return {
        ...values,
        returnArrayDependenciesByKey(args) {
            const dependencies = values.returnArrayDependenciesByKey(args);
            dependencies.globalDependencies = {
                ...dependencies.globalDependencies,
                entryChildEndpoints: {
                    dependencyType: "stateVariable",
                    variableName: "entryChildEndpoints",
                },
            };
            return dependencies;
        },
        async inverseArrayDefinitionByKey(args) {
            const { entryChildEndpoints } = args.globalDependencyValues;
            const desired = args.desiredStateVariableValues[arrayName];
            const others = {};
            const toChildren = {};
            for (const [arrayKey, value] of Object.entries(desired)) {
                if (entryChildEndpoints[arrayKey]) {
                    toChildren[arrayKey] = value;
                } else {
                    others[arrayKey] = value;
                }
            }
            let instructions = [];
            if (Object.keys(others).length > 0) {
                const result = await values.inverseArrayDefinitionByKey({
                    ...args,
                    desiredStateVariableValues: {
                        ...args.desiredStateVariableValues,
                        [arrayName]: others,
                    },
                });
                if (!result.success) {
                    return result;
                }
                instructions = result.instructions;
            }
            if (Object.keys(toChildren).length > 0) {
                if (await args.stateValues.entriesFixed) {
                    return { success: false };
                }
                // A coordinate the write leaves unspecified (a copy of
                // the entry writing one coordinate of its head) keeps
                // the value it has, or was given earlier in the same
                // write.
                if (!args.workspace.writtenEntries) {
                    args.workspace.writtenEntries = {};
                }
                const writtenEntries = args.workspace.writtenEntries;
                const written = {};
                for (const [arrayKey, value] of Object.entries(toChildren)) {
                    let displacement = withNumDimensions(
                        coordinatesValue(convertValueToMathExpression(value)),
                        args.globalDependencyValues.numDimensions,
                    );
                    if (hasUnspecifiedCoordinate(displacement)) {
                        displacement = withSpecifiedCoordinates(
                            displacement,
                            writtenEntries[arrayKey] ??
                                (await args.stateValues[arrayName])[arrayKey],
                        );
                    }
                    writtenEntries[arrayKey] = displacement;
                    written[arrayKey] = { displacement };
                }
                instructions.push({
                    setDependency: "entryChildEndpoints",
                    desiredValue: written,
                });
            }
            return { success: true, instructions };
        },
    };
}

/**
 * The writes, `[variableIndex, value]`, that give a `<vector>` the tail and
 * displacement `written` (`{ tail, displacement }`, either one left out when
 * it is not written), by the index of `tail` (0), `head` (1) and
 * `displacement` (2) among the variables read of it. It is written the
 * variables it is defined by (`basedOnHead`, … of `stateValues`), each
 * computed from the tail and displacement written, as a drag of the vector
 * writes them (`Vector.moveVector`), so that none is computed from another's
 * value from before the write. A vector with fewer dimensions than the
 * written values is written its own.
 */
export function writesToVector(written, stateValues) {
    const { basedOnHead, basedOnTail, basedOnDisplacement } = stateValues;
    const tail = coordinatesValue(stateValues.tail);
    const head = coordinatesValue(stateValues.head);
    const ownDimensions = (value) =>
        withNumDimensions(value, coordinatesOf(tail).length);
    const newTail =
        written.tail === undefined ? tail : ownDimensions(written.tail);
    const newDisplacement =
        written.displacement === undefined
            ? differenceOf(head, tail)
            : ownDimensions(written.displacement);
    const tailIsDerived = basedOnHead && basedOnDisplacement && !basedOnTail;
    const writes = [];
    if (basedOnHead) {
        writes.push([1, sumOf(newTail, newDisplacement)]);
    }
    if (!basedOnHead || tailIsDerived) {
        writes.push([2, newDisplacement]);
    }
    if (written.tail !== undefined && !tailIsDerived) {
        writes.push([0, newTail]);
    }
    return writes;
}

/** The sum of two maths of coordinates, coordinate by coordinate. */
export function sumOf(a, b) {
    const bs = coordinatesOf(b);
    return vectorOf(coordinatesOf(a).map((x, i) => x.add(bs[i]).simplify()));
}

/** The difference of two maths of coordinates, coordinate by coordinate. */
export function differenceOf(a, b) {
    const bs = coordinatesOf(b);
    return vectorOf(
        coordinatesOf(a).map((x, i) => x.subtract(bs[i]).simplify()),
    );
}

/**
 * The function giving the point of the segment with numerical `endpoints`
 * nearest to a point, as a `<vector>`'s `nearestPoint` does: only in two
 * dimensions, for a segment of length greater than 0.
 */
function nearestPointOfSegment(endpoints, numDimensions) {
    // in one dimension, the endpoints are numbers
    const [A1, A2] = numDimensions === 2 ? endpoints[0] : [];
    const [B1, B2] = numDimensions === 2 ? endpoints[1] : [];
    const skip =
        numDimensions !== 2 ||
        ![A1, A2, B1, B2].every(Number.isFinite) ||
        (B1 === A1 && B2 === A2);
    return function ({ variables, scales }) {
        if (skip) {
            return {};
        }
        const [xscale, yscale] = scales;
        const BA1 = (B1 - A1) / xscale;
        const BA2 = (B2 - A2) / yscale;
        const denom = BA1 * BA1 + BA2 * BA2;
        const t =
            (((variables.x1 - A1) / xscale) * BA1 +
                ((variables.x2 - A2) / yscale) * BA2) /
            denom;
        let result;
        if (t <= 0) {
            result = { x1: A1, x2: A2 };
        } else if (t >= 1) {
            result = { x1: B1, x2: B2 };
        } else {
            result = { x1: A1 + t * BA1 * xscale, x2: A2 + t * BA2 * yscale };
        }
        if (variables.x3 !== undefined) {
            result.x3 = 0;
        }
        return result;
    };
}

/**
 * The magnitude of `displacement`, the math of a vector's displacement, as a
 * `<vector>` computes it: a number when every coordinate is one, otherwise
 * the square root of the sum of the squares.
 */
function magnitudeOf(displacement) {
    const coordinates = coordinatesOf(displacement);
    const numbers = coordinates.map((x) => x.evaluate_to_constant());
    if (numbers.every(Number.isFinite)) {
        return me.fromAst(Math.sqrt(numbers.reduce((a, x) => a + x * x, 0)));
    }
    return me.fromAst([
        "apply",
        "sqrt",
        ["+", ...coordinates.map((x) => ["^", x.tree, 2])],
    ]);
}

const endpointCoordinateProperties = new Map();

/**
 * The entry property that is coordinate `n` of an entry's head or tail
 * (`endpoint`), computed from the entry's head or tail: `＿` past the
 * entries' dimensions, as `x3` of an entry is.
 */
function endpointCoordinateProperty(endpoint, n) {
    const key = `${endpoint}X${n}`;
    if (!endpointCoordinateProperties.has(key)) {
        endpointCoordinateProperties.set(key, {
            from: endpoint,
            componentType: "math",
            writeThrough: "entryEndpointWrites",
            writeThroughValue: (coordinate) => ({
                [endpoint]: { [n]: coordinate },
            }),
            compute: (value) =>
                coordinatesOf(value)[n - 1] ?? me.fromAst("\uff3f"),
        });
    }
    return endpointCoordinateProperties.get(key);
}
