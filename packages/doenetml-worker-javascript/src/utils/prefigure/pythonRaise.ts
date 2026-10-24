import me from "math-expressions";
import { resolveAppliedFunctionName } from "./formulaUtils";

/**
 * Where PreFigure raises while evaluating a formula written by
 * `astToPythonExpression`, found by evaluating the formula's AST the way
 * Python evaluates its translation.
 *
 * PreFigure calls a field's function on numpy floats. Arithmetic on a numpy
 * float stays numpy, and divides by zero to an infinity or a NaN. But every
 * function of Python's `math` module returns a plain Python float, and so
 * does arithmetic on constants alone, and arithmetic on Python numbers
 * raises: a division by zero raises `ZeroDivisionError`, and a power that
 * overflows raises `OverflowError`. A `math` function raises `ValueError`
 * outside its domain, including on an infinity (`sin(inf)`) or, for `floor`,
 * a NaN, whichever kind of number brought it. So whether a formula raises
 * depends on which of its parts are Python numbers, and on the values that
 * reach each function, which the evaluation follows from the bottom up.
 *
 * Not modelled: Python integers, which `floor` returns and which never
 * overflow (a power of them is taken to overflow as a float's would), and
 * the value of a complex number, which a Python power of a negative number
 * gives (`sin(x)^(1/3)`). A complex number is followed only so far as to
 * know that a `math` function, a comparison in `min` or `max`, or `floor`
 * raises on it; `abs` of one is a real number whose value is not followed.
 */

/** How evaluating a formula raises in PreFigure. */
export type PythonRaise = "error" | "division";

/**
 * `"error"` is a `ValueError`, `OverflowError` or `TypeError`, which loses
 * either kind of field; `"division"` is a `ZeroDivisionError`, which a slope
 * field catches and draws as a vertical mark but a vector field does not.
 */
class Raised {
    constructor(readonly raise: PythonRaise) {}
}
const RAISES_ERROR = new Raised("error");
const RAISES_DIVISION = new Raised("division");

/**
 * A value as Python holds it: a number, and whether it is a plain Python
 * number rather than a numpy float. A `"complex"` value or one whose value is
 * `"unknown"` has `value` NaN, and is not checked against a domain.
 */
interface PythonValue {
    value: number;
    python: boolean;
    kind?: "complex" | "unknown";
}

type Evaluate = (x: number, y: number) => PythonValue;

/** The largest `n` whose `math.gamma(n)` does not overflow a float. */
const GAMMA_OVERFLOW = 171.62437695630272;

const meErf = me.fromAst(["apply", "erf", "t"]).f();
const meFactorial = me.fromAst(["apply", "factorial", "t"]).f();

function realOrNaN(value: unknown): number {
    return typeof value === "number" ? value : NaN;
}

/** Raise as Python's `math` functions do on a value outside their domain. */
function domainError(raises: boolean, value: number): number {
    if (raises) {
        throw RAISES_ERROR;
    }
    return value;
}

function overflows(a: number, value: number): number {
    return domainError(Number.isFinite(a) && !Number.isFinite(value), value);
}

/**
 * Each one-argument `math` function the translation calls, as a function of
 * a real argument that throws where Python raises.
 */
const MATH_FUNCTIONS: Record<string, (a: number) => number> = {
    sin: (a) => domainError(!Number.isFinite(a) && a === a, Math.sin(a)),
    cos: (a) => domainError(!Number.isFinite(a) && a === a, Math.cos(a)),
    tan: (a) => domainError(!Number.isFinite(a) && a === a, Math.tan(a)),
    asin: (a) => domainError(Math.abs(a) > 1, Math.asin(a)),
    acos: (a) => domainError(Math.abs(a) > 1, Math.acos(a)),
    atan: Math.atan,
    sinh: (a) => overflows(a, Math.sinh(a)),
    cosh: (a) => overflows(a, Math.cosh(a)),
    tanh: Math.tanh,
    asinh: Math.asinh,
    acosh: (a) => domainError(a < 1, Math.acosh(a)),
    atanh: (a) => domainError(Math.abs(a) >= 1, Math.atanh(a)),
    exp: (a) => overflows(a, Math.exp(a)),
    log: (a) => domainError(a <= 0, Math.log(a)),
    ln: (a) => domainError(a <= 0, Math.log(a)),
    log10: (a) => domainError(a <= 0, Math.log10(a)),
    log2: (a) => domainError(a <= 0, Math.log2(a)),
    sqrt: (a) => domainError(a < 0, Math.sqrt(a)),
    cbrt: Math.cbrt,
    erf: (a) => realOrNaN(meErf({ t: a })),
    gamma: (a) =>
        domainError(
            (Number.isInteger(a) && a <= 0) ||
                a === -Infinity ||
                (Number.isFinite(a) && a > GAMMA_OVERFLOW),
            realOrNaN(meFactorial({ t: a - 1 })),
        ),
    floor: (a) => domainError(!Number.isFinite(a), Math.floor(a)),
    ceil: (a) => domainError(!Number.isFinite(a), Math.ceil(a)),
};

function python(value: number): PythonValue {
    return { value, python: true };
}

/** The kind of the result of arithmetic on `a` and `b`. */
function combinedKind(a: PythonValue, b: PythonValue): PythonValue["kind"] {
    if (a.kind === "complex" || b.kind === "complex") {
        return "complex";
    }
    return a.kind ?? b.kind;
}

function arithmetic(
    a: PythonValue,
    b: PythonValue,
    value: number,
): PythonValue {
    const kind = combinedKind(a, b);
    return kind
        ? { value: NaN, python: a.python && b.python, kind }
        : { value, python: a.python && b.python };
}

function divide(a: PythonValue, b: PythonValue): PythonValue {
    if (a.python && b.python && b.value === 0) {
        throw RAISES_DIVISION;
    }
    return arithmetic(a, b, a.value / b.value);
}

/** `a ** b` for real `a` and `b`, which `Math.pow` gets wrong at 1 and -1. */
function realPower(a: number, b: number): number {
    if (a === 1 || (a === -1 && Math.abs(b) === Infinity) || b === 0) {
        return 1;
    }
    return Math.pow(a, b);
}

function power(a: PythonValue, b: PythonValue): PythonValue {
    if (a.kind || b.kind || !(a.python && b.python)) {
        return arithmetic(a, b, realPower(a.value, b.value));
    }
    if (a.value === 0 && b.value < 0) {
        throw RAISES_DIVISION;
    }
    if (
        a.value < 0 &&
        Number.isFinite(a.value) &&
        Number.isFinite(b.value) &&
        !Number.isInteger(b.value)
    ) {
        return { value: NaN, python: true, kind: "complex" };
    }
    const value = realPower(a.value, b.value);
    return python(
        domainError(
            Number.isFinite(a.value) &&
                Number.isFinite(b.value) &&
                !Number.isFinite(value),
            value,
        ),
    );
}

/**
 * A `math` function of `a`, which raises on a complex number and returns a
 * Python float.
 */
function applyMath(f: (a: number) => number, a: PythonValue): PythonValue {
    if (a.kind === "complex") {
        throw RAISES_ERROR;
    }
    if (a.kind === "unknown") {
        return { value: NaN, python: true, kind: "unknown" };
    }
    return python(f(a.value));
}

function absolute(a: PythonValue): PythonValue {
    if (a.kind) {
        return { value: NaN, python: a.python, kind: "unknown" };
    }
    return { value: Math.abs(a.value), python: a.python };
}

/** A `math` function of two arguments, such as `atan2` or `copysign`. */
function applyMath2(
    f: (a: number, b: number) => number,
    a: PythonValue,
    b: PythonValue,
): PythonValue {
    if (a.kind === "complex" || b.kind === "complex") {
        throw RAISES_ERROR;
    }
    if (a.kind || b.kind) {
        return { value: NaN, python: true, kind: "unknown" };
    }
    return python(f(a.value, b.value));
}

function copysign(a: number, b: number): number {
    return Object.is(b, -0) || b < 0 ? -Math.abs(a) : Math.abs(a);
}

/**
 * `math.log(a, b)`, which takes the logarithm of `a`, then of `b`, then
 * divides, so that a base of 1 divides by 0.
 */
function logBase(a: PythonValue, b: PythonValue): PythonValue {
    const value = applyMath(MATH_FUNCTIONS.log, a);
    const base = applyMath(MATH_FUNCTIONS.log, b);
    return divide(value, base);
}

/**
 * The builtin `max` or `min`, which returns the argument it selects: the
 * first, unless a later one compares greater (or less), so that a NaN is
 * selected only if it comes first. Comparing a complex number raises.
 */
function select(name: "max" | "min", args: PythonValue[]): PythonValue {
    if (args.some((a) => a.kind === "complex")) {
        throw RAISES_ERROR;
    }
    if (args.some((a) => a.kind)) {
        return {
            value: NaN,
            python: args.every((a) => a.python),
            kind: "unknown",
        };
    }
    let selected = args[0];
    for (const a of args.slice(1)) {
        if (
            name === "max" ? a.value > selected.value : a.value < selected.value
        ) {
            selected = a;
        }
    }
    return selected;
}

/**
 * Compile `ast` into a function that evaluates it at a point as Python
 * evaluates its translation, throwing a {@link Raised} where Python raises.
 * The translation's rewrites (`sec(x)` to `1/cos(x)` and so on, here written
 * out in PreFigure's own definition) are evaluated as written, so that each
 * division and function in them raises as it does in Python.
 */
function compile(ast: unknown, variableNames: string[]): Evaluate {
    const sub = (child: unknown) => compile(child, variableNames);

    if (typeof ast === "number") {
        const value = python(ast);
        return () => value;
    }
    if (typeof ast === "string" || (Array.isArray(ast) && ast[0] === "_")) {
        const name =
            typeof ast === "string"
                ? ast
                : String(me.fromAst(ast as any).subscripts_to_strings().tree);
        const index = variableNames.indexOf(name);
        if (index === 0) {
            return (x) => ({ value: x, python: false });
        }
        if (index === 1) {
            return (_x, y) => ({ value: y, python: false });
        }
        const value =
            name === "pi"
                ? python(Math.PI)
                : name === "e"
                  ? python(Math.E)
                  : { value: NaN, python: true, kind: "unknown" as const };
        return () => value;
    }
    if (!Array.isArray(ast)) {
        const value = { value: NaN, python: true, kind: "unknown" as const };
        return () => value;
    }

    const [operator, ...operands] = ast;
    switch (operator) {
        case "+":
        case "*": {
            const terms = operands.map(sub);
            const add = operator === "+";
            return (x, y) =>
                terms.slice(1).reduce(
                    (a, term) => {
                        const b = term(x, y);
                        return arithmetic(
                            a,
                            b,
                            add ? a.value + b.value : a.value * b.value,
                        );
                    },
                    terms[0](x, y),
                );
        }
        case "-": {
            const operand = sub(operands[0]);
            return (x, y) => {
                const a = operand(x, y);
                return { ...a, value: -a.value };
            };
        }
        case "/": {
            const [numerator, denominator] = operands.map(sub);
            return (x, y) => divide(numerator(x, y), denominator(x, y));
        }
        case "^": {
            const [base, exponent] = operands.map(sub);
            return (x, y) => power(base(x, y), exponent(x, y));
        }
        case "apply":
            return compileApply(operands[0], operands[1], variableNames);
    }
    const value = { value: NaN, python: true, kind: "unknown" as const };
    return () => value;
}

const ONE: Evaluate = () => python(1);

function compileApply(
    fn: unknown,
    argumentAst: unknown,
    variableNames: string[],
): Evaluate {
    const sub = (child: unknown) => compile(child, variableNames);

    // `sin^2(x)` is written `sin(x)^2`.
    if (
        Array.isArray(fn) &&
        fn[0] === "^" &&
        resolveAppliedFunctionName(fn) === null
    ) {
        const base = compileApply(fn[1], argumentAst, variableNames);
        const exponent = sub(fn[2]);
        return (x, y) => power(base(x, y), exponent(x, y));
    }
    // `log_b(x)` is written `log(x, b)`.
    if (Array.isArray(fn) && fn[0] === "_" && fn[1] === "log") {
        const value = sub(argumentAst);
        const base = sub(fn[2]);
        return (x, y) => logBase(value(x, y), base(x, y));
    }

    const name = resolveAppliedFunctionName(fn);
    if (Array.isArray(argumentAst) && argumentAst[0] === "tuple") {
        const args = argumentAst.slice(1).map(sub);
        if (name === "round" && typeof argumentAst[2] === "number") {
            // copysign(floor(abs(x)*10^n + 0.5)/10^n, x)
            const scale = python(realPower(10, argumentAst[2]));
            const half = python(0.5);
            return (x, y) => {
                const a = args[0](x, y);
                const scaled = applyMath(
                    MATH_FUNCTIONS.floor,
                    arithmetic(
                        arithmetic(
                            absolute(a),
                            scale,
                            Math.abs(a.value) * scale.value,
                        ),
                        half,
                        Math.abs(a.value) * scale.value + 0.5,
                    ),
                );
                return applyMath2(copysign, divide(scaled, scale), a);
            };
        }
        if (name === "log") {
            return (x, y) => logBase(args[0](x, y), args[1](x, y));
        }
        if (name === "atan2") {
            return (x, y) =>
                applyMath2(Math.atan2, args[0](x, y), args[1](x, y));
        }
        if (name === "max" || name === "min") {
            return (x, y) =>
                select(
                    name,
                    args.map((a) => a(x, y)),
                );
        }
    }

    const argument = sub(argumentAst);
    const math = (mathName: string, a: Evaluate = argument): Evaluate => {
        const f = MATH_FUNCTIONS[mathName];
        return (x, y) => applyMath(f, a(x, y));
    };
    const reciprocal =
        (a: Evaluate): Evaluate =>
        (x, y) =>
            divide(python(1), a(x, y));

    switch (name) {
        case "arcsin":
            return math("asin");
        case "arccos":
            return math("acos");
        case "arctan":
            return math("atan");
        case "arcsinh":
            return math("asinh");
        case "arccosh":
            return math("acosh");
        case "arctanh":
            return math("atanh");
        // PreFigure's own `sec`, `csc` and `cot` are `1/cos(x)` and so on.
        case "sec":
            return reciprocal(math("cos"));
        case "csc":
            return reciprocal(math("sin"));
        case "cot":
            return reciprocal(math("tan"));
        case "sech":
            return reciprocal(math("cosh"));
        case "csch":
            return reciprocal(math("sinh"));
        case "coth":
            return reciprocal(math("tanh"));
        case "arcsec":
            return math("acos", reciprocal(argument));
        case "arccsc":
            return math("asin", reciprocal(argument));
        case "arcsech":
            return math("acosh", reciprocal(argument));
        case "arccsch":
            return math("asinh", reciprocal(argument));
        case "arccoth":
            return math("atanh", reciprocal(argument));
        case "arccot":
            // atan2(copysign(1, x), abs(x))
            return (x, y) => {
                const a = argument(x, y);
                return applyMath2(
                    Math.atan2,
                    applyMath2(copysign, ONE(x, y), a),
                    absolute(a),
                );
            };
        case "factorial":
            // gamma(x + 1)
            return (x, y) => {
                const a = argument(x, y);
                return applyMath(
                    MATH_FUNCTIONS.gamma,
                    arithmetic(a, python(1), a.value + 1),
                );
            };
        case "round":
            // copysign(floor(abs(x) + 0.5), x)
            return (x, y) => {
                const a = argument(x, y);
                const rounded = applyMath(
                    MATH_FUNCTIONS.floor,
                    arithmetic(
                        absolute(a),
                        python(0.5),
                        Math.abs(a.value) + 0.5,
                    ),
                );
                return applyMath2(copysign, rounded, a);
            };
        case "abs":
            return (x, y) => absolute(argument(x, y));
    }
    if (
        name !== null &&
        Object.prototype.hasOwnProperty.call(MATH_FUNCTIONS, name)
    ) {
        return math(name);
    }
    const value = { value: NaN, python: true, kind: "unknown" as const };
    return () => value;
}

/**
 * Whether `ast` has a part that can raise in Python at all: a function call,
 * a division, or a power. A formula without one, such as `(y, -x)`, need not
 * be evaluated.
 */
function canRaise(ast: unknown): boolean {
    if (!Array.isArray(ast)) {
        return false;
    }
    if (ast[0] === "apply" || ast[0] === "/" || ast[0] === "^") {
        return true;
    }
    return ast.slice(1).some(canRaise);
}

/**
 * The first lattice point, `x` from `xs` and `y` from `ys`, at which PreFigure
 * raises while evaluating `asts` in turn, losing the whole field, or null if
 * there is none. Each AST is a formula `astToPythonExpression` translated, in
 * the variables `variableNames`. A `ZeroDivisionError` counts only if
 * `divisionRaises`: a slope field catches it and draws a vertical mark.
 */
export function firstRaisingLatticePoint({
    asts,
    variableNames,
    xs,
    ys,
    divisionRaises,
}: {
    asts: unknown[];
    variableNames: string[];
    xs: number[];
    ys: number[];
    divisionRaises: boolean;
}): [number, number] | null {
    const evaluators = asts
        .filter(canRaise)
        .map((ast) => compile(ast, variableNames));
    if (evaluators.length === 0) {
        return null;
    }
    for (const x of xs) {
        for (const y of ys) {
            try {
                for (const evaluate of evaluators) {
                    evaluate(x, y);
                }
            } catch (e) {
                if (!(e instanceof Raised)) {
                    throw e;
                }
                if (e.raise === "error" || divisionRaises) {
                    return [x, y];
                }
            }
        }
    }
    return null;
}
