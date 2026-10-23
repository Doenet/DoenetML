//! Support for tests and benches, not used by the library itself: an
//! independent oracle for the scheduled program, helpers that turn
//! DoenetML source into a document, DASTs built in Rust for tests that
//! need no parser (`dast`), and component specs (`spec!`).

pub mod dast;
pub mod reference;
pub mod spec;
pub mod test_utils;

#[cfg(feature = "testing")]
pub use crate::build::coverage::{ProbeEdges, probe_edges, uncovered};

/// The compile of `dast` for a session at `seed`, checked as a load checks
/// it, whether or not a load would keep it.
pub fn compile(
    dast: &crate::dast::Dast,
    seed: u64,
) -> crate::Result<std::sync::Arc<crate::compile::Compiled>> {
    let dast = std::sync::Arc::new(dast.clone());
    let session = crate::session::Session::new(seed, false);
    Ok(crate::compile::compile(&dast, &session, true)?.compiled)
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
        [c] => doc.cells[*c as usize],
        cs => panic!("{path}: {} cells, not one", cs.len()),
    }
}

/// One tick requesting `value` for the one-cell prop at `path`, for a unit
/// test; panics as `prop_value` does.
pub fn request_prop(doc: &mut crate::Document, path: &str, value: f64) -> crate::TickOutcome {
    let cell = match spec::cells(doc, path)
        .unwrap_or_else(|e| panic!("{e}"))
        .as_slice()
    {
        [c] => *c,
        cs => panic!("{path}: {} cells, not one", cs.len()),
    };
    doc.request(&[crate::Request { cell, value }])
}

/// The essential cells saved state cannot name (ADR 0017): hidden slots
/// holding no shared state, as `key (hidden slot k)`.
pub fn unsaved_essentials(doc: &crate::Document) -> Vec<String> {
    use crate::compile::plan::HIDDEN;
    let mut out: Vec<String> = doc
        .structure
        .essential_keys
        .iter()
        .filter(|&&(key, prop)| doc.keys.prop_key(key, prop).is_none())
        .map(|&(key, prop)| {
            format!(
                "{} {} (hidden slot {})",
                doc.keys.key_type(key).tag(),
                doc.keys.key_text(key),
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
    use crate::document::NONE;
    let mut key_of = std::collections::HashMap::new();
    for t in &compiled.templates {
        for el in &t.elems {
            if el.node != NONE {
                key_of.insert(el.node, compiled.keys.key_text(el.key).to_string());
            }
        }
    }
    let t = &doc.components;
    let mut out = std::collections::BTreeMap::new();
    for c in 0..doc.n_components() as crate::CompIdx {
        let ty = doc.component_type(c);
        let cells = doc.comp_cells(c);
        let node = t.dast_node[c as usize];
        let Some(key) = key_of.get(&node) else {
            continue;
        };
        let names: Vec<(String, crate::CellIdx)> = (0..cells.len())
            .filter(|&pi| ty.is_interactive_prop(cells.len(), pi))
            .filter_map(|pi| Some((ty.prop_name(cells.len(), pi)?.into_owned(), cells[pi])))
            .collect();
        if names.is_empty() {
            continue;
        }
        let text = |cell: crate::CellIdx| match doc.program.value_types[cell as usize] {
            ValueType::Number => format!("{:?}", doc.cells[cell as usize]),
            ValueType::Text => doc.text_value(cell),
            ValueType::Math => doc.math_text(cell),
        };
        let values = names.iter().map(|(n, c)| (n.clone(), text(*c))).collect();
        let value = |name: &str| {
            names
                .iter()
                .find(|(n, _)| n == name)
                .map(|&(_, c)| doc.cells[c as usize])
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
        let mut a = t.parent[c as usize];
        while a != NONE && doc.component_type(a) != ComponentType::Graph {
            a = t.parent[a as usize];
        }
        let bounds = (a != NONE && ty != ComponentType::Graph).then(|| {
            let g = doc.comp_cells(a);
            let author = |p: &str| {
                let cell = g[ComponentType::Graph.prop_index(p).unwrap()] as usize;
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
        let scope = doc.scope_path_text(t.scope[c as usize]);
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
