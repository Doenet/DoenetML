//! `<caption>`: the caption of its figure, whose content is built like any
//! other's.

use crate::spec;

spec! {
    caption;

    case "a value in a caption follows its source" {
        doenet r#"<numberInput name="n" value="2"/>
                  <figure><caption>Radius <number name="r">2$n</number></caption></figure>"#;
        expect { "r.value" = 4 }
        request { "n.value" = 5 }
        expect { "r.value" = 10 }
    }
}
