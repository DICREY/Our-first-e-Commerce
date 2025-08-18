// Import styles
import styles from './TagInfo.module.css'

// Component 
export const TagInfo = ({
    className = styles.Card,
    borderColor = '',
    label = '',
    value,
    compareDireccion,
    compareDiferencia,
    lastLabel
}) => {
    return (
        <div className={className} style={{ borderLeftColor: borderColor }}>
            <span className={styles.Label}>{label}</span>
            <span className={styles.Value}>{value}</span>
            <div className={styles.comparison}>
                <span className={styles.comparisonValue}>
                    {compareDireccion} {compareDiferencia}
                </span>
                <span className={styles.comparisonLabel}>{lastLabel}</span>
            </div>
        </div>
    )
}