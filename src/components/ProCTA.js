import Link from 'next/link';
import styles from './ProCTA.module.css';

export default function ProCTA() {
    return (
        <section className={styles.section}>
            <div className="container">
                <div className={styles.banner}>
                    <div className={styles.content}>
                        <h2 className={styles.title}>
                            Prêt à simplifier votre quotidien ?
                        </h2>
                        <p className={styles.text}>
                            Rejoignez des milliers d'utilisateurs qui ne perdent plus de temps à chercher des professionnels.
                        </p>
                        <div className={styles.actions}>
                            <Link href="/services" className={styles.btnPrimary}>Réserver un service</Link>
                            <Link href="/devenir-pro" className={styles.btnSecondary}>Devenir partenaire</Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
