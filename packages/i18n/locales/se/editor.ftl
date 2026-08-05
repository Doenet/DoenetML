# Northern Sami editor and language-server surfaces. Translated from
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
# Sami counts in three categories, `one`, `two` and `other`, but a select is
# written out only where the three actually differ. `help-coordinates` never
# prints its count — it decides a heading's singular against its plural — so it
# has the two forms Sami offers there and no dual branch, which would be a
# variant nothing could tell apart.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Máhcat
       *[update] Ođasmahte
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } čájeheaddji
       *[other] { $word } čájeheaddji { $shortcut }
    }


## The variant picker

editor-variant = Variánta
editor-variant-filter = Sillen…
editor-variant-next = Vállje boahtte variántta
editor-variant-previous = Vállje ovddit variántta


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] WCAG AA olahanvuođa rihkkun lea gávdnon. Coahkkal { $action ->
            [close] gokčat
           *[open] rahpat
        } olahanvuođa raportta.
        [advisories] Coahkkal { $action ->
            [close] gokčat
           *[open] rahpat
        } olahanvuođa raportta. WCAG AA rihkkumat eai gávdnon, muhto leat lasi olahanvuođa ávžžuhusat.
       *[clean] Coahkkal { $action ->
            [close] gokčat
           *[open] rahpat
        } olahanvuođa raportta. Olahanvuođa váttisvuođat eai gávdnon.
    }

editor-accessibility-label =
    { $status ->
        [violations] WCAG AA olahanvuođa rihkkun lea gávdnon. Gávdnon { $count ->
            [one] { $count } WCAG AA rihkkun
            [two] { $count } WCAG AA rihkkuma
           *[other] { $count } WCAG AA rihkkuma
        }. Coahkkal { $action ->
            [close] gokčat
           *[open] rahpat
        } olahanvuođa raportta.
        [advisories] WCAG AA rihkkumat eai gávdnon. Gávdnon { $count ->
            [one] { $count } lasi olahanvuođa ávžžuhus
            [two] { $count } lasi olahanvuođa ávžžuhusa
           *[other] { $count } lasi olahanvuođa ávžžuhusa
        }. Coahkkal { $action ->
            [close] gokčat
           *[open] rahpat
        } olahanvuođa raportta.
       *[clean] WCAG AA rihkkumat eai gávdnon. Coahkkal { $action ->
            [close] gokčat
           *[open] rahpat
        } olahanvuođa raportta.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML veršuvdna { $version }

editor-tab-help = Oktavuođa mielde veahkki
editor-tab-help-short = Oktavuohta
editor-tab-errors = Meattáhusat
editor-tab-warnings = Váruhusat
editor-tab-info = Dieđut
editor-tab-accessibility = Olahanvuohta
editor-tab-responses = Sáddejuvvon vástádusat

editor-tab-with-count = { $label }: { $count }

editor-options = Čállinreaidduid heivehusat
editor-format-as-doenetml = Hábme DoenetML:n
editor-format-as-xml = Hábme XML:n


## The diagnostics panel

editor-diagnostic-line = Linnjá nr. { $line }

editor-no-errors = Eai leat meattáhusat
editor-no-warnings = Eai leat váruhusat
editor-no-info = Eai leat diehtodieđáhusat

editor-show-info-annotations = Čájet diehtodieđáhusaid čállinreaidduin
editor-show-accessibility-annotations = Čájet olahanvuođa dieđáhusaid čállinreaidduin

editor-accessibility-learn-more = Mo Doenet bargá olahanvuođain

editor-accessibility-violations-heading = Olahanvuođa rihkkumat ({ $standard })

editor-accessibility-other-heading = Eará olahanvuođa váttisvuođat
editor-none-found = Ii gávdnon mihkkiige


## Submitted responses

editor-no-responses = Eai leat vel sáddejuvvon vástádusat
editor-response-answer-id = Vástádusa Id
editor-response-response = Vástádus
editor-response-credit = Čuoggát
editor-response-submitted = Sáddejuvvon


## The context-help panel

help-placeholder = Bija čállinmearkka gilkora nammii, attribuhttii dahje dása: { $ref } jos háliidat dokumentašuvnna.

help-unsupported-ref-chain = Veahkki máŋggaoasat čujuhusaide nugo { $example } ii leat vel doarjjejuvvon.

help-unresolved-ref =
    { $reason ->
        [notFound] Ii gávdnon čujuhusa oaivvildeaddji: { $ref }.
        [multiple] Gávdnojedje máŋga čujuhusa oaivvildeaddji: { $ref }.
       *[indeterminate] { $ref } oaivvildeaddji ii sáhttán mearriduvvot.
    }

help-learn-about-references = Oahpa čujuhusaid birra →
help-reference-page = Gihppagiid siidu →

help-suggestions-header =
    { $location ->
        [inside] { $element } siste
       *[top] Bajimuš dásis
    }{ $allowed ->
        [none] { " — dása ii boađe mihkkiige." }
        [text] { " — čále teavstta deike." }
        [text-and-components] { " — čále teavstta deike, dahje geahččal:" }
       *[components] { " — geahččal:" }
    }

help-suggestions-footer = Deatte { $shortcut } jos háliidat oaidnit buot { $total } komponeantta.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } čujuha dása: { $target }.
       *[other] { $ref } čujuha dása: { $target } (linnjá { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] { $owner } lea dan buktán rollain { $role }.
       *[other] { $owner } lea dan buktán linnjás { $line } rollain { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } čujuha { $element } iešvuhtii { $property }.
       *[other] { $ref } čujuha { $element } iešvuhtii { $property } (linnjá { $line }).
    }

help-kind-attribute = attribuhtta
help-kind-snippet = teakstabihttá
help-kind-array-entry = listtu lahttu

help-default = Standárda:
help-active-default = Doaibmi standárda:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Lobálaš árvvut (okta juohke lahtu nammii):
       *[other] Lobálaš árvvut:
    }

help-suggested-values = Evttohuvvon árvvut:

help-inserts = Bidjá sisa:

help-coordinates =
    { $count ->
        [one] Koordináhta:
       *[other] Koordináhtat:
    }

help-type = Šládja:

help-resolved-style = Mearriduvvon stiila (styleNumber { $styleNumber }):

help-resolved-function-names = Mearriduvvon funkšuvdnanamat:
help-reset-list = Máhcahanlistu dán gieldda várás:
help-added-on-input = Lasihuvvon dán gildii:
help-removed-on-input = Váldojuvvon eret dán gielddas:

help-reset-overrides = { $reset } badjelgeahččá { $additional } ja { $removed }.
