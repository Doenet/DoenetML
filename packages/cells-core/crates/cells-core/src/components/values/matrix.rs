//! `<matrix>`: a math whose value is a matrix (ADR 0041, decision 8), of
//! its rows or its columns, and those rows and columns (`<row>` and
//! `<column>` under a matrix, ADR 0055).

use crate::compile::api::*;
use crate::components::define::*;
use crate::error::{Error, Result};
use crate::program::{Post, SymKind};

component! {
    /// `<matrix>`: a math cell holding a matrix, of its `<row>`s (each a
    /// list of entries, as a `<mathList>`'s), else of its `<column>`s,
    /// rows and columns shorter than the longest filled with
    /// `defaultEntry` (0); `numRows` and `numColumns`, literal numbers,
    /// fill or cut it to that size. With no row or column its children
    /// are one entry (a 1 by 1 matrix), or, one reference alone, the
    /// expression it names. `numRows`, `numColumns` and `matrixSize` are
    /// its size.
    tags: ["matrix"],
    flags: [copyable],
    text: Math(expr, value),
    child_types { row: MatrixRow, column: MatrixColumn }
    extend_value: Expr(extended),
    default_prop: value,
    props {
        expr: by_planner { rendered, expr_of: expr },
        value: by_planner { rendered, expr_of: expr },
        numRows: by_planner { rendered },
        numColumns: by_planner { rendered },
        anchorX: anchor(0),
        anchorY: anchor(1),
    }
    combined_props {
        matrixSize: [numRows, numColumns],
    }
    attributes {
        numRows: Value,
        numColumns: Value,
        defaultEntry: Text,
        simplify: On,
    }
    children: List,
    planner: Plan(plan),
}

/// One row of a matrix (`<row>` under a `<matrix>`): its entries, as a
/// `<mathList>`'s.
pub(crate) mod row {
    use super::*;

    component! {
        /// `<row>` under a `<matrix>`: a list of entries, one per piece
        /// of its text and per reference, as a `<mathList>`'s.
        tags: ["matrixRow"],
        flags: [copyable, internal],
        default_prop: maths,
        props {
            numComponents: by_planner,
            text: by_planner { text },
        }
        list {
            names: [maths, values],
            item: math,
            values: math of Math, entries: children,
        }
        children: List,
        planner: Plan(plan),
    }

    fn plan(ctx: &mut PlanCtx<'_, '_>) -> Result<ElemWiring> {
        let attrs = Attrs::of(ctx.record());
        let (mut wiring, n) = super::super::plan_list(ctx, attrs.children, f64::INFINITY)?;
        wiring.set_planned(Planned {
            numComponents: Wire::constant(n as f64),
            text: super::super::joined_entries(&wiring, n, false).into(),
        });
        Ok(wiring)
    }
}

/// One column of a matrix (`<column>` under a `<matrix>`): its entries,
/// as a `<mathList>`'s.
pub(crate) mod column {
    use super::*;

    component! {
        /// `<column>` under a `<matrix>`: a list of entries, as a row's.
        tags: ["matrixColumn"],
        flags: [copyable, internal],
        default_prop: maths,
        props {
            numComponents: by_planner,
            text: by_planner { text },
        }
        list {
            names: [maths, values],
            item: math,
            values: math of Math, entries: children,
        }
        children: List,
        planner: Plan(plan),
    }

    fn plan(ctx: &mut PlanCtx<'_, '_>) -> Result<ElemWiring> {
        let attrs = Attrs::of(ctx.record());
        let (mut wiring, n) = super::super::plan_list(ctx, attrs.children, f64::INFINITY)?;
        wiring.set_planned(Planned {
            numComponents: Wire::constant(n as f64),
            text: super::super::joined_entries(&wiring, n, false).into(),
        });
        Ok(wiring)
    }
}

/// A size attribute: a whole literal number, None when absent; a size
/// that follows a value would make the matrix's shape structural (ADR
/// 0041, decision 2), which is not done.
fn size(name: &str, source: Option<Source>) -> Result<Option<usize>> {
    match source {
        None => Ok(None),
        Some(Source::Leaf(Leaf::Given(v) | Leaf::Const(v))) if v >= 0.0 && v.fract() == 0.0 => {
            Ok(Some(v as usize))
        }
        Some(Source::Leaf(Leaf::Given(_) | Leaf::Const(_))) => Err(Error::BadValue {
            attr: name.into(),
            text: "a size is a whole number".into(),
        }),
        Some(_) => Err(Error::Unsupported(format!(
            "<matrix {name}> that follows a value: a structural matrix"
        ))),
    }
}

/// Its expression: its rows' (or columns') entries by row, made a matrix
/// in the engine (`Post::Matrix`), filled and cut to its size.
fn plan(ctx: &mut PlanCtx<'_, '_>) -> Result<ElemWiring> {
    let attrs = Attrs::of(ctx.record());
    let num_rows = size("numRows", attrs.numRows)?;
    let num_columns = size("numColumns", attrs.numColumns)?;
    let default = attrs.defaultEntry.unwrap_or_else(|| "0".into());
    let mut rows: Vec<Vec<ExprId>> = Vec::new();
    let mut columns: Vec<Vec<ExprId>> = Vec::new();
    let mut others = Vec::new();
    for piece in attrs.children {
        let kind = match &piece {
            ListPiece::Element(p) => ctx.reference_type(*p)?,
            _ => None,
        };
        let lines = match kind {
            Some(crate::components::ComponentType::MatrixRow) => &mut rows,
            Some(crate::components::ComponentType::MatrixColumn) => &mut columns,
            _ => {
                others.push(piece);
                continue;
            }
        };
        let mut line = Vec::new();
        for entry in ctx.list_entries(vec![piece], f64::INFINITY)? {
            line.push(entry_expr(ctx, &entry)?);
        }
        lines.push(line);
    }
    let post = |rows: u32, cols: u32| Post::Matrix {
        rows,
        cols,
        simplify: attrs.simplify,
    };
    let mut wiring = ElemWiring::of(ctx.component_type());
    // One reference alone, with no row or column: the expression it
    // names (a matrix's copy), its size unknown here.
    if rows.is_empty()
        && columns.is_empty()
        && num_rows.is_none()
        && num_columns.is_none()
        && let [ListPiece::Reference(p) | ListPiece::Element(p)] = others[..]
    {
        let id = entry_expr(ctx, &ListEntry::Ref(p))?;
        return Ok(wiring_of(id, post_of(attrs.simplify)));
    }
    // Its rows, by row: of its rows, its columns turned, or its children
    // as one entry.
    let mut grid: Vec<Vec<ExprId>> = if !rows.is_empty() {
        rows
    } else if !columns.is_empty() {
        let n = columns.iter().map(Vec::len).max().unwrap_or(0);
        (0..n)
            .map(|i| columns.iter().filter_map(|c| c.get(i).copied()).collect())
            .collect()
    } else if others.is_empty() {
        Vec::new()
    } else {
        let mut ids = Vec::new();
        for piece in others {
            for entry in ctx.list_entries(vec![piece], f64::INFINITY)? {
                ids.push(entry_expr(ctx, &entry)?);
            }
        }
        // Written one after another, they multiply (`2<math>x</math>`).
        vec![vec![ctx.operator_expr(&ids, |texts| texts.join(" "))]]
    };
    let width = grid.iter().map(Vec::len).max().unwrap_or(0);
    let n_rows = num_rows.unwrap_or(if grid.is_empty() && num_columns.is_some() {
        1
    } else {
        grid.len()
    });
    let n_cols = num_columns.unwrap_or(if width == 0 && num_rows.is_some() {
        1
    } else {
        width
    });
    let fill = ctx
        .entry_math(&ListEntry::Text(0, default.clone()))
        .ok_or_else(|| Error::BadValue {
            attr: "defaultEntry".into(),
            text: default,
        })?;
    grid.resize(n_rows, Vec::new());
    let mut entries = Vec::with_capacity(n_rows * n_cols);
    for mut row in grid {
        row.resize(n_cols, fill);
        entries.extend(row);
    }
    if entries.is_empty() {
        entries.push(fill);
    }
    let id = ctx.operator_expr(&entries, |texts| texts.join(", "));
    wiring.set_planned(Planned {
        // A matrix cell whatever its entries: of numbers too (`[[0], [0]]`).
        expr: Source::sym_expr(id, post(n_rows as u32, n_cols as u32)).into(),
        value: Source::value_of(Props::PORTS.expr, Props::PORTS.expr).into(),
        numRows: Wire::constant(n_rows as f64),
        numColumns: Wire::constant(n_cols as f64),
    });
    Ok(wiring)
}

/// A matrix holding the expression `id` as it is, `post` applied: its
/// size read from the value (`SymKind::MatrixSize`), as a matrix input
/// reads one.
fn wiring_of(id: ExprId, post: Post) -> ElemWiring {
    let at = Props::PORTS;
    let size = |cols| Wire::computed(OpSpec::Sym(SymKind::MatrixSize { cols }), vec![at.expr]);
    let mut wiring = ElemWiring::of(crate::components::ComponentType::Matrix);
    wiring.set_planned(Planned {
        expr: Source::Flow(Flow::MathHandle(id, post)).into(),
        value: Source::value_of(at.expr, at.expr).into(),
        numRows: size(false),
        numColumns: size(true),
    });
    wiring
}

/// A matrix that `extend="$x.prop"` makes of the value: the expression it
/// names, a leaf of it, unsimplified.
fn extended(id: ExprId) -> Vec<Source> {
    wiring_of(id, Post::None).finish().0
}

/// A matrix's post for an expression it holds as it is.
fn post_of(simplify: bool) -> Post {
    if simplify { Post::Simplify } else { Post::None }
}

/// An entry as the engine reads it: a piece of text as written, math text,
/// or a reference's leaf.
fn entry_expr(ctx: &mut PlanCtx<'_, '_>, entry: &ListEntry) -> Result<ExprId> {
    ctx.entry_math(entry).ok_or_else(|| {
        Error::Unsupported(match entry {
            ListEntry::Text(_, text) => format!("a matrix entry that is no math: {text}"),
            _ => "a matrix entry that is no math".into(),
        })
    })
}

#[cfg(test)]
#[path = "matrix.spec.rs"]
mod spec;
