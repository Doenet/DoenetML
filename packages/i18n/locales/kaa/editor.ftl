# Karakalpak editor and language-server surfaces. Translated from
# `locales/en/editor.ftl`, which is the source of truth: `lint:i18n` rejects a
# key that does not exist there, and reports a key that exists there but not
# here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Written in the current Karakalpak Latin alphabet, the same one the other
# three files of this locale use; see `locales/kaa/content.ftl` for why that
# script was chosen over the Cyrillic that is still official beside it.
#
# `WCAG AA`, `DoenetML`, `XML`, `styleNumber` and every attribute or element
# name are identifiers, not prose, and stay in English exactly as written.
#
# Karakalpak does not mark number on a noun after a numeral, and
# `Intl.PluralRules` has no data for `kaa` in any case, so every count
# selection here is collapsed to a single `*[other]` rather than carrying two
# branches that would read alike.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Qaytarıw
       *[update] Jańalaw
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] Kórsetkishti { $word }
       *[other] Kórsetkishti { $word } { $shortcut }
    }


## The variant picker

editor-variant = Variant
editor-variant-filter = Súzgilew…
editor-variant-next = Keyingi variantti saylaw
editor-variant-previous = Aldıńǵı variantti saylaw


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] WCAG AA qolaylıq talabınıń buzılıwı tabıldı. Qolaylıq esabatın { $action ->
            [close] jabıw
           *[open] ashıw
        } ushın basıń.
        [advisories] Qolaylıq esabatın { $action ->
            [close] jabıw
           *[open] ashıw
        } ushın basıń. WCAG AA buzılıwları tabılmadı, biraq qosımsha usınıslar bar.
       *[clean] Qolaylıq esabatın { $action ->
            [close] jabıw
           *[open] ashıw
        } ushın basıń. Qolaylıq mashqalaları tabılmadı.
    }

editor-accessibility-label =
    { $status ->
        [violations] WCAG AA qolaylıq talabınıń buzılıwı tabıldı. { $count ->
           *[other] { $count } WCAG AA buzılıwı
        } tabıldı. Qolaylıq esabatın { $action ->
            [close] jabıw
           *[open] ashıw
        } ushın basıń.
        [advisories] WCAG AA buzılıwları tabılmadı. { $count ->
           *[other] { $count } qosımsha qolaylıq usınısı
        } tabıldı. Qolaylıq esabatın { $action ->
            [close] jabıw
           *[open] ashıw
        } ushın basıń.
       *[clean] WCAG AA buzılıwları tabılmadı. Qolaylıq esabatın { $action ->
            [close] jabıw
           *[open] ashıw
        } ushın basıń.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML versiyası { $version }

editor-tab-help = Kontekstke qaray járdem
editor-tab-help-short = Kontekst
editor-tab-errors = Qátelikler
editor-tab-warnings = Eskertiwler
editor-tab-info = Maǵlıwmat
editor-tab-accessibility = Qolaylıq
editor-tab-responses = Jiberilgen juwaplar

editor-tab-with-count = { $label }: { $count }

editor-options = Redaktor sazlawları
editor-format-as-doenetml = DoenetML sıpatında formatlaw
editor-format-as-xml = XML sıpatında formatlaw


## The diagnostics panel

editor-diagnostic-line = { $line }-qatar

editor-no-errors = Qátelik joq
editor-no-warnings = Eskertiw joq
editor-no-info = Maǵlıwmat xabarı joq

editor-show-info-annotations = Maǵlıwmat xabarların redaktorda kórsetiw
editor-show-accessibility-annotations = Qolaylıq xabarların redaktorda kórsetiw

editor-accessibility-learn-more = Doenet qolaylıqqa qalay qaraytuǵının biliń

editor-accessibility-violations-heading = Qolaylıq buzılıwları ({ $standard })

editor-accessibility-other-heading = Basqa qolaylıq mashqalaları
editor-none-found = Hesh nárse tabılmadı


## Submitted responses

editor-no-responses = Ele jiberilgen juwap joq
editor-response-answer-id = Juwaptıń Id-si
editor-response-response = Juwap
editor-response-credit = Ball
editor-response-submitted = Jiberilgen


## The context-help panel

help-placeholder = Hújjetlerdi kóriw ushın kursordı teg atına, atributqa yamasa { $ref } ústine qoyıń.

help-unsupported-ref-chain = { $example } sıyaqlı kóp bólekli siltemeler ushın járdem ele qollap-quwatlanbaydı.

help-unresolved-ref =
    { $reason ->
        [notFound] Siltemege obekt tabılmadı: { $ref }.
        [multiple] Siltemege bir neshe obekt tabıldı: { $ref }.
       *[indeterminate] { $ref } ushın obektti anıqlaw múmkin bolmadı.
    }

help-learn-about-references = Siltemeler haqqında bilip alıń →
help-reference-page = Anıqlama beti →

help-suggestions-header =
    { $location ->
        [inside] { $element } ishinde
       *[top] Joqarǵı dárejede
    }{ $allowed ->
        [none] { " — bul jerge hesh nárse kelmeydi." }
        [text] { " — bul jerge tekst jazıń." }
        [text-and-components] { " — bul jerge tekst jazıń yamasa bulardı sınap kóriń:" }
       *[components] { " — bulardı sınap kóriń:" }
    }

help-suggestions-footer = Barlıq { $total } komponentti kóriw ushın { $shortcut } basıń.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } — { $target } ushın silteme.
       *[other] { $ref } — { $target } ushın silteme ({ $line }-qatar).
    }

help-ref-derived-from =
    { $line ->
        [none] Onı { $owner } { $role } sıpatında kirgizgen.
       *[other] Onı { $owner } { $line }-qatarda { $role } sıpatında kirgizgen.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } — { $element } elementiniń { $property } qásiyetine silteme.
       *[other] { $ref } — { $element } elementiniń { $property } qásiyetine silteme ({ $line }-qatar).
    }

help-kind-attribute = atribut
help-kind-snippet = úzindi
help-kind-array-entry = massiv elementi

help-default = Sáykes mánis:
help-active-default = Ámeldegi sáykes mánis:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Ruqsat etilgen mánisler (hár element ushın bireuden):
       *[other] Ruqsat etilgen mánisler:
    }

help-suggested-values = Usınıs etiletuǵın mánisler:

help-inserts = Qosadı:

help-coordinates =
    { $count ->
       *[other] Koordinatalar:
    }

help-type = Túri:

help-resolved-style = Anıqlanǵan stil (styleNumber { $styleNumber }):

help-resolved-function-names = Anıqlanǵan funkciya atları:
help-reset-list = Bul kirgiziwdegi qaytarıw dizimi:
help-added-on-input = Bul kirgiziwge qosılǵanı:
help-removed-on-input = Bul kirgiziwden alıp taslanǵanı:

help-reset-overrides = { $reset } — { $additional } hám { $removed } ústinen ámel etedi.
