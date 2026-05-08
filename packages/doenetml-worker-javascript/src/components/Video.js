import BlockComponent from "./abstract/BlockComponent";
import {
    orderedPercentWidthMidpoints,
    orderedWidthMidpoints,
    widthsBySize,
    sizePossibilities,
} from "@doenet/utils";
import { returnListItemChildStateVariableDefinitions } from "../utils/listItemChild";

export default class Video extends BlockComponent {
    constructor(args) {
        super(args);

        Object.assign(this.actions, {
            recordVideoStarted: this.recordVideoStarted.bind(this),
            recordVideoWatched: this.recordVideoWatched.bind(this),
            recordVideoPaused: this.recordVideoPaused.bind(this),
            recordVideoSkipped: this.recordVideoSkipped.bind(this),
            recordVideoCompleted: this.recordVideoCompleted.bind(this),
            recordVisibilityChange: this.recordVisibilityChange.bind(this),
            recordVideoReady: this.recordVideoReady.bind(this),
            playVideo: this.playVideo.bind(this),
            pauseVideo: this.pauseVideo.bind(this),
            setTime: this.setTime.bind(this),
        });
    }
    static componentType = "video";

    static componentDocs = {
        summary: "Embeds a video player.",
    };
    static renderChildren = true;

    static createAttributesObject() {
        let attributes = super.createAttributesObject();

        attributes.width = {
            createComponentOfType: "componentSize",
        };
        attributes.size = {
            createComponentOfType: "text",
            createStateVariable: "specifiedSize",
            defaultValue: "full",
            toLowerCase: true,
            validValues: sizePossibilities,
        };
        attributes.aspectRatio = {
            createComponentOfType: "number",
        };

        attributes.displayMode = {
            description:
                'How to size the video player (e.g. "block", "inline").',
            createComponentOfType: "text",
            createStateVariable: "displayMode",
            toLowerCase: true,
            validValues: ["block", "inline"],
            defaultValue: "block",
            forRenderer: true,
            public: true,
        };

        attributes.horizontalAlign = {
            description:
                "Horizontal alignment of the video within its container.",
            createComponentOfType: "text",
            createStateVariable: "horizontalAlign",
            toLowerCase: true,
            validValues: ["center", "left", "right"],
            defaultValue: "center",
            forRenderer: true,
            public: true,
        };

        attributes.youtube = {
            description: "YouTube video ID to embed.",
            createComponentOfType: "text",
            createStateVariable: "youtube",
            defaultValue: null,
            public: true,
            forRenderer: true,
        };
        attributes.source = {
            description: "URL of the video source.",
            createComponentOfType: "text",
            createStateVariable: "source",
            defaultValue: null,
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

        stateVariableDefinitions.shortDescription = {
            description: "A short accessibility description of the video.",
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
                if (shortDescription === "") {
                    diagnostics.push({
                        type: "accessibility",
                        level: 1,
                        message:
                            "For accessibility, `<video>` must have a short description.",
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
            description: "The size of the video player.",
            public: true,
            defaultValue: "full",
            hasEssential: true,
            shadowingInstructions: {
                createComponentOfType: "text",
            },
            returnDependencies: () => ({
                specifiedSize: {
                    dependencyType: "stateVariable",
                    variableName: "specifiedSize",
                },
                widthAttr: {
                    dependencyType: "attributeComponent",
                    attributeName: "width",
                    variableNames: ["componentSize"],
                },
            }),
            definition({ dependencyValues, usedDefault }) {
                const defaultSize = "full";

                if (!usedDefault.specifiedSize) {
                    return {
                        setValue: { size: dependencyValues.specifiedSize },
                    };
                } else if (dependencyValues.widthAttr) {
                    let componentSize =
                        dependencyValues.widthAttr.stateValues.componentSize;
                    if (componentSize === null) {
                        return {
                            setValue: { size: defaultSize },
                        };
                    }
                    let { isAbsolute, size: widthSize } = componentSize;
                    let size;

                    if (isAbsolute) {
                        for (let [
                            ind,
                            pixels,
                        ] of orderedWidthMidpoints.entries()) {
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
                        useEssentialOrDefaultValue: { size: true },
                    };
                }
            },
        };

        stateVariableDefinitions.width = {
            description: "The display width of the video player.",
            public: true,
            forRenderer: true,
            shadowingInstructions: {
                createComponentOfType: "componentSize",
            },
            returnDependencies: () => ({
                size: {
                    dependencyType: "stateVariable",
                    variableName: "size",
                },
            }),
            definition({ dependencyValues }) {
                let width = {
                    isAbsolute: true,
                    size: widthsBySize[dependencyValues.size],
                };

                return {
                    setValue: { width },
                };
            },
        };

        stateVariableDefinitions.aspectRatio = {
            description:
                "The aspect ratio (width / height) of the video player.",
            public: true,
            forRenderer: true,
            defaultValue: "16 / 9",
            hasEssential: true,
            shadowingInstructions: {
                createComponentOfType: "number",
            },
            returnDependencies: () => ({
                aspectRatioAttr: {
                    dependencyType: "attributeComponent",
                    attributeName: "aspectRatio",
                    variableNames: ["value"],
                },
                width: {
                    dependencyType: "stateVariable",
                    variableName: "width",
                },
            }),
            definition({ dependencyValues }) {
                if (dependencyValues.aspectRatioAttr !== null) {
                    let aspectRatio =
                        dependencyValues.aspectRatioAttr.stateValues.value;
                    if (!Number.isFinite(aspectRatio)) {
                        aspectRatio = 1;
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
        };

        stateVariableDefinitions.state = {
            description:
                "The video's current playback state (e.g. playing, paused).",
            hasEssential: true,
            defaultValue: "initializing",
            forRenderer: true,
            public: true,
            shadowingInstructions: {
                createComponentOfType: "text",
            },
            ignoreFixed: true,
            returnDependencies: () => ({}),
            definition() {
                return { useEssentialOrDefaultValue: { state: true } };
            },
            inverseDefinition({ desiredStateVariableValues }) {
                let desiredState =
                    desiredStateVariableValues.state.toLowerCase();
                let validValues = ["stopped", "playing"];
                if (!validValues.includes(desiredState)) {
                    return { success: false };
                }
                return {
                    success: true,
                    instructions: [
                        {
                            setEssentialValue: "state",
                            value: desiredState,
                        },
                    ],
                };
            },
        };

        stateVariableDefinitions.time = {
            description: "The current playback time in seconds.",
            hasEssential: true,
            defaultValue: 0,
            forRenderer: true,
            public: true,
            shadowingInstructions: {
                createComponentOfType: "number",
            },
            ignoreFixed: true,
            returnDependencies: () => ({}),
            definition() {
                return { useEssentialOrDefaultValue: { time: true } };
            },
            inverseDefinition({ desiredStateVariableValues }) {
                let desiredTime = desiredStateVariableValues.time;
                if (!(desiredTime >= 0)) {
                    return { success: false };
                }
                return {
                    success: true,
                    instructions: [
                        {
                            setEssentialValue: "time",
                            value: desiredTime,
                        },
                    ],
                };
            },
        };

        stateVariableDefinitions.duration = {
            description: "The total duration of the video in seconds.",
            hasEssential: true,
            defaultValue: null,
            public: true,
            shadowingInstructions: {
                createComponentOfType: "number",
            },
            ignoreFixed: true,
            returnDependencies: () => ({}),
            definition: () => ({
                useEssentialOrDefaultValue: { duration: true },
            }),
            inverseDefinition: ({ desiredStateVariableValues }) => ({
                success: true,
                instructions: [
                    {
                        setEssentialValue: "duration",
                        value: desiredStateVariableValues.duration,
                    },
                ],
            }),
        };

        stateVariableDefinitions.segmentsWatched = {
            hasEssential: true,
            defaultValue: null,
            returnDependencies: () => ({}),
            definition: () => ({
                useEssentialOrDefaultValue: { segmentsWatched: true },
            }),
            inverseDefinition: ({ desiredStateVariableValues }) => ({
                success: true,
                instructions: [
                    {
                        setEssentialValue: "segmentsWatched",
                        value: desiredStateVariableValues.segmentsWatched,
                    },
                ],
            }),
        };

        stateVariableDefinitions.secondsWatched = {
            description: "Total seconds the viewer has watched.",
            public: true,
            shadowingInstructions: {
                createComponentOfType: "number",
            },
            returnDependencies: () => ({
                segmentsWatched: {
                    dependencyType: "stateVariable",
                    variableName: "segmentsWatched",
                },
            }),
            definition({ dependencyValues }) {
                let secondsWatched = 0;
                if (dependencyValues.segmentsWatched) {
                    secondsWatched = dependencyValues.segmentsWatched.reduce(
                        (a, c) => a + c[1] - c[0],
                        0,
                    );
                }
                return { setValue: { secondsWatched } };
            },
        };

        stateVariableDefinitions.fractionWatched = {
            description:
                "Fraction of the video the viewer has watched (0 to 1).",
            public: true,
            shadowingInstructions: {
                createComponentOfType: "number",
            },
            returnDependencies: () => ({
                secondsWatched: {
                    dependencyType: "stateVariable",
                    variableName: "secondsWatched",
                },
                duration: {
                    dependencyType: "stateVariable",
                    variableName: "duration",
                },
            }),
            definition({ dependencyValues }) {
                return {
                    setValue: {
                        fractionWatched:
                            dependencyValues.secondsWatched /
                            dependencyValues.duration,
                    },
                };
            },
        };

        return stateVariableDefinitions;
    }

    async recordVideoStarted({
        beginTime,
        duration,
        rate,
        actionId,
        sourceInformation = {},
        skipRendererUpdate = false,
    }) {
        this.coreFunctions.requestRecordEvent({
            verb: "played",
            object: {
                componentIdx: this.componentIdx,
                componentType: this.componentType,
                duration: duration,
            },
            context: {
                startingPoint: beginTime,
                rate: rate,
            },
        });
        await this.coreFunctions.performUpdate({
            updateInstructions: [
                {
                    updateType: "updateValue",
                    componentIdx: this.componentIdx,
                    stateVariable: "state",
                    value: "playing",
                },
            ],
            actionId,
            sourceInformation,
            skipRendererUpdate,
            overrideReadOnly: true,
        });
    }

    async recordVideoWatched({
        beginTime,
        endTime,
        duration,
        rates,
        actionId,
        sourceInformation = {},
        skipRendererUpdate = false,
    }) {
        this.coreFunctions.requestRecordEvent({
            verb: "watched",
            object: {
                componentIdx: this.componentIdx,
                componentType: this.componentType,
                duration: duration,
            },
            context: {
                startingPoint: beginTime,
                endingPoint: endTime,
                rates,
            },
        });

        let previousSegments = await this.stateValues.segmentsWatched;
        let segmentsWatched;

        if (beginTime < 1) {
            beginTime = 0; // get credit for the beginning even though it typically doesn't say 0
        } else if (endTime > duration - 2) {
            endTime = duration; // get credit for the end even though it typically doesn't get to duration
        }

        if (!previousSegments) {
            segmentsWatched = [[beginTime, endTime]];
        } else {
            segmentsWatched = [];
            let addedNew = false;

            // if merge new segment with previous segments if it almost overlaps
            // Note: include 1 second buffer since there is variation in the timestamps youtube reports
            // when pause and then continue
            for (let [ind, seg] of previousSegments.entries()) {
                if (endTime < seg[0] - 1) {
                    segmentsWatched.push([beginTime, endTime]);
                    segmentsWatched.push(...previousSegments.slice(ind));
                    addedNew = true;
                    break;
                } else if (beginTime > seg[1] + 1) {
                    segmentsWatched.push(seg);
                    continue;
                }
                // have overlap with segment
                beginTime = Math.min(seg[0], beginTime);
                endTime = Math.max(seg[1], endTime);
            }

            if (!addedNew) {
                segmentsWatched.push([beginTime, endTime]);
            }
        }

        await this.coreFunctions.performUpdate({
            updateInstructions: [
                {
                    updateType: "updateValue",
                    componentIdx: this.componentIdx,
                    stateVariable: "segmentsWatched",
                    value: segmentsWatched,
                },
            ],
            actionId,
            sourceInformation,
            skipRendererUpdate: true,
            canSkipUpdatingRenderer: true,
        });

        return await this.coreFunctions.triggerChainedActions({
            componentIdx: this.componentIdx,
            actionId,
            sourceInformation,
            skipRendererUpdate,
        });
    }

    async recordVideoPaused({
        endTime,
        duration,
        actionId,
        sourceInformation = {},
        skipRendererUpdate = false,
    }) {
        this.coreFunctions.requestRecordEvent({
            verb: "paused",
            object: {
                componentIdx: this.componentIdx,
                componentType: this.componentType,
                duration: duration,
            },
            context: {
                endingPoint: endTime,
            },
        });
        await this.coreFunctions.performUpdate({
            updateInstructions: [
                {
                    updateType: "updateValue",
                    componentIdx: this.componentIdx,
                    stateVariable: "state",
                    value: "stopped",
                },
            ],
            actionId,
            sourceInformation,
            skipRendererUpdate,
            overrideReadOnly: true,
        });
    }

    recordVideoSkipped({ beginTime, endTime, duration }) {
        this.coreFunctions.requestRecordEvent({
            verb: "skipped",
            object: {
                componentIdx: this.componentIdx,
                componentType: this.componentType,
                duration: duration,
            },
            context: {
                startingPoint: beginTime,
                endingPoint: endTime,
            },
        });
    }

    async recordVideoCompleted({
        duration,
        actionId,
        sourceInformation = {},
        skipRendererUpdate = false,
    }) {
        this.coreFunctions.requestRecordEvent({
            verb: "completed",
            object: {
                componentIdx: this.componentIdx,
                componentType: this.componentType,
                duration: duration,
            },
        });
        await this.coreFunctions.performUpdate({
            updateInstructions: [
                {
                    updateType: "updateValue",
                    componentIdx: this.componentIdx,
                    stateVariable: "state",
                    value: "stopped",
                },
            ],
            actionId,
            sourceInformation,
            skipRendererUpdate,
            overrideReadOnly: true,
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

    async recordVideoReady({
        duration,
        actionId,
        sourceInformation = {},
        skipRendererUpdate = false,
    }) {
        await this.coreFunctions.performUpdate({
            updateInstructions: [
                {
                    updateType: "updateValue",
                    componentIdx: this.componentIdx,
                    stateVariable: "state",
                    value: "stopped",
                },
                {
                    updateType: "updateValue",
                    componentIdx: this.componentIdx,
                    stateVariable: "duration",
                    value: duration,
                },
            ],
            actionId,
            sourceInformation,
            skipRendererUpdate,
            overrideReadOnly: true,
            doNotSave: true, // video actions don't count as changing doc state
        });
    }

    async playVideo({
        actionId,
        sourceInformation = {},
        skipRendererUpdate = false,
    }) {
        await this.coreFunctions.performUpdate({
            updateInstructions: [
                {
                    updateType: "updateValue",
                    componentIdx: this.componentIdx,
                    stateVariable: "state",
                    value: "playing",
                },
            ],
            actionId,
            sourceInformation,
            skipRendererUpdate,
            overrideReadOnly: true,
        });
    }

    async pauseVideo({
        actionId,
        sourceInformation = {},
        skipRendererUpdate = false,
    }) {
        await this.coreFunctions.performUpdate({
            updateInstructions: [
                {
                    updateType: "updateValue",
                    componentIdx: this.componentIdx,
                    stateVariable: "state",
                    value: "stopped",
                },
            ],
            actionId,
            sourceInformation,
            skipRendererUpdate,
            overrideReadOnly: true,
        });
    }

    async setTime({
        time,
        actionId,
        sourceInformation = {},
        skipRendererUpdate = false,
    }) {
        await this.coreFunctions.performUpdate({
            updateInstructions: [
                {
                    updateType: "updateValue",
                    componentIdx: this.componentIdx,
                    stateVariable: "time",
                    value: time,
                },
            ],
            actionId,
            sourceInformation,
            skipRendererUpdate,
            overrideReadOnly: true,
        });
    }
}
