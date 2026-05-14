import React from "react";
import { describe, expect, it } from "vitest";

import util from "util";
import { renderReactToXast } from "../src/utils/pretext/xast-reconciler";
import { toXml as xastToXml } from "xast-util-to-xml";

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

    it("supports dangerouslySetInnerHTML to directly set an XML string as children", () => {
        expect(
            xastToXml(
                renderReactToXast(
                    <section
                        dangerouslySetInnerHTML={{
                            __html: `<figure><title>Graph title</title></figure>`,
                        }}
                    />,
                ),
            ),
        ).toMatchInlineSnapshot(
            `"<section><figure><title>Graph title</title></figure></section>"`,
        );
    });
});
