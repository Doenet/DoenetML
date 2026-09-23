import BaseComponent from "./abstract/BaseComponent";
import {
    returnBorderValidValues,
    returnHalignValidValues,
} from "../utils/tabularAttributes";

/**
 * Settings for one column of a `<tabular>`, modeled on PreTeXt's `<col>`.
 *
 * PreTeXt puts column-level settings on empty `<col>` elements that precede
 * the rows, and allows exactly the four here: `width`, `halign`, `top` and
 * `right`. The two borders are spelled `topBorder` and `endBorder` to match
 * the writing-direction-relative names the rest of the DoenetML tabular
 * vocabulary already uses (see `utils/tabularAttributes.ts`); `endBorder` is
 * PreTeXt's `right` in a left-to-right document.
 *
 * Every attribute defaults to `null` rather than to a concrete value, because
 * a column setting is an *override*: the `<tabular>` collects the non-null
 * ones into `columnSpecs`, and a cell falls back to its column only after its
 * own attribute has come up empty. For `halign` the row is consulted in
 * between (PreTeXt's cell → row → col → tabular order); for `endBorder` there
 * is no row step, because a `<row>` has no trailing-edge border. `topBorder`
 * is not a fallback chain at all — neither a `<cell>` nor a `<row>` has one,
 * and a column's is drawn across the top of that column.
 *
 * `<col>` contributes settings, not content, so it has no renderer of its own
 * — the `<tabular>` draws the `<colgroup>` from `columnSpecs`.
 */
export default class Col extends BaseComponent {
    static componentType = "col";

    static componentDocs = {
        summary:
            "Width, alignment, and border settings for one column of a tabular layout",
    };

    static rendererType = undefined;

    static createAttributesObject() {
        let attributes = super.createAttributesObject();
        attributes.width = {
            description:
                "Display width of this column. Expressed as a percentage of the width of the tabular layout so that it survives conversion to PreTeXt.",
            createComponentOfType: "componentSize",
            createStateVariable: "width",
            defaultValue: null,
            public: true,
            highlighted: true,
        };
        attributes.halign = {
            description: "Horizontal alignment for cells in this column.",
            createComponentOfType: "text",
            createStateVariable: "halign",
            defaultValue: null,
            public: true,
            highlighted: true,
            toLowerCase: true,
            validValues: returnHalignValidValues(),
        };
        attributes.topBorder = {
            description: "Border style for the top edge of this column.",
            createComponentOfType: "text",
            createStateVariable: "topBorder",
            defaultValue: null,
            public: true,
            highlighted: true,
            toLowerCase: true,
            validValues: returnBorderValidValues(),
        };
        attributes.endBorder = {
            description:
                "Border style for the trailing edge of this column: its right edge in a left-to-right document, its left edge in a right-to-left one.",
            createComponentOfType: "text",
            createStateVariable: "endBorder",
            defaultValue: null,
            public: true,
            highlighted: true,
            toLowerCase: true,
            validValues: returnBorderValidValues(),
        };
        return attributes;
    }

    static returnChildGroups() {
        return [];
    }
}
