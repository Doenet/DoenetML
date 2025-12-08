import { deepClone } from "@doenet/utils";
import { expandUnflattenedToSerializedComponents } from "../utils/dast/convertNormalizedDast";
import CompositeComponent from "./abstract/CompositeComponent";
import { applySugar } from "../utils/dast/sugar";

export default class ModuleAttributes extends CompositeComponent {
    static componentType = "moduleAttributes";

    static keepChildrenSerialized({ serializedComponent }) {
        if (serializedComponent.children === undefined) {
            return [];
        } else {
            return Object.keys(serializedComponent.children);
        }
    }

    // since don't have child groups, tell schema about children here
    static additionalSchemaChildren = ["_base"];

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        // `<moduleAttributes>` must be contained in a `<module>`
        // so that this `<moduleAttributes>` will be a replacement of the `<module>`.
        stateVariableDefinitions.moduleIdx = {
            returnDependencies: () => ({
                sourceCompositeIdentity: {
                    dependencyType: "sourceCompositeIdentity",
                },
            }),
            definition({ dependencyValues }) {
                let moduleIdx = null;
                if (
                    dependencyValues.sourceCompositeIdentity &&
                    dependencyValues.sourceCompositeIdentity.componentType ===
                        "module"
                ) {
                    moduleIdx =
                        dependencyValues.sourceCompositeIdentity.componentIdx;
                }
                return { setValue: { moduleIdx } };
            },
        };

        stateVariableDefinitions.serializedChildren = {
            returnDependencies: () => ({
                serializedChildren: {
                    dependencyType: "serializedChildren",
                    doNotProxy: true,
                },
            }),
            definition: function ({ dependencyValues }) {
                return {
                    setValue: {
                        serializedChildren: dependencyValues.serializedChildren,
                    },
                };
            },
        };

        stateVariableDefinitions.readyToExpandWhenResolved = {
            returnDependencies: () => ({
                componentIdentity: {
                    dependencyType: "stateVariable",
                    variableName: "moduleIdx",
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
        componentInfoObjects,
        nComponents,
    }) {
        const errors = [];
        const warnings = [];

        const moduleIdx = await component.stateValues.moduleIdx;

        if (moduleIdx === null) {
            return { replacements: [], errors, warnings, nComponents };
        }

        const module = components[moduleIdx];

        const attributeLowerCaseMapping = {};

        for (let attrName in module.attributes) {
            attributeLowerCaseMapping[attrName.toLowerCase()] = attrName;
        }

        const existingModuleAttrNames = Object.keys(
            module.constructor.createAttributesObject(),
        ).map((x) => x.toLowerCase());
        existingModuleAttrNames.push("name");

        const componentsForModuleAttributes = [];

        const children = deepClone(
            await component.state.serializedChildren.value,
        );

        for (const child of children) {
            const childName = child.attributes.name?.primitive?.value;

            if (!childName) {
                // If the child does not have a name, we can't do anything with it.
                // Add it to the replacements untouched with a warning
                componentsForModuleAttributes.push(child);
                warnings.push({
                    type: "warning",
                    message: `Since the component <${child.componentType}> does not have a name, it cannot be used for a module attribute`,
                    position: child.position,
                });

                continue;
            }

            let attributeName =
                attributeLowerCaseMapping[childName.toLowerCase()];
            let attributeFromModule = module.attributes[attributeName];

            // If the attribute corresponding to the child's name is not present in the `<module>`,
            // then the child is used as is
            if (attributeFromModule === undefined) {
                componentsForModuleAttributes.push(child);
                continue;
            }

            // check if the attribute name is already defined in a module
            // in which case it won't work to use it as a custom module attribute
            if (existingModuleAttrNames.includes(attributeName)) {
                warnings.push({
                    type: "warning",
                    message: `The component <${child.componentType} name="${childName}"> cannot be used as an attribute for a module because the <module> component type already has a "${childName}" attribute defined.`,
                    level: 1,
                    position: child.position,
                });
                componentsForModuleAttributes.push(child);
                continue;
            }

            if (attributeFromModule.type !== "unresolved") {
                throw Error(
                    "A module attribute that isn't an existing attribute must be unresolved!",
                );
            }

            // Use the children from the attribute to replace the child's children
            const expandResult = expandUnflattenedToSerializedComponents({
                serializedComponents: attributeFromModule.children,
                componentInfoObjects,
                nComponents,
            });
            errors.push(...expandResult.errors);
            warnings.push(...expandResult.warnings);
            nComponents = expandResult.nComponents;

            child.children = expandResult.components;

            // Since sugar has already been applied before we get here, we need to manually apply sugar
            // in case the new children need to be modified.

            // TODO: this is not guaranteed to work correctly because the original children could already have been moved
            // to an attribute with earlier sugar, which means they were not removed when the children were replaced in the previous line.
            // For example, if `child` is a point, its children may have been moved to the `xs` attribute.
            // So far, examples tried have worked, but presumably this is cause problems in other cases.
            // This could be fixed by preventing sugar from being applied to children of `<moduleAttributes>`.
            const sugarResult = applySugar({
                serializedComponents: [child],
                componentInfoObjects,
                nComponents,
            });

            errors.push(...sugarResult.errors);
            warnings.push(...sugarResult.warnings);
            nComponents = sugarResult.nComponents;

            componentsForModuleAttributes.push(sugarResult.components[0]);
        }

        // enclose everything in a `<setup>` so they won't be displayed

        const setup = {
            type: "serialized",
            componentType: "setup",
            componentIdx: nComponents++,
            children: componentsForModuleAttributes,
            attributes: {},
            doenetAttributes: {},
            state: {},
        };

        return {
            replacements: [setup],
            errors,
            warnings,
            nComponents,
        };
    }
}
