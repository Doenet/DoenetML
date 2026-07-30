# French editor and language-server surfaces. Translated from
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
# name are identifiers, not prose, and stay as written. So does `$version`,
# `$shortcut`, and anything else the code passes in already rendered.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Réinitialiser
       *[update] Mettre à jour
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } l’aperçu
       *[other] { $word } l’aperçu { $shortcut }
    }


## The variant picker

editor-variant = Variante
editor-variant-filter = Filtrer…
editor-variant-next = Sélectionner la variante suivante
editor-variant-previous = Sélectionner la variante précédente


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] Violation d’accessibilité WCAG AA détectée. Cliquer pour { $action ->
            [close] fermer
           *[open] ouvrir
        } le rapport d’accessibilité.
        [advisories] Cliquer pour { $action ->
            [close] fermer
           *[open] ouvrir
        } le rapport d’accessibilité. Aucune violation WCAG AA n’a été trouvée, mais d’autres recommandations d’accessibilité sont disponibles.
       *[clean] Cliquer pour { $action ->
            [close] fermer
           *[open] ouvrir
        } le rapport d’accessibilité. Aucun problème d’accessibilité n’a été trouvé.
    }

editor-accessibility-label =
    { $status ->
        [violations] Violation d’accessibilité WCAG AA détectée. { $count ->
            [one] { $count } violation WCAG AA
           *[other] { $count } violations WCAG AA
        } trouvée(s). Cliquer pour { $action ->
            [close] fermer
           *[open] ouvrir
        } le rapport d’accessibilité.
        [advisories] Aucune violation WCAG AA détectée. { $count ->
            [one] { $count } recommandation d’accessibilité supplémentaire
           *[other] { $count } recommandations d’accessibilité supplémentaires
        } trouvée(s). Cliquer pour { $action ->
            [close] fermer
           *[open] ouvrir
        } le rapport d’accessibilité.
       *[clean] Aucune violation WCAG AA détectée. Cliquer pour { $action ->
            [close] fermer
           *[open] ouvrir
        } le rapport d’accessibilité.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML version { $version }

editor-tab-help = Aide contextuelle
editor-tab-help-short = Contexte
editor-tab-errors = Erreurs
editor-tab-warnings = Avertissements
editor-tab-info = Infos
editor-tab-accessibility = Accessibilité
editor-tab-responses = Réponses soumises

editor-tab-with-count = { $label } : { $count }

editor-options = Options de l’éditeur
editor-format-as-doenetml = Formater en DoenetML
editor-format-as-xml = Formater en XML


## The diagnostics panel

editor-diagnostic-line = Ligne n° { $line }

editor-no-errors = Aucune erreur
editor-no-warnings = Aucun avertissement
editor-no-info = Aucun diagnostic d’information

editor-show-info-annotations = Afficher les diagnostics d’information dans l’éditeur
editor-show-accessibility-annotations = Afficher les diagnostics d’accessibilité dans l’éditeur

editor-accessibility-learn-more = Découvrir l’approche de Doenet en matière d’accessibilité

editor-accessibility-violations-heading = Violations d’accessibilité ({ $standard })

editor-accessibility-other-heading = Autres problèmes d’accessibilité
editor-none-found = Aucun résultat


## Submitted responses

editor-no-responses = Aucune réponse soumise pour l’instant
editor-response-answer-id = Id de la réponse
editor-response-response = Réponse
editor-response-credit = Crédit
editor-response-submitted = Soumise


## The context-help panel

help-placeholder = Placer le curseur sur un nom de balise, un attribut ou { $ref } pour afficher la documentation.

help-unsupported-ref-chain = L’aide pour les références en plusieurs parties comme { $example } n’est pas encore prise en charge.

help-unresolved-ref =
    { $reason ->
        [notFound] Aucun référent trouvé pour la référence : { $ref }.
        [multiple] Plusieurs référents trouvés pour la référence : { $ref }.
       *[indeterminate] Impossible de déterminer un référent pour { $ref }.
    }

help-learn-about-references = En savoir plus sur les références →
help-reference-page = Page de référence →

help-suggestions-header =
    { $location ->
        [inside] À l’intérieur de { $element }
       *[top] Au niveau supérieur
    }{ $allowed ->
        [none] { " — rien ne va ici." }
        [text] { " — saisir du texte ici." }
        [text-and-components] { " — saisir du texte ici, ou essayer :" }
       *[components] { " — à essayer :" }
    }

help-suggestions-footer = Appuyer sur { $shortcut } pour voir les { $total } composants.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } est une référence à { $target }.
       *[other] { $ref } est une référence à { $target } (ligne { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] Introduit par { $owner } en tant que { $role }.
       *[other] Introduit par { $owner } à la ligne { $line } en tant que { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } est une référence à la propriété { $property } de { $element }.
       *[other] { $ref } est une référence à la propriété { $property } de { $element } (ligne { $line }).
    }

help-kind-attribute = attribut
help-kind-snippet = extrait
help-kind-array-entry = entrée de tableau

help-default = Valeur par défaut :
help-active-default = Valeur par défaut active :

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Valeurs autorisées (une par élément) :
       *[other] Valeurs autorisées :
    }

help-suggested-values = Valeurs suggérées :

help-inserts = Insère :

help-coordinates =
    { $count ->
        [one] Coordonnée :
       *[other] Coordonnées :
    }

help-type = Type :

help-resolved-style = Style résolu (styleNumber { $styleNumber }) :

help-resolved-function-names = Noms de fonctions résolus :
help-reset-list = Liste de réinitialisation sur cette entrée :
help-added-on-input = Ajouté sur cette entrée :
help-removed-on-input = Retiré sur cette entrée :

help-reset-overrides = { $reset } l’emporte sur { $additional } et { $removed }.
