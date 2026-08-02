# Greek diagnostics. Translated from `locales/en/diagnostics.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Attribute names, element names and every other DoenetML identifier —
# `through`, `endpoint`, `midpointOffset`, `numDimensions`, `<answer>`,
# `selectFromSequence` — are part of the language, not prose, and stay in
# English exactly as written. So does anything quoted back from the author's
# own source.

## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
        [one] Το { $attributes } αγνοείται όταν καθορίζονται δύο άκρα
       *[other] Τα { $attributes } αγνοούνται όταν καθορίζονται δύο άκρα
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] Το { $attributes } αγνοείται όταν καθορίζονται και άκρο και μέσο
       *[other] Τα { $attributes } αγνοούνται όταν καθορίζονται και άκρο και μέσο
    }

line-segment-midpoint-offset-without-midpoint = Το midpointOffset δεν έχει καμία επίδραση χωρίς μέσο

## `<line>`

line-points-undetermined-dimensions = Ευθεία από σημεία με απροσδιόριστο πλήθος διαστάσεων.

line-points-too-few-dimensions = Η ευθεία πρέπει να διέρχεται από σημεία τουλάχιστον δύο διαστάσεων.

line-points-depend-on-variables = Η ευθεία διέρχεται από σημεία που εξαρτώνται από μεταβλητές: { $variables }.

line-equation-invalid-format = Μη έγκυρη μορφή εξίσωσης ευθείας στις μεταβλητές { $variable1 } και { $variable2 }.

## `<ray>`

ray-overprescribed-through = Η ημιευθεία ορίζεται από through, endpoint και direction.  Το καθορισμένο through αγνοείται.

ray-dimension-mismatch = Ασυμφωνία numDimensions στην ημιευθεία.

## `<vector>`

vector-overprescribed-head = Το διάνυσμα ορίζεται από head, tail και displacement.  Το καθορισμένο head αγνοείται.

vector-dimension-mismatch = Ασυμφωνία numDimensions στο διάνυσμα.

## Attracting and constraining

attract-to-without-nearest-point = Δεν είναι δυνατή η έλξη προς `<{ $component }>`, καθώς δεν διαθέτει μεταβλητή κατάστασης nearestPoint.

constrain-to-without-nearest-point = Δεν είναι δυνατός ο περιορισμός σε `<{ $component }>`, καθώς δεν διαθέτει μεταβλητή κατάστασης nearestPoint.

constrain-to-interior-without-nearest-point = Δεν είναι δυνατός ο περιορισμός στο εσωτερικό του `<{ $component }>`, καθώς δεν διαθέτει μεταβλητή κατάστασης nearestPoint.

## `<choiceInput>`

choice-input-label-position-ignored = Το labelPosition αγνοείται για μη ενσωματωμένο choiceInput

## Ordering children by index

choice-input-indices-count-mismatch = Οι δείκτες που καθορίστηκαν για το choiceInput αγνοούνται, καθώς το πλήθος τους δεν ταιριάζει με το πλήθος των θυγατρικών choice.

pretzel-indices-count-mismatch = Οι δείκτες που καθορίστηκαν για το problem αγνοούνται, καθώς το πλήθος τους δεν ταιριάζει με το πλήθος των θυγατρικών problem.

shuffle-indices-count-mismatch = Οι δείκτες που καθορίστηκαν για το shuffle αγνοούνται, καθώς το πλήθος τους δεν ταιριάζει με το πλήθος των στοιχείων.

indices-ignored-out-of-range = Οι δείκτες που καθορίστηκαν για το { $component } αγνοούνται, καθώς ορισμένοι είναι εκτός εύρους.

pretzel-indices-repeated = Οι δείκτες που καθορίστηκαν για το pretzel αγνοούνται, καθώς ορισμένοι επαναλαμβάνονται.

pretzel-circuit-first-index = Οι δείκτες που καθορίστηκαν για το pretzel σε λειτουργία circuit αγνοούνται, καθώς ο πρώτος δείκτης πρέπει να είναι 1.

## `<shuffle>` and `<sort>`

string-children-need-type = Για να λειτουργήσει το `<{ $component }>` με θυγατρικά αλφαριθμητικά, πρέπει να καθοριστεί χαρακτηριστικό `type`.

invalid-type-defaulting-to-math = Μη έγκυρος τύπος { $type } για το στοιχείο { $component }. Πρέπει να είναι ένα από math, text, number ή boolean. Χρησιμοποιείται math.

string-not-valid-component-to-arrange = Το αλφαριθμητικό «{ $value }» δεν είναι έγκυρο στοιχείο για { $component }. Αγνοείται.

## Types and variables

invalid-type-defaulting-to-number = Μη έγκυρος τύπος { $type }· ο τύπος ορίζεται σε number.

invalid-variable-value = Μη έγκυρη τιμή μεταβλητής: `{ $value }`

## Variants

variant-index-must-be-number = Ο δείκτης παραλλαγής { $index } πρέπει να είναι αριθμός

variant-index-must-be-integer = Ο δείκτης παραλλαγής { $index } πρέπει να είναι ακέραιος

## `<sideBySide>`

side-by-side-absolute-widths = Το `<{ $component }>` δεν έχει υλοποιηθεί για απόλυτες μετρήσεις. Τα πλάτη ορίζονται ως σχετικά.

side-by-side-absolute-margins = Το `<{ $component }>` δεν έχει υλοποιηθεί για απόλυτες μετρήσεις. Τα περιθώρια ορίζονται ως σχετικά.

side-by-side-no-block-child = Μη έγκυρο `<{ $component }>`: πρέπει να έχει τουλάχιστον ένα θυγατρικό στοιχείο μπλοκ.

## `<label>`

label-for-ignored-on-graphical = Το χαρακτηριστικό `for` σε γραφικό `<label>` αγνοείται.

label-for-must-resolve-to-one = Το χαρακτηριστικό `for` σε `<label>` πρέπει να αντιστοιχεί σε ακριβώς ένα στοιχείο.

label-for-unresolved = Το χαρακτηριστικό `for` σε `<label>` δεν μπόρεσε να αντιστοιχιστεί σε στοιχείο.

label-for-answer-with-authored-inputs = Το χαρακτηριστικό `for` σε `<label>` αναφέρεται σε `<answer>` με ρητά γραμμένα πεδία εισαγωγής· αναφερθείτε απευθείας στο πεδίο.

label-for-answer-without-input = Το χαρακτηριστικό `for` σε `<label>` αναφέρεται σε `<answer>` χωρίς πεδίο εισαγωγής προς επισήμανση.

label-for-must-reference-input-or-answer = Το χαρακτηριστικό `for` σε `<label>` πρέπει να αναφέρεται σε πεδίο εισαγωγής ή σε answer.

## Accessibility

accessibility-short-description-or-decorative = Για λόγους προσβασιμότητας, το `<{ $component }>` πρέπει είτε να έχει σύντομη περιγραφή είτε να δηλωθεί ως διακοσμητικό.

accessibility-video-short-description = Για λόγους προσβασιμότητας, το `<video>` πρέπει να έχει σύντομη περιγραφή.

accessibility-input-short-description-or-label = Για λόγους προσβασιμότητας, το `<{ $component }>` πρέπει να έχει σύντομη περιγραφή ή ετικέτα.

accessibility-answer-input-short-description-or-label = Για λόγους προσβασιμότητας, ένα `<answer>` που δημιουργεί πεδίο εισαγωγής πρέπει να έχει σύντομη περιγραφή ή ετικέτα.

accessibility-short-description-contains-math = Οι σύντομες περιγραφές δεν πρέπει να περιέχουν μαθηματικά στοιχεία όπως `<{ $component }>`. Γράψτε τα μαθηματικά με λέξεις.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] Το { $colorName } έχει ανεπαρκή αντίθεση για το κείμενο της επικεφαλίδας ενότητας (σκοτεινό θέμα) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1· απαιτείται τουλάχιστον { $threshold }:1).
       *[other] Το { $colorName } έχει ανεπαρκή αντίθεση για το κείμενο της επικεφαλίδας ενότητας ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1· απαιτείται τουλάχιστον { $threshold }:1).
    }

## `<circle>`

circle-through-points-non-numerical = Δεν έχει υλοποιηθεί `<circle>` από { $count } σημεία στην περίπτωση που τα σημεία δεν έχουν αριθμητικές τιμές.

circle-too-many-through-points = Δεν είναι δυνατός ο υπολογισμός κύκλου από περισσότερα από 3 σημεία.

circle-overprescribed-radius-center-points = Δεν είναι δυνατός ο υπολογισμός κύκλου με καθορισμένη ακτίνα, κέντρο και σημεία.

circle-center-with-multiple-points = Δεν είναι δυνατός ο υπολογισμός κύκλου με καθορισμένο κέντρο από περισσότερα από 1 σημείο.

circle-radius-too-small = Δεν είναι δυνατός ο υπολογισμός κύκλου: δεδομένου ότι η απόσταση των δύο σημείων είναι { $distance }, η καθορισμένη ακτίνα { $radius } είναι πολύ μικρή.

circle-radius-with-many-points = Δεν είναι δυνατή η δημιουργία κύκλου από περισσότερα από δύο σημεία με καθορισμένη ακτίνα.

circle-invalid-center-or-through-points = Μη έγκυρο κέντρο ή σημεία του κύκλου.

circle-radius-center-with-multiple-points = Δεν είναι δυνατός ο υπολογισμός ακτίνας κύκλου με καθορισμένο κέντρο από περισσότερα από 1 σημείο.

circle-change-radius-non-numerical = Δεν είναι δυνατή η αλλαγή ακτίνας κύκλου με μη αριθμητικά σημεία

circle-radius-with-points-non-numerical = Δεν είναι δυνατή η δημιουργία κύκλου από περισσότερα από ένα σημεία με καθορισμένη ακτίνα όταν δεν υπάρχουν αριθμητικές τιμές.

circle-change-center-non-numerical = Δεν έχει υλοποιηθεί η αλλαγή κέντρου κύκλου από σημεία με μη αριθμητικές τιμές.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] Ανεπαρκείς διαστάσεις για το πεδίο ορισμού της συνάρτησης. Το πεδίο έχει { $intervals } διάστημα, αλλά η συνάρτηση έχει { $inputs ->
            [one] { $inputs } είσοδο
           *[other] { $inputs } εισόδους
        }.
       *[other] Ανεπαρκείς διαστάσεις για το πεδίο ορισμού της συνάρτησης. Το πεδίο έχει { $intervals } διαστήματα, αλλά η συνάρτηση έχει { $inputs ->
            [one] { $inputs } είσοδο
           *[other] { $inputs } εισόδους
        }.
    }

function-domain-invalid-format = Μη έγκυρη μορφή πεδίου ορισμού για τη συνάρτηση.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Το μη αριθμητικό μέγιστο της συνάρτησης αγνοείται.
        [minimum] Το μη αριθμητικό ελάχιστο της συνάρτησης αγνοείται.
        [extremum] Το μη αριθμητικό ακρότατο της συνάρτησης αγνοείται.
        [point] Το μη αριθμητικό σημείο της συνάρτησης αγνοείται.
        [slope] Η μη αριθμητική κλίση της συνάρτησης αγνοείται.
       *[other] Το μη αριθμητικό { $type } της συνάρτησης αγνοείται.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Το κενό μέγιστο της συνάρτησης αγνοείται.
        [minimum] Το κενό ελάχιστο της συνάρτησης αγνοείται.
        [extremum] Το κενό ακρότατο της συνάρτησης αγνοείται.
        [point] Το κενό σημείο της συνάρτησης αγνοείται.
       *[other] Το κενό { $type } της συνάρτησης αγνοείται.
    }

function-points-too-close = Η συνάρτηση περιέχει δύο σημεία με θέσεις πολύ κοντά μεταξύ τους. Δεν είναι δυνατός ο ορισμός της συνάρτησης.

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] Οι επαναλήψεις συνάρτησης είναι δυνατές μόνο αν το πλήθος των εισόδων ισούται με το πλήθος των εξόδων. Αυτή η συνάρτηση έχει { $inputs } είσοδο και { $outputs ->
            [one] { $outputs } έξοδο
           *[other] { $outputs } εξόδους
        }.
       *[other] Οι επαναλήψεις συνάρτησης είναι δυνατές μόνο αν το πλήθος των εισόδων ισούται με το πλήθος των εξόδων. Αυτή η συνάρτηση έχει { $inputs } εισόδους και { $outputs ->
            [one] { $outputs } έξοδο
           *[other] { $outputs } εξόδους
        }.
    }

## `<sequence>`

sequence-invalid-length = Μη έγκυρο μήκος ακολουθίας.  Πρέπει να είναι μη αρνητικός ακέραιος.

sequence-invalid-step = Μη έγκυρο βήμα ακολουθίας.  Για ακολουθία τύπου { $type } πρέπει να είναι αριθμός.

sequence-invalid-endpoint-number = Μη έγκυρο «{ $attribute }» αριθμητικής ακολουθίας.  Πρέπει να είναι αριθμός.

sequence-invalid-endpoint-letters = Μη έγκυρο «{ $attribute }» ακολουθίας γραμμάτων.  Πρέπει να είναι συνδυασμός γραμμάτων.

sequence-invalid-endpoint = Μη έγκυρο «{ $attribute }» ακολουθίας.

select-from-sequence-coprime-not-numbers = το coprime αγνοείται, καθώς δεν επιλέγονται αριθμοί

select-from-sequence-coprime-with-exclude-combinations = το coprime αγνοείται, καθώς έχει καθοριστεί excludeCombinations

## Resolving a `target`

target-not-found = Μη έγκυρο target για `<{ $source }>`: δεν βρέθηκε ο στόχος.

target-state-variable-not-found = Μη έγκυρο target για `<{ $source }>`: δεν βρέθηκε μεταβλητή κατάστασης με όνομα «{ $property }» σε `<{ $component }>`.

## `<odeSystem>`

ode-system-variables-match-independent = Οι μεταβλητές του `<odeSystem>` πρέπει να διαφέρουν από την ανεξάρτητη μεταβλητή.

ode-system-duplicate-variable-names = Δεν είναι δυνατός ο ορισμός των δεξιών μελών ΣΔΕ με διπλά ονόματα εξαρτημένων μεταβλητών.

ode-system-rhs-function-error = Δεν είναι δυνατός ο ορισμός του δεξιού μέλους ΣΔΕ.  Σφάλμα δημιουργίας συνάρτησης mathjs.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Δεν είναι δυνατός ο ορισμός γωνίας μεταξύ { $count } ευθειών

angle-invalid-through-point = Μη έγκυρο σημείο στο through του `<angle>`

parabola-vertex-too-many-points = Δεν έχει υλοποιηθεί παραβολή με κορυφή από περισσότερα από 1 σημείο.

parabola-too-many-points = Δεν έχει υλοποιηθεί παραβολή από περισσότερα από 3 σημεία.

intersection-too-many-items = Δεν έχει υλοποιηθεί τομή για περισσότερα από δύο αντικείμενα

## Other math components

ionic-compound-not-two-ions = Δεν έχει υλοποιηθεί ιοντική ένωση για οτιδήποτε άλλο εκτός από δύο ιόντα.

ionic-compound-needs-cation-and-anion = Η ιοντική ένωση έχει υλοποιηθεί μόνο για ένα κατιόν και ένα ανιόν.

solve-equations-cannot-evaluate = Δεν είναι δυνατή η επίλυση της εξίσωσης, καθώς δεν ήταν δυνατός ο υπολογισμός της: { $equation }

math-operators-operand-number-required = Πρέπει να καθοριστεί operandNumber κατά την εξαγωγή μαθηματικού τελεστέου.

eigen-decomposition-failed = Δεν ήταν δυνατός ο υπολογισμός των ιδιοτιμών του πίνακα

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: η παράμετρος { $parameters } δεν εμφανίζεται στο μοτίβο, οπότε θα ταιριάζει πάντα με κενό.
       *[other] `<matchesPattern>`: οι παράμετροι { $parameters } δεν εμφανίζονται στο μοτίβο, οπότε θα ταιριάζουν πάντα με κενό.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: δεν είναι δυνατή η ερμηνεία του grid="{ $grid }". Πρέπει να είναι none, medium, dense ή δύο θετικοί αριθμοί χωρισμένοι με κενό, όπως grid="1 0.5". Δεν σχεδιάζεται πλέγμα.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: το xLabelPosition="left" δεν υποστηρίζεται στο πρόγραμμα απόδοσης prefigure· χρησιμοποιείται η συμπεριφορά του right.

prefigure-y-label-position-unsupported = `<graph>`: το yLabelPosition="bottom" δεν υποστηρίζεται στο πρόγραμμα απόδοσης prefigure· χρησιμοποιείται η συμπεριφορά του top.

prefigure-invalid-axis-bounds = `<graph>`: μη έγκυρα όρια αξόνων για τη μετατροπή prefigure· χρησιμοποιείται το προεπιλεγμένο bbox (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: μη έγκυρο πλάτος για τη μετατροπή prefigure· χρησιμοποιείται το προεπιλεγμένο πλάτος διαγράμματος 425.

prefigure-invalid-aspect-ratio = `<graph>`: μη έγκυρο aspectRatio για τη μετατροπή prefigure· χρησιμοποιείται η προεπιλεγμένη αναλογία 1.

prefigure-grid-spacing-too-fine = `<graph>`: η απόσταση του πλέγματος είναι πολύ μικρή για τα όρια των αξόνων· το πλέγμα παραλείπεται στο πρόγραμμα απόδοσης prefigure.

prefigure-annotations-not-rendered = `<graph>`: οι σχολιασμοί δεν αποδίδονται όταν δεν χρησιμοποιείται το πρόγραμμα απόδοσης PreFigure.

multiple-annotations-children = Βρέθηκαν πολλά θυγατρικά `<annotations>` σε `<graph>`· αγνοούνται όλα εκτός από το τελευταίο.

## Referring to other components

copy-unrecognized-component-type = Δεν είναι δυνατή η επέκταση ή αντιγραφή μη αναγνωρισμένου τύπου στοιχείου: { $type }.

copy-prop-not-found = Δεν βρέθηκε η ιδιότητα { $property } σε στοιχείο τύπου { $component }

collect-no-source = Δεν βρέθηκε πηγή για το collect.

collect-invalid-component-type = Δεν είναι δυνατή η συλλογή στοιχείων τύπου `<{ $component }>`, καθώς πρόκειται για μη έγκυρο τύπο στοιχείου.

reference-index-unavailable = Δεν είναι δυνατή η αναφορά στον δείκτη `{ $reference }`

## `<callAction>`

component-action-unavailable = Δεν είναι δυνατή η κλήση του { $action } στο στοιχείο `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Τα δεδομένα έχουν μη έγκυρο σχήμα.  Οι γραμμές έχουν ανόμοια μήκη. Βρέθηκε σε componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Τα δεδομένα έχουν διπλά ονόματα στηλών.  Βρέθηκε σε componentIdx :{ $componentIdx }

data-frame-missing-column-name = Από τα δεδομένα λείπει όνομα στήλης.  Βρέθηκε σε componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Μια βαθμολόγηση αυτής της απάντησης βασίζεται στην ίδια την υποβληθείσα απάντηση της ετικέτας answer, κάτι που θα οδηγήσει σε απροσδόκητη συμπεριφορά.

answer-max-num-attempts-in-section-wide-check-work = Ο ορισμός του `maxNumAttempts` σε `<answer>` μέσα σε περιέκτη με `sectionWideCheckWork` δεν έχει καμία επίδραση, καθώς το πλήθος των προσπαθειών ελέγχεται από τον περιέκτη. Ορίστε το `maxNumAttempts` στον περιέκτη.

nested-section-wide-check-work-max-num-attempts = Ο ορισμός του `maxNumAttempts` σε περιέκτη με `sectionWideCheckWork` που βρίσκεται μέσα σε άλλον περιέκτη με `sectionWideCheckWork` δεν έχει καμία επίδραση, καθώς το πλήθος των προσπαθειών ελέγχεται από τον εξωτερικό περιέκτη. Ορίστε το `maxNumAttempts` στον εξωτερικό περιέκτη.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] Το χαρακτηριστικό { $attributes } δεν θα έχει καμία επίδραση χωρίς ορισμένο symbolicEquality.
       *[other] Τα χαρακτηριστικά { $attributes } δεν θα έχουν καμία επίδραση χωρίς ορισμένο symbolicEquality.
    }

answer-invalid-type = Μη έγκυρος τύπος για answer: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Επειδή το στοιχείο `<{ $component }>` δεν έχει όνομα, δεν μπορεί να χρησιμοποιηθεί ως χαρακτηριστικό module

module-attribute-name-already-defined = Το στοιχείο `<{ $component } name="{ $name }">` δεν μπορεί να χρησιμοποιηθεί ως χαρακτηριστικό module, επειδή ο τύπος στοιχείου `<module>` ορίζει ήδη χαρακτηριστικό «{ $name }».

conditional-content-condition-ignored = Το χαρακτηριστικό `condition` αγνοείται σε στοιχείο `<conditionalContent>` με θυγατρικά case ή else.

slider-markers-type-mismatch = Ο τύπος των σημαδιών δεν ταιριάζει με τον τύπο του ολισθητή.

pretzel-problem-needs-statement-and-answer = Μη έγκυρο pretzel: κάθε `<problem>` πρέπει να περιέχει ένα `<statement>` και ένα `<answer>`.

pretzel-circuit-first-problem-distractor = Μη έγκυρο pretzel: σε mode="circuit", το πρώτο `<problem>` δεν μπορεί να είναι παραπλανητικό.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] Μη έγκυρη τιμή { $values } για το χαρακτηριστικό `{ $attribute }`· αγνοείται.
       *[other] Μη έγκυρες τιμές { $values } για το χαρακτηριστικό `{ $attribute }`· αγνοούνται.
    }

attribute-must-be-references = Μη έγκυρη τιμή `{ $value }` για το χαρακτηριστικό `{ $attribute }`. Το χαρακτηριστικό πρέπει να αποτελείται από αναφορές που ξεκινούν με `$`.

math-input-invalid-function-names = <mathInput>: αγνοήθηκαν μη έγκυρα ονόματα συναρτήσεων στο { $attribute }: { $names }. Το εμφανιζόμενο τμήμα κάθε ονόματος πρέπει να έχει τουλάχιστον 2 χαρακτήρες (γράμματα ή παύλες)· μπορεί να ακολουθεί προαιρετική κατάληξη `|<mathspeak alternative>`.

## Building components from the source

component-type-invalid = Μη έγκυρος τύπος στοιχείου: `<{ $componentType }>`

attribute-repeated = Δεν είναι δυνατή η επανάληψη του χαρακτηριστικού { $attribute }.

attribute-invalid-for-component = Μη έγκυρο χαρακτηριστικό «{ $attribute }» για στοιχείο τύπου `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    Ο ορισμός στυλ { $styleNumber } έχει ανεπαρκή αντίθεση { $context ->
        [text-on-background] του χρώματος κειμένου ως προς το χρώμα φόντου
        [high-contrast] του χρώματος υψηλής αντίθεσης ως προς τον καμβά
        [line] του χρώματος γραμμής ως προς τον καμβά
        [marker] του χρώματος σημαδιού ως προς τον καμβά
       *[text-on-canvas] του χρώματος κειμένου ως προς τον καμβά
    }{ $mode ->
        [dark] { " (σκοτεινό θέμα)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1· απαιτείται τουλάχιστον { $threshold }:1).

style-definition-dark-mode-text-background-contrast =
    Αν και ο ορισμός στυλ { $styleNumber } καθορίζει χρώματα με επαρκή αντίθεση για το φωτεινό θέμα, τα χρώματα του σκοτεινού θέματος που προκύπτουν από αυτές τις τιμές έχουν ανεπαρκή αντίθεση του χρώματος κειμένου ως προς το χρώμα φόντου ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1· απαιτείται τουλάχιστον { $threshold }:1). { $suggestion ->
        [available] Για επαρκή αντίθεση στο σκοτεινό θέμα, είτε αυξήστε την αντίθεση στο φωτεινό θέμα (π.χ. ορίστε { $lightAttribute }="{ $lightColor }") είτε παρακάμψτε το χρώμα του σκοτεινού θέματος (π.χ. ορίστε { $darkAttribute }="{ $darkColor }").
       *[none] Για επαρκή αντίθεση στο σκοτεινό θέμα, αυξήστε την αντίθεση στο φωτεινό θέμα ή παρακάμψτε τα παραγόμενα χρώματα με textColorDarkMode ή/και backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Αν και ο ορισμός στυλ { $styleNumber } καθορίζει χρώμα κειμένου με επαρκή αντίθεση για το φωτεινό θέμα, το χρώμα κειμένου του σκοτεινού θέματος που προκύπτει από αυτή την τιμή έχει ανεπαρκή αντίθεση ως προς τον καμβά ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1· απαιτείται τουλάχιστον { $threshold }:1). { $suggestion ->
        [available] Για επαρκή αντίθεση στο σκοτεινό θέμα, είτε αυξήστε την αντίθεση στο φωτεινό θέμα (π.χ. ορίστε textColor="{ $lightColor }") είτε παρακάμψτε το χρώμα του σκοτεινού θέματος (π.χ. ορίστε textColorDarkMode="{ $darkColor }").
       *[none] Για επαρκή αντίθεση στο σκοτεινό θέμα, αυξήστε την αντίθεση στο φωτεινό θέμα ή παρακάμψτε το παραγόμενο χρώμα με textColorDarkMode.
    }

section-multiple-style-palettes = Μια ενότητα μπορεί να επιλέξει μόνο ένα <stylePalette>· χρησιμοποιείται το τελευταίο.

## Unique variants

variant-num-to-select-not-non-negative-integer = δεν είναι δυνατός ο προσδιορισμός μοναδικών παραλλαγών του { $component }, καθώς το numToSelect δεν είναι μη αρνητικός ακέραιος.

variant-num-to-select-not-constant-number = δεν είναι δυνατός ο προσδιορισμός μοναδικών παραλλαγών του { $component }, καθώς το numToSelect δεν είναι σταθερός αριθμός.

variant-with-replacement-not-constant-boolean = δεν είναι δυνατός ο προσδιορισμός μοναδικών παραλλαγών του { $component }, καθώς το withReplacement δεν είναι σταθερή δυαδική τιμή.

variant-select-weight-disables-unique = Οι μοναδικές παραλλαγές για το select απενεργοποιούνται αν κάποια επιλογή έχει καθορισμένο selectWeight ή selectForVariants

variant-coprime-undetermined = δεν είναι δυνατός ο προσδιορισμός μοναδικών παραλλαγών του { $component }, καθώς δεν μπορεί να διαπιστωθεί ότι το coprime είναι πάντα ψευδές.

variant-attribute-not-constant = δεν είναι δυνατός ο προσδιορισμός μοναδικών παραλλαγών του { $component }, καθώς το { $attribute } δεν είναι σταθερά.

variant-attribute-not-number = δεν είναι δυνατός ο προσδιορισμός μοναδικών παραλλαγών του { $component }, καθώς το { $attribute } δεν είναι αριθμός.

variant-attribute-wrong-type-for-sequence =
    δεν είναι δυνατός ο προσδιορισμός μοναδικών παραλλαγών του { $component } τύπου { $type }, καθώς το { $attribute } δεν είναι { $expected ->
        [letters-combination] συνδυασμός γραμμάτων
        [math-expression] έγκυρη μαθηματική παράσταση
        [integer] ακέραιος
       *[number] αριθμός
    }.

variant-length-not-integer = δεν είναι δυνατός ο προσδιορισμός μοναδικών παραλλαγών του { $component }, καθώς το length δεν είναι ακέραιος.

variant-sort-not-implemented = δεν έχουν υλοποιηθεί μοναδικές παραλλαγές ενός { $component } με sort

variant-exclude-combinations-not-implemented = δεν έχουν υλοποιηθεί μοναδικές παραλλαγές ενός { $component } με excludeCombinations

variant-math-exclude-not-implemented = δεν έχουν υλοποιηθεί μοναδικές παραλλαγές ενός { $component } τύπου math με exclude

variant-non-constant-exclude-not-implemented = δεν έχουν υλοποιηθεί μοναδικές παραλλαγές ενός { $component } με μη σταθερό exclude

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: δεν υποστηρίζεται στο πρόγραμμα απόδοσης graph prefigure· ο απόγονος παραλείπεται.

prefigure-descendant-invalid-geometry = { $subject }: μη πεπερασμένη ή ελλιπής γεωμετρία· ο απόγονος παραλείπεται.

prefigure-curve-label-omitted = { $subject }: οι ετικέτες δεν υποστηρίζονται σε μετατρεμμένα στοιχεία καμπύλης· η ετικέτα παραλείπεται.

prefigure-curve-unsupported-definition-type = { $subject }: μη υποστηριζόμενος τύπος ορισμού καμπύλης «{ $definitionType }»· ο απόγονος παραλείπεται.

prefigure-region-flip-functions-unsupported = { $subject }: μη υποστηριζόμενο χαρακτηριστικό flipFunctions στο regionBetweenCurves· ο απόγονος παραλείπεται.

prefigure-region-non-formula-child = { $subject }: στο regionBetweenCurves υποστηρίζονται μόνο θυγατρικές συναρτήσεις τύπου formula· ο απόγονος παραλείπεται.

prefigure-label-position-unsupported =
    { $subject }: μη υποστηριζόμενο labelPosition «{ $labelPosition }» για { $labelKind ->
        [line-family] ετικέτα αντικειμένου της οικογένειας ευθειών
       *[point] ετικέτα σημείου
    }· χρησιμοποιείται η προεπιλεγμένη στοίχιση PreFigure.

prefigure-fill-style-unsupported = { $subject }: το στυλ γεμίσματος «{ $fillStyle }» δεν υποστηρίζεται από το PreFigure· χρησιμοποιείται συμπαγές γέμισμα.

prefigure-line-style-unknown = { $subject }: το άγνωστο στυλ γραμμής «{ $lineStyle }» παραλείφθηκε από την έξοδο PreFigure.

prefigure-marker-style-mapped-to-diamond = { $subject }: το στυλ σημαδιού «{ $markerStyle }» αντιστοιχίστηκε στο στυλ PreFigure «diamond».

prefigure-marker-style-unsupported = { $subject }: το στυλ σημαδιού «{ $markerStyle }» δεν υποστηρίζεται από το PreFigure· χρησιμοποιείται το προεπιλεγμένο στυλ.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: μη έγκυρο `ref`· δεν είναι δυνατός ο προσδιορισμός του στόχου. Ο σχολιασμός παραλείπεται.

annotation-ref-multiple-targets = `<annotation>`: το `ref` αντιστοιχεί σε πολλούς στόχους· χρησιμοποιείται ο πρώτος.

annotation-ref-outside-graph = `<annotation>`: μη έγκυρο `ref`· ο στόχος βρίσκεται εκτός του γραφήματος που τον περιέχει. Ο σχολιασμός παραλείπεται.

annotation-ref-unsupported-target = `<annotation>`: μη έγκυρο `ref`· ο στόχος δεν είναι υποστηριζόμενο γραφικό αντικείμενο στη μετατροπή prefigure. Ο σχολιασμός παραλείπεται.

annotation-text-missing = `<annotation>`: λείπει ή είναι κενό το `text`· εξάγεται κενό κείμενο.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Εντοπίστηκε κυκλική εξάρτηση.
       *[other] Εντοπίστηκε κυκλική εξάρτηση που αφορά στοιχείο `<{ $componentType }>`.
    }

reference-no-referent = Δεν βρέθηκε αντικείμενο για την αναφορά: `{ $reference }`

reference-multiple-referents = Βρέθηκαν πολλά αντικείμενα για την αναφορά: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Μη έγκυρη μορφή για το χαρακτηριστικό { $attribute } του `<{ $componentType }>`.

children-invalid = Μη έγκυρα θυγατρικά για `<{ $componentType }>`: βρέθηκαν μη έγκυρα θυγατρικά: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Μη έγκυρη τιμή `{ $value }` για το χαρακτηριστικό `{ $attribute }`· χρησιμοποιείται η τιμή `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] Δεν βρέθηκε η έκδοση DoenetML { $version }.
       *[other] Δεν βρέθηκε η έκδοση DoenetML { $version }. Χρησιμοποιείται η έκδοση { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = Μη έγκυρο DoenetML: { $content }

parse-tag-missing-close-tag = Μη έγκυρο DoenetML: Η ετικέτα `{ $tag }` δεν έχει ετικέτα κλεισίματος. Αναμένεται αυτοκλειόμενη ετικέτα ή ετικέτα `</{ $tagName }>`.

parse-tag-error = Μη έγκυρο DoenetML: Σφάλμα στην ετικέτα `<{ $tagName }>`

parse-attribute-missing-value = Μη έγκυρο DoenetML: Από το μη έγκυρο χαρακτηριστικό `{ $attribute }` φαίνεται να λείπει τιμή.

parse-attribute-invalid = Μη έγκυρο DoenetML: Μη έγκυρο χαρακτηριστικό `{ $attribute }`

parse-attribute-value-invalid = Μη έγκυρο DoenetML: Μη έγκυρη τιμή χαρακτηριστικού `{ $value }`

parse-attribute-value-quote-mismatch = Μη έγκυρο DoenetML: Μη έγκυρη τιμή χαρακτηριστικού `{ $value }`. Τα εισαγωγικά δεν ταιριάζουν. Φαίνεται να λείπει ένα `{ $quote }`

parse-open-tag-name-missing = Μη έγκυρο DoenetML: Βρέθηκε ετικέτα χωρίς όνομα, π.χ. `<`

parse-tag-not-closed = Μη έγκυρο DoenetML: Η ετικέτα `{ $tag }` δεν έκλεισε (φαίνεται να λείπει ένα `>`).

parse-self-closing-tag-name-missing = Μη έγκυρο DoenetML: Βρέθηκε ετικέτα χωρίς όνομα `<{ $content }>`

parse-self-closing-tag-not-closed = Μη έγκυρο DoenetML: Η ετικέτα `{ $tag }` δεν έκλεισε (φαίνεται να λείπει ένα `/>`).

parse-tag-invalid-attributes = Μη έγκυρο DoenetML: Η ετικέτα `{ $tag }` δεν είναι έγκυρη. Μπορεί να έχει λανθασμένα χαρακτηριστικά.

parse-close-tag-name-missing = Μη έγκυρο DoenetML: Βρέθηκε ετικέτα κλεισίματος χωρίς όνομα, π.χ. `</`

parse-attribute-value-unquoted = Οι τιμές χαρακτηριστικών πρέπει να είναι σε εισαγωγικά: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = Μη έγκυρο DoenetML: Βρέθηκε ετικέτα κλεισίματος `{ $tag }`, αλλά χωρίς αντίστοιχη ετικέτα ανοίγματος

parse-close-tag-mismatched = Μη έγκυρο DoenetML: Ασύμφωνη ετικέτα κλεισίματος. Αναμενόταν `</{ $expected }>`. Βρέθηκε `{ $found }`

parser-node-unconvertible = Δεν ήταν δυνατή η μετατροπή του κόμβου { $node } σε κόμβο Dast.

## Names

name-attribute-invalid =
    Μη έγκυρο χαρακτηριστικό name='{ $name }'. { $reason ->
        [characters] Τα ονόματα μπορούν να περιέχουν μόνο γράμματα, αριθμούς, κάτω παύλες ή παύλες.
       *[start] Τα ονόματα πρέπει να ξεκινούν με γράμμα.
    }

component-name-invalid-start = Μη έγκυρο όνομα στοιχείου «{ $name }». Τα ονόματα πρέπει να ξεκινούν με γράμμα.

## `<answer>` sugar

answer-video-watched-missing-video = Το answer με type videoWatched πρέπει να έχει χαρακτηριστικό video

answer-video-watched-video-not-reference = Το answer με type videoWatched πρέπει να έχει χαρακτηριστικό video που να είναι αναφορά

answer-name-not-single-text = Το χαρακτηριστικό name του answer πρέπει να έχει ένα μόνο θυγατρικό κείμενο

## Referencing another document

external-doenetml-recursion-limit = Δεν ήταν δυνατή η ανάκτηση εξωτερικού DoenetML λόγω υπερβολικών επιπέδων αναδρομής. Μήπως υπάρχει κυκλική αναφορά;

external-doenetml-unavailable = Δεν ήταν δυνατή η ανάκτηση DoenetML από { $attribute }="{ $uri }"

external-doenetml-type-mismatch = Ανακτήθηκε μη έγκυρο DoenetML από { $attribute }="{ $uri }": δεν ταιριάζει με τον τύπο στοιχείου «{ $componentType }»

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Το χαρακτηριστικό `{ $from }` είναι παρωχημένο· χρησιμοποιήστε `{ $to }`.
       *[other] [deprecation] Το χαρακτηριστικό `{ $from }` στο `<{ $component }>` είναι παρωχημένο· χρησιμοποιήστε `{ $to }`.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Το χαρακτηριστικό `{ $from }` είναι παρωχημένο και αγνοείται, επειδή έχει καθοριστεί και `{ $to }`.
       *[other] [deprecation] Το χαρακτηριστικό `{ $from }` στο `<{ $component }>` είναι παρωχημένο και αγνοείται, επειδή έχει καθοριστεί και `{ $to }`.
    }

deprecated-attribute-ignored = [deprecation] Το χαρακτηριστικό `{ $attribute }` στο `<{ $component }>` είναι παρωχημένο και αγνοείται.


## Language coverage

pluralize-english-only = Το `<pluralize>` μπορεί να σχηματίσει πληθυντικό μόνο στα αγγλικά, οπότε σε έγγραφο γραμμένο στη γλώσσα { $locale } το κείμενό του μένει αμετάβλητο. Γράψτε απευθείας τον πληθυντικό ή ορίστε τον με το χαρακτηριστικό `pluralForm`.


## Checking against the schema

schema-element-unrecognized = Το στοιχείο `<{ $tag }>` δεν είναι αναγνωρισμένο στοιχείο Doenet.

schema-element-not-allowed-at-root = Το στοιχείο `<{ $tag }>` δεν επιτρέπεται στη ρίζα του εγγράφου.

schema-element-not-allowed-inside = Το στοιχείο `<{ $tag }>` δεν επιτρέπεται μέσα σε `<{ $parent }>`.

schema-attribute-unrecognized = Το στοιχείο `<{ $tag }>` δεν έχει χαρακτηριστικό με όνομα `{ $attribute }`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Το χαρακτηριστικό `{ $attribute }` του στοιχείου `<{ $tag }>` πρέπει να είναι λίστα της οποίας κάθε στοιχείο είναι ένα από: { $allowed }
       *[other] Το χαρακτηριστικό `{ $attribute }` του στοιχείου `<{ $tag }>` πρέπει να είναι ένα από: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Μη έγκυρο όνομα παραλλαγής για select.  Το όνομα παραλλαγής { $variantName } εμφανίζεται σε { $numOptions } επιλογές, αλλά το πλήθος προς επιλογή είναι { $numToSelect }.

select-variant-name-without-options = Έχουν καθοριστεί παραλλαγές για το select αλλά καμία επιλογή για το πιθανό όνομα παραλλαγής: { $variantName }.

select-variant-name-not-possible = Το όνομα παραλλαγής { $variantName } που καθορίστηκε για το select δεν είναι πιθανό όνομα παραλλαγής.

select-too-few-options = Δεν είναι δυνατή η επιλογή { $numToSelect } στοιχείων από μόλις { $numOptions }.

select-from-sequence-too-few-values = Δεν είναι δυνατή η επιλογή { $numToSelect } τιμών από ακολουθία μήκους { $length }.

select-from-sequence-indices-count-mismatch = Το πλήθος των δεικτών που καθορίστηκαν για το select πρέπει να ταιριάζει με το πλήθος προς επιλογή

select-from-sequence-indices-not-integers = Όλοι οι δείκτες που καθορίστηκαν για το select πρέπει να είναι ακέραιοι

select-from-sequence-index-excluded = Ο δείκτης που καθορίστηκε για το selectfromsequence είχε εξαιρεθεί

select-from-sequence-indices-excluded-combination = Οι δείκτες που καθορίστηκαν για το selectfromsequence αποτελούσαν εξαιρεμένο συνδυασμό

select-from-sequence-coprime-not-positive-integers = Δεν είναι δυνατή η επιλογή σχετικά πρώτων συνδυασμών, καθώς δεν επιλέγονται θετικοί ακέραιοι.

select-from-sequence-coprime-common-factor = Δεν είναι δυνατή η επιλογή σχετικά πρώτων αριθμών. Όλες οι πιθανές τιμές έχουν κοινό διαιρέτη. (Οι καθορισμένες τιμές των "from" ή "to" πρέπει να είναι σχετικά πρώτες με το "step".)

select-from-sequence-coprime-single-number = Δεν είναι δυνατή η επιλογή σχετικά πρώτων συνδυασμών από έναν μόνο αριθμό διαφορετικό από το 1.

select-from-sequence-excluded-too-many-combinations = Εξαιρέθηκε πάνω από το 70% των συνδυασμών στο selectFromSequence

select-from-sequence-coprime-none-found = Δεν ήταν δυνατή η επιλογή σχετικά πρώτων αριθμών. Όλες οι πιθανές τιμές έχουν κοινό διαιρέτη.

select-from-sequence-too-few-unique-values = Δεν είναι δυνατή η επιλογή { $numToSelect } μοναδικών τιμών από ακολουθία μήκους { $numPossibleValues }

select-prime-numbers-too-few-values = Δεν είναι δυνατή η επιλογή { $numToSelect } τιμών από λίστα πρώτων αριθμών μήκους { $numValues }

select-prime-numbers-values-count-mismatch = Το πλήθος των τιμών που καθορίστηκαν για το select πρέπει να ταιριάζει με το πλήθος προς επιλογή

select-prime-numbers-values-not-prime = Όλες οι τιμές που καθορίστηκαν για επιλογή πρώτου αριθμού πρέπει να βρίσκονται στη λίστα των πρώτων αριθμών

select-prime-numbers-values-excluded-combination = Οι τιμές που καθορίστηκαν για το selectPrimeNumbers αποτελούσαν εξαιρεμένο συνδυασμό

select-prime-numbers-excluded-too-many-combinations = Εξαιρέθηκε πάνω από το 70% των συνδυασμών στο selectPrimeNumbers

select-random-combination-fluke = Από εξαιρετικά απίθανη σύμπτωση, δεν ήταν δυνατή η επιλογή συνδυασμού τυχαίων τιμών

select-random-value-fluke = Από εξαιρετικά απίθανη σύμπτωση, δεν ήταν δυνατή η επιλογή τυχαίας τιμής
