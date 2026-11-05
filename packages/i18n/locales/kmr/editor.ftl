# Northern Kurdish (Kurmanji) editor and language-server surfaces. Translated
# from `locales/en/editor.ftl`, which is the source of truth: `lint:i18n`
# rejects a key that does not exist there, and reports a key that exists there
# but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Named `kmr`, not `ku`.** `ku` is the macrolanguage over Northern, Central
# and Southern Kurdish, and Central Kurdish (Sorani) ships beside this catalog
# as `locales/ckb`; a directory called `ku` would claim to cover a sibling it
# cannot serve. `negotiate.ts` aliases `ku` onto `kmr`, so a document written
# with either tag reaches this catalog. See `locales/kmr/content.ftl` for the
# full note.
#
# Northern Kurdish (Kurmanji) in the Hawar Latin alphabet, the orthography of
# Kurmanji publishing in Turkey, Syria and the diaspora and what CLDR fills a
# bare `ku` in as (`ku-Latn-TR`). Left to right. A `ku-Arab` reader reaches
# this catalog and gets Latin; Central Kurdish (Sorani) is `locales/ckb`, a
# separate right-to-left catalog beside it.
#
# `WCAG AA`, `DoenetML`, `XML`, `styleNumber` and every attribute or element
# name are identifiers, not prose, and stay as written.
#
# Kurmanji counts in two categories, `one` and `other`, so every selection
# below keeps both branches; a noun after a numeral stays singular, so the two
# differ only in the verb. Nothing here agrees with a noun class or gender —
# the ezafe fork lives in `content.ftl`, where the noun is known.
#
# The LSP ships bundled with its DoenetML version, so this catalog is
# version-correct rather than always-latest.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Vegerîne
       *[update] Nû bike
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word }: Nîşander
       *[other] { $word }: Nîşander { $shortcut }
    }


## The variant picker

editor-variant = Varyant
editor-variant-filter = Parzûn…
editor-variant-next = Varyanta pêş hilbijêre
editor-variant-previous = Varyanta berê hilbijêre


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] Binpêkirineke gihîştinê ya WCAG AA hate dîtin. Ji bo { $action ->
            [close] girtina
           *[open] vekirina
        } rapora gihîştinê bitikîne.
        [advisories] Ji bo { $action ->
            [close] girtina
           *[open] vekirina
        } rapora gihîştinê bitikîne. Tu binpêkirineke WCAG AA nehate dîtin, lê pêşniyarên gihîştinê yên din hene.
       *[clean] Ji bo { $action ->
            [close] girtina
           *[open] vekirina
        } rapora gihîştinê bitikîne. Tu pirsgirêkeke gihîştinê nehate dîtin.
    }

editor-accessibility-label =
    { $status ->
        [violations] Binpêkirineke gihîştinê ya WCAG AA hate dîtin. { $count ->
            [one] { $count } binpêkirina WCAG AA
           *[other] { $count } binpêkirinên WCAG AA
        } hate dîtin. Ji bo { $action ->
            [close] girtina
           *[open] vekirina
        } rapora gihîştinê bitikîne.
        [advisories] Tu binpêkirineke WCAG AA nehate dîtin. { $count ->
            [one] { $count } pêşniyara gihîştinê ya zêde
           *[other] { $count } pêşniyarên gihîştinê yên zêde
        } hate dîtin. Ji bo { $action ->
            [close] girtina
           *[open] vekirina
        } rapora gihîştinê bitikîne.
       *[clean] Tu binpêkirineke WCAG AA nehate dîtin. Ji bo { $action ->
            [close] girtina
           *[open] vekirina
        } rapora gihîştinê bitikîne.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = Guhertoya DoenetML { $version }

editor-tab-help = Alîkariya li gorî cihê kursorê
editor-tab-help-short = Kontekst
editor-tab-errors = Çewtî
editor-tab-warnings = Hişyarî
editor-tab-info = Agahî
editor-tab-accessibility = Gihîştin
editor-tab-responses = Bersivên şandin

editor-tab-with-count = { $label }: { $count }

editor-options = Vebijarkên edîtorê
editor-format-as-doenetml = Wekî DoenetML format bike
editor-format-as-xml = Wekî XML format bike


## The diagnostics panel

editor-diagnostic-line = Rêz #{ $line }

editor-no-errors = Çewtî Tune
editor-no-warnings = Hişyarî Tune
editor-no-info = Agahiyên Teşhîsê Tune

editor-show-info-annotations = Agahiyên teşhîsê di edîtorê de nîşan bide
editor-show-accessibility-annotations = Teşhîsên gihîştinê di edîtorê de nîşan bide

editor-accessibility-learn-more = Fêr bibe ka Doenet çawa nêzîkî gihîştinê dibe

editor-accessibility-violations-heading = Binpêkirinên gihîştinê ({ $standard })

editor-accessibility-other-heading = Pirsgirêkên din ên gihîştinê
editor-none-found = Tiştek nehate dîtin


## Submitted responses

editor-no-responses = Hê tu bersiv nehatiye şandin
editor-response-answer-id = Nasnavê Bersivê
editor-response-response = Bersiv
editor-response-credit = Xal
editor-response-submitted = Hate şandin


## The context-help panel

help-placeholder = Ji bo belgekirinê kursorê deyne ser navekî etîketê, taybetmendiyekê an { $ref }.

help-unsupported-ref-chain = Alîkarî ji bo referansên pirparçe yên wekî { $example } hê nayê piştgirîkirin.

help-unresolved-ref =
    { $reason ->
        [notFound] Ji bo referansê tu armanc nehate dîtin: { $ref }.
        [multiple] Ji bo referansê çend armanc hatin dîtin: { $ref }.
       *[indeterminate] Armanca { $ref } nehate diyarkirin.
    }

help-learn-about-references = Derbarê referansan de fêr bibe →
help-reference-page = Rûpela referansê →

help-suggestions-header =
    { $location ->
        [inside] Di nav { $element } de
       *[top] Li asta jorîn
    }{ $allowed ->
        [none] { " — tiştek li vir nayê." }
        [text] { " — li vir nivîsê binivîse." }
        [text-and-components] { " — li vir nivîsê binivîse, an van biceribîne:" }
       *[components] { " — tiştên ku bên ceribandin:" }
    }

help-suggestions-footer = Ji bo dîtina hemû { $total } pêkhateyan { $shortcut } bitikîne.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } referanseke ji bo { $target } e.
       *[other] { $ref } referanseke ji bo { $target } e (rêz { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] Ji aliyê { $owner } ve wekî { $role } hate danîn.
       *[other] Ji aliyê { $owner } ve li rêza { $line } wekî { $role } hate danîn.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } referanseke ji bo taybetmendiya { $property } ya { $element } e.
       *[other] { $ref } referanseke ji bo taybetmendiya { $property } ya { $element } e (rêz { $line }).
    }

help-kind-attribute = taybetmendî
help-kind-snippet = perçenivîs
help-kind-array-entry = hêmana rêzeyê

help-default = Standard:
help-active-default = Standarda çalak:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Nirxên destûrdar (ji bo her hêmanekê yek):
       *[other] Nirxên destûrdar:
    }

help-suggested-values = Nirxên pêşniyarkirî:

help-inserts = Lê zêde dike:

# Kurmanji does not mark the plural in the direct case, so the two branches
# read alike. They are kept because the plural categories are what
# `Intl.PluralRules` reports, not because the words differ.
help-coordinates =
    { $count ->
        [one] Koordînat:
       *[other] Koordînat:
    }

help-type = Cure:

help-resolved-style = Şêwaza çareserkirî (styleNumber { $styleNumber }):

help-resolved-function-names = Navên fonksiyonên çareserkirî:
help-reset-list = Lîsteya jinûvedanînê ya li ser vê têketinê:
help-added-on-input = Li vê têketinê hate zêdekirin:
help-removed-on-input = Ji vê têketinê hate rakirin:

help-reset-overrides = { $reset } li ser { $additional } û { $removed } digire.
