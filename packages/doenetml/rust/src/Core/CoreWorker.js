import init, { PublicDoenetCore } from "../../pkg";
import { parseAndCompile } from "@doenet/parser";

let doenetCore;

onmessage = function (e) {
    console.log("received message", e);

    if (e.data.messageType === "createCore") {
        createCore(e.data.args);
    } else if (e.data.messageType == "requestAction") {
        // Assuming doenetCore has already been initialized
        // console.log(e.data.args);
        handleAction(e.data.args);

        // For debugging only
        // this.debugStateValues = JSON.parse(doenetCore.display_all_state());
    }
};

async function createCore(args) {
    const DoenetTextJson = parseAndCompile(args.doenetML);
    // console.log("DoenetML as JSON\n", DoenetTextJson);

    await init();

    try {
        doenetCore = PublicDoenetCore.new(JSON.stringify(DoenetTextJson));
    } catch (err) {
        console.error(err);
        return;
    }

    // console.log("received doenet core warnings", doenetCore[1]);

    for (let warning of doenetCore[1]) {
        console.warn(warning);
    }

    const render_tree_string = doenetCore.update_renderers();
    const render_tree = JSON.parse(render_tree_string);
    console.log("CoreWorker received render tree", render_tree);

    // console.log("Render tree from rust", render_tree);

    let rendererStates = [];
    for (let key in render_tree) {
        let componentRenderState = render_tree[key];

        if (componentRenderState.componentName === "/_document1") {
            // We don't know how to represent null SVs in Rust yet
            componentRenderState.childrenInstructions.push("\n\n ");
            componentRenderState.stateValues.titleChildName = null;
        }
        rendererStates.push(componentRenderState);
    }

    let updateRendererMessage = {
        messageType: "updateRenderers",
        args: {
            updateInstructions: [
                {
                    instructionType: "updateRendererStates",
                    rendererStatesToUpdate: rendererStates,
                    // rendererStatesToUpdate: [
                    // {
                    //   componentName: "/_text1",
                    //   stateValues:
                    //   {
                    //     hidden: false,
                    //     disabled: false,
                    //     fixed: false,
                    //     text: "Hello World!"
                    //   },
                    //   childrenInstructions: []
                    // },
                    // {
                    //   childrenInstructions: [
                    //     "\n\n  ",
                    //     {
                    //       actions: {
                    //         // updateImmediateValue: {
                    //         //   actionName: "updateImmediateValue",
                    //         //   componentName: "/_textInput1",
                    //         // }
                    //       },
                    //       componentName: "/_textInput1",
                    //       componentType: "textInput",
                    //       effectiveName: "/_textInput1",
                    //       rendererType: "textInput",

                    //     }
                    //   ],
                    //   componentName: "/_document1",
                    //   stateValues: {
                    //     submitLabel: "Check Work",
                    //     submitLabelNoCorrectness: "Submit Response",
                    //     hidden: false,
                    //     disabled: false,
                    //     fixed: false,
                    //     titleChildName: null,
                    //     title: "",
                    //     level: 0,
                    //     justSubmitted: true,
                    //     showCorrectness: true,
                    //     creditAchieved: 1,
                    //     createSubmitAllButton: false,
                    //     suppressAnswerSubmitButtons: false
                    //   },

                    // }
                    // ]
                },
            ],
        },
        init: true,
    };

    // console.log("Renderer message", JSON.stringify(updateRendererMessage, null, 2));

    postMessage(updateRendererMessage);

    postMessage({
        messageType: "initializeRenderers",
        args: {
            coreInfo: {
                generatedVariantString:
                    '{"index":1,"name":"a","meta":{"createdBy":"/_document1"},"subvariants":[]}',
                allPossibleVariants: ["a"],
                variantIndicesToIgnore: [],
                // For now, just assume we've got all the render types
                rendererTypesInDocument: [
                    "section",
                    "text",
                    "number",
                    "textInput",
                ],
                documentToRender: {
                    componentName: "/_document1",
                    effectiveName: "/_document1",
                    componentType: "document",
                    rendererType: "section",
                    actions: {
                        submitAllAnswers: {
                            actionName: "submitAllAnswers",
                            componentName: "/_document1",
                        },
                        recordVisibilityChange: {
                            actionName: "recordVisibilityChange",
                            componentName: "/_document1",
                        },
                    },
                },
            },
        },
    });

    postMessage({ messageType: "coreCreated" });

    // console.log("Components", JSON.parse(doenetCore.component_tree_as_json_string()));
}

function handleAction(args) {
    let completedActionId = doenetCore.handle_action(JSON.stringify(args));

    // Right now this returns every component
    const render_tree_string = doenetCore.update_renderers();
    const render_tree = JSON.parse(render_tree_string);
    console.log("CoreWorker recieved render tree", render_tree);

    let rendererStates = [];
    for (let key in render_tree) {
        let componentRenderState = render_tree[key];

        if (componentRenderState.componentName === "/_document1") {
            // We don't know how to represent null SVs in Rust yet
            componentRenderState.childrenInstructions.push("\n\n ");
            componentRenderState.stateValues.titleChildName = null;
        }
        rendererStates.push(componentRenderState);
    }

    let updateRendererMessage = {
        messageType: "updateRenderers",
        args: {
            updateInstructions: [
                {
                    instructionType: "updateRendererStates",
                    rendererStatesToUpdate: rendererStates,
                },
            ],
        },
    };

    postMessage(updateRendererMessage);
}

export function logJson(label, json_string) {
    console.log(label, JSON.parse(json_string));
}
