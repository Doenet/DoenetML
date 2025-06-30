use serde::Serialize;
use thiserror::Error;
use tsify_next::Tsify;

use crate::dast::flat_dast::FlatPathPart;

#[derive(Clone, Debug, Serialize, Error, PartialEq, Copy)]
#[cfg_attr(feature = "web", derive(Tsify))]
#[cfg_attr(feature = "web", tsify(into_wasm_abi))]
pub enum ResolutionError {
    #[error("No node identified by path")]
    NoReferent,
    #[error("Path referred to more than one node")]
    NonUniqueReferent,
}

/// Format an error message given that `err` was produced when trying to resolve `path`.
/// Since the resolve algorithm stops when any index is found,
/// this message includes the path up to any index.
///
/// For example, given this DoenetML
/// ```xml
/// <text name="t" /><text name="t" />
/// $a.b.c[1].d
/// $t.a[1].b
/// ```
/// the error messages for the two references will be
/// - `"No referent found for reference: $a.b.c"`, and
/// - `"Multiple references found for reference: $t.a`.
pub fn format_error_message(err: ResolutionError, path: &[FlatPathPart]) -> String {
    // Note: this message could potentially be improved by recording
    // the start and end location of the reference node
    // and using the entire DoenetML string that created the reference
    let mut paths_until_first_index = vec![];
    for path_part in path.iter() {
        if !path_part.name.is_empty() {
            paths_until_first_index.push(path_part.name.clone())
        }
        if !path_part.index.is_empty() {
            break;
        }
    }
    let paths_string = paths_until_first_index.join(".");

    match err {
        ResolutionError::NoReferent => {
            format!("No referent found for reference: ${paths_string}")
        }
        ResolutionError::NonUniqueReferent => {
            format!("Multiple referents found for reference: ${paths_string}")
        }
    }
}
