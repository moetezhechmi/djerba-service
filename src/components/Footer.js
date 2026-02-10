
import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className="container">
                <div className={styles.grid}>
                    <div className={styles.brandCol}>
                        <div className={styles.logo}>
                            <span style={{ color: '#2563eb' }}>🛠️</span> Easy Services Djerba
                        </div>
                        <p className={styles.brandDesc}>
                            La plateforme de confiance pour tous vos services à domicile. Simple, rapide et sécurisé.
                        </p>
                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                            {/* Social Placeholders */}
                            <div style={{ width: 32, height: 32, background: '#f1f5f9', borderRadius: '50%' }}></div>
                            <div style={{ width: 32, height: 32, background: '#f1f5f9', borderRadius: '50%' }}></div>
                            <div style={{ width: 32, height: 32, background: '#f1f5f9', borderRadius: '50%' }}></div>
                        </div>
                    </div>

                    <div className={styles.linksCol}>
                        <h4>Services</h4>
                        <ul>
                            <li><Link href="/request/menage">Ménage à domicile</Link></li>
                            <li><Link href="/request/plomberie">Plomberie</Link></li>
                            <li><Link href="/request/jardinage">Jardinage</Link></li>
                            <li><Link href="/request/electricite">Électricité</Link></li>
                            <li><Link href="/request/bricolage">Bricolage</Link></li>
                        </ul>
                    </div>

                    <div className={styles.linksCol}>
                        <h4>Société</h4>
                        <ul>
                            <li><Link href="/about">À propos</Link></li>
                            <li><Link href="/press">Presse</Link></li>
                        </ul>
                    </div>
                </div>

                <div className={styles.bottom}>
                    <p>© 2026 Easy Services Djerba. Tous droits réservés.</p>
                </div>
            </div>
        </footer>
    );
}
