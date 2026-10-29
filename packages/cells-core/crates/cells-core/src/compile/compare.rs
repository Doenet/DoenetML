//! Whether an edit is safe for every student (ADR 0017, step 4): the two
//! versions' input signatures compared, from the sources alone.

use super::check::signature_renamed;
use super::*;
use crate::build::signature::{Domain, Input, Signature};

/// What `compare_versions` finds.
#[derive(Debug, Clone, Default, PartialEq)]
pub struct EditReport {
    /// Every input that fails a condition; the edit is safe when none does.
    pub failures: Vec<EditFailure>,
}

impl EditReport {
    pub fn safe(&self) -> bool {
        self.failures.is_empty()
    }
}

/// One input failing one condition of step 4.
#[derive(Debug, Clone, PartialEq)]
pub struct EditFailure {
    /// The input's key, in the new version's names.
    pub key: String,
    /// Which condition: 1 (unchanged), 2 (its derivation) or 3 (a new
    /// input reading old state).
    pub condition: u8,
    /// Its element in the new version, if it has one.
    pub node: Option<NodeId>,
    /// Its element in the published version, if it had one.
    pub old_node: Option<NodeId>,
    pub reason: String,
}

/// The input signature of `dast` (ADR 0017, step 3).
pub fn input_signature(dast: &Dast) -> Result<Signature> {
    signature_renamed(dast, &|k| k.to_string())
}

/// Whether publishing `new` over `old` is safe for every student (ADR
/// 0017, step 4), and if not, which inputs fail which condition.
/// `renames` maps an element's key in `old` to its key in `new`, as an
/// editor that made the rename records it; a key under a renamed one is
/// renamed with it.
pub fn compare_versions(
    old: &Dast,
    new: &Dast,
    renames: &[(String, String)],
) -> Result<EditReport> {
    let rename = |k: &str| -> String {
        for (from, to) in renames {
            if let Some(rest) = k.strip_prefix(from.as_str())
                && (rest.is_empty() || rest.starts_with(['.', '[', '+']))
            {
                return format!("{to}{rest}");
            }
        }
        k.to_string()
    };
    let old = signature_renamed(old, &rename)?;
    let new = input_signature(new)?;
    Ok(compare_signatures(&old, &new))
}

/// Step 4's three conditions, between the published version's signature and
/// the draft's: `compare_versions` for a caller that keeps the published
/// version's signature rather than computing it for every draft.
pub fn compare_signatures(old: &Signature, new: &Signature) -> EditReport {
    let mut failures = Vec::new();
    let mut fail = |key: &str, condition, o: Option<&Input>, n: Option<&Input>, reason: String| {
        failures.push(EditFailure {
            key: key.to_string(),
            condition,
            node: n.map(|i| i.node),
            old_node: o.map(|i| i.node),
            reason,
        })
    };
    for (key, o) in &old.inputs {
        let Some(n) = new.inputs.get(key) else {
            fail(key, 1, Some(o), None, "removed".into());
            continue;
        };
        // 1. Unchanged: the same props and types, a domain the same or
        // larger.
        if o.tag != n.tag || o.props != n.props {
            fail(
                key,
                1,
                Some(o),
                Some(n),
                format!("changed from a <{}> or its props", o.tag),
            );
            continue;
        }
        if !o.domain.within(&n.domain) {
            fail(
                key,
                1,
                Some(o),
                Some(n),
                domain_change(&o.domain, &n.domain),
            );
            continue;
        }
        // 2. Its derivation: what it shows, its defaults, whether it
        // exists or can be acted on. It names every essential cell it
        // reads by key and type, so the state it writes is part of it.
        // A default may change only where it is the input's starting
        // value in both versions.
        let defaults_kept = o.defaults.iter().all(|(cell, &(d, own))| {
            n.defaults
                .get(cell)
                .is_some_and(|&(nd, nown)| nd == d || (own && nown))
        });
        if o.derivation != n.derivation || !defaults_kept {
            fail(
                key,
                2,
                Some(o),
                Some(n),
                "what decides what it shows, or whether it exists or can be acted on, changed"
                    .into(),
            );
        }
    }
    // 3. A new input reads no old essential cell, unless its domain holds
    // every value. Every essential cell is one some input writes (ADR
    // 0018), so it is in that input's closure.
    let old_cells: HashSet<&(String, String)> = old
        .inputs
        .values()
        .flat_map(|i| i.defaults.keys())
        .collect();
    // What a new input reads: every essential cell of its closure.
    for (key, n) in &new.inputs {
        if old.inputs.contains_key(key) || n.domain == Domain::Any {
            continue;
        }
        if let Some((k, p)) = n.defaults.keys().find(|c| old_cells.contains(c)) {
            fail(
                key,
                3,
                None,
                Some(n),
                format!("a new input that reads {k}.{p}, which students may have changed"),
            );
        }
    }
    EditReport { failures }
}

fn domain_change(old: &Domain, new: &Domain) -> String {
    match (old, new) {
        (Domain::Bounds(_), Domain::Bounds(_)) => "its graph's bounds narrowed".into(),
        (Domain::Choices(_), Domain::Choices(_)) => {
            "its choices changed other than by appending".into()
        }
        (Domain::Options { .. }, _) => "its options changed".into(),
        _ => "the values it can take changed".into(),
    }
}
