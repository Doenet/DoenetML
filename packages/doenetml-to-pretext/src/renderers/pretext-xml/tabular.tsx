import React from "react";
import { BasicComponentWithPassthroughChildren } from "../types";
import { useAppSelector } from "../../state/hooks";
import { elementsArraySelector } from "../../state/redux-slices/dast";
import { printedColumnWidths } from "./column-widths";

/**
 * `<tabular>`, `<row>` and `<cell>` carry the same names in DoenetML and in
 * PreTeXt, so for a long while they reached the exporter through the
 * pass-through fallback. That dropped every attribute: a flat-DAST element's
 * `attributes` are always empty (see `flatDastFromJS.ts`), and the settings
 * live in `data.props` instead. These renderers read them from there and
 * spell them the PreTeXt way.
 *
 * Three families of renaming are involved:
 *
 *  - **Borders.** DoenetML names the four edges relative to the writing
 *    direction (`topBorder`, `bottomBorder`, `startBorder`, `endBorder`);
 *    PreTeXt names them physically (`top`, `bottom`, `left`, `right`). The
 *    weights (`none`/`minor`/`medium`/`major`) are shared, having been
 *    borrowed from PreTeXt in the first place.
 *  - **Alignment.** `halign="start"`/`"end"` become `"left"`/`"right"`.
 *    PreTeXt has no writing-direction-relative alignment, so this assumes a
 *    left-to-right document — the same assumption the rest of the PreTeXt
 *    export already makes.
 *  - **Columns.** DoenetML's `<col>` children have no renderer of their own;
 *    the `<tabular>` carries their settings in `columnSpecs`, and the `<col>`
 *    elements are written back out here, ahead of the rows, which is where
 *    PreTeXt's schema wants them. Their widths are rescaled for print, and
 *    the cells in columns with widths are set as paragraphs, so that PreTeXt
 *    applies them (see `Tabular` and `Cell`).
 *
 * `TableSettingsContext` exists because the props are *resolved* values: a
 * `<tabular halign="center">` leaves every cell reporting `"center"`, so
 * writing each prop out unconditionally would bury one authored attribute
 * under dozens of redundant ones. Each level instead emits a setting only
 * where it differs from what it inherits, which stays close to the author's
 * markup and renders identically either way.
 */

/**
 * The largest `colspan` written out, matching both HTML's own limit and the
 * `MAX_COLSPAN` the worker clamps a cell's column cursor to
 * (`utils/tabularAttributes.ts`). Without it a runaway `colSpan="2000000"`
 * would be written verbatim into a table for which only 1001 `<col>` elements
 * were emitted. The two copies are kept in step by hand: the worker's lives in
 * `@doenet/doenetml-worker-javascript`, which this package does not depend on
 * — it sees only the flat DAST the worker produces.
 */
const MAX_COLSPAN = 1000;

/**
 * Elements the PreTeXt renderers write out as just their children, with no
 * tag of their own (`PassThroughWithoutTagConverter` in `../renderers.ts`),
 * so whatever they hold lands directly in the enclosing element.
 */
const TAGLESS_ELEMENTS = new Set(["div", "cascade"]);

/** A `colSpan` prop as a number of columns, the way the worker counts them. */
function effectiveColSpan(colSpan: number | undefined): number {
    return Number.isInteger(colSpan) && colSpan! > 0
        ? Math.min(colSpan!, MAX_COLSPAN)
        : 1;
}

/** DoenetML alignment → the PreTeXt spelling. */
const HALIGN_TO_PRETEXT: Record<string, string> = {
    start: "left",
    center: "center",
    end: "right",
    justify: "justify",
};

export type ColumnSpec = {
    width: { size: number; isAbsolute: boolean } | null;
    halign: string | null;
    topBorder: string | null;
    endBorder: string | null;
};

type TableSettings = {
    halign: string;
    valign: string;
    bottomBorder: string;
    startBorder: string;
    endBorder: string;
    /** The enclosing `<tabular>`'s columns, for cells to consult. */
    columnSpecs: ColumnSpec[];
    /**
     * The `<col>` width printed for each column, as a percentage of the line
     * (see `printedColumnWidths`), or `null`/0 for a column printed with
     * none. A cell in columns that all have one is set as a paragraph.
     */
    printedWidths: (number | null)[];
    /**
     * Whether the enclosing `<row>` set an alignment of its own. A row
     * outranks a column in PreTeXt, so when it did, a cell compares itself
     * against the row and ignores its column.
     */
    rowOverridesColumnHalign: boolean;
};

/** What a `<tabular>` resolves to when the author sets nothing. */
const DEFAULT_TABLE_SETTINGS: TableSettings = {
    halign: "start",
    valign: "middle",
    bottomBorder: "none",
    startBorder: "none",
    endBorder: "none",
    columnSpecs: [],
    printedWidths: [],
    rowOverridesColumnHalign: false,
};

const TableSettingsContext = React.createContext<TableSettings>(
    DEFAULT_TABLE_SETTINGS,
);

/**
 * A `componentSize` as a PreTeXt width, or `undefined` when there is nothing
 * PreTeXt can say. PreTeXt expresses a tabular's and a column's width as a
 * percentage only, so an absolute size (`width="120px"`) has no equivalent
 * and is dropped rather than mistranslated.
 */
function componentSizeToPretextWidth(
    size: { size: number; isAbsolute: boolean } | null | undefined,
): string | undefined {
    if (!size || size.isAbsolute) {
        return undefined;
    }
    return `${size.size}%`;
}

/** `value`, unless it matches `inherited` and so would be redundant. */
function ifChanged(value: unknown, inherited: unknown): string | undefined {
    if (typeof value !== "string" || value === inherited) {
        return undefined;
    }
    return value;
}

/** An alignment, mapped to PreTeXt, unless it repeats the inherited one. */
function halignIfChanged(
    value: unknown,
    inherited: unknown,
): string | undefined {
    const changed = ifChanged(value, inherited);
    return changed === undefined ? undefined : HALIGN_TO_PRETEXT[changed];
}

type TabularData = {
    props: {
        width?: { size: number; isAbsolute: boolean } | null;
        halign?: string;
        valign?: string;
        topBorder?: string;
        startBorder?: string;
        bottomBorder?: string;
        endBorder?: string;
        columnSpecs?: ColumnSpec[];
    };
};

export const Tabular: BasicComponentWithPassthroughChildren<TabularData> = ({
    node,
    children,
}) => {
    const props = node.data.props;

    const columnSpecs = props.columnSpecs ?? [];

    // On screen a column's percentage is a share of the `<tabular>`, padding
    // included; in print PreTeXt reads it as a share of the line and LaTeX
    // pads outside it, so the widths are rescaled to fit
    // (`printedColumnWidths`). A `<tabular width>` needs no rescaling of its
    // own: PreTeXt sets the table in a box that wide, and reads the column
    // widths as shares of the box. The padding is a larger share of a
    // narrower box, though, which is what `lineFraction` accounts for. A
    // width in pixels is not written out (see below), so it counts as the
    // full line.
    const percents = columnSpecs.map(({ width }) =>
        width && !width.isAbsolute && width.size > 0 ? width.size : null,
    );
    const lineFraction =
        props.width && !props.width.isAbsolute && props.width.size > 0
            ? Math.min(props.width.size, 100) / 100
            : 1;
    const printedWidths = percents.some((percent) => percent)
        ? printedColumnWidths(percents, { lineFraction })
        : percents;

    const settings: TableSettings = {
        halign: props.halign ?? DEFAULT_TABLE_SETTINGS.halign,
        valign: props.valign ?? DEFAULT_TABLE_SETTINGS.valign,
        bottomBorder: props.bottomBorder ?? DEFAULT_TABLE_SETTINGS.bottomBorder,
        startBorder: props.startBorder ?? DEFAULT_TABLE_SETTINGS.startBorder,
        endBorder: props.endBorder ?? DEFAULT_TABLE_SETTINGS.endBorder,
        columnSpecs,
        printedWidths,
        rowOverridesColumnHalign: false,
    };

    // A `<tabular>` is 100% wide unless the author says otherwise, and PreTeXt
    // reads a missing `width` the same way, so the default stays unwritten.
    // `height` has no PreTeXt counterpart at all and is dropped.
    const width = componentSizeToPretextWidth(props.width);

    return (
        <tabular
            width={width === "100%" ? undefined : width}
            halign={halignIfChanged(
                settings.halign,
                DEFAULT_TABLE_SETTINGS.halign,
            )}
            valign={ifChanged(settings.valign, DEFAULT_TABLE_SETTINGS.valign)}
            top={ifChanged(props.topBorder, "none")}
            bottom={ifChanged(settings.bottomBorder, "none")}
            left={ifChanged(settings.startBorder, "none")}
            right={ifChanged(settings.endBorder, "none")}
        >
            {columnSpecs.map((spec, index) =>
                // Written with `createElement` rather than as `<col ... />`
                // because `col` is one of the few PreTeXt element names that
                // is also an HTML one, so in JSX it picks up React's HTML
                // typing and rejects PreTeXt's attributes.
                React.createElement("col", {
                    key: index,
                    width: printedWidths[index]
                        ? `${printedWidths[index]}%`
                        : undefined,
                    halign:
                        spec.halign == null
                            ? undefined
                            : HALIGN_TO_PRETEXT[spec.halign],
                    top: spec.topBorder ?? undefined,
                    right: spec.endBorder ?? undefined,
                }),
            )}
            <TableSettingsContext.Provider value={settings}>
                {children}
            </TableSettingsContext.Provider>
        </tabular>
    );
};

type RowData = {
    props: {
        header?: boolean;
        halign?: string;
        valign?: string;
        startBorder?: string;
        bottomBorder?: string;
    };
};

export const Row: BasicComponentWithPassthroughChildren<RowData> = ({
    node,
    children,
}) => {
    const props = node.data.props;
    const inherited = React.useContext(TableSettingsContext);

    const halign = halignIfChanged(props.halign, inherited.halign);
    const settings: TableSettings = {
        ...inherited,
        halign: props.halign ?? inherited.halign,
        valign: props.valign ?? inherited.valign,
        startBorder: props.startBorder ?? inherited.startBorder,
        bottomBorder: props.bottomBorder ?? inherited.bottomBorder,
        rowOverridesColumnHalign: halign !== undefined,
    };

    return (
        <row
            header={props.header ? "yes" : undefined}
            halign={halign}
            valign={ifChanged(settings.valign, inherited.valign)}
            bottom={ifChanged(settings.bottomBorder, inherited.bottomBorder)}
            left={ifChanged(settings.startBorder, inherited.startBorder)}
        >
            <TableSettingsContext.Provider value={settings}>
                {children}
            </TableSettingsContext.Provider>
        </row>
    );
};

type CellData = {
    props: {
        colSpan?: number;
        columnIndex?: number | null;
        halign?: string;
        bottomBorder?: string;
        endBorder?: string;
        text?: string;
    };
};

export const Cell: BasicComponentWithPassthroughChildren<CellData> = ({
    node,
    children,
}) => {
    const props = node.data.props;
    const inherited = React.useContext(TableSettingsContext);

    // What this cell would align and border as if it said nothing itself,
    // which is what its own props have to differ from to be worth writing.
    // The column is only consulted where it is not already outranked: by the
    // row for `halign`, by nothing at all for the trailing border, since a
    // PreTeXt `<row>` has no `right`.
    //
    // A cell that spans columns aligns with the first one it covers and
    // borders with the last, which is where its trailing edge falls — the
    // same two columns `Cell.js` consults in the worker.
    const columnIndex = props.columnIndex;
    const lastColumnIndex =
        columnIndex == null
            ? null
            : columnIndex + effectiveColSpan(props.colSpan) - 1;
    const halignColumn =
        columnIndex == null ? undefined : inherited.columnSpecs[columnIndex];
    const endBorderColumn =
        lastColumnIndex == null
            ? undefined
            : inherited.columnSpecs[lastColumnIndex];
    const inheritedHalign =
        (inherited.rowOverridesColumnHalign ? null : halignColumn?.halign) ??
        inherited.halign;
    const inheritedEndBorder =
        endBorderColumn?.endBorder ?? inherited.endBorder;

    // A cell whose content did not survive as children still has its text —
    // the same fallback the HTML renderer uses.
    const hasChildren = React.Children.count(children) > 0;
    const content = hasChildren ? children : (props.text ?? "");

    // PreTeXt applies a column's width only to a cell holding a `<p>`, which
    // it sets as a paragraph box that wide; any other cell keeps its natural
    // width and can push the column wider. So a cell whose columns all have
    // a printed width is wrapped in a `<p>`. A spanning cell needs every
    // column it covers to have one, since PreTeXt counts a column with none
    // as 20% of the line. A cell that already holds paragraphs is left as it
    // is: a PreTeXt cell holds either paragraphs or inline content. A
    // `<p>` inside an element written out with no tag of its own (see
    // `TAGLESS_ELEMENTS`) lands directly in the cell, so it counts too.
    const hasParagraphChild = useAppSelector((state) => {
        const elementsArray = elementsArraySelector(state);
        const holdsParagraph = (
            elementChildren: typeof node.children,
        ): boolean =>
            elementChildren.some((child) => {
                if (typeof child === "string") {
                    return false;
                }
                const element = elementsArray[child.id];
                return (
                    element?.name === "p" ||
                    (element != null &&
                        TAGLESS_ELEMENTS.has(element.name) &&
                        holdsParagraph(element.children))
                );
            });
        return holdsParagraph(node.children);
    });
    let inWidthColumns = columnIndex != null && lastColumnIndex != null;
    for (
        let i = columnIndex ?? 0;
        inWidthColumns && i <= lastColumnIndex!;
        i++
    ) {
        inWidthColumns = Boolean(inherited.printedWidths[i]);
    }
    const asParagraph = inWidthColumns && !hasParagraphChild;

    return (
        <cell
            // Only a genuine span is worth writing, and only a positive
            // whole number is a span at all: `colSpan="0"`, `colSpan="-2"`
            // and a `colSpan` whose content did not parse (`NaN`) each
            // occupy one column here and in HTML. PreTeXt's schema would let
            // `colspan="0"` through — it declares `colspan` with no datatype
            // — so writing one out would hand PreTeXt a span it has no
            // reading of, and one that contradicts the `<col>` list written
            // beside it.
            colspan={
                Number.isInteger(props.colSpan) && props.colSpan! > 1
                    ? String(effectiveColSpan(props.colSpan))
                    : undefined
            }
            halign={halignIfChanged(props.halign, inheritedHalign)}
            bottom={ifChanged(props.bottomBorder, inherited.bottomBorder)}
            right={ifChanged(props.endBorder, inheritedEndBorder)}
        >
            {asParagraph ? <p>{content}</p> : content}
        </cell>
    );
};
