//! What each place wants (ADR 0076 §4): every attribute and the children
//! of every type, and the type of value that may arrive there.
//!
//! Most of it is a declaration made elsewhere, read here: an attribute that
//! gives a prop wants the prop's type ([`ComponentType::prop_type`]), and
//! an attribute's parse form ([`AttrKind`]) says whether it takes a value
//! or a literal read at load. [`OVERRIDES`] declares the places neither
//! says.

use super::{ComponentType, PropType};
use crate::components::{AttrKind, ChildrenKind, PropFrom};

/// A place a value arrives at on an element of a type.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum Place {
    /// The attribute of this name.
    Attr(&'static str),
    /// The element's children, as its `children:` declares them.
    Children,
    /// The element children of a group (`<award>`s of an `<answer>`).
    Group(&'static str),
}

/// What a place wants (ADR 0076 §4).
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum Want {
    /// A value of the type, which a reference may give: a point's `x` a
    /// number, `hide` a boolean. [`PropType::ByElement`] is a type the
    /// element decides (a list's entries by its `type`, a sort's by its
    /// items, one type across them, COLL-4).
    Value(PropType),
    /// A literal of the type, written in the source and read at load: a
    /// setting (`simplify`, `numVertices="5"`, `type="text"`), never a
    /// reference (TYPE-1).
    Literal(ComponentType),
    /// The type another place of the element wants (D54): an
    /// `<updateValue>`'s `newValue` its `target`'s.
    SameAs(Place),
    /// A component, not a value: what an action acts on, what presses an
    /// element (ADR 0040, ADR 0042); of one of these types, any when
    /// empty.
    Component(&'static [ComponentType]),
    /// Content a renderer shows: any component.
    Content,
    /// Nothing: an attribute accepted only to be refused, children read by
    /// nothing.
    Nothing,
}

use ComponentType as C;

/// The places whose want neither a prop nor an attribute's parse form
/// says.
pub const OVERRIDES: &[(ComponentType, Place, Want)] = &[
    // A value of the type of what it writes (D54).
    (
        C::UpdateValue,
        Place::Attr("newValue"),
        Want::SameAs(Place::Attr("target")),
    ),
    (C::UpdateValue, Place::Attr("target"), Want::Component(&[])),
    // `simplify="full"`, `expand`: a keyword, or on.
    (C::Math, Place::Attr("simplify"), Want::Literal(C::Text)),
    (C::Math, Place::Attr("expand"), Want::Literal(C::Text)),
];

impl ComponentType {
    /// Every place of the type: its attributes, its children unless it
    /// reads none, and its groups.
    pub fn places(self) -> Vec<Place> {
        let def = self.def();
        let mut places: Vec<Place> = def.attributes.iter().map(|a| Place::Attr(a.name)).collect();
        if def.children.kind != ChildrenKind::None {
            places.push(Place::Children);
        }
        places.extend(def.children.groups.iter().map(|g| Place::Group(g.name)));
        places
    }

    /// What `place` wants on an element of the type; `None` for a place the
    /// type does not have.
    pub fn wants(self, place: Place) -> Option<Want> {
        if let Some(&(_, _, want)) = OVERRIDES.iter().find(|(t, p, _)| *t == self && *p == place) {
            return Some(want);
        }
        let def = self.def();
        match place {
            Place::Attr(name) => {
                let kind = def.attributes.iter().find(|a| a.name == name)?.kind;
                Some(self.attr_wants(name, kind))
            }
            Place::Children => Some(match def.children.kind {
                ChildrenKind::None => Want::Nothing,
                ChildrenKind::Rendered => Want::Content,
                ChildrenKind::Value | ChildrenKind::Math => {
                    let given = def.props.iter().find(|p| p.from == PropFrom::Children);
                    let prop = given.map(|p| p.name).or(def.default_prop);
                    match prop.and_then(|p| self.prop_type(p)) {
                        Some(t) => Want::Value(t),
                        // What the element makes of them is its own (a
                        // function's pieces, an angle's measure).
                        None => Want::Value(PropType::ByElement),
                    }
                }
                ChildrenKind::List => Want::Value(match self.list() {
                    Some(list) => self
                        .prop_type(list.names.first().copied().unwrap_or(""))
                        .unwrap_or(PropType::ByElement),
                    None => PropType::ByElement,
                }),
            }),
            Place::Group(name) => {
                let group = def.children.groups.iter().find(|g| g.name == name)?;
                Some(Want::Component(group.types))
            }
        }
    }

    /// What the attribute `name`, of parse form `kind`, wants: the type of
    /// the prop it gives, where it gives one, else what its form takes.
    fn attr_wants(self, name: &'static str, kind: AttrKind) -> Want {
        use AttrKind as K;
        let literal = match kind {
            K::Bool { .. } | K::LiteralFlag | K::On => Some(C::Boolean),
            K::Number { .. } | K::Literal { .. } => Some(C::Number),
            K::Text => Some(C::Text),
            _ => None,
        };
        if let Some(t) = literal {
            return Want::Literal(t);
        }
        match kind {
            K::Written => return Want::Nothing,
            K::Component | K::After(_) => return Want::Component(&[]),
            _ => {}
        }
        // The prop it gives: one that reads it, one it binds, or the prop
        // of its name.
        let gives = self
            .prop_defs()
            .iter()
            .find(|p| p.attr == Some(name) || p.bind == Some(name))
            .map(|p| p.name)
            .or_else(|| self.prop_index(name).map(|_| name));
        if let Some(t) = gives.and_then(|p| self.prop_type(p)) {
            return Want::Value(t);
        }
        Want::Value(match kind {
            K::Flag { .. } => PropType::Is(C::Boolean),
            K::Point => PropType::Is(C::Point),
            K::Points { .. } => PropType::ListOf(C::Point),
            K::Scalars => PropType::ListOf(C::Number),
            K::Math => PropType::Is(C::Math),
            K::Scalar | K::Value => PropType::Is(C::Number),
            // A list's entries, a reference, a value as children are one:
            // of the type the element decides.
            _ => PropType::ByElement,
        })
    }
}
