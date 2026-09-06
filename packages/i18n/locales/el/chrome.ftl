# Greek viewer chrome. Translated from `locales/en/chrome.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Greek counts in two plural categories, as English does, so every
# `{ $count -> … }` below keeps the two branches it had.
#
# Register: the plural of politeness («Πατήστε»), which is what Greek software
# uses to address a reader.
#
# The Greek question mark is a semicolon (;) and the ano teleia (·) is a weak
# stop; neither appears here, but a translator adding a question should use the
# Greek character rather than the Latin one.


## Answer submission

answer-checking = Έλεγχος…
answer-submitting = Υποβολή…
answer-checking-status = Έλεγχος απάντησης
answer-submitting-status = Υποβολή απάντησης
answer-correct = Σωστό
answer-incorrect = Λάθος
answer-response-saved = Η απάντηση αποθηκεύτηκε
answer-percent-credit = { $percent }% βαθμολογία
answer-percent-correct = { $percent }% σωστό
answer-percent-short = { $percent } %
max-credit-available = Μέγιστη διαθέσιμη βαθμολογία: { $percent }%
attempts-remaining =
    { $count ->
        [0] δεν απομένουν προσπάθειες
        [one] απομένει { $count } προσπάθεια
       *[other] απομένουν { $count } προσπάθειες
    }
validation-correct = (Σωστό)
validation-incorrect = (Λάθος)
validation-partially-correct = (Εν μέρει σωστό)
answer-show-responses =
    { $count ->
        [one] Εμφάνιση { $count } απάντησης στο { $answerId }
       *[other] Εμφάνιση { $count } απαντήσεων στο { $answerId }
    }

## Disclosure panels

feedback-heading = Ανατροφοδότηση
collapsible-click-to-open = (κάντε κλικ για άνοιγμα)
collapsible-click-to-close = (κάντε κλικ για κλείσιμο)
collapsible-initializing = Αρχικοποίηση…
footnote-show = Εμφάνιση υποσημείωσης
footnote-hide = Απόκρυψη υποσημείωσης
description-more-information = περισσότερες πληροφορίες

## Controls

slider-previous = Προηγ.
slider-next = Επόμ.
keyboard-open = Άνοιγμα πληκτρολογίου
keyboard-close = Κλείσιμο πληκτρολογίου
choice-input-remove-choice = Αφαίρεση { $choice }
matrix-remove-row = Αφαίρεση γραμμής
matrix-add-row = Προσθήκη γραμμής
matrix-remove-column = Αφαίρεση στήλης
matrix-add-column = Προσθήκη στήλης
subset-add-remove-points = Προσθήκη/αφαίρεση σημείων
subset-toggle-points-intervals = Εναλλαγή σημείων και διαστημάτων
subset-move-points = Μετακίνηση σημείων
subset-clear = Καθαρισμός
orbital-add-row = Προσθήκη γραμμής
orbital-remove-row = Αφαίρεση γραμμής
orbital-add-box = Προσθήκη πλαισίου
orbital-remove-box = Αφαίρεση πλαισίου
orbital-add-up-arrow = Προσθήκη βέλους προς τα πάνω
orbital-add-down-arrow = Προσθήκη βέλους προς τα κάτω
orbital-remove-arrow = Αφαίρεση βέλους
orbital-row-label = Ετικέτα για τη γραμμή { $row }
pretzel-answer = Απάντηση

## Math input

math-input-preview-region = προεπισκόπηση μαθηματικής παράστασης
math-input-preview = Προεπισκόπηση
math-input-invalid-expression = Μη έγκυρη παράσταση:

## Document status

viewer-initializing = Αρχικοποίηση…

## Errors

error-heading = Σφάλμα
error-found-at =
    { $span ->
        [line] Βρέθηκε στη γραμμή { $startLine }.
       *[lines] Βρέθηκε στις γραμμές { $startLine }–{ $endLine }.
    }
document-contains-errors = Αυτό το έγγραφο περιέχει σφάλματα!
diagnostic-heading-error = Σφάλμα
diagnostic-heading-warning = Προειδοποίηση
diagnostic-heading-information = Πληροφορίες
diagnostic-heading-hint = Υπόδειξη
accessibility-heading-level-1 = Παραβίαση προσβασιμότητας WCAG AA
accessibility-heading-level-2 = Ειδοποίηση προσβασιμότητας
something-went-wrong = Κάτι πήγε στραβά.
renderer-load-failed = απέτυχε η φόρτωση ενός προγράμματος απόδοσης. Φορτώστε ξανά τη σελίδα.
core-start-failed = Δεν ήταν δυνατή η εκκίνηση του προγράμματος προβολής εγγράφων. Φορτώστε ξανά τη σελίδα.
