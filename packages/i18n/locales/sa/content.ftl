# Sanskrit content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Written in Devanagari, which is what CLDR fills a bare `sa` in as. Sanskrit
# is written in more scripts than any other language in this roster — Grantha,
# Sharada, Kannada, Telugu, Bengali, Odia and a dozen more all carry it — so
# `sa-Gran`, `sa-Knda` and their siblings all reach this catalog and get
# Devanagari. Elsewhere the answer to a script mismatch is a second catalog
# beside the first; here it would be a dozen of them, and Devanagari is the one
# every Sanskrit reader is taught.
#
# **This catalog forks on `$role` more widely than any before it, because
# Sanskrit inflects an adjective for gender, number *and* case.** Three
# genders, and each clause position governs a different case:
#
#   standalone          nominative singular, agreeing with the noun described
#   border-clause       instrumental feminine, before «सीमया सह»
#   background-clause   locative feminine, before «पृष्ठभूमौ»
#   text-clause         nominative neuter, agreeing with «पाठ्यम्»
#
# The last three are one form each rather than three, because the noun each
# position lands on is a word this catalog writes: «सीमा» is feminine,
# «पृष्ठभूमिः» is feminine, «पाठ्यम्» is neuter. So `$gender` is not consulted
# inside them — it would only restate what the position already fixed.
#
# **Sandhi is the affix rule at a word boundary, and it is why this catalog
# writes words apart.** Sanskrit euphonically combines the end of one word with
# the start of the next, and the result depends on both — so a word standing in
# front of a placeable cannot be spelled until the placeable is known. The way
# out is the one Sanskrit itself supplies: the *pada-pāṭha*, the unsandhied
# word-by-word text, is grammatical and is how technical prose has always been
# written. Every join across a placeable here is unsandhied. Where both words
# are the catalog's own — «नीलायां पृष्ठभूमौ» — sandhi is applied, because
# nothing unknown stands between them.
#
# Numbers render in Latin digits under Indian grouping, as everywhere in this
# repository (#1615), so a side count reads `1,234` and matches the mathematics
# beside it.


## Style vocabulary

color =
    .black =
        { $role ->
            [border-clause] कृष्णया
            [background-clause] कृष्णायां
            [text-clause] कृष्णम्
           *[standalone]
                { $gender ->
                    [f] कृष्णा
                    [n] कृष्णम्
                   *[m] कृष्णः
                }
        }
    .white =
        { $role ->
            [border-clause] श्वेतया
            [background-clause] श्वेतायां
            [text-clause] श्वेतम्
           *[standalone]
                { $gender ->
                    [f] श्वेता
                    [n] श्वेतम्
                   *[m] श्वेतः
                }
        }
    .gray =
        { $role ->
            [border-clause] धूसरया
            [background-clause] धूसरायां
            [text-clause] धूसरम्
           *[standalone]
                { $gender ->
                    [f] धूसरा
                    [n] धूसरम्
                   *[m] धूसरः
                }
        }
    .red =
        { $role ->
            [border-clause] रक्तया
            [background-clause] रक्तायां
            [text-clause] रक्तम्
           *[standalone]
                { $gender ->
                    [f] रक्ता
                    [n] रक्तम्
                   *[m] रक्तः
                }
        }
    .orange =
        { $role ->
            [border-clause] नारङ्गवर्णया
            [background-clause] नारङ्गवर्णायां
            [text-clause] नारङ्गवर्णम्
           *[standalone]
                { $gender ->
                    [f] नारङ्गवर्णा
                    [n] नारङ्गवर्णम्
                   *[m] नारङ्गवर्णः
                }
        }
    .yellow =
        { $role ->
            [border-clause] पीतया
            [background-clause] पीतायां
            [text-clause] पीतम्
           *[standalone]
                { $gender ->
                    [f] पीता
                    [n] पीतम्
                   *[m] पीतः
                }
        }
    .green =
        { $role ->
            [border-clause] हरितया
            [background-clause] हरितायां
            [text-clause] हरितम्
           *[standalone]
                { $gender ->
                    [f] हरिता
                    [n] हरितम्
                   *[m] हरितः
                }
        }
    .cyan =
        { $role ->
            [border-clause] हरिन्नीलया
            [background-clause] हरिन्नीलायां
            [text-clause] हरिन्नीलम्
           *[standalone]
                { $gender ->
                    [f] हरिन्नीला
                    [n] हरिन्नीलम्
                   *[m] हरिन्नीलः
                }
        }
    .blue =
        { $role ->
            [border-clause] नीलया
            [background-clause] नीलायां
            [text-clause] नीलम्
           *[standalone]
                { $gender ->
                    [f] नीला
                    [n] नीलम्
                   *[m] नीलः
                }
        }
    .purple =
        { $role ->
            [border-clause] धूम्रवर्णया
            [background-clause] धूम्रवर्णायां
            [text-clause] धूम्रवर्णम्
           *[standalone]
                { $gender ->
                    [f] धूम्रवर्णा
                    [n] धूम्रवर्णम्
                   *[m] धूम्रवर्णः
                }
        }
    .pink =
        { $role ->
            [border-clause] पाटलया
            [background-clause] पाटलायां
            [text-clause] पाटलम्
           *[standalone]
                { $gender ->
                    [f] पाटला
                    [n] पाटलम्
                   *[m] पाटलः
                }
        }
    .brown =
        { $role ->
            [border-clause] कपिशया
            [background-clause] कपिशायां
            [text-clause] कपिशम्
           *[standalone]
                { $gender ->
                    [f] कपिशा
                    [n] कपिशम्
                   *[m] कपिशः
                }
        }

line-width =
    .thick =
        { $role ->
            [border-clause] स्थूलया
            [background-clause] स्थूलायां
            [text-clause] स्थूलम्
           *[standalone]
                { $gender ->
                    [f] स्थूला
                    [n] स्थूलम्
                   *[m] स्थूलः
                }
        }
    .thin =
        { $role ->
            [border-clause] सूक्ष्मया
            [background-clause] सूक्ष्मायां
            [text-clause] सूक्ष्मम्
           *[standalone]
                { $gender ->
                    [f] सूक्ष्मा
                    [n] सूक्ष्मम्
                   *[m] सूक्ष्मः
                }
        }

line-style =
    .dashed =
        { $role ->
            [border-clause] खण्डितया
            [background-clause] खण्डितायां
            [text-clause] खण्डितम्
           *[standalone]
                { $gender ->
                    [f] खण्डिता
                    [n] खण्डितम्
                   *[m] खण्डितः
                }
        }
    .dotted =
        { $role ->
            [border-clause] बिन्दुमयया
            [background-clause] बिन्दुमयायां
            [text-clause] बिन्दुमयम्
           *[standalone]
                { $gender ->
                    [f] बिन्दुमया
                    [n] बिन्दुमयम्
                   *[m] बिन्दुमयः
                }
        }

# Instrumental plurals, because both places these are used put «सह» after them
# — «बिन्दुभिः सह», "with dots". Writing them in the nominative and inflecting
# them in the frame is not possible: the frame would have to know which stem
# each was, and the frame only ever sees a formatted string.
fill-style =
    .horizontal = क्षैतिजरेखाभिः
    .vertical = लम्बरेखाभिः
    .diagonal = कर्णरेखाभिः
    .backdiagonal = विपरीतकर्णरेखाभिः
    .dots = बिन्दुभिः
    .diamonds = समचतुर्भुजैः

noun =
    .line = रेखा
    .line-segment = रेखाखण्डः
    .ray = किरणः
    .vector = सदिशः
    .curve = वक्ररेखा
    .function = फलनम्
    .parabola = परवलयः
    .polyline = बहुरेखा
    .polygon = बहुभुजः
    .triangle = त्रिभुजः
    .rectangle = आयतम्
    .circle = वृत्तम्
    .region = प्रदेशः
    .point = बिन्दुः
    .square = चतुरस्रम्
    .diamond = समचतुर्भुजः
    .cross = गुणनचिह्नम्
    .plus = योगचिह्नम्

# «-भुजः» is a bahuvrīhi ending welded onto the count — "having 5 sides" — and
# it has one shape whatever number lands in front of it, so the weld is sound
# in the way the README's affix rule allows. समबहुभुजः is masculine, and the
# adjectives precede it, so there is no tail.
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] { $numSides }-भुजः समबहुभुजः
    }

# Besides the nouns above, `$noun` may be «regular-polygon» (समबहुभुजः, m) or
# the head of a phrase the description does not name: «border» (सीमा, f),
# «fill» (पूरणम्, n), «text» (पाठ्यम्, n), «background» (पृष्ठभूमिः, f).
noun-gender =
    { $noun ->
        [line] f
        [curve] f
        [polyline] f
        [border] f
        [background] f
        [function] n
        [rectangle] n
        [circle] n
        [square] n
        [cross] n
        [plus] n
        [fill] n
        [text] n
       *[other] m
    }


## Style composition

# Adjectives precede the noun, and are written apart from it rather than
# compounded, so that nothing has to be sandhied against a word this catalog
# has not seen.
style-stroke =
    { $parts ->
        [width-style-color] { $width } { $lineStyle } { $color }
        [width-color] { $width } { $color }
        [style-color] { $lineStyle } { $color }
        [width-style] { $width } { $lineStyle }
        [width] { $width }
        [style] { $lineStyle }
       *[color] { $color }
    }

style-with-noun =
    { $parts ->
        [noun-tail] { $description } { $noun } { $nounTail }
       *[noun] { $description } { $noun }
    }

# Said only of the shape itself, so it agrees with `$gender` and takes no
# `$role` branch.
style-filled-word =
    { $gender ->
        [f] पूरिता
        [n] पूरितम्
       *[m] पूरितः
    }

# «सह» governs the instrumental and follows what it governs, which is why the
# pattern comes first here where English appends it.
style-filled =
    { $parts ->
        [pattern] { $pattern } सह { $filled } { $color }
       *[plain] { $filled } { $color }
    }

style-filled-with-noun =
    { $parts ->
        [pattern] { $pattern } सह { $filled } { $color } { $noun }
        [plain-tail] { $filled } { $color } { $noun } { $nounTail }
        [pattern-tail] { $pattern } सह { $filled } { $color } { $noun } { $nounTail }
       *[plain] { $filled } { $color } { $noun }
    }

# «सीमया सह» is instrumental, which is the case `border-clause` supplies. «तथा»
# rather than «च» for the `and` branches: «च» is enclitic and would have to
# stand after the phrase it joins, where a placeable already sits. Sanskrit has
# no article, so the two `-article` branches read like their neighbours.
style-border-clause =
    { $parts ->
        [with-article] { $border } सीमया सह
        [and] तथा { $border } सीमया सह
        [and-article] तथा { $border } सीमया सह
       *[with] { $border } सीमया सह
    }

# The colour arrives agreeing with «पूरणम्», which is neuter, so the noun has
# to stand beside it: «नीलम्» alone would be read as agreeing with whatever the
# reader last saw.
style-fill =
    { $parts ->
        [pattern] { $pattern } सह { $color } पूरणम्
       *[plain] { $color } पूरणम्
    }

# Nothing is passed to agree this with, so it is fixed in the neuter.
style-unfilled = अपूरितम्

# The background's colour is locative — «नीलायां पृष्ठभूमौ», on a blue
# background — and the text's own colour, which follows, is nominative neuter
# agreeing with «पाठ्यम्». Both words on the right of the placeable are this
# catalog's, so the sandhi in «नीलायां पृष्ठभूमौ» is safe to write out.
style-text =
    { $parts ->
        [background] { $background } पृष्ठभूमौ { $color }
       *[plain] { $color }
    }

style-background-none = किमपि न


## Boolean words

boolean-true = सत्यम्
boolean-false = असत्यम्


## Answer buttons

answer-submit-label = परीक्ष्यताम्
answer-submit-label-no-correctness = उत्तरं प्रेष्यताम्


## Sectional blocks

section-name =
    .activity = क्रिया
    .aside = पार्श्वटिप्पणी
    .cascade = परम्परा
    .definition = परिभाषा
    .example = उदाहरणम्
    .exercise = अभ्यासः
    .exercises = अभ्यासाः
    .given-answer = उत्तरम्
    .note = टिप्पणी
    .objectives = उद्देश्यानि
    .paragraphs = अनुच्छेदाः
    .part = भागः
    .problem = समस्या
    .problems = समस्याः
    .proof = उपपत्तिः
    .question = प्रश्नः
    .section = अध्यायः
    .solution = समाधानम्
    .task = कार्यम्
    .theorem = प्रमेयम्

section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }

hint-title = सङ्केतः


## Tables and figures

table-name =
    { $parts ->
        [numbered] सारणी { $enumeration }
        [numbered-title] सारणी { $enumeration }{ ": " }
        [unnumbered-title] सारणी{ ": " }
       *[unnumbered] सारणी
    }

figure-name =
    { $parts ->
        [numbered] चित्रम् { $enumeration }
        [numbered-caption] चित्रम् { $enumeration }{ ": " }
        [unnumbered-caption] चित्रम्{ ": " }
       *[unnumbered] चित्रम्
    }


## Paginator controls

paginator-previous = पूर्वम्
paginator-next = अग्रिमम्
paginator-page = पृष्ठम्

# «X-मध्ये Y» — "Y among X" — puts the total first, so the two counts change
# places. The ablative-sense «-मध्ये» is welded to a placeable and has one
# shape whatever precedes it.
paginator-page-status = { $numPages }-मध्ये { $pageLabel } { $currentPage }


## Piecewise functions

piecewise-condition-or = अथवा

piecewise-condition-if = यदि

piecewise-condition-otherwise = अन्यथा


## Chemistry
##
## `element-name` and `element-anion-name` are deliberately absent, so all 130
## keys fall back to English and `lint:i18n` reports the gap.
##
## Sanskrit has words for the substances known to it — «लोहम्» iron, «ताम्रम्»
## copper, «रजतम्» silver, «स्वर्णम्» gold, «पारदः» mercury, «सीसम्» lead,
## «वङ्गम्» tin, «गन्धकः» sulfur — and the rasaśāstra literature names a few
## more. It has no list of all 118, and no school system teaches secondary
## chemistry in it out of which one could be read. Coining the remaining
## hundred-odd would be an invention rather than a translation, and it would be
## an invention in the one language whose vocabulary readers most expect to
## have been checked. So the table is left to English, which is what a student
## reading Sanskrit meets in their chemistry class anyway.

ion-name-oxidation-state = { $name } ({ $numeral })

chemistry-invalid-symbol = अमान्यं रासायनिकं चिह्नम्
chemistry-invalid-ionic-compound = अमान्यम् आयनिकं यौगिकम्
