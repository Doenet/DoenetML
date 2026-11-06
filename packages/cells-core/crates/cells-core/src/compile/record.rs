//! An element's record: every attribute its type declares and its children
//! as the type reads them, parsed once by the compile into typed values,
//! each in the scope it was written in. A planner reads the record, never
//! the source; an extend's record is its own merged over the referent's.

use crate::compile::rebase::Rebaser;
use crate::compile::*;
use crate::components::{AttrDecl, AttrKind, ChildrenDecl, ChildrenKind};

/// One declared attribute's value as the compile parsed it.
#[derive(Debug, Clone)]
pub(crate) enum AttrValue {
    /// Not written, by the element or by what it extends.
    Absent,
    /// `Scalar`, `Value` or `Flag`: a source.
    Scalar(Source),
    Point(PointAttr),
    Points(Vec<GivenPoint>),
    /// `Scalars`: a source per item.
    Scalars(Vec<Source>),
    Bool(bool),
    Number(f64),
    /// `Literal`: the number, or the error reading it met, for the
    /// planner to meet when it reads it.
    Literal(Result<f64>),
    /// `LiteralFlag`: the flag, or none when it is no literal.
    LiteralFlag(Option<bool>),
    /// [`Content`].
    Content(ValueChildren),
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

/// An element's declared attributes, parsed, by the attribute's position
/// among its type's declarations, and whether each is the element's own or
/// taken from what it extends; and its children, as its type reads them.
#[derive(Debug, Clone, Default)]
pub(crate) struct Record {
    values: Vec<AttrValue>,
    /// Which values the element wrote itself.
    own: Vec<bool>,
    children: Children,
    /// The tag the element is written with (`division` for a section).
    tag: String,
}

/// An element's children as its type reads them (`children:`), parsed:
/// its math text or its value, and the members of each group of element
/// children, by the group's position among its type's declarations.
#[derive(Debug, Clone, Default)]
pub(crate) struct Children {
    content: Content,
    groups: Vec<Vec<Member>>,
}

/// What the children say as math text or as a value: absent when they
/// say nothing (blank, or only presentation and group members).
#[derive(Debug, Clone, Default)]
enum Content {
    #[default]
    Absent,
    /// `Math`: the text and references, as written.
    Math(Box<[NodeId]>),
    /// `Value`.
    Value(ValueChildren),
}

/// Children read as a value (`children: Value`): a [`PropFrom::Children`]
/// prop's, or the value of a `<text>`, a `<boolean>` or an input.
#[derive(Debug, Clone)]
pub(crate) struct ValueChildren {
    /// The content: the children but layout and presentation.
    pub(crate) nodes: Box<[NodeId]>,
    pub(crate) value: ChildValue,
    /// The tag of the first element among them, which a value cannot hold.
    pub(crate) element: Option<String>,
    /// How many references they hold.
    pub(crate) references: usize,
}

/// What a value's children are, from their text and references (an
/// element among them aside).
#[derive(Debug, Clone)]
pub(crate) enum ChildValue {
    /// No content.
    Blank,
    /// One reference and no text, planned where it was written.
    Reference(RefId),
    /// Text and no reference: its text, joined, as written; and its
    /// string id when it is one text node.
    Text { text: String, id: Option<StrId> },
    /// Anything else: math text (text and references, or only elements).
    Math,
}

impl ValueChildren {
    /// No children.
    pub(crate) fn blank() -> Self {
        ValueChildren {
            nodes: Box::new([]),
            value: ChildValue::Blank,
            element: None,
            references: 0,
        }
    }
}

/// One element child of a group (`children: .. { constraints: [..] }`):
/// its type and its own record, parsed where it was written.
#[derive(Debug, Clone)]
pub(crate) struct Member {
    pub(crate) component_type: ComponentType,
    pub(crate) record: Record,
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

    /// A list of scalars: a source per item, none when absent.
    pub(crate) fn scalars(&self, attr: Attr) -> Vec<Source> {
        match self.get(attr) {
            AttrValue::Scalars(xs) => xs.clone(),
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

    /// A `Literal`: its number, `default` when absent, or the error
    /// reading it met.
    pub(crate) fn literal(&self, attr: Attr, default: f64) -> Result<f64> {
        match self.get(attr) {
            AttrValue::Literal(v) => v.clone(),
            _ => Ok(default),
        }
    }

    /// A `LiteralFlag`: none when absent, `Some(None)` when it is no
    /// literal.
    pub(crate) fn literal_flag(&self, attr: Attr) -> Option<Option<bool>> {
        match self.get(attr) {
            AttrValue::LiteralFlag(v) => Some(*v),
            _ => None,
        }
    }

    /// A [`Content`]: the value, none when absent.
    pub(crate) fn content(&self, attr: Attr) -> Option<ValueChildren> {
        match self.get(attr) {
            AttrValue::Content(v) => Some(v.clone()),
            _ => None,
        }
    }

    /// The tag the element is written with.
    pub(crate) fn tag(&self) -> &str {
        &self.tag
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

    /// A `Ref`: the reference, none when absent. No type declares one yet.
    #[allow(dead_code)]
    pub(crate) fn reference(&self, attr: Attr) -> Option<RefId> {
        match self.get(attr) {
            AttrValue::Ref(p) => Some(*p),
            _ => None,
        }
    }

    /// `children: Math`: the math text, none when there is none.
    pub(crate) fn child_math(&self) -> Option<Box<[NodeId]>> {
        match &self.children.content {
            Content::Math(nodes) => Some(nodes.clone()),
            _ => None,
        }
    }

    /// `children: Value`: the value, blank when there is none.
    pub(crate) fn child_value(&self) -> ValueChildren {
        match &self.children.content {
            Content::Value(v) => v.clone(),
            _ => ValueChildren::blank(),
        }
    }

    /// The members of group `i` ([`ChildrenDecl::groups`]).
    pub(crate) fn group(&self, i: usize) -> Vec<Member> {
        self.children.groups.get(i).cloned().unwrap_or_default()
    }

    /// The record with every absent value taken from `referent`'s: the
    /// element's own values over the referent's. Children merge the same
    /// way, each part on its own: the referent's math text or value when
    /// the element has none, and the referent's members of a group of which
    /// the element has none.
    pub(crate) fn merged_over(mut self, referent: &Record) -> Record {
        let n = self.values.len().max(referent.values.len());
        self.values.resize(n, AttrValue::Absent);
        self.own.resize(n, false);
        for (i, v) in referent.values.iter().enumerate() {
            if matches!(self.values[i], AttrValue::Absent) {
                self.values[i] = v.clone();
            }
        }
        if matches!(self.children.content, Content::Absent) {
            self.children.content = referent.children.content.clone();
        }
        let n = self
            .children
            .groups
            .len()
            .max(referent.children.groups.len());
        self.children.groups.resize(n, Vec::new());
        for (i, g) in referent.children.groups.iter().enumerate() {
            if self.children.groups[i].is_empty() {
                self.children.groups[i] = g.clone();
            }
        }
        self
    }

    /// Every reference and math text the record holds rewritten, for a
    /// record read from another template.
    pub(in crate::compile) fn rebase(&mut self, rw: &mut Rebaser<'_, '_>) {
        for v in &mut self.values {
            match v {
                AttrValue::Scalar(s) => rebase_source(s, rw),
                AttrValue::Scalars(xs) => {
                    for s in xs {
                        rebase_source(s, rw);
                    }
                }
                AttrValue::Point(PointAttr::Point(p)) => rebase_point(p, rw),
                AttrValue::Points(ps) => {
                    for p in ps {
                        rebase_point(p, rw);
                    }
                }
                AttrValue::Ref(p) => rw.reference(p),
                AttrValue::Content(v) => match &mut v.value {
                    ChildValue::Reference(p) => rw.reference(p),
                    // Math text names nodes planned where the referent
                    // sits: through a path, the copy takes none.
                    ChildValue::Math => *v = ValueChildren::blank(),
                    _ => {}
                },
                _ => {}
            }
        }
        // Children name nodes planned where the referent sits, which a
        // path cannot rewrite: a copy through a path takes none of them.
        self.children = Children::default();
    }
}

fn rebase_source(s: &mut Source, rw: &mut Rebaser<'_, '_>) {
    match s {
        Source::Flow(Flow::Alias(Arg::Ref(p, _))) => rw.reference(p),
        Source::Flow(Flow::Op(_, args)) => {
            for a in args {
                if let Arg::Ref(p, _) = a {
                    rw.reference(p);
                }
            }
        }
        Source::Flow(
            Flow::Math(id) | Flow::MathHandle(id, _) | Flow::MathValue(id) | Flow::SymExpr(id, _),
        ) => rw.expr(id),
        Source::Leaf(Leaf::Scope(ScopeConst::Seed(p))) => rw.reference(p),
        _ => {}
    }
}

fn rebase_point(p: &mut GivenPoint, rw: &mut Rebaser<'_, '_>) {
    match p {
        GivenPoint::Ref(p) | GivenPoint::Item(p, _) => rw.reference(p),
        GivenPoint::Tuple(xy) => {
            for s in xy {
                rebase_source(s, rw);
            }
        }
    }
}

/// Reading the source, an element's record: every attribute its type declares
/// and its children, parsed once into typed values. Run by parsing; a planner
/// reads the record, never the source.
impl Compiler<'_> {
    /// Element `e`'s record: every attribute its planner's type declares,
    /// and its children as the type reads them, parsed from the element's
    /// own source where the element sits.
    pub(in crate::compile) fn parse_record(
        &mut self,
        rf: &mut Refs,
        t: TemplateId,
        e: ElemId,
    ) -> Result<Record> {
        let Elem {
            node,
            planned_as,
            name_scope: scope,
            ..
        } = self.outlined(t).elems[e.index()];
        if node == NodeId::NONE {
            let decls = planned_as.def().attributes;
            return Ok(Record {
                values: vec![AttrValue::Absent; decls.len()],
                own: vec![false; decls.len()],
                children: Children::default(),
                tag: String::new(),
            });
        }
        self.parse_node_record(rf, t, scope, node, planned_as)
    }

    /// The record of `node`, an element of type `component_type` (an
    /// element, or a member of a group of one's children), planned from
    /// `scope`.
    fn parse_node_record(
        &mut self,
        rf: &mut Refs,
        t: TemplateId,
        scope: ElemId,
        node: NodeId,
        component_type: ComponentType,
    ) -> Result<Record> {
        let def = component_type.def();
        let decls: &'static [AttrDecl] = def.attributes;
        let mut record = Record {
            values: Vec::with_capacity(decls.len()),
            own: Vec::with_capacity(decls.len()),
            children: Children::default(),
            tag: self.dast.str(node).to_string(),
        };
        for decl in decls {
            let value = self.parse_attr(rf, t, scope, node, decl)?;
            record.own.push(!matches!(value, AttrValue::Absent));
            record.values.push(value);
        }
        record.children = self.parse_children(rf, t, scope, node, &def.children)?;
        Ok(record)
    }

    /// The children of `node` as `decl` reads them, planned from `scope`.
    /// Layout and presentation are no content. An element child
    /// is a member of the group that names its type, directly or inside a
    /// wrapper named as the group is; one no group takes is an error when
    /// the type has groups, and math text's (as written) when it has none.
    fn parse_children(
        &mut self,
        rf: &mut Refs,
        t: TemplateId,
        scope: ElemId,
        node: NodeId,
        decl: &ChildrenDecl,
    ) -> Result<Children> {
        let mut children = Children {
            content: Content::Absent,
            groups: vec![Vec::new(); decl.groups.len()],
        };
        if matches!(decl.kind, ChildrenKind::None | ChildrenKind::Rendered)
            && decl.groups.is_empty()
        {
            return Ok(children);
        }
        let d = self.dast;
        let mut content = Vec::new();
        for &n in d.children(node) {
            if self.is_not_content(n) {
                continue;
            }
            if d.kind(n) != NodeKind::Element || decl.groups.is_empty() {
                content.push(n);
                continue;
            }
            let tag = d.str(n);
            if let Some(g) = decl.groups.iter().position(|g| g.name == tag) {
                for &m in d.children(n) {
                    if d.kind(m) == NodeKind::Element {
                        let member = self.parse_member(rf, t, scope, m, decl, Some(g))?;
                        children.groups[g].push(member);
                    }
                }
                continue;
            }
            let member = self.parse_member(rf, t, scope, n, decl, None)?;
            let g = decl
                .groups
                .iter()
                .position(|g| g.types.contains(&member.component_type))
                .expect("a member's group");
            children.groups[g].push(member);
        }
        children.content = match decl.kind {
            _ if content.is_empty() => Content::Absent,
            // A type that reads only groups reads no text or reference.
            ChildrenKind::None | ChildrenKind::Rendered => {
                let names: Vec<&str> = decl.groups.iter().map(|g| g.name).collect();
                return Err(Error::Unsupported(format!(
                    "the children of <{}> must be among its {}",
                    d.str(node),
                    names.join(" or ")
                )));
            }
            ChildrenKind::Math => Content::Math(content.into()),
            ChildrenKind::Value => {
                Content::Value(self.parse_value_children(rf, t, scope, content)?)
            }
        };
        Ok(children)
    }

    /// Element child `n` as a member of a group of `decl` (of group `g`
    /// when it sits in that group's wrapper): an error when no group (or
    /// not that one) takes its type.
    fn parse_member(
        &mut self,
        rf: &mut Refs,
        t: TemplateId,
        scope: ElemId,
        n: NodeId,
        decl: &ChildrenDecl,
        g: Option<usize>,
    ) -> Result<Member> {
        let tag = self.dast.str(n);
        let component_type = decl
            .groups
            .iter()
            .enumerate()
            .filter(|&(i, _)| g.is_none_or(|g| g == i))
            .flat_map(|(_, g)| g.types.iter().copied())
            .find(|k| k.def().tags.contains(&tag))
            .ok_or_else(|| {
                let names: Vec<&str> = decl.groups.iter().map(|g| g.name).collect();
                Error::Unsupported(format!("<{tag}> among the {}", names.join(" or ")))
            })?;
        let record = self.parse_node_record(rf, t, scope, n, component_type)?;
        Ok(Member {
            component_type,
            record,
        })
    }

    /// Content nodes read as a value ([`ChildValue`]): a reference among
    /// them is planned here, where it was written.
    fn parse_value_children(
        &mut self,
        rf: &mut Refs,
        t: TemplateId,
        scope: ElemId,
        nodes: Vec<NodeId>,
    ) -> Result<ValueChildren> {
        let d = self.dast;
        let (mut macros, mut macro_node) = (0, NodeId::NONE);
        let mut texts = Vec::new();
        let mut element = None;
        for &n in &nodes {
            match d.kind(n) {
                NodeKind::Macro => {
                    macros += 1;
                    macro_node = n;
                }
                NodeKind::Text => texts.push(n),
                NodeKind::Element if element.is_none() => element = Some(d.str(n).to_string()),
                _ => {}
            }
        }
        let value = match (macros, texts.len()) {
            (1, 0) => ChildValue::Reference(self.plan_ref(rf, t, scope, macro_node)?),
            (0, 1..) => ChildValue::Text {
                text: texts.iter().map(|&n| d.str(n)).collect(),
                id: (texts.len() == 1).then(|| d.str_id(texts[0])),
            },
            _ => ChildValue::Math,
        };
        Ok(ValueChildren {
            nodes: nodes.into(),
            value,
            element,
            references: macros,
        })
    }

    /// Attribute `decl` of `node`, planned from `scope`.
    fn parse_attr(
        &mut self,
        rf: &mut Refs,
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
                AttrValue::Scalar(self.plan_scalar(rf, t, scope, d.attr_children(a))?)
            }
            AttrKind::Value => AttrValue::Scalar(self.plan_value(
                rf,
                t,
                scope,
                decl.name,
                d.attr_children(a),
                None,
            )?),
            AttrKind::Point => AttrValue::Point(match self.plan_point_attr(rf, t, scope, a) {
                Ok(p) => PointAttr::Point(p),
                // Not a point (`center="A"`): the planner's to warn about
                // or refuse.
                Err(e @ Error::BadMath { .. }) if self.single_macro(a).is_none() => {
                    PointAttr::NotAPoint(e)
                }
                Err(e) => return Err(e),
            }),
            AttrKind::Points { .. } => {
                AttrValue::Points(self.plan_point_list(rf, t, scope, node, a)?)
            }
            AttrKind::Scalars => AttrValue::Scalars(self.plan_scalar_list(rf, t, scope, a)?),
            AttrKind::Flag { .. } => AttrValue::Scalar(match self.single_macro(a) {
                // A reference is bound.
                Some(_) => self.plan_scalar(rf, t, scope, d.attr_children(a))?,
                // A literal: a bare attribute is true.
                None => Source::given(if self.attr_flag(node, decl.name) {
                    1.0
                } else {
                    0.0
                }),
            }),
            AttrKind::Bool { .. } => AttrValue::Bool(self.attr_flag(node, decl.name)),
            AttrKind::On => AttrValue::Bool(self.attr_on(node, decl.name)),
            AttrKind::Written => AttrValue::Bool(true),
            AttrKind::Number { default } => AttrValue::Number(
                self.attr_text(a)
                    .and_then(|s| s.trim().parse::<f64>().ok())
                    .unwrap_or(default),
            ),
            AttrKind::Literal { .. } => AttrValue::Literal(self.literal_attr(a, decl.name)),
            AttrKind::LiteralFlag => AttrValue::LiteralFlag(
                self.attr_text(a)
                    .is_some()
                    .then(|| self.attr_flag(node, decl.name)),
            ),
            AttrKind::Content => {
                let nodes = d.attr_children(a).to_vec();
                AttrValue::Content(self.parse_value_children(rf, t, scope, nodes)?)
            }
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
                AttrValue::Ref(self.plan_ref(rf, t, scope, m)?)
            }
        })
    }
}

/// The parse of children into the record, each kind against a type that
/// declares it, and the merge of an element's own children over its
/// referent's.
#[cfg(test)]
mod tests {
    use super::*;
    use crate::testing::dast::{document, el, load, mac};
    use crate::testing::prop_value as value;

    fn no_errors(doc: &crate::Document) {
        assert!(
            doc.diagnostics()
                .iter()
                .all(|d| d.kind != crate::DiagnosticKind::Error),
            "{:?}",
            doc.diagnostics()
        );
    }

    /// `children: Value`: a literal, one reference, math text and a
    /// blank, presentation passed over.
    #[test]
    fn value_children_are_a_literal_a_reference_math_or_blank() {
        let doc = load(document([
            el("number").name("a").text("3"),
            el("number").name("b").child(mac("a")),
            el("number").name("c").child(mac("a")).text(" + 1"),
            el("number")
                .name("d")
                .child(el("label").text("L"))
                .text("4"),
            el("number").name("e"),
        ]))
        .unwrap();
        no_errors(&doc);
        assert_eq!(value(&doc, "a.value"), 3.0);
        assert_eq!(value(&doc, "b.value"), 3.0);
        assert_eq!(value(&doc, "c.value"), 4.0);
        assert_eq!(value(&doc, "d.value"), 4.0);
        assert!(value(&doc, "e.value").is_nan());
    }

    /// `children: Value` read by a planner: a `<text>` is its literal, or
    /// what its one reference names.
    #[test]
    fn value_children_reach_a_planner() {
        let doc = load(document([
            el("text").name("t").text("hello"),
            el("text").name("u").child(mac("t")),
            el("boolean").name("b").child(mac("c")),
            el("boolean").name("c").text("true"),
        ]))
        .unwrap();
        no_errors(&doc);
        assert_eq!(value(&doc, "b.value"), 1.0);
        let (t, u) = (value(&doc, "t.value"), value(&doc, "u.value"));
        assert_eq!(t, u);
    }

    /// `children: Math`: the element's own math text, else its
    /// referent's, planned where each was written.
    #[test]
    fn math_children_are_the_elements_own_else_its_referents() {
        let doc = load(document([
            el("testValue").name("v").attr("value", "5"),
            el("testShape").name("s").child(mac("v")).attr("b", "1"),
            el("testShape")
                .name("own")
                .attr("extend", mac("s"))
                .text("7"),
            el("testShape")
                .name("theirs")
                .attr("extend", mac("s"))
                .attr("b", "2"),
        ]))
        .unwrap();
        no_errors(&doc);
        assert_eq!(value(&doc, "s.a"), 5.0);
        assert_eq!((value(&doc, "own.a"), value(&doc, "own.b")), (7.0, 1.0));
        assert_eq!(
            (value(&doc, "theirs.a"), value(&doc, "theirs.b")),
            (5.0, 2.0)
        );
    }

    /// A group of element children: its members directly under the
    /// element or in a wrapper named as the group is; a copy with none of
    /// its own takes its referent's, and one with its own keeps them.
    #[test]
    fn group_members_are_the_elements_own_else_its_referents() {
        let grid = |dx: &str| el("constrainToGrid").attr("dx", dx).attr("dy", dx);
        let doc = load(document([
            el("graph").child(el("point").name("p").text("(1.2, 1.2)").child(grid("1"))),
            el("graph").child(
                el("point")
                    .name("q")
                    .text("(1.2, 1.2)")
                    .child(el("constraints").child(grid("2"))),
            ),
            el("graph").child(
                el("point")
                    .name("r")
                    .attr("extend", mac("q"))
                    .attr("y", "3.2"),
            ),
            el("graph").child(
                el("point")
                    .name("s")
                    .attr("extend", mac("q"))
                    .attr("y", "3.2")
                    .child(grid("1")),
            ),
        ]))
        .unwrap();
        no_errors(&doc);
        assert_eq!((value(&doc, "p.x"), value(&doc, "p.y")), (1.0, 1.0));
        assert_eq!((value(&doc, "q.x"), value(&doc, "q.y")), (2.0, 2.0));
        assert_eq!((value(&doc, "r.x"), value(&doc, "r.y")), (2.0, 4.0));
        assert_eq!((value(&doc, "s.x"), value(&doc, "s.y")), (1.0, 3.0));
    }

    /// An element child no group takes is refused.
    #[test]
    fn an_element_no_group_takes_is_refused() {
        let doc = load(document([el("graph").child(
            el("point")
                .name("p")
                .text("(1, 2)")
                .child(el("number").text("3")),
        )]))
        .unwrap();
        assert!(
            doc.diagnostics()
                .iter()
                .any(|d| d.kind == crate::DiagnosticKind::Error),
            "{:?}",
            doc.diagnostics()
        );
    }

    /// The merge, each part on its own: absent content and an empty group
    /// are the referent's, and what the element has is its own.
    #[test]
    fn the_merge_takes_each_part_the_element_lacks() {
        let member = |v: f64| Member {
            component_type: ComponentType::ConstrainToGrid,
            record: Record {
                values: vec![AttrValue::Literal(Ok(v))],
                own: vec![true],
                children: Children::default(),
                tag: String::new(),
            },
        };
        let record = |content: Content, members: Vec<Member>| Record {
            values: Vec::new(),
            own: Vec::new(),
            children: Children {
                content,
                groups: vec![members],
            },
            tag: String::new(),
        };
        let nodes = |n: u32| Content::Math(vec![NodeId::from_index(n as usize)].into());
        let theirs = record(nodes(1), vec![member(2.0)]);
        let merged = record(Content::Absent, Vec::new()).merged_over(&theirs);
        assert_eq!(merged.child_math().unwrap()[0], NodeId::from_index(1));
        assert_eq!(merged.group(0).len(), 1);
        let merged = record(nodes(3), vec![member(4.0), member(5.0)]).merged_over(&theirs);
        assert_eq!(merged.child_math().unwrap()[0], NodeId::from_index(3));
        assert_eq!(merged.group(0).len(), 2);
    }
}
