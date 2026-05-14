import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Parse arguments
const args = process.argv.slice(2);
if (args.length < 2) {
    console.error(
        "Usage: npm run create-renderer-stub -- <tagName> <rendererName>",
    );
    console.error(
        "Example: npm run create-renderer-stub -- displayMathNumbered DisplayMathNumbered",
    );
    process.exit(1);
}

const [tagName, rendererName] = args;

// Convert tag name to kebab-case for filename
const kebabCaseTag = tagName
    .replace(/([A-Z])/g, "-$1")
    .toLowerCase()
    .replace(/^-/, "");
const filename = kebabCaseTag;

const rendererDir = path.join(
    __dirname,
    "..",
    "src",
    "renderers",
    "pretext-xml",
);
const rendererFile = path.join(rendererDir, `${filename}.tsx`);
const indexFile = path.join(rendererDir, "index.ts");
const renderersFile = path.join(
    __dirname,
    "..",
    "src",
    "renderers",
    "renderers.ts",
);

// Create renderer stub file
const stubContent = `import React from "react";
import { BasicComponentWithPassthroughChildren } from "../types";

type ${rendererName}Data = { props: unknown };

export const ${rendererName}: BasicComponentWithPassthroughChildren<${rendererName}Data> = ({
    node,
    children,
}) => {
    console.log("${rendererName} node:", node);
    return <React.Fragment>{children}</React.Fragment>;
};
`;

fs.writeFileSync(rendererFile, stubContent);
console.log(`✓ Created ${rendererFile}`);

// Update index.ts - add export
const indexContent = fs.readFileSync(indexFile, "utf-8");
const exportLine = `export * from "./${filename}";`;

if (!indexContent.includes(exportLine)) {
    // Insert after the last export (before any comments or at the end)
    const lastExportMatch = indexContent.match(/export \* from ".*";\n/);
    if (lastExportMatch) {
        const lastExportIndex = indexContent.lastIndexOf(lastExportMatch[0]);
        const insertPosition = lastExportIndex + lastExportMatch[0].length;
        const newIndexContent =
            indexContent.slice(0, insertPosition) +
            exportLine +
            "\n" +
            indexContent.slice(insertPosition);
        fs.writeFileSync(indexFile, newIndexContent);
        console.log(`✓ Updated ${indexFile}`);
    }
}

// Update renderers.ts - add mapping
const renderersContent = fs.readFileSync(renderersFile, "utf-8");
const mappingLine = `    ${tagName}: {
        component: PretextComponent.${rendererName},
        passthroughChildren: true,
    },`;

if (!renderersContent.includes(`${tagName}:`)) {
    // Find a good insertion point - after the last existing renderer mapping
    const lines = renderersContent.split("\n");
    let insertIndex = -1;

    // Find the last line before the closing brace of PRETEXT_TEXT_MODE_COMPONENTS
    for (let i = lines.length - 1; i >= 0; i--) {
        if (
            lines[i].includes("component: PretextComponent.") &&
            !lines[i].trim().endsWith("{")
        ) {
            insertIndex = i + 1;
            break;
        }
    }

    if (insertIndex > -1) {
        lines.splice(insertIndex, 0, mappingLine);
        fs.writeFileSync(renderersFile, lines.join("\n"));
        console.log(`✓ Updated ${renderersFile}`);
    } else {
        console.warn("⚠ Could not find insertion point in renderers.ts");
    }
}

console.log("\n✓ Renderer stub created successfully!");
console.log(`  Tag: ${tagName}`);
console.log(`  Renderer: ${rendererName}`);
console.log(`  File: ${filename}.tsx`);
