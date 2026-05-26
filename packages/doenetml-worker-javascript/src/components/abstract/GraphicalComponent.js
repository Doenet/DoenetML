import BaseComponent from "./BaseComponent";
import {
    STYLE_OVERRIDE_CATEGORIES,
    attributeSpecFromStyleAttribute,
    returnSelectedStyleStateVariableDefinition,
} from "@doenet/utils";
import {
    returnLabelAttributes,
    returnLabelStateVariableDefinitions,
} from "../../utils/label";

/**
 * Resolves the override attribute groups a subclass opts into. `this` is the
 * class itself in static methods, so the lookup walks the prototype chain and
 * picks up a subclass's `static styleOverrideCategories` if present.
 *
 * Validates each category name up front so a typo (e.g. `["marker", "fil"]`)
 * fails loudly at component init with a message naming the bad category and
 * the offending componentType, instead of producing a downstream
 * `for…in undefined` TypeError when `createAttributesObject` iterates the
 * resolved group.
 */
function resolveOverrideGroups(cls) {
    const categories = cls.styleOverrideCategories ?? [];
    return categories.map((cat) => {
        const group = STYLE_OVERRIDE_CATEGORIES[cat];
        if (!group) {
            const valid = Object.keys(STYLE_OVERRIDE_CATEGORIES).join(", ");
            throw new Error(
                `Component "${cls.componentType}" lists unknown style override category "${cat}" in static styleOverrideCategories. ` +
                    `Valid categories are: ${valid}.`,
            );
        }
        return group;
    });
}

export default class GraphicalComponent extends BaseComponent {
    static componentType = "_graphical";

    /**
     * Subclasses opt into per-component style overrides by listing the
     * groups they use, e.g. `static styleOverrideCategories = ["marker"]`
     * for point-like components, `["line", "fill"]` for closed shapes.
     * Leaving this empty (the default) keeps the component as a pure
     * `<styleDefinition>` consumer with no per-component override surface.
     */
    static styleOverrideCategories = [];

    static createAttributesObject() {
        let attributes = super.createAttributesObject();

        Object.assign(attributes, returnLabelAttributes());

        attributes.applyStyleToLabel = {
            createComponentOfType: "boolean",
            createStateVariable: "applyStyleToLabel",
            defaultValue: false,
            public: true,
            forRenderer: true,
            description:
                "Whether to apply this component's selected style to its label.",
        };
        attributes.layer = {
            createComponentOfType: "integer",
            createStateVariable: "layer",
            defaultValue: 0,
            public: true,
            forRenderer: true,
            attributesForCreatedComponent: { valueOnNaN: "0" },
            description:
                "Z-order layer index used to stack graphical components (higher values render on top).",
        };

        // Per-component non-color style overrides — only the groups this
        // subclass opts into via `static styleOverrideCategories`. Colors
        // stay <styleDefinition>-only so per-styleNumber WCAG contrast
        // diagnostics remain authoritative.
        for (const group of resolveOverrideGroups(this)) {
            for (const styleAttr in group) {
                attributes[styleAttr] = attributeSpecFromStyleAttribute(
                    group[styleAttr],
                );
            }
        }

        return attributes;
    }

    static returnChildGroups() {
        return [
            {
                group: "labels",
                componentTypes: ["label"],
            },
        ];
    }

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        const overrideAttributeNames = resolveOverrideGroups(this).flatMap(
            (group) => Object.keys(group),
        );

        let selectedStyleDefinition =
            returnSelectedStyleStateVariableDefinition({
                overrideAttributeNames,
            });

        Object.assign(stateVariableDefinitions, selectedStyleDefinition);

        let labelDefinitions = returnLabelStateVariableDefinitions();

        Object.assign(stateVariableDefinitions, labelDefinitions);

        return stateVariableDefinitions;
    }
}
