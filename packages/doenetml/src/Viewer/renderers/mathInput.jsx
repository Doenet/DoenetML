import React, { useRef, useState, useEffect } from "react";
import useDoenetRenderer from "../useDoenetRenderer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";
import {
    faCheck,
    faLevelDownAlt,
    faTimes,
    faCloud,
} from "@fortawesome/free-solid-svg-icons";
import { addStyles, EditableMathField } from "react-mathquill";
addStyles(); // Styling for react-mathquill input field
import {
    focusedMathField,
    focusedMathFieldReturn,
    palletRef,
    handleRef,
} from "@doenet/virtual-keyboard/math-input";
import { MathJax } from "better-react-mathjax";

import { useRecoilValue, useSetRecoilState } from "recoil";
import { rendererState } from "../useDoenetRenderer";
import "./mathInput.css";

// Moved most of checkWorkStyle styling into Button
const Button = styled.button`
    position: relative;
    width: 24px;
    height: 24px;
    color: #ffffff;
    background-color: var(--mainBlue);
    display: inline-block;
    text-align: center;
    padding: 2px;
    z-index: 0;
    /* border: var(--mainBorder); */
    border: none;
    border-radius: var(--mainBorderRadius);
    margin: 0px 4px 4px 0px;

    &:hover {
        background-color: var(--lightBlue);
        color: black;
    }
`;
export default function MathInput(props) {
    return (<div></div>);
}
