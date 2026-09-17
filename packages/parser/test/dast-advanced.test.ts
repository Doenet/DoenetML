import { describe, expect, it } from "vitest";
import { lezerToDast } from "../src/lezer-to-dast";
import util from "util";
import { filterPositionInfo } from "../src/dast-to-xml/utils";
import {
    DastElement,
    DastFunctionMacro,
    DastMacro,
    DastRootContent,
    DastText,
} from "../src/types";
import { MacroParser } from "../src/macros/parser";
import { gobbleFunctionArguments } from "../src/lezer-to-dast/gobble-function-arguments";
import { toXml } from "../src/dast-to-xml/dast-util-to-xml";

const origLog = console.log;
console.log = (...args) => {
    origLog(...args.map((x) => util.inspect(x, false, 10, true)));
};

describe("DAST", async () => {
    it("Can gobble function arguments", () => {
        let nodes: DastRootContent[];
        let func: DastFunctionMacro;

        // Argument where text is already split up.
        func = MacroParser.parse(`$$f`)[0] as DastFunctionMacro;
        nodes = [
            func,
            { type: "text", value: "(" },
            { type: "text", value: "foo" },
            { type: "text", value: ")" },
            { type: "text", value: "bar" },
        ];
        expect(filterPositionInfo(gobbleFunctionArguments(nodes)))
            .toMatchInlineSnapshot(`
              [
                {
                  "input": [
                    [
                      {
                        "type": "text",
                        "value": "foo",
                      },
                    ],
                  ],
                  "path": [
                    {
                      "index": [],
                      "name": "f",
                      "type": "pathPart",
                    },
                  ],
                  "type": "function",
                },
                {
                  "type": "text",
                  "value": "bar",
                },
              ]
            `);

        // Argument where text is not split up.
        func = MacroParser.parse(`$$f`)[0] as DastFunctionMacro;
        nodes = [func, { type: "text", value: "(foo) bar" }];
        expect(filterPositionInfo(gobbleFunctionArguments(nodes)))
            .toMatchInlineSnapshot(`
              [
                {
                  "input": [
                    [
                      {
                        "type": "text",
                        "value": "foo",
                      },
                    ],
                  ],
                  "path": [
                    {
                      "index": [],
                      "name": "f",
                      "type": "pathPart",
                    },
                  ],
                  "type": "function",
                },
                {
                  "type": "text",
                  "value": " bar",
                },
              ]
            `);

        // Multiple arguments
        func = MacroParser.parse(`$$f`)[0] as DastFunctionMacro;
        nodes = [func, { type: "text", value: "(foo, laz) bar" }];
        expect(filterPositionInfo(gobbleFunctionArguments(nodes)))
            .toMatchInlineSnapshot(`
              [
                {
                  "input": [
                    [
                      {
                        "type": "text",
                        "value": "foo",
                      },
                    ],
                    [
                      {
                        "type": "text",
                        "value": "laz",
                      },
                    ],
                  ],
                  "path": [
                    {
                      "index": [],
                      "name": "f",
                      "type": "pathPart",
                    },
                  ],
                  "type": "function",
                },
                {
                  "type": "text",
                  "value": " bar",
                },
              ]
            `);

        // Argument with an element in it
        func = MacroParser.parse(`$$f`)[0] as DastFunctionMacro;
        nodes = [
            func,
            { type: "text", value: "(foo" },
            {
                type: "element",
                name: "m",
                attributes: {},
                children: [{ type: "text", value: "alpha" }],
            },
            { type: "text", value: ") bar" },
        ];
        expect(filterPositionInfo(gobbleFunctionArguments(nodes)))
            .toMatchInlineSnapshot(`
              [
                {
                  "input": [
                    [
                      {
                        "type": "text",
                        "value": "foo",
                      },
                      {
                        "attributes": {},
                        "children": [
                          {
                            "type": "text",
                            "value": "alpha",
                          },
                        ],
                        "name": "m",
                        "type": "element",
                      },
                    ],
                  ],
                  "path": [
                    {
                      "index": [],
                      "name": "f",
                      "type": "pathPart",
                    },
                  ],
                  "type": "function",
                },
                {
                  "type": "text",
                  "value": " bar",
                },
              ]
            `);

        // Missing closing paren.
        func = MacroParser.parse(`$$f`)[0] as DastFunctionMacro;
        nodes = [func, { type: "text", value: "(foo bar" }];
        expect(filterPositionInfo(gobbleFunctionArguments(nodes)))
            .toMatchInlineSnapshot(`
              [
                {
                  "input": null,
                  "path": [
                    {
                      "index": [],
                      "name": "f",
                      "type": "pathPart",
                    },
                  ],
                  "type": "function",
                },
                {
                  "type": "text",
                  "value": "(",
                },
                {
                  "type": "text",
                  "value": "foo bar",
                },
              ]
            `);

        // Missing open paren.
        func = MacroParser.parse(`$$f`)[0] as DastFunctionMacro;
        nodes = [func, { type: "text", value: "foo bar)" }];
        expect(filterPositionInfo(gobbleFunctionArguments(nodes)))
            .toMatchInlineSnapshot(`
              [
                {
                  "input": null,
                  "path": [
                    {
                      "index": [],
                      "name": "f",
                      "type": "pathPart",
                    },
                  ],
                  "type": "function",
                },
                {
                  "type": "text",
                  "value": "foo bar",
                },
                {
                  "type": "text",
                  "value": ")",
                },
              ]
            `);

        // Multiple functions
        func = MacroParser.parse(`$$f`)[0] as DastFunctionMacro;
        nodes = [
            { type: "text", value: "hi there" },
            MacroParser.parse(`$$f`)[0] as DastFunctionMacro,
            { type: "text", value: "(foo)" },
            MacroParser.parse(`$$g`)[0] as DastFunctionMacro,
            { type: "text", value: "(bar)" },
        ];
        expect(filterPositionInfo(gobbleFunctionArguments(nodes)))
            .toMatchInlineSnapshot(`
              [
                {
                  "type": "text",
                  "value": "hi there",
                },
                {
                  "input": [
                    [
                      {
                        "type": "text",
                        "value": "foo",
                      },
                    ],
                  ],
                  "path": [
                    {
                      "index": [],
                      "name": "f",
                      "type": "pathPart",
                    },
                  ],
                  "type": "function",
                },
                {
                  "input": [
                    [
                      {
                        "type": "text",
                        "value": "bar",
                      },
                    ],
                  ],
                  "path": [
                    {
                      "index": [],
                      "name": "g",
                      "type": "pathPart",
                    },
                  ],
                  "type": "function",
                },
              ]
            `);

        // Nested functions
        func = MacroParser.parse(`$$f`)[0] as DastFunctionMacro;
        nodes = [
            { type: "text", value: "hi there" },
            MacroParser.parse(`$$f`)[0] as DastFunctionMacro,
            { type: "text", value: "(" },
            MacroParser.parse(`$$g`)[0] as DastFunctionMacro,
            { type: "text", value: "(bar))" },
        ];
        expect(filterPositionInfo(gobbleFunctionArguments(nodes)))
            .toMatchInlineSnapshot(`
              [
                {
                  "type": "text",
                  "value": "hi there",
                },
                {
                  "input": [
                    [
                      {
                        "input": [
                          [
                            {
                              "type": "text",
                              "value": "bar",
                            },
                          ],
                        ],
                        "path": [
                          {
                            "index": [],
                            "name": "g",
                            "type": "pathPart",
                          },
                        ],
                        "type": "function",
                      },
                    ],
                  ],
                  "path": [
                    {
                      "index": [],
                      "name": "f",
                      "type": "pathPart",
                    },
                  ],
                  "type": "function",
                },
              ]
            `);
    });
    it("Produces DAST trees with macros in them", () => {
        let source: string;

        source = `$x`;
        expect(filterPositionInfo(lezerToDast(source))).toMatchInlineSnapshot(`
          {
            "children": [
              {
                "attributes": {},
                "path": [
                  {
                    "index": [],
                    "name": "x",
                    "type": "pathPart",
                  },
                ],
                "type": "macro",
              },
            ],
            "sources": [
              "$x",
            ],
            "type": "root",
          }
        `);

        source = `<m>$x</m>`;
        expect(filterPositionInfo(lezerToDast(source))).toMatchInlineSnapshot(`
          {
            "children": [
              {
                "attributes": {},
                "children": [
                  {
                    "attributes": {},
                    "path": [
                      {
                        "index": [],
                        "name": "x",
                        "type": "pathPart",
                      },
                    ],
                    "type": "macro",
                  },
                ],
                "name": "m",
                "type": "element",
              },
            ],
            "sources": [
              "<m>$x</m>",
            ],
            "type": "root",
          }
        `);

        source = `$x.`;
        expect(filterPositionInfo(lezerToDast(source))).toMatchInlineSnapshot(`
          {
            "children": [
              {
                "attributes": {},
                "path": [
                  {
                    "index": [],
                    "name": "x",
                    "type": "pathPart",
                  },
                ],
                "type": "macro",
              },
              {
                "type": "text",
                "value": ".",
              },
            ],
            "sources": [
              "$x.",
            ],
            "type": "root",
          }
        `);

        source = `<m z="$x" />`;
        expect(filterPositionInfo(lezerToDast(source))).toMatchInlineSnapshot(`
          {
            "children": [
              {
                "attributes": {
                  "z": {
                    "children": [
                      {
                        "attributes": {},
                        "path": [
                          {
                            "index": [],
                            "name": "x",
                            "type": "pathPart",
                          },
                        ],
                        "type": "macro",
                      },
                    ],
                    "name": "z",
                    "type": "attribute",
                  },
                },
                "children": [],
                "name": "m",
                "type": "element",
              },
            ],
            "sources": [
              "<m z="$x" />",
            ],
            "type": "root",
          }
        `);

        source = `$x{y="$z"}`;
        expect(filterPositionInfo(lezerToDast(source))).toMatchInlineSnapshot(`
          {
            "children": [
              {
                "attributes": {
                  "y": {
                    "children": [
                      {
                        "attributes": {},
                        "path": [
                          {
                            "index": [],
                            "name": "z",
                            "type": "pathPart",
                          },
                        ],
                        "type": "macro",
                      },
                    ],
                    "name": "y",
                    "type": "attribute",
                  },
                },
                "path": [
                  {
                    "index": [],
                    "name": "x",
                    "type": "pathPart",
                  },
                ],
                "type": "macro",
              },
            ],
            "sources": [
              "$x{y="$z"}",
            ],
            "type": "root",
          }
        `);

        source = `$$f(x, y)`;
        expect(filterPositionInfo(lezerToDast(source))).toMatchInlineSnapshot(`
          {
            "children": [
              {
                "input": [
                  [
                    {
                      "type": "text",
                      "value": "x",
                    },
                  ],
                  [
                    {
                      "type": "text",
                      "value": "y",
                    },
                  ],
                ],
                "path": [
                  {
                    "index": [],
                    "name": "f",
                    "type": "pathPart",
                  },
                ],
                "type": "function",
              },
            ],
            "sources": [
              "$$f(x, y)",
            ],
            "type": "root",
          }
        `);
    });

    it("Produces DAST trees for function macros with element arguments", () => {
        let source: string;

        source = `$$f(<math>alpha</math>)`;
        expect(filterPositionInfo(lezerToDast(source))).toMatchInlineSnapshot(`
          {
            "children": [
              {
                "input": [
                  [
                    {
                      "attributes": {},
                      "children": [
                        {
                          "type": "text",
                          "value": "alpha",
                        },
                      ],
                      "name": "math",
                      "type": "element",
                    },
                  ],
                ],
                "path": [
                  {
                    "index": [],
                    "name": "f",
                    "type": "pathPart",
                  },
                ],
                "type": "function",
              },
            ],
            "sources": [
              "$$f(<math>alpha</math>)",
            ],
            "type": "root",
          }
        `);

        source = `$$f(x, <math>alpha</math>)`;
        expect(filterPositionInfo(lezerToDast(source))).toMatchInlineSnapshot(`
          {
            "children": [
              {
                "input": [
                  [
                    {
                      "type": "text",
                      "value": "x",
                    },
                  ],
                  [
                    {
                      "attributes": {},
                      "children": [
                        {
                          "type": "text",
                          "value": "alpha",
                        },
                      ],
                      "name": "math",
                      "type": "element",
                    },
                  ],
                ],
                "path": [
                  {
                    "index": [],
                    "name": "f",
                    "type": "pathPart",
                  },
                ],
                "type": "function",
              },
            ],
            "sources": [
              "$$f(x, <math>alpha</math>)",
            ],
            "type": "root",
          }
        `);

        source = `<p>$$f(x, <math>alpha</math>)</p>`;
        expect(filterPositionInfo(lezerToDast(source))).toMatchInlineSnapshot(`
          {
            "children": [
              {
                "attributes": {},
                "children": [
                  {
                    "input": [
                      [
                        {
                          "type": "text",
                          "value": "x",
                        },
                      ],
                      [
                        {
                          "attributes": {},
                          "children": [
                            {
                              "type": "text",
                              "value": "alpha",
                            },
                          ],
                          "name": "math",
                          "type": "element",
                        },
                      ],
                    ],
                    "path": [
                      {
                        "index": [],
                        "name": "f",
                        "type": "pathPart",
                      },
                    ],
                    "type": "function",
                  },
                ],
                "name": "p",
                "type": "element",
              },
            ],
            "sources": [
              "<p>$$f(x, <math>alpha</math>)</p>",
            ],
            "type": "root",
          }
        `);
    });
    it("Function macros can have balanced parens in their arguments", () => {
        let source: string;

        source = `$$f((x-2), 7)`;
        expect(filterPositionInfo(lezerToDast(source))).toMatchInlineSnapshot(`
          {
            "children": [
              {
                "input": [
                  [
                    {
                      "type": "text",
                      "value": "(",
                    },
                    {
                      "type": "text",
                      "value": "x-2",
                    },
                    {
                      "type": "text",
                      "value": ")",
                    },
                  ],
                  [
                    {
                      "type": "text",
                      "value": "7",
                    },
                  ],
                ],
                "path": [
                  {
                    "index": [],
                    "name": "f",
                    "type": "pathPart",
                  },
                ],
                "type": "function",
              },
            ],
            "sources": [
              "$$f((x-2), 7)",
            ],
            "type": "root",
          }
        `);

        source = `$$f((3,4), (5,6))`;
        expect(filterPositionInfo(lezerToDast(source))).toMatchInlineSnapshot(`
          {
            "children": [
              {
                "input": [
                  [
                    {
                      "type": "text",
                      "value": "(",
                    },
                    {
                      "type": "text",
                      "value": "3,4",
                    },
                    {
                      "type": "text",
                      "value": ")",
                    },
                  ],
                  [
                    {
                      "type": "text",
                      "value": "(",
                    },
                    {
                      "type": "text",
                      "value": "5,6",
                    },
                    {
                      "type": "text",
                      "value": ")",
                    },
                  ],
                ],
                "path": [
                  {
                    "index": [],
                    "name": "f",
                    "type": "pathPart",
                  },
                ],
                "type": "function",
              },
            ],
            "sources": [
              "$$f((3,4), (5,6))",
            ],
            "type": "root",
          }
        `);

        source = `$$f(1,(<math>alpha</math>))`;
        expect(filterPositionInfo(lezerToDast(source))).toMatchInlineSnapshot(`
          {
            "children": [
              {
                "input": [
                  [
                    {
                      "type": "text",
                      "value": "1",
                    },
                  ],
                  [
                    {
                      "type": "text",
                      "value": "(",
                    },
                    {
                      "attributes": {},
                      "children": [
                        {
                          "type": "text",
                          "value": "alpha",
                        },
                      ],
                      "name": "math",
                      "type": "element",
                    },
                    {
                      "type": "text",
                      "value": ")",
                    },
                  ],
                ],
                "path": [
                  {
                    "index": [],
                    "name": "f",
                    "type": "pathPart",
                  },
                ],
                "type": "function",
              },
            ],
            "sources": [
              "$$f(1,(<math>alpha</math>))",
            ],
            "type": "root",
          }
        `);

        source = `$$f(x, <math>alpha</math>)`;
        expect(filterPositionInfo(lezerToDast(source))).toMatchInlineSnapshot(`
          {
            "children": [
              {
                "input": [
                  [
                    {
                      "type": "text",
                      "value": "x",
                    },
                  ],
                  [
                    {
                      "attributes": {},
                      "children": [
                        {
                          "type": "text",
                          "value": "alpha",
                        },
                      ],
                      "name": "math",
                      "type": "element",
                    },
                  ],
                ],
                "path": [
                  {
                    "index": [],
                    "name": "f",
                    "type": "pathPart",
                  },
                ],
                "type": "function",
              },
            ],
            "sources": [
              "$$f(x, <math>alpha</math>)",
            ],
            "type": "root",
          }
        `);

        source = `$$f((x,y), <math>alpha</math>)`;
        expect(filterPositionInfo(lezerToDast(source))).toMatchInlineSnapshot(`
          {
            "children": [
              {
                "input": [
                  [
                    {
                      "type": "text",
                      "value": "(",
                    },
                    {
                      "type": "text",
                      "value": "x",
                    },
                    {
                      "type": "text",
                      "value": ",",
                    },
                    {
                      "type": "text",
                      "value": "y",
                    },
                    {
                      "type": "text",
                      "value": ")",
                    },
                  ],
                  [
                    {
                      "attributes": {},
                      "children": [
                        {
                          "type": "text",
                          "value": "alpha",
                        },
                      ],
                      "name": "math",
                      "type": "element",
                    },
                  ],
                ],
                "path": [
                  {
                    "index": [],
                    "name": "f",
                    "type": "pathPart",
                  },
                ],
                "type": "function",
              },
            ],
            "sources": [
              "$$f((x,y), <math>alpha</math>)",
            ],
            "type": "root",
          }
        `);
    });
    it("DAST trees with macros in them have correct position information", () => {
        let source: string;

        source = `$x`;
        expect(lezerToDast(source).children[0].position).toMatchInlineSnapshot(`
          {
            "end": {
              "column": 3,
              "line": 1,
              "offset": 2,
            },
            "start": {
              "column": 1,
              "line": 1,
              "offset": 0,
            },
          }
        `);

        source = `<p>$xx</p>`;
        expect(
            (lezerToDast(source).children[0] as DastElement).children[0]
                .position,
        ).toMatchInlineSnapshot(`
          {
            "end": {
              "column": 7,
              "line": 1,
              "offset": 6,
            },
            "start": {
              "column": 4,
              "line": 1,
              "offset": 3,
            },
          }
        `);
    });
    it("DAST trees with macros in them have correct position and row/col information", () => {
        let source: string;

        source = `<abc />\n\n$x`;
        let macro = lezerToDast(source).children[2] as DastMacro;
        expect(macro.position).toMatchInlineSnapshot(`
          {
            "end": {
              "column": 3,
              "line": 3,
              "offset": 11,
            },
            "start": {
              "column": 1,
              "line": 3,
              "offset": 9,
            },
          }
        `);
        expect(macro.path[0].position).toMatchInlineSnapshot(`
          {
            "end": {
              "column": 3,
              "line": 3,
              "offset": 11,
            },
            "start": {
              "column": 2,
              "line": 3,
              "offset": 10,
            },
          }
        `);
    });
    it("DAST trees with function macros in them have correct position and row/col information", () => {
        let source: string;

        source = `<abc />\n\n$$f(<abc />)`;
        let macro = lezerToDast(source).children[2] as DastFunctionMacro;
        expect(macro.position).toMatchInlineSnapshot(`
          {
            "end": {
              "column": 13,
              "line": 3,
              "offset": 21,
            },
            "start": {
              "column": 1,
              "line": 3,
              "offset": 9,
            },
          }
        `);
        expect(macro.path[0].position).toMatchInlineSnapshot(`
          {
            "end": {
              "column": 4,
              "line": 3,
              "offset": 12,
            },
            "start": {
              "column": 3,
              "line": 3,
              "offset": 11,
            },
          }
        `);
    });

    it("Position of text nodes in attributes should not include quotations", () => {
        let source: string;

        source = `<m a="bc" />`;
        let attrChildren = (lezerToDast(source).children[0] as DastElement)
            .attributes.a.children;

        expect(attrChildren[0].position).toMatchInlineSnapshot(`
          {
            "end": {
              "column": 9,
              "line": 1,
              "offset": 8,
            },
            "start": {
              "column": 7,
              "line": 1,
              "offset": 6,
            },
          }
        `);
    });

    it("Correct position of macros in attributes", () => {
        let source: string;

        source = `<m a="$c" />`;
        let attrChildren = (lezerToDast(source).children[0] as DastElement)
            .attributes.a.children;

        expect(attrChildren[0].position).toMatchInlineSnapshot(`
          {
            "end": {
              "column": 9,
              "line": 1,
              "offset": 8,
            },
            "start": {
              "column": 7,
              "line": 1,
              "offset": 6,
            },
          }
        `);
    });

    describe("elements inside index brackets", () => {
        /** The index contents of `$name`'s last path part, with positions dropped. */
        function indicesOf(source: string) {
            const dast = lezerToDast(source);
            const reference = dast.children.find(
                (n): n is DastMacro | DastFunctionMacro =>
                    n.type === "macro" || n.type === "function",
            );
            if (!reference) {
                return undefined;
            }
            const lastPart = reference.path[reference.path.length - 1];
            return filterPositionInfo(
                structuredClone(lastPart.index) as any,
            ) as any[];
        }

        /** The sibling nodes of a parse, with positions dropped. */
        function childrenOf(source: string) {
            return filterPositionInfo(lezerToDast(source) as any)
                .children as any[];
        }

        it("moves the element into the index and leaves no brackets behind", () => {
            // The shape from #1909. Everything the author wrote between the
            // brackets becomes the index, and no `[` or `]` survives as text.
            const source = `$myList[<indexOf target="100">$myList</indexOf>]`;
            expect(indicesOf(source)).toMatchObject([
                {
                    type: "index",
                    value: [{ type: "element", name: "indexOf" }],
                },
            ]);
            expect(childrenOf(source)).toHaveLength(1);
        });

        it("takes any element, not just the one the issue named", () => {
            for (const name of ["number", "math", "argMin"]) {
                expect(
                    indicesOf(`$myList[<${name}>1</${name}>]`),
                ).toMatchObject([{ value: [{ type: "element", name }] }]);
            }
        });

        it("takes mixed text and elements, as `$a[$k+2]` already did", () => {
            expect(indicesOf(`$a[1 + <n/>]`)).toMatchObject([
                {
                    value: [
                        { type: "text", value: "1 + " },
                        { type: "element", name: "n" },
                    ],
                },
            ]);
        });

        it("takes several indices in a row", () => {
            expect(indicesOf(`$a[<n/>][<m/>]`)).toMatchObject([
                { value: [{ type: "element", name: "n" }] },
                { value: [{ type: "element", name: "m" }] },
            ]);
        });

        it("attaches the index to the path part it follows", () => {
            const dast = lezerToDast(`$a.x[<n/>].y`);
            const reference = dast.children[0] as DastMacro;
            expect(reference.path.map((p) => p.name)).toEqual(["a", "x", "y"]);
            expect(reference.path[0].index).toHaveLength(0);
            expect(reference.path[1].index).toHaveLength(1);
            expect(reference.path[2].index).toHaveLength(0);
        });

        describe("carries the path on past the index", () => {
            // #1915. Everything after the `]` was emitted as plain text before
            // this pass ran, so the post-pass re-parses it with the grammar's
            // `MacroTail` entry point.

            /** The path of the first reference, as `name` plus its index count. */
            function pathOf(source: string) {
                const reference = lezerToDast(source).children.find(
                    (n): n is DastMacro | DastFunctionMacro =>
                        n.type === "macro" || n.type === "function",
                )!;
                return reference.path.map((p) => [p.name, p.index.length]);
            }

            /** What is left in the sibling array after the reference. */
            function tailTextOf(source: string) {
                return childrenOf(source)
                    .slice(1)
                    .map((n: any) => n.value ?? `<${n.name}>`)
                    .join("");
            }

            it("takes a property written after the index", () => {
                expect(pathOf(`$pts[<n/>].x`)).toEqual([
                    ["pts", 1],
                    ["x", 0],
                ]);
                expect(tailTextOf(`$pts[<n/>].x`)).toBe("");
            });

            it("takes a literal index written after the index", () => {
                expect(pathOf(`$a[<n/>][1]`)).toEqual([["a", 2]]);
                expect(indicesOf(`$a[<n/>][1]`)).toMatchObject([
                    { value: [{ type: "element", name: "n" }] },
                    { value: [{ type: "text", value: "1" }] },
                ]);
            });

            it("alternates with further element indices", () => {
                expect(pathOf(`$a[<n/>].x[2].y[<m/>]`)).toEqual([
                    ["a", 1],
                    ["x", 1],
                    ["y", 1],
                ]);
            });

            it("leaves an element index to the gobbling loop, not the tail", () => {
                // `$a[<n/>][<m/>]` has nothing the tail can claim — it stops at
                // the element — so the behaviour predating #1915 is unchanged.
                expect(pathOf(`$a[<n/>][<m/>]`)).toEqual([["a", 2]]);
            });

            it("stops where the text stops being a path", () => {
                expect(tailTextOf(`$a[<n/>].x is the answer`)).toBe(
                    " is the answer",
                );
                expect(pathOf(`$a[<n/>].x is the answer`)).toEqual([
                    ["a", 1],
                    ["x", 0],
                ]);
            });

            it("claims nothing a bare path would not have claimed", () => {
                for (const source of [
                    // A space ends a reference, as it does for `$a .x`.
                    `$a[<n/>] .x`,
                    // `SimplePathPart` wants the name against the dot.
                    `$a[<n/>]. x`,
                    // Nothing here is path syntax at all.
                    `$a[<n/>]text`,
                ]) {
                    expect(pathOf(source)).toEqual([["a", 1]]);
                }
            });

            it("leaves an unbalanced bracket alone after claiming what it can", () => {
                expect(pathOf(`$a[<n/>].x[unbalanced`)).toEqual([
                    ["a", 1],
                    ["x", 0],
                ]);
                expect(tailTextOf(`$a[<n/>].x[unbalanced`)).toBe("[unbalanced");
            });

            it("is not attempted when no index was claimed", () => {
                // `$(x)` has already closed the path, so the brackets stay
                // literal and there is nothing for a tail to continue.
                expect(pathOf(`$(x)[<n/>].y`)).toEqual([["x", 0]]);
            });

            it("takes a brace block on a reference but not on a function reference", () => {
                // `$a[1]{z}` swallows the braces and `$$f[1]{z}` does not,
                // because `FunctionMacro` has no `PropAttrs`. The tail has to
                // keep that difference.
                const macro = lezerToDast(`$a[<n/>]{z}`)
                    .children[0] as DastMacro;
                expect(Object.keys(macro.attributes)).toEqual(["z"]);
                expect(tailTextOf(`$a[<n/>]{z}`)).toBe("");

                expect(tailTextOf(`$$f[<n/>]{z}`)).toBe("{z}");
            });

            it("reports the position of what it claimed", () => {
                // The language server reads these, and a tail parsed on a later
                // line that reports line 1 is the failure that would show up
                // there. The offsets come from the document-wide map, not from
                // the fragment the tail was parsed out of.
                const source = `<p>\n  ignore me\n  $pts[<n/>].x\n</p>`;
                const p = lezerToDast(source).children[0] as DastElement;
                const reference = p.children.find(
                    (n): n is DastMacro => n.type === "macro",
                )!;
                const property = reference.path[1];
                expect(property.name).toBe("x");
                expect(property.position?.start).toMatchObject({
                    line: 3,
                    column: 14,
                    offset: source.indexOf(".x") + 1,
                });
                // The reference itself now runs to the end of the property.
                expect(reference.position?.end.offset).toBe(
                    source.indexOf(".x") + 2,
                );
            });

            it("round-trips back to the source it was written as", () => {
                for (const source of [
                    `$pts[<n />].x`,
                    `$a[<n />][1]`,
                    `$a[<n />].x[2].y[<m />]`,
                ]) {
                    expect(toXml(lezerToDast(source))).toEqual(source);
                }
            });
        });

        it("is not confused by brackets written inside the element", () => {
            // `x[1]` is in `<b>`'s own children, so it never reaches the sibling
            // array where the bracket depth is counted.
            expect(indicesOf(`$a[<b>x[1]</b>]`)).toMatchObject([
                {
                    value: [
                        {
                            type: "element",
                            name: "b",
                            children: [{ type: "text", value: "x[1]" }],
                        },
                    ],
                },
            ]);
        });

        it("round-trips back to the source it was written as", () => {
            for (const source of [
                `$myList[<indexOf target="100">$myList</indexOf>]`,
                // Self-closing tags come back spaced, which is the printer's
                // own style and not something the index changes.
                `$a[<n />][<m />]`,
                `$a[1 + <n />]`,
            ]) {
                expect(toXml(lezerToDast(source))).toEqual(source);
            }
        });

        describe("leaves alone", () => {
            it("a bracket the reference does not touch", () => {
                // A space means the macro parser already declined the bracket,
                // and so do we.
                expect(childrenOf(`$a [<n/>]`)).toMatchObject([
                    { type: "macro" },
                    { type: "text", value: " [" },
                    { type: "element", name: "n" },
                    { type: "text", value: "]" },
                ]);
            });

            it("brackets in prose, which keep their single text node", () => {
                expect(childrenOf(`see [1] here`)).toMatchObject([
                    { type: "text", value: "see [1] here" },
                ]);
            });

            it("the span of prose holding a character reference", () => {
                // Declining the brackets has to give the text back as it was,
                // span included. Two passes split this array on brackets and
                // merge it again, and the second of them works on text the
                // first already merged — text whose value is shorter than the
                // source it came from, since `&amp;` is five characters of one.
                // The split used to end such a node where its *characters* ran
                // out, four short, in the middle of the entity.
                for (const source of [
                    `<p>$a[ and X &amp; Y]</p>`,
                    `<p>$a[ oops. Rates &amp; fees [here]</p>`,
                ]) {
                    const paragraph = lezerToDast(source)
                        .children[0] as DastElement;
                    const text = paragraph.children[1] as DastText;
                    expect(text.type).toEqual("text");
                    expect(
                        source.slice(
                            text.position!.start.offset,
                            text.position!.end.offset,
                        ),
                    ).toEqual(source.slice(5, source.indexOf("</p>")));
                }
            });

            it("a reference already closed by braces or parens", () => {
                // The DAST-level counterparts of the grammar assertions in
                // `macro-parse.test.ts` for `$x{z}[5]` and `$(x)[1]`. `$x{…}`
                // carries no meaning in v0.7 — the flattener drops a
                // reference's attributes — but it still parses, so the shape
                // still has to be declined rather than claimed.
                for (const source of [`$x{z}[<n/>]`, `$(x)[<n/>]`]) {
                    expect(indicesOf(source)).toHaveLength(0);
                    expect(childrenOf(source)).toMatchObject([
                        { type: "macro" },
                        { type: "error", error_type: "warning" },
                        { type: "text", value: "[" },
                        { type: "element", name: "n" },
                        { type: "text", value: "]" },
                    ]);
                }
            });

            it("a function reference already closed by its arguments", () => {
                // `$$f[1](y)` is how the grammar spells an indexed function
                // reference, so `$$f(1)[…]` has ended before the brackets — the
                // same as `$(x)[…]`, but the remedy is the opposite one, and
                // the reference has to be quoted back with both its `$`s.
                const children = childrenOf(`$$f(1)[<n/>]`);
                expect(children).toMatchObject([
                    { type: "function" },
                    {
                        type: "error",
                        error_type: "warning",
                        args: { name: "$$f", reason: "arguments" },
                    },
                    { type: "text", value: "[" },
                    { type: "element", name: "n" },
                    { type: "text", value: "]" },
                ]);
            });

            it("a bracket group with no element in it", () => {
                // Nothing here the macro parser had not already decided about.
                expect(childrenOf(`$x{z}[5]`)).toMatchObject([
                    { type: "macro" },
                    { type: "text", value: "[5]" },
                ]);
                expect(indicesOf(`$a[1]`)).toMatchObject([
                    { value: [{ type: "text", value: "1" }] },
                ]);
            });

            it("a bracket group holding a parse error", () => {
                // The stray closing tag leaves an `error` node between the
                // brackets. An index's `value` has no room for one — carried
                // in, it is a deserialization failure in the core rather than
                // the diagnostic the author needs — so the group is declined
                // and the error stays in the sibling array where it can still
                // be reported.
                const source = `$a[<n/> </badclose>]`;
                expect(indicesOf(source)).toHaveLength(0);
                expect(childrenOf(source)).toMatchObject([
                    { type: "macro" },
                    { type: "text", value: "[" },
                    { type: "element", name: "n" },
                    { type: "text", value: " " },
                    { type: "error" },
                    { type: "text", value: "]" },
                ]);
            });

            it("an unclosed bracket, but says so", () => {
                expect(indicesOf(`$a[<n/>`)).toHaveLength(0);
                expect(childrenOf(`$a[<n/>`)).toMatchObject([
                    { type: "macro" },
                    { type: "error", error_type: "warning" },
                    { type: "text", value: "[" },
                    { type: "element", name: "n" },
                ]);
            });
        });

        it("takes an index on a function reference that is then called", () => {
            // `$$fs[<n/>](3)` picks which of the functions in `fs` to call, the
            // same question `$$fs[1](3)` asks, so the index is taken and the
            // call is built on top of it.
            expect(indicesOf(`$$f[<n/>](y)`)).toMatchObject([
                { value: [{ type: "element", name: "n" }] },
            ]);
            const reference = lezerToDast(`$$f[<n/>](y)`)
                .children[0] as DastFunctionMacro;
            expect(reference.input).not.toBe(null);
            expect(reference.input![0]).toMatchObject([
                { type: "text", value: "y" },
            ]);
            // Nothing of the call survives as text beside it.
            expect(
                childrenOf(`$$f[<n/>](y)`).some(
                    (n: any) => n.type === "text" || n.type === "error",
                ),
            ).toBe(false);

            // An opening paren with no closing one is not a call, so the
            // reference keeps its index and the `(` stays text.
            for (const source of [`$$f[<n/>](`, `$$f[<n/>]( y`]) {
                expect(indicesOf(source)).toMatchObject([
                    { value: [{ type: "element", name: "n" }] },
                ]);
                expect(
                    childrenOf(source).some((n: any) => n.type === "error"),
                ).toBe(false);
            }

            // An empty argument list is still a call, and still follows an index.
            const empty = lezerToDast(`$$f[<n/>]()`)
                .children[0] as DastFunctionMacro;
            expect(empty.path[0].index).toHaveLength(1);
            expect(empty.input).not.toBe(null);

            // Two indices in a row, then the call.
            const twoIndices = lezerToDast(`$$f[<n/>][<m/>](y)`)
                .children[0] as DastFunctionMacro;
            expect(twoIndices.path[0].index).toHaveLength(2);
            expect(twoIndices.input).not.toBe(null);
        });

        it("keeps a warning about the brackets' own contents out of the index", () => {
            // `$a[$(x)[<n/>]]`: the outer group holds no error when the guard
            // runs, but processing its contents mints one for the declined inner
            // reference. An index's value admits no error node — it reaches Rust
            // as a variant that does not exist and fails the document — so the
            // warning belongs in the sibling array instead.
            for (const source of [`$a[$(x)[<n/>]]`, `$a[$x{z}[<n/>]]`]) {
                const index = indicesOf(source);
                expect(index).toHaveLength(1);
                expect(
                    index![0].value.some((n: any) => n.type === "error"),
                ).toBe(false);
                // ...and it is still reported, next to the reference.
                expect(
                    childrenOf(source).some((n: any) => n.type === "error"),
                ).toBe(true);
            }
        });

        it("names what actually closed the path, whatever follows the brackets", () => {
            // A closed path stays closed however the source continues, so a
            // trailing call must not relabel it: `$$(f)[…](y)` is still a
            // parenthesized path and `$$f(1)[…](y)` is still an argument list.
            const reasonFor = (source: string) =>
                (childrenOf(source).find((n: any) => n.type === "error") as any)
                    ?.args?.reason;

            expect(reasonFor(`$$(f)[<n/>](y)`)).toBe("parensFunction");
            expect(reasonFor(`$$f(1)[<n/>](y)`)).toBe("arguments");
            // An otherwise-open function path is not reported at all: the index
            // is taken, and the call is built on top of it.
            expect(reasonFor(`$$f[<n/>](y)`)).toBe(undefined);
            // And the same shapes without the trailing call are unchanged.
            expect(reasonFor(`$$(f)[<n/>]`)).toBe("parensFunction");
            expect(reasonFor(`$$f(1)[<n/>]`)).toBe("arguments");
        });

        it("reports an index after arguments that hold an element", () => {
            // `$$f(<n/>)[<m/>]` said nothing at all. Indices are gobbled before
            // function arguments, so at that point the reference is followed by
            // `(` rather than `[` and the first pass cannot see the brackets;
            // `$$f(1)[<m/>]`, whose arguments the grammar itself parsed, warned
            // normally. A second pass after the arguments are gobbled closes the
            // gap, and both now give the same reason (#1915).
            const reasonFor = (source: string) =>
                (childrenOf(source).find((n: any) => n.type === "error") as any)
                    ?.args?.reason;

            expect(reasonFor(`$$f(<n/>)[<m/>]`)).toBe("arguments");
            expect(reasonFor(`$$f(<n/>)[<m/>](y)`)).toBe("arguments");
            // An element *index* hides the argument list from the grammar just
            // as an element argument does, so `$$fs[<n/>](3)[<m/>]` is out of
            // the first pass's reach too and has to give the same reason its
            // written-out spelling `$$fs[1](3)[<m/>]` gives.
            expect(reasonFor(`$$fs[<n/>](3)[<m/>]`)).toBe("arguments");
            expect(reasonFor(`$$fs[1](3)[<m/>]`)).toBe("arguments");
            // Exactly one warning: the second pass must not repeat what the
            // first already said about a grammar-parsed argument list.
            for (const source of [
                `$$f(1)[<m/>]`,
                `$$f(<n/>)[<m/>]`,
                `$$fs[<n/>](3)[<m/>]`,
                `$x{z}[<n/>]`,
                `$(x)[<n/>]`,
            ]) {
                expect(
                    childrenOf(source).filter((n: any) => n.type === "error"),
                ).toHaveLength(1);
            }
            // And an element argument with no brackets after it stays quiet.
            expect(
                childrenOf(`$$f(<n/>)`).some((n: any) => n.type === "error"),
            ).toBe(false);
        });

        it("reports those same shapes when they are written inside an index", () => {
            // The contents of a bracket group are parsed by the same passes the
            // top level gets, so a reference written in there has to report what
            // it would report anywhere else. Only the two shapes above are at
            // risk: every other reason is settled by the first pass, which the
            // brackets always got. The warning comes back to the sibling array
            // rather than into the index, as `keeps a warning about the
            // brackets' own contents out of the index` describes.
            const reasonFor = (source: string) =>
                (childrenOf(source).find((n: any) => n.type === "error") as any)
                    ?.args?.reason;

            for (const [inner, reason] of [
                [`$$f(<n/>)[<m/>]`, "arguments"],
                [`$$fs[<n/>](3)[<m/>]`, "arguments"],
                // Controls, settled by the first pass and already reported.
                [`$$f(1)[<n/>]`, "arguments"],
                [`$(x)[<n/>]`, "parens"],
            ] as const) {
                expect(reasonFor(`$L[${inner}]`)).toBe(reason);
                expect(
                    childrenOf(`$L[${inner}]`).filter(
                        (n: any) => n.type === "error",
                    ),
                ).toHaveLength(1);
            }
        });

        it("reports those same shapes when they are written as a function argument", () => {
            // `gobbleFunctionArguments` moves an argument out of the sibling
            // array into `input`, where a pass that walks siblings cannot
            // follow — so the two shapes only the third pass can see were
            // silent there, while every other reason was reported normally
            // because the first pass saw those brackets while they were still
            // siblings.
            const reasonsIn = (source: string) => {
                const reasons: string[] = [];
                const walk = (node: any) => {
                    if (Array.isArray(node)) {
                        return node.forEach(walk);
                    }
                    if (node && typeof node === "object") {
                        if (node.type === "error") {
                            reasons.push(node.args?.reason);
                        }
                        for (const value of Object.values(node)) {
                            if (value && typeof value === "object") {
                                walk(value);
                            }
                        }
                    }
                };
                walk(lezerToDast(source));
                return reasons;
            };

            expect(reasonsIn(`$$g($$f(<n/>)[<m/>])`)).toEqual(["arguments"]);
            expect(reasonsIn(`$$g($$fs[<n/>](3)[<m/>])`)).toEqual([
                "arguments",
            ]);
            // Nested arguments reach it too, and report once.
            expect(reasonsIn(`$$h($$g($$f(<n/>)[<m/>]))`)).toEqual([
                "arguments",
            ]);
            // The reasons the first pass settles were never affected, and must
            // not now be reported twice.
            expect(reasonsIn(`$$g($(x)[<n/>], $a{z}[<n/>])`)).toEqual([
                "parens",
                "braces",
            ]);
            // An index that is claimed says nothing, inside an argument list as
            // anywhere else.
            for (const source of [`$$g($a[<n/>])`, `$$g(1, 2)`]) {
                expect(reasonsIn(source)).toEqual([]);
            }
        });

        it("reports an unclosed bracket whose element is not the first thing in it", () => {
            // `$a[1 + <n/>` is the unclosed spelling of a mixed-content index
            // that is claimed when it closes, so it warns like the simple one.
            for (const source of [`$a[<n/>`, `$a[1 + <n/>`]) {
                expect(childrenOf(source).slice(0, 2)).toMatchObject([
                    { type: "macro" },
                    { type: "error", error_type: "warning" },
                ]);
            }
            // Still nothing to say when no element is involved at all.
            expect(
                childrenOf(`$a[1 + 2`).some((n: any) => n.type === "error"),
            ).toBe(false);
        });

        it("keeps a comment written in the brackets, so formatting is not destructive", () => {
            // The pretty-printer formats the parser's own output, so dropping the
            // comment here would delete it from the author's document. It is
            // removed in normalization instead, which is what the core sees.
            const source = `$a[<!-- c --><number>2</number>]`;
            expect(indicesOf(source)).toMatchObject([
                {
                    value: [
                        { type: "comment" },
                        { type: "element", name: "number" },
                    ],
                },
            ]);
            expect(toXml(lezerToDast(source))).toEqual(source);
        });

        it("reports a bracket's position from the line it is actually on", () => {
            // `splitTextNodeAt` carries the text node's start column into every
            // piece it cuts. Past a newline the column restarts from 1, so
            // carrying it puts the bracket that many characters too far right —
            // and `attachIndex` copies it into the index and the reference.
            const reference = (
                lezerToDast(`<p>$a[<n/>\n  ]</p>`).children[0] as any
            ).children[0];
            expect(reference.position.end).toMatchObject({
                line: 2,
                column: 4,
            });
        });

        it("grows the reference's position over the moved element", () => {
            // `sourceLocation.ts` in the worker quotes a reference by spanning
            // its path parts' positions, so the path part has to grow too.
            const source = `$a[<n/>]`;
            const reference = lezerToDast(source).children[0] as DastMacro;
            expect(reference.position!.end.offset).toBe(source.length);
            expect(reference.path[0].position!.end.offset).toBe(source.length);
        });
    });
});
