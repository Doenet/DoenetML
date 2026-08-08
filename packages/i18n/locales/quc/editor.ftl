# Kʼicheʼ editor and language-server surfaces. Translated from
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
# Written in the ALMG orthography; see `chrome.ftl`'s header.
#
# This is the file where the possessive-prefix constraint bites most often, because
# these sentences are full of "the X of Y" where Y is a placeable. Every one of
# them is written with «rech» — "of", a free relational word — rather than with
# «u-»/«r-», whose shape the value's first sound would decide.
#
# Inanimate nouns take no plural, so a `{ $count -> … }` whose only English
# difference is the noun's number renders one string here and the select is
# dropped. A comment marks each site.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Chatzalijisaj
       *[update] Chakʼexa
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } ri ilonel
       *[other] { $word } ri ilonel { $shortcut }
    }


## The variant picker

editor-variant = Jun chik ubʼanik
editor-variant-filter = Chachaʼa…
editor-variant-next = Chachaʼa ri kʼisbʼal ubʼanik
editor-variant-previous = Chachaʼa ri nabʼe ubʼanik


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] Xriqitaj jun WCAG AA sachbʼal rech okibʼal. Chapitzʼa rech { $action ->
            [close] katzʼapix
           *[open] kajaqik
        } ri wuj rech okibʼal.
        [advisories] Chapitzʼa rech { $action ->
            [close] katzʼapix
           *[open] kajaqik
        } ri wuj rech okibʼal. Maj WCAG AA sachbʼal xriqitaj, are kʼu kʼo chi nikʼaj pixabʼ rech okibʼal.
       *[clean] Chapitzʼa rech { $action ->
            [close] katzʼapix
           *[open] kajaqik
        } ri wuj rech okibʼal. Maj kʼaxkʼolil rech okibʼal xriqitaj.
    }

# No select on `$count`: «sachbʼal» and «pixabʼ» are inanimate and take no plural,
# so both categories would render the same string.
editor-accessibility-label =
    { $status ->
        [violations] Xriqitaj jun WCAG AA sachbʼal rech okibʼal. Xriqitaj { $count } WCAG AA sachbʼal. Chapitzʼa rech { $action ->
            [close] katzʼapix
           *[open] kajaqik
        } ri wuj rech okibʼal.
        [advisories] Maj WCAG AA sachbʼal xriqitaj. Xriqitaj { $count } chi pixabʼ rech okibʼal. Chapitzʼa rech { $action ->
            [close] katzʼapix
           *[open] kajaqik
        } ri wuj rech okibʼal.
       *[clean] Maj WCAG AA sachbʼal xriqitaj. Chapitzʼa rech { $action ->
            [close] katzʼapix
           *[open] kajaqik
        } ri wuj rech okibʼal.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML ubʼanik { $version }

editor-tab-help = Tobʼanik rech ri kʼolibʼal
editor-tab-help-short = Kʼolibʼal
editor-tab-errors = Sachbʼal
editor-tab-warnings = Pixabʼ
editor-tab-info = Etamabʼal
editor-tab-accessibility = Okibʼal
editor-tab-responses = Tzalijisabʼal taqom

editor-tab-with-count = { $label }: { $count }

editor-options = Uchaʼoj ri tzʼibʼanel
editor-format-as-doenetml = Chabʼana DoenetML
editor-format-as-xml = Chabʼana XML


## The diagnostics panel

editor-diagnostic-line = Juchʼ #{ $line }

editor-no-errors = Maj sachbʼal
editor-no-warnings = Maj pixabʼ
editor-no-info = Maj etamabʼal kʼutunik

editor-show-info-annotations = Chakʼutu ri etamabʼal kʼutunik pa ri tzʼibʼanel
editor-show-accessibility-annotations = Chakʼutu ri okibʼal kʼutunik pa ri tzʼibʼanel

editor-accessibility-learn-more = Chawetamaj jas kubʼan Doenet rukʼ ri okibʼal

editor-accessibility-violations-heading = Sachbʼal rech okibʼal ({ $standard })

editor-accessibility-other-heading = Nikʼaj chi kʼaxkʼolil rech okibʼal
editor-none-found = Maj xriqitaj


## Submitted responses

editor-no-responses = Majaʼ kʼo tzalijisabʼal taqom
editor-response-answer-id = Ubʼiʼ ri tzalijisabʼal
editor-response-response = Tzalijisabʼal
editor-response-credit = Rajil
editor-response-submitted = Taqom


## The context-help panel

help-placeholder = Chaya ri tzʼubʼ pa ubʼiʼ jun tag, pa jun retal, o pa { $ref } rech kariq ri wuj.

help-unsupported-ref-chain = Ri tobʼanik rech kʼi tanaj kʼamalbʼe jetaq { $example } majaʼ kʼo.

help-unresolved-ref =
    { $reason ->
        [notFound] Maj xriqitaj rech wa kʼamalbʼe: { $ref }.
        [multiple] Kʼi xeriqitaj rech wa kʼamalbʼe: { $ref }.
       *[indeterminate] Man xkowin taj kariqitaj jachike kukʼam { $ref }.
    }

help-learn-about-references = Chawetamaj chirij ri kʼamalbʼe →
help-reference-page = Wuj rech kʼamalbʼe →

help-suggestions-header =
    { $location ->
        [inside] Chupam { $element }
       *[top] Pa ri nimalaj kʼolibʼal
    }{ $allowed ->
        [none] { " — maj kok waral." }
        [text] { " — chatzʼibʼaj tzʼibʼ waral." }
        [text-and-components] { " — chatzʼibʼaj tzʼibʼ waral, o chatijoj:" }
       *[components] { " — jastaq kʼo chatijoj:" }
    }

help-suggestions-footer = Chapitzʼa { $shortcut } rech kawil ronojel ri { $total } wokaj.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } are jun kʼamalbʼe rech { $target }.
       *[other] { $ref } are jun kʼamalbʼe rech { $target } (juchʼ { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] { $owner } xuya jetaq { $role }.
       *[other] { $owner } xuya pa ri juchʼ { $line } jetaq { $role }.
    }

# «rech» twice rather than a possessive prefix on either value, for the reason in
# this file's header.
help-property-is-reference =
    { $line ->
        [none] { $ref } are jun kʼamalbʼe rech ri { $property } rech { $element }.
       *[other] { $ref } are jun kʼamalbʼe rech ri { $property } rech { $element } (juchʼ { $line }).
    }

help-kind-attribute = retal
help-kind-snippet = tanaj tzʼibʼ
help-kind-array-entry = okibʼal pa cholajil

help-default = Ri kʼo nabʼe:
help-active-default = Ri kʼo nabʼe kamik:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Rajil yaʼom (jun che jujunal):
       *[other] Rajil yaʼom:
    }

help-suggested-values = Rajil pixabʼam:

help-inserts = Kukoj:

# No select: «kʼolibʼal ajilanik» is inanimate and takes no plural, so both
# categories would render the same string.
help-coordinates = Kʼolibʼal ajilanik:

help-type = Ubʼanik:

help-resolved-style = Ubʼanik riqom (styleNumber { $styleNumber }):

help-resolved-function-names = Ubʼiʼ funsyon riqom:
help-reset-list = Cholajil tzalijisanik pa wa okibʼal:
help-added-on-input = Kojom pa wa okibʼal:
help-removed-on-input = Esam pa wa okibʼal:

help-reset-overrides = { $reset } kukʼex { $additional } xuqujeʼ { $removed }.
