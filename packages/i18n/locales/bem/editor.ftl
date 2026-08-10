# Bemba editor and language-server surfaces: the footer, the diagnostics panel,
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
        [reset] Bwekeshapo
       *[update] Lundulula
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } Kalanga
       *[other] { $word } Kalanga { $shortcut }
    }


## The variant picker

editor-variant = Umusango

editor-variant-filter = Sefya…

editor-variant-next = Sala umusango uukonkapo

editor-variant-previous = Sala umusango uwapitapo


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] Kwasangwa ukupula kwa WCAG AA kwa kufikako. Tinya ukuti { $action ->
            [close] wisale
           *[open] wisule
        } lipoti ya kufikako.
        [advisories] Tinya ukuti { $action ->
            [close] wisale
           *[open] wisule
        } lipoti ya kufikako. Takwasangilwe ukupula kwa WCAG AA, lelo kwaliba amafunde yambi ya kufikako.
       *[clean] Tinya ukuti { $action ->
            [close] wisale
           *[open] wisule
        } lipoti ya kufikako. Takwasangilwe amafya ya kufikako.
    }

editor-accessibility-label =
    { $status ->
        [violations] Kwasangwa ukupula kwa WCAG AA kwa kufikako. Kwasangwa { $count ->
            [one] ukupula kwa WCAG AA { $count }
           *[other] ukupula kwa WCAG AA { $count }
        }. Tinya ukuti { $action ->
            [close] wisale
           *[open] wisule
        } lipoti ya kufikako.
        [advisories] Takwasangilwe ukupula kwa WCAG AA. Kwasangwa { $count ->
            [one] ifunde limbi lya kufikako { $count }
           *[other] amafunde yambi ya kufikako { $count }
        }. Tinya ukuti { $action ->
            [close] wisale
           *[open] wisule
        } lipoti ya kufikako.
       *[clean] Takwasangilwe ukupula kwa WCAG AA. Tinya ukuti { $action ->
            [close] wisale
           *[open] wisule
        } lipoti ya kufikako.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = Ubwikashi bwa DoenetML { $version }

editor-tab-help = Ubwafwilisho bwa cifulo
editor-tab-help-short = Icifulo
editor-tab-errors = Amalubo
editor-tab-warnings = Ukusoka
editor-tab-info = Ilyashi
editor-tab-accessibility = Ukufikako
editor-tab-responses = Amasuko ayatumwa

editor-tab-with-count = { $label }: { $count }

editor-options = Ifyakusala fya kalemba
editor-format-as-doenetml = Teyanya nga DoenetML
editor-format-as-xml = Teyanya nga XML


## The diagnostics panel

editor-diagnostic-line = Umutalale #{ $line }

editor-no-errors = Takwaba Amalubo
editor-no-warnings = Takwaba Ukusoka
editor-no-info = Takwaba Ilyashi

editor-show-info-annotations = Langa ilyashi muli kalemba
editor-show-accessibility-annotations = Langa ukusoka kwa kufikako muli kalemba

editor-accessibility-learn-more = Sambilila ifyo Doenet imona ukufikako

editor-accessibility-violations-heading = Ukupula kwa kufikako ({ $standard })

editor-accessibility-other-heading = Amafya yambi ya kufikako
editor-none-found = Takwasangilwe cintu


## Submitted responses

editor-no-responses = Takwaba amasuko ayatumwa nomba
editor-response-answer-id = Aidi ya Casuko
editor-response-response = Icasuko
editor-response-credit = Amapoyinti
editor-response-submitted = Catumwa


## The context-help panel

help-placeholder = Bika kasa pe shina lya tagi, pa cishinka, nangu pali { $ref } ukusanga ifyalembwa.

help-unsupported-ref-chain = Ubwafwilisho bwa fyalangilila ifya fipande ifingi nga { $example } tabwalatendeka.

help-unresolved-ref =
    { $reason ->
        [notFound] Takwasangilwe cintu pali ici cilangilila: { $ref }.
        [multiple] Kwasangwa ifintu ifingi pali ici cilangilila: { $ref }.
       *[indeterminate] Ico { $ref } ilelanga tacisangilwe.
    }

help-learn-about-references = Sambilila pa fyalangilila →
help-reference-page = Ibula lya cilangilila →

help-suggestions-header =
    { $location ->
        [inside] Mukati mwa { $element }
       *[top] Pa muulu sana
    }{ $allowed ->
        [none] { " — takwaba icingaya kuno." }
        [text] { " — lemba amashiwi kuno." }
        [text-and-components] { " — lemba amashiwi kuno, nangu wesha:" }
       *[components] { " — ifintu ifyo wingesha:" }
    }

help-suggestions-footer = Tinya { $shortcut } ukumona ifipande fyonse { $total }.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } cilangilila kuli { $target }.
       *[other] { $ref } cilangilila kuli { $target } (umutalale { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] Caletwa na { $owner } nga { $role }.
       *[other] Caletwa na { $owner } pa mutalale { $line } nga { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } cilangilila ku cishinka ca { $property } ca { $element }.
       *[other] { $ref } cilangilila ku cishinka ca { $property } ca { $element } (umutalale { $line }).
    }

help-kind-attribute = icishinka
help-kind-snippet = icipande
help-kind-array-entry = ukwingisha mu mutande

help-default = Ica cinkulu:
help-active-default = Ica cinkulu icilebomba:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Imibalo iyasuminishiwa (yenka pa cintu cimo cimo):
       *[other] Imibalo iyasuminishiwa:
    }

help-suggested-values = Imibalo iyafundwa:

help-inserts = Cileingisha:

help-coordinates =
    { $count ->
        [one] Icilangilila cifulo:
       *[other] Ifilangilila ififulo:
    }

help-type = Umusango:

help-resolved-style = Umusango uwasangwa (styleNumber { $styleNumber }):

help-resolved-function-names = Amashina ya ncito ayasangwa:
help-reset-list = Umutande uwabweshiwa pa kwingisha uku:
help-added-on-input = Ifyalundwapo pa kwingisha uku:
help-removed-on-input = Ifyafumishiwepo pa kwingisha uku:

help-reset-overrides = { $reset } yacila { $additional } na { $removed }.
