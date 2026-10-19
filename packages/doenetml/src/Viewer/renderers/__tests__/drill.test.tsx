import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

/**
 * The renderer reads its state variables and children through
 * `useDoenetRenderer`, which reaches into the viewer's redux store. The hook
 * is replaced by one that hands back what a test asks for.
 */
const currentSVs: { value: Record<string, any> } = { value: {} };

vi.mock("../../useDoenetRenderer", () => ({
    default: () => ({
        id: "drill-under-test",
        SVs: currentSVs.value,
        children: [<p key="q">THE QUESTION</p>],
        actions: {},
        callAction: () => {},
    }),
}));

import Drill from "../drill";

function render(SVs: Record<string, any>) {
    currentSVs.value = {
        hidden: false,
        phase: "notStarted",
        roundStatus: "answering",
        lastRoundCorrect: null,
        timeText: "2:00",
        elapsedText: "0:00",
        numCorrect: 0,
        numRequired: 15,
        bestNumCorrect: 0,
        attemptNumber: 0,
        canStart: true,
        ...SVs,
    };
    return renderToStaticMarkup(<Drill {...({} as any)} />);
}

function buttons(html: string) {
    return [...html.matchAll(/<button([^>]*)>(.*?)<\/button>/g)].map((m) => ({
        disabled: /\sdisabled=""/.test(m[1]),
        text: m[2].replace(/<[^>]*>/g, ""),
    }));
}

function status(html: string) {
    return html.match(/data-test="drill-status"[^>]*>(.*?)<\/div>/)![1];
}

describe("the drill renderer", () => {
    it("before the first start: time, progress and Start, but no question", () => {
        const html = render({});
        expect(html).toMatch(/<span role="timer"[^>]*>2:00<\/span>/);
        expect(html).toContain('aria-valuenow="0"');
        expect(html).toContain('aria-valuemax="15"');
        expect(html).toContain("0 of 15 correct");
        expect(buttons(html)).eqls([{ disabled: false, text: "Start" }]);
        expect(html).not.toContain("THE QUESTION");
    });

    it("while running: the question, and no button", () => {
        const html = render({
            phase: "running",
            attemptNumber: 1,
            numCorrect: 4,
        });
        expect(html).toContain("THE QUESTION");
        expect(buttons(html)).eqls([]);
        expect(html).toContain("4 of 15 correct");
        expect(status(html)).eq("");
    });

    it("says whether the last answer was right", () => {
        const running = { phase: "running", attemptNumber: 1 };
        expect(
            status(
                render({
                    ...running,
                    roundStatus: "feedback",
                    lastRoundCorrect: true,
                }),
            ),
        ).eq("Correct");
        expect(
            status(
                render({
                    ...running,
                    roundStatus: "feedback",
                    lastRoundCorrect: false,
                }),
            ),
        ).eq("Not quite");
        expect(
            status(
                render({
                    ...running,
                    roundStatus: "answering",
                    lastRoundCorrect: false,
                }),
            ),
        ).eq("Not quite, try again");
    });

    it("after an attempt: the result, the best attempt and Try again", () => {
        let html = render({
            phase: "expired",
            attemptNumber: 1,
            numCorrect: 9,
            bestNumCorrect: 9,
            timeText: "0:00",
        });
        expect(status(html)).eq("Time&#x27;s up: 9 of 15 correct");
        expect(html).toContain("Best: 9 of 15");
        expect(buttons(html)).eqls([{ disabled: false, text: "Try again" }]);
        expect(html).not.toContain("THE QUESTION");

        html = render({
            phase: "succeeded",
            attemptNumber: 2,
            numCorrect: 15,
            bestNumCorrect: 15,
            elapsedText: "1:42",
        });
        expect(status(html)).eq("Done: 15 correct in 1:42");
    });

    it("disables the button when no attempt is left", () => {
        const html = render({
            phase: "expired",
            attemptNumber: 1,
            canStart: false,
        });
        expect(buttons(html)).eqls([{ disabled: true, text: "Try again" }]);
    });
});
