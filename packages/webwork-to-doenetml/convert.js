#!/usr/bin/env node

/**
 * Script to convert WebWork problems (written in Perl) to DoenetML
 * TODO: tables
 */

import fs from "node:fs";
import { pathToFileURL } from "node:url";

const tab = "  ";

export function convert(data) {
    // const sections = data.split(/#{4,}/);
    const documentMatch = data.match(/DOCUMENT\(\);(.*)ENDDOCUMENT\(\);/s);
    if (!documentMatch || documentMatch.length < 2) {
        console.warn(
            "Expected a 'DOCUMENT(); ... ENDDOCUMENT();' block, but none was found. Returning empty output."
        );
        return "";
    }
    let document = documentMatch[1];

    // Remove comments
    document = document.replace(/\#.*/g, "");

    let content = "";
    let contentType = null;

    const findText = document.match(/BEGIN_TEXT(.*)END_TEXT/s);
    if (findText) {
        content = findText[1].trim();
        contentType = "text";
        document = document.replaceAll(/BEGIN_TEXT.*END_TEXT/gs, "");
    }

    const findPgml = document.match(/BEGIN_PGML(.*)END_PGML/s);
    if (findPgml) {
        if (contentType) {
            console.warn("Both TEXT and PGML found!!");
        }
        content = findPgml[1].trim();
        contentType = "pgml";
        document = document.replaceAll(/BEGIN_PGML.*END_PGML/gs, "");
    }

    if (!contentType) {
        console.warn("Neither TEXT nor PGML found");
        return "";
    }

    // Solution is always of type `text`
    let solutionSection = "";
    const findSolution = document.match(/SOLUTION.*;(.*)END_SOLUTION/s);
    if (findSolution) {
        solutionSection = findSolution[1].trim();
        document = document.replaceAll(/SOLUTION.*END_SOLUTION/gs, "");
    }

    // Clean up the rest of the document a bit
    document = document.replace(/(\r\n)+/g, "\n");
    document = document.replace(/\n+/g, "\n");
    document = document.replace(/\r+/g, "\n");
    document = document.trim();

    // Split into statements

    document = document.replaceAll(";\n", ";");
    let statements = document.split(";");

    statements = statements.filter(
        (v) =>
            v !== "" &&
            !v.includes("loadMacros") &&
            !v.includes("beginproblem()") &&
            !v.includes("Context(") &&
            !v.includes("install_problem_grader("),
    );

    function splitStatementOn(
        statements,
        keyword,
        splitOn,
        keepKeyword = false,
    ) {
        for (let i = statements.length - 1; i >= 0; i--) {
            if (statements[i].indexOf(keyword) === 0) {
                let splitId = statements[i].indexOf(splitOn);
                let beforEndId = keepKeyword
                    ? splitId + keyword.length
                    : splitId;
                let before = statements[i].slice(0, beforEndId);
                let after = statements[i].slice(splitId + 1);

                before = before.replace("==", "=");
                statements[i] = before;
                statements.splice(i + 1, 0, after);
            }
        }
        statements = statements.map((s) => s.trim());

        return statements;
    }

    statements = splitStatementOn(statements, "}", "}", true);
    statements = splitStatementOn(statements, "if", "{");
    statements = splitStatementOn(statements, "elsif", "{");
    statements = splitStatementOn(statements, "else", "{");

    // let out = "";
    let answers = [];
    let activeConditions = [];
    let prevCondition = "";

    let showPartialCorrectAnswers = false;

    // Keep track of graphs, we render them later
    let graphs = {};
    let graphContents = {};

    let setup = new Map();
    function addSetup(name, open, child, close, conditions) {
        let conditionText = "";
        for (let c of conditions) {
            if (c !== "while") {
                conditionText += c + " and ";
            }
        }
        conditionText = conditionText.slice(0, -5);

        let data = setup.get(name);
        if (data) {
            // Ignore open and close, add child option

            let childOptions = data.childOptions;
            childOptions.push({ value: child, condition: conditionText });

            setup.set(name, {
                open: data.open,
                childOptions: childOptions,
                close: data.close,
            });
        } else {
            // Use open and close and child
            let childOptions = [{ value: child, condition: conditionText }];
            setup.set(name, {
                open: open,
                childOptions: childOptions,
                close: close,
            });
        }
    }

    let out = "";

    let graphicalStyleCount = 0; //styling for graphical objects
    for (let statement of statements) {
        let find;

        // Open conditional if
        if ((find = statement.match(/if\s*\((.*)\)/))) {
            let condition = find[1].trim();
            activeConditions.push(condition);

            // Open conditional else
        } else if (statement === "else") {
            activeConditions.push("else");

            // Open conditional: while
        } else if ((find = statement.match(/while\s*\((.*)\)/))) {
            out += warnAndComment("Not implemented: while statements");
            // let condition = find[1].trim();
            activeConditions.push("while");

            // Close conditional
        } else if (statement === "}") {
            prevCondition = activeConditions.pop();

            // == Variable declaration ===
            // Of the form $a = ...;
        } else if ((find = statement.match(/\$(\w+)\s*=(.*)/))) {
            const varName = find[1].trim();
            const varValue = find[2].trim();
            const findFunc = varValue.match(/(\w+)\((.*)\)(->\w+)?/);

            // Special case: init_graph()
            // Of the form $a = init_graph(...)...;
            if (findFunc && findFunc[1] === "init_graph") {
                graphs[varName] = graphOpenTag(findFunc[2]);

                // Function statement
                // Of the form $a = b(c)...;
            } else if (findFunc && findFunc.index === 0) {
                const [open, child, close, gStyle] = functionStatement(
                    varName,
                    findFunc[1],
                    findFunc[2],
                    graphicalStyleCount,
                );
                addSetup(varName, open, child, close, activeConditions);
                graphicalStyleCount = gStyle;

                // Special case: partial answers
            } else if (varName === "showPartialCorrectAnswers") {
                // set partial correct answers flag
                if (varValue !== "0" && varValue !== "1") {
                    out += warnAndComment(
                        "Value for `showPartialCorrectAnswers` is not 0 or 1",
                    );
                }
                showPartialCorrectAnswers = varValue === "1" ? true : false;

                // Variable assignment, no function
            } else {
                // stick it in a math tag
                let open = `<math name="${varName}">`;
                let child = `${varValue}`;
                child = child.replaceAll(`"`, ``);
                let close = `</math>`;
                addSetup(varName, open, child, close, activeConditions);
            }

            // Special case: plot_functions
            // plot_functions(...);
        } else if ((find = statement.match(/plot_functions\((.*)\)/))) {
            const plotArgs = splitArgs(find[1]);
            let plotGraph = plotArgs.shift();
            plotGraph = plotGraph.slice(1); //remove $

            for (let child of plotArgs) {
                if (graphContents[plotGraph]) {
                    graphContents[plotGraph].push(child);
                } else {
                    graphContents[plotGraph] = [child];
                }
            }

            // Answers
            // Of the form ANS(...);
        } else if ((find = statement.match(/ANS\(\s*(.*)\s*\)/))) {
            let arg = find[1];

            let parts = arg.split("->");
            // Ignore extra parts for now
            // if(parts.length > 1) {
            //   if(find = parts[1].match(/cmp\((.*)\)/)) {
            //     let cmpArgs = splitArgs(find[1]);
            //     console.log(cmpArgs);
            //   }
            // }

            let ans = parts[0];

            if ((find = ans.match(/(\w+)\s*\(\s*(.*)\s*\)/))) {
                if (find[1] == "fun_cmp") {
                    ans = splitArgs(find[2])[0];
                } else {
                    const [open, child, close, gStyle] = functionStatement(
                        undefined,
                        find[1],
                        find[2],
                        graphicalStyleCount,
                    );
                    ans = open + child + close;
                }
            }

            answers.push(ans);

            // ERROR: unrecognized pattern
        } else {
            out += warnAndComment(`Unrecognized pattern: ${statement}`);
        }
    }

    for (let data of setup.values()) {
        out += data.open;

        let options = data.childOptions;
        if (options.length === 1 && options[0].condition === "") {
            out += options[0].value;
        } else {
            out += `<conditionalContent>\n`;
            for (let option of options) {
                if (option.condition === "else") {
                    //TODO: bug with else nested inside if
                    out += `${tab}<else>${option.value}</else>\n`;
                } else {
                    out += `${tab}<case condition="${option.condition}">${option.value}</case>\n`;
                }
            }
            out += `</conditionalContent>`;
        }

        out += data.close + "\n";
    }

    out = tab + out;
    out = out.replaceAll("\n", `\n${tab}`);
    out = out.slice(0, -tab.length);
    out = `<setup>\n` + out + `</setup>\n\n`;

    // out = out.replaceAll(/<setup>(.*)\n(.*)<\/setup>/gs, `<setup>$1\n${tab}$2</setup>`);

    // ==== PARSE TEXT/PGML =====
    let mathInputCount = 0;
    let textOut;
    let answerId = 0;
    let answersOut = "";
    let solutionOut = "";
    if (contentType === "text") {
        // TEXT
        [textOut, mathInputCount] = textSection(
            content,
            mathInputCount,
            graphs,
            graphContents,
        );

        for (let answer of answers) {
            answerId++;
            answersOut += `$mi${answerId} = ${answer} and `;
            solutionOut += `<li>${answer}</li>\n`;
        }
    } else {
        // PGML
        let pgmlSolutions = [];
        [textOut, mathInputCount, pgmlSolutions] = pgmlSection(
            content,
            mathInputCount,
        );

        for (let pgmlSolution of pgmlSolutions) {
            answerId++;
            answersOut += `$mi${answerId} = ${pgmlSolution} and `;
            solutionOut += `<li>${pgmlSolution}</li>\n`;
        }
    }
    out += textOut;

    // THE SOLUTION

    const answerPartial = showPartialCorrectAnswers ? " matchPartial" : "";
    answersOut = `<answer${answerPartial}><award><when>${answersOut.slice(
        0,
        -5,
    )}</when></award></answer>\n`;

    if (solutionSection) {
        // If a <SOLUTION> is defined, use that instead
        [solutionOut] = textSection(solutionSection, 0, graphs, graphContents);
    } else {
        solutionOut = `<ol>\n${solutionOut}</ol>`;
    }
    solutionOut = "<solution>" + solutionOut + "</solution>\n";

    out = "<question><title />\n" + out;
    out += answersOut;
    out += "</question>\n";
    out += solutionOut;

    return out;
}

/**
 *
 * @param {string} name - variable name, no $
 * @param {string} func -
 * @param {string} argsString - everything between parenthesis
 * @returns
 */
function functionStatement(name, func, argsString, graphicalStyleCount) {
    let args = splitArgs(argsString);

    let nameStr = name ? ` name="${name}"` : "";

    let open = "";
    let child = "";
    let close = "";
    if (func === "random") {
        // <selectFromSequence>
        let step =
            args[2] === "1" || args[2] === undefined
                ? ""
                : ` step="${args[2]}"`;
        open = `<selectFromSequence${nameStr} from="${args[0]}" to="${args[1]}"${step}/>`;
    } else if (func === "non_zero_random") {
        // <selectFromSequence>, exclude 0
        let step = args[2] === "1" ? "" : ` step="${args[2]}"`;
        open = `<selectFromSequence${nameStr} from="${args[0]}" to="${args[1]}"${step} exclude="0"/>`;
    } else if (func === "Real") {
        // <number>
        open = `<number${nameStr}>`;
        child = `${args[0]}`;
        close = "</number>";
    } else if (func === "Compute") {
        // <math>
        open = `<math${nameStr} simplify="full">`;
        child = `${args[0]}`;
        close = "</math>";
    } else if (func === "ImplicitPlane" || func === "Formula") {
        // <math> with equation
        open = `<math${nameStr} simplify="numbersPreserveOrder">`;
        child = `${args[0]}`;
        close = `</math>`;
    } else if (func === "List") {
        // <mathList>
        open = `<mathList${nameStr}>`;
        let list = "";
        for (let arg of args) {
            list += arg + " ";
        }
        list = list.slice(0, -1);
        child = list;
        close = `</mathList>`;
    } else if (func === "Interval") {
        // <interval>
        open = `<math${nameStr}><interval>`;
        child = `${args[0]}`;
        close = `</interval></math>`;
    } else if (func === "Union") {
        // <interval> with union
        args[0] = args[0].replaceAll(/\s+U\s+/g, " union ");
        open = `<math${nameStr}><interval>`;
        child = `${args[0]}`;
        close = `</interval></math>`;
    } else if (func === "FEQ") {
        // <function>
        graphicalStyleCount++;
        let funcDef = args[0].match(/(.*)\sfor\sx\sin\s<(.*),(.*)>/);
        open = `<function${nameStr} domain="[${funcDef[2]},${funcDef[3]}]" stylenumber="${graphicalStyleCount}">`;
        child = `${funcDef[1]}`;
        close = `</function>`;
    } else {
        open = warnAndComment(`Unknown function ${func}`);
    }

    return [open, child, close, graphicalStyleCount];
}

/**
 * Convert init_graph line
 */
function graphOpenTag(argsString) {
    let args = splitArgs(argsString);

    const xmin = args[0];
    const ymin = args[1];
    const xmax = args[2];
    const ymax = args[3];

    return `<graph xmin="${xmin}" xmax="${xmax}" ymin="${ymin}" ymax="${ymax}" grid="1 1">`;
}

function graphWithContents(graphName, graphs, graphContents) {
    const graphTag = graphs[graphName];
    let out = graphTag + "\n";
    if (graphContents[graphName]) {
        for (let child of graphContents[graphName]) {
            out += tab + child + "\n";
        }
    }
    out += "</graph>\n";
    return out;
}

function textSection(text, mathInputCount, graphs, graphContents) {
    let out = "";

    text = text.replaceAll("\r\n", "");
    text = text.replaceAll("\n", "");
    text = text.replaceAll("\r", "");

    // Bold text: <alert>
    text = text.replaceAll("$BBOLD", "<alert>");
    text = text.replaceAll("${BBOLD}", "<alert>");
    text = text.replaceAll("$EBOLD", "</alert>");
    text = text.replaceAll("${EBOLD}", "</alert>");
    // Italic text: <em>
    text = text.replaceAll("$BITALIC", "<em>");
    text = text.replaceAll("${BITALIC}", "<em>");
    text = text.replaceAll("$EITALIC", "</em>");
    text = text.replaceAll("${EITALIC}", "</em>");
    // Centering
    text = text.replaceAll("$BCENTER", "");
    text = text.replaceAll("$(BCENTER}", "");
    text = text.replaceAll("$ECENTER", "");
    text = text.replaceAll("${BCENTER}", "");
    // <m> tags
    text = text.replaceAll("\\(", "<m>");
    text = text.replaceAll("\\)", "</m>");
    // <me> tags
    text = text.replaceAll("\\[", "<me>");
    text = text.replaceAll("\\]", "</me>");

    // $PAR and $BR
    text = text.replaceAll("$PAR", "\n");
    text = text.replaceAll("${PAR}", "\n");
    text = text.replaceAll("$BR", "\n");
    text = text.replaceAll("${BR}", "\n");
    text = text.replaceAll("$HR", "\n");
    text = text.replaceAll("${HR}", "\n");

    text = text.trim();

    for (let par of text.split("\n")) {
        // <mathInput> tags
        const ansRuleMatches = par.matchAll(
            /\\?\{\s?ans_rule\(\s?\d+\s?\)\s?\\\}?/dg,
        );
        let matchIds = [];
        for (let match of ansRuleMatches) {
            matchIds.push(match.indices[0]);
        }
        mathInputCount += matchIds.length;
        // Start from the back so we don't mess up the earlier indices
        let currentMi = mathInputCount;
        for (let matchId of matchIds.reverse()) {
            const before = par.slice(0, matchId[0]);
            const after = par.slice(matchId[1], par.length);
            par = `${before}<mathInput name="mi${currentMi}" />${after}`;
            currentMi--;
        }

        // <graph> tags
        const insertGraphMatches = par.matchAll(
            /\\\{\s*image\(\s*insertGraph\(\s*(.*)\s*\),.*\)\\\}/dg,
        );
        matchIds = [];
        let graphNames = [];
        for (let match of insertGraphMatches) {
            matchIds.push(match.indices[0]);
            graphNames.push(match[1].slice(1));
        }
        // Start from the back so we don't mess up the earlier indices
        for (let i = matchIds.length - 1; i >= 0; i--) {
            let matchId = matchIds[i];
            let graphName = graphNames[i];
            const before = par.slice(0, matchId[0]);
            const after = par.slice(matchId[1], par.length);
            const graphOut = graphWithContents(
                graphName,
                graphs,
                graphContents,
            );
            par = before + graphOut + after;
        }

        // wrap it in a <p> tag
        out += `<p>${par.trim()}</p>\n`;
    }
    return [out, mathInputCount];
}

function pgmlSection(pgml, mathInputCount) {
    // <m> tags with \displaystyle
    pgml = pgml.replaceAll("[``", "<m>\\displaystyle{");
    pgml = pgml.replaceAll("``]", "}</m>");
    // <m> tags
    pgml = pgml.replaceAll("[`", "<m>");
    pgml = pgml.replaceAll("`]", "</m>");

    // references
    pgml = pgml.replaceAll(/\[(\$\w+)\]/g, "$1");

    // paragraph breaks
    pgml = pgml.replaceAll("\n\n", "⛓️‍💥");
    pgml = pgml.replaceAll("\r\n\r\n", "⛓️‍💥");
    pgml = pgml.replaceAll("\r\r", "⛓️‍💥");

    let out = "";
    let solutions = [];
    for (let par of pgml.split("⛓️‍💥")) {
        const ansRegEx = /\[_+\]\{(.*)\}/dg;
        const ansMatches = par.matchAll(ansRegEx);
        let matchIds = [];
        for (let match of ansMatches) {
            matchIds.push(match.indices[0]);
            solutions.push(match[1]);
        }
        mathInputCount += matchIds.length;
        // Start from the back so we don't mess up the earlier indices
        let currentMi = mathInputCount;
        for (let matchId of matchIds.reverse()) {
            const before = par.slice(0, matchId[0]);
            const after = par.slice(matchId[1], par.length);
            par = `${before}<mathInput name="mi${currentMi}" />${after}`;
            currentMi--;
        }

        out += `<p>${par.trim()}\n</p>\n`;
    }
    return [out, mathInputCount, solutions];
}

function splitArgs(argsString) {
    argsString = argsString.replace(/<(.*),(.*)>/, "<$1🍩$2>");
    argsString = argsString.replace(/\((.*),(.*)\)/, "($1🍩$2)");

    let args = argsString
        .split(",")
        .map((arg) => arg.trim().replaceAll(`"`, ``));
    args = args.map((a) => a.replace("🍩", ","));
    return args;
}

function warnAndComment(message) {
    console.warn(message);
    return `<!-- ${message} -->\n`;
}

export function main(args = process.argv.slice(2)) {
    const hideOriginal = args.includes("hide-original");

    const inputFilepath = "input.pg";
    const outputFilepath = "output.doenetml";
    let data = "";
    try {
        data = fs.readFileSync(inputFilepath, "utf8");
    } catch (err) {
        console.error("Error reading file:", err);
        return;
    }

    let output = convert(data);
    if (!hideOriginal) {
        output += `
<!-- Generated from this WeBWorK problem: -->
<!--\n${data}\n-->\n`;
    }

    try {
        fs.writeFileSync(outputFilepath, output);
    } catch (err) {
        console.error("Error writing output", err);
    }
}

if (
    process.argv[1] &&
    import.meta.url === pathToFileURL(process.argv[1]).href
) {
    main();
}
