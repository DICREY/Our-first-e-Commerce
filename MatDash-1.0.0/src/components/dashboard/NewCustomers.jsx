// Import styles 
import styles from "../../css/dashboard/NewCustomers.module.css";

// Component
const NewCustomers = () => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.iconBox}>
          {/* <Icon icon="solar:football-outline" height={24} /> */}
        </div>
        <p className={styles.title}>New Customers</p>
      </div>
      <div className={styles.flexBetween}>
        <p className={styles.textSm}>New goals</p>
        <p className={styles.textSm}>83%</p>
      </div>
      <div className={styles.progressBg}>
        <div
          className={styles.progressBar}
          style={{ width: "83%" }}
        ></div>
      </div>
    </div>
  );
};

export default NewCustomers;