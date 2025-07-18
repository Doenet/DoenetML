//! For each node, calculate the simplest name by which the node can be referenced
//! with the root as the origin. Since the names are designed to be HTML ids,
//! use `:` (rather than `[]`) to join index resolutions to create the names.

use super::node_traversal::*;
use super::*;

impl Resolver {
    /// Given the data from `resolver`, calculate the root name for each node,
    /// i.e., a name that represents one of the shortest paths through which the node can be referenced from the root.
    ///
    /// Each root name is a representation of a reference to the node from the root that is a valid HTML id.
    /// For this reason, they use a non-standard notation for indices,
    /// where `[3]` is replaced with `:3`. For example, a reference `$a.b[3][4].c`
    /// would be represented by the name `a.b:3:4.c`.
    ///
    /// The shortest paths are calculated via a deterministic breadth-first search of the resolver graph,
    /// where resolutions of names take priority over resolutions of indices.
    /// If there are multiple paths with the same type of edges, the path chosen for the name is arbitrary
    /// but fixed.
    ///
    /// Returns a vector indexed by the node index. The vector entries entries are:
    /// - `None`: if the node does not have a uniquely accessible name from the root
    /// - `Some(name)`: where `name` is represents one of the shortest resolution paths to the node
    ///
    /// For example, consider the DoenetML.
    /// ```xml
    /// <a name="y"><group name="g"><b /><c name="x" /></group></a>
    /// <d name="x" />
    /// ```
    /// The results for different nodes would be
    /// - `<a>`: `Some("y")`, as `<a>` is directly resolvable from the root as `$y`
    /// - `<b>`: `Some("g:1")`, as `$g[1]` is the only reference from root that resolves to `<b/>`
    /// - `<c>`: `Some("y.x")`, as `"y.x"` will be selected in preference to `g:2` (as sub-names are searched before indices)
    /// - `<d>`: `None`, as `<d>` does not have a unique reference from the root
    pub fn calculate_root_names(&self) -> Vec<Option<String>> {
        // Note: resolver's data has one more entry than number of nodes as it also contains the root
        let n_nodes = self.node_resolver_data.len() - 1;

        let mut root_names = vec![None; n_nodes];

        for edge in self.breadth_first_traversal() {
            match edge.origin {
                NodeOrRoot::Root => {
                    root_names[edge.referent] = match edge.edge_type {
                        ResolverEdgeType::Name(name) => Some(name),
                        ResolverEdgeType::Index(_) => {
                            unreachable!("Root cannot have an index resolution")
                        }
                    }
                }
                NodeOrRoot::Node(idx) => {
                    let origin_name = root_names[idx]
                        .clone()
                        .expect("Incorrect breadth-first traversal of resolver data");

                    root_names[edge.referent] = match edge.edge_type {
                        ResolverEdgeType::Name(name) => Some(format!("{origin_name}.{name}")),
                        ResolverEdgeType::Index(index) => {
                            Some(format!("{origin_name}:{}", index + 1))
                        }
                    }
                }
            }
        }

        root_names
    }
}

#[cfg(test)]
#[path = "root_names.test.rs"]
mod test;
