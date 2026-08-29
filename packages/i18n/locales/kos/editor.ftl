# Kosraean (kas Kosrae) editor and language-server surfaces. Translated from
# `locales/en/editor.ftl`, which is the source of truth: `lint:i18n` rejects a
# key that does not exist there, and reports a key that exists there but not
# here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# `WCAG AA`, `DoenetML`, `XML`, `styleNumber` and every attribute or element
# name are identifiers, not prose, and stay as written.
#
# ORTHOGRAPHY. Standard modern Kosraean spelling; the digraph vowels `ac`,
# `ah`, `oa`, `oh`, `uc`, `uh` and the digraph consonants `ng`, `sr`, `kw`,
# `mw`, `srw` are single letters, and no Kosraean word carries a diacritic.
# `chrome.ftl`'s header is the canonical statement.
#
# LOANS. `editor`, `variant`, `page`, `reference`, `attribute`, `value`,
# `type`, `component`, `list`, `input`, `array`, `coordinate`, `style`,
# `function`, `version`, `report`, `cursor`, `tag`, `code`, `line`, `document`
# and `credit` are **English words kept as loans in English spelling**, not
# respellings. Kosraean has no `b`, `c`, `d`, `g`, `h`, `j`, `q`, `v`, `x` or
# `z`, so they are visibly borrowed, which is the intent — see `content.ftl`'s
# header for why this catalog does not respell and why that parts company with
# `pon`, `mh` and `chk`.
#
# NUMBER. A Kosraean noun takes no ending after a numeral, and
# `Intl.PluralRules("kos")` has no CLDR data of its own, so no message here
# writes a plural branch. `help-coordinates` and the two counters inside
# `editor-accessibility-label` each render one string where English writes two;
# the count itself still arrives and is still formatted.
#
# NO GENDER, NO `$role` FORK, anywhere in these four files.
#
# WORD ORDER. Kosraean is SVO and head-initial, so these sentences keep close
# to the English order and the `$action` select can stay where English puts it
# rather than moving to the end, as `locales/sma` had to.
#
# VOCABULARY THAT NEEDS A SPEAKER, and the first place to look. «ku in utyak» —
# "the ability to enter" — is this seed's coinage for *accessibility*, used in
# every accessibility message here and in `chrome.ftl`, so correcting it is one
# search-and-replace; it is the same move `locales/pon` makes with «kak en
# pedolong» and `locales/chk` with «tolong». «kas in kasru» carries *feedback*
# in `chrome.ftl` and *recommendation* here: two English words, one Kosraean
# phrase, and this seed could not separate them — the same collision
# `locales/pon` records for «kaweid». «kunausla», to break or spoil, is a
# *violation*. «ma oakwuki meet» — "the thing arranged beforehand" — is the
# coinage for *default*. «mwe liye» is the viewer and «mwe akkalem» the
# renderer. «ip in sim» ("a piece of writing") is a *snippet*. «itungya» for
# *press* and «sukok» for *search* are the two ordinary verbs this seed is
# least sure of.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Folokla
       *[update] Aksasuye
    }
editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } mwe liye
       *[other] { $word } mwe liye { $shortcut }
    }


## The variant picker

editor-variant = Variant
editor-variant-filter = Sukok...
editor-variant-next = Sulela variant tok
editor-variant-previous = Sulela variant meet


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] Kunausla ke WCAG AA ke ku in utyak koneyuk. Klik in { $action ->
            [close] kaliya
           *[open] ikasla
        } report ke ku in utyak.
        [advisories] Klik in { $action ->
            [close] kaliya
           *[open] ikasla
        } report ke ku in utyak. Wangin kunausla ke WCAG AA koneyuk, tusruktu oasr kas in kasru pac ke ku in utyak.
       *[clean] Klik in { $action ->
            [close] kaliya
           *[open] ikasla
        } report ke ku in utyak. Wangin mwe ongoiya ke ku in utyak koneyuk.
    }

editor-accessibility-label =
    { $status ->
        [violations] Kunausla ke WCAG AA ke ku in utyak koneyuk. Kunausla ke WCAG AA { $count } koneyuk. Klik in { $action ->
            [close] kaliya
           *[open] ikasla
        } report ke ku in utyak.
        [advisories] Wangin kunausla ke WCAG AA koneyuk. Kas in kasru { $count } pac ke ku in utyak koneyuk. Klik in { $action ->
            [close] kaliya
           *[open] ikasla
        } report ke ku in utyak.
       *[clean] Wangin kunausla ke WCAG AA koneyuk. Klik in { $action ->
            [close] kaliya
           *[open] ikasla
        } report ke ku in utyak.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = Version lun DoenetML { $version }

editor-tab-help = Kasru fal nu ke acn se ma cursor oan we
editor-tab-help-short = Acn
editor-tab-errors = Tafongla
editor-tab-warnings = Kas in taran
editor-tab-info = Kas in etu
editor-tab-accessibility = Ku in utyak
editor-tab-responses = Topuk ma supweyukla
editor-tab-with-count = { $label }: { $count }

editor-options = Sulela lun editor
editor-format-as-doenetml = Oakiya oana DoenetML
editor-format-as-xml = Oakiya oana XML


## The diagnostics panel

editor-diagnostic-line = Line #{ $line }

editor-no-errors = Wangin tafongla
editor-no-warnings = Wangin kas in taran
editor-no-info = Wangin kas in etu

editor-show-info-annotations = Akkalemye kas in etu in editor
editor-show-accessibility-annotations = Akkalemye kas ke ku in utyak in editor

editor-accessibility-learn-more = Lutlut ke ouiyen Doenet in oru ku in utyak

editor-accessibility-violations-heading = Kunausla ke ku in utyak ({ $standard })

editor-accessibility-other-heading = Mwe ongoiya saya ke ku in utyak
editor-none-found = Wangin ma koneyuk


## Submitted responses

editor-no-responses = Soenna oasr topuk supweyukla
editor-response-answer-id = Id lun topuk
editor-response-response = Topuk
editor-response-credit = Credit
editor-response-submitted = Supweyukla


## The context-help panel

help-placeholder = Filiya cursor fin ine lun tag, fin attribute, ku fin { $ref } in konauk kas in etu.

help-unsupported-ref-chain = Kasru nu ke reference ma oasr ip pus, oana { $example }, soenna oasr.

help-unresolved-ref =
    { $reason ->
        [notFound] Wangin ma koneyuk nu ke reference se inge: { $ref }.
        [multiple] Ma pus koneyuk nu ke reference se inge: { $ref }.
       *[indeterminate] Tia ku in etu lah mea { $ref } el akkalemye.
    }

help-learn-about-references = Lutlut ke reference →
help-reference-page = Page lun reference →

help-suggestions-header =
    { $location ->
        [inside] In { $element }
       *[top] Ke acn lucng ke document
    }{ $allowed ->
        [none] { " — wangin ma ku in oan inge." }
        [text] { " — sim kas inge." }
        [text-and-components] { " — sim kas inge, ku srike ma inge:" }
       *[components] { " — srike ma inge:" }
    }

help-suggestions-footer = Itungya { $shortcut } in liye component { $total } nukewa.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } pa reference nu ke { $target }.
       *[other] { $ref } pa reference nu ke { $target } (line { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] Tuku ke { $owner } oana { $role }.
       *[other] Tuku ke { $owner } ke line { $line } oana { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } pa reference nu ke property { $property } lun { $element }.
       *[other] { $ref } pa reference nu ke property { $property } lun { $element } (line { $line }).
    }

help-kind-attribute = attribute
help-kind-snippet = ip in sim
help-kind-array-entry = ip in array

help-default = Ma oakwuki meet:
help-active-default = Ma oakwuki meet ma orekma:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Value ma lela (sie nu ke kais sie ip):
       *[other] Value ma lela:
    }

help-suggested-values = Value ma ku in orekmakinyuk:

help-inserts = Filiya:

# No plural branch: Kosraean does not mark the noun for number, so both English
# headings render one string.
help-coordinates = Coordinate:

help-type = Type:

help-resolved-style = Style ma koneyuk (styleNumber { $styleNumber }):

help-resolved-function-names = Ine lun function ma koneyuk:
help-reset-list = List ma folokinyukla ke input se inge:
help-added-on-input = Ma weangyuk ke input se inge:
help-removed-on-input = Ma eisyukla ke input se inge:

help-reset-overrides = { $reset } kutangla { $additional } ac { $removed }.
