//! Diagnostics (ADR 0013): what the build reports about a document beyond
//! the cells it makes. An error names an element that could not be built
//! and stands in the document as an `_error` component; a warning, an
//! info or an accessibility finding names an element that was.
//!
//! A diagnostic is a function of the document text alone. The build
//! collects them (`BuildOutput::diagnostics`); [`crate::diagnose`] builds
//! once through the exhaustive view, so the list covers every branch and
//! every repeat body whatever the seed or the counts; a tick never
//! produces one. Each names its node in the DAST, not a position: the
//! caller that holds the parser's DAST (the language server, the viewer)
//! maps the node to a position.

use std::collections::BTreeMap;

use serde::Serialize;

use crate::Error;
use crate::dast::NodeId;

/// The four kinds the current core's `DiagnosticRecord` has.
#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Hash, Serialize)]
#[serde(rename_all = "lowercase")]
pub enum Kind {
    Error,
    Warning,
    Info,
    Accessibility,
}

#[derive(Debug, Clone, PartialEq, Eq, PartialOrd, Ord, Serialize)]
pub struct Diagnostic {
    pub kind: Kind,
    /// Accessibility only: 1 is a WCAG AA violation, 2 advisory.
    #[serde(skip_serializing_if = "Option::is_none")]
    pub level: Option<u8>,
    /// The stable name of the situation: a `doenet-` code of the i18n
    /// registry (`packages/i18n/src/diagnostics.ts`) where it has one,
    /// else a `cells-` code of this core's own, to be registered.
    pub code: &'static str,
    /// The finding as an English sentence.
    pub message: String,
    /// The DAST node the diagnostic is about; none for a finding about the
    /// document as a whole (a cycle).
    #[serde(skip_serializing_if = "Option::is_none")]
    pub node: Option<NodeId>,
    /// The values that fill the coded message's blanks, for a caller that
    /// renders the code in another language.
    #[serde(skip_serializing_if = "BTreeMap::is_empty")]
    pub args: BTreeMap<&'static str, String>,
}

impl Diagnostic {
    /// The element at `node` could not be built because of `error`.
    pub fn error(node: Option<NodeId>, error: &Error) -> Diagnostic {
        Diagnostic {
            kind: Kind::Error,
            level: None,
            code: error.code(),
            message: error.to_string(),
            node,
            args: BTreeMap::new(),
        }
    }

    pub fn warning(code: &'static str, node: Option<NodeId>, message: String) -> Diagnostic {
        Diagnostic {
            kind: Kind::Warning,
            level: None,
            code,
            message,
            node,
            args: BTreeMap::new(),
        }
    }

    pub fn accessibility(
        level: u8,
        code: &'static str,
        node: NodeId,
        message: String,
        args: BTreeMap<&'static str, String>,
    ) -> Diagnostic {
        Diagnostic {
            kind: Kind::Accessibility,
            level: Some(level),
            code,
            message,
            node: Some(node),
            args,
        }
    }
}

/// The order a list is reported in: by node, so the list follows the
/// document, with findings about the whole document last.
pub fn sort(list: &mut [Diagnostic]) {
    list.sort_by(|a, b| {
        let key = |d: &Diagnostic| {
            (
                d.node.unwrap_or(u32::MAX),
                d.kind,
                d.code,
                d.message.clone(),
            )
        };
        key(a).cmp(&key(b))
    });
}

impl Error {
    /// The code of the diagnostic an error becomes. A `doenet-` code where
    /// the registry names the same situation (whatever letter it gives it:
    /// the registry's letter is the current core's kind, ours is an error
    /// because the element did not build); a `cells-` code otherwise.
    pub fn code(&self) -> &'static str {
        use Error::*;
        match self {
            Json(_) => "cells-invalid-json",
            WireFormat(_) => "cells-invalid-wire-format",
            // component-type-invalid
            UnsupportedTag(_) => "doenet-e0002",
            DuplicateName(_) => "cells-duplicate-name",
            // reference-multiple-referents
            AmbiguousName(_) => "doenet-w0105",
            // reference-no-referent
            UnknownName(_) => "doenet-w0104",
            UnknownProp { .. } => "cells-unknown-prop",
            PathTooDeep(_) => "cells-path-too-deep",
            NoDefaultProp(_) => "cells-no-default-prop",
            UncopyableType(_) => "cells-uncopyable-type",
            ExtendTypeMismatch { .. } => "cells-extend-type-mismatch",
            ArityMismatch { .. } => "cells-arity-mismatch",
            BadValue { .. } => "cells-bad-attribute-value",
            BadLiteralParam(_) => "cells-bad-literal-param",
            UnknownOp(_) => "cells-unknown-op",
            OpArity { .. } => "cells-op-arity",
            MissingParam { .. } => "cells-missing-param",
            LiteralArg => "cells-literal-arg",
            // composite-circular-dependency
            Cycle(_) => "doenet-e0005",
            DynamicIndex(_) => "cells-dynamic-index",
            BadIndex(_) => "cells-bad-index",
            NotIndexable(_) => "cells-not-indexable",
            AmbiguousIteration(..) => "cells-ambiguous-iteration",
            BadCollectType(_) => "cells-bad-collect-type",
            BadCollect => "cells-bad-collect",
            UnstableStructure(_) => "cells-unstable-structure",
            BadMath { .. } => "cells-bad-math",
            Unsupported(_) => "cells-unsupported",
            Banned(_) => "cells-banned",
            NotInInterface { .. } => "cells-not-in-interface",
        }
    }
}
