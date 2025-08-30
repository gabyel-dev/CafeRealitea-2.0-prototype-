import { useState, useEffect, useRef } from 'react';
import CanvasJSReact from '@canvasjs/react-charts';

var CanvasJSChart = CanvasJSReact.CanvasJSChart;

const Profit = () => {
  const containerRef = useRef(null);
  const chartRef = useRef(null);

  const [containerWidth, setContainerWidth] = useState(300);
  const [chartHeight, setChartHeight] = useState(300);

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        setContainerWidth(width);

        // Adjust height dynamically based on width
        const height = width < 400 ? 250 : 300;
        setChartHeight(height);
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);

  const options = {
    exportEnabled: true,
    animationEnabled: true,
    title: {
      text: "Monthly Profit",
      fontFamily: "Inter, sans-serif",
      fontSize: containerWidth < 400 ? 16 : 20,
    },
    legend: {
      fontFamily: "Inter, sans-serif",
      fontSize: containerWidth < 500 ? 10 : 14,
      horizontalAlign: "center",
      verticalAlign: "bottom",
      maxWidth: 350,
    },
    data: [{
      type: "doughnut",
      showInLegend: containerWidth > 500,
      indexLabel: "{name}: {y}%",
      indexLabelFontFamily: "Inter, sans-serif",
      indexLabelFontSize: containerWidth < 400 ? 10 : 12,
      yValueFormatString: "#,###",
      dataPoints: [
        { name: "Gross Profit", y: 5, color: "#4F46E5" },
        { name: "Net Profit", y: 31, color: "#10B981" },
        { name: "Equipments", y: 40, color: "#F59E0B" },
        { name: "Packaging Cost", y: 17, color: "#EF4444" },
      ]
    }]
  };

  return (
    <div
      ref={containerRef}
      className="bg-white rounded-xl w-full p-4 md:p-6 border border-slate-300"
    >
      <CanvasJSChart
        options={options}
        onRef={ref => chartRef.current = ref}
        containerProps={{
          width: '100%',
          height: chartHeight
        }}
      />
    </div>
  );
};

export default Profit;
