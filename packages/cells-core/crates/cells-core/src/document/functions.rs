//! A function of one variable read at any `x` (ADR 0049): what a reader
//! that plots or samples a function itself asks, through the core's own
//! engine and the function's cells.

use crate::components::{ConstrainTarget, FUNCTION_PROPS, Role};
use crate::document::{CellIdx, Child, CompIdx, Document};
use crate::program::{DOMAIN_CELLS, PIECE_CELLS, eval_function};

impl Document {
    /// The cells of the function `c` is, as
    /// [`SymKind::EvalFunction`](crate::program::SymKind::EvalFunction)
    /// reads one after its input: its domain, then each piece's expression,
    /// variable and domain, `None` standing for a piece's domain on the
    /// whole line. `None` when `c` is no function of one variable.
    fn function_cells(&self, c: CompIdx) -> Option<Vec<Option<CellIdx>>> {
        let ty = self.component_type(c);
        let cell =
            |c: CompIdx, prop: &str| self.prop_cells(c, prop).and_then(|v| v.first().copied());
        let domain = |c: CompIdx| -> Option<Vec<Option<CellIdx>>> {
            FUNCTION_PROPS[1..]
                .iter()
                .map(|p| cell(c, p).map(Some))
                .collect()
        };
        let mut f = domain(c)?;
        if ty.plays(Role::PiecewiseFunction) {
            let pieces: Vec<CompIdx> = self
                .children(c)
                .filter_map(|k| match k {
                    Child::Component(k) => Some(k),
                    Child::Text(_) => None,
                })
                .filter(|&k| self.component_type(k).plays(Role::Function))
                .collect();
            for k in pieces {
                f.push(Some(cell(k, "expr")?));
                f.push(Some(cell(k, FUNCTION_PROPS[0])?));
                f.extend(domain(k)?);
            }
            return Some(f);
        }
        let Some(ConstrainTarget::Graph {
            expr,
            function: true,
        }) = ty.def().constrain_target
        else {
            return None;
        };
        let (expr, var) = (cell(c, expr)?, cell(c, FUNCTION_PROPS[0])?);
        if self.cells[var.index()].is_nan() {
            return None;
        }
        f.extend([Some(expr), Some(var), None, None, None, None]);
        Some(f)
    }

    /// The function `c` is, at `x` (ADR 0049), as an `<evaluate>` of it
    /// computes it: missing outside its domain, a piecewise function's
    /// first piece whose domain holds `x` there. `None` when `c` is no
    /// function of one variable (one of several, or no function).
    pub fn function_value(&mut self, c: CompIdx, x: f64) -> Option<f64> {
        let cells = self.function_cells(c)?;
        let whole = [f64::NEG_INFINITY, f64::INFINITY, 0.0, 0.0];
        let f: Vec<f64> = cells
            .iter()
            .enumerate()
            .map(|(k, cell)| match cell {
                Some(cell) => self.cells[cell.index()],
                None => whole[(k - DOMAIN_CELLS) % PIECE_CELLS - 2],
            })
            .collect();
        let mut out = [f64::NAN];
        eval_function(&mut self.math.engine, &f, &[x], &mut out);
        Some(out[0])
    }
}
