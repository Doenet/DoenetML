# Greek editor and language-server surfaces. Translated from
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


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Επαναφορά
       *[update] Ενημέρωση
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } προβολής
       *[other] { $word } προβολής { $shortcut }
    }


## The variant picker

editor-variant = Παραλλαγή
editor-variant-filter = Φίλτρο…
editor-variant-next = Επιλογή επόμενης παραλλαγής
editor-variant-previous = Επιλογή προηγούμενης παραλλαγής


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] Εντοπίστηκε παραβίαση προσβασιμότητας WCAG AA. Κάντε κλικ για { $action ->
            [close] κλείσιμο
           *[open] άνοιγμα
        } της αναφοράς προσβασιμότητας.
        [advisories] Κάντε κλικ για { $action ->
            [close] κλείσιμο
           *[open] άνοιγμα
        } της αναφοράς προσβασιμότητας. Δεν βρέθηκαν παραβιάσεις WCAG AA, αλλά υπάρχουν πρόσθετες συστάσεις προσβασιμότητας.
       *[clean] Κάντε κλικ για { $action ->
            [close] κλείσιμο
           *[open] άνοιγμα
        } της αναφοράς προσβασιμότητας. Δεν βρέθηκαν ζητήματα προσβασιμότητας.
    }

editor-accessibility-label =
    { $status ->
        [violations] Εντοπίστηκε παραβίαση προσβασιμότητας WCAG AA. Βρέθηκαν { $count ->
            [one] { $count } παραβίαση WCAG AA
           *[other] { $count } παραβιάσεις WCAG AA
        }. Κάντε κλικ για { $action ->
            [close] κλείσιμο
           *[open] άνοιγμα
        } της αναφοράς προσβασιμότητας.
        [advisories] Δεν εντοπίστηκαν παραβιάσεις WCAG AA. Βρέθηκαν { $count ->
            [one] { $count } πρόσθετη σύσταση προσβασιμότητας
           *[other] { $count } πρόσθετες συστάσεις προσβασιμότητας
        }. Κάντε κλικ για { $action ->
            [close] κλείσιμο
           *[open] άνοιγμα
        } της αναφοράς προσβασιμότητας.
       *[clean] Δεν εντοπίστηκαν παραβιάσεις WCAG AA. Κάντε κλικ για { $action ->
            [close] κλείσιμο
           *[open] άνοιγμα
        } της αναφοράς προσβασιμότητας.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = Έκδοση DoenetML { $version }

editor-tab-help = Βοήθεια βάσει συμφραζομένων
editor-tab-help-short = Συμφρ.
editor-tab-errors = Σφάλματα
editor-tab-warnings = Προειδοποιήσεις
editor-tab-info = Πληροφορίες
editor-tab-accessibility = Προσβασιμότητα
editor-tab-responses = Υποβληθείσες απαντήσεις

editor-tab-with-count = { $label }: { $count }

editor-options = Επιλογές επεξεργαστή
editor-format-as-doenetml = Μορφοποίηση ως DoenetML
editor-format-as-xml = Μορφοποίηση ως XML


## The diagnostics panel

editor-diagnostic-line = Γραμμή #{ $line }

editor-no-errors = Κανένα σφάλμα
editor-no-warnings = Καμία προειδοποίηση
editor-no-info = Κανένα ενημερωτικό μήνυμα

editor-show-info-annotations = Εμφάνιση ενημερωτικών μηνυμάτων στον επεξεργαστή
editor-show-accessibility-annotations = Εμφάνιση μηνυμάτων προσβασιμότητας στον επεξεργαστή

editor-accessibility-learn-more = Πώς προσεγγίζει το Doenet την προσβασιμότητα

editor-accessibility-violations-heading = Παραβιάσεις προσβασιμότητας ({ $standard })

editor-accessibility-other-heading = Άλλα ζητήματα προσβασιμότητας
editor-none-found = Δεν βρέθηκε τίποτα


## Submitted responses

editor-no-responses = Δεν υπάρχουν ακόμη υποβληθείσες απαντήσεις
editor-response-answer-id = Αναγνωριστικό απάντησης
editor-response-response = Απάντηση
editor-response-credit = Βαθμολογία
editor-response-submitted = Υποβλήθηκε


## The context-help panel

help-placeholder = Τοποθετήστε τον δρομέα σε ένα όνομα ετικέτας, ένα χαρακτηριστικό ή { $ref } για τεκμηρίωση.

help-unsupported-ref-chain = Η βοήθεια για σύνθετες αναφορές όπως { $example } δεν υποστηρίζεται ακόμη.

help-unresolved-ref =
    { $reason ->
        [notFound] Δεν βρέθηκε αντικείμενο για την αναφορά: { $ref }.
        [multiple] Βρέθηκαν πολλά αντικείμενα για την αναφορά: { $ref }.
       *[indeterminate] Δεν ήταν δυνατός ο προσδιορισμός αντικειμένου για το { $ref }.
    }

help-learn-about-references = Μάθετε για τις αναφορές →
help-reference-page = Σελίδα αναφοράς →

help-suggestions-header =
    { $location ->
        [inside] Μέσα σε { $element }
       *[top] Στο ανώτατο επίπεδο
    }{ $allowed ->
        [none] { " — εδώ δεν μπαίνει τίποτα." }
        [text] { " — εδώ γράφετε κείμενο." }
        [text-and-components] { " — εδώ γράφετε κείμενο ή δοκιμάστε:" }
       *[components] { " — τι μπορείτε να δοκιμάσετε:" }
    }

help-suggestions-footer = Πατήστε { $shortcut } για να δείτε και τα { $total } στοιχεία.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] Το { $ref } είναι αναφορά σε { $target }.
       *[other] Το { $ref } είναι αναφορά σε { $target } (γραμμή { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] Εισήχθη από { $owner } ως { $role }.
       *[other] Εισήχθη από { $owner } στη γραμμή { $line } ως { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] Το { $ref } είναι αναφορά στην ιδιότητα { $property } του { $element }.
       *[other] Το { $ref } είναι αναφορά στην ιδιότητα { $property } του { $element } (γραμμή { $line }).
    }

help-kind-attribute = χαρακτηριστικό
help-kind-snippet = απόσπασμα
help-kind-array-entry = στοιχείο πίνακα

help-default = Προεπιλογή:
help-active-default = Ενεργή προεπιλογή:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Επιτρεπόμενες τιμές (μία ανά στοιχείο):
       *[other] Επιτρεπόμενες τιμές:
    }

help-suggested-values = Προτεινόμενες τιμές:

help-inserts = Εισάγει:

help-coordinates =
    { $count ->
        [one] Συντεταγμένη:
       *[other] Συντεταγμένες:
    }

help-type = Τύπος:

help-resolved-style = Υπολογισμένο στυλ (styleNumber { $styleNumber }):

help-resolved-function-names = Υπολογισμένα ονόματα συναρτήσεων:
help-reset-list = Επαναφορά λίστας σε αυτό το πεδίο:
help-added-on-input = Προστέθηκαν σε αυτό το πεδίο:
help-removed-on-input = Αφαιρέθηκαν σε αυτό το πεδίο:

help-reset-overrides = Το { $reset } υπερισχύει των { $additional } και { $removed }.
