import { useEffect, useRef, useState } from "react";
import CanvasJS from "@canvasjs/charts";
import axios from "axios";

const Profit = ({
  gross,
  net,
  equipments,
  packaging_cost,
  theme = "light",
}) => {
  const containerRef = useRef(null);
  const chartRef = useRef(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    axios
      .get("https://caferealitea.onrender.com/user", { withCredentials: true })
      .then((res) => {
        setRole(res.data.role);
      });
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      if (!chartRef.current) {
        chartRef.current = new CanvasJS.Chart(containerRef.current, {
          exportEnabled: false,
          animationEnabled: true,
          backgroundColor: "transparent",
          title: {
            text: "Profit Overview",
            fontFamily: "Inter, sans-serif",
            fontSize: 20,
            fontColor: theme === "dark" ? "#F1F5F9" : "#1F2937", // Dynamic text color
          },
          legend: {
            fontFamily: "Inter, sans-serif",
            fontSize: 14,
            fontColor: theme === "dark" ? "#F1F5F9" : "#1F2937", // Dynamic text color
            horizontalAlign: "right",
            verticalAlign: "center",
            dockInsidePlotArea: true,
            itemWidth: 120,
          },
          data: [
            {
              type: "doughnut",
              showInLegend: true,
              indexLabelFontSize: 14,
              indexLabelFontColor: theme === "dark" ? "#F1F5F9" : "#1F2937", // Dynamic text color
              indexLabelFontFamily: "Inter, sans-serif",
              indexLabel: "{name}: {y}%",
              legendText: "{name}: {y}%",
              dataPoints: [],
            },
          ],
        });
      }

      // Update chart colors based on theme
      chartRef.current.options.title.fontColor =
        theme === "dark" ? "#F1F5F9" : "#1F2937";
      chartRef.current.options.legend.fontColor =
        theme === "dark" ? "#F1F5F9" : "#1F2937";
      chartRef.current.options.data[0].indexLabelFontColor =
        theme === "dark" ? "#F1F5F9" : "#1F2937";

      // sanitize values
      const safeGross = gross > 0 ? gross : 0;
      const safeNet = net > 0 ? net : 0;
      const safeEquipments = equipments > 0 ? equipments : 0;
      const safePackaging = packaging_cost > 0 ? packaging_cost : 0;

      const total = safeGross + safeNet + safeEquipments + safePackaging;

      if (total === 0) {
        chartRef.current.options.data[0].dataPoints = [
          {
            name: "No Data",
            y: 100,
            color: theme === "dark" ? "#374151" : "#D1D5DB", // Dynamic no data color
          },
        ];
      } else {
        chartRef.current.options.data[0].dataPoints = [
          {
            name: "Gross Profit",
            y: Math.round((safeGross / total) * 100),
            color: "#964B00", // green-600
          },
          {
            name: "Net Profit",
            y: Math.round((safeNet / total) * 100),
            color: "#15803D", // green-700
          },
          {
            name: "Equipments",
            y: Math.round((safeEquipments / total) * 100),
            color: "#6366f1", // blue-600
          },
          {
            name: "Packaging Cost",
            y: Math.round((safePackaging / total) * 100),
            color: "#F59E0B", // amber-500
          },
        ];
      }

      // Responsive adjustments
      const handleResize = () => {
        if (chartRef.current) {
          if (window.innerWidth < 1024) {
            // Mobile → legend bottom, no index labels
            chartRef.current.options.legend.fontSize = 11;
            chartRef.current.options.legend.itemWidth = 90;
            chartRef.current.options.legend.horizontalAlign = "center";
            chartRef.current.options.legend.verticalAlign = "bottom";
            chartRef.current.options.legend.dockInsidePlotArea = false;
            chartRef.current.options.data[0].indexLabel = ""; // hide labels
          } else {
            chartRef.current.options.legend.dockInsidePlotArea = false;
            chartRef.current.options.data[0].indexLabel = "{name}: {y}%"; // show labels
          }
          chartRef.current.render();
        }
      };

      window.addEventListener("resize", handleResize);
      handleResize(); // run once

      chartRef.current.render();

      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }
  }, [gross, net, equipments, packaging_cost, theme]);

  const restricted = () => {
    return (
      <div className="h-fit w-full flex items-end text-xs md:text-xl text-center relative  text-red-500 rounded-md">
        <p className="whitespace-normal break-words">
          <span>This content is restricted to certain user roles!</span>
        </p>
      </div>
    );
  };

  return (
    <>
      <div
        ref={containerRef}
        className={`rounded-xl w-full p-4 md:p-6 border ${
          ["Admin", "Staff"].includes(role) ? "blur-sm " : ""
        } ${
          theme === "dark"
            ? "bg-[#243049] border-gray-700"
            : "bg-white border-slate-300"
        }`}
        style={{ height: 350 }}
      />
      {["Admin", "Staff"].includes(role) && restricted()}
    </>
  );
};

export default Profit;
