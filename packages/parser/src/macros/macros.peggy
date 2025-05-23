{
    function withPosition<const T>(node: T) {
        const { start, end } = location();
        return { ...node, position: { start, end } };
    }
}

top = (Macro / FunctionMacro / Text)*

// Identifiers. Scoped identifiers can only be used inside of `$(..)` notation.
SimpleIdent = $([a-zA-Z_] [a-zA-Z0-9_]*)

Ident = $[a-zA-Z0-9_-]+

// A PathPart is an identifier followed by some amount of indexing
SimplePathPart
    = name:SimpleIdent index:PropIndex* {
            return withPosition({ type: "pathPart", name, index });
        }

PathPart
    = name:Ident index:PropIndex* {
            return withPosition({ type: "pathPart", name, index });
        }

// A full path looks like `foo.bar[1][3].baz`. Attributes are not allowed to be assigned to a FullPath
SimplePath
    = start:SimplePathPart rest:("." @SimplePathPart)* {
            return [start, ...rest];
        }

Path
    = start:PathPart rest:("." @PathPart)* {
            return [start, ...rest];
        }

//
// Macros
//
Macro
    = "$" "(" macro:FullAddressMacro ")" { return withPosition(macro) }
    / "$" macro:SimpleAddressMacro { return withPosition(macro) }


// A macro where the path can have slashes and `..` in it.
SimpleAddressMacro
    = path:SimplePath attrs:PropAttrs? {
            return withPosition({
                type: "macro",
                path,
                attributes: attrs || {},
            });
        }
FullAddressMacro
    = path:Path attrs:PropAttrs? {
            return withPosition({
                type: "macro",
                path,
                attributes: attrs || {},
            });
        }

//
// Functions
//

// Functions are very similar to macros except they cannot have attrs or accessedProps
// but they do take comma-separated arguments.
FunctionMacro
    = "$$" "(" path:Path ")" input:FunctionInput? {
            return withPosition({
                type: "function",
                path,
                input,
            });
        }
    / "$$" path:SimplePath input:FunctionInput? {
            return withPosition({
                type: "function",
                path,
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

PropAttrs
	= "{" _? attrs:(@Attr _?)* "}" {
            return Object.fromEntries(attrs.map((a) => [a.name, a]));
        }

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
