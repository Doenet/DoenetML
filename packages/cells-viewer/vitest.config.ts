import { defineConfig } from "vitest/config";

// The renderers run in jsdom; `pretendToBeVisual` gives it
// `requestAnimationFrame`, which a tick schedules.
export default defineConfig({
    test: {
        environment: "jsdom",
        environmentOptions: { jsdom: { pretendToBeVisual: true } },
    },
});
