import { describe, expect, it } from "vitest";
import type { DastElement } from "@doenet/parser";
import { CompletionItemKind } from "vscode-languageserver/browser";

import { DoenetSourceObject } from "../src/doenet-source-object";
import { AutoCompleter } from "../src";
import {
    extractGraphicalChildren,
    generateAnnotationSkeletonSnippet,
} from "../src/auto-completer/methods/generate-annotation-skeleton";

function getFirstGraphElement(source: string): DastElement {
    const sourceObj = new DoenetSourceObject();
    sourceObj.setSource(source);
    const graphElement = sourceObj.dast.children.find(
        (child) => child.type === "element" && child.name === "graph",
    );
    if (!graphElement || graphElement.type !== "element") {
        throw new Error("Expected source to contain a <graph> element.");
    }
    return graphElement;
}

describe("Annotation skeleton snippet generation", () => {
    it("extracts graphical descendants in document order and ignores <annotations>", () => {
        const source = `<graph renderer="prefigure">
  <point name="P" />
  <group>
    <line name="L" />
  </group>
  <annotations>
    <annotation text="ignore me" />
  </annotations>
  <circle name="c" />
</graph>`;
        const graph = getFirstGraphElement(source);
        const components = extractGraphicalChildren(graph);

        expect(components.map((component) => component.type)).toEqual([
            "point",
            "line",
            "circle",
        ]);
        expect(components.map((component) => component.name)).toEqual([
            "P",
            "L",
            "c",
        ]);
    });

    it("generates a skeleton snippet with graph-level annotation and nested refs", () => {
        const source = `<graph renderer="prefigure">
  <point name="P" />
  <circle name="c" />
  <line name="L" />
</graph>`;
        const graph = getFirstGraphElement(source);

        const snippet = generateAnnotationSkeletonSnippet(graph);

        expect(snippet).toBeTruthy();
        expect(snippet?.key).toBe("annotation-skeleton");
        expect(snippet?.snippet).toContain("<annotations>");
        expect(snippet?.snippet).toContain(
            '<annotation text="A graph of a point, a circle, and a line.">',
        );
        expect(snippet?.snippet).toContain('ref="$P"');
        expect(snippet?.snippet).toContain('ref="$c"');
        expect(snippet?.snippet).toContain('ref="$L"');
        expect(snippet?.cursor).toBeTruthy();
    });

    it("uses synthetic names and guidance for unnamed graphical components", () => {
        const source = `<graph renderer="prefigure">
  <point />
  <point />
  <circle />
  <line />
</graph>`;
        const graph = getFirstGraphElement(source);

        const snippet = generateAnnotationSkeletonSnippet(graph);

        expect(snippet?.snippet).toContain('ref="$unnamedPoint1"');
        expect(snippet?.snippet).toContain('ref="$unnamedPoint2"');
        expect(snippet?.snippet).toContain('ref="$unnamedCircle1"');
        expect(snippet?.snippet).toContain('ref="$unnamedLine1"');
        expect(snippet?.snippet).toContain(
            "Point requires a name for the ref to work.",
        );
        expect(snippet?.snippet).toContain(
            "Circle requires a name for the ref to work.",
        );
        expect(snippet?.snippet).toContain(
            "Line requires a name for the ref to work.",
        );
    });

    it("returns null when graph has no supported graphical descendants", () => {
        const source = `<graph renderer="prefigure">
  <text>Nothing graphical here</text>
  <annotations><annotation text="old" /></annotations>
</graph>`;
        const graph = getFirstGraphElement(source);

        expect(generateAnnotationSkeletonSnippet(graph)).toBeNull();
    });
});

describe("Annotation skeleton autocomplete integration", () => {
    const integrationSchema = {
        elements: [
            {
                name: "graph",
                children: ["point", "circle", "line", "group", "annotations"],
                attributes: [{ name: "renderer" }, { name: "name" }],
                top: true,
                acceptsStringChildren: false,
            },
            {
                name: "group",
                children: ["point", "circle", "line", "annotations"],
                attributes: [{ name: "name" }],
                top: false,
                acceptsStringChildren: false,
            },
            {
                name: "annotations",
                children: ["annotation"],
                attributes: [],
                top: false,
                acceptsStringChildren: false,
            },
            {
                name: "annotation",
                children: ["annotation"],
                attributes: [{ name: "ref" }, { name: "text" }],
                top: false,
                acceptsStringChildren: true,
            },
            {
                name: "point",
                children: [],
                attributes: [{ name: "name" }],
                top: false,
                acceptsStringChildren: false,
            },
            {
                name: "circle",
                children: [],
                attributes: [{ name: "name" }],
                top: false,
                acceptsStringChildren: false,
            },
            {
                name: "line",
                children: [],
                attributes: [{ name: "name" }],
                top: false,
                acceptsStringChildren: false,
            },
        ],
    };

    it("offers annotation-skeleton snippet when typing < inside prefigure graph body", () => {
        const source = `<graph renderer="prefigure">
  <point name="P" />
  <
</graph>`;
        const autoCompleter = new AutoCompleter(
            source,
            integrationSchema.elements,
        );
        const offset = source.indexOf("  <\n") + 3;

        const items = autoCompleter.getCompletionItems(offset);
        const annotationSnippetItem = items.find(
            (item) => item.label === "annotation-skeleton",
        );

        expect(annotationSnippetItem).toBeTruthy();
        expect(annotationSnippetItem?.kind).toBe(CompletionItemKind.Snippet);
        const textEdit = annotationSnippetItem?.textEdit;
        if (textEdit && "newText" in textEdit) {
            expect(textEdit.newText).toContain("<annotations>");
            expect(textEdit.newText).toContain('ref="$P"');
        }
    });

    it("does not offer annotation-skeleton snippet in non-prefigure graph", () => {
        const source = `<graph renderer="doenet">
  <point name="P" />
  <
</graph>`;
        const autoCompleter = new AutoCompleter(
            source,
            integrationSchema.elements,
        );
        const offset = source.indexOf("  <\n") + 3;

        const items = autoCompleter.getCompletionItems(offset);
        expect(items.some((item) => item.label === "annotation-skeleton")).toBe(
            false,
        );
    });

    it("does not offer annotation-skeleton snippet when immediate parent is not graph", () => {
        const source = `<graph renderer="prefigure">
  <group>
    <point name="P" />
    <
  </group>
</graph>`;
        const autoCompleter = new AutoCompleter(
            source,
            integrationSchema.elements,
        );
        const offset = source.indexOf("    <\n") + 5;

        const items = autoCompleter.getCompletionItems(offset);
        expect(items.some((item) => item.label === "annotation-skeleton")).toBe(
            false,
        );
    });
});
