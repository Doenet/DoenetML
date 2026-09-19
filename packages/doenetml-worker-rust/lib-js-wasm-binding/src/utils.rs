use std::cell::RefCell;
use std::panic;
use std::sync::Once;

thread_local! {
    /// The message of the most recent panic, kept so the failure the reader
    /// sees can name what actually broke.
    static LAST_PANIC_MESSAGE: RefCell<Option<String>> = const { RefCell::new(None) };
}

static HOOK_INSTALLED: Once = Once::new();

pub fn set_panic_hook() {
    // A panic in wasm is a trap, which reaches JavaScript as
    // `RuntimeError: unreachable` -- a message that says nothing about what
    // went wrong. `console_error_panic_hook` prints the real one, with its file
    // and line, to `console.error`, and an author writing DoenetML never opens
    // the console. So the message is also recorded here, where the boundary can
    // read it and put it on the failure screen instead of advice to reload
    // (#1920).
    //
    // Every panic under `dast/` is believed to be an internal invariant rather
    // than something an author can reach (#1921), which is exactly why this
    // matters: if one of them ever does fire, the alternative is a blank page
    // and the word "unreachable".
    HOOK_INSTALLED.call_once(|| {
        let previous_hook = panic::take_hook();
        panic::set_hook(Box::new(move |info| {
            LAST_PANIC_MESSAGE.with(|slot| {
                *slot.borrow_mut() = Some(info.to_string());
            });
            previous_hook(info);
        }));
    });

    // When the `console_error_panic_hook` feature is enabled, we can call the
    // `set_panic_hook` function at least once during initialization, and then
    // we will get better error messages if our code ever panics.
    //
    // For more details see
    // https://github.com/rustwasm/console_error_panic_hook#readme
    #[cfg(feature = "console_error_panic_hook")]
    console_error_panic_hook::set_once();
}

/// The message of the most recent panic on this thread, if there has been one,
/// clearing it so a later failure cannot report a stale cause.
pub fn take_last_panic_message() -> Option<String> {
    LAST_PANIC_MESSAGE.with(|slot| slot.borrow_mut().take())
}

#[cfg(test)]
mod tests {
    use super::*;

    /// The store-and-clear contract, exercised directly.
    ///
    /// The hook itself is deliberately not unit-tested here. `panic::set_hook`
    /// is process-global while `cargo test` runs tests on several threads, so a
    /// test that installs a hook, panics, and reads the result races every
    /// other test that panics or sets a hook -- including the reachability
    /// corpus in `doenetml-core`. What that test would add over this one is the
    /// single line in `set_panic_hook` that calls into the store.
    #[test]
    fn take_returns_the_recorded_message_once() {
        LAST_PANIC_MESSAGE.with(|slot| {
            *slot.borrow_mut() = Some("panicked at src/lib.rs:1:1:\nboom".to_string())
        });

        let recorded = take_last_panic_message().expect("a message was recorded");
        assert!(
            recorded.contains("boom"),
            "recorded message was {recorded:?}"
        );

        // Cleared by the read, so a later failure cannot report a stale cause.
        assert!(take_last_panic_message().is_none());
    }
}
