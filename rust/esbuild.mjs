// const cssModulesPlugin = require("esbuild-css-modules-plugin");
import cssModulesPlugin from "esbuild-css-modules-plugin";
import esbuild from "esbuild";

// require("esbuild")
esbuild
    .build({
        logLevel: "info",
        entryPoints: ["src/no-export.jsx"],
        bundle: true,
        outfile: "dist/doenetml-no-export.js",
        plugins: [cssModulesPlugin()],
        external: ["*woff2", "*woff"],
        format: "esm",
    })
    .catch(() => process.exit(1));
