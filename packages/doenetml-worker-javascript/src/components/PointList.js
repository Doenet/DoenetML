import GraphicalValueList, {
    coordinatesOf,
    numericalCoordinates,
    vectorOf,
    withNumDimensions,
} from "./abstract/GraphicalValueList";
import me from "math-expressions";
import { convertValueToMathExpression } from "@doenet/utils";
import { applyConstraintFromComponentConstraints } from "../utils/constraints";

/**
 * A list of points, held as the math of each point's coordinates
 * (`pointCoords`), which a parent reads, and the viewer draws, as one point
 * per entry, dragged entry by entry (Doenet/DoenetML#2162).
 *
 * A constraint among the children (`<constrainToGrid/>`) constrains every
 * entry, as it constrains a `<point>` it is a child of: when the entry is
 * computed and when it is written.
 */
export default class PointList extends GraphicalValueList {
    constructor(args) {
        super(args);

        Object.assign(this.actions, {
            movePoint: this.movePoint.bind(this),
            switchPoint: this.switchPoint.bind(this),
            pointClicked: this.pointClicked.bind(this),
            pointFocused: this.pointFocused.bind(this),
        });
    }

    static componentType = "pointList";

    static componentDocs = {
        summary: "A list of points",
    };

    static listEntryComponentType = "point";

    static allowInSchemaAsComponent = ["point"];

    static listChildGroups = [
        {
            group: "points",
            componentTypes: ["point"],
        },
    ];

    static listOtherChildGroups = [
        {
            group: "constraints",
            componentTypes: ["_constraint"],
        },
    ];

    // A component that has a point list as an attribute, or a variable
    // shadowed as one (a polygon's `vertices`), holds the points as the
    // arrays of their coordinates.
    static stateVariableToBeShadowed = "points";
    static primaryStateVariableForDefinition = "pointsShadow";

    static listValuesEntryPrefix = "pointValue";

    static coordinatesArrayName = "points";
    static coordinatesArrayPrefix = "pointX";

    static buildListEntryStateVariables() {
        const variables = super.buildListEntryStateVariables();
        variables.numericalXs = "entryNumericalXs";
        variables.nearestPoint = "entryNearestPoints";
        return variables;
    }

    static get listPerEntryVariables() {
        return [
            ...super.listPerEntryVariables,
            "entryNumericalXs",
            "entryNearestPoints",
        ];
    }

    // An entry's coordinates as a list (`$pl.xs`, `$pl[2].xs`) and as one
    // math (`$pl[2].coords`), as a point's.
    static get listEntryDerivedProperties() {
        return {
            ...super.listEntryDerivedProperties,
            coords: {
                from: "value",
                componentType: "coords",
                companionsOf: "coords",
                compute: (value) => value,
                invert: (value) => value,
            },
            xs: {
                from: "value",
                componentType: "mathList",
                compute: coordinatesOf,
            },
        };
    }

    static entryValueAdjustmentDependencies() {
        return {
            constraintChildren: {
                dependencyType: "child",
                childGroups: ["constraints"],
                variableNames: ["applyConstraint", "applyComponentConstraint"],
                variablesOptional: true,
            },
        };
    }

    static entryValuesAreAdjusted({ constraintChildren }) {
        return constraintChildren.length > 0;
    }

    static adjustEntryValues(entries, { constraintChildren }) {
        if (constraintChildren.length === 0) {
            return;
        }
        for (const arrayKey in entries) {
            entries[arrayKey] = constrainedPoint(
                entries[arrayKey],
                constraintChildren,
            );
        }
    }

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        const arrayName = this.listValuesArrayName;

        stateVariableDefinitions.numPoints = {
            isAlias: true,
            targetVariableName: "numComponents",
            description: "The number of points in the list.",
        };

        // The coordinates of each entry as numbers, which its renderer draws.
        stateVariableDefinitions.entryNumericalXs = {
            returnDependencies: () => ({
                values: {
                    dependencyType: "stateVariable",
                    variableName: arrayName,
                },
            }),
            definition: ({ dependencyValues }) => ({
                setValue: {
                    entryNumericalXs:
                        dependencyValues.values.map(numericalCoordinates),
                },
            }),
        };

        // For each entry, the point nearest to a given point, which is the
        // entry, as for a `<point>` (`<constrainTo>$pl</constrainTo>`).
        stateVariableDefinitions.entryNearestPoints = {
            returnDependencies: () => ({
                entryNumericalXs: {
                    dependencyType: "stateVariable",
                    variableName: "entryNumericalXs",
                },
            }),
            definition: ({ dependencyValues }) => ({
                setValue: {
                    entryNearestPoints: dependencyValues.entryNumericalXs.map(
                        (xs) =>
                            function () {
                                if (!xs.every(Number.isFinite)) {
                                    return {};
                                }
                                const result = {};
                                for (const [ind, x] of xs.entries()) {
                                    result[`x${ind + 1}`] = x;
                                }
                                return result;
                            },
                    ),
                },
            }),
        };

        return stateVariableDefinitions;
    }

    /**
     * A drag of the renderer of entry `listEntryIndex` to `x`, `y`, `z`: the
     * entry's other coordinates are kept.
     */
    async movePoint({ x, y, z, listEntryIndex, pointRole = "point", ...args }) {
        if (pointRole !== "point") {
            console.warn(`Invalid pointRole: ${pointRole}`);
            return;
        }
        if (!(await this.entryCanBeDragged(listEntryIndex))) {
            return;
        }
        const coordinates = coordinatesOf(
            (await this.stateValues[this.constructor.listValuesArrayName])[
                listEntryIndex
            ],
        );
        for (const [ind, value] of [x, y, z].entries()) {
            if (value !== undefined && ind < coordinates.length) {
                coordinates[ind] = me.fromAst(value);
            }
        }
        return await this.writeEntryFromAction({
            ...args,
            listEntryIndex,
            values: {
                [this.constructor.listValuesArrayName]: vectorOf(coordinates),
            },
            result: { x, y, z },
        });
    }

    switchPoint() {}

    async pointClicked(args) {
        await this.performOnEntryChild({
            actionName: "pointClicked",
            triggeringAction: "click",
            args,
        });
    }

    async pointFocused(args) {
        await this.performOnEntryChild({
            actionName: "pointFocused",
            triggeringAction: "focus",
            args,
        });
    }
}

/**
 * `value`, the coordinates of a point, constrained by
 * `constraintChildren` in turn, as a `<point>` with those constraint children
 * is.
 */
function constrainedPoint(value, constraintChildren) {
    const coordinates = coordinatesOf(value);
    let variables = {};
    for (const [ind, x] of coordinates.entries()) {
        variables[`x${ind + 1}`] = x;
    }
    for (const constraintChild of constraintChildren) {
        const result = constraintChild.stateValues.applyConstraint
            ? constraintChild.stateValues.applyConstraint(variables)
            : applyConstraintFromComponentConstraints(
                  variables,
                  constraintChild.stateValues.applyComponentConstraint,
              );
        if (result.constrained) {
            variables = { ...variables };
            for (const varName in result.variables) {
                variables[varName] = convertValueToMathExpression(
                    result.variables[varName],
                );
            }
        }
    }
    return withNumDimensions(
        vectorOf(coordinates.map((_, ind) => variables[`x${ind + 1}`])),
        coordinates.length,
    );
}
