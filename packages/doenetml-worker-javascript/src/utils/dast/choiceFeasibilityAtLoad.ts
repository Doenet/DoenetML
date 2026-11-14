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
 * ## What a parameter can be (SEL-6)
 *
 * A parameter is analysable when it is:
 * - a literal (a number, or for a `type="math"` sequence any math);
 * - a reference SEL-1 allows, with a known range:
 *   - another random choice, `$a` or `$a[2]`: what it can select, found
 *     from its own parameters (SEL-7, so choices are checked in the order
 *     their references give, and a choice in error leaves those reading it
 *     unchecked, reported once);
 *   - a repeat's `indexName`: every iteration that can exist, `1` to the
 *     most iterations the repeat can have, or `1, 2, 3, …` with no end when
 *     the count isn't analysable (it may come from an input, SEL-2);
 *   - a repeat's `valueName`, when what the repeat iterates over is in these
 *     forms;
 *   - a `<number>`, `<integer>` or `<math>` whose content is in these
 *     forms, or that extends one with nothing of its own, or a component
 *     written as a literal (a `<boolean>`, a `<text>`, a `<numberList>`, a
 *     `<sequence>` in a list). SEL-6 names a `<number>` and an `<integer>`;
 *     a `<math>` is read too, as `numToSelect` read through a chain of
 *     `<math>`s and extends is a test the principles keep binding (COMP-8,
 *     "…initially unresolved");
 *   - a component in an iteration of a repeat, `$r[1].n`, over every
 *     iteration;
 * - `+ − ×`, `/`, `min`, `max`, `abs`, `floor`, `ceil` and `round` of these.
 *
 * Anything else is an error (`doenet-e0074`), at the parameter, naming the
 * part that isn't analysable, and the `<number>` it is in when it is in
 * one. A boolean parameter (`withReplacement`, `coprime`) written as a
 * reference can only be true or false, so it is checked as both.
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
 * select) and from the iteration it is in (an index). When every such value
 * ranges over a finite set, and there are not too many combinations, every
 * combination is checked exactly, as the choice itself would check it when
 * it selects, and the first that fails is named: "when `$a` = 1, it has 1
 * value to select 3 from" (`doenet-e0073`). Values that depend on each other
 * (`to="$a + 2"` and `from="$a"`) are taken together, never as if
 * independent.
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
import { lettersToNumber } from "@doenet/utils";
import { textToMathFactory } from "../math";
import { mathCodePre } from "../valueFunctions/math";
import { createInputStringFromChildren } from "../parseMath";
import { calculateSequenceParameters } from "../sequence";
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
type Sym = { symbolic: string };
type Value = number | Sym;

/**
 * What a parameter is, as an expression in the values it reads (atoms).
 * `item` is the entry, at the index `args[0]` (from 1), of `args[1..]`.
 */
type Expr =
    | { k: "const"; value: Value }
    /** `expr`, written as the reference `label`, which names it in a message. */
    | { k: "named"; label: string; expr: Expr }
    | { k: "atom"; atom: Atom }
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
              | "item";
          args: Expr[];
      };

/**
 * An entry of a list parameter (`exclude`): one value, or every value a
 * choice selects, of which there are `count`.
 */
type ListEntry = Expr | { k: "many"; count: Expr };

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
    /**
     * A `bool` whose value the DoenetML decides, though the check doesn't
     * work it out (`withReplacement="1>0"`): both values are checked, but
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
}: {
    document: SerializedComponent;
    componentInfoObjects: ComponentInfoObjects;
    sources: readonly string[];
}) {
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
        return [];
    }

    let nextAtomId = 0;
    const choiceAtoms = new Map<string, Atom>();
    const indexAtoms = new Map<any, Atom>();
    const seqValueAtoms = new Map<any, Atom>();
    /** What each atom's range is computed from. */
    const atomSources = new Map<Atom, Expr[]>();

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
            spec = analyseChoice(choice);
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

    function scalarParam(choice: any, name: string): Expr | null {
        const attribute = attr(choice, name);
        if (attribute === undefined) {
            return null;
        }
        try {
            return analyseAttributeScalar(attribute);
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
        const literal =
            literalBoolean(attribute) ??
            (holdsReference(attribute)
                ? undefined
                : numericBoolean(literalTextOf(attribute)));
        if (literal !== undefined) {
            return constant(literal ? 1 : 0);
        }
        if (containsError(attribute)) {
            throw new Skip();
        }
        // a reference SEL-1 allows, or an expression (`1>0`): true or
        // false, so both. One with no reference in it is decided by the
        // DoenetML, so it doesn't make the choice differ between variants.
        const atom: Atom = {
            id: nextAtomId++,
            label: `${attributeNamed(choice, name)!.name}`,
            kind: "bool",
            decidedByDoenetML: !holdsReference(attribute),
        };
        atomSources.set(atom, []);
        return { k: "atom", atom };
    }

    function listParam(choice: any, name: string): ListEntry[] {
        const attribute = attr(choice, name);
        if (attribute === undefined) {
            return [];
        }
        try {
            return analyseAttributeList(attribute);
        } catch (e) {
            if (e instanceof NotAnalysable) {
                failedAttribute.set(choice, attributeNamed(choice, name)!.name);
            }
            throw e;
        }
    }

    function combinationsParam(choice: any): Expr[][] | null {
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
                for (const entry of listEntriesOf(list.children ?? [])) {
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
            const sequenceAttribute = (name: string) =>
                seqType === "letters"
                    ? lettersParam(choice, name)
                    : scalarParam(choice, name);
            return {
                type,
                seqType,
                from: sequenceAttribute("from"),
                to: sequenceAttribute("to"),
                step: scalarParam(choice, "step"),
                length: scalarParam(choice, "length"),
                exclude:
                    seqType === "letters"
                        ? lettersListParam(choice)
                        : listParam(choice, "exclude"),
                numToSelect,
                withReplacement: boolParam(choice, "withReplacement"),
                coprime: boolParam(choice, "coprime"),
                excludeCombinations: combinationsParam(choice),
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

    /** What an option is, when it is one literal value. */
    function literalValueOfOption(option: any): Value | undefined {
        const children = (option.children ?? []).filter(
            (c: any) => typeof c !== "string" || c.trim() !== "",
        );
        if (children.length !== 1) {
            return undefined;
        }
        const child = children[0];
        if (typeof child === "string") {
            return parseLiteral(child);
        }
        if (
            ["math", "number", "integer", "text"].includes(
                child.componentType,
            ) &&
            !child.extending &&
            (child.children ?? []).every((c: any) => typeof c === "string")
        ) {
            const text = (child.children ?? []).join("").trim();
            return child.componentType === "text"
                ? { symbolic: text }
                : parseLiteral(text);
        }
        return undefined;
    }

    /** A letters sequence's `from` or `to`: letters, as numbers. */
    function lettersParam(choice: any, name: string): Expr | null {
        const attribute = attr(choice, name);
        if (attribute === undefined) {
            return null;
        }
        const text = literalTextOf(attribute);
        const number = text === undefined ? undefined : lettersToNumber(text);
        if (number === undefined) {
            failedAttribute.set(choice, attributeNamed(choice, name)!.name);
            if (containsError(attribute)) {
                throw new Skip();
            }
            throw new NotAnalysable(text ?? writtenText(attribute));
        }
        return constant(number);
    }

    function lettersListParam(choice: any): ListEntry[] {
        // letters, as the numbers a letters sequence has
        return listParam(choice, "exclude").map((entry) => {
            if (entry.k === "const" && typeof entry.value !== "number") {
                const number = lettersToNumber(entry.value.symbolic);
                return number === undefined ? entry : constant(number);
            }
            return entry;
        });
    }

    /** The attribute `attribute` as one value. */
    function analyseAttributeScalar(attribute: any): Expr {
        if (attribute.type === "primitive") {
            const value = attribute.primitive?.value;
            if (typeof value === "number") {
                return constant(value);
            }
            if (typeof value === "boolean") {
                return constant(value ? 1 : 0);
            }
            return constant(parseLiteral(String(value)));
        }
        if (attribute.type === "literal") {
            if (typeof attribute.value === "number") {
                return constant(attribute.value);
            }
            return constant(parseLiteral(String(attribute.text ?? "")));
        }
        if (attribute.component) {
            return analyseInPlace(attribute.component);
        }
        throw new NotAnalysable(writtenText(attribute));
    }

    /** The attribute `attribute` as a list of values. */
    function analyseAttributeList(attribute: any): ListEntry[] {
        if (attribute.type === "primitive" || attribute.type === "literal") {
            const text =
                attribute.type === "literal"
                    ? String(attribute.text ?? "")
                    : String(attribute.primitive?.value ?? "");
            return text
                .split(/[\s,]+/)
                .filter(Boolean)
                .map((part) => constant(parseLiteral(part)));
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
            return listOfReference(component);
        }
        return listEntriesOf(component.children ?? []);
    }

    /** The entries of a list written as `children`. */
    function listEntriesOf(children: any[]): ListEntry[] {
        const entries: ListEntry[] = [];
        for (const child of children) {
            if (typeof child === "string") {
                for (const part of child.split(/[\s,]+/).filter(Boolean)) {
                    entries.push(constant(parseLiteral(part)));
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
                entries.push(...listOfReference(child));
                continue;
            }
            entries.push(analyseInPlace(child));
        }
        return entries;
    }

    /** What a reference in a list stands for: one value, or several. */
    function listOfReference(node: any): ListEntry[] {
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
                return [choiceAtomExpr(target, 1, ref)];
            }
            return [{ k: "many", count: spec.numToSelect }];
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
            return listEntriesOf(target.children ?? []);
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
     * attribute is made of (a `<number>`, an `<integer>`, a `<math>`), or a
     * reference.
     */
    function analyseInPlace(node: any): Expr {
        if (typeof node === "string") {
            return constant(parseLiteral(node));
        }
        const type = node.componentType;
        if (type === "_error") {
            throw new Skip();
        }
        if (type === "_copy" || type === "_ref") {
            return analyseReference(node);
        }
        if (
            [
                "_componentWithSelectableType",
                "number",
                "integer",
                "math",
            ].includes(type) &&
            !node.extending
        ) {
            return analyseContent(node.children ?? []);
        }
        if (
            type === "text" &&
            !node.extending &&
            (node.children ?? []).every((c: any) => typeof c === "string")
        ) {
            return constant({
                symbolic: (node.children ?? []).join("").trim(),
            });
        }
        if (type === "boolean" && !node.extending) {
            const value = literalBooleanText(node);
            if (value !== undefined) {
                return constant(value ? 1 : 0);
            }
        }
        throw new NotAnalysable(textOfChildren([node]));
    }

    /**
     * Content written as text and references, as one value: the text
     * parsed as math, with each reference in it analysed.
     */
    function analyseContent(children: any[]): Expr {
        // a label names the value, and is no part of it
        children = children.filter(
            (child) =>
                typeof child === "string" || child.componentType !== "label",
        );
        const meaningful = children.filter(
            (child) => typeof child !== "string" || child.trim() !== "",
        );
        if (meaningful.length === 1 && typeof meaningful[0] !== "string") {
            return analyseInPlace(meaningful[0]);
        }
        const components = children.filter(
            (child) => typeof child !== "string",
        );
        if (components.length === 0) {
            return constant(parseLiteral(children.join("")));
        }
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
        let tree: any;
        try {
            tree = parser(string).tree;
        } catch (e) {
            throw new NotAnalysable(textOfChildren(children));
        }
        const codes = new Map<string, any>();
        components.forEach((component, k) => {
            codes.set(codePre + k, component);
        });
        return fromTree(tree, codes, codePre, children);
    }

    /** A math-expressions tree as an expression in the atoms. */
    function fromTree(
        tree: any,
        codes: Map<string, any>,
        codePre: string,
        children: any[],
    ): Expr {
        function partText(sub: any) {
            let text: string;
            try {
                text = me.fromAst(sub).toString();
            } catch (e) {
                text = textOfChildren(children);
            }
            for (const [code, component] of codes) {
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
                return analyseInPlace(codes.get(sub));
            }
            if (!hasCode(sub)) {
                // a literal part
                const value = literalOfTree(sub);
                if (typeof value === "number") {
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
        return analyseNamed(target, ref, ref.unresolvedPath ?? []);
    }

    /** What `target`, named by `ref`, with what is left of its path, is. */
    function analyseNamed(target: any, ref: any, path: any[]): Expr {
        const type = target.componentType;
        if (type === "_error") {
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
                return choiceAtomExpr(target, 1, ref);
            }
            if (
                path.length === 1 &&
                (path[0].name ?? "") === "" &&
                (path[0].index ?? []).length === 1
            ) {
                const entry = literalIndex(path[0].index[0]);
                return choiceAtomExpr(target, entry ?? "any", ref);
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
                return analyseNamed(named, ref, []);
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
            const entries = listEntriesOf(target.children ?? []);
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
            return { k: "atom", atom: moduleAttributeAtom(target, ref) };
        }
        const iteration = iterationVariable(target);
        if (iteration) {
            return iteration.kind === "index"
                ? { k: "atom", atom: indexAtom(iteration.repeat, ref) }
                : repeatValue(iteration.repeat, ref);
        }
        if (
            (type === "number" || type === "integer" || type === "math") &&
            !target.extending
        ) {
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
        if (
            type === "text" &&
            !target.extending &&
            (target.children ?? []).every((c: any) => typeof c === "string")
        ) {
            return constant({ symbolic: target.children.join("").trim() });
        }
        if (
            type === "boolean" &&
            !target.extending &&
            (target.children ?? []).every((c: any) => typeof c === "string")
        ) {
            // written as a literal
            if (type === "boolean") {
                const value = literalBooleanText(target);
                if (value !== undefined) {
                    return constant(value ? 1 : 0);
                }
            } else {
                return constant(parseLiteral(target.children.join("")));
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
                return analyseNamed(named, ref, []);
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
                        sources.push(analyseWrittenAttribute(written));
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
    function analyseWrittenAttribute(written: any): Expr {
        if (written.type === "unresolved") {
            return analyseContent(written.children ?? []);
        }
        return analyseAttributeScalar(written);
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
            const expr = analyseContent(target.children ?? []);
            contentMemo.set(target, expr);
            return expr;
        } catch (e) {
            if (e instanceof NotAnalysable || e instanceof Skip) {
                contentMemo.set(target, e);
            }
            throw e;
        }
    }

    /** The atom of a value the choice `choice` selects. */
    function choiceAtomExpr(
        choice: any,
        entry: number | "any",
        ref: any,
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
            };
            choiceAtoms.set(key, atom);
            const spec = specOf(choice) as ChoiceSpec;
            atomSources.set(atom, exprsOfSpec(spec));
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
                            const text = literalTextOf(attribute);
                            const number =
                                text === undefined
                                    ? undefined
                                    : lettersToNumber(text);
                            if (number === undefined) {
                                throw new NotAnalysable(writtenText(attribute));
                            }
                            return constant(number);
                        }
                        return analyseAttributeScalar(attribute);
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
            const entries = listEntriesOf(target.children ?? []);
            if (entries.every((e) => e.k !== "many")) {
                return { kind: "items", items: entries };
            }
        }
        return undefined;
    }

    /** An item a `<repeat for>` iterates over, as a value, if it is one. */
    function itemOf(child: any): Expr {
        try {
            return analyseInPlace(child);
        } catch (e) {
            if (e instanceof NotAnalysable || e instanceof Skip) {
                return constant({ symbolic: "?" });
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
    function repeatValue(repeat: any, ref: any): Expr {
        return {
            k: "named",
            label: referenceText(ref),
            expr: repeatValueOf(repeat, ref),
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
        if (expr.k === "named") {
            return evaluate(expr.expr, assignment);
        }
        if (expr.k === "atom") {
            const value = assignment.get(expr.atom);
            return value === undefined ? NaN : value;
        }
        if (expr.op === "item") {
            const index = evaluate(expr.args[0], assignment);
            if (typeof index !== "number") {
                return NaN;
            }
            const item = expr.args[index];
            return item ? evaluate(item, assignment) : NaN;
        }
        const values = expr.args.map((arg) => evaluate(arg, assignment));
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
                        values.findIndex(
                            (w) => JSON.stringify(w) === JSON.stringify(v),
                        ) === i,
                ),
            };
        }
        if (atom.kind === "choice") {
            return choiceValues(
                atom.node,
                specOf(atom.node) as ChoiceSpec,
                (e) => evaluate(e, assignment),
            );
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
        p: RepeatSequence,
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
        const excluded = exclude
            .filter((e): e is Expr => e.k !== "many")
            .map((e) => value(e))
            .filter((v): v is number => typeof v === "number");
        const values: Value[] = [];
        for (let i = 0; i < seq.length; i++) {
            const v = seq.from + i * seq.step;
            if (excluded.some((x) => sameNumber(x, v, seq.step))) {
                continue;
            }
            values.push(
                p.seqType === "letters" ? { symbolic: `letters:${v}` } : v,
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
                    return { finite: [{ symbolic: "math" }] };
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
            return { finite: [{ symbolic: "option" }] };
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

    /** What, if anything, keeps `spec` from selecting with these values. */
    function concreteProblem(
        spec: ChoiceSpec,
        value: (e: Expr) => Value,
    ): Problem | null | "unknown" {
        const number = (e: Expr) => {
            const v = value(e);
            return typeof v === "number" ? v : NaN;
        };
        const numToSelectValue = number(spec.numToSelect);
        if (Number.isNaN(numToSelectValue)) {
            return { kind: "number", args: { attribute: "numToSelect" } };
        }
        const numToSelect = Math.round(numToSelectValue);
        if (numToSelect < 1) {
            return null;
        }
        if (spec.type === "selectRandomNumbers") {
            return null;
        }
        const withReplacement = number(spec.withReplacement) !== 0;
        const need = withReplacement ? 1 : numToSelect;

        if (spec.type === "select") {
            if (spec.optionsByVariant) {
                for (const [variantName, count] of Object.entries(
                    spec.optionsByVariant,
                )) {
                    if (count !== numToSelect) {
                        return {
                            kind: "variants",
                            args: {
                                variantName,
                                numValues: count,
                                numToSelect,
                            },
                        };
                    }
                }
                return null;
            }
            if (spec.numOptions === null) {
                return need > 1 ? "unknown" : null;
            }
            if (spec.numOptions === 0 || need <= spec.numOptions) {
                return null;
            }
            return {
                kind: "options",
                args: { numValues: spec.numOptions, numToSelect: need },
            };
        }

        // the values to select from, and how many more an exclusion that
        // isn't one value may leave out
        let values: number[] | null = null;
        let numValues: number;
        let unknownExcluded = 0;
        const excludedValues: number[] = [];
        for (const entry of spec.exclude) {
            if (entry.k === "many") {
                const count = number(entry.count);
                unknownExcluded += Number.isFinite(count)
                    ? Math.max(0, Math.round(count))
                    : 0;
                continue;
            }
            const v = value(entry);
            if (typeof v === "number") {
                if (!Number.isNaN(v)) {
                    excludedValues.push(v);
                }
            } else {
                unknownExcluded++;
            }
        }

        if (spec.type === "selectFromSequence") {
            for (const name of ["from", "to", "step", "length"] as const) {
                const e = spec[name];
                if (e && spec.seqType !== "math") {
                    const v = value(e);
                    if (typeof v !== "number" || Number.isNaN(v)) {
                        return { kind: "number", args: { attribute: name } };
                    }
                }
            }
            const seq = concreteSequence(spec, value);
            if (!seq) {
                if (spec.seqType === "math" && spec.length) {
                    // symbolic values: only how many is known
                    numValues = Math.max(
                        0,
                        Math.round(number(spec.length)) -
                            spec.exclude.length -
                            unknownExcluded,
                    );
                    if (need > numValues) {
                        return {
                            kind: "values",
                            args: { numValues, numToSelect: need },
                        };
                    }
                    return spec.excludeCombinations ? "unknown" : null;
                }
                return "unknown";
            }
            if (seq.length > 10 * MAX_VALUES) {
                const excludedInSequence = new Set<number>();
                for (const x of excludedValues) {
                    const k = (x - seq.from) / seq.step;
                    const rounded = Math.round(k);
                    if (
                        Math.abs(k - rounded) < 1e-10 &&
                        rounded >= 0 &&
                        rounded < seq.length
                    ) {
                        excludedInSequence.add(rounded);
                    }
                }
                numValues = seq.length - excludedInSequence.size;
            } else {
                values = [];
                for (let i = 0; i < seq.length; i++) {
                    const v = seq.from + i * seq.step;
                    if (
                        !excludedValues.some((x) => sameNumber(x, v, seq.step))
                    ) {
                        values.push(v);
                    }
                }
                numValues = values.length;
            }
            numValues = Math.max(0, numValues - unknownExcluded);
            if (need > numValues) {
                return {
                    kind: "values",
                    args: { numValues, numToSelect: need },
                };
            }
            const coprime =
                number(spec.coprime) !== 0 &&
                spec.seqType === "number" &&
                !spec.excludeCombinations &&
                numToSelect > 1;
            if (coprime) {
                if (unknownExcluded > 0 || !values) {
                    return "unknown";
                }
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
        } else {
            const from = number(spec.from);
            const to = number(spec.to);
            if (Number.isNaN(from)) {
                return { kind: "number", args: { attribute: "from" } };
            }
            if (Number.isNaN(to)) {
                return { kind: "number", args: { attribute: "to" } };
            }
            values = createPrimesList({
                from: Math.round(from),
                to: Math.round(to),
                exclude: excludedValues as never[],
            });
            numValues = Math.max(0, values!.length - unknownExcluded);
            if (need > numValues) {
                return {
                    kind: "primes",
                    args: { numValues, numToSelect: need },
                };
            }
        }

        if (spec.excludeCombinations && spec.excludeCombinations.length > 0) {
            const combinations = spec.excludeCombinations
                .map((c) =>
                    c.slice(0, numToSelect).map((e) => {
                        const v = value(e);
                        if (typeof v === "number") {
                            return v;
                        }
                        // letters, as the numbers a letters sequence has
                        const letters =
                            spec.type === "selectFromSequence" &&
                            spec.seqType === "letters"
                                ? lettersToNumber(v.symbolic)
                                : undefined;
                        // a value that isn't a number matches any
                        return letters ?? NaN;
                    }),
                )
                .filter((c) => c.length === numToSelect);
            if (!values || unknownExcluded > 0) {
                // only how many combinations there are is known
                const total = orderedCount(
                    numValues,
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
        return v.symbolic.startsWith("letters:")
            ? String(v.symbolic.slice(8))
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
            .map((n) =>
                n.atom?.kind === "bool"
                    ? `\`${n.label}\` = ${assignment.get(n.atom) ? "true" : "false"}`
                    : `\`${n.label}\` = ${describeValue(evaluate(n.expr, assignment))}`,
            )
            .join(", ");
    }

    function check(spec: ChoiceSpec): Verdict {
        const exprs = exprsOfSpec(spec);
        const direct = namedOf(exprs);
        const ordered = orderedAtoms(exprs);

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
            result = choiceBounds(atom.node, specOf(atom.node) as ChoiceSpec);
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

    function exprKey(expr: Expr): string {
        if (expr.k === "named") {
            return exprKey(expr.expr);
        }
        if (expr.k === "const") {
            return JSON.stringify(expr.value);
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
    ): Verdict {
        const describeRanges = () =>
            direct
                .map((a) => {
                    const b = intervalOf(a.expr);
                    if (a.atom?.kind === "bool") {
                        return `\`${a.label}\` ∈ {true, false}`;
                    }
                    if (b.integer && b.hi === Infinity) {
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
        if (numToSelectBounds.hi < 0.5) {
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
            for (const atom of ordered) {
                if (!assignment.has(atom)) {
                    const domain = domainOf(atom, assignment);
                    const v =
                        "finite" in domain
                            ? domain.finite[0]
                            : Number.isFinite(domain.lo)
                              ? domain.lo
                              : Number.isFinite(domain.hi)
                                ? domain.hi
                                : 0;
                    if (v !== undefined) {
                        assignment.set(atom, v);
                    }
                }
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
    // Each choice, in the order its references give (SEL-7)
    // ------------------------------------------------------------------

    const diagnostics: ReturnType<typeof codedDiagnostic>[] = [];
    const errorByChoice = new Map<any, ReturnType<typeof codedDiagnostic>>();
    const checked = new Map<any, boolean>();
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
        const verdict = check(spec);
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
            check(spec).ok;
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

    makeChoicesErrors({ errorByChoice, nodes, nodeByIdx });
    return diagnostics;
}

/** The DoenetML of the document being checked, for references in messages. */
let currentSources: readonly string[] | undefined;

/** The `Ref` a `_copy` or `_ref` extends, if one. */
function refOf(node: any): any {
    // `Ref`, or `ExtendAttribute`, `CopyAttribute`, … for an extend or copy
    const ref = node?.extending ? Object.values(node.extending)[0] : undefined;
    return typeof ref === "object" && ref !== null ? ref : undefined;
}

/** A literal as a value: a number when it evaluates to one. */
function parseLiteral(text: string): Value {
    const trimmed = text.trim();
    if (trimmed === "") {
        return NaN;
    }
    const n = Number(trimmed);
    if (!Number.isNaN(n)) {
        return n;
    }
    if (/^[a-zA-Z]+$/.test(trimmed)) {
        // a symbol, or letters of a letters sequence
        return { symbolic: trimmed };
    }
    try {
        const tree = textToMathFactory({ functionSymbols: ["f", "g"] })(
            trimmed,
        ).tree;
        return literalOfTree(tree);
    } catch (e) {
        return { symbolic: trimmed };
    }
}

/** A math-expressions tree with no reference in it, as a value. */
function literalOfTree(tree: any): Value {
    try {
        const value = me.fromAst(tree).evaluate_to_constant();
        if (typeof value === "number" && Number.isFinite(value)) {
            return value;
        }
    } catch (e) {
        // not a number
    }
    return { symbolic: JSON.stringify(tree) };
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

/** A boolean attribute written as `true` or `false`, or not written. */
function literalBoolean(attribute: any): boolean | undefined {
    if (attribute.type === "primitive") {
        const v = attribute.primitive?.value;
        return typeof v === "boolean" ? v : undefined;
    }
    if (attribute.type === "literal") {
        if (typeof attribute.value === "boolean") {
            return attribute.value;
        }
        const text = String(attribute.text ?? "")
            .trim()
            .toLowerCase();
        // `""` is read when the document runs
        return text === "true" ? true : text === "false" ? false : undefined;
    }
    const component = attribute.component;
    if (component?.componentType === "boolean") {
        if (typeof component.state?.value === "boolean") {
            return component.state.value;
        }
        return literalBooleanText(component);
    }
    return undefined;
}

/** A `<boolean>` written as `true` or `false`. */
function literalBooleanText(component: any): boolean | undefined {
    const children = component.children ?? [];
    if (!children.every((c: any) => typeof c === "string")) {
        return undefined;
    }
    const text = children.join("").trim().toLowerCase();
    return text === "true" ? true : text === "false" ? false : undefined;
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

/**
 * The value of a boolean written with no reference as numbers compared
 * (`1>0`) or a number (`1`, true when not 0), or `undefined` when it is
 * anything else.
 */
function numericBoolean(text: string | undefined): boolean | undefined {
    if (text === undefined || text.trim() === "") {
        return undefined;
    }
    let tree: any;
    try {
        tree = textToMathFactory()(text).tree;
    } catch (e) {
        return undefined;
    }
    function num(t: any): number {
        try {
            const v = me.fromAst(t).evaluate_to_constant();
            return typeof v === "number" ? v : NaN;
        } catch (e) {
            return NaN;
        }
    }
    function evaluateBoolean(t: any): boolean | undefined {
        if (typeof t === "number") {
            return t !== 0;
        }
        if (!Array.isArray(t)) {
            return undefined;
        }
        const [op, ...args] = t;
        if (op === "and" || op === "or") {
            const values = args.map(evaluateBoolean);
            if (values.some((v) => v === undefined)) {
                return undefined;
            }
            return op === "and" ? values.every(Boolean) : values.some(Boolean);
        }
        if (op === "not" && args.length === 1) {
            const v = evaluateBoolean(args[0]);
            return v === undefined ? undefined : !v;
        }
        if (args.length === 2) {
            const [a, b] = args.map(num);
            if (Number.isNaN(a) || Number.isNaN(b)) {
                return undefined;
            }
            switch (op) {
                case "<":
                    return a < b;
                case ">":
                    return a > b;
                case "le":
                    return a <= b;
                case "ge":
                    return a >= b;
                case "=":
                    return a === b;
                case "ne":
                    return a !== b;
            }
        }
        const v = num(t);
        return Number.isNaN(v) ? undefined : v !== 0;
    }
    return evaluateBoolean(tree);
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
