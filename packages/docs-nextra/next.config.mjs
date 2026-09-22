import nextraConfig from "nextra";
import {
    autoInsertAttrPropDescriptions,
    expandComponentListings,
    wrapDoenetExample,
    wrapDoenetEditor,
    wrapDoenetEditorHorizontal,
    wrapDoenetViewer,
} from "./dist/index.js";
import { createHighlighter, bundledLanguages, bundledThemes } from "shiki";
import fs from "node:fs";

const withNextra = nextraConfig({
    defaultShowCopyCode: true,
    latex: true,
    mdxOptions: {
        rehypePrettyCodeOptions: {
            /**
             * Add DoenetML syntax highlighting to the list of languages available under the alias
             * `doenet` and `dn`.
             */
            getHighlighter: async (options) => {
                const { langAlias = {}, themes = [], ...rest } = options;
                // Add `dn` to the language aliases.
                langAlias.dn = "doenet";

                // Add doenet-specific colors to the themes (github-light and github-dark).
                const modifiedThemes = [];
                for (const themeName of themes) {
                    const theme = await bundledThemes[themeName]();

                    // Add doenet-specific colors to the themes (github-light and github-dark).
                    theme.default.tokenColors.push({
                        scope: [
                            "string.quoted.single.xml",
                            "string.quoted.double.xml",
                            "punctuation.definition.string.begin.xml",
                            "punctuation.definition.string.end.xml",
                        ],
                        settings: {
                            foreground:
                                theme.default.colors["terminal.ansiRed"],
                        },
                    });
                    modifiedThemes.push(theme);
                }

                const highlighter = createHighlighter({
                    langAlias,
                    themes: modifiedThemes,
                    ...rest,
                    langs: [
                        ...Object.keys(bundledLanguages),
                        JSON.parse(
                            fs.readFileSync(
                                "../vscode-extension/extension/config/doenet.tmLanguage.json",
                                "utf8",
                            ),
                        ),
                    ],
                });

                return await highlighter;
            },
        },
        remarkPlugins: [
            // `expandComponentListings` runs first so `<ComponentIndex/>` and
            // `<ComponentTable .../>` are turned into real markdown headings
            // and tables before `autoInsertAttrPropDescriptions` walks the
            // tree looking for other MDX flow elements.
            expandComponentListings,
            autoInsertAttrPropDescriptions,
            wrapDoenetExample,
            wrapDoenetEditor,
            wrapDoenetEditorHorizontal,
            wrapDoenetViewer,
        ],
    },
});

let assetPrefix = "";
let basePath = "";

const fullConfig = withNextra({
    compress: false,
    productionBrowserSourceMaps: true,
    output: "export",
    assetPrefix,
    basePath,
    images: {
        unoptimized: true,
    },
});

// Nextra 3 needed a webpack override here to force a single copy of React (and
// `better-react-mathjax`) into the bundle, and to disable minification. Neither is
// needed under Nextra 4 / the App Router: Next aliases `react` and `react-dom` to
// its own vendored copies for every layer, so there is only ever one, and the
// duplicate-identifier minifier bug the override worked around was scoped to
// Next.js 14 with Nextra 3.

export default fullConfig;
