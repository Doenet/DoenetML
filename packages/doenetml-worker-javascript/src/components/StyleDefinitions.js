import BaseComponent from "./abstract/BaseComponent";

import {
    attributeSpecFromStyleAttribute,
    styleAttributes,
} from "@doenet/utils";

export class StyleDefinition extends BaseComponent {
    static componentType = "styleDefinition";

    static componentDocs = {
        summary: "A reusable style definition referenced by other components",
    };
    static rendererType = undefined;

    static inSchemaOnlyInheritAs = [];

    static createAttributesObject() {
        let attributes = super.createAttributesObject();

        attributes.styleNumber = {
            createPrimitiveOfType: "integer",
            createStateVariable: "styleNumber",
            defaultValue: 1,
            clamp: [1, Infinity],
            description:
                "Index identifying which style this definition applies to.",
        };

        for (let styleAttr in styleAttributes) {
            attributes[styleAttr] = attributeSpecFromStyleAttribute(
                styleAttributes[styleAttr],
            );
        }

        return attributes;
    }

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        stateVariableDefinitions.styleDefinition = {
            returnDependencies: function () {
                let dependencies = {};

                for (let styleAttr in styleAttributes) {
                    dependencies[styleAttr] = {
                        dependencyType: "attributeComponent",
                        attributeName: styleAttr,
                        variableNames: ["value"],
                    };
                }
                return dependencies;
            },
            definition: function ({ dependencyValues }) {
                let styleDefinition = {};

                for (let styleAttr in styleAttributes) {
                    if (dependencyValues[styleAttr] !== null) {
                        const value =
                            dependencyValues[styleAttr].stateValues.value;

                        // Historical behavior: every string value gets
                        // lowercased here, which is what makes color names
                        // (`lineColor="RED"` → `"red"`) case-insensitive. The
                        // per-component override path in `style.ts` is newer
                        // and gates on the spec's explicit `toLowerCase` flag
                        // (only enum-typed attributes opt in); don't tighten
                        // this path without auditing color-name lookups first.
                        if (typeof value === "string") {
                            styleDefinition[styleAttr] = {
                                style: value.toLowerCase(),
                            };
                        } else {
                            styleDefinition[styleAttr] = {
                                style: value,
                            };
                        }

                        if (dependencyValues[styleAttr].position) {
                            styleDefinition[styleAttr].position =
                                dependencyValues[styleAttr].position;
                        }
                    }
                }

                return { setValue: { styleDefinition } };
            },
        };

        return stateVariableDefinitions;
    }
}

export class StyleDefinitions extends BaseComponent {
    static componentType = "styleDefinitions";

    static rendererType = undefined;

    static excludeFromSchema = true;
}
