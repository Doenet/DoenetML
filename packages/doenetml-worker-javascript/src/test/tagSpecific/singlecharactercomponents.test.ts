import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

describe("Single character tag tests", async () => {
    it("dashes", async () => {
        let core = await createTestCore({
            doenetML: `
  <p name="p">1 <ndash/> 2 <mdash/> that's it</p>
  `,
        });

        // Note these dashes are different unicode even though they display the same here
        let stateVariables = await core.returnAllStateVariables(true);

        expect(stateVariables["/p"].stateValues.text).eq("1 – 2 — that's it");
    });

    it("nbsp", async () => {
        let core = await createTestCore({
            doenetML: `
   <p name="p">act<nbsp/>like<nbsp/>one<nbsp/>word</p>
  `,
        });

        let stateVariables = await core.returnAllStateVariables(true);

        expect(stateVariables["/p"].stateValues.text).eq(
            "act\u00a0like\u00a0one\u00a0word",
        );
    });

    it("ellipsis", async () => {
        let core = await createTestCore({
            doenetML: `
   <p name="p">we could do that<ellipsis/></p>
  `,
        });

        let stateVariables = await core.returnAllStateVariables(true);

        expect(stateVariables["/p"].stateValues.text).eq("we could do that…");
    });

    it("unmatched quotes", async () => {
        let core = await createTestCore({
            doenetML: `
   <p name="p"><rq/><lq/><rsq/><lsq/></p>
  `,
        });

        let stateVariables = await core.returnAllStateVariables(true);

        expect(stateVariables["/p"].stateValues.text).eq(`”“’‘`);
    });
});
