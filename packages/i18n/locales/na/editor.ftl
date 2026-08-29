# Nauruan (dorerin Naoero) editor and language-server surfaces. Translated
# from `locales/en/editor.ftl`, which is the source of truth: `lint:i18n`
# rejects a key that does not exist there, and reports a key that exists there
# but not here as missing coverage.
#
# `WCAG AA`, `DoenetML`, `XML`, `styleNumber` and every attribute or element
# name are identifiers, not prose, and stay as written.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Orthography.** This file writes the **1938 reformed spelling** — the one
# the Nauruan orthography committee settled, which carries the tilde vowels
# «ã», «ẽ», «ĩ», «õ», «ũ» and the letter «ñ», and which spells the island
# «Naoero». The older missionary spelling used by Delaporte's dictionary and
# Kayser's grammar writes several of the same sounds differently, and printed
# Nauruan today is inconsistent between the two — much of it drops the
# diacritics altogether. A reviewer who prefers the older spelling should
# convert the whole file rather than mix the two systems; a diacritic is part
# of the spelling here, not decoration.
#
# **What this seed could not establish, said plainly once.** Nauruan is
# Micronesian, and it is the family's most divergent member: a large part of
# its lexicon has no transparent cognate in Marshallese, Chuukese, Pohnpeian,
# Kosraean or Gilbertese, and published Nauruan lexical material is thin and
# hard to reach. So this seed **did not derive its vocabulary from the other
# Micronesian catalogs of this batch** (`mh`, `chk`, `pon`, `kos`, `gil`) the
# way `locales/sms` derived its from Northern Sami — a regular correspondence
# is what makes that sound, and Nauruan does not offer one. It agrees with
# those five about *structure* and disagrees with them about *method*.
#
# What it does instead: **every technical term is kept as the English word, in
# English spelling, and is marked as a loan rather than dressed up as
# Nauruan.** That is a real fact about Nauru — schooling and mathematics
# teaching there are in English, and the language already takes institutional
# loans («Repubrikin Naoero») — but it is also a confession: this seed could
# not find the Nauruan words, and respelling English by an invented loan
# phonology would have presented a guess as a fact. The **frame** is this
# file's contribution — word order, the linker, the absence of gender and
# number agreement, the variant keys — and the **lexicon** is the debt. A
# speaker replacing the nouns and verbs below is doing the work this file was
# written to make easy, and needs no permission for any of it.
#
# The only Nauruan words this seed commits to are:
#   «Naoero»      Nauru, the island and the language's home
#   «dorer»       word, speech, language («dorerin Naoero», the Nauruan
#                 language) — the source of the linker below
#   «-n» / «-in»  the construct linker joining a head noun to what follows
#                 it, as in «Repubrikin Naoero» and «dorerin Naoero». This is
#                 the one productive rule the seed applies, and it applies it
#                 only where a genitive is plainly wanted.
#   «ma»          and, with. Supported by the national anthem's «ngabena ma
#                 auwe» and by Gilbertese «ma», Nauruan's nearest neighbour —
#                 a comparative inference, not an attestation. Check it first.
# Everything else below is a loan.
#
# **No grammatical gender**, so `noun-gender` answers one token and no
# adjective in these files forks on `$gender`. **No `$role` fork** either:
# nothing here changes shape between a standalone position and a clause.
#
# **Number.** A Nauruan noun is not marked for number by a numeral in front of
# it, so a count changes nothing about the word beside it. `Intl.PluralRules`
# has no CLDR data for `na` and resolves against the runtime's default locale,
# so a `[two]`, `[few]` or `[many]` branch here would be text nothing could
# select. Where a message merely prints a count this file writes **one
# unselected form**, as `locales/sm` does; where English's two branches differ
# in something other than the noun's number, `one` and `*[other]` are kept so
# that no branch goes missing.
#
# **Word order: the describing word follows the noun** — «Nauru Bwiema» is the
# shape — and all five of the batch's other Micronesian catalogs put it there
# too: `mh`, `chk`, `pon`, `kos` and `gil` all write `{ $noun }` ahead of
# `{ $description }`, as `ch`, `sm` and `to` already did. That is the batch
# agreement this catalog joins, and it is the one thing here that was checked
# against the siblings rather than inferred. Gilbertese writes a linker «ae»
# between the two; this file writes none, because nothing establishes that
# Nauruan wants one — a reviewer who knows otherwise should add it in
# `style-with-noun`, `style-filled-with-noun` and `style-fill` together.
#
# **Where this catalog deliberately parts company with its five siblings.**
# Those five write their own lexicons — «Ejim̧we», «Pwaye», «Te kairua» — and
# this one does not, and the difference is evidence rather than effort.
# Marshallese, Chuukese, Pohnpeian, Kosraean and Gilbertese each have a
# published dictionary this seed could lean on; Nauruan's are a 1907
# Nauruan-German dictionary and a 1936 grammar, and what this seed could
# actually reach of them is a handful of words. A file that matched the
# siblings word for word would be matching their *appearance*. So the divide
# runs down the middle of this batch on purpose, and it is a divide about what
# was knowable.
#
# **The same lexical debt as `diagnostics.ftl`**: the panel's prose stands in
# English loans with its placeables and its `$status`, `$action`, `$location`,
# `$allowed`, `$reason` and `$perItem` keys intact. `editor-accessibility-title`
# and `editor-accessibility-label` nest their `$action` select inside each
# `$status` branch exactly as English does, so a rewrite that moves the verb
# elsewhere in the sentence has somewhere to move it to.
#
# `help-coordinates` keeps `one` and `*[other]`: it never prints a count, it
# picks a heading, and that is a distinction a rewrite may want even though
# Nauruan does not mark a counted noun.

## The viewer's controls

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
