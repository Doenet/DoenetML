# Rotuman (Fäeag Rotuạm) editor and language-server surfaces: the footer, the
# diagnostics panel, the variant picker, the accessibility button and the
# context-help panel beside them. Selected by `uiLocale`.
#
# `WCAG AA` is the name of a standard and is not translated. Element names,
# attribute names and `styleNumber` are DoenetML identifiers and stay as
# written.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Where Rotuman sits.** Rotuman is **Oceanic, and an isolate within
# Oceanic**: it is not Polynesian, and it is not Fijian. Centuries of contact
# with Tonga, Sāmoa and Futuna have left a heavy Polynesian layer on top of it,
# which is exactly what makes it dangerous to seed — a word that looks
# Polynesian may be a loan, a chance resemblance, or nothing at all. So this
# file **does not assume cognates with the Polynesian catalogs of this batch**
# (`sm`, `to`, `niu`, `tkl`, `tvl`, `wls`, `rar`, `ty`, `mi`, `haw`): where it
# writes a Rotuman word it writes one it could support on its own, and where it
# could not it writes the English word and says so below.
#
# `locales/fj` (Fijian) is the **nearest existing catalog geographically** —
# Rotuma is part of Fiji, and Rotuman children meet Fijian in school — but
# Fijian is a different branch of Oceanic. Anything this file has in common
# with `locales/fj` is typological or areal, never inherited, and no word here
# was taken from it.
#
# **Orthography.** This file writes the **Churchward orthography**, the one
# used by the 1940 grammar and dictionary and by printed Rotuman since: the
# diacritic letters «ä», «å», «ạ», «ẹ», «ọ» and «ụ» are **part of the
# spelling**, not decoration, and the glottal stop is written with an
# apostrophe («noa'ia», «Rotuạm»). A reviewer who strips the diacritics is
# writing a different orthography, not a simplified one, and should convert the
# whole catalog rather than one message.
#
# **Metathesis: the one thing this seed is most likely to have got wrong.**
# Nearly every Rotuman word has two phases — a **complete** phase and an
# **incomplete** phase formed from it by metathesis and vowel change («hosa» /
# «hoas», «fupa» / «fuap») — and which of the two appears is **grammatically
# determined**, not stylistic: broadly, the complete phase stands before the
# definite article and before what is suffixed to it, and the incomplete phase
# stands where the word is indefinite or ends its phrase.
#
# **This file writes the complete (citation) phase in every position**, because
# that is the form a dictionary gives and the only one this seed could derive
# reliably. That is certainly wrong in some of these positions — a bare button
# label naming an indefinite thing wants the incomplete phase — and a reviewer
# should check the phase of **every Rotuman word below before checking anything
# else about it**. The choice is uniform on purpose: one systematic error is
# findable where a scatter of guesses is not.
#
# **Lexicon: what this seed commits to, and what it does not.** Rotuman's
# published lexical material is a single grammar-and-dictionary tradition, and
# it has no settled vocabulary for graphs, functions, colour names in a
# rendering pipeline, or the DoenetML machinery these files talk about. Rather
# than dress English up in Rotuman shape, this catalog **keeps the technical
# vocabulary as the English word** and marks it as a loan — the `locales/na`
# method, for the same reason: the frame is this file's contribution and the
# lexicon is its debt. The Rotuman words it does commit to are:
#
#   «Rotuạm»      Rotuma; «Fäeag Rotuạm» the Rotuman language
#   «fäeag»       word, speech, language; to speak
#   «ma»          and, with — the one connective used below
#   «'e»          at, in, on
#   «ne»          of; that (the linker/relative)
#   «kepoi ka»    if — used once, in `piecewise-condition-if`, and the least
#                 certain item on this list. Check it first.
#
# Everything else in these files is English. Replacing any of it is the work
# this catalog was written to make easy, and needs no permission.
#
# **No grammatical gender.** `noun-gender` answers one token and no adjective
# in these files forks on `$gender`. **No `$role` fork** either: nothing here
# changes shape between a standalone position and a clause.
#
# **Number.** A Rotuman noun is not marked for number by a numeral in front of
# it, so a count changes nothing about the word beside it. `Intl.PluralRules`
# has no CLDR data for `rtm` and resolves against the runtime's default locale,
# so a `[two]`, `[few]` or `[many]` branch here would be text nothing could
# select — only `one`, `other` and explicit numeric literals are written.
#
# **Word order: the describing word follows the noun**, which is what «Fäeag
# Rotuạm» itself shows. `locales/fj` and the batch's Polynesian catalogs put it
# there too; that agreement is areal and typological rather than inherited, and
# it is recorded here as agreement about *shape*, not about descent.
#
# Like `diagnostics.ftl` beside it, this file is written in English loans with
# its placeables and its `$action`, `$status`, `$shortcut`, `$location`,
# `$allowed`, `$reason` and `$perItem` keys intact.
# `editor-accessibility-title` and `editor-accessibility-label` nest their
# `$action` select inside each `$status` branch exactly as English does, so a
# rewrite that moves the verb elsewhere in the sentence has somewhere to move
# it to.
#
# The plural selects are kept as English writes them, for this batch's usual
# reason: the text in them is English. `help-coordinates` keeps `one` and
# `*[other]` on its own account — it never prints a count, it picks a heading,
# and that is a distinction a rewrite may want even though a Rotuman noun does
# not move beside a numeral.

editor-update-viewer =
    { $action ->
        [reset] Reset
       *[update] Update
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } Viewer
       *[other] { $word } Viewer { $shortcut }
    }

## The variant picker

editor-variant = Variant

editor-variant-filter = Filter...

editor-variant-next = Select next variant

editor-variant-previous = Select previous variant

## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] WCAG AA accessibility violation identified. Click to { $action ->
            [close] close
           *[open] open
        } accessibility report.
        [advisories] Click to { $action ->
            [close] close
           *[open] open
        } accessibility report. No WCAG AA violations were found, but additional accessibility recommendations are available.
       *[clean] Click to { $action ->
            [close] close
           *[open] open
        } accessibility report. No accessibility issues were found.
    }

editor-accessibility-label =
    { $status ->
        [violations] WCAG AA accessibility violation identified. { $count ->
            [one] { $count } WCAG AA violation
           *[other] { $count } WCAG AA violations
        } found. Click to { $action ->
            [close] close
           *[open] open
        } accessibility report.
        [advisories] No WCAG AA violations identified. { $count ->
            [one] { $count } additional accessibility recommendation
           *[other] { $count } additional accessibility recommendations
        } found. Click to { $action ->
            [close] close
           *[open] open
        } accessibility report.
       *[clean] No WCAG AA violations identified. Click to { $action ->
            [close] close
           *[open] open
        } accessibility report.
    }

editor-accessibility-badge = WCAG

## The footer

editor-version-title = DoenetML version { $version }

editor-tab-help = Context-sensitive help
editor-tab-help-short = Context
editor-tab-errors = Errors
editor-tab-warnings = Warnings
editor-tab-info = Info
editor-tab-accessibility = Accessibility
editor-tab-responses = Submitted responses

editor-tab-with-count = { $label }: { $count }

editor-options = Editor options
editor-format-as-doenetml = Format as DoenetML
editor-format-as-xml = Format as XML

## The diagnostics panel

editor-diagnostic-line = Line #{ $line }

editor-no-errors = No Errors
editor-no-warnings = No Warnings
editor-no-info = No Info Diagnostics

editor-show-info-annotations = Show info diagnostics in editor
editor-show-accessibility-annotations = Show accessibility diagnostics in editor

editor-accessibility-learn-more = Learn how Doenet approaches accessibility

editor-accessibility-violations-heading = Accessibility violations ({ $standard })

editor-accessibility-other-heading = Other accessibility issues
editor-none-found = None found

## Submitted responses

editor-no-responses = No submitted responses yet
editor-response-answer-id = Answer Id
editor-response-response = Response
editor-response-credit = Credit
editor-response-submitted = Submitted

## The context-help panel

help-placeholder = Place cursor on a tag name, attribute, or { $ref } for documentation.

help-unsupported-ref-chain = Help for multi-part references like { $example } is not yet supported.

help-unresolved-ref =
    { $reason ->
        [notFound] No referent found for reference: { $ref }.
        [multiple] Multiple referents found for reference: { $ref }.
       *[indeterminate] A referent for { $ref } could not be determined.
    }

help-learn-about-references = Learn about references →
help-reference-page = Reference page →

help-suggestions-header =
    { $location ->
        [inside] Inside { $element }
       *[top] At the top level
    }{ $allowed ->
        [none] { " — nothing goes here." }
        [text] { " — type text here." }
        [text-and-components] { " — type text here, or try:" }
       *[components] { " — things to try:" }
    }

help-suggestions-footer = Press { $shortcut } to see all { $total } components.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } is a reference to { $target }.
       *[other] { $ref } is a reference to { $target } (line { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] Introduced by { $owner } as { $role }.
       *[other] Introduced by { $owner } on line { $line } as { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } is a reference to the { $property } property of { $element }.
       *[other] { $ref } is a reference to the { $property } property of { $element } (line { $line }).
    }

help-kind-attribute = attribute
help-kind-snippet = snippet
help-kind-array-entry = array entry

help-default = Default:
help-active-default = Active default:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Allowed values (one per item):
       *[other] Allowed values:
    }

help-suggested-values = Suggested values:

help-inserts = Inserts:

help-coordinates =
    { $count ->
        [one] Coordinate:
       *[other] Coordinates:
    }

help-type = Type:

help-resolved-style = Resolved style (styleNumber { $styleNumber }):

help-resolved-function-names = Resolved function names:
help-reset-list = Reset list on this input:
help-added-on-input = Added on this input:
help-removed-on-input = Removed on this input:

help-reset-overrides = { $reset } overrides { $additional } and { $removed }.
