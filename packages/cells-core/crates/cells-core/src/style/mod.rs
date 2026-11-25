//! Styles, settled at load (ADR 0084): each `<styleDefinition>` and
//! `<stylePalette>` of the document and of each section, read from the
//! source alone into a table of constants per scope, as the JavaScript
//! core's `authoredStyleDefinitions` merges them (`style.ts`): a scope
//! starts from its palette, else its parent scope's table, else the
//! default palette, and its definitions apply over it in document order.
//! The contrast diagnostics are read off each table
//! (`styleContrastAccessibility.ts`). A component's `selectedStyle` is
//! its scope's style for its style number with its own override
//! attributes over it ([`crate::Document::selected_style`]).

use std::collections::{BTreeMap, HashMap};
use std::sync::Arc;

use crate::components::ComponentType;
use crate::dast::{Dast, NodeId, NodeKind};
use crate::diagnostics::Diagnostic;

pub(crate) mod color;
mod names;
mod palettes;
mod table;

pub(crate) use table::{Key, Style, Val};

/// The styles of one scope: the table its definitions make, and the
/// palette it or a parent scope selected, whose size out-of-range style
/// numbers cycle through.
#[derive(Debug, Clone, PartialEq)]
pub(crate) struct Scope {
    styles: BTreeMap<u32, Style>,
    palette: Option<usize>,
}

impl Scope {
    /// The default palette's table, with no palette selected.
    fn root() -> Scope {
        Scope {
            styles: palette_styles(0),
            palette: None,
        }
    }

    /// `styleDefinitionForStyleNumber`: the style number `n` names, the
    /// palette's cycled one when a palette is selected, else the defaults.
    pub(crate) fn style(&self, n: f64) -> Style {
        let found = whole(n).and_then(|k| {
            self.styles.get(&k).or_else(|| {
                let p = self.palette?;
                let size = palettes::PALETTES[p].styles.len() as u32;
                self.styles.get(&((k - 1) % size + 1))
            })
        });
        found.cloned().unwrap_or_else(Style::default_style)
    }
}

/// `n` as a style number a table may hold: a whole number from 1.
fn whole(n: f64) -> Option<u32> {
    (n.fract() == 0.0 && n >= 1.0 && n <= u32::MAX as f64).then_some(n as u32)
}

/// A palette's styles, numbered from 1.
fn palette_styles(p: usize) -> BTreeMap<u32, Style> {
    palettes::PALETTES[p]
        .styles
        .iter()
        .enumerate()
        .map(|(i, s)| (i as u32 + 1, Style::preset(s)))
        .collect()
}

/// The style tables of a document: one per element that is a scope (the
/// root, the document, each section), keyed by its DAST node.
#[derive(Debug, Clone, Default)]
pub(crate) struct StyleTables {
    scopes: HashMap<NodeId, Arc<Scope>>,
}

impl StyleTables {
    /// The scope element `node` makes, when it is one.
    pub(crate) fn scope(&self, node: NodeId) -> Option<&Scope> {
        self.scopes.get(&node).map(|s| &**s)
    }

    /// The table of a document with no scope: the default palette's.
    pub(crate) fn fallback() -> Scope {
        Scope::root()
    }
}

/// Settle the styles of `dast`: every scope's table, and the diagnostics
/// reading them made (contrast, a second palette, an unknown palette).
pub(crate) fn settle(dast: &Dast) -> (StyleTables, Vec<Diagnostic>) {
    let mut tables = StyleTables::default();
    let mut diags = Vec::new();
    let root = Arc::new(Scope::root());
    let scope = scope_of(dast, Dast::ROOT, &root, &mut diags);
    tables.scopes.insert(Dast::ROOT, scope.clone());
    visit(dast, Dast::ROOT, &scope, &mut tables, &mut diags);
    // The same finding read off a table and the tables inheriting it is
    // one diagnostic.
    let mut seen = std::collections::HashSet::new();
    diags.retain(|d| seen.insert((d.code, d.node, d.message.clone())));
    (tables, diags)
}

fn element_type(d: &Dast, n: NodeId) -> Option<ComponentType> {
    (d.kind(n) == NodeKind::Element)
        .then(|| ComponentType::from_tag(d.str(n)))
        .flatten()
}

fn visit(
    d: &Dast,
    n: NodeId,
    inherited: &Arc<Scope>,
    tables: &mut StyleTables,
    diags: &mut Vec<Diagnostic>,
) {
    for &c in d.children(n) {
        if d.kind(c) != NodeKind::Element {
            continue;
        }
        match element_type(d, c) {
            Some(t) if t.def().flags.style_scope => {
                let scope = scope_of(d, c, inherited, diags);
                tables.scopes.insert(c, scope.clone());
                visit(d, c, &scope, tables, diags);
            }
            _ => visit(d, c, inherited, tables, diags),
        }
    }
}

/// The literal text of attribute `name` of `n`, marked read; `Err` when
/// it holds a reference.
fn literal(d: &Dast, n: NodeId, name: &str) -> Option<Result<String, ()>> {
    let a = d.attr(n, name)?;
    let mut text = String::new();
    for &c in d.attr_children(a) {
        match d.kind(c) {
            NodeKind::Text => text.push_str(d.str(c)),
            _ => return Some(Err(())),
        }
    }
    Some(Ok(text))
}

/// The table of scope element `n`: its own `<styleDefinition>`s and
/// `<stylePalette>`s (as its children, or a `<setup>`'s), in document
/// order, over its parent scope's.
fn scope_of(d: &Dast, n: NodeId, parent: &Arc<Scope>, diags: &mut Vec<Diagnostic>) -> Arc<Scope> {
    let mut definitions = Vec::new();
    let mut palettes = Vec::new();
    let mut take = |c: NodeId| match element_type(d, c) {
        Some(t) if t.def().flags.style_definition => definitions.push(c),
        Some(t) if t.def().flags.style_palette => palettes.push(c),
        _ => {}
    };
    // A `<setup>`'s, and a `<styleDefinitions>`' inside it, are the
    // scope's own.
    fn walk(d: &Dast, n: NodeId, depth: u8, take: &mut dyn FnMut(NodeId)) {
        for &c in d.children(n) {
            match element_type(d, c) {
                Some(t) if t.def().flags.style_holder && depth < 2 => walk(d, c, depth + 1, take),
                _ => take(c),
            }
        }
    }
    walk(d, n, 0, &mut take);
    if definitions.is_empty() && palettes.is_empty() {
        return parent.clone();
    }
    // The last palette wins; each before it is reported.
    let mut local = None;
    for (i, &p) in palettes.iter().enumerate() {
        let name = match literal(d, p, "palette") {
            None => "default".to_string(),
            Some(Ok(t)) => t,
            Some(Err(())) => {
                diags.push(Diagnostic::warning(
                    "cells-unsupported",
                    Some(p),
                    "unsupported: a <stylePalette>'s `palette` must be literal: styles are settled at load".into(),
                ));
                continue;
            }
        };
        let lower = name.trim().to_lowercase();
        let found = palettes::PALETTES
            .iter()
            .position(|pal| pal.name.to_lowercase() == lower);
        let index = found.unwrap_or_else(|| {
            diags.push(Diagnostic::info(
                "doenet-i0048",
                Some(p),
                format!("Invalid value `{name}` for attribute `palette`, using value `default`"),
            ));
            0
        });
        if i + 1 < palettes.len() {
            diags.push(Diagnostic::warning(
                "doenet-w0083",
                Some(p),
                "A section can select only one <stylePalette>; using the last one.".into(),
            ));
        }
        local = Some(index);
    }
    let mut styles = match local {
        Some(p) => palette_styles(p),
        None => parent.styles.clone(),
    };
    let palette = local.or(parent.palette);
    for &def in &definitions {
        let number = match literal(d, def, "styleNumber") {
            Some(Ok(t)) => t.trim().parse::<f64>().map_or(1.0, |v| v.round().max(1.0)),
            _ => 1.0,
        };
        let number = whole(number).unwrap_or(1);
        let mut new = Style::default();
        for a in d.attrs(def) {
            let name = d.attr_name(a).to_string();
            let Some(key) = Key::of(&name) else {
                continue;
            };
            match literal(d, def, &name) {
                Some(Ok(text)) => new.set(key, parse_value(key, &text, true), Some(def)),
                Some(Err(())) => diags.push(Diagnostic::warning(
                    "cells-unsupported",
                    Some(def),
                    format!(
                        "unsupported: a <styleDefinition>'s `{name}` must be literal: styles are settled at load"
                    ),
                )),
                None => {}
            }
        }
        new.add_missing_child_color_fields();
        new.derive_missing_words();
        let seed = |styles: &BTreeMap<u32, Style>| {
            palette
                .and_then(|p| {
                    let size = palettes::PALETTES[p].styles.len() as u32;
                    styles.get(&((number - 1) % size + 1)).cloned()
                })
                .unwrap_or_else(Style::default_style)
        };
        if !styles.contains_key(&number) {
            let s = seed(&styles);
            styles.insert(number, s);
        }
        styles.get_mut(&number).unwrap().assign(&new);
    }
    for (&k, s) in &styles {
        for f in table::contrast_findings(k, s) {
            let mut args = BTreeMap::new();
            for (name, v) in f.args {
                args.insert(name, v);
            }
            diags.push(Diagnostic::accessibility(1, f.code, f.at, f.message, args));
        }
    }
    Arc::new(Scope { styles, palette })
}

/// A style value written as `text`: a number, a flag, or text, lowercased
/// as a `<styleDefinition>` lowercases every text (`lower`) or as a
/// component lowercases the keys that ask for it.
pub(crate) fn parse_value(key: Key, text: &str, lower: bool) -> Val {
    match key.kind() {
        table::Kind::Number => Val::Num(text.trim().parse().unwrap_or(f64::NAN)),
        table::Kind::Boolean => Val::Bool(!text.trim().eq_ignore_ascii_case("false")),
        table::Kind::Text => Val::Str(if lower || key.lowercased() {
            text.to_lowercase()
        } else {
            text.to_string()
        }),
    }
}
