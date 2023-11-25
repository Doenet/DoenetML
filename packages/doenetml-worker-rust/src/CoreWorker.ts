import init, { PublicDoenetCore } from "../pkg/doenetml_worker_rust";

let doenetCore: PublicDoenetCore;

onmessage = function (e) {
    console.log("received message", e);

    if (e.data.messageType === "createCore") {
        createCore(e.data.args);
    } else if (e.data.messageType == "requestAction") {
        // Assuming doenetCore has already been initialized
        // console.log(e.data.args);
        // handleAction(e.data.args);
        // For debugging only
        // this.debugStateValues = JSON.parse(doenetCore.display_all_state());
    }
};

async function createCore(args) {
    console.log("create core", args);
    await init();

    try {
        doenetCore = PublicDoenetCore.new("hello");
    } catch (err) {
        console.error(err);
        return;
    }
}
