# Kinyarwanda editor and language-server surfaces. Translated from
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
        [reset] Subiramo
       *[update] Vugurura
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } Igaragaza
       *[other] { $word } Igaragaza { $shortcut }
    }


## The variant picker

editor-variant = Ubwoko
editor-variant-filter = Shungura...
editor-variant-next = Hitamo ubwoko bukurikira
editor-variant-previous = Hitamo ubwoko bwabanje


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] Habonetse kutubahiriza ukugerwaho kwa WCAG AA. Kanda kugira ngo { $action ->
            [close] ufunge
           *[open] ufungure
        } raporo y'ukugerwaho.
        [advisories] Kanda kugira ngo { $action ->
            [close] ufunge
           *[open] ufungure
        } raporo y'ukugerwaho. Nta kutubahiriza kwa WCAG AA kwabonetse, ariko hari izindi nama ku kugerwaho.
       *[clean] Kanda kugira ngo { $action ->
            [close] ufunge
           *[open] ufungure
        } raporo y'ukugerwaho. Nta bibazo by'ukugerwaho byabonetse.
    }

editor-accessibility-label =
    { $status ->
        [violations] Habonetse kutubahiriza ukugerwaho kwa WCAG AA. { $count ->
            [one] Habonetse kutubahiriza kwa WCAG AA { $count }
           *[other] Habonetse kutubahiriza kwa WCAG AA { $count }
        }. Kanda kugira ngo { $action ->
            [close] ufunge
           *[open] ufungure
        } raporo y'ukugerwaho.
        [advisories] Nta kutubahiriza kwa WCAG AA kwabonetse. { $count ->
            [one] Habonetse inama { $count } y'inyongera ku kugerwaho
           *[other] Habonetse inama { $count } z'inyongera ku kugerwaho
        }. Kanda kugira ngo { $action ->
            [close] ufunge
           *[open] ufungure
        } raporo y'ukugerwaho.
       *[clean] Nta kutubahiriza kwa WCAG AA kwabonetse. Kanda kugira ngo { $action ->
            [close] ufunge
           *[open] ufungure
        } raporo y'ukugerwaho.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = Verisiyo ya DoenetML { $version }

editor-tab-help = Ubufasha bujyanye n'aho uri
editor-tab-help-short = Aho uri
editor-tab-errors = Amakosa
editor-tab-warnings = Imiburo
editor-tab-info = Amakuru
editor-tab-accessibility = Ukugerwaho
editor-tab-responses = Ibisubizo byoherejwe

editor-tab-with-count = { $label }: { $count }

editor-options = Amahitamo y'umwanditsi
editor-format-as-doenetml = Tunganya nka DoenetML
editor-format-as-xml = Tunganya nka XML


## The diagnostics panel

editor-diagnostic-line = Umurongo #{ $line }

editor-no-errors = Nta Makosa
editor-no-warnings = Nta Miburo
editor-no-info = Nta Isuzuma ry'Amakuru

editor-show-info-annotations = Erekana isuzuma ry'amakuru mu mwanditsi
editor-show-accessibility-annotations = Erekana isuzuma ry'ukugerwaho mu mwanditsi

editor-accessibility-learn-more = Menya uko Doenet ifata ukugerwaho

editor-accessibility-violations-heading = Kutubahiriza ukugerwaho ({ $standard })

editor-accessibility-other-heading = Ibindi bibazo by'ukugerwaho
editor-none-found = Nta kibonetse


## Submitted responses

editor-no-responses = Nta bisubizo byoherejwe kugeza ubu
editor-response-answer-id = Indangamuntu y'Igisubizo
editor-response-response = Igisubizo
editor-response-credit = Amanota
editor-response-submitted = Cyoherejwe


## The context-help panel

help-placeholder = Shyira agapfundikizo ku izina rya tagi, ku ibiranga cyangwa kuri { $ref } kugira ngo ubone inyandiko.

help-unsupported-ref-chain = Ubufasha ku byerekezo bifite ibice byinshi nka { $example } ntibirasangirwa.

help-unresolved-ref =
    { $reason ->
        [notFound] Nta cyerekezweho cyabonetse kuri: { $ref }.
        [multiple] Habonetse ibyerekezweho byinshi kuri: { $ref }.
       *[indeterminate] Icyerekezweho na { $ref } ntikishoboye kumenyekana.
    }

help-learn-about-references = Menya ibyerekeye ibyerekezo →
help-reference-page = Urupapuro rw'ibyerekezo →

help-suggestions-header =
    { $location ->
        [inside] Muri { $element }
       *[top] Ku rwego rwo hejuru
    }{ $allowed ->
        [none] { " — nta kintu kijya hano." }
        [text] { " — andika inyandiko hano." }
        [text-and-components] { " — andika inyandiko hano, cyangwa ugerageze:" }
       *[components] { " — ibintu wagerageza:" }
    }

help-suggestions-footer = Kanda { $shortcut } kugira ngo ubone ibice byose { $total }.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } ni icyerekezo kuri { $target }.
       *[other] { $ref } ni icyerekezo kuri { $target } (umurongo { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] Cyatangijwe na { $owner } nka { $role }.
       *[other] Cyatangijwe na { $owner } ku murongo { $line } nka { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } ni icyerekezo ku kiranga { $property } cya { $element }.
       *[other] { $ref } ni icyerekezo ku kiranga { $property } cya { $element } (umurongo { $line }).
    }

help-kind-attribute = ikiranga
help-kind-snippet = agace
help-kind-array-entry = icyinjizwa mu rutonde

help-default = Icyisanzwe:
help-active-default = Icyisanzwe gikoreshwa:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Indangagaciro zemewe (imwe kuri buri kintu):
       *[other] Indangagaciro zemewe:
    }

help-suggested-values = Indangagaciro zasabwe:

help-inserts = Yinjiza:

help-coordinates =
    { $count ->
        [one] Igipimo:
       *[other] Ibipimo:
    }

help-type = Ubwoko:

help-resolved-style = Imisusire yamenyekanye (styleNumber { $styleNumber }):

help-resolved-function-names = Amazina ya fonksiyo yamenyekanye:
help-reset-list = Urutonde rusubirwamo kuri iri njizwa:
help-added-on-input = Ibyongewe kuri iri njizwa:
help-removed-on-input = Ibyakuweho kuri iri njizwa:

help-reset-overrides = { $reset } ihindura { $additional } na { $removed }.
