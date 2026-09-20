# Khasi (Ka Ktien Khasi) editor catalog: the editor's own surfaces and the
# language server's — the footer, the diagnostics panel, the variant picker,
# the accessibility button and the context-help panel beside them. Selected by
# `uiLocale`.
#
# Translated from `locales/en/editor.ftl`, which is the source of truth.
# Message ids, `.attribute` names, select variant keys and placeable names are
# never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator, and
# no permission is needed to change a word.
#
# **Orthography: Roman, with its diacritics.** Khasi has been written in the
# Roman alphabet since the Welsh Presbyterian mission, and no other script is
# at issue for it. `ï` (U+00EF), `ñ` (U+00F1) and the ASCII apostrophe `'`
# (U+0027) for the glottal stop are used consistently; the typographic
# apostrophe U+2019 appears nowhere.
#
# **The editor's vocabulary is the most heavily borrowed of the four files, and
# that is declared rather than disguised.** Meghalaya's computing instruction
# is in English, so `editor`, `variant`, `filter`, `format`, `XML`,
# `DoenetML`, `attribute`, `snippet`, `array`, `default`, `WCAG` and the rest
# are written here as English. What is Khasi is the frame around them: «ïa»,
# «ban», «na», «bad», «ym», «shaphang» *about*, «kyrteng» *name*, «jingtip»
# *information*, «jingsneng» *warning*, «jingiarap» *help*, «pynpaw» *show*,
# «shem» *find*, «ym don» *none*, «lah» *can*, «buh» *put*.
#
# **Words to check first:** «error» is left as an English loan throughout, for
# want of a Khasi noun the seed was confident of; «Jingpynthymmai» for *update*
# and «Pynphai» for *reset* are both built from ordinary verbs and may be
# longer than a toolbar button wants; and «jingpynkylla» for *variant* is a
# coinage a speaker should replace or confirm.
#
# No message here selects on a plural category: CLDR has no plural data for
# `kha`, and a Khasi noun is not marked for number after a numeral. Where
# English forked on a count — the two accessibility labels and
# `help-coordinates` — this catalog keeps English's `*[other]` wording and its
# placeables, and the count simply stands in front of an unmarked noun.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Pynphai
       *[update] Pynthymmai
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } ïa ka Viewer
       *[other] { $word } ïa ka Viewer { $shortcut }
    }


## The variant picker

editor-variant = Jingpynkylla

editor-variant-filter = Filter...

editor-variant-next = Jied ïa ka jingpynkylla ba shaphrang

editor-variant-previous = Jied ïa ka jingpynkylla ba mynshuwa


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] La shem ka jingpudong ïa ka WCAG AA aksesibiliti. Klik ban { $action ->
            [close] khang
           *[open] plie
        } ïa ka ripot aksesibiliti.
        [advisories] Klik ban { $action ->
            [close] khang
           *[open] plie
        } ïa ka ripot aksesibiliti. Ym la shem ki jingpudong ïa ka WCAG AA, hynrei don ki jingsneng aksesibiliti kiwei de.
       *[clean] Klik ban { $action ->
            [close] khang
           *[open] plie
        } ïa ka ripot aksesibiliti. Ym la shem ei ei ba ym beit ha ka aksesibiliti.
    }

editor-accessibility-label =
    { $status ->
        [violations] La shem ka jingpudong ïa ka WCAG AA aksesibiliti. La shem { $count } ki jingpudong ïa ka WCAG AA. Klik ban { $action ->
            [close] khang
           *[open] plie
        } ïa ka ripot aksesibiliti.
        [advisories] Ym la shem ki jingpudong ïa ka WCAG AA. La shem { $count } ki jingsneng aksesibiliti kiwei de. Klik ban { $action ->
            [close] khang
           *[open] plie
        } ïa ka ripot aksesibiliti.
       *[clean] Ym la shem ki jingpudong ïa ka WCAG AA. Klik ban { $action ->
            [close] khang
           *[open] plie
        } ïa ka ripot aksesibiliti.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML version { $version }

editor-tab-help = Jingiarap ba iadei bad ka jaka
editor-tab-help-short = Jaka
editor-tab-errors = Ki Error
editor-tab-warnings = Ki Jingsneng
editor-tab-info = Jingtip
editor-tab-accessibility = Aksesibiliti
editor-tab-responses = Ki jingjubab ba la ai

editor-tab-with-count = { $label }: { $count }

editor-options = Ki jingjied jong ka editor
editor-format-as-doenetml = Format kum ka DoenetML
editor-format-as-xml = Format kum ka XML


## The diagnostics panel

editor-diagnostic-line = Lain #{ $line }

editor-no-errors = Ym Don Error
editor-no-warnings = Ym Don Jingsneng
editor-no-info = Ym Don Jingtip

editor-show-info-annotations = Pynpaw ki jingtip ha ka editor
editor-show-accessibility-annotations = Pynpaw ki jingsneng aksesibiliti ha ka editor

editor-accessibility-learn-more = Pule shaphang ka lynti jong ka Doenet sha ka aksesibiliti

editor-accessibility-violations-heading = Ki jingpudong aksesibiliti ({ $standard })

editor-accessibility-other-heading = Kiwei ki jingeh aksesibiliti
editor-none-found = Ym la shem ei ei


## Submitted responses

editor-no-responses = Ym don shuh ka jingjubab ba la ai
editor-response-answer-id = Answer Id
editor-response-response = Jingjubab
editor-response-credit = Kredit
editor-response-submitted = La ai


## The context-help panel

help-placeholder = Buh ïa ka kursor halor ka kyrteng tag, ka attribute, ne { $ref } ban shem ka dokumentesan.

help-unsupported-ref-chain = Ka jingiarap ïa ki reference bunbynta kum { $example } kam don shuh mynta.

help-unresolved-ref =
    { $reason ->
        [notFound] Ym la shem ei ei ba dei ka reference: { $ref }.
        [multiple] La shem bun ki jingdei ïa ka reference: { $ref }.
       *[indeterminate] Ym lah ban tip ïa kaba dei { $ref }.
    }

help-learn-about-references = Pule shaphang ki reference →
help-reference-page = Peij reference →

help-suggestions-header =
    { $location ->
        [inside] Ha ka bynta jong { $element }
       *[top] Ha ka jaka bakhraw tam
    }{ $allowed ->
        [none] { " — ym don ei ei ba wan hangne." }
        [text] { " — thoh ïa ka ktien hangne." }
        [text-and-components] { " — thoh ïa ka ktien hangne, ne pyrshang ïa kine:" }
       *[components] { " — ki jingpyrshang:" }
    }

help-suggestions-footer = Nget ïa { $shortcut } ban peit baroh ki { $total } component.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } ka dei ka reference sha { $target }.
       *[other] { $ref } ka dei ka reference sha { $target } (lain { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] La pyni da { $owner } kum { $role }.
       *[other] La pyni da { $owner } ha ka lain { $line } kum { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } ka dei ka reference sha ka property { $property } jong { $element }.
       *[other] { $ref } ka dei ka reference sha ka property { $property } jong { $element } (lain { $line }).
    }

help-kind-attribute = attribute
help-kind-snippet = snippet
help-kind-array-entry = array entry

help-default = Default:
help-active-default = Default ba trei:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Ki bynta ba lah (wei wei ha man la ka bynta):
       *[other] Ki bynta ba lah:
    }

help-suggested-values = Ki bynta ba la pyni:

help-inserts = Buh:

help-coordinates =
    { $count ->
       *[other] Ki koordinet:
    }

help-type = Rukom:

help-resolved-style = Style ba la pynbeit (styleNumber { $styleNumber }):

help-resolved-function-names = Ki kyrteng function ba la pynbeit:
help-reset-list = Pynphai ïa ka list ha kane ka input:
help-added-on-input = La buh ha kane ka input:
help-removed-on-input = La rah noh ha kane ka input:

help-reset-overrides = { $reset } ka palat ïa { $additional } bad { $removed }.
