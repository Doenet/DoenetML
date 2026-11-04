//! An element's attribute record (ADR 0032, decision 3): every attribute
//! its type's planner declares (`attributes { .. }`), parsed once by the
//! compile into a typed value, each in the scope it was written in. A
//! planner reads the record, never the source; what a planner of a `Plan`
//! type reads of an `extend` referent is the referent's record merged
//! under the element's own (`Compiler::merged_record`), so an extend with
//! overrides is the referent with those changes wherever the referent sits.

use crate::compile::*;
use crate::components::{AttrDecl, AttrKind};

/// One declared attribute's value as the compile parsed it.
#[derive(Debug, Clone)]
pub(crate) enum AttrValue {
    /// Not written, by the element or by what it extends.
    Absent,
    /// `Scalar`, `Value` or `Flag`: a source.
    Scalar(Source),
    Point(PointAttr),
    Points(Vec<GivenPoint>),
    Bool(bool),
    Number(f64),
    Text(String),
    Math(Box<[NodeId]>),
    Ref(RefId),
}

/// A point attribute as parsed: a point, or text that is no point (`A`),
/// which a planner may warn about rather than fail on (a circle's
/// center), with the error parsing it met.
#[derive(Debug, Clone)]
pub(crate) enum PointAttr {
    Point(GivenPoint),
    NotAPoint(Error),
}

impl PointAttr {
    /// The point, or the error parsing it met.
    pub(crate) fn point(self) -> Result<GivenPoint> {
        match self {
            PointAttr::Point(p) => Ok(p),
            PointAttr::NotAPoint(e) => Err(e),
        }
    }
}

/// An element's declared attributes, parsed (`AttrValue`), by the
/// attribute's position among its type's declarations, and whether each
/// is the element's own or taken from what it extends.
#[derive(Debug, Clone, Default)]
pub(crate) struct Record {
    values: Vec<AttrValue>,
    /// Which values the element wrote itself.
    own: Vec<bool>,
}

impl Record {
    fn get(&self, attr: Attr) -> &AttrValue {
        self.values.get(attr.index()).unwrap_or(&AttrValue::Absent)
    }

    /// Whether the element wrote attribute `attr` itself.
    #[allow(dead_code)]
    pub(crate) fn is_own(&self, attr: Attr) -> bool {
        self.own.get(attr.index()).copied().unwrap_or(false)
    }

    pub(crate) fn scalar(&self, attr: Attr) -> Option<Source> {
        match self.get(attr) {
            AttrValue::Scalar(s) => Some(s.clone()),
            _ => None,
        }
    }

    pub(crate) fn point(&self, attr: Attr) -> Option<PointAttr> {
        match self.get(attr) {
            AttrValue::Point(p) => Some(p.clone()),
            _ => None,
        }
    }

    pub(crate) fn points(&self, attr: Attr) -> Vec<GivenPoint> {
        match self.get(attr) {
            AttrValue::Points(ps) => ps.clone(),
            _ => Vec::new(),
        }
    }

    /// A 0/1 flag: its source, `default` when absent.
    pub(crate) fn flag(&self, attr: Attr, default: bool) -> Source {
        match self.get(attr) {
            AttrValue::Scalar(s) => s.clone(),
            _ => Source::given(if default { 1.0 } else { 0.0 }),
        }
    }

    pub(crate) fn bool(&self, attr: Attr, default: bool) -> bool {
        match self.get(attr) {
            AttrValue::Bool(b) => *b,
            _ => default,
        }
    }

    pub(crate) fn number(&self, attr: Attr, default: f64) -> f64 {
        match self.get(attr) {
            AttrValue::Number(v) => *v,
            _ => default,
        }
    }

    pub(crate) fn text(&self, attr: Attr) -> Option<String> {
        match self.get(attr) {
            AttrValue::Text(t) => Some(t.clone()),
            _ => None,
        }
    }

    pub(crate) fn math(&self, attr: Attr) -> Option<Box<[NodeId]>> {
        match self.get(attr) {
            AttrValue::Math(nodes) => Some(nodes.clone()),
            _ => None,
        }
    }

    /// Read by `Attrs::of` for the `Ref` kind, which no type declares yet.
    #[allow(dead_code)]
    pub(crate) fn reference(&self, attr: Attr) -> Option<RefId> {
        match self.get(attr) {
            AttrValue::Ref(p) => Some(*p),
            _ => None,
        }
    }

    /// The record with every absent value taken from `referent`'s, the
    /// merge an extend with overrides is planned from (ADR 0032, decision
    /// 3): the element's own values over the referent's.
    pub(crate) fn merged_over(mut self, referent: &Record) -> Record {
        let n = self.values.len().max(referent.values.len());
        self.values.resize(n, AttrValue::Absent);
        self.own.resize(n, false);
        for (i, v) in referent.values.iter().enumerate() {
            if matches!(self.values[i], AttrValue::Absent) {
                self.values[i] = v.clone();
            }
        }
        self
    }

    /// Every reference and math text the record holds rewritten, when the
    /// record is read from another template (`Compiler::rebase_record`).
    pub(in crate::compile) fn rebase<'a>(
        &mut self,
        cp: &mut Compiler<'a>,
        refs: &mut dyn FnMut(&mut Compiler<'a>, &mut RefId),
        exprs: &mut dyn FnMut(&mut Compiler<'a>, &mut ExprId),
    ) {
        for v in &mut self.values {
            match v {
                AttrValue::Scalar(s) => rebase_source(s, cp, refs, exprs),
                AttrValue::Point(PointAttr::Point(p)) => rebase_point(p, cp, refs, exprs),
                AttrValue::Points(ps) => {
                    for p in ps {
                        rebase_point(p, cp, refs, exprs);
                    }
                }
                AttrValue::Ref(p) => refs(cp, p),
                _ => {}
            }
        }
    }
}

fn rebase_source<'a>(
    s: &mut Source,
    cp: &mut Compiler<'a>,
    refs: &mut dyn FnMut(&mut Compiler<'a>, &mut RefId),
    exprs: &mut dyn FnMut(&mut Compiler<'a>, &mut ExprId),
) {
    match s {
        Source::Flow(Flow::Alias(Arg::Ref(p, _))) => refs(cp, p),
        Source::Flow(Flow::Op(_, args)) => {
            for a in args {
                if let Arg::Ref(p, _) = a {
                    refs(cp, p);
                }
            }
        }
        Source::Flow(
            Flow::Math(id) | Flow::MathHandle(id, _) | Flow::MathValue(id) | Flow::SymExpr(id, _),
        ) => exprs(cp, id),
        Source::Leaf(Leaf::Scope(ScopeConst::Seed(p))) => refs(cp, p),
        _ => {}
    }
}

fn rebase_point<'a>(
    p: &mut GivenPoint,
    cp: &mut Compiler<'a>,
    refs: &mut dyn FnMut(&mut Compiler<'a>, &mut RefId),
    exprs: &mut dyn FnMut(&mut Compiler<'a>, &mut ExprId),
) {
    match p {
        GivenPoint::Ref(p) | GivenPoint::Item(p, _) => refs(cp, p),
        GivenPoint::Tuple(xy) => {
            for s in xy {
                rebase_source(s, cp, refs, exprs);
            }
        }
    }
}

impl Compiler<'_> {
    /// Element `e`'s record: every attribute its planner's type declares,
    /// parsed from the element's own attributes where the element sits.
    /// Parsed once, when parsing (ADR 0030); a planner reads it through
    /// `PlanCtx::record`.
    pub(in crate::compile) fn parse_record(&mut self, t: TemplateId, e: ElemId) -> Result<Record> {
        let Elem {
            node,
            planned_as,
            name_scope: scope,
            ..
        } = self.outlined(t).elems[e.index()];
        let decls: &'static [AttrDecl] = planned_as.def().attributes;
        let mut record = Record {
            values: Vec::with_capacity(decls.len()),
            own: Vec::with_capacity(decls.len()),
        };
        for decl in decls {
            let value = if node == NodeId::NONE {
                AttrValue::Absent
            } else {
                self.parse_attr(t, scope, node, decl)?
            };
            record.own.push(!matches!(value, AttrValue::Absent));
            record.values.push(value);
        }
        Ok(record)
    }

    /// Attribute `decl` of `node`, planned from `scope`.
    fn parse_attr(
        &mut self,
        t: TemplateId,
        scope: ElemId,
        node: NodeId,
        decl: &AttrDecl,
    ) -> Result<AttrValue> {
        let d = self.dast;
        let Some(a) = d.attr(node, decl.name) else {
            return Ok(AttrValue::Absent);
        };
        Ok(match decl.kind {
            AttrKind::Scalar => {
                AttrValue::Scalar(self.plan_scalar(t, scope, d.attr_children(a))?)
            }
            AttrKind::Value => {
                AttrValue::Scalar(self.plan_value(t, scope, decl.name, d.attr_children(a), None)?)
            }
            AttrKind::Point => AttrValue::Point(match self.plan_point_attr(t, scope, a) {
                Ok(p) => PointAttr::Point(p),
                // Not a point (`center="A"`): the planner's to warn about
                // or refuse.
                Err(e @ Error::BadMath { .. }) if self.single_macro(a).is_none() => {
                    PointAttr::NotAPoint(e)
                }
                Err(e) => return Err(e),
            }),
            AttrKind::Points { .. } => AttrValue::Points(self.plan_point_list(t, scope, node, a)?),
            AttrKind::Flag { .. } => AttrValue::Scalar(match self.single_macro(a) {
                // A reference is bound.
                Some(_) => self.plan_scalar(t, scope, d.attr_children(a))?,
                // A literal: a bare attribute is true.
                None => Source::given(if self.attr_flag(node, decl.name) {
                    1.0
                } else {
                    0.0
                }),
            }),
            AttrKind::Bool { .. } => AttrValue::Bool(self.attr_flag(node, decl.name)),
            AttrKind::Number { default } => AttrValue::Number(
                self.attr_text(a)
                    .and_then(|s| s.trim().parse::<f64>().ok())
                    .unwrap_or(default),
            ),
            AttrKind::Text => match self.attr_text(a) {
                Some(text) => AttrValue::Text(text),
                None => AttrValue::Absent,
            },
            AttrKind::Math => AttrValue::Math(d.attr_children(a).into()),
            AttrKind::Ref => {
                let m = self.single_macro(a).ok_or_else(|| Error::BadValue {
                    attr: decl.name.into(),
                    text: self.attr_text(a).unwrap_or_default(),
                })?;
                AttrValue::Ref(self.plan_ref(t, scope, m)?)
            }
        })
    }
}
