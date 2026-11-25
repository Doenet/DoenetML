//! The declarations agree with the flags they replace (ADR 0076, Migration
//! step 1), and [`fit`] gives REF-5's answers and ADR 0064's (step 2).

use super::*;
use crate::components::{EntryKind, PropAt, PropSel, ResponseKind, TextKind};
use ComponentType as C;

/// Every type an author can name: none the builder makes.
fn named() -> impl Iterator<Item = ComponentType> {
    ComponentType::ALL
        .iter()
        .copied()
        .filter(|t| !t.def().flags.internal)
}

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
/// is its measure (D69 decision 3), which `extends_as` refuses (ADR 0064's
/// probes).
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

/// The prop of `from` a fit reads: a stand-in's, else the bare reference's.
fn reads(f: Fit, from: ComponentType) -> Option<&'static str> {
    match f {
        Fit::StandsIn { prop, .. } => Some(prop),
        Fit::Same | Fit::Converts(_) => from.default_prop(),
        Fit::Mismatch => None,
    }
}

/// Every extend today's flags allow, `fit` allows, reading the same prop;
/// every input today's flags refuse to make from a value, `fit` refuses.
#[test]
fn fit_allows_every_extend_the_flags_allow() {
    for from in named() {
        for to in named() {
            let (Some(have), Some(want)) = (AuthorType::of(from), AuthorType::of(to)) else {
                continue;
            };
            let f = fit(have, want);
            if ComponentType::extends_as(from, to) {
                assert_ne!(f, Fit::Mismatch, "<{to:?} extend> of a {from:?}");
            }
            if let Some(prop) = ComponentType::extend_reads(from, to) {
                assert_eq!(reads(f, from), Some(prop), "<{to:?} extend> of a {from:?}");
            }
            if ComponentType::input_from_value(from, to) {
                assert_eq!(f, Fit::Mismatch, "<{to:?} extend> of a {from:?}");
            }
        }
    }
}
