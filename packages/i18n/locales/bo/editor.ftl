# Tibetan editor and language-server surfaces: the footer, the diagnostics
# panel, the variant picker, the accessibility button, and the context-help
# panel beside them. Selected by `uiLocale`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
#
# One plural category, so every counted select here is a single branch; see
# `content.ftl`'s header. `WCAG`, `WCAG AA`, `DoenetML`, `XML` and
# `styleNumber` are names and stay as they stand.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] སླར་སྒྲིག
       *[update] གསར་བཅོས
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] སྟོན་བྱེད་ { $word }
       *[other] སྟོན་བྱེད་ { $word } { $shortcut }
    }


## The variant picker

editor-variant = རྣམ་པ

editor-variant-filter = འཚག

editor-variant-next = རྗེས་མའི་རྣམ་པ་འདེམས
editor-variant-previous = སྔོན་མའི་རྣམ་པ་འདེམས


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] WCAG AA བདེ་སྤྱོད་འགལ་བ་རྙེད་བྱུང་། བདེ་སྤྱོད་སྙན་ཞུ་{ $action ->
            [close] སྒོ་རྒྱག་པར
           *[open] ཕྱེ་བར
        } ནོན་རོགས།
        [advisories] བདེ་སྤྱོད་སྙན་ཞུ་{ $action ->
            [close] སྒོ་རྒྱག་པར
           *[open] ཕྱེ་བར
        } ནོན་རོགས། WCAG AA འགལ་བ་མ་རྙེད། འོན་ཀྱང་བདེ་སྤྱོད་ཀྱི་བསམ་འཆར་གཞན་ཡོད།
       *[clean] བདེ་སྤྱོད་སྙན་ཞུ་{ $action ->
            [close] སྒོ་རྒྱག་པར
           *[open] ཕྱེ་བར
        } ནོན་རོགས། བདེ་སྤྱོད་ཀྱི་དཀའ་ངལ་གང་ཡང་མ་རྙེད།
    }

editor-accessibility-label =
    { $status ->
        [violations] WCAG AA བདེ་སྤྱོད་འགལ་བ་རྙེད་བྱུང་། WCAG AA འགལ་བ་ { $count } རྙེད་བྱུང་། བདེ་སྤྱོད་སྙན་ཞུ་{ $action ->
            [close] སྒོ་རྒྱག་པར
           *[open] ཕྱེ་བར
        } ནོན་རོགས།
        [advisories] WCAG AA འགལ་བ་མ་རྙེད། བདེ་སྤྱོད་ཀྱི་བསམ་འཆར་གཞན་ { $count } རྙེད་བྱུང་། བདེ་སྤྱོད་སྙན་ཞུ་{ $action ->
            [close] སྒོ་རྒྱག་པར
           *[open] ཕྱེ་བར
        } ནོན་རོགས།
       *[clean] WCAG AA འགལ་བ་མ་རྙེད། བདེ་སྤྱོད་སྙན་ཞུ་{ $action ->
            [close] སྒོ་རྒྱག་པར
           *[open] ཕྱེ་བར
        } ནོན་རོགས།
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML པར་གཞི་ { $version }

editor-tab-help = སྐབས་དོན་གྱི་རོགས་རམ
editor-tab-help-short = སྐབས་དོན
editor-tab-errors = ནོར་འཁྲུལ
editor-tab-warnings = ཉེན་བརྡ
editor-tab-info = གནས་ཚུལ
editor-tab-accessibility = བདེ་སྤྱོད
editor-tab-responses = སྐུར་ཟིན་པའི་ལན

editor-tab-with-count = { $label }: { $count }

editor-options = རྩོམ་སྒྲིག་གདམ་ཀ
editor-format-as-doenetml = DoenetML ལྟར་སྒྲིག
editor-format-as-xml = XML ལྟར་སྒྲིག


## The diagnostics panel

editor-diagnostic-line = ཐིག་ཕྲེང་ #{ $line }

editor-no-errors = ནོར་འཁྲུལ་མེད
editor-no-warnings = ཉེན་བརྡ་མེད
editor-no-info = གནས་ཚུལ་མེད

editor-show-info-annotations = རྩོམ་སྒྲིག་ནང་གནས་ཚུལ་སྟོན
editor-show-accessibility-annotations = རྩོམ་སྒྲིག་ནང་བདེ་སྤྱོད་ཉེན་བརྡ་སྟོན

editor-accessibility-learn-more = Doenet གིས་བདེ་སྤྱོད་ལ་ལྟ་ཚུལ་ཇི་ཡིན་ཤེས་རྟོགས་བྱེད

editor-accessibility-violations-heading = བདེ་སྤྱོད་འགལ་བ ({ $standard })

editor-accessibility-other-heading = བདེ་སྤྱོད་ཀྱི་དཀའ་ངལ་གཞན
editor-none-found = གང་ཡང་མ་རྙེད


## Submitted responses

editor-no-responses = ད་བར་ལན་གང་ཡང་མ་སྐུར
editor-response-answer-id = ལན་གྱི་ངོས་རྟགས
editor-response-response = ལན
editor-response-credit = སྐར་གྲངས
editor-response-submitted = སྐུར་ཟིན


## The context-help panel

help-placeholder = ཡིག་ཆའི་ཆེད་དུ་འོད་རྟགས་ཏིག་མིང་ངམ་ཁྱད་ཆོས་སམ་ { $ref } སྟེང་བཞག་རོགས།

help-unsupported-ref-chain = { $example } ལྟ་བུའི་ཆ་མང་གི་ཞིབ་འཇུག་ལ་ད་བར་རོགས་རམ་མེད།

help-unresolved-ref =
    { $reason ->
        [notFound] ཞིབ་འཇུག་འདིའི་དམིགས་ཡུལ་མ་རྙེད། { $ref }
        [multiple] ཞིབ་འཇུག་འདིའི་དམིགས་ཡུལ་མང་པོ་རྙེད་བྱུང་། { $ref }
       *[indeterminate] { $ref } གི་དམིགས་ཡུལ་ཐག་གཅོད་མ་ཐུབ།
    }

help-learn-about-references = ཞིབ་འཇུག་སྐོར་ཤེས་རྟོགས་བྱེད →
help-reference-page = ཞིབ་འཇུག་ཤོག་ངོས →

help-suggestions-header =
    { $location ->
        [inside] { $element } གི་ནང་
       *[top] རིམ་པ་མཐོ་ཤོས་སུ
    }{ $allowed ->
        [none] { " — འདིར་གང་ཡང་མི་འགྲོ།" }
        [text] { " — འདིར་ཡི་གེ་འབྲི་རོགས།" }
        [text-and-components] { " — འདིར་ཡི་གེ་འབྲི་རོགས། ཡང་ན་འདི་དག་ལ་ལྟོས།" }
       *[components] { " — འདི་དག་ལ་ལྟོས།" }
    }

help-suggestions-footer = ཆ་ཤས་ { $total } ཚང་མ་ལྟ་བར་ { $shortcut } ནོན།

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } ནི་ { $target } ལ་འདྲེན་པའི་ཞིབ་འཇུག་ཡིན།
       *[other] { $ref } ནི་ { $target } ལ་འདྲེན་པའི་ཞིབ་འཇུག་ཡིན (ཐིག་ཕྲེང་ { $line })།
    }

help-ref-derived-from =
    { $line ->
        [none] { $owner } ནས་ { $role } ལྟར་བཀོད།
       *[other] { $owner } ནས་ཐིག་ཕྲེང་ { $line } ལ་ { $role } ལྟར་བཀོད།
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } ནི་ { $element } གི་ { $property } ཁྱད་ཆོས་ལ་འདྲེན་པའི་ཞིབ་འཇུག་ཡིན།
       *[other] { $ref } ནི་ { $element } གི་ { $property } ཁྱད་ཆོས་ལ་འདྲེན་པའི་ཞིབ་འཇུག་ཡིན (ཐིག་ཕྲེང་ { $line })།
    }

help-kind-attribute = ཁྱད་ཆོས
help-kind-snippet = ཡིག་དུམ
help-kind-array-entry = གྲལ་ནང་འཇུག

help-default = སྔོན་སྒྲིག
help-active-default = ལས་བཞིན་པའི་སྔོན་སྒྲིག

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] ཆོག་པའི་གནས་གོང་ (རྒྱུ་ཆ་རེ་ལ་གཅིག)
       *[other] ཆོག་པའི་གནས་གོང་
    }

help-suggested-values = བསམ་འཆར་གྱི་གནས་གོང་

help-inserts = འཇུག་པ

help-coordinates =
    { $count ->
       *[other] གནས་ཚད
    }

help-type = རིགས

help-resolved-style = ཐག་ཆོད་པའི་བཟོ་ལྟ (styleNumber { $styleNumber })

help-resolved-function-names = ཐག་ཆོད་པའི་བྱེད་རྩིས་མིང་
help-reset-list = ནང་འཇུག་འདིའི་སླར་སྒྲིག་ཐོ་གཞུང་
help-added-on-input = ནང་འཇུག་འདིར་བསྣན་པ
help-removed-on-input = ནང་འཇུག་འདིར་ཕྱིར་བཏོན་པ

help-reset-overrides = { $reset } གིས་ { $additional } དང་ { $removed } ལས་གོང་ན་གནས།
