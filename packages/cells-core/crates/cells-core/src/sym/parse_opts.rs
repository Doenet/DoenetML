//! How a `<math>` asks its text to be read (ADR 0083): as LaTeX
//! (`format="latex"`), without splitting multi-letter symbols
//! (`splitSymbols="false"`), with other function symbols
//! (`functionSymbols`). Each is a literal attribute; the engine parses the
//! math's text with them wherever it parses that text.

use math_expressions as me;
use me::Expr;

use super::engine::Engine;
use super::{Handle, Leaf, Tree};

/// How math text is parsed, where it is not as the engine parses text by
/// default.
#[derive(Debug, Clone, PartialEq, Eq, Hash, Default)]
pub struct ParseOpts {
    /// LaTeX, not text.
    pub latex: bool,
    /// Multi-letter symbols kept whole (`xyz` one symbol), where text
    /// splits them by default (`x y z`).
    pub no_split: bool,
    /// The symbols read as functions when applied (`f(x)`), in place of
    /// the default `f` and `g`.
    pub function_symbols: Option<Vec<String>>,
}

impl ParseOpts {
    /// Whether these are the default: no options at all.
    pub fn is_default(&self) -> bool {
        *self == ParseOpts::default()
    }

    /// `text` parsed with these options.
    pub(crate) fn convert(&self, text: &str) -> Result<Expr, String> {
        if self.latex {
            let mut opts = me::LatexToAstOptions::default();
            if let Some(f) = &self.function_symbols {
                opts.function_symbols = f.clone();
            }
            return me::LatexToAst::new(opts)
                .convert(text)
                .map_err(|e| e.to_string());
        }
        let mut opts = super::engine::text_options();
        if self.no_split {
            opts.split_symbols = false;
        }
        if let Some(f) = &self.function_symbols {
            opts.function_symbols = f.clone();
        }
        me::TextToAst::new(opts)
            .convert(text)
            .map_err(|e| e.to_string())
    }
}

/// Parsing with options: as [`Engine::parse_tree`], [`Engine::parse_constant`]
/// and [`Engine::is_written`] parse text, with `opts` when given.
impl Engine {
    /// [`Engine::parse_tree`], the text read with `opts`.
    pub fn parse_tree_as<L: Leaf>(
        &mut self,
        text: &str,
        opts: Option<&ParseOpts>,
    ) -> Result<Tree<L>, String> {
        match opts {
            None => self.parse_tree(text),
            Some(o) => self.tree_of(o.convert_blank(text)?, text),
        }
    }

    /// [`Engine::parse_constant`], the text read with `opts`.
    pub fn parse_constant_as(
        &mut self,
        text: &str,
        opts: Option<&ParseOpts>,
    ) -> Result<Handle, String> {
        match opts {
            None => self.parse_constant(text),
            Some(o) => {
                let e = o.convert_blank(text)?;
                self.constant_of(e, text)
            }
        }
    }

    /// Whether the engine reads `text` (with `opts`) whole as a math
    /// cell's expression: as a tree, or as constant text a tree cannot say
    /// (a relation) when `constant`. What the compile's own parser does
    /// not read (`\frac{x}{z}`, `x^()`) the engine may (ADR 0083); a
    /// missing operand reads as the blank, as the current core shows it.
    pub fn reads(&mut self, text: &str, opts: Option<&ParseOpts>, constant: bool) -> bool {
        if self.parse_tree_as::<u32>(text, opts).is_ok() {
            return true;
        }
        constant && self.parse_constant_as(text, opts).is_ok()
    }
}

impl ParseOpts {
    /// [`ParseOpts::convert`], empty text the blank expression.
    fn convert_blank(&self, text: &str) -> Result<Expr, String> {
        if text.trim().is_empty() {
            return Ok(Expr::Blank);
        }
        self.convert(text)
    }
}
