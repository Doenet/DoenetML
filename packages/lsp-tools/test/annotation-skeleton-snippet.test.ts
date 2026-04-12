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
        expect(snippet?.key).toBe("annotations-skeleton");
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
  <lineSegment />
  <equilibriumPoint />
</graph>`;
        const graph = getFirstGraphElement(source);

        const snippet = generateAnnotationSkeletonSnippet(graph);

        expect(snippet?.snippet).toContain('ref="$unnamedPoint1"');
        expect(snippet?.snippet).toContain('ref="$unnamedPoint2"');
        expect(snippet?.snippet).toContain('ref="$unnamedCircle1"');
        expect(snippet?.snippet).toContain('ref="$unnamedLine1"');
        expect(snippet?.snippet).toContain('ref="$unnamedLineSegment1"');
        expect(snippet?.snippet).toContain('ref="$unnamedEquilibriumPoint1"');
        expect(snippet?.snippet).toContain(
            "Point requires a name for the ref to work.",
        );
        expect(snippet?.snippet).toContain(
            "Circle requires a name for the ref to work.",
        );
        expect(snippet?.snippet).toContain(
            "Line requires a name for the ref to work.",
        );
        expect(snippet?.snippet).toContain(
            "Line segment requires a name for the ref to work.",
        );
        expect(snippet?.snippet).toContain(
            "Equilibrium point requires a name for the ref to work.",
        );
    });

    it("generates descriptions for all supported graphical components", () => {
        const source = `<graph renderer="prefigure">
  <circle name="c" />
  <function name="f" />
  <lineSegment name="seg" />
  <ray name="r" />
  <vector name="v" />
  <polygon name="poly" />
  <polyline name="pline" />
  <angle name="a" />
  <curve name="curv" />
</graph>`;
        const graph = getFirstGraphElement(source);

        const snippet = generateAnnotationSkeletonSnippet(graph);

        expect(snippet).toBeTruthy();
        expect(snippet?.snippet).toContain('ref="$c"');
        expect(snippet?.snippet).toContain('ref="$seg"');
        expect(snippet?.snippet).toContain('ref="$r"');
        expect(snippet?.snippet).toContain('ref="$v"');
        expect(snippet?.snippet).toContain('ref="$poly"');
        expect(snippet?.snippet).toContain('ref="$pline"');
        expect(snippet?.snippet).toContain('ref="$a"');
        expect(snippet?.snippet).toContain('ref="$curv"');
        // Verify descriptions mention relevant properties
        expect(snippet?.snippet).toContain("function");
        expect(snippet?.snippet).toContain("line segment");
        expect(snippet?.snippet).toContain("ray");
        expect(snippet?.snippet).toContain("vector");
        expect(snippet?.snippet).toContain("polygon");
        expect(snippet?.snippet).toContain("polyline");
        expect(snippet?.snippet).toContain("angle");
        expect(snippet?.snippet).toContain("curve");

        // Verify component property paths match the published schema names
        expect(snippet?.snippet).toContain("$c.radius");
        expect(snippet?.snippet).toContain("$c.center.x");
        expect(snippet?.snippet).toContain("$c.center.y");
        expect(snippet?.snippet).toContain("$seg.endpoints[1].x");
        expect(snippet?.snippet).toContain("$seg.endpoints[1].y");
        expect(snippet?.snippet).toContain("$seg.endpoints[2].x");
        expect(snippet?.snippet).toContain("$seg.endpoints[2].y");
        expect(snippet?.snippet).toContain("$r.endpoint.x");
        expect(snippet?.snippet).toContain("$r.endpoint.y");
        expect(snippet?.snippet).toContain("$r.through.x");
        expect(snippet?.snippet).toContain("$r.through.y");
        expect(snippet?.snippet).toContain("$v.tail.x");
        expect(snippet?.snippet).toContain("$v.tail.y");
        expect(snippet?.snippet).toContain("$v.head.x");
        expect(snippet?.snippet).toContain("$v.head.y");
        expect(snippet?.snippet).toContain(
            "A vector with tail at x-coordinate $v.tail.x and y-coordinate $v.tail.y, and head at x-coordinate $v.head.x and y-coordinate $v.head.y.",
        );
        expect(snippet?.snippet).toContain("A function.");
        expect(snippet?.snippet).toContain('ref="$f"');
        expect(snippet?.snippet).not.toContain("$seg.endpoints[1][1]");
        expect(snippet?.snippet).not.toContain("$r.endpoint[1]");

        // Ensure old invalid path suggestions are not emitted
        expect(snippet?.snippet).not.toMatch(/\$c\.r(\W|$)/);
        expect(snippet?.snippet).not.toContain("$seg.point1");
        expect(snippet?.snippet).not.toContain("$seg.point2");
        expect(snippet?.snippet).not.toContain("$r.point1");
        expect(snippet?.snippet).not.toContain("$r.point2");
        expect(snippet?.snippet).not.toContain("$v.point1");
        expect(snippet?.snippet).not.toContain("$v.point2");
    });

    it("handles component aliases (endpoint, equilibriumPoint, triangle, rectangle)", () => {
        const source = `<graph renderer="prefigure">
  <endpoint name="ep" />
  <equilibriumPoint name="eq" />
  <triangle name="tri" />
  <rectangle name="rect" />
</graph>`;
        const graph = getFirstGraphElement(source);

        const snippet = generateAnnotationSkeletonSnippet(graph);

        expect(snippet).toBeTruthy();
        expect(snippet?.snippet).toContain('ref="$ep"');
        expect(snippet?.snippet).toContain('ref="$eq"');
        expect(snippet?.snippet).toContain('ref="$tri"');
        expect(snippet?.snippet).toContain('ref="$rect"');
        // Aliases use their own descriptions
        expect(snippet?.snippet).toContain("An endpoint"); // endpoint description
        expect(snippet?.snippet).toContain("An equilibrium point"); // equilibriumPoint description
        expect(snippet?.snippet).toContain("A triangle."); // triangle description (simple, no vertices count)
        expect(snippet?.snippet).toContain("A rectangle"); // rectangle description
    });

    it("uses readable graph-level wording for special component names", () => {
        const source = `<graph renderer="prefigure">
  <endpoint name="ep" />
  <angle name="a" />
  <lineSegment name="s1" />
  <lineSegment name="s2" />
</graph>`;
        const graph = getFirstGraphElement(source);

        const snippet = generateAnnotationSkeletonSnippet(graph);

        expect(snippet?.snippet).toContain(
            '<annotation text="A graph of an endpoint, an angle, and two line segments.">',
        );
    });

    it("uses parenthesized macro syntax for non-SimpleIdent component names", () => {
        const source = `<graph renderer="prefigure">
  <lineSegment name="my-seg" />
  <point name="1stPoint" />
</graph>`;
        const graph = getFirstGraphElement(source);

        const snippet = generateAnnotationSkeletonSnippet(graph);

        expect(snippet).toBeTruthy();
        // ref attributes use parenthesized form
        expect(snippet?.snippet).toContain('ref="$(my-seg)"');
        expect(snippet?.snippet).toContain('ref="$(1stPoint)"');
        // text macros use parenthesized form with property paths
        expect(snippet?.snippet).toContain("$(my-seg).endpoints[1].x");
        expect(snippet?.snippet).toContain("$(my-seg).endpoints[2].y");
        expect(snippet?.snippet).toContain("$(1stPoint).x");
        expect(snippet?.snippet).toContain("$(1stPoint).y");
        // bare $ form must not appear for these names
        expect(snippet?.snippet).not.toContain("$my-seg");
        expect(snippet?.snippet).not.toContain("$1stPoint");
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
                children: [
                    "point",
                    "circle",
                    "function",
                    "line",
                    "lineSegment",
                    "ray",
                    "vector",
                    "polygon",
                    "polyline",
                    "angle",
                    "curve",
                    "endpoint",
                    "equilibriumPoint",
                    "triangle",
                    "rectangle",
                    "group",
                    "annotations",
                ],
                attributes: [{ name: "renderer" }, { name: "name" }],
                top: true,
                acceptsStringChildren: false,
            },
            {
                name: "group",
                children: [
                    "point",
                    "circle",
                    "function",
                    "line",
                    "lineSegment",
                    "ray",
                    "vector",
                    "polygon",
                    "polyline",
                    "angle",
                    "curve",
                    "annotations",
                ],
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
                name: "function",
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
            {
                name: "lineSegment",
                children: [],
                attributes: [{ name: "name" }],
                top: false,
                acceptsStringChildren: false,
            },
            {
                name: "ray",
                children: [],
                attributes: [{ name: "name" }],
                top: false,
                acceptsStringChildren: false,
            },
            {
                name: "vector",
                children: [],
                attributes: [{ name: "name" }],
                top: false,
                acceptsStringChildren: false,
            },
            {
                name: "polygon",
                children: [],
                attributes: [{ name: "name" }],
                top: false,
                acceptsStringChildren: false,
            },
            {
                name: "polyline",
                children: [],
                attributes: [{ name: "name" }],
                top: false,
                acceptsStringChildren: false,
            },
            {
                name: "angle",
                children: [],
                attributes: [{ name: "name" }],
                top: false,
                acceptsStringChildren: false,
            },
            {
                name: "curve",
                children: [],
                attributes: [{ name: "name" }],
                top: false,
                acceptsStringChildren: false,
            },
            {
                name: "endpoint",
                children: [],
                attributes: [{ name: "name" }],
                top: false,
                acceptsStringChildren: false,
            },
            {
                name: "equilibriumPoint",
                children: [],
                attributes: [{ name: "name" }],
                top: false,
                acceptsStringChildren: false,
            },
            {
                name: "triangle",
                children: [],
                attributes: [{ name: "name" }],
                top: false,
                acceptsStringChildren: false,
            },
            {
                name: "rectangle",
                children: [],
                attributes: [{ name: "name" }],
                top: false,
                acceptsStringChildren: false,
            },
        ],
    };

    it("offers annotations-skeleton snippet when typing < inside prefigure graph body", () => {
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
            (item) => item.label === "annotations-skeleton",
        );

        expect(annotationSnippetItem).toBeTruthy();
        expect(annotationSnippetItem?.kind).toBe(CompletionItemKind.Snippet);
        const textEdit = annotationSnippetItem?.textEdit;
        if (textEdit && "newText" in textEdit) {
            expect(textEdit.newText).toContain("<annotations>");
            expect(textEdit.newText).toContain('ref="$P"');
        }
    });

    it("does not offer annotations-skeleton snippet in non-prefigure graph", () => {
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
        expect(
            items.some((item) => item.label === "annotations-skeleton"),
        ).toBe(false);
    });

    it("does not offer annotations-skeleton snippet when immediate parent is not graph", () => {
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
        expect(
            items.some((item) => item.label === "annotations-skeleton"),
        ).toBe(false);
    });
});
