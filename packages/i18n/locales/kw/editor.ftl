# Cornish (Kernewek) editor and language-server surfaces. Translated from
# `locales/en/editor.ftl`, which is the source of truth: `lint:i18n` rejects a
# key that does not exist there, and reports a key that exists there but not
# here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Script: Latin, Standard Written Form (FSS/SWF)**, following Akademi
# Kernewek's «Gerlyver Kernewek»; **Kernewek Kemmyn** is the alternative
# orthography that was not used. Digits are Latin, as `src/intl.ts` pins for
# every locale.
#
# **Cornish and borrowed.** The frame is Cornish — «ny» / «nyns» negating,
# «ha» / «hag» joining, «po» for *or*, «avel» for *as*, «rag» for *for*, «war»
# for *on*, «dhe» + verbal noun for a purpose clause («dhe igeri an derivas»),
# and the bare verbal noun on every button. DoenetML identifiers, `WCAG` and
# `styleNumber` stay in English exactly as written. The panel's technical nouns
# are English in SWF spelling — «editor», «variant», «diagnostig», «tag»,
# «aray», «defowt», «format» — because English is the register a Cornish
# speaker meets an editor in; «gnas» for *attribute*, «gwerth» for *value*,
# «eghen» for *type*, «rol» for *list* and «gwallow» / «gwarnyansow» for
# *errors* / *warnings* are the language's own.
#
# **Counts.** Cornish has CLDR rules of its own with all six categories
# (`zero` `one` `two` `few` `many` `other`); `chrome.ftl`'s header sets out
# which integers reach each. Two messages here fork on a count.
# `editor-accessibility-label` counts violations with «torrva» and
# recommendations with «kussul», both feminine: «unn» lenites a feminine noun
# (`one` and, vigesimally, `many`), «diw» lenites (`two`), «teyr» spirantizes
# t→th and k→h (`few`), and everything else is radical — so all five reachable
# categories are written out and four of them differ. `help-coordinates` is a
# bare label with no numeral in it, so nothing mutates and only the singular /
# plural of «koordinat» is at stake.
#
# **Weakest first.** «hedhadewder» for *accessibility*, «kettesten» for
# *context*, «poyntell» for *cursor* — written «boyntell» after «an», which
# lenites — and «diskudhys» for *resolved* are the words a reviewer should
# check before anything else.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Dassettya
       *[update] Nowedhi
    }
editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } an gwelyer
       *[other] { $word } an gwelyer { $shortcut }
    }


## The variant picker

editor-variant = Variant
editor-variant-filter = Sidhla…
editor-variant-next = Dewis an variant nessa
editor-variant-previous = Dewis an variant kyns


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] Torrva hedhadewder WCAG AA kevys. Klyckya dhe { $action ->
            [close] dhegea
           *[open] igeri
        } an derivas hedhadewder.
        [advisories] Klyckya dhe { $action ->
            [close] dhegea
           *[open] igeri
        } an derivas hedhadewder. Ny veu kevys torrva WCAG AA vyth, mes yma kussulyow hedhadewder moy kavadow.
       *[clean] Klyckya dhe { $action ->
            [close] dhegea
           *[open] igeri
        } an derivas hedhadewder. Ny veu kevys kudynn hedhadewder vyth.
    }
editor-accessibility-label =
    { $status ->
        [violations] Torrva hedhadewder WCAG AA kevys. Kevys { $count ->
            [one] { $count } dorrva WCAG AA
            [two] { $count } dorrva WCAG AA
            [few] { $count } thorrva WCAG AA
            [many] { $count } dorrva WCAG AA
           *[other] { $count } torrva WCAG AA
        }. Klyckya dhe { $action ->
            [close] dhegea
           *[open] igeri
        } an derivas hedhadewder.
        [advisories] Ny veu kevys torrva WCAG AA vyth. Kevys { $count ->
            [one] { $count } gussul hedhadewder moy
            [two] { $count } gussul hedhadewder moy
            [few] { $count } hussul hedhadewder moy
            [many] { $count } gussul hedhadewder moy
           *[other] { $count } kussul hedhadewder moy
        }. Klyckya dhe { $action ->
            [close] dhegea
           *[open] igeri
        } an derivas hedhadewder.
       *[clean] Ny veu kevys torrva WCAG AA vyth. Klyckya dhe { $action ->
            [close] dhegea
           *[open] igeri
        } an derivas hedhadewder.
    }
editor-accessibility-badge = WCAG


## The footer

editor-version-title = Versyon DoenetML { $version }
editor-tab-help = Gweres herwydh an gettesten
editor-tab-help-short = Kettesten
editor-tab-errors = Gwallow
editor-tab-warnings = Gwarnyansow
editor-tab-info = Kedhlow
editor-tab-accessibility = Hedhadewder
editor-tab-responses = Gorthybow danvenys
editor-tab-with-count = { $label }: { $count }
editor-options = Dewisyow an editor
editor-format-as-doenetml = Furvya avel DoenetML
editor-format-as-xml = Furvya avel XML


## The diagnostics panel

editor-diagnostic-line = Linen #{ $line }
editor-no-errors = Gwall vyth
editor-no-warnings = Gwarnyans vyth
editor-no-info = Diagnostig kedhlow vyth
editor-show-info-annotations = Diskwedhes diagnostigow kedhlow y'n editor
editor-show-accessibility-annotations = Diskwedhes diagnostigow hedhadewder y'n editor
editor-accessibility-learn-more = Dyski fatell omdhog Doenet orth hedhadewder
editor-accessibility-violations-heading = Torrvaow hedhadewder ({ $standard })
editor-accessibility-other-heading = Kudynnow hedhadewder erell
editor-none-found = Travyth kevys


## Submitted responses

editor-no-responses = Gorthyp danvenys vyth hwath
editor-response-answer-id = Id an gorthyp
editor-response-response = Gorthyp
editor-response-credit = Merkyow
editor-response-submitted = Danvenys


## The context-help panel

help-placeholder = Gorra an boyntell war hanow tag, war wnas, po war { $ref } rag dokumentyans.
help-unsupported-ref-chain = Nyns yw skoodhys hwath gweres rag kevarwodhow liesrann kepar ha { $example }.
help-unresolved-ref =
    { $reason ->
        [notFound] Ny veu kevys kevarwodhyas vyth rag an kevarwodh: { $ref }.
        [multiple] Kevys lies kevarwodhyas rag an kevarwodh: { $ref }.
       *[indeterminate] Ny allas kevarwodhyas rag { $ref } bos ervirys.
    }
help-learn-about-references = Dyski a-dro dhe gevarwodhow →
help-reference-page = Folen gevarwodh →
help-suggestions-header =
    { $location ->
        [inside] A-ji dhe { $element }
       *[top] Orth an nivel ughella
    }{ $allowed ->
        [none] { " — ny yll travyth mos omma." }
        [text] { " — skrifa tekst omma." }
        [text-and-components] { " — skrifa tekst omma, po assaya:" }
       *[components] { " — taklow dhe assaya:" }
    }
help-suggestions-footer = Gwaska { $shortcut } dhe weles oll an { $total } elven.
help-name-summary = { $name } — { $summary }
help-ref-is-reference =
    { $line ->
        [none] { $ref } yw kevarwodh dhe { $target }.
       *[other] { $ref } yw kevarwodh dhe { $target } (linen { $line }).
    }
help-ref-derived-from =
    { $line ->
        [none] Kynsa gorrys gans { $owner } avel { $role }.
       *[other] Kynsa gorrys gans { $owner } war linen { $line } avel { $role }.
    }
help-property-is-reference =
    { $line ->
        [none] { $ref } yw kevarwodh dhe wnas { $property } a { $element }.
       *[other] { $ref } yw kevarwodh dhe wnas { $property } a { $element } (linen { $line }).
    }
help-kind-attribute = gnas
help-kind-snippet = tamm
help-kind-array-entry = entrans aray
help-default = Defowt:
help-active-default = Defowt bew:
help-style-number-annotation = { " " }(styleNumber { $styleNumber })
help-allowed-values =
    { $perItem ->
        [true] Gwerthow gesys (onan rag pub tra):
       *[other] Gwerthow gesys:
    }
help-suggested-values = Gwerthow profys:
help-inserts = Ynworra:
# The label carries no numeral, so nothing mutates: only the plural of
# «koordinat» is at stake, and `one` is the only category the singular fits.
help-coordinates =
    { $count ->
        [one] Koordinat:
       *[other] Koordinatys:
    }
help-type = Eghen:
help-resolved-style = Gis diskudhys (styleNumber { $styleNumber }):
help-resolved-function-names = Henwyn fonksyon diskudhys:
help-reset-list = Rol dassettya war an entrans ma:
help-added-on-input = Keworrys war an entrans ma:
help-removed-on-input = Dilewys war an entrans ma:
help-reset-overrides = { $reset } a dreus { $additional } ha { $removed }.
