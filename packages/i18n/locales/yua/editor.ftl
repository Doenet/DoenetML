# Yucatec Maya (Maayaʼ tʼàan) editor and language-server surfaces: the footer,
# the diagnostics panel, the variant picker, the accessibility button and the
# context-help panel beside them. Translated from `locales/en/editor.ftl`,
# which is the source of truth: `lint:i18n` rejects a key that does not exist
# there, and reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Orthography.** The ALMY/INALI unified orthography; see `chrome.ftl`'s
# header for the alphabet and the doubled long vowels. Every apostrophe inside
# a Maya word is **U+02BC MODIFIER LETTER APOSTROPHE `ʼ`**, never U+2019 `’`
# — the two are homoglyphs in most fonts, so a reviewer who retypes a word
# should check the codepoint. Straight ASCII `'` is English's own punctuation
# carried through where a message quotes a value, and is not a Maya letter. The language is named «Maayaʼ
# tʼàan», whose grave marks the falling tone and is not part of ordinary ALMY
# spelling («maayaʼ tʼaan»).
#
# **Number.** `Intl.PluralRules` has no CLDR data for `yua`; it falls back to
# the default locale and reports categories Yucatec does not select. A Yucatec
# noun after a numeral takes no plural suffix, so the two counted messages here
# — `editor-accessibility-label` and `help-coordinates` — are written as **one
# unselected form** rather than as a `[one]`/`[other]` pair. The selects on
# `$status`, `$action`, `$shortcut`, `$reason`, `$location`, `$allowed`,
# `$line` and `$perItem` are not plural selects and keep every branch English
# has.
#
# **Loans.** The technical nouns are **Spanish loans written in the ALMY
# orthography, carried inside a Yucatec sentence frame** — native verbs, native
# word order, the native negation «maʼ … -iʼ». This file carries «bariante»
# (variant), «atributo», «referensia», «komponente», «koordenada», «propiedad»,
# «balor» (value), «tipo», «elemento», «formato», «kréedito», «etiketa»,
# «bersión», «aksesibilidad», «rekomendasión», «dokumentasión», «páajina»,
# «estilo», «snippet» (left as the English term of art the schema uses).
# Nothing here is a coinage.
#
# **Confidence.** All sixty-four keys are translated. `WCAG AA` is the name of
# a standard and stays as written, as do `DoenetML`, `XML`, `styleNumber`,
# every element and attribute name, every key shortcut and every version
# number. The weakest entries are «snippet» and «arreglo» (array), which are
# terms of art with no Yucatec usage behind them at all, and «Síiʼpil» (fault,
# mistake) standing for *error* throughout.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Suʼut
       *[update] Tuʼubs
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } le eʼesajiloʼ
       *[other] { $word } le eʼesajiloʼ { $shortcut }
    }


## The variant picker

editor-variant = Bariante

editor-variant-filter = Xakab...

editor-variant-next = Chʼaʼ u táanil bariante

editor-variant-previous = Chʼaʼ u paachil bariante


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] Kaxtaʼab junpʼéel síiʼpil aksesibilidad tiʼ WCAG AA. Kʼop utiaʼal a { $action ->
            [close] kʼalik
           *[open] jeʼek
        } le informe tiʼ aksesibilidadoʼ.
        [advisories] Kʼop utiaʼal a { $action ->
            [close] kʼalik
           *[open] jeʼek
        } le informe tiʼ aksesibilidadoʼ. Maʼ kaxtaʼab síiʼpil tiʼ WCAG AAiʼ, baʼaleʼ yaan uláakʼ rekomendasiónoʼob tiʼ aksesibilidad.
       *[clean] Kʼop utiaʼal a { $action ->
            [close] kʼalik
           *[open] jeʼek
        } le informe tiʼ aksesibilidadoʼ. Mix junpʼéel talamil tiʼ aksesibilidad kaxtaʼabiʼ.
    }

editor-accessibility-label =
    { $status ->
        [violations] Kaxtaʼab junpʼéel síiʼpil aksesibilidad tiʼ WCAG AA. Kaxtaʼab { $count } síiʼpil tiʼ WCAG AA. Kʼop utiaʼal a { $action ->
            [close] kʼalik
           *[open] jeʼek
        } le informe tiʼ aksesibilidadoʼ.
        [advisories] Maʼ kaxtaʼab síiʼpil tiʼ WCAG AAiʼ. Kaxtaʼab { $count } uláakʼ rekomendasión tiʼ aksesibilidad. Kʼop utiaʼal a { $action ->
            [close] kʼalik
           *[open] jeʼek
        } le informe tiʼ aksesibilidadoʼ.
       *[clean] Maʼ kaxtaʼab síiʼpil tiʼ WCAG AAiʼ. Kʼop utiaʼal a { $action ->
            [close] kʼalik
           *[open] jeʼek
        } le informe tiʼ aksesibilidadoʼ.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = U bersión DoenetML { $version }

editor-tab-help = Áantaj yóoʼolal baʼax yaan tuʼux yaan le kursoroʼ
editor-tab-help-short = Áantaj
editor-tab-errors = Síiʼpiloʼob
editor-tab-warnings = Avisoʼob
editor-tab-info = Informasión
editor-tab-accessibility = Aksesibilidad
editor-tab-responses = Núukoʼob túuxtaʼanoʼob

editor-tab-with-count = { $label }: { $count }

editor-options = U opsiónoʼob le editoroʼ
editor-format-as-doenetml = Utskíint bey DoenetML
editor-format-as-xml = Utskíint bey XML


## The diagnostics panel

editor-diagnostic-line = Renglón #{ $line }

editor-no-errors = Minaʼan síiʼpiloʼob
editor-no-warnings = Minaʼan avisoʼob
editor-no-info = Minaʼan diagnóstikoʼob tiʼ informasión

editor-show-info-annotations = Eʼes le diagnóstikoʼob tiʼ informasión ichil le editoroʼ
editor-show-accessibility-annotations = Eʼes le diagnóstikoʼob tiʼ aksesibilidad ichil le editoroʼ

editor-accessibility-learn-more = Kan bix u meyaj Doenet yéetel aksesibilidad

editor-accessibility-violations-heading = Síiʼpiloʼob tiʼ aksesibilidad ({ $standard })

editor-accessibility-other-heading = Uláakʼ talamiloʼob tiʼ aksesibilidad
editor-none-found = Minaʼan


## Submitted responses

editor-no-responses = Maʼ túuxtaʼab mix junpʼéel núukiʼ
editor-response-answer-id = U kʼaabaʼ le núukoʼ
editor-response-response = Núuk
editor-response-credit = Kréedito
editor-response-submitted = Túuxtaʼab


## The context-help panel

help-placeholder = Tsʼáa le kursor tiʼ junpʼéel kʼaabaʼ etiketa, atributo, wa { $ref } utiaʼal a wilik le dokumentasiónoʼ.

help-unsupported-ref-chain = Maʼ kʼaʼabéetkunsaʼak áantaj tiʼ referensiaʼob yaʼabkach u jaatsil, jeʼex { $example }.

help-unresolved-ref =
    { $reason ->
        [notFound] Maʼ kaxtaʼab baʼax ku yaʼalik le referensiaaʼ: { $ref }.
        [multiple] Yaʼabach baʼax ku yaʼalik le referensiaaʼ: { $ref }.
       *[indeterminate] Maʼ tu páajtal u yojéeltaʼal baʼax ku yaʼalik { $ref }.
    }

help-learn-about-references = Kan yóoʼolal referensiaʼob →
help-reference-page = Páajina tiʼ referensia →

help-suggestions-header =
    { $location ->
        [inside] Ichil { $element }
       *[top] Tu kaʼanalil
    }{ $allowed ->
        [none] { " — mix baʼal ku bin wayeʼ." }
        [text] { " — tsʼíibt tʼaan wayeʼ." }
        [text-and-components] { " — tsʼíibt tʼaan wayeʼ, wa túunt lelaʼ:" }
       *[components] { " — baʼaxoʼob jeʼel a túuntikeʼ:" }
    }

help-suggestions-footer = Pʼuchʼ { $shortcut } utiaʼal a wilik tuláakal le { $total } komponenteʼoboʼ.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } leti junpʼéel referensia tiʼ { $target }.
       *[other] { $ref } leti junpʼéel referensia tiʼ { $target } (renglón { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] Tsʼaʼab tumen { $owner } bey { $role }.
       *[other] Tsʼaʼab tumen { $owner } tiʼ renglón { $line } bey { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } leti junpʼéel referensia tiʼ u propiedad { $property } tiʼ { $element }.
       *[other] { $ref } leti junpʼéel referensia tiʼ u propiedad { $property } tiʼ { $element } (renglón { $line }).
    }

help-kind-attribute = atributo
help-kind-snippet = snippet
help-kind-array-entry = u jaatsil arreglo

help-default = Baʼax yaan chéen beyoʼ:
help-active-default = Baʼax yaan chéen beyoʼ bejlaʼe:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Baloroʼob chaʼabal (junpʼéel tiʼ jujunpʼéel):
       *[other] Baloroʼob chaʼabal:
    }

help-suggested-values = Baloroʼob kʼubéentaʼan:

help-inserts = Ku tsʼáaik:

help-coordinates = Koordenada:

help-type = Tipo:

help-resolved-style = Estilo tsʼoʼok u yojéeltaʼal (styleNumber { $styleNumber }):

help-resolved-function-names = U kʼaabaʼob funsión tsʼoʼok u yojéeltaʼaloʼob:
help-reset-list = Listaʼ ku suʼutul tiʼ le entrada lelaʼ:
help-added-on-input = Ku tsʼaʼabal tiʼ le entrada lelaʼ:
help-removed-on-input = Ku luʼusaʼal tiʼ le entrada lelaʼ:

help-reset-overrides = { $reset } ku pʼatik tu paach { $additional } yéetel { $removed }.
