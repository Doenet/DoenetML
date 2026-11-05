//! Support for tests and benches: an independent oracle for the scheduled
//! program, helpers that turn DoenetML source into a document, DASTs built
//! in Rust, component specs (`spec!`), and the round trip of every
//! interactive cell.

pub mod dast;
pub mod reference;
pub mod round_trip;
pub mod spec;
pub mod test_utils;

pub use crate::build::coverage::{
    AbstractEdges, GraphAgreement, abstract_edges, template_graph_agreement, uncovered,
};
pub use crate::compile::graph::Gap;

/// `f` of every item, computed on as many threads as the machine has
/// cores, returned in the items' order. A panic stops every thread taking
/// new items and is raised again here, the first by item order.
pub fn par_map<'a, T: Sync, R: Send>(items: &'a [T], f: impl Fn(&'a T) -> R + Sync) -> Vec<R> {
    use std::panic::{AssertUnwindSafe, catch_unwind, resume_unwind};
    use std::sync::atomic::{AtomicBool, AtomicUsize, Ordering};

    let threads = std::thread::available_parallelism()
        .map_or(1, |n| n.get())
        .min(items.len());
    let next = AtomicUsize::new(0);
    let failed = AtomicBool::new(false);
    let mut done: Vec<(usize, std::thread::Result<R>)> = std::thread::scope(|s| {
        let workers: Vec<_> = (0..threads)
            .map(|_| {
                s.spawn(|| {
                    let mut out = Vec::new();
                    while !failed.load(Ordering::Relaxed) {
                        let i = next.fetch_add(1, Ordering::Relaxed);
                        let Some(item) = items.get(i) else { break };
                        let r = catch_unwind(AssertUnwindSafe(|| f(item)));
                        failed.fetch_or(r.is_err(), Ordering::Relaxed);
                        out.push((i, r));
                    }
                    out
                })
            })
            .collect();
        workers
            .into_iter()
            .flat_map(|w| w.join().expect("a worker catches its panics"))
            .collect()
    });
    done.sort_by_key(|&(i, _)| i);
    done.into_iter()
        .map(|(_, r)| r.unwrap_or_else(|panic| resume_unwind(panic)))
        .collect()
}

/// The compile of `dast`, checked as a load checks it.
pub fn compile(
    dast: &crate::dast::Dast,
) -> crate::Result<std::sync::Arc<crate::compile::Compiled>> {
    Ok(crate::compile::compile(dast.clone(), true, true, true, true, true)?.compiled)
}

/// `compile`, with every value slot essential (`LoadOptions::classify`
/// off).
pub fn compile_unclassified(
    dast: &crate::dast::Dast,
) -> crate::Result<std::sync::Arc<crate::compile::Compiled>> {
    Ok(crate::compile::compile(dast.clone(), true, false, true, true, true)?.compiled)
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

/// One unchecked tick requesting `value` for the one-cell prop at `path`.
/// Panics as `prop_value` does.
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
/// without the check that each is an input's. It still writes only
/// essential cells.
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

/// The essential cells saved state cannot name: hidden ports holding no
/// shared state, as `key (hidden slot k)`.
pub fn unsaved_essentials(doc: &crate::Document) -> Vec<String> {
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
                prop
            )
        })
        .collect();
    out.sort();
    out.dedup();
    out
}

/// What a student sees of one input: its interactive props' values as text, the
/// points among them, and the bounds of the graph it is in, as the author set
/// them.
#[derive(Debug, Clone, PartialEq)]
pub struct InputState {
    pub values: Vec<(String, String)>,
    pub points: Vec<(f64, f64)>,
    pub bounds: Option<[f64; 4]>,
}

/// Every input of `doc` by its scope path and stable key, as `compiled`
/// (the document's compile) keys its elements.
pub fn inputs(
    doc: &crate::Document,
    compiled: &crate::Compiled,
) -> std::collections::BTreeMap<String, InputState> {
    use crate::ValueType;
    use crate::components::ComponentType;

    let mut key_of = std::collections::HashMap::new();
    for t in &compiled.plans.templates {
        for (el, sealed) in t.elems.iter().zip(&t.sealed.elems) {
            if el.node != crate::dast::NodeId::NONE {
                key_of.insert(
                    el.node,
                    compiled.plans.keys.key_text(sealed.key).to_string(),
                );
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
                if doc.essentials().contains(&cell) {
                    doc.structure.essential_defaults[cell - doc.n_const]
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
/// document after the same ticks, agree on every prop whose cell is live in
/// `pruned`. Returns the first disagreement, as `type.prop of component`.
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

#[cfg(test)]
mod tests {
    use super::par_map;

    #[test]
    fn par_map_keeps_the_items_order() {
        let items: Vec<u64> = (0..200).collect();
        // Uneven work, so the threads finish out of order.
        let out = par_map(&items, |&i| {
            std::thread::sleep(std::time::Duration::from_micros((200 - i) * 20));
            i * i
        });
        assert_eq!(out, items.iter().map(|i| i * i).collect::<Vec<_>>());
        assert!(par_map(&[] as &[u64], |&i| i).is_empty());
    }

    #[test]
    fn par_map_raises_the_first_panic_by_item_order() {
        let items: Vec<u32> = (0..64).collect();
        let panic = std::panic::catch_unwind(|| {
            par_map(&items, |&i| {
                if i == 10 || i == 40 {
                    panic!("item {i}");
                }
            })
        })
        .unwrap_err();
        assert_eq!(panic.downcast_ref::<String>().unwrap(), "item 10");
    }
}
