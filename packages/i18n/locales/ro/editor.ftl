# Romanian editor and language-server surfaces. Translated from
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


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Resetează
       *[update] Actualizează
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } vizualizatorul
       *[other] { $word } vizualizatorul { $shortcut }
    }


## The variant picker

editor-variant = Variantă
editor-variant-filter = Filtrează…
editor-variant-next = Selectează varianta următoare
editor-variant-previous = Selectează varianta anterioară


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] A fost identificată o încălcare a accesibilității WCAG AA. Faceți clic pentru a { $action ->
            [close] închide
           *[open] deschide
        } raportul de accesibilitate.
        [advisories] Faceți clic pentru a { $action ->
            [close] închide
           *[open] deschide
        } raportul de accesibilitate. Nu au fost găsite încălcări WCAG AA, dar există recomandări suplimentare de accesibilitate.
       *[clean] Faceți clic pentru a { $action ->
            [close] închide
           *[open] deschide
        } raportul de accesibilitate. Nu au fost găsite probleme de accesibilitate.
    }

editor-accessibility-label =
    { $status ->
        [violations] A fost identificată o încălcare a accesibilității WCAG AA. { $count ->
            [one] A fost găsită { $count } încălcare WCAG AA
            [few] Au fost găsite { $count } încălcări WCAG AA
           *[other] Au fost găsite { $count } de încălcări WCAG AA
        }. Faceți clic pentru a { $action ->
            [close] închide
           *[open] deschide
        } raportul de accesibilitate.
        [advisories] Nu au fost identificate încălcări WCAG AA. { $count ->
            [one] A fost găsită { $count } recomandare suplimentară de accesibilitate
            [few] Au fost găsite { $count } recomandări suplimentare de accesibilitate
           *[other] Au fost găsite { $count } de recomandări suplimentare de accesibilitate
        }. Faceți clic pentru a { $action ->
            [close] închide
           *[open] deschide
        } raportul de accesibilitate.
       *[clean] Nu au fost identificate încălcări WCAG AA. Faceți clic pentru a { $action ->
            [close] închide
           *[open] deschide
        } raportul de accesibilitate.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = Versiunea DoenetML { $version }

editor-tab-help = Ajutor contextual
editor-tab-help-short = Context
editor-tab-errors = Erori
editor-tab-warnings = Avertismente
editor-tab-info = Informații
editor-tab-accessibility = Accesibilitate
editor-tab-responses = Răspunsuri trimise

editor-tab-with-count = { $label }: { $count }

editor-options = Opțiuni ale editorului
editor-format-as-doenetml = Formatează ca DoenetML
editor-format-as-xml = Formatează ca XML


## The diagnostics panel

editor-diagnostic-line = Linia nr. { $line }

editor-no-errors = Nicio eroare
editor-no-warnings = Niciun avertisment
editor-no-info = Niciun mesaj informativ

editor-show-info-annotations = Afișează mesajele informative în editor
editor-show-accessibility-annotations = Afișează mesajele de accesibilitate în editor

editor-accessibility-learn-more = Cum abordează Doenet accesibilitatea

editor-accessibility-violations-heading = Încălcări ale accesibilității ({ $standard })

editor-accessibility-other-heading = Alte probleme de accesibilitate
editor-none-found = Nimic găsit


## Submitted responses

editor-no-responses = Încă niciun răspuns trimis
editor-response-answer-id = Id-ul răspunsului
editor-response-response = Răspuns
editor-response-credit = Punctaj
editor-response-submitted = Trimis


## The context-help panel

help-placeholder = Plasați cursorul pe un nume de etichetă, pe un atribut sau pe { $ref } pentru documentație.

help-unsupported-ref-chain = Ajutorul pentru referințe compuse precum { $example } nu este încă acceptat.

help-unresolved-ref =
    { $reason ->
        [notFound] Nu s-a găsit niciun referent pentru referința: { $ref }.
        [multiple] S-au găsit mai mulți referenți pentru referința: { $ref }.
       *[indeterminate] Referentul pentru { $ref } nu a putut fi determinat.
    }

help-learn-about-references = Aflați despre referințe →
help-reference-page = Pagina de referință →

help-suggestions-header =
    { $location ->
        [inside] În interiorul { $element }
       *[top] La nivelul superior
    }{ $allowed ->
        [none] { " — aici nu se pune nimic." }
        [text] { " — aici se scrie text." }
        [text-and-components] { " — aici se scrie text sau se poate încerca:" }
       *[components] { " — ce se poate încerca:" }
    }

help-suggestions-footer = Apăsați { $shortcut } pentru a vedea toate cele { $total } componente.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } este o referință la { $target }.
       *[other] { $ref } este o referință la { $target } (linia { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] Introdus de { $owner } ca { $role }.
       *[other] Introdus de { $owner } la linia { $line } ca { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } este o referință la proprietatea { $property } a { $element }.
       *[other] { $ref } este o referință la proprietatea { $property } a { $element } (linia { $line }).
    }

help-kind-attribute = atribut
help-kind-snippet = fragment
help-kind-array-entry = element de tablou

help-default = Implicit:
help-active-default = Implicit activ:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Valori permise (una pentru fiecare element):
       *[other] Valori permise:
    }

help-suggested-values = Valori sugerate:

help-inserts = Inserează:

help-coordinates =
    { $count ->
        [one] Coordonată:
       *[other] Coordonate:
    }

help-type = Tip:

help-resolved-style = Stil rezolvat (styleNumber { $styleNumber }):

help-resolved-function-names = Nume de funcții rezolvate:
help-reset-list = Resetarea listei pe această intrare:
help-added-on-input = Adăugate pe această intrare:
help-removed-on-input = Eliminate pe această intrare:

help-reset-overrides = { $reset } are prioritate față de { $additional } și { $removed }.
