import { describe, expect, it } from "vitest";
import { lezerToDast } from "../src/lezer-to-dast";
import util from "util";
import { filterPositionInfo } from "../src/dast-to-xml/utils";
import {
    DastElement,
    DastFunctionMacro,
    DastMacro,
    DastRootContent,
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
            const macro = dast.children.find(
                (n): n is DastMacro | DastFunctionMacro =>
                    n.type === "macro" || n.type === "function",
            );
            if (!macro) {
                return undefined;
            }
            const lastPart = macro.path[macro.path.length - 1];
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
            const macro = dast.children[0] as DastMacro;
            expect(macro.path.map((p) => p.name)).toEqual(["a", "x"]);
            expect(macro.path[0].index).toHaveLength(0);
            expect(macro.path[1].index).toHaveLength(1);
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

            it("a function macro already closed by its arguments", () => {
                // `$$f[1](y)` is how the grammar spells an indexed function
                // macro, so `$$f(1)[…]` has ended before the brackets — the
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

        it("declines an index on a function reference that is then called", () => {
            // `$$f[1](y)` parses, but the worker cannot build a component-valued
            // index on a reference it then calls. Claiming these brackets would
            // route an author into a thrown `Found a duplicate componentIdx`
            // where before they rendered as literal text, so they stay literal.
            expect(indicesOf(`$$f[<n/>](y)`)).toHaveLength(0);
            const children = childrenOf(`$$f[<n/>](y)`);
            expect(children.slice(0, 4)).toMatchObject([
                { type: "function" },
                { type: "error", error_type: "warning" },
                { type: "text", value: "[" },
                { type: "element", name: "n" },
            ]);
            // The call is left as written. `gobbleFunctionArguments` splits on
            // its own delimiters, so the tail arrives as several text nodes.
            expect(
                children
                    .slice(4)
                    .map((n: any) => n.value)
                    .join(""),
            ).toBe("](y)");
            expect((children[0] as any).input).toBe(null);
            // Uncalled, the same index is taken.
            expect(indicesOf(`$$f[<n/>]`)).toMatchObject([
                { value: [{ type: "element", name: "n" }] },
            ]);
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
            // Only an otherwise-open function path is `called`.
            expect(reasonFor(`$$f[<n/>](y)`)).toBe("called");
            // And the same shapes without the trailing call are unchanged.
            expect(reasonFor(`$$(f)[<n/>]`)).toBe("parensFunction");
            expect(reasonFor(`$$f(1)[<n/>]`)).toBe("arguments");
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
            const macro = (
                lezerToDast(`<p>$a[<n/>\n  ]</p>`).children[0] as any
            ).children[0];
            expect(macro.position.end).toMatchObject({ line: 2, column: 4 });
        });

        it("grows the reference's position over the moved element", () => {
            // `sourceLocation.ts` in the worker quotes a reference by spanning
            // its path parts' positions, so the path part has to grow too.
            const source = `$a[<n/>]`;
            const macro = lezerToDast(source).children[0] as DastMacro;
            expect(macro.position!.end.offset).toBe(source.length);
            expect(macro.path[0].position!.end.offset).toBe(source.length);
        });
    });
});
