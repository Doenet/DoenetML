export * from "./index";
import { doenetGlobalConfig } from "./global-config";
// @ts-ignore
import workerSource from "@doenet/doenetml-worker/CoreWorker.js?raw";

// We make a blob URL directly from the source code of the worker. This way we don't
// need to load any other files
const workerBlobUrl = URL.createObjectURL(
    new Blob([workerSource], { type: "application/javascript" }),
);
doenetGlobalConfig.doenetWorkerUrl = workerBlobUrl;
