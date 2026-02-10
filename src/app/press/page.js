
import Link from 'next/link';
import styles from './press.module.css';

export default function PressPage() {
    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <div className={styles.icon}>🏗️</div>
                <h1 className={styles.title}>Espace Presse</h1>
                <p className={styles.subtitle}>
                    Cette page est actuellement <strong>en cours de développement</strong>.
                </p>
                <p className={styles.desc}>
                    Nous préparons un espace dédié aux journalistes et partenaires pour partager l'actualité de <strong>Dipanini</strong>.
                </p>
                <div className={styles.badge}>Bientôt disponible</div>
                <Link href="/" className={styles.btnHome}>
                    Retour à l'accueil
                </Link>
            </div>
        </div>
    );
}
