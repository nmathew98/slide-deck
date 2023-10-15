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

  const onKeyDown: React.KeyboardEventHandler<HTMLDivElement> =
    React.useCallback((event) => {
      if (event.key !== "ArrowDown") return;

      if (
        currentSlide.current <= 0 ||
        currentSlide.current >= slides.current.length - 1
      )
        return;

      const nextSlide = currentSlide.current - 1;

      slides.current.at(nextSlide)?.scrollIntoView();
      currentSlide.current = nextSlide;
    }, []);

  const onKeyUp: React.KeyboardEventHandler<HTMLDivElement> = React.useCallback(
    (event) => {
      if (event.key !== "ArrowUp") return;

      if (
        currentSlide.current <= 0 ||
        currentSlide.current >= slides.current.length - 1
      )
        return;

      const nextSlide = currentSlide.current + 1;

      slides.current.at(nextSlide)?.scrollIntoView();
      currentSlide.current = nextSlide;
    },
    []
  );

  React.useLayoutEffect(() => {
    if (!disableScrollbarsFor) return;

    disableScrollbarsFor
      .map(document.querySelectorAll)
      .flatMap((collection) => [...collection] as HTMLElement[])
      .forEach((element) => {
        element.style.overflow = "hidden";
      });
  }, [disableScrollbarsFor]);

  React.useLayoutEffect(() => {
    if (startAt <= 0 || startAt >= slides.current.length - 1) return;

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
