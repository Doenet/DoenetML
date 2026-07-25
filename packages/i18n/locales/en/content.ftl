# Worker-generated content: style descriptions ("thick red line"), boolean
# words, and other prose the core computes into the document. Selected by
# `documentLocale`, which follows the content's language rather than the
# reader's UI language.
#
# Message ids are lower-kebab-case Fluent identifiers, optionally with a
# single `.attribute` suffix (`color.blue`, `noun.line-segment`).


## Style vocabulary
##
## The words the style pipeline derives from a component's numeric and
## enumerated style values. A word an author writes directly — `lineColorWord`,
## `markerStyleWord`, and their siblings — passes through untranslated: the
## author chose those words, and rewriting them would be a surprise. So does a
## CSS named color asked for by name ("rebeccapurple"), which
## `resolveColorWord` deliberately preserves.
##
## Every adjective here is handed `$gender`, the grammatical gender of the noun
## it describes (see `noun-gender`). English has no agreement and ignores it; a
## language that inflects selects on it.

# The canonical color families a color value resolves to.
color =
    .black = black
    .white = white
    .gray = gray
    .red = red
    .orange = orange
    .yellow = yellow
    .green = green
    .cyan = cyan
    .blue = blue
    .purple = purple
    .pink = pink
    .brown = brown

# Stroke widths. Only the extremes are named — a middling width is described by
# its color alone.
line-width =
    .thick = thick
    .thin = thin

# Dash patterns. A solid stroke is described by its color alone.
line-style =
    .dashed = dashed
    .dotted = dotted

# Patterns a shape's interior can be filled with. A solid fill is described by
# its color alone.
fill-style =
    .horizontal = horizontal lines
    .vertical = vertical lines
    .diagonal = diagonal lines
    .backdiagonal = reverse diagonal lines
    .dots = dots
    .diamonds = diamonds

# The things being described. The shapes a point can be drawn as ("square",
# "cross") are nouns too: a point's description names its marker shape rather
# than always saying "point".
noun =
    .line = line
    .line-segment = line segment
    .ray = ray
    .vector = vector
    .curve = curve
    .function = function
    .parabola = parabola
    .polyline = polyline
    .polygon = polygon
    .triangle = triangle
    .rectangle = rectangle
    .circle = circle
    .region = region
    .point = point
    .square = square
    .diamond = diamond
    .cross = cross
    .plus = plus

# A regular polygon names its side count, so it is a message of its own rather
# than one of `noun`'s attributes.
noun-regular-polygon = { $numSides }-sided regular polygon

# The grammatical gender of the noun being described, passed to every adjective
# describing it so that translations can agree. English has no grammatical
# gender, so every noun answers the same and the answer goes unused.
#
# `$noun` is one of `noun`'s attribute names, or the head of a phrase the
# description builds without naming it as a noun: `border`, `fill`, `text`, or
# `background`.
noun-gender = neuter


## Style composition
##
## `$parts` names which pieces the style actually supplies, so that a
## translation can order and inflect each combination on its own terms instead
## of substituting into a fixed English frame. An absent piece is a different
## branch, never an empty placeable.

# The adjectives describing a stroke: its width, its dash pattern, and its
# color. Also describes a shape's border, where the color is dropped when it
# matches the fill it surrounds.
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

# A style description followed by what it describes: "thick red line".
style-with-noun = { $description } { $noun }

# The word marking a shape as filled.
#
# A word of its own rather than literal text inside the messages below, because
# a language that inflects it has to agree it with the shape, and Fluent passes
# arguments to a message but not to a message it references.
style-filled-word = filled

# A filled shape, and the pattern its interior is drawn with, if any.
style-filled =
    { $parts ->
        [pattern] { $filled } { $color } with { $pattern }
       *[plain] { $filled } { $color }
    }

# The same, naming the shape: "filled blue circle with diamonds".
style-filled-with-noun =
    { $parts ->
        [pattern] { $filled } { $color } { $noun } with { $pattern }
       *[plain] { $filled } { $color } { $noun }
    }

# The border clause appended to a filled shape: "with a thick red border".
#
# `$parts` carries two distinctions English cares about: whether a fill pattern
# was already mentioned, which makes this a further clause ("and") rather than
# the first ("with"), and whether the surrounding description named the shape,
# which is where English wants an article.
style-border-clause =
    { $parts ->
        [with-article] with a { $border } border
        [and] and { $border } border
        [and-article] and a { $border } border
       *[with] with { $border } border
    }

# How a shape's interior is filled, on its own: "blue diamonds".
style-fill =
    { $parts ->
        [pattern] { $color } { $pattern }
       *[plain] { $color }
    }

style-unfilled = unfilled

# How a piece of text is styled: its color, and the background behind it.
style-text =
    { $parts ->
        [background] { $color } with a { $background } background
       *[plain] { $color }
    }

# What `backgroundColor` answers when nothing is drawn behind the text.
style-background-none = none
