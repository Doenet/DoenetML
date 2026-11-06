//! Parsing: every `<math>`'s text, parsed once as the type outlining
//! settled, and every element's record.

use crate::compile::*;

/// What parsing makes: each `<math>`'s text parsed once, as the type
/// outlining settled, or the error parsing it met.
#[derive(Default)]
pub(in crate::compile) struct Parsed {
    /// By (template, element).
    maths: HashMap<(TemplateId, ElemId), Result<ParsedMath>>,
    /// Every element's attribute record, by (template, element), or the
    /// error parsing it met.
    records: HashMap<(TemplateId, ElemId), Result<record::Record>>,
}

impl Parsed {
    /// `<math>` `e`'s parse, or the error parsing it met; `None` for an
    /// element that is no math, or one boxed before it was parsed.
    pub(in crate::compile) fn math(&self, t: TemplateId, e: ElemId) -> Option<&Result<ParsedMath>> {
        self.maths.get(&(t, e))
    }

    /// Element `e`'s record, or the error parsing it met; an empty record
    /// for an element not parsed (a box, a clone).
    pub(in crate::compile) fn record(&self, t: TemplateId, e: ElemId) -> Result<record::Record> {
        match self.records.get(&(t, e)) {
            Some(Ok(r)) => Ok(r.clone()),
            Some(Err(e)) => Err(e.clone()),
            None => Ok(record::Record::default()),
        }
    }
}

/// Parse every `<math>`'s text once, as outlining settled its type, and
/// the record of every element in `to_plan`, each where it sits, appending
/// their references to `ar`.
pub(in crate::compile) fn parse<'p>(
    rd: Reader<'p>,
    tables: &'p [Tables],
    ar: &'p mut Arenas,
    math_texts: Vec<((TemplateId, ElemId), Result<MathText>)>,
    to_plan: &[(TemplateId, ElemId)],
) -> Parsed {
    let mut parsing = Parsing { rd, tables, ar };
    let mut parsed = crate::trace::span("parse maths").run(|| parsing.parse_maths(math_texts));
    crate::trace::span("parse records").run(|| parsing.parse_records(to_plan, &mut parsed));
    parsed
}

/// Parsing's view: what outlining settled and the box table, read-only, and
/// the arenas the math's and records' references are planned into.
struct Parsing<'p> {
    /// The source and what outlining settled.
    rd: Reader<'p>,
    /// Boxing's and planning's tables, read for the boxes outlining made.
    tables: &'p [Tables],
    /// What parsing appends to.
    ar: &'p mut Arenas,
}

/// Parsing: every `<math>`'s text, once, as outlining settled its type, and
/// every element's record. Reads outlining's rows; writes [`Parsed`].
impl Parsing<'_> {
    /// Parse every `<math>`'s text once as the type outlining settled, its
    /// `$ref`s planned where the math sits.
    fn parse_maths(&mut self, math_texts: Vec<((TemplateId, ElemId), Result<MathText>)>) -> Parsed {
        let mut parsed = Parsed::default();
        for ((t, e), mt) in math_texts {
            if self.tables[t.index()].is_box(e) {
                continue;
            }
            let Elem {
                name_scope,
                component_type,
                ..
            } = *self.rd.elem(t, e);
            let math = mt.and_then(|mt| {
                self.rd
                    .parse_math(self.ar, t, name_scope, component_type, &mt)
            });
            parsed.maths.insert((t, e), math);
        }
        parsed
    }

    /// Parse every element's record: each attribute its type declares and
    /// its children as the type reads them, parsed where the element sits.
    fn parse_records(&mut self, to_plan: &[(TemplateId, ElemId)], parsed: &mut Parsed) {
        for &(t, e) in to_plan {
            if self.tables[t.index()].is_box(e) || self.rd.elem(t, e).cloned {
                continue;
            }
            let def = self.rd.elem(t, e).planned_as.def();
            if def.attributes.is_empty() && def.children.built() {
                continue;
            }
            let record = self.rd.parse_record(self.ar, t, e);
            parsed.records.insert((t, e), record);
        }
    }
}
