# Talysh editor and language-server surfaces. Translated from
# `locales/en/editor.ftl`, which is the source of truth: `lint:i18n` rejects a
# key that does not exist there, and reports a key that exists there but not
# here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Written in the **Latin** orthography Talysh publishing in Azerbaijan uses —
# the Azerbaijani alphabet, with ə, ı, ö, ü, ğ, ş and ç — which is what CLDR
# fills the bare tag in as (`tly` maximizes to `tly-Latn-AZ`). A reader
# arriving under `tly-Cyrl` or `tly-Arab` reaches this catalog and gets Latin;
# a second catalog beside this one is the answer to that, not a rename of it.
#
# `WCAG AA`, `DoenetML`, `XML`, `styleNumber` and every attribute or element
# name are identifiers, not prose, and stay as written.
#
# Talysh counts in the same two categories English does, `one` and `other`, so
# every selection below keeps both branches — though a noun after a numeral
# stays singular, so the two read alike.
#
# Talysh has no grammatical gender and no noun class, so nothing here agrees
# with anything. That is the whole of the agreement story for this locale; see
# `content.ftl`'s header.
#
# The editor vocabulary is the least settled part of this seed. Talysh has no
# software register of its own, so «nışondəkə» (renderer), «dastrəsi»
# (accessibility) and «hoşdor» (warning) are coined here on Azerbaijani and
# Persian models rather than taken from use.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Oqarde
       *[update] Təzə kardey
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] Nışondə { $word }
       *[other] Nışondə { $word } { $shortcut }
    }


## The variant picker

editor-variant = Variant
editor-variant-filter = Süzgəc…
editor-variant-next = Peşinə variant peqətey
editor-variant-previous = Navınə variant peqətey


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] WCAG AA dastrəsi pozey peydo be. Dastrəsi hesobot { $action ->
            [close] bandeyro
           *[open] oj kardeyro
        } kılik bıkə.
        [advisories] Dastrəsi hesobot { $action ->
            [close] bandeyro
           *[open] oj kardeyro
        } kılik bıkə. WCAG AA pozey peydo nıbe, əmmo co dastrəsi məsləhəton heste.
       *[clean] Dastrəsi hesobot { $action ->
            [close] bandeyro
           *[open] oj kardeyro
        } kılik bıkə. Dastrəsi məsələ peydo nıbe.
    }

editor-accessibility-label =
    { $status ->
        [violations] WCAG AA dastrəsi pozey peydo be. { $count ->
            [one] { $count } WCAG AA pozey
           *[other] { $count } WCAG AA pozey
        } peydo be. Dastrəsi hesobot { $action ->
            [close] bandeyro
           *[open] oj kardeyro
        } kılik bıkə.
        [advisories] WCAG AA pozey peydo nıbe. { $count ->
            [one] { $count } co dastrəsi məsləhət
           *[other] { $count } co dastrəsi məsləhət
        } peydo be. Dastrəsi hesobot { $action ->
            [close] bandeyro
           *[open] oj kardeyro
        } kılik bıkə.
       *[clean] WCAG AA pozey peydo nıbe. Dastrəsi hesobot { $action ->
            [close] bandeyro
           *[open] oj kardeyro
        } kılik bıkə.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML versiya { $version }

editor-tab-help = Konteksti kümək
editor-tab-help-short = Kontekst
editor-tab-errors = Xətoon
editor-tab-warnings = Hoşdoron
editor-tab-info = Məlumat
editor-tab-accessibility = Dastrəsi
editor-tab-responses = Vığandə cəvobon

editor-tab-with-count = { $label }: { $count }

editor-options = Redaktori nizomon
editor-format-as-doenetml = DoenetML kimi formatlə kardey
editor-format-as-xml = XML kimi formatlə kardey


## The diagnostics panel

editor-diagnostic-line = Sətir #{ $line }

editor-no-errors = Xəto ni
editor-no-warnings = Hoşdor ni
editor-no-info = Məlumatə xəbər ni

editor-show-info-annotations = Məlumatə xəbəron redaktordə nışon doy
editor-show-accessibility-annotations = Dastrəsi xəbəron redaktordə nışon doy

editor-accessibility-learn-more = Doenet dastrəsiyədə çı cür kor kardedə, bızın

editor-accessibility-violations-heading = Dastrəsi pozeyon ({ $standard })

editor-accessibility-other-heading = Co dastrəsi məsələon
editor-none-found = Heçi peydo nıbe


## Submitted responses

editor-no-responses = Hələ vığandə cəvob ni
editor-response-answer-id = Cəvobi Id
editor-response-response = Cəvob
editor-response-credit = Bal
editor-response-submitted = Vığandə be


## The context-help panel

help-placeholder = Sənədnoməro kursor bəqət teqi nom, atribut ya { $ref } sədo.

help-unsupported-ref-chain = { $example } kimi çandpoəyinə istinodonro kümək hələ ni.

help-unresolved-ref =
    { $reason ->
        [notFound] İstinodro obyekt peydo nıbe: { $ref }.
        [multiple] İstinodro çand obyekt peydo be: { $ref }.
       *[indeterminate] { $ref } obyekt təyin be nışe.
    }

help-learn-about-references = İstinodon barədə bızın →
help-reference-page = Məlumatə səhifə →

help-suggestions-header =
    { $location ->
        [inside] { $element } dılədə
       *[top] Ən co səviyyədə
    }{ $allowed ->
        [none] { " — ıyo heçi nibe." }
        [text] { " — ıyo mətn nıvışte bəbe." }
        [text-and-components] { " — ıyo mətn nıvışte bəbe, ya ımon sınəğ bıkə:" }
       *[components] { " — ımon sınəğ bıkə:" }
    }

help-suggestions-footer = Həmmə { $total } komponent vindeyro { $shortcut } bıjən.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } — { $target } obyektiro istinod.
       *[other] { $ref } — { $target } obyektiro istinod (sətir { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] { $owner } ıji { $role } kimi dənoə.
       *[other] { $owner } ıji sətir { $line }-də { $role } kimi dənoə.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } — { $element } elementi { $property } xüsusiyəti istinod.
       *[other] { $ref } — { $element } elementi { $property } xüsusiyəti istinod (sətir { $line }).
    }

help-kind-attribute = atribut
help-kind-snippet = ğəlib
help-kind-array-entry = massivi element

help-default = Əsosə ğıymət:
help-active-default = Fəolə əsosə ğıymət:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] İcozəynə ğıyməton (har elementiro i):
       *[other] İcozəynə ğıyməton:
    }

help-suggested-values = Məsləhət bə ğıyməton:

help-inserts = Dənoydə:

help-coordinates =
    { $count ->
        [one] Koordinat:
       *[other] Koordinaton:
    }

help-type = Tip:

help-resolved-style = Təyin bə stil (styleNumber { $styleNumber }):

help-resolved-function-names = Təyin bə funksiya nomon:
help-reset-list = Ə dənoydədə oqardeyro siyahi:
help-added-on-input = Ə dənoydədə əlovə bə:
help-removed-on-input = Ə dənoydədə bekardə bə:

help-reset-overrides = { $reset } { $additional } iyən { $removed } sədo qıləni.
