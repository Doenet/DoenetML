//! A repeat's count before its count cell exists: for a repeat the build
//! before did not stamp (in an iteration it did not have, or in the first
//! build of a load), the count its plan gives, read from the plans and the
//! values the session carries, so the build stamps the iterations the
//! count cell will ask for instead of none and the next pass has nothing
//! to add. Only an estimate: a count it cannot follow (math, a vector
//! operator, an index, a choice's interface) is 0, as it was, and one it
//! gets wrong costs the pass it would have cost anyway; the count cell
//! still decides whether the structure settled.

use super::*;

/// How many plans an estimate follows before giving up.
const FUEL: u32 = 64;

impl Builder<'_> {
    /// The iterations to stamp repeat element `e` of template `t` in
    /// `scope` with when the counts do not say.
    pub(in crate::build) fn estimate_count(&self, t: TemplateId, e: ElemId, scope: ScopeId) -> u32 {
        let Some(pi) = self.compiled.templates[t].elems[e]
            .component_type
            .count_prop()
        else {
            return 0;
        };
        let mut fuel = FUEL;
        match self.estimate(t, e, pi, scope, &mut fuel) {
            Some(v) if v >= 0.0 => v.min(u32::MAX as f64) as u32,
            _ => 0,
        }
    }

    /// The value prop `pi` of element `e` of template `t`, stamped in
    /// `scope`, will start with, if its plan says it simply.
    fn estimate(
        &self,
        t: TemplateId,
        e: ElemId,
        pi: usize,
        scope: ScopeId,
        fuel: &mut u32,
    ) -> Option<f64> {
        *fuel = fuel.checked_sub(1)?;
        let el = &self.compiled.templates[t].elems[e];
        match el.props.get(pi)? {
            // As emit starts an essential cell: what is parked for it, else
            // what the session carries, else the plan's value.
            SourcePlan::Literal(v) | SourcePlan::Default(v) => {
                let parked = self.session.parked.get(&(scope, el.key, pi as u32));
                let carried = || self.session.carried(scope, el.slot_off + pi as u32);
                Some(parked.copied().or_else(carried).unwrap_or(*v))
            }
            SourcePlan::Fixed(v) => Some(*v),
            SourcePlan::IterIndex => (scope != 0).then(|| self.scopes[scope].2 as f64),
            SourcePlan::Alias(arg) => self.estimate_arg(t, e, *arg, scope, fuel),
            SourcePlan::Op(spec, args) if !matches!(spec, OpSpec::Vec(_) | OpSpec::Sym(_)) => {
                let mut values = [0.0; 2];
                for (k, &a) in args.iter().enumerate() {
                    *values.get_mut(k)? = self.estimate_arg(t, e, a, scope, fuel)?;
                }
                let inputs: Vec<CellIdx> = (0..args.len() as CellIdx).collect();
                Some(spec.bind(&inputs, &mut Vec::new()).eval(&values))
            }
            _ => None,
        }
    }

    /// The value an argument of element `e`'s plan will start with: one of
    /// its own slots, a sibling's, or a reference by names alone, whose
    /// element is stamped in the scope its template is, up the scopes.
    fn estimate_arg(
        &self,
        t: TemplateId,
        e: ElemId,
        arg: Arg,
        scope: ScopeId,
        fuel: &mut u32,
    ) -> Option<f64> {
        match arg {
            Arg::Own(k) => self.estimate(t, e, k as usize, scope, fuel),
            Arg::Elem(e2, k) => self.estimate(t, e2, k as usize, scope, fuel),
            Arg::Ref(p, Sel::Whole) => {
                let (tt, target) = self.compiled.static_target(t, p)?;
                let mut sc = scope;
                for _ in 0..self.compiled.refs[p].hops {
                    sc = self.scopes[sc].0;
                }
                let component_type = self.compiled.templates[tt].elems[target].component_type;
                let prop = match &self.compiled.refs[p].prop {
                    Some(prop) => prop.as_str(),
                    None => component_type.default_prop()?,
                };
                let pi = component_type.prop_index(prop)?;
                self.estimate(tt, target, pi, sc, fuel)
            }
            Arg::Ref(..) => None,
        }
    }
}
