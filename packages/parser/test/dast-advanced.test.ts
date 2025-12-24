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
});
