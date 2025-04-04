import React from "react";
import { describe, expect, it } from "vitest";
import util from "util";
import { renderReactToXast } from "../src/utils/pretext/xast-reconciler";

const origLog = console.log;
console.log = (...args) => {
    origLog(...args.map((x) => util.inspect(x, false, 10, true)));
};

describe("react-to-xast", async () => {
    it("can convert a simple react element to xast", () => {
        expect(renderReactToXast(<p key="foo">Hi</p>)).toMatchInlineSnapshot(`
          {
            "children": [
              {
                "attributes": {},
                "children": [
                  {
                    "type": "text",
                    "value": "Hi",
                  },
                ],
                "name": "p",
                "type": "element",
              },
            ],
            "type": "root",
          }
        `);
    });
});
