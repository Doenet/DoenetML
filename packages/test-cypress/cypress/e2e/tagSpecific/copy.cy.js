import { cesc, cesc2 } from "@doenet/utils";

describe("Copy Tag Tests", function () {
    beforeEach(() => {
        cy.clearIndexedDB();
        cy.visit("/");
    });

    it("copy uri two problems", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <title>Two problems</title>

    <copy name="problem1" uri="doenet:cId=bafkreifgmyjuw4m6odukznenshkyfupp3egx6ep3jgnlo747d6s5v7nznu&DoenEtiD=abcdefg" />
    
    <copy name="problem2" uri="doenet:doeneTiD=hijklmnop&CID=bafkreide4mismb45mxved2ibfh5jnj75kty7vjz7w6zo7goyxpwr2e7wti" />
    `,
                },
                "*",
            );
        });
        cy.get(cesc("#\\/_title1")).should("have.text", "Two problems"); // to wait for page to load

        let problem1Version;
        let animalOptions = ["cat", "dog", "mouse", "fish"];
        let soundOptions = ["meow", "woof", "squeak", "blub"];

        cy.get(cesc2("#/problem1/_title1")).should(
            "have.text",
            "Animal sounds",
        );

        cy.get(cesc2("#/problem1/_p1"))
            .invoke("text")
            .then((text) => {
                let titleOptions = animalOptions.map(
                    (x) => `What does the ${x} say?`,
                );
                problem1Version = titleOptions.indexOf(text);
                expect(problem1Version).not.eq(-1);
                cy.window().then(async (win) => {
                    let stateVariables = await win.returnAllStateVariables1();
                    let copy1Name = stateVariables["/problem1"].replacementOf;
                    let copy2Name = stateVariables["/problem2"].replacementOf;
                    expect(stateVariables[copy1Name].stateValues.cid).eq(
                        "bafkreifgmyjuw4m6odukznenshkyfupp3egx6ep3jgnlo747d6s5v7nznu",
                    );
                    expect(stateVariables[copy1Name].stateValues.doenetId).eq(
                        "abcdefg",
                    );
                    expect(stateVariables[copy2Name].stateValues.cid).eq(
                        "bafkreide4mismb45mxved2ibfh5jnj75kty7vjz7w6zo7goyxpwr2e7wti",
                    );
                    expect(stateVariables[copy2Name].stateValues.doenetId).eq(
                        "hijklmnop",
                    );
                });
            });

        cy.log(`select correct answer for problem 1`).then(() => {
            let animal = animalOptions[problem1Version];
            let sound = soundOptions[problem1Version];
            cy.get(cesc2("#/problem1/_choiceinput1"))
                .contains(sound)
                .click({ force: true });
            cy.get(cesc2("#/problem1/_choiceinput1_submit")).click();
            cy.get(cesc2("#/problem1/_choiceinput1_correct")).should(
                "be.visible",
            );
            cy.get(cesc2("#/problem1/_choiceinput1_incorrect")).should(
                "not.exist",
            );
            cy.get(cesc2("#/problem1/_feedback1")).should(
                "have.text",
                `That's right, the ${animal} goes ${sound}!`,
            );
            cy.get(cesc2("#/problem1/_feedback2")).should("not.exist");
        });

        cy.log(`select incorrect answer for problem 1`).then(() => {
            let incorrectInd = (problem1Version + 1) % 4;
            let sound = soundOptions[incorrectInd];
            cy.get(cesc2("#/problem1/_choiceinput1"))
                .contains(sound)
                .click({ force: true });
            cy.get(cesc2("#/problem1/_choiceinput1_submit")).click();
            cy.get(cesc2("#/problem1/_choiceinput1_correct")).should(
                "not.exist",
            );
            cy.get(cesc2("#/problem1/_choiceinput1_incorrect")).should(
                "be.visible",
            );
            cy.get(cesc2("#/problem1/_feedback1")).should("not.exist");
            cy.get(cesc2("#/problem1/_feedback2")).should(
                "have.text",
                `Try again.`,
            );
        });

        cy.get(cesc2("#/problem2/_title1")).should(
            "have.text",
            "Derivative problem",
        );

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            let mathinputName =
                stateVariables["/problem2/_answer1"].stateValues
                    .inputChildren[0].componentName;
            let mathinputAnchor = cesc2("#" + mathinputName) + " textarea";
            let mathinputSubmitAnchor = cesc2("#" + mathinputName + "_submit");
            let mathinputCorrectAnchor = cesc2(
                "#" + mathinputName + "_correct",
            );
            let mathinputIncorrectAnchor = cesc2(
                "#" + mathinputName + "_incorrect",
            );

            cy.log(`enter incorrect answer for problem 2`);
            cy.get(mathinputAnchor).type("2y{enter}", { force: true });
            cy.get(mathinputSubmitAnchor).should("not.exist");
            cy.get(mathinputCorrectAnchor).should("not.exist");
            cy.get(mathinputIncorrectAnchor).should("be.visible");

            cy.log(`enter correct answer for problem 2`);
            cy.get(mathinputAnchor).type("{end}{backspace}x", { force: true });
            cy.get(mathinputSubmitAnchor).should("be.visible");
            cy.get(mathinputAnchor).type("{enter}", { force: true });
            cy.get(mathinputSubmitAnchor).should("not.exist");
            cy.get(mathinputCorrectAnchor).should("be.visible");
            cy.get(mathinputIncorrectAnchor).should("not.exist");
        });
    });

    it("copy uri two problems, with copyFromUri", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <title>Two problems</title>

    <problem name="problem1" copyFromUri="doenet:cId=bafkreifgmyjuw4m6odukznenshkyfupp3egx6ep3jgnlo747d6s5v7nznu&DoenEtiD=abcdefg" />
    
    <problem name="problem2" copyFromUri="doenet:doeneTiD=hijklmnop&CID=bafkreide4mismb45mxved2ibfh5jnj75kty7vjz7w6zo7goyxpwr2e7wti" />
    `,
                },
                "*",
            );
        });
        cy.get(cesc("#\\/_title1")).should("have.text", "Two problems"); // to wait for page to load

        let problem1Version;
        let animalOptions = ["cat", "dog", "mouse", "fish"];
        let soundOptions = ["meow", "woof", "squeak", "blub"];

        cy.get(cesc2("#/problem1/_title1")).should(
            "have.text",
            "Animal sounds",
        );

        cy.get(cesc2("#/problem1/_p1"))
            .invoke("text")
            .then((text) => {
                let titleOptions = animalOptions.map(
                    (x) => `What does the ${x} say?`,
                );
                problem1Version = titleOptions.indexOf(text);
                expect(problem1Version).not.eq(-1);
            });

        cy.log(`select correct answer for problem 1`).then(() => {
            let animal = animalOptions[problem1Version];
            let sound = soundOptions[problem1Version];
            cy.get(cesc2("#/problem1/_choiceinput1"))
                .contains(sound)
                .click({ force: true });
            cy.get(cesc2("#/problem1/_choiceinput1_submit")).click();
            cy.get(cesc2("#/problem1/_choiceinput1_correct")).should(
                "be.visible",
            );
            cy.get(cesc2("#/problem1/_choiceinput1_incorrect")).should(
                "not.exist",
            );
            cy.get(cesc2("#/problem1/_feedback1")).should(
                "have.text",
                `That's right, the ${animal} goes ${sound}!`,
            );
            cy.get(cesc2("#/problem1/_feedback2")).should("not.exist");
        });

        cy.log(`select incorrect answer for problem 1`).then(() => {
            let incorrectInd = (problem1Version + 1) % 4;
            let sound = soundOptions[incorrectInd];
            cy.get(cesc2("#/problem1/_choiceinput1"))
                .contains(sound)
                .click({ force: true });
            cy.get(cesc2("#/problem1/_choiceinput1_submit")).click();
            cy.get(cesc2("#/problem1/_choiceinput1_correct")).should(
                "not.exist",
            );
            cy.get(cesc2("#/problem1/_choiceinput1_incorrect")).should(
                "be.visible",
            );
            cy.get(cesc2("#/problem1/_feedback1")).should("not.exist");
            cy.get(cesc2("#/problem1/_feedback2")).should(
                "have.text",
                `Try again.`,
            );
        });

        cy.get(cesc2("#/problem2/_title1")).should(
            "have.text",
            "Derivative problem",
        );

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            let mathinputName =
                stateVariables["/problem2/_answer1"].stateValues
                    .inputChildren[0].componentName;
            let mathinputAnchor = cesc2("#" + mathinputName) + " textarea";
            let mathinputSubmitAnchor = cesc2("#" + mathinputName + "_submit");
            let mathinputCorrectAnchor = cesc2(
                "#" + mathinputName + "_correct",
            );
            let mathinputIncorrectAnchor = cesc2(
                "#" + mathinputName + "_incorrect",
            );

            cy.log(`enter incorrect answer for problem 2`);
            cy.get(mathinputAnchor).type("2y{enter}", { force: true });
            cy.get(mathinputSubmitAnchor).should("not.exist");
            cy.get(mathinputCorrectAnchor).should("not.exist");
            cy.get(mathinputIncorrectAnchor).should("be.visible");

            cy.log(`enter correct answer for problem 2`);
            cy.get(mathinputAnchor).type("{end}{backspace}x", { force: true });
            cy.get(mathinputSubmitAnchor).should("be.visible");
            cy.get(mathinputAnchor).type("{enter}", { force: true });
            cy.get(mathinputSubmitAnchor).should("not.exist");
            cy.get(mathinputCorrectAnchor).should("be.visible");
            cy.get(mathinputIncorrectAnchor).should("not.exist");
        });
    });

    it("copy uri two problems, with copyFromUri, change titles, add content, change attribute", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <title>Two problems</title>

    <problem name="problem1" copyFromUri="doenet:cId=bafkreifgmyjuw4m6odukznenshkyfupp3egx6ep3jgnlo747d6s5v7nznu&DoenEtiD=abcdefg" >
      <title>Extra animal sounds</title>

      <p>New content at bottom</p>
    </problem>
    
    <problem name="problem2" copyFromUri="doenet:doeneTiD=hijklmnop&CID=bafkreide4mismb45mxved2ibfh5jnj75kty7vjz7w6zo7goyxpwr2e7wti" sectionWideCheckWork>
      <title>Derivative with second derivative</title>

      <p>What is the second derivative of <math copySource="problem2/expr" />?
      <answer>
        <award>
          <derivative>$(problem2/_derivative1)</derivative>
        </award>
      </answer>
    </p>
    </problem>

    <p>End paragraph</p>
    `,
                },
                "*",
            );
        });
        cy.get(cesc("#\\/_title1")).should("have.text", "Two problems"); // to wait for page to load

        let problem1Version;
        let animalOptions = ["cat", "dog", "mouse", "fish"];
        let soundOptions = ["meow", "woof", "squeak", "blub"];

        cy.get(cesc2("#/problem1/_title1")).should("not.exist");
        cy.get(cesc2("#/_title2")).should("have.text", "Extra animal sounds");
        cy.get(cesc2("#/_p1")).should("have.text", "New content at bottom");
        cy.get(cesc2("#/_p3")).should("have.text", "End paragraph");

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(stateVariables["/problem1"].stateValues.title).eq(
                "Extra animal sounds",
            );
        });

        cy.get(cesc2("#/problem1/_p1"))
            .invoke("text")
            .then((text) => {
                let titleOptions = animalOptions.map(
                    (x) => `What does the ${x} say?`,
                );
                problem1Version = titleOptions.indexOf(text);
                expect(problem1Version).not.eq(-1);
            });

        cy.log(`select correct answer for problem 1`).then(() => {
            let animal = animalOptions[problem1Version];
            let sound = soundOptions[problem1Version];
            cy.get(cesc2("#/problem1/_choiceinput1"))
                .contains(sound)
                .click({ force: true });
            cy.get(cesc2("#/problem1/_choiceinput1_submit")).click();
            cy.get(cesc2("#/problem1/_choiceinput1_correct")).should(
                "be.visible",
            );
            cy.get(cesc2("#/problem1/_choiceinput1_incorrect")).should(
                "not.exist",
            );
            cy.get(cesc2("#/problem1/_feedback1")).should(
                "have.text",
                `That's right, the ${animal} goes ${sound}!`,
            );
            cy.get(cesc2("#/problem1/_feedback2")).should("not.exist");
        });

        cy.log(`select incorrect answer for problem 1`).then(() => {
            let incorrectInd = (problem1Version + 1) % 4;
            let sound = soundOptions[incorrectInd];
            cy.get(cesc2("#/problem1/_choiceinput1"))
                .contains(sound)
                .click({ force: true });
            cy.get(cesc2("#/problem1/_choiceinput1_submit")).click();
            cy.get(cesc2("#/problem1/_choiceinput1_correct")).should(
                "not.exist",
            );
            cy.get(cesc2("#/problem1/_choiceinput1_incorrect")).should(
                "be.visible",
            );
            cy.get(cesc2("#/problem1/_feedback1")).should("not.exist");
            cy.get(cesc2("#/problem1/_feedback2")).should(
                "have.text",
                `Try again.`,
            );
        });

        cy.get(cesc2("#/problem2/_title1")).should("not.exist");
        cy.get(cesc2("#/_title3")).should(
            "have.text",
            "Derivative with second derivative",
        );

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            let mathinputName =
                stateVariables["/problem2/_answer1"].stateValues
                    .inputChildren[0].componentName;
            let mathinputAnchor = cesc2("#" + mathinputName) + " textarea";

            let mathinput2Name =
                stateVariables["/_answer1"].stateValues.inputChildren[0]
                    .componentName;
            let mathinput2Anchor = cesc2("#" + mathinput2Name) + " textarea";

            expect(stateVariables["/problem2"].stateValues.title).eq(
                "Derivative with second derivative",
            );

            cy.log(`enter incorrect answer for problem 2`);
            cy.get(mathinputAnchor).type("2y{enter}", { force: true });
            cy.get(cesc2("#/problem2_submit")).click();
            cy.get(cesc2("#/problem2_incorrect")).should("be.visible");

            cy.log(`enter correct answer for problem 2`);
            cy.get(mathinputAnchor).type("{end}{backspace}x", { force: true });
            cy.get(cesc2("#/problem2_submit")).click();
            cy.get(cesc2("#/problem2_partial")).should("contain.text", "50%");

            cy.log(`enter incorrect answer for problem 2, part 2`);
            cy.get(mathinput2Anchor).type("3{enter}", { force: true });
            cy.get(cesc2("#/problem2_submit")).click();
            cy.get(cesc2("#/problem2_partial")).should("contain.text", "50%");

            cy.log(`enter correct answer for problem 2, part 2`);
            cy.get(mathinput2Anchor).type("{end}{backspace}2", { force: true });
            cy.get(cesc2("#/problem2_submit")).click();
            cy.get(cesc2("#/problem2_correct")).should("be.visible");
        });
    });

    it("copy uri two problems, with copyFromUri, newNamespace change titles, add content, change attribute", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <title>Two problems</title>

    <problem name="problem1" newNamespace copyFromUri="doenet:cId=bafkreifgmyjuw4m6odukznenshkyfupp3egx6ep3jgnlo747d6s5v7nznu&DoenEtiD=abcdefg" >
      <title>Extra animal sounds</title>

      <p>New content at bottom</p>
    </problem>
    
    <problem name="problem2" newNamespace copyFromUri="doenet:doeneTiD=hijklmnop&CID=bafkreide4mismb45mxved2ibfh5jnj75kty7vjz7w6zo7goyxpwr2e7wti" sectionWideCheckWork>
      <title>Derivative with second derivative</title>

      <p>What is the second derivative of <math copySource="expr" />?
      <answer>
        <award>
          <derivative>$_derivative1</derivative>
        </award>
      </answer>
    </p>
    </problem>

    <p>End paragraph</p>
    `,
                },
                "*",
            );
        });
        cy.get(cesc("#\\/_title1")).should("have.text", "Two problems"); // to wait for page to load

        let problem1Version;
        let animalOptions = ["cat", "dog", "mouse", "fish"];
        let soundOptions = ["meow", "woof", "squeak", "blub"];

        cy.get(cesc2("#/problem1/_title1")).should("not.exist");
        cy.get(cesc2("#/problem1/_title2")).should(
            "have.text",
            "Extra animal sounds",
        );
        cy.get(cesc2("#/problem1/_p4")).should(
            "have.text",
            "New content at bottom",
        );
        cy.get(cesc2("#/_p1")).should("have.text", "End paragraph");

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(stateVariables["/problem1"].stateValues.title).eq(
                "Extra animal sounds",
            );
        });

        cy.get(cesc2("#/problem1/_p1"))
            .invoke("text")
            .then((text) => {
                let titleOptions = animalOptions.map(
                    (x) => `What does the ${x} say?`,
                );
                problem1Version = titleOptions.indexOf(text);
                expect(problem1Version).not.eq(-1);
            });

        cy.log(`select correct answer for problem 1`).then(() => {
            let animal = animalOptions[problem1Version];
            let sound = soundOptions[problem1Version];
            cy.get(cesc2("#/problem1/_choiceinput1"))
                .contains(sound)
                .click({ force: true });
            cy.get(cesc2("#/problem1/_choiceinput1_submit")).click();
            cy.get(cesc2("#/problem1/_choiceinput1_correct")).should(
                "be.visible",
            );
            cy.get(cesc2("#/problem1/_choiceinput1_incorrect")).should(
                "not.exist",
            );
            cy.get(cesc2("#/problem1/_feedback1")).should(
                "have.text",
                `That's right, the ${animal} goes ${sound}!`,
            );
            cy.get(cesc2("#/problem1/_feedback2")).should("not.exist");
        });

        cy.log(`select incorrect answer for problem 1`).then(() => {
            let incorrectInd = (problem1Version + 1) % 4;
            let sound = soundOptions[incorrectInd];
            cy.get(cesc2("#/problem1/_choiceinput1"))
                .contains(sound)
                .click({ force: true });
            cy.get(cesc2("#/problem1/_choiceinput1_submit")).click();
            cy.get(cesc2("#/problem1/_choiceinput1_correct")).should(
                "not.exist",
            );
            cy.get(cesc2("#/problem1/_choiceinput1_incorrect")).should(
                "be.visible",
            );
            cy.get(cesc2("#/problem1/_feedback1")).should("not.exist");
            cy.get(cesc2("#/problem1/_feedback2")).should(
                "have.text",
                `Try again.`,
            );
        });

        cy.get(cesc2("#/problem2/_title1")).should("not.exist");
        cy.get(cesc2("#/problem2/_title2")).should(
            "have.text",
            "Derivative with second derivative",
        );

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            let mathinputName =
                stateVariables["/problem2/_answer1"].stateValues
                    .inputChildren[0].componentName;
            let mathinputAnchor = cesc2("#" + mathinputName) + " textarea";

            let mathinput2Name =
                stateVariables["/problem2/_answer2"].stateValues
                    .inputChildren[0].componentName;
            let mathinput2Anchor = cesc2("#" + mathinput2Name) + " textarea";

            expect(stateVariables["/problem2"].stateValues.title).eq(
                "Derivative with second derivative",
            );

            cy.log(`enter incorrect answer for problem 2`);
            cy.get(mathinputAnchor).type("2y{enter}", { force: true });
            cy.get(cesc2("#/problem2_submit")).click();
            cy.get(cesc2("#/problem2_incorrect")).should("be.visible");

            cy.log(`enter correct answer for problem 2`);
            cy.get(mathinputAnchor).type("{end}{backspace}x", { force: true });
            cy.get(cesc2("#/problem2_submit")).click();
            cy.get(cesc2("#/problem2_partial")).should("contain.text", "50%");

            cy.log(`enter incorrect answer for problem 2, part 2`);
            cy.get(mathinput2Anchor).type("3{enter}", { force: true });
            cy.get(cesc2("#/problem2_submit")).click();
            cy.get(cesc2("#/problem2_partial")).should("contain.text", "50%");

            cy.log(`enter correct answer for problem 2, part 2`);
            cy.get(mathinput2Anchor).type("{end}{backspace}2", { force: true });
            cy.get(cesc2("#/problem2_submit")).click();
            cy.get(cesc2("#/problem2_correct")).should("be.visible");
        });
    });

    it("copy uri two problems, change attribute but cannot change titles or add content without copyFromUri", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <title>Two problems</title>

    <copy name="problem1" uri="doenet:cId=bafkreifgmyjuw4m6odukznenshkyfupp3egx6ep3jgnlo747d6s5v7nznu&DoenEtiD=abcdefg" >
      <title>Extra animal sounds</title>

      <p>New content at bottom</p>
    </copy>
    
    <copy name="problem2" uri="doenet:doeneTiD=hijklmnop&CID=bafkreide4mismb45mxved2ibfh5jnj75kty7vjz7w6zo7goyxpwr2e7wti" sectionWideCheckWork>
      <title>Derivative with second derivative</title>

      <p>What is the second derivative of <math copySource="problem2/expr" />?
      <answer>
        <award>
          <derivative>$(problem2/_derivative1)</derivative>
        </award>
      </answer>
    </p>
    </copy>
    <p>End paragraph</p>

    `,
                },
                "*",
            );
        });
        cy.get(cesc("#\\/_title1")).should("have.text", "Two problems"); // to wait for page to load

        let problem1Version;
        let animalOptions = ["cat", "dog", "mouse", "fish"];
        let soundOptions = ["meow", "woof", "squeak", "blub"];

        cy.get(cesc2("#/problem1/_title1")).should(
            "have.text",
            "Animal sounds",
        );
        cy.get(cesc2("#/_title2")).should("not.exist");
        cy.get(cesc2("#/_p1")).should("not.exist");
        cy.get(cesc2("#/_p3")).should("have.text", "End paragraph");

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(stateVariables["/problem1"].stateValues.title).eq(
                "Animal sounds",
            );
        });

        cy.get(cesc2("#/problem1/_p1"))
            .invoke("text")
            .then((text) => {
                let titleOptions = animalOptions.map(
                    (x) => `What does the ${x} say?`,
                );
                problem1Version = titleOptions.indexOf(text);
                expect(problem1Version).not.eq(-1);
            });

        cy.log(`select correct answer for problem 1`).then(() => {
            let animal = animalOptions[problem1Version];
            let sound = soundOptions[problem1Version];
            cy.get(cesc2("#/problem1/_choiceinput1"))
                .contains(sound)
                .click({ force: true });
            cy.get(cesc2("#/problem1/_choiceinput1_submit")).click();
            cy.get(cesc2("#/problem1/_choiceinput1_correct")).should(
                "be.visible",
            );
            cy.get(cesc2("#/problem1/_choiceinput1_incorrect")).should(
                "not.exist",
            );
            cy.get(cesc2("#/problem1/_feedback1")).should(
                "have.text",
                `That's right, the ${animal} goes ${sound}!`,
            );
            cy.get(cesc2("#/problem1/_feedback2")).should("not.exist");
        });

        cy.log(`select incorrect answer for problem 1`).then(() => {
            let incorrectInd = (problem1Version + 1) % 4;
            let sound = soundOptions[incorrectInd];
            cy.get(cesc2("#/problem1/_choiceinput1"))
                .contains(sound)
                .click({ force: true });
            cy.get(cesc2("#/problem1/_choiceinput1_submit")).click();
            cy.get(cesc2("#/problem1/_choiceinput1_correct")).should(
                "not.exist",
            );
            cy.get(cesc2("#/problem1/_choiceinput1_incorrect")).should(
                "be.visible",
            );
            cy.get(cesc2("#/problem1/_feedback1")).should("not.exist");
            cy.get(cesc2("#/problem1/_feedback2")).should(
                "have.text",
                `Try again.`,
            );
        });

        cy.get(cesc2("#/problem2/_title1")).should(
            "have.text",
            "Derivative problem",
        );
        cy.get(cesc2("#/_title3")).should("not.exist");

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            let mathinputName =
                stateVariables["/problem2/_answer1"].stateValues
                    .inputChildren[0].componentName;
            let mathinputAnchor = cesc2("#" + mathinputName) + " textarea";

            expect(stateVariables["/_answer1"]).eq(undefined);

            expect(stateVariables["/problem2"].stateValues.title).eq(
                "Derivative problem",
            );

            cy.log(`enter incorrect answer for problem 2`);
            cy.get(mathinputAnchor).type("2y{enter}", { force: true });
            cy.get(cesc2("#/problem2_submit")).click();
            cy.get(cesc2("#/problem2_incorrect")).should("be.visible");

            cy.log(`enter correct answer for problem 2`);
            cy.get(mathinputAnchor).type("{end}{backspace}x", { force: true });
            cy.get(cesc2("#/problem2_submit")).click();
            cy.get(cesc2("#/problem2_correct")).should("be.visible");
        });
    });

    it("copy uri containing copy uri of two problems", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <title>Four problems</title>

    <copy name="problem12" uri="doenet:CID=bafkreid5s6fwzzfaax7pr3d2i2iu2743vvzrvttjy55vcmvunka7nu3ope" />
    
    <copy name="problem34" newNamespace uri="doenet:CID=bafkreid5s6fwzzfaax7pr3d2i2iu2743vvzrvttjy55vcmvunka7nu3ope" />
    `,
                },
                "*",
            );
        });

        cy.get(cesc("#\\/_title1")).should("have.text", "Four problems"); // to wait for page to load

        let problem1Version;
        let animalOptions = ["cat", "dog", "mouse", "fish"];
        let soundOptions = ["meow", "woof", "squeak", "blub"];

        cy.get(cesc2("#/problem12/problem1/_p1"))
            .invoke("text")
            .then((text) => {
                let titleOptions = animalOptions.map(
                    (x) => `What does the ${x} say?`,
                );
                problem1Version = titleOptions.indexOf(text);
                expect(problem1Version).not.eq(-1);
            });

        cy.log(`select correct answer for problem 1`).then(() => {
            let animal = animalOptions[problem1Version];
            let sound = soundOptions[problem1Version];
            cy.get(cesc2("#/problem12/problem1/_choiceinput1"))
                .contains(sound)
                .click({ force: true });
            cy.get(cesc2("#/problem12/problem1/_choiceinput1_submit")).click();
            cy.get(cesc2("#/problem12/problem1/_choiceinput1_correct")).should(
                "be.visible",
            );
            cy.get(
                cesc2("#/problem12/problem1/_choiceinput1_incorrect"),
            ).should("not.exist");
            cy.get(cesc2("#/problem12/problem1/_feedback1")).should(
                "have.text",
                `That's right, the ${animal} goes ${sound}!`,
            );
            cy.get(cesc2("#/problem12/problem1/_feedback2")).should(
                "not.exist",
            );
        });

        cy.log(`select incorrect answer for problem 1`).then(() => {
            let incorrectInd = (problem1Version + 1) % 4;
            let sound = soundOptions[incorrectInd];
            cy.get(cesc2("#/problem12/problem1/_choiceinput1"))
                .contains(sound)
                .click({ force: true });
            cy.get(cesc2("#/problem12/problem1/_choiceinput1_submit")).click();
            cy.get(cesc2("#/problem12/problem1/_choiceinput1_correct")).should(
                "not.exist",
            );
            cy.get(
                cesc2("#/problem12/problem1/_choiceinput1_incorrect"),
            ).should("be.visible");
            cy.get(cesc2("#/problem12/problem1/_feedback1")).should(
                "not.exist",
            );
            cy.get(cesc2("#/problem12/problem1/_feedback2")).should(
                "have.text",
                `Try again.`,
            );
        });

        cy.get(cesc2("#/problem12/problem2/_title1")).should(
            "have.text",
            "Derivative problem",
        );

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            let mathinputName =
                stateVariables["/problem12/problem2/_answer1"].stateValues
                    .inputChildren[0].componentName;
            let mathinputAnchor = cesc2("#" + mathinputName) + " textarea";
            let mathinputSubmitAnchor = cesc2("#" + mathinputName + "_submit");
            let mathinputCorrectAnchor = cesc2(
                "#" + mathinputName + "_correct",
            );
            let mathinputIncorrectAnchor = cesc2(
                "#" + mathinputName + "_incorrect",
            );

            cy.log(`enter incorrect answer for problem 2`);
            cy.get(mathinputAnchor).type("2y{enter}", { force: true });
            cy.get(mathinputSubmitAnchor).should("not.exist");
            cy.get(mathinputCorrectAnchor).should("not.exist");
            cy.get(mathinputIncorrectAnchor).should("be.visible");

            cy.log(`enter correct answer for problem 2`);
            cy.get(mathinputAnchor).type("{end}{backspace}x", { force: true });
            cy.get(mathinputSubmitAnchor).should("be.visible");
            cy.get(mathinputAnchor).type("{enter}", { force: true });
            cy.get(mathinputSubmitAnchor).should("not.exist");
            cy.get(mathinputCorrectAnchor).should("be.visible");
            cy.get(mathinputIncorrectAnchor).should("not.exist");
        });

        cy.get(cesc2("#/problem34/problem1/_p1"))
            .invoke("text")
            .then((text) => {
                let titleOptions = animalOptions.map(
                    (x) => `What does the ${x} say?`,
                );
                problem1Version = titleOptions.indexOf(text);
                expect(problem1Version).not.eq(-1);
            });

        cy.log(`select correct answer for problem 1`).then(() => {
            let animal = animalOptions[problem1Version];
            let sound = soundOptions[problem1Version];
            cy.get(cesc2("#/problem34/problem1/_choiceinput1"))
                .contains(sound)
                .click({ force: true });
            cy.get(cesc2("#/problem34/problem1/_choiceinput1_submit")).click();
            cy.get(cesc2("#/problem34/problem1/_choiceinput1_correct")).should(
                "be.visible",
            );
            cy.get(
                cesc2("#/problem34/problem1/_choiceinput1_incorrect"),
            ).should("not.exist");
            cy.get(cesc2("#/problem34/problem1/_feedback1")).should(
                "have.text",
                `That's right, the ${animal} goes ${sound}!`,
            );
            cy.get(cesc2("#/problem34/problem1/_feedback2")).should(
                "not.exist",
            );
        });

        cy.log(`select incorrect answer for problem 1`).then(() => {
            let incorrectInd = (problem1Version + 1) % 4;
            let sound = soundOptions[incorrectInd];
            cy.get(cesc2("#/problem34/problem1/_choiceinput1"))
                .contains(sound)
                .click({ force: true });
            cy.get(cesc2("#/problem34/problem1/_choiceinput1_submit")).click();
            cy.get(cesc2("#/problem34/problem1/_choiceinput1_correct")).should(
                "not.exist",
            );
            cy.get(
                cesc2("#/problem34/problem1/_choiceinput1_incorrect"),
            ).should("be.visible");
            cy.get(cesc2("#/problem34/problem1/_feedback1")).should(
                "not.exist",
            );
            cy.get(cesc2("#/problem34/problem1/_feedback2")).should(
                "have.text",
                `Try again.`,
            );
        });

        cy.get(cesc2("#/problem34/problem2/_title1")).should(
            "have.text",
            "Derivative problem",
        );

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            let mathinputName =
                stateVariables["/problem34/problem2/_answer1"].stateValues
                    .inputChildren[0].componentName;
            let mathinputAnchor = cesc2("#" + mathinputName) + " textarea";
            let mathinputSubmitAnchor = cesc2("#" + mathinputName + "_submit");
            let mathinputCorrectAnchor = cesc2(
                "#" + mathinputName + "_correct",
            );
            let mathinputIncorrectAnchor = cesc2(
                "#" + mathinputName + "_incorrect",
            );

            cy.log(`enter incorrect answer for problem 2`);
            cy.get(mathinputAnchor).type("2y{enter}", { force: true });
            cy.get(mathinputSubmitAnchor).should("not.exist");
            cy.get(mathinputCorrectAnchor).should("not.exist");
            cy.get(mathinputIncorrectAnchor).should("be.visible");

            cy.log(`enter correct answer for problem 2`);
            cy.get(mathinputAnchor).type("{end}{backspace}x", { force: true });
            cy.get(mathinputSubmitAnchor).should("be.visible");
            cy.get(mathinputAnchor).type("{enter}", { force: true });
            cy.get(mathinputSubmitAnchor).should("not.exist");
            cy.get(mathinputCorrectAnchor).should("be.visible");
            cy.get(mathinputIncorrectAnchor).should("not.exist");
        });
    });

    // this triggered an error not caught with the other order
    it("copy uri containing copy uri of two problems, newNamespace first", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <title>Four problems</title>

    <copy name="problem12" newNamespace uri="doenet:CID=bafkreid5s6fwzzfaax7pr3d2i2iu2743vvzrvttjy55vcmvunka7nu3ope" />
    
    <copy name="problem34" uri="doenet:CID=bafkreid5s6fwzzfaax7pr3d2i2iu2743vvzrvttjy55vcmvunka7nu3ope" />
    `,
                },
                "*",
            );
        });

        cy.get(cesc("#\\/_title1")).should("have.text", "Four problems"); // to wait for page to load

        let problem1Version;
        let animalOptions = ["cat", "dog", "mouse", "fish"];
        let soundOptions = ["meow", "woof", "squeak", "blub"];

        cy.get(cesc2("#/problem12/problem1/_p1"))
            .invoke("text")
            .then((text) => {
                let titleOptions = animalOptions.map(
                    (x) => `What does the ${x} say?`,
                );
                problem1Version = titleOptions.indexOf(text);
                expect(problem1Version).not.eq(-1);
            });

        cy.log(`select correct answer for problem 1`).then(() => {
            let animal = animalOptions[problem1Version];
            let sound = soundOptions[problem1Version];
            cy.get(cesc2("#/problem12/problem1/_choiceinput1"))
                .contains(sound)
                .click({ force: true });
            cy.get(cesc2("#/problem12/problem1/_choiceinput1_submit")).click();
            cy.get(cesc2("#/problem12/problem1/_choiceinput1_correct")).should(
                "be.visible",
            );
            cy.get(
                cesc2("#/problem12/problem1/_choiceinput1_incorrect"),
            ).should("not.exist");
            cy.get(cesc2("#/problem12/problem1/_feedback1")).should(
                "have.text",
                `That's right, the ${animal} goes ${sound}!`,
            );
            cy.get(cesc2("#/problem12/problem1/_feedback2")).should(
                "not.exist",
            );
        });

        cy.log(`select incorrect answer for problem 1`).then(() => {
            let incorrectInd = (problem1Version + 1) % 4;
            let sound = soundOptions[incorrectInd];
            cy.get(cesc2("#/problem12/problem1/_choiceinput1"))
                .contains(sound)
                .click({ force: true });
            cy.get(cesc2("#/problem12/problem1/_choiceinput1_submit")).click();
            cy.get(cesc2("#/problem12/problem1/_choiceinput1_correct")).should(
                "not.exist",
            );
            cy.get(
                cesc2("#/problem12/problem1/_choiceinput1_incorrect"),
            ).should("be.visible");
            cy.get(cesc2("#/problem12/problem1/_feedback1")).should(
                "not.exist",
            );
            cy.get(cesc2("#/problem12/problem1/_feedback2")).should(
                "have.text",
                `Try again.`,
            );
        });

        cy.get(cesc2("#/problem12/problem2/_title1")).should(
            "have.text",
            "Derivative problem",
        );

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            let mathinputName =
                stateVariables["/problem12/problem2/_answer1"].stateValues
                    .inputChildren[0].componentName;
            let mathinputAnchor = cesc2("#" + mathinputName) + " textarea";
            let mathinputSubmitAnchor = cesc2("#" + mathinputName + "_submit");
            let mathinputCorrectAnchor = cesc2(
                "#" + mathinputName + "_correct",
            );
            let mathinputIncorrectAnchor = cesc2(
                "#" + mathinputName + "_incorrect",
            );

            cy.log(`enter incorrect answer for problem 2`);
            cy.get(mathinputAnchor).type("2y{enter}", { force: true });
            cy.get(mathinputSubmitAnchor).should("not.exist");
            cy.get(mathinputCorrectAnchor).should("not.exist");
            cy.get(mathinputIncorrectAnchor).should("be.visible");

            cy.log(`enter correct answer for problem 2`);
            cy.get(mathinputAnchor).type("{end}{backspace}x", { force: true });
            cy.get(mathinputSubmitAnchor).should("be.visible");
            cy.get(mathinputAnchor).type("{enter}", { force: true });
            cy.get(mathinputSubmitAnchor).should("not.exist");
            cy.get(mathinputCorrectAnchor).should("be.visible");
            cy.get(mathinputIncorrectAnchor).should("not.exist");
        });

        cy.get(cesc2("#/problem34/problem1/_p1"))
            .invoke("text")
            .then((text) => {
                let titleOptions = animalOptions.map(
                    (x) => `What does the ${x} say?`,
                );
                problem1Version = titleOptions.indexOf(text);
                expect(problem1Version).not.eq(-1);
            });

        cy.log(`select correct answer for problem 1`).then(() => {
            let animal = animalOptions[problem1Version];
            let sound = soundOptions[problem1Version];
            cy.get(cesc2("#/problem34/problem1/_choiceinput1"))
                .contains(sound)
                .click({ force: true });
            cy.get(cesc2("#/problem34/problem1/_choiceinput1_submit")).click();
            cy.get(cesc2("#/problem34/problem1/_choiceinput1_correct")).should(
                "be.visible",
            );
            cy.get(
                cesc2("#/problem34/problem1/_choiceinput1_incorrect"),
            ).should("not.exist");
            cy.get(cesc2("#/problem34/problem1/_feedback1")).should(
                "have.text",
                `That's right, the ${animal} goes ${sound}!`,
            );
            cy.get(cesc2("#/problem34/problem1/_feedback2")).should(
                "not.exist",
            );
        });

        cy.log(`select incorrect answer for problem 1`).then(() => {
            let incorrectInd = (problem1Version + 1) % 4;
            let sound = soundOptions[incorrectInd];
            cy.get(cesc2("#/problem34/problem1/_choiceinput1"))
                .contains(sound)
                .click({ force: true });
            cy.get(cesc2("#/problem34/problem1/_choiceinput1_submit")).click();
            cy.get(cesc2("#/problem34/problem1/_choiceinput1_correct")).should(
                "not.exist",
            );
            cy.get(
                cesc2("#/problem34/problem1/_choiceinput1_incorrect"),
            ).should("be.visible");
            cy.get(cesc2("#/problem34/problem1/_feedback1")).should(
                "not.exist",
            );
            cy.get(cesc2("#/problem34/problem1/_feedback2")).should(
                "have.text",
                `Try again.`,
            );
        });

        cy.get(cesc2("#/problem34/problem2/_title1")).should(
            "have.text",
            "Derivative problem",
        );

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            let mathinputName =
                stateVariables["/problem34/problem2/_answer1"].stateValues
                    .inputChildren[0].componentName;
            let mathinputAnchor = cesc2("#" + mathinputName) + " textarea";
            let mathinputSubmitAnchor = cesc2("#" + mathinputName + "_submit");
            let mathinputCorrectAnchor = cesc2(
                "#" + mathinputName + "_correct",
            );
            let mathinputIncorrectAnchor = cesc2(
                "#" + mathinputName + "_incorrect",
            );

            cy.log(`enter incorrect answer for problem 2`);
            cy.get(mathinputAnchor).type("2y{enter}", { force: true });
            cy.get(mathinputSubmitAnchor).should("not.exist");
            cy.get(mathinputCorrectAnchor).should("not.exist");
            cy.get(mathinputIncorrectAnchor).should("be.visible");

            cy.log(`enter correct answer for problem 2`);
            cy.get(mathinputAnchor).type("{end}{backspace}x", { force: true });
            cy.get(mathinputSubmitAnchor).should("be.visible");
            cy.get(mathinputAnchor).type("{enter}", { force: true });
            cy.get(mathinputSubmitAnchor).should("not.exist");
            cy.get(mathinputCorrectAnchor).should("be.visible");
            cy.get(mathinputIncorrectAnchor).should("not.exist");
        });
    });

    it("copy uri containing variant control", () => {
        const doenetML = `
    <title>Two variants from copied document</title>
    
    <copy name="thedoc" uri="doenet:cid=bafkreia7xqmfuhas6yrpr7hilr5khjxqsuqddgurnutqczyebj7lzw7zyy" />
    `;

        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML,
                    requestedVariantIndex: 1,
                },
                "*",
            );
        });

        cy.get(cesc("#\\/_title1")).should(
            "have.text",
            "Two variants from copied document",
        ); // to wait for page to load

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();

            expect(
                stateVariables["/thedoc"].sharedParameters.allPossibleVariants,
            ).eqls(["first", "last"]);

            const variantOne =
                stateVariables["/thedoc"].sharedParameters.variantName;
            const variantTwo = variantOne === "first" ? "last" : "first";

            expect(
                stateVariables["/_document1"].sharedParameters
                    .allPossibleVariants,
            ).eqls(["a", "b"]);
            expect(
                stateVariables["/_document1"].sharedParameters.variantName,
            ).eq("a");

            cy.get(cesc("#\\/thedoc")).should("contain.text", variantOne);

            cy.window().then(async (win) => {
                win.postMessage(
                    {
                        doenetML,
                        requestedVariantIndex: 2,
                    },
                    "*",
                );
            });

            cy.get(cesc("#\\/thedoc")).should("contain.text", variantTwo);

            cy.window().then(async (win) => {
                let stateVariables = await win.returnAllStateVariables1();

                expect(
                    stateVariables["/thedoc"].sharedParameters
                        .allPossibleVariants,
                ).eqls(["first", "last"]);
                expect(
                    stateVariables["/thedoc"].sharedParameters.variantName,
                ).eq(variantTwo);
                expect(
                    stateVariables["/_document1"].sharedParameters
                        .allPossibleVariants,
                ).eqls(["a", "b"]);
                expect(
                    stateVariables["/_document1"].sharedParameters.variantName,
                ).eq("b");
            });
        });
    });

    it("copy uri not in a problem", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <copy name="problem1" uri="doenet:cId=bafkreidqud3rixmphu3jufuke4rw7magtcrbrjgeo6ihkoyonsig7wciey&DoenEtiD=abcdefg" />
  
    `,
                },
                "*",
            );
        });

        cy.get(cesc("#\\/problem1_title")).should("have.text", "Animal sounds");

        let problem1Version;
        let animalOptions = ["cat", "dog", "mouse", "fish"];
        let soundOptions = ["meow", "woof", "squeak", "blub"];

        cy.get(cesc2("#/problem1/_p1"))
            .invoke("text")
            .then((text) => {
                let titleOptions = animalOptions.map(
                    (x) => `What does the ${x} say?`,
                );
                problem1Version = titleOptions.indexOf(text);
                expect(problem1Version).not.eq(-1);
                cy.window().then(async (win) => {
                    let stateVariables = await win.returnAllStateVariables1();
                    let copy1Name = stateVariables["/problem1"].replacementOf;
                    expect(stateVariables[copy1Name].stateValues.cid).eq(
                        "bafkreidqud3rixmphu3jufuke4rw7magtcrbrjgeo6ihkoyonsig7wciey",
                    );
                    expect(stateVariables[copy1Name].stateValues.doenetId).eq(
                        "abcdefg",
                    );
                });
            });

        cy.log(`select correct answer for problem 1`).then(() => {
            let animal = animalOptions[problem1Version];
            let sound = soundOptions[problem1Version];
            cy.get(cesc2("#/problem1/_choiceinput1"))
                .contains(sound)
                .click({ force: true });
            cy.get(cesc2("#/problem1/_choiceinput1_submit")).click();
            cy.get(cesc2("#/problem1/_choiceinput1_correct")).should(
                "be.visible",
            );
            cy.get(cesc2("#/problem1/_choiceinput1_incorrect")).should(
                "not.exist",
            );
            cy.get(cesc2("#/problem1/_feedback1")).should(
                "have.text",
                `That's right, the ${animal} goes ${sound}!`,
            );
            cy.get(cesc2("#/problem1/_feedback2")).should("not.exist");
        });

        cy.log(`select incorrect answer for problem 1`).then(() => {
            let incorrectInd = (problem1Version + 1) % 4;
            let sound = soundOptions[incorrectInd];
            cy.get(cesc2("#/problem1/_choiceinput1"))
                .contains(sound)
                .click({ force: true });
            cy.get(cesc2("#/problem1/_choiceinput1_submit")).click();
            cy.get(cesc2("#/problem1/_choiceinput1_correct")).should(
                "not.exist",
            );
            cy.get(cesc2("#/problem1/_choiceinput1_incorrect")).should(
                "be.visible",
            );
            cy.get(cesc2("#/problem1/_feedback1")).should("not.exist");
            cy.get(cesc2("#/problem1/_feedback2")).should(
                "have.text",
                `Try again.`,
            );
        });
    });

    it("copyFromUri for uri not in a problem yields nothing", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <problem name="problem1" copyFromUri="doenet:cId=bafkreidqud3rixmphu3jufuke4rw7magtcrbrjgeo6ihkoyonsig7wciey&DoenEtiD=abcdefg" />
  
    `,
                },
                "*",
            );
        });

        cy.get(cesc("#\\/problem1_title")).should("have.text", "Problem 1");

        cy.get(cesc("#\\/_document1")).should(
            "not.contain.text",
            "Animal sounds",
        );

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(Object.keys(stateVariables).length).eq(3);
        });
    });

    it("copy group with link through name of external, no link", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <text>a</text>
    <group name="g" newNamespace>
    <copy uri="doenet:cid=bafkreide4mismb45mxved2ibfh5jnj75kty7vjz7w6zo7goyxpwr2e7wti" name="p" />
    <p>Credit achieved: <copy source="p/_answer1.creditAchieved" name="ca" /></p>
    </group>
    
    <copy source="g" link="false" name="g2" />
    `,
                },
                "*",
            );
        });

        // to wait for page to load
        cy.get(cesc("#\\/_text1")).should("have.text", "a");

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            let mathinput1Anchor =
                cesc2(
                    "#" +
                        stateVariables["/g/p/_answer1"].stateValues
                            .inputChildren[0].componentName,
                ) + " textarea";
            let mathinput2Anchor =
                cesc2(
                    "#" +
                        stateVariables["/g2/p/_answer1"].stateValues
                            .inputChildren[0].componentName,
                ) + " textarea";

            cy.get(cesc2("#/g/ca")).should("have.text", "0");
            cy.get(cesc2("#/g2/ca")).should("have.text", "0");

            cy.get(mathinput1Anchor).type("2x{enter}", { force: true });

            cy.get(cesc2("#/g/ca")).should("have.text", "1");
            cy.get(cesc2("#/g2/ca")).should("have.text", "0");

            cy.get(mathinput2Anchor).type("2x{enter}", { force: true });

            cy.get(cesc2("#/g/ca")).should("have.text", "1");
            cy.get(cesc2("#/g2/ca")).should("have.text", "1");
        });
    });

    it("copy group with link through name of external, no link, macros", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <text>a</text>
    <group name="g" newNamespace>
    <copy uri="doenet:cid=bafkreide4mismb45mxved2ibfh5jnj75kty7vjz7w6zo7goyxpwr2e7wti" name="p" />
    <p>Credit achieved: $(p/_answer1.creditAchieved{assignNames="ca"})</p>
    </group>
    
    $g{link="false" name="g2"}
    `,
                },
                "*",
            );
        });

        // to wait for page to load
        cy.get(cesc("#\\/_text1")).should("have.text", "a");

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            let mathinput1Anchor =
                cesc2(
                    "#" +
                        stateVariables["/g/p/_answer1"].stateValues
                            .inputChildren[0].componentName,
                ) + " textarea";
            let mathinput2Anchor =
                cesc2(
                    "#" +
                        stateVariables["/g2/p/_answer1"].stateValues
                            .inputChildren[0].componentName,
                ) + " textarea";

            cy.get(cesc2("#/g/ca")).should("have.text", "0");
            cy.get(cesc2("#/g2/ca")).should("have.text", "0");

            cy.get(mathinput1Anchor).type("2x{enter}", { force: true });

            cy.get(cesc2("#/g/ca")).should("have.text", "1");
            cy.get(cesc2("#/g2/ca")).should("have.text", "0");

            cy.get(mathinput2Anchor).type("2x{enter}", { force: true });

            cy.get(cesc2("#/g/ca")).should("have.text", "1");
            cy.get(cesc2("#/g2/ca")).should("have.text", "1");
        });
    });

    it("copy group with link through name of external, no link, with copySource", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <text>a</text>
    <group name="g" newNamespace>
    <problem copyfromuri="doenet:cid=bafkreide4mismb45mxved2ibfh5jnj75kty7vjz7w6zo7goyxpwr2e7wti" name="p" />
    <p>Credit achieved: <number copySource="p/_answer1.creditAchieved" name="ca" /></p>
    </group>
    
    <group copySource="g" link="false" name="g2" />
    `,
                },
                "*",
            );
        });

        // to wait for page to load
        cy.get(cesc("#\\/_text1")).should("have.text", "a");

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            let mathinput1Anchor =
                cesc2(
                    "#" +
                        stateVariables["/g/p/_answer1"].stateValues
                            .inputChildren[0].componentName,
                ) + " textarea";
            let mathinput2Anchor =
                cesc2(
                    "#" +
                        stateVariables["/g2/p/_answer1"].stateValues
                            .inputChildren[0].componentName,
                ) + " textarea";

            cy.get(cesc2("#/g/ca")).should("have.text", "0");
            cy.get(cesc2("#/g2/ca")).should("have.text", "0");

            cy.get(mathinput1Anchor).type("2x{enter}", { force: true });

            cy.get(cesc2("#/g/ca")).should("have.text", "1");
            cy.get(cesc2("#/g2/ca")).should("have.text", "0");

            cy.get(mathinput2Anchor).type("2x{enter}", { force: true });

            cy.get(cesc2("#/g/ca")).should("have.text", "1");
            cy.get(cesc2("#/g2/ca")).should("have.text", "1");
        });
    });

    it("asList when copy array prop, test renderers", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <choiceinput name="ci">
      <choice>yes</choice>
      <choice>no</choice>
      <choice>maybe</choice>
    </choiceinput>

    In document: $ci.choiceTexts
    <alert name="in_alert">$ci.choiceTexts</alert>
    <blockquote name="in_blockquote">$ci.choiceTexts</blockquote>
    <c name="in_c">$ci.choiceTexts</c>
    <caption name="in_caption">$ci.choiceTexts</caption>
    <cell name="in_cell">$ci.choiceTexts</cell>
    <choice name="in_choice">$ci.choiceTexts</choice>
    <span name="in_span">$ci.choiceTexts</span>
    <em name="in_em">$ci.choiceTexts</em>
    <feedback name="in_feedback">$ci.choiceTexts</feedback>
    <footnote name="in_footnote">$ci.choiceTexts</footnote>
    <hint name="in_hint_w_title"><title>A title</title>$ci.choiceTexts</hint>
    <hint name="in_hint_wo_title">$ci.choiceTexts</hint>
    <label name="in_label">$ci.choiceTexts</label>
    <ol>
      <li name="in_li">$ci.choiceTexts</li>
    </ol>
    <ul>
      <li name="in_li2">$ci.choiceTexts</li>
    </ul>
    <p name="in_p">$ci.choiceTexts</p>
    <pre name="in_pre">$ci.choiceTexts</pre>
    <p name="in_q"><q>$ci.choiceTexts</q></p>
    <section name="in_section_w_title"><title name="sec_title">Title: $ci.choiceTexts</title>Text: $ci.choiceTexts</section>
    <section name="in_section_wo_title">$ci.choiceTexts</section>
    <solution name="in_solution">$ci.choiceTexts</solution>
    <p name="in_sq"><sq>$ci.choiceTexts</sq></p>
    <text name="in_text">$ci.choiceTexts</text>

    `,
                },
                "*",
            );
        });

        cy.get(cesc2("#/_document1")).should(
            "contain.text",
            "In document: yes, no, maybe",
        );
        cy.get(cesc2("#/in_alert")).should("have.text", "yes, no, maybe");
        cy.get(cesc2("#/in_blockquote")).should("have.text", "yes, no, maybe");
        cy.get(cesc2("#/in_c")).should("have.text", "yes, no, maybe");
        cy.get(cesc2("#/in_caption")).should("have.text", "yes, no, maybe");
        cy.get(cesc2("#/in_cell")).should("have.text", "yes, no, maybe");
        cy.get(cesc2("#/in_choice")).should("have.text", "yes, no, maybe");
        cy.get(cesc2("#/in_span")).should("have.text", "yes, no, maybe");
        cy.get(cesc2("#/in_em")).should("have.text", "yes, no, maybe");
        cy.get(cesc2("#/in_feedback")).should("have.text", "yes, no, maybe");
        cy.get(cesc2("#/in_footnote")).click();
        cy.get(cesc2("#/in_footnote")).should("contain.text", "yes, no, maybe");
        cy.get(cesc2("#/in_hint_w_title")).click();
        cy.get(cesc2("#/in_hint_w_title")).should(
            "contain.text",
            "yes, no, maybe",
        );
        cy.get(cesc2("#/in_hint_wo_title")).click();
        cy.get(cesc2("#/in_hint_wo_title")).should(
            "contain.text",
            "yes, no, maybe",
        );
        cy.get(cesc2("#/in_label")).should("have.text", "yes, no, maybe");
        cy.get(cesc2("#/in_li")).should("have.text", "yes, no, maybe");
        cy.get(cesc2("#/in_li2")).should("have.text", "yes, no, maybe");
        cy.get(cesc2("#/in_p")).should("have.text", "yes, no, maybe");
        cy.get(cesc2("#/in_pre")).should("have.text", "yes, no, maybe");
        cy.get(cesc2("#/in_q")).should("have.text", "“yes, no, maybe”");
        cy.get(cesc2("#/in_section_w_title")).should(
            "contain.text",
            "Title: yes, no, maybe",
        );
        cy.get(cesc2("#/in_section_w_title")).should(
            "contain.text",
            "Text: yes, no, maybe",
        );
        cy.get(cesc2("#/in_section_wo_title")).should(
            "contain.text",
            "yes, no, maybe",
        );
        cy.get(cesc2("#/in_solution")).click();
        cy.get(cesc2("#/in_solution")).should("contain.text", "yes, no, maybe");
        cy.get(cesc2("#/in_sq")).should("have.text", "‘yes, no, maybe’");
        cy.get(cesc2("#/in_text")).should("have.text", "yes, no, maybe");

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(stateVariables["/in_alert"].stateValues.text).eq(
                "yes, no, maybe",
            );
            expect(stateVariables["/in_c"].stateValues.text).eq(
                "yes, no, maybe",
            );
            expect(stateVariables["/in_caption"].stateValues.text).eq(
                "yes, no, maybe",
            );
            expect(stateVariables["/in_cell"].stateValues.text).eq(
                "yes, no, maybe",
            );
            expect(stateVariables["/in_choice"].stateValues.text).eq(
                "yes, no, maybe",
            );
            expect(stateVariables["/in_em"].stateValues.text).eq(
                "yes, no, maybe",
            );
            expect(stateVariables["/in_footnote"].stateValues.text).eq(
                "yes, no, maybe",
            );
            expect(stateVariables["/in_label"].stateValues.text).eq(
                "yes, no, maybe",
            );
            expect(stateVariables["/in_p"].stateValues.text).eq(
                "yes, no, maybe",
            );
            expect(stateVariables["/in_text"].stateValues.text).eq(
                "yes, no, maybe",
            );
            expect(stateVariables["/sec_title"].stateValues.text).eq(
                "Title: yes, no, maybe",
            );
        });
    });

    it("copy number from external content multiple ways, change attributes", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `

    <p><copy uri="doenet:cid=bafkreiewuu4vpro2d3vxm3wmclbsgzcsdsswhmtfcrqq7m6datze2tiwu4" /></p>

    <p><copy uri="doenet:cid=bafkreiewuu4vpro2d3vxm3wmclbsgzcsdsswhmtfcrqq7m6datze2tiwu4" name="n2" displayDigits="10" /></p>

    <p><number copyFromURI="doenet:cid=bafkreiewuu4vpro2d3vxm3wmclbsgzcsdsswhmtfcrqq7m6datze2tiwu4" /></p>

    <p><number copyFromURI="doenet:cid=bafkreiewuu4vpro2d3vxm3wmclbsgzcsdsswhmtfcrqq7m6datze2tiwu4" displayDigits="10" name="n4" /></p>

    <p><copy uri="doenet:cid=bafkreiewuu4vpro2d3vxm3wmclbsgzcsdsswhmtfcrqq7m6datze2tiwu4" newNamespace /></p>

    <p><copy uri="doenet:cid=bafkreiewuu4vpro2d3vxm3wmclbsgzcsdsswhmtfcrqq7m6datze2tiwu4" name="n6" displayDigits="10" newNamespace /></p>

    <p><number copyFromURI="doenet:cid=bafkreiewuu4vpro2d3vxm3wmclbsgzcsdsswhmtfcrqq7m6datze2tiwu4" newNamespace /></p>

    <p><number copyFromURI="doenet:cid=bafkreiewuu4vpro2d3vxm3wmclbsgzcsdsswhmtfcrqq7m6datze2tiwu4" displayDigits="10" name="n8" newNamespace /></p>

    `,
                },
                "*",
            );
        });

        cy.get(cesc("#\\/_p1")).should("have.text", "8.85");
        cy.get(cesc("#\\/n2")).should("have.text", "8.853729375");
        cy.get(cesc("#\\/_number1")).should("have.text", "8.85");
        cy.get(cesc("#\\/n4")).should("have.text", "8.853729375");
        cy.get(cesc("#\\/_p5")).should("have.text", "8.85");
        cy.get(cesc("#\\/n6")).should("have.text", "8.853729375");
        cy.get(cesc("#\\/_number3")).should("have.text", "8.85");
        cy.get(cesc("#\\/n8")).should("have.text", "8.853729375");
    });
});
