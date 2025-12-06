export type KeyCommand = {
    type: "keystroke" | "type" | "write" | "cmd" | "accessed";
    command: string;
    timestamp?: number;
};

export type KeyDescription = {
    displayName: string;
    name: string;
    commands: KeyCommand[];
    isMath?: boolean;
};

/**
 * The `\LaTeX` names for the greek symbols `ϕ𝜍ερτυθιοπασδφγηξκλζχψωβνμ`
 */
export const TEX_NAMES_LOWER = [
    "phi",
    "varsigma",
    "epsilon",
    "rho",
    "tau",
    "upsilon",
    "theta",
    "iota",
    null,
    "pi",
    "alpha",
    "sigma",
    "delta",
    "varphi",
    "gamma",
    "eta",
    "xi",
    "kappa",
    "lambda",
    "zeta",
    "chi",
    "psi",
    "omega",
    "beta",
    "nu",
    "mu",
];
export const TEX_NAMES_UPPER = [
    "Phi",
    "Sigma",
    null,
    null,
    null,
    null,
    "Theta",
    null,
    null,
    "Pi",
    null,
    "Sigma",
    "Delta",
    "Phi",
    "Gamma",
    null,
    "Xi",
    null,
    "Lambda",
    null,
    null,
    "Psi",
    "Omega",
    null,
    null,
    null,
];

export const KEYS = {
    alpha_lower: "qwertyuiopasdfghjklzxcvbnm,'".split("").map((c) => ({
        displayName: c,
        name: c,
        commands: [{ type: "write", command: c }],
    })),
    alpha_upper: "QWERTYUIOPASDFGHJKLZXCVBNM,'".split("").map((c) => ({
        displayName: c,
        name: c,
        commands: [{ type: "write", command: c }],
    })),
    numeric: "1234567890.".split("").map((c) => ({
        displayName: c,
        name: c === "." ? "dot" : c,
        commands: [{ type: "write", command: c }],
    })),
    // lower-case greek letters in QWERTY order
    // Use `...` rather than `.split` to properly handle unicode characters
    greek_lower: [..."ϕ𝜍ερτυθιοπασδφγηξκλζχψωβνμ,'"].map((c, i) => ({
        displayName: c,
        name: c,
        commands: [
            {
                type: "write",
                command: TEX_NAMES_LOWER[i] ? `\\${TEX_NAMES_LOWER[i]}` : c,
            },
        ],
    })),
    // upper-case greek letters in QWERTY order
    greek_upper: [..."ΦΣΕΡΤΥΘΙΟΠΑΣΔΦΓΗΞΚΛΖΧΨΩΒΝΜ,'"].map((c, i) => ({
        displayName: c,
        name: c,
        commands: [
            {
                type: "write",
                command: TEX_NAMES_UPPER[i] ? `\\${TEX_NAMES_UPPER[i]}` : c,
            },
        ],
    })),

    // var-sigma greek letter
    //greek_lower: "",
} satisfies Record<string, KeyDescription[]>;

export const SPECIAL_KEYS = {
    shift: {
        displayName: "⇧",
        name: "shift",
        commands: [{ type: "cmd", command: "Shift" }],
    },
    backspace: {
        displayName: "⌫",
        name: "backspace",
        commands: [{ type: "keystroke", command: "Backspace" }],
    },
    space: {
        displayName: "␣",
        name: "space",
        commands: [{ type: "write", command: "\\ " }],
    },
    left: {
        displayName: "←",
        name: "left",
        commands: [{ type: "keystroke", command: "Left" }],
    },
    right: {
        displayName: "→",
        name: "right",
        commands: [{ type: "keystroke", command: "Right" }],
    },
    enter: {
        displayName: "Enter",
        name: "enter",
        commands: [{ type: "keystroke", command: "Enter" }],
    },
} satisfies Record<string, KeyDescription>;

export const OPERATOR_KEYS = {
    times: {
        displayName: "×",
        name: "times",
        commands: [{ type: "write", command: "\\times" }],
    },
    divide: {
        displayName: "÷",
        name: "divide",
        commands: [{ type: "cmd", command: "/" }],
    },
    plus: {
        displayName: "+",
        name: "plus",
        commands: [{ type: "write", command: "+" }],
    },
    minus: {
        displayName: "−",
        name: "minus",
        commands: [{ type: "write", command: "-" }],
    },
    equals: {
        displayName: "=",
        name: "equals",
        commands: [{ type: "write", command: "=" }],
    },
} satisfies Record<string, KeyDescription>;

export const VAR_KEYS = {
    x: {
        // displayName: "x",
        displayName: " x",
        name: "x",
        commands: [{ type: "write", command: "x" }],
    },
    y: {
        // displayName: "y",
        displayName: " y",
        name: "y",
        commands: [{ type: "write", command: "y" }],
    },
    pi: {
        // displayName: "π",
        displayName: "\\pi",
        name: "pi",
        commands: [{ type: "write", command: "\\pi" }],
    },
    e: {
        // displayName: "e",
        displayName: " e",
        name: "e",
        commands: [{ type: "write", command: "e" }],
    },
    square: {
        // displayName: "a²",
        displayName: "a^2",
        name: "square",
        commands: [
            { type: "type", command: "^2" },
            { type: "keystroke", command: "Right" },
        ],
    },
    exponent: {
        // displayName: "aᵇ",
        displayName: "b^a",
        name: "exponent",
        commands: [{ type: "cmd", command: "^" }],
    },
    sqrt: {
        // displayName: "√a",
        displayName: "\\sqrt{a}",
        name: "sqrt",
        commands: [{ type: "type", command: "sqrt" }],
    },
    abs: {
        displayName: "|a|",
        name: "abs",
        commands: [
            { type: "cmd", command: "|" },
            { type: "cmd", command: "|" },
            { type: "keystroke", command: "Left" },
        ],
    },
    lt: {
        displayName: "<",
        name: "lt",
        commands: [{ type: "write", command: "<" }],
    },
    gt: {
        displayName: ">",
        name: "gt",
        commands: [{ type: "write", command: ">" }],
    },
    leq: {
        displayName: "≤",
        name: "leq",
        commands: [{ type: "type", command: "<=" }],
    },
    geq: {
        displayName: "≥",
        name: "geq",
        commands: [{ type: "type", command: ">=" }],
    },
    comma: {
        displayName: ",",
        name: "comma",
        commands: [{ type: "write", command: "," }],
    },
    leftParen: {
        displayName: "(",
        name: "leftParen",
        commands: [{ type: "cmd", command: "(" }],
    },
    rightParen: {
        displayName: ")",
        name: "rightParen",
        commands: [{ type: "cmd", command: ")" }],
    },
} satisfies Record<string, KeyDescription>;

export const SYMBOL_KEYS = {
    openBrace: {
        displayName: "\\{",
        name: "openBrace",
        commands: [{ type: "cmd", command: "{" }],
    },
    closeBrace: {
        displayName: "\\}",
        name: "closeBrace",
        commands: [{ type: "cmd", command: "}" }],
    },
    comma: {
        displayName: ",",
        name: "comma",
        commands: [{ type: "write", command: "," }],
    },
    colon: {
        displayName: ":",
        name: "colon",
        commands: [{ type: "write", command: ":" }],
    },
    vert: {
        displayName: "|",
        name: "vert",
        commands: [{ type: "write", command: "\\vert" }],
    },
    subset: {
        displayName: "⊂",
        name: "subset",
        commands: [{ type: "write", command: "\\subset" }],
    },
    subseteq: {
        displayName: "⊆",
        name: "subseteq",
        commands: [{ type: "write", command: "\\subseteq" }],
    },
    neq: {
        displayName: "≠",
        name: "neq",
        commands: [{ type: "write", command: "\\neq" }],
    },
    elementOf: {
        displayName: "∈",
        name: "elementOf",
        commands: [{ type: "write", command: "\\in" }],
    },
    infty: {
        displayName: "∞",
        name: "infinity",
        commands: [{ type: "write", command: "\\infty" }],
    },
    openParen: {
        displayName: "(",
        name: "openParen",
        commands: [{ type: "cmd", command: "(" }],
    },
    closeParen: {
        displayName: ")",
        name: "closeParen",
        commands: [{ type: "cmd", command: ")" }],
    },
    openSquareBracket: {
        displayName: "[",
        name: "openSquareBracket",
        commands: [{ type: "cmd", command: "[" }],
    },
    closeSquareBracket: {
        displayName: "]",
        name: "closeSquareBracket",
        commands: [{ type: "cmd", command: "]" }],
    },
    emptySet: {
        displayName: "∅",
        name: "emptySet",
        commands: [{ type: "write", command: "\\emptyset" }],
    },
} satisfies Record<string, KeyDescription>;

export const OTHER_SYMBOLS = {
    vec: {
        displayName: "a\u20D7",
        name: "vec",
        commands: [
            { type: "write", command: "\\vec{}" },
            { type: "keystroke", command: "Left" },
        ],
    },
    langle: {
        displayName: "⟨",
        name: "langle",
        commands: [{ type: "cmd", command: "\\langle" }],
    },
    rangle: {
        displayName: "⟩",
        name: "rangle",
        commands: [{ type: "cmd", command: "\\rangle" }],
    },
    cdot: {
        displayName: "⋅",
        name: "cdot",
        commands: [{ type: "write", command: "\\cdot" }],
    },
    times: {
        displayName: "×",
        name: "times",
        commands: [{ type: "write", command: "\\times" }],
    },
    conj: {
        displayName: "a\u0304",
        name: "conj",
        commands: [{ type: "cmd", command: "\\overline" }],
    },
    perp: {
        displayName: "⊥",
        name: "perp",
        commands: [{ type: "write", command: "\\perp" }],
    },
    parallel: {
        displayName: "∥",
        name: "parallel",
        commands: [{ type: "write", command: "\\parallel" }],
    },
    angle: {
        displayName: "∠",
        name: "angle",
        commands: [{ type: "write", command: "\\angle" }],
    },
    degree: {
        displayName: "a°",
        name: "degree",
        commands: [{ type: "write", command: "\\degree" }],
    },
    exists: {
        displayName: "∃",
        name: "exists",
        commands: [{ type: "write", command: "\\exists" }],
    },
    forall: {
        displayName: "∀",
        name: "forall",
        commands: [{ type: "write", command: "\\forall" }],
    },
    percent: {
        displayName: "\\%",
        name: "percent",
        commands: [{ type: "write", command: "%" }],
    },
    dollar: {
        displayName: "$",
        name: "dollar",
        commands: [{ type: "write", command: "$" }],
    },
    subscript: {
        displayName: "bₐ",
        name: "subscript",
        commands: [{ type: "cmd", command: "_" }],
    },
} satisfies Record<string, KeyDescription>;

export const TRIG_KEYS = {
    sin: {
        // displayName: "sin",
        displayName: "\\sin",
        name: "sin",
        commands: [{ type: "type", command: "sin(" }],
    },
    cos: {
        // displayName: "cos",
        displayName: "\\cos",
        name: "cos",
        commands: [{ type: "type", command: "cos(" }],
    },
    tan: {
        // displayName: "tan",
        displayName: "\\tan",
        name: "tan",
        commands: [{ type: "type", command: "tan(" }],
    },
    arcsin: {
        // displayName: "sin⁻¹",
        displayName: "\\sin^{-1}",
        name: "arcsin",
        commands: [
            { type: "write", command: "sin^{-1}" },
            { type: "type", command: "(" },
        ],
    },
    arccos: {
        // displayName: "cos⁻¹",
        displayName: "\\cos^{-1}",
        name: "arccos",
        commands: [
            { type: "write", command: "cos^{-1}" },
            { type: "type", command: "(" },
        ],
    },
    arctan: {
        // displayName: "tan⁻¹",
        displayName: "\\tan^{-1}",
        name: "arctan",
        commands: [
            { type: "write", command: "tan^{-1}" },
            { type: "type", command: "(" },
        ],
    },
    ln: {
        // displayName: "ln",
        displayName: "\\ln",
        name: "ln",
        commands: [{ type: "type", command: "ln(" }],
    },
    logBaseA: {
        // displayName: "logₐ",
        displayName: "\\log_{b}",
        name: "logBaseA",
        commands: [
            { type: "write", command: "log_{}" },
            { type: "keystroke", command: "Left" },
        ],
    },
    lg: {
        // displayName: "log",
        displayName: "\\log",
        name: "lg",
        commands: [{ type: "write", command: "log_{10}" }],
    },
    exp: {
        // displayName: "eᵃ",
        displayName: "e^a",
        name: "exp",
        commands: [
            { type: "write", command: "e^{}" },
            { type: "keystroke", command: "Left" },
        ],
    },
    tenToTheA: {
        // displayName: "10ᵃ",
        displayName: "10^a",
        name: "tenToTheA",
        commands: [
            { type: "write", command: "10^{}" },
            { type: "keystroke", command: "Left" },
        ],
    },
    athRootOfB: {
        // displayName: "ᵃ√b",
        displayName: "\\sqrt[a]{b}",
        name: "athRootOfB",
        commands: [
            { type: "write", command: "\\sqrt[]{}" },
            { type: "keystroke", command: "Left" },
            { type: "keystroke", command: "Left" },
        ],
    },
} satisfies Record<string, KeyDescription>;

export const FUNCTION_KEYS = {
    deriv: {
        // displayName: "d/dx",
        displayName: "\\frac{d}{dx}",
        name: "deriv",
        commands: [{ type: "write", command: "\\frac{d}{dx}" }],
    },
    int: {
        // displayName: "∫",
        displayName: "\\int_a^b",
        name: "int",
        commands: [
            { type: "write", command: "\\int_{}^{}" },
            { type: "keystroke", command: "Left" },
            { type: "keystroke", command: "Left" },
        ],
    },
    nPr: {
        displayName: "nPr",
        name: "nPr",
        commands: [{ type: "type", command: "nPr(" }],
    },
    nCr: {
        displayName: "nCr",
        name: "nCr",
        commands: [{ type: "type", command: "nCr(" }],
    },
    factorial: {
        displayName: "n!",
        name: "factorial",
        commands: [{ type: "write", command: "!" }],
    },
    floor: {
        displayName: "⌊a⌋",
        name: "floor",
        commands: [
            { type: "write", command: "\\lfloor" },
            { type: "write", command: "\\rfloor" },
            { type: "keystroke", command: "Left" },
        ],
    },
    ceil: {
        displayName: "⌈a⌉",
        name: "ceil",
        commands: [
            { type: "write", command: "\\lceil" },
            { type: "write", command: "\\rceil" },
            { type: "keystroke", command: "Left" },
        ],
    },
} satisfies Record<string, KeyDescription>;

for (const key of [
    ...Object.values(SYMBOL_KEYS),
    ...Object.values(OTHER_SYMBOLS),
    ...Object.values(FUNCTION_KEYS),
    ...Object.values(TRIG_KEYS),
    ...Object.values(OPERATOR_KEYS),
    ...Object.values(VAR_KEYS),
]) {
    (key as KeyDescription).isMath = true;
}
