//! Parsing: every `<math>`'s text, parsed once as the type outlining
//! settled, and every element's record.

use crate::compile::*;

/// What parsing makes: each `<math>`'s text parsed once, as the type
/// outlining settled, or the error parsing it met.
#[derive(Default)]
pub(in crate::compile) struct Parsed {
    /// By (template, element).
    maths: HashMap<(u32, u32), Result<ParsedMath>>,
    /// Every element's attribute record, by (template, element), or the
    /// error parsing it met.
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
    /// Parse every `<math>`'s text once as the type outlining settled, its
    /// `$ref`s planned where the math sits.
    pub(in crate::compile) fn parse_maths(
        &mut self,
        rf: &mut Refs,
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
            let math = mt.and_then(|mt| self.parse_math(rf, t, name_scope, component_type, &mt));
            parsed.maths.insert((t.get(), e.get()), math);
        }
        parsed
    }

    /// Parse every element's record: each attribute its type declares and
    /// its children as the type reads them, parsed where the element sits.
    pub(in crate::compile) fn parse_records(
        &mut self,
        rf: &mut Refs,
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
            let record = self.parse_record(rf, t, e);
            parsed.records.insert((t.get(), e.get()), record);
        }
    }
}
