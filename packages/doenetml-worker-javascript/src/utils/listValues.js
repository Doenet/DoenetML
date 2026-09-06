import me from "math-expressions";
import { textToAst } from "./math";
import { codedDiagnostic } from "./diagnostics";
import { returnGroupIntoComponentTypeSeparatedBySpacesOutsideParens } from "../components/commonsugar/lists";

/**
 * Shared machinery for components that treat their children as a list of
 * comparable values: `<sort>`, `<sortIndices>`, the index-returning operators
 * (`<argMin>`, `<argMax>`, `<indexOf>`, `<searchSorted>`) and the counting
 * operators (`<tally>`, `<binCounts>`).
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
 *
 * The `type`-attribute sugar at the bottom of this file is shared a little more
 * widely: `<shuffle>` rearranges its children without ever comparing them, but
 * it reads them as a list of typed values in exactly the same way.
 */

/**
 * The comparable value of a single component, in the form
 * `{ componentIdx, numericalValue, textValue }`, or `null` when the component
 * is not of a type we know how to compare.
 *
 * `stillNumeric` reports whether this value keeps the list eligible for
 * numeric comparison. It is recorded per value as `numericByType` when the
 * list is assembled, since a value that is numeric *by type* but `NaN` *by
 * value* — a `<number>` whose content does not parse — is otherwise
 * indistinguishable from a `<text>NaN</text>`.
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

    // `type="boolean"` is one of the types the sugar below will wrap strings
    // in, so a boolean child has to be comparable or `<sort type="boolean">`
    // and `<indexOf type="boolean">` would silently drop every child. Compared
    // as text, which orders `false` before `true` and matches how
    // `comparableValueFromRaw` reads a boolean `target`.
    if (
        componentInfoObjects.isInheritedComponentType({
            inheritedComponentType: component.componentType,
            baseComponentType: "boolean",
        })
    ) {
        return {
            value: {
                componentIdx: component.componentIdx,
                numericalValue: NaN,
                textValue: String(component.stateValues.value),
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
        // Test equality before subtracting. Subtracting equal infinities gives
        // NaN rather than 0, and callers that ask "are these equal?" read that
        // NaN as "not equal": without this, `<indexOf target="Infinity">` never
        // matches an infinite entry, and `<searchSorted side="right">` fails to
        // advance past one. `<sort>` never noticed because a NaN from a sort
        // comparator is treated as 0.
        if (a.numericalValue === b.numericalValue) {
            return 0;
        }
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
 *   document order. One per child, so the indices are distinct.
 * - `listValues` — the extracted values in that same order, skipping any child
 *   whose type has no comparable value.
 * - `allAreNumeric` — whether the list should be compared numerically.
 *
 * `supportProps` controls whether the `sortByProp`, `sortByComponent` and
 * `sortVectorsBy` attributes are consulted, and so whether a `propName` state
 * variable is defined at all. `<sort>` and `<sortIndices>` pass `true`; the
 * index-returning and counting operators, which declare none of those
 * attributes, pass `false` and read points and vectors by their first
 * displacement coordinate.
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
                // A child that publishes `componentIndicesInList` contributes
                // one index per item it holds. No component defines that
                // variable today, so in practice this is one index per child.
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
                // `numericByType` records what the *component* is, not what
                // the list turned out to be: a `<number>` says yes even when
                // its content does not parse and its value is `NaN`. That is
                // what lets a consumer tell a malformed number from a
                // `<text>NaN</text>`, which are otherwise identical here —
                // both compare as the text `NaN`.
                listValues.push({
                    ...result.value,
                    numericByType: result.stillNumeric,
                });
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
 * in practice, one value of the `target` attribute of `<indexOf>` /
 * `<searchSorted>` or of `<tally>`'s `categories`. Each is a
 * `_componentListWithSelectableType` and so yields a list whose entries can
 * each be a number, a string, a math-expression or a boolean.
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
 * Whether every bracket in a token is closed by its own kind, in order.
 *
 * Only a rejection is meaningful: balanced delimiters say nothing about
 * whether the token names a number, which the parser still decides.
 */
function delimitersBalanced(token) {
    const closerFor = { ")": "(", "]": "[", "}": "{" };
    const open = [];

    for (const character of token) {
        if (character === "(" || character === "[" || character === "{") {
            open.push(character);
        } else if (character in closerFor) {
            if (open.pop() !== closerFor[character]) {
                return false;
            }
        }
    }

    return open.length === 0;
}

/**
 * Whether a bare token names a real number, read with Doenet's own math
 * parser — so `1/2`, `2^3`, `sqrt(4)`, `pi` and `min(1,2)` are numbers, while
 * `x`, `2x` and `apple` are not.
 *
 * The parser decides alone; `Number` is deliberately not consulted, even
 * though `<number>` consults it first. The tokens the two disagree about are
 * JavaScript numeric literals, and none of them is DoenetML notation.
 * `Number("1e3")` is 1000, but `parseScientificNotation` is off by default
 * wherever it is offered and recognizes an *uppercase* exponent only, so `1e3`
 * is not scientific notation in DoenetML under any setting. `Number("0x10")`
 * is 16 and `Number("0b101")` is 5, and neither notation exists in DoenetML at
 * all. `<number>` reads all three only because `Number.js` converts its string
 * child with `Number` before reaching for the parser — issue #1849, which has
 * to wait for a breaking release — and inferring "this list is numeric" from a
 * JavaScript literal would entrench it. An author who wants an exponent read
 * says so, and references the result:
 * `<mathList parseScientificNotation="true">1E3 2 5E2</mathList>`.
 *
 * The parser does have to be Doenet's own, though, not merely a math parser.
 * `Number.js` reads its content with `textToAst`, which is configured with
 * Doenet's own list of applied functions; `me.fromText` uses the parser
 * library's shorter default list, which has `abs` and `nCr` but not `min`,
 * `max`, `mean`, `median`, `sum`, `prod`, `count`, `std` or `variance`. Read by
 * that one, `<sort>min(1,2) 3</sort>` called itself text and rendered
 * `3, min(1,2)`, while the `<number>` it goes on to create reads `min(1,2)` as
 * 1 — and `<sort>nCr(4,2) 3</sort>` next to it read as numbers.
 *
 * The result is tested with `typeof` together with `NaN`, and neither half is
 * redundant. `Number.isFinite` alone would rule out an infinity, which *is* a
 * number the comparison handles — it tests equality before subtracting. A bare
 * `!Number.isNaN` alone would let through the complex object that `i`
 * evaluates to, on which every comparison is `NaN`, so such a value would be
 * called numeric and then never equal anything, not even itself.
 */
function tokenIsRealNumber(token) {
    // A token whose delimiters do not close cannot name a number, and asking
    // is expensive: parsing a run of unmatched openers is exponential, so
    // `((((((((((((((((1+2` takes about nine seconds and two more of them take
    // a minute. Before this file inferred anything, a bare string with no
    // `type` never reached the parser at all, so answering here without
    // calling it keeps a typo from stalling the document. The parser's own
    // cost is #1852; this is not a fix for it, it is not asking a question
    // whose answer is already known.
    if (!delimitersBalanced(token)) {
        return false;
    }

    let value;
    try {
        value = me.fromAst(textToAst.convert(token)).evaluate_to_constant();
    } catch (e) {
        return false;
    }
    return typeof value === "number" && !Number.isNaN(value);
}

/**
 * The type to read bare strings as when the author did not say.
 *
 * Every token being a number makes the list numeric; anything else makes it
 * text. That is the rule the values already follow when they arrive as
 * components — `allAreNumeric` is true only if every one of them is numeric,
 * and a single text among numbers sends the whole list to a text comparison —
 * so inferring it here means an author writing `1 10 3` and an author
 * referencing a `<numberList>` get the same answer, and `1 10 x` reads as text
 * either way.
 *
 * Tokens are split on whitespace alone, while the wrapping below splits on
 * whitespace *outside parens*. They part company only where whitespace falls
 * inside parens, and then only in the safe direction: the piece holding the
 * unmatched `(` is not a number under any reading, so the list is called text
 * where the wrapping would have accepted a number. `<sort>(1+2) 4</sort>`
 * orders by value; `<sort>(1 + 2) 4</sort>` orders the same two pieces as
 * text. Inference never calls a list numeric that the wrapping would then fill
 * with something unreadable.
 *
 * Returns `null` when there is nothing to read — no bare strings at all — so
 * the caller can leave a list of references alone.
 */
function inferTypeFromStrings(matchedChildren) {
    const tokens = matchedChildren
        .filter((child) => typeof child === "string")
        .flatMap((child) => child.split(/\s+/))
        .filter((token) => token !== "");

    if (tokens.length === 0) {
        return null;
    }

    return tokens.every(tokenIsRealNumber) ? "number" : "text";
}

/**
 * Sugar shared by the components that read their children as a list of typed
 * values — `<sort>`, `<sortIndices>`, `<shuffle>` and the index-returning and
 * counting operators: bare strings are split on whitespace and wrapped in the
 * component type named by the `type` attribute.
 *
 * Unlike the math-only operators, these components accept text as readily as
 * numbers, so there is no one type to fall back on. Without a `type` the
 * strings are read as what they look like, by `inferTypeFromStrings` above. A
 * `type` naming something that is not one of the four readings is reported —
 * naming `componentName`, so the author sees the tag they actually wrote — and
 * then dropped, leaving the children to be read as though it had not been
 * written.
 */
export function returnBreakStringsIntoTypeSugarInstruction(componentName) {
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

        let type = componentAttributes.type?.value;

        // A type that is not one of the four is reported and then dropped, so
        // the children are read exactly as they would be with no `type` at
        // all. Replacing it with `math` instead read them as maths, which is
        // how `<tally type="txt">apple fig apple</tally>` came to report its
        // categories as `a p p l e` and `f i g`.
        //
        // Only the children. An invalid `type` still reaches `categories` and
        // `target`, which resolve it separately and do replace it — the
        // deferred `_componentWithSelectableType` half of #1825 — so
        // `<tally type="txt" categories="apple fig">` is unaffected by the
        // drop and still counts nothing.
        if (type && !["math", "text", "number", "boolean"].includes(type)) {
            diagnostics.push(
                codedDiagnostic({
                    type: "warning",
                    code: "doenet-w0145",
                    args: { type, component: componentName },
                }),
            );
            type = undefined;
        }

        if (!type) {
            type = inferTypeFromStrings(matchedChildren);

            // Nothing but references, so there is nothing for a type to say.
            if (type === null) {
                return { success: false, diagnostics };
            }
        }

        // Break any string by white space and wrap the pieces with `type`.
        //
        // Reference children are passed through untouched rather than wrapped.
        // Wrapping one collapses a referenced list into the single string it
        // renders as: `<sort type="text">$names Z</sort>` would sort the two
        // values "Ann, Bob" and "Z" instead of the three names, and
        // `<indexOf type="text" target="Bob">$names Z</indexOf>` could not find
        // Bob at all. `type` exists to say what bare strings should become; a
        // referenced component already carries a type of its own.
        let groupIntoComponentTypesSeparatedBySpaces =
            returnGroupIntoComponentTypeSeparatedBySpacesOutsideParens({
                componentType: type,
                forceComponentType: false,
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
