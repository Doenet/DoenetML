# Garo (A·chik ku·rang) editor and language-server surfaces: the footer, the
# diagnostics panel, the variant picker, the accessibility button and the
# context-help panel beside them. Selected by `uiLocale`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator, and
# no permission is needed to fix it.
#
# **Script: Latin.** ICU maximizes a bare `grt` to `grt-Beng`; this catalog
# writes Latin anyway, because Latin is what a Garo reader in Meghalaya reads.
# `chrome.ftl` carries the full argument, and a conversion to Bengali letters
# is a conversion of all four files at once. The raka is the middle dot «·».
#
# **The editor's vocabulary is mostly an English loan, and that is stated
# rather than hidden.** An author editing DoenetML in Meghalaya is working in
# English-medium terms — element, attribute, reference, snippet, variant,
# filter, format, style — so those words are written as English here. The Garo
# in this file is the frame around them: «man·ja» cannot, «nanga» must,
# «man·aha» found, «dongja» there is none, «pinibo» show, «-ko» accusative,
# «-ni» genitive, «-o» locative, «-rang» plural.
#
# **Nothing selects on a count.** CLDR has no plural data for `grt`, and a Garo
# noun is unmarked after a numeral, so English's two count selects are
# collapsed: `editor-accessibility-label` keeps `{ $count }` and writes one
# wording for it, and `help-coordinates` drops the placeable English used only
# to pick a plural.
#
# Words a reviewer should check first here: «sabdanani» for *warning*,
# «sokna man·ani» for *accessibility*, and «dakchakani» for *help*.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Aro Songbo
       *[update] Gitalbo
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] Viewer-ko { $word }
       *[other] Viewer-ko { $word } { $shortcut }
    }


## The variant picker

editor-variant = Variant

editor-variant-filter = Bakbo...

editor-variant-next = Ja·mangipa variant-ko sikbo

editor-variant-previous = Skanggipa variant-ko sikbo


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] WCAG AA sokna man·anini bhulko man·aha. Sokna man·anini ripot-ko { $action ->
            [close] bondho ka·na
           *[open] khena
        } klik ka·bo.
        [advisories] Sokna man·anini ripot-ko { $action ->
            [close] bondho ka·na
           *[open] khena
        } klik ka·bo. WCAG AA bhulrang man·jaha, indiba gipin sokna man·anini ku·rachakanirang donga.
       *[clean] Sokna man·anini ripot-ko { $action ->
            [close] bondho ka·na
           *[open] khena
        } klik ka·bo. Sokna man·anini jinggani dongja.
    }

# No count select: a Garo noun is unmarked after a numeral.
editor-accessibility-label =
    { $status ->
        [violations] WCAG AA sokna man·anini bhulko man·aha. { $count } WCAG AA bhulko man·aha. Sokna man·anini ripot-ko { $action ->
            [close] bondho ka·na
           *[open] khena
        } klik ka·bo.
        [advisories] WCAG AA bhulrang man·jaha. { $count } gipin sokna man·anini ku·rachakanikon man·aha. Sokna man·anini ripot-ko { $action ->
            [close] bondho ka·na
           *[open] khena
        } klik ka·bo.
       *[clean] WCAG AA bhulrang man·jaha. Sokna man·anini ripot-ko { $action ->
            [close] bondho ka·na
           *[open] khena
        } klik ka·bo.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML version { $version }

editor-tab-help = Jaepon nanggipa dakchakani
editor-tab-help-short = Jaepon
editor-tab-errors = Bhulrang
editor-tab-warnings = Sabdanani
editor-tab-info = Khobor
editor-tab-accessibility = Sokna man·ani
editor-tab-responses = On·ahagipa aganchakanirang

editor-tab-with-count = { $label }: { $count }

editor-options = Editor-ni opsonrang
editor-format-as-doenetml = DoenetML gita format ka·bo
editor-format-as-xml = XML gita format ka·bo


## The diagnostics panel

editor-diagnostic-line = Lain #{ $line }

editor-no-errors = Bhul Dongja
editor-no-warnings = Sabdanani Dongja
editor-no-info = Khobor-ni jinggani dongja

editor-show-info-annotations = Editor-o khobor-ni jingganirangko pinibo
editor-show-accessibility-annotations = Editor-o sokna man·anini jingganirangko pinibo

editor-accessibility-learn-more = Doenet sokna man·anikon maigita ra·ia, uako skibo

editor-accessibility-violations-heading = Sokna man·anini bhulrang ({ $standard })

editor-accessibility-other-heading = Sokna man·anini gipin jingganirang
editor-none-found = Maiba man·jaha


## Submitted responses

editor-no-responses = Da·o on·ahagipa aganchakani dongja
editor-response-answer-id = Aganchakani Id
editor-response-response = Aganchakani
editor-response-credit = Kredit
editor-response-submitted = On·ahaha


## The context-help panel

help-placeholder = Dokumentesan-ni gimin tag-ni bimung, attribute, ba { $ref }-o kursorko dongatbo.

help-unsupported-ref-chain = { $example } gita bang·gipa bak-ni reference-ni gimin dakchakani da·o dongja.

help-unresolved-ref =
    { $reason ->
        [notFound] Ia reference-ni gimin maiba man·jaha: { $ref }.
        [multiple] Ia reference-ni gimin bang·gipa jinis man·aha: { $ref }.
       *[indeterminate] { $ref }-ni gimin maiko sikna man·jaha.
    }

help-learn-about-references = Reference-rang-ni gimin skibo →
help-reference-page = Reference-ni pata →

help-suggestions-header =
    { $location ->
        [inside] { $element }-ni bitcho
       *[top] Chagitchamgipa laboro
    }{ $allowed ->
        [none] { " — iao maiba dongja." }
        [text] { " — iao text-ko sokbo." }
        [text-and-components] { " — iao text-ko sokbo, ba iarangko chesotbo:" }
       *[components] { " — chesotna man·gipa jinisrang:" }
    }

help-suggestions-footer = { $total } component-rang pilakko nikna { $shortcut }-ko nappitbo.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } ong·gipa { $target }-ni reference.
       *[other] { $ref } ong·gipa { $target }-ni reference (lain { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] { $owner }-chi { $role } gita dongataha.
       *[other] { $owner }-chi lain { $line }-o { $role } gita dongataha.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } ong·gipa { $element }-ni { $property } property-ni reference.
       *[other] { $ref } ong·gipa { $element }-ni { $property } property-ni reference (lain { $line }).
    }

help-kind-attribute = attribute
help-kind-snippet = snippet
help-kind-array-entry = array-ni entry

help-default = Skanggipa man:
help-active-default = Kam ka·gipa skanggipa man:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Ra·na man·gipa manrang (sakgitalsa jinisni gimin sa·sa):
       *[other] Ra·na man·gipa manrang:
    }

help-suggested-values = Ku·rachakgipa manrang:

help-inserts = Nappitgipa:

# English selects on a count here only to pick a plural. Garo does not mark
# one, so the placeable is dropped and one wording stands for both.
help-coordinates = Coordinate-rang:

help-type = Type:

help-resolved-style = Man·ahagipa style (styleNumber { $styleNumber }):

help-resolved-function-names = Man·ahagipa function-ni bimungrang:
help-reset-list = Ia input-o list-ko aro songbo:
help-added-on-input = Ia input-o dongataha:
help-removed-on-input = Ia input-o ra·kataha:

help-reset-overrides = { $reset } { $additional } aro { $removed }-ko salgen.
