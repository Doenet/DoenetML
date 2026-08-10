# Kituba editor and language-server surfaces: the footer, the diagnostics
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
        [reset] Vutula
       *[update] Kitula ya mpa
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } Kisongi
       *[other] { $word } Kisongi { $shortcut }
    }


## The variant picker

editor-variant = Mutindu

editor-variant-filter = Sola…

editor-variant-next = Sola mutindu ya ke landa

editor-variant-previous = Sola mutindu ya ntete


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] Kulutisa WCAG AA ya kukuma me monana. Fina sambu na { $action ->
            [close] kukanga
           *[open] kukangula
        } rapore ya kukuma.
        [advisories] Fina sambu na { $action ->
            [close] kukanga
           *[open] kukangula
        } rapore ya kukuma. Kulutisa WCAG AA me monana ve, kansi balukebisu ya nkaka ya kukuma kele.
       *[clean] Fina sambu na { $action ->
            [close] kukanga
           *[open] kukangula
        } rapore ya kukuma. Mambu ya kukuma me monana ve.
    }

editor-accessibility-label =
    { $status ->
        [violations] Kulutisa WCAG AA ya kukuma me monana. { $count ->
            [one] Kulutisa WCAG AA { $count } me monana
           *[other] Bakulutisa WCAG AA { $count } me monana
        }. Fina sambu na { $action ->
            [close] kukanga
           *[open] kukangula
        } rapore ya kukuma.
        [advisories] Kulutisa WCAG AA me monana ve. { $count ->
            [one] Lukebisu ya nkaka ya kukuma { $count } me monana
           *[other] Balukebisu ya nkaka ya kukuma { $count } me monana
        }. Fina sambu na { $action ->
            [close] kukanga
           *[open] kukangula
        } rapore ya kukuma.
       *[clean] Kulutisa WCAG AA me monana ve. Fina sambu na { $action ->
            [close] kukanga
           *[open] kukangula
        } rapore ya kukuma.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = Versio ya DoenetML { $version }

editor-tab-help = Lusadisu ya kisika
editor-tab-help-short = Kisika
editor-tab-errors = Bambi
editor-tab-warnings = Balukebisu
editor-tab-info = Bansangu
editor-tab-accessibility = Kukuma
editor-tab-responses = Bamvutu ya me tindama

editor-tab-with-count = { $label }: { $count }

editor-options = Basola ya kisoneki
editor-format-as-doenetml = Yidika bonso DoenetML
editor-format-as-xml = Yidika bonso XML


## The diagnostics panel

editor-diagnostic-line = Linya #{ $line }

editor-no-errors = Bambi Kele Ve
editor-no-warnings = Balukebisu Kele Ve
editor-no-info = Bansangu Kele Ve

editor-show-info-annotations = Songa bansangu na kisoneki
editor-show-accessibility-annotations = Songa balukebisu ya kukuma na kisoneki

editor-accessibility-learn-more = Zaba mutindu Doenet ke tesa kukuma

editor-accessibility-violations-heading = Bakulutisa ya kukuma ({ $standard })

editor-accessibility-other-heading = Mambu ya nkaka ya kukuma
editor-none-found = Ata kima me monana ve


## Submitted responses

editor-no-responses = Bamvutu ya me tindama kele ve ntangu yai
editor-response-answer-id = Kidimbu ya Mvutu
editor-response-response = Mvutu
editor-response-credit = Bapwe
editor-response-submitted = Me tindama


## The context-help panel

help-placeholder = Tula kisonga na zina ya tagi, na kidimbu, to na { $ref } sambu na kumona masonama.

help-unsupported-ref-chain = Lusadisu na bisonga ya bitini mingi bonso { $example } me yantika ntete ve.

help-unresolved-ref =
    { $reason ->
        [notFound] Ata kima me monana ve na kisonga yai: { $ref }.
        [multiple] Bima mingi me monana na kisonga yai: { $ref }.
       *[indeterminate] Kima yina { $ref } ke songa me zabana ve.
    }

help-learn-about-references = Zaba mambu ya bisonga →
help-reference-page = Lutiti ya bisonga →

help-suggestions-header =
    { $location ->
        [inside] Na kati ya { $element }
       *[top] Na zulu kibeni
    }{ $allowed ->
        [none] { " — ata kima lenda kwisa awa ve." }
        [text] { " — sonika bangogo awa." }
        [text-and-components] { " — sonika bangogo awa, to meka:" }
       *[components] { " — bitini yina nge lenda meka:" }
    }

help-suggestions-footer = Fina { $shortcut } sambu na kutala bitini yonso { $total }.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } ke songa { $target }.
       *[other] { $ref } ke songa { $target } (linya { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] Yo me katuka na { $owner } bonso { $role }.
       *[other] Yo me katuka na { $owner } na linya { $line } bonso { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } ke songa kidimbu { $property } ya { $element }.
       *[other] { $ref } ke songa kidimbu { $property } ya { $element } (linya { $line }).
    }

help-kind-attribute = kidimbu
help-kind-snippet = kitini fioti
help-kind-array-entry = kukotisa na molongo

help-default = Ya ntangu yonso:
help-active-default = Ya ntangu yonso yina ke sala:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Batalu ya me ndimama (na konso kima):
       *[other] Batalu ya me ndimama:
    }

help-suggested-values = Batalu ya me pesama:

help-inserts = Yo ke kotisa:

help-coordinates =
    { $count ->
        [one] Kisonga ya kisika:
       *[other] Bisonga ya bisika:
    }

help-type = Mutindu:

help-resolved-style = Mutindu ya me monana (styleNumber { $styleNumber }):

help-resolved-function-names = Bazina ya fonksio ya me monana:
help-reset-list = Molongo ya me vutuka na kukotisa yai:
help-added-on-input = Bima ya me yikama na kukotisa yai:
help-removed-on-input = Bima ya me katuka na kukotisa yai:

help-reset-overrides = { $reset } ke luta { $additional } ti { $removed }.
