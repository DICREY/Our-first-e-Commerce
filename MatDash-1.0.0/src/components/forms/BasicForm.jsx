// Import styles 
import styles from "../../css/forms/BasicForm.module.css"

// Component 
const BasicForm = () => {
  return (
    <section className={styles.container}>
      <h5 className={styles.title}>Form</h5>
      <section className={styles.mt6}>
        <section className={styles.grid}>
          <div className={styles.col6}>
            <div className={styles.flexCol}>
              <div>
                <label htmlFor="name" className={styles.label}>
                  Your Name
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="Your Name"
                  required
                  className={styles.input}
                />
              </div>
              <div>
                <label htmlFor="email1" className={styles.label}>
                  Your email
                </label>
                <input
                  id="email1"
                  type="email"
                  placeholder="name@matdash.com"
                  required
                  className={styles.input}
                />
              </div>
              <div>
                <label htmlFor="password1" className={styles.label}>
                  Your password
                </label>
                <input
                  id="password1"
                  type="password"
                  required
                  className={styles.input}
                />
              </div>
            </div>
          </div>
          <div className={styles.col6}>
            <div className={styles.flexCol}>
              <div>
                <label htmlFor="countries1" className={styles.label}>
                  Country
                </label>
                <select
                  id="countries1"
                  required
                  className={styles.select}
                >
                  <option>India</option>
                  <option>Canada</option>
                  <option>France</option>
                  <option>Germany</option>
                </select>
              </div>
              <div>
                <label htmlFor="countries2" className={styles.label}>
                  State
                </label>
                <select
                  id="countries2"
                  required
                  className={styles.select}
                >
                  <option>Delhi</option>
                  <option>Gujarat</option>
                  <option>Mumbai</option>
                  <option>Chennai</option>
                </select>
              </div>
              <div>
                <label htmlFor="countries3" className={styles.label}>
                  City
                </label>
                <select
                  id="countries3"
                  required
                  className={styles.select}
                >
                  <option>Rajkot</option>
                  <option>Ahemedabad</option>
                </select>
              </div>
            </div>
          </div>
          <div className={styles.buttonRow}>
            <button
              type="submit"
              className={styles.btnPrimary}
            >
              Submit
            </button>
            <button
              type="button"
              className={styles.btnError}
            >
              Cancel
            </button>
          </div>
        </section>
      </section>
    </section>
  )
}

export default BasicForm