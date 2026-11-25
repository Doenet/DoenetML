//! `<variantControl>`: the document's variants (ADR 0085;
//! `tests/variants.rs` loads each variant and reads what it picked).

use crate::spec;

spec! {
    variant_control;

    case "a control is read when compiled and builds no value" {
        doenet r#"<variantControl numVariants="3" variantNames="x y z" />
                  <number name="n">2</number>"#;
        expect { "n.value" = 2 }
    }
}
