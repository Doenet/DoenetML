//! Number display settings, as planned: `displayDigits` and the others
//! ([`PropFrom::Display`]), for every type that has them, whatever its
//! planner (ADR 0058).

use super::Planning;
use crate::compile::*;

/// Planning, display settings: each setting the element writes itself onto
/// the type's prop for it, after the type's own planner. Reads the
/// element's own attributes, never another element's plan (ADR 0029).
impl Planning<'_> {
    /// Plan the display-setting props of element `e`, which its planner
    /// left absent: a literal as the number it means (a flag written bare
    /// or `true` on, `false` off; a bare `displaySmallAsZero` its default
    /// threshold), a reference or an expression as the value it names,
    /// which a tick may change. A setting the element does not write stays
    /// not given (NaN): a reader takes it from the nearest referent that
    /// writes it, else its default, as the current core's
    /// `utils/numberDisplay.js` does. A copy that aliases its referent's
    /// props (a bare copy, a clone) keeps them.
    pub(super) fn plan_display(&mut self, t: TemplateId, e: ElemId) -> Result<()> {
        let Elem {
            node,
            component_type,
            name_scope: scope,
            ..
        } = *self.rd.own_row(t, e);
        if node == NodeId::NONE {
            return Ok(());
        }
        let d = self.rd.dast;
        for (pi, def) in component_type.prop_defs().iter().enumerate() {
            if def.from != PropFrom::Display {
                continue;
            }
            let plan = &self.tables[t.index()].plans[e.index()];
            if !plan.props.get(pi).is_some_and(is_absent) {
                continue;
            }
            let Some(a) = d.attr(node, def.name) else {
                // Not written: the setting of a sole child that is one
                // reference, unless the element writes the setting this
                // one is coupled with (ADR 0071).
                // `hide` is no number display setting: a child's is its own.
                let coupled = match def.name {
                    "displayDigits" => d.attr(node, "displayDecimals").is_some(),
                    "displayDecimals" => d.attr(node, "displayDigits").is_some(),
                    "hide" => true,
                    _ => false,
                };
                if !coupled
                    && let Some(source) = self.sole_child_setting(t, scope, node, def.name)?
                {
                    self.tables[t.index()].plans[e.index()].props[pi] = source;
                }
                continue;
            };
            let source = match self.rd.attr_text(a) {
                Some(text) => Source::constant(literal_setting(def.name, &text)),
                None => self.rd.plan_value(
                    &mut self.ar,
                    t,
                    scope,
                    def.name,
                    d.attr_children(a),
                    None,
                )?,
            };
            self.tables[t.index()].plans[e.index()].props[pi] = source;
        }
        Ok(())
    }

    /// Setting `name` of the referent of `node`'s sole child, when its
    /// children are one bare reference (`<number>$n</number>`, no text
    /// beside it, no index, no prop) to a component whose type has the
    /// setting: a reference to it, as the current core's
    /// `childGroupsIfSingleMatch` takes a sole child's setting. A
    /// referent that writes none holds it not given, so the reader
    /// goes on to the default.
    fn sole_child_setting(
        &mut self,
        t: TemplateId,
        scope: ElemId,
        node: NodeId,
        name: &'static str,
    ) -> Result<Option<Source>> {
        let d = self.rd.dast;
        let mut sole = None;
        for &n in d.children(node) {
            match d.kind(n) {
                NodeKind::Text if d.str(n).trim().is_empty() => {}
                NodeKind::Macro if sole.is_none() => sole = Some(n),
                NodeKind::Other => {}
                _ => return Ok(None),
            }
        }
        let Some(m) = sole else {
            return Ok(None);
        };
        if d.macro_path(m).len() != 1 || d.macro_has_index(m) {
            return Ok(None);
        }
        let p = self.rd.plan_ref(&mut self.ar, t, scope, m)?;
        if self.ar.refs[p.index()].prop.is_some() {
            return Ok(None);
        }
        let has_setting = self
            .rd
            .ref_target_type(&self.ar, t, p)?
            .is_some_and(|ty| ty.prop_index(name).is_some());
        if !has_setting {
            return Ok(None);
        }
        let named = self.rd.prop_named(&self.ar, t, p, name)?;
        self.ar.ref_mut(p).prop = named;
        Ok(Some(Source::reference(p)))
    }
}

/// A display setting `name` written as the literal `text`: a number as
/// written; a flag bare or `true` on (`displaySmallAsZero` its default
/// threshold, 1e-14), `false` off; anything else not given (NaN).
fn literal_setting(name: &str, text: &str) -> f64 {
    let text = text.trim().to_ascii_lowercase();
    match text.as_str() {
        "" | "true" if name == "displaySmallAsZero" => 1e-14,
        "" | "true" => 1.0,
        "false" => 0.0,
        _ => text.parse().unwrap_or(f64::NAN),
    }
}

/// Whether `source` is a value not given (`Source::absent`), as a planner
/// leaves a prop for planning after it.
fn is_absent(source: &Source) -> bool {
    matches!(source, Source::Leaf(Leaf::Const(v)) if v.is_nan())
}
