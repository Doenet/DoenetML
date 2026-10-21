//! The component table as a renderer or a test reads it: types, names,
//! children and prop cells.

use super::*;
use crate::components::PropAt;

/// The component table as parallel arrays indexed by `CompIdx`. Props are implicit:
/// component `c` of type `k` owns `prop_cells[prop_base[c] + i]` for each
/// `i` in `k.prop_defs()`, then two per point of its list (ADR 0016), up
/// to `prop_base[c + 1]`.
#[derive(Debug, Clone, Default)]
pub struct ComponentTable {
    pub component_type: Vec<ComponentType>,
    /// String id of the name, or `NONE`.
    pub name: Vec<StrId>,
    pub parent: Vec<CompIdx>,
    pub prop_base: Vec<u32>,
    pub prop_cells: Vec<CellIdx>,
    pub child_start: Vec<u32>,
    pub child_count: Vec<u32>,
    /// Component indices, or `TEXT_BIT | string id` for text children.
    pub child_list: Vec<u32>,
    /// DAST element each component came from (NONE if synthesized) and the
    /// scope it was created in. Together they identify a component across
    /// rebuilds, which lets a renderer keep its tree keyed by identity.
    pub dast_node: Vec<u32>,
    pub scope: Vec<ScopeId>,
}

impl ComponentTable {
    pub fn len(&self) -> usize {
        self.component_type.len()
    }

    pub fn is_empty(&self) -> bool {
        self.component_type.is_empty()
    }

    /// A sticky group's members: its children that take part, with repeats,
    /// collects, groups and choices replaced by what they expanded to, as
    /// the current core's composites are. Each comes with the `active`
    /// cells of the cases it sits in: it is a member while they are all 1.
    pub fn sticky_members(&self, group: CompIdx) -> Vec<(CompIdx, Vec<CellIdx>)> {
        let mut out = Vec::new();
        let mut stack = vec![(group, Vec::new())];
        while let Some((c, gates)) = stack.pop() {
            let start = self.child_start[c as usize] as usize;
            let kids = &self.child_list[start..start + self.child_count[c as usize] as usize];
            for &k in kids.iter().rev() {
                if k & TEXT_BIT != 0 {
                    continue;
                }
                match self.component_type[k as usize] {
                    ComponentType::RepeatForSequence
                    | ComponentType::RepeatFor
                    | ComponentType::Collect
                    | ComponentType::Group
                    | ComponentType::Select
                    | ComponentType::ConditionalContent => stack.push((k, gates.clone())),
                    ComponentType::Case => {
                        let active = self.prop_cells
                            [self.prop_base[k as usize] as usize + prop::case::ACTIVE];
                        stack.push((k, [gates.as_slice(), &[active]].concat()));
                    }
                    component_type if component_type.sticky_layout().is_some() => {
                        out.push((k, gates.clone()))
                    }
                    _ => {}
                }
            }
        }
        out
    }

    pub fn heap_bytes(&self) -> usize {
        self.component_type.capacity() * std::mem::size_of::<ComponentType>()
            + 4 * (self.name.capacity()
                + self.parent.capacity()
                + self.prop_base.capacity()
                + self.prop_cells.capacity()
                + self.child_start.capacity()
                + self.child_count.capacity()
                + self.child_list.capacity()
                + self.dast_node.capacity()
                + self.scope.capacity())
    }
}

#[derive(Debug, Clone, Copy, PartialEq)]
pub enum Child<'a> {
    Component(CompIdx),
    Text(&'a str),
}

impl Document {
    pub fn n_components(&self) -> usize {
        self.components.len()
    }

    pub fn component_type(&self, c: CompIdx) -> ComponentType {
        self.components.component_type[c as usize]
    }

    pub fn name(&self, c: CompIdx) -> Option<&str> {
        let s = self.components.name[c as usize];
        (s != NONE).then(|| self.strings.get(s).trim())
    }

    pub fn parent(&self, c: CompIdx) -> Option<CompIdx> {
        let p = self.components.parent[c as usize];
        (p != NONE).then_some(p)
    }

    pub fn children(&self, c: CompIdx) -> impl Iterator<Item = Child<'_>> + '_ {
        let (s, n) = (
            self.components.child_start[c as usize] as usize,
            self.components.child_count[c as usize] as usize,
        );
        self.components.child_list[s..s + n].iter().map(move |&e| {
            if e & TEXT_BIT != 0 {
                Child::Text(self.strings.get(e & !TEXT_BIT))
            } else {
                Child::Component(e)
            }
        })
    }

    /// Cells of the single-cell props of `c`: its type table's, in
    /// `component_type.prop_defs()` order, then two per point of its list.
    pub fn comp_cells(&self, c: CompIdx) -> &[CellIdx] {
        let t = &self.components;
        let base = t.prop_base[c as usize] as usize;
        let end = t
            .prop_base
            .get(c as usize + 1)
            .map_or(t.prop_cells.len(), |&e| e as usize);
        &t.prop_cells[base..end]
    }

    /// The text a component shows, as the current core's `text` state
    /// variable reads it: text children and inline values, through the
    /// active case of a reactive choice only.
    pub fn rendered_text(&self, c: CompIdx) -> String {
        let mut out = String::new();
        self.push_text(c, &mut out);
        out
    }

    fn push_text(&self, c: CompIdx, out: &mut String) {
        let value = |prop: &str| {
            self.prop_cells(c, prop)
                .map(|cells| self.cells[cells[0] as usize])
        };
        match self.component_type(c) {
            ComponentType::Text => {
                out.push_str(&self.text_value(self.comp_cells(c)[prop::text::VALUE]))
            }
            ComponentType::TextInput => {
                out.push_str(&self.text_value(self.comp_cells(c)[prop::text_input::VALUE]))
            }
            ComponentType::Number | ComponentType::NumberInput | ComponentType::Slider => {
                out.push_str(&format_number(value("value").unwrap_or(f64::NAN)))
            }
            ComponentType::Boolean => out.push_str(if value("value") == Some(1.0) {
                "true"
            } else {
                "false"
            }),
            ComponentType::Math | ComponentType::MathInput => {
                let expr = self.prop_cells(c, "expr").map(|cells| cells[0]);
                match expr {
                    Some(e) if !self.cells[e as usize].is_nan() => out.push_str(&self.math_text(e)),
                    _ => out.push_str(&format_number(value("value").unwrap_or(f64::NAN))),
                }
            }
            ComponentType::Case
                if self.cells[self.comp_cells(c)[prop::case::ACTIVE] as usize] != 1.0 => {}
            ComponentType::ConditionalContent | ComponentType::Select
                if value("hide").is_some_and(|h| h != 0.0 && !h.is_nan()) => {}
            _ => {
                for ch in self.children(c) {
                    match ch {
                        Child::Text(t) => out.push_str(t),
                        Child::Component(k) => self.push_text(k, out),
                    }
                }
            }
        }
    }

    /// The string a `<text>` value cell holds (its string id), or "".
    pub fn text_value(&self, cell: CellIdx) -> String {
        let v = self.cells[cell as usize];
        if v.is_nan() || v < 0.0 || v as usize >= self.strings.len() {
            String::new()
        } else {
            self.strings.get(v as u32).to_string()
        }
    }

    /// The component a path names; see `resolve_path`.
    pub fn component(&self, path: &str) -> Option<CompIdx> {
        self.resolve_path(path)
    }

    /// Cells of a prop, including virtual props such as a point's `coords`
    /// and array props such as a line's `points` (items flattened, live
    /// items only).
    pub fn prop_cells(&self, comp: CompIdx, prop: &str) -> Option<Vec<CellIdx>> {
        let component_type = self.component_type(comp);
        if let Some(parts) = component_type.combined_prop(prop) {
            return parts
                .iter()
                .map(|p| self.prop_cells(comp, p).map(|v| v[0]))
                .collect();
        }
        if let Some(items) = component_type.array_prop(prop) {
            return items
                .iter()
                .map(|[x, y]| Some([self.prop_cells(comp, x)?[0], self.prop_cells(comp, y)?[0]]))
                .collect::<Option<Vec<_>>>()
                .map(|v| v.concat());
        }
        let cells = self.comp_cells(comp);
        let n = cells.len();
        let coord = |k: usize, j: usize| component_type.list_slot(n, k, j).map(|i| cells[i]);
        match component_type.prop_at(prop)? {
            PropAt::Fixed(i) => Some(vec![cells[i]]),
            PropAt::Item(k) => Some(vec![coord(k, 0)?, coord(k, 1)?]),
            PropAt::Coord(k, j) => Some(vec![coord(k, j)?]),
            PropAt::List => (1..=component_type.list_len(n))
                .flat_map(|k| [coord(k, 0), coord(k, 1)])
                .collect(),
        }
    }

    /// The single cell behind `path.prop`.
    pub fn cell(&self, path: &str, prop: &str) -> Option<CellIdx> {
        let cells = self.prop_cells(self.resolve_path(path)?, prop)?;
        (cells.len() == 1).then(|| cells[0])
    }

    pub fn value(&self, name: &str, prop: &str) -> Option<f64> {
        self.cell(name, prop).map(|c| self.cells[c as usize])
    }

    pub fn memory_estimate(&self) -> MemoryEstimate {
        MemoryEstimate {
            cells: self.cells.capacity() * 8,
            program: self.program.instrs.capacity() * std::mem::size_of::<crate::program::Instr>()
                + self.program.producer.capacity() * 4
                + self.session.engine.borrow().heap_bytes(),
            components: self.components.heap_bytes(),
            strings: self.strings.heap_bytes(),
            structure: self.session.heap_bytes()
                + self.structure.essential_slots.capacity() * 8
                + self.structure.essential_keys.capacity() * 12,
            attrs: self.literal_attrs.heap_bytes(),
        }
    }
}

/// A number as text the way the current core shows one: integers without a
/// decimal point, otherwise up to ten significant digits.
fn format_number(v: f64) -> String {
    if v.is_nan() {
        return "NaN".into();
    }
    if v.is_infinite() {
        return if v > 0.0 { "∞".into() } else { "-∞".into() };
    }
    if v.fract() == 0.0 && v.abs() < 1e15 {
        return format!("{}", v as i64);
    }
    let s = format!(
        "{:.*}",
        (9 - v.abs().log10().floor() as i32).clamp(0, 15) as usize,
        v
    );
    s.trim_end_matches('0').trim_end_matches('.').to_string()
}
