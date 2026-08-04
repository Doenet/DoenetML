# Luganda editor and language-server surfaces. Translated from
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
# Luganda marks number with a class prefix and keeps doing so after a numeral,
# so a counted message keeps its select where the noun it counts has a plural
# to change into: `help-coordinates` does, «akabonero» becoming «obubonero».
# `editor-accessibility-label` does not, and both of its counted nouns are the
# reason rather than one of them: «okumenya», a violation, is the class 15
# verbal noun and has no plural at all, and «amagezi», advice, is already
# class 6 and counts without changing. So both of its selects are dropped
# rather than written as a `[one]` that repeats its `[other]`.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Zzaawo
       *[update] Longoosa
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } Omulaga
       *[other] { $word } Omulaga { $shortcut }
    }


## The variant picker

editor-variant = Engeri
editor-variant-filter = Londa...
editor-variant-next = Londa engeri eddako
editor-variant-previous = Londa engeri eyise


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] Okumenya etteeka lya WCAG AA ery'okutuukirira kuzuuliddwa. Nyiga o{ $action ->
            [close] ggalewo
           *[open] ggulewo
        } alipoota y'okutuukirira.
        [advisories] Nyiga o{ $action ->
            [close] ggalewo
           *[open] ggulewo
        } alipoota y'okutuukirira. Tewali kumenya WCAG AA okuzuuliddwa, naye waliwo amagezi amalala ku kutuukirira.
       *[clean] Nyiga o{ $action ->
            [close] ggalewo
           *[open] ggulewo
        } alipoota y'okutuukirira. Tewali kizibu kya kutuukirira ekizuuliddwa.
    }

editor-accessibility-label =
    { $status ->
        [violations] Okumenya etteeka lya WCAG AA ery'okutuukirira kuzuuliddwa. Okumenya { $count } okwa WCAG AA kuzuuliddwa. Nyiga o{ $action ->
            [close] ggalewo
           *[open] ggulewo
        } alipoota y'okutuukirira.
        [advisories] Tewali kumenya WCAG AA okuzuuliddwa. Amagezi { $count } amalala ag'okutuukirira gazuuliddwa. Nyiga o{ $action ->
            [close] ggalewo
           *[open] ggulewo
        } alipoota y'okutuukirira.
       *[clean] Tewali kumenya WCAG AA okuzuuliddwa. Nyiga o{ $action ->
            [close] ggalewo
           *[open] ggulewo
        } alipoota y'okutuukirira.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML engeri { $version }

editor-tab-help = Obuyambi obutuukira ku kifo
editor-tab-help-short = Ekifo
editor-tab-errors = Ensobi
editor-tab-warnings = Okulabula
editor-tab-info = Ebiwandiiko
editor-tab-accessibility = Okutuukirira
editor-tab-responses = Eby'okuddamu ebiweereddwa

editor-tab-with-count = { $label }: { $count }

editor-options = Obulonzi bw'omuwandiisi
editor-format-as-doenetml = Tegeka nga DoenetML
editor-format-as-xml = Tegeka nga XML


## The diagnostics panel

editor-diagnostic-line = Olunyiriri #{ $line }

editor-no-errors = Tewali Nsobi
editor-no-warnings = Tewali Kulabula
editor-no-info = Tewali Kukebera kwa Biwandiiko

editor-show-info-annotations = Laga okukebera kw'ebiwandiiko mu muwandiisi
editor-show-accessibility-annotations = Laga okukebera kw'okutuukirira mu muwandiisi

editor-accessibility-learn-more = Yiga engeri Doenet gy'ekwatamu okutuukirira

editor-accessibility-violations-heading = Okumenya etteeka ly'okutuukirira ({ $standard })

editor-accessibility-other-heading = Ebizibu ebirala eby'okutuukirira
editor-none-found = Tewali kizuuliddwa


## Submitted responses

editor-no-responses = Tewali ky'okuddamu kiweereddwa kati
editor-response-answer-id = Erinnya ly'Eky'okuddamu
editor-response-response = Eky'okuddamu
editor-response-credit = Amanya
editor-response-submitted = Kiweereddwa


## The context-help panel

help-placeholder = Teeka akabonero ku linnya lya tagi, engeri oba { $ref } okufuna ebiwandiiko.

help-unsupported-ref-chain = Obuyambi ku bulaga obw'ebitundu bingi nga { $example } tebunnaba kubaawo.

help-unresolved-ref =
    { $reason ->
        [notFound] Tewali kizuuliddwa ku kulaga: { $ref }.
        [multiple] Ebintu bingi bizuuliddwa ku kulaga: { $ref }.
       *[indeterminate] Ekyo { $ref } ky'eraga tekimanyiddwa.
    }

help-learn-about-references = Yiga ku bulaga →
help-reference-page = Olupapula lw'obulaga →

help-suggestions-header =
    { $location ->
        [inside] Munda mu { $element }
       *[top] Ku mutindo ogwa waggulu
    }{ $allowed ->
        [none] { " — tewali kiyingira wano." }
        [text] { " — wandiika ebigambo wano." }
        [text-and-components] { " — wandiika ebigambo wano, oba gezaako:" }
       *[components] { " — ebintu by'oyinza okugezaako:" }
    }

help-suggestions-footer = Nyiga { $shortcut } okulaba ebintu byonna { $total }.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } kwe kulaga okwa { $target }.
       *[other] { $ref } kwe kulaga okwa { $target } (olunyiriri { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] { $owner } yakituuma { $role }.
       *[other] { $owner } yakituuma { $role } ku lunyiriri { $line }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } kwe kulaga okw'engeri { $property } eya { $element }.
       *[other] { $ref } kwe kulaga okw'engeri { $property } eya { $element } (olunyiriri { $line }).
    }

help-kind-attribute = engeri
help-kind-snippet = akatundu k'ebigambo
help-kind-array-entry = ekiyingizibwa mu ttebulo

help-default = Ekiriwo edda:
help-active-default = Ekiriwo edda era ekikola:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Emiwendo egikkirizibwa (gumu ku buli kintu):
       *[other] Emiwendo egikkirizibwa:
    }

help-suggested-values = Emiwendo egiwabulwa:

help-inserts = Kiyingiza:

help-coordinates =
    { $count ->
        [one] Akabonero k'ekifo:
       *[other] Obubonero bw'ebifo:
    }

help-type = Ekika:

help-resolved-style = Endabika emanyiddwa (styleNumber { $styleNumber }):

help-resolved-function-names = Amannya g'emirimu agamanyiddwa:
help-reset-list = Olukalala oluzzibwawo ku kuyingiza kuno:
help-added-on-input = Ekyongeddwako ku kuyingiza kuno:
help-removed-on-input = Ekiggiddwawo ku kuyingiza kuno:

help-reset-overrides = { $reset } esinga { $additional } ne { $removed }.
