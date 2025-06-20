// Librarys 
import { Link } from "react-router";

// Import styles 
import styles from "../../css/dashboard/DailyActivity.module.css";

// Component
const DailyActivity = () => {
  const ActivitySteps = [
    {
      Time: "09:46",
      action: "Payment received from John Doe of $385.90",
      color: styles.bgPrimary,
      line: styles.line,
    },
    {
      Time: "09:46",
      action: "New sale recorded",
      id: "#ML-3467",
      color: styles.bgWarning,
      line: styles.line,
    },
    {
      Time: "09:46",
      action: "Payment was made of $64.95 to Michael",
      color: styles.bgWarning,
      line: styles.line,
    },
    {
      Time: "09:46",
      action: "New sale recorded",
      id: "#ML-3467",
      color: styles.bgSecondary,
      line: styles.line,
    },
    {
      Time: "09:46",
      action: "Project meeting",
      color: styles.bgError,
      line: styles.line,
    },
    {
      Time: "09:46",
      action: "Payment received from John Doe of $385.90",
      color: styles.bgPrimary,
    },
  ];

  return (
    <section className={styles.container}>
      <h5 className={styles.title}>Daily activities</h5>
      <section className={styles.flexCol}>
        <ul className={styles.ul}>
          {ActivitySteps.map((item, index) => (
            <li className={styles.li} key={index}>
              <div className={styles.row}>
                <div className={styles.time}>{item.Time}</div>
                <div className={styles.timeline}>
                  <div className={`${styles.dot} ${item.color}`}></div>
                  {item.line && <div className={item.line}></div>}
                </div>
                <div>
                  <p className={styles.action}>{item.action}</p>
                  {item.id && (
                    <Link to="#" className={styles.link}>
                      {item.id}
                    </Link>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </section>
  );
};

export default DailyActivity;