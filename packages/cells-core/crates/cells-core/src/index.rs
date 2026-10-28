//! Index types: a position in one particular list, as its own type, so an
//! index into one list cannot be passed where an index into another is
//! meant. Each wraps a `u32` (`#[repr(transparent)]`, so no larger than
//! one) and is read as a position only through `index()`.

/// Define an index type over `u32`. Its `Debug` and `Display` print the
/// bare number, so dumps and messages read as they did with a `u32`.
macro_rules! index_type {
    ($(#[$attr:meta])* $vis:vis struct $name:ident;) => {
        $(#[$attr])*
        #[derive(Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Hash, Default)]
        #[repr(transparent)]
        $vis struct $name(u32);

        impl $name {
            /// No position: a sentinel for "none", never an index.
            pub const NONE: $name = $name(u32::MAX);

            pub const fn new(i: u32) -> $name {
                $name(i)
            }

            /// The index at position `i`. Panics if `i` does not fit a `u32`.
            #[inline(always)]
            pub fn from_index(i: usize) -> $name {
                $name(u32::try_from(i).expect(concat!(stringify!($name), " out of range")))
            }

            /// The position, to index the list with.
            #[inline(always)]
            pub const fn index(self) -> usize {
                self.0 as usize
            }

            /// The raw number, for the wire and for hashing.
            #[inline(always)]
            pub const fn get(self) -> u32 {
                self.0
            }

            pub const fn is_none(self) -> bool {
                self.0 == u32::MAX
            }

            /// The index `k` places after this one.
            #[inline(always)]
            pub fn offset(self, k: usize) -> $name {
                $name(self.0 + k as u32)
            }

            /// Every index below `n`, in order.
            pub fn below(n: usize) -> impl DoubleEndedIterator<Item = $name> + ExactSizeIterator {
                (0..u32::try_from(n).expect(concat!(stringify!($name), " out of range"))).map($name)
            }
        }

        impl std::fmt::Debug for $name {
            fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                std::fmt::Debug::fmt(&self.0, f)
            }
        }

        impl std::fmt::Display for $name {
            fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                std::fmt::Display::fmt(&self.0, f)
            }
        }
    };
}

pub(crate) use index_type;
