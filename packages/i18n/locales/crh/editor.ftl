# Crimean Tatar (qırımtatar tili) editor and language-server surfaces.
# Translated from `locales/en/editor.ftl`, which is the source of truth:
# `lint:i18n` rejects a key that does not exist there, and reports a key that
# exists there but not here as missing coverage.
#
# `WCAG AA`, `DoenetML`, `XML`, `styleNumber` and every attribute or element
# name are identifiers, not prose, and stay exactly as written.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Script.** The Latin alphabet standardized for Crimean Tatar in Ukraine in
# 2021 — `q`, `ñ`, the `i`/`ı` pair, `ğ ş ç ö ü`. The Cyrillic orthography is
# equally current in Crimea and a reviewer may prefer it, but the two must not
# be mixed: convert all four files of the locale together. `chrome.ftl`'s
# header sets this out in full.
#
# **Word order and agreement.** Modifiers precede the noun, as in English;
# nothing agrees with anything, since Crimean Tatar has no grammatical gender
# and an attributive adjective takes no ending.
#
# **Number.** A noun after a numeral is unmarked, so every count message here
# is written as one unselected form. No plural-category branch appears: there
# is no CLDR plural data for `crh`, and a `[few]` or `[many]` branch could
# never be selected.
#
# **This is the thinnest of the four files in terms of settled vocabulary.**
# The editor is a developer surface, and much of what it names has no Crimean
# Tatar word in use at all. «variant», «filtr», «format», «indeks»,
# «komponent», «atribut», «tip», «snippet», «massiv», «funktsiya», «versiya»,
# «annotatsiya» and «koordinata» are kept as the loans a Crimean Tatar speaker
# working with software actually uses, mostly by way of Russian; they are not
# translations and are not offered as any. «irişimlik» for *accessibility* and
# «keri bildirim» for *feedback* are calques on the Turkish words and are the
# two a reviewer should look at first.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Sıfırla
       *[update] Yañart
    }
editor-update-viewer-title =
    { $shortcut ->
        [none] Köstericini { $word }
       *[other] Köstericini { $word } { $shortcut }
    }


## The variant picker

editor-variant = Variant
editor-variant-filter = Filtr...
editor-variant-next = Soñraki variantnı sayla
editor-variant-previous = Evelki variantnı sayla


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] WCAG AA irişimlik ihlali tapıldı. İrişimlik raporını { $action ->
            [close] qapatmaq
           *[open] açmaq
        } içün basıñız.
        [advisories] İrişimlik raporını { $action ->
            [close] qapatmaq
           *[open] açmaq
        } içün basıñız. WCAG AA ihlali tapılmadı, amma başqa irişimlik tevsiyeleri bar.
       *[clean] İrişimlik raporını { $action ->
            [close] qapatmaq
           *[open] açmaq
        } içün basıñız. İç bir irişimlik meselesi tapılmadı.
    }
editor-accessibility-label =
    { $status ->
        [violations] WCAG AA irişimlik ihlali tapıldı. { $count } WCAG AA ihlali tapıldı. İrişimlik raporını { $action ->
            [close] qapatmaq
           *[open] açmaq
        } içün basıñız.
        [advisories] WCAG AA ihlali tapılmadı. { $count } qoşma irişimlik tevsiyesi tapıldı. İrişimlik raporını { $action ->
            [close] qapatmaq
           *[open] açmaq
        } içün basıñız.
       *[clean] WCAG AA ihlali tapılmadı. İrişimlik raporını { $action ->
            [close] qapatmaq
           *[open] açmaq
        } içün basıñız.
    }
editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML versiyası { $version }
editor-tab-help = Kontekstke köre yardım
editor-tab-help-short = Kontekst
editor-tab-errors = Hatalar
editor-tab-warnings = İhtarlar
editor-tab-info = Malümat
editor-tab-accessibility = İrişimlik
editor-tab-responses = Yiberilgen cevaplar
editor-tab-with-count = { $label }: { $count }
editor-options = Muarrir sazlamaları
editor-format-as-doenetml = DoenetML olaraq formatla
editor-format-as-xml = XML olaraq formatla


## The diagnostics panel

editor-diagnostic-line = { $line }. satır
editor-no-errors = Hata yoq
editor-no-warnings = İhtar yoq
editor-no-info = Malümat diagnostikası yoq
editor-show-info-annotations = Malümat diagnostikasını muarrirde köster
editor-show-accessibility-annotations = İrişimlik diagnostikasını muarrirde köster
editor-accessibility-learn-more = Doenet irişimlikke nasıl yanaşa — oquñız
editor-accessibility-violations-heading = İrişimlik ihlalleri ({ $standard })
editor-accessibility-other-heading = Diger irişimlik meseleleri
editor-none-found = İç bir şey tapılmadı


## Submitted responses

editor-no-responses = Ale iç bir cevap yiberilmedi
editor-response-answer-id = Cevap kimligi
editor-response-response = Cevap
editor-response-credit = Ball
editor-response-submitted = Yiberilgen


## The context-help panel

help-placeholder = Malümat içün kursornı bir teg adına, atributqa yaki { $ref } üzerine qoyuñız.
help-unsupported-ref-chain = { $example } kibi bir qaç parçadan ibaret referenslar içün yardım ale bar degil.
help-unresolved-ref =
    { $reason ->
        [notFound] Bu referens içün gönderme tapılmadı: { $ref }.
        [multiple] Bu referens içün bir qaç gönderme tapıldı: { $ref }.
       *[indeterminate] { $ref } içün gönderme belgilenamadı.
    }
help-learn-about-references = Referenslar aqqında oquñız →
help-reference-page = Malümat sahifesi →
help-suggestions-header =
    { $location ->
        [inside] { $element } içinde
       *[top] Eñ üst seviyede
    }{ $allowed ->
        [none] { " — mında iç bir şey qoyulmay." }
        [text] { " — mında metin yazıñız." }
        [text-and-components] { " — mında metin yazıñız yaki şunlarnı deñeñiz:" }
       *[components] { " — deñep baqmalı şeyler:" }
    }
help-suggestions-footer = Episi { $total } komponentni körmek içün { $shortcut } basıñız.
help-name-summary = { $name } — { $summary }
help-ref-is-reference =
    { $line ->
        [none] { $ref } — { $target } üzerine referens.
       *[other] { $ref } — { $target } üzerine referens ({ $line }. satır).
    }
help-ref-derived-from =
    { $line ->
        [none] { $owner } tarafından { $role } olaraq kirsetildi.
       *[other] { $owner } tarafından { $line }. satırda { $role } olaraq kirsetildi.
    }
help-property-is-reference =
    { $line ->
        [none] { $ref } — { $element } elementiniñ { $property } hasiyetine referens.
       *[other] { $ref } — { $element } elementiniñ { $property } hasiyetine referens ({ $line }. satır).
    }
help-kind-attribute = atribut
help-kind-snippet = snippet
help-kind-array-entry = massiv elementi
help-default = Ög belgilengen qıymet:
help-active-default = Faal ög belgilengen qıymet:
help-style-number-annotation = { " " }(styleNumber { $styleNumber })
help-allowed-values =
    { $perItem ->
        [true] Caiz qıymetler (er element içün biri):
       *[other] Caiz qıymetler:
    }
help-suggested-values = Tevsiye etilgen qıymetler:
help-inserts = Kirsete:
help-coordinates = Koordinatalar:
help-type = Tip:
help-resolved-style = Belgilengen stil (styleNumber { $styleNumber }):
help-resolved-function-names = Belgilengen funktsiya adları:
help-reset-list = Bu kirsetmede sıfırlanğan cetvel:
help-added-on-input = Bu kirsetmede qoşulğan:
help-removed-on-input = Bu kirsetmede çıqarılğan:
help-reset-overrides = { $reset } — { $additional } ve { $removed } qıymetlerini bastıra.
