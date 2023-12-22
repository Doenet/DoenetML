export function prerenderActivity({ cid, doenetId, flags }) {
    // TODO - do we need to move this web worker to an iife as well?
    // see - https://github.com/Doenet/DoenetML/pull/69
    let worker = new Worker("/utils/prerenderWorker.js", { type: "module" });

    // console.log(`Prerendering activity`, cid, doenetId, flags, worker);

    worker.postMessage({
        messageType: "prerenderActivity",
        args: {
            cid,
            doenetId,
            flags,
        },
    });

    worker.onmessage = function (e) {
        if (e.data.messageType === "finished") {
            worker.terminate();
        } else if (e.data.messageType === "error") {
            console.error(e.data.message);
            worker.terminate();
        }
    };

    return worker;
}
