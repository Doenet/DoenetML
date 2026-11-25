/**
 * `numItems`: the number of items an index selects among, a property of
 * every collection however it is built (COLL-2, D41 decision 2). A
 * collection's own properties are a fixed set: `numItems` and the settings
 * every component has. They win over the items' properties of the same name.
 */

/**
 * The settings every component has (`BaseComponent.js`) that are a
 * collection's own, as `numItems` is (COLL-2): a property after a collection
 * reads them of the collection, not of each item.
 */
export const COLLECTION_OWN_SETTINGS = [
    "hide",
    "hidden",
    "disabled",
    "fixed",
    "fixLocation",
];

/**
 * The definition of the public state variable `numItems`, the number of
 * items of a collection, computed by `count` from the state variable
 * `variableName` of the collection.
 */
export function numItemsDefinition({
    variableName,
    count = (value: any) => (Array.isArray(value) ? value.length : 0),
}: {
    variableName: string;
    count?: (value: any) => number;
}) {
    return {
        public: true,
        description:
            "The number of items, which an index selects among (`$c[2]` is item 2).",
        shadowingInstructions: {
            createComponentOfType: "integer",
        },
        returnDependencies: () => ({
            source: {
                dependencyType: "stateVariable",
                variableName,
            },
        }),
        definition: ({ dependencyValues }: any) => ({
            setValue: { numItems: count(dependencyValues.source) },
        }),
    };
}

/**
 * The number display settings, which a list's entries take from the list and
 * a property after the list reads of each entry (`$ml.displayDigits`), and
 * which are copied from a list to an entry a reference makes (`$ml[2]`,
 * `addShadowNumberDisplayAttributes`), so they stay public on the list.
 */
const NUMBER_DISPLAY_SETTINGS = [
    "displaydigits",
    "displaydecimals",
    "displaysmallaszero",
    "padzeros",
    "avoidscientificnotation",
];

const attributeNamesNotPropertiesByClass = new WeakMap<any, Set<string>>();

/**
 * The names, in lower case, of the state variables of a component of class
 * `componentClass` that are its attributes and so not properties an author
 * reads (D41 decision 2, COLL-2): a collection's attributes are not
 * properties, so that adding one never shadows the items' properties
 * (`$c.maxNumber` of a `<collect>` of points is each point's `maxNumber`,
 * which a point does not have). A class that is a collection says so with
 * `attributesAreProperties = false`. An attribute is a state variable an
 * attribute creates, or a state variable named as an attribute is
 * (`unordered`). The settings every component has (the attributes of
 * `BaseComponent`), the number display settings, and those a class keeps
 * (`attributePropertiesKept`, documented as properties for authors, such as
 * a `<tally>`'s `categories`) stay properties.
 */
export function attributeNamesNotProperties(componentClass: any): Set<string> {
    let names = attributeNamesNotPropertiesByClass.get(componentClass);
    if (names) {
        return names;
    }
    names = new Set<string>();
    if (componentClass.attributesAreProperties === false) {
        let rootClass = componentClass;
        while (Object.getPrototypeOf(rootClass)?.createAttributesObject) {
            rootClass = Object.getPrototypeOf(rootClass);
        }
        const kept = new Set<string>([
            ...Object.keys(rootClass.createAttributesObject()).map((name) =>
                name.toLowerCase(),
            ),
            ...NUMBER_DISPLAY_SETTINGS,
            ...(componentClass.attributePropertiesKept ?? []).map(
                (name: string) => name.toLowerCase(),
            ),
        ]);
        const attributes = componentClass.createAttributesObject();
        for (const attributeName in attributes) {
            if (kept.has(attributeName.toLowerCase())) {
                continue;
            }
            names.add(attributeName.toLowerCase());
            const variableName = attributes[attributeName].createStateVariable;
            if (variableName && !kept.has(variableName.toLowerCase())) {
                names.add(variableName.toLowerCase());
            }
        }
    }
    attributeNamesNotPropertiesByClass.set(componentClass, names);
    return names;
}

/**
 * The attributes object `attributes` of `componentClass`, with the
 * attributes that are not properties ({@link attributeNamesNotProperties})
 * no longer public, so the state variables they create are not.
 */
export function attributesAsProperties<T extends Record<string, any>>(
    componentClass: any,
    attributes: T,
): T {
    const notProperties = attributeNamesNotProperties(componentClass);
    if (notProperties.size === 0) {
        return attributes;
    }
    for (const name in attributes) {
        const attribute = attributes[name];
        if (attribute?.public && notProperties.has(name.toLowerCase())) {
            (attributes as Record<string, any>)[name] = {
                ...attribute,
                public: false,
            };
        }
    }
    return attributes;
}

/**
 * Make private the state variables in `stateVariableDefinitions` of
 * `componentClass` that are its attributes, not properties
 * ({@link attributeNamesNotProperties}). Internal code reads them as before.
 */
export function stateVariablesAsProperties(
    componentClass: any,
    stateVariableDefinitions: Record<string, any>,
) {
    const notProperties = attributeNamesNotProperties(componentClass);
    if (notProperties.size === 0) {
        return;
    }
    for (const name in stateVariableDefinitions) {
        const definition = stateVariableDefinitions[name];
        if (
            definition?.public &&
            !definition.isAlias &&
            notProperties.has(name.toLowerCase())
        ) {
            stateVariableDefinitions[name] = { ...definition, public: false };
        }
    }
}

/**
 * The names of the public state variables of a component of class
 * `componentClass`: those it defines, and those its attributes create.
 */
function publicVariablesOf(componentClass: any): Set<string> {
    const names = new Set<string>();
    const definitions = componentClass.returnStateVariableDefinitions();
    stateVariablesAsProperties(componentClass, definitions);
    for (const name in definitions) {
        if (definitions[name].public) {
            names.add(name);
        }
    }
    const attributes = attributesAsProperties(
        componentClass,
        componentClass.createAttributesObject(),
    );
    for (const name in attributes) {
        const { createStateVariable, public: isPublic } = attributes[name];
        if (createStateVariable && isPublic) {
            names.add(createStateVariable);
        }
    }
    return names;
}

const publicVariablesByClass = new WeakMap<any, Set<string>>();

/**
 * The properties of its own that a collection built as the composite
 * `compositeClass` has: its public state variables (`numItems`, the settings
 * every component has, and any other it keeps public; a `<collect>`'s
 * attributes, such as `maxNumber`, are not among them).
 */
export function ownPropertiesOfComposite(compositeClass: any): Set<string> {
    let compositeVariables = publicVariablesByClass.get(compositeClass);
    if (!compositeVariables) {
        compositeVariables = publicVariablesOf(compositeClass);
        for (const name of COLLECTION_OWN_SETTINGS) {
            compositeVariables.add(name);
        }
        publicVariablesByClass.set(compositeClass, compositeVariables);
    }
    return compositeVariables;
}

/**
 * Make a list form of a collection (the list a `<collect>`, `<sort>`,
 * `<shuffle>` or `<repeat>` is built as) have the same properties of its own
 * as the composite it otherwise is, `compositeClass` (COMP-4, COLL-2): every
 * public state variable the list it is built on has, beyond those of the
 * composite, is made private, so that the count's older names a list has
 * (`numComponents`, `numValues`, and with them their aliases `numPoints`,
 * `numVectors`, `numIntervals`) and a list's attributes (`unordered`,
 * `maxNumber`) name nothing, as after the composite. A property of the
 * entries is read entry by entry either way (`listEntryPropertyPath`), and
 * the list reads its own properties (`listOwnProperties`) from the
 * composite's ({@link listOwnPropertiesOfComposite}).
 */
export function keepOnlyPropertiesOfComposite(
    stateVariableDefinitions: Record<string, any>,
    compositeClass: any,
) {
    const own = ownPropertiesOfComposite(compositeClass);
    for (const name in stateVariableDefinitions) {
        const definition = stateVariableDefinitions[name];
        if (definition.public && !own.has(name)) {
            stateVariableDefinitions[name] = { ...definition, public: false };
        }
    }
}

/**
 * The same as {@link keepOnlyPropertiesOfComposite}, for the state variables
 * the attributes of a list form of a collection create.
 */
export function keepOnlyAttributePropertiesOfComposite(
    attributes: Record<string, any>,
    compositeClass: any,
) {
    const own = ownPropertiesOfComposite(compositeClass);
    for (const name in attributes) {
        const attribute = attributes[name];
        if (
            attribute.public &&
            !own.has(attribute.createStateVariable ?? name)
        ) {
            attributes[name] = { ...attribute, public: false };
        }
    }
}

/**
 * The properties a reference to the whole list form of a collection reads of
 * the list itself, not entry by entry: those the composite it otherwise is
 * has of its own, so that the two builds agree (COMP-4).
 */
export function listOwnPropertiesOfComposite(compositeClass: any): string[] {
    return [...ownPropertiesOfComposite(compositeClass)];
}

/**
 * Make the settings every component has the collection's own, as
 * `numItems` is (COLL-2): `CompositeComponent.js` keeps them private so that
 * a property after a composite passes into what it holds, and a collection
 * reads them of itself (`$r.fixed` is the repeat's, not each item's).
 */
export function makeCollectionSettingsOwn(
    stateVariableDefinitions: Record<string, any>,
) {
    for (const name of COLLECTION_OWN_SETTINGS) {
        const definition = stateVariableDefinitions[name];
        if (definition && !definition.public) {
            stateVariableDefinitions[name] = { ...definition, public: true };
        }
    }
}

/**
 * Whether `component` shows one thing and is not a collection (D72,
 * COLL-1): a `<conditionalContent>`, or a chooser or sampler written to pick
 * one (`onePick`, marked at load by `markOnePickChoosers`, and for a tag
 * written with `copy` by `decideOnePickOfCopy` in `Copy.js`). It stands for
 * what it shows: it has no `numItems`, and an index after it reaches into
 * what it shows.
 */
export function showsOneThing(component: any): boolean {
    return (
        component?.componentType === "conditionalContent" ||
        component?.doenetAttributes?.onePick === true
    );
}

/**
 * Whether the property `propName` after `component` is not its own though
 * its class has it public: the `numItems` of a component that shows one
 * thing ({@link showsOneThing}, D72), which passes to what it shows.
 */
export function propertyNotOwnOf(component: any, propName: string): boolean {
    return (
        typeof propName === "string" &&
        propName.toLowerCase() === "numitems" &&
        showsOneThing(component)
    );
}
