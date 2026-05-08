import InlineRenderInlineChildren from "./abstract/InlineRenderInlineChildren";

export class Em extends InlineRenderInlineChildren {
    static componentType = "em";

    static componentDocs = {
        summary: "Emphasized inline text (italic by default).",
    };
}

export class Alert extends InlineRenderInlineChildren {
    static componentType = "alert";

    static componentDocs = {
        summary: "Inline text styled as an alert.",
    };
}

export class Q extends InlineRenderInlineChildren {
    static componentType = "q";

    static componentDocs = {
        summary: "Inline double-quoted text.",
    };
    static beginTextDelimiter = '"';
    static endTextDelimiter = '"';
}

export class SQ extends InlineRenderInlineChildren {
    static componentType = "sq";

    static componentDocs = {
        summary: "Inline single-quoted text.",
    };
    static beginTextDelimiter = "'";
    static endTextDelimiter = "'";
}

export class Term extends InlineRenderInlineChildren {
    static componentType = "term";

    static componentDocs = {
        summary: "An inline term, styled distinctively.",
    };
    static rendererType = "alert";
}

export class C extends InlineRenderInlineChildren {
    static componentType = "c";

    static componentDocs = {
        summary: "Inline code text.",
    };
}

export class Tag extends InlineRenderInlineChildren {
    static componentType = "tag";

    static componentDocs = {
        summary: "Renders an XML/HTML tag-like inline.",
    };
    static rendererType = "tag";
    static beginTextDelimiter = "<";
    static endTextDelimiter = ">";
}

export class Tage extends InlineRenderInlineChildren {
    static componentType = "tage";

    static componentDocs = {
        summary: "Renders an empty XML/HTML tag-like inline.",
    };
    static rendererType = "tag";
    static beginTextDelimiter = "<";
    static endTextDelimiter = "/>";

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();
        stateVariableDefinitions.selfClosed = {
            forRenderer: true,
            returnDependencies: () => ({}),
            definition: () => ({ setValue: { selfClosed: true } }),
        };
        return stateVariableDefinitions;
    }
}

export class Tagc extends InlineRenderInlineChildren {
    static componentType = "tagc";

    static componentDocs = {
        summary: "Renders a closing XML/HTML tag-like inline.",
    };
    static rendererType = "tag";
    static beginTextDelimiter = "</";
    static endTextDelimiter = ">";

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();
        stateVariableDefinitions.closing = {
            forRenderer: true,
            returnDependencies: () => ({}),
            definition: () => ({ setValue: { closing: true } }),
        };
        return stateVariableDefinitions;
    }
}

export class Attr extends InlineRenderInlineChildren {
    static componentType = "attr";

    static componentDocs = {
        summary: "Renders an attribute name as an inline.",
    };
    static rendererType = "c";
}
