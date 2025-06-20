// Librarys 
import Chart from "react-apexcharts"

// Import styles 
import styles from "../../css/dashboard/TotalIncome.module.css"

// Component 
const TotalIncome = () => {
  const ChartData = {
    series: [
      {
        name: "monthly earnings",
        color: "var(--color-error)",
        data: [30, 25, 35, 20, 30, 40],
      },
    ],
    chart: {
      id: "total-income",
      type: "area",
      height: 60,
      sparkline: {
        enabled: true,
      },
      group: "sparklines",
      fontFamily: "inherit",
      foreColor: "#adb0bb",
    },
    stroke: {
      curve: "smooth",
      width: 2,
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 0,
        inverseColors: false,
        opacityFrom: 0,
        opacityTo: 0,
        stops: [20, 180],
      },
    },
    markers: {
      size: 0,
    },
    tooltip: {
      theme: "dark",
      fixed: {
        enabled: true,
        position: "right",
      },
      x: {
        show: false,
      },
    },
  }

  return (
    <section className={styles.container}>
      <div className={styles.header}>
        <div className={styles.iconBox}>
          {/* <Icon icon="solar:box-linear" height={24} /> */}
        </div>
        <p className={styles.title}>Total Income</p>
      </div>
      <div className={styles.flex}>
        <div className={styles.flex1}>
          <p className={styles.amount}>$680</p>
          <span className={styles.badge}>+18%</span>
          <p className={styles.textSuccess}></p>
        </div>
        <div className={`${styles.chartCol} ${styles.flex1}`}>
          <Chart
            options={ChartData}
            series={ChartData.series}
            type="area"
            height="60px"
            width="100%"
          />
        </div>
      </div>
    </section>
  )
}

export default TotalIncome