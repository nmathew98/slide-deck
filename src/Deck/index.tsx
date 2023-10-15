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
        const VALID_KEY = horizontal ? "ArrowLeft" : "ArrowDown";

        if (event.key !== VALID_KEY) return;

        if (isOutOfBounds(currentSlide.current, slides.current)) return;

        const nextSlide = currentSlide.current - 1;

        slides.current.at(nextSlide)?.scrollIntoView();
        currentSlide.current = nextSlide;

        onScroll?.(getProgress(nextSlide, slides.current));
      },
      [horizontal, onScroll]
    );

  const onKeyUp: React.KeyboardEventHandler<HTMLDivElement> = React.useCallback(
    (event) => {
      const VALID_KEY = horizontal ? "ArrowRight" : "ArrowUp";

      if (event.key !== VALID_KEY) return;

      if (isOutOfBounds(currentSlide.current, slides.current)) return;

      const nextSlide = currentSlide.current + 1;

      slides.current.at(nextSlide)?.scrollIntoView();
      currentSlide.current = nextSlide;

      onScroll?.(getProgress(nextSlide, slides.current));
    },
    [horizontal, onScroll]
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
    if (isOutOfBounds(startAt, slides.current)) return;

    slides.current.at(startAt)?.scrollIntoView();
  }, [startAt]);

  React.useEffect(
    () =>
      scroll(({ x, y }) => {
        if (horizontal) onScroll?.(x.progress);
        else onScroll?.(y.progress);
      }),
    [horizontal, onScroll]
  );

  React.useEffect(() => {
    deckRef.current?.focus();
  }, []);

  const classNames = [
    horizontal ? "w-auto h-screen" : "h-auto w-screen",
    horizontal ? "snap-x" : "snap-y",
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
      onKeyUp={onKeyUp}
    >
      {React.Children.map(children, (child, idx) => {
        if (child?.type !== Slide) return null;

        if (idx === 0) slides.current = [];

        return React.cloneElement(child, {
          ref: (instance: HTMLDivElement | null) => {
            if (!instance) return;

            slides.current.push(instance);
          },
        });
      })}
    </div>
  );
};

type HTMLElementTagName = keyof HTMLElementTagNameMap;

const isOutOfBounds = (idx: number, slides: HTMLDivElement[]) =>
  slides.length > 0 && (idx <= 0 || idx >= slides.length - 1);

const getProgress = (idx: number, slides: HTMLDivElement[]) =>
  (idx + 1) / slides.length;
