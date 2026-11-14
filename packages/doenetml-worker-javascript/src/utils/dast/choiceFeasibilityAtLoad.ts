/**
 * Every random choice that can appear can be made as written (D39, SEL-5 to
 * SEL-7). If the DoenetML can't show that, the document has an error, the
 * same in every variant.
 *
 * For each choice (a `<select>`, `<selectFromSequence>` or
 * `<selectPrimeNumbers>`), this pass finds what each parameter the choice
 * reads to decide whether it can select can be, from the DoenetML alone, and
 * checks the choice over every combination of them. It never tries variants,
 * so it does not depend on how variants are seeded (D17).
 *
 * ## One function for the check and the selection
 *
 * A choice whose parameters read a value from the variant or an iteration,
 * and a choice another reads a value of, has each parameter compiled
 * (`utils/selectionParameters.ts`): a template of arithmetic over *slots*,
 * each slot one reference written in the parameter (`named` with its
 * `node`). The choice then holds the parameter in a `_selectionParameter` in
 * place of the attribute component it was written as (`installCompiled`),
 * and, when the document runs, computes it with `parameterValue` from what
 * its slots hold. The check computes it with the same function (a `held`
 * with `compiled`, `evaluateHeld`), from each value a slot can take. So the
 * check and the choice can't read a parameter differently: there is no
 * attribute component, with its sugar, adapters and attributes, for the
 * check to imitate. What the two must agree on is only what a slot holds: a
 * value another choice drew (compiled too), a repeat's index or value, a
 * module attribute's value.
 *
 * Whether a choice can select with values for its parameters is the test
 * the choice itself makes before it draws (`utils/selectionFailure.ts`),
 * which the check calls for each combination of values (`concreteProblem`).
 *
 * What a parameter that reads nothing from the variant or an iteration is
 * written as is its value, computed once now with the run time's own
 * functions (`choiceValuesAsRunTime.ts`, `literalAttributeValue`), and held
 * by the compiled parameter as a constant: `<number>pi</number>` is 3.14…,
 * `<integer>2.4</integer>` is 2. One whose value an attribute may change, so
 * that the check can't compute it, is an error (`doenet-e0074`).
 *
 * ## What a parameter can be (SEL-6)
 *
 * Content that reads no value from the variant or an iteration is its
 * value, whatever its form (`3!`, `$n^2` with `n` a `<number>` written as
 * `3`). Content that reads one is analysable when it is:
 * - a literal;
 * - a reference SEL-1 allows, with a known range, each a slot:
 *   - another random choice, `$a` or `$a[2]` (in a letters sequence's
 *     `from` or `to`, a letters choice): what it can select, found from its
 *     own parameters (SEL-7, so choices are checked in the order their
 *     references give, and a choice reading one in error is that error);
 *   - a repeat's `indexName`: every iteration that can exist, `1` to the
 *     most iterations the repeat can have, or `1, 2, 3, …` with no end when
 *     the count isn't analysable (it may come from an input, SEL-2);
 *   - a repeat's `valueName`, when what the repeat iterates over is in these
 *     forms;
 *   - a module attribute: what the module and each copy of it write;
 * - a `<number>`, `<integer>` or `<math>` whose content is in these forms,
 *   with no attribute that changes how it computes its value, or that
 *   extends one with nothing of its own: its content is compiled into the
 *   parameter, each reference in it a slot. SEL-6 names a `<number>` and an
 *   `<integer>`; a `<math>` is read too, as `numToSelect` read through a
 *   chain of `<math>`s and extends is a test the principles keep binding
 *   (COMP-8, "…initially unresolved");
 * - `+ − ×`, `/`, `min`, `max`, `abs`, `floor`, `ceil` and `round` of these.
 *
 * A boolean parameter (`withReplacement`, `coprime`) is a constant, or one
 * reference alone to a value from the variant (a `<select>` of `<boolean>`
 * options), true when not 0. Anything else is an error (`doenet-e0074`), at
 * the parameter, naming the part that isn't analysable, and the `<number>`
 * it is in when it is in one: a `<boolean>` or `<text>` computed from such a
 * value (`withReplacement="$x > 0"`), an attribute that changes a value
 * (`valueOnNaN`, `convertBoolean`, `simplify`), a reference the check can't
 * read at all (`$p.x`, even when it is the same in every variant).
 *
 * The parameters read are those that decide whether the choice can select:
 * - `<select>`: `numToSelect`, `withReplacement`, and how many options it
 *   has, and which variants they are for (`selectForVariants`);
 * - `<selectFromSequence>`: `from`, `to`, `step`, `length`, `exclude`,
 *   `numToSelect`, `withReplacement`, `coprime`, `excludeCombinations`;
 * - `<selectPrimeNumbers>`: `from`, `to`, `exclude`, `numToSelect`,
 *   `withReplacement`, `excludeCombinations`.
 *
 * An option's `selectWeight` and a `<selectRandomNumbers>`'s parameters
 * can't keep a choice from selecting, so there is nothing to prove of them,
 * and they are not read. (A `<selectRandomNumbers>` read by another choice
 * ranges over what it can draw.)
 *
 * ## The proof (SEL-5)
 *
 * The values a choice reads come from the variant (what other choices
 * select) and from the iteration it is in (an index). The bounds described
 * below are tried first: when they show that the choice can always select
 * (`to="100" exclude="$a $b"`), that is enough, however many combinations
 * of values there are, so a chain of choices each reading the ones before
 * it is checked in time in proportion to its length. Otherwise, when every such value
 * ranges over a finite set, and there are not too many combinations, every
 * combination is checked exactly, as the choice itself would check it when
 * it selects, and the first that fails is named: "when `$a` = 1, it has 1
 * value to select 3 from" (`doenet-e0073`). Values that depend on each other
 * (`to="$a + 2"` and `from="$a"`) are taken together, never as if
 * independent, and two entries of a choice made without replacement
 * (`$a[1]`, `$a[2]`) are never the same value. An exclusion whose value
 * isn't known (a symbol, the values of a choice of several that depend on
 * the variant) may or may not leave a value out: a choice that has too few
 * values only when it does can't be shown to select, which is the error,
 * and isn't said to have too few.
 *
 * Otherwise (an index with no end, a `<selectRandomNumbers>` drawing from
 * an interval, or too many combinations), the check bounds what the choice
 * has to select from, with the parameters as sums of the values they read,
 * so that `to="$i + 5"` and `from="$i"` leave 6 values whatever `$i` is. When
 * the bound doesn't show that the choice can always select, the values at
 * the bound are checked exactly: if the choice can't select with them, they
 * are named, and otherwise the error says that it can't be shown, and over
 * what range.
 *
 * A choice whose parameters read no value from the variant or an iteration
 * is the same in every variant, and is left to the choice itself, which
 * reports a failure as an error (`choicesDecidedByDoenetML`,
 * `choiceErrorsAtLoad.ts`).
 *
 * A choice in error becomes an `_error` in place of the choice, as for
 * SEL-1 (`choiceParametersAtLoad.ts`), and so does a choice that extends or
 * copies it. A choice that extends or copies another takes its parameters
 * from it, and is not checked itself.
 *
 * What isn't checked here, and is left to the choice: the 70% threshold of
 * excluded combinations (`doenet-e0044`, `doenet-e0051`).
 */
import type { ComponentInfoObjects } from "../componentInfoObjects";
import type { SerializedComponent } from "./types";
import me from "math-expressions";
import { lettersToNumber, numberToLetters } from "@doenet/utils";
import { textToMathFactory } from "../math";
import { mathCodePre } from "../valueFunctions/math";
import { createInputStringFromChildren } from "../parseMath";
import {
    calculateSequenceParameters,
    returnSequenceValueForIndex,
} from "../sequence";
import { createPrimesList } from "../primeNumbers";
import {
    coprimeCombinations,
    someValidCombination,
} from "../validCombinations";
import { checkForExcludedCombination } from "../excludeCombinations";
import { doenetMLReferenceAsWritten } from "../sourceLocation";
import { codedDiagnostic } from "../diagnostics";
import {
    attributeNamed,
    componentsUnder,
    createdIdxOf,
    makeChoicesErrors,
    typeMadeBy,
} from "./choiceParametersAtLoad";
import { attributesObjectOf, literalAttributeValue } from "../literalAttribute";
import {
    excludedCombinationsOf,
    optionSelectionFailure,
    primeSelectionFailure,
    sequenceSelectionFailure,
    variantCountFailure,
    type SelectionFailure,
} from "../selectionFailure";
import {
    evaluateTemplate,
    outputOf,
    type CompiledParameter,
    type ParameterListEntry,
    type ParameterOutput,
    type ParameterTemplate,
    type ParameterValue,
} from "../selectionParameters";
import {
    runTimeValue,
    RUN_TIME_TYPES,
    type RunTimeChild,
} from "./choiceValuesAsRunTime";

/** The choices this pass checks: those that can fail to select. */
const CHECKED_TYPES = new Set([
    "select",
    "selectFromSequence",
    "selectPrimeNumbers",
]);

/** The choices whose values another choice may read. */
const CHOICE_TYPES = new Set([...CHECKED_TYPES, "selectRandomNumbers"]);

/**
 * How many combinations of values are checked one by one before the check
 * bounds them instead.
 */
const MAX_COMBINATIONS = 20000;

/**
 * How many values a choice's range may have to be gone through one by one;
 * a longer one is bounded.
 */
const MAX_VALUES = 5000;

/** A value that isn't a number: a symbol, a letter, or a math with one. */
/**
 * A value that isn't a number: a symbol, a letter, a text, or a math with a
 * symbol, named by `symbolic`, and, when it came from a component, the value
 * the component holds (`runTime`, not enumerable, so `symbolic` alone is the
 * value's identity), from which it is read again as the run time reads it.
 */
type Sym = { symbolic: string; runTime?: RunTimeChild };
type Value = number | Sym;

/** The marker of a value the check can't know. */
const UNKNOWN = "\u0000unknown";

/**
 * A value the check can't know, such as an option that isn't one literal:
 * any value, so nothing computed from it is known either.
 */
function unknownValue(): Sym {
    return { symbolic: UNKNOWN };
}

/**
 * Whether a boolean parameter is true with the value `v`: a boolean as it
 * is, a number when not 0 (a literal written as `true` is 1).
 */
function truthOf(v: Value): boolean {
    if (typeof v === "number") {
        return v !== 0 && !Number.isNaN(v);
    }
    return v.runTime?.componentType === "boolean" ? v.runTime.value : false;
}

/** Whether `v` is a value the check can't know (`unknownValue`). */
function isUnknown(v: Value): boolean {
    return typeof v !== "number" && v.symbolic === UNKNOWN;
}

/** A `Sym` named `symbolic` that holds the run-time value `runTime`. */
function sym(symbolic: string, runTime?: RunTimeChild): Sym {
    const value: Sym = { symbolic };
    if (runTime) {
        Object.defineProperty(value, "runTime", {
            value: runTime,
            enumerable: false,
        });
    }
    return value;
}

/**
 * What a reference to an entry a letters choice doesn't select holds: the
 * empty text (`entryPresent`).
 */
const NO_LETTERS: Sym = sym("", { componentType: "text", value: "" });

/**
 * What a parameter is, as an expression in the values it reads (atoms).
 * `item` is the entry, at the index `args[0]` (from 1), of `args[1..]`.
 */
type Expr =
    | { k: "const"; value: Value }
    /**
     * `expr`, written as the reference `label`, which names it in a message.
     * `node` is the reference itself, when it reads a value from the variant
     * or an iteration: a slot of the parameter when it is compiled
     * (`utils/selectionParameters.ts`).
     */
    | { k: "named"; label: string; expr: Expr; node?: any }
    | { k: "atom"; atom: Atom }
    /**
     * A component of type `componentType` (a `<number>`, an `<integer>`, a
     * `<math>`, a `<boolean>`, a `<text>`, or an attribute made one) whose
     * content is `items`: the strings written in it and what each component
     * in it is. Its value is what the component holds when the document
     * runs, computed by the component's own functions
     * (`choiceValuesAsRunTime.ts`). `tree` is the same value as arithmetic
     * of the atoms, in a form the bounds can be found of, or `null` when it
     * isn't arithmetic (a `<boolean>`, a `<text>`, or content with a
     * `<boolean>` in it, which a `<number>` or a `<math>` doesn't read as a
     * number). `caveat` is set when the component has an attribute that
     * changes how it computes its value (`valueCaveatOf`).
     */
    | {
          k: "held";
          componentType: string;
          items: (string | Expr)[];
          tree: Expr | null;
          caveat?: Caveat;
          /**
           * A compiled parameter (`utils/selectionParameters.ts`): its value
           * is `template` computed from `items`, each the value a slot
           * holds, by the function the selection itself computes it with
           * when the document runs.
           */
          compiled?: {
              template: ParameterTemplate;
              output: ParameterOutput;
          };
      }
    | {
          k: "op";
          op:
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
              | "letterNumber";
          args: Expr[];
      };

/**
 * What an attribute of a component does to the value the check computes,
 * with every attribute at its default:
 * - `unknown`: it may change it (`convertBoolean`, a `<math>`'s `format`, a
 *   `<boolean>`'s compare settings, a `<text>`'s `isLatex`), so the value
 *   isn't known;
 * - `number`: it changes only a value that isn't a number (`valueOnNaN`, a
 *   `<math>`'s `simplify` or `expand`), so a number is kept and anything else
 *   isn't known.
 */
type Caveat = "unknown" | "number";

/**
 * The attributes, by component type, that change how a component computes
 * its value, and what each does to the value computed with the defaults.
 */
const VALUE_ATTRIBUTES: Record<string, Record<string, Caveat>> = {
    number: { convertboolean: "unknown", valueonnan: "number" },
    integer: { convertboolean: "unknown", valueonnan: "number" },
    math: {
        format: "unknown",
        functionsymbols: "unknown",
        referencesarefunctionsymbols: "unknown",
        splitsymbols: "unknown",
        parsescientificnotation: "unknown",
        simplify: "number",
        expand: "number",
        createvectors: "number",
        createintervals: "number",
        assumptions: "number",
    },
    boolean: Object.fromEntries(
        [
            "symbolicEquality",
            "expandOnCompare",
            "simplifyOnCompare",
            "unorderedCompare",
            "matchByExactPositions",
            "allowedErrorInNumbers",
            "includeErrorInNumberExponents",
            "allowedErrorIsAbsolute",
            "numSignErrorsMatched",
            "numPeriodicSetMatchesRequired",
            "caseInsensitiveMatch",
            "matchBlanks",
        ].map((name) => [name.toLowerCase(), "unknown" as Caveat]),
    ),
    text: { islatex: "unknown" },
};

/**
 * What the attributes written on `component`, of type `componentType`, do
 * to the value computed with every attribute at its default (`Caveat`), or
 * `undefined` when they change nothing.
 */
function valueCaveatOf(
    component: any,
    componentType: string,
): Caveat | undefined {
    const caveats = VALUE_ATTRIBUTES[componentType] ?? {};
    let found: Caveat | undefined;
    for (const name of Object.keys(component?.attributes ?? {})) {
        const caveat = caveats[name.toLowerCase()];
        if (caveat === "unknown") {
            return caveat;
        }
        found ??= caveat;
    }
    return found;
}

/**
 * Whether `expr` is a boolean, which a `<number>` or a `<math>` doesn't read
 * as a number.
 */
function isBooleanExpr(expr: Expr): boolean {
    if (expr.k === "named") {
        return isBooleanExpr(expr.expr);
    }
    if (expr.k === "held") {
        return expr.componentType === "boolean";
    }
    if (expr.k === "const") {
        return (
            typeof expr.value !== "number" &&
            expr.value.runTime?.componentType === "boolean"
        );
    }
    return false;
}

/**
 * A key of the value `v` that tells apart every value the check can tell
 * apart: `NaN`, `Infinity`, `-Infinity` and `-0` (which `JSON.stringify`
 * makes `null` or `0`), and a text from a boolean or a math.
 */
function valueKey(v: Value | string): string {
    if (typeof v === "string") {
        return JSON.stringify(v);
    }
    if (typeof v === "number") {
        return Object.is(v, -0) ? "n:-0" : `n:${v}`;
    }
    return JSON.stringify([v.runTime?.componentType ?? "", v.symbolic]);
}

/**
 * An entry of a list parameter (`exclude`): one value, or every value a
 * choice selects, of which there are `count`.
 */
type ListEntry =
    Expr | { k: "many"; count: Expr; choice?: any; node?: any; label?: string };

/**
 * A value a choice reads that comes from the variant or the iteration:
 * - `choice`: a value another choice selects;
 * - `index`: a repeat's index;
 * - `seqValue`: a value of a `<repeatForSequence>` that isn't a sum of its
 *   index (one with `exclude`, or letters);
 * - `bool`: a boolean parameter written as a reference;
 * - `moduleAttribute`: a module attribute, which a copy or an extend of the
 *   module can write anew.
 */
type Atom = {
    id: number;
    /** The reference as written, which names it in a message. */
    label: string;
    kind: "choice" | "index" | "seqValue" | "bool" | "moduleAttribute";
    node?: any;
    /** For a `choice`, the entry it is (from 1), when the reference names one. */
    entry?: number;
    /**
     * For a `choice` whose entry is written as an expression (`$a[$k]`), that
     * index, or `null` when the check can't read it. The entry is there only
     * when the index is one of those the choice selects: else the reference
     * is nothing, as is `$a[3]` of a choice of 2 (`entryPresent`).
     */
    index?: Expr | null;
    /**
     * A `bool` whose value the DoenetML decides, though the check doesn't
     * work it out (`withReplacement="x>0"`): both values are checked, but
     * alone it leaves the choice the same in every variant.
     */
    decidedByDoenetML?: boolean;
};

/** What a choice's range is, given values for the atoms it depends on. */
type Domain =
    { finite: Value[] } | { lo: number; hi: number; integer: boolean };

/** What the analysis found of a choice's parameters. */
type ChoiceSpec =
    | {
          type: "selectFromSequence";
          seqType: string;
          /** For letters, whether they are lower case, as the sequence decides. */
          lowercase: boolean;
          from: Expr | null;
          to: Expr | null;
          step: Expr | null;
          length: Expr | null;
          exclude: ListEntry[];
          numToSelect: Expr;
          withReplacement: Expr;
          coprime: Expr;
          excludeCombinations: Expr[][] | null;
      }
    | {
          type: "selectPrimeNumbers";
          from: Expr;
          to: Expr;
          exclude: ListEntry[];
          numToSelect: Expr;
          withReplacement: Expr;
          excludeCombinations: Expr[][] | null;
      }
    | {
          type: "select";
          numToSelect: Expr;
          withReplacement: Expr;
          /** How many options, `null` when the DoenetML doesn't say. */
          numOptions: number | null;
          /** The options for each variant name, when any are given. */
          optionsByVariant: Record<string, number> | null;
          /** What each option is, when each is one value. */
          optionValues: Value[] | null;
      }
    | {
          type: "selectRandomNumbers";
          distribution: string | null;
          from: Expr | null;
          to: Expr | null;
          step: Expr | null;
          numToSelect: Expr;
      };

/**
 * A parameter compiled (`utils/selectionParameters.ts`): the attribute it is
 * written as, the compiled parameter, and the reference written for each of
 * its slots.
 */
type CompiledAttribute = {
    name: string;
    parameter: CompiledParameter;
    slotNodes: any[];
};

/**
 * The parameters compiled of each kind of choice, and what each is made into
 * (`ParameterOutput`; `selectable` is a number, or text for a letters
 * sequence). Unwritten parameters keep their defaults.
 */
const COMPILED_ATTRIBUTES: Record<
    string,
    Record<string, ParameterOutput | "selectable"> | undefined
> = {
    select: { numToSelect: "integer", withReplacement: "boolean" },
    selectFromSequence: {
        numToSelect: "integer",
        from: "selectable",
        to: "selectable",
        step: "number",
        length: "integer",
        withReplacement: "boolean",
        coprime: "boolean",
        exclude: "selectable",
        excludeCombinations: "selectable",
    },
    selectPrimeNumbers: {
        numToSelect: "integer",
        from: "integer",
        to: "integer",
        withReplacement: "boolean",
        exclude: "number",
        excludeCombinations: "number",
    },
    selectRandomNumbers: {
        numToSelect: "integer",
        from: "number",
        to: "number",
        step: "number",
    },
};

/**
 * For tests: what is called with each choice the bounds show can always
 * select, to sample values its parameters can take and check them exactly.
 */
type BoundsObserver = (pass: {
    sample(random: () => number): {
        values: { value: number; lo: number; hi: number }[];
        problem: unknown;
    } | null;
}) => void;
let boundsObserver: BoundsObserver | undefined;
export function setBoundsObserver(observer: BoundsObserver | undefined) {
    boundsObserver = observer;
}

/** A part of a parameter that isn't in an analysable form (SEL-6). */
class NotAnalysable {
    part: string;
    /** The `<number>` or `<integer>` it is in, when it is in one. */
    through?: { componentType: string; reference: string };
    constructor(part: string) {
        this.part = part;
    }
}

/**
 * A parameter that reads a choice already in error, or a reference already
 * reported (a cycle, a name that names nothing): the choice is left
 * unchecked, so the error is reported once.
 */
class Skip {
    /** The choice in error for its parameters that it reads, if that. */
    source?: any;
    constructor(source?: any) {
        this.source = source;
    }
}

/** Why a choice can't select for some values, for `doenet-e0073`. */
type Problem = { kind: string; args: Record<string, string | number> };

const constant = (value: Value): Expr => ({ k: "const", value });

/**
 * Check the feasibility of each choice in `document` (see above), make each
 * one that can't always select an `_error` in place of the choice, and
 * return the errors, to report now.
 */
export function checkChoiceFeasibilityAtLoad({
    document,
    componentInfoObjects,
    sources,
    nComponents,
}: {
    document: SerializedComponent;
    componentInfoObjects: ComponentInfoObjects;
    sources: readonly string[];
    /** How many components the document has, to number those made here. */
    nComponents: number;
}): {
    diagnostics: ReturnType<typeof codedDiagnostic>[];
    nComponents: number;
} {
    currentSources = sources;
    const nodeByIdx = new Map<number, any>();
    const parentOf = new Map<any, any>();
    const nodes: any[] = [];

    function index(node: any, parent: any) {
        nodes.push(node);
        if (parent) {
            parentOf.set(node, parent);
        }
        if (typeof node.componentIdx === "number" && node.componentIdx >= 0) {
            nodeByIdx.set(node.componentIdx, node);
        }
        const created = createdIdxOf(node);
        if (created !== undefined) {
            nodeByIdx.set(created, node);
        }
        for (const under of componentsUnder(node)) {
            index(under, node);
        }
    }
    index(document, undefined);

    const choices = nodes.filter(
        (node) => CHECKED_TYPES.has(node.componentType) && !node.extending,
    );
    if (choices.length === 0) {
        return { diagnostics: [], nComponents };
    }

    let nextAtomId = 0;
    const choiceAtoms = new Map<string, Atom>();
    const indexAtoms = new Map<any, Atom>();
    const seqValueAtoms = new Map<any, Atom>();
    /** What each atom's range is computed from. */
    const atomSources = new Map<Atom, Expr[]>();
    /**
     * The choices another reads a value of: compiled, so that what they hold
     * is what the check finds they can (`installCompiled`).
     */
    const readAsValues = new Set<any>();
    /** Each choice's compiled parameters, by the attribute written. */
    const compiledOf = new Map<any, CompiledAttribute[]>();

    function referenceText(ref: any) {
        return doenetMLReferenceAsWritten(ref?.originalPath, sources);
    }

    // ------------------------------------------------------------------
    // Analysis: each parameter as an expression in the atoms (SEL-6)
    // ------------------------------------------------------------------

    const specs = new Map<any, ChoiceSpec | NotAnalysable | Skip>();
    const inProgress = new Set<any>();

    /** What the choice `choice` reads, analysed, memoized. */
    function specOf(choice: any): ChoiceSpec | NotAnalysable | Skip {
        if (specs.has(choice)) {
            return specs.get(choice)!;
        }
        if (inProgress.has(choice)) {
            // a cycle, which `breakReferenceCycles` reports
            return new Skip();
        }
        inProgress.add(choice);
        let spec: ChoiceSpec | NotAnalysable | Skip;
        try {
            spec = compileChoice(choice, analyseChoice(choice));
        } catch (e) {
            if (e instanceof NotAnalysable || e instanceof Skip) {
                spec = e;
            } else {
                throw e;
            }
        }
        inProgress.delete(choice);
        specs.set(choice, spec);
        return spec;
    }

    /** The attribute named `name` of `node`, if written. */
    function attr(node: any, name: string) {
        return attributeNamed(node, name)?.attribute;
    }

    /** The attribute names of `node` whose analysis failed, by attribute. */
    const failedAttribute = new Map<any, string>();

    function scalarParam(
        choice: any,
        name: string,
        type = "number",
    ): Expr | null {
        const attribute = attr(choice, name);
        if (attribute === undefined) {
            return null;
        }
        try {
            return analyseAttributeScalar(attribute, type);
        } catch (e) {
            if (e instanceof NotAnalysable) {
                failedAttribute.set(choice, attributeNamed(choice, name)!.name);
            }
            throw e;
        }
    }

    function boolParam(choice: any, name: string): Expr {
        const attribute = attr(choice, name);
        if (attribute === undefined) {
            return constant(0);
        }
        const literal = literalBoolean(attribute);
        if (literal !== undefined) {
            return constant(literal ? 1 : 0);
        }
        if (containsError(attribute)) {
            throw new Skip();
        }
        // what the attribute's `<boolean>` holds, as it computes it: a
        // constant when what it reads can't change (`true`, `x>0`, a
        // reference to `<boolean>true</boolean>` or to a `<number>`, true
        // when not 0), and otherwise computed from the values it reads, for
        // each value they can take
        let expr: Expr | null = null;
        try {
            expr = heldOf(
                "boolean",
                analyseAttributeScalar(attribute, "boolean"),
            );
            if (expr.k === "const") {
                return constant(truthOf(expr.value) ? 1 : 0);
            }
        } catch (e) {
            if (e instanceof Skip) {
                // it reads an error, already reported
                throw e;
            }
            // it isn't analysable: true or false, as below
        }
        if (expr) {
            // a module attribute written only in the module is its value
            const fixed = new Map<Atom, Value>();
            const atoms = [...atomsOf([expr])];
            for (const atom of atoms) {
                const sources = atomSources.get(atom) ?? [];
                if (
                    atom.kind === "moduleAttribute" &&
                    atom.decidedByDoenetML &&
                    sources.length === 1
                ) {
                    fixed.set(atom, evaluate(sources[0], new Map()));
                }
            }
            if (fixed.size === atoms.length) {
                return constant(truthOf(evaluate(expr, fixed)) ? 1 : 0);
            }
            return expr;
        }
        // a reference SEL-1 allows that the check can't read: true or
        // false, so both
        const atom: Atom = {
            id: nextAtomId++,
            label: `${attributeNamed(choice, name)!.name}`,
            kind: "bool",
            decidedByDoenetML: !holdsReference(attribute),
        };
        atomSources.set(atom, []);
        return { k: "atom", atom };
    }

    function listParam(
        choice: any,
        name: string,
        type = "number",
    ): ListEntry[] {
        const attribute = attr(choice, name);
        if (attribute === undefined) {
            return [];
        }
        try {
            return analyseAttributeList(attribute, type);
        } catch (e) {
            if (e instanceof NotAnalysable) {
                failedAttribute.set(choice, attributeNamed(choice, name)!.name);
            }
            throw e;
        }
    }

    function combinationsParam(choice: any, type = "number"): Expr[][] | null {
        const attribute = attr(choice, "excludeCombinations");
        if (attribute === undefined) {
            return null;
        }
        try {
            const component = (attribute as any).component;
            const lists = component ? (component.children ?? []) : [];
            const combinations: Expr[][] = [];
            for (const list of lists) {
                if (typeof list === "string") {
                    if (list.trim() !== "") {
                        if (!holdsReference(attribute)) {
                            // brackets that don't balance, which the select
                            // warns of and doesn't use
                            return null;
                        }
                        throw new NotAnalysable(list.trim());
                    }
                    continue;
                }
                if (list.componentType === "_error") {
                    throw new Skip();
                }
                const entries: Expr[] = [];
                for (const entry of listEntriesOf(list.children ?? [], type)) {
                    if (entry.k === "many") {
                        throw new NotAnalysable(
                            textOfChildren(list.children ?? []),
                        );
                    }
                    entries.push(entry);
                }
                combinations.push(entries);
            }
            return combinations;
        } catch (e) {
            if (e instanceof NotAnalysable) {
                failedAttribute.set(
                    choice,
                    attributeNamed(choice, "excludeCombinations")!.name,
                );
            }
            throw e;
        }
    }

    function analyseChoice(choice: any): ChoiceSpec {
        const type = choice.componentType;
        const numToSelect = scalarParam(choice, "numToSelect") ?? constant(1);
        if (type === "selectFromSequence") {
            const seqType = String(
                attr(choice, "type")?.primitive?.value ?? "number",
            ).toLowerCase();
            // what a value of the sequence is written as
            const valueType = seqType === "math" ? "math" : "number";
            const sequenceAttribute = (name: string) =>
                seqType === "letters"
                    ? lettersParam(choice, name)
                    : scalarParam(choice, name, valueType);
            // as the sequence decides: by `from` if written, else `to`
            const caseAttribute = attr(choice, "from") ?? attr(choice, "to");
            const caseText =
                caseAttribute === undefined
                    ? undefined
                    : literalTextOf(caseAttribute);
            return {
                type,
                seqType,
                lowercase: caseText === undefined || !/^[A-Z]*$/.test(caseText),
                from: sequenceAttribute("from"),
                to: sequenceAttribute("to"),
                step: scalarParam(choice, "step", "math"),
                length: scalarParam(choice, "length", "integer"),
                exclude:
                    seqType === "letters"
                        ? lettersListParam(choice)
                        : listParam(choice, "exclude", valueType),
                numToSelect,
                withReplacement: boolParam(choice, "withReplacement"),
                coprime: boolParam(choice, "coprime"),
                excludeCombinations:
                    seqType === "letters"
                        ? (combinationsParam(choice, "text")?.map((c) =>
                              c.map(lettersLiteral),
                          ) ?? null)
                        : combinationsParam(choice, valueType),
            };
        }
        if (type === "selectPrimeNumbers") {
            return {
                type,
                from: scalarParam(choice, "from") ?? constant(2),
                to: scalarParam(choice, "to") ?? constant(100),
                exclude: listParam(choice, "exclude"),
                numToSelect,
                withReplacement: boolParam(choice, "withReplacement"),
                excludeCombinations: combinationsParam(choice),
            };
        }
        if (type === "selectRandomNumbers") {
            const distribution = attr(choice, "type");
            const literal =
                distribution === undefined
                    ? "uniform"
                    : literalTextOf(distribution)?.toLowerCase();
            let from: Expr | null = null;
            let to: Expr | null = null;
            let step: Expr | null = null;
            try {
                from = scalarParam(choice, "from");
                to = scalarParam(choice, "to");
                step = scalarParam(choice, "step");
            } catch (e) {
                if (!(e instanceof NotAnalysable)) {
                    throw e;
                }
                // its values are then any number
                from = to = step = null;
                return {
                    type,
                    distribution: null,
                    from,
                    to,
                    step,
                    numToSelect,
                };
            }
            return {
                type,
                distribution: literal ?? null,
                from,
                to,
                step,
                numToSelect,
            };
        }
        // `<select>`
        return {
            type: "select",
            numToSelect,
            withReplacement: boolParam(choice, "withReplacement"),
            ...optionsOf(choice),
        };
    }

    /** How many options a `<select>` has, and what they are. */
    function optionsOf(select: any) {
        let numOptions: number | null = 0;
        let optionsByVariant: Record<string, number> | null = null;
        let optionValues: Value[] | null = [];
        const options: any[] = [];
        for (const child of select.children ?? []) {
            if (typeof child === "string") {
                if (child.trim() !== "") {
                    numOptions = null;
                }
                continue;
            }
            if (child.componentType === "option") {
                options.push(child);
            } else if (
                child.componentType === "_copy" &&
                (child.doenetAttributes?.extendErrorsAtLoad ?? []).length > 0
            ) {
                // an extend in error is that error, and no option
                continue;
            } else if (
                child.componentType === "_copy" &&
                typeMadeBy(child) === "option" &&
                Object.values(child.extending ?? {}).every(
                    (ref: any) => ref?.unresolvedPath === null,
                )
            ) {
                options.push(child);
                optionValues = null;
            } else {
                numOptions = null;
            }
        }
        if (numOptions !== null) {
            numOptions = options.length;
        }
        for (const option of options) {
            const variants = attr(option, "selectForVariants");
            if (variants !== undefined) {
                const text = variantNamesText(variants);
                if (text === undefined) {
                    continue;
                }
                optionsByVariant ??= {};
                for (const name of text.split(/\s+/).filter(Boolean)) {
                    const lower = name.toLowerCase();
                    optionsByVariant[lower] =
                        (optionsByVariant[lower] ?? 0) + 1;
                }
            }
            if (optionValues) {
                const value = literalValueOfOption(option);
                if (value === undefined) {
                    optionValues = null;
                } else {
                    optionValues.push(value);
                }
            }
        }
        if (numOptions === null) {
            optionValues = null;
        }
        return { numOptions, optionsByVariant, optionValues };
    }

    /**
     * What an option is, when it is one value written as a literal, as the
     * component it is (or a `<math>`, that text in an option is) holds it.
     */
    function literalValueOfOption(option: any): Value | undefined {
        const children = (option.children ?? []).filter(
            (c: any) => typeof c !== "string" || c.trim() !== "",
        );
        if (children.length !== 1) {
            return undefined;
        }
        const child = children[0];
        if (
            typeof child !== "string" &&
            !["math", "number", "integer", "text", "boolean"].includes(
                child.componentType,
            )
        ) {
            return undefined;
        }
        try {
            const expr = analyseInPlace(child, "math");
            return expr.k === "const" ? expr.value : undefined;
        } catch (e) {
            if (e instanceof NotAnalysable || e instanceof Skip) {
                return undefined;
            }
            throw e;
        }
    }

    /**
     * A letters sequence's `from` or `to`: the text its attribute holds, as
     * the sequence reads it as letters (`lettersToNumber`), so a text that
     * isn't letters, such as one with space around a letter, is no value.
     */
    function lettersParam(choice: any, name: string): Expr | null {
        const attribute = attr(choice, name);
        if (attribute === undefined) {
            return null;
        }
        let text: Expr;
        try {
            text = analyseAttributeScalar(attribute, "text");
        } catch (e) {
            if (e instanceof NotAnalysable) {
                failedAttribute.set(choice, attributeNamed(choice, name)!.name);
            }
            throw e;
        }
        // kept as the text and the letters it is, so that a compiled
        // parameter holds the text (`letterTextOf`)
        return { k: "op", op: "letterNumber", args: [text] };
    }

    /**
     * The atom `expr` is, when it is a value a letters `<selectFromSequence>`
     * selects, written as a reference.
     */
    function lettersChoiceAtom(expr: Expr): Atom | null {
        let inner = expr;
        while (inner.k === "named" || inner.k === "held") {
            if (inner.k === "named") {
                inner = inner.expr;
            } else {
                // only a reference written alone is that letter: any text
                // around it is part of the text (`$a ` isn't letters)
                const items = inner.items.filter((item) => item !== "");
                if (items.length !== 1 || typeof items[0] === "string") {
                    return null;
                }
                inner = items[0];
            }
        }
        if (inner.k !== "atom" || inner.atom.kind !== "choice") {
            return null;
        }
        const spec = specOf(inner.atom.node);
        return !(spec instanceof NotAnalysable) &&
            !(spec instanceof Skip) &&
            spec.type === "selectFromSequence" &&
            spec.seqType === "letters"
            ? inner.atom
            : null;
    }

    /** Letters written as a literal, as the number a letters sequence has. */
    function lettersLiteral(entry: Expr): Expr {
        if (entry.k === "const" && typeof entry.value !== "number") {
            const number = lettersToNumber(entry.value.symbolic);
            return number === undefined ? entry : constant(number);
        }
        return entry;
    }

    function lettersListParam(choice: any): ListEntry[] {
        return listParam(choice, "exclude", "text").map((entry) =>
            entry.k === "many" ? entry : lettersLiteral(entry),
        );
    }

    /** The attribute `attribute` as one value. */
    function analyseAttributeScalar(attribute: any, type = "number"): Expr {
        if (attribute.type === "primitive") {
            const value = attribute.primitive?.value;
            if (typeof value === "number") {
                return constant(value);
            }
            if (typeof value === "boolean") {
                return constant(value ? 1 : 0);
            }
            return analyseContent([String(value)], type);
        }
        if (attribute.type === "literal") {
            // as the attribute holds it (`literalAttributeValue`)
            if (typeof attribute.value === "boolean") {
                return constant(attribute.value ? 1 : 0);
            }
            const literalType = attribute.componentType;
            if (["number", "integer", "math", "text"].includes(literalType)) {
                const value = literalAttributeValue(
                    attribute,
                    componentInfoObjects,
                );
                return constant(
                    fromRunTime(
                        literalType === "math"
                            ? { componentType: "math", value }
                            : literalType === "text"
                              ? { componentType: "text", value }
                              : { componentType: "number", value },
                    ),
                );
            }
            return analyseContent([String(attribute.text ?? "")], type);
        }
        if (attribute.component) {
            return analyseInPlace(attribute.component, type);
        }
        throw new NotAnalysable(writtenText(attribute));
    }

    /** The attribute `attribute` as a list of values of type `type`. */
    function analyseAttributeList(
        attribute: any,
        type = "number",
    ): ListEntry[] {
        if (attribute.type === "primitive" || attribute.type === "literal") {
            const text =
                attribute.type === "literal"
                    ? String(attribute.text ?? "")
                    : String(attribute.primitive?.value ?? "");
            return listEntriesOf([text], type);
        }
        const component = attribute.component;
        if (!component) {
            throw new NotAnalysable(writtenText(attribute));
        }
        if (component.componentType === "_error") {
            throw new Skip();
        }
        if (
            component.componentType === "_copy" ||
            component.componentType === "_ref"
        ) {
            return listOfReference(component, type);
        }
        return listEntriesOf(component.children ?? [], type);
    }

    /**
     * The entries of a list written as `children`, each a value of type
     * `type` (text written in it is split at spaces and commas, as the list
     * splits it).
     */
    function listEntriesOf(children: any[], type = "number"): ListEntry[] {
        const entries: ListEntry[] = [];
        for (const child of children) {
            if (typeof child === "string") {
                for (const part of child.split(/[\s,]+/).filter(Boolean)) {
                    entries.push(analyseContent([part], type));
                }
                continue;
            }
            if (child.componentType === "_error") {
                throw new Skip();
            }
            if (
                child.componentType === "_copy" ||
                child.componentType === "_ref"
            ) {
                entries.push(...listOfReference(child, type));
                continue;
            }
            entries.push(analyseInPlace(child, type));
        }
        return entries;
    }

    /** What a reference in a list stands for: one value, or several. */
    function listOfReference(node: any, type = "number"): ListEntry[] {
        const ref = refOf(node);
        const target = ref && nodeByIdx.get(ref.nodeIdx);
        if (
            ref &&
            target &&
            ref.unresolvedPath === null &&
            CHOICE_TYPES.has(target.componentType)
        ) {
            // every value the choice selects
            const spec = specOf(target);
            if (spec instanceof Skip) {
                throw spec;
            }
            if (spec instanceof NotAnalysable) {
                throw new Skip(target);
            }
            const count =
                spec.numToSelect.k === "const" ? spec.numToSelect : null;
            if (count && count.value === 1) {
                return [slotOf(choiceAtomExpr(target, 1, ref), ref, node)];
            }
            readAsValues.add(target);
            return [
                {
                    k: "many",
                    count: spec.numToSelect,
                    choice: target,
                    node,
                    label: referenceText(ref),
                },
            ];
        }
        if (
            ref &&
            target &&
            ref.unresolvedPath === null &&
            ["numberList", "mathList", "textList"].includes(
                target.componentType,
            ) &&
            !target.extending
        ) {
            return listEntriesOf(
                target.children ?? [],
                target.componentType === "textList"
                    ? "text"
                    : target.componentType === "mathList"
                      ? "math"
                      : "number",
            );
        }
        if (
            ref &&
            target &&
            ref.unresolvedPath === null &&
            target.componentType === "sequence" &&
            !target.extending
        ) {
            return sequenceEntries(target, ref);
        }
        return [analyseReference(node)];
    }

    /**
     * The values of a `<sequence>` written in a list (`exclude="$odds"`),
     * when its parameters are literals.
     */
    function sequenceEntries(sequence: any, ref: any): ListEntry[] {
        const seqType = String(
            attr(sequence, "type")?.primitive?.value ?? "number",
        ).toLowerCase();
        if (seqType !== "number" || attr(sequence, "exclude") !== undefined) {
            throw new NotAnalysable(referenceText(ref));
        }
        const read = (name: string) => {
            const attribute = attr(sequence, name);
            return attribute === undefined
                ? null
                : analyseAttributeScalar(attribute);
        };
        const params = {
            seqType,
            from: read("from"),
            to: read("to"),
            step: read("step"),
            length: read("length"),
        };
        if (
            [params.from, params.to, params.step, params.length].some(
                (e) => e && e.k !== "const",
            )
        ) {
            throw new NotAnalysable(referenceText(ref));
        }
        const seq = concreteSequence(params, (e) => evaluate(e, new Map()));
        if (!seq || seq.length > 10 * MAX_VALUES) {
            throw new NotAnalysable(referenceText(ref));
        }
        return Array.from({ length: seq.length }, (_, i) =>
            constant(seq.from + i * seq.step),
        );
    }

    /**
     * A component written in place in a parameter: the components an
     * attribute is made of (a `<number>`, an `<integer>`, a `<math>`, a
     * `<boolean>`, a `<text>`), or a reference. A string is read as a
     * component of type `type` reads it.
     */
    function analyseInPlace(node: any, type = "number"): Expr {
        if (typeof node === "string") {
            return analyseContent([node], type);
        }
        const componentType = node.componentType;
        if (componentType === "_error") {
            throw new Skip();
        }
        if (componentType === "_copy" || componentType === "_ref") {
            return analyseReference(node);
        }
        if (
            componentType === "_componentWithSelectableType" &&
            !node.extending
        ) {
            // what it holds, as the type it was made for
            const meaningful = (node.children ?? []).filter(
                (child: any) =>
                    typeof child !== "string" || child.trim() !== "",
            );
            return meaningful.length === 1 && typeof meaningful[0] !== "string"
                ? analyseInPlace(meaningful[0], type)
                : analyseContent(node.children ?? [], type);
        }
        if (RUN_TIME_TYPES.has(componentType) && !node.extending) {
            return analyseContent(node.children ?? [], componentType, node);
        }
        throw new NotAnalysable(textOfChildren([node]));
    }

    /**
     * Content written as text and references, as a component of type `type`
     * holds it (`held`). With no reference in it, it is a literal: its value,
     * as the component computes it. With one, each reference in it is
     * analysed, and its text is parsed as math into `tree`, which must be in
     * one of the forms SEL-6 allows, unless it is a `<boolean>` or a
     * `<text>`, whose value is only ever computed.
     */
    function analyseContent(
        children: any[],
        type = "number",
        component?: any,
    ): Expr {
        // a label names the value, and is no part of it
        children = children.filter(
            (child) =>
                typeof child === "string" || child.componentType !== "label",
        );
        const components = children.filter(
            (child) => typeof child !== "string",
        );
        const componentExprs = components.map((component) =>
            analyseInPlace(component, type),
        );
        const exprOf = new Map<any, Expr>(
            components.map((component, k) => [component, componentExprs[k]]),
        );
        const held: Extract<Expr, { k: "held" }> = {
            k: "held",
            componentType: RUN_TIME_TYPES.has(type) ? type : "number",
            items: children.map((child) =>
                typeof child === "string" ? child : exprOf.get(child)!,
            ),
            tree: null,
        };
        const caveat = component
            ? valueCaveatOf(component, held.componentType)
            : undefined;
        if (caveat) {
            held.caveat = caveat;
        }
        if (atomsOf(componentExprs).size === 0) {
            // what it is written as decides it: its value
            return constant(evaluate(held, new Map()));
        }
        if (held.componentType === "boolean" || held.componentType === "text") {
            return held;
        }
        const meaningful = children.filter(
            (child) => typeof child !== "string" || child.trim() !== "",
        );
        let tree: Expr;
        if (meaningful.length === 1) {
            tree = exprOf.get(meaningful[0])!;
        } else {
            const strings = children.filter(
                (child) => typeof child === "string",
            ) as string[];
            const codePre = mathCodePre(strings);
            const parser = textToMathFactory({ functionSymbols: ["f", "g"] });
            const { string } = createInputStringFromChildren({
                children,
                codePre,
                format: "text",
                parser,
            });
            let parsed: any;
            try {
                parsed = parser(string).tree;
            } catch (e) {
                throw new NotAnalysable(textOfChildren(children));
            }
            const codes = new Map<string, { expr: Expr; component: any }>();
            components.forEach((component, k) => {
                codes.set(codePre + k, {
                    expr: componentExprs[k],
                    component,
                });
            });
            tree = fromTree(parsed, codes, children);
        }
        if (caveat || componentExprs.some(isBooleanExpr)) {
            // its arithmetic may not be its value: an attribute may change
            // it, and a `<boolean>` in a `<number>` or a `<math>` is no
            // number (`NaN` alone, and no part of what it is with more)
            return held;
        }
        // an `<integer>` rounds what it holds
        held.tree =
            held.componentType === "integer"
                ? { k: "op", op: "round", args: [tree] }
                : tree;
        return held;
    }

    /**
     * `expr` held by a component of type `type`, such as one made by an
     * extend (`<integer extend="$n"/>`), which converts it as the run time
     * does.
     */
    function heldOf(
        type: string | undefined,
        expr: Expr,
        caveat?: Caveat,
    ): Expr {
        if (!type || !RUN_TIME_TYPES.has(type)) {
            return expr;
        }
        const held: Extract<Expr, { k: "held" }> = {
            k: "held",
            componentType: type,
            items: [expr],
            ...(caveat ? { caveat } : {}),
            tree:
                type === "boolean" || type === "text" || isBooleanExpr(expr)
                    ? null
                    : type === "integer"
                      ? { k: "op", op: "round", args: [expr] }
                      : expr,
        };
        if (caveat) {
            held.tree = null;
        }
        return atomsOf([expr]).size === 0
            ? constant(evaluate(held, new Map()))
            : held;
    }

    /**
     * A math-expressions tree as arithmetic of the atoms, the structure of
     * what a component holds, for the bounds (SEL-6: its forms).
     */
    function fromTree(
        tree: any,
        codes: Map<string, { expr: Expr; component: any }>,
        children: any[],
    ): Expr {
        function partText(sub: any) {
            let text: string;
            try {
                text = me.fromAst(sub).toString();
            } catch (e) {
                text = textOfChildren(children);
            }
            for (const [code, { component }] of codes) {
                text = text.split(code).join(textOfChildren([component]));
            }
            return text;
        }
        function hasCode(sub: any): boolean {
            if (typeof sub === "string") {
                return codes.has(sub);
            }
            return Array.isArray(sub) && sub.some(hasCode);
        }
        function convert(sub: any): Expr {
            if (typeof sub === "number") {
                return constant(sub);
            }
            if (typeof sub === "string" && codes.has(sub)) {
                return codes.get(sub)!.expr;
            }
            if (!hasCode(sub)) {
                // a literal part
                const value = numberOfTree(sub);
                if (value !== undefined) {
                    return constant(value);
                }
                throw new NotAnalysable(partText(sub));
            }
            if (!Array.isArray(sub)) {
                throw new NotAnalysable(partText(sub));
            }
            const [op, ...operands] = sub;
            if (op === "+" || op === "*") {
                return { k: "op", op, args: operands.map(convert) };
            }
            if (op === "-" && operands.length === 1) {
                return { k: "op", op: "neg", args: [convert(operands[0])] };
            }
            if (op === "/" && operands.length === 2) {
                return { k: "op", op: "/", args: operands.map(convert) };
            }
            if (op === "apply" && operands.length === 2) {
                const [name, argument] = operands;
                const args =
                    Array.isArray(argument) && argument[0] === "tuple"
                        ? argument.slice(1)
                        : [argument];
                if ((name === "min" || name === "max") && args.length >= 1) {
                    return { k: "op", op: name, args: args.map(convert) };
                }
                if (
                    ["abs", "floor", "ceil", "round"].includes(name) &&
                    args.length === 1
                ) {
                    return { k: "op", op: name, args: args.map(convert) };
                }
            }
            throw new NotAnalysable(partText(sub));
        }
        return convert(tree);
    }

    /** What a reference written in a parameter is (SEL-6). */
    function analyseReference(node: any): Expr {
        const ref = refOf(node);
        if (!ref) {
            throw new NotAnalysable(textOfChildren([node]));
        }
        const target = nodeByIdx.get(ref.nodeIdx);
        if (!target) {
            // names nothing: a blank, already reported
            throw new Skip();
        }
        return analyseNamed(target, ref, ref.unresolvedPath ?? [], node);
    }

    /**
     * `expr`, what the reference `node` reads, as one value from the
     * variant or an iteration: a slot of the parameter (`named` with
     * `node`).
     */
    function slotOf(expr: Expr, ref: any, node: any): Expr {
        return node === undefined
            ? expr
            : { k: "named", label: referenceText(ref), expr, node };
    }

    /**
     * What `target`, named by `ref`, with what is left of its path, is.
     * `node` is the reference written in the parameter, which becomes a slot
     * when what it reads comes from the variant or an iteration.
     */
    function analyseNamed(
        target: any,
        ref: any,
        path: any[],
        node?: any,
    ): Expr {
        const type = target.componentType;
        if (
            type === "_error" ||
            // an extend marked with its error (`extendErrorsAtLoad.ts`)
            // becomes an `_error`: that error, already reported
            (target.doenetAttributes?.extendErrorsAtLoad ?? []).length > 0
        ) {
            throw new Skip();
        }
        // a property `value` is the value itself
        if (
            path.length === 1 &&
            path[0]?.name?.toLowerCase() === "value" &&
            (path[0].index ?? []).length === 0
        ) {
            path = [];
        }
        if (CHOICE_TYPES.has(type)) {
            const spec = specOf(target);
            if (spec instanceof Skip) {
                throw spec;
            }
            if (spec instanceof NotAnalysable) {
                // reported at that choice
                throw new Skip(target);
            }
            if (path.length === 0) {
                if (
                    spec.numToSelect.k !== "const" ||
                    spec.numToSelect.value !== 1
                ) {
                    // several values where one is read
                    throw new NotAnalysable(referenceText(ref));
                }
                return slotOf(choiceAtomExpr(target, 1, ref), ref, node);
            }
            if (
                path.length === 1 &&
                (path[0].name ?? "") === "" &&
                (path[0].index ?? []).length === 1
            ) {
                const entry = literalIndex(path[0].index[0]);
                let index: Expr | null = null;
                if (entry === undefined) {
                    try {
                        index = analyseContent(path[0].index[0]?.value ?? []);
                    } catch (e) {
                        if (!(e instanceof NotAnalysable)) {
                            throw e;
                        }
                    }
                }
                return slotOf(
                    choiceAtomExpr(target, entry ?? "any", ref, index),
                    ref,
                    node,
                );
            }
            throw new NotAnalysable(referenceText(ref));
        }
        if (
            (type === "repeat" || type === "repeatForSequence") &&
            path.length === 2 &&
            (path[0].name ?? "") === "" &&
            (path[0].index ?? []).length === 1 &&
            literalIndex(path[0].index[0]) !== undefined &&
            (path[1].index ?? []).length === 0 &&
            path[1].name
        ) {
            // a component in an iteration (`$r[1].n`), as its template has
            // it, over every iteration
            const named = namedInTemplate(target, path[1].name);
            if (named) {
                const expr = analyseNamed(named, ref, []);
                if (atomsOf([expr]).size > 0) {
                    // what an iteration's content reads in that iteration
                    // isn't a value from where the parameter is
                    throw new NotAnalysable(referenceText(ref));
                }
                return expr;
            }
        }
        if (
            ["numberList", "mathList"].includes(type) &&
            !target.extending &&
            path.length === 1 &&
            (path[0].name ?? "") === "" &&
            (path[0].index ?? []).length === 1
        ) {
            // an entry of a list written as literals (`$ns[$k]`)
            const entries = listEntriesOf(
                target.children ?? [],
                type === "mathList" ? "math" : "number",
            );
            if (entries.every((e) => e.k !== "many")) {
                const indexValue = path[0].index[0]?.value ?? [];
                return {
                    k: "op",
                    op: "item",
                    args: [analyseContent(indexValue), ...(entries as Expr[])],
                };
            }
        }
        if (path.length > 0) {
            throw new NotAnalysable(referenceText(ref));
        }
        if (parentOf.get(target)?.componentType === "moduleAttributes") {
            return slotOf(
                { k: "atom", atom: moduleAttributeAtom(target, ref) },
                ref,
                node,
            );
        }
        const iteration = iterationVariable(target);
        if (iteration) {
            return iteration.kind === "index"
                ? slotOf(
                      { k: "atom", atom: indexAtom(iteration.repeat, ref) },
                      ref,
                      node,
                  )
                : repeatValue(iteration.repeat, ref, node);
        }
        if (RUN_TIME_TYPES.has(type) && !target.extending) {
            try {
                return analyseContentOf(target);
            } catch (e) {
                if (e instanceof NotAnalysable && !e.through) {
                    e.through = {
                        componentType: type,
                        reference: referenceText(ref),
                    };
                }
                throw e;
            }
        }
        if (type === "_copy" && target.extending) {
            // a component that is a copy of another, written with no change
            const inner = refOf(target);
            const named = inner && nodeByIdx.get(inner.nodeIdx);
            if (
                named &&
                inner.unresolvedPath === null &&
                (target.children ?? []).length === 0 &&
                Object.keys(target.attributes ?? {}).every(
                    (name) => name === "name" || name.startsWith("_"),
                )
            ) {
                return heldOf(
                    target.attributes?._createComponentOfType?.primitive?.value,
                    analyseNamed(named, ref, [], node),
                );
            }
        }
        throw new NotAnalysable(referenceText(ref));
    }

    const moduleAttributeAtoms = new Map<any, Atom>();

    /**
     * A module attribute (`<moduleAttributes><integer name="k">2</integer>`):
     * what it is written as, or what a copy or an extend of the module
     * (through a chain of them) writes for it (`k="4"`). When nothing writes
     * it anew, it is the same in every instance of the module, and leaves
     * the choice to decide its own error.
     */
    function moduleAttributeAtom(attribute: any, ref: any): Atom {
        let atom = moduleAttributeAtoms.get(attribute);
        if (atom) {
            return atom;
        }
        const module = parentOf.get(parentOf.get(attribute));
        const name = attribute.attributes?.name?.primitive?.value;
        const sources: Expr[] = [analyseContentOf(attribute)];
        // the module, and each copy or extend of it, through a chain
        const modules = new Set<any>([module]);
        let added = true;
        while (added) {
            added = false;
            for (const node of nodes) {
                if (modules.has(node) || typeMadeBy(node) !== "module") {
                    continue;
                }
                const source = refOf(node);
                const named =
                    source && source.unresolvedPath === null
                        ? nodeByIdx.get(source.nodeIdx)
                        : undefined;
                if (named && modules.has(named)) {
                    modules.add(node);
                    added = true;
                    if (
                        (node.doenetAttributes?.extendErrorsAtLoad ?? [])
                            .length > 0
                    ) {
                        // an extend can't write it, which is its error
                        continue;
                    }
                    // a `copyWithState` keeps its source's choices, but a
                    // copy of it chooses again with what it writes, so it
                    // counts too
                    const written =
                        name === undefined
                            ? undefined
                            : attributeNamed(node, name)?.attribute;
                    if (written !== undefined) {
                        sources.push(
                            analyseWrittenAttribute(
                                written,
                                attribute.componentType,
                                attribute,
                            ),
                        );
                    }
                }
            }
        }
        atom = {
            id: nextAtomId++,
            label: referenceText(ref),
            kind: "moduleAttribute",
            node: attribute,
            // written only in the module: the same in every instance
            decidedByDoenetML:
                sources.length === 1 && atomsOf(sources).size === 0,
        };
        moduleAttributeAtoms.set(attribute, atom);
        atomSources.set(atom, sources);
        return atom;
    }

    /** An attribute written on a copy of a module, not yet expanded. */
    function analyseWrittenAttribute(
        written: any,
        type: string,
        attribute: any,
    ): Expr {
        if (written.type === "unresolved") {
            // made the module attribute's component when the copy is made,
            // with the attributes it has in the module
            return analyseContent(written.children ?? [], type, attribute);
        }
        return heldOf(
            type,
            analyseAttributeScalar(written, type),
            valueCaveatOf(attribute, type),
        );
    }

    /**
     * The component named `name` in the template of `repeat`, not in a
     * repeat inside it.
     */
    function namedInTemplate(repeat: any, name: string): any {
        function visit(children: any[]): any {
            for (const child of children) {
                if (typeof child !== "object" || child === null) {
                    continue;
                }
                const childName =
                    child.attributes?.name?.primitive?.value ??
                    child.attributes?._createComponentName?.primitive?.value;
                if (childName === name) {
                    return child;
                }
                if (
                    child.componentType !== "repeat" &&
                    child.componentType !== "repeatForSequence"
                ) {
                    const found = visit(child.children ?? []);
                    if (found) {
                        return found;
                    }
                }
            }
            return undefined;
        }
        return visit(repeat.children ?? []);
    }

    const contentMemo = new Map<any, Expr | NotAnalysable | Skip>();
    function analyseContentOf(target: any): Expr {
        if (contentMemo.has(target)) {
            const found = contentMemo.get(target)!;
            if (found instanceof NotAnalysable || found instanceof Skip) {
                throw found;
            }
            return found;
        }
        contentMemo.set(target, new Skip());
        try {
            const expr = analyseContent(
                target.children ?? [],
                target.componentType,
                target,
            );
            contentMemo.set(target, expr);
            return expr;
        } catch (e) {
            if (e instanceof NotAnalysable || e instanceof Skip) {
                contentMemo.set(target, e);
            }
            throw e;
        }
    }

    /** The atoms of the entries (`$a[2]`) of each choice, by the choice. */
    const entryAtomsOf = new Map<any, Atom[]>();

    /** The atom of a value the choice `choice` selects. */
    function choiceAtomExpr(
        choice: any,
        entry: number | "any",
        ref: any,
        index?: Expr | null,
    ): Expr {
        const key =
            entry === "any"
                ? `${nextAtomId}:any`
                : `${choice.componentIdx}:${entry}`;
        let atom = choiceAtoms.get(key);
        if (!atom) {
            atom = {
                id: nextAtomId++,
                label: referenceText(ref),
                kind: "choice",
                node: choice,
                entry: entry === "any" ? undefined : entry,
                ...(entry === "any" && index !== undefined ? { index } : {}),
            };
            choiceAtoms.set(key, atom);
            readAsValues.add(choice);
            if (atom.entry !== undefined) {
                const entries = entryAtomsOf.get(choice);
                if (entries) {
                    entries.push(atom);
                } else {
                    entryAtomsOf.set(choice, [atom]);
                }
            }
            const spec = specOf(choice) as ChoiceSpec;
            atomSources.set(atom, [
                ...exprsOfSpec(spec),
                ...(atom.index ? [atom.index] : []),
            ]);
        }
        return { k: "atom", atom };
    }

    /** A repeat's index. */
    function indexAtom(repeat: any, ref: any): Atom {
        let atom = indexAtoms.get(repeat);
        if (!atom) {
            atom = {
                id: nextAtomId++,
                label: referenceText(ref),
                kind: "index",
                node: repeat,
            };
            indexAtoms.set(repeat, atom);
            atomSources.set(atom, iterationCountExprs(repeat));
        }
        return atom;
    }

    const repeatCounts = new Map<
        any,
        | { kind: "sequence"; params: RepeatSequence }
        | { kind: "items"; items: Expr[] }
        | { kind: "choice"; choice: any; count: Expr; ref: any }
        | { kind: "unbounded" }
    >();

    type RepeatSequence = {
        seqType: string;
        from: Expr | null;
        to: Expr | null;
        step: Expr | null;
        length: Expr | null;
        exclude: ListEntry[];
        /** `to` or `length` isn't analysable: any number of iterations. */
        countUnknown?: boolean;
        /** `from`, `step` or `exclude` isn't: values not known. */
        valuesUnknown?: boolean;
    };

    /**
     * What decides how many iterations a repeat has and what it iterates
     * over, analysed, or `unbounded` when that can't be analysed (it may
     * come from an input, SEL-2).
     */
    function repeatCountOf(repeat: any) {
        if (repeatCounts.has(repeat)) {
            return repeatCounts.get(repeat)!;
        }
        repeatCounts.set(repeat, { kind: "unbounded" });
        let found: any = { kind: "unbounded" };
        try {
            if (repeat.componentType === "repeatForSequence") {
                const seqType = String(
                    attr(repeat, "type")?.primitive?.value ?? "number",
                ).toLowerCase();
                // each attribute alone: one that can't be analysed leaves
                // what it decides unknown, how many iterations (`to`,
                // `length`, which may come from an input, SEL-2) or what
                // they are
                let countUnknown = false;
                let valuesUnknown = false;
                const scalar = (name: string) => {
                    const attribute = attr(repeat, name);
                    if (attribute === undefined) {
                        return null;
                    }
                    try {
                        if (seqType === "letters") {
                            // the text it holds, as letters
                            const text = analyseAttributeScalar(
                                attribute,
                                "text",
                            );
                            const number =
                                atomsOf([text]).size === 0
                                    ? evaluate(
                                          {
                                              k: "op",
                                              op: "letterNumber",
                                              args: [text],
                                          },
                                          new Map(),
                                      )
                                    : NaN;
                            if (
                                typeof number !== "number" ||
                                Number.isNaN(number)
                            ) {
                                throw new NotAnalysable(writtenText(attribute));
                            }
                            return constant(number);
                        }
                        return analyseAttributeScalar(
                            attribute,
                            name === "step"
                                ? "math"
                                : name === "length"
                                  ? "integer"
                                  : "number",
                        );
                    } catch (e) {
                        if (!(
                            e instanceof NotAnalysable || e instanceof Skip
                        )) {
                            throw e;
                        }
                        if (name === "to" || name === "length") {
                            countUnknown = true;
                        } else {
                            valuesUnknown = true;
                        }
                        return null;
                    }
                };
                const from = scalar("from");
                const to = scalar("to");
                const step = scalar("step");
                const length = scalar("length");
                const excludeAttribute = attr(repeat, "exclude");
                let exclude: ListEntry[] = [];
                if (excludeAttribute !== undefined) {
                    if (seqType === "letters") {
                        valuesUnknown = true;
                    } else {
                        try {
                            exclude = analyseAttributeList(excludeAttribute);
                        } catch (e) {
                            if (!(
                                e instanceof NotAnalysable || e instanceof Skip
                            )) {
                                throw e;
                            }
                            valuesUnknown = true;
                        }
                    }
                }
                if (countUnknown && !from && attr(repeat, "to") !== undefined) {
                    // its values count back from `to`
                    valuesUnknown = true;
                }
                found = {
                    kind: "sequence",
                    params: {
                        seqType,
                        from,
                        to,
                        step,
                        length,
                        exclude,
                        countUnknown,
                        valuesUnknown,
                    },
                };
            } else {
                const forAttribute = attr(repeat, "for");
                const component = forAttribute?.component;
                const meaningful = (component?.children ?? []).filter(
                    (c: any) => typeof c !== "string" || c.trim() !== "",
                );
                if (
                    component?.componentType === "group" &&
                    meaningful.length === 1 &&
                    typeof meaningful[0] === "object" &&
                    (meaningful[0].componentType === "_copy" ||
                        meaningful[0].componentType === "_ref")
                ) {
                    found = repeatOverReference(meaningful[0]) ?? found;
                } else if (component?.componentType === "group") {
                    found = {
                        kind: "items",
                        items: (component.children ?? [])
                            .filter(
                                (c: any) =>
                                    typeof c !== "string" || c.trim() !== "",
                            )
                            .map((c: any) => itemOf(c)),
                    };
                } else if (
                    component &&
                    (component.componentType === "_copy" ||
                        component.componentType === "_ref")
                ) {
                    found = repeatOverReference(component) ?? found;
                }
            }
        } catch (e) {
            if (!(e instanceof NotAnalysable || e instanceof Skip)) {
                throw e;
            }
            found = { kind: "unbounded" };
        }
        repeatCounts.set(repeat, found);
        return found;
    }

    /** What a `<repeat for>` of one reference iterates over, if known. */
    function repeatOverReference(component: any): any {
        const ref = refOf(component);
        const target = ref && nodeByIdx.get(ref.nodeIdx);
        if (
            target &&
            ref.unresolvedPath === null &&
            CHOICE_TYPES.has(target.componentType)
        ) {
            const spec = specOf(target);
            if (!(spec instanceof Skip) && !(spec instanceof NotAnalysable)) {
                return {
                    kind: "choice",
                    choice: target,
                    count: spec.numToSelect,
                    ref,
                };
            }
        } else if (
            target &&
            ref.unresolvedPath === null &&
            ["numberList", "mathList"].includes(target.componentType) &&
            !target.extending
        ) {
            const entries = listEntriesOf(
                target.children ?? [],
                target.componentType === "mathList" ? "math" : "number",
            );
            if (entries.every((e) => e.k !== "many")) {
                return { kind: "items", items: entries };
            }
        }
        return undefined;
    }

    /** An item a `<repeat for>` iterates over, as a value, if it is one. */
    function itemOf(child: any): Expr {
        try {
            // what `<repeat for>` iterates over is written as math
            return analyseInPlace(child, "math");
        } catch (e) {
            if (e instanceof NotAnalysable || e instanceof Skip) {
                return constant(unknownValue());
            }
            throw e;
        }
    }

    /** The expressions a repeat's count is computed from. */
    function iterationCountExprs(repeat: any): Expr[] {
        const count = repeatCountOf(repeat);
        if (count.kind === "sequence") {
            const p = count.params;
            return [
                p.from,
                p.to,
                p.step,
                p.length,
                ...p.exclude.map((e: ListEntry) =>
                    e.k === "many" ? e.count : e,
                ),
            ].filter(Boolean) as Expr[];
        }
        if (count.kind === "items") {
            return [];
        }
        if (count.kind === "choice") {
            return [count.count];
        }
        return [];
    }

    /**
     * What a repeat's `valueName` is, as an expression, named by the
     * reference to it, by which a message names it.
     */
    function repeatValue(repeat: any, ref: any, node?: any): Expr {
        return {
            k: "named",
            label: referenceText(ref),
            expr: repeatValueOf(repeat, ref),
            ...(node === undefined ? {} : { node }),
        };
    }

    function repeatValueOf(repeat: any, ref: any): Expr {
        const count = repeatCountOf(repeat);
        const indexName = repeat.attributes?.indexName?.primitive?.value;
        const index: Expr = {
            k: "atom",
            atom: indexAtom(
                repeat,
                indexName === undefined
                    ? ref
                    : { originalPath: [{ name: indexName, index: [] }] },
            ),
        };
        if (count.kind === "sequence") {
            const p = count.params;
            if (p.valuesUnknown) {
                throw new NotAnalysable(referenceText(ref));
            }
            if (
                p.exclude.length === 0 &&
                (p.seqType === "number" || p.seqType === "math") &&
                !(p.to && p.length)
            ) {
                // from + (index - 1) step, as the sequence computes it,
                // unless `to` and not `from` is written, when it counts
                // back from `to`
                const step = p.step ?? constant(1);
                if (p.from || !p.to) {
                    const from = p.from ?? constant(1);
                    return {
                        k: "op",
                        op: "+",
                        args: [
                            from,
                            {
                                k: "op",
                                op: "*",
                                args: [
                                    {
                                        k: "op",
                                        op: "+",
                                        args: [index, constant(-1)],
                                    },
                                    step,
                                ],
                            },
                        ],
                    };
                }
            }
            if (p.seqType === "letters") {
                throw new NotAnalysable(referenceText(ref));
            }
            let atom = seqValueAtoms.get(repeat);
            if (!atom) {
                atom = {
                    id: nextAtomId++,
                    label: referenceText(ref),
                    kind: "seqValue",
                    node: repeat,
                };
                seqValueAtoms.set(repeat, atom);
                atomSources.set(atom, iterationCountExprs(repeat));
            }
            return { k: "atom", atom };
        }
        if (count.kind === "items") {
            if (
                count.items.some(
                    (item: Expr) =>
                        item.k === "const" && typeof item.value !== "number",
                )
            ) {
                throw new NotAnalysable(referenceText(ref));
            }
            return { k: "op", op: "item", args: [index, ...count.items] };
        }
        if (count.kind === "choice") {
            return choiceAtomExpr(count.choice, "any", count.ref);
        }
        throw new NotAnalysable(referenceText(ref));
    }

    /**
     * Whether `node` is a repeat's index or value, and the repeat (see
     * `choiceParametersAtLoad.ts`).
     */
    function iterationVariable(
        node: any,
    ): { kind: "index" | "value"; repeat: any } | undefined {
        let repeat = parentOf.get(node);
        if (node.componentType === "_placeholder") {
            if (repeat?.componentType !== "_repeatSetup") {
                return undefined;
            }
            repeat = parentOf.get(repeat);
        } else if (
            node.componentType !== "_repeatIndices" &&
            node.componentType !== "_repeatValues"
        ) {
            return undefined;
        }
        if (!repeat) {
            return undefined;
        }
        if (node.componentType === "_repeatIndices") {
            return { kind: "index", repeat };
        }
        if (node.componentType === "_repeatValues") {
            return { kind: "value", repeat };
        }
        const name = node.attributes?.name?.primitive?.value;
        const indexName = repeat.attributes?.indexName?.primitive?.value;
        return name !== undefined && name === indexName
            ? { kind: "index", repeat }
            : { kind: "value", repeat };
    }

    // ------------------------------------------------------------------
    // Ranges: what each atom can be
    // ------------------------------------------------------------------

    function exprsOfSpec(spec: ChoiceSpec): Expr[] {
        const found: Expr[] = [spec.numToSelect];
        const add = (e: Expr | null | undefined) => {
            if (e) {
                found.push(e);
            }
        };
        const addList = (list: ListEntry[]) => {
            for (const e of list) {
                add(e.k === "many" ? e.count : e);
            }
        };
        if (spec.type === "selectFromSequence") {
            [spec.from, spec.to, spec.step, spec.length].forEach(add);
            add(spec.withReplacement);
            add(spec.coprime);
            addList(spec.exclude);
            for (const c of spec.excludeCombinations ?? []) {
                c.forEach(add);
            }
        } else if (spec.type === "selectPrimeNumbers") {
            [spec.from, spec.to].forEach(add);
            add(spec.withReplacement);
            addList(spec.exclude);
            for (const c of spec.excludeCombinations ?? []) {
                c.forEach(add);
            }
        } else if (spec.type === "select") {
            add(spec.withReplacement);
        } else {
            [spec.from, spec.to, spec.step].forEach(add);
        }
        return found;
    }

    function atomsOf(exprs: Expr[], into = new Set<Atom>()): Set<Atom> {
        for (const expr of exprs) {
            if (expr.k === "atom") {
                into.add(expr.atom);
            } else if (expr.k === "held") {
                atomsOf(
                    expr.items.filter(
                        (item): item is Expr => typeof item !== "string",
                    ),
                    into,
                );
            } else if (expr.k === "named") {
                atomsOf([expr.expr], into);
            } else if (expr.k === "op") {
                atomsOf(expr.args, into);
            }
        }
        return into;
    }

    /**
     * The atoms `exprs` depend on, with every atom they in turn depend on,
     * each after those it depends on.
     */
    function orderedAtoms(exprs: Expr[]): Atom[] {
        const ordered: Atom[] = [];
        const visited = new Set<Atom>();
        function visit(atom: Atom) {
            if (visited.has(atom)) {
                return;
            }
            visited.add(atom);
            for (const dep of atomsOf(atomSources.get(atom) ?? [])) {
                visit(dep);
            }
            ordered.push(atom);
        }
        for (const atom of atomsOf(exprs)) {
            visit(atom);
        }
        return ordered;
    }

    type Assignment = Map<Atom, Value>;

    /** The value of `expr`, given values for its atoms. */
    function evaluate(expr: Expr, assignment: Assignment): Value {
        if (expr.k === "const") {
            return expr.value;
        }
        if (expr.k === "held") {
            return evaluateHeld(expr, assignment);
        }
        if (expr.k === "named") {
            return evaluate(expr.expr, assignment);
        }
        if (expr.k === "atom") {
            const value = assignment.get(expr.atom);
            return value === undefined ? NaN : value;
        }
        if (expr.op === "letterNumber") {
            // the text, as a letters sequence reads it (`lettersToNumber`)
            const v = evaluate(expr.args[0], assignment);
            if (typeof v === "number") {
                return NaN;
            }
            if (isUnknown(v)) {
                return v;
            }
            if (v.runTime?.componentType === "text") {
                return lettersToNumber(v.runTime.value) ?? NaN;
            }
            return sequenceNumber(v, "letters") ?? NaN;
        }
        if (expr.op === "item") {
            const index = evaluate(expr.args[0], assignment);
            if (typeof index !== "number") {
                return isUnknown(index) ? index : NaN;
            }
            const item = expr.args[index];
            return item ? evaluate(item, assignment) : NaN;
        }
        const values = expr.args.map((arg) => evaluate(arg, assignment));
        if (values.some(isUnknown)) {
            return unknownValue();
        }
        if (values.some((v) => typeof v !== "number")) {
            return NaN;
        }
        const nums = values as number[];
        switch (expr.op) {
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

    /** The values of each `held` component found, by its children's values. */
    const heldValues = new WeakMap<object, Map<string, Value>>();

    /**
     * The value a component holds (`held`) when the values it reads are
     * `assignment`, as the component computes it when the document runs.
     */
    function evaluateHeld(
        expr: Extract<Expr, { k: "held" }>,
        assignment: Assignment,
    ): Value {
        const values = expr.items.map((item) =>
            typeof item === "string" ? item : evaluate(item, assignment),
        );
        if (expr.compiled) {
            // what the selection computes, with the values its slots hold
            if (values.some((v) => typeof v !== "string" && isUnknown(v))) {
                return unknownValue();
            }
            const { template, output } = expr.compiled;
            return fromParameter(
                outputOf(
                    evaluateTemplate(template, (k) =>
                        toParameter(values[k] as Value),
                    ),
                    output,
                ),
                output,
            );
        }
        if (
            expr.caveat === "unknown" ||
            values.some((v) => typeof v !== "string" && isUnknown(v))
        ) {
            return unknownValue();
        }
        const key = values.map(valueKey).join(",");
        let found = heldValues.get(expr);
        if (!found) {
            found = new Map();
            heldValues.set(expr, found);
        }
        if (found.has(key)) {
            return found.get(key)!;
        }
        let value = fromRunTime(
            runTimeValue(
                expr.componentType,
                values.map((v) => (typeof v === "string" ? v : toRunTime(v))),
                componentInfoObjects,
            ),
        );
        if (
            expr.caveat === "number" &&
            (typeof value !== "number" || Number.isNaN(value))
        ) {
            // an attribute may make it another value
            value = unknownValue();
        }
        found.set(key, value);
        return value;
    }

    /** What the atom `atom` can be, given values for those it depends on. */
    function domainOf(atom: Atom, assignment: Assignment): Domain {
        if (atom.kind === "bool") {
            return { finite: [0, 1] };
        }
        if (atom.kind === "moduleAttribute") {
            const values = (atomSources.get(atom) ?? []).map((e) =>
                evaluate(e, assignment),
            );
            return {
                finite: values.filter(
                    (v, i) =>
                        values.findIndex((w) => valueKey(w) === valueKey(v)) ===
                        i,
                ),
            };
        }
        if (atom.kind === "choice") {
            const spec = specOf(atom.node) as ChoiceSpec;
            const value = (e: Expr) => evaluate(e, assignment);
            const values = choiceValues(atom.node, spec, value);
            const present = entryPresent(atom, spec, value);
            if (present === true) {
                return values;
            }
            // nothing, which a parameter reads as no number, and a letters
            // sequence as the empty text
            const nothing =
                spec.type === "selectFromSequence" && spec.seqType === "letters"
                    ? NO_LETTERS
                    : NaN;
            if (present === false) {
                return { finite: [nothing] };
            }
            return "finite" in values
                ? { finite: [...values.finite, nothing] }
                : { lo: -Infinity, hi: Infinity, integer: false };
        }
        const count = repeatCountOf(atom.node);
        if (atom.kind === "index") {
            const n = iterationCount(count, (e) => evaluate(e, assignment));
            if (n === Infinity) {
                return { lo: 1, hi: Infinity, integer: true };
            }
            if (n > MAX_VALUES) {
                return { lo: 1, hi: n, integer: true };
            }
            return { finite: Array.from({ length: n }, (_, i) => i + 1) };
        }
        // seqValue
        if (
            count.kind !== "sequence" ||
            count.params.countUnknown ||
            count.params.valuesUnknown
        ) {
            return { lo: -Infinity, hi: Infinity, integer: false };
        }
        return sequenceDomain(
            count.params,
            (e) => evaluate(e, assignment),
            count.params.exclude,
        );
    }

    /**
     * Whether the entry of a choice an atom is (`$a[2]`, `$a[$k]`) is there,
     * with `value` for the parameters: whether the choice selects that many
     * values. `undefined` when the check can't tell, as for an index it
     * can't read. A reference to an entry that isn't there is nothing.
     */
    function entryPresent(
        atom: Atom,
        spec: ChoiceSpec,
        value: (e: Expr) => Value,
    ): boolean | undefined {
        if (atom.entry === undefined && atom.index === undefined) {
            // a value the choice selects, as a repeat over it has
            return true;
        }
        const n = value(spec.numToSelect);
        if (typeof n !== "number" || Number.isNaN(n)) {
            return undefined;
        }
        const count = Math.round(n);
        let k: Value | undefined = atom.entry;
        if (k === undefined) {
            if (!atom.index) {
                return undefined;
            }
            k = value(atom.index);
        }
        if (typeof k !== "number" || !Number.isInteger(k)) {
            return undefined;
        }
        return k >= 1 && k <= count;
    }

    /** How many iterations a repeat has, with `value` for its parameters. */
    function iterationCount(count: any, value: (e: Expr) => Value): number {
        if (count.kind === "unbounded") {
            return Infinity;
        }
        if (count.kind === "items") {
            return count.items.length;
        }
        if (count.kind === "choice") {
            const n = value(count.count);
            return typeof n === "number" && Number.isFinite(n)
                ? Math.max(0, Math.round(n))
                : Infinity;
        }
        if (count.params.countUnknown) {
            return Infinity;
        }
        const seq = concreteSequence(count.params, value);
        if (!seq) {
            return Infinity;
        }
        return seq.length;
    }

    /**
     * A sequence's `from`, `step` and `length`, with `value` for its
     * parameters, as the sequence computes them, or `null` when one isn't a
     * number.
     */
    function concreteSequence(
        p: {
            seqType: string;
            from: Expr | null;
            to: Expr | null;
            step: Expr | null;
            length: Expr | null;
        },
        value: (e: Expr) => Value,
    ): { from: number; step: number; length: number } | null {
        const read = (e: Expr | null) => {
            if (!e) {
                return null;
            }
            const v = value(e);
            return typeof v === "number" ? v : NaN;
        };
        const from = read(p.from);
        const to = read(p.to);
        const step = read(p.step);
        let length = read(p.length);
        if (length !== null) {
            length = Math.round(length);
        }
        if ([from, to, step, length].some((v) => Number.isNaN(v))) {
            return null;
        }
        if (from !== null && to !== null && step !== null && length !== null) {
            // can't have all four; the sequence reports it
            return null;
        }
        const result = calculateSequenceParameters({
            from,
            to,
            step,
            length,
            type: p.seqType === "letters" ? "letters" : "number",
        });
        if (
            !Number.isFinite(result.from) ||
            !Number.isFinite(result.step) ||
            !Number.isFinite(result.length)
        ) {
            return null;
        }
        return result;
    }

    /** The values of a sequence not excluded. */
    function sequenceDomain(
        p: RepeatSequence & { lowercase?: boolean },
        value: (e: Expr) => Value,
        exclude: ListEntry[],
    ): Domain {
        const seq = concreteSequence(p, value);
        if (!seq) {
            return { lo: -Infinity, hi: Infinity, integer: false };
        }
        if (seq.length > MAX_VALUES) {
            const last = seq.from + (seq.length - 1) * seq.step;
            return {
                lo: Math.min(seq.from, last),
                hi: Math.max(seq.from, last),
                integer:
                    Number.isInteger(seq.from) && Number.isInteger(seq.step),
            };
        }
        // an exclusion whose value isn't known leaves the value in: what
        // the sequence can be is then more than it is, never less
        const excluded = excludedIndices(
            seq,
            exclude
                .filter((e): e is Expr => e.k !== "many")
                .map((e) => sequenceNumber(value(e), p.seqType))
                .filter((v): v is number => v !== undefined),
            p.seqType,
        );
        const values: Value[] = [];
        for (let i = 0; i < seq.length; i++) {
            if (excluded.has(i)) {
                continue;
            }
            const v = seq.from + i * seq.step;
            values.push(
                p.seqType === "letters"
                    ? lettersValue(v, p.lowercase ?? true)
                    : v,
            );
        }
        return { finite: values };
    }

    /** What a choice can select, with `value` for its parameters. */
    function choiceValues(
        choice: any,
        spec: ChoiceSpec,
        value: (e: Expr) => Value,
    ): Domain {
        if (spec.type === "selectFromSequence") {
            if (spec.seqType === "math") {
                const seq = concreteSequence(spec, value);
                if (!seq) {
                    return { finite: [unknownValue()] };
                }
            }
            return sequenceDomain(spec, value, spec.exclude);
        }
        if (spec.type === "selectPrimeNumbers") {
            const from = value(spec.from);
            const to = value(spec.to);
            if (typeof from !== "number" || typeof to !== "number") {
                return { lo: 2, hi: Infinity, integer: true };
            }
            if (to - from > 100 * MAX_VALUES) {
                return { lo: Math.max(2, from), hi: to, integer: true };
            }
            const excluded = spec.exclude
                .filter((e): e is Expr => e.k !== "many")
                .map((e) => value(e))
                .filter((v): v is number => typeof v === "number");
            const primes: number[] = createPrimesList({
                from: Math.round(from),
                to: Math.round(to),
                exclude: excluded as never[],
            });
            if (primes.length > MAX_VALUES) {
                return {
                    lo: primes[0],
                    hi: primes[primes.length - 1],
                    integer: true,
                };
            }
            return { finite: primes };
        }
        if (spec.type === "select") {
            if (spec.optionValues) {
                return { finite: spec.optionValues };
            }
            return { finite: [unknownValue()] };
        }
        // `<selectRandomNumbers>`
        const read = (e: Expr | null, fallback: number) => {
            if (!e) {
                return fallback;
            }
            const v = value(e);
            return typeof v === "number" ? v : NaN;
        };
        if (spec.distribution === "discreteuniform") {
            const from = read(spec.from, 0);
            const to = read(spec.to, 1);
            const step = read(spec.step, 1);
            if (
                [from, to, step].every(Number.isFinite) &&
                step > 0 &&
                (to - from) / step < MAX_VALUES
            ) {
                const values: number[] = [];
                for (let v = from; v <= to + 1e-14 * Math.abs(to); v += step) {
                    values.push(v);
                }
                return { finite: values };
            }
            return { lo: -Infinity, hi: Infinity, integer: false };
        }
        if (spec.distribution === "uniform") {
            const from = read(spec.from, 0);
            const to = read(spec.to, 1);
            if (Number.isFinite(from) && Number.isFinite(to)) {
                return {
                    lo: Math.min(from, to),
                    hi: Math.max(from, to),
                    integer: false,
                };
            }
        }
        return { lo: -Infinity, hi: Infinity, integer: false };
    }

    // ------------------------------------------------------------------
    // The check of one choice with values for its parameters
    // ------------------------------------------------------------------

    /**
     * What the choice `choice`, read as an exclusion, can select, as numbers
     * of a sequence of `seqType`, when that is the same in every variant and
     * it can select any of them together (so that it can exclude as many of
     * them as it selects); otherwise `null`.
     */
    function knownExcludedValues(
        choice: any,
        seqType: string,
    ): number[] | null {
        if (!choice) {
            return null;
        }
        const spec = specOf(choice);
        if (spec instanceof Skip || spec instanceof NotAnalysable) {
            return null;
        }
        if (
            atomsOf(exprsOfSpec(spec)).size > 0 ||
            ("excludeCombinations" in spec && spec.excludeCombinations) ||
            (spec.type === "selectFromSequence" &&
                !(spec.coprime.k === "const" && spec.coprime.value === 0)) ||
            (spec.type === "select" && spec.optionsByVariant)
        ) {
            return null;
        }
        const domain = choiceValues(choice, spec, (e) =>
            evaluate(e, new Map()),
        );
        if (!("finite" in domain)) {
            return null;
        }
        const numbers = domain.finite.map((v) => sequenceNumber(v, seqType));
        return numbers.every((n) => n !== undefined)
            ? (numbers as number[])
            : null;
    }

    /**
     * The problem the check reports for what keeps a selection from
     * selecting (`utils/selectionFailure.ts`): none for the 70% rule when a
     * combination remains, which is left to the selection (#2509 PR 16).
     */
    function problemOf(
        failure: SelectionFailure | null,
        numToSelect: number,
    ): Problem | null {
        if (!failure || failure.threshold) {
            return null;
        }
        const args = failure.args ?? {};
        switch (failure.code) {
            case "doenet-e0032":
                return {
                    kind: "variants",
                    args: {
                        variantName: args.variantName,
                        numValues: args.numOptions,
                        numToSelect: args.numToSelect,
                    },
                };
            case "doenet-e0035":
                return {
                    kind: "options",
                    args: {
                        numValues: args.numOptions,
                        numToSelect: args.numToSelect,
                    },
                };
            case "doenet-e0036":
                return {
                    kind: "values",
                    args: {
                        numValues: args.length,
                        numToSelect: args.numToSelect,
                    },
                };
            case "doenet-e0046":
                return {
                    kind: "values",
                    args: {
                        numValues: args.numPossibleValues,
                        numToSelect: args.numToSelect,
                    },
                };
            case "doenet-e0047":
                return {
                    kind: "primes",
                    args: {
                        numValues: args.numValues,
                        numToSelect: args.numToSelect,
                    },
                };
            case "doenet-e0041":
            case "doenet-e0042":
            case "doenet-e0043":
            case "doenet-e0045":
                return {
                    kind: "coprime",
                    args: { numToSelect },
                };
            default:
                // `doenet-e0044`, `doenet-e0051`: no combination remains
                return {
                    kind: "combinations",
                    args: { numToSelect },
                };
        }
    }

    /**
     * The combinations `spec` excludes, with `value` for its parameters, as
     * the selection holds them (a letter as its letters), or `undefined`
     * when one holds a value the check doesn't know.
     */
    function combinationValues(
        spec: ChoiceSpec,
        numToSelect: number,
        value: (e: Expr) => Value,
    ): any[][] | undefined {
        if (!("excludeCombinations" in spec) || !spec.excludeCombinations) {
            return [];
        }
        const seqType =
            spec.type === "selectFromSequence" ? spec.seqType : "number";
        const lists: any[][] = [];
        for (const combination of spec.excludeCombinations) {
            const list: any[] = [];
            for (const e of combination.slice(0, numToSelect)) {
                const v = value(e);
                if (typeof v !== "number" && isUnknown(v)) {
                    return undefined;
                }
                // a value that isn't a number matches any, as the selection
                // reads it
                const n = sequenceNumber(v, seqType) ?? NaN;
                list.push(
                    seqType === "letters" && !Number.isNaN(n)
                        ? numberToLetters(
                              n,
                              spec.type === "selectFromSequence" &&
                                  spec.lowercase,
                          )
                        : n,
                );
            }
            lists.push(list);
        }
        return lists;
    }

    /** What, if anything, keeps `spec` from selecting with these values. */
    function concreteProblem(
        spec: ChoiceSpec,
        value: (e: Expr) => Value,
    ): Problem | null | "unknown" {
        const number = (e: Expr) => {
            const v = value(e);
            return typeof v === "number" ? v : NaN;
        };
        // a value the check can't know decides nothing either way
        const scalars: (Expr | null)[] = [
            spec.numToSelect,
            "withReplacement" in spec ? spec.withReplacement : null,
            "coprime" in spec ? spec.coprime : null,
            "from" in spec ? spec.from : null,
            "to" in spec ? spec.to : null,
            "step" in spec ? spec.step : null,
            "length" in spec ? spec.length : null,
        ];
        if (scalars.some((e) => e && isUnknown(value(e)))) {
            return "unknown";
        }
        const numToSelectValue = number(spec.numToSelect);
        if (Number.isNaN(numToSelectValue)) {
            return { kind: "number", args: { attribute: "numToSelect" } };
        }
        const numToSelect = Math.round(numToSelectValue);
        if (spec.type === "select" && spec.optionsByVariant) {
            // each variant name must be on `numToSelect` options, even when
            // that is 0: the test the `<select>` makes
            // (`variantCountFailure`)
            return problemOf(
                variantCountFailure(spec.optionsByVariant, numToSelect),
                numToSelect,
            );
        }
        if (numToSelect < 1) {
            return null;
        }
        if (spec.type === "selectRandomNumbers") {
            return null;
        }
        const withReplacement = truthOf(value(spec.withReplacement));
        const need = withReplacement ? 1 : numToSelect;

        if (spec.type === "select") {
            if (spec.numOptions === null) {
                return need > 1 ? "unknown" : null;
            }
            // the test the `<select>` makes (`optionSelectionFailure`)
            return problemOf(
                optionSelectionFailure({
                    numOptions: spec.numOptions,
                    numToSelect,
                    withReplacement,
                }),
                numToSelect,
            );
        }

        // What `exclude` leaves out. A value known leaves out that value,
        // if the choice has it. A value that isn't known (a symbol, an
        // option that isn't one value), and each value of a choice of
        // several whose values aren't known, may or may not leave one out:
        // a choice that has too few values only when they do can't be
        // shown to select, but isn't said to have too few.
        const seqType =
            spec.type === "selectFromSequence" ? spec.seqType : "number";
        const excludedValues: number[] = [];
        const symbolicExcluded = new Set<string>();
        let unknownExcluded = 0;
        const knownMany: { count: number; values: number[] }[] = [];
        for (const entry of spec.exclude) {
            if (entry.k === "many") {
                const count = number(entry.count);
                const n = Number.isFinite(count)
                    ? Math.max(0, Math.round(count))
                    : 0;
                const values = knownExcludedValues(entry.choice, seqType);
                if (values) {
                    knownMany.push({ count: n, values });
                } else {
                    unknownExcluded += n;
                }
                continue;
            }
            const v = value(entry);
            const n = sequenceNumber(v, seqType);
            if (n !== undefined) {
                excludedValues.push(n);
            } else if (typeof v !== "number") {
                symbolicExcluded.add(JSON.stringify(v));
            }
        }
        unknownExcluded += symbolicExcluded.size;
        const valuesKnown = unknownExcluded === 0 && knownMany.length === 0;

        /**
         * How many values a choice of several whose values are known can
         * leave out, at most, of those `has` finds in the pool not already
         * left out (by a key).
         */
        const removedByKnownMany = (has: (v: number) => string | null) => {
            const all = new Set<string>();
            let total = 0;
            for (const { count, values } of knownMany) {
                const these = new Set<string>();
                for (const v of values) {
                    const key = has(v);
                    if (key !== null) {
                        these.add(key);
                        all.add(key);
                    }
                }
                total += Math.min(count, these.size);
            }
            return Math.min(total, all.size);
        };

        let values: number[] | null = null;
        let numValues: number;
        let kind: "values" | "primes";

        if (spec.type === "selectFromSequence") {
            for (const name of ["from", "to", "step", "length"] as const) {
                const e = spec[name];
                if (e && spec.seqType !== "math") {
                    const v = value(e);
                    if (typeof v !== "number" || Number.isNaN(v)) {
                        return {
                            // a letters sequence reads text as letters
                            kind:
                                spec.seqType === "letters" &&
                                (name === "from" || name === "to")
                                    ? "letters"
                                    : "number",
                            args: { attribute: name },
                        };
                    }
                }
            }
            const seq = concreteSequence(spec, value);
            if (!seq) {
                if (spec.seqType === "math" && spec.length) {
                    // symbolic values: only how many is known, and any
                    // exclusion may or may not be one of them
                    const length = Math.max(0, Math.round(number(spec.length)));
                    if (need > length) {
                        return {
                            kind: "values",
                            args: { numValues: length, numToSelect: need },
                        };
                    }
                    const mayExclude =
                        new Set(excludedValues).size +
                        unknownExcluded +
                        knownMany.reduce((s, m) => s + m.count, 0);
                    if (
                        need > length - mayExclude ||
                        spec.excludeCombinations
                    ) {
                        return "unknown";
                    }
                    return null;
                }
                return "unknown";
            }
            const combinations = combinationValues(spec, numToSelect, value);
            if (
                valuesKnown &&
                combinations !== undefined &&
                (spec.seqType === "number" || spec.seqType === "letters")
            ) {
                // the test the selection makes (`sequenceSelectionFailure`)
                return problemOf(
                    sequenceSelectionFailure({
                        type: spec.seqType,
                        from: seq.from,
                        step: seq.step,
                        length: seq.length,
                        exclude: excludedValues,
                        lowercase: spec.lowercase,
                        numToSelect,
                        withReplacement,
                        coprime: truthOf(value(spec.coprime)),
                        excludedCombinations: excludedCombinationsOf(
                            combinations,
                            numToSelect,
                            spec.seqType,
                        ),
                    }).failure,
                    numToSelect,
                );
            }
            kind = "values";
            const excluded = excludedIndices(seq, excludedValues, spec.seqType);
            const removed = removedByKnownMany((v) => {
                for (const i of excludedIndices(seq, [v], spec.seqType)) {
                    if (!excluded.has(i)) {
                        return String(i);
                    }
                }
                return null;
            });
            numValues = seq.length - excluded.size - removed;
            if (
                seq.length <= 10 * MAX_VALUES &&
                (spec.excludeCombinations || truthOf(value(spec.coprime)))
            ) {
                values = [];
                for (let i = 0; i < seq.length; i++) {
                    if (!excluded.has(i)) {
                        values.push(seq.from + i * seq.step);
                    }
                }
            }
        } else {
            const from = number(spec.from);
            const to = number(spec.to);
            if (Number.isNaN(from)) {
                return { kind: "number", args: { attribute: "from" } };
            }
            if (Number.isNaN(to)) {
                return { kind: "number", args: { attribute: "to" } };
            }
            kind = "primes";
            values = createPrimesList({
                from: Math.round(from),
                to: Math.round(to),
                exclude: excludedValues as never[],
            });
            const combinations = combinationValues(spec, numToSelect, value);
            if (valuesKnown && combinations !== undefined) {
                // the test the selection makes (`primeSelectionFailure`)
                return problemOf(
                    primeSelectionFailure({
                        possibleValues: values!,
                        numToSelect,
                        withReplacement,
                        excludedCombinations: excludedCombinationsOf(
                            combinations,
                            numToSelect,
                            "number",
                        ),
                    }),
                    numToSelect,
                );
            }
            const primes = new Set(values);
            const removed = removedByKnownMany((v) =>
                primes.has(v) ? String(v) : null,
            );
            numValues = values!.length - removed;
        }

        numValues = Math.max(0, numValues);
        const fewest = Math.max(0, numValues - unknownExcluded);
        if (need > numValues) {
            return { kind, args: { numValues, numToSelect: need } };
        }
        if (need > fewest) {
            return "unknown";
        }

        if (spec.type === "selectFromSequence") {
            const coprime =
                truthOf(value(spec.coprime)) &&
                spec.seqType === "number" &&
                !spec.excludeCombinations &&
                numToSelect > 1;
            if (coprime) {
                if (!valuesKnown || !values) {
                    return "unknown";
                }
                const seq = concreteSequence(spec, value)!;
                const last = seq.from + (seq.length - 1) * seq.step;
                if (
                    !Number.isInteger(seq.from) ||
                    !Number.isInteger(seq.step) ||
                    seq.from <= 0 ||
                    last <= 0 ||
                    !coprimeCombinations({
                        values,
                        numToSelect,
                        withReplacement,
                    }).exists()
                ) {
                    return { kind: "coprime", args: { numToSelect } };
                }
            }
        }

        if (spec.excludeCombinations && spec.excludeCombinations.length > 0) {
            const combinations = spec.excludeCombinations
                .map((c) =>
                    c
                        .slice(0, numToSelect)
                        // a value that isn't a number matches any
                        .map((e) => sequenceNumber(value(e), seqType) ?? NaN),
                )
                .filter((c) => c.length === numToSelect);
            if (!values || !valuesKnown) {
                // only how many combinations there are is known
                const total = orderedCount(
                    fewest,
                    numToSelect,
                    withReplacement,
                );
                return total > combinations.length ? null : "unknown";
            }
            const pool = values;
            const space = {
                numValues: pool.length,
                numToSelect,
                withReplacement,
                valueAt: (i: number) => pool[i],
                isValid: (vs: any[]) =>
                    !checkForExcludedCombination({
                        type: "number",
                        excludedCombinations: combinations,
                        values: vs,
                    }),
            };
            if (
                orderedCount(pool.length, numToSelect, withReplacement) >
                    combinations.length ||
                someValidCombination(space)
            ) {
                return null;
            }
            return { kind: "combinations", args: { numToSelect } };
        }
        return null;
    }

    // ------------------------------------------------------------------
    // Checking a choice over every value its parameters can take
    // ------------------------------------------------------------------

    type Verdict =
        | { ok: true }
        | { ok: false; problem: Problem; when: string }
        | { ok: false; unproven: string };

    function describeValue(v: Value) {
        if (typeof v === "number") {
            return String(v);
        }
        const letters = /^(letters|LETTERS):(-?\d+)$/.exec(v.symbolic);
        return letters
            ? numberToLetters(Number(letters[2]), letters[1] === "letters")
            : v.symbolic;
    }

    /**
     * What a choice reads that a message names: each reference written in
     * its parameters that reads a value the variant or the iteration gives,
     * and each boolean parameter written as one, once each.
     */
    type Named = { label: string; expr: Expr; atom?: Atom };
    function namedOf(exprs: Expr[]): Named[] {
        const found = new Map<string, Named>();
        function visit(expr: Expr) {
            if (expr.k === "named") {
                if (!found.has(expr.label)) {
                    found.set(expr.label, { label: expr.label, expr });
                }
            } else if (expr.k === "atom") {
                if (!found.has(expr.atom.label)) {
                    found.set(expr.atom.label, {
                        label: expr.atom.label,
                        expr,
                        atom: expr.atom,
                    });
                }
            } else if (expr.k === "held") {
                for (const item of expr.items) {
                    if (typeof item !== "string") {
                        visit(item);
                    }
                }
            } else if (expr.k === "op") {
                expr.args.forEach(visit);
            }
        }
        exprs.forEach(visit);
        return [...found.values()];
    }

    /** "`$a` = 1, `$i` = 2" for what the choice reads (`namedOf`). */
    function describeWhen(named: Named[], assignment: Assignment) {
        return named
            .filter((n) =>
                [...atomsOf([n.expr])].every((a) => assignment.has(a)),
            )
            .map((n) => {
                if (n.atom?.kind === "bool") {
                    return `\`${n.label}\` = ${assignment.get(n.atom) ? "true" : "false"}`;
                }
                const atoms = [...atomsOf([n.expr])];
                if (atoms.length === 1 && atoms[0].kind === "choice") {
                    const w = assignment.get(atoms[0]);
                    if (w === NO_LETTERS || Number.isNaN(w)) {
                        // an entry the choice doesn't select (`entryPresent`)
                        return `\`${n.label}\` is nothing`;
                    }
                }
                const v = evaluate(n.expr, assignment);
                // a value the check can't read has no text to show
                return isUnknown(v)
                    ? `\`${n.label}\` is a value it can't read`
                    : `\`${n.label}\` = ${describeValue(v)}`;
            })
            .join(", ");
    }

    /**
     * Whether `v` for `atom`, an entry of a choice (`$a[2]`), is a value
     * another entry of that choice already has in `assignment`, which can't
     * be when the choice selects without replacement: its entries are then
     * different values.
     */
    function sameAsOtherEntry(
        atom: Atom,
        v: Value,
        assignment: Assignment,
    ): boolean {
        if (atom.kind !== "choice" || atom.entry === undefined) {
            return false;
        }
        // only the other entries of the same choice, so that a check over
        // many choices doesn't look through every value assigned
        const others = entryAtomsOf.get(atom.node) ?? [];
        if (others.length < 2) {
            return false;
        }
        const n = sequenceNumber(v, "letters");
        if (n === undefined || !entriesDiffer(atom.node)) {
            return false;
        }
        for (const other of others) {
            if (other === atom || other.entry === atom.entry) {
                continue;
            }
            const w = assignment.get(other);
            if (w !== undefined && sequenceNumber(w, "letters") === n) {
                return true;
            }
        }
        return false;
    }

    /**
     * Whether the entries of what `choice` selects are always different
     * values: it selects without replacement, from values that differ.
     */
    function entriesDiffer(choice: any): boolean {
        const spec = specOf(choice);
        if (
            spec instanceof Skip ||
            spec instanceof NotAnalysable ||
            spec.type === "selectRandomNumbers" ||
            !(
                spec.withReplacement.k === "const" &&
                spec.withReplacement.value === 0
            )
        ) {
            return false;
        }
        if (spec.type === "select") {
            // two options can be the same value
            const keys = (spec.optionValues ?? []).map((v) =>
                JSON.stringify(v),
            );
            return (
                spec.optionValues !== null && new Set(keys).size === keys.length
            );
        }
        return true;
    }

    function check(spec: ChoiceSpec): Verdict {
        const exprs = exprsOfSpec(spec);
        const direct = namedOf(exprs);
        const ordered = orderedAtoms(exprs);

        // First the bounds, which prove at once a choice whose values leave
        // room (`to="100" exclude="$a $b"`), however many combinations
        // there are of what it reads (a chain of choices each excluding the
        // ones before it). A pass by bounds is sound; only a choice they
        // don't prove is gone through, so what an error says is the same.
        if (checkByBounds(spec, direct, ordered, true).ok) {
            return { ok: true };
        }

        // exactly, over every combination, when they are few
        let leaves = 0;
        let tooMany = false;
        let found: Verdict | null = null;
        const assignment: Assignment = new Map();
        let unknownAt: Assignment | null = null;

        function enumerate(k: number): boolean {
            if (k === ordered.length) {
                leaves++;
                if (leaves > MAX_COMBINATIONS) {
                    tooMany = true;
                    return true;
                }
                const problem = concreteProblem(spec, (e) =>
                    evaluate(e, assignment),
                );
                if (problem === "unknown") {
                    unknownAt ??= new Map(assignment);
                    return false;
                }
                if (problem) {
                    found = {
                        ok: false,
                        problem,
                        when: describeWhen(direct, assignment),
                    };
                    return true;
                }
                return false;
            }
            const atom = ordered[k];
            const domain = domainOf(atom, assignment);
            if (!("finite" in domain)) {
                tooMany = true;
                return true;
            }
            for (const v of domain.finite) {
                if (sameAsOtherEntry(atom, v, assignment)) {
                    continue;
                }
                assignment.set(atom, v);
                if (enumerate(k + 1)) {
                    assignment.delete(atom);
                    return true;
                }
            }
            assignment.delete(atom);
            return false;
        }
        enumerate(0);
        if (found) {
            return found;
        }
        if (!tooMany) {
            if (unknownAt) {
                return {
                    ok: false,
                    unproven: describeWhen(direct, unknownAt),
                };
            }
            return { ok: true };
        }
        return checkByBounds(spec, direct, ordered);
    }

    /** What an atom can be, over every value of those it depends on. */
    const boundsMemo = new Map<
        Atom,
        { lo: number; hi: number; integer: boolean }
    >();
    function atomBounds(atom: Atom): {
        lo: number;
        hi: number;
        integer: boolean;
    } {
        if (boundsMemo.has(atom)) {
            return boundsMemo.get(atom)!;
        }
        boundsMemo.set(atom, { lo: -Infinity, hi: Infinity, integer: false });
        let result: { lo: number; hi: number; integer: boolean };
        if (atom.kind === "bool") {
            result = { lo: 0, hi: 1, integer: true };
        } else if (atom.kind === "moduleAttribute") {
            const bounds = (atomSources.get(atom) ?? []).map(intervalOf);
            result = {
                lo: Math.min(...bounds.map((b) => b.lo)),
                hi: Math.max(...bounds.map((b) => b.hi)),
                integer: bounds.every((b) => b.integer),
            };
        } else if (atom.kind === "index") {
            const count = repeatCountOf(atom.node);
            const max = maxIterations(count);
            result = { lo: 1, hi: Math.max(1, max), integer: true };
        } else if (atom.kind === "choice") {
            const spec = specOf(atom.node) as ChoiceSpec;
            result = entrySurelyPresent(atom, spec)
                ? choiceBounds(atom.node, spec)
                : // an entry that can be nothing, which no bounds hold
                  { lo: -Infinity, hi: Infinity, integer: false };
        } else {
            const count = repeatCountOf(atom.node);
            result =
                count.kind === "sequence" &&
                !count.params.countUnknown &&
                !count.params.valuesUnknown
                    ? sequenceBounds(count.params)
                    : { lo: -Infinity, hi: Infinity, integer: false };
        }
        boundsMemo.set(atom, result);
        return result;
    }

    /**
     * Whether the entry of a choice an atom is is there for every value of
     * the choice's parameters, by their bounds (see `entryPresent`).
     */
    function entrySurelyPresent(atom: Atom, spec: ChoiceSpec): boolean {
        if (atom.entry === undefined && atom.index === undefined) {
            return true;
        }
        const count = intervalOf(spec.numToSelect);
        if (atom.entry !== undefined) {
            return count.lo >= atom.entry;
        }
        if (!atom.index) {
            return false;
        }
        const k = intervalOf(atom.index);
        return k.integer && k.lo >= 1 && k.hi <= Math.round(count.lo);
    }

    function maxIterations(count: any): number {
        if (count.kind === "items") {
            return count.items.length;
        }
        if (count.kind === "choice") {
            return Math.round(intervalOf(count.count).hi);
        }
        if (count.kind === "sequence") {
            const p = count.params;
            if (p.countUnknown) {
                return Infinity;
            }
            if (p.length) {
                return Math.round(intervalOf(p.length).hi);
            }
            const from = p.from ? intervalOf(p.from) : { lo: 1, hi: 1 };
            if (!p.to) {
                return 10;
            }
            const to = intervalOf(p.to);
            const step = p.step ? intervalOf(p.step) : { lo: 1, hi: 1 };
            if (!(step.lo > 0)) {
                return Infinity;
            }
            return Math.floor((to.hi - from.lo) / step.lo + 1);
        }
        return Infinity;
    }

    function sequenceBounds(p: RepeatSequence) {
        const from = p.from
            ? intervalOf(p.from)
            : { lo: 1, hi: 1, integer: true };
        const step = p.step
            ? intervalOf(p.step)
            : { lo: 1, hi: 1, integer: true };
        let lo = from.lo;
        let hi = from.hi;
        if (p.to) {
            const to = intervalOf(p.to);
            lo = Math.min(lo, to.lo);
            hi = Math.max(hi, to.hi);
        } else {
            const length = p.length
                ? intervalOf(p.length)
                : { lo: 10, hi: 10, integer: true };
            const span = mulInterval(
                { lo: 0, hi: Math.max(0, length.hi - 1) },
                step,
            );
            lo = Math.min(lo, from.lo + span.lo);
            hi = Math.max(hi, from.hi + span.hi);
        }
        return { lo, hi, integer: from.integer && step.integer };
    }

    function choiceBounds(choice: any, spec: ChoiceSpec) {
        if (spec.type === "selectFromSequence") {
            if (spec.seqType !== "number") {
                return { lo: -Infinity, hi: Infinity, integer: false };
            }
            return sequenceBounds(spec);
        }
        if (spec.type === "selectPrimeNumbers") {
            return {
                lo: Math.max(2, intervalOf(spec.from).lo),
                hi: intervalOf(spec.to).hi,
                integer: true,
            };
        }
        if (spec.type === "select") {
            const nums = (spec.optionValues ?? []).filter(
                (v): v is number => typeof v === "number",
            );
            if (
                !spec.optionValues ||
                nums.length !== spec.optionValues.length
            ) {
                return { lo: -Infinity, hi: Infinity, integer: false };
            }
            return {
                lo: Math.min(...nums),
                hi: Math.max(...nums),
                integer: nums.every(Number.isInteger),
            };
        }
        const domain = choiceValues(choice, spec, (e) => {
            const i = intervalOf(e);
            return i.lo === i.hi ? i.lo : NaN;
        });
        if ("finite" in domain) {
            const nums = domain.finite.filter(
                (v): v is number => typeof v === "number",
            );
            if (nums.length === domain.finite.length && nums.length > 0) {
                return {
                    lo: Math.min(...nums),
                    hi: Math.max(...nums),
                    integer: nums.every(Number.isInteger),
                };
            }
            return { lo: -Infinity, hi: Infinity, integer: false };
        }
        return domain;
    }

    type Interval = { lo: number; hi: number; integer: boolean };

    /**
     * An atom whose least value toward a form's least is at an end it
     * doesn't have (an index with no end): tried from `start` toward
     * `direction`, and at `root`, where the form first falls below 0.
     */
    type Unbounded = {
        atom: Atom;
        start: number;
        direction: 1 | -1;
        root: number;
    };

    function mulInterval(
        a: { lo: number; hi: number },
        b: { lo: number; hi: number },
    ) {
        const products = [
            a.lo * b.lo,
            a.lo * b.hi,
            a.hi * b.lo,
            a.hi * b.hi,
        ].map((p) => (Number.isNaN(p) ? 0 : p));
        return { lo: Math.min(...products), hi: Math.max(...products) };
    }

    /** The values `expr` can take, over every value of its atoms. */
    function intervalOf(expr: Expr): Interval {
        if (expr.k === "named") {
            return intervalOf(expr.expr);
        }
        if (expr.k === "held") {
            if (expr.tree) {
                return intervalOf(expr.tree);
            }
            return expr.componentType === "boolean"
                ? { lo: 0, hi: 1, integer: true }
                : { lo: -Infinity, hi: Infinity, integer: false };
        }
        if (expr.k === "const") {
            const v = expr.value;
            return typeof v === "number" && !Number.isNaN(v)
                ? { lo: v, hi: v, integer: Number.isInteger(v) }
                : { lo: -Infinity, hi: Infinity, integer: false };
        }
        if (expr.k === "atom") {
            return atomBounds(expr.atom);
        }
        const args = expr.args.map(intervalOf);
        const integer = args.every((a) => a.integer);
        switch (expr.op) {
            case "+":
                return {
                    lo: args.reduce((s, a) => s + a.lo, 0),
                    hi: args.reduce((s, a) => s + a.hi, 0),
                    integer,
                };
            case "*": {
                let acc = { lo: 1, hi: 1 };
                for (const a of args) {
                    acc = mulInterval(acc, a);
                }
                return { ...acc, integer };
            }
            case "neg":
                return { lo: -args[0].hi, hi: -args[0].lo, integer };
            case "/": {
                const [a, b] = args;
                if (b.lo <= 0 && b.hi >= 0) {
                    return { lo: -Infinity, hi: Infinity, integer: false };
                }
                const inv = { lo: 1 / b.hi, hi: 1 / b.lo };
                return { ...mulInterval(a, inv), integer: false };
            }
            case "min":
                return {
                    lo: Math.min(...args.map((a) => a.lo)),
                    hi: Math.min(...args.map((a) => a.hi)),
                    integer,
                };
            case "max":
                return {
                    lo: Math.max(...args.map((a) => a.lo)),
                    hi: Math.max(...args.map((a) => a.hi)),
                    integer,
                };
            case "abs": {
                const a = args[0];
                const lo =
                    a.lo <= 0 && a.hi >= 0
                        ? 0
                        : Math.min(Math.abs(a.lo), Math.abs(a.hi));
                return {
                    lo,
                    hi: Math.max(Math.abs(a.lo), Math.abs(a.hi)),
                    integer,
                };
            }
            case "floor":
                return {
                    lo: Math.floor(args[0].lo),
                    hi: Math.floor(args[0].hi),
                    integer: true,
                };
            case "ceil":
                return {
                    lo: Math.ceil(args[0].lo),
                    hi: Math.ceil(args[0].hi),
                    integer: true,
                };
            case "round":
                return {
                    lo: Math.round(args[0].lo),
                    hi: Math.round(args[0].hi),
                    integer: true,
                };
            case "letterNumber": {
                const atom = lettersChoiceAtom(expr.args[0]);
                const spec = atom && specOf(atom.node);
                return spec &&
                    !(spec instanceof NotAnalysable) &&
                    !(spec instanceof Skip) &&
                    spec.type === "selectFromSequence"
                    ? sequenceBounds(spec)
                    : { lo: -Infinity, hi: Infinity, integer: false };
            }
            case "item": {
                const items = args.slice(1);
                return {
                    lo: Math.min(...items.map((a) => a.lo)),
                    hi: Math.max(...items.map((a) => a.hi)),
                    integer: items.every((a) => a.integer),
                };
            }
        }
        return { lo: -Infinity, hi: Infinity, integer: false };
    }

    /**
     * `expr` as a sum of constant multiples of atoms and of parts that
     * aren't (each its own term, by what it is), so that the same atom in
     * two parameters cancels: `($i + 5) - $i` is 5.
     */
    type Affine = {
        c: number;
        terms: Map<string, { coef: number; expr: Expr }>;
    };

    function affineOf(expr: Expr): Affine {
        if (expr.k === "named") {
            return affineOf(expr.expr);
        }
        if (
            expr.k === "op" &&
            (expr.op === "round" ||
                expr.op === "floor" ||
                expr.op === "ceil") &&
            intervalOf(expr.args[0]).integer
        ) {
            // rounding a whole number changes nothing, so it cancels with
            // the same number elsewhere
            return affineOf(expr.args[0]);
        }
        if (expr.k === "held" && expr.tree) {
            return affineOf(expr.tree);
        }
        if (expr.k === "const") {
            const v = expr.value;
            return { c: typeof v === "number" ? v : NaN, terms: new Map() };
        }
        if (expr.k === "op") {
            if (expr.op === "+") {
                return expr.args.map(affineOf).reduce(addAffine, {
                    c: 0,
                    terms: new Map(),
                });
            }
            if (expr.op === "neg") {
                return scaleAffine(affineOf(expr.args[0]), -1);
            }
            if (expr.op === "*" || expr.op === "/") {
                const parts = expr.args.map(affineOf);
                const isConst = (a: Affine) => a.terms.size === 0;
                if (expr.op === "/" && isConst(parts[1]) && parts[1].c !== 0) {
                    return scaleAffine(parts[0], 1 / parts[1].c);
                }
                if (
                    expr.op === "*" &&
                    parts.filter((p) => !isConst(p)).length <= 1
                ) {
                    let scale = 1;
                    let variable: Affine | null = null;
                    for (const p of parts) {
                        if (isConst(p)) {
                            scale *= p.c;
                        } else {
                            variable = p;
                        }
                    }
                    return variable
                        ? scaleAffine(variable, scale)
                        : { c: scale, terms: new Map() };
                }
            }
        }
        const key = exprKey(expr);
        return { c: 0, terms: new Map([[key, { coef: 1, expr }]]) };
    }

    function addAffine(a: Affine, b: Affine): Affine {
        const terms = new Map(a.terms);
        for (const [key, term] of b.terms) {
            const existing = terms.get(key);
            const coef = (existing?.coef ?? 0) + term.coef;
            if (coef === 0) {
                terms.delete(key);
            } else {
                terms.set(key, { coef, expr: term.expr });
            }
        }
        return { c: a.c + b.c, terms };
    }

    function scaleAffine(a: Affine, s: number): Affine {
        const terms = new Map<string, { coef: number; expr: Expr }>();
        for (const [key, term] of a.terms) {
            if (term.coef * s !== 0) {
                terms.set(key, { coef: term.coef * s, expr: term.expr });
            }
        }
        return { c: a.c * s, terms };
    }

    const heldIds = new Map<Expr, number>();
    function exprKey(expr: Expr): string {
        if (expr.k === "named") {
            return exprKey(expr.expr);
        }
        if (expr.k === "held") {
            if (expr.tree) {
                return exprKey(expr.tree);
            }
            let id = heldIds.get(expr);
            if (id === undefined) {
                id = heldIds.size;
                heldIds.set(expr, id);
            }
            return `held${id}`;
        }
        if (expr.k === "const") {
            return valueKey(expr.value);
        }
        if (expr.k === "atom") {
            return `a${expr.atom.id}`;
        }
        return `${expr.op}(${expr.args.map(exprKey).join(",")})`;
    }

    /**
     * The least value of `form`, and values for the atoms that give it, as
     * far as it is a sum of atoms. A part that isn't an atom takes the least
     * value it can.
     */
    function minimumOf(form: Affine): {
        min: number;
        witness: Assignment;
        unbounded: Unbounded[];
    } {
        let min = form.c;
        const witness: Assignment = new Map();
        const open: { atom: Atom; coef: number; start: number }[] = [];
        let finitePart = form.c;
        for (const { coef, expr } of form.terms.values()) {
            const bounds = intervalOf(expr);
            const end = coef > 0 ? bounds.lo : bounds.hi;
            min += coef * end;
            if (Number.isFinite(end)) {
                finitePart += coef * end;
            }
            if (expr.k === "atom") {
                if (Number.isFinite(end)) {
                    witness.set(expr.atom, end);
                } else {
                    // the least is toward an end there isn't: from the end
                    // there is, toward the other
                    const other = coef > 0 ? bounds.hi : bounds.lo;
                    if (Number.isFinite(other) && bounds.integer) {
                        open.push({ atom: expr.atom, coef, start: other });
                    }
                }
            }
        }
        const unbounded: Unbounded[] = open.map(({ atom, coef, start }) => {
            // with the other parts at their least, the first whole value
            // past which the form is below 0
            const direction: 1 | -1 = coef > 0 ? -1 : 1;
            const root =
                coef < 0
                    ? Math.floor(finitePart / -coef) + 1
                    : Math.ceil(-finitePart / coef) - 1;
            return { atom, start, direction, root };
        });
        return {
            min: Number.isNaN(min) ? -Infinity : min,
            witness,
            unbounded,
        };
    }

    /**
     * Check a choice by bounds, when its values are too many to go through
     * (see above).
     */
    function checkByBounds(
        spec: ChoiceSpec,
        direct: Named[],
        ordered: Atom[],
        proveOnly = false,
    ): Verdict {
        const verdict = checkByBoundsOf(spec, direct, ordered, proveOnly);
        if (verdict.ok && boundsObserver) {
            // what a test checks a pass by bounds against
            // (`setBoundsObserver`)
            const exprs = exprsOfSpec(spec).filter(
                (e) => !(e.k === "held" && e.tree === null),
            );
            boundsObserver({
                sample(random: () => number) {
                    const assignment: Assignment = new Map();
                    for (const atom of ordered) {
                        const domain = domainOf(atom, assignment);
                        let v: Value;
                        if ("finite" in domain) {
                            if (domain.finite.length === 0) {
                                return null;
                            }
                            v =
                                domain.finite[
                                    Math.floor(random() * domain.finite.length)
                                ];
                        } else {
                            const lo = Number.isFinite(domain.lo)
                                ? domain.lo
                                : Math.min(domain.hi, 0) - 1000;
                            const hi = Number.isFinite(domain.hi)
                                ? domain.hi
                                : lo + 1000;
                            v = lo + random() * (hi - lo);
                            if (domain.integer) {
                                v = Math.round(v);
                            }
                        }
                        assignment.set(atom, v);
                    }
                    const values = exprs.map((e) => {
                        const v = evaluate(e, assignment);
                        const bounds = intervalOf(e);
                        return {
                            value: typeof v === "number" ? v : NaN,
                            lo: bounds.lo,
                            hi: bounds.hi,
                        };
                    });
                    const problem = concreteProblem(spec, (e) =>
                        evaluate(e, assignment),
                    );
                    return { values, problem };
                },
            });
        }
        return verdict;
    }

    function checkByBoundsOf(
        spec: ChoiceSpec,
        direct: Named[],
        ordered: Atom[],
        proveOnly = false,
    ): Verdict {
        const describeRanges = () =>
            direct
                .map((a) => {
                    const b = intervalOf(a.expr);
                    if (a.atom?.kind === "bool") {
                        return `\`${a.label}\` ∈ {true, false}`;
                    }
                    if (
                        b.integer &&
                        b.hi === Infinity &&
                        Number.isFinite(b.lo)
                    ) {
                        return `\`${a.label}\` ∈ {${b.lo}, ${b.lo + 1}, ${b.lo + 2}, …}`;
                    }
                    const fmt = (x: number) =>
                        x === Infinity
                            ? "∞"
                            : x === -Infinity
                              ? "-∞"
                              : String(x);
                    return `\`${a.label}\` ∈ [${fmt(b.lo)}, ${fmt(b.hi)}]`;
                })
                .join(", ");

        // a whole number already needs no rounding, which would keep it from
        // cancelling with the same atom elsewhere
        const numToSelectBounds = intervalOf(spec.numToSelect);
        const numToSelect = affineOf(
            numToSelectBounds.integer
                ? spec.numToSelect
                : { k: "op", op: "round", args: [spec.numToSelect] },
        );
        if (
            numToSelectBounds.hi < 0.5 &&
            !(spec.type === "select" && spec.optionsByVariant)
        ) {
            // selects nothing; but a variant name must still be on as many
            // options as it selects (`concreteProblem`)
            return { ok: true };
        }
        const replacement = intervalOf(
            "withReplacement" in spec ? spec.withReplacement : constant(0),
        );
        const alwaysReplacement = replacement.lo > 0;
        const need = alwaysReplacement
            ? { c: 1, terms: new Map() }
            : numToSelect;

        /**
         * Try `witness` exactly: if the choice can't select with it, name
         * it; otherwise say it can't be shown.
         */
        /**
         * Try `witness` exactly: if the choice can't select with it, name
         * it. An atom whose least is toward an end it doesn't have is tried
         * from the end it has, a value at a time, for the first that fails.
         */
        const tryWitness = (
            witness: Assignment,
            unbounded: Unbounded[] = [],
        ): Verdict => {
            if (proveOnly) {
                // not proven by the bounds, which is all that is asked
                return { ok: false, unproven: "" };
            }
            if (unbounded.length > 0) {
                const { atom, start, direction, root } = unbounded[0];
                const candidates: number[] = [];
                if (Number.isFinite(root)) {
                    for (const v of [root - 1, root, root + 1]) {
                        if ((v - start) * direction >= 0) {
                            candidates.push(v);
                        }
                    }
                }
                for (let step = 0; step <= 1000; step++) {
                    candidates.push(start + direction * step);
                }
                for (const v of candidates) {
                    const verdict = tryOne(new Map([...witness, [atom, v]]));
                    if ("problem" in verdict) {
                        return verdict;
                    }
                }
                return { ok: false, unproven: describeRanges() };
            }
            return tryOne(witness);
        };
        const tryOne = (witness: Assignment): Verdict => {
            const assignment: Assignment = new Map(witness);
            // whether a value tried is one the atom isn't known to take (it
            // can be anything the check can find): a failure with it is no
            // value to name
            let guessed = false;
            for (const atom of ordered) {
                if (!assignment.has(atom)) {
                    const domain = domainOf(atom, assignment);
                    let v: Value | undefined;
                    if ("finite" in domain) {
                        v = domain.finite.find(
                            (w) => !sameAsOtherEntry(atom, w, assignment),
                        );
                    } else if (Number.isFinite(domain.lo)) {
                        v = domain.lo;
                    } else if (Number.isFinite(domain.hi)) {
                        v = domain.hi;
                    } else {
                        v = 0;
                        guessed = true;
                    }
                    if (v !== undefined) {
                        assignment.set(atom, v);
                    }
                }
            }
            if (guessed) {
                return { ok: false, unproven: describeRanges() };
            }
            if (
                [...assignment].some(([atom, v]) =>
                    sameAsOtherEntry(atom, v, assignment),
                )
            ) {
                // values the choice can't have together
                return { ok: false, unproven: describeRanges() };
            }
            const problem = concreteProblem(spec, (e) =>
                evaluate(e, assignment),
            );
            if (problem && problem !== "unknown") {
                return {
                    ok: false,
                    problem,
                    when: describeWhen(direct, assignment),
                };
            }
            return { ok: false, unproven: describeRanges() };
        };

        if (spec.type === "select") {
            if (spec.optionsByVariant) {
                if (numToSelectBounds.lo === numToSelectBounds.hi) {
                    const verdict = concreteProblem(spec, (e) => {
                        const i = intervalOf(e);
                        return i.lo;
                    });
                    if (verdict === null) {
                        return { ok: true };
                    }
                }
                const { witness, unbounded } = minimumOf(
                    scaleAffine(numToSelect, -1),
                );
                return tryWitness(witness, unbounded);
            }
            if (alwaysReplacement || spec.numOptions === 0) {
                return { ok: true };
            }
            if (spec.numOptions !== null) {
                const slack = addAffine(
                    { c: spec.numOptions, terms: new Map() },
                    scaleAffine(need, -1),
                );
                const { min, witness, unbounded } = minimumOf(slack);
                if (min >= 0) {
                    return { ok: true };
                }
                return tryWitness(witness, unbounded);
            }
            return { ok: false, unproven: describeRanges() };
        }

        if (spec.type === "selectRandomNumbers") {
            return { ok: true };
        }

        const excludeCount = spec.exclude.reduce(
            (sum, e) => sum + (e.k === "many" ? intervalOf(e.count).hi : 1),
            0,
        );

        if (spec.type === "selectPrimeNumbers") {
            const from = intervalOf(spec.from);
            const to = intervalOf(spec.to);
            const fewest =
                Number.isFinite(from.hi) &&
                Number.isFinite(to.lo) &&
                to.lo - from.hi < 100 * MAX_VALUES
                    ? createPrimesList({
                          from: Math.round(from.hi),
                          to: Math.round(to.lo),
                          exclude: [],
                      }).length - excludeCount
                    : -Infinity;
            const needMax = alwaysReplacement
                ? 1
                : Math.round(numToSelectBounds.hi);
            if (fewest >= needMax && !spec.excludeCombinations) {
                return { ok: true };
            }
            const { witness, unbounded } = minimumOf(
                addAffine(
                    affineOf(spec.to),
                    scaleAffine(affineOf(spec.from), -1),
                ),
            );
            const { witness: w2, unbounded: u2 } = minimumOf(
                scaleAffine(need, -1),
            );
            return tryWitness(new Map([...w2, ...witness]), [
                ...unbounded,
                ...u2,
            ]);
        }

        // `<selectFromSequence>`
        if (spec.seqType === "math") {
            return { ok: false, unproven: describeRanges() };
        }
        // how many values: `length`, or `(to - from) / step + 1`, rounded
        // down. What it is compared with is a whole number, and a number
        // rounded down is at least a whole number exactly when the number
        // is, so it is compared unrounded.
        let count: Affine;
        if (spec.length) {
            count = affineOf(
                intervalOf(spec.length).integer
                    ? spec.length
                    : { k: "op", op: "round", args: [spec.length] },
            );
        } else if (!spec.to) {
            count = { c: 10, terms: new Map() };
        } else {
            const from = spec.from ?? constant(1);
            const step = spec.step ?? constant(1);
            const arg: Expr = {
                k: "op",
                op: "+",
                args: [
                    {
                        k: "op",
                        op: "/",
                        args: [
                            {
                                k: "op",
                                op: "+",
                                args: [
                                    spec.to,
                                    { k: "op", op: "neg", args: [from] },
                                ],
                            },
                            step,
                        ],
                    },
                    constant(1),
                ],
            };
            count = affineOf(arg);
        }
        const slack = addAffine(addAffine(count, scaleAffine(need, -1)), {
            c: -Math.ceil(excludeCount),
            terms: new Map(),
        });
        const { min, witness, unbounded } = minimumOf(slack);
        const coprimeBounds = intervalOf(spec.coprime);
        const mayBeCoprime =
            coprimeBounds.hi > 0 &&
            numToSelectBounds.hi >= 2 &&
            !spec.excludeCombinations;
        if (min >= 0 && !mayBeCoprime && !spec.excludeCombinations) {
            return { ok: true };
        }
        return tryWitness(witness, unbounded);
    }

    // ------------------------------------------------------------------
    // Compiling: one function for the check and the selection
    // ------------------------------------------------------------------

    /**
     * The slots of a parameter being compiled: the reference written for
     * each, and what the check finds it holds (`model`).
     */
    class Slots {
        nodes: any[] = [];
        models: Expr[] = [];
        add(node: any, model: Expr) {
            this.nodes.push(node);
            this.models.push(model);
            return this.nodes.length - 1;
        }
    }

    /** Whether `expr` reads a value from the variant or an iteration. */
    function variantDependent(expr: Expr) {
        return [...atomsOf([expr])].some((atom) => !atom.decidedByDoenetML);
    }

    /** The text of what a `held` is written as, for a message. */
    function heldText(expr: Extract<Expr, { k: "held" }>): string {
        return expr.items
            .map((item) =>
                typeof item === "string"
                    ? item
                    : item.k === "named"
                      ? item.label
                      : item.k === "held"
                        ? heldText(item)
                        : "",
            )
            .join("")
            .trim();
    }

    /**
     * `expr` as a template (`utils/selectionParameters.ts`), each reference
     * that reads the variant or an iteration a slot of `slots`. What reads
     * neither is its value, computed now. Anything else isn't one of SEL-6's
     * forms: a `<boolean>` or `<text>` computed from such a value, a
     * component with an attribute that changes its value, a value the check
     * can't read.
     */
    function compileTemplate(expr: Expr, slots: Slots): ParameterTemplate {
        if (atomsOf([expr]).size === 0) {
            const value = evaluate(expr, new Map());
            if (typeof value !== "number" && isUnknown(value)) {
                // a value the check can't compute (an attribute that may
                // change it), which a compiled parameter can't hold
                throw new NotAnalysable(
                    expr.k === "held" ? heldText(expr) : "",
                );
            }
            return { k: "const", value: toParameter(value) };
        }
        if (expr.k === "named") {
            if (expr.node !== undefined) {
                return { k: "slot", slot: slots.add(expr.node, expr) };
            }
            return compileTemplate(expr.expr, slots);
        }
        if (expr.k === "held") {
            if (
                expr.tree &&
                !expr.caveat &&
                ["number", "integer", "math"].includes(expr.componentType)
            ) {
                return compileTemplate(expr.tree, slots);
            }
            // a `<boolean>` or `<text>` holding one reference alone, perhaps
            // through another of its type (the attribute's, and the one it
            // references)
            let only: string | Expr | undefined = expr;
            while (
                typeof only === "object" &&
                only.k === "held" &&
                only.componentType === expr.componentType &&
                !only.caveat
            ) {
                const items: (string | Expr)[] = only.items.filter(
                    (item) => typeof item !== "string" || item.trim() !== "",
                );
                only = items.length === 1 ? items[0] : undefined;
            }
            if (
                !expr.caveat &&
                typeof only === "object" &&
                only.k === "named" &&
                only.node !== undefined
            ) {
                // a `<boolean>` or `<text>` holding one reference alone
                const slot: ParameterTemplate = {
                    k: "slot",
                    slot: slots.add(only.node, only),
                };
                if (expr.componentType === "boolean") {
                    return { k: "op", op: "truth", args: [slot] };
                }
                if (expr.componentType === "text") {
                    return slot;
                }
            }
            throw new NotAnalysable(heldText(expr));
        }
        if (expr.k === "op" && expr.op !== "letterNumber") {
            return {
                k: "op",
                op: expr.op,
                args: expr.args.map((arg) => compileTemplate(arg, slots)),
            };
        }
        throw new NotAnalysable(expr.k === "atom" ? expr.atom.label : "");
    }

    /**
     * The check's form of a template compiled from slots with `models`: a
     * `held` whose value is the compiled function's (`evaluateHeld`), with
     * the same arithmetic as a tree, for the bounds.
     */
    function compiledExpr(
        template: ParameterTemplate,
        output: ParameterOutput,
        models: Expr[],
    ): Expr {
        if (template.k === "const") {
            return constant(
                fromParameter(outputOf(template.value, output), output),
            );
        }
        function treeOf(t: ParameterTemplate): Expr | null {
            if (t.k === "const") {
                return constant(fromParameter(t.value, "number"));
            }
            if (t.k === "slot") {
                return models[t.slot];
            }
            if (t.op === "truth") {
                return null;
            }
            const args = t.args.map(treeOf);
            return args.every((arg) => arg !== null)
                ? { k: "op", op: t.op, args: args as Expr[] }
                : null;
        }
        let tree =
            output === "boolean" || output === "text" ? null : treeOf(template);
        if (tree && output === "integer") {
            tree = { k: "op", op: "round", args: [tree] };
        }
        return {
            k: "held",
            componentType:
                output === "boolean"
                    ? "boolean"
                    : output === "text"
                      ? "text"
                      : output,
            items: models,
            tree,
            compiled: { template, output },
        };
    }

    /**
     * Compile the parameters of `choice` as `spec` has them: each written
     * attribute is kept as a `CompiledAttribute` (`compiledOf`), to be held
     * by a `_selectionParameter` (`installCompiled`), and the spec returned
     * reads each through the compiled function, so the check computes them
     * as the selection does.
     *
     * A choice that reads the variant or an iteration must compile: a
     * parameter that doesn't is an error (`NotAnalysable`, `doenet-e0074`).
     * One that reads neither keeps what it is written as, and is compiled
     * only for another choice that reads its values; when it can't be, it
     * keeps the spec it has.
     */
    function compileChoice(choice: any, spec: ChoiceSpec): ChoiceSpec {
        if (!COMPILED_ATTRIBUTES[spec.type] || choice.extending) {
            return spec;
        }
        const dependent = variantDependent({
            k: "op",
            op: "+",
            args: exprsOfSpec(spec),
        });
        try {
            const { compiled, attributes } = compileSpec(choice, spec);
            compiledOf.set(choice, attributes);
            return compiled;
        } catch (e) {
            if (
                e instanceof NotAnalysable &&
                (dependent || spec.type === "selectRandomNumbers")
            ) {
                if (spec.type === "selectRandomNumbers") {
                    // what it draws from isn't known: any number
                    return { ...spec, distribution: null };
                }
                throw e;
            }
            if (e instanceof NotAnalysable) {
                return spec;
            }
            throw e;
        }
    }

    /** See `compileChoice`. */
    function compileSpec(
        choice: any,
        spec: ChoiceSpec,
    ): { compiled: ChoiceSpec; attributes: CompiledAttribute[] } {
        const attributes: CompiledAttribute[] = [];
        const outputs = COMPILED_ATTRIBUTES[spec.type]!;
        const seqType =
            spec.type === "selectFromSequence" ? spec.seqType : "number";
        const compiled: any = { ...spec };
        const writtenName = (name: string) =>
            attributeNamed(choice, name)?.name;

        for (const [name, kind] of Object.entries(outputs)) {
            const written = writtenName(name);
            const field = (spec as any)[name];
            const output: ParameterOutput =
                kind === "selectable"
                    ? seqType === "letters"
                        ? "text"
                        : seqType === "math"
                          ? "math"
                          : "number"
                    : kind === "number" && seqType === "math" && name === "step"
                      ? "math"
                      : kind;
            if (name === "exclude" || name === "excludeCombinations") {
                if (written === undefined || !field) {
                    continue;
                }
                const slots = new Slots();
                const entryOf = (entry: ListEntry): ParameterListEntry => {
                    if (entry.k === "many") {
                        if (entry.node === undefined) {
                            throw new NotAnalysable(entry.label ?? name);
                        }
                        return {
                            k: "all",
                            slot: slots.add(entry.node, constant(NaN)),
                        };
                    }
                    return {
                        k: "entry",
                        template: compileTemplate(
                            letterTextOf(entry, seqType),
                            slots,
                        ),
                    };
                };
                const checkEntry = (
                    entry: ListEntry,
                    compiledEntry: ParameterListEntry,
                ): ListEntry => {
                    if (entry.k === "many" || compiledEntry.k === "all") {
                        return entry;
                    }
                    const e = compiledExpr(
                        compiledEntry.template,
                        output,
                        slots.models,
                    );
                    return seqType === "letters"
                        ? { k: "op", op: "letterNumber", args: [e] }
                        : e;
                };
                let entries: ParameterListEntry[] = [];
                let lists: ParameterListEntry[][] = [];
                try {
                    if (name === "exclude") {
                        entries = (field as ListEntry[]).map(entryOf);
                    } else {
                        lists = (field as Expr[][]).map((c) => c.map(entryOf));
                    }
                } catch (e) {
                    if (e instanceof NotAnalysable) {
                        failedAttribute.set(choice, written);
                    }
                    throw e;
                }
                if (name === "exclude") {
                    attributes.push({
                        name: written,
                        parameter: { kind: "list", output, entries },
                        slotNodes: slots.nodes,
                    });
                    compiled.exclude = (field as ListEntry[]).map((entry, i) =>
                        checkEntry(entry, entries[i]),
                    );
                } else {
                    attributes.push({
                        name: written,
                        parameter: { kind: "lists", output, lists },
                        slotNodes: slots.nodes,
                    });
                    compiled.excludeCombinations = (field as Expr[][]).map(
                        (c, i) =>
                            c.map(
                                (entry, j) =>
                                    checkEntry(entry, lists[i][j]) as Expr,
                            ),
                    );
                }
                continue;
            }
            if (written === undefined || !field) {
                continue;
            }
            const slots = new Slots();
            const source: Expr =
                seqType === "letters" && (name === "from" || name === "to")
                    ? letterTextOf(field as Expr, "letters")
                    : (field as Expr);
            let template: ParameterTemplate;
            try {
                template = compileTemplate(source, slots);
            } catch (e) {
                if (e instanceof NotAnalysable) {
                    failedAttribute.set(choice, written);
                }
                throw e;
            }
            attributes.push({
                name: written,
                parameter: { kind: "scalar", output, template },
                slotNodes: slots.nodes,
            });
            const e = compiledExpr(template, output, slots.models);
            compiled[name] =
                seqType === "letters" && (name === "from" || name === "to")
                    ? { k: "op", op: "letterNumber", args: [e] }
                    : e;
        }
        return { compiled, attributes };
    }

    /**
     * For a letters sequence, the text a parameter is written as, which a
     * compiled parameter holds and the sequence reads as letters (its
     * `letterNumber`); for any other, the parameter.
     */
    function letterTextOf(expr: Expr, seqType: string): Expr {
        if (
            seqType === "letters" &&
            expr.k === "op" &&
            expr.op === "letterNumber"
        ) {
            return expr.args[0];
        }
        return expr;
    }

    /** The type of attribute component the attribute `name` of `choice` makes. */
    function attributeComponentTypeOf(choice: any, name: string) {
        const attributes = attributesObjectOf(
            (componentInfoObjects.allComponentClasses as any)[
                choice.componentType
            ],
        );
        const lower = name.toLowerCase();
        for (const [key, spec] of Object.entries(attributes)) {
            if (key.toLowerCase() === lower) {
                return (spec as any).createComponentOfType;
            }
        }
        return undefined;
    }

    /**
     * Hold each compiled parameter of `choice` in a `_selectionParameter` in
     * place of the attribute it was written as, its slots each a
     * `_selectionParameterSlot` holding the reference written for it (moved
     * from the attribute, or a copy of one written in another component,
     * such as a `<number>` the parameter reads).
     */
    function installCompiled(choice: any) {
        for (const { name, parameter, slotNodes } of compiledOf.get(choice) ??
            []) {
            const old: any = choice.attributes?.[name];
            if (old === undefined) {
                continue;
            }
            const inside = new Set<any>();
            const collect = (node: any) => {
                if (typeof node !== "object" || node === null) {
                    return;
                }
                inside.add(node);
                componentsUnder(node).forEach(collect);
            };
            if (old.type === "component") {
                collect(old.component);
            }
            const placed = new Set<any>();
            const children = slotNodes.map((node) => {
                let child = node;
                if (!inside.has(node) || placed.has(node)) {
                    child = structuredClone(node);
                    child.componentIdx = nComponents++;
                }
                placed.add(node);
                return {
                    type: "serialized",
                    componentType: "_selectionParameterSlot",
                    componentIdx: nComponents++,
                    attributes: {},
                    doenetAttributes: {},
                    children: [child],
                    state: {},
                };
            });
            const position =
                old.component?.doenetAttributes?.attributePosition ??
                old.component?.position ??
                old.position;
            const sourceDoc = old.component?.sourceDoc ?? old.sourceDoc;
            choice.attributes[name] = {
                type: "component",
                name,
                component: {
                    type: "serialized",
                    componentType: "_selectionParameter",
                    // the index of the attribute component it replaces, unless
                    // that is a reference it now holds as a slot
                    componentIdx:
                        old.type === "component" &&
                        typeof old.component?.componentIdx === "number" &&
                        !placed.has(old.component)
                            ? old.component.componentIdx
                            : nComponents++,
                    attributes: {},
                    doenetAttributes: {
                        selectionParameter: parameter,
                        // the type of the attribute component it replaces
                        attributeComponentType: attributeComponentTypeOf(
                            choice,
                            name,
                        ),
                        ...(position !== undefined
                            ? { attributePosition: position }
                            : {}),
                    },
                    children,
                    state: {},
                    ...(position !== undefined ? { position } : {}),
                    ...(sourceDoc !== undefined ? { sourceDoc } : {}),
                },
            };
        }
    }

    // ------------------------------------------------------------------
    // Each choice, in the order its references give (SEL-7)
    // ------------------------------------------------------------------

    const diagnostics: ReturnType<typeof codedDiagnostic>[] = [];
    const errorByChoice = new Map<any, ReturnType<typeof codedDiagnostic>>();
    const checked = new Map<any, boolean>();
    const verdicts = new Map<any, Verdict>();
    /** The choices that read a choice in error, and that choice. */
    const dependents: { choice: any; source: any }[] = [];

    for (const choice of choices) {
        const spec = specOf(choice);
        if (spec instanceof Skip) {
            if (spec.source) {
                dependents.push({ choice, source: spec.source });
            }
            continue;
        }
        if (spec instanceof NotAnalysable) {
            const attributeName = failedAttribute.get(choice) ?? "numToSelect";
            const found = attributeNamed(choice, attributeName);
            const attribute: any = found?.attribute;
            const position =
                attribute?.component?.doenetAttributes?.attributePosition ??
                attribute?.component?.position ??
                attribute?.position ??
                choice.position;
            const sourceDoc =
                attribute?.component?.sourceDoc ??
                attribute?.sourceDoc ??
                choice.sourceDoc;
            const diagnostic = codedDiagnostic({
                type: "error",
                code: "doenet-e0074",
                args: {
                    attribute: attributeName,
                    componentType: choice.componentType,
                    part: spec.part,
                    through: spec.through ? "component" : "none",
                    throughType: spec.through?.componentType ?? "",
                    reference: spec.through?.reference ?? "",
                },
                position,
                sourceDoc,
            });
            errorByChoice.set(choice, diagnostic);
            diagnostics.push(diagnostic);
            continue;
        }
        const exprs = exprsOfSpec(spec);
        if ([...atomsOf(exprs)].every((atom) => atom.decidedByDoenetML)) {
            // the same in every variant, which the choice decides itself
            checked.set(choice, true);
            continue;
        }
        // a choice it reads that is in error leaves it nothing to select
        // with: it is the same error, reported once, as a copy of it is
        const inError = orderedAtoms(exprs).find(
            (atom) =>
                atom.kind === "choice" &&
                (errorByChoice.has(atom.node) || !ensureChecked(atom.node)),
        );
        if (inError) {
            dependents.push({ choice, source: inError.node });
            continue;
        }
        const verdict = verdictOf(choice, spec);
        if (verdict.ok) {
            continue;
        }
        const diagnostic =
            "problem" in verdict
                ? codedDiagnostic({
                      type: "error",
                      code: "doenet-e0073",
                      args: {
                          componentType: choice.componentType,
                          when: verdict.when,
                          kind: verdict.problem.kind,
                          attribute: "",
                          numValues: "",
                          numToSelect: "",
                          variantName: "",
                          ...verdict.problem.args,
                      },
                      position: choice.position,
                      sourceDoc: choice.sourceDoc,
                  })
                : codedDiagnostic({
                      type: "error",
                      code: "doenet-e0073",
                      args: {
                          componentType: choice.componentType,
                          when: verdict.unproven,
                          kind: "unproven",
                          attribute: "",
                          numValues: "",
                          numToSelect: "",
                          variantName: "",
                      },
                      position: choice.position,
                      sourceDoc: choice.sourceDoc,
                  });
        errorByChoice.set(choice, diagnostic);
        diagnostics.push(diagnostic);
    }

    /**
     * The check of `choice`, made once: a choice read by others is checked
     * when the first of them is, and again by itself otherwise.
     */
    function verdictOf(choice: any, spec: ChoiceSpec): Verdict {
        let verdict = verdicts.get(choice);
        if (!verdict) {
            verdict = check(spec);
            verdicts.set(choice, verdict);
        }
        return verdict;
    }

    /**
     * Whether a choice read by another was checked and found able to
     * select. Choices are visited in document order, but one may read a
     * choice written after it (SEL-7).
     */
    function ensureChecked(choice: any): boolean {
        if (!CHECKED_TYPES.has(choice.componentType)) {
            return true;
        }
        if (checked.has(choice)) {
            return checked.get(choice)!;
        }
        if (errorByChoice.has(choice)) {
            return false;
        }
        checked.set(choice, true);
        const spec = specOf(choice);
        if (spec instanceof Skip || spec instanceof NotAnalysable) {
            checked.set(choice, false);
            return false;
        }
        const exprs = exprsOfSpec(spec);
        if (
            orderedAtoms(exprs).some(
                (atom) =>
                    atom.kind === "choice" &&
                    atom.node !== choice &&
                    !ensureChecked(atom.node),
            )
        ) {
            checked.set(choice, false);
            return false;
        }
        const ok =
            [...atomsOf(exprs)].every((atom) => atom.decidedByDoenetML) ||
            verdictOf(choice, spec).ok;
        checked.set(choice, ok);
        return ok;
    }

    // each choice that reads a choice in error, once that choice's error
    // is known, through a chain of them
    let added = true;
    while (added) {
        added = false;
        for (const { choice, source } of dependents) {
            const diagnostic = errorByChoice.get(source);
            if (diagnostic && !errorByChoice.has(choice)) {
                errorByChoice.set(choice, diagnostic);
                added = true;
            }
        }
    }

    // Each choice that reads the variant or an iteration, and each choice
    // another reads a value of, computes its parameters as the check did
    // (`utils/selectionParameters.ts`). One in error becomes an `_error`.
    const installing = new Set<any>();
    const visitInstall = (choice: any) => {
        if (installing.has(choice) || errorByChoice.has(choice)) {
            return;
        }
        installing.add(choice);
        const spec = specs.get(choice);
        if (!spec || spec instanceof Skip || spec instanceof NotAnalysable) {
            return;
        }
        for (const atom of orderedAtoms(exprsOfSpec(spec))) {
            if (atom.kind === "choice") {
                visitInstall(atom.node);
            }
        }
        for (const entry of [
            ...("exclude" in spec ? spec.exclude : []),
        ] as ListEntry[]) {
            if (entry.k === "many" && entry.choice) {
                visitInstall(entry.choice);
            }
        }
    };
    for (const [choice, spec] of specs) {
        if (
            !(spec instanceof Skip) &&
            !(spec instanceof NotAnalysable) &&
            variantDependent({ k: "op", op: "+", args: exprsOfSpec(spec) })
        ) {
            visitInstall(choice);
        }
    }
    for (const choice of installing) {
        if (!errorByChoice.has(choice)) {
            installCompiled(choice);
        }
    }

    makeChoicesErrors({ errorByChoice, nodes, nodeByIdx });
    return { diagnostics, nComponents };
}

/** The DoenetML of the document being checked, for references in messages. */
let currentSources: readonly string[] | undefined;

/** The `Ref` a `_copy` or `_ref` extends, if one. */
function refOf(node: any): any {
    // `Ref`, or `ExtendAttribute`, `CopyAttribute`, … for an extend or copy
    const ref = node?.extending ? Object.values(node.extending)[0] : undefined;
    return typeof ref === "object" && ref !== null ? ref : undefined;
}

/**
 * The number a part of a math-expressions tree with no reference in it is,
 * as math-expressions evaluates it, for the structure of a value
 * (`fromTree`), or `undefined` when it isn't one.
 */
function numberOfTree(tree: any): number | undefined {
    try {
        const value = me.fromAst(tree).evaluate_to_constant();
        if (typeof value === "number" && Number.isFinite(value)) {
            return value;
        }
    } catch (e) {
        // not a number
    }
    return undefined;
}

/**
 * A value as a component of the document holds it, to be read by another
 * component (`runTimeValue`): a number, a letter as its text, or the value
 * a `Sym` came from.
 */
function toRunTime(v: Value): RunTimeChild {
    if (typeof v === "number") {
        return { componentType: "number", value: v };
    }
    if (v.runTime) {
        return v.runTime;
    }
    const letters = /^(letters|LETTERS):(-?\d+)$/.exec(v.symbolic);
    if (letters) {
        return {
            componentType: "text",
            value: numberToLetters(
                Number(letters[2]),
                letters[1] === "letters",
            ),
        };
    }
    try {
        return {
            componentType: "math",
            value: me.fromAst(JSON.parse(v.symbolic)),
        };
    } catch (e) {
        return { componentType: "text", value: v.symbolic };
    }
}

/**
 * The value a component holds as the check reads it: a number (a math that
 * evaluates to one, as `evaluate_to_constant` reads it; a boolean as 1 or
 * 0), or a `Sym` for anything else, holding what the component holds.
 */
function fromRunTime(child: RunTimeChild): Value {
    switch (child.componentType) {
        case "number":
            return typeof child.value === "number" ? child.value : NaN;
        case "boolean":
            // a `<number>` reads a boolean as no number, as the run time
            // does; a boolean parameter reads it with `truthOf`
            return sym(child.value ? "true" : "false", child);
        case "text":
            return sym(child.value, child);
        case "math": {
            let number: unknown = NaN;
            try {
                number = child.value.evaluate_to_constant();
            } catch (e) {
                // not a number
            }
            if (typeof number === "number" && Number.isFinite(number)) {
                return number;
            }
            let tree: unknown;
            try {
                tree = child.value.tree;
            } catch (e) {
                tree = "＿";
            }
            return sym(JSON.stringify(tree), child);
        }
    }
}

/**
 * A value as a slot of a compiled parameter holds it (`slotValue` in
 * `utils/selectionParameters.ts`): a number, or, for a value that isn't
 * one, its text (a letter as its letters, a math as its tree).
 */
function toParameter(v: Value): ParameterValue {
    if (typeof v === "number") {
        return v;
    }
    const letters = /^(letters|LETTERS):(-?\d+)$/.exec(v.symbolic);
    if (letters) {
        // a letter a selection holds, as the `<text>` it is
        return {
            symbolic: numberToLetters(
                Number(letters[2]),
                letters[1] === "letters",
            ),
            text: true,
        };
    }
    if (v.runTime?.componentType === "text") {
        return { symbolic: v.runTime.value, text: true };
    }
    if (v.runTime?.componentType === "boolean") {
        return v.runTime.value ? 1 : 0;
    }
    return { symbolic: v.symbolic };
}

/** A compiled parameter's value as the check reads it. */
function fromParameter(v: ParameterValue, output: ParameterOutput): Value {
    if (typeof v === "number") {
        return v;
    }
    return output === "text"
        ? sym(v.symbolic, { componentType: "text", value: v.symbolic })
        : sym(v.symbolic);
}

/** A value of a letters sequence, by its number. */
function lettersValue(n: number, lowercase: boolean): Sym {
    return { symbolic: `${lowercase ? "letters" : "LETTERS"}:${n}` };
}

/**
 * The number `v` is in a sequence of `seqType`, a letter of a letters
 * sequence by its number, or `undefined` when it isn't one.
 */
function sequenceNumber(v: Value, seqType: string): number | undefined {
    if (typeof v === "number") {
        return Number.isNaN(v) ? undefined : v;
    }
    const letters = /^letters:(-?\d+)$/i.exec(v.symbolic);
    return seqType === "letters" && letters ? Number(letters[1]) : undefined;
}

/**
 * The indices (from 0) of the values of `seq` that `excluded` leaves out,
 * as the sequence decides (`returnSequenceValueForIndex`).
 */
function excludedIndices(
    seq: { from: number; step: number; length: number },
    excluded: number[],
    seqType = "number",
): Set<number> {
    const same =
        seqType === "math"
            ? (x: number, i: number) => sameMath(x, seq, i)
            : (x: number, i: number) =>
                  sameNumber(x, seq.from + i * seq.step, seq.step);
    const found = new Set<number>();
    for (const x of excluded) {
        if (seq.step === 0) {
            // every value is `from`
            if (same(x, 0)) {
                for (let i = 0; i < seq.length; i++) {
                    found.add(i);
                }
            }
            continue;
        }
        const k = Math.round((x - seq.from) / seq.step);
        for (const i of [k - 1, k, k + 1]) {
            if (i >= 0 && i < seq.length && same(x, i)) {
                found.add(i);
            }
        }
    }
    return found;
}

/** What `sameMath` found, by the sequence, index and value. */
const sameMathFound = new Map<string, boolean>();

/**
 * Whether `x` leaves out the value at index `i` of a math sequence, as the
 * sequence decides: it computes that value as a math and compares the
 * exclusion with `equals` (`returnSequenceValueForIndex`), whose tolerance
 * isn't a number sequence's.
 */
function sameMath(
    x: number,
    seq: { from: number; step: number },
    i: number,
): boolean {
    const v = seq.from + i * seq.step;
    if (
        Math.abs(x - v) >
        1e-9 * Math.max(Math.abs(x), Math.abs(v), Math.abs(seq.step))
    ) {
        // much further apart than `equals` tells apart
        return false;
    }
    const key = `${seq.from},${seq.step},${i},${x}`;
    let found = sameMathFound.get(key);
    if (found === undefined) {
        found =
            returnSequenceValueForIndex({
                index: i,
                from: me.fromAst(seq.from),
                step: me.fromAst(seq.step),
                exclude: [me.fromAst(x)],
                type: "math",
            }) === null;
        if (sameMathFound.size > 100000) {
            sameMathFound.clear();
        }
        sameMathFound.set(key, found);
    }
    return found;
}

/** Whether two numbers of a sequence are the same, as the sequence decides. */
function sameNumber(x: number, v: number, step: number) {
    return (
        Math.abs(x - v) <=
        1e-14 * Math.max(Math.abs(x), Math.abs(v), Math.abs(step))
    );
}

/** How many ordered combinations of `k` of `n` values there are. */
function orderedCount(n: number, k: number, withReplacement: boolean) {
    if (withReplacement) {
        return Math.pow(n, k);
    }
    let total = 1;
    for (let i = 0; i < k; i++) {
        total *= n - i;
    }
    return Math.max(0, total);
}

/** The index written in `$a[2]`, when it is a literal integer. */
function literalIndex(indexPart: any): number | undefined {
    const value = indexPart?.value;
    if (
        Array.isArray(value) &&
        value.length === 1 &&
        typeof value[0] === "string" &&
        /^\s*\d+\s*$/.test(value[0])
    ) {
        return Number(value[0]);
    }
    return undefined;
}

/**
 * A boolean attribute whose value the conversion of the document already
 * found (written as `true` or `false`, or with no value), or `undefined`
 * for one a `<boolean>` computes (`analyseContent`).
 */
function literalBoolean(attribute: any): boolean | undefined {
    if (attribute.type === "primitive") {
        const v = attribute.primitive?.value;
        return typeof v === "boolean" ? v : undefined;
    }
    if (attribute.type === "literal") {
        return typeof attribute.value === "boolean"
            ? attribute.value
            : undefined;
    }
    const component = attribute.component;
    if (
        component?.componentType === "boolean" &&
        typeof component.state?.value === "boolean"
    ) {
        return component.state.value;
    }
    return undefined;
}

/** The text an attribute is written as, when it is only text. */
function literalTextOf(attribute: any): string | undefined {
    if (attribute.type === "primitive") {
        return String(attribute.primitive?.value);
    }
    if (attribute.type === "literal") {
        return attribute.text === undefined
            ? undefined
            : String(attribute.text).trim();
    }
    const component = attribute.component;
    const children = component ? component.children : attribute.children;
    if (
        Array.isArray(children) &&
        children.every((child: unknown) => typeof child === "string")
    ) {
        return children.join("").trim();
    }
    if (
        component &&
        Array.isArray(children) &&
        children.length === 1 &&
        typeof children[0] === "object" &&
        (children[0].children ?? []).every(
            (c: unknown) => typeof c === "string",
        ) &&
        !children[0].extending &&
        children[0].componentType !== "_copy" &&
        children[0].componentType !== "_ref"
    ) {
        return (children[0].children ?? []).join("").trim();
    }
    return undefined;
}

/**
 * The variant names an option's `selectForVariants` is written as, separated
 * by spaces, when written as text.
 */
function variantNamesText(attribute: any): string | undefined {
    if (attribute.type === "primitive" || attribute.type === "literal") {
        return literalTextOf(attribute);
    }
    const parts: string[] = [];
    function visit(children: any[]): boolean {
        for (const child of children) {
            if (typeof child === "string") {
                parts.push(child);
            } else if (
                child.componentType === "_copy" ||
                child.componentType === "_ref" ||
                child.extending ||
                !visit(child.children ?? [])
            ) {
                return false;
            }
        }
        return true;
    }
    return attribute.component && visit([attribute.component])
        ? parts.join(" ")
        : undefined;
}

/** Whether `attribute` holds a reference. */
function holdsReference(attribute: any): boolean {
    function visit(node: any): boolean {
        if (typeof node !== "object" || node === null) {
            return false;
        }
        if (
            node.componentType === "_copy" ||
            node.componentType === "_ref" ||
            node.extending
        ) {
            return true;
        }
        return componentsUnder(node).some(visit);
    }
    return (
        (attribute?.slots ?? []).length > 0 ||
        (attribute?.component ? visit(attribute.component) : false)
    );
}

/** Whether an `_error` (a cycle, reported already) is in `attribute`. */
function containsError(attribute: any): boolean {
    function visit(node: any): boolean {
        if (typeof node !== "object" || node === null) {
            return false;
        }
        if (node.componentType === "_error") {
            return true;
        }
        return componentsUnder(node).some(visit);
    }
    return attribute?.component ? visit(attribute.component) : false;
}

/** The written text of an attribute, roughly, for a message. */
function writtenText(attribute: any): string {
    if (attribute.type === "primitive") {
        return String(attribute.primitive?.value);
    }
    if (attribute.type === "literal") {
        return String(attribute.text ?? "");
    }
    return attribute.component ? textOfChildren([attribute.component]) : "";
}

/**
 * The text of `children` as written, roughly: strings, and each reference
 * as `$` and its path.
 */
function textOfChildren(children: any[]): string {
    return children
        .map((child) => {
            if (typeof child === "string") {
                return child;
            }
            const ref = refOf(child);
            if (ref) {
                return doenetMLReferenceAsWritten(
                    ref.originalPath,
                    currentSources,
                );
            }
            return textOfChildren(child.children ?? []);
        })
        .join("")
        .trim();
}
