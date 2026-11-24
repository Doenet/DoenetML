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
 * Also reported here, as warnings, for an award with content other than
 * one `<when>` (an award its sugar makes from the answer's content
 * included, so also a `<when>` written directly in the answer):
 *
 * - content of another type than the input it is compared with (written,
 *   or the one the sugar adds), which can never earn credit
 *   (`doenet-w0205`); only an award's one component, since content of more
 *   than one child is wrapped in the answer's type and read as it;
 * - in an answer with more than one input, where it is compared with
 *   nothing (`doenet-w0206`);
 * - in an answer with no input inside but a `forAnswer` input, where it is
 *   compared with an input the answer adds, not the `forAnswer` one
 *   (`doenet-w0207`).
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
import { doenetMLReferenceAsWritten } from "../sourceLocation";
import { answerContentType } from "../answerContentType";
import { allComponents } from "./copiedAwards";

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
    sources,
}: {
    serializedComponents: (SerializedComponent | string)[];
    componentInfoObjects: ComponentInfoObjects;
    /** The DoenetML, to quote a reference as written (DIAG-3). */
    sources?: readonly string[];
}) {
    const diagnostics: ReturnType<typeof codedDiagnostic>[] = [];

    const answers = allComponents(serializedComponents).filter(
        (component) => component.componentType === "answer",
    );

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
     * as the sugar reads it (`answerContentType`): a math or number (or a
     * list of them) is a math, a text (or list) a text, a boolean (or list)
     * a boolean. `undefined` for any other (an `<m>`, a `<point>`, a
     * `<when>`), which an award may adapt.
     */
    function tagComparedAs(tag: string): AnswerType | undefined {
        const type = answerContentType((t: string) => inherits(tag, t));
        return type === "booleanList"
            ? "boolean"
            : type === "when"
              ? undefined
              : type;
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
        if (isReference && inherits(tag, "when")) {
            // a bare `$w` is the `<when>`'s value, a boolean, compared with
            // the input, not a condition
            return { type: "boolean", tag };
        }
        const type = tagComparedAs(tag);
        return type === undefined ? undefined : { type, tag };
    }

    /**
     * A bare reference `c` as the author wrote it (`$ti`, DIAG-3), or `""`
     * for anything else.
     */
    function referenceAsWritten(c: SerializedComponent) {
        if (!isBareReference(c) || !c.extending) {
            return "";
        }
        const ref: any = unwrapSource(c.extending as any);
        return doenetMLReferenceAsWritten(ref?.originalPath, sources);
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

    /**
     * Whether `content` is one `<when>`, which an award reads as its
     * condition. With other content, the award's sugar wraps it with the
     * rest in the answer's type, and it is compared as that. A composite
     * that may hold a `<when>` is kept unwrapped too, and the `<when>` it
     * expands to is the award's condition (`<award><group><when>…</when>
     * </group></award>`); so is a reference to one, also with an index
     * (`$r[1]` of a repeat of `<when>`s, #2657 item 6). A bare `$w` naming a
     * `<when>` is its value, a boolean compared with the input.
     */
    function isWhen(content: (SerializedComponent | string)[]) {
        const c = content[0];
        if (content.length !== 1 || typeof c !== "object") {
            return false;
        }
        const tag = tagOfComponent(c);
        if (isBareReference(c)) {
            // `$g`, naming a composite, expands to what it holds; `$r[1]`
            // to what one of its items holds
            const source = sourceOf(c, true);
            if (source === undefined) {
                return tag !== undefined && inherits(tag, "_composite");
            }
            return (
                inherits(tagOfComponent(source) ?? "", "_composite") &&
                mayHoldWhen(source)
            );
        }
        if (tag === undefined) {
            return false;
        }
        if (inherits(tag, "when")) {
            return true;
        }
        return inherits(tag, "_composite") && mayHoldWhen(c);
    }

    /**
     * The component the reference or copy `c` names, as written: with
     * `allowPath`, also when a path is left after it (an index or a
     * property). `undefined` when the DoenetML doesn't give it.
     */
    function sourceOf(
        c: SerializedComponent,
        allowPath = false,
    ): SerializedComponent | undefined {
        if (c.componentType !== "_copy" || !c.extending) {
            return undefined;
        }
        const ref: any = unwrapSource(c.extending as any);
        if (
            !ref ||
            ref.nodeIdx < 0 ||
            (!allowPath && (ref.unresolvedPath ?? []).length > 0)
        ) {
            return undefined;
        }
        return (
            referents.componentsByIdx.get(ref.nodeIdx) ??
            referents.copiesByCreatedIdx.get(ref.nodeIdx)
        );
    }

    /**
     * Whether the composite `c` may expand to a `<when>`: one written in it,
     * at any depth through composites and the options and cases of a
     * `<select>` or `<conditionalContent>` (not one inside a `<p>`, which
     * the composite doesn't expand to, #2657 item 10), or one its source
     * holds, for a composite made with `copy` or `extend`; or one it copies
     * whose content isn't known here.
     */
    function mayHoldWhen(
        c: SerializedComponent,
        visiting = new Set<SerializedComponent>(),
    ): boolean {
        if (visiting.has(c)) {
            return false;
        }
        visiting.add(c);
        if (c.componentType === "_copy") {
            const tag = tagOfComponent(c);
            if (tag === undefined) {
                return true;
            }
            if (inherits(tag, "when")) {
                return !isBareReference(c);
            }
            if (!inherits(tag, "_composite")) {
                return false;
            }
            const source = sourceOf(c);
            return (
                source === undefined ||
                mayHoldWhen(source, visiting) ||
                childrenMayHoldWhen(c, visiting)
            );
        }
        if (inherits(c.componentType, "when")) {
            return true;
        }
        return childrenMayHoldWhen(c, visiting);
    }

    function childrenMayHoldWhen(
        c: SerializedComponent,
        visiting: Set<SerializedComponent>,
    ): boolean {
        return (c.children ?? []).some(
            (child) =>
                typeof child === "object" &&
                (child.componentType === "_copy" ||
                    inherits(child.componentType, "when") ||
                    inherits(child.componentType, "_composite") ||
                    ["option", "case", "else"].some((tag) =>
                        isTag(child, tag),
                    )) &&
                mayHoldWhen(child, visiting),
        );
    }

    /** Whether `c` is a composite written out (not a reference or a copy). */
    function isWrittenComposite(c: SerializedComponent) {
        return (
            c.componentType !== "_copy" &&
            inherits(c.componentType, "_composite")
        );
    }

    /**
     * What the composite `c` written in an answer expands to, as written:
     * its content at any depth through composites and the options and cases
     * of a `<select>` or `<conditionalContent>`. A composite's content is
     * shown as if written in its place (COMP-1, #1874). A `<setup>` shows
     * nothing. (`awardsInComposite` in `Answer.js` reads the same awards.)
     */
    function contentOfComposite(
        c: SerializedComponent,
    ): (SerializedComponent | string)[] {
        if (!isWrittenComposite(c) || isTag(c, "setup")) {
            return [];
        }
        const found: (SerializedComponent | string)[] = [];
        function visit(components: (SerializedComponent | string)[]) {
            for (const child of components) {
                if (typeof child !== "object") {
                    found.push(child);
                } else if (isTag(child, "setup")) {
                    continue;
                } else if (
                    isWrittenComposite(child) ||
                    ["option", "case", "else"].some((tag) => isTag(child, tag))
                ) {
                    visit(child.children ?? []);
                } else {
                    found.push(child);
                }
            }
        }
        visit(c.children ?? []);
        return found;
    }

    /** The awards the composite `c` written in an answer holds. */
    function awardsInComposite(c: SerializedComponent) {
        return contentOfComposite(c).filter(
            (child): child is SerializedComponent =>
                typeof child === "object" && isTag(child, "award"),
        );
    }

    /**
     * An `<answer>`'s `<label>` labels its one input when the input is
     * written out and has no label of its own (D66 decision 2, #1674), as it
     * labels an input its sugar adds. The input is marked
     * (`doenetAttributes.labelFromAnswer`, read in `label.ts`). Otherwise the
     * answer's label would not label the input, so a warning
     * (`doenet-w0209`): with more than one input it is shown with the
     * answer's check-work button and labels none of them; with one input
     * that has a label of its own, it is not shown at all.
     */
    function labelTheAnswersInput(answer: SerializedComponent) {
        const found: ReturnType<typeof codedDiagnostic>[] = [];
        const children = answer.children ?? [];
        const label = children.find(
            (child): child is SerializedComponent =>
                typeof child === "object" && isTag(child, "label"),
        );
        if (label === undefined) {
            return found;
        }
        const inputs = children.filter(
            (child): child is SerializedComponent =>
                typeof child === "object" && isTag(child, "_input"),
        );
        if (inputs.length === 0) {
            return found;
        }
        if (inputs.length === 1) {
            const input = inputs[0];
            const ownLabel = (input.children ?? []).some(
                (child) => typeof child === "object" && isTag(child, "label"),
            );
            if (!ownLabel) {
                input.doenetAttributes = {
                    ...input.doenetAttributes,
                    labelFromAnswer: true,
                };
                return found;
            }
        }
        found.push({
            ...codedDiagnostic({
                type: "warning",
                code: "doenet-w0209",
                args: {
                    numInputs: inputs.length,
                    input: tagOfComponent(inputs[0]) ?? "",
                },
            }),
            position: label.position ?? answer.position,
            sourceDoc: label.sourceDoc ?? answer.sourceDoc,
        });
        return found;
    }

    function isBlank(child: SerializedComponent | string) {
        return typeof child === "string" && child.trim() === "";
    }

    for (const answer of answers) {
        diagnostics.push(...labelTheAnswersInput(answer));

        const writtenAttribute: SerializedAttribute | undefined =
            answer.attributes?.type;
        // As written, and as the type it names (`type` declares
        // `toLowerCase` and valid values, which trim). A type named in an
        // attribute is a tag name matched exactly (D63 decision 4): another
        // case is applied for the fallback release, and its `w0197` is
        // still to come (PR 49 of #2509). That is the place to change.
        const writtenRaw =
            writtenAttribute?.type === "primitive"
                ? String(writtenAttribute.primitive.value)
                : undefined;
        const writtenValue = writtenRaw?.trim().toLowerCase();
        // `videoWatched` is made by the parser's sugar, which reads it
        // without case and trimmed (D67 decision 2), as the answer's sugar
        // does.
        if (writtenValue === "videowatched") {
            continue;
        }
        const written: AnswerType | undefined =
            writtenValue === "math" ||
            writtenValue === "text" ||
            writtenValue === "boolean"
                ? writtenValue
                : undefined;
        if (writtenRaw !== undefined && written === undefined) {
            // A `type` that names no type, reported here for every answer,
            // at the attribute (D67 decision 5, DIAG-4). The answer's sugar
            // reads it as a math and reports nothing more.
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
        // The content of each award with content other than one `<when>`, which is
        // compared with the answer's one input; the answer's own content,
        // which its sugar wraps in an award, is one of them.
        const comparedContents: {
            content: (SerializedComponent | string)[];
            at: SerializedComponent;
        }[] = [];

        /**
         * Whether the sugar wraps `child` in an award of its own: not an
         * input, an award, a `<considerAsResponses>`, a `<setup>` (which
         * shows nothing) or a composite holding awards (which expands to
         * them, #1874).
         */
        function isContent(child: SerializedComponent | string) {
            return (
                typeof child !== "object" ||
                !(
                    ["_input", "award", "considerAsResponses", "setup"].some(
                        (tag) => isTag(child, tag),
                    ) || awardsInComposite(child).length > 0
                )
            );
        }

        // Every award of the answer: written in it, or held by a composite
        // written in it.
        const awards: SerializedComponent[] = [];

        function readAward(award: SerializedComponent) {
            awards.push(award);
            const awardChildren: (SerializedComponent | string)[] =
                award.doenetAttributes?.copiedAward?.children ??
                (award.componentType === "award" ? award.children : []) ??
                [];
            const content = awardChildren.filter((c) => !isBlank(c));
            if (content.length > 0 && !isWhen(content)) {
                comparedContents.push({ content, at: award });
            }
        }

        for (const child of sugarChildren) {
            if (typeof child !== "object" || isContent(child)) {
                continue;
            }
            if (isTag(child, "_input")) {
                inputs.push(child);
            } else if (isTag(child, "award")) {
                readAward(child);
            } else {
                awardsInComposite(child).forEach(readAward);
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
            // A `<when>` written in the answer is wrapped in an award as
            // its condition, as one written in an award is.
            if (ownContent.length > 0 && !isWhen(ownContent)) {
                comparedContents.push({ content: ownContent, at: answer });
            }
        }

        /**
         * `content` with each composite written in it replaced by what it
         * expands to (COMP-1), so that content inside a `<group>` is
         * compared as if written in its place (#2657 item 8).
         */
        function expandComposites(
            content: (SerializedComponent | string)[],
        ): (SerializedComponent | string)[] {
            return content.flatMap((c) =>
                typeof c === "object" && isWrittenComposite(c)
                    ? contentOfComposite(c).filter((x) => !isBlank(x))
                    : [c],
            );
        }

        /** The type each typed component of `content` is compared as. */
        function typedContent(content: (SerializedComponent | string)[]) {
            const typed: {
                type: AnswerType;
                tag: string;
                component: SerializedComponent;
            }[] = [];
            for (const c of expandComposites(content)) {
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

        /**
         * Whether the answer's sugar adds an input, with none written in the
         * answer (`mayNeedInput` in `Answer.js`): not with a
         * `<considerAsResponses>`, and only for content that needs one, not
         * a `<booleanList>` (nor an award's `<when>` or `<orbitalDiagram>`),
         * or for an award whose content isn't known. With none added, an
         * award's content is compared with no input.
         */
        function sugarAddsInput() {
            if (
                sugarChildren.some(
                    (child) =>
                        typeof child === "object" &&
                        isTag(child, "considerAsResponses"),
                )
            ) {
                return false;
            }
            const needsInput = (
                content: (SerializedComponent | string)[],
                inAward: boolean,
            ) =>
                content.some((c) =>
                    typeof c === "string"
                        ? c.trim() !== ""
                        : !(
                              isTag(c, "booleanList") ||
                              (inAward &&
                                  (isTag(c, "when") ||
                                      isTag(c, "orbitalDiagram")))
                          ),
                );
            return (
                comparedContents.some(({ content, at }) =>
                    needsInput(content, at !== answer),
                ) ||
                awards.some(
                    (award) =>
                        (
                            award.doenetAttributes?.copiedAward?.children ??
                            (award.componentType === "award"
                                ? award.children
                                : undefined) ??
                            []
                        ).filter(
                            (c: SerializedComponent | string) => !isBlank(c),
                        ).length === 0,
                )
            );
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
                                // quoted as written, trimmed: another case
                                // is not the type (D63 decision 4)
                                typeWritten: writtenRaw!.trim(),
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
            if (comparedContents.length > 0 && sugarAddsInput()) {
                const type = decided ?? "math";
                comparedWith = { tag: ADDED_INPUT[type], type };
            }
        }

        // Written as the sugar reads it, which is exactly (`type="Text"`
        // would be read as no type there). When nothing is decided (more
        // than one input), a written `type` is still written as its keyword.
        const toWrite = decided ?? written;
        if (toWrite !== undefined && toWrite !== writtenRaw) {
            answer.attributes = {
                ...answer.attributes,
                type: {
                    type: "primitive",
                    name: "type",
                    primitive: { type: "string", value: toWrite },
                } as SerializedAttribute,
            };
        }

        // Every award of the answer that isn't its child as written (one held
        // by a composite in it, or an `<award copy>`, whose content is its
        // source's) reads its plain text as the answer's type, as one
        // written in it does through the answer's `type` (#1874, #2657 item
        // 5; `Award.js`).
        if (toWrite !== undefined) {
            for (const award of awards) {
                if (
                    award.componentType === "award" &&
                    (answer.children ?? []).includes(award)
                ) {
                    continue;
                }
                award.attributes = {
                    ...award.attributes,
                    _answerType: {
                        type: "primitive",
                        name: "_answerType",
                        primitive: { type: "string", value: toWrite },
                    } as SerializedAttribute,
                };
            }
        }

        // D55 decision 5: content of another type than the input can never
        // earn credit. Only content that is one component is compared as it
        // is: an award's sugar wraps content of more than one child in the
        // answer's type (`<award><text>x</text>y</award>` is a math "xy" in
        // a math answer), so its typed components are read as that type.
        if (comparedWith !== undefined) {
            for (const { content } of comparedContents) {
                if (expandComposites(content).length !== 1) {
                    continue;
                }
                for (const { type, tag, component } of typedContent(content)) {
                    if (type !== comparedWith.type) {
                        // Its advice resolves a boolean–number mix inside it
                        // too, so that is not also reported (`doenet-w0203`;
                        // D67 decision 3, `booleanNumberMixAtLoad.ts`).
                        component.doenetAttributes = {
                            ...component.doenetAttributes,
                            typeMixReportedAtLoad: true,
                        };
                        diagnostics.push({
                            ...codedDiagnostic({
                                type: "warning",
                                code: "doenet-w0205",
                                args: {
                                    contentType: tag,
                                    // a reference is named by its value
                                    // (D67 decision 4): "`$ti` gives a
                                    // text"
                                    isReference: referenceAsWritten(component)
                                        ? "true"
                                        : "false",
                                    reference: referenceAsWritten(component),
                                    type,
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
                        code: "doenet-w0206",
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
                        code: "doenet-w0207",
                        args: {
                            // the input the answer adds, or none (#2657
                            // item 7)
                            inputAdded: comparedWith ? "true" : "false",
                            input: comparedWith?.tag ?? "",
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
