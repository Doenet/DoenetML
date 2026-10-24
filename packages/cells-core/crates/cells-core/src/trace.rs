//! The load trace: named, nested spans with the work each did, for the
//! benchmark's trace layer (`packages/benchmark`, `METHOD.md`), which puts
//! them on one timeline with the page's own steps. Where `profile` prints
//! laps to stderr for a person at a terminal, this records them for a
//! program to read.
//!
//! Recording is off until `start` and costs one thread-local check per span
//! when off. A span is opened by `span(name)` and closed when its guard
//! drops; `count(name, n)` adds work to the innermost open span. Names are
//! the step names the benchmark's glossary explains (`src/steps.mjs` there),
//! so a span renamed here is renamed there.

use std::cell::RefCell;
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
        })
    });
}

/// Stop recording and return the spans in the order they opened. Empty if
/// recording was not started.
pub fn finish() -> Vec<Span> {
    RECORDER.with(|r| r.borrow_mut().take().map_or_else(Vec::new, |rec| rec.spans))
}

/// Closes its span when dropped.
#[must_use = "a span closes when its guard drops"]
pub struct Guard {
    index: Option<usize>,
}

/// Open the span `name`, nested in whatever span is open.
pub fn span(name: &'static str) -> Guard {
    let index = RECORDER.with(|r| {
        let mut r = r.borrow_mut();
        let rec = r.as_mut()?;
        let index = rec.spans.len();
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
    Guard { index }
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
            span.duration = now - span.start;
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
    fn off_unless_started() {
        finish();
        {
            let _s = span("load");
            count("bytes", 1);
        }
        assert!(finish().is_empty());
    }
}
