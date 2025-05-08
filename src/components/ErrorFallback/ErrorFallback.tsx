import styles from "./ErrorFallback.module.css"

interface ErrorFallbackProps {
  error: string | null
}

export default function ErrorFallback({ error }: ErrorFallbackProps) {
  return (
    <div className={styles.errorContainer}>
      <div className={styles.errorIcon}>⚠️</div>
      <h2 className={styles.errorTitle}>Упс. У нас проблемы</h2>
      <p className={styles.errorMessage}>{error || "Неизвестная ошибка, попробуйте позднее."}</p>
      <button className={styles.retryButton} onClick={() => window.location.reload()}>
        Обновить
      </button>
    </div>
  )
}
