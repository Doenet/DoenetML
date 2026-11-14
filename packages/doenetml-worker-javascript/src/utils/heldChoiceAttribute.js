/**
 * An attribute deciding what a choosing tag chooses
 * (`attributesDeterminingChoices`), held at the value its source chose with
 * where a module attribute written on a `copyWithState` of a `<module>`
 * reaches it (`keepChoicesReachedByModuleAttributes` in
 * `components/abstract/Copy.js`, `doenet-w0186`, D33).
 */
import { deepClone } from "@doenet/utils";
import { splitListText } from "@doenet/parser/list-separation";

/**
 * The value of the attribute component `component` as text it reads back
 * as that value: a single value (`value`), or the entries of a list, of a
 * list component (`<numberList>`, `<mathList>`, `<textList>`, ...) or of
 * the list of a sequence's type (`_componentListWithSelectableType`, the
 * `exclude` of a `<selectFromSequence>`) (#2477 item 2). A list's text is
 * read by the one rule for lists (`splitListText`, #2492): at commas outside
 * brackets if there is one, at spaces otherwise. Its entries are written
 * separated by spaces, or else by commas, whichever that rule reads back as
 * the same entries. `undefined` when neither does (an entry holding a comma
 * outside brackets, or a single entry whose text holds a space, as `2x`
 * written `2 x`), and for any other value, which is then not held.
 */
export async function valueAsWritten(component) {
    const value = await component?.stateValues?.value;
    if (value !== undefined && value !== null) {
        return typeof value === "object" ? value.toString() : String(value);
    }
    const entries = await listEntriesOf(component);
    if (!entries) {
        return undefined;
    }
    const texts = entries.map((entry) =>
        (typeof entry === "object" && entry !== null
            ? entry.toString()
            : String(entry)
        ).trim(),
    );
    for (const separator of [" ", ", "]) {
        const text = texts.join(separator);
        const read = splitListText(text);
        if (
            !read.unmatchedBrackets &&
            read.entries.length === texts.length &&
            read.entries.every((entry, ind) => entry.trim() === texts[ind])
        ) {
            return text;
        }
    }
    return undefined;
}

/**
 * The type of list component that holds the value of `component` written
 * as text (`valueAsWritten`) when `component` is the list of a sequence's
 * type (`_componentListWithSelectableType`), whose entries' type is that of
 * the sequence: a `<numberList>`, `<mathList>`, `<textList>` or
 * `<booleanList>`. `undefined` for any other component, whose own children
 * the text is written as (`holdAttributeComponentAt`).
 */
export async function listTypeAsWritten(component) {
    if (component?.componentType === "_selectionParameter") {
        // a compiled parameter (`utils/selectionParameters.ts`) that is a
        // list, of what its output is
        const parameter = component.doenetAttributes?.selectionParameter;
        if (parameter?.kind !== "list") {
            return undefined;
        }
        return (
            { number: "numberList", math: "mathList", text: "textList" }[
                parameter.output
            ] ?? "numberList"
        );
    }
    if (component?.componentType !== "_componentListWithSelectableType") {
        return undefined;
    }
    const type = await component.stateValues.type;
    return (
        {
            number: "numberList",
            math: "mathList",
            text: "textList",
            letters: "textList",
            boolean: "booleanList",
        }[type] ?? "numberList"
    );
}

/**
 * The entries of `component` when it is a list: a list component's values
 * (`listValuesArrayName`), or the values of the list of a sequence's type
 * (`_componentListWithSelectableType`). `undefined` otherwise.
 */
async function listEntriesOf(component) {
    if (!component) {
        return undefined;
    }
    if (
        component.componentType === "_componentListWithSelectableType" ||
        (component.componentType === "_selectionParameter" &&
            component.doenetAttributes?.selectionParameter?.kind === "list")
    ) {
        return await component.stateValues.values;
    }
    const arrayName = component.constructor?.listValuesArrayName;
    if (
        arrayName &&
        component.constructor.listEntryComponentType !== undefined &&
        arrayName in component.state
    ) {
        return await component.stateValues[arrayName];
    }
    return undefined;
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
    listType,
}) {
    attribute.authoredComponent = deepClone(attribute.component);
    delete attribute.keepSourceIterationValue;
    if (attribute.component?.componentType === "_selectionParameter") {
        attribute.component = attributeComponentInPlaceOf(attribute.component);
    }
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
    // `<selectFromSequence>`), the component of that type it wraps. A list
    // of a selectable type (`exclude`, `listType`) is written to as it is,
    // as what it wraps can be one reference giving all of its entries.
    let attributeComponent = attribute.component;
    const isListWrapper = listType !== undefined;
    while (
        !isListWrapper &&
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
    // a list of a selectable type keeps its `type`, of its entries
    attributeComponent.attributes = isListWrapper
        ? Object.fromEntries(
              Object.entries(attributeComponent.attributes ?? {}).filter(
                  ([name]) => name === "type",
              ),
          )
        : {};
    attributeComponent.state = {};
    // A list of a selectable type reads its children with sugar, which has
    // been applied, so the text is given as a list of its entries' type,
    // which reads it (`listTypeAsWritten`). The list takes the place, and
    // the index, of the first component the wrapper held: what refers to the
    // module attribute.
    const firstComponent = isListWrapper
        ? attributeComponent.children?.find(
              (child) => typeof child === "object" && child !== null,
          )
        : undefined;
    attributeComponent.children = firstComponent
        ? [
              {
                  type: "serialized",
                  componentType: listType,
                  componentIdx: firstComponent.componentIdx,
                  stateId: firstComponent.stateId,
                  sourceDoc: firstComponent.sourceDoc,
                  attributes: {},
                  doenetAttributes: {},
                  state: {},
                  children: [text],
              },
          ]
        : [text];
}

/**
 * The attribute component a compiled selection parameter
 * (`utils/selectionParameters.ts`) was made in place of, of the type it was
 * (`attributeComponentType`), holding nothing yet, for the value to be
 * written in it as in any other (`holdAttributeComponentAt`): a parameter
 * held at a value is that value, written.
 */
function attributeComponentInPlaceOf(component) {
    const parameter = component.doenetAttributes?.selectionParameter;
    const componentType =
        component.doenetAttributes?.attributeComponentType ?? "math";
    const valueType =
        parameter?.output === "text"
            ? "text"
            : parameter?.output === "math"
              ? "math"
              : "number";
    const shell = (type, children) => ({
        type: "serialized",
        componentType: type,
        componentIdx: component.componentIdx,
        stateId: component.stateId,
        ...(component.sourceDoc !== undefined
            ? { sourceDoc: component.sourceDoc }
            : {}),
        attributes: {},
        doenetAttributes: {},
        state: {},
        children,
    });
    // what it holds first takes the index of its first slot, as what the
    // attribute component held took its own
    const firstSlot = (component.children ?? []).find(
        (child) => typeof child === "object" && child !== null,
    );
    const inner = (type) => ({
        ...shell(type, []),
        componentIdx: firstSlot?.componentIdx,
        stateId: firstSlot?.stateId,
    });
    if (componentType === "_componentWithSelectableType") {
        return shell(componentType, [inner(valueType)]);
    }
    if (parameter?.kind === "list") {
        // a list is written to through what it holds first
        return shell(componentType, [inner("_copy")]);
    }
    return shell(componentType, []);
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
