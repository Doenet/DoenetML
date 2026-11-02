//! Parsing (ADR 0029): every `<math>`'s text, tokenized when outlining,
//! parsed once as the type outlining settled. Its result, `Parsed`, is
//! read and never changed by planning.

use crate::compile::*;

/// What parsing makes (ADR 0029, ADR 0030): each `<math>`'s text parsed
/// once, as the type outlining settled, or the error parsing it met. Read,
/// never changed, by the stages after it.
#[derive(Default)]
pub(in crate::compile) struct Parsed {
    /// By (template, element).
    maths: HashMap<(u32, u32), Result<ParsedMath>>,
}

impl Parsed {
    /// `<math>` `e`'s parse, or the error parsing it met; `None` for an
    /// element that is no math, or one boxed before it was parsed.
    pub(in crate::compile) fn math(&self, t: TemplateId, e: ElemId) -> Option<&Result<ParsedMath>> {
        self.maths.get(&(t.get(), e.get()))
    }
}

impl Compiler<'_> {
    /// Parsing (ADR 0029): every `<math>`'s text, tokenized when outlining,
    /// parsed once as the type outlining settled, its `$ref`s planned where
    /// the math sits; what its planner plans from, and what a line's
    /// equation inlines.
    pub(in crate::compile) fn parse_maths(
        &mut self,
        math_texts: Vec<((TemplateId, ElemId), Result<MathText>)>,
    ) -> Parsed {
        let mut parsed = Parsed::default();
        for ((t, e), mt) in math_texts {
            if self.is_box(t, e) {
                continue;
            }
            let Elem {
                name_scope,
                component_type,
                ..
            } = self.compiled.templates[t.index()].elems[e.index()];
            let math = mt.and_then(|mt| self.parse_math(t, name_scope, component_type, &mt));
            parsed.maths.insert((t.get(), e.get()), math);
        }
        parsed
    }
}
