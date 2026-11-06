/**
 * An attribute deciding what a choosing tag chooses
 * (`attributesDeterminingChoices`), held at the value its source chose with
 * where a module attribute written on a `copyWithState` of a `<module>`
 * reaches it (`keepChoicesReachedByModuleAttributes` in
 * `components/abstract/Copy.js`, `doenet-w0186`, D33).
 */
import { deepClone } from "@doenet/utils";

/**
 * The value of the attribute component `component` as text it reads back
 * as that value: a single value (`value`), or the numbers of a
 * `<numberList>` (`numbers`), separated by spaces. `undefined` for any
 * other (as a list of another type, as the `exclude` of a
 * `<selectFromSequence>`), which is not read from text once the document
 * is loaded.
 */
export async function valueAsWritten(component) {
    const value = await component?.stateValues?.value;
    if (value !== undefined && value !== null) {
        return typeof value === "object" ? value.toString() : String(value);
    }
    const numbers =
        component?.componentType === "numberList"
            ? await component.stateValues.numbers
            : undefined;
    return numbers?.map(String).join(" ");
}

/**
 * Write the value `text` in place of what the serialized attribute
 * `attribute` (of type `component`) computes its value from. What was
 * written is kept (`authoredComponent`), which a `copy` of it, writing its
 * DoenetML again, is given in place of the value (`serialize`,
 * `withoutReaderState`), so it computes it from what it is given.
 */
export function holdAttributeComponentAt({
    attribute,
    text,
    componentInfoObjects,
}) {
    attribute.authoredComponent = deepClone(attribute.component);
    delete attribute.keepSourceIterationValue;
    const selectableClass =
        componentInfoObjects.allComponentClasses._componentWithSelectableType;
    function isSelectableTypeWrapper(component) {
        const componentClass =
            componentInfoObjects.allComponentClasses[component.componentType];
        return (
            selectableClass !== undefined &&
            componentClass !== undefined &&
            (componentClass === selectableClass ||
                componentClass.prototype instanceof selectableClass)
        );
    }
    // of an attribute of a selectable type (`from` of a
    // `<selectFromSequence>`), the component of that type it wraps
    let attributeComponent = attribute.component;
    while (
        isSelectableTypeWrapper(attributeComponent) &&
        attributeComponent.children?.length === 1 &&
        typeof attributeComponent.children[0] === "object"
    ) {
        attributeComponent = attributeComponent.children[0];
    }
    // the value, written in place of what refers to the module attribute (a
    // value reference, `_ref`, of the type it is presented as, when it is
    // only the reference)
    const presentedType =
        attributeComponent.doenetAttributes?.presentedComponentType;
    if (
        ["_ref", "_copy"].includes(attributeComponent.componentType) &&
        presentedType
    ) {
        attributeComponent.componentType = presentedType;
    }
    delete attributeComponent.extending;
    attributeComponent.attributes = {};
    attributeComponent.state = {};
    attributeComponent.children = [text];
}

/**
 * Write the value `text` in place of what the unresolved attribute
 * `attribute` of a choosing tag written with `copy` or `extend` (a `_copy`,
 * which gives it to what it makes) holds. What was written is kept
 * (`authoredChildren`), which a `copy` of it is given in place of the value
 * (`serialize`, `withoutReaderState`).
 */
export function holdUnresolvedAttributeAt({ attribute, text }) {
    attribute.authoredChildren = deepClone(attribute.children);
    delete attribute.keepSourceIterationValue;
    attribute.children = [text];
}
