//! Text in the tick (ADR 0053): a text reading a sequence is its entries
//! joined (ADR 0041 decision 5), a string made in the tick and interned;
//! a sort compares texts, and numbers or expressions as values.

mod common;
use cells_core::Document;
use cells_core::testing::reference;
use cells_core::testing::test_utils::load;
use common::*;

fn text(doc: &Document, name: &str) -> String {
    doc.rendered_text(doc.resolve_path(name).unwrap())
}

#[test]
fn a_text_of_a_text_list_is_its_entries_joined() {
    let doc = load(
        r#"<textList name="tl">apple banana</textList>
           <text name="t">$tl</text>
           <numberList name="nl">1 2.5 3</numberList>
           <text name="n">$nl</text>
           <booleanList name="bl">true false</booleanList>
           <text name="b">$bl</text>
           <mathList name="ml">x y+1</mathList>
           <text name="m">$ml</text>
           <textList name="one">pear</textList>
           <text name="o">$one</text>
           <p name="pt">Text: $tl.text</p>
           <p name="pn">$nl.text</p>"#,
    )
    .unwrap();
    assert_eq!(text(&doc, "pt"), "Text: apple, banana");
    assert_eq!(text(&doc, "pn"), "1, 2.5, 3");
    assert_eq!(text(&doc, "t"), "apple, banana");
    assert_eq!(text(&doc, "n"), "1, 2.5, 3");
    assert_eq!(text(&doc, "b"), "true, false");
    assert_eq!(text(&doc, "m"), "x, y + 1");
    assert_eq!(text(&doc, "o"), "pear");
    assert_eq!(reference::check(&doc), None);
}

#[test]
fn a_joined_text_follows_its_entries() {
    let mut doc = load(
        r#"<textInput name="ti" prefill="kiwi"><label>t</label></textInput>
           <numberInput name="ni" value="2"><label>n</label></numberInput>
           <textList name="tl">apple $ti</textList>
           <text name="t">$tl</text>
           <text name="n">$ni</text>"#,
    )
    .unwrap();
    assert_eq!(text(&doc, "t"), "apple, kiwi");
    assert_eq!(text(&doc, "n"), "2");
    let before = doc.strings.len();
    let fig = doc.intern("fig");
    set(&mut doc, "ti", "value", fig);
    assert_eq!(text(&doc, "t"), "apple, fig");
    set(&mut doc, "ni", "value", 7.0);
    assert_eq!(text(&doc, "n"), "7");
    assert_eq!(reference::check(&doc), None);
    // Back to a text the document made before: no string is added for it.
    let kiwi = doc.intern("kiwi");
    let grown = doc.strings.len();
    set(&mut doc, "ti", "value", kiwi);
    assert_eq!(text(&doc, "t"), "apple, kiwi");
    assert_eq!(doc.strings.len(), grown);
    assert!(grown > before);
}

#[test]
fn equal_joined_texts_compare_equal() {
    let mut doc = load(
        r#"<textInput name="ti" prefill="b"><label>t</label></textInput>
           <textList name="l1">a $ti</textList>
           <textList name="l2">a b</textList>
           <text name="t1">$l1</text>
           <text name="t2">$l2</text>
           <boolean name="same">$t1 = $t2</boolean>"#,
    )
    .unwrap();
    assert_eq!(v(&doc, "same", "value"), 1.0);
    let c = doc.intern("c");
    set(&mut doc, "ti", "value", c);
    assert_eq!(v(&doc, "same", "value"), 0.0);
}

#[test]
fn a_sort_of_texts_is_alphabetical() {
    let doc = load(
        r#"<p name="p"><sort>
             <text>banana</text> <text>apple</text>
             <textList>grape cherry</textList> <text>passion fruit</text>
           </sort></p>
           <p name="bare"><sort>10 2 x</sort></p>
           <p name="typed"><sort type="text">orange apple above</sort></p>"#,
    )
    .unwrap();
    assert_eq!(
        text(&doc, "p"),
        "apple, banana, cherry, grape, passion fruit"
    );
    assert_eq!(text(&doc, "bare"), "10, 2, x");
    assert_eq!(text(&doc, "typed"), "above, apple, orange");
    assert_eq!(reference::check(&doc), None);
}

#[test]
fn a_sort_of_texts_numbers_and_maths_compares_text() {
    let doc = load(
        r#"<p name="p"><sort>
             <text>b</text> <number>3</number> <math>5</math>
             <textList>1 z 15 orange</textList> <math>x</math> <number>222</number>
             <mathList>8 u</mathList> <numberList>99 765</numberList>
           </sort></p>"#,
    )
    .unwrap();
    assert_eq!(
        text(&doc, "p"),
        "1, 15, 222, 3, 5, 765, 8, 99, b, orange, u, x, z"
    );
    assert_eq!(reference::check(&doc), None);
}

#[test]
fn a_sort_of_maths_compares_values_or_text() {
    let doc = load(
        r#"<p name="v"><sort><math>pi</math> <math>1</math> <number>-3</number>
             <mathList>1/e sin(2)</mathList></sort></p>
           <p name="t"><sort type="math">z b a x</sort></p>
           <p name="mixed"><sort><math>y</math> <mathList>2 a 1</mathList></sort></p>"#,
    )
    .unwrap();
    assert_eq!(text(&doc, "v"), "-3, 1/e, sin(2), 1, π");
    assert_eq!(text(&doc, "t"), "a, b, x, z");
    assert_eq!(text(&doc, "mixed"), "1, 2, a, y");
    assert_eq!(reference::check(&doc), None);
}

#[test]
fn bare_text_is_numbers_when_every_piece_is_one() {
    for (children, sorted) in [
        ("d a b", "a, b, d"),
        ("10 2 1", "1, 2, 10"),
        ("1/2 2 1", "0.5, 1, 2"),
        ("1e3 5e2 2e4", "1e3, 2e4, 5e2"),
    ] {
        let doc = load(&format!(r#"<p name="p"><sort>{children}</sort></p>"#)).unwrap();
        assert_eq!(text(&doc, "p"), sorted, "{children}");
    }
}

#[test]
fn a_sort_follows_a_math_input() {
    let mut doc = load(
        r#"<mathInput name="m1" prefill="sqrt(2)"><label>a</label></mathInput>
           <mathInput name="m2" prefill="5/6"><label>b</label></mathInput>
           <p name="p"><sort>$m1 $m2 <number>70</number> <math>-pi</math></sort></p>"#,
    )
    .unwrap();
    assert_eq!(text(&doc, "p"), "-π, 5/6, sqrt(2), 70");
    type_into(&mut doc, "m1", "-5");
    assert_eq!(text(&doc, "p"), "-5, -π, 5/6, 70");
    assert_eq!(reference::check(&doc), None);
}

#[test]
fn as_list_false_shows_no_separator() {
    let doc = load(
        r#"<p name="a"><sort name="s" type="math">z b a</sort></p>
           <p name="b"><sort extend="$s" asList="false"/></p>"#,
    )
    .unwrap();
    assert_eq!(text(&doc, "a"), "a, b, z");
    assert_eq!(text(&doc, "b"), "abz");
}
