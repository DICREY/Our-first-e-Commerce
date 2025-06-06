import styles from "./Card.module.css"

export const Card = ({ children, className = "" }) => {
  return <div className={`${styles.card} ${className}`}>{children}</div>
}

export const CardContent = ({ children, className = "" }) => {
  return <div className={`${styles.cardContent} ${className}`}>{children}</div>
}

export const CardHeader = ({ children, className = "" }) => {
  return <div className={`${styles.cardHeader} ${className}`}>{children}</div>
}

export const CardTitle = ({ children, className = "" }) => {
  return <h3 className={`${styles.cardTitle} ${className}`}>{children}</h3>
}
