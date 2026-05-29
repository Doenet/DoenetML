import { loadPyodide, PyodideInterface } from "pyodide";
import { _PrefigBrowserApi } from "@doenet/prefigure";
import { visit } from "unist-util-visit";

// The required python packages that are not part of pyodide's standard library.
// @ts-ignore
import rawZipImport from "../python/dist/pretext_wasm-0.1.0-py3-none-any.whl?uint8array&base64";
const rawZip = rawZipImport as Uint8Array;
// @ts-ignore
import rawMicropipImport from "./assets/micropip-0.7.1-py3-none-any.whl?uint8array&base64";
const rawMicropip = rawMicropipImport as Uint8Array;
// @ts-ignore
import rawPackagingImport from "./assets/packaging-24.2-py3-none-any.whl?uint8array&base64";
const rawPackaging = rawPackagingImport as Uint8Array;
// @ts-ignore
import rawLxmlImport from "./assets/lxml-5.2.1-cp312-cp312-pyodide_2024_0_wasm32.whl?uint8array&base64";
const rawLxml = rawLxmlImport as Uint8Array;

// @ts-ignore
import rawPrefigImport from "../../prefigure/pyodide_packages/prefig-0.5.15-py3-none-any.whl?uint8array&base64";
const rawPrefig = rawPrefigImport as Uint8Array;

type PyodideAPI = Awaited<ReturnType<typeof loadPyodide>>;
type Options = Parameters<typeof loadPyodide>[0];

// Get some default templates
import mainPtxDefault from "../python/pretext_wasm/templates/hello/source/main.ptx?raw";
import publicationPtxDefault from "../python/pretext_wasm/templates/hello/publication/publication.ptx?raw";
import rehypeParse from "rehype-parse";
import type {
    Element as HastElement,
    Nodes as HastNodes,
    Root as HastRoot,
    Text as HastText,
} from "hast";
import { unified } from "unified";
import rehypeStringify from "rehype-stringify";
export { mainPtxDefault, publicationPtxDefault };

const MAIN_PTX_PATH = "/home/pyodide/tmp_compile/main.ptx";
const PUBLICATION_PTX_PATH = "/home/pyodide/tmp_compile/publication.ptx";
const OUT_DIR = "/home/pyodide/tmp_compile/out";

const DECODER = new TextDecoder();

/**
 * A class for compiling a PreTeXt file using a WASM implementation of python.
 */
export class PtxCompiler {
    pyodide: PyodideAPI | null = null;
    _pyodide: ReturnType<typeof loadPyodide> | null = null;
    pyodideInitPromise: Promise<void> | null = null;

    /**
     * @param pyodidePromise Optionally pass in an instance of `loadPyodide` to use a custom configuration.
     */
    constructor(pyodidePromise?: ReturnType<typeof loadPyodide>) {
        if (pyodidePromise) {
            this._pyodide = pyodidePromise;
        }
    }

    /**
     * Initialize the compiler. This is safe to call multiple times.
     */
    async init(options: Options = { indexURL: "./assets/" }) {
        // Wait for any other initialization to finish
        await this.pyodideInitPromise;
        // No initialization if already initialized
        if (this.pyodide) {
            return;
        }

        this.pyodideInitPromise = new Promise(async (resolve, reject) => {
            try {
                // Prefer `._pyodide` over creating a new pyodide instance
                // since `._pyodide` was provided by the user.
                this.pyodide =
                    (await this._pyodide) || (await loadPyodide(options));
                await this.pyodide.unpackArchive(rawZip, "zip");
                await this.pyodide.unpackArchive(rawMicropip, "zip");
                await this.pyodide.unpackArchive(rawPackaging, "zip");
                await this.pyodide.unpackArchive(rawLxml, "zip");
                this.pyodide.FS.mkdir("./tmp_compile");
                this.pyodide.FS.mkdir("./tmp_compile/generated-assets");
                this.pyodide.FS.mkdir("./tmp_compile/assets");
                this.pyodide.FS.mkdir("./tmp_compile/out");

                // Load all PreFigure dependencies
                await this.pyodide.unpackArchive(rawPrefig, "zip");

                await this.pyodide.loadPackage(
                    [
                        // Already loaded as part of PreTeXt.
                        // "micropip",
                        // "packaging",
                        // "lxml",
                        "numpy",
                        "scipy",
                        "shapely",
                        "click",
                        "networkx",
                    ],
                    {
                        messageCallback: () => {
                            // Silence Pyodide package progress logs in production usage.
                        },
                    },
                );
                const prefigBrowserApi = new _PrefigBrowserApi();
                await prefigBrowserApi.initFinished;
                this.pyodide.registerJsModule(
                    "prefigBrowserApi",
                    prefigBrowserApi,
                );
            } catch (e) {
                reject(e);
            }

            resolve();
        });

        await this.pyodideInitPromise;
    }

    _checkInit(): asserts this is { pyodide: PyodideAPI } {
        if (!this.pyodide) {
            throw new Error("Compiler not initialized");
        }
    }

    /**
     * Set `main.ptx` to the given string. If no string is provided, a default "hello world" template is used.
     */
    setMainPtx(contents: string = mainPtxDefault) {
        this._checkInit();
        this.pyodide.FS.writeFile(MAIN_PTX_PATH, contents);
    }

    /**
     * Get the contents of `main.ptx`.
     */
    getMainPtx() {
        this._checkInit();
        return this.pyodide.FS.readFile(MAIN_PTX_PATH);
    }

    /**
     * Set `publication.ptx` to the given string. If no string is provided, a default template is used.
     */
    setPublicationPtx(contents: string = publicationPtxDefault) {
        this._checkInit();
        this.pyodide.FS.writeFile(PUBLICATION_PTX_PATH, contents);
    }

    /**
     * Get the contents of `publication.ptx`.
     */
    getPublicationPtx() {
        this._checkInit();
        return this.pyodide.FS.readFile(PUBLICATION_PTX_PATH);
    }

    /**
     * Complile the PreTeXt source as well as any PreFigure figures.
     */
    async full_compile() {
        await this.compile_pretext();
        await this.compile_prefigure();

        return this.getHtmlWithInlineSvg();
    }

    /**
     * Compile the PreTeXt file.
     */
    async compile_pretext() {
        this._checkInit();
        // Check that `main.ptx` and `publication.ptx` exist.
        if (!this.pyodide.FS.findObject("/home/pyodide/tmp_compile/main.ptx")) {
            this.setMainPtx();
        }
        if (
            !this.pyodide.FS.findObject(
                "/home/pyodide/tmp_compile/publication.ptx",
            )
        ) {
            this.setPublicationPtx();
        }
        await this.pyodide.runPythonAsync(`
            import pretext_wasm
            pretext_wasm.compile("${MAIN_PTX_PATH}", "${PUBLICATION_PTX_PATH}")
        `);
    }

    /**
     * Compile the PreTeXt file.
     */
    async compile_prefigure() {
        this._checkInit();
        // Check that `main.ptx` and `publication.ptx` exist.
        if (!this.pyodide.FS.findObject("/home/pyodide/tmp_compile/main.ptx")) {
            this.setMainPtx();
        }
        if (
            !this.pyodide.FS.findObject(
                "/home/pyodide/tmp_compile/publication.ptx",
            )
        ) {
            this.setPublicationPtx();
        }
        await this.pyodide.runPythonAsync(`
            import pretext_wasm
            pretext_wasm.compile_prefigure("${MAIN_PTX_PATH}", "${PUBLICATION_PTX_PATH}")
        `);
    }

    /**
     * Returns the compiled HTML but references to svg's have been inlined.
     */
    async getHtmlWithInlineSvg() {
        const html = this.getHtml();
        // Use a DOM parser to find all svg references and inline them.
        // This must be done in a web-worker compatible way
        const processedHtml = await unified()
            .use(rehypeParse)
            .use(() => (tree) => {
                visit(tree, "element", (node: HastElement) => {
                    if (node.tagName === "script") {
                        const content = hastToString(node.children);
                        // eBookConfig declarations aren't needed
                        if (content.includes("eBookConfig")) {
                            hastMutateToEmptyString(node);
                        }
                    }
                    if (node.tagName === "nav") {
                        // The navbar isn't needed
                        hastMutateToEmptyString(node);
                    }
                    // If an element has a class that includes "diagcess__instructions", it isn't needed
                    if (
                        hastElementContainsClass(
                            node,
                            "diagcess__instructions",
                        ) ||
                        hastElementContainsClass(node, "autopermalink") ||
                        hastElementContainsClass(node, "ptx-content-footer") ||
                        hastElementContainsClass(node, "ptx-page-footer")
                    ) {
                        hastMutateToEmptyString(node);
                    }

                    // Inline svg images creatd by PreFigure. Thee have a class of `ChemAccess-element`
                    // The name of the to-be-inlined svg is in the `data-src` attribute
                    if (hastElementContainsClass(node, "ChemAccess-element")) {
                        const dataSrc = node.properties["dataSrc"];
                        if (typeof dataSrc === "string") {
                            console.log("Inlining svg for", dataSrc);
                            try {
                                const svgContent =
                                    this.getRenderedFile(dataSrc);
                                const svgNode = unified()
                                    .use(rehypeParse, { fragment: true })
                                    .parse(svgContent);
                                // Replace the node with the contents of the svg file
                                const svg =
                                    svgNode.children as HastElement["children"];
                                node.children = [
                                    {
                                        type: "element",
                                        tagName: "div",
                                        properties: { className: "svg" },
                                        children: svg,
                                    },
                                ];
                            } catch (e) {
                                console.error(
                                    "Error inlining svg ",
                                    dataSrc,
                                    e,
                                );
                            }
                        }
                    }

                    if (node.tagName === "link") {
                        console.log("Found link tag with properties", node);
                    }

                    // Inline the stylesheets that are locally referenced.
                    if (
                        node.tagName === "link" &&
                        String(node.properties.rel).includes("stylesheet") &&
                        typeof node.properties.href === "string" &&
                        node.properties.href.startsWith("_static")
                    ) {
                        console.log(
                            "Inlining stylesheet ",
                            node.properties.href,
                        );
                        const href = node.properties.href;
                        try {
                            const cssContent = this.getRenderedFile(href);
                            // Change the element ot a <style> element with the correct contents.
                            node.tagName = "style";
                            node.properties = {};
                            node.children = [
                                {
                                    type: "text",
                                    value: cssContent,
                                },
                            ];
                        } catch (e) {
                            console.error(
                                "Error inlining stylesheet for",
                                href,
                                e,
                            );
                        }
                    }
                });
            })
            .use(rehypeStringify)
            .process(html);
        return processedHtml.toString();
    }

    /**
     * Get a file by path as a string. The path should be relative to the output directory.
     * That is, you should supply the same path that the PreTeXt-rendered HTML would use.
     *
     * This can be used to get image assets, like svgs, which are referenced by the compiled HTML.
     */
    getRenderedFile(path: string) {
        this._checkInit();
        return DECODER.decode(this.pyodide.FS.readFile(`${OUT_DIR}/${path}`));
    }

    /**
     * Get the compiled HTML.
     */
    getHtml() {
        this._checkInit();
        const allFiles = this.pyodide.FS.readdir(OUT_DIR).filter(
            (f: string) => f !== "." && f !== "..",
        );
        if (allFiles.includes("index.html")) {
            // We need to find the "root" file. If there is an `index.html` with a
            //    `<meta http-equiv="refresh" content="0; URL='hello-world.html'">`
            // style redirect element. Find the redirect URL and return the corresponding HTML.
            const indexHtml = DECODER.decode(
                this.pyodide.FS.readFile(`${OUT_DIR}/index.html`),
            );
            const redirectMatch = indexHtml.match(/URL='([^']+)'/);
            if (redirectMatch) {
                const redirectUrl = redirectMatch[1];
                return DECODER.decode(
                    this.pyodide.FS.readFile(`${OUT_DIR}/${redirectUrl}`),
                );
            }
            // Try actual DOM parsing

            try {
                const parser = new DOMParser();
                const doc = parser.parseFromString(indexHtml, "text/html");
                const redirectElm = doc.querySelector(
                    "meta[http-equiv=refresh]",
                );
                if (!redirectElm) {
                    throw new Error("No redirect element found");
                }
                const redirectUrl =
                    redirectElm.getAttribute("URL") ||
                    redirectElm.getAttribute("url");
                if (redirectUrl) {
                    return DECODER.decode(
                        this.pyodide.FS.readFile(`${OUT_DIR}/${redirectUrl}`),
                    );
                }
            } catch {}
        }

        if (allFiles.includes("root-1-1.html")) {
            // Guess root-1-1.html file
            return DECODER.decode(
                this.pyodide.FS.readFile(
                    "/home/pyodide/tmp_compile/out/root-1-1.html",
                ),
            );
        }

        // Last guess is the first html file in the output directory
        const htmlFile = allFiles.find((f: string) => f.endsWith(".html"));
        if (htmlFile) {
            return DECODER.decode(
                this.pyodide.FS.readFile(`${OUT_DIR}/${htmlFile}`),
            );
        }

        throw new Error(
            "No HTML file found in output. List of all output files: " +
                allFiles.join(", "),
        );
    }

    /**
     * Returns the HTML but references to local style sheets/javascript are replaced by blob URLs
     * containing the contents of the requested files.
     */
    getHtmlWithLocalReferences() {
        this._checkInit();
        const rawHtml = this.getHtml();
        // If we are run in a WebWorker, we might not have access to the DOMParser. We still want to return something
        // sensible.
        try {
            const parser = new DOMParser();
            const doc = parser.parseFromString(rawHtml, "text/html");
            // Loop through all the CSS tags and replace the href with a blob URL if applicable
            for (const link of doc.querySelectorAll("link[rel=stylesheet]")) {
                const href = link.getAttribute("href");
                const path = `${OUT_DIR}/${href}`;
                if (!this.pyodide.FS.findObject(path)) {
                    continue;
                }
                const cssFile = DECODER.decode(this.pyodide.FS.readFile(path));
                const blob = new Blob([cssFile], { type: "text/css" });
                const blobUrl = URL.createObjectURL(blob);
                link.setAttribute("href", blobUrl);
            }

            // Loop through all the script tags and replace the src with a blob URL if applicable
            for (const script of doc.querySelectorAll("script")) {
                const src = script.getAttribute("src");
                const path = `${OUT_DIR}/${src}`;
                if (!this.pyodide.FS.findObject(path)) {
                    continue;
                }
                const jsFile = DECODER.decode(this.pyodide.FS.readFile(path));
                const blob = new Blob([jsFile], { type: "text/javascript" });
                const blobUrl = URL.createObjectURL(blob);
                script.setAttribute("src", blobUrl);
            }

            return doc.documentElement.outerHTML;
        } catch (e) {
            console.error(e);
            return rawHtml;
        }
    }
}

/**
 * Convert a HAST node or array of nodes into a string of HTML.
 */
function hastToString(node: HastNodes | HastElement["children"]): string {
    if (Array.isArray(node)) {
        node = { type: "root", children: node };
    }
    const processedHtml = unified()
        .use(rehypeStringify)
        .stringify(node as HastRoot);
    return processedHtml;
}

/**
 * Mutate a `node` in place and turn it into an empty text node. When stringified this effectively deletes
 * the node.
 */
function hastMutateToEmptyString(node: HastRoot["children"][number]): void {
    const _node = node as HastText;
    _node.type = "text";
    _node.value = "";
    delete (_node as any).tagName;
    delete (_node as any).properties;
    delete (_node as any).children;
}

/**
 * Returns whether the given HAST element has `className` included in its html `class` attribute.
 */
function hastElementContainsClass(
    node: HastElement,
    className: string,
): boolean {
    const classNames = node.properties?.className;
    if (Array.isArray(classNames)) {
        return classNames.includes(className);
    }
    if (typeof classNames === "string") {
        return classNames.split(" ").includes(className);
    }
    return false;
}
