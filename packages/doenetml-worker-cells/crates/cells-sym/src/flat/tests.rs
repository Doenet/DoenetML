use super::Flat;
use crate::{SymEngine, Tree};

fn p(f: &mut Flat, s: &str) -> u32 {
    f.parse(s).unwrap()
}

fn simp(f: &mut Flat, s: &str) -> String {
    let h = p(f, s);
    let s = f.simplify(h);
    f.text(s)
}

#[test]
fn hash_consing_gives_equal_handles() {
    let mut f = Flat::new();
    let a = p(&mut f, "x^2 + 3x");
    let n = f.len();
    let b = p(&mut f, "x^2 + 3x");
    assert_eq!(a, b);
    assert_eq!(f.len(), n, "a second parse adds no nodes");
}

#[test]
fn simplify_collects_and_folds() {
    let mut f = Flat::new();
    assert_eq!(simp(&mut f, "3x + 2x"), "5 x");
    assert_eq!(simp(&mut f, "x + 1 + x^2 + 2"), "x^2 + x + 3");
    assert_eq!(simp(&mut f, "x x y"), "x^2 y");
    assert_eq!(simp(&mut f, "x/3 + x/3"), "(2 x)/3");
    assert_eq!(simp(&mut f, "2 - 3x - 2"), "-3 x");
    assert_eq!(simp(&mut f, "0 x + y"), "y");
    assert_eq!(simp(&mut f, "(x y)^2 / x"), "x y^2");
    assert_eq!(simp(&mut f, "1/2 + 1/3"), "5/6");
    assert_eq!(simp(&mut f, "sin(0) + cos(0)"), "1");
}

#[test]
fn expand_multiplies_out() {
    let mut f = Flat::new();
    let h = p(&mut f, "(x+1)^2 - (x-1)(x+1)");
    let e = f.expand(h);
    assert_eq!(f.text(e), "2 x + 2");
}

#[test]
fn derivative_rules() {
    let mut f = Flat::new();
    let h = p(&mut f, "x^3 + 2x");
    let d = f.derivative(h, "x");
    assert_eq!(f.text(d), "3 x^2 + 2");
    let h = p(&mut f, "sin(x^2)");
    let d = f.derivative(h, "x");
    assert_eq!(f.text(d), "2 x cos(x^2)");
    let h = p(&mut f, "a x^2");
    let d = f.derivative(h, "x");
    assert_eq!(f.text(d), "2 a x");
    let h = p(&mut f, "e^x");
    let d = f.derivative(h, "x");
    assert_eq!(f.evaluate(d, Some(("x", 1.0))), std::f64::consts::E);
}

#[test]
fn equality_by_sampling_and_syntax() {
    let mut f = Flat::new();
    let a = p(&mut f, "(x+1)^2");
    let b = p(&mut f, "x^2 + 2x + 1");
    let c = p(&mut f, "x^2 + 2x");
    assert!(f.equals(a, b));
    assert!(!f.equals(a, c));
    assert!(!f.equals_syntax(a, b));
    let d = p(&mut f, "1 + 2x + x^2");
    assert!(!f.equals_syntax(b, d), "syntax equality does not reorder");
    let e = p(&mut f, "x^2+2x+1");
    assert!(f.equals_syntax(b, e));
}

#[test]
fn instantiate_substitutes_cell_leaves() {
    let mut f = Flat::new();
    // n x + 2 x, with n a numeric leaf on cell 0 and m a math leaf on cell 1.
    let t = f.import(&Tree::Add(vec![
        Tree::Mul(vec![
            Tree::Cell {
                cell: 0,
                math: false,
            },
            Tree::Sym("x".into()),
        ]),
        Tree::Mul(vec![Tree::Num(2.0), Tree::Sym("x".into())]),
        Tree::Cell {
            cell: 1,
            math: true,
        },
    ]));
    let y2 = p(&mut f, "y^2");
    let h = f.instantiate(t, &[3.0, y2 as f64]);
    let s = f.simplify(h);
    assert_eq!(f.text(s), "y^2 + 5 x");
    // The same values give the same handle.
    assert_eq!(f.instantiate(t, &[3.0, y2 as f64]), h);
}

#[test]
fn printing() {
    let mut f = Flat::new();
    let h = p(&mut f, "x - 2y");
    assert_eq!(f.text(h), "x - 2 y");
    let h = p(&mut f, "sqrt(x)/(2y)");
    let s = f.simplify(h);
    assert_eq!(f.latex(s), "\\frac{\\sqrt{x}}{2 y}");
}
