# Armenian editor and language-server surfaces. Translated from
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
# Armenian counts in the same two categories English does, so every selection
# below keeps both branches — though a noun after a numeral stays singular, so
# the two often read alike.
#
# An affix is never welded to a placeable. The definite article alternates on
# the sound before it — «-ը» after a consonant, «-ն» after a vowel — and the
# value is unknown here, so where the sentence wants a determined noun the
# article goes on a word this catalog writes («{ $attribute } ատրիբուտը»,
# «{ $action } գործողությունը») and the value stays bare. The genitive «-ի»,
# the dative «-ին», the ablative «-ից» and the locative «-ում» do not
# alternate, so those still sit directly on a value.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Վերականգնել
       *[update] Թարմացնել
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } դիտիչը
       *[other] { $word } դիտիչը { $shortcut }
    }


## The variant picker

editor-variant = Տարբերակ
editor-variant-filter = Զտում…
editor-variant-next = Ընտրել հաջորդ տարբերակը
editor-variant-previous = Ընտրել նախորդ տարբերակը


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] Հայտնաբերվել է WCAG AA մատչելիության խախտում։ Սեղմեք՝ մատչելիության հաշվետվությունը { $action ->
            [close] փակելու
           *[open] բացելու
        } համար։
        [advisories] Սեղմեք՝ մատչելիության հաշվետվությունը { $action ->
            [close] փակելու
           *[open] բացելու
        } համար։ WCAG AA խախտումներ չեն հայտնաբերվել, սակայն կան մատչելիության լրացուցիչ առաջարկություններ։
       *[clean] Սեղմեք՝ մատչելիության հաշվետվությունը { $action ->
            [close] փակելու
           *[open] բացելու
        } համար։ Մատչելիության խնդիրներ չեն հայտնաբերվել։
    }

editor-accessibility-label =
    { $status ->
        [violations] Հայտնաբերվել է WCAG AA մատչելիության խախտում։ Գտնվել է { $count ->
            [one] { $count } WCAG AA խախտում
           *[other] { $count } WCAG AA խախտում
        }։ Սեղմեք՝ մատչելիության հաշվետվությունը { $action ->
            [close] փակելու
           *[open] բացելու
        } համար։
        [advisories] WCAG AA խախտումներ չեն հայտնաբերվել։ Գտնվել է { $count ->
            [one] մատչելիության { $count } լրացուցիչ առաջարկություն
           *[other] մատչելիության { $count } լրացուցիչ առաջարկություն
        }։ Սեղմեք՝ մատչելիության հաշվետվությունը { $action ->
            [close] փակելու
           *[open] բացելու
        } համար։
       *[clean] WCAG AA խախտումներ չեն հայտնաբերվել։ Սեղմեք՝ մատչելիության հաշվետվությունը { $action ->
            [close] փակելու
           *[open] բացելու
        } համար։
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML տարբերակ { $version }

editor-tab-help = Համատեքստային օգնություն
editor-tab-help-short = Համատեքստ
editor-tab-errors = Սխալներ
editor-tab-warnings = Զգուշացումներ
editor-tab-info = Տեղեկություն
editor-tab-accessibility = Մատչելիություն
editor-tab-responses = Ուղարկված պատասխաններ

editor-tab-with-count = { $label }: { $count }

editor-options = Խմբագրիչի կարգավորումներ
editor-format-as-doenetml = Ձևաչափել որպես DoenetML
editor-format-as-xml = Ձևաչափել որպես XML


## The diagnostics panel

editor-diagnostic-line = Տող #{ $line }

editor-no-errors = Սխալներ չկան
editor-no-warnings = Զգուշացումներ չկան
editor-no-info = Տեղեկատվական ծանուցումներ չկան

editor-show-info-annotations = Ցույց տալ տեղեկատվական ծանուցումները խմբագրիչում
editor-show-accessibility-annotations = Ցույց տալ մատչելիության ծանուցումները խմբագրիչում

editor-accessibility-learn-more = Ինչպես է Doenet-ը մոտենում մատչելիությանը

editor-accessibility-violations-heading = Մատչելիության խախտումներ ({ $standard })

editor-accessibility-other-heading = Մատչելիության այլ խնդիրներ
editor-none-found = Ոչինչ չի գտնվել


## Submitted responses

editor-no-responses = Դեռ ուղարկված պատասխաններ չկան
editor-response-answer-id = Պատասխանի Id
editor-response-response = Պատասխան
editor-response-credit = Միավոր
editor-response-submitted = Ուղարկված է


## The context-help panel

help-placeholder = Փաստաթղթավորումը տեսնելու համար կուրսորը դրեք պիտակի անվան, ատրիբուտի կամ { $ref }-ի վրա։

help-unsupported-ref-chain = { $example } տեսքի բազմամաս հղումների օգնությունը դեռ չի աջակցվում։

help-unresolved-ref =
    { $reason ->
        [notFound] Հղման համար օբյեկտ չի գտնվել՝ { $ref }։
        [multiple] Հղման համար գտնվել է մի քանի օբյեկտ՝ { $ref }։
       *[indeterminate] { $ref } հղման օբյեկտը չհաջողվեց որոշել։
    }

help-learn-about-references = Իմանալ հղումների մասին →
help-reference-page = Տեղեկատու էջ →

help-suggestions-header =
    { $location ->
        [inside] { $element }-ի ներսում
       *[top] Վերին մակարդակում
    }{ $allowed ->
        [none] { " — այստեղ ոչինչ չի կարող լինել։" }
        [text] { " — այստեղ կարելի է տեքստ գրել։" }
        [text-and-components] { " — այստեղ կարելի է տեքստ գրել կամ փորձել՝" }
       *[components] { " — կարելի է փորձել՝" }
    }

help-suggestions-footer = Սեղմեք { $shortcut }՝ բոլոր { $total } բաղադրիչները տեսնելու համար։

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } հղումը ցույց է տալիս { $target }-ին։
       *[other] { $ref } հղումը ցույց է տալիս { $target }-ին ({ $line } տող)։
    }

help-ref-derived-from =
    { $line ->
        [none] Ներմուծվել է { $owner }-ի կողմից՝ որպես { $role }։
       *[other] Ներմուծվել է { $owner }-ի կողմից՝ { $line } տողում, որպես { $role }։
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } հղումը ցույց է տալիս { $element }-ի { $property } հատկությանը։
       *[other] { $ref } հղումը ցույց է տալիս { $element }-ի { $property } հատկությանը ({ $line } տող)։
    }

help-kind-attribute = ատրիբուտ
help-kind-snippet = հատված
help-kind-array-entry = զանգվածի տարր

help-default = Լռելյայն արժեքը՝
help-active-default = Գործող լռելյայն արժեքը՝

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Թույլատրելի արժեքները (մեկը յուրաքանչյուր տարրի համար)՝
       *[other] Թույլատրելի արժեքները՝
    }

help-suggested-values = Առաջարկվող արժեքները՝

help-inserts = Ավելացնում է՝

help-coordinates =
    { $count ->
        [one] Կոորդինատ՝
       *[other] Կոորդինատներ՝
    }

help-type = Տեսակը՝

help-resolved-style = Ստացված ոճը (styleNumber { $styleNumber })՝

help-resolved-function-names = Ստացված ֆունկցիաների անունները՝
help-reset-list = Այս դաշտի վերականգնման ցանկը՝
help-added-on-input = Այս դաշտում ավելացվածը՝
help-removed-on-input = Այս դաշտից հեռացվածը՝

help-reset-overrides = { $reset } ատրիբուտը գերակայում է { $additional }-ի և { $removed }-ի նկատմամբ։
