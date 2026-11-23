//! How an award compares values with entries (ADR 0041, decision 7):
//! `matchPartial` gives the fraction of entries that match,
//! `unorderedCompare` matches them in any order, `matchByExactPositions`
//! only where they stand, and a math written `unordered` alone on a side
//! makes its comparison unordered. The flags are the comparison's, never
//! the value's (`matchPartial.test.ts`). Lists here: a `<math>` written
//! `(1,2,3)` is a tuple component, one cell per entry, until point, tuple
//! and vector merge (ADR 0041, step 5).

mod common;

use cells_core::Document;
use cells_core::testing::test_utils::load;
use common::type_into;

const DOC: &str = r#"
  <setup>
    <math name="ordered">1,2,3</math>
    <math name="unordered" unordered>1,2,3</math>
  </setup>
  <mathInput name="resp" />
  <answer name="ansP"><award matchPartial><when>$resp=$ordered</when></award></answer>
  <answer name="ansPEP"><award matchPartial matchByExactPositions><when>$resp=$ordered</when></award></answer>
  <answer name="ansPU"><award matchPartial><when>$resp=$unordered</when></award></answer>
  <answer name="ansS"><award><when>$resp=$ordered</when></award></answer>
  <answer name="ansU"><award><when>$resp=$unordered</when></award></answer>
  <answer name="ansUA" unorderedCompare><award matchPartial><when>$resp=1,2,3</when></award></answer>"#;

const ANSWERS: [&str; 6] = ["ansP", "ansPEP", "ansPU", "ansS", "ansU", "ansUA"];

fn credits(doc: &mut Document, response: &str) -> Vec<f64> {
    type_into(doc, "resp", response);
    ANSWERS
        .iter()
        .map(|a| {
            let c = doc.resolve_path(a).unwrap();
            doc.submit(c);
            doc.value(a, "credit").unwrap()
        })
        .collect()
}

#[test]
fn entries_match_partly_in_order_or_in_any_order() {
    let mut doc = load(DOC).unwrap();
    assert_eq!(credits(&mut doc, "1,2,3"), [1.0, 1.0, 1.0, 1.0, 1.0, 1.0]);
    assert_eq!(
        credits(&mut doc, "3,2,1"),
        [1.0 / 3.0, 1.0 / 3.0, 1.0, 0.0, 1.0, 1.0]
    );
    assert_eq!(
        credits(&mut doc, "1,2"),
        [2.0 / 3.0, 2.0 / 3.0, 2.0 / 3.0, 0.0, 0.0, 2.0 / 3.0]
    );
    // The best common subsequence, unless only positions count.
    assert_eq!(
        credits(&mut doc, "2,3"),
        [2.0 / 3.0, 0.0, 2.0 / 3.0, 0.0, 0.0, 2.0 / 3.0]
    );
    assert_eq!(credits(&mut doc, "4,5,6"), [0.0; 6]);
}

#[test]
fn a_set_matches_partly() {
    let mut doc = load(
        r#"<mathInput name="resp" />
           <answer name="ansP"><award matchPartial><when>$resp={1,2,3}</when></award></answer>"#,
    )
    .unwrap();
    let mut credit = |r: &str| {
        type_into(&mut doc, "resp", r);
        let c = doc.resolve_path("ansP").unwrap();
        doc.submit(c);
        doc.value("ansP", "credit").unwrap()
    };
    assert_eq!(credit("{3,a,2,1}"), 0.75);
    assert_eq!(credit("{3,2,3,1,1}"), 1.0);
    assert_eq!(credit("3"), 1.0 / 3.0);
}
