import { DastElement, DastError } from "../../types";

export function answerSugar(node: DastElement) {
    if (node.name !== "answer") {
        // This should be unreachable
        throw Error("answer sugar can only be applied to a `<answer>`");
    }

    const typeAttr = node.attributes.type;
    if (!typeAttr) {
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

        // a reference to the fractionWatched property of the video
        const videoFractionWatchedRef = JSON.parse(JSON.stringify(videRef));
        videoFractionWatchedRef.path.push({
            type: "pathPart",
            name: "fractionWatched",
            index: [],
        });

        let videoCreditLabel: DastElement;
        const videoCreditLabelAttr = node.attributes.videoCreditLabel;
        if (videoCreditLabelAttr) {
            videoCreditLabel = {
                type: "element",
                name: "text",
                attributes: {},
                children: [
                    ...videoCreditLabelAttr.children,
                    { type: "text", value: ": " },
                ],
                position: videoCreditLabelAttr.position,
                source_doc: videoCreditLabelAttr.source_doc,
            };
        } else {
            videoCreditLabel = {
                type: "element",
                name: "text",
                attributes: {},
                children: [
                    {
                        type: "text",
                        value: "Video credit achieved: ",
                    },
                ],
            };
        }

        let answerNameAttr = node.attributes.name;
        if (!answerNameAttr) {
            const uniqueName = `__answer${Math.floor(Math.random() * 100000)}`;
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

        // Force answer to be hidden, as the only thing to be displayed is the video credit message.
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

        // Create an award that is always awarded, with credit equal to the fraction of the video watched.
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

        // Create the message to be shown to the student, which is the video credit achieved.
        const videoCreditMessage: DastElement = {
            type: "element",
            name: "span",
            attributes: {},
            children: [
                videoCreditLabel,
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

        // Create a callAction element that will submit the answer. It will be triggered whenever a segment of the video is recorded as being watched.
        // We explicitly mark the callAction as hidden so that a button does not get rendered even if the videoRef does not resolve to a valid target.
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
