# Marshallese (Kajin M̧ajeļ) editor and language-server surfaces: the footer,
# the diagnostics panel, the variant picker, the accessibility button and the
# context-help panel. Selected by `uiLocale`. Translated from
# `locales/en/editor.ftl`, which is the source of truth: `lint:i18n` rejects a
# key that does not exist there, and reports a key that exists there but not
# here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Orthography, gender, number and word order are as `chrome.ftl` sets them
# out: the standard "new" spelling, with `ļ`, `ņ`, `m̧`, `n̄` and `o̧` as
# letters rather than as accents that may be dropped; **no grammatical
# gender**, so nothing forks on `$gender`; **no number marked on a noun after
# a numeral**, so nothing here writes a plural branch; a describing word
# **after** the noun. The `noun` table in `content.ftl` is canonical for
# vocabulary and this file follows it.
#
# ## The two counted messages, and why they do not select
#
# `editor-accessibility-label` and `help-coordinates` are the only messages
# here that English forks on a count, and both forks are English morphology:
# "1 violation" against "2 violations", "Coordinate:" against "Coordinates:".
# A Marshallese noun is the same word after any numeral — «juon bōd» and
# «jiljino bōd» — so both are written as **one unselected form** that still
# prints `{ $count }` where English does. `Intl.PluralRules("mh")` has no CLDR
# data and resolves against the runtime's default locale, so a `[one]` branch
# here would be a branch nothing could reliably select, and a `[two]`, `[few]`
# or `[many]` one would be text nothing could ever reach. This is the
# `locales/sm` shape and the shape the batch's four other Micronesian
# catalogs — `chk`, `pon`, `kos`, `gil` — take for the same reason.
#
# Marshallese distinguishes inclusive from exclusive first person
# («jej»/«kōmij»), and **no message in the English catalog says "we"**, which
# was checked rather than assumed. Every sentence here is impersonal or
# addressed to «kwe», so the distinction never arises.
#
# ## What stays in English
#
# `WCAG AA` is the name of a standard and stays, as
# `accessibility-heading-level-1` already leaves it in `chrome.ftl`.
# `DoenetML`, `XML`, `styleNumber`, `Answer Id`, and every attribute and
# element name are DoenetML source and stay exactly as written. Beyond those,
# the **terms of art of the editing language** — `variant`, `component`,
# `attribute`, `reference`, `property`, `type`, `default`, `cursor`, `style`,
# `array`, `snippet` — are kept in English inside Marshallese sentences, for
# the reason `diagnostics.ftl`'s header gives at length: the documentation an
# author would read next exists only in English, and a coinage here is a word
# they would have to un-learn. A reviewer is free to disagree; the sentences
# around them are ordinary Marshallese and can carry a native word wherever
# one is preferred.
#
# ## Coinages, and the one shared across all four files
#
#   «maro̧n̄ in tōpar»     accessibility, "the ability to reach". The same
#                          coinage `chrome.ftl` and `diagnostics.ftl` use;
#                          changing it means one pass across three files.
#   «jikin jeje»          the editor, "the place of writing"
#   «jikin alwōj»         the viewer, "the place of looking"
#   «Kōkāāl»              Update, literally "renew"
#   «Bar Likūt»           Reset, literally "put back"
#   «Kāātet»              Filter, literally "to sift"
#   «kakapilōk»           advice, for the accessibility recommendations
#
# «meļeļe» is doing more than one job across these four files — information
# here and in `chrome.ftl`, meaning in `content.ftl`'s `section-name` table,
# and the root of «kōmeļeļe», the word `diagnostics.ftl` uses for a
# description. A speaker may want three words rather than one root; that is
# disclosed in `content.ftl` and is a four-file change rather than a local
# one.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Bar Likūt
       *[update] Kōkāāl
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } Jikin Alwōj
       *[other] { $word } Jikin Alwōj { $shortcut }
    }


## The variant picker

editor-variant = Variant
editor-variant-filter = Kāātet...
editor-variant-next = Kālet variant eo tok juon
editor-variant-previous = Kālet variant eo m̧okta


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] Em̧ōj lo juon bōd n̄ae WCAG AA kōn maro̧n̄ in tōpar. Kilik n̄an { $action ->
            [close] kiil
           *[open] kapeļļo̧k
        } ripoot in maro̧n̄ in tōpar.
        [advisories] Kilik n̄an { $action ->
            [close] kiil
           *[open] kapeļļo̧k
        } ripoot in maro̧n̄ in tōpar. Ejjeļo̧k bōd n̄ae WCAG AA em̧ōj loe, ak ewōr bar jet naan in kakapilōk kōn maro̧n̄ in tōpar.
       *[clean] Kilik n̄an { $action ->
            [close] kiil
           *[open] kapeļļo̧k
        } ripoot in maro̧n̄ in tōpar. Ejjeļo̧k apan̄ kōn maro̧n̄ in tōpar em̧ōj loe.
    }

# The count is printed and the noun beside it does not move, so this writes
# one form where English writes two.
editor-accessibility-label =
    { $status ->
        [violations] Em̧ōj lo juon bōd n̄ae WCAG AA kōn maro̧n̄ in tōpar. Em̧ōj lo { $count } bōd n̄ae WCAG AA. Kilik n̄an { $action ->
            [close] kiil
           *[open] kapeļļo̧k
        } ripoot in maro̧n̄ in tōpar.
        [advisories] Ejjeļo̧k bōd n̄ae WCAG AA em̧ōj loe. Em̧ōj lo { $count } naan in kakapilōk kōn maro̧n̄ in tōpar. Kilik n̄an { $action ->
            [close] kiil
           *[open] kapeļļo̧k
        } ripoot in maro̧n̄ in tōpar.
       *[clean] Ejjeļo̧k bōd n̄ae WCAG AA em̧ōj loe. Kilik n̄an { $action ->
            [close] kiil
           *[open] kapeļļo̧k
        } ripoot in maro̧n̄ in tōpar.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML version { $version }

editor-tab-help = Jipan̄ ekkar n̄an jikin eo
editor-tab-help-short = Jikin
editor-tab-errors = Bōd
editor-tab-warnings = Kakkōl
editor-tab-info = Meļeļe
editor-tab-accessibility = Maro̧n̄ in tōpar
editor-tab-responses = Uwaak ko em̧ōj jilkinļo̧ki

editor-tab-with-count = { $label }: { $count }

editor-options = Kāālōt ko n̄an jikin jeje
editor-format-as-doenetml = Kōkarōk āinwōt DoenetML
editor-format-as-xml = Kōkarōk āinwōt XML


## The diagnostics panel

editor-diagnostic-line = Laajrak #{ $line }

editor-no-errors = Ejjeļo̧k Bōd
editor-no-warnings = Ejjeļo̧k Kakkōl
editor-no-info = Ejjeļo̧k Meļeļe

editor-show-info-annotations = Kwaļo̧k meļeļe ko ilo jikin jeje eo
editor-show-accessibility-annotations = Kwaļo̧k kakōļļe in maro̧n̄ in tōpar ilo jikin jeje eo

editor-accessibility-learn-more = Katak kōn wāween an Doenet lale maro̧n̄ in tōpar

editor-accessibility-violations-heading = Bōd ko n̄ae maro̧n̄ in tōpar ({ $standard })

editor-accessibility-other-heading = Bar jet apan̄ kōn maro̧n̄ in tōpar
editor-none-found = Ejjeļo̧k em̧ōj loe


## Submitted responses

editor-no-responses = Ejjan̄in wōr uwaak em̧ōj jilkinļo̧ki
editor-response-answer-id = Answer Id
editor-response-response = Uwaak
editor-response-credit = Tōprak
editor-response-submitted = Em̧ōj jilkinļo̧ke


## The context-help panel

help-placeholder = Likūt cursor eo ioon etan juon tag, juon attribute, ak { $ref } n̄an meļeļe ko.

help-unsupported-ref-chain = Ejjan̄in wōr jipan̄ n̄an reference ko elōn̄ m̧ōttaer āinwōt { $example }.

help-unresolved-ref =
    { $reason ->
        [notFound] Ejjeļo̧k men em̧ōj loe n̄an reference eo: { $ref }.
        [multiple] Elōn̄ men em̧ōj loi n̄an reference eo: { $ref }.
       *[indeterminate] Ejjab maro̧n̄ alikkar ta eo { $ref } ej jitōn̄ n̄ane.
    }

help-learn-about-references = Katak kōn reference ko →
help-reference-page = Peij in reference →

help-suggestions-header =
    { $location ->
        [inside] Ilowaan { $element }
       *[top] Ilo okran peba eo
    }{ $allowed ->
        [none] { " — ejjeļo̧k men ej pād ije." }
        [text] { " — je naan ije." }
        [text-and-components] { " — je naan ije, ak kajjio̧n̄ kein:" }
       *[components] { " — men ko kwōmaro̧n̄ kajjio̧n̄i:" }
    }

help-suggestions-footer = Kalikūt { $shortcut } n̄an lale aolep { $total } component.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } ej juon reference n̄an { $target }.
       *[other] { $ref } ej juon reference n̄an { $target } (laajrak { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] Em̧ōj kadeļo̧n̄e jān { $owner } āinwōt { $role }.
       *[other] Em̧ōj kadeļo̧n̄e jān { $owner } ilo laajrak { $line } āinwōt { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } ej juon reference n̄an property eo { $property } an { $element }.
       *[other] { $ref } ej juon reference n̄an property eo { $property } an { $element } (laajrak { $line }).
    }

help-kind-attribute = attribute
help-kind-snippet = m̧ōttan jeje
help-kind-array-entry = m̧ōttan array

help-default = Default:
help-active-default = Default eo ej jerbal:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Value ko rej maro̧n̄ (juon n̄an kajjojo men):
       *[other] Value ko rej maro̧n̄:
    }

help-suggested-values = Value ko remaro̧n̄ em̧m̧an:

help-inserts = Ej kadeļo̧n̄:

# One form: «coordinate» does not change after a count, and nothing else in
# the English pair differs.
help-coordinates = Coordinate:

help-type = Type:

help-resolved-style = Style eo em̧ōj kāālōte (styleNumber { $styleNumber }):

help-resolved-function-names = Etan function ko em̧ōj kāālōti:
help-reset-list = Bar likūt list eo ioon input in:
help-added-on-input = Em̧ōj kobaik ioon input in:
help-removed-on-input = Em̧ōj joļo̧k ioon input in:

help-reset-overrides = { $reset } ej bōk jikin { $additional } im { $removed }.
