# Kabyle editor and language-server surfaces: the footer, the diagnostics
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
        [reset] Wennez
       *[update] Leqqem
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } amsken
       *[other] { $word } amsken { $shortcut }
    }


## The variant picker

editor-variant = Talɣa

editor-variant-filter = Sizdeg…

editor-variant-next = Fren talɣa i d-iteddun

editor-variant-previous = Fren talɣa yezrin


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] Yettwaf uzgar WCAG AA n wanekcum. Sit akken ad { $action ->
            [close] tmedleḍ
           *[open] teldiḍ
        } aneqqis n wanekcum.
        [advisories] Sit akken ad { $action ->
            [close] tmedleḍ
           *[open] teldiḍ
        } aneqqis n wanekcum. Ulac azgar WCAG AA yettwafen, maca llan ineɣmisen nniḍen n wanekcum.
       *[clean] Sit akken ad { $action ->
            [close] tmedleḍ
           *[open] teldiḍ
        } aneqqis n wanekcum. Ulac uguren n wanekcum yettwafen.
    }

editor-accessibility-label =
    { $status ->
        [violations] Yettwaf uzgar WCAG AA n wanekcum. { $count ->
            [one] Yettwaf { $count } n uzgar WCAG AA
           *[other] Ttwafen { $count } n yizgaren WCAG AA
        }. Sit akken ad { $action ->
            [close] tmedleḍ
           *[open] teldiḍ
        } aneqqis n wanekcum.
        [advisories] Ulac azgar WCAG AA yettwafen. { $count ->
            [one] Yettwaf { $count } n uneɣmis nniḍen n wanekcum
           *[other] Ttwafen { $count } n yineɣmisen nniḍen n wanekcum
        }. Sit akken ad { $action ->
            [close] tmedleḍ
           *[open] teldiḍ
        } aneqqis n wanekcum.
       *[clean] Ulac azgar WCAG AA yettwafen. Sit akken ad { $action ->
            [close] tmedleḍ
           *[open] teldiḍ
        } aneqqis n wanekcum.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = Lqem DoenetML { $version }

editor-tab-help = Tallalt n wadeg
editor-tab-help-short = Adeg
editor-tab-errors = Tuccḍiwin
editor-tab-warnings = Ilɣa
editor-tab-info = Talɣut
editor-tab-accessibility = Anekcum
editor-tab-responses = Tiririyin yettwaznen

editor-tab-with-count = { $label }: { $count }

editor-options = Tinefrunin n umaẓrag
editor-format-as-doenetml = Msel am DoenetML
editor-format-as-xml = Msel am XML


## The diagnostics panel

editor-diagnostic-line = Izirig #{ $line }

editor-no-errors = Ulac tuccḍiwin
editor-no-warnings = Ulac ilɣa
editor-no-info = Ulac talɣut

editor-show-info-annotations = Sken talɣut deg umaẓrag
editor-show-accessibility-annotations = Sken ilɣa n wanekcum deg umaẓrag

editor-accessibility-learn-more = Lmed amek i twali Doenet anekcum

editor-accessibility-violations-heading = Izgaren n wanekcum ({ $standard })

editor-accessibility-other-heading = Uguren nniḍen n wanekcum
editor-none-found = Ulac acemma yettwafen


## Submitted responses

editor-no-responses = Ulac tiririyin yettwaznen ar tura
editor-response-answer-id = Asulay n tririt
editor-response-response = Tiririt
editor-response-credit = Tinqiḍin
editor-response-submitted = Tettwazen


## The context-help panel

help-placeholder = Err taḥnaccaṭ ɣef yisem n tebzimt, ɣef umeslay, neɣ ɣef { $ref } i tsemlit.

help-unsupported-ref-chain = Tallalt n tmeɣṛiwin s waṭas n yiḥricen am { $example } mazal ur telli ara.

help-unresolved-ref =
    { $reason ->
        [notFound] Ulac acemma yettwafen i tmeɣṛit-agi: { $ref }.
        [multiple] Ttwafen waṭas n tɣawsiwin i tmeɣṛit-agi: { $ref }.
       *[indeterminate] Ayen i d-tessenta { $ref } ur yezmir ara ad yettwassen.
    }

help-learn-about-references = Lmed ɣef tmeɣṛiwin →
help-reference-page = Asebter n tmeɣṛit →

help-suggestions-header =
    { $location ->
        [inside] Deg { $element }
       *[top] Deg uswir afellay
    }{ $allowed ->
        [none] { " — ulac ayen ara yeddun dagi." }
        [text] { " — aru aḍris dagi." }
        [text-and-components] { " — aru aḍris dagi, neɣ ɛreḍ:" }
       *[components] { " — tiɣawsiwin ara tɛerḍeḍ:" }
    }

help-suggestions-footer = Sit { $shortcut } i wakken ad twaliḍ { $total } n yiferdisen meṛṛa.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } d tameɣṛit ɣer { $target }.
       *[other] { $ref } d tameɣṛit ɣer { $target } (izirig { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] Tettwarna-d s { $owner } am { $role }.
       *[other] Tettwarna-d s { $owner } deg yizirig { $line } am { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } d tameɣṛit ɣer umeslay { $property } n { $element }.
       *[other] { $ref } d tameɣṛit ɣer umeslay { $property } n { $element } (izirig { $line }).
    }

help-kind-attribute = ameslay
help-kind-snippet = agzum
help-kind-array-entry = anekcum deg umuɣ

help-default = Amezwer:
help-active-default = Amezwer urmid:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Azalen yettusirgen (yiwen i yal taɣawsa):
       *[other] Azalen yettusirgen:
    }

help-suggested-values = Azalen yettwasumren:

help-inserts = Yesekcam:

help-coordinates =
    { $count ->
        [one] Tamsidegt:
       *[other] Timsidegin:
    }

help-type = Anaw:

help-resolved-style = Aɣanib yettwafen (styleNumber { $styleNumber }):

help-resolved-function-names = Ismawen n twuriwin yettwafen:
help-reset-list = Umuɣ yettwawennzen deg unekcum-agi:
help-added-on-input = Ayen yettwarnan deg unekcum-agi:
help-removed-on-input = Ayen yettwakksen deg unekcum-agi:

help-reset-overrides = { $reset } yezwar { $additional } d { $removed }.
