import BlockComponent from "./abstract/BlockComponent";
import {
    orderedPercentWidthMidpoints,
    orderedWidthMidpoints,
    widthsBySize,
    sizePossibilities,
    percentWidthsBySize,
    returnSelectedStyleStateVariableDefinition,
    mediaLicenses,
    getMediaLicenseInfo,
    creativeCommonsVersions,
    defaultCreativeCommonsVersion,
} from "@doenet/utils";
import {
    moveGraphicalObjectWithAnchorAction,
    returnAnchorAttributes,
    returnAnchorStateVariableDefinition,
} from "../utils/graphical";
import { returnListItemChildStateVariableDefinitions } from "../utils/listItemChild";

export default class Image extends BlockComponent {
    constructor(args) {
        super(args);

        Object.assign(this.actions, {
            moveImage: this.moveImage.bind(this),
            recordVisibilityChange: this.recordVisibilityChange.bind(this),
            imageClicked: this.imageClicked.bind(this),
            imageFocused: this.imageFocused.bind(this),
        });
    }
    static componentType = "image";

    static componentDocs = {
        summary: "Displays a static image",
    };
    static renderChildren = true;

    static createAttributesObject() {
        let attributes = super.createAttributesObject();

        attributes.width = {
            createComponentOfType: "componentSize",
            createStateVariable: "specifiedWidth",
            defaultValue: null,
            description: "Explicit width of the image (overrides size).",
        };
        attributes.size = {
            createComponentOfType: "text",
            createStateVariable: "specifiedSize",
            defaultValue: "medium",
            toLowerCase: true,
            validValues: [
                { value: "tiny", description: "About 1/12 the full width." },
                { value: "small", description: "About 30% of the full width." },
                { value: "medium", description: "About half the full width." },
                { value: "large", description: "About 70% of the full width." },
                { value: "full", description: "The full available width." },
            ],
            description: "Named size preset for the image.",
        };
        attributes.aspectRatio = {
            createComponentOfType: "number",
            description: "Aspect ratio (width / height) for the image.",
        };

        attributes.displayMode = {
            description: "How to size the image.",
            createComponentOfType: "text",
            createStateVariable: "displayMode",
            toLowerCase: true,
            validValues: [
                {
                    value: "block",
                    description: "Display as a block element on its own line.",
                },
                {
                    value: "inline",
                    description: "Render inline with surrounding text.",
                },
            ],
            defaultValue: "block",
            forRenderer: true,
            public: true,
        };

        attributes.horizontalAlign = {
            description:
                "Horizontal alignment of the image within its container.",
            createComponentOfType: "text",
            createStateVariable: "horizontalAlign",
            toLowerCase: true,
            validValues: [
                {
                    value: "center",
                    description: "Center the image horizontally.",
                },
                {
                    value: "left",
                    description: "Align the image to the left edge.",
                },
                {
                    value: "right",
                    description: "Align the image to the right edge.",
                },
            ],
            defaultValue: "center",
            forRenderer: true,
            public: true,
        };
        attributes.decorative = {
            description: "Whether the image is purely decorative.",
            createPrimitiveOfType: "boolean",
            createStateVariable: "decorative",
            defaultValue: false,
            public: true,
            forRenderer: true,
        };
        attributes.source = {
            description: "URL or path of the image source.",
            createComponentOfType: "text",
            createStateVariable: "source",
            defaultValue: "",
            public: true,
            forRenderer: true,
        };
        attributes.authorName = {
            description: "Name of the author of the image.",
            createComponentOfType: "text",
            createStateVariable: "authorName",
            defaultValue: null,
            public: true,
            forRenderer: true,
        };
        attributes.authorUrl = {
            description:
                "URL to link the author's name to in the attribution (e.g. the author's profile page).",
            createComponentOfType: "text",
            createStateVariable: "authorUrl",
            defaultValue: null,
            public: true,
            forRenderer: true,
        };
        attributes.imageName = {
            description:
                "Name of the image, used in place of the generic word \u201CImage\u201D in the attribution.",
            createComponentOfType: "text",
            createStateVariable: "imageName",
            defaultValue: null,
            public: true,
            forRenderer: true,
        };
        attributes.originalUrl = {
            description:
                "Original URL where the image can be found, used to link the image name in the attribution.",
            createComponentOfType: "text",
            createStateVariable: "originalUrl",
            defaultValue: null,
            public: true,
            forRenderer: true,
        };
        attributes.licenseName = {
            description: "Name of the license for the image.",
            createComponentOfType: "text",
            createStateVariable: "licenseNamePreliminary",
            defaultValue: null,
        };
        attributes.licenseUrl = {
            description: "URL for the license of the image.",
            createComponentOfType: "text",
            createStateVariable: "licenseUrlPreliminary",
            defaultValue: null,
        };
        attributes.licenseCodes = {
            description:
                "License code(s) for the image. Specify two codes to indicate the image is dual licensed.",
            createComponentOfType: "textList",
            createStateVariable: "licenseCodes",
            defaultValue: null,
            toLowerCase: true,
            validValues: mediaLicenses.map((license) => ({
                value: license.code,
                description: license.description,
            })),
            public: true,
            forRenderer: true,
        };
        attributes.licenseVersion = {
            description:
                "Version of the Creative Commons license(s) given in `licenseCodes` (ignored by non-Creative-Commons licenses).",
            createComponentOfType: "text",
            createStateVariable: "licenseVersion",
            defaultValue: defaultCreativeCommonsVersion,
            toLowerCase: true,
            validValues: creativeCommonsVersions.map((version) => ({
                value: version,
                description: `Creative Commons version ${version}.`,
            })),
            public: true,
            forRenderer: true,
        };
        attributes.asFileName = {
            description: "File name to use when downloading the image.",
            createComponentOfType: "text",
            createStateVariable: "asFileName",
            defaultValue: null,
            public: true,
            forRenderer: true,
        };
        attributes.mimeType = {
            description: "MIME type of the image.",
            createComponentOfType: "text",
            createStateVariable: "mimeType",
            defaultValue: null,
            public: true,
            forRenderer: true,
        };

        attributes.draggable = {
            description: "Whether the image can be dragged on a graph.",
            createComponentOfType: "boolean",
            createStateVariable: "draggable",
            defaultValue: true,
            public: true,
            forRenderer: true,
        };

        attributes.layer = {
            description: "Z-order layer index when shown on a graph.",
            createComponentOfType: "number",
            createStateVariable: "layer",
            defaultValue: 0,
            public: true,
            forRenderer: true,
        };

        Object.assign(attributes, returnAnchorAttributes());

        attributes.rotate = {
            description: "Rotation angle (radians) applied to the image.",
            createComponentOfType: "number",
            createStateVariable: "rotate",
            defaultValue: 0,
            public: true,
            forRenderer: true,
        };

        return attributes;
    }

    static returnChildGroups() {
        return [
            {
                group: "shortDescriptions",
                componentTypes: ["shortDescription"],
            },
            {
                group: "descriptions",
                componentTypes: ["description"],
            },
        ];
    }

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        Object.assign(
            stateVariableDefinitions,
            returnListItemChildStateVariableDefinitions({
                listItemInlineAlignment: "flex-start",
            }),
        );

        let selectedStyleDefinition =
            returnSelectedStyleStateVariableDefinition();
        Object.assign(stateVariableDefinitions, selectedStyleDefinition);

        let anchorDefinition = returnAnchorStateVariableDefinition();
        Object.assign(stateVariableDefinitions, anchorDefinition);

        stateVariableDefinitions.shortDescription = {
            description: "A short accessibility description of the image.",
            forRenderer: true,
            public: true,
            shadowingInstructions: {
                createComponentOfType: "text",
            },
            returnDependencies: () => ({
                shortDescriptionChild: {
                    dependencyType: "child",
                    childGroups: ["shortDescriptions"],
                    variableNames: ["text"],
                },
                decorative: {
                    dependencyType: "stateVariable",
                    variableName: "decorative",
                },
            }),
            definition({ dependencyValues }) {
                let shortDescription = "";
                const diagnostics = [];
                if (dependencyValues.shortDescriptionChild.length > 0) {
                    const shortDescriptionChild =
                        dependencyValues.shortDescriptionChild[
                            dependencyValues.shortDescriptionChild.length - 1
                        ];

                    shortDescription =
                        shortDescriptionChild.stateValues.text.trim();
                }
                if (shortDescription === "" && !dependencyValues.decorative) {
                    diagnostics.push({
                        type: "accessibility",
                        level: 1,
                        message:
                            "For accessibility, `<image>` must either have a short description or be specified as decorative.",
                    });
                }

                return {
                    setValue: { shortDescription },
                    sendDiagnostics: diagnostics,
                };
            },
        };

        stateVariableDefinitions.childIndicesToRender = {
            returnDependencies: () => ({
                allChildren: {
                    dependencyType: "child",
                    includeAllChildren: true,
                },
            }),
            definition({ dependencyValues }) {
                const descriptionIdx =
                    dependencyValues.allChildren.findLastIndex(
                        (child) => child.componentType === "description",
                    );

                const childIndicesToRender =
                    descriptionIdx === -1 ? [] : [descriptionIdx];

                return { setValue: { childIndicesToRender } };
            },
            markStale: () => ({ updateRenderedChildren: true }),
        };

        stateVariableDefinitions.size = {
            description: "The size of the image.",
            public: true,
            shadowingInstructions: {
                createComponentOfType: "text",
            },
            returnDependencies: () => ({
                specifiedSize: {
                    dependencyType: "stateVariable",
                    variableName: "specifiedSize",
                },
                specifiedWidth: {
                    dependencyType: "stateVariable",
                    variableName: "specifiedWidth",
                },
                graphAncestor: {
                    dependencyType: "ancestor",
                    componentType: "graph",
                    variableNames: ["xScale"],
                },
            }),
            definition({ dependencyValues, usedDefault }) {
                const defaultSize = "medium";

                if (!usedDefault.specifiedSize) {
                    return {
                        setValue: { size: dependencyValues.specifiedSize },
                    };
                } else if (!usedDefault.specifiedWidth) {
                    let componentSize = dependencyValues.specifiedWidth;
                    if (componentSize === null) {
                        return {
                            setValue: { size: defaultSize },
                        };
                    }

                    let { isAbsolute, size: widthSize } = componentSize;
                    let size;

                    if (isAbsolute) {
                        let midpoints;

                        if (dependencyValues.graphAncestor) {
                            let xscale =
                                dependencyValues.graphAncestor.stateValues
                                    .xScale;
                            midpoints = orderedPercentWidthMidpoints.map(
                                (x) => (x / 100) * xscale,
                            );
                        } else {
                            midpoints = orderedWidthMidpoints;
                        }

                        for (let [ind, pixels] of midpoints.entries()) {
                            if (widthSize <= pixels) {
                                size = sizePossibilities[ind];
                                break;
                            }
                        }
                        if (!size) {
                            size = defaultSize;
                        }
                    } else {
                        for (let [
                            ind,
                            percent,
                        ] of orderedPercentWidthMidpoints.entries()) {
                            if (widthSize <= percent) {
                                size = sizePossibilities[ind];
                                break;
                            }
                        }
                        if (!size) {
                            size = defaultSize;
                        }
                    }
                    return {
                        setValue: { size },
                    };
                } else {
                    return {
                        setValue: { size: defaultSize },
                    };
                }
            },
            inverseDefinition({ desiredStateVariableValues }) {
                return {
                    success: true,
                    instructions: [
                        {
                            setDependency: "specifiedSize",
                            desiredValue: desiredStateVariableValues.size,
                        },
                    ],
                };
            },
        };

        stateVariableDefinitions.width = {
            description: "The display width of the image.",
            public: true,
            forRenderer: true,
            shadowingInstructions: {
                createComponentOfType: "componentSize",
            },
            returnDependencies: () => ({
                specifiedSize: {
                    dependencyType: "stateVariable",
                    variableName: "specifiedSize",
                },
                size: {
                    dependencyType: "stateVariable",
                    variableName: "size",
                },
                specifiedWidth: {
                    dependencyType: "stateVariable",
                    variableName: "specifiedWidth",
                },
                graphAncestor: {
                    dependencyType: "ancestor",
                    componentType: "graph",
                    variableNames: ["xScale"],
                },
            }),
            definition({ dependencyValues, usedDefault }) {
                const defaultSize = "medium";

                if (dependencyValues.graphAncestor) {
                    let xscale =
                        dependencyValues.graphAncestor.stateValues.xScale;
                    if (!usedDefault.specifiedSize) {
                        return {
                            setValue: {
                                // width: { isAbsolute: true, size: percentWidthsBySize[dependencyValues.size] / 100 * xscale }
                                width: {
                                    isAbsolute: false,
                                    size: percentWidthsBySize[
                                        dependencyValues.size
                                    ],
                                },
                            },
                        };
                    } else if (!usedDefault.specifiedWidth) {
                        let componentSize = dependencyValues.specifiedWidth;

                        let width;
                        if (componentSize) {
                            // if (componentSize.isAbsolute) {
                            width = componentSize;
                            // } else {
                            //   width = { isAbsolute: true, size: componentSize.size / 100 * xscale }
                            // }
                        } else {
                            // width = { isAbsolute: true, size: percentWidthsBySize[defaultSize] / 100 * xscale };
                            width = {
                                isAbsolute: false,
                                size: percentWidthsBySize[defaultSize],
                            };
                        }

                        return {
                            setValue: { width },
                        };
                    } else {
                        return {
                            setValue: {
                                // width: { isAbsolute: true, size: percentWidthsBySize[defaultSize] / 100 * xscale }
                                width: {
                                    isAbsolute: false,
                                    size: percentWidthsBySize[defaultSize],
                                },
                            },
                        };
                    }
                } else {
                    // if don't have a graph ancestor
                    // then width is determined just by the size

                    let width = {
                        isAbsolute: true,
                        size: widthsBySize[dependencyValues.size],
                    };

                    return {
                        setValue: { width },
                    };
                }
            },
            inverseDefinition({ desiredStateVariableValues }) {
                return {
                    success: true,
                    instructions: [
                        {
                            setDependency: "specifiedWidth",
                            desiredValue: desiredStateVariableValues.width,
                        },
                    ],
                };
            },
        };

        stateVariableDefinitions.widthForGraph = {
            forRenderer: true,
            returnDependencies: () => ({
                width: {
                    dependencyType: "stateVariable",
                    variableName: "width",
                },
                graphAncestor: {
                    dependencyType: "ancestor",
                    componentType: "graph",
                    variableNames: ["xScale"],
                },
            }),
            definition({ dependencyValues }) {
                let widthForGraph = dependencyValues.width;
                if (
                    dependencyValues.graphAncestor &&
                    !widthForGraph.isAbsolute
                ) {
                    widthForGraph = {
                        isAbsolute: true,
                        size:
                            (widthForGraph.size / 100) *
                            dependencyValues.graphAncestor.stateValues.xScale,
                    };
                }

                return { setValue: { widthForGraph } };
            },
        };

        stateVariableDefinitions.aspectRatio = {
            description: "The aspect ratio (width / height) of the image.",
            public: true,
            forRenderer: true,
            hasEssential: true,
            defaultValue: null,
            shadowingInstructions: {
                createComponentOfType: "number",
            },
            returnDependencies: () => ({
                aspectRatioAttr: {
                    dependencyType: "attributeComponent",
                    attributeName: "aspectRatio",
                    variableNames: ["value"],
                },
            }),
            definition({ dependencyValues }) {
                if (dependencyValues.aspectRatioAttr !== null) {
                    let aspectRatio =
                        dependencyValues.aspectRatioAttr.stateValues.value;
                    if (!Number.isFinite(aspectRatio)) {
                        aspectRatio = null;
                    }
                    return {
                        setValue: { aspectRatio },
                    };
                } else {
                    return {
                        useEssentialOrDefaultValue: { aspectRatio: true },
                    };
                }
            },
            inverseDefinition({
                desiredStateVariableValues,
                dependencyValues,
            }) {
                if (dependencyValues.aspectRatioAttr !== null) {
                    return {
                        success: true,
                        instructions: [
                            {
                                setDependency: "aspectRatioAttr",
                                desiredValue:
                                    desiredStateVariableValues.aspectRatio,
                                variableIndex: 0,
                            },
                        ],
                    };
                } else {
                    let aspectRatio = desiredStateVariableValues.aspectRatio;
                    if (!(aspectRatio > 0)) {
                        aspectRatio = null;
                    }
                    return {
                        success: true,
                        instructions: [
                            {
                                setEssentialValue: "aspectRatio",
                                value: aspectRatio,
                            },
                        ],
                    };
                }
            },
        };

        stateVariableDefinitions.licenseNames = {
            description:
                "The license name(s) for the image. Derived from `licenseCodes` when given; otherwise from the `licenseName` attribute.",
            public: true,
            forRenderer: true,
            shadowingInstructions: {
                createComponentOfType: "textList",
            },
            returnDependencies: () => ({
                licenseCodes: {
                    dependencyType: "stateVariable",
                    variableName: "licenseCodes",
                },
                licenseNamePreliminary: {
                    dependencyType: "stateVariable",
                    variableName: "licenseNamePreliminary",
                },
            }),
            definition({ dependencyValues }) {
                const { licenseCodes, licenseNamePreliminary } =
                    dependencyValues;

                // Codes take precedence over the preliminary `licenseName`.
                if (licenseCodes && licenseCodes.length > 0) {
                    const licenseNames = [];
                    for (const code of licenseCodes) {
                        const info = getMediaLicenseInfo(code);
                        // Unknown codes are skipped here; the attribute's
                        // `validValues` already flags them with a diagnostic.
                        if (info) {
                            licenseNames.push(info.name);
                        }
                    }
                    return { setValue: { licenseNames } };
                }

                if (licenseNamePreliminary !== null) {
                    return {
                        setValue: { licenseNames: [licenseNamePreliminary] },
                    };
                }

                return { setValue: { licenseNames: [] } };
            },
        };

        stateVariableDefinitions.licenseUrls = {
            description:
                "The license URL(s) for the image. Derived from `licenseCodes` (and `licenseVersion`) when given; otherwise from the `licenseUrl` attribute.",
            public: true,
            forRenderer: true,
            shadowingInstructions: {
                createComponentOfType: "textList",
            },
            returnDependencies: () => ({
                licenseCodes: {
                    dependencyType: "stateVariable",
                    variableName: "licenseCodes",
                },
                licenseVersion: {
                    dependencyType: "stateVariable",
                    variableName: "licenseVersion",
                },
                licenseNamePreliminary: {
                    dependencyType: "stateVariable",
                    variableName: "licenseNamePreliminary",
                },
                licenseUrlPreliminary: {
                    dependencyType: "stateVariable",
                    variableName: "licenseUrlPreliminary",
                },
            }),
            definition({ dependencyValues }) {
                const {
                    licenseCodes,
                    licenseVersion,
                    licenseNamePreliminary,
                    licenseUrlPreliminary,
                } = dependencyValues;

                // Codes take precedence over the preliminary `licenseUrl`.
                // The order mirrors `licenseNames`: both skip the same unknown
                // codes, so the two lists stay index-aligned for the renderer.
                if (licenseCodes && licenseCodes.length > 0) {
                    const licenseUrls = [];
                    for (const code of licenseCodes) {
                        const info = getMediaLicenseInfo(code);
                        if (info) {
                            licenseUrls.push(info.url(licenseVersion));
                        }
                    }
                    return { setValue: { licenseUrls } };
                }

                // The fallback URL is gated on the preliminary `licenseName`:
                // `licenseNames` only contains an entry when a name is given, so
                // the URL list must follow suit to stay index-aligned. When a
                // name is present but no URL, emit an empty string (no link).
                if (licenseNamePreliminary !== null) {
                    return {
                        setValue: {
                            licenseUrls: [licenseUrlPreliminary ?? ""],
                        },
                    };
                }

                return { setValue: { licenseUrls: [] } };
            },
        };

        stateVariableDefinitions.imageId = {
            forRenderer: true,

            returnDependencies: () => ({
                source: {
                    dependencyType: "stateVariable",
                    variableName: "source",
                },
            }),
            definition: function ({ dependencyValues }) {
                // A `doenet:<id>` source references an image in Doenet's media
                // library; expose the `<id>` so the renderer can build its URL.
                // The whole source must be exactly `doenet:<id>` (an
                // alphanumeric id) — any other source, including unsupported
                // `doenet:` forms like `doenet:cid=<hash>`, has no id.
                const result = dependencyValues.source
                    .trim()
                    .match(/^doenet:([a-zA-Z0-9]+)$/i);

                return { setValue: { imageId: result ? result[1] : null } };
            },
        };

        return stateVariableDefinitions;
    }

    async moveImage({
        x,
        y,
        z,
        transient,
        actionId,
        sourceInformation = {},
        skipRendererUpdate = false,
    }) {
        return await moveGraphicalObjectWithAnchorAction({
            x,
            y,
            z,
            transient,
            actionId,
            sourceInformation,
            skipRendererUpdate,
            componentIdx: this.componentIdx,
            componentType: this.componentType,
            coreFunctions: this.coreFunctions,
        });
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

    async imageClicked({
        actionId,
        componentIdx,
        sourceInformation = {},
        skipRendererUpdate = false,
    }) {
        if (!(await this.stateValues.fixed)) {
            await this.coreFunctions.triggerChainedActions({
                triggeringAction: "click",
                componentIdx, // use componentIdx rather than this.componentIdx to get original componentIdx if adapted
                actionId,
                sourceInformation,
                skipRendererUpdate,
            });
        }
    }

    async imageFocused({
        actionId,
        componentIdx,
        sourceInformation = {},
        skipRendererUpdate = false,
    }) {
        if (!(await this.stateValues.fixed)) {
            await this.coreFunctions.triggerChainedActions({
                triggeringAction: "focus",
                componentIdx, // use componentIdx rather than this.componentIdx to get original componentIdx if adapted
                actionId,
                sourceInformation,
                skipRendererUpdate,
            });
        }
    }
}
