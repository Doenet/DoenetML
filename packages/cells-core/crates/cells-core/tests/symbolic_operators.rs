//! Operators over math (ADR 0043): numeric or symbolic by their operands,
//! as the type pass decides per element, or as `forceSymbolic` and
//! `forceNumeric` say; the symbolic ones the engine's operator over the
//! operands.

mod common;

use cells_core::Document;
use cells_core::testing::reference;
use cells_core::testing::test_utils::{load, load_unpruned};
use common::{req, type_into};

/// The expression `name` holds, or `None` when it is numeric.
fn expr(doc: &Document, name: &str) -> Option<String> {
    let cell = doc.cell(name, "expr").unwrap();
    (!doc.cells[cell.index()].is_nan()).then(|| doc.math_text(cell))
}

fn value(doc: &Document, name: &str) -> f64 {
    doc.value(name, "value").unwrap()
}

#[test]
fn one_input_operators_over_math() {
    let doc = load_unpruned(
        r#"<abs name="a">-x</abs>
           <abs name="n">-5.3</abs>
           <sign name="s">-2y</sign>
           <floor name="f">2.1x</floor>
           <ceil name="c">-3.2y</ceil>
           <ceil name="cl">log(31)</ceil>
           <abs name="al">-log(31)</abs>"#,
    )
    .unwrap();
    assert_eq!(expr(&doc, "a").as_deref(), Some("|-x|"));
    assert!(value(&doc, "a").is_nan());
    assert_eq!(expr(&doc, "n"), None);
    assert_eq!(value(&doc, "n"), 5.3);
    assert_eq!(expr(&doc, "s").as_deref(), Some("sign(-2 y)"));
    assert_eq!(expr(&doc, "f").as_deref(), Some("floor(2.1 x)"));
    assert_eq!(expr(&doc, "c").as_deref(), Some("ceil(-3.2 y)"));
    // Math with no free variable evaluates.
    assert_eq!(expr(&doc, "cl").as_deref(), Some("4"));
    assert_eq!(value(&doc, "cl"), 4.0);
    assert!((value(&doc, "al") - 31f64.ln()).abs() < 1e-12);
    assert_eq!(reference::check(&doc), None);
}

#[test]
fn an_operand_that_is_an_expression_follows_it() {
    let mut doc = load(
        r#"<mathInput name="mi" prefill="x"><label>m</label></mathInput>
           <abs name="a">$mi</abs>
           <math name="m">2$a</math>"#,
    )
    .unwrap();
    assert_eq!(expr(&doc, "a").as_deref(), Some("|x|"));
    assert_eq!(expr(&doc, "m").as_deref(), Some("2 |x|"));
    type_into(&mut doc, "mi", "-3");
    assert_eq!(expr(&doc, "a").as_deref(), Some("3"));
    assert_eq!(value(&doc, "a"), 3.0);
    assert_eq!(reference::check(&doc), None);
}

#[test]
fn numeric_operands_keep_the_numeric_operator() {
    let mut doc = load(
        r#"<number name="n">-2</number>
           <abs name="a">$n</abs>
           <mathInput name="mi" bindValueTo="$a"><label>m</label></mathInput>"#,
    )
    .unwrap();
    assert_eq!(expr(&doc, "a"), None);
    doc.request(&[req(&doc, "mi", "value", 4.0)]);
    assert_eq!(doc.value("n", "value"), Some(4.0));
    assert_eq!(value(&doc, "a"), 4.0);
}

#[test]
fn round_and_set_small_to_zero_over_math() {
    let doc = load_unpruned(
        r#"<round name="r1">log(31)</round>
           <round name="r2" numDecimals="2">log(31)</round>
           <round name="r3" numDigits="3">sin(55.3252326 x)</round>
           <round name="r4" numDecimals="3">1/3</round>
           <setSmallToZero name="z">0.0000000000000001 x + y</setSmallToZero>"#,
    )
    .unwrap();
    assert_eq!(value(&doc, "r1"), 3.0);
    assert_eq!(value(&doc, "r2"), 3.43);
    assert_eq!(expr(&doc, "r3").as_deref(), Some("sin(55.3 x)"));
    assert_eq!(value(&doc, "r4"), 0.333);
    assert_eq!(expr(&doc, "z").as_deref(), Some("0 x + y"));
}

#[test]
fn list_operators_over_math() {
    let doc = load_unpruned(
        r#"<sum name="s">x 2x</sum>
           <sum name="ss" simplify>x 2x y</sum>
           <product name="p">x y 3</product>
           <mean name="m">x y</mean>
           <min name="lo">x 3</min>
           <max name="hi">x y 3</max>
           <mod name="md">x 3</mod>
           <mod name="m3">x 3 4</mod>
           <gcd name="g">x 12</gcd>
           <lcm name="l">x 12</lcm>
           <variance name="v">x y</variance>
           <median name="med">x 3</median>
           <count name="c">x 3</count>"#,
    )
    .unwrap();
    assert_eq!(expr(&doc, "s").as_deref(), Some("x + 2 x"));
    assert_eq!(expr(&doc, "ss").as_deref(), Some("3 x + y"));
    assert_eq!(expr(&doc, "p").as_deref(), Some("x y * 3"));
    assert_eq!(expr(&doc, "m").as_deref(), Some("(x + y)/2"));
    assert_eq!(expr(&doc, "lo").as_deref(), Some("min(x, 3)"));
    assert_eq!(expr(&doc, "hi").as_deref(), Some("max(x, y, 3)"));
    assert_eq!(expr(&doc, "md").as_deref(), Some("mod(x, 3)"));
    // Of three operands, no value, as the current core's blank.
    assert_eq!(expr(&doc, "m3"), None);
    assert!(value(&doc, "m3").is_nan());
    assert_eq!(expr(&doc, "g").as_deref(), Some("gcd(x, 12)"));
    assert_eq!(expr(&doc, "l").as_deref(), Some("lcm(x, 12)"));
    assert_eq!(
        expr(&doc, "v").as_deref(),
        Some("(x^2 + y^2 - (x + y)^2/2)/1")
    );
    // Numeric only, as in the current core.
    assert_eq!(expr(&doc, "med"), None);
    assert!(value(&doc, "med").is_nan());
    assert_eq!(value(&doc, "c"), 2.0);
    assert_eq!(reference::check(&doc), None);
}

#[test]
fn forced_kinds() {
    let doc = load_unpruned(
        r#"<sum name="sym" forceSymbolic>3 17 1</sum>
           <sum name="symSimp" forceSymbolic simplify>3 17 1</sum>
           <sum name="num" forceNumeric>x 1</sum>
           <sum name="plain">3 17 1</sum>
           <sum name="numericMath">6/2 17 1</sum>"#,
    )
    .unwrap();
    assert_eq!(expr(&doc, "sym").as_deref(), Some("3 + 17 + 1"));
    assert_eq!(value(&doc, "sym"), 21.0);
    assert_eq!(expr(&doc, "symSimp").as_deref(), Some("21"));
    assert_eq!(expr(&doc, "num"), None);
    assert!(value(&doc, "num").is_nan());
    assert_eq!(expr(&doc, "plain"), None);
    assert_eq!(value(&doc, "plain"), 21.0);
    // Math text that is no number as written is kept as written.
    assert_eq!(expr(&doc, "numericMath").as_deref(), Some("6/2 + 17 + 1"));
    assert_eq!(value(&doc, "numericMath"), 21.0);
}

/// Constant math text that is no number as written (`6/2`, `pi/2`) is
/// symbolic, a `<math>` and an operand alike; a number literal stays
/// numeric (ADR 0043).
#[test]
fn constant_math_text_is_kept_as_written() {
    let doc = load_unpruned(
        r#"<math name="q">6/2</math><math name="three">3</math>
           <math name="neg">-2.5</math><math name="r">sqrt(2)</math>
           <sum name="s">$q 1</sum><sum name="t">$three 1</sum>
           <abs name="a">-pi</abs><abs name="b">-2</abs>"#,
    )
    .unwrap();
    assert_eq!(expr(&doc, "q").as_deref(), Some("6/2"));
    assert_eq!(value(&doc, "q"), 3.0);
    assert_eq!(expr(&doc, "three"), None);
    assert_eq!(expr(&doc, "neg"), None);
    assert_eq!(value(&doc, "neg"), -2.5);
    assert!((value(&doc, "r") - 2f64.sqrt()).abs() < 1e-12);
    assert_eq!(expr(&doc, "s").as_deref(), Some("6/2 + 1"));
    assert_eq!(value(&doc, "s"), 4.0);
    assert_eq!(expr(&doc, "t"), None);
    assert_eq!(value(&doc, "t"), 4.0);
    // Over a constant, the one-input operators evaluate.
    assert!((value(&doc, "a") - std::f64::consts::PI).abs() < 1e-12);
    assert_eq!(expr(&doc, "b"), None);
    assert_eq!(reference::check(&doc), None);
}

#[test]
fn a_symbolic_operator_follows_its_references() {
    let mut doc = load(
        r#"<mathInput name="mi" prefill="x"><label>m</label></mathInput>
           <number name="n">2</number>
           <sum name="s" simplify>$mi $mi $n</sum>
           <sum name="t">$s 1</sum>
           <math name="m" simplify>3$s</math>"#,
    )
    .unwrap();
    assert_eq!(expr(&doc, "s").as_deref(), Some("2 x + 2"));
    assert_eq!(expr(&doc, "t").as_deref(), Some("2 x + 2 + 1"));
    assert_eq!(expr(&doc, "m").as_deref(), Some("3 (2 x + 2)"));
    type_into(&mut doc, "mi", "4");
    assert_eq!(expr(&doc, "s").as_deref(), Some("10"));
    assert_eq!(value(&doc, "s"), 10.0);
    assert_eq!(value(&doc, "t"), 11.0);
    assert_eq!(reference::check(&doc), None);
}

#[test]
fn a_copy_is_its_kind() {
    let doc = load_unpruned(
        r#"<sum name="s">x y</sum><sum name="c" extend="$s"/>
           <abs name="a">-3</abs><abs name="b" extend="$a"/>"#,
    )
    .unwrap();
    assert_eq!(expr(&doc, "c").as_deref(), Some("x + y"));
    assert_eq!(expr(&doc, "b"), None);
    assert_eq!(value(&doc, "b"), 3.0);
}

/// The input signature (ADR 0017) is made over operators over math, whose
/// templates' leaves are their texts' (a variance's operands twice over),
/// and an edit to what reads the inputs harms none.
#[test]
fn the_input_signature_reads_an_operator_over_math() {
    use cells_core::dast::Dast;
    use cells_core::testing::test_utils::dast_json;
    use cells_core::{compare_signatures, input_signature};
    let signature = |op: &str| {
        let src = format!(
            r#"<mathInput name="a" prefill="x"><label>a</label></mathInput>
               <mathInput name="b" prefill="y"><label>b</label></mathInput>
               {op}"#
        );
        input_signature(&Dast::from_json(&dast_json(&src)).unwrap()).unwrap()
    };
    let one = signature(
        r#"<variance>$a $b</variance><abs>$a</abs><angle radians="$b"/>
           <mod>$a $b 3</mod><max>$a $b 3</max>"#,
    );
    let other = signature(r#"<standardDeviation population>$a $b</standardDeviation>"#);
    assert!(compare_signatures(&one, &one).safe());
    assert!(compare_signatures(&one, &other).safe());
}
