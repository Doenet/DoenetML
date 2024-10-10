import { cesc } from "@doenet/utils";

describe("Polygon Tag Tests", function () {
    beforeEach(() => {
        cy.clearIndexedDB();
        cy.visit("/");
    });

    it("style description changes with theme", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <setup>
      <styleDefinitions>
        <styleDefinition styleNumber="1" lineColor="brown" lineColorDarkMode="yellow" fillColor="brown" fillColorDarkMode="yellow" />
        <styleDefinition styleNumber="2" lineColor="#540907" lineColorWord="dark red" lineColorDarkMode="#f0c6c5" lineColorWordDarkMode="light red" fillColor="#540907" fillColorWord="dark red" fillColorDarkMode="#f0c6c5" fillColorWordDarkMode="light red" />
      </styleDefinitions>
    </setup>
    <graph>
      <polygon name="A" styleNumber="1" labelIsName vertices="(0,0) (0,2) (2,0)" filled />
      <polygon name="B" styleNumber="2" labelIsName vertices="(2,2) (2,4) (4,2)" filled />
      <polygon name="C" styleNumber="5" labelIsName vertices="(4,4) (4,6) (6,4)" filled />
    </graph>
    <p name="Adescrip">Polygon A is $A.styleDescription.</p>
    <p name="Bdescrip">B is a $B.styleDescriptionWithNoun.</p>
    <p name="Cdescrip">C is a $C.styleDescriptionWithNoun.</p>
    <p name="Aborderdescrip">A has a $A.borderStyleDescription border.</p>
    <p name="Bborderdescrip">B has a $B.borderStyleDescription border.</p>
    <p name="Cborderdescrip">C has a $C.borderStyleDescription border.</p>
    <p name="Afilldescrip">A has a $A.fillStyleDescription fill.</p>
    <p name="Bfilldescrip">B has a $B.fillStyleDescription fill.</p>
    <p name="Cfilldescrip">C has a $C.fillStyleDescription fill.</p>
    `,
                },
                "*",
            );
        });

        cy.get(cesc("#\\/Adescrip")).should(
            "have.text",
            "Polygon A is filled brown with thick border.",
        );
        cy.get(cesc("#\\/Bdescrip")).should(
            "have.text",
            "B is a filled dark red polygon.",
        );
        cy.get(cesc("#\\/Cdescrip")).should(
            "have.text",
            "C is a filled black polygon with a thin border.",
        );
        cy.get(cesc("#\\/Aborderdescrip")).should(
            "have.text",
            "A has a thick brown border.",
        );
        cy.get(cesc("#\\/Bborderdescrip")).should(
            "have.text",
            "B has a dark red border.",
        );
        cy.get(cesc("#\\/Cborderdescrip")).should(
            "have.text",
            "C has a thin black border.",
        );
        cy.get(cesc("#\\/Afilldescrip")).should(
            "have.text",
            "A has a brown fill.",
        );
        cy.get(cesc("#\\/Bfilldescrip")).should(
            "have.text",
            "B has a dark red fill.",
        );
        cy.get(cesc("#\\/Cfilldescrip")).should(
            "have.text",
            "C has a black fill.",
        );

        cy.log("set dark mode");
        cy.get("#testRunner_toggleControls").click();
        cy.get("#testRunner_darkMode").click();
        cy.wait(100);
        cy.get("#testRunner_toggleControls").click();

        cy.get(cesc("#\\/Adescrip")).should(
            "have.text",
            "Polygon A is filled yellow with thick border.",
        );
        cy.get(cesc("#\\/Bdescrip")).should(
            "have.text",
            "B is a filled light red polygon.",
        );
        cy.get(cesc("#\\/Cdescrip")).should(
            "have.text",
            "C is a filled white polygon with a thin border.",
        );
        cy.get(cesc("#\\/Aborderdescrip")).should(
            "have.text",
            "A has a thick yellow border.",
        );
        cy.get(cesc("#\\/Bborderdescrip")).should(
            "have.text",
            "B has a light red border.",
        );
        cy.get(cesc("#\\/Cborderdescrip")).should(
            "have.text",
            "C has a thin white border.",
        );
        cy.get(cesc("#\\/Afilldescrip")).should(
            "have.text",
            "A has a yellow fill.",
        );
        cy.get(cesc("#\\/Bfilldescrip")).should(
            "have.text",
            "B has a light red fill.",
        );
        cy.get(cesc("#\\/Cfilldescrip")).should(
            "have.text",
            "C has a white fill.",
        );
    });

    //     it("Rigid polygon, vertex constraint", () => {
    //         cy.window().then(async (win) => {
    //             win.postMessage(
    //                 {
    //                     doenetML: `
    //   <text>a</text>
    //   <graph name="g1" newNamespace>
    //     <point>(3,7)</point>
    //     <point>(-4,-1)</point>
    //     <point>(8,2)</point>
    //     <point>(-3,4)</point>

    //     <point styleNumber="2" name="a1">(1,9)</point>
    //     <polygon vertices="$_point1 $_point2 $_point3 $_point4" name="pg" rigid >
    //         <vertexConstraints>
    //             <attractTo threshold="2">$a1</attractTo>
    //         </vertexConstraints>
    //     </polygon>
    //   </graph>
    //   <graph name="g2" newNamespace>
    //     $(../g1/pg{name="pg"})
    //   </graph>
    //   $g2{name="g3"}
    //   $(g1/pg.vertices{assignNames="p1 p2 p3 p4"})
    //   `,
    //                 },
    //                 "*",
    //             );
    //         });
    //         cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

    //         let vertices = [
    //             [3, 7],
    //             [-4, -1],
    //             [8, 2],
    //             [-3, 4],
    //         ];

    //         let centroid = vertices.reduce(
    //             (a, c) => [a[0] + c[0], a[1] + c[1]],
    //             [0, 0],
    //         );
    //         centroid[0] /= 4;
    //         centroid[1] /= 4;

    //         testPolygonCopiedTwice({ vertices });

    //         cy.log("move individual vertex rotates, attracts to point");
    //         cy.window().then(async (win) => {
    //             // rotate by 90 degrees counterclockwise around centroid
    //             // (shrinking by 1/2, but that will be ignored)
    //             let requested_vertex_1 = [
    //                 -0.5 * (vertices[1][1] - centroid[1]) + centroid[0],
    //                 0.5 * (vertices[1][0] - centroid[0]) + centroid[1],
    //             ];
    //             vertices = vertices.map((v) => [
    //                 -(v[1] - centroid[1]) + centroid[0],
    //                 v[0] - centroid[0] + centroid[1],
    //             ]);
    //             // since attracted to point, moves down one and to the left
    //             vertices = vertices.map((v) => [v[0] - 1, v[1] - 1]);

    //             win.callAction1({
    //                 actionName: "movePolygon",
    //                 componentName: "/g1/pg",
    //                 args: {
    //                     pointCoords: { 1: requested_vertex_1 },
    //                 },
    //             });

    //             testPolygonCopiedTwice({ vertices });
    //         });

    //         cy.log("rotating further so no attraction preserves old centroid");
    //         cy.window().then(async (win) => {
    //             // location of vertices if weren't attracted to point, moves up one and to the right
    //             vertices = vertices.map((v) => [v[0] + 1, v[1] + 1]);

    //             // rotate by another 90 degrees counterclockwise around centroid
    //             // (doubling but that will be ignored)
    //             let requested_vertex_1 = [
    //                 -2 * (vertices[1][1] - centroid[1]) + centroid[0],
    //                 2 * (vertices[1][0] - centroid[0]) + centroid[1],
    //             ];
    //             vertices = vertices.map((v) => [
    //                 -(v[1] - centroid[1]) + centroid[0],
    //                 v[0] - centroid[0] + centroid[1],
    //             ]);

    //             win.callAction1({
    //                 actionName: "movePolygon",
    //                 componentName: "/g1/pg",
    //                 args: {
    //                     pointCoords: { 1: requested_vertex_1 },
    //                 },
    //             });

    //             testPolygonCopiedTwice({ vertices });
    //         });

    //         cy.log(
    //             "move copied polygon up and to the left chooses minimum moved and gets attracted",
    //         );
    //         cy.window().then(async (win) => {
    //             let moveX = -4;
    //             let moveY = 1;

    //             // add extra movement to requested vertices, which will be ignored
    //             let requested_vertices = [];
    //             for (let i = 0; i < vertices.length; i++) {
    //                 vertices[i][0] = vertices[i][0] + moveX;
    //                 vertices[i][1] = vertices[i][1] + moveY;
    //                 requested_vertices.push([
    //                     vertices[i][0] - i,
    //                     vertices[i][1] + 2 * i,
    //                 ]);
    //             }

    //             // since attracted to point, moves up one and to the left
    //             vertices = vertices.map((v) => [v[0] - 1, v[1] + 1]);

    //             win.callAction1({
    //                 actionName: "movePolygon",
    //                 componentName: "/g2/pg",
    //                 args: {
    //                     pointCoords: requested_vertices,
    //                 },
    //             });

    //             testPolygonCopiedTwice({ vertices });
    //         });

    //         cy.log(
    //             "move double copied individual vertex, getting rotation around new centroid",
    //         );
    //         cy.window().then(async (win) => {
    //             let centroid = vertices.reduce(
    //                 (a, c) => [a[0] + c[0], a[1] + c[1]],
    //                 [0, 0],
    //             );
    //             centroid[0] /= 4;
    //             centroid[1] /= 4;

    //             // rotate by 180 degrees around centroid
    //             // (doubling length, but that will be ignored)
    //             let requested_vertex_2 = [
    //                 -2 * (vertices[2][0] - centroid[0]) + centroid[0],
    //                 -2 * (vertices[2][1] - centroid[1]) + centroid[1],
    //             ];
    //             vertices = vertices.map((v) => [
    //                 -(v[0] - centroid[0]) + centroid[0],
    //                 -(v[1] - centroid[1]) + centroid[1],
    //             ]);

    //             win.callAction1({
    //                 actionName: "movePolygon",
    //                 componentName: "/g3/pg",
    //                 args: {
    //                     pointCoords: { 2: requested_vertex_2 },
    //                 },
    //             });

    //             testPolygonCopiedTwice({ vertices });
    //         });
    //     });

    //     it("Rigid polygon, three vertex constraints", () => {
    //         cy.window().then(async (win) => {
    //             win.postMessage(
    //                 {
    //                     doenetML: `
    //   <text>a</text>
    //   <graph name="g1" newNamespace>
    //     <point>(3,7)</point>
    //     <point>(-4,-1)</point>
    //     <point>(8,2)</point>
    //     <point>(-3,4)</point>

    //     <point styleNumber="2" name="a1">(1,9)</point>
    //     <point styleNumber="2" name="a2">(5,-1)</point>
    //     <point styleNumber="2" name="a3">(-9,5)</point>
    //     <polygon vertices="$_point1 $_point2 $_point3 $_point4" name="pg" rigid >
    //     <vertexConstraints>
    //       <attractTo threshold="2">$a1$a2$a3</attractTo>
    //     </vertexConstraints>
    //     </polygon>
    //   </graph>
    //   <graph name="g2" newNamespace>
    //     $(../g1/pg{name="pg"})
    //   </graph>
    //   $g2{name="g3"}
    //   $(g1/pg.vertices{assignNames="p1 p2 p3 p4"})
    //   `,
    //                 },
    //                 "*",
    //             );
    //         });
    //         cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

    //         let vertices = [
    //             [3, 7],
    //             [-4, -1],
    //             [8, 2],
    //             [-3, 4],
    //         ];

    //         let centroid = vertices.reduce(
    //             (a, c) => [a[0] + c[0], a[1] + c[1]],
    //             [0, 0],
    //         );
    //         centroid[0] /= 4;
    //         centroid[1] /= 4;

    //         testPolygonCopiedTwice({ vertices });

    //         cy.log("move individual vertex rotates, attracts to closest point");
    //         cy.window().then(async (win) => {
    //             // rotate by 90 degrees counterclockwise around centroid
    //             // (shrinking by 1/2, but that will be ignored)
    //             let requested_vertex_1 = [
    //                 -0.5 * (vertices[1][1] - centroid[1]) + centroid[0],
    //                 0.5 * (vertices[1][0] - centroid[0]) + centroid[1],
    //             ];
    //             vertices = vertices.map((v) => [
    //                 -(v[1] - centroid[1]) + centroid[0],
    //                 v[0] - centroid[0] + centroid[1],
    //             ]);
    //             // since attracted to closest point (5,-2), moves up one
    //             vertices = vertices.map((v) => [v[0], v[1] + 1]);

    //             win.callAction1({
    //                 actionName: "movePolygon",
    //                 componentName: "/g1/pg",
    //                 args: {
    //                     pointCoords: { 1: requested_vertex_1 },
    //                 },
    //             });

    //             testPolygonCopiedTwice({ vertices });
    //         });

    //         cy.log("rotating further so no attraction preserves old centroid");
    //         cy.window().then(async (win) => {
    //             // location of vertices if weren't attracted to point, moves down one
    //             vertices = vertices.map((v) => [v[0], v[1] - 1]);

    //             // rotate by another 90 degrees counterclockwise around centroid
    //             // (doubling but that will be ignored)
    //             let requested_vertex_1 = [
    //                 -2 * (vertices[1][1] - centroid[1]) + centroid[0],
    //                 2 * (vertices[1][0] - centroid[0]) + centroid[1],
    //             ];
    //             vertices = vertices.map((v) => [
    //                 -(v[1] - centroid[1]) + centroid[0],
    //                 v[0] - centroid[0] + centroid[1],
    //             ]);

    //             win.callAction1({
    //                 actionName: "movePolygon",
    //                 componentName: "/g1/pg",
    //                 args: {
    //                     pointCoords: { 1: requested_vertex_1 },
    //                 },
    //             });

    //             testPolygonCopiedTwice({ vertices });
    //         });

    //         cy.log(
    //             "move copied polygon up and to the left chooses minimum moved and gets attracted",
    //         );
    //         cy.window().then(async (win) => {
    //             let moveX = -4;
    //             let moveY = 1;

    //             // add extra movement to requested vertices, which will be ignored
    //             let requested_vertices = [];
    //             for (let i = 0; i < vertices.length; i++) {
    //                 vertices[i][0] = vertices[i][0] + moveX;
    //                 vertices[i][1] = vertices[i][1] + moveY;
    //                 requested_vertices.push([
    //                     vertices[i][0] - i,
    //                     vertices[i][1] + 2 * i,
    //                 ]);
    //             }

    //             // since attracted to point (-9,5), moves one to the right
    //             vertices = vertices.map((v) => [v[0] + 1, v[1]]);

    //             win.callAction1({
    //                 actionName: "movePolygon",
    //                 componentName: "/g2/pg",
    //                 args: {
    //                     pointCoords: requested_vertices,
    //                 },
    //             });

    //             testPolygonCopiedTwice({ vertices });
    //         });

    //         cy.log(
    //             "move double copied individual vertex, getting rotation around new centroid, then attracted to point",
    //         );
    //         cy.window().then(async (win) => {
    //             let centroid = vertices.reduce(
    //                 (a, c) => [a[0] + c[0], a[1] + c[1]],
    //                 [0, 0],
    //             );
    //             centroid[0] /= 4;
    //             centroid[1] /= 4;

    //             // rotate by 180 degrees around centroid
    //             // (doubling length, but that will be ignored)
    //             let requested_vertex_2 = [
    //                 -2 * (vertices[2][0] - centroid[0]) + centroid[0],
    //                 -2 * (vertices[2][1] - centroid[1]) + centroid[1],
    //             ];
    //             vertices = vertices.map((v) => [
    //                 -(v[0] - centroid[0]) + centroid[0],
    //                 -(v[1] - centroid[1]) + centroid[1],
    //             ]);

    //             // since a different vertex is attracted to point (1,9), moves one up and to the right
    //             vertices = vertices.map((v) => [v[0] + 1, v[1] + 1]);

    //             win.callAction1({
    //                 actionName: "movePolygon",
    //                 componentName: "/g3/pg",
    //                 args: {
    //                     pointCoords: { 2: requested_vertex_2 },
    //                 },
    //             });

    //             testPolygonCopiedTwice({ vertices });
    //         });
    //     });

    //     it("Non-rigid polygon, three vertex constraints", () => {
    //         cy.window().then(async (win) => {
    //             win.postMessage(
    //                 {
    //                     doenetML: `
    // <text>a</text>
    // <graph name="g1" newNamespace>
    //   <point>(3,7)</point>
    //   <point>(-4,-1)</point>
    //   <point>(8,2)</point>
    //   <point>(-3,4)</point>

    //   <point styleNumber="2" name="a1">(1,9)</point>
    //   <point styleNumber="2" name="a2">(5,-1)</point>
    //   <point styleNumber="2" name="a3">(-9,5)</point>
    //   <polygon vertices="$_point1 $_point2 $_point3 $_point4" name="pg" >
    //   <vertexConstraints>
    //     <attractTo threshold="2">$a1$a2$a3</attractTo>
    //   </vertexConstraints>
    //   </polygon>
    // </graph>
    // <graph name="g2" newNamespace>
    //   $(../g1/pg{name="pg"})
    //   $pg.vertices{assignNames="v1 v2 v3 v4"}
    // </graph>
    // $g2{name="g3"}
    // $(g1/pg.vertices{assignNames="p1 p2 p3 p4"})
    // `,
    //                 },
    //                 "*",
    //             );
    //         });
    //         cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

    //         let vertices = [
    //             [3, 7],
    //             [-4, -1],
    //             [8, 2],
    //             [-3, 4],
    //         ];

    //         testPolygonCopiedTwice({ vertices });

    //         cy.log("move individual vertex, attracts to closest point");
    //         cy.window().then(async (win) => {
    //             let requested_vertex_1 = [-10, 6];

    //             vertices[1] = [-9, 5];
    //             win.callAction1({
    //                 actionName: "movePolygon",
    //                 componentName: "/g1/pg",
    //                 args: {
    //                     pointCoords: { 1: requested_vertex_1 },
    //                 },
    //             });

    //             testPolygonCopiedTwice({ vertices });
    //         });

    //         cy.log("Moving entire polygon up attract to another point");

    //         cy.window().then(async (win) => {
    //             let moveX = -1;
    //             let moveY = 1;

    //             let requested_vertices = [];
    //             for (let i = 0; i < vertices.length; i++) {
    //                 vertices[i][0] = vertices[i][0] + moveX;
    //                 vertices[i][1] = vertices[i][1] + moveY;
    //                 requested_vertices.push([vertices[i][0], vertices[i][1]]);
    //             }

    //             // since attracted to point (1,9), moves one up and to the left
    //             vertices = vertices.map((v) => [v[0] - 1, v[1] + 1]);

    //             win.callAction1({
    //                 actionName: "movePolygon",
    //                 componentName: "/g2/pg",
    //                 args: {
    //                     pointCoords: requested_vertices,
    //                 },
    //             });

    //             testPolygonCopiedTwice({ vertices });
    //         });

    //         cy.log("move double copied individual vertex");
    //         cy.window().then(async (win) => {
    //             vertices[2] = [2, 1];

    //             win.callAction1({
    //                 actionName: "movePolygon",
    //                 componentName: "/g3/pg",
    //                 args: {
    //                     pointCoords: { 2: vertices[2] },
    //                 },
    //             });

    //             testPolygonCopiedTwice({ vertices });
    //         });

    //         cy.log("Moving entire polygon near two points, attracts to just one");
    //         cy.window().then(async (win) => {
    //             let moveX = 2.6;
    //             let moveY = -2;

    //             let requested_vertices = [];
    //             for (let i = 0; i < vertices.length; i++) {
    //                 vertices[i][0] = vertices[i][0] + moveX;
    //                 vertices[i][1] = vertices[i][1] + moveY;
    //                 requested_vertices.push([vertices[i][0], vertices[i][1]]);
    //             }

    //             // since attracted to point (5,-1), moves 0.4 to the right
    //             vertices = vertices.map((v) => [v[0] + 0.4, v[1]]);

    //             win.callAction1({
    //                 actionName: "movePolygon",
    //                 componentName: "/g2/pg",
    //                 args: {
    //                     pointCoords: requested_vertices,
    //                 },
    //             });

    //             testPolygonCopiedTwice({ vertices });
    //         });

    //         cy.log(
    //             "Moving just one vertex attracts to other nearby vertex to attractor",
    //         );
    //         cy.window().then(async (win) => {
    //             let requested_vertex_0 = [0, 10];
    //             vertices[0] = [1, 9];
    //             vertices[1] = [-9, 5];

    //             win.callAction1({
    //                 actionName: "movePoint",
    //                 componentName: "/g2/v1",
    //                 args: { x: requested_vertex_0[0], y: requested_vertex_0[1] },
    //             });

    //             testPolygonCopiedTwice({ vertices });
    //         });
    //     });

    //     it("Rigid polygon, vertices attracted to polygon", () => {
    //         cy.window().then(async (win) => {
    //             win.postMessage(
    //                 {
    //                     doenetML: `
    //   <text>a</text>
    //   <graph name="g1" newNamespace>
    //     <polygon name="pa" vertices="(0,0) (12,0) (6,9)" stylenumber="2" />

    //     <point name="v1">(-1,0)</point>
    //     <point name="v2">(3,0)</point>
    //     <point name="v3">(1,-3)</point>
    //     <polygon name="pg" vertices="$v1 $v2 $v3" rigid layer="2">
    //        <vertexConstraints>
    //          <attractTo threshold="2">$pa</attractTo>
    //       </vertexConstraints>
    //     </polygon>
    //   </graph>
    //   <graph name="g2" newNamespace>
    //     $(../g1/pg{name="pg"})
    //   </graph>
    //   $g2{name="g3"}
    //   $(g1/pg.vertices{assignNames="p1 p2 p3 p4"})
    //   `,
    //                 },
    //                 "*",
    //             );
    //         });
    //         cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

    //         cy.log("start shifted so that two vertices are attracted");

    //         let vertices = [
    //             [0, 0],
    //             [4, 0],
    //             [2, -3],
    //         ];

    //         testPolygonCopiedTwice({ vertices });

    //         cy.log("move individual vertex rotates, attracts to edge of polygon");

    //         let centroid = vertices.reduce(
    //             (a, c) => [a[0] + c[0], a[1] + c[1]],
    //             [0, 0],
    //         );
    //         centroid[0] /= 3;
    //         centroid[1] /= 3;

    //         cy.window().then(async (win) => {
    //             // shift 1 to left to give original before attraction
    //             centroid[0] -= 1;
    //             vertices = vertices.map((v) => [v[0] - 1, v[1]]);

    //             // rotate by 90 degrees clockwise around centroid
    //             // (shrinking by 1/2, but that will be ignored)
    //             let requested_vertex_1 = [
    //                 0.5 * (vertices[1][1] - centroid[1]) + centroid[0],
    //                 -0.5 * (vertices[1][0] - centroid[0]) + centroid[1],
    //             ];
    //             vertices = vertices.map((v) => [
    //                 v[1] - centroid[1] + centroid[0],
    //                 -(v[0] - centroid[0]) + centroid[1],
    //             ]);
    //             // since attracted to edge, moves down one and to the left
    //             vertices = vertices.map((v) => [v[0], v[1] - 1]);

    //             win.callAction1({
    //                 actionName: "movePolygon",
    //                 componentName: "/g1/pg",
    //                 args: {
    //                     pointCoords: { 1: requested_vertex_1 },
    //                 },
    //             });

    //             testPolygonCopiedTwice({ vertices });
    //         });

    //         cy.log("move copied polygon up and to the right");
    //         cy.window().then(async (win) => {
    //             // Move so that bottom right gets attracted to (4,6).
    //             // Slope of orthogonal to attractor edge is -6/9.
    //             // So move bottom right to (4,6) + (9,-6)/10

    //             let requested_bottom_right = [4 + 0.9, 6 - 0.6];
    //             let actual_bottom_right = [4, 6];

    //             let moveX = requested_bottom_right[0] - vertices[1][0];
    //             let moveY = requested_bottom_right[1] - vertices[1][1];

    //             // add extra movement to requested vertices, which will be ignored
    //             let requested_vertices = [];
    //             for (let i = 0; i < vertices.length; i++) {
    //                 vertices[i][0] = vertices[i][0] + moveX;
    //                 vertices[i][1] = vertices[i][1] + moveY;
    //                 requested_vertices.push([
    //                     vertices[i][0] + i,
    //                     vertices[i][1] + 2 * i,
    //                 ]);
    //             }

    //             // since attracted to point, moves up one and to the left
    //             vertices = vertices.map((v) => [
    //                 v[0] + actual_bottom_right[0] - requested_bottom_right[0],
    //                 v[1] + actual_bottom_right[1] - requested_bottom_right[1],
    //             ]);

    //             win.callAction1({
    //                 actionName: "movePolygon",
    //                 componentName: "/g2/pg",
    //                 args: {
    //                     pointCoords: requested_vertices,
    //                 },
    //             });

    //             testPolygonCopiedTwice({ vertices });
    //         });
    //     });

    //     it("Rigid polygon, vertices attracted to polyline", () => {
    //         cy.window().then(async (win) => {
    //             win.postMessage(
    //                 {
    //                     doenetML: `
    //   <text>a</text>
    //   <graph name="g1" newNamespace>
    //     <polyline name="pa" vertices="(0,0) (12,0) (6,9)" stylenumber="2" />

    //     <point name="v1">(-1,0)</point>
    //     <point name="v2">(3,0)</point>
    //     <point name="v3">(1,-3)</point>
    //     <polygon name="pg" vertices="$v1 $v2 $v3" rigid layer="2">
    //        <vertexConstraints>
    //          <attractTo threshold="2">$pa</attractTo>
    //       </vertexConstraints>
    //     </polygon>
    //   </graph>
    //   <graph name="g2" newNamespace>
    //     $(../g1/pg{name="pg"})
    //   </graph>
    //   $g2{name="g3"}
    //   $(g1/pg.vertices{assignNames="p1 p2 p3 p4"})
    //   `,
    //                 },
    //                 "*",
    //             );
    //         });
    //         cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

    //         cy.log("start shifted so that two vertices are attracted");

    //         let vertices = [
    //             [0, 0],
    //             [4, 0],
    //             [2, -3],
    //         ];

    //         testPolygonCopiedTwice({ vertices });

    //         cy.log("move individual vertex rotates, attracts to edge of polygon");

    //         let centroid = vertices.reduce(
    //             (a, c) => [a[0] + c[0], a[1] + c[1]],
    //             [0, 0],
    //         );
    //         centroid[0] /= 3;
    //         centroid[1] /= 3;

    //         cy.window().then(async (win) => {
    //             // shift 1 to left to give original before attraction
    //             centroid[0] -= 1;
    //             vertices = vertices.map((v) => [v[0] - 1, v[1]]);

    //             // rotate by 90 degrees clockwise around centroid
    //             // (shrinking by 1/2, but that will be ignored)
    //             let requested_vertex_1 = [
    //                 0.5 * (vertices[1][1] - centroid[1]) + centroid[0],
    //                 -0.5 * (vertices[1][0] - centroid[0]) + centroid[1],
    //             ];
    //             vertices = vertices.map((v) => [
    //                 v[1] - centroid[1] + centroid[0],
    //                 -(v[0] - centroid[0]) + centroid[1],
    //             ]);
    //             // since attracted to edge, moves down one and to the left
    //             vertices = vertices.map((v) => [v[0], v[1] - 1]);

    //             win.callAction1({
    //                 actionName: "movePolygon",
    //                 componentName: "/g1/pg",
    //                 args: {
    //                     pointCoords: { 1: requested_vertex_1 },
    //                 },
    //             });

    //             testPolygonCopiedTwice({ vertices });
    //         });

    //         cy.log("move copied polygon up and to the right");
    //         cy.window().then(async (win) => {
    //             // Move so that bottom right would get attracted to (4,6) if it where a polygon.
    //             // But since it is a polyline, that edge doesn't exist
    //             // and instead the upper right gets attracted to other edge.

    //             // If had polygon,
    //             // slope of orthogonal to attractor edge would be -6/9.
    //             // So move bottom right to (4,6) + (9,-6)/10

    //             let requested_bottom_right = [4 + 0.9, 6 - 0.6];
    //             let actual_bottom_right = [6, 5];

    //             let moveX = requested_bottom_right[0] - vertices[1][0];
    //             let moveY = requested_bottom_right[1] - vertices[1][1];

    //             // add extra movement to requested vertices, which will be ignored
    //             let requested_vertices = [];
    //             for (let i = 0; i < vertices.length; i++) {
    //                 vertices[i][0] = vertices[i][0] + moveX;
    //                 vertices[i][1] = vertices[i][1] + moveY;
    //                 requested_vertices.push([
    //                     vertices[i][0] + i,
    //                     vertices[i][1] + 2 * i,
    //                 ]);
    //             }

    //             // since attracted to point, moves up one and to the left
    //             vertices = vertices.map((v) => [
    //                 v[0] + actual_bottom_right[0] - requested_bottom_right[0],
    //                 v[1] + actual_bottom_right[1] - requested_bottom_right[1],
    //             ]);

    //             win.callAction1({
    //                 actionName: "movePolygon",
    //                 componentName: "/g2/pg",
    //                 args: {
    //                     pointCoords: requested_vertices,
    //                 },
    //             });

    //             testPolygonCopiedTwice({ vertices });
    //         });
    //     });
});
