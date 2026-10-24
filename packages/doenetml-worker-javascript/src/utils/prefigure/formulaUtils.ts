import type { DiagnosticRecord, Position } from "@doenet/utils";
import { pushWarning } from "./common";
import type { CurveFunctionDefinition } from "./types";

/** A parsed formula with its variable and expression in string form. */
export interface ParsedFormulaDefinition {
    variableName: string;
    expression: string;
}

/**
 * Why a formula could not be translated: the function, operator, or symbol
 * that has no counterpart in PreFigure's expression namespace.
 */
class UnsupportedFormulaError extends Error {
    feature: string;

    constructor(feature: string) {
        super(`Unsupported formula feature: ${feature}`);
        this.feature = feature;
    }
}

/** Result of translating a math-expressions AST to a PreFigure expression. */
export type PythonExpressionResult =
    | { expression: string; unsupportedFeature?: undefined }
    | { expression?: undefined; unsupportedFeature: string };

// Operator precedence of an emitted expression, used to decide where
// parentheses are needed. Python binds `**` tighter than unary minus on its
// left (`-x**2` is `-(x**2)`), which is why unary minus sits below power.
const PREC_SUM = 1;
const PREC_PRODUCT = 2;
const PREC_UNARY = 3;
const PREC_POWER = 4;
const PREC_ATOM = 5;

interface Emitted {
    text: string;
    prec: number;
}

/**
 * math-expressions function names whose PreFigure (Python `math`) spelling
 * differs, or that PreFigure has no direct function for. Each maps to a
 * template applied to the already-emitted argument.
 *
 * PreFigure's namespace is Python's `math` module plus `ln`, `sec`, `csc`,
 * `cot`, `abs`, `round`, `min`, and `max`. Names that already match
 * (`sin`, `sqrt`, `exp`, `log`, `floor`, `sinh`, ...) are listed in
 * `PASS_THROUGH_FUNCTIONS` instead.
 */
const MAPPED_FUNCTIONS: Record<string, (arg: string) => string> = {
    arcsin: (a) => `asin(${a})`,
    arccos: (a) => `acos(${a})`,
    arctan: (a) => `atan(${a})`,
    // math-expressions defines these as the inverse of the reciprocal
    // function, so arccot(-1) is -pi/4 (not 3pi/4).
    arcsec: (a) => `acos(1/(${a}))`,
    arccsc: (a) => `asin(1/(${a}))`,
    // atan(1/x) for x != 0. Unlike `atan(1/(x))`, it doesn't divide by zero at
    // x = 0, which raises in Python but where math-expressions' arccot is
    // finite: pi/2 at 0 and -pi/2 at -0. The other inverse reciprocals are
    // infinite or complex at 0, so DoenetML draws nothing there either.
    arccot: (a) => `atan2(copysign(1, ${a}), abs(${a}))`,
    arcsinh: (a) => `asinh(${a})`,
    arccosh: (a) => `acosh(${a})`,
    arctanh: (a) => `atanh(${a})`,
    sech: (a) => `1/cosh(${a})`,
    csch: (a) => `1/sinh(${a})`,
    coth: (a) => `1/tanh(${a})`,
    arcsech: (a) => `acosh(1/(${a}))`,
    arccsch: (a) => `asinh(1/(${a}))`,
    arccoth: (a) => `atanh(1/(${a}))`,
    // math-expressions evaluates n! as gamma(n+1), so non-integers work.
    factorial: (a) => `gamma(${a} + 1)`,
    // Python's round() rounds half to even; math-expressions rounds half
    // away from zero, so round(-2.5) is -3. `round(x, n)` is handled by
    // `emitRoundToPlaces`.
    round: (a) => `copysign(floor(abs(${a}) + 0.5), ${a})`,
};

/**
 * Short spellings DoenetML also parses as functions (see
 * `appliedFunctionSymbolsDefault`), and the name in `MAPPED_FUNCTIONS` each
 * one means. `asin`, `acos`, `atan`, `asinh`, `acosh`, and `atanh` need no
 * alias, since Python spells them the same way.
 */
const FUNCTION_ALIASES: Record<string, string> = {
    asec: "arcsec",
    acsc: "arccsc",
    acot: "arccot",
    asech: "arcsech",
    acsch: "arccsch",
    acoth: "arccoth",
};

/**
 * Functions of several arguments, given as a tuple, that PreFigure's
 * namespace has under the same name, with the number of arguments each
 * accepts. `log(x, b)` is the base-`b` logarithm in both math-expressions
 * and Python. `round(x, n)` is translated by `emitRoundToPlaces` instead.
 */
const MULTI_ARGUMENT_FUNCTIONS: Record<string, { min: number; max: number }> = {
    atan2: { min: 2, max: 2 },
    log: { min: 2, max: 2 },
    max: { min: 2, max: Infinity },
    min: { min: 2, max: Infinity },
};

/**
 * One-argument functions PreFigure's namespace has under the same name as
 * math-expressions, emitted unchanged.
 */
const PASS_THROUGH_FUNCTIONS = new Set([
    "asin",
    "acos",
    "atan",
    "asinh",
    "acosh",
    "atanh",
    "erf",
    "sin",
    "cos",
    "tan",
    "sec",
    "csc",
    "cot",
    "sinh",
    "cosh",
    "tanh",
    "exp",
    "log",
    "ln",
    "log10",
    "sqrt",
    "cbrt",
    "abs",
    "floor",
    "ceil",
]);

/**
 * Names of the functions an emitted expression can call. A variable with one
 * of these names would shadow the function: PreFigure evaluates
 * `f(gamma)=gamma(gamma + 1)` as `lambda gamma: gamma(gamma + 1)`. Such a
 * variable is written with a trailing underscore instead, which no other
 * identifier the translation emits ends with.
 */
const EMITTED_FUNCTION_NAMES: ReadonlySet<string> = new Set([
    ...PASS_THROUGH_FUNCTIONS,
    ...Object.keys(MULTI_ARGUMENT_FUNCTIONS),
    // Called only from the `MAPPED_FUNCTIONS` and `round(x, n)` rewrites.
    "copysign",
    "gamma",
]);

/**
 * The longest expression a rewrite that writes its argument twice (`round`,
 * `arccot`) may produce. Each nested one doubles the output, so 24 nested
 * `round`s would otherwise grow to hundreds of millions of characters. A
 * longer one is reported as unsupported.
 */
const MAX_DUPLICATING_EXPRESSION_LENGTH = 100_000;

/** Functions whose `f^(-1)(x)` notation means the inverse function. */
const INVERSE_FUNCTIONS: Record<string, string> = {
    sin: "arcsin",
    cos: "arccos",
    tan: "arctan",
    sec: "arcsec",
    csc: "arccsc",
    cot: "arccot",
    sinh: "arcsinh",
    cosh: "arccosh",
    tanh: "arctanh",
    sech: "arcsech",
    csch: "arccsch",
    coth: "arccoth",
};

/** Names Python rejects as identifiers, so they cannot be variable names. */
const PYTHON_KEYWORDS = new Set([
    "False",
    "None",
    "True",
    "and",
    "as",
    "assert",
    "async",
    "await",
    "break",
    "class",
    "continue",
    "def",
    "del",
    "elif",
    "else",
    "except",
    "finally",
    "for",
    "from",
    "global",
    "if",
    "import",
    "in",
    "is",
    "lambda",
    "nonlocal",
    "not",
    "or",
    "pass",
    "raise",
    "return",
    "try",
    "while",
    "with",
    "yield",
]);

/** Constants PreFigure's namespace defines. */
const PYTHON_CONSTANTS = new Set(["pi", "e"]);

/**
 * Own-property lookup, so a function named like an `Object.prototype`
 * member (`constructor`, `toString`) does not match an inherited value.
 */
function hasOwn(table: object, key: string): boolean {
    return Object.prototype.hasOwnProperty.call(table, key);
}

function wrap(emitted: Emitted, minPrec: number): string {
    return emitted.prec < minPrec ? `(${emitted.text})` : emitted.text;
}

/**
 * Emit a symbol, or a subscripted symbol such as `x_1`, as a Python
 * identifier. Returns null if the AST is not symbol-like.
 */
function symbolName(ast: unknown): string | null {
    if (typeof ast === "string") {
        return /^[A-Za-z][A-Za-z0-9]*$/.test(ast) ? ast : null;
    }
    if (Array.isArray(ast) && ast[0] === "_" && ast.length === 3) {
        const base = symbolName(ast[1]);
        const sub = ast[2];
        if (
            base &&
            ((typeof sub === "number" && Number.isInteger(sub) && sub >= 0) ||
                (typeof sub === "string" && /^[A-Za-z0-9]+$/.test(sub)))
        ) {
            return `${base}_${sub}`;
        }
    }
    return null;
}

/** The Python identifier for a variable or other free symbol `name`. */
function pythonIdentifier(name: string): string {
    return EMITTED_FUNCTION_NAMES.has(name) ? `${name}_` : name;
}

function emitNumber(value: number): Emitted {
    if (Number.isNaN(value)) {
        throw new UnsupportedFormulaError("NaN");
    }
    if (!Number.isFinite(value)) {
        return value > 0
            ? { text: "inf", prec: PREC_ATOM }
            : { text: "-inf", prec: PREC_UNARY };
    }
    // String(-0) is "0", which would lose the sign that `arccot`'s
    // `copysign` depends on.
    if (Object.is(value, -0)) {
        return { text: "-0.0", prec: PREC_UNARY };
    }
    return value < 0
        ? { text: String(value), prec: PREC_UNARY }
        : { text: String(value), prec: PREC_ATOM };
}

/**
 * Emit `round(x, n)`, rounding `x` to `n` decimal places half away from
 * zero, as math-expressions does (Python's `round(x, n)` rounds half to
 * even). math-expressions accepts only a whole number of places from 0 to
 * 15, so `n` must be such a number as written; any other `n` is reported as
 * unsupported. That includes an expression such as `1+1`, which
 * math-expressions would evaluate, but a referenced `<number>` arrives
 * here as a number. The rounding happens in floating point, so a value
 * stored just below a tie, such as `1.005` to two places, rounds down,
 * where DoenetML's own graph rounds it up.
 */
function emitRoundToPlaces(
    args: unknown[],
    allowedSymbols: ReadonlySet<string> | undefined,
): Emitted {
    const [value, places] = args;
    if (
        typeof places !== "number" ||
        !Number.isInteger(places) ||
        places < 0 ||
        places > 15
    ) {
        throw new UnsupportedFormulaError("round");
    }
    const x = emit(value, allowedSymbols).text;
    const scale = `10^${places}`;
    const text = `copysign(floor(abs(${x})*${scale} + 0.5)/${scale}, ${x})`;
    if (text.length > MAX_DUPLICATING_EXPRESSION_LENGTH) {
        throw new UnsupportedFormulaError("round");
    }
    return { text, prec: PREC_ATOM };
}

function emitApply(
    fn: unknown,
    arg: unknown,
    allowedSymbols: ReadonlySet<string> | undefined,
): Emitted {
    // `sin^2(x)` arrives as apply(["^", "sin", 2], x), and `sin^(-1)(x)` as
    // apply(["^", "sin", -1], x).
    if (Array.isArray(fn) && fn[0] === "^" && typeof fn[1] === "string") {
        const [, name, exponent] = fn;
        if (exponent === -1 && hasOwn(INVERSE_FUNCTIONS, name)) {
            return emitApply(INVERSE_FUNCTIONS[name], arg, allowedSymbols);
        }
        const base = emitApply(name, arg, allowedSymbols);
        const power = emit(exponent, allowedSymbols);
        return {
            text: `${wrap(base, PREC_ATOM)}^${wrap(power, PREC_ATOM)}`,
            prec: PREC_POWER,
        };
    }

    // `log_b(x)` arrives as apply(["_", "log", b], x).
    if (Array.isArray(fn) && fn[0] === "_" && fn[1] === "log") {
        const base = emit(fn[2], allowedSymbols);
        const value = emit(arg, allowedSymbols);
        return { text: `log(${value.text}, ${base.text})`, prec: PREC_ATOM };
    }

    if (typeof fn !== "string") {
        throw new UnsupportedFormulaError(describeAst(fn));
    }

    if (Array.isArray(arg) && arg[0] === "tuple") {
        const args = arg.slice(1);
        if (fn === "round" && args.length === 2) {
            return emitRoundToPlaces(args, allowedSymbols);
        }
        const arity = hasOwn(MULTI_ARGUMENT_FUNCTIONS, fn)
            ? MULTI_ARGUMENT_FUNCTIONS[fn]
            : null;
        if (!arity || args.length < arity.min || args.length > arity.max) {
            throw new UnsupportedFormulaError(fn);
        }
        const argTexts = args.map((a) => emit(a, allowedSymbols).text);
        return { text: `${fn}(${argTexts.join(", ")})`, prec: PREC_ATOM };
    }

    const name = hasOwn(FUNCTION_ALIASES, fn) ? FUNCTION_ALIASES[fn] : fn;
    const argText = emit(arg, allowedSymbols).text;
    if (hasOwn(MAPPED_FUNCTIONS, name)) {
        const text = MAPPED_FUNCTIONS[name](argText);
        if (text.length > MAX_DUPLICATING_EXPRESSION_LENGTH) {
            throw new UnsupportedFormulaError(fn);
        }
        return {
            text,
            prec: text.startsWith("1/") ? PREC_PRODUCT : PREC_ATOM,
        };
    }
    if (PASS_THROUGH_FUNCTIONS.has(name)) {
        return { text: `${name}(${argText})`, prec: PREC_ATOM };
    }
    throw new UnsupportedFormulaError(fn);
}

/**
 * The function an `apply` node's function part names, as the translation
 * resolves it: an alias such as `asec` becomes `arcsec`, and the inverse
 * notation `sin^(-1)` becomes `arcsin`. Null for a part that names no single
 * function, such as `sin^2` or `log_b`.
 */
export function resolveAppliedFunctionName(fn: unknown): string | null {
    if (Array.isArray(fn) && fn[0] === "^" && typeof fn[1] === "string") {
        return fn[2] === -1 && hasOwn(INVERSE_FUNCTIONS, fn[1])
            ? INVERSE_FUNCTIONS[fn[1]]
            : null;
    }
    if (typeof fn !== "string") {
        return null;
    }
    return hasOwn(FUNCTION_ALIASES, fn) ? FUNCTION_ALIASES[fn] : fn;
}

/** Short label for an AST node, used in the unsupported-feature warning. */
function describeAst(ast: unknown): string {
    if (Array.isArray(ast)) {
        return String(ast[0]);
    }
    return String(ast);
}

/**
 * Recursively emit a math-expressions AST as a Python expression that
 * PreFigure's restricted namespace accepts. Powers are written with `^`,
 * which PreFigure rewrites to `**` before evaluating.
 *
 * Throws {@link UnsupportedFormulaError} for anything with no PreFigure
 * counterpart.
 */
function emit(
    ast: unknown,
    allowedSymbols: ReadonlySet<string> | undefined,
): Emitted {
    if (typeof ast === "number") {
        return emitNumber(ast);
    }

    const name = symbolName(ast);
    if (name !== null) {
        if (PYTHON_CONSTANTS.has(name)) {
            return { text: name, prec: PREC_ATOM };
        }
        const identifier = pythonIdentifier(name);
        if (
            PYTHON_KEYWORDS.has(name) ||
            (allowedSymbols && !allowedSymbols.has(identifier))
        ) {
            throw new UnsupportedFormulaError(name);
        }
        return { text: identifier, prec: PREC_ATOM };
    }

    if (!Array.isArray(ast) || ast.length < 2) {
        throw new UnsupportedFormulaError(describeAst(ast));
    }

    const [operator, ...operands] = ast;

    switch (operator) {
        case "+": {
            const terms = operands.map((term, i) => {
                // Write `a + (-b)` as `a - b`.
                if (i > 0 && Array.isArray(term) && term[0] === "-") {
                    const negated = emit(term[1], allowedSymbols);
                    return ` - ${wrap(negated, PREC_PRODUCT)}`;
                }
                if (i > 0 && typeof term === "number" && term < 0) {
                    return ` - ${emitNumber(-term).text}`;
                }
                const emitted = emit(term, allowedSymbols);
                if (i === 0) {
                    return emitted.text;
                }
                return ` + ${wrap(emitted, PREC_PRODUCT)}`;
            });
            return { text: terms.join(""), prec: PREC_SUM };
        }
        case "-": {
            if (operands.length !== 1) {
                throw new UnsupportedFormulaError("-");
            }
            const operand = emit(operands[0], allowedSymbols);
            return { text: `-${wrap(operand, PREC_POWER)}`, prec: PREC_UNARY };
        }
        case "*": {
            const factors = operands.map((factor, i) =>
                wrap(
                    emit(factor, allowedSymbols),
                    i === 0 ? PREC_PRODUCT : PREC_POWER,
                ),
            );
            return { text: factors.join("*"), prec: PREC_PRODUCT };
        }
        case "/": {
            if (operands.length !== 2) {
                throw new UnsupportedFormulaError("/");
            }
            const numerator = emit(operands[0], allowedSymbols);
            const denominator = emit(operands[1], allowedSymbols);
            return {
                text: `${wrap(numerator, PREC_PRODUCT)}/${wrap(denominator, PREC_POWER)}`,
                prec: PREC_PRODUCT,
            };
        }
        case "^": {
            if (operands.length !== 2) {
                throw new UnsupportedFormulaError("^");
            }
            // Python's `**` is right-associative and binds tighter than a
            // leading minus, so parenthesize any non-atomic base and exponent.
            const base = emit(operands[0], allowedSymbols);
            const exponent = emit(operands[1], allowedSymbols);
            return {
                text: `${wrap(base, PREC_ATOM)}^${wrap(exponent, PREC_ATOM)}`,
                prec: PREC_POWER,
            };
        }
        case "apply": {
            if (operands.length !== 2) {
                throw new UnsupportedFormulaError("apply");
            }
            return emitApply(operands[0], operands[1], allowedSymbols);
        }
        default:
            throw new UnsupportedFormulaError(describeAst(ast));
    }
}

/**
 * Translate a math-expressions AST into an expression PreFigure can
 * evaluate.
 *
 * PreFigure evaluates formulas as Python inside a restricted namespace, so
 * math-expressions' own `toString()` is not usable: it writes `pi` as `π`,
 * absolute value as `|x|`, and inverse trig as `arcsin`, none of which
 * PreFigure accepts.
 *
 * @param ast - The abstract syntax tree from math-expressions
 * @param allowedSymbols - If given, the only free symbols (besides `pi` and
 *   `e`) the expression may use, as `astToVariableName` writes them; any
 *   other symbol is reported as unsupported, since PreFigure would reject it
 *   as an unknown name
 * @returns The expression, or the feature that has no PreFigure counterpart
 */
export function astToPythonExpression(
    ast: unknown,
    allowedSymbols?: ReadonlySet<string>,
): PythonExpressionResult {
    try {
        return { expression: emit(ast, allowedSymbols).text };
    } catch (e) {
        if (e instanceof UnsupportedFormulaError) {
            return { unsupportedFeature: e.feature };
        }
        throw e;
    }
}

/**
 * Translate a function's variable AST into the identifier used for it in
 * PreFigure expressions, or null if it is not a usable identifier.
 */
export function astToVariableName(ast: unknown): string | null {
    const name = symbolName(ast);
    if (name === null || PYTHON_KEYWORDS.has(name)) {
        return null;
    }
    return pythonIdentifier(name);
}

function escapeRegex(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Rewrite the variable symbol used in an expression string.
 *
 * Used when the variable name produced by `astToVariableName` differs from
 * the variable name PreFigure expects in the emitted function signature
 * (for example, parametric x/y components authored with different variables,
 * or a child function authored in `u` when the surrounding spec requires `x`).
 */
export function rewriteExpressionVariable({
    expression,
    fromVariable,
    toVariable,
}: {
    expression: string;
    fromVariable: string;
    toVariable: string;
}): string {
    if (!fromVariable || fromVariable === toVariable) {
        return expression;
    }

    const escaped = escapeRegex(fromVariable);
    const symbolPattern = new RegExp(
        `(^|[^A-Za-z0-9_])(${escaped})(?=$|[^A-Za-z0-9_])`,
        "g",
    );

    return expression.replace(symbolPattern, `$1${toVariable}`);
}

/** Where to report a formula PreFigure cannot evaluate. */
export interface FormulaWarningContext {
    diagnostics: DiagnosticRecord[];
    /** The `<tag>` or `<tag> (name)` subject the warning is about. */
    subject: string;
    position?: Position;
}

/**
 * Rename several variable symbols at once, as `rewriteExpressionVariable`
 * renames one.
 *
 * The renames are applied together rather than one after another, so a swap
 * such as `{ y: "x", x: "y" }` (a function authored with `variables="y x"`)
 * does not rename a symbol twice.
 */
export function rewriteExpressionVariables({
    expression,
    renames,
}: {
    expression: string;
    renames: Record<string, string>;
}): string {
    const fromVariables = Object.keys(renames)
        .filter((from) => from && renames[from] !== from)
        // Longest first, so a name is not matched by a prefix of itself.
        .sort((a, b) => b.length - a.length);
    if (fromVariables.length === 0) {
        return expression;
    }

    const symbolPattern = new RegExp(
        `(^|[^A-Za-z0-9_])(${fromVariables.map(escapeRegex).join("|")})(?=$|[^A-Za-z0-9_])`,
        "g",
    );

    return expression.replace(
        symbolPattern,
        (_match, before: string, symbol: string) =>
            `${before}${renames[symbol]}`,
    );
}

/**
 * Parse a simple formula-based curve function definition.
 * Extracts the expression and variable name; returns null if the value is
 * not an object, not a formula-typed definition, or its formula uses
 * something PreFigure cannot evaluate (an unknown function, an operator such
 * as a derivative or relation, or a free symbol other than the function's
 * variables, `pi`, and `e`). In that last case a `doenet-w0170` warning is
 * pushed when `warning` is given.
 *
 * Accepts `unknown` so callers can pass raw entries from `fDefinitions`
 * without an intermediate typecast helper.
 *
 * @param definition - Candidate definition; non-object inputs return null
 * @param fallbackVariableName - Variable name to use when the definition has
 *   no usable variables[0] AST (e.g., "x" for function curves, "t" for parametric)
 * @param warning - Where to report a formula that cannot be translated
 * @returns Parsed definition with variable and expression, or null
 */
export function parseFormulaDefinition(
    definition: unknown,
    fallbackVariableName: string,
    warning?: FormulaWarningContext,
): ParsedFormulaDefinition | null {
    if (!definition || typeof definition !== "object") {
        return null;
    }

    const def = definition as CurveFunctionDefinition;
    if (def.functionType !== "formula") {
        return null;
    }

    const variables = Array.isArray(def.variables) ? def.variables : [];
    const variableNames = variables.map(astToVariableName);
    const variableName = variableNames[0] || fallbackVariableName;
    const allowedSymbols = new Set([
        variableName,
        ...variableNames.filter((name): name is string => name !== null),
    ]);

    const result = astToPythonExpression(def.formula, allowedSymbols);
    if (result.unsupportedFeature !== undefined) {
        if (warning) {
            pushWarning({
                diagnostics: warning.diagnostics,
                code: "doenet-w0170",
                args: {
                    subject: warning.subject,
                    feature: result.unsupportedFeature,
                },
                position: warning.position,
            });
        }
        return null;
    }

    return {
        variableName,
        expression: result.expression,
    };
}
