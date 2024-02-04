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
enum Ref {
    Unique(Index),
    Ambiguous(Vec<Index>),
}

/// A `Resolver` is used to lookup elements by path/name. It constructs a search index
/// upon construction. If the underlying `FlatRoot` changes, a new `Resolver` should be
/// recreated.
pub struct Resolver<'a> {
    flat_root: &'a FlatRoot,
    name_map: Vec<HashMap<String, Ref>>,
}

impl<'a> Resolver<'a> {
    pub fn from_flat_root(flat_root: &'a FlatRoot) -> Self {
        Resolver {
            flat_root,
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
        while let Some(parent) = self.flat_root.nodes[current_idx].parent() {
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
        let mut descendant_names =
            Vec::from_iter(flat_root.nodes.iter().filter_map(|node| match node {
                // Only elements can have names
                FlatNode::Element(_) => Some(HashMap::new()),
                _ => None,
            }));

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
mod test {
    use super::*;
    use crate::{
        dast::{DastIndex, DastText, DastTextMacroContent},
        test_utils::*,
    };

    fn find_node_index_by_name(flat_root: &FlatRoot, name: &str) -> Option<Index> {
        flat_root.nodes.iter().find_map(|node| match node {
            FlatNode::Element(e) if e.name == name => Some(e.idx),
            _ => None,
        })
    }

    fn make_path<'a, T: AsRef<[&'a str]>>(path_str: T) -> Vec<PathPart> {
        let path_str = path_str.as_ref();
        path_str
            .iter()
            .map(|s| PathPart {
                name: s.to_string(),
                index: Vec::new(),
                position: None,
            })
            .collect()
    }

    #[test]
    fn can_resolve_name_among_parents() {
        let dast_root = dast_root_no_position(
            r#"<a name="x">
            <b name="y">
                <c name="z" />
            </b>
        </a>
        <d name="y" />"#,
        );
        let flat_root = FlatRoot::from_dast(&dast_root);
        let b_idx = find_node_index_by_name(&flat_root, "b").unwrap();
        let c_idx = find_node_index_by_name(&flat_root, "c").unwrap();
        let d_idx = find_node_index_by_name(&flat_root, "d").unwrap();

        let resolver = Resolver::from_flat_root(&flat_root);
        // Searching from `c` for `y` should find the `b` node
        let referent = resolver.search_parents("y", c_idx);
        assert_eq!(referent, Ok(b_idx));

        let referent = resolver.search_parents("y", b_idx);
        assert_eq!(referent, Ok(b_idx));

        // Searching from `d` should fail because there are multiple `y`s that could be referred to.
        let referent = resolver.search_parents("y", d_idx);
        assert_eq!(referent, Err(ResolutionError::NonUniqueReferent));
    }

    #[test]
    fn can_resolve_names() {
        let dast_root = dast_root_no_position(
            r#"<a name="x">
            <b name="y">
                <c name="z" />
            </b>
        </a>
        <d name="y" />"#,
        );
        let flat_root = FlatRoot::from_dast(&dast_root);
        let b_idx = find_node_index_by_name(&flat_root, "b").unwrap();
        let c_idx = find_node_index_by_name(&flat_root, "c").unwrap();

        let resolver = Resolver::from_flat_root(&flat_root);

        // Searching from `c` for `y` should find the `b` node
        let referent = resolver.resolve(make_path(["y"]), c_idx);
        assert_eq!(
            referent,
            Ok(RefResolution {
                node_idx: b_idx,
                unresolved_path: None
            })
        );

        let referent = resolver.resolve(make_path(["y", "z"]), c_idx);
        assert_eq!(
            referent,
            Ok(RefResolution {
                node_idx: c_idx,
                unresolved_path: None
            })
        );

        // Unused path part is left intact
        let referent = resolver.resolve(make_path(["y", "z", "w"]), c_idx);
        assert_eq!(
            referent,
            Ok(RefResolution {
                node_idx: c_idx,
                unresolved_path: Some(vec![PathPart {
                    name: "w".into(),
                    index: vec![],
                    position: None
                }])
            })
        );
    }

    #[test]
    fn resolution_stops_at_path_index() {
        let dast_root = dast_root_no_position(
            r#"<a name="x">
            <b name="y">
                <c name="z" />
            </b>
        </a>
        <d name="y" />"#,
        );
        let flat_root = FlatRoot::from_dast(&dast_root);
        let b_idx = find_node_index_by_name(&flat_root, "b").unwrap();
        let c_idx = find_node_index_by_name(&flat_root, "c").unwrap();

        let resolver = Resolver::from_flat_root(&flat_root);

        let path = vec![
            PathPart {
                name: "y".into(),
                index: vec![],
                position: None,
            },
            PathPart {
                name: "z".into(),
                index: vec![],
                position: None,
            },
        ];
        let referent = resolver.resolve(path, c_idx);
        assert_eq!(
            referent,
            Ok(RefResolution {
                node_idx: c_idx,
                unresolved_path: None
            })
        );

        let index = vec![DastIndex {
            value: vec![DastTextMacroContent::Text(DastText {
                value: "2".into(),
                position: None,
                data: None,
            })],
            position: None,
        }];
        let path = vec![
            PathPart {
                name: "y".into(),
                index: index.clone(),
                position: None,
            },
            PathPart {
                name: "z".into(),
                index: vec![],
                position: None,
            },
        ];
        let referent = resolver.resolve(path, c_idx);
        assert_eq!(
            referent,
            Ok(RefResolution {
                node_idx: b_idx,
                unresolved_path: Some(vec![
                    PathPart {
                        name: "".into(),
                        index: index.clone(),
                        position: None
                    },
                    PathPart {
                        name: "z".into(),
                        index: vec![],
                        position: None
                    }
                ])
            })
        );
    }
}
