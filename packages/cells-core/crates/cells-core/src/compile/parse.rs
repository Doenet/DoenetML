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
    /// Every element's attribute record (ADR 0032, `record.rs`), by
    /// (template, element), or the error parsing it met.
    records: HashMap<(u32, u32), Result<record::Record>>,
}

impl Parsed {
    /// `<math>` `e`'s parse, or the error parsing it met; `None` for an
    /// element that is no math, or one boxed before it was parsed.
    pub(in crate::compile) fn math(&self, t: TemplateId, e: ElemId) -> Option<&Result<ParsedMath>> {
        self.maths.get(&(t.get(), e.get()))
    }

    /// Element `e`'s record, or the error parsing it met; an empty record
    /// for an element not parsed (a box, a clone).
    pub(in crate::compile) fn record(&self, t: TemplateId, e: ElemId) -> Result<record::Record> {
        match self.records.get(&(t.get(), e.get())) {
            Some(Ok(r)) => Ok(r.clone()),
            Some(Err(e)) => Err(e.clone()),
            None => Ok(record::Record::default()),
        }
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
            } = self.outlined(t).elems[e.index()];
            let math = mt.and_then(|mt| self.parse_math(t, name_scope, component_type, &mt));
            parsed.maths.insert((t.get(), e.get()), math);
        }
        parsed
    }

    /// Parsing (ADR 0032, ADR 0034): every element's record, each
    /// attribute its type declares and its children as the type reads
    /// them parsed where the element sits; what its planner reads, and
    /// what a copy of it merges its own under.
    pub(in crate::compile) fn parse_records(
        &mut self,
        to_plan: &[(TemplateId, ElemId)],
        parsed: &mut Parsed,
    ) {
        for &(t, e) in to_plan {
            if self.is_box(t, e) || self.outlined(t).elems[e.index()].cloned {
                continue;
            }
            let def = self.outlined(t).elems[e.index()].planned_as.def();
            if def.attributes.is_empty() && def.children.built() {
                continue;
            }
            let record = self.parse_record(t, e);
            parsed.records.insert((t.get(), e.get()), record);
        }
    }
}
