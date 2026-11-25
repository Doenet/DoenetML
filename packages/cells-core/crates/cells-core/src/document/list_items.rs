//! Where a list item's number lines up (ADR 0084), as the current core's
//! `listItemChild.ts` chain reads it off the tree: an `<li>`, or a section
//! that is an untitled, unboxed list item, picks its lead, the first child
//! that puts something on the screen; a wrapper, an `<answer>` or a
//! `<sideBySide>` the lead falls on forwards it to a child of its own; and
//! the component it reaches says whether the number sits on its first
//! line (`baseline`) or beside its top (`flex-start`). What renders is a
//! type's declaration (`renders`) and the child's own `hide`, read when
//! asked, so the lead follows a `hide` a tick changes.

use super::*;
use crate::components::{ListItemRole, Renders, StructureKind};

/// A child as a list item reads it: text, or a component.
#[derive(Debug, Clone, Copy, PartialEq)]
pub enum LeadChild {
    /// Text that is not blank.
    Text,
    /// A component.
    Component(CompIdx),
}

/// Where a list item's number lines up with what leads it.
impl Document {
    /// The children of `c` as a list item reads them: text that is not
    /// blank and components, each one that stands as its children (a
    /// group, a repeat, an active case) looked through.
    fn lead_children(&self, c: CompIdx, out: &mut Vec<LeadChild>) {
        for child in self.children(c).collect::<Vec<_>>() {
            match child {
                Child::Text(t) if t.trim().is_empty() => {}
                Child::Text(_) => out.push(LeadChild::Text),
                // A label names its container, though it is looked
                // through for its text.
                Child::Component(k)
                    if self.component_type(k).def().list_item == Some(ListItemRole::Naming) =>
                {
                    out.push(LeadChild::Component(k))
                }
                Child::Component(k) => match self.component_type(k).structure_kind() {
                    Some(StructureKind::Transparent { .. } | StructureKind::Repeat { .. }) => {
                        self.lead_children(k, out)
                    }
                    Some(StructureKind::Gate { active }) => {
                        let cell = self.comp_cells(k)[active];
                        if self.cells[cell.index()] == 1.0 {
                            self.lead_children(k, out);
                        }
                    }
                    None => out.push(LeadChild::Component(k)),
                },
            }
        }
    }

    /// Whether child `x` puts something on the screen
    /// (`childRendersSomething`): text does; a component of a type that is
    /// drawn, unless it hides itself.
    fn renders_something(&self, x: LeadChild) -> bool {
        match x {
            LeadChild::Text => true,
            LeadChild::Component(k) => {
                self.component_type(k).def().renders != Renders::Never && !self.hidden_value(k)
            }
        }
    }

    /// The parent a list item's signal comes from: the nearest ancestor
    /// that does not stand as its children.
    fn lead_parent(&self, c: CompIdx) -> Option<CompIdx> {
        let mut p = self.parent(c);
        while let Some(x) = p {
            if self.component_type(x).structure_kind().is_none() {
                return Some(x);
            }
            p = self.parent(x);
        }
        None
    }

    /// Whether `c` is a choice input written `inline`.
    fn written_inline(&self, c: CompIdx) -> bool {
        self.attr_text(c, "inline")
            .is_some_and(|t| !t.trim().eq_ignore_ascii_case("false"))
    }

    /// A section's lead, when it is an untitled, unboxed, uncollapsible
    /// list item (`firstVisibleChild`): its first child other than its
    /// title that renders something.
    pub fn first_visible_child(&self, c: CompIdx) -> Option<LeadChild> {
        if !self.is_list_item(c) {
            return None;
        }
        let boxed = self
            .attr_text(c, "boxed")
            .is_some_and(|t| !t.trim().eq_ignore_ascii_case("false"));
        let collapsible = self
            .component_type(c)
            .prop_index("collapsible")
            .is_some_and(|p| self.cells[self.comp_cells(c)[p].index()] == 1.0);
        let mut kids = Vec::new();
        self.lead_children(c, &mut kids);
        let titled = kids.iter().any(|&k| {
            matches!(k, LeadChild::Component(k) if self.component_type(k).def().list_item == Some(ListItemRole::Title))
        });
        if boxed || collapsible || titled {
            return None;
        }
        kids.into_iter().find(|&k| self.renders_something(k))
    }

    /// The children `c` forwards the list item's signal to
    /// (`childrenToRenderInlineForListItem`).
    pub fn list_item_targets(&self, c: CompIdx) -> Vec<CompIdx> {
        let mut kids = Vec::new();
        let comp = |x: Option<LeadChild>| match x {
            Some(LeadChild::Component(k)) => vec![k],
            _ => Vec::new(),
        };
        match self.component_type(c).def().list_item {
            Some(ListItemRole::Item) => {
                self.lead_children(c, &mut kids);
                comp(kids.into_iter().find(|&k| self.renders_something(k)))
            }
            Some(ListItemRole::Section) => comp(self.first_visible_child(c)),
            Some(ListItemRole::Wrapper) if self.renders_inline_for_list_item(c) => {
                self.lead_children(c, &mut kids);
                comp(kids.into_iter().find(|&k| {
                    let naming = matches!(k, LeadChild::Component(k)
                        if matches!(self.component_type(k).def().list_item, Some(ListItemRole::Naming)));
                    !naming && self.renders_something(k)
                }))
            }
            Some(ListItemRole::Answer) if self.selected_for_list_item(c) => self
                .answer_inputs(c)
                .into_iter()
                .find(|&k| {
                    self.component_type(k).def().list_item == Some(ListItemRole::Choices)
                        && !self.written_inline(k)
                        && self.renders_something(LeadChild::Component(k))
                })
                .into_iter()
                .collect(),
            Some(ListItemRole::Panels) if self.selected_for_list_item(c) => {
                self.lead_children(c, &mut kids);
                kids.into_iter()
                    .filter_map(|k| match k {
                        LeadChild::Component(k) => Some(k),
                        LeadChild::Text => None,
                    })
                    .collect()
            }
            _ => Vec::new(),
        }
    }

    /// Whether `c`'s parent forwards the list item's signal to it.
    fn selected_for_list_item(&self, c: CompIdx) -> bool {
        self.lead_parent(c)
            .is_some_and(|p| self.list_item_targets(p).contains(&c))
    }

    /// Whether `c` leads a list item (`renderInlineForListItem`): its
    /// parent forwards the signal to it, and it is not an `<answer>`
    /// (which forwards it on) or a choice input written `inline`.
    pub fn renders_inline_for_list_item(&self, c: CompIdx) -> bool {
        match self.component_type(c).def().list_item {
            Some(ListItemRole::Answer) => false,
            Some(ListItemRole::Choices) if self.written_inline(c) => false,
            _ => self.selected_for_list_item(c),
        }
    }

    /// Where `c` asks a list item's number to sit
    /// (`listItemInlineAlignment`): `flex-start`, `baseline`, or `none`
    /// when it leads no list item.
    pub fn list_item_inline_alignment(&self, c: CompIdx) -> &'static str {
        let role = self.component_type(c).def().list_item;
        match role {
            Some(ListItemRole::Top | ListItemRole::Choices)
                if self.renders_inline_for_list_item(c) =>
            {
                "flex-start"
            }
            Some(ListItemRole::Baseline) if self.renders_inline_for_list_item(c) => "baseline",
            Some(ListItemRole::Wrapper) if self.renders_inline_for_list_item(c) => {
                match self.list_item_targets(c).first() {
                    Some(&k) => match self.list_item_inline_alignment(k) {
                        a @ ("baseline" | "flex-start") => a,
                        _ => "none",
                    },
                    None => "none",
                }
            }
            Some(ListItemRole::Answer) if self.selected_for_list_item(c) => {
                if self.list_item_targets(c).is_empty() {
                    "none"
                } else {
                    "flex-start"
                }
            }
            Some(ListItemRole::Panels) if self.selected_for_list_item(c) => {
                let mut kids = Vec::new();
                self.lead_children(c, &mut kids);
                match kids.into_iter().find(|&k| self.renders_something(k)) {
                    Some(LeadChild::Component(k))
                        if self.component_type(k).def().list_item
                            == Some(ListItemRole::Baseline) =>
                    {
                        "baseline"
                    }
                    _ => "flex-start",
                }
            }
            _ => "none",
        }
    }

    /// Where a list item's own number sits (`firstChildListItemAlignment`):
    /// beside the top of its lead when the lead asks for it, else on its
    /// first line; `none` when no component leads it.
    pub fn first_child_list_item_alignment(&self, c: CompIdx) -> &'static str {
        match self.list_item_targets(c).first() {
            None => "none",
            Some(&k) if self.list_item_inline_alignment(k) == "flex-start" => "flex-start",
            Some(_) => "baseline",
        }
    }
}

#[cfg(test)]
#[path = "list_items.test.rs"]
mod tests;
