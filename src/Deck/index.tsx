import React from "react";
import { Slide, type SlideProps } from "../Slide";

export interface DeckProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  startAt?: number;
  children: React.ReactElement<SlideProps> | React.ReactElement<SlideProps>[];
  horizontal?: boolean;
  disableScrollbarsFor?: false | (HTMLElementTagName | string)[];
}

const DEFAULT_SELECTORS: HTMLElementTagName[] = ["html", "body"];

export const Deck: React.FC<DeckProps> = ({
  style,
  horizontal,
  disableScrollbarsFor = DEFAULT_SELECTORS,
  startAt = 0,
  children,
  ...rest
}) => {
  const slides = React.useRef<HTMLDivElement[]>([]);
  const currentSlide = React.useRef<number>(startAt);

  const isOutOfBounds = (idx: number) =>
    slides.current.length > 0 && (idx <= 0 || idx >= slides.current.length - 1);

  const onKeyDown: React.KeyboardEventHandler<HTMLDivElement> =
    React.useCallback(
      (event) => {
        const VALID_KEY = horizontal ? "ArrowLeft" : "ArrowDown";

        if (event.key !== VALID_KEY) return;

        if (isOutOfBounds(currentSlide.current)) return;

        const nextSlide = currentSlide.current - 1;

        slides.current.at(nextSlide)?.scrollIntoView();
        currentSlide.current = nextSlide;
      },
      [horizontal]
    );

  const onKeyUp: React.KeyboardEventHandler<HTMLDivElement> = React.useCallback(
    (event) => {
      const VALID_KEY = horizontal ? "ArrowRight" : "ArrowUp";

      if (event.key !== VALID_KEY) return;

      if (isOutOfBounds(currentSlide.current)) return;

      const nextSlide = currentSlide.current + 1;

      slides.current.at(nextSlide)?.scrollIntoView();
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
        element.style.overflow = "hidden";
      });
  }, [disableScrollbarsFor]);

  React.useLayoutEffect(() => {
    if (isOutOfBounds(startAt)) return;

    slides.current.at(startAt)?.scrollIntoView();
  }, [startAt]);

  return (
    <div
      {...rest}
      style={{
        height: "100vh",
        ...style,
        scrollSnapType: horizontal ? "x mandatory" : "y mandatory",
        overflow: "scroll",
        scrollBehavior: "smooth",
      }}
      onKeyDown={onKeyDown}
      onKeyUp={onKeyUp}
    >
      {React.Children.map(children, (child, idx) => {
        if (child?.type !== Slide) {
          return null;
        }

        if (idx === 0) {
          slides.current = [];
        }

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
