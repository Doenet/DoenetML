//! Index types: a position in one particular list, as its own type, so an
//! index into one list cannot be passed where an index into another is
//! meant. Each wraps a `u32` and is read as a position through `index()`.

/// What every index type is: a position, as a type a generic reader of
/// positions (the refuse analysis over a program or over a build's slots)
/// can take.
pub(crate) trait Idx: Copy + Eq + std::fmt::Debug {
    fn index(self) -> usize;
    fn from_index(i: usize) -> Self;
}

/// Define an index type over `u32`. Its `Debug` and `Display` print the
/// bare number.
macro_rules! index_type {
    ($(#[$attr:meta])* $vis:vis struct $name:ident;) => {
        $(#[$attr])*
        #[derive(Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Hash, Default)]
        #[repr(transparent)]
        $vis struct $name(u32);

        // Not every type uses every helper; a crate-private one would warn.
        #[allow(dead_code)]
        impl $name {
            /// No position: a sentinel for "none", never an index.
            $vis const NONE: $name = $name(u32::MAX);

            /// The index of raw number `i`.
            $vis const fn new(i: u32) -> $name {
                $name(i)
            }

            /// The index at position `i`. Panics if `i` does not fit a `u32`.
            #[inline(always)]
            $vis fn from_index(i: usize) -> $name {
                $name(u32::try_from(i).expect(concat!(stringify!($name), " out of range")))
            }

            /// The position, to index the list with.
            #[inline(always)]
            $vis const fn index(self) -> usize {
                self.0 as usize
            }

            /// The raw number, for the wire and for hashing.
            #[inline(always)]
            $vis const fn get(self) -> u32 {
                self.0
            }

            /// Whether this is [`NONE`](Self::NONE).
            $vis const fn is_none(self) -> bool {
                self.0 == u32::MAX
            }

            /// The index `k` places after this one.
            #[inline(always)]
            $vis fn offset(self, k: usize) -> $name {
                $name(self.0 + k as u32)
            }

            /// A slice of these as the `u32`s they are, for the wire and for
            /// hashing.
            $vis fn as_u32s(v: &[$name]) -> &[u32] {
                // SAFETY: `$name` is `repr(transparent)` over `u32`.
                unsafe { std::slice::from_raw_parts(v.as_ptr().cast::<u32>(), v.len()) }
            }

            /// `u32`s read from the wire, as these.
            $vis fn from_u32s(v: Vec<u32>) -> Vec<$name> {
                v.into_iter().map($name).collect()
            }

            /// The `n` indices from `start` on, in order: a run of a list
            /// kept as (start, count).
            $vis fn span(start: u32, n: u32) -> impl DoubleEndedIterator<Item = $name> + ExactSizeIterator + Clone {
                (start..start + n).map($name)
            }

            /// Every index below `n`, in order.
            $vis fn below(n: usize) -> impl DoubleEndedIterator<Item = $name> + ExactSizeIterator {
                (0..u32::try_from(n).expect(concat!(stringify!($name), " out of range"))).map($name)
            }
        }

        impl crate::index::Idx for $name {
            #[inline(always)]
            fn index(self) -> usize {
                self.0 as usize
            }
            #[inline(always)]
            fn from_index(i: usize) -> Self {
                $name::from_index(i)
            }
        }

        impl std::fmt::Debug for $name {
            fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                std::fmt::Debug::fmt(&self.0, f)
            }
        }

        impl serde::Serialize for $name {
            fn serialize<S: serde::Serializer>(&self, s: S) -> std::result::Result<S::Ok, S::Error> {
                s.serialize_u32(self.0)
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

index_type! {
    /// A position in [`Built::cells`](crate::Built::cells), and in every list kept per cell.
    pub struct CellIdx;
}

index_type! {
    /// A component: a position in the [`ComponentTable`](crate::ComponentTable)'s columns.
    pub struct CompIdx;
}
