import React from "react";

import { watchForResize } from "./resize-watcher";
import * as Comlink from "comlink";

import { MdError } from "react-icons/md";
import { findAllNewlines, getLineCharRange } from "@doenet/utils";
import type { ErrorRecord, WarningRecord } from "@doenet/utils";
import {
    DoenetViewerProps,
    DoenetEditorProps,
    createHtmlForDoenetViewer,
    createHtmlForDoenetEditor,
} from "./utils";

export const version: string = IFRAME_VERSION;
const latestDoenetmlVersion: string = version;

export { mathjaxConfig } from "@doenet/utils";
export type { ErrorRecord, WarningRecord };
import { detectVersionFromDoenetML } from "@doenet/parser";

import { ExternalVirtualKeyboard } from "@doenet/virtual-keyboard";
import "@doenet/virtual-keyboard/style.css";

/**
 * A message that is sent from an iframe to the parent window.
 */
type IframeMessage = {
    origin: string;
    data: Record<string, unknown>;
    subject?: string;
};

export type DoenetViewerIframeProps = DoenetViewerProps & {
    doenetML: string;
    /**
     * The URL of a standalone DoenetML bundle. This may be from the CDN.
     * If autodetectVersion is `true` and a version is detected, this URL is ignored.
     */
    standaloneUrl?: string;
    /**
     * The URL of a CSS file that styles the standalone DoenetML bundle.
     * If autodetectVersion is `true` and a version is detected, this URL is ignored.
     */
    cssUrl?: string;
    /**
     * The version of standalone DoenetML bundle if urls are not provided.
     * If autodetectVersion is `true` and a version is detected, this setting is ignored.
     */
    doenetmlVersion?: string;
    /**
     * If `true`, look for a xmlns attribute in an outer `<document>` tag
     * and use that for the doenetmlVersion,
     * overwriting any doenetmlVersion or urls provided
     */
    autodetectVersion?: boolean;
};

export type DoenetEditorIframeProps = DoenetEditorProps & {
    doenetML: string;
    /**
     * The URL of a standalone DoenetML bundle. This may be from the CDN.
     * If autodetectVersion is `true` and a version is detected, this URL is ignored.
     */
    standaloneUrl?: string;
    /**
     * The URL of a CSS file that styles the standalone DoenetML bundle.
     * If autodetectVersion is `true` and a version is detected, this URL is ignored.
     */
    cssUrl?: string;
    /**
     * The version of standalone DoenetML bundle if urls are not provided.
     * If autodetectVersion is `true` and a version is detected, this setting is ignored.
     */
    doenetmlVersion?: string;
    /**
     * If `true`, look for a xmlns attribute in an outer `<document>` tag
     * and use that for the doenetmlVersion,
     * overwriting any doenetmlVersion or urls provided
     */
    autodetectVersion?: boolean;
    /**
     * The width of the iframe (and the width of the editor-viewer widget)
     */
    width?: string;
    /**
     * The height of the iframe (and the height of the editor-viewer widget)
     */
    height?: string;
};

/**
 * Render Doenet viewer constrained to an iframe. A URL pointing to a version of DoenetML
 * standalone must be provided (along with a URL to the corresponding CSS file).
 *
 * Parameters being passed to the underlying DoenetML component are passed via the `DoenetViewerProps` prop.
 * However, only serializable parameters may be passed. E.g., callbacks **cannot** be passed to the underlying
 * DoenetML component. Instead you must use the message passing interface of `DoenetViewer` to communicate
 * with the underlying DoenetML component.
 */
export function DoenetViewer({
    doenetML,
    standaloneUrl: specifiedStandaloneUrl,
    cssUrl: specifiedCssUrl,
    doenetmlVersion: specifiedDoenetmlVersion,
    autodetectVersion = true,
    ...doenetViewerProps
}: DoenetViewerIframeProps) {
    const [id, _] = React.useState(() => Math.random().toString(36).slice(2));
    const ref = React.useRef<HTMLIFrameElement>(null);
    const [height, setHeight] = React.useState("0px");
    const [inErrorState, setInErrorState] = React.useState<string | null>(null);
    const [ignoreDetectedVersion, setIgnoreDetectedVersion] =
        React.useState(false);

    let standaloneUrl: string, cssUrl: string;
    let foundAutoVersion = false;
    let detectedVersion;

    if (autodetectVersion && !ignoreDetectedVersion) {
        let result = detectVersionFromDoenetML(doenetML);
        if (result?.version !== undefined) {
            foundAutoVersion = true;
            detectedVersion = "v" + result.version;
        }
    }

    const addVirtualKeyboard = doenetViewerProps.addVirtualKeyboard !== false;

    let selectedDoenetmlVersion =
        detectedVersion ?? specifiedDoenetmlVersion ?? latestDoenetmlVersion;

    if (specifiedStandaloneUrl && !foundAutoVersion) {
        standaloneUrl = specifiedStandaloneUrl;
    } else {
        standaloneUrl = `https://cdn.jsdelivr.net/npm/@doenet/standalone@${selectedDoenetmlVersion}/doenet-standalone.js`;
    }
    if (specifiedCssUrl && !foundAutoVersion) {
        cssUrl = specifiedCssUrl;
    } else {
        cssUrl = `https://cdn.jsdelivr.net/npm/@doenet/standalone@${selectedDoenetmlVersion}/style.css`;
    }

    React.useEffect(() => {
        const listener = (event: MessageEvent<IframeMessage>) => {
            if (event.origin !== window.location.origin) {
                return;
            }

            // forward response from SPLICE getState or requestSolutionView to iframe
            if (
                event.data.subject === "SPLICE.getState.response" ||
                event.data.subject === "SPLICE.requestSolutionView.response" ||
                event.data.subject == "SPLICE.submitAllAnswers"
            ) {
                ref.current?.contentWindow?.postMessage(event.data);
                return;
            }
            if (event.data?.origin !== id) {
                return;
            }

            const data = event.data.data;

            // If receive a scrollTo event from the iframe,
            // that means that a scroll-only link (i.e. with target of the form "#anchor")
            // was clicked on.
            // Scroll the window to desired location given the position of the iframe.
            // Note: if the iframe is in a scrollable container other than window,
            // then one should pass in a `requestScrollTo` prop to the parent DoenetViewer,
            // which will be called instead of these `scrollTo` events being sent.
            if (
                ref.current &&
                data.type === "scrollTo" &&
                typeof data.offset === "number"
            ) {
                const iframeTop =
                    ref.current.getBoundingClientRect().top + window.scrollY;
                const targetAbsoluteTop = iframeTop + data.offset;
                window.scrollTo({
                    top: targetAbsoluteTop - 20,
                    behavior: "smooth",
                });
            }

            if (data.error) {
                //@ts-ignore
                return setInErrorState(data.error);
            } else if (data.iframeReady) {
                // if `iframeReady`, then Comlink.expose has been called in the iframe
                // and we can call `renderViewerWithFunctionProps`

                if (ref.current) {
                    const viewerIframe: Comlink.Remote<{
                        renderViewerWithFunctionProps: (
                            ...args: (string | Function)[]
                        ) => void;
                    }> = Comlink.wrap(
                        Comlink.windowEndpoint(ref.current.contentWindow!),
                    );

                    // Note that Comlink is unable to send proxied functions as an values of an object,
                    // but must be direct arguments of the function.
                    // To indicate the functions names, the arguments are a series of string key names
                    // followed by the proxied function with that name.
                    const proxiedFunctions: (string | Function)[] = [];
                    for (const key in doenetViewerProps) {
                        const prop = doenetViewerProps[key];
                        if (typeof prop === "function") {
                            proxiedFunctions.push(key);
                            proxiedFunctions.push(Comlink.proxy(prop));
                        }
                    }
                    viewerIframe?.renderViewerWithFunctionProps(
                        ...proxiedFunctions,
                    );
                }
            }
        };
        if (ref.current) {
            window.addEventListener("message", listener);
        }
        const clearResize = watchForResize(ref, () => height, setHeight);

        return () => {
            window.removeEventListener("message", listener);
            clearResize();
        };
    }, []);

    if (inErrorState) {
        if (foundAutoVersion) {
            setIgnoreDetectedVersion(true);
            setInErrorState("");
            return null;
        }

        let errorIcon = (
            <MdError
                fontSize="24pt"
                color="#C1292E"
                style={{ verticalAlign: "middle" }}
            />
        );
        return (
            <div
                style={{
                    fontSize: "1.3em",
                    marginLeft: "20px",
                    marginTop: "20px",
                }}
            >
                {errorIcon} {inErrorState}
            </div>
        );
    }

    return (
        <React.Fragment>
            {addVirtualKeyboard ? <ExternalVirtualKeyboard /> : null}
            <iframe
                title="Doenet document"
                ref={ref}
                srcDoc={createHtmlForDoenetViewer(
                    id,
                    doenetML,
                    doenetViewerProps,
                    standaloneUrl,
                    cssUrl,
                )}
                style={{
                    width: "100%",
                    boxSizing: "border-box",
                    overflow: "hidden",
                    border: "none",
                    minHeight: 50,
                }}
                height={height}
            />
        </React.Fragment>
    );
}

/**
 * Render Doenet Editor constrained to an iframe. A URL pointing to a version of DoenetML
 * standalone must be provided (along with a URL to the corresponding CSS file).
 *
 * Parameters being passed to the underlying DoenetML component are passed via the `DoenetEditorProps` prop.
 * However, only serializable parameters may be passed. E.g., callbacks **cannot** be passed to the underlying
 * DoenetML component. Instead you must use the message passing interface of `DoenetEditor` to communicate
 * with the underlying DoenetML component.
 */
export function DoenetEditor({
    doenetML,
    standaloneUrl: specifiedStandaloneUrl,
    cssUrl: specifiedCssUrl,
    doenetmlVersion: specifiedDoenetmlVersion,
    width = "100%",
    height = "500px",
    autodetectVersion = true,
    ...doenetEditorProps
}: DoenetEditorIframeProps) {
    const [id, _] = React.useState(() => Math.random().toString(36).slice(2));
    const ref = React.useRef<HTMLIFrameElement>(null);
    const [inErrorState, setInErrorState] = React.useState<string | null>(null);
    const [ignoreDetectedVersion, setIgnoreDetectedVersion] =
        React.useState(false);
    const [initialErrors, setInitialErrors] = React.useState<ErrorRecord[]>([]);

    // Augment the DoenetEditor props by adding any initialErrors found
    const augmentedDoenetEditorProps = { ...doenetEditorProps };
    if (augmentedDoenetEditorProps.initialErrors) {
        augmentedDoenetEditorProps.initialErrors = [
            ...augmentedDoenetEditorProps.initialErrors,
            ...initialErrors,
        ];
    } else {
        augmentedDoenetEditorProps.initialErrors = initialErrors;
    }

    let standaloneUrl: string, cssUrl: string;
    let foundAutoVersion = false;
    let detectedVersion, detectedDoenetMLrange;

    if (autodetectVersion && !ignoreDetectedVersion) {
        let result = detectVersionFromDoenetML(doenetML);
        if (result?.version !== undefined) {
            foundAutoVersion = true;
            detectedVersion = "v" + result.version;
            detectedDoenetMLrange = result.position;
        }
    }

    const addVirtualKeyboard = doenetEditorProps.addVirtualKeyboard !== false;

    let selectedDoenetmlVersion =
        detectedVersion ?? specifiedDoenetmlVersion ?? latestDoenetmlVersion;

    if (specifiedStandaloneUrl && !foundAutoVersion) {
        standaloneUrl = specifiedStandaloneUrl;
    } else {
        standaloneUrl = `https://cdn.jsdelivr.net/npm/@doenet/standalone@${selectedDoenetmlVersion}/doenet-standalone.js`;
    }
    if (specifiedCssUrl && !foundAutoVersion) {
        cssUrl = specifiedCssUrl;
    } else {
        cssUrl = `https://cdn.jsdelivr.net/npm/@doenet/standalone@${selectedDoenetmlVersion}/style.css`;
    }

    React.useEffect(() => {
        const listener = (event: MessageEvent<IframeMessage>) => {
            if (
                event.origin !== window.location.origin ||
                event.data?.origin !== id
            ) {
                return;
            }

            const data = event.data.data;

            if (data.error) {
                //@ts-ignore
                return setInErrorState(data.error);
            } else if (data.iframeReady) {
                // if `iframeReady`, then Comlink.expose has been called in the iframe
                // and we can call `renderEditorWithFunctionProps`

                if (ref.current) {
                    const editorIframe: Comlink.Remote<{
                        renderEditorWithFunctionProps: (
                            ...args: (string | Function)[]
                        ) => void;
                    }> = Comlink.wrap(
                        Comlink.windowEndpoint(ref.current.contentWindow!),
                    );

                    // Note that Comlink is unable to send proxied functions as an values of an object,
                    // but must be direct arguments of the function.
                    // To indicate the functions names, the arguments are a series of string key names
                    // followed by the proxied function with that name.
                    const proxiedFunctions: (string | Function)[] = [];
                    for (const key in doenetEditorProps) {
                        const prop = doenetEditorProps[key];
                        if (typeof prop === "function") {
                            proxiedFunctions.push(key);
                            proxiedFunctions.push(Comlink.proxy(prop));
                        }
                    }
                    editorIframe?.renderEditorWithFunctionProps(
                        ...proxiedFunctions,
                    );
                }
            }
        };
        if (ref.current) {
            window.addEventListener("message", listener);
        }

        return () => {
            window.removeEventListener("message", listener);
        };
    }, []);

    if (inErrorState) {
        if (foundAutoVersion) {
            setIgnoreDetectedVersion(true);
            setInErrorState("");
            let message = `DoenetML version ${detectedVersion} not found.`;
            if (!specifiedStandaloneUrl) {
                message += ` Falling back to version ${specifiedDoenetmlVersion ?? latestDoenetmlVersion}`;
            }

            // add line number to the doenetML range of the error
            let allNewlines = findAllNewlines(doenetML);
            Object.assign(
                detectedDoenetMLrange!,
                getLineCharRange(detectedDoenetMLrange!, allNewlines),
            );

            setInitialErrors([
                { position: detectedDoenetMLrange!, message, type: "error" },
            ]);
            return null;
        }

        let errorIcon = (
            <MdError
                fontSize="24pt"
                color="#C1292E"
                style={{ verticalAlign: "middle", marginRight: "5px" }}
            />
        );
        return (
            <div
                style={{
                    fontSize: "1.3em",
                    marginLeft: "20px",
                    marginTop: "20px",
                }}
            >
                {errorIcon} {inErrorState}
            </div>
        );
    }

    return (
        <React.Fragment>
            {addVirtualKeyboard ? <ExternalVirtualKeyboard /> : null}
            <iframe
                title="Doenet Editor"
                ref={ref}
                srcDoc={createHtmlForDoenetEditor(
                    id,
                    doenetML,
                    width,
                    augmentedDoenetEditorProps,
                    standaloneUrl,
                    cssUrl,
                )}
                style={{
                    width,
                    boxSizing: "content-box",
                    overflow: "hidden",
                    border: "none",
                    height,
                }}
            />
        </React.Fragment>
    );
}
