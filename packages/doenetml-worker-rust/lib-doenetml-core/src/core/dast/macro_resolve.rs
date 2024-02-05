//! Macros use a `path`, which consists of _names_ separated by dots (e.g. `a.b.c`), possibly followed by
//! state variable names separated by dots (e.g. `a.b.c.x.y.z`). A `Resolver` searches for a matching node
//! from a given starting position. Because a `Resolver` does not know whether part of a path corresponds to a
//! name or state variable name, the longest valid partial math is used and unmatched portions of a `path` are
//! preserved for future use.

use std::{collections::HashMap, iter, mem};

use crate::dast::untagged_flat_dast::{FlatNode, UntaggedContent};

use super::{
    untagged_flat_dast::{FlatRoot, Index},
    PathPart,
};
use serde::Serialize;
use thiserror::Error;

#[derive(Clone, Debug, Error, PartialEq)]
pub enum ResolutionError {
    #[error("No node identified by path")]
    NoReferent,
    #[error("Path referred to more than one node")]
    NonUniqueReferent,
}

#[derive(Clone, Debug, PartialEq, Serialize)]
pub struct RefResolution {
    pub node_idx: Index,
    pub unresolved_path: Option<Vec<PathPart>>,
}

/// Status of a pointer referring to children of an element.
#[derive(Debug)]
enum Ref {
    Unique(Index),
    Ambiguous(Vec<Index>),
}

/// A `Resolver` is used to lookup elements by path/name. It constructs a search index
/// upon construction. If the underlying `FlatRoot` changes, a new `Resolver` should be
/// recreated.
#[derive(Debug)]
pub struct Resolver {
    /// List of the parent of a node at a given index.
    node_parent: Vec<Option<Index>>,
    /// Map of all the names that are accessible (as descendants) from a given node.
    name_map: Vec<HashMap<String, Ref>>,
}

impl Resolver {
    pub fn from_flat_root(flat_root: &FlatRoot) -> Self {
        Resolver {
            node_parent: flat_root.nodes.iter().map(|node| node.parent()).collect(),
            name_map: Self::build_name_map(flat_root),
        }
    }

    /// Search for a node specified by `path` starting from `origin`. This algorithm searches first
    /// for the nearest parent that has an element with `path[0].name` as its name. Then it tries
    /// to match as much of `path[1..]` as possible. A match is returned along with any unmatched
    /// path parts.
    ///
    /// For example, consider
    /// ```xml
    /// <a name="x">
    ///     <b name="y">
    ///         <c name="z" />
    ///     </b>
    /// </a>
    /// <d name="y" />
    /// ```
    /// - Matching `x` from anywhere returns the index of `<a />`.
    /// - Matching `y` from `<c />` returns the index of `<b />`.
    /// - Matching `y` from `<d />` returns an error because there are multiple `y`s accessible from that position.
    /// - Matching `y.z.w` from `<b />` returns the index of `<c />` along with `.w` as the unresolved path.
    ///
    /// If an index appears in the path (e.g. `a[2].b`), the search stops and the remaining path is returned.
    /// If there was a partial match of the indexed item, the unresolved path will list `name` as an empty string.
    /// E.g., matching `y.w[2]` from `<b />` returns the index of `<d />` along with `.w[2]` as the unresolved path
    /// and matching `y[2]` from `<b />` returns the index of `<d />` along with `.[2]` as the unresolved path.
    pub fn resolve<T: AsRef<[PathPart]>>(
        &self,
        path: T,
        origin: Index,
    ) -> Result<RefResolution, ResolutionError> {
        let path = path.as_ref();
        let mut current_idx = origin;
        let mut path = path.iter();
        let first_path_part = path.next().ok_or(ResolutionError::NoReferent)?;

        current_idx = self.search_parents(&first_path_part.name, current_idx)?;
        // If we made it here, the first entry in `path` has a valid referent.
        // If this entry also has an index, we need to stop searching. This would
        // happen if the reference was something like `$a[2].b`.
        if !first_path_part.index.is_empty() {
            let remaining_path: Vec<PathPart> = iter::once(PathPart {
                name: "".into(),
                index: first_path_part.index.clone(),
                position: first_path_part.position.clone(),
            })
            .chain(path.cloned())
            .collect();
            return Ok(RefResolution {
                node_idx: current_idx,
                unresolved_path: Some(remaining_path),
            });
        }

        while let Some(part) = path.next() {
            // current_idx specifies the "root" of the search. We try to resolve
            // children based on the path part, breaking if any of them are not found or if
            // there is an `index` specified.
            if let Some(referent) = self.name_map[current_idx].get(&part.name) {
                match referent {
                    Ref::Unique(idx) => {
                        current_idx = *idx;
                    }
                    Ref::Ambiguous(_) => {
                        return Err(ResolutionError::NonUniqueReferent);
                    }
                }
                // If there index specified, we immediately stop since component information is needed
                // to resolve all remaining path parts.
                if !part.index.is_empty() {
                    let remaining_path: Vec<PathPart> =
                        iter::once(part.clone()).chain(path.cloned()).collect();
                    return Ok(RefResolution {
                        node_idx: current_idx,
                        unresolved_path: Some(remaining_path),
                    });
                }
            } else {
                // If we cannot find an appropriate child, the remaining path parts might be
                // state variable references. Return them and consider `current_idx` the match.
                let remaining_path: Vec<PathPart> =
                    iter::once(part.clone()).chain(path.cloned()).collect();
                return Ok(RefResolution {
                    node_idx: current_idx,
                    unresolved_path: Some(remaining_path),
                });
            }
        }

        // We've fully resolved and there are no remaining path parts.
        Ok(RefResolution {
            node_idx: current_idx,
            unresolved_path: None,
        })
    }

    /// Search up the chain of parents to find the first node that has `name` accessible.
    /// Return the referent of `name`.
    fn search_parents(&self, name: &str, origin: Index) -> Result<Index, ResolutionError> {
        let mut current_idx = origin;
        while let Some(parent) = self.node_parent[current_idx] {
            if let Some(resolved) = self.name_map[parent].get(name) {
                match resolved {
                    Ref::Unique(idx) => {
                        return Ok(*idx);
                    }
                    Ref::Ambiguous(_) => {
                        return Err(ResolutionError::NonUniqueReferent);
                    }
                }
            }
            current_idx = parent;
        }
        Err(ResolutionError::NoReferent)
    }

    /// Build a map of all the names that are accessible from a given node
    /// and the indices of the referents.
    fn build_name_map(flat_root: &FlatRoot) -> Vec<HashMap<String, Ref>> {
        // Pre-populate with empty hashmaps for each element
        let mut descendant_names = iter::repeat_with(HashMap::new)
            .take(flat_root.nodes.len())
            .collect::<Vec<_>>();

        for element in flat_root.nodes.iter().filter_map(|node| match node {
            // Only elements can have names
            FlatNode::Element(element) => Some(element),
            _ => None,
        }) {
            let name = element
                .attributes
                .iter()
                .find(|attr| {
                    attr.name == "name"
                        && attr.children.len() == 1
                        && matches!(attr.children[0], UntaggedContent::Text(_))
                })
                .and_then(|attr| {
                    match (attr.children.len(), attr.children.first()) {
                        // A name attribute should have exactly one text child. Otherwise it is considered invalid.
                        (1, Some(UntaggedContent::Text(name))) => Some(name.clone()),
                        _ => None,
                    }
                });
            if name.is_none() {
                continue;
            }
            let name = name.unwrap();
            for parent in flat_root.parent_iter(element.idx) {
                descendant_names[parent.idx]
                    .get_mut(&name)
                    .map(|x| {
                        *x = match x {
                            // There is already something sharing the name `name` with the current element
                            // so we mark it as ambiguous
                            Ref::Unique(idx) => Ref::Ambiguous(vec![*idx, element.idx]),
                            Ref::Ambiguous(vec) => {
                                vec.push(element.idx);
                                Ref::Ambiguous(mem::take(vec))
                            }
                        };
                    })
                    .unwrap_or_else(|| {
                        // There is no current match for the name `name`, so we have a unique reference
                        descendant_names[parent.idx].insert(name.clone(), Ref::Unique(element.idx));
                    });
            }
        }

        descendant_names
    }
}

#[cfg(test)]
#[path = "macro_resolve.test.rs"]
mod test;
