//! Refs use a `path`, which consists of _names_ separated by dots (e.g. `a.b.c`), possibly followed by
//! prop names separated by dots (e.g. `a.b.c.x.y.z`). A `Resolver` searches for a matching node
//! from a given starting position. Because a `Resolver` does not know whether part of a path corresponds to a
//! name or prop name, the longest valid partial match is used and unmatched portions of a `path` are
//! preserved for future use.

mod build_resolver;
mod compactify;
mod errors;
mod index_resolutions;
mod resolve;
mod root_names;

pub use errors::*;
pub use index_resolutions::*;
pub use resolve::*;
pub use root_names::*;

#[cfg(test)]
mod test_helpers;
