# Colognian (Kölsch) editor and language-server surfaces: the footer, the
# diagnostics panel, the variant picker, the accessibility button and the
# context-help panel. Selected by `uiLocale`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Orthography.** The Akademie för uns Kölsche Sproch convention; see
# `chrome.ftl` for the note on «ß», the doubled vowels and the «j» where
# Standard German has «g» — «jood», «jesäht», «jroß».
#
# **Do not edit this toward Standard German**: «nit», «kütt», «Sigg», «Beld»,
# «Fähler» and «däm» are correct as they stand. See `chrome.ftl`.
#
# **`WCAG`, `WCAG AA`, `DoenetML`, `XML` and `styleNumber` are names and
# identifiers**, not words, and stay in English exactly as `locales/en` writes
# them — as do the attribute names in `help-reset-overrides`.
#
# **This file carries the batch's one `[zero]` branch.** CLDR gives `ksh` the
# categories `zero`, `one` and `other`, and `zero` selects at n = 0.
# `help-suggestions-footer` is where that is genuinely useful: English has no
# explicit `[0]` there, the count is a real count of components, and it can
# really be nothing. Contrast `attempts-remaining` in `chrome.ftl`, where
# English writes an explicit `[0]` — that literal is matched against the number
# itself, a `[zero]` is matched against the CLDR category, and putting both on
# one selector is a trap. `chrome.ftl`'s header sets the whole distinction out.
# `[two]`, `[few]` and `[many]` are never written: `ksh` has none of them.
#
# Every symbolic selector — `$action`, `$status`, `$shortcut`, `$reason`,
# `$location`, `$allowed`, `$line`, `$perItem` — is kept byte for byte from
# English.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Zeröck
       *[update] Frisch maache
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } — Aansich
       *[other] { $word } — Aansich { $shortcut }
    }


## The variant picker

editor-variant = Variant

editor-variant-filter = Filtere…

editor-variant-next = De nächste Variant nemme

editor-variant-previous = De vörije Variant nemme


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] Do es ene WCAG-AA-Verstoß jäjen de Barrierefreiheit jefunge woode. Klick, öm der Beriech { $action ->
            [close] zozemaache
           *[open] opzemaache
        }.
        [advisories] Klick, öm der Beriech zur Barrierefreiheit { $action ->
            [close] zozemaache
           *[open] opzemaache
        }. Et sin kein WCAG-AA-Verstöß jefunge woode, ävver et jitt noch Vörschläch zur Barrierefreiheit.
       *[clean] Klick, öm der Beriech zur Barrierefreiheit { $action ->
            [close] zozemaache
           *[open] opzemaache
        }. Et sin kei Probleme met der Barrierefreiheit jefunge woode.
    }

editor-accessibility-label =
    { $status ->
        [violations] Do es ene WCAG-AA-Verstoß jäjen de Barrierefreiheit jefunge woode. { $count ->
            [one] { $count } WCAG-AA-Verstoß
           *[other] { $count } WCAG-AA-Verstöß
        } jefunge. Klick, öm der Beriech zur Barrierefreiheit { $action ->
            [close] zozemaache
           *[open] opzemaache
        }.
        [advisories] Et sin kein WCAG-AA-Verstöß jefunge woode. { $count ->
            [one] { $count } wigglere Vörschlaach zur Barrierefreiheit
           *[other] { $count } wigglere Vörschläch zur Barrierefreiheit
        } jefunge. Klick, öm der Beriech zur Barrierefreiheit { $action ->
            [close] zozemaache
           *[open] opzemaache
        }.
       *[clean] Et sin kein WCAG-AA-Verstöß jefunge woode. Klick, öm der Beriech zur Barrierefreiheit { $action ->
            [close] zozemaache
           *[open] opzemaache
        }.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML-Version { $version }

editor-tab-help = Hölp för dat, wo der Cursor steiht
editor-tab-help-short = Hölp
editor-tab-errors = Fähler
editor-tab-warnings = Warnunge
editor-tab-info = Info
editor-tab-accessibility = Barrierefreiheit
editor-tab-responses = Jescheckte Antwoode

editor-tab-with-count = { $label }: { $count }

editor-options = Enstellunge vum Editor
editor-format-as-doenetml = Als DoenetML formatiere
editor-format-as-xml = Als XML formatiere


## The diagnostics panel

editor-diagnostic-line = Reih #{ $line }

editor-no-errors = Kei Fähler
editor-no-warnings = Kein Warnunge
editor-no-info = Kein Info-Meldunge

editor-show-info-annotations = Info-Meldunge em Editor zeije
editor-show-accessibility-annotations = Meldunge zur Barrierefreiheit em Editor zeije

editor-accessibility-learn-more = Su jeiht Doenet met der Barrierefreiheit öm

editor-accessibility-violations-heading = Verstöß jäjen de Barrierefreiheit ({ $standard })

editor-accessibility-other-heading = Andere Saache zur Barrierefreiheit
editor-none-found = Nix jefunge


## Submitted responses

editor-no-responses = Noch kein Antwoode jescheck
editor-response-answer-id = Naam vun der Antwood
editor-response-response = Antwood
editor-response-credit = Punkte
editor-response-submitted = Jescheck


## The context-help panel

help-placeholder = Stell der Cursor op ene Tag-Naam, op e Attribut odder op { $ref }, öm de Dokementazjohn ze sinn.

help-unsupported-ref-chain = För Verwiese us mieh Deile, wie { $example }, jitt et noch kein Hölp.

help-unresolved-ref =
    { $reason ->
        [notFound] Nix jefunge, wo dä Verwies { $ref } drop zeije däät.
        [multiple] Mieh wie ein Saach jefunge, wo dä Verwies { $ref } drop zeije künnt.
       *[indeterminate] Et wor nit ze bestemme, wo { $ref } drop zeig.
    }

help-learn-about-references = Mieh övver Verwiese →
help-reference-page = Sigg met der Dokementazjohn →

help-suggestions-header =
    { $location ->
        [inside] En { $element }
       *[top] Janz bovve em Dokemänt
    }{ $allowed ->
        [none] { " — hee kütt nix eren." }
        [text] { " — hee kütt Tex eren." }
        [text-and-components] { " — hee kütt Tex eren, odder probeer ens:" }
       *[components] { " — probeer ens:" }
    }

# The `[zero]` branch is this catalog's headline: `$total` is a real count,
# CLDR gives `ksh` a `zero` category, and no `[0]` literal stands beside it.
help-suggestions-footer =
    { $total ->
        [zero] Drök { $shortcut }, ävver hee kütt kei Komponent eren.
        [one] Drök { $shortcut }, öm de ein möjlije Komponent ze sinn.
       *[other] Drök { $shortcut }, öm all { $total } Komponente ze sinn.
    }

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } es ene Verwies op { $target }.
       *[other] { $ref } es ene Verwies op { $target } (Reih { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] Enjeführt vun { $owner } als { $role }.
       *[other] Enjeführt vun { $owner } en Reih { $line } als { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } es ene Verwies op de Eijeschaff { $property } vun { $element }.
       *[other] { $ref } es ene Verwies op de Eijeschaff { $property } vun { $element } (Reih { $line }).
    }

help-kind-attribute = Attribut
help-kind-snippet = Schnepsel
help-kind-array-entry = Enndraach em Feld

help-default = Standard:
help-active-default = Aktive Standard:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Ählaubte Wääte (eine pro Endraach):
       *[other] Ählaubte Wääte:
    }

help-suggested-values = Vörjeschlare Wääte:

help-inserts = Setz en:

help-coordinates =
    { $count ->
        [one] Koordinat:
       *[other] Koordinate:
    }

help-type = Zoot:

help-resolved-style = Erjevve Stil (styleNumber { $styleNumber }):

help-resolved-function-names = Erjevve Funkzjohnsnaame:
help-reset-list = Leß, di dä Enjab zeröckjesatz weed:
help-added-on-input = Bei däm Enjab dobei jedonn:
help-removed-on-input = Bei däm Enjab eruusjenomme:

help-reset-overrides = { $reset } jeiht övver { $additional } un { $removed }.
