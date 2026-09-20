# Papiamentu (Kòrsou/Boneiru) editor and language-server surfaces. Translated
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
# **Orthography.** This catalog is written in the **phonological orthography
# of Curaçao and Bonaire** — Papiamentu, spelled «kas», «yu», «skol», «bèk»,
# «buki», «hende». The **etymological orthography of Aruba** — Papiamento,
# «cas», «hoben», «trece» — is a real and equally official alternative and is
# deliberately **not** mixed into any of these four files. A reviewer from
# Aruba would **respell** this catalog rather than retranslate it: the words
# are the same, the spelling system is not. `chrome.ftl`'s header sets out the
# letters that carry the distinction — `k` and `s` for etymological
# `c`/`qu`/`z`, `y` for `j`/`ll`, and the vowel letters `è ò ù`, which are
# letters of the alphabet rather than stress marks. Papiamentu writes an acute
# accent separately, for irregular stress and tone («kámbia»; the «paña» /
# «pañá» pattern); this seed marks stress only where the standard orthography
# requires it, so accent placement is what a reviewer should check first.
#
# **Word order and agreement.** A Papiamentu adjective follows its noun —
# «liña kòrá», «kas grandi» — the reverse of English; `content.ftl` is where
# that matters, and its header says how the composition messages reverse.
# Papiamentu has no grammatical gender and no adjective agreement, so nothing
# here forks on `$gender` or `$role`.
#
# **Number.** `Intl.PluralRules("pap")` resolves to `pap` and reports
# `['one','other']`. A noun after a numeral is unmarked — «dos violashon»,
# never «dos violashonnan» — so both branches would be word-for-word identical
# and every count message is written as **one unselected form**. That covers
# `editor-accessibility-label` and `help-coordinates`; `help-coordinates` is
# a heading rather than a counted phrase, and its two English forms differ, so
# the plural «Koordenadanan» is written there unconditionally.
#
# **Coverage.** Every key of the English file is covered. «renderisadó»,
# «kuadrikula» and «etiketa» are the seed's own choices in a register
# Papiamentu writes little of; a reviewer should check them.
#
# **The technical vocabulary here is a lexifier loan set.** Every technical
# noun in this file is a Dutch- or Spanish-mediated loan — those are the words
# Papiamentu actually uses, not a substitute for a native term — carried in
# Papiamentu's own orthography and Papiamentu's own grammar. The sentences
# around the loans are Papiamentu, not Dutch and not Spanish.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Reinisiá
       *[update] Aktualisá
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } Visor
       *[other] { $word } Visor { $shortcut }
    }


## The variant picker

editor-variant = Variante

editor-variant-filter = Filtrá...

editor-variant-next = Selektá e siguiente variante

editor-variant-previous = Selektá e variante anterior


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] A identifiká un violashon di aksesibilidat WCAG AA. Klek pa { $action ->
            [close] sera
           *[open] habri
        } e rapòrt di aksesibilidat.
        [advisories] Klek pa { $action ->
            [close] sera
           *[open] habri
        } e rapòrt di aksesibilidat. No a haña violashon di WCAG AA, pero tin rekomendashon adishonal di aksesibilidat.
       *[clean] Klek pa { $action ->
            [close] sera
           *[open] habri
        } e rapòrt di aksesibilidat. No a haña ningun problema di aksesibilidat.
    }

editor-accessibility-label =
    { $status ->
        [violations] A identifiká un violashon di aksesibilidat WCAG AA. A haña { $count } violashon di WCAG AA. Klek pa { $action ->
            [close] sera
           *[open] habri
        } e rapòrt di aksesibilidat.
        [advisories] No a identifiká violashon di WCAG AA. A haña { $count } rekomendashon adishonal di aksesibilidat. Klek pa { $action ->
            [close] sera
           *[open] habri
        } e rapòrt di aksesibilidat.
       *[clean] No a identifiká violashon di WCAG AA. Klek pa { $action ->
            [close] sera
           *[open] habri
        } e rapòrt di aksesibilidat.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = Vershon { $version } di DoenetML

editor-tab-help = Yudansa segun kontèkst
editor-tab-help-short = Kontèkst
editor-tab-errors = Eror
editor-tab-warnings = Atvertensia
editor-tab-info = Informashon
editor-tab-accessibility = Aksesibilidat
editor-tab-responses = Kontesta mandá

editor-tab-with-count = { $label }: { $count }

editor-options = Opshon di editor
editor-format-as-doenetml = Formatiá komo DoenetML
editor-format-as-xml = Formatiá komo XML


## The diagnostics panel

editor-diagnostic-line = Liña #{ $line }

editor-no-errors = Sin Eror
editor-no-warnings = Sin Atvertensia
editor-no-info = Sin Diagnóstiko Informativo

editor-show-info-annotations = Mustra diagnóstiko informativo den e editor
editor-show-accessibility-annotations = Mustra diagnóstiko di aksesibilidat den e editor

editor-accessibility-learn-more = Siña kon Doenet ta trata aksesibilidat

editor-accessibility-violations-heading = Violashon di aksesibilidat ({ $standard })

editor-accessibility-other-heading = Otro problema di aksesibilidat
editor-none-found = No a haña ningun


## Submitted responses

editor-no-responses = Ainda no tin kontesta mandá
editor-response-answer-id = Id di Kontesta
editor-response-response = Kontesta
editor-response-credit = Krédito
editor-response-submitted = Mandá


## The context-help panel

help-placeholder = Pone e kursor riba un nòmber di tag, un atributo of { $ref } pa dokumentashon.

help-unsupported-ref-chain = Yudansa pa referensia di vários parti manera { $example } ainda no ta soportá.

help-unresolved-ref =
    { $reason ->
        [notFound] No a haña referente pa e referensia: { $ref }.
        [multiple] A haña vários referente pa e referensia: { $ref }.
       *[indeterminate] No por a determiná un referente pa { $ref }.
    }

help-learn-about-references = Siña tokante referensia →
help-reference-page = Página di referensia →

help-suggestions-header =
    { $location ->
        [inside] Paden di { $element }
       *[top] Na e nivel di ariba
    }{ $allowed ->
        [none] { " — nada no ta bai akinan." }
        [text] { " — skirbi teksto akinan." }
        [text-and-components] { " — skirbi teksto akinan, of purba:" }
       *[components] { " — kos pa purba:" }
    }

help-suggestions-footer = Primi { $shortcut } pa mira tur e { $total } komponentenan.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } ta un referensia na { $target }.
       *[other] { $ref } ta un referensia na { $target } (liña { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] Introdusí pa { $owner } komo { $role }.
       *[other] Introdusí pa { $owner } na liña { $line } komo { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } ta un referensia na e propiedat { $property } di { $element }.
       *[other] { $ref } ta un referensia na e propiedat { $property } di { $element } (liña { $line }).
    }

help-kind-attribute = atributo
help-kind-snippet = fragmento
help-kind-array-entry = entrada di array

help-default = Por defekto:
help-active-default = Por defekto aktivo:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Balor permití (ún pa kada elemento):
       *[other] Balor permití:
    }

help-suggested-values = Balor sugerí:

help-inserts = Ta inserta:

help-coordinates = Koordenadanan:

help-type = Tipo:

help-resolved-style = Estilo resolvé (styleNumber { $styleNumber }):

help-resolved-function-names = Nòmber di funshon resolvé:
help-reset-list = Reinisiá lista riba e input aki:
help-added-on-input = Agregá riba e input aki:
help-removed-on-input = Kitá riba e input aki:

help-reset-overrides = { $reset } ta prevalesé riba { $additional } i { $removed }.
