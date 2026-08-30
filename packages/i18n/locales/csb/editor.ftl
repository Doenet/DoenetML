# Kashubian (kaszëbsczi) editor and language-server surfaces: the footer, the
# diagnostics panel, the variant picker, the accessibility button and the
# context-help panel. Selected by `uiLocale`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Orthography.** The standard Kashubian alphabet — «ã», «ë», «é», «ò», «ó»,
# «ô», «ù» are letters of it and not decorated Polish ones, «ë» being the szwa
# and «ò»/«ù» marking the diphthongal onset; see `chrome.ftl`, which also
# carries the note on why this file is not `locales/pl` («nié»,
# «òdpòwiésc», «bëlno», «jinaczi», «kaszëbsczi») and on the German contact
# layer that «fela» and «ôrt» come from.
#
# **`WCAG`, `WCAG AA`, `DoenetML` and `XML` are names**, not words, and stay in
# English exactly as `locales/en` writes them. So do the DoenetML identifiers
# `styleNumber` and the attribute names in `help-reset-overrides`.
#
# **Number.** CLDR has no plural rules for `csb`, so no `zero`, `two`, `few` or
# `many` branch appears anywhere: nothing could select one, and Kashubian's
# real `few`/`many` split is the thing that would be got wrong. Every symbolic
# selector — `$action`, `$status`, `$shortcut`, `$reason`, `$location`,
# `$allowed`, `$line`, `$perItem` — is kept byte for byte from English.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Copni
       *[update] Òdswieżë
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } pòdzérk
       *[other] { $word } pòdzérk { $shortcut }
    }


## The variant picker

editor-variant = Wariant
editor-variant-filter = Filtruj…
editor-variant-next = Wëbierzë nôstãpny wariant
editor-variant-previous = Wëbierzë pòprzédny wariant


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] Nalazłé je przekroczenié WCAG AA za przëstãpnosc. Klëkni, żebë { $action ->
            [close] zamknąc
           *[open] òtemknąc
        } rapòrt ò przëstãpnoscë.
        [advisories] Klëkni, żebë { $action ->
            [close] zamknąc
           *[open] òtemknąc
        } rapòrt ò przëstãpnoscë. Żódnëch przekroczeniów WCAG AA nie nalazłé, ale są jinszé radë ò przëstãpnoscë.
       *[clean] Klëkni, żebë { $action ->
            [close] zamknąc
           *[open] òtemknąc
        } rapòrt ò przëstãpnoscë. Żódnëch problemów z przëstãpnoscą nie nalazłé.
    }

editor-accessibility-label =
    { $status ->
        [violations] Nalazłé je przekroczenié WCAG AA za przëstãpnosc. Nalazłé { $count } przekroczeniów WCAG AA. Klëkni, żebë { $action ->
            [close] zamknąc
           *[open] òtemknąc
        } rapòrt ò przëstãpnoscë.
        [advisories] Żódnëch przekroczeniów WCAG AA nie nalazłé. Nalazłé { $count } jinszich rôd ò przëstãpnoscë. Klëkni, żebë { $action ->
            [close] zamknąc
           *[open] òtemknąc
        } rapòrt ò przëstãpnoscë.
       *[clean] Żódnëch przekroczeniów WCAG AA nie nalazłé. Klëkni, żebë { $action ->
            [close] zamknąc
           *[open] òtemknąc
        } rapòrt ò przëstãpnoscë.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = Wersjô DoenetML { $version }

editor-tab-help = Pòmòc do tegò molu
editor-tab-help-short = Kòntekst
editor-tab-errors = Felë
editor-tab-warnings = Òstrzedżenia
editor-tab-info = Wiadła
editor-tab-accessibility = Przëstãpnosc
editor-tab-responses = Wësłóné òdpòwiescë

editor-tab-with-count = { $label }: { $count }

editor-options = Nastôwë editora
editor-format-as-doenetml = Fòrmatëjë jakò DoenetML
editor-format-as-xml = Fòrmatëjë jakò XML


## The diagnostics panel

editor-diagnostic-line = Réżka #{ $line }

editor-no-errors = Żódnëch felów
editor-no-warnings = Żódnëch òstrzedżeniów
editor-no-info = Żódnëch wiadłów

editor-show-info-annotations = Pòkażë wiadła w editorze
editor-show-accessibility-annotations = Pòkażë òstrzedżenia ò przëstãpnoscë w editorze

editor-accessibility-learn-more = Nauczë sã, jak Doenet bierze przëstãpnosc

editor-accessibility-violations-heading = Przekroczenia przëstãpnoscë ({ $standard })

editor-accessibility-other-heading = Jinszé problemë z przëstãpnoscą
editor-none-found = Nic nie nalazłé


## Submitted responses

editor-no-responses = Jesz żódnëch wësłónëch òdpòwiescy
editor-response-answer-id = Id òdpòwiescë
editor-response-response = Òdpòwiésc
editor-response-credit = Pùnktë
editor-response-submitted = Wësłóné


## The context-help panel

help-placeholder = Pòstawi kùrsor na miono tagù, na atribut abò na { $ref }, żebë ùzdrzec dokùmentacjã.

help-unsupported-ref-chain = Pòmòcë do wielodzélowëch òdwòłaniów jak { $example } jesz ni ma.

help-unresolved-ref =
    { $reason ->
        [notFound] Do òdwòłaniô { $ref } nie nalazłé żódnégò referentu.
        [multiple] Do òdwòłaniô { $ref } nalazłé wicy referentów.
       *[indeterminate] Referentu do { $ref } nie dało sã ùstalëc.
    }

help-learn-about-references = Nauczë sã ò òdwòłaniach →
help-reference-page = Strona òdwòłaniô →

help-suggestions-header =
    { $location ->
        [inside] W { $element }
       *[top] Na nôwëższim równi
    }{ $allowed ->
        [none] { " — tuwò nick nie jidze." }
        [text] { " — pisze tuwò tekst." }
        [text-and-components] { " — pisze tuwò tekst, abò spróbùj:" }
       *[components] { " — do spróbòwaniô:" }
    }

help-suggestions-footer = Wcësni { $shortcut }, żebë ùzdrzec wszëtczé { $total } kòmpònentë.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } je òdwòłanim do { $target }.
       *[other] { $ref } je òdwòłanim do { $target } (réżka { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] Wprowadzoné przez { $owner } jakò { $role }.
       *[other] Wprowadzoné przez { $owner } w réżce { $line } jakò { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } je òdwòłanim do włôsnoscë { $property } òd { $element }.
       *[other] { $ref } je òdwòłanim do włôsnoscë { $property } òd { $element } (réżka { $line }).
    }

help-kind-attribute = atribut
help-kind-snippet = kąsk tekstu
help-kind-array-entry = wpis tablicë

help-default = Domëslné:
help-active-default = Aktiwné domëslné:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Dozwòloné wôrtnotë (jedna na element):
       *[other] Dozwòloné wôrtnotë:
    }

help-suggested-values = Pòdpòwiedzóné wôrtnotë:

help-inserts = Wstôwiô:

help-coordinates =
    { $count ->
        [one] Wespółrzãdnô:
       *[other] Wespółrzãdné:
    }

help-type = Ôrt:

help-resolved-style = Wërachòwóny sztél (styleNumber { $styleNumber }):

help-resolved-function-names = Wërachòwóné miona fùnkcjów:
help-reset-list = Lësta copniãcô na tim wpisu:
help-added-on-input = Dodóné na tim wpisu:
help-removed-on-input = Rëmniãté z tegò wpisu:

help-reset-overrides = { $reset } przekriwô { $additional } a { $removed }.
