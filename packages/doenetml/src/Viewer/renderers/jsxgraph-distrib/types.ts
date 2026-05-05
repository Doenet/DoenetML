/**
 * Compatibility types for JSXGraph.
 *
 * Two parallel typings exist during the renderer migration:
 *
 * - The flat `JXGObject` / `JXGBoard` types are the legacy hand-typed shapes
 *   that older renderers depend on. They use loose `Function` signatures and
 *   eagerly declare every field that any kind of element exposes.
 *
 * - The per-kind interfaces (`JXGElement` plus `JXGPoint`, `JXGLine`,
 *   `JXGCircle`, `JXGCurve`, `JXGText`, `JXGAngle`, `JXGPolygon`) are the
 *   preferred shapes for new code. They model the concrete element kinds
 *   JSXgraph returns from `board.create("kind", ...)`.
 *
 * Both sets coexist intentionally so renderers can be migrated one at a
 * time without breaking the others.
 */

export type JXGEvent = {
    x: number;
    y: number;
    type: string;
    key: string;
};

/** Common base for the per-kind interfaces. New code only. */
export interface JXGElement {
    id: string;
    name: string;
    elType: string;
    elementClass: number;
    type: number;
    needsUpdate: boolean;
    needsRegularUpdate: boolean;
    hasLabel: boolean;
    isDraggable: boolean;
    isReal: boolean;
    highlighted: boolean;
    mouseover: boolean;
    rendNode: HTMLElement;
    coords: {
        usrCoords: [number, number, number];
        scrCoords: [number, number, number];
        setCoordinates: Function;
        [key: string]: unknown;
    };
    visProp: {
        strokecolor: string;
        highlightstrokecolor: string;
        fillcolor: string;
        [key: string]: unknown;
    };
    visPropCalc: {
        visible: boolean;
        [key: string]: unknown;
    };
    visPropOld: {
        fillcolor: string;
        fillopacity: number;
        firstarrow: boolean;
        [key: string]: unknown;
    };
    label?: {
        needsUpdate: boolean;
        visProp: any;
        fullUpdate: Function;
        update: Function;
    };
    eventHandlers: Record<string, unknown>;
    on(event: string, handler?: (e: JXGEvent) => void, context?: unknown): void;
    off(event: string, handler?: Function): void;
    setAttribute(attrs: Record<string, any>): void;
    update(): void;
    fullUpdate(): void;
    trigger(event: string, data?: unknown): void;
    triggerEventHandlers(event: string, data?: unknown): void;
}

export interface JXGPoint extends JXGElement {
    X(): number;
    Y(): number;
    relativeCoords?: {
        usrCoords: [number, number, number];
        setCoordinates: Function;
    };
    size?: [number, number];
}

export interface JXGLine extends JXGElement {
    point1: JXGPoint;
    point2: JXGPoint;
    stdform: number[];
}

export interface JXGCircle extends JXGElement {
    center: JXGPoint;
    radius: number;
    setRadius(radius: number): void;
}

export interface JXGCurve extends JXGElement {
    dataX?: number[];
    dataY?: number[];
    minX?(): number;
    maxX?(): number;
}

export interface JXGText extends JXGElement {
    setText(text: string): void;
    relativeCoords?: {
        usrCoords: [number, number, number];
        setCoordinates: Function;
    };
    size?: [number, number];
    rendNodeInput?: HTMLInputElement;
    rendNodeLabel?: HTMLElement;
}

export interface JXGAngle extends JXGElement {
    Value(): number;
    point1: JXGPoint;
    point2: JXGPoint;
    point3: JXGPoint;
}

export interface JXGPolygon extends JXGElement {
    vertices: JXGPoint[];
    borders: JXGLine[];
    addPoints(...points: JXGPoint[]): JXGPolygon;
    removePoints(...points: JXGPoint[]): JXGPolygon;
    updateVisibility(): JXGPolygon;
}

/**
 * Flat hand-typed object shape used by the older renderers.
 *
 * @deprecated New code should use the precise per-kind interfaces
 * (`JXGPoint`, `JXGLine`, `JXGCircle`, `JXGCurve`, `JXGText`, `JXGAngle`,
 * `JXGPolygon`). This type is retained so existing renderers compile
 * unchanged during the incremental migration.
 */
export type JXGObject = {
    Xjc: null | number;
    Yjc: null | number;
    _org_type: number;
    _pos: number;
    ancestors: Record<string, unknown>;
    baseElement: JXGObject;
    board: {
        BOARD_MODE_NONE: number;
        BOARD_MODE_DRAG: number;
        BOARD_MODE_MOVE_ORIGIN: number;
        [key: string]: unknown;
    };
    childElements: Record<string, unknown>;
    coords: {
        board: object;
        usrCoords: [number, number, number];
        scrCoords: [number, number, number];
        emitter: boolean;
        setCoordinates: Function;
        [key: string]: unknown;
    };
    descendants: Record<string, unknown>;
    dump: boolean;
    elType: string;
    element: undefined | HTMLElement;
    elementClass: number;
    eventHandlers: Record<string, unknown>;
    groups: unknown[];
    hasLabel: boolean;
    highlighted: boolean;
    id: string;
    inherits: unknown[];
    initialCoords: {
        board: object;
        usrCoords: [number, number, number];
        emitter: boolean;
        [key: string]: unknown;
    };
    isConstrained: boolean;
    isDraggable: boolean;
    isReal: boolean;
    lastDragTime: Date;
    methodMap: Record<string, string>;
    mouseover: boolean;
    name: string;
    needsRegularUpdate: boolean;
    needsUpdate: boolean;
    needsUpdateFromParent: boolean;
    notExistingParents: Record<string, unknown>;
    numTraces: number;
    off: (event: string, handler?: Function) => void;
    on: (
        event: string,
        handler?: (e: JXGEvent) => void,
        context?: unknown,
    ) => void;
    onPolygon: boolean;
    parents: unknown[];
    position: null | number;
    quadraticform: [number[], number[], number[]];
    rendNode: HTMLElement;
    slideObject: null | unknown;
    slideObjects: unknown[];
    stdform: number[];
    subs: Record<string, unknown>;
    suspended: Record<string, unknown>;
    symbolic: Record<string, unknown>;
    traces: Record<string, unknown>;
    transformations: unknown[];
    trigger: (event: string, data?: unknown) => void;
    triggerEventHandlers: (event: string, data?: unknown) => void;
    type: number;
    visProp: {
        strokecolor: string;
        highlightstrokecolor: string;
        fillcolor: string;
        [key: string]: unknown;
    };
    visPropCalc: {
        visible: boolean;
        [key: string]: unknown;
    };
    visPropOld: {
        fillcolor: string;
        fillopacity: number;
        firstarrow: boolean;
        [key: string]: unknown;
    };
    X(): number;
    Y(): number;
    setAttribute: Function;
    label: {
        needsUpdate: boolean;
        visProp: any;
        fullUpdate: Function;
        update: Function;
    };
    update: Function;
    size: [number, number];
    relativeCoords: {
        usrCoords: [number, number, number];
        setCoordinates: Function;
    };
    fullUpdate: Function;
    setText(text: string): void;
    point1: any;
    point2: any;
    point3: any;
    Value: Function;
    getBoundingBox: () => [number, number, number, number];
    center: JXGObject;
    setRadius: (radius: number) => void;
    radius: number;
    rendNodeInput: HTMLInputElement;
    rendNodeLabel: HTMLElement;
};

/**
 * Flat hand-typed board shape used by older renderers.
 *
 * @deprecated New code should narrow `board.create` returns with explicit
 * casts to the precise `JXGPoint` / `JXGLine` / `JXGCircle` / etc.
 */
export type JXGBoard = JXGObject & {
    create: Function;
    removeObject: Function;
    displayInfobox: (display: boolean) => void;
    updateInfobox: Function;
    updateRenderer: () => void;
    suspendUpdate: () => void;
    unsuspendUpdate: () => void;
    canvasWidth: number;
    canvasHeight: number;
    attr: Record<string, any>;
    zoomIn: () => void;
    zoomOut: () => void;
    zoom100: () => void;
    unitX: number;
    unitY: number;
    origin: {
        usrCoords: number[];
        scrCoords: number[];
    };
    BOARD_QUALITY_LOW: number;
    BOARD_QUALITY_HIGH: number;
    updateQuality: number;
    /** Added on the board by local code to track items rendered at low quality. */
    itemsRenderedLowQuality: Record<string, JXGObject>;
    [key: string]: any;
};
