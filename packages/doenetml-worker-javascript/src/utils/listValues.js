import { codedDiagnostic } from "./diagnostics";
import { returnGroupIntoComponentTypeSeparatedBySpacesOutsideParens } from "../components/commonsugar/lists";

/**
 * Shared machinery for components that treat their children as a list of
 * comparable values: `<sort>`, `<sortIndices>`, and the index-returning
 * operators (`<argMin>`, `<argMax>`, `<indexOf>`, `<searchSorted>`).
 *
 * Every one of these has to answer the same question — "given this child,
 * what value do I compare it by?" — and they must all answer it the same way,
 * or `<sortIndices>` would disagree with `<sort>` about the very ordering it
 * is supposed to be reporting. Keeping the extraction in one place makes that
 * agreement structural rather than coincidental.
 *
 * Each value is described by both a `numericalValue` and a `textValue`. The
 * caller compares numerically when every value in the list is numeric, and
 * lexicographically otherwise.
 */

/**
 * The comparable value of a single component, in the form
 * `{ componentIdx, numericalValue, textValue }`, or `null` when the component
 * is not of a type we know how to compare.
 *
 * `stillNumeric` reports whether this value keeps the list eligible for
 * numeric comparison.
 */
export function extractComparableValue({
    component,
    componentInfoObjects,
    propName,
    sortVectorsBy = "displacement",
    sortByComponent = 1,
}) {
    if (propName) {
        let value = Object.values(component.stateValues)[0];
        return {
            value: {
                componentIdx: component.componentIdx,
                numericalValue: Number(value),
                textValue: String(value),
            },
            stillNumeric: Number.isFinite(value),
        };
    }

    if (
        componentInfoObjects.isInheritedComponentType({
            inheritedComponentType: component.componentType,
            baseComponentType: "number",
        })
    ) {
        return {
            value: {
                componentIdx: component.componentIdx,
                numericalValue: component.stateValues.value,
                textValue: String(component.stateValues.value),
            },
            stillNumeric: true,
        };
    }

    if (
        componentInfoObjects.isInheritedComponentType({
            inheritedComponentType: component.componentType,
            baseComponentType: "text",
        })
    ) {
        return {
            value: {
                componentIdx: component.componentIdx,
                numericalValue: NaN,
                textValue: component.stateValues.value,
            },
            stillNumeric: false,
        };
    }

    if (
        componentInfoObjects.isInheritedComponentType({
            inheritedComponentType: component.componentType,
            baseComponentType: "math",
        })
    ) {
        let numericalValue = component.stateValues.value.evaluate_to_constant();
        return {
            value: {
                componentIdx: component.componentIdx,
                numericalValue,
                textValue: component.stateValues.value.toString(),
            },
            stillNumeric: !Number.isNaN(numericalValue),
        };
    }

    // Points and vectors are compared by one of their coordinates. A vector
    // with `sortVectorsBy="tail"` uses its tail coordinate; everything else
    // uses the displacement coordinate, which for a point is its position.
    const isPoint = componentInfoObjects.isInheritedComponentType({
        inheritedComponentType: component.componentType,
        baseComponentType: "point",
    });
    const isVector = componentInfoObjects.isInheritedComponentType({
        inheritedComponentType: component.componentType,
        baseComponentType: "vector",
    });

    if (isPoint || isVector) {
        const coordinateName =
            isVector && sortVectorsBy !== "displacement"
                ? `tailX${sortByComponent}`
                : `x${sortByComponent}`;
        const compValue = component.stateValues[coordinateName];

        // A missing coordinate (an index past the dimension of the point)
        // leaves the value unusable but does not make the rest of the list
        // non-numeric.
        if (!compValue) {
            return {
                value: {
                    componentIdx: component.componentIdx,
                    numericalValue: NaN,
                    textValue: "",
                },
                stillNumeric: true,
            };
        }

        const numericalValue = compValue.evaluate_to_constant();
        return {
            value: {
                componentIdx: component.componentIdx,
                numericalValue,
                textValue: compValue.toString(),
            },
            stillNumeric: !Number.isNaN(numericalValue),
        };
    }

    return null;
}

/**
 * Compare two extracted values. `numeric` selects numerical or lexicographic
 * ordering; the caller decides that once for the whole list.
 */
export function compareExtractedValues(a, b, numeric) {
    if (numeric) {
        return a.numericalValue - b.numericalValue;
    }
    return a.textValue > b.textValue ? 1 : a.textValue < b.textValue ? -1 : 0;
}

/**
 * State variable definitions shared by every component that reads its children
 * as a list of comparable values.
 *
 * Defines:
 * - `componentIndicesForValues` — the component index of each value, in
 *   document order, flattening list children via `componentIndicesInList`.
 * - `listValues` — the extracted values in that same order.
 * - `allAreNumeric` — whether the list should be compared numerically.
 *
 * `supportProps` controls whether the `sortByProp` attribute and the
 * point/vector component selectors are consulted, and so whether a `propName`
 * state variable is defined at all. Components that only accept math, number
 * and text children (the scalar index operators) pass `false` and get simpler
 * dependencies.
 */
export function returnListValueStateVariableDefinitions({
    componentName,
    supportProps = false,
}) {
    let stateVariableDefinitions = {};

    if (supportProps) {
        stateVariableDefinitions.propName = {
            returnDependencies: () => ({
                propName: {
                    dependencyType: "attributePrimitive",
                    attributeName: "sortByProp",
                },
            }),
            definition: function ({ dependencyValues }) {
                return { setValue: { propName: dependencyValues.propName } };
            },
        };
    }

    stateVariableDefinitions.componentIndicesForValues = {
        returnDependencies: () => ({
            children: {
                dependencyType: "child",
                childGroups: ["anything"],
                variableNames: ["componentIndicesInList"],
                variablesOptional: true,
            },
        }),
        definition({ dependencyValues }) {
            let componentIndicesForValues = [];
            const diagnostics = [];
            for (let child of dependencyValues.children) {
                if (typeof child === "string") {
                    diagnostics.push(
                        codedDiagnostic({
                            type: "warning",
                            code: "doenet-w0015",
                            args: { value: child, component: componentName },
                        }),
                    );
                    continue;
                }
                if (child.stateValues.componentIndicesInList) {
                    componentIndicesForValues.push(
                        ...child.stateValues.componentIndicesInList,
                    );
                } else {
                    componentIndicesForValues.push(child.componentIdx);
                }
            }

            return {
                setValue: { componentIndicesForValues },
                sendDiagnostics: diagnostics,
            };
        },
    };

    stateVariableDefinitions.listValues = {
        additionalStateVariablesDefined: ["allAreNumeric"],
        stateVariablesDeterminingDependencies: supportProps
            ? ["componentIndicesForValues", "sortByComponent", "propName"]
            : ["componentIndicesForValues"],
        returnDependencies({ stateValues }) {
            let dependencies = {
                componentIndicesForValues: {
                    dependencyType: "stateVariable",
                    variableName: "componentIndicesForValues",
                },
            };

            if (supportProps) {
                dependencies.propName = {
                    dependencyType: "stateVariable",
                    variableName: "propName",
                };
                dependencies.sortVectorsBy = {
                    dependencyType: "stateVariable",
                    variableName: "sortVectorsBy",
                };
                dependencies.sortByComponent = {
                    dependencyType: "stateVariable",
                    variableName: "sortByComponent",
                };
            }

            if (supportProps && stateValues.propName) {
                for (let [
                    ind,
                    cIdx,
                ] of stateValues.componentIndicesForValues.entries()) {
                    dependencies[`component${ind}`] = {
                        dependencyType: "stateVariable",
                        componentIdx: cIdx,
                        variableName: stateValues.propName,
                        variablesOptional: true,
                        caseInsensitiveVariableMatch: true,
                        publicStateVariablesOnly: true,
                        returnAsComponentObject: true,
                    };
                }
            } else {
                const sortByComponent = supportProps
                    ? stateValues.sortByComponent
                    : 1;
                for (let [
                    ind,
                    cIdx,
                ] of stateValues.componentIndicesForValues.entries()) {
                    dependencies[`component${ind}`] = {
                        dependencyType: "multipleStateVariables",
                        componentIdx: cIdx,
                        variableNames: [
                            "value",
                            `x${sortByComponent}`,
                            `tailX${sortByComponent}`,
                        ],
                        variablesOptional: true,
                    };
                }
            }
            return dependencies;
        },
        definition({ dependencyValues, componentInfoObjects }) {
            let listValues = [];
            let allAreNumeric = true;

            let numValues = dependencyValues.componentIndicesForValues.length;

            for (let ind = 0; ind < numValues; ind++) {
                let component = dependencyValues[`component${ind}`];
                if (!component) {
                    continue;
                }
                let result = extractComparableValue({
                    component,
                    componentInfoObjects,
                    propName: dependencyValues.propName,
                    sortVectorsBy: dependencyValues.sortVectorsBy,
                    sortByComponent: dependencyValues.sortByComponent,
                });
                if (result === null) {
                    continue;
                }
                listValues.push(result.value);
                if (!result.stillNumeric) {
                    allAreNumeric = false;
                }
            }

            return { setValue: { listValues, allAreNumeric } };
        },
    };

    return stateVariableDefinitions;
}

/**
 * The comparable form of a value that did not come from a child component —
 * in practice, the `target` attribute of `<indexOf>` / `<searchSorted>`, which
 * is a `_componentWithSelectableType` and so can arrive as a number, a string,
 * a math-expression or a boolean.
 */
export function comparableValueFromRaw(value) {
    if (value === null || value === undefined) {
        return null;
    }
    if (typeof value === "number") {
        return {
            numericalValue: value,
            textValue: String(value),
            isNumeric: true,
        };
    }
    if (typeof value === "string") {
        return { numericalValue: NaN, textValue: value, isNumeric: false };
    }
    if (typeof value === "boolean") {
        return {
            numericalValue: NaN,
            textValue: String(value),
            isNumeric: false,
        };
    }
    if (typeof value.evaluate_to_constant === "function") {
        let numericalValue = value.evaluate_to_constant();
        return {
            numericalValue,
            textValue: value.toString(),
            isNumeric: !Number.isNaN(numericalValue),
        };
    }
    return { numericalValue: NaN, textValue: String(value), isNumeric: false };
}

/**
 * Sugar shared by the components that read their children as a list of
 * comparable values: bare strings are split on whitespace and wrapped in the
 * component type named by the `type` attribute.
 *
 * Unlike the math-only operators, these components accept text as readily as
 * numbers, so there is no sensible default: without an explicit `type` the
 * strings are left alone and a warning is issued.
 */
export function returnBreakStringsIntoTypeSugarInstruction(
    componentName,
    { requireStringChild = false } = {},
) {
    function breakStringsMacrosIntoTypeBySpaces({
        matchedChildren,
        componentAttributes,
        componentInfoObjects,
        nComponents,
    }) {
        const diagnostics = [];
        // only if all children are strings or macros
        if (
            !matchedChildren.every(
                (child) =>
                    typeof child === "string" ||
                    (child.extending && "Ref" in child.extending),
            )
        ) {
            return { success: false };
        }

        // With `requireStringChild`, leave the children alone when there are no
        // bare strings to convert. Wrapping a reference in the named type would
        // collapse a referenced list — `<indexOf type="text">$names</indexOf>`
        // would compare against the single string "Ann, Bob, Cal" rather than
        // against each name — and there is nothing to gain by it, since a
        // referenced component already has a type of its own.
        if (
            requireStringChild &&
            !matchedChildren.some((child) => typeof child === "string")
        ) {
            return { success: false };
        }

        let type;
        if (componentAttributes.type?.value) {
            type = componentAttributes.type.value;
        } else {
            if (matchedChildren.some((child) => typeof child === "string")) {
                diagnostics.push(
                    codedDiagnostic({
                        type: "warning",
                        code: "doenet-w0013",
                        args: { component: componentName },
                    }),
                );
            }
            return { success: false, diagnostics };
        }

        if (!["math", "text", "number", "boolean"].includes(type)) {
            console.warn(`Invalid type ${type}`);
            diagnostics.push(
                codedDiagnostic({
                    type: "warning",
                    code: "doenet-w0014",
                    args: { type, component: componentName },
                }),
            );
            type = "math";
        }

        // break any string by white space and wrap pieces with type
        let groupIntoComponentTypesSeparatedBySpaces =
            returnGroupIntoComponentTypeSeparatedBySpacesOutsideParens({
                componentType: type,
                forceComponentType: true,
            });
        let result = groupIntoComponentTypesSeparatedBySpaces({
            matchedChildren,
            componentInfoObjects,
            nComponents,
        });

        if (result.success) {
            return {
                success: true,
                newChildren: result.newChildren,
                nComponents: result.nComponents,
                diagnostics,
            };
        } else {
            return { success: false };
        }
    }

    return { replacementFunction: breakStringsMacrosIntoTypeBySpaces };
}
