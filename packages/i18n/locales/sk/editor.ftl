# Slovak editor and language-server surfaces. Translated from
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


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Obnoviť
       *[update] Aktualizovať
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } prehliadač
       *[other] { $word } prehliadač { $shortcut }
    }


## The variant picker

editor-variant = Variant
editor-variant-filter = Filter…
editor-variant-next = Vybrať ďalší variant
editor-variant-previous = Vybrať predchádzajúci variant


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] Zistilo sa porušenie prístupnosti WCAG AA. Kliknutím { $action ->
            [close] zavriete
           *[open] otvoríte
        } správu o prístupnosti.
        [advisories] Kliknutím { $action ->
            [close] zavriete
           *[open] otvoríte
        } správu o prístupnosti. Nenašli sa žiadne porušenia WCAG AA, no k dispozícii sú ďalšie odporúčania k prístupnosti.
       *[clean] Kliknutím { $action ->
            [close] zavriete
           *[open] otvoríte
        } správu o prístupnosti. Nenašli sa žiadne problémy s prístupnosťou.
    }

editor-accessibility-label =
    { $status ->
        [violations] Zistilo sa porušenie prístupnosti WCAG AA. Našlo sa { $count ->
            [one] { $count } porušenie WCAG AA
            [few] { $count } porušenia WCAG AA
           *[other] { $count } porušení WCAG AA
        }. Kliknutím { $action ->
            [close] zavriete
           *[open] otvoríte
        } správu o prístupnosti.
        [advisories] Nezistili sa žiadne porušenia WCAG AA. Našlo sa { $count ->
            [one] { $count } ďalšie odporúčanie k prístupnosti
            [few] { $count } ďalšie odporúčania k prístupnosti
           *[other] { $count } ďalších odporúčaní k prístupnosti
        }. Kliknutím { $action ->
            [close] zavriete
           *[open] otvoríte
        } správu o prístupnosti.
       *[clean] Nezistili sa žiadne porušenia WCAG AA. Kliknutím { $action ->
            [close] zavriete
           *[open] otvoríte
        } správu o prístupnosti.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = Verzia DoenetML { $version }

editor-tab-help = Kontextový pomocník
editor-tab-help-short = Kontext
editor-tab-errors = Chyby
editor-tab-warnings = Varovania
editor-tab-info = Informácie
editor-tab-accessibility = Prístupnosť
editor-tab-responses = Odoslané odpovede

editor-tab-with-count = { $label }: { $count }

editor-options = Nastavenia editora
editor-format-as-doenetml = Formátovať ako DoenetML
editor-format-as-xml = Formátovať ako XML


## The diagnostics panel

editor-diagnostic-line = Riadok č. { $line }

editor-no-errors = Žiadne chyby
editor-no-warnings = Žiadne varovania
editor-no-info = Žiadne informačné hlásenia

editor-show-info-annotations = Zobrazovať informačné hlásenia v editore
editor-show-accessibility-annotations = Zobrazovať hlásenia o prístupnosti v editore

editor-accessibility-learn-more = Ako Doenet pristupuje k prístupnosti

editor-accessibility-violations-heading = Porušenia prístupnosti ({ $standard })

editor-accessibility-other-heading = Ďalšie problémy s prístupnosťou
editor-none-found = Nič sa nenašlo


## Submitted responses

editor-no-responses = Zatiaľ žiadne odoslané odpovede
editor-response-answer-id = Id odpovede
editor-response-response = Odpoveď
editor-response-credit = Hodnotenie
editor-response-submitted = Odoslané


## The context-help panel

help-placeholder = Umiestnite kurzor na názov značky, atribút alebo { $ref } a zobrazí sa dokumentácia.

help-unsupported-ref-chain = Pomoc pre viacdielne odkazy ako { $example } zatiaľ nie je podporovaná.

help-unresolved-ref =
    { $reason ->
        [notFound] Pre odkaz sa nenašiel žiadny cieľ: { $ref }.
        [multiple] Pre odkaz sa našlo viac cieľov: { $ref }.
       *[indeterminate] Cieľ pre { $ref } sa nepodarilo určiť.
    }

help-learn-about-references = Viac o odkazoch →
help-reference-page = Referenčná stránka →

help-suggestions-header =
    { $location ->
        [inside] Vnútri { $element }
       *[top] Na najvyššej úrovni
    }{ $allowed ->
        [none] { " — sem nič nepatrí." }
        [text] { " — sem sa píše text." }
        [text-and-components] { " — sem sa píše text, alebo možno skúsiť:" }
       *[components] { " — čo možno skúsiť:" }
    }

help-suggestions-footer = Stlačením { $shortcut } sa zobrazia všetky komponenty ({ $total }).

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } je odkaz na { $target }.
       *[other] { $ref } je odkaz na { $target } (riadok { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] Zavedené komponentom { $owner } ako { $role }.
       *[other] Zavedené komponentom { $owner } na riadku { $line } ako { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } je odkaz na vlastnosť { $property } komponentu { $element }.
       *[other] { $ref } je odkaz na vlastnosť { $property } komponentu { $element } (riadok { $line }).
    }

help-kind-attribute = atribút
help-kind-snippet = úryvok
help-kind-array-entry = položka poľa

help-default = Predvolená hodnota:
help-active-default = Platná predvolená hodnota:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Povolené hodnoty (jedna na položku):
       *[other] Povolené hodnoty:
    }

help-suggested-values = Odporúčané hodnoty:

help-inserts = Vloží:

help-coordinates =
    { $count ->
        [one] Súradnica:
       *[other] Súradnice:
    }

help-type = Typ:

help-resolved-style = Vyhodnotený štýl (styleNumber { $styleNumber }):

help-resolved-function-names = Vyhodnotené názvy funkcií:
help-reset-list = Resetované na tomto vstupe:
help-added-on-input = Pridané na tomto vstupe:
help-removed-on-input = Odobraté na tomto vstupe:

help-reset-overrides = { $reset } má prednosť pred { $additional } a { $removed }.
