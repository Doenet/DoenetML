# Garifuna editor and language-server surfaces: the footer, the diagnostics
# panel, the variant picker, the accessibility button and the context-help
# panel beside them. Translated from `locales/en/editor.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage. Message ids
# are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Orthography.** The standard Latin orthography of Honduras, Belize,
# Guatemala and Nicaragua: `a b ch d e f g h i k l m n ñ o p r s t u ü w y`.
# **`ü` is a letter of its own**, the high central vowel, written with the
# diaeresis everywhere it occurs, and is not interchangeable with `u`. **The
# falling tone is not written**: Garifuna distinguishes tone and the standard
# orthography leaves it unmarked, so an acute here is the Spanish-style stress
# accent Honduran practice uses on some words, not a tone mark — a reviewer
# should not read the absence of accents as an error. `c`, `j`, `q`, `v`, `x`
# and `z` are not in the alphabet, so a loan that would use them is respelled:
# «barianti» for *variante*, «bersion» for *versión*, «espresion* is elsewhere,
# «aksesibilidá» for *accesibilidad*, «kordenada» for *coordenada*.
#
# **Number.** `Intl.PluralRules` has no CLDR data for `cab`; it falls back to
# the default locale and reports `one` and `other`, categories Garifuna does not
# select. Both counted messages here — `editor-accessibility-label` and
# `help-coordinates` — are therefore written as **one unselected form**, with
# the `$count` placeable kept exactly where English has it in the first and the
# select dropped entirely in the second. Selects on non-numeric variables
# (`$action`, `$status`, `$shortcut`, `$reason`, `$location`, `$allowed`,
# `$line`, `$perItem`) are not plural selects and keep every branch English has.
#
# **Loans.** The technical nouns are **Spanish loans respelled to the Garifuna
# alphabet and carried in a Garifuna frame**: «barianti», «bersion»,
# «atributu», «referensia», «snipeti», «erroru», «adbertensia»,
# «informasion», «aksesibilidá», «dokumentasion», «balu», «kordenada»,
# «rekomendasion». The frame is Garifuna — «lidan» in, «lun» to, «luma» with,
# «lídangiñe» from, «úati» there is none, «anihein» there is, «mama» the
# negative copula, «siñá» cannot, «lunti» must — and the second-person
# imperative prefix `b-` sits on the loan verbs («Bafara» press, «Barúfuda»
# show, «Banúadira» choose). A Belizean speaker may prefer the English loan in
# any of these slots and should feel free to substitute, but the whole file has
# to move together.
#
# `WCAG AA`, `styleNumber`, `DoenetML`, the `$version` number and every
# attribute name stay in English exactly as English writes them.
#
# **Confidence, and it is low.** «buiti»/«mabuiti», «úati» and «siñá» carry
# much of this file and are worth a speaker's check, as do «arúfudahani»
# (showing), «arámudahani» (hiding), «banúadira» (choose) and «bafara» (press),
# which stand in for the English *open*, *close*, *select* and *click*. Nothing
# in this file is omitted; all 64 keys are written. Three of them —
# `editor-tab-with-count`, `help-name-summary` and
# `help-style-number-annotation` — are punctuation and placeables with no prose
# in them, and are reproduced as English has them because there is nothing in
# them to move.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Bagiribuda
       *[update] Baséinsuna
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } arihini
       *[other] { $word } arihini { $shortcut }
    }


## The variant picker

editor-variant = Barianti
editor-variant-filter = Bafiltraru...
editor-variant-next = Banúadira barianti lárigi
editor-variant-previous = Banúadira barianti furumiñe


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] Aráfagua ában erroru aksesibilidá WCAG AA. Bafara lun { $action ->
            [close] arámudahani
           *[open] arúfudahani
        } informe aksesibilidá.
        [advisories] Bafara lun { $action ->
            [close] arámudahani
           *[open] arúfudahani
        } informe aksesibilidá. Úati erroru WCAG AA, gama lumoun anihein rekomendasion aksesibilidá ámuñegu.
       *[clean] Bafara lun { $action ->
            [close] arámudahani
           *[open] arúfudahani
        } informe aksesibilidá. Úati katei mabuiti lidan aksesibilidá.
    }

editor-accessibility-label =
    { $status ->
        [violations] Aráfagua ában erroru aksesibilidá WCAG AA. Aráfagua { $count } erroru WCAG AA. Bafara lun { $action ->
            [close] arámudahani
           *[open] arúfudahani
        } informe aksesibilidá.
        [advisories] Úati erroru WCAG AA. Aráfagua { $count } rekomendasion aksesibilidá ámuñegu. Bafara lun { $action ->
            [close] arámudahani
           *[open] arúfudahani
        } informe aksesibilidá.
       *[clean] Úati erroru WCAG AA. Bafara lun { $action ->
            [close] arámudahani
           *[open] arúfudahani
        } informe aksesibilidá.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = Bersion DoenetML { $version }

editor-tab-help = Adundehani lidan lubéi bagia
editor-tab-help-short = Lidan
editor-tab-errors = Erroru
editor-tab-warnings = Adbertensia
editor-tab-info = Informasion
editor-tab-accessibility = Aksesibilidá
editor-tab-responses = Respuesta ichugúati

editor-tab-with-count = { $label }: { $count }

editor-options = Opsion lun editóru
editor-format-as-doenetml = Bafórmatiaru keisi DoenetML
editor-format-as-xml = Bafórmatiaru keisi XML


## The diagnostics panel

editor-diagnostic-line = Línia #{ $line }

editor-no-errors = Úati erroru
editor-no-warnings = Úati adbertensia
editor-no-info = Úati informasion

editor-show-info-annotations = Barúfuda informasion lidan editóru
editor-show-accessibility-annotations = Barúfuda aksesibilidá lidan editóru

editor-accessibility-learn-more = Barihi ida liña Doenet lidan aksesibilidá

editor-accessibility-violations-heading = Erroru aksesibilidá ({ $standard })

editor-accessibility-other-heading = Katei ámu lidan aksesibilidá
editor-none-found = Úati


## Submitted responses

editor-no-responses = Úati respuesta ichugúati
editor-response-answer-id = Id lun respuesta
editor-response-response = Respuesta
editor-response-credit = Puntu
editor-response-submitted = Ichugúati


## The context-help panel

help-placeholder = Bíchuga kursóru luagu ában etiketa, atributu, o { $ref } lun bariha dokumentasion.

help-unsupported-ref-chain = Úati adundehani lun referensia saragu-parti keisi { $example }.

help-unresolved-ref =
    { $reason ->
        [notFound] Úati katei lun referensia to: { $ref }.
        [multiple] Saragu katei lun referensia to: { $ref }.
       *[indeterminate] Siñá lasubudirún ka katei lun { $ref }.
    }

help-learn-about-references = Barihi luagu referensia →
help-reference-page = Páhina referensia →

help-suggestions-header =
    { $location ->
        [inside] Lidan { $element }
       *[top] Lidan lidügübei sun
    }{ $allowed ->
        [none] { " — úati katei larumugun ya." }
        [text] { " — babüriha uganu ya." }
        [text-and-components] { " — babüriha uganu ya, o barihi to:" }
       *[components] { " — katei lun barihin:" }
    }

help-suggestions-footer = Bafara { $shortcut } lun barihin sun { $total } komponente.

help-ref-is-reference =
    { $line ->
        [none] { $ref } ában referensia lun { $target }.
       *[other] { $ref } ában referensia lun { $target } (línia { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] Adügüwati lidan { $owner } keisi { $role }.
       *[other] Adügüwati lidan { $owner } lidan línia { $line } keisi { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } ában referensia lun propiedá { $property } lun { $element }.
       *[other] { $ref } ában referensia lun propiedá { $property } lun { $element } (línia { $line }).
    }

# Punctuation standing on its own: `$name` is empty where the panel has already
# printed the name, so the dash has to read as the whole message.
help-name-summary = { $name } — { $summary }

help-kind-attribute = atributu
help-kind-snippet = snipeti
help-kind-array-entry = ában lidan areglu

help-default = Lubéi mama arúfudǘwa:
help-active-default = Lubéi arúfudǘwaali:

# `styleNumber` is the attribute's own name and stays as written; the string
# literal protects the leading space.
help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Balu larumugun (ában lun kada ában):
       *[other] Balu larumugun:
    }

help-suggested-values = Balu arúfudǘwati:

help-inserts = Larumuguña:

help-coordinates = Kordenada:

help-type = Tipu:

help-resolved-style = Estilu adügüwaali (styleNumber { $styleNumber }):

help-resolved-function-names = Iri funsion adügüwaali:
help-reset-list = Lista agiribudǘwati lidan entrada to:
help-added-on-input = Aragüwati lidan entrada to:
help-removed-on-input = Akitarúati lidan entrada to:

help-reset-overrides = { $reset } lasánsiruña { $additional } luma { $removed }.
