# Lithuanian editor and language-server surfaces. Translated from
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
# Lithuanian counts in three categories a whole number can reach, but only a
# message that prints the number beside a noun needs all three.
# `help-coordinates` never shows its count — it decides a heading's singular
# against its plural — so `one` and `*[other]` are the whole selection there.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Atstatyti
       *[update] Atnaujinti
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } peržiūrą
       *[other] { $word } peržiūrą { $shortcut }
    }


## The variant picker

editor-variant = Variantas
editor-variant-filter = Filtras…
editor-variant-next = Rinktis kitą variantą
editor-variant-previous = Rinktis ankstesnį variantą


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] Nustatytas WCAG AA prieinamumo pažeidimas. Spustelėkite, kad { $action ->
            [close] užvertumėte
           *[open] atvertumėte
        } prieinamumo ataskaitą.
        [advisories] Spustelėkite, kad { $action ->
            [close] užvertumėte
           *[open] atvertumėte
        } prieinamumo ataskaitą. WCAG AA pažeidimų nerasta, bet yra papildomų prieinamumo rekomendacijų.
       *[clean] Spustelėkite, kad { $action ->
            [close] užvertumėte
           *[open] atvertumėte
        } prieinamumo ataskaitą. Prieinamumo problemų nerasta.
    }

editor-accessibility-label =
    { $status ->
        [violations] Nustatytas WCAG AA prieinamumo pažeidimas. Rastas { $count ->
            [one] { $count } WCAG AA pažeidimas
            [few] { $count } WCAG AA pažeidimai
           *[other] { $count } WCAG AA pažeidimų
        }. Spustelėkite, kad { $action ->
            [close] užvertumėte
           *[open] atvertumėte
        } prieinamumo ataskaitą.
        [advisories] WCAG AA pažeidimų nenustatyta. Rasta { $count ->
            [one] { $count } papildoma prieinamumo rekomendacija
            [few] { $count } papildomos prieinamumo rekomendacijos
           *[other] { $count } papildomų prieinamumo rekomendacijų
        }. Spustelėkite, kad { $action ->
            [close] užvertumėte
           *[open] atvertumėte
        } prieinamumo ataskaitą.
       *[clean] WCAG AA pažeidimų nenustatyta. Spustelėkite, kad { $action ->
            [close] užvertumėte
           *[open] atvertumėte
        } prieinamumo ataskaitą.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML versija { $version }

editor-tab-help = Kontekstinis žinynas
editor-tab-help-short = Kontekstas
editor-tab-errors = Klaidos
editor-tab-warnings = Įspėjimai
editor-tab-info = Informacija
editor-tab-accessibility = Prieinamumas
editor-tab-responses = Pateikti atsakymai

editor-tab-with-count = { $label }: { $count }

editor-options = Rengyklės parinktys
editor-format-as-doenetml = Formatuoti kaip DoenetML
editor-format-as-xml = Formatuoti kaip XML


## The diagnostics panel

editor-diagnostic-line = { $line } eilutė

editor-no-errors = Klaidų nėra
editor-no-warnings = Įspėjimų nėra
editor-no-info = Informacinių pranešimų nėra

editor-show-info-annotations = Rodyti informacinius pranešimus rengyklėje
editor-show-accessibility-annotations = Rodyti prieinamumo pranešimus rengyklėje

editor-accessibility-learn-more = Kaip Doenet žiūri į prieinamumą

editor-accessibility-violations-heading = Prieinamumo pažeidimai ({ $standard })

editor-accessibility-other-heading = Kitos prieinamumo problemos
editor-none-found = Nieko nerasta


## Submitted responses

editor-no-responses = Pateiktų atsakymų kol kas nėra
editor-response-answer-id = Atsakymo Id
editor-response-response = Atsakymas
editor-response-credit = Balas
editor-response-submitted = Pateikta


## The context-help panel

help-placeholder = Užveskite žymeklį ant žymos vardo, atributo arba { $ref }, kad pamatytumėte dokumentaciją.

help-unsupported-ref-chain = Žinynas sudėtinėms nuorodoms, tokioms kaip { $example }, kol kas nepalaikomas.

help-unresolved-ref =
    { $reason ->
        [notFound] Nuorodai objektas nerastas: { $ref }.
        [multiple] Nuorodai rasti keli objektai: { $ref }.
       *[indeterminate] Objekto nuorodai { $ref } nustatyti nepavyko.
    }

help-learn-about-references = Sužinokite daugiau apie nuorodas →
help-reference-page = Žinyno puslapis →

help-suggestions-header =
    { $location ->
        [inside] { $element } viduje
       *[top] Aukščiausiame lygyje
    }{ $allowed ->
        [none] { " — čia niekas netinka." }
        [text] { " — čia galima rašyti tekstą." }
        [text-and-components] { " — čia galima rašyti tekstą arba pabandyti:" }
       *[components] { " — galima pabandyti:" }
    }

help-suggestions-footer = Paspauskite { $shortcut }, kad pamatytumėte visus { $total } komponentus.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } yra nuoroda į { $target }.
       *[other] { $ref } yra nuoroda į { $target } ({ $line } eilutė).
    }

help-ref-derived-from =
    { $line ->
        [none] Įvedė { $owner } kaip { $role }.
       *[other] Įvedė { $owner } { $line } eilutėje kaip { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } yra nuoroda į { $element } savybę { $property }.
       *[other] { $ref } yra nuoroda į { $element } savybę { $property } ({ $line } eilutė).
    }

help-kind-attribute = atributas
help-kind-snippet = iškarpa
help-kind-array-entry = masyvo narys

help-default = Numatytoji reikšmė:
help-active-default = Galiojanti numatytoji reikšmė:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Leidžiamos reikšmės (po vieną nariui):
       *[other] Leidžiamos reikšmės:
    }

help-suggested-values = Siūlomos reikšmės:

help-inserts = Įterpia:

help-coordinates =
    { $count ->
        [one] Koordinatė:
       *[other] Koordinatės:
    }

help-type = Tipas:

help-resolved-style = Gautas stilius (styleNumber { $styleNumber }):

help-resolved-function-names = Gauti funkcijų vardai:
help-reset-list = Šio lauko atstatymo sąrašas:
help-added-on-input = Pridėta šiam laukui:
help-removed-on-input = Pašalinta iš šio lauko:

help-reset-overrides = { $reset } turi pirmenybę prieš { $additional } ir { $removed }.
