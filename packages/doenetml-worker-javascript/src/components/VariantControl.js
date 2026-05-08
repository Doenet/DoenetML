import BaseComponent from "./abstract/BaseComponent";

export default class VariantControl extends BaseComponent {
    static componentType = "variantControl";
    static rendererType = undefined;

    static componentDocs = {
        summary:
            "Configures how variants are generated for the enclosing document or section.",
    };

    static createAttributesObject() {
        let attributes = super.createAttributesObject();

        attributes.numVariants = {
            createPrimitiveOfType: "integer",
            description: "The total number of variants to generate.",
        };

        attributes.uniqueVariants = {
            createPrimitiveOfType: "boolean",
            description:
                "Whether to require generated variants to be uniquely distinguishable.",
        };

        attributes.variantsToInclude = {
            createComponentOfType: "textListFromString",
            description:
                "Restrict the available variants to this list (by name or index).",
        };

        attributes.variantsToExclude = {
            createComponentOfType: "textListFromString",
            description: "Variants to exclude from those generated.",
        };

        attributes.variantNames = {
            createComponentOfType: "textListFromString",
            description: "Names assigned to the generated variants.",
        };

        attributes.seeds = {
            createComponentOfType: "textListFromString",
            description: "Random seeds used when generating variants.",
        };

        return attributes;
    }
}
