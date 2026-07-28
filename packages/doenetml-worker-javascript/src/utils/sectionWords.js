/**
 * The word a sectional block calls itself: "Section", "Example", "Solution".
 *
 * These reach the reader inside the heading `titlePrefix` composes, and — for
 * `<solution>` and `<givenAnswer>` — as the word on the block's own control,
 * so they are *content*, translated against the document's language rather
 * than the reader's UI language.
 *
 * ## Keyed by component type, not by class name
 *
 * `sectionName` used to be `componentClass.name`, the JavaScript class name.
 * That is the same string as the element an author writes only by convention:
 * it is not the authoring vocabulary, it is not stable under a bundler that
 * renames classes, and `<subsection>` already had to override it because the
 * word it wants is "Section". The table below keys on `componentType`, which
 * is the element name itself and is the thing the schema, the parser and the
 * documentation all agree on.
 *
 * A component type the table does not list keeps its class name, untranslated
 * — which is what an internal component with no reader-facing name wants, and
 * is why `sectionWordsCoverage` exists to make sure a new *authorable* one is
 * not left there by accident.
 *
 * ## Written out one call per word
 *
 * `lint:i18n` reads translator call sites textually and only sees a key
 * spelled as a string literal. A table built from a list of keys, or a key
 * assembled from `componentType`, would be invisible to it: the catalog
 * entries would be reported as orphans and a typo would surface only at
 * runtime, in one language, in one element. So each entry names its key, the
 * way `@doenet/utils`' style vocabulary does.
 *
 * The English beside each key is the last-resort fallback the vocabularies all
 * carry, and is the word this replaced.
 */
const SECTION_NAME_WORDS = {
    activity: (t) => t("section-name.activity", undefined, "Activity"),
    aside: (t) => t("section-name.aside", undefined, "Aside"),
    cascade: (t) => t("section-name.cascade", undefined, "Cascade"),
    definition: (t) => t("section-name.definition", undefined, "Definition"),
    example: (t) => t("section-name.example", undefined, "Example"),
    exercise: (t) => t("section-name.exercise", undefined, "Exercise"),
    exercises: (t) => t("section-name.exercises", undefined, "Exercises"),
    givenAnswer: (t) => t("section-name.given-answer", undefined, "Answer"),
    note: (t) => t("section-name.note", undefined, "Note"),
    objectives: (t) => t("section-name.objectives", undefined, "Objectives"),
    paragraphs: (t) => t("section-name.paragraphs", undefined, "Paragraphs"),
    part: (t) => t("section-name.part", undefined, "Part"),
    problem: (t) => t("section-name.problem", undefined, "Problem"),
    problems: (t) => t("section-name.problems", undefined, "Problems"),
    proof: (t) => t("section-name.proof", undefined, "Proof"),
    question: (t) => t("section-name.question", undefined, "Question"),
    section: (t) => t("section-name.section", undefined, "Section"),
    solution: (t) => t("section-name.solution", undefined, "Solution"),
    // A subsection is called a section, at every depth: three element names,
    // one word, one key for a translator to keep.
    subsection: (t) => t("section-name.section", undefined, "Section"),
    subsubsection: (t) => t("section-name.section", undefined, "Section"),
    task: (t) => t("section-name.task", undefined, "Task"),
    theorem: (t) => t("section-name.theorem", undefined, "Theorem"),
};

/**
 * The word `componentType` names itself with, in `t`'s language.
 *
 * @param fallback What to use for a component type the catalog has never named
 *   — the class name, which is what this computed before.
 */
export function sectionNameWord(t, componentType, fallback) {
    const word = SECTION_NAME_WORDS[componentType];
    return word === undefined ? fallback : word(t);
}

/** Which component types {@link sectionNameWord} can name. For tests. */
export function sectionWordsCoverage() {
    return Object.keys(SECTION_NAME_WORDS);
}

/**
 * The heading a section builds for itself: "Example 2", "Section 1.3: Limits".
 *
 * The English this replaced was three `+=` in a row — the name, a space, the
 * number, then `": "` or `". "` before a `<title>` child — which is English
 * word order and English punctuation written into the code. A language that
 * puts the number first, or separates a title differently, could not express
 * that by translating a word.
 *
 * So the pieces go to the catalog as arguments, and which pieces are present
 * goes with them as `$parts`. An absent piece selects a different branch
 * rather than substituting an empty string, which is what lets each
 * combination be ordered and punctuated on its own terms.
 *
 * The `-title` branches end in the separator because the title child is
 * rendered after this string rather than passed into it — it is arbitrary
 * marked-up content, not text. That is the one thing a translation cannot
 * reorder here.
 *
 * @param haveTitleChild Whether an authored `<title>` follows this prefix.
 */
export function composeTitlePrefix({
    t,
    includeAutoName,
    includeAutoNumber,
    haveTitleChild,
    sectionName,
    sectionNumber,
}) {
    // An unnumbered section has no number to include, whatever was asked for,
    // and a block the author renamed to nothing — or to blank space — has no
    // word to show. Either way the piece is absent rather than empty, so it
    // selects a branch that leaves out the space and punctuation around it.
    const withNumber = includeAutoNumber && sectionNumber != null;
    const withName = Boolean(includeAutoName && sectionName?.trim());

    if (!withName && !withNumber) {
        return "";
    }

    const parts = [
        ...(withName ? ["name"] : []),
        ...(withNumber ? ["number"] : []),
        ...(haveTitleChild ? ["title"] : []),
    ].join("-");

    // English, for a locale whose catalog has never seen this message. Built
    // the same way the branches above are, so the two cannot drift.
    const separator = haveTitleChild ? (withName ? ": " : ". ") : "";
    const english =
        (withName ? sectionName : "") +
        (withName && withNumber ? " " : "") +
        (withNumber ? sectionNumber : "") +
        separator;

    return t(
        "section-title-prefix",
        {
            parts,
            sectionName: sectionName ?? "",
            // As text, because Fluent hands a numeric argument to `Intl` — and
            // a section rendered as a list item numbers itself by counting its
            // siblings, so this arrives as a number there. The number
            // identifies the section, so it is not grouped: the thousandth
            // item is "1000" rather than English's "1,000", and the
            // ten-thousandth "10000" rather than Spanish's "10.000".
            sectionNumber: withNumber ? String(sectionNumber) : "",
        },
        english,
    );
}
