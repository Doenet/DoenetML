# Guadeloupean Creole French (kréyòl gwadloupéyen) editor and language-server
# surfaces. Translated from `locales/en/editor.ftl`, which is the source of
# truth: `lint:i18n` rejects a key that does not exist there, and reports a key
# that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Orthography.** The GEREC standard, as `chrome.ftl` sets it out. The
# French-etymological spelling is not mixed in.
#
# `WCAG AA`, `DoenetML`, `XML`, `styleNumber` and every attribute or element
# name are identifiers, not prose, and stay as written.
#
# **Number.** No `[one]`/`[other]` select appears anywhere in this file.
# Guadeloupean nouns do not inflect for number, so «vyolasyon» and
# «rékòmandasyon» are the same word in both English branches; the select is
# dropped and the count still arrives and is still formatted. `Intl.PluralRules`
# has no CLDR data for `gcf` either. `help-coordinates` is one unselected form
# for the same reason.
#
# **Loans.** French, respelled by GEREC: «varyant», «filtré», «aksésibilité»,
# «vyolasyon», «rékòmandasyon», «rapò», «vèsyon», «kontèks», «erè»,
# «avètisman», «enfo», «dyagnostik», «anotasyon», «opsyon», «fòmaté»,
# «référans», «référan», «dokimantasyon», «atribi», «konpozan», «pwopriyété»,
# «kòdoné», «valè», «stil», «tip», «idantifyan». One English loan: «tag», the
# markup word, which arrives through the language itself. The frame around
# them is creole: «ka» for the progressive, «pa» for negation, «pé pa» for
# *cannot*, «yo» for the impersonal subject, and the postposed determiner
# («rapò-la», «editè-la»).
#
# **Confidence.** This is the file with the least support behind it: there is
# almost no written Guadeloupean computing register, and «tibout kòd» for
# *snippet*, «antré tablo» for *array entry* and «randè» in the sibling files
# are proposals rather than attested terms. A reviewer should read those three
# first.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Rimèt a zéro
       *[update] Mèt ajou
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } vizyonè-la
       *[other] { $word } vizyonè-la { $shortcut }
    }


## The variant picker

editor-variant = Varyant
editor-variant-filter = Filtré…
editor-variant-next = Chwazi varyant ki ka vin apré
editor-variant-previous = Chwazi varyant ki ka vin avan


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] Yo trouvé on vyolasyon aksésibilité WCAG AA. Kliké pou { $action ->
            [close] fèmé
           *[open] ouvè
        } rapò aksésibilité-la.
        [advisories] Kliké pou { $action ->
            [close] fèmé
           *[open] ouvè
        } rapò aksésibilité-la. Yo pa trouvé pon vyolasyon WCAG AA, mé ni dòt rékòmandasyon aksésibilité ki disponib.
       *[clean] Kliké pou { $action ->
            [close] fèmé
           *[open] ouvè
        } rapò aksésibilité-la. Yo pa trouvé pon pwoblèm aksésibilité.
    }

# No select on `$count` inside the branches: «vyolasyon» and «rékòmandasyon»
# are the same word for one and for many, so the two categories would render
# the same string. The count still arrives and is still formatted.
editor-accessibility-label =
    { $status ->
        [violations] Yo trouvé on vyolasyon aksésibilité WCAG AA. Yo trouvé { $count } vyolasyon WCAG AA. Kliké pou { $action ->
            [close] fèmé
           *[open] ouvè
        } rapò aksésibilité-la.
        [advisories] Yo pa trouvé pon vyolasyon WCAG AA. Yo trouvé { $count } dòt rékòmandasyon aksésibilité. Kliké pou { $action ->
            [close] fèmé
           *[open] ouvè
        } rapò aksésibilité-la.
       *[clean] Yo pa trouvé pon vyolasyon WCAG AA. Kliké pou { $action ->
            [close] fèmé
           *[open] ouvè
        } rapò aksésibilité-la.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = Vèsyon DoenetML { $version }

editor-tab-help = Èd ki ka dépann di kontèks
editor-tab-help-short = Kontèks
editor-tab-errors = Erè
editor-tab-warnings = Avètisman
editor-tab-info = Enfo
editor-tab-accessibility = Aksésibilité
editor-tab-responses = Répons ki voyé

editor-tab-with-count = { $label }: { $count }

editor-options = Opsyon editè-la
editor-format-as-doenetml = Fòmaté kon DoenetML
editor-format-as-xml = Fòmaté kon XML


## The diagnostics panel

editor-diagnostic-line = Liy #{ $line }

editor-no-errors = Pa ni erè
editor-no-warnings = Pa ni avètisman
editor-no-info = Pa ni dyagnostik enfòmatif

editor-show-info-annotations = Montré dyagnostik enfòmatif adan editè-la
editor-show-accessibility-annotations = Montré dyagnostik aksésibilité adan editè-la

editor-accessibility-learn-more = Aprann ki jan Doenet ka trété aksésibilité

editor-accessibility-violations-heading = Vyolasyon aksésibilité ({ $standard })

editor-accessibility-other-heading = Dòt pwoblèm aksésibilité
editor-none-found = Yo pa trouvé ayen


## Submitted responses

editor-no-responses = Pòkò ni répons ki voyé
editor-response-answer-id = Idantifyan répons
editor-response-response = Répons
editor-response-credit = Kredi
editor-response-submitted = Voyé


## The context-help panel

help-placeholder = Mèt kisò-la asi on non tag, on atribi, oben { $ref } pou dokimantasyon.

help-unsupported-ref-chain = Èd pou référans an plizyè moso kon { $example } pòkò disponib.

help-unresolved-ref =
    { $reason ->
        [notFound] Yo pa trouvé pon référan pou référans-la: { $ref }.
        [multiple] Yo trouvé plizyè référan pou référans-la: { $ref }.
       *[indeterminate] Yo pa pé détèrminé on référan pou { $ref }.
    }

help-learn-about-references = Aprann asi référans →
help-reference-page = Paj référans →

help-suggestions-header =
    { $location ->
        [inside] Adan { $element }
       *[top] Asi nivo pli wo-la
    }{ $allowed ->
        [none] { " — ayen pa ka rantré la." }
        [text] { " — tapé tèks la." }
        [text-and-components] { " — tapé tèks la, oben eséyé:" }
       *[components] { " — bagay pou eséyé:" }
    }

help-suggestions-footer = Pésé { $shortcut } pou vwè tout { $total } konpozan-la.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } sé on référans ba { $target }.
       *[other] { $ref } sé on référans ba { $target } (liy { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] Entrodwi pa { $owner } kon { $role }.
       *[other] Entrodwi pa { $owner } an liy { $line } kon { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } sé on référans ba pwopriyété { $property } a konpozan { $element }.
       *[other] { $ref } sé on référans ba pwopriyété { $property } a konpozan { $element } (liy { $line }).
    }

help-kind-attribute = atribi
help-kind-snippet = tibout kòd
help-kind-array-entry = antré tablo

help-default = Valè pa défo:
help-active-default = Valè pa défo aktif:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Valè ki pèmèt (yonn pa atik):
       *[other] Valè ki pèmèt:
    }

help-suggested-values = Valè ki sijéré:

help-inserts = Ka mèt:

# No select: «kòdoné» is the same word for one and for many, so both
# categories would render the same string.
help-coordinates = Kòdoné:

help-type = Tip:

help-resolved-style = Stil ki rézoud (styleNumber { $styleNumber }):

help-resolved-function-names = Non fonksyon ki rézoud:
help-reset-list = Lis rimiz a zéro asi antré-lasa:
help-added-on-input = Ajouté asi antré-lasa:
help-removed-on-input = Òté asi antré-lasa:

help-reset-overrides = { $reset } ka pran plas { $additional } é { $removed }.
