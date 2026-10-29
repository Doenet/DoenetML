//! Support for tests and benches, not used by the library itself: an
//! independent oracle for the scheduled program, helpers that turn
//! DoenetML source into a document, DASTs built in Rust for tests that
//! need no parser (`dast`), and component specs (`spec!`).

pub mod dast;
pub mod reference;
pub mod spec;
pub mod test_utils;

pub use crate::build::coverage::{ProbeEdges, probe_edges, uncovered};

/// The compile of `dast` for a session at `seed`, checked as a load checks
/// it, whether or not a load would keep it.
pub fn compile(
    dast: &crate::dast::Dast,
    seed: u64,
) -> crate::Result<std::sync::Arc<crate::compile::Compiled>> {
    let dast = std::sync::Arc::new(dast.clone());
    let session = crate::session::Session::new(seed);
    Ok(crate::compile::compile(&dast, &session, true, true, true)?.compiled)
}

/// `compile`, with every value slot essential, as before ADR 0018
/// (`LoadOptions::classify` off): what the classing is checked against.
pub fn compile_unclassified(
    dast: &crate::dast::Dast,
    seed: u64,
) -> crate::Result<std::sync::Arc<crate::compile::Compiled>> {
    let dast = std::sync::Arc::new(dast.clone());
    let session = crate::session::Session::new(seed);
    Ok(crate::compile::compile(&dast, &session, true, false, true)?.compiled)
}

/// `compile`, with every prop computed (`LoadOptions::prune` off, ADR
/// 0019), so two builds of it number their cells alike whatever each finds
/// live.
pub fn compile_unpruned(
    dast: &crate::dast::Dast,
    seed: u64,
) -> crate::Result<std::sync::Arc<crate::compile::Compiled>> {
    let dast = std::sync::Arc::new(dast.clone());
    let session = crate::session::Session::new(seed);
    Ok(crate::compile::compile(&dast, &session, true, true, false)?.compiled)
}

/// `compiled`, but each of its builds classes its value slots by its own
/// walk, not by the probe's record (ADR 0018): what the record must hold.
pub fn with_own_walk(
    compiled: &crate::compile::Compiled,
) -> std::sync::Arc<crate::compile::Compiled> {
    let mut own = compiled.clone();
    own.classes = crate::compile::plan::Classes::Walk;
    std::sync::Arc::new(own)
}

/// `compiled`, but each of its builds finds what is live by its own walk,
/// not by the probe's record (ADR 0019): what the record must hold.
pub fn with_own_live_walk(
    compiled: &crate::compile::Compiled,
) -> std::sync::Arc<crate::compile::Compiled> {
    let mut own = compiled.clone();
    own.live = crate::compile::plan::Classes::Walk;
    std::sync::Arc::new(own)
}

/// A document built from `compiled` at `seed` as a load builds it: until
/// the structure settles, seeding afresh on later passes.
pub fn load_compiled(
    compiled: &std::sync::Arc<crate::compile::Compiled>,
    seed: u64,
) -> crate::Result<crate::Document> {
    let session = crate::session::Session::new(seed);
    let (doc, _) = crate::document::settle(
        compiled,
        &session,
        crate::session::Counts::default(),
        None,
        true,
    )?;
    Ok(doc)
}

/// The compile of `dast` for a session at `seed`, as text equal exactly when
/// two compiles are: what `tests/compile_purity.rs` compares across seeds.
pub fn compile_fingerprint(dast: &crate::dast::Dast, seed: u64) -> crate::Result<String> {
    Ok(compile(dast, seed)?.fingerprint())
}

/// The value of the one-cell prop at `path` (`"c.radius"`), for a unit
/// test; panics when there is no such prop or it has several cells.
pub fn prop_value(doc: &crate::Document, path: &str) -> f64 {
    match spec::cells(doc, path)
        .unwrap_or_else(|e| panic!("{e}"))
        .as_slice()
    {
        [c] => doc.cells[c.index()],
        cs => panic!("{path}: {} cells, not one", cs.len()),
    }
}

/// One tick requesting `value` for the one-cell prop at `path`, for a unit
/// test of the language's rules over test-only components: a test of the
/// machinery, so the request is unchecked (`request_unchecked`). Panics
/// as `prop_value` does.
pub fn request_prop(doc: &mut crate::Document, path: &str, value: f64) -> crate::TickOutcome {
    let cell = match spec::cells(doc, path)
        .unwrap_or_else(|e| panic!("{e}"))
        .as_slice()
    {
        [c] => *c,
        cs => panic!("{path}: {} cells, not one", cs.len()),
    };
    doc.tick_unchecked(&[crate::Request { cell, value }], &[])
}

/// Requests on any cells, inverted as `Document::request` inverts them,
/// without the check that each is an input's (ADR 0018): for a test of
/// the core's machinery (a forced count, an inversion through a
/// `<number>`), not of a component, whose spec reaches a prop through an
/// input. It still writes only essential cells, so it cannot change a
/// fixed value.
pub fn request_unchecked(
    doc: &mut crate::Document,
    requests: &[crate::Request],
) -> crate::TickOutcome {
    doc.tick_unchecked(requests, &[])
}

/// A point group on any cells (`request_unchecked`).
pub fn request_points_unchecked(
    doc: &mut crate::Document,
    points: &[crate::PointRequest],
) -> crate::TickOutcome {
    doc.tick_unchecked(&[], &[points.to_vec()])
}

/// The essential cells saved state cannot name (ADR 0017): hidden slots
/// holding no shared state, as `key (hidden slot k)`.
pub fn unsaved_essentials(doc: &crate::Document) -> Vec<String> {
    use crate::compile::plan::HIDDEN;
    let mut out: Vec<String> = doc
        .structure
        .essential_keys
        .iter()
        .filter(|&&(key, prop)| doc.loaded.keys.prop_key(key, prop).is_none())
        .map(|&(key, prop)| {
            format!(
                "{} {} (hidden slot {})",
                doc.loaded.keys.key_type(key).tag(),
                doc.loaded.keys.key_text(key),
                prop & !HIDDEN
            )
        })
        .collect();
    out.sort();
    out.dedup();
    out
}

/// What a student sees of one input (ADR 0017's soundness test): its
/// interactive props' values as text, the points among them, and the
/// bounds of the graph it is in, as the author set them.
#[derive(Debug, Clone, PartialEq)]
pub struct InputState {
    pub values: Vec<(String, String)>,
    pub points: Vec<(f64, f64)>,
    pub bounds: Option<[f64; 4]>,
}

/// Every input of `doc` by its scope path and stable key, as `compiled`
/// (the document's compile, from `compile`) keys its elements: what a
/// restore must give back.
pub fn inputs(
    doc: &crate::Document,
    compiled: &crate::Compiled,
) -> std::collections::BTreeMap<String, InputState> {
    use crate::ValueType;
    use crate::components::ComponentType;

    let mut key_of = std::collections::HashMap::new();
    for t in &compiled.templates {
        for el in &t.elems {
            if el.node != crate::dast::NodeId::NONE {
                key_of.insert(el.node, compiled.keys.key_text(el.key).to_string());
            }
        }
    }
    let t = &doc.components;
    let mut out = std::collections::BTreeMap::new();
    for c in crate::CompIdx::below(doc.n_components()) {
        let ty = doc.component_type(c);
        let cells = doc.comp_cells(c);
        let node = t.dast_node[c.index()];
        let Some(key) = key_of.get(&node) else {
            continue;
        };
        let names: Vec<(String, crate::CellIdx)> = (0..cells.len())
            .filter(|&pi| ty.is_input_prop(cells.len(), pi))
            .filter_map(|pi| Some((ty.prop_name(cells.len(), pi)?.into_owned(), cells[pi])))
            .collect();
        if names.is_empty() {
            continue;
        }
        let text = |cell: crate::CellIdx| match doc.value_types[cell.index()] {
            ValueType::Number => format!("{:?}", doc.cells[cell.index()]),
            ValueType::Text => doc.text_value(cell),
            ValueType::Math => doc.math_text(cell),
        };
        let values = names.iter().map(|(n, c)| (n.clone(), text(*c))).collect();
        let value = |name: &str| {
            names
                .iter()
                .find(|(n, _)| n == name)
                .map(|&(_, c)| doc.cells[c.index()])
        };
        let mut points = Vec::new();
        for (n, _) in &names {
            let partner = match n.as_str() {
                "cx" => Some("cy".to_string()),
                n => n.strip_prefix('x').map(|rest| format!("y{rest}")),
            };
            if let Some(p) = partner
                && let (Some(x), Some(y)) = (value(n), value(&p))
            {
                points.push((x, y));
            }
        }
        let mut a = t.parent[c.index()];
        while a != crate::CompIdx::NONE && doc.component_type(a) != ComponentType::Graph {
            a = t.parent[a.index()];
        }
        let bounds = (a != crate::CompIdx::NONE && ty != ComponentType::Graph).then(|| {
            let g = doc.comp_cells(a);
            let author = |p: &str| {
                let cell = g[ComponentType::Graph.prop_index(p).unwrap()].index();
                if cell < doc.n_essential {
                    doc.structure.essential_defaults[cell]
                } else {
                    doc.cells[cell]
                }
            };
            [
                author("xmin"),
                author("xmax"),
                author("ymin"),
                author("ymax"),
            ]
        });
        let scope = doc.scope_path_text(t.scope[c.index()]);
        out.insert(
            format!("{scope}{key}"),
            InputState {
                values,
                points,
                bounds,
            },
        );
    }
    out
}

/// Whether `pruned` (`LoadOptions::prune` on) and `full` (off), the same
/// document after the same ticks, agree on every live cell (ADR 0019):
/// prop by prop, every prop whose cell is live in `pruned` holds the same
/// value in both, a math cell the same expression and a text cell the
/// same string. Pruning gives cells, never components, so the component
/// tables match. The first disagreement, as `type.prop of component`.
pub fn live_cells_agree(full: &crate::Document, pruned: &crate::Document) -> Result<(), String> {
    use crate::program::ValueType;
    if full.n_components() != pruned.n_components() {
        return Err(format!(
            "{} components unpruned, {} pruned",
            full.n_components(),
            pruned.n_components()
        ));
    }
    for c in crate::CompIdx::below(pruned.n_components()) {
        let (fc, pc) = (full.comp_cells(c), pruned.comp_cells(c));
        for (pi, (&f, &p)) in fc.iter().zip(pc).enumerate() {
            if !pruned.is_live(p) {
                continue;
            }
            let same = match pruned.value_types[p.index()] {
                ValueType::Math => full.math_text(f) == pruned.math_text(p),
                ValueType::Text => full.text_value(f) == pruned.text_value(p),
                ValueType::Number => {
                    let (a, b) = (full.cells[f.index()], pruned.cells[p.index()]);
                    a == b || (a.is_nan() && b.is_nan())
                }
            };
            if !same {
                let ty = pruned.component_type(c);
                return Err(format!(
                    "{}.{} of component {c}: {} unpruned, {} pruned",
                    ty.tag(),
                    ty.prop_name(pc.len(), pi).unwrap_or_default(),
                    full.cells[f.index()],
                    pruned.cells[p.index()]
                ));
            }
        }
    }
    Ok(())
}
