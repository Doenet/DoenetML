# Azerbaijani editor and language-server surfaces. Translated from
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
# Azerbaijani counts in the same two categories English does, so every selection
# below keeps both branches — though a noun after a numeral stays singular, so
# the two read alike.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Sıfırla
       *[update] Yenilə
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] Göstəricini { $word }
       *[other] Göstəricini { $word } { $shortcut }
    }


## The variant picker

editor-variant = Variant
editor-variant-filter = Süz…
editor-variant-next = Növbəti variantı seç
editor-variant-previous = Əvvəlki variantı seç


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] WCAG AA əlçatanlıq pozuntusu aşkarlandı. Əlçatanlıq hesabatını { $action ->
            [close] bağlamaq
           *[open] açmaq
        } üçün klikləyin.
        [advisories] Əlçatanlıq hesabatını { $action ->
            [close] bağlamaq
           *[open] açmaq
        } üçün klikləyin. WCAG AA pozuntusu tapılmadı, lakin əlavə əlçatanlıq tövsiyələri var.
       *[clean] Əlçatanlıq hesabatını { $action ->
            [close] bağlamaq
           *[open] açmaq
        } üçün klikləyin. Əlçatanlıq problemi tapılmadı.
    }

editor-accessibility-label =
    { $status ->
        [violations] WCAG AA əlçatanlıq pozuntusu aşkarlandı. { $count ->
            [one] { $count } WCAG AA pozuntusu
           *[other] { $count } WCAG AA pozuntusu
        } tapıldı. Əlçatanlıq hesabatını { $action ->
            [close] bağlamaq
           *[open] açmaq
        } üçün klikləyin.
        [advisories] WCAG AA pozuntusu aşkarlanmadı. { $count ->
            [one] { $count } əlavə əlçatanlıq tövsiyəsi
           *[other] { $count } əlavə əlçatanlıq tövsiyəsi
        } tapıldı. Əlçatanlıq hesabatını { $action ->
            [close] bağlamaq
           *[open] açmaq
        } üçün klikləyin.
       *[clean] WCAG AA pozuntusu aşkarlanmadı. Əlçatanlıq hesabatını { $action ->
            [close] bağlamaq
           *[open] açmaq
        } üçün klikləyin.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML versiyası { $version }

editor-tab-help = Kontekstə uyğun kömək
editor-tab-help-short = Kontekst
editor-tab-errors = Xətalar
editor-tab-warnings = Xəbərdarlıqlar
editor-tab-info = Məlumat
editor-tab-accessibility = Əlçatanlıq
editor-tab-responses = Göndərilmiş cavablar

editor-tab-with-count = { $label }: { $count }

editor-options = Redaktor tənzimləmələri
editor-format-as-doenetml = DoenetML kimi formatla
editor-format-as-xml = XML kimi formatla


## The diagnostics panel

editor-diagnostic-line = Sətir #{ $line }

editor-no-errors = Xəta yoxdur
editor-no-warnings = Xəbərdarlıq yoxdur
editor-no-info = Məlumat bildirişi yoxdur

editor-show-info-annotations = Məlumat bildirişlərini redaktorda göstər
editor-show-accessibility-annotations = Əlçatanlıq bildirişlərini redaktorda göstər

editor-accessibility-learn-more = Doenet əlçatanlığa necə yanaşır

editor-accessibility-violations-heading = Əlçatanlıq pozuntuları ({ $standard })

editor-accessibility-other-heading = Digər əlçatanlıq problemləri
editor-none-found = Heç nə tapılmadı


## Submitted responses

editor-no-responses = Hələ göndərilmiş cavab yoxdur
editor-response-answer-id = Cavabın Id-si
editor-response-response = Cavab
editor-response-credit = Bal
editor-response-submitted = Göndərilib


## The context-help panel

help-placeholder = Sənədləşmə üçün kursoru teq adının, atributun və ya { $ref } üzərinə qoyun.

help-unsupported-ref-chain = { $example } kimi çoxhissəli istinadlar üçün kömək hələ dəstəklənmir.

help-unresolved-ref =
    { $reason ->
        [notFound] İstinad üçün obyekt tapılmadı: { $ref }.
        [multiple] İstinad üçün bir neçə obyekt tapıldı: { $ref }.
       *[indeterminate] { $ref } üçün obyekt müəyyən edilə bilmədi.
    }

help-learn-about-references = İstinadlar haqqında öyrənin →
help-reference-page = Sorğu səhifəsi →

help-suggestions-header =
    { $location ->
        [inside] { $element } daxilində
       *[top] Yuxarı səviyyədə
    }{ $allowed ->
        [none] { " — buraya heç nə yazıla bilməz." }
        [text] { " — buraya mətn yaza bilərsiniz." }
        [text-and-components] { " — buraya mətn yaza bilərsiniz və ya sınayın:" }
       *[components] { " — sınaya bilərsiniz:" }
    }

help-suggestions-footer = Bütün { $total } komponenti görmək üçün { $shortcut } basın.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } — { $target } üçün istinaddır.
       *[other] { $ref } — { $target } üçün istinaddır ({ $line } sətri).
    }

help-ref-derived-from =
    { $line ->
        [none] { $owner } tərəfindən { $role } kimi daxil edilib.
       *[other] { $owner } tərəfindən { $line } sətrində { $role } kimi daxil edilib.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } — { $element } elementinin { $property } xassəsinə istinaddır.
       *[other] { $ref } — { $element } elementinin { $property } xassəsinə istinaddır ({ $line } sətri).
    }

help-kind-attribute = atribut
help-kind-snippet = parça
help-kind-array-entry = massiv elementi

help-default = Susmaya görə dəyər:
help-active-default = Qüvvədə olan susmaya görə dəyər:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] İcazə verilən dəyərlər (hər element üçün bir):
       *[other] İcazə verilən dəyərlər:
    }

help-suggested-values = Tövsiyə olunan dəyərlər:

help-inserts = Əlavə edir:

help-coordinates =
    { $count ->
        [one] Koordinat:
       *[other] Koordinatlar:
    }

help-type = Tip:

help-resolved-style = Alınan üslub (styleNumber { $styleNumber }):

help-resolved-function-names = Alınan funksiya adları:
help-reset-list = Bu sahənin sıfırlama siyahısı:
help-added-on-input = Bu sahədə əlavə olunanlar:
help-removed-on-input = Bu sahədən silinənlər:

help-reset-overrides = { $reset } — { $additional } və { $removed } üzərində üstünlük təşkil edir.
