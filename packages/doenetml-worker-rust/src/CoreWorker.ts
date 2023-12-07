import init, { PublicDoenetMLCore } from "../pkg/doenetml_worker_rust";

let doenetCore: PublicDoenetMLCore;

let coreBaseArgs;

onmessage = function (e) {
    if (e.data.messageType == "requestAction") {
        // Assuming doenetCore has already been initialized
        // console.log(e.data.args);
        // handleAction(e.data.args);
        // For debugging only
        // this.debugStateValues = JSON.parse(doenetCore.display_all_state());
    } else if (e.data.messageType === "createCore") {
        createCore(e.data.args);
    } else if (e.data.messageType === "initializeWorker") {
        initializeWorker(e.data.args);
    }
};

async function createCore(args) {
    console.log("create core", args);
    await init();

    try {
        doenetCore = PublicDoenetMLCore.new(
            JSON.stringify(coreBaseArgs.dast),
            coreBaseArgs.doenetML,
            JSON.stringify(coreBaseArgs.flags),
        );
    } catch (err) {
        console.error(err);
        postMessage({ messageType: "inErrorState", errMsg: err.message });
        return;
    }

    let dast = JSON.parse(doenetCore.return_dast());

    postMessage({ messageType: "coreCreated", args: { dast } });
}

// Note: we separate initializeWorker from createCore
// so that we can call other analysis functions (such as determine variants)
// even without creating the core.
// (These analysis functions are not yet implemented)
async function initializeWorker({ doenetML, dast, flags }) {
    coreBaseArgs = {
        doenetML,
        dast,
        flags,
    };

    postMessage({
        messageType: "initialized",
    });
}
