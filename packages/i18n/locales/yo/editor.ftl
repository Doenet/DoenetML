# Yoruba editor and language-server surfaces. Translated from
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
# Yoruba has a single plural category, so a countable message needs no
# selection.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Tún Ṣeto
       *[update] Ṣàtúnṣe
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } Ohun Ìṣàfihàn
       *[other] { $word } Ohun Ìṣàfihàn { $shortcut }
    }


## The variant picker

editor-variant = Irúfẹ́
editor-variant-filter = Ṣàyẹ̀wò...
editor-variant-next = Yan irúfẹ́ tókàn
editor-variant-previous = Yan irúfẹ́ tẹ́lẹ̀


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] A rí ìrúfin ìwọlé WCAG AA. Tẹ̀ láti { $action ->
            [close] ti
           *[open] ṣí
        } ìròyìn ìwọlé.
        [advisories] Tẹ̀ láti { $action ->
            [close] ti
           *[open] ṣí
        } ìròyìn ìwọlé. A kò rí ìrúfin WCAG AA kankan, ṣùgbọ́n àwọn àbá ìwọlé mìíràn wà.
       *[clean] Tẹ̀ láti { $action ->
            [close] ti
           *[open] ṣí
        } ìròyìn ìwọlé. A kò rí ìṣòro ìwọlé kankan.
    }

editor-accessibility-label =
    { $status ->
        [violations] A rí ìrúfin ìwọlé WCAG AA. A rí ìrúfin WCAG AA { $count }. Tẹ̀ láti { $action ->
            [close] ti
           *[open] ṣí
        } ìròyìn ìwọlé.
        [advisories] A kò rí ìrúfin WCAG AA kankan. A rí àbá ìwọlé mìíràn { $count }. Tẹ̀ láti { $action ->
            [close] ti
           *[open] ṣí
        } ìròyìn ìwọlé.
       *[clean] A kò rí ìrúfin WCAG AA kankan. Tẹ̀ láti { $action ->
            [close] ti
           *[open] ṣí
        } ìròyìn ìwọlé.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = Ẹ̀yà DoenetML { $version }

editor-tab-help = Ìrànlọ́wọ́ tí ó bá ipò mu
editor-tab-help-short = Ipò
editor-tab-errors = Àwọn Àṣìṣe
editor-tab-warnings = Àwọn Ìkìlọ̀
editor-tab-info = Ìsọfúnni
editor-tab-accessibility = Ìwọlé
editor-tab-responses = Àwọn ìdáhùn tí a fi ránṣẹ́

editor-tab-with-count = { $label }: { $count }

editor-options = Àwọn àṣàyàn olóòtú
editor-format-as-doenetml = Ṣètò gẹ́gẹ́ bí DoenetML
editor-format-as-xml = Ṣètò gẹ́gẹ́ bí XML


## The diagnostics panel

editor-diagnostic-line = Ilà #{ $line }

editor-no-errors = Kò Sí Àṣìṣe
editor-no-warnings = Kò Sí Ìkìlọ̀
editor-no-info = Kò Sí Àyẹ̀wò Ìsọfúnni

editor-show-info-annotations = Fi àyẹ̀wò ìsọfúnni hàn nínú olóòtú
editor-show-accessibility-annotations = Fi àyẹ̀wò ìwọlé hàn nínú olóòtú

editor-accessibility-learn-more = Kọ́ bí Doenet ṣe ń wo ìwọlé

editor-accessibility-violations-heading = Àwọn ìrúfin ìwọlé ({ $standard })

editor-accessibility-other-heading = Àwọn ìṣòro ìwọlé mìíràn
editor-none-found = A kò rí ohunkóhun


## Submitted responses

editor-no-responses = Kò tí ì sí ìdáhùn tí a fi ránṣẹ́
editor-response-answer-id = Àmì Ìdámọ̀ Ìdáhùn
editor-response-response = Ìdáhùn
editor-response-credit = Àmì
editor-response-submitted = A ti fi ránṣẹ́


## The context-help panel

help-placeholder = Fi ìtọ́ka sí orúkọ àmì, ànímọ́ tàbí { $ref } fún àkọsílẹ̀.

help-unsupported-ref-chain = A kò tí ì ṣàtìlẹ́yìn fún ìrànlọ́wọ́ nípa àwọn ìtọ́kasí oníhà púpọ̀ bíi { $example }.

help-unresolved-ref =
    { $reason ->
        [notFound] A kò rí ohun tí a tọ́ka sí fún ìtọ́kasí: { $ref }.
        [multiple] A rí ohun púpọ̀ tí a tọ́ka sí fún ìtọ́kasí: { $ref }.
       *[indeterminate] A kò lè pinnu ohun tí { $ref } tọ́ka sí.
    }

help-learn-about-references = Kọ́ nípa àwọn ìtọ́kasí →
help-reference-page = Ojú-ìwé ìtọ́kasí →

help-suggestions-header =
    { $location ->
        [inside] Nínú { $element }
       *[top] Ní ipele òkè
    }{ $allowed ->
        [none] { " — kò sí ohun tí ó lọ sí ibí." }
        [text] { " — tẹ ọ̀rọ̀ síbí." }
        [text-and-components] { " — tẹ ọ̀rọ̀ síbí, tàbí gbìyànjú:" }
       *[components] { " — àwọn nǹkan láti gbìyànjú:" }
    }

help-suggestions-footer = Tẹ { $shortcut } láti rí gbogbo apá { $total }.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } jẹ́ ìtọ́kasí sí { $target }.
       *[other] { $ref } jẹ́ ìtọ́kasí sí { $target } (ilà { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] { $owner } ni ó mú un wá gẹ́gẹ́ bí { $role }.
       *[other] { $owner } ni ó mú un wá ní ilà { $line } gẹ́gẹ́ bí { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } jẹ́ ìtọ́kasí sí ànímọ́ { $property } ti { $element }.
       *[other] { $ref } jẹ́ ìtọ́kasí sí ànímọ́ { $property } ti { $element } (ilà { $line }).
    }

help-kind-attribute = ànímọ́
help-kind-snippet = ẹ̀ka kúkúrú
help-kind-array-entry = ìforúkọsílẹ̀ àkójọ

help-default = Àtìlẹ̀wá:
help-active-default = Àtìlẹ̀wá tí ń ṣiṣẹ́:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Àwọn iye tí a gbà (ọ̀kan fún ohun kọ̀ọ̀kan):
       *[other] Àwọn iye tí a gbà:
    }

help-suggested-values = Àwọn iye tí a dábàá:

help-inserts = Ó ń fi kún:

help-coordinates = Ìpò:

help-type = Irúfẹ́:

help-resolved-style = Àṣà tí a pinnu (styleNumber { $styleNumber }):

help-resolved-function-names = Àwọn orúkọ iṣẹ́ tí a pinnu:
help-reset-list = Àkójọ tí a tún ṣeto lórí ìfilọ́lẹ̀ yìí:
help-added-on-input = Èyí tí a fi kún lórí ìfilọ́lẹ̀ yìí:
help-removed-on-input = Èyí tí a yọ kúrò lórí ìfilọ́lẹ̀ yìí:

help-reset-overrides = { $reset } borí { $additional } àti { $removed }.
