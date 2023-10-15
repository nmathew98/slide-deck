import { type InViewOptions, type ViewChangeHandler, inView } from "motion";
import React from "react";

export interface SlideProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  onEnterViewport?: Parameters<typeof inView>[1];
  onExitViewport?: ViewChangeHandler;
  options?: InViewOptions;
}

export const Slide = ({
  onEnterViewport,
  onExitViewport,
  options = { amount: 0.5 },
  ...rest
}: SlideProps) => {
  const ref = React.useRef<null | HTMLDivElement>(null);

  React.useLayoutEffect(() => {
    if (ref.current) {
      const onStart = (entry: IntersectionObserverEntry) => {
        onEnterViewport?.(entry);

        return onExitViewport;
      };

      inView(ref.current, onStart, options);
    }
  }, [onEnterViewport, onExitViewport, options]);

  return (
    <div
      {...rest}
      ref={ref}
      style={{
        height: "100vh",
        width: "100vw",
        scrollSnapAlign: "start",
        ...rest.style,
      }}
    />
  );
};
