import React, { useState, useEffect } from "react";
import {
    Box,
    Button,
    Center,
    Flex,
    SimpleGrid,
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
    useDisclosure,
    Slide,
    Tooltip,
    IconButton,
} from "@chakra-ui/react";
import { MathJax } from "better-react-mathjax";
import {
    FontAwesomeIcon,
    FontAwesomeIconProps,
} from "@fortawesome/react-fontawesome";

import { faBackspace, faArrowUp } from "@fortawesome/free-solid-svg-icons";

import { useRef } from "react";
import { FaKeyboard } from "react-icons/fa";
import { CloseIcon } from "@chakra-ui/icons";

/**
 * Virtual keyboard without Recoil integration. You must handle its state and pass in the callbacks yourself.
 */
export function ControlledVirtualKeyboard({
    returnCallback,
    setPalletRef,
    callback,
    isOpen,
    onClose,
    onToggle,
}: {
    /**
     * Callback triggered when the return button is clicked
     */
    returnCallback: () => void;
    /**
     * Function used to set the ref to the pallet (the div containing the buttons)
     */
    setPalletRef: (ref: React.MutableRefObject<null>) => void;
    /**
     * Callback triggered when a button is clicked
     */
    callback: (command: string) => void;
    isOpen: boolean;
    onClose: () => void;
    onToggle: () => void;
}) {
    const [toggleLetters, setToggleLetters] = useState(false);
    const [toggleABCCase, setToggleABCCase] = useState(false);
    const [toggleGreekCase, setToggleGreekCase] = useState(false);
    const [toggleFn, setToggleFn] = useState(0);
    const [toggleNumpad, setToggleNumpad] = useState(0);
    const containerRef = useRef(null);

    useEffect(() => {
        setPalletRef({ ...containerRef });
        //console.log(">>> ref: ", containerRef, toggleButtonRef, functionTabRef)
        setToggleFn(0);
        // setToggleGreek(0);
        setToggleNumpad(0);
    }, [toggleLetters, setPalletRef]);

    const handleToggleABCCase = () => {
        setToggleABCCase(!toggleABCCase);
    };

    const handleToggleGreekCase = () => {
        setToggleGreekCase(!toggleGreekCase);
    };

    /* Keyboard component styling starts HERE */

    function LetterButton(letter: string) {
        return (
            <Button
                flexBasis="9.5%"
                variant="outline"
                marginBottom="6px"
                onClick={() => callback("write " + letter)}
            >
                {letter}
            </Button>
        );
    }
    function GreekLetterButton(letter: string) {
        return (
            <Button
                flexBasis="9.5%"
                variant="outline"
                marginBottom="6px"
                onClick={() => {
                    callback("write \\" + letter);
                }}
            >
                <MathJax dynamic>{"\\(\\" + letter + "\\)"}</MathJax>
            </Button>
        );
    }
    function NumberButton(number: string | number, action: string) {
        // write ___
        return (
            <Button
                variant="outline"
                onClick={() => callback("write " + number)}
            >
                <MathJax dynamic>{action}</MathJax>
            </Button>
        );
    }
    function SymbolButton(symbol: string, action: string) {
        // type ___
        return (
            <Button
                variant="outline"
                onClick={() => callback("type " + symbol)}
            >
                <MathJax dynamic>\(\{action}\)</MathJax>
            </Button>
        );
    }
    function MathButton(input: string, action: string) {
        // cmd ___
        return (
            <Button variant="outline" onClick={() => callback("cmd " + input)}>
                <MathJax dynamic>\(\{action}\)</MathJax>
            </Button>
        );
    }
    function CustomButton(
        onClickHandler: React.MouseEventHandler<HTMLButtonElement>,
        action: string,
    ) {
        return (
            <Button variant="outline" onClick={onClickHandler}>
                <MathJax dynamic>{action}</MathJax>
            </Button>
        );
    }
    function SpaceBar() {
        return (
            <Button
                flexBasis="49%"
                variant="outline"
                onClick={() => callback("write \\ ")}
            >
                {" "}
            </Button>
        );
    }
    function LetterTransitionButton(
        onClickHandler: React.MouseEventHandler<HTMLButtonElement>,
        icon: FontAwesomeIconProps["icon"],
    ) {
        return (
            <Button flexBasis="15%" variant="solid" onClick={onClickHandler}>
                <FontAwesomeIcon icon={icon} />
            </Button>
        );
    }
    function LetterArrowButton(
        onClickHandler: React.MouseEventHandler<HTMLButtonElement>,
        icon: React.ReactNode,
    ) {
        return (
            <Button flexBasis="9.5%" variant="solid" onClick={onClickHandler}>
                {icon}
            </Button>
        );
    }

    let sectionUpperABC = (
        <Box
            ref={containerRef}
            // height="240px"
            bottom="0"
            left="0"
            width="100%"
            /* background-color: var(--canvas); */
            /* color: var(--canvas); */
            display="flex"
            flexDirection="row"
            textAlign="center"
            justifyContent="center"
        >
            <Box
                height="150px"
                maxWidth="700px"
                flexBasis="90%"
                marginLeft="5px"
                marginRight="5px"
                marginTop="auto"
                marginBottom="auto"
                display="flex"
                flexWrap="wrap"
                justifyContent="space-evenly"
            >
                {LetterButton("Q")}
                {LetterButton("W")}
                {LetterButton("E")}
                {LetterButton("R")}
                {LetterButton("T")}
                {LetterButton("Y")}
                {LetterButton("U")}
                {LetterButton("I")}
                {LetterButton("O")}
                {LetterButton("P")}
                {LetterButton("A")}
                {LetterButton("S")}
                {LetterButton("D")}
                {LetterButton("F")}
                {LetterButton("G")}
                {LetterButton("H")}
                {LetterButton("J")}
                {LetterButton("K")}
                {LetterButton("L")}
                {LetterTransitionButton(handleToggleABCCase, faArrowUp)}
                {LetterButton("Z")}
                {LetterButton("X")}
                {LetterButton("C")}
                {LetterButton("V")}
                {LetterButton("B")}
                {LetterButton("N")}
                {LetterButton("M")}
                {LetterTransitionButton(
                    () => callback("keystroke Backspace"),
                    faBackspace,
                )}
                {LetterButton(",")}
                {LetterButton("'")}
                {SpaceBar()}
                {LetterArrowButton(
                    () => callback("keystroke Left"),
                    <MathJax dynamic>\(\leftarrow\)</MathJax>,
                )}
                {LetterArrowButton(
                    () => callback("keystroke Right"),
                    <MathJax dynamic>\(\rightarrow\)</MathJax>,
                )}
                {LetterArrowButton(() => returnCallback(), "Enter")}
            </Box>
        </Box>
    );

    let sectionLowerABC = (
        <Box
            ref={containerRef}
            // height="240px"
            bottom="0"
            left="0"
            width="100%"
            /* background-color: var(--canvas); */
            /* color: var(--canvas); */
            display="flex"
            flexDirection="row"
            textAlign="center"
            justifyContent="center"
        >
            <Box
                height="150px"
                maxWidth="700px"
                flexBasis="90%"
                marginLeft="5px"
                marginRight="5px"
                marginTop="auto"
                marginBottom="auto"
                display="flex"
                flexWrap="wrap"
                justifyContent="space-evenly"
            >
                {LetterButton("q")}
                {LetterButton("w")}
                {LetterButton("e")}
                {LetterButton("r")}
                {LetterButton("t")}
                {LetterButton("y")}
                {LetterButton("u")}
                {LetterButton("i")}
                {LetterButton("o")}
                {LetterButton("p")}
                {LetterButton("a")}
                {LetterButton("s")}
                {LetterButton("d")}
                {LetterButton("f")}
                {LetterButton("g")}
                {LetterButton("h")}
                {LetterButton("j")}
                {LetterButton("k")}
                {LetterButton("l")}
                {LetterTransitionButton(handleToggleABCCase, faArrowUp)}
                {LetterButton("z")}
                {LetterButton("x")}
                {LetterButton("c")}
                {LetterButton("v")}
                {LetterButton("b")}
                {LetterButton("n")}
                {LetterButton("m")}
                {LetterTransitionButton(
                    () => callback("keystroke Backspace"),
                    faBackspace,
                )}
                {LetterButton(",")}
                {LetterButton("'")}
                {SpaceBar()}
                {LetterArrowButton(
                    () => callback("keystroke Left"),
                    <MathJax dynamic>\(\leftarrow\)</MathJax>,
                )}
                {LetterArrowButton(
                    () => callback("keystroke Right"),
                    <MathJax dynamic>\(\rightarrow\)</MathJax>,
                )}
                {LetterArrowButton(() => returnCallback(), "Enter")}
            </Box>
        </Box>
    );

    let sectionSymbols1 = (
        <SimpleGrid columns={5} spacing={2} margin="4px">
            {MathButton("{", `{`)}
            {MathButton("}", `}`)}
            {LetterButton(",")}
            {LetterButton(":")}
            {CustomButton(() => callback("write \\vert"), `\\(\\vert\\)`)}
            {CustomButton(() => callback("write \\subset"), "\\(\\subset\\)")}
            {CustomButton(
                () => callback("write \\subseteq"),
                "\\(\\subseteq\\)",
            )}
            {CustomButton(() => callback("write \\neq"), "\\(\\neq\\)")}
            {CustomButton(() => callback("write \\in"), "\\(\\in\\)")}
            {CustomButton(() => callback("write \\infty"), "\\(\\infty\\)")}
            {CustomButton(() => callback("cmd ("), `\\((\\)`)}
            {CustomButton(() => callback("cmd )"), `\\()\\)`)}
            {CustomButton(() => callback("cmd ["), `[`)}
            {CustomButton(() => callback("cmd ]"), `]`)}
            {CustomButton(
                () => callback("write \\emptyset"),
                "\\(\\emptyset\\)",
            )}
            {/* <Button onClick={() => callback('write \\mathbb{N}')}>
          <MathJax dynamic>{`\\(\\mathbb{N}\\)`}</MathJax>
        </Button>
        <Button onClick={() => callback('write \\mathbb{Z}')}>
          <MathJax dynamic>{`\\(\\mathbb{Z}\\)`}</MathJax>
        </Button>
        <Button onClick={() => callback('write \\mathbb{Q}')}>
          <MathJax dynamic>{`\\(\\mathbb{Q}\\)`}</MathJax>
        </Button>
        <Button onClick={() => callback('write \\mathbb{R}')}>
          <MathJax dynamic>{`\\(\\mathbb{R}\\)`}</MathJax>
        </Button>
        <Button onClick={() => callback('write \\mathbb{C}')}>
          <MathJax dynamic>{`\\(\\mathbb{C}\\)`}</MathJax>
        </Button> */}
        </SimpleGrid>
    );

    let sectionSymbols2 = (
        <SimpleGrid columns={5} spacing={2} margin="4px">
            {CustomButton(() => {
                callback("write \\vec{}");
                callback("keystroke Left");
            }, `\\(\\vec{a}\\)`)}
            {MathButton("\\langle", `langle`)}
            {MathButton("\\rangle", `rangle`)}
            {CustomButton(() => callback("write \\cdot"), `\\(\\cdot\\)`)}
            {CustomButton(() => callback("write \\times"), `\\(\\times\\)`)}
            {MathButton("\\overline", `overline{a}`)}
            {CustomButton(() => callback("write \\perp"), `\\(\\perp\\)`)}
            {CustomButton(() => callback("write \\times"), `\\(\\parallel\\)`)}
            {CustomButton(() => callback("write \\angle"), `\\(\\angle\\)`)}
            {CustomButton(
                () => callback("write {}^\\circ"),
                `\\({a}^\\circ\\)`,
            )}
            {CustomButton(() => callback("write \\exists"), `\\(\\exists\\)`)}
            {CustomButton(() => callback("write \\forall"), `\\(\\forall\\)`)}
            {LetterButton("%")}
            {LetterButton("$")}
            {LetterTransitionButton(
                () => callback("keystroke Backspace"),
                faBackspace,
            )}
            {CustomButton(() => callback("cmd _"), `\\(a_b\\)`)}

            {/* <Button onClick={() => callback('write \\neg')}>
          <MathJax dynamic>{`\\(\\neg\\)`}</MathJax>
        </Button> */}
            {LetterArrowButton(
                () => callback("keystroke Left"),
                <MathJax dynamic>\(\leftarrow\)</MathJax>,
            )}
            {LetterArrowButton(
                () => callback("keystroke Right"),
                <MathJax dynamic>\(\rightarrow\)</MathJax>,
            )}
            {LetterArrowButton(() => returnCallback(), "Enter")}
        </SimpleGrid>
    );

    let sectionTrig1 = (
        <SimpleGrid columns={4} spacing={2} margin="4px">
            {SymbolButton("sin(", `sin`)}
            {SymbolButton("cos(", `cos`)}
            {SymbolButton("tan(", `tan`)}
            {CustomButton(() => {
                callback("write \\sin^{-1}");
                callback("type (");
            }, `\\(\\sin^{-1}\\)`)}
            {CustomButton(() => {
                callback("write \\cos^{-1}");
                callback("type (");
            }, `\\(\\cos^{-1}\\)`)}
            {CustomButton(() => {
                callback("write \\tan^{-1}");
                callback("type (");
            }, `\\(\\tan^{-1}\\)`)}
            {SymbolButton("ln(", `ln`)}
            {CustomButton(() => {
                callback("write \\log_{}");
                callback("keystroke Left");
            }, `\\(\\log_b\\)`)}
            {CustomButton(
                () => callback("write \\log_{10}"),
                `\\(\\log_{10}\\)`,
            )}
            {CustomButton(() => {
                callback("write e^{}");
                callback("keystroke Left");
            }, `\\(e^{a}\\)`)}
            {CustomButton(() => {
                callback("write 10^{}");
                callback("keystroke Left");
            }, `\\(10^{a}\\)`)}
            {CustomButton(() => {
                callback("write \\sqrt[]{}");
                callback("keystroke Left");
                callback("keystroke Left");
            }, `\\(\\sqrt[b]{a}\\)`)}
        </SimpleGrid>
    );
    let sectionFx = (
        <SimpleGrid columns={4} spacing={2} margin="4px">
            {CustomButton(() => {
                callback("write \\frac{d}{dx}");
            }, `\\(\\frac{d}{dx}\\)`)}
            {/* <Button33 onClick={() => callback('write \\int')}>
          <MathJax dynamic>\(\int\)</MathJax>
        </Button33> */}
            {CustomButton(() => {
                callback("write \\int_{}^{}");
                callback("keystroke Left");
                callback("keystroke Left");
            }, `\\(\\int_{a}^{b}\\)`)}
            {SymbolButton("nPr(", `operatorname{nPr}`)}
            {SymbolButton("nCr(", `operatorname{nCr}`)}
            {LetterButton("!")}
            {CustomButton(() => {
                callback("write \\lfloor");
                callback("write \\rfloor");
                callback("keystroke Left");
            }, `\\(\\lfloor{a}\\rfloor\\)`)}
            {CustomButton(() => {
                callback("write \\lceil");
                callback("write \\rceil");
                callback("keystroke Left");
            }, `\\(\\lceil{a}\\rceil\\)`)}
            {LetterTransitionButton(
                () => callback("keystroke Backspace"),
                faBackspace,
            )}
            {LetterArrowButton(
                () => callback("keystroke Left"),
                <MathJax dynamic>\(\leftarrow\)</MathJax>,
            )}
            {LetterArrowButton(
                () => callback("keystroke Right"),
                <MathJax dynamic>\(\rightarrow\)</MathJax>,
            )}
            {LetterArrowButton(() => returnCallback(), "Enter")}
        </SimpleGrid>
    );
    let sectionUpperGreek = (
        <Box
            ref={containerRef}
            // height="240px"
            bottom="0"
            left="0"
            width="100%"
            /* background-color: var(--canvas); */
            /* color: var(--canvas); */
            display="flex"
            flexDirection="row"
            textAlign="center"
            justifyContent="center"
        >
            <Box
                height="150px"
                maxWidth="700px"
                flexBasis="90%"
                marginLeft="5px"
                marginRight="5px"
                marginTop="auto"
                marginBottom="auto"
                display="flex"
                flexWrap="wrap"
                justifyContent="space-evenly"
            >
                {GreekLetterButton("Phi")}
                {GreekLetterButton("Sigma")}
                {LetterButton("E")}
                {LetterButton("P")}
                {LetterButton("T")}
                {LetterButton("Y")}
                {GreekLetterButton("Theta")}
                {LetterButton("I")}
                {LetterButton("O")}
                {GreekLetterButton("Pi")}
                {LetterButton("A")}
                {GreekLetterButton("Sigma")}
                {GreekLetterButton("Delta")}
                {GreekLetterButton("Phi")}
                {GreekLetterButton("Gamma")}
                {LetterButton("H")}
                {GreekLetterButton("Xi")}
                {LetterButton("K")}
                {GreekLetterButton("Lambda")}
                {LetterTransitionButton(handleToggleGreekCase, faArrowUp)}
                {LetterButton("Z")}
                {LetterButton("X")}
                {GreekLetterButton("Psi")}
                {GreekLetterButton("Omega")}
                {LetterButton("B")}
                {LetterButton("N")}
                {LetterButton("M")}
                {LetterTransitionButton(
                    () => callback("keystroke Backspace"),
                    faBackspace,
                )}
                {LetterButton(",")}
                {LetterButton("'")}
                {SpaceBar()}
                {LetterArrowButton(
                    () => callback("keystroke Left"),
                    <MathJax dynamic>\(\leftarrow\)</MathJax>,
                )}
                {LetterArrowButton(
                    () => callback("keystroke Right"),
                    <MathJax dynamic>\(\rightarrow\)</MathJax>,
                )}
                {LetterArrowButton(() => returnCallback(), "Enter")}
            </Box>
        </Box>
    );

    let sectionLowerGreek = (
        <Box
            ref={containerRef}
            // height="240px"
            bottom="0"
            left="0"
            width="100%"
            /* background-color: var(--canvas); */
            /* color: var(--canvas); */
            display="flex"
            flexDirection="row"
            textAlign="center"
            justifyContent="center"
        >
            <Box
                height="150px"
                maxWidth="700px"
                flexBasis="90%"
                marginLeft="5px"
                marginRight="5px"
                marginTop="auto"
                marginBottom="auto"
                display="flex"
                flexWrap="wrap"
                justifyContent="space-evenly"
            >
                {GreekLetterButton("phi")}
                {GreekLetterButton("varsigma")}
                {GreekLetterButton("epsilon")}
                {GreekLetterButton("rho")}
                {GreekLetterButton("tau")}
                {GreekLetterButton("upsilon")}
                {GreekLetterButton("theta")}
                {GreekLetterButton("iota")}
                {LetterButton("o")}
                {GreekLetterButton("pi")}
                {GreekLetterButton("alpha")}
                {GreekLetterButton("sigma")}
                {GreekLetterButton("delta")}
                {GreekLetterButton("varphi")}
                {GreekLetterButton("gamma")}
                {GreekLetterButton("eta")}
                {GreekLetterButton("xi")}
                {GreekLetterButton("kappa")}
                {GreekLetterButton("lambda")}
                {LetterTransitionButton(handleToggleGreekCase, faArrowUp)}
                {GreekLetterButton("zeta")}
                {GreekLetterButton("chi")}
                {GreekLetterButton("psi")}
                {GreekLetterButton("omega")}
                {GreekLetterButton("beta")}
                {GreekLetterButton("nu")}
                {GreekLetterButton("mu")}
                {LetterTransitionButton(
                    () => callback("keystroke Backspace"),
                    faBackspace,
                )}
                {LetterButton(",")}
                {LetterButton("'")}
                {SpaceBar()}
                {LetterArrowButton(
                    () => callback("keystroke Left"),
                    <MathJax dynamic>\(\leftarrow\)</MathJax>,
                )}
                {LetterArrowButton(
                    () => callback("keystroke Right"),
                    <MathJax dynamic>\(\rightarrow\)</MathJax>,
                )}
                {LetterArrowButton(() => returnCallback(), "Enter")}
            </Box>
        </Box>
    );

    let sectionXYZ = (
        <SimpleGrid columns={4} spacing={2} margin="4px">
            {NumberButton("x", `\\(x\\)`)}
            {NumberButton("y", `\\(y\\)`)}
            {NumberButton("\\pi", `\\(\\pi\\)`)}
            {NumberButton("e", `\\(e\\)`)}
            {CustomButton(() => {
                callback("type ^2");
                callback("keystroke Right");
            }, `\\(a^2\\)`)}
            {CustomButton(() => callback("cmd ^"), `\\(a^b\\)`)}
            {CustomButton(() => callback("type sqrt"), `\\(\\sqrt{a}\\)`)}
            {CustomButton(() => {
                callback("cmd |");
                callback("cmd |");
                callback("keystroke Left");
            }, `\\(|a|\\)`)}
            {NumberButton("<", `\\(<\\)`)}
            {NumberButton(">", `\\(>\\)`)}
            {SymbolButton("<=", `leq`)}
            {SymbolButton(">=", `geq`)}
            {NumberButton(",", `\\(,\\)`)}
            {CustomButton(() => callback("cmd ("), `\\((\\)`)}
            {CustomButton(() => callback("cmd )"), `\\()\\)`)}
        </SimpleGrid>
    );

    let section123 = (
        <SimpleGrid columns={5} spacing={2} margin="4px">
            {NumberButton(7, `\\(7\\)`)}
            {NumberButton(8, `\\(8\\)`)}
            {NumberButton(9, `\\(9\\)`)}
            {SymbolButton("*", "times")}
            {MathButton("/", "div")}
            {NumberButton(4, `\\(4\\)`)}
            {NumberButton(5, `\\(5\\)`)}
            {NumberButton(6, `\\(6\\)`)}
            {NumberButton("+", "+")}
            {NumberButton("-", "-")}
            {/* <Button variant="outline" onClick={() => callback("cmd -")}>
        <MathJax dynamic>\(-\)</MathJax>
      </Button> */}
            {NumberButton(1, `\\(1\\)`)}
            {NumberButton(2, `\\(2\\)`)}
            {NumberButton(3, `\\(3\\)`)}
            {NumberButton("=", "=")}
            {LetterTransitionButton(
                () => callback("keystroke Backspace"),
                faBackspace,
            )}
            {NumberButton(0, `\\(0\\)`)}
            {NumberButton(".", ".")}
            {LetterArrowButton(
                () => callback("keystroke Left"),
                <MathJax dynamic>\(\leftarrow\)</MathJax>,
            )}
            {LetterArrowButton(
                () => callback("keystroke Right"),
                <MathJax dynamic>\(\rightarrow\)</MathJax>,
            )}
            {LetterArrowButton(() => returnCallback(), "Enter")}
        </SimpleGrid>
    );

    // function MathKeyboard() {
    const keyboardBtnRef = useRef(null);

    return (
        <Slide direction="bottom" in={isOpen} style={{ zIndex: 1000 }}>
            <Box
                p="4px"
                mt="4"
                bg="doenet.canvas"
                borderTop="1px"
                borderTopColor="doenet.mediumGray"
                className="keyboardcontainer"
            >
                <Tooltip
                    hasArrow
                    label={isOpen ? "Close Keyboard" : "Open Keyboard"}
                >
                    <IconButton
                        aria-label="Toggle Keyboard"
                        position="absolute"
                        left="10px"
                        size="md"
                        roundedBottom="0px"
                        height="24px"
                        width="50px"
                        top={isOpen ? "-8px" : "-24px"}
                        variant="ghost"
                        // variant="outline"
                        icon={<FaKeyboard />}
                        onClick={onToggle}
                        ref={keyboardBtnRef}
                        background="doenet.canvas"
                    />
                </Tooltip>

                <IconButton
                    aria-label="Close Keyboard"
                    position="absolute"
                    top="20px"
                    right="6px"
                    size="sm"
                    icon={<CloseIcon />}
                    variant="ghost"
                    onClick={onClose}
                />
                <Center tabIndex={0} ref={containerRef} className="keyboard">
                    <Tabs width="740px">
                        <TabList>
                            <Tab>123</Tab>
                            <Tab>f(x)</Tab>
                            <Tab>ABC</Tab>
                            <Tab>αβγ</Tab>
                            <Tab>$%∞</Tab>
                        </TabList>

                        <TabPanels height="240px">
                            <TabPanel>
                                <Flex
                                    // @ts-ignore
                                    variant="keyboardSection"
                                >
                                    {sectionXYZ}
                                    {section123}
                                </Flex>
                            </TabPanel>
                            <TabPanel>
                                <Flex
                                    // @ts-ignore
                                    variant="keyboardSection"
                                >
                                    {sectionTrig1}
                                    {sectionFx}
                                </Flex>
                            </TabPanel>
                            <TabPanel>
                                <Flex
                                    // @ts-ignore
                                    variant="keyboardSection"
                                >
                                    {toggleABCCase
                                        ? sectionUpperABC
                                        : sectionLowerABC}
                                </Flex>
                            </TabPanel>
                            <TabPanel>
                                <Flex
                                    // @ts-ignore
                                    variant="keyboardSection"
                                >
                                    {toggleGreekCase
                                        ? sectionUpperGreek
                                        : sectionLowerGreek}
                                </Flex>
                            </TabPanel>
                            <TabPanel>
                                <Flex
                                    // @ts-ignore
                                    variant="keyboardSection"
                                >
                                    {sectionSymbols1}
                                    {sectionSymbols2}
                                </Flex>
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                </Center>
            </Box>
        </Slide>
    );
}
