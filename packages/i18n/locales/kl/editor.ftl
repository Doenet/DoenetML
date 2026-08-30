# Kalaallisut (Greenlandic) editor and language-server surfaces. Translated
# from `locales/en/editor.ftl`, which is the source of truth: `lint:i18n`
# rejects a key that does not exist there, and reports a key that exists there
# but not here as missing coverage.
#
# `WCAG AA`, `DoenetML`, `XML`, `styleNumber` and every attribute or element
# name are identifiers, not prose, and stay exactly as written.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Orthography.** The 1973 orthography; **ĸ (U+0138) appears nowhere**, and
# every such sound is written `q`. Length is written by doubling.
# `chrome.ftl` sets the letters out in full. A Danish loan keeps its Danish
# spelling where it is the word actually in use — «variant», «filter»,
# «standardi», «koordinati», «funktioni», «version», «linje» — and this file
# has more of those than the other three, because the editor is a developer
# surface and Greenlandic has no separate register for it.
#
# **Number.** `kl` selects **one** and **other**, and both are written where
# a count is selected on: a counted noun takes the plural ending, so the two
# branches differ in more than the digit.
#
# **Suffixes and placeables.** A Kalaallisut case ending cannot be welded onto
# a placeable — `{ $element }`, `{ $ref }`, `{ $shortcut }` — whose final
# sound this catalog never sees. Where English used a preposition, the
# sentence is built around the argument with separate words. A hyphen onto a
# *literal* identifier is fine and is used: «DoenetML-ip versionia».
#
# **This is the thinnest of the four files, and the context-help panel is
# where it thins out.** Every message in it is covered, but several are
# carried by Danish loans rather than by Kalaallisut words — «attributi»,
# «snippeti», «array», «standardi», «koordinati», «funktioni» — because the
# language-server concepts behind them have no settled Greenlandic term.
# «Innersuussut» for *reference* is the one Kalaallisut word this file leans
# on hardest, and it is the first thing a reviewer should look at.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Utertiguk
       *[update] Nutarteruk
    }
editor-update-viewer-title =
    { $shortcut ->
        [none] Takutitsissut { $word }
       *[other] Takutitsissut { $word } { $shortcut }
    }


## The variant picker

editor-variant = Variant
editor-variant-filter = Filter...
editor-variant-next = Variant tulleq toqqaruk
editor-variant-previous = Variant siulia toqqaruk


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] WCAG AA atorsinnaanermut unioqqutitsineq nassaarineqarpoq. Atorsinnaanermut nalunaarusiaq { $action ->
            [close] matuniarlugu
           *[open] ammarniarlugu
        } tooruk.
        [advisories] Atorsinnaanermut nalunaarusiaq { $action ->
            [close] matuniarlugu
           *[open] ammarniarlugu
        } tooruk. WCAG AA unioqqutitsinernik nassaarineqanngilaq, atorsinnaanermulli siunnersuutit allat pigineqarput.
       *[clean] Atorsinnaanermut nalunaarusiaq { $action ->
            [close] matuniarlugu
           *[open] ammarniarlugu
        } tooruk. Atorsinnaanermut ajornartorsiutinik nassaarineqanngilaq.
    }

editor-accessibility-label =
    { $status ->
        [violations] WCAG AA atorsinnaanermut unioqqutitsineq nassaarineqarpoq. { $count ->
            [one] WCAG AA unioqqutitsineq { $count }
           *[other] WCAG AA unioqqutitsinerit { $count }
        } nassaarineqarput. Atorsinnaanermut nalunaarusiaq { $action ->
            [close] matuniarlugu
           *[open] ammarniarlugu
        } tooruk.
        [advisories] WCAG AA unioqqutitsinernik nassaarineqanngilaq. Atorsinnaanermut siunnersuutit allat { $count ->
            [one] { $count }
           *[other] { $count }
        } nassaarineqarput. Atorsinnaanermut nalunaarusiaq { $action ->
            [close] matuniarlugu
           *[open] ammarniarlugu
        } tooruk.
       *[clean] WCAG AA unioqqutitsinernik nassaarineqanngilaq. Atorsinnaanermut nalunaarusiaq { $action ->
            [close] matuniarlugu
           *[open] ammarniarlugu
        } tooruk.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML-ip versionia { $version }

editor-tab-help = Ikiuut sumiiffimmut naleqquttoq
editor-tab-help-short = Sumiiffik
editor-tab-errors = Kukkunerit
editor-tab-warnings = Mianersoqqussutit
editor-tab-info = Paasissutissat
editor-tab-accessibility = Atorsinnaaneq
editor-tab-responses = Akissutit nassiunneqartut
editor-tab-with-count = { $label }: { $count }

editor-options = Periarfissat
editor-format-as-doenetml = DoenetML-itut ilusilersoruk
editor-format-as-xml = XML-itut ilusilersoruk


## The diagnostics panel

editor-diagnostic-line = Linje #{ $line }

editor-no-errors = Kukkuneqanngilaq
editor-no-warnings = Mianersoqqussuteqanngilaq
editor-no-info = Paasissutissaqanngilaq

editor-show-info-annotations = Paasissutissat allattuiffimmi takutikkit
editor-show-accessibility-annotations = Atorsinnaanermut paasissutissat allattuiffimmi takutikkit

editor-accessibility-learn-more = Doenet-ip atorsinnaaneq qanoq isigigaa
editor-accessibility-violations-heading = Atorsinnaanermut unioqqutitsinerit ({ $standard })
editor-accessibility-other-heading = Atorsinnaanermut ajornartorsiutit allat
editor-none-found = Nassaarineqanngilaq


## Submitted responses

editor-no-responses = Akissutit nassiunneqartut suli peqanngillat
editor-response-answer-id = Akissutip normua
editor-response-response = Akissut
editor-response-credit = Poointit
editor-response-submitted = Nassiunneqarpoq


## The context-help panel

help-placeholder = Nalunaarsuutit pissarsiarilerlugit markøri tag-ip atianut, attributimut imaluunniit { $ref } tungaanut inissikkiuk.

help-unsupported-ref-chain = Innersuussutit ilaqartut soorlu { $example } suli atorneqarsinnaanngillat.

help-unresolved-ref =
    { $reason ->
        [notFound] Innersuussutimut referent nassaarineqanngilaq: { $ref }.
        [multiple] Innersuussutimut referent-it arlallit nassaarineqarput: { $ref }.
       *[indeterminate] { $ref } tungaanut referent aalajangersarneqarsinnaanngilaq.
    }

help-learn-about-references = Innersuussutit pillugit ilikkaruk →
help-reference-page = Nalunaarsuutit quppernerat →

help-suggestions-header =
    { $location ->
        [inside] { $element } iluani
       *[top] Allakkat qaavani
    }{ $allowed ->
        [none] { " — maani suussanngilaq." }
        [text] { " — maani allaguk." }
        [text-and-components] { " — maani allaguk, imaluunniit misiliguk:" }
       *[components] { " — misiligassat:" }
    }

help-suggestions-footer = Komponentit tamaasa { $total } takujumallugit { $shortcut } tooruk.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } tassaavoq innersuussut una tungaanut: { $target }.
       *[other] { $ref } tassaavoq innersuussut una tungaanut: { $target } (linje { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] Aallartitaq: { $owner }, tassanilu { $role }.
       *[other] Aallartitaq: { $owner }, linjemi { $line }, tassanilu { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } tassaavoq innersuussut una tungaanut: { $element } pigisaa { $property }.
       *[other] { $ref } tassaavoq innersuussut una tungaanut: { $element } pigisaa { $property } (linje { $line }).
    }

help-kind-attribute = attribut
help-kind-snippet = snippet
help-kind-array-entry = array-ip ilaa

help-default = Standardi:
help-active-default = Standardi atorneqartoq:
help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Nalit akuerisat (ataasiakkaanut ataaseq):
       *[other] Nalit akuerisat:
    }

help-suggested-values = Siunnersuutit:
help-inserts = Ilanngunneqartut:

help-coordinates =
    { $count ->
        [one] Koordinati:
       *[other] Koordinatit:
    }

help-type = Suussusia:
help-resolved-style = Ilusaa (styleNumber { $styleNumber }):
help-resolved-function-names = Funktionit aqqi:
help-reset-list = Input-imi uani utertinneqartut:
help-added-on-input = Input-imi uani ilanngunneqartut:
help-removed-on-input = Input-imi uani peerneqartut:

help-reset-overrides = { $reset } { $additional } aamma { $removed } sinnerpai.
