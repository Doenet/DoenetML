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
    arccot: (a) => `atan(1/(${a}))`,
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
    // Python's round() rounds half to even; Doenet rounds half up.
    round: (a) => `floor(${a} + 0.5)`,
};

const PASS_THROUGH_FUNCTIONS = new Set([
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

function emitNumber(value: number): Emitted {
    if (Number.isNaN(value)) {
        throw new UnsupportedFormulaError("NaN");
    }
    if (!Number.isFinite(value)) {
        return value > 0
            ? { text: "inf", prec: PREC_ATOM }
            : { text: "-inf", prec: PREC_UNARY };
    }
    return value < 0
        ? { text: String(value), prec: PREC_UNARY }
        : { text: String(value), prec: PREC_ATOM };
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
        if (exponent === -1 && INVERSE_FUNCTIONS[name]) {
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
        throw new UnsupportedFormulaError(fn);
    }

    const argText = emit(arg, allowedSymbols).text;
    const mapped = MAPPED_FUNCTIONS[fn];
    if (mapped) {
        const text = mapped(argText);
        return {
            text,
            prec: text.startsWith("1/") ? PREC_PRODUCT : PREC_ATOM,
        };
    }
    if (PASS_THROUGH_FUNCTIONS.has(fn)) {
        return { text: `${fn}(${argText})`, prec: PREC_ATOM };
    }
    throw new UnsupportedFormulaError(fn);
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
        if (
            PYTHON_KEYWORDS.has(name) ||
            (allowedSymbols && !allowedSymbols.has(name))
        ) {
            throw new UnsupportedFormulaError(name);
        }
        return { text: name, prec: PREC_ATOM };
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
 *   `e`) the expression may use; any other symbol is reported as unsupported,
 *   since PreFigure would reject it as an unknown name
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
    return name;
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
