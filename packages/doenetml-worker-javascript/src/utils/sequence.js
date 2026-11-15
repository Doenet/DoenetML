import me from "math-expressions";
import { numberToLetters, lettersToNumber } from "@doenet/utils";
import { findFiniteNumericalValue } from "./math";
import { codedDiagnostic } from "./diagnostics";

export function returnStandardSequenceAttributes() {
    return {
        type: {
            highlighted: true,
            createPrimitiveOfType: "string",
            createStateVariable: "type",
            defaultPrimitiveValue: "number",
            toLowerCase: true,
            validValues: [
                {
                    value: "number",
                    description: "A sequence of numeric values.",
                },
                {
                    value: "math",
                    description:
                        "A sequence of math expressions (allows symbolic from/to/step).",
                },
                {
                    value: "letters",
                    description:
                        "A sequence of letters (single-letter or multi-letter labels).",
                },
            ],
            description: "The kind of values in the sequence.",
        },
        from: {
            highlighted: true,
            createComponentOfType: "_componentWithSelectableType",
            description: "The first value in the sequence.",
        },
        to: {
            highlighted: true,
            createComponentOfType: "_componentWithSelectableType",
            description:
                "The last value in the sequence. Used together with from to determine length when length is not specified.",
        },
        step: {
            highlighted: true,
            createComponentOfType: "math",
            description:
                "The increment between successive values in the sequence.",
        },
        length: {
            highlighted: true,
            createComponentOfType: "integer",
            description: "The number of values in the sequence.",
        },
        exclude: {
            createComponentOfType: "_componentListWithSelectableType",
            description: "Values to exclude from the sequence.",
        },
    };
}

/**
 * The type of component a value of a sequence (`<sequence>`,
 * `<selectFromSequence>`, `<repeatForSequence>`) is, from the sequence's
 * serialized `type` attribute, read as the attribute itself is
 * (`validateAttributeValue`: lower-cased and trimmed, and a value the
 * attribute does not allow, such as `type="text"`, falls back to its
 * default, `number`), with `letters` making a `text`. `undefined` when the
 * attribute is not a primitive.
 */
export function sequenceEntryComponentType(typeAttribute) {
    const spec = returnStandardSequenceAttributes().type;
    let type;
    if (typeAttribute === undefined) {
        type = spec.defaultPrimitiveValue;
    } else if (typeAttribute.type === "primitive") {
        type = String(typeAttribute.primitive.value).toLowerCase().trim();
    } else {
        return undefined;
    }
    if (!spec.validValues.some((entry) => entry.value === type)) {
        type = spec.defaultPrimitiveValue;
    }
    return type === "letters" ? "text" : type;
}

export function returnStandardSequenceStateVariableDefinitions() {
    // creates definitions for sequence state variables:
    // type, specifiedFrom, specifiedTo, specifiedLength, specifiedStep, specifiedExclude,
    // lowercase, validSequence,
    // from, step, length, exclude, last

    // uses attributes defined above
    // attributes: type
    // attributeComponents: from, to, length, step, exclude

    let stateVariableDefinitions = {};

    stateVariableDefinitions.specifiedFrom = {
        returnDependencies: () => ({
            fromAttr: {
                dependencyType: "attributeComponent",
                attributeName: "from",
                variableNames: ["value"],
            },
        }),
        defaultValue: null,
        hasEssential: true,
        essentialVarName: "from",
        definition: function ({ dependencyValues }) {
            if (dependencyValues.fromAttr === null) {
                return {
                    useEssentialOrDefaultValue: { specifiedFrom: true },
                };
            }
            if (dependencyValues.fromAttr.stateValues.value === null) {
                // if have a from child, but its value is null,
                // it means we have an invalid from
                // Can't return null, as that indicates value wasn't specified
                // so return NaN
                return {
                    setValue: {
                        specifiedFrom: NaN,
                    },
                };
            }
            return {
                setValue: {
                    specifiedFrom: dependencyValues.fromAttr.stateValues.value,
                },
            };
        },
    };

    stateVariableDefinitions.specifiedTo = {
        returnDependencies: () => ({
            toAttr: {
                dependencyType: "attributeComponent",
                attributeName: "to",
                variableNames: ["value"],
            },
        }),
        defaultValue: null,
        hasEssential: true,
        essentialVarName: "to",
        definition: function ({ dependencyValues }) {
            if (dependencyValues.toAttr === null) {
                return {
                    useEssentialOrDefaultValue: {
                        specifiedTo: true,
                    },
                };
            }
            if (dependencyValues.toAttr.stateValues.value === null) {
                // if have a to child, but its value is null,
                // it means we have an invalid to
                // Can't return null, as that indicates value wasn't specified
                // so return NaN
                return {
                    setValue: {
                        specifiedTo: NaN,
                    },
                };
            }
            return {
                setValue: {
                    specifiedTo: dependencyValues.toAttr.stateValues.value,
                },
            };
        },
    };

    stateVariableDefinitions.specifiedLength = {
        returnDependencies: () => ({
            lengthAttr: {
                dependencyType: "attributeComponent",
                attributeName: "length",
                variableNames: ["value"],
            },
        }),
        defaultValue: null,
        hasEssential: true,
        essentialVarName: "length",
        definition: function ({ dependencyValues }) {
            if (dependencyValues.lengthAttr === null) {
                return {
                    useEssentialOrDefaultValue: {
                        specifiedLength: true,
                    },
                };
            }
            if (dependencyValues.lengthAttr.stateValues.value === null) {
                // if have a length child, but its value is null,
                // it means we have an invalid length
                // Can't return null, as that indicates value wasn't specified
                // so return NaN
                return {
                    setValue: {
                        specifiedLength: NaN,
                    },
                };
            }
            return {
                setValue: {
                    specifiedLength:
                        dependencyValues.lengthAttr.stateValues.value,
                },
            };
        },
    };

    stateVariableDefinitions.specifiedStep = {
        returnDependencies: () => ({
            stepAttr: {
                dependencyType: "attributeComponent",
                attributeName: "step",
                variableNames: ["value"],
            },
            type: {
                dependencyType: "stateVariable",
                variableName: "type",
            },
        }),
        defaultValue: null,
        hasEssential: true,
        essentialVarName: "step",
        definition: function ({ dependencyValues }) {
            if (dependencyValues.stepAttr === null) {
                return {
                    useEssentialOrDefaultValue: {
                        specifiedStep: true,
                    },
                };
            }

            let step = dependencyValues.stepAttr.stateValues.value;
            if (step === null) {
                // if have a step child, but its value is null,
                // it means we have an invalid step
                // Can't return null, as that indicates value wasn't specified
                // so return NaN
                return {
                    setValue: {
                        specifiedStep: NaN,
                    },
                };
            }
            return { setValue: { specifiedStep: step } };
        },
    };

    stateVariableDefinitions.specifiedExclude = {
        returnDependencies: () => ({
            excludeAttr: {
                dependencyType: "attributeComponent",
                attributeName: "exclude",
                variableNames: ["values"],
            },
        }),
        defaultValue: [],
        hasEssential: true,
        essentialVarName: "exclude",
        definition: function ({ dependencyValues }) {
            if (dependencyValues.excludeAttr === null) {
                return {
                    useEssentialOrDefaultValue: {
                        specifiedExclude: true,
                    },
                };
            }
            return {
                setValue: {
                    specifiedExclude:
                        dependencyValues.excludeAttr.stateValues.values,
                },
            };
        },
    };

    stateVariableDefinitions.lowercase = {
        returnDependencies: () => ({
            specifiedTo: {
                dependencyType: "stateVariable",
                variableName: "specifiedTo",
            },
            specifiedFrom: {
                dependencyType: "stateVariable",
                variableName: "specifiedFrom",
            },
        }),
        definition: function ({ dependencyValues }) {
            let capitalRegex = /^[A-Z]*$/;

            // base whether lowercase or upper case on from, if it exists, else to
            let lowercase = true;
            if (dependencyValues.specifiedFrom !== null) {
                if (capitalRegex.test(dependencyValues.specifiedFrom)) {
                    lowercase = false;
                }
            } else if (dependencyValues.specifiedTo !== null) {
                if (capitalRegex.test(dependencyValues.specifiedTo)) {
                    lowercase = false;
                }
            }

            return { setValue: { lowercase } };
        },
    };

    stateVariableDefinitions.validSequence = {
        returnDependencies: () => ({
            specifiedLength: {
                dependencyType: "stateVariable",
                variableName: "specifiedLength",
            },
            specifiedStep: {
                dependencyType: "stateVariable",
                variableName: "specifiedStep",
            },
            specifiedFrom: {
                dependencyType: "stateVariable",
                variableName: "specifiedFrom",
            },
            specifiedTo: {
                dependencyType: "stateVariable",
                variableName: "specifiedTo",
            },
            type: {
                dependencyType: "stateVariable",
                variableName: "type",
            },
            lowercase: {
                dependencyType: "stateVariable",
                variableName: "lowercase",
            },
        }),
        definition: function ({ dependencyValues }) {
            let diagnostics = [];

            let validSequence = true;

            if (dependencyValues.specifiedLength !== null) {
                if (
                    !Number.isInteger(dependencyValues.specifiedLength) ||
                    dependencyValues.specifiedLength < 0
                ) {
                    diagnostics.push(
                        codedDiagnostic({
                            type: "info",
                            code: "doenet-i0012",
                        }),
                    );
                    validSequence = false;
                }
            }

            if (dependencyValues.specifiedStep !== null) {
                // step must be number if not math
                if (dependencyValues.type !== "math") {
                    let numericalStep = findFiniteNumericalValue(
                        dependencyValues.specifiedStep,
                    );
                    if (!Number.isFinite(numericalStep)) {
                        diagnostics.push(
                            codedDiagnostic({
                                type: "info",
                                code: "doenet-i0013",
                                args: { type: dependencyValues.type },
                            }),
                        );
                        validSequence = false;
                    }
                }
            }

            if (dependencyValues.specifiedFrom !== null) {
                if (dependencyValues.type === "number") {
                    let numericalFrom = findFiniteNumericalValue(
                        dependencyValues.specifiedFrom,
                    );
                    if (!Number.isFinite(numericalFrom)) {
                        diagnostics.push(
                            codedDiagnostic({
                                type: "info",
                                code: "doenet-i0014",
                                args: { attribute: "from" },
                            }),
                        );
                        validSequence = false;
                    }
                } else if (dependencyValues.type === "letters") {
                    if (
                        lettersToNumber(dependencyValues.specifiedFrom) ===
                        undefined
                    ) {
                        diagnostics.push(
                            codedDiagnostic({
                                type: "info",
                                code: "doenet-i0015",
                                args: { attribute: "from" },
                            }),
                        );
                        validSequence = false;
                    }
                } else {
                    // type === math

                    if (Number.isNaN(dependencyValues.specifiedFrom.tree)) {
                        diagnostics.push(
                            codedDiagnostic({
                                type: "info",
                                code: "doenet-i0016",
                                args: { attribute: "from" },
                            }),
                        );
                        validSequence = false;
                    }
                }
            }

            if (dependencyValues.specifiedTo !== null) {
                if (dependencyValues.type === "number") {
                    let numericalTo = findFiniteNumericalValue(
                        dependencyValues.specifiedTo,
                    );
                    if (!Number.isFinite(numericalTo)) {
                        diagnostics.push(
                            codedDiagnostic({
                                type: "info",
                                code: "doenet-i0014",
                                args: { attribute: "to" },
                            }),
                        );
                        validSequence = false;
                    }
                } else if (dependencyValues.type === "letters") {
                    if (
                        lettersToNumber(dependencyValues.specifiedTo) ===
                        undefined
                    ) {
                        diagnostics.push(
                            codedDiagnostic({
                                type: "info",
                                code: "doenet-i0015",
                                args: { attribute: "to" },
                            }),
                        );
                        validSequence = false;
                    }
                } else {
                    // type === math

                    if (Number.isNaN(dependencyValues.specifiedTo.tree)) {
                        diagnostics.push(
                            codedDiagnostic({
                                type: "info",
                                code: "doenet-i0016",
                                args: { attribute: "to" },
                            }),
                        );
                        validSequence = false;
                    }
                }
            }

            return {
                setValue: { validSequence },
                sendDiagnostics: diagnostics,
            };
        },
    };

    stateVariableDefinitions.from = {
        additionalStateVariablesDefined: ["step", "length", "exclude", "last"],

        returnDependencies: () => ({
            specifiedFrom: {
                dependencyType: "stateVariable",
                variableName: "specifiedFrom",
            },
            specifiedTo: {
                dependencyType: "stateVariable",
                variableName: "specifiedTo",
            },
            specifiedLength: {
                dependencyType: "stateVariable",
                variableName: "specifiedLength",
            },
            specifiedStep: {
                dependencyType: "stateVariable",
                variableName: "specifiedStep",
            },
            type: {
                dependencyType: "stateVariable",
                variableName: "type",
            },
            specifiedExclude: {
                dependencyType: "stateVariable",
                variableName: "specifiedExclude",
            },
            validSequence: {
                dependencyType: "stateVariable",
                variableName: "validSequence",
            },
        }),
        definition: function ({ dependencyValues }) {
            let from = dependencyValues.specifiedFrom;
            let to = dependencyValues.specifiedTo;
            let step = dependencyValues.specifiedStep;
            let length = dependencyValues.specifiedLength;
            let exclude = [...dependencyValues.specifiedExclude];
            let type = dependencyValues.type;

            if (dependencyValues.type === "math") {
                // make sure to and from are math expressions
                if (to !== null) {
                    if (!(to instanceof me.class)) {
                        to = me.fromAst(to);
                    }
                }
                if (from !== null) {
                    if (!(from instanceof me.class)) {
                        from = me.fromAst(from);
                    }
                }
                if (step !== null) {
                    if (!(step instanceof me.class)) {
                        step = me.fromAst(step);
                    }
                }
            } else {
                // if type is not math, convert step to a number
                if (step !== null) {
                    if (step instanceof me.class) {
                        step = step.evaluate_to_constant();
                    }
                }

                if (dependencyValues.type === "letters") {
                    // if from, to, and exclude are strings
                    // then convert to numbers
                    if (from !== null) {
                        from = lettersToNumber(from);
                    }
                    if (to !== null) {
                        to = lettersToNumber(to);
                    }
                    exclude = exclude.map(lettersToNumber);
                } else if (dependencyValues.type === "number") {
                    // make sure to, from, and exclude are numbers
                    if (to !== null) {
                        if (to instanceof me.class) {
                            to = to.evaluate_to_constant();
                        } else {
                            to = Number(to);
                        }
                    }
                    if (from !== null) {
                        if (from instanceof me.class) {
                            from = from.evaluate_to_constant();
                        } else {
                            from = Number(from);
                        }
                    }
                    for (let [index, value] of exclude.entries()) {
                        if (value instanceof me.class) {
                            exclude[index] = value.evaluate_to_constant();
                        } else {
                            exclude[index] = Number(value);
                        }
                    }
                }
            }

            if (dependencyValues.validSequence) {
                let results = calculateSequenceParameters({
                    from,
                    to,
                    step,
                    length,
                    type,
                });
                results.exclude = exclude;

                return { setValue: results };
            }

            if (!Number.isInteger(length) || length < 0) {
                length = 0;
            }

            return { setValue: { from, step, length, exclude, last: null } };
        },
    };

    return stateVariableDefinitions;
}

/**
 * How far below a whole number a sequence's count, `(to - from) / step + 1`
 * as computed, can be from floating point alone, given the `from`, `to` and
 * `step` it is computed from (numbers; of a math sequence, their numeric
 * values, `NaN` when not numbers, which give 0).
 *
 * `from` and `to` are each held to within half a unit in their last place
 * (a decimal such as `1000.3` isn't held exactly), and the arithmetic that
 * computed them (`$t + 0.3`) rounds by as much again for each operation;
 * `to - from` doesn't cancel those errors, so the count is off by them over
 * the step: with `from` 1000 and `to` 1000.3, `(to - from) / 0.1 + 1` is
 * 3.99999999999954, which an author means as 4. A unit in the last place of
 * a number `x` is at most `Number.EPSILON · |x|`, so 8 of them, of the larger
 * of `from` and `to`, over the step, `8 · Number.EPSILON · max(|from|, |to|)
 * / |step|`, allows for the rounding of holding both and of a few operations
 * computing each. A `to` off the step's grid by more than that (`0.9999999999`,
 * `1000.25`) keeps its count. The step's own error, relative to it, changes
 * the count by a fraction of the count, which `1e-14` of the count allows
 * for (`sequenceLengthOf`).
 *
 * Whole numbers below 2⁵³ are held exactly, so with `from`, `to` and `step`
 * all such numbers there is no error: 0.
 */
export function sequenceCountTolerance({ from, to, step }) {
    if ([from, to, step].every(Number.isSafeInteger)) {
        return 0;
    }
    return countToleranceOf(Math.max(Math.abs(from), Math.abs(to)), step);
}

/**
 * `8 · Number.EPSILON · magnitude / |step|` (see `sequenceCountTolerance`),
 * 0 when that isn't a finite number.
 */
export function countToleranceOf(magnitude, step) {
    const tolerance = (8 * Number.EPSILON * magnitude) / Math.abs(step);
    return Number.isFinite(tolerance) ? tolerance : 0;
}

/**
 * How many values a sequence has, given `count`, `(to - from) / step + 1`
 * as computed: `count` rounded down, except that a count at most
 * `tolerance` below a whole number, after `1e-14` of it is added (as
 * before), is that whole number. `tolerance` is
 * `sequenceCountTolerance` of the sequence's `from`, `to` and `step`.
 *
 * A count is rounded up by less than a half: when the tolerance is that
 * large (a step of no more than some 16 units in the last place of `from`
 * and `to`), floating point doesn't tell the count to within a step, and
 * the nearer whole number is as near as it can be told; a whole count is
 * never made larger.
 */
export function roundSequenceCount(count, tolerance) {
    const counted = count * (1 + 1e-14);
    const length = Math.floor(counted);
    const shortfall = length + 1 - counted;
    return shortfall < 0.5 && shortfall <= tolerance ? length + 1 : length;
}

/**
 * How many values a sequence from `from` toward `to` by `step` has, given
 * `count`, `(to - from) / step + 1` as computed (`roundSequenceCount`).
 */
export function sequenceLengthOf(count, { from, to, step }) {
    return roundSequenceCount(
        count,
        sequenceCountTolerance({ from, to, step }),
    );
}

/** The numeric values of a math sequence's `from`, `to` and `step`. */
function mathMagnitudes({ from, to, step }) {
    return {
        from: numericValue(from),
        to: numericValue(to),
        step: numericValue(step),
    };
}

export function calculateSequenceParameters({ from, to, step, length, type }) {
    // calculate from, length and step from combinatons of from/to/length/step specified

    // the count `(to - from) / step + 1` as computed, when the length is
    // that count rounded
    let count = null;
    const fromWritten = from !== null;
    const countedLength = (computed, magnitudes) => {
        count = computed;
        return sequenceLengthOf(computed, magnitudes);
    };

    if (from === null) {
        if (to === null) {
            if (type === "math") {
                from = me.fromAst(1);
            } else {
                from = 1;
            }
            if (step === null) {
                // no from, to, or step
                if (type === "math") {
                    step = me.fromAst(1);
                } else {
                    step = 1;
                }
                if (length === null) {
                    length = 10;
                }
            } else {
                // no from or to, but step
                if (length === null) {
                    length = 10;
                }
            }
        } else {
            // no from, but to
            if (step === null) {
                if (type === "math") {
                    step = me.fromAst(1);
                } else {
                    step = 1;
                }
            }
            if (length === null) {
                if (type === "math") {
                    length = countedLength(
                        to.subtract(1).divide(step).evaluate_to_constant() + 1,
                        mathMagnitudes({ from: 1, to, step }),
                    );
                } else {
                    length = countedLength((to - 1) / step + 1, {
                        from: 1,
                        to,
                        step,
                    });
                }
            }

            // no from, but to
            // defined step and length even if none
            if (type === "math") {
                from = to.subtract(step.multiply(length - 1)).simplify();
                if (count !== null && length >= 2) {
                    // not before the 1 it counts back to (see below)
                    const first = numericValue(from);
                    const s = numericValue(step);
                    if ((s > 0 && first < 1) || (s < 0 && first > 1)) {
                        from = me.fromAst(1);
                    }
                }
            } else if (type === "number" && count !== null) {
                // counted back from `to` toward 1: the first value is not
                // before 1, which floating point can leave it just before
                // when the count was rounded up to a whole number (and the
                // last is `to`, below). One value is `to`.
                from = to - step * (length - 1);
                if (
                    length >= 2 &&
                    ((step > 0 && from < 1) || (step < 0 && from > 1))
                ) {
                    from = 1;
                }
            } else {
                from = to - step * (length - 1);
                if (type === "letters") {
                    if (from < 1) {
                        // adjust length so that have valid letters
                        length = countedLength((to - 1) / step + 1, {
                            from: 1,
                            to,
                            step,
                        });
                        from = to - step * (length - 1);
                    }
                }
            }
        }
    } else {
        // from defined
        if (to === null) {
            // no to, but from
            if (step === null) {
                if (type === "math") {
                    step = me.fromAst(1);
                } else {
                    step = 1;
                }
            }
            if (length === null) {
                length = 10;
            }
        } else {
            // from and to defined
            if (step === null) {
                if (length === null) {
                    if (type === "math") {
                        step = me.fromAst(1);
                        length = countedLength(
                            to.subtract(from).add(1).evaluate_to_constant(),
                            mathMagnitudes({ from, to, step }),
                        );
                    } else {
                        step = 1;
                        length = countedLength(to - from + 1, {
                            from,
                            to,
                            step,
                        });
                    }
                } else {
                    if (type === "math") {
                        step = to.subtract(from).divide(length - 1);
                    } else {
                        step = (to - from) / (length - 1);
                        // for letters, step must be integer
                        if (type === "letters") {
                            step = Math.floor(step);
                        }
                    }
                }
            } else {
                if (length === null) {
                    // from, to, and step, no length
                    if (type === "math") {
                        length = countedLength(
                            to
                                .subtract(from)
                                .divide(step)
                                .add(1)
                                .evaluate_to_constant(),
                            mathMagnitudes({ from, to, step }),
                        );
                    } else {
                        length = countedLength((to - from) / step + 1, {
                            from,
                            to,
                            step,
                        });
                    }
                } else {
                    // from, to, step, and length defined
                    throw Error(
                        "Can't define from, to, step, and length for sequence",
                    );
                }
            }
        }
    }

    if (!Number.isInteger(length) || length < 0) {
        console.warn(
            "Invalid length of sequence.  Must be a non-negative integer.",
        );
        length = 0;
    }

    return {
        from,
        step,
        length,
        last: lastValueOf({ from, to, step, length, count, type, fromWritten }),
    };
}

/** The number a math (or number) is, `NaN` when it isn't one. */
function numericValue(x) {
    if (typeof x === "number") {
        return x;
    }
    const v = x?.evaluate_to_constant?.();
    return typeof v === "number" ? v : NaN;
}

/**
 * A sequence's last value when it isn't `from + step (length - 1)` as
 * computed: `to`, when the length was rounded up to a whole number
 * (`sequenceLengthOf`) or that computation goes past `to`; otherwise
 * `null`. So the values never go past `to`: computed, the last value of a
 * count rounded up is a little past `to` or a little before it (with `from`
 * 0, `to` 0.3 and step 0.1, `0.30000000000000004`), and it is `to`.
 *
 * Except that the values of a `from` and a step that are whole numbers
 * are whole numbers: with `from` 1 and `to` `(0.1 + 0.7) · 10`, which is
 * 7.999999999999999, the values are 1 to 8, the last within floating point
 * past `to` (#2387: what the author means). Computed, such values are
 * exact, so this is when the count was rounded up.
 */
function lastValueOf({ from, to, step, length, count, type, fromWritten }) {
    if (to === null || !(length >= 2)) {
        // one value is `from` (when the count was rounded up to 1, `to` is
        // within floating point of it, before or after)
        return null;
    }
    const roundedUp = count !== null && length > Math.floor(count);
    let computed;
    if (type === "math") {
        computed = numericValue(
            from
                .add(step.multiply(me.fromAst(length - 1)))
                .expand()
                .simplify(),
        );
    } else {
        computed = from + step * (length - 1);
    }
    const s = numericValue(step);
    const t = numericValue(to);
    if (
        fromWritten &&
        Number.isSafeInteger(numericValue(from)) &&
        Number.isSafeInteger(s) &&
        Number.isSafeInteger(computed)
    ) {
        return null;
    }
    const past = (s > 0 && computed > t) || (s < 0 && computed < t);
    if (!roundedUp && !past) {
        return null;
    }
    return type === "math" ? to.expand().simplify() : to;
}

/**
 * The value at `index` (from 0) of a sequence, before any is excluded:
 * `from + step · index`, except that the last is `last` when that is given
 * (`calculateSequenceParameters`).
 *
 * @param {{ from: any, step: any, length?: number, last?: any, type?: string }} sequence
 * @param {number} index
 */
export function sequenceValueAt({ from, step, length, last, type }, index) {
    if (last !== undefined && last !== null && index === length - 1) {
        return last;
    }
    let value = from;
    if (index > 0) {
        if (type === "math") {
            value = value
                .add(step.multiply(me.fromAst(index)))
                .expand()
                .simplify();
        } else {
            value += step * index;
        }
    }
    return value;
}

export function returnSequenceValues(
    { from, step, length, last, exclude, type, lowercase, maxNum },
    includeOriginalIndex = false,
) {
    let sequenceValues = [];
    let numValues = 0;

    for (let ind = 0; ind < length; ind++) {
        let value = sequenceValueAt({ from, step, length, last, type }, ind);

        if (type === "math") {
            if (exclude.some((x) => x && x.equals(value))) {
                continue;
            }
        } else if (type === "number") {
            if (
                exclude.some(
                    (x) =>
                        Math.abs(x - value) <=
                        1e-14 *
                            Math.max(
                                Math.abs(x),
                                Math.abs(value),
                                Math.abs(step),
                            ),
                )
            ) {
                continue;
            }
        } else {
            if (exclude.includes(value)) {
                continue;
            }
        }

        if (type === "letters") {
            value = numberToLetters(value, lowercase);
        }

        if (includeOriginalIndex) {
            sequenceValues.push({ value, originalIndex: ind });
        } else {
            sequenceValues.push(value);
        }

        numValues++;

        if (numValues === maxNum) {
            break;
        }
    }

    return sequenceValues;
}

/**
 * What a value written to an entry of a sequence stands over: the `from`,
 * `step`, `type` and `exclude` its values are computed from, as one string,
 * so that the value is kept while only its length changes and dropped when
 * its values are computed anew (`listEntryWriteBasisVariable`).
 */
export function returnSequenceWriteBasis({ from, step, type, exclude }) {
    return JSON.stringify([from, step, type, exclude], (key, value) =>
        typeof value === "object" && value?.tree ? value.tree : value,
    );
}

export function returnSequenceValueForIndex({
    index,
    from,
    step,
    length,
    last,
    exclude,
    type,
    lowercase,
}) {
    // note: if index is excluded or index is out of range, returns null

    if (!(index >= 0 && (length === undefined || index < length))) {
        return null;
    }

    let value = sequenceValueAt({ from, step, length, last, type }, index);

    if (type === "math") {
        if (exclude.some((x) => x && x.equals(value))) {
            return null;
        }
    } else if (type === "number") {
        if (
            exclude.some(
                (x) =>
                    Math.abs(x - value) <=
                    1e-14 *
                        Math.max(Math.abs(x), Math.abs(value), Math.abs(step)),
            )
        ) {
            return null;
        }
    } else {
        if (exclude.includes(value)) {
            return null;
        }
    }

    if (type === "letters") {
        value = numberToLetters(value, lowercase);
    }

    return value;
}
