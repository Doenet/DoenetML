//! The component table as a renderer or a test reads it: types, names,
//! children and prop cells.

use super::*;
use crate::components::{EntryKind, ListShape, PropAt};

/// The component table as parallel arrays indexed by [`CompIdx`]. Props are
/// implicit: component `c` of type `k` owns `prop_cells[prop_base[c] + i]` for
/// each `i` in `k.prop_defs()`, then two per point of its list, up to
/// `prop_base[c + 1]`.
#[derive(Debug, Clone, Default)]
pub struct ComponentTable {
    /// Each component's type.
    pub component_type: Vec<ComponentType>,
    /// String id of the name, or `NONE`.
    pub name: Vec<StrId>,
    /// Each component's parent, or `NONE` for the root.
    pub parent: Vec<CompIdx>,
    /// Where each component's prop cells start in `prop_cells`.
    pub prop_base: Vec<u32>,
    /// Every component's prop cells, end to end.
    pub prop_cells: Vec<CellIdx>,
    /// Where each component's children start in `child_list`.
    pub child_start: Vec<u32>,
    /// How many children each component has.
    pub child_count: Vec<u32>,
    /// Every component's children, end to end: components and text, in order.
    pub child_list: Vec<ChildEntry>,
    /// DAST element each component came from (NONE if synthesized) and the
    /// scope it was created in. Together they identify a component across
    /// rebuilds.
    pub dast_node: Vec<NodeId>,
    /// The scope each component was created in; see `dast_node`.
    pub scope: Vec<ScopeId>,
    /// The component this one is a reference to (`$P`, `<point extend="$P"/>`,
    /// a container copy's clone), or `NONE`. What a reference presents as and
    /// holds no cell for (a label, how a number is displayed) a renderer reads
    /// through it.
    pub referent: Vec<CompIdx>,
    /// What each component's `Component` and `After` attributes name
    /// (ADR 0040, 0042), as (component, attribute's position among its
    /// type's declared attributes, the component named), sorted by
    /// component.
    pub links: Vec<(CompIdx, u16, CompIdx)>,
    /// The kind of the entries of each component that decides them, a
    /// `<sort>` or `<shuffle>` of points or booleans (ADR 0053), and of
    /// each copy of one; every other component's entries are its type's.
    pub own_entries: std::collections::HashMap<CompIdx, EntryKind>,
}

impl ComponentTable {
    /// The layout of component `c`'s list: its type's, with the entries
    /// it decides (ADR 0053).
    pub fn shape(&self, c: CompIdx) -> ListShape {
        ListShape::new(
            self.component_type[c.index()],
            self.own_entries.get(&c).copied(),
        )
    }

    /// What `c`'s attributes of the declarations' position `attr` name,
    /// in the order written.
    pub fn linked(&self, c: CompIdx, attr: u16) -> impl Iterator<Item = CompIdx> + '_ {
        let start = self.links.partition_point(|&(k, _, _)| k < c);
        self.links[start..]
            .iter()
            .take_while(move |&&(k, _, _)| k == c)
            .filter(move |&&(_, a, _)| a == attr)
            .map(|&(_, _, t)| t)
    }

    /// The component `c`'s `target` names: what its type's `Component`
    /// attribute resolved to (ADR 0040).
    pub fn target(&self, c: CompIdx) -> Option<CompIdx> {
        let ty = self.component_type[c.index()];
        let attr = ty
            .def()
            .attributes
            .iter()
            .position(|a| a.kind == crate::components::AttrKind::Component)?;
        self.linked(c, attr as u16).next()
    }

    /// The cell indices of component `c`'s props, in prop order
    /// (`prop_cells` from `prop_base[c]`); the cells themselves are not
    /// contiguous.
    pub fn comp_cells(&self, c: CompIdx) -> &[CellIdx] {
        let base = self.prop_base[c.index()] as usize;
        let end = self
            .prop_base
            .get(c.index() + 1)
            .map_or(self.prop_cells.len(), |&e| e as usize);
        &self.prop_cells[base..end]
    }

    /// The number of components.
    pub fn len(&self) -> usize {
        self.component_type.len()
    }

    /// The component `c` is a reference to, if it is one.
    pub fn referent(&self, c: CompIdx) -> Option<CompIdx> {
        let r = self.referent[c.index()];
        (r != CompIdx::NONE).then_some(r)
    }

    /// Whether the table holds no component.
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
            let start = self.child_start[c.index()] as usize;
            let kids = &self.child_list[start..start + self.child_count[c.index()] as usize];
            for k in kids.iter().rev().filter_map(|e| e.as_comp()) {
                let ty = self.component_type[k.index()];
                match ty.structure_kind() {
                    Some(StructureKind::Transparent { .. } | StructureKind::Repeat { .. }) => {
                        stack.push((k, gates.clone()))
                    }
                    Some(StructureKind::Gate { active }) => {
                        let active = self.prop_cells[self.prop_base[k.index()] as usize + active];
                        stack.push((k, [gates.as_slice(), &[active]].concat()));
                    }
                    None if ty.sticky_layout().is_some() => out.push((k, gates.clone())),
                    None => {}
                }
            }
        }
        out
    }

    /// Per component, whether it is rendered, and whether a sticky group
    /// is above it, walking children down from `root`, as a
    /// renderer does: the root is rendered, and a child is when its parent
    /// is and its type's rule ([`Renders`](crate::components::Renders)) allows it where it is, `InGraph`
    /// only with a `<graph>` above it. A component no children list
    /// reaches (an iterate's tuple) is not rendered.
    pub fn placement(&self, root: CompIdx) -> (Vec<bool>, Vec<bool>) {
        use crate::components::Renders;
        let n = self.component_type.len();
        let (mut rendered, mut in_sticky) = (vec![false; n], vec![false; n]);
        let mut stack = vec![(root, false, false)];
        while let Some((c, in_graph, sticky)) = stack.pop() {
            let ty = self.component_type[c.index()];
            match ty.renders() {
                Renders::Never => continue,
                Renders::InGraph | Renders::InGraphAlone if !in_graph => continue,
                _ => {}
            }
            rendered[c.index()] = true;
            in_sticky[c.index()] = sticky;
            // Its children are parts it draws.
            if ty.renders() == Renders::InGraphAlone {
                continue;
            }
            let in_graph = in_graph || ty.graph_bounds().is_some();
            let sticky = sticky || ty.is_sticky_group();
            let start = self.child_start[c.index()] as usize;
            for e in &self.child_list[start..start + self.child_count[c.index()] as usize] {
                if let Some(k) = e.as_comp() {
                    stack.push((k, in_graph, sticky));
                }
            }
        }
        (rendered, in_sticky)
    }

    /// The heap memory the table holds, in bytes.
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
                + self.scope.capacity()
                + self.referent.capacity())
            + self.own_entries.capacity() * 8
    }
}

/// A `child_list` entry: a component, or a text child's string id, stored
/// with `TEXT_BIT` set. A renderer reads the list as `u32`s.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
#[repr(transparent)]
pub struct ChildEntry(u32);

impl ChildEntry {
    pub fn comp(c: CompIdx) -> ChildEntry {
        debug_assert_eq!(
            c.get() & TEXT_BIT,
            0,
            "component {c} collides with TEXT_BIT"
        );
        ChildEntry(c.get())
    }

    pub fn text(s: StrId) -> ChildEntry {
        ChildEntry(TEXT_BIT | s.get())
    }

    pub fn as_comp(self) -> Option<CompIdx> {
        (self.0 & TEXT_BIT == 0).then_some(CompIdx::new(self.0))
    }

    pub fn as_text(self) -> Option<StrId> {
        (self.0 & TEXT_BIT != 0).then_some(StrId::new(self.0 & !TEXT_BIT))
    }
}

/// A child of a component, as a renderer reads it: a component, or text.
#[derive(Debug, Clone, Copy, PartialEq)]
pub enum Child<'a> {
    /// A component child.
    Component(CompIdx),
    /// A text child.
    Text(&'a str),
}

/// The component table, as a renderer reads it: types, names, children and prop
/// cells, and the value of a cell.
impl Built {
    /// The number of components.
    pub fn n_components(&self) -> usize {
        self.components.len()
    }

    /// The type of component `c`.
    pub fn component_type(&self, c: CompIdx) -> ComponentType {
        self.components.component_type[c.index()]
    }

    /// The name of component `c`, trimmed, if it has one.
    pub fn name(&self, c: CompIdx) -> Option<&str> {
        let s = self.components.name[c.index()];
        (s != StrId::NONE).then(|| self.strings.get(s).trim())
    }

    /// The parent of component `c`; none for the root.
    pub fn parent(&self, c: CompIdx) -> Option<CompIdx> {
        let p = self.components.parent[c.index()];
        (p != CompIdx::NONE).then_some(p)
    }

    /// The children of component `c`, in order.
    pub fn children(&self, c: CompIdx) -> impl Iterator<Item = Child<'_>> + '_ {
        let (s, n) = (
            self.components.child_start[c.index()] as usize,
            self.components.child_count[c.index()] as usize,
        );
        self.components.child_list[s..s + n]
            .iter()
            .map(move |&e| match e.as_comp() {
                Some(k) => Child::Component(k),
                None => Child::Text(self.strings.get(e.as_text().unwrap())),
            })
    }

    /// Cells of the single-cell props of `c`: its type table's, in
    /// `component_type.prop_defs()` order, then two per point of its list.
    pub fn comp_cells(&self, c: CompIdx) -> &[CellIdx] {
        self.components.comp_cells(c)
    }

    /// The string a `<text>` value cell holds (its string id), or "".
    pub fn text_value(&self, cell: CellIdx) -> String {
        let v = self.cells[cell.index()];
        if crate::program::is_missing(v) {
            BLANK.into()
        } else if v.is_nan() || v < 0.0 || v as usize >= self.strings.len() {
            String::new()
        } else {
            self.strings.get(StrId::from_value(v)).to_string()
        }
    }

    /// Cells of a prop, including combined props such as a point's `coords`
    /// and list props such as a line's `points` (items flattened, live
    /// items only).
    pub fn prop_cells(&self, comp: CompIdx, prop: &str) -> Option<Vec<CellIdx>> {
        let component_type = self.component_type(comp);
        if let Some(parts) = component_type.combined_prop(prop) {
            return parts
                .iter()
                .map(|p| self.prop_cells(comp, p).map(|v| v[0]))
                .collect();
        }
        if let Some(items) = component_type.table_list(prop) {
            return items
                .iter()
                .map(|[x, y]| Some([self.prop_cells(comp, x)?[0], self.prop_cells(comp, y)?[0]]))
                .collect::<Option<Vec<_>>>()
                .map(|v| v.concat());
        }
        let cells = self.comp_cells(comp);
        let n = cells.len();
        let shape = self.components.shape(comp);
        let coord = |k: usize, j: usize| shape.list_slot(n, k, j).map(|i| cells[i]);
        match component_type.prop_at(prop)? {
            PropAt::Position(i) => Some(vec![cells[i]]),
            PropAt::Item(k) => (0..shape.width()).map(|j| coord(k, j)).collect(),
            PropAt::Coord(k, j) => Some(vec![coord(k, j)?]),
            PropAt::List => (1..=shape.list_len(n))
                .flat_map(|k| (0..shape.width()).map(move |j| (k, j)))
                .map(|(k, j)| coord(k, j))
                .collect(),
            PropAt::Companion => Some(shape.companion_slots(n).map(|i| cells[i]).collect()),
        }
    }

    /// The single cell behind `path.prop`.
    pub fn cell(&self, path: &str, prop: &str) -> Option<CellIdx> {
        let cells = self.prop_cells(self.resolve_path(path)?, prop)?;
        (cells.len() == 1).then(|| cells[0])
    }

    /// The value of the single cell behind `name.prop` (see [`Built::cell`]).
    pub fn value(&self, name: &str, prop: &str) -> Option<f64> {
        self.cell(name, prop).map(|c| self.cells[c.index()])
    }
}

/// The component table, as text: what a component shows, read as the current
/// core reads its `text`; and the document's memory estimate.
impl Document {
    /// The text a component shows, as the current core's `text` state
    /// variable reads it: text children and inline values, through the
    /// active case of a reactive choice only.
    pub fn rendered_text(&self, c: CompIdx) -> String {
        let mut out = String::new();
        self.push_text(c, &mut out);
        out
    }

    fn push_text(&self, c: CompIdx, out: &mut String) {
        let cells = self.comp_cells(c);
        let value = |pi: usize| cells.get(pi).map(|cell| self.cells[cell.index()]);
        let ty = self.component_type(c);
        // A hidden list shows nothing (ADR 0041, decision 9).
        if (ty.list_entry().is_some() || ty.lists_items())
            && ty
                .prop_index("hide")
                .and_then(value)
                .is_some_and(|h| h != 0.0 && !h.is_nan())
        {
            return;
        }
        let shape = self.components.shape(c);
        // A value list shows its entries, separated by commas (ADR 0041).
        // A point list's own points (`(1, 2), (3, 4)`) likewise; a shape's
        // vertices are no text of it.
        if let Some(kind) = shape
            .entry()
            .filter(|&k| k != EntryKind::Point || ty.entry_row().is_some())
            .filter(|_| shape.width() > 0)
        {
            let n_table = ty.prop_defs().len();
            let end = n_table + shape.width() * shape.list_len(cells.len());
            let entries = &cells[n_table.min(cells.len())..end.min(cells.len())];
            // Commas between the entries, unless the list says not.
            let separator = match self.attr_text(c, "asList") {
                Some(t) if t.trim().eq_ignore_ascii_case("false") => "",
                _ => ", ",
            };
            // A capped list's entries stop at its live length (ADR 0041).
            let live = ty
                .live_len()
                .and_then(value)
                .map_or(usize::MAX, |l| if l > 0.0 { l as usize } else { 0 });
            for (k, entry) in entries.chunks(shape.width().max(1)).take(live).enumerate() {
                if k > 0 {
                    out.push_str(separator);
                }
                let cell = entry[0];
                let v = self.cells[cell.index()];
                match kind {
                    EntryKind::Number => out.push_str(&format_number(v)),
                    EntryKind::Text => out.push_str(&self.text_value(cell)),
                    EntryKind::Boolean => out.push_str(boolean_text(v)),
                    EntryKind::Math | EntryKind::Any => out.push_str(&self.held_text(cell)),
                    // A sort's point, each coordinate as its cell holds it.
                    EntryKind::Point if shape.own.is_some() && entry.len() == 2 => {
                        out.push_str(&format!(
                            "({}, {})",
                            self.held_text(entry[0]),
                            self.held_text(entry[1])
                        ));
                    }
                    EntryKind::Point => {
                        let y = entry.get(1).map_or(f64::NAN, |c| self.cells[c.index()]);
                        out.push_str(&format!("({}, {})", format_number(v), format_number(y)));
                    }
                }
            }
            return;
        }
        // A repeat (a structural sequence's numbers among them, ADR 0041)
        // and a collect show their items as a list: an iteration's
        // children, or a gathered one, each one item, separated by
        // commas unless the list says not or an item is a block (COMP-2),
        // as the bridge draws them.
        if ty.text_kind().is_none() && ty.lists_items() {
            self.push_items_text(c, ty, out);
            return;
        }
        match ty.text_kind() {
            Some(TextKind::Text(pi)) => out.push_str(&self.text_value(cells[pi])),
            // A type with display settings shows its number rounded by
            // them (ADR 0058, ADR 0071).
            Some(TextKind::Number(pi)) if self.has_display_settings(c) => {
                let v = value(pi).unwrap_or(f64::NAN);
                if crate::program::is_missing(v) {
                    out.push_str(BLANK);
                } else {
                    out.push_str(&self.display_settings(c).0.number_text(v));
                }
            }
            Some(TextKind::Number(pi)) => {
                out.push_str(&format_number(value(pi).unwrap_or(f64::NAN)))
            }
            Some(TextKind::Math(expr, pi)) if self.has_display_settings(c) => {
                let (display, _) = self.display_settings(c);
                match cells.get(expr) {
                    Some(&e) if !self.cells[e.index()].is_nan() => {
                        out.push_str(&self.display_text(e, &display))
                    }
                    _ => {
                        let v = value(pi).unwrap_or(f64::NAN);
                        if crate::program::is_missing(v) {
                            out.push_str(BLANK);
                        } else {
                            out.push_str(&display.number_text(v));
                        }
                    }
                }
            }
            Some(TextKind::Grouped(pi)) => {
                out.push_str(&group_digits(&format_number(value(pi).unwrap_or(f64::NAN))))
            }
            Some(TextKind::Boolean(pi)) => out.push_str(boolean_text(value(pi).unwrap_or(0.0))),
            Some(TextKind::Held(pi)) => {
                if let Some(&cell) = cells.get(pi) {
                    out.push_str(&self.held_text(cell));
                }
            }
            Some(TextKind::Math(expr, pi)) => match cells.get(expr) {
                Some(&e) if !self.cells[e.index()].is_nan() => out.push_str(&self.math_text(e)),
                _ => out.push_str(&format_number(value(pi).unwrap_or(f64::NAN))),
            },
            Some(TextKind::Pair(x, y)) => out.push_str(&format!(
                "({}, {})",
                format_number(value(x).unwrap_or(f64::NAN)),
                format_number(value(y).unwrap_or(f64::NAN))
            )),
            Some(TextKind::Delimited(before, after)) => {
                out.push_str(before);
                self.push_children_text(c, out);
                out.push_str(after);
            }
            Some(TextKind::Separated(separator)) => {
                let mut first = true;
                for ch in self.children(c) {
                    let text = match ch {
                        Child::Text(t) => t.trim().to_string(),
                        Child::Component(k) => self.rendered_text(k).trim().to_string(),
                    };
                    if text.is_empty() {
                        continue;
                    }
                    if !first {
                        out.push_str(separator);
                    }
                    out.push_str(&text);
                    first = false;
                }
            }
            None if ty
                .gate_prop()
                .is_some_and(|active| value(active) != Some(1.0)) => {}
            None if matches!(ty.structure_kind(), Some(StructureKind::Transparent { .. }))
                && ty
                    .prop_index("hide")
                    .and_then(value)
                    .is_some_and(|h| h != 0.0 && !h.is_nan()) => {}
            None => self.push_children_text(c, out),
        }
    }

    /// The text of what `cell` holds: a math cell's expression (the blank
    /// one for none), a string, or a number.
    fn held_text(&self, cell: CellIdx) -> String {
        match self.value_types[cell.index()] {
            crate::program::ValueType::Math if self.cells[cell.index()].is_nan() => {
                "\u{ff3f}".into()
            }
            crate::program::ValueType::Math => self.math_text(cell),
            crate::program::ValueType::Text => self.text_value(cell),
            crate::program::ValueType::Number => format_number(self.cells[cell.index()]),
        }
    }

    /// The text of list-like `c` (`lists_items`): each item's text, its
    /// whitespace around it dropped, an empty one skipped, separated by
    /// commas unless `asList="false"` or an item holds a block (a
    /// container that is no structure, a `<p>` in an iteration).
    fn push_items_text(&self, c: CompIdx, ty: ComponentType, out: &mut String) {
        let per_scope = matches!(ty.structure_kind(), Some(StructureKind::Repeat { .. }));
        let mut items: Vec<String> = Vec::new();
        let mut block = false;
        let mut last_scope = None;
        for ch in self.children(c) {
            let (text, scope) = match ch {
                Child::Text(t) => (t.to_string(), None),
                Child::Component(k) => {
                    let kt = self.component_type(k);
                    block |= kt.container() && kt.structure_kind().is_none();
                    let scope = per_scope.then(|| self.components.scope[k.index()]);
                    (self.rendered_text(k), scope)
                }
            };
            match items.last_mut() {
                // Text, or a component of the iteration before it, is part
                // of the item it follows.
                Some(last) if per_scope && (scope.is_none() || scope == last_scope) => {
                    last.push_str(&text)
                }
                _ if !per_scope && text.trim().is_empty() => {}
                _ => items.push(text),
            }
            if scope.is_some() {
                last_scope = scope;
            }
        }
        let separator = match self.attr_text(c, "asList") {
            Some(t) if t.trim().eq_ignore_ascii_case("false") => "",
            _ if block => "",
            _ => ", ",
        };
        let mut first = true;
        for item in items.iter().map(|i| i.trim()).filter(|i| !i.is_empty()) {
            if !first {
                out.push_str(separator);
            }
            out.push_str(item);
            first = false;
        }
    }

    fn push_children_text(&self, c: CompIdx, out: &mut String) {
        for ch in self.children(c) {
            match ch {
                Child::Text(t) => out.push_str(t),
                // A step a cascade holds back, or a message it does not
                // show, is not in the text (ADR 0062).
                Child::Component(k) if self.revealed(k) != crate::document::Revealed::Shown => {}
                // A value its `hide` hides is not in its parent's text
                // (ADR 0071).
                Child::Component(k) if self.hidden_value(k) => {}
                Child::Component(k) => self.push_text(k, out),
            }
        }
    }

    /// The heap memory the document holds, in bytes, by part.
    pub fn memory_estimate(&self) -> MemoryEstimate {
        MemoryEstimate {
            cells: self.cells.capacity() * 8,
            program: self.program.instrs.capacity() * std::mem::size_of::<crate::program::Instr>()
                + self.program.producer.capacity() * 4
                + self.math.engine.heap_bytes(),
            components: self.components.heap_bytes() + self.interactive.capacity() * 8,
            strings: self.strings.heap_bytes(),
            structure: self.session.heap_bytes()
                + self.structure.essential_slots.capacity() * 8
                + self.structure.essential_keys.capacity() * 8
                + self.loaded.keys.heap_bytes(),
            attrs: self.loaded.literal_attrs.heap_bytes(),
        }
    }
}

/// A formatted number with its integer digits in groups of three, separated
/// by commas, as the current core's `<intComma>` groups one in English:
/// `25236501.35` is `25,236,501.35`. Text that does not begin with a digit
/// (after a minus sign), `NaN` or `∞`, is unchanged.
fn group_digits(number: &str) -> String {
    let (sign, rest) = match number.strip_prefix('-') {
        Some(rest) => ("-", rest),
        None => ("", number),
    };
    let digits = rest.bytes().take_while(u8::is_ascii_digit).count();
    if digits == 0 {
        return number.to_string();
    }
    let (int, tail) = rest.split_at(digits);
    let mut out = String::from(sign);
    for (k, ch) in int.chars().enumerate() {
        if k > 0 && (digits - k) % 3 == 0 {
            out.push(',');
        }
        out.push(ch);
    }
    out.push_str(tail);
    out
}

/// A number as text the way the current core shows one: integers without a
/// decimal point, otherwise up to ten significant digits.
/// How the missing value shows (ADR 0046): `＿`, as DoenetML prints a
/// blank.
pub(crate) const BLANK: &str = "\u{ff3f}";

/// A boolean as text: `true`, `false`, or the blank for a missing one.
fn boolean_text(v: f64) -> &'static str {
    if crate::program::is_missing(v) {
        BLANK
    } else if v == 1.0 {
        "true"
    } else {
        "false"
    }
}

/// A number as text, as the current core formats one; the missing value is
/// the blank and the NaN of a computation with no value `NaN`.
pub(crate) fn format_number(v: f64) -> String {
    if crate::program::is_missing(v) {
        return BLANK.into();
    }
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
