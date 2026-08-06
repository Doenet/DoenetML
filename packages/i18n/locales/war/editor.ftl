# Waray editor and language-server surfaces. Translated from
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
# Waray marks no number on the noun, so a `{ $count -> … }` whose two English
# branches differ only in the noun renders one string here and the select is
# dropped.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Ibalik
       *[update] Iupdate
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } an pagkita
       *[other] { $word } an pagkita { $shortcut }
    }


## The variant picker

editor-variant = Baryante
editor-variant-filter = Sarahon…
editor-variant-next = Pilia an sunod nga baryante
editor-variant-previous = Pilia an nahiuna nga baryante


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] May-ada nakit-an nga paglapas ha aksesibilidad nga WCAG AA. I-klik basi { $action ->
            [close] masarhan
           *[open] maabrihan
        } an report han aksesibilidad.
        [advisories] I-klik basi { $action ->
            [close] masarhan
           *[open] maabrihan
        } an report han aksesibilidad. Waray nakit-an nga paglapas ha WCAG AA, kondi may-ada pa dugang nga rekomendasyon ha aksesibilidad.
       *[clean] I-klik basi { $action ->
            [close] masarhan
           *[open] maabrihan
        } an report han aksesibilidad. Waray nakit-an nga problema ha aksesibilidad.
    }

# No select on `$count` inside the branches: «paglapas» and «rekomendasyon» are
# the same words for one and for many.
editor-accessibility-label =
    { $status ->
        [violations] May-ada nakit-an nga paglapas ha aksesibilidad nga WCAG AA. { $count } nga paglapas ha WCAG AA an nakit-an. I-klik basi { $action ->
            [close] masarhan
           *[open] maabrihan
        } an report han aksesibilidad.
        [advisories] Waray nakit-an nga paglapas ha WCAG AA. { $count } nga dugang nga rekomendasyon ha aksesibilidad an nakit-an. I-klik basi { $action ->
            [close] masarhan
           *[open] maabrihan
        } an report han aksesibilidad.
       *[clean] Waray nakit-an nga paglapas ha WCAG AA. I-klik basi { $action ->
            [close] masarhan
           *[open] maabrihan
        } an report han aksesibilidad.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = Bersyon han DoenetML { $version }

editor-tab-help = Bulig nga sumala ha konteksto
editor-tab-help-short = Konteksto
editor-tab-errors = Sayop
editor-tab-warnings = Pahamangno
editor-tab-info = Impormasyon
editor-tab-accessibility = Aksesibilidad
editor-tab-responses = Ginpadara nga mga baton

editor-tab-with-count = { $label }: { $count }

editor-options = Mga opsyon han editor
editor-format-as-doenetml = I-pormat sugad nga DoenetML
editor-format-as-xml = I-pormat sugad nga XML


## The diagnostics panel

editor-diagnostic-line = Linya #{ $line }

editor-no-errors = Waray sayop
editor-no-warnings = Waray pahamangno
editor-no-info = Waray diagnostiko nga impormasyon

editor-show-info-annotations = Ipakita an mga diagnostiko nga impormasyon ha editor
editor-show-accessibility-annotations = Ipakita an mga diagnostiko han aksesibilidad ha editor

editor-accessibility-learn-more = Hibaroi kon paunan-o ginaatubang han Doenet an aksesibilidad

editor-accessibility-violations-heading = Mga paglapas ha aksesibilidad ({ $standard })

editor-accessibility-other-heading = Iba pa nga problema ha aksesibilidad
editor-none-found = Waray nakit-an


## Submitted responses

editor-no-responses = Waray pa ginpadara nga baton
editor-response-answer-id = Id han baton
editor-response-response = Baton
editor-response-credit = Kredito
editor-response-submitted = Ginpadara


## The context-help panel

help-placeholder = Ibutang an kursor ha ngaran han tag, atributo, o { $ref } para ha dokumentasyon.

help-unsupported-ref-chain = Waray pa suporta an bulig para ha mga reperensya nga damo an bahin sugad han { $example }.

help-unresolved-ref =
    { $reason ->
        [notFound] Waray nakit-an nga gintutudlok han reperensya: { $ref }.
        [multiple] Damo an nakit-an nga gintutudlok han reperensya: { $ref }.
       *[indeterminate] Diri natukoy an gintutudlok han { $ref }.
    }

help-learn-about-references = Hibaroi an mahitungod han mga reperensya →
help-reference-page = Pahina han reperensya →

help-suggestions-header =
    { $location ->
        [inside] Ha sulod han { $element }
       *[top] Ha pinakahitaas nga lebel
    }{ $allowed ->
        [none] { " — waray mahihimo ibutang dinhi." }
        [text] { " — pagsurat hin teksto dinhi." }
        [text-and-components] { " — pagsurat hin teksto dinhi, o sarihi:" }
       *[components] { " — mga masarihan:" }
    }

help-suggestions-footer = Pindota an { $shortcut } basi makita an ngatanan nga { $total } nga komponente.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] An { $ref } usa nga reperensya ha { $target }.
       *[other] An { $ref } usa nga reperensya ha { $target } (linya { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] Gindara han { $owner } sugad nga { $role }.
       *[other] Gindara han { $owner } ha linya { $line } sugad nga { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] An { $ref } usa nga reperensya ha propyedad nga { $property } han { $element }.
       *[other] An { $ref } usa nga reperensya ha propyedad nga { $property } han { $element } (linya { $line }).
    }

help-kind-attribute = atributo
help-kind-snippet = gutiay nga kodigo
help-kind-array-entry = entrada ha array

help-default = Nakagawian:
help-active-default = Aktibo nga nakagawian:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Mga tugot nga bili (tagsa ha kada butang):
       *[other] Mga tugot nga bili:
    }

help-suggested-values = Mga ginsusuhestiyon nga bili:

help-inserts = Nagsusulod:

# No select: «koordinado» is the same word for one and for many.
help-coordinates = Koordinado:

help-type = Klase:

help-resolved-style = Natukoy nga estilo (styleNumber { $styleNumber }):

help-resolved-function-names = Natukoy nga mga ngaran han punsyon:
help-reset-list = Lista han pagbalik hini nga input:
help-added-on-input = Gindugang hini nga input:
help-removed-on-input = Ginkuha hini nga input:

help-reset-overrides = An { $reset } nagpapalit han { $additional } ngan { $removed }.
