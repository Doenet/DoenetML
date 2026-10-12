//! Text and LaTeX for engine A. Undoes the arena's canonical spelling:
//! `a + (-1) b` prints as `a - b`, negative powers as fractions, `x^(1/2)`
//! as a root.

use super::simplify::Coef;
use super::{Flat, Tag};
use crate::Handle;

#[derive(Clone, Copy, PartialEq)]
enum Style {
    Text,
    Latex,
}

pub fn text(f: &Flat, h: Handle) -> String {
    expr(f, h, 0, Style::Text).0
}

pub fn latex(f: &Flat, h: Handle) -> String {
    expr(f, h, 0, Style::Latex).0
}

const ADD: u8 = 1;
const MUL: u8 = 2;
const POW: u8 = 3;
const ATOM: u8 = 4;

fn wrap(s: String, p: u8, min: u8, st: Style) -> String {
    if p >= min {
        s
    } else if st == Style::Latex {
        format!("\\left({s}\\right)")
    } else {
        format!("({s})")
    }
}

fn at(f: &Flat, h: Handle, min: u8, st: Style) -> String {
    let (s, p) = expr(f, h, min, st);
    wrap(s, p, min, st)
}

fn fmt_num(v: f64, st: Style) -> String {
    if v.is_nan() {
        "NaN".into()
    } else if v.is_infinite() {
        let inf = if st == Style::Latex {
            "\\infty"
        } else {
            "infinity"
        };
        if v < 0.0 {
            format!("-{inf}")
        } else {
            inf.into()
        }
    } else if v.fract() == 0.0 && v.abs() < 1e15 {
        format!("{}", v as i64)
    } else {
        format!("{v}")
    }
}

fn is_negative(f: &Flat, h: Handle) -> bool {
    match f.tag(h) {
        Tag::Num | Tag::Rat => f.number(h).unwrap() < 0.0,
        Tag::Mul => is_negative(f, f.kids(h)[0]),
        _ => false,
    }
}

/// The string and its precedence.
fn expr(f: &Flat, h: Handle, _min: u8, st: Style) -> (String, u8) {
    let n = f.node(h);
    match n.tag {
        Tag::Num => {
            let v = f.number(h).unwrap();
            (fmt_num(v, st), if v < 0.0 { MUL } else { ATOM })
        }
        Tag::Rat => (rat(n.a as i32 as i64, n.b as i64, st), MUL),
        Tag::Sym => {
            let name = f.sym_name(n.a);
            (
                if st == Style::Latex && name == "pi" {
                    "\\pi".into()
                } else {
                    name.to_string()
                },
                ATOM,
            )
        }
        Tag::Cell => (
            if st == Style::Latex {
                format!("c_{{{}}}", n.a)
            } else {
                format!("$c{}", n.a)
            },
            ATOM,
        ),
        Tag::Add => {
            let mut s = String::new();
            for (i, &t) in f.kids(h).iter().enumerate() {
                if i == 0 {
                    s.push_str(&at(f, t, ADD, st));
                } else if is_negative(f, t) {
                    s.push_str(" - ");
                    s.push_str(&product(f, t, true, st).0);
                } else {
                    s.push_str(" + ");
                    s.push_str(&at(f, t, ADD + 1, st));
                }
            }
            (s, ADD)
        }
        Tag::Mul => product(f, h, false, st),
        Tag::Pow => {
            if let Some(c) = Coef::of(f, n.b) {
                if c.value() < 0.0 {
                    return product(f, h, false, st);
                }
                if c == Coef::R(1, 2) {
                    let inner = expr(f, n.a, 0, st).0;
                    return (
                        if st == Style::Latex {
                            format!("\\sqrt{{{inner}}}")
                        } else {
                            format!("sqrt({inner})")
                        },
                        ATOM,
                    );
                }
            }
            let base = at(f, n.a, ATOM, st);
            let exp = if st == Style::Latex {
                format!("{{{}}}", expr(f, n.b, 0, st).0)
            } else {
                at(f, n.b, ATOM, st)
            };
            (format!("{base}^{exp}"), POW)
        }
        Tag::Apply => {
            let name = f.sym_name(n.a);
            let arg = expr(f, n.b, 0, st).0;
            let s = match st {
                Style::Text => format!("{name}({arg})"),
                Style::Latex if name == "abs" => format!("\\left|{arg}\\right|"),
                Style::Latex => format!("\\{name}\\left({arg}\\right)"),
            };
            (s, ATOM)
        }
    }
}

fn rat(p: i64, q: i64, st: Style) -> String {
    match st {
        Style::Text => format!("{p}/{q}"),
        Style::Latex if p < 0 => format!("-\\frac{{{}}}{{{q}}}", -p),
        Style::Latex => format!("\\frac{{{p}}}{{{q}}}"),
    }
}

/// A product (or a lone negative power) as `coef num / den`; with
/// `negate`, the coefficient's sign is flipped (for `a - b`).
fn product(f: &Flat, h: Handle, negate: bool, st: Style) -> (String, u8) {
    let factors: Vec<Handle> = if f.tag(h) == Tag::Mul {
        f.kids(h).to_vec()
    } else {
        vec![h]
    };
    let mut coef = Coef::R(1, 1);
    let mut num: Vec<String> = Vec::new();
    let mut den: Vec<String> = Vec::new();
    for &k in &factors {
        if let Some(c) = Coef::of(f, k) {
            coef = coef.mul(c);
            continue;
        }
        let n = f.node(k);
        if n.tag == Tag::Pow
            && let Some(c) = Coef::of(f, n.b)
            && c.value() < 0.0
        {
            let pos = c.mul(Coef::R(-1, 1));
            let s = if pos.is_one() {
                at(f, n.a, POW, st)
            } else {
                format!("{}^{}", at(f, n.a, ATOM, st), coef_str(pos, st))
            };
            den.push(s);
            continue;
        }
        num.push(at(f, k, POW, st));
    }
    if negate {
        coef = coef.mul(Coef::R(-1, 1));
    }
    let negative = coef.value() < 0.0;
    let mag = coef.mul(Coef::R(if negative { -1 } else { 1 }, 1));
    let (cn, cd) = match mag {
        Coef::R(p, q) => (
            fmt_num(p as f64, st),
            (q != 1).then(|| fmt_num(q as f64, st)),
        ),
        Coef::F(v) => (fmt_num(v, st), None),
    };
    if let Some(cd) = cd {
        den.insert(0, cd);
    }
    if cn != "1" || num.is_empty() {
        num.insert(0, cn);
    }
    let join = |parts: &[String]| {
        let mut s = String::new();
        for (i, p) in parts.iter().enumerate() {
            if i > 0 {
                let digit = p.starts_with(|c: char| c.is_ascii_digit());
                s.push_str(match (st, digit) {
                    (Style::Latex, true) => " \\cdot ",
                    (Style::Text, true) => " * ",
                    _ => " ",
                });
            }
            s.push_str(p);
        }
        s
    };
    let mut s = join(&num);
    if !den.is_empty() {
        let d = join(&den);
        s = match st {
            Style::Latex => format!("\\frac{{{s}}}{{{d}}}"),
            Style::Text => {
                let n = if num.len() > 1 { format!("({s})") } else { s };
                let d = if den.len() > 1 { format!("({d})") } else { d };
                format!("{n}/{d}")
            }
        };
    }
    if negative {
        s = format!("-{s}");
    }
    (s, MUL)
}

fn coef_str(c: Coef, st: Style) -> String {
    match c {
        Coef::R(p, 1) => fmt_num(p as f64, st),
        Coef::R(p, q) => match st {
            Style::Latex => format!("{{\\frac{{{p}}}{{{q}}}}}"),
            Style::Text => format!("({p}/{q})"),
        },
        Coef::F(v) => fmt_num(v, st),
    }
}
