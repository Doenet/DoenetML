# Faroese editor and language-server surfaces. Translated from
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
# Faroese counts in the same two categories English does, so every selection
# below keeps both branches.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Nullstilla
       *[update] Dagfør
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } vísaran
       *[other] { $word } vísaran { $shortcut }
    }


## The variant picker

editor-variant = Útgáva
editor-variant-filter = Sía…
editor-variant-next = Vel næstu útgávu
editor-variant-previous = Vel fyrru útgávu


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] Brot á WCAG AA atkomukrøv er funnið. Trýst fyri at { $action ->
            [close] lata aftur
           *[open] lata upp
        } atkomufrágreiðingina.
        [advisories] Trýst fyri at { $action ->
            [close] lata aftur
           *[open] lata upp
        } atkomufrágreiðingina. Eingi WCAG AA brot vórðu funnin, men fleiri atkomutilmæli eru tøk.
       *[clean] Trýst fyri at { $action ->
            [close] lata aftur
           *[open] lata upp
        } atkomufrágreiðingina. Eingi atkomutrupulleikar vórðu funnir.
    }

editor-accessibility-label =
    { $status ->
        [violations] Brot á WCAG AA atkomukrøv er funnið. { $count ->
            [one] { $count } WCAG AA brot varð funnið
           *[other] { $count } WCAG AA brot vórðu funnin
        }. Trýst fyri at { $action ->
            [close] lata aftur
           *[open] lata upp
        } atkomufrágreiðingina.
        [advisories] Eingi WCAG AA brot vórðu funnin. { $count ->
            [one] { $count } eyka atkomutilmæli varð funnið
           *[other] { $count } eyka atkomutilmæli vórðu funnin
        }. Trýst fyri at { $action ->
            [close] lata aftur
           *[open] lata upp
        } atkomufrágreiðingina.
       *[clean] Eingi WCAG AA brot vórðu funnin. Trýst fyri at { $action ->
            [close] lata aftur
           *[open] lata upp
        } atkomufrágreiðingina.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML útgáva { $version }

editor-tab-help = Samanhangandi hjálp
editor-tab-help-short = Samanhangur
editor-tab-errors = Villur
editor-tab-warnings = Ávaringar
editor-tab-info = Kunning
editor-tab-accessibility = Atkoma
editor-tab-responses = Innsend svør

editor-tab-with-count = { $label }: { $count }

editor-options = Kostir í ritlinum
editor-format-as-doenetml = Sníð sum DoenetML
editor-format-as-xml = Sníð sum XML


## The diagnostics panel

editor-diagnostic-line = Linja #{ $line }

editor-no-errors = Ongar villur
editor-no-warnings = Ongar ávaringar
editor-no-info = Ongar kunningarmeldingar

editor-show-info-annotations = Vís kunningarmeldingar í ritlinum
editor-show-accessibility-annotations = Vís atkomumeldingar í ritlinum

editor-accessibility-learn-more = Lær hvussu Doenet viðger atkomu

editor-accessibility-violations-heading = Atkomubrot ({ $standard })

editor-accessibility-other-heading = Aðrir atkomutrupulleikar
editor-none-found = Einki funnið


## Submitted responses

editor-no-responses = Eingi svør eru send enn
editor-response-answer-id = Eyðkenni svars
editor-response-response = Svar
editor-response-credit = Stig
editor-response-submitted = Sent


## The context-help panel

help-placeholder = Set skrivimerkið á eitt merkisnavn, ein eginleika ella { $ref } fyri at síggja skjalfestingina.

help-unsupported-ref-chain = Hjálp fyri fleirpartaðar tilvísingar sum { $example } er ikki stuðlað enn.

help-unresolved-ref =
    { $reason ->
        [notFound] Einki mál varð funnið fyri tilvísingina: { $ref }.
        [multiple] Fleiri mál vórðu funnin fyri tilvísingina: { $ref }.
       *[indeterminate] Málið fyri { $ref } kundi ikki avgerast.
    }

help-learn-about-references = Lær um tilvísingar →
help-reference-page = Uppsláttarsíða →

help-suggestions-header =
    { $location ->
        [inside] Inni í { $element }
       *[top] Á ovasta stigi
    }{ $allowed ->
        [none] { " — einki hoyrir til her." }
        [text] { " — skriva tekst her." }
        [text-and-components] { " — skriva tekst her, ella royn:" }
       *[components] { " — hlutir at royna:" }
    }

help-suggestions-footer = Trýst { $shortcut } fyri at síggja allar { $total } eindirnar.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } er ein tilvísing til { $target }.
       *[other] { $ref } er ein tilvísing til { $target } (linja { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] Innførd av { $owner } sum { $role }.
       *[other] Innførd av { $owner } á linju { $line } sum { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } er ein tilvísing til eginleikan { $property } á { $element }.
       *[other] { $ref } er ein tilvísing til eginleikan { $property } á { $element } (linja { $line }).
    }

help-kind-attribute = eginleiki
help-kind-snippet = brot
help-kind-array-entry = talvuinnføring

help-default = Sjálvvalt:
help-active-default = Virkið sjálvvalt:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Loyvd virði (eitt fyri hvønn lut):
       *[other] Loyvd virði:
    }

help-suggested-values = Tilmæld virði:

help-inserts = Innsetur:

help-coordinates =
    { $count ->
        [one] Koordinat:
       *[other] Koordinat:
    }

help-type = Slag:

help-resolved-style = Loystur stílur (styleNumber { $styleNumber }):

help-resolved-function-names = Loyst funktiónsnøvn:
help-reset-list = Nullstilla listan á hesum innsláttri:
help-added-on-input = Lagt afturat á hesum innsláttri:
help-removed-on-input = Tikið burtur á hesum innsláttri:

help-reset-overrides = { $reset } gongur framum { $additional } og { $removed }.
