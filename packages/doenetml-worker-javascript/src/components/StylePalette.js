import BaseComponent from "./abstract/BaseComponent";

import { DEFAULT_PALETTE_NAME, STYLE_PALETTES } from "@doenet/utils";

export class StylePalette extends BaseComponent {
    static componentType = "stylePalette";

    static componentDocs = {
        summary:
            "Selects the built-in style palette used by the containing section",
    };
    static rendererType = undefined;

    static inSchemaOnlyInheritAs = [];

    static createAttributesObject() {
        let attributes = super.createAttributesObject();

        // `validValues` both surfaces the palette names in the schema
        // (autocomplete with each palette's description) and makes the runtime
        // fall back to the default palette with a diagnostic when an unknown
        // name is authored.
        attributes.palette = {
            createComponentOfType: "text",
            createStateVariable: "palette",
            defaultValue: DEFAULT_PALETTE_NAME,
            validValues: Object.values(STYLE_PALETTES).map(
                ({ name, description }) => ({ value: name, description }),
            ),
            description:
                "Name of the built-in style palette that the containing section " +
                "and its subsections use as their base style definitions.",
        };

        return attributes;
    }
}
