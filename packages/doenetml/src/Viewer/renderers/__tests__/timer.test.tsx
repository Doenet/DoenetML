import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

/**
 * The renderer reads its state variables through `useDoenetRenderer`, which
 * reaches into the viewer's redux store. Only `SVs` and `id` matter to the
 * markup, so the hook is replaced by one that hands back what a test asks for.
 */
const currentSVs: { value: Record<string, any> } = { value: {} };

vi.mock("../../useDoenetRenderer", () => ({
    default: () => ({
        id: "timer-under-test",
        SVs: currentSVs.value,
        actions: {},
        callAction: () => {},
    }),
}));

import Timer from "../timer";

function render(SVs: Record<string, any>) {
    currentSVs.value = {
        hidden: false,
        text: "1:30",
        running: false,
        paused: false,
        expired: false,
        showControls: true,
        disabled: false,
        ...SVs,
    };
    return renderToStaticMarkup(<Timer {...({} as any)} />);
}

function buttons(html: string) {
    return [...html.matchAll(/<button([^>]*)>(.*?)<\/button>/g)].map((m) => ({
        disabled: /\sdisabled=""/.test(m[1]),
        text: m[2].replace(/<[^>]*>/g, ""),
    }));
}

describe("the timer renderer", () => {
    it("shows the time in a timer region, outside the live region", () => {
        const html = render({});
        expect(html).toMatch(/<span role="timer"[^>]*>1:30<\/span>/);
        expect(html).toMatch(/<span[^>]*aria-live="polite"[^>]*><\/span>/);
    });

    it("labels the one button for what it will do", () => {
        expect(buttons(render({})).map((b) => b.text)).eqls(["Start", "Reset"]);
        expect(buttons(render({ running: true }))[0].text).eq("Pause");
        expect(buttons(render({ paused: true }))[0].text).eq("Resume");
        expect(buttons(render({ expired: true }))[0].text).eq("Start");
    });

    it("disables Reset only when there is nothing to reset", () => {
        expect(buttons(render({}))[1].disabled).eq(true);
        expect(buttons(render({ running: true }))[1].disabled).eq(false);
        expect(buttons(render({ paused: true }))[1].disabled).eq(false);
        expect(buttons(render({ expired: true }))[1].disabled).eq(false);
    });

    it("disables both buttons when the timer is disabled", () => {
        expect(
            buttons(render({ running: true, disabled: true })).map(
                (b) => b.disabled,
            ),
        ).eqls([true, true]);
    });

    it("draws no buttons without controls, and nothing when hidden", () => {
        expect(buttons(render({ showControls: false }))).eqls([]);
        expect(render({ showControls: false })).toContain("1:30");
        expect(render({ hidden: true })).eq("");
    });
});
