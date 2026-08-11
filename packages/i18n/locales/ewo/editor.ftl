# Ewondo editor and language-server catalog: the footer, the diagnostics
# panel, the variant picker, the accessibility button, and the context-help
# panel. Selected by `uiLocale`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
#
# See `content.ftl`'s header for the family, the loanword register and the
# `$gender`/`$role` decision. Nothing here forks on either.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Bulane
       *[update] Sɔ̂p
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } Ayôs
       *[other] { $word } Ayôs { $shortcut }
    }


## The variant picker

editor-variant = Fasô

editor-variant-filter = Fílta...

editor-variant-next = Kaba fasô ényiñ

editor-variant-previous = Kaba fasô osú


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] Abé WCAG AA a yén. Kaba na o { $action ->
            [close] kɔŋ
           *[open] fúlé
        } lapɔr ya ndoŋ.
        [advisories] Kaba na o { $action ->
            [close] kɔŋ
           *[open] fúlé
        } lapɔr ya ndoŋ. Abé WCAG AA éziŋ a yenene te, ve minten mefe ya ndoŋ mi ne.
       *[clean] Kaba na o { $action ->
            [close] kɔŋ
           *[open] fúlé
        } lapɔr ya ndoŋ. Abé ya ndoŋ éziŋ a yenene te.
    }

editor-accessibility-label =
    { $status ->
        [violations] Abé WCAG AA a yén. { $count ->
            [one] Abé WCAG AA { $count }
           *[other] Abé WCAG AA { $count }
        } a yenene. Kaba na o { $action ->
            [close] kɔŋ
           *[open] fúlé
        } lapɔr ya ndoŋ.
        [advisories] Abé WCAG AA éziŋ a yenene te. { $count ->
            [one] Minten mefe ya ndoŋ { $count }
           *[other] Minten mefe ya ndoŋ { $count }
        } a yenene. Kaba na o { $action ->
            [close] kɔŋ
           *[open] fúlé
        } lapɔr ya ndoŋ.
       *[clean] Abé WCAG AA éziŋ a yenene te. Kaba na o { $action ->
            [close] kɔŋ
           *[open] fúlé
        } lapɔr ya ndoŋ.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML version { $version }

editor-tab-help = Melú ya nkɔ̂mbɔ
editor-tab-help-short = Nkɔ̂mbɔ
editor-tab-errors = Bebé
editor-tab-warnings = Ayɛgɛlɛ
editor-tab-info = Foɔn
editor-tab-accessibility = Ndoŋ
editor-tab-responses = Ajapkɔb da lɔɔtban

editor-tab-with-count = { $label } : { $count }

editor-options = Minten mi editɛr
editor-format-as-doenetml = Bulane a DoenetML
editor-format-as-xml = Bulane a XML


## The diagnostics panel

editor-diagnostic-line = Elɔŋ #{ $line }

editor-no-errors = Bebé Éziŋ
editor-no-warnings = Ayɛgɛlɛ Éziŋ
editor-no-info = Foɔn Éziŋ

editor-show-info-annotations = Yen foɔn dama editɛr
editor-show-accessibility-annotations = Yen abé ya ndoŋ dama editɛr

editor-accessibility-learn-more = Yem avolo Doenet a fefeg ndoŋ

editor-accessibility-violations-heading = Abé ya ndoŋ ({ $standard })

editor-accessibility-other-heading = Abé bevok ya ndoŋ
editor-none-found = Éziŋ a yenene


## Submitted responses

editor-no-responses = Ajapkɔb éziŋ a lɔɔtban tɛ
editor-response-answer-id = Dzina ya Ajapkɔb
editor-response-response = Ajapkɔb
editor-response-credit = Mfaŋ
editor-response-submitted = A lɔɔtban


## The context-help panel

help-placeholder = Bulane kursɛr dama dzina ya tag, dama attribute, to dama { $ref } asu melú.

help-unsupported-ref-chain = Melú ya bilá bibaŋ nga { $example } a si mvɛ̃ te tɛ.

help-unresolved-ref =
    { $reason ->
        [notFound] Éziŋ a yenene asu bilá : { $ref }.
        [multiple] Bilá bebaŋ a yenene asu bilá : { $ref }.
       *[indeterminate] Bilá ya { $ref } a si yenene te.
    }

help-learn-about-references = Yem avolo bilá →
help-reference-page = Pázi ya bilá →

help-suggestions-header =
    { $location ->
        [inside] Dama { $element }
       *[top] A ntɔŋ
    }{ $allowed ->
        [none] { " — jôm éziŋ tɛ." }
        [text] { " — tili nkobo va." }
        [text-and-components] { " — tili nkobo va, to fetil :" }
       *[components] { " — mam ma fetil :" }
    }

help-suggestions-footer = Bíná { $shortcut } asu yen elát { $total } mi ne.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } a ne bilá dama { $target }.
       *[other] { $ref } a ne bilá dama { $target } (elɔŋ { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] { $owner } a bɔ nyo a { $role }.
       *[other] { $owner } a bɔ nyo a elɔŋ { $line } a { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } a ne bilá dama property { $property } ya { $element }.
       *[other] { $ref } a ne bilá dama property { $property } ya { $element } (elɔŋ { $line }).
    }

help-kind-attribute = attribute
help-kind-snippet = ekat
help-kind-array-entry = mbil a array

help-default = Nkɔ̂bɔ :
help-active-default = Nkɔ̂bɔ a bulu :

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Ntili mi ne mvɛ̃ (fok fok a elát) :
       *[other] Ntili mi ne mvɛ̃ :
    }

help-suggested-values = Ntili ma fetil :

help-inserts = A tob :

help-coordinates =
    { $count ->
        [one] Koordone :
       *[other] Bikoordone :
    }

help-type = Nfasô :

help-resolved-style = Style a mbílán (styleNumber { $styleNumber }) :

help-resolved-function-names = Madzina ma fɔŋksiɔŋ ma mbílán :
help-reset-list = Bulane list dama elát nyu :
help-added-on-input = A tobban dama elát nyu :
help-removed-on-input = A kɔtban dama elát nyu :

help-reset-overrides = { $reset } a kɔt { $additional } a { $removed }.
