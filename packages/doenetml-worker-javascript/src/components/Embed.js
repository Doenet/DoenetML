import BlockComponent from "./abstract/BlockComponent";

export default class Embed extends BlockComponent {
    constructor(args) {
        super(args);

        Object.assign(this.actions, {
            recordVisibilityChange: this.recordVisibilityChange.bind(this),
        });
    }
    static componentType = "embed";

    static componentDocs = {
        summary: "Embeds external content (e.g. an iframe) into the document.",
    };
    static excludeFromSchema = true;

    static createAttributesObject() {
        let attributes = super.createAttributesObject();
        attributes.width = {
            description: "Display width of the embedded content.",
            createComponentOfType: "componentSize",
            createStateVariable: "width",
            defaultValue: { size: 500, isAbsolute: true },
            public: true,
            forRenderer: true,
        };
        attributes.height = {
            description: "Display height of the embedded content.",
            createComponentOfType: "componentSize",
            createStateVariable: "height",
            defaultValue: { size: 500, isAbsolute: true },
            public: true,
            forRenderer: true,
        };
        attributes.geogebra = {
            description: "Identifier of a GeoGebra activity to embed.",
            createComponentOfType: "text",
            createStateVariable: "geogebra",
            defaultValue: null,
            public: true,
            forRenderer: true,
        };
        attributes.encodedGeogebraContent = {
            description: "Base64-encoded GeoGebra worksheet content.",
            createComponentOfType: "text",
            createStateVariable: "encodedGeogebraContent",
            defaultValue: null,
            public: true,
            forRenderer: true,
        };
        attributes.fromMathInsight = {
            description: "Identifier of a MathInsight resource to embed.",
            createComponentOfType: "text",
            createStateVariable: "fromMathInsight",
            defaultValue: null,
            public: true,
            forRenderer: true,
        };

        return attributes;
    }

    recordVisibilityChange({ isVisible }) {
        this.coreFunctions.requestRecordEvent({
            verb: "visibilityChanged",
            object: {
                componentIdx: this.componentIdx,
                componentType: this.componentType,
            },
            result: { isVisible },
        });
    }
}
