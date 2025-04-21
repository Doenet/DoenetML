import { createUniqueName, flattenDeep } from "@doenet/utils";
import { convertToErrorComponent } from "./dast/errors";
import { breakStringInPiecesBySpacesOrParens } from "./assignNames";

// XXX: goal is to delete this function if we can remove its use
export function createComponentNames({
    serializedComponents,
    namespaceStack = [],
    componentInfoObjects,
    parentDoenetAttributes = {},
    parentIdx,
    useOriginalNames = false,
    attributesByTargetComponentName,
    indOffset = 0,
    createNameContext = "",
    initWithoutShadowingComposite = false,
    ignoreErrors = false,
}) {
    let errors = [];
    let warnings = [];

    if (namespaceStack.length === 0) {
        namespaceStack.push({
            namespace: "",
            componentCounts: {},
            namesUsed: {},
        });
    }
    let level = namespaceStack.length - 1;

    // console.log("createComponentNames " + level);
    // console.log(serializedComponents);
    // console.log(namespaceStack);

    let currentNamespace = namespaceStack[level];

    for (let [
        componentInd,
        serializedComponent,
    ] of serializedComponents.entries()) {
        if (typeof serializedComponent !== "object") {
            continue;
        }
        let foundError = false;
        let createUniqueNameDueToError = false;
        let errorMessage = "";

        let componentType = serializedComponent.componentType;
        let componentClass =
            componentInfoObjects.allComponentClasses[componentType];

        let doenetAttributes = serializedComponent.doenetAttributes;
        if (doenetAttributes === undefined) {
            doenetAttributes = serializedComponent.doenetAttributes = {};
        }

        let attributes = serializedComponent.attributes;
        if (!attributes) {
            attributes = serializedComponent.attributes = {};
        }

        if (doenetAttributes.createNameFromComponentType) {
            componentType = doenetAttributes.createNameFromComponentType;
        }

        let prescribedName = doenetAttributes.prescribedName;
        let assignNames = doenetAttributes.assignNames;
        let target = doenetAttributes.target;
        // let propName = doenetAttributes.propName;
        // let type = doenetAttributes.type;
        // let alias = doenetAttributes.alias;
        // let indexAlias = doenetAttributes.indexAlias;

        let mustCreateUniqueName =
            doenetAttributes.isAttributeChildFor ||
            doenetAttributes.createdFromSugar ||
            doenetAttributes.createUniqueName;

        let newNamespace;
        if (
            attributes.newNamespace?.primitive ||
            (useOriginalNames &&
                serializedComponent.originalAttributes &&
                serializedComponent.originalAttributes.newNamespace)
        ) {
            newNamespace = true;
        }

        let prescribedNameFromDoenetAttributes = prescribedName !== undefined;

        let props = serializedComponent.props;
        if (props === undefined) {
            props = serializedComponent.props = {};
        } else {
            // look for a attribute that matches an prop
            // but case insensitive
            for (let key in props) {
                let lowercaseKey = key.toLowerCase();
                if (lowercaseKey === "name") {
                    if (prescribedName === undefined) {
                        if (props[key] === true) {
                            foundError = true;
                            if (!errorMessage) {
                                errorMessage = `Cannot have a blank name.`;
                            }
                        } else {
                            prescribedName = props[key];
                        }
                    } else {
                        foundError = true;
                        if (!errorMessage) {
                            errorMessage = `Cannot define name twice.`;
                        }
                    }
                    delete props[key];
                } else if (lowercaseKey === "assignnames") {
                    if (assignNames === undefined) {
                        let result = breakStringInPiecesBySpacesOrParens(
                            props[key],
                        );
                        if (result.success) {
                            assignNames = result.pieces;
                        } else {
                            foundError = true;
                            if (!errorMessage) {
                                errorMessage = `Invalid format for assignNames: ${props[key]}.`;
                            }
                        }
                    } else {
                        foundError = true;
                        if (!errorMessage) {
                            errorMessage = `Cannot define assignNames twice for a component.`;
                        }
                    }
                    delete props[key];
                } else if (lowercaseKey === "target") {
                    if (target === undefined) {
                        if (typeof props[key] !== "string") {
                            foundError = true;
                            if (!errorMessage) {
                                if (
                                    componentType === "copy" ||
                                    componentType === "collect"
                                ) {
                                    errorMessage = `Must specify value for source.`;
                                } else {
                                    errorMessage = `Must specify value for target.`;
                                }
                            }
                        } else {
                            target = props[key].trim();
                        }
                    } else {
                        foundError = true;
                        if (!errorMessage) {
                            errorMessage = `Cannot define target twice for a component.`;
                        }
                    }
                    delete props[key];
                }
            }
        }

        if (prescribedName) {
            if (
                !prescribedNameFromDoenetAttributes &&
                !doenetAttributes.createdFromSugar
            ) {
                if (!/[a-zA-Z]/.test(prescribedName.substring(0, 1))) {
                    foundError = true;
                    createUniqueNameDueToError = true;
                    if (!errorMessage) {
                        errorMessage = `Invalid component name: ${prescribedName}.  Component name must begin with a letter.`;
                    }
                } else if (!/^[a-zA-Z0-9_-]+$/.test(prescribedName)) {
                    foundError = true;
                    createUniqueNameDueToError = true;
                    if (!errorMessage) {
                        errorMessage = `Invalid component name: ${prescribedName}.  Component name can contain only letters, numbers, hyphens, and underscores.`;
                    }
                }
            }

            // name was specified
            // put it into doenetAttributes
            doenetAttributes.prescribedName = prescribedName;
        } else if (mustCreateUniqueName) {
            let longNameId = parentIdx + "|createUniqueName|";

            if (serializedComponent.downstreamDependencies) {
                longNameId += JSON.stringify(
                    serializedComponent.downstreamDependencies,
                );
            } else {
                longNameId +=
                    componentInd + "|" + indOffset + "|" + createNameContext;
            }

            prescribedName = createUniqueName(
                componentType.toLowerCase(),
                longNameId,
            );
        }

        if (
            !assignNames &&
            useOriginalNames &&
            serializedComponent.originalDoenetAttributes?.assignNames
        ) {
            assignNames =
                serializedComponent.originalDoenetAttributes.assignNames;
            doenetAttributes.assignNamesForCompositeReplacement =
                serializedComponent.originalDoenetAttributes.assignNamesForCompositeReplacement;
        }

        if (assignNames) {
            let assignNamesToReplacements =
                componentClass.assignNamesToReplacements;
            if (!assignNamesToReplacements) {
                foundError = true;
                if (!errorMessage) {
                    errorMessage = `Cannot assign names for component type ${componentType}.`;
                }
                assignNames = undefined;
            } else {
                let assignNamesToString = (assignNames) => {
                    return assignNames.reduce((a, c) => {
                        let cstr;
                        if (Array.isArray(c)) {
                            cstr = "(" + assignNamesToString(c) + ")";
                        } else {
                            cstr = c;
                        }
                        return a ? a + " " + cstr : cstr;
                    }, "");
                };

                // assignNames was specified
                // put in doenetAttributes as assignNames array
                doenetAttributes.assignNames = assignNames;

                if (!doenetAttributes.createUniqueAssignNames) {
                    let flattenedNames = flattenDeep(assignNames);
                    if (
                        !doenetAttributes.fromCopyTarget &&
                        !doenetAttributes.fromCopyFromURI
                    ) {
                        for (let name of flattenedNames) {
                            if (!/[a-zA-Z]/.test(name.substring(0, 1))) {
                                foundError = true;
                                if (!errorMessage) {
                                    errorMessage = `Invalid assignNames: ${assignNamesToString(
                                        assignNames,
                                    )}.  All assigned names must begin with a letter.`;
                                }
                                assignNames = undefined;
                                delete doenetAttributes.assignNames;
                                break;
                            }
                            if (!/^[a-zA-Z0-9_-]+$/.test(name)) {
                                foundError = true;
                                if (!errorMessage) {
                                    errorMessage = `Invalid assignNames: ${assignNamesToString(
                                        assignNames,
                                    )}.  Assigned names can contain only letters, numbers, hyphens, and underscores.`;
                                }
                                assignNames = undefined;
                                delete doenetAttributes.assignNames;
                                break;
                            }
                        }
                    }
                    // check if unique names
                    if (
                        flattenedNames.length !== new Set(flattenedNames).size
                    ) {
                        foundError = true;
                        if (!errorMessage) {
                            errorMessage = `A name is duplicated in assignNames: ${assignNamesToString(
                                assignNames,
                            )}.`;
                        }
                        assignNames = undefined;
                        delete doenetAttributes.assignNames;
                    }
                }
            }
        }

        if (newNamespace) {
            if (
                serializedComponent.componentType === "copy" &&
                !attributes.prop
            ) {
                // a newNamespace on a copy assigns a new namespace to its replacements
                attributes.assignNewNamespaces = { primitive: true };
                delete attributes.newNamespace;
                newNamespace = false;
            } else {
                // newNamespace was specified
                // put in attributes as boolean
                attributes.newNamespace = { primitive: newNamespace };
            }
        }

        let count = currentNamespace.componentCounts[componentType];
        if (count === undefined) {
            count = 0;
        }

        // if created from a attribute/sugar/macro, don't include in component counts
        // (and we'll give a unique name if we haven't already)
        let excludeFromComponentCounts =
            doenetAttributes.isAttributeChildFor ||
            doenetAttributes.createdFromSugar ||
            doenetAttributes.createdFromMacro ||
            doenetAttributes.excludeFromComponentCounts;

        if (!excludeFromComponentCounts) {
            currentNamespace.componentCounts[componentType] = ++count;
        }

        let componentIdx = "";
        for (let l = 0; l <= level; l++) {
            componentIdx += namespaceStack[l].namespace + "/";
        }
        if (!prescribedName) {
            if (useOriginalNames) {
                if (serializedComponent.originalIdx) {
                    let lastInd =
                        serializedComponent.originalIdx.lastIndexOf("/");
                    prescribedName = serializedComponent.originalIdx.substring(
                        lastInd + 1,
                    );
                    // } else if (serializedComponent.componentIdx) {
                    //   let lastInd = serializedComponent.componentIdx.lastIndexOf("/");
                    //   prescribedName = serializedComponent.componentIdx.substring(lastInd + 1);
                }
            }
            if (!prescribedName) {
                if (excludeFromComponentCounts) {
                    let longNameId = parentIdx + "|createUniqueName|";
                    if (serializedComponent.downstreamDependencies) {
                        longNameId += JSON.stringify(
                            serializedComponent.downstreamDependencies,
                        );
                    } else {
                        longNameId +=
                            componentInd +
                            "|" +
                            indOffset +
                            "|" +
                            createNameContext;
                    }

                    prescribedName = createUniqueName(
                        componentType.toLowerCase(),
                        longNameId,
                    );
                } else {
                    prescribedName = "_" + componentType.toLowerCase() + count;
                }
            }
        }

        // For copies without a prop or for component with fromCopyTarget/fromCopyURI,
        // we convert the name to be assignNames so that it applies to the replacement
        // rather than the copy itself, and then we give the copy a randomly generated name.
        if (
            ((serializedComponent.componentType === "copy" &&
                !attributes.prop) ||
                doenetAttributes.fromCopyTarget ||
                doenetAttributes.fromCopyFromURI) &&
            !doenetAttributes.convertedAssignNames
        ) {
            if (
                doenetAttributes.createNameFromComponentType ||
                prescribedName[0] !== "_"
            ) {
                // If createNameFromComponentType, then the prescribedName always applies to the replacement,
                // given that it was generated from the componentType of the replacement
                if (assignNames) {
                    // Since we already have an assignNames, add a level to them so that they ignore this copy
                    // and will be used for the replacements of the composite replacement of copy.
                    // Also use prescribedName to name this composite replacement of copy.
                    assignNames = doenetAttributes.assignNames = [assignNames];
                    doenetAttributes.assignNamesForCompositeReplacement =
                        prescribedName;
                } else {
                    assignNames = doenetAttributes.assignNames = [
                        prescribedName,
                    ];
                }
            } else {
                // If createNameFromComponentType was not set and we have an automatically generated name,
                // don't apply that to the replacement, as it is based off of the copy component type.

                if (assignNames) {
                    // Since we already have an assignNames, add a level to them so that they ignore this copy
                    // and will be used for the replacements of the composite replacement of copy.
                    assignNames = doenetAttributes.assignNames = [assignNames];
                }
            }

            // record fact that converted assignNames so that copies
            // or further applications of createComponentNames
            // do not repeat this process and make assignNames be the randomly generated name
            doenetAttributes.convertedAssignNames = true;

            // create unique name for copy
            let longNameId = parentIdx + "|createUniqueName|";
            doenetAttributes.createUniqueName = true;
            delete doenetAttributes.prescribedName;

            if (serializedComponent.downstreamDependencies) {
                longNameId += JSON.stringify(
                    serializedComponent.downstreamDependencies,
                );
            } else {
                longNameId +=
                    componentInd + "|" + indOffset + "|" + createNameContext;
            }

            prescribedName = createUniqueName(
                serializedComponent.componentType,
                longNameId,
            );
        } else if (
            (serializedComponent.componentType === "copy" ||
                serializedComponent.componentType === "extract") &&
            attributes.prop
        ) {
            // If we are copying/extracting a prop, we don't do anything special to this component
            // so that the name will name the composite,
            // providing a way to access all resulting components in the case when the prop is an array.
            // The attribute assignNames will assignNames to the replacements,
            // providing a way to name the array components separately.

            // Ideally, we would, at this point, also treat (recursive) copies of a copy/extract with prop
            // in the same way, i.e., skipping the above renaming.
            // (That way the name of these copies could represent the whole array of props
            // and the assignNames fo those copies could name the individual components of the array.)
            // However, we don't yet have strongly typed system where we could determine at this stage of processing
            // whether or not the target of the copy is such a a copy/extract with prop (or recusrive copy of such).
            // As a workaround, we set the sourceIsProp doenetAttribute on a copy/extract of a prop
            // (that will also be given to copies of them)
            // that will be used by the copy component to create an extra <copy/> around its replacements.
            // That extra copy will then get the name from assignNamesForCompositeReplacement
            // created from the prescribedName, above (given that we weren't able to skip that processing),
            // and the extra level added to assignNames, above, will be used by that copy.

            doenetAttributes.sourceIsProp = true;
        }

        componentIdx += prescribedName;

        serializedComponent.componentIdx = componentIdx;
        if (prescribedName) {
            if (prescribedName in currentNamespace.namesUsed) {
                foundError = true;
                createUniqueNameDueToError = true;
                if (!errorMessage) {
                    let lastSlash = componentIdx.lastIndexOf("/");
                    let componentNameRelative = componentIdx.slice(
                        lastSlash + 1,
                    );
                    errorMessage = `Duplicate component name: ${componentNameRelative}.`;
                }

                // delete children and component props, as they could have automatically generated names
                // that would be based on the parent name, and hence also conflict
                delete serializedComponent.children;
                for (let attrName in serializedComponent.attributes) {
                    if (serializedComponent.attributes[attrName].component) {
                        delete serializedComponent.attributes[attrName];
                    }
                }
            }
            currentNamespace.namesUsed[prescribedName] = true;
        }

        if (
            serializedComponent.doenetAttributes.createUniqueAssignNames &&
            serializedComponent.originalIdx
        ) {
            let originalAssignNames =
                serializedComponent.doenetAttributes.assignNames;
            if (!originalAssignNames) {
                originalAssignNames =
                    serializedComponent.doenetAttributes.originalAssignNames;
            }

            let longNameIdBase =
                componentIdx + "|createUniqueName|assignNames|";

            let namespace = "";
            let oldNamespace;
            if (!newNamespace) {
                for (let l = 0; l <= level; l++) {
                    namespace += namespaceStack[l].namespace + "/";
                }
                let lastInd = serializedComponent.originalIdx.lastIndexOf("/");
                oldNamespace = serializedComponent.originalIdx.slice(
                    0,
                    lastInd + 1,
                );
            } else {
                namespace = componentIdx + "/";
                oldNamespace = serializedComponent.originalIdx + "/";
            }

            let newAssignNames =
                createNewAssignNamesAndrenameMatchingTargetNames({
                    originalAssignNames,
                    longNameIdBase,
                    namespace,
                    oldNamespace,
                    attributesByTargetComponentName,
                });

            assignNames = serializedComponent.doenetAttributes.assignNames =
                newAssignNames;
        }

        renameMatchingTargetNames(
            serializedComponent,
            attributesByTargetComponentName,
        );

        if (target) {
            if (!componentClass.acceptTarget) {
                foundError = true;
                target = undefined;
                if (!errorMessage) {
                    errorMessage = `Component type <${componentType}> does not accept a target attribute.`;
                }
            }

            if (target.includes("|")) {
                foundError = true;
                target = undefined;
                if (!errorMessage) {
                    errorMessage = `target cannot include |.`;
                }
            }

            if (target) {
                // convert target to full name
                doenetAttributes.target = target;
                try {
                    doenetAttributes.targetComponentIdx =
                        convertComponentTarget({
                            relativeName: target,
                            oldAbsoluteName:
                                doenetAttributes.targetComponentIdx,
                            namespaceStack,
                            acceptDoubleUnderscore:
                                doenetAttributes.createdFromSugar ||
                                doenetAttributes.allowDoubleUnderscoreTarget,
                        });
                } catch (e) {
                    foundError = true;
                    if (!errorMessage) {
                        errorMessage = e.message;
                    }
                }
            }
        }

        try {
            for (let attrName in attributes) {
                let attr = attributes[attrName];
                if (attr.targetComponentNames) {
                    for (let nameObj of attr.targetComponentNames) {
                        nameObj.absoluteName = convertComponentTarget({
                            relativeName: nameObj.relativeName,
                            oldAbsoluteName: nameObj.absoluteName,
                            namespaceStack,
                            acceptDoubleUnderscore:
                                doenetAttributes.createdFromSugar ||
                                doenetAttributes.allowDoubleUnderscoreTarget,
                        });
                    }
                }
            }
        } catch (e) {
            foundError = true;
            if (!errorMessage) {
                errorMessage = e.message;
            }
        }

        // Need to rename component now if had error
        // as it will be used for namespace of children

        if (createUniqueNameDueToError) {
            // Name the "_error" component as though it were a component
            // in the original DoenetML, i.e., number it consecutively.
            componentType = "_error";

            let count = currentNamespace.componentCounts[componentType];
            if (count === undefined) {
                count = 0;
            }
            let componentIdx = "";
            for (let l = 0; l <= level; l++) {
                componentIdx += namespaceStack[l].namespace + "/";
            }
            currentNamespace.componentCounts[componentType] = ++count;

            let prescribedName = "_" + componentType.toLowerCase() + count;
            componentIdx += prescribedName;
            serializedComponent.componentIdx = componentIdx;
        }

        if (serializedComponent.children) {
            // recurse on child, creating new namespace if specified

            let ignoreErrorsInChildren =
                ignoreErrors || componentClass.ignoreErrorsFromChildren;

            if (!(newNamespace || attributes.assignNewNamespaces?.primitive)) {
                let children = serializedComponent.children;

                if (
                    doenetAttributes.nameFirstChildIndependently &&
                    children.length > 0
                ) {
                    // when creating names for first child, ignore all previous names and treat it as a separate unit

                    children = children.slice(1);

                    let originalNamesUsed = currentNamespace.namesUsed;
                    let originalComponentCounts =
                        currentNamespace.componentCounts;
                    currentNamespace.namesUsed = {};
                    currentNamespace.componentCounts = {};

                    let res = createComponentNames({
                        serializedComponents: [serializedComponent.children[0]],
                        namespaceStack,
                        componentInfoObjects,
                        parentDoenetAttributes: doenetAttributes,
                        parentIdx: componentIdx,
                        useOriginalNames,
                        attributesByTargetComponentName,
                        ignoreErrors: ignoreErrorsInChildren,
                    });
                    errors.push(...res.errors);
                    warnings.push(...res.warnings);

                    currentNamespace.namesUsed = originalNamesUsed;
                    currentNamespace.componentCounts = originalComponentCounts;
                }

                let res = createComponentNames({
                    serializedComponents: children,
                    namespaceStack,
                    componentInfoObjects,
                    parentDoenetAttributes: doenetAttributes,
                    parentIdx: componentIdx,
                    useOriginalNames,
                    attributesByTargetComponentName,
                    ignoreErrors: ignoreErrorsInChildren,
                });
                errors.push(...res.errors);
                warnings.push(...res.warnings);
            } else {
                // if newNamespace, then need to make sure that assigned names
                // don't conflict with new names added,
                // so include in namesused
                let namesUsed = {};
                // if (assignNames && !componentClass.assignNamesToChildren) {
                if (assignNames) {
                    flattenDeep(assignNames).forEach(
                        (x) => (namesUsed[x] = true),
                    );
                }

                let children = serializedComponent.children;

                if (
                    doenetAttributes.nameFirstChildIndependently &&
                    serializedComponent.children.length > 0
                ) {
                    // when creating names for first child, ignore all previous names and treat it as a separate unit

                    children = children.slice(1);

                    let separateNewNamespaceInfo = {
                        namespace: prescribedName,
                        componentCounts: {},
                        namesUsed: {},
                    };
                    namespaceStack.push(separateNewNamespaceInfo);

                    let res = createComponentNames({
                        serializedComponents: [serializedComponent.children[0]],
                        namespaceStack,
                        componentInfoObjects,
                        parentDoenetAttributes: doenetAttributes,
                        parentIdx: componentIdx,
                        useOriginalNames,
                        attributesByTargetComponentName,
                        ignoreErrors: ignoreErrorsInChildren,
                    });
                    errors.push(...res.errors);
                    warnings.push(...res.warnings);

                    namespaceStack.pop();
                }

                let newNamespaceInfo = {
                    namespace: prescribedName,
                    componentCounts: {},
                    namesUsed,
                };

                if (doenetAttributes.haveNewNamespaceOnlyFromShadow) {
                    // if the parent component only has newNamespace from the fact that it is a shadow,
                    // as opposed to explicitly getting it from assignNewNamespaces,
                    // then, if a child is marked to ignore parent's newNamespace, it ignores it
                    // Note: ignoreParentNewNamespace is only added when have fromCopyTarget

                    let addingNewNamespace = true;
                    let remainingChildren = [...children];

                    while (remainingChildren.length > 0) {
                        let nextChildren = [];

                        for (let child of remainingChildren) {
                            if (
                                Boolean(
                                    child.doenetAttributes
                                        ?.ignoreParentNewNamespace,
                                ) === addingNewNamespace
                            ) {
                                break;
                            }
                            nextChildren.push(child);
                        }

                        remainingChildren.splice(0, nextChildren.length);

                        if (addingNewNamespace) {
                            namespaceStack.push(newNamespaceInfo);
                        } else if (initWithoutShadowingComposite) {
                            // if this is the first time through and we aren't shadowing a composite
                            // it is possible that ignoring the namespace will lead to name conflicts,
                            // so give the child a unique name
                            nextChildren.forEach(
                                (child) =>
                                    (child.doenetAttributes.createUniqueName = true),
                            );
                        }

                        let res = createComponentNames({
                            serializedComponents: nextChildren,
                            namespaceStack,
                            componentInfoObjects,
                            parentDoenetAttributes: doenetAttributes,
                            parentIdx: componentIdx,
                            useOriginalNames,
                            attributesByTargetComponentName,
                            ignoreErrors: ignoreErrorsInChildren,
                        });
                        errors.push(...res.errors);
                        warnings.push(...res.warnings);

                        if (addingNewNamespace) {
                            namespaceStack.pop();
                        }

                        addingNewNamespace = !addingNewNamespace;
                    }
                } else {
                    namespaceStack.push(newNamespaceInfo);
                    let res = createComponentNames({
                        serializedComponents: children,
                        namespaceStack,
                        componentInfoObjects,
                        parentDoenetAttributes: doenetAttributes,
                        parentIdx: componentIdx,
                        useOriginalNames,
                        attributesByTargetComponentName,
                        ignoreErrors: ignoreErrorsInChildren,
                    });
                    errors.push(...res.errors);
                    warnings.push(...res.warnings);
                    namespaceStack.pop();
                }
            }
        }

        if (serializedComponent.attributes) {
            // recurse on attributes that are components

            for (let attrName in serializedComponent.attributes) {
                let attribute = serializedComponent.attributes[attrName];

                if (attribute.component) {
                    let comp = attribute.component;

                    if (!comp.doenetAttributes) {
                        comp.doenetAttributes = {};
                    }

                    comp.doenetAttributes.isAttributeChildFor = attrName;
                    if (attribute.ignoreFixed) {
                        comp.doenetAttributes.ignoreParentFixed = true;
                    }

                    let res = createComponentNames({
                        serializedComponents: [comp],
                        namespaceStack,
                        componentInfoObjects,
                        parentDoenetAttributes: doenetAttributes,
                        parentIdx: componentIdx,
                        useOriginalNames,
                        attributesByTargetComponentName,
                        createNameContext: attrName,
                        ignoreErrors,
                    });
                    errors.push(...res.errors);
                    warnings.push(...res.warnings);
                } else if (attribute.childrenForFutureComponent) {
                    // TODO: what to do about parentIdx/parentDoenetAttributes
                    // since parent of these isn't created
                    // Note: the main (only?) to recurse here is to rename targets
                    let res = createComponentNames({
                        serializedComponents:
                            attribute.childrenForFutureComponent,
                        namespaceStack,
                        componentInfoObjects,
                        parentDoenetAttributes: doenetAttributes,
                        parentIdx: componentIdx,
                        useOriginalNames,
                        attributesByTargetComponentName,
                        createNameContext: attrName,
                        ignoreErrors,
                    });
                    errors.push(...res.errors);
                    warnings.push(...res.warnings);
                }
            }
        }

        // TODO: is there any reason to run createComponentNames on attribute components?

        if (foundError) {
            convertToErrorComponent(serializedComponent, errorMessage);

            if (!ignoreErrors) {
                errors.push({
                    message: errorMessage,
                    position: serializedComponent.position,
                });
            }
        }
    }

    return { errors, warnings };
}

// XXX: delete
function createNewAssignNamesAndrenameMatchingTargetNames({
    originalAssignNames,
    longNameIdBase,
    namespace,
    oldNamespace,
    attributesByTargetComponentName,
}) {
    let assignNames = [];

    for (let [ind, originalName] of originalAssignNames.entries()) {
        if (Array.isArray(originalName)) {
            // recurse to next level
            let assignNamesSub =
                createNewAssignNamesAndrenameMatchingTargetNames({
                    originalAssignNames: originalName,
                    longNameIdBase: longNameIdBase + ind + "_",
                    namespace,
                    oldNamespace,
                    attributesByTargetComponentName,
                });
            assignNames.push(assignNamesSub);
        } else {
            let longNameId = longNameIdBase + ind;
            let newName = createUniqueName("fromAssignNames", longNameId);
            assignNames.push(newName);

            let infoForRenaming = {
                componentIdx: namespace + newName,
                originalIdx: oldNamespace + originalName,
            };

            renameMatchingTargetNames(
                infoForRenaming,
                attributesByTargetComponentName,
                true,
            );
        }
    }

    return assignNames;
}

// XXX: can we delete this?
function convertComponentTarget({
    relativeName,
    oldAbsoluteName,
    namespaceStack,
    acceptDoubleUnderscore,
}) {
    if (
        !oldAbsoluteName &&
        /__/.test(relativeName) &&
        !acceptDoubleUnderscore
    ) {
        throw Error("Invalid reference target: " + relativeName);
    }

    let absoluteName;

    // console.log(`relativeName: ${relativeName}`)
    // console.log(JSON.parse(JSON.stringify(namespaceStack)))

    if (relativeName.substring(0, 1) === "/") {
        // if starts with /, then don't add anything to path
        absoluteName = relativeName;
    } else {
        // calculate full target from relativeName
        // putting it into the context of the current namespace

        let lastLevel = namespaceStack.length - 1;

        while (relativeName.substring(0, 3) === "../") {
            // take off one level for every ../
            relativeName = relativeName.substring(3);
            lastLevel--;
        }

        if (lastLevel < 0) {
            // the relativeName cannot possibly be valid
            // if there were more ../s than namespace levels
            lastLevel = 0;
        }

        absoluteName = "";
        for (let l = 0; l <= lastLevel; l++) {
            absoluteName += namespaceStack[l].namespace + "/";
        }
        absoluteName += relativeName;
    }

    return absoluteName;
}

// processAssignNames creates component names for an array of components
// based on instructions on how those names should be assigned.
// The most common use case is for naming replacements of a composite.
// If assignNames is specified, those names will be used for the first components.
// If a name is not assigned for a given component then
//   - if originalNamesAreConsistent is true, original names of the components are used
//   - else unique names will be generated for the components
// Notes on arguments
// - serializedComponents: array of components to be named (the replacements)
// - assignNames: an array of names to be given to the components
//   If an entry of assignNames is an array and that component is itself a composite that assigns names
//   then that array becomes the assignNames for that composite component
// - indOffset: offset assignNames by this value (compared to index of serialized components)
//   and also offset the index used for creating unique names
// - shadowingComposite: If false, there is apparently some case where we have to create unique names
//   TODO: figure out the circumstances where this special case occurs

// XXX: goal is to delete this and replace it will the minimal `assignNamesToComponents` function
export function processAssignNames({
    assignNames = [],
    assignNamesForCompositeReplacement,
    serializedComponents,
    parentIdx,
    parentNameForUniqueNames,
    componentInfoObjects,
    indOffset = 0,
    originalNamesAreConsistent = false,
    shadowingComposite = false,
    compositesParentNameForAssignNames,
}) {
    // console.log(`process assign names`);
    // console.log(deepClone(serializedComponents));
    // console.log(`originalNamesAreConsistent: ${originalNamesAreConsistent}`);
    // console.log(assignNames);
    // console.log({
    //   parentIdx,
    //   compositesParentNameForAssignNames,
    // });

    let errors = [];
    let warnings = [];

    let numComponents = serializedComponents.length;

    // Step 1
    // normalize form so all indices are originalIdx and not componentIdx,
    // independent of whether the components originated from a copy
    // (which would have given originalIdx but not componentIdx)
    // or directly from a serialized state
    // (which would have componentIdx but not originalIdx)
    moveComponentIdxToOriginalIdx(serializedComponents);

    // Step 2
    // The namespace of a component is the part before the last slash.
    // We treat targets that are within the original namespace of the components as relative,
    // so that the references will change if the namespace changes.
    // However, we treat targets that are outside the original namespace as absolute so they won't change.

    let attributesByTargetComponentName = {};

    for (let ind = 0; ind < numComponents; ind++) {
        let component = serializedComponents[ind];

        if (component.originalIdx) {
            let lastSlash = component.originalIdx.lastIndexOf("/");
            let originalNamespace = component.originalIdx.substring(
                0,
                lastSlash,
            );

            setTargetsOutsideNamespaceToAbsoluteAndRecordAllTargetComponentNames(
                {
                    namespace: originalNamespace,
                    components: [component],
                    attributesByTargetComponentName,
                },
            );
        }
    }

    // Step 3
    // For each component, determine if it should be assigned a name or given a unique name,
    // and set its prescribedName to that value.
    // Then create component names for it and its children

    let processedComponents = [];

    let numPrimitivesSkipped = 0;

    for (let ind = 0; ind < numComponents; ind++) {
        let indForNames = ind + indOffset;

        let component = serializedComponents[ind];

        if (typeof component !== "object") {
            // Blank strings do not take up one of the names from assignNames.
            // All other primitives do use up a name, but they are not actually named
            if (typeof component === "string" && component.trim() === "") {
                numPrimitivesSkipped++;
            }
            processedComponents.push(component);
            continue;
        }

        let name = assignNames[indForNames - numPrimitivesSkipped];

        if (!component.doenetAttributes) {
            component.doenetAttributes = {};
        }
        if (!component.attributes) {
            component.attributes = {};
        }

        if (name) {
            let numToSkip = 0;
            if (component.attributes.assignNamesSkip) {
                // if component is a composite that itself assigns names to composites,
                // it could have an assignNamesSkip attribute, which says that we should
                // recurse to its replacements (possibly multiple times if assignNamesSkip > 1)
                // before continuing the assign names process
                numToSkip += component.attributes.assignNamesSkip.primitive;
            }
            if (
                (component.componentType === "copy" ||
                    component.componentType === "extract") &&
                !component.doenetAttributes?.sourceIsProp
            ) {
                numToSkip += 1;
            }
            if (numToSkip > 0) {
                for (let i = 0; i < numToSkip; i++) {
                    name = [name];
                }
            }
        }

        // If the name is actually an array rather than a name,
        // then it indicates we should use it for assignNames instead,
        // assuming the component actually assigns names to replacement
        if (Array.isArray(name)) {
            if (
                componentInfoObjects.allComponentClasses[
                    component.componentType
                ].assignNamesToReplacements
            ) {
                if (assignNamesForCompositeReplacement) {
                    component.doenetAttributes.prescribedName =
                        assignNamesForCompositeReplacement;
                } else {
                    // since we don't have a name for the component itself,
                    // give it an unreachable name (i.e., a unique name)
                    let longNameId =
                        parentIdx + "|assignName|" + indForNames.toString();
                    if (parentNameForUniqueNames) {
                        longNameId = parentNameForUniqueNames + longNameId;
                    }
                    component.doenetAttributes.prescribedName =
                        createUniqueName(
                            component.componentType.toLowerCase(),
                            longNameId,
                        );
                }

                // The prescribed name, created above, does not include namespaces.
                // The full component name does include namespaces.
                // Add the appropriate namespace to the prescribed name to create the full name

                let namespaceForComponent = parentIdx;
                if (!parentCreatesNewNamespace) {
                    let lastSlash = parentIdx.lastIndexOf("/");
                    namespaceForComponent = parentIdx.substring(0, lastSlash);
                }
                component.componentIdx =
                    namespaceForComponent +
                    "/" +
                    component.doenetAttributes.prescribedName;

                // The main goal: making the array "name" be the assignNames
                component.doenetAttributes.assignNames = name;
                if (compositesParentNameForAssignNames) {
                    component.doenetAttributes.parentNameForAssignNames =
                        compositesParentNameForAssignNames;
                }
                processedComponents.push(component);

                // Nothing more to do with the composite component,
                // as the assignNames will be used when creating its replacements
                continue;
            } else {
                // If a component doesn't assign names, we can't handle a "name" that is an array
                // so we just ignore the name
                warnings.push({
                    message: `Cannot assign names recursively to <${component.componentType}>`,
                    level: 1,
                });
                name = null;
            }
        }

        if (!name) {
            // A name was not specified from assignNames.
            // If assignNamesForCompositeReplacement was specified and have a composite,
            // then use assignNamesForCompositeReplacement for the composite's name.
            // Else if originalNamesAreConsistent, we'll try to use the component's originalIdx.
            // Otherwise, we'll create a unique (unreachable) name
            if (
                componentInfoObjects.isCompositeComponent({
                    componentType: component.componentType,
                    includeNonStandard: true,
                }) &&
                assignNamesForCompositeReplacement
            ) {
                name = assignNamesForCompositeReplacement;
            } else if (
                originalNamesAreConsistent &&
                component.originalIdx &&
                !component.doenetAttributes?.createUniqueName
            ) {
                let lastSlash = component.originalIdx.lastIndexOf("/");
                name = component.originalIdx.slice(lastSlash + 1);
            } else {
                let longNameId =
                    parentIdx + "|assignName|" + indForNames.toString();
                if (parentNameForUniqueNames) {
                    longNameId = parentNameForUniqueNames + longNameId;
                }
                name = createUniqueName(
                    component.componentType.toLowerCase(),
                    longNameId,
                );
            }
        }

        // The name becomes the component's prescribed name (which doesn't include the namespace)
        component.doenetAttributes.prescribedName = name;

        // We will call createComponentNames, below, to create the names of the component and its children.
        // The function createComponentNames uses a namespaceStack to keep track of the namespaces.
        // To start off with the correct namespace for the component, we create a namespaceStack
        // corresponding to the desired namespace, which is the namespace from the parent
        // (including the parent's name as a namespace if parentCreatesNewNamespace)

        let namespacePieces = parentIdx.split("/");
        if (!parentCreatesNewNamespace) {
            namespacePieces.pop();
        }
        let namespaceStack = namespacePieces.map((x) => ({
            namespace: x,
            componentCounts: {},
            namesUsed: {},
        }));
        if (!(parentIdx[0] === "/")) {
            // if parentIdx doesn't begin with a /
            // still add a namespace for the root namespace at the beginning
            namespaceStack.splice(0, 0, {
                componentCounts: {},
                namesUsed: {},
                namespace: "",
            });
        }

        // If a component is creating a new namespace,
        // then the names of its children cannot conflict with other names.
        // In this case, we can use the original names of the children even if originalNamesAreConsistent is false.
        let useOriginalNames;
        if (
            component.attributes.newNamespace?.primitive ||
            originalNamesAreConsistent
        ) {
            useOriginalNames = true;
        } else {
            useOriginalNames = false;

            if (component.children) {
                // if we aren't using original names, then we need to make unique (unreachable) names for the children
                markToCreateAllUniqueNames(component.children);
            }
        }

        // always mark component attributes to create unique names
        // TODO: shouldn't this always be done so we wouldn't have to do it here?
        for (let attrName in component.attributes) {
            let attribute = component.attributes[attrName];
            if (attribute.component) {
                markToCreateAllUniqueNames([attribute.component]);
            } else if (attribute.childrenForFutureComponent) {
                markToCreateAllUniqueNames(
                    attribute.childrenForFutureComponent,
                );
            }
        }

        // console.log(`before create componentIdx`);
        // console.log(deepClone(component));
        // console.log(useOriginalNames);
        // console.log(component.attributes.newNamespace);

        let res = createComponentNames({
            serializedComponents: [component],
            namespaceStack,
            componentInfoObjects,
            parentIdx,
            useOriginalNames,
            attributesByTargetComponentName,
            indOffset: indForNames,
            initWithoutShadowingComposite: !shadowingComposite,
        });
        errors.push(...res.errors);
        warnings.push(...res.warnings);

        // console.log(`result of create componentIdx`);
        // console.log(deepClone(component));

        processedComponents.push(component);
    }

    return {
        serializedComponents: processedComponents,
        errors,
        warnings,
    };
}

// XXX: delete almost all of this (might need to rework target name part)
function setTargetsOutsideNamespaceToAbsoluteAndRecordAllTargetComponentNames({
    namespace,
    components,
    attributesByTargetComponentName,
}) {
    let namespaceLength = namespace.length;
    for (let component of components) {
        if (typeof component !== "object") {
            continue;
        }

        if (component.doenetAttributes && component.doenetAttributes.target) {
            let targetComponentIdx =
                component.doenetAttributes.targetComponentIdx;
            if (targetComponentIdx !== undefined) {
                if (
                    targetComponentIdx.substring(0, namespaceLength) !==
                    namespace
                ) {
                    component.doenetAttributes.target = targetComponentIdx;
                }
                if (!attributesByTargetComponentName[targetComponentIdx]) {
                    attributesByTargetComponentName[targetComponentIdx] = [];
                }
                attributesByTargetComponentName[targetComponentIdx].push(
                    component.doenetAttributes,
                );
            }
        }

        for (let attrName in component.attributes) {
            let attr = component.attributes[attrName];
            if (attr.targetComponentNames) {
                for (let nameObj of attr.targetComponentNames) {
                    let absoluteName = nameObj.absoluteName;
                    if (absoluteName !== undefined) {
                        if (
                            absoluteName.substring(0, namespaceLength) !==
                            namespace
                        ) {
                            nameObj.relativeName = absoluteName;
                        }
                        if (!attributesByTargetComponentName[absoluteName]) {
                            attributesByTargetComponentName[absoluteName] = [];
                        }
                        attributesByTargetComponentName[absoluteName].push(
                            nameObj,
                        );
                    }
                }
            }
        }

        if (component.children) {
            setTargetsOutsideNamespaceToAbsoluteAndRecordAllTargetComponentNames(
                {
                    namespace,
                    components: component.children,
                    attributesByTargetComponentName,
                },
            );
        }
        if (component.attributes) {
            for (let attrName in component.attributes) {
                let attribute = component.attributes[attrName];
                if (attribute.component) {
                    setTargetsOutsideNamespaceToAbsoluteAndRecordAllTargetComponentNames(
                        {
                            namespace,
                            components: [attribute.component],
                            attributesByTargetComponentName,
                        },
                    );
                } else if (attribute.childrenForFutureComponent) {
                    setTargetsOutsideNamespaceToAbsoluteAndRecordAllTargetComponentNames(
                        {
                            namespace,
                            components: attribute.childrenForFutureComponent,
                            attributesByTargetComponentName,
                        },
                    );
                }
            }
        }
    }
}

// XXX: we'll probably need this feature
function renameMatchingTargetNames(
    component,
    attributesByTargetComponentName,
    renameMatchingNamespaces = false,
) {
    if (
        component.originalIdx &&
        attributesByTargetComponentName &&
        component.componentIdx !== component.originalIdx
    ) {
        // we have a component who has been named and there are other components
        // whose targetComponentIdx refers to this component
        // Modify the target and targetComponentIdx of the other components to refer to the new name
        // (Must modify targetComponentIdx as we don't know if this component has been processed yet)
        if (attributesByTargetComponentName[component.originalIdx]) {
            for (let attrObj of attributesByTargetComponentName[
                component.originalIdx
            ]) {
                if (attrObj.relativeName) {
                    attrObj.relativeName = component.componentIdx;
                    attrObj.absoluteName = component.componentIdx;
                } else {
                    // must be doenetAttributes
                    attrObj.target = component.componentIdx;
                    attrObj.targetComponentIdx = component.componentIdx;
                }
            }
        }
        if (renameMatchingNamespaces) {
            let originalNamespace = component.originalIdx + "/";
            let nSpaceLen = originalNamespace.length;
            for (let originalTargetComponentName in attributesByTargetComponentName) {
                if (
                    originalTargetComponentName.substring(0, nSpaceLen) ===
                    originalNamespace
                ) {
                    let originalEnding =
                        originalTargetComponentName.substring(nSpaceLen);
                    for (let attrObj of attributesByTargetComponentName[
                        originalTargetComponentName
                    ]) {
                        if (attrObj.relativeName) {
                            attrObj.relativeName =
                                component.componentIdx + "/" + originalEnding;
                            attrObj.absoluteName =
                                component.componentIdx + "/" + originalEnding;
                        } else {
                            // must be doenetAttributes
                            attrObj.target =
                                component.componentIdx + "/" + originalEnding;
                            attrObj.targetComponentIdx =
                                component.componentIdx + "/" + originalEnding;
                        }
                    }
                }
            }
        }
    }
}

function moveComponentIdxToOriginalIdx(components) {
    for (let component of components) {
        if (component.componentIdx) {
            component.originalIdx = component.componentIdx;
            delete component.componentIdx;
        }
        if (component.children) {
            moveComponentIdxToOriginalIdx(component.children);
        }
        if (component.attributes) {
            for (let attrName in component.attributes) {
                let attribute = component.attributes[attrName];
                if (attribute.component) {
                    moveComponentIdxToOriginalIdx([attribute.component]);
                } else if (attribute.childrenForFutureComponent) {
                    moveComponentIdxToOriginalIdx(
                        attribute.childrenForFutureComponent,
                    );
                }
            }
        }
    }
}

// XXX: delete
export function markToCreateAllUniqueNames(components) {
    for (let component of components) {
        if (typeof component !== "object") {
            continue;
        }

        if (!component.doenetAttributes) {
            component.doenetAttributes = {};
        }
        component.doenetAttributes.createUniqueName = true;
        delete component.doenetAttributes.prescribedName;

        if (!component.attributes?.newNamespace?.primitive) {
            if (component.doenetAttributes.assignNames) {
                component.doenetAttributes.createUniqueAssignNames = true;
                component.doenetAttributes.originalAssignNames =
                    component.doenetAttributes.assignNames;
                delete component.doenetAttributes.assignNames;
            } else if (component.originalDoenetAttributes?.assignNames) {
                component.doenetAttributes.createUniqueAssignNames = true;
                component.doenetAttributes.originalAssignNames =
                    component.originalDoenetAttributes.assignNames;
            }
            if (component.children) {
                markToCreateAllUniqueNames(component.children);
            }
        }

        if (component.attributes) {
            for (let attrName in component.attributes) {
                let attribute = component.attributes[attrName];
                if (attribute.component) {
                    markToCreateAllUniqueNames([attribute.component]);
                } else if (attribute.childrenForFutureComponent) {
                    markToCreateAllUniqueNames(
                        attribute.childrenForFutureComponent,
                    );
                }
            }
        }
    }
}

// XXX: delete
export function setTNamesToAbsolute(components) {
    for (let component of components) {
        if (component.doenetAttributes && component.doenetAttributes.target) {
            let targetComponentIdx =
                component.doenetAttributes.targetComponentIdx;
            if (targetComponentIdx !== undefined) {
                component.doenetAttributes.target = targetComponentIdx;
            }
        }

        if (component.children) {
            setTNamesToAbsolute(component.children);
        }
        if (component.attributes) {
            for (let attrName in component.attributes) {
                let attribute = component.attributes[attrName];
                if (attribute.component) {
                    setTNamesToAbsolute([attribute.component]);
                } else if (attribute.childrenForFutureComponent) {
                    setTNamesToAbsolute(attribute.childrenForFutureComponent);
                }
            }
        }
    }
}
