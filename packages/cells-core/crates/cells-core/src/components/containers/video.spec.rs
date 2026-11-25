//! `<video>`: its size and width (`video.test.ts`).

use crate::spec;

spec! {
    video;

    case "full by default, else its preset or the nearest to its width" {
        doenet r#"<video name="v"><shortDescription>v</shortDescription></video>
                  <video name="small" size="small"><shortDescription>v</shortDescription></video>
                  <video name="w200" width="200"><shortDescription>v</shortDescription></video>"#;
        expect { "v.width" = 850, "small.width" = 255, "w200.width" = 255 }
    }
}
