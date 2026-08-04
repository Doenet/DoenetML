# Sinhala editor and language-server surfaces. Translated from
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
#
# A Sinhala noun standing after a numeral takes one form whatever the numeral
# is, so the counted messages here need no selection.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] යළි සකසන්න
       *[update] යාවත්කාලීන කරන්න
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] දර්ශකය { $word }
       *[other] දර්ශකය { $word } { $shortcut }
    }


## The variant picker

editor-variant = ප්‍රභේදය
editor-variant-filter = පෙරන්න...
editor-variant-next = මීළඟ ප්‍රභේදය තෝරන්න
editor-variant-previous = පෙර ප්‍රභේදය තෝරන්න


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] WCAG AA ප්‍රවේශ්‍යතා උල්ලංඝනයක් හඳුනාගන්නා ලදී. ප්‍රවේශ්‍යතා වාර්තාව { $action ->
            [close] වැසීමට
           *[open] විවෘත කිරීමට
        } ක්ලික් කරන්න.
        [advisories] ප්‍රවේශ්‍යතා වාර්තාව { $action ->
            [close] වැසීමට
           *[open] විවෘත කිරීමට
        } ක්ලික් කරන්න. WCAG AA උල්ලංඝන හමු නොවීය, නමුත් අමතර ප්‍රවේශ්‍යතා නිර්දේශ තිබේ.
       *[clean] ප්‍රවේශ්‍යතා වාර්තාව { $action ->
            [close] වැසීමට
           *[open] විවෘත කිරීමට
        } ක්ලික් කරන්න. ප්‍රවේශ්‍යතා ගැටලු හමු නොවීය.
    }

editor-accessibility-label =
    { $status ->
        [violations] WCAG AA ප්‍රවේශ්‍යතා උල්ලංඝනයක් හඳුනාගන්නා ලදී. WCAG AA උල්ලංඝන { $count }ක් හමු විය. ප්‍රවේශ්‍යතා වාර්තාව { $action ->
            [close] වැසීමට
           *[open] විවෘත කිරීමට
        } ක්ලික් කරන්න.
        [advisories] WCAG AA උල්ලංඝන හඳුනාගෙන නොමැත. අමතර ප්‍රවේශ්‍යතා නිර්දේශ { $count }ක් හමු විය. ප්‍රවේශ්‍යතා වාර්තාව { $action ->
            [close] වැසීමට
           *[open] විවෘත කිරීමට
        } ක්ලික් කරන්න.
       *[clean] WCAG AA උල්ලංඝන හඳුනාගෙන නොමැත. ප්‍රවේශ්‍යතා වාර්තාව { $action ->
            [close] වැසීමට
           *[open] විවෘත කිරීමට
        } ක්ලික් කරන්න.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML අනුවාදය { $version }

editor-tab-help = සන්දර්භය අනුව උපකාර
editor-tab-help-short = සන්දර්භය
editor-tab-errors = දෝෂ
editor-tab-warnings = අනතුරු ඇඟවීම්
editor-tab-info = තොරතුරු
editor-tab-accessibility = ප්‍රවේශ්‍යතාව
editor-tab-responses = යොමු කළ පිළිතුරු

editor-tab-with-count = { $label }: { $count }

editor-options = සංස්කාරක විකල්ප
editor-format-as-doenetml = DoenetML ලෙස හැඩගන්වන්න
editor-format-as-xml = XML ලෙස හැඩගන්වන්න


## The diagnostics panel

editor-diagnostic-line = පේළිය #{ $line }

editor-no-errors = දෝෂ නැත
editor-no-warnings = අනතුරු ඇඟවීම් නැත
editor-no-info = තොරතුරු රෝග විනිශ්චය නැත

editor-show-info-annotations = සංස්කාරකයේ තොරතුරු රෝග විනිශ්චය පෙන්වන්න
editor-show-accessibility-annotations = සංස්කාරකයේ ප්‍රවේශ්‍යතා රෝග විනිශ්චය පෙන්වන්න

editor-accessibility-learn-more = Doenet ප්‍රවේශ්‍යතාවට එළඹෙන ආකාරය ගැන දැනගන්න

editor-accessibility-violations-heading = ප්‍රවේශ්‍යතා උල්ලංඝන ({ $standard })

editor-accessibility-other-heading = වෙනත් ප්‍රවේශ්‍යතා ගැටලු
editor-none-found = කිසිවක් හමු නොවීය


## Submitted responses

editor-no-responses = තවම යොමු කළ පිළිතුරු නැත
editor-response-answer-id = Answer Id
editor-response-response = පිළිතුර
editor-response-credit = ලකුණු
editor-response-submitted = යොමු කළේ


## The context-help panel

help-placeholder = ලේඛන සඳහා ටැග නාමයක්, උපලක්ෂණයක් හෝ { $ref } මත කර්සරය තබන්න.

help-unsupported-ref-chain = { $example } වැනි බහු-කොටස් යොමු සඳහා උපකාර තවම සහාය නොදක්වයි.

help-unresolved-ref =
    { $reason ->
        [notFound] යොමුව සඳහා යොමු වන දෙයක් හමු නොවීය: { $ref }.
        [multiple] යොමුව සඳහා යොමු වන දේවල් කිහිපයක් හමු විය: { $ref }.
       *[indeterminate] { $ref } යොමු වන දෙය නිර්ණය කළ නොහැකි විය.
    }

help-learn-about-references = යොමු ගැන දැනගන්න →
help-reference-page = යොමු පිටුව →

help-suggestions-header =
    { $location ->
        [inside] { $element } ඇතුළත
       *[top] ඉහළම මට්ටමේ
    }{ $allowed ->
        [none] { " — මෙහි කිසිවක් තැබිය නොහැක." }
        [text] { " — මෙහි පෙළ ලියන්න." }
        [text-and-components] { " — මෙහි පෙළ ලියන්න, නැතහොත් උත්සාහ කරන්න:" }
       *[components] { " — උත්සාහ කළ හැකි දේ:" }
    }

help-suggestions-footer = සියලුම සංරචක { $total } බැලීමට { $shortcut } ඔබන්න.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } යනු { $target } වෙත යොමුවකි.
       *[other] { $ref } යනු { $target } වෙත යොමුවකි (පේළිය { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] { $owner } විසින් { $role } ලෙස හඳුන්වා දෙන ලදී.
       *[other] { $owner } විසින් { $line } පේළියේ { $role } ලෙස හඳුන්වා දෙන ලදී.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } යනු { $element } හි { $property } ගුණාංගය වෙත යොමුවකි.
       *[other] { $ref } යනු { $element } හි { $property } ගුණාංගය වෙත යොමුවකි (පේළිය { $line }).
    }

help-kind-attribute = උපලක්ෂණය
help-kind-snippet = කේත කැබැල්ල
help-kind-array-entry = අරා ඇතුළත් කිරීම

help-default = පෙරනිමිය:
help-active-default = ක්‍රියාකාරී පෙරනිමිය:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] අවසර ලත් අගයන් (එක් අයිතමයකට එකක්):
       *[other] අවසර ලත් අගයන්:
    }

help-suggested-values = යෝජිත අගයන්:

help-inserts = ඇතුළත් කරයි:

help-coordinates = ඛණ්ඩාංක:

help-type = වර්ගය:

help-resolved-style = නිර්ණය කළ ශෛලිය (styleNumber { $styleNumber }):

help-resolved-function-names = නිර්ණය කළ ශ්‍රිත නාම:
help-reset-list = මෙම ආදානයේ යළි සැකසුම් ලැයිස්තුව:
help-added-on-input = මෙම ආදානයට එකතු කළේ:
help-removed-on-input = මෙම ආදානයෙන් ඉවත් කළේ:

help-reset-overrides = { $reset } මගින් { $additional } සහ { $removed } අභිබවා යයි.
