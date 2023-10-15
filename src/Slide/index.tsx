import React from "react";
import { type InViewOptions, type ViewChangeHandler, inView } from "motion";
import "./styles.css";

export interface SlideProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  onEnterViewport?: ViewChangeHandler;
  onExitViewport?: ViewChangeHandler;
  options?: InViewOptions;
}

export type SlideHandles = Pick<HTMLDivElement, "scrollIntoView">;

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
      scrollIntoView: (slideRef.current as HTMLDivElement).scrollIntoView,
    });

    React.useImperativeHandle(ref, createHandles, []);

    React.useEffect(() => {
      if (!slideRef.current) return;

      const onStart: ViewChangeHandler = (entry) => {
        onEnterViewport?.(entry);

        return onExitViewport;
      };

      return inView(slideRef.current, onStart, options);
    }, [onEnterViewport, onExitViewport, options]);

    const classNames = [
      "h-screen",
      "w-screen",
      "snap-start",
      className ?? "",
    ].filter(Boolean);

    return <div {...rest} ref={slideRef} className={classNames.join(" ")} />;
  }
);
