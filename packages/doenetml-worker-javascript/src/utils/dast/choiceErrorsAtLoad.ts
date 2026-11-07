/**
 * The errors of a choosing tag that its literals decide, reported when the
 * document loads (DIAG-7, D38, #2463): a `<select>` whose `numToSelect` and
 * `withReplacement` are written as literals, with more to select than it has
 * options written in it (`doenet-e0035`).
 *
 * Such a select fails in every variant, so the error is decided by the
 * DoenetML (REF-5's "`numToSelect` written as `1`" is the model). The select
 * reports it when it is made, but in a case not yet true, an iteration not
 * yet made or an option not picked, that is only after an interaction, so
 * it is reported here too, wherever the select is. When the select is made,
 * it reports the same error, which is kept once.
 *
 * A select whose options say which variants pick them (`selectForVariants`)
 * is left to run time: a variant that names one of them takes it, and does
 * not count options.
 */
import type { SerializedComponent } from "./types";
import { codedDiagnostic } from "../diagnostics";
import { isCopiedOption, optionWrittenInDoenetML } from "../selectErrors";

export function checkChoiceErrorsAtLoad({
    serializedComponents,
}: {
    serializedComponents: (SerializedComponent | string)[];
}) {
    const diagnostics: any[] = [];
    const seen = new Set<SerializedComponent>();

    function visit(components: (SerializedComponent | string)[]) {
        for (const component of components) {
            if (typeof component !== "object" || seen.has(component)) {
                continue;
            }
            seen.add(component);
            if (component.componentType === "select") {
                const error = selectError(component);
                if (error) {
                    diagnostics.push({
                        ...error,
                        position: component.position,
                        sourceDoc: component.sourceDoc,
                    });
                }
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
    return diagnostics;
}

/** `doenet-e0035` of the `<select>` `select`, when its literals decide it. */
function selectError(select: SerializedComponent) {
    const numToSelect = literalOf(select, "numToSelect");
    const withReplacement = literalOf(select, "withReplacement");
    if (numToSelect === null || withReplacement === null) {
        return undefined;
    }
    // `numToSelect` is an integer, which rounds what is written (`2.5` is
    // 3), as the select does when it is made.
    const numUniqueRequired =
        numToSelect === undefined ? 1 : Math.round(Number(numToSelect));
    if (!Number.isInteger(numUniqueRequired) || numUniqueRequired < 1) {
        return undefined;
    }
    // Written bare, `withReplacement` is `"true"` by now; written as `""`,
    // it is false, as the select reads it.
    const replacement =
        withReplacement !== undefined &&
        withReplacement.toLowerCase() === "true";
    if (replacement) {
        return undefined;
    }
    const options: SerializedComponent[] = [];
    for (const child of select.children ?? []) {
        if (typeof child === "string") {
            if (child.trim() !== "") {
                return undefined;
            }
            continue;
        }
        if (
            !(child.componentType === "option" || isCopiedOption(child)) ||
            !optionWrittenInDoenetML(child)
        ) {
            return undefined;
        }
        options.push(child);
    }
    if (
        options.some((option) =>
            Object.keys(option.attributes ?? {}).some(
                (name) => name.toLowerCase() === "selectforvariants",
            ),
        )
    ) {
        return undefined;
    }
    if (numUniqueRequired <= options.length) {
        return undefined;
    }
    return codedDiagnostic({
        type: "error",
        code: "doenet-e0035",
        args: {
            numToSelect: numUniqueRequired,
            numOptions: options.length,
        },
    });
}

/**
 * The text the attribute `name` of `component` is written as, matched
 * ignoring case: `undefined` when it is not written, and `null` when it is
 * not only text (a reference, an expression), so a value decides it.
 */
function literalOf(
    component: SerializedComponent,
    name: string,
): string | undefined | null {
    const lower = name.toLowerCase();
    for (const [attrName, attribute] of Object.entries(
        component.attributes ?? {},
    )) {
        if (attrName.toLowerCase() !== lower) {
            continue;
        }
        const attr: any = attribute;
        if (attr.type === "primitive") {
            return String(attr.primitive.value);
        }
        // a literal already read as its value (`withReplacement="false"`)
        const state =
            attr.type === "component" ? attr.component?.state : undefined;
        if (
            state &&
            "value" in state &&
            (attr.component.children ?? []).length === 0
        ) {
            return String(state.value);
        }
        const children =
            attr.type === "component"
                ? attr.component?.children
                : attr.children;
        if (
            Array.isArray(children) &&
            children.every((child: unknown) => typeof child === "string")
        ) {
            return children.join("").trim();
        }
        return null;
    }
    return undefined;
}
