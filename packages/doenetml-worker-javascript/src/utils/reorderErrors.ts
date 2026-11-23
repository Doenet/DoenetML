/**
 * The error of a `<sort>` or `<shuffle>` whose items are not of one type, or
 * of a `<repeat>` whose `for` does not hold one type, decided at load
 * (`utils/dast/reorderedItemsAtLoad.ts`), and what it shows in place of its
 * items.
 */
import { codedDiagnostic } from "./diagnostics";
import { errorComponentState } from "./dast/errors";

/** What `doenetAttributes.reorderErrorAtLoad` holds. */
export type ReorderErrorAtLoad = {
    code: "doenet-e0076" | "doenet-e0077" | "doenet-e0080" | "doenet-e0081";
    args: Record<string, string | number>;
    /**
     * Where the error is reported, when not at the component: a
     * `<repeat>`'s at its `for`.
     */
    position?: any;
};

/** The error diagnostic of the mark `mark`. */
export function reorderErrorDiagnostic(mark: ReorderErrorAtLoad) {
    return codedDiagnostic({
        type: "error",
        code: mark.code,
        args: mark.args as any,
    });
}

/**
 * The replacements of a `<sort>`, `<shuffle>` or `<repeat>` marked with its error at
 * load (`component.doenetAttributes.reorderErrorAtLoad`): the error, in place
 * of its items, as the same diagnostic, kept once. `undefined` for one not
 * marked.
 */
export function reorderErrorReplacements({
    component,
    nComponents,
}: {
    component: any;
    nComponents: number;
}) {
    const mark: ReorderErrorAtLoad | undefined =
        component.doenetAttributes?.reorderErrorAtLoad;
    if (!mark) {
        return undefined;
    }
    const diagnostic = reorderErrorDiagnostic(mark);
    return {
        replacements: [
            {
                type: "serialized",
                componentType: "_error",
                componentIdx: nComponents++,
                state: errorComponentState(diagnostic.message, diagnostic),
                attributes: {},
                doenetAttributes: {},
                children: [],
                ...(mark.position !== undefined && {
                    position: mark.position,
                    sourceDoc: component.sourceDoc,
                }),
            },
        ],
        diagnostics: [],
        nComponents,
    };
}
