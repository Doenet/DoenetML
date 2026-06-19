import SingleCharacterInline from "./abstract/SingleCharacterInline";

export class Ndash extends SingleCharacterInline {
    static componentType = "ndash";
    static componentDocs = { summary: "Renders an en-dash (–) character" };
    static unicodeCharacter = "–";
}

export class Mdash extends SingleCharacterInline {
    static componentType = "mdash";
    static componentDocs = { summary: "Renders an em-dash (—) character" };
    static unicodeCharacter = "—";
}

export class NBSP extends SingleCharacterInline {
    static componentType = "nbsp";
    static componentDocs = {
        summary: "Renders a non-breaking space character",
    };
    static unicodeCharacter = "\u00a0";
}

export class Ellipsis extends SingleCharacterInline {
    static componentType = "ellipsis";
    static componentDocs = {
        summary: "Renders a horizontal ellipsis (…) character",
    };
    static unicodeCharacter = "…";
}

export class Lq extends SingleCharacterInline {
    static componentType = "lq";
    static componentDocs = {
        summary: "Renders a left double quotation mark (“)",
    };
    static unicodeCharacter = "“";
}

export class Rq extends SingleCharacterInline {
    static componentType = "rq";
    static componentDocs = {
        summary: "Renders a right double quotation mark (”)",
    };
    static unicodeCharacter = "”";
}

export class Lsq extends SingleCharacterInline {
    static componentType = "lsq";
    static componentDocs = {
        summary: "Renders a left single quotation mark (‘)",
    };
    static unicodeCharacter = "‘";
}

export class Rsq extends SingleCharacterInline {
    static componentType = "rsq";
    static componentDocs = {
        summary: "Renders a right single quotation mark (’)",
    };
    static unicodeCharacter = "’";
}
