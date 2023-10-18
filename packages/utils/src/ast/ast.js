export function extractComponentNamesAndIndices(
    serializedComponents,
    nameSubstitutions = {},
) {
    let componentArray = [];

    for (let serializedComponent of serializedComponents) {
        if (typeof serializedComponent === "object") {
            let componentName = serializedComponent.componentName;
            for (let originalName in nameSubstitutions) {
                componentName = componentName.replace(
                    originalName,
                    nameSubstitutions[originalName],
                );
            }
            if (serializedComponent.doenetAttributes?.fromCopyTarget) {
                let lastSlash = componentName.lastIndexOf("/");
                let originalName = componentName.slice(lastSlash + 1);
                let newName =
                    serializedComponent.doenetAttributes
                        .assignNamesForCompositeReplacement;
                if (!newName) {
                    newName =
                        serializedComponent.doenetAttributes.assignNames[0];
                }
                componentName = componentName.replace(originalName, newName);
                nameSubstitutions[originalName] = newName;
            }
            let componentObj = {
                componentName,
            };
            if (serializedComponent.doenetMLrange) {
                if (
                    serializedComponent.doenetMLrange.selfCloseBegin !==
                    undefined
                ) {
                    componentObj.indBegin =
                        serializedComponent.doenetMLrange.selfCloseBegin;
                    componentObj.indEnd =
                        serializedComponent.doenetMLrange.selfCloseEnd;
                } else if (
                    serializedComponent.doenetMLrange.openBegin !== undefined
                ) {
                    componentObj.indBegin =
                        serializedComponent.doenetMLrange.openBegin;
                    componentObj.indEnd =
                        serializedComponent.doenetMLrange.closeEnd;
                }
            }

            componentArray.push(componentObj);

            if (serializedComponent.children) {
                componentArray.push(
                    ...extractComponentNamesAndIndices(
                        serializedComponent.children,
                        {
                            ...nameSubstitutions,
                        },
                    ),
                );
            }
        }
    }

    return componentArray;
}

export function extractRangeIndexPieces({
    componentArray,
    lastInd = 0,
    stopInd = Infinity,
    enclosingComponentName,
}) {
    let rangePieces = [];

    let componentInd = 0;
    let foundComponentAfterStopInd = false;
    while (componentInd < componentArray.length) {
        let componentObj = componentArray[componentInd];

        if (componentObj.indBegin === undefined) {
            componentInd++;
            continue;
        }

        if (componentObj.indBegin > stopInd) {
            if (enclosingComponentName && lastInd <= stopInd) {
                rangePieces.push({
                    begin: lastInd,
                    end: stopInd,
                    componentName: enclosingComponentName,
                });
            }
            foundComponentAfterStopInd = true;
            break;
        }

        if (enclosingComponentName && componentObj.indBegin > lastInd) {
            rangePieces.push({
                begin: lastInd,
                end: componentObj.indBegin - 1,
                componentName: enclosingComponentName,
            });
        }

        let extractResult = extractRangeIndexPieces({
            componentArray: componentArray.slice(componentInd + 1),
            lastInd: componentObj.indBegin,
            stopInd: componentObj.indEnd,
            enclosingComponentName: componentObj.componentName,
        });

        componentInd += extractResult.componentsConsumed + 1;
        rangePieces.push(...extractResult.rangePieces);

        lastInd = componentObj.indEnd + 1;
    }

    if (
        !foundComponentAfterStopInd &&
        Number.isFinite(stopInd) &&
        stopInd >= lastInd
    ) {
        rangePieces.push({
            begin: lastInd,
            end: stopInd,
            componentName: enclosingComponentName,
        });
    }

    return { componentsConsumed: componentInd, rangePieces };
}

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
