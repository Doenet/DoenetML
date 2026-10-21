//! `<section>`, `<problem>` and `<title>`, drawn by shapes (ADR 0016).

use cells_core::spec;

spec! {
    section;

    case "a section's heading and contents, as a PreTeXt division" {
        doenet r#"<section name="s"><title name="t">Intro</title><p>Hi</p>
                    <problem name="p"><title>One</title><p>Go</p></problem>
                  </section>"#;
        expect { "s.number" = 1, "p.number" = 1 }
        shape { "s" = "section", "t" = "title", "p" = "section" }
        export {
            "t" = "<title>Intro</title>",
            "p" = "<problem><title>One</title><p>Go</p></problem>",
        }
    }
}
