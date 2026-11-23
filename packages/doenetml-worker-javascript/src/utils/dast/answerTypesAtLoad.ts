/**
 * An `<answer>`'s type, decided from the DoenetML when the document loads
 * (ANS-4, D55; Doenet/DoenetML#2608), before the sugar of the answer and of
 * its awards, which read it.
 *
 * An award's content is compared with the input written inside the answer,
 * so that input's type is the answer's type:
 *
 * 1. One input written inside (`<textInput>`, `<booleanInput>`, …) decides
 *    it. A written `type` that disagrees is an error, `doenet-e0092`, and
 *    the input's type is used.
 * 2. With no input inside, a written `type` decides it, else the typed
 *    content of its awards, references included (typed as TYPE-1 types
 *    them, `responseRead` in `propertyTypesAtLoad.ts`): a math when any is
 *    a math, else a text when any is a text, else a boolean when any is a
 *    boolean. That type also picks the input the answer's sugar adds, so
 *    `<answer>$t</answer>`, with `t` a `<text>`, adds a `<textInput>`.
 * 3. Otherwise (more than one input, an input whose type isn't one an award
 *    compares, a choice answer, `type="videoWatched"`) nothing is decided
 *    here, and the sugar behaves as before: plain text is a math unless
 *    `type` is written.
 *
 * What is decided is written on the answer as its `type`, so that plain
 * text in every award of the answer, written or made by its sugar, is read
 * as that type (`Award.js` reads the answer's `type`; D55 decision 3), as
 * if the author had written it.
 *
 * Also reported here, as warnings, for an award with content and no
 * `<when>` (an award its sugar makes from the answer's content included):
 *
 * - content of another type than the input it is compared with (written,
 *   or the one the sugar adds), which can never earn credit
 *   (`doenet-w0202`); only an award's one component, since content of more
 *   than one child is wrapped in the answer's type and read as it;
 * - in an answer with more than one input, where it is compared with
 *   nothing (`doenet-w0203`);
 * - in an answer with no input inside but a `forAnswer` input, where it is
 *   compared with an input the answer adds, not the `forAnswer` one
 *   (`doenet-w0204`).
 *
 * `<considerAsResponses>`, `referencesAreResponses` and a `forAnswer` input
 * don't decide the type. A `<when>` reads its literal text by detection
 * (D45 decision 7), not by the answer's type.
 */
import type { ComponentInfoObjects } from "../componentInfoObjects";
import type { SerializedComponent, SerializedAttribute } from "./types";
import { documentReferents } from "./valueReferences";
import { propertyTypeReader } from "./propertyTypesAtLoad";
import { codedDiagnostic } from "../diagnostics";
import { unwrapSource } from "./convertNormalizedDast";

/** The types an award compares its content as. */
type AnswerType = "math" | "text" | "boolean";

/**
 * The type an award compares the value of an input of its own type as
 * (`Award.js`, `buildParsedExpression`): a `<mathInput>`, a
 * `<fractionInput>` and a `<matrixInput>` give a math, a `<textInput>` a
 * text, a `<booleanInput>` a boolean. (A `<codeEditor>` is not an input,
 * so it is not one an answer compares.)
 */
const INPUT_TYPES: Record<string, AnswerType> = {
    mathInput: "math",
    fractionInput: "math",
    matrixInput: "math",
    textInput: "text",
    booleanInput: "boolean",
};

/** The input the answer's sugar adds for each type. */
const ADDED_INPUT: Record<AnswerType, string> = {
    math: "mathInput",
    text: "textInput",
    boolean: "booleanInput",
};

/**
 * The type a value of `type` (a tag, or a type a reference reads) is
 * compared as by an award: a number is a math. `undefined` for any other,
 * which an award may adapt.
 */
function comparedAs(type: string | undefined): AnswerType | undefined {
    switch (type) {
        case "math":
        case "number":
            return "math";
        case "text":
            return "text";
        case "boolean":
            return "boolean";
    }
    return undefined;
}

/**
 * Decide the type of each `<answer>` in `serializedComponents` (see above),
 * writing it as the answer's `type`, and report what is found. Runs before
 * the sugar, after `markCopiedAwards`, so that an `<award copy>` is read by
 * the children it will hold.
 */
export function decideAnswerTypesAtLoad({
    serializedComponents,
    componentInfoObjects,
}: {
    serializedComponents: (SerializedComponent | string)[];
    componentInfoObjects: ComponentInfoObjects;
}) {
    const diagnostics: ReturnType<typeof codedDiagnostic>[] = [];

    const answers: SerializedComponent[] = [];
    const seen = new Set<SerializedComponent>();
    function visit(components: (SerializedComponent | string)[]) {
        for (const component of components) {
            if (typeof component !== "object" || seen.has(component)) {
                continue;
            }
            seen.add(component);
            if (component.componentType === "answer") {
                answers.push(component);
            }
            for (const attribute of Object.values(component.attributes ?? {})) {
                const attr: any = attribute;
                if (attr.type === "component" && attr.component) {
                    visit([attr.component]);
                } else if (Array.isArray(attr.children)) {
                    visit(attr.children);
                }
            }
            visit(component.children ?? []);
        }
    }
    visit(serializedComponents);

    if (answers.length === 0) {
        return diagnostics;
    }

    const referents = documentReferents({
        serializedComponents,
        componentInfoObjects,
        typeRepeatValues: true,
    });
    const { responseRead, tagOfComponent, inputsForAnswer } =
        propertyTypeReader({ componentInfoObjects, referents });

    function inherits(componentType: string, base: string) {
        return componentInfoObjects.isInheritedComponentType({
            inheritedComponentType: componentType,
            baseComponentType: base,
        });
    }

    /**
     * The type a component of `tag` is compared as by an award, by its tag,
     * as the answer's sugar reads it: a math or number (or a list of them)
     * is a math, a text (or list) a text, a boolean (or list) a boolean.
     * `undefined` for any other (an `<m>`, a `<point>`), which an award
     * may adapt.
     */
    function tagComparedAs(tag: string): AnswerType | undefined {
        if (
            ["math", "number", "mathList", "numberList"].some((t) =>
                inherits(tag, t),
            )
        ) {
            return "math";
        }
        if (["text", "textList"].some((t) => inherits(tag, t))) {
            return "text";
        }
        if (
            !inherits(tag, "when") &&
            ["boolean", "booleanList"].some((t) => inherits(tag, t))
        ) {
            return "boolean";
        }
        return undefined;
    }

    /**
     * The type the component `c`, written in an award, is compared as, and
     * the tag to name it by: a tag (also one made with `extend` or `copy`)
     * by its tag; a bare reference by its referent's tag, or, for an input,
     * by the type of its value; a reference to a property by the property's
     * type, as decided at load (TYPE-1). `undefined` when not known, or of
     * no type an award compares.
     */
    function comparedTypeOf(
        c: SerializedComponent,
    ): { type: AnswerType; tag: string } | undefined {
        const tag = tagOfComponent(c);
        const isReference = isBareReference(c);
        const ref: any =
            isReference && c.extending
                ? unwrapSource(c.extending as any)
                : undefined;
        const path: unknown[] = ref?.unresolvedPath ?? [];
        if (
            isReference &&
            (path.length > 0 || (tag && inherits(tag, "_input")))
        ) {
            const read = responseRead(c, true).type;
            // by inheritance: `$m.latex` reads a `<latex>`, which is a text
            const type =
                comparedAs(read) ??
                (read === undefined ? undefined : tagComparedAs(read));
            return type === undefined ? undefined : { type, tag: tag ?? read! };
        }
        if (tag === undefined) {
            return undefined;
        }
        const type = tagComparedAs(tag);
        return type === undefined ? undefined : { type, tag };
    }

    /** A `$x` written alone (not `<tag copy="$x"/>`). */
    function isBareReference(c: SerializedComponent) {
        return (
            c.componentType === "_copy" &&
            c.attributes?._createComponentOfType === undefined
        );
    }

    /**
     * Whether `c` is a `tag` as the answer's sugar reads it, by its tag (also
     * one made with `extend` or `copy`); a bare reference is not one.
     */
    function isTag(c: SerializedComponent, tag: string) {
        if (isBareReference(c)) {
            return false;
        }
        const own = tagOfComponent(c);
        return own !== undefined && inherits(own, tag);
    }

    function isBlank(child: SerializedComponent | string) {
        return typeof child === "string" && child.trim() === "";
    }

    for (const answer of answers) {
        const writtenAttribute: SerializedAttribute | undefined =
            answer.attributes?.type;
        // As written, and as the keyword it is read as (`type` declares
        // `toLowerCase` and valid values, which trim; D51 decision 3).
        const writtenRaw =
            writtenAttribute?.type === "primitive"
                ? String(writtenAttribute.primitive.value)
                : undefined;
        const writtenValue = writtenRaw?.trim().toLowerCase();
        // `videoWatched` is made by the parser's sugar, which reads it
        // without case but untrimmed, as the answer's sugar does.
        if (writtenRaw?.toLowerCase() === "videowatched") {
            continue;
        }
        const written: AnswerType | undefined =
            writtenValue === "math" ||
            writtenValue === "text" ||
            writtenValue === "boolean"
                ? writtenValue
                : undefined;

        // The answer's children as its sugar reads them (`Answer.js`): by
        // tag, a bare reference (`$x`) being content whatever it names;
        // without labels and descriptions, and blanks at either end.
        const sugarChildren = (answer.children ?? []).filter(
            (child) =>
                !(
                    typeof child === "object" &&
                    ["label", "description", "shortDescription"].some((tag) =>
                        isTag(child, tag),
                    )
                ),
        );
        while (sugarChildren.length > 0 && isBlank(sugarChildren[0])) {
            sugarChildren.shift();
        }
        while (
            sugarChildren.length > 0 &&
            isBlank(sugarChildren[sugarChildren.length - 1])
        ) {
            sugarChildren.pop();
        }

        // A choice answer is decided by its choices, unchanged.
        if (
            sugarChildren.some(
                (child) =>
                    typeof child === "object" &&
                    (isTag(child, "choice") || isTag(child, "choiceInput")),
            )
        ) {
            continue;
        }

        const inputs: SerializedComponent[] = [];
        // The content of each award with content and no `<when>`, which is
        // compared with the answer's one input; the answer's own content,
        // which its sugar wraps in an award, is one of them.
        const comparedContents: {
            content: (SerializedComponent | string)[];
            at: SerializedComponent;
        }[] = [];

        /** Whether the sugar wraps `child` in an award of its own. */
        function isContent(child: SerializedComponent | string) {
            return (
                typeof child !== "object" ||
                !["_input", "award", "considerAsResponses"].some((tag) =>
                    isTag(child, tag),
                )
            );
        }

        for (const child of sugarChildren) {
            if (typeof child !== "object" || isContent(child)) {
                continue;
            }
            if (isTag(child, "_input")) {
                inputs.push(child);
            } else if (isTag(child, "award")) {
                const awardChildren: (SerializedComponent | string)[] =
                    child.doenetAttributes?.copiedAward?.children ??
                    (child.componentType === "award" ? child.children : []) ??
                    [];
                const content = awardChildren.filter((c) => !isBlank(c));
                const hasWhen = content.some(
                    (c) =>
                        typeof c === "object" &&
                        tagOfComponent(c) !== undefined &&
                        inherits(tagOfComponent(c)!, "when"),
                );
                if (content.length > 0 && !hasWhen) {
                    comparedContents.push({ content, at: child });
                }
            }
            // a `<considerAsResponses>` is what is recorded, not what is
            // compared
        }

        // The sugar wraps one run of content: from the first child it
        // wraps to the next it doesn't. Content after that is left as it
        // is, an invalid child of the answer (`doenet-w0107`), compared
        // with nothing.
        const start = sugarChildren.findIndex(isContent);
        if (start !== -1) {
            const end = sugarChildren.findIndex(
                (child, i) => i > start && !isContent(child),
            );
            const ownContent = sugarChildren
                .slice(start, end === -1 ? undefined : end)
                .filter((child) => !isBlank(child));
            if (ownContent.length > 0) {
                comparedContents.push({ content: ownContent, at: answer });
            }
        }

        /** The type each typed component of `content` is compared as. */
        function typedContent(content: (SerializedComponent | string)[]) {
            const typed: {
                type: AnswerType;
                tag: string;
                component: SerializedComponent;
            }[] = [];
            for (const c of content) {
                if (typeof c !== "object") {
                    continue;
                }
                const found = comparedTypeOf(c);
                if (found !== undefined) {
                    typed.push({ ...found, component: c });
                }
            }
            return typed;
        }

        let decided: AnswerType | undefined;
        // The input an award's content is compared with: its tag and type.
        let comparedWith: { tag: string; type: AnswerType } | undefined;

        if (inputs.length === 1) {
            const tag = tagOfComponent(inputs[0])!;
            const inputType = Object.entries(INPUT_TYPES).find(([input]) =>
                inherits(tag, input),
            )?.[1];
            if (inputType !== undefined) {
                decided = inputType;
                comparedWith = { tag, type: inputType };
                if (written !== undefined && written !== inputType) {
                    diagnostics.push({
                        ...codedDiagnostic({
                            type: "error",
                            code: "doenet-e0092",
                            args: {
                                type: written,
                                input: tag,
                                inputType,
                            },
                        }),
                        position:
                            (writtenAttribute as any)?.position ??
                            answer.position,
                        sourceDoc: answer.sourceDoc,
                    });
                }
            }
        } else if (inputs.length === 0) {
            if (written !== undefined) {
                decided = written;
            } else {
                const types = new Set(
                    comparedContents.flatMap(({ content }) =>
                        typedContent(content).map(({ type }) => type),
                    ),
                );
                decided = types.has("math")
                    ? "math"
                    : types.has("text")
                      ? "text"
                      : types.has("boolean")
                        ? "boolean"
                        : undefined;
            }
            if (comparedContents.length > 0) {
                const type = decided ?? "math";
                comparedWith = { tag: ADDED_INPUT[type], type };
            }
        }

        // Written as the sugar reads it, which is exactly (`type="Text"`
        // would be read as no type there). When nothing is decided (more
        // than one input), a written `type` is still written as its keyword.
        const toWrite = decided ?? written;
        if (toWrite !== undefined && toWrite !== writtenRaw) {
            if (writtenRaw !== undefined && written === undefined) {
                // A `type` that names no type, replaced: reported here, as
                // the answer's sugar would have, since it no longer sees it.
                diagnostics.push({
                    ...codedDiagnostic({
                        type: "warning",
                        code: "doenet-w0078",
                        args: { type: writtenRaw },
                    }),
                    position:
                        (writtenAttribute as any)?.position ?? answer.position,
                    sourceDoc: answer.sourceDoc,
                });
            }
            answer.attributes = {
                ...answer.attributes,
                type: {
                    type: "primitive",
                    name: "type",
                    primitive: { type: "string", value: toWrite },
                } as SerializedAttribute,
            };
        }

        // D55 decision 5: content of another type than the input can never
        // earn credit. Only content that is one component is compared as it
        // is: an award's sugar wraps content of more than one child in the
        // answer's type (`<award><text>x</text>y</award>` is a math "xy" in
        // a math answer), so its typed components are read as that type.
        if (comparedWith !== undefined) {
            for (const { content } of comparedContents) {
                if (content.length !== 1) {
                    continue;
                }
                for (const { type, tag, component } of typedContent(content)) {
                    if (type !== comparedWith.type) {
                        diagnostics.push({
                            ...codedDiagnostic({
                                type: "warning",
                                code: "doenet-w0202",
                                args: {
                                    contentType: tag,
                                    input: comparedWith.tag,
                                    inputType: comparedWith.type,
                                },
                            }),
                            position: component.position ?? answer.position,
                            sourceDoc: component.sourceDoc ?? answer.sourceDoc,
                        });
                    }
                }
            }
        }

        // D55 decision 6: with more than one input, content is compared
        // with nothing.
        if (inputs.length > 1) {
            for (const { at } of comparedContents) {
                diagnostics.push({
                    ...codedDiagnostic({
                        type: "warning",
                        code: "doenet-w0203",
                        args: {
                            numInputs: inputs.length,
                            ownContent: at === answer ? "true" : "false",
                        },
                    }),
                    position: at.position,
                    sourceDoc: at.sourceDoc,
                });
            }
        }

        // D55 decision 7: a `forAnswer` input is reached only through a
        // `<when>`, so content is compared with an input the answer adds.
        if (
            inputs.length === 0 &&
            comparedContents.length > 0 &&
            inputsForAnswer(answer.componentIdx).length > 0
        ) {
            for (const { at } of comparedContents) {
                diagnostics.push({
                    ...codedDiagnostic({
                        type: "warning",
                        code: "doenet-w0204",
                        args: {
                            input: comparedWith?.tag ?? "mathInput",
                            ownContent: at === answer ? "true" : "false",
                        },
                    }),
                    position: at.position,
                    sourceDoc: at.sourceDoc,
                });
            }
        }
    }

    return diagnostics;
}
