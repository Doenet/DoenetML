//! `<matrixInput>`: a grid of math inputs the matrix input owns (ADR 0045),
//! sized `numRows` by `numColumns`, its rows a structural sequence of rows
//! and each row one of boxes (ADR 0041, decision 2), and the matrix they
//! make (ADR 0041, decision 8).

use crate::compile::api::*;
use crate::components::define::*;
use crate::components::{AggOp, Aggregate, Collection};
use crate::error::{Error, Result};
use crate::program::{Post, SymKind};

component! {
    /// `<matrixInput>`: a grid of boxes a student types into, `numRows` by
    /// `numColumns`, and `expr`, the matrix they make, whatever their size
    /// (`value` evaluates it). Its size is a structural count (ADR 0041):
    /// a change of either rebuilds the grid, and each box keeps what was
    /// typed into it by its row and column. The size is the student's:
    /// `numRows`, `numColumns` (1 by default, or the prefill's size), or
    /// what a reference names, which a request on it writes; each box
    /// starts as the `prefill`'s entry there, else `defaultEntry` (blank).
    /// With `bindValueTo` it is a bound matrix input ([`bound`]). An
    /// answer's input (its `expr`).
    tags: ["matrixInput"],
    flags: [copyable],
    reads_as: Math,
    structure: Repeat { count: numRows },
    item: MatrixInputRow(row),
    response: Math(expr),
    text: Math(expr, value),
    needs: Label,
    rewrite { bindValueTo: BoundMatrixInput }
    default_prop: value,
    props {
        value: by_planner { expr_of: expr },
        expr: by_planner { rendered, expr_of: expr },
        numRows: by_planner { interactive, rendered },
        numColumns: by_planner { interactive, rendered },
        prefill: by_planner { expr_of: prefill },
        defaultEntry: by_planner { expr_of: defaultEntry },
    }
    combined_props {
        matrixSize: [numRows, numColumns],
    }
    alternate_names {
        immediateValue: value,
    }
    presentation { showSizeControls, minComponentWidth }
    attributes {
        numRows: Scalar,
        numColumns: Scalar,
        prefill: Content,
        defaultEntry: Content,
        format: Text,
    }
    children: None,
    planner: Plan(plan),
}

/// A `<matrixInput bindValueTo>`: its size and every box read from the
/// value it is bound to.
pub(crate) mod bound {
    use super::*;

    component! {
        /// `<matrixInput bindValueTo="$m">`: the value `$m` names, as the
        /// expression it stands for, is `bound`; its size is `bound`'s
        /// read as a matrix (a tuple or vector a column, a transposed one
        /// a row), and each box its entry there. A request on the size
        /// writes `bound` resized, and typing into a box writes `bound`
        /// with that entry replaced. `numRows`, `numColumns`, `prefill`
        /// and `defaultEntry` are read and ignored, as in the current
        /// core.
        tags: ["matrixInput"],
        flags: [copyable, internal],
        reads_as: Math,
        structure: Repeat { count: numRows },
        item: BoundMatrixInputRow(super::bound_row),
        response: Math(expr),
        text: Math(expr, value),
        needs: Label,
        default_prop: value,
        props {
            value: by_planner { expr_of: expr },
            expr: by_planner { rendered, expr_of: expr },
            numRows: by_planner { interactive, rendered },
            numColumns: by_planner { interactive, rendered },
            bound: by_planner { expr_of: bound },
        }
        combined_props {
            matrixSize: [numRows, numColumns],
        }
        alternate_names {
            immediateValue: value,
        }
        presentation { showSizeControls, minComponentWidth }
        attributes {
            bindValueTo: Ref,
            numRows: Written,
            numColumns: Written,
            prefill: Written,
            defaultEntry: Written,
            format: Written,
        }
        children: None,
        planner: Plan(plan),
    }

    /// Its size and its boxes read from the value it is bound to.
    fn plan(ctx: &mut PlanCtx<'_, '_>) -> Result<ElemWiring> {
        let attrs = Attrs::of(ctx.record());
        let p = attrs.bindValueTo.ok_or_else(|| {
            Error::Unsupported("<matrixInput bindValueTo> with no reference".into())
        })?;
        let at = Props::PORTS;
        let id = ctx
            .operand_expr(&Source::reference(p))
            .expect("a reference has an expression");
        let size = |cols| Wire::computed(OpSpec::Sym(SymKind::MatrixSize { cols }), vec![at.bound]);
        let mut wiring = ElemWiring::of(ctx.component_type());
        wiring.set_planned(Planned {
            value: Wire::computed(OpSpec::Sym(SymKind::Evaluate), vec![at.expr]),
            expr: Source::aggregate(super::grid(at.numRows, at.numColumns)).into(),
            numRows: size(false),
            numColumns: size(true),
            bound: Source::Flow(Flow::MathHandle(id, Post::None)).into(),
        });
        Ok(wiring)
    }
}

/// A row of an unbound matrix input's grid: a repeat over its columns,
/// whose item is a box.
pub(crate) mod row {
    use super::*;

    component! {
        /// A row of a `<matrixInput>`'s grid: `numColumns` boxes, made by
        /// the matrix input, and what its boxes start as.
        tags: ["_matrixInputRow"],
        flags: [internal],
        structure: Repeat { count: numColumns },
        item: MatrixInputCell(super::cell),
        props {
            numColumns: by_planner,
            prefill: by_planner { expr_of: prefill },
            defaultEntry: by_planner { expr_of: defaultEntry },
        }
        children: None,
    }
}

/// A row of a bound matrix input's grid.
pub(crate) mod bound_row {
    use super::*;

    component! {
        /// A row of a bound `<matrixInput>`'s grid: `numColumns` boxes,
        /// its position among the rows `rowIndex`, and the bound value.
        tags: ["_matrixInputRow"],
        flags: [internal],
        structure: Repeat { count: numColumns },
        item: MatrixInputCell(super::bound_cell),
        props {
            numColumns: by_planner,
            rowIndex: by_planner,
            bound: by_planner { expr_of: bound },
        }
        children: None,
    }
}

/// A box of a matrix input's grid: a math input its matrix input plans.
pub(crate) mod cell {
    use crate::components::define::*;

    component! {
        /// A box of a `<matrixInput>`'s grid, the current core's
        /// `_matrixComponentInput`: a math input whose `expr` a student
        /// types into, `value` evaluating it.
        tags: ["_matrixComponentInput"],
        flags: [internal],
        default_prop: value,
        props {
            value: by_planner { interactive, rendered, expr_of: expr },
            expr: by_planner { interactive, rendered, expr_of: expr },
        }
        children: None,
    }
}

/// The grid of the boxes' expressions, `rows` by `cols` (ADR 0045).
fn grid(rows: Port, cols: Port) -> Aggregate {
    Aggregate {
        op: AggOp::Grid {
            rows: rows.index() as u8,
            cols: cols.index() as u8,
        },
        over: Collection::Boxes,
    }
}

/// Its size, what its boxes start as, and its matrix, the grid of the
/// boxes' expressions.
pub(crate) fn plan(ctx: &mut PlanCtx<'_, '_>) -> Result<ElemWiring> {
    let attrs = Attrs::of(ctx.record());
    let latex = attrs
        .format
        .as_deref()
        .is_some_and(|f| f.trim().eq_ignore_ascii_case("latex"));
    let at = Props::PORTS;
    let mut wiring = ElemWiring::of(ctx.component_type());
    let prefill = given_math(attrs.prefill.as_ref(), latex, "prefill")?;
    let default_entry = given_math(attrs.defaultEntry.as_ref(), latex, "defaultEntry")?;
    // The size the author gave, else the prefill's, the student's to
    // change; one that is no whole number counts none.
    let prefill_size = prefill.as_ref().map_or((1, 1), |tree| {
        let mut engine = crate::sym::Engine::new();
        let h = engine.import(tree);
        engine.matrix_size(h)
    });
    let mut size = |source: Option<Source>, a: Attr, v: u32| {
        let raw = Wire::attr(a, source).unwrap_or_else(|| Wire::given_by(a, f64::from(v)));
        let raw = wiring.hidden_wire(raw);
        let rounded = wiring.hidden(Source::computed(OpSpec::Round, vec![raw]));
        let zero = wiring.hidden(Source::constant(0.0));
        Wire::computed(OpSpec::NanTo, vec![rounded, zero])
    };
    let num_rows = size(attrs.numRows, attr::numRows, prefill_size.0);
    let num_columns = size(attrs.numColumns, attr::numColumns, prefill_size.1);
    wiring.set_planned(Planned {
        value: Wire::computed(OpSpec::Sym(SymKind::Evaluate), vec![at.expr]),
        expr: Source::aggregate(grid(at.numRows, at.numColumns)).into(),
        numRows: num_rows,
        numColumns: num_columns,
        prefill: Source::Leaf(Leaf::GivenMath(prefill)).into(),
        defaultEntry: Source::Leaf(Leaf::GivenMath(default_entry)).into(),
    });
    Ok(wiring)
}

/// A prefill or default entry: literal math text, or LaTeX with
/// `format="latex"`, as a constant expression; none when not given.
fn given_math(
    v: Option<&ValueChildren>,
    latex: bool,
    name: &str,
) -> Result<Option<crate::sym::Tree<RefId>>> {
    let text = match v.map(|v| &v.value) {
        None | Some(ChildValue::Blank) => return Ok(None),
        Some(ChildValue::Text { text, .. }) => text.trim().to_string(),
        Some(_) => {
            return Err(Error::Unsupported(format!(
                "a <matrixInput> {name} other than literal math"
            )));
        }
    };
    // Build-time only, so a throwaway engine parses it.
    let mut engine = crate::sym::Engine::new();
    let bad = |reason| Error::BadMath {
        text: text.clone(),
        reason,
    };
    if text.is_empty() {
        return Ok(None);
    }
    if latex {
        return engine.parse_latex_tree(&text).map(Some).map_err(bad);
    }
    engine.parse_given(&text).map(Some).map_err(bad)
}

/// A row of an unbound grid: its count of columns, and what its boxes
/// start as.
fn row(ctx: &mut ItemCtx<'_>) -> row::Planned {
    let at = Props::PORTS;
    row::Planned {
        numColumns: Wire::own(ctx.owner(at.numColumns)),
        prefill: Wire::own(ctx.owner(at.prefill)),
        defaultEntry: Wire::own(ctx.owner(at.defaultEntry)),
    }
}

/// A box of an unbound grid: an essential expression that starts as the
/// prefill's entry at its row and column, else the default entry.
fn cell(ctx: &mut ItemCtx<'_>) -> cell::Planned {
    let at = row::Props::PORTS;
    let own = cell::Props::PORTS;
    cell::Planned {
        value: Wire::computed(OpSpec::Sym(SymKind::Evaluate), vec![own.expr]),
        expr: ctx.seed_entry(at.prefill, at.defaultEntry).into(),
    }
}

/// A row of a bound grid: its count of columns, its position, and the
/// bound value.
fn bound_row(ctx: &mut ItemCtx<'_>) -> bound_row::Planned {
    let at = bound::Props::PORTS;
    bound_row::Planned {
        numColumns: Wire::own(ctx.owner(at.numColumns)),
        rowIndex: Wire::own(ctx.index()),
        bound: Wire::own(ctx.owner(at.bound)),
    }
}

/// A box of a bound grid: its entry of the bound value, which typing
/// writes back ([`SymKind::MatrixEntry`]).
fn bound_cell(ctx: &mut ItemCtx<'_>) -> cell::Planned {
    let at = bound_row::Props::PORTS;
    let own = cell::Props::PORTS;
    let bound = ctx.owner(at.bound);
    let row = ctx.owner(at.rowIndex);
    let col = ctx.index();
    cell::Planned {
        value: Wire::computed(OpSpec::Sym(SymKind::Evaluate), vec![own.expr]),
        expr: Wire::computed(OpSpec::Sym(SymKind::MatrixEntry), vec![bound, row, col]),
    }
}

#[cfg(all(test, feature = "testing"))]
#[path = "matrix_input.spec.rs"]
mod spec;
