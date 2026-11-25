//! The counting operators and `<sortIndices>` (ADR 0078) as a paragraph
//! shows them: their counts; a tally's categories, its second named
//! sequence, are their written text.

mod common;
use cells_core::Document;
use cells_core::testing::reference;
use cells_core::testing::test_utils::load;

fn text(doc: &Document, name: &str) -> String {
    doc.rendered_text(doc.resolve_path(name).unwrap())
}

/// The text of each cell of `name`'s prop `prop`.
fn texts(doc: &Document, name: &str, prop: &str) -> Vec<String> {
    let c = doc.resolve_path(name).unwrap();
    doc.prop_cells(c, prop)
        .unwrap()
        .into_iter()
        .map(|cell| doc.text_value(cell))
        .collect()
}

#[test]
fn a_tally_shows_its_counts_and_its_categories() {
    let doc = load(
        r#"<numberList name="which">1 4 1 2 2 2 4</numberList>
           <tally name="t" categories="4 3 2 1">$which</tally>
           <p name="pCounts">$t</p>
           <textList name="fruit">apple fig apple</textList>
           <tally name="f" categories="apple fig">$fruit</tally>
           <p name="pFruit">$f</p>
           <p name="pSecond">$t[2]</p>"#,
    )
    .unwrap();
    assert_eq!(text(&doc, "pCounts"), "2, 0, 3, 2");
    assert_eq!(texts(&doc, "t", "categories"), ["4", "3", "2", "1"]);
    assert_eq!(text(&doc, "pFruit"), "2, 1");
    assert_eq!(texts(&doc, "f", "categories"), ["apple", "fig"]);
    assert_eq!(text(&doc, "pSecond"), "0");
    assert_eq!(reference::check(&doc), None);
}

#[test]
fn bin_counts_and_sort_indices_show_their_numbers() {
    let doc = load(
        r#"<numberList name="edges">0 1 2</numberList>
           <numberList name="v">0 0.5 1 1.5 2</numberList>
           <p name="pBins"><binCounts bins="$edges">$v</binCounts></p>
           <p name="pNone"><binCounts bins="0 5 2">$v</binCounts></p>
           <p name="pIndices"><sortIndices>30 10 20</sortIndices></p>"#,
    )
    .unwrap();
    assert_eq!(text(&doc, "pBins"), "2, 3");
    assert_eq!(text(&doc, "pNone"), "");
    assert_eq!(text(&doc, "pIndices"), "2, 3, 1");
    assert_eq!(reference::check(&doc), None);
}
