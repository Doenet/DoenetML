# Portuguese content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Brazilian Portuguese, which is what a bare `pt` means: CLDR fills it in as
# `pt-Latn-BR`. European usage differs enough to be worth its own `pt-PT`
# catalog one day, and adding one would not disturb this — the split is by
# region, so `pt`, `pt-AO` and `pt-MZ` all keep reaching this file.
#
# Portuguese inflects. Adjectives follow their noun and agree with it in
# gender, so every adjective below selects on `$gender`, the gender of the noun
# it describes, and the composition messages put the noun first. Several
# adjectives are invariable — cinza, laranja, verde, azul, rosa, marrom — and
# answer the same for both.
#
# Portuguese does not inflect an attributive adjective for case, so `$role`
# goes unread here, exactly as it does in Spanish and English. Only German and
# Russian select on it.
#
# `borda` is feminine, where Spanish's `borde` is masculine — so the border's
# adjectives agree the other way round from the Spanish catalog, and the
# article in `style-border-clause` is `uma`.


## Vocabulário de estilos

color =
    .black =
        { $gender ->
            [f] preta
           *[m] preto
        }
    .white =
        { $gender ->
            [f] branca
           *[m] branco
        }
    .gray = cinza
    .red =
        { $gender ->
            [f] vermelha
           *[m] vermelho
        }
    .orange = laranja
    .yellow =
        { $gender ->
            [f] amarela
           *[m] amarelo
        }
    .green = verde
    .cyan = ciano
    .blue = azul
    .purple =
        { $gender ->
            [f] roxa
           *[m] roxo
        }
    .pink = rosa
    .brown = marrom

line-width =
    .thick =
        { $gender ->
            [f] grossa
           *[m] grosso
        }
    .thin =
        { $gender ->
            [f] fina
           *[m] fino
        }

line-style =
    .dashed =
        { $gender ->
            [f] tracejada
           *[m] tracejado
        }
    .dotted =
        { $gender ->
            [f] pontilhada
           *[m] pontilhado
        }

# Sintagmas nominais: vêm depois de «com» e não concordam com nada.
fill-style =
    .horizontal = linhas horizontais
    .vertical = linhas verticais
    .diagonal = linhas diagonais
    .backdiagonal = linhas diagonais invertidas
    .dots = pontos
    .diamonds = losangos

noun =
    .line = linha
    .line-segment = segmento
    .ray = semirreta
    .vector = vetor
    .curve = curva
    .function = função
    .parabola = parábola
    .polyline = polilinha
    .polygon = polígono
    .triangle = triângulo
    .rectangle = retângulo
    .circle = círculo
    .region = região
    .point = ponto
    .square = quadrado
    .diamond = losango
    .cross = cruz
    .plus = sinal de mais

# O nome divide-se: «polígono regular» leva os adjetivos e «de 5 lados» fecha o
# sintagma depois deles. Se o complemento viesse antes, os adjetivos ficariam
# separados do nome com que concordam.
noun-regular-polygon =
    { $part ->
        [tail] de { $numSides } lados
       *[head] polígono regular
    }

# Além dos nomes acima, `$noun` pode ser «regular-polygon» (polígono, m) ou o
# núcleo de um sintagma que a descrição não nomeia: «border» (borda, f),
# «fill» (preenchimento, m), «text» (texto, m), «background» (fundo, m).
noun-gender =
    { $noun ->
        [line] f
        [ray] f
        [curve] f
        [function] f
        [parabola] f
        [polyline] f
        [region] f
        [cross] f
        [border] f
       *[other] m
    }


## Composição de estilos

style-stroke =
    { $parts ->
        [width-style-color] { $lineStyle } { $width } { $color }
        [width-color] { $width } { $color }
        [style-color] { $lineStyle } { $color }
        [width-style] { $lineStyle } { $width }
        [width] { $width }
        [style] { $lineStyle }
       *[color] { $color }
    }

# O nome vai à frente e os adjetivos atrás: «linha tracejada grossa vermelha».
style-with-noun =
    { $parts ->
        [noun-tail] { $noun } { $description } { $nounTail }
       *[noun] { $noun } { $description }
    }

style-filled-word =
    { $gender ->
        [f] preenchida
       *[m] preenchido
    }

style-filled =
    { $parts ->
        [pattern] { $color } { $filled } com { $pattern }
       *[plain] { $color } { $filled }
    }

# O complemento fica junto ao nome, e não no fim: «polígono regular de 5 lados
# azul preenchido».
style-filled-with-noun =
    { $parts ->
        [pattern] { $noun } { $color } { $filled } com { $pattern }
        [plain-tail] { $noun } { $nounTail } { $color } { $filled }
        [pattern-tail] { $noun } { $nounTail } { $color } { $filled } com { $pattern }
       *[plain] { $noun } { $color } { $filled }
    }

# «borda» é feminino, portanto os adjetivos da borda concordam com ela e não
# com a figura que a rodeia — e o artigo é «uma».
style-border-clause =
    { $parts ->
        [with-article] com uma borda { $border }
        [and] e borda { $border }
        [and-article] e uma borda { $border }
       *[with] com borda { $border }
    }

# «de cor» evita ter de concordar a cor com um padrão no plural.
style-fill =
    { $parts ->
        [pattern] { $pattern } de cor { $color }
       *[plain] { $color }
    }

style-unfilled = sem preenchimento

style-text =
    { $parts ->
        [background] { $color } com um fundo { $background }
       *[plain] { $color }
    }

style-background-none = nenhum


## Palavras booleanas

boolean-true = verdadeiro
boolean-false = falso


## Botões de resposta

answer-submit-label = Verificar
answer-submit-label-no-correctness = Enviar resposta


## Blocos seccionais

section-name =
    .activity = Atividade
    .aside = Nota lateral
    .cascade = Cascata
    .definition = Definição
    .example = Exemplo
    .exercise = Exercício
    .exercises = Exercícios
    .given-answer = Resposta
    .note = Nota
    .objectives = Objetivos
    .paragraphs = Parágrafos
    .part = Parte
    .problem = Problema
    .problems = Problemas
    .proof = Demonstração
    .question = Pergunta
    .section = Seção
    .solution = Solução
    .task = Tarefa
    .theorem = Teorema

section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }

hint-title = Dica


## Tabelas e figuras

table-name =
    { $parts ->
        [numbered] Tabela { $enumeration }
        [numbered-title] Tabela { $enumeration }{ ": " }
        [unnumbered-title] Tabela{ ": " }
       *[unnumbered] Tabela
    }

figure-name =
    { $parts ->
        [numbered] Figura { $enumeration }
        [numbered-caption] Figura { $enumeration }{ ": " }
        [unnumbered-caption] Figura{ ": " }
       *[unnumbered] Figura
    }


## Controles do paginador

paginator-previous = Anterior
paginator-next = Próxima
paginator-page = Página

paginator-page-status = { $pageLabel } { $currentPage } de { $numPages }


## Funções definidas por partes

piecewise-condition-or = ou
piecewise-condition-if = se
piecewise-condition-otherwise = caso contrário


## Química

element-name =
    .h = Hidrogênio
    .he = Hélio
    .li = Lítio
    .be = Berílio
    .b = Boro
    .c = Carbono
    .n = Nitrogênio
    .o = Oxigênio
    .f = Flúor
    .ne = Neônio
    .na = Sódio
    .mg = Magnésio
    .al = Alumínio
    .si = Silício
    .p = Fósforo
    .s = Enxofre
    .cl = Cloro
    .ar = Argônio
    .k = Potássio
    .ca = Cálcio
    .sc = Escândio
    .ti = Titânio
    .v = Vanádio
    .cr = Cromo
    .mn = Manganês
    .fe = Ferro
    .co = Cobalto
    .ni = Níquel
    .cu = Cobre
    .zn = Zinco
    .ga = Gálio
    .ge = Germânio
    .as = Arsênio
    .se = Selênio
    .br = Bromo
    .kr = Criptônio
    .rb = Rubídio
    .sr = Estrôncio
    .y = Ítrio
    .zr = Zircônio
    .nb = Nióbio
    .mo = Molibdênio
    .tc = Tecnécio
    .ru = Rutênio
    .rh = Ródio
    .pd = Paládio
    .ag = Prata
    .cd = Cádmio
    .in = Índio
    .sn = Estanho
    .sb = Antimônio
    .te = Telúrio
    .i = Iodo
    .xe = Xenônio
    .cs = Césio
    .ba = Bário
    .la = Lantânio
    .ce = Cério
    .pr = Praseodímio
    .nd = Neodímio
    .pm = Promécio
    .sm = Samário
    .eu = Európio
    .gd = Gadolínio
    .tb = Térbio
    .dy = Disprósio
    .ho = Hólmio
    .er = Érbio
    .tm = Túlio
    .yb = Itérbio
    .lu = Lutécio
    .hf = Háfnio
    .ta = Tântalo
    .w = Tungstênio
    .re = Rênio
    .os = Ósmio
    .ir = Irídio
    .pt = Platina
    .au = Ouro
    .hg = Mercúrio
    .tl = Tálio
    .pb = Chumbo
    .bi = Bismuto
    .po = Polônio
    .at = Astato
    .rn = Radônio
    .fr = Frâncio
    .ra = Rádio
    .ac = Actínio
    .th = Tório
    .pa = Protactínio
    .u = Urânio
    .np = Netúnio
    .pu = Plutônio
    .am = Amerício
    .cm = Cúrio
    .bk = Berquélio
    .cf = Califórnio
    .es = Einstênio
    .fm = Férmio
    .md = Mendelévio
    .no = Nobélio
    .lr = Laurêncio
    .rf = Rutherfórdio
    .db = Dúbnio
    .sg = Seabórgio
    .bh = Bóhrio
    .hs = Hássio
    .mt = Meitnério
    .ds = Darmstácio
    .rg = Roentgênio
    .cn = Copernício
    .nh = Nihônio
    .fl = Fleróvio
    .mc = Moscóvio
    .lv = Livermório
    .ts = Tenesso
    .og = Oganessônio

element-anion-name =
    .h = Hidreto
    .c = Carbeto
    .n = Nitreto
    .o = Óxido
    .f = Fluoreto
    .p = Fosfeto
    .s = Sulfeto
    .cl = Cloreto
    .br = Brometo
    .i = Iodeto
    .at = Astateto
    .ts = Tenesseto

ion-name-oxidation-state = { $name } ({ $numeral })

chemistry-invalid-symbol = Símbolo químico inválido
chemistry-invalid-ionic-compound = Composto iônico inválido
