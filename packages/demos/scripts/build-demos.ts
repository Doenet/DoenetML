import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

type PackageJson = {
    name?: string;
    description?: string;
    wireit?: {
        build?: {
            dependencies?: string[];
        };
    };
};

type PackageInfo = {
    folder: string;
    workspaceName: string;
    description: string;
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const demosDir = path.resolve(__dirname, "..");
const workspaceRoot = path.resolve(demosDir, "../..");
const packagesDir = path.join(workspaceRoot, "packages");
const demosPackageJsonPath = path.join(demosDir, "package.json");
const distDir = path.join(demosDir, "dist");
const templatePath = path.join(demosDir, "scripts", "index.template.html");
const cssPath = path.join(demosDir, "scripts", "index.css");

/**
 * Generate the demos output directory by creating an index page and copying
 * prebuilt package dist artifacts for each configured demo package.
 */
async function main() {
    const targetPackageFolders = await loadTargetPackageFolders();
    const packageInfos = await loadTargetPackageInfo(targetPackageFolders);

    await fs.rm(distDir, { recursive: true, force: true });
    await fs.mkdir(distDir, { recursive: true });

    await writeIndexPage(packageInfos);

    for (const packageInfo of packageInfos) {
        await copyPrebuiltDist(packageInfo);
    }
}

/**
 * Read the demos package's wireit dependencies and extract package folders
 * for build:dev demo dependencies like ../doenetml:build:dev.
 */
async function loadTargetPackageFolders(): Promise<string[]> {
    const packageJson = await readJsonFile(demosPackageJsonPath);
    const dependencies = packageJson.wireit?.build?.dependencies ?? [];

    return dependencies.flatMap(parseDemoPackageFolder);
}

/**
 * Read package metadata for each configured package folder.
 */
async function loadTargetPackageInfo(
    folders: string[],
): Promise<PackageInfo[]> {
    return Promise.all(
        folders.map(async (folder) => {
            const packageJsonPath = path.join(
                packagesDir,
                folder,
                "package.json",
            );
            const packageJson = await readJsonFile(packageJsonPath);

            return {
                folder,
                workspaceName: packageJson.name ?? folder,
                description:
                    packageJson.description ?? "No description available.",
            };
        }),
    );
}

function parseDemoPackageFolder(dependency: string): string[] {
    const match = dependency.match(/^\.\.\/([^:]+):build.*$/);

    return match ? [match[1]] : [];
}

/**
 * Copy a package's prebuilt dist directory into the demos dist folder.
 */
async function copyPrebuiltDist(packageInfo: PackageInfo) {
    const sourceDir = path.join(packagesDir, packageInfo.folder, "dist-dev");
    const outDir = path.join(distDir, packageInfo.folder);

    await fs.mkdir(outDir, { recursive: true });
    await fs.cp(sourceDir, outDir, { recursive: true, force: true });
}

/**
 * Build the demos index.html by injecting CSS and package link markup into
 * the HTML template.
 */
async function writeIndexPage(packageInfos: PackageInfo[]) {
    const [template, css] = await Promise.all([
        fs.readFile(templatePath, "utf8"),
        fs.readFile(cssPath, "utf8"),
    ]);

    const linksMarkup = packageInfos
        .map(
            (packageInfo) => `
<li>
  <a href="./${escapeHtml(packageInfo.folder)}/index.html">${escapeHtml(packageInfo.workspaceName)}</a>
  <p>${escapeHtml(packageInfo.description)}</p>
</li>`,
        )
        .join("\n");

    const html = template
        .replace("{{INDEX_CSS}}", css)
        .replace("{{PACKAGE_LINKS}}", linksMarkup);

    await fs.writeFile(path.join(distDir, "index.html"), html, "utf8");
}

/**
 * Read and parse a JSON file from disk.
 */
async function readJsonFile(filePath: string): Promise<PackageJson> {
    const data = await fs.readFile(filePath, "utf8");
    return JSON.parse(data) as PackageJson;
}

/**
 * Escape text for safe insertion into HTML content and attribute values.
 */
function escapeHtml(value: string): string {
    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

main().catch((error) => {
    console.error(error);
    throw error;
});
