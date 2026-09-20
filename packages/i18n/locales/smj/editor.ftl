# Lule Sami editor and language-server surfaces, Latin script. Translated from
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
# Lule Sami keeps `á` and `ŋ` but has no `č`, `š`, `ž`, `đ` or `ŧ`, writing
# `tj` and `sj` instead, and it uses `å`, which Northern Sami does not.
# Anything below that carries a Northern Sami letter is a bug.
#
# Lule Sami counts in three categories, `one`, `two` and `other`. A message
# that prints its count writes all three, as `chrome.ftl` explains — `two` and
# `other` carry the same genitive singular today, and are kept apart because a
# later correction to one of them is unlikely to be a correction to both.
# `help-coordinates` is the message that does not: it never prints a count, it
# decides a heading's singular against its plural, and Lule Sami's plural is
# one form, so a dual branch there would be a variant nothing could tell
# apart.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Máhtsi
       *[update] Ådåstuhta
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } vuosedijiddje
       *[other] { $word } vuosedijiddje { $shortcut }
    }


## The variant picker

editor-variant = Variánta
editor-variant-filter = Sillim…
editor-variant-next = Válij boahtte variántav
editor-variant-previous = Válij åvddep variántav


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] WCAG AA juksamvuoda rihkkom la gávnaduvvam. Tjåkkål { $action ->
            [close] gåptjet
           *[open] rahpat
        } juksamvuoda raportav.
        [advisories] Tjåkkål { $action ->
            [close] gåptjet
           *[open] rahpat
        } juksamvuoda raportav. WCAG AA rihkkoma e gávnadum, valla li lassen juksamvuoda ávvadusá.
       *[clean] Tjåkkål { $action ->
            [close] gåptjet
           *[open] rahpat
        } juksamvuoda raportav. Juksamvuoda hásstalusá e gávnadum.
    }

editor-accessibility-label =
    { $status ->
        [violations] WCAG AA juksamvuoda rihkkom la gávnaduvvam. Gávnaduvvam { $count ->
            [one] { $count } WCAG AA rihkkom
            [two] { $count } WCAG AA rihkkoma
           *[other] { $count } WCAG AA rihkkoma
        }. Tjåkkål { $action ->
            [close] gåptjet
           *[open] rahpat
        } juksamvuoda raportav.
        [advisories] WCAG AA rihkkoma e gávnadum. Gávnaduvvam { $count ->
            [one] { $count } lasse juksamvuoda ávvadus
            [two] { $count } lasse juksamvuoda ávvadusá
           *[other] { $count } lasse juksamvuoda ávvadusá
        }. Tjåkkål { $action ->
            [close] gåptjet
           *[open] rahpat
        } juksamvuoda raportav.
       *[clean] WCAG AA rihkkoma e gávnadum. Tjåkkål { $action ->
            [close] gåptjet
           *[open] rahpat
        } juksamvuoda raportav.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML versjåvnnå { $version }

editor-tab-help = Aktijvuoda milta viehkke
editor-tab-help-short = Aktijvuohta
editor-tab-errors = Mieddádusá
editor-tab-warnings = Várrudusá
editor-tab-info = Diedo
editor-tab-accessibility = Juksamvuohta
editor-tab-responses = Sáddiduvvam vásstádusá

editor-tab-with-count = { $label }: { $count }

editor-options = Tjállemruvtuga hiebadusá
editor-format-as-doenetml = Hábmi DoenetML:n
editor-format-as-xml = Hábmi XML:n


## The diagnostics panel

editor-diagnostic-line = Linnjá nr. { $line }

editor-no-errors = E la mieddádusá
editor-no-warnings = E la várrudusá
editor-no-info = E la diehtodiedádusá

editor-show-info-annotations = Vuoseda diehtodiedádusájt tjállemruvtugin
editor-show-accessibility-annotations = Vuoseda juksamvuoda diedádusájt tjállemruvtugin

editor-accessibility-learn-more = Gåktu Doenet juksamvuodajn barggá

editor-accessibility-violations-heading = Juksamvuoda rihkkoma ({ $standard })

editor-accessibility-other-heading = Ietjá juksamvuoda hásstalusá
editor-none-found = Ij maktik gávnadum


## Submitted responses

editor-no-responses = E la ájn sáddiduvvam vásstádusá
editor-response-answer-id = Vásstádusá Id
editor-response-response = Vásstádus
editor-response-credit = Tjuoggá
editor-response-submitted = Sáddiduvvam


## The context-help panel

help-placeholder = Bija tjállemmerkav gilkora nammaj, attribuhttaj jali dási: { $ref } jus dokumentasjåvnåv sidá.

help-unsupported-ref-chain = Viehkke moattetsuolkka gehtjalvisájda degu { $example } ij la ájn doarjjaduvvam.

help-unresolved-ref =
    { $reason ->
        [notFound] Ij gávnadum gehtjalvisá åjvvedimusj: { $ref }.
        [multiple] Moadda gehtjalvisá åjvvedimusá gávnaduvvin: { $ref }.
       *[indeterminate] { $ref } åjvvedimusáv ij máhte mierredit.
    }

help-learn-about-references = Oahppa gehtjalvisáj birra →
help-reference-page = Gehtjalvissijdo →

help-suggestions-header =
    { $location ->
        [inside] { $element } sisŋelin
       *[top] Bajemus dásen
    }{ $allowed ->
        [none] { " — dási ij boade maktik." }
        [text] { " — tjále tekstav dási." }
        [text-and-components] { " — tjále tekstav dási, jali gæhttjala:" }
       *[components] { " — gæhttjala:" }
    }

help-suggestions-footer = Dette { $shortcut } jus sidá gájka { $total } komponentav vuojnnet.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } gehtjal dási: { $target }.
       *[other] { $ref } gehtjal dási: { $target } (linnjá { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] { $owner } la dav buktám rollajn { $role }.
       *[other] { $owner } la dav buktám linnján { $line } rollajn { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } gehtjal { $element } iesjvuohtaj { $property }.
       *[other] { $ref } gehtjal { $element } iesjvuohtaj { $property } (linnjá { $line }).
    }

help-kind-attribute = attribuhtta
help-kind-snippet = tekstabihtá
help-kind-array-entry = liste lahtto

help-default = Standárda:
help-active-default = Doajmme standárda:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Lubák árvo (akta juohkka lahtoj):
       *[other] Lubák árvo:
    }

help-suggested-values = Ávvaduvvam árvo:

help-inserts = Bidjá sisa:

help-coordinates =
    { $count ->
        [one] Koordináhtta:
       *[other] Koordináhta:
    }

help-type = Sjláj:

help-resolved-style = Mierreduvvam stijlla (styleNumber { $styleNumber }):

help-resolved-function-names = Mierreduvvam funksjuvnanama:
help-reset-list = Máhtsadimliste dán sisabiedjamij:
help-added-on-input = Lassiduvvam dán sisabiedjamij:
help-removed-on-input = Válldedum eret dán sisabiedjamis:

help-reset-overrides = { $reset } badjelgehtjá { $additional } ja { $removed }.
