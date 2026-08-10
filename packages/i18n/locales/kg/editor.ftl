# Kongo editor and language-server surfaces. Selected by `uiLocale`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
#
# DoenetML element names, attribute names and `styleNumber` are identifiers of
# the language and stay in English exactly as written.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Vutula
       *[update] Kitula
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } Nsongi
       *[other] { $word } Nsongi { $shortcut }
    }


## The variant picker

editor-variant = Mpila

editor-variant-filter = Sola…

editor-variant-next = Sola mpila yalanda

editor-variant-previous = Sola mpila yavita


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] Mbundamusu ya WCAG AA yamonana. Buta sambu na { $action ->
            [close] kukanga
           *[open] kuzibula
        } nkanda wa nswalu.
        [advisories] Buta sambu na { $action ->
            [close] kukanga
           *[open] kuzibula
        } nkanda wa nswalu. Mbundamusu ya WCAG AA yamonana ve, kansi malongi mankaka ma nswalu mena.
       *[clean] Buta sambu na { $action ->
            [close] kukanga
           *[open] kuzibula
        } nkanda wa nswalu. Diambu dya nswalu dyamonana ve.
    }

editor-accessibility-label =
    { $status ->
        [violations] Mbundamusu ya WCAG AA yamonana. { $count ->
            [one] mbundamusu { $count } ya WCAG AA
           *[other] bimbundamusu { $count } bya WCAG AA
        } byamonana. Buta sambu na { $action ->
            [close] kukanga
           *[open] kuzibula
        } nkanda wa nswalu.
        [advisories] Mbundamusu ya WCAG AA yamonana ve. { $count ->
            [one] dilongi { $count } dyankaka dya nswalu
           *[other] malongi { $count } mankaka ma nswalu
        } mamonana. Buta sambu na { $action ->
            [close] kukanga
           *[open] kuzibula
        } nkanda wa nswalu.
       *[clean] Mbundamusu ya WCAG AA yamonana ve. Buta sambu na { $action ->
            [close] kukanga
           *[open] kuzibula
        } nkanda wa nswalu.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = Mpila ya DoenetML { $version }

editor-tab-help = Lusadisu lwa fulu
editor-tab-help-short = Fulu
editor-tab-errors = Mambi
editor-tab-warnings = Malubuka
editor-tab-info = Nsangu
editor-tab-accessibility = Nswalu
editor-tab-responses = Mivutu mitindwa

editor-tab-with-count = { $label }: { $count }

editor-options = Nsola za nsoniki
editor-format-as-doenetml = Fwanisa bonso DoenetML
editor-format-as-xml = Fwanisa bonso XML


## The diagnostics panel

editor-diagnostic-line = Nsinga #{ $line }

editor-no-errors = Mambi Ve
editor-no-warnings = Malubuka Ve
editor-no-info = Nsangu Ve

editor-show-info-annotations = Songa nsangu mu nsoniki
editor-show-accessibility-annotations = Songa mambu ma nswalu mu nsoniki

editor-accessibility-learn-more = Longuka mutindu Doenet kelandanga nswalu

editor-accessibility-violations-heading = Bimbundamusu bya nswalu ({ $standard })

editor-accessibility-other-heading = Mambu mankaka ma nswalu
editor-none-found = Kima ve


## Submitted responses

editor-no-responses = Mivutu mitindwa ve nate
editor-response-answer-id = Nkumbu ya mvutu
editor-response-response = Mvutu
editor-response-credit = Ntalu
editor-response-submitted = Yitindwa


## The context-help panel

help-placeholder = Tula nsonga va nkumbu ya tag, va attribute, to va { $ref } sambu na malongi.

help-unsupported-ref-chain = Lusadisu mu mambu ma bitini biwombo bonso { $example } luena ntete ve.

help-unresolved-ref =
    { $reason ->
        [notFound] Kima ve kyamonana mu { $ref }.
        [multiple] Bima biwombo byamonana mu { $ref }.
       *[indeterminate] Kima kya { $ref } kalendi zabakana ko.
    }

help-learn-about-references = Longuka mambu ma bantinu →
help-reference-page = Lukaya lwa malongi →

help-suggestions-header =
    { $location ->
        [inside] Na kati kwa { $element }
       *[top] Va zulu kya mukanda
    }{ $allowed ->
        [none] { " — kima kekwenda vava ve." }
        [text] { " — sonika mambu vava." }
        [text-and-components] { " — sonika mambu vava, to meka:" }
       *[components] { " — bima bya kumeka:" }
    }

help-suggestions-footer = Buta { $shortcut } sambu na kumona bima { $total } byonso.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } kele ntinu kwa { $target }.
       *[other] { $ref } kele ntinu kwa { $target } (nsinga { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] Yatulwa kwa { $owner } bonso { $role }.
       *[other] Yatulwa kwa { $owner } va nsinga { $line } bonso { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } kele ntinu kwa kitini { $property } kya { $element }.
       *[other] { $ref } kele ntinu kwa kitini { $property } kya { $element } (nsinga { $line }).
    }

help-kind-attribute = attribute
help-kind-snippet = kitini
help-kind-array-entry = kitini kya array

help-default = Ya kimenga:
help-active-default = Ya kimenga yasalanga:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Ntalu zalombwa (mosi konso kitini):
       *[other] Ntalu zalombwa:
    }

help-suggested-values = Ntalu zalongwa:

help-inserts = Yitulanga:

help-coordinates =
    { $count ->
        [one] Fulu:
       *[other] Bifulu:
    }

help-type = Mpila:

help-resolved-style = Mpila yasolwa (styleNumber { $styleNumber }):

help-resolved-function-names = Nkumbu za fonksio zasolwa:
help-reset-list = Nkanda wa vutula va input yayi:
help-added-on-input = Yayikwa va input yayi:
help-removed-on-input = Yakatulwa va input yayi:

help-reset-overrides = { $reset } yilutanga { $additional } ye { $removed }.
