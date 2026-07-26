import type { DiagnosticArgs, DiagnosticCode } from "@doenet/i18n";
import { diagnosticCodeFrom } from "../diagnostics";
import { UnflattenedComponent } from "./intermediateTypes";
import { SerializedAttribute, SerializedComponent } from "./types";

/**
 * The `state` an `_error` component carries its diagnostic in.
 *
 * The one definition of that shape, because three places build an `_error` —
 * {@link convertToErrorComponent}, the parser-error branch of
 * `convertNormalizedDast`, and the state-variable queue that
 * `addQueuedErrorComponentsFromStateVariables` drains — and the component is
 * the only thing carrying the diagnostic to where the builder re-raises it.
 * A place that forgets the code silently un-translates its error.
 *
 * `source` is whatever the message came from: a thrown `DiagnosticError`, a
 * diagnostic record, or an earlier `_error`'s own state. Anything that isn't
 * carrying a registered code contributes nothing, so the result is the bare
 * `{ message }` that these components have always held.
 *
 * Deliberately not the same expression as the one the diagnostic-record sites
 * spread: this builds *component state*, and `lint:i18n` counts the record
 * form as a migrated call site.
 */
export function errorComponentState(
    message: string,
    source: unknown,
): { message: string; code?: DiagnosticCode; args?: DiagnosticArgs } {
    const { code, args } = diagnosticCodeFrom(source);
    return {
        message,
        ...(code === undefined ? {} : { code }),
        ...(args === undefined ? {} : { args }),
    };
}

/**
 * Given than an error `e` was caught,
 * convert `component` into a `SerializedComponent` of componentType `_error`
 * and also return the error `message` for possible inclusion
 * in error reporting.
 *
 * When the caught value names its diagnostic by code — a `DiagnosticError`,
 * or an earlier `_error`'s state being converted a second time — the code and
 * its arguments are carried onto the new component's `state` and returned
 * alongside the message, so the diagnostic the builder re-raises from it is
 * still coded. Without that, an error is the one diagnostic family that
 * cannot survive the trip to the main thread as anything but English: the
 * conversion is lossy, and the code dies here (#1518).
 *
 * The extra `state` keys are inert. Serialized `state` becomes the created
 * component's `essentialState` wholesale, and only keys naming a state
 * variable that asked for an essential value are ever read back — `_error`
 * declares `message` and nothing else, so `code` and `args` sit alongside the
 * `unresolvedPath` this function's callers have long put there. Making them
 * `forRenderer` later is what would let the rendered error text be localized
 * too; today only the diagnostic is.
 */
export function convertToErrorComponent(
    component: UnflattenedComponent | SerializedComponent,
    eOrMessage: unknown,
): {
    component: SerializedComponent;
    message: string;
    code?: DiagnosticCode;
    args?: DiagnosticArgs;
} {
    const message =
        typeof eOrMessage === "string"
            ? eOrMessage
            : typeof eOrMessage === "object" &&
                eOrMessage !== null &&
                "message" in eOrMessage &&
                typeof eOrMessage.message === "string"
              ? eOrMessage.message
              : "An error occurred";

    const state = errorComponentState(message, eOrMessage);

    const newComponent: SerializedComponent = {
        type: "serialized",
        componentType: "_error",
        componentIdx: component.componentIdx,
        state,
        children: [],
        attributes: {},
        doenetAttributes: {},
        position: component.position,
        sourceDoc: component.sourceDoc,
    };

    if (component.attributes.name) {
        let nameAttribute: SerializedAttribute | undefined;
        if (component.type === "serialized") {
            nameAttribute = component.attributes.name;
        } else {
            if (
                component.attributes.name.children?.length === 1 &&
                typeof component.attributes.name.children[0] === "string"
            ) {
                nameAttribute = {
                    type: "primitive",
                    name: "name",
                    primitive: {
                        type: "string",
                        value: component.attributes.name.children[0],
                    },
                };
            }
        }
        if (nameAttribute) {
            newComponent.attributes.name = nameAttribute;
        }
    }

    // The same `{message, code?, args?}` the component holds, so the record a
    // caller builds from this result is the diagnostic the builder will
    // eventually re-raise from the component.
    return { component: newComponent, ...state };
}
