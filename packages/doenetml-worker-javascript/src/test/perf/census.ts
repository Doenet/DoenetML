/**
 * Component census for the performance work (Doenet/DoenetML#2126).
 *
 * Counts what a document actually created in the JavaScript core: components
 * by type, the ones that shadow another component, the ones that are
 * attribute components, state variables (allocated and resolved), and
 * dependencies by kind and by owning component type. Component counts are
 * deterministic for a given document and build, which makes them the
 * regression gate (`census.test.ts`); time is reported next to them by
 * `perf-bench.test.ts`, never asserted.
 */
import type { PublicDoenetMLCore } from "../../CoreWorker";

export type Census = {
    components: number;
    /** Components whose `shadows` is set: linked copies of another component. */
    shadows: number;
    /** Components owned by a parent's `attributes[*].component`. */
    attributeComponents: number;
    /** `_copy` composites. */
    copies: number;
    stateVariables: number;
    stateVariablesResolved: number;
    dependencies: number;
    /** `DependencyHandler` counters for the lazy-materialization work. */
    numDependencySetups: number;
    numMaterializedStateVariables: number;
    byType: Record<string, number>;
    shadowsByType: Record<string, number>;
    attributeComponentsByType: Record<string, number>;
    dependenciesByKind: Record<string, number>;
    dependenciesByComponentType: Record<string, number>;
    stateVariablesByComponentType: Record<string, number>;
};

/** The part of a census that is stable enough to snapshot in CI. */
export type CensusSummary = Pick<
    Census,
    | "components"
    | "shadows"
    | "attributeComponents"
    | "copies"
    | "stateVariables"
    | "stateVariablesResolved"
    | "dependencies"
    | "byType"
>;

function innerCore(core: PublicDoenetMLCore): any {
    const inner: any = core.core;
    if (!inner) {
        throw new Error("The core has not been initialized.");
    }
    return inner;
}

/** The live components of `core`, in index order. */
function liveComponents(inner: any): any[] {
    return (Object.values(inner._components) as any[])
        .filter((c) => c && c.state)
        .sort((a, b) => a.componentIdx - b.componentIdx);
}

/** Whether `c` is held in its parent's `attributes` rather than its children. */
function isAttributeComponent(inner: any, c: any): boolean {
    const parent = inner._components[c.parentIdx];
    if (!parent?.attributes) {
        return false;
    }
    for (const attr of Object.values(parent.attributes) as any[]) {
        if (attr?.component === c) {
            return true;
        }
    }
    return false;
}

/** The names of the attribute components `c` owns, as `name→#idx`. */
function ownedAttributeComponents(c: any): string[] {
    return Object.entries(c.attributes ?? {})
        .filter(([, v]: [string, any]) => v?.component)
        .map(([k, v]: [string, any]) => `${k}→#${v.component.componentIdx}`);
}

function bump(record: Record<string, number>, key: string, by = 1) {
    record[key] = (record[key] ?? 0) + by;
}

/** Largest first, then by name, so output is stable. */
function sortedByValue(record: Record<string, number>) {
    return Object.fromEntries(
        Object.entries(record).sort(
            ([a, x], [b, y]) => y - x || a.localeCompare(b),
        ),
    );
}

/** The dependency objects of component `idx`, over all its state variables. */
function dependenciesOf(inner: any, idx: number): any[] {
    const bySv = inner.dependencies.downstreamDependencies[idx];
    if (!bySv) {
        return [];
    }
    const deps: any[] = [];
    for (const svDeps of Object.values(bySv) as any[]) {
        deps.push(...Object.values(svDeps));
    }
    return deps;
}

export function censusOfCore(core: PublicDoenetMLCore): Census {
    const inner = innerCore(core);
    const census: Census = {
        components: 0,
        shadows: 0,
        attributeComponents: 0,
        copies: 0,
        stateVariables: 0,
        stateVariablesResolved: 0,
        dependencies: 0,
        numDependencySetups: inner.dependencies.numDependencySetups ?? 0,
        numMaterializedStateVariables:
            inner.dependencies.numMaterializedStateVariables ?? 0,
        byType: {},
        shadowsByType: {},
        attributeComponentsByType: {},
        dependenciesByKind: {},
        dependenciesByComponentType: {},
        stateVariablesByComponentType: {},
    };

    for (const c of liveComponents(inner)) {
        const type = c.componentType;
        census.components++;
        bump(census.byType, type);
        if (c.shadows) {
            census.shadows++;
            bump(census.shadowsByType, type);
        }
        if (isAttributeComponent(inner, c)) {
            census.attributeComponents++;
            bump(census.attributeComponentsByType, type);
        }
        if (type === "_copy") {
            census.copies++;
        }

        const stateVariables = Object.values(c.state) as any[];
        census.stateVariables += stateVariables.length;
        bump(census.stateVariablesByComponentType, type, stateVariables.length);
        for (const sv of stateVariables) {
            if (sv.isResolved) {
                census.stateVariablesResolved++;
            }
        }

        const deps = dependenciesOf(inner, c.componentIdx);
        census.dependencies += deps.length;
        bump(census.dependenciesByComponentType, type, deps.length);
        for (const dep of deps) {
            bump(census.dependenciesByKind, dep.dependencyType ?? "(unknown)");
        }
    }

    census.byType = sortedByValue(census.byType);
    census.shadowsByType = sortedByValue(census.shadowsByType);
    census.attributeComponentsByType = sortedByValue(
        census.attributeComponentsByType,
    );
    census.dependenciesByKind = sortedByValue(census.dependenciesByKind);
    census.dependenciesByComponentType = sortedByValue(
        census.dependenciesByComponentType,
    );
    census.stateVariablesByComponentType = sortedByValue(
        census.stateVariablesByComponentType,
    );
    return census;
}

export function censusSummary(census: Census): CensusSummary {
    return {
        components: census.components,
        shadows: census.shadows,
        attributeComponents: census.attributeComponents,
        copies: census.copies,
        stateVariables: census.stateVariables,
        stateVariablesResolved: census.stateVariablesResolved,
        dependencies: census.dependencies,
        byType: census.byType,
    };
}

/**
 * One line per component, for reading a small document's graph by eye:
 * index, type, parent, state-variable and dependency counts, what it
 * shadows, and which attribute components it owns.
 */
export function listComponents(core: PublicDoenetMLCore): string[] {
    const inner = innerCore(core);
    return liveComponents(inner).map((c) => {
        const parts = [
            `#${c.componentIdx}`,
            c.componentType,
            `parent=${c.parentIdx === undefined ? "-" : "#" + c.parentIdx}`,
            `sv=${Object.keys(c.state).length}`,
            `deps=${dependenciesOf(inner, c.componentIdx).length}`,
        ];
        if (c.shadows) {
            parts.push(
                `shadows=#${c.shadows.componentIdx}${
                    c.shadows.propVariable ? "." + c.shadows.propVariable : ""
                }`,
            );
        }
        const attrs = ownedAttributeComponents(c);
        if (attrs.length > 0) {
            parts.push(`attrComps=[${attrs.join(",")}]`);
        }
        return parts.join(" ");
    });
}

export type CensusTableRow = {
    name: string;
    census: Census;
    loadMs?: number;
    error?: string;
};

const fmt = new Intl.NumberFormat("en-US");

/** A GitHub-flavored markdown table, one row per fixture. */
export function censusMarkdownTable(rows: CensusTableRow[]): string {
    const lines = [
        "| fixture | components | shadows | attribute comps | `_copy` | state vars | resolved | dependencies | load (ms) |",
        "|---|---:|---:|---:|---:|---:|---:|---:|---:|",
    ];
    for (const row of rows) {
        if (row.error) {
            lines.push(`| ${row.name} | failed: ${row.error} | | | | | | | |`);
            continue;
        }
        const c = row.census;
        lines.push(
            `| ${row.name} | ${fmt.format(c.components)} | ${fmt.format(c.shadows)} | ${fmt.format(c.attributeComponents)} | ${fmt.format(c.copies)} | ${fmt.format(c.stateVariables)} | ${fmt.format(c.stateVariablesResolved)} | ${fmt.format(c.dependencies)} | ${row.loadMs === undefined ? "" : fmt.format(Math.round(row.loadMs))} |`,
        );
    }
    return lines.join("\n");
}

/** `{a: 3, b: 1}` as `a 3, b 1`, for the narrow columns of a summary. */
export function formatCounts(record: Record<string, number>, limit = 8) {
    return Object.entries(record)
        .slice(0, limit)
        .map(([k, v]) => `${k} ${fmt.format(v)}`)
        .join(", ");
}
