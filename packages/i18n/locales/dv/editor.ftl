# Dhivehi editor and language-server surfaces: the footer, the diagnostics
# panel, the variant picker, the accessibility button, and the context-help
# panel beside them. Selected by `uiLocale`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
#
# Thaana, right to left, written in logical order. The arrows in the two help
# links are direction rather than punctuation and are turned around here.
# `WCAG`, `WCAG AA`, `DoenetML`, `XML` and `styleNumber` are names and stay as
# they stand.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] ރީސެޓް
       *[update] އަޕްޑޭޓް
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] ވިއުއަރ { $word }
       *[other] ވިއުއަރ { $word } { $shortcut }
    }


## The variant picker

editor-variant = ވައްތަރު

editor-variant-filter = ފިލްޓަރު…

editor-variant-next = ދެން އަންނަ ވައްތަރު ހޮވާ

editor-variant-previous = ކުރީގެ ވައްތަރު ހޮވާ


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] WCAG AA ވާސިލުވުމުގެ ޚިލާފުވުމެއް ފެނިއްޖެ. ވާސިލުވުމުގެ ރިޕޯޓު { $action ->
            [close] ބަންދުކުރަން
           *[open] ހުޅުވަން
        } ކްލިކްކުރައްވާ.
        [advisories] ވާސިލުވުމުގެ ރިޕޯޓު { $action ->
            [close] ބަންދުކުރަން
           *[open] ހުޅުވަން
        } ކްލިކްކުރައްވާ. WCAG AA ޚިލާފުވުމެއް ނުފެނުނު، ނަމަވެސް އިތުރު ވާސިލުވުމުގެ ލަފާ އެބަހުރި.
       *[clean] ވާސިލުވުމުގެ ރިޕޯޓު { $action ->
            [close] ބަންދުކުރަން
           *[open] ހުޅުވަން
        } ކްލިކްކުރައްވާ. ވާސިލުވުމުގެ އެއްވެސް މައްސަލައެއް ނުފެނުނު.
    }

editor-accessibility-label =
    { $status ->
        [violations] WCAG AA ވާސިލުވުމުގެ ޚިލާފުވުމެއް ފެނިއްޖެ. { $count ->
            [one] { $count } WCAG AA ޚިލާފުވުން
           *[other] { $count } WCAG AA ޚިލާފުވުން
        } ފެނުނު. ވާސިލުވުމުގެ ރިޕޯޓު { $action ->
            [close] ބަންދުކުރަން
           *[open] ހުޅުވަން
        } ކްލިކްކުރައްވާ.
        [advisories] WCAG AA ޚިލާފުވުމެއް ނުފެނުނު. { $count ->
            [one] { $count } އިތުރު ވާސިލުވުމުގެ ލަފާ
           *[other] { $count } އިތުރު ވާސިލުވުމުގެ ލަފާ
        } ފެނުނު. ވާސިލުވުމުގެ ރިޕޯޓު { $action ->
            [close] ބަންދުކުރަން
           *[open] ހުޅުވަން
        } ކްލިކްކުރައްވާ.
       *[clean] WCAG AA ޚިލާފުވުމެއް ނުފެނުނު. ވާސިލުވުމުގެ ރިޕޯޓު { $action ->
            [close] ބަންދުކުރަން
           *[open] ހުޅުވަން
        } ކްލިކްކުރައްވާ.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML ވަރޝަން { $version }

editor-tab-help = ހާލަތާ ގުޅޭ އެހީ
editor-tab-help-short = ހާލަތު
editor-tab-errors = ކުށް
editor-tab-warnings = އިންޒާރު
editor-tab-info = މައުލޫމާތު
editor-tab-accessibility = ވާސިލުވުން
editor-tab-responses = ފޮނުވި ޖަވާބު

editor-tab-with-count = { $label }: { $count }

editor-options = އެޑިޓަރު އިޚްތިޔާރު
editor-format-as-doenetml = DoenetML ގޮތަށް ތަރުތީބުކުރޭ
editor-format-as-xml = XML ގޮތަށް ތަރުތީބުކުރޭ


## The diagnostics panel

editor-diagnostic-line = ފޮޅުވަތް #{ $line }

editor-no-errors = ކުށެއް ނެތް
editor-no-warnings = އިންޒާރެއް ނެތް
editor-no-info = މައުލޫމާތެއް ނެތް

editor-show-info-annotations = އެޑިޓަރުގައި މައުލޫމާތު ދައްކާ
editor-show-accessibility-annotations = އެޑިޓަރުގައި ވާސިލުވުމުގެ އިންޒާރު ދައްކާ

editor-accessibility-learn-more = Doenet ވާސިލުވުމަށް ދެކޭ ގޮތް ދެނެގަންނަވާ

editor-accessibility-violations-heading = ވާސިލުވުމުގެ ޚިލާފުވުން ({ $standard })

editor-accessibility-other-heading = އެހެނިހެން ވާސިލުވުމުގެ މައްސަލަ
editor-none-found = އެއްވެސް އެއްޗެއް ނުފެނުނު


## Submitted responses

editor-no-responses = އަދި އެއްވެސް ޖަވާބެއް ނުފޮނުވާ
editor-response-answer-id = ޖަވާބު އައިޑީ
editor-response-response = ޖަވާބު
editor-response-credit = މާކްސް
editor-response-submitted = ފޮނުވިއްޖެ


## The context-help panel

help-placeholder = ލިޔެކިޔުމަށްޓަކައި ކާސަރު ޓެގު ނަން، ސިފަ، ނުވަތަ { $ref } މަތީގައި ބަހައްޓަވާ.

help-unsupported-ref-chain = { $example } ފަދަ ގިނަ ބައި ހިމެނޭ ރިފަރެންސްތަކަށް އަދި އެހީއެއް ނެތް.

help-unresolved-ref =
    { $reason ->
        [notFound] މި ރިފަރެންސްގެ އަމާޒެއް ނުފެނުނު: { $ref }.
        [multiple] މި ރިފަރެންސްގެ ގިނަ އަމާޒު ފެނުނު: { $ref }.
       *[indeterminate] { $ref } ގެ އަމާޒު ކަނޑައެއް ނޭޅުނު.
    }

help-learn-about-references = ރިފަރެންސްތަކާ ބެހޭގޮތުން ދެނެގަންނަވާ ←
help-reference-page = ރިފަރެންސް ސަފުހާ ←

help-suggestions-header =
    { $location ->
        [inside] { $element } ގެ ތެރޭގައި
       *[top] އެންމެ މަތީ ފަންތީގައި
    }{ $allowed ->
        [none] { " — މިތާ އެއްވެސް އެއްޗެއް ނުދާނެ." }
        [text] { " — މިތާ ލިޔުން ލިޔުއްވާ." }
        [text-and-components] { " — މިތާ ލިޔުން ލިޔުއްވާ، ނުވަތަ މިތަކެތި ބައްލަވާ:" }
       *[components] { " — މިތަކެތި ބައްލަވާ:" }
    }

help-suggestions-footer = ހުރިހާ { $total } ބައި ބެއްލެވުމަށް { $shortcut } ފިއްތަވާ.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } އަކީ { $target } ގެ ރިފަރެންސެއް.
       *[other] { $ref } އަކީ { $target } ގެ ރިފަރެންސެއް (ފޮޅުވަތް { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] { $owner } ން { $role } ގެ ގޮތުގައި ގެނައި.
       *[other] { $owner } ން ފޮޅުވަތް { $line } ގައި { $role } ގެ ގޮތުގައި ގެނައި.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } އަކީ { $element } ގެ { $property } ސިފައިގެ ރިފަރެންސެއް.
       *[other] { $ref } އަކީ { $element } ގެ { $property } ސިފައިގެ ރިފަރެންސެއް (ފޮޅުވަތް { $line }).
    }

help-kind-attribute = ސިފަ
help-kind-snippet = ކުޑަ ބައި
help-kind-array-entry = އެރޭ އެންޓްރީ

help-default = އަސާސީ:
help-active-default = ހިނގަމުންދާ އަސާސީ:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] ހުއްދަ އަގުތައް (ކޮންމެ އެއްޗަކަށް އެއް):
       *[other] ހުއްދަ އަގުތައް:
    }

help-suggested-values = ލަފާދެވޭ އަގުތައް:

help-inserts = އިތުރުކުރޭ:

help-coordinates =
    { $count ->
        [one] ކޯޑިނޭޓް:
       *[other] ކޯޑިނޭޓް:
    }

help-type = ވައްތަރު:

help-resolved-style = ކަނޑައެޅުނު ސްޓައިލް (styleNumber { $styleNumber }):

help-resolved-function-names = ކަނޑައެޅުނު ފަންކްޝަން ނަން:
help-reset-list = މި އިންޕުޓުގައި ރީސެޓް ލިސްޓު:
help-added-on-input = މި އިންޕުޓުގައި އިތުރުކުރެވުނު:
help-removed-on-input = މި އިންޕުޓުގައި ނެގުނު:

help-reset-overrides = { $reset } ން { $additional } އާއި { $removed } ގެ މައްޗަށް އިސްކަންދޭ.
