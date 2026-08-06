# Tok Pisin editor and language-server surfaces. Translated from
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
# Tok Pisin marks no number on the noun, so a `{ $count -> … }` whose two
# English branches differ only in the noun renders one string here and the
# select is dropped.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Setim gen
       *[update] Apdetim
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } luk
       *[other] { $word } luk { $shortcut }
    }


## The variant picker

editor-variant = Kain
editor-variant-filter = Rausim sampela…
editor-variant-next = Makim neks kain
editor-variant-previous = Makim kain bipo


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] Ol i painim wanpela brukim lo bilong akses WCAG AA. Klikim bilong { $action ->
            [close] pasim
           *[open] opim
        } ripot bilong akses.
        [advisories] Klikim bilong { $action ->
            [close] pasim
           *[open] opim
        } ripot bilong akses. I no gat brukim lo WCAG AA ol i painim, tasol i gat sampela moa tok helpim long akses.
       *[clean] Klikim bilong { $action ->
            [close] pasim
           *[open] opim
        } ripot bilong akses. I no gat hevi bilong akses ol i painim.
    }

# No select on `$count` inside the branches: «brukim lo» and «tok helpim» are
# the same words for one and for many.
editor-accessibility-label =
    { $status ->
        [violations] Ol i painim wanpela brukim lo bilong akses WCAG AA. Ol i painim { $count } brukim lo WCAG AA. Klikim bilong { $action ->
            [close] pasim
           *[open] opim
        } ripot bilong akses.
        [advisories] I no gat brukim lo WCAG AA ol i painim. Ol i painim { $count } moa tok helpim long akses. Klikim bilong { $action ->
            [close] pasim
           *[open] opim
        } ripot bilong akses.
       *[clean] I no gat brukim lo WCAG AA ol i painim. Klikim bilong { $action ->
            [close] pasim
           *[open] opim
        } ripot bilong akses.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = Vesen DoenetML { $version }

editor-tab-help = Helpim i bihainim ples bilong kursa
editor-tab-help-short = Ples
editor-tab-errors = Asua
editor-tab-warnings = Tok lukaut
editor-tab-info = Tok save
editor-tab-accessibility = Akses
editor-tab-responses = Ol bekim ol i salim

editor-tab-with-count = { $label }: { $count }

editor-options = Ol samting bilong editor
editor-format-as-doenetml = Fomatim olsem DoenetML
editor-format-as-xml = Fomatim olsem XML


## The diagnostics panel

editor-diagnostic-line = Lain #{ $line }

editor-no-errors = I no gat asua
editor-no-warnings = I no gat tok lukaut
editor-no-info = I no gat tok save bilong skelim

editor-show-info-annotations = Soim ol tok save bilong skelim insait long editor
editor-show-accessibility-annotations = Soim ol skelim bilong akses insait long editor

editor-accessibility-learn-more = Lainim rot Doenet i bihainim long akses

editor-accessibility-violations-heading = Ol brukim lo bilong akses ({ $standard })

editor-accessibility-other-heading = Ol arapela hevi bilong akses
editor-none-found = I no gat wanpela ol i painim


## Submitted responses

editor-no-responses = I no gat bekim ol i salim yet
editor-response-answer-id = Id bilong bekim
editor-response-response = Bekim
editor-response-credit = Mak
editor-response-submitted = Ol i salim


## The context-help panel

help-placeholder = Putim kursa long nem bilong tag, long atribiut, o long { $ref } bilong kisim tok save.

help-unsupported-ref-chain = Helpim bilong ol refrens i gat planti hap olsem { $example } i no wok yet.

help-unresolved-ref =
    { $reason ->
        [notFound] I no gat samting ol i painim we refrens i makim: { $ref }.
        [multiple] Planti samting ol i painim we refrens i makim: { $ref }.
       *[indeterminate] Ol i no inap save wanem samting { $ref } i makim.
    }

help-learn-about-references = Lainim long ol refrens →
help-reference-page = Pes bilong refrens →

help-suggestions-header =
    { $location ->
        [inside] Insait long { $element }
       *[top] Long antap tru
    }{ $allowed ->
        [none] { " — i no gat samting yu ken putim hia." }
        [text] { " — raitim tok hia." }
        [text-and-components] { " — raitim tok hia, o traim:" }
       *[components] { " — ol samting bilong traim:" }
    }

help-suggestions-footer = Paitim { $shortcut } bilong lukim olgeta { $total } hap.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } em wanpela refrens i go long { $target }.
       *[other] { $ref } em wanpela refrens i go long { $target } (lain { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] { $owner } i bringim olsem { $role }.
       *[other] { $owner } i bringim long lain { $line } olsem { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } em wanpela refrens i go long propati { $property } bilong { $element }.
       *[other] { $ref } em wanpela refrens i go long propati { $property } bilong { $element } (lain { $line }).
    }

help-kind-attribute = atribiut
help-kind-snippet = liklik kod
help-kind-array-entry = entri bilong array

help-default = Nomol:
help-active-default = Nomol i wok nau:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Ol valiu i orait (wanpela long wanwan samting):
       *[other] Ol valiu i orait:
    }

help-suggested-values = Ol valiu ol i tok yu ken traim:

help-inserts = I putim insait:

# No select: «koodinet» is the same word for one and for many.
help-coordinates = Koodinet:

help-type = Kain:

help-resolved-style = Stail ol i painim pinis (styleNumber { $styleNumber }):

help-resolved-function-names = Ol nem pankisen ol i painim pinis:
help-reset-list = Lista bilong setim gen long dispela input:
help-added-on-input = Ol i putim long dispela input:
help-removed-on-input = Ol i rausim long dispela input:

help-reset-overrides = { $reset } i winim { $additional } na { $removed }.
