# Palauan (a tekoi er a Belau) editor surfaces: the authoring UI around the
# document — the toolbar, the variant picker, the diagnostics panel and the
# context help. Translated from `locales/en/editor.ftl`, which is the source of
# truth: `lint:i18n` rejects a key that does not exist there, and reports a key
# that exists there but not here as missing coverage.
#
# Element names, attribute names, `styleNumber`, `WCAG AA`, keyboard shortcuts
# and version numbers are identifiers rather than prose and stay as written.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Palauan is Austronesian but it is not Oceanic.** Every other catalog of
# this batch — `sm`, `to`, `fj`, `ch`, `mh`, `chk`, `pon`, `kos`, `gil`, `na`,
# `tpi` and the rest — sits inside the Oceanic subgroup or creolizes from it.
# Palauan does not: it hangs off a different primary branch of Malayo-Polynesian
# (Western Malayo-Polynesian in the older arrangement; a first-order branch of
# its own in the newer ones), and Palau is the batch's westernmost member. So
# **nothing here was inferred from the Micronesian catalogs.** A word that looks
# like Marshallese or Chuukese or Gilbertese would be a coincidence or a shared
# loan, not a cognate, and this seed refused to reason from one to the other.
# What Palauan shares with those files is the DoenetML frame, and nothing else.
#
# **Orthography.** This file writes the **modern standard Palauan
# orthography** — the spelling settled by the Palau Orthography Committee and
# used in Josephs's *Palauan–English Dictionary* and *New Palauan–English
# Dictionary*, in the Palauan Bible revisions and in official Palauan print.
# Its conventions that matter for reading this file:
#   «ch»   the glottal stop, not an affricate and not [tʃ] — «chad» is
#          [ʔað], "person"
#   «ng»   the velar nasal, one letter, and it occurs word-initially
#          («ngar», «ng») as freely as it does medially
#   «e»    both the full mid vowel and the reduced vowel [ə]; the spelling
#          does not distinguish them, and this file does not try to
#   «ei»    the long/diphthongal vowel, written as the digraph, never «ē»
# There are **no diacritics**: nothing in Palauan spelling is decoration that
# may be dropped, because there is nothing to drop. A reviewer who prefers the
# older missionary or Japanese-era spellings — which wrote the glottal stop
# with an apostrophe or left it out entirely — should convert a whole file
# rather than mix the two systems.
#
# **Word order, and the one place this catalog disagrees with the batch.**
# A Palauan modifier **precedes** the noun and is joined to it by the linker
# **«el»**: «a beches el mlai», a new car; «a klou el blai», a big house. Every
# Oceanic catalog of this batch puts the describing word *after* the noun and
# `sm`, `to`, `ch`, `mh`, `chk`, `pon`, `kos`, `gil` and `na` all write
# `{ $noun }` ahead of `{ $description }` on that ground. **This file writes
# the description first and links it with «el»**, and the disagreement is the
# point: it is the visible consequence of Palauan not being Oceanic. It is also
# the single change a reviewer is most likely to keep.
#
# **The noun marker «a» is deliberately absent, and that is a recorded gap.**
# Nearly every Palauan noun phrase in a running sentence is introduced by «a».
# The style pipeline does not hand this catalog whole sentences — it hands it
# fragments that the code composes, and a message here cannot see whether its
# fragment is about to land after another «a» or at the head of a clause. So
# no message below prefixes «a», and every noun in the `noun` table stands
# bare. A reviewer who decides the article belongs should add it in one place
# and in all of them together — `noun`, `style-with-noun`,
# `style-filled-with-noun`, `style-fill`, `style-border-clause` — rather than
# one message at a time.
#
# **Human versus non-human agreement, checked and found not to apply.**
# Palauan really does mark a human/non-human distinction: the plural prefix
# «re-» is for humans («rechad», people), the numeral series and the
# classifiers fork on it, and existential and possessive constructions choose
# «tir» over «ngii» for human referents. That is the nearest thing in this
# batch to a `$gender` agreement, so it was checked message by message rather
# than waved away. **No style adjective in `content.ftl` varies.** The things
# these adjectives describe are lines, rays, curves, polygons, points, markers,
# borders, fills, text and backgrounds; not one of them is ever a person, so
# the human branch of the distinction is unreachable from this catalog and a
# `$gender` select here would be a fork nothing could ever take. `noun-gender`
# therefore answers **one token, `non-human`** — informative rather than
# `neuter`, and safe because no select in these files matches on it. A reviewer
# who finds a message this seed misjudged should add the `human` token and the
# select together; adding either alone does nothing.
#
# **Numerals: two series and classifiers, and this catalog can use neither.**
# Palauan counts with two numeral series — a general one («tang, erung, edei,
# euang, eim, elolem, euid, eai, etiu, truich», as far as this seed can attest,
# which a reviewer should check spelling by spelling) and a human one built on
# «ta'r chad» — and chooses a classifier by the kind of thing being counted.
# A count reaches this catalog as `{ $count }`, already formatted by
# `Intl.NumberFormat` into digits, with nothing that says what is being counted
# and no way to select a series. So **every count below is left as a bare
# numeral with no counting word attached.** That is a gap this file is
# recording, not a claim about how Palauan counts; a reviewer restoring the
# counting words will have to do it per message, because only the message knows
# what its noun is.
#
# **Number.** A Palauan noun is not marked for number by a numeral in front of
# it, and «re-» marks human plurals only — none of which occur here. So a count
# changes nothing about the word beside it. `Intl.PluralRules` has no CLDR data
# for `pau` and resolves against the runtime's default locale, so a `[two]`,
# `[few]` or `[many]` branch would be text nothing could select; none is
# written. Where English's two branches differ only in the number of the noun,
# this file writes **one unselected form**, as `locales/sm` does. Where they
# differ in something else — a verb, a whole clause — `one` and `*[other]` are
# both kept so that no branch goes missing.
#
# **No `$role` fork.** Palauan does not inflect a word for case, and nothing
# here changes shape between a standalone position and a clause, so every
# `$role` value is answered by the same text.
#
# **The Palauan words this seed commits to.** Everything else below is an
# English loan, kept in English spelling and marked as a loan rather than
# dressed up as Palauan:
#   «a»       the noun marker — described above, and deliberately not written
#   «el»      the linker joining a modifier to the noun it describes, and the
#             backbone of this catalog's word order
#   «er»      the general oblique preposition: in, at, on, of, from
#   «me»      and; «me a» before a noun phrase, which is what the "with"
#             clauses below open with
#   «diak»    not, there is none — the negator, and the honest word for a
#             quantity that is absent
#   «tekoi»   word, speech, language («a tekoi er a Belau», the Palauan
#             language)
#   «Belau»   Palau
#   «chad», «rechad»   person, people — cited here for the «re-» prefix, not
#             used in any message
#   «klou»    big;  «kekere»  small
#   «beches»  new;  «ungil»  good;  «mekngit»  bad
# These are common, well attested words and the seed is confident of them. It
# is **not** confident of a Palauan technical vocabulary — the words for a graph
# or a matrix or a function, a vector, a parabola, a polygon — and did not
# invent one. (`content.ftl`'s style tables are the exception: its colour,
# width and shape words are attested basic vocabulary, sourced word by word in
# that file's header. No message in this file uses them.) Respelling English by a guessed loan phonology would have
# presented a guess as a fact, which is the one thing this batch forbids. The
# **frame** is this file's contribution — the word order, the linker, the
# absent article, the agreement that was checked and found not to fire, the
# variant keys — and the **lexicon** is the debt. English is official in Palau
# and schooling and mathematics teaching there are in English, so a loan is not
# an absurd thing to see on a Palauan screen; it is still a debt. A speaker
# replacing the nouns and verbs below is doing the work this file was written
# to make easy, and needs no permission for any of it.
#
# **This file carries the same debt `diagnostics.ftl` does.** The editor's
# surfaces are whole sentences about a language whose own vocabulary is
# English — `styleNumber`, an attribute, a variant — and a Palauan sentence
# built around those loans would be an English sentence wearing a linker. So
# the prose stands in English, with every placeable, every `$action` and
# `$state` variant key and every `[one]`/`*[other]` pair already in place, and
# is labelled as the debt it is. A speaker rewriting the sentences around them
# changes nothing structural.
#
# The audience is a second reason to leave it: this is the authoring UI, and
# authoring in Palau today is done in English. That makes an English editor
# less wrong than an English reader-facing viewer, not right.

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
