# Yapese (thin nu Waqab) editor and language-server surfaces. Translated from
# `locales/en/editor.ftl`, which is the source of truth: `lint:i18n` rejects a
# key that does not exist there, and reports a key that exists there but not
# here as missing coverage.
#
# `WCAG AA`, `DoenetML`, `XML`, `styleNumber` and every attribute or element
# name are identifiers, not prose, and stay as written.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Orthography.** This file writes the **standard Yapese orthography** — the
# one settled in Jensen's grammar and Yapese–English dictionary (1977) and used
# by the Yap State Department of Education since. Two of its conventions are
# spelling and not decoration:
#
#   * the **glottal stop is the letter «q»**, which is why the island and the
#     people are «Waqab» and not «Wa'ab». It is a consonant of the language and
#     is written everywhere it is heard, including word-initially.
#   * the **underlined series «ḏ», «ḻ», «ṉ», «ṟ»** (Jensen prints a bar under
#     the letter) are letters of their own, distinct from plain «d», «l», «n»,
#     «r», and «th» and «ch» are single letters too.
#
# Printed Yapese today is inconsistent about both: much of it substitutes an
# apostrophe for «q» and drops the underlines altogether. A reviewer who
# prefers that spelling should convert the whole file rather than mix the two
# systems. Many of the words this seed commits to do contain one of the four —
# `content.ftl`'s style tables alone account for nine, which its header names
# one by one — and the edition of Jensen they were quoted from prints no
# underline anywhere, so the plain letter is written throughout. That is a
# known and findable error rather than a claim, and a reviewer replacing the
# loans below will need all four letters.
#
# **Yapese is Oceanic but it is not Micronesian in the narrow sense.** Yap is a
# state of the Federated States of Micronesia, and this batch seeds catalogs
# for its neighbours — `mh`, `chk`, `pon`, `kos`, `gil` — but Yapese is not a
# Nuclear Micronesian language: its position inside Oceanic is disputed and it
# is best treated as an isolate branch, and its lexicon is unlike its
# neighbours' word for word. **So no form here was borrowed from those
# catalogs**, and none should be. Sharing a flag is not a sound correspondence.
# That is the method `locales/sms` used from Northern Sami running the other
# way, and it is the same refusal `locales/na` makes for Nauruan — this file
# agrees with `locales/na` about method and shares none of its vocabulary.
#
# **What this seed could not establish, said plainly once.** Published Yapese
# lexical material is thin and hard to reach, and this seed could not find
# Yapese words for the technical vocabulary these catalogs are made of. So
# **every technical term below is kept as the English word, in English
# spelling, and is a loan rather than a translation.** That is a real fact
# about Yap — schooling, and mathematics teaching in particular, are in
# English — but it is also a confession, and respelling English by an invented
# loan phonology would have presented a guess as a fact. The **frame** is this
# file's contribution — word order, the linker, the absence of gender and of
# number agreement, the variant keys — and the **lexicon** is the debt. A
# speaker replacing the nouns and verbs below is doing the work this file was
# written to make easy, and needs no permission for any of it.
#
# The only Yapese words this seed commits to are:
#   «Waqab»    Yap, the island group and the language's home
#   «thin»     word, speech, language — «thin nu Waqab», the Yapese language
#   «nu»       of, from (as in «thin nu Waqab»)
#   «e»        the common-noun determiner, the commonest word in Yapese text
#   «ni»       the linker that joins a head noun to the modifier or relative
#              clause following it. This is the one productive rule the seed
#              applies, and it applies it only where a modifier plainly
#              follows a noun.
#   «nge»      and, with — joining nouns and joining a phrase to what
#              accompanies it.
# Everything else below is a loan. Check «e» and «nge» first: both are frequent
# enough that a wrong choice is wrong in many places at once. (`content.ftl`'s
# style tables are the one place this seed writes more Yapese than that: its
# colour and width words and two of its shape nouns are attested basic
# vocabulary, sourced word by word in that file's header.)
#
# **Word order: the modifier follows the noun**, linked by «ni». So a style
# description is built as noun + «ni» + description — the opposite of English's
# order, and the opposite of every catalog in the Uralic batch. The `content`
# file is where that shows.
#
# **No grammatical gender.** Yapese has none, so `noun-gender` answers one
# token, and no adjective in these files forks on `$gender`. **No `$role` fork**
# either: nothing here changes shape between a standalone position and a
# clause.
#
# **Counting, and how this seed avoided it.** Yapese counts with an obligatory
# **numeral-classifier** system: a numeral is compounded with a classifier
# chosen by what is being counted (humans, long things, flat things, general
# things), and possession is marked by a second, separate set of **possessive
# classifiers**. A spelled-out Yapese numeral therefore cannot be written
# without deciding what kind of thing follows it. This seed never spells a
# numeral: every count reaches the reader as the `{ $count }` placeable, which
# Fluent renders in digits, so no classifier is ever forced and none is
# invented. A reviewer who wants spelled numerals has to supply the classifier
# with them — and cannot do it inside a placeable, which is the affix rule in
# the README.
#
# **Number.** A Yapese noun is not marked for number by a numeral in front of
# it, so a count changes nothing about the word beside it, and a single
# unselected form is right wherever English forks. `Intl.PluralRules` has no
# CLDR data for `yap` and resolves against the runtime's default locale, so a
# `[two]`, `[few]` or `[many]` branch here would be text nothing could select.
# Only `one`, `other` and explicit digit literals appear, and where English
# forks on number for grammar this file keeps the fork only because the
# English words in the branches differ.
#
# **A named debt.** The piecewise connectives — `piecewise-condition-if`,
# `-or`, `-otherwise` — are basic grammar rather than technical vocabulary, and
# are exactly where a frame contribution belongs; this seed still left them in
# English because it could not establish the Yapese conditional and
# disjunctive particles with any confidence. They are the first three lines a
# speaker should fix, and fixing them costs three lines.


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


editor-variant = Variant

editor-variant-filter = Filter...

editor-variant-next = Select next variant

editor-variant-previous = Select previous variant


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


editor-no-responses = No submitted responses yet
editor-response-answer-id = Answer Id
editor-response-response = Response
editor-response-credit = Credit
editor-response-submitted = Submitted


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
