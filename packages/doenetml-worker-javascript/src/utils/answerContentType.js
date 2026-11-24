/**
 * The type the sugar of an `<answer>` or an `<award>` reads a component as,
 * by its tag: a math or a number (or a list of them) is a math, a text (or a
 * list of texts) a text, a boolean a boolean, a `<booleanList>` a
 * `"booleanList"` (a boolean, though no input is added for one), and a
 * `<when>` a `"when"` (a condition, though it is a boolean). `undefined` for
 * any other (an `<m>`, a `<point>`), which an award may adapt.
 *
 * One classification for the sugar (`Answer.js`, `Award.js`) and for the
 * answer's type decided at load (`answerTypesAtLoad.ts`), so the two read
 * content alike (#2657 item 14).
 *
 * @param isType Whether the component is of the given tag (by inheritance):
 *   `(tag) => componentIsSpecifiedType(component, tag)` in the sugar, which
 *   also reads the tag a `copy` or `extend` makes.
 * @returns {"math" | "text" | "boolean" | "booleanList" | "when" | undefined}
 */
export function answerContentType(isType) {
    // a `<when>` is a `<boolean>`, so it is told apart first
    if (isType("when")) {
        return "when";
    }
    if (["math", "number", "mathList", "numberList"].some(isType)) {
        return "math";
    }
    if (["text", "textList"].some(isType)) {
        return "text";
    }
    if (isType("booleanList")) {
        return "booleanList";
    }
    if (isType("boolean")) {
        return "boolean";
    }
    return undefined;
}
