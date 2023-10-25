import React from "react";
import {
  type InViewOptions,
  type ViewChangeHandler as MotionViewChangeHandler,
  inView,
} from "motion";
import styles from "./styles.module.css";

export interface SlideProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  onEnterViewport?: ViewChangeHandler;
  onExitViewport?: ViewChangeHandler;
  options?: InViewOptions;
}

export interface SlideHandles extends Pick<HTMLDivElement, "scrollIntoView"> {
  instance: null | HTMLDivElement;
}

const DEFAULT_OPTIONS: InViewOptions = {
  amount: 0.5,
};

export const Slide = React.forwardRef<SlideHandles, SlideProps>(
  (
    {
      onEnterViewport,
      onExitViewport,
      options = DEFAULT_OPTIONS,
      className,
      ...rest
    },
    ref
  ) => {
    const slideRef = React.useRef<null | HTMLDivElement>(null);

    const createHandles = (): SlideHandles => ({
      instance: slideRef.current,
      scrollIntoView: (arg?: boolean | ScrollIntoViewOptions) =>
        (slideRef.current as HTMLDivElement).scrollIntoView(arg),
    });

    React.useImperativeHandle(ref, createHandles, []);

    React.useEffect(() => {
      if (!slideRef.current) return;

      const onStart: MotionViewChangeHandler = (entry) => {
        onEnterViewport?.({
          entry,
          ref: slideRef.current,
        });

        return (entry: IntersectionObserverEntry) =>
          onExitViewport?.({ entry, ref: slideRef.current });
      };

      return inView(slideRef.current, onStart, options);
    }, [onEnterViewport, onExitViewport, options]);

    const classNames = [
      styles.hScreen,
      styles.wScreen,
      styles.snapStart,
      className ?? "",
    ]
      .filter(Boolean)
      .join(" ");

    return <div {...rest} ref={slideRef} className={classNames} />;
  }
);

type ViewChangeHandler = (event: SlideViewportEvent) => void;

interface SlideViewportEvent {
  entry: IntersectionObserverEntry;
  ref: HTMLDivElement | null;
}
