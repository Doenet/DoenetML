# Tetum editor and language-server surfaces. Translated from
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
# Written in Tetun Dili; see `chrome.ftl`'s header. Tetum marks no number on the
# noun, so a `{ $count -> … }` whose two English branches differ only in the
# noun renders one string here and the select is dropped.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Fila fali
       *[update] Atualiza
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } vizualizadór
       *[other] { $word } vizualizadór { $shortcut }
    }


## The variant picker

editor-variant = Variante
editor-variant-filter = Filtra…
editor-variant-next = Hili variante tuirmai
editor-variant-previous = Hili variante uluk


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] Hetan violasaun asesibilidade WCAG AA. Klik atu { $action ->
            [close] taka
           *[open] loke
        } relatóriu asesibilidade.
        [advisories] Klik atu { $action ->
            [close] taka
           *[open] loke
        } relatóriu asesibilidade. La hetan violasaun WCAG AA ida, maibé iha rekomendasaun asesibilidade seluk.
       *[clean] Klik atu { $action ->
            [close] taka
           *[open] loke
        } relatóriu asesibilidade. La hetan problema asesibilidade ida.
    }

# No select on `$count` inside the branches: «violasaun» and «rekomendasaun»
# are the same words for one and for many.
editor-accessibility-label =
    { $status ->
        [violations] Hetan violasaun asesibilidade WCAG AA. Hetan violasaun WCAG AA { $count }. Klik atu { $action ->
            [close] taka
           *[open] loke
        } relatóriu asesibilidade.
        [advisories] La hetan violasaun WCAG AA ida. Hetan rekomendasaun asesibilidade seluk { $count }. Klik atu { $action ->
            [close] taka
           *[open] loke
        } relatóriu asesibilidade.
       *[clean] La hetan violasaun WCAG AA ida. Klik atu { $action ->
            [close] taka
           *[open] loke
        } relatóriu asesibilidade.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = Versaun DoenetML { $version }

editor-tab-help = Ajuda tuir kontestu
editor-tab-help-short = Kontestu
editor-tab-errors = Sala
editor-tab-warnings = Avizu
editor-tab-info = Informasaun
editor-tab-accessibility = Asesibilidade
editor-tab-responses = Resposta ne'ebé haruka ona

editor-tab-with-count = { $label }: { $count }

editor-options = Opsaun editór
editor-format-as-doenetml = Formata nu'udar DoenetML
editor-format-as-xml = Formata nu'udar XML


## The diagnostics panel

editor-diagnostic-line = Liña #{ $line }

editor-no-errors = Laiha sala
editor-no-warnings = Laiha avizu
editor-no-info = Laiha diagnóstiku informasaun

editor-show-info-annotations = Hatudu diagnóstiku informasaun iha editór
editor-show-accessibility-annotations = Hatudu diagnóstiku asesibilidade iha editór

editor-accessibility-learn-more = Aprende oinsá Doenet hala'o asesibilidade

editor-accessibility-violations-heading = Violasaun asesibilidade ({ $standard })

editor-accessibility-other-heading = Problema asesibilidade seluk
editor-none-found = La hetan ida


## Submitted responses

editor-no-responses = Seidauk iha resposta ne'ebé haruka
editor-response-answer-id = Id resposta
editor-response-response = Resposta
editor-response-credit = Kréditu
editor-response-submitted = Haruka ona


## The context-help panel

help-placeholder = Tau kursór iha naran tag, atributu, ka { $ref } ba dokumentasaun.

help-unsupported-ref-chain = Ajuda ba referénsia ho parte barak hanesan { $example } seidauk suporta.

help-unresolved-ref =
    { $reason ->
        [notFound] La hetan buat ne'ebé referénsia hatudu: { $ref }.
        [multiple] Hetan buat barak ne'ebé referénsia hatudu: { $ref }.
       *[indeterminate] La bele determina buat ne'ebé { $ref } hatudu.
    }

help-learn-about-references = Aprende kona-ba referénsia →
help-reference-page = Pájina referénsia →

help-suggestions-header =
    { $location ->
        [inside] Iha laran { $element }
       *[top] Iha nivel aas liu
    }{ $allowed ->
        [none] { " — laiha buat ida bele tau iha ne'e." }
        [text] { " — hakerek testu iha ne'e." }
        [text-and-components] { " — hakerek testu iha ne'e, ka koko:" }
       *[components] { " — buat sira ne'ebé bele koko:" }
    }

help-suggestions-footer = Hanehan { $shortcut } atu haree komponente { $total } hotu.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } mak referénsia ba { $target }.
       *[other] { $ref } mak referénsia ba { $target } (liña { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] Lori husi { $owner } nu'udar { $role }.
       *[other] Lori husi { $owner } iha liña { $line } nu'udar { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } mak referénsia ba propriedade { $property } husi { $element }.
       *[other] { $ref } mak referénsia ba propriedade { $property } husi { $element } (liña { $line }).
    }

help-kind-attribute = atributu
help-kind-snippet = kódigu badak
help-kind-array-entry = entrada array

help-default = Padraun:
help-active-default = Padraun ativu:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Valór ne'ebé permite (ida ba kada item):
       *[other] Valór ne'ebé permite:
    }

help-suggested-values = Valór ne'ebé sujere:

help-inserts = Tau tama:

# No select: «koordenada» is the same word for one and for many.
help-coordinates = Koordenada:

help-type = Tipu:

help-resolved-style = Estilu ne'ebé determina ona (styleNumber { $styleNumber }):

help-resolved-function-names = Naran funsaun ne'ebé determina ona:
help-reset-list = Lista reset iha input ne'e:
help-added-on-input = Tau tan iha input ne'e:
help-removed-on-input = Hasai iha input ne'e:

help-reset-overrides = { $reset } troka { $additional } no { $removed }.
