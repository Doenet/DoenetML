import type { DiagnosticArgs, DiagnosticCode } from "@doenet/i18n";
import { diagnosticCodeFrom } from "../diagnostics";
import { UnflattenedComponent } from "./intermediateTypes";
import { SerializedAttribute, SerializedComponent } from "./types";

/**
 * The `state` an `_error` component carries its diagnostic in: the message it
 * has always held, plus the code naming the situation and the arguments
 * filling that code's message in, when the source was carrying them.
 */
export type ErrorComponentState = {
    message: string;
    code?: DiagnosticCode;
    args?: DiagnosticArgs;
};

/**
 * Build the {@link ErrorComponentState} for an `_error` component.
 *
 * The one definition of that shape, for every place that builds an `_error`
 * out of something that might be carrying a code —
 * {@link convertToErrorComponent}, the parser-error branch of
 * `convertNormalizedDast`, the state-variable queue that
 * `addQueuedErrorComponentsFromStateVariables` drains, the circular-dependency
 * reports in `Copy` and `CompositeExpander`, and `setErrorReplacements`. The
 * component is the only thing carrying the diagnostic to where the builder
 * re-raises it, so a place that forgets the code silently un-translates its
 * error.
 *
 * What is left outside is the `<select>` family's `errorMessage`, a state
 * variable holding a finished English string with no code behind it: routing
 * it through this would add a call that could not do anything. It belongs here
 * once that message migrates to the catalogs (#1518).
 *
 * `source` is whatever the message came from: a caught value (a thrown
 * `DiagnosticError`, a bare `Error`, or a string), a parser `DastError` node,
 * or the diagnostic record the state-variable queue holds. Anything that isn't
 * carrying a registered code contributes nothing, so the result is the bare
 * `{ message }` that these components have always held.
 *
 * The result of `diagnosticCodeFrom` is bound to a local before it is spread
 * rather than spread in place. `lint:i18n` counts a spread of that call, in
 * source text, as a diagnostic-record site that has finished migrating — and
 * this builds *component state*, which is not one. (Same reason
 * `codedDiagnostic` forbids an example call in its own doc comment.)
 */
export function errorComponentState(
    message: string,
    source: unknown,
): ErrorComponentState {
    // Already omits the keys it has nothing for, so nothing here has to.
    const codeAndArgs = diagnosticCodeFrom(source);
    return { message, ...codeAndArgs };
}

/**
 * Given that an error was caught, convert `component` into a
 * `SerializedComponent` of componentType `_error` and also return the error
 * `message` for possible inclusion in error reporting.
 *
 * `eOrMessage` is the caught value itself, or the message a caller has
 * already reduced it to.
 *
 * When the caught value names its diagnostic by code — a `DiagnosticError` —
 * the code and its arguments are carried onto the new component's `state` and
 * returned alongside the message, so the diagnostic the builder re-raises
 * from it is still coded. Without that, an error is the one diagnostic family
 * that cannot survive the trip to the main thread as anything but English:
 * the conversion is lossy, and the code dies here (#1518).
 *
 * A caller that has only a string left to hand over — `ComponentBuilder`
 * re-wrapping a component around a child's `lastErrorMessage`, say — produces
 * an uncoded `_error`, as it always has. Those re-wraps raise no diagnostic of
 * their own (the `_error` they wrap already did), so nothing is lost today
 * beyond the rendered text, which is English either way.
 *
 * The extra `state` keys are inert. Serialized `state` becomes the created
 * component's `essentialState` wholesale, and only keys naming a state
 * variable that asked for an essential value are ever read back — `_error`
 * has neither a `code` nor an `args` variable. Making them `forRenderer`
 * later is what would let the rendered error text be localized too; today
 * only the diagnostic is.
 */
export function convertToErrorComponent(
    component: UnflattenedComponent | SerializedComponent,
    eOrMessage: unknown,
): { component: SerializedComponent } & ErrorComponentState {
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
