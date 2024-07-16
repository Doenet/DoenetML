import { cidFromText } from "./cid";

const textByCid: Record<string, string> = {};

export function retrieveTextFileForCid(cid: string, ext = "doenet") {
    if (textByCid[cid] !== undefined) {
        return Promise.resolve(textByCid[cid]);
    }

    // just try retrieving from server
    let resultServer = retrieveTextFileFromServer(cid, ext);
    return resultServer.promise.then((res) => {
        textByCid[cid] = res;
        return res;
    });
}

function retrieveTextFileFromServer(cid: string, ext: string) {
    let controller = new AbortController();
    let signal = controller.signal;

    let retrieveFromServer = async function () {
        try {
            let response = await fetch(`/media/${cid}.${ext}`, { signal });

            if (response.ok) {
                let doenetML = await response.text();

                let CidRetrieved = await cidFromText(doenetML);

                if (CidRetrieved === cid) {
                    return doenetML;
                } else {
                    console.warn(`cid mismatch, ${cid}, ${CidRetrieved}`);
                    return Promise.reject(new Error("cid mismatch"));
                }
            } else {
                return Promise.reject(new Error(`cid not found: ${cid}`));
            }
        } catch (e) {
            return Promise.reject(new Error(`cid not found: ${cid}`));
        }
    };

    let promise = retrieveFromServer();

    return { promise, controller };
}
