import BaseComponent from "./abstract/BaseComponent";

export default class VariantControl extends BaseComponent {
    static componentType = "variantControl";
    static rendererType = undefined;

    static componentDocs = {
        summary:
            "Configures how variants are generated for the enclosing document or section",
    };

    static createAttributesObject() {
        let attributes = super.createAttributesObject();

        // Variants are decided before anything in the document is made, so
        // before a reference can be read: a reference in any of these is
        // ignored, with an error (D47 decision 1).

        attributes.numVariants = {
            createPrimitiveOfType: "integer",
            readBeforeReferences: true,
            description: "The total number of variants to generate.",
        };

        attributes.uniqueVariants = {
            createPrimitiveOfType: "boolean",
            readBeforeReferences: true,
            description:
                "Whether to require generated variants to be uniquely distinguishable.",
        };

        attributes.variantsToInclude = {
            createComponentOfType: "textListFromString",
            readBeforeReferences: true,
            description: "Restrict the available variants to these, by name.",
        };

        attributes.variantsToExclude = {
            createComponentOfType: "textListFromString",
            readBeforeReferences: true,
            description: "Variants to exclude from those generated, by name.",
        };

        attributes.variantNames = {
            createComponentOfType: "textListFromString",
            readBeforeReferences: true,
            description: "Names assigned to the generated variants.",
        };

        attributes.seeds = {
            createComponentOfType: "textListFromString",
            readBeforeReferences: true,
            description: "Random seeds used when generating variants.",
        };

        return attributes;
    }
}
