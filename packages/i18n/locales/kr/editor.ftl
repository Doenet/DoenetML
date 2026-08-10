# Kanuri editor and language-server surfaces: the footer, the diagnostics
# panel, the variant picker, the accessibility button, and the context-help
# panel beside them. Selected by `uiLocale`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
#
# `WCAG`, `WCAG AA`, `DoenetML`, `XML` and `styleNumber` are names rather than
# words and stay as they stand.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Gǝrǝge
       *[update] Zawuge
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } Cirǝgema
       *[other] { $word } Cirǝgema { $shortcut }
    }


## The variant picker

editor-variant = Suratu

editor-variant-filter = Sanage…

editor-variant-next = Suratu waubega sanage

editor-variant-previous = Suratu ngǝwubega sanage


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] WCAG AA jǝmbe karsa rukcǝna. Kilage jǝmbe raporga { $action ->
            [close] tǝwuge
           *[open] kǝntǝge
        }.
        [advisories] Kilage jǝmbe raporga { $action ->
            [close] tǝwuge
           *[open] kǝntǝge
        }. WCAG AA karsa rukcǝni, amma nyirtuwa gade barwa.
       *[clean] Kilage jǝmbe raporga { $action ->
            [close] tǝwuge
           *[open] kǝntǝge
        }. Jǝmbe mashakal rukcǝni.
    }

editor-accessibility-label =
    { $status ->
        [violations] WCAG AA jǝmbe karsa rukcǝna. { $count ->
            [one] WCAG AA karsa { $count } rukcǝna
           *[other] WCAG AA karsawa { $count } rukcǝna
        }. Kilage jǝmbe raporga { $action ->
            [close] tǝwuge
           *[open] kǝntǝge
        }.
        [advisories] WCAG AA karsa rukcǝni. { $count ->
            [one] Jǝmbe nyirtu gade { $count } rukcǝna
           *[other] Jǝmbe nyirtuwa gade { $count } rukcǝna
        }. Kilage jǝmbe raporga { $action ->
            [close] tǝwuge
           *[open] kǝntǝge
        }.
       *[clean] WCAG AA karsa rukcǝni. Kilage jǝmbe raporga { $action ->
            [close] tǝwuge
           *[open] kǝntǝge
        }.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML suratu { $version }

editor-tab-help = Kǝlabe gǝlawu
editor-tab-help-short = Kǝla
editor-tab-errors = Karsawa
editor-tab-warnings = Nyirtuwa
editor-tab-info = Kalam
editor-tab-accessibility = Jǝm
editor-tab-responses = Jawabwa sadinzǝna

editor-tab-with-count = { $label }: { $count }

editor-options = Ruwuma-be sanawu
editor-format-as-doenetml = DoenetML-ga tǝrtiwuge
editor-format-as-xml = XML-ga tǝrtiwuge


## The diagnostics panel

editor-diagnostic-line = Layin #{ $line }

editor-no-errors = Karsa Bago
editor-no-warnings = Nyirtu Bago
editor-no-info = Kalam Bago

editor-show-info-annotations = Kalamga ruwuma-ben cirǝge
editor-show-accessibility-annotations = Jǝmbe nyirtuwaga ruwuma-ben cirǝge

editor-accessibility-learn-more = Doenet jǝmga ndaran kǝlkǝlin sǝnge

editor-accessibility-violations-heading = Jǝmbe karsawa ({ $standard })

editor-accessibility-other-heading = Jǝmbe mashakalwa gade
editor-none-found = Ndu rukcǝni


## Submitted responses

editor-no-responses = Jawab sadinzǝna bago kǝnowu
editor-response-answer-id = Jawab-be cin
editor-response-response = Jawab
editor-response-credit = Poyintwa
editor-response-submitted = Sadinzǝna


## The context-help panel

help-placeholder = Kursoga tagi-be cin-ro, alama-ro, ya { $ref }-ro cinge ruwuwaga rukge.

help-unsupported-ref-chain = Fartuwa kuraben cirǝwu-be gǝlawu { $example } kǝntǝ jibǝni.

help-unresolved-ref =
    { $reason ->
        [notFound] Cirǝwu adǝ-ro ndu rukcǝni: { $ref }.
        [multiple] Cirǝwu adǝ-ro nduwa kura rukcǝna: { $ref }.
       *[indeterminate] { $ref } ndaga cirǝgin sǝnǝni.
    }

help-learn-about-references = Cirǝwuwa-be sǝnge →
help-reference-page = Cirǝwuwa-be bela →

help-suggestions-header =
    { $location ->
        [inside] { $element }-ben
       *[top] Kǝlan
    }{ $allowed ->
        [none] { " — ndu isǝlan bago." }
        [text] { " — kalamwaga isǝlan ruwuge." }
        [text-and-components] { " — kalamwaga isǝlan ruwuge, ya kalakce:" }
       *[components] { " — fartuwa kalakcinzǝ:" }
    }

help-suggestions-footer = { $shortcut } kilage fartuwa kambe { $total } rukge.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } { $target }-ga cirǝgin.
       *[other] { $ref } { $target }-ga cirǝgin (layin { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] { $owner }-lan isǝna { $role }-ga.
       *[other] { $owner }-lan layin { $line }-n isǝna { $role }-ga.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } { $element }-be alama { $property }-ga cirǝgin.
       *[other] { $ref } { $element }-be alama { $property }-ga cirǝgin (layin { $line }).
    }

help-kind-attribute = alama
help-kind-snippet = fartu dibi
help-kind-array-entry = tǝrtiwuben lawu

help-default = Kǝnowube:
help-active-default = Kǝnowube jiliwunzǝ:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Kǝlkǝlwa lawanzǝna (ndu kambe-ro):
       *[other] Kǝlkǝlwa lawanzǝna:
    }

help-suggested-values = Kǝlkǝlwa cirǝgǝna:

help-inserts = Lawugin:

help-coordinates =
    { $count ->
        [one] Kǝla cirǝgema:
       *[other] Kǝlawa cirǝgemawa:
    }

help-type = Suratu:

help-resolved-style = Suratu rukcǝna (styleNumber { $styleNumber }):

help-resolved-function-names = Fankshan cinwa rukcǝna:
help-reset-list = Lawu adǝ-ro tǝrtiwu gǝrǝcǝna:
help-added-on-input = Lawu adǝ-ro zawucǝna:
help-removed-on-input = Lawu adǝ-ro burcǝna:

help-reset-overrides = { $reset } { $additional } be { $removed }-ga kurabe.
