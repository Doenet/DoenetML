import me from "math-expressions";
import { createUniqueName } from "./naming";
import { flattenDeep } from "./array";
import { deepClone } from "./deepFunctions";
import { parseAndCompile } from "../Parser/parser";
import subsets from "./subset-of-reals";
import { retrieveTextFileForCid } from "./retrieveTextFile";

export async function expandDoenetMLsToFullSerializedComponents({
    cids,
    doenetMLs,
    componentInfoObjects,
}) {
    let arrayOfSerializedComponents = [];
    let cidComponents = {};

    for (let doenetML of doenetMLs) {
        let serializedComponents = parseAndCompile(doenetML);

        serializedComponents = cleanIfHaveJustDocument(serializedComponents);

        substituteDeprecations(serializedComponents);

        correctComponentTypeCapitalization(
            serializedComponents,
            componentInfoObjects.componentTypeLowerCaseMapping,
        );

        createAttributesFromProps(serializedComponents, componentInfoObjects);

        applyMacros(serializedComponents, componentInfoObjects);

        // remove blank string children after applying macros,
        // as applying macros could create additional blank string children
        removeBlankStringChildren(serializedComponents, componentInfoObjects);

        decodeXMLEntities(serializedComponents);

        applySugar({ serializedComponents, componentInfoObjects });

        arrayOfSerializedComponents.push(serializedComponents);

        let newContentComponents = findContentCopies({ serializedComponents });

        for (let cid in newContentComponents.cidComponents) {
            if (cidComponents[cid] === undefined) {
                cidComponents[cid] = [];
            }
            cidComponents[cid].push(...newContentComponents.cidComponents[cid]);
        }
    }

    let cidList = Object.keys(cidComponents);
    if (cidList.length > 0) {
        // found copies with cids
        // so look up those cids
        // convert to doenetMLs, and recurse on those doenetMLs

        let { newDoenetMLs, newCids } = await cidsToDoenetMLs(cidList);

        // check to see if got the cids requested
        for (let [ind, cid] of cidList.entries()) {
            if (newCids[ind] && newCids[ind].substring(0, cid.length) !== cid) {
                return Promise.reject(
                    new Error(
                        `Requested cid ${cid} but got back ${newCids[ind]}!`,
                    ),
                );
            }
        }

        let expectedN = cidList.length;
        for (let ind = 0; ind < expectedN; ind++) {
            let cid = newCids[ind];
            if (!cid) {
                // wasn't able to retrieve content
                console.warn(
                    `Unable to retrieve content with cid = ${cidList[ind]}`,
                );
                newDoenetMLs[ind] = "";
            }
        }

        // recurse to additional doenetMLs
        let { fullSerializedComponents } =
            await expandDoenetMLsToFullSerializedComponents({
                doenetMLs: newDoenetMLs,
                cids: newCids,
                componentInfoObjects,
            });

        for (let [ind, cid] of cidList.entries()) {
            let serializedComponentsForCid = fullSerializedComponents[ind];

            for (let originalCopyWithUri of cidComponents[cid]) {
                if (originalCopyWithUri.children === undefined) {
                    originalCopyWithUri.children = [];
                }
                originalCopyWithUri.children.push({
                    componentType: "externalContent",
                    children: JSON.parse(
                        JSON.stringify(serializedComponentsForCid),
                    ),
                    attributes: { newNamespace: { primitive: true } },
                    doenetAttributes: { createUniqueName: true },
                });
            }
        }
    }

    return {
        cids,
        fullSerializedComponents: arrayOfSerializedComponents,
    };
}

function cidsToDoenetMLs(cids) {
    let promises = [];
    let newCids = cids;

    for (let cid of cids) {
        promises.push(retrieveTextFileForCid(cid, "doenet"));
    }

    return Promise.all(promises)
        .then((newDoenetMLs) => {
            // console.log({ newDoenetMLs, newCids })
            return Promise.resolve({ newDoenetMLs, newCids });
        })
        .catch((err) => {
            let message;
            if (newCids.length === 1) {
                message = `Could not retrieve cid ${newCids[0]}`;
            } else {
                message = `Could not retrieve cids ${newCids.join(",")}`;
            }

            message += ": " + err.message;

            console.error(message);

            return Promise.reject(new Error(message));
        });
}

export function removeBlankStringChildren(
    serializedComponents,
    componentInfoObjects,
) {
    for (let component of serializedComponents) {
        if (component.children) {
            let componentClass =
                componentInfoObjects.allComponentClasses[
                    component.componentType
                ];
            if (componentClass && !componentClass.includeBlankStringChildren) {
                component.children = component.children.filter(
                    (x) => typeof x !== "string" || x.trim() !== "",
                );
            }

            removeBlankStringChildren(component.children, componentInfoObjects);
        }

        // TODO: do we also need to remove blank string components
        // from childrenForComponent of an attribute that is not yet a component?
        for (let attrName in component.attributes) {
            let comp = component.attributes[attrName].component;
            if (comp && comp.children) {
                removeBlankStringChildren([comp], componentInfoObjects);
            }
        }
    }
}

function findContentCopies({ serializedComponents }) {
    let cidComponents = {};
    for (let serializedComponent of serializedComponents) {
        if (serializedComponent.componentType === "copy") {
            if (
                serializedComponent.attributes &&
                serializedComponent.attributes.uri
            ) {
                let uri = serializedComponent.attributes.uri.primitive;

                if (uri && uri.substring(0, 7).toLowerCase() === "doenet:") {
                    let result = uri.match(/[:&]cid=([^&]+)/i);
                    if (result) {
                        let cid = result[1];
                        if (cidComponents[cid] === undefined) {
                            cidComponents[cid] = [];
                        }
                        cidComponents[cid].push(serializedComponent);
                    }
                }
            }
        } else {
            if (serializedComponent.children !== undefined) {
                let results = findContentCopies({
                    serializedComponents: serializedComponent.children,
                });

                // append results on to cidComponents
                for (let cid in results.cidComponents) {
                    if (cidComponents[cid] === undefined) {
                        cidComponents[cid] = [];
                    }
                    cidComponents[cid].push(...results.cidComponents[cid]);
                }
            }
        }
    }
    return { cidComponents };
}

export function addDocumentIfItsMissing(serializedComponents) {
    if (
        serializedComponents.length !== 1 ||
        serializedComponents[0].componentType !== "document"
    ) {
        let components = serializedComponents.splice(0);
        serializedComponents.push({
            componentType: "document",
            children: components,
        });
    }
}

function substituteDeprecations(serializedComponents) {
    // Note: use lower case for keys
    let deprecatedPropertySubstitutions = {
        tname: "target",
        triggerwithtnames: "triggerWithTargets",
        updatewithtname: "updateWithTarget",
        paginatortname: "paginator",
        randomizeorder: "shuffleOrder",
    };

    for (let component of serializedComponents) {
        if (typeof component !== "object") {
            continue;
        }

        if (component.props) {
            let retry = true;
            while (retry) {
                retry = false;
                for (let prop in component.props) {
                    let propLower = prop.toLowerCase();

                    if (propLower in deprecatedPropertySubstitutions) {
                        let newProp =
                            deprecatedPropertySubstitutions[propLower];

                        console.warn(
                            `Attribute ${prop} is deprecated.  Use ${newProp} instead.`,
                        );

                        component.props[newProp] = component.props[prop];
                        delete component.props[prop];

                        // since modified object over which are looping
                        // break out of loop and start over
                        retry = true;
                        break;
                    }
                }
            }
        }

        if (component.children) {
            substituteDeprecations(component.children);
        }
    }
}

function cleanIfHaveJustDocument(serializedComponents) {
    let componentsWithoutBlankStrings = serializedComponents.filter(
        (x) => typeof x !== "string" || x.trim() !== "",
    );

    if (
        componentsWithoutBlankStrings.length === 1 &&
        componentsWithoutBlankStrings[0].componentType === "document"
    ) {
        return componentsWithoutBlankStrings;
    } else {
        return serializedComponents;
    }
}

function correctComponentTypeCapitalization(
    serializedComponents,
    componentTypeLowerCaseMapping,
) {
    //special case for macros before application
    // componentTypeLowerCaseMapping["macro"] = "macro";
    for (let component of serializedComponents) {
        if (typeof component !== "object") {
            continue;
        }

        let componentTypeFixed =
            componentTypeLowerCaseMapping[
                component.componentType.toLowerCase()
            ];

        if (componentTypeFixed) {
            component.componentType = componentTypeFixed;
        } else {
            throw Error(
                `Invalid component type${indexRangeString(component)}: ${
                    component.componentType
                }`,
            );
        }

        if (component.children) {
            correctComponentTypeCapitalization(
                component.children,
                componentTypeLowerCaseMapping,
            );
        }
    }
}

function createAttributesFromProps(serializedComponents, componentInfoObjects) {
    for (let component of serializedComponents) {
        if (typeof component !== "object") {
            continue;
        }

        let componentClass =
            componentInfoObjects.allComponentClasses[component.componentType];
        let classAttributes = componentClass.createAttributesObject();

        let attributeLowerCaseMapping = {};

        for (let propName in classAttributes) {
            attributeLowerCaseMapping[propName.toLowerCase()] = propName;
        }

        let attributes = {};

        // if there are any props of json that match attributes for component class
        // create the specified components or primitives

        let originalComponentProps = Object.assign({}, component.props);
        if (component.props) {
            for (let prop in component.props) {
                let propName = attributeLowerCaseMapping[prop.toLowerCase()];
                let attrObj = classAttributes[propName];
                if (attrObj) {
                    if (propName in attributes) {
                        throw Error(
                            `Cannot repeat prop ${propName}.  Found in component type ${
                                component.componentType
                            }${indexRangeString(component)}`,
                        );
                    }

                    attributes[propName] = componentFromAttribute({
                        attrObj,
                        value: component.props[prop],
                        originalComponentProps,
                        componentInfoObjects,
                    });
                    delete component.props[prop];
                } else if (
                    !["name", "assignnames", "target"].includes(
                        prop.toLowerCase(),
                    )
                ) {
                    if (componentClass.acceptAnyAttribute) {
                        attributes[prop] = componentFromAttribute({
                            value: component.props[prop],
                            originalComponentProps,
                            componentInfoObjects,
                        });
                    } else {
                        throw Error(
                            `Invalid attribute ${prop} for component of type ${
                                component.componentType
                            }${indexRangeString(component)}`,
                        );
                    }
                }
            }
        }

        // if there are any primitive attributes that define a default value
        // but were not specified via props, add them with their default value

        for (let attrName in classAttributes) {
            let attrObj = classAttributes[attrName];

            if (
                attrObj.createPrimitiveOfType &&
                "defaultPrimitiveValue" in attrObj &&
                !(attrName in attributes)
            ) {
                attributes[attrName] = componentFromAttribute({
                    attrObj,
                    originalComponentProps,
                    value: attrObj.defaultPrimitiveValue.toString(),
                    componentInfoObjects,
                });
            }
        }

        component.attributes = attributes;

        //recurse on children
        if (component.children !== undefined) {
            createAttributesFromProps(component.children, componentInfoObjects);
        }
    }
}

export function componentFromAttribute({
    attrObj,
    value,
    originalComponentProps,
    componentInfoObjects,
}) {
    if (typeof value !== "object") {
        // typically this would mean value is a string.
        // However, if had an attribute with no value, would get true.
        // Also, when get addAttributeComponentsShadowingStateVariables,
        // it is possible their values are not strings
        value = { rawString: value.toString() };
    } else if (value === null) {
        // could get null from addAttributeComponentsShadowingStateVariables
        value = { rawString: "" };
    }

    if (attrObj && attrObj.createComponentOfType) {
        let newComponent;
        let valueTrimLower = value.rawString.trim().toLowerCase();

        if (valueTrimLower === "true" && attrObj.valueForTrue !== undefined) {
            newComponent = {
                componentType: attrObj.createComponentOfType,
                state: { value: attrObj.valueForTrue },
            };
        } else if (
            valueTrimLower === "false" &&
            attrObj.valueForFalse !== undefined
        ) {
            newComponent = {
                componentType: attrObj.createComponentOfType,
                state: { value: attrObj.valueForFalse },
            };
        } else if (
            componentInfoObjects.isInheritedComponentType({
                inheritedComponentType: attrObj.createComponentOfType,
                baseComponentType: "boolean",
            }) &&
            ["true", "false"].includes(valueTrimLower)
        ) {
            newComponent = {
                componentType: attrObj.createComponentOfType,
                state: { value: valueTrimLower === "true" },
            };
        } else {
            let children = value.childrenForComponent;
            if (children) {
                children = JSON.parse(JSON.stringify(children));
            } else {
                children = [value.rawString];
            }
            newComponent = {
                componentType: attrObj.createComponentOfType,
                children,
            };

            removeBlankStringChildren([newComponent], componentInfoObjects);
        }

        if (
            attrObj.attributesForCreatedComponent ||
            attrObj.copyComponentAttributesForCreatedComponent
        ) {
            if (attrObj.attributesForCreatedComponent) {
                newComponent.props = attrObj.attributesForCreatedComponent;
            } else {
                newComponent.props = {};
            }

            if (attrObj.copyComponentAttributesForCreatedComponent) {
                for (let attrName of attrObj.copyComponentAttributesForCreatedComponent) {
                    if (originalComponentProps[attrName]) {
                        newComponent.props[attrName] = JSON.parse(
                            JSON.stringify(originalComponentProps[attrName]),
                        );
                    }
                }
            }

            createAttributesFromProps([newComponent], componentInfoObjects);
        }

        return { component: newComponent };
    } else if (attrObj && attrObj.createPrimitiveOfType) {
        let newPrimitive;
        if (attrObj.createPrimitiveOfType === "boolean") {
            let valueTrimLower = value.rawString.trim().toLowerCase();
            newPrimitive = valueTrimLower === "true";
        } else if (attrObj.createPrimitiveOfType === "number") {
            newPrimitive = Number(value.rawString);
        } else if (attrObj.createPrimitiveOfType === "integer") {
            newPrimitive = Math.round(Number(value.rawString));
        } else if (attrObj.createPrimitiveOfType === "stringArray") {
            newPrimitive = value.rawString.trim().split(/\s+/);
        } else if (attrObj.createPrimitiveOfType === "numberArray") {
            newPrimitive = value.rawString.split(/\s+/).map(Number);
        } else {
            // else assume string
            newPrimitive = value.rawString;
        }

        if (attrObj.validationFunction) {
            newPrimitive = attrObj.validationFunction(newPrimitive);
        }
        return { primitive: newPrimitive };
    } else {
        if (!value.childrenForComponent) {
            value.childrenForComponent = [value.rawString];
        }
        return value;
    }
}

function findPreSugarIndsAndMarkFromSugar(components) {
    let preSugarIndsFound = [];
    for (let component of components) {
        if (typeof component !== "object") {
            continue;
        }
        if (component.preSugarInd !== undefined) {
            preSugarIndsFound.push(component.preSugarInd);
        } else {
            if (!component.doenetAttributes) {
                component.doenetAttributes = {};
            }
            component.doenetAttributes.createdFromSugar = true;
            if (component.children) {
                let inds = findPreSugarIndsAndMarkFromSugar(component.children);
                preSugarIndsFound.push(...inds);
            }
        }
    }

    return preSugarIndsFound;
}

export function applyMacros(serializedComponents, componentInfoObjects) {
    for (let component of serializedComponents) {
        if (component.children) {
            applyMacros(component.children, componentInfoObjects);
        }
        if (component.attributes) {
            for (let attrName in component.attributes) {
                let attribute = component.attributes[attrName];
                if (attribute.component) {
                    let comp = attribute.component;
                    if (comp.children) {
                        applyMacros(comp.children, componentInfoObjects);
                    }
                } else if (attribute.childrenForComponent) {
                    applyMacros(
                        attribute.childrenForComponent,
                        componentInfoObjects,
                    );
                }
            }
        }
    }

    substituteMacros(serializedComponents, componentInfoObjects);
}

function substituteMacros(serializedComponents, componentInfoObjects) {
    for (
        let componentInd = 0;
        componentInd < serializedComponents.length;
        componentInd++
    ) {
        let component = serializedComponents[componentInd];

        if (typeof component === "string") {
            let startInd = 0;
            while (startInd < component.length) {
                let str = component;
                let result = findFirstFullMacroInString(str.slice(startInd));

                if (!result.success) {
                    break;
                }

                let firstIndMatched = result.firstIndMatched + startInd;
                let matchLength = result.matchLength;
                let nDollarSigns = result.nDollarSigns;

                let componentsFromMacro;

                if (result.additionalAttributes) {
                    let newDoenetML = `<copy target="${result.targetName}" ${result.additionalAttributes} />`;

                    let newComponents;

                    try {
                        newComponents = parseAndCompile(newDoenetML);
                    } catch (e) {
                        let strWithError = str.slice(
                            firstIndMatched,
                            firstIndMatched + matchLength,
                        );
                        let startInd = firstIndMatched;
                        if (
                            componentInd > 0 &&
                            serializedComponents[componentInd - 1].range
                        ) {
                            let previousRange =
                                serializedComponents[componentInd - 1].range;
                            if (previousRange.closeEnd) {
                                startInd += previousRange.closeEnd;
                            } else if (previousRange.selfCloseEnd) {
                                startInd += previousRange.selfCloseBegin;
                            }
                        }

                        throw Error(
                            `Error in macro at indices ${startInd}-${
                                startInd + matchLength
                            }.  Found: ${strWithError}`,
                        );
                    }

                    createAttributesFromProps(
                        newComponents,
                        componentInfoObjects,
                    );
                    markCreatedFromMacro(newComponents);

                    // recurse in case there were more macros in the additionalAttributes
                    applyMacros(newComponents, componentInfoObjects);

                    componentsFromMacro = newComponents;
                } else {
                    // no additional attributes, so no need to reparse

                    let doenetAttributes = {
                        target: result.targetName,
                        createdFromMacro: true,
                    };

                    // check here if additionalAttributes is undefined
                    // (even though know it is falsy)
                    // so that an empty string removes the default isPlainMacro
                    if (result.additionalAttributes === undefined) {
                        doenetAttributes.isPlainMacro = true;
                    }

                    componentsFromMacro = [
                        {
                            componentType: "copy",
                            doenetAttributes,
                        },
                    ];
                }

                let nComponentsToRemove = 1;
                let stringToAddAtEnd = str.substring(
                    firstIndMatched + matchLength,
                );

                if (nDollarSigns === 2) {
                    let matchOpeningParens = str
                        .slice(firstIndMatched + matchLength)
                        .match(/^\s*\(/);

                    if (!matchOpeningParens) {
                        // if don't match function,
                        // don't replace double dollar sign macro
                        startInd = firstIndMatched + 2;
                        continue;
                    }

                    let matchLengthWithOpeningParens =
                        matchLength + matchOpeningParens[0].length;

                    // look for a closing parenthesis

                    // get array of the component with the rest of this string
                    // plus the rest of the components in the array
                    let remainingComponents = [];
                    let includeFirstInRemaining = false;

                    if (
                        str.length >
                        firstIndMatched + matchLengthWithOpeningParens
                    ) {
                        includeFirstInRemaining = true;
                        remainingComponents.push(
                            str.substring(
                                firstIndMatched + matchLengthWithOpeningParens,
                            ),
                        );
                    }

                    remainingComponents.push(
                        ...serializedComponents.slice(componentInd + 1),
                    );

                    let evaluateResult =
                        createEvaluateIfFindMatchedClosingParens({
                            componentsFromMacro,
                            remainingComponents,
                            includeFirstInRemaining,
                            componentInfoObjects,
                        });

                    if (!evaluateResult.success) {
                        // if couldn't create evaluate,
                        // don't replace double dollar macro
                        startInd = firstIndMatched + 2;
                        continue;
                    }

                    componentsFromMacro = evaluateResult.componentsFromMacro;

                    nComponentsToRemove =
                        evaluateResult.lastComponentIndMatched + 1;
                    if (!includeFirstInRemaining) {
                        nComponentsToRemove++;
                    }

                    // leftover string already included in componentsFromMacro
                    stringToAddAtEnd = "";
                }

                let replacements = [];

                // the string before the function name
                if (firstIndMatched > 0) {
                    replacements.push(str.substring(0, firstIndMatched));
                }

                replacements.push(...componentsFromMacro);

                if (stringToAddAtEnd.length > 0) {
                    replacements.push(stringToAddAtEnd);
                }

                // splice new replacements into serializedComponents
                serializedComponents.splice(
                    componentInd,
                    nComponentsToRemove,
                    ...replacements,
                );

                if (firstIndMatched > 0) {
                    // increment componentInd because we now have to skip
                    // over two components
                    // (the component made from the beginning of the string
                    // as well as the component made from the macro)
                    componentInd++;
                }

                // break out of loop processing string,
                // as finished current one
                // (possibly breaking it into pieces, so will address remainder as other component)

                break;
            }
        }
    }
}

function findFirstFullMacroInString(str) {
    // One or two $ follwed by either
    // - a word (starting with a letter), capturing word as third group, or
    // - an identifier in parentheses, capturing identifier as fourth group,
    //   where the closing parenthesis could be replaced by an open brace,
    //   capturing the open brace or closing parens as fifth group
    let reForBeginning =
        /(\$\$?)(([a-zA-Z_]\w*\b)|\(([a-zA-Z0-9_:.\/\-]+)\s*(\)|{))/;

    let offset = 0;
    let match;

    // since Safari doesn't allow a negative lookbehind to make sure
    // that match isn't preceeded by third dollar sign,
    // we instead just skip any matches that include a third dollar sign
    while (true) {
        // look for a function macro
        match = str.substring(offset).match(reForBeginning);

        if (!match) {
            return { success: false };
        }

        if (match.index === 0 || str[offset + match.index - 1] !== "$") {
            break;
        }

        // found a third dollar sign preceeding match
        // so skip this match and look for another match later in the string
        offset += match.index + match[0].length;
    }

    let firstIndMatched = match.index + offset;
    let matchLength = match[0].length;
    let nDollarSigns = match[1].length;

    if (match[3]) {
        // found word outside parans
        return {
            success: true,
            firstIndMatched,
            matchLength,
            targetName: match[3],
            nDollarSigns,
        };
    }

    // found identifier in parens
    let targetName = match[4];

    if (match[5] === ")") {
        // found closing parens
        return {
            success: true,
            firstIndMatched,
            matchLength,
            targetName,
            nDollarSigns,
        };
    }

    // have opening brace rather than closing parens
    // need to find matching closing brace and parens

    let strAfterMatch = str.substring(firstIndMatched + matchLength);

    let resultForClosingBrace =
        findFirstUnmatchedClosingBraceParen(strAfterMatch);

    if (resultForClosingBrace.success) {
        // found matching closing brace and parens
        // return string enclosed by braces as additional attributes
        return {
            success: true,
            firstIndMatched,
            matchLength: matchLength + resultForClosingBrace.parenInd + 1,
            targetName,
            nDollarSigns,
            additionalAttributes: strAfterMatch.substring(
                0,
                resultForClosingBrace.braceInd,
            ),
        };
    } else {
        // the beginning found didn't end up matching the pattern,
        // so we ignore that match and see if there is another one in the rest of the string
        let findAnotherResult = findFirstFullMacroInString(strAfterMatch);

        if (!findAnotherResult.success) {
            // the rest of the string didn't have a match, so no match in the original string
            return { success: false };
        }

        // return match found in rest of string, with indices adjusted to be for original string
        return {
            success: true,
            firstIndMatched:
                firstIndMatched +
                matchLength +
                findAnotherResult.firstIndMatched,
            matchLength: findAnotherResult.matchLength,
            targetName: findAnotherResult.targetName,
            nDollarSigns: findAnotherResult.nDollarSigns,
            additionalAttributes: findAnotherResult.additionalAttributes,
        };
    }
}

function findFirstUnmatchedClosingBraceParen(strAfterMatch) {
    let nBraces = 0;

    for (let ind = 0; ind < strAfterMatch.length; ind++) {
        let char = strAfterMatch[ind];
        if (char === "}") {
            if (nBraces === 0) {
                // found unmatched closing brace
                // now need next non whitespace character to be closing parenthesis

                if (strAfterMatch.substring(ind + 1).trim()[0] === ")") {
                    let parenInd =
                        strAfterMatch.substring(ind + 1).indexOf(")") + ind + 1;
                    return { success: true, braceInd: ind, parenInd };
                }
                // found closing brace, but not followed by closing parens
                return { success: false };
            }
            nBraces--;
        } else if (char === "{") {
            nBraces++;
        }
    }

    return { success: false };
}

function markCreatedFromMacro(serializedComponents) {
    for (let serializedComponent of serializedComponents) {
        if (!serializedComponent.doenetAttributes) {
            serializedComponent.doenetAttributes = {};
        }
        serializedComponent.doenetAttributes.createdFromMacro = true;

        if (serializedComponent.children) {
            markCreatedFromMacro(serializedComponent.children);
        }
    }
}

function createEvaluateIfFindMatchedClosingParens({
    componentsFromMacro,
    remainingComponents,
    includeFirstInRemaining,
    componentInfoObjects,
}) {
    let result = findFirstUnmatchedClosingParens(remainingComponents);

    if (!result.success) {
        return result;
    }
    // found unmatched closing parenthesis, so is the one
    // matching the opening parenthesis

    let lastComponentInd = result.componentInd;

    remainingComponents = remainingComponents.slice(0, lastComponentInd + 1);

    let lastComponentOfFunction = remainingComponents[lastComponentInd];

    let stringAfterFunction = "";

    // if have text after closing parenthesis
    // save in stringAfterFunction
    if (result.charInd + 1 < lastComponentOfFunction.length) {
        stringAfterFunction = lastComponentOfFunction.substring(
            result.charInd + 1,
        );
    }

    // remove closing parenthesis and any subsequent text
    // from the last component
    if (result.charInd > 0) {
        remainingComponents[lastComponentInd] =
            lastComponentOfFunction.substring(0, result.charInd);
    } else {
        // remove this component altogether as there is nothing left
        remainingComponents = remainingComponents.slice(0, lastComponentInd);
    }

    let breakResults = breakEmbeddedStringByCommas({
        childrenList: remainingComponents,
    });

    // recurse on pieces
    breakResults.pieces.forEach((x) => applyMacros(x, componentInfoObjects));

    let inputArray = breakResults.pieces.map((x) => {
        if (x.length === 1 && typeof x[0] !== "string") {
            return x[0];
        } else {
            return {
                componentType: "math",
                doenetAttributes: { createdFromMacro: true },
                children: x,
            };
        }
    });

    let evaluateComponent = {
        componentType: "evaluate",
        doenetAttributes: { createdFromMacro: true },
        attributes: {
            function: {
                component: {
                    componentType: "function",
                    doenetAttributes: { createdFromMacro: true },
                    children: componentsFromMacro,
                },
            },
            input: {
                component: {
                    componentType: "mathList",
                    doenetAttributes: { createdFromMacro: true },
                    children: inputArray,
                },
            },
        },
    };

    let replacements = [evaluateComponent];

    // if have text after function
    // include string component at end containing that text
    if (stringAfterFunction.length > 0) {
        replacements.push(stringAfterFunction);
    }

    return {
        success: true,
        componentsFromMacro: replacements,
        lastComponentIndMatched: lastComponentInd,
    };
}

function findFirstUnmatchedClosingParens(components) {
    let Nparens = 0;

    for (let [componentInd, component] of components.entries()) {
        if (typeof component === "string") {
            let s = component;

            for (let charInd = 0; charInd < s.length; charInd++) {
                let char = s[charInd];
                if (char === "(") {
                    Nparens++;
                } else if (char === ")") {
                    if (Nparens === 0) {
                        // parens didn't match
                        return {
                            success: true,
                            componentInd,
                            charInd,
                        };
                    } else {
                        Nparens--;
                    }
                }
            }
        }
    }

    // never found a closing parenthesis that wasn't matched
    return { success: false };
}

function decodeXMLEntities(serializedComponents) {
    function replaceEntities(s) {
        return s
            .replace(/&apos;/g, "'")
            .replace(/&quot;/g, '"')
            .replace(/&gt;/g, ">")
            .replace(/&lt;/g, "<")
            .replace(/&dollar;/g, "$")
            .replace(/&amp;/g, "&");
    }

    for (let [ind, serializedComponent] of serializedComponents.entries()) {
        if (typeof serializedComponent === "string") {
            serializedComponents[ind] = replaceEntities(serializedComponent);
        } else {
            if (serializedComponent.children) {
                decodeXMLEntities(serializedComponent.children);
            }

            if (serializedComponent.attributes) {
                for (let attrName in serializedComponent.attributes) {
                    let attribute = serializedComponent.attributes[attrName];

                    if (attribute.component) {
                        decodeXMLEntities([attribute.component]);
                    } else if (attribute.primitive) {
                        if (typeof attribute.primitive === "string") {
                            attribute.primitive = replaceEntities(
                                attribute.primitive,
                            );
                        }
                    } else {
                        if (attribute.childrenForComponent) {
                            decodeXMLEntities(attribute.childrenForComponent);
                        }
                        if (attribute.rawString) {
                            attribute.rawString = replaceEntities(
                                attribute.rawString,
                            );
                        }
                    }
                }
            }
        }
    }
}

export function applySugar({
    serializedComponents,
    parentParametersFromSugar = {},
    parentAttributes = {},
    componentInfoObjects,
    parentUniqueId = "",
    isAttributeComponent = false,
}) {
    for (let [componentInd, component] of serializedComponents.entries()) {
        if (typeof component !== "object") {
            continue;
        }

        let componentType = component.componentType;
        let componentClass =
            componentInfoObjects.allComponentClasses[componentType];
        if (!componentClass) {
            throw Error(`Unrecognized component type ${componentType}`);
        }
        let uniqueId = parentUniqueId + "|" + componentType + componentInd;

        let componentAttributes = {};
        // add primitive attributes to componentAttributes
        for (let attrName in component.attributes) {
            let attribute = component.attributes[attrName];
            if (attribute.primitive !== undefined) {
                componentAttributes[attrName] = attribute.primitive;
            }
        }

        if (component.children) {
            let newParentParametersFromSugar = {};

            if (!component.skipSugar) {
                for (let [sugarInd, sugarInstruction] of componentClass
                    .returnSugarInstructions()
                    .entries()) {
                    // if (component.children.length === 0) {
                    //   break;
                    // }

                    let childTypes = component.children
                        .map((x) => (typeof x === "string" ? "s" : "n"))
                        .join("");

                    if (sugarInstruction.childrenRegex) {
                        let match = childTypes.match(
                            sugarInstruction.childrenRegex,
                        );

                        if (
                            !match ||
                            match[0].length !== component.children.length
                        ) {
                            // sugar pattern didn't match all children
                            // so don't apply sugar

                            continue;
                        }
                    }

                    let matchedChildren = deepClone(component.children);

                    let nNonStrings = 0;
                    for (let child of matchedChildren) {
                        if (typeof child !== "string") {
                            child.preSugarInd = nNonStrings;
                            nNonStrings++;
                        }
                    }

                    let createdFromMacro = false;
                    if (
                        component.doenetAttributes &&
                        component.doenetAttributes.createdFromMacro
                    ) {
                        createdFromMacro = true;
                    }

                    let sugarResults = sugarInstruction.replacementFunction({
                        matchedChildren,
                        parentParametersFromSugar,
                        parentAttributes,
                        componentAttributes,
                        uniqueId: uniqueId + "|sugar" + sugarInd,
                        componentInfoObjects,
                        isAttributeComponent,
                        createdFromMacro,
                    });

                    // console.log("sugarResults")
                    // console.log(sugarResults)

                    if (sugarResults.success) {
                        let newChildren = sugarResults.newChildren;
                        let newAttributes = sugarResults.newAttributes;

                        let preSugarIndsFoundInChildren = [],
                            preSugarIndsFoundInAttributes = [];

                        if (newChildren) {
                            preSugarIndsFoundInChildren =
                                findPreSugarIndsAndMarkFromSugar(newChildren);
                        }
                        if (newAttributes) {
                            for (let attrName in newAttributes) {
                                let comp = newAttributes[attrName].component;
                                if (comp) {
                                    preSugarIndsFoundInAttributes.push(
                                        ...findPreSugarIndsAndMarkFromSugar(
                                            comp.children,
                                        ),
                                    );
                                }
                            }
                        }

                        let preSugarIndsFound = [
                            ...preSugarIndsFoundInChildren,
                            ...preSugarIndsFoundInAttributes,
                        ];

                        if (
                            preSugarIndsFound.length !== nNonStrings ||
                            !preSugarIndsFound
                                .sort((a, b) => a - b)
                                .every((v, i) => v === i)
                        ) {
                            throw Error(
                                `Invalid sugar for ${componentType} as didn't return set of original components`,
                            );
                        }

                        if (preSugarIndsFoundInChildren.length > 0) {
                            let sortedList = [
                                ...preSugarIndsFoundInChildren,
                            ].sort((a, b) => a - b);
                            if (
                                !sortedList.every(
                                    (v, i) =>
                                        v === preSugarIndsFoundInChildren[i],
                                )
                            ) {
                                throw Error(
                                    `Invalid sugar for ${componentType} as didn't return original components in order`,
                                );
                            }
                        }

                        if (sugarResults.parametersForChildrenSugar) {
                            Object.assign(
                                newParentParametersFromSugar,
                                sugarResults.parametersForChildrenSugar,
                            );
                        }

                        if (newChildren) {
                            component.children = newChildren;
                        } else {
                            component.children = [];
                        }

                        if (newAttributes) {
                            if (!component.attributes) {
                                component.attributes = {};
                            }
                            Object.assign(component.attributes, newAttributes);
                        }
                    }
                }
            }

            if (componentClass.removeBlankStringChildrenPostSugar) {
                component.children = component.children.filter(
                    (x) => typeof x !== "string" || /\S/.test(x),
                );
            }

            // Note: don't pass in isAttributeComponent
            // as that flag should be set just for the top level attribute component

            applySugar({
                serializedComponents: component.children,
                parentParametersFromSugar: newParentParametersFromSugar,
                parentAttributes: componentAttributes,
                componentInfoObjects,
                parentUniqueId: uniqueId,
            });
        }

        if (component.attributes) {
            for (let attrName in component.attributes) {
                let attribute = component.attributes[attrName];

                if (attribute.component) {
                    applySugar({
                        serializedComponents: [attribute.component],
                        parentAttributes: componentAttributes,
                        componentInfoObjects,
                        parentUniqueId: uniqueId,
                        isAttributeComponent: true,
                    });
                }
            }
        }
    }
}

function breakStringInPiecesBySpacesOrParens(string) {
    if (typeof string !== "string") {
        return { success: false };
    }

    let Nparens = 0;
    let pieces = [];

    string = string.trim();
    let beginInd = 0;

    for (let ind = 0; ind < string.length; ind++) {
        let char = string[ind];
        if (char === "(") {
            if (Nparens === 0) {
                // beginning new parens piece
                // what have so far is a new piece
                let newPiece = string.substring(beginInd, ind).trim();
                if (newPiece.length > 0) {
                    pieces.push(newPiece);
                }
                beginInd = ind;
            }

            Nparens++;
        } else if (char === ")") {
            if (Nparens === 0) {
                // parens didn't match, so return failure
                return { success: false };
            }
            if (Nparens === 1) {
                // found end of piece in parens
                let newPiece = string.substring(beginInd + 1, ind).trim();
                if (newPiece.length > 0) {
                    // try to break further
                    let result = breakStringInPiecesBySpacesOrParens(newPiece);
                    if (result.success === true) {
                        pieces.push(result.pieces);
                    } else {
                        pieces.push(newPiece);
                    }
                }
                beginInd = ind + 1;
            }
            Nparens--;
        } else if (Nparens === 0 && char.match(/\s/)) {
            // not in parens and found a space so potentially have a new piece
            let newPiece = string.substring(beginInd, ind).trim();
            if (newPiece.length > 0) {
                pieces.push(newPiece);
            }
            beginInd = ind;
        }
    }

    // parens didn't match, so return failure
    if (Nparens !== 0) {
        return { success: false };
    }

    let newPiece = string.substring(beginInd, string.length).trim();
    if (newPiece.length > 0) {
        pieces.push(newPiece);
    }

    return {
        success: true,
        pieces: pieces,
    };
}

export function createComponentNames({
    serializedComponents,
    namespaceStack = [],
    componentInfoObjects,
    parentDoenetAttributes = {},
    parentName,
    useOriginalNames = false,
    doenetAttributesByTargetComponentName,
    indOffset = 0,
    createNameContext = "",
}) {
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

        let prescribedName = doenetAttributes.prescribedName;
        let assignNames = doenetAttributes.assignNames;
        let target = doenetAttributes.target;
        // let propName = doenetAttributes.propName;
        // let type = doenetAttributes.type;
        // let alias = doenetAttributes.alias;
        // let indexAlias = doenetAttributes.indexAlias;

        let mustCreateUniqueName =
            doenetAttributes.isAttributeChild ||
            doenetAttributes.createdFromSugar ||
            doenetAttributes.createdFromMacro ||
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
                        prescribedName = props[key];
                        delete props[key];
                    } else {
                        throw Error(
                            `Cannot define name twice.  Found in component of type ${
                                serializedComponent.componentType
                            }${indexRangeString(serializedComponent)}`,
                        );
                    }
                } else if (lowercaseKey === "assignnames") {
                    if (assignNames === undefined) {
                        let result = breakStringInPiecesBySpacesOrParens(
                            props[key],
                        );
                        if (result.success) {
                            assignNames = result.pieces;
                        } else {
                            throw Error(
                                `Invalid format for assignnames.  Found in component of type ${
                                    serializedComponent.componentType
                                }${indexRangeString(serializedComponent)}`,
                            );
                        }
                        delete props[key];
                    } else {
                        throw Error(
                            `Cannot define assignNames twice for a component.  Found in component of type ${
                                serializedComponent.componentType
                            }${indexRangeString(serializedComponent)}`,
                        );
                    }
                } else if (lowercaseKey === "target") {
                    if (target === undefined) {
                        if (typeof props[key] !== "string") {
                            throw Error(
                                `Must specify value for target.  Found in component of type ${
                                    serializedComponent.componentType
                                }${indexRangeString(serializedComponent)}`,
                            );
                        }
                        target = props[key].trim();
                        delete props[key];
                    } else {
                        throw Error(
                            `Cannot define target twice for a component.  Found in component of type ${
                                serializedComponent.componentType
                            }${indexRangeString(serializedComponent)}`,
                        );
                    }
                }
            }
        }

        if (prescribedName) {
            if (
                !prescribedNameFromDoenetAttributes &&
                !doenetAttributes.createdFromSugar
            ) {
                if (!/[a-zA-Z]/.test(prescribedName.substring(0, 1))) {
                    throw Error(
                        `Invalid component name: ${prescribedName}.  Component name must begin with a letter.  Found in component of type ${
                            serializedComponent.componentType
                        }${indexRangeString(serializedComponent)}`,
                    );
                }
                if (!/^[a-zA-Z0-9_\-]+$/.test(prescribedName)) {
                    throw Error(
                        `Invalid component name: ${prescribedName}.  Component name can contain only letters, numbers, hyphens, and underscores.  Found in component of type ${
                            serializedComponent.componentType
                        }${indexRangeString(serializedComponent)}`,
                    );
                }
            }

            // name was specified
            // put it into doenetAttributes
            doenetAttributes.prescribedName = prescribedName;
        } else if (mustCreateUniqueName) {
            let longNameId = parentName + "|createUniqueName|";

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
            serializedComponent.originalDoenetAttributes &&
            serializedComponent.originalDoenetAttributes.assignNames
        ) {
            assignNames =
                serializedComponent.originalDoenetAttributes.assignNames;
        }

        if (assignNames) {
            let assignNamesToReplacements =
                componentClass.assignNamesToReplacements;
            if (!assignNamesToReplacements) {
                throw Error(
                    `Cannot assign names for component type ${
                        serializedComponent.componentType
                    }${indexRangeString(serializedComponent)}`,
                );
            }

            // assignNames was specified
            // put in doenetAttributes as assignNames array
            doenetAttributes.assignNames = assignNames;

            if (!doenetAttributes.createUniqueAssignNames) {
                let flattedNames = flattenDeep(assignNames);
                for (let name of flattedNames) {
                    if (!/[a-zA-Z]/.test(name.substring(0, 1))) {
                        throw Error(
                            `All assigned names must begin with a letter.  Found in component of type ${
                                serializedComponent.componentType
                            }${indexRangeString(serializedComponent)}`,
                        );
                    }
                    if (!/^[a-zA-Z0-9_\-]+$/.test(name)) {
                        throw Error(
                            `Assigned names can contain only letters, numbers, hyphens, and underscores.  Found in component of type ${
                                serializedComponent.componentType
                            }${indexRangeString(serializedComponent)}`,
                        );
                    }
                }
                // check if unique names
                if (flattedNames.length !== new Set(flattedNames).size) {
                    throw Error(
                        `Duplicate assigned names.  Found in component of type ${
                            serializedComponent.componentType
                        }${indexRangeString(serializedComponent)}`,
                    );
                }
            }
        }

        if (newNamespace) {
            // newNamespace was specified
            // put in attributes as boolean
            attributes.newNamespace = { primitive: newNamespace };
        }

        let count = currentNamespace.componentCounts[componentType];
        if (count === undefined) {
            count = 0;
        }

        // if created from a attribute/sugar/macro, don't include in component counts
        if (
            !(
                doenetAttributes.isAttributeChild ||
                doenetAttributes.createdFromSugar ||
                doenetAttributes.createdFromMacro
            )
        ) {
            currentNamespace.componentCounts[componentType] = ++count;
        }

        let componentName = "";
        for (let l = 0; l <= level; l++) {
            componentName += namespaceStack[l].namespace + "/";
        }
        if (!prescribedName) {
            if (useOriginalNames) {
                if (serializedComponent.originalName) {
                    let lastInd =
                        serializedComponent.originalName.lastIndexOf("/");
                    prescribedName = serializedComponent.originalName.substring(
                        lastInd + 1,
                    );
                    // } else if (serializedComponent.componentName) {
                    //   let lastInd = serializedComponent.componentName.lastIndexOf("/");
                    //   prescribedName = serializedComponent.componentName.substring(lastInd + 1);
                }
            }
            if (!prescribedName) {
                prescribedName = "_" + componentType.toLowerCase() + count;
            }
        }

        componentName += prescribedName;

        serializedComponent.componentName = componentName;
        if (prescribedName) {
            if (prescribedName in currentNamespace.namesUsed) {
                throw Error(
                    `Duplicate component name ${componentName}.  Found in component of type ${
                        serializedComponent.componentType
                    }${indexRangeString(serializedComponent)}`,
                );
            }
            currentNamespace.namesUsed[prescribedName] = true;
        }

        // if newNamespace is false,
        // then register assignNames as belonging to current namespace
        if (!newNamespace) {
            if (assignNames) {
                for (let name of flattenDeep(assignNames)) {
                    if (name in currentNamespace.namesUsed) {
                        throw Error(
                            `Duplicate component name ${name} (from assignNames of ${componentName}).  Found in component of type ${
                                serializedComponent.componentType
                            }${indexRangeString(serializedComponent)}`,
                        );
                    }
                    currentNamespace.namesUsed[name] = true;
                }
            }
        }

        if (
            serializedComponent.doenetAttributes.createUniqueAssignNames &&
            serializedComponent.originalName
        ) {
            let originalAssignNames =
                serializedComponent.doenetAttributes.assignNames;
            if (!originalAssignNames) {
                originalAssignNames =
                    serializedComponent.doenetAttributes.originalAssignNames;
            }

            let longNameIdBase =
                componentName + "|createUniqueName|assignNames|";

            let namespace = "";
            let oldNamespace;
            if (!newNamespace) {
                for (let l = 0; l <= level; l++) {
                    namespace += namespaceStack[l].namespace + "/";
                }
                let lastInd = serializedComponent.originalName.lastIndexOf("/");
                oldNamespace = serializedComponent.originalName.slice(
                    0,
                    lastInd + 1,
                );
            } else {
                namespace = componentName + "/";
                oldNamespace = serializedComponent.originalName + "/";
            }

            let newAssignNames = createNewAssignNamesAndRenameMatchingTNames({
                originalAssignNames,
                longNameIdBase,
                namespace,
                oldNamespace,
                doenetAttributesByTargetComponentName,
            });

            assignNames = serializedComponent.doenetAttributes.assignNames =
                newAssignNames;
        }

        renameMatchingTNames(
            serializedComponent,
            doenetAttributesByTargetComponentName,
        );

        if (target) {
            if (!componentClass.acceptTarget) {
                throw Error(
                    `Component type ${componentType} does not accept a target attribute.   Found in component ${componentName}${indexRangeString(
                        serializedComponent,
                    )}`,
                );
            }

            if (target.includes("|")) {
                throw Error(
                    `target cannot include |.  Found in component of type ${
                        serializedComponent.componentType
                    }${indexRangeString(serializedComponent)}`,
                );
            }

            // convert target to full name
            doenetAttributes.target = target;

            doenetAttributes.targetComponentName = convertComponentTarget({
                target,
                oldTargetComponentName: doenetAttributes.targetComponentName,
                namespaceStack,
                acceptDoubleUnderscore: doenetAttributes.createdFromSugar,
            });
        }

        if (serializedComponent.children) {
            // recurse on child, creating new namespace if specified

            if (!newNamespace) {
                createComponentNames({
                    serializedComponents: serializedComponent.children,
                    namespaceStack,
                    componentInfoObjects,
                    parentDoenetAttributes: doenetAttributes,
                    parentName: componentName,
                    useOriginalNames,
                    doenetAttributesByTargetComponentName,
                });
            } else {
                // if newNamespace, then need to make sure that assigned names
                // don't conflict with new names added,
                // so include in namesused
                let namesUsed = {};
                if (assignNames) {
                    flattenDeep(assignNames).forEach(
                        (x) => (namesUsed[x] = true),
                    );
                }

                let newNamespaceInfo = {
                    namespace: prescribedName,
                    componentCounts: {},
                    namesUsed,
                };
                namespaceStack.push(newNamespaceInfo);
                createComponentNames({
                    serializedComponents: serializedComponent.children,
                    namespaceStack,
                    componentInfoObjects,
                    parentDoenetAttributes: doenetAttributes,
                    parentName: componentName,
                    useOriginalNames,
                    doenetAttributesByTargetComponentName,
                });
                namespaceStack.pop();
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

                    comp.doenetAttributes.isAttributeChild = true;

                    createComponentNames({
                        serializedComponents: [comp],
                        namespaceStack,
                        componentInfoObjects,
                        parentDoenetAttributes: doenetAttributes,
                        parentName: componentName,
                        useOriginalNames,
                        doenetAttributesByTargetComponentName,
                        createNameContext: attrName,
                    });
                } else if (attribute.childrenForComponent) {
                    // TODO: what to do about parentName/parentDoenetAttributes
                    // since parent of these isn't created
                    // Note: the main (only?) to recurse here is to rename targets
                    createComponentNames({
                        serializedComponents: attribute.childrenForComponent,
                        namespaceStack,
                        componentInfoObjects,
                        parentDoenetAttributes: doenetAttributes,
                        parentName: componentName,
                        useOriginalNames,
                        doenetAttributesByTargetComponentName,
                        createNameContext: attrName,
                    });
                }
            }
        }

        // TODO: is there any reason to run createComponentNames on attribute components?
    }

    return serializedComponents;
}

function createNewAssignNamesAndRenameMatchingTNames({
    originalAssignNames,
    longNameIdBase,
    namespace,
    oldNamespace,
    doenetAttributesByTargetComponentName,
}) {
    let assignNames = [];

    for (let [ind, originalName] of originalAssignNames.entries()) {
        if (Array.isArray(originalName)) {
            // recurse to next level
            let assignNamesSub = createNewAssignNamesAndRenameMatchingTNames({
                originalAssignNames: originalName,
                longNameIdBase: longNameIdBase + ind + "_",
                namespace,
                oldNamespace,
                doenetAttributesByTargetComponentName,
            });
            assignNames.push(assignNamesSub);
        } else {
            let longNameId = longNameIdBase + ind;
            let newName = createUniqueName("fromAssignNames", longNameId);
            assignNames.push(newName);

            let infoForRenaming = {
                componentName: namespace + newName,
                originalName: oldNamespace + originalName,
            };

            renameMatchingTNames(
                infoForRenaming,
                doenetAttributesByTargetComponentName,
                true,
            );
        }
    }

    return assignNames;
}

export function convertComponentTarget({
    target,
    oldTargetComponentName,
    namespaceStack,
    acceptDoubleUnderscore,
}) {
    if (
        !oldTargetComponentName &&
        /__/.test(target) &&
        !acceptDoubleUnderscore
    ) {
        throw Error("Invalid reference target: " + target);
    }

    let targetComponentName;

    // console.log(`target: ${target}`)
    // console.log(JSON.parse(JSON.stringify(namespaceStack)))

    if (target.substring(0, 1) === "/") {
        // if starts with /, then don't add anything to path
        targetComponentName = target;
    } else {
        // calculate full target from target
        // putting it into the context of the current namespace

        let lastLevel = namespaceStack.length - 1;

        while (target.substring(0, 3) === "../") {
            // take off one level for every ../
            target = target.substring(3);
            lastLevel--;
        }

        if (lastLevel < 0) {
            // the target cannot possibly be valid
            // if there were more ../s than namespace levels
            lastLevel = 0;
        }

        targetComponentName = "";
        for (let l = 0; l <= lastLevel; l++) {
            targetComponentName += namespaceStack[l].namespace + "/";
        }
        targetComponentName += target;
    }

    return targetComponentName;
}

export function serializedComponentsReplacer(key, value) {
    if (value !== value) {
        return { objectType: "special-numeric", stringValue: "NaN" };
    } else if (value === Infinity) {
        return { objectType: "special-numeric", stringValue: "Infinity" };
    } else if (value === -Infinity) {
        return { objectType: "special-numeric", stringValue: "-Infinity" };
    }
    return value;
}

let nanInfinityReviver = function (key, value) {
    if (value && value.objectType === "special-numeric") {
        if (value.stringValue === "NaN") {
            return NaN;
        } else if (value.stringValue === "Infinity") {
            return Infinity;
        } else if (value.stringValue === "-Infinity") {
            return -Infinity;
        }
    }

    return value;
};

export function serializedComponentsReviver(key, value) {
    return me.reviver(
        key,
        subsets.Subset.reviver(key, nanInfinityReviver(key, value)),
    );
}

export function gatherVariantComponents({
    serializedComponents,
    componentInfoObjects,
}) {
    // returns a list of serialized components who are variant components,
    // where the components are selected from serializedComponents themselves,
    // or, if a particular component isn't a variant component,
    // then recurse to find descendant variant components

    // Also, as a side effect, mark each found variant component as a variant component
    // directly in the variants attribute of that component

    let variantComponents = [];

    for (let serializedComponent of serializedComponents) {
        if (serializedComponent.variants?.isVariantComponent) {
            variantComponents.push(serializedComponent);
            continue;
        }

        let componentType = serializedComponent.componentType;

        if (
            componentType in componentInfoObjects.componentTypesCreatingVariants
        ) {
            serializedComponent.variants = {
                isVariantComponent: true,
            };
            variantComponents.push(serializedComponent);
            continue;
        }

        if (!serializedComponent.children) {
            continue;
        }

        // check if have a variant control child, which means this component
        // is a variant component
        if (
            serializedComponent.children.some(
                (x) => x.componentType === "variantControl",
            )
        ) {
            serializedComponent.variants = {
                isVariantComponent: true,
            };
            variantComponents.push(serializedComponent);
            continue;
        }

        // if a component isn't a variant component, then recurse on children

        let descendantVariantComponents = gatherVariantComponents({
            serializedComponents: serializedComponent.children,
            componentInfoObjects,
        });

        if (descendantVariantComponents.length > 0) {
            serializedComponent.variants = {
                descendantVariantComponents: descendantVariantComponents,
            };

            variantComponents.push(...descendantVariantComponents);
        }
    }

    return variantComponents;
}

export function getNumberOfVariants({
    serializedComponent,
    componentInfoObjects,
}) {
    // get number of variants from document (or other sectioning component)

    if (!serializedComponent.variants) {
        serializedComponent.variants = {};
    }

    let variantControlChild;
    for (let child of serializedComponent.children) {
        if (child.componentType === "variantControl") {
            variantControlChild = child;
            break;
        }
    }

    if (!variantControlChild) {
        if (serializedComponent.componentType === "document") {
            // if have a single child that is a section, use variants from that section

            let nonBlankChildren = serializedComponent.children.filter(
                (x) => x.componentType || x.trim() !== "",
            );

            if (
                nonBlankChildren.length === 1 &&
                componentInfoObjects.isInheritedComponentType({
                    inheritedComponentType: nonBlankChildren[0].componentType,
                    baseComponentType: "_sectioningComponent",
                })
            ) {
                let results = getNumberOfVariants({
                    serializedComponent: nonBlankChildren[0],
                    componentInfoObjects,
                });

                if (results.success) {
                    serializedComponent.variants.numberOfVariants =
                        results.numberOfVariants;
                    serializedComponent.variants.variantNames =
                        results.variantNames;
                    serializedComponent.variants.variantsFromChild = true;
                    serializedComponent.variants.numberOfVariantsPreIgnore =
                        results.numberOfVariantsPreIgnore;
                    serializedComponent.variants.indicesToIgnore =
                        results.indicesToIgnore;

                    return results;
                }
            }

            // either didn't have a single section child or get number of varants wan't successful

            let numberOfVariants = 100;
            let numberOfVariantsPreIgnore = 100;

            // check if have one unique variant
            let compClass =
                componentInfoObjects.allComponentClasses[
                    serializedComponent.componentType
                ];
            let result = compClass.determineNumberOfUniqueVariants({
                serializedComponent,
                componentInfoObjects,
            });

            // if have 100 or fewer unique variants, set to unique
            if (result.success && result.numberOfVariantsPreIgnore <= 100) {
                numberOfVariantsPreIgnore = result.numberOfVariantsPreIgnore;
                numberOfVariants = result.numberOfVariants;
                serializedComponent.variants.uniqueVariants = true;
            }

            serializedComponent.variants.numberOfVariantsPreIgnore =
                numberOfVariantsPreIgnore;
            serializedComponent.variants.numberOfVariants = numberOfVariants;
            serializedComponent.variants.indicesToIgnore = [];

            return {
                success: true,
                numberOfVariants,
                numberOfVariantsPreIgnore,
                indicesToIgnore: [],
            };
        } else {
            // if are a section without a variant control, it doesn't determine variants
            return { success: false };
        }
    }

    let numberOfVariants = variantControlChild.attributes.nVariants?.primitive;

    if (numberOfVariants === undefined) {
        numberOfVariants = 100;
    }

    let variantNames =
        variantControlChild.attributes.variantNames?.component?.children.map(
            (x) => x.toLowerCase().substring(0, 1000),
        );

    let indicesToIgnore = [];
    if (variantControlChild.attributes.variantIndicesToIgnore) {
        indicesToIgnore =
            variantControlChild.attributes.variantIndicesToIgnore.component.children
                .map(Number)
                .filter(
                    (x) =>
                        Number.isInteger(x) && x >= 1 && x <= numberOfVariants,
                )
                .sort((a, b) => a - b);
    }

    let numberOfVariantsPreIgnore = numberOfVariants;

    if (!variantControlChild.attributes.uniqueVariants?.primitive) {
        if (indicesToIgnore.length > 0) {
            serializedComponent.variants.numberOfVariantsPreIgnore =
                numberOfVariantsPreIgnore;
            serializedComponent.variants.indicesToIgnore = indicesToIgnore;
            numberOfVariants -= indicesToIgnore.length;
        }
        serializedComponent.variants.numberOfVariants = numberOfVariants;
        return {
            success: true,
            numberOfVariants,
            variantNames,
            numberOfVariantsPreIgnore,
            indicesToIgnore,
        };
    }

    // have unique variants so it is more complicated!

    let compClass =
        componentInfoObjects.allComponentClasses[
            serializedComponent.componentType
        ];

    let result = compClass.determineNumberOfUniqueVariants({
        serializedComponent,
        componentInfoObjects,
    });

    if (result.success) {
        numberOfVariantsPreIgnore = result.numberOfVariantsPreIgnore;
        numberOfVariants = result.numberOfVariants;
        serializedComponent.variants.uniqueVariants = true;

        indicesToIgnore = indicesToIgnore.filter(
            (x) => x <= numberOfVariantsPreIgnore,
        );

        // don't have to add to serializedComponent.variants.numberOfVariants
        // as determineNumberOfUniqueVariants does it in this case
    } else {
        serializedComponent.variants.numberOfVariantsPreIgnore =
            numberOfVariantsPreIgnore;
        serializedComponent.variants.numberOfVariants = numberOfVariants;
    }

    return {
        success: true,
        numberOfVariants,
        variantNames,
        numberOfVariantsPreIgnore,
        indicesToIgnore,
    };
}

export function processAssignNames({
    assignNames = [],
    serializedComponents,
    parentName,
    parentCreatesNewNamespace,
    componentInfoObjects,
    indOffset = 0,
    originalNamesAreConsistent = false,
}) {
    // console.log(`process assign names`)
    // console.log(deepClone(serializedComponents));
    // console.log(`originalNamesAreConsistent: ${originalNamesAreConsistent}`)

    let nComponents = serializedComponents.length;

    // normalize form so all names are originalNames,
    // independent of whether the components originated from a copy
    // or directly from a serialized state that was already given names
    moveComponentNamesToOriginalNames(serializedComponents);

    let doenetAttributesByTargetComponentName = {};

    let originalNamespace = null;

    if (originalNamesAreConsistent) {
        // need to use a component for original name, as parentName is the new name
        if (nComponents > 0) {
            // find a component with an original name, i.e., not a string
            let component = serializedComponents.filter(
                (x) => typeof x === "object",
            )[0];
            if (component && component.originalName) {
                let lastSlash = component.originalName.lastIndexOf("/");
                originalNamespace = component.originalName.substring(
                    0,
                    lastSlash,
                );
            }
        }

        if (originalNamespace !== null) {
            for (let component of serializedComponents) {
                setTargetsOutsideNamespaceToAbsoluteAndRecordAllTargetComponentNames(
                    {
                        namespace: originalNamespace,
                        components: [component],
                        doenetAttributesByTargetComponentName,
                    },
                );
            }
        }
    } else {
        for (let ind = 0; ind < nComponents; ind++) {
            let component = serializedComponents[ind];

            if (typeof component !== "object") {
                continue;
            }

            originalNamespace = null;
            // need to use a component for original name, as parentName is the new name
            if (nComponents > 0 && component.originalName) {
                let lastSlash = component.originalName.lastIndexOf("/");
                originalNamespace = component.originalName.substring(
                    0,
                    lastSlash,
                );
            }

            if (originalNamespace !== null) {
                setTargetsOutsideNamespaceToAbsoluteAndRecordAllTargetComponentNames(
                    {
                        namespace: originalNamespace,
                        components: [component],
                        doenetAttributesByTargetComponentName,
                    },
                );
            }
        }
    }

    let processedComponents = [];

    // don't name strings or primitive numbers
    let numPrimitives = 0;

    for (let ind = 0; ind < nComponents; ind++) {
        let indForNames = ind + indOffset;

        let component = serializedComponents[ind];

        if (typeof component !== "object") {
            numPrimitives++;
            processedComponents.push(component);
            continue;
        }

        let name = assignNames[indForNames - numPrimitives];

        if (!component.doenetAttributes) {
            component.doenetAttributes = {};
        }

        if (!originalNamesAreConsistent) {
            // doenetAttributesByTargetComponentName = {};

            originalNamespace = null;
            // need to use a component for original name, as parentName is the new name
            if (nComponents > 0 && component.originalName) {
                let lastSlash = component.originalName.lastIndexOf("/");
                originalNamespace = component.originalName.substring(
                    0,
                    lastSlash,
                );
            }
        }

        if (
            componentInfoObjects.allComponentClasses[component.componentType]
                .assignNamesSkipOver
        ) {
            name = [name];
        } else if (
            component.attributes &&
            component.attributes.assignNamesSkip
        ) {
            let numberToSkip = component.attributes.assignNamesSkip.primitive;
            if (numberToSkip > 0) {
                for (let i = 0; i < numberToSkip; i++) {
                    name = [name];
                }
            }
        }

        if (Array.isArray(name)) {
            if (
                componentInfoObjects.allComponentClasses[
                    component.componentType
                ].assignNamesToReplacements
            ) {
                // give component itself an unreachable name
                let longNameId =
                    parentName + "|assignName|" + indForNames.toString();
                component.doenetAttributes.prescribedName = createUniqueName(
                    component.componentType.toLowerCase(),
                    longNameId,
                );

                let componentName = parentName;
                if (!parentCreatesNewNamespace) {
                    let lastSlash = parentName.lastIndexOf("/");
                    componentName = parentName.substring(0, lastSlash);
                }
                componentName +=
                    "/" + component.doenetAttributes.prescribedName;
                component.componentName = componentName;

                component.doenetAttributes.assignNames = name;

                processedComponents.push(component);
                continue;
            } else {
                // TODO: what to do when try to assign names recursively to non-composite?
                console.warn(
                    `Cannot assign names recursively to ${component.componentType}`,
                );
                name = null;
            }
        }

        if (!name) {
            if (
                originalNamesAreConsistent &&
                component.originalName &&
                !component.doenetAttributes?.createUniqueName
            ) {
                name = component.originalName.slice(
                    originalNamespace.length + 1,
                );
            } else {
                let longNameId =
                    parentName + "|assignName|" + indForNames.toString();
                name = createUniqueName(
                    component.componentType.toLowerCase(),
                    longNameId,
                );
            }
        }

        component.doenetAttributes.prescribedName = name;
        // delete component.originalName;

        // even if original names are consistent, we still use component's original assignNames
        // (we wouldn't use assignNames of the component's children as they should have unique names)
        if (
            originalNamesAreConsistent &&
            !component.doenetAttributes.assignNames &&
            component.originalDoenetAttributes &&
            component.originalDoenetAttributes.assignNames
        ) {
            component.doenetAttributes.assignNames =
                component.originalDoenetAttributes.assignNames;
        }

        createComponentNamesFromParentName({
            parentName,
            ind: indForNames,
            component,
            parentCreatesNewNamespace,
            componentInfoObjects,
            doenetAttributesByTargetComponentName,
            originalNamesAreConsistent,
        });

        processedComponents.push(component);
    }

    return {
        serializedComponents: processedComponents,
    };
}

function createComponentNamesFromParentName({
    parentName,
    component,
    ind,
    parentCreatesNewNamespace,
    componentInfoObjects,
    doenetAttributesByTargetComponentName,
    originalNamesAreConsistent,
}) {
    let namespacePieces = parentName.split("/");

    if (!parentCreatesNewNamespace) {
        namespacePieces.pop();
    }

    let namespaceStack = namespacePieces.map((x) => ({
        namespace: x,
        componentCounts: {},
        namesUsed: {},
    }));

    if (!(parentName[0] === "/")) {
        // if componentName doesn't begin with a /
        // still add a namespace for the root namespace at the beginning
        namespaceStack.splice(0, 0, {
            componentCounts: {},
            namesUsed: {},
            namespace: "",
        });
    }

    if (!component.doenetAttributes) {
        component.doenetAttributes = {};
    }
    if (!component.attributes) {
        component.attributes = {};
    }

    // let originalNamespaceForComponentChildren = parentName;
    // if (!parentCreatesNewNamespace) {
    //   let lastSlash = parentName.lastIndexOf("/");
    //   namespaceForComponent = parentName.substring(0, lastSlash);
    // }

    let useOriginalNames;
    if (
        component.attributes.newNamespace?.primitive ||
        originalNamesAreConsistent
    ) {
        useOriginalNames = true;
    } else {
        useOriginalNames = false;

        if (component.children) {
            markToCreateAllUniqueNames(component.children);
        }
    }

    // always mark component attributes to create unique names
    for (let attrName in component.attributes) {
        let attribute = component.attributes[attrName];
        if (attribute.component) {
            markToCreateAllUniqueNames([attribute.component]);
        } else if (attribute.childrenForComponent) {
            markToCreateAllUniqueNames(attribute.childrenForComponent);
        }
    }

    // console.log(`before create componentName`)
    // console.log(deepClone(component))
    // console.log(useOriginalNames);
    // console.log(component.attributes.newNamespace);

    createComponentNames({
        serializedComponents: [component],
        namespaceStack,
        componentInfoObjects,
        parentName,
        useOriginalNames,
        doenetAttributesByTargetComponentName,
        indOffset: ind,
    });

    // console.log(`result of create componentName`)
    // console.log(deepClone(component))
}

function setTargetsOutsideNamespaceToAbsoluteAndRecordAllTargetComponentNames({
    namespace,
    components,
    doenetAttributesByTargetComponentName,
}) {
    let namespaceLength = namespace.length;
    for (let component of components) {
        if (typeof component !== "object") {
            continue;
        }

        if (component.doenetAttributes && component.doenetAttributes.target) {
            let targetComponentName =
                component.doenetAttributes.targetComponentName;
            if (targetComponentName !== undefined) {
                if (
                    targetComponentName.substring(0, namespaceLength) !==
                    namespace
                ) {
                    component.doenetAttributes.target = targetComponentName;
                }
                if (
                    !doenetAttributesByTargetComponentName[targetComponentName]
                ) {
                    doenetAttributesByTargetComponentName[targetComponentName] =
                        [];
                }
                doenetAttributesByTargetComponentName[targetComponentName].push(
                    component.doenetAttributes,
                );
            }
        }

        if (component.children) {
            setTargetsOutsideNamespaceToAbsoluteAndRecordAllTargetComponentNames(
                {
                    namespace,
                    components: component.children,
                    doenetAttributesByTargetComponentName,
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
                            doenetAttributesByTargetComponentName,
                        },
                    );
                } else if (attribute.childrenForComponent) {
                    setTargetsOutsideNamespaceToAbsoluteAndRecordAllTargetComponentNames(
                        {
                            namespace,
                            components: attribute.childrenForComponent,
                            doenetAttributesByTargetComponentName,
                        },
                    );
                }
            }
        }
    }
}

function renameMatchingTNames(
    component,
    doenetAttributesByTargetComponentName,
    renameMatchingNamespaces = false,
) {
    if (
        component.originalName &&
        doenetAttributesByTargetComponentName &&
        component.componentName !== component.originalName
    ) {
        // we have a component who has been named and there are other components
        // whose targetComponentName refers to this component
        // Modify the target and targetComponentName of the other components to refer to the new name
        // (Must modify targetComponentName as we don't know if this component has been processed yet)
        if (doenetAttributesByTargetComponentName[component.originalName]) {
            for (let dAttributes of doenetAttributesByTargetComponentName[
                component.originalName
            ]) {
                dAttributes.target = component.componentName;
                dAttributes.targetComponentName = component.componentName;
            }
        }
        if (renameMatchingNamespaces) {
            let originalNamespace = component.originalName + "/";
            let nSpaceLen = originalNamespace.length;
            for (let originalTargetComponentName in doenetAttributesByTargetComponentName) {
                if (
                    originalTargetComponentName.substring(0, nSpaceLen) ===
                    originalNamespace
                ) {
                    let originalEnding =
                        originalTargetComponentName.substring(nSpaceLen);
                    for (let dAttributes of doenetAttributesByTargetComponentName[
                        originalTargetComponentName
                    ]) {
                        dAttributes.target =
                            component.componentName + "/" + originalEnding;
                        dAttributes.targetComponentName =
                            component.componentName + "/" + originalEnding;
                    }
                }
            }
        }
    }
}

function moveComponentNamesToOriginalNames(components) {
    for (let component of components) {
        if (component.componentName) {
            component.originalName = component.componentName;
            delete component.componentName;
        }
        if (component.children) {
            moveComponentNamesToOriginalNames(component.children);
        }
        if (component.attributes) {
            for (let attrName in component.attributes) {
                let attribute = component.attributes[attrName];
                if (attribute.component) {
                    moveComponentNamesToOriginalNames([attribute.component]);
                } else if (attribute.childrenForComponent) {
                    moveComponentNamesToOriginalNames(
                        attribute.childrenForComponent,
                    );
                }
            }
        }
    }
}

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
            } else if (
                component.originalDoenetAttributes &&
                component.originalDoenetAttributes.assignNames
            ) {
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
                } else if (attribute.childrenForComponent) {
                    markToCreateAllUniqueNames(attribute.childrenForComponent);
                }
            }
        }
    }
}

export function setTNamesToAbsolute(components) {
    for (let component of components) {
        if (component.doenetAttributes && component.doenetAttributes.target) {
            let targetComponentName =
                component.doenetAttributes.targetComponentName;
            if (targetComponentName !== undefined) {
                component.doenetAttributes.target = targetComponentName;
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
                } else if (attribute.childrenForComponent) {
                    setTNamesToAbsolute(attribute.childrenForComponent);
                }
            }
        }
    }
}

export function restrictTNamesToNamespace({
    components,
    namespace,
    parentNamespace,
    parentIsCopy = false,
}) {
    if (parentNamespace === undefined) {
        parentNamespace = namespace;
    }

    let nSpace = namespace.length;

    for (let component of components) {
        if (component.doenetAttributes && component.doenetAttributes.target) {
            let target = component.doenetAttributes.target;

            if (target[0] === "/") {
                if (target.substring(0, nSpace) !== namespace) {
                    let targetComponentName = namespace + target.substring(1);
                    component.doenetAttributes.target = targetComponentName;
                    component.doenetAttributes.targetComponentName =
                        targetComponentName;
                }
            } else if (target.substring(0, 3) === "../") {
                let tNamePart = target;
                let namespacePart = parentNamespace;
                while (tNamePart.substring(0, 3) === "../") {
                    tNamePart = tNamePart.substring(3);
                    let lastSlash = namespacePart
                        .substring(0, namespacePart.length - 1)
                        .lastIndexOf("/");
                    namespacePart = namespacePart.substring(0, lastSlash + 1);
                    if (namespacePart.substring(0, nSpace) !== namespace) {
                        while (tNamePart.substring(0, 3) === "../") {
                            tNamePart = tNamePart.substring(3);
                        }

                        let targetComponentName = namespace + tNamePart;
                        component.doenetAttributes.target = targetComponentName;
                        component.doenetAttributes.targetComponentName =
                            targetComponentName;
                        break;
                    }
                }
            }
        }

        if (component.children) {
            let adjustedNamespace = namespace;
            if (parentIsCopy && component.componentType === "externalContent") {
                // if have a external content inside a copy,
                // then restrict children to the namespace of the externalContent
                adjustedNamespace = component.componentName + "/";
            }
            let namespaceForChildren = parentNamespace;
            if (
                component.attributes &&
                component.attributes.newNamespace?.primitive
            ) {
                namespaceForChildren = component.componentName;
            }
            restrictTNamesToNamespace({
                components: component.children,
                namespace: adjustedNamespace,
                parentNamespace: namespaceForChildren,
                parentIsCopy: component.componentType === "copy",
            });
        }
        if (component.attributes) {
            for (let attrName in component.attributes) {
                let attribute = component.attributes[attrName];
                if (attribute.component) {
                    restrictTNamesToNamespace({
                        components: [attribute.component],
                        namespace,
                        parentNamespace,
                    });
                } else if (attribute.childrenForComponent) {
                    restrictTNamesToNamespace({
                        components: attribute.childrenForComponent,
                        namespace,
                        parentNamespace,
                    });
                }
            }
        }
    }
}

function indexRangeString(serializedComponent) {
    let message = "";
    if (serializedComponent.range) {
        let indBegin, indEnd;
        if (serializedComponent.range.selfCloseBegin !== undefined) {
            indBegin = serializedComponent.range.selfCloseBegin;
            indEnd = serializedComponent.range.selfCloseEnd;
        } else if (serializedComponent.range.openBegin !== undefined) {
            indBegin = serializedComponent.range.openBegin;
            indEnd = serializedComponent.range.openEnd;
        }
        if (indBegin !== undefined) {
            message += ` at indices ${indBegin}-${indEnd}`;
        }
    }
    return message;
}

export function breakEmbeddedStringByCommas({ childrenList }) {
    let Nparens = 0;
    let pieces = [];
    let currentPiece = [];

    for (let component of childrenList) {
        if (typeof component !== "string") {
            currentPiece.push(component);
            continue;
        }

        let s = component.trim();
        let beginInd = 0;

        for (let ind = 0; ind < s.length; ind++) {
            let char = s[ind];
            if (char === "(") {
                Nparens++;
            }
            if (char === ")") {
                if (Nparens === 0) {
                    // parens didn't match, so return failure
                    return { success: false };
                }
                Nparens--;
            }
            if (char === "," && Nparens === 0) {
                if (ind > beginInd) {
                    let newString = s.substring(beginInd, ind).trim();
                    currentPiece.push(newString);
                }

                pieces.push(currentPiece);
                currentPiece = [];
                beginInd = ind + 1;
            }
        }

        if (s.length > beginInd) {
            let newString = s.substring(beginInd, s.length).trim();
            currentPiece.push(newString);
        }
    }

    // parens didn't match, so return failure
    if (Nparens !== 0) {
        return { success: false };
    }

    pieces.push(currentPiece);

    return {
        success: true,
        pieces: pieces,
    };
}
