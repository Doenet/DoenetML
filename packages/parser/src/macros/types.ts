export interface ParseOptions {
    filename?: string;
    startRule?: "start";
    tracer?: any;
    [key: string]: any;
}
export type ParseFunction = <Options extends ParseOptions>(
    input: string,
    options?: Options,
) => Options extends { startRule: infer StartRule }
    ? StartRule extends "start"
        ? Top
        : Top
    : Top;

// These types were autogenerated by ts-pegjs
export type Top = (Macro | FunctionMacro | Text)[];
export type SimpleIdent = string;
export type Ident = string;
export type SimplePathPart = {
    type: "pathPart";
    name: SimpleIdent;
    index: PropIndex[];
} & {
    position: {
        start: { offset: number; line: number; column: number };
        end: { offset: number; line: number; column: number };
    };
};
export type PathPart = { type: "pathPart"; name: Ident; index: PropIndex[] } & {
    position?: {
        start: { offset: number; line: number; column: number };
        end: { offset: number; line: number; column: number };
    };
};
export type SimplePath = [SimplePathPart, ...SimplePathPart[]];
export type Path = [PathPart, ...PathPart[]];
export type Macro =
    | (FullAddressMacro & {
          position?: {
              start: { offset: number; line: number; column: number };
              end: { offset: number; line: number; column: number };
          };
      })
    | (SimpleAddressMacro & {
          position?: {
              start: { offset: number; line: number; column: number };
              end: { offset: number; line: number; column: number };
          };
      });
export type SimpleAddressMacro = {
    type: "macro";
    path: SimplePath;
    attributes: PropAttrs;
} & {
    position?: {
        start: { offset: number; line: number; column: number };
        end: { offset: number; line: number; column: number };
    };
};
export type FullAddressMacro = {
    type: "macro";
    path: Path;
    attributes: PropAttrs;
} & {
    position?: {
        start: { offset: number; line: number; column: number };
        end: { offset: number; line: number; column: number };
    };
};
export type FunctionMacro =
    | ({ type: "function"; path: Path; input: FunctionInput | null } & {
          position: {
              start: { offset: number; line: number; column: number };
              end: { offset: number; line: number; column: number };
          };
      })
    | ({ type: "function"; path: SimplePath; input: FunctionInput | null } & {
          position: {
              start: { offset: number; line: number; column: number };
              end: { offset: number; line: number; column: number };
          };
      });
export type FunctionInput = FunctionArgumentList;
export type FunctionArgumentList = [
    BalancedParenTextNoComma,
    ...BalancedParenTextNoComma[],
];
export type BalancedParenTextNoComma =
    | ((
          | Macro
          | FunctionMacro
          | TextWithoutParenOrComma
          | [OpenParen, ...BalancedParenText, CloseParen]
      )[] extends (infer InnerArr)[]
          ? InnerArr extends (infer InnerArr)[]
              ? InnerArr
              : InnerArr
          : (
                | Macro
                | FunctionMacro
                | TextWithoutParenOrComma
                | [OpenParen, ...BalancedParenText, CloseParen]
            )[])[]
    | [EmptyString];
export type BalancedParenText = (Macro | FunctionMacro | Text)[];
export type PropAttrs = { [k: string]: Attr };
export type PropIndex = {
    type: "index";
    value: (FunctionMacro | Macro | TextWithoutClosingSquareBrace)[];
} & {
    position?: {
        start: { offset: number; line: number; column: number };
        end: { offset: number; line: number; column: number };
    };
};
export type Attr =
    | ({ type: "attribute"; name: AttrName; children: AttrValue } & {
          position: {
              start: { offset: number; line: number; column: number };
              end: { offset: number; line: number; column: number };
          };
      })
    | ({ type: "attribute"; name: AttrName; children: [] } & {
          position: {
              start: { offset: number; line: number; column: number };
              end: { offset: number; line: number; column: number };
          };
      });
export type AttrName = string;
export type AttrValue =
    | (Macro | FunctionMacro | TextWithoutDoubleQuote)[]
    | (Macro | FunctionMacro | TextWithoutQuote)[];
export type Text = { type: "text"; value: string } & {
    position: {
        start: { offset: number; line: number; column: number };
        end: { offset: number; line: number; column: number };
    };
};
export type EmptyString = { type: "text"; value: "" } & {
    position: {
        start: { offset: number; line: number; column: number };
        end: { offset: number; line: number; column: number };
    };
};
export type OpenParen = { type: "text"; value: "(" } & {
    position: {
        start: { offset: number; line: number; column: number };
        end: { offset: number; line: number; column: number };
    };
};
export type CloseParen = { type: "text"; value: ")" } & {
    position: {
        start: { offset: number; line: number; column: number };
        end: { offset: number; line: number; column: number };
    };
};
export type TextWithoutParenOrComma = { type: "text"; value: string } & {
    position: {
        start: { offset: number; line: number; column: number };
        end: { offset: number; line: number; column: number };
    };
};
export type TextWithoutParen = { type: "text"; value: string } & {
    position: {
        start: { offset: number; line: number; column: number };
        end: { offset: number; line: number; column: number };
    };
};
export type TextWithoutQuote = { type: "text"; value: string } & {
    position: {
        start: { offset: number; line: number; column: number };
        end: { offset: number; line: number; column: number };
    };
};
export type TextWithoutClosingSquareBrace = { type: "text"; value: string } & {
    position: {
        start: { offset: number; line: number; column: number };
        end: { offset: number; line: number; column: number };
    };
};
export type TextWithoutDoubleQuote = { type: "text"; value: string } & {
    position: {
        start: { offset: number; line: number; column: number };
        end: { offset: number; line: number; column: number };
    };
};
export type _ = string;
export type EOF = undefined;
