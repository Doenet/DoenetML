//! Document-wide counters (ADR 0044): a figure's or a table's number
//! ("Figure 2"), a footnote's marker. Each is counted when it is read, by
//! walking the built document in order through the active cases only, as
//! a section's full number is composed when read (`document/sections.rs`).

use super::*;
use crate::components::Counter;

/// What one walk found: the number, once the component is reached, and
/// the cells the count read (each active gate passed and each `when` flag
/// counted), for a reader that recomputes when one changes.
struct Count {
    counter: Counter,
    target: CompIdx,
    n: usize,
    found: Option<usize>,
    reads: Vec<CellIdx>,
}

/// Document-wide counters, as a reader sees them.
impl Document {
    /// The number component `c` takes from the counter its type advances
    /// ([`Counted`](crate::components::Counted)): 1 plus how many
    /// components before it in document order advance the same counter
    /// and take a number, through the active cases only. None when its
    /// type has no counter, when its `when` flag is off (a figure with
    /// `number="false"`), or when it sits in an inactive case.
    pub fn counter_number(&self, c: CompIdx) -> Option<usize> {
        self.count_to(c)?.found
    }

    /// The cells [`counter_number`](Self::counter_number) of `c` reads:
    /// the `active` cell of each case it passes or skips and the `when`
    /// flag of each component it counts, `c`'s own included. A reader that
    /// shows the number recomputes it when one of them changes; a change
    /// to what the walk passes structurally rebuilds the document.
    pub fn counter_reads(&self, c: CompIdx) -> Vec<CellIdx> {
        self.count_to(c)
            .map(|count| count.reads)
            .unwrap_or_default()
    }

    /// The walk from the root to `c`, counting what advances `c`'s counter.
    fn count_to(&self, c: CompIdx) -> Option<Count> {
        let counted = self.component_type(c).def().counted?;
        let mut count = Count {
            counter: counted.counter,
            target: c,
            n: 0,
            found: None,
            reads: Vec::new(),
        };
        self.count_in(self.root, &mut count);
        Some(count)
    }

    /// Count the components under `c`, in document order, until the target.
    /// Returns true once the target is reached.
    fn count_in(&self, c: CompIdx, count: &mut Count) -> bool {
        for child in self.children(c) {
            let Child::Component(k) = child else { continue };
            let ty = self.component_type(k);
            if let Some(active) = ty.gate_prop() {
                let cell = self.comp_cells(k)[active];
                count.reads.push(cell);
                if self.cells[cell.index()] != 1.0 {
                    continue;
                }
            }
            if let Some(counted) = ty.def().counted
                && counted.counter == count.counter
            {
                let takes = match counted.when {
                    None => true,
                    Some(w) => {
                        let cell = self.comp_cells(k)[w];
                        count.reads.push(cell);
                        let v = self.cells[cell.index()];
                        v != 0.0 && !v.is_nan()
                    }
                };
                if takes {
                    count.n += 1;
                }
                if k == count.target {
                    count.found = takes.then_some(count.n);
                    return true;
                }
            }
            if self.count_in(k, count) {
                return true;
            }
        }
        false
    }
}
