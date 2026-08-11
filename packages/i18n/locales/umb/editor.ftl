# Umbundu editor and language-server surfaces. Selected by `uiLocale`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
#
# DoenetML element names, attribute names and `styleNumber` are identifiers of
# the language and stay in English exactly as written.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Tiukisa
       *[update] Pongolola
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } Ulekisi
       *[other] { $word } Ulekisi { $shortcut }
    }


## The variant picker

editor-variant = Ocituwa

editor-variant-filter = Sanda…

editor-variant-next = Nõla ocituwa cikwãma

editor-variant-previous = Nõla ocituwa cipita


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] Kwa sangiwa elueyo lya WCAG AA kokupitĩla. Yeta oco o { $action ->
            [close] yike
           *[open] yulule
        } elivulu lyokupitĩla.
        [advisories] Yeta oco o { $action ->
            [close] yike
           *[open] yulule
        } elivulu lyokupitĩla. Ka kwa sangiwile elueyo lya WCAG AA, pole kwa kasi alungulo akwavo okupitĩla.
       *[clean] Yeta oco o { $action ->
            [close] yike
           *[open] yulule
        } elivulu lyokupitĩla. Ka kwa sangiwile ocitangi cokupitĩla.
    }

editor-accessibility-label =
    { $status ->
        [violations] Kwa sangiwa elueyo lya WCAG AA kokupitĩla. Kwa sangiwa { $count ->
            [one] elueyo { $count } lya WCAG AA
           *[other] alueyo { $count } a WCAG AA
        }. Yeta oco o { $action ->
            [close] yike
           *[open] yulule
        } elivulu lyokupitĩla.
        [advisories] Ka kwa sangiwile elueyo lya WCAG AA. Kwa sangiwa { $count ->
            [one] elungulo { $count } likwavo lyokupitĩla
           *[other] alungulo { $count } akwavo okupitĩla
        }. Yeta oco o { $action ->
            [close] yike
           *[open] yulule
        } elivulu lyokupitĩla.
       *[clean] Ka kwa sangiwile elueyo lya WCAG AA. Yeta oco o { $action ->
            [close] yike
           *[open] yulule
        } elivulu lyokupitĩla.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = Ocitumbu ca DoenetML { $version }

editor-tab-help = Ekwatiso lyocitumãlo
editor-tab-help-short = Ocitumãlo
editor-tab-errors = Oviho
editor-tab-warnings = Alungulo
editor-tab-info = Esapulo
editor-tab-accessibility = Okupitĩla
editor-tab-responses = Atambululo a tumiwa

editor-tab-with-count = { $label }: { $count }

editor-options = Olonõla vyukwasoneha
editor-format-as-doenetml = Sokiya ndeci DoenetML
editor-format-as-xml = Sokiya ndeci XML


## The diagnostics panel

editor-diagnostic-line = Ongoli #{ $line }

editor-no-errors = Kaku Oviho
editor-no-warnings = Kaku Alungulo
editor-no-info = Kaku Esapulo

editor-show-info-annotations = Lekisa esapulo vukwasoneha
editor-show-accessibility-annotations = Lekisa ovitangi vyokupitĩla vukwasoneha

editor-accessibility-learn-more = Lilongisa ndomo Doenet a tenda okupitĩla

editor-accessibility-violations-heading = Alueyo okupitĩla ({ $standard })

editor-accessibility-other-heading = Ovitangi vikwavo vyokupitĩla
editor-none-found = Ka kwa sangiwile cimwe


## Submitted responses

editor-no-responses = Ka kwa tumiwile handi atambululo
editor-response-answer-id = Onduko yetambululo
editor-response-response = Etambululo
editor-response-credit = Olonoso
editor-response-submitted = Lya tumiwa


## The context-help panel

help-placeholder = Tuma ocilekisilo konduko ya tag, ka attribute, ale ka { $ref } oco o sange elomboloko.

help-unsupported-ref-chain = Ekwatiso kolondaka vyolonepa vyalua ndeci { $example } ka lya kasi handi.

help-unresolved-ref =
    { $reason ->
        [notFound] Ka kwa sangiwile cimwe ca { $ref }.
        [multiple] Kwa sangiwa ovina vyalua vya { $ref }.
       *[indeterminate] Ka ca tẽlele oku kũlĩhĩsa eci { $ref } a lomboloka.
    }

help-learn-about-references = Lilongisa catiamela kolondaka →
help-reference-page = Etapa lyelomboloko →

help-suggestions-header =
    { $location ->
        [inside] Vokati { $element }
       *[top] Kilu lyelivulu
    }{ $allowed ->
        [none] { " — kaku cimwe ci enda palo." }
        [text] { " — soneha olondaka palo." }
        [text-and-components] { " — soneha olondaka palo, ale seteka:" }
       *[components] { " — ovina o pondola oku seteka:" }
    }

help-suggestions-footer = Yeta { $shortcut } oco o tale ovina { $total } viosi.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } ondaka yoku tunda ku { $target }.
       *[other] { $ref } ondaka yoku tunda ku { $target } (ongoli { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] { $owner } wa yi eca ndeci { $role }.
       *[other] { $owner } wa yi eca kongoli { $line } ndeci { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } ondaka yoku tunda kocina { $property } ca { $element }.
       *[other] { $ref } ondaka yoku tunda kocina { $property } ca { $element } (ongoli { $line }).
    }

help-kind-attribute = attribute
help-kind-snippet = onepa
help-kind-array-entry = onepa ya array

help-default = Ci kasi tete:
help-active-default = Ci kasi tete kuenda ci talavaya:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Ovina vya ecelelwa (cimwe kocina cimwe):
       *[other] Ovina vya ecelelwa:
    }

help-suggested-values = Ovina vya lekisiwa:

help-inserts = Ci tumbika:

help-coordinates =
    { $count ->
        [one] Ocitumãlo:
       *[other] Ovitumãlo:
    }

help-type = Ocituwa:

help-resolved-style = Ocituwa ca sangiwa (styleNumber { $styleNumber }):

help-resolved-function-names = Olonduko vyofunsão vya sangiwa:
help-reset-list = Tiukisa elisitu kokuwo input:
help-added-on-input = Ca vokiyiwa kokuwo input:
help-removed-on-input = Ca pindiwa kokuwo input:

help-reset-overrides = { $reset } yi pitisa { $additional } la { $removed }.
