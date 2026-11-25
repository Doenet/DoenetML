//! The declarations as data (ADR 0076 §7): every type's kind, relations,
//! props and places, for a reader outside the core (the schema, the
//! language server).

use serde_json::{Value, json};

use super::{
    AuthorType, ComponentType, Converts, Place, PropType, StandsIn, TypeDecl, Typing, Want,
};

/// A component type by its first tag, as an author writes it.
fn tag(t: ComponentType) -> Value {
    json!(t.tag())
}

fn prop_type(t: PropType) -> Value {
    match t {
        PropType::Is(x) => json!({ "is": tag(x) }),
        PropType::ListOf(x) => json!({ "listOf": tag(x) }),
        PropType::ByElement => json!("byElement"),
        PropType::Code => json!("code"),
    }
}

fn author_type(a: AuthorType) -> Value {
    match a {
        AuthorType::Tag(x) => json!({ "is": tag(x) }),
        AuthorType::List(x) => json!({ "listOf": tag(x) }),
        AuthorType::Tuple(xs) => json!({ "tuple": xs.iter().map(|&x| tag(x)).collect::<Vec<_>>() }),
    }
}

fn place(p: Place) -> Value {
    match p {
        Place::Attr(name) => json!({ "attribute": name }),
        Place::Children => json!("children"),
        Place::Group(name) => json!({ "group": name }),
    }
}

fn want(w: Want) -> Value {
    match w {
        Want::Value(t) => json!({ "value": prop_type(t) }),
        Want::Literal(t) => json!({ "literal": tag(t) }),
        Want::SameAs(p) => json!({ "sameAs": place(p) }),
        Want::Component(types) => {
            json!({ "component": types.iter().map(|&t| tag(t)).collect::<Vec<_>>() })
        }
        Want::Content => json!("content"),
        Want::Nothing => json!("nothing"),
    }
}

fn typing(t: Typing) -> Value {
    let stands_in = t.stands_in.map(|s| {
        let form = match s {
            StandsIn::IsItsValue { .. } => "isItsValue",
            StandsIn::Shows { .. } => "shows",
        };
        json!({ "prop": s.prop(), "as": tag(s.ty()), "form": form })
    });
    let converts: Vec<Value> = t
        .converts_to
        .iter()
        .map(|&Converts { to, backward }| json!({ "to": tag(to), "backward": backward }))
        .collect();
    json!({
        "kind": format!("{:?}", t.kind).to_lowercase(),
        "isA": t.is_a.iter().map(|&x| tag(x)).collect::<Vec<_>>(),
        "standsIn": stands_in,
        "convertsTo": converts,
    })
}

/// One type's declarations: what it is, each prop's type and what each
/// place wants.
fn one(t: ComponentType) -> Value {
    let decl = match t.type_decl() {
        TypeDecl::Named(x) => typing(x),
        TypeDecl::ListOf(x) => json!({ "listOf": tag(x) }),
        TypeDecl::Presents(x) => json!({ "presents": tag(x) }),
        TypeDecl::ByElement => json!("byElement"),
    };
    let def = t.def();
    let mut names: Vec<&str> = t.prop_defs().iter().map(|p| p.name).collect();
    names.extend(def.combined_props.iter().map(|(n, _)| *n));
    if let Some(list) = t.list() {
        names.extend(list.names.iter().copied());
        names.extend(list.sequences.iter().copied());
    }
    let props: serde_json::Map<String, Value> = names
        .into_iter()
        .filter_map(|n| Some((n.to_string(), prop_type(t.prop_type(n)?))))
        .collect();
    let places: Vec<Value> = t
        .places()
        .into_iter()
        .filter_map(|p| Some(json!({ "place": place(p), "wants": want(t.wants(p)?) })))
        .collect();
    json!({
        "tags": def.tags,
        "internal": def.flags.internal,
        "type": decl,
        "authorType": AuthorType::of(t).map(author_type),
        "props": props,
        "places": places,
    })
}

/// Every type's declarations, under `types` by its first tag. A type
/// whose tag an earlier type already has (an internal type and the one it
/// presents: a bound matrix input, a list over a math value) is under
/// `internal`, by its name in the core.
pub fn export() -> Value {
    let mut types = serde_json::Map::new();
    let mut internal = serde_json::Map::new();
    for &t in ComponentType::ALL {
        if types.contains_key(t.tag()) {
            internal.insert(format!("{t:?}"), one(t));
        } else {
            types.insert(t.tag().to_string(), one(t));
        }
    }
    json!({ "types": types, "internal": internal })
}
