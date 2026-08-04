# Javanese editor and language-server surfaces. Translated from
# `locales/en/editor.ftl`, which is the source of truth: `lint:i18n` rejects a
# key that does not exist there, and reports a key that exists there but not
# here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# SPEECH LEVEL. Written in **ngoko**, the plain level, throughout — see the
# header of `chrome.ftl`.
#
# `WCAG AA`, `DoenetML`, `XML`, `styleNumber` and every attribute or element
# name are identifiers, not prose, and stay as written.
#
# Javanese has a single plural category, so a countable message needs no
# selection.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Balèkaké
       *[update] Anyari
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } Panampil
       *[other] { $word } Panampil { $shortcut }
    }


## The variant picker

editor-variant = Variasi
editor-variant-filter = Saring...
editor-variant-next = Pilih variasi sabanjuré
editor-variant-previous = Pilih variasi sadurungé


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] Ketemu pelanggaran aksesibilitas WCAG AA. Klik kanggo { $action ->
            [close] nutup
           *[open] mbukak
        } laporan aksesibilitas.
        [advisories] Klik kanggo { $action ->
            [close] nutup
           *[open] mbukak
        } laporan aksesibilitas. Ora ketemu pelanggaran WCAG AA, nanging ana rékomendasi aksesibilitas tambahan.
       *[clean] Klik kanggo { $action ->
            [close] nutup
           *[open] mbukak
        } laporan aksesibilitas. Ora ketemu masalah aksesibilitas.
    }

editor-accessibility-label =
    { $status ->
        [violations] Ketemu pelanggaran aksesibilitas WCAG AA. Ketemu { $count } pelanggaran WCAG AA. Klik kanggo { $action ->
            [close] nutup
           *[open] mbukak
        } laporan aksesibilitas.
        [advisories] Ora ketemu pelanggaran WCAG AA. Ketemu { $count } rékomendasi aksesibilitas tambahan. Klik kanggo { $action ->
            [close] nutup
           *[open] mbukak
        } laporan aksesibilitas.
       *[clean] Ora ketemu pelanggaran WCAG AA. Klik kanggo { $action ->
            [close] nutup
           *[open] mbukak
        } laporan aksesibilitas.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML vèrsi { $version }

editor-tab-help = Pitulung manut kontèks
editor-tab-help-short = Kontèks
editor-tab-errors = Kaluputan
editor-tab-warnings = Pènget
editor-tab-info = Info
editor-tab-accessibility = Aksesibilitas
editor-tab-responses = Wangsulan sing dikirim

editor-tab-with-count = { $label }: { $count }

editor-options = Pilihan panyunting
editor-format-as-doenetml = Format minangka DoenetML
editor-format-as-xml = Format minangka XML


## The diagnostics panel

editor-diagnostic-line = Larik #{ $line }

editor-no-errors = Ora Ana Kaluputan
editor-no-warnings = Ora Ana Pènget
editor-no-info = Ora Ana Diagnostik Info

editor-show-info-annotations = Tampilaké diagnostik info ing panyunting
editor-show-accessibility-annotations = Tampilaké diagnostik aksesibilitas ing panyunting

editor-accessibility-learn-more = Sinaunana carané Doenet nyawang aksesibilitas

editor-accessibility-violations-heading = Pelanggaran aksesibilitas ({ $standard })

editor-accessibility-other-heading = Masalah aksesibilitas liyané
editor-none-found = Ora ana sing ketemu


## Submitted responses

editor-no-responses = Durung ana wangsulan sing dikirim
editor-response-answer-id = Answer Id
editor-response-response = Wangsulan
editor-response-credit = Biji
editor-response-submitted = Dikirim


## The context-help panel

help-placeholder = Selèhna kursor ing jeneng tag, atribut, utawa { $ref } kanggo ndelok dokuméntasi.

help-unsupported-ref-chain = Pitulung kanggo rujukan pirang-pirang pérangan kaya { $example } durung didhukung.

help-unresolved-ref =
    { $reason ->
        [notFound] Ora ketemu sing dituduh déning rujukan: { $ref }.
        [multiple] Ketemu luwih saka siji sing dituduh déning rujukan: { $ref }.
       *[indeterminate] Sing dituduh déning { $ref } ora bisa ditemtokaké.
    }

help-learn-about-references = Sinaunana bab rujukan →
help-reference-page = Kaca rujukan →

help-suggestions-header =
    { $location ->
        [inside] Ing jero { $element }
       *[top] Ing tataran ndhuwur dhéwé
    }{ $allowed ->
        [none] { " — ora ana sing bisa diselèhaké ing kéné." }
        [text] { " — ketikna teks ing kéné." }
        [text-and-components] { " — ketikna teks ing kéné, utawa jajalen:" }
       *[components] { " — sing bisa dijajal:" }
    }

help-suggestions-footer = Penet { $shortcut } kanggo ndelok kabèh { $total } komponèn.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } iku rujukan menyang { $target }.
       *[other] { $ref } iku rujukan menyang { $target } (larik { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] Diwiwiti déning { $owner } minangka { $role }.
       *[other] Diwiwiti déning { $owner } ing larik { $line } minangka { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } iku rujukan menyang property { $property } saka { $element }.
       *[other] { $ref } iku rujukan menyang property { $property } saka { $element } (larik { $line }).
    }

help-kind-attribute = atribut
help-kind-snippet = potongan
help-kind-array-entry = èntri larik

help-default = Baku:
help-active-default = Baku sing aktif:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Nilai sing kena (siji saben item):
       *[other] Nilai sing kena:
    }

help-suggested-values = Nilai sing disaranaké:

help-inserts = Nyelipaké:

help-coordinates = Koordinat:

help-type = Jinis:

help-resolved-style = Gaya sing ditemtokaké (styleNumber { $styleNumber }):

help-resolved-function-names = Jeneng fungsi sing ditemtokaké:
help-reset-list = Dhaftar reset ing input iki:
help-added-on-input = Ditambahaké ing input iki:
help-removed-on-input = Dibusak saka input iki:

help-reset-overrides = { $reset } ngalahaké { $additional } lan { $removed }.
