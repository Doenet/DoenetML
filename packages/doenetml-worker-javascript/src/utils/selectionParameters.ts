/**
 * A random selection's parameters, compiled once and computed by one function
 * at load and when the document runs (D39, SEL-5, SEL-6).
 *
 * The load-time check (`utils/dast/choiceFeasibilityAtLoad.ts`) proves that a
 * selection can be made for every value its parameters can take. For that
 * proof to be about the document, the check and the run time must compute a
 * parameter the same way. So a selection whose parameters read a value from
 * the variant or an iteration does not hold them as attribute components (an
 * `<integer>` holding a `<math>` holding a reference, with the sugar,
 * adapters and attributes each brings): the load pass compiles each one into
 * a *template*, arithmetic of constants and *slots*, and the selection holds
 * it in a `_selectionParameter` (`components/abstract/SelectionParameter.js`)
 * whose children are the slots, each holding one reference. When the document
 * runs, the parameter is `parameterValue(template, slot values)`. At load,
 * the check calls the same function, with each slot's value taken from the
 * values it can take.
 *
 * What remains for the two to agree on is what a slot holds: a value another
 * selection drew, a repeat's index or value, a module attribute's value, each
 * a number (or a letter, for a letters sequence) as `slotValue` reads it.
 */
import me from "math-expressions";
import { textToMath } from "./valueFunctions/text";

/**
 * A parameter's value: a number, or a value that isn't one, by its text
 * (`text` when it is a `<text>`'s value, which arithmetic, and a parameter
 * that is a number or a math, read as the text parsed as math, as a
 * `<text>`'s `math` and `number` are).
 */
export type ParameterValue = number | { symbolic: string; text?: true };

/** The operations a template may hold (SEL-6). */
export type ParameterOp =
    | "+"
    | "*"
    | "neg"
    | "/"
    | "min"
    | "max"
    | "abs"
    | "floor"
    | "ceil"
    | "round"
    | "item"
    | "truth";

/**
 * A compiled parameter: constants, slots (by their index among the
 * parameter's children), and operations. `item` is the entry, at the index
 * `args[0]` (from 1), of `args[1..]`. `truth` is a boolean: not 0.
 */
export type ParameterTemplate =
    | { k: "const"; value: ParameterValue }
    | { k: "slot"; slot: number }
    | { k: "op"; op: ParameterOp; args: ParameterTemplate[] };

/**
 * What a parameter is made into, as the attribute the selection reads:
 * - `integer`: a number, rounded (`numToSelect`, `length`, a prime's
 *   `from` and `to`);
 * - `number`: a number (`from`, `to` of a number sequence, `step`);
 * - `boolean`: true or false (`withReplacement`, `coprime`);
 * - `text`: letters, as the text a letters sequence reads (`from`, `to`);
 * - `math`: a number, or a math that isn't one (a math sequence's `from`).
 */
export type ParameterOutput =
    "integer" | "number" | "boolean" | "text" | "math";

/**
 * An entry of a list parameter (`exclude`, a combination of
 * `excludeCombinations`): one value, or every value one slot holds (a
 * reference to a selection of several).
 */
export type ParameterListEntry =
    { k: "entry"; template: ParameterTemplate } | { k: "all"; slot: number };

/** A compiled parameter, as a `_selectionParameter` holds it. */
export type CompiledParameter =
    | { kind: "scalar"; output: ParameterOutput; template: ParameterTemplate }
    | {
          kind: "list";
          output: ParameterOutput;
          entries: ParameterListEntry[];
      }
    | {
          kind: "lists";
          output: ParameterOutput;
          lists: ParameterListEntry[][];
      };

/** What a slot holds: the value of its reference, and of all of them. */
export type SlotValues = {
    value: ParameterValue;
    values: ParameterValue[];
};

/**
 * What a slot holds, from the value its reference has when the document runs
 * (`raw`): a number; a math, its numeric value, or its text when it has none;
 * a text, its text (parsed as math where a number or a math is wanted,
 * `asMath`); a boolean, 1 or 0. Anything else is no number.
 */
export function slotValue(raw: unknown): ParameterValue {
    if (typeof raw === "number") {
        return raw;
    }
    if (typeof raw === "boolean") {
        return raw ? 1 : 0;
    }
    if (typeof raw === "string") {
        return { symbolic: raw, text: true };
    }
    if (raw instanceof me.class) {
        return mathValue(raw);
    }
    return NaN;
}

/** A math's value: its numeric value, or its tree when it has none. */
function mathValue(math: any): ParameterValue {
    const n = math.evaluate_to_constant();
    if (typeof n === "number" && Number.isFinite(n)) {
        return n;
    }
    if (typeof n === "boolean") {
        return n ? 1 : 0;
    }
    return { symbolic: JSON.stringify(math.tree) };
}

/**
 * `v` read as a math: a text parsed as math (`Text.js`'s `math`, so `2` is
 * 2 and `2+1` is 3), anything else as it is.
 */
function asMath(v: ParameterValue): ParameterValue {
    if (typeof v === "number" || !v.text) {
        return v;
    }
    return mathValue(textToMath({ value: v.symbolic, isLatex: false }));
}

/** Whether `v` is true, as a boolean parameter reads it: a number not 0. */
export function truthOfParameter(v: ParameterValue): boolean {
    return typeof v === "number" && v !== 0 && !Number.isNaN(v);
}

/** The value of `template`, given what each slot holds. */
export function evaluateTemplate(
    template: ParameterTemplate,
    slot: (k: number) => ParameterValue,
): ParameterValue {
    if (template.k === "const") {
        return template.value;
    }
    if (template.k === "slot") {
        return slot(template.slot);
    }
    if (template.op === "item") {
        const index = asMath(evaluateTemplate(template.args[0], slot));
        if (typeof index !== "number" || !Number.isInteger(index)) {
            return NaN;
        }
        const item = index >= 1 ? template.args[index] : undefined;
        return item ? evaluateTemplate(item, slot) : NaN;
    }
    const values = template.args.map((arg) => evaluateTemplate(arg, slot));
    if (template.op === "truth") {
        return truthOfParameter(values[0]) ? 1 : 0;
    }
    const nums = values.map(asMath);
    if (!nums.every((v): v is number => typeof v === "number")) {
        return NaN;
    }
    switch (template.op) {
        case "+":
            return nums.reduce((a, b) => a + b, 0);
        case "*":
            return nums.reduce((a, b) => a * b, 1);
        case "neg":
            return -nums[0];
        case "/":
            return nums[0] / nums[1];
        case "min":
            return Math.min(...nums);
        case "max":
            return Math.max(...nums);
        case "abs":
            return Math.abs(nums[0]);
        case "floor":
            return Math.floor(nums[0]);
        case "ceil":
            return Math.ceil(nums[0]);
        case "round":
            return Math.round(nums[0]);
    }
    return NaN;
}

/** `v` made into what the attribute holds (`ParameterOutput`). */
export function outputOf(
    v: ParameterValue,
    output: ParameterOutput,
): ParameterValue {
    if (output === "boolean") {
        return truthOfParameter(v) ? 1 : 0;
    }
    if (output === "text") {
        return typeof v === "number" ? { symbolic: String(v) } : v;
    }
    const m = asMath(v);
    if (output === "math") {
        return m;
    }
    if (typeof m !== "number") {
        return NaN;
    }
    return output === "integer" ? Math.round(m) : m;
}

/**
 * The value of a scalar parameter, or the values of a list parameter, given
 * what its slots hold, as the selection reads them (`ParameterOutput`).
 * `lists` gives an array of arrays.
 */
export function parameterValue(
    parameter: CompiledParameter,
    slots: (k: number) => SlotValues,
): ParameterValue | ParameterValue[] | ParameterValue[][] {
    const one = (k: number) => slots(k).value;
    const listOf = (entries: ParameterListEntry[]) =>
        entries.flatMap((entry) =>
            entry.k === "all"
                ? slots(entry.slot).values.map((v) =>
                      outputOf(v, parameter.output),
                  )
                : [
                      outputOf(
                          evaluateTemplate(entry.template, one),
                          parameter.output,
                      ),
                  ],
        );
    if (parameter.kind === "scalar") {
        return outputOf(
            evaluateTemplate(parameter.template, one),
            parameter.output,
        );
    }
    if (parameter.kind === "list") {
        return listOf(parameter.entries);
    }
    return parameter.lists.map(listOf);
}

/**
 * A parameter's value as the state the selection reads holds it: a boolean
 * for `boolean`, a string for `text`, a number otherwise (`NaN` for no
 * number), and arrays of these for a list.
 */
export function asStateValue(value: any, output: ParameterOutput): any {
    if (Array.isArray(value)) {
        return value.map((v) => asStateValue(v, output));
    }
    if (output === "boolean") {
        return truthOfParameter(value);
    }
    if (output === "text") {
        return typeof value === "number" ? String(value) : value.symbolic;
    }
    if (output === "math") {
        // a math, as a math sequence reads its `from`, `to`, `step` and
        // each of its `exclude` (`equals`)
        if (typeof value === "number") {
            return me.fromAst(value);
        }
        try {
            return me.fromAst(JSON.parse(value.symbolic));
        } catch (e) {
            return me.fromAst(NaN);
        }
    }
    return typeof value === "number" ? value : NaN;
}
