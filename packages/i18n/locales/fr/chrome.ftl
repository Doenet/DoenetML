# French viewer chrome. Translated from `locales/en/chrome.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Register: impersonal throughout — infinitives and bare nouns, never a `tu`
# or `vous` verb form, except in the two "reload the page" messages where an
# instruction to the reader is unavoidable. The viewer does not know how
# formally a deployment addresses its readers.
#
# Typography: French puts a space before `%`, `:`, `!` and `?`, and uses the
# typographic apostrophe `’`.


## Answer submission

answer-checking = Vérification…
answer-submitting = Envoi…
answer-checking-status = Vérification de la réponse
answer-submitting-status = Envoi de la réponse
answer-correct = Correct
answer-incorrect = Incorrect
answer-response-saved = Réponse enregistrée
answer-percent-credit = { $percent } % de crédit
answer-percent-correct = { $percent } % correct
answer-percent-short = { $percent } %
max-credit-available = Crédit maximal disponible : { $percent } %
attempts-remaining =
    { $count ->
        [0] aucune tentative restante
        [one] { $count } tentative restante
       *[other] { $count } tentatives restantes
    }
validation-correct = (Correct)
validation-incorrect = (Incorrect)
validation-partially-correct = (Partiellement correct)
# `Afficher` is the infinitive, per the register note above.
answer-show-responses =
    { $count ->
        [one] Afficher { $count } réponse à { $answerId }
       *[other] Afficher { $count } réponses à { $answerId }
    }

## Disclosure panels

feedback-heading = Commentaires
collapsible-click-to-open = (cliquer pour ouvrir)
collapsible-click-to-close = (cliquer pour fermer)
collapsible-initializing = Initialisation…
footnote-show = Afficher la note
footnote-hide = Masquer la note
description-more-information = plus d’informations

## Controls

slider-previous = Préc.
slider-next = Suiv.
keyboard-open = Ouvrir le clavier
keyboard-close = Fermer le clavier
choice-input-remove-choice = Supprimer { $choice }
matrix-remove-row = Supprimer une ligne
matrix-add-row = Ajouter une ligne
matrix-remove-column = Supprimer une colonne
matrix-add-column = Ajouter une colonne
subset-add-remove-points = Ajouter/supprimer des points
subset-toggle-points-intervals = Basculer entre points et intervalles
subset-move-points = Déplacer les points
subset-clear = Effacer
# A `box` here is one orbital, drawn as a square; `case` is the word for a
# square on a grid, which is what the reader sees.
orbital-add-row = Ajouter une ligne
orbital-remove-row = Supprimer une ligne
orbital-add-box = Ajouter une case
orbital-remove-box = Supprimer une case
orbital-add-up-arrow = Ajouter une flèche vers le haut
orbital-add-down-arrow = Ajouter une flèche vers le bas
orbital-remove-arrow = Supprimer une flèche
orbital-row-label = Étiquette de la ligne { $row }
pretzel-answer = Réponse

## Math input

math-input-preview-region = aperçu de l’expression mathématique
math-input-preview = Aperçu
math-input-invalid-expression = Expression invalide :

## Document status

viewer-initializing = Initialisation…

## Errors

error-heading = Erreur
# `Trouvée` agrees with `erreur`, which is what this sentence follows.
error-found-at =
    { $span ->
        [line] Trouvée à la ligne { $startLine }.
       *[lines] Trouvée aux lignes { $startLine }–{ $endLine }.
    }
document-contains-errors = Ce document contient des erreurs !
diagnostic-heading-error = Erreur
diagnostic-heading-warning = Avertissement
diagnostic-heading-information = Info
diagnostic-heading-hint = Suggestion
accessibility-heading-level-1 = Violation d’accessibilité WCAG AA
accessibility-heading-level-2 = Alerte d’accessibilité
something-went-wrong = Une erreur s’est produite.
renderer-load-failed = un composant d’affichage n’a pas pu être chargé. Veuillez recharger la page.
core-start-failed = Le lecteur de document n’a pas pu démarrer. Veuillez recharger la page.
