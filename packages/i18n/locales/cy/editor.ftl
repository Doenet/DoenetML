# Welsh editor and language-server surfaces. Translated from
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
# Welsh counts in six plural categories. The noun stays singular after a
# numeral and it is the mutation that moves, so `tramgwydd` is written out in
# all six below. `argymhelliad` begins with a vowel and cannot mutate, so all
# six branches would read alike and it takes no select at all.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Ailosod
       *[update] Diweddaru
    }

# «y gwyliwr» rather than «'r gwyliwr»: which of the two the article takes
# depends on whether the word before it ends in a vowel, and that word is
# `$word` — the button's own label, which this message never sees.
editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } y gwyliwr
       *[other] { $word } y gwyliwr { $shortcut }
    }


## The variant picker

editor-variant = Amrywiad
editor-variant-filter = Hidlo…
editor-variant-next = Dewis yr amrywiad nesaf
editor-variant-previous = Dewis yr amrywiad blaenorol


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] Nodwyd tramgwydd hygyrchedd WCAG AA. Cliciwch i { $action ->
            [close] gau
           *[open] agor
        } yr adroddiad hygyrchedd.
        [advisories] Cliciwch i { $action ->
            [close] gau
           *[open] agor
        } yr adroddiad hygyrchedd. Ni chanfuwyd unrhyw dramgwydd WCAG AA, ond mae argymhellion hygyrchedd ychwanegol ar gael.
       *[clean] Cliciwch i { $action ->
            [close] gau
           *[open] agor
        } yr adroddiad hygyrchedd. Ni chanfuwyd unrhyw broblem hygyrchedd.
    }

editor-accessibility-label =
    { $status ->
        [violations] Nodwyd tramgwydd hygyrchedd WCAG AA. Canfuwyd { $count ->
            [zero] { $count } tramgwydd WCAG AA
            [one] { $count } tramgwydd WCAG AA
            [two] { $count } dramgwydd WCAG AA
            [few] { $count } thramgwydd WCAG AA
            [many] { $count } thramgwydd WCAG AA
           *[other] { $count } tramgwydd WCAG AA
        }. Cliciwch i { $action ->
            [close] gau
           *[open] agor
        } yr adroddiad hygyrchedd.
        [advisories] Ni chanfuwyd unrhyw dramgwydd WCAG AA. Canfuwyd { $count } argymhelliad hygyrchedd ychwanegol. Cliciwch i { $action ->
            [close] gau
           *[open] agor
        } yr adroddiad hygyrchedd.
       *[clean] Ni chanfuwyd unrhyw dramgwydd WCAG AA. Cliciwch i { $action ->
            [close] gau
           *[open] agor
        } yr adroddiad hygyrchedd.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = Fersiwn DoenetML { $version }

editor-tab-help = Cymorth yn ôl y cyd-destun
editor-tab-help-short = Cyd-destun
editor-tab-errors = Gwallau
editor-tab-warnings = Rhybuddion
editor-tab-info = Gwybodaeth
editor-tab-accessibility = Hygyrchedd
editor-tab-responses = Ymatebion a gyflwynwyd

editor-tab-with-count = { $label }: { $count }

editor-options = Dewisiadau'r golygydd
editor-format-as-doenetml = Fformatio fel DoenetML
editor-format-as-xml = Fformatio fel XML


## The diagnostics panel

editor-diagnostic-line = Llinell #{ $line }

editor-no-errors = Dim gwallau
editor-no-warnings = Dim rhybuddion
editor-no-info = Dim diagnosteg wybodaeth

editor-show-info-annotations = Dangos diagnosteg wybodaeth yn y golygydd
editor-show-accessibility-annotations = Dangos diagnosteg hygyrchedd yn y golygydd

editor-accessibility-learn-more = Dysgwch sut mae Doenet yn ymdrin â hygyrchedd

editor-accessibility-violations-heading = Tramgwyddau hygyrchedd ({ $standard })

editor-accessibility-other-heading = Problemau hygyrchedd eraill
editor-none-found = Ni chanfuwyd yr un


## Submitted responses

editor-no-responses = Ni chyflwynwyd unrhyw ymateb eto
editor-response-answer-id = Dynodydd yr ateb
editor-response-response = Ymateb
editor-response-credit = Marciau
editor-response-submitted = Cyflwynwyd


## The context-help panel

help-placeholder = Rhowch y cyrchwr ar enw tag, ar briodoledd neu ar { $ref } i weld y ddogfennaeth.

help-unsupported-ref-chain = Nid oes cymorth eto ar gyfer cyfeiriadau aml-ran fel { $example }.

help-unresolved-ref =
    { $reason ->
        [notFound] Ni chanfuwyd cyfeiriedig ar gyfer y cyfeiriad: { $ref }.
        [multiple] Canfuwyd sawl cyfeiriedig ar gyfer y cyfeiriad: { $ref }.
       *[indeterminate] Nid oedd modd pennu cyfeiriedig ar gyfer { $ref }.
    }

help-learn-about-references = Dysgwch am gyfeiriadau →
help-reference-page = Tudalen gyfeirio →

help-suggestions-header =
    { $location ->
        [inside] Y tu mewn i { $element }
       *[top] Ar y lefel uchaf
    }{ $allowed ->
        [none] { " — nid oes dim yn mynd yma." }
        [text] { " — teipiwch destun yma." }
        [text-and-components] { " — teipiwch destun yma, neu rhowch gynnig ar:" }
       *[components] { " — pethau i roi cynnig arnynt:" }
    }

help-suggestions-footer = Pwyswch { $shortcut } i weld y { $total } cydran i gyd.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] Mae { $ref } yn gyfeiriad at { $target }.
       *[other] Mae { $ref } yn gyfeiriad at { $target } (llinell { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] Cyflwynwyd gan { $owner } fel { $role }.
       *[other] Cyflwynwyd gan { $owner } ar linell { $line } fel { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] Mae { $ref } yn gyfeiriad at briodwedd { $property } { $element }.
       *[other] Mae { $ref } yn gyfeiriad at briodwedd { $property } { $element } (llinell { $line }).
    }

help-kind-attribute = priodoledd
help-kind-snippet = pwt
help-kind-array-entry = cofnod arae

help-default = Rhagosodiad:
help-active-default = Rhagosodiad gweithredol:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Gwerthoedd a ganiateir (un fesul eitem):
       *[other] Gwerthoedd a ganiateir:
    }

help-suggested-values = Gwerthoedd a awgrymir:

help-inserts = Yn mewnosod:

help-coordinates =
    { $count ->
        [one] Cyfesuryn:
       *[other] Cyfesurynnau:
    }

help-type = Math:

help-resolved-style = Arddull a ddatryswyd (styleNumber { $styleNumber }):

help-resolved-function-names = Enwau ffwythiannau a ddatryswyd:
help-reset-list = Ailosod y rhestr ar y mewnbwn hwn:
help-added-on-input = Wedi'i ychwanegu ar y mewnbwn hwn:
help-removed-on-input = Wedi'i dynnu ar y mewnbwn hwn:

help-reset-overrides = Mae { $reset } yn diystyru'r canlynol: { $additional }, { $removed }.
