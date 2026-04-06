import { describe, expect, it } from "vitest";
import { DoenetSourceObject } from "../src/doenet-source-object";
import { AutoCompleter } from "../src";
import { DastElementV6 } from "@doenet/parser";

/**
 * Resolver parity tests verify that member completion resolution behavior
 * matches the semantics we expect from the production Rust resolver.
 *
 * These tests focus on resolver parity for common member-chain paths,
 * including hyphenated non-first path segments.
 *
 * When Rust resolver is integrated via RustResolverAdapter, these tests
 * should pass for both TypeScript and Rust resolution backends.
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

    describe("Single-level member access", () => {
        it("Resolves direct child reference by name", () => {
            const source = `<section name="s"><p name="p1" /></section>\n$s.`;
            const sourceObj = new DoenetSourceObject(source);
            const completer = new AutoCompleter(source, testSchema);

            // At the dot, should suggest properties and children
            const items = completer.getCompletionItems(source.length);

            // Should include direct child name "p1"
            expect(items.some((item) => item.label === "p1")).toBe(true);
        });

        it("Resolves section properties when section reference is used", () => {
            const source = `<section name="mySection" />\n$mySection.`;
            const sourceObj = new DoenetSourceObject(source);
            const completer = new AutoCompleter(source, testSchema);

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
            const completer = new AutoCompleter(source, testSchema);

            const items = completer.getCompletionItems(source.length);

            // Unknown reference—no properties available
            expect(items.length).toBe(0);
        });
    });

    describe("Multi-level member access", () => {
        it("Resolves nested property access through chain", () => {
            const source = `<section name="s"><subsection name="sub"><p name="p1" /></subsection></section>\n$s.sub.`;
            const sourceObj = new DoenetSourceObject(source);
            const completer = new AutoCompleter(source, testSchema);

            const items = completer.getCompletionItems(source.length);

            // Should resolve to subsection's child p1
            expect(items.some((item) => item.label === "p1")).toBe(true);

            // Should NOT include subsection properties (we're looking at the subsection's children/properties)
            // The current behavior focuses on children, not ancestor properties
        });

        it("Resolves nested member access when a non-first segment has a hyphen", () => {
            const source = `<section name="s"><subsection name="sub-sec"><p name="p1" /></subsection></section>\n$s.sub-sec.`;
            const sourceObj = new DoenetSourceObject(source);
            const completer = new AutoCompleter(source, testSchema);

            const items = completer.getCompletionItems(source.length);

            // The child name should still resolve even with a hyphenated member segment.
            expect(items.some((item) => item.label === "p1")).toBe(true);
        });

        it("Stops resolution at unresolved path segment", () => {
            const source = `<section name="s" />\n$s.nonexistent.`;
            const sourceObj = new DoenetSourceObject(source);
            const completer = new AutoCompleter(source, testSchema);

            const items = completer.getCompletionItems(source.length);

            // Cannot resolve through nonexistent member
            expect(items.length).toBe(0);
        });

        it("Reports unresolved path for partial resolution", () => {
            const source = `<section name="s"><p name="p1" /></section>\n$s.p1.textProp`;
            const sourceObj = new DoenetSourceObject(source);
            const completer = new AutoCompleter(source, testSchema);

            // Request at 'textProp' position
            const offset = source.lastIndexOf("textProp") + "textProp".length;
            const items = completer.getCompletionItems(offset);

            // p1.textProp path is unresolved (text is a property name, not a child)
            // and completion resolution should stop.
            expect(items.length).toBe(0);
        });
    });

    describe("Node index tracking", () => {
        it("Provides node index for resolver at each offset", () => {
            const source = `<section name="s"><p name="p1" /></section>\n$s.`;
            const sourceObj = new DoenetSourceObject(source);

            // Get node index at the dot
            const dotOffset = source.length - 1;
            const nodeIndex = sourceObj.getNodeIndexAtOffset(dotOffset);

            // Should have a valid node index
            expect(typeof nodeIndex).toBe("number");
            expect(nodeIndex).toBeGreaterThanOrEqual(0);
        });

        it("Maintains consistent node indices across multiple calls", () => {
            const source = `<section name="s"><p name="p1" /></section>`;
            const sourceObj = new DoenetSourceObject(source);

            // Offsets in different elements
            const sectionStart = 1; // Inside <section>
            const pStart = 19; // Inside <p>

            const sectionIdx1 = sourceObj.getNodeIndexAtOffset(sectionStart);
            const sectionIdx2 = sourceObj.getNodeIndexAtOffset(sectionStart);
            const pIdx1 = sourceObj.getNodeIndexAtOffset(pStart);
            const pIdx2 = sourceObj.getNodeIndexAtOffset(pStart);

            // Same offset should always give same index
            expect(sectionIdx1).toBe(sectionIdx2);
            expect(pIdx1).toBe(pIdx2);

            // Different elements should have different indices (in depth-first order)
            expect(sectionIdx1).not.toBe(pIdx1);
        });
    });

    describe("Resolver interface contract", () => {
        it("Resolver callback receives all required arguments including nodeIndex", () => {
            const source = `<section name="s"><p name="p1" /></section>\n$s.`;
            const sourceObj = new DoenetSourceObject(source);

            const capturedArgs: any[] = [];
            const testResolver = (args: any) => {
                capturedArgs.push(args);
                return null; // Fall back to JS resolver
            };

            const completer = new AutoCompleter(source, testSchema, {
                resolveRefMemberContainerAtOffset: testResolver,
            });

            completer.getCompletionItems(source.length);

            // Resolver should have been called
            expect(capturedArgs.length).toBeGreaterThan(0);

            // Last call should have all required args
            const lastCall = capturedArgs[capturedArgs.length - 1];
            expect(lastCall).toHaveProperty("offset");
            expect(lastCall).toHaveProperty("pathParts");
            expect(lastCall).toHaveProperty("nodeIndex");

            // nodeIndex should be a number
            expect(typeof lastCall.nodeIndex).toBe("number");
        });

        it("Resolver can return null to trigger JS resolver fallback", () => {
            const source = `<section name="s"><p name="p1" /></section>\n$s.`;
            const sourceObj = new DoenetSourceObject(source);

            const completer = new AutoCompleter(source, testSchema, {
                resolveRefMemberContainerAtOffset: () => null, // Always return null
            });

            // Should still get completions from JS resolver
            const items = completer.getCompletionItems(source.length);
            expect(items.length).toBeGreaterThan(0);
        });

        it("Resolver can provide resolution to override JS behavior", () => {
            const source = `<section name="s"><p name="p1" /></section>\n$custom.`;
            const sourceObj = new DoenetSourceObject(source);

            // Provide custom resolution for non-existent reference
            const completer = new AutoCompleter(source, testSchema, {
                resolveRefMemberContainerAtOffset: () => ({
                    node: {
                        name: "section",
                        type: "element",
                        attributes: {},
                        children: [],
                    } as DastElementV6,
                    unresolvedPathParts: [],
                }),
            });

            const items = completer.getCompletionItems(source.length);

            // Should have section properties from custom resolver
            expect(items.some((item) => item.label === "sectionNum")).toBe(
                true,
            );
        });
    });

    describe("Resolver fallback behavior", () => {
        it("JS resolver provides completions when custom resolver returns null", () => {
            const source = `<section name="s"><p name="p1" /></section>\n$s.`;
            const sourceObj = new DoenetSourceObject(source);

            const completer = new AutoCompleter(source, testSchema, {
                resolveRefMemberContainerAtOffset: () => null,
            });

            const items = completer.getCompletionItems(source.length);

            // JS fallback should suggest children
            expect(items.some((item) => item.label === "p1")).toBe(true);
        });

        it("JS resolver is called when no custom resolver is provided", () => {
            const source = `<section name="s"><p name="p1" /></section>\n$s.`;
            const sourceObj = new DoenetSourceObject(source);

            // No custom resolver provided
            const completer = new AutoCompleter(source, testSchema);

            const items = completer.getCompletionItems(source.length);

            // JS resolver should provide completions
            expect(items.length).toBeGreaterThan(0);
            expect(items.some((item) => item.label === "p1")).toBe(true);
        });
    });

    describe("Path part parsing", () => {
        it("Correctly identifies path segments in member chains", () => {
            const source = `<section name="s"><subsection name="sub"><p name="p1" /></subsection></section>\n$s.sub.p1.`;
            const sourceObj = new DoenetSourceObject(source);

            const capturedPaths: string[][] = [];
            const testResolver = (args: any) => {
                capturedPaths.push(args.pathParts);
                return null;
            };

            const completer = new AutoCompleter(source, testSchema, {
                resolveRefMemberContainerAtOffset: testResolver,
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
