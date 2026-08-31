# Manx (Gaelg) editor and language-server surfaces. Translated from
# `locales/en/editor.ftl`, which is the source of truth: `lint:i18n` rejects a
# key that does not exist there, and reports a key that exists there but not
# here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Script: Latin, traditional Manx orthography** (Cregeen, Kelly), as in every
# file of this catalog. Digits are Latin, as `src/intl.ts` pins for every
# locale.
#
# **Manx and borrowed.** The frame is Manx — «ta» / «cha nel», «cha nod» for
# *cannot*, «shegin da» for *must*, «as» for *and*, «ny» for *or*, «my» for
# *if*, «jeh» for *of*, «er» for *on*, «dy» + verbal noun for a purpose clause
# («crig dy osley yn coontey»), and the verbal noun on every button. The
# markup vocabulary is **English, declared**: `attribute`, `component`,
# `element`, `reference`, `input`, `array`, `tag`, `editor`, `WCAG`,
# `styleNumber` and every DoenetML identifier stay as written, because Manx
# terminology work has not reached XML markup. Manx carries the rest:
# «marranyssyn», «raaueyn», «fysseree», «roshtynys», «bree» for a *value*,
# «sorch» for a *type*, «rolley» for a *list*, «cadjin» for a *default*.
#
# **Counts.** Manx's CLDR rules select only `one` (n mod 10 = 1: 1, 11, 21, …),
# `two` (n mod 10 = 2: 2, 12, 22, …), `few` (n mod 100 = 0, 20, 40, 60, 80) and
# `other` for integers; `many` is declared but belongs to counts written with
# a visible decimal fraction, which none here are, so **there is no `[many]`
# branch anywhere in this catalog**. See `chrome.ftl`.
#
# `editor-accessibility-label` is the only message here that forks. It counts
# violations with «brishey» and recommendations with «coyrle», and «un» and
# «daa» lenite both — b→v and c→ch — while «feed» and «tree» do not. So `one`
# and `two` carry «vrishey» / «choyrle» and `few` and `other` the radical.
#
# `help-coordinates` does **not** fork. It prints no numeral, so the only
# distinction available would be singular against plural — and Manx's `one`
# catches 11 and 21 as well as 1, which would put a list of eleven coordinates
# into the singular. One form is the correct answer, not a shortcut.
#
# **Weakest first.** «roshtynys» for *accessibility*, «chymmylt» for *context*,
# «reaghit» for *resolved* and «moyllit» for *suggested* are formations rather
# than dictionary entries, and the English markup nouns are the obvious place
# for a speaker with Culture Vannin's word lists to start.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Aa-reaghey
       *[update] Noaghey
    }
editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } yn jeeagheyder
       *[other] { $word } yn jeeagheyder { $shortcut }
    }


## The variant picker

editor-variant = Caghlaa
editor-variant-filter = Sheeley…
editor-variant-next = Reih yn nah chaghlaa
editor-variant-previous = Reih yn chaghlaa roie


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] Brishey roshtynys WCAG AA feddynit. Crig dy { $action ->
            [close] yeigh
           *[open] osley
        } yn coontey roshtynys.
        [advisories] Crig dy { $action ->
            [close] yeigh
           *[open] osley
        } yn coontey roshtynys. Cha row brishey WCAG AA erbee feddynit, agh ta tooilley coyrlyn roshtynys ry-gheddyn.
       *[clean] Crig dy { $action ->
            [close] yeigh
           *[open] osley
        } yn coontey roshtynys. Cha row doilleeid roshtynys erbee feddynit.
    }
editor-accessibility-label =
    { $status ->
        [violations] Brishey roshtynys WCAG AA feddynit. Feddynit { $count ->
            [one] { $count } vrishey WCAG AA
            [two] { $count } vrishey WCAG AA
           *[other] { $count } brishey WCAG AA
        }. Crig dy { $action ->
            [close] yeigh
           *[open] osley
        } yn coontey roshtynys.
        [advisories] Cha row brishey WCAG AA erbee feddynit. Feddynit { $count ->
            [one] { $count } choyrle roshtynys elley
            [two] { $count } choyrle roshtynys elley
           *[other] { $count } coyrle roshtynys elley
        }. Crig dy { $action ->
            [close] yeigh
           *[open] osley
        } yn coontey roshtynys.
       *[clean] Cha row brishey WCAG AA erbee feddynit. Crig dy { $action ->
            [close] yeigh
           *[open] osley
        } yn coontey roshtynys.
    }
editor-accessibility-badge = WCAG


## The footer

editor-version-title = Lhieggan DoenetML { $version }
editor-tab-help = Cooney rere yn chymmylt
editor-tab-help-short = Chymmylt
editor-tab-errors = Marranyssyn
editor-tab-warnings = Raaueyn
editor-tab-info = Fysseree
editor-tab-accessibility = Roshtynys
editor-tab-responses = Ansooryn currit stiagh
editor-tab-with-count = { $label }: { $count }
editor-options = Reihyssyn yn editor
editor-format-as-doenetml = Cummey myr DoenetML
editor-format-as-xml = Cummey myr XML


## The diagnostics panel

editor-diagnostic-line = Linney #{ $line }
editor-no-errors = Marranys erbee
editor-no-warnings = Raaue erbee
editor-no-info = Diagnostagh fysseree erbee
editor-show-info-annotations = Soilshaghey diagnostee fysseree ayns yn editor
editor-show-accessibility-annotations = Soilshaghey diagnostee roshtynys ayns yn editor
editor-accessibility-learn-more = Ynsee kys ta Doenet gobbraghey er roshtynys
editor-accessibility-violations-heading = Brishaghyn roshtynys ({ $standard })
editor-accessibility-other-heading = Doilleeidyn roshtynys elley
editor-none-found = Cha row veg feddynit


## Submitted responses

editor-no-responses = Cha nel ansoor currit stiagh foast
editor-response-answer-id = Id yn ansoor
editor-response-response = Ansoor
editor-response-credit = Markyn
editor-response-submitted = Currit stiagh


## The context-help panel

help-placeholder = Cur yn cursor er ennym tag, er attribute, ny er { $ref } son docamadys.
help-unsupported-ref-chain = Cha nel cooney son reference ymmodee-ayrn myr { $example } ry-gheddyn foast.
help-unresolved-ref =
    { $reason ->
        [notFound] Cha row nhee erbee feddynit son y reference: { $ref }.
        [multiple] Va ymmodee nheeghyn feddynit son y reference: { $ref }.
       *[indeterminate] Cha row nhee son { $ref } abyl dy ve reaghit.
    }
help-learn-about-references = Ynsee mychione reference →
help-reference-page = Duillag reference →
help-suggestions-header =
    { $location ->
        [inside] Cheu-sthie jeh { $element }
       *[top] Ec y vullagh
    }{ $allowed ->
        [none] { " — cha nel nhee erbee goll ayns shoh." }
        [text] { " — screeu teks ayns shoh." }
        [text-and-components] { " — screeu teks ayns shoh, ny prow:" }
       *[components] { " — nheeghyn dy phrowal:" }
    }
help-suggestions-footer = Broie { $shortcut } dy akin ooilley ny { $total } component.
help-name-summary = { $name } — { $summary }
help-ref-is-reference =
    { $line ->
        [none] Ta { $ref } ny reference da { $target }.
       *[other] Ta { $ref } ny reference da { $target } (linney { $line }).
    }
help-ref-derived-from =
    { $line ->
        [none] Currit stiagh liorish { $owner } myr { $role }.
       *[other] Currit stiagh liorish { $owner } er linney { $line } myr { $role }.
    }
help-property-is-reference =
    { $line ->
        [none] Ta { $ref } ny reference da'n cliaghtey { $property } jeh { $element }.
       *[other] Ta { $ref } ny reference da'n cliaghtey { $property } jeh { $element } (linney { $line }).
    }
help-kind-attribute = attribute
help-kind-snippet = peesh
help-kind-array-entry = entreilys array
help-default = Cadjin:
help-active-default = Cadjin bio:
help-style-number-annotation = { " " }(styleNumber { $styleNumber })
help-allowed-values =
    { $perItem ->
        [true] Breeyn lowit (unnane son dagh nhee):
       *[other] Breeyn lowit:
    }
help-suggested-values = Breeyn moyllit:
# No numeral is printed, so a `[one]` branch would catch 11 and 21 coordinates
# as well as 1 and put them in the singular. One form is written instead.
help-coordinates = Co-ordnaidyn:
help-inserts = Cur stiagh:
help-type = Sorch:
help-resolved-style = Aght reaghit (styleNumber { $styleNumber }):
help-resolved-function-names = Enmyn funshoon reaghit:
help-reset-list = Rolley aa-reaghey er yn input shoh:
help-added-on-input = Currit rish er yn input shoh:
help-removed-on-input = Scughit er yn input shoh:
help-reset-overrides = Ta { $reset } goll harrish { $additional } as { $removed }.
