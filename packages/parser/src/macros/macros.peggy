{
    function withPosition<const T>(node: T) {
        const { start, end } = location();
        return { ...node, position: { start, end } };
    }
}

top = (Macro / FunctionMacro / Text)*

// Identifiers. Scoped identifiers can only be used inside of `$(..)` notation.
Ident = $[a-zA-Z0-9_]+

ScopedIdent = $[a-zA-Z0-9_-]+

// A PathPart cannot have slashes or `..` in it
PathPart
    = name:Ident index:PropIndex* {
            return withPosition({ type: "pathPart", name, index });
        }

ScopedPathPart
    = name:ScopedIdent index:PropIndex* {
            return withPosition({ type: "pathPart", name, index });
        }

// A FullPath can have slashes and `..` in it. It may also start with a slash.
EmptyPathPart
    = "" { return withPosition({ type: "pathPart", name: "", index: [] }); }

FullPath
    = start:EmptyPathPart rest:("/" @ScopedPathPartOrDD)+ {
            return [start, ...rest];
        }
    / start:ScopedPathPartOrDD rest:("/" @ScopedPathPartOrDD)* {
            return [start, ...rest];
        }

ScopedPathPartOrDD
    = ScopedPathPart
    / ".." { return withPosition({ type: "pathPart", name: "..", index: [] }); }

// Pops can be accessed with a `.`
PropAccess = "." @PartialPathMacro

ScopedPropAccess = "." @ScopedPartialPathMacro

//
// Macros
//
Macro
    = "$" "(" macro:FullPathMacro ")" { return withPosition(macro) }
    / "$" macro:PartialPathMacro { return withPosition(macro) }

// A macro where the path cannot have slashes or `..` in it.
PartialPathMacro
    = path:PathPart attrs:PropAttrs? accessedProp:PropAccess? {
            return withPosition({
                type: "macro",
                path: [path],
                attributes: attrs || [],
                accessedProp,
            });
        }

ScopedPartialPathMacro
    = path:ScopedPathPart attrs:PropAttrs? accessedProp:ScopedPropAccess? {
            return withPosition({
                type: "macro",
                path: [path],
                attributes: attrs || [],
                accessedProp,
            });
        }

// A macro where the path can have slashes and `..` in it.
FullPathMacro
    = path:FullPath attrs:PropAttrs? accessedProp:ScopedPropAccess? {
            return withPosition({
                type: "macro",
                path,
                attributes: attrs || [],
                accessedProp,
            });
        }

//
// Functions
//

// Functions are very similar to macros except they cannot have attrs or accessedProps
// but they do take comma-separated arguments.
FunctionMacro
    = "$$" "(" macro:FullPathMacro ")" input:FunctionInput? {
            return withPosition({
                type: "function",
                macro,
                input,
            });
        }
    / "$$" macro:PartialPathMacro input:FunctionInput? {
            return withPosition({
                type: "function",
                macro,
                input,
            });
        }

FunctionInput = "(" _? @FunctionArgumentList _? ")"

FunctionArgumentList
    = start:FunctionArgument rest:(_? "," _? @FunctionArgument)* {
            return [start, ...rest];
        }

// A function argument cannot contain commas unless those commas are inside of balanced parens.
// For example `$$f( (0,1) )` should be parsed as a function with a single argument.
FunctionArgument = BalancedParenTextNoComma

BalancedParenTextNoComma
    = x:(
        Macro
        / FunctionMacro
        / TextWithoutParenOrComma
        / a:OpenParen rest:BalancedParenText b:CloseParen {
                return [a, ...rest, b];
            }
    )* { return x.flat(); }
    / x:EmptyString { return [x]; }

BalancedParenText
    = x:(
        Macro
        / FunctionMacro
        / TextWithoutParen
        / a:OpenParen rest:BalancedParenText b:CloseParen {
                return [a, ...rest, b];
            }
    )* { return x.flat(); }
    / x:EmptyString { return [x]; }

PropAttrs = "{" _? @(@Attr _?)* "}"

PropIndex
    = "[" _? value:(@(FunctionMacro / Macro / TextWithoutClosingSquareBrace) _?)* "]" {
            return withPosition({ type: "index", value });
        }

// Attribute stuff
Attr
    = name:AttrName _? "=" _? children:AttrValue {
            return withPosition({ type: "attribute", name, children });
        }
    / name:AttrName {
            return withPosition({
                type: "attribute",
                name,
                children: [],
            });
        }

AttrName = $[a-zA-Z0-9_:-]+

AttrValue
    = "\"" @(Macro / FunctionMacro / TextWithoutDoubleQuote)* "\""
    / "'" @(Macro / FunctionMacro / TextWithoutQuote)* "'"

// Different types of text with various restrictions
Text = value:($[^$]+ / .) { return withPosition({ type: "text", value }); }

EmptyString
    = "" {
            return withPosition({
                type: "text",
                value: "",
            });
        }

OpenParen = "(" { return withPosition({ type: "text", value: "(" }); }

CloseParen = ")" { return withPosition({ type: "text", value: ")" }); }

TextWithoutParenOrComma
    = value:($[^(),$]+ / [^(),]) {
            return withPosition({ type: "text", value });
        }

TextWithoutParen
    = value:($[^()$]+ / [^()]) { return withPosition({ type: "text", value }); }

TextWithoutQuote
    = value:$([^'$]+ / [^']) { return withPosition({ type: "text", value }); }

TextWithoutClosingSquareBrace
    = value:$([^\]$]+ / [^\]]) { return withPosition({ type: "text", value }); }

TextWithoutDoubleQuote
    = value:($[^"$]+ / [^"]) { return withPosition({ type: "text", value }); }

_ = $[ \t\r\n]+

EOF = !.
