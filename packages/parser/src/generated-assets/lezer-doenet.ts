// This file was generated by lezer-generator. You probably shouldn't edit it.
import { LRParser } from "@lezer/lr";
import {
    startTag,
    commentContent,
    piContent,
    cdataContent,
    textLessThan,
    elementContext,
} from "../tokens";
export const parser = LRParser.deserialize({
    version: 14,
    states: "(jOVOqOOOzO!jO'#CgO!SQ!bO'#CjO!|OqO'#ChOOOP'#Ch'#ChO#TO!dO'#CsO#]O!fO'#CtO#eQ!bO'#CuOOOP'#DW'#DWOOOP'#Cw'#CwQVOqOOOOOW'#Cx'#CxO#jO!jO,59ROOOP,59R,59RO#rQ#tO,59UOOOP'#C|'#C|O#}OqO,59SO$UQ!bO'#CpOOOP,59S,59SOOOQ'#C}'#C}O$ZO!dO,59_OOOP,59_,59_OOOS'#DO'#DOO$cO!fO,59`OOOP,59`,59`O$kQ!bO,59aOOOP-E6u-E6uOOOW-E6v-E6vOOOP1G.m1G.mO$pQ#tO'#ClOOQO'#Cy'#CyO%OQ#tO1G.pOOOP1G.p1G.pOOOP1G.x1G.xOOOP-E6z-E6zOOOP1G.n1G.nO%ZQ!bO,59[OOOQ-E6{-E6{OOOP1G.y1G.yOOOS-E6|-E6|OOOP1G.z1G.zOOOP1G.{1G.{O%`Q!bO,59WOOQO-E6w-E6wOOOP7+$[7+$[OOOP7+$d7+$dOOOP1G.v1G.vO%hO&jO'#CoO%yO,UO'#CoOOQO1G.r1G.rOOOO'#Cz'#CzO&[O&jO,59ZOOQO,59Z,59ZOOOO'#C{'#C{O&mO,UO,59ZOOOO-E6x-E6xOOQO1G.u1G.uOOOO-E6y-E6y",
    stateData:
        "'T~OyOS~OPQOSVOTWOVWOWWOXWOYWOjXO|PO!STO!UUO~OvZO{]O~O_^O~OPQOQaOSVOTWOVWOWWOXWOYWO|PO!STO!UUO~ORbO~P!XOtcO!ReO~OufO!ThO~O_iO~OvZO{lO~O]pOamOeqO~ORsO~P!XO_tO~OtcO!RvO~OufO!TxO~O]yO~ObzO]`Xa`Xe`X~O]|OamOe}O~O]!OO~O}!PO!P!QO~OW!SOX!SOY!SO}!UO!O!SO~OW!VOX!VOY!VO!P!UO!Q!VO~OW!SOX!SOY!SO}!YO!O!SO~OW!VOX!VOY!VO!P!YO!Q!VO~OXWYW~",
    goto: "#w{PPPPPPPPPPP||P!SP!YPP!^!aP!g|||P!m!s!y#P#V#]#c#iPPPPPPP#oXWORY`XRORY`Tn^oR!RzQbRRs`XSORY`QYORjYQ[PRk[Qo^R{oQ!T!PR!X!TQ!W!QR!Z!WQ`RRr`QdTRudQgURwgSXOYT_R`",
    nodeNames:
        "⚠ StartTag StartCloseTag MissingCloseTag StartCloseTag StartCloseTag Document Text EntityReference CharacterReference Ampersand Cdata Element EndTag OpenTag TagName Attribute AttributeName Is AttributeValue CloseTag SelfCloseEndTag SelfClosingTag Comment ProcessingInst MismatchedCloseTag DoctypeDecl",
    maxTerm: 52,
    context: elementContext,
    nodeProps: [
        [
            "closedBy",
            1,
            "SelfCloseEndTag EndTag",
            14,
            "CloseTag MissingCloseTag",
        ],
        [
            "openedBy",
            13,
            "StartTag StartCloseTag",
            20,
            "OpenTag",
            21,
            "StartTag",
        ],
    ],
    skippedNodes: [0],
    repeatNodeCount: 8,
    tokenData:
        "!2c~R!YOX$qXY1jYZ1jZ]$q]^1j^p$qpq1jqr$qrs2wsv$qvw3gwx7lx}$q}!O8_!O!P$q!P!Q:}!Q![$q![!]<q!]!^$q!^!_@X!_!`!,a!`!a!-X!a!b!.P!b!c$q!c!}<q!}#P$q#P#Q!/s#Q#R$q#R#S<q#S#T$q#T#o<q#o%W$q%W%o<q%o%p$q%p&a<q&a&b$q&b1p<q1p4U$q4U4d<q4d4e$q4e$IS<q$IS$I`$q$I`$Ib<q$Ib$Kh$q$Kh%#t<q%#t&/x$q&/x&Et<q&Et&FV$q&FV;'S<q;'S;:j@R;:j;=`1d<%l?&r$q?&r?Ah<q?Ah?BY$q?BY?Mn<q?MnO$qi$zXVP!OW!Q`Or$qrs%gsv$qwx*rx!^$q!^!_.[!_;'S$q;'S;=`1d<%lO$qa%nVVP!Q`Ov%gwx&Tx!^%g!^!_(S!_;'S%g;'S;=`*l<%lO%gP&YUVPOv&Tw!^&T!^!_&l!_;'S&T;'S;=`'|<%lO&TP&oTXY'OYZ'O]^'Opq'O!_!`&TP'T]VPOX&TXY'OYZ'OZ]&T]^'O^p&Tpq'Oqv&Tw!^&T!^!_&l!_;'S&T;'S;=`'|<%lO&TP(PP;=`<%l&Ta(X]!Q`OX)QXY)iYZ)iZ])Q]^)i^p)Qpq)iqv)Qx!_)Q!_!`%g!`;'S)Q;'S;=`)c<%lO)Q`)VS!Q`Ov)Qx;'S)Q;'S;=`)c<%lO)Q`)fP;=`<%l)Qa)p^VP!Q`OX%gXY)iYZ)iZ]%g]^)i^p%gpq)iqv%gwx&Tx!^%g!^!_(S!_;'S%g;'S;=`*l<%lO%ga*oP;=`<%l%gX*yWVP!OWOr*rrs&Tsv*rw!^*r!^!_+c!_;'S*r;'S;=`.U<%lO*rX+h^!OWOX,dXY-OYZ-OZ],d]^-O^p,dpq-Oqr,dsv,dw!_,d!_!`*r!`;'S,d;'S;=`,x<%lO,dW,iT!OWOr,dsv,dw;'S,d;'S;=`,x<%lO,dW,{P;=`<%l,dX-V_VP!OWOX*rXY-OYZ-OZ]*r]^-O^p*rpq-Oqr*rrs&Tsv*rw!^*r!^!_+c!_;'S*r;'S;=`.U<%lO*rX.XP;=`<%l*ri.c`!OW!Q`OX/eXY0XYZ0XZ]/e]^0X^p/epq0Xqr/ers)Qsv/ewx,dx!_/e!_!`$q!`;'S/e;'S;=`0R<%lO/eh/lV!OW!Q`Or/ers)Qsv/ewx,dx;'S/e;'S;=`0R<%lO/eh0UP;=`<%l/ei0b`VP!OW!Q`OX$qXY0XYZ0XZ]$q]^0X^p$qpq0Xqr$qrs%gsv$qwx*rx!^$q!^!_.[!_;'S$q;'S;=`1d<%lO$qi1gP;=`<%l$qo1u`VP!OW!Q`yUOX$qXY1jYZ1jZ]$q]^1j^p$qpq1jqr$qrs%gsv$qwx*rx!^$q!^!_.[!_;'S$q;'S;=`1d<%lO$qk3QV}YVP!Q`Ov%gwx&Tx!^%g!^!_(S!_;'S%g;'S;=`*l<%lO%g~3laY~st4q![!]5u!c!}5u#R#S5u#T#o5u%W%o5u%p&a5u&b1p5u4U4d5u4e$IS5u$I`$Ib5u$Kh%#t5u&/x&Et5u&FV;'S5u;'S;:j7f?&r?Ah5u?BY?Mn5u~4tQ!Q![4z#l#m5Y~4}Q!Q![4z!]!^5T~5YOX~~5]R!Q![5f!c!i5f#T#Z5f~5iS!Q![5f!]!^5T!c!i5f#T#Z5f~5xg}!O5u!O!P5u!Q![5u![!]5u!]!^7a!c!}5u#R#S5u#T#o5u$}%O5u%W%o5u%p&a5u&b1p5u1p4U5u4U4d5u4e$IS5u$I`$Ib5u$Je$Jg5u$Kh%#t5u&/x&Et5u&FV;'S5u;'S;:j7f?&r?Ah5u?BY?Mn5u~7fOW~~7iP;=`<%l5uk7uW!PbVP!OWOr*rrs&Tsv*rw!^*r!^!_+c!_;'S*r;'S;=`.U<%lO*rk8hZVP!OW!Q`Or$qrs%gsv$qwx*rx}$q}!O9Z!O!^$q!^!_.[!_;'S$q;'S;=`1d<%lO$qk9dZVP!OW!Q`Or$qrs%gsv$qwx*rx!^$q!^!_.[!_!`$q!`!a:V!a;'S$q;'S;=`1d<%lO$qk:bX!RQVP!OW!Q`Or$qrs%gsv$qwx*rx!^$q!^!_.[!_;'S$q;'S;=`1d<%lO$qm;WZVP!OW!Q`Or$qrs%gsv$qwx*rx!^$q!^!_.[!_!`$q!`!a;y!a;'S$q;'S;=`1d<%lO$qm<UXeSVP!OW!Q`Or$qrs%gsv$qwx*rx!^$q!^!_.[!_;'S$q;'S;=`1d<%lO$qo=O!PaS_QVP!OW!Q`Or$qrs%gsv$qwx*rx}$q}!O<q!O!P<q!P!Q$q!Q![<q![!]<q!]!^$q!^!_.[!_!c$q!c!}<q!}#R$q#R#S<q#S#T$q#T#o<q#o$}$q$}%O<q%O%W$q%W%o<q%o%p$q%p&a<q&a&b$q&b1p<q1p4U<q4U4d<q4d4e$q4e$IS<q$IS$I`$q$I`$Ib<q$Ib$Je$q$Je$Jg<q$Jg$Kh$q$Kh%#t<q%#t&/x$q&/x&Et<q&Et&FV$q&FV;'S<q;'S;:j@R;:j;=`1d<%l?&r$q?&r?Ah<q?Ah?BY$q?BY?Mn<q?MnO$qo@UP;=`<%l<qi@`b!OW!Q`OX/eXY0XYZ0XZ]/e]^0X^p/epq0XqrAhrs)Qsv/ewx,dx!_/e!_!`$q!`!a/e!a!b!+q!b;'S/e;'S;=`0R<%lO/eiAo_!OW!Q`Or/ers)Qsv/ewx,dx}/e}!OBn!O!f/e!f!gDQ!g!}/e!}#OMT#O#W/e#W#X!']#X;'S/e;'S;=`0R<%lO/eiBuX!OW!Q`Or/ers)Qsv/ewx,dx}/e}!OCb!O;'S/e;'S;=`0R<%lO/eiCkV!SP!OW!Q`Or/ers)Qsv/ewx,dx;'S/e;'S;=`0R<%lO/eiDXX!OW!Q`Or/ers)Qsv/ewx,dx!q/e!q!rDt!r;'S/e;'S;=`0R<%lO/eiD{X!OW!Q`Or/ers)Qsv/ewx,dx!e/e!e!fEh!f;'S/e;'S;=`0R<%lO/eiEoX!OW!Q`Or/ers)Qsv/ewx,dx!v/e!v!wF[!w;'S/e;'S;=`0R<%lO/eiFcX!OW!Q`Or/ers)Qsv/ewx,dx!{/e!{!|GO!|;'S/e;'S;=`0R<%lO/eiGVX!OW!Q`Or/ers)Qsv/ewx,dx!r/e!r!sGr!s;'S/e;'S;=`0R<%lO/eiGyX!OW!Q`Or/ers)Qsv/ewx,dx!g/e!g!hHf!h;'S/e;'S;=`0R<%lO/eiHmY!OW!Q`OrHfrsI]svHfvwIwwxKPx!`Hf!`!aL_!a;'SHf;'S;=`L}<%lOHfaIbV!Q`OvI]vxIwx!`I]!`!aJf!a;'SI];'S;=`Jy<%lOI]PIzTO!`Iw!`!aJZ!a;'SIw;'S;=`J`<%lOIwPJ`OjPPJcP;=`<%lIwaJmSjP!Q`Ov)Qx;'S)Q;'S;=`)c<%lO)QaJ|P;=`<%lI]XKUX!OWOrKPrsIwsvKPvwIww!`KP!`!aKq!a;'SKP;'S;=`LX<%lOKPXKxTjP!OWOr,dsv,dw;'S,d;'S;=`,x<%lO,dXL[P;=`<%lKPiLhVjP!OW!Q`Or/ers)Qsv/ewx,dx;'S/e;'S;=`0R<%lO/eiMQP;=`<%lHfiM[Z!OW!Q`Or/ers)Qsv/ewx,dx!e/e!e!fM}!f#V/e#V#W!$_#W;'S/e;'S;=`0R<%lO/eiNUX!OW!Q`Or/ers)Qsv/ewx,dx!f/e!f!gNq!g;'S/e;'S;=`0R<%lO/eiNxX!OW!Q`Or/ers)Qsv/ewx,dx!c/e!c!d! e!d;'S/e;'S;=`0R<%lO/ei! lX!OW!Q`Or/ers)Qsv/ewx,dx!v/e!v!w!!X!w;'S/e;'S;=`0R<%lO/ei!!`X!OW!Q`Or/ers)Qsv/ewx,dx!c/e!c!d!!{!d;'S/e;'S;=`0R<%lO/ei!#SX!OW!Q`Or/ers)Qsv/ewx,dx!}/e!}#O!#o#O;'S/e;'S;=`0R<%lO/ei!#xV|P!OW!Q`Or/ers)Qsv/ewx,dx;'S/e;'S;=`0R<%lO/ei!$fX!OW!Q`Or/ers)Qsv/ewx,dx#W/e#W#X!%R#X;'S/e;'S;=`0R<%lO/ei!%YX!OW!Q`Or/ers)Qsv/ewx,dx#T/e#T#U!%u#U;'S/e;'S;=`0R<%lO/ei!%|X!OW!Q`Or/ers)Qsv/ewx,dx#h/e#h#i!&i#i;'S/e;'S;=`0R<%lO/ei!&pX!OW!Q`Or/ers)Qsv/ewx,dx#T/e#T#U!!{#U;'S/e;'S;=`0R<%lO/ei!'dX!OW!Q`Or/ers)Qsv/ewx,dx#c/e#c#d!(P#d;'S/e;'S;=`0R<%lO/ei!(WX!OW!Q`Or/ers)Qsv/ewx,dx#V/e#V#W!(s#W;'S/e;'S;=`0R<%lO/ei!(zX!OW!Q`Or/ers)Qsv/ewx,dx#h/e#h#i!)g#i;'S/e;'S;=`0R<%lO/ei!)nX!OW!Q`Or/ers)Qsv/ewx,dx#m/e#m#n!*Z#n;'S/e;'S;=`0R<%lO/ei!*bX!OW!Q`Or/ers)Qsv/ewx,dx#d/e#d#e!*}#e;'S/e;'S;=`0R<%lO/ei!+UX!OW!Q`Or/ers)Qsv/ewx,dx#X/e#X#YHf#Y;'S/e;'S;=`0R<%lO/ei!+zV!UP!OW!Q`Or/ers)Qsv/ewx,dx;'S/e;'S;=`0R<%lO/em!,lXbSVP!OW!Q`Or$qrs%gsv$qwx*rx!^$q!^!_.[!_;'S$q;'S;=`1d<%lO$qo!-dX]UVP!OW!Q`Or$qrs%gsv$qwx*rx!^$q!^!_.[!_;'S$q;'S;=`1d<%lO$qk!.YZVP!OW!Q`Or$qrs%gsv$qwx*rx!^$q!^!_.[!_!`$q!`!a!.{!a;'S$q;'S;=`1d<%lO$qk!/WX!TQVP!OW!Q`Or$qrs%gsv$qwx*rx!^$q!^!_.[!_;'S$q;'S;=`1d<%lO$qk!/|ZVP!OW!Q`Or$qrs%gsv$qwx*rx!^$q!^!_.[!_#P$q#P#Q!0o#Q;'S$q;'S;=`1d<%lO$qk!0xZVP!OW!Q`Or$qrs%gsv$qwx*rx!^$q!^!_.[!_!`$q!`!a!1k!a;'S$q;'S;=`1d<%lO$qk!1vX{QVP!OW!Q`Or$qrs%gsv$qwx*rx!^$q!^!_.[!_;'S$q;'S;=`1d<%lO$q",
    tokenizers: [
        startTag,
        commentContent,
        piContent,
        cdataContent,
        textLessThan,
        0,
        1,
        2,
        3,
        4,
    ],
    topRules: { Document: [0, 6] },
    tokenPrec: 276,
});
