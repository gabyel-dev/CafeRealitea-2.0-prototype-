declare module "@canvasjs/charts" {
  import * as React from "react";

  export interface CanvasJSChartProps {
    options: any;
    onRef?: (ref: any) => void;
    containerProps?: React.HTMLAttributes<HTMLDivElement>;
    className?: string;
    style?: React.CSSProperties;
  }

  export class CanvasJSChart extends React.Component<CanvasJSChartProps> {}

  const CanvasJSReact: {
    CanvasJSChart: typeof CanvasJSChart;
    CanvasJS: any;
  };

  export = CanvasJSReact;
}
