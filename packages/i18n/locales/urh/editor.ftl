# Urhobo editor and language-server surfaces: the footer, the diagnostics
# panel, the variant picker, the accessibility button, and the context-help
# panel beside them. Selected by `uiLocale`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
#
# See `chrome.ftl`'s header for the family (Southwestern Edoid, Volta-Niger),
# the pairing with `locales/bin`, the no-agreement finding, and the note on
# how thin online Urhobo lexical coverage is — most of the vocabulary an
# editor UI needs (panel names, diagnostic severities) is rendered here as an
# English loanword fit to Urhobo spelling for that reason.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Werhie
       *[update] Vwewiẹ
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } Odjro
       *[other] { $word } Odjro { $shortcut }
    }


## The variant picker

editor-variant = Ivarianti
editor-variant-filter = Fẹnta…
editor-variant-next = Nabọ ivarianti ro rhirie
editor-variant-previous = Nabọ ivarianti ro siẹvwin


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] A mrẹ ophariẹ WCAG AA. Te kẹ e { $action ->
            [close] vọnrẹ
           *[open] ke
        } ẹbe rẹ ophariẹ.
        [advisories] Te kẹ e { $action ->
            [close] vọnrẹ
           *[open] ke
        } ẹbe rẹ ophariẹ. A mrẹ ophariẹ WCAG AA ovwan-o, ẹkẹrẹ eghwọ efa je he.
       *[clean] Te kẹ e { $action ->
            [close] vọnrẹ
           *[open] ke
        } ẹbe rẹ ophariẹ. A mrẹ otọfa rẹ iruemu-erhirhie ovwan-o.
    }

editor-accessibility-label =
    { $status ->
        [violations] A mrẹ ophariẹ WCAG AA. A mrẹ ophariẹ WCAG AA { $count ->
            [one] { $count }
           *[other] { $count }
        }. Te kẹ e { $action ->
            [close] vọnrẹ
           *[open] ke
        } ẹbe rẹ ophariẹ.
        [advisories] A mrẹ ophariẹ WCAG AA ovwan-o. A mrẹ eghwọ efa { $count ->
            [one] { $count }
           *[other] { $count }
        }. Te kẹ e { $action ->
            [close] vọnrẹ
           *[open] ke
        } ẹbe rẹ ophariẹ.
       *[clean] A mrẹ ophariẹ WCAG AA ovwan-o. Te kẹ e { $action ->
            [close] vọnrẹ
           *[open] ke
        } ẹbe rẹ ophariẹ.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML ivarianti { $version }

editor-tab-help = Uphiudu ro nẹrhẹ ẹkẹ rhe
editor-tab-help-short = Uphiudu
editor-tab-errors = Otọfa
editor-tab-warnings = Ophariẹ
editor-tab-info = Odjekọ
editor-tab-accessibility = Iruemu-erhirhie
editor-tab-responses = Ẹkpahọnphiyọ ro yen sọmit

editor-tab-with-count = { $label }: { $count }

editor-options = Ijẹrhukọ rẹ ẹdita
editor-format-as-doenetml = Werhie fọmatti kpo DoenetML
editor-format-as-xml = Werhie fọmatti kpo XML


## The diagnostics panel

editor-diagnostic-line = Layin #{ $line }

editor-no-errors = Otọfa Ovwan
editor-no-warnings = Ophariẹ Ovwan
editor-no-info = Odjekọ Ovwan

editor-show-info-annotations = Djro odjekọ vwẹ ẹdita
editor-show-accessibility-annotations = Djro ophariẹ rẹ iruemu-erhirhie vwẹ ẹdita

editor-accessibility-learn-more = Yono kpahọn oborẹ Doenet ro sio kpahọn iruemu-erhirhie

editor-accessibility-violations-heading = Ophariẹ rẹ WCAG AA ({ $standard })

editor-accessibility-other-heading = Ophariẹ efa rẹ iruemu-erhirhie
editor-none-found = A mrẹ ovwan-o


## Submitted responses

editor-no-responses = A che sọmit ẹkpahọnphiyọ-o
editor-response-answer-id = Odẹ rẹ Ẹkpahọnphiyọ
editor-response-response = Ẹkpahọnphiyọ
editor-response-credit = Kirediti
editor-response-submitted = Ọ yen sọmit


## The context-help panel

help-placeholder = Werhie kọsọ vwẹ odẹ-tagi, atiribiuti, yẹrẹ { $ref } rẹ ẹbe-odjekọ.

help-unsupported-ref-chain = Uphiudu kẹ ẹkẹ-rherhe ro vwo ekpẹrọ buebun bọ { $example } a che support ẹrhọ-e.

help-unresolved-ref =
    { $reason ->
        [notFound] A mrẹ orere kẹ ẹkẹ-rherhe: { $ref } ovwan-o.
        [multiple] A mrẹ orere buebun kẹ ẹkẹ-rherhe: { $ref }.
       *[indeterminate] A sa vwo mrẹ orere kẹ { $ref } vwẹ akpọ-e.
    }

help-learn-about-references = Yono kpahọn ẹkẹ-rherhe →
help-reference-page = Pej rẹ ẹkẹ-rherhe →

help-suggestions-header =
    { $location ->
        [inside] Vwẹ obọ { $element }
       *[top] Vwẹ ubru rẹ ẹbe na
    }{ $allowed ->
        [none] { " — o ovwan-o vwẹ etẹ na." }
        [text] { " — kere ọbe vwẹ etẹ na." }
        [text-and-components] { " — kere ọbe vwẹ etẹ na, yẹrẹ dabọ:" }
       *[components] { " — erọ wọ sa dabọ:" }
    }

help-suggestions-footer = Kpe { $shortcut } re djro ikọmpọnẹnti { $total } eje.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } yen ẹkẹ-rherhe rẹ { $target }.
       *[other] { $ref } yen ẹkẹ-rherhe rẹ { $target } (layin { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] { $owner } yen mudiane phi kpahọn { $role }.
       *[other] { $owner } yen mudiane phi vwẹ layin { $line } kpahọn { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } yen ẹkẹ-rherhe rẹ ekpokpọ { $property } rẹ { $element }.
       *[other] { $ref } yen ẹkẹ-rherhe rẹ ekpokpọ { $property } rẹ { $element } (layin { $line }).
    }

help-kind-attribute = atiribiuti
help-kind-snippet = ẹkpẹrọ ọbe
help-kind-array-entry = ọvo vwẹ areyi

help-default = Ro dje-diẹ:
help-active-default = Ro dje-diẹ ro rhe iruo:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Erọ a vwo yọnrẹ (ọvo kẹ ọvo):
       *[other] Erọ a vwo yọnrẹ:
    }

help-suggested-values = Erọ a nẹrhẹ:

help-inserts = Erọ ro sa yen kobọrọ:

help-coordinates =
    { $count ->
        [one] Ẹkẹ-orenre:
       *[other] Ẹkẹ-orenre:
    }

help-type = Uyovwin:

help-resolved-style = Osiuwu ro nabọ (styleNumber { $styleNumber }):

help-resolved-function-names = Odẹ rẹ fọkshọn ro nabọ:
help-reset-list = Werhie eyin vwẹ etẹ na:
help-added-on-input = Ro yen kobọrọ vwẹ etẹ na:
help-removed-on-input = Ro yen werhie phrẹ vwẹ etẹ na:

help-reset-overrides = { $reset } yen dje { $additional } vẹ { $removed } phrẹ.
