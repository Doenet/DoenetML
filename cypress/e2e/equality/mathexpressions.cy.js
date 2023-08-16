import { cesc } from "../../../src/utils/url";

describe("Math expressions equality tests", function () {
    beforeEach(() => {
        cy.clearIndexedDB();
        cy.visit("/src/Tools/cypressTest/");
    });

    it("equivalences", () => {
        let equivalences = [
            {
                expr1: "sin^(-1)(x)",
                expr2: "arcsin(x)",
                equal: true,
                symbolicEqual: true,
                symbolicSimplifyEqual: true,
                symbolicSimplifyExpandEqual: true,
            },
            {
                expr1: "sin^(-1)(x)",
                expr2: "asin(x)",
                equal: true,
                symbolicEqual: true,
                symbolicSimplifyEqual: true,
                symbolicSimplifyExpandEqual: true,
            },
            {
                expr1: "sin^(-1)(1)",
                expr2: "pi/2",
                equal: true,
                symbolicEqual: false,
                symbolicSimplifyEqual: true,
                symbolicSimplifyExpandEqual: true,
            },
            {
                expr1: "cos^(-1)(x)",
                expr2: "arccos(x)",
                equal: true,
                symbolicEqual: true,
                symbolicSimplifyEqual: true,
                symbolicSimplifyExpandEqual: true,
            },
            {
                expr1: "cos^(-1)(x)",
                expr2: "acos(x)",
                equal: true,
                symbolicEqual: true,
                symbolicSimplifyEqual: true,
                symbolicSimplifyExpandEqual: true,
            },
            {
                expr1: "cos^(-1)(1)",
                expr2: "0",
                equal: true,
                symbolicEqual: false,
                symbolicSimplifyEqual: true,
                symbolicSimplifyExpandEqual: true,
            },
            {
                expr1: "tan^(-1)(x)",
                expr2: "arctan(x)",
                equal: true,
                symbolicEqual: true,
                symbolicSimplifyEqual: true,
                symbolicSimplifyExpandEqual: true,
            },
            {
                expr1: "tan^(-1)(x)",
                expr2: "atan(x)",
                equal: true,
                symbolicEqual: true,
                symbolicSimplifyEqual: true,
                symbolicSimplifyExpandEqual: true,
            },
            {
                expr1: "tan^(-1)(1)",
                expr2: "pi/4",
                equal: true,
                symbolicEqual: false,
                symbolicSimplifyEqual: true,
                symbolicSimplifyExpandEqual: true,
            },

            {
                expr1: "sin^(-1)(x)",
                expr2: "sin(x)^(-1)",
                equal: false,
                symbolicEqual: false,
                symbolicSimplifyEqual: false,
                symbolicSimplifyExpandEqual: false,
            },
            {
                expr1: "cos^(-1)(x)",
                expr2: "cos(x)^(-1)",
                equal: false,
                symbolicEqual: false,
                symbolicSimplifyEqual: false,
                symbolicSimplifyExpandEqual: false,
            },
            {
                expr1: "tan^(-1)(x)",
                expr2: "tan(x)^(-1)",
                equal: false,
                symbolicEqual: false,
                symbolicSimplifyEqual: false,
                symbolicSimplifyExpandEqual: false,
            },

            {
                expr1: "sin^2(x)",
                expr2: "sin(x)^2",
                equal: true,
                symbolicEqual: true,
                symbolicSimplifyEqual: true,
                symbolicSimplifyExpandEqual: true,
            },
            {
                expr1: "sin^n(x)",
                expr2: "sin(x)^n",
                equal: true,
                symbolicEqual: true,
                symbolicSimplifyEqual: true,
                symbolicSimplifyExpandEqual: true,
            },
            {
                expr1: "cos^2(x)",
                expr2: "cos(x)^2",
                equal: true,
                symbolicEqual: true,
                symbolicSimplifyEqual: true,
                symbolicSimplifyExpandEqual: true,
            },
            {
                expr1: "cos^n(x)",
                expr2: "cos(x)^n",
                equal: true,
                symbolicEqual: true,
                symbolicSimplifyEqual: true,
                symbolicSimplifyExpandEqual: true,
            },
            {
                expr1: "tan^2(x)",
                expr2: "tan(x)^2",
                equal: true,
                symbolicEqual: true,
                symbolicSimplifyEqual: true,
                symbolicSimplifyExpandEqual: true,
            },
            {
                expr1: "tan^n(x)",
                expr2: "tan(x)^n",
                equal: true,
                symbolicEqual: true,
                symbolicSimplifyEqual: true,
                symbolicSimplifyExpandEqual: true,
            },
            {
                expr1: "cos^2(x)",
                expr2: "cos(x)^2",
                equal: true,
                symbolicEqual: true,
                symbolicSimplifyEqual: true,
                symbolicSimplifyExpandEqual: true,
            },
            {
                expr1: "cos^n(x)",
                expr2: "cos(x)^n",
                equal: true,
                symbolicEqual: true,
                symbolicSimplifyEqual: true,
                symbolicSimplifyExpandEqual: true,
            },
            {
                expr1: "sec^2(x)",
                expr2: "sec(x)^2",
                equal: true,
                symbolicEqual: true,
                symbolicSimplifyEqual: true,
                symbolicSimplifyExpandEqual: true,
            },
            {
                expr1: "sec^n(x)",
                expr2: "sec(x)^n",
                equal: true,
                symbolicEqual: true,
                symbolicSimplifyEqual: true,
                symbolicSimplifyExpandEqual: true,
            },
            {
                expr1: "cot^2(x)",
                expr2: "cot(x)^2",
                equal: true,
                symbolicEqual: true,
                symbolicSimplifyEqual: true,
                symbolicSimplifyExpandEqual: true,
            },
            {
                expr1: "cot^n(x)",
                expr2: "cot(x)^n",
                equal: true,
                symbolicEqual: true,
                symbolicSimplifyEqual: true,
                symbolicSimplifyExpandEqual: true,
            },

            {
                expr1: "log^2(x)",
                expr2: "log(x)^2",
                equal: false,
                symbolicEqual: false,
                symbolicSimplifyEqual: false,
                symbolicSimplifyExpandEqual: false,
            },
            {
                expr1: "log^n(x)",
                expr2: "log(x)^n",
                equal: false,
                symbolicEqual: false,
                symbolicSimplifyEqual: false,
                symbolicSimplifyExpandEqual: false,
            },
            {
                expr1: "ln^2(x)",
                expr2: "ln(x)^2",
                equal: false,
                symbolicEqual: false,
                symbolicSimplifyEqual: false,
                symbolicSimplifyExpandEqual: false,
            },
            {
                expr1: "ln^n(x)",
                expr2: "ln(x)^n",
                equal: false,
                symbolicEqual: false,
                symbolicSimplifyEqual: false,
                symbolicSimplifyExpandEqual: false,
            },
            {
                expr1: "f^2(x)",
                expr2: "f(x)^2",
                equal: false,
                symbolicEqual: false,
                symbolicSimplifyEqual: false,
                symbolicSimplifyExpandEqual: false,
            },
            {
                expr1: "f^n(x)",
                expr2: "f(x)^n",
                equal: false,
                symbolicEqual: false,
                symbolicSimplifyEqual: false,
                symbolicSimplifyExpandEqual: false,
            },
            {
                expr1: "log(e^3)",
                expr2: "3",
                equal: true,
                symbolicEqual: false,
                symbolicSimplifyEqual: true,
                symbolicSimplifyExpandEqual: true,
            },
            {
                expr1: "ln(e^3)",
                expr2: "3",
                equal: true,
                symbolicEqual: false,
                symbolicSimplifyEqual: true,
                symbolicSimplifyExpandEqual: true,
            },
            {
                expr1: "log10(10^3)",
                expr2: "3",
                equal: true,
                symbolicEqual: false,
                symbolicSimplifyEqual: true,
                symbolicSimplifyExpandEqual: true,
            },
            {
                expr1: "log_10(10^3)",
                expr2: "3",
                equal: true,
                symbolicEqual: false,
                symbolicSimplifyEqual: true,
                symbolicSimplifyExpandEqual: true,
            },
            {
                expr1: "log_2(2^3)",
                expr2: "3",
                equal: true,
                symbolicEqual: false,
                symbolicSimplifyEqual: true,
                symbolicSimplifyExpandEqual: true,
            },
            {
                expr1: "log_7(7^3)",
                expr2: "3",
                equal: true,
                symbolicEqual: false,
                symbolicSimplifyEqual: true,
                symbolicSimplifyExpandEqual: true,
            },
            {
                expr1: "log_b(a)",
                expr2: "log(a)/log(b)",
                equal: true,
                symbolicEqual: false,
                symbolicSimplifyEqual: false, // with improved simplication, these should compare as true
                symbolicSimplifyExpandEqual: false, // with improved simplication, these should compare as true
            },
            {
                expr1: "nCr(5,3)",
                expr2: "10",
                equal: true,
                symbolicEqual: false,
                symbolicSimplifyEqual: true,
                symbolicSimplifyExpandEqual: true,
            },
            {
                expr1: "nPr(5,3)",
                expr2: "60",
                equal: true,
                symbolicEqual: false,
                symbolicSimplifyEqual: true,
                symbolicSimplifyExpandEqual: true,
            },
            {
                expr1: "binom(5,3)",
                expr2: "10",
                equal: true,
                symbolicEqual: false,
                symbolicSimplifyEqual: true,
                symbolicSimplifyExpandEqual: true,
            },
            {
                expr1: "binom(m,n)",
                expr2: "nCr(m,n)",
                equal: true,
                symbolicEqual: true,
                symbolicSimplifyEqual: true,
                symbolicSimplifyExpandEqual: true,
            },
            {
                expr1: '<math format="latex">\\langle a,b\\rangle</math>',
                expr2: "(a,b)",
                equal: true,
                symbolicEqual: true,
                symbolicSimplifyEqual: true,
                symbolicSimplifyExpandEqual: true,
            },
            {
                expr1: '<math format="latex">\\langle a,b\\rangle</math>',
                expr2: "<math createVectors>(a,b)</math>",
                equal: true,
                symbolicEqual: true,
                symbolicSimplifyEqual: true,
                symbolicSimplifyExpandEqual: true,
            },
            {
                expr1: "(a,b)",
                expr2: "<math createVectors>(a,b)</math>",
                equal: true,
                symbolicEqual: true,
                symbolicSimplifyEqual: true,
                symbolicSimplifyExpandEqual: true,
            },
            {
                expr1: 'c <math format="latex">\\langle a,b\\rangle</math>',
                expr2: "(ac,bc)",
                equal: true,
                symbolicEqual: false,
                symbolicSimplifyEqual: true,
                symbolicSimplifyExpandEqual: true,
            },
            {
                expr1: '<math format="latex">\\langle ac,bc\\rangle</math>',
                expr2: "<math createVectors>c(a,b)</math>",
                equal: true,
                symbolicEqual: false,
                symbolicSimplifyEqual: true,
                symbolicSimplifyExpandEqual: true,
            },
            {
                expr1: "c(a,b)",
                expr2: "<math createVectors>(ac,bc)</math>",
                equal: true,
                symbolicEqual: false,
                symbolicSimplifyEqual: true,
                symbolicSimplifyExpandEqual: true,
            },
            {
                expr1: '<math format="latex">\\langle a,b\\rangle</math> + <math createVectors>(c,d)</math>',
                expr2: "(a+c,b+d)",
                equal: true,
                symbolicEqual: false,
                symbolicSimplifyEqual: true,
                symbolicSimplifyExpandEqual: true,
            },
            {
                expr1: '<math format="latex">\\langle a+c,b+d\\rangle</math>',
                expr2: "<math createVectors>(a,b)</math> + (c,d)",
                equal: true,
                symbolicEqual: false,
                symbolicSimplifyEqual: true,
                symbolicSimplifyExpandEqual: true,
            },
            {
                expr1: '<math format="latex">\\langle a,b\\rangle</math> + (c,d)',
                expr2: "<math createVectors>(a+c,b+d)</math>",
                equal: true,
                symbolicEqual: false,
                symbolicSimplifyEqual: true,
                symbolicSimplifyExpandEqual: true,
            },
            {
                expr1: '<math format="latex">\\langle a,b\\rangle</math>',
                expr2: "<math createIntervals>(a,b)</math>",
                equal: false,
                symbolicEqual: false,
                symbolicSimplifyEqual: false,
                symbolicSimplifyExpandEqual: false,
            },
            {
                expr1: "<math createVectors>(a,b)</math>",
                expr2: "<math createIntervals>(a,b)</math>",
                equal: false,
                symbolicEqual: false,
                symbolicSimplifyEqual: false,
                symbolicSimplifyExpandEqual: false,
            },

            {
                expr1: "angle ABC",
                expr2: "angle CBA",
                equal: true,
                symbolicEqual: true,
                symbolicSimplifyEqual: true,
                symbolicSimplifyExpandEqual: true,
            },
            {
                expr1: "angle(A,B,C)",
                expr2: "angle(C,B,A)",
                equal: true,
                symbolicEqual: true,
                symbolicSimplifyEqual: true,
                symbolicSimplifyExpandEqual: true,
            },
            {
                expr1: "angle A'B'C'",
                expr2: "angle C'B'A'",
                equal: true,
                symbolicEqual: true,
                symbolicSimplifyEqual: true,
                symbolicSimplifyExpandEqual: true,
            },
            {
                expr1: "angle ABC",
                expr2: "angle(A,B,C)",
                equal: true,
                symbolicEqual: true,
                symbolicSimplifyEqual: true,
                symbolicSimplifyExpandEqual: true,
            },
            {
                expr1: "<math>angle ABC</math>",
                expr2: "<math>angle(A,B,C)</math>",
                equal: true,
                symbolicEqual: true,
                symbolicSimplifyEqual: true,
                symbolicSimplifyExpandEqual: true,
            },
            {
                expr1: "angle A'B'C'",
                expr2: "angle(A',B',C')",
                equal: true,
                symbolicEqual: true,
                symbolicSimplifyEqual: true,
                symbolicSimplifyExpandEqual: true,
            },
            {
                expr1: "angle A B C",
                expr2: "angle(A,B,C)",
                equal: true,
                symbolicEqual: true,
                symbolicSimplifyEqual: true,
                symbolicSimplifyExpandEqual: true,
            },

            {
                expr1: "angle ABC",
                expr2: "angle ACB",
                equal: false,
                symbolicEqual: false,
                symbolicSimplifyEqual: false,
                symbolicSimplifyExpandEqual: false,
            },
            {
                expr1: "angle ABC",
                expr2: "angle A'B'C'",
                equal: false,
                symbolicEqual: false,
                symbolicSimplifyEqual: false,
                symbolicSimplifyExpandEqual: false,
            },
            {
                expr1: "angle(A,B,C)",
                expr2: "angle (A,C,B)",
                equal: false,
                symbolicEqual: false,
                symbolicSimplifyEqual: false,
                symbolicSimplifyExpandEqual: false,
            },
            {
                expr1: "angle(A,B,C)",
                expr2: "angle (A',B',C')",
                equal: false,
                symbolicEqual: false,
                symbolicSimplifyEqual: false,
                symbolicSimplifyExpandEqual: false,
            },

            {
                expr1: "90 deg",
                expr2: "pi/2",
                equal: true,
                symbolicEqual: false,
                symbolicSimplifyEqual: false,
                symbolicSimplifyExpandEqual: false,
            },
            {
                expr1: "50%",
                expr2: "0.5",
                equal: true,
                symbolicEqual: false,
                symbolicSimplifyEqual: false,
                symbolicSimplifyExpandEqual: false,
            },
            {
                expr1: "$5",
                expr2: "$3+$2",
                equal: true,
                symbolicEqual: false,
                symbolicSimplifyEqual: true,
                symbolicSimplifyExpandEqual: true,
            },
            {
                expr1: "90 deg",
                expr2: "360 deg - 270 deg",
                equal: true,
                symbolicEqual: false,
                symbolicSimplifyEqual: true,
                symbolicSimplifyExpandEqual: true,
            },
            {
                expr1: "250%",
                expr2: "50% * 5",
                equal: true,
                symbolicEqual: false,
                symbolicSimplifyEqual: true,
                symbolicSimplifyExpandEqual: true,
            },
            {
                expr1: "$3",
                expr2: "$12 / 4",
                equal: true,
                symbolicEqual: false,
                symbolicSimplifyEqual: true,
                symbolicSimplifyExpandEqual: true,
            },
            {
                expr1: "sin(45 deg)",
                expr2: "1/sqrt(2)",
                equal: true,
                symbolicEqual: false,
                symbolicSimplifyEqual: false,
                symbolicSimplifyExpandEqual: false,
            },
            {
                expr1: "x%",
                expr2: "x/100",
                equal: true,
                symbolicEqual: false,
                symbolicSimplifyEqual: false,
                symbolicSimplifyExpandEqual: false,
            },
            {
                expr1: "x deg",
                expr2: "pi x/180",
                equal: true,
                symbolicEqual: false,
                symbolicSimplifyEqual: false,
                symbolicSimplifyExpandEqual: false,
            },
            {
                expr1: "(3x)%",
                expr2: "x% 3",
                equal: true,
                symbolicEqual: false,
                symbolicSimplifyEqual: true,
                symbolicSimplifyExpandEqual: true,
            },

            {
                expr1: "90 deg",
                expr2: "90",
                equal: false,
                symbolicEqual: false,
                symbolicSimplifyEqual: false,
                symbolicSimplifyExpandEqual: false,
            },
            {
                expr1: "50%",
                expr2: "50",
                equal: false,
                symbolicEqual: false,
                symbolicSimplifyEqual: false,
                symbolicSimplifyExpandEqual: false,
            },
            {
                expr1: "360 deg",
                expr2: "0 deg",
                equal: false,
                symbolicEqual: false,
                symbolicSimplifyEqual: false,
                symbolicSimplifyExpandEqual: false,
            },
            {
                expr1: "$5",
                expr2: "5",
                equal: false,
                symbolicEqual: false,
                symbolicSimplifyEqual: false,
                symbolicSimplifyExpandEqual: false,
            },

            {
                expr1: "int f(x) dx",
                expr2: "int dx f(x)",
                equal: true,
                symbolicEqual: true,
                symbolicSimplifyEqual: true,
                symbolicSimplifyExpandEqual: true,
            },
            {
                expr1: "<math>int f(x) dx</math>",
                expr2: "<math>int dx f(x)</math>",
                equal: true,
                symbolicEqual: true,
                symbolicSimplifyEqual: true,
                symbolicSimplifyExpandEqual: true,
            },
            {
                expr1: "int f(x) dx",
                expr2: "<math>int dx f(x)</math>",
                equal: true,
                symbolicEqual: true,
                symbolicSimplifyEqual: true,
                symbolicSimplifyExpandEqual: true,
            },
            {
                expr1: "<math>int f(x) dx</math>",
                expr2: "int dx f(x)",
                equal: true,
                symbolicEqual: true,
                symbolicSimplifyEqual: true,
                symbolicSimplifyExpandEqual: true,
            },
            {
                expr1: "int f(x,y) dxdy",
                expr2: "int dxdy f(x,y)",
                equal: true,
                symbolicEqual: true,
                symbolicSimplifyEqual: true,
                symbolicSimplifyExpandEqual: true,
            },
            {
                expr1: "<math>int f(x,y) dxdy</math>",
                expr2: "<math>int dxdy f(x,y)</math>",
                equal: true,
                symbolicEqual: true,
                symbolicSimplifyEqual: true,
                symbolicSimplifyExpandEqual: true,
            },
            {
                expr1: "int f(x,y) dxdy",
                expr2: "<math>int dxdy f(x,y)</math>",
                equal: true,
                symbolicEqual: true,
                symbolicSimplifyEqual: true,
                symbolicSimplifyExpandEqual: true,
            },
            {
                expr1: "<math>int f(x,y) dxdy</math>",
                expr2: "int dxdy f(x,y)",
                equal: true,
                symbolicEqual: true,
                symbolicSimplifyEqual: true,
                symbolicSimplifyExpandEqual: true,
            },
            {
                expr1: "int (x*x + x + x - x^2/3) dx",
                expr2: "int (2x^2/3 + 2x) dx",
                equal: true,
                symbolicEqual: false,
                symbolicSimplifyEqual: true,
                symbolicSimplifyExpandEqual: true,
            },
            {
                expr1: "int_a^b f(x) dx",
                expr2: "int_a^b dx f(x)",
                equal: true,
                symbolicEqual: true,
                symbolicSimplifyEqual: true,
                symbolicSimplifyExpandEqual: true,
            },
            {
                expr1: "<math>int_a^b f(x) dx</math>",
                expr2: "<math>int_a^b dx f(x)</math>",
                equal: true,
                symbolicEqual: true,
                symbolicSimplifyEqual: true,
                symbolicSimplifyExpandEqual: true,
            },
            {
                expr1: "int_a^b f(x) dx",
                expr2: "<math>int_a^b dx f(x)</math>",
                equal: true,
                symbolicEqual: true,
                symbolicSimplifyEqual: true,
                symbolicSimplifyExpandEqual: true,
            },
            {
                expr1: "<math>int_a^b f(x) dx</math>",
                expr2: "int_a^b dx f(x)",
                equal: true,
                symbolicEqual: true,
                symbolicSimplifyEqual: true,
                symbolicSimplifyExpandEqual: true,
            },
            {
                expr1: "int_a f(x) dx",
                expr2: "int_a dx f(x)",
                equal: true,
                symbolicEqual: true,
                symbolicSimplifyEqual: true,
                symbolicSimplifyExpandEqual: true,
            },
            {
                expr1: "<math>int_a f(x) dx</math>",
                expr2: "<math>int_a dx f(x)</math>",
                equal: true,
                symbolicEqual: true,
                symbolicSimplifyEqual: true,
                symbolicSimplifyExpandEqual: true,
            },
            {
                expr1: "int_a f(x) dx",
                expr2: "<math>int_a dx f(x)</math>",
                equal: true,
                symbolicEqual: true,
                symbolicSimplifyEqual: true,
                symbolicSimplifyExpandEqual: true,
            },
            {
                expr1: "<math>int_a f(x) dx</math>",
                expr2: "int_a dx f(x)",
                equal: true,
                symbolicEqual: true,
                symbolicSimplifyEqual: true,
                symbolicSimplifyExpandEqual: true,
            },
            {
                expr1: "int_(a+a)^(b*b) x*x*x dx",
                expr2: "int_(2a)^(b^2) x^3dx",
                equal: true,
                symbolicEqual: false,
                symbolicSimplifyEqual: true,
                symbolicSimplifyExpandEqual: true,
            },

            {
                expr1: "int f(x) dx",
                expr2: "int_a^b f(x) dx",
                equal: false,
                symbolicEqual: false,
                symbolicSimplifyEqual: false,
                symbolicSimplifyExpandEqual: false,
            },
            {
                expr1: "int x^2 dx",
                expr2: "int x^3 dx",
                equal: false,
                symbolicEqual: false,
                symbolicSimplifyEqual: false,
                symbolicSimplifyExpandEqual: false,
            },
            {
                expr1: "int_a^b f(x) dx",
                expr2: "int_c^d f(x) dx",
                equal: false,
                symbolicEqual: false,
                symbolicSimplifyEqual: false,
                symbolicSimplifyExpandEqual: false,
            },
            {
                expr1: "int_a^b x^2 dx",
                expr2: "int_a^b x^3 dx",
                equal: false,
                symbolicEqual: false,
                symbolicSimplifyEqual: false,
                symbolicSimplifyExpandEqual: false,
            },

            {
                expr1: "vec(x)",
                expr2: "vec x",
                equal: true,
                symbolicEqual: true,
                symbolicSimplifyEqual: true,
                symbolicSimplifyExpandEqual: true,
            },
            {
                expr1: "vec(x) + vec(x)",
                expr2: "2vec(x)",
                equal: true,
                symbolicEqual: false,
                symbolicSimplifyEqual: true,
                symbolicSimplifyExpandEqual: true,
            },
            {
                expr1: "vec(x)*vec(x)vec(y)/(vec(x)*vec(x))",
                expr2: "vec(y)",
                equal: true,
                symbolicEqual: false,
                symbolicSimplifyEqual: false, // with improved simplication, these should compare as true
                symbolicSimplifyExpandEqual: false, // with improved simplication, these should compare as true
            },

            {
                expr1: "vec(x)",
                expr2: "x",
                equal: false,
                symbolicEqual: false,
                symbolicSimplifyEqual: false,
                symbolicSimplifyExpandEqual: false,
            },
            {
                expr1: "vec(xy)",
                expr2: "vec(x)vec(y)",
                equal: false,
                symbolicEqual: false,
                symbolicSimplifyEqual: false,
                symbolicSimplifyExpandEqual: false,
            },
            {
                expr1: "vec(2x)",
                expr2: "2vec(x)",
                equal: false,
                symbolicEqual: false,
                symbolicSimplifyEqual: false,
                symbolicSimplifyExpandEqual: false,
            },
            {
                expr1: "linesegment(A,B)",
                expr2: "linesegment(B,A)",
                equal: true,
                symbolicEqual: true,
                symbolicSimplifyEqual: true,
                symbolicSimplifyExpandEqual: true,
            },
            {
                expr1: "<math>exists x elementof A union B</math>",
                expr2: "<math>exists x elementof B union A</math>",
                equal: true,
                symbolicEqual: false,
                symbolicSimplifyEqual: true,
                symbolicSimplifyExpandEqual: true,
            },
            {
                expr1: '<math format="latex">\\exists x \\in A \\cup B</math>',
                expr2: '<math format="latex">\\exists x \\in B \\cup A</math>',
                equal: true,
                symbolicEqual: false,
                symbolicSimplifyEqual: true,
                symbolicSimplifyExpandEqual: true,
            },
            {
                expr1: "<math>forall x elementof A intersect B</math>",
                expr2: "<math>forall x elementof B intersect A</math>",
                equal: true,
                symbolicEqual: false,
                symbolicSimplifyEqual: true,
                symbolicSimplifyExpandEqual: true,
            },
            {
                expr1: '<math format="latex">\\forall x \\in A \\cap B</math>',
                expr2: '<math format="latex">\\forall x \\in B \\cap A</math>',
                equal: true,
                symbolicEqual: false,
                symbolicSimplifyEqual: true,
                symbolicSimplifyExpandEqual: true,
            },
            {
                expr1: "e^(10x)",
                expr2: "e^(10x)+C",
                equal: false,
                symbolicEqual: false,
                symbolicSimplifyEqual: false,
                symbolicSimplifyExpandEqual: false,
            },
            {
                expr1: "e^(10x)",
                expr2: "e^(10x)+0.00000001",
                equal: false,
                symbolicEqual: false,
                symbolicSimplifyEqual: false,
                symbolicSimplifyExpandEqual: false,
            },
            {
                expr1: "(e^(10x),1)",
                expr2: "(e^(10x)+C,1)",
                equal: false,
                symbolicEqual: false,
                symbolicSimplifyEqual: false,
                symbolicSimplifyExpandEqual: false,
            },
            {
                expr1: "(e^(10x),1)",
                expr2: "(e^(10x)+0.00000001,1)",
                equal: false,
                symbolicEqual: false,
                symbolicSimplifyEqual: false,
                symbolicSimplifyExpandEqual: false,
            },
            {
                expr1: "e^(10x)=0",
                expr2: "e^(10x)+C=0",
                equal: false,
                symbolicEqual: false,
                symbolicSimplifyEqual: false,
                symbolicSimplifyExpandEqual: false,
            },
            {
                expr1: "e^(10x)=0",
                expr2: "e^(10x)+0.00000001=0",
                equal: false,
                symbolicEqual: false,
                symbolicSimplifyEqual: false,
                symbolicSimplifyExpandEqual: false,
            },
        ];

        let doenetML = "<text>a</text>";

        for (let [ind, info] of equivalences.entries()) {
            doenetML += `\n<boolean name="n${ind}">${info.expr1} = ${info.expr2}</boolean>`;
            doenetML += `\n<boolean name="s${ind}" symbolicEquality>${info.expr1} = ${info.expr2}</boolean>`;
            doenetML += `\n<boolean name="ss${ind}" symbolicEquality simplifyOnCompare>${info.expr1} = ${info.expr2}</boolean>`;
            doenetML += `\n<boolean name="sse${ind}" symbolicEquality simplifyOnCompare expandOnCompare>${info.expr1} = ${info.expr2}</boolean>`;
        }

        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML,
                },
                "*"
            );
        });

        cy.get(cesc("#\\/_text1")).should("contain.text", "a");

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();

            for (let [ind, info] of equivalences.entries()) {
                expect(
                    stateVariables[`/n${ind}`].stateValues.value,
                    `Comparing ${info.expr1} and ${info.expr2}`
                ).eq(info.equal);
                expect(
                    stateVariables[`/s${ind}`].stateValues.value,
                    `Comparing symbolic ${info.expr1} and ${info.expr2}`
                ).eq(info.symbolicEqual);
                expect(
                    stateVariables[`/ss${ind}`].stateValues.value,
                    `Comparing symbolic simplify ${info.expr1} and ${info.expr2}`
                ).eq(info.symbolicSimplifyEqual);
                expect(
                    stateVariables[`/sse${ind}`].stateValues.value,
                    `Comparing symbolic simplify expand ${info.expr1} and ${info.expr2}`
                ).eq(info.symbolicSimplifyExpandEqual);
            }
        });
    });
});
