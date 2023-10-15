import "./styles.css";

export type DeckProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

export const Deck = ({ style, ...rest }: DeckProps) => (
  <div
    {...rest}
    style={{
      ...style,
      scrollSnapType: "y mandatory",
      overflow: "scroll",
      height: "100vh",
    }}
  />
);
