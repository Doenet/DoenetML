//! Whether an edit is safe for every student (ADR 0017, step 4): the two
//! versions' input signatures compared, from the sources alone.

use super::*;
use crate::build::signature::{Domain, Input, Signature};
use crate::build::{self};

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
    /// Which condition: 1 (unchanged), 2 (the cells it writes), 3 (its
    /// derivation) or 4 (a new input reading old state).
    pub condition: u8,
    /// Its element in the new version, if it has one.
    pub node: Option<NodeId>,
    /// Its element in the published version, if it had one.
    pub old_node: Option<NodeId>,
    pub reason: String,
}

/// The input signature of `dast` (ADR 0017, step 3), from the check's
/// build. Every key goes through `rename`.
pub(crate) fn signature_renamed(dast: &Dast, rename: &dyn Fn(&str) -> String) -> Result<Signature> {
    let dast = Arc::new(dast.clone());
    let mut boxed: HashSet<NodeId> = HashSet::new();
    loop {
        let attempt = Compiler::compile(&dast, &boxed)
            .and_then(|compiled| Ok((build::probe(&compiled)?, compiled)));
        match attempt {
            Ok((u, compiled)) => return Ok(u.signature(&compiled, rename)),
            Err(f) => match f.node.filter(|n| boxed.insert(*n)) {
                Some(_) => {}
                None => return Err(f.error),
            },
        }
    }
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
    Ok(compare(&old, &new))
}

/// Step 4's four conditions, between the published version's signature and
/// the draft's.
pub(crate) fn compare(old: &Signature, new: &Signature) -> EditReport {
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
        // 2. The essential cells it writes: same keys, types and sharing.
        if o.cells != n.cells {
            fail(
                key,
                2,
                Some(o),
                Some(n),
                "the state it writes changed".into(),
            );
            continue;
        }
        // 3. Its derivation: what it shows, its defaults, whether it
        // exists or can be acted on.
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
                3,
                Some(o),
                Some(n),
                "what decides what it shows, or whether it exists or can be acted on, changed"
                    .into(),
            );
        }
    }
    // 4. A new input reads no old essential cell, unless its domain holds
    // every value.
    let old_cells: HashSet<&(String, String)> =
        old.inputs.values().flat_map(|i| i.cells.keys()).collect();
    // What a new input reads: every essential cell of its closure.
    for (key, n) in &new.inputs {
        if old.inputs.contains_key(key) || n.domain == Domain::Any {
            continue;
        }
        if let Some((k, p)) = n.defaults.keys().find(|c| old_cells.contains(c)) {
            fail(
                key,
                4,
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
