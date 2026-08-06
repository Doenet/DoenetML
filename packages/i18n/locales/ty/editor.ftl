# Tahitian editor and language-server surfaces. Translated from
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
# Written with the ʻeta and the tārava; see `chrome.ftl`. Tahitian marks no
# number on the noun, so a `{ $count -> … }` whose two English branches differ
# only in the noun renders one string here and the select is dropped.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Faʻahoʻi
       *[update] Faʻaʻāpī
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } i te hiʻoraʻa
       *[other] { $word } i te hiʻoraʻa { $shortcut }
    }


## The variant picker

editor-variant = Huru taʻa ê
editor-variant-filter = Tāmāmā…
editor-variant-next = Māʻiti i te huru taʻa ê i muri
editor-variant-previous = Māʻiti i te huru taʻa ê i mua


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] Ua ʻitehia te tahi ofatiraʻa i te ture ʻāravehi WCAG AA. Pāto no te { $action ->
            [close] ʻōpani
           *[open] ʻiriti
        } i te rapo ʻāravehi.
        [advisories] Pāto no te { $action ->
            [close] ʻōpani
           *[open] ʻiriti
        } i te rapo ʻāravehi. ʻAita e ofatiraʻa WCAG AA i ʻitehia, tērā rā tē vai nei te tahi mau mana ʻo ʻāravehi.
       *[clean] Pāto no te { $action ->
            [close] ʻōpani
           *[open] ʻiriti
        } i te rapo ʻāravehi. ʻAita e fifi ʻāravehi i ʻitehia.
    }

# No select on `$count` inside the branches: «ofatiraʻa» and «manaʻo» are the
# same words for one and for many.
editor-accessibility-label =
    { $status ->
        [violations] Ua ʻitehia te tahi ofatiraʻa i te ture ʻāravehi WCAG AA. E { $count } ofatiraʻa WCAG AA i ʻitehia. Pāto no te { $action ->
            [close] ʻōpani
           *[open] ʻiriti
        } i te rapo ʻāravehi.
        [advisories] ʻAita e ofatiraʻa WCAG AA i ʻitehia. E { $count } manaʻo ʻāravehi hau i ʻitehia. Pāto no te { $action ->
            [close] ʻōpani
           *[open] ʻiriti
        } i te rapo ʻāravehi.
       *[clean] ʻAita e ofatiraʻa WCAG AA i ʻitehia. Pāto no te { $action ->
            [close] ʻōpani
           *[open] ʻiriti
        } i te rapo ʻāravehi.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = Huru DoenetML { $version }

editor-tab-help = Tauturu ia au i te tuhaʻa
editor-tab-help-short = Tuhaʻa
editor-tab-errors = Hape
editor-tab-warnings = Faʻaararaʻa
editor-tab-info = Haʻamāramaramaraʻa
editor-tab-accessibility = ʻĀravehi
editor-tab-responses = Pāhonoraʻa i hōpoihia

editor-tab-with-count = { $label }: { $count }

editor-options = Māʻitiraʻa o te papaʻi
editor-format-as-doenetml = Faʻanaho ei DoenetML
editor-format-as-xml = Faʻanaho ei XML


## The diagnostics panel

editor-diagnostic-line = Reni #{ $line }

editor-no-errors = ʻAita e hape
editor-no-warnings = ʻAita e faʻaararaʻa
editor-no-info = ʻAita e haʻamāramaramaraʻa hiʻopoʻa

editor-show-info-annotations = Faʻaʻite i te haʻamāramaramaraʻa hiʻopoʻa i roto i te papaʻi
editor-show-accessibility-annotations = Faʻaʻite i te hiʻopoʻaraʻa ʻāravehi i roto i te papaʻi

editor-accessibility-learn-more = A haʻapiʻi nāhea Doenet e haʻa nei i te ʻāravehi

editor-accessibility-violations-heading = Ofatiraʻa ʻāravehi ({ $standard })

editor-accessibility-other-heading = Te tahi atu mau fifi ʻāravehi
editor-none-found = ʻAita i ʻitehia


## Submitted responses

editor-no-responses = ʻAita ʻe pāhonoraʻa i hōpoihia
editor-response-answer-id = Id o te pāhonoraʻa
editor-response-response = Pāhonoraʻa
editor-response-credit = Tāpuraʻa
editor-response-submitted = Ua hōpoihia


## The context-help panel

help-placeholder = A tuʻu i te kurusore i niʻa i te iʻoa tag, te ʻatirivite, aore rā te { $ref } no te haʻamāramaramaraʻa.

help-unsupported-ref-chain = ʻAitaʻe te tauturu no te mau faʻahitiraʻa e rave rahi tuhaʻa mai te { $example } i tauturuhia.

help-unresolved-ref =
    { $reason ->
        [notFound] ʻAita i ʻitehia te mea tā te faʻahitiraʻa e faʻataʻa nei: { $ref }.
        [multiple] E rave rahi mea i ʻitehia tā te faʻahitiraʻa e faʻataʻa nei: { $ref }.
       *[indeterminate] ʻAita i nehenehe i haʻapāpū eaha tā te { $ref } e faʻataʻa nei.
    }

help-learn-about-references = A haʻapiʻi nō te mau faʻahitiraʻa →
help-reference-page = ʻĀpī faʻahitiraʻa →

help-suggestions-header =
    { $location ->
        [inside] I roto i te { $element }
       *[top] I te faito teitei roa
    }{ $allowed ->
        [none] { " — ʻaita e mea e nehenehe e tuʻu i ʻōnei." }
        [text] { " — a papaʻi i te parau i ʻōnei." }
        [text-and-components] { " — a papaʻi i te parau i ʻōnei, aore rā a tāmata:" }
       *[components] { " — te mau mea e nehenehe e tāmata:" }
    }

help-suggestions-footer = A pāto i te { $shortcut } no te hiʻo i te { $total } tuhaʻa ato'a.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] E faʻahitiraʻa te { $ref } i te { $target }.
       *[other] E faʻahitiraʻa te { $ref } i te { $target } (reni { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] Ua hōpoihia mai e te { $owner } ei { $role }.
       *[other] Ua hōpoihia mai e te { $owner } i te reni { $line } ei { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] E faʻahitiraʻa te { $ref } i te huru { $property } o te { $element }.
       *[other] E faʻahitiraʻa te { $ref } i te huru { $property } o te { $element } (reni { $line }).
    }

help-kind-attribute = ʻatirivite
help-kind-snippet = tuhaʻa kōto
help-kind-array-entry = ʻōmuaraʻa array

help-default = Faito mātauhia:
help-active-default = Faito mātauhia ʻohipa:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Te mau faito fāriʻihia (hōʻē nō te mea tāʻitahi):
       *[other] Te mau faito fāriʻihia:
    }

help-suggested-values = Te mau faito mana ʻohia:

help-inserts = Tē tuʻu nei:

# No select: «tāpaʻoraʻa» is the same word for one and for many.
help-coordinates = Tāpaʻoraʻa:

help-type = Huru:

help-resolved-style = Huru haʻapāpūhia (styleNumber { $styleNumber }):

help-resolved-function-names = Iʻoa fonotio haʻapāpūhia:
help-reset-list = Tāpura faʻahoʻiraʻa i roto i teie tuʻuraʻa:
help-added-on-input = Ua tuʻuhia i roto i teie tuʻuraʻa:
help-removed-on-input = Ua iritihia i roto i teie tuʻuraʻa:

help-reset-overrides = Nā te { $reset } e mono i te { $additional } ʻe te { $removed }.
