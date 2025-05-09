import { UnflattenedComponent } from "./intermediateTypes";
import { SerializedAttribute, SerializedComponent } from "./types";

/**
 * Given than an error `e` was caught,
 * convert `component` into a `SerializedComponent` of componentType `_error`
 * and also return the error `message` for possible inclusion
 * in error reporting.
 */
export function convertToErrorComponent(
    component: UnflattenedComponent | SerializedComponent,
    eOrMessage: unknown,
): { component: SerializedComponent; message: string } {
    const message =
        typeof eOrMessage === "string"
            ? eOrMessage
            : typeof eOrMessage === "object" &&
                eOrMessage !== null &&
                "message" in eOrMessage &&
                typeof eOrMessage.message === "string"
              ? eOrMessage.message
              : "An error occurred";

    const newComponent: SerializedComponent = {
        type: "serialized",
        componentType: "_error",
        componentIdx: component.componentIdx,
        state: { message },
        children: [],
        attributes: {},
        doenetAttributes: {},
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

    return { component: newComponent, message };
}
