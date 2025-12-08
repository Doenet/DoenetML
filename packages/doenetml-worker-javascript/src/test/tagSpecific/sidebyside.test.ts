import { describe, expect, it, vi } from "vitest";
import { createTestCore, ResolvePathToNodeIdx } from "../utils/test-core";
import { updateMathInputValue, updateTextInputValue } from "../utils/actions";
import { PublicDoenetMLCore } from "../../CoreWorker";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

let checkSingleColumnSbs = async function ({
    core,
    resolvePathToNodeIdx,
    specifiedWidth = null,
    specifiedMargins = [null, null],
    specifiedValign = null,
    sbsName = "sbs",
    isSbsGroup = false,
}: {
    core: PublicDoenetMLCore;
    resolvePathToNodeIdx: ResolvePathToNodeIdx;
    specifiedWidth?: number | null;
    specifiedMargins?: (number | null)[];
    specifiedValign?: null | "top" | "middle" | "bottom";
    sbsName?: string;
    isSbsGroup?: boolean;
}) {
    let actualWidth = specifiedWidth;
    let actualLeftMargin = specifiedMargins[0];
    let actualRightMargin = specifiedMargins[1];

    if (actualWidth === null) {
        if (actualLeftMargin === null) {
            if (actualRightMargin === null) {
                actualWidth = 100;
                actualLeftMargin = actualRightMargin = 0;
            } else {
                actualLeftMargin = 0;
                actualWidth = Math.max(0, 100 - actualRightMargin);
            }
        } else {
            if (actualRightMargin === null) {
                actualRightMargin = 0;
                actualWidth = Math.max(0, 100 - actualLeftMargin);
            } else {
                actualWidth = Math.max(
                    0,
                    100 - actualLeftMargin - actualRightMargin,
                );
            }
        }
    } else {
        if (actualLeftMargin === null) {
            if (actualRightMargin === null) {
                actualLeftMargin = actualRightMargin = Math.max(
                    0,
                    (100 - actualWidth) / 2,
                );
            } else {
                actualLeftMargin = Math.max(
                    0,
                    100 - actualWidth - actualRightMargin,
                );
            }
        } else {
            if (actualRightMargin === null) {
                actualRightMargin = Math.max(
                    0,
                    100 - actualWidth - actualLeftMargin,
                );
            }
        }
    }

    let originalTotal = actualWidth + actualLeftMargin + actualRightMargin;

    if (originalTotal > 100) {
        // rescale to 100
        let rescale = 100 / originalTotal;
        actualWidth *= rescale;
        actualLeftMargin *= rescale;
        actualRightMargin *= rescale;
    } else if (originalTotal < 100) {
        // add to right margin
        actualRightMargin += 100 - originalTotal;
    }

    let valign = specifiedValign ? specifiedValign : "top";

    let stateVariables = await core.returnAllStateVariables(false, true);

    let specifiedWidthName = isSbsGroup
        ? "specifiedWidths"
        : "allWidthsSpecified";
    let specifiedMarginName = isSbsGroup
        ? "specifiedMargins"
        : "allMarginsSpecified";

    const sbsIdx = await resolvePathToNodeIdx(sbsName);

    expect(stateVariables[sbsIdx].stateValues.widths.length).eq(1);
    expect(stateVariables[sbsIdx].stateValues[specifiedWidthName]).eqls([
        specifiedWidth,
    ]);
    expect(stateVariables[sbsIdx].stateValues.widths[0]).closeTo(
        actualWidth,
        1e-5,
    );
    expect(stateVariables[sbsIdx].stateValues[specifiedMarginName]).eqls(
        specifiedMargins,
    );
    expect(stateVariables[sbsIdx].stateValues.margins.length).eq(2);
    expect(stateVariables[sbsIdx].stateValues.margins[0]).closeTo(
        actualLeftMargin,
        1e-5,
    );
    expect(stateVariables[sbsIdx].stateValues.margins[1]).closeTo(
        actualRightMargin,
        1e-5,
    );
    expect(stateVariables[sbsIdx].stateValues.valigns).eqls([valign]);
};

let checkTwoColumnSbs = async function ({
    core,
    resolvePathToNodeIdx,
    specifiedWidths = [null, null],
    specifiedMargins = [null, null],
    specifiedValigns = [null, null],
    sbsName = "sbs",
    isSbsGroup = false,
}: {
    core: PublicDoenetMLCore;
    resolvePathToNodeIdx: ResolvePathToNodeIdx;
    specifiedWidths?: (number | null)[];
    specifiedMargins?: (number | null)[];
    specifiedValigns?: (null | "top" | "middle" | "bottom")[];
    sbsName?: string;
    isSbsGroup?: boolean;
}) {
    let actualWidth1 = specifiedWidths[0];
    let actualWidth2 = specifiedWidths[1];
    let actualLeftMargin = specifiedMargins[0];
    let actualRightMargin = specifiedMargins[1];
    let actualGap = 0;

    if (actualWidth1 === null) {
        if (actualWidth2 === null) {
            if (actualLeftMargin === null) {
                if (actualRightMargin === null) {
                    actualWidth1 = actualWidth2 = 50;
                    actualLeftMargin = actualRightMargin = 0;
                } else {
                    actualWidth1 = actualWidth2 = Math.max(
                        0,
                        (100 - 2 * actualRightMargin) / 2,
                    );
                    actualLeftMargin = 0;
                }
            } else {
                if (actualRightMargin === null) {
                    actualWidth1 = actualWidth2 = Math.max(
                        0,
                        (100 - 2 * actualLeftMargin) / 2,
                    );
                    actualRightMargin = 0;
                } else {
                    actualWidth1 = actualWidth2 = Math.max(
                        0,
                        (100 - 2 * (actualLeftMargin + actualRightMargin)) / 2,
                    );
                }
            }
        } else {
            if (actualLeftMargin === null) {
                if (actualRightMargin === null) {
                    actualWidth1 = Math.max(0, 100 - actualWidth2);
                    actualLeftMargin = actualRightMargin = 0;
                } else {
                    actualWidth1 = Math.max(
                        0,
                        100 - actualWidth2 - 2 * actualRightMargin,
                    );
                    actualLeftMargin = 0;
                }
            } else {
                if (actualRightMargin === null) {
                    actualWidth1 = Math.max(
                        0,
                        100 - actualWidth2 - 2 * actualLeftMargin,
                    );
                    actualRightMargin = 0;
                } else {
                    actualWidth1 = Math.max(
                        0,
                        100 -
                            actualWidth2 -
                            2 * (actualLeftMargin + actualRightMargin),
                    );
                }
            }
        }
    } else {
        if (actualWidth2 === null) {
            if (actualLeftMargin === null) {
                if (actualRightMargin === null) {
                    actualWidth2 = Math.max(0, 100 - actualWidth1);
                    actualLeftMargin = actualRightMargin = 0;
                } else {
                    actualWidth2 = Math.max(
                        0,
                        100 - actualWidth1 - 2 * actualRightMargin,
                    );
                    actualLeftMargin = 0;
                }
            } else {
                if (actualRightMargin === null) {
                    actualWidth2 = Math.max(
                        0,
                        100 - actualWidth1 - 2 * actualLeftMargin,
                    );
                    actualRightMargin = 0;
                } else {
                    actualWidth2 = Math.max(
                        0,
                        100 -
                            actualWidth1 -
                            2 * (actualLeftMargin + actualRightMargin),
                    );
                }
            }
        } else {
            if (actualLeftMargin === null) {
                if (actualRightMargin === null) {
                    actualLeftMargin = actualRightMargin = Math.max(
                        0,
                        (100 - actualWidth1 - actualWidth2) / 4,
                    );
                } else {
                    actualLeftMargin = Math.max(
                        0,
                        (100 -
                            actualWidth1 -
                            actualWidth2 -
                            2 * actualRightMargin) /
                            2,
                    );
                }
            } else {
                if (actualRightMargin === null) {
                    actualRightMargin = Math.max(
                        0,
                        (100 -
                            actualWidth1 -
                            actualWidth2 -
                            2 * actualLeftMargin) /
                            2,
                    );
                }
            }
        }
    }

    let originalTotal =
        actualWidth1 +
        actualWidth2 +
        2 * (actualLeftMargin + actualRightMargin);

    if (originalTotal > 100) {
        // rescale to 100
        let rescale = 100 / originalTotal;
        actualWidth1 *= rescale;
        actualWidth2 *= rescale;
        actualLeftMargin *= rescale;
        actualRightMargin *= rescale;
    } else if (originalTotal < 100) {
        // add to gap
        actualGap = 100 - originalTotal;
    }

    let valigns = [
        specifiedValigns[0] ? specifiedValigns[0] : "top",
        specifiedValigns[1] ? specifiedValigns[1] : "top",
    ];

    let specifiedWidthName = isSbsGroup
        ? "specifiedWidths"
        : "allWidthsSpecified";
    let specifiedMarginName = isSbsGroup
        ? "specifiedMargins"
        : "allMarginsSpecified";

    const sbsIdx = await resolvePathToNodeIdx(sbsName);

    let stateVariables = await core.returnAllStateVariables(false, true);
    expect(stateVariables[sbsIdx].stateValues[specifiedWidthName]).eqls(
        specifiedWidths,
    );
    expect(stateVariables[sbsIdx].stateValues.widths.length).eq(2);
    expect(stateVariables[sbsIdx].stateValues.widths[0]).closeTo(
        actualWidth1,
        1e-5,
    );
    expect(stateVariables[sbsIdx].stateValues.widths[1]).closeTo(
        actualWidth2,
        1e-5,
    );
    expect(stateVariables[sbsIdx].stateValues[specifiedMarginName]).eqls(
        specifiedMargins,
    );
    expect(stateVariables[sbsIdx].stateValues.margins.length).eq(2);
    expect(stateVariables[sbsIdx].stateValues.margins[0]).closeTo(
        actualLeftMargin,
        1e-5,
    );
    expect(stateVariables[sbsIdx].stateValues.margins[1]).closeTo(
        actualRightMargin,
        1e-5,
    );
    expect(stateVariables[sbsIdx].stateValues.gapWidth).closeTo(
        actualGap,
        1e-5,
    );
    expect(stateVariables[sbsIdx].stateValues.valigns).eqls(valigns);
};

let checkFourColumnSbs = async function ({
    core,
    resolvePathToNodeIdx,
    specifiedWidths = [null, null, null, null],
    specifiedMargins = [null, null],
    specifiedValigns = [null, null, null, null],
    sbsName = "sbs",
    isSbsGroup = false,
}: {
    core: PublicDoenetMLCore;
    resolvePathToNodeIdx: ResolvePathToNodeIdx;
    specifiedWidths?: (number | null)[];
    specifiedMargins?: (number | null)[];
    specifiedValigns?: (null | "top" | "middle" | "bottom")[];
    sbsName?: string;
    isSbsGroup?: boolean;
}) {
    let totalWidthSpecified = 0;
    let nWidthsUndefined = 0;

    for (let ind = 0; ind < 4; ind++) {
        let width = specifiedWidths[ind];
        if (width === null) {
            nWidthsUndefined++;
        } else {
            totalWidthSpecified += width;
        }
    }

    let totalMarginSpecified = 0;
    let nMarginsUndefined = 0;

    for (let ind = 0; ind < 2; ind++) {
        let margin = specifiedMargins[ind];
        if (margin === null) {
            nMarginsUndefined++;
        } else {
            totalMarginSpecified += margin;
        }
    }
    totalMarginSpecified *= 4;

    let actualWidths: number[];
    let actualMargins: number[];
    let actualGap = 0;

    if (totalWidthSpecified + totalMarginSpecified >= 100) {
        // we are already over 100%
        // anything null becomes width 0
        // everything else is normalized to add up to 100

        let normalization = 100 / (totalWidthSpecified + totalMarginSpecified);
        actualWidths = specifiedWidths.map((v) =>
            v === null ? 0 : v * normalization,
        );
        actualMargins = specifiedMargins.map((v) =>
            v === null ? 0 : v * normalization,
        );
    } else {
        // since we are under 100%, we try the following to get to 100%
        // 1. if there are any null widths,
        //    define them to be the same value that makes the total 100%
        //    and make any null margins be zero
        // 2. else, if there are any null margins,
        //    define them to be the same value that makes the total 100%
        // 3. else set gapWidth to make the total 100%

        if (nWidthsUndefined > 0) {
            let newWidth =
                (100 - (totalWidthSpecified + totalMarginSpecified)) /
                nWidthsUndefined;
            actualWidths = specifiedWidths.map((v) =>
                v === null ? newWidth : v,
            );

            actualMargins = specifiedMargins.map((v) => (v === null ? 0 : v));
        } else if (nMarginsUndefined > 0) {
            // Note: there aren't any null specified widths since nWidthsUndefined == 0, but typescript doesn't know it
            actualWidths = specifiedWidths.map(Number);
            let newMargin =
                (100 - (totalWidthSpecified + totalMarginSpecified)) /
                (nMarginsUndefined * 4);
            actualMargins = specifiedMargins.map((v) =>
                v === null ? newMargin : v,
            );
        } else {
            // Note: there aren't any null specified widths since nWidthsUndefined == 0, but typescript doesn't know it
            actualWidths = specifiedWidths.map(Number);
            // Note: there aren't any null specified margins since nMarginsUndefined == 0, but typescript doesn't know it
            actualMargins = specifiedMargins.map(Number);
            actualGap =
                (100 - (totalWidthSpecified + totalMarginSpecified)) / 3;
        }
    }

    let actualLeftMargin = actualMargins[0];
    let actualRightMargin = actualMargins[1];

    let valigns = specifiedValigns.map((x) => (x ? x : "top"));

    let specifiedWidthName = isSbsGroup
        ? "specifiedWidths"
        : "allWidthsSpecified";
    let specifiedMarginName = isSbsGroup
        ? "specifiedMargins"
        : "allMarginsSpecified";

    const sbsIdx = await resolvePathToNodeIdx(sbsName);

    let stateVariables = await core.returnAllStateVariables(false, true);
    expect(stateVariables[sbsIdx].stateValues[specifiedWidthName]).eqls(
        specifiedWidths,
    );
    expect(stateVariables[sbsIdx].stateValues.widths.length).eq(4);
    expect(stateVariables[sbsIdx].stateValues.widths[0]).closeTo(
        actualWidths[0],
        1e-5,
    );
    expect(stateVariables[sbsIdx].stateValues.widths[1]).closeTo(
        actualWidths[1],
        1e-5,
    );
    expect(stateVariables[sbsIdx].stateValues.widths[2]).closeTo(
        actualWidths[2],
        1e-5,
    );
    expect(stateVariables[sbsIdx].stateValues.widths[3]).closeTo(
        actualWidths[3],
        1e-5,
    );
    expect(stateVariables[sbsIdx].stateValues[specifiedMarginName]).eqls(
        specifiedMargins,
    );
    expect(stateVariables[sbsIdx].stateValues.margins.length).eq(2);
    expect(stateVariables[sbsIdx].stateValues.margins[0]).closeTo(
        actualLeftMargin,
        1e-5,
    );
    expect(stateVariables[sbsIdx].stateValues.margins[1]).closeTo(
        actualRightMargin,
        1e-5,
    );
    expect(stateVariables[sbsIdx].stateValues.gapWidth).closeTo(
        actualGap,
        1e-5,
    );
    expect(stateVariables[sbsIdx].stateValues.valigns).eqls(valigns);
};

describe("SideBySide tag tests", async () => {
    it("sideBySide with no arguments, one panel, change margins first", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <sideBySide name="sbs">
    <lorem generateParagraphs="1" />
    </sideBySide>

    <p>Width: 
    <mathInput name="w1" bindValueTo="$(sbs.width1)" />
    </p>

    <p>Margins: 
    <mathInput name="m1" bindValueTo="$(sbs.margin1)" />
    <mathInput name="m2" bindValueTo="$(sbs.margin2)" />
    </p>

    <p>Valign: 
    <textInput name="v1" bindValueTo="$(sbs.valign1)" />
    </p>
    `,
        });

        await checkSingleColumnSbs({
            core,
            resolvePathToNodeIdx,
            sbsName: "sbs",
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs")].stateValues
                .absoluteMeasurements,
        ).eq(false);

        // change left margin first, unspecified width adjusts
        await updateMathInputValue({
            latex: "10",
            componentIdx: await resolvePathToNodeIdx("m1"),
            core,
        });
        await checkSingleColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedMargins: [10, null],
            sbsName: "sbs",
        });

        // change right margin, unspecified width adjusts
        await updateMathInputValue({
            latex: "20",
            componentIdx: await resolvePathToNodeIdx("m2"),
            core,
        });
        await checkSingleColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedMargins: [10, 20],
            sbsName: "sbs",
        });

        // change width to be smaller, add extra to right margin
        //  Note: add to right margin since with one panel, there is not gapWidth to set
        await updateMathInputValue({
            latex: "60",
            componentIdx: await resolvePathToNodeIdx("w1"),
            core,
        });
        await checkSingleColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidth: 60,
            specifiedMargins: [10, 20],
            sbsName: "sbs",
        });

        // change width to be larger, rescale to 100%
        // Note: this rescaling ignores the extra width added to the right margin,
        // as it was an indirect consequence of changing the width.
        // Computations assume the right margin is at the origin 20% specified
        await updateMathInputValue({
            latex: "95",
            componentIdx: await resolvePathToNodeIdx("w1"),
            core,
        });
        await checkSingleColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidth: 95,
            specifiedMargins: [10, 20],
            sbsName: "sbs",
        });

        // shrink margins to make specified values add back to 100%
        await updateMathInputValue({
            latex: "3",
            componentIdx: await resolvePathToNodeIdx("m1"),
            core,
        });
        await updateMathInputValue({
            latex: "2",
            componentIdx: await resolvePathToNodeIdx("m2"),
            core,
        });
        await checkSingleColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidth: 95,
            specifiedMargins: [3, 2],
            sbsName: "sbs",
        });

        // shrink right margin to 1, gets recreated to make 100%
        await updateMathInputValue({
            latex: "1",
            componentIdx: await resolvePathToNodeIdx("m2"),
            core,
        });
        await checkSingleColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidth: 95,
            specifiedMargins: [3, 1],
            sbsName: "sbs",
        });

        // increase left margin to make specified total be 100%
        await updateMathInputValue({
            latex: "4",
            componentIdx: await resolvePathToNodeIdx("m1"),
            core,
        });
        await checkSingleColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidth: 95,
            specifiedMargins: [4, 1],
            sbsName: "sbs",
        });

        // change totals to keep at 100%
        await updateMathInputValue({
            latex: "80",
            componentIdx: await resolvePathToNodeIdx("w1"),
            core,
        });
        await updateMathInputValue({
            latex: "5",
            componentIdx: await resolvePathToNodeIdx("m2"),
            core,
        });
        await updateMathInputValue({
            latex: "15",
            componentIdx: await resolvePathToNodeIdx("m1"),
            core,
        });
        await checkSingleColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidth: 80,
            specifiedMargins: [15, 5],
            sbsName: "sbs",
        });

        // increasing right margin rescales
        await updateMathInputValue({
            latex: "30",
            componentIdx: await resolvePathToNodeIdx("m2"),
            core,
        });
        await checkSingleColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidth: 80,
            specifiedMargins: [15, 30],
            sbsName: "sbs",
        });

        // increasing left margin rescales
        await updateMathInputValue({
            latex: "50",
            componentIdx: await resolvePathToNodeIdx("m1"),
            core,
        });
        await checkSingleColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidth: 80,
            specifiedMargins: [50, 30],
            sbsName: "sbs",
        });

        // shrink width to get specified back to 100%
        await updateMathInputValue({
            latex: "20",
            componentIdx: await resolvePathToNodeIdx("w1"),
            core,
        });
        await checkSingleColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidth: 20,
            specifiedMargins: [50, 30],
            sbsName: "sbs",
        });

        // change valign
        await updateTextInputValue({
            text: "bottom",
            componentIdx: await resolvePathToNodeIdx("v1"),
            core,
        });
        await checkSingleColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidth: 20,
            specifiedMargins: [50, 30],
            specifiedValign: "bottom",
            sbsName: "sbs",
        });

        // invalid valign ignored
        await updateTextInputValue({
            text: "invalid",
            componentIdx: await resolvePathToNodeIdx("v1"),
            core,
        });
        await checkSingleColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidth: 20,
            specifiedMargins: [50, 30],
            specifiedValign: "bottom",
            sbsName: "sbs",
        });
    });

    it("sideBySide with no arguments, one panel, change width first", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <sideBySide name="sbs">
    <lorem generateParagraphs="1" />
    </sideBySide>

    <p>Width: 
    <mathInput name="w1" bindValueTo="$(sbs.width1)" />
    </p>

    <p>Margins: 
    <mathInput name="m1" bindValueTo="$(sbs.margin1)" />
    <mathInput name="m2" bindValueTo="$(sbs.margin2)" />
    </p>

    <p>Valign: 
    <textInput name="v1" bindValueTo="$(sbs.valign1)" />
    </p>
    `,
        });

        await checkSingleColumnSbs({
            core,
            resolvePathToNodeIdx,
            sbsName: "sbs",
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs")].stateValues
                .absoluteMeasurements,
        ).eq(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs")].stateValues
                .allWidthsSpecified,
        ).eqls([null]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs")].stateValues
                .widths,
        ).eqls([100]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs")].stateValues
                .allMarginsSpecified,
        ).eqls([null, null]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs")].stateValues
                .margins,
        ).eqls([0, 0]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs")].stateValues
                .valigns,
        ).eqls(["top"]);

        // change width first, unspecified margins adjusts
        await updateMathInputValue({
            latex: "70",
            componentIdx: await resolvePathToNodeIdx("w1"),
            core,
        });
        await checkSingleColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidth: 70,
            sbsName: "sbs",
        });

        // change width larger than 100%, scaled back to 100%
        await updateMathInputValue({
            latex: "170",
            componentIdx: await resolvePathToNodeIdx("w1"),
            core,
        });
        await checkSingleColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidth: 170,
            sbsName: "sbs",
        });

        // change width smaller again
        await updateMathInputValue({
            latex: "60",
            componentIdx: await resolvePathToNodeIdx("w1"),
            core,
        });
        await checkSingleColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidth: 60,
            sbsName: "sbs",
        });

        // change right margin, unspecified left margin adjusts
        await updateMathInputValue({
            latex: "10",
            componentIdx: await resolvePathToNodeIdx("m2"),
            core,
        });
        await checkSingleColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidth: 60,
            specifiedMargins: [null, 10],
            sbsName: "sbs",
        });

        // change right margin so total is larger than 100%, rescales
        await updateMathInputValue({
            latex: "60",
            componentIdx: await resolvePathToNodeIdx("m2"),
            core,
        });
        await checkSingleColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidth: 60,
            specifiedMargins: [null, 60],
            sbsName: "sbs",
        });

        // change left margin to be large, rescaling adjusts
        //  Note: add to right margin since with one panel, there is not gapWidth to set
        await updateMathInputValue({
            latex: "120",
            componentIdx: await resolvePathToNodeIdx("m1"),
            core,
        });
        await checkSingleColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidth: 60,
            specifiedMargins: [120, 60],
            sbsName: "sbs",
        });
    });

    it("sideBySide with singular relative arguments, one panel", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <sideBySide name="sbs" width="80%" margins="10%" valign="middle">
    <lorem generateParagraphs="1" />
    </sideBySide>

    <p>Width: 
    <mathInput name="w1" bindValueTo="$(sbs.width1)" />
    </p>

    <p>Margins: 
    <mathInput name="m1" bindValueTo="$(sbs.margin1)" />
    <mathInput name="m2" bindValueTo="$(sbs.margin2)" />
    </p>

    <p>Valign: 
    <textInput name="v1" bindValueTo="$(sbs.valign1)" />
    </p>
    `,
        });

        await checkSingleColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidth: 80,
            specifiedMargins: [10, 10],
            specifiedValign: "middle",
            sbsName: "sbs",
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs")].stateValues
                .absoluteMeasurements,
        ).eq(false);

        // change left margin, specified margins stay symmetric, get rescaling
        await updateMathInputValue({
            latex: "40",
            componentIdx: await resolvePathToNodeIdx("m1"),
            core,
        });
        await checkSingleColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidth: 80,
            specifiedMargins: [40, 40],
            specifiedValign: "middle",
            sbsName: "sbs",
        });

        // change right margin, specified margins stay symmetric, extra added to right
        await updateMathInputValue({
            latex: "5",
            componentIdx: await resolvePathToNodeIdx("m2"),
            core,
        });
        await checkSingleColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidth: 80,
            specifiedMargins: [5, 5],
            specifiedValign: "middle",
            sbsName: "sbs",
        });

        // symmetry regained by increasing width
        await updateMathInputValue({
            latex: "90",
            componentIdx: await resolvePathToNodeIdx("w1"),
            core,
        });
        await checkSingleColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidth: 90,
            specifiedMargins: [5, 5],
            specifiedValign: "middle",
            sbsName: "sbs",
        });

        // change valign
        await updateTextInputValue({
            text: "bottom",
            componentIdx: await resolvePathToNodeIdx("v1"),
            core,
        });
        await checkSingleColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidth: 90,
            specifiedMargins: [5, 5],
            specifiedValign: "bottom",
            sbsName: "sbs",
        });

        // ignore invalid valign
        await updateTextInputValue({
            text: "green",
            componentIdx: await resolvePathToNodeIdx("v1"),
            core,
        });
        await checkSingleColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidth: 90,
            specifiedMargins: [5, 5],
            specifiedValign: "bottom",
            sbsName: "sbs",
        });
    });

    it("sideBySide with plural relative arguments, one panel", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <sideBySide name="sbs" widths="80%" margins="15% 5%" valigns="middle">
    <lorem generateParagraphs="1" />
    </sideBySide>

    <p>Width: 
    <mathInput name="w1" bindValueTo="$(sbs.width1)" />
    </p>

    <p>Margins: 
    <mathInput name="m1" bindValueTo="$(sbs.margin1)" />
    <mathInput name="m2" bindValueTo="$(sbs.margin2)" />
    </p>

    <p>Valign: 
    <textInput name="v1" bindValueTo="$(sbs.valign1)" />
    </p>
    `,
        });

        await checkSingleColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidth: 80,
            specifiedMargins: [15, 5],
            specifiedValign: "middle",
            sbsName: "sbs",
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs")].stateValues
                .absoluteMeasurements,
        ).eq(false);

        // decrease left margin, space added to right margin
        await updateMathInputValue({
            latex: "10",
            componentIdx: await resolvePathToNodeIdx("m1"),
            core,
        });
        await checkSingleColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidth: 80,
            specifiedMargins: [10, 5],
            specifiedValign: "middle",
            sbsName: "sbs",
        });

        // increase right margin, get rescaling
        await updateMathInputValue({
            latex: "35",
            componentIdx: await resolvePathToNodeIdx("m2"),
            core,
        });
        await checkSingleColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidth: 80,
            specifiedMargins: [10, 35],
            specifiedValign: "middle",
            sbsName: "sbs",
        });

        // decrease width to return to 100%
        await updateMathInputValue({
            latex: "55",
            componentIdx: await resolvePathToNodeIdx("w1"),
            core,
        });
        await checkSingleColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidth: 55,
            specifiedMargins: [10, 35],
            specifiedValign: "middle",
            sbsName: "sbs",
        });

        // change valign
        await updateTextInputValue({
            text: "bottom",
            componentIdx: await resolvePathToNodeIdx("v1"),
            core,
        });
        await checkSingleColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidth: 55,
            specifiedMargins: [10, 35],
            specifiedValign: "bottom",
            sbsName: "sbs",
        });

        // ignore invalid valign
        await updateTextInputValue({
            text: "green",
            componentIdx: await resolvePathToNodeIdx("v1"),
            core,
        });
        await checkSingleColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidth: 55,
            specifiedMargins: [10, 35],
            specifiedValign: "bottom",
            sbsName: "sbs",
        });
    });

    it("sideBySide with singular relative arguments and auto margins, one panel", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <sideBySide name="sbs" width="80%" margins="auto" valign="middle">
    <lorem generateParagraphs="1" />
    </sideBySide>

    <p>Width: 
    <mathInput name="w1" bindValueTo="$(sbs.width1)" />
    </p>

    <p>Margins: 
    <mathInput name="m1" bindValueTo="$(sbs.margin1)" />
    <mathInput name="m2" bindValueTo="$(sbs.margin2)" />
    </p>

    <p>Valign: 
    <textInput name="v1" bindValueTo="$(sbs.valign1)" />
    </p>
    `,
        });

        await checkSingleColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidth: 80,
            specifiedValign: "middle",
            sbsName: "sbs",
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs")].stateValues
                .absoluteMeasurements,
        ).eq(false);

        // change left margin, specified margins stay symmetric, get rescaling
        await updateMathInputValue({
            latex: "40",
            componentIdx: await resolvePathToNodeIdx("m1"),
            core,
        });
        await checkSingleColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidth: 80,
            specifiedMargins: [40, 40],
            specifiedValign: "middle",
            sbsName: "sbs",
        });

        // change right margin, specified margins stay symmetric, extra added to right
        await updateMathInputValue({
            latex: "5",
            componentIdx: await resolvePathToNodeIdx("m2"),
            core,
        });
        await checkSingleColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidth: 80,
            specifiedMargins: [5, 5],
            specifiedValign: "middle",
            sbsName: "sbs",
        });

        // symmetry regained by increasing width
        await updateMathInputValue({
            latex: "90",
            componentIdx: await resolvePathToNodeIdx("w1"),
            core,
        });
        await checkSingleColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidth: 90,
            specifiedMargins: [5, 5],
            specifiedValign: "middle",
            sbsName: "sbs",
        });

        // change valign
        await updateTextInputValue({
            text: "bottom",
            componentIdx: await resolvePathToNodeIdx("v1"),
            core,
        });
        await checkSingleColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidth: 90,
            specifiedMargins: [5, 5],
            specifiedValign: "bottom",
            sbsName: "sbs",
        });

        // ignore invalid valign
        await updateTextInputValue({
            text: "green",
            componentIdx: await resolvePathToNodeIdx("v1"),
            core,
        });
        await checkSingleColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidth: 90,
            specifiedMargins: [5, 5],
            specifiedValign: "bottom",
            sbsName: "sbs",
        });
    });

    it("sideBySide with no arguments, two panels, change margins first", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <sideBySide name="sbs">
    <lorem generateParagraphs="1" />
    <lorem generateParagraphs="1" />
    </sideBySide>

    <p>Widths: 
    <mathInput name="w1" bindValueTo="$(sbs.width1)" />
    <mathInput name="w2" bindValueTo="$(sbs.width2)" />
    </p>

    <p>Margins: 
    <mathInput name="m1" bindValueTo="$(sbs.margin1)" />
    <mathInput name="m2" bindValueTo="$(sbs.margin2)" />
    </p>

    <p>Valigns: 
    <textInput name="v1" bindValueTo="$(sbs.valign1)" />
    <textInput name="v2" bindValueTo="$(sbs.valign2)" />
    </p>
    `,
        });

        await checkTwoColumnSbs({ core, resolvePathToNodeIdx, sbsName: "sbs" });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs")].stateValues
                .absoluteMeasurements,
        ).eq(false);

        // change left margin first, unspecified widths adjust
        await updateMathInputValue({
            latex: "10",
            componentIdx: await resolvePathToNodeIdx("m1"),
            core,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedMargins: [10, null],
            sbsName: "sbs",
        });

        // change right margin, unspecified widths adjust
        await updateMathInputValue({
            latex: "5",
            componentIdx: await resolvePathToNodeIdx("m2"),
            core,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedMargins: [10, 5],
            sbsName: "sbs",
        });

        // change first width to be smaller, add extra to second width
        await updateMathInputValue({
            latex: "20",
            componentIdx: await resolvePathToNodeIdx("w1"),
            core,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [20, null],
            specifiedMargins: [10, 5],
            sbsName: "sbs",
        });

        // change first width to be larger, second width shrinks to zero, rescale to 100%
        await updateMathInputValue({
            latex: "95",
            componentIdx: await resolvePathToNodeIdx("w1"),
            core,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [95, null],
            specifiedMargins: [10, 5],
            sbsName: "sbs",
        });

        // change first width to be smaller again
        await updateMathInputValue({
            latex: "10",
            componentIdx: await resolvePathToNodeIdx("w1"),
            core,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [10, null],
            specifiedMargins: [10, 5],
            sbsName: "sbs",
        });

        // change second width to be smaller, extra added to gap
        await updateMathInputValue({
            latex: "50",
            componentIdx: await resolvePathToNodeIdx("w2"),
            core,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [10, 50],
            specifiedMargins: [10, 5],
            sbsName: "sbs",
        });

        // change second width to be larger, rescaled to 100%
        await updateMathInputValue({
            latex: "85",
            componentIdx: await resolvePathToNodeIdx("w2"),
            core,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [10, 85],
            specifiedMargins: [10, 5],
            sbsName: "sbs",
        });

        // shrink margins to make specified values add back to 100%
        await updateMathInputValue({
            latex: "1.5",
            componentIdx: await resolvePathToNodeIdx("m1"),
            core,
        });
        await updateMathInputValue({
            latex: "1",
            componentIdx: await resolvePathToNodeIdx("m2"),
            core,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [10, 85],
            specifiedMargins: [1.5, 1],
            sbsName: "sbs",
        });

        // shrink right margin to 0.5, extra added to gap
        await updateMathInputValue({
            latex: "0.5",
            componentIdx: await resolvePathToNodeIdx("m2"),
            core,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [10, 85],
            specifiedMargins: [1.5, 0.5],
            sbsName: "sbs",
        });

        // increase left margin to make specified total be 100%
        await updateMathInputValue({
            latex: "2",
            componentIdx: await resolvePathToNodeIdx("m1"),
            core,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [10, 85],
            specifiedMargins: [2, 0.5],
            sbsName: "sbs",
        });

        // change totals to keep at 100%
        await updateMathInputValue({
            latex: "30",
            componentIdx: await resolvePathToNodeIdx("w1"),
            core,
        });
        await updateMathInputValue({
            latex: "50",
            componentIdx: await resolvePathToNodeIdx("w2"),
            core,
        });
        await updateMathInputValue({
            latex: "4",
            componentIdx: await resolvePathToNodeIdx("m1"),
            core,
        });
        await updateMathInputValue({
            latex: "6",
            componentIdx: await resolvePathToNodeIdx("m2"),
            core,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [30, 50],
            specifiedMargins: [4, 6],
            sbsName: "sbs",
        });

        // increasing right margin rescales
        await updateMathInputValue({
            latex: "18.5",
            componentIdx: await resolvePathToNodeIdx("m2"),
            core,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [30, 50],
            specifiedMargins: [4, 18.5],
            sbsName: "sbs",
        });

        // increasing left margin rescales
        await updateMathInputValue({
            latex: "21.5",
            componentIdx: await resolvePathToNodeIdx("m1"),
            core,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [30, 50],
            specifiedMargins: [21.5, 18.5],
            sbsName: "sbs",
        });

        // shrink widths to get specified below 100%
        await updateMathInputValue({
            latex: "5",
            componentIdx: await resolvePathToNodeIdx("w1"),
            core,
        });
        await updateMathInputValue({
            latex: "10",
            componentIdx: await resolvePathToNodeIdx("w2"),
            core,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [5, 10],
            specifiedMargins: [21.5, 18.5],
            sbsName: "sbs",
        });

        // change first valign
        await updateTextInputValue({
            text: "bottom",
            componentIdx: await resolvePathToNodeIdx("v1"),
            core,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [5, 10],
            specifiedMargins: [21.5, 18.5],
            specifiedValigns: ["bottom", null],
            sbsName: "sbs",
        });

        // change second valign
        await updateTextInputValue({
            text: "middle",
            componentIdx: await resolvePathToNodeIdx("v2"),
            core,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [5, 10],
            specifiedMargins: [21.5, 18.5],
            specifiedValigns: ["bottom", "middle"],
            sbsName: "sbs",
        });

        // invalid valign ignored
        await updateTextInputValue({
            text: "invalid",
            componentIdx: await resolvePathToNodeIdx("v2"),
            core,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [5, 10],
            specifiedMargins: [21.5, 18.5],
            specifiedValigns: ["bottom", "middle"],
            sbsName: "sbs",
        });
    });

    it("sideBySide with no arguments, two panels, change widths first", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <sideBySide name="sbs">
    <lorem generateParagraphs="1" />
    <lorem generateParagraphs="1" />
    </sideBySide>

    <p>Widths: 
    <mathInput name="w1" bindValueTo="$(sbs.width1)" />
    <mathInput name="w2" bindValueTo="$(sbs.width2)" />
    </p>

    <p>Margins: 
    <mathInput name="m1" bindValueTo="$(sbs.margin1)" />
    <mathInput name="m2" bindValueTo="$(sbs.margin2)" />
    </p>

    <p>Valigns: 
    <textInput name="v1" bindValueTo="$(sbs.valign1)" />
    <textInput name="v2" bindValueTo="$(sbs.valign2)" />
    </p>
    `,
        });

        await checkTwoColumnSbs({ core, resolvePathToNodeIdx, sbsName: "sbs" });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs")].stateValues
                .absoluteMeasurements,
        ).eq(false);

        // change second width past 100%, unspecified first width shrinks to zero, rescales
        await updateMathInputValue({
            latex: "130",
            componentIdx: await resolvePathToNodeIdx("w2"),
            core,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [null, 130],
            sbsName: "sbs",
        });

        // change second width, unspecified first width adjusts
        await updateMathInputValue({
            latex: "10",
            componentIdx: await resolvePathToNodeIdx("w2"),
            core,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [null, 10],
            sbsName: "sbs",
        });

        // change first width, unspecified margins adjust
        await updateMathInputValue({
            latex: "30",
            componentIdx: await resolvePathToNodeIdx("w1"),
            core,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [30, 10],
            sbsName: "sbs",
        });

        // change right margin, unspecified left margin adjusts
        await updateMathInputValue({
            latex: "5",
            componentIdx: await resolvePathToNodeIdx("m2"),
            core,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [30, 10],
            specifiedMargins: [null, 5],
            sbsName: "sbs",
        });

        // increase second width so total is past 100%, rescaling
        await updateMathInputValue({
            latex: "85",
            componentIdx: await resolvePathToNodeIdx("w2"),
            core,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [30, 85],
            specifiedMargins: [null, 5],
            sbsName: "sbs",
        });

        // decrease second width
        await updateMathInputValue({
            latex: "20",
            componentIdx: await resolvePathToNodeIdx("w2"),
            core,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [30, 20],
            specifiedMargins: [null, 5],
            sbsName: "sbs",
        });

        // specify first margin to be smaller, remainder in gap
        await updateMathInputValue({
            latex: "10",
            componentIdx: await resolvePathToNodeIdx("m1"),
            core,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [30, 20],
            specifiedMargins: [10, 5],
            sbsName: "sbs",
        });
    });

    it("sideBySide with singular relative arguments, two panels", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <sideBySide name="sbs" width="20%" margins="10%" valign="middle">
    <lorem generateParagraphs="1" />
    <lorem generateParagraphs="1" />
    </sideBySide>

    <p>Widths: 
    <mathInput name="w1" bindValueTo="$(sbs.width1)" />
    <mathInput name="w2" bindValueTo="$(sbs.width2)" />
    </p>

    <p>Margins: 
    <mathInput name="m1" bindValueTo="$(sbs.margin1)" />
    <mathInput name="m2" bindValueTo="$(sbs.margin2)" />
    </p>

    <p>Valigns: 
    <textInput name="v1" bindValueTo="$(sbs.valign1)" />
    <textInput name="v2" bindValueTo="$(sbs.valign2)" />
    </p>
    `,
        });

        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [20, 20],
            specifiedMargins: [10, 10],
            specifiedValigns: ["middle", "middle"],
            sbsName: "sbs",
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs")].stateValues
                .absoluteMeasurements,
        ).eq(false);

        // change first width, second matches
        await updateMathInputValue({
            latex: "30",
            componentIdx: await resolvePathToNodeIdx("w1"),
            core,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [30, 30],
            specifiedMargins: [10, 10],
            specifiedValigns: ["middle", "middle"],
            sbsName: "sbs",
        });

        // change second width, first matches, rescaling
        await updateMathInputValue({
            latex: "80",
            componentIdx: await resolvePathToNodeIdx("w2"),
            core,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [80, 80],
            specifiedMargins: [10, 10],
            specifiedValigns: ["middle", "middle"],
            sbsName: "sbs",
        });

        // shrink width, rest in gap
        await updateMathInputValue({
            latex: "10",
            componentIdx: await resolvePathToNodeIdx("w1"),
            core,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [10, 10],
            specifiedMargins: [10, 10],
            specifiedValigns: ["middle", "middle"],
            sbsName: "sbs",
        });

        // increase left margin, right margin matches
        await updateMathInputValue({
            latex: "20",
            componentIdx: await resolvePathToNodeIdx("m1"),
            core,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [10, 10],
            specifiedMargins: [20, 20],
            specifiedValigns: ["middle", "middle"],
            sbsName: "sbs",
        });

        // increase right margin, left margin matches, rescaling
        await updateMathInputValue({
            latex: "45",
            componentIdx: await resolvePathToNodeIdx("m2"),
            core,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [10, 10],
            specifiedMargins: [45, 45],
            specifiedValigns: ["middle", "middle"],
            sbsName: "sbs",
        });

        // change first valign
        await updateTextInputValue({
            text: "top",
            componentIdx: await resolvePathToNodeIdx("v1"),
            core,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [10, 10],
            specifiedMargins: [45, 45],
            specifiedValigns: ["top", "top"],
            sbsName: "sbs",
        });

        // change second valign
        await updateTextInputValue({
            text: "bottom",
            componentIdx: await resolvePathToNodeIdx("v2"),
            core,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [10, 10],
            specifiedMargins: [45, 45],
            specifiedValigns: ["bottom", "bottom"],
            sbsName: "sbs",
        });

        // invalid valign ignored
        await updateTextInputValue({
            text: "invalid",
            componentIdx: await resolvePathToNodeIdx("v1"),
            core,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [10, 10],
            specifiedMargins: [45, 45],
            specifiedValigns: ["bottom", "bottom"],
            sbsName: "sbs",
        });
    });

    it("sideBySide with plural relative arguments, two panels", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <sideBySide name="sbs" widths="20% 10%" margins="10% 20%" valigns="middle bottom">
    <lorem generateParagraphs="1" />
    <lorem generateParagraphs="1" />
    </sideBySide>

    <p>Widths: 
    <mathInput name="w1" bindValueTo="$(sbs.width1)" />
    <mathInput name="w2" bindValueTo="$(sbs.width2)" />
    </p>

    <p>Margins: 
    <mathInput name="m1" bindValueTo="$(sbs.margin1)" />
    <mathInput name="m2" bindValueTo="$(sbs.margin2)" />
    </p>

    <p>Valigns: 
    <textInput name="v1" bindValueTo="$(sbs.valign1)" />
    <textInput name="v2" bindValueTo="$(sbs.valign2)" />
    </p>
    `,
        });

        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [20, 10],
            specifiedMargins: [10, 20],
            specifiedValigns: ["middle", "bottom"],
            sbsName: "sbs",
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs")].stateValues
                .absoluteMeasurements,
        ).eq(false);

        // change first width
        await updateMathInputValue({
            latex: "30",
            componentIdx: await resolvePathToNodeIdx("w1"),
            core,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [30, 10],
            specifiedMargins: [10, 20],
            specifiedValigns: ["middle", "bottom"],
            sbsName: "sbs",
        });

        // change second width, rescaling
        await updateMathInputValue({
            latex: "110",
            componentIdx: await resolvePathToNodeIdx("w2"),
            core,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [30, 110],
            specifiedMargins: [10, 20],
            specifiedValigns: ["middle", "bottom"],
            sbsName: "sbs",
        });

        // shrink second width
        await updateMathInputValue({
            latex: "5",
            componentIdx: await resolvePathToNodeIdx("w2"),
            core,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [30, 5],
            specifiedMargins: [10, 20],
            specifiedValigns: ["middle", "bottom"],
            sbsName: "sbs",
        });

        // decrease right margin
        await updateMathInputValue({
            latex: "5",
            componentIdx: await resolvePathToNodeIdx("m2"),
            core,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [30, 5],
            specifiedMargins: [10, 5],
            specifiedValigns: ["middle", "bottom"],
            sbsName: "sbs",
        });

        // increase left margin, rescaling
        await updateMathInputValue({
            latex: "77.5",
            componentIdx: await resolvePathToNodeIdx("m1"),
            core,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [30, 5],
            specifiedMargins: [77.5, 5],
            specifiedValigns: ["middle", "bottom"],
            sbsName: "sbs",
        });

        // change first valign
        await updateTextInputValue({
            text: "top",
            componentIdx: await resolvePathToNodeIdx("v1"),
            core,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [30, 5],
            specifiedMargins: [77.5, 5],
            specifiedValigns: ["top", "bottom"],
            sbsName: "sbs",
        });

        // change second valign
        await updateTextInputValue({
            text: "middle",
            componentIdx: await resolvePathToNodeIdx("v2"),
            core,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [30, 5],
            specifiedMargins: [77.5, 5],
            specifiedValigns: ["top", "middle"],
            sbsName: "sbs",
        });

        // invalid valign ignored
        await updateTextInputValue({
            text: "invalid",
            componentIdx: await resolvePathToNodeIdx("v2"),
            core,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [30, 5],
            specifiedMargins: [77.5, 5],
            specifiedValigns: ["top", "middle"],
            sbsName: "sbs",
        });
    });

    it("sideBySide with half-specified plural relative arguments and auto margins", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <sideBySide name="sbs" widths="20%" margins="auto" valigns="middle">
    <lorem generateParagraphs="1" />
    <lorem generateParagraphs="1" />
    </sideBySide>

    <p>Widths: 
    <mathInput name="w1" bindValueTo="$(sbs.width1)" />
    <mathInput name="w2" bindValueTo="$(sbs.width2)" />
    </p>

    <p>Margins: 
    <mathInput name="m1" bindValueTo="$(sbs.margin1)" />
    <mathInput name="m2" bindValueTo="$(sbs.margin2)" />
    </p>

    <p>Valigns: 
    <textInput name="v1" bindValueTo="$(sbs.valign1)" />
    <textInput name="v2" bindValueTo="$(sbs.valign2)" />
    </p>
    `,
        });

        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [20, null],
            specifiedMargins: [null, null],
            specifiedValigns: ["middle", null],
            sbsName: "sbs",
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs")].stateValues
                .absoluteMeasurements,
        ).eq(false);

        // change first width, unspecified second width adjusts
        await updateMathInputValue({
            latex: "30",
            componentIdx: await resolvePathToNodeIdx("w1"),
            core,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [30, null],
            specifiedMargins: [null, null],
            specifiedValigns: ["middle", null],
            sbsName: "sbs",
        });

        // change right margin, left is symmetric, unspecified second width adjusts
        await updateMathInputValue({
            latex: "10",
            componentIdx: await resolvePathToNodeIdx("m2"),
            core,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [30, null],
            specifiedMargins: [10, 10],
            specifiedValigns: ["middle", null],
            sbsName: "sbs",
        });

        // change second width, rest in gap
        await updateMathInputValue({
            latex: "20",
            componentIdx: await resolvePathToNodeIdx("w2"),
            core,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [30, 20],
            specifiedMargins: [10, 10],
            specifiedValigns: ["middle", null],
            sbsName: "sbs",
        });

        // change first width, rescaling
        await updateMathInputValue({
            latex: "140",
            componentIdx: await resolvePathToNodeIdx("w1"),
            core,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [140, 20],
            specifiedMargins: [10, 10],
            specifiedValigns: ["middle", null],
            sbsName: "sbs",
        });

        // shrink first width
        await updateMathInputValue({
            latex: "10",
            componentIdx: await resolvePathToNodeIdx("w1"),
            core,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [10, 20],
            specifiedMargins: [10, 10],
            specifiedValigns: ["middle", null],
            sbsName: "sbs",
        });

        // decrease right margin, left matches
        await updateMathInputValue({
            latex: "5",
            componentIdx: await resolvePathToNodeIdx("m2"),
            core,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [10, 20],
            specifiedMargins: [5, 5],
            specifiedValigns: ["middle", null],
            sbsName: "sbs",
        });

        // increase left margin, right matches, rescaling
        await updateMathInputValue({
            latex: "42.5",
            componentIdx: await resolvePathToNodeIdx("m1"),
            core,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [10, 20],
            specifiedMargins: [42.5, 42.5],
            specifiedValigns: ["middle", null],
            sbsName: "sbs",
        });

        // change first valign
        await updateTextInputValue({
            text: "top",
            componentIdx: await resolvePathToNodeIdx("v1"),
            core,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [10, 20],
            specifiedMargins: [42.5, 42.5],
            specifiedValigns: ["top", null],
            sbsName: "sbs",
        });

        // change second valign
        await updateTextInputValue({
            text: "bottom",
            componentIdx: await resolvePathToNodeIdx("v2"),
            core,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [10, 20],
            specifiedMargins: [42.5, 42.5],
            specifiedValigns: ["top", "bottom"],
            sbsName: "sbs",
        });

        // invalid valign ignored
        await updateTextInputValue({
            text: "invalid",
            componentIdx: await resolvePathToNodeIdx("v2"),
            core,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [10, 20],
            specifiedMargins: [42.5, 42.5],
            specifiedValigns: ["top", "bottom"],
            sbsName: "sbs",
        });
    });

    it("sideBySide with no arguments, four panels", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <sideBySide name="sbs">
    <lorem generateParagraphs="1" />
    <lorem generateParagraphs="1" />
    <lorem generateParagraphs="1" />
    <lorem generateParagraphs="1" />
    </sideBySide>

    <p>Widths: 
    <mathInput name="w1" bindValueTo="$(sbs.width1)" />
    <mathInput name="w2" bindValueTo="$(sbs.width2)" />
    <mathInput name="w3" bindValueTo="$(sbs.width3)" />
    <mathInput name="w4" bindValueTo="$(sbs.width4)" />
    </p>

    <p>Margins: 
    <mathInput name="m1" bindValueTo="$(sbs.margin1)" />
    <mathInput name="m2" bindValueTo="$(sbs.margin2)" />
    </p>

    <p>Valigns: 
    <textInput name="v1" bindValueTo="$(sbs.valign1)" />
    <textInput name="v2" bindValueTo="$(sbs.valign2)" />
    <textInput name="v3" bindValueTo="$(sbs.valign3)" />
    <textInput name="v4" bindValueTo="$(sbs.valign4)" />
    </p>
    `,
        });

        await checkFourColumnSbs({
            core,
            resolvePathToNodeIdx,
            sbsName: "sbs",
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs")].stateValues
                .absoluteMeasurements,
        ).eq(false);

        // change left margin first, unspecified widths adjust
        await updateMathInputValue({
            latex: "2",
            componentIdx: await resolvePathToNodeIdx("m1"),
            core,
        });
        await checkFourColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedMargins: [2, null],
            sbsName: "sbs",
        });

        // change right margin, unspecified widths adjust
        await updateMathInputValue({
            latex: "3",
            componentIdx: await resolvePathToNodeIdx("m2"),
            core,
        });
        await checkFourColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedMargins: [2, 3],
            sbsName: "sbs",
        });

        // change 3rd width to be smaller, add extra to other widths
        await updateMathInputValue({
            latex: "14",
            componentIdx: await resolvePathToNodeIdx("w3"),
            core,
        });
        await checkFourColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [null, null, 14, null],
            specifiedMargins: [2, 3],
            sbsName: "sbs",
        });

        // change 3rd width to be larger, others widths shrinks to zero, rescale to 100%
        await updateMathInputValue({
            latex: "180",
            componentIdx: await resolvePathToNodeIdx("w3"),
            core,
        });
        await checkFourColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [null, null, 180, null],
            specifiedMargins: [2, 3],
            sbsName: "sbs",
        });

        // change 3rd width to be smaller again
        await updateMathInputValue({
            latex: "11",
            componentIdx: await resolvePathToNodeIdx("w3"),
            core,
        });
        await checkFourColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [null, null, 11, null],
            specifiedMargins: [2, 3],
            sbsName: "sbs",
        });

        // change 2nd width to be smaller
        await updateMathInputValue({
            latex: "15",
            componentIdx: await resolvePathToNodeIdx("w2"),
            core,
        });
        await checkFourColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [null, 15, 11, null],
            specifiedMargins: [2, 3],
            sbsName: "sbs",
        });

        // change 1st width to be smaller
        await updateMathInputValue({
            latex: "20",
            componentIdx: await resolvePathToNodeIdx("w1"),
            core,
        });
        await checkFourColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [20, 15, 11, null],
            specifiedMargins: [2, 3],
            sbsName: "sbs",
        });

        // change 4th width to be smaller, remainder added to gap
        await updateMathInputValue({
            latex: "19",
            componentIdx: await resolvePathToNodeIdx("w4"),
            core,
        });
        await checkFourColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [20, 15, 11, 19],
            specifiedMargins: [2, 3],
            sbsName: "sbs",
        });

        // change 2nd width to be larger, rescaled to 100%
        await updateMathInputValue({
            latex: "55",
            componentIdx: await resolvePathToNodeIdx("w2"),
            core,
        });
        await checkFourColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [20, 55, 11, 19],
            specifiedMargins: [2, 3],
            sbsName: "sbs",
        });

        // shrink width 2 to make specified values add back to 100%
        await updateMathInputValue({
            latex: "30",
            componentIdx: await resolvePathToNodeIdx("w2"),
            core,
        });
        await checkFourColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [20, 30, 11, 19],
            specifiedMargins: [2, 3],
            sbsName: "sbs",
        });

        // shrink right margin, extra added to gap
        await updateMathInputValue({
            latex: "1",
            componentIdx: await resolvePathToNodeIdx("m2"),
            core,
        });
        await checkFourColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [20, 30, 11, 19],
            specifiedMargins: [2, 1],
            sbsName: "sbs",
        });

        // change fourth valign
        await updateTextInputValue({
            text: "bottom",
            componentIdx: await resolvePathToNodeIdx("v4"),
            core,
        });
        await checkFourColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [20, 30, 11, 19],
            specifiedMargins: [2, 1],
            specifiedValigns: [null, null, null, "bottom"],
            sbsName: "sbs",
        });

        // change second valign
        await updateTextInputValue({
            text: "middle",
            componentIdx: await resolvePathToNodeIdx("v2"),
            core,
        });
        await checkFourColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [20, 30, 11, 19],
            specifiedMargins: [2, 1],
            specifiedValigns: [null, "middle", null, "bottom"],
            sbsName: "sbs",
        });

        // change first valign
        await updateTextInputValue({
            text: "middle",
            componentIdx: await resolvePathToNodeIdx("v1"),
            core,
        });
        await checkFourColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [20, 30, 11, 19],
            specifiedMargins: [2, 1],
            specifiedValigns: ["middle", "middle", null, "bottom"],
            sbsName: "sbs",
        });

        // change third valign
        await updateTextInputValue({
            text: "bottom",
            componentIdx: await resolvePathToNodeIdx("v3"),
            core,
        });
        await checkFourColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [20, 30, 11, 19],
            specifiedMargins: [2, 1],
            specifiedValigns: ["middle", "middle", "bottom", "bottom"],
            sbsName: "sbs",
        });

        // invalid valign ignored
        await updateTextInputValue({
            text: "invalid",
            componentIdx: await resolvePathToNodeIdx("v3"),
            core,
        });
        await checkFourColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [20, 30, 11, 19],
            specifiedMargins: [2, 1],
            specifiedValigns: ["middle", "middle", "bottom", "bottom"],
            sbsName: "sbs",
        });
    });

    it("sideBySide with singular relative arguments, four panels", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <sideBySide name="sbs" width="15%" margins="5%" valign="middle">
    <lorem generateParagraphs="1" />
    <lorem generateParagraphs="1" />
    <lorem generateParagraphs="1" />
    <lorem generateParagraphs="1" />
    </sideBySide>

    <p>Widths: 
    <mathInput name="w1" bindValueTo="$(sbs.width1)" />
    <mathInput name="w2" bindValueTo="$(sbs.width2)" />
    <mathInput name="w3" bindValueTo="$(sbs.width3)" />
    <mathInput name="w4" bindValueTo="$(sbs.width4)" />
    </p>

    <p>Margins: 
    <mathInput name="m1" bindValueTo="$(sbs.margin1)" />
    <mathInput name="m2" bindValueTo="$(sbs.margin2)" />
    </p>

    <p>Valigns: 
    <textInput name="v1" bindValueTo="$(sbs.valign1)" />
    <textInput name="v2" bindValueTo="$(sbs.valign2)" />
    <textInput name="v3" bindValueTo="$(sbs.valign3)" />
    <textInput name="v4" bindValueTo="$(sbs.valign4)" />
    </p>
    `,
        });

        await checkFourColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [15, 15, 15, 15],
            specifiedMargins: [5, 5],
            specifiedValigns: ["middle", "middle", "middle", "middle"],
            sbsName: "sbs",
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs")].stateValues
                .absoluteMeasurements,
        ).eq(false);

        // change 4th width, rest match, remainder added to gap
        await updateMathInputValue({
            latex: "10",
            componentIdx: await resolvePathToNodeIdx("w4"),
            core,
        });
        await checkFourColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [10, 10, 10, 10],
            specifiedMargins: [5, 5],
            specifiedValigns: ["middle", "middle", "middle", "middle"],
            sbsName: "sbs",
        });

        // change right margin, rescaled
        await updateMathInputValue({
            latex: "20",
            componentIdx: await resolvePathToNodeIdx("m2"),
            core,
        });
        await checkFourColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [10, 10, 10, 10],
            specifiedMargins: [20, 20],
            specifiedValigns: ["middle", "middle", "middle", "middle"],
            sbsName: "sbs",
        });

        // shrink left margin
        await updateMathInputValue({
            latex: "2",
            componentIdx: await resolvePathToNodeIdx("m1"),
            core,
        });
        await checkFourColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [10, 10, 10, 10],
            specifiedMargins: [2, 2],
            specifiedValigns: ["middle", "middle", "middle", "middle"],
            sbsName: "sbs",
        });

        // change fourth valign
        await updateTextInputValue({
            text: "bottom",
            componentIdx: await resolvePathToNodeIdx("v4"),
            core,
        });
        await checkFourColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [10, 10, 10, 10],
            specifiedMargins: [2, 2],
            specifiedValigns: ["bottom", "bottom", "bottom", "bottom"],
            sbsName: "sbs",
        });
    });

    it("sideBySide with plural relative arguments, four panels", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <sideBySide name="sbs" widths="5% 10% 15% 20%" margins="5% 2%" valigns="middle">
    <lorem generateParagraphs="1" />
    <lorem generateParagraphs="1" />
    <lorem generateParagraphs="1" />
    <lorem generateParagraphs="1" />
    </sideBySide>

    <p>Widths: 
    <mathInput name="w1" bindValueTo="$(sbs.width1)" />
    <mathInput name="w2" bindValueTo="$(sbs.width2)" />
    <mathInput name="w3" bindValueTo="$(sbs.width3)" />
    <mathInput name="w4" bindValueTo="$(sbs.width4)" />
    </p>

    <p>Margins: 
    <mathInput name="m1" bindValueTo="$(sbs.margin1)" />
    <mathInput name="m2" bindValueTo="$(sbs.margin2)" />
    </p>

    <p>Valigns: 
    <textInput name="v1" bindValueTo="$(sbs.valign1)" />
    <textInput name="v2" bindValueTo="$(sbs.valign2)" />
    <textInput name="v3" bindValueTo="$(sbs.valign3)" />
    <textInput name="v4" bindValueTo="$(sbs.valign4)" />
    </p>
    `,
        });

        await checkFourColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [5, 10, 15, 20],
            specifiedMargins: [5, 2],
            specifiedValigns: ["middle", null, null, null],
            sbsName: "sbs",
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs")].stateValues
                .absoluteMeasurements,
        ).eq(false);

        // change 4th width, remainder added to gap
        await updateMathInputValue({
            latex: "9",
            componentIdx: await resolvePathToNodeIdx("w4"),
            core,
        });
        await checkFourColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [5, 10, 15, 9],
            specifiedMargins: [5, 2],
            specifiedValigns: ["middle", null, null, null],
            sbsName: "sbs",
        });

        // change 1st width, rescaled
        await updateMathInputValue({
            latex: "63",
            componentIdx: await resolvePathToNodeIdx("w1"),
            core,
        });
        await checkFourColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [63, 10, 15, 9],
            specifiedMargins: [5, 2],
            specifiedValigns: ["middle", null, null, null],
            sbsName: "sbs",
        });

        // change more widths, remainder added to gap
        await updateMathInputValue({
            latex: "3",
            componentIdx: await resolvePathToNodeIdx("w1"),
            core,
        });
        await updateMathInputValue({
            latex: "8",
            componentIdx: await resolvePathToNodeIdx("w2"),
            core,
        });
        await updateMathInputValue({
            latex: "13",
            componentIdx: await resolvePathToNodeIdx("w3"),
            core,
        });
        await checkFourColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [3, 8, 13, 9],
            specifiedMargins: [5, 2],
            specifiedValigns: ["middle", null, null, null],
            sbsName: "sbs",
        });

        // change margins
        await updateMathInputValue({
            latex: "7",
            componentIdx: await resolvePathToNodeIdx("m1"),
            core,
        });
        await updateMathInputValue({
            latex: "6",
            componentIdx: await resolvePathToNodeIdx("m2"),
            core,
        });
        await checkFourColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [3, 8, 13, 9],
            specifiedMargins: [7, 6],
            specifiedValigns: ["middle", null, null, null],
            sbsName: "sbs",
        });

        // change valigns
        await updateTextInputValue({
            text: "top",
            componentIdx: await resolvePathToNodeIdx("v1"),
            core,
        });
        await updateTextInputValue({
            text: "middle",
            componentIdx: await resolvePathToNodeIdx("v2"),
            core,
        });
        await updateTextInputValue({
            text: "bottom",
            componentIdx: await resolvePathToNodeIdx("v3"),
            core,
        });
        await updateTextInputValue({
            text: "middle",
            componentIdx: await resolvePathToNodeIdx("v4"),
            core,
        });
        await checkFourColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [3, 8, 13, 9],
            specifiedMargins: [7, 6],
            specifiedValigns: ["top", "middle", "bottom", "middle"],
            sbsName: "sbs",
        });
    });

    it("copy sideBySide and overwrite parameters", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <sideBySide name="sbs" widths="5% 10% 15% 20%" margins="5% 2%" valigns="middle">
      <lorem generateParagraphs="4" />
    </sideBySide>

    <sideBySide extend="$sbs" widths="30% 10%" margins="1% 3%" valigns="bottom middle top bottom" name="sbs2" />

    <sideBySide extend="$sbs2" widths="7% 8% 11% 12%" valigns="top bottom" name="sbs3" />

    `,
        });

        await checkFourColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [5, 10, 15, 20],
            specifiedMargins: [5, 2],
            specifiedValigns: ["middle", null, null, null],
            sbsName: "sbs",
        });

        await checkFourColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [30, 10, null, null],
            specifiedMargins: [1, 3],
            specifiedValigns: ["bottom", "middle", "top", "bottom"],
            sbsName: "sbs2",
        });

        await checkFourColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [7, 8, 11, 12],
            specifiedMargins: [1, 3],
            specifiedValigns: ["top", "bottom", null, null],
            sbsName: "sbs3",
        });
    });

    it("sideBySide absolute measurements turned to absolute with warning", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <sideBySide width="100px" margins="1px">
      <p>Hello</p>
      <p>Hello</p>
    </sideBySide>

    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("_sideBySide1")]
                .stateValues.marginsAbsolute,
        ).eq(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("_sideBySide1")]
                .stateValues.widthsAbsolute,
        ).eq(false);

        let errorWarnings = core.core!.errorWarnings;

        expect(errorWarnings.errors.length).eq(0);
        expect(errorWarnings.warnings.length).eq(2);

        expect(errorWarnings.warnings[0].message).contain(
            `<sideBySide> is not implemented for absolute measurements. Setting widths to relative`,
        );
        expect(errorWarnings.warnings[0].position.start.line).eq(2);
        expect(errorWarnings.warnings[0].position.start.column).eq(5);
        expect(errorWarnings.warnings[0].position.end.line).eq(5);
        expect(errorWarnings.warnings[0].position.end.column).eq(18);

        expect(errorWarnings.warnings[1].message).contain(
            `<sideBySide> is not implemented for absolute measurements. Setting margins to relative`,
        );
        expect(errorWarnings.warnings[1].position.start.line).eq(2);
        expect(errorWarnings.warnings[1].position.start.column).eq(5);
        expect(errorWarnings.warnings[1].position.end.line).eq(5);
        expect(errorWarnings.warnings[1].position.end.column).eq(18);
    });

    it("sbsGroup with no arguments, one panel", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <sbsGroup name="sbsg">
      <sideBySide name="sbs1">
        <lorem generateParagraphs="1" />
      </sideBySide>
      <sideBySide name="sbs2">
        <lorem generateParagraphs="1" />
      </sideBySide>
    </sbsGroup>
    
    <p>Width for sbsg: 
    <mathInput name="w1g" bindValueTo="$(sbsg.width1)" />
    </p>
    
    <p>Margins for sbsg: 
    <mathInput name="m1g" bindValueTo="$(sbsg.margin1)" />
    <mathInput name="m2g" bindValueTo="$(sbsg.margin2)" />
    </p>
    
    <p>Valign for sbsg: 
    <textInput name="v1g" bindValueTo="$(sbsg.valign1)" />
    </p>
    
    <p>Width for sbs1: 
    <mathInput name="w11" bindValueTo="$(sbs1.width1)" />
    </p>
    
    <p>Margins for sbs1: 
    <mathInput name="m11" bindValueTo="$(sbs1.margin1)" />
    <mathInput name="m21" bindValueTo="$(sbs1.margin2)" />
    </p>
    
    <p>Valign for sbs1: 
    <textInput name="v11" bindValueTo="$(sbs1.valign1)" />
    </p>
    
    <p>Width for sbs2: 
    <mathInput name="w12" bindValueTo="$(sbs2.width1)" />
    </p>
    
    <p>Margins for sbs2: 
    <mathInput name="m12" bindValueTo="$(sbs2.margin1)" />
    <mathInput name="m22" bindValueTo="$(sbs2.margin2)" />
    </p>
    
    <p>Valign for sbs2: 
    <textInput name="v12" bindValueTo="$(sbs2.valign1)" />
    </p>
    `,
        });

        await checkSingleColumnSbs({
            core,
            resolvePathToNodeIdx,
            sbsName: "sbsg",
            isSbsGroup: true,
        });
        await checkSingleColumnSbs({
            core,
            resolvePathToNodeIdx,
            sbsName: "sbs1",
        });
        await checkSingleColumnSbs({
            core,
            resolvePathToNodeIdx,
            sbsName: "sbs2",
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbsg")].stateValues
                .absoluteMeasurements,
        ).eq(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs1")].stateValues
                .absoluteMeasurements,
        ).eq(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs1")].stateValues
                .essentialWidths,
        ).eqls([null]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs1")].stateValues
                .essentialMargins,
        ).eqls([null, null]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs2")].stateValues
                .absoluteMeasurements,
        ).eq(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs2")].stateValues
                .essentialWidths,
        ).eqls([null]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs2")].stateValues
                .essentialMargins,
        ).eqls([null, null]);

        // change left margin of sbs1, unspecified width of sbs1 adjusts
        await updateMathInputValue({
            latex: "10",
            componentIdx: await resolvePathToNodeIdx("m11"),
            core,
        });
        await checkSingleColumnSbs({
            core,
            resolvePathToNodeIdx,
            sbsName: "sbsg",
            isSbsGroup: true,
        });
        await checkSingleColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedMargins: [10, null],
            sbsName: "sbs1",
        });
        await checkSingleColumnSbs({
            core,
            resolvePathToNodeIdx,
            sbsName: "sbs2",
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs1")].stateValues
                .essentialWidths,
        ).eqls([null]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs1")].stateValues
                .essentialMargins,
        ).eqls([10, null]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs2")].stateValues
                .essentialWidths,
        ).eqls([null]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs2")].stateValues
                .essentialMargins,
        ).eqls([null, null]);

        // change width of sbsg, unspecified margin(s) adjust
        await updateMathInputValue({
            latex: "70",
            componentIdx: await resolvePathToNodeIdx("w1g"),
            core,
        });
        await checkSingleColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidth: 70,
            sbsName: "sbsg",
            isSbsGroup: true,
        });
        await checkSingleColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidth: 70,
            specifiedMargins: [10, null],
            sbsName: "sbs1",
        });
        await checkSingleColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidth: 70,
            sbsName: "sbs2",
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs1")].stateValues
                .essentialWidths,
        ).eqls([null]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs1")].stateValues
                .essentialMargins,
        ).eqls([10, null]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs2")].stateValues
                .essentialWidths,
        ).eqls([null]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs2")].stateValues
                .essentialMargins,
        ).eqls([null, null]);

        // change right margin of sbs2, unspecified margin adjusts
        await updateMathInputValue({
            latex: "25",
            componentIdx: await resolvePathToNodeIdx("m22"),
            core,
        });
        await checkSingleColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidth: 70,
            sbsName: "sbsg",
            isSbsGroup: true,
        });
        await checkSingleColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidth: 70,
            specifiedMargins: [10, null],
            sbsName: "sbs1",
        });
        await checkSingleColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidth: 70,
            specifiedMargins: [null, 25],
            sbsName: "sbs2",
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs1")].stateValues
                .essentialWidths,
        ).eqls([null]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs1")].stateValues
                .essentialMargins,
        ).eqls([10, null]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs2")].stateValues
                .essentialWidths,
        ).eqls([null]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs2")].stateValues
                .essentialMargins,
        ).eqls([null, 25]);

        // change left margin of sbsg, affects only sbs2
        await updateMathInputValue({
            latex: "4",
            componentIdx: await resolvePathToNodeIdx("m1g"),
            core,
        });
        await checkSingleColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidth: 70,
            specifiedMargins: [4, null],
            sbsName: "sbsg",
            isSbsGroup: true,
        });
        await checkSingleColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidth: 70,
            specifiedMargins: [10, null],
            sbsName: "sbs1",
        });
        await checkSingleColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidth: 70,
            specifiedMargins: [4, 25],
            sbsName: "sbs2",
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs1")].stateValues
                .essentialWidths,
        ).eqls([null]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs1")].stateValues
                .essentialMargins,
        ).eqls([10, null]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs2")].stateValues
                .essentialWidths,
        ).eqls([null]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs2")].stateValues
                .essentialMargins,
        ).eqls([null, 25]);

        // change sbsg width to be smaller, adds to unspecified or right margins
        await updateMathInputValue({
            latex: "60",
            componentIdx: await resolvePathToNodeIdx("w1g"),
            core,
        });
        await checkSingleColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidth: 60,
            specifiedMargins: [4, null],
            sbsName: "sbsg",
            isSbsGroup: true,
        });
        await checkSingleColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidth: 60,
            specifiedMargins: [10, null],
            sbsName: "sbs1",
        });
        await checkSingleColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidth: 60,
            specifiedMargins: [4, 25],
            sbsName: "sbs2",
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs1")].stateValues
                .essentialWidths,
        ).eqls([null]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs1")].stateValues
                .essentialMargins,
        ).eqls([10, null]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs2")].stateValues
                .essentialWidths,
        ).eqls([null]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs2")].stateValues
                .essentialMargins,
        ).eqls([null, 25]);

        // change sbs1 width to be smaller, adds to unspecified right margin
        await updateMathInputValue({
            latex: "50",
            componentIdx: await resolvePathToNodeIdx("w11"),
            core,
        });
        await checkSingleColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidth: 60,
            specifiedMargins: [4, null],
            sbsName: "sbsg",
            isSbsGroup: true,
        });
        await checkSingleColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidth: 50,
            specifiedMargins: [10, null],
            sbsName: "sbs1",
        });
        await checkSingleColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidth: 60,
            specifiedMargins: [4, 25],
            sbsName: "sbs2",
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs1")].stateValues
                .essentialWidths,
        ).eqls([50]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs1")].stateValues
                .essentialMargins,
        ).eqls([10, null]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs2")].stateValues
                .essentialWidths,
        ).eqls([null]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs2")].stateValues
                .essentialMargins,
        ).eqls([null, 25]);

        // increase sbsg left margin, cause rescaling just in sbs2
        await updateMathInputValue({
            latex: "20",
            componentIdx: await resolvePathToNodeIdx("m1g"),
            core,
        });
        await checkSingleColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidth: 60,
            specifiedMargins: [20, null],
            sbsName: "sbsg",
            isSbsGroup: true,
        });
        await checkSingleColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidth: 50,
            specifiedMargins: [10, null],
            sbsName: "sbs1",
        });
        await checkSingleColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidth: 60,
            specifiedMargins: [20, 25],
            sbsName: "sbs2",
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs1")].stateValues
                .essentialWidths,
        ).eqls([50]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs1")].stateValues
                .essentialMargins,
        ).eqls([10, null]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs2")].stateValues
                .essentialWidths,
        ).eqls([null]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs2")].stateValues
                .essentialMargins,
        ).eqls([null, 25]);

        // increase sbsg width, causing rescaling in sbsg and a second in sbs2
        await updateMathInputValue({
            latex: "90",
            componentIdx: await resolvePathToNodeIdx("w1g"),
            core,
        });
        await checkSingleColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidth: 90,
            specifiedMargins: [20, null],
            sbsName: "sbsg",
            isSbsGroup: true,
        });
        await checkSingleColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidth: 50,
            specifiedMargins: [10, null],
            sbsName: "sbs1",
        });
        await checkSingleColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidth: 90,
            specifiedMargins: [20, 25],
            sbsName: "sbs2",
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs1")].stateValues
                .essentialWidths,
        ).eqls([50]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs1")].stateValues
                .essentialMargins,
        ).eqls([10, null]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs2")].stateValues
                .essentialWidths,
        ).eqls([null]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs2")].stateValues
                .essentialMargins,
        ).eqls([null, 25]);

        // shrink sbsg width to remove rescaling
        await updateMathInputValue({
            latex: "40",
            componentIdx: await resolvePathToNodeIdx("w1g"),
            core,
        });
        await checkSingleColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidth: 40,
            specifiedMargins: [20, null],
            sbsName: "sbsg",
            isSbsGroup: true,
        });
        await checkSingleColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidth: 50,
            specifiedMargins: [10, null],
            sbsName: "sbs1",
        });
        await checkSingleColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidth: 40,
            specifiedMargins: [20, 25],
            sbsName: "sbs2",
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs1")].stateValues
                .essentialWidths,
        ).eqls([50]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs1")].stateValues
                .essentialMargins,
        ).eqls([10, null]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs2")].stateValues
                .essentialWidths,
        ).eqls([null]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs2")].stateValues
                .essentialMargins,
        ).eqls([null, 25]);

        // change valign of sbs1
        await updateTextInputValue({
            text: "bottom",
            componentIdx: await resolvePathToNodeIdx("v11"),
            core,
        });
        await checkSingleColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidth: 40,
            specifiedMargins: [20, null],
            sbsName: "sbsg",
            isSbsGroup: true,
        });
        await checkSingleColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidth: 50,
            specifiedMargins: [10, null],
            specifiedValign: "bottom",
            sbsName: "sbs1",
        });
        await checkSingleColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidth: 40,
            specifiedMargins: [20, 25],
            sbsName: "sbs2",
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs1")].stateValues
                .essentialWidths,
        ).eqls([50]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs1")].stateValues
                .essentialMargins,
        ).eqls([10, null]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs2")].stateValues
                .essentialWidths,
        ).eqls([null]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs2")].stateValues
                .essentialMargins,
        ).eqls([null, 25]);

        // change valign of sbsg
        await updateTextInputValue({
            text: "middle",
            componentIdx: await resolvePathToNodeIdx("v1g"),
            core,
        });
        await checkSingleColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidth: 40,
            specifiedMargins: [20, null],
            specifiedValign: "middle",
            sbsName: "sbsg",
            isSbsGroup: true,
        });
        await checkSingleColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidth: 50,
            specifiedMargins: [10, null],
            specifiedValign: "bottom",
            sbsName: "sbs1",
        });
        await checkSingleColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidth: 40,
            specifiedMargins: [20, 25],
            specifiedValign: "middle",
            sbsName: "sbs2",
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs1")].stateValues
                .essentialWidths,
        ).eqls([50]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs1")].stateValues
                .essentialMargins,
        ).eqls([10, null]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs2")].stateValues
                .essentialWidths,
        ).eqls([null]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs2")].stateValues
                .essentialMargins,
        ).eqls([null, 25]);

        // change valign of sbs2
        await updateTextInputValue({
            text: "top",
            componentIdx: await resolvePathToNodeIdx("v12"),
            core,
        });
        await checkSingleColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidth: 40,
            specifiedMargins: [20, null],
            specifiedValign: "middle",
            sbsName: "sbsg",
            isSbsGroup: true,
        });
        await checkSingleColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidth: 50,
            specifiedMargins: [10, null],
            specifiedValign: "bottom",
            sbsName: "sbs1",
        });
        await checkSingleColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidth: 40,
            specifiedMargins: [20, 25],
            specifiedValign: "top",
            sbsName: "sbs2",
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs1")].stateValues
                .essentialWidths,
        ).eqls([50]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs1")].stateValues
                .essentialMargins,
        ).eqls([10, null]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs2")].stateValues
                .essentialWidths,
        ).eqls([null]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs2")].stateValues
                .essentialMargins,
        ).eqls([null, 25]);

        // valign of sbsg ignores invalid
        await updateTextInputValue({
            text: "banana",
            componentIdx: await resolvePathToNodeIdx("v1g"),
            core,
        });
        await checkSingleColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidth: 40,
            specifiedMargins: [20, null],
            specifiedValign: "middle",
            sbsName: "sbsg",
            isSbsGroup: true,
        });
        await checkSingleColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidth: 50,
            specifiedMargins: [10, null],
            specifiedValign: "bottom",
            sbsName: "sbs1",
        });
        await checkSingleColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidth: 40,
            specifiedMargins: [20, 25],
            specifiedValign: "top",
            sbsName: "sbs2",
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs1")].stateValues
                .essentialWidths,
        ).eqls([50]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs1")].stateValues
                .essentialMargins,
        ).eqls([10, null]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs2")].stateValues
                .essentialWidths,
        ).eqls([null]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs2")].stateValues
                .essentialMargins,
        ).eqls([null, 25]);
    });

    it("sbsGroup with no arguments, two panels", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <sbsGroup name="sbsg">
      <sideBySide name="sbs1">
        <lorem generateParagraphs="1" />
        <lorem generateParagraphs="1" />
      </sideBySide>
      <sideBySide name="sbs2">
        <lorem generateParagraphs="1" />
        <lorem generateParagraphs="1" />
      </sideBySide>
    </sbsGroup>
    
    <p>Widths for sbsg: 
    <mathInput name="w1g" bindValueTo="$(sbsg.width1)" />
    <mathInput name="w2g" bindValueTo="$(sbsg.width2)" />
    </p>
    
    <p>Margins for sbsg: 
    <mathInput name="m1g" bindValueTo="$(sbsg.margin1)" />
    <mathInput name="m2g" bindValueTo="$(sbsg.margin2)" />
    </p>
    
    <p>Valigns for sbsg: 
    <textInput name="v1g" bindValueTo="$(sbsg.valign1)" />
    <textInput name="v2g" bindValueTo="$(sbsg.valign2)" />
    </p>
    
    <p>Widths for sbs1: 
    <mathInput name="w11" bindValueTo="$(sbs1.width1)" />
    <mathInput name="w21" bindValueTo="$(sbs1.width2)" />
    </p>
    
    <p>Margins for sbs1: 
    <mathInput name="m11" bindValueTo="$(sbs1.margin1)" />
    <mathInput name="m21" bindValueTo="$(sbs1.margin2)" />
    </p>
    
    <p>Valigns for sbs1: 
    <textInput name="v11" bindValueTo="$(sbs1.valign1)" />
    <textInput name="v21" bindValueTo="$(sbs1.valign2)" />
    </p>
    
    <p>Widths for sbs2: 
    <mathInput name="w12" bindValueTo="$(sbs2.width1)" />
    <mathInput name="w22" bindValueTo="$(sbs2.width2)" />
    </p>
    
    <p>Margins for sbs2: 
    <mathInput name="m12" bindValueTo="$(sbs2.margin1)" />
    <mathInput name="m22" bindValueTo="$(sbs2.margin2)" />
    </p>
    
    <p>Valigns for sbs2: 
    <textInput name="v12" bindValueTo="$(sbs2.valign1)" />
    <textInput name="v22" bindValueTo="$(sbs2.valign2)" />
    </p>
    `,
        });

        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            sbsName: "sbsg",
            isSbsGroup: true,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            sbsName: "sbs1",
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            sbsName: "sbs2",
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbsg")].stateValues
                .absoluteMeasurements,
        ).eq(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs1")].stateValues
                .absoluteMeasurements,
        ).eq(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs1")].stateValues
                .essentialWidths,
        ).eqls([null, null]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs1")].stateValues
                .essentialMargins,
        ).eqls([null, null]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs2")].stateValues
                .absoluteMeasurements,
        ).eq(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs2")].stateValues
                .essentialWidths,
        ).eqls([null, null]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs2")].stateValues
                .essentialMargins,
        ).eqls([null, null]);

        // change width1 of sbsg
        await updateMathInputValue({
            latex: "40",
            componentIdx: await resolvePathToNodeIdx("w1g"),
            core,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [40, null],
            sbsName: "sbsg",
            isSbsGroup: true,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [40, null],
            sbsName: "sbs1",
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [40, null],
            sbsName: "sbs2",
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs1")].stateValues
                .essentialWidths,
        ).eqls([null, null]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs1")].stateValues
                .essentialMargins,
        ).eqls([null, null]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs2")].stateValues
                .essentialWidths,
        ).eqls([null, null]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs2")].stateValues
                .essentialMargins,
        ).eqls([null, null]);

        // override width1 of sbs1
        await updateMathInputValue({
            latex: "30",
            componentIdx: await resolvePathToNodeIdx("w11"),
            core,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [40, null],
            sbsName: "sbsg",
            isSbsGroup: true,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [30, null],
            sbsName: "sbs1",
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [40, null],
            sbsName: "sbs2",
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs1")].stateValues
                .essentialWidths,
        ).eqls([30, null]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs1")].stateValues
                .essentialMargins,
        ).eqls([null, null]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs2")].stateValues
                .essentialWidths,
        ).eqls([null, null]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs2")].stateValues
                .essentialMargins,
        ).eqls([null, null]);

        // override width2 of sbs2
        await updateMathInputValue({
            latex: "50",
            componentIdx: await resolvePathToNodeIdx("w22"),
            core,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [40, null],
            sbsName: "sbsg",
            isSbsGroup: true,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [30, null],
            sbsName: "sbs1",
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [40, 50],
            sbsName: "sbs2",
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs1")].stateValues
                .essentialWidths,
        ).eqls([30, null]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs1")].stateValues
                .essentialMargins,
        ).eqls([null, null]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs2")].stateValues
                .essentialWidths,
        ).eqls([null, 50]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs2")].stateValues
                .essentialMargins,
        ).eqls([null, null]);

        // change left margin of sbs1
        await updateMathInputValue({
            latex: "5",
            componentIdx: await resolvePathToNodeIdx("m11"),
            core,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [40, null],
            sbsName: "sbsg",
            isSbsGroup: true,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [30, null],
            specifiedMargins: [5, null],
            sbsName: "sbs1",
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [40, 50],
            sbsName: "sbs2",
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs1")].stateValues
                .essentialWidths,
        ).eqls([30, null]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs1")].stateValues
                .essentialMargins,
        ).eqls([5, null]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs2")].stateValues
                .essentialWidths,
        ).eqls([null, 50]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs2")].stateValues
                .essentialMargins,
        ).eqls([null, null]);

        // change left margin of sbsg
        await updateMathInputValue({
            latex: "3",
            componentIdx: await resolvePathToNodeIdx("m1g"),
            core,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [40, null],
            specifiedMargins: [3, null],
            sbsName: "sbsg",
            isSbsGroup: true,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [30, null],
            specifiedMargins: [5, null],
            sbsName: "sbs1",
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [40, 50],
            specifiedMargins: [3, null],
            sbsName: "sbs2",
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs1")].stateValues
                .essentialWidths,
        ).eqls([30, null]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs1")].stateValues
                .essentialMargins,
        ).eqls([5, null]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs2")].stateValues
                .essentialWidths,
        ).eqls([null, 50]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs2")].stateValues
                .allMarginsSpecified,
        ).eqls([3, null]);

        // change right margin of sbsg
        await updateMathInputValue({
            latex: "1",
            componentIdx: await resolvePathToNodeIdx("m2g"),
            core,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [40, null],
            specifiedMargins: [3, 1],
            sbsName: "sbsg",
            isSbsGroup: true,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [30, null],
            specifiedMargins: [5, 1],
            sbsName: "sbs1",
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [40, 50],
            specifiedMargins: [3, 1],
            sbsName: "sbs2",
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs1")].stateValues
                .essentialWidths,
        ).eqls([30, null]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs1")].stateValues
                .essentialMargins,
        ).eqls([5, null]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs2")].stateValues
                .essentialWidths,
        ).eqls([null, 50]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs2")].stateValues
                .essentialMargins,
        ).eqls([null, null]);

        // change second width of sbsg
        await updateMathInputValue({
            latex: "45",
            componentIdx: await resolvePathToNodeIdx("w2g"),
            core,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [40, 45],
            specifiedMargins: [3, 1],
            sbsName: "sbsg",
            isSbsGroup: true,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [30, 45],
            specifiedMargins: [5, 1],
            sbsName: "sbs1",
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [40, 50],
            specifiedMargins: [3, 1],
            sbsName: "sbs2",
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs1")].stateValues
                .essentialWidths,
        ).eqls([30, null]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs1")].stateValues
                .essentialMargins,
        ).eqls([5, null]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs2")].stateValues
                .essentialWidths,
        ).eqls([null, 50]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs2")].stateValues
                .essentialMargins,
        ).eqls([null, null]);

        // increase second width of sbsg to cause rescaling
        await updateMathInputValue({
            latex: "65",
            componentIdx: await resolvePathToNodeIdx("w2g"),
            core,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [40, 65],
            specifiedMargins: [3, 1],
            sbsName: "sbsg",
            isSbsGroup: true,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [30, 65],
            specifiedMargins: [5, 1],
            sbsName: "sbs1",
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [40, 50],
            specifiedMargins: [3, 1],
            sbsName: "sbs2",
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs1")].stateValues
                .essentialWidths,
        ).eqls([30, null]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs1")].stateValues
                .essentialMargins,
        ).eqls([5, null]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs2")].stateValues
                .essentialWidths,
        ).eqls([null, 50]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs2")].stateValues
                .essentialMargins,
        ).eqls([null, null]);

        // decrease second width of sbs1 to drop below 100%
        await updateMathInputValue({
            latex: "55",
            componentIdx: await resolvePathToNodeIdx("w21"),
            core,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [40, 65],
            specifiedMargins: [3, 1],
            sbsName: "sbsg",
            isSbsGroup: true,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [30, 55],
            specifiedMargins: [5, 1],
            sbsName: "sbs1",
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [40, 50],
            specifiedMargins: [3, 1],
            sbsName: "sbs2",
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs1")].stateValues
                .essentialWidths,
        ).eqls([30, 55]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs1")].stateValues
                .essentialMargins,
        ).eqls([5, null]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs2")].stateValues
                .essentialWidths,
        ).eqls([null, 50]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs2")].stateValues
                .essentialMargins,
        ).eqls([null, null]);

        // decrease first width of sbsg to drop below 100%
        await updateMathInputValue({
            latex: "25",
            componentIdx: await resolvePathToNodeIdx("w1g"),
            core,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [25, 65],
            specifiedMargins: [3, 1],
            sbsName: "sbsg",
            isSbsGroup: true,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [30, 55],
            specifiedMargins: [5, 1],
            sbsName: "sbs1",
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [25, 50],
            specifiedMargins: [3, 1],
            sbsName: "sbs2",
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs1")].stateValues
                .essentialWidths,
        ).eqls([30, 55]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs1")].stateValues
                .essentialMargins,
        ).eqls([5, null]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs2")].stateValues
                .essentialWidths,
        ).eqls([null, 50]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs2")].stateValues
                .essentialMargins,
        ).eqls([null, null]);

        // change first valign of sbsg
        await updateTextInputValue({
            text: "bottom",
            componentIdx: await resolvePathToNodeIdx("v1g"),
            core,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [25, 65],
            specifiedMargins: [3, 1],
            specifiedValigns: ["bottom", null],
            sbsName: "sbsg",
            isSbsGroup: true,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [30, 55],
            specifiedMargins: [5, 1],
            specifiedValigns: ["bottom", null],
            sbsName: "sbs1",
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [25, 50],
            specifiedMargins: [3, 1],
            specifiedValigns: ["bottom", null],
            sbsName: "sbs2",
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs1")].stateValues
                .essentialWidths,
        ).eqls([30, 55]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs1")].stateValues
                .essentialMargins,
        ).eqls([5, null]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs2")].stateValues
                .essentialWidths,
        ).eqls([null, 50]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs2")].stateValues
                .essentialMargins,
        ).eqls([null, null]);

        // change first valign of sbs2
        await updateTextInputValue({
            text: "middle",
            componentIdx: await resolvePathToNodeIdx("v12"),
            core,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [25, 65],
            specifiedMargins: [3, 1],
            specifiedValigns: ["bottom", null],
            sbsName: "sbsg",
            isSbsGroup: true,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [30, 55],
            specifiedMargins: [5, 1],
            specifiedValigns: ["bottom", null],
            sbsName: "sbs1",
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [25, 50],
            specifiedMargins: [3, 1],
            specifiedValigns: ["middle", null],
            sbsName: "sbs2",
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs1")].stateValues
                .essentialWidths,
        ).eqls([30, 55]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs1")].stateValues
                .essentialMargins,
        ).eqls([5, null]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs2")].stateValues
                .essentialWidths,
        ).eqls([null, 50]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs2")].stateValues
                .essentialMargins,
        ).eqls([null, null]);

        // change second valign of sbs1
        await updateTextInputValue({
            text: "middle",
            componentIdx: await resolvePathToNodeIdx("v21"),
            core,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [25, 65],
            specifiedMargins: [3, 1],
            specifiedValigns: ["bottom", null],
            sbsName: "sbsg",
            isSbsGroup: true,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [30, 55],
            specifiedMargins: [5, 1],
            specifiedValigns: ["bottom", "middle"],
            sbsName: "sbs1",
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [25, 50],
            specifiedMargins: [3, 1],
            specifiedValigns: ["middle", null],
            sbsName: "sbs2",
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs1")].stateValues
                .essentialWidths,
        ).eqls([30, 55]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs1")].stateValues
                .essentialMargins,
        ).eqls([5, null]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs2")].stateValues
                .essentialWidths,
        ).eqls([null, 50]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs2")].stateValues
                .essentialMargins,
        ).eqls([null, null]);

        // change second valign of sbsg
        await updateTextInputValue({
            text: "bottom",
            componentIdx: await resolvePathToNodeIdx("v2g"),
            core,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [25, 65],
            specifiedMargins: [3, 1],
            specifiedValigns: ["bottom", "bottom"],
            sbsName: "sbsg",
            isSbsGroup: true,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [30, 55],
            specifiedMargins: [5, 1],
            specifiedValigns: ["bottom", "middle"],
            sbsName: "sbs1",
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [25, 50],
            specifiedMargins: [3, 1],
            specifiedValigns: ["middle", "bottom"],
            sbsName: "sbs2",
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs1")].stateValues
                .essentialWidths,
        ).eqls([30, 55]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs1")].stateValues
                .essentialMargins,
        ).eqls([5, null]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs2")].stateValues
                .essentialWidths,
        ).eqls([null, 50]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs2")].stateValues
                .essentialMargins,
        ).eqls([null, null]);
    });

    it("sbsGroup with singular arguments, sidebysides with plural or no arguments, two panels", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <sbsGroup name="sbsg" width="25%" margins="10%" valign="middle">
      <sideBySide name="sbs1" widths="40% 20%" valigns="top">
        <lorem generateParagraphs="1" />
        <lorem generateParagraphs="1" />
      </sideBySide>
      <sideBySide name="sbs2" margins="15% 5%" valigns="bottom top">
        <lorem generateParagraphs="1" />
        <lorem generateParagraphs="1" />
      </sideBySide>
    </sbsGroup>
    
    <p>Widths for sbsg: 
    <mathInput name="w1g" bindValueTo="$(sbsg.width1)" />
    <mathInput name="w2g" bindValueTo="$(sbsg.width2)" />
    </p>
    
    <p>Margins for sbsg: 
    <mathInput name="m1g" bindValueTo="$(sbsg.margin1)" />
    <mathInput name="m2g" bindValueTo="$(sbsg.margin2)" />
    </p>
    
    <p>Valigns for sbsg: 
    <textInput name="v1g" bindValueTo="$(sbsg.valign1)" />
    <textInput name="v2g" bindValueTo="$(sbsg.valign2)" />
    </p>
    
    <p>Widths for sbs1: 
    <mathInput name="w11" bindValueTo="$(sbs1.width1)" />
    <mathInput name="w21" bindValueTo="$(sbs1.width2)" />
    </p>
    
    <p>Margins for sbs1: 
    <mathInput name="m11" bindValueTo="$(sbs1.margin1)" />
    <mathInput name="m21" bindValueTo="$(sbs1.margin2)" />
    </p>
    
    <p>Valigns for sbs1: 
    <textInput name="v11" bindValueTo="$(sbs1.valign1)" />
    <textInput name="v21" bindValueTo="$(sbs1.valign2)" />
    </p>
    
    <p>Widths for sbs2: 
    <mathInput name="w12" bindValueTo="$(sbs2.width1)" />
    <mathInput name="w22" bindValueTo="$(sbs2.width2)" />
    </p>
    
    <p>Margins for sbs2: 
    <mathInput name="m12" bindValueTo="$(sbs2.margin1)" />
    <mathInput name="m22" bindValueTo="$(sbs2.margin2)" />
    </p>
    
    <p>Valigns for sbs2: 
    <textInput name="v12" bindValueTo="$(sbs2.valign1)" />
    <textInput name="v22" bindValueTo="$(sbs2.valign2)" />
    </p>
    `,
        });

        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [25, 25],
            specifiedMargins: [10, 10],
            specifiedValigns: ["middle", "middle"],
            sbsName: "sbsg",
            isSbsGroup: true,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [40, 20],
            specifiedMargins: [10, 10],
            specifiedValigns: ["top", "middle"],
            sbsName: "sbs1",
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [25, 25],
            specifiedMargins: [15, 5],
            specifiedValigns: ["bottom", "top"],
            sbsName: "sbs2",
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbsg")].stateValues
                .absoluteMeasurements,
        ).eq(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs1")].stateValues
                .absoluteMeasurements,
        ).eq(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs1")].stateValues
                .essentialWidths,
        ).eqls([null, null]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs1")].stateValues
                .essentialMargins,
        ).eqls([null, null]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs2")].stateValues
                .absoluteMeasurements,
        ).eq(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs2")].stateValues
                .essentialWidths,
        ).eqls([null, null]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs2")].stateValues
                .essentialMargins,
        ).eqls([null, null]);

        // change width1 of sbsg
        await updateMathInputValue({
            latex: "20",
            componentIdx: await resolvePathToNodeIdx("w1g"),
            core,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [20, 20],
            specifiedMargins: [10, 10],
            specifiedValigns: ["middle", "middle"],
            sbsName: "sbsg",
            isSbsGroup: true,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [40, 20],
            specifiedMargins: [10, 10],
            specifiedValigns: ["top", "middle"],
            sbsName: "sbs1",
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [20, 20],
            specifiedMargins: [15, 5],
            specifiedValigns: ["bottom", "top"],
            sbsName: "sbs2",
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs1")].stateValues
                .essentialWidths,
        ).eqls([null, null]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs1")].stateValues
                .essentialMargins,
        ).eqls([null, null]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs2")].stateValues
                .essentialWidths,
        ).eqls([null, null]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs2")].stateValues
                .essentialMargins,
        ).eqls([null, null]);

        // change width2 of sbs2
        await updateMathInputValue({
            latex: "15",
            componentIdx: await resolvePathToNodeIdx("w22"),
            core,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [20, 20],
            specifiedMargins: [10, 10],
            specifiedValigns: ["middle", "middle"],
            sbsName: "sbsg",
            isSbsGroup: true,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [40, 20],
            specifiedMargins: [10, 10],
            specifiedValigns: ["top", "middle"],
            sbsName: "sbs1",
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [20, 15],
            specifiedMargins: [15, 5],
            specifiedValigns: ["bottom", "top"],
            sbsName: "sbs2",
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs1")].stateValues
                .essentialWidths,
        ).eqls([null, null]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs1")].stateValues
                .essentialMargins,
        ).eqls([null, null]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs2")].stateValues
                .essentialWidths,
        ).eqls([null, 15]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs2")].stateValues
                .essentialMargins,
        ).eqls([null, null]);

        // change width2 of sbsg
        await updateMathInputValue({
            latex: "12",
            componentIdx: await resolvePathToNodeIdx("w2g"),
            core,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [12, 12],
            specifiedMargins: [10, 10],
            specifiedValigns: ["middle", "middle"],
            sbsName: "sbsg",
            isSbsGroup: true,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [40, 20],
            specifiedMargins: [10, 10],
            specifiedValigns: ["top", "middle"],
            sbsName: "sbs1",
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [12, 15],
            specifiedMargins: [15, 5],
            specifiedValigns: ["bottom", "top"],
            sbsName: "sbs2",
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs1")].stateValues
                .essentialWidths,
        ).eqls([null, null]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs1")].stateValues
                .essentialMargins,
        ).eqls([null, null]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs2")].stateValues
                .essentialWidths,
        ).eqls([null, 15]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs2")].stateValues
                .essentialMargins,
        ).eqls([null, null]);

        // change width1 of sbs1
        await updateMathInputValue({
            latex: "35",
            componentIdx: await resolvePathToNodeIdx("w11"),
            core,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [12, 12],
            specifiedMargins: [10, 10],
            specifiedValigns: ["middle", "middle"],
            sbsName: "sbsg",
            isSbsGroup: true,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [35, 20],
            specifiedMargins: [10, 10],
            specifiedValigns: ["top", "middle"],
            sbsName: "sbs1",
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [12, 15],
            specifiedMargins: [15, 5],
            specifiedValigns: ["bottom", "top"],
            sbsName: "sbs2",
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs1")].stateValues
                .essentialWidths,
        ).eqls([null, null]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs1")].stateValues
                .essentialMargins,
        ).eqls([null, null]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs2")].stateValues
                .essentialWidths,
        ).eqls([null, 15]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs2")].stateValues
                .essentialMargins,
        ).eqls([null, null]);

        // change margins of sbs2
        await updateMathInputValue({
            latex: "22",
            componentIdx: await resolvePathToNodeIdx("m12"),
            core,
        });
        await updateMathInputValue({
            latex: "11",
            componentIdx: await resolvePathToNodeIdx("m22"),
            core,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [12, 12],
            specifiedMargins: [10, 10],
            specifiedValigns: ["middle", "middle"],
            sbsName: "sbsg",
            isSbsGroup: true,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [35, 20],
            specifiedMargins: [10, 10],
            specifiedValigns: ["top", "middle"],
            sbsName: "sbs1",
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [12, 15],
            specifiedMargins: [22, 11],
            specifiedValigns: ["bottom", "top"],
            sbsName: "sbs2",
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs1")].stateValues
                .essentialWidths,
        ).eqls([null, null]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs1")].stateValues
                .essentialMargins,
        ).eqls([null, null]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs2")].stateValues
                .essentialWidths,
        ).eqls([null, 15]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs2")].stateValues
                .essentialMargins,
        ).eqls([null, null]);

        // change right margin of sbsg
        await updateMathInputValue({
            latex: "8",
            componentIdx: await resolvePathToNodeIdx("m2g"),
            core,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [12, 12],
            specifiedMargins: [8, 8],
            specifiedValigns: ["middle", "middle"],
            sbsName: "sbsg",
            isSbsGroup: true,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [35, 20],
            specifiedMargins: [8, 8],
            specifiedValigns: ["top", "middle"],
            sbsName: "sbs1",
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [12, 15],
            specifiedMargins: [22, 11],
            specifiedValigns: ["bottom", "top"],
            sbsName: "sbs2",
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs1")].stateValues
                .essentialWidths,
        ).eqls([null, null]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs1")].stateValues
                .essentialMargins,
        ).eqls([null, null]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs2")].stateValues
                .essentialWidths,
        ).eqls([null, 15]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs2")].stateValues
                .essentialMargins,
        ).eqls([null, null]);

        // change right margin of sbs1
        await updateMathInputValue({
            latex: "7",
            componentIdx: await resolvePathToNodeIdx("m21"),
            core,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [12, 12],
            specifiedMargins: [8, 8],
            specifiedValigns: ["middle", "middle"],
            sbsName: "sbsg",
            isSbsGroup: true,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [35, 20],
            specifiedMargins: [8, 7],
            specifiedValigns: ["top", "middle"],
            sbsName: "sbs1",
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [12, 15],
            specifiedMargins: [22, 11],
            specifiedValigns: ["bottom", "top"],
            sbsName: "sbs2",
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs1")].stateValues
                .essentialWidths,
        ).eqls([null, null]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs1")].stateValues
                .essentialMargins,
        ).eqls([null, 7]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs2")].stateValues
                .essentialWidths,
        ).eqls([null, 15]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs2")].stateValues
                .essentialMargins,
        ).eqls([null, null]);

        // change left margin of sbsg
        await updateMathInputValue({
            latex: "9",
            componentIdx: await resolvePathToNodeIdx("m1g"),
            core,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [12, 12],
            specifiedMargins: [9, 9],
            specifiedValigns: ["middle", "middle"],
            sbsName: "sbsg",
            isSbsGroup: true,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [35, 20],
            specifiedMargins: [9, 7],
            specifiedValigns: ["top", "middle"],
            sbsName: "sbs1",
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [12, 15],
            specifiedMargins: [22, 11],
            specifiedValigns: ["bottom", "top"],
            sbsName: "sbs2",
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs1")].stateValues
                .essentialWidths,
        ).eqls([null, null]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs1")].stateValues
                .essentialMargins,
        ).eqls([null, 7]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs2")].stateValues
                .essentialWidths,
        ).eqls([null, 15]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs2")].stateValues
                .essentialMargins,
        ).eqls([null, null]);

        // change left margin of sbs1
        await updateMathInputValue({
            latex: "6",
            componentIdx: await resolvePathToNodeIdx("m11"),
            core,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [12, 12],
            specifiedMargins: [9, 9],
            specifiedValigns: ["middle", "middle"],
            sbsName: "sbsg",
            isSbsGroup: true,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [35, 20],
            specifiedMargins: [6, 7],
            specifiedValigns: ["top", "middle"],
            sbsName: "sbs1",
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [12, 15],
            specifiedMargins: [22, 11],
            specifiedValigns: ["bottom", "top"],
            sbsName: "sbs2",
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs1")].stateValues
                .essentialWidths,
        ).eqls([null, null]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs1")].stateValues
                .essentialMargins,
        ).eqls([6, 7]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs2")].stateValues
                .essentialWidths,
        ).eqls([null, 15]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs2")].stateValues
                .essentialMargins,
        ).eqls([null, null]);

        // change valign1 of sbsg
        await updateTextInputValue({
            text: "bottom",
            componentIdx: await resolvePathToNodeIdx("v1g"),
            core,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [12, 12],
            specifiedMargins: [9, 9],
            specifiedValigns: ["bottom", "bottom"],
            sbsName: "sbsg",
            isSbsGroup: true,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [35, 20],
            specifiedMargins: [6, 7],
            specifiedValigns: ["top", "bottom"],
            sbsName: "sbs1",
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [12, 15],
            specifiedMargins: [22, 11],
            specifiedValigns: ["bottom", "top"],
            sbsName: "sbs2",
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs1")].stateValues
                .essentialWidths,
        ).eqls([null, null]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs1")].stateValues
                .essentialMargins,
        ).eqls([6, 7]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs2")].stateValues
                .essentialWidths,
        ).eqls([null, 15]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs2")].stateValues
                .essentialMargins,
        ).eqls([null, null]);

        // change valign2 of sbs1
        await updateTextInputValue({
            text: "middle",
            componentIdx: await resolvePathToNodeIdx("v21"),
            core,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [12, 12],
            specifiedMargins: [9, 9],
            specifiedValigns: ["bottom", "bottom"],
            sbsName: "sbsg",
            isSbsGroup: true,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [35, 20],
            specifiedMargins: [6, 7],
            specifiedValigns: ["top", "middle"],
            sbsName: "sbs1",
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [12, 15],
            specifiedMargins: [22, 11],
            specifiedValigns: ["bottom", "top"],
            sbsName: "sbs2",
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs1")].stateValues
                .essentialWidths,
        ).eqls([null, null]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs1")].stateValues
                .essentialMargins,
        ).eqls([6, 7]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs2")].stateValues
                .essentialWidths,
        ).eqls([null, 15]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs2")].stateValues
                .essentialMargins,
        ).eqls([null, null]);

        // change valign2 of sbsg
        await updateTextInputValue({
            text: "top",
            componentIdx: await resolvePathToNodeIdx("v2g"),
            core,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [12, 12],
            specifiedMargins: [9, 9],
            specifiedValigns: ["top", "top"],
            sbsName: "sbsg",
            isSbsGroup: true,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [35, 20],
            specifiedMargins: [6, 7],
            specifiedValigns: ["top", "middle"],
            sbsName: "sbs1",
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [12, 15],
            specifiedMargins: [22, 11],
            specifiedValigns: ["bottom", "top"],
            sbsName: "sbs2",
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs1")].stateValues
                .essentialWidths,
        ).eqls([null, null]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs1")].stateValues
                .essentialMargins,
        ).eqls([6, 7]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs2")].stateValues
                .essentialWidths,
        ).eqls([null, 15]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs2")].stateValues
                .essentialMargins,
        ).eqls([null, null]);

        // change valign1 of sbs1
        await updateTextInputValue({
            text: "bottom",
            componentIdx: await resolvePathToNodeIdx("v11"),
            core,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [12, 12],
            specifiedMargins: [9, 9],
            specifiedValigns: ["top", "top"],
            sbsName: "sbsg",
            isSbsGroup: true,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [35, 20],
            specifiedMargins: [6, 7],
            specifiedValigns: ["bottom", "middle"],
            sbsName: "sbs1",
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [12, 15],
            specifiedMargins: [22, 11],
            specifiedValigns: ["bottom", "top"],
            sbsName: "sbs2",
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs1")].stateValues
                .essentialWidths,
        ).eqls([null, null]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs1")].stateValues
                .essentialMargins,
        ).eqls([6, 7]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs2")].stateValues
                .essentialWidths,
        ).eqls([null, 15]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs2")].stateValues
                .essentialMargins,
        ).eqls([null, null]);

        // change valigns of sbs2
        await updateTextInputValue({
            text: "middle",
            componentIdx: await resolvePathToNodeIdx("v12"),
            core,
        });
        await updateTextInputValue({
            text: "bottom",
            componentIdx: await resolvePathToNodeIdx("v22"),
            core,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [12, 12],
            specifiedMargins: [9, 9],
            specifiedValigns: ["top", "top"],
            sbsName: "sbsg",
            isSbsGroup: true,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [35, 20],
            specifiedMargins: [6, 7],
            specifiedValigns: ["bottom", "middle"],
            sbsName: "sbs1",
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [12, 15],
            specifiedMargins: [22, 11],
            specifiedValigns: ["middle", "bottom"],
            sbsName: "sbs2",
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs1")].stateValues
                .essentialWidths,
        ).eqls([null, null]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs1")].stateValues
                .essentialMargins,
        ).eqls([6, 7]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs2")].stateValues
                .essentialWidths,
        ).eqls([null, 15]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs2")].stateValues
                .essentialMargins,
        ).eqls([null, null]);
    });

    it("sbsGroup with plural arguments, sidebysides with singular or no arguments, two panels", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <sbsGroup name="sbsg" widths="25% 15%" margins="5% 10%" valigns="middle top">
      <sideBySide name="sbs1" width="20%" valign="top">
        <lorem generateParagraphs="1" />
        <lorem generateParagraphs="1" />
      </sideBySide>
      <sideBySide name="sbs2" margins="8%">
        <lorem generateParagraphs="1" />
        <lorem generateParagraphs="1" />
      </sideBySide>
    </sbsGroup>
    
    <p>Widths for sbsg: 
    <mathInput name="w1g" bindValueTo="$(sbsg.width1)" />
    <mathInput name="w2g" bindValueTo="$(sbsg.width2)" />
    </p>
    
    <p>Margins for sbsg: 
    <mathInput name="m1g" bindValueTo="$(sbsg.margin1)" />
    <mathInput name="m2g" bindValueTo="$(sbsg.margin2)" />
    </p>
    
    <p>Valigns for sbsg: 
    <textInput name="v1g" bindValueTo="$(sbsg.valign1)" />
    <textInput name="v2g" bindValueTo="$(sbsg.valign2)" />
    </p>
    
    <p>Widths for sbs1: 
    <mathInput name="w11" bindValueTo="$(sbs1.width1)" />
    <mathInput name="w21" bindValueTo="$(sbs1.width2)" />
    </p>
    
    <p>Margins for sbs1: 
    <mathInput name="m11" bindValueTo="$(sbs1.margin1)" />
    <mathInput name="m21" bindValueTo="$(sbs1.margin2)" />
    </p>
    
    <p>Valigns for sbs1: 
    <textInput name="v11" bindValueTo="$(sbs1.valign1)" />
    <textInput name="v21" bindValueTo="$(sbs1.valign2)" />
    </p>
    
    <p>Widths for sbs2: 
    <mathInput name="w12" bindValueTo="$(sbs2.width1)" />
    <mathInput name="w22" bindValueTo="$(sbs2.width2)" />
    </p>
    
    <p>Margins for sbs2: 
    <mathInput name="m12" bindValueTo="$(sbs2.margin1)" />
    <mathInput name="m22" bindValueTo="$(sbs2.margin2)" />
    </p>
    
    <p>Valigns for sbs2: 
    <textInput name="v12" bindValueTo="$(sbs2.valign1)" />
    <textInput name="v22" bindValueTo="$(sbs2.valign2)" />
    </p>
    `,
        });

        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [25, 15],
            specifiedMargins: [5, 10],
            specifiedValigns: ["middle", "top"],
            sbsName: "sbsg",
            isSbsGroup: true,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [20, 20],
            specifiedMargins: [5, 10],
            specifiedValigns: ["top", "top"],
            sbsName: "sbs1",
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [25, 15],
            specifiedMargins: [8, 8],
            specifiedValigns: ["middle", "top"],
            sbsName: "sbs2",
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbsg")].stateValues
                .absoluteMeasurements,
        ).eq(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs1")].stateValues
                .absoluteMeasurements,
        ).eq(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs1")].stateValues
                .essentialWidths,
        ).eqls([null, null]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs1")].stateValues
                .essentialMargins,
        ).eqls([null, null]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs2")].stateValues
                .absoluteMeasurements,
        ).eq(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs2")].stateValues
                .essentialWidths,
        ).eqls([null, null]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs2")].stateValues
                .essentialMargins,
        ).eqls([null, null]);

        // change width1 of sbsg
        await updateMathInputValue({
            latex: "20",
            componentIdx: await resolvePathToNodeIdx("w1g"),
            core,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [20, 15],
            specifiedMargins: [5, 10],
            specifiedValigns: ["middle", "top"],
            sbsName: "sbsg",
            isSbsGroup: true,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [20, 20],
            specifiedMargins: [5, 10],
            specifiedValigns: ["top", "top"],
            sbsName: "sbs1",
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [20, 15],
            specifiedMargins: [8, 8],
            specifiedValigns: ["middle", "top"],
            sbsName: "sbs2",
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs1")].stateValues
                .essentialWidths,
        ).eqls([null, null]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs1")].stateValues
                .essentialMargins,
        ).eqls([null, null]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs2")].stateValues
                .essentialWidths,
        ).eqls([null, null]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs2")].stateValues
                .essentialMargins,
        ).eqls([null, null]);

        // change width2 of sbs2
        await updateMathInputValue({
            latex: "25",
            componentIdx: await resolvePathToNodeIdx("w22"),
            core,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [20, 15],
            specifiedMargins: [5, 10],
            specifiedValigns: ["middle", "top"],
            sbsName: "sbsg",
            isSbsGroup: true,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [20, 20],
            specifiedMargins: [5, 10],
            specifiedValigns: ["top", "top"],
            sbsName: "sbs1",
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [20, 25],
            specifiedMargins: [8, 8],
            specifiedValigns: ["middle", "top"],
            sbsName: "sbs2",
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs1")].stateValues
                .essentialWidths,
        ).eqls([null, null]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs1")].stateValues
                .essentialMargins,
        ).eqls([null, null]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs2")].stateValues
                .essentialWidths,
        ).eqls([null, 25]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs2")].stateValues
                .essentialMargins,
        ).eqls([null, null]);

        // change width2 of sbsg
        await updateMathInputValue({
            latex: "12",
            componentIdx: await resolvePathToNodeIdx("w2g"),
            core,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [20, 12],
            specifiedMargins: [5, 10],
            specifiedValigns: ["middle", "top"],
            sbsName: "sbsg",
            isSbsGroup: true,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [20, 20],
            specifiedMargins: [5, 10],
            specifiedValigns: ["top", "top"],
            sbsName: "sbs1",
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [20, 25],
            specifiedMargins: [8, 8],
            specifiedValigns: ["middle", "top"],
            sbsName: "sbs2",
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs1")].stateValues
                .essentialWidths,
        ).eqls([null, null]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs1")].stateValues
                .essentialMargins,
        ).eqls([null, null]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs2")].stateValues
                .essentialWidths,
        ).eqls([null, 25]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs2")].stateValues
                .essentialMargins,
        ).eqls([null, null]);

        // change width1 of sbs1
        await updateMathInputValue({
            latex: "35",
            componentIdx: await resolvePathToNodeIdx("w11"),
            core,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [20, 12],
            specifiedMargins: [5, 10],
            specifiedValigns: ["middle", "top"],
            sbsName: "sbsg",
            isSbsGroup: true,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [35, 35],
            specifiedMargins: [5, 10],
            specifiedValigns: ["top", "top"],
            sbsName: "sbs1",
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [20, 25],
            specifiedMargins: [8, 8],
            specifiedValigns: ["middle", "top"],
            sbsName: "sbs2",
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs1")].stateValues
                .essentialWidths,
        ).eqls([null, null]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs1")].stateValues
                .essentialMargins,
        ).eqls([null, null]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs2")].stateValues
                .essentialWidths,
        ).eqls([null, 25]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs2")].stateValues
                .essentialMargins,
        ).eqls([null, null]);

        // change width2 of sbs1
        await updateMathInputValue({
            latex: "30",
            componentIdx: await resolvePathToNodeIdx("w21"),
            core,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [20, 12],
            specifiedMargins: [5, 10],
            specifiedValigns: ["middle", "top"],
            sbsName: "sbsg",
            isSbsGroup: true,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [30, 30],
            specifiedMargins: [5, 10],
            specifiedValigns: ["top", "top"],
            sbsName: "sbs1",
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [20, 25],
            specifiedMargins: [8, 8],
            specifiedValigns: ["middle", "top"],
            sbsName: "sbs2",
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs1")].stateValues
                .essentialWidths,
        ).eqls([null, null]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs1")].stateValues
                .essentialMargins,
        ).eqls([null, null]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs2")].stateValues
                .essentialWidths,
        ).eqls([null, 25]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs2")].stateValues
                .essentialMargins,
        ).eqls([null, null]);

        // change width1 of sbs2
        await updateMathInputValue({
            latex: "22",
            componentIdx: await resolvePathToNodeIdx("w12"),
            core,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [20, 12],
            specifiedMargins: [5, 10],
            specifiedValigns: ["middle", "top"],
            sbsName: "sbsg",
            isSbsGroup: true,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [30, 30],
            specifiedMargins: [5, 10],
            specifiedValigns: ["top", "top"],
            sbsName: "sbs1",
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [22, 25],
            specifiedMargins: [8, 8],
            specifiedValigns: ["middle", "top"],
            sbsName: "sbs2",
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs1")].stateValues
                .essentialWidths,
        ).eqls([null, null]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs1")].stateValues
                .essentialMargins,
        ).eqls([null, null]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs2")].stateValues
                .essentialWidths,
        ).eqls([22, 25]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs2")].stateValues
                .essentialMargins,
        ).eqls([null, null]);

        // change right margin of sbsg
        await updateMathInputValue({
            latex: "8",
            componentIdx: await resolvePathToNodeIdx("m2g"),
            core,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [20, 12],
            specifiedMargins: [5, 8],
            specifiedValigns: ["middle", "top"],
            sbsName: "sbsg",
            isSbsGroup: true,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [30, 30],
            specifiedMargins: [5, 8],
            specifiedValigns: ["top", "top"],
            sbsName: "sbs1",
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [22, 25],
            specifiedMargins: [8, 8],
            specifiedValigns: ["middle", "top"],
            sbsName: "sbs2",
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs1")].stateValues
                .essentialWidths,
        ).eqls([null, null]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs1")].stateValues
                .essentialMargins,
        ).eqls([null, null]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs2")].stateValues
                .essentialWidths,
        ).eqls([22, 25]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs2")].stateValues
                .essentialMargins,
        ).eqls([null, null]);

        // change right margin of sbs1
        await updateMathInputValue({
            latex: "7",
            componentIdx: await resolvePathToNodeIdx("m21"),
            core,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [20, 12],
            specifiedMargins: [5, 8],
            specifiedValigns: ["middle", "top"],
            sbsName: "sbsg",
            isSbsGroup: true,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [30, 30],
            specifiedMargins: [5, 7],
            specifiedValigns: ["top", "top"],
            sbsName: "sbs1",
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [22, 25],
            specifiedMargins: [8, 8],
            specifiedValigns: ["middle", "top"],
            sbsName: "sbs2",
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs1")].stateValues
                .essentialWidths,
        ).eqls([null, null]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs1")].stateValues
                .essentialMargins,
        ).eqls([null, 7]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs2")].stateValues
                .essentialWidths,
        ).eqls([22, 25]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs2")].stateValues
                .essentialMargins,
        ).eqls([null, null]);

        // change left margin of sbsg
        await updateMathInputValue({
            latex: "9",
            componentIdx: await resolvePathToNodeIdx("m1g"),
            core,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [20, 12],
            specifiedMargins: [9, 8],
            specifiedValigns: ["middle", "top"],
            sbsName: "sbsg",
            isSbsGroup: true,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [30, 30],
            specifiedMargins: [9, 7],
            specifiedValigns: ["top", "top"],
            sbsName: "sbs1",
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [22, 25],
            specifiedMargins: [8, 8],
            specifiedValigns: ["middle", "top"],
            sbsName: "sbs2",
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs1")].stateValues
                .essentialWidths,
        ).eqls([null, null]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs1")].stateValues
                .essentialMargins,
        ).eqls([null, 7]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs2")].stateValues
                .essentialWidths,
        ).eqls([22, 25]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs2")].stateValues
                .essentialMargins,
        ).eqls([null, null]);

        // change left margin of sbs1
        await updateMathInputValue({
            latex: "6",
            componentIdx: await resolvePathToNodeIdx("m11"),
            core,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [20, 12],
            specifiedMargins: [9, 8],
            specifiedValigns: ["middle", "top"],
            sbsName: "sbsg",
            isSbsGroup: true,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [30, 30],
            specifiedMargins: [6, 7],
            specifiedValigns: ["top", "top"],
            sbsName: "sbs1",
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [22, 25],
            specifiedMargins: [8, 8],
            specifiedValigns: ["middle", "top"],
            sbsName: "sbs2",
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs1")].stateValues
                .essentialWidths,
        ).eqls([null, null]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs1")].stateValues
                .essentialMargins,
        ).eqls([6, 7]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs2")].stateValues
                .essentialWidths,
        ).eqls([22, 25]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs2")].stateValues
                .essentialMargins,
        ).eqls([null, null]);

        // change right margin of sbs2
        await updateMathInputValue({
            latex: "3",
            componentIdx: await resolvePathToNodeIdx("m22"),
            core,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [20, 12],
            specifiedMargins: [9, 8],
            specifiedValigns: ["middle", "top"],
            sbsName: "sbsg",
            isSbsGroup: true,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [30, 30],
            specifiedMargins: [6, 7],
            specifiedValigns: ["top", "top"],
            sbsName: "sbs1",
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [22, 25],
            specifiedMargins: [3, 3],
            specifiedValigns: ["middle", "top"],
            sbsName: "sbs2",
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs1")].stateValues
                .essentialWidths,
        ).eqls([null, null]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs1")].stateValues
                .essentialMargins,
        ).eqls([6, 7]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs2")].stateValues
                .essentialWidths,
        ).eqls([22, 25]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs2")].stateValues
                .essentialMargins,
        ).eqls([null, null]);

        // change left margin of sbs2
        await updateMathInputValue({
            latex: "10",
            componentIdx: await resolvePathToNodeIdx("m12"),
            core,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [20, 12],
            specifiedMargins: [9, 8],
            specifiedValigns: ["middle", "top"],
            sbsName: "sbsg",
            isSbsGroup: true,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [30, 30],
            specifiedMargins: [6, 7],
            specifiedValigns: ["top", "top"],
            sbsName: "sbs1",
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [22, 25],
            specifiedMargins: [10, 10],
            specifiedValigns: ["middle", "top"],
            sbsName: "sbs2",
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs1")].stateValues
                .essentialWidths,
        ).eqls([null, null]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs1")].stateValues
                .essentialMargins,
        ).eqls([6, 7]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs2")].stateValues
                .essentialWidths,
        ).eqls([22, 25]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs2")].stateValues
                .essentialMargins,
        ).eqls([null, null]);

        // change valign1 of sbsg
        await updateTextInputValue({
            text: "bottom",
            componentIdx: await resolvePathToNodeIdx("v1g"),
            core,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [20, 12],
            specifiedMargins: [9, 8],
            specifiedValigns: ["bottom", "top"],
            sbsName: "sbsg",
            isSbsGroup: true,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [30, 30],
            specifiedMargins: [6, 7],
            specifiedValigns: ["top", "top"],
            sbsName: "sbs1",
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [22, 25],
            specifiedMargins: [10, 10],
            specifiedValigns: ["bottom", "top"],
            sbsName: "sbs2",
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs1")].stateValues
                .essentialWidths,
        ).eqls([null, null]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs1")].stateValues
                .essentialMargins,
        ).eqls([6, 7]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs2")].stateValues
                .essentialWidths,
        ).eqls([22, 25]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs2")].stateValues
                .essentialMargins,
        ).eqls([null, null]);

        // change valign2 of sbs1
        await updateTextInputValue({
            text: "middle",
            componentIdx: await resolvePathToNodeIdx("v21"),
            core,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [20, 12],
            specifiedMargins: [9, 8],
            specifiedValigns: ["bottom", "top"],
            sbsName: "sbsg",
            isSbsGroup: true,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [30, 30],
            specifiedMargins: [6, 7],
            specifiedValigns: ["middle", "middle"],
            sbsName: "sbs1",
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [22, 25],
            specifiedMargins: [10, 10],
            specifiedValigns: ["bottom", "top"],
            sbsName: "sbs2",
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs1")].stateValues
                .essentialWidths,
        ).eqls([null, null]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs1")].stateValues
                .essentialMargins,
        ).eqls([6, 7]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs2")].stateValues
                .essentialWidths,
        ).eqls([22, 25]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs2")].stateValues
                .essentialMargins,
        ).eqls([null, null]);

        // change valign2 of sbsg
        await updateTextInputValue({
            text: "middle",
            componentIdx: await resolvePathToNodeIdx("v2g"),
            core,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [20, 12],
            specifiedMargins: [9, 8],
            specifiedValigns: ["bottom", "middle"],
            sbsName: "sbsg",
            isSbsGroup: true,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [30, 30],
            specifiedMargins: [6, 7],
            specifiedValigns: ["middle", "middle"],
            sbsName: "sbs1",
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [22, 25],
            specifiedMargins: [10, 10],
            specifiedValigns: ["bottom", "middle"],
            sbsName: "sbs2",
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs1")].stateValues
                .essentialWidths,
        ).eqls([null, null]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs1")].stateValues
                .essentialMargins,
        ).eqls([6, 7]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs2")].stateValues
                .essentialWidths,
        ).eqls([22, 25]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs2")].stateValues
                .essentialMargins,
        ).eqls([null, null]);

        // change valign1 of sbs1
        await updateTextInputValue({
            text: "top",
            componentIdx: await resolvePathToNodeIdx("v11"),
            core,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [20, 12],
            specifiedMargins: [9, 8],
            specifiedValigns: ["bottom", "middle"],
            sbsName: "sbsg",
            isSbsGroup: true,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [30, 30],
            specifiedMargins: [6, 7],
            specifiedValigns: ["top", "top"],
            sbsName: "sbs1",
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [22, 25],
            specifiedMargins: [10, 10],
            specifiedValigns: ["bottom", "middle"],
            sbsName: "sbs2",
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs1")].stateValues
                .essentialWidths,
        ).eqls([null, null]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs1")].stateValues
                .essentialMargins,
        ).eqls([6, 7]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs2")].stateValues
                .essentialWidths,
        ).eqls([22, 25]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs2")].stateValues
                .essentialMargins,
        ).eqls([null, null]);

        // change valigns of sbs2
        await updateTextInputValue({
            text: "middle",
            componentIdx: await resolvePathToNodeIdx("v12"),
            core,
        });
        await updateTextInputValue({
            text: "bottom",
            componentIdx: await resolvePathToNodeIdx("v22"),
            core,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [20, 12],
            specifiedMargins: [9, 8],
            specifiedValigns: ["bottom", "middle"],
            sbsName: "sbsg",
            isSbsGroup: true,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [30, 30],
            specifiedMargins: [6, 7],
            specifiedValigns: ["top", "top"],
            sbsName: "sbs1",
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [22, 25],
            specifiedMargins: [10, 10],
            specifiedValigns: ["middle", "bottom"],
            sbsName: "sbs2",
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs1")].stateValues
                .essentialWidths,
        ).eqls([null, null]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs1")].stateValues
                .essentialMargins,
        ).eqls([6, 7]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs2")].stateValues
                .essentialWidths,
        ).eqls([22, 25]);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs2")].stateValues
                .essentialMargins,
        ).eqls([null, null]);
    });

    it("copy sbsGroup and overwrite parameters", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <sbsGroup name="sbsg" widths="25% 15%" margins="5% 10%" valigns="middle top">
      <sideBySide name="sbs1" width="20%" valign="top">
        <lorem generateParagraphs="2" />
      </sideBySide>
      <sideBySide name="sbs2" margins="8%">
        <lorem generateParagraphs="2" />
      </sideBySide>
    </sbsGroup>

    <sbsGroup extend="$sbsg" widths="30% 10%" margins="1% 3%" valigns="bottom middle" name="sbsg2" />

    <sbsGroup extend="$sbsg2" widths="7%" valigns="top bottom" name="sbsg3" />

    `,
        });

        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [25, 15],
            specifiedMargins: [5, 10],
            specifiedValigns: ["middle", "top"],
            sbsName: "sbsg",
            isSbsGroup: true,
        });

        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [20, 20],
            specifiedMargins: [5, 10],
            specifiedValigns: ["top", "top"],
            sbsName: "sbsg.sbs1",
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [25, 15],
            specifiedMargins: [8, 8],
            specifiedValigns: ["middle", "top"],
            sbsName: "sbsg.sbs2",
        });

        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [30, 10],
            specifiedMargins: [1, 3],
            specifiedValigns: ["bottom", "middle"],
            sbsName: "sbsg2",
            isSbsGroup: true,
        });

        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [20, 20],
            specifiedMargins: [1, 3],
            specifiedValigns: ["top", "top"],
            sbsName: "sbsg2.sbs1",
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [30, 10],
            specifiedMargins: [8, 8],
            specifiedValigns: ["bottom", "middle"],
            sbsName: "sbsg2.sbs2",
        });

        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [7, null],
            specifiedMargins: [1, 3],
            specifiedValigns: ["top", "bottom"],
            sbsName: "sbsg3",
            isSbsGroup: true,
        });

        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [20, 20],
            specifiedMargins: [1, 3],
            specifiedValigns: ["top", "top"],
            sbsName: "sbsg3.sbs1",
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [7, null],
            specifiedMargins: [8, 8],
            specifiedValigns: ["top", "bottom"],
            sbsName: "sbsg3.sbs2",
        });
    });

    it("sbsGroup absolute measurements turned to absolute with warning", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <sbsGroup width="100px" margins="1px">
      <sideBySide>
        <p>Hello</p>
        <p>Hello</p>
      </sideBySide>
    </sbsGroup>

    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("_sbsGroup1")].stateValues
                .marginsAbsolute,
        ).eq(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("_sbsGroup1")].stateValues
                .widthsAbsolute,
        ).eq(false);

        let errorWarnings = core.core!.errorWarnings;

        expect(errorWarnings.errors.length).eq(0);
        expect(errorWarnings.warnings.length).eq(2);

        expect(errorWarnings.warnings[0].message).contain(
            `<sbsGroup> is not implemented for absolute measurements. Setting widths to relative`,
        );
        expect(errorWarnings.warnings[0].position.start.line).eq(2);
        expect(errorWarnings.warnings[0].position.start.column).eq(5);
        expect(errorWarnings.warnings[0].position.end.line).eq(7);
        expect(errorWarnings.warnings[0].position.end.column).eq(16);

        expect(errorWarnings.warnings[1].message).contain(
            `<sbsGroup> is not implemented for absolute measurements. Setting margins to relative`,
        );
        expect(errorWarnings.warnings[1].position.start.line).eq(2);
        expect(errorWarnings.warnings[1].position.start.column).eq(5);
        expect(errorWarnings.warnings[1].position.end.line).eq(7);
        expect(errorWarnings.warnings[1].position.end.column).eq(16);
    });

    it("sideBySide with a stack", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <sideBySide name="sbs" width="49%" margins="0%">
      <stack>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. </p>
        <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. </p>
        <p>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. </p>
      </stack>
      <p>Fringilla ut morbi tincidunt augue interdum velit euismod in. Mattis molestie a iaculis at erat. Pharetra magna ac placerat vestibulum lectus mauris ultrices. Nisl rhoncus mattis rhoncus urna neque viverra justo nec ultrices. Congue quisque egestas diam in arcu cursus euismod quis viverra. Et leo duis ut diam quam nulla porttitor massa. Dolor sit amet consectetur adipiscing elit. Ullamcorper malesuada proin libero nunc consequat interdum varius. Nunc lobortis mattis aliquam faucibus purus. Amet commodo nulla facilisi nullam vehicula. Massa placerat duis ultricies lacus sed turpis.</p>
    </sideBySide>
    
  
    `,
        });

        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [49, 49],
            specifiedMargins: [0, 0],
            sbsName: "sbs",
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs")].stateValues
                .absoluteMeasurements,
        ).eq(false);
    });

    it("sideBySide with singular relative arguments from inputs, two panels", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `

    <p>Width: <mathInput name="w" prefill="20" /></p>
    <p>Margin: <mathInput name="m" prefill="10" /></p>
    <p>Valign: <textInput name="v" prefill="middle" /></p>

    <sideBySide name="sbs" width="$(w)%" margins="$(m)%" valign="$v">
    <lorem generateParagraphs="1" />
    <lorem generateParagraphs="1" />
    </sideBySide>

    <p>Widths: 
    <mathInput name="w1" bindValueTo="$(sbs.width1)" />
    <mathInput name="w2" bindValueTo="$(sbs.width2)" />
    </p>

    <p>Margins: 
    <mathInput name="m1" bindValueTo="$(sbs.margin1)" />
    <mathInput name="m2" bindValueTo="$(sbs.margin2)" />
    </p>

    <p>Valigns: 
    <textInput name="v1" bindValueTo="$(sbs.valign1)" />
    <textInput name="v2" bindValueTo="$(sbs.valign2)" />
    </p>
    `,
        });

        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [20, 20],
            specifiedMargins: [10, 10],
            specifiedValigns: ["middle", "middle"],
            sbsName: "sbs",
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs")].stateValues
                .absoluteMeasurements,
        ).eq(false);

        // change first width, second matches
        await updateMathInputValue({
            latex: "30",
            componentIdx: await resolvePathToNodeIdx("w1"),
            core,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [30, 30],
            specifiedMargins: [10, 10],
            specifiedValigns: ["middle", "middle"],
            sbsName: "sbs",
        });

        // change second width, first matches, rescaling
        await updateMathInputValue({
            latex: "80",
            componentIdx: await resolvePathToNodeIdx("w2"),
            core,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [80, 80],
            specifiedMargins: [10, 10],
            specifiedValigns: ["middle", "middle"],
            sbsName: "sbs",
        });

        // change defining width
        await updateMathInputValue({
            latex: "25",
            componentIdx: await resolvePathToNodeIdx("w"),
            core,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [25, 25],
            specifiedMargins: [10, 10],
            specifiedValigns: ["middle", "middle"],
            sbsName: "sbs",
        });

        // invalid defining width treated as null
        await updateMathInputValue({
            latex: "x",
            componentIdx: await resolvePathToNodeIdx("w"),
            core,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [null, null],
            specifiedMargins: [10, 10],
            specifiedValigns: ["middle", "middle"],
            sbsName: "sbs",
        });

        // reset width by changing second width
        await updateMathInputValue({
            latex: "10",
            componentIdx: await resolvePathToNodeIdx("w2"),
            core,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [10, 10],
            specifiedMargins: [10, 10],
            specifiedValigns: ["middle", "middle"],
            sbsName: "sbs",
        });

        // decrease defining margin
        await updateMathInputValue({
            latex: "5",
            componentIdx: await resolvePathToNodeIdx("m"),
            core,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [10, 10],
            specifiedMargins: [5, 5],
            specifiedValigns: ["middle", "middle"],
            sbsName: "sbs",
        });

        // invalid defining margin treated as null
        await updateMathInputValue({
            latex: "none",
            componentIdx: await resolvePathToNodeIdx("m"),
            core,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [10, 10],
            specifiedMargins: [null, null],
            specifiedValigns: ["middle", "middle"],
            sbsName: "sbs",
        });

        // reset from left margin, right margin matches
        await updateMathInputValue({
            latex: "15",
            componentIdx: await resolvePathToNodeIdx("m1"),
            core,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [10, 10],
            specifiedMargins: [15, 15],
            specifiedValigns: ["middle", "middle"],
            sbsName: "sbs",
        });

        // increase right margin, left margin matches, rescaling
        await updateMathInputValue({
            latex: "45",
            componentIdx: await resolvePathToNodeIdx("m2"),
            core,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [10, 10],
            specifiedMargins: [45, 45],
            specifiedValigns: ["middle", "middle"],
            sbsName: "sbs",
        });

        // change first valign
        await updateTextInputValue({
            text: "top",
            componentIdx: await resolvePathToNodeIdx("v1"),
            core,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [10, 10],
            specifiedMargins: [45, 45],
            specifiedValigns: ["top", "top"],
            sbsName: "sbs",
        });

        // change defining valign
        await updateTextInputValue({
            text: "bottom",
            componentIdx: await resolvePathToNodeIdx("v1"),
            core,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [10, 10],
            specifiedMargins: [45, 45],
            specifiedValigns: ["bottom", "bottom"],
            sbsName: "sbs",
        });

        // change second valign
        await updateTextInputValue({
            text: "middle",
            componentIdx: await resolvePathToNodeIdx("v2"),
            core,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [10, 10],
            specifiedMargins: [45, 45],
            specifiedValigns: ["middle", "middle"],
            sbsName: "sbs",
        });

        // invalid defining valign becomes top
        await updateTextInputValue({
            text: "invalid",
            componentIdx: await resolvePathToNodeIdx("v"),
            core,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [10, 10],
            specifiedMargins: [45, 45],
            specifiedValigns: [null, null],
            sbsName: "sbs",
        });

        // reset from first valign
        await updateTextInputValue({
            text: "bottom",
            componentIdx: await resolvePathToNodeIdx("v1"),
            core,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [10, 10],
            specifiedMargins: [45, 45],
            specifiedValigns: ["bottom", "bottom"],
            sbsName: "sbs",
        });
    });

    it("sideBySide with plural relative arguments from inputs, two panels", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p>Defining widths: 
    <mathInput name="dw1" prefill="20" />
    <mathInput name="dw2" prefill="10" />
    </p>
    <p>Defining margins: 
    <mathInput name="dm1" prefill="10" />
    <mathInput name="dm2" prefill="20" />
    </p>
    <p>Defining valigns: 
    <textInput name="dv1" prefill="middle" />
    <textInput name="dv2" prefill="bottom" />
    </p>

    <sideBySide name="sbs" widths="$(dw1)% $(dw2)%" margins="$(dm1)% $(dm2)%" valigns="$dv1 $dv2">
    <lorem generateParagraphs="1" />
    <lorem generateParagraphs="1" />
    </sideBySide>

    <p>Widths: 
    <mathInput name="w1" bindValueTo="$(sbs.width1)" />
    <mathInput name="w2" bindValueTo="$(sbs.width2)" />
    </p>

    <p>Margins: 
    <mathInput name="m1" bindValueTo="$(sbs.margin1)" />
    <mathInput name="m2" bindValueTo="$(sbs.margin2)" />
    </p>

    <p>Valigns: 
    <textInput name="v1" bindValueTo="$(sbs.valign1)" />
    <textInput name="v2" bindValueTo="$(sbs.valign2)" />
    </p>
    `,
        });

        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [20, 10],
            specifiedMargins: [10, 20],
            specifiedValigns: ["middle", "bottom"],
            sbsName: "sbs",
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs")].stateValues
                .absoluteMeasurements,
        ).eq(false);

        // change first width
        await updateMathInputValue({
            latex: "30",
            componentIdx: await resolvePathToNodeIdx("w1"),
            core,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [30, 10],
            specifiedMargins: [10, 20],
            specifiedValigns: ["middle", "bottom"],
            sbsName: "sbs",
        });

        // change second defining width, rescaling
        await updateMathInputValue({
            latex: "110",
            componentIdx: await resolvePathToNodeIdx("dw2"),
            core,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [30, 110],
            specifiedMargins: [10, 20],
            specifiedValigns: ["middle", "bottom"],
            sbsName: "sbs",
        });

        // make second defining width be invalid, treated as null
        await updateMathInputValue({
            latex: "hello",
            componentIdx: await resolvePathToNodeIdx("dw2"),
            core,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [30, null],
            specifiedMargins: [10, 20],
            specifiedValigns: ["middle", "bottom"],
            sbsName: "sbs",
        });

        // make first defining width be invalid, treated as null
        await updateMathInputValue({
            latex: "bye",
            componentIdx: await resolvePathToNodeIdx("dw1"),
            core,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [null, null],
            specifiedMargins: [10, 20],
            specifiedValigns: ["middle", "bottom"],
            sbsName: "sbs",
        });

        // reset second width
        await updateMathInputValue({
            latex: "5",
            componentIdx: await resolvePathToNodeIdx("w2"),
            core,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [null, 5],
            specifiedMargins: [10, 20],
            specifiedValigns: ["middle", "bottom"],
            sbsName: "sbs",
        });

        // reset first width
        await updateMathInputValue({
            latex: "30",
            componentIdx: await resolvePathToNodeIdx("w1"),
            core,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [30, 5],
            specifiedMargins: [10, 20],
            specifiedValigns: ["middle", "bottom"],
            sbsName: "sbs",
        });

        // decrease right margin
        await updateMathInputValue({
            latex: "5",
            componentIdx: await resolvePathToNodeIdx("m2"),
            core,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [30, 5],
            specifiedMargins: [10, 5],
            specifiedValigns: ["middle", "bottom"],
            sbsName: "sbs",
        });

        // increase left defining margin, rescaling
        await updateMathInputValue({
            latex: "77.5",
            componentIdx: await resolvePathToNodeIdx("dm1"),
            core,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [30, 5],
            specifiedMargins: [77.5, 5],
            specifiedValigns: ["middle", "bottom"],
            sbsName: "sbs",
        });

        // decrease left margin
        await updateMathInputValue({
            latex: "7",
            componentIdx: await resolvePathToNodeIdx("m1"),
            core,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [30, 5],
            specifiedMargins: [7, 5],
            specifiedValigns: ["middle", "bottom"],
            sbsName: "sbs",
        });

        // invalid left defining margin, treated as null
        await updateMathInputValue({
            latex: "hello",
            componentIdx: await resolvePathToNodeIdx("dm1"),
            core,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [30, 5],
            specifiedMargins: [null, 5],
            specifiedValigns: ["middle", "bottom"],
            sbsName: "sbs",
        });

        // invalid right defining margin, treated as null
        await updateMathInputValue({
            latex: "bye",
            componentIdx: await resolvePathToNodeIdx("dm2"),
            core,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [30, 5],
            specifiedMargins: [null, null],
            specifiedValigns: ["middle", "bottom"],
            sbsName: "sbs",
        });

        // reset left margin
        await updateMathInputValue({
            latex: "12",
            componentIdx: await resolvePathToNodeIdx("m1"),
            core,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [30, 5],
            specifiedMargins: [12, null],
            specifiedValigns: ["middle", "bottom"],
            sbsName: "sbs",
        });

        // reset right margin
        await updateMathInputValue({
            latex: "8",
            componentIdx: await resolvePathToNodeIdx("m2"),
            core,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [30, 5],
            specifiedMargins: [12, 8],
            specifiedValigns: ["middle", "bottom"],
            sbsName: "sbs",
        });

        // change first valign
        await updateTextInputValue({
            text: "top",
            componentIdx: await resolvePathToNodeIdx("v1"),
            core,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [30, 5],
            specifiedMargins: [12, 8],
            specifiedValigns: ["top", "bottom"],
            sbsName: "sbs",
        });

        // change second valign
        await updateTextInputValue({
            text: "middle",
            componentIdx: await resolvePathToNodeIdx("v2"),
            core,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [30, 5],
            specifiedMargins: [12, 8],
            specifiedValigns: ["top", "middle"],
            sbsName: "sbs",
        });

        // change first defining valign
        await updateTextInputValue({
            text: "bottom",
            componentIdx: await resolvePathToNodeIdx("dv1"),
            core,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [30, 5],
            specifiedMargins: [12, 8],
            specifiedValigns: ["bottom", "middle"],
            sbsName: "sbs",
        });

        // change second defining valign
        await updateTextInputValue({
            text: "bottom",
            componentIdx: await resolvePathToNodeIdx("dv2"),
            core,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [30, 5],
            specifiedMargins: [12, 8],
            specifiedValigns: ["bottom", "bottom"],
            sbsName: "sbs",
        });

        // invalid second defining valign treated as null
        await updateTextInputValue({
            text: "banana",
            componentIdx: await resolvePathToNodeIdx("dv2"),
            core,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [30, 5],
            specifiedMargins: [12, 8],
            specifiedValigns: ["bottom", null],
            sbsName: "sbs",
        });

        // invalid first defining valign treated as null
        await updateTextInputValue({
            text: "apple",
            componentIdx: await resolvePathToNodeIdx("dv1"),
            core,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [30, 5],
            specifiedMargins: [12, 8],
            specifiedValigns: [null, null],
            sbsName: "sbs",
        });

        // reset first valign
        await updateTextInputValue({
            text: "middle",
            componentIdx: await resolvePathToNodeIdx("v1"),
            core,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [30, 5],
            specifiedMargins: [12, 8],
            specifiedValigns: ["middle", null],
            sbsName: "sbs",
        });

        // reset second valign
        await updateTextInputValue({
            text: "bottom",
            componentIdx: await resolvePathToNodeIdx("v2"),
            core,
        });
        await checkTwoColumnSbs({
            core,
            resolvePathToNodeIdx,
            specifiedWidths: [30, 5],
            specifiedMargins: [12, 8],
            specifiedValigns: ["middle", "bottom"],
            sbsName: "sbs",
        });
    });
});
