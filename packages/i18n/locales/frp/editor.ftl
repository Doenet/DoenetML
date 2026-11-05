# Arpitan / Franco-Provençal (arpetan) editor and language-server surfaces.
# Translated from `locales/en/editor.ftl`, which is the source of truth:
# `lint:i18n` rejects a key that does not exist there, and reports a key that
# exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Script and orthography.** Latin script, in **ORB** (*Orthographe de
# Référence B*, Stich 2003), the supradialectal spelling, as `chrome.ftl`
# sets it out.
#
# `WCAG AA`, `DoenetML`, `XML`, `styleNumber` and every attribute or element
# name are identifiers, not prose, and stay as written.
#
# **What is Arpitan's own.** The imperative is the 2nd person plural in
# `-âd` / `-éd` that ORB writes and that this catalog addresses a reader
# with: «Cllicâd», «Betâd», «Pressâd». The connectives and function words are
# Arpitan: the postverbal negator **«pas»**, «gins de» for *no…* / *none*,
# «por» for *in order to*, «sur» for *on*, «entre» for *between*, «a
# l'entèrior de» for *inside*, «passe devant» for *overrides*, «encor» for
# *yet*, «yô» for *where*. «èrror» is the Arpitan word for an error and
# «legne» for a line.
#
# **What is borrowed.** The editorial and accessibility vocabulary is French
# respelled by ORB's rules: «variante», «filtrar», «accèssibilitât»,
# «violacion», «recomandacion», «rapôrt», «vèrsion», «contèxto»,
# «informacion», «rèference», «propriètât», «coordonâ», «documentacion»,
# «atribut». Two entries are the weakest in the file: «tablô» for an array
# and «morsél» for a snippet.
#
# **Counts.** `Intl.PluralRules` has **no CLDR data for `frp`**, so no
# `[zero]`, `[two]`, `[few]` or `[many]` branch appears anywhere in this
# catalog. `[one]` *is* kept in the two counted messages —
# `editor-accessibility-label` and `help-coordinates` — because Arpitan marks
# its plural in ORB writing («una violacion» / «doves violacions»,
# «Coordonâ» / «Coordonâs»), so the two branches are two different sentences.
#
# Arpitan is written with French typography, with a space before `:`, `;`,
# `?` and `!`. That spacing belongs to this catalog and is written out here.
#
# **Weakest first.** A reviewer should attack «tablô» and «morsél», then the
# context-help sentences, which are the longest prose in the four files.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Tornar betar
       *[update] Betar a jorn
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } lo visionior
       *[other] { $word } lo visionior { $shortcut }
    }


## The variant picker

editor-variant = Variante
editor-variant-filter = Filtrar…
editor-variant-next = Chouèsir la variante siuventa
editor-variant-previous = Chouèsir la variante prècèdenta


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] On at trovâ una violacion de l'accèssibilitât WCAG AA. Cllicâd por { $action ->
            [close] cllôre
           *[open] uvrir
        } lo rapôrt d'accèssibilitât.
        [advisories] Cllicâd por { $action ->
            [close] cllôre
           *[open] uvrir
        } lo rapôrt d'accèssibilitât. Gins de violacion WCAG AA at étâ trovâ, mas y at d'ôtres recomandacions d'accèssibilitât.
       *[clean] Cllicâd por { $action ->
            [close] cllôre
           *[open] uvrir
        } lo rapôrt d'accèssibilitât. Gins de problèmo d'accèssibilitât at étâ trovâ.
    }

editor-accessibility-label =
    { $status ->
        [violations] On at trovâ una violacion de l'accèssibilitât WCAG AA. { $count ->
            [one] { $count } violacion WCAG AA trovâ
           *[other] { $count } violacions WCAG AA trovâs
        }. Cllicâd por { $action ->
            [close] cllôre
           *[open] uvrir
        } lo rapôrt d'accèssibilitât.
        [advisories] Gins de violacion WCAG AA at étâ trovâ. { $count ->
            [one] { $count } recomandacion d'accèssibilitât de més trovâ
           *[other] { $count } recomandacions d'accèssibilitât de més trovâs
        }. Cllicâd por { $action ->
            [close] cllôre
           *[open] uvrir
        } lo rapôrt d'accèssibilitât.
       *[clean] Gins de violacion WCAG AA at étâ trovâ. Cllicâd por { $action ->
            [close] cllôre
           *[open] uvrir
        } lo rapôrt d'accèssibilitât.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = Vèrsion DoenetML { $version }

editor-tab-help = Éde selon lo contèxto
editor-tab-help-short = Contèxto
editor-tab-errors = Èrrors
editor-tab-warnings = Avèrtissements
editor-tab-info = Informacions
editor-tab-accessibility = Accèssibilitât
editor-tab-responses = Rèponses mandâs

editor-tab-with-count = { $label } : { $count }

editor-options = Opcions de l'èditor
editor-format-as-doenetml = Betar en fôrma come DoenetML
editor-format-as-xml = Betar en fôrma come XML


## The diagnostics panel

editor-diagnostic-line = Legne n° { $line }

editor-no-errors = Gins d'èrror
editor-no-warnings = Gins d'avèrtissement
editor-no-info = Gins de mèssâjo d'informacion

editor-show-info-annotations = Montrar los mèssâjos d'informacion dens l'èditor
editor-show-accessibility-annotations = Montrar los mèssâjos d'accèssibilitât dens l'èditor

editor-accessibility-learn-more = Vêre comment Doenet aborde l'accèssibilitât

editor-accessibility-violations-heading = Violacions de l'accèssibilitât ({ $standard })

editor-accessibility-other-heading = Ôtros problèmos d'accèssibilitât
editor-none-found = Ren trovâ


## Submitted responses

editor-no-responses = Gins de rèponsa mandâ por lo moment
editor-response-answer-id = Id de la rèponsa
editor-response-response = Rèponsa
editor-response-credit = Pouents
editor-response-submitted = Mandâ


## The context-help panel

help-placeholder = Betâd lo cursor sur un nom de balisa, un atribut ou { $ref } por la documentacion.

help-unsupported-ref-chain = L'éde por les rèferences en plusiors partias come { $example } est pas encor prêsa en charge.

help-unresolved-ref =
    { $reason ->
        [notFound] Gins de rèferent trovâ por la rèference : { $ref }.
        [multiple] Plusiors rèferents trovâs por la rèference : { $ref }.
       *[indeterminate] Un rèferent por { $ref } at pas pouessu étre dètèrminâ.
    }

help-learn-about-references = Nen savêr més sur les rèferences →
help-reference-page = Pâge de rèference →

help-suggestions-header =
    { $location ->
        [inside] A l'entèrior de { $element }
       *[top] U nivèl lo més hôt
    }{ $allowed ->
        [none] { " — ren y va pas." }
        [text] { " — tapâd de tèxto ique." }
        [text-and-components] { " — tapâd de tèxto ique, ou assayéd :" }
       *[components] { " — des chouses a assayér :" }
    }

help-suggestions-footer = Pressâd { $shortcut } por vêre tôs los { $total } composants.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } est una rèference a { $target }.
       *[other] { $ref } est una rèference a { $target } (legne { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] Betâ en place per { $owner } come { $role }.
       *[other] Betâ en place per { $owner } a la legne { $line } come { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } est una rèference a la propriètât { $property } de { $element }.
       *[other] { $ref } est una rèference a la propriètât { $property } de { $element } (legne { $line }).
    }

help-kind-attribute = atribut
help-kind-snippet = morsél
help-kind-array-entry = entrâ de tablô

help-default = Valor per dèfôt :
help-active-default = Valor per dèfôt activa :

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Valors pèrmêses (una per èlèment) :
       *[other] Valors pèrmêses :
    }

help-suggested-values = Valors propôsâs :

help-inserts = Betar en place :

help-coordinates =
    { $count ->
        [one] Coordonâ :
       *[other] Coordonâs :
    }

help-type = Type :

help-resolved-style = Stilo rèsolu (styleNumber { $styleNumber }) :

help-resolved-function-names = Noms de fonccions rèsolus :
help-reset-list = Lista de rèenicializacion sur cél champ :
help-added-on-input = Apondu sur cél champ :
help-removed-on-input = Enlevâ sur cél champ :

help-reset-overrides = { $reset } passe devant { $additional } et { $removed }.
