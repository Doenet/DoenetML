# Silesian (ślōnskŏ gŏdka) editor and language-server surfaces: the footer, the
# diagnostics panel, the variant picker, the accessibility button and the
# context-help panel. Selected by `uiLocale`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Orthography.** The ślabikŏrzowy szrajbōnek; see `chrome.ftl`, which also
# carries the note on why this file is not `locales/pl`.
#
# **`WCAG`, `WCAG AA`, `DoenetML` and `XML` are names**, not words, and stay in
# English exactly as `locales/en` writes them. So do the DoenetML identifiers
# `styleNumber` and the attribute names in `help-reset-overrides`.
#
# **Number.** CLDR has no plural rules for `szl`, so no `zero`, `two`, `few` or
# `many` branch appears anywhere: nothing could select one, and Silesian's real
# `few`/`many` split is the thing that would be got wrong. Every symbolic
# selector — `$action`, `$status`, `$shortcut`, `$reason`, `$location`,
# `$allowed`, `$line`, `$perItem` — is kept byte for byte from English.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Cofnij
       *[update] Ôdświyż
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } podglōnd
       *[other] { $word } podglōnd { $shortcut }
    }


## The variant picker

editor-variant = Wariant
editor-variant-filter = Filtruj…
editor-variant-next = Wybier nastympny wariant
editor-variant-previous = Wybier piyrwyjszy wariant


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] Znodziōne je przekroczynie WCAG AA za przistympnŏść. Kliknij, coby { $action ->
            [close] zawrzić
           *[open] ôdewrzić
        } raport ô przistympnŏści.
        [advisories] Kliknij, coby { $action ->
            [close] zawrzić
           *[open] ôdewrzić
        } raport ô przistympnŏści. Żŏdnych przekroczyń WCAG AA niy znodziōno, ale sōm inksze rady ô przistympnŏści.
       *[clean] Kliknij, coby { $action ->
            [close] zawrzić
           *[open] ôdewrzić
        } raport ô przistympnŏści. Żŏdnych problymōw z przistympnŏściōm niy znodziōno.
    }

editor-accessibility-label =
    { $status ->
        [violations] Znodziōne je przekroczynie WCAG AA za przistympnŏść. Znodziōno { $count } przekroczyń WCAG AA. Kliknij, coby { $action ->
            [close] zawrzić
           *[open] ôdewrzić
        } raport ô przistympnŏści.
        [advisories] Żŏdnych przekroczyń WCAG AA niy znodziōno. Znodziōno { $count } inkszych rad ô przistympnŏści. Kliknij, coby { $action ->
            [close] zawrzić
           *[open] ôdewrzić
        } raport ô przistympnŏści.
       *[clean] Żŏdnych przekroczyń WCAG AA niy znodziōno. Kliknij, coby { $action ->
            [close] zawrzić
           *[open] ôdewrzić
        } raport ô przistympnŏści.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = Wersyjŏ DoenetML { $version }

editor-tab-help = Pōmoc do tego placu
editor-tab-help-short = Kōntekst
editor-tab-errors = Felery
editor-tab-warnings = Ôstrzeżynia
editor-tab-info = Informacyje
editor-tab-accessibility = Przistympnŏść
editor-tab-responses = Posłane ôdpowiedzi

editor-tab-with-count = { $label }: { $count }

editor-options = Sztelōnki edytora
editor-format-as-doenetml = Formatuj jak DoenetML
editor-format-as-xml = Formatuj jak XML


## The diagnostics panel

editor-diagnostic-line = Wiersz #{ $line }

editor-no-errors = Żŏdnych felerōw
editor-no-warnings = Żŏdnych ôstrzeżyń
editor-no-info = Żŏdnych informacyji

editor-show-info-annotations = Pokŏż informacyje w edytorze
editor-show-accessibility-annotations = Pokŏż ôstrzeżynia ô przistympnŏści w edytorze

editor-accessibility-learn-more = Naucz sie, jak Doenet bierze przistympnŏść

editor-accessibility-violations-heading = Przekroczynia przistympnŏści ({ $standard })

editor-accessibility-other-heading = Inksze problymy z przistympnŏściōm
editor-none-found = Nic niy znodziōno


## Submitted responses

editor-no-responses = Jeszcze żŏdnych posłanych ôdpowiedzi
editor-response-answer-id = Id ôdpowiedzi
editor-response-response = Ôdpowiydź
editor-response-credit = Pōnkty
editor-response-submitted = Posłane


## The context-help panel

help-placeholder = Postŏw kursōr na miano tagu, na atrybut abo na { $ref }, coby uzdrzeć dokumyntacyjŏ.

help-unsupported-ref-chain = Pōmocy do wielotajlowych ôdwołań choby { $example } jeszcze niy ma.

help-unresolved-ref =
    { $reason ->
        [notFound] Do ôdwołaniŏ { $ref } niy znodziōno żŏdnego referyntu.
        [multiple] Do ôdwołaniŏ { $ref } znodziōno wiyncyj referyntōw.
       *[indeterminate] Referyntu do { $ref } niy szło ustalić.
    }

help-learn-about-references = Naucz sie ô ôdwołaniach →
help-reference-page = Strōna ôdwołaniŏ →

help-suggestions-header =
    { $location ->
        [inside] We { $element }
       *[top] Na nojwyższym poziōmie
    }{ $allowed ->
        [none] { " — tukej nic niy idzie." }
        [text] { " — pisz tukej tekst." }
        [text-and-components] { " — pisz tukej tekst, abo sprōbuj:" }
       *[components] { " — do sprōbowaniŏ:" }
    }

help-suggestions-footer = Wciś { $shortcut }, coby uzdrzeć wszyskie { $total } kōmpōnynty.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } je ôdwołaniym do { $target }.
       *[other] { $ref } je ôdwołaniym do { $target } (wiersz { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] Wprowadzōne bez { $owner } jak { $role }.
       *[other] Wprowadzōne bez { $owner } we wierszu { $line } jak { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } je ôdwołaniym do włŏsnŏści { $property } ôd { $element }.
       *[other] { $ref } je ôdwołaniym do włŏsnŏści { $property } ôd { $element } (wiersz { $line }).
    }

help-kind-attribute = atrybut
help-kind-snippet = kōnsek tekstu
help-kind-array-entry = wpis tablicy

help-default = Wychodne:
help-active-default = Aktywne wychodne:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Dozwolōne werty (jedna na elymynt):
       *[other] Dozwolōne werty:
    }

help-suggested-values = Podpowiedziane werty:

help-inserts = Wstawiŏ:

help-coordinates =
    { $count ->
        [one] Wspōłrzyndnŏ:
       *[other] Wspōłrzyndne:
    }

help-type = Zorta:

help-resolved-style = Wyrachowany sztil (styleNumber { $styleNumber }):

help-resolved-function-names = Wyrachowane miana funkcyji:
help-reset-list = Lista cofniyńciŏ na tym wpisie:
help-added-on-input = Przidane na tym wpisie:
help-removed-on-input = Wyciepniyte z tego wpisu:

help-reset-overrides = { $reset } przekrywŏ { $additional } a { $removed }.
