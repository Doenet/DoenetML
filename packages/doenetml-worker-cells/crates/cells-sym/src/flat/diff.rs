//! Symbolic derivative for engine A, built with the simplifying
//! constructors so intermediate results stay small. Symbols other than the
//! variable, and cell leaves, are constants.

use super::simplify::{add, apply, mul, pow};
use super::{Flat, Tag};
use crate::Handle;

fn free_of(f: &Flat, h: Handle, var: u32) -> bool {
    let n = f.node(h);
    match n.tag {
        Tag::Sym => n.a != var,
        Tag::Num | Tag::Rat | Tag::Cell => true,
        Tag::Add | Tag::Mul => f.kids(h).iter().all(|&k| free_of(f, k, var)),
        Tag::Pow => free_of(f, n.a, var) && free_of(f, n.b, var),
        Tag::Apply => free_of(f, n.b, var),
    }
}

pub fn derivative(f: &mut Flat, h: Handle, var: u32) -> Handle {
    if free_of(f, h, var) {
        return f.num(0.0);
    }
    let n = f.node(h);
    match n.tag {
        Tag::Sym => f.num(1.0),
        Tag::Num | Tag::Rat | Tag::Cell => f.num(0.0),
        Tag::Add => {
            let ks: Vec<Handle> = f.kids(h).to_vec();
            let ds: Vec<Handle> = ks.into_iter().map(|k| derivative(f, k, var)).collect();
            add(f, &ds)
        }
        Tag::Mul => {
            // Product rule over every factor that depends on the variable.
            let ks: Vec<Handle> = f.kids(h).to_vec();
            let mut terms = Vec::new();
            for i in 0..ks.len() {
                if free_of(f, ks[i], var) {
                    continue;
                }
                let mut factors = ks.clone();
                factors[i] = derivative(f, ks[i], var);
                terms.push(mul(f, &factors));
            }
            add(f, &terms)
        }
        Tag::Pow => {
            let (b, e) = (n.a, n.b);
            let db = derivative(f, b, var);
            if free_of(f, e, var) {
                // e b^(e-1) b'
                let m1 = f.num(-1.0);
                let em1 = add(f, &[e, m1]);
                let p = pow(f, b, em1);
                mul(f, &[e, p, db])
            } else {
                // b^e (e' ln b + e b'/b)
                let de = derivative(f, e, var);
                let ln = f.sym_id("ln");
                let lnb = apply(f, ln, b);
                let t1 = mul(f, &[de, lnb]);
                let m1 = f.num(-1.0);
                let inv = pow(f, b, m1);
                let t2 = mul(f, &[e, db, inv]);
                let s = add(f, &[t1, t2]);
                mul(f, &[h, s])
            }
        }
        Tag::Apply => {
            let u = n.b;
            let du = derivative(f, u, var);
            let outer = match f.sym_name(n.a) {
                "sin" => {
                    let cos = f.sym_id("cos");
                    apply(f, cos, u)
                }
                "cos" => {
                    let sin = f.sym_id("sin");
                    let s = apply(f, sin, u);
                    let m1 = f.num(-1.0);
                    mul(f, &[m1, s])
                }
                "tan" => {
                    let cos = f.sym_id("cos");
                    let c = apply(f, cos, u);
                    let m2 = f.num(-2.0);
                    pow(f, c, m2)
                }
                "exp" => h,
                "ln" | "log" => {
                    let m1 = f.num(-1.0);
                    pow(f, u, m1)
                }
                "abs" => {
                    let m1 = f.num(-1.0);
                    let inv = pow(f, h, m1);
                    mul(f, &[u, inv])
                }
                _ => f.num(f64::NAN),
            };
            mul(f, &[outer, du])
        }
    }
}
