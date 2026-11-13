import type { HeadlessComponent, HeadlessCore } from "@doenet/utils";
import { HeadlessError } from "./errors";

/**
 * What `setValue` drives: either a path from the document root (`"x"`,
 * `"$r[3].g.mi"`), or an answer's path and the position of one of the
 * answer's own inputs, numbered from 1. The second form reaches an input that
 * has no name of its own, such as the one `<answer name="ans">x</answer>`
 * makes for itself.
 *
 * Either way the path must reach exactly one component from the root, each
 * step resolving uniquely from the one before: that is the component's stable
 * key. A name that is not unique from the root is no key, so its component
 * cannot be driven, and neither can an input of an answer that has none.
 */
export type ValueTarget = string | { answer: string; position: number };

/**
 * The raw value `setValue` gives a component, by its type: what a student
 * enters or drags to, not the response an answer makes of it.
 *
 * - `mathInput`: the LaTeX typed, a string.
 * - `textInput`: the text, a string.
 * - `booleanInput`: a boolean.
 * - `choiceInput`: the selected choices' positions, numbered from 1 (an array,
 *   or one number), in the order the reader sees the choices: one unless the
 *   input has `selectMultiple`, each at most once, none of a disabled choice.
 * - `fractionInput`: `{ numerator, denominator }`, each the LaTeX typed.
 * - `matrixInput`: the LaTeX of each cell, as an array of rows; its shape must
 *   be the matrix's.
 * - `point`: its coordinates, `[x, y]` or `[x, y, z]` as the point has,
 *   moved as a drag does.
 */
export type ValueToSet =
    | string
    | boolean
    | number
    | number[]
    | string[][]
    | { numerator: string; denominator: string };

/** The component types `setValue` sets: the inputs it knows, and `<point>`. */
export const SETTABLE_COMPONENT_TYPES = [
    "mathInput",
    "textInput",
    "booleanInput",
    "choiceInput",
    "fractionInput",
    "matrixInput",
    "point",
] as const;

/**
 * Give an input or a point a raw value, with the actions its renderer would
 * send, and wait for the document to settle.
 *
 * Refuses, with a `HeadlessError`, a target with no stable key (`noStableKey`)
 * or that names nothing (`notFound`), a component of a type it does not know
 * (`unsupportedTarget`, never a guess), a disabled or fixed input, a point that
 * cannot be moved, or a disabled choice (`targetDisabled`), and a value of the wrong
 * shape (`invalidValue`).
 */
export async function setValue(
    core: HeadlessCore,
    target: ValueTarget,
    value: ValueToSet,
): Promise<void> {
    const component = await resolveValueTarget(core, target);
    const where = describeTarget(target);

    if (
        !(SETTABLE_COMPONENT_TYPES as readonly string[]).includes(
            component.componentType,
        )
    ) {
        throw new HeadlessError(
            "unsupportedTarget",
            `${where} is a <${component.componentType}>, which setValue does not set. It sets ${SETTABLE_COMPONENT_TYPES.map((t) => `<${t}>`).join(", ")}.`,
        );
    }

    await refuseIfDisabled(core, component, where);

    switch (component.componentType) {
        case "mathInput":
            await typeMath(
                core,
                component.componentIdx,
                expectString(value, where),
            );
            return;
        case "textInput": {
            const text = expectString(value, where);
            await core.dispatchAction({
                componentIdx: component.componentIdx,
                actionName: "updateImmediateValue",
                args: { text },
            });
            await core.dispatchAction({
                componentIdx: component.componentIdx,
                actionName: "updateValue",
            });
            return;
        }
        case "booleanInput":
            if (typeof value !== "boolean") {
                throw invalid(where, "a <booleanInput> takes true or false");
            }
            await core.dispatchAction({
                componentIdx: component.componentIdx,
                actionName: "updateBoolean",
                args: { boolean: value },
            });
            return;
        case "choiceInput":
            await selectChoices(core, component, value, where);
            return;
        case "fractionInput":
            await typeFraction(core, component, value, where);
            return;
        case "matrixInput":
            await typeMatrix(core, component, value, where);
            return;
        case "point":
            await movePoint(core, component, value, where);
            return;
    }
}

/**
 * Submit an answer, a `<pretzel>`, or everything under a section-wide check
 * work (any component with a check-work button for what is inside it: a
 * `<section>`, the `<document>`, and so on), as its check-work button does.
 * `target` is a path from the root, with the same stable-key rule as
 * `setValue`.
 */
export async function submit(
    core: HeadlessCore,
    target: string,
): Promise<void> {
    const component = await resolveStable(core, target);
    const actionName =
        component.componentType === "answer" ||
        component.componentType === "pretzel"
            ? "submitAnswer"
            : "submitAllAnswers";
    await core.dispatchAction({
        componentIdx: component.componentIdx,
        actionName,
    });
}

async function resolveStable(
    core: HeadlessCore,
    path: string,
): Promise<HeadlessComponent> {
    const resolution = await core.resolvePath(path);
    switch (resolution.status) {
        case "resolved":
            return resolution.component;
        case "notFound":
            throw new HeadlessError(
                "notFound",
                `Nothing in the document answers to "${path}".`,
            );
        case "notUnique":
            throw new HeadlessError(
                "noStableKey",
                `"${path}" names more than one component from the document root, so it is not a stable key and cannot be driven. Give the component (or a container on its path) a name that is unique from the root.`,
            );
    }
}

async function resolveValueTarget(
    core: HeadlessCore,
    target: ValueTarget,
): Promise<HeadlessComponent> {
    if (typeof target === "string") {
        return resolveStable(core, target);
    }
    const { answer: answerPath, position } = target;
    const answer = await resolveStable(core, answerPath);
    if (answer.componentType !== "answer") {
        throw new HeadlessError(
            "notFound",
            `"${answerPath}" is a <${answer.componentType}>, not an <answer>.`,
        );
    }
    const inputs =
        (await core.getAnswers()).find(
            (a) => a.componentIdx === answer.componentIdx,
        )?.inputs ?? [];
    if (
        !Number.isInteger(position) ||
        position < 1 ||
        position > inputs.length
    ) {
        throw new HeadlessError(
            "notFound",
            `The answer "${answerPath}" has ${inputs.length} input${inputs.length === 1 ? "" : "s"} of its own; there is none at position ${position}.`,
        );
    }
    return inputs[position - 1];
}

function describeTarget(target: ValueTarget) {
    return typeof target === "string"
        ? `"${target}"`
        : `Input ${target.position} of the answer "${target.answer}"`;
}

function invalid(where: string, rule: string) {
    return new HeadlessError("invalidValue", `${where}: ${rule}.`);
}

function expectString(value: ValueToSet, where: string): string {
    if (typeof value !== "string") {
        throw invalid(where, "this input takes a string");
    }
    return value;
}

async function refuseIfDisabled(
    core: HeadlessCore,
    component: HeadlessComponent,
    where: string,
) {
    // An component or point that cannot change ignores the actions sent to it, so
    // a value set on one would silently not be there. A fixed component (`fixed`
    // on it or on a container) is one, though it is not disabled.
    const { disabled, fixed, fixLocation, draggable } =
        await core.readProperties(component.componentIdx, [
            "disabled",
            "fixed",
            "fixLocation",
            "draggable",
        ]);
    if (component.componentType === "point") {
        if (fixed === true || fixLocation === true || draggable === false) {
            throw new HeadlessError(
                "targetDisabled",
                `${where} is a point that cannot be moved (fixed, its location fixed, or not draggable).`,
            );
        }
    } else if (disabled === true) {
        throw new HeadlessError(
            "targetDisabled",
            `${where} is disabled (for example, its answer has no attempts left), so it does not take a value.`,
        );
    } else if (fixed === true) {
        throw new HeadlessError(
            "targetDisabled",
            `${where} is fixed, so it does not take a value.`,
        );
    }
}

async function typeMath(
    core: HeadlessCore,
    componentIdx: number,
    latex: string,
) {
    await core.dispatchAction({
        componentIdx,
        actionName: "updateRawValue",
        args: { rawRendererValue: latex },
    });
    await core.dispatchAction({ componentIdx, actionName: "updateValue" });
}

async function selectChoices(
    core: HeadlessCore,
    input: HeadlessComponent,
    value: ValueToSet,
    where: string,
) {
    const selectedIndices = typeof value === "number" ? [value] : value;
    const { numChoices, selectMultiple, choicesDisabled } =
        await core.readProperties(input.componentIdx, [
            "numChoices",
            "selectMultiple",
            "choicesDisabled",
        ]);
    if (
        !Array.isArray(selectedIndices) ||
        !selectedIndices.every(
            (index) =>
                typeof index === "number" &&
                Number.isInteger(index) &&
                index >= 1 &&
                (typeof numChoices !== "number" || index <= numChoices),
        )
    ) {
        throw invalid(
            where,
            `a <choiceInput> takes the positions of the selected choices, whole numbers from 1 to ${numChoices}`,
        );
    }
    const indices = selectedIndices as number[];
    // What a reader can select: one choice at most unless the input selects
    // several, each once, and none that is disabled. The input itself would
    // take any list, and grade a selection no reader could make.
    if (new Set(indices).size !== indices.length) {
        throw invalid(where, "a <choiceInput> takes each choice at most once");
    }
    if (selectMultiple !== true && indices.length > 1) {
        throw invalid(
            where,
            "this <choiceInput> selects one choice; it takes one position",
        );
    }
    const disabledIndex = indices.find(
        (index) => Array.isArray(choicesDisabled) && choicesDisabled[index - 1],
    );
    if (disabledIndex !== undefined) {
        throw new HeadlessError(
            "targetDisabled",
            `${where}: choice ${disabledIndex} is disabled, so it cannot be selected.`,
        );
    }
    // The renderer sends the selected positions in increasing order, so the
    // input's value lists the selected choices in the order the reader sees
    // them, whatever order they were given in here.
    await core.dispatchAction({
        componentIdx: input.componentIdx,
        actionName: "updateSelectedIndices",
        args: { selectedIndices: [...indices].sort((a, b) => a - b) },
    });
}

async function typeFraction(
    core: HeadlessCore,
    input: HeadlessComponent,
    value: ValueToSet,
    where: string,
) {
    if (
        typeof value !== "object" ||
        value === null ||
        Array.isArray(value) ||
        typeof value.numerator !== "string" ||
        typeof value.denominator !== "string"
    ) {
        throw invalid(
            where,
            "a <fractionInput> takes { numerator, denominator }, each the LaTeX typed",
        );
    }
    const [numerator, denominator] = await core.getChildren(input.componentIdx);
    // Its two boxes are math inputs of an internal type of their own.
    const isBox = (part?: HeadlessComponent) =>
        part?.componentType === "_fractionInputComponent";
    if (!isBox(numerator) || !isBox(denominator)) {
        throw Error(
            `${where}: the <fractionInput> does not have the two math inputs it is expected to.`,
        );
    }
    await typeMath(core, numerator.componentIdx, value.numerator);
    await typeMath(core, denominator.componentIdx, value.denominator);
}

async function typeMatrix(
    core: HeadlessCore,
    input: HeadlessComponent,
    value: ValueToSet,
    where: string,
) {
    const { numRows, numColumns } = await core.readProperties(
        input.componentIdx,
        ["numRows", "numColumns"],
    );
    if (
        !Array.isArray(value) ||
        value.length !== numRows ||
        !value.every(
            (row) =>
                Array.isArray(row) &&
                row.length === numColumns &&
                row.every((cell) => typeof cell === "string"),
        )
    ) {
        throw invalid(
            where,
            `a <matrixInput> takes the LaTeX of each cell as ${numRows} rows of ${numColumns} strings, its current size`,
        );
    }
    const cells = await core.getChildren(input.componentIdx);
    const rows = value as string[][];
    for (const [rowInd, row] of rows.entries()) {
        for (const [colInd, latex] of row.entries()) {
            const cell = cells[colInd + (numColumns as number) * rowInd];
            if (!cell) {
                throw Error(
                    `${where}: the <matrixInput> has no cell (${rowInd + 1}, ${colInd + 1}).`,
                );
            }
            await typeMath(core, cell.componentIdx, latex);
        }
    }
}

async function movePoint(
    core: HeadlessCore,
    component: HeadlessComponent,
    value: ValueToSet,
    where: string,
) {
    if (
        !Array.isArray(value) ||
        value.length < 2 ||
        value.length > 3 ||
        !value.every((x) => typeof x === "number" && Number.isFinite(x))
    ) {
        throw invalid(
            where,
            "a <point> takes [x, y] or [x, y, z], finite numbers",
        );
    }
    const { numDimensions } = await core.readProperties(
        component.componentIdx,
        ["numDimensions"],
    );
    if (typeof numDimensions === "number" && value.length !== numDimensions) {
        // A drag moves every coordinate: a coordinate left out would keep its
        // value, and one past the point's dimensions would be dropped.
        throw invalid(
            where,
            `this <point> has ${numDimensions} coordinates; it takes ${numDimensions} numbers`,
        );
    }
    const [x, y, z] = value as number[];
    await core.dispatchAction({
        componentIdx: component.componentIdx,
        actionName: "movePoint",
        args: z === undefined ? { x, y } : { x, y, z },
    });
}
