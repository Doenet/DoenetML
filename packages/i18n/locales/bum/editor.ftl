# Bulu editor and language-server surfaces: the footer, the diagnostics
# panel, the variant picker, the accessibility button, and the context-help
# panel beside them. Selected by `uiLocale`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
#
# See `content.ftl`'s header for the noun-class table and the vocabulary
# strategy. `WCAG`, `WCAG AA`, `DoenetML`, `XML` and `styleNumber` are names
# rather than words and stay as they stand.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Bulane
       *[update] Kelege
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } Ntolan
       *[other] { $word } Ntolan { $shortcut }
    }


## The variant picker

editor-variant = Ntôtôlô

editor-variant-filter = Sefe...

editor-variant-next = Kabe ntôtôlô w'apre
editor-variant-previous = Kabe ntôtôlô w'avan


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] A ne ntyeñ WCAG AA w'akusa. Bo klik asu na o { $action ->
            [close] kale
           *[open] kuli
        } rapɔr a akusa.
        [advisories] Bo klik asu na o { $action ->
            [close] kale
           *[open] kuli
        } rapɔr a akusa. A si ne ntyeñ WCAG AA ki, nge da mimbamba mefe m'akusa me ne.
       *[clean] Bo klik asu na o { $action ->
            [close] kale
           *[open] kuli
        } rapɔr a akusa. Abé éziñ te a akusa.
    }

editor-accessibility-label =
    { $status ->
        [violations] A ne ntyeñ WCAG AA w'akusa. { $count ->
            [one] Ntyeñ WCAG AA { $count } a ne
           *[other] Ntyeñ WCAG AA { $count } mi ne
        }. Bo klik asu na o { $action ->
            [close] kale
           *[open] kuli
        } rapɔr a akusa.
        [advisories] A si ne ntyeñ WCAG AA ki. { $count ->
            [one] Mbamba éziñ m'akusa { $count } a ne
           *[other] Mimbamba m'akusa { $count } mi ne
        }. Bo klik asu na o { $action ->
            [close] kale
           *[open] kuli
        } rapɔr a akusa.
       *[clean] A si ne ntyeñ WCAG AA ki. Bo klik asu na o { $action ->
            [close] kale
           *[open] kuli
        } rapɔr a akusa.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = Vɛrsiɔ̃ a DoenetML { $version }

editor-tab-help = Ndugan a ntyeñ
editor-tab-help-short = Ntyeñ
editor-tab-errors = Bibé
editor-tab-warnings = Ayɔŋ
editor-tab-info = Melu
editor-tab-accessibility = Akusa
editor-tab-responses = Nkobo mi lômane

editor-tab-with-count = { $label }: { $count }

editor-options = Bikabe bia kalate
editor-format-as-doenetml = Teyañ avale DoenetML
editor-format-as-xml = Teyañ avale XML


## The diagnostics panel

editor-diagnostic-line = Ndamba #{ $line }

editor-no-errors = Bibé te
editor-no-warnings = Ayɔŋ te
editor-no-info = Melu te

editor-show-info-annotations = Yene melu a kalate
editor-show-accessibility-annotations = Yene ayɔŋ a akusa a kalate

editor-accessibility-learn-more = Sili avale Doenet a yene akusa

editor-accessibility-violations-heading = Ntyeñ w'akusa ({ $standard })

editor-accessibility-other-heading = Mimbamba mefe m'akusa
editor-none-found = Jôm éziñ te a yiane ki


## Submitted responses

editor-no-responses = Nkobo éziñ te w'a lômane wu
editor-response-answer-id = ID a Nkobo
editor-response-response = Nkobo
editor-response-credit = Mapwan
editor-response-submitted = A lômane


## The context-help panel

help-placeholder = Bulu kaso a jôé a tag, a pati, nge a { $ref } asu na o yene mimbamba.

help-unsupported-ref-chain = Ndugan a bilangilila bi bipati bibui avale { $example } a si tebe ki.

help-unresolved-ref =
    { $reason ->
        [notFound] Jôm éziñ te a yiane pa cilangilila nyi: { $ref }.
        [multiple] Bijôm bibui bi yiane pa cilangilila nyi: { $ref }.
       *[indeterminate] Jôm { $ref } a lañ a si yiane ki.
    }

help-learn-about-references = Sili avale bilangilila →
help-reference-page = Ibumu a cilangilila →

help-suggestions-header =
    { $location ->
        [inside] Aluñ a { $element }
       *[top] A étam
    }{ $allowed ->
        [none] { " — jôm éziñ te a ke ke wu." }
        [text] { " — kobo bikobo wu." }
        [text-and-components] { " — kobo bikobo wu, nge yem:" }
       *[components] { " — bijôm bi o ne yem:" }
    }

help-suggestions-footer = Bo klik { $shortcut } asu na o yene bipati bise { $total }.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } a lañ a { $target }.
       *[other] { $ref } a lañ a { $target } (ndamba { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] A lôm bo { $owner } avale { $role }.
       *[other] A lôm bo { $owner } a ndamba { $line } avale { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } a lañ a mbamba { $property } a { $element }.
       *[other] { $ref } a lañ a mbamba { $property } a { $element } (ndamba { $line }).
    }

help-kind-attribute = mbamba
help-kind-snippet = ékotogo
help-kind-array-entry = jôm a ndamba

help-default = A tebe:
help-active-default = A tebe a ke bo mfefe:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Mimbamba mi yiane (fe jôm éziñ éziñ):
       *[other] Mimbamba mi yiane:
    }

help-suggested-values = Mimbamba mi tôbô:

help-inserts = A ke tôbô:

help-coordinates =
    { $count ->
        [one] Ndamba a jôm:
       *[other] Bindamba bia bijôm:
    }

help-type = Ntôtôlô:

help-resolved-style = Ntôtôlô w'a yiane (styleNumber { $styleNumber }):

help-resolved-function-names = Bijôé bia fonksiɔ̃ bi'a yiane:
help-reset-list = Ndamba w'a bulane asu na o kabe wu:
help-added-on-input = Bijôm bi'a tôbô asu na o kabe wu:
help-removed-on-input = Bijôm bi'a lôs asu na o kabe wu:

help-reset-overrides = { $reset } a lôs { $additional } ai { $removed }.
