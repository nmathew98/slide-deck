import React from "react";
import { Slide, type SlideProps } from "../Slide";
import { scroll } from "motion";
import "./styles.css";

export interface DeckProps
  extends Omit<
    React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLDivElement>,
      HTMLDivElement
    >,
    "onScroll"
  > {
  children: React.ReactElement<SlideProps> | React.ReactElement<SlideProps>[];
  startAt?: number;
  horizontal?: boolean;
  disableScrollbarsFor?: false | (HTMLElementTagName | string)[];
  onScroll?: (progress: number) => void;
}

const DEFAULT_SELECTORS: HTMLElementTagName[] = ["html", "body"];

export const Deck: React.FC<DeckProps> = ({
  horizontal,
  disableScrollbarsFor = DEFAULT_SELECTORS,
  startAt = 0,
  children,
  onScroll,
  className,
  ...rest
}) => {
  const deckRef = React.useRef<null | HTMLDivElement>(null);
  const slides = React.useRef<HTMLDivElement[]>([]);
  const currentSlide = React.useRef<number>(startAt);

  const onKeyDown: React.KeyboardEventHandler<HTMLDivElement> =
    React.useCallback(
      (event) => {
        const isKeyValid = (key: string) =>
          horizontal
            ? key === "ArrowLeft" || key === "ArrowRight"
            : key === "ArrowUp" || key === "ArrowDown";

        if (!isKeyValid(event.key)) return;

        event.preventDefault();

        const increment =
          event.key === "ArrowLeft" || event.key === "ArrowUp" ? -1 : 1;

        const nextSlide = currentSlide.current + increment;

        if (!isWithinBounds(nextSlide, slides.current)) return;

        slides.current.at(nextSlide)?.scrollIntoView({
          behavior: "smooth",
        });
        currentSlide.current = nextSlide;
      },
      [horizontal]
    );

  React.useLayoutEffect(() => {
    if (!disableScrollbarsFor) return;

    disableScrollbarsFor
      .flatMap(
        (query) => [...document.querySelectorAll(query)] as HTMLElement[]
      )
      .forEach((element) => {
        if (!element.classList.contains("overflow-hidden"))
          element.classList.add("overflow-hidden");
      });
  }, [disableScrollbarsFor]);

  React.useEffect(() => {
    if (!isWithinBounds(startAt, slides.current)) return;

    slides.current.at(startAt)?.scrollIntoView({
      behavior: "instant",
    });
  }, [startAt]);

  React.useEffect(
    () =>
      scroll(({ x, y }) => {
        const progress = horizontal ? x.progress : y.progress;

        onScroll?.(progress);
      }),
    [horizontal, onScroll]
  );

  React.useEffect(() => {
    deckRef.current?.focus();
  }, []);

  const classNames = [
    horizontal ? "snap-x" : "snap-y",
    "w-screen h-screen",
    "overflow-scroll",
    "smooth-scroll",
    className ?? "",
  ].filter(Boolean);

  return (
    <div
      {...rest}
      ref={deckRef}
      tabIndex={0}
      className={classNames.join(" ")}
      onKeyDown={onKeyDown}
    >
      {React.Children.map(children, (child, idx) => {
        if (child?.type !== Slide) return null;

        // NOTE: While developing, the render function gets called twice
        // so there are 6 elements in `slides`, relying on the fact that
        // the elements are rendered in order to reset the array between re-renders
        return React.cloneElement(child, {
          ref: (instance: HTMLDivElement | null) => {
            if (!instance) return;

            if (idx === 0) slides.current = [];

            slides.current.push(instance);
          },
        });
      })}
    </div>
  );
};

type HTMLElementTagName = keyof HTMLElementTagNameMap;

const isWithinBounds = (idx: number, slides: HTMLDivElement[]) =>
  slides.length > 0 && idx >= 0 && idx <= slides.length - 1;
