import type { HeadlessComponent, HeadlessCore } from "@doenet/utils";
import { HeadlessError } from "./errors";

/**
 * What `setInput` drives: either a path from the document root (`"x"`,
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
export type InputTarget = string | { answer: string; position: number };

/**
 * The raw value an input takes, by input type: what a student enters, not
 * the response an answer makes of it.
 *
 * - `mathInput`: the LaTeX typed, a string.
 * - `textInput`: the text, a string.
 * - `booleanInput`: a boolean.
 * - `choiceInput`: the selected choices' positions, numbered from 1 (an array,
 *   or one number), in the order the reader sees the choices.
 * - `fractionInput`: `{ numerator, denominator }`, each the LaTeX typed.
 * - `matrixInput`: the LaTeX of each cell, as an array of rows; its shape must
 *   be the matrix's.
 * - `point`: its coordinates, `[x, y]` or `[x, y, z]`, moved as a drag does.
 */
export type InputValue =
    | string
    | boolean
    | number
    | number[]
    | string[][]
    | { numerator: string; denominator: string };

/** The input types `setInput` knows, and nothing else. */
export const SUPPORTED_INPUT_TYPES = [
    "mathInput",
    "textInput",
    "booleanInput",
    "choiceInput",
    "fractionInput",
    "matrixInput",
    "point",
] as const;

/**
 * Give an input a raw value, with the actions its renderer would send, and
 * wait for the document to settle.
 *
 * Refuses, with a `HeadlessError`, a target with no stable key (`noStableKey`)
 * or that names nothing (`notFound`), a component of a type it does not know
 * (`unsupportedInput`, never a guess), a disabled input or a point that cannot
 * be moved (`inputDisabled`), and a value of the wrong shape (`invalidValue`).
 */
export async function setInput(
    core: HeadlessCore,
    target: InputTarget,
    value: InputValue,
): Promise<void> {
    const input = await resolveInputTarget(core, target);
    const where = describeTarget(target);

    if (
        !(SUPPORTED_INPUT_TYPES as readonly string[]).includes(
            input.componentType,
        )
    ) {
        throw new HeadlessError(
            "unsupportedInput",
            `${where} is a <${input.componentType}>, which setInput does not drive. It drives ${SUPPORTED_INPUT_TYPES.map((t) => `<${t}>`).join(", ")}.`,
        );
    }

    await refuseIfDisabled(core, input, where);

    switch (input.componentType) {
        case "mathInput":
            await typeMath(
                core,
                input.componentIdx,
                expectString(value, where),
            );
            return;
        case "textInput": {
            const text = expectString(value, where);
            await core.dispatchAction({
                componentIdx: input.componentIdx,
                actionName: "updateImmediateValue",
                args: { text },
            });
            await core.dispatchAction({
                componentIdx: input.componentIdx,
                actionName: "updateValue",
            });
            return;
        }
        case "booleanInput":
            if (typeof value !== "boolean") {
                throw invalid(where, "a <booleanInput> takes true or false");
            }
            await core.dispatchAction({
                componentIdx: input.componentIdx,
                actionName: "updateBoolean",
                args: { boolean: value },
            });
            return;
        case "choiceInput":
            await selectChoices(core, input, value, where);
            return;
        case "fractionInput":
            await typeFraction(core, input, value, where);
            return;
        case "matrixInput":
            await typeMatrix(core, input, value, where);
            return;
        case "point":
            await movePoint(core, input, value, where);
            return;
    }
}

/**
 * Submit an answer, a `<pretzel>`, or everything under a section-wide check
 * work (any component with a check-work button for what is inside it: a
 * `<section>`, the `<document>`, and so on), as its check-work button does.
 * `target` is a path from the root, with the same stable-key rule as
 * `setInput`.
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

async function resolveInputTarget(
    core: HeadlessCore,
    target: InputTarget,
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

function describeTarget(target: InputTarget) {
    return typeof target === "string"
        ? `"${target}"`
        : `Input ${target.position} of the answer "${target.answer}"`;
}

function invalid(where: string, rule: string) {
    return new HeadlessError("invalidValue", `${where}: ${rule}.`);
}

function expectString(value: InputValue, where: string): string {
    if (typeof value !== "string") {
        throw invalid(where, "this input takes a string");
    }
    return value;
}

async function refuseIfDisabled(
    core: HeadlessCore,
    input: HeadlessComponent,
    where: string,
) {
    // An input or point that cannot change ignores the actions sent to it, so
    // a value set on one would silently not be there.
    const { disabled, fixed, draggable } = await core.readProperties(
        input.componentIdx,
        ["disabled", "fixed", "draggable"],
    );
    if (input.componentType === "point") {
        if (fixed === true || draggable === false) {
            throw new HeadlessError(
                "inputDisabled",
                `${where} is a point that cannot be moved (fixed, or not draggable).`,
            );
        }
    } else if (disabled === true) {
        throw new HeadlessError(
            "inputDisabled",
            `${where} is disabled (for example, its answer has no attempts left), so it does not take a value.`,
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
    value: InputValue,
    where: string,
) {
    const selectedIndices = typeof value === "number" ? [value] : value;
    const { numChoices } = await core.readProperties(input.componentIdx, [
        "numChoices",
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
    await core.dispatchAction({
        componentIdx: input.componentIdx,
        actionName: "updateSelectedIndices",
        args: { selectedIndices },
    });
}

async function typeFraction(
    core: HeadlessCore,
    input: HeadlessComponent,
    value: InputValue,
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
    value: InputValue,
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
    input: HeadlessComponent,
    value: InputValue,
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
    const [x, y, z] = value as number[];
    await core.dispatchAction({
        componentIdx: input.componentIdx,
        actionName: "movePoint",
        args: z === undefined ? { x, y } : { x, y, z },
    });
}
