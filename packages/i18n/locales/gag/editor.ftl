# Gagauz (gagauz dili) editor and language-server surfaces. Translated from
# `locales/en/editor.ftl`, which is the source of truth: `lint:i18n` rejects a
# key that does not exist there, and reports a key that exists there but not
# here as missing coverage.
#
# `WCAG AA`, `DoenetML`, `XML`, `styleNumber` and every attribute or element
# name are identifiers, not prose, and stay exactly as written.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Orthography.** The Latin alphabet official in Gagauzia since 1996 — `ș`
# for sh, `ț` for ts, `ä` for the open front vowel, `ê` for the «-êr» present
# tense. Not Turkish `ş`, and not the pre-1993 Cyrillic, which must not be
# mixed into any of these four files. `chrome.ftl` sets the alphabet out in
# full.
#
# **Word order and agreement.** Modifiers precede the noun, as in English.
# Gagauz has no grammatical gender and an attributive adjective takes no
# ending, so nothing here agrees with anything.
#
# **Number.** A noun after a numeral is unmarked, so every count message is
# written as one unselected form; there is no CLDR plural data for `gag` and
# no plural-category branch appears.
#
# **This is the thinnest of the four files.** The editor is a developer
# surface and most of what it names has no Gagauz word in use at all.
# «variant», «filtru», «format», «indeks», «komponent», «atribut», «tip»,
# «snippet», «massiv», «funkțiya», «versiya», «annotațiya», «koordinata» and
# «diagnostika» are the Russian- and Romanian-mediated loans a Gagauz speaker
# working with software would actually use; they are kept, not translated, and
# are not offered as translations. «Erișilebilirlik» for *accessibility* is a
# Turkish calque and is the word a reviewer should look at first.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Sıfırla
       *[update] Enilä
    }
editor-update-viewer-title =
    { $shortcut ->
        [none] Göstericiyi { $word }
       *[other] Göstericiyi { $word } { $shortcut }
    }


## The variant picker

editor-variant = Variant
editor-variant-filter = Filtru...
editor-variant-next = Sonraki variantı seç
editor-variant-previous = Öncäki variantı seç


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] WCAG AA erișilebilirlik bozması bulundu. Erișilebilirlik raportunu { $action ->
            [close] kapamaa
           *[open] açmaa
        } deyni basınız.
        [advisories] Erișilebilirlik raportunu { $action ->
            [close] kapamaa
           *[open] açmaa
        } deyni basınız. WCAG AA bozması bulunmadı, ama başka erișilebilirlik tavsiyeleri var.
       *[clean] Erișilebilirlik raportunu { $action ->
            [close] kapamaa
           *[open] açmaa
        } deyni basınız. Hiç bir erișilebilirlik problemi bulunmadı.
    }
editor-accessibility-label =
    { $status ->
        [violations] WCAG AA erișilebilirlik bozması bulundu. { $count } WCAG AA bozması bulundu. Erișilebilirlik raportunu { $action ->
            [close] kapamaa
           *[open] açmaa
        } deyni basınız.
        [advisories] WCAG AA bozması bulunmadı. { $count } eklemä erișilebilirlik tavsiyesi bulundu. Erișilebilirlik raportunu { $action ->
            [close] kapamaa
           *[open] açmaa
        } deyni basınız.
       *[clean] WCAG AA bozması bulunmadı. Erișilebilirlik raportunu { $action ->
            [close] kapamaa
           *[open] açmaa
        } deyni basınız.
    }
editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML versiyası { $version }
editor-tab-help = Kontekstä görä yardım
editor-tab-help-short = Kontekst
editor-tab-errors = Hatalar
editor-tab-warnings = Uyarmalar
editor-tab-info = Bilgi
editor-tab-accessibility = Erișilebilirlik
editor-tab-responses = Yollanan cuvaplar
editor-tab-with-count = { $label }: { $count }
editor-options = Redaktor ayarları
editor-format-as-doenetml = DoenetML gibi formatla
editor-format-as-xml = XML gibi formatla


## The diagnostics panel

editor-diagnostic-line = { $line }. satır
editor-no-errors = Hata yok
editor-no-warnings = Uyarma yok
editor-no-info = Bilgi diagnostikası yok
editor-show-info-annotations = Bilgi diagnostikasını redaktorda göster
editor-show-accessibility-annotations = Erișilebilirlik diagnostikasını redaktorda göster
editor-accessibility-learn-more = Doenet erișilebilirliğä nicä bakêr — okuyunuz
editor-accessibility-violations-heading = Erișilebilirlik bozmaları ({ $standard })
editor-accessibility-other-heading = Başka erișilebilirlik problemleri
editor-none-found = Hiç bir șey bulunmadı


## Submitted responses

editor-no-responses = Taa hiç bir cuvap yollanmadı
editor-response-answer-id = Cuvap identifikatoru
editor-response-response = Cuvap
editor-response-credit = Ball
editor-response-submitted = Yollandı


## The context-help panel

help-placeholder = Bilgi almaa deyni kursoru bir teg adının, atributun ya da { $ref } üstünä koyunuz.
help-unsupported-ref-chain = { $example } gibi birkaç paydan kurulu referenslar için yardım taa yok.
help-unresolved-ref =
    { $reason ->
        [notFound] Bu referens için hiç bir hedef bulunmadı: { $ref }.
        [multiple] Bu referens için birkaç hedef bulundu: { $ref }.
       *[indeterminate] { $ref } için hedef belli edilämedi.
    }
help-learn-about-references = Referenslar için okuyunuz →
help-reference-page = Bilgi sayfası →
help-suggestions-header =
    { $location ->
        [inside] { $element } içindä
       *[top] En üst uurda
    }{ $allowed ->
        [none] { " — burada hiç bir șey durmêêr." }
        [text] { " — burada tekst yazınız." }
        [text-and-components] { " — burada tekst yazınız ya da șunnarı deneyiniz:" }
       *[components] { " — deneyip bakmaa deyni:" }
    }
help-suggestions-footer = Hepsi { $total } komponenti görmää deyni { $shortcut } basınız.
help-name-summary = { $name } — { $summary }
help-ref-is-reference =
    { $line ->
        [none] { $ref } — { $target } üstünä referens.
       *[other] { $ref } — { $target } üstünä referens ({ $line }. satır).
    }
help-ref-derived-from =
    { $line ->
        [none] { $owner } tarafından { $role } gibi getirildi.
       *[other] { $owner } tarafından { $line }. satırda { $role } gibi getirildi.
    }
help-property-is-reference =
    { $line ->
        [none] { $ref } — { $element } elementinin { $property } özelliinä referens.
       *[other] { $ref } — { $element } elementinin { $property } özelliinä referens ({ $line }. satır).
    }
help-kind-attribute = atribut
help-kind-snippet = snippet
help-kind-array-entry = massiv elementi
help-default = Ön görülü paa:
help-active-default = İșleyän ön görülü paa:
help-style-number-annotation = { " " }(styleNumber { $styleNumber })
help-allowed-values =
    { $perItem ->
        [true] İzin verilän paalar (her element için biri):
       *[other] İzin verilän paalar:
    }
help-suggested-values = Tavsiye edilän paalar:
help-inserts = Koyêr:
help-coordinates = Koordinatalar:
help-type = Tip:
help-resolved-style = Belli edilmiș stil (styleNumber { $styleNumber }):
help-resolved-function-names = Belli edilmiș funkțiya adları:
help-reset-list = Bu girișttä sıfırlanan spisok:
help-added-on-input = Bu girișttä katılan:
help-removed-on-input = Bu girișttä silinän:
help-reset-overrides = { $reset } — { $additional } hem { $removed } paalarını bastırêr.
