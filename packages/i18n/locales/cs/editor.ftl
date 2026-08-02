# Czech editor and language-server surfaces. Translated from
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
        [reset] Obnovit
       *[update] Aktualizovat
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } prohlížeč
       *[other] { $word } prohlížeč { $shortcut }
    }


## The variant picker

editor-variant = Varianta
editor-variant-filter = Filtr…
editor-variant-next = Vybrat další variantu
editor-variant-previous = Vybrat předchozí variantu


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] Bylo zjištěno porušení přístupnosti WCAG AA. Kliknutím { $action ->
            [close] zavřete
           *[open] otevřete
        } zprávu o přístupnosti.
        [advisories] Kliknutím { $action ->
            [close] zavřete
           *[open] otevřete
        } zprávu o přístupnosti. Žádná porušení WCAG AA nebyla nalezena, ale jsou k dispozici další doporučení k přístupnosti.
       *[clean] Kliknutím { $action ->
            [close] zavřete
           *[open] otevřete
        } zprávu o přístupnosti. Nebyly nalezeny žádné problémy s přístupností.
    }

# The counted noun is the same in all three forms — «porušení» and
# «doporučení» are neuter nouns whose nominative and genitive plurals are
# spelled alike — but the participle in front of it is not: Czech agrees it
# with a plural for two to four and leaves it neuter singular otherwise. So the
# participle sits inside the select rather than in front of it.
editor-accessibility-label =
    { $status ->
        [violations] Bylo zjištěno porušení přístupnosti WCAG AA. { $count ->
            [one] Nalezeno { $count } porušení WCAG AA
            [few] Nalezena { $count } porušení WCAG AA
           *[other] Nalezeno { $count } porušení WCAG AA
        }. Kliknutím { $action ->
            [close] zavřete
           *[open] otevřete
        } zprávu o přístupnosti.
        [advisories] Žádná porušení WCAG AA nebyla zjištěna. { $count ->
            [one] Nalezeno { $count } další doporučení k přístupnosti
            [few] Nalezena { $count } další doporučení k přístupnosti
           *[other] Nalezeno { $count } dalších doporučení k přístupnosti
        }. Kliknutím { $action ->
            [close] zavřete
           *[open] otevřete
        } zprávu o přístupnosti.
       *[clean] Žádná porušení WCAG AA nebyla zjištěna. Kliknutím { $action ->
            [close] zavřete
           *[open] otevřete
        } zprávu o přístupnosti.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = Verze DoenetML { $version }

editor-tab-help = Kontextová nápověda
editor-tab-help-short = Kontext
editor-tab-errors = Chyby
editor-tab-warnings = Varování
editor-tab-info = Informace
editor-tab-accessibility = Přístupnost
editor-tab-responses = Odeslané odpovědi

editor-tab-with-count = { $label }: { $count }

editor-options = Nastavení editoru
editor-format-as-doenetml = Formátovat jako DoenetML
editor-format-as-xml = Formátovat jako XML


## The diagnostics panel

editor-diagnostic-line = Řádek č. { $line }

editor-no-errors = Žádné chyby
editor-no-warnings = Žádná varování
editor-no-info = Žádná informační hlášení

editor-show-info-annotations = Zobrazovat informační hlášení v editoru
editor-show-accessibility-annotations = Zobrazovat hlášení o přístupnosti v editoru

editor-accessibility-learn-more = Jak Doenet přistupuje k přístupnosti

editor-accessibility-violations-heading = Porušení přístupnosti ({ $standard })

editor-accessibility-other-heading = Další problémy s přístupností
editor-none-found = Nic nenalezeno


## Submitted responses

editor-no-responses = Zatím žádné odeslané odpovědi
editor-response-answer-id = Id odpovědi
editor-response-response = Odpověď
editor-response-credit = Hodnocení
editor-response-submitted = Odesláno


## The context-help panel

help-placeholder = Umístěte kurzor na název značky, atribut nebo { $ref } a zobrazí se dokumentace.

help-unsupported-ref-chain = Nápověda pro vícedílné odkazy jako { $example } zatím není podporována.

help-unresolved-ref =
    { $reason ->
        [notFound] Pro odkaz nebyl nalezen žádný cíl: { $ref }.
        [multiple] Pro odkaz bylo nalezeno více cílů: { $ref }.
       *[indeterminate] Cíl pro { $ref } nebylo možné určit.
    }

help-learn-about-references = Více o odkazech →
help-reference-page = Referenční stránka →

help-suggestions-header =
    { $location ->
        [inside] Uvnitř { $element }
       *[top] Na nejvyšší úrovni
    }{ $allowed ->
        [none] { " — sem nic nepatří." }
        [text] { " — sem se píše text." }
        [text-and-components] { " — sem se píše text, nebo lze zkusit:" }
       *[components] { " — co lze zkusit:" }
    }

help-suggestions-footer = Stisknutím { $shortcut } se zobrazí všechny komponenty ({ $total }).

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } je odkaz na { $target }.
       *[other] { $ref } je odkaz na { $target } (řádek { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] Zavedeno komponentou { $owner } jako { $role }.
       *[other] Zavedeno komponentou { $owner } na řádku { $line } jako { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } je odkaz na vlastnost { $property } komponenty { $element }.
       *[other] { $ref } je odkaz na vlastnost { $property } komponenty { $element } (řádek { $line }).
    }

help-kind-attribute = atribut
help-kind-snippet = úryvek
help-kind-array-entry = položka pole

help-default = Výchozí hodnota:
help-active-default = Platná výchozí hodnota:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Povolené hodnoty (jedna na položku):
       *[other] Povolené hodnoty:
    }

help-suggested-values = Doporučené hodnoty:

help-inserts = Vloží:

# «souřadnice» is spelled alike in the singular and the plural, so the count
# picks nothing and the message is not a select.
help-coordinates = Souřadnice:

help-type = Typ:

help-resolved-style = Vyhodnocený styl (styleNumber { $styleNumber }):

help-resolved-function-names = Vyhodnocené názvy funkcí:
help-reset-list = Reset seznamu na tomto vstupu:
help-added-on-input = Přidáno na tomto vstupu:
help-removed-on-input = Odebráno na tomto vstupu:

help-reset-overrides = { $reset } má přednost před { $additional } a { $removed }.
