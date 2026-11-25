//! The declarations agree with the flags they replace (ADR 0076, Migration
//! step 1), and [`fit`] gives REF-5's answers and ADR 0064's (step 2).

use super::*;
use crate::components::{ChildrenKind, EntryKind, PropAt, PropSel, ResponseKind, TextKind};
use ComponentType as C;

fn tag(t: ComponentType) -> AuthorType {
    AuthorType::Tag(t)
}

fn converts(from: ComponentType, to: ComponentType, backward: bool) -> Conversion {
    Conversion {
        from: tag(from),
        to: tag(to),
        backward,
    }
}

// --- Step 1: the declarations agree with today's flags. ---

#[test]
fn a_stand_in_reads_a_prop_the_type_has() {
    for &t in ComponentType::ALL {
        if let Some(s) = t.typing().and_then(|x| x.stands_in) {
            assert!(
                t.prop_index(s.prop()).is_some(),
                "{t:?} stands in as `{}`, which it does not have",
                s.prop()
            );
        }
    }
}

/// Types that stand in as a value where today's flags read none: an angle
/// is its measure (D69 decision 3), which the core refused to extend as a
/// number (ADR 0064's probes).
const NEW_STAND_INS: &[ComponentType] = &[C::Angle];

/// `reads_as` is the type a stand-in gives, and a type that *is* its value
/// reads as it.
#[test]
fn a_stand_in_is_what_reads_as_says() {
    for &t in ComponentType::ALL {
        match t.type_decl() {
            TypeDecl::Named(typing) => match (typing.stands_in, t.reads_as()) {
                (Some(s), Some(r)) => assert_eq!(s.ty(), r, "{t:?}"),
                (Some(StandsIn::IsItsValue { .. }), None) => assert!(
                    NEW_STAND_INS.contains(&t),
                    "{t:?} is its value, but reads as nothing"
                ),
                (None, Some(r)) => panic!("{t:?} reads as {r:?}, but stands in as nothing"),
                (Some(StandsIn::Shows { .. }) | None, None) => {}
            },
            TypeDecl::Presents(other) => {
                // A list over a math value reads as that value (ADR 0063):
                // a refinement of the list it presents.
                let over_value = t.is_over_value();
                assert!(
                    over_value || t.reads_as() == other.reads_as(),
                    "{t:?} presents {other:?} but reads as {:?}",
                    t.reads_as()
                );
            }
            TypeDecl::ListOf(_) | TypeDecl::ByElement => {
                assert_eq!(t.reads_as(), None, "{t:?}")
            }
        }
    }
}

/// Whether an entry of type `entry` is held as `kind` says.
fn entry_agrees(entry: ComponentType, kind: EntryKind) -> bool {
    match kind {
        EntryKind::Number => is_a(entry, C::Number),
        EntryKind::Text => is_a(entry, C::Text),
        EntryKind::Boolean => is_a(entry, C::Boolean),
        EntryKind::Math => is_a(entry, C::Math),
        EntryKind::Point => is_a(entry, C::Point),
        EntryKind::Any => false,
    }
}

#[test]
fn a_list_of_t_holds_entries_of_t() {
    for &t in ComponentType::ALL {
        let decl = t.type_decl();
        if let TypeDecl::ListOf(entry) = decl {
            let kind = t.list_entry();
            assert!(
                kind.is_some_and(|k| entry_agrees(entry, k)),
                "{t:?} is a list of {entry:?}, but its entries are {kind:?}"
            );
        }
        // Entries of whatever the operands hold are typed by the element.
        if t.list_entry() == Some(EntryKind::Any) {
            assert_eq!(decl, TypeDecl::ByElement, "{t:?}");
        }
        // A type whose bare reference is its list is a list.
        if t.default_sel() == Some(PropSel::At(PropAt::List)) {
            assert!(
                matches!(
                    decl,
                    TypeDecl::ListOf(_) | TypeDecl::Presents(_) | TypeDecl::ByElement
                ),
                "{t:?} reads as its list, but is declared {decl:?}"
            );
        }
    }
}

/// What an answer's response reads of an input is what the input stands
/// in as.
#[test]
fn a_response_reads_what_the_input_is() {
    for &t in ComponentType::ALL {
        let Some(response) = t.response() else {
            continue;
        };
        let stands_in = AuthorType::of(t)
            .and_then(|a| match a {
                AuthorType::Tag(x) => x.typing(),
                _ => None,
            })
            .and_then(|x| x.stands_in);
        let want = match response {
            ResponseKind::Math(_) => Some(C::Math),
            ResponseKind::Boolean(_) => Some(C::Boolean),
            ResponseKind::Text(_) => Some(C::Text),
            // A choice's index: what a choice input is follows its choices
            // (D45 decision 2), from the element.
            ResponseKind::Index(_) => None,
        };
        assert_eq!(stands_in.map(StandsIn::ty), want, "{t:?}");
    }
}

/// The type of a value type is the kind of value its text shows; a type
/// whose text shows its bare reference's value is a value, is its value, or
/// presents one that is.
#[test]
fn a_value_shows_in_text_as_its_type() {
    for &t in ComponentType::ALL {
        let text = t.text_kind();
        let typing = t.typing();
        if let Some(typing) = typing
            && typing.kind == TypeKind::Value
        {
            let agrees = match text {
                Some(TextKind::Number(_) | TextKind::Grouped(_)) => is_a(t, C::Number),
                Some(TextKind::Text(_)) => is_a(t, C::Text),
                Some(TextKind::Boolean(_)) => is_a(t, C::Boolean),
                Some(TextKind::Math(..) | TextKind::Held(_)) => is_a(t, C::Math),
                // A `<when>` is read by its award, never shown; a
                // `<clampNumber>` declares no text of its own yet.
                None => matches!(t, C::When | C::ClampNumber),
                Some(_) => false,
            };
            assert!(agrees, "{t:?} is a value, but shows in text as {text:?}");
        }
        let shown = match text {
            Some(
                TextKind::Number(v)
                | TextKind::Grouped(v)
                | TextKind::Text(v)
                | TextKind::Boolean(v)
                | TextKind::Held(v)
                | TextKind::Math(_, v),
            ) => Some(v),
            _ => None,
        };
        let default = t.default_prop().and_then(|d| t.prop_index(d));
        if shown.is_some() && shown == default {
            let is_value = match t.type_decl() {
                TypeDecl::Named(x) => {
                    x.kind == TypeKind::Value
                        || matches!(x.stands_in, Some(StandsIn::IsItsValue { .. }))
                }
                TypeDecl::Presents(_) => true,
                _ => false,
            };
            assert!(is_value, "{t:?} shows its value in text, but is not one");
        }
    }
}

/// Content has no value of its own, unless it shows one.
#[test]
fn content_has_no_value_but_one_it_shows() {
    for &t in ComponentType::ALL {
        let Some(typing) = t.typing() else { continue };
        if typing.kind != TypeKind::Content {
            continue;
        }
        let shown = match typing.stands_in {
            Some(StandsIn::Shows { prop, .. }) => Some(prop),
            _ => None,
        };
        assert_eq!(t.default_prop(), shown, "{t:?}");
    }
}

/// A type typed by its element is structure, has entries by a literal
/// `type` or by its operands, or is an answer's response.
#[test]
fn a_type_by_element_is_one_the_tag_cannot_type() {
    for &t in ComponentType::ALL {
        if t.type_decl() == TypeDecl::ByElement {
            assert!(
                t.structure_kind().is_some()
                    || t.entries_by_type()
                    || t.list_entry() == Some(EntryKind::Any)
                    || t == C::Response,
                "{t:?}"
            );
        }
    }
}

// --- Step 2: `fit`. ---

#[test]
fn author_types_of_tags() {
    assert_eq!(AuthorType::of(C::Integer), Some(tag(C::Integer)));
    assert_eq!(
        AuthorType::of(C::NumberList),
        Some(AuthorType::List(C::Number))
    );
    assert_eq!(
        AuthorType::of(C::OverValueMathList),
        Some(AuthorType::List(C::Math))
    );
    // A math the core holds as a tuple is a math (ADR 0064 §1).
    assert_eq!(AuthorType::of(C::Tuple), Some(tag(C::Math)));
    assert_eq!(
        AuthorType::of(C::BoundMatrixInput),
        Some(tag(C::MatrixInput))
    );
    assert_eq!(AuthorType::of(C::Group), None);
    assert_eq!(AuthorType::of(C::Sequence), None);
}

#[test]
fn is_a_is_transitive_and_content_is_one_type() {
    assert!(is_a(C::Integer, C::Number));
    assert!(is_a(C::Integer, C::Math));
    assert!(is_a(C::IntComma, C::Math));
    assert!(is_a(C::Triangle, C::Polygon));
    assert!(is_a(C::P, C::Section));
    assert!(!is_a(C::Math, C::Number));
    assert!(!is_a(C::Polygon, C::Triangle));
    assert!(!is_a(C::P, C::Text));
}

/// REF-5's pairs among the values (ADR 0064 §3): math, number and text
/// among each other, text from a boolean, and no other pair with a
/// boolean.
#[test]
fn values_convert_as_ref5_pairs_them() {
    assert_eq!(fit(tag(C::Number), tag(C::Math)), Fit::Same);
    assert_eq!(fit(tag(C::Integer), tag(C::Number)), Fit::Same);
    assert_eq!(
        fit(tag(C::Math), tag(C::Number)),
        Fit::Converts(converts(C::Math, C::Number, true))
    );
    for from in [C::Number, C::Math, C::Boolean] {
        assert!(
            matches!(fit(tag(from), tag(C::Text)), Fit::Converts(c) if !c.backward),
            "{from:?} to a text"
        );
    }
    // *is a* free at the start: an integer shows as a number does.
    assert_eq!(
        fit(tag(C::Integer), tag(C::Text)),
        Fit::Converts(converts(C::Number, C::Text, false))
    );
    assert_eq!(
        fit(tag(C::Text), tag(C::Number)),
        Fit::Converts(converts(C::Text, C::Number, false))
    );
    assert_eq!(
        fit(tag(C::Text), tag(C::Math)),
        Fit::Converts(converts(C::Text, C::Math, false))
    );
    // D47, D68: a boolean and a number, a text and a boolean.
    for (a, b) in [
        (C::Boolean, C::Number),
        (C::Boolean, C::Math),
        (C::Number, C::Boolean),
        (C::Math, C::Boolean),
        (C::Text, C::Boolean),
        (C::Integer, C::Boolean),
    ] {
        assert_eq!(fit(tag(a), tag(b)), Fit::Mismatch, "{a:?} to {b:?}");
    }
    // No conversion is made from one that is not declared.
    assert_eq!(fit(tag(C::Number), tag(C::Integer)), Fit::Mismatch);
}

/// Point and vector among each other, and each with a math, entries to
/// entries, both ways.
#[test]
fn points_vectors_and_maths_convert_both_ways() {
    for (a, b) in [
        (C::Point, C::Vector),
        (C::Vector, C::Point),
        (C::Point, C::Math),
        (C::Vector, C::Math),
        (C::Math, C::Point),
        (C::Math, C::Vector),
    ] {
        assert_eq!(
            fit(tag(a), tag(b)),
            Fit::Converts(converts(a, b, true)),
            "{a:?} to {b:?}"
        );
    }
    // A number is a math, so it makes a point as a math does.
    assert_eq!(
        fit(tag(C::Number), tag(C::Point)),
        Fit::Converts(converts(C::Math, C::Point, true))
    );
    assert_eq!(
        fit(tag(C::Endpoint), tag(C::Vector)),
        Fit::Converts(converts(C::Point, C::Vector, true))
    );
    // A conversion never follows a conversion.
    assert_eq!(fit(tag(C::Point), tag(C::Number)), Fit::Mismatch);
    assert_eq!(fit(tag(C::Point), tag(C::Text)), Fit::Mismatch);
    assert_eq!(fit(tag(C::Text), tag(C::Point)), Fit::Mismatch);
}

/// An input is its value, and converts as its value does; a value is never
/// made into an input (`doenet-e0062`).
#[test]
fn an_input_stands_in_as_its_value() {
    let value = |then| Fit::StandsIn {
        prop: "value",
        then,
    };
    assert_eq!(fit(tag(C::MathInput), tag(C::Math)), value(None));
    assert_eq!(fit(tag(C::NumberInput), tag(C::Math)), value(None));
    assert_eq!(fit(tag(C::Slider), tag(C::Number)), value(None));
    assert_eq!(fit(tag(C::BooleanInput), tag(C::Boolean)), value(None));
    assert_eq!(
        fit(tag(C::MathInput), tag(C::Number)),
        value(Some(converts(C::Math, C::Number, true)))
    );
    assert_eq!(
        fit(tag(C::MathInput), tag(C::Point)),
        value(Some(converts(C::Math, C::Point, true)))
    );
    assert_eq!(
        fit(tag(C::Slider), tag(C::Text)),
        value(Some(converts(C::Number, C::Text, false)))
    );
    assert_eq!(fit(tag(C::BooleanInput), tag(C::Number)), Fit::Mismatch);
    for (from, to) in [
        (C::Math, C::MathInput),
        (C::Number, C::NumberInput),
        (C::Number, C::Slider),
        (C::Text, C::TextInput),
        (C::Boolean, C::BooleanInput),
    ] {
        assert_eq!(fit(tag(from), tag(to)), Fit::Mismatch, "{from:?} to {to:?}");
    }
}

/// An angle is its measure (D69 decision 3); a label has a value to show,
/// and nothing further.
#[test]
fn a_shown_value_converts_no_further() {
    let measure = |then| Fit::StandsIn {
        prop: "radians",
        then,
    };
    assert_eq!(fit(tag(C::Angle), tag(C::Math)), measure(None));
    assert_eq!(
        fit(tag(C::Angle), tag(C::Number)),
        measure(Some(converts(C::Math, C::Number, true)))
    );
    assert_eq!(
        fit(tag(C::Angle), tag(C::Text)),
        measure(Some(converts(C::Math, C::Text, false)))
    );
    assert_eq!(
        fit(tag(C::Label), tag(C::Text)),
        Fit::StandsIn {
            prop: "value",
            then: None
        }
    );
    assert_eq!(fit(tag(C::Label), tag(C::Number)), Fit::Mismatch);
    // Content is no value (`doenet-e0063`: use `$p.text`).
    assert_eq!(fit(tag(C::P), tag(C::Text)), Fit::Mismatch);
    assert_eq!(fit(tag(C::P), tag(C::Section)), Fit::Same);
}

#[test]
fn lists_tuples_and_a_list_from_its_scalar() {
    let list = AuthorType::List;
    assert_eq!(fit(list(C::Number), list(C::Math)), Fit::Same);
    assert_eq!(fit(list(C::Integer), list(C::Number)), Fit::Same);
    assert_eq!(fit(list(C::Math), list(C::Number)), Fit::Mismatch);
    assert_eq!(fit(list(C::Number), tag(C::Number)), Fit::Mismatch);
    assert_eq!(
        fit(tag(C::Number), list(C::Math)),
        Fit::Converts(Conversion {
            from: tag(C::Number),
            to: list(C::Math),
            backward: true,
        })
    );
    assert_eq!(
        fit(tag(C::MathInput), list(C::Math)),
        Fit::StandsIn {
            prop: "value",
            then: Some(Conversion {
                from: tag(C::Math),
                to: list(C::Math),
                backward: true,
            }),
        }
    );
    assert_eq!(fit(tag(C::Text), list(C::Number)), Fit::Mismatch);
    // A tuple whose positions agree is a list.
    assert_eq!(
        fit(AuthorType::Tuple(&[C::Number, C::Integer]), list(C::Number)),
        Fit::Mismatch
    );
    assert_eq!(
        fit(AuthorType::Tuple(&[C::Number, C::Number]), list(C::Math)),
        Fit::Same
    );
    assert_eq!(
        fit(
            AuthorType::Tuple(&[C::Number, C::Text]),
            AuthorType::Tuple(&[C::Math, C::Text])
        ),
        Fit::Same
    );
    assert_eq!(
        fit(
            AuthorType::Tuple(&[C::Math, C::Text]),
            AuthorType::Tuple(&[C::Number, C::Text])
        ),
        Fit::Mismatch
    );
    assert_eq!(
        fit(
            AuthorType::Tuple(&[C::Math, C::Text]),
            AuthorType::Tuple(&[C::Math])
        ),
        Fit::Mismatch
    );
}

// --- Step 1: each prop's type agrees with today's flags. ---

/// Every name `$x.name` reads on a type: its single-cell props, its
/// combined props and its list's names.
fn prop_names(t: ComponentType) -> Vec<&'static str> {
    let def = t.def();
    let mut names: Vec<&'static str> = t.prop_defs().iter().map(|p| p.name).collect();
    names.extend(def.combined_props.iter().map(|(n, _)| *n));
    if let Some(list) = t.list() {
        names.extend(list.names.iter().copied());
        names.extend(list.sequences.iter().copied());
    }
    names
}

/// `t` is the value type `want`, or a type that *is a* it.
fn is(t: Option<PropType>, want: ComponentType) -> bool {
    matches!(t, Some(PropType::Is(x)) if is_a(x, want)) || t == Some(PropType::ByElement)
}

#[test]
fn every_prop_has_a_type() {
    let mut missing = Vec::new();
    for &t in ComponentType::ALL {
        for name in prop_names(t) {
            if t.prop_type(name).is_none() {
                missing.push(format!("{t:?}.{name}"));
            }
        }
    }
    assert!(missing.is_empty(), "no type declared: {missing:?}");
}

/// A type declares only names it has, and none [`COMMON`] already says.
#[test]
fn a_types_declarations_are_its_own() {
    let mut wrong = Vec::new();
    for &t in ComponentType::ALL {
        let names = prop_names(t);
        for &(name, ty) in t.declared_props() {
            if !names.contains(&name) {
                wrong.push(format!("{t:?} declares `{name}`, which it does not have"));
            }
            if COMMON.contains(&(name, ty)) {
                wrong.push(format!("{t:?} declares `{name}` as COMMON does"));
            }
        }
    }
    assert!(wrong.is_empty(), "{}", wrong.join("\n"));
}

#[test]
fn an_items_type_is_its_lists_entry() {
    assert_eq!(
        C::Polygon.prop_type("vertex2"),
        Some(PropType::Is(C::Point))
    );
    assert_eq!(
        C::NumberList.prop_type("number3"),
        Some(PropType::Is(C::Number))
    );
    assert_eq!(
        C::NumberList.prop_type("values"),
        Some(PropType::ListOf(C::Number))
    );
    assert_eq!(C::Sort.prop_type("values"), Some(PropType::ByElement));
    assert_eq!(C::Line.prop_type("point1"), Some(PropType::Is(C::Point)));
    assert_eq!(C::Polygon.prop_type("vertex"), None);
}

/// A prop held as text is a text; one that stands for an expression is a
/// math; a list's length is an integer; one an on/off attribute gives is
/// a boolean.
#[test]
fn a_props_type_agrees_with_how_it_is_held() {
    use crate::components::{AttrKind, PropFrom};
    for &t in ComponentType::ALL {
        for (i, p) in t.prop_defs().iter().enumerate() {
            let ty = t.prop_type(p.name);
            let at = format!("{t:?}.{} is {ty:?}", p.name);
            if p.text {
                assert!(is(ty, C::Text), "{at}, held as text");
            }
            if t.expr_of(i).is_some() {
                assert!(is(ty, C::Math), "{at}, an expression prop");
            }
            if p.boolean {
                assert!(is(ty, C::Boolean), "{at}, held as a boolean");
            }
            if p.from == PropFrom::ListLen {
                assert_eq!(ty, Some(PropType::Is(C::Integer)), "{at}, a list's length");
            }
            let attr = p.attr.unwrap_or(p.name);
            let on_off = t.def().attributes.iter().any(|a| {
                a.name == attr
                    && matches!(
                        a.kind,
                        AttrKind::Flag { .. } | AttrKind::Bool { .. } | AttrKind::LiteralFlag
                    )
            });
            if on_off {
                assert_eq!(
                    ty,
                    Some(PropType::Is(C::Boolean)),
                    "{at}, an on/off attribute"
                );
            }
        }
    }
}

/// The props a type's text shows, and an answer's response reads, are of
/// the kind they are shown or read as.
#[test]
fn shown_and_read_props_are_their_kind() {
    for &t in ComponentType::ALL {
        let of = |pi: usize| t.prop_type(t.prop_defs()[pi].name);
        let shown: Vec<(usize, ComponentType)> = match t.text_kind() {
            Some(TextKind::Number(v) | TextKind::Grouped(v)) => vec![(v, C::Number)],
            Some(TextKind::Text(v)) => vec![(v, C::Text)],
            Some(TextKind::Boolean(v)) => vec![(v, C::Boolean)],
            Some(TextKind::Math(e, v)) => vec![(e, C::Math), (v, C::Math)],
            Some(TextKind::Held(v)) => vec![(v, C::Math)],
            Some(TextKind::Pair(x, y)) => vec![(x, C::Number), (y, C::Number)],
            Some(TextKind::Tuple(n, _)) => vec![(n, C::Integer)],
            _ => vec![],
        };
        for (pi, want) in shown {
            assert!(is(of(pi), want), "{t:?} shows {:?} as a {want:?}", of(pi));
        }
        let read = match t.response() {
            Some(ResponseKind::Math(pi)) => Some((pi, C::Math)),
            Some(ResponseKind::Boolean(pi)) => Some((pi, C::Boolean)),
            Some(ResponseKind::Text(pi)) => Some((pi, C::Text)),
            Some(ResponseKind::Index(pi)) => Some((pi, C::Integer)),
            None => None,
        };
        if let Some((pi, want)) = read {
            assert!(
                is(of(pi), want),
                "a response reads {t:?}'s {:?} as a {want:?}",
                of(pi)
            );
        }
    }
}

/// The nearest of the five value types `t` *is a*.
fn value_base(t: ComponentType) -> Option<ComponentType> {
    supertypes(t)
        .into_iter()
        .find(|s| matches!(s, C::Integer | C::Number | C::Math | C::Text | C::Boolean))
}

/// A bare reference reads a prop of the element's own type: a value's is
/// its value type, an input's or an angle's what it stands in as, a list's
/// its list.
#[test]
fn a_bare_reference_reads_a_prop_of_the_elements_type() {
    for &t in ComponentType::ALL {
        let Some(default) = t.default_prop() else {
            continue;
        };
        let have = t.prop_type(default);
        let want = match t.type_decl() {
            TypeDecl::Named(x) => match x.stands_in {
                Some(s) => Some(PropType::Is(s.ty())),
                None if x.kind == TypeKind::Value => value_base(t).map(PropType::Is),
                // An object's bare reference is a prop of its own (a
                // point's coordinates, a function's expression).
                None => None,
            },
            TypeDecl::ListOf(entry) => Some(PropType::ListOf(entry)),
            TypeDecl::ByElement => Some(PropType::ByElement),
            // A list over a math value reads as the value (ADR 0063).
            TypeDecl::Presents(_) => None,
        };
        if let Some(want) = want {
            assert_eq!(have, Some(want), "{t:?}'s bare reference `{default}`");
        }
    }
}

// --- Step 1: what each place wants. ---

#[test]
fn every_place_wants_something() {
    for &t in ComponentType::ALL {
        for place in t.places() {
            assert!(t.wants(place).is_some(), "{t:?}'s {place:?}");
        }
    }
    for &(t, place, want) in OVERRIDES {
        assert!(
            t.places().contains(&place),
            "{t:?} has no {place:?} to override"
        );
        if let Want::SameAs(other) = want {
            assert!(
                t.places().contains(&other),
                "{t:?}'s {place:?} names {other:?}"
            );
        }
    }
}

/// An on/off attribute wants a boolean, a point attribute a point, a list
/// of points a list of them, whatever prop it gives.
#[test]
fn a_places_want_agrees_with_its_parse_form() {
    use crate::components::AttrKind as K;
    for &t in ComponentType::ALL {
        for a in t.def().attributes {
            let want = t.wants(Place::Attr(a.name));
            let at = format!("{t:?}'s `{}` ({:?}) wants {want:?}", a.name, a.kind);
            let value = |w: Option<Want>, f: &dyn Fn(PropType) -> bool| matches!(w, Some(Want::Value(p)) if f(p));
            match a.kind {
                K::Flag { .. } => {
                    assert_eq!(want, Some(Want::Value(PropType::Is(C::Boolean))), "{at}")
                }
                K::Point => assert!(
                    value(want, &|p| is(Some(p), C::Point)
                        || p == PropType::Is(C::Math)),
                    "{at}"
                ),
                K::Points { .. } => assert!(
                    value(want, &|p| p == PropType::ListOf(C::Point)
                        || p == PropType::ByElement),
                    "{at}"
                ),
                K::Bool { .. } | K::LiteralFlag => {
                    assert_eq!(want, Some(Want::Literal(C::Boolean)), "{at}")
                }
                K::Text => assert_eq!(want, Some(Want::Literal(C::Text)), "{at}"),
                _ => {}
            }
        }
    }
}

/// A value's children, where it reads them as a value, want a value of one
/// of the five value types.
#[test]
fn a_values_children_want_a_value() {
    for &t in ComponentType::ALL {
        let Some(typing) = t.typing() else { continue };
        let reads = matches!(
            t.def().children.kind,
            ChildrenKind::Value | ChildrenKind::Math
        );
        if typing.kind != TypeKind::Value || !reads {
            continue;
        }
        let want = t.wants(Place::Children);
        assert!(
            matches!(want, Some(Want::Value(PropType::Is(v))) if value_base(v) == Some(v))
                || matches!(want, Some(Want::Value(PropType::ByElement))),
            "{t:?}'s children want {want:?}"
        );
    }
}

#[test]
fn some_places_and_what_they_want() {
    use PropType::*;
    let wants = |t: ComponentType, p| t.wants(p).unwrap();
    assert_eq!(
        wants(C::Number, Place::Children),
        Want::Value(Is(C::Number))
    );
    assert_eq!(
        wants(C::Boolean, Place::Children),
        Want::Value(Is(C::Boolean))
    );
    assert_eq!(wants(C::Point, Place::Children), Want::Value(Is(C::Point)));
    assert_eq!(
        wants(C::NumberList, Place::Children),
        Want::Value(ListOf(C::Number))
    );
    assert_eq!(wants(C::Sort, Place::Children), Want::Value(ByElement));
    assert_eq!(wants(C::P, Place::Children), Want::Content);
    assert_eq!(
        wants(C::Point, Place::Attr("x")),
        Want::Value(Is(C::Number))
    );
    assert_eq!(
        wants(C::Point, Place::Attr("hide")),
        Want::Value(Is(C::Boolean))
    );
    assert_eq!(
        wants(C::MathInput, Place::Attr("prefill")),
        Want::Value(Is(C::Math))
    );
    assert_eq!(
        wants(C::MathInput, Place::Attr("bindValueTo")),
        Want::Value(Is(C::Math))
    );
    assert_eq!(
        wants(C::Polygon, Place::Attr("vertices")),
        Want::Value(ListOf(C::Point))
    );
    assert_eq!(
        wants(C::UpdateValue, Place::Attr("newValue")),
        Want::SameAs(Place::Attr("target"))
    );
    assert_eq!(C::Number.wants(Place::Attr("nope")), None);
}

#[test]
fn the_export_holds_every_type() {
    let all = export();
    let n = all["types"].as_object().unwrap().len() + all["internal"].as_object().unwrap().len();
    assert_eq!(n, ComponentType::ALL.len());
    let math = &all["types"]["math"];
    assert_eq!(math["type"]["kind"], "value");
    assert_eq!(math["props"]["value"], serde_json::json!({ "is": "math" }));
    assert_eq!(
        all["types"]["mathInput"]["type"]["standsIn"],
        serde_json::json!({ "prop": "value", "as": "math", "form": "isItsValue" })
    );
    assert_eq!(
        all["types"]["numberList"]["props"]["numbers"],
        serde_json::json!({ "listOf": "number" })
    );
    assert!(all["internal"]["BoundMatrixInput"].is_object());
}

#[test]
fn a_value_at_a_place_fits_as_the_place_wants() {
    use PropType::*;
    let at = |t: ComponentType, p| t.wants(p).unwrap();
    // `hide="$n"`: a number where a boolean is wanted (D47).
    assert_eq!(
        at(C::Point, Place::Attr("hide")).fit(Is(C::Number)),
        Some(Fit::Mismatch)
    );
    assert_eq!(
        at(C::Point, Place::Attr("hide")).fit(Is(C::Boolean)),
        Some(Fit::Same)
    );
    // `<number>$m</number>`: a math converts.
    assert!(matches!(
        at(C::Number, Place::Children).fit(Is(C::Math)),
        Some(Fit::Converts(_))
    ));
    // `<boolean>$n</boolean>`.
    assert_eq!(
        at(C::Boolean, Place::Children).fit(Is(C::Number)),
        Some(Fit::Mismatch)
    );
    // A list from its scalar.
    assert!(matches!(
        at(C::NumberList, Place::Children).fit(Is(C::Integer)),
        Some(Fit::Converts(_))
    ));
    // A literal takes no reference; a type the element decides is not
    // judged here.
    assert_eq!(at(C::Point, Place::Attr("hide")).fit(Code), None);
    assert_eq!(at(C::Sort, Place::Children).fit(Is(C::Number)), None);
}
