# Ojibwe editor and language-server surfaces. Translated from
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
# Written in the Fiero double-vowel orthography; see `content.ftl`'s header.
#
# The counted selects are kept here, unlike in every other catalog in this batch:
# Ojibwe marks the inanimate plural and the verb agrees with it. See `chrome.ftl`'s
# header.
#
# No possessive prefix is put on a placeable: its shape would be decided by the
# value. Where the English possessed one, this file writes «onji» — "from, of" — a
# free word that follows what it governs.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Azhegiiwe
       *[update] Aanjitoon
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } waabanda'iwewin
       *[other] { $word } waabanda'iwewin { $shortcut }
    }


## The variant picker

editor-variant = Bakaan izhinaagozid
editor-variant-filter = Nandagikendan…
editor-variant-next = Odaapinan niigaan bakaan izhinaagozid
editor-variant-previous = Odaapinan ishkweyaang bakaan izhinaagozid


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] Gii-mikigaade bezhig WCAG AA bagidinigewin banaadaagewin. Bagidin ji-{ $action ->
            [close] gibaakwa'igaadeg
           *[open] baakinigaadeg
        } bagidinigewin-ozhibii'igan.
        [advisories] Bagidin ji-{ $action ->
            [close] gibaakwa'igaadeg
           *[open] baakinigaadeg
        } bagidinigewin-ozhibii'igan. Gaawiin gegoo WCAG AA banaadaagewin gii-mikigaadesinoon, gaye dash nawaj bagidinigewin-wiindamaagewinan ayaamagadoon.
       *[clean] Bagidin ji-{ $action ->
            [close] gibaakwa'igaadeg
           *[open] baakinigaadeg
        } bagidinigewin-ozhibii'igan. Gaawiin gegoo bagidinigewin-zanagendamowin gii-mikigaadesinoon.
    }

editor-accessibility-label =
    { $status ->
        [violations] Gii-mikigaade bezhig WCAG AA bagidinigewin banaadaagewin. { $count ->
            [one] { $count } WCAG AA banaadaagewin
           *[other] { $count } WCAG AA banaadaagewinan
        } gii-mikigaadewan. Bagidin ji-{ $action ->
            [close] gibaakwa'igaadeg
           *[open] baakinigaadeg
        } bagidinigewin-ozhibii'igan.
        [advisories] Gaawiin gegoo WCAG AA banaadaagewin gii-mikigaadesinoon. { $count ->
            [one] { $count } nawaj bagidinigewin-wiindamaagewin
           *[other] { $count } nawaj bagidinigewin-wiindamaagewinan
        } gii-mikigaadewan. Bagidin ji-{ $action ->
            [close] gibaakwa'igaadeg
           *[open] baakinigaadeg
        } bagidinigewin-ozhibii'igan.
       *[clean] Gaawiin gegoo WCAG AA banaadaagewin gii-mikigaadesinoon. Bagidin ji-{ $action ->
            [close] gibaakwa'igaadeg
           *[open] baakinigaadeg
        } bagidinigewin-ozhibii'igan.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML izhinaagoziwin { $version }

editor-tab-help = Wiidookaagewin dazhi onji
editor-tab-help-short = Dazhi
editor-tab-errors = Bataadowinan
editor-tab-warnings = Aakoziwin-wiindamaagewinan
editor-tab-info = Wiindamaagewin
editor-tab-accessibility = Bagidinigewin
editor-tab-responses = Nakwetamowinan izhinizha'igaadeg

editor-tab-with-count = { $label }: { $count }

editor-options = Ozhibii'igewin-odaapinigewinan
editor-format-as-doenetml = Ozhitoon DoenetML izhi
editor-format-as-xml = Ozhitoon XML izhi


## The diagnostics panel

editor-diagnostic-line = Shingishing #{ $line }

editor-no-errors = Gaawiin bataadowinan
editor-no-warnings = Gaawiin aakoziwin-wiindamaagewinan
editor-no-info = Gaawiin wiindamaagewin-waabanda'iwewinan

editor-show-info-annotations = Waabanda'iwe wiindamaagewin-waabanda'iwewinan ozhibii'igewining
editor-show-accessibility-annotations = Waabanda'iwe bagidinigewin-waabanda'iwewinan ozhibii'igewining

editor-accessibility-learn-more = Gikendan aaniin Doenet ezhi-ganawendang bagidinigewin

editor-accessibility-violations-heading = Bagidinigewin banaadaagewinan ({ $standard })

editor-accessibility-other-heading = Nawaj bagidinigewin-zanagendamowinan
editor-none-found = Gaawiin gegoo gii-mikigaadesinoon


## Submitted responses

editor-no-responses = Gaawiin mashi nakwetamowinan izhinizha'igaadesinoon
editor-response-answer-id = Nakwetamowin izhinikaazowin
editor-response-response = Nakwetamowin
editor-response-credit = Dibaakonigewin
editor-response-submitted = Izhinizha'igaade


## The context-help panel

help-placeholder = Atoon mazina'igaans tag izhinikaazowining, ozhibii'igaansing, gemaa { $ref } ji-mikaman ozhibii'igan.

help-unsupported-ref-chain = Wiidookaagewin niibiwa-onji-ayi'ii izhi-wiindamaagewinan { $example } izhi gaawiin mashi ayaamagasinoon.

help-unresolved-ref =
    { $reason ->
        [notFound] Gaawiin gegoo gii-mikigaadesinoon o'ow izhi-wiindamaagewin onji: { $ref }.
        [multiple] Niibiwa gii-mikigaadewan o'ow izhi-wiindamaagewin onji: { $ref }.
       *[indeterminate] Gaawiin gii-gikendaagozisinoon awenen { $ref } wiindamaaged.
    }

help-learn-about-references = Gikendan izhi-wiindamaagewinan onji →
help-reference-page = Izhi-wiindamaagewin mazina'igan →

help-suggestions-header =
    { $location ->
        [inside] Biinji { $element }
       *[top] Ishpiming dazhi
    }{ $allowed ->
        [none] { " — gaawiin gegoo omaa biindige." }
        [text] { " — ozhibii'an ikidowin omaa." }
        [text-and-components] { " — ozhibii'an ikidowin omaa, gemaa gagwe:" }
       *[components] { " — gegoo ji-gagwedaagewin:" }
    }

help-suggestions-footer = Bagidin { $shortcut } ji-waabandaman gakina { $total } onji-ayi'iin.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } owiindamaagen { $target }.
       *[other] { $ref } owiindamaagen { $target } (shingishing { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] { $owner } ogii-asaan { $role } izhi.
       *[other] { $owner } ogii-asaan shingishing { $line } { $role } izhi.
    }

# «onji» rather than a possessive prefix on either value, for the reason in this
# file's header.
help-property-is-reference =
    { $line ->
        [none] { $ref } owiindamaagen { $property } { $element } onji.
       *[other] { $ref } owiindamaagen { $property } { $element } onji (shingishing { $line }).
    }

help-kind-attribute = ozhibii'igaans
help-kind-snippet = ikidowin-onji-ayi'ii
help-kind-array-entry = asigina'igan-biindigewin

help-default = Netaa-ayaamagak:
help-active-default = Noongom netaa-ayaamagak:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Bagidinigaadeg (bezhig bezhig onji):
       *[other] Bagidinigaadeg:
    }

help-suggested-values = Wiindamaagaadeg:

help-inserts = Obiindiganan:

# The select stays: the inanimate plural is marked and the verb agrees with it.
help-coordinates =
    { $count ->
        [one] Dazhi-agindaasowin:
       *[other] Dazhi-agindaasowinan:
    }

help-type = Izhinaagoziwin:

help-resolved-style = Izhinaagoziwin gii-mikigaadeg (styleNumber { $styleNumber }):

help-resolved-function-names = Anokiiwin izhinikaazowinan gii-mikigaadeg:
help-reset-list = Azhegiiwewin asigina'igan o'ow biindigewin:
help-added-on-input = Gii-agonigaade o'ow biindigewin:
help-removed-on-input = Gii-webinigaade o'ow biindigewin:

help-reset-overrides = { $reset } odaanjitoon { $additional } gaye { $removed }.
