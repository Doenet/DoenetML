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

    static returnStyleOverrideGroups() {
        return resolveOverrideGroups(this);
    }

    static addStyleOverrideAttributes(attributes) {
        for (const group of GraphicalComponent.returnStyleOverrideGroups.call(
            this,
        )) {
            for (const [styleAttr, spec] of Object.entries(group)) {
                attributes[styleAttr] = attributeSpecFromStyleAttribute(spec);
            }
        }
    }

    /**
     * Whether this component can carry a label.
     *
     * Every graphical component gets the whole label surface from here — the
     * `labels` child group, the `labelIsName`, `applyStyleToLabel` and
     * `maskLabel` attributes, and the `label` state variables — which suits the
     * ones drawn at a place a label can sit beside. A component that covers the
     * whole viewport — a field, say — has no such place, and its renderer draws
     * no label however one is written. Setting this false drops the surface
     * whole, so a `<label>` is refused rather than accepted and ignored, and
     * nothing is left offering to style or mask a label that cannot exist.
     * Dropping only part of it would not do: the `label` state variable depends
     * on the `labels` child group, so removing the group alone would leave it
     * pointing at nothing.
     *
     * Tested against `false` rather than for truthiness because these methods
     * are also borrowed by classes outside this hierarchy — `Function` calls
     * `GraphicalComponent.returnStateVariableDefinitions.call(this)` — where
     * the flag is simply absent and labels are wanted.
     */
    static includeLabels = true;

    static createAttributesObject() {
        let attributes = super.createAttributesObject();

        if (this.includeLabels !== false) {
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
            attributes.maskLabel = {
                createComponentOfType: "boolean",
                createStateVariable: "maskLabel",
                defaultValue: false,
                public: true,
                forRenderer: true,
                description:
                    "Whether to give the label an opaque background so it stays legible when it overlaps an axis, grid line, or another object.",
            };
        }

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
        GraphicalComponent.addStyleOverrideAttributes.call(this, attributes);

        return attributes;
    }

    static returnChildGroups() {
        if (this.includeLabels === false) {
            return [];
        }
        return [
            {
                group: "labels",
                componentTypes: ["label"],
            },
        ];
    }

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        const overrideAttributeNames =
            GraphicalComponent.returnStyleOverrideGroups
                .call(this)
                .flatMap((group) => Object.keys(group));

        let selectedStyleDefinition =
            returnSelectedStyleStateVariableDefinition({
                overrideAttributeNames,
            });

        Object.assign(stateVariableDefinitions, selectedStyleDefinition);

        if (this.includeLabels !== false) {
            let labelDefinitions = returnLabelStateVariableDefinitions();

            Object.assign(stateVariableDefinitions, labelDefinitions);
        }

        return stateVariableDefinitions;
    }
}
