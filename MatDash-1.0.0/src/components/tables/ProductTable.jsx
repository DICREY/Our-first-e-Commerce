// Librarys 
import React, { useState } from "react";
// import { HiOutlineDotsVertical } from "react-icons/hi"
// import { Icon } from "@iconify/react"

// Imports
import product1 from "../../assets/images/products/dash-prd-1.jpg"
import product2 from "../../assets/images/products/dash-prd-2.jpg"
import product3 from "../../assets/images/products/dash-prd-3.jpg"
import product4 from "../../assets/images/products/dash-prd-4.jpg"

// Import styles
import styles from '../../css/global/ProductTable.module.css'

// Component
export const ProductTable = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const ProductTableData = [
    {
      img: product1,
      name: "iPhone 13 pro max-Pacific Blue-128GB storage",
      payment: "$180",
      paymentstatus: "Partially paid",
      process: 45,
      processcolor: "#facc15", // yellow-400
      statuscolor: "#f59e42", // orange
      statustext: "Confirmed",
    },
    {
      img: product2,
      name: "Apple MacBook Pro 13 inch-M1-8/256GB-space",
      payment: "$120",
      paymentstatus: "Full paid",
      process: 100,
      processcolor: "#22c55e", // green-500
      statuscolor: "#22c55e", // green
      statustext: "Confirmed",
    },
    {
      img: product3,
      name: "PlayStation 5 DualSense Wireless Controller",
      payment: "$120",
      paymentstatus: "Cancelled",
      process: 100,
      processcolor: "#ef4444", // red-500
      statuscolor: "#ef4444", // red
      statustext: "Cancelled",
    },
    {
      img: product4,
      name: "Amazon Basics Mesh, Mid-Back, Swivel Office",
      payment: "$120",
      paymentstatus: "Partially paid",
      process: 45,
      processcolor: "#facc15", // yellow-400
      statuscolor: "#f59e42", // orange
      statustext: "Confirmed",
    },
  ];

  const tableActionData = [
    {
      icon: "solar:add-circle-outline",
      listtitle: "Add",
    },
    {
      icon: "solar:pen-new-square-broken",
      listtitle: "Edit",
    },
    {
      icon: "solar:trash-bin-minimalistic-outline",
      listtitle: "Delete",
    },
  ];

  return (
    <section className={styles.container}>
      <h5 className={styles.title}>Table</h5>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead className={styles.thead}>
            <tr>
              <th className={styles.th}>Products</th>
              <th className={styles.th}>Payment</th>
              <th className={styles.th}>Status</th>
              <th className={styles.th}></th>
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
                    <div className={styles.productName}>{item.name}</div>
                  </div>
                </td>
                <td className={styles.td}>
                  <div>
                    <div style={{ fontWeight: 600 }}>
                      {item.payment}
                      <span style={{ color: "#374151", opacity: 0.7 }}>
                        <span style={{ margin: "0 0.25rem" }}>/</span>499
                      </span>
                    </div>
                    <div className={styles.paymentStatus}>
                      {item.paymentstatus}
                    </div>
                    <div>
                      <div className={styles.progressBarBg}>
                        <div
                          className={styles.progressBar}
                          style={{
                            width: `${item.process}%`,
                            background: item.processcolor,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </td>
                <td className={styles.td}>
                  <span
                    className={styles.badge}
                    style={{
                      background: item.statuscolor + "22",
                      color: item.statuscolor,
                    }}
                  >
                    {item.statustext}
                  </span>
                </td>
                <td className={styles.td}>
                  <div style={{ position: "relative" }}>
                    <button
                      onClick={() =>
                        setOpenIndex(openIndex === index ? null : index)
                      }
                      className={styles.menuBtn}
                      aria-label="Actions"
                    >
                      ⋮
                    </button>
                    {openIndex === index && (
                      <div className={styles.dropdown}>
                        {tableActionData.map((items, idx) => (
                          <button
                            key={idx}
                            className={styles.dropdownBtn}
                          >
                            {/* Aquí puedes poner un icono si lo deseas */}
                            <span>{items.listtitle}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};