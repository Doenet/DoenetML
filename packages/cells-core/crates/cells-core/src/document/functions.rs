//! A function of one variable read at any `x` (ADR 0049): what a reader
//! that plots or samples a function itself asks, through the core's own
//! engine and the function's cells.

use crate::components::{ConstrainTarget, FUNCTION_PROPS, Role};
use crate::document::{CellIdx, Child, CompIdx, Document};
use crate::program::{
    DOMAIN_CELLS, PIECE_CELLS, eval_function, eval_function_at, spline_pieces, substitute_post,
};
use crate::sym::Handle;

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

    /// An interpolated function's domain and pieces (ADR 0061), as
    /// [`SymKind::EvalFunction`](crate::program::SymKind::EvalFunction)
    /// reads them, from its `pieces`, the list of each piece's expression
    /// and domain; `None` for a function that is none.
    fn interpolated(&mut self, c: CompIdx) -> Option<Vec<f64>> {
        let cell =
            |c: CompIdx, prop: &str| self.prop_cells(c, prop).and_then(|v| v.first().copied());
        let pieces = self.cells[cell(c, "pieces")?.index()];
        if pieces.is_nan() {
            return None;
        }
        let var = self.cells[cell(c, FUNCTION_PROPS[0])?.index()];
        let mut f: Vec<f64> = FUNCTION_PROPS[1..]
            .iter()
            .map(|p| cell(c, p).map(|k| self.cells[k.index()]))
            .collect::<Option<_>>()?;
        f.extend(spline_pieces(
            &mut self.math.engine,
            Handle::from_value(pieces),
            var,
        )?);
        Some(f)
    }

    /// The cells of the function `c` is, as [`eval_function`] reads
    /// them, with a piece's domain on the whole line where it has none.
    fn function_values(&self, c: CompIdx) -> Option<Vec<f64>> {
        let cells = self.function_cells(c)?;
        let whole = [f64::NEG_INFINITY, f64::INFINITY, 0.0, 0.0];
        Some(
            cells
                .iter()
                .enumerate()
                .map(|(k, cell)| match cell {
                    Some(cell) => self.cells[cell.index()],
                    None => whole[(k - DOMAIN_CELLS) % PIECE_CELLS - 2],
                })
                .collect(),
        )
    }

    /// The function `c` is at the expressions the math texts `xs` write,
    /// symbolically, as an `<evaluate>` of it computes it when symbolic
    /// (ADR 0081): its expression with its variables replaced by them, as
    /// its `simplify` and `expand` say, the blank where one input is a
    /// number outside its domain; as the JavaScript math tree, in JSON.
    /// `None` when `c` is no function with a formula, or an input no math.
    pub fn function_symbolic(&mut self, c: CompIdx, xs: &[&str]) -> Option<String> {
        let cell = |prop: &str| {
            self.prop_cells(c, prop)
                .and_then(|v| v.first().copied())
                .map(|k| self.cells[k.index()])
        };
        let expr = cell("expr")?;
        let vars = cell("variablesExpr")?;
        let domains = cell("domainsExpr")?;
        let domain: Vec<f64> = FUNCTION_PROPS[1..]
            .iter()
            .map(|p| cell(p))
            .collect::<Option<_>>()?;
        let post = cell("substitutePost").unwrap_or(1.0);
        let engine = &mut self.math.engine;
        let inputs: Vec<f64> = xs
            .iter()
            .map(|x| engine.parse(x).ok().map(|h| h.to_value()))
            .collect::<Option<_>>()?;
        let h = eval_function_at(
            engine,
            true,
            substitute_post(post),
            &domain,
            [domains, expr, vars],
            &inputs,
        );
        Some(engine.ast_json(h))
    }

    /// The function `c` is at the numbers `xs`, numerically, as an
    /// `<evaluate>` of it computes it when numeric (ADR 0081): a number,
    /// or a vector of numbers for one of several outputs, as the
    /// JavaScript math tree in JSON. `None` when `c` is no function with a
    /// formula.
    pub fn function_numeric(&mut self, c: CompIdx, xs: &[f64]) -> Option<String> {
        let cell = |prop: &str| {
            self.prop_cells(c, prop)
                .and_then(|v| v.first().copied())
                .map(|k| self.cells[k.index()])
        };
        let expr = cell("expr")?;
        let vars = cell("variablesExpr")?;
        let domains = cell("domainsExpr")?;
        let domain: Vec<f64> = FUNCTION_PROPS[1..]
            .iter()
            .map(|p| cell(p))
            .collect::<Option<_>>()?;
        let engine = &mut self.math.engine;
        let inputs: Vec<f64> = xs.iter().map(|&x| engine.num(x).to_value()).collect();
        let h = eval_function_at(
            engine,
            false,
            crate::program::Post::None,
            &domain,
            [domains, expr, vars],
            &inputs,
        );
        Some(engine.ast_json(h))
    }

    /// The function `c` is, at `x` (ADR 0049), as an `<evaluate>` of it
    /// computes it: missing outside its domain, a piecewise function's
    /// first piece whose domain holds `x` there. `None` when `c` is no
    /// function of one variable (one of several, or no function).
    pub fn function_value(&mut self, c: CompIdx, x: f64) -> Option<f64> {
        if let Some(f) = self.interpolated(c) {
            let mut out = [f64::NAN];
            eval_function(&mut self.math.engine, &f, &[x], &mut out);
            return Some(out[0]);
        }
        let f = self.function_values(c)?;
        let mut out = [f64::NAN];
        eval_function(&mut self.math.engine, &f, &[x], &mut out);
        Some(out[0])
    }
}
