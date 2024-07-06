import React from "react";

export default {
    logo: <span>DoenetML Documentation</span>,
    project: {
        link: "https://github.com/shuding/nextra",
    },
    head: (
        <>
            <script
                type="module"
                src="https://dev.doenet.org/cdn/doenet-standalone.js"
            >
                {" "}
            </script>
            <link
                rel="stylesheet"
                href="https://dev.doenet.org/cdn/style.css"
            />
        </>
    ),
    sidebar: {
        defaultMenuCollapseLevel: "1",
        "auto collapse": true,
    },
    // ... other theme options
};
