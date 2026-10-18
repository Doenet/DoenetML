//! Dotted paths as the current core's tests write them (`g.Ps[2]`,
//! `r[3].p`), resolved against the built component table: for tests, the
//! golden dump and the wasm test adapter.

use super::*;

impl Document {
    /// Resolve a dotted path as the current core's tests write it
    /// (`"g.Ps[2]"`, `"circle1"`, `"r[3].p"`): a name is visible from the
    /// scope of its nearest named ancestor outward; `[k]` picks the k-th
    /// iteration of a repeat or the k-th child of a collect or point list.
    pub fn resolve_path(&self, path: &str) -> Option<CompIdx> {
        let mut cur: Option<CompIdx> = None;
        // After `r[3]` on a repeat: the iteration a following name picks from.
        let mut iteration: Option<ScopeId> = None;
        for part in path.split('.') {
            let (name, indices) = match part.find('[') {
                Some(i) => (&part[..i], &part[i..]),
                None => (part, ""),
            };
            if !name.is_empty() {
                cur = Some(match (cur, iteration.take()) {
                    (Some(repeat), Some(scope)) => self
                        .children(repeat)
                        .filter_map(|ch| match ch {
                            Child::Component(c)
                                if self.components.scope[c as usize] == scope
                                    && self.name(c) == Some(name) =>
                            {
                                Some(c)
                            }
                            _ => None,
                        })
                        .next()?,
                    (scope, None) => self.find_in_scope(scope, name)?,
                    (None, Some(_)) => unreachable!("an iteration always follows a repeat"),
                });
            }
            for idx in indices
                .trim_end_matches(']')
                .split(']')
                .filter(|s| !s.is_empty())
            {
                let k: usize = idx.trim_start_matches('[').parse().ok()?;
                let c = cur?;
                // `s[1][2]`: the second component of the first pick.
                if let Some(scope) = iteration.take() {
                    cur = Some(
                        self.iteration(c, scope)
                            .into_iter()
                            .nth(k.checked_sub(1)?)?,
                    );
                    continue;
                }
                match self.component_type(c) {
                    ct if ct.count_prop().is_some() => {
                        let r = self.structure.repeats.iter().find(|r| r.comp == c)?;
                        iteration = Some(*r.iter_scopes.get(k.checked_sub(1)?)?);
                    }
                    ComponentType::Select => {
                        let mut picks: Vec<ScopeId> = Vec::new();
                        for ch in self.children(c) {
                            if let Child::Component(x) = ch
                                && !picks.contains(&self.components.scope[x as usize])
                            {
                                picks.push(self.components.scope[x as usize]);
                            }
                        }
                        iteration = Some(*picks.get(k.checked_sub(1)?)?);
                    }
                    _ => {
                        cur = self
                            .children(c)
                            .filter_map(|ch| match ch {
                                Child::Component(cc) => Some(cc),
                                _ => None,
                            })
                            .nth(k.checked_sub(1)?);
                    }
                }
            }
        }
        // A path ending at `r[3]` names the iteration's single component.
        match (cur, iteration) {
            (Some(repeat), Some(scope)) => match self.iteration(repeat, scope).as_slice() {
                [c] => Some(*c),
                _ => None,
            },
            _ => cur,
        }
    }

    /// The components one iteration of a repeat (or one pick of a select)
    /// contributes.
    fn iteration(&self, repeat: CompIdx, scope: ScopeId) -> Vec<CompIdx> {
        self.children(repeat)
            .filter_map(|ch| match ch {
                Child::Component(c) if self.components.scope[c as usize] == scope => Some(c),
                _ => None,
            })
            .collect()
    }

    /// The unique component named `name` visible from `scope` (None: the
    /// document): a descendant not hidden inside a repeat, or `scope`
    /// itself. Several visible matches are ambiguous and resolve to nothing,
    /// except that repeat iterations fall back to the first in document
    /// order so plain names inside a repeat keep working for tests.
    fn find_in_scope(&self, scope: Option<CompIdx>, name: &str) -> Option<CompIdx> {
        if let Some(sc) = scope
            && self.name(sc) == Some(name)
        {
            return Some(sc);
        }
        let matches: Vec<CompIdx> = (0..self.components.len() as CompIdx)
            .filter(|&c| self.name(c) == Some(name) && self.visible_from(scope, c))
            .collect();
        match matches.as_slice() {
            [c] => Some(*c),
            [] => (0..self.components.len() as CompIdx)
                .find(|&c| self.name(c) == Some(name) && self.is_descendant(scope, c)),
            many => {
                // Children of a container copy are reached through the copy's
                // name; among bare matches only originals count.
                let originals: Vec<CompIdx> = many
                    .iter()
                    .copied()
                    .filter(|&c| !self.inside_copy(scope, c))
                    .collect();
                if originals.len() == 1 {
                    Some(originals[0])
                } else {
                    None
                }
            }
        }
    }

    /// Whether `c` is below `scope` with no repeat strictly between them.
    fn visible_from(&self, scope: Option<CompIdx>, c: CompIdx) -> bool {
        let mut p = self.parent(c);
        while let Some(pc) = p {
            if Some(pc) == scope {
                return true;
            }
            if self.component_type(pc).count_prop().is_some() {
                return false;
            }
            // A built case that is not the active one is not there.
            if self.component_type(pc) == ComponentType::Case
                && self.cells[self.comp_cells(pc)[prop::case::ACTIVE] as usize] != 1.0
            {
                return false;
            }
            p = self.parent(pc);
        }
        scope.is_none()
    }

    /// Whether a synthesized (copied) component lies between `scope` and `c`.
    fn inside_copy(&self, scope: Option<CompIdx>, c: CompIdx) -> bool {
        let mut cur = Some(c);
        while let Some(x) = cur {
            if Some(x) == scope {
                return false;
            }
            if self.components.dast_node[x as usize] == NONE
                && self.component_type(x) != ComponentType::Document
            {
                return true;
            }
            cur = self.parent(x);
        }
        false
    }

    fn is_descendant(&self, scope: Option<CompIdx>, c: CompIdx) -> bool {
        let mut p = self.parent(c);
        while let Some(pc) = p {
            if Some(pc) == scope {
                return true;
            }
            p = self.parent(pc);
        }
        scope.is_none()
    }
}
