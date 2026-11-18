/**
 * The error of a `<sort>` or `<shuffle>` whose items are not of one type,
 * decided at load (`utils/dast/reorderedItemsAtLoad.ts`), and what it shows
 * in place of its items.
 */
import { codedDiagnostic } from "./diagnostics";
import { errorComponentState } from "./dast/errors";

/** What `doenetAttributes.reorderErrorAtLoad` holds. */
export type ReorderErrorAtLoad = {
    code: "doenet-e0076" | "doenet-e0077" | "doenet-e0080";
    args: Record<string, string | number>;
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
 * The replacements of a `<sort>` or `<shuffle>` marked with its error at
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
            },
        ],
        diagnostics: [],
        nComponents,
    };
}
