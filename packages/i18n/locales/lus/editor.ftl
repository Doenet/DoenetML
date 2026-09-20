# Mizo (Mizo ṭawng) editor and language-server surfaces: the footer, the
# diagnostics panel, the variant picker, the accessibility button and the
# context-help panel beside them. Selected by `uiLocale`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Script: Latin**, in the 1894 Roman orthography, with the circumflex on the
# long vowels and the subscript-dotted **ṭ**, as `chrome.ftl`'s header sets out.
#
# **This is the file with the most English in it, and that is deliberate.** An
# editor is a computing surface, and Mizoram's computing vocabulary is English:
# «editor», «format», «variant», «filter», «line», «tag», «attribute»,
# «reference», «snippet», «array entry», «default», «coordinates», «type» and
# the standard's own name «WCAG AA» are what a Mizo user of an editor reads and
# says. What is translated here is the prose around them — the verbs, the
# negations, the headings — and where Mizo has a word the seed is confident of
# it is used: «thil dik lo» for an error, «vaukhânna» for a warning, «entîr»
# for show, «dahluh» for insert, «hmuh a ni lo» for none found.
#
# **No plural branches.** CLDR has no plural data for `lus`, and a Mizo noun is
# unmarked after a numeral in any case, so `editor-accessibility-label` writes
# one form and lets the count stand beside it, and `help-coordinates` drops
# the count English selects on and writes one form outright.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Let
       *[update] Thar
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] Viewer { $word }
       *[other] Viewer { $word } { $shortcut }
    }


## The variant picker

editor-variant = Variant

editor-variant-filter = Thliar...

editor-variant-next = Variant dawt thlang

editor-variant-previous = Variant hmasa thlang


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] WCAG AA accessibility bawhchhiatna hmuh a ni. Accessibility report { $action ->
            [close] khâr
           *[open] hawn
        } tûrin click rawh.
        [advisories] Accessibility report { $action ->
            [close] khâr
           *[open] hawn
        } tûrin click rawh. WCAG AA bawhchhiatna hmuh a ni lo, mahse accessibility ngaihdân belhchhah a awm.
       *[clean] Accessibility report { $action ->
            [close] khâr
           *[open] hawn
        } tûrin click rawh. Accessibility harsatna engmah hmuh a ni lo.
    }

editor-accessibility-label =
    { $status ->
        [violations] WCAG AA accessibility bawhchhiatna hmuh a ni. WCAG AA bawhchhiatna { $count } hmuh a ni. Accessibility report { $action ->
            [close] khâr
           *[open] hawn
        } tûrin click rawh.
        [advisories] WCAG AA bawhchhiatna hmuh a ni lo. Accessibility ngaihdân belhchhah { $count } hmuh a ni. Accessibility report { $action ->
            [close] khâr
           *[open] hawn
        } tûrin click rawh.
       *[clean] WCAG AA bawhchhiatna hmuh a ni lo. Accessibility report { $action ->
            [close] khâr
           *[open] hawn
        } tûrin click rawh.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML version { $version }

editor-tab-help = Hmun mila ṭanpuina
editor-tab-help-short = Hmun
editor-tab-errors = Thil Dik Lo
editor-tab-warnings = Vaukhânna
editor-tab-info = Thu
editor-tab-accessibility = Accessibility
editor-tab-responses = Chhânna thawn tawhte

editor-tab-with-count = { $label }: { $count }

editor-options = Editor thlan theihte
editor-format-as-doenetml = DoenetML angin format rawh
editor-format-as-xml = XML angin format rawh


## The diagnostics panel

editor-diagnostic-line = Line #{ $line }

editor-no-errors = Thil Dik Lo A Awm Lo
editor-no-warnings = Vaukhânna A Awm Lo
editor-no-info = Info Diagnostic A Awm Lo

editor-show-info-annotations = Editor-ah info diagnostic entîr
editor-show-accessibility-annotations = Editor-ah accessibility diagnostic entîr

editor-accessibility-learn-more = Doenet-in accessibility a enkawl dân zir rawh

editor-accessibility-violations-heading = Accessibility bawhchhiatna ({ $standard })

editor-accessibility-other-heading = Accessibility harsatna dangte
editor-none-found = Engmah hmuh a ni lo


## Submitted responses

editor-no-responses = Chhânna thawn a la awm lo
editor-response-answer-id = Answer Id
editor-response-response = Chhânna
editor-response-credit = Credit
editor-response-submitted = Thawn hun


## The context-help panel

help-placeholder = Documentation dawn nân tag hming, attribute, emaw { $ref } chungah cursor dah rawh.

help-unsupported-ref-chain = { $example } ang reference ṭhen tam tân ṭanpuina a la awm lo.

help-unresolved-ref =
    { $reason ->
        [notFound] Reference { $ref } tân referent hmuh a ni lo.
        [multiple] Reference { $ref } tân referent tam tak hmuh a ni.
       *[indeterminate] { $ref } tân referent chu hriat chian theih a ni lo.
    }

help-learn-about-references = Reference chungchâng zir rawh →
help-reference-page = Reference phêk →

help-suggestions-header =
    { $location ->
        [inside] { $element } chhûngah
       *[top] A chung ber ah
    }{ $allowed ->
        [none] { " — hetah hian engmah a awm thei lo." }
        [text] { " — hetah hian thu ziak rawh." }
        [text-and-components] { " — hetah hian thu ziak rawh, a nih loh leh:" }
       *[components] { " — tum theih te:" }
    }

help-suggestions-footer = Component { $total } zawng zawng hmuh nân { $shortcut } hmang rawh.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } chu { $target } lam reference a ni.
       *[other] { $ref } chu { $target } lam reference a ni (line { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] { $owner }-in { $role } angin a hnuaia dah a ni.
       *[other] { $owner }-in line { $line }-ah { $role } angin a hnuaia dah a ni.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } chu { $element } property { $property } lam reference a ni.
       *[other] { $ref } chu { $element } property { $property } lam reference a ni (line { $line }).
    }

help-kind-attribute = attribute
help-kind-snippet = snippet
help-kind-array-entry = array entry

help-default = Default:
help-active-default = Default hman mêk:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Value phalte (item tinah pakhat):
       *[other] Value phalte:
    }

help-suggested-values = Value sawi lâwkte:

help-inserts = A dahluh:

help-coordinates = Coordinates:

help-type = Type:

help-resolved-style = Style chhuina (styleNumber { $styleNumber }):

help-resolved-function-names = Function hming chhuinate:
help-reset-list = He input-a reset list:
help-added-on-input = He input-a belh:
help-removed-on-input = He input-a paih:

help-reset-overrides = { $reset }-in { $additional } leh { $removed } a thlâk.
