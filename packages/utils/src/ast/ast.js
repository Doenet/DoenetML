export function convertToErrorComponent(component, message) {
    if (typeof component === "object") {
        component.doenetAttributes = {
            createNameFromComponentType: component.componentType,
        };
        component.componentType = "_error";
        component.state = { message };

        // If a name was supplied, we'll have the error keep that name.
        // Note: at the point where this function is called, the name may have already been extracted,
        // so this condition doesn't do anything there.
        if (component.props.name) {
            component.props = { name: component.props.name };
        } else {
            delete component.props;
        }
        component.attributes = {};
    }
}

export function countComponentTypes(serializedComponents) {
    // Count component types from the components in the array (not recursing to children).
    // Used for counting the sections in a document in order to increment section counts
    // subsequent pages.

    let componentTypeCounts = {};

    for (let component of serializedComponents) {
        if (typeof component === "object") {
            let cType = component.componentType;
            let numComponents = 1;
            if (component.attributes?.createComponentOfType?.primitive) {
                cType = component.attributes.createComponentOfType.primitive;
                numComponents = component.attributes.numComponents?.primitive;
                if (!(Number.isInteger(numComponents) && numComponents > 0)) {
                    numComponents = 1;
                }
            }
            if (cType in componentTypeCounts) {
                componentTypeCounts[cType] += numComponents;
            } else {
                componentTypeCounts[cType] = numComponents;
            }
        }
    }

    return componentTypeCounts;
}
