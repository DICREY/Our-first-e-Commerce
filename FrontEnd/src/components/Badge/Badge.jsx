import styles from "./Badge.module.css"

const Badge = ({ children, variant = "primary", className = "" }) => {
  const badgeClasses = [styles.badge, styles[variant], className].filter(Boolean).join(" ")

  return <span className={badgeClasses}>{children}</span>
}

export default Badge
