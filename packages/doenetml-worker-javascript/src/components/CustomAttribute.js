import CompositeComponent from "./abstract/CompositeComponent";
import {
    applyMacros,
    applySugar,
    componentFromAttribute,
} from "../utils/expandDoenetML";

export default class CustomAttribute extends CompositeComponent {
    static componentType = "customAttribute";

    static inSchemaOnlyInheritAs = [];

    static createAttributesObject() {
        let attributes = super.createAttributesObject();

        attributes.componentType = {
            createPrimitiveOfType: "string",
        };
        attributes.attribute = {
            createPrimitiveOfType: "string",
        };
        attributes.defaultValue = {
            leaveRaw: true,
        };
        return attributes;
    }

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        stateVariableDefinitions.componentIdxForAttributes = {
            returnDependencies: () => ({
                parentVariableContainingName: {
                    dependencyType: "parentStateVariable",
                    variableName: "componentIdxForAttributes",
                },
            }),
            definition({ dependencyValues, componentIdx }) {
                let componentIdxForAttributes =
                    dependencyValues.parentVariableContainingName;
                return { setValue: { componentIdxForAttributes } };
            },
        };

        stateVariableDefinitions.attributeName = {
            returnDependencies: () => ({
                attribute: {
                    dependencyType: "attributePrimitive",
                    attributeName: "attribute",
                },
            }),
            definition({ dependencyValues }) {
                return {
                    setValue: { attributeName: dependencyValues.attribute },
                };
            },
        };

        stateVariableDefinitions.readyToExpandWhenResolved = {
            stateVariablesDeterminingDependencies: [
                "componentIdxForAttributes",
            ],
            returnDependencies: ({ stateValues }) => ({
                componentIdentity: {
                    dependencyType: "componentIdentity",
                    componentIdx: stateValues.componentIdxForAttributes,
                },
            }),
            definition() {
                return { setValue: { readyToExpandWhenResolved: true } };
            },
        };

        return stateVariableDefinitions;
    }

    static async createSerializedReplacements({
        component,
        components,
        workspace,
        componentInfoObjects,
        flags,
    }) {
        let errors = [];
        let warnings = [];

        if (!component.attributes.componentType) {
            warnings.push({
                message: `<customAttribute> must contain a componentType attribute.`,
                level: 1,
            });
            return { replacements: [], errors, warnings };
        }

        let componentType =
            componentInfoObjects.componentTypeLowerCaseMapping[
                component.attributes.componentType.primitive.value.toLowerCase()
            ];
        let componentClass =
            componentInfoObjects.allComponentClasses[componentType];

        if (!componentClass) {
            warnings.push({
                message: `<customAttribute> contains an invalid component type: <${component.attributes.componentType.primitive.value}>.`,
                level: 1,
            });
            return { replacements: [], errors, warnings };
        }

        let componentForAttribute =
            components[await component.stateValues.componentIdxForAttributes];
        let attributeLowerCaseMapping = {};

        if (!componentForAttribute) {
            warnings.push({
                message:
                    "Could not create <customAttribute>. It must be inside a <setup> component that is inside a <module> or similar component.",
                level: 1,
            });
            return { replacements: [], errors, warnings };
        }

        for (let attrName in componentForAttribute.attributes) {
            attributeLowerCaseMapping[attrName.toLowerCase()] = attrName;
        }

        let SVattributeName = await component.stateValues.attributeName;
        let attributeName =
            attributeLowerCaseMapping[SVattributeName.toLowerCase()];

        let attributeValue = componentForAttribute.attributes[attributeName];

        if (attributeValue === undefined) {
            if (component.attributes.defaultValue === undefined) {
                warnings.push({
                    message: `Since a default value was not supplied for <customAttribute> with attribute="${SVattributeName}", it will not be created unless a value is specified.`,
                    level: 1,
                });
                return { replacements: [], errors, warnings };
            } else {
                attributeValue = component.attributes.defaultValue;
            }
        }

        // check if have attribute name is already defined for componentForAttribute's class
        // in which case setting via custom attributes won't work
        let containerClass = componentForAttribute.constructor;
        let containerAttrNames = Object.keys(
            containerClass.createAttributesObject(),
        ).map((x) => x.toLowerCase());
        containerAttrNames.push("name", "target");
        if (containerAttrNames.includes(SVattributeName.toLowerCase())) {
            warnings.push({
                message: `Cannot add attribute "${SVattributeName}" to a <${containerClass.componentType}> because the <${containerClass.componentType}> component type already has a "${SVattributeName}" attribute defined.`,
                level: 1,
            });
            return { replacements: [], errors, warnings };
        }

        let attrObj = {
            createComponentOfType: componentType,
        };

        let res = componentFromAttribute({
            attrObj,
            value: attributeValue,
            componentInfoObjects,
        });

        let serializedComponent = res.attribute.component;
        errors.push(...res.errors);
        warnings.push(...res.warnings);

        if (serializedComponent.children) {
            applyMacros(serializedComponent.children, componentInfoObjects);
        }

        applySugar({
            serializedComponents: [serializedComponent],
            isAttributeComponent: true,
            componentInfoObjects,
        });

        // XXX: what is the replacement for this?
        // setTNamesToAbsolute([serializedComponent]);

        return {
            replacements: [serializedComponent],
            errors,
            warnings,
        };
    }
}
