# Tamil editor and language-server surfaces. Translated from
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
        [reset] மீட்டமை
       *[update] புதுப்பி
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] காட்சியாக்கியை { $word }
       *[other] காட்சியாக்கியை { $word } { $shortcut }
    }


## The variant picker

editor-variant = வகைமாதிரி
editor-variant-filter = வடிகட்டு...
editor-variant-next = அடுத்த வகைமாதிரியைத் தேர்ந்தெடு
editor-variant-previous = முந்தைய வகைமாதிரியைத் தேர்ந்தெடு


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] WCAG AA அணுகல்தன்மை மீறல் கண்டறியப்பட்டது. அணுகல்தன்மை அறிக்கையை { $action ->
            [close] மூட
           *[open] திறக்க
        } சொடுக்கவும்.
        [advisories] அணுகல்தன்மை அறிக்கையை { $action ->
            [close] மூட
           *[open] திறக்க
        } சொடுக்கவும். WCAG AA மீறல்கள் எதுவும் இல்லை, ஆனால் கூடுதல் அணுகல்தன்மைப் பரிந்துரைகள் உள்ளன.
       *[clean] அணுகல்தன்மை அறிக்கையை { $action ->
            [close] மூட
           *[open] திறக்க
        } சொடுக்கவும். அணுகல்தன்மைச் சிக்கல்கள் எதுவும் காணப்படவில்லை.
    }

editor-accessibility-label =
    { $status ->
        [violations] WCAG AA அணுகல்தன்மை மீறல் கண்டறியப்பட்டது. { $count ->
            [one] { $count } WCAG AA மீறல்
           *[other] { $count } WCAG AA மீறல்கள்
        } காணப்பட்டன. அணுகல்தன்மை அறிக்கையை { $action ->
            [close] மூட
           *[open] திறக்க
        } சொடுக்கவும்.
        [advisories] WCAG AA மீறல்கள் எதுவும் இல்லை. { $count ->
            [one] { $count } கூடுதல் அணுகல்தன்மைப் பரிந்துரை
           *[other] { $count } கூடுதல் அணுகல்தன்மைப் பரிந்துரைகள்
        } காணப்பட்டன. அணுகல்தன்மை அறிக்கையை { $action ->
            [close] மூட
           *[open] திறக்க
        } சொடுக்கவும்.
       *[clean] WCAG AA மீறல்கள் எதுவும் இல்லை. அணுகல்தன்மை அறிக்கையை { $action ->
            [close] மூட
           *[open] திறக்க
        } சொடுக்கவும்.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML பதிப்பு { $version }

editor-tab-help = சூழலுக்கேற்ற உதவி
editor-tab-help-short = சூழல்
editor-tab-errors = பிழைகள்
editor-tab-warnings = எச்சரிக்கைகள்
editor-tab-info = தகவல்
editor-tab-accessibility = அணுகல்தன்மை
editor-tab-responses = சமர்ப்பிக்கப்பட்ட பதில்கள்

editor-tab-with-count = { $label }: { $count }

editor-options = திருத்தி விருப்பங்கள்
editor-format-as-doenetml = DoenetML ஆக வடிவமை
editor-format-as-xml = XML ஆக வடிவமை


## The diagnostics panel

editor-diagnostic-line = வரி #{ $line }

editor-no-errors = பிழைகள் இல்லை
editor-no-warnings = எச்சரிக்கைகள் இல்லை
editor-no-info = தகவல் கண்டறிதல்கள் இல்லை

editor-show-info-annotations = திருத்தியில் தகவல் கண்டறிதல்களைக் காட்டு
editor-show-accessibility-annotations = திருத்தியில் அணுகல்தன்மை கண்டறிதல்களைக் காட்டு

editor-accessibility-learn-more = அணுகல்தன்மை குறித்த Doenet இன் அணுகுமுறையை அறிக

editor-accessibility-violations-heading = அணுகல்தன்மை மீறல்கள் ({ $standard })

editor-accessibility-other-heading = பிற அணுகல்தன்மைச் சிக்கல்கள்
editor-none-found = எதுவும் காணப்படவில்லை


## Submitted responses

editor-no-responses = இதுவரை பதில்கள் எதுவும் சமர்ப்பிக்கப்படவில்லை
editor-response-answer-id = விடை Id
editor-response-response = பதில்
editor-response-credit = மதிப்பெண்
editor-response-submitted = சமர்ப்பிக்கப்பட்டது


## The context-help panel

help-placeholder = ஆவணத்தைக் காண குறிச்சொல் பெயர், பண்பு அல்லது { $ref } மீது நிலைகாட்டியை வைக்கவும்.

help-unsupported-ref-chain = { $example } போன்ற பல பகுதி மேற்கோள்களுக்கான உதவி இன்னும் ஆதரிக்கப்படவில்லை.

help-unresolved-ref =
    { $reason ->
        [notFound] இந்த மேற்கோளுக்கு எதுவும் காணப்படவில்லை: { $ref }.
        [multiple] இந்த மேற்கோளுக்குப் பல பொருள்கள் காணப்பட்டன: { $ref }.
       *[indeterminate] { $ref } க்கான பொருளைத் தீர்மானிக்க முடியவில்லை.
    }

help-learn-about-references = மேற்கோள்கள் பற்றி அறிக →
help-reference-page = துணைநூல் பக்கம் →

help-suggestions-header =
    { $location ->
        [inside] { $element } இனுள்
       *[top] மேல் மட்டத்தில்
    }{ $allowed ->
        [none] { " — இங்கே எதுவும் வராது." }
        [text] { " — இங்கே உரையைத் தட்டச்சு செய்யலாம்." }
        [text-and-components] { " — இங்கே உரையைத் தட்டச்சு செய்யலாம், அல்லது இவற்றை முயற்சிக்கலாம்:" }
       *[components] { " — இவற்றை முயற்சிக்கலாம்:" }
    }

help-suggestions-footer = அனைத்து { $total } கூறுகளையும் காண { $shortcut } ஐ அழுத்தவும்.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } என்பது { $target } க்கான மேற்கோள்.
       *[other] { $ref } என்பது { $target } க்கான மேற்கோள் (வரி { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] { $owner } ஆல் { $role } ஆக அறிமுகப்படுத்தப்பட்டது.
       *[other] { $owner } ஆல் வரி { $line } இல் { $role } ஆக அறிமுகப்படுத்தப்பட்டது.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } என்பது { $element } இன் { $property } பண்புக்கான மேற்கோள்.
       *[other] { $ref } என்பது { $element } இன் { $property } பண்புக்கான மேற்கோள் (வரி { $line }).
    }

help-kind-attribute = பண்பு
help-kind-snippet = துணுக்கு
help-kind-array-entry = அணி உறுப்பு

help-default = இயல்புநிலை:
help-active-default = செயலிலுள்ள இயல்புநிலை:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] அனுமதிக்கப்பட்ட மதிப்புகள் (ஒரு உறுப்புக்கு ஒன்று):
       *[other] அனுமதிக்கப்பட்ட மதிப்புகள்:
    }

help-suggested-values = பரிந்துரைக்கப்பட்ட மதிப்புகள்:

help-inserts = சேர்ப்பவை:

help-coordinates =
    { $count ->
        [one] ஆயத்தொலைவு:
       *[other] ஆயத்தொலைவுகள்:
    }

help-type = வகை:

help-resolved-style = தீர்க்கப்பட்ட நடை (styleNumber { $styleNumber }):

help-resolved-function-names = தீர்க்கப்பட்ட சார்புப் பெயர்கள்:
help-reset-list = இந்த உள்ளீட்டில் மீட்டமைக்கப்படும் பட்டியல்:
help-added-on-input = இந்த உள்ளீட்டில் சேர்க்கப்பட்டவை:
help-removed-on-input = இந்த உள்ளீட்டில் நீக்கப்பட்டவை:

help-reset-overrides = { $reset } என்பது { $additional } மற்றும் { $removed } ஐ மேலெழுதுகிறது.
