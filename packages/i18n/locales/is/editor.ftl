# Icelandic editor and language-server surfaces. Translated from
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
# Icelandic counts in the same two categories English does, `one` and `other`,
# and keeps both branches wherever the wording differs. `help-coordinates` is
# the one that does not: `hnit` is a neuter noun spelled the same in the plural,
# so its select is dropped rather than written out twice.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Endurstilla
       *[update] Uppfæra
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } skoðarann
       *[other] { $word } skoðarann { $shortcut }
    }


## The variant picker

editor-variant = Útgáfa
editor-variant-filter = Sía…
editor-variant-next = Velja næstu útgáfu
editor-variant-previous = Velja fyrri útgáfu


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] Brot á WCAG AA aðgengiskröfum fannst. Smelltu til að { $action ->
            [close] loka
           *[open] opna
        } aðgengisskýrsluna.
        [advisories] Smelltu til að { $action ->
            [close] loka
           *[open] opna
        } aðgengisskýrsluna. Engin WCAG AA brot fundust, en frekari aðgengisábendingar eru í boði.
       *[clean] Smelltu til að { $action ->
            [close] loka
           *[open] opna
        } aðgengisskýrsluna. Engin aðgengisvandamál fundust.
    }

editor-accessibility-label =
    { $status ->
        [violations] Brot á WCAG AA aðgengiskröfum fannst. { $count ->
            [one] { $count } WCAG AA brot fannst
           *[other] { $count } WCAG AA brot fundust
        }. Smelltu til að { $action ->
            [close] loka
           *[open] opna
        } aðgengisskýrsluna.
        [advisories] Engin WCAG AA brot fundust. { $count ->
            [one] { $count } frekari aðgengisábending fannst
           *[other] { $count } frekari aðgengisábendingar fundust
        }. Smelltu til að { $action ->
            [close] loka
           *[open] opna
        } aðgengisskýrsluna.
       *[clean] Engin WCAG AA brot fundust. Smelltu til að { $action ->
            [close] loka
           *[open] opna
        } aðgengisskýrsluna.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML útgáfa { $version }

editor-tab-help = Samhengisháð hjálp
editor-tab-help-short = Samhengi
editor-tab-errors = Villur
editor-tab-warnings = Aðvaranir
editor-tab-info = Upplýsingar
editor-tab-accessibility = Aðgengi
editor-tab-responses = Innsend svör

editor-tab-with-count = { $label }: { $count }

editor-options = Valkostir ritils
editor-format-as-doenetml = Forsníða sem DoenetML
editor-format-as-xml = Forsníða sem XML


## The diagnostics panel

editor-diagnostic-line = Lína #{ $line }

editor-no-errors = Engar villur
editor-no-warnings = Engar aðvaranir
editor-no-info = Engar upplýsingagreiningar

editor-show-info-annotations = Sýna upplýsingagreiningar í ritli
editor-show-accessibility-annotations = Sýna aðgengisgreiningar í ritli

editor-accessibility-learn-more = Lærðu hvernig Doenet nálgast aðgengi

editor-accessibility-violations-heading = Aðgengisbrot ({ $standard })

editor-accessibility-other-heading = Önnur aðgengisvandamál
editor-none-found = Ekkert fannst


## Submitted responses

editor-no-responses = Engin svör hafa verið send enn
editor-response-answer-id = Auðkenni svars
editor-response-response = Svar
editor-response-credit = Einkunn
editor-response-submitted = Sent


## The context-help panel

help-placeholder = Settu bendilinn á merkisheiti, eigind eða { $ref } til að sjá skjölun.

help-unsupported-ref-chain = Hjálp fyrir margþættar tilvísanir eins og { $example } er ekki studd enn.

help-unresolved-ref =
    { $reason ->
        [notFound] Ekkert viðfang fannst fyrir tilvísunina: { $ref }.
        [multiple] Fleiri en eitt viðfang fannst fyrir tilvísunina: { $ref }.
       *[indeterminate] Ekki tókst að ákvarða viðfang fyrir { $ref }.
    }

help-learn-about-references = Lærðu um tilvísanir →
help-reference-page = Uppflettisíða →

help-suggestions-header =
    { $location ->
        [inside] Inni í { $element }
       *[top] Á efsta stigi
    }{ $allowed ->
        [none] { " — ekkert á heima hér." }
        [text] { " — skrifaðu texta hér." }
        [text-and-components] { " — skrifaðu texta hér, eða prófaðu:" }
       *[components] { " — hluti til að prófa:" }
    }

help-suggestions-footer = Ýttu á { $shortcut } til að sjá allar { $total } einingarnar.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } er tilvísun í { $target }.
       *[other] { $ref } er tilvísun í { $target } (lína { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] Skilgreint af { $owner } sem { $role }.
       *[other] Skilgreint af { $owner } í línu { $line } sem { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } er tilvísun í eigindina { $property } á { $element }.
       *[other] { $ref } er tilvísun í eigindina { $property } á { $element } (lína { $line }).
    }

help-kind-attribute = eigind
help-kind-snippet = bútur
help-kind-array-entry = fylkisfærsla

help-default = Sjálfgefið:
help-active-default = Virkt sjálfgefið:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Leyfð gildi (eitt fyrir hvert atriði):
       *[other] Leyfð gildi:
    }

help-suggested-values = Tillögur að gildum:

help-inserts = Setur inn:

help-coordinates = Hnit:

help-type = Tegund:

help-resolved-style = Uppleyst stílsnið (styleNumber { $styleNumber }):

help-resolved-function-names = Uppleyst fallanöfn:
help-reset-list = Endurstilla listann á þessum inntaksreit:
help-added-on-input = Bætt við á þessum inntaksreit:
help-removed-on-input = Fjarlægt á þessum inntaksreit:

help-reset-overrides = { $reset } gengur framar { $additional } og { $removed }.
