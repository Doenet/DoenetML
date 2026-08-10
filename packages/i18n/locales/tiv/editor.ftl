# Tiv editor and language-server surfaces: the footer, the diagnostics panel,
# the variant picker, the accessibility button, and the context-help panel
# beside them. Selected by `uiLocale`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
#
# `WCAG`, `WCAG AA`, `DoenetML`, `XML` and `styleNumber` are names rather than
# words and stay as they stand.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Hide a mi
       *[update] Sôr
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } Ortesen
       *[other] { $word } Ortesen { $shortcut }
    }


## The variant picker

editor-variant = Ieren

editor-variant-filter = Tsua…

editor-variant-next = Tsua ieren i i dondon

editor-variant-previous = Tsua ieren i i karen


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] I zua a mkar u WCAG AA u mzough. Nyanger u { $action ->
            [close] kuran
           *[open] bughun
        } rapoo u mzough.
        [advisories] Nyanger u { $action ->
            [close] kuran
           *[open] bughun
        } rapoo u mzough. I zua a mkar u WCAG AA ga, kpa mtaver agen ma mzough nga.
       *[clean] Nyanger u { $action ->
            [close] kuran
           *[open] bughun
        } rapoo u mzough. I zua a azayol a mzough ga.
    }

editor-accessibility-label =
    { $status ->
        [violations] I zua a mkar u WCAG AA u mzough. { $count ->
            [one] I zua a mkar u WCAG AA { $count }
           *[other] I zua a mkar u WCAG AA { $count }
        }. Nyanger u { $action ->
            [close] kuran
           *[open] bughun
        } rapoo u mzough.
        [advisories] I zua a mkar u WCAG AA ga. { $count ->
            [one] I zua a mtaver ugen u mzough { $count }
           *[other] I zua a mtaver agen a mzough { $count }
        }. Nyanger u { $action ->
            [close] kuran
           *[open] bughun
        } rapoo u mzough.
       *[clean] I zua a mkar u WCAG AA ga. Nyanger u { $action ->
            [close] kuran
           *[open] bughun
        } rapoo u mzough.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML ieren { $version }

editor-tab-help = Mwasen u ijiir
editor-tab-help-short = Ijiir
editor-tab-errors = Mtev
editor-tab-warnings = Mtaver
editor-tab-info = Kwaghôron
editor-tab-accessibility = Mzough
editor-tab-responses = Amlumun a i tindi

editor-tab-with-count = { $label }: { $count }

editor-options = Mtsuan u orngeren
editor-format-as-doenetml = Wa er DoenetML nahan
editor-format-as-xml = Wa er XML nahan


## The diagnostics panel

editor-diagnostic-line = Layin #{ $line }

editor-no-errors = Mtev Ngu Ga
editor-no-warnings = Mtaver Ngu Ga
editor-no-info = Kwaghôron Ngu Ga

editor-show-info-annotations = Tese kwaghôron ken orngeren
editor-show-accessibility-annotations = Tese mtaver u mzough ken orngeren

editor-accessibility-learn-more = Fa er Doenet i kar mzough yô

editor-accessibility-violations-heading = Mkar u mzough ({ $standard })

editor-accessibility-other-heading = Azayol agen a mzough
editor-none-found = I zua a ma kwagh ga


## Submitted responses

editor-no-responses = Amlumun a i tindi nga hegen ga
editor-response-answer-id = Iti i mlumun
editor-response-response = Mlumun
editor-response-credit = Upoyint
editor-response-submitted = I tindi


## The context-help panel

help-placeholder = Wa kôsô sha iti i tagi, sha ikyav, shin sha { $ref } u zuan a mngeren.

help-unsupported-ref-chain = Mwasen sha mtesen u akyar kpishi er { $example } nahan hii ga.

help-unresolved-ref =
    { $reason ->
        [notFound] I zua a ma kwagh sha mtesen ne ga: { $ref }.
        [multiple] I zua a akaa kpishi sha mtesen ne: { $ref }.
       *[indeterminate] Kwagh u { $ref } a tese la i fa u ga.
    }

help-learn-about-references = Fa kwagh u mbamtesen →
help-reference-page = Peji u mbamtesen →

help-suggestions-header =
    { $location ->
        [inside] Ken { $element }
       *[top] Sha tswen
    }{ $allowed ->
        [none] { " — ma kwagh a fatyô u van heen ga." }
        [text] { " — nger akaa heen." }
        [text-and-components] { " — nger akaa heen, shin tsa:" }
       *[components] { " — akyar a u fatyô u tsan:" }
    }

help-suggestions-footer = Nyanger { $shortcut } u nengen akyar cii { $total }.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } tese { $target }.
       *[other] { $ref } tese { $target } (layin { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] I due hen { $owner } er { $role } nahan.
       *[other] I due hen { $owner } sha layin { $line } er { $role } nahan.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } tese ikyav { $property } i { $element }.
       *[other] { $ref } tese ikyav { $property } i { $element } (layin { $line }).
    }

help-kind-attribute = ikyav
help-kind-snippet = ikyar i kiryan
help-kind-array-entry = mnyor ken mkuraiyol

help-default = U u lu tsee:
help-active-default = U u lu tsee shi eren tom:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Aeren a i lumun a mi (sha hanma kwagh):
       *[other] Aeren a i lumun a mi:
    }

help-suggested-values = Aeren a i tese:

help-inserts = Ka i nyôr:

help-coordinates =
    { $count ->
        [one] Ortesen u ijiir:
       *[other] Mbatesen u ajiir:
    }

help-type = Ieren:

help-resolved-style = Ieren i i zua a mi (styleNumber { $styleNumber }):

help-resolved-function-names = Ati a fungshon a i zua a mi:
help-reset-list = Mkuraiyol u i hide a mi sha mnyor ne:
help-added-on-input = Akaa a i seer sha mnyor ne:
help-removed-on-input = Akaa a i dugh sha mnyor ne:

help-reset-overrides = { $reset } hemba { $additional } man { $removed }.
