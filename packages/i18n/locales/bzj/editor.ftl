# Belize Kriol (Bileez Kriol) editor and language-server surfaces: the footer,
# the diagnostics panel, the variant picker, the accessibility button and the
# context-help panel. Translated from `locales/en/editor.ftl`, which is the
# source of truth.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Orthography.** The phonemic orthography of the Belize Kriol Council /
# National Kriol Council of Belize, set out point by point in `chrome.ftl`'s
# header: long vowels doubled, «ch» for English *tr-*, «j» for English *dr-*,
# no apostrophes, no silent letters. The English-based ad-hoc spelling in
# everyday use is not mixed into these files; a reviewer who prefers it should
# respell rather than retranslate.
#
# **Number.** `Intl.PluralRules("bzj")` has no CLDR data for `bzj` and falls
# back to English. A Kriol noun after a numeral does not inflect, so
# `editor-accessibility-label` and `help-coordinates` — the two messages
# English selects on a count — are written here as **one unselected form**
# each, with the count still interpolated. No plural branch appears anywhere
# in this file.
#
# **Loans.** English respelled into Kriol phonology and carried in Kriol
# grammar: «era», «waanin», «info», «akseh» (*access*), «vaiyolayshan»,
# «rekamendayshan», «varyant», «fiilta», «kompoanent», «atribyuut»,
# «snipet», «aray», «koaadinet», «fahmat», «vershan», «dakiumentayshan»,
# «rifrans», «rispans», «kredit». `WCAG`, `DoenetML`, `XML` and `styleNumber`
# are names and stay as written, as do the attribute names in
# `help-reset-overrides`.
#
# **Confidence.** This is the file with the least everyday Kriol in it —
# almost every noun is a technical loan. The verbs, the negation and the
# preverbal markers are Kriol throughout («noh mi ku fain», «klik fi oapn»,
# «put yu kersa»), and that is what a reviewer should read for. Nothing was
# left in English.


editor-update-viewer =
    { $action ->
        [reset] Riset
       *[update] Opdayt
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } di Viuwa
       *[other] { $word } di Viuwa { $shortcut }
    }


editor-variant = Varyant

editor-variant-filter = Fiilta...

editor-variant-next = Pik di neks varyant

editor-variant-previous = Pik di varyant bifoa


editor-accessibility-title =
    { $status ->
        [violations] Wi fain wan WCAG AA akseh-vaiyolayshan. Klik fi { $action ->
            [close] kloaz
           *[open] oapn
        } di akseh-riport.
        [advisories] Klik fi { $action ->
            [close] kloaz
           *[open] oapn
        } di akseh-riport. Wi noh fain no WCAG AA vaiyolayshan, bot wi gat moa akseh-rekamendayshan.
       *[clean] Klik fi { $action ->
            [close] kloaz
           *[open] oapn
        } di akseh-riport. Wi noh fain no akseh-prablem.
    }

editor-accessibility-label =
    { $status ->
        [violations] Wi fain wan WCAG AA akseh-vaiyolayshan. Wi fain { $count } WCAG AA vaiyolayshan. Klik fi { $action ->
            [close] kloaz
           *[open] oapn
        } di akseh-riport.
        [advisories] Wi noh fain no WCAG AA vaiyolayshan. Wi fain { $count } moa akseh-rekamendayshan. Klik fi { $action ->
            [close] kloaz
           *[open] oapn
        } di akseh-riport.
       *[clean] Wi noh fain no WCAG AA vaiyolayshan. Klik fi { $action ->
            [close] kloaz
           *[open] oapn
        } di akseh-riport.
    }

editor-accessibility-badge = WCAG


editor-version-title = DoenetML vershan { $version }

editor-tab-help = Help weh fala weh yu di du
editor-tab-help-short = Konteks
editor-tab-errors = Era
editor-tab-warnings = Waanin
editor-tab-info = Info
editor-tab-accessibility = Akseh
editor-tab-responses = Rispans weh sen aredi

editor-tab-with-count = { $label }: { $count }

editor-options = Editta apshan
editor-format-as-doenetml = Fahmat az DoenetML
editor-format-as-xml = Fahmat az XML


editor-diagnostic-line = Lain #{ $line }

editor-no-errors = No Era
editor-no-warnings = No Waanin
editor-no-info = No Info Dayagnastik

editor-show-info-annotations = Shoa di info dayagnastik dehn eena di editta
editor-show-accessibility-annotations = Shoa di akseh-dayagnastik dehn eena di editta

editor-accessibility-learn-more = Lorn how Doenet tek kier a akseh

editor-accessibility-violations-heading = Akseh-vaiyolayshan ({ $standard })

editor-accessibility-other-heading = Ada akseh-prablem
editor-none-found = Wi noh fain non


editor-no-responses = No rispans noh sen yet
editor-response-answer-id = Ansa Id
editor-response-response = Rispans
editor-response-credit = Kredit
editor-response-submitted = Sen


help-placeholder = Put yu kersa pahn wan tag naym, wan atribyuut, ar { $ref } fi si di dakiumentayshan.

help-unsupported-ref-chain = Wi noh gat help yet fi rifrans weh gat moa dan wan paat, laik { $example }.

help-unresolved-ref =
    { $reason ->
        [notFound] Wi noh fain notn weh { $ref } di poin tu.
        [multiple] Wi fain moa dan wan ting weh { $ref } di poin tu.
       *[indeterminate] Wi noh ku fain out weh { $ref } di poin tu.
    }

help-learn-about-references = Lorn bowt rifrans →
help-reference-page = Rifrans payj →

help-suggestions-header =
    { $location ->
        [inside] Eena { $element }
       *[top] Da di tap levl
    }{ $allowed ->
        [none] { " — notn noh goh yaa." }
        [text] { " — taip teks yaa." }
        [text-and-components] { " — taip teks yaa, ar chrai:" }
       *[components] { " — sohnting fi chrai:" }
    }

help-suggestions-footer = Prehs { $shortcut } fi si aal { $total } kompoanent.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } da wan rifrans tu { $target }.
       *[other] { $ref } da wan rifrans tu { $target } (lain { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] { $owner } bring dis in az { $role }.
       *[other] { $owner } bring dis in pahn lain { $line } az { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } da wan rifrans tu di { $property } prapati a { $element }.
       *[other] { $ref } da wan rifrans tu di { $property } prapati a { $element } (lain { $line }).
    }

help-kind-attribute = atribyuut
help-kind-snippet = snipet
help-kind-array-entry = aray entri

help-default = Difalt:
help-active-default = Aktiv difalt:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Valyu weh alou (wan pa aitem):
       *[other] Valyu weh alou:
    }

help-suggested-values = Valyu weh wi sojes:

help-inserts = Wa it put in:

help-coordinates = Koaadinet:

help-type = Taip:

help-resolved-style = Stail weh kom out (styleNumber { $styleNumber }):

help-resolved-function-names = Fongshan naym weh kom out:
help-reset-list = Riset di lis pahn dis inpot:
help-added-on-input = Wa ad pahn dis inpot:
help-removed-on-input = Wa tek out pahn dis inpot:

help-reset-overrides = { $reset } beet { $additional } ahn { $removed }.
