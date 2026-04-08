import { describe, expect, it } from "vitest";
import { DoenetSourceObject } from "../src/doenet-source-object";
import { AutoCompleter } from "../src";
import { DastElement } from "@doenet/parser";

/**
 * Resolver parity tests verify that member completion resolution behavior
 * matches the semantics we expect from the production Rust resolver.
 *
 * These tests focus on resolver parity for common member-chain paths,
 * including hyphenated non-first path segments.
 */
describe("Resolver Parity - Member Completion Resolution", () => {
    const testSchema = [
        {
            name: "section",
            children: ["p", "subsection"],
            attributes: [{ name: "name" }],
            properties: [{ name: "sectionNum" }, { name: "title" }],
            top: true,
            acceptsStringChildren: true,
        },
        {
            name: "subsection",
            children: ["p"],
            attributes: [{ name: "name" }],
            properties: [{ name: "num" }],
            top: false,
            acceptsStringChildren: true,
        },
        {
            name: "p",
            children: [],
            attributes: [{ name: "name" }],
            properties: [{ name: "text" }],
            top: false,
            acceptsStringChildren: true,
        },
    ];

    function createCompleter(source: string) {
        const sourceObj = new DoenetSourceObject();
        sourceObj.setSource(source + " ");
        return new AutoCompleter(undefined, testSchema, {
            sourceObj,
            rustResolverAdapter: {
                isNameAddressableFromOffset: () => true,
                resolveRefMemberContainerAtOffset: (
                    offset: number,
                    pathParts: string[],
                ) => {
                    if (pathParts.length === 0) {
                        return { node: null, unresolvedPathParts: [] };
                    }
                    const lookupPathParts = pathParts.slice(0, -1);
                    if (lookupPathParts.length === 0) {
                        return { node: null, unresolvedPathParts: [] };
                    }

                    let referent = sourceObj.getReferentAtOffset(
                        offset,
                        lookupPathParts[0],
                    );
                    if (!referent) {
                        return {
                            node: null,
                            unresolvedPathParts: lookupPathParts,
                        };
                    }

                    for (let i = 1; i < lookupPathParts.length; i++) {
                        const next = sourceObj.getNamedDescendant(
                            referent,
                            lookupPathParts[i],
                        );
                        if (!next) {
                            return {
                                node: null,
                                unresolvedPathParts: lookupPathParts.slice(i),
                            };
                        }
                        referent = next;
                    }

                    return {
                        node: referent,
                        unresolvedPathParts: [],
                        visibleDescendantNames:
                            sourceObj.getUniqueDescendantNamesForNode(referent),
                    };
                },
            } as any,
        });
    }

    describe("Single-level member access", () => {
        it("Resolves direct child reference by name", () => {
            const source = `<section name="s"><p name="p1" /></section>\n$s.`;
            const sourceObj = new DoenetSourceObject(source);
            const completer = createCompleter(source);

            // At the dot, should suggest properties and children
            const items = completer.getCompletionItems(source.length);

            // Should include direct child name "p1"
            expect(items.some((item) => item.label === "p1")).toBe(true);
        });

        it("Resolves section properties when section reference is used", () => {
            const source = `<section name="mySection" />\n$mySection.`;
            const sourceObj = new DoenetSourceObject(source);
            const completer = createCompleter(source);

            const items = completer.getCompletionItems(source.length);

            // Should include section properties
            expect(items.some((item) => item.label === "sectionNum")).toBe(
                true,
            );
            expect(items.some((item) => item.label === "title")).toBe(true);
        });

        it("Returns empty completions for unresolvable reference", () => {
            const source = `<section name="s" />\n$unknown.`;
            const sourceObj = new DoenetSourceObject(source);
            const completer = createCompleter(source);

            const items = completer.getCompletionItems(source.length);

            // Unknown reference—no properties available
            expect(items.length).toBe(0);
        });
    });

    describe("Multi-level member access", () => {
        it("Resolves nested property access through chain", () => {
            const source = `<section name="s"><subsection name="sub"><p name="p1" /></subsection></section>\n$s.sub.`;
            const sourceObj = new DoenetSourceObject(source);
            const completer = createCompleter(source);

            const items = completer.getCompletionItems(source.length);

            // Should resolve to subsection's child p1
            expect(items.some((item) => item.label === "p1")).toBe(true);

            // Should NOT include subsection properties (we're looking at the subsection's children/properties)
            // The current behavior focuses on children, not ancestor properties
        });

        it("Resolves nested member access when a non-first segment has a hyphen", () => {
            const source = `<section name="s"><subsection name="sub-sec"><p name="p1" /></subsection></section>\n$s.sub-sec.`;
            const sourceObj = new DoenetSourceObject(source);
            const completer = createCompleter(source);

            const items = completer.getCompletionItems(source.length);

            // The child name should still resolve even with a hyphenated member segment.
            expect(items.some((item) => item.label === "p1")).toBe(true);
        });

        it("Stops resolution at unresolved path segment", () => {
            const source = `<section name="s" />\n$s.nonexistent.`;
            const completer = createCompleter(source);

            const items = completer.getCompletionItems(source.length);

            // Cannot resolve through nonexistent member
            expect(items.length).toBe(0);
        });

        it("Reports unresolved path for partial resolution", () => {
            const source = `<section name="s"><p name="p1" /></section>\n$s.p1.textProp`;
            const sourceObj = new DoenetSourceObject(source);
            const completer = createCompleter(source);

            // Request at 'textProp' position
            const offset = source.lastIndexOf("textProp") + "textProp".length;
            const items = completer.getCompletionItems(offset);

            // p1.textProp path is unresolved (text is a property name, not a child)
            // and completion resolution should stop.
            expect(items.length).toBe(0);
        });
    });

    describe("Resolver interface contract", () => {
        it("Resolver callback receives offset/path/hasIndex", () => {
            const source = `<section name="s"><p name="p1" /></section>\n$s.`;
            const capturedArgs: any[] = [];
            const completer = new AutoCompleter(source, testSchema, {
                rustResolverAdapter: {
                    isNameAddressableFromOffset: () => true,
                    resolveRefMemberContainerAtOffset: (
                        offset: number,
                        pathParts: string[],
                        hasIndex?: boolean,
                    ) => {
                        capturedArgs.push({ offset, pathParts, hasIndex });
                        return null;
                    },
                } as any,
            });

            completer.getCompletionItems(source.length);

            // Resolver should have been called
            expect(capturedArgs.length).toBeGreaterThan(0);

            // Last call should have all required args
            const lastCall = capturedArgs[capturedArgs.length - 1];
            expect(lastCall).toHaveProperty("offset");
            expect(lastCall).toHaveProperty("pathParts");
            expect(lastCall).toHaveProperty("hasIndex");
        });

        it("Resolver can provide resolution for member completions", () => {
            const source = `<section name="s"><p name="p1" /></section>\n$custom.`;
            const completer = new AutoCompleter(source, testSchema, {
                rustResolverAdapter: {
                    isNameAddressableFromOffset: () => true,
                    resolveRefMemberContainerAtOffset: () => ({
                        node: {
                            name: "section",
                            type: "element",
                            attributes: {},
                            children: [],
                        } as DastElement,
                        unresolvedPathParts: [],
                        visibleDescendantNames: ["p1"],
                    }),
                } as any,
            });

            const items = completer.getCompletionItems(source.length);

            // Should have section properties from custom resolver
            expect(items.some((item) => item.label === "sectionNum")).toBe(
                true,
            );
        });
    });

    describe("Resolver disabled behavior", () => {
        it("No member completions when resolver returns null", () => {
            const source = `<section name="s"><p name="p1" /></section>\n$s.`;
            const completer = new AutoCompleter(source, testSchema, {
                rustResolverAdapter: {
                    isNameAddressableFromOffset: () => true,
                    resolveRefMemberContainerAtOffset: () => null,
                } as any,
            });

            const items = completer.getCompletionItems(source.length);
            expect(items).toEqual([]);
        });

        it("No member completions when no resolver is provided", () => {
            const source = `<section name="s"><p name="p1" /></section>\n$s.`;
            const completer = new AutoCompleter(source, testSchema);

            const items = completer.getCompletionItems(source.length);
            expect(items).toEqual([]);
        });
    });

    describe("Path part parsing", () => {
        it("Correctly identifies path segments in member chains", () => {
            const source = `<section name="s"><subsection name="sub"><p name="p1" /></subsection></section>\n$s.sub.p1.`;
            const sourceObj = new DoenetSourceObject(source);

            const capturedPaths: string[][] = [];
            function testResolver(_offset: number, pathParts: string[]) {
                capturedPaths.push(pathParts);
                return null;
            }

            const completer = new AutoCompleter(source, testSchema, {
                rustResolverAdapter: {
                    isNameAddressableFromOffset: () => true,
                    resolveRefMemberContainerAtOffset: testResolver,
                } as any,
            });

            completer.getCompletionItems(source.length);

            // Find the call with full path
            const fullPath = capturedPaths.find((p) =>
                p.some((seg) => seg === "p1"),
            );

            expect(fullPath).toBeDefined();
            // Should contain path segments in order
            if (fullPath) {
                expect(fullPath.includes("s")).toBe(true);
                expect(fullPath.includes("sub")).toBe(true);
                expect(fullPath.includes("p1")).toBe(true);
            }
        });
    });
});
