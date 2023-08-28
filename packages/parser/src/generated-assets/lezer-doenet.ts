// This file was generated by lezer-generator. You probably shouldn't edit it.
import {LRParser} from "@lezer/lr"
import {startTag, commentContent, piContent, cdataContent, elementContext} from "../tokens"
import {NodeProp} from "@lezer/common"
export const parser = LRParser.deserialize({
  version: 13,
  states: "(jOVOaOOOwOxO'#CfO!PQpO'#CiO!vOaO'#CgOOOP'#Cg'#CgO!}OrO'#CsO#VOtO'#CtO#_QpO'#CuOOOP'#DV'#DVOOOP'#Cw'#CwQVOaOOOOOW'#Cx'#CxO#dOxO,59QOOOP,59Q,59QO#lQ!bO,59TOOOP'#C|'#C|O#wOaO,59RO$OQpO'#CpOOOP,59R,59ROOOQ'#C}'#C}O$TOrO,59_OOOP,59_,59_OOOS'#DO'#DOO$]OtO,59`OOOP,59`,59`O$eQpO,59aOOOP-E6u-E6uOOOW-E6v-E6vOOOP1G.l1G.lO$jQ!bO'#CkOOQO'#Cy'#CyO$xQ!bO1G.oOOOP1G.o1G.oOOOP1G.x1G.xOOOP-E6z-E6zOOOP1G.m1G.mO%TQpO,59[OOOQ-E6{-E6{OOOP1G.y1G.yOOOS-E6|-E6|OOOP1G.z1G.zOOOP1G.{1G.{O%YQpO,59VOOQO-E6w-E6wOOOP7+$Z7+$ZOOOP7+$d7+$dOOOP1G.v1G.vO%bO#tO'#CnO%sO&jO'#CnOOQO1G.q1G.qOOOO'#Cz'#CzO&UO#tO,59YOOQO,59Y,59YOOOO'#C{'#C{O&gO&jO,59YOOOO-E6x-E6xOOQO1G.t1G.tOOOO-E6y-E6y",
  stateData: "&x~OxOS~OPQOSVOTWOVWOWWOXWOjXO{PO!RTO!TUO~OvZOz]O~O^^O~OPQOQaOSVOTWOVWOWWOXWO{PO!RTO!TUO~ORbO~P!UOtcO!QeO~OufO!ShO~O^iO~OvZOzlO~O[pO`mOeqO~ORsO~P!UO^tO~OtcO!QvO~OufO!SxO~O[yO~OazO[_X`_Xe_X~O[|O`mOe}O~O[!OO~O|!PO!O!QO~OW!SOX!SOc!SO|!UO}!SO~OW!VOX!VOc!VO!O!UO!P!VO~OW!SOX!SOc!SO|!YO}!SO~OW!VOX!VOc!VO!O!YO!P!VO~O",
  goto: "#vzPPPPPPPPPP{{P!RP!XPP!]P!`P!f{{{P!l!r!x#O#U#[#b#hPPPPPP#nXWORY`XRORY`Tn^oR!RzQbRRs`XSORY`QYORjYQ[PRk[Qo^R{oQ!T!PR!X!TQ!W!QR!Z!WQ`RRr`QdTRudQgURwgSXOYT_R`",
  nodeNames: "⚠ StartTag StartCloseTag MissingCloseTag StartCloseTag StartCloseTag Document Text EntityReference CharacterReference Cdata Element EndTag OpenTag TagName Attribute AttributeName Is AttributeValue InvalidEntity CloseTag SelfCloseEndTag SelfClosingTag Comment ProcessingInst MismatchedCloseTag DoctypeDecl",
  maxTerm: 51,
  context: elementContext,
  nodeProps: [
    [NodeProp.closedBy, 1,"SelfCloseEndTag EndTag",13,"CloseTag MissingCloseTag"],
    [NodeProp.openedBy, 12,"StartTag StartCloseTag",20,"OpenTag",21,"StartTag"]
  ],
  skippedNodes: [0],
  repeatNodeCount: 8,
  tokenData: "!&o~R!XOX$nXY.sYZ.sZ]$n]^.s^p$npq.sqr$nrs/zsv$nvw0dwx2Rx}$n}!O2n!O!P$n!P!Q4z!Q![$n![!]6b!]!^$n!^!_:e!_!`! i!`!a!!Z!a!b!!{!b!c$n!c!}6b!}#P$n#P#Q!$c#Q#R$n#R#S6b#S#T$n#T#o6b#o%W$n%W%o6b%o%p$n%p&a6b&a&b$n&b1p6b1p4U$n4U4d6b4d4e$n4e$IS6b$IS$I`$n$I`$Ib6b$Ib$Kh$n$Kh%#t6b%#t&/x$n&/x&Et6b&Et&FV$n&FV;'S6b;'S;:j9o;:j?&r$n?&r?Ah6b?Ah?BY$n?BY?Mn6b?Mn~$ni$wVVP}W!P`Or$nrs%^sv$nwx)ax!^$n!^!_,T!_~$na%eTVP!P`Ov%^wx%tx!^%^!^!_'a!_~%^P%ySVPOv%tw!^%t!^!_&V!_~%tP&YTXY&iYZ&i]^&ipq&i!_!`%tP&nZVPOX%tXY&iYZ&iZ]%t]^&i^p%tpq&iqv%tw!^%t!^!_&V!_~%ta'fZ!P`OX(XXY(dYZ(dZ](X]^(d^p(Xpq(dqv(Xx!_(X!_!`%^!`~(X`(^Q!P`Ov(Xx~(Xa(k[VP!P`OX%^XY(dYZ(dZ]%^]^(d^p%^pq(dqv%^wx%tx!^%^!^!_'a!_~%^X)hUVP}WOr)ars%tsv)aw!^)a!^!_)z!_~)aX*P[}WOX*uXY+TYZ+TZ]*u]^+T^p*upq+Tqr*usv*uw!_*u!_!`)a!`~*uW*zR}WOr*usv*uw~*uX+[]VP}WOX)aXY+TYZ+TZ])a]^+T^p)apq+Tqr)ars%tsv)aw!^)a!^!_)z!_~)ai,[^}W!P`OX-WXY-nYZ-nZ]-W]^-n^p-Wpq-nqr-Wrs(Xsv-Wwx*ux!_-W!_!`$n!`~-Wh-_T}W!P`Or-Wrs(Xsv-Wwx*ux~-Wi-w^VP}W!P`OX$nXY-nYZ-nZ]$n]^-n^p$npq-nqr$nrs%^sv$nwx)ax!^$n!^!_,T!_~$no/O^VP}W!P`xUOX$nXY.sYZ.sZ]$n]^.s^p$npq.sqr$nrs%^sv$nwx)ax!^$n!^!_,T!_~$nk0TT|YVP!P`Ov%^wx%tx!^%^!^!_'a!_~%^~0iTc~Op0xqs0xst1at!]0x!^~0x~0{TOp0xqs0xt!]0x!]!^1[!^~0x~1aOW~~1dROp1mq!]1m!^~1m~1pSOp1mq!]1m!]!^1|!^~1m~2ROX~k2[U!ObVP}WOr)ars%tsv)aw!^)a!^!_)z!_~)ak2wXVP}W!P`Or$nrs%^sv$nwx)ax}$n}!O3d!O!^$n!^!_,T!_~$nk3mXVP}W!P`Or$nrs%^sv$nwx)ax!^$n!^!_,T!_!`$n!`!a4Y!a~$nk4eV!QQVP}W!P`Or$nrs%^sv$nwx)ax!^$n!^!_,T!_~$nm5TXVP}W!P`Or$nrs%^sv$nwx)ax!^$n!^!_,T!_!`$n!`!a5p!a~$nm5{VeSVP}W!P`Or$nrs%^sv$nwx)ax!^$n!^!_,T!_~$no6o!O`S^QVP}W!P`Or$nrs%^sv$nwx)ax}$n}!O6b!O!P6b!P!Q$n!Q![6b![!]6b!]!^$n!^!_,T!_!c$n!c!}6b!}#R$n#R#S6b#S#T$n#T#o6b#o$}$n$}%O6b%O%W$n%W%o6b%o%p$n%p&a6b&a&b$n&b1p6b1p4U6b4U4d6b4d4e$n4e$IS6b$IS$I`$n$I`$Ib6b$Ib$Je$n$Je$Jg6b$Jg$Kh$n$Kh%#t6b%#t&/x$n&/x&Et6b&Et&FV$n&FV;'S6b;'S;:j9o;:j?&r$n?&r?Ah6b?Ah?BY$n?BY?Mn6b?Mn~$no9xXVP}W!P`Or$nrs%^sv$nwx)ax!^$n!^!_,T!_;=`$n;=`<%l6b<%l~$ni:l`}W!P`OX-WXY-nYZ-nZ]-W]^-n^p-Wpq-nqr;nrs(Xsv-Wwx*ux!_-W!_!`$n!`!a-W!a!b! P!b~-Wi;u]}W!P`Or-Wrs(Xsv-Wwx*ux}-W}!O<n!O!f-W!f!g=t!g!}-W!}#ODm#O#W-W#W#XKa#X~-Wi<uV}W!P`Or-Wrs(Xsv-Wwx*ux}-W}!O=[!O~-Wi=eT!RP}W!P`Or-Wrs(Xsv-Wwx*ux~-Wi={V}W!P`Or-Wrs(Xsv-Wwx*ux!q-W!q!r>b!r~-Wi>iV}W!P`Or-Wrs(Xsv-Wwx*ux!e-W!e!f?O!f~-Wi?VV}W!P`Or-Wrs(Xsv-Wwx*ux!v-W!v!w?l!w~-Wi?sV}W!P`Or-Wrs(Xsv-Wwx*ux!{-W!{!|@Y!|~-Wi@aV}W!P`Or-Wrs(Xsv-Wwx*ux!r-W!r!s@v!s~-Wi@}V}W!P`Or-Wrs(Xsv-Wwx*ux!g-W!g!hAd!h~-WiAkW}W!P`OrAdrsBTsvAdvwBiwxCXx!`Ad!`!aDT!a~AdaBYT!P`OvBTvxBix!`BT!`!aBz!a~BTPBlRO!`Bi!`!aBu!a~BiPBzOjPaCRQjP!P`Ov(Xx~(XXC^V}WOrCXrsBisvCXvwBiw!`CX!`!aCs!a~CXXCzRjP}WOr*usv*uw~*uiD^TjP}W!P`Or-Wrs(Xsv-Wwx*ux~-WiDtX}W!P`Or-Wrs(Xsv-Wwx*ux!e-W!e!fEa!f#V-W#V#WH{#W~-WiEhV}W!P`Or-Wrs(Xsv-Wwx*ux!f-W!f!gE}!g~-WiFUV}W!P`Or-Wrs(Xsv-Wwx*ux!c-W!c!dFk!d~-WiFrV}W!P`Or-Wrs(Xsv-Wwx*ux!v-W!v!wGX!w~-WiG`V}W!P`Or-Wrs(Xsv-Wwx*ux!c-W!c!dGu!d~-WiG|V}W!P`Or-Wrs(Xsv-Wwx*ux!}-W!}#OHc#O~-WiHlT{P}W!P`Or-Wrs(Xsv-Wwx*ux~-WiISV}W!P`Or-Wrs(Xsv-Wwx*ux#W-W#W#XIi#X~-WiIpV}W!P`Or-Wrs(Xsv-Wwx*ux#T-W#T#UJV#U~-WiJ^V}W!P`Or-Wrs(Xsv-Wwx*ux#h-W#h#iJs#i~-WiJzV}W!P`Or-Wrs(Xsv-Wwx*ux#T-W#T#UGu#U~-WiKhV}W!P`Or-Wrs(Xsv-Wwx*ux#c-W#c#dK}#d~-WiLUV}W!P`Or-Wrs(Xsv-Wwx*ux#V-W#V#WLk#W~-WiLrV}W!P`Or-Wrs(Xsv-Wwx*ux#h-W#h#iMX#i~-WiM`V}W!P`Or-Wrs(Xsv-Wwx*ux#m-W#m#nMu#n~-WiM|V}W!P`Or-Wrs(Xsv-Wwx*ux#d-W#d#eNc#e~-WiNjV}W!P`Or-Wrs(Xsv-Wwx*ux#X-W#X#YAd#Y~-Wi! YT!TP}W!P`Or-Wrs(Xsv-Wwx*ux~-Wm! tVaSVP}W!P`Or$nrs%^sv$nwx)ax!^$n!^!_,T!_~$no!!fV[UVP}W!P`Or$nrs%^sv$nwx)ax!^$n!^!_,T!_~$nk!#UXVP}W!P`Or$nrs%^sv$nwx)ax!^$n!^!_,T!_!`$n!`!a!#q!a~$nk!#|V!SQVP}W!P`Or$nrs%^sv$nwx)ax!^$n!^!_,T!_~$nk!$lXVP}W!P`Or$nrs%^sv$nwx)ax!^$n!^!_,T!_#P$n#P#Q!%X#Q~$nk!%bXVP}W!P`Or$nrs%^sv$nwx)ax!^$n!^!_,T!_!`$n!`!a!%}!a~$nk!&YVzQVP}W!P`Or$nrs%^sv$nwx)ax!^$n!^!_,T!_~$n",
  tokenizers: [startTag, commentContent, piContent, cdataContent, 0, 1, 2, 3, 4],
  topRules: {"Document":[0,6]},
  tokenPrec: 0
})
