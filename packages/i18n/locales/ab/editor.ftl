# Abkhaz editor and language-server surfaces. Translated from
# `locales/en/editor.ftl`, which is the source of truth: `lint:i18n` rejects a
# key that does not exist there, and reports a key that exists there but not
# here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Written in the extended Cyrillic alphabet Abkhazia's schools and publishing
# use, which is what CLDR fills a bare `ab` in as (`ab-Cyrl-GE`). ԥ is U+0525
# rather than the older ҧ U+04A7, and ә is U+04D9 rather than a Latin a; ҟ, ҭ,
# ҳ, ҵ, ҷ, ҽ, ҿ, ҩ and ҕ are each one letter.
#
# Abkhaz counts in two plural categories, `one` and `other`, so the counted
# messages below keep the shape English gave them. A noun after a numeral stays
# singular, so the two branches differ only in the number they print.
#
# Nothing here agrees with a noun class: Abkhaz spells agreement as a prefix on
# a verb, and none of these sentences describes a noun the catalog supplies.
# `content.ftl`'s header is where that is worked out at length.
#
# `WCAG AA`, `DoenetML`, `XML`, `styleNumber` and every element and attribute
# name are identifiers rather than prose and stay exactly as written.
#
# **Where this file most likely reads stiffly.** Abkhaz makes a verbal noun out
# of nearly every action, and an object stands in front of it — so a button
# that reads "Update Viewer" in English reads «Ахәаԥшга арҿыцра», viewer first
# and the action second, throughout. The technical vocabulary is the Russian
# one where written Abkhaz uses the Russian one, and the coinages a speaker
# should look at first are «ахәаԥшга» for the viewer, «аԥхьаԥшра» for a
# preview, and «анеира алшара» for accessibility.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Аиҭашьақәыргылара
       *[update] Арҿыцра
    }

# The object stands in front of the verbal noun in Abkhaz, so the viewer is
# named first and { $word } follows it — the reverse of the English order.
editor-update-viewer-title =
    { $shortcut ->
        [none] Ахәаԥшга { $word }
       *[other] Ахәаԥшга { $word } { $shortcut }
    }


## The variant picker

editor-variant = Авариант
editor-variant-filter = Афильтр…
editor-variant-next = Анаҩстәи авариант алхра
editor-variant-previous = Аԥхьатәи авариант алхра


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] WCAG AA анеира алшара аеилагара ԥшаауп. Анеира алшара иазку аҳасабырба { $action ->
            [close] аркразы
           *[open] аартразы
        } иақәыӷәӷәа.
        [advisories] Анеира алшара иазку аҳасабырба { $action ->
            [close] аркразы
           *[open] аартразы
        } иақәыӷәӷәа. WCAG AA аеилагарақәа ԥшаам, аха анеира алшара иазку иацҵоу арекомендациақәа ыҟоуп.
       *[clean] Анеира алшара иазку аҳасабырба { $action ->
            [close] аркразы
           *[open] аартразы
        } иақәыӷәӷәа. Анеира алшара иазку азҵаарақәа ԥшаам.
    }

editor-accessibility-label =
    { $status ->
        [violations] WCAG AA анеира алшара аеилагара ԥшаауп. Иԥшаауп { $count ->
            [one] WCAG AA { $count } аеилагара
           *[other] WCAG AA { $count } аеилагара
        }. Анеира алшара иазку аҳасабырба { $action ->
            [close] аркразы
           *[open] аартразы
        } иақәыӷәӷәа.
        [advisories] WCAG AA аеилагарақәа ԥшаам. Иԥшаауп анеира алшара иазку иацҵоу { $count ->
            [one] { $count } арекомендациа
           *[other] { $count } арекомендациа
        }. Анеира алшара иазку аҳасабырба { $action ->
            [close] аркразы
           *[open] аартразы
        } иақәыӷәӷәа.
       *[clean] WCAG AA аеилагарақәа ԥшаам. Анеира алшара иазку аҳасабырба { $action ->
            [close] аркразы
           *[open] аартразы
        } иақәыӷәӷәа.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML аверсиа { $version }

editor-tab-help = Аконтекст иақәыршәоу ацхыраара
editor-tab-help-short = Аконтекст
editor-tab-errors = Агхақәа
editor-tab-warnings = Агәаҽанҵарақәа
editor-tab-info = Аинформациа
editor-tab-accessibility = Анеира алшара
editor-tab-responses = Идәықәҵоу аҭакқәа

editor-tab-with-count = { $label }: { $count }

editor-options = Аредактор апараметрқәа
editor-format-as-doenetml = DoenetML ала аформатркра
editor-format-as-xml = XML ала аформатркра


## The diagnostics panel

editor-diagnostic-line = Ацәаҳәа #{ $line }

editor-no-errors = Гхақәа ыҟаӡам
editor-no-warnings = Агәаҽанҵарақәа ыҟаӡам
editor-no-info = Аинформациатә диагностика ыҟаӡам

editor-show-info-annotations = Аинформациатә диагностика аредактор аҿы аарԥшра
editor-show-accessibility-annotations = Анеира алшара иазку адиагностика аредактор аҿы аарԥшра

editor-accessibility-learn-more = Doenet анеира алшара шазнеиуа шәаԥхьа

editor-accessibility-violations-heading = Анеира алшара аеилагарақәа ({ $standard })

editor-accessibility-other-heading = Анеира алшара иазку егьырҭ азҵаарақәа
editor-none-found = Акгьы иԥшаам


## Submitted responses

editor-no-responses = Ҟаза иахьӡанӡа идәықәҵоу аҭакқәа ыҟаӡам
editor-response-answer-id = Аҭак аидентификатор
editor-response-response = Аҭак
editor-response-credit = Абал
editor-response-submitted = Идәықәҵоуп


## The context-help panel

help-placeholder = Адокументациа азы акурсор атег ахьӡ, атрибут, ма { $ref } иқәыргыл.

help-unsupported-ref-chain = { $example } еиԥш ихәҭа-хәҭоу азхьарԥшқәа рзы ацхыраара ҵыхәтәанӡа иҟаӡам.

help-unresolved-ref =
    { $reason ->
        [notFound] Азхьарԥш азы иазку акгьы иԥшаам: { $ref }.
        [multiple] Азхьарԥш азы иазку рацәак иԥшааит: { $ref }.
       *[indeterminate] { $ref } иазку иашьашәалоу аилкаара ауам.
    }

help-learn-about-references = Азхьарԥшқәа ирызкны шәаԥхьа →
help-reference-page = Азхьарԥш адаҟьа →

help-suggestions-header =
    { $location ->
        [inside] { $element } аҩныҵҟа
       *[top] Хыхьтәи аҩаӡараҿы
    }{ $allowed ->
        [none] { " — араҟа акгьы иқәтәом." }
        [text] { " — араҟа атеқст ишәыҩ." }
        [text-and-components] { " — араҟа атеқст ишәыҩ, мамзаргьы:" }
       *[components] { " — ишәыԥышәар илшо:" }
    }

help-suggestions-footer = Акомпонентқәа зегь { $total } рбаразы { $shortcut } иақәыӷәӷәа.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } { $target } иазку азхьарԥшуп.
       *[other] { $ref } { $target } иазку азхьарԥшуп (ацәаҳәа { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] { $owner } { $role } ҳасабла иалагалеит.
       *[other] { $owner } { $line }-тәи ацәаҳәаҿы { $role } ҳасабла иалагалеит.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } { $element } аҷыдаҟазшьа { $property } иазку азхьарԥшуп.
       *[other] { $ref } { $element } аҷыдаҟазшьа { $property } иазку азхьарԥшуп (ацәаҳәа { $line }).
    }

help-kind-attribute = атрибут
help-kind-snippet = афрагмент
help-kind-array-entry = амассив аелемент

help-default = Астандарттә ҵакы:
help-active-default = Иактиву астандарттә ҵакы:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Иаднагало аҵакқәа (хәҭак ала акы):
       *[other] Иаднагало аҵакқәа:
    }

help-suggested-values = Ишәыԥышәар илшо аҵакқәа:

help-inserts = Иалнагалоит:

help-coordinates =
    { $count ->
        [one] Акоордината:
       *[other] Акоординатақәа:
    }

help-type = Атип:

help-resolved-style = Иалкаау астиль (styleNumber { $styleNumber }):

help-resolved-function-names = Иалкаау афункциақәа рыхьӡқәа:
help-reset-list = Ари аҭагалараҿы аиҭашьақәыргылара ахьӡынҵа:
help-added-on-input = Ари аҭагалараҿы иацҵоуп:
help-removed-on-input = Ари аҭагалараҿы ианыхуп:

help-reset-overrides = { $reset } { $additional } насгьы { $removed } рҭыԥ ааннакылоит.
