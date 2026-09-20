# Chavacano (Chabacano de Zamboanga) editor and language-server surfaces.
# Translated from `locales/en/editor.ftl`, which is the source of truth:
# `lint:i18n` rejects a key that does not exist there, and reports a key that
# exists there but not here as missing coverage.
#
# `WCAG AA`, `DoenetML`, `XML`, `styleNumber`, `Answer Id` and every attribute
# or element name are identifiers, not prose, and stay as written.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Zamboangueño**, in the traditional Spanish-based spelling and with no
# accent marks — `chrome.ftl`'s header sets out the variety, the grammar and
# the orthography, and says what a Caviteño or Ternateño reader should expect
# to differ. Respell all four files at once or none.
#
# **This is the file where the English is heaviest.** The editor's own nouns
# have no Chavacano currency at all and are kept as they stand — `editor`,
# `viewer`, `filter`, `snippet`, `array entry`, `default`, `cursor`, `tag`,
# `property`, `reference`, `WCAG` — **around a Chavacano frame**. What is
# Chavacano here is the preverbal aspect («ta mira», «ya principia»), the
# negation («hende», «no hay»), the object marker «con», the locative «na»,
# the article «el» and the plural «maga», and the modifier-before-noun order.
# The words that do have Spanish-lexifier currency are used in it: «variante»,
# «componente», «atributo», «valor», «linea», «pagina», «informacion»,
# «accesibilidad», «documentacion», «credito», «coordenada», «funcion».
#
# `editor-update-viewer`'s two words are **«Actualiza»** and **«Reinicia»**,
# both of which fit a toolbar button. If either is too long in practice, the
# English «Update» and «Reset» are the fallback a corrector should reach for
# rather than a coinage.
#
# **No plural-category branches.** CLDR has no plural data for `cbk`, so a
# `[one]` branch would be text selected by English's rules; and Chavacano
# leaves the noun unmarked after a numeral — «{ $count } violacion» is right
# for one and for many — so one form is correct anyway. Every count select is
# collapsed to a single `*[other]`.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Reinicia
       *[update] Actualiza
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } el Viewer
       *[other] { $word } el Viewer { $shortcut }
    }


## The variant picker

editor-variant = Variante

editor-variant-filter = Filtra...

editor-variant-next = Escoge el siguiente variante

editor-variant-previous = Escoge el variante antes


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] Tiene encontrao violacion na accesibilidad WCAG AA. Click para { $action ->
            [close] cerra
           *[open] abri
        } el reporte de accesibilidad.
        [advisories] Click para { $action ->
            [close] cerra
           *[open] abri
        } el reporte de accesibilidad. No hay encontrao violacion na WCAG AA, pero tiene otro maga recomendacion de accesibilidad.
       *[clean] Click para { $action ->
            [close] cerra
           *[open] abri
        } el reporte de accesibilidad. No hay encontrao problema de accesibilidad.
    }

editor-accessibility-label =
    { $status ->
        [violations] Tiene encontrao violacion na accesibilidad WCAG AA. Ya encontra { $count ->
           *[other] { $count } violacion na WCAG AA
        }. Click para { $action ->
            [close] cerra
           *[open] abri
        } el reporte de accesibilidad.
        [advisories] No hay encontrao violacion na WCAG AA. Ya encontra { $count ->
           *[other] { $count } otro recomendacion de accesibilidad
        }. Click para { $action ->
            [close] cerra
           *[open] abri
        } el reporte de accesibilidad.
       *[clean] No hay encontrao violacion na WCAG AA. Click para { $action ->
            [close] cerra
           *[open] abri
        } el reporte de accesibilidad.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = Version de DoenetML { $version }

editor-tab-help = Ayuda segun el contexto
editor-tab-help-short = Contexto
editor-tab-errors = Maga Error
editor-tab-warnings = Maga Aviso
editor-tab-info = Informacion
editor-tab-accessibility = Accesibilidad
editor-tab-responses = Maga respuesta ya manda

editor-tab-with-count = { $label }: { $count }

editor-options = Maga opcion del editor
editor-format-as-doenetml = Formatea como DoenetML
editor-format-as-xml = Formatea como XML


## The diagnostics panel

editor-diagnostic-line = Linea #{ $line }

editor-no-errors = No Hay Error
editor-no-warnings = No Hay Aviso
editor-no-info = No Hay Informacion

editor-show-info-annotations = Mostra na editor el maga diagnostico de informacion
editor-show-accessibility-annotations = Mostra na editor el maga diagnostico de accesibilidad

editor-accessibility-learn-more = Aprende paquemodo ta atende el Doenet con el accesibilidad

editor-accessibility-violations-heading = Maga violacion na accesibilidad ({ $standard })

editor-accessibility-other-heading = Otro maga problema de accesibilidad
editor-none-found = No hay encontrao


## Submitted responses

editor-no-responses = No hay pa respuesta ya manda
editor-response-answer-id = Answer Id
editor-response-response = Respuesta
editor-response-credit = Credito
editor-response-submitted = Ya manda


## The context-help panel

help-placeholder = Pone el cursor na un nombre de tag, atributo, o { $ref } para na documentacion.

help-unsupported-ref-chain = Hende pa suportao el ayuda para na maga reference que muchos el parte, como el { $example }.

help-unresolved-ref =
    { $reason ->
        [notFound] No hay encontrao referente para na reference: { $ref }.
        [multiple] Muchos referente ya encontra para na reference: { $ref }.
       *[indeterminate] Hende puede determina el referente de { $ref }.
    }

help-learn-about-references = Aprende acerca del maga reference →
help-reference-page = Pagina de reference →

help-suggestions-header =
    { $location ->
        [inside] Adentro del { $element }
       *[top] Na mas alto nivel
    }{ $allowed ->
        [none] { " — no hay cosa puede pone aqui." }
        [text] { " — escribi texto aqui." }
        [text-and-components] { " — escribi texto aqui, o intenta:" }
       *[components] { " — maga cosa puede intenta:" }
    }

help-suggestions-footer = Aprita el { $shortcut } para mira todo el { $total } componente.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] El { $ref } un reference con { $target }.
       *[other] El { $ref } un reference con { $target } (linea { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] Ya introduci del { $owner } como { $role }.
       *[other] Ya introduci del { $owner } na linea { $line } como { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] El { $ref } un reference con el property { $property } del { $element }.
       *[other] El { $ref } un reference con el property { $property } del { $element } (linea { $line }).
    }

help-kind-attribute = atributo
help-kind-snippet = snippet
help-kind-array-entry = array entry

help-default = Default:
help-active-default = Activo default:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Maga valor permitido (uno cada item):
       *[other] Maga valor permitido:
    }

help-suggested-values = Maga valor sugerido:

help-inserts = Ta pone:

help-coordinates =
    { $count ->
       *[other] Coordenada:
    }

help-type = Tipo:

help-resolved-style = Style ya determina (styleNumber { $styleNumber }):

help-resolved-function-names = Maga nombre de funcion ya determina:
help-reset-list = Reinicia el lista na este input:
help-added-on-input = Ya agrega na este input:
help-removed-on-input = Ya quita na este input:

help-reset-overrides = El { $reset } ta manda sobre el { $additional } y el { $removed }.
