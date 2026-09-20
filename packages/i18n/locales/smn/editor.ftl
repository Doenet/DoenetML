# Inari Sami editor and language-server surfaces, Latin script. Translated
# from `locales/en/editor.ftl`, which is the source of truth: `lint:i18n`
# rejects a key that does not exist there, and reports a key that exists there
# but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# `WCAG AA`, `DoenetML`, `XML`, `styleNumber` and every attribute or element
# name are identifiers, not prose, and stay as written.
#
# Inari Sami writes `â` and `ä` beside the `č`, `š`, `ž`, `đ` and `ŋ` it
# shares with Northern Sami. `â` is not `á`: a word that should carry one and
# carries the other is a bug, not a variant.
#
# Inari Sami counts in three categories, `one`, `two` and `other`. A message
# that prints its count writes all three, as `chrome.ftl` explains — `two` and
# `other` carry the same genitive singular today, and are kept apart because a
# later correction to one of them is unlikely to be a correction to both.
# `help-coordinates` is the message that does not: it never prints a count, it
# decides a heading's singular against its plural, and Inari Sami's plural is
# one form, so a dual branch there would be a variant nothing could tell
# apart.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Máccât
       *[update] Uđâsmit
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } čäittee
       *[other] { $word } čäittee { $shortcut }
    }


## The variant picker

editor-variant = Variant
editor-variant-filter = Syölih…
editor-variant-next = Válji puátteem variant
editor-variant-previous = Válji ovdeb variant


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] WCAG AA juksâmvuođâ rihkkoos lii kavnum. Koorkâl { $action ->
            [close] peittiđ
           *[open] räppiđ
        } juksâmvuođâ raporttâ.
        [advisories] Koorkâl { $action ->
            [close] peittiđ
           *[open] räppiđ
        } juksâmvuođâ raporttâ. WCAG AA rihkkoosah iä kavnum, mut láá lasi juksâmvuođâ ravvimeh.
       *[clean] Koorkâl { $action ->
            [close] peittiđ
           *[open] räppiđ
        } juksâmvuođâ raporttâ. Juksâmvuođâ vaigâdvuođah iä kavnum.
    }

editor-accessibility-label =
    { $status ->
        [violations] WCAG AA juksâmvuođâ rihkkoos lii kavnum. Kavnum { $count ->
            [one] { $count } WCAG AA rihkkoos
            [two] { $count } WCAG AA rihkkoos
           *[other] { $count } WCAG AA rihkkoos
        }. Koorkâl { $action ->
            [close] peittiđ
           *[open] räppiđ
        } juksâmvuođâ raporttâ.
        [advisories] WCAG AA rihkkoosah iä kavnum. Kavnum { $count ->
            [one] { $count } lasi juksâmvuođâ ravvim
            [two] { $count } lasi juksâmvuođâ ravvim
           *[other] { $count } lasi juksâmvuođâ ravvim
        }. Koorkâl { $action ->
            [close] peittiđ
           *[open] räppiđ
        } juksâmvuođâ raporttâ.
       *[clean] WCAG AA rihkkoosah iä kavnum. Koorkâl { $action ->
            [close] peittiđ
           *[open] räppiđ
        } juksâmvuođâ raporttâ.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML verzio { $version }

editor-tab-help = Ohtâvuođâ mield išemuš
editor-tab-help-short = Ohtâvuotâ
editor-tab-errors = Meddâdâsah
editor-tab-warnings = Váritâsah
editor-tab-info = Tiäđuh
editor-tab-accessibility = Juksâmvuotâ
editor-tab-responses = Vuolgâttum västidâsah

editor-tab-with-count = { $label }: { $count }

editor-options = Čäällimriemu heivâttâsah
editor-format-as-doenetml = Häämit DoenetML:in
editor-format-as-xml = Häämit XML:in


## The diagnostics panel

editor-diagnostic-line = Ravvuu nr. { $line }

editor-no-errors = Iä lah meddâdâsah
editor-no-warnings = Iä lah váritâsah
editor-no-info = Iä lah tiätudiettâtâsah

editor-show-info-annotations = Čäiti tiätudiettâtâsâid čäällimriemust
editor-show-accessibility-annotations = Čäiti juksâmvuođâ diettâtâsâid čäällimriemust

editor-accessibility-learn-more = Maht Doenet pargâ juksâmvuođâin

editor-accessibility-violations-heading = Juksâmvuođâ rihkkoosah ({ $standard })

editor-accessibility-other-heading = Eres juksâmvuođâ vaigâdvuođah
editor-none-found = Ij maidnii kavnum


## Submitted responses

editor-no-responses = Iä lah vala vuolgâttum västidâsah
editor-response-answer-id = Västidâs Id
editor-response-response = Västidâs
editor-response-credit = Čuoggá
editor-response-submitted = Vuolgâttum


## The context-help panel

help-placeholder = Piijâ čäällimmerhâ kilkkur noomâ, attribuut teikkâ tääsä: { $ref } jis haalijdah tuhhiittâs.

help-unsupported-ref-chain = Išemuš maaŋgâuásásii čujottâsâid tegu { $example } ij lah vala tuárjum.

help-unresolved-ref =
    { $reason ->
        [notFound] Ij kavnum čujottâs ulmen: { $ref }.
        [multiple] Kavnujii maaŋgâ čujottâs ulme: { $ref }.
       *[indeterminate] { $ref } ulme ij pottâm miäruštâllâđ.
    }

help-learn-about-references = Oopâ čujottâsâi pirri →
help-reference-page = Čujottâssijđo →

help-suggestions-header =
    { $location ->
        [inside] { $element } siste
       *[top] Payeeb tääsist
    }{ $allowed ->
        [none] { " — tääsä ij pyevti maidnii." }
        [text] { " — čäällih tekstâ tääbbin." }
        [text-and-components] { " — čäällih tekstâ tääbbin, teikkâ kiäččâl:" }
       *[components] { " — kiäččâl:" }
    }

help-suggestions-footer = Tečče { $shortcut } jis haalijdah oiniđ puoh { $total } komponent.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } čujot tääsä: { $target }.
       *[other] { $ref } čujot tääsä: { $target } (ravvuu { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] { $owner } lii tom puohtâm { $role } rooláin.
       *[other] { $owner } lii tom puohtâm ravvuust { $line } { $role } rooláin.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } čujot { $element } iärásvuotân { $property }.
       *[other] { $ref } čujot { $element } iärásvuotân { $property } (ravvuu { $line }).
    }

help-kind-attribute = attribuut
help-kind-snippet = tekstâpeeci
help-kind-array-entry = listu läšluu

help-default = Standard:
help-active-default = Tooimâlâš standard:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Luávdum áárvuh (ohtâ jyehi läšluu várás):
       *[other] Luávdum áárvuh:
    }

help-suggested-values = Iävtuttum áárvuh:

help-inserts = Piejâ siisâ:

help-coordinates =
    { $count ->
        [one] Koordinaat:
       *[other] Koordinaatah:
    }

help-type = Šlaajâ:

help-resolved-style = Miäruštum stiil (styleNumber { $styleNumber }):

help-resolved-function-names = Miäruštum funktionoomah:
help-reset-list = Máccâtlistu taan sisapiejâm várás:
help-added-on-input = Lasettum taan sisapiejâmân:
help-removed-on-input = Väldduim erâld taan sisapiejâmist:

help-reset-overrides = { $reset } pajilkečá { $additional } já { $removed }.
