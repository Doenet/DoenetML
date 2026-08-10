# Dzongkha editor and language-server surfaces: the footer, the diagnostics
# panel, the variant picker, the accessibility button, and the context-help
# panel beside them. Selected by `uiLocale`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
#
# One plural category, so every counted select here is a single branch.
# `WCAG`, `WCAG AA`, `DoenetML`, `XML` and `styleNumber` are names and stay as
# they stand.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] ལོག་སྒྲིག
       *[update] དུས་མཐུན
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] སྟོན་བྱེད་ { $word }
       *[other] སྟོན་བྱེད་ { $word } { $shortcut }
    }


## The variant picker

editor-variant = རིགས

editor-variant-filter = བཙགས

editor-variant-next = ཤུལ་མམ་གྱི་རིགས་གདམ
editor-variant-previous = ཧེ་མམ་གྱི་རིགས་གདམ


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] WCAG AA འཛུལ་སྤྱོད་འགལ་བ་ཐོབ་ཅི། འཛུལ་སྤྱོད་སྙན་ཞུ་{ $action ->
            [close] ཁ་བསྡམ་ནི
           *[open] ཁ་ཕྱེ་ནི
        } ལུ་ཨེབ་གནང་།
        [advisories] འཛུལ་སྤྱོད་སྙན་ཞུ་{ $action ->
            [close] ཁ་བསྡམ་ནི
           *[open] ཁ་ཕྱེ་ནི
        } ལུ་ཨེབ་གནང་། WCAG AA འགལ་བ་མ་ཐོབ། དེ་འབདཝ་ད་འཛུལ་སྤྱོད་ཀྱི་གྲོས་འདེབས་གཞན་འདུག
       *[clean] འཛུལ་སྤྱོད་སྙན་ཞུ་{ $action ->
            [close] ཁ་བསྡམ་ནི
           *[open] ཁ་ཕྱེ་ནི
        } ལུ་ཨེབ་གནང་། འཛུལ་སྤྱོད་ཀྱི་དཀའ་ངལ་ག་ནི་ཡང་མ་ཐོབ།
    }

editor-accessibility-label =
    { $status ->
        [violations] WCAG AA འཛུལ་སྤྱོད་འགལ་བ་ཐོབ་ཅི། WCAG AA འགལ་བ་ { $count } ཐོབ་ཅི། འཛུལ་སྤྱོད་སྙན་ཞུ་{ $action ->
            [close] ཁ་བསྡམ་ནི
           *[open] ཁ་ཕྱེ་ནི
        } ལུ་ཨེབ་གནང་།
        [advisories] WCAG AA འགལ་བ་མ་ཐོབ། འཛུལ་སྤྱོད་ཀྱི་གྲོས་འདེབས་གཞན་ { $count } ཐོབ་ཅི། འཛུལ་སྤྱོད་སྙན་ཞུ་{ $action ->
            [close] ཁ་བསྡམ་ནི
           *[open] ཁ་ཕྱེ་ནི
        } ལུ་ཨེབ་གནང་།
       *[clean] WCAG AA འགལ་བ་མ་ཐོབ། འཛུལ་སྤྱོད་སྙན་ཞུ་{ $action ->
            [close] ཁ་བསྡམ་ནི
           *[open] ཁ་ཕྱེ་ནི
        } ལུ་ཨེབ་གནང་།
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML ཐོན་རིམ་ { $version }

editor-tab-help = སྐབས་དོན་གྱི་གྲོགས་རམ
editor-tab-help-short = སྐབས་དོན
editor-tab-errors = འཛོལ་བ
editor-tab-warnings = ཉེན་བརྡ
editor-tab-info = བརྡ་དོན
editor-tab-accessibility = འཛུལ་སྤྱོད
editor-tab-responses = བཏང་ཟིན་པའི་ལན

editor-tab-with-count = { $label }: { $count }

editor-options = ཞུན་དག་གདམ་ཁ
editor-format-as-doenetml = DoenetML སྦེ་རྩ་སྒྲིག
editor-format-as-xml = XML སྦེ་རྩ་སྒྲིག


## The diagnostics panel

editor-diagnostic-line = གྲལ་ཐིག་ #{ $line }

editor-no-errors = འཛོལ་བ་མེད
editor-no-warnings = ཉེན་བརྡ་མེད
editor-no-info = བརྡ་དོན་མེད

editor-show-info-annotations = ཞུན་དག་ནང་བརྡ་དོན་སྟོན
editor-show-accessibility-annotations = ཞུན་དག་ནང་འཛུལ་སྤྱོད་ཉེན་བརྡ་སྟོན

editor-accessibility-learn-more = Doenet གིས་འཛུལ་སྤྱོད་ལུ་བལྟ་ཐངས་ཤེས་རྟོགས་འབད

editor-accessibility-violations-heading = འཛུལ་སྤྱོད་འགལ་བ ({ $standard })

editor-accessibility-other-heading = འཛུལ་སྤྱོད་ཀྱི་དཀའ་ངལ་གཞན
editor-none-found = ག་ནི་ཡང་མ་ཐོབ


## Submitted responses

editor-no-responses = ད་ཚུན་ལན་ག་ནི་ཡང་མ་བཏང་
editor-response-answer-id = ལན་གྱི་ངོ་རྟགས
editor-response-response = ལན
editor-response-credit = སྐུགས
editor-response-submitted = བཏང་ཡི


## The context-help panel

help-placeholder = ཡིག་ཆའི་དོན་ལུ་འོད་རྟགས་ཏིག་མིང་ངམ་ཁྱད་ཆོས་ཡང་ན་ { $ref } གུ་བཞག་གནང་།

help-unsupported-ref-chain = { $example } བཟུམ་གྱི་ཡན་ལག་མང་བའི་གཞི་བསྟུན་ལུ་ད་ཚུན་གྲོགས་རམ་མིན་འདུག

help-unresolved-ref =
    { $reason ->
        [notFound] གཞི་བསྟུན་འདི་གི་དམིགས་གཏད་མ་ཐོབ། { $ref }
        [multiple] གཞི་བསྟུན་འདི་གི་དམིགས་གཏད་མང་རབས་ཅིག་ཐོབ་ཅི། { $ref }
       *[indeterminate] { $ref } གི་དམིགས་གཏད་གཏན་འབེབས་འབད་མ་ཚུགས།
    }

help-learn-about-references = གཞི་བསྟུན་གྱི་སྐོར་ལས་ཤེས་རྟོགས་འབད →
help-reference-page = གཞི་བསྟུན་ཤོག་ལེབ →

help-suggestions-header =
    { $location ->
        [inside] { $element } གི་ནང་ན
       *[top] གནས་རིམ་མཐོ་ཤོས་ལུ
    }{ $allowed ->
        [none] { " — ནཱ་ལུ་ག་ནི་ཡང་མི་འོང་།" }
        [text] { " — ནཱ་ལུ་ཚིག་ཡིག་བྲིས་གནང་།" }
        [text-and-components] { " — ནཱ་ལུ་ཚིག་ཡིག་བྲིས་གནང་། ཡང་ན་འདི་ཚུ་བལྟ།" }
       *[components] { " — འདི་ཚུ་བལྟ།" }
    }

help-suggestions-footer = ཡན་ལག་ { $total } ཆ་མཉམ་བལྟ་ནི་ལུ་ { $shortcut } ཨེབ་གནང་།

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } འདི་ { $target } ལུ་བསྟུན་པའི་གཞི་བསྟུན་ཅིག་ཨིན།
       *[other] { $ref } འདི་ { $target } ལུ་བསྟུན་པའི་གཞི་བསྟུན་ཅིག་ཨིན (གྲལ་ཐིག་ { $line })།
    }

help-ref-derived-from =
    { $line ->
        [none] { $owner } གིས་ { $role } སྦེ་བཙུགས་ནུག
       *[other] { $owner } གིས་གྲལ་ཐིག་ { $line } ལུ་ { $role } སྦེ་བཙུགས་ནུག
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } འདི་ { $element } གི་ { $property } ཁྱད་ཆོས་ལུ་བསྟུན་པའི་གཞི་བསྟུན་ཅིག་ཨིན།
       *[other] { $ref } འདི་ { $element } གི་ { $property } ཁྱད་ཆོས་ལུ་བསྟུན་པའི་གཞི་བསྟུན་ཅིག་ཨིན (གྲལ་ཐིག་ { $line })།
    }

help-kind-attribute = ཁྱད་ཆོས
help-kind-snippet = ཚིག་དུམ
help-kind-array-entry = གྲལ་སྒྲིག་ཐོ་བཀོད

help-default = སྔོན་སྒྲིག
help-active-default = ཤུགས་ལྡན་སྔོན་སྒྲིག

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] ཆོག་པའི་བེ་ལུ་ (རྣམ་གྲངས་རེ་ལུ་གཅིག)
       *[other] ཆོག་པའི་བེ་ལུ་
    }

help-suggested-values = གྲོས་འདེབས་ཀྱི་བེ་ལུ་

help-inserts = བཙུགསཔ་ཨིན

help-coordinates =
    { $count ->
       *[other] གནས་ཚད
    }

help-type = དབྱེ་བ

help-resolved-style = གཏན་འབེབས་འབད་ཡོད་པའི་བཟོ་རྣམ (styleNumber { $styleNumber })

help-resolved-function-names = གཏན་འབེབས་འབད་ཡོད་པའི་བྱེད་ལས་མིང་
help-reset-list = བཙུགས་སྤྱོད་འདི་གུ་ལོག་སྒྲིག་ཐོ་ཡིག
help-added-on-input = བཙུགས་སྤྱོད་འདི་གུ་ཁ་སྐོང་འབད་ཡོདཔ
help-removed-on-input = བཙུགས་སྤྱོད་འདི་གུ་རྩ་བསྐྲད་བཏང་ཡོདཔ

help-reset-overrides = { $reset } གིས་ { $additional } དང་ { $removed } ལས་གོང་ན་གནསཔ་ཨིན།
