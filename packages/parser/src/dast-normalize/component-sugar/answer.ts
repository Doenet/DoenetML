import { DastElement, DastError } from "../../types";

export function answerSugar(node: DastElement) {
    if (node.name !== "answer") {
        // This should be unreachable
        throw Error("answer sugar can only be applied to a `<answer>`");
    }

    const typeAttr = node.attributes.type;
    if (!typeAttr) {
        // If there is no type attribute, don't do anything. Just return.
        return;
    }

    const typeChildren = typeAttr.children;
    if (
        typeChildren.length === 1 &&
        typeChildren[0].type === "text" &&
        typeChildren[0].value === "videoWatched"
    ) {
        // If node already has an award child, then skip applying sugar.
        // This is to prevent the sugar from being applied multiple times,
        // which will happen since we are moving the original answer to a child of a new span element.
        if (
            node.children.find(
                (child) => child.type === "element" && child.name === "award",
            )
        ) {
            return;
        }

        const videoAttr = node.attributes.video;
        if (!videoAttr) {
            const dastError: DastError = {
                type: "error",
                message:
                    "Answer with type videoWatched must have a video attribute",
                position: node.position,
            };

            node.children.unshift(dastError);

            return;
        }

        const videoChildren = videoAttr.children;
        if (videoChildren.length !== 1 || videoChildren[0].type !== "macro") {
            const dastError: DastError = {
                type: "error",
                message:
                    "Answer with type videoWatched must have video attribute that is a reference",
                position: videoAttr.position,
            };
            node.children.unshift(dastError);

            return;
        }

        const videRef = videoChildren[0];

        // add fractionWatched reference to the video macro and rename the attribute to credit
        const videoFractionWatchedRef = JSON.parse(JSON.stringify(videRef));
        videoFractionWatchedRef.path.push({
            type: "pathPart",
            name: "fractionWatched",
            index: [],
        });

        let videoCreditLabel = "Video credit achieved";
        const videoCreditLabelAttr = node.attributes.videoCreditLabel;
        if (videoCreditLabelAttr) {
            const videoCreditLabelChildren = videoCreditLabelAttr.children;
            if (
                videoCreditLabelChildren.length === 1 &&
                videoCreditLabelChildren[0].type === "text"
            ) {
                videoCreditLabel = videoCreditLabelChildren[0].value;
            }
        }
        videoCreditLabel = videoCreditLabel + ": ";

        let answerNameAttr = node.attributes.name;
        if (!answerNameAttr) {
            const uniqueName = `__answer${Math.floor(Math.random() * 1000000)}`;
            answerNameAttr = node.attributes.name = {
                type: "attribute",
                name: "name",
                children: [
                    {
                        type: "text",
                        value: uniqueName,
                    },
                ],
            };
        }

        if (
            answerNameAttr.children.length !== 1 ||
            answerNameAttr.children[0].type !== "text"
        ) {
            const dastError: DastError = {
                type: "error",
                message: "Answer name attribute must have a single text child",
                position: answerNameAttr.position,
            };
            node.children.unshift(dastError);
            return;
        }

        // force answer to be hidden
        node.attributes.hide = {
            type: "attribute",
            name: "hide",
            children: [
                {
                    type: "text",
                    value: "true",
                },
            ],
        };

        const answerName = answerNameAttr.children[0].value;

        node.children.push({
            type: "element",
            name: "award",
            attributes: {
                credit: {
                    type: "attribute",
                    name: "credit",
                    children: [videoFractionWatchedRef],
                },
            },
            children: [
                {
                    type: "element",
                    name: "when",
                    attributes: {},
                    children: [{ type: "text", value: "true" }],
                },
            ],
        });

        const videoCreditMessage: DastElement = {
            type: "element",
            name: "span",
            attributes: {},
            children: [
                {
                    type: "text",
                    value: videoCreditLabel,
                },
                {
                    type: "element",
                    name: "number",
                    attributes: {
                        displayDecimals: {
                            type: "attribute",
                            name: "displayDecimals",
                            children: [
                                {
                                    type: "text",
                                    value: "1",
                                },
                            ],
                        },
                    },
                    children: [
                        videoFractionWatchedRef,
                        { type: "text", value: "*100" },
                    ],
                },
                {
                    type: "text",
                    value: "%",
                },
            ],
        };

        const callActionElement: DastElement = {
            type: "element",
            name: "callAction",
            children: [],
            attributes: {
                actionName: {
                    type: "attribute",
                    name: "actionName",
                    children: [
                        {
                            type: "text",
                            value: `submitAnswer`,
                        },
                    ],
                },
                triggerWith: {
                    type: "attribute",
                    name: "triggerWith",
                    children: [videRef],
                },
                target: {
                    type: "attribute",
                    name: "target",
                    children: [
                        {
                            type: "macro",
                            path: [
                                {
                                    type: "pathPart",
                                    name: answerName,
                                    index: [],
                                },
                            ],
                            attributes: {},
                        },
                    ],
                },
                // For updateValue to be hidden. Otherwise, if `videoRef` does not match a target,
                // then a button would be rendered.
                hide: {
                    type: "attribute",
                    name: "hide",
                    children: [
                        {
                            type: "text",
                            value: "true",
                        },
                    ],
                },
            },
        };

        // Wrap answer, videoCreditMessage and callActionElement in a span
        // To do this, we have to change `node` in place and create a new element for `answer`
        const answerElement: DastElement = {
            type: "element",
            name: "answer",
            attributes: node.attributes,
            children: node.children,
            position: node.position,
            source_doc: node.source_doc,
        };

        node.name = "span";
        node.attributes = {};
        node.children = [answerElement, videoCreditMessage, callActionElement];
    }
}
