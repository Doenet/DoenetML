import React from "react";
import { VersionSwitcher } from "./components/version-switcher";

export default {
    logo: <span>Doenet Documentation</span>,
    project: {
        link: "https://github.com/Doenet/DoenetML",
    },
    navbar: {
        // Switches to the same page in the other deployed versions of the
        // docs; renders nothing unless the deploy configured them.
        extraContent: <VersionSwitcher />,
    },
    sidebar: {
        defaultMenuCollapseLevel: "1",
        "auto collapse": true,
    },
    docsRepositoryBase:
        "https://github.com/Doenet/DoenetML/tree/0.7/packages/docs-nextra",

    feedback: {
        content: "Questions? Discuss in our community forum.",
        useLink: () => "https://community.doenet.org",
    },
};
