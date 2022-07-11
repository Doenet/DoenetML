import init, { PublicDoenetCore } from "rust-doenet-core-wasm";
import { parseAndCompile } from "../Parser/parser";


onmessage = function (e) {
  console.log('received message', e);

  if(e.data.messageType === "createCore") {
    createCore(e.data.args)
  }
}


async function createCore(args) {


  const DoenetTextJson = parseAndCompile(args.doenetML);
    
  console.log("DoenetML as JSON\n", DoenetTextJson);

  await init();

  const dc = PublicDoenetCore.new(JSON.stringify(DoenetTextJson));
  
  const render_tree_string = dc.update_renderers();
  const render_tree = JSON.parse(render_tree_string);
  
  // console.log("JS deserialized JSON\n", render_tree_json);
  
  // let action = {
  //     componentName: "myInput",
  //     actionName: "updateValue",
  //     args: {
  //         "value": "hi there",
  //     },
  // };
  
  // dc.handle_action(JSON.stringify(action));

  console.log(render_tree);

  let updateRendererMessage = {
    messageType: "updateRenderers",
    args: {
      updateInstructions: [
        {
          instructionType: "updateRendererStates",
          rendererStatesToUpdate: [
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
            {
              componentName: "/_document1",
              stateValues: {
                submitLabel: "Check Work",
                submitLabelNoCorrectness: "Submit Response",
                hidden: false,
                disabled: false,
                fixed: false,
                titleChildName: null,
                title: "",
                level: 0,
                justSubmitted: true,
                showCorrectness: true,
                creditAchieved: 1,
                createSubmitAllButton: false,
                suppressAnswerSubmitButtons: false
              },
              childrenInstructions: [
                "\n\n  ",
                {
                  componentName: "/_text1",
                  effectiveName: "/_text1",
                  componentType: "text",
                  rendererType: "text",
                  actions: {}
                }]
            }]
        }]
    },
    init: true
  };


  for (let key in render_tree) {
    let componentRenderState = render_tree[key]
    updateRendererMessage.args.updateInstructions[0].rendererStatesToUpdate.push(componentRenderState);
  }


  postMessage(updateRendererMessage);



  postMessage({
    messageType: "initializeRenderers",
    args: {
      coreInfo: {
        generatedVariantString: "{\"index\":1,\"name\":\"a\",\"meta\":{\"createdBy\":\"/_document1\"},\"subvariants\":[]}",
        allPossibleVariants: ["a"],
        variantIndicesToIgnore: [],
        rendererTypesInDocument: ["section", "text", "number"],
        documentToRender: {
          componentName: "/_document1",
          effectiveName: "/_document1",
          componentType: "document",
          rendererType: "section",
          actions: {
            submitAllAnswers: { actionName: "submitAllAnswers", componentName: "/_document1" },
            recordVisibilityChange: { actionName: "recordVisibilityChange", componentName: "/_document1" }
          }
        }
      }
    }
  })

  postMessage({ messageType: "coreCreated" })

}