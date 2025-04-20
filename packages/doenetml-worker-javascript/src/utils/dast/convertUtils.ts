import { ComponentInfoObjects } from "../componentInfoObjects";
import { SerializedComponent } from "./types";

/**
 * Unless a component's class specifies `includeBlankStringChildren`,
 * remove all string children that consist solely of whitespace.
 */
export function removeBlankStringChildren(
    serializedComponents: (string | SerializedComponent)[],
    componentInfoObjects: ComponentInfoObjects,
) {
    const newComponents: (string | SerializedComponent)[] = [];
    for (let component of serializedComponents) {
        if (typeof component === "string") {
            newComponents.push(component);
        } else {
            const newComponent = { ...component };
            let componentClass =
                componentInfoObjects.allComponentClasses[
                    component.componentType
                ];
            if (componentClass && !componentClass.includeBlankStringChildren) {
                newComponent.children = component.children.filter(
                    (x) => typeof x !== "string" || x.trim() !== "",
                );
            }

            newComponent.children = removeBlankStringChildren(
                newComponent.children,
                componentInfoObjects,
            );

            // TODO: do we also need to remove blank string components
            // from childrenForFutureComponent of an attribute that is not yet a component?
            newComponent.attributes = { ...newComponent.attributes };
            for (let attrName in newComponent.attributes) {
                const attribute = { ...newComponent.attributes[attrName] };
                if (attribute.type === "component") {
                    attribute.component = removeBlankStringChildren(
                        [attribute.component],
                        componentInfoObjects,
                    )[0] as SerializedComponent;
                    newComponent.attributes[attrName] = attribute;
                }
            }

            newComponents.push(newComponent);
        }
    }

    return newComponents;
}

/**
 * Convert a set of XML entities to their string values
 */
export function decodeXMLEntities(
    serializedComponents: (string | SerializedComponent)[],
): (string | SerializedComponent)[] {
    function replaceEntities(s: string) {
        return s
            .replace(/&apos;/g, "'")
            .replace(/&quot;/g, '"')
            .replace(/&gt;/g, ">")
            .replace(/&lt;/g, "<")
            .replace(/&dollar;/g, "$")
            .replace(/&amp;/g, "&");
    }

    const newComponents: (string | SerializedComponent)[] = [];

    for (let component of serializedComponents) {
        if (typeof component === "string") {
            newComponents.push(replaceEntities(component));
        } else {
            const newComponent = { ...component };
            newComponent.children = decodeXMLEntities(component.children);

            const attributes = { ...component.attributes };
            for (let attrName in attributes) {
                let attribute = { ...attributes[attrName] };

                if (attribute.type === "component") {
                    attribute.component = decodeXMLEntities([
                        attribute.component,
                    ])[0] as SerializedComponent;
                } else if (attribute.type === "primitive") {
                    if (attribute.primitive.type === "string") {
                        attribute.primitive.value = replaceEntities(
                            attribute.primitive.value,
                        );
                    }
                } else {
                    attribute.childrenForFutureComponent = decodeXMLEntities(
                        attribute.childrenForFutureComponent,
                    );
                }
                attributes[attrName] = attribute;
            }
            newComponent.attributes = attributes;
            newComponents.push(newComponent);
        }
    }

    return newComponents;
}
