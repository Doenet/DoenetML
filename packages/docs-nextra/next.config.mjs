import React from "react";
import nextraConfig from "nextra";
const withNextra = nextraConfig({
    theme: "nextra-theme-docs",
    themeConfig: "./theme.config.tsx",
    head: (
        <>
          <script type="module" src="https://dev.doenet.org/cdn/doenet-standalone.js"> </script>
          <link rel="stylesheet" href="https://dev.doenet.org/cdn/style.css" />
        </>
    )
});

export default withNextra();

// If you have other Next.js configurations, you can pass them as the parameter:
// module.exports = withNextra({ /* other next.js config */ })
