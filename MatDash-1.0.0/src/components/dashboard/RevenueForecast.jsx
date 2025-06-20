// Librarys 
import React, { useState } from "react";
import Chart from "react-apexcharts";

// Import styles 
import styles from "../../css/dashboard/RevenueForecast.module.css";

// Component 
const RevenueForecast = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("This Week");

  const getChartData = (period) => {
    switch (period) {
      case "April 2024":
        return {
          series: [
            { name: "2024", data: [2.5, 3.0, 2.8, 3.2, 2.9, 3.1, 2.7, 2.8, 3.0] },
            { name: "2023", data: [-1.5, -1.2, -1.8, -2.0, -1.7, -1.9, -2.1, -1.6, -1.8] },
          ],
        };
      case "May 2024":
        return {
          series: [
            { name: "2024", data: [2.7, 2.9, 2.6, 3.1, 3.0, 2.8, 2.9, 3.2, 3.1] },
            { name: "2023", data: [-1.4, -1.3, -1.9, -1.7, -1.8, -2.0, -1.9, -1.8, -2.1] },
          ],
        };
      case "June 2024":
        return {
          series: [
            { name: "2024", data: [3.0, 3.2, 3.1, 3.5, 3.4, 3.3, 3.2, 3.4, 3.6] },
            { name: "2023", data: [-1.6, -1.7, -1.8, -2.0, -1.9, -1.8, -1.7, -1.9, -2.0] },
          ],
        };
      case "This Week":
      default:
        return {
          series: [
            { name: "2024", data: [1.2, 2.7, 1.0, 3.6, 2.1, 2.7, 2.2, 1.3, 2.5] },
            { name: "2023", data: [-2.8, -1.1, -2.5, -1.5, -2.3, -1.9, -1.0, -2.1, -1.3] },
          ],
        };
    }
  };

  const optionsBarChart = {
    chart: {
      offsetX: 0,
      offsetY: 10,
      stacked: true,
      animations: { speed: 500 },
      toolbar: { show: false },
    },
    colors: ["var(--color-primary)", "var(--color-error)"],
    dataLabels: { enabled: false },
    grid: {
      show: true,
      borderColor: "#90A4AE50",
      xaxis: { lines: { show: true } },
      yaxis: { lines: { show: true } },
    },
    stroke: { curve: "smooth", width: 2 },
    plotOptions: {
      bar: {
        horizontal: false,
        barHeight: "60%",
        columnWidth: "15%",
        borderRadius: 5,
        borderRadiusApplication: "end",
        borderRadiusWhenStacked: "all",
      },
    },
    xaxis: {
      categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"],
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: { min: -4, max: 4, tickAmount: 4 },
    legend: { show: false },
    tooltip: { theme: "dark" },
  };

  const barChartData = getChartData(selectedPeriod);

  const handleSelectChange = (event) => {
    setSelectedPeriod(event.target.value);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h5 className={styles.title}>Revenue Forecast</h5>
        <select
          id="periods"
          className={styles.select}
          value={selectedPeriod}
          onChange={handleSelectChange}
          required
        >
          <option value="This Week">This Week</option>
          <option value="April 2024">April 2024</option>
          <option value="May 2024">May 2024</option>
          <option value="June 2024">June 2024</option>
        </select>
      </div>
      <div className={styles.chartWrapper}>
        <Chart
          options={optionsBarChart}
          series={barChartData.series}
          type="bar"
          height="315px"
          width="100%"
        />
      </div>
    </div>
  );
};

export { RevenueForecast };