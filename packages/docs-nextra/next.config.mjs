import nextraConfig from "nextra";
import { autoInsertAttrPropDescriptions } from "./dist/index.js";

const withNextra = nextraConfig({
    theme: "nextra-theme-docs",
    themeConfig: "./theme.config.tsx",
    defaultShowCopyCode: true,
    latex: true,
    mdxOptions: {
        remarkPlugins: [autoInsertAttrPropDescriptions],
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
        ],
    },
});

// module.exports = require('nextra')({
//     latex: true
//   });

export default withNextra();

// If you have other Next.js configurations, you can pass them as the parameter:
// module.exports = withNextra({ /* other next.js config */ })
