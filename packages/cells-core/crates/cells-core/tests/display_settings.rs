//! A math's and a number's display settings (`displayDigits`, ...) are
//! props (ADR 0058): a literal is the number it means, a reference follows
//! what it names, and one not written is not given.

mod common;

use cells_core::testing::test_utils::load_unpruned;
use common::{set, type_into, v};

#[test]
fn a_setting_given_by_a_reference_follows_it() {
    let mut doc = load_unpruned(
        r#"<mathInput name="k" prefill="3" label="k"/><booleanInput name="pz" label="pz"/>
<math name="m" displayDigits="$k" padZeros="$pz">3.123456x</math>
<number name="n" displayDecimals="$k" displaySmallAsZero>1.23456</number>
<math name="lit" displayDigits="5" displayDecimals="1" padZeros avoidScientificNotation="false">2</math>
<math name="none">2</math>"#,
    )
    .unwrap();
    assert!(doc.diagnostics().is_empty(), "{:?}", doc.diagnostics());
    assert_eq!(v(&doc, "m", "displayDigits"), 3.0);
    assert_eq!(v(&doc, "m", "padZeros"), 0.0);
    assert_eq!(v(&doc, "n", "displayDecimals"), 3.0);
    assert_eq!(v(&doc, "n", "displaySmallAsZero"), 1e-14);
    type_into(&mut doc, "k", "5");
    set(&mut doc, "pz", "value", 1.0);
    assert_eq!(v(&doc, "m", "displayDigits"), 5.0);
    assert_eq!(v(&doc, "m", "padZeros"), 1.0);
    assert_eq!(v(&doc, "n", "displayDecimals"), 5.0);
    for (prop, value) in [
        ("displayDigits", 5.0),
        ("displayDecimals", 1.0),
        ("padZeros", 1.0),
        ("avoidScientificNotation", 0.0),
    ] {
        assert_eq!(v(&doc, "lit", prop), value, "{prop}");
    }
    // Not written: not given, which a reader takes from a referent or
    // the default.
    assert!(v(&doc, "none", "displayDigits").is_nan());
    assert!(v(&doc, "lit", "displayBlanks").is_nan());
}
