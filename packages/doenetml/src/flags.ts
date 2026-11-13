export type DoenetMLFlags = {
    showCorrectness: boolean;
    readOnly: boolean;
    solutionDisplayMode:
        "button" | "buttonRequirePermission" | "displayed" | "none";
    showFeedback: boolean;
    showHints: boolean;
    allowLoadState: boolean;
    allowSaveState: boolean;
    saveRendererState: boolean;
    allowLocalState: boolean;
    allowSaveEvents: boolean;
    messageParent: boolean;
    autoSubmit: boolean;
    /**
     * A cap the host sets on how many times each answer can be submitted,
     * without editing the document. The author's `maxNumAttempts` still
     * applies when it is smaller; inside a `sectionWideCheckWork` container
     * the cap applies to that container's check-work button. `null` (the
     * default) means no cap. `null` rather than `Infinity` because flags are
     * sent to the iframe wrapper as JSON, which turns `Infinity` into `null`.
     */
    maxNumAttempts: number | null;
    /**
     * A prefix the host sets for the numbers the document shows, without
     * editing it: with `"3.2"`, figures and tables read "Figure 3.2.1", numbered
     * equations "(3.2.1)", and blocks numbered through the document (see
     * `<document blockNumbering="document">`) "Example 3.2.1". For a page of a
     * book whose place is section 3.2. `null` (the default) means no prefix.
     */
    numberingPrefix: string | null;
};

export const defaultFlags: DoenetMLFlags = {
    showCorrectness: true,
    readOnly: false,
    solutionDisplayMode: "button",
    showFeedback: true,
    showHints: true,
    allowLoadState: true,
    allowSaveState: true,
    saveRendererState: false,
    allowLocalState: false,
    allowSaveEvents: true,
    messageParent: false,
    autoSubmit: false,
    maxNumAttempts: null,
    numberingPrefix: null,
};
