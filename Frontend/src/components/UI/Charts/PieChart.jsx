import { useEffect, useRef } from "react";
import CanvasJS from "@canvasjs/charts";

const Profit = () => {
  const containerRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      const chart = new CanvasJS.Chart(containerRef.current, {
        exportEnabled: true,
        animationEnabled: true,
        title: {
          text: "Monthly Profit",
          fontFamily: "Inter, sans-serif",
          fontSize: 20,
        },
        legend: {
          fontFamily: "Inter, sans-serif",
          fontSize: 14,
          horizontalAlign: "center",
          verticalAlign: "bottom",
          maxWidth: 350,
        },
        data: [
          {
            type: "doughnut",
            indexLabel: "{name}: {y}%",
            dataPoints: [
              { name: "Gross Profit", y: 5, color: "#4F46E5" },
              { name: "Net Profit", y: 31, color: "#10B981" },
              { name: "Equipments", y: 40, color: "#F59E0B" },
              { name: "Packaging Cost", y: 17, color: "#EF4444" },
            ],
          },
        ],
      });

      chart.render();
      chartRef.current = chart;
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className="bg-white rounded-xl w-full p-4 md:p-6 border border-slate-300"
      style={{ height: 300 }}
    />
  );
};

export default Profit;
