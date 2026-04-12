import type { CompletionSnippetCursor } from "@doenet/static-assets/completion-snippet-protocol";
import { toXml } from "@doenet/parser";
import type { DastElement } from "@doenet/parser";

const CURSOR_MARKER = "__ANNOTATION_SKELETON_CURSOR__";

const GRAPHICAL_COMPONENT_TYPES = new Set([
    "point",
    "line",
    "linesegment",
    "ray",
    "vector",
    "circle",
    "function",
    "polyline",
    "polygon",
    "angle",
    "curve",
    // Aliases that map to primary converters
    "endpoint",
    "equilibriumpoint",
    "triangle",
    "rectangle",
]);

export interface GraphicalComponent {
    type: string;
    name?: string;
}

export interface AnnotationNode {
    type: "annotations" | "annotation";
    ref?: string;
    text?: string;
    children?: AnnotationNode[];
}

export type ProcessedSnippet = {
    key: string;
    element: string;
    snippet: string;
    description: string;
    cursor?: CompletionSnippetCursor;
};

function getAttributeValue(
    element: DastElement,
    attributeName: string,
): string | undefined {
    const attr = element.attributes[attributeName];
    if (!attr) {
        return undefined;
    }

    const value = toXml(attr.children).trim();
    return value.length > 0 ? value : undefined;
}

function escapeXmlAttributeValue(value: string): string {
    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\"/g, "&quot;");
}

function capitalize(value: string) {
    if (value.length === 0) {
        return value;
    }
    return value.charAt(0).toUpperCase() + value.slice(1);
}

type ComponentLabelInfo = {
    singular: string;
    refStem: string;
};

const COMPONENT_LABELS: Record<string, ComponentLabelInfo> = {
    linesegment: { singular: "line segment", refStem: "LineSegment" },
    equilibriumpoint: {
        singular: "equilibrium point",
        refStem: "EquilibriumPoint",
    },
};

function getComponentLabelInfo(componentType: string): ComponentLabelInfo {
    return (
        COMPONENT_LABELS[componentType] ?? {
            singular: componentType,
            refStem: capitalize(componentType),
        }
    );
}

/**
 * Recursively extract graphical descendants from a graph element.
 * Existing `<annotations>` subtrees are intentionally ignored.
 */
export function extractGraphicalChildren(
    graphElement: DastElement,
): GraphicalComponent[] {
    const graphicalComponents: GraphicalComponent[] = [];

    function visitElement(element: DastElement) {
        const normalizedType = element.name.toLowerCase();

        if (normalizedType === "annotations") {
            return;
        }

        if (GRAPHICAL_COMPONENT_TYPES.has(normalizedType)) {
            graphicalComponents.push({
                type: normalizedType,
                name: getAttributeValue(element, "name"),
            });
        }

        element.children.forEach((child) => {
            if (child.type === "element") {
                visitElement(child);
            }
        });
    }

    graphElement.children.forEach((child) => {
        if (child.type === "element") {
            visitElement(child);
        }
    });

    return graphicalComponents;
}

/**
 * Get the default annotation text template for a graphical component.
 */
export function getDescriptionTemplate(
    componentType: string,
    componentName: string,
    isUnnamed = false,
): string {
    const componentLabel = capitalize(
        getComponentLabelInfo(componentType).singular,
    );
    const unnamedHint = isUnnamed
        ? ` (${componentLabel} requires a name for the ref to work.)`
        : "";

    const normalizedType = componentType.toLowerCase();

    switch (normalizedType) {
        case "point":
            return `A point with x-coordinate $${componentName}.x and y-coordinate $${componentName}.y.${unnamedHint}`;
        case "endpoint":
            return `An endpoint with x-coordinate $${componentName}.x and y-coordinate $${componentName}.y.${unnamedHint}`;
        case "equilibriumpoint":
            return `An equilibrium point with x-coordinate $${componentName}.x and y-coordinate $${componentName}.y.${unnamedHint}`;
        case "circle":
            return `A circle with radius $${componentName}.radius centered at x-coordinate $${componentName}.center.x and y-coordinate $${componentName}.center.y.${unnamedHint}`;
        case "function":
            return `A function.${unnamedHint}`;
        case "line":
            return `A line.${unnamedHint}`;
        case "linesegment":
            return `A line segment from a point with x-coordinate $${componentName}.endpoints[1].x and y-coordinate $${componentName}.endpoints[1].y to a point with x-coordinate $${componentName}.endpoints[2].x and y-coordinate $${componentName}.endpoints[2].y.${unnamedHint}`;
        case "ray":
            return `A ray starting at a point with x-coordinate $${componentName}.endpoint.x and y-coordinate $${componentName}.endpoint.y, passing through a point with x-coordinate $${componentName}.through.x and y-coordinate $${componentName}.through.y.${unnamedHint}`;
        case "vector":
            return `A vector with tail at x-coordinate $${componentName}.tail.x and y-coordinate $${componentName}.tail.y, and head at x-coordinate $${componentName}.head.x and y-coordinate $${componentName}.head.y.${unnamedHint}`;
        case "polyline":
            return `A polyline with $${componentName}.numVertices vertices.${unnamedHint}`;
        case "polygon":
            return `A polygon with $${componentName}.numVertices vertices.${unnamedHint}`;
        case "triangle":
            return `A triangle.${unnamedHint}`;
        case "rectangle":
            return `A rectangle of width $${componentName}.width and height $${componentName}.height.${unnamedHint}`;
        case "angle":
            return `An angle.${unnamedHint}`;
        case "curve":
            return `A curve.${unnamedHint}`;
        default:
            return `${componentLabel}.${unnamedHint || " (Add a name for this component to enable annotation refs.)"}`;
    }
}

const NUMBER_WORDS = [
    "",
    "a",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine",
    "ten",
];

function getGraphLevelTypeDescriptor(type: string, count: number): string {
    switch (type) {
        case "line":
            return count === 1 ? "a line" : `${countAsWord(count)} lines`;
        case "linesegment":
            return count === 1
                ? "a line segment"
                : `${countAsWord(count)} line segments`;
        case "endpoint":
            return count === 1
                ? "an endpoint"
                : `${countAsWord(count)} endpoints`;
        case "equilibriumpoint":
            return count === 1
                ? "an equilibrium point"
                : `${countAsWord(count)} equilibrium points`;
        case "angle":
            return count === 1 ? "an angle" : `${countAsWord(count)} angles`;
        default: {
            const noun = count === 1 ? type : `${type}s`;
            return count === 1 ? `a ${noun}` : `${countAsWord(count)} ${noun}`;
        }
    }
}

function countAsWord(count: number): string {
    return count < NUMBER_WORDS.length ? NUMBER_WORDS[count] : String(count);
}

/**
 * Build the text for the top-level graph annotation describing its graphical
 * contents, e.g. "A graph of a line and two points."
 */
function buildGraphLevelAnnotationText(
    graphicalComponents: GraphicalComponent[],
): string {
    const typeCounts = new Map<string, number>();
    const typeOrder: string[] = [];

    for (const component of graphicalComponents) {
        if (!typeCounts.has(component.type)) {
            typeOrder.push(component.type);
            typeCounts.set(component.type, 0);
        }
        typeCounts.set(
            component.type,
            (typeCounts.get(component.type) ?? 0) + 1,
        );
    }

    const parts = typeOrder.map((type) => {
        const count = typeCounts.get(type) ?? 1;
        return getGraphLevelTypeDescriptor(type, count);
    });

    if (parts.length === 0) {
        return "A graph.";
    } else if (parts.length === 1) {
        return `A graph of ${parts[0]}.`;
    } else if (parts.length === 2) {
        return `A graph of ${parts[0]} and ${parts[1]}.`;
    } else {
        const last = parts[parts.length - 1];
        const rest = parts.slice(0, -1).join(", ");
        return `A graph of ${rest}, and ${last}.`;
    }
}

/**
 * Build annotations tree with one graph-level annotation and nested children.
 */
export function buildAnnotationTree(
    graphicalComponents: GraphicalComponent[],
): AnnotationNode {
    const unnamedCounters = new Map<string, number>();

    const childAnnotations: AnnotationNode[] = graphicalComponents.map(
        (component) => {
            let componentName: string;
            let isUnnamed: boolean;

            if (component.name) {
                isUnnamed = false;
                componentName = component.name;
            } else {
                isUnnamed = true;
                const nextCount =
                    (unnamedCounters.get(component.type) ?? 0) + 1;
                unnamedCounters.set(component.type, nextCount);
                componentName = `unnamed${getComponentLabelInfo(component.type).refStem}${nextCount}`;
            }

            return {
                type: "annotation",
                ref: `$${componentName}`,
                text: getDescriptionTemplate(
                    component.type,
                    componentName,
                    isUnnamed,
                ),
            };
        },
    );

    const graphLevelText = buildGraphLevelAnnotationText(graphicalComponents);

    return {
        type: "annotations",
        children: [
            {
                type: "annotation",
                text: `${graphLevelText}${CURSOR_MARKER}`,
                children: childAnnotations,
            },
        ],
    };
}

/**
 * Render annotation tree to DoenetML snippet XML.
 */
export function renderAnnotationNodeToSnippetXml(
    annotationNode: AnnotationNode,
    indentLevel = 0,
): string {
    const indent = "  ".repeat(indentLevel);

    if (annotationNode.type === "annotations") {
        const renderedChildren = (annotationNode.children ?? []).map((child) =>
            renderAnnotationNodeToSnippetXml(child, indentLevel + 1),
        );
        return [
            `${indent}<annotations>`,
            ...renderedChildren,
            `${indent}</annotations>`,
        ].join("\n");
    }

    const attrs: string[] = [];
    if (annotationNode.ref) {
        attrs.push(`ref=\"${escapeXmlAttributeValue(annotationNode.ref)}\"`);
    }
    if (annotationNode.text) {
        attrs.push(`text=\"${escapeXmlAttributeValue(annotationNode.text)}\"`);
    }

    const renderedAttributes = attrs.length ? ` ${attrs.join(" ")}` : "";
    const children = annotationNode.children ?? [];
    if (children.length === 0) {
        return `${indent}<annotation${renderedAttributes} />`;
    }

    const renderedChildren = children.map((child) =>
        renderAnnotationNodeToSnippetXml(child, indentLevel + 1),
    );
    return [
        `${indent}<annotation${renderedAttributes}>`,
        ...renderedChildren,
        `${indent}</annotation>`,
    ].join("\n");
}

/**
 * Generate the dynamic annotations-skeleton snippet for a prefigure graph.
 */
export function generateAnnotationSkeletonSnippet(
    graphElement: DastElement,
): ProcessedSnippet | null {
    const graphicalComponents = extractGraphicalChildren(graphElement);
    if (graphicalComponents.length === 0) {
        return null;
    }

    const annotationTree = buildAnnotationTree(graphicalComponents);
    const snippetWithCursorMarker =
        renderAnnotationNodeToSnippetXml(annotationTree);
    const caretOffset = snippetWithCursorMarker.indexOf(CURSOR_MARKER);
    const snippet = snippetWithCursorMarker.replace(CURSOR_MARKER, "");

    return {
        key: "annotations-skeleton",
        element: "annotations",
        snippet,
        description: "Auto-generated annotation structure for graph components",
        cursor:
            caretOffset >= 0
                ? {
                      caretOffset,
                  }
                : undefined,
    };
}
