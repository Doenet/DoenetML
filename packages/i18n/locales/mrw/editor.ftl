# Maranao (Basa a Mëranaw) editor and language-server surfaces. Translated
# from `locales/en/editor.ftl`, which is the source of truth: `lint:i18n`
# rejects a key that does not exist there, and reports a key that exists there
# but not here as missing coverage.
#
# `WCAG AA`, `DoenetML`, `XML`, `styleNumber`, `Answer Id` and every attribute
# or element name are identifiers, not prose, and stay as written.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **The schwa is written «ë» (U+00EB)**, as `chrome.ftl`'s header sets out.
# Print also writes it **e**, **e'** or **u**; respell rather than
# retranslate, and respell all four files at once.
#
# **This is the file where the English is heaviest, and in this catalog that
# is saying something.** The editor's own nouns have no Maranao currency and
# are kept as they stand — `editor`, `viewer`, `variant`, `filter`,
# `component`, `attribute`, `reference`, `property`, `snippet`, `array entry`,
# `value`, `type`, `style`, `default`, `coordinate`, `function`, `line`,
# `tag`, `documentation`, `accessibility`, `report`, `credit`, `cursor`,
# `Answer Id`, `WCAG` — **around a Maranao frame**. What is Maranao here is
# the markers «so», «o», «ko» and «na», the linker «a», the plural «manga»,
# the negators «di» and «da», «aden» ('there is'), «paliyogat» ('required'),
# «di khagaga» ('cannot'), «sabap ko» ('because of'), and the verbs «ilay»
# (see), «gamit» (use), «pili» (choose), «oman» (add), «awa» (remove) and
# «tago» (keep).
#
# `editor-update-viewer`'s two words are kept as the English **Update** and
# **Reset**: they sit on a narrow toolbar button, and the seed had no Maranao
# pair it could vouch for that would fit. The tooltip around them is Maranao,
# and it puts the object last — «Update so Viewer» — which is the word order
# rather than an untranslated string.
#
# **No plural-category branches.** CLDR has no plural data for `mrw`, so a
# `[one]` branch would be text selected by English's rules; and Maranao leaves
# a noun unmarked after a numeral — «{ $count } a violation» is right for one
# and for many — so one form is correct anyway. Every count select is
# collapsed to a single `*[other]`.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Reset
       *[update] Update
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } so Viewer
       *[other] { $word } so Viewer { $shortcut }
    }


## The variant picker

editor-variant = Variant

editor-variant-filter = Filter...

editor-variant-next = Pilin so somonod a variant

editor-variant-previous = Pilin so miyaona a variant


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] Aden a miyailay a violation ko WCAG AA a accessibility. I-click a an { $action ->
            [close] masarahan
           *[open] malokaan
        } so accessibility report.
        [advisories] I-click a an { $action ->
            [close] masarahan
           *[open] malokaan
        } so accessibility report. Da a miyailay a violation ko WCAG AA, ogaid na aden a manga salakaw a recommendation ko accessibility.
       *[clean] I-click a an { $action ->
            [close] masarahan
           *[open] malokaan
        } so accessibility report. Da a miyailay a problema ko accessibility.
    }

editor-accessibility-label =
    { $status ->
        [violations] Aden a miyailay a violation ko WCAG AA a accessibility. Miyailay so { $count ->
           *[other] { $count } a violation ko WCAG AA
        }. I-click a an { $action ->
            [close] masarahan
           *[open] malokaan
        } so accessibility report.
        [advisories] Da a miyailay a violation ko WCAG AA. Miyailay so { $count ->
           *[other] { $count } a salakaw a recommendation ko accessibility
        }. I-click a an { $action ->
            [close] masarahan
           *[open] malokaan
        } so accessibility report.
       *[clean] Da a miyailay a violation ko WCAG AA. I-click a an { $action ->
            [close] masarahan
           *[open] malokaan
        } so accessibility report.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = Version o DoenetML { $version }

editor-tab-help = Tabang a sarig ko context
editor-tab-help-short = Context
editor-tab-errors = Manga Kasalaan
editor-tab-warnings = Manga Pakatanod
editor-tab-info = Impormasyon
editor-tab-accessibility = Accessibility
editor-tab-responses = Manga miyasogo a sëmbag

editor-tab-with-count = { $label }: { $count }

editor-options = Manga option o editor
editor-format-as-doenetml = I-format a DoenetML
editor-format-as-xml = I-format a XML


## The diagnostics panel

editor-diagnostic-line = Line #{ $line }

editor-no-errors = Da a Kasalaan
editor-no-warnings = Da a Pakatanod
editor-no-info = Da a Info a Diagnostic

editor-show-info-annotations = Pakiilayin ko editor so manga info a diagnostic
editor-show-accessibility-annotations = Pakiilayin ko editor so manga accessibility a diagnostic

editor-accessibility-learn-more = Tanodi o andamanaya i kapëmbatiyaa o Doenet ko accessibility

editor-accessibility-violations-heading = Manga violation ko accessibility ({ $standard })

editor-accessibility-other-heading = Manga salakaw a problema ko accessibility
editor-none-found = Da a miyailay


## Submitted responses

editor-no-responses = Da pën a miyasogo a sëmbag
editor-response-answer-id = Answer Id
editor-response-response = Sëmbag
editor-response-credit = Kredito
editor-response-submitted = Miyasogo


## The context-help panel

help-placeholder = Tagoon so cursor ko isa a ngaran a tag, attribute, odi na { $ref } a an makowa so documentation.

help-unsupported-ref-chain = Da pën masuporta so tabang ko manga reference a madakël i bagi, a datar o { $example }.

help-unresolved-ref =
    { $reason ->
        [notFound] Da a miyailay a pëtoroon o reference: { $ref }.
        [multiple] Madakël a pëtoroon a miyailay o reference: { $ref }.
       *[indeterminate] Di khagaga a matëndo so pëtoroon o { $ref }.
    }

help-learn-about-references = Tanodi so makapantag ko manga reference →
help-reference-page = Reference page →

help-suggestions-header =
    { $location ->
        [inside] Ko soled o { $element }
       *[top] Ko poporoan a level
    }{ $allowed ->
        [none] { " — da a khatago sii." }
        [text] { " — panorat sa text sii." }
        [text-and-components] { " — panorat sa text sii, odi na sobokan:" }
       *[components] { " — manga khasobokan:" }
    }

help-suggestions-footer = Pindotën so { $shortcut } a an mailay so langon a { $total } a component.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] So { $ref } na reference ko { $target }.
       *[other] So { $ref } na reference ko { $target } (line { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] Piyakasoled o { $owner } a { $role }.
       *[other] Piyakasoled o { $owner } ko line { $line } a { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] So { $ref } na reference ko { $property } a property o { $element }.
       *[other] So { $ref } na reference ko { $property } a property o { $element } (line { $line }).
    }

help-kind-attribute = attribute
help-kind-snippet = snippet
help-kind-array-entry = array entry

help-default = Default:
help-active-default = Pëkhagamit a default:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Manga khibëgay a value (isa ko oman i item):
       *[other] Manga khibëgay a value:
    }

help-suggested-values = Manga misusuggest a value:

help-inserts = Pëtagoon:

help-coordinates =
    { $count ->
       *[other] Coordinate:
    }

help-type = Type:

help-resolved-style = Miyatëndo a style (styleNumber { $styleNumber }):

help-resolved-function-names = Manga miyatëndo a ngaran o function:
help-reset-list = I-reset so list ko sangkai a input:
help-added-on-input = Miyaoman ko sangkai a input:
help-removed-on-input = Miyaawa ko sangkai a input:

help-reset-overrides = So { $reset } i pëkhasambi ko { $additional } go so { $removed }.
