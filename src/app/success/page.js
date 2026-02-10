
import Link from 'next/link';
import styles from './success.module.css';

export default function SuccessPage() {
    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <div className={styles.icon}>✅</div>
                <h1>Demande envoyée !</h1>
                <p>Votre demande a été reçue par notre équipe.</p>
                <p>Un expert sera assigné sous peu.</p>
                <Link href="/" className="btn-primary" style={{ marginTop: '2rem', display: 'inline-block' }}>
                    Retour à l'accueil
                </Link>
            </div>
        </div>
    );
}
