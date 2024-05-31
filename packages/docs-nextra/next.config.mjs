import nextraConfig from "nextra";
const withNextra = nextraConfig({
    theme: "nextra-theme-docs",
    themeConfig: "./theme.config.tsx",
    defaultShowCopyCode: true,
    latex: true,
});


// module.exports = require('nextra')({
//     latex: true
//   }); 

export default withNextra();

// If you have other Next.js configurations, you can pass them as the parameter:
// module.exports = withNextra({ /* other next.js config */ })
