import type {
    FlatDastElement,
    LiProps,
    PProps,
    OlProps,
    UlProps,
    MathProps,
    TextProps,
    XrefProps,
    TitleProps,
    DivisionProps,
    BooleanProps,
    TextInputProps,
    DocumentProps,
} from "@doenet/doenetml-worker-rust";

export type FlatDastElementWithProps =
    | (FlatDastElement & {
          name: "li";
          data: { props: LiProps };
      })
    | (FlatDastElement & { name: "p"; data: { props: PProps } })
    | (FlatDastElement & { name: "ol"; data: { props: OlProps } })
    | (FlatDastElement & { name: "ul"; data: { props: UlProps } })
    | (FlatDastElement & { name: "math"; data: { props: MathProps } })
    | (FlatDastElement & { name: "text"; data: { props: TextProps } })
    | (FlatDastElement & { name: "xref"; data: { props: XrefProps } })
    | (FlatDastElement & { name: "title"; data: { props: TitleProps } })
    | (FlatDastElement & { name: "division"; data: { props: DivisionProps } })
    | (FlatDastElement & { name: "boolean"; data: { props: BooleanProps } })
    | (FlatDastElement & { name: "textInput"; data: { props: TextInputProps } })
    | (FlatDastElement & { name: "document"; data: { props: DocumentProps } });
