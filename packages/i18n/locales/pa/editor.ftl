# Punjabi editor and language-server surfaces. Translated from
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
        [reset] ਮੁੜ-ਸੈੱਟ ਕਰੋ
       *[update] ਤਾਜ਼ਾ ਕਰੋ
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] ਦਰਸ਼ਕ { $word }
       *[other] ਦਰਸ਼ਕ { $word } { $shortcut }
    }


## The variant picker

editor-variant = ਰੂਪ
editor-variant-filter = ਛਾਣੋ...
editor-variant-next = ਅਗਲਾ ਰੂਪ ਚੁਣੋ
editor-variant-previous = ਪਿਛਲਾ ਰੂਪ ਚੁਣੋ


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] WCAG AA ਪਹੁੰਚਯੋਗਤਾ ਉਲੰਘਣਾ ਮਿਲੀ। ਪਹੁੰਚਯੋਗਤਾ ਰਿਪੋਰਟ { $action ->
            [close] ਬੰਦ ਕਰਨ
           *[open] ਖੋਲ੍ਹਣ
        } ਲਈ ਕਲਿੱਕ ਕਰੋ।
        [advisories] ਪਹੁੰਚਯੋਗਤਾ ਰਿਪੋਰਟ { $action ->
            [close] ਬੰਦ ਕਰਨ
           *[open] ਖੋਲ੍ਹਣ
        } ਲਈ ਕਲਿੱਕ ਕਰੋ। ਕੋਈ WCAG AA ਉਲੰਘਣਾ ਨਹੀਂ ਮਿਲੀ, ਪਰ ਵਾਧੂ ਪਹੁੰਚਯੋਗਤਾ ਸਿਫ਼ਾਰਸ਼ਾਂ ਮੌਜੂਦ ਹਨ।
       *[clean] ਪਹੁੰਚਯੋਗਤਾ ਰਿਪੋਰਟ { $action ->
            [close] ਬੰਦ ਕਰਨ
           *[open] ਖੋਲ੍ਹਣ
        } ਲਈ ਕਲਿੱਕ ਕਰੋ। ਕੋਈ ਪਹੁੰਚਯੋਗਤਾ ਸਮੱਸਿਆ ਨਹੀਂ ਮਿਲੀ।
    }

editor-accessibility-label =
    { $status ->
        [violations] WCAG AA ਪਹੁੰਚਯੋਗਤਾ ਉਲੰਘਣਾ ਮਿਲੀ। { $count ->
            [one] { $count } WCAG AA ਉਲੰਘਣਾ
           *[other] { $count } WCAG AA ਉਲੰਘਣਾਵਾਂ
        } ਮਿਲੀਆਂ। ਪਹੁੰਚਯੋਗਤਾ ਰਿਪੋਰਟ { $action ->
            [close] ਬੰਦ ਕਰਨ
           *[open] ਖੋਲ੍ਹਣ
        } ਲਈ ਕਲਿੱਕ ਕਰੋ।
        [advisories] ਕੋਈ WCAG AA ਉਲੰਘਣਾ ਨਹੀਂ ਮਿਲੀ। { $count ->
            [one] { $count } ਵਾਧੂ ਪਹੁੰਚਯੋਗਤਾ ਸਿਫ਼ਾਰਸ਼
           *[other] { $count } ਵਾਧੂ ਪਹੁੰਚਯੋਗਤਾ ਸਿਫ਼ਾਰਸ਼ਾਂ
        } ਮਿਲੀਆਂ। ਪਹੁੰਚਯੋਗਤਾ ਰਿਪੋਰਟ { $action ->
            [close] ਬੰਦ ਕਰਨ
           *[open] ਖੋਲ੍ਹਣ
        } ਲਈ ਕਲਿੱਕ ਕਰੋ।
       *[clean] ਕੋਈ WCAG AA ਉਲੰਘਣਾ ਨਹੀਂ ਮਿਲੀ। ਪਹੁੰਚਯੋਗਤਾ ਰਿਪੋਰਟ { $action ->
            [close] ਬੰਦ ਕਰਨ
           *[open] ਖੋਲ੍ਹਣ
        } ਲਈ ਕਲਿੱਕ ਕਰੋ।
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML ਵਰਜਨ { $version }

editor-tab-help = ਪ੍ਰਸੰਗ ਅਨੁਸਾਰ ਮਦਦ
editor-tab-help-short = ਪ੍ਰਸੰਗ
editor-tab-errors = ਗਲਤੀਆਂ
editor-tab-warnings = ਚੇਤਾਵਨੀਆਂ
editor-tab-info = ਜਾਣਕਾਰੀ
editor-tab-accessibility = ਪਹੁੰਚਯੋਗਤਾ
editor-tab-responses = ਭੇਜੇ ਜਵਾਬ

editor-tab-with-count = { $label }: { $count }

editor-options = ਸੰਪਾਦਕ ਚੋਣਾਂ
editor-format-as-doenetml = DoenetML ਵਜੋਂ ਸੋਧੋ
editor-format-as-xml = XML ਵਜੋਂ ਸੋਧੋ


## The diagnostics panel

editor-diagnostic-line = ਸਤਰ #{ $line }

editor-no-errors = ਕੋਈ ਗਲਤੀ ਨਹੀਂ
editor-no-warnings = ਕੋਈ ਚੇਤਾਵਨੀ ਨਹੀਂ
editor-no-info = ਕੋਈ ਜਾਣਕਾਰੀ ਸੂਚਨਾ ਨਹੀਂ

editor-show-info-annotations = ਸੰਪਾਦਕ ਵਿੱਚ ਜਾਣਕਾਰੀ ਸੂਚਨਾਵਾਂ ਵਿਖਾਓ
editor-show-accessibility-annotations = ਸੰਪਾਦਕ ਵਿੱਚ ਪਹੁੰਚਯੋਗਤਾ ਸੂਚਨਾਵਾਂ ਵਿਖਾਓ

editor-accessibility-learn-more = ਪਹੁੰਚਯੋਗਤਾ ਬਾਰੇ Doenet ਦੀ ਪਹੁੰਚ ਜਾਣੋ

editor-accessibility-violations-heading = ਪਹੁੰਚਯੋਗਤਾ ਉਲੰਘਣਾਵਾਂ ({ $standard })

editor-accessibility-other-heading = ਹੋਰ ਪਹੁੰਚਯੋਗਤਾ ਸਮੱਸਿਆਵਾਂ
editor-none-found = ਕੁਝ ਨਹੀਂ ਮਿਲਿਆ


## Submitted responses

editor-no-responses = ਹਾਲੇ ਕੋਈ ਜਵਾਬ ਨਹੀਂ ਭੇਜਿਆ ਗਿਆ
editor-response-answer-id = ਜਵਾਬ Id
editor-response-response = ਜਵਾਬ
editor-response-credit = ਅੰਕ
editor-response-submitted = ਭੇਜਿਆ


## The context-help panel

help-placeholder = ਦਸਤਾਵੇਜ਼ੀ ਜਾਣਕਾਰੀ ਲਈ ਟੈਗ ਦੇ ਨਾਂ, ਗੁਣ ਜਾਂ { $ref } ਉੱਤੇ ਕਰਸਰ ਰੱਖੋ।

help-unsupported-ref-chain = { $example } ਵਰਗੇ ਬਹੁ-ਭਾਗੀ ਹਵਾਲਿਆਂ ਲਈ ਮਦਦ ਹਾਲੇ ਮੌਜੂਦ ਨਹੀਂ।

help-unresolved-ref =
    { $reason ->
        [notFound] ਇਸ ਹਵਾਲੇ ਲਈ ਕੁਝ ਨਹੀਂ ਮਿਲਿਆ: { $ref }।
        [multiple] ਇਸ ਹਵਾਲੇ ਲਈ ਕਈ ਨਿਸ਼ਾਨੇ ਮਿਲੇ: { $ref }।
       *[indeterminate] { $ref } ਲਈ ਨਿਸ਼ਾਨਾ ਤੈਅ ਨਹੀਂ ਹੋ ਸਕਿਆ।
    }

help-learn-about-references = ਹਵਾਲਿਆਂ ਬਾਰੇ ਜਾਣੋ →
help-reference-page = ਹਵਾਲਾ ਸਫ਼ਾ →

help-suggestions-header =
    { $location ->
        [inside] { $element } ਦੇ ਅੰਦਰ
       *[top] ਉੱਪਰਲੇ ਪੱਧਰ ਉੱਤੇ
    }{ $allowed ->
        [none] { " — ਇੱਥੇ ਕੁਝ ਨਹੀਂ ਆਉਂਦਾ।" }
        [text] { " — ਇੱਥੇ ਲਿਖਤ ਟਾਈਪ ਕੀਤੀ ਜਾ ਸਕਦੀ ਹੈ।" }
        [text-and-components] { " — ਇੱਥੇ ਲਿਖਤ ਟਾਈਪ ਕੀਤੀ ਜਾ ਸਕਦੀ ਹੈ, ਜਾਂ ਇਹ ਅਜ਼ਮਾਓ:" }
       *[components] { " — ਇਹ ਅਜ਼ਮਾਓ:" }
    }

help-suggestions-footer = ਸਾਰੇ { $total } ਹਿੱਸੇ ਵੇਖਣ ਲਈ { $shortcut } ਦਬਾਓ।

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } { $target } ਦਾ ਹਵਾਲਾ ਹੈ।
       *[other] { $ref } { $target } ਦਾ ਹਵਾਲਾ ਹੈ (ਸਤਰ { $line })।
    }

help-ref-derived-from =
    { $line ->
        [none] { $owner } ਨੇ ਇਸਨੂੰ { $role } ਵਜੋਂ ਪੇਸ਼ ਕੀਤਾ।
       *[other] { $owner } ਨੇ ਇਸਨੂੰ ਸਤਰ { $line } ਉੱਤੇ { $role } ਵਜੋਂ ਪੇਸ਼ ਕੀਤਾ।
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } { $element } ਦੇ { $property } ਗੁਣ ਦਾ ਹਵਾਲਾ ਹੈ।
       *[other] { $ref } { $element } ਦੇ { $property } ਗੁਣ ਦਾ ਹਵਾਲਾ ਹੈ (ਸਤਰ { $line })।
    }

help-kind-attribute = ਗੁਣ
help-kind-snippet = ਟੁਕੜਾ
help-kind-array-entry = ਲੜੀ ਇੰਦਰਾਜ

help-default = ਮੂਲ:
help-active-default = ਲਾਗੂ ਮੂਲ:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] ਪ੍ਰਵਾਨਿਤ ਮੁੱਲ (ਹਰ ਇੰਦਰਾਜ ਲਈ ਇੱਕ):
       *[other] ਪ੍ਰਵਾਨਿਤ ਮੁੱਲ:
    }

help-suggested-values = ਸੁਝਾਏ ਮੁੱਲ:

help-inserts = ਜੋੜਦਾ ਹੈ:

# «ਨਿਰਦੇਸ਼ਾਂਕ» reads as one coordinate or as several, so `$count` selects
# nothing and the branch is dropped.
help-coordinates = ਨਿਰਦੇਸ਼ਾਂਕ:

help-type = ਕਿਸਮ:

help-resolved-style = ਤੈਅ ਹੋਈ ਸ਼ੈਲੀ (styleNumber { $styleNumber }):

help-resolved-function-names = ਤੈਅ ਹੋਏ ਫਲਨ ਨਾਂ:
help-reset-list = ਇਸ ਇਨਪੁਟ ਉੱਤੇ ਮੁੜ-ਸੈੱਟ ਹੋਣ ਵਾਲੀ ਸੂਚੀ:
help-added-on-input = ਇਸ ਇਨਪੁਟ ਉੱਤੇ ਜੋੜੇ ਗਏ:
help-removed-on-input = ਇਸ ਇਨਪੁਟ ਉੱਤੋਂ ਹਟਾਏ ਗਏ:

help-reset-overrides = { $reset } { $additional } ਅਤੇ { $removed } ਉੱਤੇ ਭਾਰੂ ਪੈਂਦਾ ਹੈ।
