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
 *
 * A parameter the selection reads as a math (a `type="math"` sequence's
 * `from`, `to`, `step` and `exclude`) is computed as a math
 * (`mathOfTemplate`): the same arithmetic, on the math each constant is
 * written as and the math each slot's reference holds, so that the sequence
 * holds what it held when the parameter was a `<math>`: `$a/3` with `$a` = 5
 * is 5/3, not 1.666…. The check reads that math's numeric value
 * (`numberOfParameter`).
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
    | "truth"
    | "number";

/**
 * A compiled parameter: constants, slots (by their index among the
 * parameter's children), and operations. `item` is the entry, at the index
 * `args[0]` (from 1), of `args[1..]`. `truth` is a boolean: not 0. `number`
 * is what a `<number>` or an `<integer>` holding its argument holds: its
 * argument as a number (a math with no numeric value is no number).
 *
 * A constant written as a math has the math's tree as `math`, which a math
 * output holds in place of its numeric `value` (`sqrt(2)`, not 1.414…).
 */
export type ParameterTemplate =
    | { k: "const"; value: ParameterValue; math?: any }
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

/**
 * What a slot holds: the value of its reference, and of all of them; and the
 * same as maths (`slotMath`), as a math output reads them.
 */
export type SlotValues = {
    value: ParameterValue;
    values: ParameterValue[];
    math?: any;
    maths?: any[];
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

/**
 * What a slot holds, from the value its reference has when the document runs
 * (`raw`), as a math output reads it: a math as it is, a number as a math, a
 * text parsed as math. Anything else is no number.
 */
export function slotMath(raw: unknown): any {
    if (raw instanceof me.class) {
        return raw;
    }
    if (typeof raw === "number") {
        return me.fromAst(raw);
    }
    if (typeof raw === "boolean") {
        return me.fromAst(raw ? 1 : 0);
    }
    if (typeof raw === "string") {
        return textToMath({ value: raw, isLatex: false });
    }
    return me.fromAst(NaN);
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
    if (template.op === "number") {
        return typeof nums[0] === "number" ? nums[0] : NaN;
    }
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

/** The math `v` is, as a math output holds it. */
function mathOfValue(v: ParameterValue): any {
    if (typeof v === "number") {
        return me.fromAst(v);
    }
    if (v.text) {
        return textToMath({ value: v.symbolic, isLatex: false });
    }
    try {
        return me.fromAst(JSON.parse(v.symbolic));
    } catch (e) {
        return me.fromAst(NaN);
    }
}

/**
 * The math `template` computes, given the math each slot holds
 * (`slotMath`): the same arithmetic as `evaluateTemplate`, written as a
 * math, as the `<math>` the parameter was written as holds it (`$a/3` with
 * `$a` = 5 is 5/3), each constant the math it is written as. What a
 * `<number>` holds (`number`), an index (`item`) and a `truth` are numbers.
 */
export function mathOfTemplate(
    template: ParameterTemplate,
    slot: (k: number) => { value: ParameterValue; math?: any },
): any {
    if (template.k === "const") {
        return template.math !== undefined
            ? me.fromAst(template.math)
            : mathOfValue(template.value);
    }
    if (template.k === "slot") {
        const held = slot(template.slot);
        return held.math ?? mathOfValue(held.value);
    }
    const numeric = (t: ParameterTemplate) =>
        mathOfValue(evaluateTemplate(t, (k) => slot(k).value));
    if (template.op === "item") {
        const index = asMath(
            evaluateTemplate(template.args[0], (k) => slot(k).value),
        );
        if (typeof index !== "number" || !Number.isInteger(index)) {
            return me.fromAst(NaN);
        }
        const item = index >= 1 ? template.args[index] : undefined;
        return item ? mathOfTemplate(item, slot) : me.fromAst(NaN);
    }
    if (template.op === "truth" || template.op === "number") {
        return numeric(template);
    }
    return me.fromAst(
        mathTreeOfOp(
            template.op,
            template.args.map((arg) => mathOfTemplate(arg, slot).tree),
        ),
    );
}

/**
 * The tree of the math the arithmetic `op` of `trees` is written as (`$a/3`
 * is `["/", a, 3]`), as a `<math>` holding it parses it.
 */
export function mathTreeOfOp(op: ParameterOp, trees: any[]): any {
    switch (op) {
        case "+":
        case "*":
            return [op, ...trees];
        case "neg":
            return ["-", trees[0]];
        case "/":
            return ["/", trees[0], trees[1]];
        case "min":
        case "max":
            return [
                "apply",
                op,
                trees.length === 1 ? trees[0] : ["tuple", ...trees],
            ];
        case "abs":
        case "floor":
        case "ceil":
        case "round":
            return ["apply", op, trees[0]];
    }
    return NaN;
}

/**
 * The value of `template` made into `output`, given what each slot holds:
 * for a `math` output, the math (`mathOfTemplate`); for any other, a
 * `ParameterValue`. The run time holds it; the check reads it with
 * `numberOfParameter`.
 */
export function templateValue(
    template: ParameterTemplate,
    output: ParameterOutput,
    slot: (k: number) => { value: ParameterValue; math?: any },
): any {
    if (output === "math") {
        return mathOfTemplate(template, slot);
    }
    return outputOf(
        evaluateTemplate(template, (k) => slot(k).value),
        output,
    );
}

/**
 * A value `templateValue` (or `parameterValue`) gives, as a
 * `ParameterValue`: a math's numeric value (`evaluate_to_constant`), or its
 * tree when it has none; anything else as it is.
 */
export function numberOfParameter(v: any): ParameterValue {
    return v instanceof me.class ? mathValue(v) : v;
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
 * what its slots hold, as the selection reads them (`ParameterOutput`,
 * `templateValue`: a math for a `math` output). `lists` gives an array of
 * arrays.
 */
export function parameterValue(
    parameter: CompiledParameter,
    slots: (k: number) => SlotValues,
): any {
    const output = parameter.output;
    const listOf = (entries: ParameterListEntry[]) =>
        entries.flatMap((entry) => {
            if (entry.k === "entry") {
                return [templateValue(entry.template, output, slots)];
            }
            const held = slots(entry.slot);
            if (output === "math") {
                return held.values.map(
                    (v, i) => held.maths?.[i] ?? mathOfValue(v),
                );
            }
            return held.values.map((v) => outputOf(v, output));
        });
    if (parameter.kind === "scalar") {
        return templateValue(parameter.template, output, slots);
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
        if (value instanceof me.class) {
            return value;
        }
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
