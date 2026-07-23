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
        // name is authored. The surfaced value is the palette's canonical
        // camelCase `name`, per the repo convention that enumerated value names
        // read as camelCase. `toLowerCase` makes matching case-insensitive — it
        // lower-cases both the authored value and every `validValues[].value`
        // before comparison, so the lower-cased `name` lands back on the
        // registry key; the LSP resolver mirrors both rules in
        // `findOwnedStylePaletteName`.
        attributes.palette = {
            createComponentOfType: "text",
            createStateVariable: "palette",
            defaultValue: DEFAULT_PALETTE_NAME,
            toLowerCase: true,
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
