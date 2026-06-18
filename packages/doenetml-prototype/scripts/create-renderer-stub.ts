import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createInterface } from "node:readline/promises";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

type PassthroughMode = "children" | "nochildren";

function parsePassthroughMode(
    value: string | undefined,
): PassthroughMode | undefined {
    if (!value) {
        return undefined;
    }
    const normalized = value.trim().toLowerCase();
    if (normalized === "children" || normalized === "nochildren") {
        return normalized;
    }
    return undefined;
}

async function promptForPassthroughMode(): Promise<PassthroughMode> {
    if (!process.stdin.isTTY || !process.stdout.isTTY) {
        console.error(
            "When running non-interactively, supply the third argument: children or nochildren.",
        );
        process.exit(1);
    }

    const rl = createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    try {
        while (true) {
            const answer = await rl.question(
                "Should the renderer pass through children? Enter 'children' or 'nochildren': ",
            );
            const mode = parsePassthroughMode(answer);
            if (mode) {
                return mode;
            }
            console.error(
                "Invalid value. Please enter 'children' or 'nochildren'.",
            );
        }
    } finally {
        rl.close();
    }
}

/**
 * Creates a new renderer component stub file for a given tag name and renderer name.
 * Generates the following:
 * - A new .tsx renderer component file in src/renderers/doenet/
 * - Updates src/renderers/doenet/index.ts to export the new renderer
 * - Updates src/renderers/renderers.ts to add the named import and the component mapping
 *
 * Requires two command-line arguments (tagName, rendererName) and optionally accepts
 * a third argument specifying the passthrough mode. If the mode is not provided,
 * prompts the user interactively.
 */
async function main() {
    const args = process.argv.slice(2);
    if (args.length < 2) {
        console.error(
            "Usage: npm run create-renderer-stub -- <tagName> <rendererName> [children|nochildren]",
        );
        console.error(
            "Example: npm run create-renderer-stub -- asList AsList children",
        );
        process.exit(1);
    }

    const [tagName, rendererName, modeArg] = args;
    let passthroughMode = parsePassthroughMode(modeArg);

    if (modeArg && !passthroughMode) {
        console.error(
            `Invalid third argument '${modeArg}'. Use 'children' or 'nochildren'.`,
        );
        process.exit(1);
    }

    if (!passthroughMode) {
        passthroughMode = await promptForPassthroughMode();
    }

    const useChildren = passthroughMode === "children";

    // Convert renderer name to kebab-case for filename
    const filename = rendererName
        .replace(/([A-Z])/g, "-$1")
        .toLowerCase()
        .replace(/^-/, "");

    const rendererDir = path.join(
        __dirname,
        "..",
        "src",
        "renderers",
        "doenet",
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
    const componentType = useChildren
        ? "BasicComponentWithPassthroughChildren"
        : "BasicComponent";
    const componentArgs = useChildren
        ? "\n    node,\n    children,\n    htmlId,\n"
        : "\n    node,\n    htmlId,\n";
    const componentReturn = useChildren
        ? "<React.Fragment>{children}</React.Fragment>"
        : "<React.Fragment></React.Fragment>";

    const stubContent = `import React from "react";
import { ${componentType} } from "../types";

type ${rendererName}Data = { props: unknown };

export const ${rendererName}: ${componentType}<${rendererName}Data> = ({${componentArgs}}) => {
    console.log("${rendererName} node:", node);
    return ${componentReturn};
};
`;

    fs.writeFileSync(rendererFile, stubContent);
    console.log(`✓ Created ${rendererFile}`);

    // Update index.ts — append export after the last existing export line
    const indexContent = fs.readFileSync(indexFile, "utf-8");
    const exportLine = `export * from "./${filename}";`;

    if (!indexContent.includes(exportLine)) {
        const exportRegex = /^export \* from ".*";$/gm;
        let lastMatch: RegExpExecArray | null = null;
        let match = exportRegex.exec(indexContent);
        while (match) {
            lastMatch = match;
            match = exportRegex.exec(indexContent);
        }

        if (!lastMatch) {
            console.warn("⚠ Could not find insertion point in index.ts");
        } else {
            const insertPosition = lastMatch.index + lastMatch[0].length;
            const newIndexContent =
                indexContent.slice(0, insertPosition) +
                "\n" +
                exportLine +
                indexContent.slice(insertPosition);
            fs.writeFileSync(indexFile, newIndexContent);
            console.log(`✓ Updated ${indexFile}`);
        }
    }

    // Update renderers.ts
    let renderersContent = fs.readFileSync(renderersFile, "utf-8");

    // Add named import to the `import { ... } from "./doenet"` block
    const doenetImportRegex =
        /import\s*\{[^}]*\}\s*from\s*["']\.\/doenet["'];/s;
    const importMatch = renderersContent.match(doenetImportRegex);
    if (!importMatch) {
        console.warn(
            '⚠ Could not find `import { ... } from "./doenet"` in renderers.ts',
        );
    } else if (!importMatch[0].includes(rendererName)) {
        const fullImport = importMatch[0];
        const closingIdx = fullImport.lastIndexOf("}");
        const newImport =
            fullImport.slice(0, closingIdx) +
            `    ${rendererName},\n` +
            fullImport.slice(closingIdx);
        renderersContent = renderersContent.replace(fullImport, newImport);
        fs.writeFileSync(renderersFile, renderersContent);
        console.log(`✓ Added import for ${rendererName} in ${renderersFile}`);
    }

    // Re-read after potential import update
    renderersContent = fs.readFileSync(renderersFile, "utf-8");

    // Add mapping to TEXT_MODE_COMPONENTS
    const mappingLine = useChildren
        ? `    ${tagName}: { component: ${rendererName}, passthroughChildren: true },`
        : `    ${tagName}: { component: ${rendererName} },`;

    const objectStart = "export const TEXT_MODE_COMPONENTS: RendererObject = {";
    const objectStartIndex = renderersContent.indexOf(objectStart);

    if (objectStartIndex === -1) {
        console.warn("⚠ Could not find TEXT_MODE_COMPONENTS in renderers.ts");
    } else {
        const insertPosition = objectStartIndex + objectStart.length;
        const newRenderersContent =
            renderersContent.slice(0, insertPosition) +
            "\n" +
            mappingLine +
            renderersContent.slice(insertPosition);
        fs.writeFileSync(renderersFile, newRenderersContent);
        console.log(`✓ Added TEXT_MODE_COMPONENTS entry in ${renderersFile}`);
    }

    console.log("\n✓ Renderer stub created successfully!");
    console.log(`  Tag:             ${tagName}`);
    console.log(`  Renderer:        ${rendererName}`);
    console.log(`  Passthrough:     ${passthroughMode}`);
    console.log(`  File:            src/renderers/doenet/${filename}.tsx`);
}

await main();
