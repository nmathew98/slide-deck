import React from "react";

export interface DeckProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  horizontal?: boolean;
  disableScrollbarsFor?: false | (HTMLElementTagName | string)[];
}

const DEFAULT_SELECTORS: HTMLElementTagName[] = ["html", "body"];

export const Deck: React.FC<DeckProps> = ({
  style,
  horizontal,
  disableScrollbarsFor = DEFAULT_SELECTORS,
  ...rest
}) => {
  React.useLayoutEffect(() => {
    if (!disableScrollbarsFor) return;

    disableScrollbarsFor
      .map(document.querySelectorAll)
      .flatMap((collection) => [...collection] as HTMLElement[])
      .forEach((element) => {
        element.style.overflow = "hidden";
      });
  }, [disableScrollbarsFor]);

  return (
    <div
      {...rest}
      style={{
        height: "100vh",
        ...style,
        scrollSnapType: horizontal ? "x mandatory" : "y mandatory",
        overflow: "scroll",
      }}
    />
  );
};

type HTMLElementTagName = keyof HTMLElementTagNameMap;
