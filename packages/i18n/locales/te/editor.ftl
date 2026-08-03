# Telugu editor and language-server surfaces. Translated from
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
        [reset] మళ్ళీ అమర్చు
       *[update] తాజాపరచు
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] దర్శినిని { $word }
       *[other] దర్శినిని { $word } { $shortcut }
    }


## The variant picker

editor-variant = రూపాంతరం
editor-variant-filter = వడపోత...
editor-variant-next = తదుపరి రూపాంతరాన్ని ఎంచుకో
editor-variant-previous = మునుపటి రూపాంతరాన్ని ఎంచుకో


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] WCAG AA అందుబాటు ఉల్లంఘన కనుగొనబడింది. అందుబాటు నివేదికను { $action ->
            [close] మూయడానికి
           *[open] తెరవడానికి
        } నొక్కండి.
        [advisories] అందుబాటు నివేదికను { $action ->
            [close] మూయడానికి
           *[open] తెరవడానికి
        } నొక్కండి. WCAG AA ఉల్లంఘనలు ఏవీ కనిపించలేదు, కానీ అదనపు అందుబాటు సిఫారసులు ఉన్నాయి.
       *[clean] అందుబాటు నివేదికను { $action ->
            [close] మూయడానికి
           *[open] తెరవడానికి
        } నొక్కండి. అందుబాటు సమస్యలు ఏవీ కనిపించలేదు.
    }

editor-accessibility-label =
    { $status ->
        [violations] WCAG AA అందుబాటు ఉల్లంఘన కనుగొనబడింది. { $count ->
            [one] { $count } WCAG AA ఉల్లంఘన
           *[other] { $count } WCAG AA ఉల్లంఘనలు
        } కనిపించాయి. అందుబాటు నివేదికను { $action ->
            [close] మూయడానికి
           *[open] తెరవడానికి
        } నొక్కండి.
        [advisories] WCAG AA ఉల్లంఘనలు ఏవీ కనిపించలేదు. { $count ->
            [one] { $count } అదనపు అందుబాటు సిఫారసు
           *[other] { $count } అదనపు అందుబాటు సిఫారసులు
        } కనిపించాయి. అందుబాటు నివేదికను { $action ->
            [close] మూయడానికి
           *[open] తెరవడానికి
        } నొక్కండి.
       *[clean] WCAG AA ఉల్లంఘనలు ఏవీ కనిపించలేదు. అందుబాటు నివేదికను { $action ->
            [close] మూయడానికి
           *[open] తెరవడానికి
        } నొక్కండి.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML రూపాంతరం { $version }

editor-tab-help = సందర్భోచిత సహాయం
editor-tab-help-short = సందర్భం
editor-tab-errors = దోషాలు
editor-tab-warnings = హెచ్చరికలు
editor-tab-info = సమాచారం
editor-tab-accessibility = అందుబాటు
editor-tab-responses = సమర్పించిన స్పందనలు

editor-tab-with-count = { $label }: { $count }

editor-options = సంపాదకి ఎంపికలు
editor-format-as-doenetml = DoenetML గా తీర్చిదిద్దు
editor-format-as-xml = XML గా తీర్చిదిద్దు


## The diagnostics panel

editor-diagnostic-line = పంక్తి #{ $line }

editor-no-errors = దోషాలు లేవు
editor-no-warnings = హెచ్చరికలు లేవు
editor-no-info = సమాచార నిర్ధారణలు లేవు

editor-show-info-annotations = సంపాదకిలో సమాచార నిర్ధారణలను చూపు
editor-show-accessibility-annotations = సంపాదకిలో అందుబాటు నిర్ధారణలను చూపు

editor-accessibility-learn-more = అందుబాటు పట్ల Doenet వైఖరిని తెలుసుకోండి

editor-accessibility-violations-heading = అందుబాటు ఉల్లంఘనలు ({ $standard })

editor-accessibility-other-heading = ఇతర అందుబాటు సమస్యలు
editor-none-found = ఏవీ కనిపించలేదు


## Submitted responses

editor-no-responses = ఇంకా ఏ స్పందనా సమర్పించబడలేదు
editor-response-answer-id = సమాధానం Id
editor-response-response = స్పందన
editor-response-credit = మార్కులు
editor-response-submitted = సమర్పించినది


## The context-help panel

help-placeholder = పత్రావళి కోసం ట్యాగు పేరు, లక్షణం లేదా { $ref } పై కర్సరు ఉంచండి.

help-unsupported-ref-chain = { $example } వంటి బహుళ భాగాల నిర్దేశాలకు సహాయం ఇంకా అందుబాటులో లేదు.

help-unresolved-ref =
    { $reason ->
        [notFound] ఈ నిర్దేశానికి ఏదీ కనిపించలేదు: { $ref }.
        [multiple] ఈ నిర్దేశానికి పలు లక్ష్యాలు కనిపించాయి: { $ref }.
       *[indeterminate] { $ref } కు లక్ష్యాన్ని నిర్ధారించలేకపోయాం.
    }

help-learn-about-references = నిర్దేశాల గురించి తెలుసుకోండి →
help-reference-page = సూచిక పేజీ →

help-suggestions-header =
    { $location ->
        [inside] { $element } లోపల
       *[top] పై స్థాయిలో
    }{ $allowed ->
        [none] { " — ఇక్కడ ఏదీ రాదు." }
        [text] { " — ఇక్కడ పాఠ్యం టైపు చేయవచ్చు." }
        [text-and-components] { " — ఇక్కడ పాఠ్యం టైపు చేయవచ్చు, లేదా వీటిని ప్రయత్నించండి:" }
       *[components] { " — వీటిని ప్రయత్నించండి:" }
    }

help-suggestions-footer = మొత్తం { $total } భాగాలను చూడటానికి { $shortcut } నొక్కండి.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } అనేది { $target } కు నిర్దేశం.
       *[other] { $ref } అనేది { $target } కు నిర్దేశం ({ $line } వ పంక్తి).
    }

help-ref-derived-from =
    { $line ->
        [none] { $owner } దీన్ని { $role } గా ప్రవేశపెట్టింది.
       *[other] { $owner } దీన్ని { $line } వ పంక్తిలో { $role } గా ప్రవేశపెట్టింది.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } అనేది { $element } యొక్క { $property } లక్షణానికి నిర్దేశం.
       *[other] { $ref } అనేది { $element } యొక్క { $property } లక్షణానికి నిర్దేశం ({ $line } వ పంక్తి).
    }

help-kind-attribute = లక్షణం
help-kind-snippet = ముక్క
help-kind-array-entry = పట్టిక అంశం

help-default = అప్రమేయం:
help-active-default = అమలులో ఉన్న అప్రమేయం:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] అనుమతించిన విలువలు (ఒక్కో అంశానికి ఒకటి):
       *[other] అనుమతించిన విలువలు:
    }

help-suggested-values = సూచించిన విలువలు:

help-inserts = చేర్చేవి:

help-coordinates =
    { $count ->
        [one] నిరూపకం:
       *[other] నిరూపకాలు:
    }

help-type = రకం:

help-resolved-style = నిర్ధారించిన శైలి (styleNumber { $styleNumber }):

help-resolved-function-names = నిర్ధారించిన ప్రమేయ పేర్లు:
help-reset-list = ఈ ఇన్‌పుట్‌లో మళ్ళీ అమర్చే జాబితా:
help-added-on-input = ఈ ఇన్‌పుట్‌లో చేర్చినవి:
help-removed-on-input = ఈ ఇన్‌పుట్‌లో తొలగించినవి:

help-reset-overrides = { $reset } అనేది { $additional } మరియు { $removed } లను అధిగమిస్తుంది.
