import React from "react";
import { BasicComponentWithPassthroughChildren } from "../types";

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
 *    PreTeXt's schema wants them.
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
 * `MAX_COLSPAN` the worker clamps a cell's column cursor to (`Row.js`).
 * Without it a runaway `colSpan="2000000"` would be written verbatim into a
 * table for which only 1001 `<col>` elements were emitted.
 */
const MAX_COLSPAN = 1000;

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

    const settings: TableSettings = {
        halign: props.halign ?? DEFAULT_TABLE_SETTINGS.halign,
        valign: props.valign ?? DEFAULT_TABLE_SETTINGS.valign,
        bottomBorder: props.bottomBorder ?? DEFAULT_TABLE_SETTINGS.bottomBorder,
        startBorder: props.startBorder ?? DEFAULT_TABLE_SETTINGS.startBorder,
        endBorder: props.endBorder ?? DEFAULT_TABLE_SETTINGS.endBorder,
        columnSpecs: props.columnSpecs ?? [],
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
            {settings.columnSpecs.map((spec, index) =>
                // Written with `createElement` rather than as `<col ... />`
                // because `col` is one of the few PreTeXt element names that
                // is also an HTML one, so in JSX it picks up React's HTML
                // typing and rejects PreTeXt's attributes.
                React.createElement("col", {
                    key: index,
                    width: componentSizeToPretextWidth(spec.width),
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
            : Number.isInteger(props.colSpan) && props.colSpan! > 1
              ? columnIndex + props.colSpan! - 1
              : columnIndex;
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

    return (
        <cell
            // Only a genuine span is worth writing, and only a positive
            // whole number is a span at all: `colSpan="0"`, `colSpan="-2"`
            // and a `colSpan` whose content did not parse (`NaN`) each
            // occupy one column here and in HTML, and `colspan="0"` is not
            // something PreTeXt's schema accepts.
            colspan={
                Number.isInteger(props.colSpan) && props.colSpan! > 1
                    ? String(Math.min(props.colSpan!, MAX_COLSPAN))
                    : undefined
            }
            halign={halignIfChanged(props.halign, inheritedHalign)}
            bottom={ifChanged(props.bottomBorder, inherited.bottomBorder)}
            right={ifChanged(props.endBorder, inheritedEndBorder)}
        >
            {hasChildren ? children : (props.text ?? "")}
        </cell>
    );
};
