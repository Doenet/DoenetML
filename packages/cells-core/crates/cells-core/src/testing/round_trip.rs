//! The round trip of ADR 0024: every interactive number cell of a document
//! is requested at several values, each on a fresh copy, and what the
//! inverse did is classed. An x/y pair of one component (`x` and `y`, `x1`
//! and `y1`, ...) is requested together, as a point group, as a renderer
//! drags a point.
//!
//! A request comes out (`Class`):
//!
//! - **exact**: the cells hold what was asked;
//! - **projected**: they hold something else, and asking again for either
//!   that or the first value changes nothing;
//! - **unchanged**: they hold what they held, and nothing was dropped: the
//!   inverse wrote values that give the same cells back (a projection onto
//!   where they are);
//! - **dropped**: they hold what they held, and the tick reports the
//!   request dropped;
//! - **rebuilt**: the request changed the document's structure;
//! - **unstable**: anything else. Asking again moves the cells.
//!
//! An outcome is *multipath* when the request wrote an essential cell that
//! reaches a requested cell along more than one path through the program.
//!
//! The round trip checks that an inverse lands where it says, not that the
//! value is one the prop may hold: a request outside a prop's domain that
//! is written as asked is exact. Specs check domains.

use std::collections::HashMap;

use crate::{CellIdx, CompIdx, Document, PointRequest, Request, ValueType};

/// Values asked of a single cell.
pub const SCALARS: [f64; 5] = [-3.7, 0.5, 2.0, 7.25, 100.0];
/// Values asked of a point.
pub const POINTS: [[f64; 2]; 4] = [[-3.7, 0.5], [2.0, 7.25], [100.0, -2.0], [0.3, 0.3]];

/// What one request did; see the module documentation.
#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Hash)]
pub enum Class {
    Exact,
    Projected,
    Unchanged,
    Dropped,
    Rebuilt,
    Unstable,
}

impl Class {
    pub const ALL: [Class; 6] = [
        Class::Exact,
        Class::Projected,
        Class::Unchanged,
        Class::Dropped,
        Class::Rebuilt,
        Class::Unstable,
    ];

    pub fn name(self) -> &'static str {
        match self {
            Class::Exact => "exact",
            Class::Projected => "projected",
            Class::Unchanged => "unchanged",
            Class::Dropped => "dropped",
            Class::Rebuilt => "rebuilt",
            Class::Unstable => "unstable",
        }
    }
}

/// One request and what it did.
#[derive(Debug, Clone)]
pub struct Outcome {
    /// The component's type and the prop or pair requested:
    /// `"point (x, y)"`, `"slider value"`.
    pub row: String,
    pub component: CompIdx,
    pub asked: Vec<f64>,
    /// The requested cells after the request (empty when rebuilt).
    pub got: Vec<f64>,
    pub class: Class,
    pub multipath: bool,
}

/// What a sweep requests: each interactive number prop of each component,
/// with its x/y pairs together, in component order.
pub fn targets(doc: &Document) -> Vec<(CompIdx, String, Vec<CellIdx>)> {
    let mut out = Vec::new();
    for c in CompIdx::below(doc.components.len()) {
        let ty = doc.component_type(c);
        let cells = doc.comp_cells(c);
        let names: Vec<String> = (0..cells.len())
            .map(|pi| {
                ty.prop_name(cells.len(), pi)
                    .map(|s| s.to_string())
                    .unwrap_or_default()
            })
            .collect();
        let asked = |pi: usize| {
            doc.is_interactive(cells[pi]) && doc.value_types[cells[pi].index()] == ValueType::Number
        };
        let mut done = vec![false; cells.len()];
        for pi in 0..cells.len() {
            if done[pi] || !asked(pi) {
                continue;
            }
            done[pi] = true;
            // An x prop with an interactive y of the same suffix is a point.
            let pair = names[pi].strip_prefix('x').and_then(|suffix| {
                (0..cells.len()).find(|&pj| asked(pj) && names[pj] == format!("y{suffix}"))
            });
            let (target, label) = match pair {
                Some(pj) => {
                    done[pj] = true;
                    (
                        vec![cells[pi], cells[pj]],
                        format!("({}, {})", names[pi], names[pj]),
                    )
                }
                None => (vec![cells[pi]], names[pi].clone()),
            };
            out.push((c, format!("{} {label}", ty.tag()), target));
        }
    }
    out
}

/// Request every target of `doc` at `SCALARS` or `POINTS`, each on a fresh
/// copy, and class what happened.
pub fn sweep(doc: &Document) -> Vec<Outcome> {
    let mut paths = Paths::default();
    let mut out = Vec::new();
    for (component, row, target) in targets(doc) {
        let wants: Vec<Vec<f64>> = match target.len() {
            2 => POINTS.iter().map(|p| p.to_vec()).collect(),
            _ => SCALARS.iter().map(|&v| vec![v]).collect(),
        };
        for asked in wants {
            let (class, got, multipath) = classify(doc, &target, &asked, &mut paths);
            out.push(Outcome {
                row: row.clone(),
                component,
                asked,
                got,
                class,
                multipath,
            });
        }
    }
    out
}

fn close(a: f64, b: f64) -> bool {
    a == b || (a - b).abs() <= 1e-9 * a.abs().max(b.abs()).max(1.0) || (a.is_nan() && b.is_nan())
}

fn all_close(a: &[f64], b: &[f64]) -> bool {
    a.iter().zip(b).all(|(&x, &y)| close(x, y))
}

/// Request `want` of `cells` (one cell, or an x/y pair as a point group):
/// the cells' values after and whether the tick dropped a request, or None
/// when the tick rebuilt the document.
fn ask(doc: &mut Document, cells: &[CellIdx], want: &[f64]) -> Option<(Vec<f64>, bool)> {
    let tick = match *cells {
        [x, y] => doc.request_points(&[PointRequest {
            cells: [x, y],
            values: [want[0], want[1]],
        }]),
        _ => doc.request(&[Request {
            cell: cells[0],
            value: want[0],
        }]),
    };
    (!tick.rebuilt).then(|| {
        let values = cells.iter().map(|c| doc.cells[c.index()]).collect();
        (values, !tick.dropped.is_empty())
    })
}

/// For each essential cell asked about, how many paths lead from it to
/// every cell through the program, saturating at 2.
#[derive(Default)]
struct Paths(HashMap<usize, Vec<u8>>);

impl Paths {
    fn from(&mut self, doc: &Document, e: usize) -> &[u8] {
        self.0.entry(e).or_insert_with(|| {
            let mut n = vec![0u8; doc.cells.len()];
            n[e] = 1;
            for ins in &doc.program.instrs {
                let k: u32 = ins
                    .op
                    .inputs(&doc.program.operands)
                    .map(|c| n[c.index()] as u32)
                    .sum();
                for o in 0..ins.op.n_out() {
                    let out = &mut n[ins.out.index() + o];
                    *out = (*out).max(k.min(2) as u8);
                }
            }
            n
        })
    }
}

/// The class of one request on a fresh copy of `base`, the requested
/// cells after it, and whether it is multipath.
fn classify(
    base: &Document,
    target: &[CellIdx],
    want: &[f64],
    paths: &mut Paths,
) -> (Class, Vec<f64>, bool) {
    let before: Vec<f64> = target.iter().map(|c| base.cells[c.index()]).collect();
    let mut doc = base.clone();
    let Some((got, dropped)) = ask(&mut doc, target, want) else {
        return (Class::Rebuilt, vec![], false);
    };
    let class = if all_close(&got, want) {
        Class::Exact
    } else if all_close(&got, &before) {
        if dropped {
            Class::Dropped
        } else {
            Class::Unchanged
        }
    } else {
        let lands =
            |again: Option<(Vec<f64>, bool)>| again.is_some_and(|(x, _)| all_close(&x, &got));
        if lands(ask(&mut doc.clone(), target, &got)) && lands(ask(&mut doc.clone(), target, want))
        {
            Class::Projected
        } else {
            Class::Unstable
        }
    };
    let multipath = (0..doc.n_essential).any(|e| {
        doc.cells[e].to_bits() != base.cells[e].to_bits() && {
            let p = paths.from(base, e);
            target.iter().any(|c| p[c.index()] > 1)
        }
    });
    (class, got, multipath)
}
