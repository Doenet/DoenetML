# Muslim Tat (zuhun-i tati) editor and language-server surfaces. Translated
# from `locales/en/editor.ftl`, which is the source of truth: `lint:i18n`
# rejects a key that does not exist there, and reports a key that exists there
# but not here as missing coverage.
#
# `WCAG AA`, `DoenetML`, `XML`, `styleNumber` and every attribute or element
# name are identifiers, not prose, and stay exactly as written.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Script.** The Latin alphabet of Azerbaijan, which is the tradition Tat
# material published in Azerbaijan follows. **Tat in Dagestan is written in
# Cyrillic**, equally currently; the two must never be mixed, and a reviewer
# who prefers Cyrillic should convert all four files of the locale at once.
# `chrome.ftl`'s header states this in full.
#
# **Word order.** Tat is Iranian: a modifier follows its noun, joined by the
# ezafe («raporti əlçatanlığ», *the accessibility report*). `content.ftl`'s
# header sets that out, together with the `-i`/`-yi` debt this seed carries.
#
# **This is the thinnest file of the thinnest locale in its batch.** The
# editor is a developer surface, and Tat — a language with a small written
# corpus, no schooling and no technical register — has a word in use for
# almost none of it. Everything below that names a piece of software is an
# **Azerbaijani loan kept as a loan**: «variant», «filtr», «format»,
# «indeks», «komponent», «atribut», «tip», «massiv», «funksiya», «versiya»,
# «annotasiya», «koordinat», «diaqnostika», «redaktor», «kursor»,
# «əlçatanlığ», «pozuntu», «tövsiyə». They are not translations and are not
# offered as any. The verb forms — Azerbaijani stems carrying the Tat light
# verb «sax»/«soxdən» — are the least certain part of the file.
#
# **Number.** A noun after a numeral is unmarked, so every count message is
# one unselected form; there is no CLDR plural data for `ttt`.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Sıfırlamiş sax
       *[update] Təzələmiş sax
    }
editor-update-viewer-title =
    { $shortcut ->
        [none] Göstərici-rə { $word }
       *[other] Göstərici-rə { $word } { $shortcut }
    }


## The variant picker

editor-variant = Variant
editor-variant-filter = Filtr...
editor-variant-next = Varianti növbəti-rə vəçin
editor-variant-previous = Varianti əvvəlki-rə vəçin


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] Pozuntuyi əlçatanlığ WCAG AA yoft bire. Raporti əlçatanlığ-rə { $action ->
            [close] bastən
           *[open] vokardən
        } üçün klik sax.
        [advisories] Raporti əlçatanlığ-rə { $action ->
            [close] bastən
           *[open] vokardən
        } üçün klik sax. Pozuntuyi WCAG AA yoft nəbü, əmmo tövsiyəhoyi digəri əlçatanlığ hüst.
       *[clean] Raporti əlçatanlığ-rə { $action ->
            [close] bastən
           *[open] vokardən
        } üçün klik sax. Hiç yə məsələyi əlçatanlığ yoft nəbü.
    }
editor-accessibility-label =
    { $status ->
        [violations] Pozuntuyi əlçatanlığ WCAG AA yoft bire. { $count } pozuntuyi WCAG AA yoft bire. Raporti əlçatanlığ-rə { $action ->
            [close] bastən
           *[open] vokardən
        } üçün klik sax.
        [advisories] Pozuntuyi WCAG AA yoft nəbü. { $count } tövsiyəyi digəri əlçatanlığ yoft bire. Raporti əlçatanlığ-rə { $action ->
            [close] bastən
           *[open] vokardən
        } üçün klik sax.
       *[clean] Pozuntuyi WCAG AA yoft nəbü. Raporti əlçatanlığ-rə { $action ->
            [close] bastən
           *[open] vokardən
        } üçün klik sax.
    }
editor-accessibility-badge = WCAG


## The footer

editor-version-title = Versiyayi DoenetML { $version }
editor-tab-help = Kümək bə kontekst
editor-tab-help-short = Kontekst
editor-tab-errors = Xətoho
editor-tab-warnings = Xəbərdorluğho
editor-tab-info = Məlumat
editor-tab-accessibility = Əlçatanlığ
editor-tab-responses = Cavobhoyi fürüstire
editor-tab-with-count = { $label }: { $count }
editor-options = Sazlamahoyi redaktor
editor-format-as-doenetml = Ənə DoenetML formatlamiş sax
editor-format-as-xml = Ənə XML formatlamiş sax


## The diagnostics panel

editor-diagnostic-line = Sətir #{ $line }
editor-no-errors = Xəto nist
editor-no-warnings = Xəbərdorluğ nist
editor-no-info = Diaqnostikayi məlumat nist
editor-show-info-annotations = Diaqnostikayi məlumat-rə ə redaktor nişun de
editor-show-accessibility-annotations = Diaqnostikayi əlçatanlığ-rə ə redaktor nişun de
editor-accessibility-learn-more = Doenet bə əlçatanlığ çü türki minigərə — bixun
editor-accessibility-violations-heading = Pozuntuhoyi əlçatanlığ ({ $standard })
editor-accessibility-other-heading = Məsələhoyi digəri əlçatanlığ
editor-none-found = Hiç çi yoft nəbü


## Submitted responses

editor-no-responses = Hənüz hiç cavob fürüstire nəbü
editor-response-answer-id = İdi cavob
editor-response-response = Cavob
editor-response-credit = Bal
editor-response-submitted = Fürüstire


## The context-help panel

help-placeholder = Bəroyi məlumat kursor-rə ə səri yə nomi teq, atribut yo { $ref } binə.
help-unsupported-ref-chain = Bəroyi referenshoyi çəndparçəyi ənə { $example } kümək hənüz nist.
help-unresolved-ref =
    { $reason ->
        [notFound] Bəroyi in referens hiç hədəf yoft nəbü: { $ref }.
        [multiple] Bəroyi in referens çənd hədəf yoft bire: { $ref }.
       *[indeterminate] Bəroyi { $ref } hədəf təyin nəbü.
    }
help-learn-about-references = Dər boreyi referensho bixun →
help-reference-page = Səhifəyi məlumat →
help-suggestions-header =
    { $location ->
        [inside] Ə dərüni { $element }
       *[top] Ə səviyəyi bolotərin
    }{ $allowed ->
        [none] { " — inco hiç çi nə minişinə." }
        [text] { " — inco mətn binvis." }
        [text-and-components] { " — inco mətn binvis, yo inhora sınamiş sax:" }
       *[components] { " — çihoyi sınamiş soxdəni:" }
    }
help-suggestions-footer = Bəroyi didəni hər { $total } komponent { $shortcut }-rə fişor de.
help-name-summary = { $name } — { $summary }
help-ref-is-reference =
    { $line ->
        [none] { $ref } — referens bə { $target }.
       *[other] { $ref } — referens bə { $target } (sətir { $line }).
    }
help-ref-derived-from =
    { $line ->
        [none] Əz tərəfi { $owner } ənə { $role } vorde bire.
       *[other] Əz tərəfi { $owner } ə sətiri { $line } ənə { $role } vorde bire.
    }
help-property-is-reference =
    { $line ->
        [none] { $ref } — referens bə xüsusiyəti { $property }-i { $element }.
       *[other] { $ref } — referens bə xüsusiyəti { $property }-i { $element } (sətir { $line }).
    }
help-kind-attribute = atribut
help-kind-snippet = snippet
help-kind-array-entry = elementi massiv
help-default = Qiyməti pişfərz:
help-active-default = Qiyməti pişfərzi fəal:
help-style-number-annotation = { " " }(styleNumber { $styleNumber })
help-allowed-values =
    { $perItem ->
        [true] Qiymətho-i icozədorə (bəroyi hər element yəki):
       *[other] Qiymətho-i icozədorə:
    }
help-suggested-values = Qiymətho-i tövsiyəbire:
help-inserts = Minişunə:
help-coordinates = Koordinatho:
help-type = Tip:
help-resolved-style = Stili təyinbire (styleNumber { $styleNumber }):
help-resolved-function-names = Nomhoyi funksiyayi təyinbire:
help-reset-list = Siyohiyi sıfırbire ə in giriş:
help-added-on-input = Ziyodbire ə in giriş:
help-removed-on-input = Pokbire ə in giriş:
help-reset-overrides = { $reset } — { $additional } və { $removed }-rə ləğv misozü.
