# Saint Lucian Creole French (Kwéyòl) editor and language-server surfaces.
# Translated from `locales/en/editor.ftl`, which is the source of truth:
# `lint:i18n` rejects a key that does not exist there, and reports a key that
# exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Orthography.** The Saint Lucian and Dominican standard, as `chrome.ftl`
# sets it out. It is very close to the Martinican and Guadeloupean spelling;
# what differs is the «w» for every etymological French /r/ and the determiner
# written as a separate word with the full allomorph set. The
# French-etymological spelling is not mixed in.
#
# `WCAG AA`, `DoenetML`, `XML`, `styleNumber` and every attribute or element
# name are identifiers, not prose, and stay as written.
#
# **Number.** No `[one]`/`[other]` select appears anywhere in this file. Saint
# Lucian nouns do not inflect for number, so «vyolasyon» and «wékòmandasyon»
# are the same word in both English branches; the select is dropped and the
# count still arrives and is still formatted. `Intl.PluralRules` has no CLDR
# data for `acf` either. `help-coordinates` is one unselected form for the
# same reason.
#
# **Loans.** French, respelled by the Saint Lucian rules: «varyant»,
# «Filtwé», «aksésibilité», «vyolasyon», «wékòmandasyon», «wapò», «vèsyon»,
# «kontèks», «éwè», «avètisman», «enfo», «dyagnostik», «anotasyon», «opsyon»,
# «fòmaté», «wéféwans», «wéféwan», «dokimantasyon», «atwibi», «konpozan»,
# «pwopwiyété», «kòdoné», «valè», «stil», «tip», «idantifyan». One English
# loan: «tag», the markup word, which arrives through the language itself. The
# frame around them is creole: «ka» for the progressive, «pa» for negation,
# «pé pa» for *cannot*, «sé» for the copula, «yo» for the impersonal subject,
# and the postposed determiner («wapò a», «editè a»).
#
# **Confidence.** This is the file with the least support behind it: Saint
# Lucia's computing is done in English, there is no written Kwéyòl computing
# register at all, and «tibout kòd» for *snippet*, «antwé tablo» for *array
# entry* and «wandè» in the sibling files are proposals rather than attested
# terms. A reviewer should read those three first, and may well decide that a
# straight English loan is the honest answer for each.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Wimèt a zéwo
       *[update] Mèt ajou
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } vizyonè a
       *[other] { $word } vizyonè a { $shortcut }
    }


## The variant picker

editor-variant = Varyant
editor-variant-filter = Filtwé…
editor-variant-next = Chwazi varyant ki ka vin apwé
editor-variant-previous = Chwazi varyant ki ka vin avan


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] Yo twouvé on vyolasyon aksésibilité WCAG AA. Kliké pou { $action ->
            [close] fèmé
           *[open] ouvè
        } wapò aksésibilité a.
        [advisories] Kliké pou { $action ->
            [close] fèmé
           *[open] ouvè
        } wapò aksésibilité a. Yo pa twouvé pyès vyolasyon WCAG AA, mé ni dòt wékòmandasyon aksésibilité ki disponib.
       *[clean] Kliké pou { $action ->
            [close] fèmé
           *[open] ouvè
        } wapò aksésibilité a. Yo pa twouvé pyès pwoblèm aksésibilité.
    }

# No select on `$count` inside the branches: «vyolasyon» and «wékòmandasyon»
# are the same word for one and for many, so the two categories would render
# the same string. The count still arrives and is still formatted.
editor-accessibility-label =
    { $status ->
        [violations] Yo twouvé on vyolasyon aksésibilité WCAG AA. Yo twouvé { $count } vyolasyon WCAG AA. Kliké pou { $action ->
            [close] fèmé
           *[open] ouvè
        } wapò aksésibilité a.
        [advisories] Yo pa twouvé pyès vyolasyon WCAG AA. Yo twouvé { $count } dòt wékòmandasyon aksésibilité. Kliké pou { $action ->
            [close] fèmé
           *[open] ouvè
        } wapò aksésibilité a.
       *[clean] Yo pa twouvé pyès vyolasyon WCAG AA. Kliké pou { $action ->
            [close] fèmé
           *[open] ouvè
        } wapò aksésibilité a.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = Vèsyon DoenetML { $version }

editor-tab-help = Èd ki ka dépann di kontèks
editor-tab-help-short = Kontèks
editor-tab-errors = Éwè
editor-tab-warnings = Avètisman
editor-tab-info = Enfo
editor-tab-accessibility = Aksésibilité
editor-tab-responses = Wéponn ki voyé

editor-tab-with-count = { $label }: { $count }

editor-options = Opsyon editè a
editor-format-as-doenetml = Fòmaté kon DoenetML
editor-format-as-xml = Fòmaté kon XML


## The diagnostics panel

editor-diagnostic-line = Liy #{ $line }

editor-no-errors = Pa ni éwè
editor-no-warnings = Pa ni avètisman
editor-no-info = Pa ni dyagnostik enfòmatif

editor-show-info-annotations = Montwé dyagnostik enfòmatif adan editè a
editor-show-accessibility-annotations = Montwé dyagnostik aksésibilité adan editè a

editor-accessibility-learn-more = Apwann ki jan Doenet ka twété aksésibilité

editor-accessibility-violations-heading = Vyolasyon aksésibilité ({ $standard })

editor-accessibility-other-heading = Dòt pwoblèm aksésibilité
editor-none-found = Yo pa twouvé anyen


## Submitted responses

editor-no-responses = Pòkò ni wéponn ki voyé
editor-response-answer-id = Idantifyan wéponn
editor-response-response = Wéponn
editor-response-credit = Kwedi
editor-response-submitted = Voyé


## The context-help panel

help-placeholder = Mèt kisò a asi on non tag, on atwibi, oben { $ref } pou dokimantasyon.

help-unsupported-ref-chain = Èd pou wéféwans an plizyè moso kon { $example } pòkò disponib.

help-unresolved-ref =
    { $reason ->
        [notFound] Yo pa twouvé pyès wéféwan pou wéféwans la: { $ref }.
        [multiple] Yo twouvé plizyè wéféwan pou wéféwans la: { $ref }.
       *[indeterminate] Yo pa pé détèwminé on wéféwan pou { $ref }.
    }

help-learn-about-references = Apwann asi wéféwans →
help-reference-page = Paj wéféwans →

help-suggestions-header =
    { $location ->
        [inside] Adan { $element }
       *[top] Asi nivo pli wo a
    }{ $allowed ->
        [none] { " — anyen pa ka wantwé la." }
        [text] { " — tapé tèks la." }
        [text-and-components] { " — tapé tèks la, oben eséyé:" }
       *[components] { " — bagay pou eséyé:" }
    }

help-suggestions-footer = Pésé { $shortcut } pou wè tout { $total } konpozan an.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } sé on wéféwans ba { $target }.
       *[other] { $ref } sé on wéféwans ba { $target } (liy { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] Entwodwi pa { $owner } kon { $role }.
       *[other] Entwodwi pa { $owner } an liy { $line } kon { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } sé on wéféwans ba pwopwiyété { $property } a konpozan { $element }.
       *[other] { $ref } sé on wéféwans ba pwopwiyété { $property } a konpozan { $element } (liy { $line }).
    }

help-kind-attribute = atwibi
help-kind-snippet = tibout kòd
help-kind-array-entry = antwé tablo

help-default = Valè pa défo:
help-active-default = Valè pa défo aktif:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Valè ki pèmèt (yonn pa atik):
       *[other] Valè ki pèmèt:
    }

help-suggested-values = Valè ki sijéwé:

help-inserts = Ka mèt:

# No select: «kòdoné» is the same word for one and for many, so both
# categories would render the same string.
help-coordinates = Kòdoné:

help-type = Tip:

help-resolved-style = Stil ki wézoud (styleNumber { $styleNumber }):

help-resolved-function-names = Non fonksyon ki wézoud:
help-reset-list = Lis wimiz a zéwo asi antwé sala:
help-added-on-input = Ajouté asi antwé sala:
help-removed-on-input = Òté asi antwé sala:

help-reset-overrides = { $reset } ka pwan plas { $additional } é { $removed }.
