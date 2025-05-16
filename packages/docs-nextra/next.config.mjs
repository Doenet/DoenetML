import nextraConfig from "nextra";
import {
    autoInsertAttrPropDescriptions,
    wrapDoenetExample,
    wrapDoenetEditor,
    wrapDoenetEditorHorizontal,
    wrapDoenetViewer,
} from "./dist/index.js";
import { getHighlighter, bundledLanguages, bundledThemes } from "shiki";
import fs from "node:fs";

const withNextra = nextraConfig({
    theme: "nextra-theme-docs",
    themeConfig: "./theme.config.tsx",
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

                const highlighter = getHighlighter({
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
            autoInsertAttrPropDescriptions,
            wrapDoenetExample,
            wrapDoenetEditor,
            wrapDoenetEditorHorizontal,
            wrapDoenetViewer,
        ],
        rehypePlugins: [
            /**
             * Add any data in `extraSearchData` to `structurizedData` so that it shows up in the search box.
             * The format of `structuredData` is `Record<"id#Title", string>`. where `id` is the id of the page anchor,
             * `title` is the display text of the heading in the search bar, and `string` is the text that will be searched.
             * `extraSearchData` is structured in the same way.
             *
             * Newlines in `string` will cause search items to be separated so they don't all show up at once.
             */
            () => (tree, file) => {
                if (file.data.extraSearchData && file.data.structurizedData) {
                    const structurizedData = file.data.structurizedData;
                    for (const [key, val] of Object.entries(
                        file.data.extraSearchData,
                    )) {
                        structurizedData[key] ??= "";
                        structurizedData[key] += val;
                    }
                }
            },
            /**
             * Remove any instances of `{:dn}` or `{:doenet}` that occur in the search text. These
             * are not stripped out, which is a mistake.
             */
            () => (tree, file) => {
                if (file.data.structurizedData) {
                    for (const [key, val] of Object.entries(
                        file.data.structurizedData,
                    )) {
                        if (val?.match(/({:dn})|({:doenet})/)) {
                            const replaced = val.replace(
                                /({:dn})|({:doenet})/g,
                                "",
                            );
                            file.data.structurizedData[key] = replaced;
                        }
                        // The key also might need replacing. It is of the form `id#Title`. We only want to replace things in `Title`.
                        const [id, title] = key.split("#");
                        if (title?.match(/({:dn})|({:doenet})/)) {
                            const replaced = title.replace(
                                /({:dn})|({:doenet})/gi,
                                "",
                            );
                            const newKey = `${id}#${replaced}`;
                            file.data.structurizedData[newKey] =
                                file.data.structurizedData[key];
                            delete file.data.structurizedData[key];
                        }
                    }
                }
            },
        ],
    },
});

// module.exports = require('nextra')({
//     latex: true
//   });
//

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
// 2025-05-15 With Next.js 14 and Nextra 3, minification results in an error about
// a duplicate identifier `e`. Preventing minification seems to fix the issue.
// Since Nextra deeply modifies the Next.js config webpack config, we
// apply its configuration and then our own.
// Replace the webpack config with the one that prevents minification
const nextraWebpackConfig = fullConfig.webpack;
fullConfig.webpack = (config, options) => {
    const newConfig = nextraWebpackConfig(config, options);
    newConfig.optimization.minimizer = [];
    newConfig.optimization.minimize = false;
    return config;
};

export default fullConfig;
