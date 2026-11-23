//! `<subsetOfReals>`: what it holds is checked in `tests/subsets.rs`.

use crate::spec;

spec! {
    subset_of_reals;

    case "a union of intervals and points, merged" {
        doenet r#"<subsetOfReals name="s">(4,5) union (5,6) union {5}</subsetOfReals>
                  <boolean name="b">$s = (4, 6)</boolean>"#;
        expect { "b.value" = 1 }
    }

    case "an inequality in its variable" {
        doenet r#"<subsetOfReals name="s" variable="q">q >= 4</subsetOfReals>
                  <boolean name="b">$s = [4, infinity)</boolean>"#;
        expect { "b.value" = 1 }
    }
}
