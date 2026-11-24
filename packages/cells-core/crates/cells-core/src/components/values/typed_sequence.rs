//! The values of a sequence of letters or of math (ADR 0074): what a
//! `<sequence type="letters|math">` lists and what a `<selectFromSequence
//! type="letters|math">` draws among, counted when the document is
//! compiled from parameters written as text, as the current core's
//! `calculateSequenceParameters` and `returnSequenceValues` count them.
//!
//! Letters are counted as numbers (`a` 1, `aa` 27), and an entry is the
//! number's letters (`SymKind::Letters`), a string the planner interns for
//! every number the entry can be, so a tick finds it and makes none. Math
//! values are expressions the symbolic engine computes once, when the
//! document is compiled, each a given expression shown.

use crate::compile::api::{Arg, ElemWiring, Leaf, PlanCtx, Port, RefId, Source};
use crate::components::EntryKind;
use crate::error::{Error, Result};
use crate::limits::{MAX_VEC_IN, byte};
use crate::program::{MAX_SEQUENCE, OpSpec, SymKind, VecOp};
use crate::sym::{Engine, Handle, Tree};

/// What a sequence's `type` makes its values: numbers (the default, and
/// what a `type` the attribute does not allow falls back to, as the
/// current core's `validateAttributeValue` does), letters or math.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub(crate) enum SeqKind {
    Number,
    Letters,
    Math,
}

impl SeqKind {
    /// The kind `type` names, read as the current core reads it: trimmed,
    /// in any case.
    pub(crate) fn of(ty: Option<&str>) -> SeqKind {
        match ty.map(|t| t.trim().to_ascii_lowercase()).as_deref() {
            Some("letters") => SeqKind::Letters,
            Some("math") => SeqKind::Math,
            _ => SeqKind::Number,
        }
    }

    /// The kind of entry a list of values of this kind holds (ADR 0053):
    /// a number, a string or an expression.
    pub(crate) fn entry(self) -> EntryKind {
        match self {
            SeqKind::Number => EntryKind::Number,
            SeqKind::Letters => EntryKind::Text,
            SeqKind::Math => EntryKind::Math,
        }
    }
}

impl crate::components::ComponentType {
    /// Whether an element of the type lists values of the kind its `type`
    /// names (ADR 0074): a `<sequence>`'s and a `<selectFromSequence>`'s,
    /// numbers by default, strings for letters, expressions for math. The
    /// type declares entries of a number; an element of another kind
    /// decides its own ([`ListShape`](crate::components::ListShape)).
    pub(crate) fn entries_by_type(self) -> bool {
        use crate::components::ComponentType as T;
        matches!(self, T::Sequence | T::SelectFromSequence)
    }

    /// The kind of entry an element of the type whose `type` is `ty`
    /// lists, when the type's entries follow it
    /// ([`entries_by_type`](Self::entries_by_type)).
    pub(crate) fn entry_by_type(self, ty: Option<&str>) -> Option<EntryKind> {
        self.entries_by_type().then(|| SeqKind::of(ty).entry())
    }

    /// The type an element laid out as this type is when its `type` is
    /// `kind` (ADR 0074): a structural sequence of letters is one whose
    /// items are texts.
    pub(crate) fn typed(self, kind: SeqKind) -> crate::components::ComponentType {
        use crate::components::ComponentType as T;
        match (self, kind) {
            (T::StructuralSequence, SeqKind::Letters) => T::StructuralLetterSequence,
            _ => self,
        }
    }
}

/// A sequence's parameters as written: each text, `length` a number.
#[derive(Debug, Clone, Default)]
pub(crate) struct TypedParams {
    pub(crate) from: Option<String>,
    pub(crate) to: Option<String>,
    pub(crate) step: Option<String>,
    pub(crate) length: Option<f64>,
    pub(crate) exclude: Vec<String>,
}

/// A sequence of letters as numbers: `length` of them from `from` by
/// `step`, less the excluded ones, shown in lower or upper case.
#[derive(Debug, Clone)]
pub(crate) struct LetterRun {
    pub(crate) from: f64,
    pub(crate) step: f64,
    pub(crate) length: usize,
    pub(crate) exclude: Vec<f64>,
    pub(crate) lowercase: bool,
}

impl LetterRun {
    /// The last number of the run, excluded or not: what a draw's `to` is.
    pub(crate) fn to(&self) -> f64 {
        self.from + self.step * (self.length as f64 - 1.0)
    }

    /// The numbers it lists, in order: an error for one that names no
    /// letters (below `a`, between two).
    pub(crate) fn numbers(&self) -> Result<Vec<f64>> {
        let mut out = Vec::new();
        for k in 0..self.length {
            let v = self.from + self.step * k as f64;
            if self.exclude.contains(&v) {
                continue;
            }
            if !(v >= 1.0 && v.fract() == 0.0) {
                return Err(Error::Unsupported(
                    "a sequence of letters reaching below `a` or between letters".into(),
                ));
            }
            out.push(v);
        }
        Ok(out)
    }

    /// The numbers it lists, each one's letters interned, so the entry
    /// showing it finds the string and makes none.
    pub(crate) fn interned(&self, ctx: &mut PlanCtx<'_, '_>) -> Result<Vec<f64>> {
        let numbers = self.numbers()?;
        for &v in &numbers {
            ctx.intern(&crate::program::texts::letters(v as u64, self.lowercase));
        }
        Ok(numbers)
    }

    /// Whether its letters are lower case, as the second input of the
    /// operator making an entry of a number (`SymKind::Letters`).
    pub(crate) fn case(&self) -> f64 {
        if self.lowercase { 1.0 } else { 0.0 }
    }

    /// An entry holding the letters of `v`, a constant.
    pub(crate) fn constant(&self, v: f64) -> Source {
        Source::op(
            OpSpec::Sym(SymKind::Letters),
            vec![Arg::Const(v), Arg::Const(self.case())],
        )
    }

    /// An entry holding the letters of the number port `n` holds.
    pub(crate) fn of_port(&self, n: Port) -> Source {
        Source::op(
            OpSpec::Sym(SymKind::Letters),
            vec![Arg::Own(n), Arg::Const(self.case())],
        )
    }
}

/// `length` as the current core takes it: a whole number from 0, else 0
/// (it warns), at most [`MAX_SEQUENCE`].
fn whole_length(length: f64) -> Result<usize> {
    let n = if length.is_finite() && length >= 0.0 && length.fract() == 0.0 {
        length
    } else {
        0.0
    };
    if n > MAX_SEQUENCE as f64 {
        return Err(Error::Unsupported(format!(
            "<sequence> of more than {MAX_SEQUENCE} values"
        )));
    }
    Ok(n as usize)
}

/// The count of a run from `a` to `b` by `s`, rounded as the current core
/// rounds it.
fn count(a: f64, b: f64, s: f64) -> f64 {
    (((b - a) / s + 1.0) * (1.0 + 1e-14)).floor()
}

fn all_four() -> Error {
    Error::Unsupported("<sequence> with from, to, step and length all given".into())
}

/// The number of letters `s` (`a` 1, `z` 26, `aa` 27, in either case), as
/// the current core's `lettersToNumber`; None for anything else.
pub(crate) use crate::program::texts::letters_number as letters_to_number;

/// A letters parameter (`from`, `to`, an exclude) as its number.
fn letter(attr: &str, s: &str) -> Result<f64> {
    letters_to_number(s).ok_or_else(|| Error::BadValue {
        attr: attr.into(),
        text: s.trim().into(),
    })
}

/// A sequence of letters: `from` and `to` letters, `step` a number,
/// counted as numbers, lower case unless `from` (else `to`) is all upper
/// case, as the current core counts and shows them.
pub(crate) fn letter_run(p: &TypedParams) -> Result<LetterRun> {
    let from = p.from.as_deref().map(|s| letter("from", s)).transpose()?;
    let to = p.to.as_deref().map(|s| letter("to", s)).transpose()?;
    let step = p
        .step
        .as_deref()
        .map(|s| {
            s.trim().parse::<f64>().map_err(|_| Error::BadValue {
                attr: "step".into(),
                text: s.trim().into(),
            })
        })
        .transpose()?;
    let upper = |s: &Option<String>| {
        s.as_deref()
            .is_some_and(|s| s.trim().chars().all(|c| c.is_ascii_uppercase()))
    };
    let lowercase = if p.from.is_some() {
        !upper(&p.from)
    } else {
        !upper(&p.to)
    };
    let (from, step, length) = match (from, to) {
        (None, None) => (1.0, step.unwrap_or(1.0), p.length.unwrap_or(10.0)),
        (None, Some(to)) => {
            let step = step.unwrap_or(1.0);
            let mut length = p.length.unwrap_or_else(|| count(1.0, to, step));
            let mut from = to - step * (length - 1.0);
            // No letters below `a`: as many as fit.
            if from < 1.0 {
                length = count(1.0, to, step);
                from = to - step * (length - 1.0);
            }
            (from, step, length)
        }
        (Some(from), None) => (from, step.unwrap_or(1.0), p.length.unwrap_or(10.0)),
        (Some(from), Some(to)) => match (step, p.length) {
            (None, None) => (from, 1.0, count(from, to, 1.0)),
            // A whole step, as the current core takes it.
            (None, Some(length)) => (from, ((to - from) / (length - 1.0)).floor(), length),
            (Some(step), None) => (from, step, count(from, to, step)),
            (Some(_), Some(_)) => return Err(all_four()),
        },
    };
    let exclude = p
        .exclude
        .iter()
        .map(|x| letter("exclude", x))
        .collect::<Result<_>>()?;
    Ok(LetterRun {
        from,
        step,
        length: whole_length(length)?,
        exclude,
        lowercase,
    })
}

/// A sequence of math: `from`, `to` and `step` expressions, its values
/// `from + k step` expanded and simplified, its count, when `length` does
/// not give it, the run from `from` to `to` by `step` evaluated to a
/// number (none when it is no number, as the current core takes it), less
/// the values equal to an exclude.
pub(crate) fn math_values(p: &TypedParams) -> Result<Vec<Tree<RefId>>> {
    let mut en = Engine::new();
    let parse = |en: &mut Engine, attr: &str, s: &str| {
        en.parse(s).map_err(|reason| Error::BadMath {
            text: format!("{attr}=\"{}\"", s.trim()),
            reason,
        })
    };
    // `text` read by the engine, made of the texts of handles.
    let combine = |en: &mut Engine, text: String| {
        en.parse(&text)
            .map_err(|reason| Error::BadMath { text, reason })
    };
    let from = p
        .from
        .as_deref()
        .map(|s| parse(&mut en, "from", s))
        .transpose()?;
    let to =
        p.to.as_deref()
            .map(|s| parse(&mut en, "to", s))
            .transpose()?;
    let step = p
        .step
        .as_deref()
        .map(|s| parse(&mut en, "step", s))
        .transpose()?;
    let one = en.num(1.0);
    let run = |en: &mut Engine, a: Handle, b: Handle, s: Handle| -> Result<f64> {
        let (a, b, s) = (en.text(a), en.text(b), en.text(s));
        let h = combine(en, format!("(({b})-({a}))/({s})+1"))?;
        Ok((en.evaluate(h, None) * (1.0 + 1e-14)).floor())
    };
    let (from, step, length) = match (from, to) {
        (None, None) => (one, step.unwrap_or(one), p.length.unwrap_or(10.0)),
        (None, Some(to)) => {
            let step = step.unwrap_or(one);
            let length = match p.length {
                Some(l) => l,
                None => run(&mut en, one, to, step)?,
            };
            let (t, s) = (en.text(to), en.text(step));
            let from = combine(&mut en, format!("({t})-({s})*({})", length - 1.0))?;
            (en.simplify(from), step, length)
        }
        (Some(from), None) => (from, step.unwrap_or(one), p.length.unwrap_or(10.0)),
        (Some(from), Some(to)) => match (step, p.length) {
            (None, None) => (from, one, run(&mut en, from, to, one)?),
            (None, Some(length)) => {
                let (f, t) = (en.text(from), en.text(to));
                let step = combine(&mut en, format!("(({t})-({f}))/({})", length - 1.0))?;
                (from, step, length)
            }
            (Some(step), None) => (from, step, run(&mut en, from, to, step)?),
            (Some(_), Some(_)) => return Err(all_four()),
        },
    };
    let exclude = p
        .exclude
        .iter()
        .map(|x| parse(&mut en, "exclude", x))
        .collect::<Result<Vec<_>>>()?;
    let (f, s) = (en.text(from), en.text(step));
    let mut values = Vec::new();
    for k in 0..whole_length(length)? {
        let v = if k == 0 {
            from
        } else {
            let sum = combine(&mut en, format!("({f})+({s})*({k})"))?;
            let expanded = en.expand(sum);
            en.simplify(expanded)
        };
        if exclude.iter().any(|&x| en.equals(x, v)) {
            continue;
        }
        values.push(en.export(v).ok_or_else(|| {
            Error::Unsupported(format!(
                "a math sequence's value '{}' a math cell cannot hold",
                en.text(v)
            ))
        })?);
    }
    Ok(values)
}

/// A hidden port of `wiring` showing the expression `tree`, which no
/// request passes (a sequence is fixed, as the current core's is).
pub(crate) fn math_port(wiring: &mut ElemWiring, tree: Tree<RefId>) -> Port {
    let given = wiring.hidden(Source::Leaf(Leaf::GivenMath(Some(tree))));
    wiring.hidden(Source::computed(OpSpec::Shown, vec![given]))
}

/// Branch `index` (from 1) of `branches`, own ports of `wiring`: a
/// `VecOp::Choose` over them, or, past the most one reads, a choose of a
/// group of them by the group `index` falls in, each group a choose by
/// its place in it. The missing value for an index that names none.
pub(crate) fn choose(wiring: &mut ElemWiring, index: Port, branches: &[Port]) -> Source {
    let most = MAX_VEC_IN - 1;
    if branches.len() <= most {
        let mut args = vec![index];
        args.extend_from_slice(branches);
        return Source::computed(
            OpSpec::Vec(VecOp::Choose {
                n: byte(branches.len()),
            }),
            args,
        );
    }
    // Group g (from 0) holds branches g most + 1 to (g + 1) most.
    let mut groups = Vec::new();
    for (g, group) in branches.chunks(most).enumerate() {
        let within = match g {
            0 => index,
            _ => wiring.hidden(Source::computed_k(OpSpec::Add, index, -((g * most) as f64))),
        };
        let chosen = choose(wiring, within, group);
        groups.push(wiring.hidden(chosen));
    }
    let less = wiring.hidden(Source::computed_k(OpSpec::Add, index, -1.0));
    let scaled = wiring.hidden(Source::computed_k(OpSpec::Div, less, most as f64));
    let floor = wiring.hidden(Source::computed(OpSpec::Floor, vec![scaled]));
    let group = wiring.hidden(Source::computed_k(OpSpec::Add, floor, 1.0));
    choose(wiring, group, &groups)
}

#[cfg(test)]
mod tests {
    use super::*;

    fn letters_of(p: TypedParams) -> Vec<String> {
        let run = letter_run(&p).unwrap();
        run.numbers()
            .unwrap()
            .into_iter()
            .map(|v| crate::program::texts::letters(v as u64, run.lowercase))
            .collect()
    }

    fn text(s: &str) -> Option<String> {
        Some(s.to_string())
    }

    #[test]
    fn letters_count_as_the_current_core_counts_them() {
        let p = |from, to, step, length| TypedParams {
            from,
            to,
            step,
            length,
            exclude: vec![],
        };
        assert_eq!(
            letters_of(p(text("c"), text("Q"), None, Some(5.0))),
            ["c", "f", "i", "l", "o"]
        );
        assert_eq!(
            letters_of(p(text("Y"), text("f"), text("-4"), None)),
            ["Y", "U", "Q", "M", "I"]
        );
        assert_eq!(
            letters_of(p(text("aZ"), None, text("3"), Some(4.0))),
            ["az", "bc", "bf", "bi"]
        );
        assert_eq!(
            letters_of(p(None, text("q"), text("3"), Some(10.0))),
            ["b", "e", "h", "k", "n", "q"]
        );
        assert_eq!(letters_of(p(None, None, None, None)).len(), 10);
        assert_eq!(
            letters_of(TypedParams {
                exclude: vec!["b".into(), "f".into()],
                length: Some(10.0),
                ..TypedParams::default()
            }),
            ["a", "c", "d", "e", "g", "h", "i", "j"]
        );
        let all = letters_of(p(text("a"), text("bz"), None, None));
        assert_eq!(
            (all.len(), all[26].as_str(), all[77].as_str()),
            (78, "aa", "bz")
        );
    }

    #[test]
    fn math_steps_symbolically() {
        let mut en = Engine::new();
        let mut texts = |p: TypedParams| -> Vec<String> {
            math_values(&p)
                .unwrap()
                .into_iter()
                .map(|t| {
                    let h = en.import(&t);
                    en.text(h)
                })
                .collect()
        };
        let v = texts(TypedParams {
            from: text("3x"),
            to: text("3y"),
            length: Some(4.0),
            ..TypedParams::default()
        });
        assert_eq!(v, ["3 x", "2 x + y", "x + 2 y", "3 y"]);
        let v = texts(TypedParams {
            from: text("1"),
            to: text("(0.1+0.7)*10"),
            ..TypedParams::default()
        });
        assert_eq!(v, ["1", "2", "3", "4", "5", "6", "7", "8"]);
        let v = texts(TypedParams {
            from: text(".1"),
            to: text(".8"),
            step: text(".1"),
            exclude: vec![".3".into(), ".6".into(), ".7".into()],
            ..TypedParams::default()
        });
        assert_eq!(v.len(), 5);
    }
}
