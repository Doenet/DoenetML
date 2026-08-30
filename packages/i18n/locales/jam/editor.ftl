# Jamaican Creole (Patwa, «Jamiekan») editor and language-server surfaces.
# Translated from `locales/en/editor.ftl`, which is the source of truth:
# `lint:i18n` rejects a key that does not exist there, and reports a key that
# exists there but not here as missing coverage.
#
# `WCAG AA`, `DoenetML`, `XML`, `styleNumber` and every attribute or element
# name are identifiers, not prose, and stay exactly as written.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Orthography.** The **Cassidy phonemic orthography** (Cassidy 1961, as
# regularized by the Jamaican Language Unit at UWI Mona), the same system as
# the other three files here. It is not English-based spelling. Most everyday
# written Jamaican — lyrics, social media, advertising, published dialogue —
# uses English spelling conventions instead, so this catalog does not look
# like what a Jamaican reader usually sees written. A reviewer who chooses the
# English-based system would **respell** the whole catalog rather than
# retranslate it, so the choice must be made once and applied to all four
# files together. `chrome.ftl` sets the system out in full: five vowels
# `i e a o u` with the long vowels doubled, the three diphthongs `ie ai ou`,
# palatal `ky` and `gy`, `h` written only where it is pronounced, and no
# apostrophes. No diacritics are used.
#
# **Number.** `Intl.PluralRules` has no CLDR data of its own for `jam`; the
# probe resolves it to `en-US` and reports `['one', 'other']`. A Jamaican
# Creole noun after a numeral is unmarked, so the two branches would be
# word-for-word identical and each count message here is written as **one
# unselected form**. The selects that remain — on `$action`, `$status`,
# `$shortcut`, `$reason`, `$location`, `$allowed`, `$perItem`, `$line` — are
# not plural selects, and every branch of them is translated.
#
# **This is the thinnest of the four files**, in the sense that most of what
# it names is a developer surface with no established Jamaican word: «vieryant»,
# «filta», «faamat», «kompuonent», «atribyut», «taip», «snipit», «arie»,
# «fongkshan», «vorshan», «dayagnostik», «kuaadinet» and «aksesibiliti» are
# English loans in Cassidy spelling, kept rather than coined. The grammar
# around them is Jamaican — «fi» for purpose, «no» for negation, «wi» for the
# future — and a reviewer should read the sentences for that rather than for
# the nouns.
#
# What this file holds is **an English loan set carried in Jamaican Creole's
# own grammar and written in Cassidy spelling**: the loans are the words the
# language actually uses, and the sentences around them are Jamaican, not
# English. A Cassidy-spelled English loan is correct. An English sentence
# anywhere in these four files is a defect.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Riset
       *[update] Opdiet
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } Di Vyuuwa
       *[other] { $word } Di Vyuuwa { $shortcut }
    }


## The variant picker

editor-variant = Vieryant
editor-variant-filter = Filta...
editor-variant-next = Pik di neks vieryant
editor-variant-previous = Pik di vieryant bifuo


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] Wi fain wan WCAG AA aksesibiliti vaiolieshan. Klik fi { $action ->
            [close] kluoz
           *[open] uopn
        } di aksesibiliti riepuot.
        [advisories] Klik fi { $action ->
            [close] kluoz
           *[open] uopn
        } di aksesibiliti riepuot. Wi no fain no WCAG AA vaiolieshan, bot wi av som muo aksesibiliti advais fi yu.
       *[clean] Klik fi { $action ->
            [close] kluoz
           *[open] uopn
        } di aksesibiliti riepuot. Wi no fain no aksesibiliti prablem.
    }

editor-accessibility-label =
    { $status ->
        [violations] Wi fain wan WCAG AA aksesibiliti vaiolieshan. Wi fain { $count } WCAG AA vaiolieshan. Klik fi { $action ->
            [close] kluoz
           *[open] uopn
        } di aksesibiliti riepuot.
        [advisories] Wi no fain no WCAG AA vaiolieshan. Wi fain { $count } muo aksesibiliti advais. Klik fi { $action ->
            [close] kluoz
           *[open] uopn
        } di aksesibiliti riepuot.
       *[clean] Wi no fain no WCAG AA vaiolieshan. Klik fi { $action ->
            [close] kluoz
           *[open] uopn
        } di aksesibiliti riepuot.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML vorshan { $version }

editor-tab-help = Elp fi wa di korsa de pan
editor-tab-help-short = Kanteks
editor-tab-errors = Era
editor-tab-warnings = Waanin
editor-tab-info = Info
editor-tab-accessibility = Aksesibiliti
editor-tab-responses = Ansa we sen

editor-tab-with-count = { $label }: { $count }

editor-options = Eda opshan
editor-format-as-doenetml = Faamat az DoenetML
editor-format-as-xml = Faamat az XML


## The diagnostics panel

editor-diagnostic-line = Lain #{ $line }

editor-no-errors = No Era
editor-no-warnings = No Waanin
editor-no-info = No Info Dayagnostik

editor-show-info-annotations = Shuo info dayagnostik iina di eda
editor-show-accessibility-annotations = Shuo aksesibiliti dayagnostik iina di eda

editor-accessibility-learn-more = Lorn ou Doenet luk pan aksesibiliti

editor-accessibility-violations-heading = Aksesibiliti vaiolieshan ({ $standard })

editor-accessibility-other-heading = Ada aksesibiliti prablem
editor-none-found = Wi no fain non


## Submitted responses

editor-no-responses = No ansa no sen yet
editor-response-answer-id = Ansa Id
editor-response-response = Ansa
editor-response-credit = Kredit
editor-response-submitted = Sen


## The context-help panel

help-placeholder = Put di korsa pan wan tag niem, wan atribyut, ar { $ref } fi get di dakyumentieshan.

help-unsupported-ref-chain = Elp fi refrans we av muo dan wan paat, laik { $example }, no de-de yet.

help-unresolved-ref =
    { $reason ->
        [notFound] Wi kyaan fain notn fi di refrans: { $ref }.
        [multiple] Wi fain muo dan wan tin fi di refrans: { $ref }.
       *[indeterminate] Wi kyaan wok out wa { $ref } a taak bout.
    }

help-learn-about-references = Lorn bout refrans →
help-reference-page = Refrans piej →

help-suggestions-header =
    { $location ->
        [inside] Iinsaid { $element }
       *[top] A di tap liivl
    }{ $allowed ->
        [none] { " — notn no go ya so." }
        [text] { " — taip tex ya so." }
        [text-and-components] { " — taip tex ya so, ar chrai:" }
       *[components] { " — sitn fi chrai:" }
    }

help-suggestions-footer = Pres { $shortcut } fi si aal { $total } kompuonent.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } a wan refrans tu { $target }.
       *[other] { $ref } a wan refrans tu { $target } (lain { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] { $owner } bring it iin az { $role }.
       *[other] { $owner } bring it iin pan lain { $line } az { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } a wan refrans tu di { $property } prapati fi { $element }.
       *[other] { $ref } a wan refrans tu di { $property } prapati fi { $element } (lain { $line }).
    }

help-kind-attribute = atribyut
help-kind-snippet = snipit
help-kind-array-entry = arie entri

help-default = Difaalt:
help-active-default = Aktiv difaalt:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Valyu we alou (wan fi ich aitem):
       *[other] Valyu we alou:
    }

help-suggested-values = Valyu we wi sojes:

help-inserts = It put iin:

help-coordinates = Kuaadinet:

help-type = Taip:

help-resolved-style = Stail we wok out (styleNumber { $styleNumber }):

help-resolved-function-names = Fongkshan niem we wok out:
help-reset-list = Riset di lis pan dis input:
help-added-on-input = Put aan pan dis input:
help-removed-on-input = Tek we pan dis input:

help-reset-overrides = { $reset } uovaraid { $additional } an { $removed }.
