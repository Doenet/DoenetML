//! The load trace: named, nested spans with the work each did. A load
//! records its own (`LoadTimings::spans`), and reads its stage timings
//! off them; the benchmark's trace layer (`packages/benchmark`,
//! `METHOD.md`) puts them on one timeline with the page's own steps, and
//! `profile` prints them to stderr for a person at a terminal.
//!
//! Recording is off until `start` and costs one thread-local check per span
//! when off. A span is opened by `span(name)` and closed when its guard
//! drops; `count(name, n)` adds work to the innermost open span. Names are
//! the step names the benchmark's glossary explains (`src/steps.mjs` there),
//! so a span renamed here is renamed there.
//!
//! A tally (`tally(name)`) is for work done many times inside one span,
//! such as planning each element by its type: every opening of `name`
//! under the same parent adds to one span, whose `n` counts the openings
//! and whose duration is their sum (its start is the first opening's, so
//! it is not a stretch of the timeline). Tallies cost two clock reads
//! each, so they record only when the profile is on (`CELLS_BUILD_PROFILE`).

use std::cell::RefCell;
use std::collections::HashMap;
use std::hash::{BuildHasherDefault, Hasher};
use std::time::Duration;
use web_time::Instant;

/// One closed span: when it started and how long it ran, both measured
/// from `start`, its depth below the outermost span, and the work counts
/// recorded inside it.
#[derive(Debug, Clone)]
pub struct Span {
    pub name: &'static str,
    pub depth: u32,
    pub start: Duration,
    pub duration: Duration,
    pub counts: Vec<(&'static str, u64)>,
}

struct Recorder {
    origin: Instant,
    /// In opening order; a span's duration is filled in when it closes.
    spans: Vec<Span>,
    /// Indices into `spans` of the spans still open, innermost last.
    open: Vec<usize>,
    /// The parent of each span in `spans` (`usize::MAX` for none).
    parents: Vec<usize>,
    /// The span of each tally, by its parent's index (`usize::MAX` for
    /// none) and its name's address.
    tallies: HashMap<(usize, usize), usize, BuildHasherDefault<WordHasher>>,
}

/// A multiplicative hash of whole words, for the tallies' keys.
#[derive(Default)]
struct WordHasher(u64);

impl Hasher for WordHasher {
    fn write(&mut self, bytes: &[u8]) {
        for &b in bytes {
            self.write_u64(b as u64);
        }
    }
    fn write_usize(&mut self, n: usize) {
        self.write_u64(n as u64);
    }
    fn write_u64(&mut self, n: u64) {
        self.0 = (self.0.rotate_left(5) ^ n).wrapping_mul(0x517c_c1b7_2722_0a95);
    }
    fn finish(&self) -> u64 {
        self.0
    }
}

thread_local! {
    static RECORDER: RefCell<Option<Recorder>> = const { RefCell::new(None) };
}

/// Start recording on this thread, discarding anything recorded before.
pub fn start() {
    RECORDER.with(|r| {
        *r.borrow_mut() = Some(Recorder {
            origin: Instant::now(),
            spans: Vec::new(),
            open: Vec::new(),
            parents: Vec::new(),
            tallies: HashMap::default(),
        })
    });
}

/// Stop recording and return the spans in the order they opened, each
/// before its children, siblings in the order they first opened. Empty
/// if recording was not started.
pub fn finish() -> Vec<Span> {
    RECORDER.with(|r| r.borrow_mut().take().map_or_else(Vec::new, tree_order))
}

/// The spans with every span's children after it and before its next
/// sibling. Without tallies the opening order is that already; a tally's
/// span is made when it first opens, after spans opened later under its
/// parent's earlier siblings, so it is moved under its parent.
fn tree_order(rec: Recorder) -> Vec<Span> {
    if rec.tallies.is_empty() {
        return rec.spans;
    }
    let mut children: Vec<Vec<usize>> = vec![Vec::new(); rec.spans.len()];
    let mut roots = Vec::new();
    for (i, &p) in rec.parents.iter().enumerate() {
        match p {
            usize::MAX => roots.push(i),
            p => children[p].push(i),
        }
    }
    let mut order = Vec::with_capacity(rec.spans.len());
    let mut stack: Vec<usize> = roots.into_iter().rev().collect();
    while let Some(i) = stack.pop() {
        order.push(i);
        stack.extend(children[i].iter().rev());
    }
    let mut spans: Vec<Option<Span>> = rec.spans.into_iter().map(Some).collect();
    order
        .into_iter()
        .map(|i| spans[i].take().unwrap())
        .collect()
}

/// Closes its span when dropped.
#[must_use = "a span closes when its guard drops"]
pub struct Guard {
    index: Option<usize>,
    /// For a tally, when this opening started: its time adds to the span.
    tally_start: Option<Duration>,
}

/// Open the span `name`, nested in whatever span is open.
pub fn span(name: &'static str) -> Guard {
    let index = RECORDER.with(|r| {
        let mut r = r.borrow_mut();
        let rec = r.as_mut()?;
        let index = rec.spans.len();
        rec.parents
            .push(rec.open.last().copied().unwrap_or(usize::MAX));
        rec.spans.push(Span {
            name,
            depth: rec.open.len() as u32,
            start: rec.origin.elapsed(),
            duration: Duration::ZERO,
            counts: Vec::new(),
        });
        rec.open.push(index);
        Some(index)
    });
    Guard {
        index,
        tally_start: None,
    }
}

/// Open the tally `name`, nested in whatever span is open, when the
/// profile is on; see the module's doc.
pub fn tally(name: &'static str) -> Guard {
    if !crate::profile::enabled() {
        return Guard {
            index: None,
            tally_start: None,
        };
    }
    open_tally(name)
}

fn open_tally(name: &'static str) -> Guard {
    RECORDER.with(|r| {
        let mut r = r.borrow_mut();
        let Some(rec) = r.as_mut() else {
            return Guard {
                index: None,
                tally_start: None,
            };
        };
        let now = rec.origin.elapsed();
        let parent = rec.open.last().copied().unwrap_or(usize::MAX);
        let depth = rec.open.len() as u32;
        let (spans, parents) = (&mut rec.spans, &mut rec.parents);
        let key = (parent, name.as_ptr() as usize);
        let index = *rec.tallies.entry(key).or_insert_with(|| {
            parents.push(parent);
            spans.push(Span {
                name,
                depth,
                start: now,
                duration: Duration::ZERO,
                counts: Vec::new(),
            });
            spans.len() - 1
        });
        rec.open.push(index);
        Guard {
            index: Some(index),
            tally_start: Some(now),
        }
    })
}

impl Guard {
    /// Run `f` inside this span, closing it when `f` returns.
    pub fn run<T>(self, f: impl FnOnce() -> T) -> T {
        f()
    }
}

impl Drop for Guard {
    fn drop(&mut self) {
        let Some(index) = self.index else { return };
        RECORDER.with(|r| {
            let mut r = r.borrow_mut();
            // `finish` may have run while this guard was alive.
            let Some(rec) = r.as_mut() else { return };
            let now = rec.origin.elapsed();
            let span = &mut rec.spans[index];
            match self.tally_start {
                Some(started) => {
                    span.duration += now - started;
                    match span.counts.iter_mut().find(|(k, _)| *k == "n") {
                        Some((_, v)) => *v += 1,
                        None => span.counts.push(("n", 1)),
                    }
                }
                None => span.duration = now - span.start,
            }
            if let Some(pos) = rec.open.iter().rposition(|&i| i == index) {
                rec.open.truncate(pos);
            }
        });
    }
}

/// Add `n` to the count `name` of the innermost open span.
pub fn count(name: &'static str, n: usize) {
    RECORDER.with(|r| {
        let mut r = r.borrow_mut();
        let Some(rec) = r.as_mut() else { return };
        let Some(&index) = rec.open.last() else {
            return;
        };
        let counts = &mut rec.spans[index].counts;
        match counts.iter_mut().find(|(k, _)| *k == name) {
            Some((_, v)) => *v += n as u64,
            None => counts.push((name, n as u64)),
        }
    });
}

/// The spans as JSON: `[{"name", "depth", "start_ms", "duration_ms",
/// "counts": {name: n}}]`, times in milliseconds from `start`.
pub fn to_json(spans: &[Span]) -> String {
    let list: Vec<serde_json::Value> = spans
        .iter()
        .map(|s| {
            serde_json::json!({
                "name": s.name,
                "depth": s.depth,
                "start_ms": s.start.as_secs_f64() * 1e3,
                "duration_ms": s.duration.as_secs_f64() * 1e3,
                "counts": s.counts.iter().map(|&(k, v)| (k.to_string(), serde_json::Value::from(v))).collect::<serde_json::Map<_, _>>(),
            })
        })
        .collect();
    serde_json::Value::Array(list).to_string()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn spans_nest_and_carry_counts() {
        start();
        {
            let _outer = span("load");
            count("bytes", 10);
            {
                let _inner = span("compile");
                count("elements", 3);
                count("elements", 2);
            }
            let _after = span("build");
        }
        let spans = finish();
        let names: Vec<_> = spans.iter().map(|s| (s.name, s.depth)).collect();
        assert_eq!(names, [("load", 0), ("compile", 1), ("build", 1)]);
        assert_eq!(spans[0].counts, [("bytes", 10)]);
        assert_eq!(spans[1].counts, [("elements", 5)]);
        assert!(spans[0].duration >= spans[1].duration + spans[2].duration);
    }

    #[test]
    fn tallies_sum_under_their_parent() {
        start();
        {
            let _outer = span("plan");
            for name in ["point", "line", "point"] {
                let _t = open_tally(name);
                count("props", 2);
            }
        }
        let spans = finish();
        let names: Vec<_> = spans.iter().map(|s| (s.name, s.depth)).collect();
        assert_eq!(names, [("plan", 0), ("point", 1), ("line", 1)]);
        assert_eq!(spans[1].counts, [("props", 4), ("n", 2)]);
        assert_eq!(spans[2].counts, [("props", 2), ("n", 1)]);
        assert!(spans[0].duration >= spans[1].duration + spans[2].duration);
    }

    #[test]
    fn a_tally_first_opened_late_is_listed_under_its_parent() {
        start();
        {
            let _outer = span("plan");
            for second in [false, true] {
                let _e = open_tally("number");
                if second {
                    let _m = open_tally("plan math");
                }
                let _h = open_tally("hold");
            }
        }
        let spans = finish();
        let names: Vec<_> = spans.iter().map(|s| (s.name, s.depth)).collect();
        assert_eq!(
            names,
            [("plan", 0), ("number", 1), ("hold", 2), ("plan math", 2)]
        );
        assert_eq!(spans[2].counts, [("n", 2)]);
        assert_eq!(spans[3].counts, [("n", 1)]);
    }

    #[test]
    fn off_unless_started() {
        finish();
        {
            let _s = span("load");
            count("bytes", 1);
        }
        assert!(finish().is_empty());
    }
}
