# Efik editor and language-server surfaces: the footer, the diagnostics
# panel, the variant picker, the accessibility button, and the context-help
# panel beside them. Selected by `uiLocale`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
#
# `WCAG`, `WCAG AA`, `DoenetML`, `XML` and `styleNumber` are names rather than
# words and stay as they stand, as do `through`, `endpoint`, `midpointOffset`
# and every other DoenetML identifier. See `content.ftl`'s header for the
# family, orthography and agreement notes that apply to this catalog too.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Fiak Nnam
       *[update] Kpọn̄ Idem
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } N̄wed Ndise
       *[other] { $word } N̄wed Ndise { $shortcut }
    }


## The variant picker

editor-variant = Orụk

editor-variant-filter = Kụt...

editor-variant-next = Mek orụk n̄kaha
editor-variant-previous = Mek orụk mbemiso


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] Ẹkụt ndudue WCAG AA ntak ekemede ndinọ kpukpru owo. Mia man { $action ->
            [close] ọfịk
           *[open] ọberede
        } n̄wed ibat esịt emi.
        [advisories] Mia man { $action ->
            [close] ọfịk
           *[open] ọberede
        } n̄wed ibat esịt emi. Idụhe ndudue WCAG AA, edi mme ntọt en̄wan̄a efen ẹdụhe.
       *[clean] Mia man { $action ->
            [close] ọfịk
           *[open] ọberede
        } n̄wed ibat esịt emi. Idụhe ndudue ekemede ndinọ kpukpru owo.
    }

editor-accessibility-label =
    { $status ->
        [violations] Ẹkụt ndudue WCAG AA ntak ekemede ndinọ kpukpru owo. { $count ->
            [one] Ndudue WCAG AA { $count } odụhe
           *[other] Mme ndudue WCAG AA { $count } ẹdụhe
        }. Mia man { $action ->
            [close] ọfịk
           *[open] ọberede
        } n̄wed ibat esịt emi.
        [advisories] Idụhe ndudue WCAG AA. { $count ->
            [one] Ntọt en̄wan̄a { $count } odụhe
           *[other] Ntọt en̄wan̄a { $count } ẹdụhe
        }. Mia man { $action ->
            [close] ọfịk
           *[open] ọberede
        } n̄wed ibat esịt emi.
       *[clean] Idụhe ndudue WCAG AA. Mia man { $action ->
            [close] ọfịk
           *[open] ọberede
        } n̄wed ibat esịt emi.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML orụk { $version }

editor-tab-help = Ibat esịt oro ekemde ye ebiet
editor-tab-help-short = Ibat
editor-tab-errors = Mme Ndudue
editor-tab-warnings = Mme Utọt
editor-tab-info = Ntọn̄ọ
editor-tab-accessibility = Ntak Ekemede Ndinọ Kpukpru Owo
editor-tab-responses = Mme Ibọrọ Ẹkenọde

editor-tab-with-count = { $label }: { $count }

editor-options = Mme Usụn̄ Editọ
editor-format-as-doenetml = Nam Orụk DoenetML
editor-format-as-xml = Nam Orụk XML


## The diagnostics panel

editor-diagnostic-line = Lain #{ $line }

editor-no-errors = Idụhe Ndudue
editor-no-warnings = Idụhe Utọt
editor-no-info = Idụhe Ntọn̄ọ

editor-show-info-annotations = Wụt ntọn̄ọ ke n̄wed ndise
editor-show-accessibility-annotations = Wụt ntak ekemede ndinọ kpukpru owo ke n̄wed ndise

editor-accessibility-learn-more = Kpep nte Doenet esede ntak ekemede ndinọ kpukpru owo

editor-accessibility-violations-heading = Mme Ndudue Ntak Ekemede Ndinọ Kpukpru Owo ({ $standard })

editor-accessibility-other-heading = Ekese Mme N̄kpọ Ntak Ekemede Ndinọ Kpukpru Owo
editor-none-found = Ikụtke baba n̄kpọ kiet


## Submitted responses

editor-no-responses = Idụhe ibọrọ ekenọde
editor-response-answer-id = Enyịn̄ Ibọrọ
editor-response-response = Ibọrọ
editor-response-credit = Ntak
editor-response-submitted = Ẹkenọ


## The context-help panel

help-placeholder = Da mma ke enyịn̄ tag, attribute, m̀mê { $ref } man ọkụt ibat esịt.

help-unsupported-ref-chain = Ibat esịt ọnọ mme reference oro ẹdide ke ediwak ubak nte { $example } isịnke idem.

help-unresolved-ref =
    { $reason ->
        [notFound] Ikụtke n̄kpọ oro reference emi ọdọhọde: { $ref }.
        [multiple] Ẹkụt ediwak n̄kpọ oro reference emi ọdọhọde: { $ref }.
       *[indeterminate] Ikemke ndinyene se { $ref } ọdọhọde.
    }

help-learn-about-references = Kpep mban̄a mme reference →
help-reference-page = Page Ibat →

help-suggestions-header =
    { $location ->
        [inside] Ke esịt { $element }
       *[top] Ke enyọn̄ n̄wed
    }{ $allowed ->
        [none] { " — n̄kpọ kiet idụhe emi ekemede ndụk mi." }
        [text] { " — wet uwetn̄kpọ mi." }
        [text-and-components] { " — wet uwetn̄kpọ mi, m̀mê domo:" }
       *[components] { " — se ẹkemede ndomo:" }
    }

help-suggestions-footer = Mia { $shortcut } man okụt kpukpru { $total } n̄kpọ.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } edi reference ọnọde { $target }.
       *[other] { $ref } edi reference ọnọde { $target } (lain { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] { $owner } ọwọrọ enye nte { $role }.
       *[other] { $owner } ọwọrọ enye ke lain { $line } nte { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } edi reference ọnọde n̄kpọ { $property } eke { $element }.
       *[other] { $ref } edi reference ọnọde n̄kpọ { $property } eke { $element } (lain { $line }).
    }

help-kind-attribute = attribute
help-kind-snippet = ekpri ubak n̄wed
help-kind-array-entry = udian n̄kpọ ke urua

help-default = Se ẹsinamde ke akpa:
help-active-default = Se ẹnamde idahaemi ke akpa:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Mme uduak ẹmande (kiet kiet ke n̄kpọ):
       *[other] Mme uduak ẹmande:
    }

help-suggested-values = Mme uduak ẹsiakde:

help-inserts = Se odụn̄de:

help-coordinates =
    { $count ->
        [one] Ntọt Ebiet:
       *[other] Mme Ntọt Ebiet:
    }

help-type = Orụk:

help-resolved-style = Style oro ẹsịnde ọsọn̄ (styleNumber { $styleNumber }):

help-resolved-function-names = Mme enyịn̄ function ẹsịnde ọsọn̄:
help-reset-list = Fiak nnam urua ke input emi:
help-added-on-input = Ẹdiande ke input emi:
help-removed-on-input = Ẹsiode ke input emi:

help-reset-overrides = { $reset } akan̄ { $additional } ye { $removed }.
