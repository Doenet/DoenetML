import { escapeXml, formatNumber, formatPoint } from "../common";
import { labelMarkup } from "../label";
import { styleAttributes } from "../style";
import type { ConverterBaseArgs, Point } from "../types";

function anglePointsFromStateValues(
    sv: Record<string, unknown>,
): [Point, Point, Point] | null {
    const points = Array.isArray(sv.numericalPoints)
        ? sv.numericalPoints
        : null;
    const p1Raw = points?.[0];
    const pRaw = points?.[1];
    const p2Raw = points?.[2];

    if (
        !Array.isArray(p1Raw) ||
        !Array.isArray(pRaw) ||
        !Array.isArray(p2Raw)
    ) {
        return null;
    }

    if (p1Raw.length < 2 || pRaw.length < 2 || p2Raw.length < 2) {
        return null;
    }

    const p1: Point = [Number(p1Raw[0]), Number(p1Raw[1])];
    const p: Point = [Number(pRaw[0]), Number(pRaw[1])];
    const p2: Point = [Number(p2Raw[0]), Number(p2Raw[1])];

    if ([...p1, ...p, ...p2].some((x) => !Number.isFinite(x))) {
        return null;
    }

    if (sv.swapPointOrder) {
        return [p2, p, p1];
    }

    return [p1, p, p2];
}

function normalizeVector(v: Point): Point | null {
    const mag = Math.hypot(v[0], v[1]);
    if (!(mag > 0)) {
        return null;
    }
    return [v[0] / mag, v[1] / mag];
}

function offsetPoint(base: Point, direction: Point, distance: number): Point {
    return [
        base[0] + direction[0] * distance,
        base[1] + direction[1] * distance,
    ];
}

function labelAnchorForAngle({
    p1,
    p,
    p2,
    radius,
}: {
    p1: Point;
    p: Point;
    p2: Point;
    radius: number;
}): Point | null {
    const u = normalizeVector([p1[0] - p[0], p1[1] - p[1]]);
    const v = normalizeVector([p2[0] - p[0], p2[1] - p[1]]);
    if (!u || !v) {
        return null;
    }

    // Use internal bisector; fall back to perpendicular for straight angles.
    let bisector: Point = [u[0] + v[0], u[1] + v[1]];
    if (Math.hypot(bisector[0], bisector[1]) < 1e-10) {
        bisector = [u[1], -u[0]];
    }
    const bisectorUnit = normalizeVector(bisector);
    if (!bisectorUnit) {
        return null;
    }

    return offsetPoint(p, bisectorUnit, radius * 1.25);
}

/**
 * Converts a Doenet angle to a PreFigure sector `<arc>` element.
 * TODO: Re-evaluate whether `<angle-marker>` is a better semantic target than
 * `<arc>` once behavior/styling parity requirements are finalized.
 */
export function convertAngleToPrefigure({
    sv,
    handle,
    diagnostics,
    warningPrefix,
    warningPosition,
}: ConverterBaseArgs): string | null {
    const points = anglePointsFromStateValues(sv);
    if (!points) {
        return null;
    }

    const [p1Raw, pRaw, p2Raw] = points;
    const p1 = formatPoint(p1Raw);
    const p = formatPoint(pRaw);
    const p2 = formatPoint(p2Raw);

    if (p1 === null || p === null || p2 === null) {
        return null;
    }

    const radiusNumber = Number(sv.numericalRadius);
    if (!Number.isFinite(radiusNumber) || radiusNumber <= 0) {
        return null;
    }
    const radius = formatNumber(radiusNumber);

    const fromVertexToP1 = normalizeVector([
        p1Raw[0] - pRaw[0],
        p1Raw[1] - pRaw[1],
    ]);
    const fromVertexToP2 = normalizeVector([
        p2Raw[0] - pRaw[0],
        p2Raw[1] - pRaw[1],
    ]);
    if (!fromVertexToP1 || !fromVertexToP2) {
        return null;
    }

    const leg1 = offsetPoint(pRaw, fromVertexToP1, radiusNumber);
    const leg2 = offsetPoint(pRaw, fromVertexToP2, radiusNumber);
    const leg1Text = formatPoint(leg1);
    const leg2Text = formatPoint(leg2);
    if (leg1Text === null || leg2Text === null) {
        return null;
    }

    const pointsText = `(${leg1Text},${p},${leg2Text})`;

    const sectorStyleAttrs = styleAttributes({
        selectedStyle: sv.selectedStyle,
        diagnostics,
        warningPrefix,
        warningPosition,
        includeFill: true,
    });

    const arcXml = `<arc at="${escapeXml(`${handle}-arc`)}" points="${escapeXml(pointsText)}" radius="${escapeXml(radius)}" sector="yes" ${sectorStyleAttrs.join(" ")} />`;

    const label = labelMarkup({
        label: sv.label,
        labelHasLatex: sv.labelHasLatex,
    });

    if (!label) {
        return arcXml;
    }

    const labelAnchor = labelAnchorForAngle({
        p1: leg1,
        p: pRaw,
        p2: leg2,
        radius: radiusNumber,
    });
    const labelAnchorText = formatPoint(labelAnchor);
    if (labelAnchorText === null) {
        return arcXml;
    }

    const labelXml = `<label anchor="${escapeXml(labelAnchorText)}">${label}</label>`;
    return `${arcXml}${labelXml}`;
}
