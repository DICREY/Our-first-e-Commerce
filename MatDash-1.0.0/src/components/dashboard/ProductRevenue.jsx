// Librarys 
import SimpleBar from "simplebar-react"

// Imports 
import product1 from "../../assets/images/products/dash-prd-1.jpg"
import product2 from "../../assets/images/products/dash-prd-2.jpg"
import product3 from "../../assets/images/products/dash-prd-3.jpg"
import product4 from "../../assets/images/products/dash-prd-4.jpg"

// Import styles 
import styles from "../../css/dashboard/ProductRevenue.module.css"

const ProductRevenue = () => {
  const ProductTableData = [
    {
      img: product1,
      name: "Minecraf App",
      seller: "Jason Roy",
      process: "73.2%",
      statuscolor: styles.textSuccess,
      statusbg: styles.bgLightSuccess,
      statustext: "Low",
    },
    {
      img: product2,
      name: "Web App Project",
      seller: "Mathew Flintoff",
      process: "73.2%",
      statuscolor: styles.textWarning,
      statusbg: styles.bgLightWarning,
      statustext: "Medium",
    },
    {
      img: product3,
      name: "Modernize Dashboard",
      seller: "Anil Kumar",
      process: "73.2%",
      statuscolor: styles.textSecondary,
      statusbg: styles.bgLightSecondary,
      statustext: "Very High",
    },
    {
      img: product4,
      name: "Dashboard Co",
      seller: "George Cruize",
      process: "73.2%",
      statuscolor: styles.textError,
      statusbg: styles.bgLightError,
      statustext: "High",
    },
  ]

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h5 className={styles.title}>Revenue by Product</h5>
      </div>
      <SimpleBar className={styles.scroll}>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead className={styles.thead}>
              <tr>
                <th className={styles.th}>Assigned</th>
                <th className={styles.th}>Progress</th>
                <th className={styles.th}>Priority</th>
                <th className={styles.th}>Budget</th>
              </tr>
            </thead>
            <tbody>
              {ProductTableData.map((item, index) => (
                <tr key={index}>
                  <td className={styles.td}>
                    <div className={styles.productCell}>
                      <img
                        src={item.img}
                        alt="icon"
                        className={styles.productImg}
                      />
                      <div>
                        <h6 className={styles.productName}>{item.name}</h6>
                        <p className={styles.seller}>{item.seller}</p>
                      </div>
                    </div>
                  </td>
                  <td className={styles.td}>
                    <div className={styles.progress}>{item.process}</div>
                  </td>
                  <td className={styles.td}>
                    <span className={`${styles.badge} ${item.statusbg} ${item.statuscolor}`}>
                      {item.statustext}
                    </span>
                  </td>
                  <td className={styles.td}>
                    <span className={styles.budget}>$3.5k</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SimpleBar>
    </div>
  )
}

export default ProductRevenue