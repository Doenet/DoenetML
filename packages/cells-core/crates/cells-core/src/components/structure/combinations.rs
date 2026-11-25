//! What a selection of several values avoids (ADR 0079): the combinations
//! `excludeCombinations` names on a `<selectFromSequence>` or a
//! `<selectPrimeNumbers>`, and a `<selectFromSequence coprime>`'s common
//! factor. The draw draws again until its values avoid them
//! ([`crate::program::Avoid`]); this module reads the combinations from the
//! record, and decides, from literal parameters, what the current core
//! decides before it draws: too many combinations excluded
//! (`doenet-e0044`), and a `coprime` that cannot hold.

use crate::compile::api::*;
use crate::error::{Error, Result};

/// One entry of an excluded combination as written: `_`, which matches
/// any value; literal text; or a reference.
#[derive(Debug, Clone)]
pub(crate) enum ComboEntry {
    /// `_`: any value.
    Any,
    /// Text, as written.
    Text(String),
    /// A reference to a value.
    Ref(RefId),
}

/// The combinations `excludeCombinations` lists, each as many entries as
/// the selection draws values: a parenthesized group (`(1 _ 3)`), a group
/// with references in it (`($a 2)`), or a reference to a list (`$ec`),
/// each cut to `n` entries and dropped when shorter, as the current core
/// takes them.
pub(crate) fn parse(
    ctx: &mut PlanCtx<'_, '_>,
    pieces: Vec<ListPiece>,
    n: usize,
) -> Result<Vec<Vec<ComboEntry>>> {
    let tag = ctx.component_type().tag();
    let text_entries = |text: &str, out: &mut Vec<ComboEntry>| {
        for token in text.split(|c: char| c.is_whitespace() || c == ',') {
            match token {
                "" => {}
                "_" => out.push(ComboEntry::Any),
                t => out.push(ComboEntry::Text(t.to_string())),
            }
        }
    };
    let mut combos = Vec::new();
    for piece in pieces {
        let mut combo = Vec::new();
        match piece {
            ListPiece::Text(text) => {
                let text = text.trim();
                let inner = text
                    .strip_prefix('(')
                    .and_then(|t| t.strip_suffix(')'))
                    .unwrap_or(text);
                text_entries(inner, &mut combo);
            }
            ListPiece::Math(frags) => {
                let last = frags.len().saturating_sub(1);
                for (i, frag) in frags.into_iter().enumerate() {
                    match frag {
                        PieceFrag::Text(t) => {
                            let mut t = t.as_str();
                            if i == 0 {
                                t = t.trim_start().strip_prefix('(').unwrap_or(t);
                            }
                            if i == last {
                                t = t.trim_end().strip_suffix(')').unwrap_or(t);
                            }
                            text_entries(t, &mut combo);
                        }
                        PieceFrag::Ref(r) => combo.push(ComboEntry::Ref(r)),
                    }
                }
            }
            ListPiece::Reference(r) => {
                for entry in ctx.list_entries(vec![ListPiece::Reference(r)], f64::INFINITY)? {
                    combo.push(match entry {
                        ListEntry::Ref(p) => ComboEntry::Ref(p),
                        ListEntry::Text(_, t) => ComboEntry::Text(t),
                        ListEntry::Math(_) => {
                            return Err(Error::Unsupported(format!(
                                "<{tag} excludeCombinations> naming math with a reference"
                            )));
                        }
                    });
                }
            }
            ListPiece::Element(_) => {
                return Err(Error::Unsupported(format!(
                    "<{tag} excludeCombinations> with an element"
                )));
            }
        }
        combo.truncate(n);
        if combo.len() == n {
            combos.push(combo);
        }
    }
    Ok(combos)
}

/// The combinations as numbers, flattened, each entry a source the draw
/// reads: `_` the missing value (which matches any), text its number, a
/// reference its value. `number` reads a piece of text, None for one that
/// names no value.
pub(crate) fn sources(
    combos: &[Vec<ComboEntry>],
    number: impl Fn(&str) -> Option<f64>,
) -> Result<Vec<Source>> {
    combos
        .iter()
        .flatten()
        .map(|entry| match entry {
            ComboEntry::Any => Ok(Source::absent()),
            ComboEntry::Text(t) => number(t)
                .map(Source::constant)
                .ok_or_else(|| Error::BadValue {
                    attr: "excludeCombinations".into(),
                    text: t.clone(),
                }),
            ComboEntry::Ref(p) => Ok(Source::reference(*p)),
        })
        .collect()
}

/// The combinations' literal numbers, `_` None; None when an entry is a
/// reference or no number.
pub(crate) fn literal(
    combos: &[Vec<ComboEntry>],
    number: impl Fn(&str) -> Option<f64>,
) -> Option<Vec<Vec<Option<f64>>>> {
    combos
        .iter()
        .map(|combo| {
            combo
                .iter()
                .map(|entry| match entry {
                    ComboEntry::Any => Some(None),
                    ComboEntry::Text(t) => number(t).map(Some),
                    ComboEntry::Ref(_) => None,
                })
                .collect()
        })
        .collect()
}

/// How many ways `n` values can be drawn from `values` values: `values^n`
/// with replacement, else `values (values - 1) ...`.
fn ways(values: f64, n: usize, replace: bool) -> f64 {
    if replace {
        values.powi(n as i32)
    } else {
        (0..n).map(|i| values - i as f64).product()
    }
}

/// Merges, once over, a combination contained in another into it (`_`
/// in one where the other has a value), as the current core's
/// `mergeContainingNumberCombinations`; whether any was merged.
fn merge_once(combos: &[Vec<Option<f64>>]) -> (bool, Vec<Vec<Option<f64>>>) {
    let Some(first) = combos.first() else {
        return (false, Vec::new());
    };
    let mut merged_combos = vec![first.clone()];
    let mut any = false;
    for comb in &combos[1..] {
        let mut next = Vec::new();
        let mut merged = false;
        for old in &merged_combos {
            if merged {
                next.push(old.clone());
                continue;
            }
            let mut new = Vec::new();
            merged = true;
            // 1: into `comb`, 2: into `old`.
            let mut into = 0;
            for (v1, v2) in comb.iter().zip(old) {
                match (v1, v2) {
                    (None, None) => new.push(None),
                    (None, Some(_)) if into != 2 => {
                        new.push(None);
                        into = 1;
                    }
                    (Some(_), None) if into != 1 => {
                        new.push(None);
                        into = 2;
                    }
                    (Some(a), Some(b)) if a == b => new.push(Some(*a)),
                    _ => {
                        merged = false;
                        break;
                    }
                }
            }
            next.push(if merged { new } else { old.clone() });
        }
        if merged {
            any = true;
        } else {
            next.push(comb.clone());
        }
        merged_combos = next;
    }
    (any, merged_combos)
}

/// `combos` with every contained combination merged into its container.
pub(crate) fn merged(mut combos: Vec<Vec<Option<f64>>>) -> Vec<Vec<Option<f64>>> {
    loop {
        let (any, next) = merge_once(&combos);
        combos = next;
        if !any {
            return combos;
        }
    }
}

/// How many draws `combos` exclude, counting each `_` as every value it
/// can be (`estimateNumberOfNumberCombinationsExcluded`).
fn excluded(combos: &[Vec<Option<f64>>], values: f64, replace: bool, n: usize) -> f64 {
    combos
        .iter()
        .map(|comb| {
            let wild = comb.iter().filter(|v| v.is_none()).count();
            if wild == 0 {
                1.0
            } else if replace {
                values.powi(wild as i32)
            } else {
                let m = values - n as f64 + wild as f64;
                (0..wild).map(|i| m - i as f64).product()
            }
        })
        .sum()
}

/// How many draws two combinations both exclude, estimated
/// (`estimateNumberOfDuplicateCombinations`).
fn duplicates(combos: &[Vec<Option<f64>>], values: f64, replace: bool) -> f64 {
    if combos.is_empty() {
        return 0.0;
    }
    let mut dups = Vec::new();
    for (i, a) in combos.iter().enumerate() {
        for b in &combos[i + 1..] {
            let dup: Option<Vec<Option<f64>>> = a
                .iter()
                .zip(b)
                .map(|(v1, v2)| match (v1, v2) {
                    (None, v) | (v, None) => Some(*v),
                    (Some(x), Some(y)) if x == y => Some(Some(*x)),
                    _ => None,
                })
                .collect();
            let Some(dup) = dup else { continue };
            let fixed: Vec<f64> = dup.iter().flatten().copied().collect();
            let distinct = fixed
                .iter()
                .enumerate()
                .all(|(i, x)| !fixed[..i].contains(x));
            if replace || distinct {
                dups.push(dup);
            }
        }
    }
    let dups = merged(dups);
    let count: f64 = dups
        .iter()
        .map(|comb| {
            let wild = comb.iter().filter(|v| v.is_none()).count();
            if wild == 0 {
                1.0
            } else if replace {
                values.powi(wild as i32)
            } else {
                let m = values - comb.len() as f64 + wild as f64;
                (0..wild).map(|i| m - i as f64).product()
            }
        })
        .sum();
    count - duplicates(&dups, values, replace)
}

/// Whether `combos` (merged) exclude over 70% of the draws of `n` values,
/// as the current core estimates it before it draws: against `listed`
/// values (the sequence's length less its excludes as listed), then
/// against the `actual` values left, then less the draws counted twice.
pub(crate) fn too_many(
    combos: &[Vec<Option<f64>>],
    listed: f64,
    actual: f64,
    replace: bool,
    n: usize,
) -> bool {
    let mut count = excluded(combos, listed, replace, n);
    if count == 0.0 || count <= 0.7 * ways(listed, n, replace) {
        return false;
    }
    let possible = ways(actual, n, replace);
    if count <= 0.7 * possible {
        return false;
    }
    if combos.iter().flatten().any(Option::is_none) {
        count -= duplicates(combos, listed, replace);
    }
    count > 0.7 * possible
}

/// The greatest common divisor of whole numbers.
pub(crate) fn gcd(values: &[f64]) -> f64 {
    crate::program::dists::gcd(values)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn contained_combinations_merge() {
        let combos = vec![
            vec![Some(1.0), Some(1.0), None],
            vec![Some(3.0), Some(1.0), Some(1.0)],
            vec![None, Some(1.0), Some(1.0)],
            vec![Some(1.0), Some(1.0), Some(1.0)],
        ];
        let m = merged(combos);
        assert_eq!(m.len(), 2);
        assert!(m.contains(&vec![None, Some(1.0), Some(1.0)]));
    }

    #[test]
    fn excluding_every_place_of_one_value_is_too_many() {
        let any_place = vec![
            vec![Some(1.0), None, None],
            vec![None, Some(1.0), None],
            vec![None, None, Some(1.0)],
        ];
        assert!(too_many(&any_place, 3.0, 3.0, false, 3));
        let each_place = vec![
            vec![Some(1.0), None, None],
            vec![None, Some(2.0), None],
            vec![None, None, Some(3.0)],
        ];
        assert!(!too_many(&each_place, 3.0, 3.0, false, 3));
    }
}
