import styles from './LoaderFallback.module.css';

const LoadingFallback = () => {
	return (
		<div className={styles.loadingContainer}>
			<div className={styles.spinner}></div>
			<p className={styles.loadingText}>Определяю погоду, это недолго...</p>
		</div>
	);
};

export default LoadingFallback;
