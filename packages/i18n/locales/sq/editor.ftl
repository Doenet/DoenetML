# Albanian editor and language-server surfaces. Translated from
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
# Albanian counts in the same two categories English does, so every selection
# below keeps both branches.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Rivendos
       *[update] Përditëso
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } shikuesin
       *[other] { $word } shikuesin { $shortcut }
    }


## The variant picker

editor-variant = Variant
editor-variant-filter = Filtro…
editor-variant-next = Zgjidh variantin tjetër
editor-variant-previous = Zgjidh variantin e mëparshëm


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] U gjet një shkelje e qasshmërisë sipas WCAG AA. Klikoni për { $action ->
            [close] ta mbyllur
           *[open] ta hapur
        } raportin e qasshmërisë.
        [advisories] Klikoni për { $action ->
            [close] ta mbyllur
           *[open] ta hapur
        } raportin e qasshmërisë. Nuk u gjetën shkelje sipas WCAG AA, por ka rekomandime shtesë për qasshmërinë.
       *[clean] Klikoni për { $action ->
            [close] ta mbyllur
           *[open] ta hapur
        } raportin e qasshmërisë. Nuk u gjetën probleme qasshmërie.
    }

editor-accessibility-label =
    { $status ->
        [violations] U gjet një shkelje e qasshmërisë sipas WCAG AA. U gjet { $count ->
            [one] { $count } shkelje sipas WCAG AA
           *[other] { $count } shkelje sipas WCAG AA
        }. Klikoni për { $action ->
            [close] ta mbyllur
           *[open] ta hapur
        } raportin e qasshmërisë.
        [advisories] Nuk u gjetën shkelje sipas WCAG AA. U gjet { $count ->
            [one] { $count } rekomandim shtesë për qasshmërinë
           *[other] { $count } rekomandime shtesë për qasshmërinë
        }. Klikoni për { $action ->
            [close] ta mbyllur
           *[open] ta hapur
        } raportin e qasshmërisë.
       *[clean] Nuk u gjetën shkelje sipas WCAG AA. Klikoni për { $action ->
            [close] ta mbyllur
           *[open] ta hapur
        } raportin e qasshmërisë.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = Versioni { $version } i DoenetML

editor-tab-help = Ndihmë sipas kontekstit
editor-tab-help-short = Konteksti
editor-tab-errors = Gabime
editor-tab-warnings = Paralajmërime
editor-tab-info = Informacion
editor-tab-accessibility = Qasshmëri
editor-tab-responses = Përgjigje të dërguara

editor-tab-with-count = { $label }: { $count }

editor-options = Mundësitë e redaktuesit
editor-format-as-doenetml = Formato si DoenetML
editor-format-as-xml = Formato si XML


## The diagnostics panel

editor-diagnostic-line = Rreshti nr. { $line }

editor-no-errors = Nuk ka gabime
editor-no-warnings = Nuk ka paralajmërime
editor-no-info = Nuk ka njoftime informuese

editor-show-info-annotations = Shfaq njoftimet informuese te redaktuesi
editor-show-accessibility-annotations = Shfaq njoftimet e qasshmërisë te redaktuesi

editor-accessibility-learn-more = Si e trajton Doenet qasshmërinë

editor-accessibility-violations-heading = Shkelje të qasshmërisë ({ $standard })

editor-accessibility-other-heading = Probleme të tjera të qasshmërisë
editor-none-found = Nuk u gjet asgjë


## Submitted responses

editor-no-responses = Ende nuk ka përgjigje të dërguara
editor-response-answer-id = Id-ja e përgjigjes
editor-response-response = Përgjigje
editor-response-credit = Pikë
editor-response-submitted = Dërguar


## The context-help panel

help-placeholder = Vendosni kursorin mbi një emër etikete, një atribut ose { $ref } për dokumentimin.

help-unsupported-ref-chain = Ndihma për referenca shumëpjesëshe si { $example } ende nuk mbulohet.

help-unresolved-ref =
    { $reason ->
        [notFound] Nuk u gjet objekt për referencën: { $ref }.
        [multiple] U gjetën disa objekte për referencën: { $ref }.
       *[indeterminate] Objekti për { $ref } nuk mundi të përcaktohej.
    }

help-learn-about-references = Mësoni më shumë për referencat →
help-reference-page = Faqja e referencës →

help-suggestions-header =
    { $location ->
        [inside] Brenda { $element }
       *[top] Në nivelin e sipërm
    }{ $allowed ->
        [none] { " — këtu nuk shkon asgjë." }
        [text] { " — këtu mund të shkruani tekst." }
        [text-and-components] { " — këtu mund të shkruani tekst ose të provoni:" }
       *[components] { " — mund të provoni:" }
    }

help-suggestions-footer = Shtypni { $shortcut } për të parë të { $total } përbërësit.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } është referencë te { $target }.
       *[other] { $ref } është referencë te { $target } (rreshti { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] E futi { $owner } si { $role }.
       *[other] E futi { $owner } në rreshtin { $line } si { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } është referencë te vetia { $property } e { $element }.
       *[other] { $ref } është referencë te vetia { $property } e { $element } (rreshti { $line }).
    }

help-kind-attribute = atribut
help-kind-snippet = copëz
help-kind-array-entry = njësi vargu

help-default = Vlera e parazgjedhur:
help-active-default = Vlera e parazgjedhur në fuqi:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Vlerat e lejuara (një për njësi):
       *[other] Vlerat e lejuara:
    }

help-suggested-values = Vlerat e sugjeruara:

help-inserts = Fut:

help-coordinates =
    { $count ->
        [one] Koordinatë:
       *[other] Koordinata:
    }

help-type = Lloji:

help-resolved-style = Stili i marrë (styleNumber { $styleNumber }):

help-resolved-function-names = Emrat e marrë të funksioneve:
help-reset-list = Lista e rivendosjes për këtë fushë:
help-added-on-input = Shtuar për këtë fushë:
help-removed-on-input = Hequr për këtë fushë:

help-reset-overrides = { $reset } ka përparësi ndaj { $additional } dhe { $removed }.
