# Gujarati editor and language-server surfaces. Translated from
# `locales/en/editor.ftl`, which is the source of truth: `lint:i18n` rejects a
# key that does not exist there, and reports a key that exists there but not
# here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# `WCAG AA`, `DoenetML`, `XML`, `styleNumber` and every attribute or element
# name are identifiers, not prose, and stay as written.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] ફરી ગોઠવો
       *[update] અદ્યતન કરો
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] દર્શક { $word }
       *[other] દર્શક { $word } { $shortcut }
    }


## The variant picker

editor-variant = પ્રકાર
editor-variant-filter = ગાળો...
editor-variant-next = આગલો પ્રકાર પસંદ કરો
editor-variant-previous = પાછલો પ્રકાર પસંદ કરો


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] WCAG AA સુગમતા ઉલ્લંઘન મળ્યું. સુગમતા અહેવાલ { $action ->
            [close] બંધ કરવા
           *[open] ખોલવા
        } ક્લિક કરો.
        [advisories] સુગમતા અહેવાલ { $action ->
            [close] બંધ કરવા
           *[open] ખોલવા
        } ક્લિક કરો. WCAG AA ઉલ્લંઘનો મળ્યાં નથી, પણ વધારાની સુગમતા ભલામણો ઉપલબ્ધ છે.
       *[clean] સુગમતા અહેવાલ { $action ->
            [close] બંધ કરવા
           *[open] ખોલવા
        } ક્લિક કરો. કોઈ સુગમતા સમસ્યા મળી નથી.
    }

editor-accessibility-label =
    { $status ->
        [violations] WCAG AA સુગમતા ઉલ્લંઘન મળ્યું. { $count ->
            [one] { $count } WCAG AA ઉલ્લંઘન
           *[other] { $count } WCAG AA ઉલ્લંઘનો
        } મળ્યાં. સુગમતા અહેવાલ { $action ->
            [close] બંધ કરવા
           *[open] ખોલવા
        } ક્લિક કરો.
        [advisories] WCAG AA ઉલ્લંઘનો મળ્યાં નથી. { $count ->
            [one] { $count } વધારાની સુગમતા ભલામણ
           *[other] { $count } વધારાની સુગમતા ભલામણો
        } મળી. સુગમતા અહેવાલ { $action ->
            [close] બંધ કરવા
           *[open] ખોલવા
        } ક્લિક કરો.
       *[clean] WCAG AA ઉલ્લંઘનો મળ્યાં નથી. સુગમતા અહેવાલ { $action ->
            [close] બંધ કરવા
           *[open] ખોલવા
        } ક્લિક કરો.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML આવૃત્તિ { $version }

editor-tab-help = સંદર્ભ પ્રમાણેની મદદ
editor-tab-help-short = સંદર્ભ
editor-tab-errors = ભૂલો
editor-tab-warnings = ચેતવણીઓ
editor-tab-info = માહિતી
editor-tab-accessibility = સુગમતા
editor-tab-responses = મોકલેલા જવાબો

editor-tab-with-count = { $label }: { $count }

editor-options = સંપાદક વિકલ્પો
editor-format-as-doenetml = DoenetML તરીકે ગોઠવો
editor-format-as-xml = XML તરીકે ગોઠવો


## The diagnostics panel

editor-diagnostic-line = લીટી #{ $line }

editor-no-errors = કોઈ ભૂલ નથી
editor-no-warnings = કોઈ ચેતવણી નથી
editor-no-info = કોઈ માહિતી નિદાન નથી

editor-show-info-annotations = સંપાદકમાં માહિતી નિદાનો બતાવો
editor-show-accessibility-annotations = સંપાદકમાં સુગમતા નિદાનો બતાવો

editor-accessibility-learn-more = સુગમતા વિશે Doenet નો અભિગમ જાણો

editor-accessibility-violations-heading = સુગમતા ઉલ્લંઘનો ({ $standard })

editor-accessibility-other-heading = અન્ય સુગમતા સમસ્યાઓ
editor-none-found = કંઈ મળ્યું નથી


## Submitted responses

editor-no-responses = હજી સુધી કોઈ જવાબ મોકલાયો નથી
editor-response-answer-id = જવાબ Id
editor-response-response = જવાબ
editor-response-credit = ગુણ
editor-response-submitted = મોકલેલું


## The context-help panel

help-placeholder = દસ્તાવેજી માહિતી માટે ટૅગનું નામ, ગુણધર્મ કે { $ref } પર કર્સર મૂકો.

help-unsupported-ref-chain = { $example } જેવા બહુભાગી સંદર્ભો માટે મદદ હજી ઉપલબ્ધ નથી.

help-unresolved-ref =
    { $reason ->
        [notFound] આ સંદર્ભ માટે કંઈ મળ્યું નથી: { $ref }.
        [multiple] આ સંદર્ભ માટે એકથી વધુ લક્ષ્ય મળ્યાં: { $ref }.
       *[indeterminate] { $ref } માટે લક્ષ્ય નક્કી થઈ શક્યું નહીં.
    }

help-learn-about-references = સંદર્ભો વિશે જાણો →
help-reference-page = સંદર્ભ પાનું →

help-suggestions-header =
    { $location ->
        [inside] { $element } ની અંદર
       *[top] ઉપલા સ્તરે
    }{ $allowed ->
        [none] { " — અહીં કંઈ આવે નહીં." }
        [text] { " — અહીં લખાણ ટાઇપ કરી શકાય." }
        [text-and-components] { " — અહીં લખાણ ટાઇપ કરી શકાય, અથવા આ અજમાવો:" }
       *[components] { " — આ અજમાવો:" }
    }

help-suggestions-footer = બધા { $total } ઘટકો જોવા { $shortcut } દબાવો.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } એ { $target } નો સંદર્ભ છે.
       *[other] { $ref } એ { $target } નો સંદર્ભ છે (લીટી { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] { $owner } એ તેને { $role } તરીકે દાખલ કર્યું.
       *[other] { $owner } એ તેને લીટી { $line } પર { $role } તરીકે દાખલ કર્યું.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } એ { $element } ના { $property } ગુણધર્મનો સંદર્ભ છે.
       *[other] { $ref } એ { $element } ના { $property } ગુણધર્મનો સંદર્ભ છે (લીટી { $line }).
    }

help-kind-attribute = ગુણધર્મ
help-kind-snippet = ટુકડો
help-kind-array-entry = શ્રેણી નોંધ

help-default = મૂળભૂત:
help-active-default = અમલમાં રહેલું મૂળભૂત:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] માન્ય મૂલ્યો (દરેક નોંધ માટે એક):
       *[other] માન્ય મૂલ્યો:
    }

help-suggested-values = સૂચવેલાં મૂલ્યો:

help-inserts = ઉમેરે છે:

help-coordinates =
    { $count ->
        [one] યામ:
       *[other] યામો:
    }

help-type = પ્રકાર:

help-resolved-style = નક્કી થયેલી શૈલી (styleNumber { $styleNumber }):

help-resolved-function-names = નક્કી થયેલાં વિધેય નામો:
help-reset-list = આ ઇનપુટ પર ફરી ગોઠવાતી યાદી:
help-added-on-input = આ ઇનપુટ પર ઉમેરાયેલાં:
help-removed-on-input = આ ઇનપુટ પરથી દૂર થયેલાં:

help-reset-overrides = { $reset } એ { $additional } અને { $removed } ને ઓવરરાઇડ કરે છે.
