# Wallisian (Fakaʻuvea) editor and language-server surfaces: the footer, the
# diagnostics panel, the variant picker, the accessibility button and the
# context-help panel. Selected by `uiLocale`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **The endonym is «Fakaʻuvea»**; CLDR has no name for `wls` in any language,
# so the roster's `LOCALE_NAME_FALLBACKS` entry is written by hand. See
# `chrome.ftl` for the whole note, for the orthography (ʻokina «ʻ» U+02BB,
# macrons, **/ŋ/ written «g»**) and for the table of differences from
# `locales/to`.
#
# **The contact language is French**, so the loans here are French-mediated:
# «valiā» (variante), «filitele» (filtrer), «vēsio» (version), «nota» (note),
# «kolone» (colonne). All are this seed's coinages by the ordinary loan
# phonology; a reviewer should replace any that ʻUvea says otherwise.
#
# **`WCAG`, `WCAG AA`, `DoenetML` and `XML` are names**, not words, and stay in
# English exactly as `locales/en` writes them, the way
# `accessibility-heading-level-1` in `chrome.ftl` already does. So do the
# DoenetML identifiers `styleNumber` and the attribute names in
# `help-reset-overrides`.
#
# **Number.** Wallisian marks no number on the noun beside a numeral, so a
# `{ $count -> … }` whose English branches differ only in the noun's number is
# written as one string and the plural select is dropped. `Intl.PluralRules`
# has no CLDR data for `wls`, so no `[two]`, `[few]` or `[many]` branch appears
# anywhere: nothing could select one. Every symbolic selector — `$action`,
# `$status`, `$shortcut`, `$reason`, `$location`, `$allowed`, `$line`,
# `$perItem` — is kept byte for byte from English.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Toe fakafoki
       *[update] Fakafoʻou
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } te mata sio
       *[other] { $word } te mata sio { $shortcut }
    }


## The variant picker

editor-variant = Valiā
editor-variant-filter = Filitele…
editor-variant-next = Fili te valiā hoko
editor-variant-previous = Fili te valiā muʻa


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] Kua maʻu he maumauʻi ʻo te aʻusia WCAG AA. Lomi ke { $action ->
            [close] tāpuni
           *[open] avahi
        } te fakamatala ʻo te aʻusia.
        [advisories] Lomi ke { $action ->
            [close] tāpuni
           *[open] avahi
        } te fakamatala ʻo te aʻusia. Mole he maumauʻi WCAG AA neʻe maʻu, kae ʻe ʻi ai te ʻu fakahinohino tahi ki te aʻusia.
       *[clean] Lomi ke { $action ->
            [close] tāpuni
           *[open] avahi
        } te fakamatala ʻo te aʻusia. Mole he faigataʻa ʻo te aʻusia neʻe maʻu.
    }

# The two `$count` selects English writes here differ only in the noun's
# number, so each renders one string and the select is dropped.
editor-accessibility-label =
    { $status ->
        [violations] Kua maʻu he maumauʻi ʻo te aʻusia WCAG AA. Neʻe maʻu te maumauʻi WCAG AA ʻe { $count }. Lomi ke { $action ->
            [close] tāpuni
           *[open] avahi
        } te fakamatala ʻo te aʻusia.
        [advisories] Mole he maumauʻi WCAG AA neʻe maʻu. Neʻe maʻu te fakahinohino tahi ki te aʻusia ʻe { $count }. Lomi ke { $action ->
            [close] tāpuni
           *[open] avahi
        } te fakamatala ʻo te aʻusia.
       *[clean] Mole he maumauʻi WCAG AA neʻe maʻu. Lomi ke { $action ->
            [close] tāpuni
           *[open] avahi
        } te fakamatala ʻo te aʻusia.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = Vēsio DoenetML { $version }

editor-tab-help = Tokoni ki te potu ʻaē ʻe koutou ʻi ai
editor-tab-help-short = Potu
editor-tab-errors = Hala
editor-tab-warnings = Fakatokaga
editor-tab-info = Fakamatala
editor-tab-accessibility = Aʻusia
editor-tab-responses = Tali kua ʻave

editor-tab-with-count = { $label }: { $count }

editor-options = Fili ʻo te tohi
editor-format-as-doenetml = Fakatuʻutuʻu ohage ko te DoenetML
editor-format-as-xml = Fakatuʻutuʻu ohage ko te XML


## The diagnostics panel

editor-diagnostic-line = Laina #{ $line }

editor-no-errors = Mole he hala
editor-no-warnings = Mole he fakatokaga
editor-no-info = Mole he fakamatala

editor-show-info-annotations = Fakahā te ʻu fakamatala ʻi te tohi
editor-show-accessibility-annotations = Fakahā te ʻu fakatokaga ʻo te aʻusia ʻi te tohi

editor-accessibility-learn-more = Ako pe ʻe feafeaʻi te tokaga ʻa Doenet ki te aʻusia

editor-accessibility-violations-heading = Maumauʻi ʻo te aʻusia ({ $standard })

editor-accessibility-other-heading = Faigataʻa tahi ʻo te aʻusia
editor-none-found = Mole he meʻa neʻe maʻu


## Submitted responses

editor-no-responses = Mole kei he tali kua ʻave
editor-response-answer-id = Id ʻo te tali
editor-response-response = Tali
editor-response-credit = Poini
editor-response-submitted = Kua ʻave


## The context-help panel

help-placeholder = Tuku te fakaʻiloga ki he higoa tag, he ʻatilipiuti, pe ko he { $ref } ke maʻu te fakamatala.

help-unsupported-ref-chain = Mole kei lava te tokoni ki te ʻu tuhu koga lahi ohage ko te { $example }.

help-unresolved-ref =
    { $reason ->
        [notFound] Mole he meʻa neʻe maʻu ki te tuhu: { $ref }.
        [multiple] Neʻe maʻu te meʻa e lahi ki te tuhu: { $ref }.
       *[indeterminate] Mole lava ke ʻiloʻi pe koteā ʻaē ʻe tuhu kiai te { $ref }.
    }

help-learn-about-references = Ako ki te ʻu tuhu →
help-reference-page = Pasina fakamatala →

help-suggestions-header =
    { $location ->
        [inside] ʻI loto ʻi te { $element }
       *[top] ʻI te ʻuluaki tuʻuga
    }{ $allowed ->
        [none] { " — mole he meʻa ʻe ʻalu ki heni." }
        [text] { " — tohi he kupu ʻi heni." }
        [text-and-components] { " — tohi he kupu ʻi heni, pe faiga ki te:" }
       *[components] { " — te ʻu meʻa ʻe lava ke faiga:" }
    }

help-suggestions-footer = Lomi te { $shortcut } ke sio ki te koga ʻe { $total } fuli.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] Ko te { $ref } ʻe tuhu ki te { $target }.
       *[other] Ko te { $ref } ʻe tuhu ki te { $target } (laina { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] Neʻe fakatupu e te { $owner } ohage ko te { $role }.
       *[other] Neʻe fakatupu e te { $owner } ʻi te laina { $line } ohage ko te { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] Ko te { $ref } ʻe tuhu ki te ʻulugaʻiga { $property } ʻo te { $element }.
       *[other] Ko te { $ref } ʻe tuhu ki te ʻulugaʻiga { $property } ʻo te { $element } (laina { $line }).
    }

help-kind-attribute = ʻatilipiuti
help-kind-snippet = kiʻi koga
help-kind-array-entry = koga ʻo te array

help-default = Meʻa masani:
help-active-default = Meʻa masani ʻe gāue:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Mahuʻiga ʻe lava (tahi ki te koga takitahi):
       *[other] Mahuʻiga ʻe lava:
    }

help-suggested-values = Mahuʻiga ʻe fakahinohino:

help-inserts = ʻE tuku ki ai:

# The two English branches differ only in the noun's number, so one form.
help-coordinates = Fua fakatuʻasino:

help-type = Faʻahiga:

help-resolved-style = Sitaili kua fakapapau (styleNumber { $styleNumber }):

help-resolved-function-names = Higoa gāue fika kua fakapapau:
help-reset-list = Lisi ʻe toe fakafoki ʻi te input nei:
help-added-on-input = Kua tānaki ʻi te input nei:
help-removed-on-input = Kua toʻo ʻi te input nei:

help-reset-overrides = ʻE mālohi age te { $reset } ʻi te { $additional } mo te { $removed }.
