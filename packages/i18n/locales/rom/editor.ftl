# Romani (Romani čhib) editor and language-server surfaces: the footer, the
# diagnostics panel, the variant picker, the accessibility button and the
# context-help panel. Selected by `uiLocale`.
#
# Translated from `locales/en/editor.ftl`, which is the source of truth.
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **`rom` is a macrolanguage tag** covering Vlax, Balkan, Carpathian, Sinte,
# Kalo and more. **The written norm here is closest to Vlax Romani**, and
# regional varieties differ. Do not use `rmy`: it canonicalises to `rom`.
#
# **Script and orthography.** Latin script, in the **standardised international
# Romani orthography in the Hancock line** — `č š ž`, the aspirates `čh ph th
# kh`, `x` and `ř`. **Courthiade's morpho-graphs (`θ ç q ǰ`) are deliberately
# not used**; see `chrome.ftl` for the full note.
#
# **What is the language's own**: «si» / «naj», «našti», «trubul», «thaj»,
# «vaj», «te», «khanči», «nisavo», «doš» for *error*, «sikav» for *show*,
# «alosar» for *choose*, «arakhadilo» for *was found*, «kotor» for *part*.
#
# **What is borrowed, and from where**: the editor's technical nouns —
# «atributo», «referensa», «komponento», «dokumentacia», «kursoro», «editoro»
# — are international Latin-Romance stock, the same register the Romani
# Union's standard uses for technical vocabulary. «avertismento» for *warning*
# is the weakest of them and is where a reviewer should start.
#
# **Counts.** CLDR has **no plural data for `rom`**, so no plural category can
# be selected: this file writes **no** `[zero]`, `[one]`, `[two]`, `[few]` or
# `[many]` branch anywhere. `editor-accessibility-label` and `help-coordinates`
# therefore carry one form each rather than English's singular/plural split.
# Romani itself would distinguish «phagipe» from «phagimata» here; that split
# is lost to CLDR's silence, not to the language.
#
# **Digits.** Every number renders in Latin digits.
#
# **`WCAG`, `WCAG AA`, `DoenetML` and `XML` are names**, not words, and stay in
# English exactly as `locales/en` writes them. So do the DoenetML identifiers
# `styleNumber` and the attribute names in `help-reset-overrides`. Every
# symbolic selector — `$action`, `$status`, `$shortcut`, `$reason`,
# `$location`, `$allowed`, `$line`, `$perItem` — is kept byte for byte from
# English.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Irisar
       *[update] Nevear
    }

# Romani puts the verb first, so the word arrives before the noun it acts on —
# the opposite of `locales/de` and `locales/gsw`, and the same shape as
# English.
editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } le sikavnos
       *[other] { $word } le sikavnos { $shortcut }
    }


## The variant picker

editor-variant = Varianta
editor-variant-filter = Filtrisar …
editor-variant-next = Alosar e aver varianta
editor-variant-previous = Alosar e anglutni varianta


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] Arakhadilo jekh phagipe le WCAG AA-sko. Klikisar te { $action ->
            [close] phandes
           *[open] putres
        } o raporto pa o resipe.
        [advisories] Klikisar te { $action ->
            [close] phandes
           *[open] putres
        } o raporto pa o resipe. Nisave WCAG-AA-phagimata či arakhadile, numa si maj but sikavimata pa o resipe.
       *[clean] Klikisar te { $action ->
            [close] phandes
           *[open] putres
        } o raporto pa o resipe. Nisave probleme le resipnasa či arakhadile.
    }

# One form for the count: CLDR has no plural rules for `rom`.
editor-accessibility-label =
    { $status ->
        [violations] Arakhadilo jekh phagipe le WCAG AA-sko. Arakhadile { $count } WCAG-AA-phagimata. Klikisar te { $action ->
            [close] phandes
           *[open] putres
        } o raporto pa o resipe.
        [advisories] Nisave WCAG-AA-phagimata či arakhadile. Arakhadile { $count } maj but sikavimata pa o resipe. Klikisar te { $action ->
            [close] phandes
           *[open] putres
        } o raporto pa o resipe.
       *[clean] Nisave WCAG-AA-phagimata či arakhadile. Klikisar te { $action ->
            [close] phandes
           *[open] putres
        } o raporto pa o resipe.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML-versia { $version }

editor-tab-help = Kontekstosko žutipe
editor-tab-help-short = Konteksto
editor-tab-errors = Doša
editor-tab-warnings = Avertismentura
editor-tab-info = Informacia
editor-tab-accessibility = Resipe
editor-tab-responses = Bičhalde phendimata

editor-tab-with-count = { $label }: { $count }

editor-options = Editorosko opcie
editor-format-as-doenetml = Formatisar sar DoenetML
editor-format-as-xml = Formatisar sar XML


## The diagnostics panel

editor-diagnostic-line = Linia #{ $line }

editor-no-errors = Nisave doša
editor-no-warnings = Nisave avertismentura
editor-no-info = Nisave info-diagnostikura

editor-show-info-annotations = Sikav le info-diagnostikura ando editoro
editor-show-accessibility-annotations = Sikav le diagnostikura pa o resipe ando editoro

editor-accessibility-learn-more = Sar o Doenet kerel buti le resipnasa

editor-accessibility-violations-heading = Phagimata le resipnasko ({ $standard })

editor-accessibility-other-heading = Aver probleme le resipnasa
editor-none-found = Khanči či arakhadilo


## Submitted responses

editor-no-responses = Inke nisave phendimata bičhalde
editor-response-answer-id = Phendimasko Id
editor-response-response = Phendipe
editor-response-credit = Kredito
editor-response-submitted = Bičhaldo


## The context-help panel

help-placeholder = Thov o kursoro pe jekh anav le tagosko, pe jekh atributo vaj pe { $ref } vaš e dokumentacia.

help-unsupported-ref-chain = Žutipe vaš butkotorutne referense sar { $example } inke naj.

help-unresolved-ref =
    { $reason ->
        [notFound] Nisavo referento či arakhadilo vaš e referensa: { $ref }.
        [multiple] But referentura arakhadile vaš e referensa: { $ref }.
       *[indeterminate] Jekh referento vaš { $ref } našti sas dinado.
    }

help-learn-about-references = Sikliov maj but pa le referense →
help-reference-page = Referensaki patrin →

help-suggestions-header =
    { $location ->
        [inside] Ande { $element }
       *[top] Pe o maj opruno nivelo
    }{ $allowed ->
        [none] { " — khanči či žal kathe." }
        [text] { " — ramosar teksto kathe." }
        [text-and-components] { " — ramosar teksto kathe, vaj zumav kadala:" }
       *[components] { " — zumav kadala:" }
    }

help-suggestions-footer = Pusav { $shortcut } te dikhes sa le { $total } komponentura.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } si jekh referensa pe { $target }.
       *[other] { $ref } si jekh referensa pe { $target } (linia { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] Andino katar { $owner } sar { $role }.
       *[other] Andino katar { $owner } pe linia { $line } sar { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } si jekh referensa pe e propietato { $property } katar { $element }.
       *[other] { $ref } si jekh referensa pe e propietato { $property } katar { $element } (linia { $line }).
    }

help-kind-attribute = atributo
help-kind-snippet = kodosko kotor
help-kind-array-entry = arrayoski intrada

help-default = Standardno valoro:
help-active-default = Aktivno standardno valoro:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Mukhle valorura (jekh pe svako elemento):
       *[other] Mukhle valorura:
    }

help-suggested-values = Phende valorura:

help-inserts = Thol andre:

# One form for the count: CLDR has no plural rules for `rom`.
help-coordinates = Koordinate:

help-type = Tipo:

help-resolved-style = Dinado stilo (styleNumber { $styleNumber }):

help-resolved-function-names = Dinade anava le funkciengo:
help-reset-list = Irisarimaski lista pe kadava intrado:
help-added-on-input = Thodino pe kadava intrado:
help-removed-on-input = Ikaldo avri pe kadava intrado:

help-reset-overrides = { $reset } si maj zuralo sar { $additional } thaj { $removed }.
