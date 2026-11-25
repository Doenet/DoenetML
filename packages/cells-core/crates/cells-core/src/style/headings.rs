//! A section's heading colors (`sectionTitleColors.js`), settled at load
//! with the style tables (ADR 0084): per completion state, a light-mode
//! and a dark-mode color, each the section's own attribute, else (dark) one
//! derived from its own light color, else its parent section's, else the
//! default; and the contrast diagnostics of those an author wrote, on a
//! boxed or collapsible section.

use std::collections::BTreeMap;

use super::color::{self, CANVAS_DARK, CANVAS_LIGHT, TEXT_THRESHOLD};
use super::literal;
use crate::components::Role;
use crate::dast::{Dast, NodeId, NodeKind};
use crate::diagnostics::Diagnostic;

/// The completion states, in the order of the colors' arrays.
pub(crate) const STATES: [&str; 3] = ["completed", "inProgress", "notStarted"];

/// The light and dark defaults of each state.
const LIGHT_DEFAULTS: [&str; 3] = ["var(--lightGreen)", "var(--mainGray)", "var(--mainGray)"];
const DARK_DEFAULTS: [&str; 3] = ["#1a5e20", "#3a3a3a", "#3a3a3a"];

/// Where a heading color came from (`source` in `sectionTitleColors.js`).
#[derive(Debug, Clone, Default)]
struct Source {
    authored: bool,
    name: String,
    inherited: bool,
    prior_boxed: bool,
}

/// A section's heading colors, per state: light, then dark.
#[derive(Debug, Clone)]
pub(crate) struct HeadingColors {
    pub(crate) light: [String; 3],
    pub(crate) dark: [String; 3],
    light_sources: [Source; 3],
    dark_sources: [Source; 3],
}

/// `deriveSectionTitleDarkModeColor`: the inverted light color, moved to
/// the nearest lightness white text clears the threshold on.
fn derive_dark(light: &str) -> Option<String> {
    color::suggest_dark_against(
        &color::invert_lightness(light),
        "#ffffff",
        false,
        TEXT_THRESHOLD,
    )
}

fn written(d: &Dast, n: NodeId, name: &str) -> Option<String> {
    match literal(d, n, name) {
        Some(Ok(t)) => Some(t),
        _ => None,
    }
}

/// Whether a literal flag attribute is on: present and not `false`.
fn flag(d: &Dast, n: NodeId, name: &str, default: bool) -> bool {
    match literal(d, n, name) {
        None => default,
        Some(Ok(t)) => !t.trim().eq_ignore_ascii_case("false"),
        Some(Err(())) => true,
    }
}

impl HeadingColors {
    fn of(d: &Dast, n: NodeId, parent: Option<(&HeadingColors, bool)>) -> HeadingColors {
        let parent_boxed = parent.is_some_and(|(_, b)| b);
        let mut light: [String; 3] = Default::default();
        let mut dark: [String; 3] = Default::default();
        let mut light_sources: [Source; 3] = Default::default();
        let mut dark_sources: [Source; 3] = Default::default();
        for (k, state) in STATES.iter().enumerate() {
            let light_name = format!("{state}Color");
            let dark_name = format!("{state}ColorDarkMode");
            let own_light = written(d, n, &light_name);
            let own_dark = written(d, n, &dark_name);
            let inherit = |color: &String, src: &Source, name: &str| {
                (
                    color.clone(),
                    Source {
                        authored: src.authored,
                        name: if src.name.is_empty() {
                            name.to_string()
                        } else {
                            src.name.clone()
                        },
                        inherited: true,
                        prior_boxed: src.prior_boxed || parent_boxed,
                    },
                )
            };
            (light[k], light_sources[k]) = match (&own_light, parent) {
                (Some(c), _) => (
                    c.clone(),
                    Source {
                        authored: true,
                        name: light_name.clone(),
                        ..Default::default()
                    },
                ),
                (None, Some((p, _))) => inherit(&p.light[k], &p.light_sources[k], &light_name),
                (None, None) => (
                    LIGHT_DEFAULTS[k].to_string(),
                    Source {
                        name: light_name.clone(),
                        ..Default::default()
                    },
                ),
            };
            let default_dark = || {
                (
                    DARK_DEFAULTS[k].to_string(),
                    Source {
                        name: dark_name.clone(),
                        ..Default::default()
                    },
                )
            };
            (dark[k], dark_sources[k]) = match (&own_dark, &own_light, parent) {
                (Some(c), _, _) => (
                    c.clone(),
                    Source {
                        authored: true,
                        name: dark_name.clone(),
                        ..Default::default()
                    },
                ),
                (None, Some(l), _) => match derive_dark(l) {
                    Some(c) => (
                        c,
                        Source {
                            authored: true,
                            name: light_name.clone(),
                            ..Default::default()
                        },
                    ),
                    None => default_dark(),
                },
                (None, None, Some((p, _))) => inherit(&p.dark[k], &p.dark_sources[k], &dark_name),
                (None, None, None) => default_dark(),
            };
        }
        HeadingColors {
            light,
            dark,
            light_sources,
            dark_sources,
        }
    }

    /// `addSectionTitleColorContrastDiagnostic` for each state and mode.
    fn findings(&self, n: NodeId, out: &mut Vec<Diagnostic>) {
        for k in 0..3 {
            for dark in [false, true] {
                let (colors, sources) = if dark {
                    (&self.dark, &self.dark_sources)
                } else {
                    (&self.light, &self.light_sources)
                };
                let s = &sources[k];
                if !s.authored || (s.inherited && s.prior_boxed) || colors[k].is_empty() {
                    continue;
                }
                let (text, canvas) = if dark {
                    ("#ffffff", CANVAS_DARK)
                } else {
                    ("#000000", CANVAS_LIGHT)
                };
                let Some(ratio) = color::composited_contrast(text, canvas, Some(&colors[k]), 1.0)
                else {
                    continue;
                };
                if ratio >= TEXT_THRESHOLD {
                    continue;
                }
                let mode = if dark { " (dark mode)" } else { "" };
                let mut args = BTreeMap::new();
                args.insert("colorName", s.name.clone());
                args.insert("ratio", ratio.to_string());
                args.insert("threshold", TEXT_THRESHOLD.to_string());
                args.insert("mode", if dark { "dark" } else { "light" }.to_string());
                out.push(Diagnostic::accessibility(
                    1,
                    "doenet-a0006",
                    n,
                    format!(
                        "{} has insufficient contrast for the section heading text{mode} ({ratio:.2}:1; requires at least {TEXT_THRESHOLD}:1).",
                        s.name
                    ),
                    args,
                ));
            }
        }
    }
}

/// The heading colors of every section, by its node, and their
/// diagnostics. A section reads its parent's when its parent is one.
pub(crate) fn settle(
    d: &Dast,
    out: &mut BTreeMap<NodeId, HeadingColors>,
    diags: &mut Vec<Diagnostic>,
) {
    fn visit(
        d: &Dast,
        n: NodeId,
        parent: Option<(&HeadingColors, bool)>,
        out: &mut BTreeMap<NodeId, HeadingColors>,
        diags: &mut Vec<Diagnostic>,
    ) {
        for &c in d.children(n) {
            if d.kind(c) != NodeKind::Element {
                continue;
            }
            match super::element_type(d, c) {
                Some(t) if t.def().flags.style_scope && !t.plays(Role::Root) => {
                    let collapsible_default = t.def().flags.collapsible;
                    let boxed = flag(d, c, "boxed", false);
                    let collapsible = flag(d, c, "collapsible", collapsible_default);
                    let colors = HeadingColors::of(d, c, parent);
                    if boxed || collapsible {
                        colors.findings(c, diags);
                    }
                    visit(d, c, Some((&colors, boxed || collapsible)), out, diags);
                    out.insert(c, colors);
                }
                _ => visit(d, c, None, out, diags),
            }
        }
    }
    visit(d, Dast::ROOT, None, out, diags);
}
