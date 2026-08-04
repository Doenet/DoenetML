# Slovene editor and language-server surfaces. Translated from
# `locales/en/editor.ftl`, which is the source of truth: `lint:i18n` rejects a
# key that does not exist there, and reports a key that exists there but not
# here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# `WCAG AA`, `DoenetML`, `XML`, `styleNumber` and every attribute or element
# name are identifiers, not prose, and stay as written.
#
# Slovene counts in four plural categories, `two` among them, but only a
# message that prints the number beside a noun needs all four.
# `help-coordinates` never shows its count — it decides a heading's singular
# against its plural — so `one` and `*[other]` are the whole selection there.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Ponastavi
       *[update] Posodobi
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } pregledovalnik
       *[other] { $word } pregledovalnik { $shortcut }
    }


## The variant picker

editor-variant = Različica
editor-variant-filter = Filter …
editor-variant-next = Izberi naslednjo različico
editor-variant-previous = Izberi prejšnjo različico


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] Ugotovljena je kršitev dostopnosti po WCAG AA. Kliknite, da { $action ->
            [close] zaprete
           *[open] odprete
        } poročilo o dostopnosti.
        [advisories] Kliknite, da { $action ->
            [close] zaprete
           *[open] odprete
        } poročilo o dostopnosti. Kršitev po WCAG AA ni bilo najdenih, so pa na voljo dodatna priporočila o dostopnosti.
       *[clean] Kliknite, da { $action ->
            [close] zaprete
           *[open] odprete
        } poročilo o dostopnosti. Težav z dostopnostjo ni bilo najdenih.
    }

editor-accessibility-label =
    { $status ->
        [violations] Ugotovljena je kršitev dostopnosti po WCAG AA. Najdena je { $count ->
            [one] { $count } kršitev po WCAG AA
            [two] { $count } kršitvi po WCAG AA
            [few] { $count } kršitve po WCAG AA
           *[other] { $count } kršitev po WCAG AA
        }. Kliknite, da { $action ->
            [close] zaprete
           *[open] odprete
        } poročilo o dostopnosti.
        [advisories] Kršitev po WCAG AA ni bilo ugotovljenih. Najdeno je { $count ->
            [one] { $count } dodatno priporočilo o dostopnosti
            [two] { $count } dodatni priporočili o dostopnosti
            [few] { $count } dodatna priporočila o dostopnosti
           *[other] { $count } dodatnih priporočil o dostopnosti
        }. Kliknite, da { $action ->
            [close] zaprete
           *[open] odprete
        } poročilo o dostopnosti.
       *[clean] Kršitev po WCAG AA ni bilo ugotovljenih. Kliknite, da { $action ->
            [close] zaprete
           *[open] odprete
        } poročilo o dostopnosti.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = Različica { $version } DoenetML

editor-tab-help = Kontekstna pomoč
editor-tab-help-short = Kontekst
editor-tab-errors = Napake
editor-tab-warnings = Opozorila
editor-tab-info = Informacije
editor-tab-accessibility = Dostopnost
editor-tab-responses = Oddani odgovori

editor-tab-with-count = { $label }: { $count }

editor-options = Nastavitve urejevalnika
editor-format-as-doenetml = Oblikuj kot DoenetML
editor-format-as-xml = Oblikuj kot XML


## The diagnostics panel

editor-diagnostic-line = Vrstica št. { $line }

editor-no-errors = Ni napak
editor-no-warnings = Ni opozoril
editor-no-info = Ni informativnih sporočil

editor-show-info-annotations = Prikazuj informativna sporočila v urejevalniku
editor-show-accessibility-annotations = Prikazuj sporočila o dostopnosti v urejevalniku

editor-accessibility-learn-more = Kako Doenet pristopa k dostopnosti

editor-accessibility-violations-heading = Kršitve dostopnosti ({ $standard })

editor-accessibility-other-heading = Druge težave z dostopnostjo
editor-none-found = Nič ni najdeno


## Submitted responses

editor-no-responses = Oddanih odgovorov še ni
editor-response-answer-id = Id odgovora
editor-response-response = Odgovor
editor-response-credit = Točke
editor-response-submitted = Oddano


## The context-help panel

help-placeholder = Postavite kazalko na ime oznake, atribut ali { $ref } za dokumentacijo.

help-unsupported-ref-chain = Pomoč za večdelne sklice, kot je { $example }, še ni podprta.

help-unresolved-ref =
    { $reason ->
        [notFound] Za sklic ni najdenega predmeta: { $ref }.
        [multiple] Za sklic je najdenih več predmetov: { $ref }.
       *[indeterminate] Predmeta za { $ref } ni bilo mogoče določiti.
    }

help-learn-about-references = Več o sklicih →
help-reference-page = Stran priročnika →

help-suggestions-header =
    { $location ->
        [inside] Znotraj { $element }
       *[top] Na najvišji ravni
    }{ $allowed ->
        [none] { " — sem ne sodi nič." }
        [text] { " — sem lahko vpišete besedilo." }
        [text-and-components] { " — sem lahko vpišete besedilo ali poskusite:" }
       *[components] { " — lahko poskusite:" }
    }

help-suggestions-footer = Pritisnite { $shortcut }, da vidite vseh { $total } komponent.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } je sklic na { $target }.
       *[other] { $ref } je sklic na { $target } (vrstica { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] Uvedel ga je { $owner } kot { $role }.
       *[other] Uvedel ga je { $owner } v vrstici { $line } kot { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } je sklic na lastnost { $property } elementa { $element }.
       *[other] { $ref } je sklic na lastnost { $property } elementa { $element } (vrstica { $line }).
    }

help-kind-attribute = atribut
help-kind-snippet = izsek
help-kind-array-entry = član polja

help-default = Privzeta vrednost:
help-active-default = Veljavna privzeta vrednost:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Dovoljene vrednosti (po ena na član):
       *[other] Dovoljene vrednosti:
    }

help-suggested-values = Predlagane vrednosti:

help-inserts = Vstavi:

help-coordinates =
    { $count ->
        [one] Koordinata:
       *[other] Koordinate:
    }

help-type = Vrsta:

help-resolved-style = Dobljeni slog (styleNumber { $styleNumber }):

help-resolved-function-names = Dobljena imena funkcij:
help-reset-list = Seznam za ponastavitev pri tem polju:
help-added-on-input = Dodano pri tem polju:
help-removed-on-input = Odstranjeno pri tem polju:

help-reset-overrides = { $reset } povozi { $additional } in { $removed }.
