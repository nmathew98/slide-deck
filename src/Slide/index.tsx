import React from "react";
import { type InViewOptions, type ViewChangeHandler, inView } from "motion";

export interface SlideProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  onEnterViewport?: ViewChangeHandler;
  onExitViewport?: ViewChangeHandler;
  options?: InViewOptions;
}

const DEFAULT_OPTIONS: InViewOptions = {
  amount: 0.5,
};

export const Slide: React.FC<SlideProps> = ({
  onEnterViewport,
  onExitViewport,
  options = DEFAULT_OPTIONS,
  style,
  ...rest
}) => {
  const ref = React.useRef<null | HTMLDivElement>(null);

  React.useLayoutEffect(() => {
    if (!ref.current) return;

    const onStart = (entry: IntersectionObserverEntry) => {
      onEnterViewport?.(entry);

      return onExitViewport;
    };

    return inView(ref.current, onStart, options);
  }, [onEnterViewport, onExitViewport, options]);

  return (
    <div
      {...rest}
      ref={ref}
      style={{
        height: "100vh",
        width: "100vw",
        scrollSnapAlign: "start",
        ...style,
      }}
    />
  );
};
