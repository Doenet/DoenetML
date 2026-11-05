/**
 * Missing values and missing components (D37, VAL-5).
 *
 * A reference to one thing (a name, an index, a property, an iteration or a
 * pick) gives that thing or a missing value, and a tag whose source is
 * missing is itself missing, whatever it adds. A missing value never equals
 * anything, is shown as a blank inline, and is not drawn in a graph.
 */

/**
 * The renderer of a missing component (`BaseComponent.isMissing`), and of a
 * drawn value reference while it has nothing to read: `＿` inline, announced
 * as a blank, not drawn in a graph, with none of its children drawn.
 */
export const BLANK_RENDERER_TYPE = "_blank";

/** How a missing value reads as text: a blank. */
export const MISSING_TEXT = "＿";
