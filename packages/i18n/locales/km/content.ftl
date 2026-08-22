# Khmer content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Khmer has no grammatical gender, no adjective agreement, no article and no
# case, so `$gender` and `$role` go unused here exactly as they do in English,
# and the two `-article` branches read like the ones without.
#
# Adjectives *follow* the noun they modify — «បន្ទាត់ក្រាស់ពណ៌ក្រហម» — so the
# composition messages put the noun first, as Thai and Vietnamese do, and keep
# the English order among the adjectives themselves.
#
# Khmer is written without spaces inside a phrase, so a placeable sits flush
# against the word in front of it wherever the two belong to one phrase, and a
# space appears only where the phrase genuinely breaks.
#
# Numbers render in Latin digits rather than in Khmer numerals: CLDR's default
# numbering system for `km` is `latn`, which is the digit policy in the package
# README, and it is what Cambodian schoolbooks print.
#
# The 118 element names and the 12 anion names are left out, so those keys fall
# back to English — see the note above `ion-name-oxidation-state`.


## Style vocabulary

# «ពណ៌» is the word for colour, and a Khmer colour term is normally named with
# it. It is carried inside each word here rather than written into the
# composition messages, because a colour that did not come from this table — a
# CSS keyword asked for by name, or a word an author wrote into
# `lineColorWord` — arrives untranslated and would be left with a stranded
# «ពណ៌» in front of it.
color =
    .black = ពណ៌ខ្មៅ
    .white = ពណ៌ស
    .gray = ពណ៌ប្រផេះ
    .red = ពណ៌ក្រហម
    .orange = ពណ៌ទឹកក្រូច
    .yellow = ពណ៌លឿង
    .green = ពណ៌បៃតង
    .cyan = ពណ៌ខៀវផ្ទៃមេឃ
    .blue = ពណ៌ខៀវ
    .purple = ពណ៌ស្វាយ
    .pink = ពណ៌ផ្កាឈូក
    .brown = ពណ៌ត្នោត
line-width =
    .thick = ក្រាស់
    .thin = ស្ដើង
line-style =
    .dashed = ដាច់ៗ
    .dotted = ចុចៗ
# Noun phrases: they follow «ជាមួយ» and modify nothing.
fill-style =
    .horizontal = បន្ទាត់ដេក
    .vertical = បន្ទាត់ឈរ
    .diagonal = បន្ទាត់ទ្រេត
    .backdiagonal = បន្ទាត់ទ្រេតបញ្ច្រាស
    .dots = ចំណុច
    .diamonds = រាងចតុកោណស្មើ
noun =
    .line = បន្ទាត់
    .line-segment = អង្កត់
    .ray = កាំរស្មី
    .vector = វ៉ិចទ័រ
    .curve = ខ្សែកោង
    .function = អនុគមន៍
    .parabola = ប៉ារ៉ាបូល
    .polyline = ខ្សែបន្ទាត់ច្រើនកំណាត់
    .polygon = ពហុកោណ
    .triangle = ត្រីកោណ
    .rectangle = ចតុកោណកែង
    .circle = រង្វង់
    .region = តំបន់
    .point = ចំណុច
    .square = ការេ
    .diamond = រាងចតុកោណស្មើ
    .cross = សញ្ញាកាកបាទ
    .plus = សញ្ញាបូក
# A Khmer count follows what it counts and takes its own classifier word:
# «ពហុកោណនិយ័ត 5 ជ្រុង», where «ជ្រុង» is the word for side. That whole group
# sits immediately after the noun and in front of any adjective, so it folds
# into the head and there is no tail. Putting it after the adjectives would
# separate «ជ្រុង» from the number counting it.
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] ពហុកោណនិយ័ត { $numSides } ជ្រុង
    }
# Khmer has no grammatical gender, so every noun answers the same and the
# answer goes unused — as in English.
noun-gender = neuter

## Style composition

style-stroke =
    { $parts ->
        [width-style-color] { $width }{ $lineStyle }{ $color }
        [width-color] { $width }{ $color }
        [style-color] { $lineStyle }{ $color }
        [width-style] { $width }{ $lineStyle }
        [width] { $width }
        [style] { $lineStyle }
       *[color] { $color }
    }
# The noun leads and its adjectives follow: «បន្ទាត់ក្រាស់ដាច់ៗពណ៌ក្រហម».
style-with-noun =
    { $parts ->
        [noun-tail] { $noun }{ $description }{ $nounTail }
       *[noun] { $noun }{ $description }
    }
# «លាប» is the verb for laying colour on a surface, and every colour word above
# already carries its own «ពណ៌», so the composition reads «លាបពណ៌ខៀវ» with the
# colour word said once. A colour that did not come from that table brings no
# «ពណ៌» with it, and «លាប» stands in front of it unaided.
style-filled-word = លាប
style-filled =
    { $parts ->
        [pattern] { $filled }{ $color } ជាមួយ{ $pattern }
       *[plain] { $filled }{ $color }
    }
style-filled-with-noun =
    { $parts ->
        [pattern] { $noun }{ $filled }{ $color } ជាមួយ{ $pattern }
        [plain-tail] { $noun }{ $nounTail }{ $filled }{ $color }
        [pattern-tail] { $noun }{ $nounTail }{ $filled }{ $color } ជាមួយ{ $pattern }
       *[plain] { $noun }{ $filled }{ $color }
    }
# «គែម» leads its own adjectives, the way every noun here does. Khmer has no
# article, so the `-article` branches read like the ones without.
style-border-clause =
    { $parts ->
        [with-article] ជាមួយគែម{ $border }
        [and] និងគែម{ $border }
        [and-article] និងគែម{ $border }
       *[with] ជាមួយគែម{ $border }
    }
# The pattern is a noun and the colour follows it, as everywhere else.
style-fill =
    { $parts ->
        [pattern] { $pattern }{ $color }
       *[plain] { $color }
    }
style-unfilled = មិនលាបពណ៌
style-text =
    { $parts ->
        [background] { $color }លើផ្ទៃខាងក្រោយ{ $background }
       *[plain] { $color }
    }
style-background-none = គ្មាន

## Boolean words

boolean-true = ពិត
boolean-false = មិនពិត

## Answer buttons

answer-submit-label = ពិនិត្យចម្លើយ
answer-submit-label-no-correctness = ដាក់ស្នើចម្លើយ

## Sectional blocks

section-name =
    .activity = សកម្មភាព
    .aside = ចំណាំក្បែរ
    .cascade = លំដាប់
    .definition = និយមន័យ
    .example = ឧទាហរណ៍
    .exercise = លំហាត់
    .exercises = លំហាត់
    .given-answer = ចម្លើយ
    .note = ចំណាំ
    .objectives = គោលបំណង
    .paragraphs = កថាខណ្ឌ
    .part = ភាគ
    .problem = បញ្ហា
    .problems = បញ្ហា
    .proof = សម្រាយបញ្ជាក់
    .question = សំណួរ
    .section = ផ្នែក
    .solution = ដំណោះស្រាយ
    .task = កិច្ចការ
    .theorem = ទ្រឹស្តីបទ
section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }
hint-title = ការណែនាំ

## Tables and figures

table-name =
    { $parts ->
        [numbered] តារាងទី { $enumeration }
        [numbered-title] តារាងទី { $enumeration }{ ": " }
        [unnumbered-title] តារាង{ ": " }
       *[unnumbered] តារាង
    }
figure-name =
    { $parts ->
        [numbered] រូបភាពទី { $enumeration }
        [numbered-caption] រូបភាពទី { $enumeration }{ ": " }
        [unnumbered-caption] រូបភាព{ ": " }
       *[unnumbered] រូបភាព
    }

## Paginator controls

paginator-previous = មុន
paginator-next = បន្ទាប់
paginator-page = ទំព័រ
paginator-page-status = { $pageLabel } { $currentPage } ក្នុងចំណោម { $numPages }

## Piecewise functions

piecewise-condition-or = ឬ
piecewise-condition-if = បើ
piecewise-condition-otherwise = ក្នុងករណីផ្សេង

## Chemistry
##
## `element-name` and `element-anion-name` are deliberately absent, so all 130
## keys fall back to English and `lint:i18n` reports the gap.
##
## Cambodian chemistry *is* taught in Khmer and its textbooks do print Khmer
## transcriptions of the element names. What is missing is a transcription
## convention this seed could reproduce rather than invent: the published
## spellings vary, and an unreviewed guess written in a script the reader
## cannot check against the English beside it is worse than the English
## itself. This is the first thing a Khmer speaker should fill in, and filling
## it in needs no permission.

ion-name-oxidation-state = { $name } ({ $numeral })
chemistry-invalid-symbol = សញ្ញាគីមីមិនត្រឹមត្រូវ
chemistry-invalid-ionic-compound = សមាសធាតុអ៊ីយ៉ុងមិនត្រឹមត្រូវ
