import React from "react";
import { describe, expect, it } from "vitest";
import { toXml as xastToXml } from "xast-util-to-xml";
import { renderReactToXast } from "../src/utils/pretext/xast-reconciler";
import { labelContent } from "../src/renderers/pretext-xml/use-input-label";

function labelXml(label: string) {
    return xastToXml(renderReactToXast(<>{labelContent(label)}</>));
}

describe("labelContent", () => {
    it("makes math of what is between \\( and \\)", () => {
        expect(labelXml("Find \\(x\\) and \\(y\\):")).toBe(
            "Find <m>x</m> and <m>y</m>:",
        );
    });

    it("prints a delimiter without its partner as written", () => {
        expect(labelXml("a \\) b")).toBe("a \\) b");
        expect(labelXml("a \\( b")).toBe("a \\( b");
        expect(labelXml("\\(x\\) then \\( b")).toBe("<m>x</m> then \\( b");
    });
});
