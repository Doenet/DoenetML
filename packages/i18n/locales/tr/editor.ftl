# Turkish editor and language-server surfaces. Translated from
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
# A noun counted by a numeral stays singular in Turkish, so a `{ $count }`
# message reads the same in both plural branches and needs no selection.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Sıfırla
       *[update] Güncelle
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] Görüntüleyiciyi { $word }
       *[other] Görüntüleyiciyi { $word } { $shortcut }
    }


## The variant picker

editor-variant = Varyant
editor-variant-filter = Süz...
editor-variant-next = Sonraki varyantı seç
editor-variant-previous = Önceki varyantı seç


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] WCAG AA erişilebilirlik ihlali saptandı. Erişilebilirlik raporunu { $action ->
            [close] kapatmak
           *[open] açmak
        } için tıklayın.
        [advisories] Erişilebilirlik raporunu { $action ->
            [close] kapatmak
           *[open] açmak
        } için tıklayın. WCAG AA ihlali bulunmadı, ancak başka erişilebilirlik önerileri var.
       *[clean] Erişilebilirlik raporunu { $action ->
            [close] kapatmak
           *[open] açmak
        } için tıklayın. Erişilebilirlik sorunu bulunmadı.
    }

editor-accessibility-label =
    { $status ->
        [violations] WCAG AA erişilebilirlik ihlali saptandı. { $count } WCAG AA ihlali bulundu. Erişilebilirlik raporunu { $action ->
            [close] kapatmak
           *[open] açmak
        } için tıklayın.
        [advisories] WCAG AA ihlali saptanmadı. { $count } ek erişilebilirlik önerisi bulundu. Erişilebilirlik raporunu { $action ->
            [close] kapatmak
           *[open] açmak
        } için tıklayın.
       *[clean] WCAG AA ihlali saptanmadı. Erişilebilirlik raporunu { $action ->
            [close] kapatmak
           *[open] açmak
        } için tıklayın.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML sürüm { $version }

editor-tab-help = Bağlama duyarlı yardım
editor-tab-help-short = Bağlam
editor-tab-errors = Hatalar
editor-tab-warnings = Uyarılar
editor-tab-info = Bilgi
editor-tab-accessibility = Erişilebilirlik
editor-tab-responses = Gönderilen yanıtlar

editor-tab-with-count = { $label }: { $count }

editor-options = Düzenleyici seçenekleri
editor-format-as-doenetml = DoenetML olarak biçimlendir
editor-format-as-xml = XML olarak biçimlendir


## The diagnostics panel

editor-diagnostic-line = { $line }. satır

editor-no-errors = Hata yok
editor-no-warnings = Uyarı yok
editor-no-info = Bilgi tanılaması yok

editor-show-info-annotations = Bilgi tanılamalarını düzenleyicide göster
editor-show-accessibility-annotations = Erişilebilirlik tanılamalarını düzenleyicide göster

editor-accessibility-learn-more = Doenet'in erişilebilirliğe yaklaşımını öğrenin

editor-accessibility-violations-heading = Erişilebilirlik ihlalleri ({ $standard })

editor-accessibility-other-heading = Diğer erişilebilirlik sorunları
editor-none-found = Bulunamadı


## Submitted responses

editor-no-responses = Henüz gönderilmiş yanıt yok
editor-response-answer-id = Answer Id
editor-response-response = Yanıt
editor-response-credit = Puan
editor-response-submitted = Gönderildi


## The context-help panel

help-placeholder = Belgeleri görmek için imleci bir etiket adının, bir özniteliğin veya { $ref } üzerine getirin.

help-unsupported-ref-chain = { $example } gibi çok parçalı başvurular için yardım henüz desteklenmiyor.

help-unresolved-ref =
    { $reason ->
        [notFound] Başvuru için gönderge bulunamadı: { $ref }.
        [multiple] Başvuru için birden çok gönderge bulundu: { $ref }.
       *[indeterminate] { $ref } için bir gönderge belirlenemedi.
    }

help-learn-about-references = Başvurular hakkında bilgi edinin →
help-reference-page = Başvuru sayfası →

help-suggestions-header =
    { $location ->
        [inside] { $element } içinde
       *[top] En üst düzeyde
    }{ $allowed ->
        [none] { " — buraya hiçbir şey konulamaz." }
        [text] { " — buraya metin yazabilirsiniz." }
        [text-and-components] { " — buraya metin yazabilir ya da şunları deneyebilirsiniz:" }
       *[components] { " — denenebilecekler:" }
    }

help-suggestions-footer = { $total } bileşenin tümünü görmek için { $shortcut } tuşuna basın.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref }, { $target } ögesine bir başvurudur.
       *[other] { $ref }, { $target } ögesine bir başvurudur ({ $line }. satır).
    }

help-ref-derived-from =
    { $line ->
        [none] { $owner } tarafından { $role } olarak eklendi.
       *[other] { $owner } tarafından { $line }. satırda { $role } olarak eklendi.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref }, { $element } ögesinin { $property } özelliğine bir başvurudur.
       *[other] { $ref }, { $element } ögesinin { $property } özelliğine bir başvurudur ({ $line }. satır).
    }

help-kind-attribute = öznitelik
help-kind-snippet = kod parçacığı
help-kind-array-entry = dizi ögesi

help-default = Varsayılan:
help-active-default = Geçerli varsayılan:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] İzin verilen değerler (öge başına bir tane):
       *[other] İzin verilen değerler:
    }

help-suggested-values = Önerilen değerler:

help-inserts = Eklenen:

help-coordinates = Koordinatlar:

help-type = Tür:

help-resolved-style = Çözümlenmiş stil (styleNumber { $styleNumber }):

help-resolved-function-names = Çözümlenmiş fonksiyon adları:
help-reset-list = Bu girdinin sıfırlama listesi:
help-added-on-input = Bu girdide eklenen:
help-removed-on-input = Bu girdide kaldırılan:

help-reset-overrides = { $reset }, { $additional } ve { $removed } ögelerine göre önceliklidir.
