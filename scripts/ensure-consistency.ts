/**
 * Provide information about the consistency of package.json files and all the workspaces in packages/*
 */

import { Project } from "ts-morph";
import * as glob from "glob";
import * as path from "node:path";
import chalk from "chalk";
import os from "os";
import * as fs from "node:fs/promises";

if (os.platform() === "win32") {
    console.warn(
        chalk.bold(
            chalk.red(
                "Warning: This script may not work correctly on Windows.",
            ),
        ),
    );
}

const PWD = new URL("./", import.meta.url).pathname;
const TSCONFIG_FILES = glob
    .sync(path.join(PWD, "..", "packages", "*", "tsconfig.json"))
    .filter((x) => !x.includes("cypress"));
const DOENETML_DIR = path.resolve(path.join(PWD, ".."));

for (const tsconfig of TSCONFIG_FILES) {
    const currentPackage = tsconfig.match(/packages\/(.*?)\//)?.[1];
    if (!currentPackage) {
        console.warn(
            chalk.redBright("Could not find package name for"),
            tsconfig,
        );
        continue;
    }
    console.log("Analyzing", chalk.bold(chalk.blueBright(currentPackage)));

    const project = new Project({
        tsConfigFilePath: tsconfig,
    });

    // We only care about source files, not declaration files.
    const sourceFiles = project.getSourceFiles().filter((file) => {
        const filePath = file.getFilePath();
        return (
            // Type declarations are skipped
            !filePath.endsWith(".d.ts") &&
            !filePath.endsWith(".test.ts") &&
            // `dev-site.tsx` is never built. It's only for vite preview.
            !filePath.endsWith("dev-site.tsx")
        );
    });

    let absoluteImports: Set<string> = new Set();

    for (const sourceFile of sourceFiles) {
        const importDeclarations = sourceFile.getImportDeclarations();
        for (const importDeclaration of importDeclarations) {
            const importString = importDeclaration.getModuleSpecifierValue();
            const fileThatUsedImport = sourceFile.getFilePath();

            if (!importString.startsWith(".")) {
                absoluteImports.add(importString);
            } else {
                // Find out if the relative import accesses something outside of the package.
                const resolvedImport = path.resolve(
                    path.dirname(fileThatUsedImport),
                    importString,
                );
                if (!resolvedImport.includes(`packages/${currentPackage}`)) {
                    console.warn(
                        "    ",
                        chalk.redBright("import"),
                        chalk.gray("... from"),
                        chalk.redBright(`"${importString}"`),
                        "in file",
                        chalk.gray(
                            path.relative(DOENETML_DIR, fileThatUsedImport),
                        ),
                        "imports from outside of the",
                        currentPackage,
                        "package. It imports",
                        chalk.gray(path.relative(DOENETML_DIR, resolvedImport)),
                    );
                }
            }
        }
    }

    absoluteImports = new Set(
        Array.from(absoluteImports).map(normalizeImportName),
    );

    // Find all the `@doenet` absolute imports
    const doenetImports = Array.from(
        new Set(
            Array.from(absoluteImports)
                .filter((x) => x.startsWith("@doenet/"))
                .map(normalizeImportName),
        ),
    ).sort();
    const externalImports = Array.from(
        new Set(
            Array.from(absoluteImports)
                .filter((x) => !doenetImports.includes(x))
                .map(normalizeImportName),
        ),
    ).sort();

    // Check that the package.json includes all external imports
    const packageJsonPath = path.resolve(
        path.join(PWD, "..", "packages", currentPackage, "package.json"),
    );
    const packageJson = JSON.parse(await fs.readFile(packageJsonPath, "utf-8"));
    const packageJsonDeps = new Set([
        ...Object.keys(packageJson.dependencies ?? {}),
        ...Object.keys(packageJson.devDependencies ?? {}),
        ...Object.keys(packageJson.peerDependencies ?? {}),
    ]);

    const missingDepsWarnings = externalImports.filter(
        (dep) =>
            !packageJsonDeps.has(dep) && !packageJsonDeps.has(`@types/${dep}`),
    );
    if (missingDepsWarnings.length > 0) {
        console.log(
            "    ",
            chalk.redBright(path.relative(DOENETML_DIR, packageJsonPath)),
            "is",
            chalk.redBright("missing external dependencies:"),
        );
        missingDepsWarnings.forEach((dep) => {
            console.warn("        ", dep);
        });
    }

    // Find the internal `@doenet` dependencies
    if (doenetImports.length > 0) {
        console.log("    ", chalk.blue("@doenet dependencies"));
        doenetImports.forEach((dep) => {
            console.log("        ", dep);
        });
        // Check that any `wireit` build statements have the dependencies listed.
        const wireitBuild = packageJson?.wireit?.build;
        if (wireitBuild) {
            const expected = doenetImports.map(
                (dep) => `../${dep.split("/")[1]}:build`,
            );
            const existing = wireitBuild.dependencies ?? [];
            const missing = expected.filter((x) => !existing.includes(x));
            const excessive = existing.filter((x) => !expected.includes(x));

            if (missing.length > 0 || excessive.length > 0) {
                console.log(
                    "\n    ",
                    chalk.redBright("wireit"),
                    "has incorrect dependencies in",
                    chalk.gray(path.relative(DOENETML_DIR, packageJsonPath)),
                );
                missing.forEach((dep) => {
                    console.log("        ", chalk.red(dep), "\tis missing");
                });
                if (missing.length > 0 && excessive.length > 0) {
                    console.log("        ");
                }
                excessive.forEach((dep) => {
                    console.log(
                        "        ",
                        chalk.green(dep),
                        "\tshould not be included",
                    );
                });
            }
        }
    }
}

/**
 * Find the "basename" of the import. For example, if the import is "@doenet/blah/bar", return "@doenet/blah".
 */
function normalizeImportName(importName: string) {
    if (!importName.startsWith("@")) {
        return importName.split("/")[0];
    }

    return importName.split("/").slice(0, 2).join("/");
}
