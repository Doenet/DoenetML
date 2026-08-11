# Temne editor and language-server surfaces. Selected by `uiLocale`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
#
# DoenetML element names, attribute names and `styleNumber` are identifiers of
# the language and stay in English exactly as written.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Firi bɛk
       *[update] Firi
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } Kʌyiraŋ
       *[other] { $word } Kʌyiraŋ { $shortcut }
    }


## The variant picker

editor-variant = Kʌmʌŋ

editor-variant-filter = Fen…

editor-variant-next = Fen kʌmʌŋ kʌ tʌŋ

editor-variant-previous = Fen kʌmʌŋ kʌ pʌ


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] Ma bata WCAG AA kʌwuni ka kʌsɔth. Tɔth ma kʌ { $action ->
            [close] kanti
           *[open] tuli
        } kʌsɔŋ ka kʌsɔth.
        [advisories] Tɔth ma kʌ { $action ->
            [close] kanti
           *[open] tuli
        } kʌsɔŋ ka kʌsɔth. Ma bata WCAG AA kʌwuni bɔm, kɛrɛ tʌsandi tʌbʌŋ tʌ kʌsɔth tʌ na.
       *[clean] Tɔth ma kʌ { $action ->
            [close] kanti
           *[open] tuli
        } kʌsɔŋ ka kʌsɔth. Ma bata kʌwuni ka kʌsɔth bɔm.
    }

editor-accessibility-label =
    { $status ->
        [violations] Ma bata WCAG AA kʌwuni ka kʌsɔth. Ma bata { $count ->
            [one] kʌwuni { $count } ka WCAG AA
           *[other] tʌwuni { $count } tʌ WCAG AA
        }. Tɔth ma kʌ { $action ->
            [close] kanti
           *[open] tuli
        } kʌsɔŋ ka kʌsɔth.
        [advisories] Ma bata WCAG AA kʌwuni bɔm. Ma bata { $count ->
            [one] kʌsandi { $count } kʌbʌŋ ka kʌsɔth
           *[other] tʌsandi { $count } tʌbʌŋ tʌ kʌsɔth
        }. Tɔth ma kʌ { $action ->
            [close] kanti
           *[open] tuli
        } kʌsɔŋ ka kʌsɔth.
       *[clean] Ma bata WCAG AA kʌwuni bɔm. Tɔth ma kʌ { $action ->
            [close] kanti
           *[open] tuli
        } kʌsɔŋ ka kʌsɔth.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML kʌmʌŋ { $version }

editor-tab-help = Kʌsandi ka ro mʌ na
editor-tab-help-short = Ro
editor-tab-errors = Tʌwuni
editor-tab-warnings = Tʌmɔŋ
editor-tab-info = Ʌŋkəre
editor-tab-accessibility = Kʌsɔth
editor-tab-responses = Ʌŋlipi ma sɔŋɔ

editor-tab-with-count = { $label }: { $count }

editor-options = Tʌfen tʌ kʌsɔŋɛr
editor-format-as-doenetml = Bay kʌ DoenetML
editor-format-as-xml = Bay kʌ XML


## The diagnostics panel

editor-diagnostic-line = Kʌlayn #{ $line }

editor-no-errors = Tʌwuni Tʌ Bɔm
editor-no-warnings = Tʌmɔŋ Tʌ Bɔm
editor-no-info = Ʌŋkəre Ka Bɔm

editor-show-info-annotations = Yira ʌŋkəre ka kʌsɔŋɛr
editor-show-accessibility-annotations = Yira tʌwuni tʌ kʌsɔth ka kʌsɔŋɛr

editor-accessibility-learn-more = Kalan kʌ Doenet kʌ bay kʌsɔth

editor-accessibility-violations-heading = Tʌwuni tʌ kʌsɔth ({ $standard })

editor-accessibility-other-heading = Tʌwuni tʌbʌŋ tʌ kʌsɔth
editor-none-found = Ma bata kəm bɔm


## Submitted responses

editor-no-responses = Ʌŋlipi ma sɔŋɔ bɔm nɛ
editor-response-answer-id = Ʌŋes ka ʌŋlipi
editor-response-response = Ʌŋlipi
editor-response-credit = Kʌbay
editor-response-submitted = Ma sɔŋɔ


## The context-help panel

help-placeholder = Bʌŋ kʌkəri ka ʌŋes ka tag, ka attribute, ɔ ka { $ref } kʌ mʌ bata ʌŋkəre.

help-unsupported-ref-chain = Kʌsandi ka tʌkəre tʌ tʌpath tʌbana kʌ { $example } kʌ na bɔm nɛ.

help-unresolved-ref =
    { $reason ->
        [notFound] Ma bata kəm bɔm ka { $ref }.
        [multiple] Ma bata tʌbʌŋ tʌbana ka { $ref }.
       *[indeterminate] Ma bata ʌŋkəbath ka { $ref } bɔm.
    }

help-learn-about-references = Kalan tʌkəre tʌ tʌnəŋ →
help-reference-page = Kʌpej ka ʌŋkəre →

help-suggestions-header =
    { $location ->
        [inside] Ka rɔ { $element }
       *[top] Ka kʌtɔŋ ka kʌbuk
    }{ $allowed ->
        [none] { " — kəm kʌ ba ro bɔm." }
        [text] { " — sɔŋ ʌŋkəre ro." }
        [text-and-components] { " — sɔŋ ʌŋkəre ro, ɔ tʌmpa:" }
       *[components] { " — tʌbʌŋ tʌ mʌ tʌmpa:" }
    }

help-suggestions-footer = Tɔth { $shortcut } kʌ mʌ yira tʌbʌŋ { $total } tʌ pəŋ.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } kʌ nəŋ ka { $target }.
       *[other] { $ref } kʌ nəŋ ka { $target } (kʌlayn { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] { $owner } kʌ fɔth kʌ kʌ { $role }.
       *[other] { $owner } kʌ fɔth kʌ ka kʌlayn { $line } kʌ { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } kʌ nəŋ ka { $property } ka { $element }.
       *[other] { $ref } kʌ nəŋ ka { $property } ka { $element } (kʌlayn { $line }).
    }

help-kind-attribute = attribute
help-kind-snippet = kʌpath
help-kind-array-entry = kʌpath ka array

help-default = Kʌ na pʌ:
help-active-default = Kʌ na pʌ na kʌ paŋth:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Tʌbʌŋ tʌ ma yifi (kʌmɔth ka kʌmɔth):
       *[other] Tʌbʌŋ tʌ ma yifi:
    }

help-suggested-values = Tʌbʌŋ tʌ ma sandi:

help-inserts = Kʌ fɔth:

help-coordinates =
    { $count ->
        [one] Kʌro:
       *[other] Tʌro:
    }

help-type = Kʌmʌŋ:

help-resolved-style = Kʌmʌŋ kʌ ma bata (styleNumber { $styleNumber }):

help-resolved-function-names = Ʌŋes ka tʌfɔnkshɔn tʌ ma bata:
help-reset-list = Firi bɛk kʌlist ka input kʌnɛ:
help-added-on-input = Ma fɔth ka input kʌnɛ:
help-removed-on-input = Ma bɔth ka input kʌnɛ:

help-reset-overrides = { $reset } kʌ pas { $additional } na { $removed }.
