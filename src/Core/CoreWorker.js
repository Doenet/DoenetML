
onmessage = function (e) {
  console.log('received message', e);

  if(e.data.messageType === "createCore") {
    createCore(e.data.args)
  }


}


function createCore(args) {

  postMessage({
    messageType: "updateRenderers",
    args: {
      updateInstructions: [
        {
          instructionType: "updateRendererStates",
          rendererStatesToUpdate: [
            {
              componentName: "/_text1",
              stateValues:
              {
                hidden: false,
                disabled: false,
                fixed: false,
                text: "Hello World!"
              },
              childrenInstructions: []
            },
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
  })

  postMessage({
    messageType: "initializeRenderers",
    args: {
      coreInfo: {
        generatedVariantString: "{\"index\":1,\"name\":\"a\",\"meta\":{\"createdBy\":\"/_document1\"},\"subvariants\":[]}",
        allPossibleVariants: ["a"],
        variantIndicesToIgnore: [],
        rendererTypesInDocument: ["section", "text"],
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