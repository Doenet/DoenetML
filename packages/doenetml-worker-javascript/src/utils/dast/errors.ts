import type { DiagnosticArgs, DiagnosticCode } from "@doenet/i18n";
import { diagnosticCodeFrom } from "../diagnostics";
import { UnflattenedComponent } from "./intermediateTypes";
import { SerializedAttribute, SerializedComponent } from "./types";

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

    const { code, args } = diagnosticCodeFrom(eOrMessage);

    const newComponent: SerializedComponent = {
        type: "serialized",
        componentType: "_error",
        componentIdx: component.componentIdx,
        state: {
            message,
            ...(code === undefined ? {} : { code }),
            ...(args === undefined ? {} : { args }),
        },
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

    return {
        component: newComponent,
        message,
        ...(code === undefined ? {} : { code }),
        ...(args === undefined ? {} : { args }),
    };
}
