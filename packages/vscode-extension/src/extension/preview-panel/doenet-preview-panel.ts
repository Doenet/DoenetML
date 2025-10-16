// Code modified from https://github.com/microsoft/vscode-webview-ui-toolkit-samples/blob/main/frameworks/hello-world-react-vite/src/extension.ts
// MIT License

import {
    Disposable,
    Webview,
    WebviewPanel,
    window,
    Uri,
    ViewColumn,
} from "vscode";
import { getUri } from "./utils/get-uri";
import { getNonce } from "./utils/get-nonce";

/**
 * This class manages the state and behavior of DoenetPreviewPanel webview panels.
 *
 * It contains all the data and methods for:
 *
 * - Creating and rendering DoenetPreviewPanel webview panels
 * - Properly cleaning up and disposing of webview resources when the panel is closed
 * - Setting the HTML (and by proxy CSS/JavaScript) content of the webview panel
 * - Setting message listeners so data can be passed between the webview and extension
 */
export class DoenetPreviewPanel {
    public static currentPanel: DoenetPreviewPanel | undefined;
    public static currentSource: string = "Sample Code";
    private readonly _panel: WebviewPanel;
    private _disposables: Disposable[] = [];

    private constructor(panel: WebviewPanel, extensionUri: Uri) {
        this._panel = panel;

        // Set an event listener to listen for when the panel is disposed (i.e. when the user closes
        // the panel or when the panel is closed programmatically)
        this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

        // Set the HTML content for the webview panel
        this._panel.webview.html = this._getWebviewContent(
            this._panel.webview,
            extensionUri,
        );

        // Set an event listener to listen for messages passed from the webview context
        this._setWebviewMessageListener(this._panel.webview);
    }

    /**
     * Renders the current webview panel if it exists otherwise a new webview panel
     * will be created and displayed.
     *
     * @param extensionUri The URI of the directory containing the extension.
     */
    public static render(extensionUri: Uri) {
        if (DoenetPreviewPanel.currentPanel) {
            // If the webview panel already exists reveal it
            DoenetPreviewPanel.currentPanel._panel.reveal(ViewColumn.Two);
        } else {
            // If a webview panel does not already exist create and show a new one
            const panel = window.createWebviewPanel(
                // Panel view type
                "doenetPreview",
                // Panel title
                "Doenet Preview",
                // The editor column the panel should be displayed in
                ViewColumn.Two,
                // Extra panel configurations
                {
                    // Enable JavaScript in the webview
                    enableScripts: true,
                    // Restrict the webview to only load resources from the `out` and `webview-ui/build` directories
                    localResourceRoots: [Uri.joinPath(extensionUri, "build")],
                },
            );

            DoenetPreviewPanel.currentPanel = new DoenetPreviewPanel(
                panel,
                extensionUri,
            );
        }
    }

    /**
     * Cleans up and disposes of webview resources when the webview panel is closed.
     */
    public dispose() {
        DoenetPreviewPanel.currentPanel = undefined;

        // Dispose of the current webview panel
        this._panel.dispose();

        // Dispose of all disposables (i.e. commands) for the current webview panel
        while (this._disposables.length) {
            const disposable = this._disposables.pop();
            if (disposable) {
                disposable.dispose();
            }
        }
    }

    /**
     * Defines and returns the HTML that should be rendered within the webview panel.
     *
     * @remarks This is also the place where references to the React webview build files
     * are created and inserted into the webview HTML.
     *
     * @param webview A reference to the extension webview
     * @param extensionUri The URI of the directory containing the extension
     * @returns A template string literal containing the HTML that should be
     * rendered within the webview panel
     */
    private _getWebviewContent(webview: Webview, extensionUri: Uri) {
        // The CSS file from the React build output
        const stylesUri = getUri(webview, extensionUri, [
            "build",
            "preview-window",
            "assets",
            "index.css",
        ]);
        // The JS file from the React build output
        const scriptUri = getUri(webview, extensionUri, [
            "build",
            "preview-window",
            "assets",
            "index.js",
        ]);

        const nonce = getNonce();

        // Tip: Install the es6-string-html VS Code extension to enable code highlighting below
        return /*html*/ `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <meta http-equiv="Content-Security-Policy"
            content="${[
                `default-src 'none';`,
                `style-src ${webview.cspSource} 'unsafe-inline' 'self';`,
                // Note: If there is a path-name, it must end with a slash to include subfolders (e.g., https://example.com/foo will not match https://example.com/foo/bar)
                `script-src 'nonce-${nonce}' 'unsafe-eval' vscode-webview: https://*.vscode-resource.vscode-cdn.net https://cdn.jsdelivr.net/npm/mathjax@4 https://doenet.vscode-unpkg.net;`,
                `script-src-elem 'nonce-${nonce}' 'unsafe-eval' vscode-webview: https://*.vscode-resource.vscode-cdn.net https://cdn.jsdelivr.net/npm/mathjax@4 https://doenet.vscode-unpkg.net http://localhost:3000/static/devextensions/;`,
                `worker-src blob:;`,
                `connect-src blob: data:;`,
                `img-src 'self';`,
                `font-src https://cdn.jsdelivr.net/npm/mathjax@4 https://*.vscode-resource.vscode-cdn.net https://doenet.vscode-unpkg.net http://localhost:3000/static/devextensions/;`,
            ].join(" ")}"
          />
          <link rel="stylesheet" type="text/css" href="${stylesUri}">
          <title>Doenet Preview</title>
        </head>
        <body>
          <div id="root"></div>
          <script type="module" nonce="${nonce}" src="${scriptUri}"></script>
        </body>
      </html>
    `;
    }

    /**
     * Sets up an event listener to listen for messages passed from the webview context and
     * executes code based on the message that is received.
     *
     * @param webview A reference to the extension webview
     * @param context A reference to the extension context
     */
    private _setWebviewMessageListener(webview: Webview) {
        webview.onDidReceiveMessage(
            (message: any) => {
                const command = message.command;
                const text = message.text;

                switch (command) {
                    case "refresh":
                        webview.postMessage({
                            command: "setSource",
                            text: DoenetPreviewPanel.currentSource,
                        });
                        return;
                    case "ui-loaded":
                        // XXX: This timeout is a hack. A proper way to wait for the UI to load
                        // is needed.
                        setTimeout(
                            () => DoenetPreviewPanel.triggerRefresh(),
                            1000,
                        );
                        return;
                }
            },
            undefined,
            this._disposables,
        );
    }

    static triggerRefresh() {
        if (!DoenetPreviewPanel.currentPanel) {
            return;
        }
        DoenetPreviewPanel.currentPanel._panel.webview.postMessage({
            command: "setSource",
            text: DoenetPreviewPanel.currentSource,
        });
    }

    static setSource(source: string) {
        const dirty = this.currentSource !== source;
        this.currentSource = source;
        if (dirty && this.currentPanel) {
            DoenetPreviewPanel.currentPanel._panel.webview.postMessage({
                command: "dirty",
                text: "",
            });
        }
    }
}
