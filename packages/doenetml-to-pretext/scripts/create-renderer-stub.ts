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
 * - A new .tsx renderer component file with the specified passthrough mode (children or nochildren)
 * - Updates the index.ts file to export the new renderer
 * - Updates renderers.ts to add the component mapping
 * 
 * Requires two command-line arguments (tagName, rendererName) and optionally accepts
 * a third argument specifying the passthrough mode. If the mode is not provided,
 * prompts the user interactively.
 */
async function main() {
    // Parse arguments
    const args = process.argv.slice(2);
    if (args.length < 2) {
        console.error(
            "Usage: npm run create-renderer-stub -- <tagName> <rendererName> [children|nochildren]",
        );
        console.error(
            "Example: npm run create-renderer-stub -- displayMathNumbered DisplayMathNumbered children",
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
    const componentTypeImport = useChildren
        ? "BasicComponentWithPassthroughChildren"
        : "BasicComponent";
    const componentArgs = useChildren
        ? "    node,\n    children,\n"
        : "    node,\n";
    const componentReturn = useChildren
        ? "<React.Fragment>{children}</React.Fragment>"
        : "<React.Fragment></React.Fragment>";
    const componentTypeUsage = useChildren
        ? "BasicComponentWithPassthroughChildren"
        : "BasicComponent";

    const stubContent = `import React from "react";
import { ${componentTypeImport} } from "../types";

type ${rendererName}Data = { props: unknown };

export const ${rendererName}: ${componentTypeUsage}<${rendererName}Data> = ({
${componentArgs}}) => {
    console.log("${rendererName} node:", node);
    return ${componentReturn};
};
`;

    fs.writeFileSync(rendererFile, stubContent);
    console.log(`✓ Created ${rendererFile}`);

    // Update index.ts - add export
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

    // Update renderers.ts - add mapping
    const renderersContent = fs.readFileSync(renderersFile, "utf-8");
    const mappingBlock = useChildren
        ? `    ${tagName}: {
        component: PretextComponent.${rendererName},
        passthroughChildren: true,
    },`
        : `    ${tagName}: {
        component: PretextComponent.${rendererName},
    },`;

    if (!renderersContent.includes(`${tagName}:`)) {
        const objectStart =
            "export const PRETEXT_TEXT_MODE_COMPONENTS: RendererObject = {";
        const objectStartIndex = renderersContent.indexOf(objectStart);

        if (objectStartIndex === -1) {
            console.warn("⚠ Could not find insertion point in renderers.ts");
        } else {
            const insertPosition = objectStartIndex + objectStart.length;
            const newRenderersContent =
                renderersContent.slice(0, insertPosition) +
                "\n" +
                mappingBlock +
                renderersContent.slice(insertPosition);
            fs.writeFileSync(renderersFile, newRenderersContent);
            console.log(`✓ Updated ${renderersFile}`);
        }
    }

    console.log("\n✓ Renderer stub created successfully!");
    console.log(`  Tag: ${tagName}`);
    console.log(`  Renderer: ${rendererName}`);
    console.log(`  Passthrough mode: ${passthroughMode}`);
    console.log(`  File: ${filename}.tsx`);
}

await main();
