// Librarys 
import { Link } from 'react-router'

// Imports 
import BlogCards from '../../components/dashboard/BlogCards'
import DailyActivity from '../../components/dashboard/DailyActivity'
import NewCustomers from '../../components/dashboard/NewCustomers'
import ProductRevenue from '../../components/dashboard/ProductRevenue'
import TotalIncome from '../../components/dashboard/TotalIncome'
import { RevenueForecast } from '../../components/dashboard/RevenueForecast'

// Import styles 
import styles from '../../css/dashboard/Dashboard.module.css'

// Component 
const Dashboard = () => {
  return (
    <section className={styles.grid}>
      <div className={styles.lgColSpan8 + " " + styles.colSpan12}>
        <RevenueForecast />
      </div>
      <div className={styles.lgColSpan4 + " " + styles.colSpan12}>
        <div className={styles.grid + " " + styles.hFull + " " + styles.itemsStretch}>
          <div className={styles.colSpan12 + " " + styles.mb30}>
            <NewCustomers />
          </div>
          <div className={styles.colSpan12}>
            <TotalIncome />
          </div>
        </div>
      </div>
      <div className={styles.lgColSpan8 + " " + styles.colSpan12}>
        <ProductRevenue />
      </div>
      <div className={styles.lgColSpan4 + " " + styles.colSpan12 + " " + styles.flex}>
        <DailyActivity />
      </div>
      <div className={styles.colSpan12}>
        <BlogCards />
      </div>
      <div className={
        styles.flex + " " +
        styles.justifyCenter + " " +
        styles.alignMiddle + " " +
        styles.gap2 + " " +
        styles.flexWrap + " " +
        styles.colSpan12 + " " +
        styles.textCenter
      }>
        <p className={styles.textBase}>
          Design and Developed by{' '}
          <Link
            to="https://adminmart.com/"
            target="_blank"
            className={styles.pl1 + " " + styles.textPrimary + " " + styles.underline + " " + styles.decorationPrimary}
          >
            adminmart.com
          </Link>
        </p>
        <p className={styles.textBase}>
          Distributed by
          <Link
            to="https://themewagon.com/"
            target="_blank"
            className={styles.pl1 + " " + styles.textPrimary + " " + styles.underline + " " + styles.decorationPrimary}
          >
            ThemeWagon
          </Link>
        </p>
      </div>
    </section>
  )
}

export default Dashboard